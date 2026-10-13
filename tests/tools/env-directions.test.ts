/**
 * Five art directions for the environment, each a different way of making the same
 * vignette (cottage, tree, path, pond corner, fence, bush), rendered in full colour so
 * the direction can be chosen before any palette work:
 *
 *   PREVIEW_DIRECTIONS=path/to/dir npx vitest run tests/tools/env-directions.test.ts
 *
 * 1 tile-grid 16-bit · 2 painterly hi-bit · 3 HD-2D post-processed · 4 chunky limited
 * palette · 5 dynamically lit dusk. Writes dir-1.png … dir-5.png.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { Rng } from '../../src/sim/rng';
import { encodePng } from './png';

type RGB = [number, number, number];

function hex(h: string): RGB {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
function mix(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}
function shade(c: RGB, f: number): RGB {
  return [Math.min(1, c[0] * f), Math.min(1, c[1] * f), Math.min(1, c[2] * f)];
}
function hash(x: number, y: number, salt = 0): number {
  let h = (x * 374761393 + y * 668265263 + salt * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** A small full-colour raster with the few primitives the samples need. */
class Raster {
  readonly data: Float32Array;
  constructor(
    readonly w: number,
    readonly h: number,
    bg: RGB,
  ) {
    this.data = new Float32Array(w * h * 3);
    for (let i = 0; i < w * h; i++) this.data.set(bg, i * 3);
  }
  get(x: number, y: number): RGB {
    const i = (y * this.w + x) * 3;
    return [this.data[i] ?? 0, this.data[i + 1] ?? 0, this.data[i + 2] ?? 0];
  }
  set(x: number, y: number, c: RGB, a = 1): void {
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = (y * this.w + x) * 3;
    if (a >= 1) this.data.set(c, i);
    else {
      this.data[i] = (this.data[i] ?? 0) * (1 - a) + c[0] * a;
      this.data[i + 1] = (this.data[i + 1] ?? 0) * (1 - a) + c[1] * a;
      this.data[i + 2] = (this.data[i + 2] ?? 0) * (1 - a) + c[2] * a;
    }
  }
  rect(x: number, y: number, w: number, h: number, c: RGB, a = 1): void {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c, a);
  }
  ellipse(cx: number, cy: number, rx: number, ry: number, c: RGB, a = 1): void {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const dx = (x - cx) / rx;
        const dy = (y - cy) / ry;
        if (dx * dx + dy * dy <= 1) this.set(x, y, c, a);
      }
    }
  }
  disc(cx: number, cy: number, r: number, c: RGB, a = 1): void {
    this.ellipse(cx, cy, r, r, c, a);
  }
  line(x0: number, y0: number, x1: number, y1: number, c: RGB, a = 1): void {
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0)));
    for (let i = 0; i <= n; i++) this.set(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, c, a);
  }
  tri(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, c: RGB, a = 1): void {
    const minX = Math.floor(Math.min(ax, bx, cx));
    const maxX = Math.ceil(Math.max(ax, bx, cx));
    const minY = Math.floor(Math.min(ay, by, cy));
    const maxY = Math.ceil(Math.max(ay, by, cy));
    const area = (bx - ax) * (cy - ay) - (cx - ax) * (by - ay);
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        const w0 = ((bx - x) * (cy - y) - (cx - x) * (by - y)) / area;
        const w1 = ((cx - x) * (ay - y) - (ax - x) * (cy - y)) / area;
        const w2 = 1 - w0 - w1;
        if (w0 >= 0 && w1 >= 0 && w2 >= 0) this.set(x, y, c, a);
      }
    }
  }
  /** A vertical gradient fill of a rectangle. */
  gradient(x: number, y: number, w: number, h: number, top: RGB, bottom: RGB): void {
    for (let j = 0; j < h; j++) {
      const c = mix(top, bottom, j / Math.max(1, h - 1));
      for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
    }
  }
  /** Dithered gradient: a checker between two colours by threshold. */
  dither(x: number, y: number, w: number, h: number, top: RGB, bottom: RGB, steps: number): void {
    for (let j = 0; j < h; j++) {
      const t = j / Math.max(1, h - 1);
      for (let i = 0; i < w; i++) {
        const q = Math.floor(t * steps);
        const frac = t * steps - q;
        const bayer = ((x + i) % 2) * 0.5 + ((y + j) % 2) * 0.25;
        const k = (frac > bayer ? q + 1 : q) / steps;
        this.set(x + i, y + j, mix(top, bottom, Math.min(1, k)));
      }
    }
  }
  multiply(x: number, y: number, f: RGB): void {
    const c = this.get(x, y);
    this.set(x, y, [c[0] * f[0], c[1] * f[1], c[2] * f[2]]);
  }
  toRgba(scale: number): { width: number; height: number; rgba: Uint8Array } {
    const width = this.w * scale;
    const height = this.h * scale;
    const rgba = new Uint8Array(width * height * 4);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = ((y / scale) | 0) * this.w + ((x / scale) | 0);
        const o = (y * width + x) * 4;
        rgba[o] = Math.round(Math.min(1, this.data[i * 3] ?? 0) * 255);
        rgba[o + 1] = Math.round(Math.min(1, this.data[i * 3 + 1] ?? 0) * 255);
        rgba[o + 2] = Math.round(Math.min(1, this.data[i * 3 + 2] ?? 0) * 255);
        rgba[o + 3] = 255;
      }
    }
    return { width, height, rgba };
  }
}

// ---------------------------------------------------------------- post-processing

function boxBlur(r: Raster, radius: number, rows: (y: number) => number): void {
  const src = new Float32Array(r.data);
  for (let y = 0; y < r.h; y++) {
    const amt = rows(y);
    if (amt <= 0) continue;
    const rad = Math.max(1, Math.round(radius * amt));
    for (let x = 0; x < r.w; x++) {
      let acc: RGB = [0, 0, 0];
      let n = 0;
      for (let dy = -rad; dy <= rad; dy++) {
        for (let dx = -rad; dx <= rad; dx++) {
          const xx = x + dx;
          const yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= r.w || yy >= r.h) continue;
          const i = (yy * r.w + xx) * 3;
          acc = [acc[0] + (src[i] ?? 0), acc[1] + (src[i + 1] ?? 0), acc[2] + (src[i + 2] ?? 0)];
          n++;
        }
      }
      const blurred: RGB = [acc[0] / n, acc[1] / n, acc[2] / n];
      const i = (y * r.w + x) * 3;
      const orig: RGB = [src[i] ?? 0, src[i + 1] ?? 0, src[i + 2] ?? 0];
      r.data.set(mix(orig, blurred, Math.min(1, amt)), i);
    }
  }
}

