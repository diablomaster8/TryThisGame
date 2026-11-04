import { paced, storyPaceOf } from './story-pace';
import { PACE, STORY } from '../config/tuning';
import { sceneById } from './story-scenes';
import type { CampaignState, Nubbin, World } from './types';

/**
 * Small shared reads of campaign state for the chapter router (campaign.ts), the scene
 * routes (campaign-routes.ts) and the side-story runner (side-stories.ts): the story
 * clock, the scene queue, and the route tests the scene notes keep repeating.
 */

/** The first story dawn strictly after `ms`. */
export function nextDawn(ms: number): number {
  return (Math.floor(ms / STORY.dayMs) + 1) * STORY.dayMs;
}

/** The first story dusk strictly after `ms`. */
export function nextDusk(ms: number): number {
  const today = Math.floor(ms / STORY.dayMs) * STORY.dayMs + STORY.duskAt * STORY.dayMs;
  return today > ms ? today : today + STORY.dayMs;
}

/** Whose a scene is, for pacing: its id's first part ('c2-open' → 'c2', 's9-ask' → 's9'). */
export function sceneOwner(id: string): string {
  return id.split('-')[0] ?? id;
}

/** A scene has ended: the breathing gap starts now (campaign.ts, on sceneDone). */
export function noteSceneEnded(world: World, c: CampaignState, id: string): void {
  c.rest = { atMs: world.timeMs, owner: sceneOwner(id) };
}

/**
 * Hold anything new: a scene is queued, or the last one ended less than a breather ago
 * (review 2026-10-24, item 4). `owner` lets a story's own next beat through the gap.
 */
export function resting(
  world: World,
  c: CampaignState,
  owner?: string | readonly string[],
): boolean {
  if (c.queue.length > 0) return true;
  const r = c.rest;
  if (!r) return false;
  if (owner !== undefined && (typeof owner === 'string' ? [owner] : owner).includes(r.owner))
    return false;
  return world.timeMs < r.atMs + paced(world, STORY.breatherMs);
}

/** A campaign scene's owner ('c4', 't', 'end'), as against a side story's or quest's. */
function campaignOwned(owner: string): boolean {
  return /^c\d+$/.test(owner) || owner === 't' || owner === 'end';
}

/**
 * `resting` for a side story's or fun quest's next step: after another story's scene the
 * gap is the shorter `sideGapMs`, so a Grove with many stories open still moves on its
 * story days; after a campaign scene it is the full breather.
 */
export function sideResting(world: World, c: CampaignState, owners: readonly string[]): boolean {
  if (c.queue.length > 0) return true;
  const r = c.rest;
  if (!r || owners.includes(r.owner)) return false;
  const gap = paced(world, campaignOwned(r.owner) ? STORY.breatherMs : STORY.sideGapMs);
  return world.timeMs < r.atMs + gap;
}

/**
 * Whether a scene that names a time of day ("Morning.", "Late afternoon.") may play now.
 * R0614: with a `world` on Brisk or Story only the wait for the hour is scaled by `PACE.brisk`:
 * the scene plays once the hour is at most `(1 - PACE.brisk)` of a day away.
 */
export function sceneTimeHolds(ms: number, id: string, world?: World): boolean {
  const want = STORY.sceneTime[id];
  if (!want) return true;
  const f = (ms % STORY.dayMs) / STORY.dayMs;
  const start = want === 'morning' ? 0 : want === 'afternoon' ? STORY.morningEndsAt : STORY.duskAt;
  const end = want === 'morning' ? STORY.morningEndsAt : want === 'afternoon' ? STORY.duskAt : 1;
  if (f >= start && f < end) return true;
  if (!world || storyPaceOf(world) === 'full') return false;
  const away = (((start - f) % 1) + 1) % 1; // fraction of a day until the hour opens
  return away <= 1 - PACE.brisk;
}

/** R0634: whether scene `id` may play in the world's season (no `season` gate: always). */
export function sceneSeasonHolds(world: World, id: string): boolean {
  const want = sceneById(id)?.season;
  return !want || want.includes(world.season);
}

/** Queue a scene once: never twice, never one already seen, never an unknown id. */
export function queueScene(c: CampaignState, id: string): boolean {
  if (!sceneById(id)) return false;
  if (c.queue.includes(id) || c.seen.includes(id)) return false;
  c.queue.push(id);
  return true;
}

export function seen(c: CampaignState, id: string): boolean {
  return c.seen.includes(id);
}

/** When scene `id` was first seen, or null. Scenes seen before this was recorded read as 0. */
export function seenAt(c: CampaignState, id: string): number | null {
  if (!c.seen.includes(id)) return null;
  return c.seenMs[id] ?? 0;
}

export function sableOf(world: World, c: CampaignState): Nubbin | undefined {
  return c.sableId ? world.nubbins.find((n) => n.id === c.sableId) : undefined;
}

export function sableBonded(world: World, c: CampaignState): boolean {
  return Boolean(sableOf(world, c)?.bond);
}

/** The Collector route: you sold a Nubbin in chapter 2 and nobody has bought one back. */
export function collectorRoute(c: CampaignState): boolean {
  return Boolean(c.flags.soldNubbin) && !c.flags.boughtBack;
}

/** S2 left Wisp near the Grove (spared, or Sable's choice). */
export function wispSaved(c: CampaignState): boolean {
  return c.flags.wisp === 'spared' || c.flags.wisp === 'sable';
}

/**
 * Moss is still in the world after the Long Night: he came back out of the Wellspring,
 * or Wisp unmade the stone and Moss had not faded, or the stone was kept (he stays on
 * the hill, faded or not).
 */
export function mossInWorld(c: CampaignState): boolean {
  if (c.flags.keptStone) return true;
  if (c.flags.mossReturned) return true;
  return c.flags.stoneUnmadeBy === 'wisp' && !c.flags.mossFaded;
}
