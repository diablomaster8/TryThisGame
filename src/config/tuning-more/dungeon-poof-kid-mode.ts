// was tuning-r10b3; review pass R10 B3
/**
 * Numbers for lane B round 10, helper b3: the foe families' "poof and run home" beat (R0157)
 * and kid mode's counting berries, game of tag and four-year-old path (R0188).
 */
export const R10B3 = {
  /** The defeat beat, the same for every family, in render time. */
  poof: {
    /** The leader squashes flat for this long, then bursts. */
    squashMs: 150,
    /** Sparkles in the act's colour. */
    sparkles: 12,
    sparkleMs: 700,
    /** How far the sparkles fly, in world units. */
    spread: 0.9,
    /** The tiny runner: its size, its speed home (units a second) and its longest run. */
    runnerScale: 0.5,
    runSpeed: 3.2,
    runMaxMs: 1600,
    /** The runner fades over the last part of its run. */
    fadeMs: 450,
    /** The "Bye!" / ♪ beat over the runner. */
    byeMs: 900,
    /** Reduced motion: the leader fades in place under a sparkle icon, no burst, no run. */
    calmMs: 900,
    /** Look this many cells round for the nearest wall. */
    wallSearch: 8,
  },
  /** Each act's sparkle colour (Rootways moss, Cloister rose, Dunes gold, Frost ice, Hush grey). */
  actSpark: ['#9be07a', '#ffa8cf', '#ffd060', '#a8e4ff', '#d4d4de'] as const,
  /** The counting berries on a kid level (R0188). */
  berries: {
    count: 5,
    /** Walk this close to pick one. */
    radius: 0.9,
    /** Berries sit along the way down, at most this many cells off it. */
    offPath: 2,
  },
  /** Kid mode's act boss: a game of tag instead of a fight. */
  tag: {
    /** Tags to win. */
    tags: 3,
    /** The boss runs at this share of the Keeper's walking speed, so a child always catches up. */
    fleeShare: 0.55,
    /** It starts running when the Keeper is this many cells away, and only inside its leash. */
    noticeCells: 5,
    /** A tag counts within this distance. */
    contact: 0.9,
    /** After a tag it giggles, then hops this many cells away. */
    pauseMs: 1400,
    hopCells: [3, 5] as const,
  },
  /**
   * The scripted four-year-old (tests only): a small child's pace on the guide path, the time
   * each spoken caption takes, and a play-out per bout turn (a slow tap and the move's show).
   */
  kidPath: {
    paceShare: 0.6,
    wordsPerSecond: 2,
    captionPauseMs: 1500,
    boutTurnMs: 6000,
    /** A small child looks about at each room before going on. */
    lookMs: 4000,
  },
} as const;
