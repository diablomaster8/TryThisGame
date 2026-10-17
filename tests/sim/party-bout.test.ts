import { describe, expect, it } from 'vitest';
import { PARTY_BOUT } from '../../src/config/tuning';
import { hatch } from '../../src/sim/lifecycle';
import { createPartyBout, partyMove, partyPrize } from '../../src/sim/party-bout';
import type { Nubbin, SimEvent } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

function party(points: number): Nubbin[] {
  const world = createWorld(3, 0);
  const events: SimEvent[] = [];
  const out = world.nubbins.slice(0, 2);
  for (const n of out) {
    hatch(n, events, 0);
    n.stats.power.points = points;
    n.stats.stamina.points = points;
  }
  return out;
}

describe('party bouts', () => {
  it('is seeded: the same party, tier and seed give the same bout', () => {
    const a = createPartyBout(party(2000), 1, 7);
    const b = createPartyBout(party(2000), 1, 7);
    for (let i = 0; i < 6; i++) {
      partyMove(a, 'strike');
      partyMove(b, 'strike');
    }
    expect(a.log).toEqual(b.log);
    expect(a.foes.map((f) => f.hp)).toEqual(b.foes.map((f) => f.hp));
    expect(a.foes.length).toBe(PARTY_BOUT.foesPerTier);
  });

  it('a strong party striking wins; a weak one is worn down', () => {
    const strong = createPartyBout(party(9000), 1, 11);
    let guard = 0;
    while (!strong.finished && guard++ < 200) partyMove(strong, 'strike');
    expect(strong.won).toBe(true);
    expect(partyPrize(1, true)).toBe(PARTY_BOUT.prize[0]);
    expect(partyPrize(1, false)).toBeLessThan(PARTY_BOUT.prize[0]);
    const weak = createPartyBout(party(0), 3, 11);
    guard = 0;
    while (!weak.finished && guard++ < 400) partyMove(weak, 'guard');
    expect(weak.won).toBe(false);
    expect(partyMove(weak, 'strike')).toBe(false);
  });

  it('turns pass round the party, then the foes act; guard halves a hit; rally heals', () => {
    const b = createPartyBout(party(3000), 1, 5);
    expect(b.active).toBe(0);
    partyMove(b, 'guard');
    expect(b.party[0]!.guard).toBe(true);
    expect(b.active).toBe(1);
    expect(b.round).toBe(1);
    partyMove(b, 'strike');
    // Both moved: the foes have acted and a new round began.
    expect(b.round).toBe(2);
    expect(b.active).toBe(0);
    const hurt = b.party.find((p) => p.hp < p.maxHp);
    if (hurt) {
      const before = hurt.hp;
      partyMove(b, 'rally');
      expect(hurt.hp).toBeGreaterThan(before);
    }
  });
});
