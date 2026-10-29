import { describe, expect, it } from 'vitest';
import { LANDMARKS, PARTNERS, SIM } from '../../src/config/tuning';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

/** A world with a hatched Nubbin carried and another as partner. */
function setUp(): World {
  const world = createWorld(7, 0);
  for (const n of world.nubbins) applyCommand(world, { kind: 'debugHatchNow', nubbinId: n.id }, []);
  stepWorld(world, SIM.stepMs);
  const [a, b] = world.nubbins;
  // Held as the Keeper's pick-up leaves it (`sim/keeper.ts`).
  world.keeper.carrying = a!.id;
  a!.behavior.state = 'carried';
  world.partners = [b!.id, null];
  return world;
}

describe('fast travel (R0074)', () => {
  it('arrives with the carried Nubbin still carried and the partner close behind', () => {
    const world = setUp();
    const l = LANDMARKS[0]!;
    world.landmarks[l.id] = 1;
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'fastTravel', poi: l.id }, events);
    const k = world.keeper;
    expect(Math.hypot(k.pos.x - l.x, k.pos.z - l.z)).toBeLessThan(0.5);
    expect(events.some((e) => e.kind === 'travelled')).toBe(true);
    for (let i = 0; i < 5; i++) stepWorld(world, SIM.stepMs);
    expect(world.keeper.carrying).toBe(world.nubbins[0]!.id);
    const held = world.nubbins[0]!;
    expect(Math.hypot(held.pos.x - k.pos.x, held.pos.z - k.pos.z)).toBeLessThan(0.5);
    const p = world.nubbins[1]!;
    expect(Math.hypot(p.pos.x - k.pos.x, p.pos.z - k.pos.z)).toBeLessThanOrEqual(
      PARTNERS.followDistance,
    );
  });

  it('refuses a landmark not yet found, and anywhere but the Grove', () => {
    const world = setUp();
    const l = LANDMARKS[1]!;
    const before = { ...world.keeper.pos };
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'fastTravel', poi: l.id }, events);
    expect(events).toContainEqual({ kind: 'travelRefused', exit: l.id, reason: 'not-found' });
    expect(world.keeper.pos).toEqual(before);
    world.landmarks[l.id] = 1;
    world.location = 'hollow';
    const more: SimEvent[] = [];
    applyCommand(world, { kind: 'fastTravel', poi: l.id }, more);
    expect(more.some((e) => e.kind === 'travelRefused' && e.reason === 'elsewhere')).toBe(true);
  });

  it('costs nothing', () => {
    const world = setUp();
    world.landmarks[LANDMARKS[2]!.id] = 1;
    const shells = world.inventory.shells;
    applyCommand(world, { kind: 'fastTravel', poi: LANDMARKS[2]!.id }, []);
    expect(world.inventory.shells).toBe(shells);
  });
});
