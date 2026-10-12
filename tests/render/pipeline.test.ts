import { describe, expect, it } from 'vitest';
import { computeTargetSize } from '../../src/render/pipeline';

describe('computeTargetSize', () => {
  it('keeps the frame at the target height and derives width from the aspect ratio', () => {
    const size = computeTargetSize(1920, 1080, 270);
    expect(size.height).toBe(270);
    expect(size.width).toBe(480);
    expect(size.scale).toBe(4);
  });

  it('handles portrait phones', () => {
    const size = computeTargetSize(390, 844, 270);
    expect(size.height).toBe(270);
    expect(size.width).toBe(125);
  });

  it('handles landscape phones', () => {
    const size = computeTargetSize(844, 390, 270);
    expect(size.width).toBe(584);
    expect(size.height).toBe(270);
  });

  it('rounds width to whole pixels', () => {
    const size = computeTargetSize(1000, 700, 270);
    expect(Number.isInteger(size.width)).toBe(true);
    expect(size.width).toBe(386);
  });

  it('never produces a zero-sized frame', () => {
    expect(computeTargetSize(0, 0, 270)).toEqual({ width: 270, height: 270, scale: 1 / 270 });
    expect(computeTargetSize(1, 10000, 270).width).toBe(1);
  });

  it('uses the configured default target height', () => {
    expect(computeTargetSize(1600, 900).height).toBe(270);
  });
});
