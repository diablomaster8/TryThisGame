/**
 * WORLD-36 (R11 lane D, d7): the ridge, a vertical region: a 64 × 160 climb east of the Grove,
 * crossed into on foot over the Grove's east edge (a seamless border, re-based like the shore's).
 * Five terraces rise north from the foot of the ridge by the waterfall to the summit, each
 * joined to the next by one switchback ramp through the cliff between (the only way up: a
 * cliff is never walked off the path). From level 3 up the snow lies all year. At the top: the
 * summit and its telescope, and the mouth of the ice caves (lane B's dungeons attach there).
 * Region-local, centred, x east and z south; the summit is north (z -66).
 */
import type { PoiDef } from './regions';
import type { RegionSpec } from './region-layout';

export const RIDGE_TERRACES = [
  { z0: -80, z1: -40, y: 10 },
  { z0: -34, z1: -12, y: 7.5 },
  { z0: -6, z1: 16, y: 5 },
  { z0: 22, z1: 44, y: 2.5 },
  { z0: 50, z1: 80, y: 0 },
] as const;

/** The switchback: from the Grove border up each ramp (x ±14, alternating) to the summit. */
export const RIDGE_PATH: readonly { x: number; z: number }[] = [
  { x: -28, z: 66 },
  { x: -6, z: 68 },
  { x: 14, z: 58 },
  { x: 14, z: 40 },
  { x: -2, z: 32 },
  { x: -14, z: 26 },
  { x: -14, z: 12 },
  { x: 2, z: 4 },
  { x: 14, z: -2 },
  { x: 14, z: -16 },
  { x: -2, z: -22 },
  { x: -14, z: -30 },
  { x: -14, z: -44 },
  { x: -4, z: -58 },
  { x: 0, z: -66 },
];

export const RIDGE_POIS: readonly PoiDef[] = [
  { id: 'ridge-foot', x: -18, z: 70, tier: 'major' },
  { id: 'waterfall', x: -24, z: 54, tier: 'minor' },
  { id: 'track', x: 0, z: 32, tier: 'minor' },
  { id: 'hut', x: -18, z: 4, tier: 'major' },
  { id: 'lookout', x: 22, z: -24, tier: 'minor' },
  { id: 'summit', x: 0, z: -66, tier: 'major' },
  { id: 'ice-cave', x: 22, z: -60, tier: 'minor' },
];

/** The level from which the snow lies all year (WORLD-31). */
export const RIDGE_SNOW_Y = 7.5;
export const RIDGE_HUT = { x: -18, z: 1, r: 2.4 };
export const RIDGE_TELESCOPE = { x: 3, z: -68, r: 0.5 };
export const RIDGE_CAVE = { x: 22, z: -63, r: 2.6 };
/** The waterfall pours off level 1's cliff into a pool at the foot. */
export const RIDGE_FALLS = { x: -24, z: 47, w: 3.2 };
export const RIDGE_POOL = { x: -24, z: 53, w: 7, h: 4 };

export const RIDGE_SPEC: RegionSpec = {
  id: 'ridge',
  size: { w: 64, h: 160 },
  seed: 0x41d6e,
  path: RIDGE_PATH,
  loop: false,
  pois: RIDGE_POIS,
  open: [
    // The landing from the Grove, and its ground beyond the border (no margin trees there).
    { x: -26, z: 66, w: 12, h: 12 },
    { x: -38, z: 66, w: 12, h: 40 },
    // Each terrace's open alp (pines stand along its sides and in front of the cliffs).
    ...RIDGE_TERRACES.map((t) => ({ x: 0, z: (t.z0 + t.z1) / 2, w: 40, h: t.z1 - t.z0 - 5 })),
  ],
  water: [RIDGE_POOL],
  treeKeep: 0.7,
  terraces: RIDGE_TERRACES,
  solids: [RIDGE_HUT, RIDGE_TELESCOPE, RIDGE_CAVE],
  micro: [
    { x: 8, z: 72 },
    { x: -2, z: 54 },
    { x: 24, z: 30 },
    { x: -24, z: 36 },
    { x: 20, z: 8 },
    { x: -6, z: -2 },
    { x: 24, z: -30 },
    { x: -24, z: -20 },
    { x: 12, z: -56 },
    { x: -16, z: -64 },
  ],
};
