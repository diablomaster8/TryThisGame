/**
 * Terrain effects (recs FIGHT-56): what each tile kind does to movement, hits and turns.
 * Costs are counted in half-moves so a path tile (cost 0.5) stays an integer; a route's total
 * is rounded up once, at the end ("rounded per path"). Lantern light is every walkable tile
 * within two steps of a lit lantern post; shade is the shade tile (under trees, the Hollow's
 * dark). Every function here is pure; the engine applies them.
 */
import { TACTICS } from '../../../config/tuning-tactics';
import type { MoveDef } from '../types';
import { inside, tileAt } from './map';
import { TILE, type GridMap } from './types';

const T = TACTICS.terrain;

/** The eight kinds a player can read off a tile (the long-press card). */
export type TerrainKind =
  | 'grass'
  | 'tall'
  | 'path'
  | 'mud'
  | 'shallow'
  | 'deep'
  | 'lantern'
  | 'light'
  | 'shade'
  | 'crystal'
  | 'tree'
  | 'wall'
  | 'plot'
  | 'exit';

/** What the tile card names: lantern light counts as its own kind on a plain tile. */
export function terrainOf(
  m: GridMap,
  x: number,
  y: number,
  lit?: Record<string, boolean>,
): TerrainKind {
  const t = tileAt(m, x, y);
  switch (t) {
    case TILE.wall:
      return 'wall';
    case TILE.deep:
      return 'deep';
    case TILE.shallow:
      return 'shallow';
    case TILE.crystal:
      return 'crystal';
    case TILE.lantern:
      return 'lantern';
    case TILE.tall:
      return 'tall';
    case TILE.path:
      return 'path';
    case TILE.mud:
      return 'mud';
    case TILE.shade:
      return 'shade';
    case TILE.tree:
      return 'tree';
    case TILE.plot:
      return 'plot';
    case TILE.exit:
      return 'exit';
    default:
      return inLantern(m, x, y, lit) ? 'light' : 'grass';
  }
}

/** Half-moves to enter a tile, or null when the unit may not (deep water without Swim). */
export function stepCost(m: GridMap, x: number, y: number, swimmer: boolean): number | null {
  const t = tileAt(m, x, y);
  if (t === TILE.deep) return swimmer ? T.deepCost * 2 : null;
  if (t === TILE.path) return T.pathCost * 2;
  if (t === TILE.mud) return T.mudCost * 2;
  return 2;
}

/** Lit lanterns: all of them unless the holdLanterns objective says which are lit. */
export function lanternLit(x: number, y: number, lit?: Record<string, boolean>): boolean {
  return !lit || lit[`${x},${y}`] !== false;
}

/** Within lantern light: a lit lantern post within `lanternRadius` steps (Manhattan). */
export function inLantern(
  m: GridMap,
  x: number,
  y: number,
  lit?: Record<string, boolean>,
): boolean {
  const r = T.lanternRadius;
  for (let dy = -r; dy <= r; dy++)
    for (let dx = -r; dx <= r; dx++) {
      if (Math.abs(dx) + Math.abs(dy) > r || !inside(m, x + dx, y + dy)) continue;
      if (tileAt(m, x + dx, y + dy) === TILE.lantern && lanternLit(x + dx, y + dy, lit))
        return true;
    }
  return false;
}

export const isShade = (m: GridMap, x: number, y: number): boolean =>
  tileAt(m, x, y) === TILE.shade;
export const isWater = (m: GridMap, x: number, y: number): boolean => {
  const t = tileAt(m, x, y);
  return t === TILE.shallow || t === TILE.deep;
};

/**
 * The attacker's terrain factor: Sun moves +10% in lantern light, Moon moves +10% in shade,
 * Swim moves +10% from shallow water. `align` is the move's alignment after any fruit.
 */
export function attackTerrain(
  m: GridMap,
  x: number,
  y: number,
  move: MoveDef,
  align: 'sun' | 'moon' | 'none',
  lit?: Record<string, boolean>,
): number {
  let k = 1;
  if (align === 'sun' && inLantern(m, x, y, lit)) k *= T.lanternMoves;
  if (align === 'moon' && isShade(m, x, y)) k *= T.shadeMoves;
  if (move.type === 'swim' && tileAt(m, x, y) === TILE.shallow) k *= T.swimInShallow;
  return k;
}

/** Tall grass: +10% Flutter. */
export function flutterBonus(m: GridMap, x: number, y: number): number {
  return tileAt(m, x, y) === TILE.tall ? T.tallGrassFlutter : 0;
}

/** Tall grass hides its unit from anything reaching further than three tiles. */
export function hiddenFrom(m: GridMap, x: number, y: number, dist: number): boolean {
  return tileAt(m, x, y) === TILE.tall && dist > T.tallGrassHideBeyond;
}

/** A crystal tile throws back a quarter of the splash damage it takes. */
export function reflectOf(m: GridMap, x: number, y: number, move: MoveDef, dmg: number): number {
  if (tileAt(m, x, y) !== TILE.crystal || move.kind !== 'splash') return 0;
  return Math.floor(dmg * T.crystalReflect);
}
