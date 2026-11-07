import type { ReadonlyWorld } from './readonly';
import { RIDGE_SNOW_Y, RIDGE_SPEC } from '../config/region-ridge';
import { terraceHeight } from '../config/region-layout';
import { SNOWBALL } from '../config/tuning-more/world-region-content';
import { drawnRegion } from './region-walk';
import type { World } from './types';

/**
 * R0113 (WORLD-36, R13 d1): snowballs. On the ridge's permanent snow (from the terrace level
 * `RIDGE_SNOW_Y` up) the Keeper scoops and lobs one along its facing, an arc over `flightMs`.
 * Transient: never saved, never in the world hash; a reload has none in the air.
 */
export interface Snowball {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  age: number;
}

const live = new WeakMap<ReadonlyWorld, Snowball[]>();
const lastThrow = new WeakMap<ReadonlyWorld, number>();

/** The balls in the air (stable array; the renderers read it each frame). */
export function snowballs(world: ReadonlyWorld): readonly Snowball[] {
  return live.get(world) ?? [];
}

/** Whether the Keeper stands on the ridge's snow. */
export function snowHere(world: World): boolean {
  if (drawnRegion(world) !== 'ridge') return false;
  return terraceHeight(RIDGE_SPEC, world.keeper.pos.z) >= RIDGE_SNOW_Y - 0.01;
}

export function throwSnowball(world: World): boolean {
  if (!snowHere(world)) return false;
  const list = live.get(world) ?? [];
  live.set(world, list);
  if (list.length >= SNOWBALL.max) return false;
  const last = lastThrow.get(world);
  if (last !== undefined && world.timeMs - last < SNOWBALL.cooldownMs) return false;
  lastThrow.set(world, world.timeMs);
  const k = world.keeper;
  list.push({
    x: k.pos.x,
    y: k.y + SNOWBALL.startY,
    z: k.pos.z,
    vx: Math.sin(k.facing) * SNOWBALL.speed,
    vy: SNOWBALL.lob,
    vz: Math.cos(k.facing) * SNOWBALL.speed,
    age: 0,
  });
  return true;
}

export function stepSnowballs(world: World, dtMs: number): void {
  const list = live.get(world);
  if (!list || list.length === 0) return;
  const dt = dtMs / 1000;
  for (let i = list.length - 1; i >= 0; i--) {
    const b = list[i]!;
    b.age += dtMs;
    b.vy -= SNOWBALL.gravity * dt;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.z += b.vz * dt;
    const ground = terraceHeight(RIDGE_SPEC, b.z);
    if (b.age >= SNOWBALL.flightMs || b.y <= ground) list.splice(i, 1);
  }
}
