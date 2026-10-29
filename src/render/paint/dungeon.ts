import { RepeatWrapping, type CanvasTexture } from 'three';
import { DUNGEON, GROVE3D } from '../../config/tuning';
import { cellAt, CHASM, FLOOR, WALL, WATER, type Floor } from '../../sim/dungeon';
import { bandFor } from '../cave-bands';
import { frameKey } from '../sprites/animations';
import type { SpriteSheet } from '../sprites/atlas';
import { RasterAtlas } from './atlas';
import { fbm, ridged, vnoise, warped } from './noise';
import { hash, hex, mix, Raster, rimObjects, shade, type RGB } from './raster';

/**
 * The Hollow Below, painted: the floor texture for one cave floor (stone flags with
 * cracks and joints, dust at the walls, water pockets with moss, the rock faces with
 * a lit lip fading to black, torch and crystal light baked in) and the props that
 * stand on it (torches, crystals, the chest, the stair markers, the loot).
 */
export const DUNGEON_PPU = 12;

const CELL = DUNGEON.cell;
const PX = GROVE3D.cave.pixel;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** Distance in cells from every cell to the nearest wall (0 on walls) and to the nearest floor. */
function distanceFields(f: Floor): { toWall: Float32Array; toFloor: Float32Array } {
  const n = f.cols * f.rows;
  const toWall = new Float32Array(n).fill(99);
  const toFloor = new Float32Array(n).fill(99);
  const bfs = (field: Float32Array, isSource: (v: number) => boolean) => {
    const queue: number[] = [];
    for (let i = 0; i < n; i++) {
      if (isSource(f.cells[i]!)) {
        field[i] = 0;
        queue.push(i);
      }
    }
    // Border cells count as walls too.
    let head = 0;
    while (head < queue.length) {
      const i = queue[head++]!;
      const x = i % f.cols;
      const y = (i - x) / f.cols;
      const d = field[i]!;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= f.cols || ny >= f.rows) continue;
        const j = ny * f.cols + nx;
        if (field[j]! > d + 1) {
          field[j] = d + 1;
          queue.push(j);
        }
      }
    }
  };
  bfs(toWall, (v) => v === WALL);
  bfs(toFloor, (v) => v !== WALL);
  // Edges of the grid are rock as well.
  for (let x = 0; x < f.cols; x++) {
    toWall[x] = Math.min(toWall[x]!, 1);
    toWall[(f.rows - 1) * f.cols + x] = Math.min(toWall[(f.rows - 1) * f.cols + x]!, 1);
  }
  for (let y = 0; y < f.rows; y++) {
    toWall[y * f.cols] = Math.min(toWall[y * f.cols]!, 1);
    toWall[y * f.cols + f.cols - 1] = Math.min(toWall[y * f.cols + f.cols - 1]!, 1);
  }
  return { toWall, toFloor };
}

/**
 * The wall cells a vista opens up (item 31), by grid index: `d` counts 1 for the lip cell
 * beside the floor up to `n` at the grid edge. The scene draws them low and the floor
 * painter paints them as a chasm.
 */
export function vistaCells(f: Floor): Map<number, { d: number; n: number }> {
  const out = new Map<number, { d: number; n: number }>();
  const dirs = { n: [0, -1], s: [0, 1], e: [1, 0], w: [-1, 0] } as const;
  for (const v of f.vistas) {
    const [dx, dy] = dirs[v.dir];
    const [ax, ay] = dx === 0 ? [1, 0] : [0, 1];
    for (let k = 0; k < v.width; k++) {
      for (let d = 1; d <= v.depth; d++) {
        const x = v.cell.x + ax * k + dx * d;
        const y = v.cell.y + ay * k + dy * d;
        if (x < 0 || y < 0 || x >= f.cols || y >= f.rows) continue;
        out.set(y * f.cols + x, { d, n: v.depth });
      }
    }
  }
  return out;
}

export function floorWorldSize(f: Floor): { w: number; h: number } {
  return { w: f.cols * CELL, h: f.rows * CELL };
}

