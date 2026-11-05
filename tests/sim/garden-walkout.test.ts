import { describe, expect, it } from 'vitest';
import { LANE_GATES } from '../../src/config/region-lane';
import { GARDEN_WALKOUT } from '../../src/config/tuning-r13d1';
import { SIM } from '../../src/config/tuning';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

/** R13 lane D (WORLD-33): walking out of a garden onto the lane. */
describe('walking out of a neighbour garden', () => {
  it('puts the Keeper back on the lane by that gate', () => {
    const w = createWorld(5, 0);
    applyCommand(w, { kind: 'travel', exit: 'grove-gate' }, []);
    const g = LANE_GATES[1]!;
    applyCommand(w, { kind: 'travel', exit: `lane-${g.id}` }, []);
    expect(w.location).toBe(`visit:${g.id}`);
    w.keeper.pos = { ...GARDEN_WALKOUT.gate };
    stepWorld(w, SIM.stepMs);
    expect(w.location).toBe('region:lane');
    expect(Math.abs(w.keeper.pos.x - g.x)).toBeLessThan(4);
    expect(w.keeper.pos.z).toBeCloseTo(g.z);
  });
});
