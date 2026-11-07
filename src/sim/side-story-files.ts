import type { Choice, Scene } from '../config/story';
import type { Quest, QuestArea, Reward, Speaker } from '../content/types';
import type { SideStoryContent } from './story-scenes';

/**
 * R0491 (TECH-50): every side-story script file as its own lazy chunk. The registry boots
 * from the skeleton (`side-story-skeleton.ts`: ids, triggers, checks, goals, rewards, flags)
 * and fetches a file's scene text only when one of its scenes is about to play, or when the
 * save already has one of its quests under way (story-chunks.ts). The key is the file's
 * name; the skeleton generator (tests/tools/gen-side-skeleton.ts) walks this same table.
 */
const v = (quests: SideStoryContent['quests'], variants: SideStoryContent['variants'] = []) => ({
  quests,
  variants,
});

export const SIDE_STORY_FILES = {
  'side-stories-fun': () =>
    import('../content/side-stories-fun').then((m) => v(m.SIDE_STORIES_FUN)),
  'side-stories-main': () =>
    import('../content/side-stories-main').then((m) =>
      v(m.SIDE_STORIES_MAIN, m.SIDE_STORIES_MAIN_VARIANTS),
    ),
  'side-stories-fun-2': () =>
    import('../content/side-stories-fun-2').then((m) =>
      v(m.SIDE_STORIES_FUN_2, m.SIDE_STORIES_FUN_2_VARIANTS),
    ),
  'side-stories-new-1': () =>
    import('../content/side-stories-new-1').then((m) => v(m.SIDE_STORIES_NEW_1)),
  'side-stories-new-2': () =>
    import('../content/side-stories-new-2').then((m) => v(m.SIDE_STORIES_NEW_2)),
  'side-stories-new-3': () =>
    import('../content/side-stories-new-3').then((m) =>
      v(m.SIDE_STORIES_NEW_3, m.SIDE_STORIES_NEW_3_VARIANTS),
    ),
  'side-stories-new-4': () =>
    import('../content/side-stories-new-4').then((m) => v(m.SIDE_STORIES_NEW_4)),
  'side-stories-s23': () =>
    import('../content/side-stories-s23').then((m) =>
      v(m.SIDE_STORY_S23, m.SIDE_STORY_S23_VARIANTS),
    ),
  'side-stories-s24': () =>
    import('../content/side-stories-s24').then((m) =>
      v(m.SIDE_STORY_S24, m.SIDE_STORY_S24_VARIANTS),
    ),
  'side-stories-s25': () =>
    import('../content/side-stories-s25').then((m) =>
      v(m.SIDE_STORY_S25, m.SIDE_STORY_S25_VARIANTS),
    ),
  'side-stories-s26': () =>
    import('../content/side-stories-s26').then((m) =>
      v(m.SIDE_STORY_S26, m.SIDE_STORY_S26_VARIANTS),
    ),
  'side-stories-s27': () =>
    import('../content/side-stories-s27').then((m) =>
      v(m.SIDE_STORY_S27, m.SIDE_STORY_S27_VARIANTS),
    ),
  'side-stories-s28': () =>
    import('../content/side-stories-s28').then((m) =>
      v(m.SIDE_STORY_S28, m.SIDE_STORY_S28_VARIANTS),
    ),
  'side-stories-s29': () =>
    import('../content/side-stories-s29').then((m) =>
      v(m.SIDE_STORY_S29, m.SIDE_STORY_S29_VARIANTS),
    ),
  'side-stories-s30': () =>
    import('../content/side-stories-s30').then((m) =>
      v(m.SIDE_STORY_S30, m.SIDE_STORY_S30_VARIANTS),
    ),
  'side-stories-s31': () =>
    import('../content/side-stories-s31').then((m) =>
      v(m.SIDE_STORY_S31, m.SIDE_STORY_S31_VARIANTS),
    ),
  'quests-python': () =>
    import('../content/quests-python').then((m) => v(m.QUESTS_PYTHON, m.QUESTS_PYTHON_VARIANTS)),
  'quests-bean': () =>
    import('../content/quests-bean').then((m) => v(m.QUESTS_BEAN, m.QUESTS_BEAN_VARIANTS)),
  'quests-sunny': () =>
    import('../content/quests-sunny').then((m) => v(m.QUESTS_SUNNY, m.QUESTS_SUNNY_VARIANTS)),
  'quests-avatar': () => import('../content/quests-avatar').then((m) => v(m.QUESTS_AVATAR)),
  'quests-alice': () =>
    import('../content/quests-alice').then((m) => v(m.QUESTS_ALICE, m.QUESTS_ALICE_VARIANTS)),
  'quests-holmes': () =>
    import('../content/quests-holmes').then((m) => v(m.QUESTS_HOLMES, m.QUESTS_HOLMES_VARIANTS)),
  'quests-hodja': () =>
    import('../content/quests-hodja').then((m) => v(m.QUESTS_HODJA, m.QUESTS_HODJA_VARIANTS)),
  'expansion-e1': () =>
    import('../content/expansion-e1').then((m) => v(m.EXPANSION_E1, m.EXPANSION_E1_VARIANTS)),
  'expansion-e2': () =>
    import('../content/expansion-e2').then((m) => v(m.EXPANSION_E2, m.EXPANSION_E2_VARIANTS)),
  'expansion-e3': () =>
    import('../content/expansion-e3').then((m) => v(m.EXPANSION_E3, m.EXPANSION_E3_VARIANTS)),
} satisfies Record<string, () => Promise<SideStoryContent>>;

export type SideStoryFile = keyof typeof SIDE_STORY_FILES;

/** A scene before its text loads: what `sceneDone` applies, and the season gate. */
export interface SkeletonScene {
  id: string;
  set?: NonNullable<Scene['set']>;
  season?: NonNullable<Scene['season']>;
  choices?: Array<Pick<Choice, 'id' | 'set' | 'friendship'>>;
}

/** A quest before its text loads (see tests/tools/side-skeleton-build.ts for what is kept). */
export interface SkeletonQuest {
  id: string;
  code: string;
  title: string;
  audience: Quest['audience'];
  trigger: { when: string; area?: QuestArea };
  requires?: string[];
  speakers: Array<Pick<Speaker, 'id' | 'name' | 'kind'>>;
  steps: Array<{
    id: string;
    goal: string;
    check: string;
    area?: string;
    scene: SkeletonScene;
    done?: SkeletonScene;
  }>;
  complete: SkeletonScene;
  rewards: Reward[];
  sets?: NonNullable<Quest['sets']>;
  pitch?: string;
  pitchChild?: string;
  minutes?: number;
}

/** The skeleton of every side-story file, by file key. */
export type SideSkeleton = Record<string, { quests: SkeletonQuest[]; variants: SkeletonScene[] }>;
