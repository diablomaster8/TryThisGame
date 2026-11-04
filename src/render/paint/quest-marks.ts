import { frameKey } from '../sprites/animations';
import type { SpriteSheet } from '../sprites/atlas';
import { RasterAtlas } from './atlas';
import { hex, Raster, rimObjects } from './raster';

/**
 * R0608: the two world markers, painted once at 32 texels per world unit like the rest of the
 * dressing sheets. `markOffer` is a gold exclamation mark on a cream disc; `markStep` is a teal
 * diamond with a pale core. Different shapes as well as colours, so neither relies on colour.
 */
const GOLD = hex('#f2b723');
const INK = hex('#5a3a12');
const CREAM = hex('#fff6d0');
const TEAL = hex('#27b5a6');
const TEAL_DARK = hex('#14665e');
const PALE = hex('#d8fff6');

function fin(r: Raster): Raster {
  r.tracking = false;
  rimObjects(r);
  return r;
}

function offer(): Raster {
  const r = new Raster(16, 22, null);
  r.tracking = true;
  r.disc(8, 11, 7.2, CREAM);
  r.disc(8, 11, 5.8, GOLD);
  r.rect(7, 5, 3, 8, INK);
  r.rect(7, 15, 3, 3, INK);
  r.rect(7, 5, 1, 8, CREAM);
  return fin(r);
}

function step(): Raster {
  const r = new Raster(16, 22, null);
  r.tracking = true;
  r.tri(8, 2, 1, 11, 15, 11, TEAL);
  r.tri(8, 20, 1, 11, 15, 11, TEAL_DARK);
  r.tri(8, 6, 4, 11, 12, 11, PALE);
  r.tri(8, 16, 4, 11, 12, 11, TEAL);
  return fin(r);
}

export function buildQuestMarkSheet(): SpriteSheet {
  const atlas = new RasterAtlas(128);
  atlas.add(frameKey('markOffer', 'front', 0), offer());
  atlas.add(frameKey('markStep', 'front', 0), step());
  return atlas.build();
}
