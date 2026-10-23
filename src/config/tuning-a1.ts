/**
 * Tunables for campaign-graphics-4 package a1 (re-exported from tuning.ts): stage poses (K1),
 * heads turning to the speaker (K6, K41), line gestures (K7), held props (K13) and the
 * item-get pose (K39). Every number is a default.
 */
export const CG4_A1 = {
  /**
   * K1: seat heights (world units above the ground) for marks that do not carry their own
   * `seatY` yet. A mark's own `seatY` wins; any other mark seats on the ground.
   */
  seats: {
    // A Keeper's knee is about 0.23 up, so a bench sits near that and a step lower.
    'fold-door-1': 0.14,
    'fold-door-2': 0.14,
    'fold-door-3': 0.14,
    'fold-door-4': 0.14,
    'guardhouse-bench': 0.24,
    cart: 0.26,
    porch: 0.14,
    'flat-stone': 0.12,
  } as Readonly<Record<string, number>>,
  /** K6: how strongly a cast member's head turns to the speaker; K41: a crowd Nubbin's. */
  attend: { cast: 1, crowd: 0.5 },
  /** K7: how long the pixel view holds a gesture frame from the line's start (s); `down` holds. */
  gestureHoldS: 1.6,
  /** K39: how long the Keeper holds a story item aloft when its card opens (s). */
  itemGetS: 1,
  /** Pixel: the sit clip's breath, ms per frame. */
  sitFrameMs: 900,
  /** K13 (3D): where a carry prop hangs from the hand, world units down, per prop. */
  hand: {
    /** The broom is gripped high on the handle: its foot sits this far below the hand. */
    broomDrop: 0.62,
    /** A lantern's ring hangs a little under the fingers. */
    lanternDrop: 0.06,
    /** Notebook, egg, keys: held in the palm. */
    heldDrop: 0.02,
  },
} as const;
