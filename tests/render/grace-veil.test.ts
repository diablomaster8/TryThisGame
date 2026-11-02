import { describe, expect, it } from 'vitest';
import { GRACE } from '../../src/config/tuning';
import { graceVeil } from '../../src/render/grace-veil';

/** The last-day veil: a soft flicker in the window, still under reduced motion, none outside. */
describe('the last-day veil', () => {
  it('is absent outside the window', () => {
    expect(graceVeil({ graceMs: null }, 1234, false)).toBe(0);
  });

  it('flickers within its range, and holds still under reduced motion', () => {
    const seen = new Set<number>();
    for (let t = 0; t < GRACE.veilPeriodMs; t += 100) {
      const v = graceVeil({ graceMs: 60_000 }, t, false);
      expect(v).toBeGreaterThanOrEqual(GRACE.veilMin - 1e-9);
      expect(v).toBeLessThanOrEqual(GRACE.veilMax + 1e-9);
      seen.add(Math.round(v * 100));
      expect(graceVeil({ graceMs: 60_000 }, t, true)).toBe(GRACE.veilStill);
    }
    expect(seen.size).toBeGreaterThan(3);
  });
});
