import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initLoader } from './loader.js';
import { initCursor } from './cursor.js';
import { initScroll } from './scroll.js';
import { initTransitions, runPage } from './transitions.js';
import { initNoise } from './noise.js';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ns = document.querySelector('[data-barba-namespace]')?.dataset.barbaNamespace || 'home';

function bootstrap() {
  initCursor();
  initNoise();
  initScroll();
  initTransitions();
  runPage(ns);
  document.body.classList.add('is-loaded');

  window.addEventListener('load', () => {
    setTimeout(() => ScrollTrigger.refresh(), 100);
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }
}

if (prefersReducedMotion) {
  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
  document.querySelectorAll('.reveal-clip').forEach(el => {
    el.style.clipPath = 'none';
    el.style.overflow = '';
  });
  document.getElementById('loader')?.remove();
  bootstrap();
} else {
  initLoader(bootstrap);
}
