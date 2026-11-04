import { NEEDS, PERSONALITY, PERSONALITY_LEAN } from '../config/tuning';
import { PERSONALITIES } from './types';
import type { Interaction, Nubbin, Personality, PersonalityCause } from './types';

/**
 * Personality is decided by how the Nubbin was treated as a child and locked in at
 * evolution. It changes idle behavior only, never stats.
 *
 * R0529 (SOUL-11): eight of them. `PERSONALITIES` (from types.ts, re-exported here) is the one
 * list; `basePersonality` maps the second four onto the first four for code that only knows
 * those (a voice, a gag, a battle line).
 */
export { PERSONALITIES };

/** The original four, for tables that have not grown a row per personality. */
export type BasePersonality = 'cheerful' | 'shy' | 'mischievous' | 'lazy';

/**
 * Curious roams like mischievous, gentle and bold are as warm and outgoing as cheerful, and
 * dreamy is as slow as lazy.
 */
const BASE: Record<Personality, BasePersonality> = {
  cheerful: 'cheerful',
  shy: 'shy',
  mischievous: 'mischievous',
  lazy: 'lazy',
  curious: 'mischievous',
  gentle: 'cheerful',
  bold: 'cheerful',
  dreamy: 'lazy',
};

export function basePersonality(p: Personality): BasePersonality {
  return BASE[p];
}

export function isPersonality(v: unknown): v is Personality {
  return typeof v === 'string' && (PERSONALITIES as readonly string[]).includes(v);
}

/** R0529: the second four's care counts; dreamy in acts (sit time near an idle Keeper). */
export function secondCare(care: Nubbin['childCare']): {
  curious: number;
  gentle: number;
  bold: number;
  dreamy: number;
} {
  return {
    curious: care.curious ?? 0,
    gentle: care.gentle ?? 0,
    bold: care.bold ?? 0,
    dreamy: Math.floor((care.dreamMs ?? 0) / PERSONALITY.dreamyActMs),
  };
}

const SECOND_MIN = {
  bold: PERSONALITY.boldActs,
  gentle: PERSONALITY.gentleActs,
  curious: PERSONALITY.curiousActs,
  dreamy: PERSONALITY.dreamyActs,
} as const;

export function decidePersonality(care: Nubbin['childCare']): Personality {
  // R0530: every kind touch counts with the pets, and a tuck-in with the meals.
  const kind = care.pets + (care.touches ?? 0);
  const rest = care.feeds + (care.tucks ?? 0);
  const total = kind + care.throws + rest;
  if (care.throws >= PERSONALITY.mischievousThrows && care.throws > kind) return 'mischievous';
  // R0529: one of the second four, when its own care reaches its count, is at least the plain
  // pets (a hug or a high five also counts as a touch, so plain pets are the fair rival) and
  // beats the throws. The most of them wins; ties go bold, gentle, curious, dreamy.
  const second = secondCare(care);
  let best: keyof typeof SECOND_MIN | null = null;
  for (const p of ['bold', 'gentle', 'curious', 'dreamy'] as const) {
    const v = second[p];
    if (v < SECOND_MIN[p] || v < care.pets || v <= care.throws) continue;
    // Hugs alone still grow a cheerful one and tuck-ins alone a lazy one (R0530): gentle
    // needs kind words in the mix.
    if (p === 'gentle' && (care.praises ?? 0) < PERSONALITY.gentlePraises) continue;
    if (!best || v > second[best]) best = p;
  }
  if (best) return best;
  if (kind >= PERSONALITY.cheerfulPets) return 'cheerful';
  if (total < PERSONALITY.shyTotal) return 'shy';
  if (rest >= PERSONALITY.lazyFeeds && rest >= kind) return 'lazy';
  return 'cheerful';
}

/**
 * R0523 (SOUL-03): the personality a child is leaning toward, by the same rule that locks it
 * at evolution (`decidePersonality` on its care so far), so the leaning a player watches is
 * the one that locks. Null while there is too little to go on: under `minCare` acts of care
 * and younger than `shyAfterMs` (a child that is left alone does lean shy, but not at once).
 * An adult's is its personality.
 */
export function leaningPersonality(n: Nubbin): Personality | null {
  if (n.personality) return n.personality;
  if (n.stage !== 'child') return null;
  const c = n.childCare;
  const s = secondCare(c);
  const total =
    c.pets + c.throws + c.feeds + (c.touches ?? 0) + (c.tucks ?? 0) + s.curious + s.bold + s.dreamy;
  if (total < PERSONALITY_LEAN.minCare && n.stageMs < PERSONALITY_LEAN.shyAfterMs) return null;
  return decidePersonality(c);
}

/**
 * Idle multipliers by personality. `strength` scales them toward 1: a child's leaning
 * counts at `PERSONALITY_LEAN.childStrength` (R0523).
 */
export function idleMultipliers(
  p: Personality | null,
  strength = 1,
): {
  greet: number;
  play: number;
  sit: number;
  swim: number;
} {
  if (!p) return { greet: 1, play: 1, sit: 1, swim: 1 };
  const m = PERSONALITY.multipliers[p];
  if (strength === 1) return m;
  const s = (v: number): number => 1 + (v - 1) * strength;
  return { greet: s(m.greet), play: s(m.play), sit: s(m.sit), swim: s(m.swim) };
}

