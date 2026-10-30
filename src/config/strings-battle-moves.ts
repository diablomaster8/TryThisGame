/**
 * Move names and one-line blurbs (recs FIGHT-16), by move id in `sim/battle/moves.ts`. Kept
 * apart from `strings-battle.ts` because it is long; that file re-exports it. Every move
 * bonks, splashes, tickles or hugs: nobody is ever hurt in earnest.
 */
export const BATTLE_MOVE_TEXT: Record<string, { name: string; blurb: string }> = {
  bonk: { name: 'Bonk', blurb: 'A friendly head-bump. Costs no Puff.' },
  huddle: { name: 'Huddle', blurb: 'Everyone squeezes in close and feels a bit better.' },

  wobble: { name: 'Wobble', blurb: 'A wobbly bump that can leave the foe Dizzy.' },
  'static-hug': { name: 'Static Hug', blurb: 'A crackly cuddle. Your hair stands up.' },
  'zip-zap': { name: 'Zip Zap', blurb: 'A tickly spark that may set the foe Giggly.' },
  'bubble-blow': {
    name: 'Bubble Blow',
    blurb: 'A stream of bubbles that can leave the foe Soggy.',
  },
  'hop-bump': { name: 'Hop Bump', blurb: 'Hop, hop, bump!' },
  'puppy-eyes': { name: 'Puppy Eyes', blurb: 'Big wet eyes. The foe goes Sulky and hits softer.' },
  'bubble-pop': { name: 'Bubble Pop', blurb: 'One big bubble, popped right on the nose.' },
  'gust-pat': { name: 'Gust Pat', blurb: 'A puff of wind from flapping very hard.' },
  'scamper-swipe': { name: 'Scamper Swipe', blurb: 'A quick dash and a pat on the way past.' },
  'stone-nudge': {
    name: 'Stone Nudge',
    blurb: 'A slow, heavy shove. Hard to dodge, easy to miss.',
  },
  'pound-puff': { name: 'Pound Puff', blurb: 'A pillow-soft wallop.' },

  'belly-slide': { name: 'Belly Slide', blurb: 'Whoosh! Goes first, along the ground.' },
  'flipper-slap': { name: 'Flipper Slap', blurb: 'A wet, floppy slap.' },
  'splash-back': { name: 'Splash Back', blurb: 'A splash that may leave the foe Soggy.' },
  'fan-dazzle': { name: 'Fan Dazzle', blurb: 'A swirl of bright feathers. The foe goes Shy-eyed.' },
  copycat: { name: 'Copycat', blurb: 'Does whatever the foe just did. Cheeky.' },
  'dive-hug': { name: 'Dive Hug', blurb: 'Swoops down from high up for a big squeeze.' },
  zoomies: { name: 'Zoomies', blurb: 'Runs in circles until it feels Zoomy.' },
  'ear-flop': { name: 'Ear Flop', blurb: 'Floppy ears to the face. May leave the foe Dizzy.' },
  'snuffle-charge': {
    name: 'Snuffle Charge',
    blurb: 'Nose down, full speed, snorting all the way.',
  },
  'chest-drum': { name: 'Chest Drum', blurb: 'Bom-bom-bom! Feels Pumped.' },
  'bear-hug': { name: 'Bear Hug', blurb: 'A hug so long the foe goes Sticky.' },
  pounce: { name: 'Pounce', blurb: 'Wiggles, waits, then leaps.' },
  'woolly-wall': { name: 'Woolly Wall', blurb: 'Fluffs up so the whole team feels Puffed up.' },
  'pocket-snack': { name: 'Snack Attack', blurb: 'A bump and a quick nibble from a hidden snack.' },
  pong: { name: 'Pong', blurb: 'A funny smell. Every foe goes Shy-eyed.' },

  'doodle-decoy': {
    name: 'Doodle Decoy',
    blurb: 'Draws a copy of itself. The next hit lands on the doodle.',
  },
  lullaby: { name: 'Lullaby', blurb: 'A soft song that makes the foe Drowsy.' },
  'jiggle-jig': {
    name: 'Jiggle Jig',
    blurb: 'A dance the whole team joins. Everyone feels Zoomy.',
  },
  'kazoo-blast': { name: 'Kazoo Blast', blurb: 'A loud kazoo note that rattles every foe.' },

  'halo-wave': { name: 'Halo Wave', blurb: 'A shining wave. Lands hard on Moon foes.' },
  'halo-glide': {
    name: 'Halo Glide',
    blurb: 'A bright glide from above. Lands hard on Moon foes.',
  },
  'sunbeam-dash': { name: 'Sunbeam Dash', blurb: 'A dash quick as light. Goes first.' },
  'radiant-bonk': { name: 'Radiant Bonk', blurb: 'A warm, glowing head-bump.' },
  'warm-glow': { name: 'Warm Glow', blurb: 'A soft light that heals the whole team.' },
  'moonshade-tide': { name: 'Moonshade Tide', blurb: 'A dark, cool wave. Lands hard on Sun foes.' },
  'night-swoop': { name: 'Night Swoop', blurb: 'A silent swoop from the dark.' },
  'shadow-scamper': { name: 'Shadow Scamper', blurb: 'There, then gone, then bump. Goes first.' },
  'moonshade-bonk': { name: 'Moonshade Bonk', blurb: 'A cool, shadowy head-bump.' },
  'gloom-hum': { name: 'Gloom Hum', blurb: 'A low hum that leaves every foe Sulky.' },
  'river-roll': { name: 'River Roll', blurb: 'Rolls along like a pebble in a stream.' },
  'breeze-loop': { name: 'Breeze Loop', blurb: 'A loop-the-loop on a passing breeze.' },
  'meadow-dash': { name: 'Meadow Dash', blurb: 'A run through tall grass, straight into the foe.' },
  'boulder-hug': { name: 'Boulder Hug', blurb: 'A hug like being sat on by a friendly rock.' },
  'steady-smile': { name: 'Steady Smile', blurb: 'A calm smile. The team feels Puffed up.' },

  'eternal-dawn': { name: 'Eternal Dawn', blurb: 'The sky goes gold and every foe blinks.' },
  'eternal-dusk': { name: 'Eternal Dusk', blurb: 'The sky goes violet and every foe shivers.' },
  'eternal-hush': { name: 'Eternal Hush', blurb: 'Everything goes very quiet, then very loud.' },

  'tidal-tumble': { name: 'Tidal Tumble', blurb: 'A wave big enough to tumble in.' },
  'sky-twirl': { name: 'Sky Twirl', blurb: 'A spinning dance high in the air.' },
  'thunder-scoot': { name: 'Thunder Scoot', blurb: 'A crackling scoot. Goes first.' },
  'mighty-mash': { name: 'Mighty Mash', blurb: 'A huge, slow wallop.' },
  'big-bounce': { name: 'Big Bounce', blurb: 'Boing! Lands right on top.' },
  'mega-clank': { name: 'Mega Clank', blurb: 'A clanky, rattly charge.' },
  'giant-hug': { name: 'Giant Hug', blurb: 'An enormous hug. The foe may go Sticky.' },
  'drift-dream': { name: 'Drift Dream', blurb: 'A floaty song that makes the foe Drowsy.' },
  'feather-cloud': { name: 'Feather Cloud', blurb: 'A cloud of down. The team feels Puffed up.' },
  'turbo-trot': { name: 'Turbo Trot', blurb: 'Trot, trot, ZOOM. Goes first.' },

  'belly-flop': { name: 'Belly Flop', blurb: 'All of it, at once, from a great height. Splat.' },
  'pillow-fort': { name: 'Pillow Fort', blurb: 'Builds a fort and hides in it. Feels Puffed up.' },
  noogie: { name: 'Noogie', blurb: 'A knuckly head-rub. The foe may go Giggly.' },
  'nap-attack': { name: 'Nap Attack', blurb: 'A quick nap, mid-bout. Wakes up feeling better.' },
  'polite-shove': { name: 'Polite Shove', blurb: 'After you! No, after YOU. Goes first.' },
  'stare-contest': { name: 'Stare Contest', blurb: 'Does not blink. The foe goes Shy-eyed.' },
  'hug-of-doom': { name: 'Hug of Doom', blurb: 'It is just a hug. The foe may go Sticky.' },
  'dramatic-gasp': {
    name: 'Dramatic Gasp',
    blurb: 'A gasp so loud every foe loses heart a little.',
  },

  raspberry: { name: 'Raspberry', blurb: 'Pbbbt! The foe may go Sulky.' },
  'tickle-storm': {
    name: 'Tickle Storm',
    blurb: 'Tickles from every side. The foe may go Giggly.',
  },
  // Grid-only charged moves (FIGHT-67) and the Keeper's acts (FIGHT-66).
  'mega-belly-flop': {
    name: 'Mega Belly Flop',
    blurb: 'A long wind-up, then a landing everyone nearby feels.',
  },
  'kazoo-symphony': { name: 'Kazoo Symphony', blurb: 'Four tiles of the worst music ever played.' },
  'nap-bomb': { name: 'Nap Bomb', blurb: 'A yawn so big it spreads. Foes may go Drowsy.' },
  'snowball-barrage': {
    name: 'Snowball Barrage',
    blurb: 'Three snowballs, roughly where it meant.',
  },
  'zoomie-stampede': {
    name: 'Zoomie Stampede',
    blurb: 'Four tiles of zoomies in a straight line.',
  },
  'tumble-pile': { name: 'Tumble Pile', blurb: 'Runs, trips and lands on everyone. On purpose.' },
  'sunbeam-hug': { name: 'Sunbeam Hug', blurb: 'A warm, slow hug for every friend nearby.' },
  'moon-hush': { name: 'Moon Hush', blurb: 'A long hush. Foes nearby may go Dizzy.' },
  'keeper-snack': { name: 'Snack toss', blurb: 'A snack from your pocket: heals a quarter.' },
  'keeper-cheer': { name: 'Cheer', blurb: 'Friends beside you get Pumped.' },
  'keeper-whistle': { name: 'Whistle', blurb: 'Two friends within four tiles swap places.' },
};

export function moveName(id: string): string {
  return BATTLE_MOVE_TEXT[id]?.name ?? id;
}
