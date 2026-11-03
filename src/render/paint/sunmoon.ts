import { hash, hex, Raster, rimObjects, shade, type RGB } from './raster';
import { RasterAtlas } from './atlas';
import type { SpriteSheet } from '../sprites/atlas';

/**
 * WORLD-34 (R11 lane D, d7): the Sun and Moon lands' pieces in the painted pixel style, foot on
 * the bottom row, one small atlas each (built on first use).
 * - Sun: a cypress, a golden shrub and a flowering urn as the fill; sunflowers, a gold bed, a
 *   marble bench, a sundial and a rose bush as props; the halo-ball fountain, the gold dome, a
 *   white column and the white-and-gold gate.
 * - Moon: crystal spikes, a dark shrub with glowing berries and a low crystal cluster as the
 *   fill; a glow-cap, a moonflower, a standing stone, a firefly cloud and a small lamp as props;
 *   the crystal spire, a shore lantern, the standing-stone ring and the crescent gate.
 */

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

const WHITE = hex('#f3efe4');
const STONE = hex('#d9d2bf');
const GOLD = hex('#e8b93a');
const LEAF = hex('#4f7a3a');
const DLEAF = hex('#2f5a34');
const ROSE = hex('#e86a7a');
const SKY = hex('#9fd6f0');

function sunFill(kind: number): Raster {
  if (kind === 0) {
    // A cypress: a tall dark flame of leaves on a short trunk.
    const r = canvas(30, 90);
    const b = r.h - 1;
    r.rect(13, b - 10, 4, 10, hex('#6b4a2e'));
    for (let y = 6; y < b - 8; y++) {
      const t = (y - 6) / (b - 14);
      const w = 3 + Math.sin(t * Math.PI * 0.9) * 10;
      r.rect(15 - w, y, w * 2, 1, shade(DLEAF, 0.9 + hash(y, 3) * 0.25));
      r.rect(15 - w, y, w * 0.7, 1, shade(DLEAF, 1.25));
    }
    return finish(r);
  }
  if (kind === 1) {
    const r = canvas(40, 34);
    const b = r.h - 1;
    r.ellipse(20, b - 13, 18, 12, shade(GOLD, 0.7));
    r.ellipse(17, b - 16, 13, 8, GOLD);
    for (let i = 0; i < 14; i++)
      r.set(5 + hash(i, 2) * 30, b - 6 - hash(3, i) * 18, shade(GOLD, 1.3));
    return finish(r);
  }
  // A white urn spilling flowers.
  const r = canvas(30, 40);
  const b = r.h - 1;
  r.rect(10, b - 4, 10, 4, STONE);
  r.ellipse(15, b - 14, 9, 10, WHITE);
  r.rect(7, b - 24, 16, 3, STONE);
  for (let i = 0; i < 10; i++)
    r.disc(8 + hash(i, 5) * 14, b - 26 - hash(6, i) * 8, 2, i % 2 ? ROSE : GOLD);
  r.ellipse(15, b - 26, 8, 3, LEAF);
  return finish(r);
}

function sunProp(kind: number): Raster {
  const r = canvas(26, 34);
  const b = r.h - 1;
  if (kind === 0) {
    r.line(13, b, 13, b - 20, LEAF);
    r.disc(13, b - 24, 6, GOLD);
    r.disc(13, b - 24, 3, hex('#6b4a2e'));
  } else if (kind === 1) {
    r.ellipse(13, b - 4, 12, 4, hex('#6b4a2e'));
    for (let i = 0; i < 9; i++) r.disc(3 + i * 2.6, b - 5 - (i % 2) * 2, 2, i % 3 ? GOLD : WHITE);
  } else if (kind === 2) {
    r.rect(2, b - 10, 22, 3, WHITE);
    r.rect(4, b - 7, 3, 7, STONE);
    r.rect(19, b - 7, 3, 7, STONE);
  } else if (kind === 3) {
    r.rect(9, b - 12, 8, 12, STONE);
    r.ellipse(13, b - 13, 9, 3, WHITE);
    r.tri(13, b - 13, 19, b - 13, 13, b - 19, GOLD);
  } else {
    r.ellipse(13, b - 8, 11, 8, LEAF);
    for (let i = 0; i < 7; i++) r.disc(4 + hash(i, 8) * 18, b - 4 - hash(9, i) * 10, 2, ROSE);
  }
  return finish(r);
}

