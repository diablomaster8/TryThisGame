import { KEEPSAKE_LOOKS, SHELF_CAP, type KeepsakeShape } from '../../config/keepsake-looks';
import { frameKey } from '../sprites/animations';
import type { SpriteSheet } from '../sprites/atlas';
import { RasterAtlas } from './atlas';
import { hex, mix, Raster, rimObjects, shade, type RGB } from './raster';

/**
 * Painted pixel-view sprites for package d's dressing (campaign graphics H11, M1, M2, M7,
 * M12, M17, N4): the kettle and cup on the step, the signpost and its letter, the eggshell
 * shelf, the message board, the shrine and bell, the story items, and the keepsake shelf.
 * Painted at 32 texels per world unit, the sprite batch's native scale, so a frame's width
 * in texels is its width on the ground in units. See `dress-d-rules.ts` for what stands.
 */
const WOOD = hex('#9a6a3e');
const DARK = hex('#5a3a22');
const STONE = hex('#b9b4aa');
const CREAM = hex('#f3ead2');
const IRON = hex('#4a4f58');
const BRASS = hex('#c8a24e');
const WHITE = hex('#ffffff');

function begin(w: number, h: number): Raster {
  const r = new Raster(w, h, null);
  r.tracking = true;
  return r;
}

function fin(r: Raster): Raster {
  r.tracking = false;
  rimObjects(r);
  return r;
}

/** A lit block: bright top edge, dark base and right edge. */
function slab(r: Raster, x: number, y: number, w: number, h: number, c: RGB): void {
  r.rect(x, y, w, h, c);
  r.rect(x, y, w, 1, mix(c, WHITE, 0.3));
  r.rect(x, y + h - 1, w, 1, shade(c, 0.7));
  r.rect(x + w - 1, y, 1, h, shade(c, 0.8));
}

function kettle(): Raster {
  const r = begin(18, 15);
  r.line(3, 7, 9, 1, hex('#2f333a'));
  r.line(15, 7, 9, 1, hex('#2f333a'));
  r.tri(13, 9, 17, 4, 15, 11, IRON);
  r.ellipse(8, 9, 6, 4.5, IRON);
  r.ellipse(6, 7.5, 2.4, 1.4, mix(IRON, WHITE, 0.4));
  r.ellipse(8, 5, 3.6, 1.4, shade(IRON, 1.2));
  r.disc(8, 3.6, 1.1, BRASS);
  return fin(r);
}

function cup(): Raster {
  const r = begin(14, 9);
  slab(r, 3, 1, 8, 7, hex('#e8e0d0'));
  r.rect(3, 5, 8, 1, hex('#7a9ac0'));
  r.rect(12, 3, 1, 3, hex('#e8e0d0'));
  r.rect(11, 2, 2, 1, hex('#e8e0d0'));
  r.rect(11, 6, 2, 1, hex('#e8e0d0'));
  return fin(r);
}

function teacup(): Raster {
  const r = begin(16, 12);
  r.ellipse(8, 10, 7, 1.6, hex('#e8e0d0'));
  slab(r, 4, 3, 8, 6, hex('#e8e0d0'));
  r.rect(4, 3, 8, 1, hex('#7a4a2a'));
  r.rect(13, 5, 1, 3, hex('#e8e0d0'));
  r.rect(12, 4, 2, 1, hex('#e8e0d0'));
  r.rect(12, 8, 2, 1, hex('#e8e0d0'));
  return fin(r);
}

function pie(): Raster {
  const r = begin(22, 12);
  r.ellipse(11, 8, 10, 3.4, hex('#c9b48a'));
  r.ellipse(11, 6, 9, 4.4, hex('#d9a45a'));
  r.ellipse(8, 4.5, 3.5, 1.4, hex('#f0c880'));
  for (let i = -2; i <= 2; i++) {
    r.line(11 + i * 3 - 3, 3, 11 + i * 3 + 3, 9, hex('#b9803c'));
    r.line(11 + i * 3 + 3, 3, 11 + i * 3 - 3, 9, hex('#b9803c'));
  }
  return fin(r);
}

function notebook(): Raster {
  const r = begin(14, 10);
  slab(r, 1, 2, 12, 7, hex('#6a3a2a'));
  r.rect(2, 3, 10, 5, CREAM);
  r.rect(3, 4, 6, 1, hex('#8a7a62'));
  r.rect(3, 6, 5, 1, hex('#8a7a62'));
  r.rect(11, 2, 1, 7, hex('#b04a3a'));
  return fin(r);
}

