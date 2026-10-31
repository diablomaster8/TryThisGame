/**
 * TECH-30: what a press is, by pointer type. A fingertip wobbles more than a mouse, so a
 * touch needs 14 px of travel before a press on a Nubbin turns into a grab (6 px for a mouse,
 * 8 for a pen). A touch or pen held still for `longPressMs` lifts the Nubbin gently instead,
 * since phones have no hover. Pure, so the tests can walk every pointer type.
 */
import { INPUT } from '../config/tuning';
import { POINTER_INPUT } from '../config/tuning-r9d3';

export function dragThresholdPx(pointerType: string): number {
  return POINTER_INPUT.dragPx[pointerType] ?? INPUT.dragThresholdPx;
}

/** A release that counts as a tap: barely moved and quick. */
export function isTap(pointerType: string, movedPx: number, heldMs: number): boolean {
  return movedPx <= dragThresholdPx(pointerType) && heldMs <= INPUT.tapMaxMs;
}

/** Movement that turns a press on a Nubbin into a grab. */
export function isDrag(pointerType: string, movedPx: number): boolean {
  return movedPx >= dragThresholdPx(pointerType);
}

/** A held-still touch or pen press long enough to lift (a mouse has hover and drag instead). */
export function isLongPress(pointerType: string, movedPx: number, heldMs: number): boolean {
  return (
    pointerType !== 'mouse' &&
    movedPx < dragThresholdPx(pointerType) &&
    heldMs >= POINTER_INPUT.longPressMs
  );
}