function bloom(r: Raster, threshold: number, radius: number, strength: number): void {
  const bright = new Raster(r.w, r.h, [0, 0, 0]);
  for (let y = 0; y < r.h; y++) {
    for (let x = 0; x < r.w; x++) {
      const c = r.get(x, y);
      const l = c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11;
      if (l > threshold) bright.set(x, y, shade(c, (l - threshold) / (1 - threshold)));
    }
  }
  boxBlur(bright, radius, () => 1);
  for (let y = 0; y < r.h; y++) {
    for (let x = 0; x < r.w; x++) {
      const c = r.get(x, y);
      const b = bright.get(x, y);
      r.set(x, y, [c[0] + b[0] * strength, c[1] + b[1] * strength, c[2] + b[2] * strength]);
    }
  }
}

function vignette(r: Raster, strength: number): void {
  for (let y = 0; y < r.h; y++) {
    for (let x = 0; x < r.w; x++) {
      const dx = (x / r.w - 0.5) * 2;
      const dy = (y / r.h - 0.5) * 2;
      const d = Math.sqrt(dx * dx + dy * dy);
      const f = 1 - Math.max(0, d - 0.55) * strength;
      r.multiply(x, y, [f, f, f]);
    }
  }
}

function grade(r: Raster, shadows: RGB, highlights: RGB): void {
  for (let y = 0; y < r.h; y++) {
    for (let x = 0; x < r.w; x++) {
      const c = r.get(x, y);
      const l = c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11;
      const tint = mix(shadows, highlights, l);
      r.set(x, y, [c[0] * tint[0], c[1] * tint[1], c[2] * tint[2]]);
    }
  }
}

// ---------------------------------------------------------------- shared layout

const W = 352;
const H = 240;
const LAYOUT = {
  house: { x: 118, y: 46, w: 110, h: 110, roofH: 46 },
  tree: { x: 48, base: 150, r: 30 },
  pond: { cx: 300, cy: 215, rx: 86, ry: 46 },
  fence: { x: 240, y: 92, n: 7 },
  bush1: { x: 262, base: 140 },
  bush2: { x: 70, base: 200 },
};

function pathPoints(): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  for (let t = 0; t <= 1; t += 0.01) {
    pts.push([16 + t * 300, 226 - Math.sin(t * Math.PI) * 74 - t * 14]);
  }
  return pts;
}

// ---------------------------------------------------------------- 1. tile-grid 16-bit

/**
 * A real tileset: 16 px tiles on a grid, autotiled dirt and water edges, buildings
 * assembled from wall/roof/window/door tiles, bright saturated colours, dark outlines on
 * objects, none on the ground. The look of Stardew Valley or Link's Awakening.
 */