export function paintFloorTexture(f: Floor, depth = 1): CanvasTexture {
  const band = bandFor(depth);
  const vista = vistaCells(f);
  const elev = f.elevation.length === f.cols * f.rows ? f.elevation : null;
  const cellPx = CELL * DUNGEON_PPU;
  const { w: W, h: H } = floorWorldSize(f);
  const width = Math.round(W * DUNGEON_PPU);
  const height = Math.round(H * DUNGEON_PPU);
  const r = new Raster(width, height, hex('#0b0810'));
  const { toWall, toFloor } = distanceFields(f);
  const px2cell = 1 / (CELL * DUNGEON_PPU);
  const field = (arr: Float32Array, cx: number, cy: number): number => {
    // Bilinear read of a per-cell field at a fractional cell position (cell centres).
    const fx = Math.max(0, Math.min(f.cols - 1.001, cx - 0.5));
    const fy = Math.max(0, Math.min(f.rows - 1.001, cy - 0.5));
    const x0 = Math.floor(fx);
    const y0 = Math.floor(fy);
    const tx = fx - x0;
    const ty = fy - y0;
    const i = y0 * f.cols + x0;
    const a = arr[i]!;
    const b = arr[i + 1] ?? a;
    const c = arr[i + f.cols] ?? a;
    const d = arr[i + f.cols + 1] ?? a;
    return (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty;
  };
  // The warp of the cell edges is a slow field: sampled coarsely, read back bilinearly.
  const step = 6;
  const cols = Math.ceil(width / step) + 1;
  const rows = Math.ceil(height / step) + 1;
  const warpX = new Float32Array(cols * rows);
  const warpY = new Float32Array(cols * rows);
  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      warpX[gy * cols + gx] = (warped((gx * step) / 30, (gy * step) / 30, 0.8, 2) - 0.5) * 11;
      warpY[gy * cols + gx] = (warped((gx * step) / 30 + 9, (gy * step) / 30, 0.8, 3) - 0.5) * 11;
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
  // Every colour of the floor comes from the depth band, so floors 1, 6, 11 and 16 differ.
  const white: RGB = [1, 1, 1];
  const floorA = hex(band.floor);
  const floorB = mix(floorA, white, 0.48);
  const rockBase = hex(band.rock);
  const rockA = shade(rockBase, 0.55);
  const rockB = shade(rockBase, 0.95);
  const lip = hex(band.rim);
  const crystalC = hex(band.crystal);
  const waterA = shade(mix(hex('#1b2f55'), crystalC, 0.12), 1);
  const waterB = mix(hex('#3a6a9a'), crystalC, 0.22);
  const moss = shade(hex(band.moss), 0.9);
  const chasmA = shade(hex(band.background), 0.55);
  const chasmB = mix(hex(band.background), crystalC, 0.3);
  const ledgeLit = 1.45;
  const edgeDirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ] as const;
  /** Terrace edges: a lit lip on the upper cell, a shadowed foot on the lower (item 19). */
  const terrace = (cx: number, cy: number): number => {
    if (!elev) return 1;
    const ix = Math.floor(cx);
    const iy = Math.floor(cy);
    if (ix < 0 || iy < 0 || ix >= f.cols || iy >= f.rows) return 1;
    const ev = elev[iy * f.cols + ix]!;
    let m = 1 + ev * PX.elevTint;
    const fx = cx - ix;
    const fy = cy - iy;
    for (const [dx, dy] of edgeDirs) {
      const nx = ix + dx;
      const ny = iy + dy;
      if (nx < 0 || ny < 0 || nx >= f.cols || ny >= f.rows) continue;
      if (f.cells[ny * f.cols + nx] !== FLOOR) continue;
      const diff = ev - elev[ny * f.cols + nx]!;
      if (Math.abs(diff) < 0.2) continue;
      const edge = (dx === 1 ? 1 - fx : dx === -1 ? fx : dy === 1 ? 1 - fy : fy) * cellPx;
      if (diff > 0) {
        if (edge < PX.ledge) m = Math.max(m, ledgeLit);
      } else if (edge < PX.ledgeShadow) {
        m = Math.min(m, 0.5 + 0.5 * (edge / PX.ledgeShadow));
      }
    }
    return m;
  };
  const floorMask = new Uint8Array(width * height);
  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const wx = px + sample(warpX, px, py);
      const wy = py + sample(warpY, px, py);
      const cx = wx * px2cell;
      const cy = wy * px2cell;
      const cell = cellAt(f, Math.floor(cx), Math.floor(cy));
      const grain = fbm(px / 8, py / 8, 3, 4);
      if (cell !== WALL) {
        floorMask[py * width + px] = 1;
        const dWall = field(toWall, cx, cy);
        let c: RGB;
        if (cell === CHASM) {
          // A gap to jump (R0031): rock lip at the far edge, falling to a soft blue glow.
          const fy = cy - Math.floor(cy);
          const lip = cellAt(f, Math.floor(cx), Math.floor(cy) - 1) !== CHASM ? fy : 1;
          c = mix(chasmA, chasmB, 0.4 + grain * 0.3);
          c = mix(c, hex('#4f86c6'), clamp01((lip - 0.35) * 1.6) * 0.7);
          if (lip < 0.3) c = shade(mix(rockA, rockB, grain), 0.55 + lip);
        } else if (cell === WATER) {
          c = mix(waterA, waterB, fbm(px / 12, py / 12, 2, 7));
          if (fbm(px / 9 + py / 50, py / 5, 2, 8) > 0.7) c = mix(c, hex('#9ad0ff'), 0.5);
        } else {
          c = mix(floorA, floorB, grain);
          const crack = ridged(px / 10, py / 10, 2, 5);
          if (crack > 0.8) c = shade(c, 0.6);
          if (Math.abs(vnoise(px / 16, py / 16, 6) - 0.5) < 0.025) c = shade(c, 0.65);
          c = shade(c, 0.72 + clamp01(dWall / 1.4) * 0.28);
          // Moss by the water and in damp corners; the odd pebble or bone.
          const nearWater = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ].some(([ox, oy]) => cellAt(f, Math.floor(cx) + ox!, Math.floor(cy) + oy!) === WATER);
          const damp = fbm(px / 36, py / 36, 2, 9);
          if (nearWater || (damp > 0.64 && dWall < 1.1)) c = mix(c, moss, 0.45 + grain * 0.3);
          if (hash(px >> 1, py >> 1, 11) < 0.01) c = mix(c, hex('#b8b0c0'), 0.8);
          c = shade(c, terrace(cx, cy));
        }
        r.set(px, py, c);
      } else if (
        vista.has(Math.floor(cy) * f.cols + Math.floor(cx)) &&
        vista.get(Math.floor(cy) * f.cols + Math.floor(cx))!.d >= 2
      ) {
        // A vista (item 31): a chasm falling away, glints of crystal far below.
        const v = vista.get(Math.floor(cy) * f.cols + Math.floor(cx))!;
        const t = clamp01((v.d - 1.5) / Math.max(1, v.n - 1));
        let c = mix(chasmA, chasmB, t * 0.8 + grain * 0.25);
        // Layers of far rock, then little crystal clusters glowing far below.
        const layer = Math.sin(py / 9 + fbm(px / 40, py / 20, 2, 33) * 5);
        c = shade(c, 0.85 + layer * 0.12);
        const bx = Math.floor(px / 7);
        const by = Math.floor(py / 7);
        if (hash(bx, by, 31) < 0.22) {
          const gx = bx * 7 + 2 + Math.floor(hash(bx, by, 34) * 3);
          const gy = by * 7 + 2 + Math.floor(hash(bx, by, 35) * 3);
          const dd = Math.abs(px - gx) + Math.abs(py - gy);
          if (dd === 0) c = mix(crystalC, white, 0.7);
          else if (dd === 1) c = mix(c, crystalC, 0.85);
          else if (dd === 2) c = mix(c, crystalC, 0.25);
        }
        r.set(px, py, c);
      } else {
        const dFloor = field(toFloor, cx, cy);
        const rockN = ridged(px / 12, py / 12, 3, 12);
        let c = mix(rockA, rockB, rockN * 0.7 + grain * 0.3);
        if (dFloor < 1.1) c = mix(c, lip, (1.1 - dFloor) * 0.85);
        if (dFloor > 1.5) c = shade(c, Math.max(0.8, 1 - (dFloor - 1.5) * 0.35));
        if (dFloor < 2 && fbm(px / 6, py / 6, 2, 14) > 0.74) c = mix(c, moss, 0.4);
        // The lit moss lip along the top of the rock, in the band's moss.
        if (dFloor < 1.0 && fbm(px / 5, py / 5, 2, 15) > 0.5) c = mix(c, moss, 0.55);
        r.set(px, py, c);
      }
    }
  }
  // Light: ambient by depth, torches warm, crystals cool, the stairwell a faint daylight.
  const light = new Raster(width, height, [f.light, f.light, f.light * 1.25]);
  const at = (c: { x: number; y: number }, dx = 0.5, dy = 0.5): [number, number] => [
    (c.x + dx) * CELL * DUNGEON_PPU,
    (c.y + dy) * CELL * DUNGEON_PPU,
  ];
  const glowC = hex(band.glow);
  const points: Array<[number, number, number, RGB]> = [
    ...f.torches.map((t): [number, number, number, RGB] => [
      ...at(t, 0.5, 0.1),
      DUNGEON.torchReach * DUNGEON_PPU,
      glowC,
    ]),
    ...f.crystals.map((c): [number, number, number, RGB] => [
      ...at(c),
      DUNGEON.crystalReach * DUNGEON_PPU,
      mix(crystalC, white, 0.1),
    ]),
    [...at(f.stairsUp), 4.5 * DUNGEON_PPU, [0.7, 0.8, 1]],
  ];
  for (const [lx, ly, rad, col] of points) {
    const flicker = 0.85 + hash(lx, ly, 20) * 0.3;
    for (let y = Math.max(0, Math.floor(ly - rad)); y < Math.min(height, ly + rad); y++) {
      for (let x = Math.max(0, Math.floor(lx - rad)); x < Math.min(width, lx + rad); x++) {
        const dd = Math.hypot(x - lx, y - ly) / rad;
        if (dd >= 1) continue;
        const wall = floorMask[y * width + x] ? 1 : 0.5;
        const k = (1 - dd) * (1 - dd) * flicker * wall * 1.6;
        const c = light.get(x, y);
        light.set(x, y, [c[0] + col[0] * k, c[1] + col[1] * k, c[2] + col[2] * k]);
      }
    }
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const c = r.get(x, y);
      const l = light.get(x, y);
      // The tops of the tall walls stay a readable mid-tone: they are far from every lamp.
      if (!floorMask[y * width + x]) for (let k = 0; k < 3; k++) l[k] = Math.max(l[k]!, 1.0);
      r.set(x, y, [
        Math.min(1.2, c[0] * l[0]),
        Math.min(1.2, c[1] * l[1]),
        Math.min(1.2, c[2] * l[2]),
      ]);
    }
  }
  paintLandmarkDecal(r, f, band);
  const texture = r.toTexture(true);
  texture.flipY = true;
  return texture;
}

