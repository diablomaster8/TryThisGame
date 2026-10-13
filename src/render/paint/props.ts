import { Rng } from '../../sim/rng';
import { groundShadow, stamp } from './buildings';
import { fbm, ridged, vnoise } from './noise';
import { hex, mix, Raster, shade, type RGB } from './raster';

/**
 * Painted props: trees that grow by recursive branching with noise-cut canopies,
 * bushes, rocks, logs, fence posts, lantern posts and the well. Each paints into a
 * raster whose mask becomes the sprite's alpha.
 */
export const LEAF: RGB[] = [
  '#1b4322',
  '#27602c',
  '#357f36',
  '#4a9c42',
  '#68b94f',
  '#8fd262',
  '#b9e884',
].map(hex);

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

interface Branch {
  x: number;
  y: number;
  angle: number;
  len: number;
  width: number;
  depth: number;
}

/** A tree: branches from the seed, then leaf clouds hung on the twigs. `size` scales everything. */
export function tree(
  r: Raster,
  rng: Rng,
  x: number,
  base: number,
  size: number,
  tones = LEAF,
): void {
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

export function bush(r: Raster, rng: Rng, x: number, base: number, s = 1, tones = LEAF): void {
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
    const k = Math.min(tones.length - 1, Math.floor(lightness * tones.length));
    r.ellipse(px, py, 1.3 + rng.float(0, 0.6), 1, tones[k]!, 0.9);
  }
  for (let i = 0; i < 6; i++) {
    const px = x + rng.float(-16, 16) * s;
    const py = base - 12 * s + rng.float(-8, 4) * s;
    r.disc(px, py, 1.5, hex('#e04a6a'));
    r.set(px - 1, py - 1, hex('#ff9ab8'));
  }
}

/** A rock: a blob displaced by ridged noise, shaded by a guessed normal, mossy below. */
export function rock(r: Raster, x: number, y: number, rx: number, ry: number, salt: number): void {
  for (let yy = -ry - 4; yy <= ry + 4; yy++) {
    for (let xx = -rx - 4; xx <= rx + 4; xx++) {
      const a = Math.atan2(yy / ry, xx / rx);
      const disp = (fbm(Math.cos(a) * 2 + salt, Math.sin(a) * 2, 3, salt) - 0.5) * 0.6;
      const rr = Math.hypot(xx / rx, yy / ry) - disp;
      if (rr > 1) continue;
      const crease = ridged(xx / 5 + salt, yy / 5, 3, salt + 1);
      const lit = clamp01(0.6 - (xx / rx) * 0.3 - (yy / ry) * 0.45);
      let c = mix(hex('#4a4a56'), hex('#9c9ca8'), lit);
      c = mix(c, hex('#2e2e38'), crease * 0.45);
      if (fbm(xx / 4, yy / 4, 2, salt + 2) > 0.62 && yy > 0) c = mix(c, hex('#5f8a3a'), 0.5);
      r.set(x + xx, y + yy, c);
    }
  }
}

/** A fallen log with bark grain and a cut end. */
export function log(r: Raster, x: number, y: number, len: number, salt: number): void {
  const rad = 6;
  for (let yy = -rad; yy <= rad; yy++) {
    for (let xx = 0; xx <= len; xx++) {
      const bend = Math.sin((xx / len) * Math.PI) * 1.5;
      const edge = Math.abs(yy - bend) / rad;
      if (edge > 1 + (vnoise(xx / 6, 0, salt) - 0.5) * 0.2) continue;
      const g = ridged(xx / 5, yy / 2, 2, salt + 1);
      let c = mix(hex('#4a2e18'), hex('#8a5a32'), g);
      c = shade(c, 0.7 + (1 - edge) * 0.4);
      if (fbm(xx / 5, yy / 3, 2, salt + 2) > 0.68 && yy > 0) c = mix(c, hex('#5f8a3a'), 0.5);
      r.set(x + xx, y + yy, c);
    }
  }
  for (let yy = -rad + 1; yy <= rad - 1; yy++) {
    for (let xx = 0; xx <= 4; xx++) {
      const d = Math.hypot(xx / 4, yy / (rad - 1));
      if (d > 1) continue;
      r.set(
        x + len + xx,
        y + yy,
        mix(hex('#d9a76a'), hex('#8a5a32'), Math.abs(Math.sin(d * 9)) * 0.5),
      );
    }
  }
}

export function fencePost(r: Raster, rng: Rng, x: number, base: number): void {
  const lean = rng.float(-1.5, 1.5);
  for (let i = 0; i < 22; i++) {
    const g = ridged(x / 3, (base - i) / 5, 2, 51);
    stamp(
      r,
      x + (lean * i) / 22,
      base - i,
      2,
      mix(hex('#6a4525'), hex('#d9a76a'), g * 0.8 - i / 60),
    );
  }
  // A short rail stub each side, so posts in a row read as a fence.
  for (const ry of [base - 15, base - 7]) {
    for (let xx = -7; xx <= 7; xx++) {
      const g = ridged((x + xx) / 5, ry / 2, 2, 52);
      r.set(x + xx, ry, mix(hex('#8a5a32'), hex('#e0b070'), g));
      r.set(x + xx, ry + 1, mix(hex('#6a4525'), hex('#b4884a'), g));
    }
  }
}

export function lanternPost(r: Raster, x: number, base: number, lit: boolean): void {
  for (let i = 0; i < 32; i++) {
    const t = i / 32;
    stamp(r, x + (vnoise(t * 3, 9, 50) - 0.5) * 2, base - i, 1.2, hex('#2a2030'));
  }
  r.rect(x - 5, base - 38, 11, 10, hex('#3a2a30'));
  r.rect(x - 4, base - 37, 9, 8, lit ? hex('#fff1b8') : hex('#bfe0ff'));
  r.tri(x - 7, base - 38, x + 8, base - 38, x + 0.5, base - 44, hex('#2a2030'));
}

export function well(r: Raster, x: number, y: number): void {
  groundShadow(r, x + 3, y + 3, 22, 5, 53);
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
      let c = mix(hex('#6f6f7a'), hex('#b4b4bf'), vnoise(cell, 4, 57));
      if (edge) c = hex('#45454f');
      if (yy > 0) c = shade(c, 0.75);
      r.set(x + xx, y + yy, c);
    }
  }
  for (const px of [x - 12, x + 10]) {
    for (let i = 0; i < 28; i++) {
      stamp(
        r,
        px + (vnoise(i / 9, px, 58) - 0.5) * 1.5,
        y - 8 - i,
        1.4,
        mix(hex('#4a2e18'), hex('#8a5a32'), ridged(px, i / 3, 2, 59)),
      );
    }
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
