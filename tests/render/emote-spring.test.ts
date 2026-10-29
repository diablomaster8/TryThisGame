import { describe, expect, it } from 'vitest';
import { EmoteSprings, popScale } from '../../src/render/emote-spring';

describe('emote spring (LOOK-16)', () => {
  it('swings on a jump of the anchor and settles within 0.6 s', () => {
    const s = new EmoteSprings();
    s.step('a', 0, 2, 0, 'ball', 0, 0.25, 0, null);
    // The Nubbin turns: the anchor over its swept-back point jumps 0.2 to the side.
    let p = s.step('a', 0.2, 2, 0, 'ball', 16, 0.25, 0, null);
    expect(p.x).toBeLessThan(0.05);
    let maxOver = 0;
    for (let ms = 32; ms <= 600; ms += 16) {
      p = s.step('a', 0.2, 2, 0, 'ball', ms, 0.25, 0, null);
      maxOver = Math.max(maxOver, p.x - 0.2);
    }
    expect(maxOver).toBeGreaterThan(0.005);
    expect(Math.abs(p.x - 0.2)).toBeLessThan(0.03);
  });

  it('never lags past the clamp and snaps to the grid', () => {
    const s = new EmoteSprings();
    s.step('a', 0, 0, 0, 'ball', 0, 0.25, 0, null);
    const p = s.step('a', 5, 0, 0, 'ball', 16, 0.25, 1 / 16, null);
    expect(5 - p.x).toBeCloseTo(0.25, 5);
    expect((p.x * 16) % 1).toBeCloseTo(0, 5);
  });

  it('pops on a change of shape and squashes on a landing', () => {
    expect(popScale(0)).toBeCloseTo(0.6);
    expect(popScale(0.5)).toBeCloseTo(1.15);
    expect(popScale(1)).toBe(1);
    const s = new EmoteSprings();
    s.step('a', 0, 0, 0, 'ball', 0, 0.25, 0, null);
    expect(s.step('a', 0, 0, 0, 'heart', 1000, 0.25, 0, null).sy).toBeCloseTo(0.6);
    const l = s.step('a', 0, 0, 0, 'heart', 2000, 0.25, 0, 1950);
    expect([l.sx, l.sy]).toEqual([1.15, 0.85]);
  });
});
