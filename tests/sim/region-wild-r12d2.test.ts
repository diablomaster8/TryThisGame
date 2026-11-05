import { describe, expect, it } from 'vitest';
import { CRITTER_RULES, REGION_CRITTERS } from '../../src/config/region-wild';
import { liveCritters, spotsOf, spotSpecies } from '../../src/sim/region-critters';
import { fits } from '../../src/sim/region-spots';
import {
  befriended,
  stepWildNubbin,
  wildIdentity,
  wildNubbinHere,
} from '../../src/sim/region-wild-nubbin';
import { layoutOf, REGION_SPECS, regionLocation } from '../../src/sim/region-walk';
import { createWorld } from '../../src/sim/world';
import type { RegionId } from '../../src/config/regions';
import type { SimEvent } from '../../src/sim/types';

const DRAWN = Object.keys(REGION_SPECS) as RegionId[];

describe('critter tables and the wild Nubbin of every drawn region (R12 d2)', () => {
  it('each region holds only its own table species, on open ground, never more than six live', () => {
    for (const r of DRAWN) {
      const t = REGION_CRITTERS[r]!;
      expect(t, r).toBeDefined();
      expect(t.species).toHaveLength(3);
      const l = layoutOf(r)!;
      const spots = spotsOf(r);
      expect(spots.length, r).toBeGreaterThanOrEqual(4);
      for (const s of spots) {
        if (r !== 'wood') expect(fits(l, s.x, s.z), `${r} ${s.id}`).toBe(true);
        for (let seed = 1; seed < 10; seed++)
          for (let takes = 0; takes < 4; takes++)
            expect(t.species).toContain(spotSpecies(seed, r, s, takes));
      }
      const w = createWorld(5, 0);
      w.location = regionLocation(r);
      expect(liveCritters(w).length).toBeLessThanOrEqual(CRITTER_RULES.maxLive);
    }
  });

  it('each region has one named wild Nubbin, the same for the same save, of its favourite types', () => {
    for (const r of DRAWN) {
      const a = wildIdentity(11, r);
      expect(a, r).not.toBeNull();
      expect(wildIdentity(11, r)).toEqual(a);
      const w = createWorld(11, 0);
      w.location = regionLocation(r);
      const n = wildNubbinHere(w)!;
      expect(n.species).toBe(a!.species);
    }
  });

  it('a fruit and a moment make it a recruit, once; without fruit it only watches', () => {
    const w = createWorld(11, 0);
    w.location = regionLocation('shore');
    const n = wildNubbinHere(w)!;
    w.keeper.pos.x = n.x;
    w.keeper.pos.z = n.z;
    w.inventory.fruit = 0;
    const ev: SimEvent[] = [];
    for (let i = 0; i < 60; i++) stepWildNubbin(w, 100, ev);
    expect(ev.filter((e) => e.kind === 'wildNubbin')).toHaveLength(1);
    expect(befriended(w, 'shore')).toBe(false);
    w.inventory.fruit = 2;
    for (let i = 0; i < 60; i++) {
      const at = wildNubbinHere(w);
      if (at) {
        w.keeper.pos.x = at.x;
        w.keeper.pos.z = at.z;
      }
      stepWildNubbin(w, 100, ev);
    }
    expect(befriended(w, 'shore')).toBe(true);
    expect(w.inventory.fruit).toBe(1);
    expect(w.town.recruits.some((r) => r.name === wildIdentity(11, 'shore')!.name)).toBe(true);
    expect(wildNubbinHere(w)).toBeNull();
    const before = w.town.recruits.length;
    for (let i = 0; i < 30; i++) stepWildNubbin(w, 100, ev);
    expect(w.town.recruits.length).toBe(before);
  });
});
