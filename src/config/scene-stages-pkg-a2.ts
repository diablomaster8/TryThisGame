import type { SceneStage } from './story';

/**
 * Campaign graphics 4, package a2: stage data for testing this package's dressing, keyed by
 * scene id. Merged under the content files in config/scene-stages.ts (content wins).
 */
export const PKG_A2_STAGES: Readonly<Record<string, SceneStage>> = {};

/**
 * K5: the walk-ons, `scene id -> cast who -> mark to walk on from`. The stager reads this for
 * any cast entry that has no `from` of its own (content's `cast` arrays win over an overlay's,
 * so the marks cannot ride in `PKG_A2_STAGES`). The content wave should move each into its
 * cast entry as `from`. `lane-*` marks are the stager's own (`CG4_A2.fromMarks`).
 */
export const PKG_A2_FROM: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  // Corvin comes up the lane to the gate (Hazel 2), and returns to it (Hazel 11).
  'c2-corvin': { corvin: 'lane-west' },
  'c11-gate': { corvin: 'lane-west' },
  'end-collector-kept': { corvin: 'lane-west' },
  // Hazel walks back in through the gate.
  'c11-open': { hazel: 'lane-south' },
  // Two festival arrivals, late to the ring: Ember from the cottage step, Dusty from the gate.
  'c12-open': { ember: 'step', dusty: 'gate-inside' },
};
