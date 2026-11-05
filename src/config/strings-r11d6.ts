/** Round 11, helper d6: player-facing text for missing language clips (R0445). */
export const CLIP_TEXT = {
  /** Shown when a tapped word has no native-speaker recording yet. */
  tapNote: 'No recording of this word yet. That chime is a stand-in, not the word.',
  /** Under a word row in the word list while it has no recording. */
  rowHint: 'Chime only for now: no recording yet',
  /** Summary of the folded list of clip ids with no recording. */
  listTitle: 'Clips still to record',
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

/** R0138 (WORLD-72): standing on a photo spot. */
export const PHOTO_SPOT_TEXT = {
  first: '📷 A good spot for a photo. The windmill sits right in the frame.',
  again: '📷 The view is still good from here.',
};

/** R0091 (WORLD-27): what each lost postcard says, by its number in `<region>:postcard:<n>`. */
export const POSTCARD_NOTES: Readonly<Record<string, readonly string[]>> = {
  grove: [
    '✉️ A postcard, soft with rain: "The sea is bigger than we thought. Save us a seat."',
    '✉️ A postcard from the village: "Somebody ate the whole pie. We are not saying who."',
    '✉️ An unsigned postcard: "Slow hands grow the best gardens."',
  ],
};
