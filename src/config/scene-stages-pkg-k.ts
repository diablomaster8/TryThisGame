import { BEETLE_STAGES } from './scene-stages-beetle';
import { DAWNDUSK_STAGES } from './scene-stages-dawndusk';
import { HUNDRED_STAGES } from './scene-stages-hundred';
import { LOGGED_STAGES } from './scene-stages-logged';
import type { StageSet } from './stage-sets';
import type { SceneStage } from './story';

/**
 * Campaign graphics 2, package k: stage data for this package's dressing, keyed by scene
 * id. Merged under the content files in config/scene-stages.ts (content wins). It gives
 * every staged scene of the four separate campaigns its `set` (H3), so the Grove-only
 * buildings hide (config/stage-sets.ts), and the Beetle Road's banners and cart (M4).
 * The content wave should keep: `set` on every scene of its storyline, `props.banners` and
 * `props.cart` on the Beetle Road's ch1, ch2 and ch5 scenes.
 */
function setFor(set: StageSet, stages: Readonly<Record<string, SceneStage>>) {
  const out: Record<string, SceneStage> = {};
  for (const id of Object.keys(stages)) out[id] = { set };
  return out;
}

/** The Beetle Road's props: banners from ch1, the cart shut in ch2, the tarp off in ch5. */
const BEETLE_PROPS: Record<string, NonNullable<SceneStage['props']>> = {
  'b-c1-open': { banners: 'show' },
  'b-c1-close': { banners: 'show' },
  'b-c2-open': { banners: 'show', cart: 'shut' },
  'b-c2-close': { banners: 'show', cart: 'shut' },
  'b-c5-open': { banners: 'show', cart: 'open' },
  'b-c5-close': { banners: 'show', cart: 'open' },
};

const beetle = setFor('beetle', BEETLE_STAGES);
for (const [id, props] of Object.entries(BEETLE_PROPS)) beetle[id] = { ...beetle[id], props };

export const PKG_K_STAGES: Readonly<Record<string, SceneStage>> = {
  ...setFor('fold', HUNDRED_STAGES),
  ...setFor('logged', LOGGED_STAGES),
  ...beetle,
  ...setFor('dawndusk', DAWNDUSK_STAGES),
};
