import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initLoader } from './loader.js';
import { initCursor } from './cursor.js';
import { initScroll, initScrollAnimations } from './scroll.js';
import { initTransitions } from './transitions.js';
import { initNoise } from './noise.js';
import { initMarquee } from './marquee.js';
import { initNav } from './nav.js';
import { initHomeAnimations, initProjectAnimations, initWorkAnimations } from './animations.js';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Always init
initCursor();
initNoise();
initScroll();
initNav();

// Detect current page namespace
const ns = document.querySelector('[data-barba-namespace]')?.dataset.barbaNamespace;

function runPageAnimations(namespace) {
  initScrollAnimations();
  if (namespace === 'home') {
    initHomeAnimations();
    initMarquee();
    startLiveClock();
  } else if (namespace === 'project') {
    initProjectAnimations();
  } else if (namespace === 'work') {
    initWorkAnimations();
  } else if (namespace === 'contact') {
    initContactPage();
    startLiveClock();
  } else if (namespace === 'about') {
    initAboutPage();
  }
}

if (!prefersReducedMotion) {
  initLoader(() => {
    initTransitions();
    runPageAnimations(ns);
  });
} else {
  document.querySelectorAll('.reveal, .reveal-clip').forEach(el => {
    el.style.opacity = '1';
    el.style.clipPath = 'inset(0)';
    el.style.transform = 'none';
  });
  document.getElementById('loader')?.remove();
  initTransitions();
  runPageAnimations(ns);
}

function startLiveClock() {
  const el = document.getElementById('live-time');
  if (!el) return;
  const update = () => {
    el.textContent = new Date().toLocaleTimeString('tr-TR', {
      hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul'
    }) + ' İST';
  };
  update();
  setInterval(update, 1000);
}

function initAboutPage() {
  document.querySelectorAll('.skill-tag').forEach(tag => {
    const rot = (Math.random() - 0.5) * 6;
    tag.style.transform = `rotate(${rot}deg)`;
  });
}

function initContactPage() {
  document.querySelectorAll('.sidebar-value[data-copy]').forEach(el => {
    el.addEventListener('click', () => {
      navigator.clipboard?.writeText(el.dataset.copy).then(() => {
        const hint = el.nextElementSibling;
        if (hint) {
          hint.textContent = 'Copied!';
          setTimeout(() => { hint.textContent = 'Click to copy'; }, 2000);
        }
      });
    });
  });

  const form = document.getElementById('contact-form');
  const success = document.querySelector('.form-success');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]')?.value || '';
    const btn = form.querySelector('.form-submit');
    if (btn) {
      btn.disabled = true;
      btn.querySelector('span').textContent = 'Sending...';
    }

    await new Promise(r => setTimeout(r, 1200));

    gsap.to(form, {
      opacity: 0, y: -20, duration: 0.5, onComplete: () => {
        form.style.display = 'none';
        if (success) {
          success.classList.add('is-visible');
          const msg = success.querySelector('.form-success__text');
          if (msg) msg.textContent = `Thank you, ${name}. I'll be in touch within 48 hours. ✦`;
          gsap.from(success, { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out' });
        }
      }
    });
  });
}
