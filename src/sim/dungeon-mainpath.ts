/**
 * The floor's main path and its cross-widths, shared by the sim (solid set pieces, R0032) and
 * the 3D dressing (which draws arches and the parked cart where this puts them). Pure data
 * over the floor: no DOM, no Three.js.
 */
import { cellAt, isWalkable, WALL, WATER, type Cell, type Floor } from './dungeon';

const FOUR = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;

/** The shortest walk between two cells, dry cells preferred (water costs more). */
function walk(f: Floor, a: Cell, b: Cell): Cell[] {
  const n = f.cols * f.rows;
  const cost = new Float32Array(n).fill(Infinity);
  const from = new Int32Array(n).fill(-1);
  const start = a.y * f.cols + a.x;
  const goal = b.y * f.cols + b.x;
  cost[start] = 0;
  // A small bucket queue: costs are 1 (dry) or 4 (water), so buckets stay few.
  const buckets: number[][] = [[start]];
  for (let c = 0; c < buckets.length; c++) {
    const list = buckets[c];
    if (!list) continue;
    for (const i of list) {
      if (cost[i]! < c) continue;
      if (i === goal) break;
      const x = i % f.cols;
      const y = (i - x) / f.cols;
      for (const [dx, dy] of FOUR) {
        const nx = x + dx;
        const ny = y + dy;
        if (!isWalkable(f, nx, ny)) continue;
        const j = ny * f.cols + nx;
        const nc = c + (cellAt(f, nx, ny) === WATER ? 4 : 1);
        if (nc >= cost[j]!) continue;
        cost[j] = nc;
        from[j] = i;
        (buckets[nc] ??= []).push(j);
      }
    }
  }
  if (!Number.isFinite(cost[goal]!)) return [];
  const out: Cell[] = [];
  for (let i = goal; i !== -1; i = from[i]!) {
    const x = i % f.cols;
    out.push({ x, y: (i - x) / f.cols });
    if (i === start) break;
  }
  return out.reverse();
}

const roomCentre = (r: Floor['rooms'][number]): Cell => ({
  x: Math.floor(r.x + r.w / 2),
  y: Math.floor(r.y + r.h / 2),
});

const paths = new WeakMap<Floor, Cell[]>();
/**
 * The main path: from the way up through each room of the chain in order (the order the
 * tunnels were dug), on to the way down, or the chest on the last floor.
 */
export function mainPath(f: Floor): Cell[] {
  const had = paths.get(f);
  if (had) return had;
  const stops: Cell[] = [f.stairsUp];
  for (const r of f.rooms) {
    const c = roomCentre(r);
    if (isWalkable(f, c.x, c.y)) stops.push(c);
  }
  stops.push(f.stairsDown ?? f.chest);
  const out: Cell[] = [];
  for (let i = 1; i < stops.length; i++) {
    const leg = walk(f, stops[i - 1]!, stops[i]!);
    out.push(...(out.length ? leg.slice(1) : leg));
  }
  paths.set(f, out);
  return out;
}

/**
 * How far open ground runs across a path cell, perpendicular to (dx, dy): the cells either
 * side up to the rock, at most `max` each way.
 */
export function across(
  f: Floor,
  c: Cell,
  dx: number,
  dy: number,
  max = 4,
): { left: number; right: number } {
  const px = -dy;
  const py = dx;
  let left = 0;
  let right = 0;
  while (left < max && cellAt(f, c.x - px * (left + 1), c.y - py * (left + 1)) !== WALL) left++;
  while (right < max && cellAt(f, c.x + px * (right + 1), c.y + py * (right + 1)) !== WALL) right++;
  return { left, right };
}

/** A repeatable hash of a cell, 0..1, for placing stones. */
export const cellHash = (x: number, y: number, k = 0): number => {
  const v = Math.sin(x * 12.9898 + y * 78.233 + k * 37.719) * 43758.5453;
  return v - Math.floor(v);
};
