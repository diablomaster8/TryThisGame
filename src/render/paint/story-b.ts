import { GROVE } from '../../config/tuning';
import { STORY_B } from '../../config/tuning-b';
import { hash } from './raster';
import {
  eaveShadow,
  plankDoor,
  plasterWall,
  roofTiles,
  stoneStep,
  stoneWall,
  timber,
  windowPane,
} from './buildings';
import { ridged, vnoise } from './noise';
import { hex, mix, Raster, rimObjects, shade, type RGB } from './raster';
import { shoreDistance } from './shore';

/**
 * Campaign-graphics package b, pixel painters (C4, C6, C7, M9, M10, N7): the Grove's gate
 * in shut and open frames with an ivy variant, the day post's tally strokes, Dawn & Dusk's
 * four crest houses, the mill wheel, the jetty, the shore's sand band, and the Fold's ruin
 * levels, which are cut from the stock buildings' painted frames (`ruinFrame`) so the
 * ruined cottage is still the cottage. Everything is drawn into a Raster whose mask becomes
 * the sprite's alpha, then sheeted by `dress-b.ts`.
 */
export const GATE_PPU = 24;

const WOOD: RGB[] = ['#4a2e18', '#6a4426', '#8a5a32', '#b4864c', '#d9a76a'].map(hex);
const IVY: RGB[] = ['#254a26', '#356b30', '#4c8a3a', '#6aa84a', '#8cc25e'].map(hex);

/** A vertical board of wood: grain from noise, lit on the left and shaded on the right. */
function board(r: Raster, x: number, y: number, w: number, h: number, seed: number): void {
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      const g = ridged((x + i) / 2.5 + seed, (y + j) / 9, 2, 51 + seed);
      const side = w > 2 ? (i / (w - 1)) * 0.8 : 0.4;
      const t = Math.min(0.999, Math.max(0, g * 0.6 + 0.55 - side * 0.45));
      r.set(x + i, y + j, WOOD[Math.floor(t * WOOD.length)]!);
    }
}

function plankH(r: Raster, x: number, y: number, w: number, h: number, seed: number): void {
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      const g = ridged((x + i) / 9 + seed, (y + j) / 2, 2, 61 + seed);
      const t = Math.min(0.999, Math.max(0, g * 0.55 + 0.6 - (j / Math.max(1, h - 1)) * 0.5));
      r.set(x + i, y + j, WOOD[Math.floor(t * WOOD.length)]!);
    }
}

export interface GateLook {
  bare: boolean;
  open: boolean;
  ivy: boolean;
}

/** Raster size of a gate frame; the post centres sit at `cx` ± `GATE_HALF_PX`. */
export function gateSize(bare: boolean): { w: number; h: number; cx: number; ground: number } {
  return bare ? { w: 176, h: 92, cx: 88, ground: 89 } : { w: 200, h: 92, cx: 100, ground: 89 };
}
export const GATE_HALF_PX = Math.round(STORY_B.gate.half * GATE_PPU);

