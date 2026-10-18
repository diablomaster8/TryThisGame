/**
 * The payoffs inside the Alice, Holmes and Hodja packs (Q66–Q95), from each quest's notes:
 * which variant scene replaces a scene, and which extra scenes play before or after a
 * step. They read only the pack's own flags (`q70-*`, `q78-*`, `q87-*`), which fun-quest
 * choices set; nothing here writes anything. `funRule` merges these into each quest's rule.
 */
import type { StoryRule } from './side-rule-kit';
import type { CampaignState } from './types';

type PackRule = Pick<StoryRule, 'variant' | 'before' | 'after'>;

/** Q70's choice, remembered by one of three flags. */
function q70(c: CampaignState): 'garden' | 'mirror' | null {
  if (c.flags['q70-garden']) return 'garden';
  if (c.flags['q70-mirror']) return 'mirror';
  return null;
}

/** Q78: Jem let go or owned up ('freed', 'owned'), or handed to Lestrade. */
const jemFree = (c: CampaignState) =>
  c.flags['q78-jem'] === 'freed' || c.flags['q78-jem'] === 'owned';

const contradicted = (c: CampaignState) =>
  Boolean(
    c.flags['q78-contradicted'] || c.flags['q79-contradicted'] || c.flags['q81-contradicted'],
  );

export const FUN_PACK_RULES: Record<string, PackRule> = {
  // Alice: the coat is the base scene; the garden and the mirror have their own.
  q71: {
    variant: (_w, c, scene) => {
      const v = q70(c);
      return scene === 'q71-witness' && v ? `q71-witness-${v}` : scene;
    },
  },
  q75: {
    variant: (_w, c, scene) => {
      const v = q70(c);
      return scene === 'q75-wake' && v ? `q75-wake-${v}` : scene;
    },
  },
  // Holmes: Jem's fate in Q78 brings the guide or Toby's nose (Q84) and the beekeeper's
  // boy or the stung Inspector (Q85); any contradiction earns the lens, else the cap.
  q84: {
    after: (_w, c, i) => {
      if (i !== 1 || c.flags['q78-jem'] === undefined) return [];
      return [jemFree(c) ? 'q84-var-guide' : 'q84-var-nose'];
    },
  },
  q85: {
    after: (_w, c, i) => {
      if (i !== 1 || c.flags['q78-jem'] === undefined) return [];
      return [jemFree(c) ? 'q85-var-jem' : 'q85-var-lestrade'];
    },
    before: (_w, c, i) => (i === 2 ? [contradicted(c) ? 'q85-var-loupe' : 'q85-var-cap'] : []),
  },
  // Hodja: the gift chosen in Q87 seats you as second judge (Q91) and comes back in Q95.
  q91: {
    variant: (_w, c, scene) =>
      scene === 'q91-judge' && c.flags['q87-gift'] === 'seat' ? 'q91-judge-seat' : scene,
  },
  q95: {
    after: (_w, c, i) => {
      const gift = c.flags['q87-gift'];
      return i === 2 && typeof gift === 'string' ? [`q95-gift-${gift}`] : [];
    },
  },
};
