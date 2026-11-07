import { DERIVED_HATS } from '../config/tuning-more/story-open-lines';
import { arcadeDone, atlasDone, type CrossSaves } from './cross-saves';
import { festivalsUnlocked } from './atlas';
import type { World } from './types';

/**
 * R0630 (CAMP-38): what the story worlds grant the Grove, computed, never copied. The Atlas,
 * Pixel's Arcade and the Multiverse are read-only to Hazel's Grove, so a reward they give (a hat,
 * a festival) is a pure function of the side saves, recomputed at load: `serialize(world)` never
 * changes when a page is played, and if the side save goes, the reward goes with it.
 * Entries are `hat:<id>` and `festival:<id>`.
 */
export function derivedUnlocks(x: CrossSaves): Set<string> {
  const out = new Set<string>();
  for (const [source, hat] of Object.entries(DERIVED_HATS)) {
    const done = source.startsWith('PA') ? arcadeDone(x, source) : atlasDone(x, source);
    if (done) out.add(`hat:${hat}`);
  }
  for (const f of festivalsUnlocked(x)) out.add(`festival:${f}`);
  return out;
}

/** The set the running game last computed (runtime only: never part of the world or the save). */
let current: ReadonlySet<string> = new Set();

export function setDerivedUnlocks(set: ReadonlySet<string>): void {
  current = set;
}

export function hasDerivedHat(hat: string): boolean {
  return current.has(`hat:${hat}`);
}

/** Hats the Keeper may put on: the bought ones plus the derived ones, each once. */
export function wearableHats(world: World): string[] {
  const derived = [...current].filter((k) => k.startsWith('hat:')).map((k) => k.slice(4));
  return [...new Set([...world.inventory.hats, ...derived])];
}

/**
 * On load: a Nubbin wearing a hat the save no longer owns and the side saves no longer give
 * (the side save was cleared) takes it off. Only hats a side save can give are ever taken off,
 * so a hat from anywhere else stays on. Returns how many were taken off.
 */
export function unequipMissingHats(world: World): number {
  let n = 0;
  const ok = new Set(wearableHats(world));
  const derived = new Set<string>(Object.values(DERIVED_HATS));
  for (const nub of world.nubbins)
    if (nub.hat && derived.has(nub.hat) && !ok.has(nub.hat)) {
      nub.hat = null;
      n++;
    }
  return n;
}
