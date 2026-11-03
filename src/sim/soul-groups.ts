/**
 * Lane A round 11 (SOUL), helper G3: the one step that runs the group-play acts (ambient
 * critters to chase, jam sessions and the rest). world.ts calls it once per sim step.
 */
import { stepAmbient } from './ambient';
import { stepJams } from './jam';
import type { SimEvent, World } from './types';

export function stepSoulGroups(
  world: World,
  dtMs: number,
  events: SimEvent[],
  offline: boolean,
): void {
  stepAmbient(world, dtMs, events, offline);
  stepJams(world, dtMs, events, offline);
}
