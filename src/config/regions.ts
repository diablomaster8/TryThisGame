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

/** A not-yet-built region: named for quests and the map, never entered. */
function future(
  id: RegionId,
  biome: Biome,
  size: number,
  pois: readonly string[],
  extra: Partial<RegionDef> = {},
): RegionDef {
  return {
    id,
    size: { w: size, h: size },
    biome,
    built: false,
    exits: [],
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
    size: { w: 40, h: 40 },
    biome: 'meadow',
    built: true,
    exits: [
      {
        id: 'lane-gate',
        rect: { x: -2, z: -2, w: 4, h: 3 },
        to: 'grove',
        arrive: { x: 0, z: 4 },
        facing: 0,
        kind: 'gate',
      },
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
  village: future('village', 'meadow', 64, ['square', 'stalls', 'mill', 'inn', 'kettleby']),
  shore: future('shore', 'beach', 96, ['beach', 'rock-pools', 'stilt-village', 'lagoon', 'bay']),
  wood: future('wood', 'forest', 96, ['clearing', 'deep-wood', 'old-oak', 'woodcutter']),
  ridge: future('ridge', 'alpine', 80, ['track', 'lookout', 'hut']),
  peaks: future('peaks', 'alpine', 64, ['summit', 'pass', 'snowfield']),
  caves: future('caves', 'cave', 48, ['mouth', 'lake', 'crystals']),
  ruins: future('ruins', 'ruin', 64, ['temple', 'stones', 'archive'], { audience: 'main' }),
  sunlands: future('sunlands', 'sun', 64, ['dais']),
  moonlands: future('moonlands', 'moon', 64, ['dais']),
  'little-grove': future('little-grove', 'meadow', 32, ['sandpit', 'swings'], { kidsSafe: true }),
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
