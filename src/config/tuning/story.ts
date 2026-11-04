/**
 * Tuning: the story domain (TECH-36). Moved out of config/tuning.ts, which still re-exports it.
 * Numbers are unchanged; the review-pass letters in the comments are their provenance.
 */
import type { StoryPropDef } from '../../sim/story-props';

/**
 * The campaign's story clock (sim/campaign.ts, sim/side-stories.ts). The sim has no
 * time of day of its own, so a story day is a fixed span of sim time: dawn at its start,
 * dusk at `duskAt` of the way through. "The next dusk" is the next such point.
 */
export const STORY = {
  dayMs: 120_000,
  duskAt: 0.75,
  /** Story-day fractions: when morning ends, and the two night marks the waits use. */
  morningEndsAt: 0.5,
  midnightAt: 0.9,
  lateNightAt: 0.95,
  /** A "sit with them a while" step takes this long on the story clock. */
  shortWaitMs: 20_000,
  /** The nights between chapter 9's close and the Long Night (S23's three visitors). */
  nightsBeforeLongNight: 3,
  /** Story days in "a week later": a story day is two minutes, so a week is three. */
  weekDays: 3,
  /** How near a lantern post counts as having walked Moss to it. */
  lanternReach: 2.5,
  /** Chapter 10's vigil: total lit time to reach dawn, and the waves of cold. */
  vigilMs: 90_000,
  /** Fractions of the vigil at which a wave blows a lantern out (stream, then long grass). */
  vigilWaves: [0.3, 0.65],
  vigilLullAt: 0.5,
  /** Which lantern post each wave blows out (assumed mapping; the scene only names them). */
  vigilWaveLanterns: ['lantern-2', 'lantern-4'],
  /** Where Wisp settles as a stray: under the cottage step (canon 16). */
  wispHome: { x: -7, z: 10.4 },
  /** Ember's friendship for finding Ash's name (S6). */
  s6Friendship: 5,
  /** Shells Corvin asks in S27's buy-back, the same as c9-open's bargain. */
  buyBackShells: 200,
  /**
   * Pacing (review 2026-10-24, item 4). After any scene ends, the next unrelated one (a
   * chapter's opening or closing, another story's step, a fun-quest offer) waits this long
   * on the sim clock, so it scales with the time-scale. A scene's own follow-ups and the
   * same story's next beat are not held.
   */
  breatherMs: 60_000,
  /** Between two different side stories' or fun quests' scenes: a shorter gap. */
  sideGapMs: 20_000,
  /**
   * A chapter lasts at least this long from its opening before the next chapter begins.
   * The closing itself is not held by it: it answers the player's action (closingSettleMs).
   */
  goalMinMs: 90_000,
  /** After the goal is met, the closing waits only this long past the last scene. */
  closingSettleMs: 4_000,
  /** Goals met by a choice inside the opening scene: no minimum before the next chapter. */
  goalsInOpening: ['corvinChoice', 'finalChoice'] as readonly string[],
  /** Chapter scenes whose first line names a time of day wait for that part of the day. */
  sceneTime: {
    'c2-open': 'morning',
    'c2-corvin': 'afternoon',
    'c3-open': 'night',
    'c4-close': 'night',
    'c7-open': 'night',
    'c8-open': 'morning',
    'c12-open': 'morning',
  } as Readonly<Record<string, 'morning' | 'afternoon' | 'night'>>,
  /** The Grove's season in Hazel's Grove, chapter by chapter (index 0 is chapter 1). */
  chapterSeasons: [
    'spring',
    'spring',
    'summer',
    'summer',
    'summer',
    'summer',
    'summer',
    'autumn',
    'winter',
    'winter',
    'winter',
    'winter',
  ] as const,
  /** After the ending: the post-game spring (S27's egg sac, E1–E3). */
  postGameSeason: 'spring' as const,
  /**
   * Scene guests (campaign.ts): speakers never given a body beside the Keeper, because they
   * are a crowd, a voice, a memory or a feeling rather than someone at the gate.
   */
  guestSkip: [
    'you',
    'narrator',
    'chorus',
    'hazel',
    'kids',
    'worry',
    's29-children',
  ] as readonly string[],
  /** How far from the Keeper scene guests stand, and how far apart. */
  guestReach: 2.2,
  guestSpread: 0.9,
  /** At most this many guests stand in for one scene. */
  guestMax: 4,
} as const;

/** Fun quests Q1-Q65 (sim/fun-quests.ts): how they offer themselves. */
export const FUN = {
  /** One at a time, and never in a chapter's first story day (the campaign speaks first). */
  maxOpen: 1,
  offerAfterMs: 120_000,
  /** After a fun quest opens, the next one is not offered for this long (no stacking). */
  offerGapMs: 240_000,
  /** Market days, as JavaScript weekdays (Wednesday and Saturday). */
  marketDays: [3, 6],
  /** "Midday" is this much of a story day either side of noon. */
  middayHalfWidth: 0.08,
  /** A Nubbin counts as tired below this energy. */
  tiredBelow: 0.3,
  /** "Some Swim" or "a Fly-leaning Nubbin": a stat at this level or more. */
  someStatLevel: 5,
} as const;

/** The four lantern posts, lantern-1..4: pond, stream, wall and long grass. */
export const LANTERN_POSTS = [
  { id: 'lantern-1', x: -4, z: 4 },
  { id: 'lantern-2', x: 4, z: -3 },
  { id: 'lantern-3', x: 9, z: 7 },
  { id: 'lantern-4', x: -8, z: -6 },
] as const;

/**
 * The things the side stories point at (sim/story-props.ts says when each stands):
 * where it stands, how it is drawn, and which step checks a tap on it meets.
 */
export const STORY_PROPS: readonly StoryPropDef[] = [
  { id: 'old-trowel', kind: 'trowel', x: -6.2, z: 10.6, meets: ['old-trowel'] },
  { id: 'hatch-register', kind: 'register', x: -7.9, z: 10.7, meets: ['hatch-register'] },
  { id: 'hazels-lantern', kind: 'handLantern', x: -5.4, z: 11.2, meets: ['s24-hazels-lantern'] },
  { id: 'sunrise-shelf', kind: 'shelf', x: -8.6, z: 11.4, meets: ['sunrise-shelf'] },
  { id: 'flat-stone', kind: 'flatStone', x: -14.8, z: 13.6, meets: ['s24-hill'] },
  { id: 'hazels-bench', kind: 'oldBench', x: -2.4, z: 5.6, meets: ['hazel-bench'] },
  { id: 'corvins-chair', kind: 'chair', x: -1, z: 6.3, meets: [] },
  { id: 'lantern-shed', kind: 'shed', x: 6.4, z: -1.2, meets: ['s27-shed-window', 's7-minder'] },
  { id: 'old-barn', kind: 'barn', x: 15, z: 12, meets: ['s18-centre-case'] },
  {
    id: 'walled-garden-door',
    kind: 'gardenDoor',
    x: 10.6,
    z: 5.4,
    meets: ['s26-door', 's26-garden'],
  },
  { id: 'hush-bench', kind: 'oldBench', x: 12.2, z: 4.4, meets: ['s26-hush-bench', 'hush-bench'] },
];

/** The separate campaigns (sim/storyline.ts, sim/storyline-rules.ts). */
export const STORYLINES = {
  /** S1: the partner's adult span, as a multiple of the usual one (24 h × 15 = 15 days). */
  hundredSpanScale: 15,
  /** S2: foes per bout and their levels by tier. */
} as const;
