import { gsap } from 'gsap';

/* ═════════════════════════════════════════════════════════════
   YULA INTRO — "The Four Commitments"
   The studio's manifesto unfolds: Listen. Specify. Iterate. Deliver.
   The four verbs stamp in sequence, then morph into the YULA
   wordmark before a curtain reveals the page.

   On return visits (same session) only the curtain sweep plays.
   ═════════════════════════════════════════════════════════════ */

const COMMITMENTS = ['Listen.', 'Specify.', 'Iterate.', 'Deliver.'];

export function initLoader(onComplete) {
  const cb = typeof onComplete === 'function' ? onComplete : () => {};

  // Remove any legacy/duplicate loader DOM before we mount our own
  document.querySelectorAll('#loader, .yula-intro').forEach(el => el.remove());

  // Build the intro DOM
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
    try { intro.remove(); } catch (_) {}
    cb();
  };

  // Hard safety — never block the page longer than 6s
  const safety = setTimeout(finish, 6000);
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
   DOM
   ────────────────────────────────────────────── */
function buildIntroDom() {
  const root = document.createElement('div');
  root.className = 'yula-intro';
  root.setAttribute('aria-hidden', 'true');

  const wordSpans = COMMITMENTS
    .map((w, i) => `<span class="yula-intro__word" data-word="${i}"><em>${w}</em></span>`)
    .join('');

  root.innerHTML = `
    <div class="yula-intro__grain" aria-hidden="true"></div>

    <div class="yula-intro__top">
      <span class="yula-intro__meta">Edition · MMXXVI</span>
      <span class="yula-intro__meta">41°00'49"N 28°57'18"E</span>
    </div>

    <div class="yula-intro__bottom">
      <span class="yula-intro__meta">YULA — Design Studio</span>
      <span class="yula-intro__meta">Architecture · Interior</span>
    </div>

    <div class="yula-intro__rule" aria-hidden="true">
      <span class="yula-intro__rule-line"></span>
    </div>

    <div class="yula-intro__stage">
      ${wordSpans}
      <span class="yula-intro__mark" data-mark>
        <span class="yula-intro__mark-letter"><em>Y</em></span><span class="yula-intro__mark-letter"><em>U</em></span><span class="yula-intro__mark-letter"><em>L</em></span><span class="yula-intro__mark-letter"><em>A</em></span>
      </span>
    </div>

    <div class="yula-intro__curtain" aria-hidden="true">
      <span></span><span></span><span></span><span></span><span></span>
    </div>
  `;
  return root;
}

/* ──────────────────────────────────────────────
   FULL INTRO  ~3.6s
   ────────────────────────────────────────────── */
function playIntro(root, onDone) {
  const words    = root.querySelectorAll('.yula-intro__word');
  const mark     = root.querySelector('.yula-intro__mark');
  const letters  = root.querySelectorAll('.yula-intro__mark-letter');
  const ruleLine = root.querySelector('.yula-intro__rule-line');
  const topMeta  = root.querySelectorAll('.yula-intro__top .yula-intro__meta');
  const botMeta  = root.querySelectorAll('.yula-intro__bottom .yula-intro__meta');
  const curtain  = root.querySelectorAll('.yula-intro__curtain > span');

  // Initial states
  gsap.set(words,    { opacity: 0, y: 30, filter: 'blur(8px)' });
  gsap.set(mark,     { opacity: 0 });
  gsap.set(letters,  { yPercent: 110 });
  gsap.set(ruleLine, { scaleX: 0, transformOrigin: 'left center' });
  gsap.set(topMeta,  { opacity: 0, y: -8 });
  gsap.set(botMeta,  { opacity: 0, y: 8 });
  gsap.set(curtain,  { yPercent: 0, transformOrigin: 'top' });

  const tl = gsap.timeline({ onComplete: onDone });

  // The architect's first stroke
  tl.to(ruleLine, { scaleX: 1, duration: 0.7, ease: 'expo.inOut' }, 0);

  // Meta strips fade in
  tl.to(topMeta, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'expo.out' }, 0.1);
  tl.to(botMeta, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'expo.out' }, 0.15);

  // Four commitments stamp in sequence
  const STAMP   = 0.45;
  const HOLD    = 0.22;
  const FADE    = 0.28;
  const STEP    = STAMP * 0.55 + HOLD + FADE * 0.3; // ~0.59
  let cursor    = 0.55;

  words.forEach((word, i) => {
    tl.to(word, {
      opacity: 1, y: 0, filter: 'blur(0px)',
      duration: STAMP, ease: 'expo.out',
    }, cursor);
    if (i < words.length - 1) {
      tl.to(word, {
        opacity: 0, y: -14, filter: 'blur(6px)',
        duration: FADE, ease: 'power2.in',
      }, cursor + STAMP * 0.5 + HOLD);
    }
    cursor += STEP;
  });

  // Final commitment fades and YULA mark assembles
  tl.to(words[words.length - 1], {
    opacity: 0, scale: 0.96, filter: 'blur(10px)',
    duration: 0.35, ease: 'power2.in',
  }, cursor - STEP + STAMP * 0.5 + HOLD);

  tl.to(ruleLine, { scaleY: 1.6, duration: 0.2, ease: 'power2.out' }, cursor - 0.1);

  tl.set(mark, { opacity: 1 }, cursor);
  tl.to(letters, {
    yPercent: 0,
    duration: 0.75,
    stagger: 0.07,
    ease: 'expo.out',
  }, cursor);

  tl.to(ruleLine, { scaleY: 1, duration: 0.4, ease: 'expo.out' }, cursor + 0.2);

  // Hold the wordmark briefly, then curtain reveals page
  const curtainStart = cursor + 0.95;
  tl.to(curtain, {
    yPercent: -101,
    duration: 0.85,
    stagger: 0.04,
    ease: 'expo.inOut',
  }, curtainStart);

  // Hand off as the curtain starts moving — page underneath fades in continuously
  tl.call(onDone, null, curtainStart + 0.2);
}

/* ──────────────────────────────────────────────
   RETURNING — quick curtain sweep
   ────────────────────────────────────────────── */
function playReturning(root, onDone) {
  const curtain = root.querySelectorAll('.yula-intro__curtain > span');
  const hide    = root.querySelectorAll('.yula-intro__word, .yula-intro__mark, .yula-intro__rule, .yula-intro__top, .yula-intro__bottom');

  gsap.set(curtain, { yPercent: 0, transformOrigin: 'top' });
  gsap.set(hide,    { opacity: 0 });

  gsap.timeline({ onComplete: onDone })
    .to(curtain, {
      yPercent: -101,
      duration: 0.65,
      stagger: 0.035,
      ease: 'expo.inOut',
    });
}
