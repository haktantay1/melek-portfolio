import { gsap } from 'gsap';

export function initMarquee() {
  document.querySelectorAll('.marquee-inner').forEach((marquee) => {
    if (marquee._marqueeInited) return;
    marquee._marqueeInited = true;

    // duplicate content for seamless loop
    marquee.innerHTML += marquee.innerHTML;

    const reverse = marquee.hasAttribute('data-marquee-reverse');
    const duration = parseFloat(marquee.dataset.marqueeDuration) || 42;

    const tween = gsap.to(marquee, {
      xPercent: reverse ? 50 : -50,
      duration,
      ease: 'none',
      repeat: -1,
    });
    gsap.set(marquee, { xPercent: reverse ? -50 : 0 });

    let lastScroll = 0;
    let timeout = null;
    window.addEventListener('scroll', () => {
      const delta = Math.abs(window.scrollY - lastScroll);
      const speed = Math.min(delta * 0.22, 3.5);
      tween.timeScale(1 + speed);
      clearTimeout(timeout);
      timeout = setTimeout(() => tween.timeScale(1), 320);
      lastScroll = window.scrollY;
    }, { passive: true });
  });
}
