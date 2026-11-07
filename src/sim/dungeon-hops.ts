/**
 * Elevation that matters, part two (R0191, DUNG-48): hop spots and hop routing.
 *
 * Hop spots are shortcuts: a thin rock wall between two passages is opened into a pit two or
 * three cells wide. Two cells take a jump; three take the double jump, and the floor flags
 * those (`Hop.double`). A hop is only cut where both sides are already joined on foot by a
 * much longer way round, so the critical path never needs one.
 *
 * Hop routing: with Auto-hop on, a tap walk underground plans over walking steps, climbs onto
 * a raised shelf (`dungeon-shelves.ts`) and jumps over pits of one to three cells, each jump
 * dearer than its length on foot so a short walk round still wins. The walker gets the first
 * jump on that plan: walk to the take-off spot, then jump for the landing (`hopWaypoint`).
 * Pure sim; plans and hop state are runtime only, never saved.
 */
import { R10B4 } from '../config/tuning-more/dungeon-champions-wires';
import {
  cellAt,
  cellCentre,
  cellDist,
  cellOf,
  CHASM,
  FLOOR,
  WALL,
  WATER,
  type Cell,
  type Floor,
} from './dungeon';
import { busyCells, reachMask } from './dungeon-gaps';
import { keeperWaypoint, navMask } from './dungeon-nav';
import { shelfAt } from './dungeon-shelves';
import { autoHopOn } from './nav';
import { keeperPerks } from './perks';
import { Rng } from './rng';
import type { Vec2, World } from './types';

const H = R10B4.hops;
const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;

export interface Hop {
  /** Dry take-off and landing cells, and the pit cells between them. */
  from: Cell;
  to: Cell;
  cells: Cell[];
  /** Three cells of pit: the double jump. */
  double: boolean;
}

/** Walking steps from `a` to every cell (−1 where it cannot walk), 4-way over dry floor. */
export function walkSteps(f: Floor, a: Cell): Int32Array {
  const d = new Int32Array(f.cols * f.rows).fill(-1);
  const q = new Int32Array(f.cols * f.rows);
  let n = 0;
  const s = a.y * f.cols + a.x;
  if (f.cells[s] !== FLOOR) return d;
  d[s] = 0;
  q[n++] = s;
  for (let h = 0; h < n; h++) {
    const i = q[h]!;
    const x = i % f.cols;
    const y = (i - x) / f.cols;
    for (const [dx, dy] of DIRS) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= f.cols || ny >= f.rows) continue;
      const j = ny * f.cols + nx;
      if (d[j]! >= 0 || f.cells[j] !== FLOOR) continue;
      d[j] = d[i]! + 1;
      q[n++] = j;
    }
  }
  return d;
}

/**
 * Opens one or two hop spots on a version-4 floor (mutates `f.cells`, sets `f.hops`). Each
 * turns a straight run of two or three wall cells into pit, between dry cells the stairs
 * already reach on foot by at least `minSaving` more steps. Its own seeded stream.
 */
