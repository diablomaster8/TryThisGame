import { describe, expect, it } from 'vitest';
import { activityCaption, edgePoint, isOffScreen } from '../../src/ui/watch';

/** R0550 (lane A r11): the Watch caption table and the edge-chip geometry. */
const nub = (state: string, itemId: string | null) =>
  ({ name: 'Pip', behavior: { state, itemId } }) as never;

describe('watch captions (R0550)', () => {
  it('names the quirk when there is one, else the state', () => {
    expect(activityCaption(nub('wander', 'butterfly'))).toBe('Pip is chasing a butterfly');
    expect(activityCaption(nub('nap', null))).toBe('Pip is napping');
    expect(activityCaption(nub('eat', 'apple'))).toBe('Pip is eating');
  });
  it('falls back to a wander for anything unknown', () => {
    expect(activityCaption(nub('mystery', 'x'))).toBe('Pip is having a wander');
  });
});

describe('edge chips (R0550)', () => {
  it('knows what is off screen', () => {
    expect(isOffScreen(100, 100, 400, 800, 12)).toBe(false);
    expect(isOffScreen(-30, 100, 400, 800, 12)).toBe(true);
    expect(isOffScreen(100, 900, 400, 800, 12)).toBe(true);
  });
  it('pins the chip to the edge on the side the Nubbin is', () => {
    const e = edgePoint(900, 400, 400, 800, 30);
    expect(e.x).toBeCloseTo(370);
    expect(e.y).toBeCloseTo(400);
    expect(Math.round(e.angle)).toBe(90);
    const up = edgePoint(200, -500, 400, 800, 30);
    expect(up.y).toBeCloseTo(30);
    expect(Math.round(up.angle)).toBe(0);
  });
  it('keeps every chip inside the screen', () => {
    for (const [x, y] of [
      [-900, -900],
      [2000, 40],
      [10, 3000],
      [200, 400],
    ] as const) {
      const e = edgePoint(x, y, 400, 800, 30);
      expect(e.x).toBeGreaterThanOrEqual(30 - 1e-6);
      expect(e.x).toBeLessThanOrEqual(370 + 1e-6);
      expect(e.y).toBeGreaterThanOrEqual(30 - 1e-6);
      expect(e.y).toBeLessThanOrEqual(770 + 1e-6);
    }
  });
});
