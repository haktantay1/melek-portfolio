import { gsap } from 'gsap';

/* ═════════════════════════════════════════════════════════════
   YULA INTRO — "Candle to Fire"
   ─────────────────────────────────────────────────────────────
   Pitch black screen.
   A single candle is lit at center — wick + tiny flickering flame.
   The flame grows, brightens, then erupts outward — the entire
   screen catches fire (radial blaze of orange / amber / white).
   Out of the fire, the YULA wordmark burns into view, glowing
   like embers cooling on iron. Smoke drifts. Page reveals.
   ═════════════════════════════════════════════════════════════ */

export function initLoader(onComplete) {
  const cb = typeof onComplete === 'function' ? onComplete : () => {};

  // Wipe any legacy/duplicate loader DOM
  document.querySelectorAll('#loader, .yula-intro').forEach(el => el.remove());

  let intro;
  try {
    intro = buildIntroDom();
    document.body.appendChild(intro);
  } catch (err) {
    console.warn('[intro:build]', err);
    cb();
    return;
  }

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    try { intro.remove(); } catch {}
    cb();
  };

  // Hard safety — never block more than 6.5s
  const safety = setTimeout(finish, 6500);
  const endNow = () => { clearTimeout(safety); finish(); };

  const isReturning = sessionStorage.getItem('yula:visited') === '1';
  sessionStorage.setItem('yula:visited', '1');

  try {
    if (isReturning) playReturning(intro, endNow);
    else             playIntro(intro, endNow);
  } catch (err) {
    console.warn('[intro:play]', err);
    endNow();
  }
}

/* ──────────────────────────────────────────────
   DOM — candle, fire layers, YULA wordmark
   ────────────────────────────────────────────── */
function buildIntroDom() {
  const root = document.createElement('div');
  root.className = 'yula-intro';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = `
    <!-- Pitch-dark base -->
    <div class="yula-intro__dark" aria-hidden="true"></div>

    <!-- Background ember glow that builds as the flame grows -->
    <div class="yula-intro__embers" aria-hidden="true"></div>

    <!-- Fire blaze layer — fills the screen at climax -->
    <div class="yula-intro__blaze" aria-hidden="true"></div>

    <!-- The candle -->
    <div class="yula-intro__candle">
      <svg class="yula-intro__candle-svg" viewBox="0 0 80 220" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
        <!-- Body of candle (cream-ivory waxy column) -->
        <defs>
          <linearGradient id="wax" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%"   stop-color="#3A2E22"/>
            <stop offset="35%"  stop-color="#E9DCC0"/>
            <stop offset="60%"  stop-color="#F4EBD2"/>
            <stop offset="100%" stop-color="#2A2018"/>
          </linearGradient>
          <radialGradient id="flameCore" cx="50%" cy="65%" r="55%">
            <stop offset="0%"   stop-color="#FFF8E0"/>
            <stop offset="35%"  stop-color="#FFD566"/>
            <stop offset="70%"  stop-color="#FF8A22"/>
            <stop offset="100%" stop-color="#7A1F08" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="flameOuter" cx="50%" cy="60%" r="80%">
            <stop offset="0%"   stop-color="#FFB347" stop-opacity="0.9"/>
            <stop offset="60%"  stop-color="#FF6A1A" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="#3A0A02" stop-opacity="0"/>
          </radialGradient>
          <filter id="flameBlur"><feGaussianBlur stdDeviation="1.2"/></filter>
          <filter id="glowSoft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6"/>
          </filter>
        </defs>

        <!-- Candle column -->
        <rect class="yula-intro__candle-body" x="26" y="100" width="28" height="110" rx="2" fill="url(#wax)"/>
        <!-- Top rim highlight -->
        <ellipse cx="40" cy="100" rx="14" ry="3.2" fill="#F8F0DC" opacity="0.9"/>
        <ellipse cx="40" cy="100.5" rx="14" ry="3.2" fill="#0B0805" opacity="0.55"/>
        <!-- Wick -->
        <rect class="yula-intro__wick" x="39.2" y="84" width="1.6" height="18" rx="0.8" fill="#0E0805"/>

        <!-- Flame outer aura (soft glow) -->
        <g class="yula-intro__flame-outer">
          <ellipse cx="40" cy="76" rx="22" ry="34" fill="url(#flameOuter)" filter="url(#glowSoft)"/>
        </g>

        <!-- Flame body (with subtle morphing flicker via CSS) -->
        <g class="yula-intro__flame">
          <path class="yula-intro__flame-path"
                d="M40 32 C 28 60, 30 80, 40 92 C 50 80, 52 60, 40 32 Z"
                fill="url(#flameCore)" filter="url(#flameBlur)"/>
          <!-- Inner blue base -->
          <ellipse cx="40" cy="86" rx="3.4" ry="6" fill="#5DB4FF" opacity="0.85"/>
          <!-- Hot white core -->
          <ellipse cx="40" cy="78" rx="2.2" ry="6" fill="#FFFCE6" opacity="0.95"/>
        </g>

        <!-- Spark particles emitted from the flame -->
        <g class="yula-intro__sparks">
          ${Array.from({length: 16}).map((_, i) => `<circle class="yula-intro__spark" data-spark="${i}" cx="40" cy="60" r="${1 + (i % 3) * 0.4}" fill="#FFD27A"/>`).join('')}
        </g>
      </svg>
    </div>

    <!-- The YULA wordmark — emerges from the fire, glowing -->
    <div class="yula-intro__mark">
      <span class="yula-intro__mark-letter"><em>Y</em></span><span class="yula-intro__mark-letter">U</span><span class="yula-intro__mark-letter"><em>L</em></span><span class="yula-intro__mark-letter">A</span>
    </div>

    <!-- Soft caption beneath wordmark -->
    <div class="yula-intro__caption">Design · Studio · İstanbul</div>

    <!-- Top + bottom meta strips fade in late -->
    <div class="yula-intro__meta yula-intro__meta--tl">Edition · MMXXVI</div>
    <div class="yula-intro__meta yula-intro__meta--tr">41°00'49"N 28°57'18"E</div>
    <div class="yula-intro__meta yula-intro__meta--bl">YULA — Design Studio</div>
    <div class="yula-intro__meta yula-intro__meta--br">Architecture · Interior</div>

    <!-- Smoke / haze layer over everything at end -->
    <div class="yula-intro__smoke" aria-hidden="true"></div>

    <!-- Final curtain wipe -->
    <div class="yula-intro__curtain" aria-hidden="true">
      <span></span><span></span><span></span><span></span><span></span>
    </div>
  `;
  return root;
}

