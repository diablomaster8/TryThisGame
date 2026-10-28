import { describe, expect, it } from 'vitest';
import { DUNGEON, SIM } from '../../src/config/tuning';
import { bestAllyAction } from '../../src/sim/battle';
import { cellCentre, runFloor } from '../../src/sim/dungeon';
import { boutOutcome, HOLLOW_BATTLE_SOURCE } from '../../src/sim/dungeon-encounters';
import { hatch } from '../../src/sim/lifecycle';
import { deserialize, serialize } from '../../src/sim/save';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// Lane B round 2: a pack encounter in the Hollow is fought on lane C's battle core.

function underground(seed = 8): World {
  const world = createWorld(seed, 0);
  const events: SimEvent[] = [];
  for (const n of world.nubbins) hatch(n, events, 0);
  applyCommand(world, { kind: 'enterDungeon', daily: false }, events);
  world.dungeon!.graceUntilMs = 0;
  return world;
}

function step(world: World, ms: number): SimEvent[] {
  const out: SimEvent[] = [];
  for (let t = 0; t < ms; t += SIM.stepMs) out.push(...stepWorld(world, SIM.stepMs));
  return out;
}

/** Bump the Keeper into the first pack; returns its id once the bout is on. */
function bump(world: World): string {
  const f = runFloor(world)!;
  const spec = f.packs![0]!;
  const home = cellCentre(f, spec.cell);
  world.keeper.pos = { x: home.x + 0.3 * DUNGEON.cell, z: home.z };
  world.dungeon!.packs!.find((p) => p.id === spec.id)!.pos = { ...home };
  step(world, 2000);
  return spec.id;
}

/** Plays the bout out with the ally AI's picks; the sim settles it. */
function fightOut(world: World): SimEvent[] {
  const out: SimEvent[] = [];
  for (let i = 0; i < 400 && world.battle && !world.battle.result; i++) {
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'battleAct', action: bestAllyAction(world.battle) }, events);
    out.push(...events);
  }
  return out;
}

describe('Hollow encounters on the battle core', () => {
  it('starts an encounter bout with the pack as foes, seeded from the encounter', () => {
    const world = underground();
    const runs = world.battleRuns ?? 0;
    const id = bump(world);
    const run = world.dungeon!;
    expect(run.encounter?.packId).toBe(id);
    expect(run.encounter?.bout).toBe(runs + 1);
    const b = world.battle!;
    expect(b.result).toBeNull();
    expect(b.context.kind).toBe('encounter');
    if (b.context.kind !== 'encounter') return;
    expect(b.context.source).toBe(HOLLOW_BATTLE_SOURCE);
    expect(b.context.key).toBe(id);
    // Up to the party's size of the pack join in; the rest hang back.
    const members = runFloor(world)!
      .packs!.find((p) => p.id === id)!
      .members.slice(0, world.dungeon!.party.length);
    expect(b.context.foes).toEqual(members.map((m) => ({ species: m.species, level: m.level })));
    expect(b.sides[1].map((c) => c.species)).toEqual(members.map((m) => m.species));
    // Asked again every step, the handler never starts a second bout.
    step(world, 1000);
    expect(world.battleRuns).toBe(runs + 1);
  });

  it('holds the floor and the Keeper still while the bout is on', () => {
    const world = underground();
    bump(world);
    const at = { ...world.keeper.pos };
    applyCommand(world, { kind: 'moveKeeperTo', pos: { x: at.x + 3, z: at.z } }, []);
    step(world, 1000);
    expect(Math.hypot(world.keeper.pos.x - at.x, world.keeper.pos.z - at.z)).toBeLessThan(0.5);
  });

  it('finishes the encounter when the bout ends, and maps the result', () => {
    const world = underground();
    const id = bump(world);
    const shells = world.inventory.shells;
    const events = fightOut(world);
    const end = events.find((e) => e.kind === 'battleEnd');
    expect(end).toBeDefined();
    expect(world.dungeon!.encounter).toBeUndefined();
    const pack = world.dungeon!.packs!.find((p) => p.id === id)!;
    if (end?.kind === 'battleEnd' && end.winner === 0) {
      expect(pack.state).toBe('beaten');
      const beaten = events.find((e) => e.kind === 'packBeaten');
      // The battle prize counts toward the pack's reward, never on top of it.
      expect(beaten?.kind === 'packBeaten' && beaten.shells).toBe(world.inventory.shells - shells);
    } else {
      expect(pack.state).toBe('home');
    }
    // The floor moves again.
    step(world, 500);
    expect(world.dungeon!.encounter).toBeUndefined();
  });

  it('backing off flees a pack, with a grace', () => {
    const world = underground();
    const id = bump(world);
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'battleForfeit' }, events);
    expect(events).toContainEqual({ kind: 'packFled', packId: id });
    expect(world.dungeon!.encounter).toBeUndefined();
    expect(world.dungeon!.graceUntilMs).toBeGreaterThan(world.timeMs);
  });

  it('maps every bout result, and a boss is never fled', () => {
    expect(boutOutcome({ winner: 0, reason: 'tuckered' }, true)).toBe('won');
    expect(boutOutcome({ winner: 1, reason: 'tuckered' }, true)).toBe('lost');
    expect(boutOutcome({ winner: 1, reason: 'forfeit' }, true)).toBe('fled');
    expect(boutOutcome({ winner: null, reason: 'time' }, true)).toBe('fled');
    expect(boutOutcome({ winner: 1, reason: 'forfeit' }, false)).toBe('lost');
    expect(boutOutcome({ winner: null, reason: 'time' }, false)).toBe('lost');
  });

  it('survives a save mid-fight and finishes after the reload', () => {
    const world = underground();
    bump(world);
    const back = deserialize(serialize(world, 0)).world;
    expect(back.battle).toEqual(world.battle);
    expect(back.dungeon!.encounter).toEqual(world.dungeon!.encounter);
    step(back, 300);
    expect(back.battleRuns).toBe(world.battleRuns);
    fightOut(back);
    expect(back.dungeon!.encounter).toBeUndefined();
  });

  it('leaving the Hollow mid-fight gives the bout up', () => {
    const world = underground();
    bump(world);
    applyCommand(world, { kind: 'leaveDungeon' }, []);
    expect(world.dungeon).toBeNull();
    expect(world.battle!.result?.reason).toBe('forfeit');
  });
});
