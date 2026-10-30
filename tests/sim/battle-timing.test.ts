import { describe, expect, it } from 'vitest';
import { BATTLE } from '../../src/config/tuning-battle';
import {
  battleAct,
  createBattle,
  MOVES,
  replay,
  type BattleAction,
  type BattleState,
} from '../../src/sim/battle';
import { hatch } from '../../src/sim/lifecycle';
import { STAT_KEYS, type SimEvent, type World } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

/** The timing ring's flag on Bonk-kind moves (recs FIGHT-87): validated, ×1.2, replayed. */
function solo(points = 3000, seed = 3): World {
  const w = createWorld(seed, 0);
  const events: SimEvent[] = [];
  for (const n of w.nubbins) {
    hatch(n, events, 0);
    for (const k of STAT_KEYS) n.stats[k].points = points;
  }
  w.karate.belt = 3;
  return w;
}

const dojo = (w: World, seed = 1): BattleState =>
  createBattle(w, { kind: 'dojo', tier: 2, ids: [w.nubbins[0]!.id] }, seed)!;

const BONK_KIND = MOVES.find((m) => m.kind === 'bonk' && m.id !== 'bonk' && m.target === 'foe')!;
const SPLASH = MOVES.find((m) => m.kind === 'splash' && m.target === 'foe')!;

/** The ally's first hit after acting `a` on a fresh copy of `start`. */
function firstHit(start: BattleState, a: BattleAction): { dmg: number; s: BattleState } {
  const s = JSON.parse(JSON.stringify(start)) as BattleState;
  for (const c of [...s.sides[0], ...s.sides[1]]) c.hp = c.maxHp = 5000;
  expect(battleAct(s, a)).toBe(true);
  const hit = s.log.find((e) => e.k === 'hit' && e.by === s.sides[0][0]!.id);
  return { dmg: hit?.k === 'hit' ? hit.dmg : -1, s };
}

describe('the timing flag (recs FIGHT-87)', () => {
  it('a sweet Bonk-kind hit is ×1.2 and logs "Nice!"; plain is ×1', () => {
    const start = dojo(solo());
    start.sides[0][0]!.moves = [BONK_KIND.id];
    start.sides[0][0]!.puff = 99;
    const move = (timing?: 'sweet' | 'plain'): BattleAction => ({
      k: 'move',
      move: BONK_KIND.id,
      ...(timing ? { timing } : {}),
    });
    const none = firstHit(start, move());
    const plain = firstHit(start, move('plain'));
    const sweet = firstHit(start, move('sweet'));
    expect(plain.dmg).toBe(none.dmg);
    expect(Math.abs(sweet.dmg - Math.round(none.dmg * BATTLE.swing.sweet))).toBeLessThanOrEqual(1);
    expect(sweet.s.log).toContainEqual({ k: 'swing', by: start.sides[0][0]!.id, sweet: true });
    expect(plain.s.log).toContainEqual({ k: 'swing', by: start.sides[0][0]!.id, sweet: false });
    expect(none.s.log.some((e) => e.k === 'swing')).toBe(false);
  });

  it('Bonk itself takes the flag too', () => {
    const start = dojo(solo());
    const none = firstHit(start, { k: 'strike' });
    const sweet = firstHit(start, { k: 'strike', timing: 'sweet' });
    expect(sweet.dmg).toBeGreaterThan(none.dmg);
  });

  it('is refused on a non-Bonk move, for an unknown value, and sweet in a gentle bout', () => {
    const s = dojo(solo());
    s.sides[0][0]!.moves = [SPLASH.id];
    s.sides[0][0]!.puff = 99;
    const before = JSON.stringify(s);
    expect(battleAct(s, { k: 'move', move: SPLASH.id, timing: 'sweet' })).toBe(false);
    const odd = { k: 'strike', timing: 'great' } as unknown as BattleAction;
    expect(battleAct(s, odd)).toBe(false);
    expect(JSON.stringify(s)).toBe(before);
    s.gentle = 'all';
    expect(battleAct(s, { k: 'strike', timing: 'sweet' })).toBe(false);
    expect(battleAct(s, { k: 'strike', timing: 'plain' })).toBe(true);
  });

  it('a replay with timing flags is deterministic and the flags matter', () => {
    const start = dojo(solo(2000), 7);
    const timed: BattleAction[] = [];
    const bare: BattleAction[] = [];
    for (let i = 0; i < 40; i++) {
      timed.push({ k: 'strike', timing: i % 3 === 0 ? 'sweet' : 'plain' });
      bare.push({ k: 'strike' });
    }
    const a = replay(start, timed);
    const b = replay(start, timed);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(a.result).not.toBeNull();
    expect(JSON.stringify(replay(start, bare).log)).not.toBe(JSON.stringify(a.log));
  });
});
