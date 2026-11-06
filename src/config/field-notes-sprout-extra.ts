/**
 * FUN-69 (R0358): the sprout band's short field-note lines (eight words or fewer) for the
 * collection book's other entry kinds: colours, jewels, finishes, hats, looks and critter
 * parts. Hand-written, plain words, a sound or a sight a small child can point at.
 */

/** Egg colours and jewels, keyed by the id after `colour:` or `jewel:`. */
export const SPROUT_COLOURS: Record<string, string> = {
  plain: 'A plain egg. Plain and happy!',
  sky: 'Sky blue. Like a nice day.',
  rose: 'Pink as a petal. Pretty!',
  mint: 'Cool green, like a leaf.',
  gold: 'Gold! It shines like the sun.',
  violet: 'Purple as a plum. Yum?',
  yellow: 'Yellow as a duckling. Cheep!',
  white: 'White as a snowball. Brr!',
  brown: 'Brown as a muddy puddle.',
  grey: 'Grey as a rainy day.',
  black: 'Black as a sleepy night.',
  orange: 'Orange, like a juicy peach.',
  lime: 'Lime green. Sharp and zingy!',
  red: 'Red as a ripe apple.',
  pearl: 'Pearl. Soft, round and shimmery.',
  ruby: 'A red gem. It glints!',
  sapphire: 'A deep blue gem. Ooh!',
  emerald: 'A green gem, like a frog.',
  amethyst: 'A purple gem. Sparkle, sparkle!',
  topaz: 'A sunny gem. Warm and bright.',
  garnet: 'A dark red gem. Cosy!',
  onyx: 'A black gem. Smooth as a pebble.',
  silver: 'A silver gem. Ting, ting!',
  aquamarine: 'A sea-water gem. Splash!',
  peridot: 'A lime gem. Bright and fresh!',
};

/** The `:shiny` and `:twotone:<b>` variants of an egg colour. */
export const SPROUT_SHINY = 'Shiny! It twinkles when it moves.';
export const SPROUT_TWOTONE = 'Two colours at once. Double fun!';

/** Hats and looks whose dry line runs past eight words, keyed by cosmetic id. */
export const SPROUT_WEAR: Record<string, string> = {
  'look-echidna': 'Spiky on the outside. Soft inside.',
  beanie: 'Warm head, happy head.',
  'hop-hat': 'Has a spring. Boing, boing!',
  pot: 'It was a pot. Now a hat!',
  cape: 'Swish! Fly like a hero.',
  remembrance: 'A flower from the hill. For luck.',
  'hollow-hedge': 'A hat made of leaves. Rustle!',
  'hollow-noodle': 'A noodle hat. Slurp! Not for eating.',
  'hollow-hearth': 'A warm little hat. Toasty!',
  'hollow-cape': 'A cape that swishes. Swish, swish!',
  'pillow-crown': 'Soft as a pillow. Pat, pat.',
  'moo-bonnet': 'A bonnet with a moo. Moo!',
  'race-band-meadow': 'A green band for the meadow race.',
  'race-band-cliffs': 'An orange band for the cliff race.',
  'race-band-lagoon': 'A blue band for the lagoon race.',
};

/** Critter parts whose dry line runs past eight words, keyed by critter id. */
export const SPROUT_CRITTER: Record<string, string> = {
  condor: 'A big bird that sees far.',
  tiger: 'Stripes! Grrr, but a friendly grr.',
  swallow: 'Swoops in every spring. Tweet!',
  koala: 'Sleepy, sleepy, sleepy. Zzz.',
};

/** The second evolutions with no first-evolution line to borrow, keyed by book key. */
export const SPROUT_SECONDS: Record<string, string> = {
  'chao:sun:run:normal': 'Fast and friendly, with a gentle side.',
  'chao:sun:run:swim': 'Zooms on land, paddles in puddles.',
  'chao:sun:run:fly': 'Runs, then hops, then flaps. Wheee!',
  'chao:sun:run:power': 'Fast and strong. Wins the tug-of-war.',
  'chao:sun:power:normal': 'Strong, calm and good at hugs.',
  'chao:sun:power:swim': 'Strong enough to make big splashes.',
  'chao:sun:power:fly': 'Lifts a rock, then lifts itself!',
  'chao:sun:power:run': 'Strong and speedy. Whoosh, thump!',
  'chao:moon:swim:normal': 'Quiet in the deep, snug at home.',
  'chao:moon:swim:fly': 'Dives down, then flaps up. Splash!',
  'chao:moon:swim:run': 'Swims fast, runs fast. Drip, drip.',
  'chao:moon:swim:power': 'A strong swimmer. Big, big splash!',
  'chao:moon:run:normal': 'Quick as a shadow, calm as a cat.',
  'chao:moon:run:swim': 'Runs by the pond, then plops in.',
  'chao:moon:run:fly': 'Zips along, then glides off. Shh!',
  'chao:moon:run:power': 'Fast and strong, but very quiet.',
  'chao:neutral:fly:normal': 'Flaps a little, then has a snack.',
  'chao:neutral:fly:swim': 'Flaps over the pond, then dips in.',
  'chao:neutral:fly:run': 'Flaps, lands, runs. Flap, flap, zoom!',
  'chao:neutral:fly:power': 'Flaps with great big, strong wings.',
  'chao:neutral:run:normal': 'Always off somewhere, but comes back.',
  'chao:neutral:run:swim': 'Races to the pond and jumps in.',
  'chao:neutral:run:fly': 'Runs fast, then tries to fly. Whoops!',
  'chao:neutral:run:power': 'Runs fast and pushes big things.',
};