/** The gate: posts on stone feet, lintel and cap roof, a cross-braced leaf, fence, ivy. */
export function paintGate(look: GateLook): Raster {
  const { w, h, cx, ground } = gateSize(look.bare);
  const r = new Raster(w, h, null);
  r.tracking = true;
  const half = GATE_HALF_PX;
  const postW = 9;
  const postH = Math.round(STORY_B.gate.postHeight * GATE_PPU);
  const top = ground - postH;
  const stone = hex('#9b9aa6');
  // Fence first, so the posts stand in front of it.
  if (!look.bare) {
    for (const sx of [-1, 1])
      for (let i = 0; i < STORY_B.gate.panels; i++) {
        const x0 = cx + sx * (half + postW / 2 + i * 26);
        const x1 = cx + sx * (half + postW / 2 + (i + 1) * 26);
        const lo = Math.min(x0, x1);
        for (const ry of [ground - 25, ground - 14]) plankH(r, lo, ry, 26, 3, i + (sx > 0 ? 3 : 0));
        board(r, Math.round(x1 - 2), ground - 28, 5, 28, 7 + i);
        r.rect(Math.round(x1 - 2), ground - 29, 5, 1, WOOD[4]!);
      }
  }
  for (const sx of [-1, 1]) {
    const px = cx + sx * half - Math.floor(postW / 2);
    r.rect(px - 2, ground - 5, postW + 4, 6, stone);
    r.rect(px - 2, ground - 5, postW + 4, 1, shade(stone, 1.25));
    board(r, px, top, postW, postH - 4, sx + 3);
    r.rect(px - 1, top - 2, postW + 2, 3, WOOD[3]!);
    r.rect(px - 1, top - 2, postW + 2, 1, WOOD[4]!);
  }
  // The leaf: shut (frame, slats, brace) or swung open and seen edge-on at the hinge.
  const lx0 = cx - half + Math.ceil(postW / 2) + 1;
  const lx1 = cx + half - Math.ceil(postW / 2) - 1;
  const ly0 = ground - 38;
  const ly1 = ground - 4;
  if (!look.open) {
    for (let x = lx0; x <= lx1; x += 7) board(r, x, ly0 + 2, 5, ly1 - ly0 - 2, 11 + x);
    for (const y of [ly0, Math.round((ly0 + ly1) / 2), ly1 - 3])
      plankH(r, lx0, y, lx1 - lx0 + 1, 4, y);
    plankH(r, lx0, ly0, 4, ly1 - ly0 + 1, 2);
    plankH(r, lx1 - 3, ly0, 4, ly1 - ly0 + 1, 3);
    for (let i = 0; i < ly1 - ly0 - 6; i++) {
      const x = lx0 + 3 + Math.round(((lx1 - lx0 - 8) * i) / (ly1 - ly0 - 6));
      r.rect(x, ly1 - 4 - i, 3, 2, WOOD[1]!);
      r.rect(x, ly1 - 5 - i, 3, 1, WOOD[3]!);
    }
    for (const y of [ly0 + 5, ly1 - 8]) r.rect(lx0, y, 12, 2, hex('#2a2230'));
  } else {
    for (let i = 0; i < 11; i++) {
      const x = lx0 + i;
      const skew = Math.round(i * 0.5);
      board(r, x, ly0 + skew, 1, ly1 - ly0 - skew * 2, 3 + i);
    }
    for (const y of [ly0, Math.round((ly0 + ly1) / 2), ly1 - 3])
      r.rect(lx0, y + 1, 11, 2, WOOD[2]!);
  }
  // The lintel, braces and the pitched cap: a band of tiles with a lit top edge.
  plankH(r, cx - half - 10, top + 3, half * 2 + 20, 5, 9);
  for (const sx of [-1, 1])
    for (let i = 0; i < 9; i++) r.rect(cx + sx * (half - 6 - i), top + 8 + i, 3, 2, WOOD[2]!);
  const roofTop = top - 10;
  const rc = hex('#b4442e');
  for (let y = 0; y < 11; y++) {
    const inset = Math.round(y * 0.35);
    for (let x = cx - half - 15 + inset; x <= cx + half + 15 - inset; x++) {
      const tile = ((x + (Math.floor(y / 3) % 2) * 3) % 6 < 5 ? 1 : 0.7) * (0.85 + (y % 3) * 0.1);
      r.set(x, roofTop + y, shade(rc, tile * (y < 2 ? 1.25 : 1)));
    }
  }
  r.rect(cx - half - 15, roofTop + 10, half * 2 + 31, 1, shade(rc, 0.45));
  r.rect(cx - half - 12, roofTop - 1, half * 2 + 25, 2, WOOD[1]!);
  // The lantern hook: an arm off the right post and a ring on its end.
  const hx = cx + half + Math.ceil(postW / 2);
  r.rect(hx, top + 14, 9, 2, hex('#2a2230'));
  r.rect(hx + 8, top + 14, 2, 5, hex('#2a2230'));
  r.rect(hx + 6, top + 19, 6, 1, hex('#2a2230'));
  // The day board (The Hundred Days): a plank board hung on the hinge post's lane side.
  if (look.bare) {
    const bx = cx - half - postW - 31;
    board(r, bx, ground - 56, 30, 52, 21);
    r.rect(bx, ground - 56, 30, 1, WOOD[4]!);
    r.rect(bx, ground - 5, 30, 2, WOOD[0]!);
    for (const x of [bx + 1, bx + 28]) r.rect(x, ground - 56, 1, 52, WOOD[0]!);
    r.rect(bx + 29, ground - 50, 2, 3, hex('#2a2230'));
  }
  // Ivy.
  if (look.ivy) {
    const dot = (x: number, y: number, k: number) => {
      const c = IVY[Math.floor(hash(x, y, k) * IVY.length)]!;
      r.rect(x, y, 2, 2, c);
      if (hash(x, y, k + 9) > 0.55) r.set(x + 2, y + 1, shade(c, 1.2));
    };
    for (const sx of [-1, 1]) {
      const px = cx + sx * half;
      for (let i = 0; i < 70; i++) {
        const t = Math.pow(hash(i, sx, 3), 1.3);
        const y = ground - 6 - t * (sx < 0 ? postH - 10 : postH * 0.7);
        const x = px + Math.round((hash(i, sx, 4) - 0.5) * (postW + 6));
        dot(x, Math.round(y), i);
      }
      for (let i = 0; i < 26; i++) {
        const x = cx + sx * (half - 3 - hash(i, sx, 5) * 34);
        dot(Math.round(x), top + 7 + Math.round(hash(i, sx, 6) * 7), i + 100);
      }
      for (let i = 0; i < 14; i++) {
        const x = cx + sx * (half - 5 - hash(i, 3, sx) * 14);
        dot(Math.round(x), ly1 - 2 - Math.round(hash(i, 8, sx) * 12), i + 200);
      }
    }
    if (!look.bare)
      for (const sx of [-1, 1])
        for (let i = 0; i < 12; i++)
          dot(
            Math.round(cx + sx * (half + 8 + hash(i, sx, 7) * 36)),
            ground - 8 - Math.round(hash(i, sx, 8) * 18),
            i + 300,
          );
  }
  rimObjects(r);
  return r;
}

