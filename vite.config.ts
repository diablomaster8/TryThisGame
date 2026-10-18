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
    // Three.js alone is ~540 kB minified (~140 kB gzip); that is expected.
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
