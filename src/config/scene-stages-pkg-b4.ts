import type { SceneStage } from './story';

/**
 * Campaign graphics 4, package b4: stage data for testing this package's dressing, keyed by
 * scene id. Merged under the content files in config/scene-stages.ts (content wins).
 *
 * K11's tale scenes (chapter 4's "The Tale of the Four", with young Hazel on the jetty in the
 * third) are in scene-stages-hazel.ts now.
 *
 * K37, departures in the separate campaigns: `props.cocoon: 'show'` draws the soft fading
 * cocoon at the campaign's memorial spot and the flower on the last line; `grave: true`
 * holds the letterbox. Dawn & Dusk's reverting (chapter 3's opening, in both halves) and The
 * Hundred Days' Quiet and Grey Lamp endings.
 */
const DEPARTURE: SceneStage = { grave: true, props: { cocoon: 'show' } };

export const PKG_B4_STAGES: Readonly<Record<string, SceneStage>> = {
  'dawn-c3-open': DEPARTURE,
  'dusk-c3-open': DEPARTURE,
  'end-hundred-quiet-fold': DEPARTURE,
  'end-hundred-grey-fold': DEPARTURE,
};
