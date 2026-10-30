/**
 * Lane B round 8, "party and run UI": party roles (R0167), the Hollow guide (R0208), the
 * speed-run ghost line (R0187) and the boss scroll (R0207). Every tunable number here.
 */
import { DUNGEON } from './tuning';

export const PARTY_R8 = {
  /** R0167: the party grows from 3 to 4 once Act II's boss (act index 1) has fallen. */
  size: { base: DUNGEON.partySize, big: 4, bigAfterAct: 1 },
  roles: {
    /** Fetch: radius `fetchRadius + Run level / runPer` u, capped. */
    fetch: { runPer: 10, maxExtra: 6 },
    /** Light: extra explore radius in cells. */
    light: { explore: 2 },
    /** Scout: the Run level that makes a Scout of a runner; it calls out idle packs this many
     * cells off (packs notice at about 4). */
    scout: { minRun: 30, noticeCells: 7 },
    /** Lazy Nubbins fetch only this close (u, about 2 cells). */
    lazyFetch: 3,
  },
  guide: {
    /** Footprints drawn at most this many cells along the path. */
    maxSteps: 60,
    /** One footprint every this many cells. */
    every: 2,
    /** How far along the path the bar's arrow looks, in cells. */
    lookAhead: 5,
  },
  ghost: {
    /** Cells kept per level for the personal-best line. */
    maxCells: 400,
  },
} as const;
