import { afterEach, describe, expect, it } from 'vitest';
import { ACTS } from '../../src/config/dungeon-acts';
import { HOLLOW_ZONES, SIM } from '../../src/config/tuning';
import { cellCentre, runFloor, WALL, type Cell, type Floor } from '../../src/sim/dungeon';
import { setEncounterHandler } from '../../src/sim/dungeon-encounters';
import { levelIdOf, waypointCell, waypointHere } from '../../src/sim/dungeon-levels';
import { fieldFloor, sideFloor } from '../../src/sim/dungeon-outdoor';
import { serviceHere, townFloor } from '../../src/sim/dungeon-towns';
import { mouthHere } from '../../src/sim/dungeon-zones';
import { hatch } from '../../src/sim/lifecycle';
import { deserialize, SAVE_VERSION, serialize } from '../../src/sim/save';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// Lane B round 4: act camps (R0152) and outdoor fields (R0147).

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

function stairs(world: World, to: 'down' | 'up'): SimEvent[] {
  const out = send(world, { kind: 'dungeonGo', to });
  const run = world.dungeon;
  if (run?.pendingPos) world.keeper.pos = { ...run.pendingPos };
  out.push(...step(world, 200));
  return out;
}

/** Cells reachable on foot from `from` (anything but wall). */
function reachable(f: Floor, from: Cell): Uint8Array {
  const seen = new Uint8Array(f.cols * f.rows);
  const q = [from];
  seen[from.y * f.cols + from.x] = 1;
  for (let i = 0; i < q.length; i++) {
    const c = q[i]!;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const x = c.x + dx;
      const y = c.y + dy;
      if (x < 0 || y < 0 || x >= f.cols || y >= f.rows) continue;
      const k = y * f.cols + x;
      if (seen[k] || f.cells[k] === WALL) continue;
      seen[k] = 1;
      q.push({ x, y });
    }
  }
  return seen;
}

const at = (f: Floor, c: Cell, seen: Uint8Array) => seen[c.y * f.cols + c.x] === 1;

afterEach(() => setEncounterHandler(null));

describe('outdoor fields (R0147)', () => {
  it('is 128×96 with every cave mouth, the gate, the stone and the chest reachable', () => {
    for (let seed = 1; seed <= 12; seed++)
      for (let act = 0; act < ACTS.length; act++) {
        const f = fieldFloor(seed * 7919, act);
        expect([f.cols, f.rows]).toEqual([128, 96]);
        expect(f.zone).toBe('field');
        const seen = reachable(f, f.stairsUp);
        const mouths = f.mouths ?? [];
        expect(mouths.length).toBeGreaterThanOrEqual(HOLLOW_ZONES.field.mouths[0]);
        expect(mouths.length).toBeLessThanOrEqual(HOLLOW_ZONES.field.mouths[1]);
        for (const m of mouths) expect(at(f, m, seen)).toBe(true);
        expect(at(f, f.stairsDown!, seen)).toBe(true);
        expect(at(f, f.stone!, seen)).toBe(true);
        expect(at(f, f.chest, seen)).toBe(true);
        for (const s of f.shrines ?? []) expect(at(f, s.cell, seen)).toBe(true);
        for (const p of f.packs ?? []) expect(at(f, p.cell, seen)).toBe(true);
      }
  });

  it('holds 10–14 sparse packs, wildlife to scan and 1–2 shrines', () => {
    for (let seed = 1; seed <= 12; seed++) {
      const f = fieldFloor(seed * 104_729, 0);
      const packs = f.packs ?? [];
      expect(packs.length).toBeGreaterThanOrEqual(HOLLOW_ZONES.field.packs[0]);
      expect(packs.length).toBeLessThanOrEqual(HOLLOW_ZONES.field.packs[1]);
      expect(new Set(packs.map((p) => p.id)).size).toBe(packs.length);
      expect(f.wildSpots.length).toBeGreaterThanOrEqual(HOLLOW_ZONES.field.wildlife[0]);
      expect(f.shrines!.length).toBeGreaterThanOrEqual(1);
      expect(f.shrines!.length).toBeLessThanOrEqual(2);
      expect(f.light).toBe(1);
    }
  });

  it('the far gate is a long walk from the camp gate', () => {
    const f = fieldFloor(424_242, 0);
    const a = cellCentre(f, f.stairsUp);
    const b = cellCentre(f, f.stairsDown!);
    // Straight-line at least 130 world units: about 40 s at walking pace before any detour.
    expect(Math.hypot(a.x - b.x, a.z - b.z)).toBeGreaterThan(130);
  });

  it('side caves are one small level with no way down', () => {
    const f = sideFloor(99, 0, 1);
    expect(f.zone).toBe('side');
    expect(f.stairsDown).toBeNull();
    expect(f.cols).toBeLessThan(80);
  });
});

