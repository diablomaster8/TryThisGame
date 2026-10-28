/**
 * The Grove's ground as the sim sees it: how high it is and what it is made of at any
 * point. The height model used to live only in the renderers (cosine bumps in the 3D
 * terrain, flat terraces in Pixel), so the sim could not tell a ledge from a wall. It now
 * lives here, with no three.js and no DOM, and both renderers build from it:
 * `render3d/terrain-shape.ts` re-exports these samplers, and the Pixel hill terraces take
 * their tier numbers from `pixelTiers`. The noise is a copy of `render/paint/noise.ts`
 * (whose `raster.ts` imports three), kept bit-identical so the 3D mesh does not move.
 */
import { GROVE, GROVE3D } from '../config/tuning';
import type { World } from './types';

export type GroundSurface = 'grass' | 'path' | 'water' | 'deck' | 'stone';

export interface Ground {
  /** Height the feet rest at: the water surface where the bed dips below it. */
  y: number;
  surface: GroundSurface;
}

/** Height the water surface sits at: the pond and stream share one level. */
export const WATER_LEVEL = -0.32;

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

/** Hermite step from 0 at `lo` to 1 at `hi`, as three's MathUtils.smoothstep computes it. */
function smoothstep(v: number, lo: number, hi: number): number {
  if (v <= lo) return 0;
  if (v >= hi) return 1;
  const t = (v - lo) / (hi - lo);
  return t * t * (3 - 2 * t);
}

