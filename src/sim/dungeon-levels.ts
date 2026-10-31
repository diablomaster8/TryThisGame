/**
 * The Hollow's levels as places you can go back to (lane B round 2, DUNG-08, -09, -11).
 *
 * - Level ids: an act level is `<act id>.<level>` (level 1 is the act's top), anything else
 *   `deep.<depth>`. Waypoints and the remembered levels use the same ids.
 * - Remembered levels (R0151): leaving a level writes what was taken, beaten, opened and seen
 *   into `run.levels`; coming back restores it, so cleared packs stay cleared.
 * - Stable act floors (R0149): each act's seed is set on first entry and kept in
 *   `world.hollow.actSeeds`; a "New paths" reroll replaces them once per real day.
 * - Waypoint stones (R0148): where they stand and which levels have one.
 *
 * Pure sim: no DOM.
 */
import { ACTS, actStartDepth } from '../config/dungeon-acts';
import { HOLLOW } from '../config/tuning';
import { cellDist, FLOOR, type Cell, type Floor } from './dungeon';
import type { Rng } from './rng';
import type { DungeonRun, LevelState, World } from './types';
import { zoneLevelId } from './dungeon-zones';

// ---------------------------------------------------------------- level ids

/** The id of the level a run stands on. */
export function levelIdOf(run: Pick<DungeonRun, 'act' | 'depth' | 'zone' | 'side'>): string {
  if (run.act === undefined) return `deep.${run.depth}`;
  const zone = zoneLevelId(run);
  if (zone) return zone;
  return `${ACTS[run.act]!.id}.${run.depth - actStartDepth(run.act) + 1}`;
}

/**
 * An act level id back into its act index and run depth; null for anything else. A camp or
 * field id (`rootways.town`) gives level 0, the act's top depth and its `zone`.
 */
export function parseLevelId(
  id: string,
): { act: number; level: number; depth: number; zone?: 'town' | 'field' } | null {
  const [name, n] = id.split('.');
  const act = ACTS.findIndex((a) => a.id === name);
  if (act >= 0 && (n === 'town' || n === 'field'))
    return { act, level: 0, depth: actStartDepth(act), zone: n };
  const level = Number(n);
  if (act < 0 || !Number.isInteger(level) || level < 1 || level > ACTS[act]!.levels.length)
    return null;
  return { act, level, depth: actStartDepth(act) + level - 1 };
}

// ---------------------------------------------------------------- remembered levels

/** Writes the level the run is leaving into `run.levels`, dropping the oldest past the cap. */
export function rememberLevel(run: DungeonRun): void {
  const id = levelIdOf(run);
  const levels = (run.levels ??= {});
  const state: LevelState = {
    taken: [...run.taken],
    packsCleared: (run.packs ?? []).filter((p) => p.state === 'beaten').map((p) => p.id),
    chestOpen: run.chestOpen,
    explored: run.explored,
    shrinesUsed: levels[id]?.shrinesUsed ?? [],
  };
  // Re-inserting keeps the object's key order oldest-first.
  delete levels[id];
  levels[id] = state;
  const keys = Object.keys(levels);
  for (let i = 0; i < keys.length - HOLLOW.levels.keep; i++) delete levels[keys[i]!];
}

/** After a fresh populate: puts back what the Keeper left on this level, if anything. */
export function restoreLevel(run: DungeonRun): boolean {
  const state = run.levels?.[levelIdOf(run)];
  if (!state) return false;
  run.taken = [...state.taken];
  run.chestOpen = state.chestOpen;
  run.explored = state.explored;
  for (const p of run.packs ?? [])
    if (state.packsCleared.includes(p.id)) {
      p.state = 'beaten';
      p.target = null;
    }
  return true;
}

// ---------------------------------------------------------------- act seeds

/** Act `act`'s floor seed, set the first time it is needed. */
export function actSeed(world: World, act: number, rng: Rng): number {
  const seeds = world.hollow.actSeeds;
  while (seeds.length <= act) seeds.push(0);
  if (!seeds[act]) seeds[act] = rng.int(1, 2_000_000_000);
  return seeds[act]!;
}

/** "New paths": every act's layout is drawn afresh, at most once per real day. */
export function rerollActSeeds(world: World, day: string): boolean {
  if (world.hollow.rerollDay === day) return false;
  world.hollow.rerollDay = day;
  // Cleared to 0, each act draws its new seed on the next entry.
  world.hollow.actSeeds = world.hollow.actSeeds.map(() => 0);
  return true;
}

// ---------------------------------------------------------------- waypoints

/** Whether act level `level` (1-based) has a waypoint stone: never the boss's level. */
export function hasWaypoint(act: number, level: number): boolean {
  const last = ACTS[act]!.levels.length;
  return level < last && (level - 1) % HOLLOW.waypoints.every === 0;
}

/** The waypoint id of the level the run is on, or null when it has none. */
export function waypointHere(
  run: Pick<DungeonRun, 'act' | 'depth' | 'story' | 'zone' | 'side'>,
): string | null {
  if (run.act === undefined || run.story) return null;
  // Camps and fields have a stone; side caves do not.
  // Lane B r9: nor do the secret levels (one visit at a time, through the camp's portal).
  if (run.zone) return run.zone === 'town' || run.zone === 'field' ? levelIdOf(run) : null;
  const level = run.depth - actStartDepth(run.act) + 1;
  return hasWaypoint(run.act, level) ? levelIdOf(run) : null;
}

const stoneCache = new WeakMap<Floor, Cell>();

/**
 * Where a floor's waypoint stone stands: the nearest open cell two or more steps from the
 * stairs up, clear of the chest, the stairs down and the loot. Found by a breadth-first walk,
 * so the same floor always puts it in the same place.
 */
export function waypointCell(f: Floor): Cell {
  if (f.stone) return f.stone;
  const hit = stoneCache.get(f);
  if (hit) return hit;
  const busy = new Set(f.loot.map((l) => l.cell.y * f.cols + l.cell.x));
  const ok = (c: Cell) =>
    cellDist(c, f.stairsUp) >= 2 &&
    cellDist(c, f.chest) >= 2 &&
    (!f.stairsDown || cellDist(c, f.stairsDown) >= 2) &&
    !busy.has(c.y * f.cols + c.x);
  const seen = new Uint8Array(f.cols * f.rows);
  const queue: Cell[] = [f.stairsUp];
  seen[f.stairsUp.y * f.cols + f.stairsUp.x] = 1;
  let found: Cell = f.stairsUp;
  for (let i = 0; i < queue.length; i++) {
    const c = queue[i]!;
    if (ok(c)) {
      found = c;
      break;
    }
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ] as const) {
      const x = c.x + dx;
      const y = c.y + dy;
      if (x < 0 || y < 0 || x >= f.cols || y >= f.rows) continue;
      const k = y * f.cols + x;
      if (seen[k] || f.cells[k] !== FLOOR) continue;
      seen[k] = 1;
      queue.push({ x, y });
    }
  }
  stoneCache.set(f, found);
  return found;
}
