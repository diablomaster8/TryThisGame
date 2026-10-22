import { CanvasTexture, NearestFilter, SRGBColorSpace } from 'three';
import type { InteriorId } from '../../config/stage-marks';
import { sheetFromImage, type SpriteSheet } from '../sprites/atlas';

/**
 * Campaign graphics 4, K10: the painted interiors for the pixel renderer, drawn in code on
 * canvases. Each room is a card set: a plank or stone floor (with its rug), a feature wall
 * (the back wall: the keepsake shelf, the three banners, the seed tins, the crest, the
 * patched wall under the hole), a plain wall with a window for the others, and a sheet of
 * furniture billboards. 32 canvas pixels per world unit, as the other painted sets.
 * Browser only: every builder returns null without a `document` (the tests).
 */

export const IU = 32;

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

function tex(cv: HTMLCanvasElement): CanvasTexture {
  const t = new CanvasTexture(cv);
  t.colorSpace = SRGBColorSpace;
  t.magFilter = NearestFilter;
  t.minFilter = NearestFilter;
  t.generateMipmaps = false;
  return t;
}

/** A room's colours. */
export interface RoomLook {
  wall: string;
  wallDark: string;
  /** The skirting band along the foot of each wall (wainscot or plinth). */
  base: string;
  beam: string;
  floor: string;
  floorDark: string;
  /** Planks run across; else flagstones. */
  planks: boolean;
  rug: string | null;
}

export const ROOM_LOOKS: Readonly<Record<InteriorId, RoomLook>> = {
  kitchen: {
    wall: '#efe0c4',
    wallDark: '#dcc8a4',
    base: '#b98a5a',
    beam: '#6a4428',
    floor: '#b07e50',
    floorDark: '#8c5f38',
    planks: true,
    rug: '#a8473c',
  },
  guardhouse: {
    wall: '#9a7048',
    wallDark: '#7c5634',
    base: '#5e4026',
    beam: '#4a3220',
    floor: '#7a5a3c',
    floorDark: '#5e4430',
    planks: true,
    rug: null,
  },
  corvin: {
    wall: '#cfd2c8',
    wallDark: '#b4b8ae',
    base: '#5f7472',
    beam: '#4c4a44',
    floor: '#8a7660',
    floorDark: '#6c5a48',
    planks: true,
    rug: '#4f6a78',
  },
  crest: {
    wall: '#ead8b2',
    wallDark: '#d4bf96',
    base: '#7a4a3a',
    beam: '#5a3626',
    floor: '#aaa292',
    floorDark: '#878072',
    planks: false,
    rug: '#c99a3c',
  },
  fold: {
    wall: '#bcab90',
    wallDark: '#9e8e74',
    base: '#7a6a52',
    beam: '#5c4c38',
    floor: '#8e7a5c',
    floorDark: '#6e5c44',
    planks: false,
    rug: null,
  },
};

const rect = (
  c: CanvasRenderingContext2D,
  col: string,
  x: number,
  y: number,
  w: number,
  h: number,
) => {
  c.fillStyle = col;
  c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
};

/** A small seeded hash for painted grain, so the rooms paint the same every time. */
function grain(i: number): number {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}

/** A window with its frame, sill and four panes; `night` panes are lamp-warm. */
function windowAt(
  c: CanvasRenderingContext2D,
  L: RoomLook,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  rect(c, L.beam, x - 3, y - 3, w + 6, h + 6);
  rect(c, '#a9cde0', x, y, w, h);
  rect(c, '#d6ecf4', x, y, w, h * 0.35);
  rect(c, L.beam, x + w / 2 - 1, y, 2, h);
  rect(c, L.beam, x, y + h / 2 - 1, w, 2);
  rect(c, '#e9dcc4', x - 5, y + h + 2, w + 10, 3);
}

/**
 * A wall card `w` world units across and `h` high: plaster or boards, a skirting band,
 * two posts, a top beam. `feature` paints the room's back-wall detail; otherwise a window.
 */
