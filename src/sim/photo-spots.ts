/**
 * R0138 (WORLD-72): a photo spot is a framed vista. Standing on one says so, once per visit
 * (leaving it and coming back says it again: repeatable for fun), and the first time it is
 * kept in `world.collected` (`photo:<region>`) for the album. The Grove's spot is authored; a
 * drawn region's is snapped to open ground where its beacon stands in view (R12 d2). The camera
 * itself is the "Take photo" button, which shows while `standingInPhotoSpot` is true.
 */
import { PHOTO_SPOTS } from '../config/region-extras-r11d6';
import { PHOTO_NEAR, type DrawnId } from '../config/region-content-r12d2';
import type { RegionId } from '../config/regions';
import { drawnRegionOf } from './region-walk';
import { spotNear } from './region-spots';
import type { SimEvent, World } from './types';

export const PHOTO_SPOT_RADIUS = 1.6;
const inside = new WeakMap<World, boolean>();
const placed = new Map<RegionId, { x: number; z: number } | null>();

/** Where a region's photo frame stands (region-local), or null when it has none. */
export function photoSpotAt(region: RegionId): { x: number; z: number } | null {
  if (region === 'grove') return PHOTO_SPOTS.grove.at ?? null;
  const want = PHOTO_NEAR[region as DrawnId];
  if (!want) return null;
  if (!placed.has(region)) placed.set(region, spotNear(region, want.x, want.z));
  return placed.get(region)!;
}

/** The region whose frame is on show: the Grove, or the drawn region the Keeper is in. */
function hereRegion(world: Pick<World, 'location'>): RegionId | null {
  return world.location === 'grove' ? 'grove' : drawnRegionOf(world.location);
}

/** Whether the Keeper stands in the frame of the region they are in. */
export function standingInPhotoSpot(world: World): boolean {
  const region = hereRegion(world);
  const spot = region ? photoSpotAt(region) : null;
  if (!spot) return false;
  const k = world.keeper.pos;
  return Math.hypot(spot.x - k.x, spot.z - k.z) <= PHOTO_SPOT_RADIUS;
}

export function stepPhotoSpots(world: World, events: SimEvent[]): void {
  const region = hereRegion(world);
  if (!region) return;
  const now = standingInPhotoSpot(world);
  if (now === (inside.get(world) ?? false)) return;
  inside.set(world, now);
  if (!now) return;
  const key = `photo:${region}`;
  const first = (world.collected ??= {})[key] === undefined;
  if (first) world.collected[key] = world.timeMs;
  events.push({ kind: 'photoSpot', region, first });
}
