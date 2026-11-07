import { GLIDE } from '../config/tuning-move';
import { keeperPerks } from './perks';
import type { World } from './types';

/**
 * MOVE-27 (moved here by R0113, R13 d1, so the drawn regions can glide too without importing
 * the Keeper's physics): how long the Keeper has glided this time in the air, transient, and
 * whether it is gliding now: in the air, falling, jump held, with the Fly perk, and within the
 * glide's time. The renderers read it for the wing overlay.
 */
export const glided = new WeakMap<World, number>();

export function keeperGliding(world: World): boolean {
  const k = world.keeper;
  return (
    !k.grounded &&
    k.vy <= 0 &&
    k.jumpHeld &&
    (glided.get(world) ?? 0) < GLIDE.maxMs &&
    keeperPerks(world).glide
  );
}
