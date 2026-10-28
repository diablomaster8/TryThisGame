import { GROVE, SIM } from '../config/tuning';
import { GROVE_NAV, JUMP } from '../config/tuning-sim';
import { AUTO_HOP } from '../config/tuning-move';
import { NUBBIN_STEER } from '../config/tuning-move-nub';
import { astar, cellLine, stringPull } from './astar';
import { blocked, colliderReach, contact, obstacles, softAt, stops } from './obstacles';
import type { Collider, Walker } from './obstacles';
import { keeperPerks } from './perks';
import { storyPropMask } from './story-props';
import { groveHeight, hillHeight } from './terrain';
import { townUnlocks } from './town';
import type { Vec2, World } from './types';

/**
 * Tap-to-move pathfinding in the home Grove (MOVE-06). The field is rasterised into a 0.5 u
 * walkability grid from the collider table and the pond (open only with the Swim perk), and
 * the Keeper follows an A* path string-pulled into a few straight legs. Where the old "steer
 * along one circle" pressed for good at the dojo–hill gap or the well's crack, a path now
 * goes round, or the walk is refused at once when nothing reachable is near the target.
 * Everything here is transient: the grid is rebuilt lazily when something is placed, and
 * the route lives in a WeakMap, never in the save.
 */

const CELL = GROVE_NAV.cell;
const HALF = GROVE.size / 2;
const SIDE = Math.round(GROVE.size / CELL);

interface Grid {
  key: string;
  mask: Uint8Array;
  /**
   * Which connected pocket each open cell is in (0 for shut cells); a Nubbin grid fills it
   * in only when a plan first needs it.
   */
  label: Int32Array | null;
  /** The cliff test between neighbouring cells, or null where there are no cliffs to meet. */
  pass: Pass | null;
}

type Pass = (a: number, b: number) => boolean;

const grids = new WeakMap<World, Grid>();

function gridKey(world: World, wade: boolean): string {
  const u = townUnlocks(world);
  const placed = world.placed.map((d) => `${d.id}${d.yaw ?? 0}`).join(',');
  return `${+wade}${+u.stall}${+u.attendant}${+u.festival}|${storyPropMask(world)}|${placed}`;
}

const cellCentre = (i: number): number => -HALF + (i + 0.5) * CELL;
const cellOf = (v: number): number =>
  Math.max(0, Math.min(SIDE - 1, Math.floor((v + HALF) / CELL)));

/**
 * The walkability grid for this world now: 1 where the Keeper's centre may stand, 2 in a
 * bush, 3 where only a hop or standable piece low enough to jump stands (MOVE-24: open only
 * while Auto-hop is on).
 */
function grid(world: World): Grid {
  const wade = keeperPerks(world).wade;
  const key = gridKey(world, wade);
  const cached = grids.get(world);
  if (cached && cached.key === key) return cached;
  const mask = new Uint8Array(SIDE * SIDE);
  const pond = GROVE.pond;
  const edge = SIM.worldHalf;
  const p = { x: 0, z: 0 };
  for (let iz = 0; iz < SIDE; iz++) {
    p.z = cellCentre(iz);
    for (let ix = 0; ix < SIDE; ix++) {
      p.x = cellCentre(ix);
      if (Math.abs(p.x) > edge || Math.abs(p.z) > edge) continue;
      if (!wade && Math.hypot(p.x - pond.x, p.z - pond.z) < pond.r + 0.5) continue;
      if (blocked(p, world, GROVE_NAV.clearance)) {
        // Feet a jump up: hop and standable tops within reach no longer stop the walker.
        const lift = groveHeight(p.x, p.z) + AUTO_HOP.hopRise - JUMP.stepUp;
        if (!blocked(p, world, GROVE_NAV.clearance, 'keeper', lift)) mask[iz * SIDE + ix] = 3;
        continue;
      }
      // Bushes and beds are open but dear, so a path goes round them when it can.
      mask[iz * SIDE + ix] = softAt(p, world, 0) ? 2 : 1;
    }
  }
  const g = { key, mask, label: pockets(mask), pass: step };
  grids.set(world, g);
  return g;
}

