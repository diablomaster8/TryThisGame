/**
 * What the Hollow remembers about trips (lane B round 6). Today's results (R0185): the
 * deepest level reached in today's shared Hollow, the quickest time to it and the finds
 * brought home today; it simply refreshes with the real day, with no streak and nothing lost
 * for a missed day. The rolling tuning numbers (R0211): time and fights per level, losses,
 * pickups by kind and portals used, over the last `HOLLOW_R6.statsKeep` levels, for the debug
 * panel only.
 */
import { HOLLOW_R6 } from '../config/tuning-dungeon';
import type { DungeonRun, HollowStats, World } from './types';

export function hollowStats(world: World): HollowStats {
  return (world.hollow.stats ??= { levelMs: [], fights: [], losses: 0, pickups: {}, portals: 0 });
}

function today(world: World, day: string): NonNullable<World['hollow']['today']> {
  const t = world.hollow.today;
  if (t && t.day === day) return t;
  return (world.hollow.today = { day, deepest: 0, bestMs: 0, finds: 0 });
}

function push(list: number[], v: number): void {
  list.push(Math.round(v));
  while (list.length > HOLLOW_R6.statsKeep) list.shift();
}

/** A level is behind the Keeper (going down): its time and fights join the rolling numbers. */
export function noteLevelDone(world: World, run: DungeonRun): void {
  const s = hollowStats(world);
  push(s.levelMs, world.timeMs - (run.levelStartMs ?? run.startedMs));
  push(s.fights, run.levelFights ?? 0);
  run.levelStartMs = world.timeMs;
  run.levelFights = 0;
}

/** A daily trip reached `run.depth`: deeper beats the record, as deep and quicker beats the time. */
export function noteDailyDepth(world: World, run: DungeonRun): void {
  if (!run.daily) return;
  const t = today(world, run.daily);
  const ms = world.timeMs - run.startedMs;
  if (run.depth > t.deepest) {
    t.deepest = run.depth;
    t.bestMs = ms;
  } else if (run.depth === t.deepest) t.bestMs = Math.min(t.bestMs || ms, ms);
}

/** The trip is over: today's finds add up (daily trips only). */
export function noteTripEnd(world: World, run: DungeonRun): void {
  if (!run.daily) return;
  const t = today(world, run.daily);
  t.deepest = Math.max(t.deepest, run.depth);
  t.finds += run.haul.items;
}

/** One more fight on this level; `lost` also counts a loss. */
export function noteFight(world: World, run: DungeonRun, lost: boolean): void {
  run.levelFights = (run.levelFights ?? 0) + 1;
  if (lost) hollowStats(world).losses += 1;
}

export function notePickup(world: World, kind: string): void {
  const p = hollowStats(world).pickups;
  p[kind] = (p[kind] ?? 0) + 1;
}

export function notePortal(world: World): void {
  hollowStats(world).portals += 1;
}

/** "6:12" for the menu. */
export function clockText(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
