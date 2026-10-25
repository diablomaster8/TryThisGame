import { GEN1B_SPECIES } from './species-gen1b';
import type { AlignmentBand, Nubbin, NubbinType } from './types';

/**
 * Species: what hatches from an egg and what it grows into. The Chao line is the
 * original creature. The 'pocket' family holds the baby and fossil lines inspired by
 * the first three Pokémon generations, the 'digi' family the original 1997 virtual-pet
 * line. In-game names are our own (strings.ts); `ref` records the inspiration for the
 * artist and is never shown.
 */
export type Family = 'chao' | 'pocket' | 'digi';
/**
 * baby: hatches (a baby with a fixed rule to another baby grows into it after a few
 * minutes); grown: the first evolution; champion: the second; final: the third.
 */
export type SpeciesStage = 'baby' | 'grown' | 'champion' | 'final';

export type EvolutionRule =
  | { kind: 'fixed'; to: string }
  /** The winning type picks the form; `poor` when lifetime happiness is negative. */
  | { kind: 'byType'; map: Partial<Record<NubbinType, string>>; fallback: string; poor?: string }
  | { kind: 'byBand'; sun: string; moon: string; neutral: string };

export interface Species {
  id: string;
  family: Family;
  ref: string;
  stage: SpeciesStage;
  /** Natural type: nudges lean at hatch and biases rivals' looks. */
  type: NubbinType;
  evolve: EvolutionRule | null;
  /** Relative odds in an egg roll (1 when absent); below 1 is rare and never found wild. */
  eggWeight?: number;
}

const P = (
  id: string,
  ref: string,
  stage: SpeciesStage,
  type: NubbinType,
  evolve: EvolutionRule | null = null,
): Species => ({ id, family: 'pocket', ref, stage, type, evolve });
const D = (
  id: string,
  ref: string,
  stage: SpeciesStage,
  type: NubbinType,
  evolve: EvolutionRule | null = null,
): Species => ({ id, family: 'digi', ref, stage, type, evolve });

export const SPECIES: readonly Species[] = [
  { id: 'chao', family: 'chao', ref: 'Chao', stage: 'baby', type: 'normal', evolve: null },

  // ---- pocket: baby lines ----
  P('zapling', 'Pichu', 'baby', 'run', { kind: 'fixed', to: 'zapkin' }),
  P('zapkin', 'Pikachu', 'grown', 'run', { kind: 'fixed', to: 'zapmaw' }),
  P('zapmaw', 'Raichu', 'final', 'run'),
  P('starbud', 'Cleffa', 'baby', 'normal', { kind: 'fixed', to: 'starpuff' }),
  P('starpuff', 'Clefairy', 'grown', 'normal', { kind: 'fixed', to: 'starwing' }),
  P('starwing', 'Clefable', 'final', 'fly'),
  P('puffbud', 'Igglybuff', 'baby', 'normal', { kind: 'fixed', to: 'puffle' }),
  P('puffle', 'Jigglypuff', 'grown', 'normal', { kind: 'fixed', to: 'pufflow' }),
  P('pufflow', 'Wigglytuff', 'final', 'normal'),
  P('shellbit', 'Togepi', 'baby', 'normal', { kind: 'fixed', to: 'shellwing' }),
  P('shellwing', 'Togetic', 'final', 'fly'),
  P('scrapper', 'Tyrogue', 'baby', 'power', {
    kind: 'byType',
    map: { run: 'kickmaster', power: 'jabmaster' },
    fallback: 'spinmaster',
  }),
  P('kickmaster', 'Hitmonlee', 'final', 'run'),
  P('jabmaster', 'Hitmonchan', 'final', 'power'),
  P('spinmaster', 'Hitmontop', 'final', 'normal'),
  P('kissbud', 'Smoochum', 'baby', 'swim', { kind: 'fixed', to: 'frostdiva' }),
  P('frostdiva', 'Jynx', 'final', 'swim'),
  P('plugbud', 'Elekid', 'baby', 'power', { kind: 'fixed', to: 'voltbrute' }),
  P('voltbrute', 'Electabuzz', 'final', 'power'),
  P('emberbud', 'Magby', 'baby', 'power', { kind: 'fixed', to: 'blazebrute' }),
  P('blazebrute', 'Magmar', 'final', 'power'),
  P('droplet', 'Azurill', 'baby', 'swim', { kind: 'fixed', to: 'puddlemouse' }),
  P('puddlemouse', 'Marill', 'grown', 'swim', { kind: 'fixed', to: 'rivermouse' }),
  P('rivermouse', 'Azumarill', 'final', 'swim'),
  P('grinlet', 'Wynaut', 'baby', 'normal', { kind: 'fixed', to: 'punchbag' }),
  P('punchbag', 'Wobbuffet', 'final', 'power'),

  // ---- pocket: fossil lines ----
  P('spiralshell', 'Omanyte', 'baby', 'swim', { kind: 'fixed', to: 'spiralking' }),
  P('spiralking', 'Omastar', 'final', 'swim'),
  P('domeshell', 'Kabuto', 'baby', 'swim', { kind: 'fixed', to: 'domereaper' }),
  P('domereaper', 'Kabutops', 'final', 'power'),
  // Single stage: it keeps its look for life (the old invented 'skyfang-grown' is an alias).
  P('skyfang', 'Aerodactyl', 'baby', 'fly'),
  P('lilystalk', 'Lileep', 'baby', 'swim', { kind: 'fixed', to: 'lilyking' }),
  P('lilyking', 'Cradily', 'final', 'power'),
  P('clawnymph', 'Anorith', 'baby', 'swim', { kind: 'fixed', to: 'clawknight' }),
  P('clawknight', 'Armaldo', 'final', 'power'),

  // ---- digi: the original 1997 line ----
  D('fuzzlet', 'Botamon', 'baby', 'normal', { kind: 'fixed', to: 'chompet' }),
  D('chompet', 'Koromon', 'baby', 'normal', {
    kind: 'byType',
    map: { swim: 'croaklet', fly: 'croaklet' },
    fallback: 'dinolet',
  }),
  D('dinolet', 'Agumon', 'grown', 'power', {
    kind: 'byType',
    map: { power: 'hornsaur', run: 'redsaur', fly: 'blazeman', swim: 'shadeling' },
    fallback: 'hornsaur',
    poor: 'slugbert',
  }),
  D('croaklet', 'Betamon', 'grown', 'swim', {
    kind: 'byType',
    map: { fly: 'skyserpent', swim: 'seaserpent', power: 'blazeman', run: 'seaserpent' },
    fallback: 'seaserpent',
    poor: 'slugbert',
  }),
  D('hornsaur', 'Greymon', 'champion', 'power', { kind: 'fixed', to: 'ironsaur' }),
  D('redsaur', 'Tyrannomon', 'champion', 'run', { kind: 'fixed', to: 'beanbot' }),
  D('shadeling', 'Devimon', 'champion', 'fly', { kind: 'fixed', to: 'beanbot' }),
  D('blazeman', 'Meramon', 'champion', 'power', { kind: 'fixed', to: 'beanbot' }),
  D('slugbert', 'Numemon', 'champion', 'normal', { kind: 'fixed', to: 'hugbear' }),
  D('skyserpent', 'Airdramon', 'champion', 'fly', { kind: 'fixed', to: 'beanbot' }),
  D('seaserpent', 'Seadramon', 'champion', 'swim', { kind: 'fixed', to: 'beanbot' }),
  D('ironsaur', 'MetalGreymon', 'final', 'power'),
  D('beanbot', 'Mamemon', 'final', 'normal'),
  D('hugbear', 'Monzaemon', 'final', 'normal'),

  ...GEN1B_SPECIES,
];

