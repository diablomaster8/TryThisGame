// was tuning-camp11-profiles; campaign engine, round 11
/**
 * Lane C round 11, helper "profiles" (R0598, R0618, R0627, R0628, R0638, R0653): the numbers
 * the profile picker, chapter select, sandbox start and pack cards read.
 */
export const PROFILES = {
  /** R0653: most profiles on one device, Keepers and children together. */
  max: 6,
  /** A deleted profile's saves stay in the archive this long (wall time) before removal. */
  keepDeletedMs: 30 * 24 * 60 * 60 * 1000,
  /** The typed word a delete asks for. */
  confirmWord: 'DELETE',
  /** Longest profile name. */
  nameMax: 20,
} as const;

/** R0638: fun-quest packs, by the first and last quest number of each family. */
export const PACKS = {
  /** A pack card shows once its first quest exists; capers outside every pack stay as they are. */
  ranges: [
    { id: 'python', from: 1, to: 20 },
    { id: 'bean', from: 21, to: 30 },
    { id: 'sunny', from: 31, to: 45 },
    { id: 'avatar', from: 46, to: 65 },
    { id: 'alice', from: 66, to: 75 },
    { id: 'holmes', from: 76, to: 85 },
    { id: 'hodja', from: 86, to: 95 },
  ],
} as const;
