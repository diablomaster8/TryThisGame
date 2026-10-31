import { hashString } from './hash-string';
import { isCommonSpecies, SPECIES } from './species';

// Kept apart from dungeon-uniques.ts so the sprite art (and the sculpt worker) can name a
// unique's species without loading the Hollow sim and, through it, the world.

/** The unique's look: a foe species picked from its id, the same in every seed. */
export function uniqueSpecies(id: string): string {
  const foes = SPECIES.filter((s) => s.id !== 'chao' && s.stage === 'baby' && isCommonSpecies(s));
  return foes[hashString(id) % foes.length]!.id;
}
