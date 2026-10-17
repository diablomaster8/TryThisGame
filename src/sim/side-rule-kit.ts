import { LANTERN_POSTS, STORY } from '../config/tuning';
import { storyPropMeets } from './story-props';
import { nextDawn, nextDusk, seen, seenAt } from './story-state';
import type { CampaignState, Command, SideStoryState, SimEvent, World } from './types';

/**
 * The shared pieces of a side-story rule: the rule shape, the story clock, chapter windows,
 * and the checks the sim can watch on its own (`watchCheck`). Each rule file (the five
 * campaign stories in side-stories.ts, then side-rules-early/mid/late.ts) builds on these;
 * the runner in side-stories.ts steps them. Nothing here touches the DOM.
 */

export interface StoryRule {
  id: string;
  opens(world: World, c: CampaignState): boolean;
  /** Close an open story unfinished (its window has passed). */
  closes?(world: World, c: CampaignState, st: SideStoryState): boolean;
  /** Jumps the notes allow (wishes lapsing, S9 skipping to the gate). */
  adjust?(world: World, c: CampaignState, st: SideStoryState): void;
  /** May step `i`'s scene play yet. Defaults to straight away. */
  gate?(world: World, c: CampaignState, st: SideStoryState, i: number): boolean;
  /** Scenes to play just before step `i`'s scene (`i` = steps.length: before the complete scene). */
  before?(world: World, c: CampaignState, i: number): string[];
  /** Scenes to play straight after step `i`'s scene (`i` = steps.length: after the complete scene). */
  after?(world: World, c: CampaignState, i: number): string[];
  /** Step `i`'s check, met without the Keeper's action (on top of `watchCheck`). */
  auto?(world: World, c: CampaignState, st: SideStoryState, i: number): boolean;
  /** Steps whose check only the sim can meet (no journal action). */
  autoOnly?: number[];
  completeGate?(world: World, c: CampaignState, st: SideStoryState): boolean;
  /** May the journal offer step `i`'s action now (a place that only exists later). */
  canAct?(world: World, c: CampaignState, st: SideStoryState, i: number): boolean;
  /** Custom reading of a Keeper command while step `i` waits on its check. */
  note?(world: World, c: CampaignState, st: SideStoryState, i: number, cmd: Command): void;
  /** The scene to play in place of `scene`. */
  variant?(world: World, c: CampaignState, scene: string): string;
  /** Hold the next chapter's opening while this is true of the open story. */
  holdsNext?(world: World, c: CampaignState, st: SideStoryState): boolean;
  /** Hold this chapter's closing scene while this is true of the open story. */
  holdsClose?(world: World, c: CampaignState, st: SideStoryState): boolean;
  /** World side effects once `scene` has been seen while the story is open. */
  sceneDone?(world: World, c: CampaignState, scene: string, events: SimEvent[]): void;
}

// ------------------------------------------------------------------ the story clock

export const dawnSince = (w: World, st: SideStoryState): boolean =>
  w.timeMs >= nextDawn(st.sinceMs);
export const duskSince = (w: World, st: SideStoryState): boolean =>
  w.timeMs >= nextDusk(st.sinceMs);

/** The first instant after `ms` at which the story day is `frac` of the way through. */
export function nextAt(ms: number, frac: number): number {
  const today = Math.floor(ms / STORY.dayMs) * STORY.dayMs + frac * STORY.dayMs;
  return today > ms ? today : today + STORY.dayMs;
}

/** `n` story days after `ms`, at dawn. */
export function dawnsAfter(ms: number, n: number): number {
  return nextDawn(ms) + (n - 1) * STORY.dayMs;
}

export function storyDay(ms: number): number {
  return Math.floor(ms / STORY.dayMs);
}

export function sameDay(a: number, b: number): boolean {
  return storyDay(a) === storyDay(b);
}

/** Dusk to dawn. */
export function isNight(ms: number): boolean {
  return ms % STORY.dayMs >= STORY.duskAt * STORY.dayMs;
}

export function isMorning(ms: number): boolean {
  return ms % STORY.dayMs < STORY.morningEndsAt * STORY.dayMs;
}

export function isAfternoon(ms: number): boolean {
  const f = ms % STORY.dayMs;
  return f >= STORY.morningEndsAt * STORY.dayMs && f < STORY.duskAt * STORY.dayMs;
}

/** The first dawn after scene `id` was seen has passed (false until it is seen). */
export function morningAfterScene(w: World, c: CampaignState, id: string): boolean {
  const at = seenAt(c, id);
  return at !== null && w.timeMs >= nextDawn(at);
}

/** The first dusk after scene `id` was seen has passed (false until it is seen). */
export function duskAfterScene(w: World, c: CampaignState, id: string): boolean {
  const at = seenAt(c, id);
  return at !== null && w.timeMs >= nextDusk(at);
}

/** The first morning after the ending has played: the post-game spring. */
export function postGameMorning(w: World, c: CampaignState): boolean {
  if (c.chapter <= 12 || !c.ending) return false;
  const last = seenAt(c, `end-${c.ending}-last`);
  return last !== null && w.timeMs >= nextDawn(last);
}

/** The sim time the chapter's opening scene was seen, if it has been. */
export function openedAt(c: CampaignState): number | null {
  return c.openedMs;
}

/** The first dawn after this chapter's opening has passed. */
export function morningAfterOpen(w: World, c: CampaignState): boolean {
  return c.openedMs !== null && w.timeMs >= nextDawn(c.openedMs);
}

