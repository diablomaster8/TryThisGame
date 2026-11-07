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
  stages: {
    egg: 'Egg',
    child: 'Child',
    first: 'First form',
    second: 'Second form',
    adult: 'Adult',
  },
  invalid: (why: string) => `Cannot use this pick (${why}).`,
};

/** The creator gallery: a full-screen browse of every version of every pet. */
export const GALLERY_TEXT = {
  open: 'Gallery',
  title: 'Creator gallery',
  filter: 'Filter',
  filterHint: 'Filter by name',
  tabs: { chao: 'Nubbin', pocket: 'Pocket', digi: 'Digital' },
  none: 'Nothing matches.',
  count: (n: number) => `${n} shown`,
  selected: (label: string) => `Selected: ${label}`,
  pickFirst: 'Tap a tile to choose it.',
  groups: {
    chaoEarly: 'Nubbin · Egg and child',
    chaoFirst: 'Nubbin · First form',
    chaoSecond: 'Nubbin · Second form',
    chaoRadiant: 'Nubbin · Chaos tier',
    chaoEternal: 'Nubbin · Eternal',
    chaoLooks: 'Nubbin · Character looks',
    chaoColours: 'Nubbin · Colours and jewels',
    chaoVariants: 'Nubbin · Shiny and two-tone',
    pocketBaby: 'Pocket · Baby',
    pocketAdult: 'Pocket · Adult',
    pocketRadiant: 'Pocket · Radiant',
    digiBaby: 'Digital · Baby',
    digiAdult: 'Digital · Grown',
  },
  shinyChild: 'Shiny child',
  twoToneChild: 'Two-tone child',
  childOf: (colour: string) => `${colour} child`,
  lookOn: (look: string) => `${look} look`,
  chaosOf: (name: string) => `Chaos · ${name}`,
  eternalOf: (band: string) => `Eternal ${band}`,
  adultOf: (name: string) => `${name} (adult)`,
  radiantOf: (name: string) => `${name} (radiant)`,
};
