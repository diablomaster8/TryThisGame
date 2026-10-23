import { CanvasTexture, NearestFilter, SRGBColorSpace } from 'three';
import { CG4_E4 } from '../config/tuning-e4';
import { hex, hash, mix, Raster, type RGB } from './paint/raster';
import type { Season } from './e4-shared';

/**
 * The pixel painters for package e4 (campaign graphics 4): window figures, the crop plot in
 * four seasons, the four lantern heads with their hung tags, the cottage's seasonal decor,
 * rising paper lanterns, birds and moths, the gate's frost, and the pond's dithered streak.
 * Everything is a `Raster` (a coverage mask gives the alpha), so the painters are pure and
 * run in tests; only `streakTexture` needs a DOM canvas.
 */

const INK = hex('#2a2030');
const INK2 = hex('#3a2a30');

function raster(w: number, h: number): Raster {
  const r = new Raster(w, h, null);
  r.tracking = true;
  return r;
}

/** A one-pixel dark rim round whatever is painted (4-neighbour). */
function rim(r: Raster, c: RGB = INK): void {
  const add: Array<[number, number]> = [];
  for (let y = 0; y < r.h; y++)
    for (let x = 0; x < r.w; x++) {
      if (r.mask[y * r.w + x]) continue;
      const near = (dx: number, dy: number) => {
        const xx = x + dx;
        const yy = y + dy;
        return xx >= 0 && yy >= 0 && xx < r.w && yy < r.h && r.mask[yy * r.w + xx] === 1;
      };
      if (near(1, 0) || near(-1, 0) || near(0, 1) || near(0, -1)) add.push([x, y]);
    }
  for (const [x, y] of add) r.set(x, y, c);
}

// ------------------------------------------------------------------------ K18 window figures

const FIG = hex('#3b2416');

/** A lit window with a figure behind the bars: 0 standing, 1 two together, 2 seated. */
export function paintWindowFigure(w: number, h: number, variant: number): Raster {
  const r = raster(w, h);
  r.gradient(0, 0, w, h, hex('#ffe9a8'), hex('#f1a84c'));
  const head = (cx: number, cy: number, rad: number) => r.disc(cx, cy, rad, FIG);
  const body = (cx: number, cy: number, rx: number, ry: number) => r.ellipse(cx, cy, rx, ry, FIG);
  if (variant === 0) {
    head(w * 0.5, h * 0.38, Math.min(w, h) * 0.15);
    body(w * 0.5, h * 0.92, w * 0.28, h * 0.34);
  } else if (variant === 1) {
    head(w * 0.32, h * 0.4, Math.min(w, h) * 0.13);
    body(w * 0.32, h * 0.95, w * 0.2, h * 0.32);
    head(w * 0.7, h * 0.52, Math.min(w, h) * 0.11);
    body(w * 0.7, h * 1.02, w * 0.17, h * 0.28);
  } else {
    head(w * 0.42, h * 0.56, Math.min(w, h) * 0.14);
    body(w * 0.42, h * 1.08, w * 0.26, h * 0.3);
    // A candle on the sill beside them.
    r.rect(Math.round(w * 0.8), Math.round(h * 0.7), 1, 3, hex('#fff6d0'));
    r.set(Math.round(w * 0.8), Math.round(h * 0.7) - 1, hex('#ffffff'));
  }
  const bar = hex('#6a4a2a');
  r.rect(Math.round(w / 2), 0, 1, h, bar);
  r.rect(0, Math.round(h * 0.5), w, 1, bar);
  const frame = hex('#5b3c25');
  r.rect(0, 0, w, 1, frame);
  r.rect(0, h - 1, w, 1, frame);
  r.rect(0, 0, 1, h, frame);
  r.rect(w - 1, 0, 1, h, frame);
  return r;
}

// ------------------------------------------------------------------------ K27 crop plot

export const PLOT_PX = { w: 96, h: 66 };

const SOIL: Record<Season, RGB> = {
  spring: hex('#4a3220'),
  summer: hex('#5d4128'),
  autumn: hex('#7a5a3a'),
  winter: hex('#6b6b72'),
};

