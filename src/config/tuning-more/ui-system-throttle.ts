// was tuning-r13d3; review pass R13 D3
/** Lane D round 13 tunables (helper 3). */

/** R0476: state-scanning systems that run at most this often (sim ms), by system id. */
export const SYSTEM_THROTTLE = {
  everyMs: 500,
  ids: ['landmarks', 'collectibles', 'seasons', 'photo-spots', 'traces', 'world-hints'],
} as const;