/**
 * What lies on the ground under each landmark (item 18), painted onto the floor after the
 * light: a glow disc, a ring of spores, a stone dais, root tendrils. The standing part is a
 * billboard from the props sheet (`lm-*`).
 */
function paintLandmarkDecal(r: Raster, f: Floor, band: ReturnType<typeof bandFor>): void {
  const lm = f.landmark;
  if (!lm) return;
  const cellPx = CELL * DUNGEON_PPU;
  const cx = (lm.cell.x + 0.5) * cellPx;
  const cy = (lm.cell.y + 0.5) * cellPx;
  const crystalC = hex(band.crystal);
  const ring = (rad: number, thick: number, c: RGB, a: number, dotted = 1) => {
    for (let y = Math.floor(cy - rad - thick); y <= cy + rad + thick; y++) {
      for (let x = Math.floor(cx - rad - thick); x <= cx + rad + thick; x++) {
        const d = Math.hypot(x - cx, y - cy);
        if (Math.abs(d - rad) > thick || hash(x, y, 40) > dotted) continue;
        r.set(x, y, c, a);
      }
    }
  };
  switch (lm.kind) {
    case 'crystalTree':
      for (let k = 4; k >= 1; k--) {
        r.disc(cx, cy, cellPx * 0.5 * k, crystalC, 0.1);
      }
      break;
    case 'waterfallPool':
      ring(cellPx * 0.95, 1.2, [1, 1, 1], 0.5, 0.55);
      ring(cellPx * 1.5, 1, crystalC, 0.4, 0.3);
      break;
    case 'mushroomRing': {
      const glow: RGB = mix(hex('#ff9ae0'), crystalC, 0.25);
      ring(cellPx * 1.7, 2.6, glow, 0.14);
      for (let k = 0; k < 14; k++) {
        const a = (k / 14) * Math.PI * 2;
        r.disc(cx + Math.cos(a) * cellPx * 1.7, cy + Math.sin(a) * cellPx * 1.7, 1.3, glow, 0.9);
      }
      break;
    }
    case 'shrine': {
      const dais = mix(hex(band.floor), [1, 1, 1], 0.28);
      r.disc(cx, cy, cellPx * 1.45, shade(dais, 0.7));
      r.disc(cx, cy, cellPx * 1.35, dais);
      ring(cellPx * 0.95, 0.9, hex(band.rim), 0.9);
      for (let k = 0; k < 4; k++) {
        const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
        r.rect(
          cx + Math.cos(a) * cellPx * 0.95 - 1,
          cy + Math.sin(a) * cellPx * 0.95 - 1,
          3,
          3,
          hex(band.glow),
        );
      }
      break;
    }
    case 'rootPillar':
      for (let k = 0; k < 8; k++) {
        const a0 = (k / 8) * Math.PI * 2 + hash(k, 1, 41);
        let x = cx;
        let y = cy;
        const len = cellPx * (1.4 + hash(k, 2, 41) * 1.4);
        for (let s = 0; s < len; s += 1) {
          const a = a0 + Math.sin(s / 7 + k) * 0.35;
          x += Math.cos(a);
          y += Math.sin(a);
          const w = s < len * 0.4 ? 2 : 1;
          r.rect(x, y, w, w, hex('#3a2814'), 0.9);
          if (w === 2) r.set(x, y, hex('#6a4a2c'), 0.9);
        }
      }
      break;
  }
}

