/** Round 11, helper d6: player-facing text for missing language clips (R0445). */
export const CLIP_TEXT = {
  /** Shown when a tapped word has no native-speaker recording yet. */
  tapNote: 'No recording of this word yet. That chime is a stand-in, not the word.',
  /** Under a word row in the word list while it has no recording. */
  rowHint: 'Chime only for now: no recording yet',
  noteEveryMs: 6000,
  noteMs: 3200,
  /** The grown-up area, with a count. */
  grownUpMissing: (missing: number, total: number) =>
    `${missing} of ${total} words have no recording yet. Tapping one plays a chime, never a computer voice.`,
};

/** R0130 (WORLD-64): the World overview in the map. */
export const OVERVIEW_TEXT = {
  tab: 'World',
  title: 'The Grove and beyond',
  help: 'Tap a place you have found to open its map.',
  fogged: 'Not found yet',
  here: 'You are here',
  open: (name: string) => `Open the map of ${name}`,
};