/** A tally group of `n` (1..5) strokes: four uprights, the fifth struck across them. */
export function paintTally(n: number): Raster {
  const r = new Raster(7, 6, null);
  r.tracking = true;
  const ink = hex('#2b1a10');
  for (let s = 0; s < Math.min(4, n); s++) r.rect(s * 2, 0, 1, 5, ink);
  if (n >= 5) for (let i = 0; i < 7; i++) r.set(i, 4 - Math.round(i * 0.6), ink);
  return r;
}

/** Where tally group `i` sits on the day board, in raster pixels from the board's corner. */
export function tallySpot(i: number): { dx: number; up: number } {
  const col = i % 3;
  const row = Math.floor(i / 3);
  return { dx: 3 + col * 9, up: 46 - row * 7 };
}

// ------------------------------------------------------------- crest houses

export type Crest = 'sun' | 'moon' | 'leaf' | 'wave';

function paintCrest(r: Raster, crest: Crest, cx: number, cy: number): void {
  const carve = hex('#4a2e18');
  const board = hex('#c49256');
  r.rect(cx - 11, cy - 9, 22, 18, board);
  r.rect(cx - 11, cy - 9, 22, 1, shade(board, 1.25));
  r.rect(cx - 11, cy + 8, 22, 1, shade(board, 0.6));
  switch (crest) {
    case 'sun':
      r.disc(cx, cy, 3.4, carve);
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        r.line(
          cx + Math.cos(a) * 5,
          cy + Math.sin(a) * 5,
          cx + Math.cos(a) * 8,
          cy + Math.sin(a) * 8,
          carve,
        );
      }
      break;
    case 'moon':
      r.disc(cx - 1, cy, 6.4, carve);
      r.disc(cx + 2.5, cy - 1, 5.4, board);
      break;
    case 'leaf':
      for (let y = -7; y <= 7; y++) {
        const wd = Math.sqrt(Math.max(0, 1 - (y / 7.5) ** 2)) * 5.5;
        r.rect(Math.round(cx - wd), cy + y, Math.round(wd * 2), 1, carve);
      }
      r.rect(cx, cy - 6, 1, 13, board);
      break;
    default:
      for (let row = 0; row < 3; row++)
        for (let x = -8; x <= 8; x++) {
          const y = cy - 5 + row * 5 + Math.round(Math.sin(x * 0.7 + row) * 1.6);
          r.rect(cx + x, y, 1, 2, carve);
        }
  }
}

