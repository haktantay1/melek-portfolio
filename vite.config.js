import { defineConfig } from 'vite';

// Set this to your GitHub repo name if deploying as a project page
// e.g. '/melek-portfolio/' for username.github.io/melek-portfolio
// Leave as '/' if using a custom domain or user/org page (username.github.io)
const BASE = '/melek-portfolio/';

export default defineConfig({
  root: '.',
  base: BASE,
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
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
      }
    }
  },
  server: {
    port: 3000,
    open: true,
  }
});
