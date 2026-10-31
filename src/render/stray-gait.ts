/**
 * R0326 (FUN-37, lane E r10): how a Hollow stray walks, read by both renderers. It tiptoes
 * when it creeps up on a Keeper with Shells to take (slow steps, up on its toes), and
 * wobbles off overloaded while it carries snatched Shells. Render only: the sim is untouched.
 */
import type { DungeonStray, Vec2 } from '../sim/types';

export type StrayGait = 'walk' | 'tiptoe' | 'wobble';

export const STRAY_GAIT = {
  /** Creeping counts within this distance of the Keeper. */
  creepReach: 4.5,
  /** A tiptoe plays the walk at this share of its pace, lifted by up to `tipLift`. */
  tipPace: 0.5,
  tipLift: 0.07,
  /** The overloaded sway: sideways in world units (Pixel), turn in radians (3D), and rate. */
  wobbleSide: 0.08,
  wobbleTurn: 0.35,
  wobbleHz: 2.2,
} as const;

export function strayGait(s: DungeonStray, keeper: Vec2, shells: number): StrayGait {
  if ((s.carrying ?? 0) > 0) return 'wobble';
  if (s.cooldownMs > 0 || s.shooed || shells <= 0 || !s.target) return 'walk';
  return Math.hypot(keeper.x - s.pos.x, keeper.z - s.pos.z) < STRAY_GAIT.creepReach
    ? 'tiptoe'
    : 'walk';
}

/** The tiptoe's lift at wall time `nowMs` (0 when still). */
export function tipLift(nowMs: number, still: boolean): number {
  return still ? 0 : Math.abs(Math.sin(nowMs / 160)) * STRAY_GAIT.tipLift;
}

/** The wobble's sway, -1..1, at wall time `nowMs` (0 when still). */
export function wobble(nowMs: number, still: boolean): number {
  return still ? 0 : Math.sin((nowMs / 1000) * STRAY_GAIT.wobbleHz * Math.PI * 2);
}
