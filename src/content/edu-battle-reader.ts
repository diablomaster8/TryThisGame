/**
 * The Learning Grove, reader band (ages 7–10): Play-fight Day (recs FIGHT-83).
 *
 * Source: the three Play-fight Day scenes in battles-circuit.ts (`bc-playday-open`, `-bout`,
 * `-hug`), id `reader:<original id>`. See EDU-STYLE.md.
 *
 * - "Take turns": the turn strip as a repeating pattern with a rule (4.OA.C.5).
 * - The type wheel as cause and effect: pick the move that solves the problem (3-5-ETS1-2).
 *   Swim soaks Fly, Fly goes over Run, Run is too quick for Power, Power makes a bigger wave than
 *   Swim (sim/battle/types-chart.ts); Normal sits outside the loop.
 * - A think question on sharing, with no best answer (CASEL: Relationship skills).
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
  id: `reader:${of}`,
  of,
  band: 'reader',
  lines,
  lessons: beats.map((b, i) => ({ id: `reader:${of}-l${i + 1}`, ...b })),
});

export const EDU_BATTLE_READER_VARIANTS: EduScene[] = [
  sc(
    'bc-playday-open',
    [
      N('Fern has painted a sign on the green: PLAY-FIGHT DAY. BRING A NUBBIN. BRING A SNACK.'),
      FERN('Nobody gets hurt. Nobody gets cross. A tired Nubbin has a nap. That’s the whole rulebook.', 'happy'),
      gag(CLOVER('I wrote it. It’s one page. Byte wanted a second page. We said no.')),
      N('Everybody borrows a practice Nubbin today. Yours is a Swim type. Clover’s is a Fly type.'),
      N('Hearts float over each one: seven over yours, five over Clover’s. When the hearts run out, it’s nap time.'),
      N('Along the top runs the turn strip, a row of tiny faces showing who goes next.'),
      CLOVER('My flyer is quick, so it gets two turns for every one of yours. Watch the strip.', 'think'),
      N('Fly, Fly, Swim. Fly, Fly, Swim. Fly, Fly…'),
      gag(FERN('Hers is small but clever. Like Clover. Also like Clover, it never stops moving.')),
    ],
    [
      {
        domain: 'maths',
        skill: 'continue a repeating pattern and find a later term by its rule',
        standard: '4.OA.C.5',
        kind: 'ask',
        after: 7,
        prompt: [
          CLOVER('The strip repeats every three turns: Fly, Fly, Swim.'),
          CLOVER('Whose is the ninth turn?', 'think'),
        ],
        options: [
          opt(
            'Yours: the Swim one',
            [
              CLOVER('Right. Every third turn is Swim: the 3rd, the 6th, the 9th. Nine is a multiple of three.', 'happy'),
            ],
            true,
          ),
          opt('Clover’s flyer', [
            CLOVER('Fair guess: it does get most of them. But count in threes: turns 3, 6 and 9 are Swim.'),
            CLOVER('So the ninth turn is yours. The rule tells you without counting every one.'),
          ]),
        ],
        parentNote:
          'Used the rule of a repeating turn pattern (Fly, Fly, Swim) to work out who has the ninth turn.',
      },
    ],
  ),
  sc(
    'bc-playday-bout',
    [
      CLOVER('Turns go round. Yours, then mine, in the order on the strip. Nobody pushes in.', 'soft'),
      gag(N('Clover’s Fly type hovers over yours, looking extremely pleased with itself.')),
      FERN('Swim soaks Fly! Wet wings are slow wings. Go on, try it.'),
      N('Splash. Clover’s flyer lands with a small, damp bump and looks at its feet.'),
      CLOVER('That’s cause and effect. The Swim move was the cause. A soggy flyer is the effect.'),
      CLOVER('The wheel goes round: Fly goes over Run, Run is too quick for Power, Power makes a bigger wave than Swim.'),
      N('Clover’s flyer yawns and naps under a leaf. Her next Nubbin trots in. It’s a Run type.'),
      gag(N('Fern’s spare Nubbins wait on the bench: a Fly, a Power and a Swim. The Power one is eating the bench.')),
    ],
    [
      {
        domain: 'science',
        skill: 'cause and effect: use a rule to choose the solution that works best',
        standard: '3-5-ETS1-2',
        kind: 'ask',
        after: 7,
        prompt: [CLOVER('My Run type is next. Which of Fern’s spares would work best against it?', 'think')],
        options: [
          opt(
            'A Fly type',
            [CLOVER('Yes. Fly goes over Run, so the Run type can’t catch it. Cause, then effect.', 'happy')],
            true,
          ),
          opt('A Power type', [
            CLOVER('Power is strong, so it’s a sensible guess. But Run is too quick for Power.'),
            CLOVER('The Run type would dodge every swing. A Fly type goes over Run instead.'),
          ]),
          opt('A Swim type', [
            CLOVER('Swim and Run are even: neither one beats the other, so it’s a fair fight.'),
            CLOVER('Fly would do better. Fly goes over Run.'),
          ]),
        ],
        parentNote:
          'Used the type wheel’s rule (Fly goes over Run) to predict which choice would work best.',
      },
    ],
  ),
  sc(
    'bc-playday-hug',
    [
      N('The bout is over. Both Nubbins toddle to the middle and hug, the way Clover said they would.'),
      CLOVER('That’s how every bout ends here. A hug. Then a snack.', 'happy'),
      gag(FERN('Then a nap. Then, if I’m honest, another snack.')),
      N('Your Nubbin breaks its plum in half and gives the bigger half to the one it beat. Nobody told it to.'),
      CLOVER('Winning is nice. Sharing is nicer. Ask anybody who’s been given half a plum.', 'soft'),
      N('The two of them sit side by side, sticky and pleased, watching the next bout.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'think about why a winner might share with the one they beat',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 4,
        prompt: [CLOVER('Why do you think your Nubbin shared with the one it beat?', 'think')],
        options: [
          opt('So they can still be friends', [
            CLOVER('I think so too. A play-fight is a game. Friends are for after the game, and before the next one.'),
          ]),
          opt('Because the other one looked sad', [
            CLOVER('That’s kind noticing. Losing can feel a bit sore, and a share says “you still matter”.'),
          ]),
          opt('It just likes plums less than hugs', [
            CLOVER('Ha. Could be! Some Nubbins would swap any plum for a good hug. Sharing was the hug in plum form.'),
          ]),
        ],
        parentNote: 'Thought about why sharing after a game helps friendships, with no single right answer.',
      },
    ],
  ),
];

export const EDU_BATTLE_READER_CHECKS: string[] = [];
export const EDU_BATTLE_READER_FLAGS: string[] = [];
