/**
 * WORLD-25: the Wood's layout, the template every later region follows. A 112 × 112 forest
 * entered from the Grove's north wood by a tree tunnel on its south edge. A main path loops
 * through it (about 260 units, some 80 seconds at a walk) past three clearings (the logs
 * clearing, the mushroom ring and the Wishing Oak), the old mill on its stream, a lookout on
 * the ridge, a hollow-tree shortcut and a vine wall a Power Nubbin can pull down. Off the path
 * the trees stand close; only trunks within 3 units of a walkable cell are solid.
 *
 * Data only: the region is not drawn yet (`built: false` in `regions.ts`), so these numbers
 * feed the map, the POI-spacing tool, the jump-route check and the tests, and the renderers
 * build from them when the Wood is drawn. Coordinates are region-local, centred, x east and
 * z south, like the Grove's.
 */
import type { JumpRoute } from './region-jumps';
import type { PoiDef } from './regions';

/** The main path, a closed loop of points walked in order (the last joins the first). */
export const WOOD_PATH: readonly { x: number; z: number }[] = [
  { x: 0, z: 46 },
  { x: -6, z: 30 },
  { x: -22, z: 22 },
  { x: -34, z: 14 },
  { x: -40, z: -4 },
  { x: -34, z: -24 },
  { x: -20, z: -36 },
  { x: 0, z: -40 },
  { x: 18, z: -36 },
  { x: 30, z: -26 },
  { x: 36, z: -8 },
  { x: 34, z: 8 },
  { x: 24, z: 24 },
  { x: 10, z: 36 },
];

/** The stream the mill sits on: it runs north to south down the east side. */
export const WOOD_STREAM: readonly { x: number; z: number }[] = [
  { x: 44, z: -56 },
  { x: 42, z: -30 },
  { x: 40, z: -6 },
  { x: 41, z: 2 },
  { x: 44, z: 24 },
  { x: 46, z: 56 },
];

/** Points of interest, tiered for the spacing ladder (WORLD-11). */
export const WOOD_POIS: readonly PoiDef[] = [
  { id: 'wood-gate', x: 0, z: 50, tier: 'minor' },
  { id: 'clearing', x: -6, z: 28, tier: 'major' },
  { id: 'mushroom-ring', x: -36, z: 10, tier: 'major' },
  { id: 'old-oak', x: -20, z: -34, tier: 'major' },
  { id: 'old-mill', x: 38, z: 2, tier: 'major' },
  { id: 'lookout', x: 28, z: -30, tier: 'minor' },
  { id: 'hollow-tree', x: -16, z: 2, tier: 'minor' },
  { id: 'vine-wall', x: 14, z: -14, tier: 'minor' },
  { id: 'deep-wood', x: -42, z: -42, tier: 'minor' },
  { id: 'woodcutter', x: 20, z: 40, tier: 'minor' },
  { id: 'mill-bridge', x: 41, z: 6, tier: 'micro' },
];

/**
 * Small things to poke at between the bigger ones: stumps, a fallen log, a fern bank, a
 * mushroom cluster, a bird box. Kept here as plain spots; the renderers dress them.
 */
export const WOOD_MICRO: readonly { x: number; z: number }[] = [
  { x: -46, z: 40 },
  { x: -26, z: 40 },
  { x: -10, z: 44 },
  { x: 30, z: 46 },
  { x: -48, z: 22 },
  { x: -12, z: 14 },
  { x: 8, z: 18 },
  { x: 26, z: 14 },
  { x: -50, z: -12 },
  { x: -28, z: -10 },
  { x: -4, z: -4 },
  { x: 22, z: -2 },
  { x: 50, z: -20 },
  { x: -40, z: -28 },
  { x: -6, z: -22 },
  { x: 8, z: -52 },
  { x: 38, z: -48 },
  { x: -24, z: -52 },
  { x: 52, z: 38 },
  { x: 50, z: 10 },
];

/**
 * The Wood's jump routes (WORLD-21), each with its walking way round: stepping stones over the
 * stream (the mill bridge is the way round), a ledge ladder up to the lookout (the ramp from
 * the path), a double-jump shortcut through the hollow tree's roots, and a glide drop from the
 * lookout back to the path.
 */
export const WOOD_JUMPS: readonly JumpRoute[] = [
  {
    id: 'stream-stones',
    kind: 'stones',
    gap: 1.6,
    rise: 0,
    run: false,
    from: { x: 38, z: 20 },
    to: { x: 47, z: 22 },
    walkAround: 'mill-bridge',
  },
  {
    id: 'lookout-ledges',
    kind: 'ledge',
    gap: 0.6,
    rise: 0.9,
    run: false,
    from: { x: 26, z: -24 },
    to: { x: 28, z: -30 },
    walkAround: 'lookout',
  },
  {
    id: 'root-shortcut',
    kind: 'double',
    gap: 1.2,
    rise: 1.5,
    run: false,
    from: { x: -18, z: 6 },
    to: { x: -16, z: 0 },
    walkAround: 'hollow-tree',
  },
  {
    id: 'lookout-glide',
    kind: 'glide',
    gap: 4,
    rise: -1.8,
    run: false,
    from: { x: 28, z: -30 },
    to: { x: 31, z: -27 },
    walkAround: 'lookout',
  },
];

/** Solid trunks stand only this close to a walkable cell; beyond, the canopy is scenery. */
export const WOOD_SOLID_TRUNK_REACH = 3;

/** Length of a closed loop, world units. */
export function loopLength(path: readonly { x: number; z: number }[]): number {
  let n = 0;
  for (let i = 0; i < path.length; i++) {
    const a = path[i]!;
    const b = path[(i + 1) % path.length]!;
    n += Math.hypot(b.x - a.x, b.z - a.z);
  }
  return n;
}
