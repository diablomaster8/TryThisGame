/**
 * The grid-tactics mode's data (recs FIGHT-50 to FIGHT-59). A `TacticsState` is plain JSON
 * like the turn mode's `BattleState`: the map travels as base64 strings, the random generator
 * only as `rngState`, and the log holds events, never sentences. Each unit wraps a turn-mode
 * `Combatant`, so the damage formula, statuses and moods are the same ones the turn mode uses.
 */
import type { AiLevel, BattleContext, BattleEvent, Combatant, SideIx } from '../types';

export interface Cell {
  x: number;
  y: number;
}

/** Tile kinds, one byte each. Walls, trees and lanterns block; everything else can be stood on. */
export const TILE = {
  grass: 0,
  wall: 1,
  deep: 2,
  shallow: 3,
  crystal: 4,
  /** A lantern post: blocks, and lights the tiles within `TACTICS.terrain.lanternRadius`. */
  lantern: 5,
  tall: 6,
  path: 7,
  mud: 8,
  shade: 9,
  /** A fruit tree: blocks; shaking it from next door drops a fruit (FIGHT-56). */
  tree: 10,
  /** The crop plot (the protectPlot objective). */
  plot: 11,
  /** An exit tile (the escort and reach objectives). */
  exit: 12,
} as const;
export type TileKind = (typeof TILE)[keyof typeof TILE];

/** A map in memory. `height` is 0..4; a blocking tile's height is its top. */
export interface GridMap {
  w: number;
  h: number;
  tiles: Uint8Array;
  height: Uint8Array;
  deploy: { a: Cell[]; b: Cell[] };
}

/** A map as it travels in the state and the save. */
export interface SerialMap {
  w: number;
  h: number;
  tiles: string;
  height: string;
  deploy: { a: Cell[]; b: Cell[] };
}

/** North is −y. */
export type Dir = 'n' | 'e' | 's' | 'w';

export type JobId =
  'tumbler' | 'puddler' | 'glider' | 'dasher' | 'bonker' | 'helper' | 'lanternKeeper';

/** A job layer from the alignment band (FIGHT-55). */
export type JobLayer = 'sunny' | 'moony' | null;

export interface TUnit {
  /** The wrapped turn-mode combatant (stats, HP, Puff, statuses, moods). */
  c: Combatant;
  x: number;
  y: number;
  face: Dir;
  ct: number;
  job: JobId;
  layer: JobLayer;
  move: number;
  jump: number;
  /** May enter deep water. */
  swimmer: boolean;
  /** A champion or final species: one extra move slot in grid mode. */
  extraSlot: boolean;
  /** Seeded tie-break order. */
  order: number;
  /** A protected unit (the escort critter): foes never aim at it and it is never tuckered. */
  ward?: boolean;
  /** The Keeper's piece (FIGHT-66): untargetable, blocks nobody, never counts for the result. */
  keeper?: boolean;
  snacks?: number;
  /** Friendship with each ally, by combatant id (FIGHT-57). */
  friends?: Record<string, number>;
  /** The extra grid-only move of a champion or final species. */
  bonus?: string;
  /** A boss's scripted phases (FIGHT-59): below `atHpPct` it switches to `moveset`. */
  phases?: { atHpPct: number; moveset: string[]; line: number }[];
}

/** A charged move waiting to land (FIGHT-53). */
export interface Charge {
  by: string;
  move: string;
  x: number;
  y: number;
  /** Ticks left. */
  left: number;
}

export type ObjectiveKind =
  | 'tuckerAll'
  | 'calmBoss'
  | 'escort'
  | 'holdLanterns'
  | 'gather'
  | 'reach'
  | 'protectPlot'
  | 'surviveRounds';

export interface Objective {
  kind: ObjectiveKind;
  /** calmBoss: the boss's id. escort: the critter's id. reach and escort: the goal tile. */
  target?: string;
  goal?: Cell;
  /** holdLanterns: lanterns to keep lit; gather: fruit to collect; survive/hold: rounds. */
  count?: number;
  rounds?: number;
}

/** What an objective has reached so far (the objective chip reads it). */
export interface ObjectiveProgress {
  /** Rounds passed (one round = every standing unit has had a turn, counted by the CT clock). */
  rounds: number;
  /** Units that have had a turn this round. */
  seen: string[];
  /** gather: fruit picked, by side. */
  got: [number, number];
  /** holdLanterns: which lantern posts are lit, by "x,y". */
  lit: Record<string, boolean>;
  /** protectPlot: consecutive turns a foe has stood on the plot. */
  onPlot: number;
}

export type TacticsAction =
  | { k: 'move'; x: number; y: number }
  | { k: 'undo' }
  | { k: 'act'; move: string; x: number; y: number }
  | { k: 'together'; with: string; x: number; y: number }
  | { k: 'shake'; x: number; y: number }
  | { k: 'relight'; x: number; y: number }
  | { k: 'whistle'; a: string; b: string }
  | { k: 'wait'; face: Dir };

export type TacticsEvent =
  | BattleEvent
  | { k: 'turn'; who: string; tick: number }
  | { k: 'step'; who: string; path: Cell[] }
  | { k: 'undo'; who: string }
  | { k: 'wait'; who: string; face: Dir }
  | { k: 'charge'; who: string; move: string; x: number; y: number; ticks: number }
  | { k: 'fall'; who: string; dmg: number }
  | { k: 'facing'; to: string; side: 'front' | 'side' | 'back' }
  | { k: 'pileOn'; to: string }
  | { k: 'combo'; combo: string; a: string; b: string }
  | { k: 'reflect'; who: string; dmg: number }
  | { k: 'knock'; who: string; x: number; y: number }
  | { k: 'fruit'; x: number; y: number }
  | { k: 'pick'; who: string }
  | { k: 'lantern'; x: number; y: number; lit: boolean }
  | { k: 'objective'; done: boolean }
  | { k: 'phase'; who: string; line: number }
  | { k: 'shadowSkip'; who: string };

export interface TacticsResult {
  winner: SideIx | null;
  reason: 'tuckered' | 'objective' | 'failed' | 'forfeit' | 'time';
}

export interface TacticsState {
  v: 1;
  seed: number;
  rngState: number;
  /** CT ticks so far. */
  tick: number;
  /** Turns taken so far, by anyone. */
  turns: number;
  map: SerialMap;
  units: TUnit[];
  /** The unit taking its turn, or null between turns. */
  active: string | null;
  /** The active unit's turn so far: where it started (for undo) and what it has done. */
  moved: boolean;
  acted: boolean;
  from: Cell | null;
  charges: Charge[];
  /** Fruit lying on tiles (shaken from a tree, or the gather objective's). */
  fruit: Cell[];
  objective: Objective;
  progress: ObjectiveProgress;
  /** How each side chooses; a side with no level is the player's. */
  ai: [AiLevel | null, AiLevel | null];
  /** The active Keeper's team aura (FIGHT-55). */
  aura: 'sun' | 'moon' | null;
  /** Recent hits, for the pile-on (FIGHT-57). */
  hits: { to: string; side: SideIx; tick: number }[];
  /** The active unit before its Move, for Undo (JSON of the unit, the fruit and the progress). */
  snap: string | null;
  log: TacticsEvent[];
  result: TacticsResult | null;
  context: BattleContext;
  settled?: boolean;
}
