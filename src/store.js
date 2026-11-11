// Tiny JSON-file backed datastore with synchronous, atomic writes.
// Zero external dependencies. Fine for a single-process app.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Data folder: override with DATA_DIR when deploying (e.g. a mounted volume).
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const EMPTY = {
  users: [],
  sessions: {},
  notifications: [],
  gameScores: {},
  settings: { platformName: 'OctoLearn', allowSelfRegistration: true },
  integrity: { hmackey: null }
};

let db = null;

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function load() {
  ensureDir();
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      db = Object.assign(structuredClone(EMPTY), JSON.parse(raw));
    } catch (err) {
      console.error('[store] Could not read db.json, starting fresh:', err.message);
      db = structuredClone(EMPTY);
    }
  } else {
    db = structuredClone(EMPTY);
  }
  if (!db.integrity.hmackey) {
    db.integrity.hmackey = crypto.randomBytes(32).toString('hex');
    save();
  }
  return db;
}

export function save() {
  ensureDir();
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DB_FILE);
}

export function get() {
  if (!db) load();
  return db;
}

/* ------------------------------ password hashing ------------------------------ */

export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt, hash };
}

export function verifyPassword(password, salt, hash) {
  const candidate = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  if (candidate.length !== expected.length) return false;
  return crypto.timingSafeEqual(candidate, expected);
}

/* ---------------------------------- users ---------------------------------- */

let counter = 0;
export function newId(prefix = 'u') {
  return `${prefix}_${Date.now().toString(36)}_${(counter++).toString(36)}_${crypto.randomBytes(3).toString('hex')}`;
}

export function emptyStats() {
  return { xp: 0, lessonsCompleted: 0, perfectLessons: 0, streak: 0, lastLessonDate: null, completed: [] };
}

export function findUserByEmail(email) {
  const e = String(email || '').trim().toLowerCase();
  return get().users.find((u) => u.email === e) || null;
}

export function findUserById(id) {
  return get().users.find((u) => u.id === id) || null;
}

export function createUser({ name, email, password, role = 'learner' }) {
  const { salt, hash } = hashPassword(password);
  const user = {
    id: newId('u'),
    name: String(name || '').trim(),
    email: String(email || '').trim().toLowerCase(),
    role,
    salt,
    hash,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    stats: emptyStats(),
    unlocked: ['octopus']
  };
  get().users.push(user);
  save();
  return user;
}

/* --------------------------------- sessions -------------------------------- */

export function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  get().sessions[token] = { userId, createdAt: Date.now() };
  save();
  return token;
}

export function getSession(token) {
  if (!token) return null;
  return get().sessions[token] || null;
}

export function destroySession(token) {
  if (!token) return;
  delete get().sessions[token];
  save();
}

/* ------------------------------- notifications ------------------------------ */
// The owner receives one entry whenever somebody joins or signs in.

export function addNotification({ type, userId, name, email }) {
  const dbRef = get();
  dbRef.notifications.unshift({
    id: newId('n'),
    type,                        // 'join' | 'login'
    userId,
    name,
    email,
    read: false,
    at: new Date().toISOString()
  });
  if (dbRef.notifications.length > 300) dbRef.notifications.length = 300;
  save();
}

export function listNotifications(limit = 60) {
  return get().notifications.slice(0, limit);
}

export function unreadNotifications() {
  return get().notifications.filter((n) => !n.read).length;
}

export function markNotificationsRead() {
  get().notifications.forEach((n) => { n.read = true; });
  save();
}

/* --------------------------------- game scores ------------------------------ */

export function setGameScore(userId, game, score) {
  const dbRef = get();
  const key = `${userId}::${game}`;
  const prev = dbRef.gameScores[key];
  const improved = !prev || score > prev.score;
  if (improved) {
    dbRef.gameScores[key] = { userId, game, score, at: new Date().toISOString() };
    save();
  }
  return { best: improved ? score : prev.score, improved };
}

export function gameRanking(game) {
  const dbRef = get();
  return Object.values(dbRef.gameScores)
    .filter((s) => s.game === game)
    .sort((a, b) => b.score - a.score || new Date(a.at) - new Date(b.at))
    .map((s, i) => {
      const u = findUserById(s.userId);
      return { rank: i + 1, userId: s.userId, name: u ? u.name : 'Unknown', score: s.score, at: s.at };
    });
}

/* ---------------------------------- settings -------------------------------- */

export function getSettings() {
  const s = get().settings;
  return {
    platformName: s.platformName || 'OctoLearn',
    allowSelfRegistration: s.allowSelfRegistration !== false
  };
}

export function updateSettings(patch) {
  Object.assign(get().settings, patch);
  save();
  return getSettings();
}

export function userGameBests(userId) {
  const dbRef = get();
  const out = {};
  Object.values(dbRef.gameScores).forEach((s) => {
    if (s.userId === userId) out[s.game] = s.score;
  });
  return out;
}
