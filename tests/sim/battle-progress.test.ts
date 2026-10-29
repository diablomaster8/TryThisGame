import { describe, expect, it } from 'vitest';
import { BATTLE_PROGRESS } from '../../src/config/tuning-battle';
import { createBattle, type BattleState } from '../../src/sim/battle';
import { boutLean, boutPoints, grantRewards } from '../../src/sim/battle/rewards';
import { hatch } from '../../src/sim/lifecycle';
import { gradeMultiplier } from '../../src/sim/stats';
import { STAT_KEYS, type SimEvent, type World } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

/** Round 5 (recs FIGHT-73): bouts feed the care stats by the moves used, never an XP bar. */
function one(): World {
  const w = createWorld(11, 0);
  hatch(w.nubbins[0]!, [], 0);
  w.nubbins[0]!.needs.energy = 1;
  w.nubbins[0]!.needs.happiness = 0;
  return w;
}

/** A dojo bout whose log is replaced by `turns` turns of the ally using `move`. */
function scripted(w: World, move: string, turns: number, won = true): BattleState {
  const s = createBattle(w, { kind: 'dojo', tier: 1, ids: [w.nubbins[0]!.id] }, 1)!;
  const me = s.sides[0][0]!.id;
  const foe = s.sides[1][0]!.id;
  s.log = [];
  for (let n = 1; n <= turns; n++) {
    s.log.push({ k: 'turnStart', n });
    s.log.push({ k: 'use', by: me, move });
    s.log.push({ k: 'hit', by: me, to: foe, dmg: 5, strong: false, guarded: false, move });
    s.log.push({ k: 'turnEnd', n });
  }
  s.result = { winner: won ? 0 : 1, reason: 'tuckered' };
  s.phase = 'done';
  return s;
}

describe('bouts feed the care stats (recs FIGHT-73)', () => {
  it('a 10-turn Bonk-only bout gives Power +40 × grade and only Stamina besides', () => {
    const w = one();
    const n = w.nubbins[0]!;
    const before = Object.fromEntries(STAT_KEYS.map((k) => [k, n.stats[k].points]));
    const s = scripted(w, 'bonk', 10);
    expect(boutPoints(s, n.id)).toEqual({ power: 40, stamina: 40 });
    grantRewards(w, s, []);
    for (const k of STAT_KEYS) {
      const gain = n.stats[k].points - before[k]!;
      if (k === 'power' || k === 'stamina')
        expect(gain).toBeCloseTo(40 * gradeMultiplier(n.stats[k].grade));
      else expect(gain).toBe(0);
    }
  });

  it('splash moves train Swim, priority moves Run, dodges Fly; 60 a stat at most', () => {
    const w = one();
    const id = w.nubbins[0]!.id;
    expect(boutPoints(scripted(w, 'bubble-pop', 3), id).swim).toBe(12);
    expect(boutPoints(scripted(w, 'sunbeam-dash', 2), id).run).toBe(8);
    expect(boutPoints(scripted(w, 'bonk', 30), id).power).toBe(BATTLE_PROGRESS.capPerStat);
    const s = scripted(w, 'raspberry', 1);
    s.log.push({ k: 'miss', by: s.sides[1][0]!.id, to: id });
    expect(boutPoints(s, id)).toEqual({ fly: 4, stamina: 4 });
  });

  it('costs a little energy; happiness +3 on a win and +1 on a loss', () => {
    for (const won of [true, false]) {
      const w = one();
      const n = w.nubbins[0]!;
      grantRewards(w, scripted(w, 'bonk', 2, won), []);
      expect(n.needs.energy).toBeCloseTo(1 - BATTLE_PROGRESS.energyCost);
      expect(n.needs.happiness).toBe(won ? 3 : 1);
    }
  });

  it('a forfeit gives nothing', () => {
    const w = one();
    const n = w.nubbins[0]!;
    const s = scripted(w, 'bonk', 5);
    s.result = { winner: 1, reason: 'forfeit' };
    const before = structuredClone(n.stats);
    const events: SimEvent[] = [];
    grantRewards(w, s, events);
    expect(n.stats).toEqual(before);
    expect(events.some((e) => e.kind === 'battleSpoils')).toBe(false);
  });

  it('a child counts its wins and losses, which lean Cheerful or Shy', () => {
    const w = one();
    const n = w.nubbins[0]!;
    expect(n.stage).toBe('child');
    for (let i = 0; i < 3; i++) grantRewards(w, scripted(w, 'bonk', 1, true), []);
    expect(n.childCare.boutWins).toBe(3);
    expect(boutLean(n.childCare)).toBe('cheerful');
    expect(boutLean({ pets: 0, throws: 0, feeds: 0, boutLosses: 4, boutWins: 1 })).toBe('shy');
    expect(boutLean({ pets: 0, throws: 0, feeds: 0 })).toBeNull();
  });
});
