/**
 * Organic samples: nothing is a circle or a triangle. Trees grow by recursive
 * branching with canopies that are noise clouds, the shoreline and path edges wander
 * with domain-warped noise, the thatch sags, rocks are displaced blobs, grass and
 * flowers follow fractal fields. Same light pass and HD-2D frame as the combined sample.
 *
 *   PREVIEW_FRACTAL=path/to/dir npx vitest run tests/tools/env-fractal.test.ts
 *
 * Writes fractal-day.png and fractal-dusk.png.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { Rng } from '../../src/sim/rng';
import { eaveShadow, roofThatch } from './buildings';
import { fbm, ridged, vnoise, warped } from './noise';
import { encodePng } from './png';
import {
  bloom,
  boxBlur,
  grade,
  hash,
  hex,
  mix,
  Raster,
  rimObjects,
  shade,
  vignette,
  type RGB,
} from './raster';

const W = 560;
const H = 330;

const LEAF = ['#1b4322', '#27602c', '#357f36', '#4a9c42', '#68b94f', '#8fd262', '#b9e884'].map(hex);

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

// ---------------------------------------------------------------- fields

/** The ground: three greens blended by fbm, blades where the field is high, dry patches. */
function ground(r: Raster): void {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const n = warped(x / 90, y / 90, 0.8, 1);
      const fine = fbm(x / 9, y / 9, 3, 2);
      const dry = fbm(x / 140 + 7, y / 140, 3, 3);
      let c = mix(hex('#3f7f33'), hex('#7bb954'), clamp01((n - 0.3) * 1.8));
      c = mix(c, hex('#a7b05a'), clamp01((dry - 0.62) * 4));
      c = shade(c, 0.86 + fine * 0.3 + (1 - y / H) * 0.08);
      r.set(x, y, c);
    }
  }
  // Blades and clover: denser where a finer field is high.
  const rng = new Rng(1);
  for (let i = 0; i < 16000; i++) {
    const x = rng.int(0, W - 1);
    const y = rng.int(0, H - 1);
    const n = fbm(x / 22, y / 22, 3, 4);
    if (rng.next() > n * 1.3) continue;
    const base = r.get(x, y);
    const len = 1 + Math.round(n * 3);
    const lean = rng.float(-1, 1);
    r.line(x, y, x + lean, y - len, shade(base, 1.22), 0.9);
    r.set(x, y + 1, shade(base, 0.8), 0.5);
  }
  for (let i = 0; i < 400; i++) {
    const x = rng.int(0, W - 1);
    const y = rng.int(0, H - 1);
    if (fbm(x / 40 + 3, y / 40, 3, 5) < 0.6) continue;
    const c = [hex('#ff8ab0'), hex('#ffe066'), hex('#ffffff'), hex('#c9a0ff')][rng.int(0, 3)]!;
    r.set(x, y, c);
    r.set(x + 1, y, shade(c, 0.85), 0.8);
    r.set(x, y + 1, hex('#2f6f32'), 0.6);
  }
}

/** The path: a spline whose width and edge wander, with worn ruts and stones. */
function path(r: Raster): void {
  const pts: Array<[number, number]> = [];
  for (let t = 0; t <= 1.0001; t += 0.004) {
    pts.push([
      10 + t * 420,
      318 - Math.sin(t * Math.PI) * 120 - t * 20 + (vnoise(t * 7, 0, 6) - 0.5) * 30,
    ]);
  }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let best = 1e9;
      let bt = 0;
      for (let i = 0; i < pts.length; i += 2) {
        const [px, py] = pts[i]!;
        const d = (x - px) * (x - px) + ((y - py) * (y - py)) / 0.45;
        if (d < best) {
          best = d;
          bt = i / pts.length;
        }
      }
      const dist = Math.sqrt(best);
      const width = 11 + (fbm(bt * 9, 0.5, 3, 7) - 0.5) * 8;
      const edge = width * (0.75 + 0.5 * warped(x / 14, y / 14, 0.6, 8));
      if (dist > edge + 3) continue;
      const wear = fbm(x / 7, y / 7, 3, 9);
      if (dist > edge) {
        // A trodden fringe: darker grass with bare patches.
        r.set(x, y, hex('#5a6a33'), 0.5 * (1 - (dist - edge) / 3));
        continue;
      }
      const centre = clamp01(1 - dist / edge);
      let c = mix(hex('#9a8358'), hex('#d9c08f'), centre * 0.7 + wear * 0.3);
      if (wear > 0.68) c = mix(c, hex('#7f7f88'), 0.6); // a stone
      if (wear < 0.3) c = shade(c, 0.86); // a rut
      r.set(x, y, c, 0.95);
    }
  }
}

