import { describe, expect, it } from 'vitest';
import { BATTLE_ATB } from '../../src/config/tuning-battle-atb';
import {
  battleAct,
  createBattle,
  stepBattleMoves,
  type BattleAction,
  type BattleState,
} from '../../src/sim/battle';
import {
  cooldownLeft,
  obeyChance,
  pausedForHidden,
  replayAtb,
  stepAtb,
  type TimedAction,
} from '../../src/sim/battle/atb';
import { hatch } from '../../src/sim/lifecycle';
import { STAT_KEYS, type Personality, type SimEvent, type World } from '../../src/sim/types';
import { applyCommand, createWorld, stepWorld } from '../../src/sim/world';

/** The ATB "Command" bout (recs FIGHT-40, FIGHT-41). */
function party(n = 3, points = 3000, seed = 3): World {
  const w = createWorld(seed, 0);
  const events: SimEvent[] = [];
  const base = w.nubbins[0]!;
  while (w.nubbins.length < n)
    w.nubbins.push({ ...structuredClone(base), id: `nub-x${w.nubbins.length}` });
  w.nubbins.length = n;
  for (const nb of w.nubbins) {
    hatch(nb, events, 0);
    for (const k of STAT_KEYS) nb.stats[k].points = points;
  }
  w.karate.belt = 3;
  return w;
}

const ids = (w: World): string[] => w.nubbins.map((n) => n.id);
const atb = (w: World, seed = 1, kind: 'dojo' | 'party' = 'dojo'): BattleState =>
  createBattle(w, { kind, tier: 2, ids: ids(w), mode: 'atb' }, seed)!;

const obeyed = (s: BattleState): boolean[] =>
  s.log.flatMap((e) => (e.k === 'order' ? [e.obeyed] : []));

describe('ATB Command bouts (recs FIGHT-40)', () => {
  it('sets up gauges and refuses turn actions', () => {
    const s = atb(party());
    expect(s.atb).toBeDefined();
    expect(s.mode).toBe('turn');
    expect(Object.values(s.atb!.gauge).every((g) => g === 0)).toBe(true);
    expect(battleAct(s, { k: 'strike' })).toBe(false);
    expect(battleAct(s, { k: 'guard' })).toBe(false);
  });

  it('gauges fill from Zip and a bout finishes on its own', () => {
    const s = atb(party(), 4);
    stepAtb(s, 100);
    const lead = s.sides[0][0]!;
    expect(s.atb!.gauge[lead.id]).toBeGreaterThan(0);
    let g = 0;
    while (!s.result && g++ < 5000) stepAtb(s, 100);
    expect(s.result).not.toBeNull();
    expect(s.log.some((e) => e.k === 'hit')).toBe(true);
  });

  it('each command has a 3 s cooldown', () => {
    const s = atb(party());
    expect(battleAct(s, { k: 'order', cmd: 'go' })).toBe(true);
    expect(battleAct(s, { k: 'order', cmd: 'go' })).toBe(false);
    expect(cooldownLeft(s, 'go')).toBe(BATTLE_ATB.cooldownMs);
    expect(battleAct(s, { k: 'order', cmd: 'careful' })).toBe(true);
    for (let t = 0; t < BATTLE_ATB.cooldownMs; t += 100) stepAtb(s, 100);
    if (!s.result) expect(battleAct(s, { k: 'order', cmd: 'go' })).toBe(true);
  });

  it('"Come back!" needs someone on the bench, and swaps at once when obeyed', () => {
    const w = party(3);
    for (const n of w.nubbins) {
      n.needs.affection = 100;
      n.trust = 100;
    }
    const s = atb(w, 2);
    const lead = s.sides[0][s.lead![0]]!.id;
    let tries = 0;
    while (s.sides[0][s.lead![0]]!.id === lead && tries++ < 20) {
      s.atb!.ready = {};
      battleAct(s, { k: 'order', cmd: 'back' });
    }
    expect(s.sides[0][s.lead![0]]!.id).not.toBe(lead);
    const solo = atb(party(1));
    expect(battleAct(solo, { k: 'order', cmd: 'back' })).toBe(false);
  });

  it('obedience: affection 100 / trust 100 listens ≥ 90%, affection 10 ≤ 50%', () => {
    expect(obeyChance(100, 100)).toBe(0.95);
    expect(obeyChance(10, 0)).toBeCloseTo(0.44);
    // The log is capped, so count each order on a cleared log.
    const count = (affection: number, trust: number): number => {
      const w = party(1);
      w.nubbins[0]!.needs.affection = affection;
      w.nubbins[0]!.trust = trust;
      const s = atb(w, 11);
      let yes = 0;
      for (let i = 0; i < 1000; i++) {
        s.atb!.ready = {};
        s.log = [];
        battleAct(s, { k: 'order', cmd: 'careful' });
        yes += obeyed(s).filter(Boolean).length;
      }
      return yes / 1000;
    };
    expect(count(100, 100)).toBeGreaterThanOrEqual(0.9);
    expect(count(10, 0)).toBeLessThanOrEqual(0.5);
  });

  it('an ignored order gets the personality gag', () => {
    const gags: Record<Personality, string> = {
      lazy: 'sit',
      mischievous: 'raspberry',
      shy: 'hide',
      cheerful: 'wave',
    };
    for (const [p, gag] of Object.entries(gags) as [Personality, string][]) {
      const s = atb(party(1), 5);
      s.sides[0][0]!.personality = p;
      s.atb!.bond[s.sides[0][0]!.id] = { affection: 0, trust: 0 };
      let seen: string | null = null;
      for (let i = 0; i < 50 && !seen; i++) {
        s.atb!.ready = {};
        battleAct(s, { k: 'order', cmd: 'go' });
        const e = s.log.find((x) => x.k === 'gag');
        if (e?.k === 'gag') seen = e.gag;
      }
      expect(seen).toBe(gag);
    }
  });

  it('replaying seed plus timestamped commands gives an identical log', () => {
    const start = atb(party(), 21);
    const live = JSON.parse(JSON.stringify(start)) as BattleState;
    const timed: TimedAction[] = [];
    const cmds: BattleAction[] = [
      { k: 'order', cmd: 'go' },
      { k: 'order', cmd: 'careful' },
      { k: 'pause', why: 'items', on: true },
      { k: 'pause', why: 'items', on: false },
      { k: 'order', cmd: 'switch' },
      { k: 'order', cmd: 'back' },
    ];
    let i = 0;
    for (let step = 0; step < 2000 && !live.result; step++) {
      if (step % 17 === 5) {
        const a = cmds[i++ % cmds.length]!;
        if (battleAct(live, a)) timed.push({ atMs: live.atb!.timeMs, a });
      }
      stepAtb(live, 100);
    }
    expect(timed.length).toBeGreaterThan(5);
    const again = replayAtb(start, timed, live.atb!.timeMs, battleAct);
    expect(JSON.stringify(again.log)).toBe(JSON.stringify(live.log));
    expect(again.result).toEqual(live.result);
  });

  it('holds 60 fps headless with six combatants', () => {
    const s = atb(party(3), 8, 'party');
    expect(s.sides[0].length + s.sides[1].length).toBe(6);
    const t0 = performance.now();
    let steps = 0;
    for (; steps < 600 && !s.result; steps++) stepAtb(s, 100);
    // Each 100 ms sim step must leave nearly all of a 16.7 ms frame free.
    expect((performance.now() - t0) / steps).toBeLessThan(2);
  });
});

