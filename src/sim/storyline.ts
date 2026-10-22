import { CHAPTERS, ENDINGS } from '../config/story';
import type { Storyline, StorylineChapter } from '../content/types';
import { STORY } from '../config/tuning';
import { chapterDef, FINAL_CHAPTER, setLocation } from './campaign';
import { actLabel, checkMet } from './storyline-checks';
import { storylineRule, type StoryAction } from './storyline-rules';
import { sceneById, storylineById } from './story-scenes';
import { queueScene, seen } from './story-state';
import type { CampaignState, Command, Location, SimEvent, World } from './types';

/**
 * The storyline machine: the separate campaigns (SL1–SL4) share Hazel's Grove's campaign
 * state (queue, seen, flags, friendship) so the dialogue box, the journal and the away
 * screen play them unchanged, but their chapters come from a `Storyline` script and
 * their goals are check strings (storyline-checks.ts). Each chapter opens with a scene,
 * waits for its goal (playing its beats as they come due), closes with a scene, and the
 * last one picks an ending through the storyline's rule (storyline-rules.ts).
 */

/** The counters folded from events, as `n:<kind>` flags the checks read. */
const COUNTED = new Set<SimEvent['kind']>([
  'recruited',
  'wildArrived',
  'wildSettled',
  'wildFed',
  'converted',
  'scanFull',
  'tankDone',
  'dungeonLeft',
  'descended',
  'merged',
  'hatched',
  'evolved',
  'reborn',
  'departed',
  'raceWon',
  'bred',
  'crafted',
  'planted',
  'harvested',
  'talked',
  'missionDone',
  'teamJoined',
  'strayFed',
  'chestOpened',
  'lessonDone',
  'trained',
  'skillBought',
  'questDone',
  'interacted',
  'ate',
  'collected',
  'partyBout',
  'fused',
  'degenerated',
  'restored',
]);

/**
 * Where each storyline's chapters are played (campaign graphics H1), by storyline id and
 * chapter number; a chapter not listed is played in the Grove, where all four separate
 * campaigns are dressed. The debug chapter jump moves there before the chapter begins.
 */
export const STORY_HOME: Readonly<Record<string, Readonly<Record<number, Location>>>> = {
  hundred: {},
  logged: {},
  beetle: {},
  dawn: {},
  dusk: {},
};

export function storyHome(storyline: string, n: number): Location {
  return STORY_HOME[storyline]?.[n] ?? 'grove';
}

export function storylineOf(c: CampaignState | null | undefined): Storyline | undefined {
  return c?.storyline ? storylineById(c.storyline) : undefined;
}

export function storyChapter(c: CampaignState): StorylineChapter | undefined {
  return storylineOf(c)?.chapters.find((ch) => ch.n === c.chapter);
}

export function storyFinalChapter(c: CampaignState): number {
  const s = storylineOf(c);
  return s ? s.chapters.length : FINAL_CHAPTER;
}

/** Start storyline `id` in this world: fresh campaign state, the rule's setup, chapter 1. */
export function startStoryline(
  world: World,
  c: CampaignState,
  id: string,
  events: SimEvent[],
  flags: Record<string, number | boolean | string> = {},
): boolean {
  const s = storylineById(id);
  if (!s) return false;
  c.storyline = id;
  Object.assign(c.flags, flags);
  world.campaign = c;
  storylineRule(id)?.setup?.(world, c, events);
  beginStoryChapter(world, c, 1, events);
  events.push({ kind: 'storylineStarted', id });
  return true;
}

function beginStoryChapter(world: World, c: CampaignState, n: number, events: SimEvent[]): void {
  c.chapter = n;
  c.step = 0;
  c.chapterStartMs = world.timeMs;
  c.openedMs = null;
  c.goalMetMs = null;
  for (const k of Object.keys(c.flags)) if (k.startsWith('act:')) delete c.flags[k];
  storylineRule(c.storyline ?? '')?.onChapter?.(world, c, n, events);
  events.push({ kind: 'chapter', chapter: n });
}

function variantOf(c: CampaignState, id: string): string {
  const v = storylineRule(c.storyline ?? '')?.variant?.(c, id) ?? id;
  return sceneById(v) ? v : id;
}

