// was tuning-r13d2; review pass R13 D2
/** Round 13, helper d2: tunables for the backdrop cards (R0117) and the come-here pull (R0140). */
export const BEACON_BACKDROP = {
  /** Most cards at once. */
  max: 3,
  /** How far past the exit the card stands, world units. */
  beyond: 14,
  /** Card height, world units. */
  height: 22,
  opacity: 0.75,
} as const;

/** R0140: the second Keeper's come-here pull, so a stick left alone never loses the first. */
export const KEEPER2_PULL = {
  /** Farther than this from Keeper 1 with the stick idle, the pull starts, world units. */
  leash: 34,
  /** The pull stops this close. */
  stopAt: 6,
  /** Stick strength the pull uses (0..1). */
  strength: 0.7,
} as const;

/** R0118: jumping into a leaf pile (autumn): reach, the airborne height, the mood it gives. */
export const LEAF_JUMP = { radius: 1.6, minY: 0.25, happiness: 3, cooldownMs: 60000 } as const;
