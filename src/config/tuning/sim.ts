/**
 * Tuning: the sim domain (TECH-36). Moved out of config/tuning.ts, which still re-exports it.
 * Numbers are unchanged; the review-pass letters in the comments are their provenance.
 */

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;

/** The safety net for uncaught errors (`platform/error-watch.ts`). */
export const ERRORS = {
  /** Uncaught errors logged per page load; past this, a loop cannot flood the console. */
  maxLogged: 10,
  /** The gentle notice shows at most this often (ms)... */
  noticeGapMs: 60_000,
  /** ...and at most this many times per page load. */
  maxNotices: 3,
  /** How long the notice stays on screen (ms). */
  noticeMs: 6000,
} as const;

export const SIM = {
  /** Fixed sim step. 10 per second. */
  stepMs: 100,
  /** Fine steps allowed per rendered frame before the loop falls back to coarse steps. */
  maxStepsPerFrame: 400,
  /** Longest real gap one frame may feed the clock; anything longer is a pause. */
  maxFrameDeltaMs: 5000,
  /** Coarse step used for long catch-ups. */
  coarseStepMs: 1 * MINUTE,
  /** Absences longer than this are simulated in coarse steps. */
  coarseAfterMs: 3 * MINUTE,
  timeScales: [1, 10, 100, 1000] as const,
  autosaveMs: 30 * SECOND,
  /** Show a progress indicator when catch-up takes longer than this. */
  catchUpProgressMs: 500,
  /** Longest absence ever simulated, whatever the setting (review C, item 13): 30 days. */
  maxAwayMs: 30 * 24 * HOUR,
  /** Coarse steps run between checks of the clock during a long catch-up. */
  catchUpChunkSteps: 2000,
  /** Catch-up work done before the page gets a frame to paint the indicator. */
  catchUpSliceMs: 60,
  /** Sim time a live frame may carry over when it falls behind; the rest is dropped. */
  maxLiveBacklogMs: 120 * SECOND,
  /** Grove bounds: entities stay within ±half on both axes. */
  worldHalf: 46,
} as const;

/** Guards that keep a save from being lost by a bad load or import. */
export const SAVE_SAFETY = {
  /** Unreadable saves kept beside their slot, newest first, before a fresh start. */
  unreadableKept: 2,
  /** Bigger files are refused on import; a real save is a few tens of kB. */
  importMaxBytes: 5_000_000,
} as const;

export const OFFLINE = {
  defaultMode: 'capped' as const,
  defaultCapHours: 8,
  minCapHours: 1,
  maxCapHours: 720,
  defaultAllowDepartures: false,
} as const;
