/**
 * Lane B round 8, "floors": the player-facing words for secret rooms (R0182), light puzzles
 * (R0202), critter-part shortcuts (R0212) and the boss door (R0160). Every line pairs an icon
 * with words, so colour is never the only signal.
 */
export const FLOORS_TEXT = {
  secretWiggle: '≋ The wall wiggles. A little dust trickles down…',
  secretFound: '✧ The wall gives way: a secret room!',
  secretSeen: (name: string) => `✧ ${name} feels a draught in the rock: a secret room!`,
  /** The automap's mark for a found secret. */
  secretMark: '✧',
  plate: '▣ Click! A plate sinks down.',
  torch: '🔥 A torch flares up.',
  reset: {
    plates: '↺ The plates pop back up.',
    torches: '↺ Puff! The torches go out. Look at the mural again.',
    blocks: '↺ The blocks shuffle back to the start. Try again!',
  },
  solved: '✓ Solved! A little chest creaks open.',
  shortcut: (name: string, part: 'swim' | 'fly' | 'power') =>
    ({
      swim: `✓ ${name} dives under with their fins and pulls the lever!`,
      fly: `✓ ${name} flutters up to the high ledge and lights the way!`,
      power: `✓ ${name} gives the heavy blocks a mighty shove!`,
    })[part],
  /** R0212: the icon and words over a part spot. */
  spot: {
    swim: { icon: '≈', words: 'Fins could help here' },
    fly: { icon: '⌃', words: 'Wings could help here' },
    power: { icon: '✊', words: 'Strong arms could help here' },
  },
  /** The torch puzzle's symbols, in torch order; the mural shows them in lighting order. */
  torchSymbols: ['☀', '☾', '★', '❀'],
  muralTitle: 'Light us in this order',
  hint: '▼ This way!',
  bossSealed: '⛔ The great door rumbles shut behind you.',
  bossOpen: '⇧ The great door rolls open again.',
} as const;