/** The pond: a shoreline whose radius is a noise function of the angle, a wet band, a bank. */
const POND = { cx: 470, cy: 292, r: 95 };
function pondRadius(angle: number, salt = 10): number {
  return (
    POND.r * (1 + 0.22 * (fbm(Math.cos(angle) * 2 + 9, Math.sin(angle) * 2 + 9, 4, salt) - 0.5) * 2)
  );
}
function pond(r: Raster): void {
  for (let y = POND.cy - 130; y < H; y++) {
    for (let x = POND.cx - 170; x < W; x++) {
      const dx = x - POND.cx;
      const dy = (y - POND.cy) / 0.5;
      const d = Math.hypot(dx, dy);
      const a = Math.atan2(dy, dx);
      const edge = pondRadius(a);
      if (d > edge + 16) continue;
      const bankNoise = fbm(x / 11, y / 11, 3, 11);
      if (d > edge + 4 + bankNoise * 6) {
        r.set(
          x,
          y,
          mix(hex('#b2a26d'), hex('#8f9a62'), bankNoise),
          0.8 * (1 - (d - edge - 6) / 12),
        );
        continue;
      }
      if (d > edge) {
        r.set(x, y, mix(hex('#8c7b55'), hex('#c9b784'), bankNoise), 0.95);
        continue;
      }
      const depth = clamp01(1 - d / edge);
      let c = mix(hex('#7fc0e8'), hex('#1d4a86'), Math.pow(depth, 0.7));
      const ripple = fbm(x / 16 + y / 60, y / 5, 3, 12);
      if (ripple > 0.66) c = mix(c, hex('#dff2ff'), (ripple - 0.66) * 2);
      if (d > edge - 5) c = mix(c, hex('#a9d9f0'), 0.4);
      r.tracking = true;
      r.set(x, y, c);
      r.tracking = false;
    }
  }
  // Reeds and lily pads with ragged edges.
  const rng = new Rng(13);
  for (let i = 0; i < 9; i++) {
    const a = rng.float(Math.PI * 0.9, Math.PI * 1.45);
    const edge = pondRadius(a);
    const x = POND.cx + Math.cos(a) * (edge - 3);
    const y = POND.cy + Math.sin(a) * (edge - 3) * 0.5;
    for (let k = 0; k < 3; k++) {
      const h = rng.int(14, 26);
      r.line(x + k * 2, y, x + k * 2 + rng.float(-3, 3), y - h, hex('#3a6b2a'), 0.9);
      r.ellipse(x + k * 2 + rng.float(-1, 1), y - h, 1.2, 3, hex('#6b4a2a'));
    }
  }
  for (let i = 0; i < 6; i++) {
    const a = rng.float(Math.PI, Math.PI * 1.6);
    const d = rng.float(20, 60);
    const x = POND.cx + Math.cos(a) * d;
    const y = POND.cy + Math.sin(a) * d * 0.5;
    for (let yy = -4; yy <= 4; yy++) {
      for (let xx = -7; xx <= 7; xx++) {
        const rr = Math.hypot(xx / 7, yy / 4) + (fbm(xx + i * 9, yy, 2, 14) - 0.5) * 0.5;
        if (rr < 1 && !(xx > 2 && Math.abs(yy) < 1.5))
          r.set(x + xx, y + yy, mix(hex('#2f7a33'), hex('#7cc85a'), fbm(xx / 3, yy / 3, 2, 15)));
      }
    }
    if (i % 2 === 0) r.set(x - 2, y - 2, hex('#ff8ab0'));
  }
}

// ---------------------------------------------------------------- trees that grow

interface Branch {
  x: number;
  y: number;
  angle: number;
  len: number;
  width: number;
  depth: number;
}

function stamp(r: Raster, x: number, y: number, w: number, c: RGB, a = 1): void {
  for (let dy = -w; dy <= w; dy++) {
    for (let dx = -w; dx <= w; dx++) {
      if (dx * dx + dy * dy <= w * w + 0.5) r.set(x + dx, y + dy, c, a);
    }
  }
}

