import type { ReadonlyWorld } from './readonly-world';
import { AMBIENT_LIFE } from '../config/tuning-r11d8';
import { WORLD_STREAM } from '../config/tuning-world';
import { regionOf } from '../sim/regions';
import type { World } from '../sim/types';
import {
  ambientAwake,
  ambientFor,
  ambientPos,
  BIRD,
  BUTTERFLY,
  FISH,
  STRIDE,
  type AmbientPose,
} from './ambient-life';
import { RasterAtlas } from './paint/atlas';
import { hex, Raster } from './paint/raster';
import type { SpriteBatch, SpriteDraw } from './sprite-batch';
import type { SpriteSheet } from './sprites/atlas';

/**
 * R0128 (WORLD-62): the pixel view's ambient life: birds, butterflies and fish shadows drawn
 * as small sprites from the shared per-chunk list (`ambient-life.ts`). One tiny sheet painted
 * on first use, at most about 60 sprites a frame (the chunks round the Keeper), none tappable,
 * none at night or in weather, frozen under reduced motion.
 */
let sheet: SpriteSheet | null = null;

function paint(): SpriteSheet {
  if (sheet) return sheet;
  const atlas = new RasterAtlas(128);
  const mk = (w: number, h: number, f: (r: Raster) => void): Raster => {
    const r = new Raster(w, h, null);
    r.tracking = true;
    f(r);
    r.tracking = false;
    return r;
  };
  const ink = hex('#30303a');
  for (const f of [0, 1])
    atlas.add(
      `bird-${f}`,
      mk(14, 10, (r) => {
        r.ellipse(7, 6, 2.5, 1.6, ink);
        // Wings up, then down.
        if (f) {
          r.line(7, 5, 2, 1, ink);
          r.line(7, 5, 12, 1, ink);
        } else {
          r.line(7, 5, 2, 8, ink);
          r.line(7, 5, 12, 8, ink);
        }
      }),
    );
  const wings = ['#f6d84a', '#f2f2f2', '#e87aa8'].map(hex);
  wings.forEach((c, i) => {
    for (const f of [0, 1])
      atlas.add(
        `fly-${i}-${f}`,
        mk(10, 8, (r) => {
          const w = f ? 4 : 2;
          r.ellipse(5 - w, 3, w, 2.4, c);
          r.ellipse(5 + w, 3, w, 2.4, c);
          r.rect(4.5, 2, 1, 4, hex('#3a2a20'));
        }),
      );
  });
  atlas.add(
    'fish',
    mk(18, 8, (r) => {
      r.ellipse(8, 4, 6, 2.6, hex('#1d3a52'), 0.8);
      r.tri(12, 4, 17, 0, 17, 8, hex('#1d3a52'), 0.8);
    }),
  );
  sheet = atlas.build();
  return sheet;
}

const pose: AmbientPose = { x: 0, y: 0, z: 0, yaw: 0, frame: 0, open: 0 };
const scratch: SpriteDraw = {
  sheet: null as unknown as SpriteSheet,
  rect: { x: 0, y: 0, w: 1, h: 1 },
  flip: false,
  x: 0,
  y: 0,
  z: 0,
  mode: 'billboard',
};

/** Sprites drawn last frame (the debug readout and the budget test read it). */
export let ambientDrawn = 0;

export function drawAmbientPx(
  world: ReadonlyWorld,
  batch: SpriteBatch,
  tint: number,
  tSec: number,
  awake: boolean,
  phone: boolean,
  still: boolean,
): void {
  ambientDrawn = 0;
  const region = regionOf(world.location);
  if (!AMBIENT_LIFE.regions[region]) return;
  const size = WORLD_STREAM.chunk;
  const cx = Math.floor(world.keeper.pos.x / size);
  const cz = Math.floor(world.keeper.pos.z / size);
  const s = paint();
  const R = AMBIENT_LIFE.rings;
  for (let dz = -R; dz <= R; dz++)
    for (let dx = -R; dx <= R; dx++) {
      const rec = ambientFor(region, cx + dx, cz + dz, phone);
      for (let i = 0; i < rec.length / STRIDE; i++) {
        const kind = rec[i * STRIDE]!;
        if (kind !== FISH && !awake) continue;
        ambientPos(rec, i, tSec, still, pose);
        const key =
          kind === BIRD
            ? `bird-${pose.frame}`
            : kind === BUTTERFLY
              ? `fly-${rec[i * STRIDE + 7]}-${pose.frame}`
              : 'fish';
        const rect = s.frames.get(key);
        if (!rect) continue;
        scratch.sheet = s;
        scratch.rect = rect;
        scratch.flip = Math.cos(pose.yaw) < 0;
        scratch.x = pose.x;
        scratch.y = pose.y;
        scratch.z = pose.z;
        scratch.mode = kind === FISH ? 'flat' : 'billboard';
        const w = kind === BIRD ? 0.9 : kind === BUTTERFLY ? 0.4 : 0.8;
        scratch.w = w;
        scratch.h = (w * rect.h) / rect.w;
        scratch.tint = tint;
        scratch.opacity = kind === FISH ? 0.55 : 1;
        batch.draw(scratch);
        ambientDrawn++;
      }
    }
}

export { ambientAwake };
