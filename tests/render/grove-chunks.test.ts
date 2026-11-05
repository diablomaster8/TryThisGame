import { describe, expect, it } from 'vitest';
import { ChunkMask, SpriteCuller } from '../../src/render/chunks';

/** WORLD-09 (R12 lane D): the Grove's static sprites skip whole chunks off screen. */
function culler(x: number, z: number, w = 20, h = 30): SpriteCuller {
  const c = new SpriteCuller();
  c.update({
    target: { x, y: 0, z },
    currentYaw: 0,
    pitch: (35 * Math.PI) / 180,
    visibleWidth: w,
    visibleHeight: h,
  });
  return c;
}

describe('ChunkMask', () => {
  const items = [
    { x: 0, z: 0 },
    { x: 40, z: 40 },
    { x: -40, z: -40 },
    { x: 2, z: 3 },
  ];

  it('keeps every chunk without a culler', () => {
    const m = new ChunkMask(items, 1, 2);
    m.update(null);
    expect([0, 1, 2, 3].every((i) => m.has(i))).toBe(true);
    expect(m.chunks).toBe(3);
  });

  it('skips chunks far off screen and keeps the ones in view', () => {
    const m = new ChunkMask(items, 1, 2);
    m.update(culler(0, 0));
    expect(m.has(0)).toBe(true);
    expect(m.has(3)).toBe(true);
    expect(m.has(1)).toBe(false);
    expect(m.has(2)).toBe(false);
    expect(m.skipped).toBe(2);
  });

  it('never drops a sprite the per-sprite culler would draw', () => {
    const pts: Array<{ x: number; z: number }> = [];
    for (let x = -46; x <= 46; x += 3) for (let z = -46; z <= 46; z += 3) pts.push({ x, z });
    const m = new ChunkMask(pts, 1, 2);
    for (const [cx, cz] of [
      [0, 0],
      [30, -20],
      [-44, 44],
    ] as const) {
      const c = culler(cx, cz);
      m.update(c);
      pts.forEach((p, i) => {
        const draw = { x: p.x, y: 0, z: p.z, mode: 'billboard' } as never;
        if (c.visible(draw, 1, 2)) expect(m.has(i)).toBe(true);
      });
    }
  });
});
