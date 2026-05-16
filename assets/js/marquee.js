import { gsap } from 'gsap';

export function initMarquee() {
  const marquee = document.querySelector('.marquee-inner');
  if (!marquee) return;

  marquee.innerHTML += marquee.innerHTML;

  const tween = gsap.to(marquee, {
    x: '-50%',
    duration: 30,
    ease: 'none',
    repeat: -1,
  });

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const delta = Math.abs(window.scrollY - lastScroll);
    const speed = Math.min(delta * 0.3, 3);
    tween.timeScale(1 + speed);
    clearTimeout(window._marqueeTimeout);
    window._marqueeTimeout = setTimeout(() => tween.timeScale(1), 300);
    lastScroll = window.scrollY;
  }, { passive: true });
}