/** Public, for the journal: is the current chapter's goal met. */
export function storyGoalMet(world: World, c: CampaignState): boolean {
  const def = storyChapter(c);
  return def ? checkMet(world, c, def.goal) : false;
}

/** The chapter machine, once a sim second while no scene is waiting. */
export function stepStoryline(world: World, c: CampaignState, events: SimEvent[]): void {
  const s = storylineOf(c);
  const def = storyChapter(c);
  if (!s || !def) return;
  const rule = storylineRule(s.id);
  if (c.step === 0) {
    const opening = variantOf(c, def.opening.id);
    if (!seen(c, opening)) {
      queueScene(c, opening);
      return;
    }
    c.step = 1;
    c.openedMs = world.timeMs;
  }
  if (c.step === 1) {
    for (const beat of def.beats ?? []) {
      if (seen(c, beat.scene.id) || !checkMet(world, c, beat.when)) continue;
      queueScene(c, variantOf(c, beat.scene.id));
      return;
    }
    if (!checkMet(world, c, def.goal)) return;
    c.goalMetMs ??= world.timeMs;
    if (rule?.holdsClose?.(world, c)) return;
    c.step = 2;
    queueScene(c, variantOf(c, def.closing.id));
    return;
  }
  if (c.step !== 2) return;
  if (!seen(c, variantOf(c, def.closing.id))) return;
  if (c.chapter < s.chapters.length) {
    beginStoryChapter(world, c, c.chapter + 1, events);
    // The next opening queues in the same tick, so the story never sits on an empty queue.
    stepStoryline(world, c, events);
    return;
  }
  const ending = rule?.endingFor(world, c) ?? Object.keys(s.endings)[0] ?? 'end';
  c.ending = ending;
  c.chapter = s.chapters.length + 1;
  queueScene(c, `end-${s.id}-${ending}`);
  events.push({ kind: 'ending', ending: `${s.id}-${ending}` });
}

/** Fold the step's events into the `n:<kind>` counters (both kinds of campaign read them). */
export function foldCounters(c: CampaignState, events: SimEvent[]): void {
  for (const e of events) {
    if (e.kind === 'strayFed' && !e.ok) continue;
    if (e.kind === 'partyBout' && !e.won) continue;
    if (COUNTED.has(e.kind)) c.flags[`n:${e.kind}`] = Number(c.flags[`n:${e.kind}`] ?? 0) + 1;
    if (e.kind === 'karate' && e.won)
      c.flags['n:karateWon'] = Number(c.flags['n:karateWon'] ?? 0) + 1;
    if (e.kind === 'descended')
      c.flags['n:deepest'] = Math.max(Number(c.flags['n:deepest'] ?? 0), e.depth);
  }
}

/**
 * Fold events into the counters and the storyline rule: the step's own events (from
 * stepCampaign) and the ones a command produced (from applyCommand), for either campaign.
 */
export function noteCampaignEvents(world: World, c: CampaignState, events: SimEvent[]): void {
  const rule = storylineRule(c.storyline ?? '');
  foldCounters(c, events);
  if (!c.storyline) return;
  for (const e of events) {
    if (e.kind === 'hatched') c.stats.hatched += 1;
    else if (e.kind === 'evolved') c.stats.evolved += 1;
    else if (e.kind === 'reborn') c.stats.reborn += 1;
    else if (e.kind === 'departed') c.stats.departed += 1;
    rule?.onEvent?.(world, c, e, events);
  }
}

/** The step's events, then the machine. */
export function stepStorylineEvents(world: World, c: CampaignState, events: SimEvent[]): void {
  noteCampaignEvents(world, c, events);
}

/** After a storyline scene is seen (flags and the choice already applied). */
export function storySceneDone(
  world: World,
  c: CampaignState,
  scene: string,
  choice: string | null,
  events: SimEvent[],
): void {
  storylineRule(c.storyline ?? '')?.onScene?.(world, c, scene, choice, events);
}

