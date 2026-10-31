import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

// BASE_PATH is set by the GitHub Pages workflow to "/<repo-name>/".
// Locally it is unset, so the app is served from "/".
const base = process.env.BASE_PATH ?? '/';

// TECH-45: tests run in UTC unless a TZ is given (CI also runs the sim suite in Asia/Tokyo);
// the sim itself reads no zone, so any TZ must pass.
process.env.TZ ??= 'UTC';

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

/**
 * Every browser the game supports reads woff2, so the language fonts' woff fallbacks would
 * only be dead weight on the host (Klee One's alone are 2.6 and 2.7 MB). Dropping them from
 * the Fontsource stylesheets keeps them out of the build; the fonts still load only when a
 * Hebrew or Japanese word is shown (`ui/lang-fonts.ts`).
 */
function woff2Only(): Plugin {
  return {
    name: 'woff2-only',
    enforce: 'pre',
    transform(code, id) {
      const file = id.split('?')[0]!;
      if (!/[\\/]@fontsource[\\/].+\.css$/.test(file)) return null;
      let css = code.replace(/,\s*url\([^)]+\.woff\)\s*format\(['"]woff['"]\)/g, '');
      // R0490 (TECH-49): Klee One loads as Fontsource's numbered unicode-range slices (each
      // under 60 kB) instead of the 2 MB "japanese" file. It is only ever used for Japanese
      // tracing, so its latin, cyrillic and greek faces are dropped.
      if (/[\\/]klee-one[\\/]\d+\.css$/.test(file)) {
        css = css.replace(/\/\* klee-one-(?!\[\d+\])[^*]*\*\/\s*@font-face\s*\{[^}]*\}\s*/g, '');
      }
      return css;
    },
  };
}

/**
 * R0461 (TECH-20): `offline-manifest.json` lists, per "Keep for offline" pack, the build
 * files that pack needs and their bytes, so Settings can show sizes and hand the service
 * worker the list. Packs are picked by chunk name, with every chunk they import. The
 * Learning Grove pack also takes the language font sheets, the font slices that hold the
 * Hebrew letters and the kana (the rest of a CJK font is ~10 MB and falls back to the
 * system font offline) and the language clips in public/audio/lang.
 */
const OFFLINE_PACKS: Record<string, RegExp> = {
  story: /^(campaign|side-story-content|storyline-content|strings-fun-r6)$/,
  edu: /^edu-/,
  worlds: /^(atlas|arcade|multiverse|neopia)-catalogue$/,
};
/** Hebrew alef, hiragana a and n, katakana a: a slice holding one of these is kept. */
const PACK_GLYPHS = [0x5d0, 0x3042, 0x3093, 0x30a2];

function coversGlyph(range: string): boolean {
  return range.split(',').some((part) => {
    const [a, b] = part.trim().replace(/^U\+/i, '').split('-');
    const lo = parseInt(a ?? '', 16);
    const hi = b ? parseInt(b, 16) : lo;
    return PACK_GLYPHS.some((g) => g >= lo && g <= hi);
  });
}

function offlineManifest(): Plugin {
  let publicDir = 'public';
  return {
    name: 'offline-manifest',
    apply: 'build',
    configResolved(config) {
      publicDir = config.publicDir;
    },
    generateBundle(_options, bundle) {
      const size = (f: string): number => {
        const o = bundle[f];
        if (!o) return 0;
        return o.type === 'chunk' ? Buffer.byteLength(o.code) : o.source.length;
      };
      // The boot chunks (the entry and its static imports) are cached on any first visit.
      const eager = new Set<string>();
      const walk = (f: string): void => {
        const o = bundle[f];
        if (!o || o.type !== 'chunk' || eager.has(f)) return;
        eager.add(f);
        o.imports.forEach(walk);
      };
      for (const o of Object.values(bundle)) if (o.type === 'chunk' && o.isEntry) walk(o.fileName);
      const packs: Record<string, { files: string[]; bytes: number }> = {};
      for (const [pack, test] of Object.entries(OFFLINE_PACKS)) {
        const files = new Set<string>();
        const add = (f: string): void => {
          const o = bundle[f];
          if (!o || files.has(f) || eager.has(f)) return;
          files.add(f);
          if (o.type !== 'chunk') return;
          o.imports.forEach(add);
          const meta = (
            o as { viteMetadata?: { importedCss: Set<string>; importedAssets: Set<string> } }
          ).viteMetadata;
          meta?.importedCss.forEach(add);
          meta?.importedAssets.forEach(add);
        };
        for (const o of Object.values(bundle)) {
          if (o.type === 'chunk' && test.test(o.name)) add(o.fileName);
        }
        packs[pack] = { files: [...files], bytes: 0 };
      }
      const edu = packs.edu!;
      for (const o of Object.values(bundle)) {
        if (o.type !== 'asset' || !o.fileName.endsWith('.css')) continue;
        const css = String(o.source);
        if (!css.includes('@font-face')) continue;
        edu.files.push(o.fileName);
        for (const face of css.split('@font-face').slice(1)) {
          const range = /unicode-range:\s*([^;}]+)/.exec(face)?.[1];
          const url = /url\(\.?\/?([^)]+\.woff2)\)/.exec(face)?.[1];
          if (!url || (range && !coversGlyph(range))) continue;
          const name = url.split('/').pop()!;
          const file = Object.keys(bundle).find((f) => f.endsWith(`/${name}`));
          if (file && !edu.files.includes(file)) edu.files.push(file);
        }
      }
      // Always kept (never a tick box): the web workers, which no resource list shows the
      // page, and the sprite manifest, so any first visit can play its Grove offline.
      packs.core = {
        files: [
          ...Object.keys(bundle).filter((f) => /[.-]worker-[\w-]+\.js$/.test(f)),
          'sprites/manifest.json',
        ],
        bytes: 0,
      };
      for (const p of Object.values(packs)) p.bytes = p.files.reduce((s, f) => s + size(f), 0);
      try {
        const dir = resolve(publicDir, 'audio/lang');
        for (const f of readdirSync(dir)) {
          if (/\.(mp3|wav|ogg|m4a)$/.test(f)) {
            edu.files.push(`audio/lang/${f}`);
            edu.bytes += statSync(resolve(dir, f)).size;
          }
        }
      } catch {
        // No clips folder: the pack is the chunks alone.
      }
      this.emitFile({
        type: 'asset',
        fileName: 'offline-manifest.json',
        source: JSON.stringify({ packs }),
      });
    },
  };
}

export default defineConfig({
  base,
  plugins: [swBuildId(), woff2Only(), offlineManifest()],
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
