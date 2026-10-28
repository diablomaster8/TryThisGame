/**
 * Tunables added by the sim fix pass of 2026-10-25, kept out of the shared tuning.ts so
 * parallel passes do not collide there. Same rule: every number the sim tunes lives in config.
 */

export const KEEPER_UNSTICK = {
  /** A care walk where the Keeper moves less than this in `giveUpMs` gives up. */
  minProgress: 0.25,
  /** How long a walk may make no progress before the Keeper gives up and says so. */
  giveUpMs: 2500,
  /** Clearance kept from obstacles when the Keeper is pushed out of one. */
  clearance: 0.35,
  /** Ring spacing and furthest ring when searching for a free spot. */
  searchStep: 0.25,
  searchMax: 16,
} as const;

/** Bushes, flowerbeds and thickets (MOVE-03/04): the Keeper's speed in one, and how much of the overlap is eased back out each step. */
export const KEEPER_SOFT = {
  slow: 0.5,
  push: 0.2,
} as const;
