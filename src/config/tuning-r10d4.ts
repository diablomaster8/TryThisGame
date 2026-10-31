/**
 * Lane D, round 10 (helper d4): tunable numbers added this round. Imported directly by the
 * modules that use them.
 */

/** TECH-20: how long a "Keep for offline" pack may take before the row gives up waiting. */
export const OFFLINE_PACKS = { replyMs: 5 * 60_000 } as const;

/** TECH-21: the install offer shows from this many sessions on, a while into play. */
export const INSTALL_HINT = { minSessions: 2, delayMs: 45_000 } as const;

/**
 * TECH-56: localStorage holds about 5 MB per site in every supported browser (less in
 * Safari Private); the saves line warns from `warnShare` of it, or when the site's whole
 * storage is that full.
 */
export const STORAGE_WATCH = { localMb: 5, warnShare: 0.8 } as const;
