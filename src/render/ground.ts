import type { CanvasTexture } from 'three';
import { GROVE } from '../config/tuning';
import { Rng } from '../sim/rng';
import type { TileKind } from '../sim/types';
import { fbm, ridged, warped } from './paint/noise';
import { hex, mix, Raster, shade, type RGB } from './paint/raster';
import { shoreDistance } from './paint/shore';
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
export function makeGroundTexture(seed = 7, tiles: Record<string, TileKind> = {}): CanvasTexture {
  const size = GROVE.size * GROUND_PPU;
  const r = new Raster(size, size, hex('#5f9e3c'));
  const half = GROVE.size / 2;
  const toWorld = (p: number) => p / GROUND_PPU - half;
  const toPx = (w: number) => (w + half) * GROUND_PPU;

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
  ];
  const banks: Seg[] = [
    ...segments(GROVE.river.inflow, GROVE.river.width / 2),
    ...segments(GROVE.river.outflow, GROVE.river.width / 2),
  ];
  const pool = { x: GROVE.waterfall.x - 3.6, z: GROVE.waterfall.z + 5.6, r: 1.6 };

  const grassA = hex('#4d9440');
  const grassB = hex('#8fcf62');
  const dry = hex('#b8c06a');
  const pathDark = hex('#9a8358');
  const pathLight = hex('#d9c08f');
  const stone = hex('#7f7f88');
  const sandWet = hex('#8c7b55');
  const sandDry = hex('#c9b784');
  const bankEdge = hex('#8f9a62');

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
      // Paths: the nearest segment, with a wandering width and edge.
      let best = 1e9;
      let bestW = 1;
      let bestT = 0;
      for (const s of paths) {
        const [d, t] = segDist(s, x, z);
        if (d < best) {
          best = d;
          bestW = s.w;
          bestT = t;
        }
      }
      if (best < bestW * 0.8 + 0.4) {
        const widthW = (bestW / 2) * (1 + (fbm(bestT * 9 + x * 0.1, z * 0.1, 3, 7) - 0.5) * 0.7);
        const edgeW = widthW * (0.75 + 0.5 * fbm(px / 14, py / 14, 3, 8));
        if (best < edgeW + 0.3) {
          const wear = fbm(px / 7, py / 7, 3, 9);
          if (best > edgeW) {
            c = mix(c, hex('#5a6a33'), 0.5 * (1 - (best - edgeW) / 0.3));
          } else {
            const centre = clamp01(1 - best / edgeW);
            let p = mix(pathDark, pathLight, centre * 0.7 + wear * 0.3);
            if (wear > 0.68) p = mix(p, stone, 0.6);
            if (wear < 0.3) p = shade(p, 0.86);
            c = p;
          }
        }
      }
      // Stream banks and the waterfall pool: sand with a wet band beside the water.
      let bankD = 1e9;
      for (const s of banks) bankD = Math.min(bankD, segDist(s, x, z)[0] - s.w);
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
    const cy = toPx(b.z) + (id === 'well' ? 0 : 0.6 * GROUND_PPU);
    const rw = (id === 'well' ? 1.4 : 3.0) * GROUND_PPU;
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
    const w = 4 * GROUND_PPU;
    const h = 3 * GROUND_PPU;
    const rowH = GROUND_PPU * 0.75;
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
    const x0 = toPx(Number(xs)) - GROUND_PPU * 0.5;
    const y0 = toPx(Number(zs)) - GROUND_PPU * 0.5;
    for (let y = 0; y < GROUND_PPU; y++) {
      for (let x = 0; x < GROUND_PPU; x++) {
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

  const texture = r.toTexture(true);
  texture.flipY = true;
  return texture;
}
