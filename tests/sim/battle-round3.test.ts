import { describe, expect, it } from 'vitest';
import { BATTLE } from '../../src/config/tuning-battle';
import { SCANS } from '../../src/config/tuning';
import {
  battleAct,
  bench,
  chooseAction,
  circuitTeam,
  createBattle,
  onField,
  type AiLevel,
  MOVES,
  type BattleState,
  type Combatant,
} from '../../src/sim/battle';
import { replacementFor } from '../../src/sim/battle/ai';
import { CIRCUIT_TIERS, circuitWin } from '../../src/sim/battle/circuit';
import { grantRewards } from '../../src/sim/battle/rewards';
import { hatch } from '../../src/sim/lifecycle';
import { Rng } from '../../src/sim/rng';
import { rosterCap } from '../../src/sim/roster';
import { NUBBIN_TYPES, STAT_KEYS, type SimEvent, type World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

/** Round 3 of lane C: singles, items, befriending, the Circuit, AI levels and gentle bouts. */
function trio(points = 3000, seed = 3): World {
  const w = createWorld(seed, 0);
  const events: SimEvent[] = [];
  const base = w.nubbins[0]!;
  while (w.nubbins.length < 3)
    w.nubbins.push({ ...structuredClone(base), id: `nub-x${w.nubbins.length}` });
  for (const n of w.nubbins) {
    hatch(n, events, 0);
    for (const k of STAT_KEYS) n.stats[k].points = points;
  }
  w.karate.belt = 3;
  return w;
}

const ids = (w: World): string[] => w.nubbins.map((n) => n.id);
const dojo = (w: World, tier = 1, seed = 1): BattleState =>
  createBattle(w, { kind: 'dojo', tier, ids: ids(w) }, seed)!;

describe('singles with a bench (recs FIGHT-19)', () => {
  it('a swap goes first and the incoming Nubbin takes the queued attack', () => {
    const w = trio();
    for (let seed = 1; seed <= 20; seed++) {
      const s = dojo(w, 2, seed);
      const [a, b] = s.sides[0];
      const foe = s.sides[1][0]!;
      expect(onField(s, a!)).toBe(true);
      expect(onField(s, b!)).toBe(false);
      // The foe aims at the active one; then we swap.
      s.choices = { [foe.id]: { k: 'strike', target: a!.id } };
      foe.flutter = 0;
      a!.flutter = b!.flutter = 0;
      const hpA = a!.hp;
      battleAct(s, { k: 'swap', to: b!.id });
      const swapAt = s.log.findIndex((e) => e.k === 'swap');
      const hitAt = s.log.findIndex((e) => e.k === 'hit' || e.k === 'miss');
      expect(swapAt).toBeGreaterThan(-1);
      expect(swapAt).toBeLessThan(hitAt);
      expect(a!.hp).toBe(hpA);
      const hit = s.log.find((e) => e.k === 'hit' || e.k === 'miss');
      expect(hit && 'to' in hit ? hit.to : null).toBe(b!.id);
    }
  });

  it('waits for a pick when the active one is tuckered; all three tuckered is a loss', () => {
    const w = trio(0);
    const s = dojo(w, 3, 4);
    let guard = 0;
    let replaced = 0;
    while (!s.result && guard++ < 400) {
      if (s.phase === 'replace') {
        expect(battleAct(s, { k: 'guard' })).toBe(false);
        replaced += 1;
        battleAct(s, { k: 'swap', to: bench(s, 0)[0]!.id });
      } else battleAct(s, { k: 'guard' });
    }
    expect(replaced).toBe(2);
    expect(s.result).toEqual({ winner: 1, reason: 'tuckered' });
    expect(s.sides[0].every((c) => c.hp === 0)).toBe(true);
  });

  it('remembers the last party', () => {
    const w = trio();
    const events: SimEvent[] = [];
    applyCommand(
      w,
      { kind: 'battlePrefs', prefs: { party: [ids(w)[2]!, 'nope', ids(w)[0]!] } },
      events,
    );
    expect(w.battlePrefs?.party).toEqual([ids(w)[2], ids(w)[0]]);
  });
});

describe('battle items (recs FIGHT-20)', () => {
  function withItems(): World {
    const w = trio();
    w.inventory.fruit = 3;
    w.inventory.toys = { ball: 1 };
    return w;
  }
  it('a forfeit refunds the items; a finished bout spends them', () => {
    for (const forfeit of [true, false]) {
      const w = withItems();
      const events: SimEvent[] = [];
      applyCommand(
        w,
        { kind: 'battleStart', context: { kind: 'dojo', tier: 1, ids: ids(w) } },
        events,
      );
      const s = w.battle!;
      s.sides[0][0]!.hp -= 5;
      applyCommand(w, { kind: 'battleAct', action: { k: 'item', item: 'fruit' } }, events);
      const foe = s.sides[1][0]!;
      applyCommand(
        w,
        { kind: 'battleAct', action: { k: 'item', item: 'toy', target: foe.id } },
        events,
      );
      expect(s.spent).toEqual({ fruit: 1, toy: 1 });
      expect(w.inventory.fruit).toBe(3);
      if (forfeit) applyCommand(w, { kind: 'battleForfeit' }, events);
      else {
        let guard = 0;
        while (!s.result && guard++ < 300) {
          const me = s.sides[0][s.active];
          const t = s.sides[1].find((c) => onField(s, c));
          applyCommand(
            w,
            {
              kind: 'battleAct',
              action:
                s.phase === 'replace'
                  ? { k: 'swap', to: bench(s, 0)[0]!.id }
                  : { k: 'strike', ...(t && me ? { target: t.id } : {}) },
            },
            events,
          );
        }
      }
      expect(s.result).not.toBeNull();
      expect(w.inventory.fruit).toBe(forfeit ? 3 : 2);
      expect(w.inventory.toys.ball).toBe(forfeit ? 1 : 0);
    }
  });

  it('a toy works once per foe and makes it play instead of acting', () => {
    const w = withItems();
    w.inventory.toys = { ball: 2 };
    const s = dojo(w, 1, 2);
    const foe = s.sides[1][0]!;
    expect(battleAct(s, { k: 'item', item: 'toy', target: foe.id })).toBe(true);
    expect(s.log.some((e) => e.k === 'play' && e.who === foe.id)).toBe(true);
    expect(battleAct(s, { k: 'item', item: 'toy', target: foe.id })).toBe(false);
  });
});

describe('befriending (recs FIGHT-21)', () => {
  function wildBout(w: World, shadow = false): BattleState {
    const events: SimEvent[] = [];
    applyCommand(
      w,
      {
        kind: 'battleStart',
        context: {
          kind: 'encounter',
          tier: 1,
          ids: ids(w).slice(0, 1),
          source: 'test',
          key: 'k',
          foes: [{ species: 'zapling', level: 3, wild: true, ...(shadow ? { shadow } : {}) }],
          singles: true,
        },
      },
      events,
    );
    return w.battle!;
  }
  const calmUp = (w: World, s: BattleState, events: SimEvent[]): void => {
    w.inventory.fruit = 50;
    s.bag = { fruit: 50 };
    let guard = 0;
    while (!s.result && guard++ < 50) {
      const foe = s.sides[1][0]!;
      applyCommand(
        w,
        { kind: 'battleAct', action: { k: 'item', item: 'fruit', target: foe.id } },
        events,
      );
    }
  };

  it('Calm 100 with room brings home a child of that species', () => {
    const w = trio();
    const s = wildBout(w);
    const events: SimEvent[] = [];
    const before = w.nubbins.length;
    calmUp(w, s, events);
    expect(s.result).toEqual({ winner: 0, reason: 'friends' });
    expect(w.nubbins.length).toBe(before + 1);
    const kid = w.nubbins[w.nubbins.length - 1]!;
    expect(kid.species).toBe('zapling');
    expect(kid.stage).toBe('child');
    expect(events.some((e) => e.kind === 'befriended' && e.child === kid.id)).toBe(true);
  });

  it('with a full roster the scan fills to 100 and a gift is left', () => {
    const w = trio();
    while (w.nubbins.length < rosterCap(w))
      w.nubbins.push({ ...structuredClone(w.nubbins[0]!), id: `nub-f${w.nubbins.length}` });
    const s = wildBout(w);
    const events: SimEvent[] = [];
    const shells = w.inventory.shells;
    calmUp(w, s, events);
    expect(w.scans.zapling).toBeGreaterThanOrEqual(SCANS.full);
    expect(w.inventory.shells).toBe(
      shells + BATTLE.befriend.giftShells + BATTLE.prizes.encounter[0],
    );
  });

  it('a Shadow stray never loses HP, and a bonk lowers Calm', () => {
    const w = trio(9000);
    const s = wildBout(w, true);
    const foe = s.sides[1][0]!;
    foe.calm = 50;
    for (let i = 0; i < 10 && !s.result; i++) battleAct(s, { k: 'strike', target: foe.id });
    expect(foe.hp).toBe(foe.maxHp);
    expect(s.log.some((e) => e.k === 'unhurt')).toBe(true);
    const plain = wildBout(trio(9000));
    const f2 = plain.sides[1][0]!;
    f2.calm = 50;
    f2.flutter = 0;
    plain.sides[0][0]!.zip = 999;
    battleAct(plain, { k: 'strike', target: f2.id });
    expect(plain.log.some((e) => e.k === 'calm' && e.delta === BATTLE.befriend.bonk)).toBe(true);
  });

  it('a tuckered wild one goes home and fills some of its scan', () => {
    const w = trio(9000);
    const s = wildBout(w);
    const events: SimEvent[] = [];
    let guard = 0;
    while (!s.result && guard++ < 50)
      applyCommand(w, { kind: 'battleAct', action: { k: 'strike' } }, events);
    expect(s.result?.winner).toBe(0);
    expect(w.scans.zapling).toBe(BATTLE.befriend.tuckeredScan);
  });
});

describe('the Grove Circuit (recs FIGHT-22)', () => {
  it('teams are fixed per save, and differ between saves', () => {
    for (const t of CIRCUIT_TIERS.flat()) {
      expect(circuitTeam(trio(1, 5), t)).toEqual(circuitTeam(trio(1, 5), t));
      expect(circuitTeam(trio(1, 5), t).length).toBeGreaterThanOrEqual(1);
    }
    const a = CIRCUIT_TIERS.flat().map((t) => circuitTeam(trio(1, 5), t).join());
    const b = CIRCUIT_TIERS.flat().map((t) => circuitTeam(trio(1, 6), t).join());
    expect(a).not.toEqual(b);
  });

  it('tiers open in order, and each ribbon is granted once', () => {
    const w = trio(9000);
    expect(
      createBattle(w, { kind: 'circuit', trainer: 'pixel', tier: 2, ids: ids(w) }, 1),
    ).toBeNull();
    const events: SimEvent[] = [];
    const pts = w.skillPoints;
    for (const t of CIRCUIT_TIERS[0]!) circuitWin(w, t, false, events);
    circuitWin(w, 'fern', false, events);
    expect(w.circuit?.ribbons).toEqual(CIRCUIT_TIERS[0]);
    expect(w.skillPoints).toBe(pts + 4 * BATTLE.circuit.skillPoints);
    expect(events.filter((e) => e.kind === 'circuitRibbon').length).toBe(4);
    expect(
      createBattle(w, { kind: 'circuit', trainer: 'pixel', tier: 2, ids: ids(w) }, 1),
    ).not.toBeNull();
  });

  it("a win pays the Keeper's ribbon through the bout", () => {
    const w = trio(9000);
    const s = createBattle(w, { kind: 'circuit', trainer: 'fern', tier: 1, ids: ids(w) }, 3)!;
    s.result = { winner: 0, reason: 'tuckered' };
    const events: SimEvent[] = [];
    grantRewards(w, s, events);
    expect(w.circuit?.ribbons).toEqual(['fern']);
  });
});

const MOVE_POOL = MOVES.filter(
  (m) => m.source !== 'basic' && m.source !== 'fallback' && !m.special,
).map((m) => m.id);

/** A bout of `w`'s party against a mirror copy of itself; side 0 plays `a`, side 1 plays `b`. */
function mirrorBout(seed: number, a: AiLevel, b: AiLevel): BattleState['result'] {
  const rng = Rng.fromSeed(seed * 7919);
  const w = trio(0, seed);
  for (const n of w.nubbins) for (const k of STAT_KEYS) n.stats[k].points = rng.int(10, 60) * 100;
  const s = createBattle(w, { kind: 'dojo', tier: 2, ids: ids(w) }, seed)!;
  // Random types and four random moves each, so choosing well matters.
  s.sides[0].forEach((c) => {
    c.type = rng.pick(NUBBIN_TYPES);
    c.moves = [];
    while (c.moves.length < 4) {
      const m = rng.pick(MOVE_POOL);
      if (!c.moves.includes(m)) c.moves.push(m);
    }
  });
  s.sides[1] = s.sides[0].map((c, i) => ({
    ...structuredClone(c),
    id: `foe-${i}`,
    side: 1 as const,
    nubbinId: null,
    name: null,
  }));
  s.bag = { fruit: 2 };
  s.foeBag = { fruit: 2 };
  s.ai = b;
  const pick = Rng.fromSeed(seed * 31 + 1);
  let guard = 0;
  while (!s.result && guard++ < 400) {
    if (s.phase === 'replace') battleAct(s, { k: 'swap', to: replacementFor(s, 0).id });
    else battleAct(s, chooseAction(s, s.sides[0][s.active]!.id, a, pick));
  }
  return s.result;
}

function rate(a: AiLevel, b: AiLevel, n: number): number {
  let wins = 0;
  for (let seed = 1; seed <= n; seed++) if (mirrorBout(seed, a, b)?.winner === 0) wins += 1;
  // Each pairing is played from both sides, so neither side's seat helps it.
  for (let seed = 1; seed <= n; seed++) if (mirrorBout(seed + n, b, a)?.winner === 1) wins += 1;
  return wins / (2 * n);
}

describe('AI levels (recs FIGHT-23)', () => {
  it('Keeper beats Sprout at least 75% and Champion beats Keeper at least 70%', () => {
    expect(rate('keeper', 'sprout', 250)).toBeGreaterThanOrEqual(0.75);
    expect(rate('champion', 'keeper', 250)).toBeGreaterThanOrEqual(0.7);
  }, 60_000);

  it('a Champion decision takes under 2 ms', () => {
    const w = trio(4000);
    const s = dojo(w, 3, 9);
    s.ai = 'champion';
    const rng = Rng.fromSeed(1);
    for (let i = 0; i < 20; i++) chooseAction(s, s.sides[1][0]!.id, 'champion', rng);
    const t0 = performance.now();
    const n = 200;
    for (let i = 0; i < n; i++) chooseAction(s, s.sides[1][0]!.id, 'champion', rng);
    expect((performance.now() - t0) / n).toBeLessThan(2);
  });
});

describe('gentle bouts (recs FIGHT-24)', () => {
  it('is never lost over 200 seeds', () => {
    for (let seed = 1; seed <= 200; seed++) {
      const w = trio(0, seed);
      w.battlePrefs = { gentle: true };
      const s = dojo(w, 3, seed);
      expect(s.gentle).toBe('all');
      let guard = 0;
      while (!s.result && guard++ < 200) battleAct(s, { k: 'guard' });
      expect(s.result?.winner).toBe(0);
      expect(s.sides[0].every((c: Combatant) => c.hp >= 1)).toBe(true);
    }
  });

  it('costs no Puff, and the hug pays half', () => {
    const w = trio(0);
    w.battlePrefs = { gentle: true };
    const s = dojo(w, 1, 2);
    const me = s.sides[0][0]!;
    me.puff = 0;
    me.moves = ['belly-slide'];
    expect(battleAct(s, { k: 'move', move: 'belly-slide' })).toBe(true);
  });
});

describe('playback needs an instant sim (recs FIGHT-26)', () => {
  it('a 10-turn bout resolves in under 1 ms', () => {
    const w = trio(2000);
    const run = (): number => {
      const s = dojo(w, 2, 5);
      for (const c of [...s.sides[0], ...s.sides[1]]) c.hp = c.maxHp = 100_000;
      const t0 = performance.now();
      for (let i = 0; i < 10; i++) battleAct(s, { k: 'strike' });
      expect(s.turn).toBe(11);
      return performance.now() - t0;
    };
    for (let i = 0; i < 5; i++) run();
    const times = Array.from({ length: 20 }, run).sort((a, b) => a - b);
    expect(times[10]!).toBeLessThan(1);
  });
});
