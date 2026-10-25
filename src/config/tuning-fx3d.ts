/**
 * Full 3D tunables from the review fixes of 2026-10-25 (the 3D fix agent's own file, so the
 * shared `tuning.ts` stays untouched).
 */

/**
 * The 3D Expedition's chase camera on a tall screen (aspect under 1). In portrait the
 * landscape framing left the runner tiny at the far left with the lower 40% of the screen
 * empty grass. Here the lens frames `minSpan` units across (less than landscape's 6, so the
 * runner is larger), the runner sits `aheadShare` of the half-width left of centre (about a
 * third of the way in, with half the screen still showing what is coming), and the track
 * sits `trackAt` of the way down the screen, so the near grass takes a third, not two fifths.
 */
export const EXPEDITION3D_PORTRAIT = {
  minSpan: 4.8,
  aheadShare: 0.3,
  trackAt: 0.7,
} as const;

/**
 * The player's avatar in Full 3D: Hazel's grandchild (fx-rules, the shared Keeper decision).
 * Its own height against the trainers' `GROVE3D.keeperHeight` (a child, a little shorter),
 * and the colours that are its own whatever role is picked: hair, skin, eyes, the leaf clip.
 */
export const GRANDCHILD3D = {
  heightShare: 0.9,
  hair: '#b4562c',
  hairShade: '#8e3e1e',
  skin: '#f6caa4',
  blush: '#f29a8a',
  iris: '#3f7a4a',
  freckle: '#c98a62',
  leaf: '#5aa84a',
  leafVein: '#3a7a32',
} as const;
