/**
 * Rough wall-clock seconds of the heavy test files on a CI runner (measured 2026-11-06 with
 * `tests/tools/slow-report.cjs`), used by `shard-sequencer.ts` to balance `--shard`. Anything
 * not listed counts as DEFAULT_WEIGHT. Only the order of magnitude matters; refresh it from a
 * slow-report run when a file gets much slower or faster.
 */
export const DEFAULT_WEIGHT = 1;

export const SHARD_WEIGHTS: Readonly<Record<string, number>> = {
  'tests/sim/side-stories-early.test.ts': 50,
  'tests/sim/campaign-v2.test.ts': 38,
  'tests/sim/lifecycle.test.ts': 38,
  'tests/sim/reachability.test.ts': 35,
  'tests/sim/campaign.test.ts': 35,
  'tests/sim/battle-story-replay.test.ts': 33,
  'tests/sim/side-stories-mid.test.ts': 31,
  'tests/sim/side-stories-late.test.ts': 31,
  'tests/sim/dungeon-r10-b1.test.ts': 18,
  'tests/sim/dungeon-r7.test.ts': 14,
  'tests/sim/dungeon-uniques.test.ts': 13,
  'tests/sim/quest-offers.test.ts': 12,
  'tests/sim/soul-bonds.test.ts': 13,
  'tests/sim/dungeon-r10-b4.test.ts': 12,
  'tests/sim/expansion-offers-r12.test.ts': 11,
  'tests/sim/dungeon-v3.test.ts': 11,
  'tests/sim/soul-swim.test.ts': 11,
  'tests/sim/quest-lanes-r9.test.ts': 10,
  'tests/sim/pace-bot-r12.test.ts': 10,
};
