/**
 * R0528 (SOUL-10): traits on top of the personality, so two cheerful Nubbins still differ.
 * Every Nubbin has one trait rolled from its own seed (no save field, the same on every
 * load, like its likes); a second is earned by care before evolution and stored in
 * `n.earnedTrait`. Traits are behaviour and looks only, never stats: idle multipliers on
 * top of the personality's, a quirk act of their own, and small hooks elsewhere (trips,
 * sneezes, naps, rain, tastes, lessons, tickles).
 *
 * Quirk chances are hashed from the Nubbin and the second, not drawn from the world's rng.
 * Unlike the antics they also run in a short catch-up's fine steps: they are everyday
 * character, like the idle table, and a short gap must play exactly as live play would
 * (the coarse steps of a long absence never run behaviour at all).
 */
import { TRAIT_IDS, TRAIT_TUNING, TRAITS, type TraitId } from '../config/tuning';
import { liveliness } from './antics';
import { hashSeed } from './rng';
import type { IdleAct } from './soul-idle';
import type { Nubbin, SimEvent, World } from './types';

export type { TraitId };

/** The trait its seed gives it at hatch. */
export function seedTrait(n: Pick<Nubbin, 'seed'>): TraitId {
  return TRAIT_IDS[hashSeed(`trait:${n.seed}`) % TRAIT_IDS.length]!;
}

/** Its traits: the seed's, then the earned one (at most two, never the same twice). */
export function traitsOf(n: Pick<Nubbin, 'seed' | 'earnedTrait'>): TraitId[] {
  const first = seedTrait(n);
  return n.earnedTrait && n.earnedTrait !== first ? [first, n.earnedTrait] : [first];
}

export function hasTrait(n: Pick<Nubbin, 'seed' | 'earnedTrait'>, t: TraitId): boolean {
  return seedTrait(n) === t || n.earnedTrait === t;
}

type Mult = { greet: number; play: number; sit: number; swim: number };

/** The traits' idle multipliers laid over the personality's. Eggs have none yet. */
export function withTraitMult(n: Nubbin, m: Mult): Mult {
  if (n.stage === 'egg') return m;
  const out = { ...m };
  for (const t of traitsOf(n)) {
    const tm = TRAITS[t].mult;
    if (!tm) continue;
    for (const k of Object.keys(tm) as (keyof Mult)[]) out[k] *= tm[k] ?? 1;
  }
  return out;
}

/**
 * A 0..1 roll for this Nubbin, this purpose and this whole second. FNV-1a alone barely
 * moves its high bits when only the last digit changes, so neighbouring seconds rolled
 * nearly alike; a murmur finaliser spreads them.
 */
