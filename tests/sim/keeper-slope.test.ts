// MOVE-41: walking up a terrace ramp is slower than the flat (about 0.8×), down it a little
// quicker, and the flat plain is untouched.
import { describe, expect, it } from 'vitest';
import { KEEPER_SLOPE } from '../../src/config/tuning-move';
import { slopePace } from '../../src/sim/keeper';
import { rampPath, TERRACES } from '../../src/sim/terrain';

/** The mean pace along a hill's ramp line, going up (or down when `down`). */
function rampPace(i: number, down = false): number {
  const t = TERRACES[i]!;
  const p = rampPath(t, 0.4).slice(0, -1);
  if (down) p.reverse();
  let sum = 0;
  let len = 0;
  for (let k = 0; k + 1 < p.length; k++) {
    const [ax, az] = p[k]!;
    const [bx, bz] = p[k + 1]!;
    const l = Math.hypot(bx - ax, bz - az);
    // Time-weighted: a slow stretch counts for longer, as a walk would feel it.
    sum += l / slopePace(t.x + ax, t.z + az, (bx - ax) / l, (bz - az) / l);
    len += l;
  }
  return len / sum;
}

describe('slopes (MOVE-41)', () => {
  it('climbs a terrace ramp at about 0.8x the flat pace', () => {
    for (let i = 0; i < TERRACES.length; i++) {
      const up = rampPace(i);
      expect(up).toBeGreaterThan(0.7);
      expect(up).toBeLessThan(0.9);
      expect(rampPace(i, true)).toBeGreaterThan(1);
    }
  });

  it('keeps the flat pace on the plain and stays in its clamp', () => {
    expect(slopePace(0, -20, 1, 0)).toBe(1);
    for (const t of TERRACES)
      for (let a = 0; a < 16; a++) {
        const dx = Math.cos(a);
        const dz = Math.sin(a);
        const f = slopePace(t.x + dx * t.reach * 0.6, t.z + dz * t.reach * 0.6, dx, dz);
        expect(f).toBeGreaterThanOrEqual(KEEPER_SLOPE.min);
        expect(f).toBeLessThanOrEqual(KEEPER_SLOPE.max);
      }
  });
});