export function applyStorylineCommand(
  world: World,
  c: CampaignState,
  cmd: Command,
  events: SimEvent[],
): void {
  const rule = storylineRule(c.storyline ?? '');
  switch (cmd.kind) {
    case 'storyArea': {
      if (!rule?.areas?.includes(cmd.area)) return;
      if (c.flags.area === cmd.area) return;
      c.flags.area = cmd.area;
      c.flags[`n:area:${cmd.area}`] = Number(c.flags[`n:area:${cmd.area}`] ?? 0) + 1;
      rule.onArea?.(world, c, cmd.area, events);
      events.push({ kind: 'areaChanged', area: cmd.area });
      return;
    }
    case 'storyAct': {
      const def = storyChapter(c);
      if (!def || c.step !== 1) return;
      const labels = [def.goal, ...(def.beats ?? []).map((b) => b.when)].map(actLabel);
      if (labels.includes(cmd.label)) c.flags[`act:${cmd.label}`] = true;
      return;
    }
    case 'debugChapter': {
      const s = storylineOf(c);
      if (!s) return;
      c.queue = [];
      const n = Math.max(1, Math.min(s.chapters.length, cmd.chapter));
      if (world.location !== 'dungeon') setLocation(world, storyHome(s.id, n), events);
      beginStoryChapter(world, c, n, events);
      // A jump always plays the chapter's opening, even one already seen (the current
      // chapter included), and queues it now rather than at the next sim second.
      const def = storyChapter(c);
      if (def) {
        const again = new Set([def.opening.id, variantOf(c, def.opening.id)]);
        c.seen = c.seen.filter((id) => !again.has(id));
      }
      stepStoryline(world, c, events);
      return;
    }
    default:
      return;
  }
}

// ---------------------------------------------------------------- for the journal and HUD

/** What the journal shows: works for Hazel's Grove and for every storyline. */
export interface JournalView {
  n: number;
  title: string;
  goalText: string;
  hint: string;
  final: number;
  met: boolean;
  chapters: Array<{ n: number; title: string }>;
  endings: Record<string, { title: string; how: string }>;
  /** The ending id as the endings map keys it. */
  ending: string | null;
  /** The storyline id, or null for Hazel's Grove. */
  storyline: string | null;
  /** The `act:` label the goal waits on, if any. */
  act: string | null;
  actions: StoryAction[];
  area: string | null;
  areas: string[];
}

export function journalView(world: World, c: CampaignState, goalMet: boolean): JournalView | null {
  const s = storylineOf(c);
  if (!s) {
    const n = Math.min(c.chapter, FINAL_CHAPTER);
    const def = chapterDef(n);
    if (!def) return null;
    return {
      n,
      title: def.title,
      goalText: def.goalText,
      hint: def.hint,
      final: FINAL_CHAPTER,
      met: goalMet,
      chapters: CHAPTERS.map((ch) => ({ n: ch.n, title: ch.title })),
      endings: ENDINGS,
      ending: c.ending,
      storyline: null,
      act: null,
      actions: [],
      area: null,
      areas: [],
    };
  }
  const n = Math.min(c.chapter, s.chapters.length);
  const def = s.chapters.find((ch) => ch.n === n);
  if (!def) return null;
  const rule = storylineRule(s.id);
  return {
    n,
    title: def.title,
    goalText: def.goalText,
    hint: def.hint,
    final: s.chapters.length,
    met: storyGoalMet(world, c),
    chapters: s.chapters.map((ch) => ({ n: ch.n, title: ch.title })),
    endings: s.endings,
    ending: c.ending,
    storyline: s.id,
    act: c.step === 1 ? actLabel(def.goal) : null,
    actions: rule?.actions?.(world, c) ?? [],
    area: typeof c.flags.area === 'string' ? c.flags.area : null,
    areas: rule?.areas ?? [],
  };
}

/** The chapter's title for a toast, in either kind of campaign. */
export function chapterTitle(c: CampaignState | null, n: number): string | null {
  const s = storylineOf(c);
  return s ? (s.chapters.find((ch) => ch.n === n)?.title ?? null) : (chapterDef(n)?.title ?? null);
}

/** Story days since the chapter began, for rules that pace themselves. */
export function chapterDays(world: World, c: CampaignState): number {
  return Math.floor((world.timeMs - c.chapterStartMs) / STORY.dayMs);
}
