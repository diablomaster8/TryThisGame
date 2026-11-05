import { describe, expect, it } from 'vitest';
import { FrameGovernor } from '../../src/render3d/governor';

// R0454 (TECH-12, r12-d3): a visual test pins the governor at full quality, whatever the
// machine's frame times, so a golden never depends on how slow the CI runner was.
describe('frame governor pin', () => {
  it('drops every saving, hands back the full scale once, then ignores slow frames', () => {
    const g = new FrameGovernor(2);
    for (let i = 0; i < 400; i++) g.sample(120);
    expect(g.ratio < g.maxRatio || g.cpuLevel > 0).toBe(true);
    g.pin();
    expect(g.sample(120)).toBe(g.maxRatio);
    for (let i = 0; i < 400; i++) expect(g.sample(200)).toBeNull();
    expect(g.ratio).toBe(g.maxRatio);
    expect(g.cpuLevel).toBe(0);
    expect(g.shedLevel).toBe(0);
    expect(g.forcedGeo).toBe(0);
  });
});
