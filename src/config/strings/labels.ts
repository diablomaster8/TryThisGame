// Core labels: names, stats, stages, types, critters, hats, eggs, personality, shop, mood.
import { MORE_CRITTER_LABELS } from '../strings-look';

export const NAMES = {
  game: 'Grove',
  creature: 'Nubbin',
  creaturePlural: 'Nubbins',
  garden: 'Grove',
  currency: 'Shells',
  smallAnimals: 'Critters',
  statCrystals: 'Essences',
  alignmentSun: 'Sun',
  alignmentMoon: 'Moon',
  alignmentNeutral: 'Neutral',
  eternal: 'Eternal',
  player: 'Keeper',
  playerSun: 'Sun Keeper',
  playerMoon: 'Moon Keeper',
} as const;

/** Random names for new Nubbins. The player can rename them. */
export const NUBBIN_NAMES = [
  'Pip',
  'Momo',
  'Bibi',
  'Tuft',
  'Nono',
  'Kiki',
  'Dew',
  'Fig',
  'Lulu',
  'Pebble',
  'Wisp',
  'Tilly',
  'Bo',
  'Juniper',
  'Sprig',
  'Puff',
] as const;

export const STAT_LABELS = {
  swim: 'Swim',
  fly: 'Fly',
  run: 'Run',
  power: 'Power',
  stamina: 'Stamina',
} as const;

export const STAT_ICONS = {
  swim: '🌊',
  fly: '🪶',
  run: '👟',
  power: '💪',
  stamina: '🌿',
} as const;

export const STAGE_LABELS = {
  egg: 'Egg',
  child: 'Child',
  cocoon: 'Cocoon',
  adult: 'Adult',
} as const;

export const TYPE_LABELS = {
  normal: 'Normal',
  swim: 'Swim',
  fly: 'Fly',
  run: 'Run',
  power: 'Power',
} as const;

export const CRITTER_LABELS: Record<string, string> = {
  penguin: 'Penguin',
  seal: 'Seal',
  otter: 'Otter',
  peacock: 'Peacock',
  parrot: 'Parrot',
  condor: 'Condor',
  cheetah: 'Cheetah',
  rabbit: 'Rabbit',
  boar: 'Boar',
  gorilla: 'Gorilla',
  bear: 'Bear',
  tiger: 'Tiger',
  sheep: 'Sheep',
  raccoon: 'Raccoon',
  skunk: 'Skunk',
  ...MORE_CRITTER_LABELS,
};

export const ESSENCE_LABELS = {
  swim: 'Blue Essence',
  fly: 'Purple Essence',
  run: 'Green Essence',
  power: 'Red Essence',
  normal: 'Gold Essence',
} as const;

export const GROVE_LABELS = {
  main: '🌿 Main Grove',
  sun: '☀ Sun Grove',
  moon: '☾ Moon Grove',
} as const;

export const FAMILY_LABELS = {
  chao: 'Grove line',
  pocket: 'Pocket line',
  digi: 'Digital line',
} as const;

export const HAT_LABELS: Record<string, string> = {
  straw: 'Straw hat',
  crown: 'Crown',
  beanie: 'Beanie',
  flower: 'Flower',
  bucket: 'Bucket hat',
  'look-fox': 'Fox look',
  'look-echidna': 'Echidna look',
  'look-rose': 'Rose look',
  'look-dream': 'Dream look',
};

export const EGG_COLOR_LABELS: Record<string, string> = {
  plain: 'Plain',
  sky: 'Sky',
  rose: 'Rose',
  mint: 'Mint',
  gold: 'Gold',
  violet: 'Violet',
  // R0399: the rest of the egg palette and the extra gems.
  yellow: 'Yellow',
  white: 'White',
  brown: 'Brown',
  grey: 'Grey',
  black: 'Black',
  orange: 'Orange',
  lime: 'Lime',
  red: 'Red',
  pearl: 'Pearl',
  ruby: 'Ruby',
  sapphire: 'Sapphire',
  emerald: 'Emerald',
  amethyst: 'Amethyst',
  topaz: 'Topaz',
  garnet: 'Garnet',
  onyx: 'Onyx',
  silver: 'Silver',
  aquamarine: 'Aquamarine',
  peridot: 'Peridot',
};

export const FINISH_LABELS = { shiny: 'Shiny', metal: 'Metal', glass: 'Glass' } as const;

export const PERSONALITY_LABELS = {
  cheerful: 'Cheerful',
  shy: 'Shy',
  mischievous: 'Mischievous',
  lazy: 'Lazy',
  curious: 'Curious',
  gentle: 'Gentle',
  bold: 'Bold',
  dreamy: 'Dreamy',
} as const;

export const COURSE_LABELS: Record<string, string> = {
  meadow: 'Meadow Dash',
  cliffs: 'Cliff Climb',
  lagoon: 'Lagoon Loop',
};

/** The race sections' signs, as the track shows them. */
export const SECTION_LABELS = {
  swim: 'SWIM',
  fly: 'FLY',
  run: 'RUN',
  climb: 'CLIMB',
  stretch: 'STAMINA',
} as const;

export const SHOP_ITEMS = {
  fruit: { name: 'Fruit', help: 'Fills a hungry belly and adds Stamina.' },
  egg: { name: 'Egg', help: 'A new Nubbin. Sometimes a rare colour!' },
  hat: { name: 'Hat', help: 'A random hat for the collection.' },
  toy: { name: 'Ball', help: 'Nubbins play with it in the Grove.' },
  heartFruit: {
    name: 'Heart fruit',
    help: 'Feed it to a grown Nubbin that loves you; with a partner nearby, an egg follows.',
  },
  twine: { name: 'Twine', help: 'Binds two partners for a minute of merged strength.' },
} as const;

export const MOOD_LABELS = {
  content: 'Content',
  happy: 'Happy',
  sad: 'Sad',
  hungry: 'Hungry',
  sleepy: 'Sleepy',
  dizzy: 'Dizzy',
} as const;
