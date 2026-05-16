import { gsap } from 'gsap';

export function initLoader(onComplete) {
  const loader = document.getElementById('loader');
  if (!loader) { onComplete(); return; }

  const isReturning = sessionStorage.getItem('visited') === 'true';
  sessionStorage.setItem('visited', 'true');

  if (isReturning) {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
      onComplete: () => {
        loader.remove();
        onComplete();
      }
    });
    return;
  }

  const counter = document.querySelector('.loader-counter');
  if (!counter) {
    loader.remove();
    onComplete();
    return;
  }

  const counterObj = { val: 0 };

  const tl = gsap.timeline({
    onComplete: () => {
      loader.remove();
      onComplete();
    }
  });

  tl
    .to(counterObj, {
      val: 100,
      duration: 2.0,
      ease: 'power2.inOut',
      onUpdate: () => {
        counter.textContent = Math.round(counterObj.val);
      },
    })
    .to('.loader-bar--top', {
      scaleY: 1,
      duration: 0.95,
      ease: 'power4.inOut',
    }, '-=0.35')
    .to('.loader-bar--bottom', {
      scaleY: 1,
      duration: 0.95,
      ease: 'power4.inOut',
    }, '<')
    .to('.loader-content', {
      opacity: 0,
      duration: 0.25,
    }, '-=0.9');
}