/** A tree from recursive branching, then a canopy of leaf clouds hung on the twigs. */
function tree(r: Raster, rng: Rng, x: number, base: number, size: number, tones = LEAF): void {
  const tips: Array<[number, number, number]> = [];
  const twigs: Array<[number, number, number, number]> = [];
  const queue: Branch[] = [
    {
      x,
      y: base,
      angle: -Math.PI / 2 + rng.float(-0.08, 0.08),
      len: 38 * size,
      width: 5.2 * size,
      depth: 0,
    },
  ];
  // Shadow on the grass first.
  for (let yy = -8; yy <= 8; yy++) {
    for (let xx = -36 * size; xx <= 50 * size; xx++) {
      const rr = Math.hypot(xx / (40 * size), yy / 8) + (fbm(xx / 10, yy / 4, 2, 21) - 0.5) * 0.6;
      if (rr < 1) r.set(x + 10 * size + xx, base + 1 + yy, hex('#24481f'), 0.45);
    }
  }
  while (queue.length > 0) {
    const b = queue.shift()!;
    const segs = 6;
    let cx = b.x;
    let cy = b.y;
    let ang = b.angle;
    for (let i = 0; i < segs; i++) {
      ang += rng.float(-0.12, 0.12) + (fbm(cx / 20, cy / 20, 2, 22) - 0.5) * 0.25;
      const nx = cx + Math.cos(ang) * (b.len / segs);
      const ny = cy + Math.sin(ang) * (b.len / segs);
      const w = Math.max(0.6, b.width * (1 - (i / segs) * 0.35));
      const n = Math.ceil(Math.hypot(nx - cx, ny - cy));
      for (let k = 0; k <= n; k++) {
        const px = cx + ((nx - cx) * k) / n;
        const py = cy + ((ny - cy) * k) / n;
        const bark = ridged(px / 6, py / 6, 3, 23);
        const lit = Math.cos(ang + Math.PI / 2) * 0.5 + 0.5;
        const c = mix(mix(hex('#3b2414'), hex('#7a4f2d'), bark), hex('#9a6a3c'), lit * 0.35);
        stamp(r, px, py, w, c);
        if (w > 1.5) r.set(px - w * 0.6, py, shade(c, 0.7), 0.6);
      }
      cx = nx;
      cy = ny;
    }
    if (b.depth >= 5 || b.width < 0.8) {
      tips.push([cx, cy, b.depth]);
      continue;
    }
    twigs.push([cx, cy, b.width, b.depth]);
    const kids = b.depth < 2 ? 2 + (rng.chance(0.5) ? 1 : 0) : 2;
    for (let k = 0; k < kids; k++) {
      const spread = 0.35 + rng.float(0, 0.45);
      const dir = kids === 2 ? (k === 0 ? -spread : spread) : (k - 1) * spread;
      queue.push({
        x: cx,
        y: cy,
        angle: ang + dir + rng.float(-0.1, 0.1),
        len: b.len * rng.float(0.62, 0.8),
        width: b.width * rng.float(0.55, 0.72),
        depth: b.depth + 1,
      });
    }
  }
  // Canopy: a cloud of leaf dabs around every tip and twig end, shaped by a noise field.
  const cloud = [
    ...tips.map(([tx, ty]) => [tx, ty, 16 * size] as const),
    ...twigs.filter((t) => t[3] >= 3).map(([tx, ty]) => [tx, ty, 11 * size] as const),
  ];
  const minY = Math.min(...cloud.map((c) => c[1]));
  const maxY = Math.max(...cloud.map((c) => c[1]));
  for (const [cx, cy, rad] of cloud) {
    const dabs = Math.round(rad * rad * 0.9);
    for (let i = 0; i < dabs; i++) {
      const a = rng.float(0, Math.PI * 2);
      const d = Math.sqrt(rng.float(0, 1)) * rad;
      const px = cx + Math.cos(a) * d;
      const py = cy + Math.sin(a) * d * 0.9;
      // The cloud's outline is eaten by noise, so the silhouette is ragged.
      if (fbm(px / 9, py / 9, 3, 24) < 0.42 + (d / rad) * 0.25) continue;
      const height = 1 - (py - minY) / Math.max(1, maxY - minY);
      const lightness = clamp01(
        0.25 +
          height * 0.55 +
          (fbm(px / 5, py / 5, 2, 25) - 0.5) * 0.9 -
          (Math.cos(a) * d) / (rad * 4),
      );
      const k = Math.min(tones.length - 1, Math.floor(lightness * tones.length));
      r.ellipse(px, py, 1.4 + rng.float(0, 0.8), 1.1, tones[k]!, 0.9);
    }
  }
}

/** A bush: a low leaf cloud cut by noise, berries in the light. */
function bush(r: Raster, rng: Rng, x: number, base: number, s = 1): void {
  for (let yy = -5; yy <= 5; yy++) {
    for (let xx = -24 * s; xx <= 28 * s; xx++) {
      const rr = Math.hypot(xx / (24 * s), yy / 5) + (fbm(xx / 8, yy / 3, 2, 26) - 0.5) * 0.5;
      if (rr < 1) r.set(x + 2 + xx, base + 1 + yy, hex('#24481f'), 0.45);
    }
  }
  for (let i = 0; i < 1400 * s; i++) {
    const a = rng.float(0, Math.PI * 2);
    const d = Math.sqrt(rng.float(0, 1)) * 22 * s;
    const px = x + Math.cos(a) * d;
    const py = base - 11 * s + Math.sin(a) * d * 0.6;
    if (fbm(px / 8, py / 8, 3, 27) < 0.38 + (d / (22 * s)) * 0.3) continue;
    const lightness = clamp01(
      0.35 -
        (Math.sin(a) * d) / (30 * s) -
        (Math.cos(a) * d) / (60 * s) +
        (fbm(px / 4, py / 4, 2, 28) - 0.5) * 0.8,
    );
    const k = Math.min(LEAF.length - 1, Math.floor(lightness * LEAF.length));
    r.ellipse(px, py, 1.3 + rng.float(0, 0.6), 1, LEAF[k]!, 0.9);
  }
  for (let i = 0; i < 6; i++) {
    const px = x + rng.float(-16, 16) * s;
    const py = base - 12 * s + rng.float(-8, 4) * s;
    r.disc(px, py, 1.5, hex('#e04a6a'));
    r.set(px - 1, py - 1, hex('#ff9ab8'));
  }
}

