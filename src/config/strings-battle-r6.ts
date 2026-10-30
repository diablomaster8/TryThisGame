/**
 * Player-facing text for lane C round 6's battle work (see `tuning-battle-r6.ts`).
 */
export const LADDER_TEXT = {
  title: 'Dojo Ladder',
  belts: ['White', 'Yellow', 'Green', 'Brown', 'Black'] as const,
  belt: (n: number) =>
    n <= 0 ? 'No belt yet' : `${['White', 'Yellow', 'Green', 'Brown', 'Black'][n - 1]} belt`,
  bout: (belt: string, step: number, of: number) => `${belt} belt · bout ${step} of ${of}`,
  hat: 'Black Belt',
  climbed: (belt: string) => `${belt} belt! Bow to the mat.`,
  top: 'Black belt. The mat bows back.',
};

/** Fusion burst (FIGHT-95). */
export const FUSION_TEXT = {
  button: 'Fuse!',
  help: 'Your partners fuse into one for three turns. Once a bout.',
  on: (who: string) => `Fusion! ${who} are one very wobbly Nubbin now.`,
  off: (who: string) => `${who} pop apart, a bit dizzy and very pleased.`,
};

/** Pass-and-play friendly bouts (FIGHT-96). */
export const FRIENDLY_TEXT = {
  title: 'Friendly bout (pass and play)',
  help: 'Two Keepers, one device. No prizes, just a sticker and bragging rights.',
  codes: 'Paste up to three share codes for Keeper 2 (or leave empty to split the Grove)',
  start: 'Start a friendly',
  none: 'Two Keepers need at least two hatched Nubbins, or a share code.',
  pass: 'Keeper 2, your turn! Keeper 1, no peeking.',
  ready: "I'm Keeper 2: show my moves",
  picking: (who: string) => `Keeper 2 picks for ${who}.`,
  sticker: 'Good game! A sticker for both of you.',
};
