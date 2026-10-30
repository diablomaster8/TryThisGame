import { describe, expect, it } from 'vitest';
import { BATTLE_R5 } from '../../src/config/tuning-battle-r5';
import {
  battleAct,
  createBattle,
  MOVES,
  pairSeen,
  prizeFor,
  replay,
  typeOf,
  type BattleAction,
  type BattleState,
} from '../../src/sim/battle';
import { hatch } from '../../src/sim/lifecycle';
import { STAT_KEYS, type SimEvent, type World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

/**
 * Lane C round 5's battle doors: the pre-bout sheet's difficulty (recs FIGHT-86), skipped story
 * bouts (FIGHT-71), "Steady hands" (FIGHT-79), the matchup memory (FIGHT-77) and the debug
 * panel's battle actions (FIGHT-80).
 */
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

const ids = (w: World): string[] => w.nubbins.map((n) => n.id);

describe('the pre-bout difficulty (recs FIGHT-86)', () => {
  it('Spicy plays the Champion and pays ×1.25; Gentle and Normal override the usual choice', () => {
    const w = solo();
    const spicy = createBattle(w, { kind: 'dojo', tier: 1, ids: ids(w), difficulty: 'spicy' }, 1)!;
    expect(spicy.ai).toBe('champion');
    const plain = createBattle(w, { kind: 'dojo', tier: 1, ids: ids(w) }, 1)!;
    expect(plain.ai).toBeUndefined();
    const won = { winner: 0 as const, reason: 'tuckered' as const };
    const base = prizeFor({ kind: 'dojo', tier: 2, ids: [] }, won);
    expect(prizeFor({ kind: 'dojo', tier: 2, ids: [], difficulty: 'spicy' }, won)).toBe(
      Math.round(base * BATTLE_R5.spicyPrize),
    );
    const gentle = createBattle(
      w,
      { kind: 'dojo', tier: 1, ids: ids(w), difficulty: 'gentle' },
      1,
    )!;
    expect(gentle.gentle).toBe('all');
    w.battlePrefs = { gentle: true };
    expect(createBattle(w, { kind: 'dojo', tier: 1, ids: ids(w) }, 1)!.gentle).toBe('all');
    const normal = createBattle(
      w,
      { kind: 'dojo', tier: 1, ids: ids(w), difficulty: 'normal' },
      1,
    )!;
    expect(normal.gentle).toBeUndefined();
    // The same seed either way: the override is not part of the bout's key.
    expect(normal.seed).toBe(gentle.seed);
  });

  it('Settings → Bouts on Gentle makes bouts gentle', () => {
    const w = solo();
    w.settings.bouts = 'gentle';
    expect(createBattle(w, { kind: 'dojo', tier: 1, ids: ids(w) }, 1)!.gentle).toBe('all');
  });
});

describe('"Steady hands" (recs FIGHT-79)', () => {
  it('is a fixed ×1.1 on Bonk-kind moves, logs no swing, and replays', () => {
    const w = solo();
    const start = createBattle(w, { kind: 'dojo', tier: 2, ids: [w.nubbins[0]!.id] }, 4)!;
    for (const c of [...start.sides[0], ...start.sides[1]]) c.hp = c.maxHp = 5000;
    const me = start.sides[0][0]!.id;
    const hit = (a: BattleAction): { dmg: number; s: BattleState } => {
      const s = replay(start, [a]);
      const e = s.log.find((x) => x.k === 'hit' && x.by === me);
      return { dmg: e?.k === 'hit' ? e.dmg : -1, s };
    };
    const none = hit({ k: 'strike' });
    const steady = hit({ k: 'strike', timing: 'steady' });
    expect(none.dmg).toBeGreaterThan(0);
    expect(Math.abs(steady.dmg - Math.round(none.dmg * BATTLE_R5.steady))).toBeLessThanOrEqual(1);
    expect(steady.s.log.some((e) => e.k === 'swing')).toBe(false);
    expect(JSON.stringify(hit({ k: 'strike', timing: 'steady' }).s)).toBe(JSON.stringify(steady.s));
    // Only on a Bonk-kind move.
    const splash = MOVES.find((m) => m.kind === 'splash' && m.target === 'foe')!;
    const s = JSON.parse(JSON.stringify(start)) as BattleState;
    s.sides[0][0]!.moves = [splash.id];
    s.sides[0][0]!.puff = 99;
    expect(battleAct(s, { k: 'move', move: splash.id, timing: 'steady' })).toBe(false);
  });
});

describe('the matchup memory (recs FIGHT-77)', () => {
  it('is written by the sim when the Keeper side lands a hit, never before', () => {
    const w = solo();
    const events: SimEvent[] = [];
    applyCommand(
      w,
      { kind: 'battleStart', context: { kind: 'dojo', tier: 1, ids: ids(w) } },
      events,
    );
    const s = w.battle!;
    for (const c of [...s.sides[0], ...s.sides[1]]) c.hp = c.maxHp = 5000;
    for (const c of s.sides[1]) c.flutter = 0;
    const foe = s.sides[1][0]!;
    expect(w.battleSeen).toBeUndefined();
    expect(pairSeen(w, 'normal', foe.type)).toBe(false);
    for (let i = 0; i < 6 && !pairSeen(w, 'normal', foe.type); i++)
      applyCommand(w, { kind: 'battleAct', action: { k: 'strike', target: foe.id } }, events);
    expect(pairSeen(w, 'normal', foe.type)).toBe(true);
    // The foe's own hits on us teach nothing.
    const mine = typeOf(w.nubbins[0]!);
    expect(w.battleSeen!.pairs.every((p) => !p.endsWith(`>${mine}`) || foe.type === mine)).toBe(
      true,
    );
  });
});

describe('the debug panel battle actions (recs FIGHT-80)', () => {
  it('sets HP, gives and clears a status, forces a result, and replays', () => {
    const w = solo();
    const start = createBattle(w, { kind: 'dojo', tier: 1, ids: ids(w) }, 9)!;
    const foe = start.sides[1][0]!.id;
    const acts: BattleAction[] = [
      { k: 'debug', set: { op: 'hp', who: foe, hp: 3 } },
      { k: 'debug', set: { op: 'status', who: foe, id: 'giggly' } },
      { k: 'debug', set: { op: 'status', who: foe, id: null } },
      { k: 'strike', target: foe },
      { k: 'debug', set: { op: 'lose' } },
    ];
    const a = replay(start, acts);
    const b = replay(start, acts);
    expect(JSON.stringify(a.log)).toBe(JSON.stringify(b.log));
    expect(a.log).toContainEqual({ k: 'status', to: foe, id: 'giggly', on: true });
    expect(a.sides[1][0]!.major).toBeNull();
    expect(a.result).not.toBeNull();
    const s = replay(start, [{ k: 'debug', set: { op: 'win' } }]);
    expect(s.result).toEqual({ winner: 0, reason: 'tuckered' });
    expect(battleAct(s, { k: 'debug', set: { op: 'hp', who: 'nobody', hp: 1 } })).toBe(false);
  });
});

describe('skipped story bouts (recs FIGHT-71)', () => {
  it('only resolve for story bouts while the setting says Skip, and always count as won', () => {
    const w = solo(10);
    const events: SimEvent[] = [];
    const story = { kind: 'story', storyline: 'logged', tier: 3, ids: ids(w), auto: true } as const;
    applyCommand(w, { kind: 'battleStart', context: story }, events);
    expect(w.battle).toBeUndefined();
    w.settings.bouts = 'skip';
    applyCommand(
      w,
      {
        kind: 'battleStart',
        context: { kind: 'circuit', trainer: 'x', tier: 1, ids: ids(w), auto: true },
      },
      events,
    );
    applyCommand(
      w,
      { kind: 'battleStart', context: { kind: 'dojo', tier: 1, ids: ids(w), auto: true } },
      events,
    );
    expect(w.battle).toBeUndefined();
    const shells = w.inventory.shells;
    applyCommand(w, { kind: 'battleStart', context: story }, events);
    // Weak Nubbins at tier 3 would lose; a skipped bout counts as won anyway.
    expect(w.battle?.result?.winner).toBe(0);
    expect(events).toContainEqual(expect.objectContaining({ kind: 'partyBout', won: true }));
    const paid = w.inventory.shells - shells;
    const full = prizeFor(
      { kind: 'story', storyline: 'logged', tier: 3, ids: [] },
      {
        winner: 0,
        reason: 'tuckered',
      },
    );
    expect(paid).toBe(Math.round(full * BATTLE_R5.autoPrize));
    expect(events.some((e) => e.kind === 'battleEnd')).toBe(true);
  });
});
