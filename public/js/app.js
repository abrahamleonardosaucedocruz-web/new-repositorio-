/* ============================================================
   OctoLearn — client application (vanilla JS, no dependencies)
   Mobile-first. Every user-facing string is in English.
   ============================================================ */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const state = {
  user: null,
  content: null,                 // { levels, lessons, animals, badges }
  config: { platformName: 'OctoLearn', allowSelfRegistration: true },
  unread: 0,
  poll: null
};

/* --------------------------------- icons ---------------------------------- */

const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5.2 9.4V20a1 1 0 0 0 1 1h11.6a1 1 0 0 0 1-1V9.4"/>',
  book: '<path d="M12 6.6C10.4 5.1 8.3 4.5 4 4.5v13c4.3 0 6.4.6 8 2.1 1.6-1.5 3.7-2.1 8-2.1v-13c-4.3 0-6.4.6-8 2.1z"/><path d="M12 6.6v13"/>',
  game: '<rect x="2" y="7" width="20" height="10" rx="5"/><path d="M7 10v4M5 12h4"/><circle cx="16.2" cy="11" r="1.05" fill="currentColor" stroke="none"/><circle cx="18.4" cy="13.4" r="1.05" fill="currentColor" stroke="none"/>',
  trophy: '<path d="M7 4h10v4.2a5 5 0 0 1-10 0z"/><path d="M7 6H4.6a2.4 2.4 0 0 0 2.5 2.6"/><path d="M17 6h2.4A2.4 2.4 0 0 1 16.9 8.6"/><path d="M12 13.2V16"/><path d="M8.6 20h6.8"/><path d="M9.6 20c0-1.3 1-2.4 2.4-2.4s2.4 1.1 2.4 2.4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.6 20a7.4 7.4 0 0 1 14.8 0"/>',
  paw: '<circle cx="6.8" cy="9" r="2"/><circle cx="11.2" cy="6.6" r="2"/><circle cx="15.6" cy="8.6" r="2"/><circle cx="18.4" cy="12.6" r="1.8"/><path d="M12 11.4c-2.9 0-5 2.1-5 4.5 0 1.9 1.5 3 3.2 2.4 1.1-.4 2.5-.4 3.6 0 1.7.6 3.2-.5 3.2-2.4 0-2.4-2.1-4.5-5-4.5z"/>',
  bell: '<path d="M6 9.6a6 6 0 0 1 12 0c0 4.6 1.8 5.6 1.8 5.6H4.2S6 14.2 6 9.6z"/><path d="M10.3 18.6a1.9 1.9 0 0 0 3.4 0"/>',
  gear: '<circle cx="12" cy="12" r="3.1"/><path d="M12 3v2.3M12 18.7V21M4.6 7.6l2 1.2M17.4 15.2l2 1.2M4.6 16.4l2-1.2M17.4 8.8l2-1.2"/>',
  users: '<circle cx="9.2" cy="8" r="3.3"/><path d="M3 19a6.2 6.2 0 0 1 12.4 0"/><path d="M16 5.2a3.3 3.3 0 0 1 0 5.8"/><path d="M17.6 19a5.8 5.8 0 0 0-1.5-4"/>',
  activity: '<path d="M3 12.2h3.8L9.6 5.6l4.1 12.6 2.4-6h4.9"/>',
  plus: '<path d="M12 5.2v13.6M5.2 12h13.6"/>',
  search: '<circle cx="11" cy="11" r="6.8"/><path d="M20 20l-3.4-3.4"/>',
  logout: '<path d="M15 12H4.2"/><path d="M8 8.2 3.8 12 8 15.8"/><path d="M11 4.4h6a2 2 0 0 1 2 2v11.2a2 2 0 0 1-2 2h-6"/>',
  volume: '<path d="M4.2 9.4h2.9L11.3 6v12L7.1 14.6H4.2z"/><path d="M15.2 9.6a3.4 3.4 0 0 1 0 4.8"/><path d="M17.8 7.4a6.6 6.6 0 0 1 0 9.2"/>',
  mic: '<rect x="9" y="3" width="6" height="10.4" rx="3"/><path d="M5.6 11.2a6.4 6.4 0 0 0 12.8 0"/><path d="M12 17.6V21M9 21h6"/>',
  check: '<path d="M5 12.6l4.6 4.6L19 7.4"/>',
  lock: '<rect x="4.6" y="10.4" width="14.8" height="10.2" rx="2.6"/><path d="M8.2 10.4V8a3.8 3.8 0 0 1 7.6 0v2.4"/>',
  crown: '<path d="M3.8 8.2l3.6 3.1L12 5l4.6 6.3 3.6-3.1-1.5 9.4H5.3z"/>',
  star: '<path d="M12 4.2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4L4.2 9.9l5.4-.8z"/>',
  flame: '<path d="M12 3.4c3.4 3.1 5.2 5.6 5.2 8.3a5.2 5.2 0 0 1-10.4 0c0-1.6.8-3 1.6-4 .5 1 1.2 1.6 1.8 1.6.9 0 1.8-1.2 1.8-3.4 0-.9-.2-1.7 0-2.5z"/>',
  spark: '<path d="M12 3.6l1.7 4.7 4.7 1.7-4.7 1.7L12 16.4l-1.7-4.7L5.6 10l4.7-1.7z"/><path d="M18.4 15.6l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z"/>',
  arrow: '<path d="M4.6 12h13.2"/><path d="M13.2 6.6 18.6 12l-5.4 5.4"/>',
  back: '<path d="M19.4 12H6.2"/><path d="M10.8 6.6 5.4 12l5.4 5.4"/>',
  close: '<path d="M6.2 6.2 17.8 17.8M17.8 6.2 6.2 17.8"/>',
  grid: '<rect x="3.6" y="3.6" width="7" height="7" rx="2"/><rect x="13.4" y="3.6" width="7" height="7" rx="2"/><rect x="3.6" y="13.4" width="7" height="7" rx="2"/><rect x="13.4" y="13.4" width="7" height="7" rx="2"/>',
  refresh: '<path d="M19.6 11.2A7.8 7.8 0 0 0 6 6.9L3.9 8.9"/><path d="M4 4.4v4.5h4.5"/><path d="M4.4 12.8A7.8 7.8 0 0 0 18 17.1l2.1-2"/><path d="M20 19.6v-4.5h-4.5"/>',
  clock: '<circle cx="12" cy="12" r="8.4"/><path d="M12 7.4V12l3 2"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.6"/>',
  smile: '<circle cx="12" cy="12" r="8.4"/><path d="M8.6 14.4a4.6 4.6 0 0 0 6.8 0"/><circle cx="9.2" cy="9.4" r=".95" fill="currentColor" stroke="none"/><circle cx="14.8" cy="9.4" r=".95" fill="currentColor" stroke="none"/>'
};

function icon(name, cls = 'ico') {
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}

/* --------------------------------- utils ---------------------------------- */

function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(path, {
    method,
    credentials: 'same-origin',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
  let data = {};
  try { data = await res.json(); } catch { /* ignore */ }
  if (!res.ok) {
    const err = new Error(data.error || 'Something went wrong. Please try again.');
    err.status = res.status;
    throw err;
  }
  return data;
}

function toast(message, kind = 'info') {
  const root = $('#toast-root');
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  el.innerHTML = `<span style="display:flex">${icon(kind === 'ok' ? 'check' : kind === 'err' ? 'close' : 'spark', 'ico ico-sm')}</span><span>${esc(message)}</span>`;
  root.appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .35s, transform .35s';
    el.style.opacity = '0';
    el.style.transform = 'translateY(-12px)';
    setTimeout(() => el.remove(), 380);
  }, 3200);
}

function confetti() {
  const colors = ['#0f6b73', '#e2613c', '#cf9a2b', '#3d9169', '#6a5ad0', '#2b7fa8'];
  const wrap = document.createElement('div');
  wrap.className = 'confetti';
  for (let i = 0; i < 80; i++) {
    const p = document.createElement('i');
    p.style.left = Math.random() * 100 + 'vw';
    p.style.top = '-20px';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDuration = (2 + Math.random() * 1.8) + 's';
    p.style.animationDelay = (Math.random() * 0.5) + 's';
    wrap.appendChild(p);
  }
  document.body.appendChild(wrap);
  setTimeout(() => wrap.remove(), 4200);
}

function closeModal() { $('#modal-root').innerHTML = ''; }

function openModal(html, { onMount } = {}) {
  const root = $('#modal-root');
  root.innerHTML = `<div class="modal-back"><div class="modal">${html}</div></div>`;
  const back = root.querySelector('.modal-back');
  back.addEventListener('click', (e) => { if (e.target === back) closeModal(); });
  if (onMount) onMount(root);
}

function closeSheet() { $('#sheet-root').innerHTML = ''; }

function openSheet(html, { onMount } = {}) {
  const root = $('#sheet-root');
  root.innerHTML = `
    <div class="sheet-back"></div>
    <div class="sheet" role="dialog" aria-modal="true">
      <div class="sheet-grip"></div>
      ${html}
    </div>`;
  root.querySelector('.sheet-back').addEventListener('click', closeSheet);
  if (onMount) onMount(root);
}

function timeAgo(iso) {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days} d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function fmtDate(iso, withTime = false) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', withTime
    ? { dateStyle: 'medium', timeStyle: 'short' }
    : { year: 'numeric', month: 'long', day: 'numeric' });
}