function direction1(): Raster {
  const T = 16;
  const cols = W / T;
  const rows = H / T;
  const P = {
    grass: hex('#6abe30'),
    grassDark: hex('#4f9a2a'),
    grassLight: hex('#8fd44a'),
    dirt: hex('#c9a46a'),
    dirtDark: hex('#a3804c'),
    dirtLight: hex('#e3c48b'),
    water: hex('#3f8fe0'),
    waterDeep: hex('#2b6fc2'),
    foam: hex('#bfe6ff'),
    sand: hex('#e6d39a'),
    wall: hex('#f3e2b6'),
    wallShade: hex('#d9c08a'),
    beam: hex('#7a4a22'),
    roof: hex('#d6472e'),
    roofDark: hex('#a3321f'),
    roofLight: hex('#f27a4a'),
    glass: hex('#9fdcff'),
    glassDark: hex('#5aa6e0'),
    door: hex('#8a5a2b'),
    doorDark: hex('#5e3a18'),
    outline: hex('#2a1a2e'),
    trunk: hex('#7a4a22'),
    trunkDark: hex('#52301a'),
    leaf: hex('#3f9a3a'),
    leafDark: hex('#2a6f2e'),
    leafLight: hex('#6fcf5a'),
    wood: hex('#c98d4f'),
    woodDark: hex('#8a5a2b'),
    flower1: hex('#ff6b8a'),
    flower2: hex('#ffd84a'),
    white: hex('#ffffff'),
  };
  const r = new Raster(W, H, P.grass);
  // Ground tiles with three grass variants.
  for (let ty = 0; ty < rows; ty++) {
    for (let tx = 0; tx < cols; tx++) {
      const v = hash(tx, ty, 1);
      const x = tx * T;
      const y = ty * T;
      if (v < 0.3) {
        r.set(x + 4, y + 5, P.grassDark);
        r.set(x + 5, y + 5, P.grassDark);
        r.set(x + 11, y + 10, P.grassDark);
        r.set(x + 12, y + 10, P.grassDark);
      } else if (v < 0.55) {
        r.set(x + 7, y + 3, P.grassLight);
        r.set(x + 8, y + 3, P.grassLight);
        r.set(x + 2, y + 12, P.grassLight);
        r.set(x + 13, y + 7, P.grassDark);
      } else if (v > 0.92) {
        r.set(x + 6, y + 8, P.flower1);
        r.set(x + 7, y + 8, P.flower1);
        r.set(x + 6, y + 9, P.flower1);
        r.set(x + 7, y + 9, P.flower1);
        r.set(x + 6, y + 10, P.leafDark);
      } else if (v > 0.86) {
        r.set(x + 9, y + 5, P.flower2);
        r.set(x + 10, y + 5, P.flower2);
        r.set(x + 9, y + 6, P.flower2);
        r.set(x + 10, y + 6, P.flower2);
        r.set(x + 10, y + 7, P.leafDark);
      }
    }
  }
  // Dirt path tiles from the path curve, autotiled by neighbours.
  const dirt = new Set<string>();
  for (const [px, py] of pathPoints()) {
    dirt.add(`${Math.floor(px / T)},${Math.floor(py / T)}`);
    if (Math.floor((py + 8) / T) !== Math.floor(py / T))
      dirt.add(`${Math.floor(px / T)},${Math.floor((py + 8) / T)}`);
  }
  const has = (tx: number, ty: number) => dirt.has(`${tx},${ty}`);
  for (const key of dirt) {
    const [tx, ty] = key.split(',').map(Number) as [number, number];
    const x = tx * T;
    const y = ty * T;
    r.rect(x, y, T, T, P.dirt);
    for (let i = 0; i < 5; i++) {
      r.set(
        x + Math.floor(hash(tx, ty, 10 + i) * 14) + 1,
        y + Math.floor(hash(tx, ty, 20 + i) * 14) + 1,
        P.dirtLight,
      );
    }
    r.set(x + 5, y + 11, P.dirtDark);
    r.set(x + 11, y + 4, P.dirtDark);
    if (!has(tx, ty - 1)) r.rect(x, y, T, 2, P.dirtDark);
    if (!has(tx, ty + 1)) r.rect(x, y + T - 2, T, 2, P.dirtLight);
    if (!has(tx - 1, ty)) r.rect(x, y, 2, T, P.dirtDark);
    if (!has(tx + 1, ty)) r.rect(x + T - 2, y, 2, T, P.dirtLight);
    // Rounded corners: grass creeps back in.
    if (!has(tx, ty - 1) && !has(tx - 1, ty)) r.rect(x, y, 3, 3, P.grass);
    if (!has(tx, ty - 1) && !has(tx + 1, ty)) r.rect(x + T - 3, y, 3, 3, P.grass);
    if (!has(tx, ty + 1) && !has(tx - 1, ty)) r.rect(x, y + T - 3, 3, 3, P.grass);
    if (!has(tx, ty + 1) && !has(tx + 1, ty)) r.rect(x + T - 3, y + T - 3, 3, 3, P.grass);
  }
  // Water tiles with a sand ring and foam edges.
  const pond = LAYOUT.pond;
  const inPond = (tx: number, ty: number, grow = 0) => {
    const cx = tx * T + 8;
    const cy = ty * T + 8;
    const dx = (cx - pond.cx) / (pond.rx + grow);
    const dy = (cy - pond.cy) / (pond.ry + grow);
    return dx * dx + dy * dy <= 1;
  };
  for (let ty = 0; ty < rows; ty++) {
    for (let tx = 0; tx < cols; tx++) {
      if (!inPond(tx, ty) && inPond(tx, ty, 14)) r.rect(tx * T, ty * T, T, T, P.sand);
    }
  }
  for (let ty = 0; ty < rows; ty++) {
    for (let tx = 0; tx < cols; tx++) {
      if (!inPond(tx, ty)) continue;
      const x = tx * T;
      const y = ty * T;
      r.rect(x, y, T, T, P.water);
      if (inPond(tx, ty, -22)) r.rect(x, y, T, T, P.waterDeep);
      r.rect(x + 3 + ((tx + ty) % 2) * 4, y + 6, 5, 1, P.foam);
      r.rect(x + 9, y + 12, 3, 1, P.foam);
      if (!inPond(tx, ty - 1)) r.rect(x, y, T, 2, P.foam);
      if (!inPond(tx - 1, ty)) r.rect(x, y, 2, T, P.foam);
      if (!inPond(tx + 1, ty)) r.rect(x + T - 2, y, 2, T, P.foam);
      if (!inPond(tx, ty + 1)) r.rect(x, y + T - 2, T, 2, P.foam);
    }
  }
  // The house from tiles: wall tiles with beams, roof tiles with scallops, door, windows.
  const hs = LAYOUT.house;
  const hx = Math.round(hs.x / T) * T;
  const hy = Math.round(hs.y / T) * T;
  const hw = 7 * T;
  const wallRows = 4;
  const roofRows = 3;
  const wallY = hy + roofRows * T;
  // Shadow tiles under the house.
  r.rect(hx - 4, wallY + wallRows * T - 2, hw + 8, 6, P.grassDark);
  for (let ty = 0; ty < wallRows; ty++) {
    for (let tx = 0; tx < 7; tx++) {
      const x = hx + tx * T;
      const y = wallY + ty * T;
      r.rect(x, y, T, T, P.wall);
      r.rect(x, y, T, 1, P.wallShade);
      r.rect(x + 7, y + 4, 2, 2, P.wallShade);
      if (tx % 2 === 0) r.rect(x, y, 2, T, P.beam);
      if (ty === wallRows - 1) r.rect(x, y + T - 4, T, 4, P.wallShade);
    }
  }
  r.rect(hx, wallY, hw, 2, P.beam);
  r.rect(hx + hw - 2, wallY, 2, wallRows * T, P.beam);
  // Roof: an overhanging block of scalloped shingle tiles plus a lit ridge.
  for (let ty = 0; ty < roofRows; ty++) {
    const inset = (roofRows - 1 - ty) * 12;
    const x0 = hx - 8 + inset;
    const x1 = hx + hw + 8 - inset;
    const y = hy + ty * T;
    r.rect(x0, y, x1 - x0, T, ty === 0 ? P.roofLight : P.roof);
    for (let sx = x0 + (ty % 2) * 8; sx < x1; sx += 16) {
      r.ellipse(sx + 4, y + 13, 7, 4, ty === 0 ? P.roof : P.roofDark);
      r.ellipse(sx + 4, y + 11, 7, 4, ty === 0 ? P.roofLight : P.roof);
    }
    r.rect(x0, y + T - 1, x1 - x0, 1, P.roofDark);
  }
  r.rect(hx - 8, hy + roofRows * T - 2, hw + 16, 4, P.roofDark);
  r.rect(hx + hw - 36, hy - 12, 12, 14, P.wallShade);
  r.rect(hx + hw - 37, hy - 14, 14, 3, P.beam);
  // Door 1×2 tiles and two 1×1 windows.
  const dx = hx + 3 * T;
  const dy = wallY + 2 * T;
  r.rect(dx + 1, dy - 2, 14, 2 * T + 2, P.doorDark);
  r.rect(dx + 2, dy - 1, 12, 2 * T + 1, P.door);
  r.rect(dx + 4, dy + 2, 8, 1, P.doorDark);
  r.rect(dx + 4, dy + 10, 8, 1, P.doorDark);
  r.rect(dx + 11, dy + 16, 2, 2, P.flower2);
  for (const wx of [hx + T, hx + 5 * T]) {
    const wy = wallY + T;
    r.rect(wx + 1, wy + 1, 14, 14, P.beam);
    r.rect(wx + 2, wy + 2, 12, 12, P.glass);
    r.rect(wx + 2, wy + 8, 12, 6, P.glassDark);
    r.rect(wx + 7, wy + 2, 2, 12, P.beam);
    r.rect(wx + 2, wy + 7, 12, 2, P.beam);
    r.rect(wx, wy + 15, 16, 2, P.woodDark);
    r.rect(wx + 1, wy + 13, 3, 2, P.flower1);
    r.rect(wx + 6, wy + 13, 3, 2, P.flower2);
    r.rect(wx + 11, wy + 13, 3, 2, P.flower1);
  }
  // Tree: a 3×4-tile sprite with a round canopy and a dark outline.
  const t = LAYOUT.tree;
  const tx = Math.round(t.x / T) * T + 8;
  const tb = Math.round(t.base / T) * T;
  r.ellipse(tx, tb, 22, 7, P.grassDark);
  r.rect(tx - 5, tb - 34, 10, 34, P.trunk);
  r.rect(tx - 5, tb - 34, 3, 34, P.trunkDark);
  r.rect(tx - 9, tb - 6, 5, 6, P.trunkDark);
  r.rect(tx + 4, tb - 7, 5, 7, P.trunk);
  for (const [ox, oy, rr] of [
    [-18, -40, 16],
    [18, -40, 16],
    [0, -52, 20],
    [-10, -64, 14],
    [12, -64, 14],
  ] as const) {
    r.ellipse(tx + ox, tb + oy + 1, rr + 1, rr * 0.85 + 1, P.outline);
  }
  for (const [ox, oy, rr] of [
    [-18, -40, 16],
    [18, -40, 16],
    [0, -52, 20],
    [-10, -64, 14],
    [12, -64, 14],
  ] as const) {
    r.ellipse(tx + ox, tb + oy + 3, rr, rr * 0.8, P.leafDark);
    r.ellipse(tx + ox, tb + oy, rr - 1, rr * 0.8 - 1, P.leaf);
    r.ellipse(tx + ox - rr * 0.3, tb + oy - rr * 0.3, rr * 0.5, rr * 0.35, P.leafLight);
  }
  for (const [ox, oy] of [
    [-22, -36],
    [16, -46],
    [2, -62],
  ] as const) {
    r.disc(tx + ox, tb + oy, 2.5, P.flower1);
    r.set(tx + ox - 1, tb + oy - 1, P.white);
  }
  // Fence tiles and bushes.
  const f = LAYOUT.fence;
  for (let i = 0; i < f.n; i++) {
    const x = Math.round(f.x / T) * T + i * T;
    const y = Math.round(f.y / T) * T;
    r.rect(x + 2, y, 4, 16, P.woodDark);
    r.rect(x + 2, y, 2, 16, P.wood);
    r.rect(x, y + 4, 16, 3, P.wood);
    r.rect(x, y + 10, 16, 3, P.wood);
    r.rect(x, y + 6, 16, 1, P.woodDark);
    r.rect(x, y + 12, 16, 1, P.woodDark);
  }
  for (const b of [LAYOUT.bush1, LAYOUT.bush2]) {
    const bx = Math.round(b.x / T) * T + 8;
    const by = Math.round(b.base / T) * T;
    r.ellipse(bx, by, 20, 7, P.grassDark);
    r.ellipse(bx, by - 10, 19, 11, P.outline);
    r.ellipse(bx, by - 10, 18, 10, P.leafDark);
    r.ellipse(bx - 2, by - 12, 14, 7, P.leaf);
    r.ellipse(bx - 6, by - 15, 6, 3, P.leafLight);
    r.disc(bx + 8, by - 12, 2, P.flower1);
    r.disc(bx - 9, by - 8, 2, P.flower1);
  }
  return r;
}