describe('ATB uses the fixed step and pauses when hidden (recs FIGHT-41)', () => {
  it('a step never moves the bout more than 500 ms', () => {
    const s = atb(party());
    stepAtb(s, 60_000);
    expect(s.atb!.timeMs).toBe(BATTLE_ATB.maxCatchupMs);
  });

  it('a hidden-tab pause freezes the gauges until it lifts', () => {
    const s = atb(party());
    for (let i = 0; i < 5; i++) stepAtb(s, 100);
    expect(battleAct(s, { k: 'pause', why: 'hidden', on: true })).toBe(true);
    expect(pausedForHidden(s)).toBe(true);
    const frozen = JSON.stringify(s);
    for (let i = 0; i < 600; i++) stepAtb(s, 100);
    expect(JSON.stringify(s)).toBe(frozen);
    expect(battleAct(s, { k: 'pause', why: 'hidden', on: false })).toBe(true);
    expect(pausedForHidden(s)).toBe(false);
    stepAtb(s, 100);
    expect(s.atb!.timeMs).toBe(600);
  });

  it('the live world step drives the clock and pays the bout; offline catch-up never does', () => {
    const w = party();
    const events: SimEvent[] = [];
    applyCommand(
      w,
      { kind: 'battleStart', context: { kind: 'dojo', tier: 2, ids: ids(w), mode: 'atb' } },
      events,
    );
    expect(w.battle?.atb).toBeDefined();
    const before = JSON.stringify(w.battle);
    for (let i = 0; i < 50; i++) stepWorld(w, 100, undefined, true);
    expect(JSON.stringify(w.battle)).toBe(before);
    const ends: SimEvent[] = [];
    for (let i = 0; i < 20_000 && !w.battle!.result; i++) ends.push(...stepWorld(w, 100));
    expect(w.battle!.result).not.toBeNull();
    expect(ends.some((e) => e.kind === 'battleEnd')).toBe(true);
    // stepBattleMoves is the one entry point; with no live bout it does nothing new.
    stepBattleMoves(w, 100, []);
  });
});