/** The plot seen from above: boards, tilled rows, and the season's ground. */
export function paintPlotSoil(season: Season): Raster {
  const { w, h } = PLOT_PX;
  const r = raster(w, h);
  const soil = SOIL[season];
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const row = Math.floor(((y - 6) / (h - 12)) * CG4_E4.plot.rows);
      const inRow = (((y - 6) / (h - 12)) * CG4_E4.plot.rows) % 1;
      const furrow = inRow > 0.78 || inRow < 0.08;
      const n = hash(x, y, 3);
      let c = mix(soil, hex('#000000'), furrow ? 0.28 : 0.04 + n * 0.12);
      if (season === 'winter' && n > 0.8 && row >= 0) c = mix(c, hex('#eef4fb'), 0.8);
      r.set(x, y, c);
    }
  // Seeds pressed into the rows in spring.
  if (season === 'spring')
    for (let i = 0; i < 26; i++) {
      const x = 8 + Math.floor(hash(i, 1, 9) * (w - 16));
      const y = 8 + Math.floor(hash(i, 2, 9) * (h - 16));
      r.set(x, y, hex('#e8d8a8'));
    }
  // Boards round the edge, with a lighter top lip.
  const wood = hex('#8a5a32');
  const lip = hex('#b4884a');
  r.rect(0, 0, w, 4, wood);
  r.rect(0, h - 4, w, 4, wood);
  r.rect(0, 0, 4, h, wood);
  r.rect(w - 4, 0, 4, h, wood);
  r.rect(0, 0, w, 1, lip);
  r.rect(0, 0, 1, h, lip);
  rim(r);
  return r;
}

/** One plant of the plot, upright: sprouts, a leafy clump, a gourd, or dry stalks. */
export function paintCrop(season: Season, seed: number): Raster {
  const r = raster(16, 20);
  const j = (n: number) => Math.floor(hash(seed, n, 5) * 3);
  if (season === 'spring') {
    for (const dx of [-2, 2]) {
      r.rect(8 + dx, 15, 1, 4, hex('#5f9a3a'));
      r.tri(8 + dx, 13, 6 + dx, 15, 8 + dx, 16, hex('#8fcb5e'));
      r.tri(8 + dx, 13, 10 + dx, 15, 8 + dx, 16, hex('#6fb04a'));
    }
  } else if (season === 'summer') {
    r.rect(8, 10, 1, 9, hex('#4f8a32'));
    for (const [cx, cy, rx, ry, c] of [
      [5, 13, 4, 3, '#5f9a3a'],
      [11, 12, 4, 3, '#6fb04a'],
      [8, 8 + j(1), 4, 3, '#8fcb5e'],
      [8, 15, 6, 3, '#4f8a32'],
    ] as const)
      r.ellipse(cx, cy, rx, ry, hex(c));
    r.set(8, 5 + j(2), hex('#ffd94a'));
  } else if (season === 'autumn') {
    r.ellipse(8, 14, 6, 4, hex('#e87a2a'));
    r.ellipse(8, 14, 3, 4, hex('#f3a04a'));
    r.rect(8, 9, 1, 3, hex('#5f6a2a'));
    r.tri(8, 9, 11, 8, 9, 11, hex('#6f8a3a'));
    r.line(3, 15, 13, 15, hex('#b8561a'));
    r.set(12 + j(3) - 1, 8, hex('#d9a02a'));
  } else {
    for (const dx of [-2, 0, 2])
      r.line(8 + dx, 18, 8 + dx + (dx === 0 ? 0 : dx > 0 ? 1 : -1), 10 + j(dx + 4), hex('#7a5a3a'));
    r.set(5, 13, hex('#a88a5a'));
    r.set(11, 12, hex('#a88a5a'));
    r.set(8, 18, hex('#eef4fb'));
  }
  rim(r, hex('#2a2418'));
  return r;
}

// ------------------------------------------------------------------------ K28 lantern heads

export const HEAD_PX = { w: 32, h: 40 };

export type HeadShape = 'round' | 'square' | 'hex' | 'tall';

/** The tag glyphs, one pixel per character: round, square, hexagonal and tall. */
const TAGS: Record<HeadShape, readonly string[]> = {
  round: ['..XXX..', '.XXXXX.', 'XXXXXXX', 'XXXXXXX', 'XXXXXXX', '.XXXXX.', '..XXX..'],
  square: ['XXXXXXX', 'XXXXXXX', 'XXXXXXX', 'XXXXXXX', 'XXXXXXX', 'XXXXXXX', 'XXXXXXX'],
  hex: ['..XXXX..', '.XXXXXX.', 'XXXXXXXX', 'XXXXXXXX', '.XXXXXX.', '..XXXX..'],
  tall: ['XXXXX', 'XXXXX', 'XXXXX', 'XXXXX', 'XXXXX', 'XXXXX', 'XXXXX', 'XXXXX', 'XXXXX', 'XXXXX'],
};

