import { describe, expect, it } from 'vitest';
import { HOLLOW, SIM } from '../../src/config/tuning';
import { hatch } from '../../src/sim/lifecycle';
import { deserialize, serialize } from '../../src/sim/save';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// R0142: the Hollow holds still behind the loading veil, and strays leave a Keeper who has
// just arrived alone for the arrival grace.

function underground(seed = 8) {
  const world = createWorld(seed, 0);
  const events: SimEvent[] = [];
  for (const n of world.nubbins) hatch(n, events, 0);
  world.inventory.shells = 55;
  applyCommand(world, { kind: 'enterDungeon', daily: false }, events);
  return world;
}

/** Step `ms`, pinning the first stray against the Keeper every step. */
function hugged(world: ReturnType<typeof createWorld>, ms: number): SimEvent[] {
  const out: SimEvent[] = [];
  for (let t = 0; t < ms; t += SIM.stepMs) {
    const s = world.dungeon!.strays[0]!;
    s.pos = { x: world.keeper.pos.x + 0.3, z: world.keeper.pos.z };
    out.push(...stepWorld(world, SIM.stepMs));
  }
  return out;
}

describe('arriving in the Hollow (R0142)', () => {
  it('takes no Shells for the arrival grace with a stray beside the Keeper', () => {
    const world = underground();
    expect(world.dungeon!.strays.length).toBeGreaterThan(0);
    const out = hugged(world, HOLLOW.arrivalGraceMs - 200);
    expect(out.filter((e) => e.kind === 'strayStartled')).toEqual([]);
    expect(world.inventory.shells).toBe(55);
    // Once the grace is over a stray snatches as before.
    const later = hugged(world, 1000 + HOLLOW.strayChoice.askMs);
    expect(later.some((e) => e.kind === 'strayStartled')).toBe(true);
  });

  it('holds the floor still behind the veil, and restarts the grace when it lifts', () => {
    const world = underground();
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'setLoading', on: true }, events);
    const s = world.dungeon!.strays[0]!;
    const before = { ...s.pos };
    // Ten seconds behind the veil, well past the grace from entering.
    for (let t = 0; t < 10_000; t += SIM.stepMs) {
      s.pos = { x: world.keeper.pos.x + 0.3, z: world.keeper.pos.z };
      stepWorld(world, SIM.stepMs);
    }
    expect(world.inventory.shells).toBe(55);
    s.pos = before;
    stepWorld(world, SIM.stepMs);
    expect(s.pos).toEqual(before);
    applyCommand(world, { kind: 'setLoading', on: false }, events);
    expect(world.dungeon!.graceUntilMs).toBe(world.timeMs + HOLLOW.arrivalGraceMs);
    expect(hugged(world, 2000).some((e) => e.kind === 'strayStartled')).toBe(false);
    expect(world.inventory.shells).toBe(55);
  });

  it('never saves the hold', () => {
    const world = underground();
    applyCommand(world, { kind: 'setLoading', on: true }, []);
    const back = deserialize(serialize(world, 0)).world;
    expect(back.dungeon!.loading).toBeUndefined();
  });

  it('starts the grace again on every floor down', () => {
    const world = underground();
    const run = world.dungeon!;
    run.graceUntilMs = 0;
    applyCommand(world, { kind: 'dungeonGo', to: 'down' }, []);
    world.keeper.pos = { x: 0, z: 0 };
    // Walk the Keeper straight onto the stairs.
    for (let i = 0; i < 400 && run.depth === 1; i++) {
      world.keeper.pos = { ...run.pendingPos! };
      stepWorld(world, SIM.stepMs);
    }
    expect(run.depth).toBe(2);
    expect(run.graceUntilMs).toBeGreaterThan(world.timeMs);
  });
});
