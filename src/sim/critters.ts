import { CRITTERS, ESSENCES } from '../config/tuning';
import { addHappiness } from './needs';
import type { Rng } from './rng';
import { addPoints } from './stats';
import type { AnyPartSlot, Nubbin, NubbinType, SimEvent, StatKey } from './types';
import { STAT_KEYS } from './types';

/**
 * Critters: 24 species in the wild (five each for Swim, Fly, Run and Power, three Normal)
 * and two rare ones found only in the Hollow. Giving one trains the type's main stat, adds a
 * little to one other stat, sets two to four part slots to the species' parts (newest wins)
 * and nudges the type lean. Essences train one stat and nudge the lean without changing
 * parts. All names come from strings via the UI; here they are ids.
 */
export interface CritterSpecies {
  id: string;
  type: NubbinType;
  /** Which slots this species' parts occupy (R0401: legs, horn, face and wings too). */
  parts: AnyPartSlot[];
  /** Found only in the Hollow, never on an Expedition or in the shop (R0402). */
  rare?: true;
}

/**
 * The first fifteen, in their first order: the frozen dungeon generators pick from this list
 * by seed, so it never grows (new critters go in `MORE_CRITTERS`).
 */
export const CRITTER_SPECIES: readonly CritterSpecies[] = [
  { id: 'penguin', type: 'swim', parts: ['arms', 'legs', 'face'] },
  { id: 'seal', type: 'swim', parts: ['arms', 'tail'] },
  { id: 'otter', type: 'swim', parts: ['ears', 'tail', 'face'] },
  { id: 'peacock', type: 'fly', parts: ['back', 'ears'] },
  { id: 'parrot', type: 'fly', parts: ['wings', 'face', 'tail'] },
  { id: 'condor', type: 'fly', parts: ['wings', 'ears'] },
  { id: 'cheetah', type: 'run', parts: ['ears', 'tail', 'legs'] },
  { id: 'rabbit', type: 'run', parts: ['ears', 'legs', 'tail'] },
  { id: 'boar', type: 'run', parts: ['ears', 'horn', 'legs'] },
  { id: 'gorilla', type: 'power', parts: ['arms', 'ears'] },
  { id: 'bear', type: 'power', parts: ['ears', 'arms'] },
  { id: 'tiger', type: 'power', parts: ['ears', 'tail', 'arms'] },
  { id: 'sheep', type: 'normal', parts: ['ears', 'tail'] },
  { id: 'raccoon', type: 'normal', parts: ['ears', 'tail', 'face'] },
  { id: 'skunk', type: 'normal', parts: ['ears', 'tail'] },
];

/** R0402: nine more, toward SA2's range. */
export const MORE_CRITTERS: readonly CritterSpecies[] = [
  { id: 'bonefish', type: 'swim', parts: ['ears', 'tail'] },
  { id: 'turtle', type: 'swim', parts: ['back', 'legs'] },
  { id: 'swallow', type: 'fly', parts: ['wings', 'tail'] },
  { id: 'bat', type: 'fly', parts: ['wings', 'ears'] },
  { id: 'deer', type: 'run', parts: ['horn', 'legs', 'tail'] },
  { id: 'monkey', type: 'run', parts: ['arms', 'ears', 'tail'] },
  { id: 'unicorn', type: 'power', parts: ['horn', 'legs', 'tail'] },
  { id: 'wolf', type: 'power', parts: ['ears', 'tail', 'face'] },
  { id: 'koala', type: 'normal', parts: ['ears', 'face'] },
];

/** The two rare critters, found only in the Hollow (R0402). */
export const RARE_CRITTERS: readonly CritterSpecies[] = [
  { id: 'phoenix', type: 'fly', parts: ['wings', 'tail', 'ears'], rare: true },
  { id: 'dragon', type: 'power', parts: ['horn', 'wings', 'tail'], rare: true },
];

/** The critters of the wild: what Expeditions and gifts pick from. */
export const WILD_CRITTERS: readonly CritterSpecies[] = [...CRITTER_SPECIES, ...MORE_CRITTERS];

/** Every critter, wild and rare: what can be given and drawn. */
export const ALL_CRITTERS: readonly CritterSpecies[] = [...WILD_CRITTERS, ...RARE_CRITTERS];

export function speciesById(id: string): CritterSpecies | undefined {
  return ALL_CRITTERS.find((s) => s.id === id);
}

/** The stat a type trains. Normal trains Stamina. */
export function mainStatOf(type: NubbinType): StatKey {
  return type === 'normal' ? 'stamina' : type;
}

export function partId(species: string, slot: AnyPartSlot): string {
  return `${species}-${slot}`;
}

export function giveCritter(n: Nubbin, speciesId: string, rng: Rng, events: SimEvent[]): boolean {
  const species = speciesById(speciesId);
  if (!species) return false;
  const main = mainStatOf(species.type);
  addPoints(n.stats[main], CRITTERS.mainStatPoints);
  const others = STAT_KEYS.filter((k) => k !== main);
  addPoints(n.stats[rng.pick(others)], CRITTERS.otherStatPoints);
  for (const slot of species.parts) n.parts[slot] = partId(species.id, slot);
  // Every critter nudges toward its own type, Normal included (the brief); a Normal lean
  // wins like any other, and a field with no clear lead still ends Normal in winningType.
  n.typeLean[species.type] += CRITTERS.leanNudge;
  addHappiness(n, CRITTERS.happiness);
  events.push({ kind: 'critterGiven', nubbinId: n.id, species: species.id });
  return true;
}

export function giveEssence(n: Nubbin, type: NubbinType, events: SimEvent[]): void {
  addPoints(n.stats[mainStatOf(type)], ESSENCES.statPoints);
  n.typeLean[type] += ESSENCES.leanNudge;
  addHappiness(n, ESSENCES.happiness);
  events.push({ kind: 'essenceGiven', nubbinId: n.id, type });
}
