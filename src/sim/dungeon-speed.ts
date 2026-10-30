/**
 * Speed runs (R0187, DUNG-44): an optional toggle at the cave mouth. With it on, an act run
 * keeps a split each time the Keeper goes down a level and, when the act's boss falls, its
 * time against the best for that act and tier. The times are sim time, so they stop when the
 * game is paused or hidden. There is no reward but the ⏱ on the Journal page: nothing to
 * grind, nothing missed by leaving it off. Pure sim: no DOM.
 */
import { hollowTier } from './dungeon-tiers';
import type { DungeonRun, SimEvent, World } from './types';

/** The records key: an act and a tier. */
export function speedKey(act: number, tier: string): string {
  return `${act}:${tier}`;
}

/** How long this run has been going, on the sim clock. */
export function runClock(world: World, run: DungeonRun): number {
  return world.timeMs - run.startedMs;
}

/** Going down a level: the split, and how it compares with the best run's. */
export function noteSplit(world: World, run: DungeonRun, events: SimEvent[]): void {
  if (!world.hollow.speedRun || run.act === undefined) return;
  const ms = runClock(world, run);
  const splits = (run.splits ??= []);
  splits.push(ms);
  const best = world.hollow.records?.[speedKey(run.act, hollowTier(world))]?.splits;
  const was = best?.[splits.length - 1];
  events.push({ kind: 'speedSplit', n: splits.length, ms, ...(was ? { delta: ms - was } : {}) });
}

/** The act's boss fell: the run's time, and a new best if it is one. */
export function noteActTime(world: World, run: DungeonRun, events: SimEvent[]): void {
  if (!world.hollow.speedRun || run.act === undefined) return;
  const ms = runClock(world, run);
  const key = speedKey(run.act, hollowTier(world));
  const records = (world.hollow.records ??= {});
  const old = records[key];
  const best = !old || ms < old.bestMs;
  if (best) records[key] = { bestMs: ms, splits: [...(run.splits ?? [])] };
  events.push({ kind: 'speedFinish', ms, best, ...(old ? { was: old.bestMs } : {}) });
}