/** A cottage-sized house with a roof tinted `roof` and a carved crest over its door. */
export function paintCrestHouse(crest: Crest, roof: string, seed: number): Raster {
  const r = new Raster(160, 146, null);
  r.tracking = true;
  const x = 22;
  const wallTop = 66;
  const base = 132;
  const ww = 116;
  plasterWall(r, x, wallTop, ww, base - wallTop, 40 + seed);
  timber(r, x + 2, wallTop, x + 2, base, 1.4, 1 + seed);
  timber(r, x + ww - 3, wallTop, x + ww - 3, base, 1.4, 2 + seed);
  timber(r, x, wallTop + 2, x + ww, wallTop + 1, 1.3, 3 + seed);
  stoneWall(r, x - 2, base - 9, ww + 4, 11, 36 + seed);
  roofTiles(
    r,
    { x0: x - 14, x1: x + ww + 14, eaveY: wallTop + 8, rx0: 58, rx1: 102, ridgeY: 26 },
    20 + seed,
    hex(roof),
  );
  eaveShadow(r, x, wallTop + 9, ww, 8);
  windowPane(r, x + 14, base - 44, 22, 18, 41 + seed);
  windowPane(r, x + ww - 36, base - 44, 22, 18, 42 + seed);
  plankDoor(r, 80 - 11, base - 34, 22, 34, 43 + seed);
  stoneStep(r, 80 - 14, base, 28);
  paintCrest(r, crest, 80, wallTop + 25);
  rimObjects(r);
  return r;
}

// ------------------------------------------------------------- the mill wheel

export const WHEEL_PX = 64;

/** One frame of the wheel: `k` of 4 turn steps (the wheel repeats every 45 degrees). */
export function paintWheel(k: number, flow: boolean): Raster {
  const r = new Raster(WHEEL_PX, WHEEL_PX, null);
  r.tracking = true;
  const c = WHEEL_PX / 2;
  const R = Math.round(STORY_B.mill.radius * GATE_PPU);
  const a0 = (k / 4) * (Math.PI / 4);
  // Stone feet and the standing frame behind the wheel.
  r.rect(c - 3, 30, 5, 30, WOOD[1]!);
  r.rect(c - 9, WHEEL_PX - 8, 18, 6, hex('#9b9aa6'));
  for (let i = 0; i < 8; i++) {
    const a = a0 + (i / 8) * Math.PI * 2;
    r.line(c, c, c + Math.cos(a) * (R - 2), c + Math.sin(a) * (R - 2), WOOD[2]!);
    r.line(c + 1, c, c + 1 + Math.cos(a) * (R - 2), c + Math.sin(a) * (R - 2), WOOD[1]!);
    const px = c + Math.cos(a) * R;
    const py = c + Math.sin(a) * R;
    r.rect(Math.round(px - 3), Math.round(py - 1), 7, 3, WOOD[3]!);
    r.rect(Math.round(px - 3), Math.round(py + 1), 7, 1, WOOD[0]!);
  }
  for (let t = 0; t < 120; t++) {
    const a = (t / 120) * Math.PI * 2;
    for (const rr of [R - 1, R])
      r.set(c + Math.cos(a) * rr, c + Math.sin(a) * rr, WOOD[t % 2 ? 2 : 3]!);
  }
  r.disc(c, c, 3.2, WOOD[0]!);
  r.disc(c - 0.5, c - 0.5, 1.6, WOOD[3]!);
  if (flow) {
    // The stream spilling over the top: pale streaks that read without any motion.
    const wc = hex('#bfe6ff');
    for (let y = 2; y < 26; y++)
      for (let x = c - 7; x <= c + 7; x++) {
        if (vnoise(x / 2, y / 3, 17) > 0.42 - (y < 8 ? 0.2 : 0))
          r.set(x + Math.round((y - 2) * 0.12), y, mix(wc, hex('#ffffff'), vnoise(x, y, 5) * 0.6));
      }
  }
  rimObjects(r);
  return r;
}

