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

/**
 * R0527 (SOUL-09), the r10 half: in the Learning Grove, a Nubbin left at the trust floor as
 * long as one elsewhere would run away hides in the cottage instead, at the window.
 */
export const COTTAGE_HIDE = {
  /** Trust within this of the Learning Grove's floor counts as "at the floor". */
  margin: 2,
  /** Where it waits, peeking out: in front of the cottage's window (pushed clear). */
  window: { x: -5.6, z: 16.4 },
  /** Each spell at the window before it looks again (it still goes to eat). */
  waitMs: 60_000,
  /** Coaxed out: trust and happiness, and a hug this long. */
  coaxTrust: 10,
  coaxHappiness: 5,
  hugMs: 2_500,
  /** Trust back up this far above the floor (pets through the window): out on its own. */
  outAbove: 15,
} as const;

/**
 * R0553 (SOUL-36), the r10 half: each personality's own idle quirk, so the four spend their
 * day measurably differently (the cheerful twirl, the mischievous sneak, the shy hide, the
 * lazy doze). Chance per plain sit or wander pick for an adult; a leaning child at half.
 */
export const QUIRKS = {
  chance: { cheerful: 0.6, mischievous: 0.7, shy: 0.4, lazy: 0.4 },
  childStrength: 0.5,
  /** Cheerful: a happy twirl on the spot. */
  twirlMs: [2_500, 4_000] as const,
  /** Mischievous: tiptoes up behind another Nubbin or the Keeper, then a cheeky grin. */
  sneakRadius: 10,
  sneakBehind: 1.2,
  sneakMs: 3_000,
  /** Shy: hides its face when the Keeper is this near; else watches from afar. */
  hideRadius: 4,
  hideMs: [4_000, 7_000] as const,
  watchMs: [5_000, 9_000] as const,
  /** Lazy: lies down for a doze, eyes shut. */
  dozeMs: [8_000, 14_000] as const,
} as const;

/** R0541 (SOUL-23): how long a Nubbin remembers how it was treated, and what it does. */
export const CARE_MEMORY = {
  /** At most this many memories, newest last; each fades after `fadeMs`. */
  keep: 8,
  fadeMs: 10 * 60_000,
  /** The Keeper coming this close is "walking up". */
  approachRadius: 3.5,
  /** A throw or a drop this recent: a flinch (a quick crouch); a shy one backs off a step. */
  flinchWithinMs: 3 * 60_000,
  flinchMs: 600,
  backOff: 1,
  /** This many pets or hugs this recently: it runs up and asks for more, arms up. */
  askPets: 3,
  askWithinMs: 5 * 60_000,
  askMs: 3_000,
  /** Fed by hand this recently, and the Keeper has fruit: it trails after the Keeper. */
  followWithinMs: 5 * 60_000,
  followRadius: 8,
  followChance: 0.6,
  followMs: 3_000,
  followGap: 1.4,
} as const;
