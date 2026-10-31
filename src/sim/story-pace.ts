/**
 * Lane C round 10, agent C (R0614, CAMP-22): the Story pace setting. Full keeps every pause the
 * story was written with; Brisk shortens the breather after a scene, the gap between side
 * stories, a chapter's goal minimum and the closing's settle by `PACE.brisk`; Story only is
 * Brisk plus a Skip on goals and quest steps (choices are never skipped). The hour a scene
 * names is not shortened: the objective chip's "Rest until" covers those.
 */
import { PACE } from '../config/tuning';
import type { StoryPace, World } from './types';

export function storyPaceOf(world: World): StoryPace {
  return world.settings.storyPace ?? 'full';
}

/** A story wait (ms), scaled by the pace. */
export function paced(world: World, ms: number): number {
  return storyPaceOf(world) === 'full' ? ms : ms * PACE.brisk;
}

/** Whether goals and quest steps may be skipped (Story only, and never for a sprout reader). */
export function goalsSkippable(world: World): boolean {
  return storyPaceOf(world) === 'story' && world.edu?.band !== 'sprout';
}
