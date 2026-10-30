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
