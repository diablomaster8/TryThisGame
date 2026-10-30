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
  star: 0.15,
  /** Shiny: one sweep every this many seconds, and the band's brightness. */
  sweep: 3,
  band: 0.7,
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

/** LOOK-24: short flights for strong fliers (`sim/flight.ts`). */
export const FLIGHT = {
  /** An adult at or above this Fly level takes some wander legs in the air. */
  minLevel: 50,
  /** The share of its wander legs that are flights. */
  chance: 0.35,
  /** Cruise height, world units. */
  height: 0.6,
  riseMs: 400,
  glideMs: 600,
  /** Cruise speed as a multiple of the walk. */
  speed: 1.4,
  /** Wing beats per second while climbing and cruising. */
  flapHz: 10,
} as const;

/** LOOK-22: the 3D walk's waddle roll by personality (children, without one, keep 1). */
export const PERSONA_WADDLE = { cheerful: 1.3, shy: 0.7, mischievous: 1.15, lazy: 1.45 } as const;

export const CHILD_HINT = {
  /**
   * LOOK-49: a child's look leans toward its band from this |alignment| and is fully there
   * at `to`, in even steps (Pixel's palette has room for two; 3D blends four).
   */
  from: 0.2,
  to: 0.5,
  steps3d: 4,
};

export const EYE_TRACK = {
  /** LOOK-52: a Nubbin's eyes follow the Keeper within this many metres. */
  range: 5,
  /** Pixel: closer than this across the screen, the eyes stay centred. */
  deadZone: 0.3,
};

export const HELD_REACT = {
  /** LOOK-50: held, a Nubbin with this much affection or more hugs the Keeper's arm. */
  hug: 60,
  /** Under this it flails; between, it dangles with its legs swinging. */
  flail: 20,
  /** The dangle's leg swing (radians, ±15°) and rate (Hz); the flail's rate (Hz). */
  dangleSwing: 0.26,
  dangleHz: 1.2,
  flailHz: 6,
};

export const SHADOW_LOOK = {
  /** LOOK-64: a wary Shadow Nubbin's head tips down (radians) and its arms tuck in. */
  headDrop: 0.18,
  armsIn: 0.25,
  /** A bonded one's warm rim: its opacity at no trust and at full trust. */
  rimMin: 0.15,
  rimMax: 0.6,
};

export const GAG_TIMING = {
  /** FUN-04: a content adult plays a personality gag every 40–90 s (seeded per Nubbin). */
  gapMs: [40_000, 90_000] as const,
  /** How long one gag plays. */
  playMs: 3200,
  /** A child plays its leaning's gags at this share of the rate (half). */
  childRate: 0.5,
};

export const PHOTO_COMEDY = {
  /** FUN-39: a nearby Nubbin photobombs this share of photos, and the subject blinks in this. */
  bombChance: 0.15,
  blinkChance: 0.1,
  /** How near (metres) a Nubbin must be to photobomb. */
  bombRange: 6,
};
