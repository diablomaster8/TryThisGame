import { AMBIENT_LIFE } from '../config/tuning-r11d8';
import { WORLD_STREAM } from '../config/tuning-world';

/**
 * R0128 (WORLD-62): the shared, pure part of the ambient life. Birds, butterflies and fish
 * shadows are placed per chunk from a hash of the region and chunk (so every device sees the
 * same ones) and move by closed-form paths of the clock, so there is no per-animal state and
 * a frame allocates nothing: `ambientPos` writes into a scratch record. Both renderers draw
 * from `ambientFor`; neither makes anything tappable.
 */
export type AmbientKind = 0 | 1 | 2; // bird, butterfly, fish

export const BIRD: AmbientKind = 0;
export const BUTTERFLY: AmbientKind = 1;
export const FISH: AmbientKind = 2;

/** Records are [kind, homeX, homeZ, phase, speed, radius, height, colour] per animal. */
export const STRIDE = 8;

export interface AmbientPose {
  x: number;
  y: number;
  z: number;
  /** Heading, radians about Y (where it flies or swims). */
  yaw: number;
  /** 0 or 1: which wing frame (birds and butterflies). */
  frame: number;
  /** 0..1 wing opening, for a smooth flap in 3D. */
  open: number;
}

function h01(a: number, b: number, c: number): number {
  let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function regionNum(region: string): number {
  let n = 7;
  for (let i = 0; i < region.length; i++) n = (n * 31 + region.charCodeAt(i)) | 0;
  return n;
}

const cache = new Map<string, Float32Array>();

/** The records of one chunk (cached; the cache is cleared when it grows past a few dozen). */
export function ambientFor(region: string, cx: number, cz: number, phone: boolean): Float32Array {
  const key = `${region}:${cx},${cz}:${phone ? 1 : 0}`;
  const have = cache.get(key);
  if (have) return have;
  if (cache.size > 96) cache.clear();
  const spec = AMBIENT_LIFE.regions[region];
  const out: number[] = [];
  if (spec) {
    const rn = regionNum(region) ^ (cx * 7919) ^ (cz * 104729);
    const size = WORLD_STREAM.chunk;
    const share = phone ? 0.5 : 1;
    const put = (kind: AmbientKind, n: number, r: [number, number], hgt: [number, number]) => {
      for (let i = 0; i < n; i++) {
        const k = i * 13 + kind * 101;
        out.push(
          kind,
          (cx + 0.15 + h01(rn, k, 1) * 0.7) * size,
          (cz + 0.15 + h01(rn, k, 2) * 0.7) * size,
          h01(rn, k, 3) * Math.PI * 2,
          0.5 + h01(rn, k, 4) * 0.7,
          r[0] + h01(rn, k, 5) * (r[1] - r[0]),
          hgt[0] + h01(rn, k, 6) * (hgt[1] - hgt[0]),
          Math.floor(h01(rn, k, 7) * 3),
        );
      }
    };
    if (spec.birds) put(BIRD, Math.floor(AMBIENT_LIFE.perChunk.birds * share), [3, 6], [5, 8]);
    if (spec.butterflies)
      put(BUTTERFLY, Math.floor(AMBIENT_LIFE.perChunk.butterflies * share), [1.5, 3.5], [0.5, 1.2]);
    // Fish keep to a pond that overlaps this chunk.
    for (const w of spec.water) {
      if (w.x + w.r < cx * size || w.x - w.r > (cx + 1) * size) continue;
      if (w.z + w.r < cz * size || w.z - w.r > (cz + 1) * size) continue;
      const n = Math.floor(AMBIENT_LIFE.perChunk.fish * share);
      for (let i = 0; i < n; i++) {
        const k = i * 17 + 303;
        out.push(
          FISH,
          w.x,
          w.z,
          h01(rn, k, 3) * 6.28,
          0.25 + h01(rn, k, 4) * 0.3,
          w.r * (0.35 + h01(rn, k, 5) * 0.4),
          0,
          0,
        );
      }
    }
  }
  const arr = Float32Array.from(out);
  cache.set(key, arr);
  return arr;
}

/** Where animal `i` of `rec` is at time `t` seconds. Writes into `out`; allocates nothing. */
export function ambientPos(
  rec: Float32Array,
  i: number,
  t: number,
  still: boolean,
  out: AmbientPose,
): void {
  const o = i * STRIDE;
  const kind = rec[o]!;
  const hx = rec[o + 1]!;
  const hz = rec[o + 2]!;
  const ph = rec[o + 3]!;
  const sp = rec[o + 4]!;
  const r = rec[o + 5]!;
  const hy = rec[o + 6]!;
  const tt = still ? 0 : t;
  if (kind === BIRD) {
    const a = ph + tt * sp * 0.22;
    out.x = hx + Math.cos(a) * r;
    out.z = hz + Math.sin(a) * r;
    out.y = hy + Math.sin(tt * 0.6 + ph) * 0.4;
    out.yaw = -a - Math.PI / 2;
    const w = Math.sin(tt * AMBIENT_LIFE.flap.bird * sp + ph);
    out.open = 0.5 + 0.5 * w;
    out.frame = w > 0 ? 1 : 0;
  } else if (kind === BUTTERFLY) {
    const a = ph + tt * sp * 0.5;
    out.x = hx + Math.sin(a) * r + Math.sin(a * 2.3) * r * 0.35;
    out.z = hz + Math.cos(a * 0.9) * r + Math.cos(a * 1.7) * r * 0.3;
    out.y = hy + Math.sin(tt * 2.4 + ph) * 0.3;
    out.yaw = a;
    const w = Math.sin(tt * AMBIENT_LIFE.flap.butterfly + ph);
    out.open = 0.5 + 0.5 * w;
    out.frame = w > 0 ? 1 : 0;
  } else {
    const a = ph + tt * sp;
    out.x = hx + Math.cos(a) * r;
    out.z = hz + Math.sin(a * 1.3) * r * 0.7;
    out.y = 0;
    out.yaw = a;
    out.open = 1;
    out.frame = 0;
  }
}

/** Whether the sky and weather let the small things out: by day, in the dry. */
export function ambientAwake(phase: string, weather: string): boolean {
  return (phase === 'day' || phase === 'dawn') && weather === 'clear';
}
