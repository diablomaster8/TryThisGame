/**
 * Numbers for the Hollow Below's rebuild (lane B of the 2026-10-27 recommendations, DUNG).
 * The older Hollow numbers stay in `DUNGEON` in tuning.ts; everything the rebuild adds
 * lives here, so the dungeon work never has to edit the shared tuning file.
 */
export const HOLLOW = {
  /**
   * After arriving on a floor (entering, descending, or the loading veil lifting) strays
   * and packs leave the Keeper be for this long (R0142).
   */
  arrivalGraceMs: 8000,
} as const;
