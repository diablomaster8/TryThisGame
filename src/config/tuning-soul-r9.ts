/**
 * Lane A round 9 (SOUL): traits (R0528), the glutton's snacks and full belly (R0546), the shy
 * peek behind a tree (R0543) and noticing the Keeper (R0533). Behaviour and looks only,
 * never stats.
 */

export type TraitId =
  | 'clumsy'
  | 'glutton'
  | 'sleepyhead'
  | 'curious'
  | 'brave'
  | 'fussy'
  | 'musical'
  | 'showoff'
  | 'neat'
  | 'nightOwl'
  | 'earlyBird'
  | 'copycat'
  | 'ticklish'
  | 'sneezy';

export const TRAIT_IDS: readonly TraitId[] = [
  'clumsy',
  'glutton',
  'sleepyhead',
  'curious',
  'brave',
  'fussy',
  'musical',
  'showoff',
  'neat',
  'nightOwl',
  'earlyBird',
  'copycat',
  'ticklish',
  'sneezy',
];

/**
 * R0528 (SOUL-10): each trait's idle multipliers (on top of the personality's) and the
 * chance per idle choice of its own quirk act. Unlisted multipliers are 1.
 */
export const TRAITS: Record<
  TraitId,
  { mult?: Partial<Record<'greet' | 'play' | 'sit' | 'swim', number>>; quirk: number }
> = {
  clumsy: { quirk: 0 },
  glutton: { mult: { play: 0.9 }, quirk: 0 },
  sleepyhead: { mult: { sit: 1.4, play: 0.8 }, quirk: 0.06 },
  curious: { mult: { sit: 0.7 }, quirk: 0.12 },
  brave: { mult: { greet: 1.2, swim: 1.3 }, quirk: 0 },
  fussy: { mult: { sit: 1.1 }, quirk: 0 },
  musical: { mult: { play: 1.1 }, quirk: 0.08 },
  showoff: { mult: { greet: 1.3 }, quirk: 0 },
  neat: { mult: { swim: 0.8 }, quirk: 0 },
  nightOwl: { quirk: 0 },
  earlyBird: { quirk: 0 },
  copycat: { quirk: 0.1 },
  ticklish: { mult: { play: 1.15 }, quirk: 0 },
  sneezy: { quirk: 0 },
};

export const TRAIT_TUNING = {
  /** At most this many traits: one from the seed at hatch, one earned before evolution. */
  max: 2,
  /** Clumsy trips and sneezy sneezes this many times as often. */
  clumsyTrip: 3,
  sneezySneeze: 3,
  /** Sleepyhead naps this much longer, and yawns (its quirk). */
  sleepyNap: 1.5,
  yawnMs: 1800,
  /** Curious: goes to look at anything new in the Grove within this radius and age. */
  curiousRadius: 10,
  curiousNewMs: 10 * 60_000,
  inspectMs: 3500,
  /** Musical: hums as it wanders (♪ over its head). */
  humMs: [4000, 7000] as [number, number],
  /** Showoff: lessons performed this many times as often while the Keeper is near. */
  showoffPerform: 3,
  showoffRadius: 6,
  /** Neat: grooms itself after eating (once per meal, if it ate this recently). */
  groomAfterMs: 15_000,
  groomMs: 2000,
  /** Night owl: stargazes ×3 at night and skips the curfew nap; naps at noon. */
  owlNight: 3,
  owlNoonNap: 0.08,
  /** Early bird: the dawn stretch ×3. */
  birdDawn: 3,
  /** Copycat: copies a Nubbin within this radius. */
  copyRadius: 6,
  /** Ticklish: a tickle sets off a giggle fit (a roll on the ground). */
  giggleMs: 3000,
  giggleHappiness: 2,
  /** What earns the second trait (children only, before evolution). */
  earn: {
    brave: 5, // rain games played outside
    ticklish: 10, // tickles
    glutton: 6, // fruit eaten while not hungry
    musical: 3, // radio plays finished
    neat: 6, // grooms by the Keeper
  },
} as const;

/** R0546 (SOUL-28): snacking when not hungry, and the full belly. */
export const GLUTTON = {
  /** A glutton goes for fruit within this radius below this fullness (lazy at half the odds). */
  radius: 6,
  below: 0.9,
  /** Per sim second, once it has seen the fruit. */
  perSecond: 0.08,
  lazyScale: 0.5,
  /** Three fruits inside five minutes: a full belly for a while, a waddle, a burp, a nap. */
  fullAfter: 3,
  fullWithinMs: 5 * 60_000,
  fullMs: 3 * 60_000,
  burpMs: 1400,
  /** A fussy Nubbin leaves fruit that isn't its favourite until it is this hungry. */
  fussyBelow: 0.4,
} as const;

/** R0543 (SOUL-25): a shy Nubbin hides behind a tree and peeks; tapping the tree finds it. */
export const PEEK = {
  /** The Keeper coming this close sets it off (once per approach). */
  keeperRadius: 4,
  /** Only trees this near the Nubbin. */
  treeRadius: 6,
  /** Chance per approach (adults; a shy-leaning child at half). */
  chance: 0.7,
  /** Hide, then peek, for this long in all. */
  hideMs: [3000, 6000] as [number, number],
  stayMs: 14_000,
  /** How far behind the trunk, away from the Keeper. */
  behind: 0.6,
  /** Found: affection and trust, and the game can't start again for this long. */
  foundAffection: 2,
  foundTrust: 1,
  cooldownMs: 60_000,
  /** A tap on the tree counts within this distance of the trunk. */
  tapRadius: 2.2,
} as const;

/** R0533 (SOUL-15): a busy Nubbin turning to look at a passing Keeper. */
export const NOTICE = {
  radius: 3,
  /** A wave (or a look) only on the first approach after this long apart. */
  apartMs: 30_000,
  /** How long the acknowledgement plays. */
  waveMs: 600,
  lookMs: 1400,
} as const;
