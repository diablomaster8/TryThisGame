import { describe, expect, it } from 'vitest';
import { GROVE, LANDMARKS, SIM } from '../../src/config/tuning';
import { blocked } from '../../src/sim/obstacles';
import { deserialize, serialize } from '../../src/sim/save';
import { createWorld } from '../../src/sim/world';

/** The 96-unit field: everything placed stays inside, apart, and reachable. */
describe('the bigger field', () => {
  it('is 96 units a side with the walkable half just inside it', () => {
    expect(GROVE.size).toBe(96);
    expect(SIM.worldHalf).toBeLessThan(GROVE.size / 2);
    expect(SIM.worldHalf).toBeGreaterThan(GROVE.size / 2 - 4);
  });

  it('keeps hills, trees, rocks, buildings and landmarks inside and clear of each other', () => {
    const half = GROVE.size / 2;
    for (const h of GROVE.hills) {
      expect(Math.abs(h.x) + h.r).toBeLessThan(half);
      expect(Math.abs(h.z) + h.r).toBeLessThan(half);
      for (const t of GROVE.trees)
        expect(Math.hypot(t.x - h.x, t.z - h.z)).toBeGreaterThan(h.r + 1);
      for (const b of Object.values(GROVE.buildings))
        expect(Math.hypot(b.x - h.x, b.z - h.z)).toBeGreaterThan(h.r + b.r);
    }
    for (const t of GROVE.trees) {
      expect(Math.abs(t.x)).toBeLessThan(SIM.worldHalf);
      expect(Math.abs(t.z)).toBeLessThan(SIM.worldHalf);
    }
    const outer = ['northWood', 'eastRidge', 'southMarsh', 'westMeadow', 'farOrchard'];
    for (const l of LANDMARKS) {
      expect(Math.abs(l.x)).toBeLessThan(SIM.worldHalf);
      expect(Math.abs(l.z)).toBeLessThan(SIM.worldHalf);
      // The new spots stand on open ground (the old ones sit at a building's door and
      // are pushed out on arrival).
      if (outer.includes(l.id)) expect(blocked({ x: l.x, z: l.z }, null, 0.3)).toBe(false);
    }
    expect(GROVE.hills.length).toBeGreaterThanOrEqual(10);
    expect(GROVE.trees.length).toBe(6);
  });

  it('gives an older save the new fruit trees', () => {
    const w = createWorld(3, 0);
    w.trees = w.trees.slice(0, 4);
    const back = deserialize(serialize(w, 0)).world;
    expect(back.trees).toHaveLength(GROVE.trees.length);
    expect(back.trees[4]?.pos).toEqual({ x: GROVE.trees[4]!.x, z: GROVE.trees[4]!.z });
  });
});
