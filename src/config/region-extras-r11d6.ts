/**
 * Round 11, helper d6: three per-region data tables the open world shares, keyed by region id
 * so each new region only adds a row.
 *
 * - `BEACON_LANDMARKS` (R0117, WORLD-50): the one tall landmark that marks each region from far
 *   away (at least `BEACON_MIN_HEIGHT_MUL` times a normal prop's height).
 * - `PHOTO_SPOTS` (R0138, WORLD-72): a framed vista per region; standing on it frames the beacon.
 * - `BUILD_PLOTS` (R0136, WORLD-70): an 8 x 8 unit plot per region that takes a few decor kinds.
 *
 * `at` is region-local. A row with no `at` is a region not laid out yet; its other fields stand.
 */
import type { RegionId } from './regions';
import type { DecorKind } from '../sim/types';

export const BEACON_MIN_HEIGHT_MUL = 3;

export interface BeaconLandmark {
  name: string;
  icon: string;
  /** A landmark id in `LANDMARKS` or a scenery id, when it already exists in the world. */
  landmark?: string;
  at?: { x: number; z: number };
  heightMul: number;
}

export const BEACON_LANDMARKS: Readonly<Record<Exclude<RegionId, 'little-grove'>, BeaconLandmark>> =
  {
    grove: {
      name: 'the windmill',
      icon: '🌬️',
      landmark: 'windmill',
      at: { x: -16, z: -5 },
      heightMul: 3,
    },
    lane: { name: 'the old signpost', icon: '🪧', heightMul: 3 },
    village: { name: 'the clock tower', icon: '🕰️', heightMul: 4 },
    shore: { name: 'the lighthouse', icon: '🗼', at: { x: 64, z: 7 }, heightMul: 5 },
    wood: { name: 'the great hollow oak', icon: '🌲', at: { x: -20, z: -35 }, heightMul: 4 },
    ridge: { name: 'the beacon stair', icon: '🪜', at: { x: 0, z: -66 }, heightMul: 3 },
    peaks: { name: 'the summit cairn and flag', icon: '🚩', heightMul: 4 },
    caves: { name: 'the glow-crystal spire', icon: '💠', heightMul: 3 },
    ruins: { name: 'the broken spire', icon: '🏛️', at: { x: 22, z: -24 }, heightMul: 5 },
    sunlands: { name: 'the gold dome', icon: '🔆', at: { x: 0, z: -31 }, heightMul: 4 },
    moonlands: { name: 'the moon crystal', icon: '💎', at: { x: 0, z: -31 }, heightMul: 4 },
    hollow: { name: 'the first lantern', icon: '🕯️', heightMul: 3 },
  };

export interface PhotoSpot {
  at?: { x: number; z: number };
  /** The beacon this vista frames (a `BEACON_LANDMARKS` key). */
  frames: Exclude<RegionId, 'little-grove'>;
}

export const PHOTO_SPOTS: Readonly<Record<Exclude<RegionId, 'little-grove'>, PhotoSpot>> = {
  grove: { at: { x: -3, z: -5 }, frames: 'grove' },
  lane: { frames: 'lane' },
  village: { frames: 'village' },
  shore: { frames: 'shore' },
  wood: { frames: 'wood' },
  ridge: { frames: 'ridge' },
  peaks: { frames: 'peaks' },
  caves: { frames: 'caves' },
  ruins: { frames: 'ruins' },
  sunlands: { frames: 'sunlands' },
  moonlands: { frames: 'moonlands' },
  hollow: { frames: 'hollow' },
};

export interface BuildPlot {
  at?: { x: number; z: number };
  /** Plots are 8 x 8 units. */
  size: 8;
  /** The decor kinds the plot takes (a few, so it stays a small, themed corner). */
  accepts: readonly DecorKind[];
}

const SMALL: readonly DecorKind[] = ['bench', 'flowerbed', 'lanternSmall', 'pathTile'];

/** The decor each plot takes: a small, calm set for now; a region can narrow or widen it. */
export const BUILD_PLOTS: Readonly<Record<Exclude<RegionId, 'little-grove'>, BuildPlot>> = {
  grove: { size: 8, accepts: SMALL },
  lane: { size: 8, accepts: SMALL },
  village: { size: 8, accepts: SMALL },
  shore: { size: 8, accepts: SMALL },
  wood: { size: 8, accepts: SMALL },
  ridge: { size: 8, accepts: SMALL },
  peaks: { size: 8, accepts: SMALL },
  caves: { size: 8, accepts: SMALL },
  ruins: { size: 8, accepts: SMALL },
  sunlands: { size: 8, accepts: SMALL },
  moonlands: { size: 8, accepts: SMALL },
  hollow: { size: 8, accepts: SMALL },
};
