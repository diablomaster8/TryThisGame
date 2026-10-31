/** Lane C round 10, agent B (re-exported through tuning-camp10.ts). */

/** R0659 / R0623 (CAMP-67, CAMP-31): rolling backups of each slot, kept in IndexedDB. */
export const SAVE_BACKUPS = {
  /** Backups kept per slot; the oldest drops off when a new one is taken. */
  perSlot: 3,
  /** Wall-clock gap between two backups of the same slot (10 minutes of play). */
  everyMs: 10 * 60_000,
} as const;

/** R0619 (CAMP-27): chapter checkpoints, the first snapshot of each chapter, in IndexedDB. */
export const CHECKPOINTS = {
  /** Most checkpoints one slot keeps (about 30 chapters across the spine and its lines). */
  perSlotMax: 40,
} as const;

/** R0649 (CAMP-57): slot names. */
export const SLOT_LABEL = {
  /** Longest slot name, in characters. */
  nameMax: 24,
} as const;