// ---------------------------------------------------------------- walls

/**
 * The rock face of a Hollow wall (item 37): strata that undulate, seams with a lit edge,
 * cracks, a moss lip along the top with drips and a lit rim, a mossy foot, darker at the
 * bottom. It covers `faceUnitsW` world units across and wraps sideways, so a long wall
 * reads as one run of layers; the top row is the top of the wall wherever it ends.
 */
export function paintCaveWallTexture(depth: number): CanvasTexture {
  const band = bandFor(depth);
  const W = PX.faceW;
  const H = PX.faceH;
  const TAU = Math.PI * 2;
  const r = new Raster(W, H, hex(band.rock));
  const base = hex(band.rock);
  const mossC = hex(band.moss);
  const rimC = hex(band.rim);
  // Wave sums on whole periods across the width, so the left and right edges meet.
  const wave = (x: number, a: number, b: number, salt: number) =>
    a * Math.sin((TAU * x * 2) / W + salt) + b * Math.sin((TAU * x * 5) / W + salt * 2.3);
  const cracks: Array<[number, number, number]> = [];
  for (let k = 0; k < 7; k++) {
    cracks.push([hash(k, 3, 51) * W, 14 + hash(k, 4, 51) * H * 0.5, 18 + hash(k, 5, 51) * 42]);
  }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const yy = y + wave(x, 3.2, 1.8, 1.1);
      const layer = Math.floor(yy / 12);
      const within = yy - layer * 12;
      // Each layer has its own tone, a little warmer or cooler.
      let c = shade(base, 0.72 + hash(layer, 7, 52) * 0.5);
      c = mix(c, rimC, hash(layer, 8, 52) * 0.12);
      if (within < 1)
        c = shade(c, 0.6); // the seam
      else if (within < 2) c = shade(c, 1.22); // the lit edge under it
      // Grit.
      c = shade(c, 0.93 + hash(x, y, 53) * 0.14);
      if (hash(x >> 1, y >> 1, 54) > 0.985) c = shade(c, 1.35);
      r.set(x, y, c);
    }
  }
  for (const [cx0, cy0, len] of cracks) {
    let x = cx0;
    for (let s = 0; s < len; s++) {
      x += (hash(s, Math.floor(cx0), 55) - 0.5) * 1.6;
      const px = ((Math.round(x) % W) + W) % W;
      const py = Math.floor(cy0 + s);
      if (py >= H) break;
      const c = r.get(px, py);
      r.set(px, py, shade(c, 0.55));
    }
  }
  // Moss lip: an uneven edge with drips, and a lit rim along the very top.
  for (let x = 0; x < W; x++) {
    const edge =
      15 + wave(x, 2, 1.4, 4.2) + (hash(x >> 1, 9, 56) > 0.8 ? 8 + hash(x, 10, 56) * 12 : 0);
    for (let y = 0; y < Math.min(H, edge + 1); y++) {
      const t = y / Math.max(1, edge);
      let c = mix(shade(mossC, 1.05), shade(mossC, 0.62), t);
      if (hash(x, y, 57) > 0.9) c = shade(c, 1.25);
      r.set(x, y, c);
    }
    if (hash(x, 11, 58) > 0.55) r.set(x, 0, mix(rimC, [1, 1, 1], 0.25));
    else r.set(x, 0, rimC);
    r.set(x, 1, mix(rimC, mossC, 0.5));
  }
  // The foot: damp and dark, with a few moss tufts.
  for (let y = H - 22; y < H; y++) {
    const t = (y - (H - 22)) / 22;
    for (let x = 0; x < W; x++) {
      let c = shade(r.get(x, y), 1 - t * 0.38);
      if (t > 0.45 && fbm(x / 4, y / 4, 2, 59) > 0.6 + (1 - t) * 0.4) c = mix(c, mossC, 0.55);
      r.set(x, y, c);
    }
  }
  const tex = r.toTexture(true);
  tex.wrapS = RepeatWrapping;
  tex.wrapT = RepeatWrapping;
  return tex;
}

