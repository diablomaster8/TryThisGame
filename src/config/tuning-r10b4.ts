/**
 * Lane B round 10, helper b4: the last champion modifiers in fights (R0155), the tiers' Bell
 * Wire chains, Immune to Tickles and fight scaling (R0179), and hop spots, hop routing and
 * the Fly carry (R0191). Strings are in `strings-r10b4.ts`.
 */
export const R10B4 = {
  mods: {
    /** Hiding: a hit on a foe that has just puffed away lands at this share. */
    hiddenTaken: 0.5,
    /** Immune to Tickles: its own type of move lands at this share. */
    tickleTaken: 0.5,
    /** Snack Thief: fruit taken from the Keeper's basket when the party loses. */
    snack: 1,
    /** Hollow rumble rooms (tactics): the prefix's matching champion modifier (Speedy already is Zoomy). */
    rumble: { fluffy: [], speedy: [], sticky: ['sticky'] } as const,
    /** Brisk and Wild rumbles: every foe also sparkles. */
    rumbleTier: ['sparkly'] as const,
  },
  tiers: {
    /**
     * A Hollow bout's foes are held to the party's dojo-rival level plus this many levels by
     * tier, so Brisk and Wild hit harder without the +35/+70 floor levels outclassing a party.
     */
    boutLift: { cosy: 0, brisk: 3, wild: 6 } as const,
    /**
     * FIGHT's assist flag as the battle core's difficulty override: Wild plays the Champion AI;
     * Cosy and Brisk keep the Keeper's own Gentle-bouts choice (Cosy's assists are the Hollow's
     * warm loss and free retry, not the kid-mode bout).
     */
    boutDifficulty: { gentle: undefined, standard: undefined, tactics: 'spicy' } as const,
  },
  bellWire: {
    /** Wild floors string this many chains of bells, each this many bells, `gap` cells apart. */
    chains: [1, 2] as const,
    bells: 3,
    gap: 2,
    /** A wired bell wakes the nearest still pack to each bell, within this many world units. */
    reach: 22,
    tries: 300,
  },
  hops: {
    /** Hop spots (shortcuts over a pit) start at this depth, version-4 floors only. */
    fromDepth: 2,
    /** Per floor, and the tries spent looking. */
    count: [1, 2] as const,
    tries: 400,
    /** A hop saves at least this many cells of walking (it is a shortcut, not the only way). */
    minSaving: 10,
    /** Spots stay this far apart and from the stairs (cells). */
    spacing: 8,
    fromStairs: 5,
    /** Tap routing: a jump edge costs this much more than walking its length. */
    jumpCost: 6,
    climbCost: 3,
    /** A planned hop's horizontal speed (world units a second) while in the air. */
    airSpeed: 7.2,
    /** How near the take-off spot counts as there (world units). */
    spotReach: 0.3,
  },
  fly: {
    /** A flying party Nubbin carries the Keeper over at most this many cells of pit, once a floor. */
    carryCells: 4,
  },
} as const;
