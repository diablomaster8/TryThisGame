import type { SceneStage } from './story';

/**
 * Campaign graphics 4, package e4: stage data for testing this package's dressing, keyed by
 * scene id. Merged under the content files in config/scene-stages.ts (content wins).
 *
 * The content wave should author these in the content files:
 * - K18 `props.windowFigures: 'show'` on night or dusk scenes with houses in frame: The
 *   Hundred Days ch9-10's Fold, Dawn & Dusk's green, and Hazel's cottage at night.
 * - K19 needs no data except that the ch10 vigil holds `pondIce: 'hide'` (before the ice).
 * - K42 `props.risingLanterns: 'show'` on `c12-close` and the Hazel's Grove ending (`end-hazels-grove`, `-open`, `-last`).
 * - K43 `props.wreath: 'show'` on Hazel scenes that look at the cottage (the season draws
 *   the decor: wreath in winter, blossoms in spring, gourds in autumn).
 * - K45 `props.gateFrost: 'show'` on `c11-gate` (the scene id also triggers it).
 * - K46 `props.bootUp: 'show'` on `l-c1-open` (the scene id also triggers it).
 * - K28 shows from Hazel chapter 3 on; `props.lanternHeads: 'hide'` turns it off.
 */
const FIGURES: SceneStage = { props: { windowFigures: 'show' } };
const COTTAGE_NIGHT: SceneStage = { props: { windowFigures: 'show', wreath: 'show' } };
const WREATH: SceneStage = { props: { wreath: 'show' } };

export const PKG_E4_STAGES: Readonly<Record<string, SceneStage>> = {
  // K18
  'c9-partner': COTTAGE_NIGHT,
  'c9-close': COTTAGE_NIGHT,
  'h-c9-open': FIGURES,
  'h-c10-close': FIGURES,
  'dusk-c1-open': FIGURES,
  'dusk-c1-houses': FIGURES,
  // K19: the vigil is before the ice.
  'c10-vigil': { props: { pondIce: 'hide' } },
  // K42
  'c12-close': { props: { risingLanterns: 'show' } },
  // The ending's own ids (the "Hazel's Grove" ending is `end-hazels-grove`).
  'end-hazels-grove': { props: { risingLanterns: 'show' } },
  'end-hazels-grove-open': { props: { risingLanterns: 'show' } },
  'end-hazels-grove-last': { props: { risingLanterns: 'show' } },
  // K43: spring and autumn cottage scenes (winter's are above).
  'c1-close': WREATH,
  'c2-open': WREATH,
  'c8-close': WREATH,
  // K45
  'c11-gate': { props: { gateFrost: 'show' } },
  // K46
  'l-c1-open': { props: { bootUp: 'show' } },
};
