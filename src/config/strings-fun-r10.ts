/**
 * Lane E r10, fun helper: player-facing text for the cross-world callback badges (R0361,
 * FUN-72). Adults only; shown on the Keeper's profile beside the other badges.
 */
import type { CallbackBadgeId } from '../sim/callback-badges';

export const CALLBACK_BADGE_TEXT: {
  heading: string;
  help: string;
  badges: Record<CallbackBadgeId, { title: string; blurb: string }>;
} = {
  heading: 'Cross-world',
  help: 'Habits the heroes out there grew out of. Read from the Multiverse; nothing here changes.',
  badges: {
    notRodent: {
      title: 'Not a rodent',
      blurb: 'Finished Cap’s line. Sam says “Nubbin” now. Mostly.',
    },
    notFish: {
      title: 'Not fish',
      blurb: 'Finished DB20. It took him six years. He got there.',
    },
    gerald: {
      title: 'Gerald',
      blurb: 'Named a Nubbin Gerald after a certain ant. Gerald does not like being ignored.',
    },
  },
};
