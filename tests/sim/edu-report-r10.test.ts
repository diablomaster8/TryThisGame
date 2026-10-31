/**
 * Lane E round 10, second batch: the week's minutes (R0718 KIDS-50), the attention counters
 * (R0745 KIDS-77), the games' standards (R0717 KIDS-49) and the side stories with a departure
 * in the loss heads-up (R0694 KIDS-26).
 */
import { describe, expect, it } from 'vitest';
import { EDU_GAMES } from '../../src/config/edu';
import { EDU_ROUND_STANDARDS } from '../../src/config/edu-standards-r10';
import { STANDARD_LABELS } from '../../src/config/strings-access-r10';
import { stepEdu } from '../../src/sim/edu';
import { averageSeconds, weekMinutes } from '../../src/sim/edu-report';
import { lossHeld, lossWaiting, upcomingLossSideStories } from '../../src/sim/loss-notice';
import type { World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

const NOON = Date.UTC(2026, 9, 31, 12);
const DAY = 86_400_000;

function eduWorld(age: 3 | 4 | 5 | 6): World {
  const w = createWorld(7, NOON);
  applyCommand(w, { kind: 'eduStart', age }, []);
  return w;
}

describe('R0718 (KIDS-50) minutes per day', () => {
  it('keeps whole minutes per local day and shows the last seven', () => {
    const w = eduWorld(4);
    for (let i = 0; i < 12 * 60; i++) stepEdu(w, 1000, NOON - 2 * DAY);
    for (let i = 0; i < 5 * 60; i++) stepEdu(w, 1000, NOON);
    const week = weekMinutes(w, NOON);
    expect(week).toHaveLength(7);
    expect(week[6]!.minutes).toBe(5);
    expect(week[4]!.minutes).toBe(12);
    expect(week[5]!.minutes).toBe(0);
  });

  it('keeps at most fourteen days', () => {
    const w = eduWorld(4);
    for (let d = 0; d < 20; d++) stepEdu(w, 60_000, NOON + d * DAY);
    expect(Object.keys(w.edu!.daily ?? {}).length).toBeLessThanOrEqual(14);
  });
});

describe('R0745 (KIDS-77) attention counters', () => {
  it('counts opens, finishes and early leaves, and averages the time', () => {
    const w = eduWorld(4);
    applyCommand(w, { kind: 'eduActivity', game: 'counting', what: 'open' }, []);
    applyCommand(w, { kind: 'eduActivity', game: 'counting', what: 'complete', ms: 200_000 }, []);
    applyCommand(w, { kind: 'eduActivity', game: 'counting', what: 'open' }, []);
    applyCommand(w, { kind: 'eduActivity', game: 'counting', what: 'quit', ms: 40_000 }, []);
    const a = w.edu!.attention!.counting!;
    expect(a).toEqual({ opens: 2, completes: 1, quits: 1, ms: 240_000 });
    expect(averageSeconds(a)).toBe(120);
    expect(averageSeconds(undefined)).toBeNull();
  });

  it('is a no-op outside a Learning Grove', () => {
    const w = createWorld(1, 0);
    applyCommand(w, { kind: 'eduActivity', game: 'letters', what: 'open' }, []);
    expect(w.edu).toBeNull();
  });
});

describe('R0717 (KIDS-49) standards for the games', () => {
  it('maps every game to at least one labelled standard', () => {
    for (const id of EDU_GAMES) {
      expect(EDU_ROUND_STANDARDS[id].length, id).toBeGreaterThan(0);
      for (const code of EDU_ROUND_STANDARDS[id]) expect(STANDARD_LABELS[code], code).toBeTruthy();
    }
  });
});

describe('R0694 (KIDS-26) side stories with a departure', () => {
  it('holds S10, S19 and S27 at their first step for a 3-year-old', () => {
    const w = eduWorld(3);
    if (!w.campaign) applyCommand(w, { kind: 'campaignStart' }, []);
    expect(lossHeld(w, 's27')).toBe(true);
    expect(lossHeld(w, 's5')).toBe(false);
    expect(upcomingLossSideStories(w)).toEqual(['s10', 's19', 's27']);
    const c = w.campaign!;
    c.step = 1;
    c.side.s27 = {
      status: 'open',
      step: 0,
      stage: 'wait',
      pending: null,
      openedMs: w.timeMs,
      sinceMs: w.timeMs,
      acted: false,
    };
    expect(lossWaiting(w)).toBe('s27');
    applyCommand(w, { kind: 'eduLossHold', chapter: 's27', hold: 'released' }, []);
    expect(lossWaiting(w)).toBeNull();
    expect(lossHeld(eduWorld(6), 's10')).toBe(false);
  });
});
