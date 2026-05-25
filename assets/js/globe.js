import * as THREE from 'three';
import { gsap } from 'gsap';

/* ═════════════════════════════════════════════════════════════
   ROTATING WIREFRAME GLOBE with project location markers.
   ═════════════════════════════════════════════════════════════ */

export function initGlobe() {
  const host = document.querySelector('[data-globe]');
  if (!host) return;

  try {
    const t = document.createElement('canvas').getContext('webgl');
    if (!t) throw new Error('no webgl');
  } catch (e) { return; }

  // Project locations [lat, lon, label]
  const PROJECTS = [
    [41.0082,  28.9784, 'İstanbul · HQ',          true],
    [39.9334,  32.8597, 'Ankara · TR',            false],
    [38.4192,  27.1287, 'İzmir · TR',             false],
    [33.3152,  44.3661, 'Baghdad · Iraq',         false],
    [40.0691,  29.5168, 'Ida Mountains · TR',     false],
    [33.3128,  44.3615, 'Erbil · Iraq',           false],
    [40.7639,  29.9405, 'Gebze · TR',             false],
  ];

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 6);

  const fit = () => {
    const s = host.clientWidth;
    renderer.setSize(s, s, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  };
  fit();
  window.addEventListener('resize', fit);

  const group = new THREE.Group();
  scene.add(group);

  // Wireframe sphere
  const sphereGeo = new THREE.IcosahedronGeometry(2, 3);
  const wireMat = new THREE.LineBasicMaterial({
    color: 0x0C0C0C, transparent: true, opacity: 0.18,
  });
  const wireframe = new THREE.LineSegments(
    new THREE.WireframeGeometry(sphereGeo), wireMat
  );
  group.add(wireframe);

  // Inner solid (very dark)
  const solidMat = new THREE.MeshBasicMaterial({
    color: 0xF4F2EE, transparent: true, opacity: 0.6, side: THREE.BackSide,
  });
  const innerSphere = new THREE.Mesh(new THREE.SphereGeometry(1.98, 48, 48), solidMat);
  group.add(innerSphere);

  // Dot grid sphere (latitude/longitude dots)
  const dotMat = new THREE.PointsMaterial({
    color: 0x0C0C0C, size: 0.028, transparent: true, opacity: 0.65, sizeAttenuation: true,
  });
  const dotPositions = [];
  const STEP = 6;
  for (let lat = -88; lat <= 88; lat += STEP) {
    const r = Math.cos(lat * Math.PI / 180);
    const circumference = 2 * Math.PI * r;
    const dots = Math.max(Math.floor(circumference * 22), 6);
    for (let i = 0; i < dots; i++) {
      const lon = (i / dots) * 360 - 180;
      const p = latLonToVec(lat, lon, 2.005);
      dotPositions.push(p.x, p.y, p.z);
    }
  }
  const dotGeo = new THREE.BufferGeometry();
  dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3));
  const dots = new THREE.Points(dotGeo, dotMat);
  group.add(dots);

  // Project markers
  const markers = new THREE.Group();
  group.add(markers);
  PROJECTS.forEach(([lat, lon, label, primary]) => {
    const pos = latLonToVec(lat, lon, 2.06);
    const markerMat = new THREE.MeshBasicMaterial({ color: primary ? 0x8C1F2A : 0x0C0C0C });
    const marker = new THREE.Mesh(new THREE.SphereGeometry(primary ? 0.05 : 0.035, 16, 16), markerMat);
    marker.position.copy(pos);
    markers.add(marker);

    // pulse ring
    if (primary) {
      const ringGeo = new THREE.RingGeometry(0.08, 0.1, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x8C1F2A, transparent: true, opacity: 0.7, side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.lookAt(0, 0, 0);
      ring.userData._pulse = true;
      markers.add(ring);
    }
  });

  // initial tilt
  group.rotation.x = -0.25;
  group.rotation.y = -1.0;

  // mouse interactivity
  let targetRotY = group.rotation.y;
  let targetRotX = group.rotation.x;
  let isDown = false;
  let downX = 0, downY = 0, startRotY = 0, startRotX = 0;

  host.addEventListener('mousedown', e => {
    isDown = true; downX = e.clientX; downY = e.clientY;
    startRotY = targetRotY; startRotX = targetRotX;
    host.style.cursor = 'grabbing';
  });
  window.addEventListener('mouseup', () => { isDown = false; host.style.cursor = ''; });
  window.addEventListener('mousemove', e => {
    if (!isDown) return;
    targetRotY = startRotY + (e.clientX - downX) * 0.006;
    targetRotX = Math.max(-1.0, Math.min(1.0, startRotX - (e.clientY - downY) * 0.005));
  });

  // pause when off-screen
  let running = true;
  const io = new IntersectionObserver(e => running = e[0].isIntersecting, { rootMargin: '300px' });
  io.observe(host);

  const clock = new THREE.Clock();
  function tick() {
    requestAnimationFrame(tick);
    if (!running) return;
    const t = clock.getElapsedTime();

    if (!isDown) targetRotY += 0.0028;

    group.rotation.y += (targetRotY - group.rotation.y) * 0.06;
    group.rotation.x += (targetRotX - group.rotation.x) * 0.06;

    // pulse rings
    markers.children.forEach(m => {
      if (m.userData._pulse) {
        const s = 1 + Math.sin(t * 1.8) * 0.4;
        m.scale.set(s, s, s);
        m.material.opacity = 0.7 - (s - 0.6) * 0.5;
      }
    });

    renderer.render(scene, camera);
  }
  tick();
}

function latLonToVec(latDeg, lonDeg, r) {
  const lat = latDeg * Math.PI / 180;
  const lon = lonDeg * Math.PI / 180;
  return new THREE.Vector3(
    r * Math.cos(lat) * Math.cos(lon),
    r * Math.sin(lat),
    -r * Math.cos(lat) * Math.sin(lon)
  );
}

/* ═════════════════════════════════════════════════════════════
   LIVE TIMES — keeps each [data-tz] element's clock current.
   ═════════════════════════════════════════════════════════════ */
export function initLiveTimes() {
  const els = document.querySelectorAll('[data-tz]');
  if (!els.length) return;

  const update = () => {
    els.forEach(el => {
      const tz = el.dataset.tz;
      try {
        const t = new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit', minute: '2-digit', timeZone: tz, hour12: false,
        });
        el.textContent = t;
      } catch (e) { /* invalid tz */ }
    });
  };
  update();
  setInterval(update, 30000);
}
