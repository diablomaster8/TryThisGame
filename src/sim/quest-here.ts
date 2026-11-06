import { regionOf } from './regions';
import { questAreaKey } from './quest-offers';
import { sideStory } from './story-scenes';
import type { World } from './types';

/**
 * R13 d2 (R0100): is the objective chip key `quest:<id>:<step>` a quest whose area is the
 * drawn region the Keeper stands in (not the Grove)? Those show first on the chip there, so the
 * beacon and edge arrow lead to the region's own goal.
 */
export function questKeyHere(world: World, key: string): boolean {
  const parts = key.split(':');
  if (parts[0] !== 'quest' || !parts[1]) return false;
  const here = regionOf(world.location);
  if (here === 'grove') return false;
  const quest = sideStory(parts[1]);
  const area = quest ? questAreaKey(quest) : null;
  return !!area && area.split('/')[0] === here;
}
