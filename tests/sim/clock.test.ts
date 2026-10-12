import { describe, expect, it } from 'vitest';
import { Clock, splitSpan } from '../../src/sim/clock';

describe('Clock', () => {
  it('emits 10 steps per real second at ×1', () => {
    const c = new Clock(100);
    expect(c.advance(1000)).toBe(10);
    expect(c.alpha).toBe(0);
  });

  it('keeps the remainder for interpolation', () => {
    const c = new Clock(100);
    expect(c.advance(150)).toBe(1);
    expect(c.alpha).toBeCloseTo(0.5);
    expect(c.advance(50)).toBe(1);
  });

  it('scales time', () => {
    const c = new Clock(100);
    c.setTimeScale(1000);
    expect(c.advance(10)).toBe(100);
  });

  it('caps steps per frame and keeps the overflow', () => {
    const c = new Clock(100);
    c.setTimeScale(1000);
    expect(c.advance(1000, 400)).toBe(400);
    expect(c.takeOverflowMs()).toBe(1_000_000 - 40_000);
    expect(c.alpha).toBe(0);
  });

  it('rejects bad scales', () => {
    const c = new Clock();
    expect(() => c.setTimeScale(0)).toThrow();
    expect(() => c.setTimeScale(-5)).toThrow();
  });
});

describe('splitSpan', () => {
  it('uses fine steps for short gaps', () => {
    expect(splitSpan(2 * 60_000, 60_000, 100, 3 * 60_000)).toEqual({
      coarseSteps: 0,
      fineSteps: 1200,
    });
  });

  it('uses coarse steps plus a fine remainder for long gaps', () => {
    const r = splitSpan(7 * 24 * 3_600_000 + 30_500, 60_000, 100, 3 * 60_000);
    expect(r.coarseSteps).toBe(7 * 24 * 60);
    expect(r.fineSteps).toBe(305);
  });

  it('is zero for nothing', () => {
    expect(splitSpan(0)).toEqual({ coarseSteps: 0, fineSteps: 0 });
    expect(splitSpan(-5)).toEqual({ coarseSteps: 0, fineSteps: 0 });
  });
});
