import { gsap } from 'gsap';

/* ═════════════════════════════════════════════════════════════
   PAGE TRANSITIONS
   ─────────────────────────────────────────────────────────────
   FLIP image-led out-animation: when an `.ed-card` or
   `.next-project__link` is clicked, that card's image is cloned
   and morphs to fill the viewport before the browser navigates.

   On the destination page we play a soft fade-in overlay using
   the stored source image — but we NEVER hide the destination
   hero image, so a failed/aborted FLIP-in cannot leave the
   hero blank.

   Everything else falls back to the multi-panel curtain.
   ═════════════════════════════════════════════════════════════ */

const FLIP_STORAGE_KEY = 'yula:flip';

export function initTransitions() {
  const overlay = document.querySelector('.page-transition-overlay');
  const panels  = document.querySelectorAll('.page-transition-overlay__panel');

  // Clear any stale FLIP payload on every load — page-in is best-effort.
  try {
    const raw = sessionStorage.getItem(FLIP_STORAGE_KEY);
    if (raw) {
      const payload = JSON.parse(raw);
      sessionStorage.removeItem(FLIP_STORAGE_KEY);
      if (payload && Date.now() - payload.timestamp < 4000) {
        playFlipIn(payload);
      }
    }
  } catch (_) { /* ignore */ }

  if (!overlay || !panels.length) {
    playCurtainIn();
    bindLinkInterceptor();
    return;
  }

  playCurtainIn();
  bindLinkInterceptor();

  window.addEventListener('pageshow', e => {
    if (e.persisted) playCurtainIn();
  });
}

function bindLinkInterceptor() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href) return;
    if (link.hasAttribute('download')) return;
    if (link.target === '_blank') return;
    if (link.hasAttribute('data-no-transition')) return;
    if (href.startsWith('#')) return;
    if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (link.classList.contains('no-barba')) return;

    try {
      const url = new URL(href, window.location.href);
      if (url.host && url.host !== window.location.host) return;
      if (url.pathname === window.location.pathname && url.hash) return;
    } catch (err) { /* ignore */ }

    // FLIP candidate: ed-card or next-project
    let flipImg = null;
    if (link.classList.contains('ed-card') || link.classList.contains('next-project__link')) {
      flipImg = link.querySelector('img');
    }

    e.preventDefault();
    if (flipImg && flipImg.complete && flipImg.naturalWidth > 0) {
      playFlipOut(flipImg, href);
    } else {
      playCurtainOut(() => { window.location.href = href; });
    }
  });
}

/* ──────────────────────────────────────────────
   FLIP OUT
   ────────────────────────────────────────────── */
function playFlipOut(srcImg, href) {
  const rect = srcImg.getBoundingClientRect();

  const wrap = document.createElement('div');
  wrap.className = 'flip-clone';
  wrap.style.cssText = `
    position: fixed;
    top: ${rect.top}px;
    left: ${rect.left}px;
    width: ${rect.width}px;
    height: ${rect.height}px;
    overflow: hidden;
    z-index: 9999;
    pointer-events: none;
    will-change: top, left, width, height;
    background-color: #14110D;
  `;
  const clone = document.createElement('img');
  clone.src = srcImg.currentSrc || srcImg.src;
  clone.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
  wrap.appendChild(clone);
  document.body.appendChild(wrap);

  // Persist for the destination page
  try {
    sessionStorage.setItem(FLIP_STORAGE_KEY, JSON.stringify({
      src: clone.src,
      timestamp: Date.now(),
    }));
  } catch (_) { /* ignore quota */ }

  const tl = gsap.timeline({
    onComplete: () => { window.location.href = href; }
  });

  tl.to(wrap, {
    top: 0, left: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    duration: 0.95,
    ease: 'expo.inOut',
  })
  .to(clone, {
    scale: 1.06,
    duration: 0.95,
    ease: 'expo.inOut',
  }, '<')
  .to(clone, {
    opacity: 0.25,
    duration: 0.35,
    ease: 'power2.out',
  }, '-=0.3');

  // Hard failsafe — navigate after a max of 1.2s even if GSAP stalls
  setTimeout(() => { window.location.href = href; }, 1200);
}

/* ──────────────────────────────────────────────
   FLIP IN — soft veil only, never hides hero
   ────────────────────────────────────────────── */
function playFlipIn(payload) {
  if (!payload || !payload.src) return;

  const overlay = document.createElement('div');
  overlay.className = 'flip-in-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 9997; pointer-events: none;
    background-image: url('${payload.src}');
    background-size: cover; background-position: center;
    filter: brightness(0.7) saturate(0.95);
    will-change: opacity;
  `;
  document.body.appendChild(overlay);

  gsap.fromTo(overlay,
    { opacity: 1 },
    {
      opacity: 0,
      duration: 1.0,
      ease: 'expo.out',
      delay: 0.15,
      onComplete: () => overlay.remove(),
    });
}

/* ──────────────────────────────────────────────
   CURTAIN FALLBACK
   ────────────────────────────────────────────── */
function playCurtainOut(onComplete) {
  const panels = document.querySelectorAll('.page-transition-overlay__panel');
  const brand  = document.querySelector('.page-transition-overlay__brand');
  if (!panels.length) { onComplete?.(); return; }

  const tl = gsap.timeline({ onComplete });
  tl.set(panels, { scaleX: 0, transformOrigin: 'left' })
    .to(panels, { scaleX: 1, duration: 0.65, ease: 'expo.inOut', stagger: 0.04 })
    .fromTo(brand,
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'expo.out' },
      '-=0.25');
}

function playCurtainIn() {
  const panels = document.querySelectorAll('.page-transition-overlay__panel');
  const brand  = document.querySelector('.page-transition-overlay__brand');
  if (!panels.length) return;

  gsap.set(panels, { scaleX: 1, transformOrigin: 'right' });
  gsap.set(brand,  { opacity: 1 });

  gsap.timeline()
    .to(brand, { opacity: 0, duration: 0.25, ease: 'expo.out' })
    .to(panels, { scaleX: 0, duration: 0.75, ease: 'expo.inOut', stagger: 0.04 }, '-=0.1')
    .set(panels, { transformOrigin: 'left' });
}
