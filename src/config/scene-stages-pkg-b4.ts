import type { SceneStage } from './story';

/**
 * Campaign graphics 4, package b4: stage data for testing this package's dressing, keyed by
 * scene id. Merged under the content files in config/scene-stages.ts (content wins).
 *
 * K11, the tale scenes: Moss telling the past (chapter 4's "The Tale of the Four", three
 * scenes). `tale: true` gives the warm washed grade with a soft vignette and hides every
 * present-day Keeper but the cast. Young Hazel is the cast's `hazel` entry (the content wave
 * should seat her beside Moss in c4-tale-3, where he says "I sat beside her a whole winter":
 * `{ who: 'hazel', mark: 'shore-jetty', face: 'moss', pose: 'sit' }`); a content `cast`
 * replaces any overlay's, so it cannot be added from here.
 *
 * K37, departures in the separate campaigns: `props.cocoon: 'show'` draws the soft fading
 * cocoon at the campaign's memorial spot and the flower on the last line; `grave: true`
 * holds the letterbox. Dawn & Dusk's reverting (chapter 3's opening, in both halves) and The
 * Hundred Days' Quiet and Grey Lamp endings.
 */
const TALE: SceneStage = { tale: true };
const DEPARTURE: SceneStage = { grave: true, props: { cocoon: 'show' } };

export const PKG_B4_STAGES: Readonly<Record<string, SceneStage>> = {
  'c4-tale': TALE,
  'c4-tale-2': TALE,
  'c4-tale-3': TALE,
  'dawn-c3-open': DEPARTURE,
  'dusk-c3-open': DEPARTURE,
  'end-hundred-quiet-fold': DEPARTURE,
  'end-hundred-grey-fold': DEPARTURE,
};
