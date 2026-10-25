/**
 * Player-facing text for the dialogue box's Skip control, the objective chip and the
 * Learning Grove's story prompt (review fixes 2026-10-25). Kept beside strings.ts so the
 * fix branches do not all edit the same block.
 */
export const DIALOGUE_TEXT = {
  skip: 'Skip',
  skipLabel: 'Skip to the next choice or the end of the scene (Esc)',
};

export const OBJECTIVE_TEXT = {
  label: 'Next',
  open: 'Open the Journal for the full goal',
  newGoal: (goal: string) => `New goal: ${goal}`,
  done: 'Goal done ✓ The story will carry on soon.',
  /** Free Grove and other unguided moments. */
  noNubbins: 'Your Grove has no Nubbins yet',
  noNubbinsHint: 'Buy an egg in the Shop 🛒',
  hatch: 'Hatch an egg',
  hatchHint: 'Pick it up and shake it, or wait for it to wobble open',
  hungry: (name: string) => `${name} is hungry`,
  hungryHint: 'Shake a fruit tree, then give the fruit',
};

export const EDU_PROMPT_TEXT = {
  title: 'What shall we do?',
  story: 'Hear the story',
  play: 'Play',
  look: 'Just look around',
  /** Read aloud in the sprout band. */
  say: 'Shall we hear the story, or play a game?',
};
