import type { SceneStage } from './story';

/**
 * Campaign graphics 4, package u4: stage data for testing this package's dressing, keyed by
 * scene id. Merged under the content files in config/scene-stages.ts (content wins).
 * The content wave should keep these: Logged In's ch5 opening is a close shot on the message
 * board with the board on the item card (K29), and the Beetle Road's ch2 opening is a close
 * shot on the guard house wall where the notices hang.
 */
export const PKG_U4_STAGES: Readonly<Record<string, SceneStage>> = {
  'l-c5-open': { shot: { kind: 'close', focus: ['board'], fit: false }, item: 'board' },
  'b-c2-open': { shot: { kind: 'close', focus: ['guardhouse-bench'], fit: false } },
};
