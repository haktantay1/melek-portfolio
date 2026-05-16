export function initNoise() {
  const canvas = document.getElementById('noise-canvas');
  if (!canvas) return;

  canvas.style.cssText = `
    position: fixed; top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: var(--z-noise);
    opacity: 0.028;
    mix-blend-mode: multiply;
  `;

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let frame = 0;
  function generateNoise() {
    if (++frame % 3 !== 0) { requestAnimationFrame(generateNoise); return; }
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255 | 0;
      imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = v;
      imageData.data[i+3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(generateNoise);
  }
  generateNoise();
}
