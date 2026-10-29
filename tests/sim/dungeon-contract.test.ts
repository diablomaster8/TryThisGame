import { afterEach, describe, expect, it } from 'vitest';
import { ACTS, actStartDepth } from '../../src/config/dungeon-acts';
import { DUNGEON, SIM } from '../../src/config/tuning';
import {
  cellCentre,
  exploredMask,
  floorOf,
  revealAround,
  runFloor,
  WALL,
  type Cell,
  type Floor,
} from '../../src/sim/dungeon';
import { actFloor } from '../../src/sim/dungeon-acts';
import { setEncounterHandler } from '../../src/sim/dungeon-encounters';
import { fieldFloor, sideFloor } from '../../src/sim/dungeon-outdoor';
import { townFloor } from '../../src/sim/dungeon-towns';
import { hatch } from '../../src/sim/lifecycle';
import type { DungeonRun, SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// The Hollow's contract (R0169, DUNG-67), over every generator and every kind of place:
// the stairs, the chest and every find stand on open ground the stairs up can reach; the
// explored mask survives its string form; and `dungeonGo` walks the Keeper there. The frozen
// version-1 and -2 outputs are pinned in dungeon-v2-snapshot.test.ts, a save mid-run in
// dungeon.test.ts ("survives a save underground").

function reach(f: Floor, from: Cell): Uint8Array {
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

/** Every floor kind the game makes, a few seeds each. */
function floors(): Array<[string, Floor]> {
  const out: Array<[string, Floor]> = [];
  for (const seed of [11, 4242, 90_001])
    for (const version of [1, 2, 3, 4])
      for (const depth of [1, 4, 9])
        out.push([`v${version} ${seed}/${depth}`, floorOf(seed, depth, version)]);
  for (let act = 0; act < ACTS.length; act++) {
    for (let level = 0; level < ACTS[act]!.levels.length; level++)
      out.push([`act ${act}.${level + 1}`, actFloor(77, act, actStartDepth(act) + level, 4)]);
    out.push([`town ${act}`, townFloor(act)], [`field ${act}`, fieldFloor(77, act)]);
    out.push([`side ${act}`, sideFloor(77, act, 0)]);
  }
  return out;
}

afterEach(() => setEncounterHandler(null));

describe('the dungeon contract (R0169)', () => {
  it('stairs, chest and finds lie on open ground the stairs up can reach', () => {
    for (const [name, f] of floors()) {
      const seen = reach(f, f.stairsUp);
      const ok = (c: Cell) =>
        f.cells[c.y * f.cols + c.x] !== WALL && seen[c.y * f.cols + c.x] === 1;
      expect(ok(f.stairsUp), `${name} stairs up`).toBe(true);
      if (f.stairsDown) expect(ok(f.stairsDown), `${name} stairs down`).toBe(true);
      expect(ok(f.chest), `${name} chest`).toBe(true);
      for (const l of f.loot) expect(ok(l.cell), `${name} ${l.id}`).toBe(true);
    }
  });

  it('the explored mask survives its string form', () => {
    const f = floorOf(4242, 4, 4);
    const run = { explored: '' } as DungeonRun;
    revealAround(run, f, f.stairsUp);
    revealAround(run, f, f.chest);
    const mask = exploredMask(run, f);
    const copy = { explored: run.explored } as DungeonRun;
    expect(Array.from(exploredMask(copy, f))).toEqual(Array.from(mask));
    expect(mask.reduce((a, b) => a + b, 0)).toBeGreaterThan(0);
  });

  it('dungeonGo walks the Keeper to the chest and opens it', () => {
    setEncounterHandler(() => 'fled');
    const world: World = createWorld(8, 0);
    for (const n of world.nubbins) hatch(n, [], 0);
    applyCommand(world, { kind: 'enterDungeon', daily: false }, []);
    const run = world.dungeon!;
    // Packs stay home: this is about the walk, not a fight.
    run.packs = [];
    const f = runFloor(world)!;
    applyCommand(world, { kind: 'dungeonGo', to: 'chest' }, []);
    const events: SimEvent[] = [];
    const chest = cellCentre(f, f.chest);
    for (let t = 0; t < 120_000 && !run.chestOpen; t += SIM.stepMs)
      events.push(...stepWorld(world, SIM.stepMs));
    expect(run.chestOpen).toBe(true);
    expect(events.some((e) => e.kind === 'chestOpened')).toBe(true);
    const k = world.keeper.pos;
    expect(Math.hypot(k.x - chest.x, k.z - chest.z)).toBeLessThanOrEqual(DUNGEON.useRadius + 0.5);
  });
});
