import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BATTLE_TEXT, formatEvent } from '../../src/config/strings-battle';
import { BATTLE } from '../../src/config/tuning-battle';
import {
  battleAct,
  battleSeedFor,
  bestAllyAction,
  combatantOf,
  createBattle,
  replay,
  type BattleAction,
  type BattleContext,
  type BattleState,
} from '../../src/sim/battle';
import { hatch } from '../../src/sim/lifecycle';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

/** A world with its two starting eggs hatched: a fresh, level-0 party. */
function freshWorld(seed = 3): World {
  const world = createWorld(seed, 0);
  const events: SimEvent[] = [];
  for (const n of world.nubbins) hatch(n, events, 0);
  return world;
}

const partyCtx = (w: World, tier: number): BattleContext => ({
  kind: 'party',
  tier,
  ids: w.nubbins.map((n) => n.id),
});

/** Plays a turn bout with the best plain move until it ends; returns the actions used. */
function autoplay(s: BattleState): BattleAction[] {
  const acts: BattleAction[] = [];
  for (let i = 0; i < 500 && !s.result; i++) {
    const a = bestAllyAction(s);
    acts.push(a);
    battleAct(s, a);
  }
  return acts;
}

/** Taps a timed bout every time the bar crosses its centre. */
function karateAutoplay(s: BattleState): void {
  const every = 1000 / s.karate!.barSpeed;
  for (let k = 1; k < 400 && !s.result; k++) battleAct(s, { k: 'tap', atMs: k * every });
}

describe('battle core (recs FIGHT-01)', () => {
  it('replays seed plus actions to an identical log and result, also through JSON', () => {
    const w = freshWorld();
    const start = createBattle(w, partyCtx(w, 2), 99)!;
    const live = JSON.parse(JSON.stringify(start)) as BattleState;
    const acts = autoplay(live);
    expect(live.result).not.toBeNull();
    const again = replay(start, acts);
    expect(again.log).toEqual(live.log);
    expect(again.result).toEqual(live.result);
    // Save mid-bout, load, carry on: the same ending.
    const half = replay(start, acts.slice(0, 3));
    const resumed = replay(JSON.parse(JSON.stringify(half)) as BattleState, acts.slice(3));
    expect(resumed.log).toEqual(live.log);
  });

  it('is pure sim: no Math.random, DOM or three in src/sim/battle', () => {
    const dir = join(__dirname, '../../src/sim/battle');
    for (const f of readdirSync(dir)) {
      const src = readFileSync(join(dir, f), 'utf8');
      expect(src, f).not.toMatch(/Math\.random|document\.|window\.|from 'three'/);
    }
  });

  it('a timed bout depends only on the tap times, not on how often the screen steps', () => {
    const w = freshWorld();
    const ctx: BattleContext = { kind: 'karate', tier: 1, nubbinId: w.nubbins[0]!.id };
    const a = createBattle(w, ctx, 5)!;
    const b = JSON.parse(JSON.stringify(a)) as BattleState;
    const taps = [400, 1300, 2210, 3000, 4800, 5100];
    for (const t of taps) battleAct(a, { k: 'tap', atMs: t });
    // b steps every 16 ms between taps, like a screen would.
    let ms = 0;
    for (const t of taps) {
      while (ms + 16 < t) battleAct(b, { k: 'advance', toMs: (ms += 16) });
      battleAct(b, { k: 'tap', atMs: t });
      ms = t;
    }
    expect(b.log).toEqual(a.log);
  });
});

describe('rewards come from the sim (recs FIGHT-02)', () => {
  it('a partyBoutResult claiming 99999 Shells pays only the tier prize', () => {
    const w = freshWorld();
    const before = w.inventory.shells;
    applyCommand(w, { kind: 'partyBoutResult', won: true, tier: 1, shells: 99999 }, []);
    expect(w.inventory.shells - before).toBe(BATTLE.prizes.party[0]);
    applyCommand(
      w,
      { kind: 'karateResult', nubbinId: w.nubbins[0]!.id, won: true, tier: 1, shells: 99999 },
      [],
    );
    expect(w.inventory.shells - before).toBe(BATTLE.prizes.party[0] + BATTLE.prizes.karate[0]);
    // A tier that does not exist pays nothing.
    applyCommand(
      w,
      { kind: 'karateResult', nubbinId: w.nubbins[0]!.id, won: true, tier: 9, shells: 5 },
      [],
    );
    expect(w.inventory.shells - before).toBe(BATTLE.prizes.party[0] + BATTLE.prizes.karate[0]);
  });

  it('a bout fought through the world commands pays once, and SL2 still hears partyBout', () => {
    const w = freshWorld();
    const events: SimEvent[] = [];
    applyCommand(w, { kind: 'battleStart', context: partyCtx(w, 1) }, events);
    expect(w.battle?.mode).toBe('turn');
    for (let i = 0; i < 500 && !w.battle!.result; i++)
      applyCommand(w, { kind: 'battleAct', action: bestAllyAction(w.battle!) }, events);
    const won = w.battle!.result!.winner === 0;
    const prize = won
      ? BATTLE.prizes.party[0]
      : Math.round(BATTLE.prizes.party[0] * BATTLE.prizes.partyLossShare);
    const shells = w.inventory.shells;
    expect(events.find((e) => e.kind === 'partyBout')).toMatchObject({
      won,
      tier: 1,
      shells: prize,
    });
    expect(events.find((e) => e.kind === 'battleEnd')).toMatchObject({
      context: 'party',
      shells: prize,
    });
    // Acting on or forfeiting a finished bout pays nothing more.
    applyCommand(w, { kind: 'battleAct', action: { k: 'guard' } }, events);
    applyCommand(w, { kind: 'battleForfeit' }, events);
    expect(w.inventory.shells).toBe(shells);
  });

  it('a forfeit pays nothing and records no dojo loss', () => {
    const w = freshWorld();
    const id = w.nubbins[0]!.id;
    const shells = w.inventory.shells;
    applyCommand(
      w,
      { kind: 'battleStart', context: { kind: 'karate', tier: 1, nubbinId: id } },
      [],
    );
    applyCommand(w, { kind: 'battleForfeit' }, []);
    expect(w.battle?.result).toEqual({ winner: 1, reason: 'forfeit' });
    expect(w.inventory.shells).toBe(shells);
    expect(w.karate.losses).toBe(0);
  });

  it('refuses a dojo tier above the next belt and an unhatched fighter', () => {
    const w = freshWorld();
    expect(createBattle(w, { kind: 'karate', tier: 2, nubbinId: w.nubbins[0]!.id }, 1)).toBeNull();
    const egg = createWorld(4, 0);
    expect(
      createBattle(egg, { kind: 'karate', tier: 1, nubbinId: egg.nubbins[0]!.id }, 1),
    ).toBeNull();
  });
});