// Value noise and fbm, copied from render/paint/noise.ts and raster.ts's `hash` so the
// sim needs no render import. Change both or neither: the 3D ground mesh samples this.
function hash(x: number, y: number, salt: number): number {
  let h = (x * 374761393 + y * 668265263 + salt * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function vnoise(x: number, y: number, salt: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const tx = fx * fx * (3 - 2 * fx);
  const ty = fy * fy * (3 - 2 * fy);
  const a = hash(x0, y0, salt);
  const b = hash(x0 + 1, y0, salt);
  const c = hash(x0, y0 + 1, salt);
  const d = hash(x0 + 1, y0 + 1, salt);
  return (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty;
}

function fbm(x: number, y: number, octaves: number, salt: number): number {
  let sum = 0;
  let amp = 1;
  let norm = 0;
  let fx = x;
  let fy = y;
  for (let i = 0; i < octaves; i++) {
    sum += vnoise(fx, fy, salt + i * 17) * amp;
    norm += amp;
    amp *= 0.5;
    fx *= 2;
    fy *= 2;
  }
  return sum / norm;
}

const RIVER: Array<Array<{ x: number; z: number }>> = [
  [...GROVE.river.inflow],
  [...GROVE.river.outflow],
];

function segmentDistance(
  x: number,
  z: number,
  ax: number,
  az: number,
  bx: number,
  bz: number,
): number {
  const dx = bx - ax;
  const dz = bz - az;
  const len2 = dx * dx + dz * dz || 1;
  const t = clamp(((x - ax) * dx + (z - az) * dz) / len2, 0, 1);
  return Math.hypot(x - (ax + dx * t), z - (az + dz * t));
}

function polylineDistance(
  x: number,
  z: number,
  line: ReadonlyArray<{ x: number; z: number } | readonly [number, number]>,
): number {
  let best = Infinity;
  for (let i = 0; i + 1 < line.length; i++) {
    const a = line[i]!;
    const b = line[i + 1]!;
    const [ax, az] = Array.isArray(a) ? a : [(a as { x: number }).x, (a as { z: number }).z];
    const [bx, bz] = Array.isArray(b) ? b : [(b as { x: number }).x, (b as { z: number }).z];
    best = Math.min(best, segmentDistance(x, z, ax, az, bx, bz));
  }
  return best;
}

/** Distance to the nearest stream centre line. */
export function riverDistance(x: number, z: number): number {
  let best = Infinity;
  for (const line of RIVER) best = Math.min(best, polylineDistance(x, z, line));
  return best;
}

/** Distance to the nearest dirt path centre line. */
export function pathDistance(x: number, z: number): number {
  let best = Infinity;
  for (const line of GROVE3D.paths) best = Math.min(best, polylineDistance(x, z, line));
  return best;
}

/** Ground height before water cuts: hills, rim and roll. */
function landHeight(x: number, z: number): number {
  let y = 0;
  // Hills are today's cosine bumps; the terrace rebuild (R0011) replaces this loop.
  for (const h of GROVE.hills) {
    const d = Math.hypot(x - h.x, z - h.z) / h.r;
    if (d < 1) y += h.h * 0.5 * (1 + Math.cos(d * Math.PI));
  }
  const edge = Math.max(Math.abs(x), Math.abs(z));
  const rim = smoothstep(edge, GROVE3D.rimStart, GROVE.size / 2 + 6);
  y += rim * rim * GROVE3D.rimHeight * (0.8 + fbm(x / 6, z / 6, 2, 71) * 0.4);
  y += fbm(x / 11, z / 11, 3, 72) * 0.5 - 0.22;
  return y;
}

/** The full sum, for the terrain mesh itself and for the height tiles. */
export function exactHeight(x: number, z: number): number {
  let y = landHeight(x, z);
  const pond = GROVE.pond;
  const pd = Math.hypot(x - pond.x, z - pond.z) / (pond.r + 0.6);
  if (pd < 1) y -= GROVE3D.pondDepth * (1 - smoothstep(pd, 0.55, 1));
  const rd = riverDistance(x, z) / (GROVE.river.width * 0.5 + 0.5);
  if (rd < 1) y -= GROVE3D.riverDepth * (1 - smoothstep(rd, 0.5, 1));
  return y;
}

/**
 * Heights as a grid of tiles, filled the first time anything stands on them. Every walking
 * creature, the camera, the grass pushers and the props ask for the ground each frame, and
 * the full sum (hills, rim, two noise rolls, the stream polylines) for points that move was
 * a fifth of a throttled phone frame; an exact-point cache missed for anything in motion. A
 * lookup is now four reads and a blend. The cells are a quarter unit, half the terrain
 * mesh's own, so a foot sits on the drawn ground at least as well as the exact sum did.
 */
const CELL = 0.25;
const TILE = 32;
const SIDE = TILE + 1;
const tiles = new Map<number, Float32Array>();

function tileAt(tx: number, tz: number): Float32Array {
  const key = (tx + 1024) * 2048 + (tz + 1024);
  let t = tiles.get(key);
  if (t) return t;
  t = new Float32Array(SIDE * SIDE);
  const x0 = tx * TILE * CELL;
  const z0 = tz * TILE * CELL;
  for (let j = 0; j < SIDE; j++)
    for (let i = 0; i < SIDE; i++) t[j * SIDE + i] = exactHeight(x0 + i * CELL, z0 + j * CELL);
  tiles.set(key, t);
  return t;
}

/** The height of the ground at a point in the Grove; the water lies below it in dips. */
export function groveHeight(x: number, z: number): number {
  const gx = x / CELL;
  const gz = z / CELL;
  const ix = Math.floor(gx);
  const iz = Math.floor(gz);
  const tx = Math.floor(ix / TILE);
  const tz = Math.floor(iz / TILE);
  const t = tileAt(tx, tz);
  const i = ix - tx * TILE;
  const j = iz - tz * TILE;
  const fx = gx - ix;
  const fz = gz - iz;
  const a = t[j * SIDE + i]!;
  const b = t[j * SIDE + i + 1]!;
  const c = t[(j + 1) * SIDE + i]!;
  const d = t[(j + 1) * SIDE + i + 1]!;
  return (a + (b - a) * fx) * (1 - fz) + (c + (d - c) * fx) * fz;
}

/** Walkable ground: never below the water, so creatures wade rather than sink. */
export function standHeight(x: number, z: number): number {
  return Math.max(groveHeight(x, z), WATER_LEVEL + 0.02);
}

/** Slope (1 − normal.y) above which the 3D terrain paints rock; the mesh blends 0.2–0.5. */
const STONE_SLOPE = 0.35;
/** Height above which the rim reads as rock, the midpoint of the mesh's 5–10 blend. */
const STONE_HEIGHT = 7.5;

/**
 * The ground under (x, z): its height and what it is made of. Water is the pond and the
 * stream wherever the bed dips below WATER_LEVEL, and `y` is then the water surface.
 * Stone and path follow the 3D terrain's own rock and dirt blends at their midpoints.
 */
export function groundAt(world: World | null, x: number, z: number): Ground {
  // The world is not read yet. The bridge deck (R0002, surface 'deck') and the tops of
  // standable colliders (sim/obstacles.ts) plug in here, checked before the terrain below.
  void world;
  const bed = groveHeight(x, z);
  if (bed < WATER_LEVEL) return { y: WATER_LEVEL, surface: 'water' };
  const e = 0.25;
  const gx = (groveHeight(x + e, z) - groveHeight(x - e, z)) / (2 * e);
  const gz = (groveHeight(x, z + e) - groveHeight(x, z - e)) / (2 * e);
  const slope = 1 - 1 / Math.sqrt(1 + gx * gx + gz * gz);
  if (slope > STONE_SLOPE || bed > STONE_HEIGHT) return { y: bed, surface: 'stone' };
  if (pathDistance(x, z) < (GROVE3D.pathWidth + 1.9) / 2) return { y: bed, surface: 'path' };
  return { y: bed, surface: 'grass' };
}

/**
 * The Pixel hill terraces: three stacked tiers per hill, each a little smaller, as
 * [radius, height, base y]. The tops land at 0.42, 0.76 and 1.0 of the hill's height.
 */
export function pixelTiers(h: {
  r: number;
  h: number;
}): Array<[radius: number, height: number, base: number]> {
  return [
    [h.r, h.h * 0.42, 0],
    [h.r * 0.74, h.h * 0.34, h.h * 0.42],
    [h.r * 0.5, h.h * 0.24, h.h * 0.76],
  ];
}

/** The top of the highest Pixel terrace under (x, z), or 0 off every hill. */
export function pixelTierHeight(x: number, z: number): number {
  let y = 0;
  for (const h of GROVE.hills) {
    const d = Math.hypot(x - h.x, z - h.z);
    for (const [r, height, base] of pixelTiers(h)) if (d < r) y = Math.max(y, base + height);
  }
  return y;
}
