import { defineConfig } from 'vite';

// Set this to your GitHub repo name if deploying as a project page
// e.g. '/melek-portfolio/' for username.github.io/melek-portfolio
// Leave as '/' if using a custom domain or user/org page (username.github.io)
const BASE = '/melek-portfolio/';

// Bare-import deps that are resolved at runtime by the importmap
// in each HTML file (es-module-shims polyfills it). Vite must NOT
// try to bundle these or it errors with "Failed to resolve import".
const CDN_EXTERNALS = [
  'three',
  'gsap',
  /^gsap\//,
  'lenis',
];

export default defineConfig({
  root: '.',
  base: BASE,
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      external: CDN_EXTERNALS,
      input: {
        main:                 'index.html',
        work:                 'work.html',
        about:                'about.html',
        contact:              'contact.html',
        'minimalist-living':  'projects/minimalist-living.html',
        'private-nook':       'projects/private-nook.html',
        'villa-ida':          'projects/villa-ida.html',
        'sarot-thermal':      'projects/sarot-thermal.html',
        'tubitak-tusside':    'projects/tubitak-tusside.html',
        'healthcare-iraq':    'projects/healthcare-iraq.html',
        'candyzoo-izmir':     'projects/candyzoo-izmir.html',
      },
      output: {
        // Rewrite external bare-specifiers to absolute CDN URLs in the
        // bundled output so the browser can resolve them without
        // relying on the runtime importmap.
        paths: (id) => {
          if (id === 'three') return 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
          if (id === 'gsap')  return 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js';
          if (id === 'lenis') return 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.mjs';
          if (id.startsWith('gsap/')) return `https://cdn.jsdelivr.net/npm/gsap@3.12.5/${id.slice(5)}`;
          return id;
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  }
});