export function roll(n: Pick<Nubbin, 'id'>, what: string, now: number): number {
  let h = hashSeed(`${n.id}:${what}:${Math.floor(now / 1000)}`);
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** When each Nubbin last ate and whether it has groomed since; transient, as looks are. */
const ateAt = new WeakMap<Nubbin, number>();

export function noteAteForTraits(n: Nubbin, now: number): void {
  ateAt.set(n, now);
}

const dist = (a: { x: number; z: number }, b: { x: number; z: number }): number =>
  Math.hypot(a.x - b.x, a.z - b.z);

/**
 * A trait's own quirk for this idle choice, or null. Neat grooms after a meal, sleepyhead
 * yawns, curious goes to look at something new, musical hums as it wanders, copycat does
 * what the nearest Nubbin is doing.
 */
export function traitAct(n: Nubbin, world: World, now: number): IdleAct | null {
  if (n.stage === 'egg' || n.stage === 'cocoon') return null;
  const T = TRAIT_TUNING;
  const lively = liveliness(world);
  for (const t of traitsOf(n)) {
    if (t === 'neat') {
      const at = ateAt.get(n);
      if (at !== undefined && now - at < T.groomAfterMs) {
        ateAt.delete(n);
        return { state: 'sit', ms: T.groomMs, itemId: 'groomSelf' };
      }
      continue;
    }
    // R0544: a tired sleepyhead nods off where it stands (wobbles, then sleeps sitting up).
    if (t === 'sleepyhead' && n.needs.energy < T.nodOffBelow)
      if (roll(n, 'nod-off', now) < T.nodOffChance * lively)
        return { state: 'nap', ms: T.yawnMs * 10, itemId: 'nodOff' };
    if (t === 'nightOwl') {
      // Up at night, so it dozes off by day now and then.
      if ((world.phase ?? 'day') === 'day' && n.needs.energy < 1)
        if (roll(n, 'owl-noon', now) < T.owlNoonNap * lively)
          return { state: 'nap', ms: T.yawnMs * 10, itemId: 'nodOff' };
      continue;
    }
    const chance = TRAITS[t].quirk * lively;
    if (chance <= 0 || roll(n, `quirk-${t}`, now) >= chance) continue;
    if (t === 'sleepyhead') return { state: 'sit', ms: T.yawnMs, itemId: 'yawn' };
    if (t === 'curious') {
      const fresh = world.items
        .filter(
          (i) =>
            i.bornMs !== undefined &&
            now - i.bornMs < T.curiousNewMs &&
            dist(i.pos, n.pos) < T.curiousRadius &&
            dist(i.pos, n.pos) > 1.2,
        )
        .sort((a, b) => (b.bornMs ?? 0) - (a.bornMs ?? 0))[0];
      if (!fresh) continue;
      return {
        state: 'wander',
        ms: T.inspectMs + dist(fresh.pos, n.pos) * 700,
        itemId: 'inspect',
        target: { x: fresh.pos.x + 0.9, z: fresh.pos.z },
      };
    }
    if (t === 'musical') {
      const a = roll(n, 'hum-a', now) * Math.PI * 2;
      const ms = T.humMs[0] + (T.humMs[1] - T.humMs[0]) * roll(n, 'hum-len', now);
      return {
        state: 'wander',
        ms,
        itemId: 'hum',
        target: { x: n.pos.x + Math.cos(a) * 3, z: n.pos.z + Math.sin(a) * 3 },
      };
    }
    if (t === 'copycat') {
      let best: Nubbin | null = null;
      for (const o of world.nubbins) {
        if (o.id === n.id || o.stage === 'egg' || o.stage === 'cocoon') continue;
        const s = o.behavior.state;
        if (s !== 'sit' && s !== 'wander' && s !== 'swim') continue;
        if (dist(o.pos, n.pos) > T.copyRadius) continue;
        if (!best || dist(o.pos, n.pos) < dist(best.pos, n.pos)) best = o;
      }
      if (!best) continue;
      const left = Math.max(1500, best.behavior.untilMs - now);
      const ms = Number.isFinite(left) ? Math.min(left, 8000) : 4000;
      const beside = { x: best.pos.x + 0.9, z: best.pos.z + 0.4 };
      if (best.behavior.state === 'sit')
        return dist(beside, n.pos) < 1.5
          ? { state: 'sit', ms, itemId: `copy:${best.id}` }
          : { state: 'wander', ms: 4000, itemId: `copy:${best.id}`, target: beside };
      if (best.behavior.state === 'swim' && best.behavior.target)
        return {
          state: 'swim',
          ms,
          itemId: `copy:${best.id}`,
          target: { x: best.behavior.target.x + 0.8, z: best.behavior.target.z },
        };
      const to = best.behavior.target ?? best.pos;
      return {
        state: 'wander',
        ms,
        itemId: `copy:${best.id}`,
        target: { x: to.x + 0.8, z: to.z + 0.5 },
      };
    }
  }
  return null;
}

/** Trip and sneeze multipliers for the antics (clumsy, sneezy). */
export function anticScale(n: Nubbin, kind: 'trip' | 'sneeze'): number {
  if (kind === 'trip') return hasTrait(n, 'clumsy') ? TRAIT_TUNING.clumsyTrip : 1;
  return hasTrait(n, 'sneezy') ? TRAIT_TUNING.sneezySneeze : 1;
}

/** Sleepyhead's longer naps. */
export function traitNapScale(n: Nubbin): number {
  return hasTrait(n, 'sleepyhead') ? TRAIT_TUNING.sleepyNap : 1;
}

/** Night owl and early bird scale the time-of-day quirks. */
export function phaseTraitScale(n: Nubbin, phase: 'dawn' | 'dusk' | 'night'): number {
  if (phase === 'night' && hasTrait(n, 'nightOwl')) return TRAIT_TUNING.owlNight;
  if (phase === 'dawn' && hasTrait(n, 'earlyBird')) return TRAIT_TUNING.birdDawn;
  return 1;
}

/** Showoff performs its lessons more while the Keeper is watching. */
export function performScale(n: Nubbin, world: World): number {
  return hasTrait(n, 'showoff') && dist(n.pos, world.keeper.pos) < TRAIT_TUNING.showoffRadius
    ? TRAIT_TUNING.showoffPerform
    : 1;
}

export type TraitCare = keyof typeof TRAIT_TUNING.earn;

/**
 * Care that earns the second trait. Children only, and only until a trait is earned: the
 * first count to reach its mark (and isn't the seed's trait already) becomes the trait.
 */
export function noteTraitCare(n: Nubbin, what: TraitCare, events: SimEvent[]): void {
  if (n.stage !== 'child' || n.earnedTrait) return;
  if (seedTrait(n) === what) return;
  const care = { ...(n.traitCare ?? {}) };
  care[what] = (care[what] ?? 0) + 1;
  n.traitCare = care;
  if (care[what]! >= TRAIT_TUNING.earn[what]) {
    n.earnedTrait = what;
    delete n.traitCare;
    events.push({ kind: 'traitEarned', nubbinId: n.id, trait: what });
  }
}
