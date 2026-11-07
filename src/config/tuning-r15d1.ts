/**
 * Lane D round 15, d1: the Sun and Moon lands' secrets (R0096, WORLD-28/34). Region-local
 * wanted spots; the sim snaps each to the nearest open, reachable ground (`spotNear`).
 */
import type { RegionId } from './regions';

export interface RegionSecret {
  x: number;
  z: number;
  reward: { decor: 'statue'; shells: number };
}

export const REGION_SECRETS: Partial<Record<RegionId, RegionSecret>> = {
  // Behind the colonnade's west end, by the top terrace's far corner.
  sunlands: { x: -34, z: -34, reward: { decor: 'statue', shells: 30 } },
  // Past the crystal garden, at the lake-side's far north-east corner.
  moonlands: { x: 34, z: -32, reward: { decor: 'statue', shells: 30 } },
};

/**
 * R0099 (WORLD-40): the kid-safe slice of a region the Learning Grove may walk in (region-local).
 * Outside it, in the Learning Grove, the Keeper is held in, a walk target is pulled to the edge,
 * and no way out or arrival lands beyond it. The beach is the shore's west stretch from the
 * Grove's marsh to the sandcastles; the first clearing is the Wood's south end by its gate.
 */
export interface EduSlice {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  /** Units the Keeper keeps in from the edge. */
  margin: number;
}

export const EDU_REGION_BOUNDS: Partial<Record<RegionId, EduSlice>> = {
  shore: { minX: -54, maxX: -6, minZ: -26, maxZ: 11, margin: 0.6 },
  wood: { minX: -18, maxX: 14, minZ: 18, maxZ: 55, margin: 0.6 },
};

/** The picture signposts' own icon and name for the places the Learning Grove reaches. */
export const EDU_SLICE_SIGNS: Partial<Record<RegionId, { icon: string; name: string }>> = {
  shore: { icon: '🏖️', name: 'the beach' },
  wood: { icon: '🌳', name: 'the clearing' },
};

/**
 * R0118 (WORLD-51): the snow slide on the ridge's snow (the terraces from `RIDGE_SNOW_Y` up,
 * where it lies all year, so this is not a seasonal rule). On the stick the Keeper runs at
 * `speedMul` and steers and brakes slowly: velocity eases toward the stick at `rate` per second,
 * and coasts on after the stick is let go until it falls under `stopSpeed`. Tap walks are
 * unchanged (they steer themselves).
 */
export const SNOW_SLIDE = {
  speedMul: 1.4,
  rate: 2.4,
  stopSpeed: 0.2,
} as const;