describe('act camps (R0152)', () => {
  it('has every service, no packs, strays, traps or shrines', () => {
    for (let act = 0; act < ACTS.length; act++) {
      const f = townFloor(act);
      expect([f.cols, f.rows]).toEqual([40, 30]);
      const kinds = (f.services ?? []).map((s) => s.kind).sort();
      expect(kinds).toEqual(['craft', 'gamble', 'hire', 'quest', 'stash', 'vendor']);
      expect(f.packs).toBeUndefined();
      expect(f.strayStarts).toEqual([]);
      expect(f.traps).toBeUndefined();
      expect(f.shrines).toBeUndefined();
      const seen = reachable(f, f.stairsUp);
      for (const s of f.services!) expect(at(f, s.cell, seen)).toBe(true);
      expect(at(f, f.stairsDown!, seen)).toBe(true);
      // One act local per camp.
      expect(f.services!.filter((s) => s.keeper === 'local')).toHaveLength(1);
    }
  });

  it('every service is within 15 s of walking from the waypoint, and nothing attacks', () => {
    const world = keeperWorld();
    send(world, { kind: 'enterTown', act: 0 });
    const f = runFloor(world)!;
    const targets = [...f.services!.map((s) => s.cell), f.stairsDown!, f.stairsUp];
    for (const c of targets) {
      const stone = cellCentre(f, waypointCell(f));
      world.keeper.pos = { ...stone };
      const goal = cellCentre(f, c);
      send(world, { kind: 'moveKeeperTo', pos: goal });
      let ms = 0;
      while (ms < 15_000) {
        step(world, 500);
        ms += 500;
        const k = world.keeper.pos;
        if (Math.hypot(k.x - goal.x, k.z - goal.z) < HOLLOW_ZONES.reach) break;
      }
      expect(ms, `service at ${c.x},${c.y}`).toBeLessThan(15_000);
      expect(world.dungeon!.encounter).toBeUndefined();
    }
  });
});

describe('getting about an act above ground', () => {
  it('Grove → camp → fields → level 1 → fields → camp → home', () => {
    const world = keeperWorld();
    setEncounterHandler(() => 'fled');
    send(world, { kind: 'enterTown', act: 0 });
    expect(world.dungeon!.zone).toBe('town');
    expect(levelIdOf(world.dungeon!)).toBe('rootways.town');
    stairs(world, 'down');
    expect(world.dungeon!.zone).toBe('field');
    stairs(world, 'down');
    expect(world.dungeon!.zone).toBeUndefined();
    expect(levelIdOf(world.dungeon!)).toBe('rootways.1');
    stairs(world, 'up');
    expect(world.dungeon!.zone).toBe('field');
    // Back out at the act gate, not the camp gate.
    const f = runFloor(world)!;
    const gate = cellCentre(f, f.stairsDown!);
    expect(Math.hypot(world.keeper.pos.x - gate.x, world.keeper.pos.z - gate.z)).toBeLessThan(1);
    stairs(world, 'up');
    expect(world.dungeon!.zone).toBe('town');
    stairs(world, 'up');
    expect(world.location).toBe('grove');
  });

  it('a cave mouth leads into its side cave, whose stairs up come out at the mouth', () => {
    const world = keeperWorld();
    send(world, { kind: 'enterTown', act: 0 });
    stairs(world, 'down');
    const f = runFloor(world)!;
    const m = f.mouths![1]!;
    world.keeper.pos = cellCentre(f, m);
    expect(mouthHere(world)).toBe(1);
    send(world, { kind: 'enterMouth' });
    expect(world.dungeon!.zone).toBe('side');
    expect(world.dungeon!.side).toBe(1);
    expect(waypointHere(world.dungeon!)).toBeNull();
    stairs(world, 'up');
    expect(world.dungeon!.zone).toBe('field');
    expect(mouthHere(world)).toBe(1);
  });

  it('camp and field stones wake and can be travelled to', () => {
    const world = keeperWorld();
    send(world, { kind: 'enterTown', act: 0 });
    const f = runFloor(world)!;
    world.keeper.pos = cellCentre(f, waypointCell(f));
    step(world, 200);
    expect(world.hollow.waypoints).toContain('rootways.town');
    send(world, { kind: 'leaveDungeon' });
    send(world, { kind: 'waypointTravel', id: 'rootways.town' });
    expect(world.dungeon!.zone).toBe('town');
  });
});

