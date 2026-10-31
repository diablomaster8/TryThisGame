/**
 * Lane B round 8, "floors": secret rooms (R0182), light puzzles (R0202), critter-part
 * shortcuts (R0212) and the sealed boss door (R0160). Every tunable number for those here.
 */
export const FLOORS_R8 = {
  secrets: {
    /**
     * Chance of rolling 0, 1 or 2 secret rooms on a level (R0182: "0–2 per level"). Only
     * quiet side caves qualify (no jump nooks, nothing anyone needs), so in practice about
     * a third of levels have one (the test pins 0.3–1.4 on average, never more than 2).
     */
    countWeights: [0.15, 0.45, 0.4],
    /** A side cave this size (open cells, with its tunnel) can be a secret room. */
    minCells: 10,
    maxCells: 500,
    /** At most this many cells across its mouth (the cracked wall). */
    maxMouth: 4,
    /** Leaning on the cracked wall this long opens it. */
    bumpMs: 1000,
    /** How close (in cells, centre to centre) the Keeper must lean. */
    bumpCells: 1.3,
    /** A Light or Scout friend in the party finds a secret wall this many cells off. */
    sightCells: 2,
    /** Run level that makes a runner a scout without a picked role (as the traps use). */
    scoutRun: 30,
    /** Shells in the secret stash: base + per depth. */
    shells: [20, 3] as const,
  },
  puzzles: {
    /** Chance a level has a puzzle room (when one fits). */
    chance: 0.6,
    /** The puzzle's board is this wide, inside a ring of open floor (so 7×7 in all). */
    board: 5,
    /** A pressed plate stays down this long after everyone steps off. */
    plateHoldMs: 6000,
    /** How many plates and torches a room gets. */
    plates: [2, 3] as const,
    torches: [3, 4] as const,
    /** Kid mode: the hint arrow shows after this long in the puzzle room. */
    hintMs: 30_000,
    /** R0212: chance a puzzle room also has a critter-part shortcut spot. */
    shortcutChance: 0.7,
    /** Shells in the puzzle's chest: base + per depth. */
    shells: [16, 2] as const,
  },
  boss: {
    /** The arena seals once the Keeper is this many cells inside the boss room's door. */
    sealInside: 2,
  },
} as const;
