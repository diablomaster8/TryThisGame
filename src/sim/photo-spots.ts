/**
 * R0138 (WORLD-72): a photo spot is a framed vista. Standing on one says so, once per visit
 * (leaving it and coming back says it again: repeatable for fun), and the first time it is
 * kept in `world.collected` (`photo:<region>`) for the album. The camera itself is the Photo
 * button; this only finds the spot.
 */
import { PHOTO_SPOTS } from '../config/region-extras-r11d6';
import { regionOf } from './regions';
import type { SimEvent, World } from './types';

export const PHOTO_SPOT_RADIUS = 1.6;
const inside = new WeakMap<World, boolean>();

export function stepPhotoSpots(world: World, events: SimEvent[]): void {
  const region = regionOf(world.location);
  const spot = PHOTO_SPOTS[region as keyof typeof PHOTO_SPOTS]?.at;
  if (!spot || world.location !== 'grove') return;
  const k = world.keeper.pos;
  const now = Math.hypot(spot.x - k.x, spot.z - k.z) <= PHOTO_SPOT_RADIUS;
  if (now === (inside.get(world) ?? false)) return;
  inside.set(world, now);
  if (!now) return;
  const key = `photo:${region}`;
  const first = (world.collected ??= {})[key] === undefined;
  if (first) world.collected[key] = world.timeMs;
  events.push({ kind: 'photoSpot', region, first });
}
