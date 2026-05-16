import { gsap } from 'gsap';

export function initLoader(onComplete) {
  const loader = document.getElementById('loader');
  if (!loader) { onComplete(); return; }

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    if (loader.parentNode) loader.remove();
    onComplete();
  };
  const safety = setTimeout(finish, 3000);

  const wrap = (fn) => () => { clearTimeout(safety); fn(); };

  const isReturning = sessionStorage.getItem('mk-visited') === '1';
  sessionStorage.setItem('mk-visited', '1');

  if (isReturning) {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.out',
      onComplete: wrap(finish),
    });
    return;
  }

  const counter = document.querySelector('.loader-counter');
  const obj = { val: 0 };

  gsap.timeline({ onComplete: wrap(finish) })
    .to(obj, {
      val: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => { if (counter) counter.textContent = Math.round(obj.val); },
    })
    .to('.loader-bar--top', {
      scaleY: 1,
      duration: 0.8,
      ease: 'power4.inOut',
    }, '-=0.3')
    .to('.loader-bar--bottom', {
      scaleY: 1,
      duration: 0.8,
      ease: 'power4.inOut',
    }, '<')
    .to('.loader-content', {
      opacity: 0,
      duration: 0.25,
    }, '-=0.7');
}