/** The halo-ball fountain: a white basin, a jet, and the ball with its gold ring above. */
function paintFountain(): Raster {
  const r = canvas(90, 96);
  const b = r.h - 1;
  r.ellipse(45, b - 10, 40, 10, STONE);
  r.ellipse(45, b - 13, 36, 7, SKY);
  r.ellipse(45, b - 13, 30, 5, shade(SKY, 1.15));
  r.rect(41, b - 44, 8, 32, WHITE);
  r.ellipse(45, b - 44, 14, 4, STONE);
  r.rect(44, b - 60, 2, 16, shade(SKY, 1.2));
  r.disc(45, b - 72, 9, hex('#fff6d0'));
  r.disc(42, b - 75, 3, hex('#ffffff'));
  r.ellipse(45, b - 86, 12, 3, GOLD);
  r.ellipse(45, b - 86, 9, 1.5, hex('#fff6d0'));
  return finish(r);
}

function paintDome(): Raster {
  const r = canvas(130, 150);
  const b = r.h - 1;
  r.rect(10, b - 8, 110, 8, STONE);
  r.rect(18, b - 64, 94, 56, WHITE);
  for (let x = 24; x < 108; x += 14) {
    r.rect(x, b - 62, 6, 54, shade(WHITE, 0.88));
    r.rect(x, b - 62, 2, 54, hex('#ffffff'));
  }
  r.rect(52, b - 40, 26, 32, shade(GOLD, 0.6));
  r.ellipse(65, b - 64, 52, 40, shade(GOLD, 0.85));
  r.ellipse(58, b - 74, 36, 26, GOLD);
  r.ellipse(50, b - 84, 14, 9, shade(GOLD, 1.3));
  r.rect(63, b - 118, 4, 14, GOLD);
  r.disc(65, b - 122, 6, hex('#fff6d0'));
  return finish(r);
}

function paintColumn(): Raster {
  const r = canvas(24, 80);
  const b = r.h - 1;
  r.rect(3, b - 6, 18, 6, STONE);
  r.rect(6, b - 70, 12, 64, WHITE);
  for (let x = 8; x < 18; x += 3) r.rect(x, b - 70, 1, 64, shade(WHITE, 0.85));
  r.rect(3, b - 76, 18, 6, GOLD);
  return finish(r);
}

function paintGate(c1: RGB, c2: RGB, crest: 'sun' | 'moon'): Raster {
  const r = canvas(100, 110);
  const b = r.h - 1;
  r.rect(8, b - 80, 16, 80, c1);
  r.rect(76, b - 80, 16, 80, c1);
  r.rect(8, b - 80, 4, 80, shade(c1, 1.2));
  r.rect(4, b - 92, 92, 12, c1);
  r.rect(4, b - 92, 92, 3, shade(c1, 1.2));
  r.rect(24, b - 80, 52, 4, c2);
  if (crest === 'sun') {
    r.disc(50, b - 100, 9, c2);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      r.line(50, b - 100, 50 + Math.cos(a) * 14, b - 100 + Math.sin(a) * 14, c2);
    }
  } else {
    r.disc(50, b - 100, 9, c2);
    r.disc(55, b - 103, 7, c1);
  }
  return finish(r);
}

const VIOLET = hex('#9b5de5');
const DEEP = hex('#3a2a5e');
const GLOW = hex('#c8f0ff');
const BERRY = hex('#7af0d0');

function crystal(r: Raster, x: number, base: number, h: number, w: number, c: RGB): void {
  r.tri(x - w, base, x + w, base, x, base - h, shade(c, 0.8));
  r.tri(x - w, base, x, base, x, base - h, shade(c, 1.2));
  r.line(x - w * 0.3, base - 2, x, base - h + 3, shade(c, 1.5));
}

function moonFill(kind: number): Raster {
  if (kind === 0) {
    const r = canvas(44, 70);
    const b = r.h - 1;
    crystal(r, 16, b, 60, 7, VIOLET);
    crystal(r, 28, b, 44, 6, shade(VIOLET, 0.9));
    crystal(r, 8, b, 30, 5, shade(VIOLET, 1.1));
    crystal(r, 36, b, 26, 5, shade(VIOLET, 0.8));
    return finish(r);
  }
  if (kind === 1) {
    const r = canvas(40, 34);
    const b = r.h - 1;
    r.ellipse(20, b - 13, 18, 12, DEEP);
    r.ellipse(17, b - 16, 12, 7, shade(DEEP, 1.3));
    for (let i = 0; i < 9; i++) r.disc(5 + hash(i, 4) * 30, b - 6 - hash(5, i) * 16, 1.5, BERRY);
    return finish(r);
  }
  const r = canvas(30, 26);
  const b = r.h - 1;
  crystal(r, 10, b, 18, 4, VIOLET);
  crystal(r, 18, b, 24, 4, shade(VIOLET, 1.15));
  crystal(r, 24, b, 12, 3, shade(VIOLET, 0.9));
  return finish(r);
}

