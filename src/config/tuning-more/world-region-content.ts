// was tuning-r13d1; review pass R13 D1
/**
 * Lane D round 13, helper d1: numbers for the drawn regions' content (WORLD-35 shore folk,
 * castles and signpost; WORLD-34 Nubbin gardens; WORLD-37 colonnade; WORLD-25 mill wheel;
 * WORLD-36 snowballs; WORLD-33 lane walk-out; WORLD-69 island and cart). Imported directly.
 */

/** WORLD-35: regions whose quests are given at a signpost (and at their named points), not anywhere. */
export const SIGN_OFFERS: Readonly<Record<string, string>> = {
  shore: 'shore-sign',
};

/** WORLD-35: the sandcastles Power Nubbins knock down, and the Kettleby folk on the shore. */
export const SHORE_PLAY = {
  /** A castle stands again this long after it fell (ms): the beach is never used up. */
  rebuildMs: 10 * 60_000,
  /** How near a Power partner must stand for it to knock a castle down. */
  reach: 2.2,
  /** How long it takes (ms). */
  knockMs: 2500,
  /** Shells for a castle (once per rebuild), and the Keeper's own kick range. */
  shells: 3,
  /** Folk: how far from home they stroll, and a loop's length (ms). */
  strollR: 2.4,
  loopMs: 16_000,
} as const;

/** WORLD-34: the Nubbin gardens of the Sun and Moon lands (mirrors drawn there, sim stays home). */
export const LAND_GARDENS = {
  /** Most adults shown in one land. */
  max: 5,
  /** Alignment an adult must reach to count as Sun (above) or Moon (below minus). */
  band: 0.5,
  /** Where each land's adults roam: a ring round these centres. */
  centres: {
    sunlands: [
      { x: 26, z: 2 },
      { x: -26, z: 2 },
      { x: 0, z: -22 },
    ],
    moonlands: [
      { x: -28, z: 22 },
      { x: 28, z: 22 },
      { x: -26, z: -6 },
    ],
  },
  /** The stroll's radius, and its period (ms) and per-Nubbin phase step. */
  r: 3.2,
  periodMs: 40_000,
} as const;

/** WORLD-33: walking out of a neighbour's garden back onto the lane (garden-local coordinates). */
export const GARDEN_WALKOUT = {
  /** The garden's own gate, south of where a visitor arrives. */
  gate: { x: 0, z: 12 },
  /** How near the Keeper must walk to it. */
  r: 2.2,
} as const;

/** WORLD-36: snowballs on the ridge's permanent snow (a throw arc like the Grove's `THROW`). */
export const SNOWBALL = {
  /** Most in the air at once, flight time (ms), launch speed along the facing, and the lob. */
  max: 4,
  flightMs: 900,
  speed: 9,
  lob: 4.2,
  gravity: 9.8,
  /** The ridge's snow starts here going north (z at or below; the terrace at `RIDGE_SNOW_Y`). */
  snowZ: -12,
  /** Gap between throws (ms), and the ball's start height. */
  cooldownMs: 350,
  startY: 1,
} as const;
