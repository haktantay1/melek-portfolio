/* ═════════════════════════════════════════════════════════════
   SOUND — minimal editorial UI audio
   ─────────────────────────────────────────────────────────────
   Web Audio API synthesizes the cues so we don't ship audio
   files. Each cue is a short, low-volume tone. Disabled by
   default (no autoplay), the user must click the toggle once.
   State persisted to localStorage.
   ═════════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'yula:sound';
let ctx = null;
let masterGain = null;
let enabled = false;

function loadState() {
  try { return localStorage.getItem(STORAGE_KEY) === 'on'; }
  catch (e) { return false; }
}
function saveState(v) {
  try { localStorage.setItem(STORAGE_KEY, v ? 'on' : 'off'); }
  catch (e) { /* ignore */ }
}

function getContext() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  masterGain = ctx.createGain();
  masterGain.gain.value = 0.06; // very quiet by default
  masterGain.connect(ctx.destination);
  return ctx;
}

function tone({ freq = 880, dur = 0.08, type = 'sine', glide = 0, gain = 1 } = {}) {
  if (!enabled) return;
  const c = getContext();
  if (!c) return;
  if (c.state === 'suspended') c.resume();

  const osc = c.createOscillator();
  const g = c.createGain();
  const now = c.currentTime;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (glide) osc.frequency.exponentialRampToValueAtTime(Math.max(50, freq * glide), now + dur);

  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(gain, now + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

  osc.connect(g).connect(masterGain);
  osc.start(now);
  osc.stop(now + dur + 0.02);
}

// ─── Curated cues ───────────────────────────────────────────
export const cues = {
  hover()      { tone({ freq: 920, dur: 0.04, type: 'sine',     gain: 0.4 }); },
  click()      { tone({ freq: 520, dur: 0.06, type: 'triangle', gain: 0.7 }); },
  cardHover()  { tone({ freq: 1100, dur: 0.05, type: 'sine',    gain: 0.35 }); },
  navOpen()    { tone({ freq: 740, dur: 0.15, type: 'triangle', glide: 1.5, gain: 0.5 }); },
  navClose()   { tone({ freq: 660, dur: 0.12, type: 'triangle', glide: 0.6, gain: 0.5 }); },
  transition() { tone({ freq: 380, dur: 0.4,  type: 'sine',     glide: 2.2, gain: 0.6 }); },
};

// ─── Public API ────────────────────────────────────────────
export function initSound() {
  enabled = loadState();

  // Toggle button — injects a fixed pill bottom-right
  const btn = document.createElement('button');
  btn.className = 'sound-toggle';
  btn.setAttribute('aria-label', enabled ? 'Mute sounds' : 'Enable sounds');
  btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
  btn.innerHTML = `
    <span class="sound-toggle__icon" aria-hidden="true">
      <span class="sound-toggle__bar"></span>
      <span class="sound-toggle__bar"></span>
      <span class="sound-toggle__bar"></span>
    </span>
    <span class="sound-toggle__label">${enabled ? 'SOUND · ON' : 'SOUND · OFF'}</span>
  `;
  btn.classList.toggle('is-on', enabled);
  document.body.appendChild(btn);

  btn.addEventListener('click', () => {
    enabled = !enabled;
    saveState(enabled);
    btn.classList.toggle('is-on', enabled);
    btn.querySelector('.sound-toggle__label').textContent = enabled ? 'SOUND · ON' : 'SOUND · OFF';
    btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    btn.setAttribute('aria-label', enabled ? 'Mute sounds' : 'Enable sounds');
    if (enabled) {
      getContext()?.resume?.();
      cues.click();
    }
  });

  // Hook into common UI events — only fires when enabled
  document.addEventListener('click', e => {
    if (!enabled) return;
    const target = e.target;
    if (target.closest?.('.sound-toggle')) return;
    if (target.closest?.('a, button, .btn-pill, .nav__cta, .ed-card, .contact__btn, .next-project__link')) {
      cues.click();
    }
  });

  document.addEventListener('mouseover', e => {
    if (!enabled) return;
    const t = e.target;
    if (t.closest?.('.ed-card, .next-project__link')) {
      cues.cardHover();
    } else if (t.closest?.('.nav__link, .nav-overlay__link, .link-editorial, .link-underline')) {
      cues.hover();
    }
  }, { passive: true });
}
