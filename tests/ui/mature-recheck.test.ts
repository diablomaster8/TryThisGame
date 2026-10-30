import { describe, expect, it } from 'vitest';
import { recheckDue } from '../../src/platform/mature-recheck';

const DAY = 24 * 60 * 60 * 1000;

describe('TECH-75: the 18+ entry re-asks after a long absence', () => {
  it('asks again after 4 days, not after 1, and not before any entry', () => {
    const t = 1_700_000_000_000;
    expect(recheckDue(t, t + 4 * DAY)).toBe(true);
    expect(recheckDue(t, t + DAY)).toBe(false);
    expect(recheckDue(null, t)).toBe(false);
  });
});
