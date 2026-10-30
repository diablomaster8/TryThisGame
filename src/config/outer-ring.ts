import type { Collider, WildArt } from './grove-layout';

/**
 * R0072 (WORLD-06): what stands at the five outer-ring places, so their names promise
 * something you can find: the north wood, the east ridge, the south marsh, the west meadow
 * and the far orchard. One list read by both renderers (the pixel painter in
 * `render/paint/outer-ring.ts`, the 3D kit pieces in `render3d/outer-ring.ts`) and by the
 * sim's colliders, so the two views match and nothing walks through a cairn. A piece with
 * `tap` answers a tap with a line (`strings-world.ts`, `OUTER_TEXT.tap`); each place has one.
 */
export type OuterArt =
  | 'mushroom-ring'
  | 'moss-log'
  | 'signpost'
  | 'toadstools'
  | 'fern'
  | 'stair'
  | 'cairn'
  | 'telescope'
  | 'scree'
  | 'gentians'
  | 'reeds'
  | 'lily'
  | 'boardwalk'
  | 'lane-gate'
  | 'cattails'
  | 'hay'
  | 'scarecrow'
  | 'poppies'
  | 'hay-cart'
  | 'orchard-tree'
  | 'cider-press'
  | 'beehive'
  | 'apple-crate'
  | 'ladder';

export type OuterPlace = 'northWood' | 'eastRidge' | 'southMarsh' | 'westMeadow' | 'farOrchard';

export type OuterTap =
  | 'fairyRing'
  | 'trail'
  | 'telescope'
  | 'stiltLane'
  | 'scarecrow'
  | 'hive'
  /** R0129: a piece made for a gag (`content/world-gags.ts`) and nothing else. */
  | 'gag';

export interface OuterProp {
  id: string;
  place: OuterPlace;
  art: OuterArt;
  x: number;
  z: number;
  /** World width of the pixel sprite; the 3D piece is sized from it. */
  size: number;
  /** Turn about the vertical (radians); the 3D piece only, the pixel sprite faces the camera. */
  yaw?: number;
  tap?: OuterTap;
  /** Collider radius: keeper-only for trees, solid for the rest (none when absent). */
  solid?: number;
}