/**
 * The terrace cliffs as walls between cells (MOVE-09), worked out once: the hills never
 * move. Between each cell and its east and south neighbours the hard ground is sampled a
 * tenth of a unit apart; a jump bigger than `GROVE_NAV.cliffJump` between two samples is a
 * cliff and shuts that join. Ramps and their banks slope and stay open, and so do the narrow
 * shelves of the tall outer hills, which a band of shut cells would pinch closed.
 */
let joins: { east: Uint8Array; south: Uint8Array } | null = null;

/** Join levels: walk, one jump, a double jump, shut (MOVE-24). */
const WALK = 1;
const DOUBLE = 3;
const HOP = 2;
const SHUT = 9;

/**
 * How a walker gets between two points: walking when no sample-to-sample rise is a cliff,
 * else by the whole rise (a jump, a double jump) or not at all.
 */
function joinBetween(ax: number, az: number, bx: number, bz: number): number {
  let last = hillHeight(ax, az, false);
  let lo = last;
  let hi = last;
  let cliff = false;
  for (let i = 1; i <= 5; i++) {
    const y = hillHeight(ax + ((bx - ax) * i) / 5, az + ((bz - az) * i) / 5, false);
    if (Math.abs(y - last) > GROVE_NAV.cliffJump) cliff = true;
    lo = Math.min(lo, y);
    hi = Math.max(hi, y);
    last = y;
  }
  if (!cliff) return WALK;
  const rise = hi - lo;
  return rise <= AUTO_HOP.hopRise ? HOP : rise <= AUTO_HOP.doubleRise ? DOUBLE : SHUT;
}

function cellJoins(): { east: Uint8Array; south: Uint8Array } {
  if (joins) return joins;
  const east = new Uint8Array(SIDE * SIDE);
  const south = new Uint8Array(SIDE * SIDE);
  for (let iz = 0; iz < SIDE; iz++)
    for (let ix = 0; ix < SIDE; ix++) {
      const x = cellCentre(ix);
      const z = cellCentre(iz);
      const c = iz * SIDE + ix;
      east[c] = joinBetween(x, z, x + CELL, z);
      south[c] = joinBetween(x, z, x, z + CELL);
    }
  joins = { east, south };
  return joins;
}

/**
 * Whether a walker gets between neighbouring cells a and b: by walking (level WALK), or with
 * Auto-hop also by a jump or a double jump up a terrace (level DOUBLE, MOVE-24).
 */
function step(a: number, b: number, level = WALK): boolean {
  const j = cellJoins();
  const lo = Math.min(a, b);
  const d = Math.abs(a - b);
  if (d === 1) return j.east[lo]! <= level;
  if (d === SIDE) return j.south[lo]! <= level;
  // A diagonal: open only when both ways round its corner are.
  const ax = a % SIDE;
  const bx = b % SIDE;
  const c1 = a - ax + bx;
  const c2 = b - bx + ax;
  return step(a, c1, level) && step(c1, b, level) && step(a, c2, level) && step(c2, b, level);
}

/** The join rule at a level: plain walking, or with Auto-hop's jumps (MOVE-24). */
function levelPass(level: number): Pass {
  return level > WALK ? (a, b) => step(a, b, level) : step;
}

/**
 * Label the open cells by pocket with one flood fill per pocket, so "can I get there from
 * here" is a lookup. Four-way joins match A*'s, which never cuts a corner.
 */
function pockets(mask: Uint8Array, pass: Pass | null = step): Int32Array {
  const label = new Int32Array(SIDE * SIDE);
  const queue = new Int32Array(SIDE * SIDE);
  let next = 0;
  for (let s = 0; s < mask.length; s++) {
    // Pockets are by walking: hop cells (3) join only while Auto-hop is on, in the search.
    if (mask[s] === 0 || mask[s] === 3 || label[s] !== 0) continue;
    next++;
    let head = 0;
    let tail = 0;
    label[s] = next;
    queue[tail++] = s;
    while (head < tail) {
      const c = queue[head++]!;
      const cx = c % SIDE;
      const visit = (n: number): void => {
        if (mask[n] !== 0 && mask[n] !== 3 && label[n] === 0 && (!pass || pass(c, n))) {
          label[n] = next;
          queue[tail++] = n;
        }
      };
      if (cx > 0) visit(c - 1);
      if (cx < SIDE - 1) visit(c + 1);
      if (c >= SIDE) visit(c - SIDE);
      if (c < mask.length - SIDE) visit(c + SIDE);
    }
  }
  return label;
}