export function noteCare(n: Nubbin, what: 'pets' | 'throws' | 'feeds'): void {
  if (n.stage !== 'child') return;
  n.childCare[what] += 1;
}

/**
 * R0529: one act of the second four's care for a child: `curious` (a critter given, a new
 * thing inspected), `gentle`, `bold` (a game of catch, an expedition). Touches count through
 * `noteTouch`.
 */
export function noteSecondCare(n: Nubbin, what: 'curious' | 'gentle' | 'bold'): void {
  if (n.stage !== 'child') return;
  n.childCare[what] = (n.childCare[what] ?? 0) + 1;
}

/** R0529: a child sitting near an idle Keeper is turning dreamy, by the sim ms. */
export function noteDream(n: Nubbin, dtMs: number): void {
  if (n.stage !== 'child') return;
  n.childCare.dreamMs = (n.childCare.dreamMs ?? 0) + dtMs;
}

/**
 * R0530 (SOUL-12): a gentle interaction counts toward the child's personality too: a tuck-in
 * with the meals (lazy), the rest with the pets (cheerful). At most one per pet cooldown, so
 * a flurry of taps is one act of care. R0529: hugs, tuck-ins and praise count gentle as well,
 * and a high five bold.
 */
export function noteTouch(n: Nubbin, action: Interaction, now: number): void {
  if (n.stage !== 'child') return;
  const c = n.childCare;
  if (c.lastCareMs !== undefined && now - c.lastCareMs < NEEDS.petCooldownMs) return;
  c.lastCareMs = now;
  if (action === 'tuckIn') c.tucks = (c.tucks ?? 0) + 1;
  else c.touches = (c.touches ?? 0) + 1;
  if (action === 'hug' || action === 'tuckIn' || action === 'praise')
    c.gentle = (c.gentle ?? 0) + 1;
  if (action === 'praise') c.praises = (c.praises ?? 0) + 1;
  else if (action === 'highFive') c.bold = (c.bold ?? 0) + 1;
}

/** R0531 (SOUL-13): which care most shaped this personality, by the rule that decided it. */
export function personalityCause(care: Nubbin['childCare'], p: Personality): PersonalityCause {
  const touches = care.touches ?? 0;
  const tucks = care.tucks ?? 0;
  switch (p) {
    case 'mischievous':
      return 'throws';
    case 'shy':
      return 'quiet';
    case 'lazy':
      return care.feeds >= tucks ? 'feeds' : 'tucks';
    case 'cheerful':
      if (care.pets + touches < PERSONALITY.cheerfulPets) return 'mixed';
      return care.pets >= touches ? 'pets' : 'touches';
    case 'curious':
      return 'critters';
    case 'gentle':
      return 'gentleCare';
    case 'bold':
      return 'play';
    case 'dreamy':
      return 'company';
  }
}

/**
 * R0578 (SOUL-61): how far a child leans each way, as shares that add to 1, for the sheet's
 * forming meter: kind touches toward cheerful, throws toward mischievous, meals and tuck-ins
 * toward lazy, and time left alone toward shy; R0529's second four by their own care. All
 * zero before any care or time.
 */
export function leanShares(n: Nubbin): Record<Personality, number> {
  const c = n.childCare;
  const s = secondCare(c);
  const raw: Record<Personality, number> = {
    cheerful: c.pets + (c.touches ?? 0),
    mischievous: c.throws,
    lazy: c.feeds + (c.tucks ?? 0),
    // Being left alone counts too: one act's worth for every few quiet minutes.
    shy: Math.max(0, n.stageMs / PERSONALITY_LEAN.shyAfterMs) * PERSONALITY.shyTotal * 0.5,
    curious: s.curious,
    gentle: s.gentle,
    bold: s.bold,
    dreamy: s.dreamy,
  };
  let total = 0;
  for (const p of PERSONALITIES) total += raw[p];
  const out = {} as Record<Personality, number>;
  for (const p of PERSONALITIES) out[p] = total > 0 ? raw[p] / total : 0;
  return out;
}

/**
 * R0573 (SOUL-56): a reborn child's care starts with an echo of its last life: a fifth of
 * the care that would make the old personality (at least a few acts, so the forming meter
 * shows it), and nothing for a shy one, whose care is being left be. It still locks by the
 * care of this life at evolution.
 */
export function echoCare(p: Personality | null): Nubbin['childCare'] {
  const care: Nubbin['childCare'] = { pets: 0, throws: 0, feeds: 0 };
  if (!p) return care;
  const fifth = (v: number): number => Math.max(PERSONALITY.shyTotal, Math.ceil(v * 0.2));
  switch (p) {
    case 'cheerful':
      care.pets = fifth(PERSONALITY.cheerfulPets);
      break;
    case 'mischievous':
      care.throws = fifth(PERSONALITY.mischievousThrows);
      break;
    case 'lazy':
      care.feeds = fifth(PERSONALITY.lazyFeeds);
      break;
    case 'curious':
      care.curious = fifth(PERSONALITY.curiousActs);
      break;
    case 'gentle':
      care.gentle = fifth(PERSONALITY.gentleActs);
      care.praises = PERSONALITY.gentlePraises;
      break;
    case 'bold':
      care.bold = fifth(PERSONALITY.boldActs);
      break;
    case 'dreamy':
      care.dreamMs = fifth(PERSONALITY.dreamyActs) * PERSONALITY.dreamyActMs;
      break;
    case 'shy':
      break;
  }
  return care;
}
