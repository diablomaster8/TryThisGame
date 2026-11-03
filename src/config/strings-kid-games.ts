/**
 * R0688 / R0689 / R0690: the Learning Grove's kid-safe versions of the Races, the Expedition
 * and the Hollow: Fun Run, Shell Dash and the Glow Cave. Said aloud as written; short words.
 */
export const FUN_RUN_TEXT = {
  title: 'Fun Run',
  pick: 'Pick a runner',
  start: 'Run!',
  count: ['3', '2', '1', 'Go!'],
  countSay: '3, 2, 1, go!',
  cheer: '📣',
  cheerAria: 'Cheer',
  cheerSay: 'Go, go!',
  ribbon: 'Everyone gets a ribbon!',
  ribbonName: 'Fun Run ribbon',
  done: 'You did it!',
  back: 'Back to the Grove',
  tip: (name: string, stat: string, where: string) =>
    `${stat} more will make ${name} faster ${where}.`,
  tipWhere: {
    swim: 'in water',
    fly: 'over gaps',
    run: 'on the ground',
    power: 'up hills',
    stamina: 'for longer',
  },
  tipStat: {
    swim: 'Swimming',
    fly: 'Flying',
    run: 'Running',
    power: 'Climbing',
    stamina: 'Resting and eating',
  },
  tipNone: (name: string) => `${name} loves to run!`,
} as const;

export const SHELL_DASH_TEXT = {
  title: 'Shell Dash',
  tip: 'Tap to jump!',
  tipKeys: 'Tap or press space to jump!',
  /** What the child hears at 5, 10, 15 (`n` shells). */
  call: (n: number) => `${n}!`,
  bump: 'Boing!',
  critterHome: 'You helped a critter home!',
  resultShells: (n: number) => `🐚 ${n}`,
  resultStar: (n: number) => `⭐ ${n}`,
  back: 'Back to the Grove',
} as const;

export const GLOW_CAVE_TEXT = {
  title: 'Glow Cave',
  intro: "Let's find the glow gems!",
  floor: (n: number) => `Floor ${n}`,
  gemsPrompt: 'Tap the 4 red gems!',
  gemsDone: 'You found them all!',
  shapePrompt: (shape: string) => `Match the ${shape} on the door!`,
  shapeDone: 'The door opens!',
  glowbug: 'A shy glowbug follows you. It wants a fruit!',
  glowbugFed: 'The glowbug is happy!',
  chest: 'A treasure chest!',
  sticker: 'You found a cave sticker!',
  stickerName: 'Cave sticker',
  help: 'Tap the glowing things. Nothing here can hurt you.',
} as const;
