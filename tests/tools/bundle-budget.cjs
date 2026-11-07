/* global require, process, console, __dirname */
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * TECH-41: the bundle budget, run after `npm run build` (`npm run check:bundle`).
 *
 * - The eager set is every script `dist/index.html` loads or modulepreloads; its gzip total
 *   must stay within 10% of `bundle-baseline.json` (and under `eagerCeilingKb`).
 * - Modules that must stay lazy (the Full 3D scene, the debug panel, the toon outline) must
 *   each come out as their own chunk outside the eager set: a static import merges them into
 *   the index chunk and their chunk disappears, which fails here.
 * - No chunk may pass `chunkCeilingKb` gzip unless the baseline already lists it, and no
 *   listed lazy group may grow more than 10%.
 *
 * `--update` rewrites the baseline from this build. Prints a table either way.
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = path.resolve(__dirname, '../..');
const dist = path.join(root, 'dist');
const basePath = path.join(__dirname, 'bundle-baseline.json');
const LAZY_ONLY = ['grove-3d-scene', 'debug-panel', 'toon-outline'];
const GROW = 1.1;

const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const eager = [
  ...new Set([...html.matchAll(/(?:src|href)="[^"]*?assets\/([^"]+\.js)"/g)].map((m) => m[1])),
];
const kb = (f) => zlib.gzipSync(fs.readFileSync(path.join(dist, 'assets', f))).length / 1024;
/** `name-HASH.js` → `name` (hashes are 8 base64url characters). */
const group = (f) => f.replace(/-[A-Za-z0-9_-]{8}\.js$/, '');

const chunks = {};
for (const f of fs.readdirSync(path.join(dist, 'assets')).filter((f) => f.endsWith('.js'))) {
  const g = group(f);
  chunks[g] = (chunks[g] ?? 0) + kb(f);
}
const eagerKb = eager.reduce((t, f) => t + kb(f), 0);

if (process.argv.includes('--update')) {
  const big = Object.fromEntries(
    Object.entries(chunks)
      .filter(([, v]) => v >= 100)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => [k, Math.round(v)]),
  );
  const out = {
    eagerKb: Math.round(eagerKb),
    // R0446 (r12-d3): the title paints before the sim loads (boot-late.ts, kids-portrait.ts);
    // the first download is ~107 kB gzip, so the hard ceiling drops from 1000 to 160.
    eagerCeilingKb: 160,
    chunkCeilingKb: 1536,
    chunks: big,
  };
  fs.writeFileSync(basePath, JSON.stringify(out, null, 2) + '\n');
  console.log(`baseline written: eager ${out.eagerKb} kB gz`);
  process.exit(0);
}

const base = JSON.parse(fs.readFileSync(basePath, 'utf8'));
const fails = [];
console.log('eager scripts (kB gzip):');
for (const f of eager) console.log(`  ${kb(f).toFixed(0).padStart(6)}  ${f}`);
console.log(`  ${eagerKb.toFixed(0).padStart(6)}  total (baseline ${base.eagerKb})`);
if (eagerKb > base.eagerKb * GROW)
  fails.push(`eager ${eagerKb.toFixed(0)} kB > baseline ${base.eagerKb} +10%`);
if (eagerKb > base.eagerCeilingKb)
  fails.push(`eager ${eagerKb.toFixed(0)} kB > ceiling ${base.eagerCeilingKb}`);
for (const name of LAZY_ONLY) {
  if (!(name in chunks))
    fails.push(`${name} has no chunk of its own: something imports it statically`);
  else if (eager.some((f) => group(f) === name)) fails.push(`${name} is in the eager set`);
}
// R0446 (TECH-04, r11-d3): no Full 3D module, debug panel or stage inspector in the eager graph
// (the source list comes from the `eager-modules` plugin in vite.config.ts).
// perf-leaks D: `sculpt-spawn.ts` starts the sculpt workers from the title (no three.js, no
// species; the worker itself is its own file).
const EAGER_3D_OK = [
  'src/render3d/minigame-layout.ts',
  'src/render3d/terrain-shape.ts',
  'src/render3d/sculpt-spawn.ts',
];
// R0446 (r12-d3): nor the sim's world, save codec or story registry: the title paints first.
const NEVER_EAGER =
  /^src\/(render3d\/|ui\/debug-panel\.ts|ui\/stage-inspector\.ts|sim\/(world|save|story-scenes)\.ts)/;
const eagerListPath = path.join(dist, '.vite', 'eager-modules.json');
if (fs.existsSync(eagerListPath)) {
  const mods = JSON.parse(fs.readFileSync(eagerListPath, 'utf8'));
  const leaked = mods.filter((m) => NEVER_EAGER.test(m) && !EAGER_3D_OK.includes(m));
  console.log(`eager graph: ${mods.length} modules, ${leaked.length} that must stay lazy`);
  for (const m of leaked) fails.push(`${m} is in the eager graph`);
} else fails.push('dist/.vite/eager-modules.json missing (the eager-modules plugin did not run)');
console.log('largest chunks (kB gzip):');
for (const [k, v] of Object.entries(chunks)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 12)) {
  const was = base.chunks[k];
  console.log(`  ${v.toFixed(0).padStart(6)}  ${k}${was ? ` (baseline ${was})` : ''}`);
}
for (const [k, v] of Object.entries(chunks)) {
  const was = base.chunks[k];
  if (was !== undefined && v > was * GROW)
    fails.push(`${k} ${v.toFixed(0)} kB > baseline ${was} +10%`);
  if (was === undefined && v > base.chunkCeilingKb)
    fails.push(`new chunk ${k} ${v.toFixed(0)} kB > ceiling`);
}
if (fails.length) {
  console.error('\nbundle budget FAILED:\n  ' + fails.join('\n  '));
  process.exit(1);
}
console.log('\nbundle budget ok');
