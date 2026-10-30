/**
 * Lane A round 8 (SOUL): the numbers behind likes and dislikes, the moody looks, the
 * sim's time of day, rain by personality and toy boredom. Re-exported from tuning.ts.
 */

/** R0536 (SOUL-18): favourite and disliked fruit. */
export const LIKES = {
  /** Extra happiness for the favourite, on top of the fruit's own. */
  yumHappiness: 4,
  /** Happiness lost to a disliked fruit (the hunger and stat points still land). */
  blehHappiness: -2,
  /** A favourite is worth walking this much farther for. */
  favouriteReach: 1.5,
} as const;

/** R0532 (SOUL-14): the moody looks (Grumpy, Sleepy) and how care softens them. */
export const MOODY = {
  /** A grumpy Nubbin turns down a high five this often. */
  grumpyRefuse: 0.3,
  /** Its greeting odds. */
  grumpyGreet: 0.6,
  /** Chance an idle choice is a harrumph: sat with its back to the Keeper. */
  harrumphChance: 0.12,
  harrumphMs: [3000, 6000] as [number, number],
  /** A sleepy Nubbin's naps run this much longer. */
  sleepyNap: 1.6,
  /** Chance an idle choice is a yawn (a short sit). */
  yawnChance: 0.12,
  yawnMs: 1800,
  /** Chance it nods off where it stands instead of walking on. */
  nodOffChance: 0.05,
  nodOffMs: 40_000,
  /** Care softens both: this long with happiness above `calmAbove` clears the look. */
  calmMs: 30 * 60_000,
  calmAbove: 40,
} as const;

/** R0535 (SOUL-17): the sim's time of day, from the same wall clock as the curfew. */
export const PHASE_HOURS = { dawnFrom: 6, dayFrom: 8, duskFrom: 18, nightFrom: 20 } as const;

/** R0535: the phase's own idle quirks, as chances an idle choice turns into one. */
export const PHASE_QUIRKS = {
  /** Dawn: a stretch and a yawn. */
  dawnStretch: 0.15,
  stretchMs: 2200,
  /** Dusk: chasing fireflies (the renderers spawn them round the target). */
  duskFireflies: 0.18,
  fireflyMs: [5000, 8000] as [number, number],
  /** Night: lying back to look at the stars (when not napping for the curfew). */
  nightStargaze: 0.15,
  stargazeMs: [6000, 10_000] as [number, number],
  /** Personality scales on the phase quirks. */
  by: {
    cheerful: { dawn: 1.4, dusk: 1.3, night: 0.8 },
    shy: { dawn: 0.8, dusk: 1, night: 1.4 },
    mischievous: { dawn: 0.6, dusk: 1.8, night: 0.8 },
    lazy: { dawn: 0.5, dusk: 0.6, night: 1.6 },
  },
} as const;

/** R0534 (SOUL-16): rain by personality, and the share that may shelter at once. */
export const RAIN_SOUL = {
  /** At most this share of the Grove's free Nubbins shelters at a time. */
  shelterCap: 0.5,
  /** Shelter trees are looked for this close to the Keeper first. */
  nearKeeper: 8,
  /** Puddle stomping and raindrop catching: how long, and the cheer from a stomp. */
  playMs: [5000, 9000] as [number, number],
  stompHappiness: 1,
  /** How far from the Keeper the rain games are played. */
  playRadius: 4,
  /** Chance each personality picks its rain game over sheltering. */
  play: { cheerful: 0.7, mischievous: 0.65, shy: 0.1, lazy: 0.15 },
} as const;

/** R0537 (SOUL-19): favourite toys, boredom and new-toy novelty. */
export const TOY_SOUL = {
  favourite: 3,
  /** The favourite is played with this much longer. */
  favouritePlay: 1.5,
  /** The play row scales by keenness × this: a fresh favourite at three times the old odds. */
  keen: 1,
  /**
   * Boredom: +1 per second of play, fading 9 a minute, the weight floored at 0.1. The
   * recommendation said 0.2 a minute, which pins every toy at the floor after a minute of
   * play; 9 lets a toy recover in a few minutes, which keeps play near a quarter of the day.
   */
  perPlaySecond: 1,
  decayPerMinute: 9,
  boredAt: 60,
  floor: 0.1,
  /** A toy new to the Grove draws everyone for a while. */
  noveltyMs: 10 * 60_000,
  novelty: 2,
} as const;

/** R0542 (SOUL-24): Sun and Moon garden behaviour. */
export const ALIGN_SOUL = {
  /** How far a Sun Nubbin will go to comfort a crying or sad one. */
  comfortRadius: 8,
  comfortChance: 0.8,
  comfortMs: 3000,
  /** What the pat gives the sad one, and the comforter. */
  comfortGives: 5,
  comfortSelf: 2,
  /** A Moon Nubbin's "boo": how near the mark, and how often. */
  prankRadius: 6,
  prankChance: 0.08,
  prankMs: 2500,
  /** A child with a strong hint (|alignment| above this) acts at `childStrength`. */
  childHint: 0.3,
  childStrength: 0.5,
  /** In the Sun Grove and the Moon Grove, their own band acts this much more. */
  ownGrove: 1.5,
  /** A sad mark: happiness under this, or crying. */
  sadBelow: -20,
} as const;

/** R0544 (SOUL-26): little physical antics. Chances are per second; all cosmetic. */
export const ANTICS = {
  /** A walking Nubbin trips and faceplants. */
  tripPerSecond: 0.004,
  tripMs: 1600,
  /** Near a flowerbed, a memorial flower or a crop, a sneeze (twice as likely in spring). */
  sneezeRadius: 1.8,
  sneezePerSecond: 0.06,
  sneezeMs: 1200,
  /** Two fruits inside a minute bring the hiccups. */
  hiccupWithinMs: 60_000,
  hiccupMs: 1500,
  /** A cheerful or mischievous child chases its own tail now and then (per idle choice). */
  tailChance: 0.06,
  tailMs: 2200,
} as const;

/** R0549 (SOUL-31): emote balls a phone can read. */
export const EMOTE_READ = {
  /** At the far zoom, or with Big mood bubbles on, balls draw this much bigger. */
  big: 1.5,
  /** A new reaction bubble pops to this size and settles over `popMs`. */
  pop: 2,
  popMs: 300,
} as const;

/** R0593 (SOUL-76): Settings → Liveliness, scaling quirks and antics only. */
export const LIVELINESS = { calm: 0.5, normal: 1, lively: 1.5 } as const;

/** R0563 (SOUL-46): the diary behind the sheet's "Recently" lines. */
export const DIARY = { keep: 5, show: 3 } as const;
