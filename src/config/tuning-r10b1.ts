/**
 * Lane B round 10, helper b1: the Hollow's tour bands (R0143) and per-act tile looks (R0144).
 */

/**
 * R0143 (DUNG-03): the full-clear walking tour per dungeon level, in world units (stairs up,
 * every find and the chest by nearest-first, then the stairs down; `sim/dungeon-tour.ts`).
 * Standard is the review's 750–1,100 u (3.5–5 min of walking). Small and big scale it by
 * their walkable area (about 0.7× and 1.4×). `share` is how many of 100 seeds must land in
 * band (the item's 95%). The generator re-rolls a floor that misses, up to `retries` times,
 * and keeps the closest; a floor in band on its first roll is unchanged.
 */
export const HOLLOW_TOUR = {
  bands: {
    small: [500, 850],
    standard: [750, 1100],
    big: [1000, 1550],
  } as const satisfies Record<string, readonly [number, number]>,
  share: 0.95,
  retries: 4,
  /** What each re-roll adds to the generator seed. */
  rollSalt: 0x2545f491,
};

/**
 * R0144: how each act's tileset paints its tiles, on top of its colours (`ACT_LOOKS`).
 * Pixel (`render/paint/dungeon-tiles.ts`): `floor` is the ground pattern, `wall` the face
 * pattern, `amount` how strongly they show. Full 3D (`render3d/hollow-rock.ts`): `rock` is
 * the painted wall texture and `ground` the floor's, with the strata numbers of
 * `GROVE3D.cave.rock.looks`. Every texture is painted once per floor (Pixel) or once per
 * session and kept (3D), never per frame.
 */
export type TileFloor = 'earth' | 'flags' | 'sand' | 'ice' | 'ash';
export type TileWall = 'strata' | 'hedge' | 'blocks' | 'icicles' | 'cinder';

export interface TileLook {
  floor: TileFloor;
  wall: TileWall;
  amount: number;
  rock: 'sandstone' | 'slate' | 'amber' | 'rock' | 'cobble' | 'plaster';
  ground: 'dirt' | 'cobble' | 'plaster' | 'rock';
  strata: { freq: number; amount: number; warp: number; thick: number; fungus: number };
}

export const TILE_LOOKS: Readonly<Record<string, TileLook>> = {
  rootways: {
    floor: 'earth',
    wall: 'strata',
    amount: 0,
    rock: 'sandstone',
    ground: 'dirt',
    strata: { freq: 2.4, amount: 0.9, warp: 1.6, thick: 0.6, fungus: 0.0 },
  },
  cloister: {
    floor: 'flags',
    wall: 'hedge',
    amount: 0.7,
    rock: 'cobble',
    ground: 'cobble',
    strata: { freq: 3.2, amount: 0.5, warp: 0.6, thick: 0.55, fungus: 0.3 },
  },
  sandglass: {
    floor: 'sand',
    wall: 'blocks',
    amount: 0.75,
    rock: 'plaster',
    ground: 'plaster',
    strata: { freq: 1.6, amount: 1.0, warp: 0.4, thick: 0.5, fungus: 0.0 },
  },
  frostbell: {
    floor: 'ice',
    wall: 'icicles',
    amount: 0.75,
    rock: 'slate',
    ground: 'rock',
    strata: { freq: 4.0, amount: 0.7, warp: 2.4, thick: 0.7, fungus: 0.0 },
  },
  gloom: {
    floor: 'ash',
    wall: 'cinder',
    amount: 0.6,
    rock: 'rock',
    ground: 'dirt',
    strata: { freq: 3.0, amount: 0.6, warp: 1.8, thick: 0.6, fungus: 0.1 },
  },
};
