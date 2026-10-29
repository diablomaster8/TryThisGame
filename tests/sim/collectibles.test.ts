import { describe, expect, it } from 'vitest';
import { COLLECT, COLLECTIBLES } from '../../src/config/region-collectibles';
import { SIM } from '../../src/config/tuning';
import { clampToWorld, inPond } from '../../src/sim/behavior';
import { openHere, stepCollectibles, tally } from '../../src/sim/collectibles';
import { blocked } from '../../src/sim/obstacles';
import { deserialize, serialize } from '../../src/sim/save';
import type { SimEvent, World } from '../../src/sim/types';
import { createWorld, stepWorld } from '../../src/sim/world';

function walkTo(world: World, x: number, z: number, events: SimEvent[]): void {
  world.keeper.pos = { x, z };
  stepCollectibles(world, events);
}

describe('one-time collectibles (R0091)', () => {
  it('the Grove holds a full set, each on open ground a Keeper can reach', () => {
    const world = createWorld(3, 0);
    const grove = COLLECTIBLES.filter((c) => c.region === 'grove');
    for (const kind of ['petal', 'postcard', 'key'] as const)
      expect(grove.filter((c) => c.kind === kind).length).toBe(COLLECT.perRegion[kind]);
    expect(new Set(grove.map((c) => c.id)).size).toBe(grove.length);
    for (const c of grove) {
      const p = { x: c.x, z: c.z };
      clampToWorld(p);
      expect(p, c.id).toEqual({ x: c.x, z: c.z });
      expect(inPond(p), c.id).toBe(false);
      expect(blocked(p, world, 0.4), c.id).toBe(false);
    }
  });

  it('picks each up once, never respawns over 30 days, and rewards a set once', () => {
    const world = createWorld(4, 0);
    const events: SimEvent[] = [];
    const petals = COLLECTIBLES.filter((c) => c.region === 'grove' && c.kind === 'petal');
    const decor0 = world.inventory.decor.flowerbed ?? 0;
    for (const c of petals) walkTo(world, c.x, c.z, events);
    expect(tally(world, 'grove', 'petal')).toEqual({ got: 12, of: 12 });
    expect(events.filter((e) => e.kind === 'keepsakeFound').length).toBe(12);
    expect(events.filter((e) => e.kind === 'collectionSetDone').length).toBe(1);
    expect(world.inventory.decor.flowerbed).toBe(decor0 + 1);
    // Thirty days later, walking the same route finds nothing new.
    world.keeper.pos = { x: 0, z: 4 };
    const days = (30 * 24 * 3600 * 1000) / SIM.stepMs;
    for (let i = 0; i < days; i += 6000) stepWorld(world, SIM.stepMs * 6000);
    const later: SimEvent[] = [];
    for (const c of petals) walkTo(world, c.x, c.z, later);
    expect(later.some((e) => e.kind === 'keepsakeFound' || e.kind === 'collectionSetDone')).toBe(
      false,
    );
    expect(world.inventory.decor.flowerbed).toBe(decor0 + 1);
    expect(openHere(world).every((c) => c.kind !== 'petal')).toBe(true);
  });

  it('keeps what was found through a save, and an older save starts with none', () => {
    const world = createWorld(5, 0);
    const c = COLLECTIBLES[0]!;
    walkTo(world, c.x, c.z, []);
    const back = deserialize(serialize(world, 0)).world;
    expect(back.collected?.[c.id]).toBe(world.collected![c.id]);
    const old = JSON.parse(serialize(world, 0)) as { world: Record<string, unknown> };
    delete old.world.collected;
    const fresh = deserialize(JSON.stringify(old)).world;
    expect(tally(fresh, 'grove', 'petal').got).toBe(0);
    expect(openHere(fresh).length).toBe(COLLECTIBLES.length);
  });
});
