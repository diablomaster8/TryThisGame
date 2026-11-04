import { describe, expect, it } from 'vitest';
import { photoSpotAt, standingInPhotoSpot, stepPhotoSpots } from '../../src/sim/photo-spots';
import { plotAt, regionMarks } from '../../src/sim/region-marks';
import { stepCollectibles } from '../../src/sim/collectibles';
import { fits } from '../../src/sim/region-spots';
import { layoutOf, REGION_SPECS, regionLocation } from '../../src/sim/region-walk';
import { createWorld } from '../../src/sim/world';
import type { RegionId } from '../../src/config/regions';
import type { SimEvent } from '../../src/sim/types';

const DRAWN = Object.keys(REGION_SPECS) as RegionId[];

describe('region marks and photo frames (R12 d2)', () => {
  it('every drawn region has a photo frame and an 8 x 8 plot on open ground', () => {
    for (const r of DRAWN) {
      const l = layoutOf(r)!;
      const p = photoSpotAt(r);
      expect(p, `${r} photo`).not.toBeNull();
      expect(fits(l, p!.x, p!.z), `${r} photo fits`).toBe(true);
      const plot = plotAt(r);
      expect(plot, `${r} plot`).not.toBeNull();
      for (const dx of [-4, 0, 4])
        for (const dz of [-4, 0, 4])
          expect(fits(l, plot!.x + dx, plot!.z + dz), `${r} plot ${dx},${dz}`).toBe(true);
    }
  });

  it('standing in a frame says so once per visit and keeps the first look', () => {
    const w = createWorld(3, 0);
    w.location = regionLocation('shore');
    const p = photoSpotAt('shore')!;
    w.keeper.pos.x = p.x;
    w.keeper.pos.z = p.z;
    expect(standingInPhotoSpot(w)).toBe(true);
    const ev: SimEvent[] = [];
    stepPhotoSpots(w, ev);
    stepPhotoSpots(w, ev);
    expect(ev.filter((e) => e.kind === 'photoSpot')).toHaveLength(1);
    expect(w.collected?.['photo:shore']).toBeDefined();
    w.keeper.pos.x = p.x + 10;
    stepPhotoSpots(w, ev);
    w.keeper.pos.x = p.x;
    stepPhotoSpots(w, ev);
    const spots = ev.filter((e) => e.kind === 'photoSpot') as Array<{ first: boolean }>;
    expect(spots.map((e) => e.first)).toEqual([true, false]);
  });

  it('the mark list drops a collectible once it is taken, and is empty in the Grove', () => {
    const w = createWorld(3, 0);
    expect(regionMarks(w)).toHaveLength(0);
    w.location = regionLocation('wood');
    const before = regionMarks(w);
    expect(regionMarks(w)).toBe(before);
    const petal = before.find((m) => m.kind === 'petal')!;
    w.keeper.pos.x = petal.x;
    w.keeper.pos.z = petal.z;
    stepCollectibles(w, []);
    const after = regionMarks(w);
    expect(after.some((m) => m.id === petal.id)).toBe(false);
    expect(after.length).toBe(before.length - 1);
  });
});
