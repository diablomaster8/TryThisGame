import { describe, expect, it } from 'vitest';
import {
  loopLength,
  WOOD_JUMPS,
  WOOD_PATH,
  WOOD_POIS,
  WOOD_STREAM,
} from '../../src/config/region-wood';
import { REGIONS } from '../../src/config/regions';
import { WORLD_WALK } from '../../src/config/tuning-world';
import { checkJumpRoute } from '../../src/sim/regions-jump';

/** Distance from a point to the closed loop. */
function toPath(x: number, z: number): number {
  let best = Infinity;
  for (let i = 0; i < WOOD_PATH.length; i++) {
    const a = WOOD_PATH[i]!;
    const b = WOOD_PATH[(i + 1) % WOOD_PATH.length]!;
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / (dx * dx + dz * dz)));
    best = Math.min(best, Math.hypot(a.x + dx * t - x, a.z + dz * t - z));
  }
  return best;
}

describe('the Wood layout (WORLD-25)', () => {
  const wood = REGIONS.wood;
  const half = wood.size.w / 2;

  it('loops about 260 units, some 80 seconds at a walk, inside the region', () => {
    const len = loopLength(WOOD_PATH);
    expect(len).toBeGreaterThan(220);
    expect(len).toBeLessThan(300);
    expect(len / WORLD_WALK.speed).toBeGreaterThan(65);
    for (const p of [...WOOD_PATH, ...WOOD_STREAM.slice(1, -1)]) {
      expect(Math.abs(p.x)).toBeLessThanOrEqual(half);
      expect(Math.abs(p.z)).toBeLessThanOrEqual(half);
    }
  });

  it('puts every clearing and the mill on the path, and the Grove gate at its foot', () => {
    expect(wood.pois).toBe(WOOD_POIS);
    for (const p of WOOD_POIS.filter((q) => q.tier === 'major'))
      expect(toPath(p.x, p.z)).toBeLessThan(6);
    const gate = wood.exits.find((e) => e.to === 'grove')!;
    const into = REGIONS.grove.exits.find((e) => e.to === 'wood')!;
    expect(Math.hypot(into.arrive.x, into.arrive.z - 50)).toBeLessThan(4);
    expect(toPath(gate.rect.x + 2, gate.rect.z + 2 - 8)).toBeLessThan(6);
  });

  it('has four jump routes, each within the jump and with a way round', () => {
    expect(new Set(WOOD_JUMPS.map((j) => j.kind))).toEqual(
      new Set(['stones', 'ledge', 'double', 'glide']),
    );
    for (const j of WOOD_JUMPS) expect(checkJumpRoute('wood', j)).toEqual([]);
  });
});
