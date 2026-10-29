/**
 * R0295 (FUN-06): pick what a Keeper says when tapped outside a scene, from
 * `content/barks.ts`: the sets for this chapter, plus the rain or night set when it is
 * raining or night (outside the Long Night). Seeded, and never one of that Keeper's last
 * three lines. The memory is transient: a reload may repeat a line once.
 */
import { BARKS, QUIET_CHAPTERS, type BarkSet } from '../content/barks';
import { isNight } from './side-rule-kit';
import type { Rng } from './rng';
import type { World } from './types';

const RECENT = 3;
const recent = new WeakMap<World, Map<string, string[]>>();

/** Every line this Keeper might say now. */
export function barkPool(world: World, trainer: string, chapter: number): string[] {
  const sets: readonly BarkSet[] = BARKS[trainer] ?? [];
  const quiet = chapter >= QUIET_CHAPTERS.from && chapter <= QUIET_CHAPTERS.to;
  const now = {
    rain: !quiet && world.weather.kind === 'rain',
    night: !quiet && isNight(world.timeMs),
  };
  return sets
    .filter((s) => chapter >= s.from && chapter <= s.to && (!s.when || now[s.when]))
    .flatMap((s) => s.lines);
}

/** A line for this Keeper now, or null when there is none to say. */
export function pickBark(world: World, trainer: string, chapter: number, rng: Rng): string | null {
  const pool = barkPool(world, trainer, chapter);
  if (pool.length === 0) return null;
  let byKeeper = recent.get(world);
  if (!byKeeper) recent.set(world, (byKeeper = new Map()));
  const last = byKeeper.get(trainer) ?? [];
  const fresh = pool.filter((l) => !last.includes(l));
  const from = fresh.length > 0 ? fresh : pool;
  const line = from[rng.int(0, from.length - 1)]!;
  byKeeper.set(trainer, [...last, line].slice(-RECENT));
  return line;
}
