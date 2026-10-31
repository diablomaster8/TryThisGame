/**
 * R0299 (FUN-10, lane E r10): the splat when a thrown Nubbin meets a trunk or a wall: it
 * goes wide and flat against it at once, holds a beat, then springs back as it slides down
 * to land (the sim's landing and its dizzy stars follow). Shared by both renderers.
 */
export const SPLAT = {
  /** The whole splat, ms (the item's 0.4 s). */
  ms: 400,
  /** Width and height scale at full splat. */
  wide: 1.4,
  flat: 0.55,
  /** The share of the splat held flat before it springs back. */
  hold: 0.6,
} as const;

/** 0..1, how splatted at `t` (0..1 through the splat): flat at once, held, then eased back. */
export function splatAmount(t: number): number {
  if (t <= 0 || t >= 1) return 0;
  if (t < SPLAT.hold) return 1;
  const u = (t - SPLAT.hold) / (1 - SPLAT.hold);
  return 1 - u * u;
}