// ---------------------------------------------------------------- 2. painterly hi-bit

/**
 * No grid, no outlines: shapes defined by value and colour, long tone ramps, dithered
 * gradients, hundreds of leaf dabs, soft ambient shadows, atmospheric haze toward the
 * top. The look of Owlboy or Eastward.
 */
function direction2(): Raster {
  const r = new Raster(W, H, hex('#5f9e3c'));
  const rng = new Rng(2);
  // Grass: a vertical value gradient (haze at the top), drifts, and brushy dabs.
  r.gradient(0, 0, W, H, hex('#7fb356'), hex('#4e8a35'));
  for (let i = 0; i < 40; i++) {
    r.ellipse(rng.int(0, W), rng.int(0, H), rng.int(14, 40), rng.int(6, 16), hex('#5c9a3e'), 0.5);
  }
  for (let i = 0; i < 1800; i++) {
    const x = rng.int(0, W);
    const y = rng.int(0, H);
    const base = r.get(x, y);
    const c = rng.chance(0.5) ? shade(base, 1.18) : shade(base, 0.84);
    r.set(x, y, c, 0.9);
    r.set(x, y - 1, shade(c, 1.08), 0.6);
  }
  // Path: soft-edged, warm, with a worn centre and scattered stones.
  for (const [x, y] of pathPoints()) {
    r.ellipse(x, y, 13, 7, hex('#8c7a4f'), 0.5);
  }
  for (const [x, y] of pathPoints()) {
    r.ellipse(x, y, 10, 5, hex('#c7ab74'), 0.9);
    r.ellipse(x, y - 1, 6, 2.5, hex('#e1c892'), 0.7);
  }
  for (let i = 0; i < 60; i++) {
    const pts = pathPoints();
    const [x, y] = pts[rng.int(0, pts.length - 1)]!;
    r.ellipse(x + rng.float(-8, 8), y + rng.float(-3, 3), 1.5, 1, hex('#a28a5c'), 0.8);
  }
  // Pond: deep gradient, soft shore, long soft reflections.
  const p = LAYOUT.pond;
  r.ellipse(p.cx, p.cy, p.rx + 10, p.ry + 6, hex('#b9a86d'), 0.9);
  r.ellipse(p.cx, p.cy, p.rx + 4, p.ry + 2, hex('#8aa37a'), 0.9);
  for (let y = p.cy - p.ry; y <= p.cy + p.ry; y++) {
    const t = (y - (p.cy - p.ry)) / (2 * p.ry);
    const c = mix(hex('#6fb6e6'), hex('#1f4f8f'), t);
    for (let x = p.cx - p.rx; x <= p.cx + p.rx; x++) {
      const dx = (x - p.cx) / p.rx;
      const dy = (y - p.cy) / p.ry;
      if (dx * dx + dy * dy <= 1) r.set(x, y, c);
    }
  }
  for (let i = 0; i < 26; i++) {
    const x = p.cx - p.rx + 12 + rng.int(0, p.rx * 2 - 24);
    const y = p.cy - p.ry + 6 + rng.int(0, p.ry * 2 - 12);
    r.line(x, y, x + rng.int(4, 12), y, hex('#cfe9ff'), 0.35);
  }
  // Tree: a trunk with painted bark and a canopy of hundreds of dabs in six tones.
  const t = LAYOUT.tree;
  r.ellipse(t.x + 6, t.base + 2, 34, 9, hex('#2f5a28'), 0.5);
  r.gradient(t.x - 6, t.base - 44, 12, 44, hex('#8a5a32'), hex('#4a2e18'));
  for (let i = 0; i < 40; i++) {
    r.line(
      t.x - 5 + rng.int(0, 10),
      t.base - rng.int(0, 44),
      t.x - 5 + rng.int(0, 10),
      t.base - rng.int(0, 44),
      hex('#5e3a1f'),
      0.4,
    );
  }
  r.tri(t.x - 6, t.base, t.x - 14, t.base + 2, t.x - 6, t.base - 10, hex('#5e3a1f'));
  r.tri(t.x + 6, t.base, t.x + 14, t.base + 2, t.x + 6, t.base - 10, hex('#6e4525'));
  const tones = ['#1f4d26', '#2f6f32', '#3f8f3c', '#58ac48', '#7cc85a', '#a8e076'].map(hex);
  const lobes: Array<[number, number, number]> = [
    [t.x - 20, t.base - 60, 22],
    [t.x + 20, t.base - 60, 22],
    [t.x, t.base - 78, 26],
    [t.x - 12, t.base - 94, 18],
    [t.x + 14, t.base - 92, 18],
  ];
  for (const [x, y, rr] of lobes) r.ellipse(x, y + 4, rr + 2, rr * 0.85 + 2, tones[0]!, 0.9);
  for (let i = 0; i < 2600; i++) {
    const [x, y, rr] = lobes[i % lobes.length]!;
    const a = rng.float(0, Math.PI * 2);
    const d = Math.sqrt(rng.float(0, 1)) * rr;
    const px = x + Math.cos(a) * d;
    const py = y + Math.sin(a) * d * 0.85;
    // Light from the upper left: tone by position inside the lobe.
    const lightness = 0.5 - (Math.cos(a) * d) / (rr * 2.2) - (Math.sin(a) * d) / (rr * 1.8);
    const k = Math.max(0, Math.min(5, Math.round(lightness * 5 + rng.float(-0.6, 0.6))));
    r.ellipse(px, py, 1.6, 1.2, tones[k]!, 0.85);
  }
  // Cottage: rounded gradient walls, a thatched roof in brushy strokes, warm windows.
  const h = LAYOUT.house;
  r.ellipse(h.x + h.w / 2 + 8, h.y + h.h + 4, h.w / 2 + 16, 10, hex('#2f5a28'), 0.45);
  r.gradient(h.x, h.y + h.roofH, h.w, h.h - h.roofH, hex('#f4e4c0'), hex('#c9ad7c'));
  for (let i = 0; i < 300; i++) {
    const x = h.x + rng.int(0, h.w);
    const y = h.y + h.roofH + rng.int(0, h.h - h.roofH);
    r.set(x, y, shade(r.get(x, y), rng.float(0.92, 1.08)));
  }
  r.rect(h.x + h.w - 12, h.y + h.roofH, 12, h.h - h.roofH, hex('#8a6a40'), 0.35);
  r.rect(h.x, h.y + h.roofH, h.w, 6, hex('#8a6a40'), 0.45);
  for (const bx of [h.x + 2, h.x + h.w / 3, h.x + (2 * h.w) / 3, h.x + h.w - 5]) {
    r.gradient(bx, h.y + h.roofH, 3, h.h - h.roofH, hex('#7a5230'), hex('#4a3018'));
  }
  // Thatch: a rounded cap built from many strokes.
  const ridge = h.y + 2;
  for (let y = ridge; y < h.y + h.roofH + 6; y++) {
    const tt = (y - ridge) / (h.roofH + 4);
    const half = 10 + tt * (h.w / 2 + 14);
    const c = mix(hex('#d9a85a'), hex('#8a5e2a'), tt);
    r.rect(Math.round(h.x + h.w / 2 - half), y, Math.round(half * 2), 1, c);
  }
  for (let i = 0; i < 900; i++) {
    const y = ridge + rng.int(0, h.roofH + 4);
    const tt = (y - ridge) / (h.roofH + 4);
    const half = 10 + tt * (h.w / 2 + 14);
    const x = h.x + h.w / 2 + rng.float(-half, half);
    const lit = x < h.x + h.w / 2 - 10;
    r.line(
      x,
      y,
      x + rng.float(-1, 1),
      y + rng.int(2, 5),
      lit ? hex('#f0c46e') : hex('#7a4f22'),
      0.55,
    );
  }
  r.ellipse(h.x + h.w / 2, ridge + 2, 14, 5, hex('#f3d088'), 0.9);
  r.ellipse(h.x + h.w / 2, ridge + 3, 12, 3, hex('#c9944a'), 0.7);
  r.rect(h.x + h.w - 34, h.y - 10, 12, 20, hex('#8c7f7a'));
  r.rect(h.x + h.w - 34, h.y - 10, 4, 20, hex('#5f5552'));
  // Door and windows with soft glow.
  const dx = h.x + h.w / 2 - 12;
  const dy = h.y + h.h - 36;
  r.gradient(dx, dy, 24, 36, hex('#8a5a32'), hex('#4a2e18'));
  r.ellipse(dx + 12, dy, 12, 8, hex('#7a4f2a'));
  r.ellipse(dx + 12, dy + 2, 10, 6, hex('#5e3a1f'));
  r.disc(dx + 19, dy + 19, 1.5, hex('#f3d088'));
  for (const wx of [h.x + 14, h.x + h.w - 38]) {
    const wy = h.y + h.roofH + 16;
    r.ellipse(wx + 12, wy + 11, 22, 16, hex('#ffd98a'), 0.18);
    r.rect(wx - 2, wy - 2, 28, 26, hex('#6a4a2a'));
    r.gradient(wx, wy, 24, 22, hex('#ffe7a8'), hex('#f0b85a'));
    r.rect(wx + 11, wy, 2, 22, hex('#6a4a2a'));
    r.rect(wx, wy + 10, 24, 2, hex('#6a4a2a'));
    r.rect(wx - 4, wy + 24, 32, 5, hex('#5e3a1f'));
    for (let i = 0; i < 12; i++) {
      r.disc(
        wx - 2 + i * 2.6,
        wy + 22 + (i % 2),
        1.4,
        [hex('#ff7a9a'), hex('#ffd84a'), hex('#ff9ab8')][i % 3]!,
        0.9,
      );
    }
  }
  // Fence and bushes.
  const f = LAYOUT.fence;
  for (let i = 0; i < f.n; i++) {
    const x = f.x + i * 15;
    r.gradient(x, f.y - 20, 5, 22, hex('#d9a76a'), hex('#7a4f2a'));
  }
  r.gradient(f.x - 2, f.y - 15, f.n * 15 - 8, 3, hex('#d9a76a'), hex('#a0703a'));
  r.gradient(f.x - 2, f.y - 8, f.n * 15 - 8, 3, hex('#d9a76a'), hex('#a0703a'));
  for (const b of [LAYOUT.bush1, LAYOUT.bush2]) {
    r.ellipse(b.x + 3, b.base + 1, 24, 7, hex('#2f5a28'), 0.5);
    for (let i = 0; i < 700; i++) {
      const a = rng.float(0, Math.PI * 2);
      const d = Math.sqrt(rng.float(0, 1)) * 20;
      const px = b.x + Math.cos(a) * d;
      const py = b.base - 12 + Math.sin(a) * d * 0.6;
      const lightness = 0.5 - (Math.cos(a) * d) / 40 - (Math.sin(a) * d) / 30;
      const k = Math.max(0, Math.min(5, Math.round(lightness * 5 + rng.float(-0.5, 0.5))));
      r.ellipse(px, py, 1.5, 1.1, tones[k]!, 0.85);
    }
    for (let i = 0; i < 5; i++)
      r.disc(b.x + rng.float(-14, 14), b.base - 12 + rng.float(-8, 6), 1.6, hex('#ff6b8a'));
  }
  // Haze toward the top of the frame.
  for (let y = 0; y < 90; y++) {
    const a = (1 - y / 90) * 0.28;
    for (let x = 0; x < W; x++) r.set(x, y, hex('#dff0ff'), a);
  }
  return r;
}

