import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';

/* ═══════════════════════════════════════════════════════
   HERO — fullscreen WebGL plane with rippling image,
   cycling between project covers, mouse-driven displacement
   ═══════════════════════════════════════════════════════ */

const HERO_VERT = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const HERO_FRAG = /* glsl */`
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uMix;
  uniform float uRippleStrength;
  uniform float uMouseStrength;
  uniform vec2  uMouse;
  uniform vec2  uRes;
  uniform vec2  uImgA;
  uniform vec2  uImgB;
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;

  vec2 cover(vec2 uv, vec2 imgRes, vec2 canvasRes) {
    float canvasAspect = canvasRes.x / canvasRes.y;
    float imgAspect    = imgRes.x / imgRes.y;
    vec2 scale = vec2(1.0);
    if (canvasAspect > imgAspect) scale.y = imgAspect / canvasAspect;
    else                          scale.x = canvasAspect / imgAspect;
    return (uv - 0.5) * scale + 0.5;
  }

  // 2D noise
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  vec4 sampleAt(sampler2D tex, vec2 uv, vec2 imgRes) {
    return texture2D(tex, cover(uv, imgRes, uRes));
  }

  void main() {
    vec2 uv = vUv;

    // ── MOUSE BULGE (much stronger)
    float dist = distance(uv, uMouse);
    float bulge = smoothstep(0.6, 0.0, dist) * 0.12 * uMouseStrength;
    vec2 dir = normalize(uv - uMouse + 0.0001);
    uv -= dir * bulge;

    // ── FLOWING NOISE DISPLACEMENT (bigger waves)
    float n = noise(uv * 3.2 + uTime * 0.18);
    float wave = sin(uv.y * 7.0 + uTime * 0.45 + n * 2.5) * 0.008
               + sin(uv.x * 9.0 + uTime * 0.30 + n * 2.0) * 0.008;
    uv.x += wave * uRippleStrength;
    uv.y += wave * uRippleStrength * 0.85;

    // ── RGB SHIFT — chromatic abberation, intensified by mouse
    float ca = 0.0035 + uMouseStrength * 0.008;
    vec4 colA_r = sampleAt(uTexA, uv + vec2(ca, 0.0), uImgA);
    vec4 colA_g = sampleAt(uTexA, uv,                 uImgA);
    vec4 colA_b = sampleAt(uTexA, uv - vec2(ca, 0.0), uImgA);
    vec4 colA = vec4(colA_r.r, colA_g.g, colA_b.b, colA_g.a);

    vec4 colB_r = sampleAt(uTexB, uv + vec2(ca, 0.0), uImgB);
    vec4 colB_g = sampleAt(uTexB, uv,                 uImgB);
    vec4 colB_b = sampleAt(uTexB, uv - vec2(ca, 0.0), uImgB);
    vec4 colB = vec4(colB_r.r, colB_g.g, colB_b.b, colB_g.a);

    // ── CROSSFADE with diagonal sweep mask
    float sweep = smoothstep(uMix - 0.25, uMix + 0.25, uv.x + uv.y * 0.4);
    vec4 col = mix(colA, colB, sweep);

    // ── VIGNETTE (less aggressive — image more visible)
    float vig = smoothstep(1.0, 0.45, distance(vUv, vec2(0.5)));
    col.rgb *= vig * 0.55 + 0.45;

    // ── COLOR GRADING (cinematic teal-orange)
    col.rgb = mix(col.rgb, col.rgb * vec3(1.12, 0.98, 0.84), 0.22);
    col.rgb += vec3(0.04, 0.02, 0.0) * smoothstep(0.5, 0.0, distance(vUv, vec2(0.5)));

    // ── SCAN LINES (subtle)
    float scan = sin(vUv.y * uRes.y * 1.5) * 0.015;
    col.rgb += scan;

    // ── GRAIN
    float grain = fract(sin(dot(uv * 1024.0 + uTime, vec2(12.9898, 78.233))) * 43758.5453);
    col.rgb += (grain - 0.5) * 0.05;

    gl_FragColor = col;
  }
`;

