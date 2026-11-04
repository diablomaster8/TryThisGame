import type { RegionId } from './regions';

/**
 * Round 12, helper d2: where the open world's small, hand-chosen things want to stand in each
 * drawn region. The numbers are region-local targets: `sim/region-spots.ts` snaps each to the
 * nearest open, reachable ground, so a later change to a region's layout cannot strand one.
 * Keyed by region id, so a new drawn region adds a row.
 */
export type DrawnId = 'wood' | 'shore' | 'ridge' | 'ruins' | 'sunlands' | 'moonlands';

/** R0138 (WORLD-72): the photo frame, set where the region's beacon stands in view. */
export const PHOTO_NEAR: Readonly<Record<DrawnId, { x: number; z: number }>> = {
  wood: { x: -12, z: -24 },
  shore: { x: 50, z: 9 },
  ridge: { x: 0, z: -50 },
  ruins: { x: 12, z: -10 },
  sunlands: { x: 0, z: -14 },
  moonlands: { x: -14, z: -16 },
};

/** R0136 (WORLD-70): where each region's 8 x 8 build plot wants to sit (open ground, off the path). */
export const PLOT_NEAR: Readonly<Record<DrawnId, { x: number; z: number }>> = {
  wood: { x: 20, z: 24 },
  shore: { x: -26, z: -12 },
  ridge: { x: 14, z: 40 },
  ruins: { x: -22, z: 14 },
  sunlands: { x: -22, z: 22 },
  moonlands: { x: 22, z: 22 },
};

/** R0091 (WORLD-27): each region's own pressed flower (name and the colour it is drawn in). */
export const PETALS: Readonly<Record<RegionId, { name: string; colour: string } | undefined>> = {
  'little-grove': undefined,
  grove: { name: 'clover petal', colour: '#f2a6c4' },
  lane: undefined,
  village: undefined,
  shore: { name: 'sea-thrift petal', colour: '#f08fb0' },
  wood: { name: 'foxglove petal', colour: '#b87ad8' },
  ridge: { name: 'gentian petal', colour: '#5a8be8' },
  peaks: undefined,
  caves: undefined,
  ruins: { name: 'moss-rose petal', colour: '#e8a070' },
  sunlands: { name: 'marigold petal', colour: '#f4c430' },
  moonlands: { name: 'night-jasmine petal', colour: '#e8e4ff' },
  hollow: undefined,
};
