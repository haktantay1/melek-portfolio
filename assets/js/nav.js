import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
        if (y > lastY && y > 120) {
          gsap.to(nav, { yPercent: -110, duration: 0.5, ease: 'power3.out', overwrite: true });
        } else if (y < lastY - 4) {
          gsap.to(nav, { yPercent: 0, duration: 0.5, ease: 'power3.out', overwrite: true });
        }
        lastY = y;
      }
    });
    navTriggerCreated = true;
  }

  if (menuBtn && overlay && !menuBtn._bound) {
    menuBtn._bound = true;
    menuBtn.addEventListener('click', () => {
      overlay.classList.add('is-open');
      gsap.from(overlayLinks, {
        opacity: 0,
        y: 30,
        stagger: 0.07,
        duration: 0.6,
        ease: 'power3.out',
      });
    });
  }

  const closeMenu = () => overlay?.classList.remove('is-open');
  if (closeBtn && !closeBtn._bound) {
    closeBtn._bound = true;
    closeBtn.addEventListener('click', closeMenu);
  }
  overlayLinks.forEach(link => {
    if (link._bound) return;
    link._bound = true;
    link.addEventListener('click', closeMenu);
  });

  const path = window.location.pathname.toLowerCase();
  const pageOf = (href) => {
    if (!href) return null;
    const cleaned = href.replace(/[?#].*$/, '').toLowerCase();
    if (cleaned === '' || cleaned === './' || cleaned === '../' || cleaned === '/' || cleaned.endsWith('/index.html') || cleaned === 'index.html') return 'home';
    if (cleaned.endsWith('work.html'))    return 'work';
    if (cleaned.endsWith('about.html'))   return 'about';
    if (cleaned.endsWith('contact.html')) return 'contact';
    return null;
  };
  const currentPage =
    path === '' || path === '/' || path.endsWith('/index.html') || path.endsWith('/melek-portfolio/') ? 'home' :
    path.endsWith('/work.html')    ? 'work' :
    path.endsWith('/about.html')   ? 'about' :
    path.endsWith('/contact.html') ? 'contact' :
    path.includes('/projects/')    ? 'work' :
    null;

  document.querySelectorAll('.nav__link, .nav-overlay__link').forEach(link => {
    link.classList.remove('is-active');
    const target = pageOf(link.getAttribute('href'));
    if (target && target === currentPage) {
      link.classList.add('is-active');
    }
  });
}
