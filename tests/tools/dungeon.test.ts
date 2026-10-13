/**
 * A procedurally generated dungeon, rendered in the organic style: a seeded cave from
 * cellular automata with rooms carved in and corridors joining them, walls whose
 * edges wander with noise, a stone floor with cracks and puddles, moss near the water,
 * torches and crystals as point lights, a chest, bones, and the stairs you came down.
 *
 *   PREVIEW_DUNGEON=path/to/dir npx vitest run tests/tools/dungeon.test.ts
 *
 * Writes dungeon-<seed>.png for two seeds and dungeon-map-<seed>.png (the grid).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { Rng } from '../../src/sim/rng';
import { fbm, ridged, vnoise, warped } from '../../src/render/paint/noise';
import { encodePng } from './png';
import {
  bloom,
  grade,
  hash,
  hex,
  mix,
  Raster,
  shade,
  vignette,
  type RGB,
} from '../../src/render/paint/raster';

const COLS = 70;
const ROWS = 42;
const CELL = 8;
const W = COLS * CELL;
const H = ROWS * CELL;

// ---------------------------------------------------------------- generation (seeded, pure)

export interface Dungeon {
  /** true = floor */
  grid: boolean[][];
  rooms: Array<{ x: number; y: number; w: number; h: number }>;
  stairs: [number, number];
  chest: [number, number];
  torches: Array<[number, number]>;
  crystals: Array<[number, number]>;
  water: Set<string>;
}

function generate(seed: number): Dungeon {
  const rng = Rng.fromSeed(seed);
  let grid: boolean[][] = [];
  for (let y = 0; y < ROWS; y++) {
    grid.push([]);
    for (let x = 0; x < COLS; x++) {
      const border = x < 2 || y < 2 || x >= COLS - 2 || y >= ROWS - 2;
      grid[y]!.push(!border && rng.chance(0.52));
    }
  }
  // Cellular automata: a cell is floor if enough neighbours are.
  const count = (g: boolean[][], x: number, y: number) => {
    let n = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;
        if (g[y + dy]?.[x + dx]) n++;
      }
    }
    return n;
  };
  for (let it = 0; it < 5; it++) {
    const next = grid.map((row) => [...row]);
    for (let y = 1; y < ROWS - 1; y++) {
      for (let x = 1; x < COLS - 1; x++) {
        const n = count(grid, x, y);
        next[y]![x] = grid[y]![x] ? n >= 4 : n >= 5;
      }
    }
    grid = next;
  }
  // Rooms: a few rectangles with chipped corners, joined by wobbly corridors.
  const rooms: Dungeon['rooms'] = [];
  for (let i = 0; i < 4; i++) {
    const w = rng.int(7, 12);
    const h = rng.int(5, 8);
    const x = rng.int(4, COLS - w - 4);
    const y = rng.int(4, ROWS - h - 4);
    rooms.push({ x, y, w, h });
    for (let yy = y; yy < y + h; yy++) {
      for (let xx = x; xx < x + w; xx++) {
        const corner = (xx === x || xx === x + w - 1) && (yy === y || yy === y + h - 1);
        if (corner && rng.chance(0.6)) continue;
        grid[yy]![xx] = true;
      }
    }
  }
  const carve = (x: number, y: number) => {
    if (x > 1 && y > 1 && x < COLS - 2 && y < ROWS - 2) grid[y]![x] = true;
  };
  for (let i = 1; i < rooms.length; i++) {
    const a = rooms[i - 1]!;
    const b = rooms[i]!;
    let x = Math.floor(a.x + a.w / 2);
    let y = Math.floor(a.y + a.h / 2);
    const tx = Math.floor(b.x + b.w / 2);
    const ty = Math.floor(b.y + b.h / 2);
    while (x !== tx || y !== ty) {
      if (x !== tx && (y === ty || rng.chance(0.6))) x += Math.sign(tx - x);
      else y += Math.sign(ty - y);
      carve(x, y);
      if (rng.chance(0.5)) carve(x + 1, y);
      if (rng.chance(0.5)) carve(x, y + 1);
    }
  }
  // Keep the largest connected region.
  const seen = new Set<string>();
  let best: Array<[number, number]> = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (!grid[y]![x] || seen.has(`${x},${y}`)) continue;
      const region: Array<[number, number]> = [];
      const stack: Array<[number, number]> = [[x, y]];
      seen.add(`${x},${y}`);
      while (stack.length) {
        const [cx, cy] = stack.pop()!;
        region.push([cx, cy]);
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ] as const) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (grid[ny]?.[nx] && !seen.has(`${nx},${ny}`)) {
            seen.add(`${nx},${ny}`);
            stack.push([nx, ny]);
          }
        }
      }
      if (region.length > best.length) best = region;
    }
  }
  const keep = new Set(best.map(([x, y]) => `${x},${y}`));
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) grid[y]![x] = keep.has(`${x},${y}`);
  // Water: low pockets of a noise field inside the floor, away from the stairs.
  const water = new Set<string>();
  for (const [x, y] of best) {
    if (fbm(x / 6 + seed, y / 6, 3, 1) < 0.36 && count(grid, x, y) === 8) water.add(`${x},${y}`);
  }
  // Props: stairs in the first room, a chest in the last, torches on walls facing floor,
  // crystals in dead-end nooks.
  const r0 = rooms[0]!;
  const rl = rooms[rooms.length - 1]!;
  const stairs: [number, number] = [r0.x + 1, r0.y + 1];
  const chest: [number, number] = [rl.x + rl.w - 2, rl.y + rl.h - 2];
  const torches: Array<[number, number]> = [];
  const crystals: Array<[number, number]> = [];
  for (const [x, y] of best) {
    if (
      !grid[y - 1]?.[x] &&
      grid[y + 1]?.[x] &&
      hash(x, y, seed) < 0.09 &&
      !water.has(`${x},${y}`)
    ) {
      if (!torches.some(([tx, ty]) => Math.hypot(tx - x, ty - y) < 7)) torches.push([x, y]);
    }
    if (count(grid, x, y) <= 3 && hash(x, y, seed + 1) < 0.35) {
      if (!crystals.some(([tx, ty]) => Math.hypot(tx - x, ty - y) < 9)) crystals.push([x, y]);
    }
  }
  return { grid, rooms, stairs, chest, torches, crystals, water };
}

