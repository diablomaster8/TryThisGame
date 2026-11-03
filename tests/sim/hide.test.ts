import { describe, expect, it } from 'vitest';
import { HIDE } from '../../src/config/tuning-fun';
import { hideAct, hideSpot, hiderFound } from '../../src/sim/hide';
import { createEgg } from '../../src/sim/nubbin';
import { obstacles } from '../../src/sim/obstacles';
import { Rng } from '../../src/sim/rng';
import { stepWorld, createWorld } from '../../src/sim/world';
import type { Nubbin, World } from '../../src/sim/types';

function shyOne(world: World): Nubbin {
  const n = createEgg('s', { x: 0, z: 0 }, Rng.fromSeed(3));
  n.stage = 'adult';
  n.personality = 'shy';
  world.nubbins.push(n);
  return n;
}

describe('peekaboo hide state (R0321)', () => {
  it('picks a spot on the far side of an obstacle from the Keeper', () => {
    const world = createWorld('hide');
    const n = shyOne(world);
    const tree = obstacles(world).find((c) => c.id.startsWith('tree-'))!;
    n.pos = { x: tree.x + 1, z: tree.z + 1 };
    world.keeper.pos = { x: tree.x - 6, z: tree.z };
    const at = hideSpot(world, n)!;
    expect(at).not.toBeNull();
    // Further from the Keeper than the obstacle's own centre is.
    const dk = (p: { x: number; z: number }) =>
      Math.hypot(p.x - world.keeper.pos.x, p.z - world.keeper.pos.z);
    expect(dk(at)).toBeGreaterThan(dk(tree) - 0.01);
  });

  it('only shy Nubbins hide, and a hider pops out giggling when the Keeper walks up', () => {
    const world = createWorld('hide2');
    const n = shyOne(world);
    n.personality = 'cheerful';
    expect(hideAct(n, world, Rng.fromSeed(1))).toBeNull();
    n.personality = 'shy';
    let act = null;
    for (let i = 1; i < 200 && !act; i++) act = hideAct(n, world, Rng.fromSeed(i));
    expect(act?.state).toBe('hide');
    n.behavior.state = 'hide';
    n.behavior.sinceMs = world.timeMs;
    n.behavior.untilMs = world.timeMs + 60000;
    n.behavior.target = null;
    world.keeper.pos = { x: n.pos.x + 5, z: n.pos.z };
    expect(hiderFound(world, n)).toBe(false);
    world.keeper.pos = { x: n.pos.x + HIDE.foundRadius - 0.5, z: n.pos.z };
    const events = stepWorld(world, 100);
    expect(events.some((e) => e.kind === 'reaction' && e.reaction === 'giggle')).toBe(true);
  });
});
