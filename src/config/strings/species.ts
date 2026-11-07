// Species names, trainers and the Keeper looks.
import { GEN1B_SPECIES_LABELS } from '../strings-gen1b';
import { R11_LABELS } from '../strings-r11';
import { DIGI2_LABELS } from '../strings-digi2';
import { GEN1A_LABELS } from '../strings-gen1a';

/** Player-facing species names. Ids live in sim/species.ts. */
export const SPECIES_LABELS: Record<string, string> = {
  chao: 'Nubbin',
  zapling: 'Zapling',
  zapkin: 'Zapkin',
  zapmaw: 'Zapmaw',
  starbud: 'Starbud',
  starpuff: 'Starpuff',
  starwing: 'Starwing',
  puffbud: 'Puffbud',
  puffle: 'Puffle',
  pufflow: 'Pufflow',
  shellbit: 'Shellbit',
  shellwing: 'Shellwing',
  scrapper: 'Scrapper',
  kickmaster: 'Kickmaster',
  jabmaster: 'Jabmaster',
  spinmaster: 'Spinmaster',
  kissbud: 'Kissbud',
  frostdiva: 'Frostdiva',
  plugbud: 'Plugbud',
  voltbrute: 'Voltbrute',
  emberbud: 'Emberbud',
  blazebrute: 'Blazebrute',
  droplet: 'Droplet',
  puddlemouse: 'Puddlemouse',
  rivermouse: 'Rivermouse',
  grinlet: 'Grinlet',
  punchbag: 'Punchbag',
  spiralshell: 'Spiralshell',
  spiralking: 'Spiralking',
  domeshell: 'Domeshell',
  domereaper: 'Domereaper',
  skyfang: 'Skyfang',
  lilystalk: 'Lilystalk',
  lilyking: 'Lilyking',
  clawnymph: 'Clawnymph',
  clawknight: 'Clawknight',
  fuzzlet: 'Fuzzlet',
  chompet: 'Chompet',
  dinolet: 'Dinolet',
  croaklet: 'Croaklet',
  hornsaur: 'Hornsaur',
  redsaur: 'Redsaur',
  shadeling: 'Shadeling',
  blazeman: 'Blazeman',
  slugbert: 'Slugbert',
  skyserpent: 'Skyserpent',
  seaserpent: 'Seaserpent',
  ironsaur: 'Ironsaur',
  beanbot: 'Beanbot',
  hugbear: 'Hugbear',
  ...DIGI2_LABELS,
  ...GEN1B_SPECIES_LABELS,
  ...GEN1A_LABELS,
  ...R11_LABELS,
};

/** The ten playable Keepers. */
export const TRAINER_LABELS: Record<string, { name: string; blurb: string }> = {
  fern: { name: 'Fern', blurb: 'The gardener. Grove-line eggs, mostly.' },
  marina: { name: 'Marina', blurb: 'Tide-pool keeper. Swimmers from the pocket line.' },
  sparks: { name: 'Sparks', blurb: 'Fast and crackly. Runners from the pocket line.' },
  clover: { name: 'Clover', blurb: 'Soft-hearted. Gentle pocket-line babies.' },
  pixel: { name: 'Pixel', blurb: 'Tinkerer. Eggs from the digital line.' },
  luna: { name: 'Luna', blurb: 'Night gardener. Moon-side Grove eggs.' },
  ember: { name: 'Ember', blurb: 'Fighter. Brawlers from the pocket line.' },
  byte: { name: 'Byte', blurb: 'Dark-screen coder. Digital-line eggs.' },
  dusty: { name: 'Dusty', blurb: 'Fossil hunter. Only ancient pocket-line eggs.' },
  nova: { name: 'Nova', blurb: 'Wanderer. A bit of everything.' },
};

/**
 * The playable Keeper looks, named for the look and never for the villager who wears it,
 * so a story never has you meet yourself ("I'm Fern, from next door").
 */
export const KEEPER_LOOK_NAMES: Record<string, string> = {
  fern: 'Gardener',
  marina: 'Tide-pooler',
  sparks: 'Live Wire',
  clover: 'Knitter',
  pixel: 'Tinkerer',
  luna: 'Night Gardener',
  ember: 'Scrapper',
  byte: 'Night Coder',
  dusty: 'Fossil Hunter',
  nova: 'Wanderer',
};

/** One line under each look in the title's Keeper picker: what hatches with them (review C, 23). */
export const KEEPER_LOOK_BLURBS: Record<string, string> = {
  fern: 'Grove-line eggs, mostly.',
  marina: 'Swimmers from the pocket line.',
  sparks: 'Runners from the pocket line.',
  clover: 'Gentle pocket-line babies.',
  pixel: 'Eggs from the digital line.',
  luna: 'Moon-side Grove eggs.',
  ember: 'Brawlers from the pocket line.',
  byte: 'Digital-line eggs.',
  dusty: 'Only ancient pocket-line eggs.',
  nova: 'A bit of everything.',
};
