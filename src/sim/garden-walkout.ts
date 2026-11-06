import { LANE_GATES } from '../config/region-lane';
import { GARDEN_WALKOUT } from '../config/tuning-r13d1';

import { setLocation } from './campaign';
import { regionLocation } from './region-walk';
import { noteRegion } from './regions';
import { visitingTrainer } from './neighbourhood';
import type { SimEvent, World } from './types';

/**
 * R0112 (WORLD-33, R13 d1): walking out of a neighbour's garden. Its gate stands south of where a
 * visitor arrives; walking to it puts the Keeper back on the lane, just outside that garden's
 * gate, facing the lane. The Visit menu's way home (the Grove) is unchanged.
 */
export function stepGardenWalkout(world: World, events: SimEvent[]): void {
  const t = visitingTrainer(world);
  if (!t) return;
  const g = LANE_GATES.find((x) => x.id === t);
  if (!g) return;
  const k = world.keeper;
  if (
    Math.hypot(k.pos.x - GARDEN_WALKOUT.gate.x, k.pos.z - GARDEN_WALKOUT.gate.z) > GARDEN_WALKOUT.r
  )
    return;
  setLocation(world, regionLocation('lane'), events);
  k.pos = { x: g.x - g.side * 3, z: g.z };
  k.moveTarget = null;
  k.intent = null;
  k.facing = -g.side * (Math.PI / 2);
  noteRegion(world, events);
}
