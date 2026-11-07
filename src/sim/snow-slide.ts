import { RIDGE_SNOW_Y, RIDGE_SPEC } from '../config/region-ridge';
import { terraceHeight } from '../config/region-layout';
import { SNOW_SLIDE } from '../config/tuning-r15d1';
import type { RegionId } from '../config/regions';
import type { World } from './types';

/**
 * R0118 (WORLD-51): the snow slide on the ridge's snow. `stepRegionWalk` hands its stick
 * movement through `slideOnSnow`, which returns the heading and speed to move with: on the
 * snow, velocity eases toward the stick (low steering) and carries on after it is released;
 * anywhere else, or on a tap walk, the movement passes through untouched and the slide resets.
 */
const vel = new WeakMap<World, { x: number; z: number }>();

/** Whether a ridge position is on the snow terraces (the same line the snowballs use). */
export function onSnowAt(region: RegionId, z: number): boolean {
  return region === 'ridge' && terraceHeight(RIDGE_SPEC, z) >= RIDGE_SNOW_Y - 0.01;
}

export function slideOnSnow(
  world: World,
  region: RegionId,
  stick: boolean,
  dx: number,
  dz: number,
  speed: number,
  dtSec: number,
): { dx: number; dz: number; speed: number } {
  const k = world.keeper;
  const v = vel.get(world);
  if (!onSnowAt(region, k.pos.z) || !k.grounded || (!stick && !v)) {
    if (v) vel.delete(world);
    return { dx, dz, speed };
  }
  const cur = v ?? { x: 0, z: 0 };
  const want = stick ? speed * SNOW_SLIDE.speedMul : 0;
  const a = Math.min(1, dtSec * SNOW_SLIDE.rate);
  cur.x += (dx * want - cur.x) * a;
  cur.z += (dz * want - cur.z) * a;
  const s = Math.hypot(cur.x, cur.z);
  if (!stick && s < SNOW_SLIDE.stopSpeed) {
    vel.delete(world);
    return { dx: 0, dz: 0, speed: 0 };
  }
  vel.set(world, cur);
  return s > 0 ? { dx: cur.x / s, dz: cur.z / s, speed: s } : { dx, dz, speed: 0 };
}

/** A tap walk or a change of place ends any slide. */
export function stopSlide(world: World): void {
  vel.delete(world);
}

/** Whether the Keeper is sliding now (a coast or a stick on the snow): the renderers may lean in. */
export function sliding(world: World): boolean {
  return vel.has(world);
}
