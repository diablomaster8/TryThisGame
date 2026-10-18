import { describe, expect, it } from 'vitest';
import { GROVE3D } from '../../src/config/tuning';
import { FrameGovernor } from '../../src/render3d/governor';

/** The Full 3D governor trades render scale for frame time only where that helps. */
const feed = (g: FrameGovernor, frames: number, ms: (ratio: number) => number) => {
  for (let i = 0; i < frames; i++) g.sample(ms(g.ratio));
};

describe('frame-time governor', () => {
  it('starts at the device ratio, capped', () => {
    expect(new FrameGovernor(3).ratio).toBe(GROVE3D.governor.maxRatio);
    expect(new FrameGovernor(1).ratio).toBe(1);
  });

  it('lowers the scale while a fill-bound frame runs slow, and stops once it is fast', () => {
    const g = new FrameGovernor(1.5);
    // Frame time grows with the pixel count: 45 ms at 1.5.
    feed(g, 400, (r) => 45 * (r / 1.5) ** 2);
    expect(g.ratio).toBeLessThan(1.5);
    expect(45 * (g.ratio / 1.5) ** 2).toBeLessThanOrEqual(GROVE3D.governor.slowMs);
    expect(g.ratio).toBeGreaterThanOrEqual(GROVE3D.governor.minRatio);
  });

  it('takes a step back when fewer pixels buy no time (a CPU-bound frame)', () => {
    const g = new FrameGovernor(1.5);
    feed(g, 2000, () => 40);
    expect(g.ratio).toBe(1.5);
  });

  it('raises the scale again once frames come easily', () => {
    const g = new FrameGovernor(1.5);
    feed(g, 400, (r) => 45 * (r / 1.5) ** 2);
    const low = g.ratio;
    feed(g, 3000, () => 12);
    expect(g.ratio).toBeGreaterThan(low);
    expect(g.ratio).toBeLessThanOrEqual(1.5);
  });

  it('ignores stalls and hidden-tab gaps', () => {
    const g = new FrameGovernor(1.5);
    feed(g, 500, () => 1000);
    expect(g.ratio).toBe(1.5);
  });
});
