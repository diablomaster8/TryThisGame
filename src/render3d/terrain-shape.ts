import * as THREE from 'three';
import { GROVE, GROVE3D } from '../config/tuning';
import { fbm } from '../render/paint/noise';

/**
 * The 3D Grove's ground as numbers, built from the same GROVE numbers the pixel ground
 * paints from: the hills are cosine bumps, the pond and the stream are dips, the outer
 * edge rises into a rim, and a faint noise roll keeps the meadow from reading as a plane.
 * `groveHeight` is the one sampler everything stands on; `terrainArrays` is the mesh
 * built from it. No materials here, so the terrain worker can load it.
 */

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
  const t = THREE.MathUtils.clamp(((x - ax) * dx + (z - az) * dz) / len2, 0, 1);
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
  for (const h of GROVE.hills) {
    const d = Math.hypot(x - h.x, z - h.z) / h.r;
    if (d < 1) y += h.h * 0.5 * (1 + Math.cos(d * Math.PI));
  }
  const edge = Math.max(Math.abs(x), Math.abs(z));
  const rim = THREE.MathUtils.smoothstep(edge, GROVE3D.rimStart, GROVE.size / 2 + 6);
  y += rim * rim * GROVE3D.rimHeight * (0.8 + fbm(x / 6, z / 6, 2, 71) * 0.4);
  y += fbm(x / 11, z / 11, 3, 72) * 0.5 - 0.22;
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

/** The full sum, for the terrain mesh itself and for the height tiles. */
export function exactHeight(x: number, z: number): number {
  let y = landHeight(x, z);
  const pond = GROVE.pond;
  const pd = Math.hypot(x - pond.x, z - pond.z) / (pond.r + 0.6);
  if (pd < 1) y -= GROVE3D.pondDepth * (1 - THREE.MathUtils.smoothstep(pd, 0.55, 1));
  const rd = riverDistance(x, z) / (GROVE.river.width * 0.5 + 0.5);
  if (rd < 1) y -= GROVE3D.riverDepth * (1 - THREE.MathUtils.smoothstep(rd, 0.5, 1));
  return y;
}

/** Height the water surface sits at: the pond and stream share one level. */
export const WATER_LEVEL = -0.32;

/** Walkable ground: never below the water, so creatures wade rather than sink. */
export function standHeight(x: number, z: number): number {
  return Math.max(groveHeight(x, z), WATER_LEVEL + 0.02);
}

/** The terrain mesh's buffers, as `terrain.ts` pours them into its geometry. */
export interface TerrainArrays {
  position: Float32Array;
  normal: Float32Array;
  uv: Float32Array;
  blend: Float32Array;
  index: Uint16Array | Uint32Array;
}

/** Side of the terrain square, in world units, and its grid. */
export const TERRAIN_SIZE = GROVE.size + 16;
export const TERRAIN_SEGS = 224;

/** Heights, normals and the rock/dirt blend for every vertex of the terrain grid. */
export function terrainArrays(): TerrainArrays {
  const geo = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, TERRAIN_SEGS, TERRAIN_SEGS);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const uv = geo.attributes.uv as THREE.BufferAttribute;
  const blend = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    pos.setY(i, exactHeight(x, z));
    uv.setXY(i, x / 3.2, z / 3.2);
  }
  geo.computeVertexNormals();
  const nrm = geo.attributes.normal as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    const slope = 1 - nrm.getY(i);
    const y = pos.getY(i);
    // Steep faces and the rim go to rock; the stream bed and the paths go to dirt.
    const rock = THREE.MathUtils.smoothstep(slope, 0.2, 0.5) + THREE.MathUtils.smoothstep(y, 5, 10);
    const path = 1 - THREE.MathUtils.smoothstep(pathDistance(x, z), GROVE3D.pathWidth, 1.9);
    const bed = 1 - THREE.MathUtils.smoothstep(riverDistance(x, z), 0.9, 1.9);
    blend[i * 2] = Math.min(1, rock);
    blend[i * 2 + 1] = Math.max(path, bed);
  }
  return {
    position: pos.array as Float32Array,
    normal: nrm.array as Float32Array,
    uv: uv.array as Float32Array,
    blend,
    index: geo.index!.array as Uint16Array | Uint32Array,
  };
}
