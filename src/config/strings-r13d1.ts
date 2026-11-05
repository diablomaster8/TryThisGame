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
