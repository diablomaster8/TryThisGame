import type { SceneStage } from './story';

/**
 * Staging authored beside the scripts rather than in them (campaign graphics C1): a scene's
 * own `stage` wins, field by field, over its entry here. Keyed by scene id. Content passes
 * may move entries into the scripts; nothing reads both differently.
 */
export const SCENE_STAGES: Readonly<Record<string, SceneStage>> = {
  // The longest night: the vigil is lit by lanterns only.
  'c10-open': { place: 'hill', hour: 22.5, shot: { kind: 'wide' } },
};