// ------------------------------------------------------------- jetty and sand

export const JETTY_PX = { w: 104, h: 28 };

/** The jetty from above, running east: boards across, `missing` ones gone. */
export function paintJetty(missing: readonly number[]): Raster {
  const { w, h } = JETTY_PX;
  const r = new Raster(w, h, null);
  r.tracking = true;
  const n = STORY_B.shore.boards;
  const bw = Math.floor(w / n);
  for (const y of [3, h - 5]) r.rect(0, y, w, 3, WOOD[0]!);
  for (let i = 0; i < n; i++) {
    if (missing.includes(i)) {
      // The gap: the dark bearers show, and the water beneath.
      continue;
    }
    plankH(r, i * bw + 1, 2, bw - 2, h - 4, i * 3);
    r.rect(i * bw + 1, 2, bw - 2, 1, WOOD[4]!);
    r.rect(i * bw + 1, h - 3, bw - 2, 1, WOOD[0]!);
  }
  for (let i = 0; i < 5; i++) {
    const x = 4 + Math.round(((w - 12) * i) / 4);
    r.rect(x, 0, 4, 4, WOOD[1]!);
    r.rect(x, h - 4, 4, 4, WOOD[1]!);
  }
  rimObjects(r);
  return r;
}

/** The pond's grey sand band, painted from the shoreline so it sits on the real edge. */
export function paintSandRing(): { raster: Raster; size: number } {
  const pad = 2.6;
  const size = (GROVE.pond.r + pad) * 2 + 2;
  const px = Math.round(size * GATE_PPU);
  const r = new Raster(px, px, null);
  r.tracking = true;
  const sand = hex(STORY_B.shore.sand);
  const wide = STORY_B.shore.sandWidth;
  for (let j = 0; j < px; j++)
    for (let i = 0; i < px; i++) {
      const x = GROVE.pond.x + (i / px - 0.5) * size;
      const z = GROVE.pond.z + (j / px - 0.5) * size;
      const d = shoreDistance(x, z);
      const edge = wide * (0.7 + vnoise(i / 14, j / 14, 31) * 0.6);
      if (d < -0.15 || d > edge) continue;
      const speck = ridged(i / 4, j / 4, 2, 33);
      const c = mix(shade(sand, 0.78), shade(sand, 1.18), speck * 0.8 + hash(i, j, 3) * 0.2);
      r.set(i, j, c);
    }
  return { raster: r, size };
}

/** A round ground shadow, solid: the caller draws it at a low opacity, as the stock ones are. */
export function paintShadow(w: number, h: number): Raster {
  const r = new Raster(w, h, null);
  r.tracking = true;
  const ink = hex('#14210f');
  for (let j = 0; j < h; j++)
    for (let i = 0; i < w; i++) {
      const dx = (i + 0.5 - w / 2) / (w / 2);
      const dy = (j + 0.5 - h / 2) / (h / 2);
      if (dx * dx + dy * dy < 1 && true) r.set(i, j, ink);
    }
  return r;
}

// ------------------------------------------------------------- the Fold's ruin levels

