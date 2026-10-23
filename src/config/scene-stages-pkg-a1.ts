import type { SceneStage, StageCast } from './story';

/**
 * Campaign graphics 4, package a1: stage data for testing this package's dressing, keyed by
 * scene id. Merged under the content files in config/scene-stages.ts (content wins).
 *
 * `c12-open` ("Every Keeper is here") puts the valley's Keepers on the festival ring with
 * Hazel among them, so the heads turn to her when she speaks (K6) and the ring's Nubbins look
 * on (K41); her sad line plays the look-down gesture (K7). The content wave should keep it.
 */
const RING_A1: StageCast[] = [
  'fern',
  'marina',
  'sparks',
  'clover',
  'pixel',
  'luna',
  'ember',
  'byte',
  'dusty',
  'nova',
].map((who, i) => ({ who, mark: `festival-${i + 1}` }));

export const PKG_A1_STAGES: Readonly<Record<string, SceneStage>> = {
  'c12-open': {
    cast: [...RING_A1, { who: 'hazel', mark: 'festival-11' }],
  },
};
