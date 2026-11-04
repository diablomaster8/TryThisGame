import { hash, hex, Raster, rimObjects, shade } from './raster';
import { RasterAtlas } from './atlas';
import type { SpriteSheet } from '../sprites/atlas';

/**
 * WORLD-37 (R11 lane D, d7): the ruins' pieces in the painted pixel style, foot on the bottom
 * row, in their own atlas (built on first use): a frost-killed tree, a broken column stub and a
 * mossy rubble heap as the fill; a cracked urn, a fallen capital, an ivy stone, a little shrine
 * and a stone head as props; a whole and a broken column, the broken spire, the temple front,
 * the archive's walls, the standing stones and the old archway; and the pieces that change with
 * the story: the door sealed in ice or thawed open, and an avenue lantern cold or lit.
 */

const STONE = hex('#a9aab0');
const DARK = hex('#6e6f78');
const MOSS = hex('#5d7a4a');
const FROST = hex('#dcecf6');
const BARK = hex('#5a4c40');
const FLAME = hex('#ffcf6a');

function canvas(w: number, h: number): Raster {
  const r = new Raster(w, h, null);
  r.tracking = true;
  return r;
}

function finish(r: Raster): Raster {
  r.tracking = false;
  rimObjects(r);
  return r;
}

/** Frost along the tops of whatever has been drawn: a pale rim on the upper edges. */
function frosted(r: Raster, x0: number, x1: number, y: number): void {
  for (let x = x0; x < x1; x++)
    if (hash(x, y) > 0.3) r.set(x, y + (hash(y, x) > 0.7 ? 1 : 0), FROST);
}

function fill(kind: number): Raster {
  if (kind === 0) {
    const r = canvas(60, 80);
    const b = r.h - 1;
    r.rect(27, b - 46, 6, 46, BARK);
    const branch = (x: number, y: number, dx: number, dy: number) => {
      r.line(x, y, x + dx, y + dy, BARK);
      r.line(x + 1, y, x + dx + 1, y + dy, shade(BARK, 1.2));
      r.set(x + dx, y + dy - 1, FROST);
    };
    branch(29, b - 46, -18, -22);
    branch(31, b - 46, 16, -26);
    branch(30, b - 40, -10, -10);
    branch(30, b - 50, 4, -24);
    branch(14, b - 60, -6, -8);
    branch(44, b - 64, 8, -6);
    return finish(r);
  }
  if (kind === 1) {
    const r = canvas(28, 40);
    const b = r.h - 1;
    r.rect(4, b - 4, 20, 4, DARK);
    r.rect(7, b - 26, 14, 22, STONE);
    for (let x = 9; x < 21; x += 3) r.rect(x, b - 26, 1, 22, shade(STONE, 0.85));
    r.tri(7, b - 26, 21, b - 26, 13, b - 33, STONE);
    frosted(r, 7, 21, b - 27);
    r.rect(7, b - 10, 6, 4, MOSS);
    return finish(r);
  }
  const r = canvas(40, 26);
  const b = r.h - 1;
  for (let i = 0; i < 7; i++)
    r.ellipse(
      6 + hash(i, 3) * 28,
      b - 4 - hash(4, i) * 10,
      5,
      4,
      shade(STONE, 0.8 + hash(i, i) * 0.4),
    );
  r.ellipse(14, b - 12, 6, 2, MOSS);
  return finish(r);
}

function prop(kind: number): Raster {
  const r = canvas(26, 28);
  const b = r.h - 1;
  if (kind === 0) {
    r.ellipse(13, b - 9, 8, 9, STONE);
    r.rect(8, b - 19, 10, 3, DARK);
    r.line(10, b - 16, 15, b - 3, DARK);
  } else if (kind === 1) {
    r.rect(3, b - 8, 20, 8, STONE);
    r.ellipse(8, b - 9, 5, 3, shade(STONE, 1.15));
    r.ellipse(18, b - 9, 5, 3, shade(STONE, 1.15));
  } else if (kind === 2) {
    r.rect(6, b - 18, 14, 18, DARK);
    for (let i = 0; i < 10; i++) r.disc(6 + hash(i, 2) * 14, b - 2 - hash(i, 6) * 16, 1.6, MOSS);
  } else if (kind === 3) {
    r.rect(6, b - 14, 14, 14, STONE);
    r.tri(4, b - 14, 22, b - 14, 13, b - 22, DARK);
    r.rect(11, b - 9, 4, 6, hex('#2a2a30'));
  } else {
    r.ellipse(13, b - 9, 10, 9, STONE);
    r.rect(8, b - 12, 3, 2, DARK);
    r.rect(15, b - 12, 3, 2, DARK);
    r.rect(10, b - 6, 6, 1, DARK);
    r.ellipse(10, b - 17, 6, 2, MOSS);
  }
  return finish(r);
}

function column(broken: boolean): Raster {
  const r = canvas(28, 96);
  const b = r.h - 1;
  r.rect(2, b - 6, 24, 6, DARK);
  const top = broken ? b - 46 : b - 84;
  r.rect(6, top, 16, b - 6 - top, STONE);
  for (let x = 8; x < 22; x += 3) r.rect(x, top, 1, b - 6 - top, shade(STONE, 0.85));
  if (broken) {
    r.tri(6, top, 22, top, 10, top - 8, STONE);
    frosted(r, 6, 22, top - 1);
  } else {
    r.rect(2, top - 6, 24, 6, shade(STONE, 1.1));
    frosted(r, 2, 26, top - 7);
  }
  r.rect(6, b - 22, 5, 10, MOSS);
  return finish(r);
}

