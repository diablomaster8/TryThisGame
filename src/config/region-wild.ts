import type { NubbinType, Personality } from '../sim/types';
import type { Biome } from './regions';

/**
 * R11 lane D, helper d8: the living half of a drawn region, as data keyed by region id so a
 * new region only adds its lines.
 *
 * - `REGION_CRITTERS` (R0120, WORLD-53): the species a region's critter spots hold, three of the
 *   fifteen, by the types the region favours, and where the spots sit. Respawning is fine: it is
 *   an ambient resource, never a chore or a quest.
 * - `BIOME_REACTIONS` (R0121, WORLD-54): what a partner does on first stepping into a biome,
 *   by personality, and the type lean that first visit adds.
 * - `REGION_GATES` (R0110, WORLD-24): stat-shaped gates on optional ground, never the story.
 */
export interface CritterSpot {
  id: string;
  x: number;
  z: number;
}

export interface RegionCritters {
  types: readonly NubbinType[];
  species: readonly [string, string, string];
  spots: readonly CritterSpot[];
}

export const REGION_CRITTERS: Record<string, RegionCritters | undefined> = {
  // The wood favours Power and Normal: a bear and a tiger-sized shyness, a raccoon and a sheep.
  wood: {
    types: ['power', 'normal'],
    species: ['bear', 'raccoon', 'sheep'],
    spots: [
      { id: 'w1', x: -22, z: 22 },
      { id: 'w2', x: -40, z: -4 },
      { id: 'w3', x: -20, z: -36 },
      { id: 'w4', x: 30, z: -26 },
      { id: 'w5', x: 24, z: 24 },
    ],
  },
  // R12 d2: the other drawn regions, each with the animals its biome would hold. A table with no
  // `spots` has them placed on open, reachable ground by `sim/region-critters.ts`, seeded per region.
  shore: { types: ['swim'], species: ['penguin', 'seal', 'turtle'], spots: [] },
  ridge: { types: ['fly'], species: ['condor', 'swallow', 'peacock'], spots: [] },
  ruins: { types: ['power', 'normal'], species: ['wolf', 'skunk', 'gorilla'], spots: [] },
  sunlands: { types: ['run'], species: ['cheetah', 'rabbit', 'deer'], spots: [] },
  moonlands: { types: ['fly', 'normal'], species: ['bat', 'raccoon', 'koala'], spots: [] },
};

export const CRITTER_RULES = {
  /** How close the Keeper must come to take one (world units). */
  takeRadius: 1.5,
  /** Play time before a taken spot holds another. */
  respawnMs: 20 * 60_000,
  /** Most critters live on screen at once (the active ring). */
  maxLive: 6,
} as const;

export interface BiomeReaction {
  /** What the partner does for about `ms`: a state its sprite already has. */
  state: 'play' | 'sit' | 'greet' | 'wander';
  /** Stay close to the Keeper's back (the shy one hides behind). */
  hide?: boolean;
  /** A short phrase for the toast and the dev gallery. */
  line: string;
}

export const REACTION_MS = 2000;

/** The type lean a first visit to a biome adds to the partner (+0.5, once per region). */
export const BIOME_LEAN: Partial<Record<Biome, NubbinType>> = {
  forest: 'power',
  beach: 'swim',
  alpine: 'fly',
  meadow: 'run',
  ruin: 'power',
  sun: 'run',
  moon: 'normal',
};
export const BIOME_LEAN_AMOUNT = 0.5;

const WOOD: Record<Personality, BiomeReaction> = {
  cheerful: { state: 'play', line: 'skips between the trunks' },
  shy: { state: 'sit', hide: true, line: 'hides behind your legs' },
  mischievous: { state: 'play', line: 'rustles every bush' },
  curious: { state: 'play', line: 'sniffs every leaf' },
  gentle: { state: 'sit', line: 'stays by your side' },
  bold: { state: 'play', line: 'marches on ahead' },
  dreamy: { state: 'sit', line: 'gazes at the light' },
  lazy: { state: 'sit', line: 'flops onto the moss' },
};
const OPEN: Record<Personality, BiomeReaction> = {
  cheerful: { state: 'play', line: 'runs ahead' },
  shy: { state: 'sit', hide: true, line: 'stays close' },
  mischievous: { state: 'play', line: 'digs a little hole' },
  curious: { state: 'play', line: 'sniffs every leaf' },
  gentle: { state: 'sit', line: 'stays by your side' },
  bold: { state: 'play', line: 'marches on ahead' },
  dreamy: { state: 'sit', line: 'gazes at the light' },
  lazy: { state: 'sit', line: 'flops down' },
};

