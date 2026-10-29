import { afterEach, describe, expect, it } from 'vitest';
import { actStartDepth } from '../../src/config/dungeon-acts';
import { HOLLOW, SIM } from '../../src/config/tuning';
import { cellCentre, runFloor, type Floor } from '../../src/sim/dungeon';
import { setEncounterHandler } from '../../src/sim/dungeon-encounters';
import { hasWaypoint, levelIdOf, waypointCell } from '../../src/sim/dungeon-levels';
import { hatch } from '../../src/sim/lifecycle';
import { deserialize, SAVE_VERSION, serialize } from '../../src/sim/save';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// Lane B round 2: remembered levels (R0151), stable act floors (R0149), waypoints (R0148)
// and the Homing Acorn (R0150).

function keeperWorld(seed = 5): World {
  const world = createWorld(seed, 0);
  for (const n of world.nubbins) hatch(n, [], 0);
  return world;
}

function step(world: World, ms: number): SimEvent[] {
  const out: SimEvent[] = [];
  for (let t = 0; t < ms; t += SIM.stepMs) out.push(...stepWorld(world, SIM.stepMs));
  return out;
}

function send(world: World, cmd: Parameters<typeof applyCommand>[1]): SimEvent[] {
  const out: SimEvent[] = [];
  applyCommand(world, cmd, out);
  return out;
}

/** Use the stairs (down or up) from wherever the Keeper stands. */
function stairs(world: World, to: 'down' | 'up'): SimEvent[] {
  const out = send(world, { kind: 'dungeonGo', to });
  const run = world.dungeon;
  if (run?.pendingPos) world.keeper.pos = { ...run.pendingPos };
  out.push(...step(world, 200));
  return out;
}

/** Leaves a mark on the level: a find taken, the first pack beaten, the chest opened. */
function markLevel(world: World): { taken: string; pack: string } {
  const run = world.dungeon!;
  const f = runFloor(world)!;
  const taken = f.loot[0]!.id;
  run.taken.push(taken);
  const pack = run.packs![0]!;
  pack.state = 'beaten';
  run.chestOpen = true;
  return { taken, pack: pack.id };
}

const sameFloor = (a: Floor, b: Floor) =>
  a.cols === b.cols && a.rows === b.rows && a.cells.every((c, i) => c === b.cells[i]);

/** Packs stay home: these tests are about places, not fights. */
afterEach(() => setEncounterHandler(null));

describe('remembered levels (R0151)', () => {
  it('down two, up one: the level above is as it was left', () => {
    setEncounterHandler(() => 'fled');
    const world = keeperWorld();
    send(world, { kind: 'enterAct', act: 0 });
    stairs(world, 'down');
    const depth2 = world.dungeon!.depth;
    expect(depth2).toBe(actStartDepth(0) + 1);
    const mark = markLevel(world);
    const explored = world.dungeon!.explored;
    expect(explored.length).toBeGreaterThan(0);
    stairs(world, 'down');
    expect(world.dungeon!.depth).toBe(depth2 + 1);
    // The new level starts fresh.
    expect(world.dungeon!.taken).not.toContain(mark.taken);
    stairs(world, 'up');
    const run = world.dungeon!;
    expect(run.depth).toBe(depth2);
    expect(run.taken).toContain(mark.taken);
    expect(run.packs!.find((p) => p.id === mark.pack)!.state).toBe('beaten');
    expect(run.chestOpen).toBe(true);
    // The explored mask is what was seen, plus the stairs down where everyone arrives.
    expect(run.explored.length).toBe(explored.length);
    // Arrived at the stairs down, not the top.
    const f = runFloor(world)!;
    const at = cellCentre(f, f.stairsDown!);
    expect(Math.hypot(world.keeper.pos.x - at.x, world.keeper.pos.z - at.z)).toBeLessThan(0.01);
  });

  it('keeps at most the cap, oldest out', () => {
    const world = keeperWorld();
    send(world, { kind: 'enterAct', act: 0 });
    const run = world.dungeon!;
    run.levels = {};
    for (let i = 0; i < HOLLOW.levels.keep + 3; i++)
      run.levels[`deep.${100 + i}`] = {
        taken: [],
        packsCleared: [],
        chestOpen: false,
        explored: '',
        shrinesUsed: [],
      };
    stairs(world, 'down');
    const keys = Object.keys(world.dungeon!.levels!);
    expect(keys.length).toBe(HOLLOW.levels.keep);
    expect(keys.at(-1)).toBe('rootways.1');
    expect(keys).not.toContain('deep.100');
  });

  it('the stairs up from the top of an act still lead home', () => {
    const world = keeperWorld();
    send(world, { kind: 'enterAct', act: 0 });
    stairs(world, 'up');
    expect(world.location).toBe('grove');
  });
});