/** Each place's pieces; every one has at least five kinds and one tappable piece. */
export const OUTER_PROPS: readonly OuterProp[] = [
  // The north wood: a fairy ring in a clearing, a mossy log, ferns and the Wood's trail head.
  {
    id: 'nw-ring',
    place: 'northWood',
    art: 'mushroom-ring',
    x: -25.5,
    z: -26.5,
    size: 2.6,
    tap: 'fairyRing',
  },
  { id: 'nw-log', place: 'northWood', art: 'moss-log', x: -24, z: -31, size: 2.6, yaw: 0.5 },
  {
    id: 'nw-sign',
    place: 'northWood',
    art: 'signpost',
    x: -26,
    z: -34,
    size: 1.4,
    tap: 'trail',
    solid: 0.25,
  },
  { id: 'nw-stools', place: 'northWood', art: 'toadstools', x: -31.5, z: -26.5, size: 1.3 },
  { id: 'nw-fern-1', place: 'northWood', art: 'fern', x: -28.5, z: -34.5, size: 1.5 },
  { id: 'nw-fern-2', place: 'northWood', art: 'fern', x: -33, z: -30.5, size: 1.4 },
  // The east ridge: steps cut into the slope, a cairn, a telescope toward the Sun Lands.
  { id: 'er-stair', place: 'eastRidge', art: 'stair', x: 28, z: -21, size: 2.6 },
  { id: 'er-cairn', place: 'eastRidge', art: 'cairn', x: 32, z: -26.5, size: 1.4, solid: 0.45 },
  {
    id: 'er-scope',
    place: 'eastRidge',
    art: 'telescope',
    x: 33.5,
    z: -22.5,
    size: 1.4,
    tap: 'telescope',
    solid: 0.35,
  },
  { id: 'er-scree', place: 'eastRidge', art: 'scree', x: 27.5, z: -28, size: 1.6 },
  { id: 'er-flowers', place: 'eastRidge', art: 'gentians', x: 31, z: -20, size: 1.4 },
  // The south marsh: reeds and cattails on the west bank, lilies on the stream, a boardwalk
  // along the bank and the gate where the lane to the stilt village starts.
  { id: 'sm-reeds-1', place: 'southMarsh', art: 'reeds', x: 9.4, z: 34, size: 1.7 },
  { id: 'sm-reeds-2', place: 'southMarsh', art: 'reeds', x: 9.6, z: 41.5, size: 1.7 },
  { id: 'sm-lily-1', place: 'southMarsh', art: 'lily', x: 11.6, z: 36.5, size: 1.2 },
  { id: 'sm-lily-2', place: 'southMarsh', art: 'lily', x: 11.8, z: 40, size: 1.0 },
  {
    id: 'sm-walk',
    place: 'southMarsh',
    art: 'boardwalk',
    x: 8.2,
    z: 38,
    size: 3.8,
    yaw: Math.PI / 2,
  },
  {
    id: 'sm-gate',
    place: 'southMarsh',
    art: 'lane-gate',
    x: 5,
    z: 44.5,
    size: 3,
    tap: 'stiltLane',
  },
  { id: 'sm-cattails', place: 'southMarsh', art: 'cattails', x: 3, z: 39.5, size: 1.3 },
  // R0129: the nibbled "Do not feed the Nubbins" sign.
  {
    id: 'sm-sign',
    place: 'southMarsh',
    art: 'signpost',
    x: 4.5,
    z: 35.5,
    size: 1.5,
    tap: 'gag',
    solid: 0.25,
  },
  // The west meadow: a ring of hay bales to play in, a scarecrow, poppies and a hay cart.
  { id: 'wm-hay-1', place: 'westMeadow', art: 'hay', x: -30, z: 13, size: 1.6 },
  { id: 'wm-hay-2', place: 'westMeadow', art: 'hay', x: -33.5, z: 12.5, size: 1.6, yaw: 0.3 },
  { id: 'wm-hay-3', place: 'westMeadow', art: 'hay', x: -36, z: 16.5, size: 1.6, yaw: 1.4 },
  { id: 'wm-hay-4', place: 'westMeadow', art: 'hay', x: -35.5, z: 22.5, size: 1.6, yaw: 0.2 },
  { id: 'wm-hay-5', place: 'westMeadow', art: 'hay', x: -28.5, z: 20, size: 1.6, yaw: -0.3 },
  {
    id: 'wm-crow',
    place: 'westMeadow',
    art: 'scarecrow',
    x: -28.5,
    z: 17,
    size: 2,
    tap: 'scarecrow',
    solid: 0.3,
  },
  { id: 'wm-poppies', place: 'westMeadow', art: 'poppies', x: -30.5, z: 23, size: 1.5 },
  {
    id: 'wm-cart',
    place: 'westMeadow',
    art: 'hay-cart',
    x: -38.5,
    z: 19.5,
    size: 2.4,
    yaw: 0.4,
    solid: 0.8,
  },
  // The far orchard: three more trees in rows, a cider press, a beehive, crates and a ladder.
  {
    id: 'fo-tree-1',
    place: 'farOrchard',
    art: 'orchard-tree',
    x: 21,
    z: 30,
    size: 5.6,
    solid: 0.45,
  },
  {
    id: 'fo-tree-2',
    place: 'farOrchard',
    art: 'orchard-tree',
    x: 33,
    z: 29.5,
    size: 5.4,
    solid: 0.45,
  },
  {
    id: 'fo-tree-3',
    place: 'farOrchard',
    art: 'orchard-tree',
    x: 27,
    z: 39,
    size: 5.6,
    solid: 0.45,
  },
  {
    id: 'fo-press',
    place: 'farOrchard',
    art: 'cider-press',
    x: 27.5,
    z: 34.5,
    size: 1.8,
    solid: 0.55,
  },
  {
    id: 'fo-hive',
    place: 'farOrchard',
    art: 'beehive',
    x: 23.5,
    z: 35,
    size: 1.2,
    tap: 'hive',
    solid: 0.3,
  },
  { id: 'fo-crate', place: 'farOrchard', art: 'apple-crate', x: 25, z: 32.5, size: 1.2 },
  // R0129: the signpost whose every arrow points to the Grove.
  {
    id: 'fo-sign',
    place: 'farOrchard',
    art: 'signpost',
    x: 21.5,
    z: 33,
    size: 1.5,
    tap: 'gag',
    solid: 0.25,
  },
  { id: 'fo-ladder', place: 'farOrchard', art: 'ladder', x: 29.2, z: 32.6, size: 1.6, yaw: 0.6 },
];

/**
 * The north wood's extra trees (it promises a wood: 15 with the nine already there). They
 * are wild trees in both renderers, keeper-only colliders like the others.
 */
export const OUTER_TREES: ReadonlyArray<{ art: WildArt; x: number; z: number; size: number }> = [
  { art: 'wild-3', x: -36, z: -35, size: 6.0 },
  { art: 'wild-2', x: -20, z: -41, size: 5.8 },
  { art: 'wild-1', x: -39, z: -41, size: 6.2 },
  { art: 'wild-4', x: -43, z: -29, size: 6.0 },
  { art: 'wild-2', x: -33, z: -45, size: 5.6 },
  { art: 'wild-3', x: -9, z: -44, size: 5.6 },
];

/** The colliders of the pieces above that stand in the way, in the collider list's form. */
export function outerColliders(): Collider[] {
  const out: Collider[] = [];
  for (const p of OUTER_PROPS)
    if (p.solid)
      out.push({
        id: `outer-${p.id}`,
        x: p.x,
        z: p.z,
        yaw: 0,
        shape: { type: 'circle', r: p.solid },
        top: p.art === 'orchard-tree' ? 4 : 1.2,
        flags: [p.art === 'orchard-tree' ? 'keeperOnly' : 'solid'],
      });
  OUTER_TREES.forEach((t, i) =>
    out.push({
      id: `outer-tree-${i}`,
      x: t.x,
      z: t.z,
      yaw: 0,
      shape: { type: 'circle', r: 0.45 },
      top: 4,
      flags: ['keeperOnly'],
    }),
  );
  return out;
}

/** The tap a building pick id (`outer:<piece id>`) stands for, or null. */
export function outerTapOf(pickId: string): OuterTap | null {
  return OUTER_PROPS.find((p) => `outer:${p.id}` === pickId)?.tap ?? null;
}
