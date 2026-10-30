/** Player-facing names for the look lane: cosmetics (`cosmetics.ts`). */
import type { Personality } from '../sim/types';

/** Cosmetic names by registry id. The eggshell's name comes from `eggshellLabel`. */
export const COSMETIC_LABELS: Record<string, string> = {
  'look-quills': 'Quills look',
  'look-shade': 'Shade look',
  pot: 'Flower pot',
  box: 'Cardboard box',
  pumpkin: 'Pumpkin',
  bow: 'Hair bow',
  bell: 'Bell collar',
  cape: 'Cape',
  backpack: 'Backpack',
  'flower-crown': 'Flower crown',
  party: 'Party hat',
  'top-hat': 'Top hat',
  chef: "Chef's hat",
  beret: 'Beret',
  'swim-ring': 'Swim ring',
  'leaf-umbrella': 'Leaf umbrella',
  sunhat: 'Straw sunhat',
  nightcap: 'Nightcap',
  'halo-band': 'Halo headband',
  horns: 'Devil horns',
};

/** "Eggshell (sky)": the hatchling's first hat, named for its egg. */
export const eggshellLabel = (colour: string): string => `Eggshell (${colour})`;

/** The shop's hat row note: what the hat of the day is. */
export const shopHatNote = (label: string): string => `Today: ${label}`;

/** The critters added in R0402 (wild, then the Hollow's two rare ones). */
export const MORE_CRITTER_LABELS: Record<string, string> = {
  bonefish: 'Bonefish',
  turtle: 'Turtle',
  swallow: 'Swallow',
  bat: 'Bat',
  deer: 'Deer',
  monkey: 'Monkey',
  unicorn: 'Unicorn',
  wolf: 'Wolf',
  koala: 'Koala',
  phoenix: 'Phoenix',
  dragon: 'Dragon',
};

/**
 * FUN-09 (R0298): one toast per pet action and personality, in place of the old "liked that"
 * line. `any` is the child's (no personality yet). `{n}` is the Nubbin's name.
 */
export const PET_TOASTS: Record<string, Record<'any' | Personality, string>> = {
  tickle: {
    any: '{n} squirms and giggles.',
    cheerful: '{n} giggles so hard the crown wobbles.',
    shy: '{n} curls up, giggling into both hands.',
    mischievous: '{n} giggles, then tries to tickle you back.',
    lazy: '{n} lets out one slow, sleepy giggle.',
  },
  hiccup: {
    any: '{n} giggles so hard it turns into hiccups.',
    cheerful: '{n} laughs straight into a fit of hiccups. Hic!',
    shy: '{n} hiccups, and looks very embarrassed about it.',
    mischievous: '{n} hiccups, then pretends it was you.',
    lazy: '{n} hiccups three times without opening an eye.',
  },
  hug: {
    any: '{n} squishes into the hug.',
    cheerful: '{n} squeezes back with both stubby arms.',
    shy: '{n} goes still, then leans in.',
    mischievous: '{n} hugs back and steals a crumb from your pocket.',
    lazy: '{n} melts into the hug like warm dough.',
  },
  groom: {
    any: '{n} fluffs up, very pleased.',
    cheerful: '{n} puffs up round and shows off the shine.',
    shy: '{n} fluffs up and peeks at you sideways.',
    mischievous: '{n} shakes off the brushing all over you.',
    lazy: '{n} fluffs up and nearly falls asleep mid-brush.',
  },
  praise: {
    any: '{n} stands up a little taller.',
    cheerful: '{n} puffs out a proud chest. The crown shines.',
    shy: '{n} goes pink and looks at the grass.',
    mischievous: '{n} bows to an imaginary crowd.',
    lazy: '{n} accepts the praise from a lying-down position.',
  },
  highFive: {
    any: '{n} slaps your palm with a tiny paw.',
    cheerful: '{n} high-fives you with a delighted slap.',
    shy: '{n} misses, bonks its own head and stares at its paw.',
    mischievous: '{n} pulls the paw away at the last second. Too slow!',
    lazy: '{n} lifts one paw and lets you do the rest.',
  },
  tuckIn: {
    any: '{n} snuggles down for a nap.',
    cheerful: '{n} yawns a big happy yawn and settles down.',
    shy: '{n} burrows in until only the crown shows.',
    mischievous: '{n} pretends to sleep, one eye open.',
    lazy: '{n} was halfway asleep already.',
  },
  wideAwake: {
    any: '{n} sits bolt upright, eyes wide. Not sleepy at all.',
    cheerful: '{n} bounces back up. Nap? Never heard of it.',
    shy: '{n} sits up straight and blinks at you.',
    mischievous: '{n} pops right back up, grinning.',
    lazy: '{n} is not tired. Shockingly.',
  },
};

/** The toast for a pet action (FUN-09), by the beat it played and the Nubbin's personality. */
export function petToast(name: string, beat: string, personality: Personality | null): string {
  const set = PET_TOASTS[beat];
  if (!set) return `${name} liked that.`;
  return set[personality ?? 'any'].replace('{n}', name);
}

