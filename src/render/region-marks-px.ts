import { PETALS } from '../config/region-content-r12d2';
import { heightAt } from '../sim/height';
import { regionMarks, type Mark } from '../sim/region-marks';
import type { World } from '../sim/types';
import { RasterAtlas } from './paint/atlas';
import { hex, Raster, shade } from './paint/raster';
import type { SpriteBatch, SpriteDraw } from './sprite-batch';
import type { SpriteSheet } from './sprites/atlas';

/**
 * R12 d2 (R0090, R0091, R0138, R0136): the small marks of an open region in the pixel view. A
 * pressed-petal flower in the region's own colour, a lost postcard, an old key, a trace stone
 * that glows until it has been looked at, the photo frame and the build plot's outline. Drawn from
 * `sim/region-marks.ts`; the sheet is painted once on first use (never per frame).
 */
/** Beyond this the marks are not drawn at all (the view never shows them). */
const REACH = 60;

let sheet: SpriteSheet | null = null;

function flower(colour: string): Raster {
  const r = new Raster(12, 14, null);
  r.tracking = true;
  const c = hex(colour);
  r.rect(5.5, 7, 1.2, 6, hex('#4a8a3a'));
  for (const [dx, dy] of [
    [0, -2.4],
    [2.3, -0.8],
    [1.4, 1.9],
    [-1.4, 1.9],
    [-2.3, -0.8],
  ] as const)
    r.disc(6 + dx, 5 + dy, 1.9, c);
  r.disc(6, 5, 1.2, hex('#f8e8a0'));
  r.tracking = false;
  return r;
}

function postcard(): Raster {
  const r = new Raster(14, 10, null);
  r.tracking = true;
  r.rect(1, 2, 12, 7, hex('#7a6244'));
  r.rect(1, 1, 12, 7, hex('#f4ead0'));
  r.rect(9, 2, 3, 3, hex('#d8584a'));
  r.line(2, 4, 7, 4, hex('#9a8a70'));
  r.line(2, 6, 7, 6, hex('#9a8a70'));
  r.tracking = false;
  return r;
}

function key(): Raster {
  const r = new Raster(10, 16, null);
  r.tracking = true;
  const g = hex('#e8b830');
  r.disc(5, 4, 3.4, g);
  r.disc(5, 4, 1.4, hex('#7a5a10'));
  r.rect(4.4, 7, 1.4, 8, g);
  r.rect(5.8, 11, 2, 1.2, g);
  r.rect(5.8, 13.4, 2, 1.2, g);
  r.tracking = false;
  return r;
}

function traceStone(): Raster {
  const r = new Raster(18, 16, null);
  r.tracking = true;
  const g = hex('#9a968c');
  r.ellipse(9, 11, 7.5, 4.6, shade(g, 0.75));
  r.ellipse(9, 9, 6.5, 6, g);
  r.ellipse(7, 6, 3.4, 2, shade(g, 1.2));
  r.ellipse(12, 5, 3, 1.6, hex('#6f9e4a'), 0.85);
  r.disc(9, 9, 1.2, hex('#f8e8a0'));
  r.tracking = false;
  return r;
}

function frame(): Raster {
  const r = new Raster(32, 28, null);
  r.tracking = true;
  const wood = hex('#9a6a3a');
  r.rect(2, 4, 3, 22, wood);
  r.rect(27, 4, 3, 22, wood);
  r.rect(1, 2, 30, 4, shade(wood, 1.15));
  r.rect(2, 24, 3, 3, shade(wood, 0.7));
  r.rect(27, 24, 3, 3, shade(wood, 0.7));
  // A tiny camera on the lintel.
  r.rect(13, 0, 6, 4, hex('#3a3a44'));
  r.disc(16, 2, 1.1, hex('#9ad8f0'));
  r.tracking = false;
  return r;
}

function plotOutline(): Raster {
  const r = new Raster(32, 32, null);
  r.tracking = true;
  const c = hex('#f4ead0');
  for (let i = 0; i < 32; i += 4) {
    r.rect(i, 0, 2, 1, c, 0.8);
    r.rect(i, 31, 2, 1, c, 0.8);
    r.rect(0, i, 1, 2, c, 0.8);
    r.rect(31, i, 1, 2, c, 0.8);
  }
  r.tracking = false;
  return r;
}

function post(): Raster {
  const r = new Raster(8, 16, null);
  r.tracking = true;
  r.rect(3, 3, 2, 12, hex('#8a5e34'));
  r.rect(4, 1, 4, 3, hex('#e8b830'));
  r.tracking = false;
  return r;
}

/** R0136: stand-ins for the few decorations a plot takes (the Grove's own art is Grove-only). */
function bench(): Raster {
  const r = new Raster(24, 14, null);
  r.tracking = true;
  r.rect(1, 6, 22, 3, hex('#b07a44'));
  r.rect(1, 3, 22, 2, hex('#9a6a3a'));
  r.rect(3, 9, 2, 4, hex('#6a4a2a'));
  r.rect(19, 9, 2, 4, hex('#6a4a2a'));
  r.tracking = false;
  return r;
}

