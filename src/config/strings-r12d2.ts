import { POSTCARD_NOTES } from './strings-r11d6';
import { BEACON_LANDMARKS } from './region-extras-r11d6';
import type { RegionId } from './regions';

type BeaconKey = Exclude<RegionId, 'little-grove'>;

/**
 * Round 12, helper d2: player-facing words for the open world's content (British spelling,
 * short lines). Kept apart from `strings.ts` so the helper branches merge cleanly.
 */

/** R0138 (WORLD-72): a photo frame, and the button that takes the picture. */
export const PHOTO_FRAME_TEXT = {
  button: 'Take photo',
  buttonLabel: 'Take a photo of this view',
  /** The first time standing in a region's frame; the beacon is what the frame looks at. */
  first: (region: string): string => {
    const b = BEACON_LANDMARKS[region as BeaconKey];
    return `📷 A good spot for a photo. ${cap(b ? b.name : 'the view')} sits right in the frame.`;
  },
  again: '📷 The view is still good from here.',
  /** The title on the saved picture. */
  title: (region: string): string => {
    const b = BEACON_LANDMARKS[region as BeaconKey];
    return b ? `A view of ${b.name}` : 'A view';
  },
  note: 'Vista',
};

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** R0091 (WORLD-27): the lost postcards of the other drawn regions, by their number in the set. */
const MORE_POSTCARDS: Readonly<Record<string, readonly string[]>> = {
  wood: [
    '✉️ A postcard, folded small: "The oak kept the rain off us. We kept it company."',
    '✉️ A postcard in a hollow stump: "Gone to count mushrooms. Back by tea. Possibly."',
    '✉️ A damp postcard: "The mill wheel says hello. Loudly. Constantly."',
  ],
  shore: [
    '✉️ A salty postcard: "Wish you were here. The crabs agree."',
    '✉️ A postcard pinned under a shell: "The lighthouse winks every night. We wink back."',
    '✉️ A postcard with a footprint on it: "Sand in everything. Worth it."',
  ],
  ruins: [
    '✉️ A postcard, brittle with age: "The columns are taller than the stories. Both are true."',
    '✉️ A postcard tucked in a crack: "Whoever lit these lanterns, thank you."',
    '✉️ A postcard, folded twice: "Walk gently here. The stones remember."',
  ],
  ridge: [
    '✉️ A postcard, stiff with frost: "Up here the air is thin and the tea is thinner."',
    '✉️ A postcard from the hut: "Left kindling. Left a biscuit. Take both."',
    '✉️ A postcard in a tin: "From the top you can see the Grove. It looks small, and cared for."',
  ],
  sunlands: [
    '✉️ A bright postcard: "It is noon here. It is always noon. We have stopped checking."',
    '✉️ A postcard smelling of marigolds: "Made a wish at the fountain. Spent it on a nap."',
    '✉️ A postcard, a little sunburnt: "Wear a hat. Several, if possible."',
  ],
  moonlands: [
    '✉️ A silvery postcard: "The lake holds the stars so you do not have to."',
    '✉️ A postcard soft as moth wings: "Fireflies spelled your name. Then got shy."',
    '✉️ A postcard in the moss: "Night is not the dark. It is the quiet. Come and sit."',
  ],
};

export const POSTCARD_NOTES_ALL: Readonly<Record<string, readonly string[]>> = {
  ...POSTCARD_NOTES,
  ...MORE_POSTCARDS,
};

/** The postcard album page in a region's map tab. */
export const POSTCARD_ALBUM_TEXT = {
  summary: (got: number, of: number): string => `✉️ Postcards ${got}/${of}`,
  unfound: '? Not found yet',
  empty: 'No postcards home yet. They lie about on open ground.',
};

/** R0120 (WORLD-53): the shy wild Nubbin of a region. */
export const WILD_NUBBIN_TEXT = {
  met: (name: string): string => `🐾 ${name} watches you from a safe distance. A fruit might help.`,
  friend: (name: string): string =>
    `🍎 ${name} takes the fruit, and then your hand. It moves into the village.`,
};
