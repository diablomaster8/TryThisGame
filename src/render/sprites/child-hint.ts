/**
 * LOOK-49: how far a child's look leans toward the Sun or Moon band. The hint fades in with
 * |alignment| between `CHILD_HINT.from` and `.to` instead of flipping at one threshold, so a
 * child drifts visibly toward white-and-blue or purple as the Keeper's care adds up. Both
 * renderers read it: Pixel in two palette steps, Full 3D in `steps3d` colour blends.
 */
import { CHILD_HINT } from '../../config/tuning';

export interface ChildLean {
  band: 'sun' | 'moon' | 'neutral';
  /** 0 (no hint) … 1 (the full Sun or Moon child). */
  k: number;
}

export function childLean(alignment: number): ChildLean {
  const a = Math.abs(alignment);
  const k = Math.min(1, Math.max(0, (a - CHILD_HINT.from) / (CHILD_HINT.to - CHILD_HINT.from)));
  if (a < CHILD_HINT.from) return { band: 'neutral', k: 0 };
  // Just past `from` the lean is already a step in, so the first change is visible.
  return { band: alignment > 0 ? 'sun' : 'moon', k: Math.max(k, 1e-3) };
}

/** The lean as whole steps of `steps` (1 … steps), 0 for a neutral child. */
export function leanStep(lean: ChildLean, steps: number): number {
  return lean.band === 'neutral' ? 0 : Math.max(1, Math.ceil(lean.k * steps - 1e-9));
}