/**
 * The Eternals' inspiration, by band, for the artist (never shown): the three Chaos Chao
 * forms (Maor, 2026-10-18). Both renderers draw an Eternal as its Chaos form.
 */
export const ETERNAL_REFS: Readonly<Record<AlignmentBand, string>> = {
  sun: 'Hero Chaos Chao',
  moon: 'Dark Chaos Chao',
  neutral: 'Neutral Chaos Chao',
};

const BY_ID = new Map(SPECIES.map((s) => [s.id, s]));

/** Retired ids that old saves may still hold, and the species each one became. */
export const SPECIES_ALIASES: Readonly<Record<string, string>> = {
  'skyfang-grown': 'skyfang',
};

/** The current id for a possibly retired one. */
export function canonicalSpecies(id: string): string {
  return SPECIES_ALIASES[id] ?? id;
}

export function speciesOf(id: string): Species {
  return BY_ID.get(canonicalSpecies(id)) ?? BY_ID.get('chao')!;
}

/** Egg-roll odds of a species: 1 unless it is rare. */
export const eggWeightOf = (s: Species): number => s.eggWeight ?? 1;

/** Babies that turn up wild, in the Hollow Below and in neighbours' gardens: not the rare ones. */
export const isCommonSpecies = (s: Species): boolean => eggWeightOf(s) >= 1;

export function speciesByFamily(family: Family, stage?: SpeciesStage): Species[] {
  return SPECIES.filter((s) => s.family === family && (!stage || s.stage === stage));
}

/** What a species becomes at an evolution step, or null when it is already final. */
export function nextSpecies(
  s: Species,
  type: NubbinType,
  band: AlignmentBand,
  lifetimeHappiness: number,
): string | null {
  const rule = s.evolve;
  if (!rule) return null;
  switch (rule.kind) {
    case 'fixed':
      return rule.to;
    case 'byType':
      if (rule.poor && lifetimeHappiness < 0) return rule.poor;
      return rule.map[type] ?? rule.fallback;
    case 'byBand':
      return band === 'sun' ? rule.sun : band === 'moon' ? rule.moon : rule.neutral;
  }
}

/** Egg art family for a species. */
export function eggStyleOf(n: Pick<Nubbin, 'species'>): Family {
  return speciesOf(n.species).family;
}
