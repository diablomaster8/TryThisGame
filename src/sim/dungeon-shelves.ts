/**
 * Elevation that matters (R0191, DUNG-48): raised shelves on version-4 floors. A shelf is a
 * small block of floor lifted two steps above its surroundings, with a find on top. Its
 * edge is a ledge: the Keeper can drop off it anywhere but can only get up with a jump (the
 * feet must be `climbHeight` off the ground as they cross the lip), or once a floor with a
 * lift from a party Nubbin strong at Fly. Party Nubbins fetch from a shelf only if they fly.
 *
 * Shelves are always side treasure: a shelf is only placed where walling it off leaves every
 * other cell reachable on foot, so the critical path never needs a jump. Gaps (R0031,
 * dungeon-gaps.ts) already give the one- and two-cell jumps and flag double-jump nooks.
 * Pure and seeded: the pass has its own stream, so floors made before it keep their cells.
 */
import { HOLLOW_R9D } from '../config/dungeon-r9-d';
import { DUNGEON } from '../config/tuning';
import { cellDist, cellOf, FLOOR, WALL, runFloor, type Cell, type Floor } from './dungeon';
import { busyCells, reachMask } from './dungeon-gaps';
import { Rng } from './rng';
import { levelOf } from './stats';
import { NUBBIN_TYPES, type Nubbin, type SimEvent, type World } from './types';

const S = HOLLOW_R9D.shelves;

export interface Shelf {
  cells: Cell[];
  /** The id of the find on top (in `Floor.loot`). */
  find: string;
}

const masks = new WeakMap<Floor, Int16Array>();

/** Each cell's shelf index, or -1. */
function shelfMask(f: Floor): Int16Array {
  let m = masks.get(f);
  if (!m) {
    m = new Int16Array(f.cols * f.rows).fill(-1);
    (f.shelves ?? []).forEach((s, i) => {
      for (const c of s.cells) m![c.y * f.cols + c.x] = i;
    });
    masks.set(f, m);
  }
  return m;
}

/** The shelf a cell is on, or -1. */
export function shelfAt(f: Floor, c: Cell): number {
  if (!f.shelves?.length || c.x < 0 || c.y < 0 || c.x >= f.cols || c.y >= f.rows) return -1;
  return shelfMask(f)[c.y * f.cols + c.x]!;
}

function countOf(m: Uint8Array): number {
  let n = 0;
  for (let i = 0; i < m.length; i++) n += m[i]!;
  return n;
}

/**
 * Lift a few blocks of a version-4 floor into shelves, each with a find on top. Only where
 * walling the block off strands nothing else (checked by a walk without jumps). Mutates
 * and returns the floor.
 */
export function raiseShelves(f: Floor, seed: number, depth: number): Floor {
  if (f.version < 4 || depth < S.fromDepth || f.zone) return f;
  const rng = Rng.fromSeed((seed * 131 + depth * 977 + 0x5e1f) >>> 0);
  const want = rng.int(S.count[0], S.count[1]);
  const busy = busyCells(f);
  const { cols, rows, cells } = f;
  const base = countOf(reachMask(f, f.stairsUp, false));
  const keepAway = [f.stairsUp, ...(f.stairsDown ? [f.stairsDown] : [])];
  const shelves: Shelf[] = [];
  for (let t = 0; t < S.tries && shelves.length < want; t++) {
    const [w, h] = rng.pick(S.sizes);
    const x0 = rng.int(2, cols - w - 3);
    const y0 = rng.int(2, rows - h - 3);
    const block: Cell[] = [];
    let ok = true;
    for (let y = y0; y < y0 + h && ok; y++)
      for (let x = x0; x < x0 + w && ok; x++) {
        const i = y * cols + x;
        if (cells[i] !== FLOOR || busy.has(i)) ok = false;
        else block.push({ x, y });
      }
    if (!ok) continue;
    const mid = block[0]!;
    if (keepAway.some((c) => cellDist(c, mid) < S.fromStairs)) continue;
    if (shelves.some((s) => cellDist(s.cells[0]!, mid) < S.spacing)) continue;
    // Wall it off for a moment: everything else must still be reachable on foot.
    for (const c of block) cells[c.y * cols + c.x] = WALL;
    const left = countOf(reachMask(f, f.stairsUp, false));
    for (const c of block) cells[c.y * cols + c.x] = FLOOR;
    if (left !== base - block.length) continue;
    const top = block[Math.floor(block.length / 2)]!;
    const id = `loot-shelf${shelves.length}`;
    const essence = rng.chance(0.6);
    f.loot.push({
      id,
      kind: essence ? 'essence' : 'stone',
      cell: top,
      amount: 1,
      param: essence ? rng.pick(NUBBIN_TYPES) : null,
    });
    shelves.push({ cells: block, find: id });
    for (const c of block) busy.add(c.y * cols + c.x);
  }
  if (shelves.length === 0) return f;
  f.shelves = shelves;
  masks.delete(f);
  // The lift you can see: the shelf stands two steps over its own cells.
  const rise = S.riseSteps * DUNGEON.elev.step;
  for (const s of shelves) for (const c of s.cells) f.elevation[c.y * cols + c.x]! += rise;
  return f;
}

/** A party Nubbin strong enough at Fly to lift the Keeper or fetch from a shelf. */
export function flier(world: World, ids: readonly string[]): Nubbin | null {
  for (const id of ids) {
    const n = world.nubbins.find((x) => x.id === id);
    if (n && levelOf(n.stats.fly.points) >= HOLLOW_R9D.fly.minLevel) return n;
  }
  return null;
}

/** Whether a Nubbin may fetch loot on `cell`: shelf finds are for fliers only. */
export function mayFetchShelf(f: Floor, n: Nubbin, cell: Cell): boolean {
  return shelfAt(f, cell) < 0 || levelOf(n.stats.fly.points) >= HOLLOW_R9D.fly.minLevel;
}

/**
 * Keep a walking Keeper off a shelf it has not jumped onto (called after the Hollow's wall
 * collision). Dropping off is always fine. Once a floor, a flying party Nubbin lifts the
 * Keeper up instead. Otherwise the step slides along whichever axis stays off the shelf.
 */
export function holdAtShelves(world: World, fromX: number, fromZ: number, events: SimEvent[]) {
  const run = world.location === 'dungeon' ? world.dungeon : null;
  const f = run ? runFloor(world) : null;
  if (!run || !f?.shelves?.length) return;
  const k = world.keeper;
  if (k.pos.x === fromX && k.pos.z === fromZ) return;
  const from = shelfAt(f, cellOf(f, { x: fromX, z: fromZ }));
  const to = shelfAt(f, cellOf(f, k.pos));
  if (to < 0 || to === from || k.y >= S.climbHeight) return;
  if (run.flyLiftDepth !== run.depth) {
    const n = flier(world, run.party);
    if (n) {
      run.flyLiftDepth = run.depth;
      events.push({ kind: 'hollowFlyLift', name: n.name });
      return;
    }
  }
  const off = (x: number, z: number) =>
    shelfAt(f, cellOf(f, { x, z })) < 0 || shelfAt(f, cellOf(f, { x, z })) === from;
  if (off(k.pos.x, fromZ)) k.pos.z = fromZ;
  else if (off(fromX, k.pos.z)) k.pos.x = fromX;
  else {
    k.pos.x = fromX;
    k.pos.z = fromZ;
  }
}