/** LOOK-55: the collection book's tabs and page details. */
export const BOOK_TEXT = {
  tabs: {
    forms: 'Forms',
    pocket: 'Pocket',
    digital: 'Digital',
    colours: 'Colours',
    looks: 'Looks',
    parts: 'Parts',
    hats: 'Hats',
  } as Record<string, string>,
  tabCount: (label: string, seen: number, total: number, done: boolean) =>
    `${label} ${seen}/${total}${done ? ' ★' : ''}`,
  firstSeen: (when: string) => `First seen ${when} ago`,
  earnedBy: (name: string) => `Shown by ${name}`,
  tabDone: 'Tab complete: a golden photo frame is yours.',
  shiny: 'shiny',
  twoTone: (b: string) => `two-tone ${b}`,
  part: (critter: string, slot: string) => `${critter} ${slot}`,
  second: (first: string, second: string) => `${first} → ${second}`,
};

/**
 * FUN-28 (R0317): one dry line per shop item, critter, essence and wearable, shown under the
 * functional help in small italics. Keys are the ids; a test checks every id has one.
 */
export const FLAVOUR = {
  shop: {
    fruit: 'Grown locally. Very locally. That tree.',
    egg: 'Contents may vary. Contents will wriggle.',
    hat: 'Nobody needs a hat. Everybody wants one.',
    toy: 'Round, bouncy and mostly lost in the pond.',
    heartFruit: 'Not for snacking. Do try to explain that.',
    twine: 'For partners. Not for parcels.',
  } as Record<string, string>,
  critter: {
    penguin: 'Formal at all times.',
    seal: 'Claps for anything, including itself.',
    otter: 'Holds hands in its sleep. Holds grudges never.',
    peacock: 'Mostly tail, partly attitude.',
    parrot: 'Repeats things. Repeats things.',
    condor: 'Has seen the whole valley and was not impressed.',
    cheetah: 'Arrives before you have finished saying its name.',
    rabbit: 'Always in a hurry, never late for anything.',
    boar: 'Opinionated about roots.',
    gorilla: 'Gentle, enormous and slightly embarrassed about both.',
    bear: 'Sleeps through winter and most of the spring.',
    tiger: 'Stripes on the outside. Stripes on the inside, probably.',
    sheep: 'Mostly wool. The rest is worry.',
    raccoon: 'Has been through your bins. Found them lacking.',
    skunk: 'Surprisingly popular, from a distance.',
    bonefish: 'More bones than fish, and proud of it.',
    turtle: 'Takes its house everywhere, just in case.',
    swallow: 'Comes back every spring to complain about the weather.',
    bat: 'Upside down by choice.',
    deer: 'Startled by its own hooves.',
    monkey: 'Here for the fruit. Staying for the fruit.',
    unicorn: 'Refuses to discuss the horn.',
    wolf: 'Howls at the moon, then apologises to it.',
    koala: 'Awake for nine minutes a day. This was one of them.',
    phoenix: 'Has done this before. Several times.',
    dragon: 'Small, warm and certain it is very large.',
  } as Record<string, string>,
  essence: {
    swim: 'Smells faintly of puddles.',
    fly: 'Lighter than it looks. Heavier than it thinks.',
    run: 'Fidgets in the pocket.',
    power: 'Warm to the touch. Do not ask why.',
    normal: 'Tastes of Tuesday.',
  } as Record<string, string>,
  wear: {
    straw: 'Keeps the sun off and the bees interested.',
    crown: 'Royalty is a state of mind.',
    beanie: 'For heads that run cold and opinions that run warm.',
    flower: 'Picked fresh. The bush has not forgiven you.',
    bucket: 'Holds rain. Holds dignity, briefly.',
    'look-fox': 'Twice the tails. Half the patience.',
    'look-echidna': 'Spiky on the outside. Also spiky on the inside.',
    'look-rose': 'Comes with a hammer, metaphorically.',
    'look-dream': 'Wakes up smiling. Nobody knows why.',
    'look-quills': 'Was here first. Will mention it.',
    'look-shade': 'Dark, brooding and asleep by eight.',
    'hop-hat': 'There is a spring on it. You will hear about it.',
    pot: 'Was a pot. Is a hat. Will be a pot again.',
    box: 'It fits, so it sits.',
    pumpkin: 'Seasonal. Unseasonably proud.',
    bow: 'A present that walks about.',
    bell: 'Announces arrivals. Also departures. Also standing still.',
    cape: 'Adds speed. Not actually. It feels like it does.',
    backpack: 'Packed with snacks and one important pebble.',
    'flower-crown': 'Meadow royalty, crowned by itself.',
    party: 'Every day is somebody’s birthday, somewhere.',
    'top-hat': 'Lends gravity. Lends it back eventually.',
    chef: 'Has never cooked. Has strong views on soup.',
    beret: 'Painted one fence. Now an artist.',
    'swim-ring': 'Floats. Wearer may or may not.',
    'leaf-umbrella': 'Waterproof for about four minutes.',
    sunhat: 'Wide enough to share. Will not share.',
    nightcap: 'Ready for bed since breakfast.',
    'halo-band': 'Pure as anything. Mind the mud.',
    horns: 'Purely decorative. Mostly.',
  } as Record<string, string>,
};

