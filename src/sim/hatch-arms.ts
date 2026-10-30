import { EGG_HUG } from '../config/tuning-tech';
import { putDown } from './behavior';
import { addAffection } from './needs';
import type { Nubbin, SimEvent, World } from './types';

/**
 * TECH-18: an egg whose time comes while the Keeper holds or carries it is set down at the
 * Keeper's feet as it pops, so it hatches in the arms instead of waiting to be put down.
 * The child gets a first-hug affection bonus; the hatch itself follows in `stepWorld`.
 */
export function hatchInArms(world: World, n: Nubbin, events: SimEvent[]): void {
  const k = world.keeper;
  if (k.carrying === n.id) {
    k.carrying = null;
    n.pos = { x: k.pos.x, z: k.pos.z };
  }
  putDown(n, world.timeMs, events);
  addAffection(n, EGG_HUG.affection);
}
