import { BATTLE } from '../../src/config/tuning-battle';
import {
  battleAct,
  chooseAction,
  createBattle,
  MOVES,
  type AiLevel,
  type BattleState,
} from '../../src/sim/battle';
import { replacementFor } from '../../src/sim/battle/ai';
import { hatch } from '../../src/sim/lifecycle';
import { Rng } from '../../src/sim/rng';
import { NUBBIN_TYPES, STAT_KEYS, type SimEvent } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

/** When the harness loaded: the balance test's 3 s budget counts from here. */
export const started = performance.now();

/**
 * The balance harness (recs FIGHT-81): seeded bouts of random legal teams at each AI level, so
 * a tuning change that breaks the type loop, makes one move the only pick or lets bouts drag
 * shows up in CI. A legal team is three Nubbins at one shared level (the mirror), each with a
 * random type and four moves drawn mostly from its own type and Normal (as its kit would be),
 * sometimes from anywhere (a critter's part). Bouts are dojo singles with a bench, the format
 * of the dojo and the Circuit. The whole file must stay under 3 s, like the full-life test, so
 * the Champion, which plays each choice one turn ahead, gets a smaller sample.
 */
export const POOL = MOVES.filter(
  (m) => m.source !== 'basic' && m.source !== 'fallback' && !m.special,
);
/** A kit slot comes from the Nubbin's own type or Normal this often. */
export const OWN_SHARE = 0.75;

export const world = createWorld(1, 0);
{
  const events: SimEvent[] = [];
  const base = world.nubbins[0]!;
  while (world.nubbins.length < 3)
    world.nubbins.push({ ...structuredClone(base), id: `nub-x${world.nubbins.length}` });
  world.nubbins.length = 3;
  for (const n of world.nubbins) hatch(n, events, 0);
  world.karate.belt = 3;
}

export interface Tally {
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
export const HELD_MAX = 0.7;
/** The power curve: a move's power is at most slack × (base + perPuff × Puff). */
export const CURVE_BASE = 40;
export const CURVE_PER_PUFF = 10;
export const CURVE_SLACK = 1.25;
/** Only moves carried this often are judged, so a rare one can't trip it on a small sample. */
export const HELD_MIN = 100;
/** The Sprout's bouts may run a little longer than the Keeper's 14 (it never aims). */
export const SPROUT_MEDIAN_MAX = 18;

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

export function run(level: AiLevel, n: number): Tally {
  const t: Tally = { types: {}, turns: [], picks: {}, pickCount: 0, held: {} };
  for (let seed = 1; seed <= n; seed++) bout(seed, level, t);
  t.turns.sort((a, b) => a - b);
  return t;
}

export const median = (xs: number[]): number => xs[xs.length >> 1] ?? 0;
export const rates = (t: Tally): Record<string, number> =>
  Object.fromEntries(Object.entries(t.types).map(([k, [w, n]]) => [k, w / n]));

/**
 * The Champion's checks (no move over 35% of its picks, median 6–14, none past the round
 * limit), shared by the test's small sample and the 2,000-bout script
 * (`tests/tools/battle-balance-champion.ts`). Returns the failures, empty when it holds.
 */
export function championProblems(t: Tally): string[] {
  const out: string[] = [];
  for (const [id, n] of Object.entries(t.picks))
    if (n / t.pickCount >= 0.35)
      out.push(`${id} is ${((100 * n) / t.pickCount).toFixed(1)}% of picks`);
  const m = median(t.turns);
  if (m < 6 || m > 14) out.push(`median ${m} turns`);
  if ((t.turns.at(-1) ?? 0) > BATTLE.turn.maxRounds) out.push(`a bout ran ${t.turns.at(-1)} turns`);
  return out;
}
