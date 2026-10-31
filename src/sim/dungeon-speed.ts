/**
 * Speed runs (R0187, DUNG-44): an optional toggle at the cave mouth. With it on, an act run
 * keeps a split each time the Keeper goes down a level and, when the act's boss falls, its
 * time against the best for that act and tier. The times are sim time, so they stop when the
 * game is paused or hidden. There is no reward but the ⏱ on the Journal page: nothing to
 * grind, nothing missed by leaving it off. Pure sim: no DOM.
 */
import { PARTY_R8 } from '../config/dungeon-party-r8';
import { cellOf, type Floor } from './dungeon';
import { levelIdOf } from './dungeon-levels';
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
  if (best)
    records[key] = {
      bestMs: ms,
      splits: [...(run.splits ?? [])],
      ...(run.trail ? { trails: run.trail } : {}),
    };
  events.push({ kind: 'speedFinish', ms, best, ...(old ? { was: old.bestMs } : {}) });
}

// ---------------------------------------------------------------- the ghost line (R0187)

/** The trail key of the level in play: its floor seed and its level id. */
function trailKey(run: DungeonRun): string {
  return `${run.seed}:${levelIdOf(run)}`;
}

/** A speed run notes each new cell the Keeper steps on, per level, for the next run's ghost. */
export function noteTrail(world: World, run: DungeonRun, f: Floor): void {
  if (!world.hollow.speedRun || run.act === undefined) return;
  const c = cellOf(f, world.keeper.pos);
  const i = c.y * f.cols + c.x;
  const trails = (run.trail ??= {});
  const list = (trails[trailKey(run)] ??= []);
  if (list[list.length - 1] === i || list.length >= PARTY_R8.ghost.maxCells) return;
  list.push(i);
}

/** The personal best's path on this level, as cell indices; empty when there is none. */
export function ghostTrail(world: World, run: DungeonRun): readonly number[] {
  if (!world.hollow.speedRun || run.act === undefined) return [];
  const rec = world.hollow.records?.[speedKey(run.act, hollowTier(world))];
  return rec?.trails?.[trailKey(run)] ?? [];
}
