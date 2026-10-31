import { describe, expect, it } from 'vitest';
import { SIM } from '../../src/config/tuning';
import { ACTS, actStartDepth } from '../../src/config/dungeon-acts';
import {
  cellCentre,
  FLOOR,
  floorOf,
  runFloor,
  WALL,
  type Cell,
  type Floor,
} from '../../src/sim/dungeon';
import { actBossDepth, actFloor } from '../../src/sim/dungeon-acts';
import { reachable, sealOpen, withSeals, type Seal } from '../../src/sim/dungeon-secrets';
import { BLOCK_LAYOUTS, layoutOf, puzzleHint, solveBlocks } from '../../src/sim/dungeon-puzzles';
import { hatch } from '../../src/sim/lifecycle';
import type { DungeonRun, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// Lane B round 8, "floors": secrets, puzzles, part shortcuts, the boss door.

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

function fakeRun(seals: string[] = []): DungeonRun {
  return { seals } as unknown as DungeonRun;
}

/** Floors to look at: the Deep Hollow and every act's levels, a few seeds each. */
let made: Floor[] | null = null;
function floors(): Floor[] {
  if (made) return made;
  const out: Floor[] = (made = []);
  for (let seed = 1; seed <= 12; seed++) {
    out.push(floorOf(seed * 101, 3, 4), floorOf(seed * 101, 12, 4));
    for (let act = 0; act < ACTS.length; act++)
      out.push(actFloor(seed * 7, act, actStartDepth(act) + (seed % ACTS[act]!.levels.length), 4));
  }
  return out;
}

const key = (c: Cell) => `${c.x},${c.y}`;

/** A secret room's cells past its mouth. */
function pocketCells(s: Seal): Cell[] {
  const door = new Set(s.door.map(key));
  return s.region.filter((c) => !door.has(key(c)));
}

/** Open (not rock) cells reachable from the stairs up. */
function reachOpen(f: Floor): Set<string> {
  const m = reachable(f);
  const out = new Set<string>();
  m.forEach((v, i) => v && out.add(`${i % f.cols},${Math.floor(i / f.cols)}`));
  return out;
}

describe('secret rooms (R0182)', { timeout: 60_000 }, () => {
  const all = floors();
  it('0–2 per level, on about a third of levels or more', () => {
    const counts = all.map((f) => (f.seals ?? []).filter((s) => s.kind === 'secret').length);
    expect(Math.max(...counts)).toBeLessThanOrEqual(2);
    const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
    expect(mean).toBeGreaterThan(0.3);
    expect(mean).toBeLessThan(1.4);
  });

  it('are solid rock until found, then reachable only through their door', () => {
    let checked = 0;
    for (const f of all)
      for (const s of f.seals ?? []) {
        if (s.kind !== 'secret') continue;
        const closed = withSeals(fakeRun(), f);
        expect(s.region.every((c) => closed.cells[c.y * f.cols + c.x] === WALL)).toBe(true);
        expect(closed.loot.some((l) => s.region.some((c) => key(c) === key(l.cell)))).toBe(false);
        const open = withSeals(fakeRun([s.id]), f);
        expect(open).not.toBe(closed);
        expect(withSeals(fakeRun([s.id]), f)).toBe(open);
        const r = reachOpen(open);
        expect(s.region.every((c) => r.has(key(c)))).toBe(true);
        // Shut the mouth again by hand: nothing past it is reachable any other way.
        const cut = { ...open, cells: open.cells.slice() };
        for (const c of s.door) cut.cells[c.y * f.cols + c.x] = WALL;
        const shut = reachOpen(cut);
        expect(pocketCells(s).length).toBeGreaterThan(0);
        expect(pocketCells(s).some((c) => shut.has(key(c)))).toBe(false);
        // Nothing else was cut off by the closed room.
        expect(reachOpen(closed).size).toBe(reachOpen(open).size - s.region.length);
        // Its stash appears with it.
        for (const l of s.loot) expect(open.loot).toContain(l);
        checked++;
      }
    expect(checked).toBeGreaterThan(10);
  });

  it('open when the Keeper leans on the cracked wall for a second', () => {
    let tried = 0;
    for (let seed = 1; seed < 40 && tried < 2; seed++) {
      const world = underground(seed);
      const run = world.dungeon!;
      const f = runFloor(world)!;
      const s = f.seals?.find((x) => x.kind === 'secret');
      if (!s) continue;
      tried++;
      // Nobody in the party sees hidden things, so it takes the lean.
      for (const n of world.nubbins) n.stats.run.points = 0;
      const at = cellCentre(f, s.front);
      const door = cellCentre(f, s.door[0]!);
      world.keeper.pos = { x: at.x, z: at.z };
      run.packs = [];
      expect(sealOpen(run, s)).toBe(false);
      world.keeper.input = { x: Math.sign(door.x - at.x), z: Math.sign(door.z - at.z) };
      const ev = step(world, 1300);
      world.keeper.input = { x: 0, z: 0 };
      expect(ev.some((e) => e.kind === 'hollowSecret' && e.how === 'bump')).toBe(true);
      expect(sealOpen(run, s)).toBe(true);
      const g = runFloor(world)!;
      expect(g.cells[s.door[0]!.y * g.cols + s.door[0]!.x]).toBe(FLOOR);
    }
    expect(tried).toBe(2);
  });
});

describe('puzzle rooms (R0202)', { timeout: 60_000 }, () => {
  it('every authored push-block layout is solvable from the doorway', () => {
    expect(BLOCK_LAYOUTS.length).toBe(12);
    BLOCK_LAYOUTS.forEach((_, i) => {
      const { blocks, targets } = layoutOf(i);
      expect(blocks.length).toBe(targets.length);
      expect(solveBlocks(i, blocks, 0), `layout ${i}`).not.toBeNull();
    });
  });

  it('some levels get one, off the way down; its chest appears only once solved', () => {
    const all = floors();
    const with_ = all.filter((f) => f.seals?.some((s) => s.kind === 'puzzle'));
    expect(with_.length).toBeGreaterThan(all.length * 0.25);
    const kinds = new Set<string>();
    for (const f of with_) {
      const s = f.seals!.find((x) => x.kind === 'puzzle')!;
      const p = s.puzzle!;
      kinds.add(p.kind);
      expect(['hub', 'treasure']).toContain(
        f.layout!.pieces.find(
          (q) =>
            p.area.x >= q.at.x &&
            p.area.y >= q.at.y &&
            p.area.x < q.at.x + q.size[0] &&
            p.area.y < q.at.y + q.size[1],
        )?.role,
      );
      // Every patch cell but the pillars is reachable in the run's floor, and so are the stairs.
      const view = withSeals(fakeRun(), f);
      const r = reachOpen(view);
      const rock = new Set(p.pillars.map(key));
      expect(
        p.grid.every((c, g) => p.closed.includes(g) || rock.has(key(c)) || r.has(key(c))),
      ).toBe(true);
      if (f.stairsDown) expect(r.has(key(f.stairsDown))).toBe(true);
      for (const l of s.loot) expect(view.loot).not.toContain(l);
      for (const l of s.loot) expect(withSeals(fakeRun([s.id]), f).loot).toContain(l);
    }
    expect(kinds.size).toBe(3);
  });

  it('plates open the chest once all are down; kid mode hints after 30 s', () => {
    let done = 0;
    for (let seed = 1; seed < 200 && done < 1; seed++) {
      const world = underground(seed);
      const run = world.dungeon!;
      const f = runFloor(world)!;
      const s = f.seals?.find((x) => x.puzzle?.kind === 'plates' && !x.puzzle.shortcut);
      if (!s) continue;
      done++;
      run.packs = [];
      const p = s.puzzle!;
      const to = (c: Cell) => {
        const at = cellCentre(f, c);
        world.keeper.pos = { x: at.x, z: at.z };
        world.keeper.moveTarget = null;
      };
      to(p.grid[24]!);
      world.edu = null;
      world.settings.bouts = 'gentle';
      step(world, 31_000);
      expect(p.plates).toContainEqual(puzzleHint(world, run, f));
      for (const c of p.plates!) {
        to(c);
        step(world, 300);
      }
      expect(sealOpen(run, s)).toBe(true);
    }
    expect(done).toBe(1);
  });

  it('torches lit in the mural order open the chest; a wrong one puts them out', () => {
    let done = 0;
    for (let seed = 1; seed < 200 && done < 1; seed++) {
      const world = underground(seed);
      const run = world.dungeon!;
      const f = runFloor(world)!;
      const s = f.seals?.find((x) => x.puzzle?.kind === 'torches' && !x.puzzle.shortcut);
      if (!s) continue;
      done++;
      run.packs = [];
      const p = s.puzzle!;
      const visit = (c: Cell) => {
        const at = cellCentre(f, c);
        world.keeper.pos = { x: at.x, z: at.z };
        step(world, 200);
        const mid = cellCentre(f, p.grid[24]!);
        world.keeper.pos = { x: mid.x, z: mid.z };
        step(world, 200);
      };
      const order = p.order!;
      visit(p.torches![order[1]!]!);
      expect(run.puzzles?.[s.id]?.[0] ?? 0).toBe(0);
      for (const t of order) visit(p.torches![t]!);
      expect(sealOpen(run, s)).toBe(true);
    }
    expect(done).toBe(1);
  });

  it('blocks pushed onto their targets open the chest', () => {
    let done = 0;
    for (let seed = 1; seed < 300 && done < 1; seed++) {
      const world = underground(seed);
      const run = world.dungeon!;
      const f = runFloor(world)!;
      const s = f.seals?.find((x) => x.puzzle?.kind === 'blocks' && !x.puzzle.shortcut);
      if (!s) continue;
      done++;
      run.packs = [];
      const p = s.puzzle!;
      const path = solveBlocks(p.layout!, layoutOf(p.layout!).blocks, 0)!;
      const go = (k: number) => {
        const at = cellCentre(f, p.grid[k]!);
        world.keeper.pos = { x: at.x, z: at.z };
        world.keeper.moveTarget = null;
        step(world, 100);
      };
      go(0);
      for (const k of path) go(k);
      expect(sealOpen(run, s)).toBe(true);
    }
    expect(done).toBe(1);
  });
});

describe('critter-part shortcuts (R0212)', { timeout: 60_000 }, () => {
  it('the part spot opens the chest only with the matching part in the party', () => {
    const part = { swim: 'seal', fly: 'parrot', power: 'gorilla' } as const;
    let done = 0;
    for (let seed = 1; seed < 300 && done < 3; seed++) {
      const world = underground(seed);
      const run = world.dungeon!;
      const f = runFloor(world)!;
      const s = f.seals?.find((x) => x.puzzle?.shortcut);
      if (!s) continue;
      run.packs = [];
      const sc = s.puzzle!.shortcut!;
      for (const n of world.nubbins)
        for (const k of Object.keys(n.parts)) (n.parts as Record<string, string | null>)[k] = null;
      const at = cellCentre(f, sc.spot);
      world.keeper.pos = { x: at.x, z: at.z };
      step(world, 500);
      // Without the part: the long way round (the puzzle itself) is still to do.
      expect(sealOpen(run, s)).toBe(false);
      const friend = world.nubbins.find((n) => run.party.includes(n.id))!;
      friend.parts.arms = part[sc.part];
      const ev = step(world, 300);
      expect(sealOpen(run, s)).toBe(true);
      expect(ev.some((e) => e.kind === 'hollowPuzzle' && e.what === 'shortcut')).toBe(true);
      done++;
    }
    expect(done).toBe(3);
  });
});

describe('the boss door (R0160)', { timeout: 60_000 }, () => {
  it('every act boss level has a door that seals behind the Keeper and opens after', () => {
    for (let act = 0; act < ACTS.length; act++)
      for (let seed = 1; seed <= 10; seed++) {
        const f = actFloor(seed, act, actBossDepth(act), 4);
        const s = f.seals?.find((x) => x.kind === 'boss');
        expect(s, `act ${act} seed ${seed}`).toBeDefined();
        // Open at the start, and the arena is reachable through it.
        expect(reachOpen(f).has(key(s!.front))).toBe(true);
        const shut = withSeals(fakeRun([s!.id]), f);
        expect(s!.door.every((c) => shut.cells[c.y * shut.cols + c.x] === WALL)).toBe(true);
        const r = reachOpen(shut);
        expect(r.has(key(f.layout!.boss ?? f.stairsDown!))).toBe(false);
      }
  });

  it('in play: seals once the Keeper is inside, opens once the boss is beaten', () => {
    const world = underground(3);
    const run = world.dungeon!;
    run.act = 0;
    run.depth = actBossDepth(0);
    run.genVersion = 4;
    const f = runFloor(world)!;
    const s = f.seals!.find((x) => x.kind === 'boss')!;
    const boss = f.packs!.find((p) => p.kind === 'boss')!;
    // Keep the boss home and quiet: this is only about the door.
    run.packs = [
      { id: boss.id, pos: { x: 999, z: 999 }, state: 'idle', target: null, noticedMs: -1 },
    ];
    const r = s.room!;
    const mid = cellCentre(f, { x: r.x + Math.floor(r.w / 2), y: r.y + Math.floor(r.h / 2) });
    world.keeper.pos = { x: mid.x, z: mid.z };
    world.keeper.moveTarget = null;
    const ev = step(world, 200);
    expect(ev.some((e) => e.kind === 'hollowBossDoor' && e.sealed)).toBe(true);
    const shut = runFloor(world)!;
    expect(s.door.every((c) => shut.cells[c.y * shut.cols + c.x] === WALL)).toBe(true);
    run.packs[0]!.state = 'beaten';
    const ev2 = step(world, 200);
    expect(ev2.some((e) => e.kind === 'hollowBossDoor' && !e.sealed)).toBe(true);
    expect(runFloor(world)).toBe(f);
  });

  it('every level that gets seals still has its stairs reachable', () => {
    for (const f of floors()) {
      const open = reachable(withSeals(fakeRun(), f));
      if (f.stairsDown) expect(open[f.stairsDown.y * f.cols + f.stairsDown.x]).toBe(1);
    }
  });
});
