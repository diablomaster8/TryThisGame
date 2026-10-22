/**
 * Tunables for campaign-graphics package b (re-exported from tuning.ts): the Grove's gate,
 * The Hundred Days' ruined Fold, Dawn & Dusk's four houses and green, the shore jetty, the
 * mill wheel and the day post (C4, C6, C7, M9, M10, N7). Every number is a default.
 */
export const STORY_B = {
  gate: {
    /** Half the lane's width between the posts, post size and height, in world units. */
    half: 1.55,
    postSize: 0.3,
    postHeight: 2.35,
    /** The leaf's swing at openness 1 (radians): it opens inward, toward the Grove. */
    swing: 1.45,
    /** Openness for each state: stuck in ch1, shut, propped open once the Keeper is in. */
    stuck: 0.1,
    ajar: 0.7,
    /** Ivy stays on the gate through this campaign chapter. */
    ivyThroughChapter: 2,
    /** Fence panels either side of the posts (none in The Hundred Days). */
    panels: 2,
    /** Scene ids that always show the gate swung wide. */
    openScenes: ['c2-corvin', 'c8-open', 'c11-gate'],
  },
  fold: {
    /** Ruin level (0 whole, 3 roofless) by The Hundred Days chapter index (0-based). */
    levelByChapter: [3, 3, 3, 2, 2, 2, 1, 1, 1, 0] as readonly number[],
    /** The windmill's sails stand still at this ruin level and above. */
    sailsStopAt: 2,
    /** The stock buildings that the Fold re-draws. */
    buildings: ['cottage', 'school', 'dojo'] as const,
  },
  dawnDusk: {
    /**
     * The mown green and the four houses round it, on the school's ground north of the heart:
     * clear of the gate and its fence, the lane, the well, the pond and the hills.
     */
    green: { x: -4, z: -14, r: 4.8 },
    houseRadius: 6,
    /** Crest, roof colour and width for each house, clockwise from the north. */
    houses: [
      { crest: 'sun', roof: '#e8a53a', w: 4.4 },
      { crest: 'moon', roof: '#6f7ac0', w: 4.2 },
      { crest: 'leaf', roof: '#6aa85a', w: 4.4 },
      { crest: 'wave', roof: '#4aa0c4', w: 4.2 },
    ] as const,
    /** The stock buildings swapped out while the save is in this mode. */
    swapped: ['cottage', 'school'] as const,
  },
  shore: {
    /** The jetty's bearing from the pond's centre (radians, 0 = +x), length and width. */
    bearing: 2.55,
    length: 4.2,
    width: 1.1,
    boards: 9,
    /** Boards missing (indexes from the shore) until the shore chapter is mended. */
    missing: [3, 5] as readonly number[],
    mendedFromChapter: 6,
    /** The grey sand band round the pond's edge. */
    sand: '#8f8a78',
    sandWidth: 0.9,
  },
  mill: {
    radius: 1.15,
    /** Where the wheel stands: on the stream between the bridge and the pond. */
    at: { x: 8.6, z: -1.6 },
    /** It turns from this Hundred Days chapter on (radians per second). */
    turnFromChapter: 8,
    speed: 0.9,
  },
  tally: {
    /** Day marks to draw at most (the span is a hundred days). */
    max: 100,
    perGroup: 5,
  },
} as const;
