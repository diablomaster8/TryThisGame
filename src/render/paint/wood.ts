import { hash, hex, Raster, rimObjects, shade, type RGB } from './raster';
import { RasterAtlas } from './atlas';
import type { SpriteSheet } from '../sprites/atlas';
import { SEASON_LOOK } from '../../config/region-season-look';
import type { Season } from '../../sim/types';

/**
 * WORLD-25 (R11 lane D): the Wood's pieces in the painted pixel style, `WOOD_TEXELS` a world
 * unit with the foot on the bottom row, in their own small atlas (built on first use): three
 * forest trees, the Wishing Oak, the hollow tree, the mill with its wheel, the vine wall, the
 * lookout, the tree tunnel's arch and five small props (stump, mushrooms, fern, log, bird box).
 * Drawn by `render/region-wood.ts`.
 */
export const WOOD_TEXELS = 16;

const BARK = hex('#6b4a2e');
const DBARK = hex('#3e2a1a');
// The crowns' colours follow the season (`setWoodSeason`); LEAF[2] stays the hollow tree's own.
let LEAF = [hex('#2f6b3a'), hex('#3d7d3c'), hex('#5a8a3a')];
let PINE = hex('#24563c');
const STONE = hex('#9c968a');
const PLANK = hex('#a8743e');
const ROOF = hex('#7a3b2a');
const CAP = hex('#d8483c');
const SPOT = hex('#f6efe0');
const VINE = hex('#4f8a34');

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

/** A round, lumpy crown: a cluster of lit discs over a dark core. */
function crown(r: Raster, cx: number, cy: number, rad: number, c: RGB, seed: number): void {
  r.ellipse(cx, cy, rad, rad * 0.85, shade(c, 0.7));
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + hash(i, seed) * 0.6;
    const d = rad * (0.45 + hash(seed, i) * 0.25);
    r.disc(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.8, rad * 0.42, shade(c, 0.85));
  }
  // Light from the top left.
  r.disc(cx - rad * 0.3, cy - rad * 0.35, rad * 0.4, shade(c, 1.15));
  r.disc(cx - rad * 0.4, cy - rad * 0.45, rad * 0.18, shade(c, 1.35));
  for (let i = 0; i < rad * 2; i++) {
    const x = cx - rad + hash(i, seed + 7) * rad * 2;
    const y = cy - rad + hash(seed + 3, i) * rad * 1.7;
    if (hash(x | 0, y | 0) > 0.5) r.set(x, y, shade(c, 1.3), 0.8);
  }
}

function trunk(r: Raster, cx: number, w: number, top: number, c: RGB): void {
  const base = r.h - 1;
  r.rect(cx - w / 2, top, w, base - top, c);
  r.rect(cx - w / 2, top, 2, base - top, shade(c, 1.25));
  r.rect(cx + w / 2 - 2, top, 2, base - top, shade(c, 0.7));
  // Roots.
  r.tri(cx - w / 2 - 4, base, cx - w / 2 + 2, base - 6, cx - w / 2 + 2, base, c);
  r.tri(cx + w / 2 + 4, base, cx + w / 2 - 2, base - 6, cx + w / 2 - 2, base, c);
}

function paintTree(kind: number): Raster {
  if (kind === 2) {
    // A tall pine: stacked dark triangles.
    const r = canvas(56, 96);
    trunk(r, 28, 6, 70, DBARK);
    for (let i = 0; i < 4; i++) {
      const y = 8 + i * 17;
      const w = 12 + i * 7;
      r.tri(28 - w, y + 26, 28 + w, y + 26, 28, y, shade(PINE, 0.85 + i * 0.05));
      r.tri(28 - w, y + 26, 28, y + 26, 28, y, shade(PINE, 1.1));
    }
    return finish(r);
  }
  const r = canvas(72, 88);
  trunk(r, 36, 8, 46, BARK);
  crown(r, 36, 32, 30, LEAF[kind]!, kind * 13 + 5);
  return finish(r);
}

