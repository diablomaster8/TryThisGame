import type { SceneStage } from './story';

/**
 * Campaign graphics 2, package w: stage data for testing this package's dressing, keyed by
 * scene id. Merged under the content files in config/scene-stages.ts (content wins, field by
 * field, so a scene whose content sets `props` must name `pondIce` there itself).
 *
 * - C7: Hazel's chapter 10 from the frost line (`c10-open`, "a skin of ice on the water") and
 *   the winter that follows in chapter 11 hold the pond's ice.
 * - C8: the Hush's walk down the mountain in The Hundred Days chapter 9 frames the colossus
 *   (`h-c9-mountain`, a variant scene, is for the content wave to give the same focus).
 */
const ICE: SceneStage = { props: { pondIce: 'show' } };

const C10 = [
  'c10-open',
  'c10-sable-watch',
  'c10-vigil',
  'c10-vigil-wisp',
  'c10-lull',
  'c10-falls',
  'c10-bearer-sable',
  'c10-bearer-moss',
  'c10-ledge',
  'c10-edge',
  'c10-kept',
  'c10-safe-sable',
  'c10-safe-moss',
  'c10-wisp',
  'c10-moss-walks',
  'c10-moss-walks-bearer',
  'c10-bank-wisp',
  'c10-bank-moss-returned',
  'c10-bank-moss-gone',
  'c10-dawn',
  'c10-moss-stays',
  'c10-moss-fades',
  'c10-moss-mourned',
  'c10-moss-light',
  'c10-close',
  'c10-bramble',
  'c11-open',
  'c11-moss-here',
  'c11-moss-kept',
  'c11-moss-gone',
  'c11-moss-passed',
  'c11-sable',
  'c11-cold-hands',
  'c11-close',
];

/** The Hush comes down the mountain: the colossus is framed with the Keeper, far enough back to take it whole. */
const HUSH_SHOT: SceneStage = { shot: { kind: 'wide', focus: ['you', 'hush'] } };

export const PKG_W_STAGES: Readonly<Record<string, SceneStage>> = {
  ...Object.fromEntries(C10.map((id) => [id, ICE])),
  'h-c9-open': HUSH_SHOT,
};
