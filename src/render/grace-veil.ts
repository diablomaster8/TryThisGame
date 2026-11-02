import { GRACE } from '../config/tuning';
import type { Nubbin } from '../sim/types';

/**
 * The last day (sim/lifecycle.ts): a faint cocoon flickers softly round a Nubbin in its
 * window, as if one were trying to form. Its opacity now, or 0 outside the window; with
 * reduced motion it holds still. Shared by the Pixel and Full 3D renderers.
 */
export function graceVeil(n: Pick<Nubbin, 'graceMs'>, nowMs: number, calm: boolean): number {
  if (typeof n.graceMs !== 'number') return 0;
  if (calm) return GRACE.veilStill;
  const k = 0.5 + 0.5 * Math.sin((nowMs / GRACE.veilPeriodMs) * Math.PI * 2);
  return GRACE.veilMin + (GRACE.veilMax - GRACE.veilMin) * k;
}
