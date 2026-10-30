import { describe, expect, it } from 'vitest';
import { generateV3, v3OptionsFor } from '../../src/sim/dungeon-gen-v3';
import { platformFloor } from '../../src/sim/dungeon-gaps';
import { fillRooms } from '../../src/sim/dungeon-rooms';

// R0205 (DUNG-60): the Deep Hollow's floor 99 should generate in about 25 ms on Maor's PC
// (about 13 ms warm in plain Node on 2026-10-30, down from about 19). Timing inside a busy
// parallel test run is noisy and the CI runner is about 1.7× slower, so this warms up, takes
// the fastest of three tries per seed (the same steps `floorOf` runs, without its cache) and
// checks the average against a generous budget. For a fair number run it alone:
// `npx vitest run tests/sim/dungeon-r8-deep-perf.test.ts`.
function floor99(seed: number): void {
  fillRooms(platformFloor(generateV3(seed, 99, v3OptionsFor(99)), seed, 99), seed, 99, null);
}

describe('Deep Hollow generation time (R0205)', () => {
  it('floor 99 generates well inside the budget', () => {
    for (let s = 0; s < 4; s++) floor99(9_000 + s * 7919);
    const seeds = 8;
    let total = 0;
    for (let s = 0; s < seeds; s++) {
      let best = Infinity;
      for (let k = 0; k < 3; k++) {
        const t0 = performance.now();
        floor99(20_000 + s * 104_729);
        best = Math.min(best, performance.now() - t0);
      }
      total += best;
    }
    const each = total / seeds;
    console.info(`floor 99: ${each.toFixed(1)} ms a floor`);
    expect(each).toBeLessThan(100);
  }, 60_000);
});
