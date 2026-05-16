import { gsap } from 'gsap';

export function initLoader(onComplete) {
  if (sessionStorage.getItem('visited')) {
    document.getElementById('loader')?.remove();
    onComplete();
    return;
  }
  sessionStorage.setItem('visited', 'true');

  const counter = document.querySelector('.loader-counter');
  if (!counter) { onComplete(); return; }

  const tl = gsap.timeline({
    onComplete: () => {
      document.getElementById('loader').remove();
      onComplete();
    }
  });

  tl
    .to(counter, {
      duration: 1.8,
      innerHTML: 100,
      snap: { innerHTML: 1 },
      ease: 'power2.inOut',
    })
    .to('.loader-bar--top', {
      scaleY: 1,
      duration: 0.9,
      ease: 'power4.inOut',
    }, '-=0.4')
    .to('.loader-bar--bottom', {
      scaleY: 1,
      duration: 0.9,
      ease: 'power4.inOut',
    }, '<')
    .to('.loader-content', {
      opacity: 0,
      duration: 0.2,
    }, '-=0.9');
}
