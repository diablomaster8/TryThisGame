import { afterEach, describe, expect, it } from 'vitest';
import { ACTS } from '../../src/config/dungeon-acts';
import { HUB_MAPS } from '../../src/config/dungeon-hubs-r10b2';
import { DUNGEON, HOLLOW_ZONES, KEEPER, SIM } from '../../src/config/tuning';
import { FIELD_R10 } from '../../src/config/tuning-r10b2';
import { bandForFloor } from '../../src/render/cave-bands';
import { sectorWindow } from '../../src/render/field-sectors';
import { cellCentre, runFloor, WALL, type Cell, type Floor } from '../../src/sim/dungeon';
import { setEncounterHandler } from '../../src/sim/dungeon-encounters';
import { waypointCell } from '../../src/sim/dungeon-levels';
import { fieldFloor } from '../../src/sim/dungeon-outdoor';
import { townBuy, townFloor, useStash } from '../../src/sim/dungeon-towns';
import { hatch } from '../../src/sim/lifecycle';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

// Lane B round 10, helper b2: each act's own camp (R0152) and the fields' walk (R0147).

function keeperWorld(seed = 5): World {
  const world = createWorld(seed, 0);
  for (const n of world.nubbins) hatch(n, [], 0);
  // Every act open, so each camp can be visited.
  world.hollow.acts = ACTS.map(() => ({ bossDefeated: true, deepest: 3 }));
  return world;
}

function step(world: World, ms: number): SimEvent[] {
  const out: SimEvent[] = [];
  for (let t = 0; t < ms; t += SIM.stepMs) out.push(...stepWorld(world, SIM.stepMs));
  return out;
}

/** Shortest walk in cells (eight ways, no corner cutting), anything but wall is ground. */
function walkCells(f: Floor, a: Cell, b: Cell): number {
  const n = f.cols * f.rows;
  const d = new Float64Array(n).fill(Infinity);
  const open = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < f.cols && y < f.rows && f.cells[y * f.cols + x] !== WALL;
  const heap: Array<[number, number]> = [[0, a.y * f.cols + a.x]];
  d[a.y * f.cols + a.x] = 0;
  const push = (e: [number, number]) => {
    heap.push(e);
    for (let i = heap.length - 1; i > 0;) {
      const p = (i - 1) >> 1;
      if (heap[p]![0] <= heap[i]![0]) break;
      [heap[p], heap[i]] = [heap[i]!, heap[p]!];
      i = p;
    }
  };
  const pop = (): [number, number] => {
    const top = heap[0]!;
    const last = heap.pop()!;
    if (heap.length) {
      heap[0] = last;
      for (let i = 0; ;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < heap.length && heap[l]![0] < heap[m]![0]) m = l;
        if (r < heap.length && heap[r]![0] < heap[m]![0]) m = r;
        if (m === i) break;
        [heap[m], heap[i]] = [heap[i]!, heap[m]!];
        i = m;
      }
    }
    return top;
  };
  while (heap.length) {
    const [dd, k] = pop();
    if (dd > d[k]!) continue;
    const x = k % f.cols;
    const y = (k - x) / f.cols;
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        if ((!dx && !dy) || !open(x + dx, y + dy)) continue;
        if (dx && dy && (!open(x + dx, y) || !open(x, y + dy))) continue;
        const j = (y + dy) * f.cols + x + dx;
        const nd = dd + Math.hypot(dx, dy);
        if (nd < d[j]!) {
          d[j] = nd;
          push([nd, j]);
        }
      }
  }
  return d[b.y * f.cols + b.x]!;
}

afterEach(() => setEncounterHandler(null));

