import { describe, expect, it } from 'vitest';
import { REGIONS } from '../../src/config/regions';
import { travelBlock } from '../../src/sim/regions';
import { createEdu } from '../../src/sim/edu';
import { createWorld } from '../../src/sim/world';

// R0099: with the Learning Grove on, only kid-safe places can be travelled to.
describe('Learning Grove travel (R0099)', () => {
  it('refuses every way that leads to a place that is not kid-safe', () => {
    const w = createWorld(1, 0);
    const off = REGIONS.grove.exits.map((e) => travelBlock(w, e.id));
    w.edu = createEdu(4, 'sprout');
    for (const e of REGIONS.grove.exits) {
      const r = travelBlock(w, e.id);
      if (!REGIONS[e.to].built) continue;
      if (REGIONS[e.to].kidsSafe) expect(r).not.toBe('not-for-kids');
      else expect(r === null ? off : r, e.id).not.toBeNull();
      if (!REGIONS[e.to].kidsSafe)
        expect(['not-for-kids', 'use-entrance', 'locked'].includes(r ?? ''), e.id).toBe(true);
    }
  });
});
