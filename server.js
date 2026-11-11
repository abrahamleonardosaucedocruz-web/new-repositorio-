// OctoLearn server: zero-dependency Node HTTP server + JSON API + static files.

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import * as store from './src/store.js';
import { LEVELS, LESSONS, ANIMALS, BADGES, GAMES, WORD_BANK, getLesson, publicLessons } from './src/content.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, 'public');
const AUDIO_DIR = path.join(PUBLIC_DIR, 'audio');
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const OWNER_EMAIL = (process.env.OWNER_EMAIL || 'abrahamleonardosaucedocruz@gmail.com').toLowerCase();
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || 'octo1234';
const OWNER_NAME = process.env.OWNER_NAME || 'Abraham';

store.load();
ensureOwnerAccount();
const AUDIO = loadAudioMap();

/* --------------------------------- helpers --------------------------------- */

function ensureOwnerAccount() {
  // 1. Owner with the configured email already exists -> nothing to do.
  if (store.findUserByEmail(OWNER_EMAIL)) return;

  // 2. A legacy owner exists (different email) -> migrate it to the configured one.
  const legacy = store.get().users.find((u) => u.role === 'owner');
  if (legacy) {
    legacy.email = OWNER_EMAIL;
    legacy.name = OWNER_NAME;
    store.save();
    console.log(`[OctoLearn] Owner account migrated to ${OWNER_EMAIL}`);
    return;
  }

  // 3. Fresh install -> create the owner account.
  store.createUser({ name: OWNER_NAME, email: OWNER_EMAIL, password: OWNER_PASSWORD, role: 'owner' });
  console.log('[OctoLearn] Owner account is ready.');
}

// Loads public/audio/index.json (text -> mp3 file) produced by scripts/gen-audio.mjs.
function loadAudioMap() {
  try {
    const raw = fs.readFileSync(path.join(AUDIO_DIR, 'index.json'), 'utf8');
    return JSON.parse(raw);
  } catch {
    console.warn('[OctoLearn] No audio index found — run "node scripts/gen-audio.mjs". Falling back to browser speech.');
    return {};
  }
}

function audioUrlFor(text) {
  const file = AUDIO[text];
  return file ? `/audio/${file}` : null;
}

function levelForUser(stats) {
  const completed = stats.lessonsCompleted;
  if (completed >= 8) return LEVELS[2];
  if (completed >= 4) return LEVELS[1];
  return LEVELS[0];
}

function earnedBadges(stats) {
  return BADGES.filter((b) => {
    try { return b.test(stats); } catch { return false; }
  }).map((b) => ({ id: b.id, name: b.name, emoji: b.emoji, desc: b.desc }));
}

function publicAnimal(a, unlockedIds) {
  return {
    id: a.id,
    name: a.name,
    emoji: a.emoji,
    fact: a.fact,
    unlockAt: a.unlockAt,
    unlocked: unlockedIds.includes(a.id)
  };
}

// A safe, public representation of a user (never leaks salt/hash).
function publicUser(user, { includeEmail = false } = {}) {
  const stats = user.stats;
  const level = levelForUser(stats);
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    ...(includeEmail ? { email: user.email } : {}),
    isOwner: user.role === 'owner',
    createdAt: user.createdAt,
    lastActiveAt: user.lastActiveAt,
    stats,
    level: { id: level.id, code: level.code, name: level.name },
    animalsUnlocked: user.unlocked.length,
    animalsTotal: ANIMALS.length,
    gameBests: store.userGameBests(user.id),
    badges: earnedBadges(stats)
  };
}

function send(res, status, body, headers = {}) {
  const payload = typeof body === 'string' ? body : JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 1_000_000) { reject(new Error('Payload too large')); req.destroy(); return; }
      data += chunk;
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); } catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  const out = {};
  header.split(';').forEach((pair) => {
    const idx = pair.indexOf('=');
    if (idx > -1) out[pair.slice(0, idx).trim()] = decodeURIComponent(pair.slice(idx + 1).trim());
  });
  return out;
}

function currentUser(req) {
  const token = parseCookies(req).octolearn_session;
  const session = store.getSession(token);
  if (!session) return { user: null, token: null };
  return { user: store.findUserById(session.userId), token };
}

function requireAuth(req, res) {
  const { user } = currentUser(req);
  if (!user) { send(res, 401, { error: 'You must be signed in to do that.' }); return null; }
  return user;
}

function requireOwner(req, res) {
  const user = requireAuth(req, res);
  if (!user) return null;
  if (user.role !== 'owner') { send(res, 403, { error: 'Owner access only.' }); return null; }
  return user;
}

function todayKey() { return new Date().toISOString().slice(0, 10); }

function cookieHeader(token) {
  const maxAge = 60 * 60 * 24 * 30;
  return `octolearn_session=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax`;
}

