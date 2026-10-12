import { describe, expect, it } from 'vitest';
import { computeTargetSize } from '../../src/render/pipeline';

describe('computeTargetSize', () => {
  it('keeps the frame at the target height and derives width from the aspect ratio', () => {
    const size = computeTargetSize(1920, 1080, 270);
    expect(size.height).toBe(270);
    expect(size.width).toBe(480);
    expect(size.scale).toBe(4);
  });

  it('handles portrait phones with a whole-number upscale', () => {
    const size = computeTargetSize(390, 844, 270);
    expect(size.scale).toBe(3);
    expect(size.height).toBe(282);
    expect(size.width).toBe(130);
  });

  it('handles landscape phones', () => {
    const size = computeTargetSize(844, 390, 270);
    expect(size.scale).toBe(1);
    expect(size.width).toBe(844);
    expect(size.height).toBe(390);
  });

  it('always upscales by a whole number and covers the viewport', () => {
    for (const [w, h] of [
      [1000, 700],
      [2560, 1440],
      [1366, 768],
      [412, 915],
    ] as const) {
      const size = computeTargetSize(w, h, 270);
      expect(Number.isInteger(size.scale)).toBe(true);
      expect(size.width * size.scale).toBeGreaterThanOrEqual(w);
      expect(size.height * size.scale).toBeGreaterThanOrEqual(h);
      expect(size.height).toBeGreaterThanOrEqual(180);
      expect(size.height).toBeLessThanOrEqual(405);
    }
  });

  it('never produces a zero-sized frame', () => {
    expect(computeTargetSize(0, 0, 270)).toEqual({ width: 1, height: 1, scale: 1 });
    expect(computeTargetSize(1, 10000, 270).width).toBe(1);
  });

  it('uses the configured default target height to pick the scale', () => {
    const size = computeTargetSize(1600, 900);
    expect(size.scale).toBe(3);
    expect(size.height).toBe(300);
  });
});