// ---------------------------------------------------------------- rendering

/** Distance (in cells, smooth) from a point to the nearest wall cell centre. */
function wallDistance(d: Dungeon, px: number, py: number): number {
  const cx = px / CELL;
  const cy = py / CELL;
  let best = 99;
  for (let y = Math.floor(cy) - 3; y <= Math.floor(cy) + 3; y++) {
    for (let x = Math.floor(cx) - 3; x <= Math.floor(cx) + 3; x++) {
      if (d.grid[y]?.[x] !== false) continue;
      // Each wall cell is a block; distance to its edges.
      const dx = Math.max(x - cx, 0, cx - (x + 1));
      const dy = Math.max(y - cy, 0, cy - (y + 1));
      best = Math.min(best, Math.hypot(dx, dy));
    }
  }
  return best;
}

function render(d: Dungeon, seed: number): Raster {
  const r = new Raster(W, H, hex('#120e1a'));
  const light = new Raster(W, H, [0.34, 0.34, 0.5]);
  const floorMask: Uint8Array = new Uint8Array(W * H);
  // Floor and walls per pixel. The wall edge is the cell boundary warped by noise, so
  // the rock face wanders instead of following the grid.
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const wx = x + (warped(x / 22, y / 22, 0.8, 2) - 0.5) * 9;
      const wy = y + (warped(x / 22 + 9, y / 22, 0.8, 3) - 0.5) * 9;
      const cx = Math.floor(wx / CELL);
      const cy = Math.floor(wy / CELL);
      const floor = d.grid[cy]?.[cx] === true;
      if (floor) {
        floorMask[y * W + x] = 1;
        const dist = wallDistance(d, wx, wy);
        const grain = fbm(x / 7, y / 7, 4, 4);
        const crack = ridged(x / 9, y / 9, 3, 5);
        let c = mix(hex('#8a8290'), hex('#c4bcc6'), grain);
        if (crack > 0.78) c = shade(c, 0.6);
        // Flagstones: big noise cells with dark joints.
        const joint = Math.abs(vnoise(x / 13, y / 13, 6) - 0.5) < 0.03;
        if (joint) c = shade(c, 0.65);
        // Darker toward the walls, like dust gathered at the edges.
        c = shade(c, 0.7 + Math.min(1, dist / 1.6) * 0.3);
        const wet = d.water.has(`${cx},${cy}`);
        if (wet) {
          const depth = fbm(x / 10, y / 10, 3, 7);
          c = mix(hex('#1b2f55'), hex('#3a6a9a'), depth);
          if (fbm(x / 8 + y / 40, y / 4, 2, 8) > 0.7) c = mix(c, hex('#9ad0ff'), 0.5);
        } else {
          // Moss near water and in damp corners.
          const damp = fbm(x / 30, y / 30, 3, 9);
          const nearWater = [1, -1].some(
            (o) => d.water.has(`${cx + o},${cy}`) || d.water.has(`${cx},${cy + o}`),
          );
          if (nearWater || (damp > 0.63 && dist < 1.2))
            c = mix(c, hex('#3f7a3a'), 0.5 + fbm(x / 4, y / 4, 2, 10) * 0.4);
          // Pebbles and bones.
          if (hash(x >> 1, y >> 1, 11) < 0.012) c = mix(c, hex('#b8b0c0'), 0.8);
        }
        r.set(x, y, c);
      } else {
        const dist = wallDistance(d, wx, wy);
        const dFloor = (() => {
          // Distance to the nearest floor cell, for the lit rim on the face.
          let b = 99;
          for (let yy = cy - 2; yy <= cy + 2; yy++) {
            for (let xx = cx - 2; xx <= cx + 2; xx++) {
              if (d.grid[yy]?.[xx])
                b = Math.min(b, Math.hypot((xx + 0.5) * CELL - wx, (yy + 0.5) * CELL - wy) / CELL);
            }
          }
          return b;
        })();
        const rockN = ridged(x / 11, y / 11, 4, 12);
        const bands = fbm(x / 40, y / 6, 3, 13);
        let c = mix(hex('#1f1a2e'), hex('#4a3f62'), rockN * 0.7 + bands * 0.3);
        if (dFloor < 1.1) c = mix(c, hex('#a898b8'), (1.1 - dFloor) * 0.9); // the lit lip of the face
        if (dFloor > 1.6) c = shade(c, Math.max(0.3, 1 - (dFloor - 1.6) * 0.28)); // deep rock fades out
        if (fbm(x / 5, y / 5, 2, 14) > 0.74 && dFloor < 2) c = mix(c, hex('#6a7a5a'), 0.3); // lichen
        r.set(x, y, c);
        void dist;
      }
    }
  }
  // Props drawn over the floor.
  const [sx, sy] = d.stairs;
  for (let i = 0; i < 4; i++) {
    r.rect(
      sx * CELL - 2,
      sy * CELL - 6 + i * 4,
      CELL + 6,
      3,
      mix(hex('#9a92a8'), hex('#3a3346'), i / 3),
    );
    r.rect(sx * CELL - 2, sy * CELL - 6 + i * 4 + 3, CELL + 6, 1, hex('#1a1624'));
  }
  const [chx, chy] = d.chest;
  r.rect(chx * CELL - 1, chy * CELL - 2, 10, 8, hex('#6a3e1c'));
  r.rect(chx * CELL - 1, chy * CELL - 2, 10, 3, hex('#8a5a32'));
  r.rect(chx * CELL + 3, chy * CELL + 1, 2, 2, hex('#f2d34c'));
  r.rect(chx * CELL - 1, chy * CELL + 1, 10, 1, hex('#f2d34c'), 0.6);
  for (const [tx, ty] of d.torches) {
    const px = tx * CELL + 4;
    const py = ty * CELL - 2;
    r.rect(px - 1, py, 2, 7, hex('#4a2e18'));
    r.ellipse(px, py - 2, 2.5, 3.5, hex('#ff9a2a'));
    r.ellipse(px, py - 3, 1.3, 2, hex('#fff1b8'));
  }
  for (const [cx, cy] of d.crystals) {
    const px = cx * CELL + 4;
    const py = cy * CELL + 4;
    r.tri(px - 3, py + 3, px + 3, py + 3, px, py - 7, hex('#7fe8ff'));
    r.tri(px - 3, py + 3, px, py + 3, px, py - 7, hex('#c8f8ff'));
    r.tri(px + 2, py + 3, px + 6, py + 3, px + 5, py - 3, hex('#5fd0f0'));
  }
  // Bones in a corner of the last room.
  const rl = d.rooms[d.rooms.length - 1]!;
  const bx = rl.x * CELL + 6;
  const by = rl.y * CELL + 6;
  r.line(bx, by, bx + 9, by + 3, hex('#d8d0dc'));
  r.disc(bx, by, 1.5, hex('#d8d0dc'));
  r.disc(bx + 9, by + 3, 1.5, hex('#d8d0dc'));
  r.ellipse(bx + 14, by + 1, 3, 2.5, hex('#d8d0dc'));
  r.set(bx + 13, by + 1, hex('#1a1624'));
  r.set(bx + 15, by + 1, hex('#1a1624'));
  // Light: torches warm, crystals cool, the stairwell a faint daylight, all with falloff
  // and blocked (dimly) by walls through the floor mask.
  const points: Array<[number, number, number, RGB]> = [
    ...d.torches.map(([tx, ty]): [number, number, number, RGB] => [
      tx * CELL + 4,
      ty * CELL - 3,
      62,
      [1, 0.62, 0.25],
    ]),
    ...d.crystals.map(([cx, cy]): [number, number, number, RGB] => [
      cx * CELL + 4,
      cy * CELL,
      36,
      [0.3, 0.9, 1],
    ]),
    [sx * CELL + 4, sy * CELL, 50, [0.7, 0.8, 1]],
  ];
  for (const [lx, ly, rad, col] of points) {
    for (let y = Math.max(0, ly - rad); y < Math.min(H, ly + rad); y++) {
      for (let x = Math.max(0, lx - rad); x < Math.min(W, lx + rad); x++) {
        const dd = Math.hypot(x - lx, y - ly) / rad;
        if (dd >= 1) continue;
        const flicker = 0.85 + hash(lx, ly, 20) * 0.3;
        const wall = floorMask[y * W + x] ? 1 : 0.55;
        const k = (1 - dd) * (1 - dd) * flicker * wall;
        const c = light.get(x, y);
        light.set(x, y, [
          c[0] + col[0] * k * 1.5,
          c[1] + col[1] * k * 1.5,
          c[2] + col[2] * k * 1.5,
        ]);
      }
    }
  }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = r.get(x, y);
      const l = light.get(x, y);
      r.set(x, y, [c[0] * l[0], c[1] * l[1], c[2] * l[2]]);
    }
  }
  // Self-lit flames, crystals and the stair glow; drifting dust motes in the torchlight.
  for (const [tx, ty] of d.torches) {
    const px = tx * CELL + 4;
    const py = ty * CELL - 4;
    r.ellipse(px, py, 2.5, 3.5, hex('#ffb347'));
    r.ellipse(px, py - 1, 1.3, 2, hex('#fff6d0'));
  }
  for (const [cx, cy] of d.crystals) {
    const px = cx * CELL + 4;
    const py = cy * CELL + 4;
    r.tri(px - 3, py + 3, px + 3, py + 3, px, py - 7, hex('#bff4ff'), 0.9);
  }
  const rng = Rng.fromSeed(seed + 99);
  for (let i = 0; i < 60; i++) {
    const [lx, ly] = points[rng.int(0, points.length - 1)]!;
    const x = lx + rng.float(-30, 30);
    const y = ly + rng.float(-24, 24);
    if (floorMask[Math.round(y) * W + Math.round(x)]) r.set(x, y, hex('#fff1b8'), 0.5);
  }
  // Fog in the far corners and the frame.
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const f = fbm(x / 60, y / 60, 3, 30);
      if (!floorMask[y * W + x]) continue;
      r.set(x, y, hex('#2a2a46'), clamp01((f - 0.62) * 0.8));
    }
  }
  bloom(r, 0.55, 5, 0.7);
  grade(r, hex('#8088c0'), hex('#fff0d8'));
  vignette(r, 0.7);
  return r;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/** The bare grid, for reading the generator. */