/** What the ruin pass needs to know about one stock building's painted frame. */
export interface RuinSpec {
  /** Roof bands to take apart: a fan of rafters runs from the apex to the base. */
  bands: ReadonlyArray<{
    y0: number;
    y1: number;
    apex: { x: number; y: number; hw: number };
    base: { y: number; hw: number };
  }>;
  /** Rectangles of the frame left as painted (a chimney). */
  keep?: ReadonlyArray<{ x0: number; y0: number; x1: number; y1: number }>;
  /** Where a taken roof leaves a gap in the wall: refill it. */
  fill?: ReadonlyArray<{ x0: number; y0: number; x1: number; y1: number; dark: boolean }>;
  windows: ReadonlyArray<{ x: number; y: number; w: number; h: number }>;
  moss: { y0: number; y1: number; x0: number; x1: number };
  /** A chimney stack to stand from the wall up to the kept top (cottage). */
  stack?: { x0: number; x1: number; y0: number; y1: number };
}

export const RUIN_SPECS: Record<'cottage' | 'school' | 'dojo', RuinSpec> = {
  cottage: {
    bands: [{ y0: 0, y1: 78, apex: { x: 88, y: 22, hw: 14 }, base: { y: 72, hw: 82 } }],
    keep: [{ x0: 118, y0: 0, x1: 142, y1: 42 }],
    fill: [{ x0: 28, y0: 62, x1: 148, y1: 78, dark: false }],
    windows: [
      { x: 36, y: 78, w: 32, h: 26 },
      { x: 106, y: 78, w: 32, h: 26 },
    ],
    moss: { y0: 118, y1: 138, x0: 26, x1: 150 },
    stack: { x0: 122, x1: 138, y0: 42, y1: 78 },
  },
  school: {
    bands: [{ y0: 0, y1: 86, apex: { x: 75, y: 30, hw: 5 }, base: { y: 86, hw: 62 } }],
    windows: [
      { x: 40, y: 98, w: 20, h: 18 },
      { x: 90, y: 98, w: 20, h: 18 },
    ],
    moss: { y0: 124, y1: 142, x0: 28, x1: 122 },
  },
  dojo: {
    bands: [
      { y0: 8, y1: 42, apex: { x: 110, y: 14, hw: 34 }, base: { y: 41, hw: 74 } },
      { y0: 60, y1: 91, apex: { x: 110, y: 62, hw: 66 }, base: { y: 89, hw: 96 } },
    ],
    fill: [{ x0: 38, y0: 66, x1: 182, y1: 89, dark: true }],
    windows: [{ x: 98, y: 44, w: 26, h: 20 }],
    moss: { y0: 140, y1: 158, x0: 30, x1: 190 },
  },
};

type Rgba = { data: Uint8ClampedArray; width: number; height: number };

