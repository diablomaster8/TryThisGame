/**
 * Lane E round 10 (R0710 KIDS-42): Simple touch for small or unsteady hands. The access
 * module marks `<html>` with `a11y-simple-touch`; input reads the mark (as it reads
 * `reduce-motion`), so it needs no world. While on: no pinch or two-finger turn, no drag,
 * throw or long-press lift, a slow or wobbly press still counts as a tap, and a tap on a
 * Nubbin or egg cares for it (the `tapCare` command).
 */
import { INPUT } from '../config/tuning';
import { SIMPLE_TOUCH } from '../config/tuning-access-r10';

export const SIMPLE_TOUCH_CLASS = 'a11y-simple-touch';

export function simpleTouchOn(): boolean {
  return (
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains(SIMPLE_TOUCH_CLASS)
  );
}

/** A release that counts as a tap under Simple touch: generous in time and travel. */
export function isSimpleTap(movedPx: number, heldMs: number): boolean {
  return movedPx <= SIMPLE_TOUCH.tapMovePx && heldMs <= SIMPLE_TOUCH.tapMaxMs;
}

/** The Nubbin near-miss radius in CSS px. */
export function pickSlopPx(simple: boolean): number {
  return INPUT.nubbinPickSlopPx * (simple ? SIMPLE_TOUCH.pickSlopScale : 1);
}
