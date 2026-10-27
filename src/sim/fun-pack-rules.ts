/**
 * The payoffs inside the fun packs, from each quest's notes: which variant scene replaces a
 * scene, and which extra scenes play before or after a step. Python and Bean (Q4, Q6, Q9,
 * Q27), Sunny (Q32–Q45), Alice, Holmes and Hodja (Q66–Q95). Each reads only its own pack's
 * flags (`q04-*`, `q31-*`…`q45-*`, `q70-*`, `q78-*`, `q87-*`), which fun-quest choices set,
 * and never a campaign flag; nothing here writes anything. `funRule` merges these into each
 * quest's rule.
 */
import type { StoryRule } from './side-rule-kit';
import { sceneById } from './story-scenes';
import type { CampaignState } from './types';

type PackRule = Pick<StoryRule, 'variant' | 'before' | 'after'>;

/** Q70's choice, remembered by one of three flags; 'q70-coat' is the base scene, so null. */
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

/** A flag's value as a scene-id suffix (booleans read 'true' / 'false'), or undefined. */
function flagText(c: CampaignState, flag: string): string | undefined {
  const v = c.flags[flag];
  return v === undefined ? undefined : String(v);
}

/**
 * Sunny's short payoff scenes: for each listed flag that is set, `<flag>-is-<value>`, in
 * list order. Only scenes the scripts hold: a missing one would hold the step forever.
 */
function payoffScenes(c: CampaignState, flags: readonly string[] | undefined): string[] {
  const out: string[] = [];
  for (const f of flags ?? []) {
    const v = flagText(c, f);
    const id = `${f}-is-${v}`;
    if (v !== undefined && sceneById(id)) out.push(id);
  }
  return out;
}

/**
 * Sunny (Q31–Q45). Mirrors QUESTS_SUNNY_VARIANT_FLAGS and QUESTS_SUNNY_PAYOFFS in
 * content/quests-sunny.ts, copied here so the script stays out of the main bundle
 * (tests/sim/fun-pack-rules.test.ts checks the copies agree).
 */
export const SUNNY_VARIANT_FLAGS: Readonly<Record<string, string>> = {
  'q37-sun-keeper': 'q37-calm',
  'q37-finale': 'q37-calm',
  'q45-practice-done': 'q31-deal',
  'q45-complete': 'q45-hedge',
};

type Payoffs = { before?: Record<number, string[]>; after?: Record<number, string[]> };

export const SUNNY_PAYOFFS: Readonly<Record<string, Payoffs>> = {
  q32: { before: { 2: ['q32-first', 'q32-inspector'] } },
  q33: { before: { 2: ['q33-drink', 'q33-dabney', 'q33-label'] } },
  q34: { before: { 2: ['q34-cheer', 'q34-lap'] } },
  q35: { before: { 1: ['q35-answer'] } },
  q36: { before: { 2: ['q36-promise', 'q36-goose'] } },
  q38: { before: { 2: ['q38-plea', 'q38-lead'] } },
  q39: { after: { 0: ['q31-rook'], 3: ['q39-credit'] }, before: { 1: ['q39-cart'] } },
  q40: { before: { 2: ['q40-tube', 'q40-rescue', 'q40-tickets'] } },
  q41: { before: { 1: ['q41-entrance'] } },
  q42: { after: { 2: ['q42-believe'] } },
  q43: { after: { 3: ['q43-extras', 'q43-mags'] } },
  q44: {
    after: { 0: ['q35-spirit'] },
    before: { 1: ['q44-outfit'], 2: ['q44-order', 'q44-method'] },
  },
  q45: { after: { 0: ['q41-deal'] }, before: { 1: ['q45-talk'] } },
};

/** The variant for a Sunny scene: `<scene>-<value>` of its flag (missing ones fall back). */
function sunnyVariant(c: CampaignState, scene: string): string {
  // Q39's poster remembers Q35's cry on the board, once Q35 is done.
  if (scene === 'q39-complete' && (c.fun.q35?.status === 'done' || c.flags['q35-spirit']))
    return 'q39-complete-poster';
  const flag = SUNNY_VARIANT_FLAGS[scene];
  const v = flag ? flagText(c, flag) : undefined;
  return v === undefined ? scene : `${scene}-${v}`;
}

function sunnyRule(quest: string): PackRule {
  const p = SUNNY_PAYOFFS[quest];
  return {
    variant: (_w, c, scene) => sunnyVariant(c, scene),
    ...(p?.before && { before: (_w, c, i) => payoffScenes(c, p.before?.[i]) }),
    ...(p?.after && { after: (_w, c, i) => payoffScenes(c, p.after?.[i]) }),
  };
}

const SUNNY_RULES: Record<string, PackRule> = Object.fromEntries(
  [
    'q32',
    'q33',
    'q34',
    'q35',
    'q36',
    'q37',
    'q38',
    'q39',
    'q40',
    'q41',
    'q42',
    'q43',
    'q44',
    'q45',
  ].map((q) => [q, sunnyRule(q)]),
);

export const FUN_PACK_RULES: Record<string, PackRule> = {
  // Python: what you did with the go (Q4), how the Nubbins took the knock (Q6), and the
  // ruling (Q9) each close their quest their own way (SR-20261027-1270, 1271, 1283).
  q04: {
    variant: (_w, c, scene) => {
      if (scene !== 'q04-complete') return scene;
      if (c.flags['q04-kept']) return 'q04-complete-kept';
      return c.flags['q04-shared'] ? 'q04-complete-shared' : scene;
    },
  },
  q06: {
    variant: (_w, c, scene) => {
      if (scene !== 'q06-complete') return scene;
      if (c.flags['q06-shouted']) return 'q06-complete-shouted';
      if (c.flags['q06-laughed']) return 'q06-complete-laughed';
      return c.flags['q06-knocked'] ? 'q06-complete-knocked' : scene;
    },
  },
  q09: {
    variant: (_w, c, scene) => {
      if (scene !== 'q09-complete') return scene;
      const ruling = c.flags['q09-ruling'];
      if (ruling === 'themselves') return 'q09-complete-themselves';
      return ruling === 'both' || ruling === 'neither' ? 'q09-complete-pebble' : scene;
    },
  },
  // Bean: wanting to tell the Warden (Q27 step 1) and then keeping quiet; Mr. Tweed holds
  // you to it (SR-20261027-1285).
  q27: {
    variant: (_w, c, scene) =>
      scene === 'q27-complete' && c.flags['q27-wanted-to-tell'] === true
        ? 'q27-complete-told'
        : scene,
  },
  // Sunny: every choice pays off inside the pack (SR-20261027-1304).
  ...SUNNY_RULES,
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
  // Q81's own contradiction earns Holmes's admission after the kite.
  q81: {
    after: (_w, c, i) => (i === 2 && c.flags['q81-contradicted'] ? ['q81-var-children'] : []),
  },
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
