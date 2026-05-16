export function initNoise() {
  const canvas = document.getElementById('noise-canvas');
  if (!canvas) return;
  if (canvas._inited) return;
  canvas._inited = true;

  canvas.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: 100vw; height: 100vh;
    pointer-events: none;
    z-index: 9997;
    opacity: 0.04;
    mix-blend-mode: multiply;
  `;

  const ctx = canvas.getContext('2d', { alpha: true });
  const SCALE = 1.5;

  function resize() {
    canvas.width  = Math.floor(window.innerWidth / SCALE);
    canvas.height = Math.floor(window.innerHeight / SCALE);
  }
  resize();
  window.addEventListener('resize', resize);

  let frame = 0;
  function generateNoise() {
    if (++frame % 4 !== 0) {
      requestAnimationFrame(generateNoise);
      return;
    }
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      data[i] = data[i+1] = data[i+2] = v;
      data[i+3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(generateNoise);
  }
  generateNoise();
}
