import { hash, hex, Raster, rimObjects, shade } from './raster';
import { RasterAtlas } from './atlas';
import type { SpriteSheet } from '../sprites/atlas';

/**
 * WORLD-36 (R11 lane D, d7): the ridge's pieces in the painted pixel style, foot on the bottom
 * row, in their own atlas (built on first use): an alpine pine, a lichened boulder and a
 * snow-laden pine as the fill (the snowy one above the snow line); alpine flowers, a rock, a
 * snow mound, a cairn and a marker post as props; the stone hut, the summit telescope, the ice
 * cave's mouth with its warm lantern, the waterfall, and a cairn arch over the border.
 */

const PINE = hex('#2c5a46');
const BARK = hex('#5a4030');
const ROCK = hex('#8a8478');
const SNOW = hex('#f2f6fa');
const ICE = hex('#a8d4ec');
const WARM = hex('#ffcf6a');

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

function pine(snowy: boolean): Raster {
  const r = canvas(52, 92);
  const b = r.h - 1;
  r.rect(23, b - 14, 6, 14, BARK);
  for (let i = 0; i < 4; i++) {
    const y = 6 + i * 18;
    const w = 10 + i * 6;
    r.tri(26 - w, y + 24, 26 + w, y + 24, 26, y, shade(PINE, 0.85 + i * 0.05));
    r.tri(26 - w, y + 24, 26, y + 24, 26, y, shade(PINE, 1.1));
    if (snowy) {
      r.tri(26 - w * 0.7, y + 12, 26 + w * 0.7, y + 12, 26, y + 1, SNOW);
      r.rect(26 - w, y + 22, w * 2, 2, SNOW);
    }
  }
  return finish(r);
}

function boulder(): Raster {
  const r = canvas(44, 32);
  const b = r.h - 1;
  r.ellipse(22, b - 11, 20, 11, shade(ROCK, 0.75));
  r.ellipse(18, b - 14, 13, 7, ROCK);
  r.ellipse(14, b - 17, 5, 3, shade(ROCK, 1.25));
  for (let i = 0; i < 6; i++)
    r.disc(8 + hash(i, 2) * 28, b - 6 - hash(3, i) * 12, 1.5, hex('#a8b86a'));
  return finish(r);
}

function prop(kind: number): Raster {
  const r = canvas(26, 28);
  const b = r.h - 1;
  if (kind === 0) {
    for (let i = 0; i < 6; i++) {
      const x = 4 + i * 3.4;
      r.line(x, b, x, b - 6 - (i % 3) * 2, hex('#4f7a3a'));
      r.disc(x, b - 7 - (i % 3) * 2, 1.6, i % 2 ? hex('#f0f0ff') : hex('#7a8af0'));
    }
  } else if (kind === 1) {
    r.ellipse(13, b - 5, 11, 5, ROCK);
    r.ellipse(10, b - 7, 5, 2, shade(ROCK, 1.2));
  } else if (kind === 2) {
    r.ellipse(13, b - 5, 12, 6, SNOW);
    r.ellipse(10, b - 7, 6, 3, hex('#ffffff'));
  } else if (kind === 3) {
    for (let i = 0; i < 4; i++)
      r.ellipse(13, b - 3 - i * 5, 9 - i * 1.8, 3, shade(ROCK, 0.9 + i * 0.08));
  } else {
    r.rect(12, b - 22, 3, 22, BARK);
    r.rect(10, b - 22, 7, 4, hex('#d8463a'));
  }
  return finish(r);
}

function hut(): Raster {
  const r = canvas(90, 80);
  const b = r.h - 1;
  r.rect(10, b - 36, 70, 36, ROCK);
  for (let y = b - 34; y < b; y += 7)
    for (let x = 10 + ((y / 7) % 2) * 6; x < 80; x += 12) r.rect(x, y, 1, 6, shade(ROCK, 0.7));
  r.tri(2, b - 36, 88, b - 36, 45, b - 66, hex('#5a3a2a'));
  r.tri(2, b - 36, 45, b - 66, 45, b - 36, hex('#6e4a34'));
  r.tri(8, b - 38, 82, b - 38, 45, b - 62, SNOW);
  r.rect(38, b - 22, 14, 22, hex('#3e2a1a'));
  r.rect(18, b - 26, 10, 8, WARM);
  r.rect(66, b - 74, 8, 18, ROCK);
  return finish(r);
}

function telescope(): Raster {
  const r = canvas(40, 50);
  const b = r.h - 1;
  r.line(20, b - 18, 10, b, BARK);
  r.line(20, b - 18, 30, b, BARK);
  r.line(20, b - 18, 20, b, BARK);
  r.line(8, b - 34, 34, b - 18, hex('#b8862e'));
  r.line(8, b - 33, 34, b - 17, hex('#d8a64e'));
  r.line(9, b - 32, 33, b - 16, hex('#b8862e'));
  r.disc(8, b - 34, 3, hex('#3a3a44'));
  return finish(r);
}

function caveMouth(): Raster {
  const r = canvas(110, 80);
  const b = r.h - 1;
  r.ellipse(55, b - 26, 52, 30, shade(ROCK, 0.8));
  r.ellipse(50, b - 34, 40, 20, ROCK);
  r.ellipse(40, b - 50, 30, 10, SNOW);
  r.ellipse(55, b - 14, 22, 16, hex('#141c26'));
  for (let i = 0; i < 6; i++)
    r.tri(36 + i * 7, b - 28, 42 + i * 7, b - 28, 39 + i * 7, b - 20, ICE);
  // The warm lantern on its post by the mouth (readable at night, WORLD-38).
  r.rect(88, b - 30, 3, 30, BARK);
  r.rect(84, b - 38, 11, 9, WARM);
  r.rect(86, b - 36, 4, 5, hex('#fff2c8'));
  return finish(r);
}

function falls(): Raster {
  const r = canvas(40, 70);
  const b = r.h - 1;
  r.rect(6, 0, 28, b - 6, hex('#6fb6e0'));
  for (let i = 0; i < 18; i++)
    r.rect(8 + hash(i, 1) * 24, hash(2, i) * (b - 10), 1, 8, hex('#e8f6ff'));
  r.ellipse(20, b - 4, 18, 5, hex('#e8f6ff'));
  return finish(r);
}

function cairnArch(): Raster {
  const r = canvas(80, 70);
  const b = r.h - 1;
  for (const x of [12, 66])
    for (let i = 0; i < 6; i++)
      r.ellipse(x, b - 4 - i * 8, 9 - i * 0.6, 4, shade(ROCK, 0.85 + (i % 2) * 0.15));
  r.rect(8, b - 54, 64, 6, BARK);
  r.rect(30, b - 48, 20, 8, hex('#d8463a'));
  return finish(r);
}

let sheet: SpriteSheet | null = null;

export function ridgeSheet(): SpriteSheet {
  if (sheet) return sheet;
  const atlas = new RasterAtlas(1024);
  atlas.add('tree-0', pine(false));
  atlas.add('tree-1', boulder());
  atlas.add('tree-2', pine(true));
  for (const k of [0, 1, 2, 3, 4]) atlas.add(`prop-${k}`, prop(k));
  atlas.add('hut', hut());
  atlas.add('telescope', telescope());
  atlas.add('cave', caveMouth());
  atlas.add('falls', falls());
  atlas.add('arch', cairnArch());
  sheet = atlas.build();
  return sheet;
}