function renderMap(d: Dungeon): Raster {
  const r = new Raster(COLS * 4, ROWS * 4, hex('#1a1624'));
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (!d.grid[y]![x]) continue;
      r.rect(x * 4, y * 4, 4, 4, d.water.has(`${x},${y}`) ? hex('#3a6a9a') : hex('#8c8398'));
    }
  }
  for (const room of d.rooms)
    r.rect(room.x * 4, room.y * 4, room.w * 4, room.h * 4, hex('#b8a8c8'), 0.25);
  r.rect(d.stairs[0] * 4, d.stairs[1] * 4, 4, 4, hex('#ffffff'));
  r.rect(d.chest[0] * 4, d.chest[1] * 4, 4, 4, hex('#f2d34c'));
  for (const [x, y] of d.torches) r.rect(x * 4, y * 4, 4, 4, hex('#ff9a2a'));
  for (const [x, y] of d.crystals) r.rect(x * 4, y * 4, 4, 4, hex('#7fe8ff'));
  return r;
}

it.skipIf(!process.env.PREVIEW_DUNGEON)('writes two procedurally generated dungeons', () => {
  const dir = process.env.PREVIEW_DUNGEON!;
  mkdirSync(dir, { recursive: true });
  for (const seed of [7, 2026]) {
    const d = generate(seed);
    const o = render(d, seed).toRgba(2);
    writeFileSync(join(dir, `dungeon-${seed}.png`), encodePng(o.width, o.height, o.rgba));
    const m = renderMap(d).toRgba(2);
    writeFileSync(join(dir, `dungeon-map-${seed}.png`), encodePng(m.width, m.height, m.rgba));
    expect(d.torches.length).toBeGreaterThan(0);
  }
});

it('generates the same dungeon for the same seed, and a connected one', () => {
  const a = generate(11);
  const b = generate(11);
  expect(a.grid).toEqual(b.grid);
  // Every floor cell reaches the stairs.
  const seen = new Set<string>();
  const stack: Array<[number, number]> = [a.stairs];
  while (stack.length) {
    const [x, y] = stack.pop()!;
    if (seen.has(`${x},${y}`) || !a.grid[y]?.[x]) continue;
    seen.add(`${x},${y}`);
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }
  const floors = a.grid.flat().filter(Boolean).length;
  expect(seen.size).toBe(floors);
  expect(a.grid[a.chest[1]]![a.chest[0]]).toBe(true);
});
