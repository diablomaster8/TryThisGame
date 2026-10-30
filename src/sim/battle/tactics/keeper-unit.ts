/**
 * The Keeper on the grid (recs FIGHT-66): a support piece of the player's side that nobody
 * can target and that blocks no tile ("they politely go round"). It has its own CT at Zip 12,
 * Move 4 and Jump 1, and three acts instead of moves: Snack toss (heals a quarter, range 3,
 * one of the snacks it packed), Cheer (allies beside it get Pumped) and Whistle (two allies
 * within 4 tiles swap places). It never counts towards winning or losing.
 */
import type { MoveDef } from '../types';
import { unitFromLevels } from './units';
import type { Cell } from './types';
import type { UnitSeed } from './engine';

export const KEEPER_UNIT = {
  id: 'keeper',
  zip: 12,
  move: 4,
  jump: 1,
  snacks: 3,
  heal: 0.25,
  snackRange: 3,
  whistleRange: 4,
} as const;

const base = {
  type: 'normal',
  align: 'none',
  power: 0,
  acc: 1,
  puff: 0,
  priority: 0,
  anim: 'keeper',
  source: 'lesson',
} as const;

export const KEEPER_MOVES: readonly MoveDef[] = [
  {
    ...base,
    id: 'keeper-snack',
    kind: 'support',
    heal: KEEPER_UNIT.heal,
    target: 'ally',
    special: 'snack',
    grid: { range: [1, KEEPER_UNIT.snackRange], aoe: 'single', heightReach: 3 },
  },
  {
    ...base,
    id: 'keeper-cheer',
    kind: 'support',
    target: 'allAllies',
    mood: { stat: 'bonk', delta: 1, chance: 1, who: 'target' },
    grid: { range: [0, 0], aoe: 'ring1', heightReach: 1 },
  },
];

const BY_ID = new Map(KEEPER_MOVES.map((m) => [m.id, m]));
export const keeperMoveById = (id: string): MoveDef | undefined => BY_ID.get(id);

/** The Keeper's seed: a plain body for the CT and the tiles; its HP never matters. */
export function keeperSeed(at?: Cell, name = 'Keeper'): UnitSeed {
  const seed = unitFromLevels({
    id: KEEPER_UNIT.id,
    side: 0,
    species: 'chao',
    level: 1,
    type: 'normal',
    moves: [],
    name,
    ...(at ? { at } : {}),
  });
  seed.c.zip = KEEPER_UNIT.zip;
  seed.c.nubbinId = null;
  seed.move = KEEPER_UNIT.move;
  seed.jump = KEEPER_UNIT.jump;
  seed.keeper = true;
  seed.snacks = KEEPER_UNIT.snacks;
  return seed;
}
