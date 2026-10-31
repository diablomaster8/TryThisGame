/** Player-facing text for lane D round 8 (perf/TECH). Re-exported from `strings.ts`. */

/** TECH-09/52: the device tier and the Quality setting. */
export const QUALITY_TEXT = {
  label: 'Quality',
  help: 'Full 3D starts at this level and lowers itself if frames run slow. Takes effect on reload.',
  tier: { low: 'Low', mid: 'Medium', high: 'High' },
  auto: (tier: string) => `Auto (${tier})`,
  /** Debug panel: the detected tier and what it was read from. */
  debug: (tier: string, why: string) => `tier ${tier} (${why})`,
} as const;

/** TECH-54: the debug panel's speed note when the steps cannot keep up. */
export const FAST_TIME_TEXT = {
  behind: (scale: number) => `×${scale} (behind)`,
} as const;
