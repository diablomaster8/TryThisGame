/**
 * Getting around a Hollow floor (R0009). Tap-to-move used to walk a straight line and slide
 * along rock, so a tap round a corner often never arrived; the party snagged the same way.
 * This plans an A* path over `Floor.cells` (see `astar.ts`), string-pulls it into a few
 * straight legs and hands the walker one waypoint at a time.
 *
 * Who may cross what: dry floor and the crossings (bridges and stepping stones sit over
 * water cells) for everyone; open water only for the Keeper with the Swim perk, and for
 * Nubbins, who swim. Paths are runtime state only, never saved: a reload simply replans.
 */
import { DUNGEON } from '../config/tuning';
import { DUNGEON_NAV } from '../config/tuning-sim';
import { astar, cellLine, stringPull } from './astar';
import { FLOOR, WATER, type Floor } from './dungeon';
import { propCells, propOnLine } from './dungeon-props';
import { keeperPerks } from './perks';
import type { Nubbin, Vec2, World } from './types';

const CELL = DUNGEON.cell;

interface Masks {
  dry: Uint8Array;
  wet: Uint8Array;
  sightDry: Uint8Array;
  sightWet: Uint8Array;
}

// Floors are cached and immutable once generated, so their masks and paths can be too.
const masks = new WeakMap<Floor, Masks>();
const pathCache = new WeakMap<Floor, Map<string, Plan>>();

/** The walkable mask of a floor: dry ground only, or water too. */
export function navMask(f: Floor, wet: boolean): Uint8Array {
  let m = masks.get(f);
  if (!m) {
    const dry = new Uint8Array(f.cells.length);
    const wetMask = new Uint8Array(f.cells.length);
    for (let i = 0; i < f.cells.length; i++) {
      dry[i] = f.cells[i] === FLOOR ? 1 : 0;
      wetMask[i] = f.cells[i] === FLOOR || f.cells[i] === WATER ? 1 : 0;
    }
    // Version 4 (R0031) makes a crossing's decks and stones real floor and its gaps deep water.
    if (f.version < 4)
      for (const c of f.crossings) for (const q of c.cells) dry[q.y * f.cols + q.x] = 1;
    // Sight lines read rock only and test the landmark as its true circle (`sightLine`).
    const sightDry = dry.slice();
    const sightWet = wetMask.slice();
    // The landmark is solid (R0032): its cells are closed to the planner.
    for (const i of propCells(f)) dry[i] = wetMask[i] = 0;
    m = { dry, wet: wetMask, sightDry, sightWet };
    masks.set(f, m);
  }
  return wet ? m.wet : m.dry;
}

/**
 * The rock-only mask, for straight-line checks: a walker standing in a cell the landmark's
 * padding closed must still see its way out, or it re-plans toward its own cell every step
 * and the collider holds it there.
 */
function sightMask(f: Floor, wet: boolean): Uint8Array {
  navMask(f, wet);
  const m = masks.get(f)!;
  return wet ? m.sightWet : m.sightDry;
}

/** A straight walk from a to b that rock and the landmark both leave clear. */
function sightLine(f: Floor, wet: boolean, a: Vec2, b: Vec2, clearance: number): boolean {
  return clearLine(f, sightMask(f, wet), a, b, clearance) && !propOnLine(f, a, b, clearance);
}

function open(f: Floor, mask: Uint8Array, x: number, y: number): boolean {
  return x >= 0 && y >= 0 && x < f.cols && y < f.rows && mask[y * f.cols + x] === 1;
}

/** World position to fractional grid units (cell (x, y) spans [x, x + 1)). */
function gx(f: Floor, p: Vec2): number {
  return p.x / CELL + f.cols / 2;
}
function gz(f: Floor, p: Vec2): number {
  return p.z / CELL + f.rows / 2;
}

function centre(f: Floor, i: number): Vec2 {
  const x = i % f.cols;
  const y = (i - x) / f.cols;
  return { x: (x + 0.5 - f.cols / 2) * CELL, z: (y + 0.5 - f.rows / 2) * CELL };
}

