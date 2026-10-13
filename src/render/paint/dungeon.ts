import type { CanvasTexture } from 'three';
import { DUNGEON } from '../../config/tuning';
import { cellAt, FLOOR, WALL, WATER, type Floor } from '../../sim/dungeon';
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

export function floorWorldSize(f: Floor): { w: number; h: number } {
  return { w: f.cols * CELL, h: f.rows * CELL };
}

export function paintFloorTexture(f: Floor): CanvasTexture {
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
  const floorA = hex('#857d8c');
  const floorB = hex('#bfb6c4');
  const rockA = hex('#1c1828');
  const rockB = hex('#463c5c');
  const lip = hex('#a494b4');
  const waterA = hex('#1b2f55');
  const waterB = hex('#3a6a9a');
  const moss = hex('#3f7a3a');
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
        if (cell === WATER) {
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
        }
        r.set(px, py, c);
      } else {
        const dFloor = field(toFloor, cx, cy);
        const rockN = ridged(px / 12, py / 12, 3, 12);
        let c = mix(rockA, rockB, rockN * 0.7 + grain * 0.3);
        if (dFloor < 1.1) c = mix(c, lip, (1.1 - dFloor) * 0.85);
        if (dFloor > 1.5) c = shade(c, Math.max(0.12, 1 - (dFloor - 1.5) * 0.35));
        if (dFloor < 2 && fbm(px / 6, py / 6, 2, 14) > 0.74) c = mix(c, hex('#6a7a5a'), 0.3);
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
  const points: Array<[number, number, number, RGB]> = [
    ...f.torches.map((t): [number, number, number, RGB] => [
      ...at(t, 0.5, 0.1),
      DUNGEON.torchReach * DUNGEON_PPU,
      [1, 0.62, 0.25],
    ]),
    ...f.crystals.map((c): [number, number, number, RGB] => [
      ...at(c),
      DUNGEON.crystalReach * DUNGEON_PPU,
      [0.3, 0.9, 1],
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
      r.set(x, y, [
        Math.min(1.2, c[0] * l[0]),
        Math.min(1.2, c[1] * l[1]),
        Math.min(1.2, c[2] * l[2]),
      ]);
    }
  }
  const texture = r.toTexture(true);
  texture.flipY = true;
  return texture;
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