/** A* options: the expansion cap, and soft cells cost more to cross. */
function search(mask: Uint8Array, pass: Pass | null = step) {
  const dear = (m: number | undefined): number =>
    m === 2 ? GROVE_NAV.softCost : m === 3 ? AUTO_HOP.hopCost : 1;
  return {
    maxExpansions: GROVE_NAV.maxExpansions,
    cost: (ix: number, iz: number) => dear(mask[iz * SIDE + ix]),
    ...(pass ? { pass } : {}),
  };
}

/**
 * Whether cell (ix, iz) is open; the walker's own cell always is (it may hug a wall). Hop
 * cells are open only at a hopping level.
 */
function opener(mask: Uint8Array, sx: number, sz: number, level = WALK) {
  const top = level > WALK ? 3 : 2;
  return (ix: number, iz: number): boolean => {
    if (ix === sx && iz === sz) return true;
    if (ix < 0 || iz < 0 || ix >= SIDE || iz >= SIDE) return false;
    const m = mask[iz * SIDE + ix]!;
    return m > 0 && m <= top;
  };
}

/** A line walker over open cells that also refuses to cross a cliff between two of them. */
function liner(mask: Uint8Array, sx: number, sz: number, pass: Pass | null = step, level = WALK) {
  const open = opener(mask, sx, sz, level);
  if (!pass) return open;
  let last = -1;
  return (ix: number, iz: number): boolean => {
    if (!open(ix, iz)) return false;
    const c = iz * SIDE + ix;
    const ok = last < 0 || pass(last, c);
    last = c;
    return ok;
  };
}

/** A straight walk from a to b crosses only open cells. */
function clear(
  mask: Uint8Array,
  a: Vec2,
  b: Vec2,
  pass: Pass | null = step,
  level = WALK,
): boolean {
  const g = (v: number): number => (v + HALF) / CELL;
  const walk = liner(mask, cellOf(a.x), cellOf(a.z), pass, level);
  return cellLine(g(a.x), g(a.z), g(b.x), g(b.z), walk);
}

/**
 * The open cell nearest `target` in the same pocket as cell `start`, searched in growing
 * rings round the target; null when none is within `GROVE_NAV.reachSearch` cells.
 */
function nearestReachable(g: Grid, start: number, target: Vec2): number | null {
  const label = g.label ?? (g.label = pockets(g.mask, g.pass));
  const want = label[start]!;
  if (want === 0) return null;
  const tx = cellOf(target.x);
  const tz = cellOf(target.z);
  let best: number | null = null;
  let bestD = Infinity;
  for (let r = 0; r <= GROVE_NAV.reachSearch; r++) {
    // Every cell in a later ring is at least (r - 1) cells from the target.
    if ((r - 1) * CELL > bestD) break;
    for (let dz = -r; dz <= r; dz++)
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
        const x = tx + dx;
        const z = tz + dz;
        if (x < 0 || z < 0 || x >= SIDE || z >= SIDE || label[z * SIDE + x] !== want) continue;
        const d = Math.hypot(cellCentre(x) - target.x, cellCentre(z) - target.z);
        if (d < bestD) {
          bestD = d;
          best = z * SIDE + x;
        }
      }
  }
  return best;
}

interface Route {
  /** The cell the walk was asked to reach (the end may be a nearer one). */
  aim: number;
  key: string;
  end: Vec2;
  points: Vec2[];
  i: number;
}

const routes = new WeakMap<World, Route>();

/** Where a Grove walk is headed now: the next corner to make for, and where it will end. */
export interface GroveLeg {
  next: Vec2;
  /** The target itself, or the reachable point nearest it when the target is shut in. */
  end: Vec2;
}

/**
 * The cell a walk starts from: the walker's own, or, when that is shut (a Keeper left in
 * the pond or a blocker's footing), the nearest open cell, which it walks to first.
 */
