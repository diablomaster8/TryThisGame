/**
 * R0616 (CAMP-24): "Rest until …". When the story's next beat waits only for an hour of the
 * story clock (a scene that names a time of day, a quest step that waits for dawn or dusk),
 * the objective chip offers to rest until then. Resting is not a skip: the UI runs the
 * ordinary live clock at `REST.restScale` until `restWait` comes back null, so Nubbins age,
 * eat and sleep exactly as they would at that speed and no check is met by hand. This file
 * only answers "is the story waiting for an hour, and which one" from the world.
 */
import { REST, STORY } from '../config/tuning';
import { chapterDef, FINAL_CHAPTER, goalMet } from './campaign';
import { timeCheckMet } from './side-rule-kit';
import { sideHoldsOpening } from './side-stories';
import { sideStory } from './story-scenes';
import { nextDawn, sceneTimeHolds, seen } from './story-state';
import type { CampaignState, World } from './types';

export type RestWhen = 'dawn' | 'morning' | 'afternoon' | 'dusk' | 'night' | 'tomorrow';

export interface RestWait {
  /** What the button names. */
  when: RestWhen;
  /** The sim time the wait is over (the rest stops then, or sooner if the beat comes). */
  untilMs: number;
  /** Whose wait: the spine ('hazel') or a tracked quest's id. */
  owner: string;
}

/** The first sim time from `fromMs` on (to the horizon) at which `holds` is true, or null. */
export function firstHolds(fromMs: number, holds: (ms: number) => boolean): number | null {
  for (let t = fromMs; t <= fromMs + REST.horizonMs; t += REST.scanMs) if (holds(t)) return t;
  return null;
}

/** The word for the moment `ms` falls in, as the button says it. */
export function restWord(ms: number, nowMs: number): RestWhen {
  const f = (ms % STORY.dayMs) / STORY.dayMs;
  if (f < REST.edge) return 'dawn';
  if (f < STORY.morningEndsAt) return ms - nowMs > STORY.dayMs ? 'tomorrow' : 'morning';
  if (f < STORY.duskAt) return 'afternoon';
  if (f < STORY.duskAt + REST.edge) return 'dusk';
  return 'night';
}

function wait(world: World, owner: string, holds: (ms: number) => boolean): RestWait | null {
  if (holds(world.timeMs)) return null;
  const at = firstHolds(world.timeMs, holds);
  if (at === null) return null;
  return { when: restWord(at, world.timeMs), untilMs: at, owner };
}

/** The spine's next beat, when only the clock holds it (mirrors campaign.ts stepChapter). */
function spineWait(world: World, c: CampaignState): RestWait | null {
  if (c.storyline || c.chapter < 1 || c.chapter > FINAL_CHAPTER || c.queue.length > 0) return null;
  if (c.vigil && !c.vigil.done) return null;
  const def = chapterDef(c.chapter);
  if (!def) return null;
  if (c.step === 0 && !seen(c, def.opening)) {
    // The nights before the Long Night: rest to the next dawn, and again if need be.
    if (sideHoldsOpening(world, c))
      return { when: 'dawn', untilMs: nextDawn(world.timeMs), owner: 'hazel' };
    return wait(world, 'hazel', (ms) => sceneTimeHolds(ms, def.opening));
  }
  if (c.step === 1 && c.chapter !== 10 && goalMet(world, c) && !seen(c, def.closing))
    return wait(world, 'hazel', (ms) => sceneTimeHolds(ms, def.closing));
  if (c.step === 2 && seen(c, def.closing) && c.chapter < FINAL_CHAPTER) {
    const next = chapterDef(c.chapter + 1);
    const minMs = (c.openedMs ?? 0) + STORY.goalMinMs;
    if (!next) return null;
    return wait(world, 'hazel', (ms) => ms >= minMs && sceneTimeHolds(ms, next.opening));
  }
  return null;
}

/** A tracked quest whose step waits for a moment of the story clock (dawn, dusk, a sit). */
function questWait(world: World, c: CampaignState, id: string): RestWait | null {
  const st = c.side[id] ?? c.fun[id];
  const check = st?.status === 'open' ? sideStory(id)?.steps[st.step]?.check : undefined;
  if (!st || st.stage !== 'check' || !check) return null;
  if (timeCheckMet(world, st, check) !== false) return null;
  return wait(world, id, (ms) => timeCheckMet({ ...world, timeMs: ms }, st, check) === true);
}

/**
 * What the story waits for now, if only the clock: the spine first, then the tracked quests in
 * order. Null while a scene is queued, during the vigil, or when the wait is not for an hour.
 */
export function restWait(world: World): RestWait | null {
  const c = world.campaign;
  if (!c || world.edu) return null;
  if (c.vigil && !c.vigil.done) return null;
  if (c.queue.length > 0) return null;
  const spine = spineWait(world, c);
  if (spine) return spine;
  for (const id of world.questBook?.tracked ?? []) {
    const q = questWait(world, c, id);
    if (q) return q;
  }
  return null;
}

/** Should a rest that began for `owner` stop now: its beat came, a scene queued, or time is up. */
export function restOver(world: World, untilMs: number): boolean {
  const c = world.campaign;
  if (!c || c.queue.length > 0 || (c.vigil && !c.vigil.done)) return true;
  return world.timeMs >= untilMs || restWait(world) === null;
}