describe('bouts are seeded from the world (recs FIGHT-03)', () => {
  it('two runs from the same save with the same taps give identical logs; the next bout differs', () => {
    const run = (): { log: unknown; seed: number; runs: number } => {
      const w = freshWorld(11);
      applyCommand(w, { kind: 'battleStart', context: partyCtx(w, 2) }, []);
      const seed = w.battle!.seed;
      for (let i = 0; i < 6; i++)
        applyCommand(w, { kind: 'battleAct', action: { k: i % 2 ? 'guard' : 'strike' } }, []);
      return { log: w.battle!.log, seed, runs: w.battleRuns ?? 0 };
    };
    const a = run();
    const b = run();
    expect(b.log).toEqual(a.log);
    expect(a.runs).toBe(1);
    const w = freshWorld(11);
    const first = battleSeedFor(w, partyCtx(w, 2));
    expect(first).toBe(a.seed);
    w.battleRuns = 1;
    expect(battleSeedFor(w, partyCtx(w, 2))).not.toBe(first);
  });
});

describe('first bouts are winnable (recs FIGHT-06)', () => {
  const rate = (tier: number, mode: 'party' | 'karate'): number => {
    let wins = 0;
    for (let seed = 1; seed <= 200; seed++) {
      const w = freshWorld(seed);
      const ctx: BattleContext =
        mode === 'party' ? partyCtx(w, tier) : { kind: 'karate', tier, nubbinId: w.nubbins[0]!.id };
      if (mode === 'karate') w.karate.belt = tier - 1;
      const s = createBattle(w, ctx, seed * 7919)!;
      if (mode === 'party') autoplay(s);
      else karateAutoplay(s);
      if (s.result?.winner === 0) wins++;
    }
    return wins / 200;
  };

  it('a level-0 party pressing the best move wins tier 1 at least 90% of the time', () => {
    expect(rate(1, 'party')).toBeGreaterThanOrEqual(0.9);
    expect(rate(1, 'karate')).toBeGreaterThanOrEqual(0.9);
  });

  it('and loses tier 3 at least 80% of the time', () => {
    expect(rate(3, 'party')).toBeLessThanOrEqual(0.2);
    expect(rate(3, 'karate')).toBeLessThanOrEqual(0.2);
  });
});

describe('one set of derived stats (recs FIGHT-09)', () => {
  it('a merged Nubbin gets identical stats in the dojo, party and encounter bouts', () => {
    const w = freshWorld();
    const [a, b] = w.nubbins;
    a!.stats.power.points = 1200;
    b!.stats.stamina.points = 3000;
    w.partners = [a!.id, b!.id];
    w.merge = { a: a!.id, b: b!.id, untilMs: w.timeMs + 60_000 } as World['merge'];
    const base = combatantOf(a!, w);
    const k = createBattle(w, { kind: 'karate', tier: 1, nubbinId: a!.id }, 1)!;
    const p = createBattle(w, { kind: 'party', tier: 1, ids: [a!.id] }, 1)!;
    const e = createBattle(
      w,
      {
        kind: 'encounter',
        tier: 1,
        ids: [a!.id],
        source: 'test',
        key: 'k',
        foes: [{ species: 'chao', level: 1 }],
      },
      1,
    )!;
    for (const s of [k, p, e]) expect(s.sides[0][0]).toEqual(base);
    // The merge is in: Stamina comes from the partner.
    expect(base.maxHp).toBeGreaterThan(BATTLE.derive.hp + 20);
  });
});

describe('tuckered out, never knocked down (recs FIGHT-05)', () => {
  it('no battle string speaks of knocking out, fainting or dying', () => {
    const lines = Object.values(BATTLE_TEXT)
      .map((v) =>
        typeof v === 'function'
          ? (v as (...a: unknown[]) => string)('A', 1, 'B', 2)
          : JSON.stringify(v),
      )
      .join('\n');
    expect(lines).not.toMatch(/knocked|faint|dies|dead|kill|\bdown\b/i);
    const name = (id: string): string => id;
    const t0 = formatEvent({ k: 'tuckered', who: 'A', side: 0 }, name)!;
    const t1 = formatEvent({ k: 'tuckered', who: 'B', side: 1 }, name)!;
    expect(t0).toMatch(/tuckered out/);
    expect(t1).toMatch(/home/);
  });
});
