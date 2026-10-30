/**
 * Player-facing text for lane C round 6's battle work (see `tuning-battle-r6.ts`).
 */
export const LADDER_TEXT = {
  title: 'Dojo Ladder',
  belts: ['White', 'Yellow', 'Green', 'Brown', 'Black'] as const,
  belt: (n: number) =>
    n <= 0 ? 'No belt yet' : `${['White', 'Yellow', 'Green', 'Brown', 'Black'][n - 1]} belt`,
  bout: (belt: string, step: number, of: number) => `${belt} belt · bout ${step} of ${of}`,
  hat: 'Black Belt',
  climbed: (belt: string) => `${belt} belt! Bow to the mat.`,
  top: 'Black belt. The mat bows back.',
};

/** Fusion burst (FIGHT-95). */
export const FUSION_TEXT = {
  button: 'Fuse!',
  pop: 'FUSION!',
  popOff: 'Pop!',
  help: 'Your partners fuse into one for three turns. Once a bout.',
  on: (who: string) => `Fusion! ${who} are one very wobbly Nubbin now.`,
  off: (who: string) => `${who} pop apart, a bit dizzy and very pleased.`,
};

/** Pass-and-play friendly bouts (FIGHT-96). */
export const FRIENDLY_TEXT = {
  title: 'Friendly bout (pass and play)',
  help: 'Two Keepers, one device. No prizes, just a sticker and bragging rights.',
  codes: 'Paste up to three share codes for Keeper 2 (or leave empty to split the Grove)',
  start: 'Start a friendly',
  none: 'Two Keepers need at least two hatched Nubbins, or a share code.',
  pass: 'Keeper 2, your turn! Keeper 1, no peeking.',
  ready: "I'm Keeper 2: show my moves",
  picking: (who: string) => `Keeper 2 picks for ${who}.`,
  sticker: 'Good game! A sticker for both of you.',
};

/** Story battles (FIGHT-82): the dojo's list of the ones open now. */
export const STORY_BOUT_TEXT = {
  title: 'Story bouts (all optional)',
  names: {
    exhibition: 'Circuit Exhibition with Sparks',
    rumble: 'The Rumble Room',
    fort: 'The snow fort rematch',
    corvin: "Corvin's garden",
    logged: 'Night server finale',
    remembering: "Moss's Remembering",
  } as Record<string, string>,
};

/** Resume mid-battle (FIGHT-64). */
export const RESUME_TEXT = {
  title: 'A bout is still going',
  body: 'You left in the middle of a bout. Pick up where you left off, or call it a draw?',
  resume: 'Resume the bout',
  draw: 'Call it a draw',
  later: 'Later',
};

/** The Battle Book in the Collection (FIGHT-84). */
export const BOOK_TEXT = {
  title: 'Battle Book',
  moves: (have: number, of: number) => `Moves learned: ${have} / ${of}`,
  seen: (have: number, of: number) => `Moves seen: ${have} / ${of}`,
  befriended: (n: number) => `Foes befriended: ${n}`,
  ribbons: (have: number, of: number) => `Circuit ribbons: ${have} / ${of}`,
  belt: (name: string) => `Best Dojo Ladder belt: ${name}`,
  keepsakes: 'Keepsakes',
  noKeepsakes: 'None yet. Calm a big one.',
  unknown: '???',
  unknownBlurb: 'Not seen yet. It is out there, being a move.',
  keepsakeNames: {
    'good-game': 'Good game sticker',
    'guardian-lantern': "The guardian's lantern",
  } as Record<string, string>,
};

/** The trial map pack (FIGHT-97). */
export const TRIAL_TEXT = {
  title: 'Dojo trials',
  menu: 'Trials: twelve puzzle boards',
  help: 'Push boulders into water to make bridges, ring the bells in order, carry the flame. Meet par for a hat.',
  par: (n: number) => `par ${n}`,
  best: (n: number) => `best ${n}`,
  steps: (n: number, par: number) => `Steps ${n} (par ${par})`,
  open: 'gate open',
  shut: 'gate shut',
  atPar: 'At par! A hat for your trouble (the first time).',
  cleared: (n: number) => `Through in ${n}. Par is a little tighter.`,
  undo: 'Undo',
  reset: 'Start again',
  back: 'All trials',
  dir: { n: 'Step north', e: 'Step east', s: 'Step south', w: 'Step west' },
};

/** "Save as postcard" and replay codes (FIGHT-100). */
export const POSTCARD_TEXT = {
  title: 'Greetings from the dojo!',
  save: 'Save as postcard',
  copy: 'Copy replay code',
  bonk: 'Bonk',
  footer: 'Nobody was hurt. Several were very surprised.',
  quiet: 'A very polite bout. Everyone said sorry twice.',
  crit: (by: string, move: string, to: string, n: number) =>
    `${by}'s ${move} on ${to}: a Big one! ${n} at once. ${to} is still blinking.`,
  boing: (who: string, n: number) =>
    `${who} spun round and bonked themself for ${n}. Boing! Nobody saw. Everybody saw.`,
  hit: (by: string, move: string, to: string, n: number) =>
    `${by} gave ${to} a ${move} worth ${n}. It will be talked about.`,
};
