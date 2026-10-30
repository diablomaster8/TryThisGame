import { describe, expect, it } from 'vitest';
import {
  createRun,
  jumpPressed,
  jumpReleased,
  stepRun,
  superlative,
} from '../../src/minigames/expedition/run';

// R0324 (FUN-35): every Expedition results card has a superlative; a hit says what it cost.

describe('Expedition comedy', () => {
  it('every run, idle or busy, gets a superlative', () => {
    for (const seed of [1, 2, 3, 77]) {
      for (const jumpy of [false, true]) {
        const run = createRun(seed);
        let hit = false;
        for (let t = 0; !run.finished; t += 25) {
          if (jumpy && t % 900 === 0) jumpPressed(run);
          if (jumpy && t % 900 === 300) jumpReleased(run);
          stepRun(run, 25);
          if (run.lastEvent?.kind === 'hit') {
            hit = true;
            expect(run.lastEvent.thing).toBeDefined();
            expect(run.lastEvent.dropped).toBeGreaterThanOrEqual(0);
          }
        }
        const s = superlative(run);
        expect(s.length).toBeGreaterThan(10);
        expect(hit || run.hits === 0).toBe(true);
      }
    }
  });
});