/** Stamp a glyph in the owner's colour with a one-pixel dark rim and a light fleck. */
function stampTag(r: Raster, rows: readonly string[], x: number, y: number, fill: RGB): void {
  rows.forEach((row, j) =>
    [...row].forEach((c, i) => {
      if (c !== 'X') return;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) r.set(x + i + dx, y + j + dy, INK);
    }),
  );
  rows.forEach((row, j) =>
    [...row].forEach((c, i) => {
      if (c === 'X') r.set(x + i, y + j, fill);
    }),
  );
  r.set(x + 1, y + 1, mix(fill, hex('#ffffff'), 0.6));
}
export type HeadLook = 'lit' | 'out' | 'low';

function glassFill(
  r: Raster,
  look: HeadLook,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
): void {
  const cold = hex('#7d869c');
  const warm = hex('#fff1b8');
  for (let y = y0; y <= y1; y++)
    for (let x = x0; x <= x1; x++)
      r.set(
        x,
        y,
        look === 'lit' ? mix(warm, hex('#ffd25a'), ((y - y0) / Math.max(1, y1 - y0)) * 0.5) : cold,
      );
  const cx = Math.round((x0 + x1) / 2);
  const cy = Math.round((y0 + y1) / 2);
  if (look === 'lit') {
    r.rect(cx - 1, cy - 2, 3, 5, hex('#fffbe6'));
    r.rect(cx, cy - 1, 1, 2, hex('#ffd25a'));
  } else if (look === 'low') {
    r.rect(cx, cy, 2, 2, hex('#6fb4ff'));
    r.set(cx, cy, hex('#d8ecff'));
  } else r.rect(cx, cy - 2, 1, 4, hex('#3a3646'));
}

/** A head over the stock lamp (see HEAD_PX: the lamp sprite's col 9, row 2 sit at cell col 16, row 16). */
export function paintHead(shape: HeadShape, look: HeadLook, tag: string): Raster {
  const r = raster(HEAD_PX.w, HEAD_PX.h);
  const cx = 16;
  if (shape === 'round') {
    for (let y = 20; y <= 34; y++)
      for (let x = 8; x <= 24; x++) {
        const d = Math.hypot(x - cx, y - 27);
        if (d <= 7) r.set(x, y, INK2);
      }
    for (let y = 21; y <= 33; y++)
      for (let x = 9; x <= 23; x++)
        if (Math.hypot(x - cx, y - 27) <= 5.8)
          r.set(x, y, look === 'lit' ? hex('#ffe9a0') : hex('#7d869c'));
    glassFill(r, look, 14, 23, 18, 31);
    r.ellipse(cx, 19, 5, 3.2, INK);
    r.disc(cx, 14, 1.4, INK);
    r.rect(9, 20, 15, 3, INK);
    r.rect(9, 20, 15, 1, hex('#4a3a44'));
    r.ellipse(cx, 34, 5, 1.6, INK);
  } else if (shape === 'square') {
    r.rect(9, 23, 14, 11, INK2);
    glassFill(r, look, 11, 24, 21, 32);
    r.rect(9, 23, 2, 11, INK);
    r.rect(21, 23, 2, 11, INK);
    r.rect(8, 20, 17, 3, INK);
    r.rect(8, 20, 17, 1, hex('#4a3a44'));
    for (let y = 16; y < 20; y++) r.rect(cx - 3 - (y - 16), y, 6 + (y - 16) * 2, 1, INK);
    r.rect(14, 14, 4, 2, INK);
    r.rect(10, 34, 12, 2, INK);
  } else if (shape === 'hex') {
    r.rect(9, 23, 14, 11, INK2);
    glassFill(r, look, 12, 24, 20, 32);
    r.rect(9, 23, 3, 11, INK);
    r.rect(20, 23, 3, 11, INK);
    r.rect(12, 24, 1, 9, INK2);
    r.rect(19, 24, 1, 9, INK2);
    r.rect(9, 23, 2, 2, INK);
    r.rect(21, 23, 2, 2, INK);
    r.rect(8, 20, 17, 3, INK);
    r.rect(8, 20, 17, 1, hex('#4a3a44'));
    r.tri(cx, 12, 9, 20, 23, 20, INK);
    r.rect(10, 34, 12, 2, INK);
  } else {
    r.rect(11, 13, 11, 21, INK2);
    glassFill(r, look, 13, 14, 20, 32);
    r.rect(11, 13, 2, 21, INK);
    r.rect(20, 13, 2, 21, INK);
    r.rect(8, 20, 17, 3, INK);
    r.rect(8, 20, 17, 1, hex('#4a3a44'));
    r.tri(cx, 4, 11, 13, 22, 13, INK);
    r.disc(cx, 3, 1.3, INK);
    r.rect(10, 34, 12, 2, INK);
  }
  // The hung tag: a cord from the head's edge to a small tag in the owner's shape.
  const tx = 24;
  const ty = 29;
  r.line(shape === 'tall' ? 22 : 23, 26, tx + 3, ty, INK);
  stampTag(r, TAGS[shape], tx, ty, hex(tag));
  return r;
}

