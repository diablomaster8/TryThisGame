import type { BuntingShape } from '../config/campaign-look';
import { TITLE_CARD_TEXT } from '../config/strings';
import type { FrameRect, SpriteSheet } from './sprites/atlas';
import { sheetFromImage } from './sprites/atlas';

/**
 * Campaign graphics package f, pixel renderer: the painted sprites of the story sets, drawn
 * in code onto one small canvas (32 canvas pixels to a world unit, hard-edged like the
 * Grove's own art) and handed to the sprite batch as one sheet. `dress-f.ts` places them.
 */

export const SHAPES: readonly BuntingShape[] = ['star', 'leaf', 'moon'];
export const BUNTING_INK = ['#ffd166', '#ff8fa3', '#fff1c9', '#9be07c'] as const;

/** Canvas pixels per world unit in this sheet. */
export const U = 32;

interface Frame {
  key: string;
  w: number;
  h: number;
  /** Soft frames keep their antialiased edges (glows, the holo panel). */
  soft?: boolean;
  draw: (c: CanvasRenderingContext2D) => void;
}

const rect = (
  c: CanvasRenderingContext2D,
  col: string,
  x: number,
  y: number,
  w: number,
  h: number,
) => {
  c.fillStyle = col;
  c.fillRect(x, y, w, h);
};

function poly(c: CanvasRenderingContext2D, col: string, pts: Array<[number, number]>): void {
  c.fillStyle = col;
  c.beginPath();
  pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y)));
  c.closePath();
  c.fill();
}

function disc(c: CanvasRenderingContext2D, col: string, x: number, y: number, r: number): void {
  c.fillStyle = col;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fill();
}

function pennant(c: CanvasRenderingContext2D, shape: BuntingShape, col: string): void {
  rect(c, '#5a4630', 0, 0, 16, 2);
  c.fillStyle = col;
  if (shape === 'star') {
    c.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const r = i % 2 ? 2.8 : 7;
      const x = 8 + Math.cos(a) * r;
      const y = 9.2 + Math.sin(a) * r;
      if (i) c.lineTo(x, y);
      else c.moveTo(x, y);
    }
    c.fill();
  } else if (shape === 'leaf') {
    c.beginPath();
    c.moveTo(8, 2);
    c.bezierCurveTo(14, 5, 13, 12, 8, 15.5);
    c.bezierCurveTo(3, 12, 2, 5, 8, 2);
    c.fill();
    rect(c, '#5d8a3c', 7.5, 4, 1, 9);
  } else {
    disc(c, col, 8, 9, 6.4);
    c.globalCompositeOperation = 'destination-out';
    disc(c, '#000', 11, 7.4, 5.4);
    c.globalCompositeOperation = 'source-over';
  }
}

function emblem(
  c: CanvasRenderingContext2D,
  kind: 'sun' | 'moon' | 'drop',
  x: number,
  y: number,
): void {
  const ink = '#fff1c9';
  if (kind === 'sun') {
    disc(c, ink, x, y, 4);
    c.strokeStyle = ink;
    c.lineWidth = 1.4;
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      c.beginPath();
      c.moveTo(x + Math.cos(a) * 5.6, y + Math.sin(a) * 5.6);
      c.lineTo(x + Math.cos(a) * 8, y + Math.sin(a) * 8);
      c.stroke();
    }
  } else if (kind === 'moon') {
    disc(c, ink, x, y, 7);
    disc(c, '#4f4aa8', x + 3.6, y - 1.6, 6);
  } else {
    c.fillStyle = ink;
    c.beginPath();
    c.moveTo(x, y - 8);
    c.bezierCurveTo(x + 7, y, x + 6, y + 7, x, y + 7);
    c.bezierCurveTo(x - 6, y + 7, x - 7, y, x, y - 8);
    c.fill();
  }
}

const CLOTH = { sun: '#d9534f', moon: '#4f4aa8', drop: '#2f8f9d' } as const;