function spire(): Raster {
  const r = canvas(60, 170);
  const b = r.h - 1;
  r.rect(8, b - 10, 44, 10, DARK);
  r.rect(14, b - 120, 32, 110, STONE);
  for (let y = b - 118; y < b - 10; y += 10) r.rect(14, y, 32, 1, shade(STONE, 0.8));
  r.rect(26, b - 90, 8, 14, hex('#2a2a30'));
  // The broken top, jagged.
  for (let x = 14; x < 46; x += 4)
    r.tri(x, b - 120, x + 4, b - 120, x + 2, b - 128 - hash(x, 1) * 18, STONE);
  frosted(r, 14, 46, b - 121);
  r.rect(14, b - 40, 10, 16, MOSS);
  return finish(r);
}

function temple(): Raster {
  const r = canvas(220, 110);
  const b = r.h - 1;
  r.rect(0, b - 70, 220, 70, STONE);
  for (let y = b - 68; y < b; y += 9)
    for (let x = ((y / 9) % 2) * 10; x < 220; x += 20) r.rect(x, y, 1, 8, shade(STONE, 0.75));
  r.rect(0, b - 82, 220, 12, shade(STONE, 1.1));
  for (let x = 0; x < 220; x += 18) r.tri(x, b - 82, x + 18, b - 82, x + 9, b - 90, STONE);
  frosted(r, 0, 220, b - 91);
  // The door's frame (the door itself is drawn by its state).
  r.rect(88, b - 64, 44, 64, DARK);
  r.tri(84, b - 64, 136, b - 64, 110, b - 80, DARK);
  for (const x of [20, 60, 150, 190]) r.rect(x, b - 50, 10, 16, shade(DARK, 0.6));
  r.rect(30, b - 30, 16, 14, MOSS);
  return finish(r);
}

function door(open: boolean): Raster {
  const r = canvas(40, 60);
  const b = r.h - 1;
  if (open) {
    r.rect(0, 0, 40, 60, hex('#1c1c22'));
    for (let i = 0; i < 5; i++)
      r.rect(4 + i * 2, b - 8 - i * 8, 32 - i * 4, 3, shade(DARK, 0.7 - i * 0.08));
    r.disc(20, 18, 3, FLAME);
  } else {
    r.rect(0, 0, 40, 60, hex('#8fb6cc'));
    for (let i = 0; i < 14; i++)
      r.line(hash(i, 1) * 40, hash(2, i) * 60, hash(i, 3) * 40, hash(4, i) * 60, FROST);
    r.rect(18, 26, 4, 8, hex('#5a7a90'));
  }
  return finish(r);
}

function lantern(lit: boolean): Raster {
  const r = canvas(18, 48);
  const b = r.h - 1;
  r.rect(7, b - 36, 4, 36, DARK);
  r.rect(3, b - 46, 12, 3, DARK);
  r.rect(4, b - 43, 10, 8, lit ? FLAME : hex('#7c8a96'));
  if (lit) r.rect(6, b - 42, 4, 6, hex('#fff2c8'));
  else {
    r.line(5, b - 43, 12, b - 36, FROST);
    r.set(9, b - 47, FROST);
  }
  return finish(r);
}

function archive(): Raster {
  const r = canvas(120, 70);
  const b = r.h - 1;
  for (const [x, w, h] of [
    [4, 30, 50],
    [40, 24, 30],
    [70, 46, 44],
  ] as const) {
    r.rect(x, b - h, w, h, STONE);
    for (let y = b - h + 2; y < b; y += 7) r.rect(x, y, w, 1, shade(STONE, 0.8));
    for (let i = 0; i < w; i += 4) r.rect(x + i, (b - h - hash(i, x) * 6) | 0, 4, 6, STONE);
    frosted(r, x, x + w, b - h - 6);
  }
  r.rect(80, b - 30, 12, 18, hex('#2a2a30'));
  return finish(r);
}

function stones(): Raster {
  const r = canvas(90, 44);
  const b = r.h - 1;
  for (let i = 0; i < 6; i++) {
    const x = 6 + i * 14;
    const h = 20 + hash(i, 4) * 16;
    r.rect(x, b - (i % 2) * 5 - h, 9, h, DARK);
    r.rect(x, b - (i % 2) * 5 - h, 3, h, STONE);
    frosted(r, x, x + 9, b - (i % 2) * 5 - h - 1);
  }
  return finish(r);
}

function archway(): Raster {
  const r = canvas(110, 100);
  const b = r.h - 1;
  r.rect(8, b - 74, 18, 74, STONE);
  r.rect(84, b - 60, 18, 60, STONE);
  r.rect(4, b - 86, 66, 12, shade(STONE, 1.05));
  r.tri(70, b - 86, 70, b - 74, 82, b - 74, shade(STONE, 1.05));
  frosted(r, 4, 70, b - 87);
  r.rect(10, b - 30, 12, 16, MOSS);
  return finish(r);
}

let sheet: SpriteSheet | null = null;

export function ruinsSheet(): SpriteSheet {
  if (sheet) return sheet;
  const atlas = new RasterAtlas(1024);
  for (const k of [0, 1, 2]) atlas.add(`tree-${k}`, fill(k));
  for (const k of [0, 1, 2, 3, 4]) atlas.add(`prop-${k}`, prop(k));
  atlas.add('column', column(false));
  atlas.add('column-broken', column(true));
  atlas.add('spire', spire());
  atlas.add('temple', temple());
  atlas.add('door-sealed', door(false));
  atlas.add('door-open', door(true));
  atlas.add('lantern-cold', lantern(false));
  atlas.add('lantern-lit', lantern(true));
  atlas.add('archive', archive());
  atlas.add('stones', stones());
  atlas.add('arch', archway());
  sheet = atlas.build();
  return sheet;
}
