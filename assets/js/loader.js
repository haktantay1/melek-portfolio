/* ═════════════════════════════════════════════════════════════
   YULA INTRO loader — bulletproof CSS-driven sequence.
   JS just injects the DOM, schedules a removal callback, and
   honors a per-session "skip full intro" flag. Everything else
   is pure CSS @keyframes — no GSAP dependency, no timeline that
   can stall, no opacity:0 stuck state.

   Total sequence: ~6.3s (candle 0.3s, ignite 1.0s, flicker +
   sparks 1.5–3.4s, blaze 2.8–3.8s, YULA mark 3.4–4.5s, hold +
   curtain 5.4–6.3s).
   ═════════════════════════════════════════════════════════════ */

export function initLoader(onComplete) {
  const cb = typeof onComplete === 'function' ? onComplete : () => {};

  // Wipe any legacy/duplicate loader DOM
  document.querySelectorAll('#loader, .yula-intro').forEach(el => el.remove());

  const intro = buildIntroDom();
  document.body.appendChild(intro);

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    try { intro.remove(); } catch {}
    cb();
  };

  const isReturning = sessionStorage.getItem('yula:visited') === '1';
  sessionStorage.setItem('yula:visited', '1');

  if (isReturning) {
    // Short curtain wipe only (page should reveal fast)
    intro.classList.add('yula-intro--returning');
    setTimeout(finish, 750);
  } else {
    // Full intro is ~6.3s, hand off at 5.7s while curtain is still wiping
    setTimeout(finish, 5700);
  }

  // Hard safety net — never block longer than 7s
  setTimeout(finish, 7000);
}

function buildIntroDom() {
  const root = document.createElement('div');
  root.className = 'yula-intro';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = `
    <div class="yula-intro__dark"   aria-hidden="true"></div>
    <div class="yula-intro__embers" aria-hidden="true"></div>
    <div class="yula-intro__blaze"  aria-hidden="true"></div>

    <div class="yula-intro__candle">
      <div class="yula-intro__wick"></div>
      <div class="yula-intro__flame">
        <div class="yula-intro__flame-base"></div>
        <div class="yula-intro__flame-core"></div>
      </div>
      <div class="yula-intro__sparks">
        <span class="yula-intro__spark"></span>
        <span class="yula-intro__spark"></span>
        <span class="yula-intro__spark"></span>
        <span class="yula-intro__spark"></span>
        <span class="yula-intro__spark"></span>
        <span class="yula-intro__spark"></span>
        <span class="yula-intro__spark"></span>
        <span class="yula-intro__spark"></span>
      </div>
      <div class="yula-intro__candle-body"></div>
    </div>

    <div class="yula-intro__smoke" aria-hidden="true"></div>

    <h1 class="yula-intro__mark"><em>Y</em>U<em>L</em>A</h1>
    <div class="yula-intro__caption">Design · Studio · İstanbul</div>

    <div class="yula-intro__meta yula-intro__meta--tl">Edition · MMXXVI</div>
    <div class="yula-intro__meta yula-intro__meta--tr">41°00'49"N 28°57'18"E</div>
    <div class="yula-intro__meta yula-intro__meta--bl">YULA — Design Studio</div>
    <div class="yula-intro__meta yula-intro__meta--br">Architecture · Interior</div>
  `;
  return root;
}
