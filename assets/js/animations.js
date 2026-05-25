import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { splitChars, splitWords, splitLines } from './splitText.js';

gsap.registerPlugin(ScrollTrigger);

/* ─── GLOBAL — applies on every page ─── */
export function initGlobalAnimations() {
  // Section titles — line reveal
  document.querySelectorAll('.section-title').forEach(title => {
    if (title._split) return;
    title._split = true;
    const lines = splitLines(title);
    gsap.from(lines, {
      yPercent: 110,
      opacity: 0,
      duration: 1.1,
      stagger: 0.12,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 88%',
        toggleActions: 'play none none none',
      }
    });
  });

  // Counter-up
  document.querySelectorAll('.count-up').forEach(el => {
    if (el._counted) return;
    el._counted = true;
    const target = parseInt(el.dataset.target, 10) || 0;
    const padLen = (el.dataset.target || '').length || 1;
    const pad = (v) => String(Math.round(v)).padStart(padLen, '0');
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2.4,
      ease: 'expo.out',
      onUpdate: () => { el.textContent = pad(obj.val); },
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      }
    });
  });

  // Generic word reveal for [data-split-words]
  document.querySelectorAll('[data-split-words]').forEach(el => {
    if (el._splitWords) return;
    el._splitWords = true;
    const words = splitWords(el);
    gsap.from(words, {
      opacity: 0,
      y: 22,
      duration: 0.75,
      stagger: 0.022,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  });

  // Generic line reveal for [data-split-lines]
  document.querySelectorAll('[data-split-lines]').forEach(el => {
    if (el._splitLines) return;
    el._splitLines = true;
    const lines = splitLines(el);
    gsap.from(lines, {
      yPercent: 110,
      opacity: 0,
      duration: 1.0,
      stagger: 0.1,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      }
    });
  });

  // bio-reveal (legacy support)
  document.querySelectorAll('.bio-reveal').forEach(bio => {
    if (bio._split) return;
    bio._split = true;
    const words = splitWords(bio);
    gsap.from(words, {
      opacity: 0,
      y: 16,
      duration: 0.7,
      stagger: 0.022,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: bio,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });
  });
}

