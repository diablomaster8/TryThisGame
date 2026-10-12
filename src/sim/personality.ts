import { PERSONALITY } from '../config/tuning';
import type { Nubbin, Personality } from './types';

/**
 * Personality is decided by how the Nubbin was treated as a child and locked in at
 * evolution. It changes idle behavior only, never stats.
 */
export function decidePersonality(care: Nubbin['childCare']): Personality {
  const total = care.pets + care.throws + care.feeds;
  if (care.throws >= PERSONALITY.mischievousThrows && care.throws > care.pets) return 'mischievous';
  if (care.pets >= PERSONALITY.cheerfulPets) return 'cheerful';
  if (total < PERSONALITY.shyTotal) return 'shy';
  if (care.feeds >= PERSONALITY.lazyFeeds && care.feeds >= care.pets) return 'lazy';
  return 'cheerful';
}

export function idleMultipliers(p: Personality | null): {
  greet: number;
  play: number;
  sit: number;
  swim: number;
} {
  return p ? PERSONALITY.multipliers[p] : { greet: 1, play: 1, sit: 1, swim: 1 };
}

export function noteCare(n: Nubbin, what: 'pets' | 'throws' | 'feeds'): void {
  if (n.stage !== 'child') return;
  n.childCare[what] += 1;
}
