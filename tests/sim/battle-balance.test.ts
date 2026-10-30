import { describe, expect, it } from 'vitest';
import { BATTLE } from '../../src/config/tuning-battle';
import {
  battleAct,
  chooseAction,
  createBattle,
  MOVES,
  type AiLevel,
  type BattleContext,
  type BattleState,
} from '../../src/sim/battle';
import { replacementFor } from '../../src/sim/battle/ai';
import { hatch } from '../../src/sim/lifecycle';
import { Rng } from '../../src/sim/rng';
import { NUBBIN_TYPES, STAT_KEYS, type NubbinType, type SimEvent } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

/**
 * The balance harness (recs FIGHT-81): seeded bouts of random legal teams at each AI level, so
 * a tuning change that breaks the type loop, makes one move the only pick or lets bouts drag
 * shows up in CI. A legal team is three Nubbins at one shared level (the mirror), each with a
 * random type and four moves drawn mostly from its own type and Normal (as its kit would be),
 * sometimes from anywhere (a critter's part). Bouts are dojo singles with a bench, the format
 * of the dojo and the Circuit. The whole file must stay under 3 s, like the full-life test, so
 * the Champion, which plays each choice one turn ahead, gets a smaller sample.
 */
const POOL = MOVES.filter((m) => m.source !== 'basic' && m.source !== 'fallback' && !m.special);
/** A kit slot comes from the Nubbin's own type or Normal this often. */
const OWN_SHARE = 0.75;

const world = createWorld(1, 0);
{
  const events: SimEvent[] = [];
  const base = world.nubbins[0]!;
  while (world.nubbins.length < 3)
    world.nubbins.push({ ...structuredClone(base), id: `nub-x${world.nubbins.length}` });
  world.nubbins.length = 3;
  for (const n of world.nubbins) hatch(n, events, 0);
  world.karate.belt = 3;
}

interface Tally {
  /** Per type: score (a win 1, a draw ½) and appearances. */
  types: Record<string, [number, number]>;
  turns: number[];
  /** Side 0's chosen moves, by id. */
  picks: Record<string, number>;
  pickCount: number;
  /** Per move: the score of the combatants carrying it, and how many did. */
  held: Record<string, [number, number]>;
}

/** No move may lift its carriers' score above this (a power-200 move reaches about 0.73). */
const HELD_MAX = 0.7;
/** The power curve: a move's power is at most slack × (base + perPuff × Puff). */
const CURVE_BASE = 40;
const CURVE_PER_PUFF = 10;
const CURVE_SLACK = 1.25;
/** Only moves carried this often are judged, so a rare one can't trip it on a small sample. */
const HELD_MIN = 100;
/** The Sprout's bouts may run a little longer than the Keeper's 14 (it never aims). */
const SPROUT_MEDIAN_MAX = 18;

function bout(seed: number, level: AiLevel, t: Tally): void {
  const rng = Rng.fromSeed(seed * 7919 + 13);
  const points = rng.int(5, 60) * 100;
  for (const n of world.nubbins) for (const k of STAT_KEYS) n.stats[k].points = points;
  const ids = world.nubbins.map((n) => n.id);
  const s = createBattle(world, { kind: 'dojo', tier: 2, ids }, seed)!;
  s.sides[1] = s.sides[0].map((c, i) => ({
    ...structuredClone(c),
    id: `foe-${i}`,
    side: 1 as const,
    nubbinId: null,
    name: null,
  }));
  for (const c of [...s.sides[0], ...s.sides[1]]) {
    c.type = rng.pick(NUBBIN_TYPES);
    const own = POOL.filter((m) => m.type === c.type || m.type === 'normal');
    c.moves = [];
    while (c.moves.length < 4) {
      const m = rng.chance(OWN_SHARE) ? rng.pick(own) : rng.pick(POOL);
      if (!c.moves.includes(m.id)) c.moves.push(m.id);
    }
  }
  s.ai = level;
  play(s, level, Rng.fromSeed(seed * 31 + 1), t);
  t.turns.push(s.turn - 1);
  for (const side of [0, 1] as const)
    for (const c of s.sides[side]) {
      const r = (t.types[c.type] ??= [0, 0]);
      r[1] += 1;
      const score = s.result?.winner === side ? 1 : s.result?.winner === null ? 0.5 : 0;
      r[0] += score;
      for (const m of c.moves) {
        const h = (t.held[m] ??= [0, 0]);
        h[0] += score;
        h[1] += 1;
      }
    }
}

function play(s: BattleState, level: AiLevel, pick: Rng, t: Tally): void {
  let guard = 0;
  while (!s.result && guard++ < 400) {
    if (s.phase === 'replace') {
      battleAct(s, { k: 'swap', to: replacementFor(s, 0).id });
      continue;
    }
    const a = chooseAction(s, s.sides[0][s.active]!.id, level, pick);
    if (a.k === 'move' || a.k === 'strike') {
      const id = a.k === 'move' ? a.move : 'bonk';
      t.picks[id] = (t.picks[id] ?? 0) + 1;
      t.pickCount += 1;
    }
    battleAct(s, a);
  }
}

