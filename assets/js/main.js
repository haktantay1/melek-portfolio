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

let booted = false;

function bootstrap() {
  if (booted) return;
  booted = true;

  initCursor();
  initNoise();
  initScroll();
  initTransitions();
  runPage(ns);
  document.body.classList.add('is-loaded');

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }

  window.addEventListener('load', () => {
    setTimeout(() => ScrollTrigger.refresh(), 120);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}

function start() {
  if (prefersReducedMotion) {
    document.getElementById('loader')?.remove();
    bootstrap();
    return;
  }
  initLoader(bootstrap);
  setTimeout(bootstrap, 3500);
}
