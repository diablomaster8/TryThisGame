import type { AlignmentBand, Nubbin, NubbinType } from './types';

/**
 * Species: what hatches from an egg and what it grows into. The Chao line is the
 * original creature. The 'pocket' family holds the baby and fossil lines inspired by
 * the first three Pokémon generations, the 'digi' family the original 1997 virtual-pet
 * line. In-game names are our own (strings.ts); `ref` records the inspiration for the
 * artist and is never shown.
 */
export type Family = 'chao' | 'pocket' | 'digi';
export type SpeciesStage = 'baby' | 'grown' | 'final';

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
  P('skyfang', 'Aerodactyl', 'baby', 'fly', { kind: 'fixed', to: 'skyfang-grown' }),
  P('skyfang-grown', 'Aerodactyl (grown)', 'final', 'fly'),
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
  D('hornsaur', 'Greymon', 'grown', 'power', { kind: 'fixed', to: 'ironsaur' }),
  D('redsaur', 'Tyrannomon', 'grown', 'run', { kind: 'fixed', to: 'beanbot' }),
  D('shadeling', 'Devimon', 'grown', 'fly', { kind: 'fixed', to: 'beanbot' }),
  D('blazeman', 'Meramon', 'grown', 'power', { kind: 'fixed', to: 'beanbot' }),
  D('slugbert', 'Numemon', 'grown', 'normal', { kind: 'fixed', to: 'hugbear' }),
  D('skyserpent', 'Airdramon', 'grown', 'fly', { kind: 'fixed', to: 'beanbot' }),
  D('seaserpent', 'Seadramon', 'grown', 'swim', { kind: 'fixed', to: 'beanbot' }),
  D('ironsaur', 'MetalGreymon', 'final', 'power'),
  D('beanbot', 'Mamemon', 'final', 'normal'),
  D('hugbear', 'Monzaemon', 'final', 'normal'),
];

const BY_ID = new Map(SPECIES.map((s) => [s.id, s]));

export function speciesOf(id: string): Species {
  return BY_ID.get(id) ?? BY_ID.get('chao')!;
}

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
