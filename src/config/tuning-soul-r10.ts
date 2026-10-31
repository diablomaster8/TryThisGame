/**
 * Lane A round 10 (SOUL): friendships that depend on personality fit and rivalries
 * (R0538, R0545's leftover). Behaviour only, never stats.
 */
import type { Personality } from '../sim/types';

/**
 * R0538 (SOUL-20): how well two personalities get on. Friendship near each other grows at
 * `FRIENDS.perMinute` times this; a poor fit (under `RIVALS.frictionBelow`) rubs a little
 * rivalry on top. Symmetric; a child with no leaning yet counts as 1.
 */
export const FRIEND_COMPAT: Record<Personality, Record<Personality, number>> = {
  cheerful: { cheerful: 1.0, shy: 1.6, mischievous: 1.3, lazy: 0.7 },
  shy: { cheerful: 1.6, shy: 0.8, mischievous: 0.5, lazy: 1.3 },
  mischievous: { cheerful: 1.3, shy: 0.5, mischievous: 1.1, lazy: 0.5 },
  lazy: { cheerful: 0.7, shy: 1.3, mischievous: 0.5, lazy: 1.4 },
};

export const RIVALS = {
  /** A top rival this high is "the rival" (as `FRIENDS.buddyAt` is for the best friend). */
  at: 30,
  /** Contests: the loser of a race to the same fruit; the victim of a snatch (R0545). */
  fruitContest: 5,
  snatch: 15,
  /** Two show-offs performing a lesson within this long and this near: both +3. */
  showOff: 3,
  showOffMs: 10_000,
  showOffRadius: 8,
  /** A poor fit near each other rubs rivalry at perMinute × (1 − fit) × this. */
  frictionBelow: 0.6,
  friction: 3,
  /** Rivals this near, both idling: a puff at each other now and then. */
  puffRadius: 3,
  puffChancePerSecond: 0.05,
  puffMs: 2_000,
  /** No second puff for this long per Nubbin. */
  puffRestMs: 45_000,
  /** Two rivals both after fruit within this distance race for it. */
  raceRadius: 5,
  raceSpeed: 1.25,
  /** Minutes near each other that make up a rivalry: rival −10, friend +10, a hug. */
  makeUpMinutes: 20,
  makeUpRival: 10,
  makeUpFriend: 10,
  hugMs: 2_500,
  /** A good fit (this or more) within `kindredRadius` is sought out now and then. */
  kindredFit: 1.2,
  kindredRadius: 12,
  kindredChance: 0.12,
  /** R0545: after its fruit was snatched, its next fruit search is this much quicker. */
  victimSearch: 1.2,
} as const;

/** R0541 (SOUL-23): what the Keeper did that a Nubbin remembers for a while. */
export type CareKind = 'pet' | 'hug' | 'feed' | 'throw' | 'drop' | 'ignore';

/** R0542 (SOUL-24), the r10 half: a Sun Nubbin tidies a stray toy back to the toy corner. */
export const TIDY = {
  /** The toy corner, by the cottage's door (pushed clear of any solid when used). */
  spot: { x: -3.5, z: 17.5 },
  /** A toy this far from the corner counts as stray; one within `nearSpot` is tidied. */
  strayFrom: 6,
  nearSpot: 1.5,
  /** Only toys within this of the Nubbin. */
  fetchRadius: 8,
  /** Per idle choice, at full strength (a hinting child half, its own Grove ×1.5). */
  chance: 0.15,
  /** Each leg (to the toy, then pushing it home) may take this long before it gives up. */
  legMs: 12_000,
  /** The push is slower than a walk, and the toy rolls this far in front of it. */
  pushSpeed: 0.7,
  ahead: 0.45,
  /** Pleased with itself after: happiness. */
  happiness: 2,
} as const;
