/**
 * Lane A (FUN) player-facing text. Re-exported from `strings.ts` so every name can still be
 * found from one place.
 */

/**
 * R0305 (FUN-16): the objective chip once a chapter's goal is met, in the narrator's voice,
 * one per chapter (they wrap round), so the wait before the story moves on reads as a
 * breather, not a loading screen. The sprout band gets one plain line.
 */
export const GOAL_DONE_TEXT = {
  lines: [
    'Done ✓ Have a sit with them. Something is on its way.',
    'Done ✓ Stretch your legs. The Grove is getting the next bit ready.',
    'Done ✓ Nothing needs doing for a moment. Enjoy that.',
    'Done ✓ Pet someone. The story is putting its boots on.',
    'Done ✓ A breather. Somebody will be along shortly.',
    'Done ✓ Shake a tree, if you like. The next part is coming.',
    'Done ✓ Go and see who is hungry. The story will find you.',
    'Done ✓ The Grove is quiet. It won’t be for long.',
    'Done ✓ Rest a while. You have earned it.',
    'Done ✓ Stay close to the lanterns. The night is not over yet.',
    'Done ✓ Breathe. The morning is nearer than it looks.',
    'Done ✓ Look around you. All this is yours to keep.',
  ],
  sprout: 'You did it! Wait and see what comes next.',
} as const;

export function goalDoneLine(chapter: number, sprout: boolean): string {
  if (sprout) return GOAL_DONE_TEXT.sprout;
  const l = GOAL_DONE_TEXT.lines;
  return l[(((chapter - 1) % l.length) + l.length) % l.length]!;
}
