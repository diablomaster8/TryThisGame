import { CanvasTexture, NearestFilter, RepeatWrapping, SRGBColorSpace } from 'three';
import { CG2_S } from '../config/tuning-s';
import type { SpriteSheet } from './sprites/atlas';
import { sheetFromImage } from './sprites/atlas';

/**
 * Campaign graphics 2, package s: the painted pieces of its sets, drawn on canvases in code
 * and shared by both renderers. The sprite sheet (pixel billboards) holds the board's holo
 * edge, chapter 6's door, the egg glints and the drips below; the textures are the grid
 * decal, the torch-lit oval mask, a flame card and a soft glow. Browser only: each builder
 * returns null where there is no `document` (the tests).
 */

/** Canvas pixels per world unit in the sheet (as package f's). */
export const US = 32;

type Paint = (c: CanvasRenderingContext2D) => void;

function canvas(w: number, h: number, paint: Paint): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null;
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const c = cv.getContext('2d');
  if (!c) return null;
  c.imageSmoothingEnabled = false;
  paint(c);
  return cv;
}

function tex(cv: HTMLCanvasElement, nearest: boolean): CanvasTexture {
  const t = new CanvasTexture(cv);
  t.colorSpace = SRGBColorSpace;
  if (nearest) {
    t.magFilter = NearestFilter;
    t.minFilter = NearestFilter;
    t.generateMipmaps = false;
  }
  return t;
}

const CYAN = '#52e6ff';
const CYAN_HI = '#c8f8ff';

function rect(
  c: CanvasRenderingContext2D,
  color: string,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  c.fillStyle = color;
  c.fillRect(x, y, w, h);
}

/** The holo edge round package f's 80 by 100 board: its panel is the top 56 rows. */
function boardEdge(c: CanvasRenderingContext2D): void {
  rect(c, 'rgba(82,230,255,0.45)', 0, 0, 80, 1);
  rect(c, 'rgba(82,230,255,0.45)', 0, 55, 80, 1);
  rect(c, 'rgba(82,230,255,0.45)', 0, 0, 1, 56);
  rect(c, 'rgba(82,230,255,0.45)', 79, 0, 1, 56);
  // Corner brackets, bright: the shape reads without the colour.
  for (const [x, y, dx, dy] of [
    [0, 0, 1, 1],
    [79, 0, -1, 1],
    [0, 55, 1, -1],
    [79, 55, -1, -1],
  ] as const) {
    for (let i = 0; i < 7; i++) {
      rect(c, CYAN_HI, x + dx * i, y, 1, 1);
      rect(c, CYAN_HI, x, y + dy * i, 1, 1);
    }
  }
  // Tick marks along the foot of the panel, like a numbered gate.
  for (let x = 12; x < 70; x += 8) rect(c, CYAN, x, 56, 1, 2);
}

/** Chapter 6's plain freestanding door: 40 by 80, frame, slab, knob, a holo edge. */
function door(c: CanvasRenderingContext2D): void {
  rect(c, '#2c3440', 2, 2, 36, 78);
  rect(c, '#3e4856', 4, 4, 32, 76);
  rect(c, '#e9e4d8', 7, 7, 26, 73);
  rect(c, '#d4cebf', 7, 7, 26, 2);
  rect(c, '#c9c2b2', 9, 12, 22, 26);
  rect(c, '#efe9dd', 10, 13, 20, 24);
  rect(c, '#c9c2b2', 9, 44, 22, 30);
  rect(c, '#efe9dd', 10, 45, 20, 28);
  rect(c, '#9a7a3a', 28, 42, 3, 3);
  rect(c, '#e9c46a', 28, 42, 2, 2);
  // The holo edge: a bright outline with corner brackets.
  rect(c, 'rgba(82,230,255,0.55)', 0, 0, 40, 1);
  rect(c, 'rgba(82,230,255,0.55)', 0, 0, 1, 80);
  rect(c, 'rgba(82,230,255,0.55)', 39, 0, 1, 80);
  for (const x of [0, 33]) rect(c, CYAN_HI, x, 0, 7, 1);
  rect(c, CYAN_HI, 0, 0, 1, 7);
  rect(c, CYAN_HI, 39, 0, 1, 7);
  rect(c, 'rgba(82,230,255,0.35)', 0, 79, 40, 1);
}

