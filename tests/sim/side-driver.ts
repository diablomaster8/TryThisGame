/** Drives one side story at a time, for the side-story tests. */
import { expect } from 'vitest';
import { STORY } from '../../src/config/tuning';
import { RUNNER_STORIES } from '../../src/sim/side-stories';
import { sideStory } from '../../src/sim/story-scenes';
import type { SimEvent, World } from '../../src/sim/types';
import { c, campaignWorld, drive } from './campaign-driver';

/** The stories the campaign itself waits on: never skipped, or chapters would hold. */
export const CAMPAIGN_STORIES = ['s5', 's27', 's28', 's9', 's10'];

/** Skip every runner story except the campaign five and `keep`. */
export function skipAllBut(...keep: string[]): string[] {
  return RUNNER_STORIES.filter((id) => !CAMPAIGN_STORIES.includes(id) && !keep.includes(id));
}

export interface StoryRun {
  world: World;
  events: SimEvent[];
  choices: Record<string, string>;
}

/** A campaign world driven until `until` holds, acting only on the kept stories. */
export function runUntil(
  until: (w: World) => boolean,
  keep: string[] = [],
  choices: Record<string, string> = {},
  run?: StoryRun,
): StoryRun {
  const r = run ?? { ...campaignWorld(), choices };
  drive(r.world, r.events, r.choices, {}, { until, skip: skipAllBut(...keep), holdGoal });
  return r;

  /**
   * Play like someone who stays in a chapter while a story is moving: hold the goal
   * while a kept story is mid-step, or has waited less than a day for its next scene,
   * and give every chapter at least one story day so its mornings exist.
   */
  function holdGoal(w: World): boolean {
    const st = c(w);
    if (st.openedMs !== null && w.timeMs < st.openedMs + STORY.dayMs) return true;
    return keep.some((id) => {
      const s = st.side[id];
      if (!s || s.status !== 'open') return false;
      // A queued scene always resolves; a wait or check gets a day from the later of the
      // step's start and the chapter's opening (the longest gap a note asks for), then on.
      if (s.stage === 'scene' || s.stage === 'done' || s.stage === 'complete') return true;
      return w.timeMs < Math.max(s.sinceMs, st.openedMs ?? 0) + 2 * STORY.dayMs + 1000;
    });
  }
}

export function status(r: StoryRun, id: string): string | undefined {
  return c(r.world).side[id]?.status;
}

/** Play `id` to its end (or the chapter window closing) and check it finished properly. */
export function expectStoryDone(
  id: string,
  choices: Record<string, string> = {},
  stopAt: (w: World) => boolean = (w) => c(w).chapter > 12,
  run?: StoryRun,
): StoryRun {
  const r = runUntil((w) => c(w).side[id]?.status === 'done' || stopAt(w), [id], choices, run);
  expect(status(r, id), `${id} status`).toBe('done');
  const quest = sideStory(id)!;
  for (const [k, v] of Object.entries(quest.sets ?? {})) expect(c(r.world).flags[k], k).toBe(v);
  for (const reward of quest.rewards)
    expect(r.world.inventory.keepsakes, reward.id).toContain(reward.id);
  // Every step played a scene (its own or a variant).
  const played = c(r.world).seen.filter((s) => s.startsWith(id + '-')).length;
  expect(played, `${id}: scenes played`).toBeGreaterThanOrEqual(quest.steps.length);
  return r;
}
