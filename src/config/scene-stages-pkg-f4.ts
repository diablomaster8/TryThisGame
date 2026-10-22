import type { SceneStage } from './story';

/**
 * Campaign graphics 4, wave 0: K15's grave moments (held letterbox, HUD hidden, a slow push),
 * keyed by scene id. Merged under the content files in config/scene-stages.ts (content wins);
 * the content wave should move these into the content files.
 */
const GRAVE: SceneStage = { grave: true };

const HAZEL_ENDINGS = [
  'hazels-grove',
  'eternal-dawn',
  'shadow-keeper',
  'moss-sleeps',
  'wild-grove',
  'empty-lantern',
  'collector',
  'long-road',
];
const STORY_ENDINGS = [
  'hundred-bright-fold',
  'hundred-the-fold',
  'hundred-quiet-fold',
  'hundred-grey-fold',
  'logged-everyone-wakes',
  'logged-quiet-exit',
  'logged-one-short',
  'beetle-open-sky',
  'beetle-two-as-one',
  'beetle-steady-rain',
  'dawn-half-day',
  'dawn-wrong-cause',
  'dawn-whole-day',
  'dusk-half-day',
  'dusk-wrong-cause',
  'dusk-whole-day',
];

/** Hazel's turning points: the falls stop, Moss fades, Hazel comes home smaller. */
const TURNS = ['c10-falls', 'c10-moss-fades', 'c10-moss-mourned', 'c11-open', 'c11-moss-passed'];

export const PKG_F4_STAGES: Readonly<Record<string, SceneStage>> = Object.fromEntries([
  ...TURNS.map((id) => [id, GRAVE]),
  ...HAZEL_ENDINGS.map((e) => [`end-${e}-last`, GRAVE]),
  ...STORY_ENDINGS.map((e) => [`end-${e}`, GRAVE]),
]);
