import { readSave } from '../platform/storage';
import { deserialize } from '../sim/save';
import { earlyPool, openingLooks } from './creature-pool';
import { pickSculptRes, qualityForRes } from './sculpt-res';

/**
 * Start sculpting the saved Grove's creatures before the 3D scene is built. Building the
 * scene takes the main thread for a second or more (several on a phone); queued now, the
 * workers march (or read the cache) all through it. The world here is the save as stored,
 * before offline catch-up, so a Nubbin that evolved while away is warmed in its old look
 * as well: a little wasted work, never a wrong figure. Any failure leaves the scene to
 * warm the creatures itself.
 */
export function prewarmCreatures(): void {
  try {
    const json = readSave();
    if (!json) return;
    const world = deserialize(json).world;
    // Benchmark before the pool exists: its workers start loading as it is made.
    const quality = qualityForRes(world.settings.sculptRes ?? pickSculptRes());
    const pool = earlyPool();
    pool.quality = quality;
    pool.warm(openingLooks(world));
  } catch {
    // No usable save: the scene warms what the Game loads.
  }
}
