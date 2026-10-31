/** Lane C round 10, agent C (re-exported through strings-camp10.ts). */

/**
 * R0636 (CAMP-44): the journal's step controls, replacing the old "Do it": Go there when the
 * step happens somewhere the Grove has, Play it when a micro-game stands in for it, and
 * Imagine it (a skip with a summary card) when nothing in the Grove can play it yet.
 */
export const STEP_TEXT = {
  goThere: '📍 Go there',
  goThereLabel: 'Go there: walk to where this happens',
  playIt: (game: string) => `▶ Play it · ${game}`,
  imagine: '✨ Imagine it',
  imagineHelp: 'Nothing in the Grove plays this part yet. Imagine it, and the story carries on.',
  skip: '⏭ Skip',
  skipGoal: '⏭ Skip goal',
  /** A storyline goal that waits on the Keeper's word: nothing to walk to or play. */
  storyImagine: '✨ Imagine it',
} as const;

/** R0617 (CAMP-25): the summary card after a skip or an imagined step. */
export const SKIP_CARD_TEXT = {
  title: 'What happened',
  /** Fallback when a step has no writer summary: its goal, marked done. */
  done: (goal: string) => `Done: ${goal}`,
  changesHead: 'In the Grove',
  ok: 'Carry on',
  /**
   * The spine's goals, skipped (Story only pace). Past tense, second person. Chapters 9 and 12
   * are choices and are never skipped; their lines say so.
   */
  chapter: {
    1: 'You hatched an egg and petted the Nubbin that came out of it.',
    2: 'You fed a Nubbin by hand, twice. Small promises, kept.',
    3: 'You sat still near Sable, and the Shadow came a little closer.',
    4: 'You petted Moss on the hill and lit all four lanterns.',
    5: 'You won a race. The ribbon is yours, though no prize came with it.',
    6: 'You sat with Dusty by the flower for a while, and neither of you hurried.',
    7: 'You stayed patient with Sable, and the Shadow trusts you more than before.',
    8: 'You walked the Hollow and found Hazel’s notebook.',
    9: 'This is a choice, so it waits for you.',
    10: 'You kept all four lanterns lit through the longest night.',
    11: 'You talked with three Keepers in the valley.',
    12: 'This is a choice, so it waits for you.',
  } as Readonly<Record<number, string>>,
  /** The world changes a skipped goal made, by goal id. */
  changes: {
    firstHatch: ['An egg has hatched.'],
    feedTwice: ['Two fruit were given and eaten.'],
    sableTrust20: ['Sable’s trust is now 20.'],
    sableTrust45: ['Sable’s trust is now 45.'],
    lanternsAndMoss: ['All four lanterns are lit.', 'Moss has been petted.'],
    winRace: ['One race won (no prize).'],
    talkDusty: ['You have talked with Dusty.'],
    expedition: ['+30 Shells from an Expedition.'],
    notebook: ['Hazel’s notebook is found.'],
    lanternsAgain: ['All four lanterns are lit.'],
    threeFriends: ['Three Keepers talked with.'],
  } as Readonly<Record<string, readonly string[]>>,
} as const;

/** R0614 (CAMP-22): Settings → Story pace. */
export const PACE_TEXT = {
  label: 'Story pace',
  help: 'Full keeps the story’s pauses. Brisk shortens the waits. Story only also lets you skip goals (never choices).',
  options: { full: 'Full', brisk: 'Brisk', story: 'Story only' } as Readonly<
    Record<string, string>
  >,
} as const;

/** R0635 (CAMP-43): a questline on the objective chip, with its chapters left. */
export const CHIP_LINE_TEXT = {
  goal: (line: string, goal: string) => `${line}: ${goal}`,
  hint: (n: number, of: number, min: number, hint: string) =>
    `Chapter ${n} of ${of} · about ${min} min left. ${hint}`,
} as const;

/** R0620 (CAMP-28): "The story so far", on returning after a break and per line in the journal. */
export const RECAP_TEXT = {
  title: 'The story so far',
  spineHead: 'Hazel’s Grove',
  linesHead: 'Other roads',
  questsHead: 'Quests you follow',
  /** The chapter you are in and what it asks. */
  chapterNow: (n: number, title: string, goal: string) => `Chapter ${n}, ${title}: ${goal}`,
  /** The last chapter you finished. */
  lastDone: (n: number, title: string) => `Last finished: Chapter ${n}, ${title}.`,
  chose: (label: string) => `You chose: “${label}”`,
  line: (title: string, n: number, of: number, goal: string) =>
    `${title}, chapter ${n} of ${of}: ${goal}`,
  quest: (title: string, goal: string) => `${title}: ${goal}`,
  ok: 'Got it',
  journal: 'Open journal',
  /** The journal's per-line recap toggle. */
  show: 'The story so far',
  chapterDone: (n: number, title: string, goal: string) => `✓ Chapter ${n}, ${title}: ${goal}`,
} as const;