function initials(name) {
  return String(name || '?').trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase() || '?';
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* --------------------------------- themes --------------------------------- */
// Every learner can choose the colour of the interface. The pick is kept on the
// device, so it survives reloads without needing anything from the server.
const THEMES = [
  { id: 'teal', name: 'Lagoon', swatch: '#0f6b73' },
  { id: 'coral', name: 'Coral', swatch: '#b8502f' },
  { id: 'violet', name: 'Orchid', swatch: '#6a5ad0' },
  { id: 'forest', name: 'Kelp', swatch: '#2f7a55' },
  { id: 'sky', name: 'Deep Sea', swatch: '#2b7fa8' },
  { id: 'gold', name: 'Sunset', swatch: '#b1861f' }
];
const THEME_KEY = 'octolearn-theme';

function currentTheme() {
  try { return localStorage.getItem(THEME_KEY) || 'teal'; } catch { return 'teal'; }
}

function applyTheme(id) {
  const theme = THEMES.find((t) => t.id === id) || THEMES[0];
  if (theme.id === 'teal') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', theme.id);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme.swatch);
  try { localStorage.setItem(THEME_KEY, theme.id); } catch { /* private mode */ }
  return theme.id;
}

/* --------------------------------- mascot --------------------------------- */

let octoSeq = 0;
function octopusSVG(width = 200) {
  const id = 'octoGrad' + (octoSeq++);
  return `
  <div class="octo-wrap" style="width:${width}px">
    <svg class="octo" viewBox="0 0 220 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ollie the octopus">
      <defs>
        <radialGradient id="${id}" cx="40%" cy="28%" r="82%">
          <stop offset="0%" stop-color="#a99bf7"/>
          <stop offset="52%" stop-color="#7a68e0"/>
          <stop offset="100%" stop-color="#5440b8"/>
        </radialGradient>
      </defs>
      <g fill="none" stroke="url(#${id})" stroke-width="21" stroke-linecap="round">
        <path class="tentacle" d="M64 120 C44 152 50 182 30 194"/>
        <path class="tentacle" d="M86 130 C74 162 86 190 66 200"/>
        <path class="tentacle" d="M110 134 C104 166 116 192 104 203"/>
        <path class="tentacle" d="M134 130 C146 162 134 190 154 200"/>
        <path class="tentacle" d="M156 120 C176 152 170 182 190 194"/>
      </g>
      <ellipse cx="110" cy="80" rx="68" ry="63" fill="url(#${id})"/>
      <ellipse cx="86" cy="46" rx="26" ry="16" fill="#ffffff" opacity="0.3"/>
      <ellipse cx="87" cy="76" rx="16" ry="18.5" fill="#ffffff"/>
      <ellipse cx="133" cy="76" rx="16" ry="18.5" fill="#ffffff"/>
      <circle cx="90" cy="80" r="8.4" fill="#241a4d"/>
      <circle cx="136" cy="80" r="8.4" fill="#241a4d"/>
      <circle cx="87" cy="76" r="2.6" fill="#ffffff"/>
      <circle cx="133" cy="76" r="2.6" fill="#ffffff"/>
      <ellipse cx="68" cy="98" rx="11" ry="7" fill="#ff8fb4" opacity="0.55"/>
      <ellipse cx="152" cy="98" rx="11" ry="7" fill="#ff8fb4" opacity="0.55"/>
      <path d="M99 100 Q110 110 121 100" stroke="#3a2a86" stroke-width="4" fill="none" stroke-linecap="round"/>
    </svg>
  </div>`;
}

/* --------------------------------- audio ---------------------------------- */
/* Real pre-generated MP3s (public/audio). Much more reliable than the
   browser voice, which stays silent on many phones.                        */

let audioEl = null;
let audioBtn = null;

function ensureAudio() {
  if (!audioEl) {
    audioEl = new Audio();
    audioEl.preload = 'auto';
    audioEl.addEventListener('ended', () => setPlaying(false));
    audioEl.addEventListener('pause', () => setPlaying(false));
  }
  return audioEl;
}

function setPlaying(on) {
  if (audioBtn) audioBtn.classList.toggle('playing', on);
}

function playAudio(url, btn) {
  if (audioBtn && audioBtn !== btn) audioBtn.classList.remove('playing');
  audioBtn = btn || null;
  if (!url) { setPlaying(false); return; }
  const a = ensureAudio();
  try { a.pause(); } catch { /* ignore */ }
  a.src = url;
  a.currentTime = 0;
  setPlaying(true);
  const p = a.play();
  if (p && p.catch) p.catch(() => { setPlaying(false); fallbackSpeak(); });
}

// Last-resort fallback if a clip is missing for some reason.
function fallbackSpeak(text) {
  if (!text || !window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  u.rate = 0.92;
  speechSynthesis.speak(u);
}

/* ------------------------------ speech input ------------------------------ */

const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

function normalizeWords(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9\s']/g, ' ').split(/\s+/).filter(Boolean);
}

function similarity(a, b) {
  const A = normalizeWords(a), B = normalizeWords(b);
  if (!A.length || !B.length) return 0;
  const setB = new Set(B);
  const hit = A.filter((w) => setB.has(w)).length;
  return hit / Math.max(A.length, B.length);
}

/* --------------------------------- router --------------------------------- */

function go(route) {
  const clean = '/' + String(route).replace(/^#?\/?/, '');
  if (location.hash === '#' + clean) renderRoute();
  else location.hash = clean;
}

function tabFor(seg) {
  if (seg === 'lesson') return 'learn';
  if (seg === 'game') return 'games';
  if (seg === 'animals') return 'profile';
  if (['members', 'activity', 'settings'].includes(seg)) return 'profile';
  return seg || 'dashboard';
}

function setActiveTab(seg) {
  const active = tabFor(seg);
  $$('.tab[data-route]').forEach((t) => t.classList.toggle('on', t.dataset.route === active));
  $$('.side-link[data-route]').forEach((t) => t.classList.toggle('on', t.dataset.route === (seg || 'dashboard')));
}

function stopGame() {
  if (state.poll) { /* notifications poll is separate */ }
  if (window.__octoTimers) {
    window.__octoTimers.forEach((id) => clearInterval(id));
    window.__octoTimers = [];
  }
  if (audioEl) { try { audioEl.pause(); } catch { /* ignore */ } }
}

function renderRoute() {
  stopGame();
  if (!state.user) return renderAuth();
  const hash = location.hash.replace(/^#\/?/, '');
  const [seg, param] = hash.split('/');
  const view = $('#view');
  if (!view) return;
  view.scrollTop = 0;
  window.scrollTo(0, 0);

  switch (seg) {
    case '': case 'dashboard': return viewDashboard(view);
    case 'learn': return viewLearn(view);
    case 'lesson': return viewLesson(view, param);
    case 'games': return viewGames(view);
    case 'game': return playGame(view, param);
    case 'rankings': return viewRankings(view, param);
    case 'animals': return viewAnimals(view);
    case 'profile': return viewProfile(view);
    case 'members': return state.user.isOwner ? viewMembers(view) : viewDashboard(view);
    case 'activity': return state.user.isOwner ? viewActivity(view) : viewDashboard(view);
    case 'settings': return state.user.isOwner ? viewSettings(view) : viewDashboard(view);
    default: return viewDashboard(view);
  }
}

/* ------------------------------- auth screen ------------------------------ */

function renderAuth(mode = 'login') {
  stopGame();
  const screen = $('#screen-auth');
  $('#screen-app').classList.add('hidden');
  screen.classList.remove('hidden');

  const brand = state.config.platformName || 'OctoLearn';

  screen.innerHTML = `
    <div class="auth">
      <section class="auth-hero">
        <div class="auth-brand"><span class="mark">${icon('paw', 'ico')}</span> ${esc(brand)}</div>
        <div class="art">${octopusSVG(168)}</div>
        <h1>Hi, I'm Ollie.<br/>Let's learn English together.</h1>
        <p class="lede">Finish a lesson, rescue a new ocean animal, and keep your streak alive.</p>
        <div class="auth-points">
          <span class="auth-point">${icon('book', 'ico ico-sm')} Leveled lessons</span>
          <span class="auth-point">${icon('mic', 'ico ico-sm')} Speaking practice</span>
          <span class="auth-point">${icon('game', 'ico ico-sm')} Word games</span>
          <span class="auth-point">${icon('paw', 'ico ico-sm')} Collect animals</span>
        </div>
      </section>

      <section class="auth-body">
        <div class="auth-card">
          <h2 id="auth-title">${mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
          <p class="sub" id="auth-sub">${mode === 'login' ? 'Sign in to continue your learning journey.' : 'Join in and meet your first ocean animal.'}</p>

          <div class="tabs">
            <button type="button" data-mode="login" class="${mode === 'login' ? 'on' : ''}">Sign in</button>
            <button type="button" data-mode="register" class="${mode === 'register' ? 'on' : ''}">Sign up</button>
          </div>

          <form id="auth-form" novalidate>
            <div class="field" id="name-field" style="${mode === 'login' ? 'display:none' : ''}">
              <label for="f-name">Full name</label>
              <input class="input" id="f-name" type="text" autocomplete="name" placeholder="e.g. Alex Rivera" />
            </div>
            <div class="field">
              <label for="f-email">Email</label>
              <input class="input" id="f-email" type="email" autocomplete="email" placeholder="you@example.com" />
            </div>
            <div class="field">
              <label for="f-pass">Password</label>
              <input class="input" id="f-pass" type="password" autocomplete="${mode === 'login' ? 'current-password' : 'new-password'}" placeholder="At least 6 characters" />
            </div>
            <button class="btn btn-primary btn-block btn-lg" type="submit" id="auth-submit">
              ${mode === 'login' ? 'Sign in' : 'Start learning'}
            </button>
            <div class="form-msg" id="auth-msg"></div>
          </form>

          <div class="note" id="auth-note" style="${state.config.allowSelfRegistration || mode === 'login' ? 'display:none' : ''}">
            Public sign-up is closed right now. Ask the owner to create your account, then sign in here.
          </div>
        </div>
      </section>
    </div>`;

  $$('.tabs button', screen).forEach((b) => b.addEventListener('click', () => renderAuth(b.dataset.mode)));
  $('#auth-form').addEventListener('submit', (e) => submitAuth(e, mode));
}

async function submitAuth(e, mode) {
  e.preventDefault();
  const msg = $('#auth-msg');
  const btn = $('#auth-submit');
  msg.className = 'form-msg';
  msg.textContent = '';
  const payload = {
    email: $('#f-email').value.trim(),
    password: $('#f-pass').value,
    ...(mode === 'register' ? { name: $('#f-name').value.trim() } : {})
  };
  btn.disabled = true;
  btn.textContent = 'Just a moment…';
  try {
    const data = await api(mode === 'register' ? '/api/register' : '/api/login', { method: 'POST', body: payload });
    state.user = data.user;
    toast(mode === 'register' ? `Welcome aboard, ${data.user.name}!` : `Welcome back, ${data.user.name}!`, 'ok');
    await bootApp();
  } catch (err) {
    msg.className = 'form-msg err';
    msg.textContent = err.message;
    btn.disabled = false;
    btn.textContent = mode === 'login' ? 'Sign in' : 'Start learning';
  }
}

/* --------------------------------- app shell ------------------------------ */

async function bootApp() {
  state.content = await api('/api/content');
  $('#screen-auth').classList.add('hidden');
  $('#screen-app').classList.remove('hidden');
  renderShell();
  renderRoute();
  if (state.user.isOwner) startNotifyPoll();
}

const TABS = [
  { route: 'dashboard', label: 'Home', icon: 'home' },
  { route: 'learn', label: 'Lessons', icon: 'book' },
  { route: 'games', label: 'Games', icon: 'game' },
  { route: 'rankings', label: 'Ranks', icon: 'trophy' },
  { route: 'profile', label: 'Me', icon: 'user' }
];

function unreadLabel() { return state.unread > 99 ? '99+' : String(state.unread); }

function renderShell() {
  const u = state.user;
  const brand = state.config.platformName || 'OctoLearn';

  const sideLinks = [
    { label: 'Learn', items: [
      { route: 'dashboard', label: 'Home', icon: 'home' },
      { route: 'learn', label: 'Lessons', icon: 'book' },
      { route: 'animals', label: 'My Animals', icon: 'paw' }
    ] },
    { label: 'Play', items: [
      { route: 'games', label: 'Games', icon: 'game' },
      { route: 'rankings', label: 'Leaderboard', icon: 'trophy' }
    ] },
    { label: 'Account', items: [
      { route: 'profile', label: 'Profile', icon: 'user' }
    ] }
  ];
  if (u.isOwner) {
    sideLinks.push({ label: 'Owner', items: [
      { route: 'members', label: 'Members', icon: 'users' },
      { route: 'activity', label: 'Activity', icon: 'bell', badge: true },
      { route: 'settings', label: 'Settings', icon: 'gear' }
    ] });
  }

  $('#screen-app').innerHTML = `
    <div class="shell">
      <aside class="sidebar">
        <div class="side-brand"><span class="mark">${icon('paw', 'ico')}</span> ${esc(brand)}</div>
        ${sideLinks.map((grp) => `
          <div class="side-label">${esc(grp.label)}</div>
          ${grp.items.map((it) => `
            <a class="side-link" data-route="${it.route}" href="#/${it.route}">
              ${icon(it.icon, 'ico ico-sm')}
              <span class="grow">${esc(it.label)}</span>
              ${it.badge ? `<span class="chip coral" id="side-unread" style="${state.unread ? '' : 'display:none'}">${unreadLabel()}</span>` : ''}
            </a>`).join('')}
        `).join('')}
        <div class="side-foot">
          <div class="side-user">
            <div class="avatar">${esc(initials(u.name))}</div>
            <div style="flex:1;min-width:0">
              <div class="u-name">${esc(u.name)}</div>
              <div class="u-sub">${u.isOwner ? 'Owner' : 'Learner'} · ${esc(u.level.code)}</div>
            </div>
          </div>
          <button class="side-link" id="side-logout">${icon('logout', 'ico ico-sm')}<span class="grow">Sign out</span></button>
        </div>
      </aside>

      <div class="stage">
        <header class="appbar">
          <div class="appbar-brand"><span class="mark">${icon('paw', 'ico ico-sm')}</span> ${esc(brand)}</div>
          <div class="grow"></div>
          ${u.isOwner ? `
            <button class="icon-btn" id="app-bell" aria-label="Activity">
              ${icon('bell', 'ico')}
              <span class="dot" id="bell-dot" style="${state.unread ? '' : 'display:none'}">${unreadLabel()}</span>
            </button>
            <button class="icon-btn" id="app-members" aria-label="Members">${icon('users', 'ico')}</button>` : ''}
          <button class="avatar" id="app-avatar" aria-label="Profile">${esc(initials(u.name))}</button>
        </header>

        <main class="content" id="view"></main>
      </div>

      <nav class="tabbar">
        ${TABS.map((t) => `
          <button class="tab" data-route="${t.route}">
            ${icon(t.icon, 'ico')}
            <span>${t.label}</span>
          </button>`).join('')}
      </nav>
    </div>`;

  $$('.tab[data-route]').forEach((t) => t.addEventListener('click', () => go('/' + t.dataset.route)));
  $('#side-logout').addEventListener('click', doLogout);
  $('#app-avatar').addEventListener('click', () => go('/profile'));
  const bell = $('#app-bell');
  if (bell) bell.addEventListener('click', () => go('/activity'));
  const mem = $('#app-members');
  if (mem) mem.addEventListener('click', () => go('/members'));
}

function updateUnread() {
  const txt = state.unread ? unreadLabel() : '';
  const dot = $('#bell-dot');
  if (dot) { dot.style.display = state.unread ? '' : 'none'; dot.textContent = txt; }
  const side = $('#side-unread');
  if (side) { side.style.display = state.unread ? '' : 'none'; side.textContent = txt; }
}

function startNotifyPoll() {
  if (state.poll) clearInterval(state.poll);
  state.poll = setInterval(async () => {
    if (document.hidden || !state.user || !state.user.isOwner) return;
    try {
      const me = await api('/api/me');
      const next = me.unreadNotifications || 0;
      if (next !== state.unread) {
        state.unread = next;
        updateUnread();
        if (next > 0 && $('#view')?.dataset.route !== 'activity') toast('New activity in your app — tap the bell.', 'info');
      }
    } catch { /* ignore */ }
  }, 25000);
}

async function doLogout() {
  try { await api('/api/logout', { method: 'POST' }); } catch { /* ignore */ }
  if (state.poll) { clearInterval(state.poll); state.poll = null; }
  state.user = null;
  state.content = null;
  state.unread = 0;
  location.hash = '';
  renderAuth('login');
  toast('You are signed out. See you soon!', 'info');
}

/* -------------------------------- dashboard ------------------------------- */

function nextLesson() {
  const done = state.user.stats.completed;
  return state.content.lessons.find((l) => !done.includes(l.id)) || null;
}

function statCard(ico, val, lab) {
  return `<div class="stat"><div class="stat-ico">${icon(ico, 'ico')}</div><div class="stat-val">${val}</div><div class="stat-lab">${lab}</div></div>`;
}

function badgeGrid(badges) {
  return `<div class="badges">
    ${badges.map((b) => `
      <div class="badge ${b.earned ? 'earned' : ''}">
        <div class="badge-emoji">${b.earned ? b.emoji : '🔒'}</div>
        <div class="badge-name">${esc(b.name)}</div>
        <div class="badge-desc">${esc(b.desc)}</div>
      </div>`).join('')}
  </div>`;
}

function viewDashboard(view) {
  view.dataset.route = 'dashboard';
  setActiveTab('dashboard');
  const u = state.user;
  const stats = u.stats;
  const lessons = state.content.lessons;
  const total = lessons.length;
  const pct = total ? Math.round((stats.lessonsCompleted / total) * 100) : 0;
  const next = nextLesson();
  const animals = state.content.animals;
  const nextAnimal = animals.find((a) => !a.unlocked);
  const unlocked = animals.filter((a) => a.unlocked).length;

  view.innerHTML = `
    <div class="page-head">
      <h1>Hello, ${esc(u.name.split(' ')[0])}</h1>
      <p>${next ? 'Ready for today\'s lesson? Ollie is waiting.' : 'You finished the whole course. Outstanding!'}</p>
    </div>

    <div class="stack">
      <section class="hero">
        <div class="hero-row">
          <div class="hero-copy">
            <h2>${next ? esc(next.title) : 'Course complete'}</h2>
            <p>${next ? esc(next.goal) : 'Replay any lesson to earn extra XP and keep your streak alive.'}</p>
          </div>
          <div class="hero-art">${octopusSVG(92)}</div>
        </div>
        <div class="hero-actions">
          ${next
            ? `<button class="btn btn-primary" id="continue">Continue lesson ${next.order} ${icon('arrow', 'ico ico-sm')}</button>
               <button class="btn btn-line" id="browse">All lessons</button>`
            : `<button class="btn btn-primary" id="browse">Review lessons</button>
               <button class="btn btn-line" id="to-games">Play a game</button>`}
        </div>
      </section>

      <div class="stats">
        ${statCard('star', stats.xp, 'Total XP')}
        ${statCard('book', `${stats.lessonsCompleted}/${total}`, 'Lessons done')}
        ${statCard('flame', stats.streak, 'Day streak')}
        ${statCard('paw', `${unlocked}/${animals.length}`, 'Animals')}
      </div>

      <section class="card">
        <div class="card-head">
          <h3 class="card-title">${icon('target', 'ico')} Course progress</h3>
          <div class="grow"></div>
          <span class="chip teal">${esc(u.level.code)} · ${esc(u.level.name)}</span>
        </div>
        <div class="bar-row"><span class="lab">Your journey</span><span class="val">${stats.lessonsCompleted} of ${total}</span></div>
        <div class="bar"><div class="bar-fill" style="width:${pct}%"></div></div>
        <p class="tiny muted" style="margin-top:12px">
          ${pct === 100 ? 'Course complete. Outstanding!' : `You are ${pct}% through the course. Keep going!`}
        </p>
      </section>

      <section class="card">
        <div class="card-head">
          <h3 class="card-title">${icon('paw', 'ico')} Next animal</h3>
          <div class="grow"></div>
          <button class="btn btn-quiet btn-sm" id="see-animals">See all</button>
        </div>
        ${nextAnimal ? `
          <div class="row">
            <div class="avatar gold" style="width:54px;height:54px;font-size:26px">${nextAnimal.emoji}</div>
            <div style="flex:1;min-width:0">
              <div style="font-weight:700">${esc(nextAnimal.name)}</div>
              <div class="tiny muted" style="margin-top:3px">
                ${Math.max(0, nextAnimal.unlockAt - (stats.sessions || 0)) === 0
                  ? 'Unlocked!'
                  : `${nextAnimal.unlockAt - (stats.sessions || 0)} more session${nextAnimal.unlockAt - (stats.sessions || 0) === 1 ? '' : 's'} to rescue it.`}
              </div>
            </div>
          </div>` : `<p class="tiny muted">You have rescued every ocean animal. Legendary!</p>`}
      </section>

      <section class="card">
        <div class="card-head">
          <h3 class="card-title">${icon('trophy', 'ico')} Achievements</h3>
          <div class="grow"></div>
          <span class="chip gold">${(u.badges || []).length}/${state.content.badges.length}</span>
        </div>
        ${badgeGrid(state.content.badges)}
      </section>

      <section class="card">
        <div class="card-head"><h3 class="card-title">${icon('spark', 'ico')} Ollie's tip</h3></div>
        <p class="tiny muted">${esc(tipFor(u))}</p>
      </section>
    </div>`;

  const cont = $('#continue');
  if (cont) cont.addEventListener('click', () => go('/lesson/' + next.id));
  $('#browse').addEventListener('click', () => go('/learn'));
  const tg = $('#to-games');
  if (tg) tg.addEventListener('click', () => go('/games'));
  $('#see-animals').addEventListener('click', () => go('/animals'));
}

function tipFor(u) {
  const tips = [
    'Practice speaking out loud, even when nobody is listening. Your mouth learns faster than your eyes.',
    'Short sessions every day beat one long session per week. Keep that streak going!',
    'Listen to an English song and try to catch five new words today.',
    'Repeat each new word five times: read it, say it, spell it, use it, then teach it to a friend.',
    'Do not fear mistakes — every mistake is a step closer to fluency.'
  ];
  return tips[u.stats.lessonsCompleted % tips.length];
}

/* --------------------------------- lessons -------------------------------- */

const TYPE_META = {
  vocab: { label: 'Vocabulary', ico: 'book' },
  grammar: { label: 'Grammar', ico: 'grid' },
  listen: { label: 'Listening', ico: 'volume' },
  speak: { label: 'Speaking', ico: 'mic' }
};
const TYPE_CHIP = { vocab: 'gold', grammar: 'leaf', listen: 'teal', speak: 'coral' };

function isLessonUnlocked(lesson) {
  return lesson.order <= state.user.stats.lessonsCompleted + 1;
}

function viewLearn(view) {
  view.dataset.route = 'learn';
  setActiveTab('learn');
  const done = state.user.stats.completed;

  view.innerHTML = `
    <div class="page-head">
      <h1>Lessons</h1>
      <p>Three levels, twelve lessons. Finish one to unlock the next and rescue an animal.</p>
    </div>
    ${state.content.levels.map((lvl) => {
      const lessons = state.content.lessons.filter((l) => l.level === lvl.id);
      const doneCount = lessons.filter((l) => done.includes(l.id)).length;
      return `
      <section class="level">
        <div class="level-head">
          <div class="level-badge" style="background:${lvl.color}">${esc(lvl.code)}</div>
          <div class="level-info">
            <h3>${esc(lvl.name)} <span class="muted" style="font-weight:500">· ${doneCount}/${lessons.length}</span></h3>
            <p>${esc(lvl.blurb)}</p>
          </div>
        </div>
        <div class="lesson-list">
          ${lessons.map((l) => {
            const isDone = done.includes(l.id);
            const unlocked = isLessonUnlocked(l);
            return `
            <button class="lesson ${isDone ? 'done' : ''} ${unlocked ? '' : 'locked'}" data-id="${l.id}" ${unlocked ? '' : 'disabled'}>
              <span class="lesson-emoji">${unlocked ? l.emoji : icon('lock', 'ico')}</span>
              <span class="lesson-main">
                <span class="lesson-num" style="display:block">Lesson ${l.order} · +${l.xp} XP</span>
                <span class="lesson-title" style="display:block">${esc(l.title)}</span>
                <span class="lesson-goal" style="display:block">${unlocked ? esc(l.goal) : 'Finish the previous lesson to unlock this one.'}</span>
                <span class="lesson-tags">
                  ${l.types.map((t) => `<span class="chip ${TYPE_CHIP[t]}">${TYPE_META[t].label}</span>`).join('')}
                </span>
              </span>
              ${isDone
                ? `<span class="lesson-mark">${icon('check', 'ico ico-sm')}</span>`
                : (unlocked ? `<span class="muted">${icon('arrow', 'ico')}</span>` : `<span class="lesson-lock">${icon('lock', 'ico')}</span>`)}
            </button>`;
          }).join('')}
        </div>
      </section>`;
    }).join('')}`;

  $$('.lesson[data-id]').forEach((n) => {
    if (n.disabled) return;
    n.addEventListener('click', () => go('/lesson/' + n.dataset.id));
  });
}

/* ------------------------------ lesson player ----------------------------- */

async function viewLesson(view, id) {
  view.dataset.route = 'lesson';
  setActiveTab('lesson');
  view.innerHTML = '<div class="spinner"></div>';
  let lesson;
  try {
    const data = await api('/api/lesson/' + id);
    lesson = data.lesson;
  } catch (err) {
    view.innerHTML = `<div class="center"><div><p class="muted">${esc(err.message)}</p>
      <button class="btn btn-primary" id="back" style="margin-top:14px">Back to lessons</button></div></div>`;
    $('#back').addEventListener('click', () => go('/learn'));
    return;
  }

  const results = [];
  let index = 0;

  const wrap = document.createElement('div');
  view.innerHTML = '';
  view.appendChild(wrap);

  function renderQuestion() {
    const ex = lesson.exercises[index];
    const total = lesson.exercises.length;
    const pct = Math.round((index / total) * 100);
    const meta = TYPE_META[ex.type];

    wrap.innerHTML = `
      <div class="player-bar">
        <button class="btn btn-quiet btn-sm" id="quit">${icon('back', 'ico ico-sm')} Exit</button>
        <div class="grow"></div>
        <span class="pill">${esc(lesson.emoji)} ${index + 1} / ${total}</span>
      </div>
      <div class="pbar"><span style="width:${pct}%"></span></div>

      <div class="quiz" style="margin-top:16px">
        <span class="quiz-type ${ex.type}">${icon(meta.ico, 'ico ico-sm')} ${meta.label}</span>
        ${renderExerciseBody(ex)}
        <div id="fb-slot"></div>
        <div class="player-actions">
          <div class="grow"></div>
          <button class="btn btn-primary btn-lg hidden" id="next-btn">Next ${icon('arrow', 'ico ico-sm')}</button>
        </div>
      </div>`;

    $('#quit').addEventListener('click', () => go('/learn'));

    if (ex.type === 'speak') bindSpeak(ex);
    else bindChoice(ex);

    if (ex.type === 'listen') {
      const btn = $('#replay');
      window.setTimeout(() => {
        if (document.body.contains(btn)) playAudio(ex.audio, btn);
      }, 320);
    }
  }

  function renderExerciseBody(ex) {
    if (ex.type === 'speak') {
      return `
        <div class="speak">
          <p class="tiny muted">Listen to Ollie, then say it out loud.</p>
          <div class="speak-line">“${esc(ex.text)}”</div>
          <div class="speak-actions">
            <button class="play-btn" id="replay">${icon('volume', 'ico')} Listen</button>
            ${SpeechRec ? `<button class="mic" id="mic" aria-label="Record">${icon('mic', 'ico-lg')}</button>` : ''}
          </div>
          <div class="heard" id="heard"></div>
          <div class="speak-actions" style="margin-top:18px">
            <button class="btn btn-line" id="self-correct">${icon('check', 'ico ico-sm')} I said it</button>
            <button class="btn btn-quiet" id="self-skip">Skip</button>
          </div>
        </div>`;
    }

    if (ex.type === 'listen') {
      return `
        <div class="row" style="margin-bottom:14px">
          <button class="play-btn" id="replay">${icon('volume', 'ico')} Play again</button>
        </div>
        <div class="quiz-prompt">Choose the sentence you heard:</div>
        <div class="choices" id="choices">
          ${choiceButtons(ex.options)}
        </div>`;
    }

    return `
      <div class="quiz-prompt">${esc(ex.prompt)}</div>
      <div class="choices" id="choices">
        ${choiceButtons(ex.options)}
      </div>`;
  }

  // The options are stored with the right answer first, so we shuffle them and
  // let the correct one land in a different place on every attempt.
  function choiceButtons(options) {
    return shuffle(options)
      .map((o, i) => `<button class="choice" data-val="${esc(o)}">
        <span class="choice-key">${'ABCD'[i]}</span><span>${esc(o)}</span></button>`)
      .join('');
  }

  function bindChoice(ex) {
    const replay = $('#replay');
    if (replay) {
      replay.addEventListener('click', () => playAudio(ex.audio || null, replay));
      if (ex.type === 'listen' && !ex.audio) {
        playAudio(null);
        // fall back to the voice if a clip is missing
        $('#replay').addEventListener('click', () => fallbackSpeak(ex.text));
      }
    }
    $$('#choices .choice').forEach((btn) => {
      btn.addEventListener('click', () => {
        const chosen = btn.dataset.val;
        const correct = chosen === ex.answer;
        results.push({ type: ex.type, correct });
        $$('#choices .choice').forEach((b) => {
          b.disabled = true;
          if (b.dataset.val === ex.answer) b.classList.add('correct');
          else if (b === btn) b.classList.add('wrong');
          else b.classList.add('dim');
        });
        showFeedback(correct, ex);
      });
    });
  }

  function bindSpeak(ex) {
    $('#replay').addEventListener('click', () => playAudio(ex.audio || null, $('#replay')));

    let recognized = null;
    const mic = $('#mic');
    if (mic) {
      mic.addEventListener('click', () => {
        const rec = new SpeechRec();
        rec.lang = 'en-US';
        rec.interimResults = false;
        rec.maxAlternatives = 1;
        mic.classList.add('rec');
        const heard = $('#heard');
        heard.textContent = 'Listening… speak now.';
        rec.onresult = (ev) => {
          recognized = ev.results[0][0].transcript;
          const sim = similarity(recognized, ex.text);
          heard.innerHTML = `I heard “<b>${esc(recognized)}</b>” — match ${Math.round(sim * 100)}%`;
        };
        rec.onerror = () => { heard.textContent = 'I could not hear you. Try again, or tap “I said it”.'; };
        rec.onend = () => mic.classList.remove('rec');
        try { rec.start(); } catch { mic.classList.remove('rec'); }
      });
    }

    $('#self-correct').addEventListener('click', () => {
      const correct = recognized ? similarity(recognized, ex.text) >= 0.55 : true;
      results.push({ type: ex.type, correct });
      finalizeSpeak(correct);
    });
    $('#self-skip').addEventListener('click', () => {
      results.push({ type: ex.type, correct: false });
      finalizeSpeak(false);
    });
  }

  function finalizeSpeak(correct) {
    $$('.speak-actions button, .speak .mic').forEach((b) => { b.disabled = true; });
    showFeedback(correct, lesson.exercises[index]);
  }

  function showFeedback(correct, ex) {
    const good = ['Nice one!', 'Perfect!', 'Well done!', 'Exactly right!', 'You are on fire!'];
    const bad = ['Almost! Let\'s learn this one.', 'Not quite — here is the answer.', 'Good try! Remember this one.'];
    const slot = $('#fb-slot');
    slot.innerHTML = `
      <div class="fb ${correct ? 'ok' : 'no'}">
        <span>${icon(correct ? 'check' : 'spark', 'ico')}</span>
        <div>
          <div style="font-weight:600">${correct ? pick(good) : pick(bad)}</div>
          ${ex.type === 'speak' ? '' : `<div class="tiny" style="margin-top:4px;opacity:.9">Correct answer: <b>${esc(ex.answer)}</b></div>`}
        </div>
      </div>`;
    const next = $('#next-btn');
    next.classList.remove('hidden');
    next.innerHTML = index === lesson.exercises.length - 1
      ? `Finish lesson ${icon('check', 'ico ico-sm')}`
      : `Next ${icon('arrow', 'ico ico-sm')}`;
    next.onclick = advance;
  }

  function advance() {
    index += 1;
    if (index < lesson.exercises.length) renderQuestion();
    else finishLesson();
  }

  async function finishLesson() {
    const correct = results.filter((r) => r.correct).length;
    const total = lesson.exercises.length;
    wrap.innerHTML = '<div class="spinner"></div>';
    try {
      const data = await api(`/api/lesson/${lesson.id}/complete`, { method: 'POST', body: { correct, total } });
      state.user = data.user;
      state.content = await api('/api/content');
      showResult(data, correct, total);
    } catch (err) {
      toast(err.message, 'err');
      go('/learn');
    }
  }

  function showResult(data, correct, total) {
    const accuracy = Math.round((correct / total) * 100);
    const perfect = correct === total;
    if (perfect || data.newlyUnlocked.length) confetti();

    openModal(`
      <div class="modal-emoji">${perfect ? '🏆' : accuracy >= 50 ? '🎉' : '💪'}</div>
      <h2>${perfect ? 'Flawless victory!' : accuracy >= 50 ? 'Lesson complete!' : 'Good effort!'}</h2>
      <p>You answered <b>${correct} of ${total}</b> correctly (${accuracy}%).</p>
      <div class="stats" style="margin-top:20px;text-align:left">
        ${statCard('star', `+${data.xpGained}`, 'XP earned')}
        ${statCard('flame', state.user.stats.streak, 'Day streak')}
      </div>
      ${data.newlyUnlocked.length ? `
        <div style="margin-top:22px;text-align:left">
          <div style="font-weight:700;font-size:15.5px">New animal rescued</div>
          <div class="unlock-list">
            ${data.newlyUnlocked.map((a) => `
              <div class="unlock-item">
                <div class="u-emoji">${a.emoji}</div>
                <div><div style="font-weight:700">${esc(a.name)}</div>
                <div class="tiny muted">${esc(a.fact)}</div></div>
              </div>`).join('')}
          </div>
        </div>` : ''}
      <div class="m-actions">
        <button class="btn btn-primary" id="m-next">Next lesson ${icon('arrow', 'ico ico-sm')}</button>
        <button class="btn btn-line" id="m-animals">My animals</button>
      </div>`,
      {
        onMount(root) {
          root.querySelector('#m-next').addEventListener('click', () => {
            closeModal();
            const nxt = nextLesson();
            if (nxt) go('/lesson/' + nxt.id); else go('/dashboard');
          });
          root.querySelector('#m-animals').addEventListener('click', () => { closeModal(); go('/animals'); });
        }
      });
  }

  renderQuestion();
}

/* --------------------------------- animals -------------------------------- */

function viewAnimals(view) {
  view.dataset.route = 'animals';
  setActiveTab('animals');
  const animals = state.content.animals;
  const unlocked = animals.filter((a) => a.unlocked).length;
  const nextAnimal = animals.find((a) => !a.unlocked);
  const sessions = state.user.stats.sessions || 0;
  const remaining = nextAnimal ? Math.max(0, nextAnimal.unlockAt - sessions) : 0;

  view.innerHTML = `
    <div class="page-head">
      <h1>My Animals</h1>
      <p>Every session you finish rescues a new friend from Ollie's ocean.</p>
    </div>

    <div class="stack">
      <section class="card">
        <div class="row">
          <div style="width:96px;flex:none">${octopusSVG(96)}</div>
          <div style="flex:1;min-width:0">
            <h3 style="font-size:18px">Ollie's ocean</h3>
            <p class="tiny muted" style="margin-top:6px">
              You have rescued <b>${unlocked}</b> of <b>${animals.length}</b> animals.
              ${nextAnimal ? ` ${remaining} more session${remaining === 1 ? '' : 's'} to free ${esc(nextAnimal.name)}.` : ' The whole ocean is free!'}
            </p>
            <div class="bar" style="margin-top:12px"><div class="bar-fill" style="width:${Math.round((unlocked / animals.length) * 100)}%"></div></div>
          </div>
        </div>
      </section>

      <div class="animals">
        ${animals.map((a) => `
          <div class="animal ${a.unlocked ? '' : 'locked'}">
            ${a.unlocked ? '' : `<span class="lock">${icon('lock', 'ico ico-sm')}</span>`}
            <div class="animal-emoji">${a.emoji}</div>
            <div class="animal-name">${a.unlocked ? esc(a.name) : 'Mystery animal'}</div>
            <div class="animal-fact">${a.unlocked ? esc(a.fact) : `Unlocks in ${Math.max(0, a.unlockAt - sessions)} session${Math.max(0, a.unlockAt - sessions) === 1 ? '' : 's'}.`}</div>
          </div>`).join('')}
      </div>
    </div>`;
}

/* ---------------------------------- games --------------------------------- */

const GAME_ICON = { wordrush: 'spark', listen: 'volume', memory: 'grid' };

async function viewGames(view) {
  view.dataset.route = 'games';
  setActiveTab('games');
  view.innerHTML = '<div class="spinner"></div>';
  let data;
  try {
    data = await api('/api/games');
  } catch (err) {
    view.innerHTML = `<div class="empty">${esc(err.message)}</div>`;
    return;
  }
  const bests = data.bests || {};

  view.innerHTML = `
    <div class="page-head">
      <h1>Games</h1>
      <p>Play a quick round, beat your best and climb the leaderboard.</p>
    </div>

    <div class="games">
      ${data.games.map((g) => `
        <button class="game-card" data-game="${g.id}">
          <span class="accent" style="background:${g.color}"></span>
          <div class="game-top">
            <span class="game-ico" style="background:linear-gradient(145deg, ${g.color}, ${shade(g.color, -22)})">${icon(GAME_ICON[g.id] || 'game', 'ico-lg')}</span>
            <span>
              <span class="game-name" style="display:block;font-family:var(--font-display);font-weight:700">${esc(g.name)}</span>
              <span class="game-tag" style="display:block">${esc(g.tagline)}</span>
            </span>
          </div>
          <div class="game-foot">
            <span class="chip ${bests[g.id] != null ? 'gold' : ''}">
              ${bests[g.id] != null ? `Best ${bests[g.id]} ${g.scoreUnit}` : 'Not played yet'}
            </span>
            <span class="btn btn-primary btn-sm">Play</span>
          </div>
        </button>`).join('')}
    </div>

    <div class="card" style="margin-top:16px">
      <div class="card-head"><h3 class="card-title">${icon('trophy', 'ico')} Leaderboard</h3></div>
      <p class="tiny muted">See who is in first place across every game.</p>
      <button class="btn btn-line btn-block" id="to-ranks" style="margin-top:14px">Open leaderboard ${icon('arrow', 'ico ico-sm')}</button>
    </div>`;

  $$('.game-card[data-game]').forEach((c) => c.addEventListener('click', () => go('/game/' + c.dataset.game)));
  $('#to-ranks').addEventListener('click', () => go('/rankings'));
}

// Small helper to darken a hex colour for gradients.
function shade(hex, amt) {
  const m = String(hex).replace('#', '');
  const n = parseInt(m.length === 3 ? m.split('').map((c) => c + c).join('') : m, 16);
  const clamp = (v) => Math.max(0, Math.min(255, v));
  const r = clamp((n >> 16) + amt), g = clamp(((n >> 8) & 255) + amt), b = clamp((n & 255) + amt);
  return `rgb(${r},${g},${b})`;
}

/* ------------------------------ game: player ------------------------------ */

async function playGame(view, gameId) {
  view.dataset.route = 'game';
  setActiveTab('game');
  view.innerHTML = '<div class="spinner"></div>';
  let data;
  try {
    data = await api('/api/games');
  } catch (err) {
    view.innerHTML = `<div class="empty">${esc(err.message)}</div>`;
    return;
  }
  const game = data.games.find((g) => g.id === gameId);
  if (!game) { view.innerHTML = '<div class="empty">That game does not exist.</div>'; return; }
  const bank = data.wordbank.filter((w) => w.word && w.meaning);

  const wrap = document.createElement('div');
  wrap.className = 'gplay';
  view.innerHTML = '';
  view.appendChild(wrap);

  if (game.id === 'wordrush') startWordRush(wrap, game, bank);
  else if (game.id === 'listen') startListenGame(wrap, game, bank);
  else if (game.id === 'memory') startMemory(wrap, game, bank);
  else wrap.innerHTML = '<div class="empty">Coming soon.</div>';
}

function gameHud(game) {
  return `
    <div class="player-bar">
      <button class="btn btn-quiet btn-sm" id="gquit">${icon('back', 'ico ico-sm')} Exit</button>
      <div class="grow"></div>
      <span class="pill">${esc(game.name)}</span>
    </div>
    <div class="ghud">
      <div class="hud-stat"><div class="hud-val" id="hud-a">0</div><div class="hud-lab" id="hud-a-lab">Score</div></div>
      <div class="grow"></div>
      <div class="hud-stat"><div class="hud-val" id="hud-b">—</div><div class="hud-lab" id="hud-b-lab">Combo</div></div>
      <div class="grow"></div>
      <div class="hud-stat"><div class="hud-val" id="hud-c">—</div><div class="hud-lab" id="hud-c-lab">Time</div></div>
    </div>
    <div class="gtimer" id="gtimer"><span id="gtimer-fill" style="width:100%"></span></div>`;
}

function trackTimer(id) {
  window.__octoTimers = window.__octoTimers || [];
  window.__octoTimers.push(id);
  return id;
}

/* --- Word Rush --- */

function startWordRush(wrap, game, bank) {
  let score = 0, combo = 0, bestCombo = 0, strikes = 0, timeLeft = 45;
  let current = null;

  wrap.innerHTML = `
    ${gameHud(game)}
    <div id="gr-area"></div>`;

  $('#gquit').addEventListener('click', () => go('/games'));
  $('#hud-b-lab').textContent = 'Combo';
  $('#hud-c-lab').textContent = 'Time';

  function hud() {
    $('#hud-a').textContent = score;
    $('#hud-b').textContent = 'x' + Math.max(1, combo);
    $('#hud-c').textContent = timeLeft + 's';
    $('#gtimer-fill').style.width = (timeLeft / 45 * 100) + '%';
    $('#gtimer').classList.toggle('low', timeLeft <= 10);
  }

  function nextRound() {
    const w = pick(bank);
    current = w;
    const wrong = shuffle(bank.filter((x) => x.word !== w.word)).slice(0, 3).map((x) => x.meaning);
    const options = shuffle([w.meaning, ...wrong]);
    $('#gr-area').innerHTML = `
      <div class="gprompt">
        <div class="gword">${esc(w.word)}</div>
        <div class="gsub">What does it mean?</div>
      </div>
      <div class="choices" id="g-choices">
        ${options.map((o, i) => `<button class="choice" data-val="${esc(o)}">
          <span class="choice-key">${'ABCD'[i]}</span><span>${esc(o)}</span></button>`).join('')}
      </div>`;
    $$('#g-choices .choice').forEach((btn) => {
      btn.addEventListener('click', () => answer(btn));
    });
  }

  function answer(btn) {
    const correct = btn.dataset.val === current.meaning;
    $$('#g-choices .choice').forEach((b) => {
      b.disabled = true;
      if (b.dataset.val === current.meaning) b.classList.add('correct');
      else if (b === btn) b.classList.add('wrong');
      else b.classList.add('dim');
    });
    if (correct) {
      combo += 1;
      bestCombo = Math.max(bestCombo, combo);
      score += 10 + Math.min(combo - 1, 5) * 5;
    } else {
      combo = 0;
      strikes += 1;
    }
    hud();
    if (strikes >= 3) return end('Three misses in a row.');
    window.setTimeout(() => { if (document.body.contains(wrap)) nextRound(); }, correct ? 420 : 900);
  }

  function end(reason) {
    stopGame();
    finishGame(game, score, { reason, combo: bestCombo });
  }

  const t = trackTimer(setInterval(() => {
    timeLeft -= 1;
    hud();
    if (timeLeft <= 0) end('Time is up!');
  }, 1000));
  window.__octoTimers = window.__octoTimers || [];
  window.__octoTimers = window.__octoTimers.filter((x) => x !== t).concat(t);

  hud();
  nextRound();
}

/* --- Listen & Tap --- */

function startListenGame(wrap, game, bank) {
  const withAudio = bank.filter((w) => w.audio);
  const pool = withAudio.length >= 4 ? withAudio : bank;

  let score = 0, combo = 0, bestCombo = 0, strikes = 0, timeLeft = 45;
  let current = null;

  wrap.innerHTML = `
    ${gameHud(game)}
    <div id="gr-area"></div>`;
  $('#gquit').addEventListener('click', () => go('/games'));
  $('#hud-a-lab').textContent = 'Score';
  $('#hud-b-lab').textContent = 'Combo';
  $('#hud-c-lab').textContent = 'Time';

  function hud() {
    $('#hud-a').textContent = score;
    $('#hud-b').textContent = 'x' + Math.max(1, combo);
    $('#hud-c').textContent = timeLeft + 's';
    $('#gtimer-fill').style.width = (timeLeft / 45 * 100) + '%';
    $('#gtimer').classList.toggle('low', timeLeft <= 10);
  }

  function nextRound() {
    const w = pick(pool);
    current = w;
    const wrong = shuffle(pool.filter((x) => x.word !== w.word)).slice(0, 3).map((x) => x.word);
    const options = shuffle([w.word, ...wrong]);
    $('#gr-area').innerHTML = `
      <div class="gprompt">
        <button class="play-btn" id="g-play" style="margin:0 auto">${icon('volume', 'ico')} Play the word</button>
        <div class="gsub" style="margin-top:14px">Tap the word you hear.</div>
      </div>
      <div class="choices" id="g-choices">
        ${options.map((o, i) => `<button class="choice" data-val="${esc(o)}">
          <span class="choice-key">${'ABCD'[i]}</span><span>${esc(o)}</span></button>`).join('')}
      </div>`;
    const play = $('#g-play');
    play.addEventListener('click', () => playAudio(w.audio, play));
    window.setTimeout(() => { if (document.body.contains(play)) playAudio(w.audio, play); }, 300);
    $$('#g-choices .choice').forEach((btn) => btn.addEventListener('click', () => answer(btn)));
  }

  function answer(btn) {
    const correct = btn.dataset.val === current.word;
    $$('#g-choices .choice').forEach((b) => {
      b.disabled = true;
      if (b.dataset.val === current.word) b.classList.add('correct');
      else if (b === btn) b.classList.add('wrong');
      else b.classList.add('dim');
    });
    if (correct) { combo += 1; bestCombo = Math.max(bestCombo, combo); score += 10 + Math.min(combo - 1, 5) * 5; }
    else { combo = 0; strikes += 1; }
    hud();
    if (strikes >= 3) return end('Three misses in a row.');
    window.setTimeout(() => { if (document.body.contains(wrap)) nextRound(); }, correct ? 460 : 950);
  }

  function end(reason) {
    stopGame();
    finishGame(game, score, { reason, combo: bestCombo });
  }

  trackTimer(setInterval(() => {
    timeLeft -= 1;
    hud();
    if (timeLeft <= 0) end('Time is up!');
  }, 1000));

  hud();
  nextRound();
}

/* --- Memory Dive --- */

function startMemory(wrap, game, bank) {
  const pairs = 6;
  const chosen = shuffle(bank).slice(0, pairs);
  const tiles = [];
  chosen.forEach((w, i) => {
    tiles.push({ pair: i, face: 'word', text: w.word });
    tiles.push({ pair: i, face: 'emoji', text: w.emoji });
  });
  const deck = shuffle(tiles);

  let open = [];
  let matched = 0;
  let moves = 0;
  let seconds = 0;
  let locked = false;

  wrap.innerHTML = `
    ${gameHud(game)}
    <div class="mem-grid" id="mem" style="grid-template-columns:repeat(4,1fr)">
      ${deck.map((t, i) => `
        <button class="mem-tile" data-i="${i}" aria-label="Hidden tile">
          <span class="face back">${icon('paw', 'ico')}</span>
          <span class="face front" style="${t.face === 'emoji' ? 'font-size:30px' : 'font-size:14px'}">${esc(t.text)}</span>
        </button>`).join('')}
    </div>`;
  $('#gquit').addEventListener('click', () => go('/games'));
  $('#hud-a-lab').textContent = 'Pairs';
  $('#hud-b-lab').textContent = 'Moves';
  $('#hud-c-lab').textContent = 'Time';
  $('#gtimer').style.display = 'none';

  function hud() {
    $('#hud-a').textContent = `${matched}/${pairs}`;
    $('#hud-b').textContent = moves;
    $('#hud-c').textContent = seconds + 's';
  }

  $$('.mem-tile').forEach((el) => {
    el.addEventListener('click', () => {
      const i = Number(el.dataset.i);
      if (locked || el.classList.contains('open') || el.classList.contains('matched')) return;
      el.classList.add('open');
      open.push(i);
      if (open.length === 2) {
        moves += 1;
        hud();
        const [a, b] = open;
        const ta = deck[a], tb = deck[b];
        if (ta.pair === tb.pair && ta.face !== tb.face) {
          $$(`.mem-tile[data-i="${a}"], .mem-tile[data-i="${b}"]`).forEach((t) => t.classList.add('matched'));
          matched += 1;
          open = [];
          hud();
          if (matched === pairs) end();
        } else {
          locked = true;
          $$(`.mem-tile[data-i="${a}"], .mem-tile[data-i="${b}"]`).forEach((t) => t.classList.add('wrong'));
          window.setTimeout(() => {
            $$(`.mem-tile[data-i="${a}"], .mem-tile[data-i="${b}"]`).forEach((t) => t.classList.remove('open', 'wrong'));
            open = [];
            locked = false;
          }, 780);
        }
      }
    });
  });

  function end() {
    stopGame();
    const score = Math.max(60, Math.round(1200 - moves * 16 - seconds * 6));
    window.setTimeout(() => finishGame(game, score, {
      reason: `All pairs found in ${moves} moves and ${seconds}.`
    }), 500);
  }

  trackTimer(setInterval(() => { seconds += 1; hud(); }, 1000));

  hud();
}

/* ------------------------------ game: finish ------------------------------ */

async function finishGame(game, score, { reason } = {}) {
  let res = { best: score, improved: false, rank: null, total: 0, newlyUnlocked: [] };
  try {
    res = await api('/api/games/score', { method: 'POST', body: { game: game.id, score } });
  } catch (err) {
    toast(err.message, 'err');
  }
  if (!res.newlyUnlocked) res.newlyUnlocked = [];
  if (res.improved || res.newlyUnlocked.length) confetti();
  if (res.user) {
    state.user = res.user;
    try { state.content = await api('/api/content'); } catch { /* keep the old content */ }
  }

  openModal(`
    <div class="modal-emoji">${res.improved ? '🏅' : '🎮'}</div>
    <h2>${res.improved ? 'New personal best!' : 'Nice run!'}</h2>
    <p>${esc(reason || game.name)}</p>
    <div class="stats" style="margin-top:20px;text-align:left">
      ${statCard('star', `${score}`, `${game.scoreUnit} this round`)}
      ${statCard('crown', `${res.best}`, 'Your best')}
    </div>
    ${res.newlyUnlocked.length ? `
      <div style="margin-top:22px;text-align:left">
        <div style="font-weight:700;font-size:15.5px">New animal rescued</div>
        <div class="unlock-list">
          ${res.newlyUnlocked.map((a) => `
            <div class="unlock-item">
              <div class="u-emoji">${a.emoji}</div>
              <div><div style="font-weight:700">${esc(a.name)}</div>
              <div class="tiny muted">${esc(a.fact)}</div></div>
            </div>`).join('')}
        </div>
      </div>` : ''}
    ${res.rank ? `<p class="tiny muted" style="margin-top:14px">You are ranked <b>#${res.rank}</b> of ${res.total} player${res.total === 1 ? '' : 's'} in ${esc(game.name)}.</p>` : ''}
    <div class="m-actions">
      <button class="btn btn-primary" id="gm-again">${icon('refresh', 'ico ico-sm')} Play again</button>
      <button class="btn btn-line" id="gm-ranks">${icon('trophy', 'ico ico-sm')} Leaderboard</button>
    </div>`,
    {
      onMount(root) {
        root.querySelector('#gm-again').addEventListener('click', () => { closeModal(); playGame($('#view'), game.id); });
        root.querySelector('#gm-ranks').addEventListener('click', () => { closeModal(); go('/rankings/' + game.id); });
      }
    });
}

/* -------------------------------- rankings -------------------------------- */

async function viewRankings(view, gameParam) {
  view.dataset.route = 'rankings';
  setActiveTab('rankings');
  view.innerHTML = '<div class="spinner"></div>';
  let data;
  try {
    data = await api('/api/rankings');
  } catch (err) {
    view.innerHTML = `<div class="empty">${esc(err.message)}</div>`;
    return;
  }
  const games = data.games;
  const gid = games.some((g) => g.id === gameParam) ? gameParam : (games[0] && games[0].id);

  view.innerHTML = `
    <div class="page-head">
      <h1>Leaderboard</h1>
      <p>Who is in first place? Play a game or finish lessons to climb the ranks.</p>
    </div>
    <div class="seg" id="rank-seg" style="margin-bottom:16px">
      <button data-g="xp" class="${gid === 'xp' ? 'on' : ''}">Lessons XP</button>
      ${games.map((g) => `<button data-g="${g.id}">${esc(g.name)}</button>`).join('')}
    </div>
    <div id="rank-body"></div>`;

  $$('#rank-seg button').forEach((b) => b.addEventListener('click', () => {
    $$('#rank-seg button').forEach((x) => x.classList.toggle('on', x === b));
    renderBoard(b.dataset.g);
  }));

  async function renderBoard(which) {
    const body = $('#rank-body');
    body.innerHTML = '<div class="spinner"></div>';

    if (which === 'xp') {
      let rows;
      try {
        rows = (await api('/api/leaderboard')).leaderboard.map((r) => ({
          rank: r.rank, name: r.name, score: r.xp, unit: 'XP',
          sub: `${r.lessons} lessons · ${r.streak} day streak`, isMe: r.isMe
        }));
      } catch (err) { body.innerHTML = `<div class="empty">${esc(err.message)}</div>`; return; }
      paint(body, 'Lessons XP', rows);
      return;
    }

    const g = games.find((x) => x.id === which);
    let rows = (data.rankings[which] || []).map((r) => ({
      rank: r.rank, name: r.name, score: r.score, unit: g ? g.scoreUnit : 'pts',
      sub: `best on ${timeAgo(r.at)}`, isMe: r.isMe
    }));

    // Make sure the current player always sees their own position.
    if (!rows.some((r) => r.isMe)) {
      try {
        const mine = await api('/api/games');
        if (mine.bests && mine.bests[which] != null) {
          rows.push({ rank: null, name: state.user.name, score: mine.bests[which], unit: g.scoreUnit, sub: 'your best', isMe: true });
        }
      } catch { /* ignore */ }
    }
    paint(body, g ? g.name : which, rows);
  }

  function paint(body, title, rows) {
    if (!rows.length) {
      body.innerHTML = `<div class="card empty">No scores yet. Be the first to play ${esc(title)}!</div>`;
      return;
    }
    const top = rows[0];
    const rest = rows.slice(1);

    body.innerHTML = `
      <div class="crown" style="margin-bottom:14px">
        <div class="avatar gold" style="width:48px;height:48px">${icon('crown', 'ico-lg')}</div>
        <div style="flex:1;min-width:0">
          <div class="eyebrow">1st place · ${esc(title)}</div>
          <div style="font-family:var(--font-display);font-weight:700;font-size:18px">${esc(top.name)}${top.isMe ? ' (you)' : ''}</div>
        </div>
        <div class="rank-score">${top.score}<span class="tiny muted" style="font-weight:600;font-family:var(--font-body)"> ${esc(top.unit)}</span></div>
      </div>
      ${rest.length ? `<div class="ranks">
        ${rest.map((r) => `
          <div class="rank-row ${r.isMe ? 'me' : ''}">
            <div class="rank-no ${r.rank === 2 ? 'silver' : r.rank === 3 ? 'bronze' : ''}">${r.rank ?? '—'}</div>
            <div class="rank-name">${esc(r.name)}${r.isMe ? ' <span class="chip teal">you</span>' : ''}
              <div class="tiny muted" style="font-weight:500">${esc(r.sub || '')}</div>
            </div>
            <div class="rank-score">${r.score}<span class="tiny muted" style="font-weight:600;font-family:var(--font-body)"> ${esc(r.unit)}</span></div>
          </div>`).join('')}
      </div>` : ''}`;
  }

  renderBoard(gid);
}

/* --------------------------------- profile -------------------------------- */

async function viewProfile(view) {
  view.dataset.route = 'profile';
  setActiveTab('profile');
  const u = state.user;

  view.innerHTML = `
    <div class="page-head"><h1>My Profile</h1><p>Your learning account at a glance.</p></div>

    <div class="stack">
      <section class="card">
        <div class="row">
          <div class="avatar" style="width:70px;height:70px;font-size:28px">${esc(initials(u.name))}</div>
          <div style="flex:1;min-width:0">
            <h3 style="font-size:21px">${esc(u.name)}</h3>
            <div class="tiny muted" style="margin-top:4px;word-break:break-all">${esc(u.email)}</div>
            <div style="margin-top:9px">
              <span class="chip ${u.isOwner ? 'gold' : 'teal'}">${u.isOwner ? icon('crown', 'ico ico-sm') + ' Owner' : 'Learner'}</span>
            </div>
          </div>
        </div>
        <div style="margin-top:20px;display:grid;gap:10px">
          <div class="spread"><span class="tiny muted">Current level</span><b class="tiny">${esc(u.level.code)} · ${esc(u.level.name)}</b></div>
          <div class="spread"><span class="tiny muted">Member since</span><b class="tiny">${fmtDate(u.createdAt)}</b></div>
          <div class="spread"><span class="tiny muted">Last active</span><b class="tiny">${timeAgo(u.lastActiveAt)}</b></div>
        </div>
      </section>

      <div class="stats">
        ${statCard('star', u.stats.xp, 'Total XP')}
        ${statCard('book', u.stats.lessonsCompleted, 'Lessons done')}
        ${statCard('flame', u.stats.streak, 'Day streak')}
        ${statCard('target', u.stats.perfectLessons, 'Perfect lessons')}
      </div>

      <section class="card">
        <div class="card-head"><h3 class="card-title">${icon('trophy', 'ico')} Achievements</h3></div>
        ${badgeGrid(state.content.badges)}
      </section>

      <section class="card">
        <div class="card-head"><h3 class="card-title">${icon('spark', 'ico')} Look &amp; feel</h3></div>
        <p class="tiny muted">Pick the colour you like best. It stays on this device.</p>
        <div class="theme-grid">
          ${THEMES.map((t) => `
            <button class="theme-pick ${t.id === currentTheme() ? 'on' : ''}" data-theme-pick="${t.id}">
              <span class="dot" style="background:${t.swatch}"></span>
              <span class="tiny">${esc(t.name)}</span>
            </button>`).join('')}
        </div>
      </section>

      ${u.isOwner ? `
      <section class="card">
        <div class="card-head"><h3 class="card-title">${icon('crown', 'ico')} Owner tools</h3></div>
        <div style="display:grid;gap:8px">
          <button class="btn btn-line btn-block" data-go="/members">${icon('users', 'ico ico-sm')} Members &amp; progress</button>
          <button class="btn btn-line btn-block" data-go="/activity">${icon('bell', 'ico ico-sm')} Activity &amp; notifications</button>
          <button class="btn btn-line btn-block" data-go="/settings">${icon('gear', 'ico ico-sm')} Settings</button>
        </div>
      </section>` : ''}

      <button class="btn btn-coral btn-block" id="prof-logout">${icon('logout', 'ico ico-sm')} Sign out</button>
    </div>`;

  $$('[data-go]').forEach((b) => b.addEventListener('click', () => go(b.dataset.go)));
  $$('[data-theme-pick]').forEach((b) => b.addEventListener('click', () => {
    applyTheme(b.dataset.themePick);
    viewProfile(view);
  }));
  $('#prof-logout').addEventListener('click', doLogout);
}

/* ---------------------------------- owner --------------------------------- */

function memberRow(u, colorIdx) {
  const colors = ['', 'coral', 'gold'];
  const pct = u.lessonsTotal ? Math.round((u.lessonsCompleted / u.lessonsTotal) * 100) : 0;
  return `
    <button class="card" data-id="${u.id}" style="width:100%;text-align:left;padding:15px">
      <div class="row">
        <div class="avatar ${colors[colorIdx % 3]}">${esc(initials(u.name))}</div>
        <div style="flex:1;min-width:0">
          <div class="row" style="gap:7px">
            <b style="font-size:15.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(u.name)}</b>
            ${u.role === 'owner' ? `<span class="chip gold">${icon('crown', 'ico ico-sm')} Owner</span>` : ''}
          </div>
          <div class="tiny muted" style="margin-top:3px;word-break:break-all">${esc(u.email)}</div>
        </div>
        <div class="tiny muted nowrap">${timeAgo(u.lastActiveAt)}</div>
      </div>
      <div class="bar" style="margin-top:12px"><div class="bar-fill" style="width:${pct}%"></div></div>
      <div class="chips" style="margin-top:11px">
        <span class="chip teal">${esc(u.level.code)} ${esc(u.level.name)}</span>
        <span class="chip">${u.lessonsCompleted}/${u.lessonsTotal} lessons</span>
        <span class="chip gold">${icon('star', 'ico ico-sm')} ${u.xp} XP</span>
        <span class="chip coral">${icon('flame', 'ico ico-sm')} ${u.streak}</span>
        <span class="chip leaf">${icon('paw', 'ico ico-sm')} ${u.animalsUnlocked}</span>
      </div>
    </button>`;
}

async function viewMembers(view) {
  view.dataset.route = 'members';
  setActiveTab('members');
  view.innerHTML = '<div class="spinner"></div>';
  let data;
  try {
    data = await api('/api/admin/users');
  } catch (err) {
    view.innerHTML = `<div class="empty">${esc(err.message)}</div>`;
    return;
  }
  const { summary, users } = data;

  view.innerHTML = `
    <div class="page-head">
      <h1>Members</h1>
      <p>Everyone who joined, with their email and progress.</p>
    </div>

    <div class="stats">
      ${statCard('users', summary.totalUsers, 'Members')}
      ${statCard('book', summary.learners, 'Learners')}
      ${statCard('activity', summary.activeToday, 'Active today')}
      ${statCard('star', summary.totalXp, 'XP earned')}
    </div>

    <div class="tools" style="margin-top:16px">
      <div class="search">
        ${icon('search', 'ico ico-sm')}
        <input class="input" id="member-search" type="search" placeholder="Search name or email…" />
      </div>
      <button class="icon-btn" id="member-refresh" aria-label="Refresh">${icon('refresh', 'ico')}</button>
      <button class="icon-btn" id="member-add" aria-label="Add member">${icon('plus', 'ico')}</button>
    </div>

    <div class="stack" id="member-list"></div>
    <p class="empty" id="member-empty" style="display:none">No member matches that search.</p>`;

  const list = $('#member-list');
  function renderItems(list2) {
    list.innerHTML = list2.length
      ? list2.map((u, i) => memberRow(u, i)).join('')
      : '';
    $('#member-empty').style.display = list2.length ? 'none' : 'block';
    $$('#member-list [data-id]').forEach((el) => el.addEventListener('click', () => openMemberDetail(users.find((x) => x.id === el.dataset.id))));
  }

  renderItems(users);
  $('#member-search').addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    renderItems(users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)));
  });
  $('#member-refresh').addEventListener('click', () => viewMembers(view));
  $('#member-add').addEventListener('click', () => openAddMember(() => viewMembers(view), true));
}

function openMemberDetail(u) {
  if (!u) return;
  const doneIds = u.completedLessonIds || [];
  const bests = u.gameBests || {};
  const lessons = state.content.lessons;

  openSheet(`
    <div class="sheet-head">
      <div class="avatar">${esc(initials(u.name))}</div>
      <div class="grow" style="min-width:0">
        <div style="font-family:var(--font-display);font-weight:700;font-size:18px">${esc(u.name)}</div>
        <div class="tiny muted" style="word-break:break-all">${esc(u.email)}</div>
      </div>
      <button class="icon-btn" id="sheet-close" aria-label="Close">${icon('close', 'ico')}</button>
    </div>

    <div class="chips" style="margin-bottom:16px">
      <span class="chip ${u.role === 'owner' ? 'gold' : 'teal'}">${u.role === 'owner' ? 'Owner' : 'Learner'}</span>
      <span class="chip">${esc(u.level.code)} ${esc(u.level.name)}</span>
      <span class="chip">Joined ${fmtDate(u.createdAt)}</span>
      <span class="chip">Active ${timeAgo(u.lastActiveAt)}</span>
    </div>

    <div class="stats" style="grid-template-columns:1fr 1fr 1fr;margin-bottom:16px">
      <div class="stat"><div class="stat-val">${u.xp}</div><div class="stat-lab">XP</div></div>
      <div class="stat"><div class="stat-val">${u.lessonsCompleted}/${u.lessonsTotal}</div><div class="stat-lab">Lessons</div></div>
      <div class="stat"><div class="stat-val">${u.animalsUnlocked}</div><div class="stat-lab">Animals</div></div>
    </div>

    <div class="card" style="padding:14px;margin-bottom:16px">
      <div class="card-head" style="margin-bottom:10px"><h3 class="card-title">${icon('trophy', 'ico ico-sm')} Game bests</h3></div>
      <div class="chips">
        ${['wordrush', 'listen', 'memory'].map((g) => `
          <span class="chip ${bests[g] != null ? 'gold' : ''}">${g}: ${bests[g] != null ? bests[g] : '—'}</span>`).join('')}
      </div>
    </div>

    <div style="font-weight:700;font-size:14.5px;margin-bottom:9px">Lessons completed</div>
    <div class="chips" style="margin-bottom:18px">
      ${lessons.map((l) => `
        <span class="chip ${doneIds.includes(l.id) ? 'leaf' : ''}" style="${doneIds.includes(l.id) ? '' : 'opacity:.55'}">
          ${doneIds.includes(l.id) ? '✓' : '○'} ${l.order}. ${esc(l.title)}
        </span>`).join('')}
    </div>`,
    { onMount(root) { root.querySelector('#sheet-close').addEventListener('click', closeSheet); } });
}

function openAddMember(onDone, asSheet) {
  const form = `
    <form id="add-form" novalidate>
      <div class="field"><label for="a-name">Full name</label>
        <input class="input" id="a-name" type="text" placeholder="e.g. Maria Lopez" /></div>
      <div class="field"><label for="a-email">Email</label>
        <input class="input" id="a-email" type="email" placeholder="name@example.com" /></div>
      <div class="field"><label for="a-pass">Temporary password</label>
        <input class="input" id="a-pass" type="text" placeholder="At least 6 characters" /></div>
      <div class="field"><label for="a-role">Role</label>
        <select class="input" id="a-role">
          <option value="learner">Learner</option>
          <option value="owner">Owner</option>
        </select></div>
      <div class="form-msg" id="a-msg"></div>
      <div class="m-actions" style="margin-top:18px">
        <button class="btn btn-primary" type="submit" id="a-submit">Create account</button>
        ${asSheet ? '<button class="btn btn-line" type="button" id="a-cancel">Cancel</button>' : ''}
      </div>
    </form>`;

  const mount = (root) => {
    const form2 = root.querySelector('#add-form');
    form2.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = root.querySelector('#a-msg');
      const btn = root.querySelector('#a-submit');
      msg.className = 'form-msg';
      msg.textContent = '';
      btn.disabled = true;
      btn.textContent = 'Creating…';
      try {
        await api('/api/admin/users', {
          method: 'POST',
          body: {
            name: root.querySelector('#a-name').value.trim(),
            email: root.querySelector('#a-email').value.trim(),
            password: root.querySelector('#a-pass').value,
            role: root.querySelector('#a-role').value
          }
        });
        toast('Member added. They can sign in right away.', 'ok');
        if (asSheet) closeSheet(); else closeModal();
        if (onDone) onDone();
      } catch (err) {
        msg.className = 'form-msg err';
        msg.textContent = err.message;
        btn.disabled = false;
        btn.textContent = 'Create account';
      }
    });
    const cancel = root.querySelector('#a-cancel');
    if (cancel) cancel.addEventListener('click', closeSheet);
  };

  if (asSheet) {
    openSheet(`
      <div class="sheet-head">
        <div class="grow">
          <div style="font-family:var(--font-display);font-weight:700;font-size:19px">Add a member</div>
          <div class="tiny muted">Create an account for someone new.</div>
        </div>
        <button class="icon-btn" id="sheet-close" aria-label="Close">${icon('close', 'ico')}</button>
      </div>
      ${form}`,
      { onMount(root) { root.querySelector('#sheet-close').addEventListener('click', closeSheet); mount(root); } });
  } else {
    openModal(`
      <div class="modal-emoji">${icon('plus', 'ico-lg')}</div>
      <h2>Add a member</h2>
      <p>Create an account and share the password with them.</p>
      <div style="text-align:left;margin-top:18px">${form}</div>`,
      { onMount: mount });
  }
}

async function viewActivity(view) {
  view.dataset.route = 'activity';
  setActiveTab('activity');
  view.innerHTML = '<div class="spinner"></div>';
  let data;
  try {
    data = await api('/api/admin/notifications');
  } catch (err) {
    view.innerHTML = `<div class="empty">${esc(err.message)}</div>`;
    return;
  }
  const list = data.notifications || [];

  const LABEL = {
    join: { ico: 'plus', cls: 'join', text: 'joined the app' },
    login: { ico: 'user', cls: 'login', text: 'signed in' },
    added: { ico: 'users', cls: 'added', text: 'was added by you' }
  };

  view.innerHTML = `
    <div class="page-head">
      <h1>Activity</h1>
      <p>You get a note here every time somebody joins or signs in.</p>
    </div>
    <section class="card">
      ${list.length ? `<div class="act-list">
        ${list.map((n) => {
          const meta = LABEL[n.type] || LABEL.login;
          return `
          <div class="act-item">
            <div class="act-ico ${meta.cls}">${icon(meta.ico, 'ico ico-sm')}</div>
            <div class="act-main">
              <div class="act-name">${esc(n.name)} <span class="muted" style="font-weight:500">${meta.text}</span></div>
              <div class="act-mail">${esc(n.email)}</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:5px">
              <div class="act-time">${timeAgo(n.at)}</div>
              ${n.read ? '' : '<span class="act-dot"></span>'}
            </div>
          </div>`;
        }).join('')}
      </div>` : '<div class="empty">No activity yet. New members will show up here.</div>'}
    </section>`;

  // Opening the inbox clears the badge.
  try {
    await api('/api/admin/notifications/read', { method: 'POST' });
    state.unread = 0;
    updateUnread();
  } catch { /* ignore */ }
}

async function viewSettings(view) {
  view.dataset.route = 'settings';
  setActiveTab('settings');
  view.innerHTML = '<div class="spinner"></div>';
  let data;
  try {
    data = await api('/api/admin/settings');
  } catch (err) {
    view.innerHTML = `<div class="empty">${esc(err.message)}</div>`;
    return;
  }
  const s = data.settings;

  view.innerHTML = `
    <div class="page-head">
      <h1>Settings</h1>
      <p>Owner controls for your learning app.</p>
    </div>

    <div class="stack">
      <section class="card">
        <div class="card-head"><h3 class="card-title">${icon('plus', 'ico')} People</h3></div>
        <p class="tiny muted">Add as many members as you like — they can sign in with the account you create.</p>
        <button class="btn btn-primary btn-block" id="set-add" style="margin-top:14px">${icon('plus', 'ico ico-sm')} Add a member</button>
      </section>

      <section class="card">
        <div class="card-head"><h3 class="card-title">${icon('gear', 'ico')} App settings</h3></div>
        <div class="setting-row">
          <div class="s-main">
            <div class="s-name">Open sign-up</div>
            <div class="s-desc">Let people create their own account from the sign-in screen.</div>
          </div>
          <label class="switch">
            <input type="checkbox" id="set-reg" ${s.allowSelfRegistration ? 'checked' : ''} />
            <span class="track"></span>
          </label>
        </div>
        <div class="setting-row" style="display:block">
          <div class="s-name" style="margin-bottom:8px">App name</div>
          <input class="input" id="set-name" type="text" value="${esc(s.platformName)}" maxlength="40" />
        </div>
        <button class="btn btn-primary btn-block" id="set-save" style="margin-top:16px">Save changes</button>
        <div class="form-msg" id="set-msg"></div>
      </section>
    </div>`;

  $('#set-add').addEventListener('click', () => openAddMember(null, false));
  $('#set-reg').addEventListener('change', saveSettings);
  $('#set-save').addEventListener('click', saveSettings);

  async function saveSettings() {
    const msg = $('#set-msg');
    msg.className = 'form-msg';
    msg.textContent = '';
    try {
      const res = await api('/api/admin/settings', {
        method: 'POST',
        body: {
          allowSelfRegistration: $('#set-reg').checked,
          platformName: $('#set-name').value.trim()
        }
      });
      state.config = { ...state.config, ...res.settings };
      msg.className = 'form-msg ok';
      msg.textContent = 'Saved.';
      const brand = $('.appbar-brand');
      if (brand) brand.innerHTML = `<span class="mark">${icon('paw', 'ico ico-sm')}</span> ${esc(state.config.platformName)}`;
    } catch (err) {
      msg.className = 'form-msg err';
      msg.textContent = err.message;
    }
  }
}

/* ----------------------------------- init --------------------------------- */

function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => { /* offline support is optional */ });
  });
}

async function boot() {
  registerSW();
  try { state.config = (await api('/api/config')) || state.config; } catch { /* defaults */ }
  try {
    const me = await api('/api/me');
    if (me.user) {
      state.user = me.user;
      state.unread = me.unreadNotifications || 0;
      await bootApp();
      return;
    }
  } catch { /* fall through to auth */ }
  renderAuth('login');
}

window.addEventListener('hashchange', renderRoute);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && state.user && state.user.isOwner) {
    api('/api/me').then((me) => { state.unread = me.unreadNotifications || 0; updateUnread(); }).catch(() => {});
  }
});
applyTheme(currentTheme());
boot();
