/* Live timezone-aware clocks for [data-tz] elements.
   Extracted from globe.js so the home page doesn't load three.js. */

export function initLiveTimes() {
  const nodes = document.querySelectorAll('[data-tz]');
  if (!nodes.length) return;

  const update = () => {
    nodes.forEach(el => {
      const tz = el.dataset.tz;
      let t;
      try {
        t = new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit', minute: '2-digit', timeZone: tz, hour12: false,
        });
      } catch {
        t = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      }
      const label = tz === 'Europe/Istanbul' ? 'IST'
                  : tz === 'Asia/Baghdad'    ? 'AST'
                  : tz?.split('/').pop() || '';
      el.textContent = `${t} — ${label}`;
    });
  };
  update();
  setInterval(update, 30000);
}