export function cutHops(f: Floor, seed: number, depth: number): Floor {
  if (f.version < 4 || depth < H.fromDepth || f.zone) return f;
  const rng = Rng.fromSeed(`${seed}:${depth}:hops`);
  const want = rng.int(H.count[0], H.count[1]);
  const busy = busyCells(f);
  // Reached on foot with every seal's door shut, so a hop never slips past a door (the boss's
  // arena, a puzzle room) into what it closes.
  const shut = f.cells.slice();
  for (const s of f.seals ?? []) for (const c of s.door) shut[c.y * f.cols + c.x] = WALL;
  const walk = reachMask({ ...f, cells: shut }, f.stairsUp, false);
  const dry = (x: number, y: number) => {
    const i = y * f.cols + x;
    return cellAt(f, x, y) === FLOOR && walk[i] === 1 && !busy.has(i) && shelfAt(f, { x, y }) < 0;
  };
  const cands: Hop[] = [];
  for (let y = 1; y < f.rows - 1; y++)
    for (let x = 1; x < f.cols - 1; x++) {
      if (!dry(x, y)) continue;
      // Right and down only, so each run is found once.
      for (const [dx, dy] of [
        [1, 0],
        [0, 1],
      ] as const)
        for (let n = 2; n <= 3; n++) {
          const cells: Cell[] = [];
          for (let k = 1; k <= n; k++) cells.push({ x: x + dx * k, y: y + dy * k });
          const to = { x: x + dx * (n + 1), y: y + dy * (n + 1) };
          if (to.x >= f.cols - 1 || to.y >= f.rows - 1) continue;
          if (!cells.every((c) => cellAt(f, c.x, c.y) === WALL)) continue;
          // A thin wall only: rock on both flanks, so the pit opens onto nothing else.
          if (
            !cells.every(
              (c) =>
                cellAt(f, c.x + dy, c.y + dx) === WALL && cellAt(f, c.x - dy, c.y - dx) === WALL,
            )
          )
            continue;
          if (!dry(to.x, to.y)) continue;
          cands.push({ from: { x, y }, to, cells, double: n === 3 });
        }
    }
  for (let i = cands.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [cands[i], cands[j]] = [cands[j]!, cands[i]!];
  }
  const hops: Hop[] = [];
  const keepAway = [f.stairsUp, ...(f.stairsDown ? [f.stairsDown] : [])];
  // Alternate: one of each kind when the floor has both.
  for (const want2 of [true, false, true, false]) {
    if (hops.length >= want) break;
    for (const h of cands.slice(0, H.tries)) {
      if (h.double !== want2) continue;
      if (keepAway.some((c) => cellDist(c, h.from) < H.fromStairs)) continue;
      if (hops.some((o) => cellDist(o.from, h.from) < H.spacing)) continue;
      const steps = walkSteps(f, h.from)[h.to.y * f.cols + h.to.x]!;
      if (steps < 0 || steps < h.cells.length + 1 + H.minSaving) continue;
      for (const c of h.cells) f.cells[c.y * f.cols + c.x] = CHASM;
      hops.push(h);
      break;
    }
  }
  if (hops.length) f.hops = hops;
  return f;
}

/** The first jump (or climb) on the best tap route, for the walker to make. */
export interface HopStep {
  spot: Cell;
  land: Cell;
  /** Pit cells jumped (0 for a climb onto a shelf). */
  gap: number;
  double: boolean;
}

const plans = new WeakMap<Floor, Map<string, HopStep | null>>();

/**
 * The first jump on the cheapest route from `from` to `goal`, over walking steps, climbs onto
 * shelves and jumps over one to three pit cells (deep water too, for a non-swimmer). Null when
 * the cheapest route needs no jump, or nothing reaches the goal.
 */
export function hopPlan(f: Floor, wet: boolean, from: Cell, goal: Cell): HopStep | null {
  const key = `${wet ? 1 : 0}:${from.x},${from.y}:${goal.x},${goal.y}`;
  let cache = plans.get(f);
  if (cache?.has(key)) return cache.get(key)!;
  const out = search(f, wet, from, goal);
  if (!cache) plans.set(f, (cache = new Map()));
  if (cache.size > 64) cache.delete(cache.keys().next().value!);
  cache.set(key, out);
  return out;
}

