/**
 * Lane A round 10 (SOUL, garden behaviour): rivals and making up (R0538). British
 * spelling, the dry voice of STYLE; the Learning Grove bands say it plainly and gently.
 */

/** R0538: the stats sheet's line under "Recently": the best friend and the rival. */
export const BONDS_SHEET = {
  friend: 'Best friend',
  rival: 'Rival',
  none: 'nobody yet',
} as const;

/** R0538: toasts. {a} and {b} are the two Nubbins' names. */
export const RIVAL_TEXT = {
  made: {
    main: '{a} and {b} have decided they are rivals. Nobody asked them to.',
    reader: '{a} and {b} keep getting cross with each other. They are rivals now.',
    sprout: '😤 {a} and {b} are cross.',
  },
  madeUp: {
    main: '{a} and {b} have made it up. A hug, and the matter is closed.',
    reader: '{a} and {b} made up and had a hug. Friends again!',
    sprout: '🤗 {a} and {b} made up!',
  },
} as const;

/** R0527: the Learning Grove's cottage hiding. {n} is the Nubbin's name. */
export const COTTAGE_HIDE_TEXT = {
  hid: {
    main: '{n} has gone to hide in the cottage. Tap the door, gently.',
    reader: '{n} felt scared and is hiding in the cottage. Tap the door to say sorry.',
    sprout: '🏠👀 {n} is hiding. Tap the door!',
  },
  coaxed: {
    main: '{n} comes out for a hug.',
    reader: '{n} comes out and gives you a big hug. Gentle hands help it feel safe.',
    sprout: '🤗 {n} came out!',
  },
} as const;
