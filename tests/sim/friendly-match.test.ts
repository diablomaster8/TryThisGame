import { describe, expect, it } from 'vitest';
import { FRIENDLY_MATCH as F } from '../../src/config/tuning-friendly-match';
import { matchResult, playTrick, startFriendlyMatch, TRICKS, trickFun } from '../../src/sim/battle/giggle';
import { Rng } from '../../src/sim/rng';
import type { StatKey } from '../../src/sim/types';

const KEYS: StatKey[] = ['swim', 'fly', 'run', 'power', 'stamina'];
function stats(rng: Rng): { stats: Record<StatKey, { points: number; grade: 'C' }> } {
  const s = {} as Record<StatKey, { points: number; grade: 'C' }>;
  for (const k of KEYS) s[k] = { points: rng.int(0, 9900), grade: 'C' };
  return { stats: s };
}

describe('Friendly Match (R0747)', () => {
  it('never reports a defeat over a thousand seeded matches', () => {
    const tricks = Object.keys(TRICKS) as (keyof typeof TRICKS)[];
    for (let seed = 1; seed <= 1000; seed++) {
      const r = new Rng(seed);
      const m = startFriendlyMatch(stats(r), stats(r), seed);
      while (!m.done) playTrick(m, r.pick(tricks), r.chance(0.5));
      expect(matchResult(m)).toBe('fun');
      expect(m.round).toBeLessThanOrEqual(F.maxRounds);
      expect(m.fun[0]).toBeLessThanOrEqual(F.funToFill);
      const text = JSON.stringify(m.log).toLowerCase();
      for (const bad of ['defeat', 'faint', 'ko', 'lose', 'hurt', 'damage']) {
        expect(text).not.toContain(`"${bad}`);
      }
    }
  });
  it('a learning twist doubles a trick and a miss is a normal trick', () => {
    expect(trickFun(10, true)).toBe(trickFun(10, false) * F.twistMultiplier);
  });
  it('is deterministic for a seed', () => {
    const run = () => {
      const r = new Rng(5);
      const m = startFriendlyMatch(stats(r), stats(r), 5);
      playTrick(m, 'splash');
      playTrick(m, 'twirl', true);
      return JSON.stringify(m.log);
    };
    expect(run()).toBe(run());
  });
});
