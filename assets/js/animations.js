import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { splitChars, splitWords, splitLines } from './splitText.js';

gsap.registerPlugin(ScrollTrigger, Flip);

export function initHomeAnimations() {
  // Hero name reveal — split into chars
  const heroName = document.querySelector('.hero__name-line');
  if (heroName) {
    const chars = splitChars(heroName);
    gsap.from(chars, {
      y: '110%',
      opacity: 0,
      duration: 1.1,
      stagger: 0.035,
      ease: 'power4.out',
      delay: 0.2,
    });
  }

  // Hero scroll line
  gsap.from('.hero__scroll-line', {
    scaleY: 0,
    transformOrigin: 'top',
    duration: 1.2,
    ease: 'power3.out',
    delay: 1.2,
  });

  // Hero label + date
  gsap.from(['.hero__label', '.hero__date', '.hero__tagline'], {
    opacity: 0,
    y: 20,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power2.out',
    delay: 0.5,
  });

  // Bio word reveal
  const bioText = document.querySelector('.bio-reveal');
  if (bioText) {
    const words = splitWords(bioText);
    gsap.from(words, {
      opacity: 0,
      y: 15,
      duration: 0.6,
      stagger: 0.03,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: bioText,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      }
    });
  }

  // Count up stats
  document.querySelectorAll('.count-up').forEach(el => {
    const target = parseInt(el.dataset.target);
    gsap.to(el, {
      innerHTML: target,
      duration: 1.8,
      snap: { innerHTML: 1 },
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  });

  // Project card click
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const href = card.dataset.href;
      if (href) window.location.href = href;
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const href = card.dataset.href;
        if (href) window.location.href = href;
      }
    });
  });

  // Contact CTA title
  const ctaTitle = document.querySelector('.contact-cta__title');
  if (ctaTitle) {
    const lines = splitLines(ctaTitle);
    gsap.from(lines, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: ctaTitle,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      }
    });
  }
}

export function initProjectAnimations() {
  // Hero title
  const heroTitle = document.querySelector('.proj-hero__title');
  if (heroTitle) {
    const lines = splitLines(heroTitle);
    gsap.from(lines, {
      opacity: 0,
      y: 60,
      duration: 1.1,
      stagger: 0.12,
      ease: 'power4.out',
      delay: 0.3,
    });
  }

  gsap.from(['.proj-hero__num', '.proj-hero__subtitle', '.proj-hero__meta'], {
    opacity: 0,
    y: 20,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power2.out',
    delay: 0.5,
  });

  // Overview text
  const overviewText = document.querySelector('.proj-overview__text p');
  if (overviewText) {
    const words = splitWords(overviewText);
    gsap.from(words, {
      opacity: 0,
      y: 12,
      duration: 0.5,
      stagger: 0.02,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: overviewText,
        start: 'top 80%',
      }
    });
  }
}

export function initWorkAnimations() {
  // Filter with GSAP Flip
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.work-grid .project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filter = btn.dataset.filter;
      const state = Flip.getState(cards);

      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.cat === filter;
        card.style.display = show ? '' : 'none';
      });

      Flip.from(state, {
        duration: 0.6,
        ease: 'power2.inOut',
        stagger: 0.04,
        absolute: true,
      });
    });
  });

  // Project card click
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const href = card.dataset.href;
      if (href) window.location.href = href;
    });
  });

  // Drag to scroll illustrations
  const track = document.querySelector('.illus-scroll-track');
  if (track) {
    let isDown = false, startX = 0, scrollLeft = 0;
    track.addEventListener('mousedown', e => {
      isDown = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    document.addEventListener('mouseup', () => { isDown = false; });
    track.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });
  }
}
