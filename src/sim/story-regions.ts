import {
  regionOfLine,
  STORY_REGION_IDS,
  STORY_REGIONS,
  type StoryRegionId,
} from '../config/story-regions';
import { STORY_REGION_TUNING } from '../config/tuning';
import { setLocation } from './campaign';
import { storylineRule } from './storyline-rules';
import { withRng } from './world';
import { setWeather } from './weather';
import type { CampaignState, SimEvent, World } from './types';

/**
 * Lane C r10 agent A (R0605 CAMP-13, R0640 CAMP-48, R0601 CAMP-08, R0597 CAMP-04): the rules
 * of the questline regions beside Hazel's Grove. The region is metadata over the Keeper's
 * `Location` (`World.storyRegion`; the Hollow Below's floors are the Hollow too), so the
 * renderers keep drawing the Grove and dress it with the region's line set. Here:
 * - which region the Keeper is in, and which regions are open yet (one at a time, by Hazel's
 *   chapter: R0640);
 * - going in and out through an entrance, with the line's presentation (its recolour, its
 *   weather) applied only inside and put back on the way out (R0601);
 * - whether a line, or a queued scene of a line, waits for the Keeper to be in its region
 *   (R0597: a Logged In beat never plays in the Grove's kitchen).
 * Separate-campaign saves (one storyline is the world's campaign) have no regions: the
 * whole world is that campaign, as before.
 */

/** Hazel's Grove as the spine, with lines beside it (the only kind of world with regions). */
function spineChapter(world: World): number | null {
  const c = world.campaign;
  return c && c.storyline === null && c.chapter > 0 && world.edu === null ? c.chapter : null;
}

export function isStoryRegion(id: string | undefined | null): id is StoryRegionId {
  return !!id && (STORY_REGION_IDS as readonly string[]).includes(id);
}

/** The questline region the Keeper stands in, or null in the Grove itself. */
export function storyRegionHere(world: World): StoryRegionId | null {
  if (world.location === 'dungeon') return 'hollow';
  return isStoryRegion(world.storyRegion) ? world.storyRegion : null;
}

/** Hazel's chapter a region opens at (R0640). */
export function regionOpensAt(r: StoryRegionId): number {
  return STORY_REGION_TUNING.opensAt[r] ?? 1;
}

/** Whether region `r` is open: always outside a shared-story world. */
export function storyRegionOpen(world: World, r: StoryRegionId): boolean {
  const ch = spineChapter(world);
  return ch === null || ch >= regionOpensAt(r);
}

/** Whether line `id` may begin yet: its region must be open (R0640). */
export function lineRegionOpen(world: World, id: string): boolean {
  const r = regionOfLine(id);
  return r === null || storyRegionOpen(world, r);
}

/** The running lines that live in region `r`. */
export function regionLines(world: World, r: StoryRegionId): CampaignState[] {
  return STORY_REGIONS[r].lines
    .map((id) => world.lines?.[id])
    .filter((l): l is CampaignState => !!l && l.ending === null);
}

/** The running line whose region the Keeper is in (the first, if two share one), or null. */
export function regionLine(world: World): CampaignState | null {
  if (spineChapter(world) === null) return null;
  const r = storyRegionHere(world);
  return r ? (regionLines(world, r)[0] ?? null) : null;
}

/** R0597: a shared line waits while the Keeper is outside its region. */
export function lineWaitsForRegion(world: World, line: CampaignState): boolean {
  if (spineChapter(world) === null || !line.storyline) return false;
  if (world.lines?.[line.storyline] !== line) return false;
  const r = regionOfLine(line.storyline);
  return r !== null && storyRegionHere(world) !== r;
}

/** R0597: a queued scene a line handed over waits until the Keeper is in that line's region. */
export function sceneWaitsForRegion(world: World, id: string): boolean {
  for (const l of Object.values(world.lines ?? {}))
    if (l.queue.includes(id)) return lineWaitsForRegion(world, l);
  return false;
}

/** The region a queued scene waits for, or null when it plays anywhere. */
export function sceneRegion(world: World, id: string): StoryRegionId | null {
  for (const l of Object.values(world.lines ?? {}))
    if (l.queue.includes(id) && l.storyline) return regionOfLine(l.storyline);
  return null;
}

/** Why region `r` can't be entered now, or null. */
export function storyRegionBlock(world: World, r: string): string | null {
  if (!isStoryRegion(r) || spineChapter(world) === null) return 'unknown';
  if (!storyRegionOpen(world, r)) return 'locked';
  if (regionLines(world, r).length === 0) return 'noLine';
  if (world.dungeon || world.location === 'dungeon') return 'busy';
  return null;
}

/** Apply the region's lines' presentation, keeping the Grove's look to put back (R0601). */
function present(world: World, r: StoryRegionId, events: SimEvent[]): void {
  for (const line of regionLines(world, r)) {
    const look = storylineRule(line.storyline!)?.present?.(world, line);
    if (!look) continue;
    line.regionRestore ??= { grove: world.grove, weather: { ...world.weather } };
    if (look.grove) world.grove = look.grove;
    if (look.weather && look.weather !== world.weather.kind)
      withRng(world, (rng) => setWeather(world, look.weather!, rng, events));
  }
}

/** Put back how the Grove looked before the Keeper walked into a region (R0601). */
export function restoreRegionLook(world: World, line: CampaignState): void {
  const r = line.regionRestore;
  if (!r) return;
  world.grove = r.grove;
  world.weather = { ...r.weather };
  delete line.regionRestore;
}

/** Walk into region `r` from its entrance. Refusals are an event, never an error. */
export function enterStoryRegion(world: World, r: string, events: SimEvent[]): boolean {
  const why = storyRegionBlock(world, r);
  if (why) {
    events.push({ kind: 'storyRegionRefused', region: r, reason: why });
    return false;
  }
  if (world.storyRegion === r) return true;
  leaveStoryRegion(world, events);
  world.storyRegion = r;
  present(world, r as StoryRegionId, events);
  events.push({ kind: 'storyRegionEntered', region: r });
  return true;
}

/** Walk back into the Grove: the region's look goes, and a line's far place is left too. */
export function leaveStoryRegion(world: World, events: SimEvent[]): void {
  const r = world.storyRegion;
  if (!r) return;
  delete world.storyRegion;
  for (const l of Object.values(world.lines ?? {})) restoreRegionLook(world, l);
  // The Fold's far places (the mountain, the mire, the mill) are the Grove's other places.
  if (world.location === 'corvin' || world.location === 'hollow')
    setLocation(world, 'grove', events);
  events.push({ kind: 'storyRegionLeft', region: r });
}

/** Per step: a region whose line ended is left, and a newly open region is announced once. */
export function stepStoryRegions(world: World, events: SimEvent[]): void {
  const ch = spineChapter(world);
  if (ch === null) return;
  const r = world.storyRegion;
  if (isStoryRegion(r) && regionLines(world, r).length === 0) leaveStoryRegion(world, events);
  else if (r && !isStoryRegion(r)) delete world.storyRegion;
  const told = (world.storyRegionsOpen ??= []);
  for (const id of STORY_REGION_IDS) {
    if (told.includes(id) || ch < regionOpensAt(id)) continue;
    told.push(id);
    events.push({ kind: 'storyRegionOpened', region: id });
  }
}

/** The regions in open order (R0640), for the map and the bot log. */
export function regionOpenOrder(): StoryRegionId[] {
  return [...STORY_REGION_IDS].sort((a, b) => regionOpensAt(a) - regionOpensAt(b));
}
