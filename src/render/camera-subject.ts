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
