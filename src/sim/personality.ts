import { NEEDS, PERSONALITY, PERSONALITY_LEAN } from '../config/tuning';
import type { Interaction, Nubbin, Personality, PersonalityCause } from './types';

/**
 * Personality is decided by how the Nubbin was treated as a child and locked in at
 * evolution. It changes idle behavior only, never stats.
 */
export function decidePersonality(care: Nubbin['childCare']): Personality {
  // R0530: every kind touch counts with the pets, and a tuck-in with the meals.
  const kind = care.pets + (care.touches ?? 0);
  const rest = care.feeds + (care.tucks ?? 0);
  const total = kind + care.throws + rest;
  if (care.throws >= PERSONALITY.mischievousThrows && care.throws > kind) return 'mischievous';
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
  const total = c.pets + c.throws + c.feeds + (c.touches ?? 0) + (c.tucks ?? 0);
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
 * R0530 (SOUL-12): a gentle interaction counts toward the child's personality too: a tuck-in
 * with the meals (lazy), the rest with the pets (cheerful). At most one per pet cooldown, so
 * a flurry of taps is one act of care.
 */
export function noteTouch(n: Nubbin, action: Interaction, now: number): void {
  if (n.stage !== 'child') return;
  const c = n.childCare;
  if (c.lastCareMs !== undefined && now - c.lastCareMs < NEEDS.petCooldownMs) return;
  c.lastCareMs = now;
  if (action === 'tuckIn') c.tucks = (c.tucks ?? 0) + 1;
  else c.touches = (c.touches ?? 0) + 1;
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
  }
}

/**
 * R0578 (SOUL-61): how far a child leans each way, as shares that add to 1, for the sheet's
 * forming meter: kind touches toward cheerful, throws toward mischievous, meals and tuck-ins
 * toward lazy, and time left alone toward shy. All zero before any care or time.
 */
export function leanShares(n: Nubbin): Record<Personality, number> {
  const c = n.childCare;
  const raw: Record<Personality, number> = {
    cheerful: c.pets + (c.touches ?? 0),
    mischievous: c.throws,
    lazy: c.feeds + (c.tucks ?? 0),
    // Being left alone counts too: one act's worth for every few quiet minutes.
    shy: Math.max(0, n.stageMs / PERSONALITY_LEAN.shyAfterMs) * PERSONALITY.shyTotal * 0.5,
  };
  const total = raw.cheerful + raw.mischievous + raw.lazy + raw.shy;
  if (total <= 0) return { cheerful: 0, mischievous: 0, lazy: 0, shy: 0 };
  return {
    cheerful: raw.cheerful / total,
    mischievous: raw.mischievous / total,
    lazy: raw.lazy / total,
    shy: raw.shy / total,
  };
}