/** Another story opened this very story day. */
export function openedToday(w: World, c: CampaignState, ...ids: string[]): boolean {
  return ids.some((id) => {
    const st = c.side[id];
    return st !== undefined && sameDay(st.openedMs, w.timeMs);
  });
}

// ------------------------------------------------------------------ chapter windows

export const inChapter = (c: CampaignState, a: number, b = a): boolean =>
  c.chapter >= a && c.chapter <= b;

/**
 * Chapter `n` has begun: its opening scene has played. The chapter number itself can
 * move on earlier while the opening is held (the three nights before the Long Night).
 */
export function chapterBegun(c: CampaignState, n: number): boolean {
  return c.chapter > n || (c.chapter === n && c.step >= 1);
}

/** The story closes unfinished once chapter `n` has begun. */
export const closesAtChapter =
  (n: number) =>
  (_w: World, c: CampaignState): boolean =>
    chapterBegun(c, n);

/** The story closes unfinished once scene `id` has been seen. */
export const closesAtScene =
  (id: string) =>
  (_w: World, c: CampaignState): boolean =>
    seen(c, id);

// ------------------------------------------------------------------ what the sim can watch

const TIME_WORDS = {
  dusk: ['dusk', 'evening', 'night', 'sunset'],
  midnight: ['midnight', 'one-oclock', 'small-hours'],
  dawn: ['dawn', 'morning', 'first-light', 'sunrise'],
  late: ['frost', 'later'],
} as const;

/** A short sit: how long "sit with them a while" takes on the story clock. */
export const SHORT_WAIT_MS = STORY.shortWaitMs;

function hasWord(tokens: string[], words: readonly string[]): boolean {
  return tokens.some((t) => words.includes(t));
}

/**
 * Time-based checks the sim meets on its own, from the check's own words. `wait:` and
 * `sit:` are always met in time (by the named moment, or after a short sit); `watch:` and
 * `night:` only when they name a moment.
 */
export function timeCheckMet(w: World, st: SideStoryState, check: string): boolean | null {
  const tokens = check.split(':');
  const verb = tokens[0]!;
  const timed = verb === 'wait' || verb === 'sit' || verb === 'watch' || verb === 'night';
  if (!timed) return null;
  if (hasWord(tokens, TIME_WORDS.midnight)) return w.timeMs >= nextAt(st.sinceMs, STORY.midnightAt);
  if (hasWord(tokens, TIME_WORDS.late)) return w.timeMs >= nextAt(st.sinceMs, STORY.lateNightAt);
  if (hasWord(tokens, TIME_WORDS.dawn)) return dawnSince(w, st);
  if (verb === 'night' || hasWord(tokens, TIME_WORDS.dusk)) return duskSince(w, st);
  if (verb === 'wait' || verb === 'sit') return w.timeMs >= st.sinceMs + SHORT_WAIT_MS;
  return null;
}

/** Keeper within reach of one of the four lantern posts. */
export function keeperAtLantern(w: World): boolean {
  const k = w.keeper.pos;
  return LANTERN_POSTS.some((p) => Math.hypot(p.x - k.x, p.z - k.z) <= STORY.lanternReach);
}

/**
 * Checks met by the world's state alone: a moment passing, a chapter ending, a choice
 * already made in the step's scene, or the Keeper walking Moss to a lantern post.
 */
export function watchCheck(w: World, c: CampaignState, st: SideStoryState, check: string): boolean {
  const timed = timeCheckMet(w, st, check);
  if (timed !== null) return timed;
  const tokens = check.split(':');
  switch (tokens[0]) {
    case 'choose':
      return true;
    case 'chapter': {
      const n = Number(tokens[1]);
      return tokens[2] === 'end' ? c.chapter > n : c.chapter >= n;
    }
    case 'walk':
      return tokens.some((t) => t.startsWith('lantern')) && keeperAtLantern(w);
    default:
      return false;
  }
}

/**
 * Checks met by a Keeper command: the verb and, for talks and visits, the person named.
 * The runner marks the step acted when a command matches.
 */
export function commandMeets(check: string, cmd: Command, world: World): boolean {
  const tokens = check.split(':');
  switch (cmd.kind) {
    case 'talk': {
      if (tokens[0] !== 'talk') return false;
      const npc = world.npcs.find((n) => n.id === cmd.npcId);
      return npc !== undefined && tokens.includes(npc.trainer);
    }
    case 'visit':
      return tokens[0] === 'visit' && cmd.trainer !== null && tokens.includes(cmd.trainer);
    case 'pet':
      return tokens[0] === 'pet';
    case 'feed':
      return tokens[0] === 'feed' && tokens[1] === 'nubbin';
    case 'shakeTree':
      return tokens[0] === 'shake';
    case 'craft':
      return tokens[0] === 'craft';
    case 'raceResult':
      return tokens[0] === 'race';
    case 'placeDecor':
      return tokens[0] === 'place' && tokens[1] === 'decor';
    case 'wearHat':
      return tokens[0] === 'place' && tokens[1] === 'cosmetic';
    case 'storyProp':
      return storyPropMeets(cmd.prop, tokens);
    default:
      return false;
  }
}

/** The verbs that fall to the journal's "Do it" (for the stub list and the tests). */
export const WATCHED_VERBS = [
  'wait',
  'sit',
  'night',
  'chapter',
  'choose',
  'talk',
  'visit',
  'pet',
  'feed',
  'shake',
  'craft',
  'race',
  'place',
] as const;
