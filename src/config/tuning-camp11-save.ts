/**
 * Lane C round 11, the save helper (R0598, R0621, R0623, R0625, R0626, R0668): how saves are
 * laid out on the device. Every number the slot, storage and backup code reads lives here.
 */
export const SAVE_LAYOUT = {
  /** R0621 (CAMP-29): Hazel's Grove has this many slots; every other mode keeps 3. */
  slotsPerProfile: 8,
  /** The other modes' slot count (the old SLOTS_PER_MODE). */
  slotsPerMode: 3,
  /** R0623: a live write bigger than this (UTF-16 bytes) logs a debug warning. */
  slotWarnBytes: 400_000,
  /**
   * R0668 (CAMP-76): a live save bigger than this moves to IndexedDB behind a small
   * localStorage pointer. Only when `idbLiveSaves` is on (off until the device pass).
   */
  idbMoveBytes: 200_000,
  idbLiveSaves: false,
  /**
   * R0598 stage B: copy every legacy save into one profile's unified slots. Off: the copies
   * can be planned and tested, but the game keeps playing the legacy keys.
   */
  unifiedSlots: false,
  /** Stage B step 8: the legacy keys may go only after the new slot has loaded this often. */
  legacyKeepLoads: 3,
  /** R0625: backup files over this many bytes leave out the chapter checkpoints. */
  backupMaxBytes: 5_000_000,
} as const;
