import { STORY_B } from '../config/tuning-b';
import { STORY } from '../config/tuning';
import type { SceneStage } from '../config/story';
import type { World } from '../sim/types';
import { stageFlags, type StageFlags } from './scene-stage';

/**
 * What package b draws, decided from the world and the stage, never written back: the
 * gate's openness and ivy (C4), The Hundred Days' ruin level (C6), whether Dawn & Dusk's
 * houses stand (C7), the jetty's boards (M9), the mill wheel's turn (M10) and the day count
 * on the gate post (N7). Both renderers ask the same questions here.
 */
export interface GateState {
  /** 0 shut .. 1 swung wide. */
  openness: number;
  overgrown: boolean;
  /** The Hundred Days' gate has no fence either side of it. */
  bare: boolean;
  /** Days carved on the post (The Hundred Days only), else 0. */
  tally: number;
}

export interface StoryBState {
  gate: GateState;
  /** The Fold's ruin level 0..3 when `campaign === 'hundred'`, else 0. */
  ruin: number;
  hundred: boolean;
  dawnDusk: boolean;
  jettyMended: boolean;
  wheelTurns: boolean;
  /** 0 or the sails' stopped state. */
  sailsStopped: boolean;
}

export function storyBState(world: World, stage: SceneStage | null): StoryBState {
  return stateFrom(world, stage, stageFlags(world, stage));
}

export function stateFrom(world: World, stage: SceneStage | null, f: StageFlags): StoryBState {
  const g = STORY_B.gate;
  const hundred = f.storyline === 'hundred';
  const dawnDusk = f.storyline === 'dawn' || f.storyline === 'dusk';
  const idx = f.storyChapter ?? -1;
  // The Fold mends chapter by chapter; after the ending it stands whole.
  const levels = STORY_B.fold.levelByChapter;
  const ruin = hundred ? (idx < 0 ? 0 : (levels[Math.min(idx, levels.length - 1)] ?? 0)) : 0;
  let openness = 0.45;
  let overgrown = false;
  if (f.campaign === 'hazel') {
    if (f.chapter <= 1) openness = g.stuck;
    else if (f.chapter === 2) openness = 0;
    else openness = g.ajar;
    overgrown = f.chapter >= 1 && f.chapter <= g.ivyThroughChapter;
  } else if (hundred) {
    openness = idx <= 0 ? g.stuck : g.ajar;
    overgrown = idx >= 0 && idx < 2;
  }
  const open = stage?.props?.gate;
  if (open === 'open') openness = 1;
  else if (open === 'shut') openness = 0;
  else if (f.sceneId && (g.openScenes as readonly string[]).includes(f.sceneId)) openness = 1;
  const tally = hundred
    ? Math.min(STORY_B.tally.max, Math.max(0, Math.floor(world.timeMs / STORY.dayMs)))
    : 0;
  return {
    gate: { openness, overgrown, bare: hundred, tally },
    ruin,
    hundred,
    dawnDusk,
    jettyMended: !hundred || idx < 0 || idx >= STORY_B.shore.mendedFromChapter,
    wheelTurns: hundred && (idx < 0 || idx >= STORY_B.mill.turnFromChapter),
    sailsStopped: ruin >= STORY_B.fold.sailsStopAt,
  };
}
