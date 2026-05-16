import { gsap } from 'gsap';

export function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot    = document.querySelector('.cursor__dot');
  const ring   = document.querySelector('.cursor__ring');
  const label  = document.querySelector('.cursor__label');
  const cursor = document.querySelector('.cursor');
  if (!cursor) return;

  let curX = 0, curY = 0, posX = 0, posY = 0;

  gsap.to({}, {
    duration: 0.016,
    repeat: -1,
    onRepeat: () => {
      posX += (curX - posX) / 7;
      posY += (curY - posY) / 7;
      gsap.set(ring, { x: posX, y: posY });
    }
  });

  document.addEventListener('mousemove', e => {
    curX = e.clientX;
    curY = e.clientY;
    gsap.set(dot, { x: curX, y: curY });
  });

  const addState = (els, cls) => {
    els.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add(cls));
      el.addEventListener('mouseleave', () => cursor.classList.remove(cls));
    });
  };

  const refreshCursorTargets = () => {
    addState(document.querySelectorAll('a, button'), 'cursor--link');
    addState(document.querySelectorAll('.project-card'), 'cursor--project');
    addState(document.querySelectorAll('.illus-scroll-track'), 'cursor--drag');

    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (label) label.textContent = 'VIEW';
      });
    });

    document.querySelectorAll('.btn-magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top  - r.height / 2;
        gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
      });
    });
  };

  refreshCursorTargets();
  document.addEventListener('barba:after', refreshCursorTargets);
}
