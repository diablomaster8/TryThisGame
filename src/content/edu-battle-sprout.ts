/**
 * The Learning Grove, sprout band (ages 3–6, read aloud): Play-fight Day (recs FIGHT-83).
 *
 * Source: the three Play-fight Day scenes in battles-circuit.ts (`bc-playday-open`, `-bout`,
 * `-hug`), id `sprout:<original id>`. See EDU-STYLE.md.
 *
 * - "Who is bigger?": seven hearts against five, as groups the child can see (K.CC.C.6).
 * - Taking turns on the turn strip (CASEL: Relationship skills), and a rhyme on "hug" (RF.K.2).
 * - Every bout ends with a hug and a sharing line. Nobody is hurt; a tired Nubbin naps.
 * - Nubbins never speak. No quotes from any original; every line is new.
 */
import type { EduScene, Lesson } from './types';
import type { Line } from '../config/story';

type Mood = Line['mood'];
const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };
const gag = (l: Line): Line => ({ ...l, gag: true });

const N = say('narrator');
const FERN = say('fern');
const CLOVER = say('clover');

type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];
const opt = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

const sc = (of: string, lines: Line[], beats: Beat[]): EduScene => ({
  id: `sprout:${of}`,
  of,
  band: 'sprout',
  lines,
  lessons: beats.map((b, i) => ({ id: `sprout:${of}-l${i + 1}`, ...b })),
});

export const EDU_BATTLE_SPROUT_VARIANTS: EduScene[] = [
  sc(
    'bc-playday-open',
    [
      N('It’s Play-fight Day on the green! Hooray!'),
      FERN('Nobody gets hurt. Nobody gets cross.', 'happy'),
      FERN('A tired Nubbin has a nap. That’s the rule!'),
      gag(N('Clover’s Nubbin sneezes. Achoo! A leaf lands on its head.')),
      N('Look! Little hearts float over each Nubbin.'),
      N('Your Nubbin has 7 hearts. Clover’s Nubbin has 5 hearts.'),
      CLOVER('Which number is bigger, 7 or 5?', 'think'),
    ],
    [
      {
        domain: 'maths',
        skill: 'compare two numbers: 7 is more than 5',
        standard: 'K.CC.C.6',
        kind: 'ask',
        after: 6,
        prompt: [N('(Count the hearts together: 7 here, 5 there.)'), N('Who has more hearts?')],
        options: [
          opt(
            'Your Nubbin, with 7',
            [CLOVER('Yes! 7 is more than 5. Yours has 2 more hearts.', 'happy')],
            true,
          ),
          opt('Clover’s Nubbin, with 5', [
            N('Five hearts, bobbing like balloons! So pretty.'),
            N('Now count yours: 1, 2, 3, 4, 5, 6, 7.'),
            N('Seven is more than five.'),
          ]),
          opt('They have the same', [
            N('The same, like two peas in a pod? Let’s look again.'),
            N('7 hearts and 5 hearts. 7 is bigger. Yours has more!'),
          ]),
        ],
        parentNote: 'Compared two groups of hearts and found that 7 is more than 5.',
      },
    ],
  ),
  sc(
    'bc-playday-bout',
    [
      N('Look at the top. Little faces wait in a line.'),
      CLOVER('That line shows whose turn is next.', 'soft'),
      N('Clap, clap! Your turn. Clap, clap! My turn.'),
      N('Your Nubbin is a Swim one. Clover’s is a Fly one.'),
      FERN('Swim soaks Fly! Splash!', 'happy'),
      gag(N('Splish! Clover’s Nubbin lands with a soggy bump. It looks at its wet feet.')),
      N('It yawns. It has a nap under a leaf. Shh!'),
    ],
    [
      {
        domain: 'sel',
        skill: 'take turns and wait for your go',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 2,
        prompt: [
          N('Clover’s Nubbin wants to go now. But it’s your turn.'),
          N('What should it do?'),
        ],
        options: [
          opt(
            'Wait for its turn',
            [CLOVER('Yes. It waits. Then it gets its go. Fair for everyone!', 'happy')],
            true,
          ),
          opt('Push in', [
            N('Push in? Bump, wobble, everyone falls over in a heap!'),
            N('Waiting is fairer. Then everyone gets a go.'),
          ]),
          opt('Go off in a huff', [
            N('A huffy Nubbin, stomping off with its nose in the air! Silly.'),
            N('If it waits a little, its turn comes next.'),
          ]),
        ],
        parentNote: 'Talked about waiting for your turn, and why that is fair.',
      },
    ],
  ),
  sc(
    'bc-playday-hug',
    [
      N('The bout is over. The two Nubbins run to the middle.'),
      N('Squeeze! A big Nubbin hug.'),
      CLOVER('Every bout ends with a hug. Every single one.', 'happy'),
      N('Your Nubbin has one plum. Crack! It breaks it in two.'),
      N('It gives half to Clover’s Nubbin. That’s sharing.'),
      gag(FERN('Then a nap. Then another snack. Best day ever.', 'happy')),
      N('Munch, munch. Two happy Nubbins.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'hear words that rhyme with “hug”',
        standard: 'RF.K.2',
        kind: 'ask',
        after: 2,
        prompt: [N('Hug. Say it slowly: h-ug.'), N('Which word rhymes with hug?')],
        options: [
          opt('Bug', [N('Hug, bug! A hug for a bug! They rhyme.', 'happy')], true),
          opt('Plum', [
            N('A plum giving a hug? Squish! That’s funny.'),
            N('Plum ends with “um”. Hug and bug both end with “ug”.'),
          ]),
          opt('Nap', [
            N('A nap-hug, all snuggly! Lovely.'),
            N('Nap ends with “ap”. Hug rhymes with bug: “ug”, “ug”.'),
          ]),
        ],
        parentNote: 'Listened for a word that rhymes with “hug”.',
      },
    ],
  ),
];

export const EDU_BATTLE_SPROUT_CHECKS: string[] = [];
export const EDU_BATTLE_SPROUT_FLAGS: string[] = [];
