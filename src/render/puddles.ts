import type { ReadonlyWorld } from './readonly-world';
import { PUDDLES } from '../config/tuning-r11d6';
import { Raster, hex } from './paint/raster';
import { RasterAtlas } from './paint/atlas';
import type { SpriteSheet } from './sprites/atlas';
import type { SpriteBatch } from './sprite-batch';
import type { World } from '../sim/types';

/**
 * R0137 (WORLD-71): the Grove's rain puddles in the pixel view, flat sprites on the ground at
 * `PUDDLES.spots` while it rains and the Keeper is home. One tiny painted sheet, built on the
 * first rain; the batch culls them like any sprite, so a dry day costs nothing.
 */
let sheet: SpriteSheet | null = null;

function puddleSheet(): SpriteSheet {
  if (sheet) return sheet;
  const r = new Raster(48, 30, null);
  r.tracking = true;
  r.ellipse(24, 15, 22, 12, hex('#5f86b4'), 0.85);
  r.ellipse(22, 14, 17, 8, hex('#8fb4dc'), 0.9);
  r.ellipse(16, 11, 6, 2, hex('#e8f2ff'), 0.9);
  r.tracking = false;
  const atlas = new RasterAtlas(64);
  atlas.add('puddle', r);
  sheet = atlas.build();
  return sheet;
}

/** The Grove's puddles are only there in the rain; `fill` is how full they are, 0..1. */
export function puddleFill(world: Pick<World, 'weather' | 'location'>): number {
  if (world.location !== 'grove' || world.weather.kind !== 'rain') return 0;
  return Math.min(1, 0.4 + world.weather.intensity * 0.6);
}

export function drawPuddles(world: ReadonlyWorld, batch: SpriteBatch, tint: number): void {
  const fill = puddleFill(world);
  if (fill <= 0) return;
  const s = puddleSheet();
  const rect = s.frames.get('puddle')!;
  for (const p of PUDDLES.spots)
    batch.draw({
      sheet: s,
      rect,
      flip: false,
      x: p.x,
      y: 0,
      z: p.z,
      mode: 'flat',
      w: PUDDLES.radius * 2 * fill,
      h: PUDDLES.radius * 1.25 * fill,
      opacity: 0.9,
      tint,
    });
}
