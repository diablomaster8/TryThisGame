import { describe, expect, it } from 'vitest';
import { REGIONS, type RegionId } from '../../src/config/regions';
import { EDU_REGION_BOUNDS } from '../../src/config/tuning-r15d1';
import { createEdu } from '../../src/sim/edu';
import { holdInSlice, inSlice } from '../../src/sim/edu-region-bounds';
import { travel, travelBlock } from '../../src/sim/regions';
import { spotNear } from '../../src/sim/region-spots';
import { regionLocation, stepRegionWalk } from '../../src/sim/region-walk';
import { createWorld } from '../../src/sim/world';
import type { SimEvent, World } from '../../src/sim/types';

function eduWorld(region: RegionId, x: number, z: number): World {
  const w = createWorld(3, 0);
  w.edu = createEdu(4, 'sprout');
  w.location = region === 'grove' ? 'grove' : regionLocation(region);
  w.keeper.pos = { x, z };
  w.unlocks.sunGrove = true;
  w.unlocks.moonGrove = true;
  return w;
}

describe('R0099: the Learning Grove reaches a kid-safe slice of the shore and the Wood', () => {
  it('only the grove, the beach slice, the clearing slice and the lane can be reached', () => {
    const seen = new Set<RegionId>(['grove']);
    const queue: RegionId[] = ['grove'];
    while (queue.length) {
      const from = queue.shift()!;
      for (const e of REGIONS[from].exits) {
        const w = eduWorld(from, 0, 0);
        if (travelBlock(w, e.id) !== null || seen.has(e.to)) continue;
        // Arrival is inside the destination's slice, and the way out was inside this one's.
        expect(inSlice(e.to, e.arrive), e.id).toBe(true);
        seen.add(e.to);
        queue.push(e.to);
      }
    }
    expect([...seen].sort()).toEqual(['grove', 'lane', 'shore', 'wood']);
  });

  it('refuses every way out of a slice that stands outside it', () => {
    for (const region of Object.keys(EDU_REGION_BOUNDS) as RegionId[]) {
      for (const e of REGIONS[region].exits) {
        const w = eduWorld(region, 0, 0);
        const centre = { x: e.rect.x + e.rect.w / 2, z: e.rect.z + e.rect.h / 2 };
        if (!inSlice(region, centre))
          expect(['not-for-kids', 'locked'], e.id).toContain(travelBlock(w, e.id));
      }
    }
  });

  it('signposts from the Grove land inside the slice, and the way home works', () => {
    const w = createWorld(3, 0);
    w.edu = createEdu(4, 'sprout');
    const ev: SimEvent[] = [];
    for (const [id, region] of [
      ['grove-marsh', 'shore'],
      ['grove-wood', 'wood'],
    ] as const) {
      w.location = 'grove';
      expect(travel(w, id, ev), id).toBe(true);
      expect(w.location).toBe(regionLocation(region));
      expect(inSlice(region, w.keeper.pos), id).toBe(true);
      const back = REGIONS[region].exits.find((e) => e.to === 'grove')!;
      expect(travelBlock(w, back.id), id).toBeNull();
    }
  });

  it('the beach and the first clearing are inside their slices and on walkable ground', () => {
    const beach = REGIONS.shore.pois.find((p) => p.id === 'beach')!;
    const clearing = REGIONS.wood.pois.find((p) => p.id === 'clearing')!;
    expect(inSlice('shore', beach)).toBe(true);
    expect(inSlice('wood', clearing)).toBe(true);
    for (const [r, p] of [
      ['shore', beach],
      ['wood', clearing],
    ] as const) {
      const s = spotNear(r, p.x, p.z)!;
      expect(Math.hypot(s.x - p.x, s.z - p.z), r).toBeLessThan(4);
      expect(inSlice(r, s), r).toBe(true);
    }
  });

  for (const [region, x, z] of [
    ['shore', -30, -2],
    ['wood', -6, 30],
  ] as const) {
    it(`${region}: held in by the stick and by a far walk target, never in an adult game`, () => {
      const b = EDU_REGION_BOUNDS[region]!;
      for (const dir of [
        { x: 1, z: 0 },
        { x: -1, z: 0 },
        { x: 0, z: 1 },
        { x: 0, z: -1 },
      ]) {
        const w = eduWorld(region, x, z);
        w.keeper.input = { ...dir };
        for (let i = 0; i < 900; i++) stepRegionWalk(w, 100, []);
        expect(inSlice(region, w.keeper.pos), `${region} ${dir.x},${dir.z}`).toBe(true);
        expect(w.keeper.pos.x).toBeGreaterThanOrEqual(b.minX);
        expect(w.keeper.pos.x).toBeLessThanOrEqual(b.maxX);
        expect(w.keeper.pos.z).toBeGreaterThanOrEqual(b.minZ);
        expect(w.keeper.pos.z).toBeLessThanOrEqual(b.maxZ);
      }
      const t = eduWorld(region, x, z);
      t.keeper.moveTarget = { x: 500, z: 500 };
      holdInSlice(t, region);
      expect(inSlice(region, t.keeper.moveTarget!)).toBe(true);
    });
  }
});
