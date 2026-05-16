import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { splitChars, splitWords, splitLines } from './splitText.js';

gsap.registerPlugin(ScrollTrigger, Flip);

export function initHomeAnimations() {
  const heroName = document.querySelector('.hero__name-line');
  if (heroName && !heroName._split) {
    heroName._split = true;
    const chars = splitChars(heroName);
    chars.forEach(c => c.classList.add('char'));
    gsap.from(chars, {
      yPercent: 130,
      opacity: 0,
      duration: 1.4,
      stagger: 0.035,
      ease: 'expo.out',
      delay: 0.4,
    });
  }

  gsap.from('.hero__bg-img', {
    scale: 1.3,
    duration: 2.4,
    ease: 'power3.out',
  });

  gsap.from('.hero__label', {
    y: 20, opacity: 0, duration: 0.9, ease: 'power2.out', delay: 0.3,
  });
  gsap.from('.hero__date', {
    y: 20, opacity: 0, duration: 0.9, ease: 'power2.out', delay: 0.45,
  });
  gsap.from('.hero__tagline', {
    y: 24, opacity: 0, duration: 1.0, ease: 'power2.out', delay: 1.0,
  });
  gsap.from('.hero__scroll', {
    y: 16, opacity: 0, duration: 0.9, ease: 'power2.out', delay: 1.2,
  });
  gsap.from('.hero__scroll-line', {
    scaleY: 0,
    transformOrigin: 'top',
    duration: 1.3,
    ease: 'power3.out',
    delay: 1.3,
  });

  document.querySelectorAll('.section-title').forEach(title => {
    if (title._split) return;
    title._split = true;
    const lines = splitLines(title);
    gsap.from(lines, {
      yPercent: 110,
      opacity: 0,
      duration: 1.0,
      stagger: 0.12,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  });

  const bioText = document.querySelector('.bio-reveal');
  if (bioText && !bioText._split) {
    bioText._split = true;
    const words = splitWords(bioText);
    gsap.from(words, {
      opacity: 0,
      y: 18,
      duration: 0.7,
      stagger: 0.025,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: bioText,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  }

  document.querySelectorAll('.count-up').forEach(el => {
    if (el._counted) return;
    el._counted = true;
    const target = parseInt(el.dataset.target, 10) || 0;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => { el.textContent = Math.round(obj.val); },
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  });

  bindCardNavigation();
  initSectionProgress();

  const ctaTitle = document.querySelector('.contact-cta__title');
  if (ctaTitle && !ctaTitle._split) {
    ctaTitle._split = true;
    const lines = splitLines(ctaTitle);
    gsap.from(lines, {
      yPercent: 110,
      opacity: 0,
      duration: 1.0,
      stagger: 0.12,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: ctaTitle,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  }
}

export function initProjectAnimations() {
  const heroTitle = document.querySelector('.proj-hero__title');
  if (heroTitle && !heroTitle._split) {
    heroTitle._split = true;
    const lines = splitLines(heroTitle);
    gsap.from(lines, {
      yPercent: 120,
      opacity: 0,
      duration: 1.2,
      stagger: 0.12,
      ease: 'expo.out',
      delay: 0.35,
    });
  }

  gsap.from('.proj-hero__bg img', {
    scale: 1.25,
    duration: 2.2,
    ease: 'power3.out',
  });

  gsap.from('.proj-hero__num', {
    opacity: 0, y: 20, duration: 0.8, ease: 'power2.out', delay: 0.2,
  });
  gsap.from('.proj-hero__subtitle', {
    opacity: 0, y: 20, duration: 0.9, ease: 'power2.out', delay: 0.7,
  });
  gsap.from('.proj-hero__meta span', {
    opacity: 0, y: 12, duration: 0.7, stagger: 0.08, ease: 'power2.out', delay: 0.9,
  });

  document.querySelectorAll('.bio-reveal').forEach(bio => {
    if (bio._split) return;
    bio._split = true;
    const words = splitWords(bio);
    gsap.from(words, {
      opacity: 0,
      y: 14,
      duration: 0.6,
      stagger: 0.02,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: bio,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  });

  const projHero = document.querySelector('.proj-hero');
  if (projHero && !projHero._spotlight) {
    projHero._spotlight = true;
    projHero.addEventListener('mousemove', e => {
      const rect = projHero.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      const spot = projHero.querySelector('.proj-hero__spotlight');
      if (spot) {
        spot.style.setProperty('--mx', mx + '%');
        spot.style.setProperty('--my', my + '%');
      }
    });
  }
}

export function initWorkAnimations() {
  const workTitle = document.querySelector('.work-hero__title');
  if (workTitle && !workTitle._split) {
    workTitle._split = true;
    const lines = splitLines(workTitle);
    gsap.from(lines, {
      yPercent: 120,
      opacity: 0,
      duration: 1.2,
      stagger: 0.12,
      ease: 'expo.out',
      delay: 0.3,
    });
  }
  gsap.from('.work-hero__sub', {
    opacity: 0, y: 20, duration: 0.9, ease: 'power2.out', delay: 0.5,
  });
  gsap.from('.work-hero__count', {
    opacity: 0, y: 20, duration: 0.9, ease: 'power2.out', delay: 0.6,
  });

  document.querySelectorAll('.section-title').forEach(title => {
    if (title._split) return;
    title._split = true;
    const lines = splitLines(title);
    gsap.from(lines, {
      yPercent: 110,
      opacity: 0,
      duration: 1.0,
      stagger: 0.12,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  });

  const filterBtns = document.querySelectorAll('button.filter-btn[data-filter]');
  const cards = document.querySelectorAll('.work-grid .project-card');

  filterBtns.forEach(btn => {
    if (btn._bound) return;
    btn._bound = true;
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
        onComplete: () => ScrollTrigger.refresh(),
      });
    });
  });

  bindCardNavigation();

  const track = document.querySelector('.illus-scroll-track');
  if (track && !track._dragBound) {
    track._dragBound = true;
    let isDown = false, startX = 0, scrollLeft = 0, velocity = 0, lastX = 0, lastT = 0;
    track.addEventListener('mousedown', e => {
      isDown = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
      lastX = e.pageX;
      lastT = performance.now();
      velocity = 0;
    });
    document.addEventListener('mouseup', () => {
      if (!isDown) return;
      isDown = false;
      let v = velocity;
      const decay = () => {
        if (Math.abs(v) < 0.5) return;
        track.scrollLeft -= v;
        v *= 0.94;
        requestAnimationFrame(decay);
      };
      decay();
    });
    track.addEventListener('mouseleave', () => { isDown = false; });
    track.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 1.6;
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) velocity = (e.pageX - lastX) / dt * 16;
      lastX = e.pageX;
      lastT = now;
    });
  }
}

export function initAboutAnimations() {
  document.querySelectorAll('.skill-tag').forEach(tag => {
    const rot = (Math.random() - 0.5) * 5;
    tag.style.transform = `rotate(${rot}deg)`;
  });

  const aboutTitle = document.querySelector('.about-hero__title');
  if (aboutTitle && !aboutTitle._split) {
    aboutTitle._split = true;
    const lines = splitLines(aboutTitle);
    gsap.from(lines, {
      yPercent: 120,
      opacity: 0,
      duration: 1.2,
      stagger: 0.12,
      ease: 'expo.out',
      delay: 0.3,
    });
  }

  document.querySelectorAll('.section-title').forEach(title => {
    if (title._split) return;
    title._split = true;
    const lines = splitLines(title);
    gsap.from(lines, {
      yPercent: 110,
      opacity: 0,
      duration: 1.0,
      stagger: 0.12,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  });

  document.querySelectorAll('.bio-reveal').forEach(bio => {
    if (bio._split) return;
    bio._split = true;
    const words = splitWords(bio);
    gsap.from(words, {
      opacity: 0,
      y: 14,
      duration: 0.55,
      stagger: 0.018,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: bio,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  });

  const studioName = document.querySelector('.studio-name');
  if (studioName && !studioName._split) {
    studioName._split = true;
    const chars = splitChars(studioName);
    gsap.from(chars, {
      opacity: 0,
      yPercent: 100,
      duration: 0.9,
      stagger: 0.05,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: studioName,
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
  }
}

export function initContactAnimations() {
  const title = document.querySelector('.contact-hero__title');
  if (title && !title._split) {
    title._split = true;
    const chars = splitChars(title);
    gsap.from(chars, {
      yPercent: 120,
      opacity: 0,
      duration: 1.2,
      stagger: 0.06,
      ease: 'expo.out',
      delay: 0.3,
    });
  }
  gsap.from('.contact-hero__sub', {
    opacity: 0, y: 16, duration: 0.8, ease: 'power2.out', delay: 0.2,
  });
}

function bindCardNavigation() {
  document.querySelectorAll('.project-card[data-href]').forEach(card => {
    if (card._navBound) return;
    card._navBound = true;
    card.addEventListener('click', () => {
      const href = card.dataset.href;
      if (href) window.location.href = href;
    });
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const href = card.dataset.href;
        if (href) window.location.href = href;
      }
    });
  });
}

function initSectionProgress() {
  const progress = document.querySelector('.section-progress');
  if (!progress || progress._bound) return;
  progress._bound = true;
  const cards = gsap.utils.toArray('.projects-featured .project-card');
  if (!cards.length) return;
  const numEl = progress.querySelector('.section-progress__num');
  const totalEl = progress.querySelector('.section-progress__total');
  if (totalEl) totalEl.textContent = String(cards.length).padStart(2, '0');
  cards.forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => {
        if (numEl) numEl.textContent = String(i + 1).padStart(2, '0');
        progress.style.setProperty('--progress', (i + 1) / cards.length);
      },
      onEnterBack: () => {
        if (numEl) numEl.textContent = String(i + 1).padStart(2, '0');
        progress.style.setProperty('--progress', (i + 1) / cards.length);
      },
    });
  });
}