/** Rocks: blobs whose radius is displaced by ridged noise, shaded by a normal guess. */
function rock(r: Raster, x: number, y: number, rx: number, ry: number, salt: number): void {
  for (let yy = -ry - 4; yy <= ry + 4; yy++) {
    for (let xx = -rx - 4; xx <= rx + 4; xx++) {
      const a = Math.atan2(yy / ry, xx / rx);
      const disp = (fbm(Math.cos(a) * 2 + salt, Math.sin(a) * 2, 3, salt) - 0.5) * 0.6;
      const rr = Math.hypot(xx / rx, yy / ry) - disp;
      if (rr > 1.12) continue;
      if (rr > 1) {
        r.set(x + xx, y + yy + 3, hex('#24481f'), 0.4);
        continue;
      }
      const crease = ridged(xx / 5 + salt, yy / 5, 3, salt + 1);
      const lit = clamp01(0.6 - (xx / rx) * 0.3 - (yy / ry) * 0.45);
      let c = mix(hex('#4a4a56'), hex('#9c9ca8'), lit);
      c = mix(c, hex('#2e2e38'), crease * 0.45);
      if (fbm(xx / 4, yy / 4, 2, salt + 2) > 0.62 && yy > 0) c = mix(c, hex('#5f8a3a'), 0.5);
      r.set(x + xx, y + yy, c);
    }
  }
}

// ---------------------------------------------------------------- the cottage, hand-built

const HOUSE = { x: 190, y: 72, w: 120, h: 116, roofH: 46 };
const LANTERN = { x: HOUSE.x - 30, y: HOUSE.y + HOUSE.h - 4 };