export function wallTexture(
  id: InteriorId,
  w: number,
  h: number,
  feature: boolean,
): CanvasTexture | null {
  const L = ROOM_LOOKS[id];
  const W = Math.round(w * IU);
  const H = Math.round(h * IU);
  const cv = canvas(W, H, (c) => {
    rect(c, L.wall, 0, 0, W, H);
    if (id === 'guardhouse') {
      // Boards, each a shade apart.
      for (let x = 0, i = 0; x < W; x += 12, i++) {
        rect(c, grain(i) > 0.5 ? L.wall : L.wallDark, x, 0, 12, H);
        rect(c, L.base, x, 0, 1, H);
      }
    } else {
      for (let i = 0; i < 90; i++)
        rect(c, L.wallDark, grain(i) * W, grain(i + 300) * H * 0.8, 2 + grain(i + 9) * 3, 1);
    }
    if (id === 'fold') {
      // Cracks and a patch of bare stone: the house is mended, not new.
      c.strokeStyle = L.base;
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(W * 0.7, 6);
      c.lineTo(W * 0.66, H * 0.3);
      c.lineTo(W * 0.72, H * 0.55);
      c.stroke();
      for (let i = 0; i < 10; i++)
        rect(
          c,
          i % 2 ? L.wallDark : '#8f846e',
          W * 0.12 + (i % 4) * 10,
          H * 0.3 + Math.floor(i / 4) * 7,
          9,
          6,
        );
    }
    rect(c, L.base, 0, H - 18, W, 18);
    rect(c, L.beam, 0, H - 19, W, 2);
    rect(c, L.beam, 0, 0, W, 6);
    rect(c, L.beam, 0, 0, 5, H);
    rect(c, L.beam, W - 5, 0, 5, H);
    if (!feature) {
      windowAt(c, L, W / 2 - 20, H * 0.25, 40, 34);
      return;
    }
    switch (id) {
      case 'kitchen': {
        windowAt(c, L, W * 0.47, H * 0.22, 44, 36);
        // The keepsake shelf, left: two boards of jars, a cup, and Hazel's tin.
        const sx = W * 0.12;
        for (const sy of [H * 0.3, H * 0.52]) {
          rect(c, L.beam, sx, sy, 70, 4);
          rect(c, L.beam, sx + 4, sy + 4, 3, 5);
          rect(c, L.beam, sx + 63, sy + 4, 3, 5);
        }
        const jars = ['#d8a24a', '#9fbf6a', '#c9604a', '#e6d7a8'];
        jars.forEach((j, i) => {
          rect(c, j, sx + 4 + i * 12, H * 0.3 - 12, 9, 12);
          rect(c, '#f4ead2', sx + 4 + i * 12, H * 0.3 - 14, 9, 3);
        });
        // The tin: round-shouldered, with a ribbon, the shelf's middle.
        rect(c, '#6a8aa8', sx + 18, H * 0.52 - 14, 22, 14);
        rect(c, '#8fb0c8', sx + 18, H * 0.52 - 16, 22, 3);
        rect(c, '#c94a4a', sx + 27, H * 0.52 - 16, 4, 16);
        rect(c, '#f2ecdc', sx + 46, H * 0.52 - 9, 9, 9);
        rect(c, '#f2ecdc', sx + 55, H * 0.52 - 7, 3, 4);
        // A string of drying herbs from the beam.
        for (let i = 0; i < 6; i++) rect(c, '#6f8f4a', W * 0.75 + i * 9, 6, 4, 10 + (i % 2) * 4);
        break;
      }
      case 'guardhouse': {
        // The three team banners, each with its own shape: Dawn's sun, Dusk's moon, Dew's drop.
        const banners: Array<[string, (x: number, y: number) => void]> = [
          [
            '#e0a83a',
            (x, y) => {
              c.fillStyle = '#fff2c8';
              c.beginPath();
              c.arc(x, y, 6, 0, Math.PI * 2);
              c.fill();
            },
          ],
          [
            '#6a4a8a',
            (x, y) => {
              c.fillStyle = '#e8e0f4';
              c.beginPath();
              c.arc(x, y, 6, 0, Math.PI * 2);
              c.fill();
              c.fillStyle = '#6a4a8a';
              c.beginPath();
              c.arc(x + 3, y - 2, 5, 0, Math.PI * 2);
              c.fill();
            },
          ],
          [
            '#3a7aa8',
            (x, y) => {
              c.fillStyle = '#dff0f8';
              c.beginPath();
              c.moveTo(x, y - 8);
              c.quadraticCurveTo(x + 7, y + 2, x, y + 6);
              c.quadraticCurveTo(x - 7, y + 2, x, y - 8);
              c.fill();
            },
          ],
        ];
        banners.forEach(([col, mark], i) => {
          const bx = W * 0.5 + i * 28;
          rect(c, L.beam, bx - 2, 12, 24, 3);
          rect(c, col, bx, 15, 20, 38);
          c.fillStyle = col;
          c.beginPath();
          c.moveTo(bx, 53);
          c.lineTo(bx + 10, 46);
          c.lineTo(bx + 20, 53);
          c.fill();
          mark(bx + 10, 30);
        });
        // A notice board with pinned slips, left.
        rect(c, '#5a3e26', W * 0.1, H * 0.22, 54, 38);
        rect(c, '#c8a878', W * 0.1 + 3, H * 0.22 + 3, 48, 32);
        for (let i = 0; i < 5; i++)
          rect(
            c,
            '#f4ecd8',
            W * 0.1 + 6 + (i % 3) * 15,
            H * 0.22 + 6 + Math.floor(i / 3) * 14,
            12,
            10,
          );
        break;
      }
      case 'corvin': {
        windowAt(c, L, W * 0.14, H * 0.24, 38, 34);
        // Shelves of seed tins, row on row, every label squared.
        for (let r = 0; r < 4; r++) {
          const sy = H * 0.18 + r * 17;
          rect(c, L.beam, W * 0.52, sy + 12, 96, 3);
          for (let i = 0; i < 8; i++) {
            rect(
              c,
              ['#8a9aa0', '#a0947a', '#7a8a6a'][(i + r) % 3]!,
              W * 0.52 + 3 + i * 12,
              sy,
              9,
              12,
            );
            rect(c, '#efe8d8', W * 0.52 + 4 + i * 12, sy + 4, 7, 4);
          }
        }
        break;
      }
      case 'crest': {
        windowAt(c, L, W * 0.12, H * 0.24, 38, 34);
        windowAt(c, L, W * 0.78, H * 0.24, 38, 34);
        // The house's crest over the hearth: a shield with a half sun.
        const cx = W * 0.5;
        const cy = H * 0.3;
        c.fillStyle = '#7a4a3a';
        c.beginPath();
        c.moveTo(cx - 16, cy - 16);
        c.lineTo(cx + 16, cy - 16);
        c.lineTo(cx + 16, cy + 4);
        c.lineTo(cx, cy + 18);
        c.lineTo(cx - 16, cy + 4);
        c.closePath();
        c.fill();
        c.fillStyle = '#e8c45a';
        c.beginPath();
        c.arc(cx, cy, 8, Math.PI, 0);
        c.fill();
        for (let i = 0; i < 5; i++) {
          const a = Math.PI + (i + 0.5) * (Math.PI / 5);
          rect(c, '#e8c45a', cx + Math.cos(a) * 12 - 1, cy + Math.sin(a) * 12 - 1, 3, 3);
        }
        break;
      }
      case 'fold': {
        // The patched window: one pane boarded.
        windowAt(c, L, W * 0.62, H * 0.26, 38, 32);
        rect(c, '#7a6248', W * 0.62 + 19, H * 0.26 + 16, 19, 16);
        // Pegs with a coat and a coil of rope.
        for (let i = 0; i < 3; i++) rect(c, L.beam, W * 0.32 + i * 14, H * 0.3, 3, 4);
        rect(c, '#6a7a5a', W * 0.32 - 3, H * 0.3 + 4, 10, 22);
        c.strokeStyle = '#c8b07a';
        c.lineWidth = 2;
        c.beginPath();
        c.arc(W * 0.32 + 28, H * 0.3 + 12, 6, 0, Math.PI * 2);
        c.stroke();
        break;
      }
    }
  });
  return cv ? tex(cv) : null;
}