/**
 * FUN-69 (R0358): Hazel's field notes for the collection book, one or two dry sentences per
 * entry, in her notebook's voice. The Grove line first: the child, each band and type (a
 * second evolution shows its first form's note), the Eternals. Other lines to follow.
 */
export const FIELD_NOTES: Record<string, string> = {
  'chao:egg': 'Warm, round and listening. Hums if you hum first.',
  'chao:child': 'Likes: puddles. Dislikes: being called a puddle.',
  'chao:neutral:swim': 'Will not come out of the pond. Has been asked nicely, twice.',
  'chao:neutral:fly': 'Flaps before it walks, and lands before it means to.',
  'chao:neutral:run': 'Always somewhere else by the time you look up.',
  'chao:neutral:power': 'Carried the watering can to me. Then the shed.',
  'chao:neutral:normal': 'Content. Suspiciously content. I keep checking.',
  'chao:sun:swim': 'Swims in circles to make the water shine. It works.',
  'chao:sun:fly': 'Waves at clouds. Some of them wave back, I am almost sure.',
  'chao:sun:run': 'Runs to greet you, then runs a lap of honour for having greeted you.',
  'chao:sun:power': 'Lifts the heavy things and asks for a hug as payment.',
  'chao:sun:normal': 'Glows a little when praised. Glows a lot when praised twice.',
  'chao:moon:swim': 'Prefers the deep end, and the dark, and being left a biscuit.',
  'chao:moon:fly': 'Hangs from the apple tree at dusk. Not a bat. Do not say bat.',
  'chao:moon:run': 'Fast, quiet and back before you noticed it had gone.',
  'chao:moon:power': 'Moved the big stone by the gate. Will not say why.',
  'chao:moon:normal': 'Sulks with great style. Forgives with less.',
  'chao:eternal:sun': 'Older than the oak. Behaves younger than the bees.',
  'chao:eternal:moon': 'Remembers every winter. Is kind about most of them.',
  'chao:eternal:neutral': 'Sits in the middle of everything and seems pleased about it.',
};

/** The field note for a book key: its own, or the first form's for a second evolution. */
export function fieldNote(key: string): string {
  if (FIELD_NOTES[key]) return FIELD_NOTES[key];
  const p = key.split(':');
  if (p[0] === 'chao' && p.length > 3) return FIELD_NOTES[p.slice(0, 3).join(':')] ?? '';
  return '';
}

/** FUN-39 (R0328): photo-mode comedy. `{n}` is the subject's name, `{b}` the photobomber's. */
export const PHOTO_TEXT = {
  keepAnyway: 'Keep it anyway',
  retake: 'Try again',
  blinkHelp: 'They blinked. Of course they blinked.',
  bomb: '{n}, and {b}, who was not invited',
  blink: '{n}, eyes very briefly closed',
  asleep: '{n}, asleep and unbothered',
  eating: '{n}, mid-bite',
  hungry: '{n}, thinking about fruit',
  sad: '{n}, having a quiet moment',
  happy: '{n}, refusing to stop smiling',
  old: '{n}, older than this photo',
  egg: '{n}, not yet available for comment',
  idle: [
    '{n}, mid-sneeze',
    '{n}, refusing to look at the camera',
    '{n}, pretending this was planned',
    '{n}, on best behaviour, briefly',
    '{n}, who has seen a bird',
  ],
};

/**
 * FUN-43 (R0332): what a found curiosity says, once, and the book's count. Nubbins never
 * speak here; Sparks's two words are hers.
 */
export const CURIOSITY_TEXT: Record<string, string> = {
  liftAndPush: 'Somewhere, a gate creaks open. It sounds pleased with itself.',
  gerald: 'Gerald lifts things very slightly better. Gerald grunts about it.',
  mossName: 'Somewhere in the Grove, Moss raises one eyebrow. Just the one.',
  cup: 'The cup rights itself. It was only waiting for someone to bother.',
  lantern: 'A puff of cold from the fourth lantern. Sparks: "Told you."',
  dizzyCam: 'Round and round. A Nubbin sits down very suddenly.',
  moonFace: 'The moon has a face tonight, for exactly one minute. It winks.',
  squirrel: 'A squirrel throws a fruit back at you. Fair.',
  fernBlush: 'Fern’s stone goes faintly pink. Stones can be shy.',
  robotDance: 'The little robot does the robot. Of course it does.',
  stopwatch: 'Byte’s twelfth stopwatch. Nobody knows where the other eleven went.',
  scarf: 'Clover’s scarf is now longer than Clover.',
  fruitRoll: 'Five fruit in ten seconds. Walking is off the table. Rolling is on.',
  backToBack: 'Sun and Moon, back to back. Somebody should paint this.',
  eggUpside: 'The egg is upside down. The egg disapproves.',
};
export const CURIOSITY_UI = {
  found: (n: number, of: number) => `Curiosities found: ${n} of ${of}`,
};
