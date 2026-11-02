import { describe, expect, it } from 'vitest';
import { REGION_ORDER, REGIONS } from '../../src/config/regions';
import {
  BEACON_LANDMARKS,
  BEACON_MIN_HEIGHT_MUL,
  BUILD_PLOTS,
  PHOTO_SPOTS,
} from '../../src/config/region-extras-r11d6';
import { DECOR_KINDS } from '../../src/sim/decorate';
import { blocked } from '../../src/sim/obstacles';
import { createWorld } from '../../src/sim/world';

describe('per-region beacon, photo spot and plot tables', () => {
  const ids = REGION_ORDER.filter((r) => r !== 'little-grove');
  it('has a row for every region, with beacons at least 3x tall', () => {
    for (const id of ids) {
      expect(BEACON_LANDMARKS[id as keyof typeof BEACON_LANDMARKS], id).toBeDefined();
      expect(
        BEACON_LANDMARKS[id as keyof typeof BEACON_LANDMARKS].heightMul,
      ).toBeGreaterThanOrEqual(BEACON_MIN_HEIGHT_MUL);
      expect(PHOTO_SPOTS[id as keyof typeof PHOTO_SPOTS].frames).toBe(id);
      const plot = BUILD_PLOTS[id as keyof typeof BUILD_PLOTS];
      for (const k of plot.accepts) expect(DECOR_KINDS).toContain(k);
    }
  });
  it('places the Grove photo spot on open ground inside the region, within sight of the windmill', () => {
    const at = PHOTO_SPOTS.grove.at!;
    const w = createWorld(1, 0);
    expect(blocked({ x: at.x, z: at.z }, w, 0.4)).toBe(false);
    expect(Math.abs(at.x)).toBeLessThan(REGIONS.grove.size.w / 2);
    const b = BEACON_LANDMARKS.grove.at!;
    expect(Math.hypot(b.x - at.x, b.z - at.z)).toBeLessThan(30);
  });
});

describe('photo spots (R0138)', () => {
  it('speaks once per visit, and notes the first time only', async () => {
    const { stepPhotoSpots } = await import('../../src/sim/photo-spots');
    const w = createWorld(1, 0);
    const at = PHOTO_SPOTS.grove.at!;
    const ev: import('../../src/sim/types').SimEvent[] = [];
    w.keeper.pos.x = at.x;
    w.keeper.pos.z = at.z;
    stepPhotoSpots(w, ev);
    stepPhotoSpots(w, ev);
    expect(ev).toEqual([{ kind: 'photoSpot', region: 'grove', first: true }]);
    w.keeper.pos.x = at.x + 10;
    stepPhotoSpots(w, ev);
    w.keeper.pos.x = at.x;
    stepPhotoSpots(w, ev);
    expect(ev[1]).toEqual({ kind: 'photoSpot', region: 'grove', first: false });
  });
});