function run(level: AiLevel, n: number): Tally {
  const t: Tally = { types: {}, turns: [], picks: {}, pickCount: 0, held: {} };
  for (let seed = 1; seed <= n; seed++) bout(seed, level, t);
  t.turns.sort((a, b) => a - b);
  return t;
}

const median = (xs: number[]): number => xs[xs.length >> 1] ?? 0;
const rates = (t: Tally): Record<string, number> =>
  Object.fromEntries(Object.entries(t.types).map(([k, [w, n]]) => [k, w / n]));

const started = performance.now();
let keeperTally: Tally | null = null;
/** The Keeper sample is shared by two checks. */
const keeper = (): Tally => (keeperTally ??= run('keeper', 1000));

describe('balance harness (recs FIGHT-81)', () => {
  it('every move sits on the power curve: Puff buys power', () => {
    // Today's curve is exactly 40 + 10 × Puff; the slack leaves room for a new move, never 200.
    for (const m of MOVES)
      expect(m.power, m.id).toBeLessThanOrEqual(
        CURVE_SLACK * (CURVE_BASE + CURVE_PER_PUFF * m.puff),
      );
  });

  it('Keeper level: the type loop holds, bouts are 6–14 turns, none past 60', () => {
    const t = keeper();
    const r = rates(t);
    for (const ty of NUBBIN_TYPES as readonly NubbinType[]) {
      expect(r[ty], ty).toBeGreaterThanOrEqual(0.45);
      expect(r[ty], ty).toBeLessThanOrEqual(0.55);
    }
    expect(median(t.turns)).toBeGreaterThanOrEqual(6);
    expect(median(t.turns)).toBeLessThanOrEqual(14);
    expect(t.turns.at(-1)).toBeLessThanOrEqual(BATTLE.turn.maxRounds);
  });

  it('Keeper level: no move carries its holders or takes over the picks', () => {
    const t = keeper();
    for (const [id, [score, n]] of Object.entries(t.held))
      if (n >= HELD_MIN) expect(score / n, id).toBeLessThanOrEqual(HELD_MAX);
    for (const [id, n] of Object.entries(t.picks)) expect(n / t.pickCount, id).toBeLessThan(0.35);
  });

  it('Sprout level: the type loop holds, bouts are 6–14 turns, none past 60', () => {
    const t = run('sprout', 400);
    const r = rates(t);
    for (const ty of NUBBIN_TYPES as readonly NubbinType[]) {
      expect(r[ty], ty).toBeGreaterThanOrEqual(0.45);
      expect(r[ty], ty).toBeLessThanOrEqual(0.55);
    }
    // Lane C r8: the Sprout's median (34 before its picks leaned to hits, 17 now). It stays
    // above the Keeper's 6–14 on purpose: a kid's foe still picks at random among its hits.
    expect(median(t.turns)).toBeGreaterThanOrEqual(6);
    expect(median(t.turns)).toBeLessThanOrEqual(SPROUT_MEDIAN_MAX);
    expect(t.turns.at(-1)).toBeLessThanOrEqual(BATTLE.turn.maxRounds);
  });

  it('Champion level: no move is more than 35% of its picks, bouts stay in 6–14', () => {
    const t = run('champion', 30);
    for (const [id, n] of Object.entries(t.picks)) expect(n / t.pickCount, id).toBeLessThan(0.35);
    expect(median(t.turns)).toBeGreaterThanOrEqual(6);
    expect(median(t.turns)).toBeLessThanOrEqual(14);
    expect(t.turns.at(-1)).toBeLessThanOrEqual(BATTLE.turn.maxRounds);
  });

  it('the stalemate guard: past turn 40 Guard counts half; encounters keep the old rule', () => {
    const ids = world.nubbins.map((n) => n.id);
    for (const n of world.nubbins) for (const k of STAT_KEYS) n.stats[k].points = 3000;
    const hitAt = (turn: number, encounter: boolean): number => {
      const ctx: BattleContext = encounter
        ? {
            kind: 'encounter',
            tier: 2,
            ids,
            source: 't',
            key: 'k',
            singles: true,
            foes: [{ species: 'chao', level: 30 }],
          }
        : { kind: 'dojo', tier: 2, ids };
      const s = createBattle(world, ctx, 4)!;
      for (const c of [...s.sides[0], ...s.sides[1]]) c.hp = c.maxHp = 5000;
      s.turn = turn;
      battleAct(s, { k: 'strike' });
      const e = s.log.find((x) => x.k === 'hit' && x.by === s.sides[0][0]!.id);
      return e?.k === 'hit' ? e.dmg : -1;
    };
    expect(hitAt(41, false)).toBeGreaterThan(hitAt(40, false));
    expect(hitAt(41, true)).toBe(hitAt(40, true));
  });

  it('finishes inside the 3 s budget', () => {
    expect(performance.now() - started).toBeLessThan(3000);
  });
});