function tin(): Raster {
  const r = begin(18, 16);
  r.tri(6, 5, 7, 0, 8, 5, hex('#bfe8ff'));
  r.tri(9, 5, 11, 1, 12, 5, hex('#dff4ff'));
  r.tri(12, 5, 14, 2, 15, 6, hex('#bfe8ff'));
  slab(r, 2, 6, 14, 9, hex('#8a8f98'));
  slab(r, 1, 4, 15, 3, hex('#6a6f78'));
  return fin(r);
}

function visor(): Raster {
  const r = begin(18, 12);
  slab(r, 1, 9, 16, 3, hex('#7a7a86'));
  slab(r, 2, 2, 14, 7, hex('#2a2f45'));
  r.rect(3, 4, 12, 3, hex('#6ae0ff'));
  r.rect(4, 4, 6, 1, hex('#d6f6ff'));
  return fin(r);
}

function lever(): Raster {
  const r = begin(18, 28);
  slab(r, 2, 22, 14, 6, hex('#7a766c'));
  r.line(7, 22, 13, 6, IRON);
  r.line(8, 22, 14, 6, shade(IRON, 1.3));
  r.disc(13, 5, 3.4, hex('#c84a3a'));
  r.set(12, 4, hex('#f08a7a'));
  return fin(r);
}

function lens(): Raster {
  const r = begin(18, 11);
  r.ellipse(9, 6.5, 8, 3.6, BRASS);
  r.ellipse(9, 6, 6.2, 2.6, hex('#9fd6ea'));
  r.ellipse(7, 5, 2.4, 1, hex('#e0f6ff'));
  r.line(4, 7, 13, 4, hex('#2f333a'));
  r.line(8, 5, 11, 8, hex('#2f333a'));
  return fin(r);
}

function porchLight(lit: boolean): Raster {
  const r = begin(18, 38);
  slab(r, 5, 8, 3, 30, WOOD);
  r.rect(5, 6, 11, 2, DARK);
  r.rect(15, 8, 1, 2, DARK);
  slab(r, 11, 9, 6, 8, lit ? hex('#ffe08a') : hex('#c8c0a8'));
  if (lit) r.rect(12, 10, 3, 3, hex('#fffbe0'));
  r.tri(10, 9, 18, 9, 14, 5, DARK);
  return fin(r);
}

function eggShelf(): Raster {
  const r = begin(32, 20);
  slab(r, 1, 13, 30, 3, WOOD);
  r.tri(4, 16, 9, 16, 4, 20, DARK);
  r.tri(23, 16, 28, 16, 28, 20, DARK);
  const shells = ['#f4efe2', '#d9e6ee', '#efe1c8', '#e8e4d8', '#cfe0d6'];
  for (let i = 0; i < 5; i++) {
    const x = 5 + i * 5.5;
    r.ellipse(x, 10, 2.4, 3, hex(shells[i]!));
    r.ellipse(x - 0.8, 8.5, 0.9, 1.2, WHITE);
    r.rect(Math.round(x) - 1, 13, 3, 2, CREAM);
  }
  return fin(r);
}

function signpost(letter: boolean): Raster {
  const r = begin(34, 46);
  slab(r, 15, 8, 4, 36, WOOD);
  slab(r, 4, 7, 26, 10, hex('#c9944a'));
  r.rect(8, 10, 12, 1, hex('#5a3a1f'));
  r.rect(8, 13, 16, 1, hex('#5a3a1f'));
  r.tri(30, 7, 33, 12, 30, 17, hex('#c9944a'));
  r.ellipse(17, 44, 9, 2.6, hex('#a8a398'));
  if (letter) {
    slab(r, 19, 30, 13, 2, DARK);
    r.rect(20, 26, 10, 4, CREAM);
    r.rect(21, 27, 5, 1, hex('#8a7a62'));
    r.disc(28, 28, 1.2, hex('#b04a3a'));
    r.ellipse(26, 25, 3, 2, hex('#9a968c'));
    r.ellipse(25, 24.4, 1.2, 0.7, hex('#cfcac0'));
  }
  return fin(r);
}

function board(n: number): Raster {
  const r = begin(58, 62);
  for (const x of [3, 51]) slab(r, x, 8, 4, 54, DARK);
  slab(r, 1, 6, 56, 5, DARK);
  slab(r, 5, 16, 48, 36, WOOD);
  r.rect(7, 18, 44, 32, hex('#c9a46a'));
  for (let i = 0; i < n; i++) {
    const x = 10 + (i % 3) * 14;
    const y = 21 + Math.floor(i / 3) * 14;
    slab(r, x, y, 11, 12, CREAM);
    r.rect(x + 2, y + 4, 7, 1, hex('#8a7a62'));
    r.rect(x + 2, y + 7, 5, 1, hex('#8a7a62'));
    r.disc(x + 5, y + 1, 1.2, hex('#c84a3a'));
  }
  return fin(r);
}