describe('each act has its own camp (R0152)', () => {
  it('five different 40×30 maps, each with every service once', () => {
    const seen = new Set<string>();
    for (const def of ACTS) {
      const map = HUB_MAPS[def.id];
      expect(map.length).toBe(30);
      for (const row of map) expect(row.length).toBe(40);
      seen.add(map.join('\n'));
      for (const g of 'PGWSVC$HQ')
        expect(map.join('').split(g).length - 1, `${def.id} ${g}`).toBe(1);
    }
    expect(seen.size).toBe(ACTS.length);
  });

  it('lanterns hang on a wall face', () => {
    for (let act = 0; act < ACTS.length; act++) {
      const f = townFloor(act);
      for (const t of f.torches) expect(f.cells[(t.y - 1) * f.cols + t.x]).toBe(WALL);
    }
  });

  it('each camp loads, every service is within 15 s of walking from the stone, nothing attacks', () => {
    for (let act = 0; act < ACTS.length; act++) {
      const world = keeperWorld(11 + act);
      const out: SimEvent[] = [];
      applyCommand(world, { kind: 'enterTown', act }, out);
      expect(world.dungeon!.zone).toBe('town');
      const f = runFloor(world)!;
      expect(f).toBe(townFloor(act));
      expect(f.packs).toBeUndefined();
      const targets = [...f.services!.map((s) => s.cell), f.stairsDown!, f.stairsUp];
      for (const c of targets) {
        world.keeper.pos = { ...cellCentre(f, waypointCell(f)) };
        const goal = cellCentre(f, c);
        applyCommand(world, { kind: 'moveKeeperTo', pos: goal }, out);
        let ms = 0;
        while (ms < 15_000) {
          step(world, 500);
          ms += 500;
          const k = world.keeper.pos;
          if (Math.hypot(k.x - goal.x, k.z - goal.z) < HOLLOW_ZONES.reach) break;
        }
        expect(ms, `act ${act} service at ${c.x},${c.y}`).toBeLessThan(15_000);
        expect(world.dungeon!.encounter).toBeUndefined();
      }
    }
  });

  it('a camp visit writes only the Hollow, the purse and the Keeper, never a story world', () => {
    const world = keeperWorld(3);
    world.inventory.shells = 500;
    const before = JSON.parse(JSON.stringify(world)) as Record<string, unknown>;
    const out: SimEvent[] = [];
    applyCommand(world, { kind: 'enterTown', act: 3 }, out);
    const f = runFloor(world)!;
    for (const s of f.services!) {
      world.keeper.pos = { ...cellCentre(f, s.cell) };
      if (s.kind === 'stash') useStash(world, 50, out);
      if (s.kind === 'vendor') townBuy(world, 'fruit', out);
      step(world, 300);
    }
    const after = JSON.parse(JSON.stringify(world)) as Record<string, unknown>;
    const changed = Object.keys({ ...before, ...after }).filter(
      (k) => JSON.stringify(before[k]) !== JSON.stringify(after[k]),
    );
    expect(changed).toContain('hollow');
    // No story world, campaign or storyline state moves (the Grove's own clock may tick on).
    const story = /atlas|arcade|multiverse|neopia|campaign|story|sunny|quest/i;
    expect(changed.filter((k) => story.test(k))).toEqual([]);
  });

  it('each act wears its own open sky in camp and fields; Act I keeps the meadow', () => {
    const skies = new Set(ACTS.map((_, act) => bandForFloor(townFloor(act), 1).background));
    expect(skies.size).toBe(ACTS.length);
    expect(bandForFloor(townFloor(0), 1).background).toBe(HOLLOW_ZONES.openBand.background);
    // The same object every time, so the 3D side never rebuilds for a band change.
    expect(bandForFloor(townFloor(2), 1)).toBe(bandForFloor(fieldFloor(9, 2), 4));
  });
});

describe('the fields are a 2–3 minute walk (R0147)', () => {
  it('entry to the far gate takes 2 to 3 minutes at walking pace, every act', () => {
    for (let s = 1; s <= 4; s++)
      for (let act = 0; act < ACTS.length; act++) {
        const f = fieldFloor(s * 7919, act);
        const sec = (walkCells(f, f.stairsUp, f.stairsDown!) * DUNGEON.cell) / KEEPER.speed;
        expect(sec, `seed ${s} act ${act}`).toBeGreaterThanOrEqual(FIELD_R10.walkSec[0]);
        expect(sec, `seed ${s} act ${act}`).toBeLessThanOrEqual(FIELD_R10.walkSec[1]);
        for (const m of f.mouths ?? []) expect(walkCells(f, f.stairsUp, m)).toBeLessThan(Infinity);
      }
  });

  it('the 3×3 sector window around the Keeper', () => {
    const f = fieldFloor(77, 0);
    // 128×96 cells in 32-cell sectors: 4 columns of 3.
    const w = sectorWindow(f.cols, f.rows, FIELD_R10.sector, 0, 0);
    expect(w).toEqual({ sx0: 0, sx1: 1, sy0: 0, sy1: 1 });
    const mid = sectorWindow(f.cols, f.rows, FIELD_R10.sector, 70, 50);
    expect(mid).toEqual({ sx0: 1, sx1: 3, sy0: 0, sy1: 2 });
  });
});
