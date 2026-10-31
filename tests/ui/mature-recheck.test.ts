import { describe, expect, it } from 'vitest';
import { adultSceneGate, isAdultScene, recheckDue } from '../../src/platform/mature-recheck';
import { MATURE_RECHECK } from '../../src/config/tuning-tech';

const DAY = 24 * 60 * 60 * 1000;

describe('TECH-75: the 18+ entry re-asks after a long absence', () => {
  it('asks again after 4 days, not after 1, and not before any entry', () => {
    const t = 1_700_000_000_000;
    expect(recheckDue(t, t + 4 * DAY)).toBe(true);
    expect(recheckDue(t, t + DAY)).toBe(false);
    expect(recheckDue(null, t)).toBe(false);
  });
});

describe('R0517 (TECH-75): It is Always Sunny re-asks too', () => {
  const t = 1_700_000_000_000;
  it('knows the Sunny scenes and no others', () => {
    expect(isAdultScene('q31-intro')).toBe(true);
    expect(isAdultScene('q45-finale')).toBe(true);
    expect(isAdultScene('q30-intro')).toBe(false);
    expect(isAdultScene('q46-intro')).toBe(false);
    expect(isAdultScene('c01-gate')).toBe(false);
  });

  it('a 4-day lastWallMs jump asks before the Sunny scene; Not now waits, then asks again', () => {
    expect(adultSceneGate('q32-first', t, t + 4 * DAY, 0)).toBe('ask');
    expect(adultSceneGate('q32-first', t, t + DAY, 0)).toBe('play');
    expect(adultSceneGate('q32-first', null, t, 0)).toBe('play');
    const now = t + 4 * DAY;
    expect(adultSceneGate('q32-first', t, now, now + MATURE_RECHECK.deferMs)).toBe('wait');
    expect(
      adultSceneGate('q32-first', t, now + MATURE_RECHECK.deferMs, now + MATURE_RECHECK.deferMs),
    ).toBe('ask');
    // Campaign scenes are never held.
    expect(adultSceneGate('c02-intro', t, now, 0)).toBe('play');
  });
});
