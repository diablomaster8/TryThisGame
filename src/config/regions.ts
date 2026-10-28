/**
 * The open world's skeleton (WORLD-04): every region, its exits and its points of interest,
 * as data. The rules that read it are in `sim/regions.ts`. Today only the Grove (the hub),
 * the lane (the neighbours' gardens and the campaign's homes) and the Hollow Below are built;
 * the rest are declared so quests, the map and streaming can name them before they exist.
 * A region with `built: false` can be named but never entered.
 */
import type { Audience } from '../content/types';
import type { Season } from '../sim/types';

export type RegionId =
  | 'grove'
  | 'lane'
  | 'village'
  | 'shore'
  | 'wood'
  | 'ridge'
  | 'peaks'
  | 'caves'
  | 'ruins'
  | 'sunlands'
  | 'moonlands'
  | 'hollow'
  | 'little-grove';

export type Biome = 'meadow' | 'beach' | 'forest' | 'alpine' | 'cave' | 'ruin' | 'sun' | 'moon';

export interface RegionExit {
  id: string;
  /** Where the exit sits in this region (an axis-aligned box, in world units). */
  rect: { x: number; z: number; w: number; h: number };
  to: RegionId;
  /** Where the Keeper stands on arrival, and which way they face (radians). */
  arrive: { x: number; z: number };
  facing: number;
  kind: 'seamless' | 'gate' | 'door' | 'stairs';
  /** A flag that must be set before the exit opens (the storyline condition names). */
  unlock?: string;
}

export interface PoiDef {
  id: string;
  x: number;
  z: number;
  /** A landmark id in `LANDMARKS` when the POI is one (found by walking up to it). */
  landmark?: string;
}

export interface RegionDef {
  id: RegionId;
  size: { w: number; h: number };
  biome: Biome;
  /** Whether the region exists in the game yet (has a scene and can be entered). */
  built: boolean;
  exits: readonly RegionExit[];
  pois: readonly PoiDef[];
  /** Safe for the Learning Grove: no hazards, no strangers, nothing past `all`. */
  kidsSafe: boolean;
  audience: Audience;
  clock: 'real' | 'fixed' | { offsetH: number };
  season: 'world' | Season;
}

/** An exit as a 4-unit square centred on (x, z), arriving at (ax, az) in the other region. */
function way(
  id: string,
  to: RegionId,
  at: [number, number],
  arrive: [number, number],
  kind: RegionExit['kind'] = 'seamless',
  facing = 0,
): RegionExit {
  return {
    id,
    rect: { x: at[0] - 2, z: at[1] - 2, w: 4, h: 4 },
    to,
    arrive: { x: arrive[0], z: arrive[1] },
    facing,
    kind,
  };
}

/**
 * A not-yet-built region: named for quests and the map, never entered. Sizes and exits
 * follow WORLD-10's first graph; POI positions wait for each region's layout.
 */
function future(
  id: RegionId,
  biome: Biome,
  size: [number, number],
  pois: readonly string[],
  exits: readonly RegionExit[],
  extra: Partial<RegionDef> = {},
): RegionDef {
  return {
    id,
    size: { w: size[0], h: size[1] },
    biome,
    built: false,
    exits,
    pois: pois.map((p) => ({ id: p, x: 0, z: 0 })),
    kidsSafe: false,
    audience: 'all',
    clock: 'real',
    season: 'world',
    ...extra,
  };
}

const N = Math.PI;

