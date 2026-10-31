/**
 * Lane B round 9, helper b: tunables for the Hollow's secret levels, the Moo Meadow (R0189,
 * DUNG-46) and the Pillow Fort (R0183, DUNG-40). Words live in `strings-hollow-r9-b.ts`.
 */
export const SECRETS = {
  /** The last act (Act V) whose boss leaves Gran's Teaspoon and the milk bell. */
  keepsakeAct: 4,
  moo: {
    /** A small sunny field from the outdoor generator: 4×3 tiles of meadow and stream. */
    field: {
      cols: 64,
      rows: 48,
      tile: 16,
      mouths: [0, 0],
      packs: [0, 0],
      wildlife: [8, 10],
      shrines: [0, 0],
      loot: 6,
      road: 2,
    },
    /** Herds of the Moo Crew: how many, how big (the fight takes the party's worth at once). */
    herds: [3, 4],
    herdSize: [8, 12],
    /** The look the Moo Crew and the Cow Queen borrow until lane E draws them. */
    cow: 'stampbull',
    /** The friendly field folk, for scanning (no fights). */
    friends: ['stampbull', 'emberfoal', 'twinstrut', 'peeplet', 'bulblet', 'fluffkit'],
    /** Foes stand as on Act V's top level. */
    act: 4,
    /** A herd's charm drop: one chipped charm, this often. */
    herdCharm: 0.5,
  },
  fort: {
    /** The fort's three pillows (looks), the leader first. */
    trio: ['puffbud', 'starbud', 'drowsling'],
    /** Levels over a boss of the same depth would be; the bout cap still applies. */
    levelOver: 0,
    act: 4,
  },
  /** First-win prizes, in Shells, on top of the usual pack pay (Hollow pay is kept low). */
  bonus: { 'cow-queen': 60, 'pillow-trio': 90 } as Record<string, number>,
} as const;