function moonProp(kind: number): Raster {
  const r = canvas(26, 34);
  const b = r.h - 1;
  if (kind === 0) {
    for (const [x, h] of [
      [8, 9],
      [15, 13],
      [20, 7],
    ] as const) {
      r.rect(x - 1, b - h, 2, h, hex('#d8d0f0'));
      r.ellipse(x, b - h, 4, 2.5, BERRY);
    }
  } else if (kind === 1) {
    r.line(13, b, 13, b - 14, hex('#4a6a5a'));
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      r.disc(13 + Math.cos(a) * 4, b - 18 + Math.sin(a) * 4, 3, hex('#f0f4ff'));
    }
    r.disc(13, b - 18, 2, GLOW);
  } else if (kind === 2) {
    r.rect(8, b - 24, 10, 24, hex('#5a5470'));
    r.rect(8, b - 24, 3, 24, hex('#7a7490'));
    r.rect(10, b - 16, 6, 2, GLOW);
  } else if (kind === 3) {
    for (let i = 0; i < 9; i++)
      r.disc(4 + hash(i, 1) * 18, b - 6 - hash(2, i) * 24, 1.2, hex('#f6f09a'));
  } else {
    r.rect(12, b - 18, 2, 18, hex('#3a3450'));
    r.rect(9, b - 24, 8, 7, hex('#3a3450'));
    r.rect(10, b - 23, 6, 5, hex('#ffd890'));
  }
  return finish(r);
}

function paintSpire(): Raster {
  const r = canvas(80, 170);
  const b = r.h - 1;
  r.ellipse(40, b - 4, 34, 6, hex('#3a3450'));
  crystal(r, 40, b - 2, 160, 16, VIOLET);
  crystal(r, 22, b - 2, 70, 9, shade(VIOLET, 0.85));
  crystal(r, 58, b - 2, 84, 10, shade(VIOLET, 1.1));
  r.disc(40, b - 120, 4, GLOW);
  return finish(r);
}

function paintLantern(): Raster {
  const r = canvas(20, 52);
  const b = r.h - 1;
  r.rect(9, b - 40, 3, 40, hex('#2e2a40'));
  r.rect(4, b - 50, 12, 3, hex('#2e2a40'));
  r.rect(5, b - 47, 10, 9, hex('#ffd890'));
  r.rect(6, b - 46, 4, 7, hex('#fff2c8'));
  return finish(r);
}

function paintStones(): Raster {
  const r = canvas(90, 44);
  const b = r.h - 1;
  for (let i = 0; i < 6; i++) {
    const x = 8 + i * 15;
    const h = 22 + hash(i, 7) * 14;
    const y = b - (i % 2) * 6;
    r.rect(x, y - h, 9, h, hex('#5a5470'));
    r.rect(x, y - h, 3, h, hex('#7a7490'));
  }
  r.disc(45, b - 20, 3, GLOW);
  return finish(r);
}

const sheets = new Map<'sun' | 'moon', SpriteSheet>();

export function sunMoonSheet(kind: 'sun' | 'moon'): SpriteSheet {
  const had = sheets.get(kind);
  if (had) return had;
  const atlas = new RasterAtlas(1024);
  if (kind === 'sun') {
    for (const k of [0, 1, 2]) atlas.add(`tree-${k}`, sunFill(k));
    for (const k of [0, 1, 2, 3, 4]) atlas.add(`prop-${k}`, sunProp(k));
    atlas.add('fountain', paintFountain());
    atlas.add('dome', paintDome());
    atlas.add('column', paintColumn());
    atlas.add('gate', paintGate(WHITE, GOLD, 'sun'));
  } else {
    for (const k of [0, 1, 2]) atlas.add(`tree-${k}`, moonFill(k));
    for (const k of [0, 1, 2, 3, 4]) atlas.add(`prop-${k}`, moonProp(k));
    atlas.add('spire', paintSpire());
    atlas.add('lantern', paintLantern());
    atlas.add('stones', paintStones());
    atlas.add('gate', paintGate(hex('#3a3450'), hex('#c8d0ff'), 'moon'));
  }
  const s = atlas.build();
  sheets.set(kind, s);
  return s;
}
