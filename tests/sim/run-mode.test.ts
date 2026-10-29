// MOVE-42: with Auto-run on (a phone's default), a tap walk over ten units runs by itself;
// a short one walks. With it off, both walk.
import { describe, expect, it } from 'vitest';
import { SIM } from '../../src/config/tuning';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

/** Steps to cover the first `d` units of a tap walk east from an open spot. */
function stepsFor(autoRun: boolean, tap: number, d: number): number {
  const w = createWorld(3, 0);
  w.nubbins = [];
  w.settings.autoRun = autoRun;
  w.keeper.pos = { x: -10, z: -26 };
  applyCommand(w, { kind: 'moveKeeperTo', pos: { x: -10 + tap, z: -26 } }, []);
  for (let i = 1; i < 2000; i++) {
    stepWorld(w, SIM.stepMs);
    if (w.keeper.pos.x >= -10 + d) return i;
  }
  return Infinity;
}

describe('run mode (MOVE-42)', () => {
  it('runs a 20 u tap with Auto-run on, walks it with Auto-run off', () => {
    const run = stepsFor(true, 20, 8);
    const walk = stepsFor(false, 20, 8);
    expect(walk).toBeLessThan(Infinity);
    expect(run).toBeLessThan(walk * 0.85);
  });

  it('walks a short tap even with Auto-run on', () => {
    expect(stepsFor(true, 6, 4)).toBe(stepsFor(false, 6, 4));
  });
});
