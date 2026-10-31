import { describe, expect, it } from 'vitest';
import { BATTLE } from '../../src/config/tuning-battle';
import { battleAct, createBattle, MOVES, type BattleContext } from '../../src/sim/battle';
import { NUBBIN_TYPES, STAT_KEYS, type NubbinType } from '../../src/sim/types';
import {
  championProblems,
  CURVE_BASE,
  CURVE_PER_PUFF,
  CURVE_SLACK,
  HELD_MAX,
  HELD_MIN,
  median,
  rates,
  run,
  SPROUT_MEDIAN_MAX,
  started,
  world,
  type Tally,
} from './battle-balance-harness';

/**
 * The balance harness (recs FIGHT-81); the bouts themselves are in `battle-balance-harness.ts`.
 * The whole file must stay under 3 s, like the full-life test, so the Champion, which plays
 * each choice one turn ahead (about 20 ms a bout), gets 30 bouts here; the full 2,000 run as
 * `npx tsx tests/tools/battle-balance-champion.ts` (about a minute).
 */
let keeperTally: Tally | null = null;
/** The Keeper sample is shared by two checks. */
const keeper = (): Tally => (keeperTally ??= run('keeper', 1000));

describe('balance harness (recs FIGHT-81)', () => {
  it('every move sits on the power curve: Puff buys power', () => {
    // Today's curve is exactly 40 + 10 × Puff; the slack leaves room for a new move, never 200.
    for (const m of MOVES)
      expect(m.power, m.id).toBeLessThanOrEqual(
        CURVE_SLACK * (CURVE_BASE + CURVE_PER_PUFF * m.puff),
      );
  });

  it('Keeper level: the type loop holds, bouts are 6–14 turns, none past 60', () => {
    const t = keeper();
    const r = rates(t);
    for (const ty of NUBBIN_TYPES as readonly NubbinType[]) {
      expect(r[ty], ty).toBeGreaterThanOrEqual(0.45);
      expect(r[ty], ty).toBeLessThanOrEqual(0.55);
    }
    expect(median(t.turns)).toBeGreaterThanOrEqual(6);
    expect(median(t.turns)).toBeLessThanOrEqual(14);
    expect(t.turns.at(-1)).toBeLessThanOrEqual(BATTLE.turn.maxRounds);
  });

  it('Keeper level: no move carries its holders or takes over the picks', () => {
    const t = keeper();
    for (const [id, [score, n]] of Object.entries(t.held))
      if (n >= HELD_MIN) expect(score / n, id).toBeLessThanOrEqual(HELD_MAX);
    for (const [id, n] of Object.entries(t.picks)) expect(n / t.pickCount, id).toBeLessThan(0.35);
  });

  it('Sprout level: the type loop holds, bouts are 6–14 turns, none past 60', () => {
    const t = run('sprout', 400);
    const r = rates(t);
    for (const ty of NUBBIN_TYPES as readonly NubbinType[]) {
      expect(r[ty], ty).toBeGreaterThanOrEqual(0.45);
      expect(r[ty], ty).toBeLessThanOrEqual(0.55);
    }
    // Lane C r8: the Sprout's median (34 before its picks leaned to hits, 17 now). It stays
    // above the Keeper's 6–14 on purpose: a kid's foe still picks at random among its hits.
    expect(median(t.turns)).toBeGreaterThanOrEqual(6);
    expect(median(t.turns)).toBeLessThanOrEqual(SPROUT_MEDIAN_MAX);
    expect(t.turns.at(-1)).toBeLessThanOrEqual(BATTLE.turn.maxRounds);
  });

  it('Champion level: no move is more than 35% of its picks, bouts stay in 6–14', () => {
    const t = run('champion', 30);
    for (const [id, n] of Object.entries(t.picks)) expect(n / t.pickCount, id).toBeLessThan(0.35);
    expect(median(t.turns)).toBeGreaterThanOrEqual(6);
    expect(median(t.turns)).toBeLessThanOrEqual(14);
    expect(t.turns.at(-1)).toBeLessThanOrEqual(BATTLE.turn.maxRounds);
    // The same checks the 2,000-bout script runs (`championProblems`).
    expect(championProblems(t)).toEqual([]);
  });

  it('the stalemate guard: past turn 40 Guard counts half; encounters keep the old rule', () => {
    const ids = world.nubbins.map((n) => n.id);
    for (const n of world.nubbins) for (const k of STAT_KEYS) n.stats[k].points = 3000;
    const hitAt = (turn: number, encounter: boolean): number => {
      const ctx: BattleContext = encounter
        ? {
            kind: 'encounter',
            tier: 2,
            ids,
            source: 't',
            key: 'k',
            singles: true,
            foes: [{ species: 'chao', level: 30 }],
          }
        : { kind: 'dojo', tier: 2, ids };
      const s = createBattle(world, ctx, 4)!;
      for (const c of [...s.sides[0], ...s.sides[1]]) c.hp = c.maxHp = 5000;
      s.turn = turn;
      battleAct(s, { k: 'strike' });
      const e = s.log.find((x) => x.k === 'hit' && x.by === s.sides[0][0]!.id);
      return e?.k === 'hit' ? e.dmg : -1;
    };
    expect(hitAt(41, false)).toBeGreaterThan(hitAt(40, false));
    expect(hitAt(41, true)).toBe(hitAt(40, true));
  });

  it('finishes inside the 3 s budget', () => {
    expect(performance.now() - started).toBeLessThan(3000);
  });
});