function shrine(lit: boolean): Raster {
  const r = begin(34, 48);
  slab(r, 2, 40, 30, 8, STONE);
  slab(r, 6, 34, 22, 7, hex('#a8a398'));
  slab(r, 14, 20, 6, 15, hex('#a8a398'));
  slab(r, 9, 10, 16, 11, lit ? hex('#ffd070') : hex('#9a9a88'));
  if (lit) r.rect(12, 13, 10, 5, hex('#fff3c0'));
  for (const x of [9, 24]) r.rect(x, 10, 1, 11, DARK);
  r.tri(4, 11, 30, 11, 17, 1, hex('#7a766c'));
  return fin(r);
}

function bell(fresh: boolean): Raster {
  const r = begin(42, 54);
  for (const x of [3, 35]) slab(r, x, 6, 4, 46, DARK);
  slab(r, 1, 4, 40, 5, WOOD);
  r.rect(20, 9, 2, 5, hex('#3a3a42'));
  for (let y = 0; y < 17; y++) {
    const w = 4 + (y / 16) * 7;
    r.rect(Math.round(21 - w), 13 + y, Math.round(w * 2), 1, mix(BRASS, shade(BRASS, 0.7), y / 16));
  }
  r.rect(10, 30, 22, 2, shade(BRASS, 0.75));
  r.disc(21, 33, 2, hex('#7c6a46'));
  if (fresh) {
    r.rect(19, 34, 4, 16, hex('#efe0b0'));
    r.rect(19, 34, 1, 16, WHITE);
    r.disc(21, 51, 3, hex('#efe0b0'));
  } else r.rect(21, 34, 1, 14, hex('#8a7a5a'));
  return fin(r);
}

/** One keepsake standing on a shelf: `cx` is its centre, `by` its base row. About 10×12. */
function keepsake(r: Raster, shape: KeepsakeShape, c: RGB, a: RGB, cx: number, by: number): void {
  switch (shape) {
    case 'pages':
      slab(r, cx - 4, by - 4, 8, 4, c);
      slab(r, cx - 3, by - 7, 7, 3, c);
      r.rect(cx - 4, by - 7, 1, 7, a);
      break;
    case 'egg':
      r.ellipse(cx, by - 5, 3.3, 4.6, c);
      r.ellipse(cx - 1, by - 7, 1, 1.5, WHITE);
      r.rect(cx - 3, by - 1, 6, 1, a);
      break;
    case 'seed':
      r.ellipse(cx, by - 3.5, 4.2, 3.4, c);
      r.disc(cx + 1.5, by - 4, 1.2, a);
      break;
    case 'trowel':
      r.tri(cx - 1, by - 1, cx + 4, by - 7, cx + 4, by - 1, c);
      r.rect(cx - 5, by - 3, 5, 2, a);
      break;
    case 'letter':
      slab(r, cx - 4, by - 4, 8, 4, c);
      r.disc(cx, by - 2, 1.1, a);
      break;
    case 'toy':
      r.ellipse(cx, by - 3, 3.6, 3, c);
      r.disc(cx, by - 8, 2.6, c);
      r.rect(cx - 3, by - 11, 2, 2, a);
      r.rect(cx + 2, by - 11, 2, 2, a);
      break;
    case 'jar':
      slab(r, cx - 3, by - 7, 6, 7, c);
      slab(r, cx - 3, by - 9, 6, 2, a);
      break;
    case 'rock':
      r.ellipse(cx, by - 3, 4.6, 3, c);
      r.disc(cx + 2, by - 4, 1.2, a);
      break;
    case 'cog':
      r.disc(cx, by - 5, 3.6, c);
      for (let i = 0; i < 6; i++) {
        const t = (i / 6) * Math.PI * 2;
        r.disc(cx + Math.cos(t) * 4.2, by - 5 + Math.sin(t) * 4.2, 1, a);
      }
      r.disc(cx, by - 5, 1.1, a);
      break;
    case 'cheese':
      r.tri(cx - 4, by, cx + 4, by, cx + 4, by - 6, c);
      r.disc(cx + 2, by - 2, 0.9, a);
      break;
    case 'lantern':
      slab(r, cx - 3, by - 7, 6, 6, c);
      r.rect(cx - 4, by - 1, 8, 1, a);
      r.tri(cx - 4, by - 7, cx + 4, by - 7, cx, by - 11, a);
      break;
    case 'flag':
      r.rect(cx - 4, by - 12, 1, 12, a);
      r.rect(cx - 3, by - 12, 7, 4, c);
      break;
    case 'sign':
      r.rect(cx, by - 8, 1, 8, a);
      slab(r, cx - 4, by - 11, 9, 5, c);
      break;
    case 'cushion':
      r.ellipse(cx, by - 2.5, 4.8, 2.6, c);
      r.disc(cx, by - 3, 0.8, a);
      break;
    case 'fruit':
      r.disc(cx, by - 4, 3.6, c);
      r.rect(cx, by - 9, 3, 2, a);
      break;
    case 'bottle':
      slab(r, cx - 2, by - 6, 5, 6, c);
      r.rect(cx - 1, by - 10, 3, 4, c);
      r.rect(cx - 1, by - 11, 3, 1, a);
      break;
  }
}

