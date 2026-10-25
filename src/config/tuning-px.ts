/**
 * Tunables for the pixel renderer's fixes of 2026-10-25, kept out of the shared tuning.ts
 * so the parallel fix branches do not collide there.
 */

/** The sprite-sheet cache (`render/sprites/sheets.ts`). */
export const SHEET_CACHE = {
  /**
   * Sheets kept before the least recently used start to go. A Nubbin sheet is about 3 MB
   * of canvas plus its texture, and every hat, scarf, dye or part change makes a new one.
   */
  maxSheets: 64,
  /** A sheet drawn within this long is never evicted, so a busy frame cannot thrash. */
  idleMs: 10_000,
} as const;
