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
