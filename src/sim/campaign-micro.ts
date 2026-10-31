/**
 * R0367 (FUN-78): when a Keeper's comic micro-scene plays. Each of the fifteen plays once,
 * in its chapter window, on a quiet stretch: nothing queued, a full quiet gap since the last
 * scene ended, and a longer gap since the last micro-scene. Never in the Learning Grove,
 * never in a separate storyline, never before a chapter's opening has played, and the
 * windows skip chapters 9 to 11. The most urgent (soonest-closing window) goes first.
 * Pure sim: no DOM, no randomness.
 */
import { MICRO_SLOTS } from '../content/campaign-micro';
import { FUN_R10 } from '../config/tuning-fun-r10';
import { paced } from './story-pace';
import { queueScene } from './story-state';
import type { CampaignState, World } from './types';

/** The micro-scene due now, or null. */
export function microDue(world: World, c: CampaignState): string | null {
  if (world.edu || c.storyline || c.queue.length > 0) return null;
  // Not while a chapter waits for its opening.
  if (c.step === 0 && c.chapter <= 12) return null;
  const now = world.timeMs;
  if (c.rest && now < c.rest.atMs + paced(world, FUN_R10.microQuietMs)) return null;
  let last = -Infinity;
  for (const s of MICRO_SLOTS) {
    const at = c.seenMs[s.id];
    if (c.seen.includes(s.id) && at !== undefined) last = Math.max(last, at);
  }
  if (now < last + paced(world, FUN_R10.microGapMs)) return null;
  let best: (typeof MICRO_SLOTS)[number] | null = null;
  for (const s of MICRO_SLOTS) {
    if (c.chapter < s.from || c.chapter > s.to || c.seen.includes(s.id)) continue;
    if (!best || s.to < best.to) best = s;
  }
  return best ? best.id : null;
}

/** Once a sim second, after the chapter machine: queue the due micro-scene, if any. */
export function stepMicroScenes(world: World, c: CampaignState): void {
  const id = microDue(world, c);
  if (id) queueScene(c, id);
}
