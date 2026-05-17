import barba from '@barba/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initScrollAnimations, getLenis } from './scroll.js';
import {
  initHomeAnimations,
  initProjectAnimations,
  initWorkAnimations,
  initAboutAnimations,
  initContactAnimations,
} from './animations.js';
import { initMarquee } from './marquee.js';
import { initNav } from './nav.js';
import { refreshCursorTargets } from './cursor.js';

let barbaInited = false;

export function initTransitions() {
  if (barbaInited) return;
  barbaInited = true;

  const overlay = document.querySelector('.page-transition-overlay');

  barba.init({
    debug: false,
    prevent: ({ el }) => {
      if (!el) return false;
      if (el.classList?.contains('no-barba')) return true;
      if (el.target === '_blank') return true;
      if (el.hasAttribute('download')) return true;
      const href = el.getAttribute('href') || '';
      if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) return true;
      if (href.startsWith('http') && !href.includes(window.location.host)) return true;
      return false;
    },
    transitions: [{
      name: 'curtain-rise',
      async leave() {
        const lenis = getLenis();
        lenis?.stop();
        if (!overlay) return;
        gsap.set(overlay, { y: '100%' });
        await gsap.to(overlay, {
          y: '0%',
          duration: 0.7,
          ease: 'expo.inOut',
        });
      },
      async enter() {
        window.scrollTo(0, 0);
        const lenis = getLenis();
        lenis?.scrollTo(0, { immediate: true });

        ScrollTrigger.getAll().forEach(t => t.kill());
        if (!overlay) { lenis?.start(); return; }

        await gsap.to(overlay, {
          y: '-100%',
          duration: 0.7,
          ease: 'expo.inOut',
          delay: 0.1,
        });
        gsap.set(overlay, { y: '100%' });
        lenis?.start();
      }
    }],
    views: [
      { namespace: 'home',    afterEnter() { runPage('home'); } },
      { namespace: 'work',    afterEnter() { runPage('work'); } },
      { namespace: 'about',   afterEnter() { runPage('about'); } },
      { namespace: 'contact', afterEnter() { runPage('contact'); } },
      { namespace: 'project', afterEnter() { runPage('project'); } },
    ],
  });

  barba.hooks.afterEnter(() => {
    initNav();
    refreshCursorTargets();
    setTimeout(() => ScrollTrigger.refresh(), 80);
  });
}

function runPage(ns) {
  initScrollAnimations();
  initNav();
  refreshCursorTargets();

  if (ns === 'home') {
    initMarquee();
    initHomeAnimations();
    startLiveClock();
  } else if (ns === 'work') {
    initWorkAnimations();
  } else if (ns === 'about') {
    initAboutAnimations();
  } else if (ns === 'contact') {
    initContactAnimations();
    initContactForm();
    startLiveClock();
  } else if (ns === 'project') {
    initProjectAnimations();
  }
}

let clockInterval = null;
function startLiveClock() {
  if (clockInterval) clearInterval(clockInterval);
  const el = document.getElementById('live-time');
  if (!el) return;
  const update = () => {
    try {
      el.textContent = new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul', hour12: false,
      }) + ' IST';
    } catch (e) {
      el.textContent = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' IST';
    }
  };
  update();
  clockInterval = setInterval(update, 1000);
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
          hint.textContent = 'Copied!';
          hint.style.opacity = '1';
          setTimeout(() => {
            hint.textContent = original || 'Click to copy';
            hint.style.opacity = '';
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
      opacity: 0, y: -20, duration: 0.5, ease: 'power2.in', onComplete: () => {
        form.style.display = 'none';
        if (success) {
          success.removeAttribute('hidden');
          success.style.display = 'block';
          success.classList.add('is-visible');
          const msg = success.querySelector('.form-success__text');
          if (msg) msg.textContent = `Thank you, ${name}. I'll be in touch within 48 hours.`;
          gsap.from(success, { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out' });
        }
      }
    });
  });
}

export { runPage };
