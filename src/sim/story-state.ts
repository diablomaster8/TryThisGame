import { STORY } from '../config/tuning';
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