function paintOak(): Raster {
  const r = canvas(150, 150);
  trunk(r, 75, 22, 70, BARK);
  r.rect(68, 100, 6, 20, DBARK);
  crown(r, 50, 52, 36, LEAF[1]!, 21);
  crown(r, 100, 50, 36, LEAF[1]!, 22);
  crown(r, 75, 34, 40, LEAF[0]!, 23);
  // Ribbons tied for wishes.
  for (let i = 0; i < 6; i++)
    r.rect(40 + i * 14, 84 + (i % 2) * 6, 2, 9, hex(i % 2 ? '#f2c84a' : '#e07ac0'));
  return finish(r);
}

function paintHollowTree(): Raster {
  const r = canvas(70, 100);
  trunk(r, 35, 30, 40, BARK);
  r.ellipse(35, 82, 8, 13, DBARK);
  r.ellipse(35, 84, 6, 10, hex('#120c08'));
  crown(r, 35, 28, 28, LEAF[2]!, 31);
  return finish(r);
}

function paintMill(): Raster {
  const r = canvas(110, 104);
  const base = r.h - 1;
  r.gradient(14, base - 52, 70, 52, shade(STONE, 1.1), shade(STONE, 0.8));
  for (let y = base - 50; y < base; y += 8)
    for (let x = 14 + ((y / 8) % 2) * 6; x < 84; x += 12) r.rect(x, y, 1, 7, shade(STONE, 0.65));
  r.tri(8, base - 50, 90, base - 50, 49, base - 92, ROOF);
  r.tri(8, base - 50, 49, base - 92, 49, base - 50, shade(ROOF, 1.2));
  r.rect(40, base - 26, 16, 26, DBARK);
  r.rect(24, base - 42, 10, 10, hex('#f2d58a'));
  // The water wheel on the stream side is its own sprite (`paintWheel`), turned by the region.
  return finish(r);
}

/** R0089 (R13 d1): the mill's wheel, two frames half a spoke apart so it can turn. */
function paintWheel(frame: number): Raster {
  const r = canvas(46, 46);
  const c = 23;
  r.disc(c, c, 22, PLANK);
  r.disc(c, c, 16, shade(PLANK, 0.6));
  for (let i = 0; i < 8; i++) {
    const a = ((i + frame * 0.5) / 8) * Math.PI * 2;
    r.line(c, c, c + Math.cos(a) * 21, c + Math.sin(a) * 21, shade(PLANK, 1.2));
    r.rect(c + Math.cos(a) * 19 - 1, c + Math.sin(a) * 19 - 1, 3, 3, shade(DBARK, 1.1));
  }
  r.disc(c, c, 4, DBARK);
  return finish(r);
}

function paintVineWall(): Raster {
  const r = canvas(70, 48);
  const base = r.h - 1;
  r.gradient(2, base - 40, 66, 40, shade(STONE, 1), shade(STONE, 0.75));
  for (let i = 0; i < 40; i++) {
    const x = 4 + hash(i, 3) * 62;
    const y = base - 40 + hash(9, i) * 38;
    r.disc(x, y, 3 + hash(i, i) * 3, shade(VINE, 0.8 + hash(i, 5) * 0.5));
  }
  return finish(r);
}

function paintLookout(): Raster {
  const r = canvas(60, 90);
  const base = r.h - 1;
  for (const x of [12, 46]) r.rect(x, base - 64, 4, 64, BARK);
  r.line(14, base - 4, 48, base - 40, shade(BARK, 0.8));
  r.line(48, base - 4, 14, base - 40, shade(BARK, 0.8));
  r.rect(6, base - 68, 48, 6, PLANK);
  r.rect(6, base - 80, 3, 12, PLANK);
  r.rect(51, base - 80, 3, 12, PLANK);
  r.rect(6, base - 80, 48, 2, shade(PLANK, 1.2));
  return finish(r);
}

/** The tree tunnel: two trunks leaning in under one shared crown, the way dark beyond. */
function paintArch(): Raster {
  const r = canvas(120, 110);
  const base = r.h - 1;
  r.ellipse(60, base - 20, 30, 34, hex('#0e1a10'));
  trunk(r, 22, 12, 40, BARK);
  trunk(r, 98, 12, 40, BARK);
  crown(r, 30, 34, 30, LEAF[0]!, 41);
  crown(r, 90, 34, 30, LEAF[0]!, 42);
  crown(r, 60, 22, 30, LEAF[1]!, 43);
  r.ellipse(60, base - 10, 26, 6, hex('#1e2a14'));
  return finish(r);
}