// ------------------------------------------------------------------------ K43 cottage decor

/** A winter wreath of fir with berries and a bow. */
export function paintWreath(): Raster {
  const r = raster(16, 16);
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      const d = Math.hypot(x - 7.5, y - 7.5);
      if (d <= 7.3 && d >= 3.2) r.set(x, y, mix(hex('#2f6a3a'), hex('#5f9a3a'), hash(x, y, 8)));
    }
  const berries: Array<[number, number]> = [
    [3, 5],
    [11, 4],
    [12, 9],
    [4, 11],
    [8, 2],
  ];
  for (const [x, y] of berries) r.rect(x, y, 2, 2, hex('#d63a3a'));
  r.rect(6, 12, 4, 2, hex('#b82a2a'));
  r.tri(6, 13, 3, 15, 4, 11, hex('#b82a2a'));
  r.tri(10, 13, 13, 15, 12, 11, hex('#b82a2a'));
  rim(r, hex('#1f3a24'));
  return r;
}

/** Autumn gourds stacked by the door. */
export function paintGourds(): Raster {
  const r = raster(40, 22);
  r.ellipse(11, 14, 9, 6, hex('#e87a2a'));
  r.ellipse(11, 14, 5, 6, hex('#f3a04a'));
  r.rect(11, 7, 2, 3, hex('#5f6a2a'));
  r.ellipse(26, 17, 6, 4, hex('#e8c03a'));
  r.ellipse(26, 17, 3, 4, hex('#f6dc6a'));
  r.ellipse(34, 16, 5, 5, hex('#5f9a3a'));
  for (const x of [32, 34, 36]) r.rect(x, 12, 1, 8, hex('#3f7a2a'));
  r.rect(34, 9, 1, 3, hex('#5f6a2a'));
  r.line(5, 15, 17, 15, hex('#b8561a'));
  rim(r, hex('#3a2418'));
  return r;
}

/** Spring blossoms spilling over a window box. */
export function paintBlossoms(): Raster {
  const r = raster(30, 12);
  const cols = ['#ff8fb0', '#ffd94a', '#ffffff', '#b89af0', '#ff7a5a'];
  r.rect(1, 8, 28, 3, hex('#4f9a3a'));
  for (let i = 0; i < 11; i++) {
    const x = 2 + Math.floor(hash(i, 4, 6) * 26);
    const y = 2 + Math.floor(hash(i, 5, 6) * 6);
    const c = hex(cols[i % cols.length]!);
    r.rect(x, y, 2, 2, c);
    r.set(x + 1, y + 1, hex('#fff6a0'));
    r.set(x, y + 2, hex('#4f9a3a'));
  }
  return r;
}

// ------------------------------------------------------------------------ K42, K44 sky

/** A small paper lantern: a warm oval with dark caps and a lit core. */
export function paintPaperLantern(color: string): Raster {
  const r = raster(12, 16);
  const c = hex(color);
  r.ellipse(6, 8, 4.4, 5.8, c);
  r.ellipse(6, 8, 2.2, 4, mix(c, hex('#fffbe0'), 0.7));
  r.rect(3, 2, 6, 2, INK);
  r.rect(3, 13, 6, 2, INK);
  r.set(6, 1, INK);
  return r;
}

