import { describe, expect, it } from 'vitest';
import { AMBIENT_LIFE } from '../../src/config/tuning-more/world-region-sky';
import {
  ambientAwake,
  ambientFor,
  ambientPos,
  STRIDE,
  type AmbientPose,
} from '../../src/render/ambient-life';

const count = (region: string, phone: boolean): number => {
  let n = 0;
  const R = AMBIENT_LIFE.rings;
  for (let dz = -R; dz <= R; dz++)
    for (let dx = -R; dx <= R; dx++) n += ambientFor(region, dx, dz, phone).length / STRIDE;
  return n;
};

describe('ambient life per chunk (R0128)', () => {
  it('stays within 60 sprites round the Keeper, and half on a phone', () => {
    expect(count('grove', false)).toBeLessThanOrEqual(60);
    expect(count('wood', false)).toBeLessThanOrEqual(60);
    expect(count('grove', true)).toBeLessThanOrEqual(count('grove', false) / 2 + 3);
  });

  it('is the same on every call and only exists where a region lists it', () => {
    expect(Array.from(ambientFor('wood', 2, -1, false))).toEqual(
      Array.from(ambientFor('wood', 2, -1, false)),
    );
    expect(count('nowhere', false)).toBe(0);
  });

  it('fish live only over the Grove pond; the Wood has none', () => {
    const kinds = (r: string) => {
      const out = new Set<number>();
      for (let cx = -3; cx < 3; cx++)
        for (let cz = -3; cz < 3; cz++) {
          const a = ambientFor(r, cx, cz, false);
          for (let i = 0; i < a.length / STRIDE; i++) out.add(a[i * STRIDE]!);
        }
      return out;
    };
    expect(kinds('grove').has(2)).toBe(true);
    expect(kinds('wood').has(2)).toBe(false);
  });

  it('moves by the clock and holds still under reduced motion; wakes by day in the dry only', () => {
    const rec = ambientFor('grove', 0, 0, false);
    const a: AmbientPose = { x: 0, y: 0, z: 0, yaw: 0, frame: 0, open: 0 };
    const b: AmbientPose = { ...a };
    ambientPos(rec, 0, 1, false, a);
    ambientPos(rec, 0, 9, false, b);
    expect(a.x === b.x && a.z === b.z).toBe(false);
    ambientPos(rec, 0, 1, true, a);
    ambientPos(rec, 0, 9, true, b);
    expect(a).toEqual(b);
    expect(ambientAwake('day', 'clear')).toBe(true);
    expect(ambientAwake('night', 'clear')).toBe(false);
    expect(ambientAwake('day', 'rain')).toBe(false);
  });
});
