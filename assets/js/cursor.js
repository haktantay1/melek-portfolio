import { gsap } from 'gsap';

let cursorState = null;

export function initCursor() {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  if (cursorState) {
    refreshCursorTargets();
    return;
  }

  const dot    = document.querySelector('.cursor__dot');
  const ring   = document.querySelector('.cursor__ring');
  const label  = document.querySelector('.cursor__label');
  const cursor = document.querySelector('.cursor');
  if (!cursor || !dot || !ring) return;

  document.body.classList.add('has-cursor');
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

  document.addEventListener('mousedown', () => {
    gsap.to(ring, { scale: 0.85, duration: 0.2, ease: 'power3.out' });
  });
  document.addEventListener('mouseup', () => {
    gsap.to(ring, { scale: 1, duration: 0.45, ease: 'elastic.out(1, 0.5)' });
  });

  refreshCursorTargets();
}

const boundEls = new WeakSet();
const magneticBound = new WeakSet();

export function refreshCursorTargets() {
  if (!cursorState) return;
  const { cursor, label } = cursorState;

  const addState = (els, cls, labelText) => {
    els.forEach(el => {
      if (boundEls.has(el)) return;
      boundEls.add(el);
      el.addEventListener('mouseenter', () => {
        cursor.classList.add(cls);
        if (labelText && label) label.textContent = labelText;
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove(cls);
        if (labelText && label) label.textContent = '';
      });
    });
  };

  addState(document.querySelectorAll('a, button, [role="link"], [role="button"], input, textarea, select, label, .filter-btn'), 'cursor--link');
  addState(document.querySelectorAll('.project-card'), 'cursor--project', 'View');
  addState(document.querySelectorAll('.illus-scroll-track'), 'cursor--drag', 'Drag');
  addState(document.querySelectorAll('[data-cursor="gold"]'), 'cursor--gold', 'Open');
  addState(document.querySelectorAll('[data-cursor="drag"]'), 'cursor--drag', 'Drag');

  document.querySelectorAll('.btn-magnetic, [data-magnetic]').forEach(btn => {
    if (magneticBound.has(btn)) return;
    magneticBound.add(btn);
    const strength = parseFloat(btn.dataset.magnetic) || 0.32;
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top  - r.height / 2;
      gsap.to(btn, { x: x * strength, y: y * strength, duration: 0.5, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
    });
  });
}
