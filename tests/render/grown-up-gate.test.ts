import { describe, expect, it } from 'vitest';
import { GROWN_UP_GATE } from '../../src/config/tuning';
import { gateProblem } from '../../src/ui/grown-up-gate';

/** The grown-up gate asks a two-digit by one-digit product a 7–10 reader cannot do at sight. */
describe('grown-up gate', () => {
  it('always asks a two-digit factor (never a round ten) times a 6–9', () => {
    for (let i = 0; i < 200; i++) {
      const r = i / 200;
      const { a, b } = gateProblem(() => r);
      expect(a).toBeGreaterThanOrEqual(GROWN_UP_GATE.bigRange[0]);
      expect(a).toBeLessThanOrEqual(GROWN_UP_GATE.bigRange[1]);
      expect(a % 10).not.toBe(0);
      expect(b).toBeGreaterThanOrEqual(6);
      expect(b).toBeLessThanOrEqual(9);
      expect(a * b).toBeGreaterThan(70);
    }
  });
});
