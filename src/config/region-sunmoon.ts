/**
 * WORLD-34 (R11 lane D, d7): the Sun and Moon lands, real places past the Grove's west gates
 * (the gates open with the first adult of each alignment, `exitLocked`). Each is 80 × 80.
 *
 * - The Sun lands, held at noon: white and gold stone gardens climbing in three terraces from
 *   the gate, joined by ramps; a halo-ball fountain on the middle terrace, the gold dome on the
 *   top one, rose walks and the Sun-only critter spots in the corners.
 * - The Moon lands, held at night: a flat purple shore round the lantern lake, a jetty out over
 *   the water, the moon crystal spire to the north, a firefly glade and a crystal garden.
 *
 * Region-local, centred, x east and z south; the gate is on the south edge of each.
 */
import type { PoiDef } from './regions';
import type { RegionSpec } from './region-layout';

export const SUN_TERRACES = [
  { z0: -40, z1: -14, y: 2.8 },
  { z0: -10, z1: 14, y: 1.4 },
  { z0: 18, z1: 40, y: 0 },
] as const;

export const SUN_POIS: readonly PoiDef[] = [
  { id: 'sun-gate', x: 0, z: 37, tier: 'minor' },
  { id: 'fountain', x: 0, z: 2, tier: 'major' },
  { id: 'dais', x: 0, z: -27, tier: 'major' },
  { id: 'east-garden', x: 26, z: 2, tier: 'minor' },
  { id: 'west-garden', x: -26, z: 2, tier: 'minor' },
  { id: 'sun-spot-east', x: 28, z: -28, tier: 'minor' },
  { id: 'sun-spot-west', x: -28, z: -28, tier: 'minor' },
  { id: 'rose-walk', x: 22, z: 30, tier: 'minor' },
];

/** The fountain, the gold dome, and the colonnade on the top terrace's front. */
export const SUN_FOUNTAIN = { x: 0, z: 2, r: 2.4 };
export const SUN_DOME = { x: 0, z: -31, r: 3.4 };
export const SUN_COLUMNS: readonly { x: number; z: number }[] = [-20, -8, 8, 20].map((x) => ({
  x,
  z: -16,
}));

export const SUN_SPEC: RegionSpec = {
  id: 'sunlands',
  size: { w: 80, h: 80 },
  seed: 0x5a_17,
  path: [
    { x: 0, z: 40 },
    { x: 0, z: 22 },
    { x: 0, z: 6 },
    { x: 12, z: -4 },
    { x: 12, z: -20 },
    { x: 0, z: -26 },
    { x: -12, z: -20 },
    { x: -12, z: -4 },
    { x: 0, z: 6 },
  ],
  loop: false,
  pois: SUN_POIS,
  open: [
    { x: 0, z: 29, w: 40, h: 18 },
    { x: 0, z: 2, w: 60, h: 20 },
    { x: 0, z: -27, w: 46, h: 22 },
  ],
  treeKeep: 0.75,
  terraces: SUN_TERRACES,
  solids: [SUN_FOUNTAIN, SUN_DOME, ...SUN_COLUMNS.map((c) => ({ x: c.x, z: c.z, r: 0.5 }))],
  micro: [
    { x: -14, z: 30 },
    { x: 14, z: 26 },
    { x: -26, z: 24 },
    { x: 30, z: 8 },
    { x: -30, z: -4 },
    { x: 18, z: -6 },
    { x: -18, z: 10 },
    { x: 24, z: -32 },
    { x: -24, z: -22 },
    { x: 8, z: -36 },
  ],
};

export const MOON_POIS: readonly PoiDef[] = [
  { id: 'moon-gate', x: 0, z: 37, tier: 'minor' },
  { id: 'lantern-lake', x: 0, z: 14, tier: 'major' },
  { id: 'spire', x: 0, z: -28, tier: 'major' },
  { id: 'firefly-glade', x: -28, z: 22, tier: 'major' },
  { id: 'crystal-garden', x: 28, z: -24, tier: 'major' },
  { id: 'moon-stones', x: 28, z: 22, tier: 'minor' },
  { id: 'west-shore', x: -26, z: -6, tier: 'minor' },
];

/** The lake, its jetty, the spire and the lanterns that ring the shore path. */
export const MOON_LAKE = { x: 0, z: -4, w: 30, h: 20 };
export const MOON_SPIRE = { x: 0, z: -31, r: 2.6 };
export const MOON_PATH: readonly { x: number; z: number }[] = [
  { x: 0, z: 22 },
  { x: -18, z: 16 },
  { x: -24, z: -4 },
  { x: -18, z: -20 },
  { x: 0, z: -24 },
  { x: 18, z: -20 },
  { x: 24, z: -4 },
  { x: 18, z: 16 },
];
export const MOON_LANTERNS: readonly { x: number; z: number }[] = MOON_PATH.map((p) => ({
  x: p.x + Math.sign(p.x || 1) * 3.2,
  z: p.z + (p.z > 0 ? 2.6 : -2.6),
}));

export const MOON_SPEC: RegionSpec = {
  id: 'moonlands',
  size: { w: 80, h: 80 },
  seed: 0x40_0e,
  path: MOON_PATH,
  loop: true,
  pois: MOON_POIS,
  spurs: [
    [
      { x: 0, z: 40 },
      { x: 0, z: 22 },
    ],
  ],
  water: [MOON_LAKE],
  decks: [{ x: 0, z: 9, w: 2.4, h: 8 }],
  treeKeep: 0.65,
  solids: [MOON_SPIRE, ...MOON_LANTERNS.map((l) => ({ x: l.x, z: l.z, r: 0.3 }))],
  micro: [
    { x: -30, z: 30 },
    { x: -22, z: 26 },
    { x: -32, z: 16 },
    { x: 24, z: -30 },
    { x: 32, z: -18 },
    { x: 30, z: 26 },
    { x: -10, z: 30 },
    { x: 10, z: 30 },
    { x: -30, z: -30 },
    { x: 12, z: -34 },
  ],
};
