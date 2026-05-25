import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

let navTriggerCreated = false;

export function initNav() {
  const nav     = document.getElementById('nav');
  const menuBtn = document.querySelector('.nav__menu-btn');
  const overlay = document.querySelector('.nav-overlay');
  const closeBtn = document.querySelector('.nav-overlay__close');
  const overlayLinks = document.querySelectorAll('.nav-overlay__link');

  if (!nav) return;

  if (!navTriggerCreated) {
    let lastY = 0;
    ScrollTrigger.create({
      start: 0,
      end: 99999,
      onUpdate: self => {
        const y = self.scroll();
        if (y > lastY && y > 200) {
          gsap.to(nav, { yPercent: -120, duration: 0.55, ease: 'power3.out', overwrite: true });
        } else if (y < lastY - 5 || y < 80) {
          gsap.to(nav, { yPercent: 0, duration: 0.55, ease: 'power3.out', overwrite: true });
        }
        lastY = y;
      }
    });
    navTriggerCreated = true;
  }

  const openMenu = () => {
    overlay.classList.add('is-open');
    document.body.classList.add('is-locked');
    gsap.fromTo('.nav-overlay__link-inner',
      { y: '110%' },
      { y: '0%', stagger: 0.08, duration: 0.95, ease: 'expo.out', delay: 0.15 });
    gsap.from('.nav-overlay__meta', {
      opacity: 0, y: 24, stagger: 0.08, duration: 0.8, ease: 'expo.out', delay: 0.35,
    });
  };
  const closeMenu = () => {
    overlay?.classList.remove('is-open');
    document.body.classList.remove('is-locked');
  };

  if (menuBtn && overlay && !menuBtn._bound) {
    menuBtn._bound = true;
    menuBtn.addEventListener('click', openMenu);
  }
  if (closeBtn && !closeBtn._bound) {
    closeBtn._bound = true;
    closeBtn.addEventListener('click', closeMenu);
  }
  overlayLinks.forEach(link => {
    if (link._bound) return;
    link._bound = true;
    link.addEventListener('click', closeMenu);
  });

  // Mark active
  const path = window.location.pathname.toLowerCase();
  const file = path.split('/').pop() || 'index.html';
  const isProject = path.includes('/projects/');

  const pageOf = (href) => {
    if (!href) return null;
    const cleaned = href.replace(/[?#].*$/, '').toLowerCase();
    const last = cleaned.split('/').pop() || 'index.html';
    if (last === '' || last === 'index.html' || cleaned === './' || cleaned === '/') return 'home';
    if (last === 'work.html')    return 'work';
    if (last === 'about.html')   return 'about';
    if (last === 'contact.html') return 'contact';
    return null;
  };
  const currentPage =
    (file === '' || file === 'index.html') ? 'home' :
    file === 'work.html'    ? 'work' :
    file === 'about.html'   ? 'about' :
    file === 'contact.html' ? 'contact' :
    isProject               ? 'work' :
    null;

  document.querySelectorAll('.nav__link, .nav-overlay__link').forEach(link => {
    link.classList.remove('is-active');
    const target = pageOf(link.getAttribute('href'));
    if (target && target === currentPage) {
      link.classList.add('is-active');
    }
  });
}
