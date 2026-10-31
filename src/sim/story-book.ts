import { STORY_BOOK } from '../config/tuning';
import { audienceAllowed } from './audience';
import { FINAL_CHAPTER, freshCampaignState, goalMet } from './campaign';
import {
  applyStorylineCommand,
  noteCampaignEvents,
  startStoryline,
  stepStoryline,
  storyHome,
  storySceneDone,
} from './storyline';
import { lineEndedRewards } from './line-rewards';
import { orderSceneQueue } from './scene-queue';
import { lineCast } from './storyline-rules';
import { sceneOwner, sideResting } from './story-state';
import { sceneById, storylineById } from './story-scenes';
import { regionOfLine } from '../config/story-regions';
import {
  enterStoryRegion,
  lineRegionOpen,
  lineWaitsForRegion,
  restoreRegionLook,
  stepStoryRegions,
} from './story-regions';
import type { CampaignState, Command, SimEvent, World } from './types';

/**
 * Lane C round 7, the story book (R0596, CAMP-01): Hazel's Grove is the spine
 * (`world.campaign`) and the separate questlines run beside it in `world.lines`, each with
 * its own chapter, flags, counters and cast. A line keeps its own queue as the list of its
 * scenes handed to the spine's queue, which is the one queue the dialogue box, the stage
 * and the renderers play from. Lines only queue onto an empty, rested spine queue, so the
 * spine always goes first and two owners never interleave mid-beat (R0597, R0631).
 */

/** Why a line can't begin now, or null if it can. */
export type LineRefusal =
  'unknown' | 'noSpine' | 'audience' | 'early' | 'quiet' | 'running' | 'cap';

/** The Nubbins each line brings with it (its rule's setup), for the cast cap (R0594). */
const CAST_SIZE: Readonly<Record<string, number>> = { hundred: 1, logged: 3, dawn: 1, dusk: 1 };

/** Hazel's Grove, when it is this world's campaign and has begun. */
function spineOf(world: World): CampaignState | null {
  const c = world.campaign;
  return c && c.storyline === null && c.chapter > 0 ? c : null;
}

/** Does this world run lines beside Hazel's Grove (rather than one separate campaign). */
export function sharesStory(world: World): boolean {
  return spineOf(world) !== null && world.edu === null;
}

/** Lines still running (no ending yet), in start order. */
export function activeLines(world: World): CampaignState[] {
  return Object.values(world.lines ?? {}).filter((l) => l.ending === null);
}

/** Hazel's quiet chapters and the vigil: no line begins or moves on (R0612). */
export function quietSpine(world: World): boolean {
  const c = spineOf(world);
  if (!c) return false;
  return STORY_BOOK.quietChapters.includes(c.chapter) || (c.vigil !== null && !c.vigil.done);
}

/** Nubbins the running lines brought into the Grove, still there. */
export function lineCastIds(world: World): Set<string> {
  const out = new Set<string>();
  for (const l of activeLines(world)) for (const id of lineCast(l)) out.add(id);
  return out;
}

export function lineRefusal(world: World, id: string): LineRefusal | null {
  const s = storylineById(id);
  if (!s) return 'unknown';
  const spine = spineOf(world);
  if (!spine || world.edu) return 'noSpine';
  const ctx = { matureContent: world.settings.matureContent, learningGrove: false };
  if (!audienceAllowed(s.audience ?? 'main', ctx)) return 'audience';
  if (spine.chapter < STORY_BOOK.lineFromChapter) return 'early';
  // R0640 (lane C r10 agent A): the world opens one region at a time.
  if (!lineRegionOpen(world, id)) return 'early';
  if (quietSpine(world)) return 'quiet';
  if (world.lines[id] && world.lines[id].ending === null) return 'running';
  if (activeLines(world).length >= STORY_BOOK.lineCap) return 'cap';
  const living = [...lineCastIds(world)].filter((n) => world.nubbins.some((x) => x.id === n));
  if (living.length + (CAST_SIZE[id] ?? 0) > STORY_BOOK.lineCastMax) return 'cap';
  return null;
}