/** The floor card `w` × `d` world units: planks or flagstones, the rug in the middle. */
export function floorTexture(id: InteriorId, w: number, d: number): CanvasTexture | null {
  const L = ROOM_LOOKS[id];
  const W = Math.round(w * IU);
  const D = Math.round(d * IU);
  const cv = canvas(W, D, (c) => {
    rect(c, L.floor, 0, 0, W, D);
    if (L.planks) {
      for (let y = 0, i = 0; y < D; y += 10, i++) {
        rect(c, L.floorDark, 0, y, W, 1);
        const off = grain(i) * 60;
        for (let x = off; x < W; x += 60) rect(c, L.floorDark, x, y, 1, 10);
        for (let k = 0; k < 6; k++) rect(c, L.floorDark, grain(i * 7 + k) * W, y + 4, 4, 1);
      }
    } else {
      for (let y = 0, r = 0; y < D; y += 16, r++)
        for (let x = (r % 2) * 10, i = 0; x < W; x += 20, i++) {
          rect(c, grain(r * 31 + i) > 0.5 ? L.floor : L.floorDark, x + 1, y + 1, 18, 14);
        }
    }
    if (L.rug) {
      const rw = W * 0.42;
      const rd = D * 0.36;
      const rx = W * 0.32;
      const ry = D * 0.42;
      rect(c, L.rug, rx, ry, rw, rd);
      c.strokeStyle = '#f2e6c8';
      c.lineWidth = 2;
      c.strokeRect(rx + 5, ry + 5, rw - 10, rd - 10);
      for (let x = rx; x < rx + rw; x += 4) {
        rect(c, '#f2e6c8', x, ry - 3, 2, 3);
        rect(c, '#f2e6c8', x, ry + rd, 2, 3);
      }
    }
    if (id === 'fold') {
      // The patch of light under the hole, and the damp ring round it.
      c.fillStyle = 'rgba(255, 240, 200, 0.55)';
      c.beginPath();
      c.ellipse(W * 0.55, D * 0.42, 34, 22, 0, 0, Math.PI * 2);
      c.fill();
    }
  });
  return cv ? tex(cv) : null;
}

