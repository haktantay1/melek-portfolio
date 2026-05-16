import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initNav() {
  const nav     = document.getElementById('nav');
  const menuBtn = document.querySelector('.nav__menu-btn');
  const overlay = document.querySelector('.nav-overlay');
  const closeBtn = document.querySelector('.nav-overlay__close');
  const overlayLinks = document.querySelectorAll('.nav-overlay__link');

  if (!nav) return;

  // Hide nav on scroll down
  let lastY = 0;
  ScrollTrigger.create({
    onUpdate: self => {
      const y = self.scroll();
      if (y > lastY && y > 80) {
        gsap.to(nav, { y: '-100%', duration: 0.4, ease: 'power2.out' });
      } else {
        gsap.to(nav, { y: '0%', duration: 0.4, ease: 'power2.out' });
      }
      lastY = y;
    }
  });

  // Mobile menu
  if (!menuBtn || !overlay) return;

  menuBtn.addEventListener('click', () => {
    overlay.classList.add('is-open');
    gsap.from(overlayLinks, {
      opacity: 0,
      y: 30,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power3.out',
    });
  });

  const closeMenu = () => overlay.classList.remove('is-open');
  closeBtn?.addEventListener('click', closeMenu);
  overlayLinks.forEach(link => link.addEventListener('click', closeMenu));

  // Mark active link
  const path = window.location.pathname;
  document.querySelectorAll('.nav__link, .nav-overlay__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (path === href || (href !== '/' && path.startsWith(href)))) {
      link.classList.add('is-active');
    }
  });
}
