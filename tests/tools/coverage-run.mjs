// R0485 (TECH-43): line coverage of src/input and src/platform. Runs every test file that imports
// either folder (plus tests/platform), reports per file, and exits 1 if either folder is under the
// target. Not part of the normal gate: `npm run test:coverage`. Needs @vitest/coverage-v8.
import { spawnSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const TARGET = Number(process.env.COVERAGE_TARGET ?? 70);
const FOLDERS = ['src/input', 'src/platform'];

const slash = (p) => p.split(String.fromCharCode(92)).join('/');

function walk(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.test.ts') ? [slash(p)] : [];
  });
}
const files = walk('tests').filter(
  (f) => f.startsWith('tests/platform/') || /src\/(input|platform)\//.test(readFileSync(f, 'utf8')),
);
const args = [
  'vitest', 'run', '--coverage', '--coverage.provider=v8', '--coverage.reporter=json',
  '--coverage.reporter=text-summary', '--coverage.reportsDirectory=.cache/coverage',
  ...FOLDERS.map((d) => `--coverage.include=${d}/**`),
  ...files,
];
const run = spawnSync('npx', args, { stdio: 'inherit', shell: true, env: { ...process.env, CI: 'true' } });
const cov = JSON.parse(readFileSync('.cache/coverage/coverage-final.json', 'utf8'));
const stat = Object.fromEntries(FOLDERS.map((d) => [d, { covered: 0, total: 0 }]));
for (const [path, c] of Object.entries(cov)) {
  const rel = slash(path);
  const dir = FOLDERS.find((d) => rel.includes(`/${d}/`));
  if (!dir) continue;
  const lines = new Map();
  for (const [id, loc] of Object.entries(c.statementMap)) {
    const l = loc.start.line;
    lines.set(l, (lines.get(l) ?? false) || c.s[id] > 0);
  }
  stat[dir].total += lines.size;
  stat[dir].covered += [...lines.values()].filter(Boolean).length;
}
let under = false;
for (const [d, s] of Object.entries(stat)) {
  const pct = s.total ? (100 * s.covered) / s.total : 0;
  console.log(`${d}: ${pct.toFixed(1)}% lines (${s.covered}/${s.total}), target ${TARGET}%`);
  if (pct < TARGET) under = true;
}
process.exit(run.status || (under ? 1 : 0));
