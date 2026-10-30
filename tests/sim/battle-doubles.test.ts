import { describe, expect, it } from 'vitest';
import { BATTLE_DOUBLES } from '../../src/config/tuning-battle-atb';
import {
  battleAct,
  canChoose,
  createBattle,
  MOVES,
  onField,
  type BattleState,
} from '../../src/sim/battle';
import { whoChoices } from '../../src/sim/battle/turn';
import { hatch } from '../../src/sim/lifecycle';
import { STAT_KEYS, type SimEvent, type World } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

/** Turn-based doubles (recs FIGHT-60): two a side, spread moves at ×0.75, allies as targets. */
function pair(points = 3000, seed = 3, count = 2): World {
  const w = createWorld(seed, 0);
  const events: SimEvent[] = [];
  const base = w.nubbins[0]!;
  while (w.nubbins.length < count)
    w.nubbins.push({ ...structuredClone(base), id: `nub-x${w.nubbins.length}` });
  for (const n of w.nubbins) {
    hatch(n, events, 0);
    for (const k of STAT_KEYS) n.stats[k].points = points;
  }
  w.karate.belt = 3;
  return w;
}

const ids = (w: World): string[] => w.nubbins.map((n) => n.id);
const doubles = (w: World, seed = 1): BattleState | null =>
  createBattle(w, { kind: 'dojo', tier: 2, ids: ids(w), doubles: true }, seed);

/** A damaging move that hits every foe. */
const SPREAD = MOVES.find((m) => m.target === 'allFoes' && m.kind !== 'status' && m.power > 0)!;

/** Lets the first ally use `move` and the second Bonk, and returns the ally's hits. */
function spreadHits(s: BattleState): { to: string; dmg: number }[] {
  const [a, b] = s.sides[0];
  a!.moves = [SPREAD.id];
  a!.puff = a!.puffMax;
  expect(battleAct(s, { k: 'move', move: SPREAD.id })).toBe(true);
  expect(battleAct(s, { k: 'strike', target: s.sides[1][0]!.id })).toBe(true);
  void b;
  const out: { to: string; dmg: number }[] = [];
  for (const e of s.log)
    if (e.k === 'hit' && e.by === a!.id && e.move === SPREAD.id) out.push({ to: e.to, dmg: e.dmg });
  return out;
}

describe('doubles (recs FIGHT-60)', () => {
  it('puts two a side on the field with no bench', () => {
    const s = doubles(pair(3000, 3, 3))!;
    expect(s.doubles).toBe(true);
    expect(s.lead).toBeUndefined();
    expect(s.sides[0]).toHaveLength(2);
    expect(s.sides[1]).toHaveLength(2);
    for (const c of [...s.sides[0], ...s.sides[1]]) expect(onField(s, c)).toBe(true);
  });

  it('needs two Nubbins', () => {
    const w = pair(3000, 3, 1);
    expect(
      createBattle(w, { kind: 'dojo', tier: 2, ids: [w.nubbins[0]!.id], doubles: true }, 1),
    ).toBeNull();
  });

  it('a spread move hits both foes at ×0.75 each', () => {
    expect(SPREAD).toBeDefined();
    const w = pair(3000);
    const d = doubles(w, 5)!;
    // The same bout without the doubles rule: same dice, full damage to each.
    const full = JSON.parse(JSON.stringify(d)) as BattleState;
    delete full.doubles;
    // Big HP pools so nobody is tuckered and both runs stay in step.
    for (const s of [d, full])
      for (const c of [...s.sides[0], ...s.sides[1]]) c.hp = c.maxHp = 5000;
    const hd = spreadHits(d);
    const hf = spreadHits(full);
    expect(hd.map((h) => h.to).sort()).toEqual(d.sides[1].map((c) => c.id).sort());
    expect(hd).toHaveLength(hf.length);
    for (let i = 0; i < hd.length; i++) {
      const want = Math.max(1, Math.round(hf[i]!.dmg * BATTLE_DOUBLES.spread));
      expect(Math.abs(hd[i]!.dmg - want)).toBeLessThanOrEqual(1);
      expect(hd[i]!.dmg).toBeLessThan(hf[i]!.dmg);
    }
  });

  it('a spread move on one foe left is not reduced', () => {
    const w = pair(3000);
    const d = doubles(w, 5)!;
    const full = JSON.parse(JSON.stringify(d)) as BattleState;
    delete full.doubles;
    for (const s of [d, full]) {
      for (const c of [...s.sides[0], ...s.sides[1]]) c.hp = c.maxHp = 5000;
      s.sides[1][1]!.hp = 0;
    }
    const hd = spreadHits(d);
    const hf = spreadHits(full);
    expect(hd).toHaveLength(1);
    expect(hd[0]!.dmg).toBe(hf[0]!.dmg);
  });

  it('support moves can pick the partner; the UI asks "Who?" only when there is a choice', () => {
    const s = doubles(pair(3000))!;
    const [a, b] = s.sides[0];
    // Chest Drum lifts its user's Bonk; in doubles it can lift the partner's instead.
    const support = MOVES.find((m) => m.id === 'chest-drum')!;
    a!.moves = [support.id];
    a!.puff = a!.puffMax;
    expect(canChoose(s, a!, { k: 'move', move: support.id, target: b!.id })).toBe(true);
    expect(canChoose(s, a!, { k: 'move', move: support.id, target: s.sides[1][0]!.id })).toBe(
      false,
    );
    expect(whoChoices(s, a!.id, support.id).ids.sort()).toEqual([a!.id, b!.id].sort());
    expect(whoChoices(s, a!.id, 'bonk').ids).toEqual(s.sides[1].map((c) => c.id));
    expect(whoChoices(s, a!.id, SPREAD.id)).toEqual({ pick: 'none', ids: [], spread: true });
    // Passed to the partner, the lift lands on the partner, not the user.
    expect(battleAct(s, { k: 'move', move: support.id, target: b!.id })).toBe(true);
    expect(battleAct(s, { k: 'guard' })).toBe(true);
    expect(b!.moods.bonk).toBe(1);
    expect(a!.moods.bonk ?? 0).toBe(0);
  });

  it('a doubles bout plays to the end and replays the same', () => {
    const w = pair(2000);
    const start = doubles(w, 9)!;
    const run = (): BattleState => {
      const s = JSON.parse(JSON.stringify(start)) as BattleState;
      let g = 0;
      while (!s.result && g++ < 400)
        battleAct(s, { k: 'strike', target: s.sides[1].find((c) => c.hp > 0)?.id ?? '' });
      return s;
    };
    const one = run();
    expect(one.result).not.toBeNull();
    expect(JSON.stringify(run())).toBe(JSON.stringify(one));
  });
});