// ---------------------------------------------------------------- 3. HD-2D

/**
 * Crisp sprites inside a photographic frame: the tile scene from direction 1 with a
 * tilt-shift depth of field, bloom on the bright tones, diagonal light shafts, a warm
 * grade and a vignette. The look of Octopath Traveler.
 */
function direction3(): Raster {
  const r = direction1();
  // Long cast shadows before the post so they blur with the scene.
  const t = LAYOUT.tree;
  r.ellipse(t.x + 46, t.base + 6, 50, 9, hex('#1b3a18'), 0.35);
  const h = LAYOUT.house;
  r.rect(h.x + h.w, h.y + 70, 30, h.h - 60, hex('#1b3a18'), 0.3);
  // Light shafts from the upper left.
  for (let i = 0; i < 6; i++) {
    const x0 = -60 + i * 70;
    for (let y = 0; y < H; y++) {
      for (let k = 0; k < 18; k++) {
        const x = x0 + y * 0.6 + k;
        const a = 0.12 * (1 - Math.abs(k - 9) / 9) * (1 - y / H);
        r.set(x, y, hex('#fff2c0'), a);
      }
    }
  }
  boxBlur(r, 5, (y) => {
    const d = Math.abs(y - H * 0.5) / (H * 0.5);
    return Math.max(0, (d - 0.35) / 0.65);
  });
  bloom(r, 0.62, 4, 0.55);
  grade(r, hex('#9fb8d8'), hex('#fff0d0'));
  vignette(r, 0.9);
  return r;
}

