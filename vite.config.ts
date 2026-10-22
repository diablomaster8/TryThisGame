import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

// BASE_PATH is set by the GitHub Pages workflow to "/<repo-name>/".
// Locally it is unset, so the app is served from "/".
const base = process.env.BASE_PATH ?? '/';

/**
 * Stamps the service worker's cache name with this build's id: a hash of every emitted
 * file name, which already carry content hashes. A new deploy then installs a new worker,
 * which deletes the old caches, instead of serving the old shell forever.
 */
function swBuildId(): Plugin {
  let outDir = 'dist';
  let id = '';
  return {
    name: 'sw-build-id',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    generateBundle(_options, bundle) {
      id = createHash('sha256')
        .update(Object.keys(bundle).sort().join('\n'))
        .digest('hex')
        .slice(0, 12);
    },
    closeBundle() {
      const file = resolve(outDir, 'sw.js');
      if (!id || !existsSync(file)) return;
      const src = readFileSync(file, 'utf8');
      if (!src.includes('__GROVE_BUILD_ID__')) throw new Error('sw.js has no build id slot');
      writeFileSync(file, src.replaceAll('__GROVE_BUILD_ID__', id));
    },
  };
}

export default defineConfig({
  base,
  plugins: [swBuildId()],
  build: {
    target: 'es2022',
    sourcemap: false,
    // Measured 2026-10-21: the eager index chunk (Three.js, the sim, the UI) is ~1.27 MB
    // minified, ~373 kB gzip, and is all a Free Grove without a story loads before play.
    // The chunks past this limit are lazy script text: side-story-content (~1.23 MB, ~425 kB
    // gzip, awaited only by a save with a story), the Atlas catalogue (~2.8 MB, ~930 kB gzip,
    // on first open), each Learning Grove band (sprout ~1.0 MB / ~330 kB gzip, reader
    // ~2.0 MB / ~675 kB gzip, plus a shared ~350 kB / ~120 kB language chunk; only the save's
    // own band loads) and the bands' Atlas and Arcade versions (~2.0 MB and ~4.0 MB, loaded
    // only when asked for). The warning on those is expected; a new one is worth a look.
    chunkSizeWarningLimit: 700,
  },
  server: {
    // `npm run dev -- --host` exposes the dev server on the LAN for phone testing.
    port: 5173,
  },
  test: {
    include: ['tests/**/*.test.ts'],
    // The app loads the campaign and side-story scripts as chunks at boot; tests register them up front.
    setupFiles: ['tests/setup-side-stories.ts'],
    environment: 'node',
  },
});
