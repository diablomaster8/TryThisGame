import { PART_SIZE } from '../../config/tuning-look';
import { mainStatOf, speciesById } from '../../sim/critters';
import { levelOf } from '../../sim/stats';
import type { AnyPartSlot, Nubbin } from '../../sim/types';

/**
 * Critter part sizing for both renderers (LOOK-36): a part grows with the level of its
 * critter's type stat, in three steps so the 3D geometry cache stays small. A child's
 * 0.8 sits on top (the pixel shape's `partScale`, the 3D builder's child scale).
 */

/** Every part slot, in look-key order: the first four, then the R0401 four. */
export const ALL_PART_SLOTS: readonly AnyPartSlot[] = [
  'ears',
  'tail',
  'arms',
  'back',
  'legs',
  'horn',
  'face',
  'wings',
];

export type PartStep = 0 | 1 | 2;

/** The size step of one part id on a Nubbin with these stats (1, the middle, for unknowns). */
export function partStep(id: string, stats: Nubbin['stats']): PartStep {
  const species = speciesById(id.split('-')[0] ?? '');
  if (!species) return 1;
  const level = levelOf(stats[mainStatOf(species.type)].points);
  return Math.min(2, Math.floor(level / PART_SIZE.bucket)) as PartStep;
}

/** The size multiplier for a step. */
export const partStepScale = (step: PartStep): number => PART_SIZE.steps[step];

/** The step of every filled slot. */
export function partSteps(
  n: Pick<Nubbin, 'parts' | 'stats'>,
): Partial<Record<AnyPartSlot, PartStep>> {
  const out: Partial<Record<AnyPartSlot, PartStep>> = {};
  for (const slot of ALL_PART_SLOTS) {
    const id = n.parts[slot];
    if (id) out[slot] = partStep(id, n.stats);
  }
  return out;
}