describe('stable act floors (R0149)', () => {
  it('two loads of the same save make the same floors; a reroll changes them once a day', () => {
    const world = keeperWorld();
    send(world, { kind: 'enterAct', act: 0 });
    const seed = world.dungeon!.seed;
    const first = runFloor(world)!;
    send(world, { kind: 'leaveDungeon' });
    for (let i = 0; i < 2; i++) {
      const back = deserialize(serialize(world, 0)).world;
      send(back, { kind: 'enterAct', act: 0 });
      expect(back.dungeon!.seed).toBe(seed);
      expect(sameFloor(runFloor(back)!, first)).toBe(true);
    }
    world.hollow.acts = [{ bossDefeated: true, deepest: 3 }];
    expect(send(world, { kind: 'rerollActs' })).toContainEqual({ kind: 'actsRerolled', ok: true });
    expect(send(world, { kind: 'rerollActs' })).toContainEqual({
      kind: 'actsRerolled',
      ok: false,
    });
    send(world, { kind: 'enterAct', act: 0 });
    expect(world.dungeon!.seed).not.toBe(seed);
    expect(sameFloor(runFloor(world)!, first)).toBe(false);
    // Act progress stays through a reroll.
    expect(world.hollow.acts[0]).toEqual({ bossDefeated: true, deepest: 3 });
  });

  it('no reroll from inside the Hollow', () => {
    const world = keeperWorld();
    send(world, { kind: 'enterAct', act: 0 });
    expect(send(world, { kind: 'rerollActs' })).toContainEqual({ kind: 'actsRerolled', ok: false });
  });
});

describe('waypoints (R0148)', () => {
  it('sit on level 1 and every other level, never the boss level', () => {
    expect(hasWaypoint(0, 1)).toBe(true);
    expect(hasWaypoint(0, 2)).toBe(false);
    expect(hasWaypoint(0, 3)).toBe(false);
    expect(hasWaypoint(2, 3)).toBe(true);
    expect(hasWaypoint(2, 4)).toBe(false);
  });

  it('activate, go home, travel back: the same layout, at the stone', () => {
    const world = keeperWorld();
    world.hollow.acts = [
      { bossDefeated: true, deepest: 3 },
      { bossDefeated: true, deepest: 3 },
    ];
    send(world, { kind: 'enterAct', act: 2 });
    const first = runFloor(world)!;
    const stone = cellCentre(first, waypointCell(first));
    world.keeper.pos = { ...stone };
    expect(step(world, 200)).toContainEqual({ kind: 'waypointActivated', id: 'sandglass.1' });
    expect(world.hollow.waypoints).toEqual(['sandglass.1']);
    // Down to level 3 and wake its stone too.
    stairs(world, 'down');
    stairs(world, 'down');
    const third = runFloor(world)!;
    world.keeper.pos = { ...cellCentre(third, waypointCell(third)) };
    step(world, 200);
    expect(world.hollow.waypoints).toContain('sandglass.3');
    // From the stone on level 3, straight back to level 1.
    expect(send(world, { kind: 'waypointTravel', id: 'sandglass.1' })).toContainEqual({
      kind: 'waypointArrived',
      id: 'sandglass.1',
    });
    expect(levelIdOf(world.dungeon!)).toBe('sandglass.1');
    send(world, { kind: 'leaveDungeon' });
    // From the Grove's cave mouth to level 3.
    send(world, { kind: 'waypointTravel', id: 'sandglass.3' });
    expect(world.location).toBe('dungeon');
    expect(levelIdOf(world.dungeon!)).toBe('sandglass.3');
    const again = runFloor(world)!;
    expect(sameFloor(again, third)).toBe(true);
    const at = cellCentre(again, waypointCell(again));
    expect(Math.hypot(world.keeper.pos.x - at.x, world.keeper.pos.z - at.z)).toBeLessThan(0.01);
  });

  it('never to a sleeping stone, nor away from one', () => {
    const world = keeperWorld();
    send(world, { kind: 'waypointTravel', id: 'rootways.1' });
    expect(world.location).toBe('grove');
    world.hollow.waypoints = ['rootways.1'];
    send(world, { kind: 'enterAct', act: 0 });
    stairs(world, 'down');
    // Not standing on a stone (level 2 has none).
    expect(send(world, { kind: 'waypointTravel', id: 'rootways.1' })).toEqual([]);
  });
});