function cottage(r: Raster, rng: Rng): void {
  const h = HOUSE;
  // Shadow and a stone footing with individual stones.
  for (let yy = -6; yy <= 10; yy++) {
    for (let xx = -22; xx <= h.w + 30; xx++) {
      const rr =
        Math.hypot((xx - h.w / 2 - 6) / (h.w / 2 + 26), yy / 9) +
        (fbm(xx / 10, yy / 4, 2, 31) - 0.5) * 0.5;
      if (rr < 1) r.set(h.x + xx, h.y + h.h + 3 + yy, hex('#24481f'), 0.45);
    }
  }
  // Plaster walls: a warped texture, darker toward the ground, a crack or two.
  const wallTop = h.y + h.roofH;
  for (let y = wallTop; y < h.y + h.h; y++) {
    for (let x = h.x; x < h.x + h.w; x++) {
      const t = (y - wallTop) / (h.h - h.roofH);
      const n = warped(x / 16, y / 16, 0.7, 32);
      let c = mix(hex('#f1dfb9'), hex('#c6a877'), t * 0.6 + n * 0.5);
      if (x > h.x + h.w - 14) c = shade(c, 0.72 + ((x - (h.x + h.w - 14)) / 14) * 0.1);
      if (y < wallTop + 7) c = shade(c, 0.7 + (y - wallTop) * 0.04);
      const crack = ridged(x / 3, y / 3, 2, 33);
      if (crack > 0.9 && n > 0.55) c = shade(c, 0.7);
      r.set(x, y, c);
    }
  }
  // Timbers that are not quite straight.
  const timber = (x0: number, y0: number, x1: number, y1: number, w: number) => {
    const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const px = x0 + (x1 - x0) * t + (vnoise(t * 6, y0, 34) - 0.5) * 2;
      const py = y0 + (y1 - y0) * t;
      const g = ridged(px / 4, py / 4, 2, 35);
      stamp(r, px, py, w, mix(hex('#4a2e18'), hex('#8a5a32'), g * 0.7));
    }
  };
  timber(h.x + 2, wallTop, h.x + 2, h.y + h.h, 1.4);
  timber(h.x + h.w - 3, wallTop, h.x + h.w - 3, h.y + h.h, 1.4);
  timber(h.x + h.w / 3, wallTop, h.x + h.w / 3 - 2, h.y + h.h, 1.2);
  timber(h.x + (2 * h.w) / 3, wallTop, h.x + (2 * h.w) / 3 + 2, h.y + h.h, 1.2);
  timber(h.x, wallTop + 2, h.x + h.w, wallTop + 1, 1.3);
  timber(h.x + 6, h.y + h.h - 10, h.x + h.w / 3 - 4, wallTop + 10, 1);
  timber(h.x + h.w - 8, h.y + h.h - 10, h.x + (2 * h.w) / 3 + 6, wallTop + 10, 1);
  // Stone footing.
  for (let x = h.x - 2; x < h.x + h.w + 2; x += 1) {
    for (let y = h.y + h.h - 9; y < h.y + h.h + 2; y++) {
      const cell = Math.floor((x + (Math.floor(y / 5) % 2) * 4) / 9) + Math.floor(y / 5) * 97;
      const edge = Math.abs(((x + (Math.floor(y / 5) % 2) * 4) % 9) - 4.5) > 3.6 || y % 5 === 0;
      const tone = hash(cell, 1, 36);
      let c = mix(hex('#6f6f7a'), hex('#b4b4bf'), tone);
      if (edge) c = hex('#45454f');
      if (fbm(x / 5, y / 5, 2, 37) > 0.6 && !edge) c = mix(c, hex('#5f8a3a'), 0.35);
      r.set(x, y, c);
    }
  }
  // The roof: stepped thatch courses, a woven ridge, an eave shadow on the wall.
  roofThatch(
    r,
    rng,
    {
      x0: h.x - 22,
      x1: h.x + h.w + 22,
      eaveY: wallTop + 6,
      rx0: h.x + h.w / 2 - 14,
      rx1: h.x + h.w / 2 + 14,
      ridgeY: h.y + 2,
    },
    38,
  );
  eaveShadow(r, h.x, wallTop + 8, h.w, 10);
  // Chimney of stacked stones with a cap.
  for (let y = h.y - 14; y < h.y + 14; y++) {
    for (let x = h.x + h.w - 36; x < h.x + h.w - 22; x++) {
      const cell = Math.floor(x / 5) + Math.floor(y / 4) * 31;
      const edge = x % 5 === 0 || y % 4 === 0;
      r.set(x, y, edge ? hex('#3e3e48') : mix(hex('#6f6f7a'), hex('#a8a8b2'), hash(cell, 2, 45)));
    }
  }
  r.rect(h.x + h.w - 38, h.y - 16, 18, 3, hex('#45454f'));
  // The door, planks with grain, a stone step.
  const dx = h.x + h.w / 2 - 12;
  const dy = h.y + h.h - 36;
  for (let y = dy; y < dy + 36; y++) {
    for (let x = dx; x < dx + 24; x++) {
      const top = y - dy;
      const arch = Math.hypot((x - dx - 12) / 12, (top - 8) / 8);
      if (top < 8 && arch > 1) continue;
      const plank = Math.floor((x - dx) / 6);
      const grain = ridged((x + plank * 13) / 2, y / 9, 2, 46);
      let c = mix(hex('#4a2e18'), hex('#8a5a32'), grain * 0.7 + hash(plank, 3, 47) * 0.3);
      if ((x - dx) % 6 === 0) c = shade(c, 0.6);
      r.set(x, y, c);
    }
  }
  r.disc(dx + 19, dy + 19, 1.6, hex('#f3d088'));
  for (let y = 0; y < 4; y++)
    r.rect(dx - 4 - y, dy + 36 + y, 32 + y * 2, 1, mix(hex('#9a9aa6'), hex('#5f5f6a'), y / 3));
  // Windows: slightly uneven frames, wavy old glass, sills with flowers.
  for (const wx of [h.x + 14, h.x + h.w - 38]) {
    const wy = wallTop + 16;
    for (let y = -2; y < 26; y++) {
      for (let x = -2; x < 26; x++) {
        const frame =
          x < 0 ||
          y < 0 ||
          x >= 24 ||
          y >= 22 ||
          Math.abs(x - 11.5) < 1.2 ||
          Math.abs(y - 10.5) < 1.1;
        if (frame) {
          r.set(wx + x, wy + y, mix(hex('#4a3018'), hex('#7a5230'), ridged(x / 3, y / 3, 2, 48)));
        } else {
          const wave = vnoise(x / 5 + wx, y / 3, 49);
          r.set(wx + x, wy + y, mix(hex('#7fb0e0'), hex('#d4ecff'), wave));
        }
      }
    }
    r.rect(wx - 4, wy + 24, 32, 4, hex('#5e3a1f'));
    for (let i = 0; i < 14; i++) {
      const fx = wx - 2 + i * 2.2 + rng.float(-0.5, 0.5);
      r.disc(
        fx,
        wy + 22 + rng.float(-1.5, 1),
        1.3 + rng.float(0, 0.6),
        [hex('#ff7a9a'), hex('#ffd84a'), hex('#ff9ab8'), hex('#c9a0ff')][i % 4]!,
        0.9,
      );
      r.set(fx, wy + 24, hex('#2f6f32'), 0.7);
    }
  }
  // Lantern post, grown a little crooked.
  for (let i = 0; i < 32; i++) {
    const t = i / 32;
    stamp(r, LANTERN.x + (vnoise(t * 3, 9, 50) - 0.5) * 2, LANTERN.y - i, 1.2, hex('#2a2030'));
  }
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
}

