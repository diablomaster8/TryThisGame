/** Lane C round 10, agent D (re-exported through tuning-camp10.ts). */
import type { StoryRegionId } from './story-regions';

type Shape = 'board' | 'signpost' | 'porchLight' | 'shrine' | 'lens';

interface GroveChange {
  shape: Shape;
  /** A stage mark in the Grove, or (with `region`) that region's entrance. */
  mark: string;
  region?: StoryRegionId;
  off: readonly [number, number];
  lit: boolean;
  glint: boolean;
  glintAt: readonly [number, number, number];
}

export const CAMP10D = {
  /**
   * R0639: the most Shells the stories may hand out in all (the content checker sums them). An
   * assumption, not measured: the recs ask for about 3x a full run's Expedition income, and no
   * figure for that exists yet; 1,200 leaves the lines' 900 room for quest Shells.
   */
  storyShellsMax: 1200,
  props: {
    /** R0607: the notice board stands from this chapter of Hazel's Grove (quests open at 3). */
    boardFromChapter: 3,
    /** Cards drawn on it at most (the painted board has six frames). */
    boardCardsMax: 6,
    /** Drawn only within this many units of the Keeper (farOrchard is 26 from the gate). */
    nearKeeper: 18,
    /** The Grove's board: inside the gate, beside the signpost's spot (units). */
    groveBoard: { mark: 'signpost', off: [1.6, -0.6] as const },
    /** The Sun and Moon Groves' board, beside their shrine. */
    shrineBoard: { off: [-1.8, 0.4] as const },
    /** R0639: the Grove change each line leaves, by its `grove-*` keepsake id. */
    groveChange: {
      'grove-fold-habitat': {
        shape: 'signpost',
        mark: 'gate',
        off: [-2.4, -1.4],
        lit: false,
        glint: false,
        glintAt: [0, 0, 0],
      },
      'grove-server-glow': {
        shape: 'porchLight',
        mark: 'board',
        off: [-1.2, 0.3],
        lit: true,
        glint: false,
        glintAt: [0, 0, 0],
      },
      'grove-beetle-shrine': {
        shape: 'shrine',
        mark: 'stairs',
        region: 'hollow',
        off: [1.8, 1.2],
        lit: true,
        glint: true,
        glintAt: [0, 1.1, 0],
      },
      'grove-sundial': {
        shape: 'lens',
        mark: 'green',
        off: [0, -1.8],
        lit: false,
        glint: true,
        glintAt: [0, 0.22, 0],
      },
    } as Readonly<Record<string, GroveChange>>,
  },
} as const;
