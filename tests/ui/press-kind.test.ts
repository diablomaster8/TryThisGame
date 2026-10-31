import { describe, expect, it } from 'vitest';
import { INPUT } from '../../src/config/tuning';
import { POINTER_INPUT } from '../../src/config/tuning-r9d3';
import { dragThresholdPx, isDrag, isLongPress, isTap } from '../../src/input/press-kind';

/** TECH-30: tap, drag and long press by pointer type. */
describe('press kinds', () => {
  const long = POINTER_INPUT.longPressMs;
  it('uses 6 px for a mouse, 14 for touch, 8 for a pen', () => {
    expect(dragThresholdPx('mouse')).toBe(6);
    expect(dragThresholdPx('touch')).toBe(14);
    expect(dragThresholdPx('pen')).toBe(8);
    expect(dragThresholdPx('other')).toBe(INPUT.dragThresholdPx);
  });

  it('a 12 px touch wobble on a Nubbin is a tap, not a grab; the same on a mouse is a drag', () => {
    expect(isTap('touch', 12, 200)).toBe(true);
    expect(isDrag('touch', 12)).toBe(false);
    expect(isDrag('mouse', 12)).toBe(true);
    expect(isDrag('pen', 12)).toBe(true);
  });

  for (const type of ['mouse', 'touch', 'pen']) {
    const t = dragThresholdPx(type);
    it(`${type}: tap, drag, slow press and long press`, () => {
      expect(isTap(type, 0, 100)).toBe(true);
      expect(isTap(type, t, INPUT.tapMaxMs)).toBe(true);
      expect(isTap(type, t + 1, 100)).toBe(false);
      expect(isTap(type, 0, INPUT.tapMaxMs + 1)).toBe(false);
      expect(isDrag(type, t)).toBe(true);
      expect(isDrag(type, t - 1)).toBe(false);
      // A mouse has hover and drag; only touch and pen lift on a long press.
      expect(isLongPress(type, 0, long)).toBe(type !== 'mouse');
      expect(isLongPress(type, 0, long - 1)).toBe(false);
      expect(isLongPress(type, t, long)).toBe(false);
    });
  }
});
