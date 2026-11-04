/* global process, console */
/**
 * R0512 (TECH-70, r11-d3): `npm run check`, the developer loop's gate. Runs the typecheck
 * (incremental), lint (cached), the unit tests and the content check side by side, prints
 * each one's time and the tail of anything that failed, and exits non-zero if any did.
 * `npm test` (both projects) and the build stay separate, as before a push.
 */
import { spawn } from 'node:child_process';

const jobs = [
  ['typecheck', 'npx tsc --noEmit -p .'],
  ['lint', 'npm run lint --silent'],
  ['unit tests', 'npx vitest run --project unit'],
  ['content', 'npx tsx tests/tools/content-check.ts'],
];

const run = ([name, cmd]) =>
  new Promise((done) => {
    const t0 = Date.now();
    let out = '';
    const p = spawn(cmd, { shell: true, env: { ...process.env, FORCE_COLOR: '0' } });
    p.stdout.on('data', (d) => (out += d));
    p.stderr.on('data', (d) => (out += d));
    p.on('close', (code) => done({ name, code, s: (Date.now() - t0) / 1000, out }));
  });

const t0 = Date.now();
const results = await Promise.all(jobs.map(run));
for (const r of results) {
  console.log(`${r.code === 0 ? 'ok  ' : 'FAIL'} ${r.name.padEnd(11)} ${r.s.toFixed(1)} s`);
  if (r.code !== 0) console.log(r.out.trim().split('\n').slice(-25).join('\n') + '\n');
}
console.log(`total ${((Date.now() - t0) / 1000).toFixed(1)} s`);
process.exit(results.some((r) => r.code !== 0) ? 1 : 0);
