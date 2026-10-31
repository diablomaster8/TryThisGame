/**
 * TECH-62 (R0503): how cracked an egg looks, 0 (whole) to 5 (about to hatch), shared by the
 * pixel frames (`crack1`..`crack5` in sprites/egg.ts) and the Full 3D crack line. It follows
 * hatch progress, so every shake (15 s off the wait) moves it on about one step, and an egg
 * left alone cracks the same way. Render-only: reads the Nubbin, writes nothing.
 */
import { EGG } from '../config/tuning';
import { EGG_CRACK } from '../config/tuning-r10d2';
import type { Nubbin } from '../sim/types';

export type CrackStage = 0 | 1 | 2 | 3 | 4 | 5;

export function crackStage(n: Pick<Nubbin, 'hatchRemainingMs'>): CrackStage {
  if (n.hatchRemainingMs < EGG_CRACK.lastStageMs) return 5;
  const done = Math.min(1, Math.max(0, 1 - n.hatchRemainingMs / EGG.hatchMs));
  return Math.min(5, Math.floor(done * EGG_CRACK.bins)) as CrackStage;
}
