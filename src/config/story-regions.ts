/**
 * Lane C r10 agent A (R0605, CAMP-13): the questline regions. Each former campaign line has
 * its own place reached from the Grove: the Hundred Days' Fold through the Grove gate, Logged
 * In's server through Pixel's workbench (the notice board), the Beetle Road's Hollow down the
 * cave stairs, and Dawn & Dusk's Sun and Moon by the green's shrine. A region is drawn over
 * the Grove by its line's stage set (`config/stage-sets.ts`), so no new renderer location is
 * needed: the Keeper's `Location` stays where it is and `World.storyRegion` names the region.
 * The Hollow is also wherever the Hollow Below's floors are (`location === 'dungeon'`).
 */
import { markAt } from './stage-marks';
import type { StageSet } from './stage-sets';

export type StoryRegionId = 'fold' | 'server' | 'hollow' | 'sun' | 'moon';

export const STORY_REGION_IDS: readonly StoryRegionId[] = [
  'fold',
  'server',
  'sun',
  'moon',
  'hollow',
];

export interface StoryRegionDef {
  id: StoryRegionId;
  /** The lines (storyline ids) that live here. */
  lines: readonly string[];
  /** The stage set drawn over the Grove while the Keeper is here. */
  set: StageSet;
  /** The entrance in the Grove: which prop it is, and where the Go-to chip shows. */
  entrance: 'gate' | 'workbench' | 'stairs' | 'shrine';
  at: { x: number; z: number };
}

const mark = (name: string, fallback: { x: number; z: number }) => {
  const m = markAt('grove', name);
  return m ? { x: m.x, z: m.z } : fallback;
};

export const STORY_REGIONS: Readonly<Record<StoryRegionId, StoryRegionDef>> = {
  // Just inside the gate: the lane beyond is the Fold.
  fold: { id: 'fold', lines: ['hundred'], set: 'fold', entrance: 'gate', at: { x: 0, z: 21 } },
  server: {
    id: 'server',
    lines: ['logged'],
    set: 'logged',
    entrance: 'workbench',
    at: mark('board', { x: 3, z: -2 }),
  },
  sun: {
    id: 'sun',
    lines: ['dawn'],
    set: 'dawndusk',
    entrance: 'shrine',
    at: mark('shrine', { x: 0, z: 0 }),
  },
  moon: {
    id: 'moon',
    lines: ['dusk'],
    set: 'dawndusk',
    entrance: 'shrine',
    at: mark('shrine', { x: 0, z: 0 }),
  },
  // The cave mouth (config/regions.ts `grove-cave`); its floors are the Hollow too.
  hollow: {
    id: 'hollow',
    lines: ['beetle'],
    set: 'beetle',
    entrance: 'stairs',
    at: { x: -11.6, z: -12.8 },
  },
};

/** The region a line lives in, or null for a line with none. */
export function regionOfLine(line: string): StoryRegionId | null {
  for (const id of STORY_REGION_IDS) if (STORY_REGIONS[id].lines.includes(line)) return id;
  return null;
}