function entryCell(mask: Uint8Array, from: Vec2): number | null {
  const fx = cellOf(from.x);
  const fz = cellOf(from.z);
  if (mask[fz * SIDE + fx]! > 0) return fz * SIDE + fx;
  // Shut (or only hoppable) here: the nearest walkable cell.
  let best: number | null = null;
  let bestD = Infinity;
  const r = GROVE_NAV.entrySearch;
  for (let dz = -r; dz <= r; dz++)
    for (let dx = -r; dx <= r; dx++) {
      const x = fx + dx;
      const z = fz + dz;
      if (
        x < 0 ||
        z < 0 ||
        x >= SIDE ||
        z >= SIDE ||
        mask[z * SIDE + x] === 0 ||
        mask[z * SIDE + x] === 3
      )
        continue;
      const d = Math.hypot(cellCentre(x) - from.x, cellCentre(z) - from.z);
      if (d < bestD) {
        bestD = d;
        best = z * SIDE + x;
      }
    }
  return best;
}

function plan(g: Grid, from: Vec2, target: Vec2, level = WALK): Route | null {
  const mask = g.mask;
  const entry = entryCell(mask, from);
  if (entry === null) return null;
  const sx = entry % SIDE;
  const sz = (entry - sx) / SIDE;
  let gx = cellOf(target.x);
  let gz = cellOf(target.z);
  let end: Vec2 = { x: target.x, z: target.z };
  // With Auto-hop the Keeper's grid also crosses hop cells and jumpable cliffs (MOVE-24).
  const pass = g.pass && level > WALK ? levelPass(level) : g.pass;
  const open = opener(mask, sx, sz, level);
  let cells = open(gx, gz) && astar(SIDE, SIDE, open, sx, sz, gx, gz, search(mask, pass));
  if (!cells) {
    // Shut in (inside a building, past a wall with no way round): make for the nearest
    // reachable cell instead, or give up at once when there is none worth walking to.
    const near = nearestReachable(g, entry, target);
    if (near === null) return null;
    gx = near % SIDE;
    gz = (near - gx) / SIDE;
    end = { x: cellCentre(gx), z: cellCentre(gz) };
    cells = astar(SIDE, SIDE, open, sx, sz, gx, gz, search(mask, pass));
    if (!cells) return null;
  }
  const pulled = stringPull(cells, SIDE, (ax, az, bx, bz) =>
    cellLine(ax + 0.5, az + 0.5, bx + 0.5, bz + 0.5, liner(mask, sx, sz, pass, level)),
  );
  const shut = entry !== cellOf(from.z) * SIDE + cellOf(from.x);
  const points = pulled.slice(shut ? 0 : 1, -1).map((c) => {
    const cx = c % SIDE;
    return { x: cellCentre(cx), z: cellCentre((c - cx) / SIDE) };
  });
  points.push(end);
  return { aim: cellOf(target.z) * SIDE + cellOf(target.x), key: '', end, points, i: 0 };
}

/**
 * The Keeper's next leg toward `target` in the home Grove, or null when no reachable point
 * is anywhere near it (the walk should be refused straight away). Open ground is walked
 * straight; a path is planned only when something stands in the way.
 */
export function groveLeg(world: World, from: Vec2, target: Vec2): GroveLeg | null {
  const g = grid(world);
  const mask = g.mask;
  const level = autoHopOn(world) ? DOUBLE : WALK;
  const goal = mask[cellOf(target.z) * SIDE + cellOf(target.x)]!;
  if (
    clear(mask, from, target, levelPass(level), level) &&
    goal > 0 &&
    goal <= (level > WALK ? 3 : 2)
  ) {
    routes.delete(world);
    return { next: target, end: target };
  }
  const key = g.key + '|' + level;
  const aim = cellOf(target.z) * SIDE + cellOf(target.x);
  let r = routes.get(world);
  if (!r || r.key !== key || r.aim !== aim) {
    const fresh = plan(g, from, target, level);
    if (!fresh) {
      routes.delete(world);
      return null;
    }
    fresh.key = key;
    r = fresh;
    routes.set(world, r);
  }
  const pts = r.points;
  // Skip waypoints already reached or already in a straight line's view.
  while (
    r.i < pts.length - 1 &&
    (Math.hypot(pts[r.i]!.x - from.x, pts[r.i]!.z - from.z) < GROVE_NAV.waypointReach ||
      clear(mask, from, pts[r.i + 1]!, levelPass(level), level))
  )
    r.i++;
  // Pushed off the route (a Nubbin in the way, a slide along a wall): plan again from here.
  if (!clear(mask, from, pts[r.i]!, levelPass(level), level)) {
    const fresh = plan(g, from, target, level);
    if (!fresh) return null;
    fresh.key = key;
    r = fresh;
    routes.set(world, r);
  }
  return { next: r.points[r.i]!, end: r.end };
}

