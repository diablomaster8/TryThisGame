/**
 * Player text for lane B round 9, helper d: kid mode (R0188), raised shelves and the Fly
 * lift (R0191), the Hollow's phone bar (R0193) and the debug piece editor (R0210).
 */
export const HOLLOW_R9D_TEXT = {
  // R0188: kid mode.
  kidOn: '🧸 Kid mode: on',
  kidOff: '🧸 Kid mode: off',
  kidHelp: 'Small floors, no traps, gentle little packs, and the footprints on.',
  kidEdu: '🧸 Kid mode: always on in the Learning Grove',

  // R0191: raised shelves and the Fly lift.
  shelfFind: '⬆ A raised shelf: jump up for the find on top.',
  flyLift: (who: string) => `🪽 ${who} flaps hard and lifts you up onto the shelf!`,

  // R0193: the Hollow's phone bar.
  barMap: '🗺 Map',
  barAcorn: '🌰 Acorn',
  barSack: '🎒 Sack',
  barEngage: '⚔ Engage',
  barMore: '⋯ More',
  barLess: '✕ Less',
  barAria: 'Hollow actions',
  miniAria: 'Floor map. Tap to open the full map.',

  // R0210: the piece editor (debug only, never shown to players).
  pieces: {
    title: 'Piece editor',
    pick: 'Piece',
    brush: 'Brush',
    valid: 'Valid piece',
    copy: 'Copy JSON',
    copied: 'Copied',
    tryIt: 'Use on new floors',
    trying: (id: string) => `New floors favour ${id}`,
    newPiece: 'Blank 8×8',
  },
};