// ---------------------------------------------------------------- props

const PPU = 32;

function begin(w: number, h: number): Raster {
  const r = new Raster(w, h, null);
  r.tracking = true;
  return r;
}

function finish(r: Raster): Raster {
  r.tracking = false;
  rimObjects(r);
  return r;
}

function torch(): Raster {
  const r = begin(16, 30);
  // Iron bracket, a wooden handle, the flame.
  r.rect(6, 12, 4, 16, hex('#4a2e18'));
  r.rect(6, 12, 1, 16, hex('#6a4a2c'));
  r.rect(4, 11, 8, 3, hex('#3a3a44'));
  r.ellipse(8, 7, 3.5, 5, hex('#ff8a1f'));
  r.ellipse(8, 8, 2.2, 3.4, hex('#ffd25a'));
  r.ellipse(8, 9, 1.1, 1.8, hex('#fff6d0'));
  return finish(r);
}

/** A torch on a wall plate: it hangs on the rock face at `sconceY`, not on a post. */
function sconce(): Raster {
  const r = begin(18, 34);
  r.rect(4, 15, 10, 16, hex('#2c2a36')); // backplate
  r.rect(4, 15, 10, 1, hex('#5a5870'));
  r.rect(7, 22, 4, 9, hex('#3a3a44'));
  r.rect(5, 18, 8, 4, hex('#4a4858')); // bowl
  r.rect(5, 18, 8, 1, hex('#7a7890'));
  r.ellipse(9, 11, 3.6, 5.6, hex('#ff8a1f'));
  r.ellipse(9, 12, 2.3, 3.8, hex('#ffd25a'));
  r.ellipse(9, 13, 1.1, 2, hex('#fff6d0'));
  return finish(r);
}

