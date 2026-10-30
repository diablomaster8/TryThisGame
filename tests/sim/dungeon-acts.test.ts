import { afterEach, describe, expect, it } from 'vitest';
import { ACTS, actStartDepth } from '../../src/config/dungeon-acts';
import { SIM } from '../../src/config/tuning';
import { runFloor } from '../../src/sim/dungeon';
import { actBossDepth, actOpen } from '../../src/sim/dungeon-acts';
import { autoResolve, setEncounterHandler } from '../../src/sim/dungeon-encounters';
import { hatch } from '../../src/sim/lifecycle';
import { deserialize, MIGRATIONS, SAVE_VERSION, serialize } from '../../src/sim/save';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// R0145: five acts, each a few levels deep with a boss at the bottom that opens the next.

function keeperWorld(seed = 5): World {
  const world = createWorld(seed, 0);
  const events: SimEvent[] = [];
  for (const n of world.nubbins) hatch(n, events, 0);
  return world;
}

function step(world: World, ms: number): SimEvent[] {
  const out: SimEvent[] = [];
  for (let t = 0; t < ms; t += SIM.stepMs) out.push(...stepWorld(world, SIM.stepMs));
  return out;
}

/** Use the stairs down from wherever the Keeper stands. */
function takeStairs(world: World): SimEvent[] {
  const out: SimEvent[] = [];
  applyCommand(world, { kind: 'dungeonGo', to: 'down' }, out);
  const run = world.dungeon;
  if (run?.pendingPos) world.keeper.pos = { ...run.pendingPos };
  out.push(...step(world, 200));
  return out;
}

describe('the five acts (R0145)', () => {
  afterEach(() => setEncounterHandler(null));

  it('play through, each boss opening the next act, with the auto-resolve stub', () => {
    setEncounterHandler(autoResolve);
    const world = keeperWorld();
    for (let act = 0; act < ACTS.length; act++) {
      // The next act stays shut until this one's boss is beaten.
      if (act + 1 < ACTS.length) expect(actOpen(world, act + 1)).toBe(false);
      const events: SimEvent[] = [];
      applyCommand(world, { kind: 'enterAct', act }, events);
      expect(world.location).toBe('dungeon');
      const run = world.dungeon!;
      expect(run.act).toBe(act);
      expect(run.depth).toBe(actStartDepth(act));
      // Down the act's levels to the boss floor.
      while (run.depth < actBossDepth(act)) {
        run.graceUntilMs = 0;
        run.packs = [];
        takeStairs(world);
      }
      const f = runFloor(world)!;
      expect(f.layout!.pieces.some((p) => p.role === 'boss')).toBe(true);
      // The boss sits on the way on.
      run.packs = run.packs!.filter((p) => p.id === 'pack-boss');
      expect(run.packs.length).toBe(1);
      expect(takeStairs(world)).toContainEqual({ kind: 'bossGuard' });
      expect(world.location).toBe('dungeon');
      // Bump the boss until the stub says the party won.
      let won = false;
      for (let tries = 0; tries < 40 && !won; tries++) {
        run.graceUntilMs = 0;
        const boss = run.packs[0]!;
        // On the boss itself: a step to one side can be water or a chasm on some layouts.
        world.keeper.pos = { x: boss.pos.x, z: boss.pos.z };
        won = step(world, 1500).some((e) => e.kind === 'bossBeaten');
      }
      expect(won).toBe(true);
      expect(world.hollow.acts[act]!.bossDefeated).toBe(true);
      expect(world.hollow.acts[act]!.deepest).toBe(ACTS[act]!.levels.length);
      // The way on now leads home with the haul.
      takeStairs(world);
      expect(world.location).toBe('grove');
      if (act + 1 < ACTS.length) expect(actOpen(world, act + 1)).toBe(true);
    }
    expect(world.hollow.acts.every((a) => a.bossDefeated)).toBe(true);
  });

  it('will not enter an act that is still shut', () => {
    const world = keeperWorld();
    applyCommand(world, { kind: 'enterAct', act: 2 }, []);
    expect(world.location).toBe('grove');
    expect(world.dungeon).toBeNull();
  });

  it('keeps every beaten boss through export and import', () => {
    const world = keeperWorld();
    world.hollow.acts = [
      { bossDefeated: true, deepest: 3 },
      { bossDefeated: false, deepest: 2 },
    ];
    const back = deserialize(serialize(world, 0)).world;
    expect(back.hollow.acts).toEqual(world.hollow.acts);
    expect(actOpen(back, 1)).toBe(true);
    expect(actOpen(back, 2)).toBe(false);
  });

  it('migrates a version-7 save to no acts begun', () => {
    expect(SAVE_VERSION).toBeGreaterThanOrEqual(8);
    const world = keeperWorld();
    const old = JSON.parse(serialize(world, 0)) as {
      version: number;
      world: Record<string, unknown>;
    };
    old.version = 7;
    delete (old.world.hollow as Record<string, unknown>).acts;
    const back = deserialize(JSON.stringify(old));
    expect(back.version).toBe(SAVE_VERSION);
    expect(back.world.hollow.acts).toEqual([]);
    expect(MIGRATIONS.length).toBe(SAVE_VERSION - 1);
  });
});