function frames(): Frame[] {
  const f: Frame[] = [];
  for (const s of SHAPES)
    BUNTING_INK.forEach((col, i) =>
      f.push({ key: `pennant-${s}-${i}`, w: 16, h: 16, draw: (c) => pennant(c, s, col) }),
    );
  // The guard house: planks, a stone footing, a pitched roof and three team banners.
  f.push({
    key: 'cabin',
    w: 116,
    h: 104,
    draw: (c) => {
      rect(c, '#8d8a84', 4, 94, 108, 10);
      rect(c, '#c49a68', 8, 38, 100, 58);
      for (let x = 14; x < 108; x += 12) rect(c, '#a8784a', x, 38, 1, 58);
      rect(c, '#7a5434', 8, 38, 4, 58);
      rect(c, '#7a5434', 104, 38, 4, 58);
      poly(c, '#b25a3c', [
        [0, 42],
        [58, 4],
        [116, 42],
      ]);
      poly(c, '#8f4630', [
        [0, 42],
        [58, 10],
        [116, 42],
        [116, 46],
        [0, 46],
      ]);
      rect(c, '#6a4426', 48, 72, 20, 24);
      rect(c, '#e0c28a', 64, 84, 2, 2);
      (['sun', 'drop', 'moon'] as const).forEach((k, i) => {
        const x = 16 + i * 34;
        rect(c, '#5a3c28', x - 2, 44, 24, 2);
        rect(c, CLOTH[k], x, 46, 20, 24);
        poly(c, CLOTH[k], [
          [x, 70],
          [x + 10, 66],
          [x + 20, 70],
        ]);
        emblem(c, k, x + 10, 57);
      });
    },
  });
  f.push({
    key: 'cart',
    w: 88,
    h: 60,
    draw: (c) => {
      rect(c, '#8a5c34', 8, 30, 60, 10);
      rect(c, '#6a4426', 66, 36, 20, 3);
      rect(c, '#6a4426', 66, 30, 20, 3);
      disc(c, '#5a3c28', 22, 46, 10);
      disc(c, '#8a5c34', 22, 46, 4);
      disc(c, '#5a3c28', 54, 46, 10);
      disc(c, '#8a5c34', 54, 46, 4);
      // The tarp over a humped load, drooping at the sides.
      c.fillStyle = '#7d8f68';
      c.beginPath();
      c.moveTo(4, 36);
      c.quadraticCurveTo(12, 6, 38, 6);
      c.quadraticCurveTo(64, 6, 72, 36);
      c.lineTo(66, 40);
      c.lineTo(6, 40);
      c.closePath();
      c.fill();
      c.fillStyle = '#65764f';
      c.beginPath();
      c.moveTo(38, 6);
      c.quadraticCurveTo(64, 6, 72, 36);
      c.lineTo(60, 38);
      c.quadraticCurveTo(54, 14, 38, 8);
      c.fill();
      rect(c, '#9aab82', 22, 14, 8, 2);
    },
  });
  f.push({
    key: 'machine',
    w: 56,
    h: 112,
    draw: (c) => {
      rect(c, '#7a5434', 8, 96, 40, 14);
      rect(c, '#a8784a', 18, 40, 20, 58);
      for (let y = 46; y < 96; y += 8) rect(c, '#8a6038', 18, y, 20, 1);
      rect(c, '#9aa4ad', 40, 20, 5, 82);
      rect(c, '#b08a58', 11, 28, 4, 72);
      rect(c, '#9aa4ad', 24, 22, 20, 4);
      disc(c, '#c9d2da', 42, 16, 5);
      poly(c, '#6f7d8a', [
        [10, 40],
        [46, 40],
        [34, 52],
        [22, 52],
      ]);
      rect(c, '#5a3c28', 27, 14, 2, 28);
    },
  });
  for (let i = 0; i < 4; i++)
    f.push({
      key: `vane-${i}`,
      w: 40,
      h: 16,
      draw: (c) => {
        const a = (i * Math.PI) / 4;
        const L = Math.cos(a) * 17;
        c.strokeStyle = '#5a3c28';
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(20 - L, 8 + Math.sin(a) * 2);
        c.lineTo(20 + L, 8 - Math.sin(a) * 2);
        c.stroke();
        disc(c, '#e0556a', 20 + L, 8 - Math.sin(a) * 2, 3.2);
        disc(c, '#f2d34c', 20 - L, 8 + Math.sin(a) * 2, 3.2);
        disc(c, '#5a3c28', 20, 8, 2);
      },
    });
  f.push({
    key: 'cloth',
    w: 104,
    h: 84,
    draw: (c) => {
      rect(c, '#f6efe2', 0, 0, 104, 84);
      for (let x = 0; x < 104; x += 16) rect(c, 'rgba(200,50,70,0.62)', x, 0, 8, 84);
      for (let y = 0; y < 84; y += 16) rect(c, 'rgba(200,50,70,0.62)', 0, y, 104, 8);
    },
  });
  f.push({
    key: 'cake',
    w: 56,
    h: 38,
    draw: (c) => {
      rect(c, '#f4e3c0', 4, 20, 36, 14);
      rect(c, '#ffe6a8', 4, 18, 36, 4);
      poly(c, '#f0d6a8', [
        [24, 6],
        [48, 10],
        [46, 22],
        [24, 20],
      ]);
      poly(c, '#ffe6a8', [
        [24, 6],
        [48, 10],
        [47, 13],
        [24, 9],
      ]);
      rect(c, '#fff7d8', 12, 24, 2, 2);
      rect(c, '#fff7d8', 28, 27, 2, 2);
    },
  });
  f.push({
    key: 'tray',
    w: 40,
    h: 26,
    draw: (c) => {
      rect(c, '#8a6038', 2, 18, 36, 4);
      for (const [x, y] of [
        [8, 12],
        [18, 9],
        [28, 12],
        [13, 16],
        [24, 16],
      ] as const)
        disc(c, '#e8b46a', x, y, 4.6);
      for (const [x, y] of [
        [8, 11],
        [18, 8],
        [28, 11],
      ] as const)
        rect(c, '#f6d79a', x - 2, y - 2, 2, 1);
    },
  });
  f.push({
    key: 'basket',
    w: 34,
    h: 30,
    draw: (c) => {
      rect(c, '#b98a50', 4, 14, 26, 14);
      for (let x = 6; x < 30; x += 4) rect(c, '#9a6e3a', x, 14, 1, 14);
      c.strokeStyle = '#8a6038';
      c.lineWidth = 2;
      c.beginPath();
      c.arc(17, 14, 11, Math.PI, 0);
      c.stroke();
      disc(c, '#d94a4a', 11, 12, 3.4);
      disc(c, '#f2a93b', 22, 12, 3.4);
    },
  });
  f.push({
    key: 'board',
    w: 80,
    h: 100,
    draw: (c) => {
      rect(c, '#3a4a5a', 10, 50, 5, 50);
      rect(c, '#3a4a5a', 65, 50, 5, 50);
      rect(c, '#04141f', 2, 2, 76, 52);
      c.strokeStyle = '#52e6ff';
      c.lineWidth = 2;
      c.strokeRect(3, 3, 74, 50);
      c.fillStyle = '#52e6ff';
      c.font = 'bold 9px monospace';
      c.textBaseline = 'top';
      c.fillText(TITLE_CARD_TEXT.scoreboard.title, 28, 7);
      TITLE_CARD_TEXT.scoreboard.rows.forEach((r, i) => {
        c.fillStyle = i === 1 ? '#ffe27a' : '#9fe9ff';
        c.fillText(r, 14, 19 + i * 8);
      });
    },
  });
  f.push({
    key: 'holo',
    w: 32,
    h: 48,
    soft: true,
    draw: (c) => {
      for (let y = 0; y < 48; y += 3) rect(c, 'rgba(90,255,170,0.20)', 0, y, 32, 1);
      c.strokeStyle = 'rgba(120,255,190,0.85)';
      c.lineWidth = 1;
      for (let x = 0; x <= 32; x += 8) {
        c.beginPath();
        c.moveTo(x + 0.5, 0);
        c.lineTo(x + 0.5, 48);
        c.stroke();
      }
      for (let y = 0; y <= 48; y += 12) {
        c.beginPath();
        c.moveTo(0, y + 0.5);
        c.lineTo(32, y + 0.5);
        c.stroke();
      }
    },
  });
  f.push({ key: 'root-floor', w: 192, h: 192, draw: (c) => disc(c, '#f4f5fb', 96, 96, 95) });
  f.push({
    key: 'chair',
    w: 26,
    h: 34,
    draw: (c) => {
      rect(c, '#6a4426', 5, 4, 3, 28);
      rect(c, '#6a4426', 18, 4, 3, 28);
      rect(c, '#8a5c34', 5, 4, 16, 3);
      rect(c, '#8a5c34', 5, 12, 16, 3);
      rect(c, '#a8784a', 4, 18, 18, 4);
      rect(c, '#6a4426', 5, 22, 3, 10);
      rect(c, '#6a4426', 18, 22, 3, 10);
    },
  });
  f.push({
    key: 'plum',
    w: 8,
    h: 8,
    draw: (c) => {
      disc(c, '#6a2f86', 4, 4, 3.4);
      rect(c, '#b07fcf', 2, 2, 2, 1);
    },
  });
  f.push({
    key: 'wasp',
    w: 8,
    h: 8,
    draw: (c) => {
      disc(c, '#ffd23a', 4, 4, 2.6);
      rect(c, '#2a1a08', 3, 3, 1, 3);
      rect(c, '#2a1a08', 5, 3, 1, 3);
      rect(c, '#e8f0ff', 1, 1, 2, 2);
    },
  });
  f.push({
    key: 'glow',
    w: 16,
    h: 16,
    soft: true,
    draw: (c) => {
      const g = c.createRadialGradient(8, 8, 0, 8, 8, 8);
      g.addColorStop(0, 'rgba(255,240,170,1)');
      g.addColorStop(0.35, 'rgba(255,224,138,0.55)');
      g.addColorStop(1, 'rgba(255,224,138,0)');
      c.fillStyle = g;
      c.fillRect(0, 0, 16, 16);
    },
  });
  return f;
}

