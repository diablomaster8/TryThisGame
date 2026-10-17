import type { SideStoryContent } from './story-scenes';
import { EXPANSION_E1, EXPANSION_E1_VARIANTS } from '../content/expansion-e1';
import { EXPANSION_E2, EXPANSION_E2_VARIANTS } from '../content/expansion-e2';
import { EXPANSION_E3, EXPANSION_E3_VARIANTS } from '../content/expansion-e3';
import { QUESTS_AVATAR } from '../content/quests-avatar';
import { QUESTS_BEAN } from '../content/quests-bean';
import { QUESTS_PYTHON } from '../content/quests-python';
import { QUESTS_SUNNY } from '../content/quests-sunny';
import { SIDE_STORIES_FUN } from '../content/side-stories-fun';
import { SIDE_STORIES_FUN_2, SIDE_STORIES_FUN_2_VARIANTS } from '../content/side-stories-fun-2';
import { SIDE_STORIES_MAIN, SIDE_STORIES_MAIN_VARIANTS } from '../content/side-stories-main';
import { SIDE_STORIES_NEW_1 } from '../content/side-stories-new-1';
import { SIDE_STORIES_NEW_2 } from '../content/side-stories-new-2';
import { SIDE_STORIES_NEW_3, SIDE_STORIES_NEW_3_VARIANTS } from '../content/side-stories-new-3';
import { SIDE_STORIES_NEW_4 } from '../content/side-stories-new-4';
import { SIDE_STORY_S23, SIDE_STORY_S23_VARIANTS } from '../content/side-stories-s23';
import { SIDE_STORY_S24, SIDE_STORY_S24_VARIANTS } from '../content/side-stories-s24';
import { SIDE_STORY_S25, SIDE_STORY_S25_VARIANTS } from '../content/side-stories-s25';
import { SIDE_STORY_S26, SIDE_STORY_S26_VARIANTS } from '../content/side-stories-s26';
import { SIDE_STORY_S27, SIDE_STORY_S27_VARIANTS } from '../content/side-stories-s27';
import { SIDE_STORY_S28, SIDE_STORY_S28_VARIANTS } from '../content/side-stories-s28';
import { SIDE_STORY_S29, SIDE_STORY_S29_VARIANTS } from '../content/side-stories-s29';
import { SIDE_STORY_S30, SIDE_STORY_S30_VARIANTS } from '../content/side-stories-s30';
import { SIDE_STORY_S31, SIDE_STORY_S31_VARIANTS } from '../content/side-stories-s31';

/**
 * Every Grove side-story script (S1–S31) and its variant scenes. This module is its own
 * chunk: story-scenes.ts loads it with `loadSideStories` and registers it, so the scripts
 * stay out of the main bundle. Tests import it directly.
 */
export const SIDE_STORY_CONTENT: SideStoryContent = {
  quests: [
    ...SIDE_STORIES_FUN,
    ...SIDE_STORIES_MAIN,
    ...SIDE_STORIES_FUN_2,
    ...SIDE_STORIES_NEW_1,
    ...SIDE_STORIES_NEW_2,
    ...SIDE_STORIES_NEW_3,
    ...SIDE_STORIES_NEW_4,
    ...SIDE_STORY_S23,
    ...SIDE_STORY_S24,
    ...SIDE_STORY_S25,
    ...SIDE_STORY_S26,
    ...SIDE_STORY_S27,
    ...SIDE_STORY_S28,
    ...SIDE_STORY_S29,
    ...SIDE_STORY_S30,
    ...SIDE_STORY_S31,
    ...QUESTS_PYTHON,
    ...QUESTS_BEAN,
    ...QUESTS_SUNNY,
    ...QUESTS_AVATAR,
    ...EXPANSION_E1,
    ...EXPANSION_E2,
    ...EXPANSION_E3,
  ],
  variants: [
    ...SIDE_STORIES_MAIN_VARIANTS,
    ...SIDE_STORIES_FUN_2_VARIANTS,
    ...SIDE_STORIES_NEW_3_VARIANTS,
    ...SIDE_STORY_S23_VARIANTS,
    ...SIDE_STORY_S24_VARIANTS,
    ...SIDE_STORY_S25_VARIANTS,
    ...SIDE_STORY_S26_VARIANTS,
    ...SIDE_STORY_S27_VARIANTS,
    ...SIDE_STORY_S28_VARIANTS,
    ...SIDE_STORY_S29_VARIANTS,
    ...SIDE_STORY_S30_VARIANTS,
    ...SIDE_STORY_S31_VARIANTS,
    ...EXPANSION_E1_VARIANTS,
    ...EXPANSION_E2_VARIANTS,
    ...EXPANSION_E3_VARIANTS,
  ],
};
