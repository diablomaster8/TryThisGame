/**
 * R0448 (TECH-06): the pulsing ring on the first loop's target, shared by both renderers.
 * Pure: it names the spot (the waiting egg, or the child a pat / feed / name / toss step is
 * about) and the pulse at a moment. Under reduced motion the ring still shows, held steady.
 */
import { wantsFirstFruit } from '../sim/first-feed';
import { firstLoopStep } from '../sim/first-loop';
import type { ReadonlyWorld } from '../render/readonly-world';
import type { World } from '../sim/types';

export interface FirstLoopSpot {
  x: number;
  z: number;
  /** What the ring marks, for tests and the 3D mesh name. */
  kind: 'egg' | 'pat' | 'feed' | 'name' | 'toss';
}

export const FIRST_RING = {
  radius: 0.62,
  lift: 0.04,
  pulseMs: 1100,
} as const;

/** The ring's spot for this world, or null when the loop is over, skipped or not at home. */
export function firstLoopSpot(world: ReadonlyWorld): FirstLoopSpot | null {
  if (world.location !== 'grove' || world.diary?.loopSkipped) return null;
  const w = world as unknown as World;
  const living = w.nubbins;
  if (living.length === 0) return null;
  const held = (id: string): boolean =>
    w.nubbins.find((n) => n.id === id)?.behavior.state === 'held';
  if (living.every((n) => n.stage === 'egg')) {
    const egg = living.find((n) => n.behavior.state !== 'held') ?? null;
    return egg ? { x: egg.pos.x, z: egg.pos.z, kind: 'egg' } : null;
  }
  const loop = firstLoopStep(w);
  if (loop && !held(loop.nubbin.id))
    return { x: loop.nubbin.pos.x, z: loop.nubbin.pos.z, kind: loop.step };
  if (!loop) {
    const fresh = living.find(wantsFirstFruit);
    if (fresh && !held(fresh.id)) return { x: fresh.pos.x, z: fresh.pos.z, kind: 'feed' };
  }
  return null;
}

/** The pulse at `nowMs`: a scale and an opacity; a fixed pair when motion is reduced. */
export function firstRingPulse(nowMs: number, calm: boolean): { scale: number; opacity: number } {
  if (calm) return { scale: 1, opacity: 0.9 };
  const k = 0.5 + 0.5 * Math.sin((nowMs / FIRST_RING.pulseMs) * Math.PI * 2);
  return { scale: 0.9 + 0.22 * k, opacity: 0.55 + 0.4 * (1 - k) };
}
