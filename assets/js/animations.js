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
    gsap.set(heroName, { opacity: 1 });
    gsap.from(chars, {
      yPercent: 120,
      opacity: 0,
      duration: 1.2,
      stagger: 0.035,
      ease: 'power4.out',
      delay: 0.25,
    });
  }

  gsap.from('.hero__scroll-line', {
    scaleY: 0,
    transformOrigin: 'top',
    duration: 1.3,
    ease: 'power3.out',
    delay: 1.3,
  });

  gsap.fromTo(['.hero__label', '.hero__date'],
    { opacity: 0, y: 15 },
    { opacity: 0.7, y: 0, duration: 0.9, stagger: 0.12, ease: 'power2.out', delay: 0.4 }
  );

  gsap.fromTo('.hero__tagline',
    { opacity: 0, y: 25 },
    { opacity: 0.78, y: 0, duration: 1.0, ease: 'power2.out', delay: 1.0 }
  );
  gsap.fromTo('.hero__scroll',
    { opacity: 0, y: 15 },
    { opacity: 0.7, y: 0, duration: 0.9, ease: 'power2.out', delay: 1.2 }
  );

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
        start: 'top 82%',
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

  const ctaTitle = document.querySelector('.contact-cta__title');
  if (ctaTitle && !ctaTitle._split) {
    ctaTitle._split = true;
    const lines = splitLines(ctaTitle);
    gsap.from(lines, {
      yPercent: 110,
      opacity: 0,
      duration: 1.0,
      stagger: 0.12,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: ctaTitle,
        start: 'top 82%',
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
    gsap.set(heroTitle, { opacity: 1 });
    gsap.from(lines, {
      yPercent: 110,
      opacity: 0,
      duration: 1.2,
      stagger: 0.12,
      ease: 'power4.out',
      delay: 0.35,
    });
  }

  gsap.from('.proj-hero__num', {
    opacity: 0, y: 20, duration: 0.8, ease: 'power2.out', delay: 0.2,
  });
  gsap.from('.proj-hero__subtitle', {
    opacity: 0, y: 20, duration: 0.9, ease: 'power2.out', delay: 0.7,
  });
  gsap.from('.proj-hero__meta span', {
    opacity: 0, y: 12, duration: 0.7, stagger: 0.08, ease: 'power2.out', delay: 0.9,
  });

  const overviewText = document.querySelector('.proj-overview__text p');
  if (overviewText && !overviewText._split) {
    overviewText._split = true;
    const words = splitWords(overviewText);
    gsap.from(words, {
      opacity: 0,
      y: 14,
      duration: 0.6,
      stagger: 0.02,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: overviewText,
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
  }
}

export function initWorkAnimations() {
  const workTitle = document.querySelector('.work-hero__title');
  if (workTitle && !workTitle._split) {
    workTitle._split = true;
    const lines = splitLines(workTitle);
    gsap.set(workTitle, { opacity: 1 });
    gsap.from(lines, {
      yPercent: 110,
      opacity: 0,
      duration: 1.2,
      stagger: 0.12,
      ease: 'power4.out',
      delay: 0.3,
    });
  }
  gsap.from(['.work-hero__sub', '.work-hero__count'], {
    opacity: 0,
    y: 20,
    duration: 0.9,
    stagger: 0.1,
    ease: 'power2.out',
    delay: 0.5,
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
    let isDown = false, startX = 0, scrollLeft = 0;
    track.addEventListener('mousedown', e => {
      isDown = true;
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    document.addEventListener('mouseup', () => { isDown = false; });
    track.addEventListener('mouseleave', () => { isDown = false; });
    track.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 1.6;
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
    gsap.set(aboutTitle, { opacity: 1 });
    gsap.from(lines, {
      yPercent: 110,
      opacity: 0,
      duration: 1.2,
      stagger: 0.12,
      ease: 'power4.out',
      delay: 0.3,
    });
  }

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
    gsap.set(title, { opacity: 1 });
    gsap.from(chars, {
      yPercent: 110,
      opacity: 0,
      duration: 1.2,
      stagger: 0.06,
      ease: 'power4.out',
      delay: 0.3,
    });
  }
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