/** A small glowing mushroom, set round the ring (item 18). */
function mushroom(): Raster {
  const r = begin(16, 18);
  r.rect(7, 10, 3, 6, hex('#e8dcc8'));
  r.ellipse(8, 9, 6.5, 4.6, hex('#d86aa8'));
  r.ellipse(8, 8, 5, 3, hex('#f58cc8'));
  for (const [x, y] of [
    [5, 7],
    [9, 6],
    [11, 9],
    [7, 10],
  ] as const) {
    r.set(x, y, hex('#ffe8f6'));
  }
  return finish(r);
}

/** The landmark of the great chamber, one per kind (item 18). Fixed colours, band-agnostic. */
function landmark(kind: string): Raster {
  switch (kind) {
    case 'crystalTree': {
      const r = begin(80, 100);
      r.ellipse(40, 92, 22, 6, hex('#3a3346')); // roots
      r.rect(34, 50, 12, 44, hex('#4a6a8a'));
      r.rect(34, 50, 4, 44, hex('#7ab0d0'));
      const shard = (
        x: number,
        y: number,
        w: number,
        h: number,
        lean: number,
        c: string,
        l: string,
      ) => {
        r.tri(x - w / 2, y, x + w / 2, y, x + lean, y - h, hex(c));
        r.tri(x - w / 2, y, x, y, x + lean, y - h, hex(l));
      };
      shard(40, 56, 18, 56, 0, '#5fd0f0', '#bff4ff');
      shard(30, 62, 12, 34, -16, '#4fc0e0', '#9fe6ff');
      shard(50, 60, 12, 40, 18, '#6fd8f4', '#cff8ff');
      shard(24, 50, 10, 28, -12, '#4fc0e0', '#9fe6ff');
      shard(58, 46, 10, 26, 14, '#5fd0f0', '#bff4ff');
      for (const [x, y] of [
        [40, 18],
        [26, 40],
        [58, 34],
        [47, 30],
      ] as const) {
        r.set(x, y, hex('#ffffff'));
      }
      return finish(r);
    }
    case 'waterfallPool': {
      const r = begin(72, 84);
      r.tri(4, 82, 68, 82, 36, 4, hex('#5a5068'));
      r.tri(4, 82, 36, 82, 36, 4, hex('#7a7088'));
      r.ellipse(36, 82, 34, 5, hex('#463c5c'));
      r.rect(30, 14, 12, 66, hex('#7ac0ee')); // the fall
      r.rect(32, 14, 3, 66, hex('#cdeeff'));
      r.rect(38, 24, 2, 50, hex('#a0daf8'));
      r.ellipse(36, 80, 14, 4, hex('#e8f8ff')); // foam
      for (const [x, y] of [
        [10, 60],
        [60, 54],
        [16, 40],
        [54, 30],
      ] as const) {
        r.rect(x, y, 3, 2, hex('#4a8a4a'));
      }
      return finish(r);
    }
    case 'shrine': {
      const r = begin(72, 72);
      r.rect(18, 60, 36, 8, hex('#8a8498'));
      r.rect(22, 18, 28, 44, hex('#a8a2b8'));
      r.ellipse(36, 18, 14, 8, hex('#a8a2b8'));
      r.rect(22, 18, 5, 44, hex('#d0cadc'));
      r.rect(30, 26, 12, 3, hex('#7fe8ff')); // a rune
      r.rect(35, 26, 2, 16, hex('#7fe8ff'));
      r.rect(31, 36, 10, 2, hex('#7fe8ff'));
      for (const x of [8, 58]) {
        r.rect(x, 40, 6, 24, hex('#6a6478'));
        r.rect(x - 2, 34, 10, 6, hex('#3a3846'));
        r.ellipse(x + 3, 30, 3.4, 5, hex('#ff8a1f'));
        r.ellipse(x + 3, 31, 2, 3, hex('#ffe08a'));
      }
      return finish(r);
    }
    default: {
      // rootPillar
      const r = begin(72, 104);
      r.ellipse(36, 98, 28, 6, hex('#2a1c10'));
      r.rect(24, 24, 24, 74, hex('#5a3c20'));
      r.rect(24, 24, 7, 74, hex('#8a6038'));
      r.rect(42, 24, 6, 74, hex('#3a2812'));
      for (const y of [40, 58, 76]) r.rect(24, y, 24, 2, hex('#3a2812'));
      r.tri(8, 98, 28, 98, 26, 60, hex('#4a3018'));
      r.tri(44, 98, 64, 98, 46, 56, hex('#4a3018'));
      r.tri(14, 40, 30, 28, 30, 44, hex('#5a3c20'));
      r.tri(58, 34, 42, 24, 42, 42, hex('#5a3c20'));
      r.ellipse(36, 22, 18, 6, hex('#4a8a3a')); // a mossy crown
      r.ellipse(36, 20, 12, 3, hex('#8fd262'));
      for (const [x, y] of [
        [30, 50],
        [40, 66],
        [34, 84],
      ] as const) {
        r.rect(x, y, 3, 3, hex('#8fe8c0')); // glowing sap
      }
      return finish(r);
    }
  }
}

