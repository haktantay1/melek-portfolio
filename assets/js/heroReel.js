import { gsap } from 'gsap';

/* ═════════════════════════════════════════════════════════════
   HERO SHOWREEL — fullscreen project carousel.
   Cycles through 7 projects every 7.5s with crossfade + Ken Burns.
   Display title is a 2-line italic + roman composition that
   updates per slide.
   ═════════════════════════════════════════════════════════════ */

const PROJECTS = [
  { italic: 'Villa',       roman: 'İDA',            location: 'Ida Mountains, Türkiye',  category: 'Architecture + Interior · 2024',          href: './projects/villa-ida.html' },
  { italic: 'Minimalist',  roman: 'Living',         location: 'İstanbul, Türkiye',       category: 'Residential Interior · 2024',             href: './projects/minimalist-living.html' },
  { italic: 'Sarot',       roman: 'Thermal',        location: 'Bolu, Türkiye',           category: 'Hospitality · Presidential Suite · 2023', href: './projects/sarot-thermal.html' },
  { italic: 'Private',     roman: 'Nook',           location: 'Türkiye',                 category: 'Residential Interior · 2024',             href: './projects/private-nook.html' },
  { italic: 'TÜBİTAK',     roman: 'TÜSSİDE',        location: 'Gebze, Türkiye',          category: 'Corporate Interior · 2023',               href: './projects/tubitak-tusside.html' },
  { italic: 'Mixed-Use',   roman: 'Healthcare',     location: 'Baghdad, Iraq',           category: 'Execution Drawings · 2023',               href: './projects/healthcare-iraq.html' },
  { italic: 'CandyZoo',    roman: 'İzmir',          location: 'İzmir, Türkiye',          category: 'Retail Implementation · 2022',            href: './projects/candyzoo-izmir.html' },
];
const SLIDE_DURATION_MS = 7500;

let idx = 0;
let timer = null;
let slides, dots, titleEl, locationEl, linkEl, currentEl, categoryEl;

export function initHeroReel() {
  slides     = document.querySelectorAll('[data-slide]');
  dots       = document.querySelectorAll('[data-showreel-go]');
  titleEl    = document.querySelector('[data-showreel-title]');
  locationEl = document.querySelector('[data-showreel-location]');
  linkEl     = document.querySelector('[data-showreel-link]');
  currentEl  = document.querySelector('[data-showreel-current]');
  categoryEl = document.querySelector('[data-showreel-category]');
  const prevBtn = document.querySelector('[data-showreel-prev]');
  const nextBtn = document.querySelector('[data-showreel-next]');

  if (!slides.length) return;

  apply(0, true);
  start();

  dots.forEach(d => d.addEventListener('click', () => goTo(parseInt(d.dataset.showreelGo, 10))));
  prevBtn?.addEventListener('click', () => goTo((idx - 1 + slides.length) % slides.length));
  nextBtn?.addEventListener('click', () => goTo((idx + 1) % slides.length));

  const host = document.querySelector('.hero__display') || document.querySelector('.hero__center');
  host?.addEventListener('mouseenter', stop);
  host?.addEventListener('mouseleave', start);
}

function start() {
  stop();
  timer = setInterval(() => goTo((idx + 1) % slides.length), SLIDE_DURATION_MS);
}
function stop() { if (timer) { clearInterval(timer); timer = null; } }

function goTo(i) {
  if (i === idx) return;
  apply(i);
  stop(); start();
}

function setTitle(p) {
  if (!titleEl) return;
  // Two-line composition: italic display line + roman display line
  titleEl.innerHTML = `
    <span class="hero__display-line"><em>${p.italic}</em></span>
    <span class="hero__display-line">${p.roman}</span>`;
}

function apply(i, initial = false) {
  slides.forEach((s, n) => {
    s.classList.toggle('is-active', n === i);
    if (n === i) {
      s.style.animation = 'none';
      // eslint-disable-next-line no-unused-expressions
      s.offsetHeight;
      s.style.animation = '';
    }
  });

  dots.forEach((d, n) => d.classList.toggle('is-active', n === i));

  const p = PROJECTS[i];

  if (!initial) {
    const lineEls = titleEl ? titleEl.querySelectorAll('.hero__display-line') : [];
    const fadeTargets = [locationEl, ...lineEls, linkEl, categoryEl, currentEl].filter(Boolean);
    gsap.fromTo(fadeTargets,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.85, ease: 'expo.out', stagger: 0.06,
        onStart: () => setTitle(p),
      });
  } else {
    setTitle(p);
  }

  if (locationEl) locationEl.textContent = p.location.toUpperCase();
  if (linkEl)     linkEl.setAttribute('href', p.href);
  if (categoryEl) categoryEl.textContent = p.category;
  if (currentEl)  currentEl.textContent  = String(i + 1).padStart(2, '0');

  idx = i;
}