/** Make hard edges: every pixel is wholly drawn or wholly clear. */
function harden(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  const d = c.getImageData(x, y, w, h);
  for (let i = 3; i < d.data.length; i += 4) d.data[i] = d.data[i]! > 110 ? 255 : 0;
  c.putImageData(d, x, y);
}

export interface FArt {
  sheet: SpriteSheet;
  frame(key: string): FrameRect;
}

/** Paint every frame onto one canvas and wrap it as a sprite sheet. Needs a DOM. */
export function buildFArt(): FArt | null {
  if (typeof document === 'undefined') return null;
  const list = frames();
  const W = 512;
  let x = 0;
  let y = 0;
  let rowH = 0;
  const placed: Array<{ f: Frame; x: number; y: number }> = [];
  for (const f of list) {
    if (x + f.w > W) {
      x = 0;
      y += rowH + 1;
      rowH = 0;
    }
    placed.push({ f, x, y });
    x += f.w + 1;
    rowH = Math.max(rowH, f.h);
  }
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = y + rowH;
  const c = cv.getContext('2d', { willReadFrequently: true });
  if (!c) return null;
  const map: Record<string, [number, number, number, number]> = {};
  for (const p of placed) {
    c.save();
    c.beginPath();
    c.rect(p.x, p.y, p.f.w, p.f.h);
    c.clip();
    c.translate(p.x, p.y);
    p.f.draw(c);
    c.restore();
    if (!p.f.soft) harden(c, p.x, p.y, p.f.w, p.f.h);
    map[p.f.key] = [p.x, p.y, p.f.w, p.f.h];
  }
  const sheet = sheetFromImage(cv, map, 16, 16);
  return {
    sheet,
    frame: (key) => {
      const r = sheet.frames.get(key);
      if (!r) throw new Error(`dress-f art: no frame ${key}`);
      return r;
    },
  };
}
