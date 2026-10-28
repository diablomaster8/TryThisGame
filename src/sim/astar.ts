/**
 * Grid pathfinding shared by every place that walks someone around obstacles: A* over a
 * width × height grid of cells, a supercover line walk for line-of-sight tests, and string
 * pulling to turn a cell-by-cell path into a few straight legs. It knows nothing about what
 * a cell is (a Hollow tile, a slice of the Grove): callers pass a `walkable` test, so the
 * same code serves any grid size. Cells are addressed by flat index `iz * width + ix`.
 *
 * Allocation-light on purpose: it runs inside 100 ms sim steps on phones, so the search
 * arrays are module scratch reused between calls (grown when a bigger grid arrives) and a
 * generation stamp stands in for clearing them.
 */

export type Walkable = (ix: number, iz: number) => boolean;

export interface AStarOptions {
  /** Give up after this many expanded cells (a bound on the worst case per call). */
  maxExpansions?: number;
  /** Cost multiplier for entering a cell, at least 1 so the heuristic stays admissible. */
  cost?: (ix: number, iz: number) => number;
}

/** Default bound on expanded cells: a little under a 96 × 72 Hollow floor. */
export const ASTAR_MAX_EXPANSIONS = 6000;

const SQRT2 = Math.SQRT2;
// The eight moves: four orthogonal first, then the diagonals, each with its step length.
const DX = [1, -1, 0, 0, 1, 1, -1, -1];
const DZ = [0, 0, 1, -1, 1, -1, 1, -1];
const STEP = [1, 1, 1, 1, SQRT2, SQRT2, SQRT2, SQRT2];

let cap = 0;
let g = new Float64Array(0);
let parent = new Int32Array(0);
let stamp = new Uint32Array(0);
let closed = new Uint32Array(0);
let generation = 0;
// Binary min-heap of (f, cell) pairs; stale entries are skipped when popped.
let heapF = new Float64Array(256);
let heapC = new Int32Array(256);
let heapN = 0;

function ensure(size: number): void {
  if (size <= cap) return;
  cap = size;
  g = new Float64Array(size);
  parent = new Int32Array(size);
  stamp = new Uint32Array(size);
  closed = new Uint32Array(size);
  generation = 0;
}

function push(f: number, c: number): void {
  if (heapN === heapF.length) {
    const nf = new Float64Array(heapN * 2);
    const nc = new Int32Array(heapN * 2);
    nf.set(heapF);
    nc.set(heapC);
    heapF = nf;
    heapC = nc;
  }
  let i = heapN++;
  while (i > 0) {
    const p = (i - 1) >> 1;
    if (heapF[p]! <= f) break;
    heapF[i] = heapF[p]!;
    heapC[i] = heapC[p]!;
    i = p;
  }
  heapF[i] = f;
  heapC[i] = c;
}

function pop(): number {
  const top = heapC[0]!;
  const lastF = heapF[--heapN]!;
  const lastC = heapC[heapN]!;
  let i = 0;
  for (;;) {
    let m = i * 2 + 1;
    if (m >= heapN) break;
    if (m + 1 < heapN && heapF[m + 1]! < heapF[m]!) m++;
    if (heapF[m]! >= lastF) break;
    heapF[i] = heapF[m]!;
    heapC[i] = heapC[m]!;
    i = m;
  }
  heapF[i] = lastF;
  heapC[i] = lastC;
  return top;
}

function octile(ax: number, az: number, bx: number, bz: number): number {
  const dx = Math.abs(ax - bx);
  const dz = Math.abs(az - bz);
  return dx + dz + (SQRT2 - 2) * Math.min(dx, dz);
}

/**
 * The cheapest 8-connected path from start to goal as flat cell indices, start and goal
 * included, or null when the goal is blocked, out of reach or past the expansion cap.
 * A diagonal step needs both orthogonal neighbours open, so a path never cuts a wall's
 * corner. The start cell itself is never tested: whoever stands there may be half inside
 * something and still deserves a way out.
 */