function paintProp(kind: number): Raster {
  const r = canvas(32, 28);
  const base = r.h - 1;
  if (kind === 0) {
    r.ellipse(16, base - 6, 11, 6, BARK);
    r.ellipse(16, base - 10, 11, 4, hex('#d9a76a'));
    r.ellipse(16, base - 10, 6, 2, shade(BARK, 1.1));
  } else if (kind === 1) {
    for (const [x, h] of [
      [10, 10],
      [18, 14],
      [24, 8],
    ] as const) {
      r.rect(x - 1, base - h, 3, h, SPOT);
      r.ellipse(x, base - h, 5, 3, CAP);
      r.set(x - 2, base - h - 1, SPOT);
      r.set(x + 2, base - h, SPOT);
    }
  } else if (kind === 2) {
    for (let i = 0; i < 7; i++) {
      const a = Math.PI * (0.15 + (i / 6) * 0.7);
      r.line(16, base, 16 - Math.cos(a) * 14, base - Math.sin(a) * 16, shade(LEAF[2]!, 1.1));
      r.line(17, base, 17 - Math.cos(a) * 13, base - Math.sin(a) * 15, LEAF[1]!);
    }
  } else if (kind === 3) {
    r.rect(2, base - 9, 28, 9, BARK);
    r.rect(2, base - 9, 28, 2, shade(BARK, 1.3));
    r.ellipse(29, base - 5, 3, 5, hex('#d9a76a'));
    r.disc(10, base - 10, 2, VINE);
  } else {
    r.rect(14, base - 20, 3, 20, BARK);
    r.rect(9, base - 26, 13, 10, PLANK);
    r.tri(7, base - 26, 24, base - 26, 15, base - 32, ROOF);
    r.disc(15, base - 21, 2, DBARK);
  }
  return finish(r);
}

/** A loose dapple of light for the canopy shade (3D scrolls a texture made from the same marks). */
export function dappleMarks(
  w: number,
  h: number,
  seed: number,
): { x: number; y: number; r: number }[] {
  const out: { x: number; y: number; r: number }[] = [];
  const n = Math.round((w * h) / 900);
  for (let i = 0; i < n; i++)
    out.push({ x: hash(i, seed) * w, y: hash(seed, i) * h, r: 3 + hash(i, seed + 1) * 9 });
  return out;
}

/** One sheet per season, built the first time it is drawn (the mega atlas copies a sheet in once). */
const sheets = new Map<Season, SpriteSheet>();
let wearing: Season = 'summer';

/** The pieces a season repaints: every crown (the oak, the hollow tree and the arch too). */
function paintCrowns(add: (key: string, r: Raster) => void): void {
  for (const k of [0, 1, 2]) add(`tree-${k}`, paintTree(k));
  add('oak', paintOak());
  add('hollow', paintHollowTree());
  add('arch', paintArch());
}

function sheetFor(season: Season): SpriteSheet {
  const have = sheets.get(season);
  if (have) return have;
  const look = SEASON_LOOK[season].crowns;
  LEAF = [hex(look[0]), hex(look[1]), hex(season === 'summer' ? '#5a8a3a' : look[1])];
  PINE = hex(look[2]);
  const atlas = new RasterAtlas(1024);
  paintCrowns((k, r) => atlas.add(k, r));
  atlas.add('mill', paintMill());
  atlas.add('wheel-0', paintWheel(0));
  atlas.add('wheel-1', paintWheel(1));
  atlas.add('vines', paintVineWall());
  atlas.add('lookout', paintLookout());
  for (const k of [0, 1, 2, 3, 4]) atlas.add(`prop-${k}`, paintProp(k));
  const built = atlas.build();
  sheets.set(season, built);
  return built;
}

/** R0118: wear a season; draws pick the new sheet up through `woodSheet` (same frame rects). */
export function setWoodSeason(season: Season): void {
  wearing = season;
}

export function woodSheet(): SpriteSheet {
  return sheetFor(wearing);
}