/** The furniture billboards (32 px a unit), one sheet for every room. */
export function furnitureSheet(): SpriteSheet | null {
  const list: Array<[string, number, number, Paint]> = [
    ['table', 52, 30, table],
    ['stool', 16, 16, stool],
    ['stove', 34, 46, stove],
    ['counter', 120, 34, counter],
    ['chair', 26, 38, chair],
    ['bed', 64, 22, bed],
    ['bucket', 16, 16, bucket],
    ['kettle', 16, 14, kettle],
    ['hearth', 60, 52, hearth],
    ['bench', 60, 20, bench],
    ['lamp', 12, 22, lamp],
    ['shaft', 48, 100, shaft],
  ];
  const SW = 256;
  let x = 0;
  let y = 0;
  let rowH = 0;
  const map: Record<string, [number, number, number, number]> = {};
  const spots: Array<[number, number, Paint, number, number]> = [];
  for (const [key, w, h, p] of list) {
    if (x + w > SW) {
      x = 0;
      y += rowH + 1;
      rowH = 0;
    }
    map[key] = [x, y, w, h];
    spots.push([x, y, p, w, h]);
    x += w + 1;
    rowH = Math.max(rowH, h);
  }
  const cv = canvas(SW, y + rowH, (c) => {
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
  return cv ? sheetFromImage(cv, map, 16, 16) : null;
}

const OUT = '#3a2618';

function table(c: CanvasRenderingContext2D): void {
  rect(c, OUT, 0, 6, 52, 8);
  rect(c, '#a8784a', 1, 7, 50, 6);
  rect(c, '#c49a68', 1, 7, 50, 2);
  rect(c, OUT, 4, 13, 5, 17);
  rect(c, OUT, 43, 13, 5, 17);
  rect(c, '#8a5e36', 5, 13, 3, 17);
  rect(c, '#8a5e36', 44, 13, 3, 17);
  // A cup and a loaf on top.
  rect(c, '#f2ecdc', 12, 1, 7, 6);
  rect(c, '#c88a48', 30, 2, 12, 5);
}

function stool(c: CanvasRenderingContext2D): void {
  rect(c, OUT, 1, 3, 14, 5);
  rect(c, '#b08050', 2, 4, 12, 3);
  rect(c, OUT, 3, 8, 3, 8);
  rect(c, OUT, 10, 8, 3, 8);
}

function stove(c: CanvasRenderingContext2D): void {
  rect(c, OUT, 12, 0, 8, 14);
  rect(c, '#4a4a4e', 13, 0, 6, 14);
  rect(c, OUT, 0, 14, 34, 32);
  rect(c, '#55555c', 1, 15, 32, 30);
  rect(c, '#6a6a72', 1, 15, 32, 4);
  // The fire door: a bright grate.
  rect(c, '#2a2020', 9, 26, 16, 12);
  rect(c, '#f0a040', 11, 30, 12, 7);
  rect(c, '#ffe08a', 14, 32, 6, 4);
}

function counter(c: CanvasRenderingContext2D): void {
  rect(c, OUT, 0, 4, 120, 30);
  rect(c, '#7a5232', 1, 9, 118, 24);
  rect(c, '#a8784a', 1, 5, 118, 5);
  for (let x = 14; x < 118; x += 22) rect(c, '#5e4026', x, 11, 2, 22);
  // The ledger, open, and an ink pot.
  rect(c, '#f4ecd8', 40, 0, 26, 6);
  rect(c, '#3a2a1a', 52, 0, 2, 6);
  rect(c, '#2a2a3a', 76, 0, 6, 5);
}

function chair(c: CanvasRenderingContext2D): void {
  rect(c, OUT, 3, 0, 20, 22);
  rect(c, '#8a6040', 4, 1, 18, 20);
  rect(c, '#a87a50', 6, 3, 14, 4);
  rect(c, OUT, 1, 20, 24, 6);
  rect(c, '#a87a50', 2, 21, 22, 4);
  rect(c, OUT, 3, 26, 3, 12);
  rect(c, OUT, 20, 26, 3, 12);
}

function bed(c: CanvasRenderingContext2D): void {
  rect(c, OUT, 0, 6, 64, 16);
  rect(c, '#8a7a5a', 1, 7, 62, 14);
  rect(c, '#c8b88a', 1, 7, 62, 6);
  rect(c, '#e8e0c8', 3, 4, 14, 8);
  rect(c, '#6a7a8a', 22, 8, 40, 10);
}

function bucket(c: CanvasRenderingContext2D): void {
  rect(c, OUT, 2, 4, 12, 12);
  rect(c, '#8a8a90', 3, 5, 10, 10);
  rect(c, '#6a8aa8', 3, 5, 10, 2);
  rect(c, OUT, 3, 1, 10, 1);
}

function kettle(c: CanvasRenderingContext2D): void {
  rect(c, OUT, 2, 4, 12, 10);
  rect(c, '#5a5a62', 3, 5, 10, 8);
  rect(c, OUT, 13, 6, 3, 2);
  rect(c, OUT, 5, 1, 6, 2);
}

function hearth(c: CanvasRenderingContext2D): void {
  rect(c, OUT, 0, 0, 60, 52);
  for (let r = 0; r < 6; r++)
    for (let i = 0; i < 6; i++)
      rect(c, (r + i) % 2 ? '#a59c8c' : '#8f877a', 1 + i * 10 - (r % 2) * 5, 1 + r * 8, 9, 7);
  rect(c, '#5a3626', 0, 8, 60, 4);
  rect(c, '#1e1612', 14, 22, 32, 30);
  rect(c, '#f0a040', 18, 40, 24, 10);
  rect(c, '#ffe08a', 24, 43, 12, 6);
}

function bench(c: CanvasRenderingContext2D): void {
  rect(c, OUT, 0, 3, 60, 6);
  rect(c, '#9a6a3e', 1, 4, 58, 4);
  rect(c, OUT, 4, 9, 4, 11);
  rect(c, OUT, 52, 9, 4, 11);
}

function lamp(c: CanvasRenderingContext2D): void {
  rect(c, OUT, 2, 4, 8, 14);
  rect(c, '#ffd27a', 3, 6, 6, 10);
  rect(c, '#fff2c0', 4, 8, 4, 5);
  rect(c, OUT, 5, 0, 2, 4);
  rect(c, OUT, 1, 18, 10, 4);
}

/** The light falling through the Fold's roof: soft, still, no flicker. */
function shaft(c: CanvasRenderingContext2D): void {
  const g = c.createLinearGradient(0, 0, 0, 100);
  g.addColorStop(0, 'rgba(255, 244, 210, 0.55)');
  g.addColorStop(1, 'rgba(255, 244, 210, 0.08)');
  c.fillStyle = g;
  c.beginPath();
  c.moveTo(16, 0);
  c.lineTo(32, 0);
  c.lineTo(48, 100);
  c.lineTo(0, 100);
  c.closePath();
  c.fill();
}