/** Hand a line's newly queued scenes to the spine's queue. */
function flush(world: World, line: CampaignState): void {
  const spine = world.campaign;
  if (!spine) return;
  // R0597, R0605 (lane C r10 agent A): a line's scenes are handed over only while the Keeper
  // is in its region; outside it they wait in the line's own queue, so the spine, the other
  // lines and the side stories go on meanwhile.
  if (lineWaitsForRegion(world, line)) {
    if (spine.queue.some((id) => line.queue.includes(id)))
      spine.queue = spine.queue.filter((id) => !line.queue.includes(id));
    return;
  }
  for (const id of line.queue) if (!spine.queue.includes(id)) spine.queue.push(id);
}

/** The owner a line's own scenes share ('h', 'l', 'b', 'dawn'), so its chain skips the breather. */
function lineOwner(line: CampaignState): string {
  const first = storylineById(line.storyline ?? '')?.chapters[0]?.opening.id;
  return first ? sceneOwner(first) : '';
}

/** Put back how the Grove looked when the line began (R0601): its recolour and partners. */
function restorePresentation(world: World, line: CampaignState): void {
  restoreRegionLook(world, line);
  const r = line.restore;
  if (!r) return;
  world.grove = r.grove;
  r.partners.forEach((id, slot) => {
    if (id === null || world.nubbins.some((n) => n.id === id)) world.partners[slot as 0 | 1] = id;
  });
  delete line.restore;
}

/** Begin line `id` beside Hazel's Grove. Refused (false) for any `lineRefusal`. */
export function startLine(
  world: World,
  id: string,
  events: SimEvent[],
  flags: Record<string, number | boolean | string> = {},
): boolean {
  if (lineRefusal(world, id) !== null) return false;
  const c = freshCampaignState(world.timeMs);
  c.restore = { grove: world.grove, partners: [...world.partners] };
  // Its own flags from the start (R0595): counters begin at zero, nothing of Hazel's leaks in.
  if (!startStoryline(world, c, id, events, flags, true)) return false;
  flush(world, c);
  return true;
}

/** Leave a running line (R0643): its scenes go, the Grove keeps its cast and looks as before. */
export function abandonLine(world: World, id: string): void {
  const line = world.lines?.[id];
  const spine = world.campaign;
  if (!line || line.ending !== null) return;
  if (spine) spine.queue = spine.queue.filter((s) => !line.queue.includes(s));
  restorePresentation(world, line);
  delete world.lines[id];
}

/** Fold events (the step's, or a command's) into every running line's counters and rule. */
export function noteLineEvents(world: World, events: SimEvent[]): void {
  if (!sharesStory(world) || events.length === 0) return;
  for (const line of activeLines(world)) {
    noteCampaignEvents(world, line, events);
    flush(world, line);
  }
  rewardEndedLines(world, events);
}

/** Per step, after the spine: fold the step's events into every running line. */
export function stepStoryBook(world: World, _dtMs: number, events: SimEvent[]): void {
  if (!sharesStory(world)) return;
  for (const line of activeLines(world)) {
    noteCampaignEvents(world, line, events);
    flush(world, line);
  }
  rewardEndedLines(world, events);
  // R0605, R0640: a region whose line ended is left; a newly open one is announced once.
  stepStoryRegions(world, events);
  // R0597, R0631: the queue behind its head plays spine first, then lines, side stories, capers.
  orderSceneQueue(world);
}

/** R0639: a line that ended in these events leaves its rewards, and asks after its cast. */
function rewardEndedLines(world: World, events: SimEvent[]): void {
  const ended = events.flatMap((e) => (e.kind === 'lineEnded' ? [e.line] : []));
  for (const line of ended) lineEndedRewards(world, line, events);
}

/**
 * Per step, before the spine (R0597): one line at a time may queue its next scene, once a
 * sim second. It goes before the side stories and fun quests, which would otherwise take
 * every free slot at the breather's end, but never before Hazel's own chapter scenes: while
 * the spine's opening is unplayed or its goal is met, the lines wait.
 */