function fence(r: Raster, rng: Rng, x0: number, y: number, n: number): void {
  const posts: number[] = [];
  for (let i = 0; i < n; i++) posts.push(x0 + i * 15 + rng.float(-2, 2));
  for (const x of posts) {
    const lean = rng.float(-1.5, 1.5);
    for (let i = 0; i < 22; i++) {
      const g = ridged(x / 3, (y - i) / 5, 2, 51);
      stamp(
        r,
        x + (lean * i) / 22,
        y - i,
        2,
        mix(hex('#6a4525'), hex('#d9a76a'), g * 0.8 - i / 60),
      );
    }
    r.ellipse(x + 3, y + 1, 4, 1.5, hex('#24481f'), 0.4);
  }
  for (const ry of [y - 15, y - 7]) {
    for (let x = x0 - 2; x < x0 + n * 15 - 8; x++) {
      const sag = Math.sin(((x - x0) / 15) * Math.PI) * 1.2;
      const g = ridged(x / 5, ry / 2, 2, 52);
      r.set(x, ry + sag, mix(hex('#8a5a32'), hex('#e0b070'), g));
      r.set(x, ry + sag + 1, mix(hex('#6a4525'), hex('#b4884a'), g));
      r.set(x, ry + sag + 2, hex('#5a3a1f'), 0.8);
    }
  }
}

function well(r: Raster, x: number, y: number): void {
  for (let yy = -4; yy <= 6; yy++) {
    for (let xx = -20; xx <= 26; xx++) {
      const rr = Math.hypot((xx - 3) / 22, yy / 5) + (fbm(xx / 8, yy / 3, 2, 53) - 0.5) * 0.5;
      if (rr < 1) r.set(x + xx, y + 3 + yy, hex('#24481f'), 0.45);
    }
  }
  for (let yy = -14; yy <= 4; yy++) {
    for (let xx = -17; xx <= 17; xx++) {
      const a = Math.atan2(yy / 7, xx / 16);
      const disp = (fbm(Math.cos(a) * 2 + 3, Math.sin(a) * 2, 2, 54) - 0.5) * 0.3;
      const rr = Math.hypot(xx / 16, (yy + 4) / 7) - disp;
      if (rr > 1) continue;
      const inner = Math.hypot(xx / 10, (yy + 6) / 4);
      if (inner < 1) {
        r.set(x + xx, y + yy, mix(hex('#121a30'), hex('#2b3f6a'), fbm(xx / 4, yy / 4, 2, 55)));
        continue;
      }
      const cell = Math.floor((xx + 40) / 6) + Math.floor((yy + 20) / 4) * 13;
      const edge = ridged(xx / 3, yy / 3, 2, 56) > 0.8;
      let c = mix(hex('#6f6f7a'), hex('#b4b4bf'), hash(cell, 4, 57));
      if (edge) c = hex('#45454f');
      if (yy > 0) c = shade(c, 0.75);
      r.set(x + xx, y + yy, c);
    }
  }
  for (const px of [x - 12, x + 10]) {
    for (let i = 0; i < 28; i++)
      stamp(
        r,
        px + (vnoise(i / 9, px, 58) - 0.5) * 1.5,
        y - 8 - i,
        1.4,
        mix(hex('#4a2e18'), hex('#8a5a32'), ridged(px, i / 3, 2, 59)),
      );
  }
  for (let y2 = y - 42; y2 < y - 28; y2++) {
    const half = 4 + ((y2 - (y - 42)) / 14) * 16;
    for (let x2 = x - half; x2 <= x + half; x2++) {
      const g = fbm(x2 / 3, y2 / 2, 2, 60);
      r.set(
        x2,
        y2 + (vnoise(x2 / 6, 7, 61) - 0.5) * 2,
        mix(hex('#8a3a2a'), hex('#d9674f'), g * (x2 < x ? 1 : 0.6)),
      );
    }
  }
  r.rect(x - 1, y - 30, 2, 14, hex('#4a3018'));
  r.rect(x - 4, y - 18, 8, 6, hex('#8a5a32'));
}

