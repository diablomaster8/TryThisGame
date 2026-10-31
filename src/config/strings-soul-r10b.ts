/**
 * Lane A round 10 (SOUL, kindergarten and expression): the fortune teller's readings
 * (R0557) and the doctor's check-up (R0556). British spelling, the dry voice of STYLE.
 */
import type { TraitId } from './tuning-soul-r9';

type Flavour = 'swim' | 'fly' | 'run' | 'power' | 'stamina' | 'sun' | 'moon' | 'plain';
type Toy = 'ball' | 'radio' | 'blocks' | 'mirror' | 'tv';

/** R0557: what a fruit flavour looks like in the crystal ball. */
const FLAVOUR_SIGHT: Record<Flavour, string> = {
  swim: 'the colour of the pond',
  fly: 'the colour of the sky',
  run: 'the colour of a fresh leaf',
  power: 'the colour of a ripe berry',
  stamina: 'the colour of warm sand',
  sun: 'the colour of morning',
  moon: 'the colour of a long night',
  plain: 'no colour at all, just honest fruit',
};

const TOY_SIGHT: Record<Toy, string> = {
  ball: 'something round that runs away when kicked',
  radio: 'a box that hums back',
  blocks: 'a tower, and the joy of knocking it down',
  mirror: 'a friend who copies every face it pulls',
  tv: 'a little window full of pictures',
};

export const FORTUNE_TEXT = {
  /** Two per personality the reading leans to. */
  personality: {
    cheerful: [
      'A bright one. It will say hello to every stone in the Grove.',
      'I see laughter, and most of it at its own jokes.',
    ],
    shy: [
      'A quiet heart. It watches first, and loves after.',
      'I see a tree trunk, and a face peeping round it.',
    ],
    mischievous: [
      'Trouble, the small kind. Count your fruit.',
      'I see a grin, and someone else jumping.',
    ],
    lazy: [
      'A long nap, then another. Wisdom of a sort.',
      'I see a sunny patch of grass, and no hurry at all.',
    ],
  } as Record<string, readonly string[]>,
  /** One per trait. */
  trait: {
    clumsy: 'Many tumbles ahead. Every one ends with getting back up.',
    glutton: 'I see a full belly. Then I see it asking for more.',
    sleepyhead: 'The cards are blurry. So, I suspect, are its eyes.',
    curious: 'Something new will turn up, and it will be there first.',
    brave: 'Rain on its head, and no fuss about it.',
    fussy: 'It knows what it likes. It will wait for it.',
    musical: 'I hear a tune. Not a famous one. A good one.',
    showoff: 'An audience, and a little bow at the end.',
    neat: 'Not a crumb out of place. Not one.',
    nightOwl: 'Stars, and a pair of wide eyes counting them.',
    earlyBird: 'The first one up, every dawn. Sorry about that.',
    copycat: 'It will be whatever its friends are. Choose them well.',
    ticklish: 'One feather and it falls over giggling. The cards agree.',
    sneezy: 'Flowers ahead. Bless it in advance.',
  } as Record<TraitId, string>,
  /** Two per alignment band it is heading toward. */
  band: {
    sun: ['The light finds it easily. Keep it that way.', 'A warm road, and the sun on it.'],
    moon: ['Shadows suit it. Shadows are not the same as cold.', 'A cool road under a big moon.'],
    neutral: [
      'It has not picked a side. Neither has the weather.',
      'Grey is not the end of colour. Ask the lanterns.',
    ],
  } as Record<string, readonly string[]>,
  /** The one undiscovered like each visit reveals. */
  revealYum: (f: Flavour): string => `I see... something sweet, and ${FLAVOUR_SIGHT[f]}.`,
  revealToy: (t: Toy): string => `I see ${TOY_SIGHT[t]}. Its favourite thing.`,
  revealBleh: (f: Flavour): string =>
    `And a fruit ${FLAVOUR_SIGHT[f]}, pushed politely to one side.`,
  /** Nothing left to reveal. */
  allKnown: 'You already know what it loves. The cards are impressed.',
  revealed: (name: string): string => `You learned something new about ${name}.`,
} as const;

/** R0556: the doctor's check-up. Sprout lines stay short; the doctor is kind and silly. */
export const DOCTOR_TEXT = {
  steps: [
    { icon: '🩺', say: 'Thump-thump. Strong little heart.' },
    { icon: '👅', say: 'Say "aah"... lovely tongue.' },
    { icon: '🔨', say: 'Tap on the knee... kick!' },
  ],
  title: (name: string): string => `${name}'s check-up`,
  bars: {
    happiness: { icon: '😊', label: 'Happy' },
    affection: { icon: '💗', label: 'Loves you' },
    hunger: { icon: '🍎', label: 'Full tummy' },
    energy: { icon: '⚡', label: 'Energy' },
    trust: { icon: '🤝', label: 'Trust' },
    lean: { icon: '☀️', label: 'Sun or Moon', moon: '🌙' },
  },
  showNumbers: 'Show numbers',
  hideNumbers: 'Hide numbers',
  notes: {
    noHug: (n: string): string => `${n} loves company, but hasn't had a cuddle in a while.`,
    hungry: (n: string): string => `${n}'s tummy is rumbling. I could hear it without this.`,
    tired: (n: string): string => `${n} is yawning at me. Rude, but fair. Time for a nap.`,
    sad: (n: string): string => `${n} is a bit low. Some play and a pat would help.`,
    wary: (n: string): string => `${n} is still unsure of you. Gentle hands, and time.`,
    lonely: (n: string): string => `${n} has no best friend yet. Maybe introduce someone?`,
    buddy: (n: string, f: string): string => `${n} and ${f} are thick as thieves.`,
    glad: (n: string): string =>
      `${n} is as happy as I've seen anyone. Whatever you're doing, keep at it.`,
    lean: (n: string, part: string): string => `${part} Nothing to worry about with ${n}.`,
    sunward: (n: string): string => `${n} has a sunny outlook. Literally.`,
    moonward: (n: string): string => `${n} likes the shade. That's healthy too.`,
    fine: (n: string): string => `${n} is fit as a fiddle. Off you go.`,
    favMystery: (n: string): string => `${n}'s favourite fruit is still a mystery to you.`,
    toyMystery: (n: string): string => `${n} has a favourite toy. You haven't spotted which yet.`,
    blehMystery: (n: string): string => `There's one fruit ${n} doesn't care for. Watch its face.`,
    likesKnown: (n: string): string => `You know ${n}'s favourites. Top marks, Keeper.`,
  },
  /** What a strong type lean shows in. */
  leanPart: {
    swim: 'Those fins were made for the pond.',
    fly: 'Strong little wings on this one.',
    run: 'Legs like springs.',
    power: 'Arms like little hammers.',
    normal: 'A good all-rounder.',
  } as Record<string, string>,
} as const;
