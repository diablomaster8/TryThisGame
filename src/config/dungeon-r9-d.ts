/**
 * Numbers for lane B round 9, helper d: kid mode (R0188), raised shelves and the Fly lift
 * (R0191). Strings are in `strings-hollow-r9-d.ts`.
 */
export const HOLLOW_R9D = {
  kid: {
    /** Kid floors use this v3 level, about half a standard floor's cells. */
    level: 'kid' as const,
    dims: { cols: 52, rows: 46, rooms: [6, 8], poi: [14, 18], packs: [2, 3], caFill: 0.8 } as const,
    /** At most this many foes in a pack, and never a champion modifier. */
    packMax: 2,
  },
  shelves: {
    /** Raised shelves start at this depth, on version-4 floors only. */
    fromDepth: 2,
    /** How many a floor tries for, and the tries spent looking. */
    count: [1, 3] as const,
    tries: 60,
    /** A shelf is a w×h block of dry floor, at least this far from the stairs (cells). */
    sizes: [
      [2, 2],
      [3, 2],
      [2, 3],
    ] as const,
    fromStairs: 6,
    spacing: 8,
    /** Visual rise on top of the cell's own height, in `DUNGEON.elev.step`s. */
    riseSteps: 2,
    /** Feet at least this high (world units) can step onto a shelf: a jump does it. */
    climbHeight: 0.45,
  },
  /** R0193: the Hollow's phone layout. */
  phone: {
    /** Widest screen (CSS px) that gets the one-thumb bar underground. */
    maxWidth: 500,
    /** How near (cells) a pack must be for ⚔ Engage. */
    engageCells: 8,
  },
  fly: {
    /** A party Nubbin at this Fly level or more lifts the Keeper onto one shelf a floor. */
    minLevel: 10,
  },
};
