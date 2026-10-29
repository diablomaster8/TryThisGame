import { LITTLE_GROVE } from '../config/tuning-world';
import type { Vec2, World } from './types';

/**
 * R0099 (WORLD-40): the Learning Grove's play area. With the Learning Grove on, the Keeper and
 * the Nubbins stay inside `LITTLE_GROVE`, a 40 x 40 heart round the cottage, the pond and the
 * nearest fruit trees, behind a low picket fence both renderers draw. The Hollow's mouth and the
 * outer ring lie outside it, so nothing there can be reached. A walk target outside is pulled
 * to the fence, so a tap far away walks to the nearest point instead of sticking.
 */
export function inLittleGrove(p: Vec2): boolean {
  const b = LITTLE_GROVE;
  return p.x >= b.minX && p.x <= b.maxX && p.z >= b.minZ && p.z <= b.maxZ;
}

/** Pull `p` inside the play area, `margin` units in from the fence. */
export function clampLittleGrove(p: Vec2, margin: number = LITTLE_GROVE.margin): void {
  const b = LITTLE_GROVE;
  p.x = Math.min(b.maxX - margin, Math.max(b.minX + margin, p.x));
  p.z = Math.min(b.maxZ - margin, Math.max(b.minZ + margin, p.z));
}

/** Each step, with the Learning Grove on in the Grove: everyone stays inside the fence. */
export function stepLittleGrove(world: World): void {
  if (!world.edu || world.location !== 'grove') return;
  const k = world.keeper;
  if (!inLittleGrove(k.pos)) clampLittleGrove(k.pos);
  if (k.moveTarget && !inLittleGrove(k.moveTarget)) {
    k.moveTarget = { ...k.moveTarget };
    clampLittleGrove(k.moveTarget);
  }
  for (const n of world.nubbins) if (!inLittleGrove(n.pos)) clampLittleGrove(n.pos);
}