/** A four-point pixel sparkle, `s` 0..3 its size. */
function spark(s: number): Paint {
  return (c) => {
    const m = 4;
    const arm = [1, 2, 4, 2][s] ?? 1;
    for (let i = 1; i <= arm; i++) {
      const col = i === arm ? CYAN : '#e8fdff';
      rect(c, col, m + i, m, 1, 1);
      rect(c, col, m - i, m, 1, 1);
      rect(c, col, m, m + i, 1, 1);
      rect(c, col, m, m - i, 1, 1);
    }
    rect(c, '#ffffff', m, m, 1, 1);
  };
}

function drip(c: CanvasRenderingContext2D): void {
  rect(c, 'rgba(170,215,255,0.5)', 0, 0, 2, 3);
  rect(c, 'rgba(200,230,255,0.85)', 0, 3, 2, 3);
  rect(c, '#e8f6ff', 0, 6, 2, 2);
}

function ripple(c: CanvasRenderingContext2D): void {
  c.strokeStyle = 'rgba(190,225,255,0.8)';
  c.lineWidth = 1;
  c.beginPath();
  c.ellipse(6, 3, 5, 2, 0, 0, Math.PI * 2);
  c.stroke();
}

function glow(c: CanvasRenderingContext2D): void {
  // Stepped rings, not a smooth ramp: the pixel look.
  const steps: Array<[number, string]> = [
    [16, 'rgba(255,168,80,0.10)'],
    [12, 'rgba(255,168,80,0.18)'],
    [8, 'rgba(255,190,110,0.28)'],
    [4, 'rgba(255,220,160,0.45)'],
  ];
  for (const [r, col] of steps) {
    c.fillStyle = col;
    c.beginPath();
    c.arc(16, 16, r, 0, Math.PI * 2);
    c.fill();
  }
}

export interface ArtS {
  sheet: SpriteSheet;
  frame(key: string): { x: number; y: number; w: number; h: number };
}

/** The pixel billboards, one sheet. */
export function buildArtS(): ArtS | null {
  const list: Array<[string, number, number, Paint]> = [
    ['board-edge', 80, 100, boardEdge],
    ['door', 40, 80, door],
    ['drip', 2, 8, drip],
    ['ripple', 12, 6, ripple],
    ['glow', 32, 32, glow],
    ...[0, 1, 2, 3].map((s): [string, number, number, Paint] => [`spark-${s}`, 9, 9, spark(s)]),
  ];
  const W = 256;
  let x = 0;
  let y = 0;
  let rowH = 0;
  const map: Record<string, [number, number, number, number]> = {};
  const spots: Array<[number, number, Paint, number, number]> = [];
  for (const [key, w, h, p] of list) {
    if (x + w > W) {
      x = 0;
      y += rowH + 1;
      rowH = 0;
    }
    map[key] = [x, y, w, h];
    spots.push([x, y, p, w, h]);
    x += w + 1;
    rowH = Math.max(rowH, h);
  }
  const cv = canvas(W, y + rowH, (c) => {
    for (const [sx, sy, p, w, h] of spots) {
      c.save();
      c.beginPath();
      c.rect(sx, sy, w, h);
      c.clip();
      c.translate(sx, sy);
      p(c);
      c.restore();
    }
  });
  if (!cv) return null;
  const sheet = sheetFromImage(cv, map, 16, 16);
  return {
    sheet,
    frame(key) {
      const r = sheet.frames.get(key);
      if (!r) throw new Error(`art-s: no frame ${key}`);
      return r;
    },
  };
}

/**
 * The grid decal: one cell per `tile` texels, a 1 px line, faded out to the edge so the
 * meadow keeps its grass round it. `size` texels across.
 */
