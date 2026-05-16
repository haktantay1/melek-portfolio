import { gsap } from 'gsap';

export function initMarquee() {
  const marquee = document.querySelector('.marquee-inner');
  if (!marquee || marquee._marqueeInited) return;
  marquee._marqueeInited = true;

  marquee.innerHTML += marquee.innerHTML;

  const tween = gsap.to(marquee, {
    xPercent: -50,
    duration: 38,
    ease: 'none',
    repeat: -1,
  });

  let lastScroll = 0;
  let timeout = null;
  window.addEventListener('scroll', () => {
    const delta = Math.abs(window.scrollY - lastScroll);
    const speed = Math.min(delta * 0.25, 3);
    tween.timeScale(1 + speed);
    clearTimeout(timeout);
    timeout = setTimeout(() => tween.timeScale(1), 280);
    lastScroll = window.scrollY;
  }, { passive: true });
}
