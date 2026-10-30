import { describe, expect, it } from 'vitest';
import { SIM } from '../../src/config/tuning';
import { surfacePace } from '../../src/sim/surface-pace';
import type { Vec2, World } from '../../src/sim/types';
import { createWorld, stepWorld } from '../../src/sim/world';

/**
 * R0119 (WORLD-52): paths are quicker than grass. The Grove's longest straight stretch of path
 * is about 25 u (north from -1.5, -15.5), with a dip by z -7, so the walk is 14 u of each,
 * both flat, from z -4.5.
 */
function walk(from: Vec2, dir: Vec2, len: number): number {
  const world: World = createWorld(3, 0);
  stepWorld(world, SIM.stepMs);
  world.keeper.pos = { ...from };
  world.keeper.input = { ...dir };
  let t = 0;
  const gone = () => Math.hypot(world.keeper.pos.x - from.x, world.keeper.pos.z - from.z);
  while (gone() < len && t < 60_000) {
    stepWorld(world, SIM.stepMs);
    t += SIM.stepMs;
  }
  return t;
}

describe('surface pace (R0119)', () => {
  it('reads the ground under the Keeper', () => {
    const world = createWorld(3, 0);
    expect(surfacePace(world, -1.5, -10)).toBeCloseTo(1.15);
    expect(surfacePace(world, -30, -25)).toBe(1);
  });

  it('walking 14 u on the path and on grass differ by 13–17% in time', () => {
    const path = walk({ x: -1.5, z: -4.5 }, { x: 0, z: 1 }, 14);
    const grass = walk({ x: -36, z: -25 }, { x: 1, z: 0 }, 14);
    // Grass takes longer by the path's 15% (less a little for the shared start-up).
    const longer = grass / path - 1;
    expect(longer).toBeGreaterThanOrEqual(0.13);
    expect(longer).toBeLessThanOrEqual(0.17);
  });
});
