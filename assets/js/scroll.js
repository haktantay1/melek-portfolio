import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance = null;

export function initScroll() {
  if (lenisInstance) return lenisInstance;

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.5,
  });

  lenisInstance.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenisInstance.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenisInstance;
}

export function getLenis() { return lenisInstance; }

export function initScrollAnimations() {
  gsap.utils.toArray('[data-reveal]').forEach(el => {
    if (el._revealed) return;
    el._revealed = true;
    gsap.from(el, {
      opacity: 0,
      y: 50,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
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
      duration: 1.3,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      }
    });
    if (img) {
      gsap.from(img, {
        scale: 1.2,
        duration: 1.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        }
      });
    }
  });

  const heroBgImg = document.querySelector('.hero__bg-img');
  if (heroBgImg && !heroBgImg._parallax) {
    heroBgImg._parallax = true;
    gsap.to(heroBgImg, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }
    });
  }

  const projHeroImg = document.querySelector('.proj-hero__bg img');
  if (projHeroImg && !projHeroImg._parallax) {
    projHeroImg._parallax = true;
    gsap.to(projHeroImg, {
      yPercent: 22,
      ease: 'none',
      scrollTrigger: {
        trigger: '.proj-hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
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
