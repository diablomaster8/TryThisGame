import { CRITTERS, ESSENCES } from '../config/tuning';
import { addHappiness } from './needs';
import type { Rng } from './rng';
import { addPoints } from './stats';
import type { Nubbin, NubbinType, PartSlot, SimEvent, StatKey } from './types';
import { STAT_KEYS } from './types';

/**
 * Critters: 15 species, 3 per type. Giving one trains the type's main stat, adds a
 * little to one other stat, sets one or more part slots to the species' parts (newest
 * wins) and nudges the type lean. Essences train one stat and nudge the lean without
 * changing parts. All names come from strings via the UI; here they are ids.
 */
export interface CritterSpecies {
  id: string;
  type: NubbinType;
  /** Which slots this species' parts occupy. */
  parts: PartSlot[];
}

export const CRITTER_SPECIES: readonly CritterSpecies[] = [
  { id: 'penguin', type: 'swim', parts: ['arms', 'tail'] },
  { id: 'seal', type: 'swim', parts: ['arms', 'tail'] },
  { id: 'otter', type: 'swim', parts: ['ears', 'tail'] },
  { id: 'peacock', type: 'fly', parts: ['back', 'ears'] },
  { id: 'parrot', type: 'fly', parts: ['back', 'ears'] },
  { id: 'condor', type: 'fly', parts: ['back', 'ears'] },
  { id: 'cheetah', type: 'run', parts: ['ears', 'tail'] },
  { id: 'rabbit', type: 'run', parts: ['ears', 'tail'] },
  { id: 'boar', type: 'run', parts: ['ears', 'tail'] },
  { id: 'gorilla', type: 'power', parts: ['arms', 'ears'] },
  { id: 'bear', type: 'power', parts: ['ears', 'arms'] },
  { id: 'tiger', type: 'power', parts: ['ears', 'tail'] },
  { id: 'sheep', type: 'normal', parts: ['ears', 'tail'] },
  { id: 'raccoon', type: 'normal', parts: ['ears', 'tail'] },
  { id: 'skunk', type: 'normal', parts: ['ears', 'tail'] },
];

export function speciesById(id: string): CritterSpecies | undefined {
  return CRITTER_SPECIES.find((s) => s.id === id);
}

/** The stat a type trains. Normal trains Stamina. */
export function mainStatOf(type: NubbinType): StatKey {
  return type === 'normal' ? 'stamina' : type;
}

export function partId(species: string, slot: PartSlot): string {
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