export function astar(
  width: number,
  height: number,
  walkable: Walkable,
  sx: number,
  sz: number,
  gx: number,
  gz: number,
  opts: AStarOptions = {},
): number[] | null {
  const inside = (x: number, z: number) => x >= 0 && z >= 0 && x < width && z < height;
  if (!inside(sx, sz) || !inside(gx, gz) || !walkable(gx, gz)) return null;
  const start = sz * width + sx;
  const goal = gz * width + gx;
  if (start === goal) return [start];
  ensure(width * height);
  generation++;
  if (generation === 0xffffffff) {
    stamp.fill(0);
    closed.fill(0);
    generation = 1;
  }
  const gen = generation;
  const maxExp = opts.maxExpansions ?? ASTAR_MAX_EXPANSIONS;
  const cost = opts.cost;
  heapN = 0;
  g[start] = 0;
  parent[start] = -1;
  stamp[start] = gen;
  push(octile(sx, sz, gx, gz), start);
  let expanded = 0;
  while (heapN > 0) {
    const c = pop();
    if (closed[c] === gen) continue;
    if (c === goal) {
      const out: number[] = [];
      for (let i = goal; i !== -1; i = parent[i]!) out.push(i);
      return out.reverse();
    }
    closed[c] = gen;
    if (++expanded > maxExp) return null;
    const cx = c % width;
    const cz = (c - cx) / width;
    const gc = g[c]!;
    for (let d = 0; d < 8; d++) {
      const nx = cx + DX[d]!;
      const nz = cz + DZ[d]!;
      if (!inside(nx, nz)) continue;
      const n = nz * width + nx;
      if (closed[n] === gen || !walkable(nx, nz)) continue;
      if (d >= 4 && (!walkable(nx, cz) || !walkable(cx, nz))) continue;
      const ng = gc + STEP[d]! * (cost ? cost(nx, nz) : 1);
      if (stamp[n] === gen && ng >= g[n]!) continue;
      stamp[n] = gen;
      g[n] = ng;
      parent[n] = c;
      push(ng + octile(nx, nz, gx, gz), n);
    }
  }
  return null;
}

/**
 * Walk every cell a segment touches (a supercover line), in grid units where cell (ix, iz)
 * spans [ix, ix + 1) × [iz, iz + 1). Where the segment passes exactly through a corner both
 * side cells are visited, so a sight line can never slip between two diagonal walls.
 * Stops early and returns false as soon as `visit` does.
 */
export function cellLine(
  x0: number,
  z0: number,
  x1: number,
  z1: number,
  visit: (ix: number, iz: number) => boolean,
): boolean {
  let ix = Math.floor(x0);
  let iz = Math.floor(z0);
  const ex = Math.floor(x1);
  const ez = Math.floor(z1);
  if (!visit(ix, iz)) return false;
  const dx = x1 - x0;
  const dz = z1 - z0;
  const sx = dx > 0 ? 1 : dx < 0 ? -1 : 0;
  const sz = dz > 0 ? 1 : dz < 0 ? -1 : 0;
  const tdx = sx !== 0 ? Math.abs(1 / dx) : Infinity;
  const tdz = sz !== 0 ? Math.abs(1 / dz) : Infinity;
  let tx = sx > 0 ? (ix + 1 - x0) * tdx : sx < 0 ? (x0 - ix) * tdx : Infinity;
  let tz = sz > 0 ? (iz + 1 - z0) * tdz : sz < 0 ? (z0 - iz) * tdz : Infinity;
  // Each step crosses one cell boundary, so the count bounds the walk.
  let steps = Math.abs(ex - ix) + Math.abs(ez - iz);
  while (steps > 0) {
    if (Math.abs(tx - tz) < 1e-9) {
      // Through a corner: both cells beside it count as touched.
      if (!visit(ix + sx, iz) || !visit(ix, iz + sz)) return false;
      ix += sx;
      iz += sz;
      tx += tdx;
      tz += tdz;
      steps -= 2;
    } else if (tx < tz) {
      ix += sx;
      tx += tdx;
      steps--;
    } else {
      iz += sz;
      tz += tdz;
      steps--;
    }
    if (!visit(ix, iz)) return false;
  }
  return true;
}

/** True when the straight line between two cell centres crosses only walkable cells. */
export function gridLineOfSight(
  walkable: Walkable,
  ax: number,
  az: number,
  bx: number,
  bz: number,
): boolean {
  return cellLine(ax + 0.5, az + 0.5, bx + 0.5, bz + 0.5, walkable);
}

/**
 * Drop every cell a straight line can skip: keeps the start, the goal and only the turning
 * points between them. `lineOfSight` decides what "straight" may cross, so a caller with a
 * wide body can test a thick line instead of a thin one.
 */
export function stringPull(
  path: readonly number[],
  width: number,
  lineOfSight: (ax: number, az: number, bx: number, bz: number) => boolean,
): number[] {
  if (path.length <= 2) return path.slice();
  const out = [path[0]!];
  let anchor = path[0]!;
  for (let j = 2; j < path.length; j++) {
    const a = anchor;
    const b = path[j]!;
    if (!lineOfSight(a % width, Math.floor(a / width), b % width, Math.floor(b / width))) {
      anchor = path[j - 1]!;
      out.push(anchor);
    }
  }
  out.push(path[path.length - 1]!);
  return out;
}