/** A ruined copy of a stock building: roof taken apart to `level` (1..3), windows boarded from 2, moss. */
export function ruinFrame(src: Rgba, spec: RuinSpec, level: number, seed: number): Raster {
  const { width: w, height: h } = src;
  const r = new Raster(w, h, null);
  r.tracking = true;
  const px = (x: number, y: number): RGB | null => {
    if (x < 0 || y < 0 || x >= w || y >= h) return null;
    const i = (y * w + x) * 4;
    return src.data[i + 3]! < 128
      ? null
      : [src.data[i]! / 255, src.data[i + 1]! / 255, src.data[i + 2]! / 255];
  };
  const inKeep = (x: number, y: number) =>
    (spec.keep ?? []).some((k) => x >= k.x0 && x <= k.x1 && y >= k.y0 && y <= k.y1);
  const band = (y: number) => spec.bands.find((b) => y >= b.y0 && y < b.y1);
  const share = level === 1 ? 0.3 : level === 2 ? 0.66 : 1;
  const erased = new Uint8Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const c = px(x, y);
      if (!c) continue;
      const b = band(y);
      if (b && !inKeep(x, y)) {
        const blotch =
          vnoise(x / 7 + seed, y / 5, 71 + seed) * 0.7 + hash(x >> 1, y >> 1, seed) * 0.3;
        if (share >= 1 || blotch < share) {
          erased[y * w + x] = 1;
          continue;
        }
      }
      r.set(x, y, c);
    }
  // Refill a gap the roof left in the wall.
  for (const f of spec.fill ?? [])
    for (let y = f.y0; y <= f.y1; y++)
      for (let x = f.x0; x <= f.x1; x++) {
        if (!erased[y * w + x]) continue;
        const t = (y - f.y0) / Math.max(1, f.y1 - f.y0);
        const c = f.dark
          ? mix(hex('#1c1822'), hex('#3a2e34'), t)
          : mix(shade(hex('#cdb98e'), 0.7), hex('#e1cf9f'), t);
        r.set(x, y, c);
        erased[y * w + x] = 0;
      }
  if (spec.stack) {
    const s = spec.stack;
    for (let y = s.y0; y <= s.y1; y++)
      for (let x = s.x0; x <= s.x1; x++) {
        const brick = hash(x >> 2, y >> 1, 9) > 0.5 ? 0.92 : 1.05;
        r.set(x, y, shade(hex('#8c8c98'), brick * (x < s.x0 + 3 ? 1.15 : 0.95)));
      }
  }
  // The rafters: a fan from the apex to the eave, drawn where the roof is gone.
  const beam = (x: number, y: number, c: RGB) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    if (erased[y * w + x] || level >= 3) r.set(x, y, c);
  };
  for (const b of spec.bands) {
    const n = Math.max(6, Math.round(b.base.hw / 8));
    for (let i = 0; i <= n; i++) {
      const t = (i / n) * 2 - 1;
      const ax = b.apex.x + t * b.apex.hw;
      const bx = b.apex.x + t * b.base.hw;
      const steps = Math.max(1, Math.round(b.base.y - b.apex.y));
      for (let s = 0; s <= steps; s++) {
        const u = s / steps;
        const x = Math.round(ax + (bx - ax) * u);
        const y = Math.round(b.apex.y + (b.base.y - b.apex.y) * u);
        beam(x, y, WOOD[1]!);
        beam(x + 1, y, WOOD[2]!);
        if (hash(i, s, seed) > 0.97) beam(x - 1, y, WOOD[0]!);
      }
    }
    for (const yy of [b.apex.y + 1, Math.round((b.apex.y + b.base.y) / 2), b.base.y]) {
      const hw =
        b.apex.hw + ((b.base.hw - b.apex.hw) * (yy - b.apex.y)) / Math.max(1, b.base.y - b.apex.y);
      for (let x = Math.round(b.apex.x - hw); x <= Math.round(b.apex.x + hw); x++) {
        beam(x, yy, WOOD[1]!);
        beam(x, yy + 1, WOOD[0]!);
      }
    }
  }
  // Boarded windows from level 2: two planks across and a dark pane.
  if (level >= 2)
    for (const win of spec.windows) {
      r.rect(win.x, win.y, win.w, win.h, hex('#1d1a22'));
      for (const k of [0.28, 0.66]) {
        const y = Math.round(win.y + win.h * k);
        plankH(r, win.x - 3, y, win.w + 6, 4, y);
        r.rect(win.x - 3, y + 3, win.w + 6, 1, WOOD[0]!);
      }
    }
  // Moss on the footing.
  const m = spec.moss;
  const mossy: RGB[] = ['#2f5a2a', '#3f7a35', '#5c9a45'].map(hex);
  for (let y = m.y0; y <= m.y1; y++)
    for (let x = m.x0; x <= m.x1; x++) {
      if (!px(x, y)) continue;
      const g = vnoise(x / 6, y / 3, 77 + seed) + ((y - m.y0) / (m.y1 - m.y0)) * 0.25;
      if (g > 0.78 - level * 0.07) r.set(x, y, mossy[Math.floor(hash(x, y, 4) * 3)]!);
    }
  return r;
}
