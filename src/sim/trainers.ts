import type { Rng } from './rng';
import { speciesByFamily, type Family } from './species';
import { DIGI_EGGS } from '../config/tuning-digi';
import type { KeeperAlignment, NubbinType } from './types';

/**
 * Trainers: the playable Keepers. Each has an alignment side (Sun or Moon), a look, and
 * an egg table that decides what hatches while they are the active Keeper. Ten of them,
 * five per side, each leaning toward a family and a type.
 */
export interface TrainerLook {
  skin: number;
  hat: number;
  hatBand: number;
  shirt: number;
  shirtShade: number;
  pants: number;
  boots: number;
  hair: number;
  outline: number;
  hatStyle: 'sun' | 'cap' | 'beanie' | 'hood' | 'band' | 'none';
}

export interface Trainer {
  id: string;
  band: KeeperAlignment;
  look: TrainerLook;
  /** Family weights for eggs; they need not sum to 1. */
  eggs: Record<Family, number>;
  /** Species of this type are three times as likely within a family. */
  favourite: NubbinType;
}

// Palette indices (see render/sprites/palette.ts): kept numeric here so sim/ stays free of render imports.
const P = {
  ink: 0,
  darkPlum: 1,
  plum: 2,
  dusk: 3,
  lilacGrey: 4,
  pale: 5,
  white: 6,
  deepGreen: 7,
  forest: 8,
  leaf: 9,
  grass: 10,
  sprout: 11,
  darkBark: 12,
  bark: 13,
  wood: 14,
  sand: 15,
  nightBlue: 16,
  deepWater: 17,
  water: 18,
  shallows: 19,
  sunYellow: 20,
  orange: 21,
  ember: 22,
  berry: 23,
  rose: 24,
  blush: 25,
  moonPurple: 26,
  violet: 27,
  lavender: 28,
  teal: 29,
  mint: 30,
  cream: 31,
} as const;

const look = (over: Partial<TrainerLook>): TrainerLook => ({
  skin: P.sand,
  hat: P.cream,
  hatBand: P.orange,
  shirt: P.sunYellow,
  shirtShade: P.orange,
  pants: P.teal,
  boots: P.bark,
  hair: P.wood,
  outline: P.darkPlum,
  hatStyle: 'sun',
  ...over,
});

export const TRAINERS: readonly Trainer[] = [
  {
    id: 'fern',
    band: 'sun',
    look: look({}),
    eggs: { chao: 6, pocket: 1, digi: 1 },
    favourite: 'normal',
  },
  {
    id: 'marina',
    band: 'sun',
    look: look({
      hat: P.white,
      hatBand: P.water,
      shirt: P.shallows,
      shirtShade: P.water,
      pants: P.deepWater,
      hatStyle: 'cap',
      hair: P.darkBark,
    }),
    eggs: { chao: 1, pocket: 6, digi: 1 },
    favourite: 'swim',
  },
  {
    id: 'sparks',
    band: 'sun',
    look: look({
      hat: P.sunYellow,
      hatBand: P.ink,
      shirt: P.white,
      shirtShade: P.lilacGrey,
      pants: P.ink,
      hatStyle: 'cap',
      hair: P.orange,
    }),
    eggs: { chao: 1, pocket: 6, digi: 1 },
    favourite: 'run',
  },
  {
    id: 'clover',
    band: 'sun',
    look: look({
      hat: P.blush,
      hatBand: P.rose,
      shirt: P.pale,
      shirtShade: P.blush,
      pants: P.rose,
      hatStyle: 'band',
      hair: P.sunYellow,
    }),
    eggs: { chao: 2, pocket: 5, digi: 0 },
    favourite: 'normal',
  },
  {
    id: 'pixel',
    band: 'sun',
    look: look({
      hat: P.mint,
      hatBand: P.teal,
      shirt: P.cream,
      shirtShade: P.mint,
      pants: P.dusk,
      hatStyle: 'beanie',
      hair: P.teal,
    }),
    eggs: { chao: 1, pocket: 1, digi: 6 },
    favourite: 'fly',
  },
  {
    id: 'luna',
    band: 'moon',
    look: look({
      hat: P.plum,
      hatBand: P.violet,
      shirt: P.moonPurple,
      shirtShade: P.darkPlum,
      pants: P.nightBlue,
      boots: P.ink,
      hair: P.darkBark,
      outline: P.ink,
      hatStyle: 'hood',
    }),
    eggs: { chao: 6, pocket: 1, digi: 1 },
    favourite: 'fly',
  },
  {
    id: 'ember',
    band: 'moon',
    look: look({
      hat: P.ember,
      hatBand: P.sunYellow,
      shirt: P.berry,
      shirtShade: P.darkPlum,
      pants: P.ink,
      boots: P.darkBark,
      hair: P.ember,
      outline: P.ink,
      hatStyle: 'band',
    }),
    eggs: { chao: 1, pocket: 6, digi: 1 },
    favourite: 'power',
  },
  {
    id: 'byte',
    band: 'moon',
    look: look({
      hat: P.dusk,
      hatBand: P.mint,
      shirt: P.darkPlum,
      shirtShade: P.ink,
      pants: P.plum,
      boots: P.ink,
      hair: P.lilacGrey,
      outline: P.ink,
      hatStyle: 'hood',
    }),
    eggs: { chao: 1, pocket: 1, digi: 6 },
    favourite: 'power',
  },
  {
    id: 'dusty',
    band: 'moon',
    look: look({
      hat: P.wood,
      hatBand: P.darkBark,
      shirt: P.sand,
      shirtShade: P.wood,
      pants: P.darkBark,
      boots: P.ink,
      hair: P.lilacGrey,
      hatStyle: 'sun',
    }),
    eggs: { chao: 0, pocket: 7, digi: 1 },
    favourite: 'swim',
  },
  {
    id: 'nova',
    band: 'moon',
    look: look({
      hat: P.nightBlue,
      hatBand: P.sunYellow,
      shirt: P.violet,
      shirtShade: P.moonPurple,
      pants: P.nightBlue,
      boots: P.darkPlum,
      hair: P.lavender,
      outline: P.ink,
      hatStyle: 'none',
    }),
    eggs: { chao: 3, pocket: 3, digi: 3 },
    favourite: 'normal',
  },
];

export const DEFAULT_TRAINER = 'fern';

export function trainerOf(id: string): Trainer {
  return TRAINERS.find((t) => t.id === id) ?? TRAINERS[0]!;
}

/** Only fossil-line babies for a fossil hunter: an id filter per trainer, by convention. */
const FOSSIL_BABIES = new Set(['spiralshell', 'domeshell', 'skyfang', 'lilystalk', 'clawnymph']);

/** Which baby species hatches from an egg laid while this trainer is active. */
export function rollEggSpecies(trainer: Trainer, rng: Rng): string {
  const family = rng.weighted(trainer.eggs) as Family;
  if (family === 'chao') return 'chao';
  let babies = speciesByFamily(family, 'baby');
  if (trainer.id === 'dusty' && family === 'pocket') {
    babies = babies.filter((s) => FOSSIL_BABIES.has(s.id));
  }
  // A digital-line egg holds one version's first hatchling, never a later baby.
  if (family === 'digi') return rng.weighted({ ...DIGI_EGGS });
  const weights: Record<string, number> = {};
  for (const s of babies) weights[s.id] = s.type === trainer.favourite ? 3 : 1;
  return rng.weighted(weights);
}