function crystal(): Raster {
  const r = begin(26, 30);
  r.tri(4, 28, 14, 28, 9, 6, hex('#6fd8f4'));
  r.tri(4, 28, 9, 28, 9, 6, hex('#bff4ff'));
  r.tri(12, 28, 23, 28, 19, 12, hex('#4fc0e0'));
  r.tri(12, 28, 17, 28, 19, 12, hex('#9fe6ff'));
  r.tri(1, 28, 7, 28, 3, 19, hex('#5fd0f0'));
  r.set(9, 9, hex('#ffffff'));
  r.set(19, 15, hex('#ffffff'));
  return finish(r);
}

function chest(open: boolean): Raster {
  const r = begin(28, 24);
  r.rect(3, 10, 22, 12, hex('#6a3e1c'));
  r.rect(3, 10, 22, 1, hex('#9a6a3a'));
  r.rect(3, 14, 22, 1, hex('#3a2612'));
  for (const x of [5, 22]) r.rect(x, 10, 2, 12, hex('#3a3a44'));
  if (open) {
    r.rect(2, 2, 24, 7, hex('#8a5a32'));
    r.rect(2, 2, 24, 1, hex('#b07c34'));
    r.rect(5, 11, 18, 3, hex('#f2d34c'));
    r.set(9, 10, hex('#fff6c0'));
    r.set(17, 10, hex('#fff6c0'));
  } else {
    r.rect(3, 5, 22, 6, hex('#8a5a32'));
    r.rect(3, 5, 22, 1, hex('#b07c34'));
    r.rect(12, 9, 4, 4, hex('#f2d34c'));
    r.rect(13, 10, 2, 1, hex('#3a2612'));
  }
  return finish(r);
}