export function initHeroWebGL() {
  const host = document.querySelector('[data-hero-webgl]');
  if (!host) return;

  // WebGL availability check
  try {
    const test = document.createElement('canvas').getContext('webgl');
    if (!test) throw new Error('no webgl');
  } catch (e) {
    host.remove();
    return;
  }

  const imageList = (host.dataset.images || '').split(',').map(s => s.trim()).filter(Boolean);
  if (imageList.length < 2) imageList.push(imageList[0] || './assets/images/projects/p03-cover.jpg');

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const fit = () => {
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false);
  };
  host.appendChild(renderer.domElement);
  fit();

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);

  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin('anonymous');

  const loadTex = (url) => new Promise((res) => {
    loader.load(url,
      tex => {
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.generateMipmaps = false;
        res(tex);
      },
      undefined,
      () => res(null)
    );
  });

  let texA, texB;
  let imgA = new THREE.Vector2(1, 1);
  let imgB = new THREE.Vector2(1, 1);

  const uniforms = {
    uTime:            { value: 0 },
    uMix:             { value: 0 },
    uRippleStrength:  { value: 0.45 },
    uMouseStrength:   { value: 0 },
    uMouse:           { value: new THREE.Vector2(0.5, 0.5) },
    uRes:             { value: new THREE.Vector2(host.clientWidth, host.clientHeight) },
    uImgA:            { value: imgA },
    uImgB:            { value: imgB },
    uTexA:            { value: null },
    uTexB:            { value: null },
  };

  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    vertexShader: HERO_VERT,
    fragmentShader: HERO_FRAG,
    uniforms,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  Promise.all([loadTex(imageList[0]), loadTex(imageList[1] || imageList[0])]).then(([a, b]) => {
    if (a) {
      texA = a;
      uniforms.uTexA.value = a;
      imgA.set(a.image.naturalWidth || a.image.width, a.image.naturalHeight || a.image.height);
    }
    if (b) {
      texB = b;
      uniforms.uTexB.value = b;
      imgB.set(b.image.naturalWidth || b.image.width, b.image.naturalHeight || b.image.height);
    }
    cycle(2);
  });

  // mouse tracking — normalized to UV space (y inverted)
  const targetMouse = new THREE.Vector2(0.5, 0.5);
  let targetMouseStrength = 0;
  host.addEventListener('mousemove', e => {
    const r = host.getBoundingClientRect();
    targetMouse.set(
      (e.clientX - r.left) / r.width,
      1 - (e.clientY - r.top) / r.height
    );
    targetMouseStrength = 1;
  });
  host.addEventListener('mouseleave', () => {
    targetMouseStrength = 0;
  });

  // cycle: load next image into the unused slot, crossfade
  let idx = 0;
  let isCycling = false;
  function cycle(nextIdx) {
    if (isCycling) return;
    if (nextIdx === undefined) nextIdx = (idx + 1) % imageList.length;
    isCycling = true;
    const goingToB = uniforms.uMix.value < 0.5;
    const target   = goingToB ? 1 : 0;
    const otherSlot = goingToB ? 'uTexB' : 'uTexA';
    const otherImg  = goingToB ? imgB : imgA;
    loadTex(imageList[nextIdx]).then(tex => {
      if (tex) {
        uniforms[otherSlot].value = tex;
        otherImg.set(tex.image.naturalWidth || tex.image.width, tex.image.naturalHeight || tex.image.height);
      }
      gsap.to(uniforms.uMix, {
        value: target,
        duration: 1.8,
        ease: 'expo.inOut',
        onComplete: () => {
          idx = nextIdx;
          isCycling = false;
        }
      });
    });
  }

  // auto-rotate every 5s
  setInterval(() => cycle(), 5200);

  // resize
  window.addEventListener('resize', () => {
    fit();
    uniforms.uRes.value.set(host.clientWidth, host.clientHeight);
  });

  // render loop
  const clock = new THREE.Clock();
  function tick() {
    requestAnimationFrame(tick);
    uniforms.uTime.value += clock.getDelta();

    // ease mouse
    uniforms.uMouse.value.x += (targetMouse.x - uniforms.uMouse.value.x) * 0.08;
    uniforms.uMouse.value.y += (targetMouse.y - uniforms.uMouse.value.y) * 0.08;
    uniforms.uMouseStrength.value += (targetMouseStrength - uniforms.uMouseStrength.value) * 0.05;

    renderer.render(scene, camera);
  }
  tick();

  // hide fallback once webgl is up
  setTimeout(() => {
    const fb = document.querySelector('.hero__fallback-bg');
    if (fb) fb.style.opacity = '0';
  }, 200);
}

/* ═══════════════════════════════════════════════════════
   PROJECT CARD WEBGL — hover-driven image displacement
   ═══════════════════════════════════════════════════════ */

const CARD_VERT = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const CARD_FRAG = /* glsl */`
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uHover;
  uniform vec2  uMouse;
  uniform vec2  uRes;
  uniform vec2  uImgRes;
  uniform sampler2D uTex;

  vec2 cover(vec2 uv, vec2 imgRes, vec2 canvasRes) {
    float canvasAspect = canvasRes.x / canvasRes.y;
    float imgAspect    = imgRes.x / imgRes.y;
    vec2 scale = vec2(1.0);
    if (canvasAspect > imgAspect) {
      scale.y = imgAspect / canvasAspect;
    } else {
      scale.x = canvasAspect / imgAspect;
    }
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    vec2 uv = vUv;
    float dist = distance(uv, uMouse);
    float bulge = smoothstep(0.6, 0.0, dist) * 0.08 * uHover;
    vec2 dir = normalize(uv - uMouse + 0.0001);
    uv -= dir * bulge;

    vec2 cUv = cover(uv, uImgRes, uRes);
    vec4 col = texture2D(uTex, cUv);

    // RGB shift on hover
    float shift = 0.005 * uHover;
    float r = texture2D(uTex, cover(uv + vec2(shift, 0.0), uImgRes, uRes)).r;
    float b = texture2D(uTex, cover(uv - vec2(shift, 0.0), uImgRes, uRes)).b;
    col.r = r;
    col.b = b;

    // gentle saturation push
    col.rgb = mix(col.rgb, col.rgb * vec3(1.08, 0.98, 0.92), 0.1 + uHover * 0.15);

    gl_FragColor = col;
  }
`;

/* Legacy chromatic-aberration card shader retired in favour of the
   CSS-driven cinematic spotlight in cardCinematic.js — visual was
   too glitchy for an interior-design portfolio. */
export function initCardWebGL() {}
