/**
 * Lane C r10 agent B: the story book's marks beside its chapters (R0596's `checkpoints`
 * and R0642's ending dates; `skipped` is agent C's, with the Story only pace). Checkpoint
 * snapshots live in IndexedDB, written by the game on each `chapter` event; the sim records
 * the key only once the write succeeded (`checkpointKept`), so a blocked database never
 * leaves a key that points at nothing.
 */
import { CHECKPOINTS } from '../config/tuning';
import type { CampaignState, SimEvent, World } from './types';

/** The spine's id in chapter keys (the lines use their storyline ids). */
export const SPINE_LINE = 'hazel';

/** `<line>/<n>` for every chapter that began in `events`, in order, without repeats. */
export function chapterKeysOf(events: readonly SimEvent[], world: World): string[] {
  const out: string[] = [];
  const own = world.campaign?.storyline ?? SPINE_LINE;
  for (const e of events) {
    if (e.kind !== 'chapter') continue;
    const key = `${e.line ?? own}/${e.chapter}`;
    if (!out.includes(key)) out.push(key);
  }
  return out;
}

/** Does this world already keep a checkpoint for `key`? (The first snapshot is kept.) */
export function hasCheckpoint(world: World, key: string): boolean {
  return world.campaign?.checkpoints?.[key] !== undefined;
}

/** How many checkpoints this world keeps. */
export function checkpointCount(world: World): number {
  return Object.keys(world.campaign?.checkpoints ?? {}).length;
}

/** The `checkpointKept` command: record the key on the spine (first one wins, capped). */
export function noteCheckpoint(world: World, key: string, id: string): void {
  const c = world.campaign;
  if (!c || typeof key !== 'string' || typeof id !== 'string' || !key || !id) return;
  const map = (c.checkpoints ??= {});
  if (map[key] !== undefined) return;
  if (Object.keys(map).length >= CHECKPOINTS.perSlotMax) return;
  map[key] = id;
}

/** R0642: stamp an ending's reach time; called where `ending` is set. */
export function stampEnding(world: World, c: CampaignState): void {
  if (c.endedMs !== undefined) return;
  c.endedMs = world.timeMs;
  if (world.lastWallMs > 0) c.endedWallMs = world.lastWallMs;
}