/* ─── HOME ─── */
export function initHomeAnimations() {
  // ── CINEMATIC: Hero parallax zoom-out as user scrolls down ──
  const heroSection = document.querySelector('.hero');
  const heroReel    = document.querySelector('.hero__reel');
  const heroDisplay = document.querySelector('.hero__display');
  if (heroSection && heroReel) {
    gsap.to(heroReel, {
      scale: 0.92,
      borderRadius: '32px',
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
      }
    });
  }
  if (heroSection && heroDisplay) {
    gsap.to(heroDisplay, {
      y: -120,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom+=10% top',
        scrub: 0.4,
      }
    });
  }

  // ── CINEMATIC: ed-card image parallax on scroll ──
  document.querySelectorAll('.ed-card__media').forEach(media => {
    const img = media.querySelector('.ed-card__img');
    if (!img) return;
    gsap.fromTo(img,
      { yPercent: -6 },
      { yPercent: 6, ease: 'none',
        scrollTrigger: {
          trigger: media,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
  });

  // HERO display entrance — staggered editorial reveal
  const heroEyebrow = document.querySelector('.hero__display-eyebrow');
  const heroTitle   = document.querySelector('.hero__display-title');
  const heroLink    = document.querySelector('.hero__display-link');
  const heroCorners = document.querySelectorAll('.hero__corner');
  const heroScrub   = document.querySelector('.hero__scrub');

  if (heroEyebrow) gsap.from(heroEyebrow, { y: 28, opacity: 0, duration: 1.0, ease: 'expo.out', delay: 0.35 });
  if (heroTitle) {
    const lines = heroTitle.querySelectorAll('.hero__display-line');
    if (lines.length) {
      gsap.from(lines, {
        yPercent: 110,
        opacity: 0,
        filter: 'blur(14px)',
        duration: 1.5,
        stagger: 0.12,
        ease: 'expo.out',
        delay: 0.5,
      });
    }
  }
  if (heroLink)    gsap.from(heroLink,    { y: 20, opacity: 0, duration: 1.0, ease: 'expo.out', delay: 1.05 });
  if (heroCorners.length) gsap.from(heroCorners, { y: 14, opacity: 0, duration: 1.0, stagger: 0.1, ease: 'expo.out', delay: 1.2 });
  if (heroScrub)   gsap.from(heroScrub,   { y: 20, opacity: 0, duration: 1.0, ease: 'expo.out', delay: 1.35 });

  // Contact title reveal
  const contactTitle = document.querySelector('.contact__title');
  if (contactTitle && !contactTitle._split) {
    contactTitle._split = true;
    const lines = splitLines(contactTitle);
    gsap.from(lines, {
      yPercent: 110,
      opacity: 0,
      duration: 1.1,
      stagger: 0.12,
      ease: 'expo.out',
      scrollTrigger: { trigger: contactTitle, start: 'top 85%', toggleActions: 'play none none none' }
    });
  }

  // Editorial card reveals
  document.querySelectorAll('.ed-card').forEach(card => {
    if (card._cardReveal) return;
    card._cardReveal = true;
    const media   = card.querySelector('.ed-card__media');
    const caption = card.querySelector('.ed-card__caption');
    const img     = card.querySelector('.ed-card__img');

    if (media) {
      gsap.from(media, {
        clipPath: 'inset(100% 0% 0% 0%)',
        duration: 1.6,
        ease: 'expo.out',
        scrollTrigger: { trigger: card, start: 'top 80%', toggleActions: 'play none none none' }
      });
    }
    if (img) {
      gsap.from(img, {
        scale: 1.35,
        duration: 2.0,
        ease: 'expo.out',
        scrollTrigger: { trigger: card, start: 'top 80%', toggleActions: 'play none none none' }
      });
    }
    if (caption) {
      const num   = caption.querySelector('.ed-card__num');
      const title = caption.querySelector('.ed-card__title');
      const sub   = caption.querySelector('.ed-card__sub');
      const meta  = caption.querySelectorAll('.ed-card__meta li');

      const tl = gsap.timeline({
        scrollTrigger: { trigger: card, start: 'top 78%', toggleActions: 'play none none none' }
      });
      if (num)    tl.from(num,   { y: 18, opacity: 0, duration: 0.7, ease: 'expo.out' }, 0.2);
      if (title)  tl.from(title, { y: 36, opacity: 0, duration: 1.1, ease: 'expo.out' }, 0.3);
      if (sub)    tl.from(sub,   { y: 18, opacity: 0, duration: 0.8, ease: 'expo.out' }, 0.55);
      if (meta.length) tl.from(meta, { y: 12, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'expo.out' }, 0.75);
    }
  });

  // Philosophy giant background drift
  const philoBg = document.querySelector('.philosophy__bg-text');
  if (philoBg) {
    gsap.from(philoBg, {
      opacity: 0,
      duration: 2.5,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.chapter--philosophy', start: 'top 70%', toggleActions: 'play none none none' }
    });
  }

  // Chapter lede + manifesto reveals
  document.querySelectorAll('.chapter__lede').forEach(el => {
    if (el._reveal) return;
    el._reveal = true;
    gsap.from(el, {
      y: 30,
      opacity: 0,
      duration: 1.4,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  // Geo cities stagger
  document.querySelectorAll('.geo__city').forEach((city, i) => {
    if (city._reveal) return;
    city._reveal = true;
    gsap.from(city, {
      y: 24,
      opacity: 0,
      duration: 1.0,
      delay: i * 0.06,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.geo__cities', start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  // Philosophy items
  document.querySelectorAll('.philosophy__item').forEach(item => {
    if (item._reveal) return;
    item._reveal = true;
    const idx = item.querySelector('.philosophy__index');
    const p   = item.querySelector('p');
    const tl = gsap.timeline({
      scrollTrigger: { trigger: item, start: 'top 82%', toggleActions: 'play none none none' }
    });
    if (idx) tl.from(idx, { y: 26, opacity: 0, duration: 0.9, ease: 'expo.out' }, 0);
    if (p)   tl.from(p,   { y: 22, opacity: 0, duration: 0.9, ease: 'expo.out' }, 0.12);
  });

  bindCardNavigation();
}

/* ─── WORK ─── */
export function initWorkAnimations() {
  const heroTitle = document.querySelector('.work-hero__title');
  if (heroTitle && !heroTitle._split) {
    heroTitle._split = true;
    const lines = splitLines(heroTitle);
    gsap.from(lines, {
      yPercent: 130,
      opacity: 0,
      duration: 1.4,
      stagger: 0.14,
      ease: 'expo.out',
      delay: 0.25,
    });
  }
  gsap.from('.work-hero__eyebrow', { opacity: 0, y: 20, duration: 0.9, ease: 'expo.out', delay: 0.15 });
  gsap.from('.work-hero__sub',     { opacity: 0, y: 20, duration: 0.9, ease: 'expo.out', delay: 1.1 });
  gsap.from('.work-hero__count',   { opacity: 0, y: 20, duration: 0.9, ease: 'expo.out', delay: 1.2 });
  gsap.from('.work-hero__metaline', { scaleX: 0, transformOrigin: 'left', duration: 1.2, ease: 'expo.out', delay: 1.4 });

  // FILTERS
  const filterBtns = document.querySelectorAll('button.filter-btn[data-filter]');
  const cards = document.querySelectorAll('.work-grid .project-card');
  filterBtns.forEach(btn => {
    if (btn._bound) return;
    btn._bound = true;
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const filter = btn.dataset.filter;
      cards.forEach((card, i) => {
        const show = filter === 'all' || card.dataset.cat === filter;
        gsap.to(card, {
          opacity: show ? 1 : 0,
          y: show ? 0 : 20,
          scale: show ? 1 : 0.98,
          duration: 0.6,
          ease: 'expo.out',
          delay: show ? i * 0.04 : 0,
          onStart: () => { if (show) card.style.display = ''; },
          onComplete: () => { if (!show) card.style.display = 'none'; ScrollTrigger.refresh(); }
        });
      });
    });
  });

  bindCardNavigation();

  // Drag-scroll illustrations rail
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

/* ─── ABOUT ─── */
export function initAboutAnimations() {
  document.querySelectorAll('.skill-tag').forEach(tag => {
    const rot = (Math.random() - 0.5) * 4;
    tag.style.transform = `rotate(${rot}deg)`;
  });

  const aboutTitle = document.querySelector('.about-hero__title');
  if (aboutTitle && !aboutTitle._split) {
    aboutTitle._split = true;
    const lines = splitLines(aboutTitle);
    gsap.from(lines, {
      yPercent: 130,
      opacity: 0,
      duration: 1.4,
      stagger: 0.14,
      ease: 'expo.out',
      delay: 0.25,
    });
  }

  const studioName = document.querySelector('.studio-name');
  if (studioName && !studioName._split) {
    studioName._split = true;
    const chars = splitChars(studioName);
    gsap.from(chars, {
      opacity: 0,
      yPercent: 100,
      duration: 1.0,
      stagger: 0.05,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: studioName,
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });
  }
}

/* ─── CONTACT ─── */
export function initContactAnimations() {
  const title = document.querySelector('.contact-hero__title');
  if (title && !title._split) {
    title._split = true;
    const chars = splitChars(title);
    gsap.from(chars, {
      yPercent: 130,
      opacity: 0,
      duration: 1.4,
      stagger: 0.06,
      ease: 'expo.out',
      delay: 0.3,
    });
  }
  gsap.from('.contact-hero__sub',  { opacity: 0, y: 16, duration: 0.9, ease: 'expo.out', delay: 0.2 });
  gsap.from('.contact-hero__time', { opacity: 0, y: 16, duration: 0.9, ease: 'expo.out', delay: 0.35 });
  gsap.from('.contact-hero__line', { scaleX: 0, transformOrigin: 'left', duration: 1.2, ease: 'expo.out', delay: 1.0 });
}

/* ─── PROJECT (single) ─── */
export function initProjectAnimations() {
  // Hero — entrance with cinematic Ken Burns + line lift
  const heroTitle = document.querySelector('.proj-hero__title');
  if (heroTitle && !heroTitle._split) {
    heroTitle._split = true;
    const lines = splitLines(heroTitle);
    gsap.fromTo(lines,
      { yPercent: 130, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1.4, stagger: 0.13, ease: 'expo.out', delay: 0.35 });
  }

  gsap.fromTo('.proj-hero__bg img',
    { scale: 1.18 },
    { scale: 1.0, duration: 2.4, ease: 'expo.out' });

  gsap.fromTo('.proj-hero__num',      { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', delay: 0.2 });
  gsap.fromTo('.proj-hero__subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.0, ease: 'expo.out', delay: 0.8 });
  gsap.fromTo('.proj-hero__meta span', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'expo.out', delay: 1.0 });

  // Fact strip stagger
  gsap.fromTo('.proj-fact',
    { y: 22, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: 'expo.out',
      scrollTrigger: { trigger: '.proj-facts', start: 'top 85%', toggleActions: 'play none none none' }
    });

  // Overview heading
  const overviewHeading = document.querySelector('.proj-overview__heading');
  if (overviewHeading) {
    gsap.fromTo(overviewHeading,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: '.proj-overview', start: 'top 80%', toggleActions: 'play none none none' } });
  }

  // Overview paragraphs — soft fade-in (no split-words, more reliable)
  document.querySelectorAll('.proj-overview__text p').forEach(p => {
    if (p._reveal) return; p._reveal = true;
    gsap.fromTo(p,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1.0, ease: 'expo.out',
        scrollTrigger: { trigger: p, start: 'top 85%', toggleActions: 'play none none none' } });
  });

  // Overview image clip reveal
  const overviewImg = document.querySelector('.proj-overview__image');
  if (overviewImg) {
    gsap.fromTo(overviewImg,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.out',
        scrollTrigger: { trigger: overviewImg, start: 'top 85%', toggleActions: 'play none none none' } });
  }

  // Gallery items clip reveal
  document.querySelectorAll('.proj-gallery__item').forEach(item => {
    if (item._reveal) return; item._reveal = true;
    const img = item.querySelector('img');
    gsap.fromTo(item,
      { clipPath: 'inset(0% 0% 100% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.out',
        scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' } });
    if (img) {
      gsap.fromTo(img,
        { scale: 1.25 },
        { scale: 1, duration: 1.8, ease: 'expo.out',
          scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' } });
    }
  });

  // Quote reveal — single tween, more reliable than per-word split
  const quoteText = document.querySelector('.proj-quote__text');
  if (quoteText) {
    gsap.fromTo(quoteText,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: quoteText, start: 'top 78%', toggleActions: 'play none none none' } });
  }

  // Details staggered reveal
  document.querySelectorAll('.proj-detail').forEach((d, i) => {
    if (d._reveal) return; d._reveal = true;
    gsap.fromTo(d,
      { y: 32, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, delay: i * 0.12, ease: 'expo.out',
        scrollTrigger: { trigger: '.proj-details', start: 'top 80%', toggleActions: 'play none none none' } });
  });

  // Tools fade in
  document.querySelectorAll('.proj-tool').forEach((t, i) => {
    if (t._reveal) return; t._reveal = true;
    gsap.fromTo(t,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, delay: i * 0.06, ease: 'expo.out',
        scrollTrigger: { trigger: '.proj-tools', start: 'top 85%', toggleActions: 'play none none none' } });
  });

  // Next project title parallax
  const nextBg = document.querySelector('.next-project__bg img');
  if (nextBg) {
    gsap.fromTo(nextBg,
      { y: '-6%' },
      { y: '6%', ease: 'none',
        scrollTrigger: { trigger: '.next-project', scrub: true, start: 'top bottom', end: 'bottom top' } });
  }

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

