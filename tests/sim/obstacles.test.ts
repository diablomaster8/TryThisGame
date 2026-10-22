import { describe, expect, it } from 'vitest';
import { GROVE, LANTERN_POSTS, SIM } from '../../src/config/tuning';
import { blocked, obstacles, resolve } from '../../src/sim/obstacles';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

describe('obstacles', () => {
  it('lists hills, trees, buildings, rocks and lantern posts, plus placed buildings', () => {
    const world = createWorld(1, 0);
    const base = obstacles(world).length;
    expect(base).toBe(
      GROVE.hills.length +
        GROVE.trees.length +
        Object.keys(GROVE.buildings).length +
        GROVE.rocks.length +
        LANTERN_POSTS.length,
    );
    world.placed.push({ id: 'd1', kind: 'workshop', pos: { x: 0, z: 0 } });
    expect(obstacles(world).length).toBe(base + 1);
  });

  it('pushes a point out of a hill along the edge', () => {
    const h = GROVE.hills[0]!;
    const p = { x: h.x + 1, z: h.z };
    expect(blocked(p, null)).toBe(true);
    expect(resolve(p, null)).toBe(true);
    expect(Math.hypot(p.x - h.x, p.z - h.z)).toBeGreaterThanOrEqual(h.r + 0.25);
    expect(resolve(p, null)).toBe(false);
  });

  it('keeps the Keeper off a hill when walking straight at it', () => {
    const world = createWorld(1, 0);
    const h = GROVE.hills[1]!;
    world.keeper.pos = { x: h.x - h.r - 3, z: h.z };
    applyCommand(world, { kind: 'keeperInput', input: { x: 1, z: 0 } }, []);
    for (let i = 0; i < 100; i++) stepWorld(world, SIM.stepMs);
    expect(Math.hypot(world.keeper.pos.x - h.x, world.keeper.pos.z - h.z)).toBeGreaterThanOrEqual(
      h.r,
    );
  });

  it('drops a tap target that sits inside a building', () => {
    const world = createWorld(1, 0);
    const b = GROVE.buildings.dojo;
    world.keeper.pos = { x: b.x - 8, z: b.z };
    applyCommand(world, { kind: 'moveKeeperTo', pos: { x: b.x, z: b.z } }, []);
    for (let i = 0; i < 200; i++) stepWorld(world, SIM.stepMs);
    expect(world.keeper.moveTarget).toBeNull();
    expect(
      Math.hypot(world.keeper.pos.x - b.x, world.keeper.pos.z - (b.z + 0.4)),
    ).toBeGreaterThanOrEqual(b.r);
  });
});
