import { describe, expect, it } from 'vitest';
import { GROVE3D } from '../../src/config/tuning';
import { clearShot, HillClear, lineClear } from '../../src/render3d/hill-clear';
import { groveHeight } from '../../src/render3d/terrain-shape';
import { TERRACES } from '../../src/sim/terrain';

// MOVE-52: the 3D orbit camera never looks at the Keeper through a hill.

const PITCH = (GROVE3D.pitchDeg * Math.PI) / 180;

/** Keeper spots round hill 1 and up its tiers: rings at the foot, the mid-slope and the top. */
function spots(): Array<{ x: number; y: number; z: number }> {
  const h = TERRACES[1]!;
  const out: Array<{ x: number; y: number; z: number }> = [];
  for (const r of [0.3, h.r * 0.5, h.r * 0.9, h.reach + 0.6])
    for (let a = 0; a < 16; a++) {
      const x = h.x + Math.sin((a / 16) * Math.PI * 2) * r;
      const z = h.z + Math.cos((a / 16) * Math.PI * 2) * r;
      out.push({ x, y: groveHeight(x, z) + GROVE3D.lookHeight, z });
    }
  return out;
}

describe('the 3D camera round the hills (MOVE-52)', () => {
  it('round hill 1 at every yaw and both zooms, the line to the Keeper ends up clear', () => {
    let blocked = 0;
    let frames = 0;
    for (const t of spots())
      for (let y = 0; y < 8; y++)
        for (const dist of GROVE3D.distance) {
          const yaw = (y * Math.PI) / 4;
          frames++;
          if (!lineClear(t, yaw, PITCH, dist, groveHeight)) blocked++;
          const c = clearShot(t, yaw, PITCH, dist, groveHeight);
          expect(lineClear(t, yaw, PITCH + c.lift, dist * c.k, groveHeight)).toBe(true);
        }
    // The sweep did meet hills: some plain orbits were blocked.
    expect(frames).toBe(64 * 16);
    expect(blocked).toBeGreaterThan(0);
  });

  it('eases in fast and back over half a second, and does nothing on open ground', () => {
    const h = TERRACES[1]!;
    const g = (x: number, z: number): number =>
      Math.hypot(x - h.x, z - h.z) < 4 ? 50 : groveHeight(x, z);
    const c = new HillClear();
    const t = { x: h.x, y: groveHeight(h.x, h.z) + 1, z: h.z - 5 };
    // A wall of ground behind: pulled all the way in within a quarter second.
    for (let i = 0; i < 15; i++) c.update(t, 0, PITCH, 15, g, 1 / 60, true);
    expect(c.lift).toBeGreaterThan(0.2);
    // Not active (a staged shot): back to the plain orbit in 0.5 s.
    for (let i = 0; i < 31; i++) c.update(t, 0, PITCH, 15, g, 1 / 60, false);
    expect(c.lift).toBe(0);
    expect(c.k).toBe(1);
    const open = { x: 0, y: groveHeight(0, -30) + 1.1, z: -30 };
    const d = new HillClear();
    d.update(open, Math.PI, PITCH, 15, () => -5, 1 / 60, true);
    expect(d.lift).toBe(0);
  });
});
