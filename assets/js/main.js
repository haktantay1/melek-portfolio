import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { initLoader } from './loader.js';
import { initCursor } from './cursor.js';
import { initScroll, initScrollAnimations } from './scroll.js';
import { initNav } from './nav.js';
import { initMarquee } from './marquee.js';
import { initNoise } from './noise.js';
import { initTransitions } from './transitions.js';
import { initCardWebGL } from './webgl.js';
import { initHeroReel } from './heroReel.js';
import { initLiveTimes } from './globe.js';
import { initSound } from './sound.js';
import {
  initHomeAnimations,
  initWorkAnimations,
  initAboutAnimations,
  initContactAnimations,
  initProjectAnimations,
  initGlobalAnimations,
} from './animations.js';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const page = document.body.dataset.page || 'home';

let booted = false;

// Wrap each init so one failure doesn't kill the rest
const safe = (label, fn) => { try { fn(); } catch (err) { console.warn(`[init:${label}]`, err); } };

function bootstrap() {
  if (booted) return;
  booted = true;

  safe('cursor',     initCursor);
  safe('noise',      initNoise);
  safe('scroll',     initScroll);
  safe('nav',        initNav);
  safe('transitions',initTransitions);
  safe('scrollAnim', initScrollAnimations);
  safe('globalAnim', initGlobalAnimations);
  safe('liveTimes',  initLiveTimes);
  safe('sound',      initSound);

  if (page === 'home') {
    safe('marquee',  initMarquee);
    safe('heroReel', initHeroReel);
    safe('cardWebGL',initCardWebGL);
    safe('homeAnim', initHomeAnimations);
    startLiveClock();
  } else if (page === 'work') {
    safe('marquee',  initMarquee);
    safe('cardWebGL',initCardWebGL);
    safe('workAnim', initWorkAnimations);
  } else if (page === 'about') {
    safe('marquee',  initMarquee);
    safe('aboutAnim',initAboutAnimations);
  } else if (page === 'contact') {
    safe('contactAnim', initContactAnimations);
    safe('contactForm', initContactForm);
    startLiveClock();
  } else if (page === 'project') {
    safe('projectAnim', initProjectAnimations);
  }

  document.body.classList.add('is-loaded');

  // Safety net: after 3s, force-show any [data-reveal]/.ed-card content
  // whose initial-state was set by gsap.from() but whose tween never fired.
  setTimeout(() => {
    document.querySelectorAll('[data-reveal], [data-clip], .ed-card__caption, .ed-card__media, .proj-hero__title, .proj-hero__num, .proj-hero__subtitle, .proj-hero__meta span, .proj-fact, .proj-detail, .proj-overview__text p, .proj-overview__heading, .proj-overview__image, .proj-gallery__item, .proj-quote__text, .proj-tool, .philosophy__item, .stat, .geo__city, .chapter__lede, .chapter__manifesto, .contact__title, .hero__display-eyebrow, .hero__display-line, .hero__display-link, .hero__corner').forEach(el => {
      // If element's computed opacity stuck near zero, reveal it.
      const cs = getComputedStyle(el);
      if (parseFloat(cs.opacity) < 0.5) {
        gsap.to(el, { opacity: 1, y: 0, scale: 1, clearProps: 'opacity,transform,clipPath,filter', duration: 0.6, ease: 'expo.out' });
      }
    });
    ScrollTrigger.refresh();
  }, 3000);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
  window.addEventListener('load', () => setTimeout(() => ScrollTrigger.refresh(), 140));
}

function start() {
  if (prefersReducedMotion) {
    document.getElementById('loader')?.remove();
    bootstrap();
    return;
  }
  initLoader(bootstrap);
  setTimeout(bootstrap, 5500);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}

let clockInterval = null;
function startLiveClock() {
  if (clockInterval) clearInterval(clockInterval);
  const el = document.getElementById('live-time');
  const overlayEl = document.getElementById('overlay-time');
  if (!el && !overlayEl) return;
  const update = () => {
    let t;
    try {
      t = new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul', hour12: false,
      });
    } catch (e) {
      t = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    }
    const text = `${t} — IST`;
    if (el) el.textContent = text;
    if (overlayEl) overlayEl.textContent = text;
  };
  update();
  clockInterval = setInterval(update, 30000);
}

function initContactForm() {
  document.querySelectorAll('.sidebar-value[data-copy]').forEach(el => {
    if (el._copyBound) return;
    el._copyBound = true;
    const doCopy = () => {
      const text = el.dataset.copy;
      if (!text || !navigator.clipboard) return;
      navigator.clipboard.writeText(text).then(() => {
        const hint = el.parentElement.querySelector('.copy-hint');
        if (hint) {
          const original = hint.textContent;
          hint.textContent = 'Copied ✓';
          hint.style.color = 'var(--color-accent)';
          setTimeout(() => {
            hint.textContent = original || 'Click to copy';
            hint.style.color = '';
          }, 1800);
        }
      });
    };
    el.addEventListener('click', doCopy);
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doCopy(); }
    });
  });

  const form = document.getElementById('contact-form');
  const success = document.querySelector('.form-success');
  if (!form || form._submitBound) return;
  form._submitBound = true;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]')?.value || 'friend';
    const btn = form.querySelector('.form-submit');
    if (btn) {
      btn.disabled = true;
      const span = btn.querySelector('span');
      if (span) span.textContent = 'Sending...';
    }
    await new Promise(r => setTimeout(r, 1100));
    gsap.to(form, {
      opacity: 0, y: -20, duration: 0.6, ease: 'power2.in',
      onComplete: () => {
        form.style.display = 'none';
        if (success) {
          success.removeAttribute('hidden');
          success.style.display = 'flex';
          success.classList.add('is-visible');
          const msg = success.querySelector('.form-success__text');
          if (msg) msg.textContent = `Thank you, ${name}. I'll be in touch within 48 hours.`;
          gsap.from(success, { opacity: 0, y: 30, duration: 0.9, ease: 'power3.out' });
        }
      }
    });
  });
}
