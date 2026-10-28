// MOVE-29: Nubbins steer round solids while they walk instead of pressing into them and being
// pushed out afterwards. A walk straight through the cottage goes round it, a long walk round
// a hill follows a path, and a sled run starts at a ramp foot it can reach.
import { describe, expect, it } from 'vitest';
import { BEHAVIOR, EGG, NUBBIN_STEER, SIM } from '../../src/config/tuning';
import { contact, obstacles } from '../../src/sim/obstacles';
import type { Nubbin, Vec2, World } from '../../src/sim/types';
import { createWorld, stepWorld } from '../../src/sim/world';

function hatchedWorld(seed: number): { w: World; n: Nubbin } {
  const w = createWorld(seed, 0);
  for (let i = 0; i < EGG.hatchMs / SIM.stepMs + 5; i++) stepWorld(w, SIM.stepMs);
  w.nubbins = [w.nubbins[0]!];
  return { w, n: w.nubbins[0]! };
}

/** Send the Nubbin on a wander to `to` and step until it arrives; returns the steps taken. */
function walk(w: World, n: Nubbin, from: Vec2, to: Vec2, maxSteps: number, each: () => void) {
  n.pos = { ...from };
  n.behavior.state = 'wander';
  n.behavior.sinceMs = w.timeMs;
  n.behavior.untilMs = w.timeMs + maxSteps * SIM.stepMs * 2;
  n.behavior.target = { ...to };
  for (let i = 0; i < maxSteps; i++) {
    n.needs.hunger = 1;
    n.needs.energy = 1;
    stepWorld(w, SIM.stepMs);
    each();
    if (Math.hypot(n.pos.x - to.x, n.pos.z - to.z) <= BEHAVIOR.arriveRadius + 0.05) return i;
    if (n.behavior.state !== 'wander') return -1;
  }
  return -1;
}

describe('Nubbin steering (MOVE-29)', () => {
  it('walks round the cottage, never touching its walls', () => {
    const { w, n } = hatchedWorld(5);
    const cottage = obstacles(w).find((c) => c.id === 'cottage')!;
    let touching = 0;
    const steps = walk(
      w,
      n,
      { x: cottage.x - 5, z: cottage.z },
      { x: cottage.x + 5, z: cottage.z },
      400,
      () => {
        if (contact(cottage, n.pos.x, n.pos.z, NUBBIN_STEER.radius - 0.02)) touching++;
      },
    );
    expect(steps).toBeGreaterThan(0);
    // A few grazing steps at a corner are fine; pressing along the wall is not.
    expect(touching).toBeLessThan(5);
  });

  it('follows a path round a hill to a target on its far side', () => {
    const { w, n } = hatchedWorld(6);
    const hill = obstacles(w).find((c) => c.id === 'hill-0')!;
    const r = hill.shape.type === 'circle' ? hill.shape.r : 3;
    const steps = walk(
      w,
      n,
      { x: hill.x - r - 1.5, z: hill.z },
      { x: hill.x + r + 1.5, z: hill.z },
      1200,
      () => {},
    );
    expect(steps).toBeGreaterThan(0);
  });

  it('starts a sled run at a ramp foot clear of every solid, and walks there', () => {
    const { w, n } = hatchedWorld(7);
    w.weather.kind = 'snow';
    let foot: Vec2 | null = null;
    for (let i = 0; i < 20_000 && !foot; i++) {
      n.needs.hunger = 1;
      n.needs.energy = 1;
      stepWorld(w, SIM.stepMs);
      w.weather.kind = 'snow';
      if (n.behavior.itemId === 'sled' && n.behavior.target) foot = { ...n.behavior.target };
    }
    expect(foot).not.toBeNull();
    const hit = obstacles(w).filter(
      (c) => !c.flags.includes('keeperOnly') && contact(c, foot!.x, foot!.z, 0.25),
    );
    expect(hit.map((c) => c.id)).toEqual([]);
    for (let i = 0; i < 600 && n.behavior.target; i++) {
      n.needs.hunger = 1;
      n.needs.energy = 1;
      stepWorld(w, SIM.stepMs);
      w.weather.kind = 'snow';
    }
    expect(n.behavior.state).toBe('perform');
    expect(Math.hypot(n.pos.x - foot!.x, n.pos.z - foot!.z)).toBeLessThan(1);
  });
});
