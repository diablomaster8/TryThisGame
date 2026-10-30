import type { Collider } from './grove-layout';

/**
 * R0095 (WORLD-32): the village at the end of the lane, as data both renderers draw. Until
 * seamless streaming (WORLD-39) can hold a second region, the village is the Grove's
 * south-west corner where the lane runs out (`LOOK_K.beetle.road` ends at -14, 32): a paved
 * square with a fountain, and one building for each `TownRole` service that appears when
 * prosperity reaches its threshold (`TOWN.unlocks`). Every 20 prosperity hangs one more set of
 * dressing, so the square gets visibly more cheerful. Recruits walk a loop by their role's
 * building (`sim/village.ts`). Grove coordinates, +z south.
 */
export type VillageService = 'stall' | 'gym' | 'attendant' | 'fortune' | 'festival';

export interface VillageBuilding {
  id: VillageService;
  x: number;
  z: number;
  /** Turn about y, radians; 0 faces +z (south), toward the camera's default view. */
  yaw: number;
  /** Half width and half depth of the footprint (and its collider). */
  hw: number;
  hd: number;
  /** Roof height above the ground, for the collider top and the pixel sprite's size. */
  h: number;
}

export const VILLAGE = {
  /** The square's centre and paving radius. */
  square: { x: -21, z: 39.5, r: 6.2 },
  fountain: { r: 1.2, h: 0.55, spout: 1.5 },
  /** The five service buildings, each facing the fountain. */
  buildings: [
    { id: 'stall', x: -14.8, z: 37.2, yaw: -1.2, hw: 1.2, hd: 0.5, h: 2.4 },
    { id: 'gym', x: -27.2, z: 36.6, yaw: 1.05, hw: 1.9, hd: 1.5, h: 2.9 },
    { id: 'attendant', x: -27.4, z: 43.4, yaw: 2.1, hw: 1.7, hd: 1.4, h: 2.6 },
    { id: 'fortune', x: -14.8, z: 43.4, yaw: -2.1, hw: 1.2, hd: 1.2, h: 2.6 },
    { id: 'festival', x: -21, z: 45.6, yaw: Math.PI, hw: 2.2, hd: 1.0, h: 2.2 },
  ] as readonly VillageBuilding[],
  /** Prosperity per dressing set; set `i` hangs from `(i + 1) × step`. */
  dressingStep: 20,
  /** The dressing sets in the order they hang: bunting, lanterns, flower boxes, pennants, arch. */
  dressing: ['bunting', 'lanterns', 'flowers', 'pennants', 'arch'] as const,
  /** Recruits: how far from their building's front they walk, and how long a loop takes. */
  loop: { r: 1.2, out: 3.2, ms: 14_000, max: 12 },
  /** A recruit's figure: height and pick radius (world units; the pick is at least 44 px). */
  figure: { h: 0.9, pick: 0.6 },
} as const;

/** The village's pick ids: `village:<service>` for buildings, `village:r<i>` for recruits. */
export const VILLAGE_PICK = 'village:';

/** The buildings' colliders, each standing only once its service is open. */
export function villageColliders(): Collider[] {
  return VILLAGE.buildings.map((b) => ({
    id: `village-${b.id}`,
    x: b.x,
    z: b.z,
    yaw: b.yaw,
    shape: { type: 'box', hw: b.hw, hd: b.hd },
    top: b.h,
    flags: ['solid'],
    when: b.id,
  }));
}

/** Recruits' figure colours by role, the same in both renderers (a role reads at a glance). */
export const ROLE_COLOURS = {
  stall: '#f0a040',
  gym: '#e05a4a',
  attendant: '#5ab0e0',
  fortune: '#a070d0',
  festival: '#f0d040',
  guard: '#7aa860',
} as const;
