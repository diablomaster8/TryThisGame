import { closedGates } from '../sim/region-gates';
import { REGION_FLIGHTS, regionLedges } from '../sim/region-moves';
import { drawnRegion, regionGround } from '../sim/region-walk';
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

/** R12 lane D (WORLD-25): the vine wall, a curtain of leaves over old stones. */
function vines(): Raster {
  const r = new Raster(64, 40, null);
  r.tracking = true;
  r.rect(4, 20, 56, 18, hex('#7c776c'));
  r.rect(4, 20, 56, 2, hex('#9a958a'));
  const leaf = [hex('#3f7a2c'), hex('#4f8a34'), hex('#6aa647')];
  for (let i = 0; i < 9; i++) {
    const x = 6 + i * 6.4;
    r.rect(x, 4 + (i % 3) * 2, 2, 32 - (i % 3) * 2, leaf[i % 3]!);
    r.disc(x + 1, 8 + (i % 4) * 6, 3, leaf[(i + 1) % 3]!);
    r.disc(x + 2, 22 + (i % 3) * 4, 2.5, leaf[(i + 2) % 3]!);
  }
  r.tracking = false;
  return r;
}

/** R12 lane D: a built stone or cliff ledge, a block of grey rock with a mossy top. */
function ledge(): Raster {
  const r = new Raster(32, 32, null);
  r.tracking = true;
  const g = hex('#9a948a');
  r.rect(2, 6, 28, 26, shade(g, 0.78));
  r.rect(2, 6, 28, 5, g);
  r.rect(2, 4, 28, 3, hex('#6f9e4a'));
  r.rect(8, 16, 1, 10, shade(g, 0.6));
  r.rect(20, 12, 1, 12, shade(g, 0.6));
  r.tracking = false;
  return r;
}

/** R12 lane D: a flying zone's spot, a pale ring of swirling leaves on the ground. */
function mark(): Raster {
  const r = new Raster(24, 24, null);
  r.tracking = true;
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    r.disc(12 + Math.cos(a) * 8, 12 + Math.sin(a) * 8, 1.6, hex(i % 2 ? '#dff1ff' : '#b8e0a0'));
  }
  r.tracking = false;
  return r;
}

function paint(): SpriteSheet {
  if (sheet) return sheet;
  const atlas = new RasterAtlas(128);
  for (const [t, c] of Object.entries(TYPE_COLOUR)) atlas.add(`critter-${t}`, critter(hex(c)));
  atlas.add('boulder', boulder());
  atlas.add('vines', vines());
  atlas.add('ledge', ledge());
  atlas.add('mark', mark());
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
  const id = drawnRegion(world);
  const ledges = id ? regionLedges(id) : [];
  const zones = id ? (REGION_FLIGHTS[id] ?? []) : [];
  if (crit.length === 0 && gates.length === 0 && ledges.length === 0 && zones.length === 0) return;
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
    const rect = s.frames.get(g.kind === 'vines' ? 'vines' : 'boulder');
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
  // R12 lane D: the built stones and ledges, standing from the low ground to their tops, and
  // each flying zone's spot.
  if (!id) return;
  const ground = regionGround(world.location);
  const lr = s.frames.get('ledge');
  if (lr)
    for (const l of ledges) {
      const low = Math.min(ground(l.x, l.z - l.h / 2), ground(l.x, l.z + l.h / 2));
      scratch.sheet = s;
      scratch.rect = lr;
      scratch.mode = 'billboard';
      scratch.x = l.x;
      scratch.z = l.z + l.h / 2;
      scratch.y = low;
      scratch.w = l.w;
      scratch.h = Math.max(0.4, l.y - low + 0.1);
      scratch.tint = tint;
      scratch.opacity = 1;
      batch.draw(scratch);
    }
  const mr = s.frames.get('mark');
  if (mr)
    for (const f of zones) {
      scratch.sheet = s;
      scratch.rect = mr;
      scratch.mode = 'flat';
      scratch.x = f.at.x;
      scratch.z = f.at.z;
      scratch.y = ground(f.at.x, f.at.z) + 0.03;
      scratch.w = 1.6;
      scratch.h = 1.6;
      scratch.tint = tint;
      scratch.opacity = still ? 1 : 0.75 + 0.25 * Math.sin(tSec * 2);
      batch.draw(scratch);
    }
  scratch.mode = 'billboard';
}
