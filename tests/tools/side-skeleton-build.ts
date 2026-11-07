/**
 * R0491 (TECH-50): build the side-story skeleton from the full scripts. The skeleton is what
 * the sim reads before a story's text chunk is fetched: ids, codes, audience, triggers (with
 * the area resolved, so the flavour `where` text stays out), requires, flags, speakers' name
 * plates, step ids, checks, areas and goals, rewards, and every scene's id, end flags, season
 * and choice ids with their flags. Lines, choice labels and `then` lines, staging, hints,
 * skip summaries, childLines, notes and sources stay in the text chunks.
 *
 * Used by `gen-side-skeleton.ts` (writes src/sim/side-story-skeleton.ts) and by the test that
 * keeps the committed skeleton in step with the scripts.
 */
import type { Scene } from '../../src/config/story';
import { areaOf } from '../../src/content/where-map';
import type { Quest } from '../../src/content/types';
import {
  SIDE_STORY_FILES,
  type SideSkeleton,
  type SkeletonQuest,
  type SkeletonScene,
} from '../../src/sim/side-story-files';

function scene(s: Scene): SkeletonScene {
  return {
    id: s.id,
    ...(s.set ? { set: s.set } : {}),
    ...(s.season ? { season: s.season } : {}),
    ...(s.choices?.length
      ? {
          choices: s.choices.map((c) => ({
            id: c.id,
            ...(c.set ? { set: c.set } : {}),
            ...(c.friendship ? { friendship: c.friendship } : {}),
          })),
        }
      : {}),
  };
}

function quest(q: Quest): SkeletonQuest {
  const area = areaOf(q);
  return {
    id: q.id,
    code: q.code,
    title: q.title,
    audience: q.audience,
    trigger: { when: q.trigger.when, ...(area ? { area } : {}) },
    ...(q.requires ? { requires: q.requires } : {}),
    speakers: q.speakers.map((s) => ({ id: s.id, name: s.name, kind: s.kind })),
    steps: q.steps.map((st) => ({
      id: st.id,
      goal: st.goal,
      check: st.check,
      ...(st.area ? { area: st.area } : {}),
      scene: scene(st.scene),
      ...(st.done ? { done: scene(st.done) } : {}),
    })),
    complete: scene(q.complete),
    rewards: q.rewards,
    ...(q.sets ? { sets: q.sets } : {}),
    ...(q.pitch !== undefined ? { pitch: q.pitch } : {}),
    ...(q.pitchChild !== undefined ? { pitchChild: q.pitchChild } : {}),
    ...(q.minutes !== undefined ? { minutes: q.minutes } : {}),
  };
}

/** The skeleton of every file in SIDE_STORY_FILES, in table order. */
export async function buildSideSkeleton(): Promise<SideSkeleton> {
  const out: SideSkeleton = {};
  for (const [file, load] of Object.entries(SIDE_STORY_FILES)) {
    const c = await load();
    out[file] = { quests: c.quests.map(quest), variants: c.variants.map(scene) };
  }
  return out;
}
