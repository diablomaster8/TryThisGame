import { defineConfig } from 'vitest/config';

// BASE_PATH is set by the GitHub Pages workflow to "/<repo-name>/".
// Locally it is unset, so the app is served from "/".
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base,
  build: {
    target: 'es2022',
    sourcemap: false,
    // Three.js alone is ~540 kB minified (~140 kB gzip); that is expected.
    chunkSizeWarningLimit: 700,
  },
  server: {
    // `npm run dev -- --host` exposes the dev server on the LAN for phone testing.
    port: 5173,
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
