/** Tunable numbers for the look lane: cosmetics and the eggshell hat. */

export const LOOK_SHOP = {
  /** The shop's hat of the day changes once per this much sim time (a daily refresh). */
  hatDayMs: 86_400_000,
};

export const EGG_FINISH = {
  /** Shop eggs with a rare colour: the chance of a metal, then a glass finish (LOOK-31). */
  metalChance: 0.01,
  glassChance: 0.01,
};

export const EGGSHELL = {
  /** How long a hatchling wears its eggshell in live play before it comes off (LOOK-26). */
  wearMs: 10 * 60_000,
};

export const EMOTE_SPRING = {
  /** The emote ball trails its anchor over the point on a soft spring (LOOK-16). */
  stiffness: 40,
  damping: 7,
  /** The farthest the ball may lag behind its anchor, in world units (3D metres; Pixel's 2-unit Nubbin). */
  clamp3d: 0.25,
  clampPixel: 0.4,
  /** The anchor sits this far behind the head along the facing, over the swept-back point. */
  back3d: 0.1,
  backPixel: 0.18,
  /** A hop landing squashes the ball (width, height) for this long. */
  squashMs: 120,
  squash: [1.15, 0.85] as const,
  /** A change of shape (ball to heart, swirl) pops 0.6 → 1.15 → 1 over this long. */
  popMs: 150,
};

/** The jewel, metal and shiny finishes in Full 3D (`samples/gem-finish.ts`, LOOK-29/30). */
export const GEM_LOOK = {
  /** Jewel: the core facing the eye and the rim, as multipliers on the lit colour. */
  core: 1.22,
  edge: 0.72,
  /** How far the rim goes to the light gem colour. */
  rim: 0.7,
  /** The hard highlight's brightness (its outer step is 40% of this). */
  spec: 0.75,
  /** Metal ramp: the sky band and the horizon band. */
  metalHi: 1.35,
  metalLo: 0.6,
  /** Metalness for gold and silver off the toon ramp. */
  metalness: 0.6,
  /** A new twinkle every this many seconds; each lives three times as long. */
  twinkle: 0.7,
  /** Twinkle star half-length, as a share of the body's radius direction. */
  star: 0.12,
  /** Shiny: one sweep every this many seconds, and the band's brightness. */
  sweep: 3,
  band: 0.55,
  /** The shader clock held under reduced motion (band mid-body, stars full). */
  stillAt: 1.05,
};

export const SWIM_STYLE = {
  /** LOOK-23: below this Swim level a Nubbin dog-paddles, head only above the water. */
  paddleBelow: 20,
  /** Above this Swim level it swims a front crawl; between, a breaststroke. */
  crawlAbove: 60,
  /** Milliseconds per stroke: each sends a ripple ring and a few splash drops. */
  strokeMs: { paddle: 300, breast: 640, crawl: 420 },
  /** How far a 3D body sinks, as a fraction of its scale: head only, shoulders, flat. */
  sink: { paddle: 1.5, breast: 1.1, crawl: 1.0 },
} as const;

/** Critter part size by the matching stat's level (LOOK-36). */
export const PART_SIZE = {
  /**
   * Three steps (levels 0–32, 33–65, 66–99), each the formula 0.7 + 0.5 × level / 99 at its
   * middle, so the 3D geometry cache holds at most three sizes of a part.
   */
  steps: [0.78, 0.95, 1.12] as const,
  bucket: 33,
  /** Sun and Moon adults' parts move this far toward the body colour. */
  bandTint: 0.3,
};
