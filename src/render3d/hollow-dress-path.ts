import * as THREE from 'three';
import { GROVE3D } from '../config/tuning';
import {
  cellAt,
  cellCentre,
  isWalkable,
  vnoise,
  WATER,
  WALL,
  type Cell,
  type Floor,
} from '../sim/dungeon';
import type { Baker, HollowCtx } from './hollow-ctx';
import { CELL } from './hollow-ctx';

/**
 * The floor's plan as the dressing reads it: the main path (the room chain the tunnels
 * follow, from the way up to the way down or the chest), the worn-path baker laid along it
 * (item 27), and the height actors stand at underground: `Floor.elevation` blended as
 * `elevationAt` does, but on the deck of a rope bridge or the top of a stepping stone where
 * a crossing runs (item 32), so nobody wades under their own bridge.
 */

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

/** Wear per grid corner, 0..1: full along the path, easing off over `path.width` cells. */
function wearCorners(f: Floor): Float32Array {
  const { width } = GROVE3D.cave.dress.path;
  const reach = Math.ceil(width) + 1;
  const dist = new Float32Array(f.cols * f.rows).fill(99);
  for (const c of mainPath(f)) {
    for (let dy = -reach; dy <= reach; dy++)
      for (let dx = -reach; dx <= reach; dx++) {
        const x = c.x + dx;
        const y = c.y + dy;
        if (x < 0 || y < 0 || x >= f.cols || y >= f.rows) continue;
        const i = y * f.cols + x;
        dist[i] = Math.min(dist[i]!, Math.hypot(dx, dy));
      }
  }
  const W = f.cols + 1;
  const out = new Float32Array(W * (f.rows + 1));
  for (let y = 0; y <= f.rows; y++)
    for (let x = 0; x <= f.cols; x++) {
      let sum = 0;
      let n = 0;
      for (const [ox, oy] of [
        [-1, -1],
        [0, -1],
        [-1, 0],
        [0, 0],
      ] as const) {
        const cx = x + ox;
        const cy = y + oy;
        if (cx < 0 || cy < 0 || cx >= f.cols || cy >= f.rows) continue;
        const d = dist[cy * f.cols + cx]!;
        sum += Math.max(0, 1 - d / width);
        n++;
      }
      out[y * W + x] = n ? sum / n : 0;
    }
  return out;
}

/**
 * Item 27: the worn path along the main room chain, as a baker for the floor's vertex
 * colours (contract 1). Up-facing surfaces near the path are scuffed paler and warmer, the
 * edge wobbling with a little noise so it reads as trodden earth, not a painted stripe.
 */
export function pathBaker(f: Floor, ctx: HollowCtx): Baker {
  const corners = wearCorners(f);
  const W = f.cols + 1;
  const P = GROVE3D.cave.dress.path;
  // Trodden earth, leaning a little toward the band's own floor tone.
  const worn = new THREE.Color(P.color).lerp(new THREE.Color(ctx.band.floor), 0.25);
  const at = (ix: number, iz: number) =>
    corners[Math.min(f.rows, Math.max(0, iz)) * W + Math.min(f.cols, Math.max(0, ix))] ?? 0;
  return (x, _y, z, ny, base) => {
    if (ny < 0.6) return;
    const gx = x / CELL + f.cols / 2;
    const gz = z / CELL + f.rows / 2;
    const x0 = Math.floor(gx);
    const z0 = Math.floor(gz);
    const tx = gx - x0;
    const tz = gz - z0;
    const w =
      at(x0, z0) * (1 - tx) * (1 - tz) +
      at(x0 + 1, z0) * tx * (1 - tz) +
      at(x0, z0 + 1) * (1 - tx) * tz +
      at(x0 + 1, z0 + 1) * tx * tz;
    if (w <= 0) return;
    const n = (vnoise(gx * 1.7, gz * 1.7, 41) - 0.5) * 2 * P.wobble;
    const k = THREE.MathUtils.smoothstep(w + n * 0.5, 0.25, 0.75) * P.wear * ny;
    if (k > 0) base.lerp(worn, k);
  };
}

const stands = new WeakMap<Floor, Float32Array>();
/** `Floor.elevation` with each crossing's deck or stone tops laid over its water cells. */
function standGrid(f: Floor): Float32Array {
  const had = stands.get(f);
  if (had) return had;
  const g = new Float32Array(f.elevation);
  for (const c of f.crossings) {
    const a = g[c.from.y * f.cols + c.from.x] ?? 0;
    const b = g[c.to.y * f.cols + c.to.x] ?? 0;
    c.cells.forEach((cell, i) => {
      const t = (i + 1) / (c.cells.length + 1);
      g[cell.y * f.cols + cell.x] = deckHeight(
        c.kind,
        a,
        b,
        t,
        f.elevation[cell.y * f.cols + cell.x] ?? 0,
      );
    });
  }
  stands.set(f, g);
  return g;
}

/** A bridge sags a little between its dry ends; a stone's top stands just proud of the water. */
export function deckHeight(
  kind: 'bridge' | 'stones',
  a: number,
  b: number,
  t: number,
  water: number,
): number {
  if (kind === 'stones') return water + STONE_TOP;
  return THREE.MathUtils.lerp(a, b, t) + DECK_LIFT - Math.sin(t * Math.PI) * DECK_SAG;
}
export const STONE_TOP = 0.12;
export const DECK_LIFT = 0.08;
export const DECK_SAG = 0.12;

/**
 * Where an actor's feet go underground: the stand grid blended between the centres of the
 * four nearest walkable cells, as `elevationAt` does (walls never lift anyone).
 */
export function standAt(f: Floor, x: number, z: number): number {
  const g = standGrid(f);
  const gx = x / CELL + f.cols / 2 - 0.5;
  const gz = z / CELL + f.rows / 2 - 0.5;
  const x0 = Math.floor(gx);
  const y0 = Math.floor(gz);
  const tx = gx - x0;
  const ty = gz - y0;
  // Called for every foot of every creature each frame: no arrays made here.
  let sum = 0;
  let weight = 0;
  for (let k = 0; k < 4; k++) {
    const dx = k & 1;
    const dy = k >> 1;
    const w = (dx ? tx : 1 - tx) * (dy ? ty : 1 - ty);
    if (w <= 0 || !isWalkable(f, x0 + dx, y0 + dy)) continue;
    sum += (g[(y0 + dy) * f.cols + x0 + dx] ?? 0) * w;
    weight += w;
  }
  if (weight > 0) return sum / weight;
  const cx = Math.floor(x / CELL + f.cols / 2);
  const cz = Math.floor(z / CELL + f.rows / 2);
  return g[cz * f.cols + cx] ?? 0;
}

/** The top of a cell (its own elevation), for things standing squarely on one cell. */
export function cellTop(f: Floor, c: Cell): number {
  return f.elevation[c.y * f.cols + c.x] ?? 0;
}

/** The world position of a cell centre with its top as y. */
export function cellPoint(f: Floor, c: Cell, lift = 0): THREE.Vector3 {
  const p = cellCentre(f, c);
  return new THREE.Vector3(p.x, cellTop(f, c) + lift, p.z);
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
