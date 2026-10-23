import { CanvasTexture, NearestFilter, SRGBColorSpace } from 'three';
import { GROVE } from '../config/tuning';
import { Rng } from '../sim/rng';
import type { TileKind } from '../sim/types';
import { fbm, ridged, warped } from './paint/noise';
import { hash, hex, mix, Raster, shade, type RGB } from './paint/raster';
import { shoreDistance } from './paint/shore';
import { CG2_W } from '../config/tuning-w';
import { CG4_D4 } from '../config/tuning-d4';
import { BUILDINGS } from './scenery';

/** Texels per world unit on the ground texture. */
export const GROUND_PPU = 16;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

interface Seg {
  ax: number;
  az: number;
  bx: number;
  bz: number;
  w: number;
}

function segments(points: ReadonlyArray<{ x: number; z: number }>, w: number): Seg[] {
  const out: Seg[] = [];
  for (let i = 0; i + 1 < points.length; i++) {
    const a = points[i]!;
    const b = points[i + 1]!;
    out.push({ ax: a.x, az: a.z, bx: b.x, bz: b.z, w });
  }
  return out;
}

/** Distance from a point to a segment, and the fraction along it. */
function segDist(s: Seg, x: number, z: number): [number, number] {
  const dx = s.bx - s.ax;
  const dz = s.bz - s.az;
  const len2 = dx * dx + dz * dz || 1;
  const t = clamp01(((x - s.ax) * dx + (z - s.az) * dz) / len2);
  const px = s.ax + dx * t;
  const pz = s.az + dz * t;
  return [Math.hypot(x - px, z - pz), t];
}

/**
 * The Grove floor as one painted texture in the organic style: greens blended by
 * domain-warped noise with dry patches, blades and flowers from finer fields, paths
 * whose width and edges wander with ruts and stones, a noise shoreline with a wet band,
 * stream banks, scree at the hill feet, stone pads under the buildings, a crop plot,
 * and the painted tiles. Drawn once from a fixed seed; the plane maps to it 1:1.
 */
export interface GroundPixels {
  width: number;
  height: number;
  rgba: Uint8Array;
}

/** The season the ground is painted for: winter frosts it (H8); anything else is the base. */
export type GroundSeason = 'winter' | null;

/**
 * H8: winter on the painted ground. Grass loses most of its green (towards a cold grey-blue),
 * and flecks of frost lie on it and, thinner, on the paths; sand, stone and soil keep their
 * colour. A pure pass over the finished raster, so the worker does it with the rest.
 */
function frostGround(r: Raster): void {
  const cold = hex('#a3b3c0');
  const frost = hex('#eef5fb');
  const { groundDesat, groundFleck } = CG2_W.winter;
  for (let y = 0; y < r.h; y++)
    for (let x = 0; x < r.w; x++) {
      const c = r.get(x, y);
      // Grass is green over red and blue; paths and sand are not.
      const green = c[1] > c[0] * 1.08 && c[1] > c[2] * 1.15;
      let out = c;
      if (green) {
        const grey = (c[0] + c[1] + c[2]) / 3;
        out = mix(c, mix([grey, grey * 1.02, grey * 1.06], cold, 0.5), groundDesat);
      }
      const n = hash(x >> 1, y >> 1, 77);
      if (n < (green ? groundFleck : groundFleck * 0.4)) out = mix(out, frost, 0.8);
      else if (n > 0.93 && green) out = mix(out, frost, 0.3);
      if (out !== c) r.set(x, y, out);
    }
}

/**
 * K25: snow lying on the ground at a level 1..3: patchy at first, then most of the grass, then
 * a full white cover with only the paths and banks showing through. A pure pass over the
 * finished raster, so the worker does it with the rest.
 */
function snowGround(r: Raster, level: number): void {
  const frac = CG4_D4.snow.cover[Math.min(3, level) - 1] ?? 1;
  const white = hex('#f2f7fc');
  const shadow = hex('#d6e1ee');
  for (let y = 0; y < r.h; y++)
    for (let x = 0; x < r.w; x++) {
      const c = r.get(x, y);
      const v = 0.62 * fbm(x / 13, y / 13, 3, 91) + 0.38 * hash(x >> 1, y >> 1, 93);
      // Paths hold the snow less than the grass does.
      const path = c[0] > c[1] * 0.95 && c[0] > c[2] * 1.2;
      if (v > (path ? frac * 0.5 : frac)) continue;
      const tone = hash(x, y, 95) > 0.8 ? shadow : white;
      r.set(x, y, mix(c, tone, 0.92));
    }
}

