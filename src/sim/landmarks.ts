import { GROVE, LANDMARKS } from '../config/tuning';
import { clampToWorld } from './behavior';
import type { SimEvent, Vec2, World } from './types';

/** Landmarks are found by walking up to them; found ones are fast-travel spots. */
export function stepLandmarks(world: World, events: SimEvent[]): void {
  if (world.location !== 'grove') return;
  for (const l of LANDMARKS) {
    if (world.landmarks[l.id] !== undefined) continue;
    if (Math.hypot(world.keeper.pos.x - l.x, world.keeper.pos.z - l.z) < 2.2) {
      world.landmarks[l.id] = world.timeMs;
      events.push({ kind: 'landmarkFound', id: l.id });
    }
  }
}

export function teleport(world: World, pos: Vec2): void {
  const p = { x: pos.x, z: pos.z };
  clampToWorld(p);
  world.keeper.pos = p;
  world.keeper.moveTarget = null;
  world.keeper.intent = null;
}

export function landmarkList(): ReadonlyArray<{ id: string; x: number; z: number }> {
  return LANDMARKS;
}

export { GROVE };