/**
 * True when a body of half-width `clearance` can walk straight from a to b: the centre line
 * and both edge lines cross only open cells. A thin line alone would let the body's side
 * catch a wall corner and slide to a stop.
 */
export function clearLine(f: Floor, mask: Uint8Array, a: Vec2, b: Vec2, clearance: number) {
  const ax = gx(f, a);
  const az = gz(f, a);
  const bx = gx(f, b);
  const bz = gz(f, b);
  const len = Math.hypot(bx - ax, bz - az);
  const visit = (x: number, y: number) => open(f, mask, x, y);
  if (len < 1e-6) return visit(Math.floor(ax), Math.floor(az));
  const r = clearance / CELL;
  const ox = (-(bz - az) / len) * r;
  const oz = ((bx - ax) / len) * r;
  return (
    cellLine(ax, az, bx, bz, visit) &&
    cellLine(ax + ox, az + oz, bx + ox, bz + oz, visit) &&
    cellLine(ax - ox, az - oz, bx - ox, bz - oz, visit)
  );
}

interface Plan {
  /** Pulled cell indices from start to the end cell. */
  cells: number[];
  /** False when the goal could not be reached and the path ends at the nearest cell to it. */
  reaches: boolean;
}

/** The open cell reachable from `start` that lies nearest the goal, by a flood fill. */
function nearestReachable(f: Floor, mask: Uint8Array, start: number, goal: number): number {
  const seen = new Uint8Array(f.cols * f.rows);
  const queue = new Int32Array(f.cols * f.rows);
  const tx = goal % f.cols;
  const ty = (goal - tx) / f.cols;
  let head = 0;
  let tail = 0;
  queue[tail++] = start;
  seen[start] = 1;
  let best = start;
  let bestD = Infinity;
  while (head < tail) {
    const c = queue[head++]!;
    const cx = c % f.cols;
    const cy = (c - cx) / f.cols;
    const d = (cx - tx) ** 2 + (cy - ty) ** 2;
    if (d < bestD && (c === start || mask[c] === 1)) {
      bestD = d;
      best = c;
    }
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (!open(f, mask, nx, ny) || seen[ny * f.cols + nx]) continue;
        if (dx && dy && (!open(f, mask, nx, cy) || !open(f, mask, cx, ny))) continue;
        seen[ny * f.cols + nx] = 1;
        queue[tail++] = ny * f.cols + nx;
      }
    }
  }
  return best;
}

function plan(f: Floor, wet: boolean, start: number, goal: number, clearance: number): Plan {
  const key = `${wet ? 1 : 0}:${start}:${goal}:${clearance}`;
  let cache = pathCache.get(f);
  const hit = cache?.get(key);
  if (hit) return hit;
  const mask = navMask(f, wet);
  // The whole floor is the bound here: a Hollow floor is small enough to search outright.
  const opts = { maxExpansions: f.cols * f.rows };
  const sx = start % f.cols;
  const sy = (start - sx) / f.cols;
  // A body may stand in a cell the props closed (beside the landmark, R0032): it can always
  // walk out of its own cell.
  const walk = (x: number, y: number) => (x === sx && y === sy) || open(f, mask, x, y);
  let reaches = true;
  let path = astar(f.cols, f.rows, walk, sx, sy, goal % f.cols, Math.floor(goal / f.cols), opts);
  if (!path) {
    reaches = false;
    const to = nearestReachable(f, mask, start, goal);
    path = astar(f.cols, f.rows, walk, sx, sy, to % f.cols, Math.floor(to / f.cols), opts) ?? [
      start,
    ];
  }
  const los = (ax: number, ay: number, bx: number, by: number) =>
    clearLine(f, mask, centre(f, ay * f.cols + ax), centre(f, by * f.cols + bx), clearance);
  const result: Plan = { cells: stringPull(path, f.cols, los), reaches };
  if (!cache) {
    cache = new Map();
    pathCache.set(f, cache);
  }
  if (cache.size >= DUNGEON_NAV.cacheSize) cache.delete(cache.keys().next().value!);
  cache.set(key, result);
  return result;
}