describe('the Homing Acorn (R0150)', () => {
  it('portals home mid-floor and back to the same floor state', () => {
    setEncounterHandler(() => 'fled');
    const world = keeperWorld();
    send(world, { kind: 'enterAct', act: 0 });
    stairs(world, 'down');
    const mark = markLevel(world);
    const explored = world.dungeon!.explored;
    const where = { ...world.keeper.pos };
    expect(send(world, { kind: 'useAcorn' })).toContainEqual({ kind: 'acornPortal', free: true });
    expect(world.location).toBe('grove');
    expect(world.dungeon).toBeNull();
    expect(world.hollow.portal?.levelId).toBe('rootways.2');
    // A save with the portal open.
    const back = deserialize(serialize(world, 0)).world;
    step(back, 1000);
    expect(send(back, { kind: 'portalReturn' })).toContainEqual({ kind: 'portalReturned' });
    const run = back.dungeon!;
    expect(back.location).toBe('dungeon');
    expect(back.hollow.portal).toBeNull();
    expect(run.depth).toBe(actStartDepth(0) + 1);
    expect(run.taken).toContain(mark.taken);
    expect(run.packs!.find((p) => p.id === mark.pack)!.state).toBe('beaten');
    expect(run.chestOpen).toBe(true);
    expect(run.explored).toBe(explored);
    expect(Math.hypot(back.keeper.pos.x - where.x, back.keeper.pos.z - where.z)).toBeLessThan(1.5);
  });

  it('one free acorn a run, then from the pocket; the shop sells a bundle', () => {
    const world = keeperWorld();
    send(world, { kind: 'enterAct', act: 0 });
    send(world, { kind: 'useAcorn' });
    send(world, { kind: 'portalReturn' });
    // Free one spent and none carried: no portal.
    expect(send(world, { kind: 'useAcorn' })).toEqual([]);
    expect(world.location).toBe('dungeon');
    send(world, { kind: 'leaveDungeon' });
    world.inventory.shells = HOLLOW.acorns.price;
    expect(send(world, { kind: 'buyAcorns' })).toContainEqual({
      kind: 'acornsBought',
      ok: true,
      count: HOLLOW.acorns.bundle,
    });
    expect(world.inventory.shells).toBe(0);
    expect(send(world, { kind: 'buyAcorns' })).toContainEqual({
      kind: 'acornsBought',
      ok: false,
      count: 0,
    });
    send(world, { kind: 'enterAct', act: 0 });
    expect(send(world, { kind: 'useAcorn' })).toContainEqual({ kind: 'acornPortal', free: true });
    send(world, { kind: 'portalReturn' });
    expect(send(world, { kind: 'useAcorn' })).toContainEqual({ kind: 'acornPortal', free: false });
    expect(world.hollow.acorns).toBe(HOLLOW.acorns.bundle - 1);
  });
});

describe('save version 9', () => {
  it('migrates a version-8 save to no seeds, waypoints, acorns or portal', () => {
    expect(SAVE_VERSION).toBe(9);
    const world = keeperWorld();
    const old = JSON.parse(serialize(world, 0)) as {
      version: number;
      world: { hollow: Record<string, unknown> };
    };
    old.version = 8;
    for (const k of ['actSeeds', 'rerollDay', 'waypoints', 'acorns', 'portal'])
      delete old.world.hollow[k];
    const back = deserialize(JSON.stringify(old)).world;
    expect(back.hollow.actSeeds).toEqual([]);
    expect(back.hollow.rerollDay).toBe('');
    expect(back.hollow.waypoints).toEqual([]);
    expect(back.hollow.acorns).toBe(0);
    expect(back.hollow.portal).toBeNull();
  });
});
