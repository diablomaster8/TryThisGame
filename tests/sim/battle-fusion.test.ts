import { describe, expect, it } from 'vitest';
import { BATTLE_R6 } from '../../src/config/tuning-battle-r6';
import { battleAct, createBattle, onField, type BattleState } from '../../src/sim/battle';
import { hatch } from '../../src/sim/lifecycle';
import { STAT_KEYS, type SimEvent, type World } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

/** Fusion burst in turn doubles (recs FIGHT-95). */
function pair(affection = 90): World {
  const w = createWorld(5, 0);
  const events: SimEvent[] = [];
  const base = w.nubbins[0]!;
  while (w.nubbins.length < 2) w.nubbins.push({ ...structuredClone(base), id: 'nub-x1' });
  for (const n of w.nubbins) {
    hatch(n, events, 0);
    for (const k of STAT_KEYS) n.stats[k].points = 3000;
    n.needs.affection = affection;
  }
  w.karate.belt = 3;
  w.partners = [w.nubbins[0]!.id, w.nubbins[1]!.id];
  return w;
}

const bout = (w: World): BattleState =>
  createBattle(w, { kind: 'dojo', tier: 1, ids: w.nubbins.map((n) => n.id), doubles: true }, 7)!;

describe('Fusion burst (recs FIGHT-95)', () => {
  it('needs both partners at bond 80', () => {
    expect(bout(pair(90)).fusable).toBeDefined();
    expect(bout(pair(79)).fusable).toBeUndefined();
  });

  it('lasts 3 turns, once a bout, then splits at the original HP ratio', () => {
    const s = bout(pair());
    const [a, b] = s.sides[0];
    a!.hp = Math.round(a!.maxHp * 0.8);
    b!.hp = Math.round(b!.maxHp * 0.4);
    const hpA = a!.hp;
    const hpB = b!.hp;
    // Keep the rivals from tuckering anyone: they only catch their breath.
    for (const f of s.sides[1]) f.bonk = f.splash = 0;
    expect(battleAct(s, { k: 'fuse' })).toBe(true);
    const one = s.sides[0][2]!;
    expect(one.fusion?.left).toBe(BATTLE_R6.fusion.turns);
    expect(one.moves).toContain(BATTLE_R6.fusion.move);
    expect(onField(s, a!)).toBe(false);
    expect(onField(s, one)).toBe(true);
    expect(battleAct(s, { k: 'fuse' })).toBe(false);
    let turns = 0;
    while (s.sides[0].includes(one) && !s.result && turns < 10) {
      const t = s.turn;
      expect(battleAct(s, { k: 'guard' })).toBe(true);
      if (s.turn > t) turns += 1;
    }
    expect(turns).toBe(BATTLE_R6.fusion.turns);
    expect(onField(s, a!)).toBe(true);
    // The pool (one.hp at the split) shared at hpA : hpB.
    const total = a!.hp + b!.hp;
    expect(Math.abs(a!.hp / total - hpA / (hpA + hpB))).toBeLessThan(0.02);
    expect(s.log.filter((e) => e.k === 'fusion').map((e) => e.k === 'fusion' && e.on)).toEqual([
      true,
      false,
    ]);
    expect(battleAct(s, { k: 'fuse' })).toBe(false);
    void hpB;
  });
});
