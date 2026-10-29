import { describe, expect, it } from 'vitest';
import { BATTLE, BATTLE_ONCE } from '../../src/config/tuning-battle';
import { createBattle, type BattleContext, type BattleState } from '../../src/sim/battle';
import { circuitWin } from '../../src/sim/battle/circuit';
import { battleOf } from '../../src/sim/battle/moves-sources';
import {
  grantKeepsake,
  grantRewards,
  onceOf,
  partyPrize,
  prizeFor,
} from '../../src/sim/battle/rewards';
import { hatch } from '../../src/sim/lifecycle';
import { deserialize, serialize } from '../../src/sim/save';
import type { SimEvent, World } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

/** Round 5 (recs FIGHT-74): rewards are one-time or unlimited, never daily. */
function one(seed = 21): World {
  const w = createWorld(seed, 0);
  hatch(w.nubbins[0]!, [], 0);
  w.karate.belt = 3;
  return w;
}

/** A finished bout in `context`, won or lost, without fighting it. */
function finished(w: World, context: BattleContext, won: boolean): BattleState {
  const s = createBattle(w, context, 1)!;
  s.result = { winner: won ? 0 : 1, reason: 'tuckered' };
  s.phase = 'done';
  return s;
}

const reload = (w: World): World => deserialize(serialize(w, 0)).world;
const DAY = 86_400_000;

describe('rewards table (recs FIGHT-74)', () => {
  it('Shells are unlimited by tier, and a loss pays a quarter', () => {
    expect([1, 2, 3].map((t) => partyPrize(t, true))).toEqual([20, 50, 110]);
    expect([1, 2, 3].map((t) => partyPrize(t, false))).toEqual([5, 13, 28]);
    const w = one();
    const ctx: BattleContext = { kind: 'party', tier: 2, ids: [w.nubbins[0]!.id] };
    for (let i = 0; i < 3; i++) {
      const before = w.inventory.shells;
      const s = finished(w, ctx, true);
      grantRewards(w, s, []);
      expect(w.inventory.shells - before).toBe(prizeFor(ctx, s.result!));
    }
  });

  it('the first win at each tier gives its hat once, across a save and reload', () => {
    let w = one();
    const id = w.nubbins[0]!.id;
    const hats: (string | null)[] = [];
    for (let round = 0; round < 3; round++) {
      for (const tier of [1, 2, 3]) {
        const events: SimEvent[] = [];
        grantRewards(w, finished(w, { kind: 'dojo', tier, ids: [id] }, true), events);
        const sp = events.find((e) => e.kind === 'battleSpoils');
        hats.push(sp?.kind === 'battleSpoils' ? sp.spoils.hat : null);
      }
      w = reload(w);
    }
    expect(hats.slice(0, 3)).toEqual([...BATTLE_ONCE.firstWinHats]);
    expect(hats.slice(3).every((h) => h === null)).toBe(true);
    expect(onceOf(w).firstWins.sort()).toEqual([1, 2, 3]);
  });

  it('a loss never pays the first-win hat', () => {
    const w = one();
    grantRewards(w, finished(w, { kind: 'dojo', tier: 1, ids: [w.nubbins[0]!.id] }, false), []);
    expect(onceOf(w).firstWins).toEqual([]);
  });

  it('a Circuit ribbon pays its hat and skill point once, across a reload', () => {
    let w = one();
    const sp = w.skillPoints;
    circuitWin(w, 'fern', false, []);
    w = reload(w);
    const hats = [...w.inventory.hats];
    circuitWin(w, 'fern', false, []);
    expect(w.skillPoints - sp).toBe(BATTLE.circuit.skillPoints);
    expect(w.inventory.hats).toEqual(hats);
    expect(w.circuit!.ribbons).toEqual(['fern']);
  });

  it('a keepsake is given once, across a reload', () => {
    let w = one();
    expect(grantKeepsake(w, 'calm:old-shadow')).toBe(true);
    w = reload(w);
    expect(grantKeepsake(w, 'calm:old-shadow')).toBe(false);
    expect(onceOf(w).keepsakes).toEqual(['calm:old-shadow']);
  });

  it('each move is a new card the first time only', () => {
    let w = one();
    const id = w.nubbins[0]!.id;
    const ctx: BattleContext = { kind: 'party', tier: 1, ids: [id] };
    const events: SimEvent[] = [];
    grantRewards(w, finished(w, ctx, true), events);
    const first = events.find((e) => e.kind === 'battleSpoils');
    expect(first?.kind === 'battleSpoils' && first.spoils.cards).toEqual(
      battleOf(w.nubbins[0]!).known,
    );
    w = reload(w);
    const again: SimEvent[] = [];
    grantRewards(w, finished(w, ctx, true), again);
    const second = again.find((e) => e.kind === 'battleSpoils');
    expect(second?.kind === 'battleSpoils' && second.spoils.cards).toEqual([]);
  });

  it('nothing depends on consecutive days: the same bout pays the same any day', () => {
    const pay = (gapDays: number[]): number => {
      const w = one(33);
      const id = w.nubbins[0]!.id;
      let t = 0;
      let total = 0;
      for (const g of gapDays) {
        t += g * DAY;
        w.timeMs = t;
        const before = w.inventory.shells;
        grantRewards(w, finished(w, { kind: 'party', tier: 1, ids: [id] }, true), []);
        total += w.inventory.shells - before;
      }
      return total;
    };
    expect(pay([0, 1, 1, 1])).toBe(pay([0, 9, 30, 2]));
  });
});
