import { describe, expect, it } from 'vitest';
import type { JumpRoute } from '../../src/config/region-jumps';
import {
  checkJumpMetrics,
  checkJumpRoute,
  checkJumpRoutes,
  jumpReach,
} from '../../src/sim/regions-jump';

describe('jump spaces (WORLD-21)', () => {
  it('the metrics sit inside what the Keeper can really jump', () => {
    expect(checkJumpMetrics()).toEqual([]);
    const r = jumpReach();
    // The numbers the metrics doc states, so a change to the jump shows up here first.
    expect(r.singleRise).toBeCloseTo(0.95);
    expect(r.doubleRise).toBeCloseTo(1.7);
    expect(r.singleGapWalk).toBeGreaterThan(1.6);
    expect(r.doubleGapRun).toBeGreaterThan(3.6);
  });

  it('every built route fits the metrics and has a walking way round', () => {
    expect(checkJumpRoutes()).toEqual([]);
  });

  it('catches a gap too wide, a rise too high and a missing way round', () => {
    const base: JumpRoute = {
      id: 'stones',
      kind: 'stones',
      gap: 1.6,
      rise: 0,
      run: false,
      from: { x: 0, z: 0 },
      to: { x: 4, z: 0 },
      walkAround: 'bridge',
    };
    expect(checkJumpRoute('grove', base)).toEqual([]);
    expect(checkJumpRoute('grove', { ...base, gap: 2.4 })).toHaveLength(1);
    expect(checkJumpRoute('grove', { ...base, kind: 'double', rise: 1.8 })).toHaveLength(1);
    expect(checkJumpRoute('grove', { ...base, walkAround: 'nowhere' })).toHaveLength(1);
    expect(checkJumpRoute('grove', { ...base, kind: 'glide', rise: -1, gap: 3 })).toHaveLength(1);
  });
});
