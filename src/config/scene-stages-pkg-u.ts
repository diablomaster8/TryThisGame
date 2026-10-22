import type { SceneStage } from './story';

/**
 * Campaign graphics 2, package u: stage data for testing this package's dressing, keyed by
 * scene id. Merged under the content files in config/scene-stages.ts (content wins).
 * The content wave should keep the `item` fields (M9) in its own stage files.
 */
export const PKG_U_STAGES: Readonly<Record<string, SceneStage>> = {
  'c1-letter': { item: 'letter' },
  'c8-close': { item: 'notebook' },
  'c10-ledge': { item: 'stone' },
  'b-c5-open': { item: 'vane-notebook' },
  'l-c7-open': { item: 'recording' },
};
