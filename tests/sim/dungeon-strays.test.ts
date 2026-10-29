import { describe, expect, it } from 'vitest';
import { HOLLOW, SIM } from '../../src/config/tuning';
import { hatch } from '../../src/sim/lifecycle';
import { deserialize, serialize } from '../../src/sim/save';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// R0162: a stray drops what it snatched as a trail, snatches twice a floor at most, and a
// party Nubbin can shoo it off.

function underground(seed = 8) {
  const world = createWorld(seed, 0);
  const events: SimEvent[] = [];
  for (const n of world.nubbins) hatch(n, events, 0);
  world.inventory.shells = 55;
  world.inventory.fruit = 0;
  applyCommand(world, { kind: 'enterDungeon', daily: false }, events);
  world.dungeon!.graceUntilMs = 0;
  // Keep the packs out of it.
  for (const p of world.dungeon!.packs ?? []) p.state = 'beaten';
  return world;
}

describe('strays as a chase (R0162)', () => {
  it('drops snatched Shells as a trail a chasing Keeper gets back, and never snatches thrice', () => {
    const world = underground();
    const run = world.dungeon!;
    const s = run.strays[0]!;
    const out: SimEvent[] = [];
    // Thirty seconds of a Keeper glued to one stray: it snatches, flees, is chased.
    for (let t = 0; t < 30_000; t += SIM.stepMs) {
      if (s.cooldownMs > 0) world.keeper.pos = { ...s.pos };
      else world.keeper.pos = { x: s.pos.x + 0.3, z: s.pos.z };
      out.push(...stepWorld(world, SIM.stepMs));
    }
    const snatched = out
      .filter((e) => e.kind === 'strayStartled')
      .reduce((a, e) => a + (e.kind === 'strayStartled' ? e.shells : 0), 0);
    expect(out.filter((e) => e.kind === 'strayStartled')).toHaveLength(HOLLOW.strays.maxSnatches);
    expect(s.snatches).toBe(2);
    // Walk over whatever is left of the trail.
    for (const p of [...(run.shellTrail ?? [])]) {
      world.keeper.pos = { x: p.x, z: p.z };
      out.push(...stepWorld(world, SIM.stepMs));
    }
    // Every snatched Shell came back as a picked-up trail Shell (the bar is 80%).
    const back = out.filter((e) => e.kind === 'trailShell').length;
    expect(snatched).toBeGreaterThan(0);
    expect(back).toBeGreaterThanOrEqual(snatched * 0.8);
    expect(world.inventory.shells).toBeGreaterThanOrEqual(55 - snatched * 0.2);
  });

  it('keeps the trail and the snatch count through a save', () => {
    const world = underground();
    const run = world.dungeon!;
    const s = run.strays[0]!;
    s.snatches = 2;
    run.shellTrail = [{ id: 'x', x: 1, z: 2 }];
    const back = deserialize(serialize(world, 0)).world.dungeon!;
    expect(back.strays[0]!.snatches).toBe(2);
    expect(back.shellTrail).toEqual([{ id: 'x', x: 1, z: 2 }]);
  });

  it('a tap with no fruit sends a party Nubbin to shoo the stray, for energy', () => {
    const world = underground();
    const run = world.dungeon!;
    const s = run.strays[0]!;
    const n = world.nubbins.find((x) => run.party.includes(x.id))!;
    n.needs.energy = 80;
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'feedStray', id: s.id }, events);
    expect(events.some((e) => e.kind === 'strayShooed')).toBe(true);
    expect(s.shooed).toBe(true);
    expect(n.needs.energy).toBe(80 - HOLLOW.strays.shooEnergy);
    // Shooed, it never snatches on this floor.
    const out: SimEvent[] = [];
    for (let t = 0; t < 15_000; t += SIM.stepMs) {
      world.keeper.pos = { x: s.pos.x + 0.3, z: s.pos.z };
      out.push(...stepWorld(world, SIM.stepMs));
    }
    expect(out.some((e) => e.kind === 'strayStartled')).toBe(false);
  });

  it('never snatches in the arrival grace', () => {
    const world = underground();
    world.dungeon!.graceUntilMs = world.timeMs + 5000;
    const s = world.dungeon!.strays[0]!;
    const out: SimEvent[] = [];
    for (let t = 0; t < 4000; t += SIM.stepMs) {
      world.keeper.pos = { x: s.pos.x + 0.3, z: s.pos.z };
      out.push(...stepWorld(world, SIM.stepMs));
    }
    expect(out.some((e) => e.kind === 'strayStartled')).toBe(false);
  });
});
