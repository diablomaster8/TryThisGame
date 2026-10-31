/**
 * The Champion's full balance run (recs FIGHT-81): 2,000 seeded bouts at Champion level with
 * the same checks as `tests/sim/battle-balance.test.ts`, which only has time for 30 inside its
 * 3 s budget. About 20 ms a bout, so about a minute. Exits 1 when a check fails.
 *
 *   npx tsx tests/tools/battle-balance-champion.ts [bouts]
 */
import { championProblems, median, rates, run } from '../sim/battle-balance-harness';

const n = Number(process.argv[2] ?? 2000) || 2000;
const t0 = performance.now();
const t = run('champion', n);
const secs = ((performance.now() - t0) / 1000).toFixed(1);
const top = Object.entries(t.picks)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .map(([id, k]) => `${id} ${((100 * k) / t.pickCount).toFixed(1)}%`);
const types = Object.entries(rates(t))
  .map(([k, v]) => `${k} ${v.toFixed(3)}`)
  .join(', ');
console.log(`${n} Champion bouts in ${secs} s`);
console.log(`median ${median(t.turns)} turns, longest ${t.turns.at(-1)}`);
console.log(`top picks: ${top.join(', ')}`);
console.log(`type scores: ${types}`);
// Over 2,000 bouts the type loop is checked too (30 bouts are too few for it).
const problems = [
  ...championProblems(t),
  ...Object.entries(rates(t))
    .filter(([, v]) => v < 0.45 || v > 0.55)
    .map(([k, v]) => `${k} scores ${v.toFixed(3)}`),
];
console.log(problems.length ? `problems:\n  ${problems.join('\n  ')}` : 'problems: 0');
process.exitCode = problems.length ? 1 : 0;
