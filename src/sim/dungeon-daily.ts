/**
 * Today's Hollow as a fixed act chain (R0185, DUNG-42, lane B round 9): five levels in one
 * act's look, picked from the date alone, with a boss at the bottom. Every Keeper on the same
 * day gets the same floors, packs and loot, since everything comes from the day's seed. It
 * simply refreshes each day: no streak, nothing lost for a missed day.
 *
 * Pure sim: no DOM.
 */
import { ACTS } from '../config/dungeon-acts';
import { HOLLOW_R9C } from '../config/dungeon-r9-c';
import type { Floor } from './dungeon';
import { fillRooms } from './dungeon-rooms';
import { generateV3 } from './dungeon-gen-v3';
import { platformFloor } from './dungeon-gaps';
import { placeUniques } from './dungeon-uniques';
import type { DungeonRun } from './types';

const D = HOLLOW_R9C.daily;

/** How many levels today's chain has. */
export const DAILY_LEVELS = D.shape.length;

/** Today's act look, from the day's seed only. */
export function dailyActOf(seed: number): number {
  return Math.abs(Math.floor(seed)) % ACTS.length;
}

const cache = new Map<string, Floor>();

/** Level `depth` (1-based) of today's chain for `seed`, in act `act`'s look. */
export function dailyActFloor(seed: number, act: number, depth: number, version = 4): Floor {
  const d = Math.max(1, Math.min(DAILY_LEVELS, Math.round(depth)));
  const key = `${seed}:${act}:${d}:${version >= 4 ? 4 : 3}`;
  let f = cache.get(key);
  if (!f) {
    const def = ACTS[act]!;
    const boss = d === DAILY_LEVELS;
    f = generateV3(seed, d, { level: D.shape[d - 1]!, tileset: def.tileset, boss });
    if (version >= 4) {
      // The act's foes at a gentle band: the chain is for everyone, new Keepers too.
      const level = Math.min(def.levels.length - 1, d - 1);
      const band = { act, level, boss, difficulty: 'cosy' as const };
      platformFloor(f, seed, d, band);
      placeUniques(f, act, level + 1, band);
      fillRooms(f, seed, d, act);
    }
    if (cache.size > 8) cache.delete(cache.keys().next().value!);
    cache.set(key, f);
  }
  return f;
}

/** Is this run on today's chain? */
export function onDailyChain(run: DungeonRun): boolean {
  return run.daily !== null && run.dailyAct !== undefined && run.act === undefined;
}

/** At the chain's bottom, is the boss down (or was there none)? */
export function dailyBossDown(run: DungeonRun): boolean {
  const boss = run.packs?.find((p) => p.id === 'pack-boss');
  return !boss || boss.state === 'beaten';
}