// ---------------------------------------------------------------- 4. chunky limited palette

/**
 * Half the resolution, twelve colours, no outlines: shapes carried by silhouette and a
 * hard rim light from the right, dithered sky and a teal-and-magenta grade. The look
 * of Hyper Light Drifter or Celeste.
 */
function direction4(): Raster {
  const w = W / 4;
  const hgt = H / 4;
  const P = {
    sky1: hex('#2a1f4e'),
    sky2: hex('#6b3f8f'),
    ground: hex('#1f6b63'),
    groundDark: hex('#143f44'),
    groundLight: hex('#2f9a84'),
    path: hex('#5a3f6b'),
    pathLight: hex('#8a5f8f'),
    water: hex('#2b4fa8'),
    waterLight: hex('#4f8fe0'),
    wall: hex('#e8c9a0'),
    wallShade: hex('#8f6a7a'),
    roof: hex('#c23c6b'),
    roofShade: hex('#6b1f4a'),
    rim: hex('#fff2b0'),
    dark: hex('#12102a'),
    accent: hex('#ff4fa0'),
    glow: hex('#ffd46b'),
  };
  const r = new Raster(w, hgt, P.ground);
  // Sky band at the top with a dithered gradient (the chunky scene tilts the horizon in).
  r.dither(0, 0, w, 14, P.sky1, P.sky2, 4);
  r.dither(0, 14, w, 6, P.sky2, P.ground, 3);
  const rng = new Rng(4);
  for (let i = 0; i < 70; i++) r.set(rng.int(0, w), rng.int(20, hgt), P.groundLight);
  for (let i = 0; i < 70; i++) r.set(rng.int(0, w), rng.int(20, hgt), P.groundDark);
  // Path.
  for (const [x, y] of pathPoints()) r.ellipse(x / 4, y / 4, 3, 1.5, P.path);
  for (const [x, y] of pathPoints()) r.set(x / 4, y / 4 - 1, P.pathLight);
  // Pond.
  const p = LAYOUT.pond;
  r.ellipse(p.cx / 4, p.cy / 4, p.rx / 4 + 1, p.ry / 4 + 1, P.groundDark);
  r.ellipse(p.cx / 4, p.cy / 4, p.rx / 4, p.ry / 4, P.water);
  for (let i = 0; i < 6; i++)
    r.rect(p.cx / 4 - 16 + i * 5, p.cy / 4 - 6 + (i % 3) * 3, 3, 1, P.waterLight);
  r.line(p.cx / 4 - p.rx / 4 + 2, p.cy / 4 - 6, p.cx / 4 - 4, p.cy / 4 - p.ry / 4 + 1, P.rim);
  // Tree as a silhouette with a rim.
  const t = LAYOUT.tree;
  const tx = t.x / 4;
  const tb = t.base / 4;
  r.ellipse(tx + 2, tb, 8, 2, P.groundDark);
  r.rect(tx - 1, tb - 10, 3, 10, P.dark);
  r.ellipse(tx, tb - 17, 11, 9, P.dark);
  r.ellipse(tx + 2, tb - 23, 7, 5, P.dark);
  r.ellipse(tx + 1, tb - 17, 8, 6, P.groundDark);
  r.ellipse(tx + 3, tb - 20, 5, 3, P.groundLight);
  r.ellipse(tx + 4, tb - 21, 2, 1, P.rim);
  r.line(tx + 7, tb - 22, tx + 10, tb - 14, P.rim);
  r.set(tx + 8, tb - 23, P.rim);
  r.set(tx + 10, tb - 13, P.rim);
  r.set(tx - 3, tb - 16, P.accent);
  r.set(tx + 4, tb - 20, P.accent);
  // House: three values and a rim.
  const h = LAYOUT.house;
  const hx = h.x / 4;
  const hy = h.y / 4;
  const hw = h.w / 4;
  const hh = h.h / 4;
  const rh = h.roofH / 4;
  r.rect(hx + 2, hy + hh, hw + 2, 2, P.groundDark);
  r.rect(hx, hy + rh, hw, hh - rh, P.wall);
  r.rect(hx + hw - 6, hy + rh, 6, hh - rh, P.wallShade);
  r.rect(hx, hy + rh, hw, 2, P.wallShade);
  r.tri(hx - 2, hy + rh, hx + hw + 2, hy + rh, hx + hw / 2, hy - 1, P.roof);
  r.tri(hx + hw / 2, hy + rh, hx + hw + 2, hy + rh, hx + hw / 2, hy - 1, P.roofShade);
  r.line(hx + hw / 2, hy - 1, hx + hw + 2, hy + rh, P.rim);
  r.rect(hx + hw - 8, hy, 3, 5, P.dark);
  r.rect(hx + hw / 2 - 3, hy + hh - 9, 6, 9, P.dark);
  r.rect(hx + hw / 2 - 2, hy + hh - 9, 1, 9, P.wallShade);
  for (const wx of [hx + 4, hx + hw - 10]) {
    r.rect(wx, hy + rh + 5, 6, 5, P.dark);
    r.rect(wx + 1, hy + rh + 6, 4, 3, P.glow);
    r.rect(wx + 1, hy + rh + 6, 1, 1, P.rim);
  }
  r.line(hx + hw, hy + rh, hx + hw, hy + hh, P.rim);
  // Fence and bushes.
  const f = LAYOUT.fence;
  for (let i = 0; i < f.n; i++) {
    r.rect(f.x / 4 + i * 4, f.y / 4 - 5, 1, 5, P.dark);
    r.set(f.x / 4 + i * 4 + 1, f.y / 4 - 5, P.rim);
  }
  r.rect(f.x / 4, f.y / 4 - 4, f.n * 4 - 3, 1, P.dark);
  r.rect(f.x / 4, f.y / 4 - 2, f.n * 4 - 3, 1, P.dark);
  for (const b of [LAYOUT.bush1, LAYOUT.bush2]) {
    r.ellipse(b.x / 4, b.base / 4 - 2, 5, 3, P.dark);
    r.ellipse(b.x / 4 + 1, b.base / 4 - 3, 3, 2, P.groundDark);
    r.set(b.x / 4 + 4, b.base / 4 - 4, P.rim);
    r.set(b.x / 4 - 2, b.base / 4 - 3, P.accent);
  }
  // Scatter a few glowing motes.
  for (let i = 0; i < 12; i++) r.set(rng.int(0, w), rng.int(10, hgt), P.glow);
  // Upscale to the common frame.
  const out = new Raster(W, H, P.dark);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) out.set(x, y, r.get(x >> 2, y >> 2));
  return out;
}

