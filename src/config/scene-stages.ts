import type { SceneStage } from './story';
import { BEETLE_STAGES } from './scene-stages-beetle';
import { DAWNDUSK_STAGES } from './scene-stages-dawndusk';
import { HAZEL_STAGES } from './scene-stages-hazel';
import { HUNDRED_STAGES } from './scene-stages-hundred';
import { LOGGED_STAGES } from './scene-stages-logged';

/**
 * Staging authored beside the scripts rather than in them (campaign graphics C1): a scene's
 * own `stage` wins, field by field, over its entry here. Keyed by scene id. One file per
 * campaign, merged here. Package E's `E_STAGES` (tuning-e.ts) sits under these: where a
 * field is set in both, this one wins, so entries leave out what E already seats.
 */
export const SCENE_STAGES: Readonly<Record<string, SceneStage>> = {
  ...HAZEL_STAGES,
  ...HUNDRED_STAGES,
  ...LOGGED_STAGES,
  ...BEETLE_STAGES,
  ...DAWNDUSK_STAGES,
};
