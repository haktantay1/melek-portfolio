import { gsap } from 'gsap';

let cursorState = null;

export function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (cursorState) {
    refreshCursorTargets();
    return;
  }

  const dot    = document.querySelector('.cursor__dot');
  const ring   = document.querySelector('.cursor__ring');
  const label  = document.querySelector('.cursor__label');
  const cursor = document.querySelector('.cursor');
  if (!cursor || !dot || !ring) return;

  cursorState = { dot, ring, label, cursor };

  let curX = window.innerWidth / 2, curY = window.innerHeight / 2;
  let posX = curX, posY = curY;

  gsap.set([dot, ring], { x: curX, y: curY });

  gsap.ticker.add(() => {
    posX += (curX - posX) * 0.18;
    posY += (curY - posY) * 0.18;
    gsap.set(ring, { x: posX, y: posY });
  });

  document.addEventListener('mousemove', e => {
    curX = e.clientX;
    curY = e.clientY;
    gsap.set(dot, { x: curX, y: curY });
  });

  document.addEventListener('mouseleave', () => {
    gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
  });
  document.addEventListener('mouseenter', () => {
    gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
  });

  refreshCursorTargets();
}

const boundEls = new WeakSet();

function refreshCursorTargets() {
  if (!cursorState) return;
  const { cursor, label } = cursorState;

  const addState = (els, cls) => {
    els.forEach(el => {
      if (boundEls.has(el)) return;
      boundEls.add(el);
      el.addEventListener('mouseenter', () => cursor.classList.add(cls));
      el.addEventListener('mouseleave', () => cursor.classList.remove(cls));
    });
  };

  addState(document.querySelectorAll('a, button, [role="link"], [role="button"], input, textarea, select, label'), 'cursor--link');
  addState(document.querySelectorAll('.project-card'), 'cursor--project');
  addState(document.querySelectorAll('.illus-scroll-track'), 'cursor--drag');

  document.querySelectorAll('.project-card').forEach(card => {
    if (card._cursorBound) return;
    card._cursorBound = true;
    card.addEventListener('mouseenter', () => {
      if (label) label.textContent = 'VIEW';
    });
  });

  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    if (btn._magneticBound) return;
    btn._magneticBound = true;
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top  - r.height / 2;
      gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.45, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' });
    });
  });
}

export { refreshCursorTargets };
