// was tuning-soul-r11; review pass R11
/**
 * Lane A round 11 (SOUL): the second four personalities' quirks (R0529) and the soul items
 * built on them. Behaviour and looks only, never stats.
 */

/**
 * R0529 (SOUL-11): each of the second four has three signature quirks, the first the most
 * likely (its "top" quirk). `pick` is the chance of the first, then the second; the third
 * takes the rest. A quirk that needs something nearby (a sad friend, a fruit) passes to the
 * next one when there is none.
 */
export const QUIRKS_R11 = {
  pick: [0.55, 0.3] as const,
  /** Curious: roams far to something new, peers at it, pokes the nearest item. */
  roamRange: [6, 10] as const,
  roamMs: [5_000, 8_000] as const,
  peerMs: [3_000, 5_000] as const,
  pokeRadius: 8,
  pokeMs: 2_500,
  /** Gentle: pats a sad or hungry friend this near, offers a fruit, tends a tree. */
  patRadius: 8,
  patMs: 2_500,
  /** A pat gives the patted one this much happiness. */
  patHappiness: 2,
  offerMs: 3_000,
  tendMs: [3_000, 5_000] as const,
  /** Bold: leads a march, with friends this near falling in behind; splashes; flexes. */
  leadRange: 6,
  leadMs: [4_000, 6_000] as const,
  leadFollowRadius: 6,
  splashMs: [3_000, 5_000] as const,
  flexMs: 2_000,
  /** Dreamy: gazes at the clouds (or stars), drifts after a butterfly, daydreams. */
  gazeMs: [6_000, 10_000] as const,
  butterflyMs: [5_000, 8_000] as const,
  butterflyRange: 3,
  daydreamMs: [5_000, 8_000] as const,
} as const;

/**
 * R0558 (SOUL-41), the cry half, and R0581 (SOUL-64): crying by personality, the brief cries
 * besides hunger, and friends coming over to comfort.
 */
export const CRY_SOUL = {
  /** A bold one's cry is short (then a stomp); a gentle one walks to the Keeper to cry. */
  boldScale: 0.5,
  gentleScale: 1.4,
  gentleSpeed: 0.6,
  /** How near the Keeper a gentle one stops to cry. */
  keeperGap: 1.3,
  /** A brief cry (a taunt, a snatch, a throw streak). */
  briefMs: 2_500,
  /** A rival's puff makes the softer ones cry briefly (shy, gentle, dreamy) at this chance. */
  tauntChance: 0.6,
  /** This many throws within this long, and the next landing ends in tears. */
  throwStreak: 3,
  throwWindowMs: 2 * 60_000,
  /** A friend this near and this fond comes over: chance per second, gentle ×3, Sun ×2. */
  comfortRadius: 6,
  friendAt: 10,
  comfortPerSecond: 0.5,
  gentleBoost: 3,
  sunBoost: 2,
  comfortMs: 2_000,
} as const;

/**
 * R0570 (SOUL-53): a gait per personality. `speed` scales the wander walk (sim); `cadence`
 * the Pixel walk cycle; `bob` the bounce of each step and `waddle` the 3D side-to-side roll;
 * `meander` a sideways sine on the path (units per second at the peak), dreamy only.
 * cheerful skips, shy takes small steps, mischievous tiptoes and darts, lazy shuffles, bold
 * marches, dreamy meanders.
 */