function flowerbed(): Raster {
  const r = new Raster(22, 16, null);
  r.tracking = true;
  r.ellipse(11, 10, 10, 5, hex('#6a4a2a'));
  r.ellipse(11, 9, 8.5, 4, hex('#4a8a3a'));
  for (const [x, y, c] of [
    [6, 7, '#f2a6c4'],
    [11, 6, '#f4c430'],
    [16, 8, '#b87ad8'],
    [9, 10, '#ffffff'],
    [14, 11, '#f08fb0'],
  ] as const)
    r.disc(x, y, 1.6, hex(c));
  r.tracking = false;
  return r;
}

function lantern(): Raster {
  const r = new Raster(10, 24, null);
  r.tracking = true;
  r.rect(4, 8, 2, 15, hex('#4a3a2a'));
  r.rect(2, 2, 6, 7, hex('#3a3a44'));
  r.rect(3, 3, 4, 5, hex('#f8d870'));
  r.tracking = false;
  return r;
}

function pathTile(): Raster {
  const r = new Raster(20, 20, null);
  r.tracking = true;
  r.rect(1, 1, 18, 18, hex('#9a968c'));
  r.rect(2, 2, 16, 16, hex('#b0aca0'));
  r.tracking = false;
  return r;
}

function paint(): SpriteSheet {
  if (sheet) return sheet;
  const atlas = new RasterAtlas(256);
  for (const [id, p] of Object.entries(PETALS)) if (p) atlas.add(`petal-${id}`, flower(p.colour));
  atlas.add('postcard', postcard());
  atlas.add('key', key());
  atlas.add('trace', traceStone());
  atlas.add('photo', frame());
  atlas.add('plot', plotOutline());
  atlas.add('post', post());
  atlas.add('decor-bench', bench());
  atlas.add('decor-flowerbed', flowerbed());
  atlas.add('decor-lanternSmall', lantern());
  atlas.add('decor-pathTile', pathTile());
  sheet = atlas.build();
  return sheet;
}

const scratch: SpriteDraw = {
  sheet: null as unknown as SpriteSheet,
  rect: { x: 0, y: 0, w: 1, h: 1 },
  flip: false,
  x: 0,
  y: 0,
  z: 0,
  mode: 'billboard',
};

/** World height of a sprite of `rect` pixels at `w` wide. */
function put(
  s: SpriteSheet,
  batch: SpriteBatch,
  name: string,
  x: number,
  y: number,
  z: number,
  w: number,
  tint: number,
  mode: 'billboard' | 'flat' = 'billboard',
  h?: number,
): void {
  const rect = s.frames.get(name);
  if (!rect) return;
  scratch.sheet = s;
  scratch.rect = rect;
  scratch.x = x;
  scratch.y = y;
  scratch.z = z;
  scratch.w = w;
  scratch.h = h ?? (w * rect.h) / rect.w;
  scratch.tint = tint;
  scratch.mode = mode;
  batch.draw(scratch);
}

export function drawRegionMarksPx(
  world: World,
  batch: SpriteBatch,
  tint: number,
  tSec: number,
  still: boolean,
): void {
  if (!world.location.startsWith('region:')) return;
  const marks = regionMarks(world);
  if (marks.length === 0) return;
  const s = paint();
  const k = world.keeper.pos;
  for (const m of marks) {
    if (Math.abs(m.x - k.x) > REACH || Math.abs(m.z - k.z) > REACH) continue;
    drawMark(s, batch, world, m, tint, tSec, still);
  }
}

function drawMark(
  s: SpriteSheet,
  batch: SpriteBatch,
  world: World,
  m: Mark,
  tint: number,
  tSec: number,
  still: boolean,
): void {
  const y = heightAt(world.location, m.x, m.z);
  const bob = still ? 0 : Math.sin(tSec * 2 + m.x * 0.7) * 0.05;
  switch (m.kind) {
    case 'petal':
      put(s, batch, `petal-${m.region}`, m.x, y + 0.1 + bob, m.z, 0.9, tint);
      break;
    case 'postcard':
      put(s, batch, 'postcard', m.x, y + 0.25 + bob, m.z, 1, tint);
      break;
    case 'key':
      put(s, batch, 'key', m.x, y + 0.45 + bob, m.z, 0.7, tint);
      break;
    case 'trace':
      put(s, batch, 'trace', m.x, y, m.z, 1.5, tint);
      break;
    case 'photo':
      put(s, batch, 'photo', m.x, y, m.z, 2.6, tint);
      break;
    case 'decor': {
      const name = `decor-${m.decor}`;
      if (m.decor === 'pathTile') put(s, batch, name, m.x, y + 0.02, m.z, 1, tint, 'flat', 1);
      else put(s, batch, name, m.x, y, m.z, m.decor === 'lanternSmall' ? 0.5 : 1.4, tint);
      break;
    }
    case 'plot': {
      put(s, batch, 'plot', m.x, y + 0.02, m.z, 8, tint, 'flat', 8);
      for (const [dx, dz] of [
        [-4, -4],
        [4, -4],
        [-4, 4],
        [4, 4],
      ] as const)
        put(
          s,
          batch,
          'post',
          m.x + dx,
          heightAt(world.location, m.x + dx, m.z + dz),
          m.z + dz,
          0.6,
          tint,
        );
      break;
    }
  }
}

// Dev only: the checking drivers read the marks the way the renderers do.
if (import.meta.env.DEV) (globalThis as { __regionMarks?: unknown }).__regionMarks = regionMarks;