export const REGIONS: Readonly<Record<RegionId, RegionDef>> = {
  grove: {
    id: 'grove',
    size: { w: 96, h: 96 },
    biome: 'meadow',
    built: true,
    exits: [
      {
        id: 'grove-gate',
        rect: { x: -2, z: 22, w: 4, h: 3 },
        to: 'lane',
        arrive: { x: 0, z: 4 },
        facing: N,
        kind: 'gate',
      },
      {
        id: 'grove-cave',
        rect: { x: -14, z: -15.2, w: 3.2, h: 3.2 },
        to: 'hollow',
        arrive: { x: 0, z: 0 },
        facing: 0,
        kind: 'stairs',
      },
      // WORLD-10: the ways out to the regions not built yet (taking one is refused until then).
      way('grove-marsh', 'shore', [12, 46], [-66, 0], 'seamless', N / 2),
      way('grove-wood', 'wood', [-28, -46], [0, 52], 'gate', N),
      way('grove-ridge', 'ridge', [46, -24], [0, 44], 'seamless', N),
      way('grove-sun', 'sunlands', [-46, -6], [0, 36], 'gate', N),
      way('grove-moon', 'moonlands', [-46, 6], [0, 36], 'gate', N),
    ],
    pois: [
      { id: 'bridge', x: 9.6, z: -4.2, landmark: 'bridge' },
      { id: 'well', x: 3, z: 10, landmark: 'well' },
      { id: 'falls', x: 12.4, z: -10.4, landmark: 'falls' },
      { id: 'cottage', x: -7, z: 12, landmark: 'cottage' },
      { id: 'dojo', x: 18, z: -2, landmark: 'dojo' },
      { id: 'school', x: -3, z: -16, landmark: 'school' },
      { id: 'old-tree', x: -8, z: -3, landmark: 'oldTree' },
      { id: 'south-bend', x: 11, z: 20, landmark: 'southBend' },
      { id: 'west-hill', x: -12, z: 13, landmark: 'westHill' },
      { id: 'north-wood', x: -28, z: -30, landmark: 'northWood' },
      { id: 'east-ridge', x: 30, z: -24, landmark: 'eastRidge' },
      { id: 'south-marsh', x: 6, z: 38, landmark: 'southMarsh' },
      { id: 'west-meadow', x: -32, z: 16, landmark: 'westMeadow' },
      { id: 'far-orchard', x: 26, z: 34, landmark: 'farOrchard' },
      { id: 'pond', x: 7, z: 6 },
      { id: 'windmill', x: -16, z: -5 },
      { id: 'gate', x: 0, z: 23 },
      { id: 'cave-mouth', x: -12.4, z: -13.6 },
      { id: 'kitchen-garden', x: -4, z: 18 },
      { id: 'stalls', x: 6, z: 18 },
    ],
    kidsSafe: true,
    audience: 'all',
    clock: 'real',
    season: 'world',
  },
  lane: {
    id: 'lane',
    size: { w: 24, h: 120 },
    biome: 'meadow',
    built: true,
    exits: [
      {
        id: 'lane-gate',
        rect: { x: -2, z: -60, w: 4, h: 4 },
        to: 'grove',
        arrive: { x: 0, z: 21 },
        facing: N,
        kind: 'gate',
      },
      way('lane-village', 'village', [0, 58], [0, -30], 'seamless', 0),
    ],
    pois: [
      { id: 'hazel-house', x: 0, z: 0 },
      { id: 'corvin-garden', x: 0, z: 0 },
      { id: 'neighbours', x: 0, z: 0 },
      { id: 'milestone', x: 0, z: 0 },
    ],
    kidsSafe: true,
    audience: 'all',
    clock: 'real',
    season: 'world',
  },
  hollow: {
    id: 'hollow',
    size: { w: 48, h: 48 },
    biome: 'cave',
    built: true,
    exits: [
      {
        id: 'hollow-stairs',
        rect: { x: -2, z: -2, w: 4, h: 4 },
        to: 'grove',
        arrive: { x: -12.4, z: -11.6 },
        facing: 0,
        kind: 'stairs',
      },
    ],
    pois: [
      { id: 'stairs', x: 0, z: 0 },
      { id: 'deep', x: 0, z: 0 },
    ],
    kidsSafe: false,
    audience: 'main',
    clock: 'fixed',
    season: 'world',
  },
  village: future(
    'village',
    'meadow',
    [80, 64],
    ['square', 'stalls', 'mill', 'inn', 'kettleby'],
    [way('village-lane', 'lane', [0, -30], [0, 56], 'seamless', N)],
  ),
  shore: future(
    'shore',
    'beach',
    [140, 48],
    ['beach', 'rock-pools', 'stilt-village', 'lagoon', 'bay'],
    [way('shore-marsh', 'grove', [-68, 0], [12, 43], 'seamless', N)],
  ),
  wood: future(
    'wood',
    'forest',
    [112, 112],
    ['clearing', 'deep-wood', 'old-oak', 'old-mill', 'woodcutter'],
    [
      way('wood-trail', 'grove', [0, 54], [-28, -43], 'gate', 0),
      way('wood-ruins', 'ruins', [54, 0], [-34, 0], 'gate', N / 2),
    ],
  ),
  ridge: future(
    'ridge',
    'alpine',
    [64, 96],
    ['track', 'lookout', 'hut'],
    [
      way('ridge-stair', 'grove', [0, 46], [43, -24], 'seamless', -N / 2),
      way('ridge-peaks', 'peaks', [0, -46], [0, 30], 'door', N),
    ],
  ),
  peaks: future(
    'peaks',
    'alpine',
    [64, 64],
    ['summit', 'pass', 'snowfield'],
    [
      way('peaks-ridge', 'ridge', [0, 30], [0, -43], 'door', 0),
      way('peaks-ice', 'caves', [20, -20], [0, 0], 'stairs', 0),
    ],
  ),
  caves: future(
    'caves',
    'cave',
    [48, 48],
    ['mouth', 'lake', 'crystals'],
    [way('caves-ice', 'peaks', [0, 0], [20, -17], 'stairs', 0)],
  ),
  ruins: future(
    'ruins',
    'ruin',
    [72, 72],
    ['temple', 'stones', 'archive'],
    [way('ruins-wood', 'wood', [-34, 0], [51, 0], 'gate', -N / 2)],
    { audience: 'main' },
  ),
  sunlands: future(
    'sunlands',
    'sun',
    [80, 80],
    ['dais'],
    [way('sun-gate', 'grove', [0, 38], [-43, -6], 'gate', 0)],
  ),
  moonlands: future(
    'moonlands',
    'moon',
    [80, 80],
    ['dais'],
    [way('moon-gate', 'grove', [0, 38], [-43, 6], 'gate', 0)],
  ),
  // Reached only from the Learning Grove, so it has no road to the rest of the world.
  'little-grove': future('little-grove', 'meadow', [40, 40], ['sandpit', 'swings'], [], {
    kidsSafe: true,
  }),
};

/** Region ids in display order (the map's tab strip). */
export const REGION_ORDER: readonly RegionId[] = [
  'grove',
  'lane',
  'village',
  'shore',
  'wood',
  'ridge',
  'peaks',
  'caves',
  'ruins',
  'sunlands',
  'moonlands',
  'hollow',
  'little-grove',
];

/**
 * Areas that are not regions: quests in the story worlds (Atlas, Arcade, Neopia, Multiverse)
 * and the indoor or timeless places the campaign stages. Quest areas may name these.
 */
export const STORY_AREAS = ['story-world', 'anywhere'] as const;
export type StoryArea = (typeof STORY_AREAS)[number];