function keeper(r: Raster, x: number, base: number): void {
  r.ellipse(x, base + 1, 7, 2.5, hex('#24481f'), 0.5);
  r.rect(x - 3, base - 8, 6, 8, hex('#3a6ea8'));
  r.rect(x - 4, base - 18, 8, 10, hex('#e8a05a'));
  r.rect(x - 4, base - 18, 8, 3, hex('#f0c46e'));
  r.ellipse(x, base - 22, 5, 5, hex('#f6d2b0'));
  r.ellipse(x, base - 26, 7, 3, hex('#d9a85a'));
  r.rect(x - 2, base - 25, 4, 3, hex('#d9a85a'));
}

function nubbin(r: Raster, x: number, base: number): void {
  r.ellipse(x, base + 1, 6, 2, hex('#24481f'), 0.5);
  r.ellipse(x, base - 6, 6, 6, hex('#7fc8f0'));
  r.ellipse(x - 2, base - 8, 2.5, 2, hex('#b8e4ff'));
  r.ellipse(x, base - 11, 4, 2.5, hex('#f2d34c'));
  r.set(x - 2, base - 6, hex('#1b1326'));
  r.set(x + 2, base - 6, hex('#1b1326'));
  r.disc(x, base - 17, 1.8, hex('#f2d34c'));
}

// ---------------------------------------------------------------- scene, light, frame

function albedo(): Raster {
  const r = new Raster(W, H, hex('#5f9e3c'));
  const rng = new Rng(77);
  ground(r);
  // A far treeline with a fractal silhouette.
  for (let x = 0; x < W; x++) {
    const top = 22 + fbm(x / 40, 0, 4, 70) * 34;
    for (let y = 0; y < top; y++) {
      const t = y / top;
      r.set(
        x,
        y,
        mix(hex('#2a4d2b'), hex('#3d6b36'), t + (fbm(x / 9, y / 9, 3, 71) - 0.5) * 0.4),
        0.9,
      );
    }
  }
  path(r);
  pond(r);
  // Everything from here is an object: tracked for the boundary rim, drawn back to front.
  r.tracking = true;
  rock(r, 430, 150, 14, 8, 80);
  rock(r, 455, 158, 8, 5, 81);
  rock(r, 150, 240, 9, 5, 82);
  tree(
    r,
    rng,
    470,
    118,
    0.6,
    LEAF.map((c) => shade(c, 0.8)),
  );
  tree(
    r,
    rng,
    535,
    150,
    0.68,
    LEAF.map((c) => shade(c, 0.85)),
  );
  fence(r, rng, 330, 118, 9);
  cottage(r, rng);
  well(r, 400, 206);
  tree(r, rng, 64, 232, 1.05);
  bush(r, rng, 352, 192, 0.9);
  bush(r, rng, 122, 304, 1);
  bush(r, rng, 300, 252, 0.7);
  keeper(r, 150, 262);
  nubbin(r, 172, 268);
  r.tracking = false;
  rimObjects(r);
  return r;
}

