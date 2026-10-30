/**
 * Lane D round 8 (platform, TECH): tunable numbers added this round. Imported directly by
 * the modules that use them, so the shared tuning file is untouched.
 */

/** R0496 (TECH-55): when the "a new Grove is ready" chip may show. */
export const UPDATE_NOTICE = {
  /** A worker left waiting this long in one session offers itself. */
  waitMs: 10 * 60_000,
  /** How often the waiting state and the "busy" state are looked at. */
  pollMs: 15_000,
  /** Ask the host for a new build on resume at most this often (installed apps never reload). */
  checkEveryMs: 60 * 60_000,
  /** Reload anyway if the new worker has not taken over by then. */
  reloadFallbackMs: 4000,
} as const;

/** R0520 (TECH-80): how long to wait for the service worker's `has-urls` answer. */
export const OFFLINE_ENTRIES = { replyMs: 1500 } as const;
