import { LANE_GATES } from '../config/region-lane';
import { REGIONS } from '../config/regions';
import { visit } from './neighbourhood';
import { travel } from './regions';
import { markRunWalk } from './keeper';
import { drawnRegionOf } from './region-walk';
import type { SimEvent, World } from './types';

/**
 * R0112 (WORLD-33): the Visit menu's "Walk there". It puts the Keeper on the lane (through the
 * Grove's gate when at home) and starts a walk to that neighbour's gate, which then opens like
 * any gate walked into. The menu's plain "Visit" stays as the quick way (`visit`, straight in).
 * Returns false (and does nothing) from places with no lane to join: then the caller can fall
 * back to the quick visit.
 */
export function visitWalk(world: World, trainer: string, events: SimEvent[]): boolean {
  const gate = LANE_GATES.find((g) => g.id === trainer);
  if (!gate) return false;
  const exit = REGIONS.lane.exits.find((e) => e.id === `lane-${trainer}`);
  if (!exit) return false;
  // From a neighbour's garden, go home first; the lane begins at the Grove's gate.
  if (world.location.startsWith('visit:')) visit(world, null, events);
  if (world.location === 'grove' && !travel(world, 'grove-gate', events)) return false;
  if (drawnRegionOf(world.location) !== 'lane') return false;
  const k = world.keeper;
  k.moveTarget = { x: exit.rect.x + exit.rect.w / 2, z: exit.rect.z + exit.rect.h / 2 };
  k.intent = null;
  markRunWalk(world, k.moveTarget);
  return true;
}
