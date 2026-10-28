import { describe, expect, it } from 'vitest';
import { DUNGEON, SIM } from '../../src/config/tuning';
import {
  cellAt,
  cellCentre,
  cellOf,
  dailySeed,
  dungeonBlocked,
  FLOOR,
  floorOf,
  floorSize,
  lootOnFloor,
  resolveDungeon,
  WALL,
} from '../../src/sim/dungeon';
import { hatch } from '../../src/sim/lifecycle';
import { deserialize, serialize } from '../../src/sim/save';
import type { SimEvent } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

function reaches(f: ReturnType<typeof floorOf>): Set<string> {
  const seen = new Set<string>();
  const stack = [f.stairsUp];
  while (stack.length) {
    const c = stack.pop()!;
    const key = `${c.x},${c.y}`;
    if (seen.has(key) || cellAt(f, c.x, c.y) === WALL) continue;
    seen.add(key);
    stack.push(
      { x: c.x + 1, y: c.y },
      { x: c.x - 1, y: c.y },
      { x: c.x, y: c.y + 1 },
      { x: c.x, y: c.y - 1 },
    );
  }
  return seen;
}

function hatchedWorld(seed = 3) {
  const world = createWorld(seed, 0);
  const events: SimEvent[] = [];
  for (const n of world.nubbins) hatch(n, events, 0);
  world.inventory.shells = 100;
  return world;
}

function step(world: ReturnType<typeof createWorld>, ms: number): SimEvent[] {
  const out: SimEvent[] = [];
  for (let t = 0; t < ms; t += SIM.stepMs) out.push(...stepWorld(world, SIM.stepMs));
  return out;
}

describe('floors', () => {
  it('are the same for the same seed and depth, and every open cell reaches the stairs', () => {
    const a = floorOf(11, 1);
    const b = floorOf(11, 1);
    expect(a).toBe(b);
    const reach = reaches(a);
    let open = 0;
    for (let y = 0; y < a.rows; y++)
      for (let x = 0; x < a.cols; x++) if (cellAt(a, x, y) !== WALL) open++;
    expect(reach.size).toBe(open);
    expect(open).toBeGreaterThan(150);
    expect(cellAt(a, a.chest.x, a.chest.y)).toBe(FLOOR);
    expect(a.stairsDown).not.toBeNull();
    expect(cellAt(a, a.stairsDown!.x, a.stairsDown!.y)).toBe(FLOOR);
    expect(a.torches.length).toBeGreaterThan(0);
    expect(a.loot.length).toBeGreaterThanOrEqual(DUNGEON.lootBase - 1);
    for (const l of a.loot) expect(cellAt(a, l.cell.x, l.cell.y)).toBe(FLOOR);
  });

  it('grow and darken with depth, and the bottom floor has no way down', () => {
    expect(floorSize(3).cols).toBeGreaterThan(floorSize(1).cols);
    expect(floorOf(5, 4).light).toBeLessThan(floorOf(5, 1).light);
    expect(floorOf(5, DUNGEON.maxDepth).stairsDown).toBeNull();
    expect(floorOf(5, 5).loot.length).toBeGreaterThan(floorOf(5, 1).loot.length);
  });

  it('round-trips cells and world positions and pushes walkers out of rock', () => {
    const f = floorOf(2, 1);
    const c = f.stairsUp;
    const p = cellCentre(f, c);
    expect(cellOf(f, p)).toEqual(c);
    // Find a wall next to an open cell and stand on the seam.
    let wall = { x: 0, y: 0 };
    outer: for (let y = 0; y < f.rows; y++) {
      for (let x = 0; x < f.cols; x++) {
        if (cellAt(f, x, y) === WALL && cellAt(f, x + 1, y) === FLOOR) {
          wall = { x, y };
          break outer;
        }
      }
    }
    const open = cellCentre(f, { x: wall.x + 1, y: wall.y });
    const q = { x: open.x - DUNGEON.cell / 2 + 0.1, z: open.z };
    expect(dungeonBlocked(q, f, 0.3)).toBe(true);
    expect(resolveDungeon(q, f, 0.35)).toBe(true);
    expect(dungeonBlocked(q, f, 0.3)).toBe(false);
    expect(q.x).toBeGreaterThan(open.x - DUNGEON.cell / 2 + 0.3);
    // A point deep in rock is moved to the nearest open cell.
    const deep = cellCentre(f, { x: 0, y: 0 });
    resolveDungeon(deep, f, 0.35);
    const dc = cellOf(f, deep);
    expect(cellAt(f, dc.x, dc.y)).not.toBe(WALL);
  });

  it('gives everyone the same daily seed and a different one tomorrow', () => {
    const a = dailySeed(Date.UTC(2026, 9, 13, 12));
    const b = dailySeed(Date.UTC(2026, 9, 13, 20));
    const c = dailySeed(Date.UTC(2026, 9, 14, 12));
    expect(a.seed).toBe(b.seed);
    expect(a.seed).not.toBe(c.seed);
  });
});