export function stepLineQueue(world: World, dtMs: number, events: SimEvent[]): void {
  const spine = spineOf(world);
  if (!spine || world.edu !== null) return;
  const lines = activeLines(world);
  if (lines.length === 0) return;
  const tick = Math.floor(world.timeMs / 1000) !== Math.floor((world.timeMs - dtMs) / 1000);
  if (!tick || quietSpine(world) || spine.queue.length > 0) return;
  if (spine.chapter <= FINAL_CHAPTER && (spine.openedMs === null || goalMet(world, spine))) return;
  for (const line of lines) {
    if (line.queue.length > 0 || sideResting(world, spine, [lineOwner(line)])) continue;
    // R0597: a line moves on only while the Keeper is in its region (R0605).
    if (lineWaitsForRegion(world, line)) continue;
    if (world.location === 'dungeon' && storyHome(line.storyline!, line.chapter) !== 'dungeon')
      continue;
    stepStoryline(world, line, events);
    flush(world, line);
    if (spine.queue.length > 0) return;
  }
}

/**
 * A scene ended: if a line handed it to the queue, it is that line's to mark seen, and its
 * flags and choice go to the line's own flags. Returns whether a line took it.
 */
export function lineSceneDone(
  world: World,
  id: string,
  choiceId: string | null,
  events: SimEvent[],
): boolean {
  const spine = world.campaign;
  for (const line of Object.values(world.lines ?? {})) {
    if (!line.queue.includes(id)) continue;
    line.queue = line.queue.filter((s) => s !== id);
    if (!line.seen.includes(id)) {
      line.seen.push(id);
      line.seenMs[id] = world.timeMs;
    }
    if (spine?.rest) line.rest = { ...spine.rest };
    const scene = sceneById(id);
    if (scene?.set) Object.assign(line.flags, scene.set);
    const choice = scene?.choices?.find((ch) => ch.id === choiceId);
    if (choice?.set) Object.assign(line.flags, choice.set);
    for (const [who, d] of Object.entries(choice?.friendship ?? {}))
      line.friendship[who] = (line.friendship[who] ?? 0) + d;
    storySceneDone(world, line, id, choiceId, events);
    // The line's own title card closes it: the Grove looks as it did before (R0601).
    if (line.ending !== null && id.startsWith('end-')) restorePresentation(world, line);
    flush(world, line);
    return true;
  }
  return false;
}

/** `storyArea`, `storyAct` and `debugChapter` aimed at a line by id. */
export function applyLineCommand(
  world: World,
  line: string,
  cmd: Command,
  events: SimEvent[],
): void {
  const l = world.lines?.[line];
  const spine = world.campaign;
  if (!l || l.ending !== null || !spine) return;
  if (cmd.kind === 'debugChapter') spine.queue = spine.queue.filter((s) => !l.queue.includes(s));
  // R0605 (lane C r10 agent A): travelling to one of a line's places walks into its region.
  if (cmd.kind === 'storyArea') {
    const region = regionOfLine(line);
    if (region && !enterStoryRegion(world, region, events)) return;
  }
  applyStorylineCommand(world, l, cmd, events);
  flush(world, l);
}

/** Save repair: line defaults, and any scene a line handed over is back in the spine's queue. */
export function repairLines(world: World): void {
  world.lines ??= {};
  for (const [id, l] of Object.entries(world.lines)) {
    if (!l || typeof l !== 'object' || !storylineById(id)) {
      delete world.lines[id];
      continue;
    }
    l.storyline = id;
    l.flags ??= {};
    l.friendship ??= {};
    l.seen ??= [];
    l.seenMs ??= {};
    l.side ??= {};
    l.fun ??= {};
    l.vigil ??= null;
    l.openedMs ??= null;
    l.goalMetMs ??= null;
    l.ending ??= null;
    l.queue = (l.queue ?? []).filter((s) => sceneById(s) !== undefined);
    flush(world, l);
  }
}
