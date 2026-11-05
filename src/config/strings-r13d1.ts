/**
 * Lane D round 13, helper d1: player-facing text for the drawn regions' new content.
 */

/** WORLD-35: the Kettleby folk on the shore (they say one thing each, and a second after the castles). */
export const SHORE_FOLK_TEXT = {
  tam: {
    name: 'Old Tam',
    line: 'Tide comes in on the hour it likes. I only mend what it breaks.',
  },
  orla: {
    name: 'Orla',
    line: 'Nets, nets, nets. Mind the knots; they remember everything.',
  },
  bett: {
    name: 'Bett',
    line: 'That boat goes out to the Moon side. Only at night, and only if it wants to.',
  },
  skerry: {
    name: 'Skerry',
    line: 'I keep the lamp lit. Nobody asked me to. Nobody has to.',
  },
} as const;

export const SHORE_PLAY_TEXT = {
  castleDown: (shells: number) => `Whump. The castle is a heap of sand. ${shells} shells wash out.`,
  rebuilt: 'Someone has been busy: a castle stands on the beach again.',
} as const;

/** WORLD-34: the Settings option that keeps the old Sun and Moon recolour of the Grove. */
export const GROVE_DRESS_TEXT = {
  label: 'The Grove dresses for you',
  help: 'Your Grove takes on Sun or Moon colours once that side is unlocked. The lands stay real places.',
} as const;

/** WORLD-34: the Nubbin gardens of the Sun and Moon lands. */
export const LANDS_TEXT = {
  garden: (side: 'sun' | 'moon') =>
    side === 'sun'
      ? 'A Sun garden: your Sun adults come here to bask on the white stone.'
      : 'A Moon garden: your Moon adults come here to watch the lantern lake.',
} as const;

/** WORLD-36: the snowball button. */
export const SNOW_TEXT = { button: 'Snowball', glyph: '❄' } as const;

/** WORLD-35 / 69: the shore's island and the village cart. */
export const TRIP_TEXT = {
  island: 'A tiny island of sand, a driftwood bench and one very patient gull.',
} as const;
