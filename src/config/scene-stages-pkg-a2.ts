import type { SceneStage } from './story';

/**
 * Campaign graphics 4, package a2: stage data for testing this package's dressing, keyed by
 * scene id. Merged under the content files in config/scene-stages.ts (content wins).
 */
export const PKG_A2_STAGES: Readonly<Record<string, SceneStage>> = {};

/**
 * K5: the walk-ons, `scene id -> cast who -> mark to walk on from`, for any cast entry that has
 * no `from` of its own. Empty now: every walk-on is a `from` on its cast entry in the content
 * files (the `lane-*` marks are in stage-marks.ts).
 */
export const PKG_A2_FROM: Readonly<Record<string, Readonly<Record<string, string>>>> = {};
