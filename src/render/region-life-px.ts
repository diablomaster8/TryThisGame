import { closedGates } from '../sim/region-gates';
import { liveCritters } from '../sim/region-critters';
import { wildNubbinHere } from '../sim/region-wild-nubbin';
import { speciesById } from '../sim/critters';
import { heightAt } from '../sim/height';
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

/** Which sprite shows each kind of gate (R12 d2). */
const GATE_SPRITE = {
  boulder: 'boulder',
  deepWater: 'whirl',
  updraft: 'draft',
  longRun: 'planks',
} as const;

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

/** R12 d2 (R0120): the region's shy wild Nubbin: a round light-blue baby with a yellow tip. */
function wild(): Raster {
  const r = new Raster(20, 22, null);
  r.tracking = true;
  const b = hex('#8ec8f0');
  r.ellipse(10, 14, 6.4, 6, b);
  r.ellipse(10, 15, 4, 3.4, shade(b, 1.2));
  r.tri(7, 8, 13, 8, 10, 1.5, hex('#f4d84a'));
  r.disc(7.4, 12.4, 1.1, hex('#201814'));
  r.disc(12.6, 12.4, 1.1, hex('#201814'));
  r.disc(5, 19, 1.4, hex('#f4d84a'));
  r.disc(15, 19, 1.4, hex('#f4d84a'));
  r.tracking = false;
  return r;
}

/** R12 d2 (R0110): deep water (a dark eddy), an updraft (pale streaks) and a long run (planks). */
function whirl(): Raster {
  const r = new Raster(40, 40, null);
  r.tracking = true;
  r.ellipse(20, 20, 19, 19, hex('#24508c'));
  r.ellipse(20, 20, 14, 14, hex('#2f6aa8'));
  r.ellipse(20, 20, 9, 9, hex('#24508c'));
  r.ellipse(20, 20, 4, 4, hex('#173a68'));
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    r.line(
      20 + Math.cos(a) * 6,
      20 + Math.sin(a) * 6,
      20 + Math.cos(a + 1.1) * 17,
      20 + Math.sin(a + 1.1) * 17,
      hex('#8ec8f0'),
      0.8,
    );
  }
  r.tracking = false;
  return r;
}

function draft(): Raster {
  const r = new Raster(24, 56, null);
  r.tracking = true;
  const c = hex('#dff0ff');
  for (const [x, y0, y1] of [
    [6, 8, 50],
    [12, 2, 44],
    [18, 12, 52],
  ] as const) {
    for (let y = y0; y < y1; y += 8)
      r.line(x + Math.sin(y * 0.3) * 1.6, y, x + Math.sin((y + 6) * 0.3) * 1.6, y + 6, c, 0.75);
  }
  r.tri(12, 0, 8, 8, 16, 8, c, 0.8);
  r.tracking = false;
  return r;
}

function planks(): Raster {
  const r = new Raster(44, 28, null);
  r.tracking = true;
  const w = hex('#8a5e34');
  for (let i = 0; i < 6; i++) {
    const x = 2 + i * 7;
    r.rect(x, 3, 5, 22, i % 2 ? shade(w, 0.85) : w);
    r.rect(x, 3, 5, 2, shade(w, 1.25));
  }
  r.rect(0, 13, 44, 2, hex('#4a3420'), 0.7);
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
  atlas.add('whirl', whirl());
  atlas.add('draft', draft());
  atlas.add('planks', planks());
  atlas.add('wild', wild());
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
  const wn = wildNubbinHere(world);
  if (crit.length === 0 && gates.length === 0 && !wn) return;
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
    scratch.y =
      heightAt(world.location, c.x, c.z) +
      (still ? 0 : Math.max(0, Math.sin(tSec * 3 + c.x)) * 0.18);
    scratch.w = 0.9;
    scratch.h = 0.9;
    scratch.tint = tint;
    scratch.opacity = 1;
    batch.draw(scratch);
  }
  if (wn) {
    const rect = s.frames.get('wild');
    if (rect) {
      scratch.sheet = s;
      scratch.rect = rect;
      scratch.x = wn.x;
      scratch.z = wn.z;
      scratch.y =
        heightAt(world.location, wn.x, wn.z) +
        (still ? 0 : Math.max(0, Math.sin(tSec * 4 + wn.x)) * 0.12);
      scratch.flip = Math.cos(wn.heading) < 0;
      scratch.w = 1.5;
      scratch.h = (1.5 * rect.h) / rect.w;
      scratch.tint = tint;
      scratch.opacity = 1;
      batch.draw(scratch);
      scratch.flip = false;
    }
  }
  for (const g of gates) {
    const name = GATE_SPRITE[g.kind];
    const rect = s.frames.get(name);
    if (!rect) continue;
    const flat = name === 'whirl' || name === 'planks';
    scratch.sheet = s;
    scratch.rect = rect;
    scratch.x = g.x;
    scratch.z = g.z;
    scratch.y = heightAt(world.location, g.x, g.z) + (flat ? 0.03 : 0);
    scratch.mode = flat ? 'flat' : 'billboard';
    scratch.w = g.r * (flat ? 2.6 : name === 'draft' ? 1.6 : 2.4);
    scratch.h = flat ? scratch.w * (rect.h / rect.w) : (scratch.w * rect.h) / rect.w;
    scratch.tint = tint;
    batch.draw(scratch);
    scratch.mode = 'billboard';
  }
}

// Dev only: the checking drivers find the wild Nubbin and the critters the way the view does.
if (import.meta.env.DEV)
  Object.assign(globalThis, {
    __wildNubbin: wildNubbinHere,
    __liveCritters: liveCritters,
    __closedGates: closedGates,
  });