/**
 * MOVE-24: whether tap walks may hop logs and fences and jump up terraces. Unset follows
 * the Learning Grove (on there); the game turns it on for a phone at first launch.
 */
export function autoHopOn(world: World): boolean {
  return world.settings.autoHop ?? !!world.edu;
}

/**
 * MOVE-35: whether the target cell would be reached with Auto-hop's jumps (a terrace top,
 * the far side of a fence). Plans once, on a refused tap only.
 */
export function hopReaches(world: World, from: Vec2, target: Vec2): boolean {
  const r = plan(grid(world), from, target, DOUBLE);
  return !!r && Math.hypot(r.end.x - target.x, r.end.z - target.z) < CELL;
}

/** Forget the Keeper's route (a new tap, a teleport). */
export function clearGroveRoute(world: World): void {
  routes.delete(world);
}

/**
 * MOVE-38, for the debug overlay only: the grid's cells (0 shut, 1 open, 2 soft, 3 hop)
 * with its size, and the Keeper's current route, if any. Reads; changes nothing.
 */
export function navDebug(world: World): {
  mask: Uint8Array;
  side: number;
  cell: number;
  half: number;
  route: readonly Vec2[];
} {
  const r = routes.get(world);
  return {
    mask: grid(world).mask,
    side: SIDE,
    cell: CELL,
    half: HALF,
    route: r ? r.points.slice(r.i) : [],
  };
}

/*
 * Nubbin paths (MOVE-29). Nubbins have their own grid: the hills are shut to them (they never
 * climb), tree trunks are not (they walk under a canopy), a hopper clears fences and logs,
 * and the pond is open, since every Nubbin may paddle. A Nubbin plans
 * only for long walks or when something stands right in front of it; the walker keeps its
 * route in transient state outside the save, and plans again every few seconds.
 */

// Keyed by the collider list itself: the obstacle table hands back the same list until
// something is placed or a stall or story prop comes or goes, so every world with the same
// Grove shares one grid per walker kind.
const nubbinGrids = new WeakMap<readonly Collider[], Map<Walker, Grid>>();

function nubbinGrid(world: World, who: Walker): Grid {
  const list = obstacles(world);
  let byWho = nubbinGrids.get(list);
  if (!byWho) {
    byWho = new Map();
    nubbinGrids.set(list, byWho);
  }
  const cached = byWho.get(who);
  if (cached) return cached;
  // Open grass everywhere inside the edge, then each collider stamps the cells it reaches:
  // shut where it stops this walker, dear where it is a bush and nothing stops it there.
  const mask = new Uint8Array(SIDE * SIDE);
  const edge = SIM.worldHalf;
  const clearance = NUBBIN_STEER.clearance;
  for (let iz = 0; iz < SIDE; iz++) {
    if (Math.abs(cellCentre(iz)) > edge) continue;
    for (let ix = 0; ix < SIDE; ix++)
      if (Math.abs(cellCentre(ix)) <= edge) mask[iz * SIDE + ix] = 1;
  }
  for (const c of list) {
    const stop = stops(c, who);
    if (!stop && !c.flags.includes('soft')) continue;
    const r = colliderReach(c) + clearance;
    for (let iz = cellOf(c.z - r); iz <= cellOf(c.z + r); iz++)
      for (let ix = cellOf(c.x - r); ix <= cellOf(c.x + r); ix++) {
        const k = iz * SIDE + ix;
        if (mask[k] === 0) continue;
        if (stop) {
          if (contact(c, cellCentre(ix), cellCentre(iz), clearance)) mask[k] = 0;
        } else if (mask[k] === 1 && contact(c, cellCentre(ix), cellCentre(iz), 0)) mask[k] = 2;
      }
  }
  // No cliffs: the hills are shut to Nubbins, so their terraces never come into it.
  const g = { key: '', mask, label: null, pass: null };
  byWho.set(who, g);
  return g;
}