// ---------------------------------------------------------------- 5. dynamically lit dusk

/**
 * The painterly scene as an albedo layer, then a real light pass: a dusk ambient, a low
 * warm sun from the left with long shadows, point lights from the windows and a lantern
 * with falloff, their reflections smeared in the water, fireflies, and a soft bloom.
 * The look of Sea of Stars.
 */
function direction5(): Raster {
  const albedo = direction2();
  // Undo the daytime haze so the light pass owns the mood.
  const r = new Raster(W, H, [0, 0, 0]);
  const light = new Raster(W, H, [0.26, 0.3, 0.5]);
  // Sun low on the left: a warm wash that fades to the right.
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const k = Math.max(0, 1 - x / W) * 0.5 * (0.6 + 0.4 * (y / H));
      light.set(x, y, [0.95, 0.6, 0.35], k);
    }
  }
  // Long shadows cast to the right by the tree, the house, the fence and the bushes.
  const t = LAYOUT.tree;
  light.ellipse(t.x + 78, t.base + 4, 70, 10, [0.16, 0.18, 0.34], 0.85);
  light.ellipse(t.x + 40, t.base - 6, 44, 12, [0.16, 0.18, 0.34], 0.6);
  const h = LAYOUT.house;
  light.rect(h.x + h.w, h.y + 40, 70, h.h - 30, [0.16, 0.18, 0.34], 0.85);
  light.tri(
    h.x + h.w,
    h.y + 40,
    h.x + h.w + 70,
    h.y + 40,
    h.x + h.w + 70,
    h.y - 10,
    [0.16, 0.18, 0.34],
    0.6,
  );
  light.rect(h.x + h.w - 10, h.y + h.roofH, 10, h.h - h.roofH, [0.2, 0.2, 0.36], 0.7);
  const f = LAYOUT.fence;
  for (let i = 0; i < f.n; i++)
    light.rect(f.x + i * 15 + 4, f.y - 20, 10, 22, [0.16, 0.18, 0.34], 0.5);
  for (const b of [LAYOUT.bush1, LAYOUT.bush2])
    light.ellipse(b.x + 26, b.base + 1, 24, 6, [0.16, 0.18, 0.34], 0.75);
  // Point lights: windows, a lantern by the door, fireflies.
  const points: Array<[number, number, number, RGB]> = [
    [h.x + 26, h.y + h.roofH + 27, 70, [1, 0.72, 0.35]],
    [h.x + h.w - 26, h.y + h.roofH + 27, 70, [1, 0.72, 0.35]],
    [h.x + h.w / 2 - 24, h.y + h.h - 16, 48, [1, 0.8, 0.45]],
  ];
  const rng = new Rng(5);
  const flies: Array<[number, number]> = [];
  for (let i = 0; i < 14; i++) {
    const fx = rng.int(20, W - 20);
    const fy = rng.int(40, H - 10);
    flies.push([fx, fy]);
    points.push([fx, fy, 7, [0.9, 1, 0.5]]);
  }
  for (const [lx, ly, rad, col] of points) {
    for (let y = Math.max(0, ly - rad); y < Math.min(H, ly + rad); y++) {
      for (let x = Math.max(0, lx - rad); x < Math.min(W, lx + rad); x++) {
        const d = Math.hypot(x - lx, y - ly) / rad;
        if (d >= 1) continue;
        const k = (1 - d) * (1 - d);
        const c = light.get(x, y);
        light.set(x, y, [
          c[0] + col[0] * k * 1.4,
          c[1] + col[1] * k * 1.4,
          c[2] + col[2] * k * 1.4,
        ]);
      }
    }
  }
  // Apply the light to the albedo.
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const a = albedo.get(x, y);
      const l = light.get(x, y);
      r.set(x, y, [a[0] * l[0], a[1] * l[1], a[2] * l[2]]);
    }
  }
  // Self-lit things: the windows and lantern, the fireflies, the sky in the water.
  for (const wx of [h.x + 14, h.x + h.w - 38]) {
    const wy = h.y + h.roofH + 16;
    r.gradient(wx, wy, 24, 22, hex('#fff1b8'), hex('#ffb04a'));
    r.rect(wx + 11, wy, 2, 22, hex('#6a4a2a'));
    r.rect(wx, wy + 10, 24, 2, hex('#6a4a2a'));
  }
  const lx = h.x + h.w / 2 - 24;
  const ly = h.y + h.h - 20;
  r.rect(lx - 1, ly - 6, 2, 26, hex('#2a2030'));
  r.rect(lx - 4, ly - 12, 8, 8, hex('#3a2a30'));
  r.rect(lx - 3, ly - 11, 6, 6, hex('#fff1b8'));
  for (const [fx, fy] of flies) {
    r.set(fx, fy, hex('#f6ffb0'));
    r.set(fx + 1, fy, hex('#d8f080'), 0.6);
  }
  // Water: darken, then reflect the sky band and smear the lights downward.
  const p = LAYOUT.pond;
  for (let y = p.cy - p.ry; y <= p.cy + p.ry; y++) {
    for (let x = p.cx - p.rx; x <= p.cx + p.rx; x++) {
      const dx = (x - p.cx) / p.rx;
      const dy = (y - p.cy) / p.ry;
      if (dx * dx + dy * dy > 1) continue;
      const t2 = (y - (p.cy - p.ry)) / (2 * p.ry);
      r.set(x, y, mix(hex('#5a3f7a'), hex('#101a3a'), t2), 0.8);
      if (hash(x >> 2, y, 9) < 0.08) r.set(x, y, hex('#9a7ab8'), 0.5);
    }
  }
  for (const [lx2, , , col] of points.slice(0, 3)) {
    for (let y = p.cy - p.ry; y <= p.cy + p.ry; y++) {
      const t2 = (y - (p.cy - p.ry)) / (2 * p.ry);
      for (let x = lx2 - 6; x <= lx2 + 6; x++) {
        const dx = (x - p.cx) / p.rx;
        const dy = (y - p.cy) / p.ry;
        if (dx * dx + dy * dy > 1) continue;
        const wob = hash(0, y, 3) < 0.5 ? 1 : -1;
        r.set(x + wob, y, col, 0.35 * (1 - t2) * (1 - Math.abs(x - lx2) / 7));
      }
    }
  }
  // Sky at the top: a dusk gradient bleeding into the far grass.
  for (let y = 0; y < 60; y++) {
    const a = (1 - y / 60) * 0.7;
    for (let x = 0; x < W; x++) r.set(x, y, mix(hex('#ff9a5a'), hex('#4a2f6b'), y / 60), a);
  }
  bloom(r, 0.55, 5, 0.6);
  vignette(r, 0.7);
  return r;
}

// ---------------------------------------------------------------- write

it.skipIf(!process.env.PREVIEW_DIRECTIONS)('writes five environment art directions', () => {
  const dir = process.env.PREVIEW_DIRECTIONS!;
  mkdirSync(dir, { recursive: true });
  const makers = [direction1, direction2, direction3, direction4, direction5];
  makers.forEach((make, i) => {
    const { width, height, rgba } = make().toRgba(3);
    writeFileSync(join(dir, `dir-${i + 1}.png`), encodePng(width, height, rgba));
  });
  expect(makers).toHaveLength(5);
});