function cellIndexOf(f: Floor, p: Vec2): number {
  const x = Math.min(f.cols - 1, Math.max(0, Math.floor(gx(f, p))));
  const y = Math.min(f.rows - 1, Math.max(0, Math.floor(gz(f, p))));
  return y * f.cols + x;
}

/** One walker's current route; transient, rebuilt whenever the goal cell changes. */
export interface NavRoute {
  floor: Floor | null;
  wet: boolean;
  goal: number;
  points: Vec2[];
  reaches: boolean;
  i: number;
}

export function newRoute(): NavRoute {
  return { floor: null, wet: false, goal: -1, points: [], reaches: true, i: 0 };
}

function replan(route: NavRoute, f: Floor, pos: Vec2, target: Vec2, wet: boolean, cl: number) {
  const goal = cellIndexOf(f, target);
  const p = plan(f, wet, cellIndexOf(f, pos), goal, cl);
  route.floor = f;
  route.wet = wet;
  route.goal = goal;
  route.reaches = p.reaches;
  // The exact target replaces its cell's centre when the path gets there.
  route.points = p.cells.map((c) => centre(f, c));
  if (p.reaches) route.points[route.points.length - 1] = { x: target.x, z: target.z };
  route.i = 0;
}

/**
 * Where to walk next on the way to `target`: the target itself when the way is clear,
 * otherwise the next waypoint of a planned path. Null when the walker already stands as
 * close as it can get (the target is walled off or in water it may not enter).
 */
export function nextWaypoint(
  route: NavRoute,
  f: Floor,
  pos: Vec2,
  target: Vec2,
  wet: boolean,
  clearance: number,
): Vec2 | null {
  const mask = navMask(f, wet);
  const goal = cellIndexOf(f, target);
  if (mask[goal] === 1 && sightLine(f, wet, pos, target, clearance)) {
    route.goal = -1;
    return target;
  }
  if (route.floor !== f || route.wet !== wet || route.goal !== goal || !route.points.length) {
    replan(route, f, pos, target, wet, clearance);
  }
  const pts = route.points;
  // Skip ahead past waypoints already reached or already in a straight line's view.
  while (
    route.i < pts.length - 1 &&
    (Math.hypot(pts[route.i]!.x - pos.x, pts[route.i]!.z - pos.z) < DUNGEON_NAV.waypointReach ||
      sightLine(f, wet, pos, pts[route.i + 1]!, clearance))
  ) {
    route.i++;
  }
  // Pushed off the route (a shove, a slide along a wall): plan again from here.
  if (!sightLine(f, wet, pos, pts[route.i]!, 0)) {
    replan(route, f, pos, target, wet, clearance);
  }
  const wp = route.points[route.i]!;
  const last = route.i === route.points.length - 1;
  if (last && !route.reaches && Math.hypot(wp.x - pos.x, wp.z - pos.z) < DUNGEON_NAV.waypointReach)
    return null;
  return wp;
}

const keeperRoutes = new WeakMap<World, NavRoute>();
const nubbinRoutes = new WeakMap<Nubbin, NavRoute>();

/** The Keeper's next waypoint toward a tap or care target on this floor. */
export function keeperWaypoint(world: World, f: Floor, target: Vec2): Vec2 | null {
  let route = keeperRoutes.get(world);
  if (!route) {
    route = newRoute();
    keeperRoutes.set(world, route);
  }
  const wade = keeperPerks(world).wade;
  return nextWaypoint(route, f, world.keeper.pos, target, wade, DUNGEON_NAV.keeperClearance);
}

/** A party Nubbin's next waypoint toward the Keeper or loot; Nubbins swim, so water is open. */
export function nubbinWaypoint(n: Nubbin, f: Floor, target: Vec2): Vec2 | null {
  let route = nubbinRoutes.get(n);
  if (!route) {
    route = newRoute();
    nubbinRoutes.set(n, route);
  }
  return nextWaypoint(route, f, n.pos, target, true, DUNGEON_NAV.nubbinClearance);
}
