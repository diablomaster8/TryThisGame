import { describe, expect, it } from 'vitest';
import { GROWN_UP_GATE } from '../../src/config/tuning';
import { gateAnswerOk, gateProblem } from '../../src/ui/grown-up-gate';

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

/** The answer check itself: the right product gets in, anything else does not. */
describe('grown-up gate answer check', () => {
  it('accepts exactly a × b, with stray spaces', () => {
    expect(gateAnswerOk('91', 13, 7)).toBe(true);
    expect(gateAnswerOk(' 91 ', 13, 7)).toBe(true);
    expect(gateAnswerOk('0091', 13, 7)).toBe(true);
  });

  it('rejects a wrong, empty, signed, fractional or non-numeric answer', () => {
    for (const typed of ['', ' ', '90', '92', '-91', '91.5', '9 1', 'abc', '1e2', '+91', '0x5b']) {
      expect(gateAnswerOk(typed, 13, 7)).toBe(false);
    }
  });

  it('accepts the product for every problem the gate can ask', () => {
    for (let i = 0; i < 200; i++) {
      const { a, b } = gateProblem(() => i / 200);
      expect(gateAnswerOk(String(a * b), a, b)).toBe(true);
      expect(gateAnswerOk(String(a * b + 1), a, b)).toBe(false);
      expect(gateAnswerOk(String(a + b), a, b)).toBe(false);
    }
  });
});
