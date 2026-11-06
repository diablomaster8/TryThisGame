/**
 * `npm run test:changed`: runs only the test files that import (directly or not) a file you
 * changed. A quick gate for intermediate checks. It is no substitute for the full `npm test`,
 * which stays required before a push.
 *
 * Changed = committed on this branch since it left origin/main, plus staged, unstaged and
 * untracked files. Pass `--base <ref>` to compare with another ref, `--staged-only` to look
 * at the index only, and anything after `--` goes to vitest.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const dash = args.indexOf('--');
const own = dash === -1 ? args : args.slice(0, dash);
const rest = dash === -1 ? [] : args.slice(dash + 1);
const baseAt = own.indexOf('--base');
const base = baseAt === -1 ? 'origin/main' : own[baseAt + 1];

function git(...a) {
  const r = spawnSync('git', a, { encoding: 'utf8' });
  return r.status === 0 ? r.stdout.split('\n').filter(Boolean) : [];
}

const changed = new Set();
if (!own.includes('--staged-only')) {
  for (const f of git('diff', '--name-only', `${base}...HEAD`)) changed.add(f);
  for (const f of git('diff', '--name-only')) changed.add(f);
  for (const f of git('ls-files', '--others', '--exclude-standard')) changed.add(f);
}
for (const f of git('diff', '--name-only', '--cached')) changed.add(f);

// Only files that code or a test can import; docs, scripts and images cannot change a result.
const relevant = [...changed].filter(
  (f) =>
    /^(src|tests|public)\//.test(f) &&
    /\.(ts|tsx|mts|cts|js|cjs|mjs|json)$/.test(f) &&
    existsSync(f),
);
if (relevant.length === 0) {
  console.log('test:changed: no changed source or test files; nothing to run.');
  process.exit(0);
}
console.log(`test:changed: ${relevant.length} changed file(s) vs ${base}`);

const vitest = resolve('node_modules/vitest/vitest.mjs');
const run = spawnSync(
  process.execPath,
  [vitest, 'related', '--run', '--passWithNoTests', ...relevant, ...rest],
  { stdio: 'inherit' },
);
process.exit(run.status ?? 1);