export function gridTexture(
  size = 512,
  worldSize: number = CG2_S.digital.gridSize,
): CanvasTexture | null {
  const cells = worldSize / CG2_S.digital.gridCell;
  const tile = size / cells;
  const cv = canvas(size, size, (c) => {
    const half = size / 2;
    for (let i = 0; i <= cells; i++) {
      const p = Math.min(size - 1, Math.round(i * tile));
      for (let j = 0; j < size; j++) {
        // Fade by distance from the centre, in steps (a dither look, not a blur).
        const fade = (q: number) => {
          const d = Math.hypot(p - half, q - half) / half;
          return d > 1 ? 0 : d > 0.85 ? 0.3 : d > 0.7 ? 0.6 : 1;
        };
        const a1 = fade(j);
        if (a1 > 0) {
          c.fillStyle = `rgba(255,255,255,${a1})`;
          c.fillRect(p, j, 1, 1);
        }
        const a2 = Math.hypot(j - half, p - half) / half;
        const b = a2 > 1 ? 0 : a2 > 0.85 ? 0.3 : a2 > 0.7 ? 0.6 : 1;
        if (b > 0) {
          c.fillStyle = `rgba(255,255,255,${b})`;
          c.fillRect(j, p, 1, 1);
        }
      }
    }
  });
  if (!cv) return null;
  const t = tex(cv, true);
  t.wrapS = t.wrapT = RepeatWrapping;
  return t;
}

/**
 * The torch-lit oval: transparent in the middle, then stepped bands of the dark out to
 * opaque at the edge of a square `worldSize` across. Oval radii in world units.
 */
export function ovalMaskTexture(worldSize: number, rx: number, rz: number): CanvasTexture | null {
  const B = CG2_S.below;
  const N = 128;
  const cv = canvas(N, N, (c) => {
    const dark = B.dark;
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++) {
        const wx = ((x + 0.5) / N - 0.5) * worldSize;
        const wz = ((y + 0.5) / N - 0.5) * worldSize;
        const d = Math.hypot(wx / rx, wz / rz);
        // Bands with a checker at each step: dithered, as an old torch-lit room.
        const chk = (x + y) % 2 === 0;
        let a = 0;
        if (d > 1.18) a = 1;
        else if (d > 1.06) a = chk ? 1 : 0.7;
        else if (d > 0.94) a = chk ? 0.7 : 0.45;
        else if (d > 0.8) a = chk ? 0.35 : 0.2;
        else if (d > 0.62) a = chk ? 0.12 : 0;
        if (a <= 0) continue;
        c.globalAlpha = a;
        c.fillStyle = dark;
        c.fillRect(x, y, 1, 1);
      }
    c.globalAlpha = 1;
  });
  return cv ? tex(cv, true) : null;
}

/** A flame card for the 3D torches: a stepped teardrop, white at the heart. */
export function flameTexture(): CanvasTexture | null {
  const cv = canvas(16, 24, (c) => {
    const layers: Array<[number, number, string]> = [
      [7, 10, '#ff7a1a'],
      [5, 8, '#ffb347'],
      [3, 6, '#ffe7a8'],
    ];
    for (const [rx, ry, col] of layers) {
      c.fillStyle = col;
      c.beginPath();
      c.ellipse(8, 24 - ry - 1, rx, ry, 0, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.moveTo(8 - rx * 0.7, 24 - ry - 2);
      c.lineTo(8, 24 - ry * 2.3);
      c.lineTo(8 + rx * 0.7, 24 - ry - 2);
      c.fill();
    }
  });
  return cv ? tex(cv, true) : null;
}

/** A soft warm glow card (3D torch halos and the contact shadow's shape). */
export function softTexture(color: string): CanvasTexture | null {
  const cv = canvas(64, 64, (c) => {
    const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g;
    c.fillRect(0, 0, 64, 64);
  });
  return cv ? tex(cv, false) : null;
}

/** The holo edge for the 3D board and door cards: a bright rim and corner brackets. */
export function holoEdgeTexture(): CanvasTexture | null {
  const cv = canvas(128, 80, (c) => {
    c.strokeStyle = 'rgba(82,230,255,0.6)';
    c.lineWidth = 2;
    c.strokeRect(2, 2, 124, 76);
    c.fillStyle = CYAN_HI;
    for (const [x, y, dx, dy] of [
      [1, 1, 1, 1],
      [127, 1, -1, 1],
      [1, 79, 1, -1],
      [127, 79, -1, -1],
    ] as const) {
      c.fillRect(Math.min(x, x + dx * 14), Math.min(y, y + dy * 3), 14, 3);
      c.fillRect(Math.min(x, x + dx * 3), Math.min(y, y + dy * 14), 3, 14);
    }
  });
  return cv ? tex(cv, true) : null;
}