/**
 * Reactions by biome and personality (R12 d2: the 4 x 4 table, one distinct line each, reusing
 * the states the sprites already have: play, sit, greet, wander). A biome with no entry uses the
 * open one.
 */
export const BIOME_REACTIONS: Partial<Record<Biome, Record<Personality, BiomeReaction>>> = {
  forest: WOOD,
  meadow: OPEN,
  beach: {
    cheerful: { state: 'play', line: 'runs straight into the shallows' },
    shy: { state: 'sit', hide: true, line: 'hides behind your legs and peeks at the waves' },
    mischievous: { state: 'play', line: 'digs a hole in the sand' },
    curious: { state: 'play', line: 'sniffs at everything new' },
    gentle: { state: 'sit', line: 'stays close and takes it in' },
    bold: { state: 'play', line: 'marches on ahead' },
    dreamy: { state: 'sit', line: 'gazes off and smiles' },
    lazy: { state: 'sit', line: 'flops onto the warm sand' },
  },
  alpine: {
    cheerful: { state: 'play', line: 'bounds up the slope' },
    shy: { state: 'sit', hide: true, line: 'tucks in tight against your leg' },
    mischievous: { state: 'play', line: 'rolls a lopsided snowball' },
    curious: { state: 'play', line: 'sniffs at everything new' },
    gentle: { state: 'sit', line: 'stays close and takes it in' },
    bold: { state: 'play', line: 'marches on ahead' },
    dreamy: { state: 'sit', line: 'gazes off and smiles' },
    lazy: { state: 'sit', line: 'flops into the snow' },
  },
  ruin: {
    cheerful: { state: 'play', line: 'tiptoes between the columns' },
    shy: { state: 'sit', hide: true, line: 'stays very close, very quiet' },
    mischievous: { state: 'play', line: 'pokes every crack in the wall' },
    curious: { state: 'play', line: 'sniffs at everything new' },
    gentle: { state: 'sit', line: 'stays close and takes it in' },
    bold: { state: 'play', line: 'marches on ahead' },
    dreamy: { state: 'sit', line: 'gazes off and smiles' },
    lazy: { state: 'sit', line: 'sits on a fallen column' },
  },
  sun: {
    cheerful: { state: 'play', line: 'dances in the warm light' },
    shy: { state: 'sit', hide: true, line: 'peeks out from behind you' },
    mischievous: { state: 'play', line: 'chases its own shadow' },
    curious: { state: 'play', line: 'sniffs at everything new' },
    gentle: { state: 'sit', line: 'stays close and takes it in' },
    bold: { state: 'play', line: 'marches on ahead' },
    dreamy: { state: 'sit', line: 'gazes off and smiles' },
    lazy: { state: 'sit', line: 'melts into a sunny patch' },
  },
  moon: {
    cheerful: { state: 'play', line: 'chases the fireflies' },
    shy: { state: 'sit', hide: true, line: 'stays under your lantern' },
    mischievous: { state: 'play', line: 'bats at the glowing crystals' },
    curious: { state: 'play', line: 'sniffs at everything new' },
    gentle: { state: 'sit', line: 'stays close and takes it in' },
    bold: { state: 'play', line: 'marches on ahead' },
    dreamy: { state: 'sit', line: 'gazes off and smiles' },
    lazy: { state: 'sit', line: 'curls up by the quiet lake' },
  },
};

/** The four kinds of gate (R0110): the stat that opens each, and the level it asks. */
export type GateKind = 'boulder' | 'deepWater' | 'updraft' | 'longRun';
export const GATE_STAT: Record<GateKind, 'power' | 'swim' | 'fly' | 'run'> = {
  boulder: 'power',
  deepWater: 'swim',
  updraft: 'fly',
  longRun: 'run',
};
export const GATE_LEVEL = 25;

export interface RegionGate {
  id: string;
  kind: GateKind;
  x: number;
  z: number;
  /** The gate's own footprint, world units (the Keeper is kept out while it holds). */
  r: number;
  /** The optional ground behind it: a circle that holds no story and no quest area. */
  behind: { x: number; z: number; r: number };
  /** What lies there, once: shells, an essence of a type. */
  reward: { shells?: number; essence?: NubbinType };
}

export const REGION_GATES: Record<string, readonly RegionGate[] | undefined> = {
  wood: [
    {
      id: 'wood-boulder',
      kind: 'boulder',
      x: -46.2,
      z: -18.3,
      r: 1.6,
      behind: { x: -52, z: -20, r: 4 },
      reward: { shells: 120, essence: 'power' },
    },
  ],
};

/** How near a partner must stand to a gate to try it, and how long it takes (ms). */
export const GATE_RULES = { reach: 3.4, openMs: 2500 } as const;
