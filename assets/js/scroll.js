import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

export function initScroll() {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.25,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.5,
  });

  lenisInstance.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenisInstance.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Scroll-aware nav class + indicator bar
  const nav = document.getElementById('nav');
  const bar = document.querySelector('.scroll-indicator__bar');
  lenisInstance.on('scroll', (e) => {
    if (nav) nav.classList.toggle('is-scrolled', e.scroll > 40);
    if (bar) {
      const max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      const p = Math.min(1, Math.max(0, e.scroll / max));
      bar.style.transform = `scaleX(${p})`;
    }
  });

  return lenisInstance;
}

export function getLenis() { return lenisInstance; }

export function initScrollAnimations() {
  gsap.utils.toArray('[data-reveal]').forEach(el => {
    if (el._revealed) return;
    el._revealed = true;
    const delay = parseFloat(el.dataset.revealDelay) || 0;
    gsap.from(el, {
      opacity: 0,
      y: 60,
      duration: 1.15,
      delay,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none none',
      }
    });
  });

  gsap.utils.toArray('[data-clip]').forEach(el => {
    if (el._clipped) return;
    el._clipped = true;
    const img = el.querySelector('img, .project-card__img-inner, .illus-item__inner, .about-hero__portrait-inner');
    gsap.from(el, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 1.4,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none none',
      }
    });
    if (img) {
      gsap.from(img, {
        scale: 1.25,
        duration: 1.8,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        }
      });
    }
  });

  // Parallax for image cards
  gsap.utils.toArray('.project-card__image').forEach(el => {
    const img = el.querySelector('.project-card__img-inner');
    if (!img || img._parallaxBound) return;
    img._parallaxBound = true;
    gsap.fromTo(img,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        }
      });
  });

  // Hero parallax (image scrolls slower)
  const heroBgImg = document.querySelector('.hero__fallback-bg img');
  if (heroBgImg && !heroBgImg._parallax) {
    heroBgImg._parallax = true;
    gsap.to(heroBgImg, {
      yPercent: 25,
      scale: 1.15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });
  }

  // Hero giant text drifts
  const heroGiant = document.querySelector('.hero__giant');
  if (heroGiant && !heroGiant._parallax) {
    heroGiant._parallax = true;
    gsap.to(heroGiant, {
      xPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      }
    });
  }

  // Hero name slight rise on scroll
  gsap.to('.hero__name', {
    yPercent: -25,
    opacity: 0.65,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    }
  });

  // Philosophy giant bg-text drifts
  const philoBg = document.querySelector('.philosophy__bg-text');
  if (philoBg) {
    gsap.fromTo(philoBg, { xPercent: -10 }, {
      xPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: '.philosophy',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      }
    });
  }

  // Footer giant slow drift
  const footerGiant = document.querySelector('.footer__giant');
  if (footerGiant) {
    gsap.fromTo(footerGiant, { xPercent: -12 }, {
      xPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: '.footer',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2,
      }
    });
  }

  gsap.utils.toArray('[data-parallax]').forEach(el => {
    if (el._parallaxBound) return;
    el._parallaxBound = true;
    const speed = parseFloat(el.dataset.parallax) || -15;
    gsap.to(el, {
      yPercent: speed,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section') || el.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      }
    });
  });

  ScrollTrigger.refresh();
}
