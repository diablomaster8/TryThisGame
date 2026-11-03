import { closedGates } from '../sim/region-gates';
import { liveCritters } from '../sim/region-critters';
import { speciesById } from '../sim/critters';
import type { World } from '../sim/types';
import { RasterAtlas } from './paint/atlas';
import { hex, Raster, shade, type RGB } from './paint/raster';
import type { SpriteBatch, SpriteDraw } from './sprite-batch';
import type { SpriteSheet } from './sprites/atlas';

/**
 * R0120 and R0110 (R11 d8): a region's critters (small round animals, coloured by their type)
 * and its shut gates (the Wood's boulder) in the pixel view, drawn from the sim's lists
 * (`sim/region-critters.ts`, `sim/region-gates.ts`). A tiny sheet painted on first use; nothing
 * is drawn where a region has neither.
 */
const TYPE_COLOUR: Record<string, string> = {
  swim: '#5aa0d8',
  fly: '#9ac8f0',
  run: '#e8c84a',
  power: '#c8583c',
  normal: '#d8c49c',
};

let sheet: SpriteSheet | null = null;

function critter(c: RGB): Raster {
  const r = new Raster(16, 16, null);
  r.tracking = true;
  r.ellipse(8, 10, 5.5, 4.6, c);
  r.ellipse(8, 11, 3.4, 2.4, shade(c, 1.25));
  r.disc(4.2, 5.6, 2, c);
  r.disc(11.8, 5.6, 2, c);
  r.rect(5.5, 8, 1.4, 1.6, hex('#201814'));
  r.rect(9.2, 8, 1.4, 1.6, hex('#201814'));
  r.tracking = false;
  return r;
}

function boulder(): Raster {
  const r = new Raster(48, 38, null);
  r.tracking = true;
  const g = hex('#8d887e');
  r.ellipse(24, 24, 21, 13, shade(g, 0.8));
  r.ellipse(22, 21, 17, 10, g);
  r.ellipse(18, 16, 8, 4, shade(g, 1.2));
  r.ellipse(30, 20, 4, 2, hex('#6f9e4a'), 0.8);
  r.tracking = false;
  return r;
}

function paint(): SpriteSheet {
  if (sheet) return sheet;
  const atlas = new RasterAtlas(128);
  for (const [t, c] of Object.entries(TYPE_COLOUR)) atlas.add(`critter-${t}`, critter(hex(c)));
  atlas.add('boulder', boulder());
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

export function drawRegionLifePx(
  world: World,
  batch: SpriteBatch,
  tint: number,
  tSec: number,
  still: boolean,
): void {
  if (!world.location.startsWith('region:')) return;
  const crit = liveCritters(world);
  const gates = closedGates(world);
  if (crit.length === 0 && gates.length === 0) return;
  const s = paint();
  for (const c of crit) {
    const t = speciesById(c.species)?.type ?? 'normal';
    const rect = s.frames.get(`critter-${t}`);
    if (!rect) continue;
    scratch.sheet = s;
    scratch.rect = rect;
    scratch.x = c.x;
    scratch.z = c.z;
    // A small hop now and then, still under reduced motion.
    scratch.y = still ? 0 : Math.max(0, Math.sin(tSec * 3 + c.x)) * 0.18;
    scratch.w = 0.9;
    scratch.h = 0.9;
    scratch.tint = tint;
    scratch.opacity = 1;
    batch.draw(scratch);
  }
  for (const g of gates) {
    const rect = s.frames.get('boulder');
    if (!rect) continue;
    scratch.sheet = s;
    scratch.rect = rect;
    scratch.x = g.x;
    scratch.z = g.z;
    scratch.y = 0;
    scratch.w = g.r * 2.4;
    scratch.h = (g.r * 2.4 * rect.h) / rect.w;
    scratch.tint = tint;
    batch.draw(scratch);
  }
}
