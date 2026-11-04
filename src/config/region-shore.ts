/**
 * WORLD-35 (R11 lane D, d7): the shore, a 140 × 48 strip south of the Grove. Its north-west
 * corner touches the Grove's south marsh with no load screen (a seamless border): the Grove's
 * stream runs on under a footbridge into the estuary and out to sea. West to east along the
 * beach path: the estuary, the open beach with its sandcastles, the rock pools, the stilt
 * village on its boardwalk over the water, the lagoon behind a sand bar, and the lighthouse on
 * the spit. The sea fills the south; dunes and sparse pines the north.
 *
 * The tide follows the real clock (high at 06:00 and 18:00) and only moves the drawn water
 * line, 4 units between high and low: the walk grid stops at the high-tide line, so the tide
 * never strands the Keeper. Region-local, centred, x east, z south.
 */
import type { PoiDef } from './regions';
import type { RegionSpec } from './region-layout';
import { SHORE_LOOK } from './tuning-r11d7';

/** The beach path, west (the Grove's border) to east (the lighthouse). */
export const SHORE_PATH: readonly { x: number; z: number }[] = [
  { x: -50, z: -22 },
  { x: -50, z: -19 },
  { x: -42, z: -14 },
  { x: -40, z: -4 },
  { x: -24, z: 0 },
  { x: -4, z: -1 },
  { x: 14, z: 1 },
  { x: 32, z: 4 },
  { x: 44, z: 6 },
  { x: 56, z: 2 },
  { x: 63, z: 4 },
];

/** The Grove's stream, on from its south edge to the sea. */
export const SHORE_STREAM: readonly { x: number; z: number }[] = [
  { x: -50, z: -32 },
  { x: -50, z: -20 },
  { x: -46, z: -8 },
  { x: -48, z: 4 },
  { x: -47, z: 16 },
];

export const SHORE_POIS: readonly PoiDef[] = [
  { id: 'shore-sign', x: -40, z: -17, tier: 'minor' },
  { id: 'estuary', x: -47, z: -2, tier: 'minor' },
  { id: 'beach', x: -20, z: 4, tier: 'major' },
  // The bay's edge between the beach and the pools (q55 and s6 meet here: where-map 'bay').
  { id: 'bay', x: -2, z: 8, tier: 'minor' },
  { id: 'rock-pools', x: 20, z: 5, tier: 'major' },
  { id: 'stilt-village', x: 43, z: 6, tier: 'major' },
  { id: 'lagoon', x: 56, z: -10, tier: 'minor' },
  { id: 'lighthouse', x: 64, z: 6, tier: 'minor' },
];

/** The stilt houses, standing on the boardwalk over the water (solid, drawn by the shore). */
export const SHORE_HOUSES: readonly { x: number; z: number }[] = [
  { x: 36, z: 11.6 },
  { x: 46, z: 11.6 },
  { x: 56, z: 11.6 },
];

/** Sandcastles on the open beach (WORLD-35: a Power Nubbin knocks them down, later). */
export const SHORE_CASTLES: readonly { x: number; z: number }[] = [
  { x: -30, z: 6 },
  { x: -12, z: 7 },
  { x: 4, z: 6 },
];

/** The rocks round the pools. */
export const SHORE_ROCKS: readonly { x: number; z: number; r: number }[] = [
  { x: 16, z: 8, r: 1 },
  { x: 25, z: 9, r: 1.2 },
  { x: 21, z: 2.4, r: 0.8 },
];

/** The lighthouse on the spit. */
export const SHORE_LIGHT = { x: 64, z: 7, r: 1.8 };

export const SHORE_SPEC: RegionSpec = {
  id: 'shore',
  size: { w: 140, h: 48 },
  seed: 0x5ea_5a1d,
  path: SHORE_PATH,
  loop: false,
  stream: SHORE_STREAM,
  // The footbridge where the Grove's stream comes in; the stepping stones at the mouth.
  crossings: [
    { x: -50, z: -19, r: 3 },
    { x: -47.5, z: 3, r: 2.2 },
  ],
  pois: SHORE_POIS,
  open: [
    // The beach, down to the high-tide line.
    { x: 0, z: 2, w: 140, h: 16 },
    // The landing band from the Grove's marsh, and the ground beyond the border (no margin trees).
    { x: -48, z: -15, w: 22, h: 18 },
    { x: -42, z: -30, w: 60, h: 18 },
    // The sand bar round the lagoon and the spit.
    { x: 64, z: 4, w: 12, h: 10 },
  ],
  water: [
    // The sea, from the high-tide line out past the margin.
    { x: 0, z: SHORE_LOOK.highTideZ + 16, w: 200, h: 32 },
    { x: 64, z: -10, w: 9, h: 12 },
    { x: 19, z: 5.6, w: 2.4, h: 1.6 },
    { x: 23.5, z: 7, w: 2.2, h: 1.4 },
  ],
  decks: [
    // Piers out from the sand between the stilt houses, the boardwalk along their sea side,
    // and a jetty for the boats.
    { x: 41, z: 12.4, w: 2.4, h: 5 },
    { x: 51, z: 12.4, w: 2.4, h: 5 },
    { x: 46, z: 15.6, w: 26, h: 3 },
    { x: 58, z: 19.4, w: 2.4, h: 5 },
  ],
  treeKeep: 0.35,
  spurs: [
    [
      { x: -50, z: -26 },
      { x: -50, z: -20 },
    ],
  ],
  solids: [
    ...SHORE_HOUSES.map((h) => ({ x: h.x, z: h.z, r: 2, w: 3.6, h: 2.4 })),
    ...SHORE_CASTLES.map((c) => ({ x: c.x, z: c.z, r: 0.7 })),
    ...SHORE_ROCKS,
    { x: SHORE_LIGHT.x, z: SHORE_LIGHT.z, r: SHORE_LIGHT.r },
    // The signpost.
    { x: -39, z: -18, r: 0.3 },
  ],
  micro: [
    { x: -36, z: -10 },
    { x: -24, z: -8 },
    { x: -8, z: -6 },
    { x: 8, z: -5 },
    { x: 28, z: -4 },
    { x: -34, z: 8 },
    { x: 12, z: 8 },
    { x: 30, z: 8 },
    { x: 60, z: -2 },
    { x: -2, z: 8.5 },
  ],
};

/**
 * The tide (WORLD-35): -1 at low water, +1 at high (06:00 and 18:00 on the device clock), a
 * smooth twice-a-day swing. Only the picture reads it.
 */
export function tideAt(hour: number): number {
  return Math.cos(((hour - 6) / 12) * Math.PI * 2);
}

/** Where the water's edge stands at this tide: the high-tide line, up to 4 units further out. */
export function waterlineZ(tide: number): number {
  return SHORE_LOOK.highTideZ + (SHORE_LOOK.tideRange * (1 - tide)) / 2;
}
