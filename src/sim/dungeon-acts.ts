/**
 * The Hollow's acts as play (R0145, DUNG-05): which acts are open, the floors of an act's
 * dungeon, and the boss at the bottom that opens the next act. The table is
 * `config/dungeon-acts.ts`; progress lives in `world.hollow.acts`. A run in an act carries
 * `DungeonRun.act`; its depth counts on from the acts above (`actStartDepth`), so light,
 * loot and foes keep growing act by act.
 */
import { fillRooms } from './dungeon-rooms';
import { ACTS, actStartDepth } from '../config/dungeon-acts';
import type { Difficulty } from '../config/dungeon-foes';
import type { Floor } from './dungeon';
import { generateV3 } from './dungeon-gen-v3';
import { platformFloor } from './dungeon-gaps';
import { placeUniques } from './dungeon-uniques';
import type { ActProgress, World } from './types';

const cache = new Map<string, Floor>();

/**
 * The floor at `depth` of act `act`'s dungeon for a run's seed, generated once. `version` 4
 * adds the platforming pass (R0031); a run saved on a version-3 floor keeps it flat.
 */
export function actFloor(
  seed: number,
  act: number,
  depth: number,
  version = 3,
  difficulty: Difficulty = 'cosy',
): Floor {
  // R0179: a tier changes the packs, so each tier's floor is its own.
  const key = `${seed}:${act}:${depth}:${version >= 4 ? 4 : 3}:${difficulty}`;
  let f = cache.get(key);
  if (!f) {
    const def = ACTS[act]!;
    const level = Math.max(0, Math.min(def.levels.length - 1, depth - actStartDepth(act)));
    f = generateV3(seed, depth, {
      level: def.levels[level]!,
      tileset: def.tileset,
      boss: level === def.levels.length - 1,
    });
    if (version >= 4) {
      const band = {
        act,
        level,
        boss: level === def.levels.length - 1,
        difficulty,
      };
      platformFloor(f, seed, depth, band);
      // The act's named uniques (R0156).
      placeUniques(f, act, level + 1, band);
      // R0201, R0198: no bare rooms; the act's own wild ones.
      fillRooms(f, seed, depth, act);
    }
    if (cache.size > 12) cache.delete(cache.keys().next().value!);
    cache.set(key, f);
  }
  return f;
}

/** The deepest level of act `act`'s dungeon, as a run depth. */
export function actBossDepth(act: number): number {
  return actStartDepth(act) + ACTS[act]!.levels.length - 1;
}

/** Act `act`'s progress, filling in any acts the save has not reached yet. */
export function actProgress(world: World, act: number): ActProgress {
  const acts = world.hollow.acts;
  while (acts.length <= act) acts.push({ bossDefeated: false, deepest: 0 });
  return acts[act]!;
}

/** The first act is always open; each later one once the boss above it is beaten. */
export function actOpen(world: World, act: number): boolean {
  if (act < 0 || act >= ACTS.length) return false;
  return act === 0 || world.hollow.acts[act - 1]?.bossDefeated === true;
}