/** The painting itself, pure: safe to run in a worker. `ppu` sets the detail. */
export function paintGround(
  seed = 7,
  tiles: Record<string, TileKind> = {},
  ppu: number = GROUND_PPU,
  season: GroundSeason = null,
  /** K25: snow cover level 0..3 (three repaints, switched at the vigil's waves). */
  snow = 0,
  /** K26: path wear level 0..3 (wider, barer paths as the chapters pass). */
  wearLevel = 0,
): GroundPixels {
  const wearK = wearLevel / 3;
  const size = GROVE.size * ppu;
  const r = new Raster(size, size, hex('#5f9e3c'));
  const half = GROVE.size / 2;
  const toWorld = (p: number) => p / ppu - half;
  const toPx = (w: number) => (w + half) * ppu;

  const start = GROVE.keeperStart;
  const [t1, t2] = GROVE.trees;
  const bridge = GROVE.bridge;
  const pond = GROVE.pond;
  const paths: Seg[] = [
    ...segments([start, { x: pond.x - pond.r - 1.4, z: pond.z - 1 }], 1.7),
    ...segments([start, { x: t1!.x + 1.6, z: t1!.z + 1.6 }], 1.2),
    ...segments([start, { x: 3, z: -3 }, { x: bridge.x - 1.6, z: bridge.z - 0.6 }], 1.2),
    ...segments(
      [
        { x: bridge.x + 1.6, z: bridge.z + 0.6 },
        { x: 13.5, z: -6.5 },
        { x: BUILDINGS.dojo!.x - 1, z: BUILDINGS.dojo!.z + 1.8 },
      ],
      1.0,
    ),
    ...segments(
      [
        { x: 3, z: -3 },
        { x: t2!.x - 1.6, z: t2!.z + 1.6 },
        { x: BUILDINGS.school!.x + 0.5, z: BUILDINGS.school!.z + 2 },
      ],
      1.0,
    ),
    ...segments(
      [start, { x: -3, z: 9 }, { x: BUILDINGS.cottage!.x + 0.5, z: BUILDINGS.cottage!.z - 1.8 }],
      1.1,
    ),
    ...segments(
      [
        { x: -3, z: 9 },
        { x: BUILDINGS.well!.x - 1.2, z: BUILDINGS.well!.z },
      ],
      0.8,
    ),
    ...segments(
      [
        { x: -8, z: -2 },
        { x: -13, z: 6 },
        { x: GROVE.trees[2]!.x + 1.8, z: GROVE.trees[2]!.z + 1.4 },
      ],
      0.9,
    ),
    ...segments(
      [
        { x: -8, z: -2 },
        { x: BUILDINGS.windmill!.x + 0.5, z: BUILDINGS.windmill!.z + 2 },
      ],
      0.8,
    ),
    // The outer ring: tracks out to the wood, the ridge, the marsh and the meadow.
    ...segments(
      [
        { x: BUILDINGS.school!.x - 2, z: BUILDINGS.school!.z - 1 },
        { x: -12, z: -26 },
        { x: -22, z: -30 },
        { x: -30, z: -34 },
      ],
      0.8,
    ),
    ...segments(
      [
        { x: BUILDINGS.dojo!.x + 1, z: BUILDINGS.dojo!.z - 3 },
        { x: 24, z: -14 },
        { x: 30, z: -24 },
      ],
      0.8,
    ),
    ...segments(
      [
        { x: BUILDINGS.dojo!.x + 2, z: BUILDINGS.dojo!.z + 3 },
        { x: 24, z: 10 },
        { x: 26, z: 22 },
        { x: 26, z: 34 },
      ],
      0.8,
    ),
    ...segments(
      [
        { x: BUILDINGS.well!.x, z: BUILDINGS.well!.z + 2 },
        { x: 2, z: 20 },
        { x: 4, z: 30 },
        { x: 6, z: 38 },
      ],
      0.8,
    ),
    ...segments(
      [
        { x: BUILDINGS.cottage!.x - 3, z: BUILDINGS.cottage!.z + 4 },
        { x: -16, z: 22 },
        { x: -24, z: 18 },
        { x: -32, z: 16 },
        { x: -40, z: 22 },
      ],
      0.8,
    ),
  ];
  // Every segment's box, grown by its reach, so most texels skip most segments.
  const pathBox = paths.map((s) => ({
    x0: Math.min(s.ax, s.bx) - s.w - 0.9,
    x1: Math.max(s.ax, s.bx) + s.w + 0.9,
    z0: Math.min(s.az, s.bz) - s.w - 0.9,
    z1: Math.max(s.az, s.bz) + s.w + 0.9,
  }));
  const banks: Seg[] = [
    ...segments(GROVE.river.inflow, GROVE.river.width / 2),
    ...segments(GROVE.river.outflow, GROVE.river.width / 2),
  ];
  const pool = { x: GROVE.waterfall.x - 3.6, z: GROVE.waterfall.z + 5.6, r: 1.6 };
  const bankBox = banks.map((s) => ({
    x0: Math.min(s.ax, s.bx) - s.w - 2.5,
    x1: Math.max(s.ax, s.bx) + s.w + 2.5,
    z0: Math.min(s.az, s.bz) - s.w - 2.5,
    z1: Math.max(s.az, s.bz) + s.w + 2.5,
  }));

  const grassA = hex('#4d9440');
  const grassB = hex('#8fcf62');
  const dry = hex('#b8c06a');
  const pathDark = hex('#9a8358');
  const pathLight = hex('#d9c08f');
  const stone = hex('#7f7f88');
  const sandWet = hex('#8c7b55');
  const sandDry = hex('#c9b784');
  const bankEdge = hex('#8f9a62');
  const marshGreen = hex('#4f6e38');
  const mudBrown = hex('#5a4a30');
  const puddle = hex('#4f7a94');
  const meadowGreen = hex('#7fcb58');

  // The slow, smooth fields (the warped drifts and the dry patches) are sampled on a coarse
  // grid and read back bilinearly; only the fine grain is computed per texel.
  const step = 6;
  const cols = Math.ceil(size / step) + 1;
  const driftGrid = new Float32Array(cols * cols);
  const dryGrid = new Float32Array(cols * cols);
  for (let gy = 0; gy < cols; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      driftGrid[gy * cols + gx] = warped((gx * step) / 90, (gy * step) / 90, 0.8, 1);
      dryGrid[gy * cols + gx] = fbm((gx * step) / 140 + 7, (gy * step) / 140, 3, 3);
    }
  }
  const sample = (grid: Float32Array, px: number, py: number) => {
    const fx = px / step;
    const fy = py / step;
    const x0 = Math.floor(fx);
    const y0 = Math.floor(fy);
    const tx = fx - x0;
    const ty = fy - y0;
    const i = y0 * cols + x0;
    const a = grid[i] ?? 0;
    const b = grid[i + 1] ?? a;
    const c = grid[i + cols] ?? a;
    const d = grid[i + cols + 1] ?? a;
    return (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty;
  };
  for (let py = 0; py < size; py++) {
    const z = toWorld(py + 0.5);
    for (let px = 0; px < size; px++) {
      const x = toWorld(px + 0.5);
      const n = sample(driftGrid, px, py);
      const fine = fbm(px / 9, py / 9, 2, 2);
      const dryN = sample(dryGrid, px, py);
      let c = mix(grassA, grassB, clamp01((n - 0.3) * 1.8));
      c = mix(c, dry, clamp01((dryN - 0.62) * 4));
      c = shade(c, 0.86 + fine * 0.3);
      // The outer ring's regions: the south marsh is wetter and darker with mud and
      // puddles; the west meadow is lusher; the north wood's floor is shaded.
      const marsh = clamp01((z - 24) / 8) * clamp01(1 - Math.abs(x - 8) / 16);
      if (marsh > 0) {
        c = mix(c, marshGreen, marsh * 0.7);
        const mud = fbm(px / 36 + 50, py / 36, 2, 71);
        if (mud > 0.6) c = mix(c, mudBrown, marsh * clamp01((mud - 0.6) * 4));
        if (mud < 0.36 && fine > 0.5) c = mix(c, puddle, marsh * 0.8);
      }
      const meadow = clamp01((-x - 22) / 8) * clamp01(1 - Math.abs(z - 20) / 20);
      if (meadow > 0) c = mix(c, meadowGreen, meadow * 0.45);
      const wood = clamp01((-z - 22) / 8) * clamp01((-x - 10) / 10);
      if (wood > 0) c = shade(c, 1 - wood * 0.18);
      // Paths: the nearest segment, with a wandering width and edge.
      let best = 1e9;
      let bestW = 1;
      let bestT = 0;
      for (let si = 0; si < paths.length; si++) {
        const box = pathBox[si]!;
        if (x < box.x0 || x > box.x1 || z < box.z0 || z > box.z1) continue;
        const s = paths[si]!;
        const [d, t] = segDist(s, x, z);
        if (d < best) {
          best = d;
          bestW = s.w;
          bestT = t;
        }
      }
      // K26: wear widens the paths and bares them (more soil, less grass at the edge).
      const wide = 1 + wearK * CG4_D4.wear.widen;
      if (best < (bestW * 0.8 + 0.4) * wide) {
        const widthW =
          (bestW / 2) * wide * (1 + (fbm(bestT * 9 + x * 0.1, z * 0.1, 3, 7) - 0.5) * 0.7);
        const edgeW = widthW * (0.75 + 0.5 * fbm(px / 14, py / 14, 3, 8));
        if (best < edgeW + 0.3) {
          const wear = fbm(px / 7, py / 7, 3, 9);
          if (best > edgeW) {
            c = mix(c, hex('#5a6a33'), 0.5 * (1 - (best - edgeW) / 0.3));
          } else {
            const centre = clamp01(1 - best / edgeW);
            let p = mix(pathDark, pathLight, centre * 0.7 + wear * 0.3 - wearK * 0.18);
            if (wear > 0.68) p = mix(p, stone, 0.6);
            if (wear < 0.3) p = shade(p, 0.86);
            c = p;
          }
        }
      }
      // Stream banks and the waterfall pool: sand with a wet band beside the water.
      let bankD = 1e9;
      for (let bi = 0; bi < banks.length; bi++) {
        const box = bankBox[bi]!;
        if (x < box.x0 || x > box.x1 || z < box.z0 || z > box.z1) continue;
        bankD = Math.min(bankD, segDist(banks[bi]!, x, z)[0] - banks[bi]!.w);
      }
      bankD = Math.min(bankD, Math.hypot(x - pool.x, z - pool.z) - pool.r);
      const bankNoise = fine;
      if (bankD < 0.9 + bankNoise * 0.5) {
        c = mix(sandWet, sandDry, clamp01(bankD / 0.9) * 0.6 + bankNoise * 0.4);
      } else if (bankD < 1.5 + bankNoise * 0.6) {
        c = mix(c, bankEdge, 0.6 * (1 - (bankD - 0.9) / 0.9));
      }
      // The pond's shore: a noise shoreline, a wet band, a dry bank fading into grass.
      const sd = shoreDistance(x, z);
      if (sd < 1.4 + bankNoise * 0.6) {
        if (sd < 0.35) c = mix(sandWet, sandDry, bankNoise * 0.5);
        else if (sd < 0.8 + bankNoise * 0.3) {
          c = mix(sandWet, sandDry, clamp01((sd - 0.35) / 0.5) * 0.7 + bankNoise * 0.3);
        } else c = mix(c, bankEdge, 0.7 * clamp01(1 - (sd - 0.8) / 0.9));
      }
      // Scree at the hill feet.
      for (const h of GROVE.hills) {
        const d = Math.hypot(x - h.x, z - h.z) - h.r;
        if (d > -0.2 && d < 1.3) {
          const g = ridged(px / 5, py / 5, 2, 13);
          if (g > 0.72 - d * 0.2) {
            c = mix(c, mix(hex('#5a5a66'), hex('#a8a8b2'), fbm(px / 4, py / 4, 2, 14)), 0.8);
          } else c = shade(c, 0.9);
        }
      }
      r.set(px, py, c);
    }
  }

  // Blades where a finer field is high; flowers in drifts. Paths and sand are skipped.
  const rng = new Rng(seed);
  const isGrass = (c: RGB) => c[1] > c[0];
  const blades = Math.round(size * size * 0.05);
  for (let i = 0; i < blades; i++) {
    const px = rng.int(0, size - 1);
    const py = rng.int(0, size - 1);
    const n = fbm(px / 22, py / 22, 3, 4);
    if (rng.next() > n * 1.3) continue;
    const base = r.get(px, py);
    if (!isGrass(base)) continue;
    const len = 1 + Math.round(n * 2);
    r.line(px, py, px + rng.float(-1, 1), py - len, shade(base, 1.22), 0.9);
    r.set(px, py + 1, shade(base, 0.8), 0.5);
  }
  for (let i = 0; i < Math.round(size * 0.8); i++) {
    const px = rng.int(0, size - 1);
    const py = rng.int(0, size - 1);
    if (fbm(px / 40 + 3, py / 40, 3, 5) < 0.6) continue;
    if (!isGrass(r.get(px, py))) continue;
    const c = [hex('#ff8ab0'), hex('#ffe066'), hex('#ffffff'), hex('#c9a0ff')][rng.int(0, 3)]!;
    r.set(px, py, c);
    r.set(px + 1, py, shade(c, 0.85), 0.8);
    r.set(px, py + 1, hex('#2f6f32'), 0.6);
  }

  // Stone pads under the buildings and the well.
  for (const [id, b] of Object.entries(BUILDINGS)) {
    const cx = toPx(b.x);
    const cy = toPx(b.z) + (id === 'well' ? 0 : 0.6 * ppu);
    const rw = (id === 'well' ? 1.4 : 3.0) * ppu;
    for (let yy = -rw * 0.6; yy <= rw * 0.6; yy++) {
      for (let xx = -rw; xx <= rw; xx++) {
        const rr =
          Math.hypot(xx / rw, yy / (rw * 0.55)) + (fbm(xx / 10, yy / 4, 2, 31) - 0.5) * 0.4;
        if (rr > 1) continue;
        const g = ridged(xx / 5, yy / 5, 2, 36);
        let c = mix(hex('#8a8a96'), hex('#c2c2cc'), fbm(xx / 4, yy / 4, 2, 37));
        if (g > 0.8) c = hex('#55555f');
        if (rr > 0.86) c = mix(c, hex('#5f8a3a'), 0.5);
        r.set(cx + xx, cy + yy, c);
      }
    }
  }

  // A crop plot by the cottage: dark soil rows with sprouts.
  {
    const px0 = toPx(BUILDINGS.cottage!.x - 3);
    const py0 = toPx(BUILDINGS.cottage!.z + 3);
    const w = 4 * ppu;
    const h = 3 * ppu;
    const rowH = ppu * 0.75;
    for (let y = -1; y < h + 1; y++) {
      for (let x = -1; x < w + 1; x++) {
        const edge = x < 0 || y < 0 || x >= w || y >= h;
        const row = Math.floor(y / rowH);
        const fy = (y % rowH) / rowH;
        let c = mix(hex('#3a2616'), hex('#6e4a2a'), fbm(x / 5, y / 5, 2, 41));
        if (fy < 0.35) c = shade(c, 1.25);
        if (edge) c = hex('#2f4d26');
        r.set(px0 + x, py0 + y, c);
        if (!edge && fy > 0.4 && fy < 0.6 && (x + row * 3) % 5 === 0) {
          r.set(px0 + x, py0 + y - 1, hex('#8fd262'));
          r.set(px0 + x, py0 + y - 2, hex('#b9e884'));
        }
      }
    }
  }

  // Painted tiles: one-unit squares of dirt, water, flowers or stone laid on top.
  for (const [key, tile] of Object.entries(tiles)) {
    const [xs, zs] = key.split(',');
    const x0 = toPx(Number(xs)) - ppu * 0.5;
    const y0 = toPx(Number(zs)) - ppu * 0.5;
    for (let y = 0; y < ppu; y++) {
      for (let x = 0; x < ppu; x++) {
        const n = fbm((x0 + x) / 5, (y0 + y) / 5, 2, 51);
        let c: RGB;
        if (tile === 'dirt') c = mix(pathDark, pathLight, n);
        else if (tile === 'water') c = mix(hex('#1d4a86'), hex('#7fc0e8'), n * 0.6);
        else if (tile === 'flowers') {
          c = mix(grassA, grassB, n);
          if (n > 0.6) c = [hex('#ff8ab0'), hex('#ffe066'), hex('#ffffff')][(x + y) % 3]!;
        } else if (tile === 'stone') c = mix(hex('#7a7a88'), hex('#c2c2cc'), n);
        else c = mix(grassA, grassB, n);
        r.set(x0 + x, y0 + y, c);
      }
    }
  }

  if (season === 'winter') frostGround(r);
  if (snow > 0) snowGround(r, snow);
  return r.toRgba(1, true);
}

/** The painting as a texture, on the main thread (the tools and the placeholder). */
export function makeGroundTexture(
  seed = 7,
  tiles: Record<string, TileKind> = {},
  ppu: number = GROUND_PPU,
): CanvasTexture {
  return groundTexture(paintGround(seed, tiles, ppu));
}

/** Wrap painted pixels (from here or a worker) as the ground texture. */
export function groundTexture(p: GroundPixels): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = p.width;
  canvas.height = p.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas context unavailable');
  const image = ctx.createImageData(p.width, p.height);
  image.data.set(p.rgba);
  ctx.putImageData(image, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = SRGBColorSpace;
  texture.flipY = true;
  texture.needsUpdate = true;
  return texture;
}