/** Shelf geometry in texels: boards' top rows, column centres. Row 0 is the top shelf. */
export const SHELF_PX = { w: 56, h: 52, boards: [18, 32, 46], cols: [11.5, 22.5, 33.5, 44.5] };

/** The keepsake shelf with its keepsakes standing on it and a star over `glintSlot` (or -1). */
export function paintKeepShelf(ids: readonly string[], glintSlot: number): Raster {
  const r = begin(SHELF_PX.w, SHELF_PX.h);
  slab(r, 2, 6, SHELF_PX.w - 4, SHELF_PX.h - 8, hex('#7c5532'));
  for (const x of [0, SHELF_PX.w - 4]) slab(r, x, 6, 4, SHELF_PX.h - 4, DARK);
  for (const y of SHELF_PX.boards) slab(r, 3, y, SHELF_PX.w - 6, 3, WOOD);
  slab(r, 0, 2, SHELF_PX.w, 5, DARK);
  ids.slice(0, SHELF_CAP).forEach((id, i) => {
    const look = KEEPSAKE_LOOKS[id];
    if (!look) return;
    const by = SHELF_PX.boards[Math.floor(i / 4)]!;
    keepsake(r, look.shape, hex(look.color), hex(look.accent), SHELF_PX.cols[i % 4]!, by);
  });
  r.tracking = false;
  rimObjects(r);
  if (glintSlot >= 0 && glintSlot < SHELF_CAP) {
    const cx = SHELF_PX.cols[glintSlot % 4]! + 5;
    const cy = SHELF_PX.boards[Math.floor(glintSlot / 4)]! - 11;
    r.tracking = true;
    star(r, cx, cy, 3);
    r.tracking = false;
  }
  return r;
}

/** A four-point star painted straight onto `r`. */
function star(r: Raster, cx: number, cy: number, arm: number): void {
  const c = hex('#fffbe0');
  for (let i = -arm; i <= arm; i++) {
    r.set(cx + i, cy, c);
    r.set(cx, cy + i, c);
  }
  r.set(cx, cy, WHITE);
}

/** The glint card: a four-point star with a short diagonal sparkle, 18 texels square. */
function glintStar(): Raster {
  const r = begin(18, 18);
  const c = hex('#fff6c0');
  r.tri(9, 0, 7, 9, 11, 9, c);
  r.tri(9, 18, 7, 9, 11, 9, c);
  r.tri(0, 9, 9, 7, 9, 11, c);
  r.tri(18, 9, 9, 7, 9, 11, c);
  r.disc(9, 9, 2, WHITE);
  r.tracking = false;
  return r;
}

/** The sheet of everything but the keepsake shelf, which is repainted when its contents change. */
export function buildDressSheet(): SpriteSheet {
  const atlas = new RasterAtlas(1024);
  const add = (key: string, raster: Raster) => atlas.add(frameKey(key, 'front', 0), raster);
  add('kettle', kettle());
  add('cup', cup());
  add('teacup', teacup());
  add('pie', pie());
  add('notebook', notebook());
  add('tin', tin());
  add('visor', visor());
  add('lever', lever());
  add('lens', lens());
  add('porchLight', porchLight(false));
  add('porchLight-lit', porchLight(true));
  add('eggShelf', eggShelf());
  add('signpost', signpost(false));
  add('signpost-letter', signpost(true));
  for (let n = 0; n <= 6; n++) add(`board${n}`, board(n));
  add('shrine', shrine(false));
  add('shrine-lit', shrine(true));
  add('bell', bell(false));
  add('bell-new', bell(true));
  add('glint', glintStar());
  return atlas.build();
}

/** A one-frame sheet for the keepsake shelf. */
export function buildShelfSheet(ids: readonly string[], glintSlot: number): SpriteSheet {
  const atlas = new RasterAtlas(256);
  atlas.add(frameKey('keepShelf', 'front', 0), paintKeepShelf(ids, glintSlot));
  return atlas.build();
}
