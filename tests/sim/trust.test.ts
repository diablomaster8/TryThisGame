import { describe, expect, it } from 'vitest';
import { SIM, TRUST } from '../../src/config/tuning';
import { hatch } from '../../src/sim/lifecycle';
import { deserialize, serialize } from '../../src/sim/save';
import { addTrust, isWary } from '../../src/sim/trust';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

function hatchedWorld() {
  const world = createWorld(7, 0);
  const events: SimEvent[] = [];
  for (const n of world.nubbins) hatch(n, events, 0);
  return world;
}

describe('trust and Shadow', () => {
  it('starts at the middle and moves with care', () => {
    const world = hatchedWorld();
    const n = world.nubbins[0]!;
    expect(n.trust).toBe(TRUST.start);
    addTrust(n, TRUST.pet);
    expect(n.trust).toBe(TRUST.start + TRUST.pet);
    addTrust(n, TRUST.throw);
    expect(n.trust).toBe(TRUST.start + TRUST.pet + TRUST.throw);
  });

  it('turns Shadow when trust collapses, and the grey stays', () => {
    const world = hatchedWorld();
    const n = world.nubbins[0]!;
    const events: SimEvent[] = [];
    addTrust(n, -(TRUST.start - TRUST.shadowBelow + 1), events);
    expect(n.shadow).toBe(true);
    expect(events.some((e) => e.kind === 'turnedShadow')).toBe(true);
    expect(isWary(n)).toBe(true);
    // Patient care brings it back to loving; it stays Shadow.
    for (let i = 0; i < 60; i++) addTrust(n, TRUST.pet, events);
    expect(n.bond).toBe(true);
    expect(n.shadow).toBe(true);
    expect(isWary(n)).toBe(false);
    expect(events.some((e) => e.kind === 'shadowBonded')).toBe(true);
  });

  it('gains trust more slowly while Shadow and unbonded', () => {
    const world = hatchedWorld();
    const n = world.nubbins[0]!;
    n.trust = 10;
    n.shadow = true;
    addTrust(n, 10);
    expect(n.trust).toBeCloseTo(10 + 10 * TRUST.shadowGainScale);
  });

  it('throws lower trust through the command path', () => {
    const world = hatchedWorld();
    const n = world.nubbins[0]!;
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'grab', nubbinId: n.id }, events);
    applyCommand(world, { kind: 'release', vel: { x: 6, z: 0 } }, events);
    expect(n.trust).toBe(TRUST.start + TRUST.throw);
  });

  it('runs away after rock-bottom trust for long enough, and returns as a stray', () => {
    const world = hatchedWorld();
    const n = world.nubbins[0]!;
    n.trust = 2;
    n.shadow = true;
    n.needs.hunger = 1;
    const events: SimEvent[] = [];
    const steps = Math.ceil((TRUST.runawayAfterMs + 2000) / SIM.stepMs);
    for (let i = 0; i < steps; i++) {
      for (const x of world.nubbins) {
        x.needs.hunger = 1;
        x.needs.energy = 1;
      }
      events.push(...stepWorld(world, SIM.stepMs));
    }
    expect(world.nubbins.some((x) => x.id === n.id)).toBe(false);
    expect(world.strays.length).toBe(1);
    expect(events.some((e) => e.kind === 'ranAway')).toBe(true);
    // It survives a save round-trip while away.
    const file = deserialize(serialize(world, 0));
    expect(file.world.strays[0]!.nubbin.id).toBe(n.id);
    // And comes back to the edge later.
    const back = Math.ceil((TRUST.strayReturnMs + 2000) / SIM.stepMs);
    for (let i = 0; i < back; i++) {
      for (const x of world.nubbins) {
        x.needs.hunger = 1;
        x.needs.energy = 1;
      }
      events.push(...stepWorld(world, SIM.stepMs));
    }
    expect(world.nubbins.some((x) => x.id === n.id)).toBe(true);
    expect(world.nubbins.find((x) => x.id === n.id)!.stray).toBe(true);
    expect(events.some((e) => e.kind === 'strayReturned')).toBe(true);
  });

  it('migrates a version 1 save', () => {
    const world = createWorld(3, 0);
    const v1 = JSON.parse(serialize(world, 0)) as Record<string, unknown>;
    v1.version = 1;
    const w = v1.world as Record<string, unknown>;
    delete w.strays;
    delete w.npcs;
    delete w.campaign;
    for (const n of w.nubbins as Record<string, unknown>[]) {
      delete n.trust;
      delete n.shadow;
      delete n.bond;
    }
    const file = deserialize(JSON.stringify(v1));
    expect(file.version).toBe(2);
    expect(file.world.strays).toEqual([]);
    expect(file.world.campaign).toBeNull();
    expect(file.world.nubbins[0]!.trust).toBe(TRUST.start);
    expect(file.world.nubbins[0]!.shadow).toBe(false);
  });
});
