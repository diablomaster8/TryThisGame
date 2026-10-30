import { SURFACE_PACE } from '../config/tuning';
import { groundAt } from './terrain';
import type { World } from './types';

/**
 * R0119 (WORLD-52): every walking surface plays a little differently. The Keeper is a touch
 * quicker on a path or a deck than on grass, so the paths guide without arrows. Footfall
 * sounds and prints by surface already come from `render/footfall.ts` and `walk-prints.ts`.
 * Only the Grove's ground is read; the Hollow and the story places keep one pace.
 */
export function surfacePace(world: World, x: number, z: number): number {
  if (world.location !== 'grove') return 1;
  return SURFACE_PACE[groundAt(world, x, z).surface];
}
