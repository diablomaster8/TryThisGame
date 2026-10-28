import { describe, expect, it } from 'vitest';
import { BATTLE } from '../../src/config/tuning-battle';
import {
  battleAct,
  createBattle,
  partyPrize,
  standing,
  type BattleState,
} from '../../src/sim/battle';
import { hatch } from '../../src/sim/lifecycle';
import type { SimEvent, World } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

/** SL2's party bouts on the battle core (was tests/sim/party-bout.test.ts). */
function partyWorld(points: number): World {
  const world = createWorld(3, 0);
  const events: SimEvent[] = [];
  for (const n of world.nubbins) {
    hatch(n, events, 0);
    n.stats.power.points = points;
    n.stats.stamina.points = points;
  }
  return world;
}

const bout = (w: World, tier: number, seed: number): BattleState =>
  createBattle(w, { kind: 'party', tier, ids: w.nubbins.map((n) => n.id) }, seed)!;

describe('party bouts', () => {
  it('is seeded: the same party, tier and seed give the same bout', () => {
    const a = bout(partyWorld(2000), 1, 7);
    const b = bout(partyWorld(2000), 1, 7);
    for (let i = 0; i < 6; i++) {
      battleAct(a, { k: 'strike' });
      battleAct(b, { k: 'strike' });
    }
    expect(a.log).toEqual(b.log);
    expect(a.sides[1].map((f) => f.hp)).toEqual(b.sides[1].map((f) => f.hp));
    expect(a.sides[1].length).toBe(Math.min(BATTLE.turn.foesPerTier, 2));
  });

  it('a strong party striking wins; a weak one is tuckered out', () => {
    const strong = bout(partyWorld(9000), 1, 11);
    let guard = 0;
    while (!strong.result && guard++ < 200) battleAct(strong, { k: 'strike' });
    expect(strong.result?.winner).toBe(0);
    expect(partyPrize(1, true)).toBe(BATTLE.prizes.party[0]);
    expect(partyPrize(1, false)).toBeLessThan(BATTLE.prizes.party[0]);
    const weak = bout(partyWorld(0), 3, 11);
    guard = 0;
    while (!weak.result && guard++ < 400) battleAct(weak, { k: 'guard' });
    expect(weak.result?.winner).toBe(1);
    expect(weak.log.some((e) => e.k === 'tuckered' && e.side === 0)).toBe(true);
    expect(battleAct(weak, { k: 'strike' })).toBe(false);
  });

  it('turns pass round the party, then the foes act; guard halves a hit; rally heals', () => {
    const b = bout(partyWorld(3000), 2, 5);
    expect(b.active).toBe(0);
    battleAct(b, { k: 'guard' });
    expect(b.sides[0][0]!.guard || b.log.some((e) => e.k === 'hit' && e.guarded)).toBe(true);
    expect(b.active).toBe(1);
    expect(b.turn).toBe(1);
    battleAct(b, { k: 'strike' });
    // Both moved: the foes have acted and a new round began.
    expect(b.turn).toBe(2);
    expect(b.active).toBe(0);
    const hurt = b.sides[0].find((p) => p.hp < p.maxHp && standing(p));
    if (hurt) {
      const before = hurt.hp;
      battleAct(b, { k: 'rally' });
      expect(hurt.hp).toBeGreaterThan(before);
    }
  });

  it('strikes the foe the player picked (recs FIGHT-08), and refuses a foe who went home', () => {
    const b = bout(partyWorld(3000), 2, 9);
    const second = b.sides[1][1]!;
    const first = b.sides[1][0]!;
    const hp0 = first.hp;
    let tries = 0;
    while (second.hp === second.maxHp && tries++ < 20)
      battleAct(b, { k: 'strike', target: second.id });
    expect(second.hp).toBeLessThan(second.maxHp);
    // Only the rivals' own strikes and no ally's touched the first foe.
    expect(
      b.log.some((e) => e.k === 'hit' && e.to === first.id && e.by.startsWith('foe-') === false),
    ).toBe(false);
    expect(first.hp).toBe(hp0);
    second.hp = 0;
    expect(battleAct(b, { k: 'strike', target: second.id })).toBe(false);
  });
});
