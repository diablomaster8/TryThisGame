/**
 * HOT-3 (Maor, 2026-10-31): "It should always focus on the main character unless there is
 * dialogue and then it focuses on the talker." Both cameras aim at the point this returns:
 * the Keeper, or while a dialogue line is on screen, whoever speaks it. The narrator, the
 * Keeper's own lines and a speaker who is not in the scene all stay on the Keeper. When the
 * dialogue closes the speaker is null again, so the follow eases back to the Keeper.
 *
 * Picking a Nubbin (its stats sheet) is deliberately not an input: selecting never moves the
 * camera (HOT-1 aimed at the selected Nubbin; Maor found the view swinging away confusing).
 */

export interface Spot {
  x: number;
  z: number;
}

/**
 * The camera's subject. `speaker` is the dialogue line's speaker id (null when no dialogue is
 * open); `spotOf` finds a speaker in the scene, or null when they are not here or speak as the
 * Keeper. `talker` is true when the subject is a speaker rather than the Keeper.
 */
export function cameraSubject(
  keeper: Spot,
  speaker: string | null,
  spotOf: (who: string) => Spot | null,
): { at: Spot; talker: boolean } {
  if (!speaker || speaker === 'narrator' || speaker === 'you') return { at: keeper, talker: false };
  const at = spotOf(speaker);
  return at ? { at, talker: true } : { at: keeper, talker: false };
}

/**
 * The view shift to use with the stats sheet open (`clearShift`'s, which centres the subject in
 * the part the sheet leaves clear), or none when the sheet already leaves the centre clear by
 * `margin` of the view. The docked desktop sheet then moves nothing; a phone's bottom sheet
 * that reaches the Keeper still lifts the view.
 */
export function sheetShift(
  shift: { x: number; y: number },
  margin: number,
): { x: number; y: number } {
  // clearShift puts the sheet's left edge at (2x + 1) of the width, its top at (1 - 2y).
  const left = 2 * shift.x + 1;
  const top = 1 - 2 * shift.y;
  return left >= 0.5 + margin && top >= 0.5 + margin ? { x: 0, y: 0 } : shift;
}

/** Which Keeper's input moved last: 1 or 2. */
export type Mover = 1 | 2;

/**
 * R18 d2 (R0140): the Keeper the co-op camera follows when they are far apart is the one whose
 * input began moving most recently. `was` / `now` say who had input last frame / this frame; a
 * Keeper that has just started moving wins, otherwise the choice holds.
 */
export function lastMover(
  prev: Mover,
  was: { k1: boolean; k2: boolean },
  now: { k1: boolean; k2: boolean },
): Mover {
  const start1 = now.k1 && !was.k1;
  const start2 = now.k2 && !was.k2;
  if (start1 !== start2) return start1 ? 1 : 2;
  if (now.k1 !== now.k2) return now.k1 ? 1 : 2;
  return prev;
}

/** One view's size in world units, across the screen and up it. */
export interface ViewSize {
  w: number;
  h: number;
}

/**
 * Whether two spots fit in a view with a margin: their spread is turned into screen axes (yaw)
 * and the ground depth is foreshortened by the pitch, then compared with `fit` of the view.
 */
export function fitsView(
  a: Spot,
  b: Spot,
  yaw: number,
  pitch: number,
  view: ViewSize,
  fit: number,
) {
  const dx = b.x - a.x;
  const dz = b.z - a.z;
  const across = Math.abs(dx * Math.cos(yaw) - dz * Math.sin(yaw));
  const up = Math.abs(dx * Math.sin(yaw) + dz * Math.cos(yaw)) * Math.sin(pitch);
  return across <= view.w * fit && up <= view.h * fit;
}

export interface CoopFrame {
  /** What the camera aims at. */
  at: Spot;
  /** Both Keepers are in the frame (the midpoint), or only the active one. */
  framed: boolean;
  /** Zoom out one notch to fit them (never past the survey step). */
  notch: boolean;
}

/**
 * The co-op camera's subject. Close together: the midpoint, easing out one zoom notch when that
 * is what it takes to fit (`out` is the view one notch farther, or null when already at the
 * survey step). Far apart: whoever moved last (`mover`). `wasFramed` gives the margin hysteresis.
 */
export function coopFrame(
  k1: Spot,
  k2: Spot,
  mover: Mover,
  yaw: number,
  pitch: number,
  view: ViewSize,
  out: ViewSize | null,
  wasFramed: boolean,
  enter: number,
  exit: number,
): CoopFrame {
  const fit = wasFramed ? exit : enter;
  const mid = { x: (k1.x + k2.x) / 2, z: (k1.z + k2.z) / 2 };
  if (fitsView(k1, k2, yaw, pitch, view, fit)) return { at: mid, framed: true, notch: false };
  if (out && fitsView(k1, k2, yaw, pitch, out, fit)) return { at: mid, framed: true, notch: true };
  return { at: mover === 2 ? k2 : k1, framed: false, notch: false };
}
