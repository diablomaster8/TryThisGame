/**
 * Tuning: the world domain (TECH-36). Moved out of config/tuning.ts, which still re-exports it.
 * Numbers are unchanged; the review-pass letters in the comments are their provenance.
 */

/** The full-3D Grove: its Lakitu camera, the heightfield and the dressing built from GROVE. */
/** The pixel sprite atlas (render/sprites/mega-atlas.ts). */
export const ATLAS = {
  /** Share of the atlas a repack leaves empty, so new sheets fit without another repack. */
  headroom: 0.25,
} as const;

export const GROVE = {
  /**
   * 96 units a side (2026-10-13, four times the earlier area). The old 48-unit heart
   * keeps every position; the outer ring is wilder: the north wood, the east ridge, the
   * south marsh along the stream, the west meadow.
   */
  size: 96,
  /** Centre and radius of the pond. */
  pond: { x: 7, z: 6, r: 5 },
  trees: [
    { x: -8, z: -5 },
    { x: 6, z: -12 },
    { x: -12, z: 7 },
    { x: 16, z: 12 },
    // The outer ring's fruit trees: the west meadow and the far orchard corner.
    { x: -32, z: 20 },
    { x: 28, z: 30 },
  ] as const,
  hills: [
    { x: -18, z: 13, r: 6, h: 2.6, ramp: { from: 260, to: 560 } },
    { x: 16, z: -16, r: 7, h: 3.4, ramp: { from: 160, to: 440 } },
    { x: -18, z: -15, r: 5, h: 2, ramp: { from: 40, to: 340 } },
    { x: 20, z: 4, r: 4, h: 1.5, ramp: { from: 290, to: 590 } },
    // The outer ring.
    { x: 36, z: -34, r: 8, h: 3.8, ramp: { from: 135, to: 435 } },
    { x: -36, z: 34, r: 7, h: 3, ramp: { from: 310, to: 610 } },
    { x: 38, z: 30, r: 5, h: 2, ramp: { from: 220, to: 520 } },
    { x: -38, z: -34, r: 6, h: 2.4, ramp: { from: 40, to: 340 } },
    { x: 2, z: -40, r: 5, h: 2.2, ramp: { from: 90, to: 390 } },
    { x: -34, z: -4, r: 4, h: 1.6, ramp: { from: 0, to: 300 } },
  ] as const,
  waterfall: { x: 16, z: -16, height: 3.4, width: 1.6 },
  /** Where the buildings stand and how wide their footprint is (walkers are kept out). */
  buildings: {
    cottage: { x: -7, z: 14, r: 2.8 },
    school: { x: -3, z: -18, r: 2.4 },
    dojo: { x: 18, z: -4, r: 3.4 },
    well: { x: 3, z: 10, r: 0.9 },
    windmill: { x: -16, z: -5, r: 2.0 },
  },
  /** The big rocks, tappable for stone and solid underfoot. */
  rocks: [
    { x: -7, z: 9, r: 0.7 },
    { x: 6, z: -9, r: 0.6 },
    { x: 13, z: -5, r: 0.5 },
    { x: -10, z: 10, r: 0.6 },
    // The outer ring.
    { x: -28, z: 8, r: 0.7 },
    { x: 30, z: 12, r: 0.6 },
    { x: -6, z: 34, r: 0.6 },
    { x: 20, z: -32, r: 0.7 },
    { x: -34, z: -20, r: 0.6 },
    { x: 36, z: 40, r: 0.5 },
    { x: -22, z: -40, r: 0.6 },
  ],
  /** The stream: from the waterfall pool into the pond, then out to the south edge. */
  river: {
    width: 2.2,
    inflow: [
      { x: 12.4, z: -10.4 },
      { x: 10.5, z: -6.5 },
      { x: 9.2, z: -3 },
      { x: 7.6, z: 0.4 },
    ],
    outflow: [
      { x: 8.2, z: 11.6 },
      { x: 9.5, z: 16 },
      { x: 11, z: 20 },
      { x: 12, z: 25 },
      // On through the south marsh to the far edge.
      { x: 12.6, z: 31 },
      { x: 11.2, z: 38 },
      { x: 12.5, z: 44 },
      { x: 12, z: 49 },
    ],
  },
  /** Where the path crosses the inflow. */
  bridge: { x: 9.6, z: -4.2 },
  keeperStart: { x: 0, z: 4 },
  eggSpots: [
    { x: -2, z: 1 },
    { x: 2, z: 0 },
  ] as const,
} as const;

export const VISITS = {
  /** Each Keeper brings one story gift, once, ever; the neighbour host gives the same. */
  giftShells: 30,
  /** Saturday is lantern night. */
  lanternNightDay: 6,
} as const;

export const QUESTS = {
  /** Open requests on the board at once. */
  open: 3,
  baseShells: 20,
  /** R0629: a child profile keeps at most this many quests active (a grown-up's is `activeCap`). */
  childCap: 2,
  /** R0629: a child's picture pitch is at most this many words (the sprout band's line cap). */
  maxPitchWords: 14,
} as const;

export const ACHIEVEMENTS = {
  shells: 25,
} as const;

export const FRIENDS = {
  /** Friendship per minute spent within reach of another Nubbin. */
  perMinute: 2,
  reach: 2.2,
  buddyAt: 30,
  chatChance: 0.06,
  chatMs: 5000,
} as const;

export const LANDMARKS = [
  { id: 'bridge', x: 9.6, z: -4.2 },
  { id: 'well', x: 3, z: 10 },
  { id: 'falls', x: 12.4, z: -10.4 },
  { id: 'cottage', x: -7, z: 12 },
  { id: 'dojo', x: 18, z: -2 },
  { id: 'school', x: -3, z: -16 },
  { id: 'oldTree', x: -8, z: -3 },
  { id: 'southBend', x: 11, z: 20 },
  { id: 'westHill', x: -12, z: 13 },
  // The outer ring.
  { id: 'northWood', x: -28, z: -30 },
  { id: 'eastRidge', x: 30, z: -24 },
  { id: 'southMarsh', x: 6, z: 38 },
  { id: 'westMeadow', x: -32, z: 16 },
  { id: 'farOrchard', x: 26, z: 34 },
] as const;

/** The village square: recruits raise prosperity; thresholds open the square's services. */
export const TOWN = {
  perRecruit: 12,
  max: 120,
  unlocks: { stall: 20, gym: 40, attendant: 60, fortune: 80, festival: 100 } as const,
  stallDiscount: 0.9,
  festivalPrize: 1.15,
} as const;

/** Curfew by the real clock. */
/** The post-ending expansions E1–E3 (sim/side-rules-expansions.ts). */
export const EXPANSIONS = {
  /** E2: Dandy's adult span as a multiple of the usual one, so the whole life is twelve days of the clock. */
  novaSpanScale: 2.2,
  /** E2: the days Nova's visits are gated on. */
  novaDays: [4, 8, 11] as const,
  novaSlipsForVariant: 2,
  /** E3: dojo wins after the bracket goes up. */
  tournamentWins: 3,
} as const;

/** Guard teams: a one-time run of missions and a seeded local board. */
export const TEAMS = {
  pointsPerMission: 10,
  rankEvery: 30,
  /** The team's missions, in order, each set once. */
  missions: [
    { kind: 'expeditions', target: 3 },
    { kind: 'raceWin', target: 1 },
    { kind: 'shells', target: 300 },
    { kind: 'karateWin', target: 1 },
  ],
} as const;
