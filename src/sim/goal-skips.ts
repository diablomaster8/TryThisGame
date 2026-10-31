/**
 * Lane C round 10, agent C (R0615 CAMP-23, for R0614's Story only pace): skipping the spine's
 * goal makes the smallest world change the rest of the story reads, so later scenes and
 * `endingFor` still make sense (Sable's trust really is 45 after "Bring Sable's trust to 45").
 * Choices (Corvin's garden, the final choice) are never skipped. A skip grants no first-clear
 * prize beyond the minimum, and is recorded in `campaign.skipped` with the sim time.
 * Chapter 10's vigil can be skipped too, once it is under way: the night runs to dawn.
 */
import { LANTERN_POSTS, SKIP, STORY } from '../config/tuning';
import { chapterDef, goalMet } from './campaign';
import { hatch } from './lifecycle';
import { checkVerbs, microFor } from './micro';
import { WATCHED_VERBS } from './side-rule-kit';
import { goalsSkippable } from './story-pace';
import { sableOf } from './story-state';
import type { CampaignState, SimEvent, World } from './types';

/** The valley friends chapter 11's goal asks you to visit, in the order a skip names them. */
const FRIENDS = ['fern', 'marina', 'sparks', 'clover'] as const;

function lightAll(c: CampaignState): void {
  for (const p of LANTERN_POSTS) c.flags[`lantern:${p.id}`] = true;
  c.stats.lanterns = Math.max(c.stats.lanterns, LANTERN_POSTS.length);
}

function raiseSable(world: World, c: CampaignState, to: number): void {
  const s = sableOf(world, c);
  if (s) s.trust = Math.max(s.trust, to);
}

/** Goal id → the minimum change that meets it. Choice goals have no entry. */
export const GOAL_SKIPS: Readonly<
  Record<string, (world: World, c: CampaignState, events: SimEvent[]) => void>
> = {
  firstHatch: (w, c, events) => {
    if (c.stats.hatched < 1) {
      const egg = w.nubbins.find(
        (n) => n.stage === 'egg' && n.id !== c.mossId && n.id !== c.sableId,
      );
      if (egg) hatch(egg, events, w.timeMs);
      // The campaign folds the hatch event later; the goal must read as met now.
      c.stats.hatched = Math.max(c.stats.hatched, 1);
    }
    c.stats.pets = Math.max(c.stats.pets, 1);
  },
  feedTwice: (_w, c) => {
    c.stats.feeds = Math.max(c.stats.feeds, 2);
  },
  sableTrust20: (w, c) => raiseSable(w, c, 20),
  sableTrust45: (w, c) => raiseSable(w, c, 45),
  lanternsAndMoss: (_w, c) => {
    lightAll(c);
    c.flags.mossPetted = true;
  },
  // No prize and no tier unlocked: only the count the goal reads.
  winRace: (_w, c) => {
    c.stats.races = Math.max(c.stats.races, 1);
  },
  talkDusty: (_w, c) => {
    c.flags['talked:6:dusty'] = true;
  },
  expedition: (w, c) => {
    c.stats.expeditions += 1;
    w.inventory.shells += SKIP.expeditionShells;
  },
  notebook: (_w, c) => {
    c.flags.notebookFound = true;
  },
  lanternsAgain: (_w, c) => {
    c.flags.lanternsRound = 2;
    lightAll(c);
  },
  threeFriends: (_w, c) => {
    for (const t of FRIENDS) {
      if (Object.keys(c.flags).filter((k) => k.startsWith(`talked:${c.chapter}:`)).length >= 3)
        break;
      c.flags[`talked:${c.chapter}:${t}`] = true;
    }
  },
};

/** The vigil is under way and not yet at dawn. */
function vigilOpen(c: CampaignState): boolean {
  const v = c.vigil;
  return c.chapter === 10 && c.step === 2 && !!v && !v.done && v.progressMs < STORY.vigilMs;
}

/** The goal id a skip would meet now, or null (nothing to skip, a choice, or the wrong pace). */
export function skippableGoal(world: World): string | null {
  const c = world.campaign;
  if (!c || c.storyline || !goalsSkippable(world) || c.queue.length > 0) return null;
  if (vigilOpen(c)) return 'vigil';
  const goal = chapterDef(c.chapter)?.goal;
  if (c.step !== 1 || !goal || !GOAL_SKIPS[goal] || goalMet(world, c)) return null;
  return goal;
}

/** Skip the current goal (the `skipGoal` command). Returns the goal id skipped, or null. */
export function skipGoal(world: World, events: SimEvent[]): string | null {
  const goal = skippableGoal(world);
  const c = world.campaign;
  if (!goal || !c) return null;
  if (goal === 'vigil') {
    lightAll(c);
    c.vigil!.progressMs = STORY.vigilMs;
  } else GOAL_SKIPS[goal]!(world, c, events);
  (c.skipped ??= {})[goal] = world.timeMs;
  return goal;
}

/**
 * Verbs the sim meets on its own, from the world or a Keeper command (`side-rule-kit.ts`), plus
 * `watch` (a timed sit) and `lang` (a language quest's steps are met by its scenes).
 */
const SIM_WATCHED: ReadonlySet<string> = new Set<string>([
  ...WATCHED_VERBS,
  'walk',
  'watch',
  'lang',
]);

/**
 * R0636 (CAMP-44): whether the Grove can play step check `check` at all: each of its verbs is
 * a micro-game or something the sim watches. An unplayable step's journal control is
 * "Imagine it" (a skip with the summary card); the content checker counts them.
 */
export function stepPlayable(check: string): boolean {
  return checkVerbs(check).every((v) => microFor(v) !== null || SIM_WATCHED.has(v));
}
