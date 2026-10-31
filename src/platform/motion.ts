/**
 * The one place that reads `prefers-reduced-motion` (R0500 / TECH-59). Everything that moves
 * asks `reducedMotion()`, which combines the player's Reduced motion setting with the system
 * query. The query object is live, so a system change is seen at the next call; the game
 * hands over the setting each frame with `setMotionPref`. Until a save is loaded (the title
 * screen) the setting counts as "system". A lint rule bans the media query anywhere else.
 */

export type MotionPref = 'system' | 'on' | 'off';

let pref: MotionPref = 'system';
let query: MediaQueryList | null | undefined;

function systemQuery(): MediaQueryList | null {
  if (query === undefined) {
    try {
      query =
        typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
    } catch {
      query = null;
    }
  }
  return query;
}

/** The system's prefers-reduced-motion, live. */
export function systemReducedMotion(): boolean {
  return !!systemQuery()?.matches;
}

/** The player's Settings choice (cheap; the game calls it every frame). */
export function setMotionPref(p: MotionPref | undefined): void {
  pref = p ?? 'system';
}

/** True when motion should be calmed: the setting says on, or says system and the system asks. */
export function reducedMotion(): boolean {
  return pref === 'on' || (pref === 'system' && systemReducedMotion());
}
