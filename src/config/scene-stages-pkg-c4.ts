import type { SceneStage } from './story';

/**
 * Campaign graphics 4, package c4: stage data for testing this package's dressing, keyed by
 * scene id. Merged under the content files in config/scene-stages.ts (content wins).
 *
 * K10's indoor scenes (the guard house counter, the Fold's house) are staged in the content
 * files now (scene-stages-beetle.ts, scene-stages-hundred.ts).
 */
export const PKG_C4_STAGES: Readonly<Record<string, SceneStage>> = {};