/* ──────────────────────────────────────────────
   FULL INTRO  ~5.2s
   ────────────────────────────────────────────── */
function playIntro(root, onDone) {
  const candle      = root.querySelector('.yula-intro__candle');
  const wick        = root.querySelector('.yula-intro__wick');
  const flame       = root.querySelector('.yula-intro__flame');
  const flameOuter  = root.querySelector('.yula-intro__flame-outer');
  const flamePath   = root.querySelector('.yula-intro__flame-path');
  const sparks      = root.querySelectorAll('.yula-intro__spark');
  const embers      = root.querySelector('.yula-intro__embers');
  const blaze       = root.querySelector('.yula-intro__blaze');
  const mark        = root.querySelector('.yula-intro__mark');
  const letters     = root.querySelectorAll('.yula-intro__mark-letter');
  const caption     = root.querySelector('.yula-intro__caption');
  const metas       = root.querySelectorAll('.yula-intro__meta');
  const smoke       = root.querySelector('.yula-intro__smoke');
  const curtain     = root.querySelectorAll('.yula-intro__curtain > span');

  // ── Initial states (pitch black) ──
  gsap.set(candle,     { opacity: 0, y: 30, scale: 0.9 });
  gsap.set(flame,      { opacity: 0, transformOrigin: '50% 100%', scale: 0.1 });
  gsap.set(flameOuter, { opacity: 0, transformOrigin: '50% 70%', scale: 0.3 });
  gsap.set(sparks,     { opacity: 0 });
  gsap.set(embers,     { opacity: 0 });
  gsap.set(blaze,      { opacity: 0, scale: 0.2, transformOrigin: '50% 70%' });
  gsap.set(mark,       { opacity: 0, y: 18, filter: 'blur(14px)' });
  gsap.set(letters,    { yPercent: 110 });
  gsap.set(caption,    { opacity: 0, y: 12 });
  gsap.set(metas,      { opacity: 0 });
  gsap.set(smoke,      { opacity: 0 });
  gsap.set(curtain,    { yPercent: 0, transformOrigin: 'top' });

  const tl = gsap.timeline({ onComplete: onDone });

  // ── 1) Candle fades in from darkness (0 → 0.8s) ──
  tl.to(candle, { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'expo.out' }, 0.15);

  // ── 2) The match strikes — flame ignites (0.9 → 1.7s) ──
  tl.to(flame, {
    opacity: 1,
    scale: 1,
    duration: 0.55,
    ease: 'back.out(1.4)',
  }, 0.95);
  tl.to(flameOuter, {
    opacity: 1,
    scale: 1,
    duration: 0.65,
    ease: 'expo.out',
  }, 0.95);

  // Flame flicker — perpetual subtle wobble
  gsap.to(flame, {
    scaleY: 1.08, scaleX: 0.94,
    duration: 0.18,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    repeatRefresh: true,
    delay: 1.5,
  });
  gsap.to(flameOuter, {
    scale: 1.06,
    opacity: 0.85,
    duration: 0.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: 1.6,
  });

  // ── 3) Sparks rise from the flame (1.4 → 2.6s) ──
  sparks.forEach((s, i) => {
    const xOffset = (Math.random() - 0.5) * 50;
    const yOffset = -40 - Math.random() * 50;
    tl.to(s, {
      opacity: 1,
      duration: 0.15,
      ease: 'power2.out',
    }, 1.4 + i * 0.04)
    .to(s, {
      x: xOffset,
      y: yOffset,
      opacity: 0,
      duration: 0.9 + Math.random() * 0.4,
      ease: 'sine.out',
    }, 1.45 + i * 0.04);
  });

  // ── 4) Ember glow ramps up behind everything (1.6 → 2.6s) ──
  tl.to(embers, { opacity: 1, duration: 1.0, ease: 'power2.in' }, 1.6);

  // ── 5) Climax — flame ERUPTS, screen catches fire (2.4 → 3.4s) ──
  tl.to(flame, {
    scale: 8,
    opacity: 0,
    duration: 0.9,
    ease: 'expo.in',
  }, 2.4);
  tl.to(flameOuter, {
    scale: 6,
    opacity: 0,
    duration: 0.9,
    ease: 'expo.in',
  }, 2.4);
  tl.to(candle, {
    opacity: 0,
    y: 20,
    duration: 0.5,
    ease: 'power2.in',
  }, 2.5);
  tl.to(blaze, {
    opacity: 1,
    scale: 1,
    duration: 0.7,
    ease: 'expo.out',
  }, 2.6);

  // ── 6) Fire dies down, embers cool — YULA burns into view (3.4 → 4.6s) ──
  tl.to(blaze, {
    opacity: 0.35,
    duration: 0.5,
    ease: 'power2.out',
  }, 3.4);
  tl.to(embers, {
    opacity: 0.5,
    duration: 0.5,
    ease: 'power2.out',
  }, 3.4);

  tl.to(mark, {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    duration: 0.6,
    ease: 'expo.out',
  }, 3.5);
  tl.to(letters, {
    yPercent: 0,
    duration: 0.95,
    stagger: 0.08,
    ease: 'expo.out',
  }, 3.5);

  // Smoke rises after the fire
  tl.to(smoke, { opacity: 0.55, duration: 0.8, ease: 'power2.out' }, 3.6);

  // Caption + corner meta beneath
  tl.to(caption, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, 4.3);
  tl.to(metas, { opacity: 1, duration: 0.6, stagger: 0.08, ease: 'expo.out' }, 4.4);

  // ── 7) Hold the wordmark, then curtain reveal (5.0 → 5.85) ──
  const curtainStart = 5.05;
  tl.to(blaze,  { opacity: 0, duration: 0.6, ease: 'power2.in' }, curtainStart - 0.2);
  tl.to(embers, { opacity: 0, duration: 0.6, ease: 'power2.in' }, curtainStart - 0.2);
  tl.to(smoke,  { opacity: 0, duration: 0.6, ease: 'power2.in' }, curtainStart - 0.2);

  tl.to(curtain, {
    yPercent: -101,
    duration: 0.85,
    stagger: 0.04,
    ease: 'expo.inOut',
  }, curtainStart);

  // Hand off to page while curtain is still mid-sweep
  tl.call(onDone, null, curtainStart + 0.25);
}

/* ──────────────────────────────────────────────
   RETURNING — quick curtain only
   ────────────────────────────────────────────── */
function playReturning(root, onDone) {
  const curtain = root.querySelectorAll('.yula-intro__curtain > span');
  const hide    = root.querySelectorAll('.yula-intro__candle, .yula-intro__mark, .yula-intro__caption, .yula-intro__meta, .yula-intro__embers, .yula-intro__blaze, .yula-intro__smoke');

  gsap.set(curtain, { yPercent: 0, transformOrigin: 'top' });
  gsap.set(hide,    { opacity: 0 });

  gsap.timeline({ onComplete: onDone })
    .to(curtain, {
      yPercent: -101,
      duration: 0.6,
      stagger: 0.035,
      ease: 'expo.inOut',
    });
}