export const GAIT = {
  cheerful: { speed: 1.15, cadence: 1.25, bob: 1.8, waddle: 1.3, meander: 0 },
  shy: { speed: 0.85, cadence: 1.15, bob: 0.5, waddle: 0.7, meander: 0 },
  mischievous: { speed: 1.1, cadence: 1.4, bob: 0.4, waddle: 1.15, meander: 0 },
  lazy: { speed: 0.7, cadence: 0.6, bob: 0.3, waddle: 1.45, meander: 0 },
  curious: { speed: 1.05, cadence: 1.1, bob: 1, waddle: 1, meander: 0 },
  gentle: { speed: 0.95, cadence: 0.95, bob: 0.8, waddle: 0.9, meander: 0 },
  bold: { speed: 1.1, cadence: 0.9, bob: 1.4, waddle: 0.6, meander: 0 },
  dreamy: { speed: 0.8, cadence: 0.8, bob: 0.7, waddle: 1.1, meander: 0.45 },
  /** Mischievous darts: every `dartEveryMs` a burst at `dartSpeed` for `dartMs`. */
  dartEveryMs: 2_400,
  dartMs: 500,
  dartSpeed: 1.6,
  /** The meander's period. */
  meanderMs: 2_600,
  /** The plain step bounce, in body heights, before `bob`. */
  stepBob: 0.025,
} as const;

/**
 * R0582 (SOUL-65): the swim share by type and personality. The idle table's swim base is
 * `IDLE_ACTIONS.swim` (0.026); a Swim form or a Swim lean over `leanAt` swims `typeBoost`
 * times as often, on top of the personality's own swim multiplier (bold and mischievous
 * ×1.5, shy ×0.5). A shy one wades at the edge only, within `edgeIn` of the rim.
 */
export const SWIM_SOUL = {
  // ×3 in the recs; the time share saturates (long swim spells), so ×4 lands it at 25-40%.
  typeBoost: 4,
  leanAt: 40,
  edgeIn: 0.7,
  /** Pond play: splashing a friend swimming this near, at this chance per second. */
  splashRadius: 3,
  splashChance: 0.12,
  splashMs: 1_500,
} as const;

/**
 * R0566 (SOUL-49): a wary Shadow's own ways. Chances per idle pick; the watch is from
 * `watchFar` units, the fruit only one the Keeper is at least `fruitKeeperGap` from.
 */
export const SHADOW_SOUL = {
  sulkChance: 0.3,
  sulkMs: [6_000, 10_000] as const,
  watchChance: 0.35,
  watchFar: 5,
  watchWithin: 12,
  watchMs: [6_000, 10_000] as const,
  fruitChance: 0.6,
  fruitRadius: 8,
  fruitKeeperGap: 3,
  /** The bond: walk to the Keeper, hesitate, then hug (the look splits its time). */
  bondHugMs: 3_000,
  bondHesitate: 0.35,
} as const;

/**
 * R0568 (SOUL-51): a favourite Keeper. Each kind act by a Keeper adds 1; one is the favourite
 * once it leads the other by `lead`. The favourite gets the greet ×`greet` (and the fruit
 * trailing); the other gets a head tilt on its first approach after a switch.
 */
export const FONDNESS = {
  lead: 5,
  greet: 1.5,
  tiltMs: 2_000,
  tiltRadius: 5,
} as const;

/**
 * R0569 (SOUL-52): a favourite spot. Of plain wanders `share` head for it (lazy `lazyShare`);
 * sitting within `radius` of it gives `happyPerMinute`. The Keeper within `seenRadius` of it
 * sitting there discovers it. Curious picks a new one every `curiousDayMs` of sim time.
 */
export const FAV_SPOT = {
  share: 0.35,
  lazyShare: 0.7,
  radius: 4,
  around: 2,
  happyPerMinute: 1,
  seenRadius: 8,
  /** No trip to the spot while the Keeper is this near (it stays with them). */
  keeperStay: 10,
  /** Another Nubbin this near: it stays with them this often instead. */
  company: 6,
  companyStay: 0.8,
  curiousDayMs: 24 * 60 * 60_000,
} as const;

/**
 * R0580 (SOUL-63): glances. A Nubbin looks at the nearest other doing something worth a look
 * (a quirk, an antic, a splash, a cry) within `otherRadius`, or a fruit falling within
 * `fruitRadius`; it takes a new target at most every `everyMs`. In 3D the eyes and head turn
 * (the rig clamps the head); in Pixel the whole body turns to the nearest of its angles.
 */
export const GLANCE = {
  otherRadius: 4,
  fruitRadius: 5,
  everyMs: 2_000,
} as const;
