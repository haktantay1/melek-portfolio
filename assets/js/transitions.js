import barba from '@barba/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initScrollAnimations } from './scroll.js';
import { initHomeAnimations, initProjectAnimations, initWorkAnimations } from './animations.js';
import { initMarquee } from './marquee.js';
import { initNav } from './nav.js';

export function initTransitions() {
  const overlay = document.querySelector('.page-transition-overlay');

  barba.init({
    prevent: ({ el }) => el.classList?.contains('no-barba'),
    transitions: [{
      name: 'curtain-rise',
      async leave(data) {
        await gsap.to(overlay, {
          scaleY: 1,
          transformOrigin: 'bottom',
          duration: 0.7,
          ease: 'power4.inOut',
        });
        await gsap.to(data.current.container, { opacity: 0, duration: 0.1 });
      },
      async enter(data) {
        window.scrollTo(0, 0);
        ScrollTrigger.getAll().forEach(t => t.kill());
        gsap.from(data.next.container, { opacity: 0, duration: 0.1 });
        await gsap.to(overlay, {
          scaleY: 0,
          transformOrigin: 'top',
          duration: 0.7,
          ease: 'power4.inOut',
          delay: 0.1,
        });
      }
    }],
    views: [
      {
        namespace: 'home',
        afterEnter() {
          initScrollAnimations();
          initHomeAnimations();
          initMarquee();
          initNav();
          startLiveClock();
        }
      },
      {
        namespace: 'project',
        afterEnter() {
          initScrollAnimations();
          initProjectAnimations();
          initNav();
        }
      },
      {
        namespace: 'work',
        afterEnter() {
          initScrollAnimations();
          initWorkAnimations();
          initNav();
        }
      },
      {
        namespace: 'about',
        afterEnter() {
          initScrollAnimations();
          initAboutAnimations();
          initNav();
        }
      },
      {
        namespace: 'contact',
        afterEnter() {
          initScrollAnimations();
          initContactPage();
          initNav();
          startLiveClock();
        }
      }
    ]
  });
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

function initAboutAnimations() {
  const { gsap } = window._gsap || {};
  // Skill tags random rotation
  document.querySelectorAll('.skill-tag').forEach(tag => {
    const rot = (Math.random() - 0.5) * 6;
    tag.style.transform = `rotate(${rot}deg)`;
  });

  import('./animations.js').then(({ default: _ }) => {});
}

function initContactPage() {
  // Copy to clipboard
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

  // Form submission
  const form = document.getElementById('contact-form');
  const success = document.querySelector('.form-success');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]')?.value || '';
    const btn = form.querySelector('.form-submit');
    if (btn) btn.textContent = 'Sending...';

    await new Promise(r => setTimeout(r, 1200));

    const { gsap } = await import('gsap');
    gsap.to(form, { opacity: 0, y: -20, duration: 0.5, onComplete: () => {
      form.style.display = 'none';
      if (success) {
        success.classList.add('is-visible');
        const msg = success.querySelector('.form-success__text');
        if (msg) msg.textContent = `Thank you, ${name}. I'll be in touch within 48 hours. ✦`;
        gsap.from(success, { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out' });
      }
    }});
  });
}