/** Flat markers for the stairs: a lit hole going down, a lit flight going up. */
function stairs(down: boolean): Raster {
  const r = new Raster(40, 40, null);
  r.tracking = true;
  for (let i = 0; i < 5; i++) {
    const t = i / 4;
    const c = down
      ? mix(hex('#9a92a8'), hex('#120e1a'), t)
      : mix(hex('#2a2436'), hex('#d8d0e4'), t);
    r.rect(6 + i * 2, 6 + i * 6, 28 - i * 4, 6, c);
    r.rect(6 + i * 2, 11 + i * 6, 28 - i * 4, 1, hex('#0b0810'));
  }
  r.tracking = false;
  rimObjects(r, 0.5, 0.9);
  return r;
}

function shells(): Raster {
  const r = begin(20, 14);
  for (const [x, y, c] of [
    [6, 9, '#f2d34c'],
    [12, 10, '#ffe88a'],
    [9, 6, '#f2d34c'],
    [14, 6, '#e8c040'],
  ] as const) {
    r.ellipse(x, y, 3.2, 2.4, hex(c));
    r.set(x - 1, y - 1, hex('#fff6c0'));
  }
  return finish(r);
}

function stone(): Raster {
  const r = begin(20, 16);
  for (let y = 2; y < 15; y++) {
    for (let x = 2; x < 18; x++) {
      const dx = (x - 10) / 8;
      const dy = (y - 9) / 6;
      if (dx * dx + dy * dy + (fbm(x / 4, y / 4, 2, 21) - 0.5) * 0.4 > 1) continue;
      let c = mix(hex('#6a6a78'), hex('#b8b8c4'), fbm(x / 5, y / 5, 2, 22));
      c = shade(c, 1.15 - (x + y) / 30);
      r.set(x, y, c);
    }
  }
  return finish(r);
}

function seed(): Raster {
  const r = begin(14, 16);
  r.ellipse(7, 10, 4, 5, hex('#8a5a32'));
  r.ellipse(6, 9, 2, 3, hex('#b07c34'));
  r.line(7, 5, 9, 1, hex('#4a9c42'));
  r.ellipse(10, 2, 2, 1.2, hex('#8fd262'));
  return finish(r);
}

function essence(): Raster {
  const r = begin(16, 22);
  r.tri(2, 18, 14, 18, 8, 2, hex('#b58cff'));
  r.tri(2, 18, 8, 18, 8, 2, hex('#e4d0ff'));
  r.ellipse(8, 18, 6, 2, hex('#7a5ad0'));
  r.set(7, 7, hex('#ffffff'));
  return finish(r);
}

function critter(): Raster {
  const r = begin(22, 22);
  r.disc(11, 11, 9, hex('#9ad0ff'));
  r.disc(11, 11, 7.5, hex('#c8e8ff'));
  r.ellipse(11, 12, 4, 3.5, hex('#3a3346'));
  r.disc(9, 11, 1, hex('#ffffff'));
  r.disc(13, 11, 1, hex('#ffffff'));
  r.set(7, 6, hex('#ffffff'));
  r.set(8, 5, hex('#ffffff'));
  return finish(r);
}

function egg(): Raster {
  const r = begin(16, 20);
  for (let y = 1; y < 19; y++) {
    for (let x = 1; x < 15; x++) {
      const dx = (x - 8) / 6.5;
      const dy = (y - 10) / 9;
      if (dx * dx + dy * dy * (y < 10 ? 1.2 : 1) > 1) continue;
      let c = mix(hex('#e8e0d0'), hex('#fff8ec'), fbm(x / 4, y / 4, 2, 23));
      c = shade(c, 1.1 - (x + y) / 40);
      if (hash(x, y, 24) < 0.08) c = hex('#c9a0ff');
      r.set(x, y, c);
    }
  }
  return finish(r);
}

export function buildDungeonProps(): SpriteSheet {
  const atlas = new RasterAtlas(512);
  const add = (key: string, raster: Raster) => atlas.add(frameKey(key, 'front', 0), raster);
  add('torch', torch());
  add('crystal', crystal());
  add('sconce', sconce());
  add('lm-mushroom', mushroom());
  for (const k of ['crystalTree', 'waterfallPool', 'shrine', 'rootPillar'])
    add('lm-' + k, landmark(k));
  add('chest', chest(false));
  add('chestOpen', chest(true));
  add('stairsDown', stairs(true));
  add('stairsUp', stairs(false));
  add('loot-shells', shells());
  add('loot-stone', stone());
  add('loot-seed', seed());
  add('loot-essence', essence());
  add('loot-critter', critter());
  add('loot-egg', egg());
  void PPU;
  void FLOOR;
  return atlas.build();
}
