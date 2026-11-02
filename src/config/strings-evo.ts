import type { StageKey } from '../sim/growth-stage';

/**
 * Lane F r11 (EVO): the evolution ladder's words: stage names and icons for the stats sheet,
 * the away screen and celebration lines for the later stages, and the creator picker.
 */
export const STAGE_NAMES: Record<StageKey, string> = {
  egg: 'Egg',
  hatchling: 'Hatchling',
  young: 'Young',
  grown: 'Grown',
  prime: 'Prime',
  peak: 'Peak',
  radiant: 'Radiant',
  eternal: 'Eternal',
};

/** One icon per stage, always shown beside the name (never colour alone). */
export const STAGE_ICONS: Record<StageKey, string> = {
  egg: '🥚',
  hatchling: '🌱',
  young: '🌿',
  grown: '🌳',
  prime: '🌟',
  peak: '👑',
  radiant: '✨',
  eternal: '♾️',
};

export const EVO_TEXT = {
  stageLabel: 'Stage',
  stageOf: (index: number, total: number) => `Stage ${index} of ${total}`,
  /** The Chao line's top stage has its own name; other lines say Radiant. */
  chaosTier: 'Chaos-tier',
  awaySecond: (name: string, type: string) => `${name} took a second form: ${type}.`,
  awayGrew: (name: string, species: string) => `${name} grew into ${species}.`,
  awayAscended: (name: string, tier: string) => `${name} reached ${tier}!`,
  ascendedTitle: (name: string) => `${name} shines!`,
  ascendedLine: (tier: string) => `${tier}: the top of the ladder`,
  secondTitle: (name: string) => `${name} grew again!`,
  grewTitle: (name: string) => `${name} evolved!`,
  stageReached: (stage: string, index: number, total: number) =>
    `${stage} · Stage ${index} of ${total}`,
};

/** The creator picker (Maor only), opened by the creator code in the roster's code box. */
export const CREATOR_TEXT = {
  unlocked: 'Creator picker unlocked.',
  open: 'Creator',
  title: 'Creator picker',
  family: 'Family',
  species: 'Species',
  stage: 'Stage',
  band: 'Alignment',
  type: 'Type',
  second: 'Second type',
  egg: 'Egg colour',
  tone: 'Two-tone',
  shiny: 'Shiny',
  look: 'Character look',
  none: 'None',
  grant: 'Grant new',
  transform: 'Transform selected',
  noSelection: 'Select a Nubbin first.',
  full: 'The roster is full.',
  done: (name: string) => `${name} is ready.`,
  families: { chao: 'Nubbin', pocket: 'Pocket line', digi: 'Digital line' },
};