/** The longest run of shut cells, in cells, on the straight line from a to b. */
function shutRun(mask: Uint8Array, a: Vec2, b: Vec2): number {
  const g = (v: number): number => (v + HALF) / CELL;
  let run = 0;
  let worst = 0;
  cellLine(g(a.x), g(a.z), g(b.x), g(b.z), (ix, iz) => {
    const shut = ix < 0 || iz < 0 || ix >= SIDE || iz >= SIDE || mask[iz * SIDE + ix] === 0;
    run = shut ? run + 1 : 0;
    if (run > worst) worst = run;
    return true;
  });
  // A shut target always needs a plan: the walk has to end somewhere it can stand.
  return mask[cellOf(b.z) * SIDE + cellOf(b.x)] === 0 ? Infinity : worst;
}

/** A Nubbin's planned way to its target. The walker keeps it, outside the save. */
export interface NubbinRoute {
  /** The target the route was planned for; a target that drifts past `retarget` replans. */
  tx: number;
  tz: number;
  points: Vec2[] | null;
  i: number;
  /** Plan again no sooner than this (sim ms). */
  nextMs: number;
}

/**
 * Where a walking Nubbin should head now on its way to `target`: the target itself on open
 * ground, or the next corner of a planned path, kept in `walk.route`. `want` asks for a plan:
 * 1 when a long blocker stands across the way (a long walk, a wall ahead), 2 when anything
 * does (the walker found no clear heading at all); with 0 a route already planned is still
 * followed. Plans are made at most every `NUBBIN_STEER.repathMs`.
 */
export function nubbinAim(
  world: World,
  walk: { route: NubbinRoute | null },
  who: Walker,
  from: Vec2,
  target: Vec2,
  want: 0 | 1 | 2,
): Vec2 {
  let r = walk.route;
  if (r && Math.hypot(r.tx - target.x, r.tz - target.z) > NUBBIN_STEER.retarget) {
    walk.route = r = null;
  }
  const now = world.timeMs;
  if (want > 0 && (!r || now >= r.nextMs)) {
    const g = nubbinGrid(world, who);
    // A route still in view of its next corner (or a straight walk still clear) is kept:
    // planning again only when the walker has been pushed off it keeps long walks cheap.
    const ahead = r ? (r.points ? r.points[Math.min(r.i, r.points.length - 1)]! : target) : null;
    if (r && ahead && clear(g.mask, from, ahead, null)) {
      r.nextMs = now + NUBBIN_STEER.repathMs;
    } else {
      let points: Vec2[] | null = null;
      // A rock or a lantern across the line is left to steering; only a long blocker (a
      // house, a hill, a fence line) or a shut target is worth a path.
      const small = want === 2 ? 0 : NUBBIN_STEER.smallBlock / CELL;
      if (!clear(g.mask, from, target, null) && shutRun(g.mask, from, target) > small) {
        const planned = plan(g, from, target);
        // The last point is the target or the nearest reachable spot to it; aim past it at
        // the target itself so arrival still works when the target is a little way inside.
        points = planned ? planned.points.slice(0, -1) : null;
        if (points && points.length === 0) points = null;
      }
      r = { tx: target.x, tz: target.z, points, i: 0, nextMs: now + NUBBIN_STEER.repathMs };
      walk.route = r;
    }
  }
  if (!r || !r.points) return target;
  const pts = r.points;
  while (
    r.i < pts.length &&
    Math.hypot(pts[r.i]!.x - from.x, pts[r.i]!.z - from.z) < GROVE_NAV.waypointReach
  )
    r.i++;
  return r.i < pts.length ? pts[r.i]! : target;
}

/**
 * Corners for a one-off walk from `from` to `target` over the Nubbin grid (R0036): empty
 * when the straight line is clear, else the planned corners without the start or the target.
 * Staged walk-ons and wandering visitors share it; it plans once per call, so callers ask
 * on a target change only.
 */
export function walkPath(world: World, from: Vec2, target: Vec2, who: Walker = 'keeper'): Vec2[] {
  const g = nubbinGrid(world, who);
  if (clear(g.mask, from, target, null)) return [];
  const planned = plan(g, from, target);
  return planned ? planned.points.slice(0, -1) : [];
}

/**
 * MOVE-44: the corners still ahead on the Keeper's planned tap walk (the last is where it
 * stops), or none when it walks straight. Read-only, for the path preview.
 */
export function keeperRoute(world: World): readonly Vec2[] {
  const r = routes.get(world);
  return r ? r.points.slice(r.i) : [];
}
