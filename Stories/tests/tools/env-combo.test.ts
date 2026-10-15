/**
 * A bigger sample combining directions 3 and 5: a painterly scene at dusk with a real
 * light pass (sun, long shadows, window and lantern lights, fireflies, reflections),
 * framed HD-2D style (tilt-shift depth of field, bloom, light shafts, grade, vignette).
 *
 *   PREVIEW_COMBO=path/to/dir npx vitest run tests/tools/env-combo.test.ts
 *
 * Writes combo-dusk.png (and combo-day.png, the same scene before the light pass).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { Rng } from '../../src/sim/rng';
import { encodePng } from './png';
import {
  bloom,
  boxBlur,
  grade,
  hash,
  hex,
  mix,
  Raster,
  shade,
  vignette,
  type RGB,
} from '../../src/render/paint/raster';

const W = 560;
const H = 330;

const LEAF = ['#1f4d26', '#2f6f32', '#3f8f3c', '#58ac48', '#7cc85a', '#a8e076'].map(hex);
const DARK_LEAF = ['#163a1f', '#1f5a2a', '#2a7a33', '#3f9a40', '#5cb850', '#86d068'].map(hex);

// ---------------------------------------------------------------- painterly props

function paintTree(r: Raster, rng: Rng, x: number, base: number, s: number, tones = LEAF): void {
  r.ellipse(x + 6 * s, base + 2, 34 * s, 9 * s, hex('#2f5a28'), 0.5);
  r.gradient(
    Math.round(x - 6 * s),
    Math.round(base - 44 * s),
    Math.round(12 * s),
    Math.round(44 * s),
    hex('#8a5a32'),
    hex('#4a2e18'),
  );
  for (let i = 0; i < 40; i++) {
    r.line(
      x - 5 * s + rng.int(0, 10 * s),
      base - rng.int(0, 44 * s),
      x - 5 * s + rng.int(0, 10 * s),
      base - rng.int(0, 44 * s),
      hex('#5e3a1f'),
      0.4,
    );
  }
  r.tri(x - 6 * s, base, x - 14 * s, base + 2, x - 6 * s, base - 10 * s, hex('#5e3a1f'));
  r.tri(x + 6 * s, base, x + 14 * s, base + 2, x + 6 * s, base - 10 * s, hex('#6e4525'));
  const lobes: Array<[number, number, number]> = [
    [x - 20 * s, base - 60 * s, 22 * s],
    [x + 20 * s, base - 60 * s, 22 * s],
    [x, base - 78 * s, 26 * s],
    [x - 12 * s, base - 94 * s, 18 * s],
    [x + 14 * s, base - 92 * s, 18 * s],
  ];
  for (const [lx, ly, rr] of lobes) r.ellipse(lx, ly + 4, rr + 2, rr * 0.85 + 2, tones[0]!, 0.9);
  const dabs = Math.round(2600 * s * s);
  for (let i = 0; i < dabs; i++) {
    const [lx, ly, rr] = lobes[i % lobes.length]!;
    const a = rng.float(0, Math.PI * 2);
    const d = Math.sqrt(rng.float(0, 1)) * rr;
    const px = lx + Math.cos(a) * d;
    const py = ly + Math.sin(a) * d * 0.85;
    const lightness = 0.5 - (Math.cos(a) * d) / (rr * 2.2) - (Math.sin(a) * d) / (rr * 1.8);
    const k = Math.max(0, Math.min(5, Math.round(lightness * 5 + rng.float(-0.6, 0.6))));
    r.ellipse(px, py, 1.6, 1.2, tones[k]!, 0.85);
  }
}

function paintBush(r: Raster, rng: Rng, x: number, base: number, s = 1): void {
  r.ellipse(x + 3, base + 1, 24 * s, 7 * s, hex('#2f5a28'), 0.5);
  for (let i = 0; i < 700 * s; i++) {
    const a = rng.float(0, Math.PI * 2);
    const d = Math.sqrt(rng.float(0, 1)) * 20 * s;
    const px = x + Math.cos(a) * d;
    const py = base - 12 * s + Math.sin(a) * d * 0.6;
    const lightness = 0.5 - (Math.cos(a) * d) / (40 * s) - (Math.sin(a) * d) / (30 * s);
    const k = Math.max(0, Math.min(5, Math.round(lightness * 5 + rng.float(-0.5, 0.5))));
    r.ellipse(px, py, 1.5, 1.1, LEAF[k]!, 0.85);
  }
  for (let i = 0; i < 5; i++)
    r.disc(x + rng.float(-14, 14) * s, base - 12 * s + rng.float(-8, 6) * s, 1.6, hex('#ff6b8a'));
}

function paintFence(r: Raster, x0: number, y: number, n: number): void {
  for (let i = 0; i < n; i++) {
    const x = x0 + i * 15;
    r.gradient(x, y - 20, 5, 22, hex('#d9a76a'), hex('#7a4f2a'));
  }
  r.gradient(x0 - 2, y - 15, n * 15 - 8, 3, hex('#d9a76a'), hex('#a0703a'));
  r.gradient(x0 - 2, y - 8, n * 15 - 8, 3, hex('#d9a76a'), hex('#a0703a'));
}

interface House {
  x: number;
  y: number;
  w: number;
  h: number;
  roofH: number;
}

function paintHouse(r: Raster, rng: Rng, h: House): void {
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
    r.gradient(Math.round(bx), h.y + h.roofH, 3, h.h - h.roofH, hex('#7a5230'), hex('#4a3018'));
  }
  const ridge = h.y + 2;
  for (let y = ridge; y < h.y + h.roofH + 6; y++) {
    const tt = (y - ridge) / (h.roofH + 4);
    const half = 10 + tt * (h.w / 2 + 14);
    r.rect(
      Math.round(h.x + h.w / 2 - half),
      y,
      Math.round(half * 2),
      1,
      mix(hex('#d9a85a'), hex('#8a5e2a'), tt),
    );
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
  const dx = h.x + h.w / 2 - 12;
  const dy = h.y + h.h - 36;
  r.gradient(dx, dy, 24, 36, hex('#8a5a32'), hex('#4a2e18'));
  r.ellipse(dx + 12, dy, 12, 8, hex('#7a4f2a'));
  r.ellipse(dx + 12, dy + 2, 10, 6, hex('#5e3a1f'));
  r.disc(dx + 19, dy + 19, 1.5, hex('#f3d088'));
  for (const wx of [h.x + 14, h.x + h.w - 38]) {
    const wy = h.y + h.roofH + 16;
    r.rect(wx - 2, wy - 2, 28, 26, hex('#6a4a2a'));
    r.gradient(wx, wy, 24, 22, hex('#bfe0ff'), hex('#7fb0e0'));
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
}

function paintWell(r: Raster, x: number, y: number): void {
  r.ellipse(x, y + 2, 18, 6, hex('#2f5a28'), 0.45);
  r.ellipse(x, y - 4, 15, 7, hex('#7d7d86'));
  r.ellipse(x, y - 6, 15, 7, hex('#a8a8b2'));
  r.ellipse(x, y - 6, 10, 4.5, hex('#2b2f4a'));
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    r.rect(
      Math.round(x + Math.cos(a) * 13 - 1),
      Math.round(y - 4 + Math.sin(a) * 6),
      3,
      4,
      i % 2 ? hex('#8c8c96') : hex('#c2c2cc'),
    );
  }
  r.rect(x - 12, y - 30, 3, 26, hex('#6e4525'));
  r.rect(x + 9, y - 30, 3, 26, hex('#6e4525'));
  r.tri(x - 18, y - 28, x + 18, y - 28, x, y - 42, hex('#b04a3a'));
  r.tri(x - 18, y - 28, x, y - 28, x, y - 42, hex('#d9674f'));
  r.rect(x - 1, y - 30, 2, 12, hex('#4a3018'));
  r.rect(x - 4, y - 18, 8, 6, hex('#8a5a32'));
}

function paintKeeper(r: Raster, x: number, base: number): void {
  r.ellipse(x, base + 1, 7, 2.5, hex('#2f5a28'), 0.5);
  r.rect(x - 3, base - 8, 6, 8, hex('#3a6ea8'));
  r.rect(x - 4, base - 18, 8, 10, hex('#e8a05a'));
  r.rect(x - 4, base - 18, 8, 3, hex('#f0c46e'));
  r.ellipse(x, base - 22, 5, 5, hex('#f6d2b0'));
  r.ellipse(x, base - 26, 7, 3, hex('#d9a85a'));
  r.rect(x - 2, base - 25, 4, 3, hex('#d9a85a'));
}

function paintNubbin(r: Raster, x: number, base: number): void {
  r.ellipse(x, base + 1, 6, 2, hex('#2f5a28'), 0.5);
  r.ellipse(x, base - 6, 6, 6, hex('#7fc8f0'));
  r.ellipse(x - 2, base - 8, 2.5, 2, hex('#b8e4ff'));
  r.ellipse(x, base - 11, 4, 2.5, hex('#f2d34c'));
  r.set(x - 2, base - 6, hex('#1b1326'));
  r.set(x + 2, base - 6, hex('#1b1326'));
  r.disc(x, base - 17, 1.8, hex('#f2d34c'));
}

// ---------------------------------------------------------------- the scene

const HOUSE: House = { x: 190, y: 70, w: 120, h: 118, roofH: 48 };
const POND = { cx: 470, cy: 290, rx: 120, ry: 58 };
const LANTERN = { x: HOUSE.x - 30, y: HOUSE.y + HOUSE.h - 4 };

function pathPoints(): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  for (let t = 0; t <= 1.0001; t += 0.005) {
    pts.push([10 + t * 420, 318 - Math.sin(t * Math.PI) * 120 - t * 20 + Math.sin(t * 9) * 6]);
  }
  return pts;
}

function albedo(): Raster {
  const r = new Raster(W, H, hex('#5f9e3c'));
  const rng = new Rng(35);
  r.gradient(0, 0, W, H, hex('#86b85c'), hex('#4b8733'));
  for (let i = 0; i < 70; i++)
    r.ellipse(rng.int(0, W), rng.int(0, H), rng.int(16, 48), rng.int(6, 18), hex('#5c9a3e'), 0.5);
  for (let i = 0; i < 5200; i++) {
    const x = rng.int(0, W);
    const y = rng.int(0, H);
    const c = rng.chance(0.5) ? shade(r.get(x, y), 1.18) : shade(r.get(x, y), 0.84);
    r.set(x, y, c, 0.9);
    r.set(x, y - 1, shade(c, 1.08), 0.6);
  }
  // Wildflowers.
  for (let i = 0; i < 90; i++) {
    const x = rng.int(0, W);
    const y = rng.int(0, H);
    r.set(x, y, [hex('#ff8ab0'), hex('#ffe066'), hex('#ffffff'), hex('#c9a0ff')][i % 4]!);
    r.set(x, y + 1, hex('#2f6f32'), 0.6);
  }
  // Path.
  const pts = pathPoints();
  for (const [x, y] of pts) r.ellipse(x, y, 15, 8, hex('#8c7a4f'), 0.5);
  for (const [x, y] of pts) {
    r.ellipse(x, y, 12, 6, hex('#c7ab74'), 0.9);
    r.ellipse(x, y - 1, 7, 3, hex('#e1c892'), 0.7);
  }
  for (let i = 0; i < 90; i++) {
    const [x, y] = pts[rng.int(0, pts.length - 1)]!;
    r.ellipse(x + rng.float(-9, 9), y + rng.float(-4, 4), 1.6, 1, hex('#a28a5c'), 0.8);
  }
  // Pond.
  r.ellipse(POND.cx, POND.cy, POND.rx + 12, POND.ry + 7, hex('#b9a86d'), 0.9);
  r.ellipse(POND.cx, POND.cy, POND.rx + 5, POND.ry + 3, hex('#8aa37a'), 0.9);
  for (let y = POND.cy - POND.ry; y <= Math.min(H - 1, POND.cy + POND.ry); y++) {
    const t = (y - (POND.cy - POND.ry)) / (2 * POND.ry);
    const c = mix(hex('#6fb6e6'), hex('#1f4f8f'), t);
    for (let x = POND.cx - POND.rx; x <= Math.min(W - 1, POND.cx + POND.rx); x++) {
      const dx = (x - POND.cx) / POND.rx;
      const dy = (y - POND.cy) / POND.ry;
      if (dx * dx + dy * dy <= 1) r.set(x, y, c);
    }
  }
  for (let i = 0; i < 40; i++) {
    const x = POND.cx - POND.rx + 14 + rng.int(0, POND.rx * 2 - 28);
    const y = POND.cy - POND.ry + 6 + rng.int(0, POND.ry);
    r.line(x, y, x + rng.int(4, 14), y, hex('#cfe9ff'), 0.35);
  }
  for (const [x, y] of [
    [POND.cx - 40, POND.cy - 12],
    [POND.cx - 20, POND.cy + 4],
    [POND.cx - 60, POND.cy + 10],
  ] as const) {
    r.ellipse(x, y, 5, 3, hex('#3f8f3c'));
    r.ellipse(x - 1, y - 1, 3.5, 1.8, hex('#7cc85a'));
    r.disc(x + 3, y - 2, 1.5, hex('#ff8ab0'));
  }
  // Far trees (smaller, darker), the house, the near tree, the well, bushes, fence.
  paintTree(r, rng, 470, 120, 0.62, DARK_LEAF);
  paintTree(r, rng, 530, 150, 0.7, DARK_LEAF);
  paintFence(r, 330, 118, 9);
  paintHouse(r, rng, HOUSE);
  paintWell(r, 400, 200);
  paintTree(r, rng, 80, 215, 1.15);
  paintBush(r, rng, 350, 190, 0.9);
  paintBush(r, rng, 120, 300, 1);
  paintBush(r, rng, 300, 250, 0.7);
  // Lantern post, the Keeper and a Nubbin on the path.
  r.rect(LANTERN.x - 1, LANTERN.y - 30, 3, 32, hex('#2a2030'));
  r.rect(LANTERN.x - 5, LANTERN.y - 38, 11, 10, hex('#3a2a30'));
  r.rect(LANTERN.x - 4, LANTERN.y - 37, 9, 8, hex('#bfe0ff'));
  r.tri(
    LANTERN.x - 7,
    LANTERN.y - 38,
    LANTERN.x + 8,
    LANTERN.y - 38,
    LANTERN.x + 0.5,
    LANTERN.y - 44,
    hex('#2a2030'),
  );
  paintKeeper(r, 150, 262);
  paintNubbin(r, 172, 268);
  return r;
}

// ---------------------------------------------------------------- the light pass (5)

function lightPass(a: Raster): Raster {
  const r = new Raster(W, H, [0, 0, 0]);
  const light = new Raster(W, H, [0.34, 0.38, 0.6]);
  const shadow: RGB = [0.14, 0.16, 0.32];
  // The low sun on the left, warm, fading to the right and strongest near the horizon.
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const k = Math.max(0, 1 - x / (W * 1.1)) * 0.6 * (0.5 + 0.5 * (1 - y / H));
      light.set(x, y, [0.98, 0.62, 0.36], k);
    }
  }
  // Long cast shadows to the right.
  light.ellipse(80 + 110, 215 + 6, 100, 13, shadow, 0.85);
  light.ellipse(80 + 60, 215 - 10, 60, 16, shadow, 0.55);
  light.rect(HOUSE.x + HOUSE.w, HOUSE.y + 44, 96, HOUSE.h - 30, shadow, 0.85);
  light.tri(
    HOUSE.x + HOUSE.w,
    HOUSE.y + 44,
    HOUSE.x + HOUSE.w + 96,
    HOUSE.y + 44,
    HOUSE.x + HOUSE.w + 96,
    HOUSE.y - 12,
    shadow,
    0.6,
  );
  light.rect(
    HOUSE.x + HOUSE.w - 12,
    HOUSE.y + HOUSE.roofH,
    12,
    HOUSE.h - HOUSE.roofH,
    [0.2, 0.2, 0.36],
    0.7,
  );
  light.ellipse(400 + 30, 202, 30, 7, shadow, 0.7);
  for (let i = 0; i < 9; i++) light.rect(330 + i * 15 + 4, 98, 12, 22, shadow, 0.45);
  light.ellipse(350 + 28, 191, 26, 6, shadow, 0.7);
  light.ellipse(120 + 30, 301, 30, 7, shadow, 0.7);
  light.ellipse(300 + 20, 251, 20, 5, shadow, 0.7);
  light.ellipse(470 + 50, 122, 46, 8, shadow, 0.6);
  light.ellipse(530 + 50, 152, 50, 9, shadow, 0.6);
  light.ellipse(150 + 12, 263, 12, 3, shadow, 0.6);
  light.ellipse(172 + 9, 269, 9, 2.5, shadow, 0.6);
  // Point lights.
  const points: Array<[number, number, number, RGB]> = [
    [HOUSE.x + 26, HOUSE.y + HOUSE.roofH + 27, 86, [1, 0.72, 0.35]],
    [HOUSE.x + HOUSE.w - 26, HOUSE.y + HOUSE.roofH + 27, 86, [1, 0.72, 0.35]],
    [LANTERN.x, LANTERN.y - 33, 70, [1, 0.82, 0.5]],
  ];
  const rng = new Rng(55);
  const flies: Array<[number, number]> = [];
  for (let i = 0; i < 22; i++) {
    const fx = rng.int(20, W - 20);
    const fy = rng.int(60, H - 10);
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
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const c = a.get(x, y);
      const l = light.get(x, y);
      r.set(x, y, [c[0] * l[0], c[1] * l[1], c[2] * l[2]]);
    }
  }
  // Self-lit: windows, the lantern, fireflies.
  for (const wx of [HOUSE.x + 14, HOUSE.x + HOUSE.w - 38]) {
    const wy = HOUSE.y + HOUSE.roofH + 16;
    r.gradient(wx, wy, 24, 22, hex('#fff1b8'), hex('#ffb04a'));
    r.rect(wx + 11, wy, 2, 22, hex('#6a4a2a'));
    r.rect(wx, wy + 10, 24, 2, hex('#6a4a2a'));
  }
  r.rect(LANTERN.x - 4, LANTERN.y - 37, 9, 8, hex('#fff1b8'));
  for (const [fx, fy] of flies) {
    r.set(fx, fy, hex('#f6ffb0'));
    r.set(fx + 1, fy, hex('#d8f080'), 0.6);
  }
  // Water: dusk sky in it, and the lights smeared downward.
  for (let y = POND.cy - POND.ry; y < H; y++) {
    for (let x = POND.cx - POND.rx; x < W; x++) {
      const dx = (x - POND.cx) / POND.rx;
      const dy = (y - POND.cy) / POND.ry;
      if (dx * dx + dy * dy > 1) continue;
      const t2 = (y - (POND.cy - POND.ry)) / (2 * POND.ry);
      r.set(x, y, mix(hex('#6a4a8a'), hex('#101a3a'), t2), 0.8);
      if (hash(x >> 2, y, 9) < 0.08) r.set(x, y, hex('#a98ac8'), 0.5);
    }
  }
  for (const [lx, , , col] of points.slice(0, 3)) {
    for (let y = POND.cy - POND.ry; y < H; y++) {
      const t2 = (y - (POND.cy - POND.ry)) / (2 * POND.ry);
      for (let x = lx - 8; x <= lx + 8; x++) {
        const dx = (x - POND.cx) / POND.rx;
        const dy = (y - POND.cy) / POND.ry;
        if (dx * dx + dy * dy > 1) continue;
        const wob = hash(0, y, 3) < 0.5 ? 1 : -1;
        r.set(x + wob, y, col, 0.35 * (1 - t2) * (1 - Math.abs(x - lx) / 9));
      }
    }
  }
  // Dusk sky bleeding in at the top.
  for (let y = 0; y < 80; y++) {
    const al = (1 - y / 80) * 0.7;
    for (let x = 0; x < W; x++) r.set(x, y, mix(hex('#ff9a5a'), hex('#4a2f6b'), y / 80), al);
  }
  return r;
}

// ---------------------------------------------------------------- the HD-2D frame (3)

function hd2d(r: Raster, dusk: boolean): void {
  // Light shafts from the upper left, warmer and softer at dusk.
  for (let i = 0; i < 7; i++) {
    const x0 = -120 + i * 95;
    for (let y = 0; y < H; y++) {
      for (let k = 0; k < 26; k++) {
        const x = x0 + y * 0.55 + k;
        const a = (dusk ? 0.09 : 0.12) * (1 - Math.abs(k - 13) / 13) * (1 - y / H);
        r.set(x, y, dusk ? hex('#ffc890') : hex('#fff2c0'), a);
      }
    }
  }
  boxBlur(r, 6, (y) => {
    const d = Math.abs(y - H * 0.52) / (H * 0.52);
    return Math.max(0, (d - 0.38) / 0.62);
  });
  bloom(r, dusk ? 0.5 : 0.62, 5, dusk ? 0.7 : 0.55);
  grade(r, dusk ? hex('#8a90c8') : hex('#9fb8d8'), dusk ? hex('#ffe8c8') : hex('#fff0d0'));
  vignette(r, dusk ? 0.8 : 0.9);
}

it.skipIf(!process.env.PREVIEW_COMBO)('writes the combined HD-2D dusk sample', () => {
  const dir = process.env.PREVIEW_COMBO!;
  mkdirSync(dir, { recursive: true });
  const day = albedo();
  const dusk = lightPass(day);
  hd2d(dusk, true);
  const out = dusk.toRgba(2);
  writeFileSync(join(dir, 'combo-dusk.png'), encodePng(out.width, out.height, out.rgba));
  hd2d(day, false);
  const d = day.toRgba(2);
  writeFileSync(join(dir, 'combo-day.png'), encodePng(d.width, d.height, d.rgba));
  expect(out.width).toBe(W * 2);
});