function search(f: Floor, wet: boolean, from: Cell, goal: Cell): HopStep | null {
  const { cols, rows } = f;
  const open = navMask(f, wet);
  const s = from.y * cols + from.x;
  const g = goal.y * cols + goal.x;
  if (s === g || open[g] !== 1) return null;
  const cost = new Int32Array(cols * rows).fill(-1);
  const parent = new Int32Array(cols * rows).fill(-1);
  // The edge into a cell: 0 walk, −1 climb, n > 0 a jump over n pit cells.
  const edge = new Int8Array(cols * rows);
  const buckets: number[][] = [[s]];
  cost[s] = 0;
  const hazard = (v: number | undefined) => v === CHASM || (!wet && v === WATER);
  const relax = (i: number, j: number, c: number, e: number) => {
    const nc = cost[i]! + c;
    if (cost[j]! >= 0 && cost[j]! <= nc) return;
    cost[j] = nc;
    parent[j] = i;
    edge[j] = e;
    (buckets[nc] ??= []).push(j);
  };
  let found = false;
  for (let b = 0; b < buckets.length && !found; b++) {
    const list = buckets[b];
    if (!list) continue;
    for (let q = 0; q < list.length; q++) {
      const i = list[q]!;
      if (cost[i] !== b) continue;
      if (i === g) {
        found = true;
        break;
      }
      const x = i % cols;
      const y = (i - x) / cols;
      const si = shelfAt(f, { x, y });
      for (const [dx, dy] of DIRS) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
        const j = ny * cols + nx;
        if (open[j] === 1) {
          const sj = shelfAt(f, { x: nx, y: ny });
          if (sj >= 0 && sj !== si) relax(i, j, H.climbCost, -1);
          else relax(i, j, 1, 0);
          continue;
        }
        // A pit of one to three cells with dry ground beyond (never onto a shelf).
        if (!hazard(f.cells[j])) continue;
        for (let k = 2; k <= 4; k++) {
          const lx = x + dx * k;
          const ly = y + dy * k;
          if (lx < 0 || ly < 0 || lx >= cols || ly >= rows) break;
          const l = ly * cols + lx;
          if (open[l] === 1) {
            if (shelfAt(f, { x: lx, y: ly }) < 0) relax(i, l, k - 1 + H.jumpCost, k - 1);
            break;
          }
          if (!hazard(f.cells[l])) break;
        }
      }
    }
  }
  if (cost[g]! < 0) return null;
  // Walk back to the start; the last jump met is the first one on the way.
  let step: HopStep | null = null;
  for (let j = g; j !== s; j = parent[j]!) {
    const e = edge[j]!;
    if (e !== 0) {
      const i = parent[j]!;
      step = {
        spot: { x: i % cols, y: Math.floor(i / cols) },
        land: { x: j % cols, y: Math.floor(j / cols) },
        gap: Math.max(0, e),
        double: e >= 3,
      };
    }
  }
  return step;
}

interface HopState {
  land: Vec2;
  double: boolean;
  rose: boolean;
  second: boolean;
}
const hopping = new WeakMap<World, HopState>();

/** Where a hop walk goes next: `press` asks for a jump now, `air` for the hop's air speed. */
export interface HopMove {
  wp: Vec2 | null;
  press: boolean;
  air: boolean;
}

/** Forget a hop under way (a new tap, a fall, leaving the floor). */
export function endHop(world: World): void {
  hopping.delete(world);
}

/**
 * The Keeper's tap walk over the first jump of its route, or null to walk as usual. Only
 * with Auto-hop on; the Keeper's own jump does the rest (`keeper.ts` presses it).
 */
export function hopWaypoint(world: World, f: Floor, target: Vec2): HopMove | null {
  const k = world.keeper;
  const st = hopping.get(world);
  if (st) {
    if (!k.grounded) st.rose = true;
    if (k.grounded && st.rose) {
      hopping.delete(world);
    } else {
      // The second jump at the top of the first, for a three-cell pit.
      const press = st.double && !st.second && !k.grounded && k.vy <= 0 && k.airJumps > 0;
      if (press) st.second = true;
      return { wp: st.land, press, air: true };
    }
  }
  if (!autoHopOn(world) || k.carrying) return null;
  const plan = hopPlan(f, keeperPerks(world).wade, cellOf(f, k.pos), cellOf(f, target));
  if (!plan) return null;
  const a = cellCentre(f, plan.spot);
  const b = cellCentre(f, plan.land);
  // Take off from the lip for a pit, from the cell's middle for a climb.
  const lip = plan.gap > 0 ? 0.45 : 0;
  const d = Math.hypot(b.x - a.x, b.z - a.z) || 1;
  const spot = { x: a.x + ((b.x - a.x) / d) * lip * 1.5, z: a.z + ((b.z - a.z) / d) * lip * 1.5 };
  if (Math.hypot(spot.x - k.pos.x, spot.z - k.pos.z) > H.spotReach || !k.grounded) {
    return { wp: keeperWaypoint(world, f, spot) ?? spot, press: false, air: false };
  }
  hopping.set(world, { land: b, double: plan.double, rose: false, second: false });
  return { wp: b, press: true, air: true };
}