describe('a run', () => {
  it('enters with a party at the stairs, picks up loot underfoot, and comes home with it', () => {
    const world = hatchedWorld();
    const events: SimEvent[] = [];
    const home = { ...world.keeper.pos };
    applyCommand(world, { kind: 'enterDungeon', daily: false }, events);
    expect(world.location).toBe('dungeon');
    const run = world.dungeon!;
    expect(run.party.length).toBe(Math.min(DUNGEON.partySize, world.nubbins.length));
    const f = floorOf(run.seed, 1);
    expect(cellOf(f, world.keeper.pos)).toEqual(f.stairsUp);
    for (const id of run.party) {
      const n = world.nubbins.find((x) => x.id === id)!;
      const c = cellOf(f, n.pos);
      expect(cellAt(f, c.x, c.y)).toBe(FLOOR);
    }
    expect(events.some((e) => e.kind === 'dungeonEntered')).toBe(true);
    // Stand on a Shell pile: the Keeper picks it up.
    const shells = lootOnFloor(world).find((l) => l.kind === 'shells')!;
    expect(shells).toBeDefined();
    const before = world.inventory.shells;
    world.keeper.pos = { x: shells.pos.x, z: shells.pos.z };
    // Keep the party out of the way so the Keeper gets credit.
    for (const id of run.party) {
      const n = world.nubbins.find((x) => x.id === id)!;
      n.pos = { x: 1000, z: 1000 };
    }
    const found = step(world, 200).filter((e) => e.kind === 'dungeonFound');
    expect(found.length).toBe(1);
    expect(world.inventory.shells).toBe(before + shells.amount);
    expect(run.taken).toContain(shells.id);
    expect(lootOnFloor(world).some((l) => l.id === shells.id)).toBe(false);
    // Home with the haul.
    const out: SimEvent[] = [];
    applyCommand(world, { kind: 'leaveDungeon' }, out);
    expect(world.location).toBe('grove');
    expect(world.dungeon).toBeNull();
    expect(world.keeper.pos).toEqual(home);
    expect(world.hollow.runs).toBe(1);
    const left = out.find((e) => e.kind === 'dungeonLeft');
    expect(left && left.kind === 'dungeonLeft' && left.shells).toBe(shells.amount);
  });

  it('party Nubbins fetch loot near them and follow the Keeper', () => {
    const world = hatchedWorld(4);
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'enterDungeon', daily: false }, events);
    const run = world.dungeon!;
    const n = world.nubbins.find((x) => x.id === run.party[0])!;
    const loot = lootOnFloor(world)[0]!;
    // Put the Nubbin right beside the loot: it walks over and takes it.
    n.pos = { x: loot.pos.x + 0.8, z: loot.pos.z };
    const found = step(world, 1500).filter((e) => e.kind === 'dungeonFound' && e.by === n.id);
    expect(found.length).toBeGreaterThanOrEqual(1);
    // Far from the Keeper with nothing to fetch, it walks back.
    run.taken = floorOf(run.seed, 1).loot.map((l) => l.id);
    const k = world.keeper.pos;
    n.pos = { x: k.x + 1.0, z: k.z + 3.5 };
    const dBefore = Math.hypot(n.pos.x - k.x, n.pos.z - k.z);
    step(world, 600);
    const dAfter = Math.hypot(n.pos.x - k.x, n.pos.z - k.z);
    expect(dAfter).toBeLessThan(dBefore);
  });

  it('goes deeper from the stairs, opens the chest once, and tracks the daily depth', () => {
    const world = hatchedWorld(6);
    world.lastWallMs = Date.UTC(2026, 9, 13, 12);
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'enterDungeon', daily: true }, events);
    const run = world.dungeon!;
    const f1 = floorOf(run.seed, 1);
    // Chest: tap it from afar, walk there, it opens on arrival; a second tap does nothing.
    const shellsBefore = world.inventory.shells;
    applyCommand(world, { kind: 'dungeonGo', to: 'chest' }, events);
    expect(run.pending).toBe('chest');
    world.keeper.pos = { ...cellCentre(f1, f1.chest) };
    const opened = step(world, 200).filter((e) => e.kind === 'chestOpened');
    expect(opened.length).toBe(1);
    expect(world.inventory.shells).toBeGreaterThan(shellsBefore);
    expect(run.chestOpen).toBe(true);
    applyCommand(world, { kind: 'dungeonGo', to: 'chest' }, events);
    expect(run.pending).toBeNull();
    // Stairs down.
    applyCommand(world, { kind: 'dungeonGo', to: 'down' }, events);
    world.keeper.pos = { ...cellCentre(f1, f1.stairsDown!) };
    const down = step(world, 200).filter((e) => e.kind === 'descended');
    expect(down.length).toBe(1);
    expect(run.depth).toBe(2);
    expect(world.hollow.dailyDepth).toBe(2);
    const f2 = floorOf(run.seed, 2);
    expect(cellOf(f2, world.keeper.pos)).toEqual(f2.stairsUp);
    expect(run.chestOpen).toBe(false);
    // Today's request counts the floor.
    expect(
      world.quests.some((q) => q.template === 'hollow' && q.progress === 1) ||
        !world.quests.some((q) => q.template === 'hollow'),
    ).toBe(true);
    // The way home from floor 2 is the stairs up.
    applyCommand(world, { kind: 'dungeonGo', to: 'up' }, events);
    world.keeper.pos = { ...cellCentre(f2, f2.stairsUp) };
    step(world, 200);
    expect(world.location).toBe('grove');
    expect(world.hollow.best).toBe(2);
  });

  it('strays snatch Shells on contact and settle in the square when fed', () => {
    const world = hatchedWorld(8);
    world.inventory.fruit = 1;
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'enterDungeon', daily: false }, events);
    const run = world.dungeon!;
    run.graceUntilMs = 0; // past the arrival grace (R0142)
    expect(run.strays.length).toBeGreaterThan(0);
    const s = run.strays[0]!;
    world.keeper.pos = { x: s.pos.x + 0.3, z: s.pos.z };
    const before = world.inventory.shells;
    const startled = step(world, 200).filter((e) => e.kind === 'strayStartled');
    expect(startled.length).toBe(1);
    expect(world.inventory.shells).toBe(before - DUNGEON.straySnatch);
    expect(s.cooldownMs).toBeGreaterThan(0);
    // Feed another one (or the same once calm).
    s.cooldownMs = 0;
    world.keeper.pos = { x: s.pos.x + 0.5, z: s.pos.z };
    const out: SimEvent[] = [];
    applyCommand(world, { kind: 'feedStray', id: s.id }, out);
    const fed = out.find((e) => e.kind === 'strayFed');
    expect(fed && fed.kind === 'strayFed' && fed.ok).toBe(true);
    expect(world.inventory.fruit).toBe(0);
    expect(world.town.recruits.length).toBe(1);
    expect(run.strays.includes(s)).toBe(false);
    // Without fruit the ask is refused.
    const none: SimEvent[] = [];
    if (run.strays[0]) {
      applyCommand(world, { kind: 'feedStray', id: run.strays[0].id }, none);
      const e = none.find((x) => x.kind === 'strayFed');
      expect(e && e.kind === 'strayFed' && e.ok).toBe(false);
    }
  });

  it('scans the wild creature in its nook', () => {
    const world = hatchedWorld(9);
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'enterDungeon', daily: false }, events);
    const run = world.dungeon!;
    const w = run.wild[0]!;
    world.keeper.pos = { x: w.pos.x + 1, z: w.pos.z };
    const scanned = step(world, 200).filter((e) => e.kind === 'wildScanned');
    expect(scanned.length).toBe(1);
    expect(world.scans[w.species] ?? 0).toBeGreaterThan(0);
    expect(w.scanned).toBe(true);
  });

  it('survives a save underground and never counts during catch-up steps', () => {
    const world = hatchedWorld(10);
    const events: SimEvent[] = [];
    applyCommand(world, { kind: 'enterDungeon', daily: false }, events);
    const json = serialize(world, 0);
    const back = deserialize(json).world;
    expect(back.location).toBe('dungeon');
    expect(back.dungeon?.seed).toBe(world.dungeon?.seed);
    expect(floorOf(back.dungeon!.seed, back.dungeon!.depth)).toBe(
      floorOf(world.dungeon!.seed, world.dungeon!.depth),
    );
    // A coarse step moves no strays.
    const s = back.dungeon!.strays[0]!;
    const at = { ...s.pos };
    stepWorld(back, 60_000);
    expect(s.pos).toEqual(at);
    // A save that lost its run lands in the Grove.
    const lost = deserialize(json).world;
    lost.dungeon = null;
    const again = deserialize(serialize(lost, 0)).world;
    expect(again.location).toBe('grove');
  });
});