/* ---------------------------------- routing -------------------------------- */

async function handleApi(req, res, url) {
  const { pathname } = url;
  const method = req.method;

  // --- public ---------------------------------------------------------------
  if (pathname === '/api/config' && method === 'GET') {
    return send(res, 200, store.getSettings());
  }

  if (pathname === '/api/register' && method === 'POST') {
    const settings = store.getSettings();
    const body = await readBody(req);
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    if (name.length < 2) return send(res, 400, { error: 'Please enter your name (at least 2 characters).' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return send(res, 400, { error: 'Please enter a valid email address.' });
    if (password.length < 6) return send(res, 400, { error: 'Password must be at least 6 characters.' });
    if (store.findUserByEmail(email)) return send(res, 409, { error: 'That email is already registered. Try signing in.' });
    if (!settings.allowSelfRegistration) {
      return send(res, 403, { error: 'Public sign-up is currently closed. Ask the owner to create your account.' });
    }
    const user = store.createUser({ name, email, password, role: 'learner' });
    store.addNotification({ type: 'join', userId: user.id, name: user.name, email: user.email });
    const token = store.createSession(user.id);
    return send(res, 201, { user: publicUser(user, { includeEmail: true }) }, { 'Set-Cookie': cookieHeader(token) });
  }

  if (pathname === '/api/login' && method === 'POST') {
    const body = await readBody(req);
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const user = store.findUserByEmail(email);
    if (!user || !store.verifyPassword(password, user.salt, user.hash)) {
      return send(res, 401, { error: 'Wrong email or password. Please try again.' });
    }
    user.lastActiveAt = new Date().toISOString();
    store.save();
    const token = store.createSession(user.id);
    // The owner gets a heads-up every time a learner signs in.
    if (user.role !== 'owner') {
      store.addNotification({ type: 'login', userId: user.id, name: user.name, email: user.email });
    }
    return send(res, 200, { user: publicUser(user, { includeEmail: true }) }, { 'Set-Cookie': cookieHeader(token) });
  }

  if (pathname === '/api/logout' && method === 'POST') {
    const token = parseCookies(req).octolearn_session;
    store.destroySession(token);
    return send(res, 200, { ok: true }, { 'Set-Cookie': 'octolearn_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax' });
  }

  if (pathname === '/api/me' && method === 'GET') {
    const { user } = currentUser(req);
    if (!user) return send(res, 200, { user: null });
    const payload = { user: publicUser(user, { includeEmail: true }) };
    if (user.role === 'owner') payload.unreadNotifications = store.unreadNotifications();
    return send(res, 200, payload);
  }

  // --- content --------------------------------------------------------------
  if (pathname === '/api/content' && method === 'GET') {
    const user = requireAuth(req, res);
    if (!user) return;
    return send(res, 200, {
      levels: LEVELS,
      lessons: publicLessons(),
      animals: ANIMALS.map((a) => publicAnimal(a, user.unlocked)),
      badges: BADGES.map((b) => {
        const earned = earnedBadges(user.stats).some((e) => e.id === b.id);
        return { id: b.id, name: b.name, emoji: b.emoji, desc: b.desc, earned };
      })
    });
  }

  const lessonMatch = pathname.match(/^\/api\/lesson\/([\w-]+)$/);
  if (lessonMatch && method === 'GET') {
    const user = requireAuth(req, res);
    if (!user) return;
    const lesson = getLesson(lessonMatch[1]);
    if (!lesson) return send(res, 404, { error: 'Lesson not found.' });
    // Attach real audio files to listening / speaking / vocabulary items.
    const enriched = {
      ...lesson,
      exercises: lesson.exercises.map((ex) => ({
        ...ex,
        audio: audioUrlFor(ex.type === 'listen' || ex.type === 'speak' ? ex.text : ex.answer)
      }))
    };
    return send(res, 200, { lesson: enriched });
  }

  const completeMatch = pathname.match(/^\/api\/lesson\/([\w-]+)\/complete$/);
  if (completeMatch && method === 'POST') {
    const user = requireAuth(req, res);
    if (!user) return;
    const lesson = getLesson(completeMatch[1]);
    if (!lesson) return send(res, 404, { error: 'Lesson not found.' });
    const body = await readBody(req);
    const correct = Math.max(0, Math.min(Number(body.correct) || 0, lesson.exercises.length));
    const total = lesson.exercises.length;
    const accuracy = total ? correct / total : 0;

    const stats = user.stats;
    const alreadyDone = stats.completed.includes(lesson.id);
    const xpGained = alreadyDone
      ? Math.round(lesson.xp * 0.2 * accuracy)
      : Math.round(lesson.xp * (0.5 + 0.5 * accuracy));

    stats.xp += xpGained;
    if (!alreadyDone) {
      stats.completed.push(lesson.id);
      stats.lessonsCompleted = stats.completed.length;
      if (correct === total) stats.perfectLessons += 1;
    }

    const today = todayKey();
    if (stats.lastLessonDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      stats.streak = stats.lastLessonDate === yesterday ? (stats.streak || 0) + 1 : 1;
      stats.lastLessonDate = today;
    }
    user.lastActiveAt = new Date().toISOString();

    const newlyUnlocked = [];
    ANIMALS.forEach((a) => {
      if (stats.lessonsCompleted >= a.unlockAt && !user.unlocked.includes(a.id)) {
        user.unlocked.push(a.id);
        newlyUnlocked.push({ id: a.id, name: a.name, emoji: a.emoji, fact: a.fact });
      }
    });

    store.save();
    return send(res, 200, {
      xpGained, correct, total, accuracy, newlyUnlocked,
      user: publicUser(user, { includeEmail: true })
    });
  }

  if (pathname === '/api/leaderboard' && method === 'GET') {
    const user = requireAuth(req, res);
    if (!user) return;
    const rows = store.get().users
      .map((u) => ({ id: u.id, name: u.name, xp: u.stats.xp, lessons: u.stats.lessonsCompleted, streak: u.stats.streak }))
      .sort((a, b) => b.xp - a.xp)
      .slice(0, 20)
      .map((r, i) => ({ ...r, rank: i + 1, isMe: r.id === user.id }));
    return send(res, 200, { leaderboard: rows });
  }

  // --- games ----------------------------------------------------------------
  if (pathname === '/api/games' && method === 'GET') {
    const user = requireAuth(req, res);
    if (!user) return;
    return send(res, 200, {
      games: GAMES,
      wordbank: WORD_BANK.map((w) => ({ ...w, audio: audioUrlFor(w.word) })),
      bests: store.userGameBests(user.id)
    });
  }

  if (pathname === '/api/games/score' && method === 'POST') {
    const user = requireAuth(req, res);
    if (!user) return;
    const body = await readBody(req);
    const game = String(body.game || '');
    if (!GAMES.some((g) => g.id === game)) return send(res, 400, { error: 'Unknown game.' });
    const score = Math.max(0, Math.min(Math.round(Number(body.score) || 0), 100000));
    const { best, improved } = store.setGameScore(user.id, game, score);
    const ranked = store.gameRanking(game);
    const myRank = ranked.find((r) => r.userId === user.id);
    return send(res, 200, { best, improved, rank: myRank ? myRank.rank : null, total: ranked.length });
  }

  if (pathname === '/api/rankings' && method === 'GET') {
    const user = requireAuth(req, res);
    if (!user) return;
    const rankings = {};
    GAMES.forEach((g) => {
      rankings[g.id] = store.gameRanking(g.id).slice(0, 10).map((r) => ({ ...r, isMe: r.userId === user.id }));
    });
    return send(res, 200, { rankings, games: GAMES });
  }

  // --- owner / admin --------------------------------------------------------
  if (pathname === '/api/admin/users' && method === 'GET') {
    const owner = requireOwner(req, res);
    if (!owner) return;
    const rows = store.get().users
      .map((u) => ({
        id: u.id, name: u.name, email: u.email, role: u.role,
        createdAt: u.createdAt, lastActiveAt: u.lastActiveAt,
        level: levelForUser(u.stats),
        xp: u.stats.xp,
        lessonsCompleted: u.stats.lessonsCompleted,
        lessonsTotal: LESSONS.length,
        perfectLessons: u.stats.perfectLessons,
        streak: u.stats.streak,
        animalsUnlocked: u.unlocked.length,
        animalsTotal: ANIMALS.length,
        completedLessonIds: u.stats.completed,
        gameBests: store.userGameBests(u.id)
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return send(res, 200, {
      summary: {
        totalUsers: rows.length,
        learners: rows.filter((r) => r.role === 'learner').length,
        owners: rows.filter((r) => r.role === 'owner').length,
        activeToday: rows.filter((r) => r.lastActiveAt && r.lastActiveAt.slice(0, 10) === todayKey()).length,
        totalXp: rows.reduce((s, r) => s + r.xp, 0),
        newThisWeek: rows.filter((r) => Date.now() - new Date(r.createdAt).getTime() < 7 * 86400000).length
      },
      users: rows
    });
  }

  if (pathname === '/api/admin/users' && method === 'POST') {
    const owner = requireOwner(req, res);
    if (!owner) return;
    const body = await readBody(req);
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const role = body.role === 'owner' ? 'owner' : 'learner';
    if (name.length < 2) return send(res, 400, { error: 'Please enter the full name.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return send(res, 400, { error: 'Please enter a valid email address.' });
    if (password.length < 6) return send(res, 400, { error: 'Password must be at least 6 characters.' });
    if (store.findUserByEmail(email)) return send(res, 409, { error: 'That email already has an account.' });
    const user = store.createUser({ name, email, password, role });
    store.addNotification({ type: 'added', userId: user.id, name: user.name, email: user.email });
    return send(res, 201, { user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt } });
  }

  if (pathname === '/api/admin/notifications' && method === 'GET') {
    const owner = requireOwner(req, res);
    if (!owner) return;
    return send(res, 200, {
      notifications: store.listNotifications(60),
      unread: store.unreadNotifications()
    });
  }

  if (pathname === '/api/admin/notifications/read' && method === 'POST') {
    const owner = requireOwner(req, res);
    if (!owner) return;
    store.markNotificationsRead();
    return send(res, 200, { ok: true });
  }

  if (pathname === '/api/admin/overview' && method === 'GET') {
    const owner = requireOwner(req, res);
    if (!owner) return;
    const lessons = LESSONS.map((l) => {
      const players = store.get().users.filter((u) => u.stats.completed.includes(l.id)).length;
      return { id: l.id, title: l.title, level: l.level, emoji: l.emoji, players };
    });
    return send(res, 200, { lessons });
  }

  if (pathname === '/api/admin/settings' && method === 'GET') {
    const owner = requireOwner(req, res);
    if (!owner) return;
    return send(res, 200, { settings: store.getSettings() });
  }

  if (pathname === '/api/admin/settings' && method === 'POST') {
    const owner = requireOwner(req, res);
    if (!owner) return;
    const body = await readBody(req);
    const patch = {};
    if (typeof body.platformName === 'string' && body.platformName.trim()) patch.platformName = body.platformName.trim().slice(0, 40);
    if (typeof body.allowSelfRegistration === 'boolean') patch.allowSelfRegistration = body.allowSelfRegistration;
    const settings = store.updateSettings(patch);
    return send(res, 200, { settings });
  }

  return send(res, 404, { error: 'Not found.' });
}

/* ------------------------------- static files ------------------------------ */

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.woff2': 'font/woff2',
  '.apk': 'application/vnd.android.package-archive'
};

function serveStatic(req, res, url) {
  let rel = decodeURIComponent(url.pathname);
  if (rel === '/' || rel === '') rel = '/index.html';
  const filePath = path.normalize(path.join(PUBLIC_DIR, rel));
  if (!filePath.startsWith(PUBLIC_DIR)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Service worker must be served from the root scope.
      if (rel === '/sw.js') { res.writeHead(404); return res.end('Not found'); }
      fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (e2, html) => {
        if (e2) { res.writeHead(404); return res.end('Not found'); }
        res.writeHead(200, { 'Content-Type': MIME['.html'] });
        res.end(html);
      });
      return;
    }
    const ext = path.extname(filePath);
    const headers = { 'Content-Type': MIME[ext] || 'application/octet-stream' };
    // Audio and the manifest can be cached for a long time.
    if (ext === '.mp3') headers['Cache-Control'] = 'public, max-age=604800, immutable';
    res.writeHead(200, headers);
    res.end(data);
  });
}

/* ---------------------------------- server --------------------------------- */

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    if (url.pathname.startsWith('/api/')) {
      await handleApi(req, res, url);
    } else {
      serveStatic(req, res, url);
    }
  } catch (err) {
    console.error('[OctoLearn] Request error:', err);
    if (!res.headersSent) send(res, 500, { error: 'Something went wrong on our side.' });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[OctoLearn] Running at http://localhost:${PORT}`);
  console.log(`[OctoLearn] Owner: ${OWNER_EMAIL}`);
  startKeepAlive();
});

/* -------------------------------- keep-alive ------------------------------- */
// On Render's free plan a web service sleeps after 15 minutes without traffic.
// Pinging our own public URL every 10 minutes keeps it awake around the clock.
// Set KEEP_ALIVE=false to turn this off, or KEEP_ALIVE_URL to override the host.
function startKeepAlive() {
  if (String(process.env.KEEP_ALIVE || '').toLowerCase() === 'false') return;

  const base = process.env.KEEP_ALIVE_URL || process.env.RENDER_EXTERNAL_URL || '';
  if (!base) {
    console.log('[OctoLearn] Keep-alive off: no public URL available.');
    return;
  }

  const target = `${base.replace(/\/+$/, '')}/api/config`;
  const everyMs = Number(process.env.KEEP_ALIVE_INTERVAL_MS) || 10 * 60 * 1000;

  setInterval(async () => {
    try {
      const res = await fetch(target);
      console.log(`[OctoLearn] keep-alive ${res.status} ${target}`);
    } catch (err) {
      console.warn(`[OctoLearn] keep-alive failed: ${err.message}`);
    }
  }, everyMs);

  console.log(`[OctoLearn] Keep-alive every ${Math.round(everyMs / 60000)} min -> ${target}`);
}
