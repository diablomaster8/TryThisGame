import { describe, expect, it } from 'vitest';
import { PERF_BUDGET } from '../../src/config/tuning';
import { FrameGovernor } from '../../src/render3d/governor';

const budget = PERF_BUDGET.phone;

describe('geometry budget (WORLD-03)', () => {
  it('raises the level after a run of frames over budget, one step at a time, up to the cap', () => {
    const g = new FrameGovernor(2);
    for (let i = 0; i < PERF_BUDGET.overFrames - 1; i++) g.sampleGeometry(500, 2e6, budget);
    expect(g.geoLevel).toBe(0);
    expect(g.sampleGeometry(500, 2e6, budget)).toBe(1);
    for (let i = 0; i < PERF_BUDGET.overFrames * 10; i++) g.sampleGeometry(500, 2e6, budget);
    expect(g.geoLevel).toBe(PERF_BUDGET.maxLevel);
  });

  it('a single frame under budget restarts the count', () => {
    const g = new FrameGovernor(2);
    for (let i = 0; i < PERF_BUDGET.overFrames - 1; i++)
      g.sampleGeometry(budget.calls + 1, 0, budget);
    g.sampleGeometry(10, 10, budget);
    for (let i = 0; i < PERF_BUDGET.overFrames - 1; i++)
      g.sampleGeometry(budget.calls + 1, 0, budget);
    expect(g.geoLevel).toBe(0);
  });

  it('gives a level back only after a long run well under budget', () => {
    const g = new FrameGovernor(2);
    for (let i = 0; i < PERF_BUDGET.overFrames; i++) g.sampleGeometry(500, 2e6, budget);
    expect(g.geoLevel).toBe(1);
    // Just under budget is not "well under": the level holds.
    for (let i = 0; i < PERF_BUDGET.underFrames * 2; i++)
      g.sampleGeometry(budget.calls - 1, 0, budget);
    expect(g.geoLevel).toBe(1);
    for (let i = 0; i < PERF_BUDGET.underFrames; i++) g.sampleGeometry(10, 10, budget);
    expect(g.geoLevel).toBe(0);
  });
});