/** A dithered soft glow, the lantern's halo (drawn at partial opacity). */
export function paintGlow(): Raster {
  const r = raster(32, 32);
  const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  for (let y = 0; y < 32; y++)
    for (let x = 0; x < 32; x++) {
      const d = Math.hypot(x - 15.5, y - 15.5) / 15.5;
      if (d > 1) continue;
      const k = 1 - d;
      if (k * 1.2 > (bayer[(y % 4) * 4 + (x % 4)]! + 0.5) / 16) r.set(x, y, hex('#ffd27a'));
    }
  return r;
}

/** A bird in the sky, wings up (0) or level (1). */
export function paintBird(frame: number): Raster {
  const r = raster(16, 8);
  const c = hex('#2b2a3a');
  if (frame === 0) {
    r.line(1, 1, 7, 5, c);
    r.line(14, 1, 8, 5, c);
  } else {
    r.line(1, 4, 7, 5, c);
    r.line(14, 4, 8, 5, c);
  }
  r.rect(7, 4, 2, 3, c);
  return r;
}

/** A moth at a lamp, wings open (0) or folded (1). */
export function paintMoth(frame: number): Raster {
  const r = raster(8, 6);
  const c = hex('#f2ecd8');
  if (frame === 0) {
    r.ellipse(2, 2.5, 2.2, 2, c);
    r.ellipse(5, 2.5, 2.2, 2, c);
  } else {
    r.ellipse(3.5, 2.5, 1.4, 2.4, c);
    r.ellipse(4.5, 2.5, 1.4, 2.4, c);
  }
  r.rect(3, 2, 2, 3, hex('#6a5a4a'));
  return r;
}

// ------------------------------------------------------------------------ K45 gate frost

/**
 * The gate's frost at growth stage `stage` of `stages`: white, dithered speckle laid on
 * the gate's own coverage, spreading up from the ground. Pass the painted gate frame.
 */
export function paintGateFrost(gate: Raster, stage: number, stages: number): Raster {
  const r = raster(gate.w, gate.h);
  const k = stage / stages;
  const white = hex(CG4_E4.frost.color);
  const blue = hex('#b8d8f0');
  for (let y = 0; y < gate.h; y++)
    for (let x = 0; x < gate.w; x++) {
      if (!gate.mask[y * gate.w + x]) continue;
      const up = 1 - y / gate.h;
      const reach = k * 1.25 - up;
      if (reach <= 0) continue;
      const n = hash(x, y, 31);
      const cover = Math.min(0.92, 0.25 + reach * 0.9);
      if (n < cover) r.set(x, y, mix(white, blue, hash(x >> 1, y >> 1, 32) * 0.7));
    }
  return r;
}

// ------------------------------------------------------------------------ K19 streak

/** The pond streak: a dithered column of warm light that breaks into ripples toward its far end. */
export function streakTexture(): CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const w = 12;
  const h = 56;
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const g = cv.getContext('2d');
  if (!g) return null;
  const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  for (let y = 0; y < h; y++) {
    const t = y / (h - 1);
    // Wide and bright at the lamp, narrowing and breaking into ripples further out.
    const half = 5.6 * (1 - t * 0.5);
    const ripple = y % 8 >= 6 && t > 0.15;
    for (let x = 0; x < w; x++) {
      const dx = Math.abs(x - (w - 1) / 2) / half;
      if (dx > 1) continue;
      const core = dx < 0.4;
      if (ripple && !core) continue;
      const strength = (1 - t * 0.85) * (1 - dx * 0.55);
      if (core || strength > (bayer[(y % 4) * 4 + (x % 4)]! + 0.5) / 16) {
        g.fillStyle = dx < 0.25 && t < 0.7 ? '#fff6d2' : dx < 0.6 ? '#ffd27a' : '#ffb347';
        g.fillRect(x, y, 1, 1);
      }
    }
  }
  const tex = new CanvasTexture(cv);
  tex.magFilter = NearestFilter;
  tex.minFilter = NearestFilter;
  tex.generateMipmaps = false;
  tex.colorSpace = SRGBColorSpace;
  return tex;
}