function lightPass(a: Raster): Raster {
  const r = new Raster(W, H, [0, 0, 0]);
  const light = new Raster(W, H, [0.34, 0.38, 0.6]);
  const shadow: RGB = [0.14, 0.16, 0.32];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const k = Math.max(0, 1 - x / (W * 1.1)) * 0.6 * (0.5 + 0.5 * (1 - y / H));
      light.set(x, y, [0.98, 0.62, 0.36], k);
    }
  }
  const h = HOUSE;
  // The house shadow: the roof silhouette thrown to the right, its edge eaten by noise.
  for (let yy = -20; yy <= h.h - 30; yy++) {
    for (let xx = 0; xx <= 100; xx++) {
      const roofLine = 44 - (xx / 100) * 60;
      const inside =
        yy > roofLine + (fbm(xx / 9, yy / 9, 3, 91) - 0.5) * 16 &&
        xx < 96 + (fbm(xx / 7, yy / 7, 2, 92) - 0.5) * 14;
      if (inside) light.set(h.x + h.w + xx, h.y + yy + 12, shadow, 0.8);
    }
  }
  for (let yy = -14; yy <= 14; yy++) {
    for (let xx = 0; xx <= 150; xx++) {
      const rr = Math.hypot((xx - 75) / 75, yy / 14) + (fbm(xx / 12, yy / 5, 2, 90) - 0.5) * 0.6;
      if (rr < 1) light.set(64 + 40 + xx, 232 + 4 + yy, shadow, 0.8);
    }
  }
  light.ellipse(400 + 30, 208, 30, 7, shadow, 0.7);
  for (let i = 0; i < 9; i++) {
    for (let yy = 0; yy < 22; yy++) {
      const sway = (vnoise(yy / 6, i, 93) - 0.5) * 6;
      light.rect(330 + i * 15 + 4 + sway + yy * 0.3, 98 + yy, 7, 1, shadow, 0.45);
    }
  }
  light.ellipse(352 + 28, 193, 26, 6, shadow, 0.7);
  light.ellipse(122 + 30, 305, 30, 7, shadow, 0.7);
  light.ellipse(300 + 20, 253, 20, 5, shadow, 0.7);
  light.ellipse(470 + 50, 120, 46, 8, shadow, 0.6);
  light.ellipse(535 + 50, 152, 50, 9, shadow, 0.6);
  light.ellipse(162, 263, 12, 3, shadow, 0.6);
  light.ellipse(181, 269, 9, 2.5, shadow, 0.6);
  const points: Array<[number, number, number, RGB]> = [
    [h.x + 26, h.y + h.roofH + 27, 86, [1, 0.72, 0.35]],
    [h.x + h.w - 26, h.y + h.roofH + 27, 86, [1, 0.72, 0.35]],
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
  for (const wx of [h.x + 14, h.x + h.w - 38]) {
    const wy = h.y + h.roofH + 16;
    for (let y = 0; y < 22; y++) {
      for (let x = 0; x < 24; x++) {
        if (Math.abs(x - 11.5) < 1.2 || Math.abs(y - 10.5) < 1.1) continue;
        r.set(
          wx + x,
          wy + y,
          mix(hex('#fff1b8'), hex('#ffb04a'), y / 22 + (vnoise(x / 5 + wx, y / 3, 49) - 0.5) * 0.3),
        );
      }
    }
  }
  r.rect(LANTERN.x - 4, LANTERN.y - 37, 9, 8, hex('#fff1b8'));
  for (const [fx, fy] of flies) {
    r.set(fx, fy, hex('#f6ffb0'));
    r.set(fx + 1, fy, hex('#d8f080'), 0.6);
  }
  // Water at dusk, with the lights smeared down it.
  for (let y = POND.cy - 130; y < H; y++) {
    for (let x = POND.cx - 170; x < W; x++) {
      const dx = x - POND.cx;
      const dy = (y - POND.cy) / 0.5;
      const d = Math.hypot(dx, dy);
      if (d > pondRadius(Math.atan2(dy, dx))) continue;
      const t2 = clamp01((y - (POND.cy - 60)) / 120);
      r.set(x, y, mix(hex('#6a4a8a'), hex('#101a3a'), t2), 0.8);
      if (fbm(x / 16 + y / 60, y / 5, 3, 12) > 0.66) r.set(x, y, hex('#a98ac8'), 0.4);
      for (const [lx, , , col] of points.slice(0, 3)) {
        if (Math.abs(x - lx) > 8) continue;
        const wob = hash(0, y, 3) < 0.5 ? 1 : -1;
        r.set(x + wob, y, col, 0.35 * (1 - t2) * (1 - Math.abs(x - lx) / 9));
      }
    }
  }
  for (let y = 0; y < 80; y++) {
    const al = (1 - y / 80) * 0.7;
    for (let x = 0; x < W; x++) r.set(x, y, mix(hex('#ff9a5a'), hex('#4a2f6b'), y / 80), al);
  }
  return r;
}

function frame(r: Raster, dusk: boolean): void {
  for (let i = 0; i < 7; i++) {
    const x0 = -120 + i * 95;
    for (let y = 0; y < H; y++) {
      for (let k = 0; k < 26; k++) {
        const x = x0 + y * 0.55 + k;
        const a = (dusk ? 0.09 : 0.11) * (1 - Math.abs(k - 13) / 13) * (1 - y / H);
        r.set(x, y, dusk ? hex('#ffc890') : hex('#fff2c0'), a);
      }
    }
  }
  boxBlur(r, 6, (y) => {
    const d = Math.abs(y - H * 0.52) / (H * 0.52);
    return Math.max(0, (d - 0.38) / 0.62);
  });
  bloom(r, dusk ? 0.5 : 0.64, 5, dusk ? 0.7 : 0.5);
  grade(r, dusk ? hex('#8a90c8') : hex('#a0b8d8'), dusk ? hex('#ffe8c8') : hex('#fff2d8'));
  vignette(r, dusk ? 0.8 : 0.85);
}

it.skipIf(!process.env.PREVIEW_FRACTAL)('writes the organic samples', () => {
  const dir = process.env.PREVIEW_FRACTAL!;
  mkdirSync(dir, { recursive: true });
  const day = albedo();
  const dusk = lightPass(day);
  frame(dusk, true);
  const o = dusk.toRgba(2);
  writeFileSync(join(dir, 'fractal-dusk.png'), encodePng(o.width, o.height, o.rgba));
  frame(day, false);
  const d = day.toRgba(2);
  writeFileSync(join(dir, 'fractal-day.png'), encodePng(d.width, d.height, d.rgba));
  expect(o.width).toBe(W * 2);
});