describe('the acorn into a camp (R0150 with R0152)', () => {
  it('from Act II an acorn lands at the camp, and the camp portal goes back to the same floor', () => {
    const world = keeperWorld();
    world.hollow.acts = [{ bossDefeated: true, deepest: 3 }];
    send(world, { kind: 'enterAct', act: 1 });
    const run = world.dungeon!;
    const f = runFloor(world)!;
    const taken = f.loot[0]!.id;
    run.taken.push(taken);
    run.packs![0]!.state = 'beaten';
    const spot = cellCentre(f, f.loot[1]!.cell);
    world.keeper.pos = { ...spot };
    const events = send(world, { kind: 'useAcorn' });
    expect(events.some((e) => e.kind === 'acornPortal' && e.camp)).toBe(true);
    expect(world.location).toBe('dungeon');
    expect(world.dungeon!.zone).toBe('town');
    expect(world.hollow.portal).not.toBeNull();
    // A camp is safe already: no acorn there.
    expect(send(world, { kind: 'useAcorn' })).toEqual([]);
    world.inventory.shells = 50;
    send(world, { kind: 'portalReturn' });
    const back = world.dungeon!;
    expect(back.zone).toBeUndefined();
    expect(back.act).toBe(1);
    expect(back.taken).toContain(taken);
    expect(back.packs![0]!.state).toBe('beaten');
    expect(runFloor(world)).toBe(f);
    expect(world.hollow.portal).toBeNull();
    expect(Math.hypot(world.keeper.pos.x - spot.x, world.keeper.pos.z - spot.z)).toBeLessThan(1);
  });

  it('Act I still falls up to the Grove', () => {
    const world = keeperWorld();
    send(world, { kind: 'enterAct', act: 0 });
    send(world, { kind: 'useAcorn' });
    expect(world.location).toBe('grove');
  });
});

describe('camp services', () => {
  function standAt(world: World, kind: string): void {
    const f = runFloor(world)!;
    const s = f.services!.find((x) => x.kind === kind)!;
    world.keeper.pos = cellCentre(f, s.cell);
    expect(serviceHere(world)?.kind).toBe(kind);
  }

  it('the stash keeps Shells, and gives them back', () => {
    const world = keeperWorld();
    world.inventory.shells = 100;
    send(world, { kind: 'enterTown', act: 0 });
    send(world, { kind: 'stash', amount: 40 });
    expect(world.hollow.camp.shells).toBe(0);
    standAt(world, 'stash');
    send(world, { kind: 'stash', amount: 40 });
    expect(world.inventory.shells).toBe(60);
    expect(world.hollow.camp.shells).toBe(40);
    send(world, { kind: 'stash', amount: 500 });
    expect(world.inventory.shells).toBe(0);
    send(world, { kind: 'stash', amount: -30 });
    expect(world.inventory.shells).toBe(30);
    expect(world.hollow.camp.shells).toBe(70);
  });

  it('the vendor sells fruit; the quest pays once, after the boss', () => {
    const world = keeperWorld();
    world.inventory.shells = 100;
    const fruit = world.inventory.fruit;
    send(world, { kind: 'enterTown', act: 0 });
    standAt(world, 'vendor');
    send(world, { kind: 'townBuy', item: 'fruit' });
    expect(world.inventory.fruit).toBe(fruit + 1);
    expect(world.inventory.shells).toBe(100 - HOLLOW_ZONES.vendor.fruitPrice);
    standAt(world, 'quest');
    const before = world.inventory.shells;
    send(world, { kind: 'townQuest' });
    expect(world.inventory.shells).toBe(before);
    world.hollow.acts[0] = { bossDefeated: true, deepest: 3 };
    send(world, { kind: 'townQuest' });
    send(world, { kind: 'townQuest' });
    expect(world.inventory.shells).toBe(before + HOLLOW_ZONES.questReward[0]);
  });
});

describe('save version 10', () => {
  it('migrates a version-9 save to an empty stash', () => {
    expect(SAVE_VERSION).toBe(10);
    const world = keeperWorld();
    const old = JSON.parse(serialize(world, 0)) as {
      version: number;
      world: { hollow: Record<string, unknown> };
    };
    old.version = 9;
    delete old.world.hollow.camp;
    const back = deserialize(JSON.stringify(old)).world;
    expect(back.hollow.camp).toEqual({ shells: 0, items: {}, questsPaid: [] });
  });

  it('a run saved in the fields loads back in the fields', () => {
    const world = keeperWorld();
    send(world, { kind: 'enterTown', act: 0 });
    stairs(world, 'down');
    world.hollow.camp.shells = 12;
    const back = deserialize(serialize(world, 0)).world;
    expect(back.dungeon!.zone).toBe('field');
    expect(back.hollow.camp.shells).toBe(12);
    expect(runFloor(back)).toBe(runFloor(world));
  });
});
