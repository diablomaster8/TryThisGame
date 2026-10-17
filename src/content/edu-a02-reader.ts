/**
 * The Learning Grove, reader band (ages 7–10): Atlas A2, The Monkey and the Monk (Journey to the
 * West, China).
 *
 * Source: atlas-a02.ts (ATLAS_A02 and ATLAS_A02_VARIANTS). One EduScene per original scene, id
 * `reader:<original id>`: every step scene, every done scene, every complete scene and both
 * variants. Every choice keeps its original id and `set` (a02-believed). See EDU-STYLE.md.
 *
 *   Learning angles (from the outline): the real monk Xuanzang and the Silk Road (2-ESS2-2,
 *   D2.Geo.2.K-2, D2.His.2.K-2); map-reading and the compass (west to India, east for sunrise,
 *   clockwise turns); the Chinese zodiac and the Great Race (ordinal numbers, subtraction, a
 *   repeating twelve-year pattern); the Monkey King in shadow-puppet theatre (light, shadows,
 *   5-ESS1-2). Also: weathering and erosion (4-ESS2-1), the water cycle, life cycles (3-LS1-1),
 *   seeds and fruit (2-LS2-2), fire and heat (4-PS3-2), forces and floating (3-PS2-1), sound
 *   (4-PS3-2), animal senses and body parts (4-LS1-1, 4-LS1-2), symmetry (4.G.A.3), time and
 *   units, including the li (4.MD.A.1, 4.MD.A.2, 3.MD.A.1), multiplication and division
 *   (3.OA.A.3), similes and metaphors (L.4.5), multiple-meaning words (L.3.4), point of view
 *   (RL.3.6), motives (RL.3.3) and theme (RL.4.2).
 *   Think questions (no best answer): in every quest, e.g. whether letting Monkey play was wise,
 *   whether growing old is something to fear, whether the golden band is fair, whether
 *   something is less valuable for being unfinished, and, in A2-12, who you believe.
 *
 * - Care notes kept. The Buddha and Guanyin are wise and kind, never mocked; real religious
 *   facts (alms, the bodhisattva Guanyin, the Five Elements) are stated respectfully and plainly.
 *   The novel is called a novel, and the real Xuanzang is kept apart from the story's monk.
 * - Hard things: the fire in the guest hall is a wrong done by greedy people, every monk gets
 *   out. The bones of A2-12 are a chalky heap. Monkey is stopped, not hurt, under the mountain.
 *   Grief and fear of growing old are said plainly, with a friend sitting beside Monkey.
 * - Numbers are checkable: a li is about half a kilometre in modern use (old li varied), 3,600
 *   peach trees split into three equal groups of 1,200, 49 days is seven weeks, 5,048 rolls.
 *   Lines that say "suppose" invent a number only to practise a sum.
 * - Nubbins never speak. The source's own characters talk, as canon 31 allows inside an Atlas.
 * - No lines from any translation, film or comic. All lines are new.
 */
import type { EduDomain, EduQuest, EduScene, GlossaryEntry, Lesson } from './types';
import type { Choice, Line, Mood } from '../config/story';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const Y = say('you');
const MK = say('a02-monkey');
const MO = say('a02-monk');
const PG = say('a02-pigsy');
const SD = say('a02-sandy');
const GY = say('a02-guanyin');
const BU = say('a02-buddha');
const JE = say('a02-jade');
const HE = say('a02-herald');
const GB = say('a02-gibbon');
const TE = say('a02-teacher');
const GS = say('a02-gardener');
const QM = say('a02-queen');
const DR = say('a02-dragon');
const AB = say('a02-abbot');
const BR = say('a02-bear');
const GA = say('a02-gao');
const MS = say('a02-moksa');
const BM = say('a02-moon');
const PW = say('a02-wind');
const ZY = say('a02-zhenyuan');
const BN = say('a02-bone');
const SH = say('a02-silver');
const LL = say('a02-lao');
const RB = say('a02-redboy');
const FM = say('a02-false');
const IF = say('a02-ironfan');
const SS = say('a02-spider');
const TT = say('a02-turtle');

// ---------------------------------------------------------------- builders
type LessonIn = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const opt = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

const ask = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | null,
  prompt: Line[],
  options: Opt[],
  parentNote: string,
): LessonIn => ({
  domain,
  skill,
  ...(standard ? { standard } : {}),
  kind: 'ask',
  after,
  prompt,
  options,
  parentNote,
});

const notice = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | null,
  lines: Line[],
  parentNote: string,
): LessonIn => ({
  domain,
  skill,
  ...(standard ? { standard } : {}),
  kind: 'notice',
  after,
  lines,
  parentNote,
});

const doIt = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | null,
  check: string,
  lines: Line[],
  parentNote: string,
): LessonIn => ({
  domain,
  skill,
  ...(standard ? { standard } : {}),
  kind: 'do',
  after,
  check,
  lines,
  parentNote,
});

/** Builds `reader:<of>` and numbers its lessons `reader:<of>-l1`, `-l2`, in play order. */
const scene = (of: string, lines: Line[], lessons: LessonIn[], choices?: Choice[]): EduScene => {
  const id = `reader:${of}`;
  const s: EduScene = {
    id,
    of,
    band: 'reader',
    lines,
    lessons: [...lessons]
      .sort((a, b) => a.after - b.after)
      .map((l, i) => ({ id: `${id}-l${i + 1}`, ...l })),
  };
  if (choices) s.choices = choices;
  return s;
};

const gloss = (word: string, meaning: string, of: string): GlossaryEntry => ({
  word,
  meaning,
  scene: `reader:${of}`,
});

// ================================================================== A2-1 Born from Stone
const Q01_SCENES: EduScene[] = [
  scene(
    'a02-01-page',
    [
      N(
        'Nova’s atlas falls open at a page painted in ink and wash: a mountain of peach trees, a waterfall, and clouds drawn as curls.',
      ),
      N('In the margin Nova has pencilled: “A very long walk. Take snacks.”'),
      N(
        'The ink goes wet under your fingers, then warm. You and your Nubbin step in and stand on warm rock, high above the clouds.',
      ),
      N(
        'This is the Mountain of Flowers and Fruit. Everything on it smells of peaches, even the stones.',
      ),
      N(
        'At the very top sits an egg made of stone, taller than you are. Your Nubbin walks round it twice, very slowly.',
      ),
      N(
        'Suppose each trip round the egg is seven metres. Your Nubbin has gone round twice, listening with its cheek on the stone.',
      ),
      N('Then it looks up at you, solemn as a doctor.'),
    ],
    [
      notice(
        1,
        'social-studies',
        'a story that is hundreds of years old',
        'D2.His.2.K-2',
        [
          N(
            'This page comes from Journey to the West, a Chinese novel written about 400 years ago. People still tell it, act it and draw it today.',
          ),
        ],
        'Your child heard that the story comes from a Chinese novel written long ago.',
      ),
      ask(
        5,
        'maths',
        'multiply: 2 trips of 7 metres',
        '3.OA.A.3',
        [N('Two trips round the egg, seven metres each. How far has your Nubbin walked?')],
        [
          opt('14 metres', [N('Yes. Two groups of seven make fourteen.')], true),
          opt('9 metres', [
            N('That is 2 + 7. The trips are equal groups, so multiply.'),
            N('2 × 7 = 14 metres.'),
          ]),
          opt('72 metres', [
            N('That puts the 7 and the 2 side by side.'),
            N('Two trips of seven metres is 2 × 7 = 14 metres.'),
          ]),
        ],
        'Your child solved an equal-groups multiplication story (2 × 7).',
      ),
    ],
    [
      {
        id: 'knock',
        label: 'Knock on the egg.',
        then: [
          N(
            'Something inside knocks back. Your Nubbin knocks again, delighted, and it goes on like that for some time.',
          ),
        ],
      },
      {
        id: 'sit',
        label: 'Sit down beside it and wait.',
        then: [
          N(
            'You sit, and your Nubbin sits. The wind comes and sits too, and the egg seems to like the company.',
          ),
        ],
      },
    ],
  ),
  scene(
    'a02-01-page-done',
    [
      N('A wind gets up from nowhere and leans on the egg, the way you lean on a stuck door.'),
      N('The stone is smooth and pitted, as if wind and rain have been polishing it for ages.'),
    ],
    [
      notice(
        1,
        'science',
        'weathering shapes rock slowly',
        '4-ESS2-1',
        [
          N(
            'Wind, rain and ice slowly wear rock away, and that is called weathering. Over thousands of years it can smooth a stone.',
          ),
        ],
        'Your child learned that weathering slowly wears rocks smooth.',
      ),
    ],
  ),
  scene(
    'a02-01-hatch',
    [
      N(
        'The egg cracks with a sound like a dropped plate. A stone ball rolls out, and the ball unfolds into a monkey.',
      ),
      N(
        'He is the grey of the rock, all knees and elbows. He bows to the north, the south, the east and the west.',
      ),
      N(
        'Then he opens his eyes. Two beams of gold shoot up through the clouds, as if he were checking the sky for holes.',
      ),
      MK('Ha! Who are you? Are you a rock as well? You’re very round for a rock.', 'happy'),
      N('Your Nubbin, who also came out of an egg, decides on the spot that this is family.'),
      MK(
        'A cousin! I knew there’d be others. Everything up here is mine, I think. You can have some of the view.',
      ),
      MK('Not the peaches. Well. One peach.'),
    ],
    [
      ask(
        1,
        'social-studies',
        'turning on a compass: north to east',
        'D2.Geo.2.K-2',
        [
          N(
            'Monkey faces north, then turns a quarter turn to his right, the way a clock hand moves. Which way is he facing now?',
          ),
        ],
        [
          opt('East', [N('Yes. North, then a quarter turn clockwise, is east.')], true),
          opt('West', [
            N('West is a quarter turn the other way, to the left.'),
            N('Clockwise from north comes east, then south, then west.'),
          ]),
          opt('South', [
            N(
              'South is a half turn, two quarter turns, from north. A single quarter turn gives east.',
            ),
          ]),
        ],
        'Your child used clockwise quarter turns to find a compass direction.',
      ),
    ],
  ),
  scene(
    'a02-01-hatch-done',
    [
      N('Monkey’s eyes throw two beams of gold light, straight as rods, up through the clouds.'),
      N('Far above, in a hall in the sky, somebody very important has to put his tea down.'),
    ],
    [
      notice(
        0,
        'science',
        'light travels in straight lines',
        '1-PS4-2',
        [
          N(
            'Light travels in straight lines. That is why a torch makes a beam, and why shadows have sharp edges.',
          ),
        ],
        'Your child heard that light travels in straight lines.',
      ),
    ],
  ),
  scene(
    'a02-01-heaven',
    [
      N(
        'The page turns up one corner of itself, and you are on a cloud above a hall of jade and gold.',
      ),
      JE(
        'Two beams of light from a mountain in the east. Who is making a fuss down there?',
        'think',
      ),
      N('A herald bows very low and stays down there, to be safe.'),
      HE(
        'Only a monkey, Majesty. Born from a stone this morning. He has eaten something, and the light has gone out.',
      ),
      JE(
        'Then let him be. Heaven and earth make strange things all the time. Let him play.',
        'soft',
      ),
      N(
        'Your Nubbin leans over the edge of the cloud and waves at a small grey dot. The dot waves back.',
      ),
      JE('Still. Write it down somewhere. Small things grow.'),
    ],
    [
      ask(
        4,
        'sel',
        'weighing a decision (a think question)',
        'CASEL: Responsible decision-making',
        [
          JE('I decided to let him play. Was that wise?'),
          N('There is no single right answer. Think about it, then choose.'),
        ],
        [
          opt('Yes, give him room', [
            N('That is a fair answer. Jade Emperor would say: curiosity first, rules later.'),
            N('We will see if the room is used well.'),
          ]),
          opt('No, watch him closely', [
            N(
              'That is a fair answer. Jade Emperor would say: small things grow, and so do problems.',
            ),
            N('He did write it down, after all.'),
          ]),
          opt('It depends on Monkey', [
            N(
              'That is a fair answer, and a careful one. A decision can be wise or unwise, depending on what happens next.',
            ),
          ]),
        ],
        'Your child weighed up whether it was wise to let a powerful newcomer play freely.',
      ),
    ],
  ),
  scene(
    'a02-01-complete',
    [
      N(
        'By evening the stone monkey has learned to walk, climb, eat peaches and argue with other monkeys, in that order.',
      ),
      MK(
        'Cousin! You came back down. Tomorrow I’m going to do something enormous. I haven’t decided what.',
        'happy',
      ),
      N(
        'He gives your Nubbin a peach that is mostly bite marks. Your Nubbin holds it like treasure.',
      ),
      N(
        'Nova has drawn a tiny peach in the margin. Now a tiny ink monkey sits beside it, eating it.',
      ),
      N('Far above, someone important is still wondering what, exactly, he has just seen.'),
      N('The page rustles softly, as if it too would like to know what happens next.'),
    ],
    [
      notice(
        0,
        'social-studies',
        'the twelve zodiac animals; Monkey is ninth',
        'D2.His.2.K-2',
        [
          N(
            'In Chinese tradition, twelve animals name the years, in a repeating cycle: Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig.',
          ),
          N(
            'Count along, and you will find Monkey ninth. Remember this list, because the pilgrims will meet more of its animals.',
          ),
        ],
        'Your child learned the order of the twelve zodiac animals and where Monkey sits in it.',
      ),
      ask(
        1,
        'sel',
        'big plans and care (a think question)',
        'CASEL: Self-awareness',
        [
          N(
            '“Something enormous” could mean a lovely thing or a terrible thing. How would you plan it?',
          ),
        ],
        [
          opt('Ask a friend what they think first', [
            N('That is a fair answer. Monkey could use a friend like that.'),
          ]),
          opt('Try it and see', [
            N(
              'That is a fair answer. Trying teaches a lot, though, as we will see, it also gets Monkey into trouble.',
            ),
          ]),
        ],
        'Your child thought about how to plan something ambitious.',
      ),
    ],
  ),
];

// ================================================================== A2-2 The Water-Curtain Cave
const Q02_SCENES: EduScene[] = [
  scene(
    'a02-02-stream',
    [
      N(
        'A hot afternoon. The monkeys splash in the stream until somebody asks where all the water comes from.',
      ),
      N(
        'Nobody knows, so everybody goes to look. You and your Nubbin go too, because everybody means everybody.',
      ),
      N(
        'The stream ends at a waterfall that hangs down the cliff like a white curtain. Behind it, nobody can see anything.',
      ),
      GB(
        'Whoever goes through that curtain and comes back with all their fur on, we make them king.',
      ),
      N(
        'Every monkey looks at its own feet. A few look at their neighbours’ feet, which is a sort of suggestion.',
      ),
      MK('I’ll go! I was born from a rock. Rocks don’t mind water.', 'happy'),
      N(
        'Your Nubbin steps up beside him, quite serious about it. It has always liked a waterfall.',
      ),
    ],
    [
      ask(
        1,
        'science',
        'the water cycle feeds streams',
        null,
        [N('The monkeys ask where the stream’s water comes from. What is the best answer?')],
        [
          opt(
            'Rain falls on the mountain, runs downhill, and later rises again as clouds',
            [
              N(
                'Yes. Rain feeds streams, streams reach the sea, the sun lifts water into clouds, and the cycle goes round.',
              ),
            ],
            true,
          ),
          opt('A spring that never stops, with no rain at all', [
            N('Springs are real, but they too are fed by rain that soaked into the ground.'),
            N('The whole cycle is rain, runoff, sea, vapour and cloud.'),
          ]),
        ],
        'Your child described where stream water comes from and how it cycles.',
      ),
    ],
    [
      {
        id: 'careful',
        label: 'Tell them both to be careful.',
        then: [MK('Careful is for monkeys who aren’t going to be king.', 'happy')],
      },
      {
        id: 'count',
        label: 'Offer to count them in.',
        then: [
          MK('Yes! Count. Kings should start on a number.'),
          N('You count to three. Monkey goes on two.'),
        ],
      },
    ],
  ),
  scene(
    'a02-02-stream-done',
    [
      N('He crouches, shuts his eyes tight, and leaps.'),
      N('Just before he goes, the curtain of water swings in the wind.'),
    ],
    [
      ask(
        1,
        'literacy',
        'multiple-meaning words: curtain',
        'L.3.4',
        [N('A curtain usually hangs at a window. What does “curtain” mean for a waterfall?')],
        [
          opt(
            'Water hanging down in a sheet that hides what is behind',
            [N('Yes. The word is borrowed because the water looks like fabric.')],
            true,
          ),
          opt('A piece of cloth sewn onto the cliff', [
            N('It is not real cloth; it is a comparison. The water hangs down like a curtain.'),
          ]),
        ],
        'Your child worked out a second meaning of "curtain" from context.',
      ),
    ],
  ),
  scene(
    'a02-02-leap',
    [
      N(
        'Your Nubbin dives after him, and you follow your Nubbin. The water thunders on your head, and then it stops.',
      ),
      N(
        'Behind the curtain it is dry. An iron bridge crosses to a cave with stone beds, stone pots and stone bowls.',
      ),
      N('Over the doorway someone has carved the cave a name, long ago, in tidy characters.'),
      MK(
        'Nobody lives here! It’s got beds. It’s got pots. It’s got a front door made of waterfall!',
        'happy',
      ),
      N(
        'Suppose there are four rows of stone beds, with six beds in each row. Your Nubbin tries them all in turn.',
      ),
      N('It finds every one of them exactly right.'),
      MK('Wait here. If I come back alone they’ll say I made it up.'),
    ],
    [
      notice(
        2,
        'social-studies',
        'Chinese writing uses characters',
        null,
        [
          N(
            'Chinese is written in characters. Each one stands for a word or a part of a word, and a name can be carved in just a few of them.',
          ),
        ],
        'Your child heard that Chinese is written with characters.',
      ),
      ask(
        4,
        'maths',
        'multiply: 4 rows of 6',
        '3.OA.A.1',
        [
          N(
            'Four rows of stone beds, six in each row. How many beds does your Nubbin have to try?',
          ),
        ],
        [
          opt('24', [N('Yes. Four groups of six: 6 + 6 + 6 + 6 = 24.')], true),
          opt('10', [N('That adds 4 + 6. We need four equal groups of six.'), N('4 × 6 = 24.')]),
        ],
        'Your child used equal groups to multiply (4 × 6).',
      ),
    ],
  ),
  scene(
    'a02-02-leap-done',
    [
      N(
        'He shoots back out through the curtain, shouting. A moment later, a lot of wet monkeys shoot in.',
      ),
      N('The roar of the waterfall shakes the cave walls so that you can feel it in your teeth.'),
    ],
    [
      ask(
        1,
        'literacy',
        'multiple-meaning words: shoot',
        'L.3.4',
        [N('Monkey “shoots” out, and the wet monkeys “shoot” in. What does shoot mean here?')],
        [
          opt(
            'To move very fast',
            [N('Yes. Here shoot means to move very fast, like a shooting star.')],
            true,
          ),
          opt('A new green stem on a plant', [
            N('That is another meaning: a plant’s new shoot.'),
            N('Here the monkeys are moving very fast, so shoot means to rush.'),
          ]),
        ],
        'Your child used context to choose the right meaning of "shoot".',
      ),
    ],
  ),
  scene(
    'a02-02-king',
    [
      N(
        'They make him king, as promised. He takes the name Handsome Monkey King, and nobody dares laugh.',
      ),
      N(
        'The page turns a few years, as easily as a page. The feasts go on and on, and then, one night, the king cries.',
      ),
      MK('One day I’ll be old. One day I’ll stop. All this, and one day it won’t be mine.', 'sad'),
      N('The cave goes very quiet. Your Nubbin climbs into his lap, which is all it knows to do.'),
      GB(
        'There are some who never grow old, they say. Buddhas, immortals and sages. They live far off, among people.',
      ),
      MK('Then I’ll go and find them. I’ll learn it. I’ll learn not to stop.'),
    ],
    [
      notice(
        3,
        'science',
        'every living thing has a life cycle',
        '3-LS1-1',
        [
          N(
            'Every living thing has a life cycle: it begins, grows, may have young, grows old, and ends.',
          ),
          N(
            'Trees, monkeys and people all do. It is a hard thing to feel, and it is allowed to make you sad.',
          ),
        ],
        'Your child learned that all living things have life cycles, and that sadness about it is allowed.',
      ),
      ask(
        5,
        'sel',
        'fear of growing old (a think question)',
        'CASEL: Self-awareness',
        [
          N(
            'Monkey is afraid of growing old and stopping. Is that fear helpful, or does it just hurt?',
          ),
          N('There is no single right answer. Think about it, then choose.'),
        ],
        [
          opt('It can push us to live well', [
            N('That is a fair answer. Many people feel that a short time makes each day matter.'),
          ]),
          opt('It mostly just hurts', [
            N(
              'That is a fair answer. Fear can crowd out the present, and a friend in your lap helps.',
            ),
          ]),
          opt('Both, depending on the day', [
            N('That is a fair answer. A feeling can be useful and heavy at the same time.'),
          ]),
        ],
        'Your child reflected on a hard feeling about time and ageing.',
      ),
    ],
    [
      {
        id: 'old',
        label: 'Tell him growing old isn’t the worst thing.',
        then: [
          MK('You say that because you aren’t a king.', 'think'),
          N('He keeps your Nubbin on his lap, though.'),
        ],
      },
      {
        id: 'go',
        label: 'Tell him to go and find out.',
        then: [
          MK('Yes. That’s the right answer. Cousin’s keeper gives the right answers.', 'happy'),
        ],
      },
    ],
  ),
  scene(
    'a02-02-complete',
    [
      N(
        'In the morning the monkeys build him a raft and pile it with fruit. They wave until he is a dot.',
      ),
      N('You and your Nubbin are on the raft too. It seems rude to wave from the shore.'),
      MK('I’ll be back. When I come back, I won’t ever have to stop.'),
      N(
        'Suppose the monkeys loaded five baskets with twelve fruits in each. Your Nubbin counts them twice, to be sure.',
      ),
      N(
        'Years go by on the water, as fast as you can turn a page. He learns to wear clothes and to walk like a person.',
      ),
      N(
        'Behind them, the waterfall swings shut like a curtain, and the cave goes back to being quiet.',
      ),
    ],
    [
      ask(
        3,
        'maths',
        'multiply: 5 baskets of 12',
        '3.OA.A.3',
        [N('Five baskets with twelve fruits in each. How many pieces of fruit are on the raft?')],
        [
          opt('60', [N('Yes. 5 × 12 = 60. Five tens and five twos: 50 + 10.')], true),
          opt('17', [
            N('That adds 5 + 12. Five equal baskets means we multiply.'),
            N('5 × 12 = 60.'),
          ]),
        ],
        'Your child multiplied 5 × 12.',
      ),
    ],
  ),
];

// ================================================================== A2-3 Lessons in Shape-Changing
const Q03_SCENES: EduScene[] = [
  scene(
    'a02-03-lesson',
    [
      N(
        'High on a quiet mountain there is a cave, and in the cave a teacher with a great many students.',
      ),
      TE(
        'A monkey. Then you shall have a name: Sun Wukong, Awake to Emptiness. It suits you. You are mostly noise.',
        'soft',
      ),
      N(
        'The page turns seven years of sweeping floors. Then the teacher offers Monkey a choice of lessons.',
      ),
      TE(
        'I could teach you to see fortunes. To sit still. To make medicines. To read the old books.',
      ),
      MK('Will any of them make me live for ever?'),
      TE('No.'),
      MK('Then no, thank you.'),
      N(
        'The teacher climbs down from his seat, taps Monkey three times on the head with his ruler, and walks out with his hands behind his back.',
      ),
      N('The other students are furious. Monkey is grinning from ear to ear.'),
    ],
    [
      ask(
        4,
        'sel',
        'choosing a goal (a think question)',
        'CASEL: Responsible decision-making',
        [
          N(
            'Monkey turns down every lesson except the one that might make him live for ever. Was that a wise way to choose?',
          ),
          N('There is no single right answer. Think about it, then choose.'),
        ],
        [
          opt('Yes, he knew what he wanted', [
            N('That is a fair answer. A clear goal can stop you wasting years.'),
          ]),
          opt('No, the other lessons had value', [
            N(
              'That is a fair answer. Patience and medicine might have helped him more than he knew.',
            ),
          ]),
          opt('Both are true', [
            N(
              'That is a fair answer. A single goal gives focus, and it can also make you miss other good things.',
            ),
          ]),
        ],
        'Your child thought about choosing a goal and what it might cost.',
      ),
    ],
    [
      {
        id: 'ask',
        label: 'Ask Monkey why he’s grinning.',
        then: [
          MK(
            'Three taps: come at the third watch of the night. Hands behind his back: use the back door.',
            'happy',
          ),
          MK(
            'He’s going to teach me in secret. Don’t tell the others. Don’t tell Cousin, it can’t keep a secret.',
          ),
        ],
      },
      {
        id: 'guess',
        label: 'Work it out for yourself.',
        then: [N('Three taps, hands behind the back. You catch Monkey’s eye, and he winks.')],
      },
    ],
  ),
  scene(
    'a02-03-night',
    [
      N(
        'At the third watch the back door is open a crack, and Monkey slips through it. You sit outside on the step.',
      ),
      N(
        'Your Nubbin falls asleep against the door almost at once. It snores in a small, polite way.',
      ),
      N(
        'Inside, the teacher talks for a long time in a low voice. You don’t hear the words, and you aren’t meant to.',
      ),
      N(
        'The page turns three more years of nights. Then one evening Monkey comes out walking a foot above the ground.',
      ),
      MK('Seventy-two changes! I can be anything. And look, look at this.', 'happy'),
      N(
        'He does a somersault on a cloud, and is gone. A moment later he is back, a little out of breath.',
      ),
      MK('A hundred and eight thousand li in one go! Cousin, did you see?'),
    ],
    [
      ask(
        0,
        'maths',
        'time intervals: the five watches of the night',
        '3.MD.A.1',
        [
          N(
            'In old China the night, from about 7 in the evening to 5 in the morning, was split into five equal watches. How long is one watch?',
          ),
        ],
        [
          opt(
            '2 hours',
            [
              N(
                'Yes. Ten hours shared into five equal parts is two hours each. The third watch is the middle of the night.',
              ),
            ],
            true,
          ),
          opt('5 hours', [
            N('Five is the number of watches. Share the ten hours into five equal parts instead.'),
            N('10 ÷ 5 = 2 hours.'),
          ]),
        ],
        'Your child divided a time span into equal parts (10 hours ÷ 5).',
      ),
      notice(
        6,
        'social-studies',
        'the li and a big journey',
        '4.MD.A.1',
        [
          N(
            'A li is an old Chinese unit of distance. Today it is taken as half a kilometre (in the old days it varied).',
          ),
          N(
            'So 108,000 li is 54,000 kilometres, and the Earth is only about 40,000 kilometres round.',
          ),
          N('Monkey claims one somersault goes further than all the way round the world.'),
        ],
        'Your child converted an old unit of distance and compared it with the size of the Earth.',
      ),
    ],
  ),
  scene(
    'a02-03-pine',
    [
      N(
        'The other students have heard rumours. They gather round Monkey under the pines, all asking at once.',
      ),
      MK('A pine tree? Easy.'),
      N(
        'There is a pop, and in Monkey’s place stands a pine tree, very proud of itself. The students cheer.',
      ),
      N(
        'Your Nubbin stands beside it with both arms up, very still. It is being a small pine tree.',
      ),
      TE('Who is shouting in my yard?', 'angry'),
      N('The pine tree turns back into a monkey, quite quickly.'),
      TE(
        'You show off. A gift you show off makes other people want it, and then they come for it. And for you.',
      ),
      TE('Go home. And never tell anyone who taught you. Not one word.', 'sad'),
    ],
    [
      notice(
        3,
        'art',
        'shadow puppets: light, a screen, and shadows',
        null,
        [
          N('Monkey turning into a pine is a favourite scene in Chinese shadow-puppet plays.'),
          N(
            'Flat figures are held between a lamp and a white screen, and the audience sees only their shadows.',
          ),
        ],
        'Your child heard how shadow-puppet theatre works.',
      ),
      ask(
        3,
        'science',
        'shadow size depends on distance from the lamp',
        '5-ESS1-2',
        [N('A puppeteer wants a bigger shadow on the screen. What should she do with the puppet?')],
        [
          opt(
            'Move it closer to the lamp, away from the screen',
            [
              N(
                'Yes. The closer a puppet is to the light, the more of the light it blocks, so the bigger its shadow.',
              ),
            ],
            true,
          ),
          opt('Move it closer to the screen', [
            N('That makes the shadow sharper and smaller.'),
            N('To make it bigger, move it towards the lamp.'),
          ]),
        ],
        'Your child predicted how moving a puppet changes the size of its shadow.',
      ),
    ],
    [
      {
        id: 'speak',
        label: 'Tell the teacher Monkey meant no harm.',
        then: [TE('I know. That is the trouble with him. He never means any.', 'soft')],
      },
      {
        id: 'quiet',
        label: 'Stay out of it.',
        then: [N('You stay out of it. Your Nubbin, still being a pine tree, stays out of it too.')],
      },
    ],
  ),
  scene(
    'a02-03-complete',
    [
      N(
        'Monkey bows to his teacher, properly, all the way to the floor. For once he doesn’t say anything clever.',
      ),
      MK('Hold on to my tail, Cousin’s keeper. I know a quick way home.', 'soft'),
      N(
        'One somersault, and the world rolls under you like a rug being shaken. Then there are peaches again.',
      ),
      N(
        'Your Nubbin tumbles off the cloud and lies on the grass, beaming. It would like to do that again, please.',
      ),
      N('Far behind you, a teacher in a cave sighs, smiles, and goes back to his books.'),
      N('He says nothing to the others, and nobody asks.'),
    ],
    [
      ask(
        2,
        'literacy',
        'similes and metaphors',
        'L.4.5',
        [N('“The world rolls under you like a rug being shaken.” Is that a simile or a metaphor?')],
        [
          opt(
            'A simile, because it uses “like”',
            [N('Yes. A simile compares two things using “like” or “as”.')],
            true,
          ),
          opt('A metaphor', [
            N('A metaphor says one thing is another. This one says it is like another.'),
            N('So it is a simile.'),
          ]),
        ],
        'Your child told a simile from a metaphor.',
      ),
    ],
  ),
];

// ================================================================== A2-4 Havoc in Heaven
const Q04_SCENES: EduScene[] = [
  scene(
    'a02-04-stables',
    [
      N(
        'Since the teacher, Monkey has been busy. He has an iron staff from the sea-dragons, and he has rubbed his name out of the Book of Life and Death.',
      ),
      N('Heaven decides it would be simpler to give him a job. So up you all go.'),
      MK('Keeper of the Heavenly Horses! A grand title. They must think a lot of me.', 'happy'),
      N(
        'He is very good with the horses. They grow fat and shiny, and your Nubbin rides one round the paddock.',
      ),
      MK('Wait. What rank is Keeper of the Horses, exactly?'),
      N(
        'A stable hand tells him: it is the lowest job in Heaven. Monkey throws down his hat and goes straight home.',
      ),
      N(
        'Heaven sighs, and tries again: Great Sage Equal to Heaven. A big title with no work at all.',
      ),
    ],
    [
      notice(
        3,
        'science',
        'a horse’s eyes and senses',
        '4-LS1-2',
        [
          N(
            'A horse’s eyes sit on the sides of its head, so it can see almost all the way round without turning.',
          ),
          N('That is a useful sense for an animal that is hunted.'),
        ],
        'Your child learned how a horse’s eyes help it survive.',
      ),
      ask(
        5,
        'sel',
        'does a title matter? (a think question)',
        'CASEL: Self-awareness',
        [
          N(
            'Monkey storms off because the job’s rank is low, even though he was good at it. Does a title matter more than the work?',
          ),
          N('There is no single right answer. Think about it, then choose.'),
        ],
        [
          opt('The work matters more', [
            N('That is a fair answer. The horses were happy, and he was doing it well.'),
          ]),
          opt('Respect matters too', [
            N('That is a fair answer. Feeling valued helps people do their best.'),
          ]),
          opt('A bit of both', [
            N('That is a fair answer. A good job and fair respect both count.'),
          ]),
        ],
        'Your child weighed rank against the value of doing good work.',
      ),
    ],
  ),
  scene(
    'a02-04-stables-done',
    [
      JE(
        'Give him the Peach Garden to look after. It will keep him busy and out of trouble.',
        'think',
      ),
      N('Several ministers look at each other and say nothing, which says a great deal.'),
    ],
    [
      ask(
        0,
        'literacy',
        'a character’s motive',
        'RL.3.3',
        [N('Why does the Jade Emperor choose the Peach Garden for Monkey?')],
        [
          opt(
            'He hopes a job will keep Monkey busy and out of trouble',
            [
              N(
                'Yes. That is his motive. The ministers, who know about peaches and monkeys, are not so sure.',
              ),
            ],
            true,
          ),
          opt('He wants Monkey to eat the peaches', [
            N('No. He means it as a safe task.'),
            N('He does not see the problem yet. The ministers do.'),
          ]),
        ],
        'Your child read a character’s motive from what he says.',
      ),
    ],
  ),
  scene(
    'a02-04-garden',
    [
      GS(
        'Three thousand six hundred trees, Great Sage. These ripen every three thousand years. These, every six thousand.',
      ),
      GS(
        'And these at the back, every nine thousand. Eat one, and you live as long as heaven and earth.',
      ),
      N(
        'Your Nubbin has gone very still. It is looking at the peaches the way it looks at you at teatime.',
      ),
      MK('Thank you. You may go. I shall inspect the trees alone. Very carefully.'),
      N(
        'The spirit goes. Monkey shrinks to the size of your thumb, climbs the oldest tree, and eats the best peach on it.',
      ),
      N('Then the next best. Then he falls asleep in a fork of the branches, round as a plum.'),
      N(
        'A ripe peach drops into the grass at your Nubbin’s feet. It glows faintly, like a lamp turned low.',
      ),
    ],
    [
      ask(
        1,
        'maths',
        'divide: 3,600 trees in three equal groups',
        '3.OA.A.3',
        [
          N(
            'The trees are in three groups of equal size, each ripening on a different cycle. If there are 3,600 trees in all, how many are in each group?',
          ),
        ],
        [
          opt(
            '1,200',
            [N('Yes. 3,600 ÷ 3 = 1,200. Think 36 hundreds shared by three: 12 hundreds.')],
            true,
          ),
          opt('1,800', [
            N('That is half of 3,600. We need a third.'),
            N('36 ÷ 3 = 12, so 3,600 ÷ 3 = 1,200.'),
          ]),
        ],
        'Your child divided 3,600 by 3.',
      ),
      notice(
        6,
        'science',
        'fruit helps seeds travel',
        '2-LS2-2',
        [
          N('A peach has one large stone, with a seed inside.'),
          N(
            'Fruit is tasty so animals will carry the stone away and drop it somewhere new. That is one way plants spread.',
          ),
        ],
        'Your child learned that tasty fruit helps animals spread seeds.',
      ),
    ],
    [
      {
        id: 'hang',
        label: 'Hang the peach back on its branch.',
        then: [
          N(
            'You can’t, of course; it won’t stay. You put it gently at the foot of the tree instead.',
          ),
          N('Your Nubbin watches you do it, sighs from its toes, and lets it go.'),
        ],
      },
      {
        id: 'sniff',
        label: 'Let your Nubbin sniff it, and no more.',
        then: [
          N(
            'Your Nubbin sniffs it for a long, long time. It glows a tiny bit just from the smell, and leaves it be.',
          ),
        ],
      },
    ],
  ),
  scene(
    'a02-04-banquet',
    [
      N(
        'Seven fairy maidens come to pick peaches for the Queen Mother’s banquet. They find very few left.',
      ),
      N('They tell him who is invited: everyone. Everyone except the Great Sage Equal to Heaven.'),
      MK('Everyone?', 'angry'),
      N(
        'He freezes the maidens where they stand with one word, and is off to the Jade Pool before you can blink.',
      ),
      N(
        'He puts the servants to sleep and eats the whole banquet. Then he wanders into Lord Lao’s palace.',
      ),
      N('On the table are five gourds of golden elixir pills. He eats them like roasted beans.'),
      MK('Oh. Oh, no. That might have been a mistake.', 'shock'),
      MK('Cousin! Keeper! Home! Now!'),
    ],
    [
      ask(
        3,
        'sel',
        'being left out, and what you do next (a think question)',
        'CASEL: Responsible decision-making',
        [
          N('Monkey was not invited, and that hurt. Does being hurt excuse what he did next?'),
          N('There is no single right answer. Think about it, then choose.'),
        ],
        [
          opt('No, it hurts but it is no excuse', [
            N('That is a fair answer. A feeling explains an action, and it does not make it fair.'),
          ]),
          opt('Partly, the invitation was unfair', [
            N(
              'That is a fair answer. Leaving someone out was unkind, and what he did in reply was still too much.',
            ),
          ]),
        ],
        'Your child separated the reason for an action from whether it was fair.',
      ),
    ],
  ),
  scene(
    'a02-04-complete',
    [
      N(
        'Heaven sends its armies after him. They fight for days, and it is all dust and thunder and bonks on helmets.',
      ),
      N('Nothing can hurt him now. He has eaten the peaches, the banquet and the elixir.'),
      MK('Ha! Equal to Heaven? I’m better than equal. Tell them, Cousin.', 'happy'),
      N('Your Nubbin, behind a rock, would rather not tell anybody anything.'),
      N(
        'The fairy maidens unfreeze at last, look at the empty trees, and go to tell the Queen Mother.',
      ),
      N('Far below, the garden is very quiet, and one small peach stone lies in the grass.'),
    ],
    [
      ask(
        2,
        'literacy',
        'your point of view and a character’s',
        'RL.3.6',
        [N('Monkey thinks “better than equal” is a triumph. How might the fairy maidens see it?')],
        [
          opt(
            'As a disaster: their trees are bare',
            [
              N(
                'Yes. They were frozen and the garden was emptied. Two people can see the same event very differently.',
              ),
            ],
            true,
          ),
          opt('As a triumph for Monkey, too', [
            N('Only Monkey sees it that way. For the maidens it is a loss.'),
            N('Point of view means who is looking, and from where.'),
          ]),
        ],
        'Your child compared a character’s point of view with another’s.',
      ),
    ],
  ),
];

// ================================================================== A2-5 Under the Mountain
const Q05_SCENES: EduScene[] = [
  scene(
    'a02-05-furnace',
    [
      N(
        'In the end a great warrior and his dog catch Monkey, and nothing in Heaven can harm him. So Lord Lao puts him in his furnace.',
      ),
      N(
        'Forty-nine days the fire burns. Your Nubbin sits by the furnace door the whole time, worried, and won’t be moved.',
      ),
      N(
        'Monkey hides in the one corner where there is only wind. The smoke makes his eyes red, and then gold.',
      ),
      N(
        'On the forty-ninth day the lid comes off with a bang. Out jumps Monkey, with eyes like two little suns.',
      ),
      MK('Cousin! You waited. Stand back. I’m going to be very rude to everyone.', 'happy'),
      N(
        'He kicks the furnace over and runs the length of Heaven, scattering generals like skittles.',
      ),
    ],
    [
      ask(
        1,
        'maths',
        'divide: 49 days in weeks',
        '3.OA.A.3',
        [
          N(
            'The fire burned for forty-nine days, and a week has seven days. How many weeks was Monkey in the furnace?',
          ),
        ],
        [
          opt('7 weeks', [N('Yes. 49 ÷ 7 = 7. Seven weeks of seven days.')], true),
          opt('6 weeks', [
            N('Six weeks would be 42 days. Count seven more: 42 + 7 = 49.'),
            N('So it is 7 weeks.'),
          ]),
        ],
        'Your child converted 49 days to 7 weeks.',
      ),
      notice(
        1,
        'sel',
        'waiting with a friend',
        'CASEL: Relationship skills',
        [
          N(
            'Your Nubbin sat at the furnace door for seven weeks. You can’t fix everything for a friend, but you can stay.',
          ),
        ],
        'Your child heard that staying beside a friend is a way to help.',
      ),
    ],
  ),
  scene(
    'a02-05-furnace-done',
    [
      JE('Fetch the Buddha. Ask him, please, to come.', 'sad'),
      N('It is the first time anyone in Heaven has said “please” about Monkey.'),
    ],
    [
      ask(
        0,
        'literacy',
        'why the Emperor calls on the Buddha',
        'RL.3.3',
        [N('Why does the Jade Emperor send for the Buddha, and not another general?')],
        [
          opt(
            'No army can stop Monkey, so he needs a different kind of strength',
            [N('Yes. Force has failed. He turns to wisdom.')],
            true,
          ),
          opt('The Buddha is the strongest fighter', [
            N('The story does not say the Buddha fights. He is calm and wise.'),
            N('The Emperor needs a different sort of help.'),
          ]),
        ],
        'Your child inferred a character’s reason for asking for help.',
      ),
    ],
  ),
  scene(
    'a02-05-palm',
    [
      N(
        'The Buddha comes in quietly. Everything else goes quiet with him, even Monkey, for a breath.',
      ),
      BU('What is it you want?', 'soft'),
      MK('The Jade Emperor’s throne. He’s had it long enough. It’s my turn.'),
      BU(
        'Then here is a wager. Jump out of my right hand, and the throne is yours. If you cannot, go back down and learn.',
      ),
      MK(
        'Your hand? It isn’t a foot across. I go a hundred and eight thousand li in one somersault!',
        'happy',
      ),
      N('He jumps onto the open palm, and is gone in a streak of cloud.'),
      N(
        'You can see Monkey fly to five pink pillars at the edge of the world, and write his title on the middle one.',
      ),
      N('You can see that the pillars are fingers.'),
    ],
    [
      ask(
        7,
        'sel',
        'point of view (a think question)',
        'CASEL: Social awareness',
        [
          N(
            'Monkey thinks he reached the end of the world, but the Buddha knows he never left the hand. Who is right?',
          ),
          N('There is no single right answer. Think about it, then choose.'),
        ],
        [
          opt('The Buddha, because he sees the whole', [
            N(
              'That is a fair answer. From above, you can see how little ground Monkey really covered.',
            ),
          ]),
          opt('Both, from where they stand', [
            N(
              'That is a fair answer: Monkey reports what he saw, and the Buddha knows what it was.',
            ),
          ]),
        ],
        'Your child thought about how point of view changes what seems true.',
      ),
    ],
    [
      {
        id: 'gentle',
        label: 'When he lands, tell him gently: it was the hand all along.',
        then: [MK('Rubbish. I went to the end of the world. I wrote my name on it.', 'angry')],
      },
      {
        id: 'quiet',
        label: 'Say nothing. Let the Buddha show him.',
        then: [
          N(
            'You say nothing. The Buddha glances at you, briefly, and something in his face says thank you.',
          ),
        ],
      },
    ],
  ),
  scene(
    'a02-05-palm-done',
    [
      N(
        'The Buddha lifts his hand. On the base of one finger, in very small and very familiar writing, is Monkey’s title.',
      ),
      MK('That’s… that can’t… I went…', 'shock'),
    ],
    [
      ask(
        1,
        'science',
        'evidence tests a claim',
        null,
        [
          N(
            'Monkey claims he flew to the end of the world, but the writing on the finger is evidence. What does evidence do?',
          ),
        ],
        [
          opt(
            'It shows whether a claim is true',
            [
              N(
                'Yes. Careful thinkers check a claim against the evidence, even when the claim is their own.',
              ),
            ],
            true,
          ),
          opt('It proves the loudest person is right', [
            N('Shouting does not change the writing on the finger.'),
            N('Evidence shows what really happened, whoever is loudest.'),
          ]),
        ],
        'Your child learned that evidence is used to test a claim.',
      ),
    ],
  ),
  scene(
    'a02-05-mountain',
    [
      N(
        'The Buddha turns his hand over. It comes down gently and becomes a mountain with five peaks.',
      ),
      N(
        'Monkey is underneath, with only his head and one hand sticking out. He is not hurt, only, for the first time, stopped.',
      ),
      BU(
        'Feed him when he is hungry. Give him water when he is thirsty. When he has learned enough, someone will come.',
        'soft',
      ),
      MK('How long?', 'sad'),
      BU('As long as it takes. Not one day more.'),
      N(
        'Your Nubbin climbs down and sits by Monkey’s free hand. Monkey holds on to one of its feet and says nothing at all.',
      ),
    ],
    [
      notice(
        0,
        'social-studies',
        'the five elements in Chinese thought',
        'D2.His.2.K-2',
        [
          N(
            'In traditional Chinese thought, the world moves through five elements, or phases: wood, fire, earth, metal and water.',
          ),
          N('Five peaks for five elements: the mountain’s name is chosen with care.'),
        ],
        'Your child heard about the five elements in Chinese tradition.',
      ),
      notice(
        4,
        'science',
        'Earth changes quickly and slowly',
        '2-ESS1-1',
        [
          N(
            'Some changes to the Earth are fast, like a rockfall. Others are very slow, like a river carving out a valley.',
          ),
          N(
            'Monkey’s mountain will sit there for five hundred years, slowly gathering grass and moss.',
          ),
        ],
        'Your child learned that Earth changes both quickly and slowly.',
      ),
    ],
  ),
  scene(
    'a02-05-complete',
    [
      N(
        'Heaven holds a feast to thank the Buddha. The Queen Mother of the West brings him a dish of her peaches.',
      ),
      N('She looks at your Nubbin, who is trying very hard not to look at the peaches.'),
      QM(
        'You stood by my trees and took nothing. Here. This one is given, not taken. That makes it a different fruit.',
        'soft',
      ),
      N('Your Nubbin eats it slowly, with its eyes shut, and glows all over like a paper lantern.'),
      QM('Keep the stone. Plant it somewhere you will be glad to see it.'),
      N(
        'Then the page turns, and turns, and turns. Five hundred years go by, and you sit through all of them with Monkey.',
      ),
      N(
        'Grass grows in his ears, and moss on his hand. Your Nubbin keeps one foot in that hand the whole time.',
      ),
    ],
    [
      notice(
        4,
        'social-studies',
        'peaches really come from China',
        'D2.Geo.2.K-2',
        [
          N(
            'Peaches really do come from China, where people have grown them for thousands of years. That is why they are so much a part of its stories.',
          ),
        ],
        'Your child heard that peaches originated in China.',
      ),
      ask(
        5,
        'maths',
        'divide time: 500 years in centuries',
        '3.OA.A.3',
        [N('A century is 100 years. How many centuries is five hundred years?')],
        [
          opt(
            '5 centuries',
            [N('Yes. 500 ÷ 100 = 5. Five hundred years is five centuries.')],
            true,
          ),
          opt('50 centuries', [
            N('That would be 5,000 years. One century is 100 years, so 500 is five of them.'),
          ]),
        ],
        'Your child converted 500 years into 5 centuries.',
      ),
    ],
  ),
];

// ================================================================== A2-6 The Monk
const Q06_SCENES: EduScene[] = [
  scene(
    'a02-06-road',
    [
      N(
        'A monk comes along the road on a pale horse. He has a begging bowl, a staff, a robe, and far too much luggage.',
      ),
      MO(
        'Good morning. Forgive me. Is this still the road west? Everyone who was walking with me has gone home.',
      ),
      MO(
        'I am Tang Sanzang. The emperor sent me to India, to bring back the true scriptures. It is a long way.',
        'think',
      ),
      N(
        'He says “a long way” the way people say it about the bottom of the garden. He has no idea.',
      ),
      MO(
        'You are carrying nothing, and I am carrying everything. Would you think it rude if I asked?',
      ),
      N(
        'You take the luggage. It weighs about as much as your Nubbin, which climbs on top of it to make it heavier.',
      ),
      MO(
        'Thank you. Then you are my first disciple. No, my second. I keep forgetting the horse.',
        'happy',
      ),
    ],
    [
      notice(
        2,
        'social-studies',
        'the real monk Xuanzang',
        'D2.His.2.K-2',
        [
          N('The monk in the novel is based on a real man, Xuanzang, who lived in the 600s.'),
          N(
            'He left China in 629 and came home in 645, bringing back hundreds of Buddhist texts. He was away for sixteen years, many of them spent studying in India.',
          ),
        ],
        'Your child heard about the real traveller behind the story’s monk.',
      ),
      ask(
        4,
        'science',
        'shadows and the morning sun',
        '5-ESS1-2',
        [
          N(
            'The monk walks west in the morning, and the sun rises in the east. Which way do his shadows fall?',
          ),
        ],
        [
          opt(
            'Ahead of him, to the west',
            [
              N(
                'Yes. The sun is behind him, so his shadow stretches out in front, away from the sun.',
              ),
            ],
            true,
          ),
          opt('Behind him, to the east', [
            N('The sun is behind him, in the east. A shadow always points away from the light.'),
            N('So it falls ahead of him, to the west.'),
          ]),
        ],
        'Your child worked out which way a morning shadow falls.',
      ),
    ],
  ),
  scene(
    'a02-06-road-done',
    [
      N('From the mountain ahead, a voice you know shouts loud enough to shake the leaves.'),
      N('It sounds like someone who has been shouting at nobody for five hundred years.'),
    ],
    [
      ask(
        0,
        'literacy',
        'using clues to infer',
        'RL.3.3',
        [N('The narrator says it is “a voice you know”. Whose voice do you think it is?')],
        [
          opt(
            'Monkey’s, from under the mountain',
            [N('Yes. Who else shouts that loudly? The clue is “a voice you know”.')],
            true,
          ),
          opt('The monk’s', [
            N('The monk is right beside you, on the road.'),
            N('A voice from the mountain you know already: it must be Monkey.'),
          ]),
        ],
        'Your child used a clue in the text to work out who was speaking.',
      ),
    ],
  ),
  scene(
    'a02-06-seal',
    [
      MK(
        'Master! Master! You’ve come! A lady told me to wait for a monk, and I waited, and you’re a monk!',
        'happy',
      ),
      N(
        'Monkey’s head sticks out of the mountainside, with grass in his ears. He sees your Nubbin and nearly cries.',
      ),
      MK('Cousin. Cousin, you’re still here.', 'soft'),
      MO('Oh dear. Are you a demon?', 'shock'),
      MK(
        'I’m your disciple. I’ve been your disciple for five hundred years. Go up and peel the paper off the top. Please.',
      ),
      N('The monk climbs. You hold his staff and push when he slips, which is often.'),
      N(
        'At the top there is a strip of gold paper. He peels it away, very carefully, as if it might mind.',
      ),
    ],
    [
      ask(
        5,
        'science',
        'pushes and pulls: gravity',
        '3-PS2-1',
        [
          N(
            'When the monk slips, you push him up the slope. Which invisible force is pulling him down?',
          ),
        ],
        [
          opt(
            'Gravity',
            [
              N(
                'Yes. Gravity pulls everything towards the ground. Your push has to be bigger than the pull to help him up.',
              ),
            ],
            true,
          ),
          opt('Wind', [
            N('Wind might push a little, but the steady pull down the slope is gravity.'),
            N('Your push works against gravity.'),
          ]),
        ],
        'Your child named gravity as a force that pulls things down a slope.',
      ),
    ],
  ),
  scene(
    'a02-06-seal-done',
    [
      N(
        'The mountain splits like bread. Monkey bounds out, bows four times to the monk, and hugs your Nubbin off its feet.',
      ),
      MK('Right! Where are we going? India? Easy. I’ll have us there by lunch.', 'happy'),
    ],
    [
      ask(
        0,
        'literacy',
        'a feeling after a long wait',
        'RL.3.3',
        [
          N(
            'Monkey has waited five hundred years, and now he is free. Which pair of words best fits how he feels?',
          ),
        ],
        [
          opt(
            'Relieved and thankful',
            [
              N(
                'Yes. Relief is the feeling when a long worry ends, and he shows thanks with his four bows.',
              ),
            ],
            true,
          ),
          opt('Bored and sleepy', [
            N('He is bouncing, hugging and bowing. That is energy and gladness.'),
            N('Relieved and thankful fits best.'),
          ]),
        ],
        'Your child named a feeling from a character’s actions.',
      ),
    ],
  ),
  scene(
    'a02-06-band',
    [
      N(
        'Six robbers jump out of the trees. Monkey chases them over three hills with his staff, roaring, until there are no robbers anywhere.',
      ),
      MO(
        'You frightened them half to death! A monk must not frighten people half to death.',
        'angry',
      ),
      MK('Five hundred years under a mountain, and this is the thanks?', 'angry'),
      N('He somersaults off in a huff, and the road is suddenly very empty.'),
      N(
        'An old woman comes along. She gives the monk a cap with a thin gold band, and teaches him a few quiet words.',
      ),
      N(
        'As she goes, she looks back at you. Her eyes are very kind and very old, and you are almost sure she isn’t an old woman.',
      ),
      N('When Monkey comes back, a little sheepish, he sees the cap and puts it straight on.'),
      MK('Very fine. Does it suit me?', 'happy'),
      N(
        'The monk murmurs the quiet words. The band tightens, and Monkey goes hopping round the road, holding his head.',
      ),
    ],
    [
      ask(
        8,
        'sel',
        'is the band fair? (a think question)',
        'CASEL: Responsible decision-making',
        [
          N('The band lets the monk control Monkey from a distance. Is that fair, kind or useful?'),
          N('There is no single right answer. Think about it, then choose.'),
        ],
        [
          opt('Not fair: nobody should be forced', [
            N(
              'That is a fair answer. Monkey never agreed to it, and the monk says he never knew it was so strong.',
            ),
          ]),
          opt('Useful: it keeps others safe', [
            N(
              'That is a fair answer. Monkey’s strength is huge, and some limit may protect people, though it matters who decides.',
            ),
          ]),
          opt('Only fair if Monkey agrees and it is used rarely', [
            N(
              'That is a fair answer, and it is just what the monk promises: to use it only when he must.',
            ),
          ]),
        ],
        'Your child weighed up fairness, safety and consent.',
      ),
    ],
    [
      {
        id: 'stop',
        label: 'Ask the monk to stop.',
        then: [
          MO('Oh! Yes. Of course. I had no idea it would be so strong.', 'shock'),
          MO('I will only use it when I must. I promise you both.'),
        ],
      },
      {
        id: 'wait',
        label: 'Wait. He’s stopping already.',
        then: [
          N(
            'The monk stops almost at once, looking as shaken as Monkey. He clearly had no idea it would be so strong.',
          ),
        ],
      },
    ],
  ),
  scene(
    'a02-06-complete',
    [
      N('Monkey tugs at the band. It won’t come off, and as far as anyone knows, it never will.'),
      MK('Fine. I’ll behave. Mostly. Some of the time.', 'sad'),
      MO('That is all anyone can promise.', 'soft'),
      N(
        'You pick up the luggage, and your Nubbin climbs onto it. The four of you, and the horse, set off west.',
      ),
      N('The road ahead is long and dusty, and for the first time it has company on it.'),
      N(
        'Somewhere in the distance, the old woman’s kind eyes are watching, and she is almost smiling.',
      ),
    ],
    [
      ask(
        2,
        'literacy',
        'theme: learning to live with others',
        'RL.4.2',
        [N('What is this quest mostly about? Choose the best statement of its theme.')],
        [
          opt(
            'Even strong, clever people have to learn to live with others',
            [
              N(
                'Yes, that is the theme: Monkey’s strength is not the problem, and living well with friends is the lesson.',
              ),
            ],
            true,
          ),
          opt('You should always wear a cap', [
            N('The cap matters in the plot, but it is not the big idea.'),
            N('The theme is about learning to live with others.'),
          ]),
        ],
        'Your child identified the theme of a story section.',
      ),
    ],
  ),
];

// ================================================================== A2-7 The White Dragon Horse
const Q07_SCENES: EduScene[] = [
  scene(
    'a02-07-stream',
    [
      N(
        'Eagle Grief Stream runs fast and green between steep rocks. The horse doesn’t like it, and neither does your Nubbin.',
      ),
      N(
        'Out of the water comes a white dragon, all teeth and spray. It swoops the horse up, saddle and all, and is gone.',
      ),
      MO('My horse! How will I ever cross the world now?', 'sad'),
      MK('I’ll get it back. Wait there.', 'angry'),
      N(
        'Monkey fights the dragon up and down the stream. Every time he gets close, it dives where he can’t follow.',
      ),
      MK('It won’t come out. Water is cheating.', 'angry'),
      N(
        'Your Nubbin, who likes water a great deal, peers down into the stream and sees a long white shape, sulking.',
      ),
    ],
    [
      ask(
        0,
        'science',
        'erosion by fast water',
        '4-ESS2-1',
        [
          N(
            'The rocks beside the stream are steep and smooth, because fast water carries sand that scrapes them. What is this slow wearing-away called?',
          ),
        ],
        [
          opt(
            'Erosion',
            [
              N(
                'Yes. Erosion is when water, wind or ice carries away bits of rock and soil, little by little.',
              ),
            ],
            true,
          ),
          opt('Evaporation', [
            N('Evaporation is water turning into vapour.'),
            N('Wearing away of rock is erosion.'),
          ]),
        ],
        'Your child named erosion as the wearing away of rock by moving water.',
      ),
    ],
  ),
  scene(
    'a02-07-stream-done',
    [
      MK('The local spirits say a lady put that dragon here. I know which lady. I’m fetching her.'),
      N('He is gone in a streak of cloud, muttering about people who give out headbands.'),
    ],
    [
      ask(
        1,
        'literacy',
        'using clues to infer',
        'RL.3.3',
        [N('Monkey mutters about “people who give out headbands”. Which character does he mean?')],
        [
          opt(
            'The old woman on the road, who gave the cap',
            [
              N(
                'Yes. She gave the monk the cap with the band. Clues in the text let us work it out.',
              ),
            ],
            true,
          ),
          opt('The Buddha', [
            N('The Buddha put him under the mountain, but the old woman gave the band.'),
            N('That points to the old woman with the cap.'),
          ]),
        ],
        'Your child used clues to work out who a character meant.',
      ),
    ],
  ),
  scene(
    'a02-07-guanyin',
    [
      N(
        'A light comes over the water like morning, though it is already afternoon. In it stands a lady with a vase and a willow branch.',
      ),
      N('You know her eyes. She was the old woman on the road.'),
      MK('You gave him the band! You told him the words!', 'angry'),
      GY(
        'I did. Without it, you would not listen to him. Without him, you would never get there.',
        'soft',
      ),
      GY(
        'You are cleverer than all of them, Monkey. That is exactly why you need someone to walk beside.',
      ),
      N(
        'Monkey has no answer. Your Nubbin offers Guanyin a pebble, which is its highest honour, and she takes it.',
      ),
    ],
    [
      notice(
        0,
        'social-studies',
        'Guanyin in Chinese Buddhism',
        'D2.His.2.K-2',
        [
          N('Guanyin is the bodhisattva of compassion in Chinese Buddhism.'),
          N(
            'She is often shown with a willow branch and a vase of pure water. Many people pray to her for kindness and help.',
          ),
        ],
        'Your child learned who Guanyin is in Chinese Buddhism.',
      ),
      ask(
        4,
        'sel',
        'do clever people need others? (a think question)',
        'CASEL: Relationship skills',
        [
          N(
            'Guanyin says Monkey needs someone to walk beside because he is clever. Do very clever people need others?',
          ),
          N('There is no single right answer. Think about it, then choose.'),
        ],
        [
          opt('Yes, nobody sees everything', [
            N('That is a fair answer. A friend sees what a clever mind misses.'),
          ]),
          opt('Not always, but it helps', [
            N('That is a fair answer. Cleverness can do a lot, and company makes it wiser.'),
          ]),
        ],
        'Your child reflected on why even clever people need companions.',
      ),
    ],
  ),
  scene(
    'a02-07-dragon',
    [
      GY(
        'Prince Yulong. Come up. The monk you were told to wait for is standing on your bank.',
        'soft',
      ),
      N('The white dragon rises from the stream, dripping and ashamed of itself.'),
      DR('I didn’t know who he was. I was hungry, and cross, and sorry for myself.', 'sad'),
      GY('Then be something better. Carry him all the way, and you will be forgiven all the way.'),
      N(
        'She touches his head with the willow branch. He shrinks and changes, and a white horse stands on the bank.',
      ),
      N('The horse shakes the water out of his mane, straight over your Nubbin.'),
    ],
    [
      ask(
        2,
        'literacy',
        'a feeling word: ashamed',
        'RL.3.3',
        [N('The dragon rises “dripping and ashamed of itself”. What does ashamed mean here?')],
        [
          opt(
            'Feeling bad about something wrong you did',
            [
              N(
                'Yes. He knows taking the horse was wrong, and he feels it. Guanyin gives him a way to put it right.',
              ),
            ],
            true,
          ),
          opt('Proud of a clever trick', [
            N('Proud is nearly the opposite.'),
            N('He hangs his head because he knows he did wrong.'),
          ]),
        ],
        'Your child worked out the meaning of a feeling word from context.',
      ),
      ask(
        4,
        'maths',
        'ordinal numbers: Dragon is fifth, Horse is seventh',
        '1.OA.A.1',
        [
          N(
            'In the zodiac, Dragon is fifth and Horse is seventh. How many animals come between them?',
          ),
        ],
        [
          opt(
            'One: the Snake, sixth',
            [N('Yes. Fifth, sixth, seventh: only the Snake sits in between.')],
            true,
          ),
          opt('Two', [N('Count the places between: sixth only.'), N('7 − 5 − 1 = 1.')]),
        ],
        'Your child used ordinal numbers and subtraction with the zodiac animals.',
      ),
    ],
    [
      {
        id: 'peach',
        label: 'Let your Nubbin give the horse its peach stone to sniff.',
        then: [
          N(
            'The horse sniffs the stone and blows softly. Your Nubbin takes this as the start of a long friendship.',
          ),
        ],
      },
      {
        id: 'stroke',
        label: 'Stroke his nose.',
        then: [N('He lets you. His nose is cool, like the inside of a river.')],
      },
    ],
  ),
  scene(
    'a02-07-complete',
    [
      N(
        'Guanyin gives Monkey three hairs from the willow branch, for the day he truly needs them. Then the light goes off the water.',
      ),
      MO('A dragon. I am riding a dragon. Nobody at home will believe me.', 'happy'),
      MK('They won’t believe the rest of it either. Get used to it.'),
      N('The white horse doesn’t speak again. He carries the monk with great care, all the way.'),
      N(
        'The stream behind you goes back to being only a stream, green and quick between its rocks.',
      ),
      N(
        'The monk pats the white horse’s neck, and the horse flicks one ear, which is as good as a reply.',
      ),
    ],
    [
      ask(
        1,
        'social-studies',
        'a repeating pattern: 12-year zodiac cycle',
        '4.OA.C.5',
        [
          N(
            'The zodiac repeats every twelve years. If this year is a Dragon year, how many years until the next Dragon year?',
          ),
        ],
        [
          opt(
            '12 years',
            [
              N(
                'Yes. The pattern repeats every twelve years, so the next Dragon year is 12 years later.',
              ),
            ],
            true,
          ),
          opt('5 years', [
            N('Dragon is fifth in the list, but the cycle has twelve animals.'),
            N('It takes the full twelve years to come back to Dragon.'),
          ]),
        ],
        'Your child used a repeating pattern of 12 to predict a future year.',
      ),
    ],
  ),
];

// ================================================================== A2-8 The Stolen Robe
const Q08_SCENES: EduScene[] = [
  scene(
    'a02-08-hall',
    [
      N(
        'The monastery is rich and the abbot is very old. He has collected fine robes for two hundred years and shows you every one.',
      ),
      AB('Seven hundred robes! Has anyone, anywhere, ever seen more?', 'happy'),
      MK('My master has one better than all of them. Show him, master.'),
      MO('Please, no. One should never show off to a collector.', 'think'),
      N(
        'Monkey shows it anyway. It is the robe the Buddha himself sent with the monk, and the whole hall fills with light.',
      ),
      AB(
        'Oh. Oh my. May I borrow it, just for tonight? Only to look at. An old man’s eyes are slow.',
        'soft',
      ),
      N(
        'The monk sighs, and says yes. The abbot looks at the robe the way your Nubbin looks at peaches, only worse.',
      ),
    ],
    [
      ask(
        1,
        'maths',
        'divide: 700 robes on 7 shelves',
        '3.OA.A.3',
        [
          N(
            'Suppose the abbot keeps his 700 robes on seven shelves, the same number on each. How many robes are on a shelf?',
          ),
        ],
        [
          opt(
            '100',
            [N('Yes. 700 ÷ 7 = 100. Seven hundreds shared by seven is one hundred each.')],
            true,
          ),
          opt('70', [N('Seventy times seven is only 490.'), N('Try 100 × 7 = 700.')]),
        ],
        'Your child divided 700 by 7.',
      ),
      ask(
        6,
        'sel',
        'when does wanting turn into taking? (a think question)',
        'CASEL: Responsible decision-making',
        [
          N(
            'The abbot already has seven hundred robes and still wants one more. When does wanting something turn into a problem?',
          ),
          N('There is no single right answer. Think about it, then choose.'),
        ],
        [
          opt('When we stop caring about the other person', [
            N('That is a fair answer. The monk’s robe is not the abbot’s to take.'),
          ]),
          opt('When having more never feels like enough', [
            N('That is a fair answer. Wanting that never ends can hide what we already have.'),
          ]),
        ],
        'Your child thought about greed and what it costs.',
      ),
    ],
  ),
  scene(
    'a02-08-fire',
    [
      N(
        'In the night your Nubbin wakes you by sitting on your face. There is smoke under the door.',
      ),
      N(
        'The abbot’s monks have piled firewood round the guest hall. They mean to keep the robe and blame the fire.',
      ),
      N(
        'Monkey is already awake. He has borrowed a fireproof cover from Heaven and spread it over the monk, who is still asleep.',
      ),
      MK('And now a little wind. Let’s see whose hall burns.', 'angry'),
      N('He blows, and the fire turns round and goes the other way, away from the guest hall.'),
      N(
        'Your Nubbin is already at the door, pulling your sleeve towards the dormitory where the young monks sleep.',
      ),
    ],
    [
      ask(
        1,
        'health',
        'what to do if there is smoke',
        null,
        [N('There is smoke under the door. What is the safest thing to do?')],
        [
          opt(
            'Stay low, get out, and warn others',
            [
              N(
                'Yes. Smoke rises, so the air is clearest near the floor. Leave, and tell everyone.',
              ),
            ],
            true,
          ),
          opt('Hide in a cupboard', [
            N('Hiding can trap you. Smoke and flames find hiding places.'),
            N('Stay low, get out and warn others.'),
          ]),
        ],
        'Your child learned to stay low, leave and warn others if there is smoke.',
      ),
      ask(
        4,
        'science',
        'what a fire needs',
        '4-PS3-2',
        [N('Fire needs three things to keep burning. Which set is right?')],
        [
          opt(
            'Heat, fuel and air',
            [
              N(
                'Yes: take away any one and the fire goes out. Monkey’s wind pushes the fire towards new fuel instead.',
              ),
            ],
            true,
          ),
          opt('Water, wood and wind', [
            N('Water puts fires out. Wood is a fuel, and wind gives air.'),
            N('A fire needs heat, fuel and air.'),
          ]),
        ],
        'Your child named the three things a fire needs.',
      ),
    ],
    [
      {
        id: 'shout',
        label: 'Run and shout until every monk is out.',
        then: [
          N(
            'You run through the cloisters shouting. Monks tumble out of doorways in their nightclothes, coughing, all safe.',
          ),
          MK('You’re rescuing them? They lit it!', 'shock'),
          N('Monkey grumbles. Then he blows the fire away from the dormitory, just slightly.'),
        ],
      },
      {
        id: 'wake',
        label: 'Wake the monk. He would want to know.',
        then: [
          MO('Fire? Then everyone out. Everyone, Wukong. I don’t care who started it.', 'shock'),
          N('Monkey groans, and blows the fire away from the dormitory.'),
        ],
      },
    ],
  ),
  scene(
    'a02-08-fire-done',
    [
      N(
        'On the hill above, something large and black has come down to “help” with the fire. It finds the robe instead.',
      ),
      N(
        'By morning the robe is gone, and so is the black shape, and the abbot is nowhere to be seen.',
      ),
    ],
    [
      ask(
        0,
        'literacy',
        'quotation marks that hint at doubt',
        'RL.3.3',
        [N('The narrator puts “help” in quotation marks. What does that hint?')],
        [
          opt(
            'The black shape is not really helping',
            [
              N(
                'Yes. The marks tell us the word is doubtful. The black shape has come for the robe.',
              ),
            ],
            true,
          ),
          opt('Someone said it out loud', [
            N('Quotation marks do show speech, but nobody spoke here.'),
            N('Here they hint that the “help” is not honest.'),
          ]),
        ],
        'Your child read meaning into quotation marks used as a hint.',
      ),
    ],
  ),
  scene(
    'a02-08-bear',
    [
      N(
        'On Black Wind Mountain, the Black Bear is planning a party called the Feast of the Buddha’s Robe. He is very pleased with the name.',
      ),
      N(
        'Guanyin has come. She takes the shape of the Bear’s friend, a guest on his way to the feast.',
      ),
      N(
        'Monkey turns himself into a pill, a little round red one. You carry it up the mountain on a dish.',
      ),
      BR('A gift from my old friend! How kind. I’ll take it straight away.', 'happy'),
      N(
        'He swallows it. There is a short silence, and then a great deal of somersaulting inside the Bear.',
      ),
      BR('Ow. Ow! All right! The robe! Take the robe!', 'shock'),
    ],
    [
      ask(
        5,
        'sel',
        'is trickery fair? (a think question)',
        'CASEL: Responsible decision-making',
        [
          N(
            'The Bear stole the robe, and Monkey tricked him to get it back. Is it fair to use a trick against someone who stole?',
          ),
          N('There is no single right answer. Think about it, then choose.'),
        ],
        [
          opt('Yes, he started it', [
            N('That is a fair answer. Many people feel a thief has little right to complain.'),
          ]),
          opt('No, two wrongs don’t make a right', [
            N('That is a fair answer. Guanyin was there to see the end of it fairly.'),
          ]),
          opt('It depends how much harm the trick does', [
            N('That is a fair answer. A harmless trick is easier to defend than a harmful one.'),
          ]),
        ],
        'Your child weighed whether a trick is fair against someone who stole.',
      ),
    ],
    [
      {
        id: 'sorry',
        label: 'Tell the Bear you’re sorry about his tummy.',
        then: [BR('So am I. You’re the only one who has said so.', 'sad')],
      },
      {
        id: 'robe',
        label: 'Hold out your arms for the robe.',
        then: [
          N(
            'The robe comes back into your arms, warm and faintly smoky. Your Nubbin smooths it flat, very seriously.',
          ),
        ],
      },
    ],
  ),
  scene(
    'a02-08-complete',
    [
      N('Monkey pops out of the Bear’s mouth, very pleased with himself. The Bear sits down hard.'),
      GY(
        'You have a strong arm and a greedy heart. Come and guard my mountain. It will use the one and quiet the other.',
        'soft',
      ),
      BR('Yes. All right. Thank you. I think.', 'sad'),
      N(
        'Back at the monastery the monks sweep up very quietly. The monk gives them the last of his rice, which surprises them most of all.',
      ),
      N('Black Wind Mountain is quiet at last, and a little smoky, and smells faintly of pine.'),
      N('Your Nubbin folds the robe into a square so neat that even the monk is impressed.'),
    ],
    [
      ask(
        1,
        'literacy',
        'what words refer back to',
        'RL.3.3',
        [
          N(
            'Guanyin says guarding her mountain will “use the one and quiet the other”. What are “the one” and “the other”?',
          ),
        ],
        [
          opt(
            'His strong arm and his greedy heart',
            [
              N(
                'Yes. Guarding uses his strength and gives his greed less room, so a job may help him change.',
              ),
            ],
            true,
          ),
          opt('The robe and the feast', [
            N('Read back to what she has just said: a strong arm and a greedy heart.'),
            N('His strength gets used, and his greed gets quieter.'),
          ]),
        ],
        'Your child read back in the text to find what two phrases refer to.',
      ),
    ],
  ),
];

// ================================================================== A2-9 Pigsy
const Q09_SCENES: EduScene[] = [
  scene(
    'a02-09-gao',
    [
      GA(
        'He came three years ago. A fine strong young man. He ploughed without an ox, and dug without a spade.',
        'sad',
      ),
      GA(
        'Then his face started to change. Now he has big ears and a long snout, and eats a whole barn a week.',
      ),
      GA(
        'And he’s shut my daughter in the back house and won’t let anyone see her. Can you send him away?',
      ),
      MK('A monster with big ears who eats a lot? I’ll sort it. I’ll need a dress.', 'happy'),
      MO('A what?', 'shock'),
      MK('A dress. Trust me.'),
    ],
    [
      ask(
        1,
        'science',
        'how a snout helps a pig',
        '4-LS1-1',
        [N('Pigs have long snouts. How does a snout help a pig survive?')],
        [
          opt(
            'It roots in the soil for food and has a strong sense of smell',
            [
              N(
                'Yes. A pig’s snout is strong and sensitive, perfect for digging up roots and finding food.',
              ),
            ],
            true,
          ),
          opt('It helps the pig fly', [
            N('Pigs cannot fly, but their snouts are very useful on the ground.'),
            N('Digging up food and sniffing it out is what it is for.'),
          ]),
        ],
        'Your child learned how a pig’s snout helps it find food.',
      ),
    ],
  ),
  scene(
    'a02-09-backhouse',
    [
      N(
        'Miss Gao goes safely home to her father. In her bed, in her nightcap, lies Monkey, looking deeply unconvincing.',
      ),
      N(
        'You and your Nubbin hide behind a screen. Your Nubbin has its paws over its mouth, just in case.',
      ),
      N(
        'A wind blows the door open. In comes a big, round, black-bristled fellow with a snout, carrying flowers.',
      ),
      PG(
        'I brought you some flowers. I picked them myself, mostly. Why are you so hairy tonight, my dear?',
        'soft',
      ),
      MK('I’m not well. My father says he’ll fetch a holy man to chase you off.', 'sad'),
      PG(
        'Ha! Let him. Nobody can catch me. Unless it’s that stone monkey who caused all that havoc in Heaven.',
      ),
      MK('Funny you should say that.', 'happy'),
      N(
        'Monkey sits up and pulls off the nightcap. The son-in-law gives a squeal and is out of the window in a gust of wind.',
      ),
    ],
    [
      ask(
        6,
        'literacy',
        'dramatic irony: you know more than the character',
        'RL.3.6',
        [
          N(
            'You know it is Monkey in the bed, but Pigsy doesn’t. How does that make the scene funnier?',
          ),
        ],
        [
          opt(
            'We know more than Pigsy, so we wait for him to find out',
            [
              N(
                'Yes. When the reader knows something a character does not, we watch and wait. That is called dramatic irony.',
              ),
            ],
            true,
          ),
          opt('It makes the scene sadder', [
            N('This one is comic. Waiting for him to find out is part of the fun.'),
            N('We know more than Pigsy does.'),
          ]),
        ],
        'Your child explained how knowing more than a character adds humour.',
      ),
    ],
  ),
  scene(
    'a02-09-backhouse-done',
    [
      N('Your Nubbin picks up the dropped flowers and keeps them. Somebody ought to.'),
      N(
        'It sniffs them, and a fat bee, which has followed them all the way from the garden, sniffs them too.',
      ),
    ],
    [
      notice(
        1,
        'science',
        'flowers and pollinators',
        '2-LS2-2',
        [
          N('Bees visit flowers for nectar, and pollen sticks to their bodies on the way.'),
          N(
            'They carry it to the next flower. That is pollination, and it helps plants make seeds and fruit.',
          ),
        ],
        'Your child learned how bees pollinate flowers.',
      ),
    ],
  ),
  scene(
    'a02-09-cave',
    [
      N(
        'Monkey and the son-in-law fight all night outside his cave, staff against nine-toothed rake.',
      ),
      PG('Who are you, anyway? What are you doing here?', 'angry'),
      MK(
        'Escorting a monk from the East to fetch the scriptures. Tang Sanzang. You won’t have heard of him.',
      ),
      N('The rake drops. The pig-faced fellow goes pink all over.'),
      PG(
        'Tang Sanzang? The lady told me to wait for him! I’ve been waiting! I just got hungry while I waited.',
        'shock',
      ),
      PG(
        'I used to be a marshal in Heaven, you know. I got a bit too merry at a party. Long story.',
        'sad',
      ),
    ],
    [
      ask(
        5,
        'sel',
        'lazy, greedy and lovable (a think question)',
        'CASEL: Social awareness',
        [
          N(
            'Pigsy is lazy and greedy, and he is also warm and funny. Can one person be all of those at once?',
          ),
          N('There is no single right answer. Think about it, then choose.'),
        ],
        [
          opt('Yes, people are mixed', [
            N(
              'That is a fair answer. Most people are a bit of everything, and that is what makes friendship interesting.',
            ),
          ]),
          opt('Only if the good outweighs the bad', [
            N('That is a fair answer. We often weigh a friend’s faults against how kind they are.'),
          ]),
        ],
        'Your child reflected on how a person can have both faults and virtues.',
      ),
    ],
    [
      {
        id: 'flowers',
        label: 'Let your Nubbin give him back his flowers.',
        then: [
          PG('You kept them! Oh, you’re a good little thing. I’m going to like you.', 'happy'),
        ],
      },
      {
        id: 'welcome',
        label: 'Tell him there’s room on the road.',
        then: [PG('Is there room for lunch on the road? That’s the main thing.', 'happy')],
      },
    ],
  ),
  scene(
    'a02-09-complete',
    [
      N(
        'He burns his cave down to show he means it, and walks back to Gao Village with his rake over his shoulder.',
      ),
      MO(
        'You shall be called Bajie. It means Eight Rules. They are mostly about not eating.',
        'soft',
      ),
      PG('Pigsy for short. Everyone does.'),
      PG(
        'Father-in-law, keep my room for me, will you? Just in case the scriptures don’t work out.',
      ),
      N(
        'Old Gao says nothing, very politely. Pigsy takes the luggage pole for a whole mile before giving it back to you.',
      ),
      N('The road west lies ahead, and Pigsy has already found a reason to stop for a snack.'),
    ],
    [
      ask(
        3,
        'social-studies',
        'the zodiac order: the Pig comes last',
        'D2.His.2.K-2',
        [
          N(
            'Pigsy is a pig, the twelfth and last animal in the zodiac. Which animal comes just before the Pig?',
          ),
        ],
        [
          opt(
            'The Dog',
            [N('Yes. Rooster, Dog, Pig: the Dog is eleventh, just before the Pig.')],
            true,
          ),
          opt('The Monkey', [
            N('Monkey is ninth. After him come the Rooster and the Dog.'),
            N('So the Dog comes just before the Pig.'),
          ]),
        ],
        'Your child used the order of the zodiac animals.',
      ),
    ],
  ),
];

// ================================================================== A2-10 Sandy
const Q10_SCENES: EduScene[] = [
  scene(
    'a02-10-river',
    [
      N(
        'The River of Flowing Sands is eight hundred li wide and the colour of weak tea. A stone on the bank says that not even a feather floats on it.',
      ),
      N('Your Nubbin drops a feather in, to check. It sinks.'),
      PG('Well, that’s that. Back to Gao Village, everyone.', 'happy'),
      N(
        'Out of the water, with a roar, comes a big blue-faced river spirit with a monk’s spade. He reaches for the monk.',
      ),
      N(
        'Monkey knocks him back, and Pigsy dives in after him. They splash and bellow and come up spitting sand.',
      ),
      MK('I can’t fight in water. Pigsy can, but Pigsy keeps stopping for a rest.', 'angry'),
    ],
    [
      ask(
        0,
        'maths',
        'convert li to kilometres',
        '4.MD.A.2',
        [N('A li is about half a kilometre. How wide is a river that is 800 li across?')],
        [
          opt(
            '400 kilometres',
            [
              N(
                'Yes. Half of 800 is 400, so the river is about 400 kilometres wide, wider than any real river.',
              ),
            ],
            true,
          ),
          opt('1,600 kilometres', [
            N('That doubles it. A li is half a kilometre, so halve it.'),
            N('800 ÷ 2 = 400.'),
          ]),
        ],
        'Your child converted 800 li to about 400 kilometres.',
      ),
      ask(
        1,
        'science',
        'what makes things sink or float',
        '2-PS1-1',
        [
          N(
            'A feather would float on any ordinary river, yet a small stone sinks. What does it depend on?',
          ),
        ],
        [
          opt(
            'How heavy it is for its size',
            [
              N(
                'Yes: things that are heavy for their size sink, and things light for their size float. This magic river sinks even a feather.',
              ),
            ],
            true,
          ),
          opt('Only the colour', [
            N('Colour does not matter.'),
            N('It depends on how heavy something is for its size.'),
          ]),
        ],
        'Your child learned that sinking and floating depend on weight for size.',
      ),
    ],
  ),
  scene(
    'a02-10-under',
    [
      N('Your Nubbin slips into the river without a splash. You hold your breath and follow it.'),
      N(
        'Down in the brown water, the river spirit is sitting on a rock by himself, with his chin on his spade.',
      ),
      N(
        'He is not frightening down here. He looks like someone who has been waiting a very long time for a ferry.',
      ),
      SD(
        'Another one. Every traveller who comes to this river wants to fight me, or run away.',
        'sad',
      ),
      SD(
        'I used to lift the curtains in Heaven. I broke a crystal cup. One cup. They sent me here.',
      ),
      N(
        'Your Nubbin pats his knee. He looks at it with great surprise, and then, slowly, pats it back.',
      ),
    ],
    [
      ask(
        2,
        'literacy',
        'a simile',
        'L.4.5',
        [
          N(
            '“He looks like someone who has been waiting a very long time for a ferry.” What does this comparison tell us?',
          ),
        ],
        [
          opt(
            'He seems patient, sad and used to being alone',
            [N('Yes. A simile uses a picture we know to show a feeling.')],
            true,
          ),
          opt('He is about to catch a ferry', [
            N('The ferry is only a picture to compare. It is not a plan.'),
            N('It shows he has been waiting, and lonely.'),
          ]),
        ],
        'Your child read the feeling in a simile.',
      ),
      ask(
        4,
        'sel',
        'is the punishment fair? (a think question)',
        'CASEL: Social awareness',
        [
          N('Sandy lost his home in Heaven for breaking a single cup. Is that fair?'),
          N('There is no single right answer. Think about it, then choose.'),
        ],
        [
          opt('No, the punishment is too big', [
            N('That is a fair answer. A mistake should be matched by a fitting response.'),
          ]),
          opt('We don’t know the whole story', [
            N('That is a fair answer. We hear only his side so far.'),
          ]),
          opt('Maybe, if the cup was very precious', [
            N(
              'That is a fair answer. How much harm was done matters, and so does what happens afterwards.',
            ),
          ]),
        ],
        'Your child weighed up fairness in a punishment.',
      ),
    ],
  ),
  scene(
    'a02-10-under-done',
    [
      N(
        'You come up gasping. Monkey has already somersaulted off to fetch help from the South Sea.',
      ),
      N('You take a long breath. Your lungs feel very glad to be lungs.'),
    ],
    [
      ask(
        1,
        'literacy',
        'personification',
        'L.4.5',
        [N('“Your lungs feel very glad to be lungs.” Can lungs really feel glad?')],
        [
          opt(
            'No: it is a playful way to say how good the air feels',
            [
              N(
                'Yes. Giving human feelings to things that are not people is called personification.',
              ),
            ],
            true,
          ),
          opt('Yes, lungs have feelings', [
            N('Lungs help us breathe, but they do not feel glad.'),
            N('The writer gives them a feeling to show how good that breath is.'),
          ]),
        ],
        'Your child recognised personification.',
      ),
    ],
  ),
  scene(
    'a02-10-moksa',
    [
      N('Monkey comes back with Moksa, Guanyin’s disciple, who carries a small red gourd.'),
      MS('Sha Wujing! The monk you were told to wait for is on the bank. Come up.'),
      N(
        'The river spirit comes up out of the water at once, spade over his shoulder, and kneels on the sand.',
      ),
      SD('I didn’t know. Nobody told me he’d look so ordinary.', 'shock'),
      MO('I am very ordinary. That is rather the point.', 'soft'),
      N('Moksa sets the red gourd on the water. It grows into a raft, steady as a floor.'),
    ],
    [
      ask(
        5,
        'science',
        'balance: why heavy things go low',
        '3-PS2-1',
        [N('Why is it wise to load the heaviest things at the bottom of a raft?')],
        [
          opt(
            'It keeps the raft steady and hard to tip',
            [
              N(
                'Yes. Low weight keeps the raft’s centre of gravity low, so the forces stay balanced.',
              ),
            ],
            true,
          ),
          opt('It makes the raft look tidy', [
            N('Tidy is nice, but there is a better reason.'),
            N('Heavy things at the bottom keep it from tipping.'),
          ]),
        ],
        'Your child learned why heavy loads go low on a raft.',
      ),
    ],
    [
      {
        id: 'pole',
        label: 'Offer Sandy the other end of the luggage pole.',
        then: [
          SD(
            'Thank you. I’ll carry it. I like carrying things. You know where you are with a weight.',
            'soft',
          ),
        ],
      },
      {
        id: 'raft',
        label: 'Help Sandy load the raft.',
        then: [
          N(
            'He loads it neatly, heaviest at the bottom. Pigsy sits on the lightest bit and calls it helping.',
          ),
        ],
      },
    ],
  ),
  scene(
    'a02-10-complete',
    [
      N(
        'The raft crosses eight hundred li in what feels like an afternoon. On the far bank it shrinks back into a gourd.',
      ),
      MO('Wujing. Sha Wujing. We shall call you Sandy.', 'soft'),
      MO(
        'Wukong, Bajie, Wujing, the horse, and you. My fifth disciple. I think I have the count right at last.',
        'happy',
      ),
      N(
        'Now there are six of you, and the horse. Sandy takes the back end of the luggage pole, and you take the front.',
      ),
      N('It is much easier like that. Your Nubbin rides in the middle and does the steering.'),
      N('Behind you the river of sand flows on, as brown as weak tea, and as wide as ever.'),
    ],
    [
      ask(
        1,
        'maths',
        'divide: speed of the raft',
        '3.OA.A.3',
        [
          N(
            'Suppose the raft crosses its 800 li in four hours. How many li does it cover each hour?',
          ),
        ],
        [
          opt(
            '200 li',
            [N('Yes. 800 ÷ 4 = 200. Eight hundreds shared by four is two hundred.')],
            true,
          ),
          opt('400 li', [N('That would take two hours, not four.'), N('800 ÷ 4 = 200.')]),
        ],
        'Your child divided distance by time to find a speed.',
      ),
      notice(
        3,
        'social-studies',
        'pack animals on the real Silk Road',
        'D2.Geo.2.K-2',
        [
          N(
            'On the real Silk Road, traders crossed deserts with two-humped camels that could carry heavy loads for days.',
          ),
          N('Sharing the load was a skill every traveller knew.'),
        ],
        'Your child heard how traders on the Silk Road used camels to carry loads.',
      ),
    ],
  ),
];

// ================================================================== A2-11 The Ginseng Fruit
const Q11_SCENES: EduScene[] = [
  scene(
    'a02-11-temple',
    [
      N(
        'The temple is quiet and lovely. Its master is away, and two young acolytes, Bright Moon and Pure Wind, look after it.',
      ),
      BM(
        'Our master said a monk would come, and we were to give him two of the fruits from the tree.',
      ),
      PW(
        'They ripen once in nine thousand years. Smell one, and you live three hundred and sixty years.',
      ),
      N('They bring two fruits on a dish. Each is shaped like a tiny sleeping baby.'),
      MO('No! No, no. Take them away. I couldn’t possibly.', 'shock'),
      BM('They’re fruit. They grow on a tree.'),
      MO('Take them away, please.'),
      N(
        'So the acolytes eat them themselves, in the kitchen. Pigsy, listening at the wall, makes a small hungry sound.',
      ),
    ],
    [
      notice(
        2,
        'science',
        'ginseng is a real plant',
        '2-LS2-1',
        [
          N(
            'Ginseng is a real plant. Its root has been used in Chinese medicine for a very long time.',
          ),
          N('The tree in this story is made up, but the name is borrowed from the root.'),
        ],
        'Your child learned that ginseng is a real plant whose root is used in medicine.',
      ),
      ask(
        6,
        'sel',
        'refusing because of what something resembles (a think question)',
        'CASEL: Responsible decision-making',
        [
          N(
            'The monk won’t eat fruit shaped like babies, even though it is only fruit. Is he being wise, or just fussy?',
          ),
          N('There is no single right answer. Think about it, then choose.'),
        ],
        [
          opt('Wise: he follows his conscience', [
            N(
              'That is a fair answer. Sometimes a feeling is a good guide, even when it cannot be explained.',
            ),
          ]),
          opt('Fussy: it is only fruit', [
            N('That is a fair answer. Reason and a bit of curiosity can quieten a worry.'),
          ]),
          opt('Both can be true', [
            N(
              'That is a fair answer. We often keep a principle and still learn it was stricter than needed.',
            ),
          ]),
        ],
        'Your child weighed instinct against reason in a small decision.',
      ),
    ],
  ),
  scene(
    'a02-11-tree',
    [
      PG(
        'Brother. Elder brother. Wise and handsome brother. Just three. One each. Nobody would notice.',
        'soft',
      ),
      N(
        'Monkey knocks a fruit down with a golden rod. It hits the ground and sinks straight into it, like water.',
      ),
      N(
        'He knocks down three more and catches them in his robe. Monkey, Pigsy and Sandy eat one each, very fast.',
      ),
      PG('I didn’t taste it. I swallowed it whole. Get me another so I can taste it.', 'sad'),
      N(
        'The acolytes count their fruit and come back shouting thief. They shout it a great many times.',
      ),
      MK('Thief? Thief? Fine. Then nobody gets any.', 'angry'),
      N(
        'Monkey goes back to the garden in a temper and pushes the whole tree over. Its roots come up out of the ground.',
      ),
    ],
    [
      notice(
        6,
        'science',
        'roots anchor a plant and take in water',
        '2-LS2-1',
        [
          N(
            'Roots hold a plant in the soil and soak up water and minerals. A tree knocked out of the ground can’t drink, so its leaves curl.',
          ),
        ],
        'Your child learned that roots anchor a plant and take in water.',
      ),
    ],
    [
      {
        id: 'own',
        label: 'Tell the acolytes the truth: you saw it all.',
        then: [
          BM('Thank you. At least someone in this party is honest.', 'sad'),
          N('Monkey glares at you. Then, after a moment, he stops glaring.'),
        ],
      },
      {
        id: 'tree',
        label: 'Go and kneel by the fallen tree.',
        then: [
          N(
            'Its leaves are already curling. Your Nubbin lies down beside the roots, the way it lies by anything that’s hurt.',
          ),
        ],
      },
    ],
  ),
  scene(
    'a02-11-tree-done',
    [
      N(
        'Master Zhenyuan comes home that night. With one sweep of his sleeve he scoops up all six of you and the horse, like crumbs.',
      ),
      ZY('Mend my tree, and I will let you go. I don’t much mind how.', 'angry'),
    ],
    [
      ask(
        1,
        'sel',
        'putting right a mistake',
        'CASEL: Responsible decision-making',
        [
          N(
            'When we break something that matters to someone, what is a good way to make up for it?',
          ),
        ],
        [
          opt(
            'Put it right as well as we can, and say sorry',
            [
              N(
                'Yes. Repair and an apology go together. That is what the pilgrims now have to do.',
              ),
            ],
            true,
          ),
          opt('Hope they forget', [
            N('Forgetting does not fix a tree.'),
            N('Mending what we broke is the honest way forward.'),
          ]),
        ],
        'Your child thought about repairing a mistake.',
      ),
    ],
  ),
  scene(
    'a02-11-mend',
    [
      N(
        'Monkey searches the three islands of the immortals for a cure, and nobody has one. At last he goes to the South Sea.',
      ),
      N(
        'Guanyin comes with her vase. She draws a sign on Monkey’s palm and has him lay his hand on the roots.',
      ),
      GY('Bring water. Jade cups only. Pour gently.', 'soft'),
      N(
        'You carry cup after cup. Your Nubbin carries a very small cup, and pours very slowly, and gets most of it in.',
      ),
      N('Suppose each jade cup holds 250 millilitres and Nubbin’s little cup holds 50.'),
      N('Guanyin dips her willow branch in the vase and sprinkles the dew over all of it.'),
      N(
        'The tree stands up, and its leaves uncurl, green and glossy. There are fruit on it, exactly the right number.',
      ),
    ],
    [
      ask(
        2,
        'science',
        'why a wilting plant needs water',
        '2-LS2-1',
        [N('The tree is drooping and curling. What does a wilting plant need?')],
        [
          opt(
            'Water, soaked up through its roots',
            [
              N(
                'Yes. Plant stems stand up because they are full of water, so a drink is the first thing to try.',
              ),
            ],
            true,
          ),
          opt('A bigger pot', [
            N('A pot is not the problem here.'),
            N(
              'Wilting means a plant is short of water, so water through the roots is what it needs.',
            ),
          ]),
        ],
        'Your child said that a wilting plant needs water.',
      ),
      ask(
        4,
        'maths',
        'divide: millilitres in cups',
        '4.MD.A.1',
        [
          N(
            'One jade cup holds 250 millilitres, and your Nubbin’s cup holds 50. How many of its little cups would fill one jade cup?',
          ),
        ],
        [
          opt('5', [N('Yes. 250 ÷ 50 = 5. Five small cups make one jade cup.')], true),
          opt('50', [N('50 is the size of the little cup, not how many.'), N('250 ÷ 50 = 5.')]),
        ],
        'Your child divided to compare two volumes in millilitres.',
      ),
    ],
  ),
  scene(
    'a02-11-complete',
    [
      ZY(
        'Well. That is the most trouble anyone has caused me in a thousand years. Come and eat with me.',
        'happy',
      ),
      N(
        'There is a feast of the ginseng fruit. This time the monk eats one, now he knows it is only fruit.',
      ),
      MO('It tastes like the first morning of spring.', 'soft'),
      N(
        'Master Zhenyuan and Monkey swear to be brothers. Monkey looks almost embarrassed, which is new.',
      ),
      N(
        'In the garden, the tree stands tall again, and a single new fruit is just beginning to swell.',
      ),
      N(
        'Your Nubbin lies at the foot of it, sleepy and content, with a jade cup still in its paws.',
      ),
    ],
    [
      ask(
        2,
        'literacy',
        'a simile for taste',
        'L.4.5',
        [
          N(
            '“It tastes like the first morning of spring.” What feeling does this simile give the fruit?',
          ),
        ],
        [
          opt(
            'Fresh, new and hopeful',
            [N('Yes. Spring mornings mean a new start, so the taste feels fresh and bright.')],
            true,
          ),
          opt('Sour and cold', [
            N('Spring can be chilly, but the simile is about a hopeful start.'),
            N('Fresh, new and hopeful.'),
          ]),
        ],
        'Your child read the feeling behind a simile about taste.',
      ),
    ],
  ),
];

// ================================================================== A2-12 The White Bone Demon
const Q12_SCENES: EduScene[] = [
  scene(
    'a02-12-girl',
    [
      N(
        'White Tiger Ridge is all bare rock and thin wind. The monk is hungry, and Monkey has gone to find fruit.',
      ),
      N(
        'A girl comes down the path with a basket of rice and noodles. She smiles at everyone and doesn’t blink.',
      ),
      BN(
        'Kind travellers! Please, eat. I brought this up for my father, but you need it more.',
        'soft',
      ),
      N('Your Nubbin hides behind your legs. It has never once hidden from somebody with food.'),
      N(
        'Monkey comes back, takes one look, and swings his staff. The girl crumples like an empty coat, and a cold puff of air goes up.',
      ),
      MO('Wukong! She was only a girl with a basket!', 'shock'),
      MK('She was a demon in disguise. Look in the basket.'),
      N(
        'In the basket there are no noodles, only worms and frogs, wriggling. The monk looks, and looks away.',
      ),
      PG(
        'He’s turned the noodles into worms so you won’t be cross with him. He can do that, you know.',
      ),
    ],
    [
      ask(
        8,
        'sel',
        'deciding between conflicting accounts (a think question)',
        'CASEL: Responsible decision-making',
        [
          N(
            'The monk sees a girl, Monkey sees a demon in disguise, and Pigsy says Monkey is making it up. How can we decide who is right?',
          ),
          N('There is no single right answer. Think about it, then choose.'),
        ],
        [
          opt('Look for more evidence before we decide', [
            N('That is a fair answer. Careful people collect more clues before they judge.'),
          ]),
          opt('Trust the one who knows them best', [
            N(
              'That is a fair answer: a friend’s record counts. It is also worth asking how they know.',
            ),
          ]),
        ],
        'Your child weighed up conflicting accounts of the same event.',
      ),
    ],
  ),
  scene(
    'a02-12-girl-done',
    [
      N('The monk says the quiet words. Monkey holds his head and says nothing back.'),
      N('He could have shouted. He chooses, this time, to be silent.'),
    ],
    [
      ask(
        1,
        'literacy',
        'how a character responds to an event',
        'RL.2.3',
        [
          N(
            'Monkey is hurt and angry, but he chooses silence. What does that choice show about him?',
          ),
        ],
        [
          opt(
            'He is learning to calm down before he speaks',
            [
              N(
                'Yes. A pause keeps him from saying something he would regret, and that is new for Monkey.',
              ),
            ],
            true,
          ),
          opt('He has nothing to say', [
            N('Monkey always has something to say.'),
            N('This time he holds it back, which shows he is learning to calm down.'),
          ]),
        ],
        'Your child explained what a character’s response shows about him.',
      ),
    ],
  ),
  scene(
    'a02-12-old-woman',
    [
      N(
        'An old woman comes up the path, leaning on a stick, weeping. She is looking for her daughter.',
      ),
      BN('Have you seen my girl? She went this way with a basket.', 'sad'),
      N(
        'She doesn’t blink either. Your Nubbin is pressed so hard against your ankles you can feel it shaking.',
      ),
      N(
        'Monkey swings again. The old woman folds away like paper, and a puff of cold air goes up and over the ridge.',
      ),
      MO('Twice! Twice in one morning!', 'angry'),
      MK('The same demon twice. She keeps getting away, and she keeps coming back.', 'angry'),
    ],
    [
      ask(
        2,
        'health',
        'what fear does to the body',
        '4-LS1-2',
        [
          N(
            'Your Nubbin is trembling and pressed against you. What happens in our bodies when we are scared?',
          ),
        ],
        [
          opt(
            'Our hearts beat faster and our muscles get ready to run or freeze',
            [
              N(
                'Yes. Fear is a built-in alarm that prepares the body, and it is a normal reaction.',
              ),
            ],
            true,
          ),
          opt('Nothing, fear is only in the mind', [
            N('The body reacts too, with a faster heart, quick breathing and shaky legs.'),
            N('It is normal, and it passes.'),
          ]),
        ],
        'Your child learned that fear is a normal bodily alarm.',
      ),
    ],
  ),
  scene(
    'a02-12-bones',
    [
      N(
        'An old man comes last, fingering prayer beads, looking for his wife and daughter. He does not blink.',
      ),
      N(
        'This time Monkey calls the mountain spirits to stand guard, so she can’t slip away. Then he swings.',
      ),
      N(
        'The old man folds up like an empty coat. Where he stood lies a small heap of white bones, chalky as old shells.',
      ),
      MK('There. Bones. There’s your demon. Now do you believe me?', 'angry'),
      PG('He’s made them look like bones. It’s a trick, so you’ll stop saying the words.', 'think'),
      MO(
        'Three people, Wukong. A girl, her mother, her father. I can’t walk beside someone who does that.',
        'sad',
      ),
      N(
        'The monk writes a letter of dismissal and holds it out. Then everybody, even Monkey, looks at you.',
      ),
      MO('You carry our things. You have seen all we have seen. What do you think?', 'sad'),
    ],
    [
      ask(
        3,
        'science',
        'the skeleton',
        '4-LS1-1',
        [
          N(
            'Bones are real parts of a living body. About how many bones does an adult human skeleton have?',
          ),
        ],
        [
          opt(
            '206',
            [
              N(
                'Yes. An adult has 206. Babies have more, because many of their bones join together as they grow.',
              ),
            ],
            true,
          ),
          opt('50', [N('Many more than that: 206 in an adult.'), N('Your hands alone have 54.')]),
        ],
        'Your child learned how many bones an adult human skeleton has.',
      ),
      ask(
        7,
        'sel',
        'who do you believe? (the big think question)',
        'CASEL: Responsible decision-making',
        [
          N(
            'Do you trust what you saw, in the way your Nubbin hid, or what you were told, that you can’t strike on a hunch?',
          ),
          N('There is no single right answer. Give your reason, then choose.'),
        ],
        [
          opt('What I saw: my Nubbin hid, and that matters', [
            N(
              'That is a fair answer. A gut feeling can be a signal, though the monk may still ask for proof.',
            ),
          ]),
          opt('The rule: don’t act on a hunch', [
            N(
              'That is a fair answer. Rules guard people from our mistakes, though Monkey may feel unheard.',
            ),
          ]),
        ],
        'Your child weighed first-hand evidence against a rule of caution.',
      ),
    ],
    [
      {
        id: 'monkey',
        label: 'Believe Monkey. You saw your Nubbin hide.',
        set: { 'a02-believed': 'monkey' },
        then: [
          Y('I believe him. My Nubbin hid from her three times. It never hides from anyone.'),
          MO('A Nubbin’s feelings are not proof. I am sorry. I can’t risk it.', 'sad'),
          MK('Cousin’s keeper. Thank you. Remember you said it.', 'soft'),
        ],
      },
      {
        id: 'monk',
        label: 'Believe the monk. You can’t strike people on a hunch.',
        set: { 'a02-believed': 'monk' },
        then: [
          Y('Even if you’re right, you can’t just hit people because you’re sure.'),
          MK('I wasn’t sure. I knew.', 'angry'),
          MK('Fine. Remember you said it, Cousin’s keeper.', 'sad'),
        ],
      },
    ],
  ),
  scene(
    'a02-12-bones-done',
    [
      N(
        'Monkey can’t leave without bowing to his master, and the monk won’t look at him. So he pulls three hairs and blows on them.',
      ),
      N(
        'Three more Monkeys appear, and the monk is surrounded. Four bows, on every side, all the way to the ground.',
      ),
      N('Then Monkey is gone, and your Nubbin sits in the road looking at the place where he was.'),
    ],
    [
      ask(
        1,
        'maths',
        'multiply: four Monkeys, four bows each',
        '3.OA.A.1',
        [N('Suppose each of the four Monkeys bows four times. How many bows is that in all?')],
        [
          opt('16', [N('Yes. Four groups of four make 16.')], true),
          opt('8', [N('That adds 4 + 4. There are four groups of four.'), N('4 × 4 = 16.')]),
        ],
        'Your child multiplied 4 × 4.',
      ),
    ],
  ),
  scene(
    'a02-12-return',
    [
      N(
        'Without Monkey, it goes badly. A demon in a yellow robe catches the monk and turns him into a tiger, of all things.',
      ),
      PG(
        'I’ll have to fetch him. I’ll have to say sorry. I hate saying sorry. You come too, it’s easier with two.',
        'sad',
      ),
      N(
        'Back at the Mountain of Flowers and Fruit, Monkey is king again, with his feet up. Your Nubbin runs at him and he catches it.',
      ),
      PG(
        'The demon says he isn’t frightened of you. Says you’re just a jumped-up monkey.',
        'think',
      ),
      MK('He said that? He said that? Right.', 'angry'),
      N('Pigsy winks at you. It is the cleverest thing you have ever seen him do.'),
    ],
    [
      ask(
        4,
        'literacy',
        'a character’s motive',
        'RL.3.3',
        [N('Why does Pigsy tell Monkey that the demon called him a “jumped-up monkey”?')],
        [
          opt(
            'To make him angry enough to come and fight',
            [N('Yes. Pigsy knows Monkey’s pride, and he uses it to bring him back.')],
            true,
          ),
          opt('Because he is repeating gossip', [
            N('Look at the wink. It is a plan, not gossip.'),
            N('Pigsy wants Monkey angry enough to come.'),
          ]),
        ],
        'Your child worked out a character’s hidden motive.',
      ),
    ],
  ),
  scene(
    'a02-12-return-done',
    [
      N('Monkey beats the demon, and the monk is a monk again, shaking and ashamed.'),
      MO('I was wrong to send you away, Wukong. I am sorry.', 'sad'),
      MK(
        'You were wrong about her. You weren’t wrong to be scared of what I can do. I’m scared of it too, sometimes.',
        'soft',
      ),
    ],
    [
      ask(
        2,
        'sel',
        'saying you are scared of your own strength',
        'CASEL: Self-awareness',
        [N('Monkey admits he is sometimes scared of what he can do. Does that make him weak?')],
        [
          opt(
            'No: it shows he understands his own power',
            [N('Yes. Knowing the size of your strength, and respecting it, is wise.')],
            true,
          ),
          opt('Yes: strong people never feel fear', [
            N('Everyone feels fear, including the strongest.'),
            N('Admitting it can be a strength.'),
          ]),
        ],
        'Your child heard that admitting fear can show wisdom.',
      ),
    ],
  ),
  scene(
    'a02-12-complete',
    [
      N(
        'The monk takes Monkey’s hand in both of his. It is the first time either of them has done that.',
      ),
      N('Sandy picks up the back of the luggage pole. You pick up the front.'),
      MK('Cousin’s keeper. I haven’t forgotten what you said.', 'think'),
      N(
        'He doesn’t say whether that is good or bad. Your Nubbin rides on his shoulder for the rest of the day.',
      ),
      N('The ridge behind you is only rock and thin wind again, and nothing whispers.'),
      N('Somewhere ahead, the road is waiting, and so, for once, is a calmer pilgrim.'),
    ],
    [
      notice(
        2,
        'social-studies',
        'Xuanzang wrote a travel book',
        'D2.His.2.K-2',
        [
          N('The real Xuanzang wrote down what he saw on his travels.'),
          N(
            'His book describes cities, deserts and customs along the way, and historians still read it today to learn about those places.',
          ),
        ],
        'Your child heard that the real monk wrote a travel record that historians use.',
      ),
    ],
  ),
];

// ================================================================== A2-13 The Magic Gourd
const Q13_SCENES: EduScene[] = [
  scene(
    'a02-13-rule',
    [
      N(
        'On Level Top Mountain live two demon brothers, Gold Horn and Silver Horn. They have caught the monk and Pigsy already.',
      ),
      MK(
        'They have a gourd. Purple and gold. They call your name, and if you answer, whoosh, you’re inside it.',
      ),
      SD('So don’t answer.'),
      MK(
        'I answered. I gave them a made-up name, and answered to that, and it still got me. It doesn’t care if the name is real.',
        'think',
      ),
      MK('It only cares that you answered. I got out by pretending I’d melted. Don’t ask.'),
      N('Your Nubbin looks very hard at its own mouth, as if to check it is shut.'),
    ],
    [
      ask(
        3,
        'literacy',
        'what the rule really is',
        'RL.3.3',
        [
          N(
            'Monkey answered to a made-up name, and the gourd still caught him. What does that tell us about how the gourd works?',
          ),
        ],
        [
          opt(
            'It is the answering that counts, not the name',
            [N('Yes. The trick works on the reply, which is why silence is the only safe answer.')],
            true,
          ),
          opt('It only works on real names', [
            N('Monkey’s made-up name worked too.'),
            N('It is the answering that counts.'),
          ]),
        ],
        'Your child worked out the hidden rule from an example.',
      ),
    ],
  ),
  scene(
    'a02-13-gourd',
    [
      N(
        'Silver Horn stands at the cave mouth with the gourd held upside down, and calls into the trees.',
      ),
      SH('Little round one! You, with the big eyes! Little Nubbin!'),
      N(
        'Your Nubbin looks at him, and blinks, and says nothing. It has never said anything in its life.',
      ),
      SH('Answer me! It’s rude not to answer!', 'angry'),
      N('It blinks again. Silver Horn shakes the gourd, as if it might be broken.'),
      SH('All right. You, then. The one carrying the luggage. Answer me!'),
    ],
    [
      notice(
        0,
        'science',
        'gourds are real fruits',
        '2-LS2-1',
        [
          N(
            'Gourds are real. They are the fruit of plants in the same family as pumpkins and squashes.',
          ),
          N(
            'People have dried hard gourds and used them as bottles and bowls for thousands of years.',
          ),
        ],
        'Your child learned that gourds are real fruits that people have used as containers.',
      ),
      ask(
        5,
        'sel',
        'is silence ever right? (a think question)',
        'CASEL: Responsible decision-making',
        [
          N(
            'Silver Horn says it is rude not to answer. When someone demands a reply, is it ever right to say nothing?',
          ),
          N('There is no single right answer. Think about it, then choose.'),
        ],
        [
          opt('Yes, when answering would put me in danger', [
            N(
              'That is a fair answer. We do not owe everyone a reply, especially someone who means harm.',
            ),
          ]),
          opt('Usually no: manners matter, so I would say “no, thank you”', [
            N('That is a fair answer. A short, polite refusal can protect us without being rude.'),
          ]),
        ],
        'Your child reflected on when silence is the right response.',
      ),
    ],
    [
      {
        id: 'silent',
        label: 'Keep your mouth shut, like your Nubbin.',
        then: [N('You say nothing. Your Nubbin looks up at you with enormous approval.')],
      },
      {
        id: 'answer',
        label: 'Start to say, “Who wants to know?”',
        then: [
          N(
            'You get as far as “Who” before the gourd begins to pull. Monkey yanks you behind a rock by the collar.',
          ),
          MK('What did I just say? What did I literally just say?', 'shock'),
        ],
      },
    ],
  ),
  scene(
    'a02-13-swap',
    [
      N(
        'While Silver Horn shouts at your Nubbin, a little fly lands on his sleeve. A moment later his gourd has been swapped for a fake.',
      ),
      N('Monkey stands on a rock with the real one, upside down.'),
      MK('Silver Horn!', 'happy'),
      SH('What?', 'angry'),
      N('Whoosh. Monkey puts the stopper in, and shakes the gourd next to his ear.'),
      MK('Never answer to your own name, little brother. Didn’t anyone tell you?', 'happy'),
    ],
    [
      ask(
        0,
        'science',
        'insects have six legs',
        '4-LS1-1',
        [
          N(
            'The little fly is really Monkey in disguise. How many legs does a real insect such as a fly have?',
          ),
        ],
        [
          opt(
            'Six',
            [N('Yes. Insects have six legs and three body parts: head, thorax and abdomen.')],
            true,
          ),
          opt('Eight', [
            N('Eight legs belong to spiders, which are not insects.'),
            N('Insects have six.'),
          ]),
        ],
        'Your child learned that insects have six legs.',
      ),
    ],
  ),
  scene(
    'a02-13-swap-done',
    [
      N(
        'Gold Horn goes the same way before the afternoon is out. Sandy unties the monk, and Pigsy, who complains the whole time.',
      ),
      N('Sandy does not complain back. He simply keeps on untying.'),
    ],
    [
      ask(
        1,
        'literacy',
        'character traits',
        'RL.3.3',
        [
          N(
            'Pigsy complains the whole time while Sandy unties him. What does this tell us about each of them?',
          ),
        ],
        [
          opt(
            'Pigsy grumbles, and Sandy is patient and steady',
            [N('Yes. What each does, and how, shows their character traits.')],
            true,
          ),
          opt('They are both grumpy', [
            N('Sandy stays quiet and keeps working. Notice the difference.'),
            N('Sandy is patient, and Pigsy is the grumbler.'),
          ]),
        ],
        'Your child inferred character traits from behaviour.',
      ),
    ],
  ),
  scene(
    'a02-13-complete',
    [
      N(
        'An old man with a long white beard comes walking out of the clouds. It is Lord Lao, looking a little tired.',
      ),
      LL(
        'Those two are my furnace boys. They ran off with my gourd and my fan and my good rope. May I have them back?',
      ),
      MK('You might have kept a closer eye on them.', 'think'),
      LL('So might the Jade Emperor, on you. And yet here we all are.', 'soft'),
      N(
        'He lets Silver Horn out of the gourd and leads both brothers home by the ear. Your Nubbin is still not saying anything.',
      ),
      N('The cave on Level Top Mountain is quiet, and the gourd is gone.'),
    ],
    [
      notice(
        0,
        'social-studies',
        'Lord Lao and the philosopher Laozi',
        'D2.His.2.K-2',
        [
          N(
            'Lord Lao is based on Laozi, an ancient Chinese thinker traditionally credited with a short book about the Dao, or “the way”.',
          ),
          N('In Daoist tradition he became a divine figure.'),
        ],
        'Your child heard who Lord Lao is based on in Chinese tradition.',
      ),
    ],
  ),
];

// ================================================================== A2-14 Red Boy
const Q14_SCENES: EduScene[] = [
  scene(
    'a02-14-pine',
    [
      N(
        'A child is tied to the top of a pine tree, crying for help. He is about seven, with a red jacket and a hopeful face.',
      ),
      RB('Robbers left me here! Please, kind master, take me home!', 'sad'),
      MO('Wukong, untie him at once and carry him.'),
      N(
        'Monkey looks at the boy. Then he looks at you, the way he looked at you on White Tiger Ridge.',
      ),
      MK(
        'Master, a child doesn’t tie himself to the top of a pine tree. Robbers aren’t that tidy.',
        'think',
      ),
      MO('Wukong. A child is crying. Untie him.', 'angry'),
    ],
    [
      ask(
        5,
        'sel',
        'kindness or caution? (a think question)',
        'CASEL: Responsible decision-making',
        [
          N(
            'The monk wants to help a crying child at once, but Monkey wants to be careful. Which matters more here?',
          ),
          N('There is no single right answer. Think about it, then choose.'),
        ],
        [
          opt('Kindness: a child in trouble comes first', [
            N('That is a fair answer. A kind heart is the monk’s whole strength.'),
          ]),
          opt('Caution: ask questions first', [
            N('That is a fair answer. Monkey has seen this trick before.'),
          ]),
          opt('Both: help, but carefully', [
            N(
              'That is a fair answer, and it is what Monkey tries: carry him, but keep a close watch.',
            ),
          ]),
        ],
        'Your child weighed up kindness against caution.',
      ),
    ],
    [
      {
        id: 'eyes',
        label: 'Look at your Nubbin first.',
        then: [
          N(
            'Your Nubbin isn’t hiding. It is staring at the boy with its head on one side, puzzled, as if he smells of bonfires.',
          ),
          MK('Puzzled. Not scared. Good. I’ll carry him. Carefully.', 'think'),
        ],
      },
      {
        id: 'help',
        label: 'Help untie him.',
        then: [
          N(
            'The knots are very easy to undo, too easy. Monkey takes the boy on his back without a word.',
          ),
        ],
      },
    ],
  ),
  scene(
    'a02-14-pine-done',
    [
      N(
        'The boy makes himself as heavy as a mountain on Monkey’s back. Then, with a gust of wind, he and the monk are gone.',
      ),
      MK('Of course. Of course he was.', 'angry'),
    ],
    [
      ask(
        0,
        'literacy',
        'a simile that uses “as”',
        'L.4.5',
        [N('“As heavy as a mountain.” Which pair of words makes this a simile?')],
        [
          opt(
            '“as … as”',
            [N('Yes. “As … as” compares two things, which is the mark of a simile.')],
            true,
          ),
          opt('“heavy” and “mountain”', [
            N('Those are the things being compared.'),
            N('The “as … as” frame is what makes it a simile.'),
          ]),
        ],
        'Your child spotted the "as … as" pattern in a simile.',
      ),
    ],
  ),
  scene(
    'a02-14-fire',
    [
      N(
        'At Fire Cloud Cave the boy comes out with a spear, pushes two little carts in front of him, and breathes fire.',
      ),
      RB(
        'I am Red Boy! The Bull Demon King is my father. You’re supposed to be my uncle, but I don’t care.',
        'happy',
      ),
      N(
        'Monkey calls the dragon kings, and they rain on the fire. It only burns hotter: this fire doesn’t mind water at all.',
      ),
      N(
        'Monkey comes out singed and smoking, and dives into a cold stream to cool off. The cold knocks him flat.',
      ),
      SD('Water. More water, cold. Not too fast.', 'shock'),
      N(
        'You run with the bucket. Pigsy rubs Monkey’s back and hands, the way you rub a cold child after a swim.',
      ),
      N('Suppose your bucket holds five litres, and you make six trips.'),
      N('Your Nubbin lies on Monkey’s chest, because that is where it would want someone to lie.'),
    ],
    [
      doIt(
        5,
        'science',
        'friction makes heat',
        '4-PS3-2',
        'edu:rub:hands:warm',
        [
          N(
            '(Rub your hands together hard for ten seconds, and feel them get warm. That is friction turning movement into heat.)',
          ),
        ],
        'Your child felt friction make heat by rubbing their hands.',
      ),
      ask(
        6,
        'maths',
        'multiply: 6 trips of 5 litres',
        '3.OA.A.3',
        [
          N(
            'Your bucket holds five litres, and you make six trips. How many litres of water do you bring?',
          ),
        ],
        [
          opt('30 litres', [N('Yes. 6 × 5 = 30 litres.')], true),
          opt('11 litres', [
            N('That adds 6 + 5. Six equal trips means we multiply.'),
            N('6 × 5 = 30.'),
          ]),
        ],
        'Your child multiplied 6 × 5 in a word problem.',
      ),
    ],
  ),
  scene(
    'a02-14-fire-done',
    [
      MK('Ugh. I’m all right. I’m all right. Get off, Cousin. No, stay there a minute.', 'soft'),
      MK('Fire I can’t beat, demon I can’t catch. There’s only one person for this.'),
    ],
    [
      notice(
        0,
        'sel',
        'what we say and what we mean',
        'CASEL: Relationship skills',
        [
          N(
            'Monkey says “get off” and then “stay a minute”. People often say one thing and need another, and a good friend listens to both.',
          ),
        ],
        'Your child heard that words and wishes can differ.',
      ),
    ],
  ),
  scene(
    'a02-14-lotus',
    [
      N(
        'Guanyin comes from the South Sea. She sets a lotus seat on the ground outside the cave, and steps away from it.',
      ),
      GY('Bring him out, Monkey. Then let him see this seat.', 'soft'),
      N(
        'Red Boy chases Monkey out, sees the lovely lotus seat with nobody on it, and sits straight down on it, laughing.',
      ),
      N(
        'The seat closes gently round him like a flower at evening. He can’t get up, and the fire goes out of him.',
      ),
      RB('Let me go! Let me go! I want my mother!', 'sad'),
      GY('You shall see her. But first, you shall learn a little. Will you come with me?', 'soft'),
      N(
        'Red Boy looks at her for a long time. Then he nods, and puts his hands together, and bows.',
      ),
    ],
    [
      notice(
        3,
        'science',
        'lotus flowers open and close with the day',
        '3-LS1-1',
        [
          N(
            'Real lotus flowers open in the morning and close again in the evening. Lotus seeds are tough: some have sprouted after sleeping for hundreds of years.',
          ),
        ],
        'Your child learned that lotus flowers close at night and their seeds can survive for centuries.',
      ),
    ],
  ),
  scene(
    'a02-14-complete',
    [
      N(
        'The monk is untied, smelling of smoke. Red Boy goes with Guanyin, walking a step behind her, quite quiet.',
      ),
      MO('He was only a boy, really.', 'sad'),
      MK('He was a boy who set fire to me. But yes.', 'think'),
      N(
        'Your Nubbin finds a little red ribbon from his jacket by the cave. It keeps it, for his mother, in case.',
      ),
      N('Fire Cloud Cave is cold and still, and the smoke is beginning to thin.'),
      N('You put the ribbon in a safe pocket, folded small, the way you fold things that matter.'),
    ],
    [
      ask(
        2,
        'sel',
        'kindness to someone who hurt you (a think question)',
        'CASEL: Social awareness',
        [
          N(
            'Monkey says Red Boy was a boy who set fire to him, “but yes”. Can you feel kind towards someone who hurt you?',
          ),
          N('There is no single right answer. Think about it, then choose.'),
        ],
        [
          opt('Yes, understanding is not the same as forgiving', [
            N(
              'That is a fair answer. You can understand why someone acted that way without saying it was fine.',
            ),
          ]),
          opt('Only if they say sorry', [
            N(
              'That is a fair answer. An apology can open the door, and some people find kindness comes first.',
            ),
          ]),
        ],
        'Your child reflected on whether kindness can coexist with being hurt.',
      ),
    ],
  ),
];

// ================================================================== A2-15 The Two Monkeys
const Q15_SCENES: EduScene[] = [
  scene(
    'a02-15-snatch',
    [
      N(
        'It happens again: bandits on the road, Monkey too rough with them, the monk too angry. Monkey is sent away.',
      ),
      N(
        'This time nobody cries; everyone is too tired. Pigsy goes to find water, and Sandy goes after Pigsy.',
      ),
      N('Then Monkey comes back, alone, with a cup of water held out in both hands.'),
      FM('Master. I’m sorry. Here. Drink.', 'soft'),
      MO('Go away, Wukong. I meant it.', 'sad'),
      N(
        'Monkey’s face changes. He knocks the monk flat, and grabs for the luggage you are carrying.',
      ),
      N('Your Nubbin hisses at him. It has never hissed at Monkey in its life.'),
    ],
    [
      ask(
        6,
        'literacy',
        'noticing clues that something is wrong',
        'RL.3.3',
        [N('Which clue best tells us this Monkey is not the real one?')],
        [
          opt(
            'He turned from gentle to violent in a moment, and your Nubbin hissed',
            [
              N(
                'Yes. Sudden changes in behaviour, and a trusted friend’s reaction, are strong clues.',
              ),
            ],
            true,
          ),
          opt('He is carrying a cup of water', [
            N('A cup of water on its own is not suspicious.'),
            N('The sudden switch, and the hiss, are the clues.'),
          ]),
        ],
        'Your child used behaviour as evidence.',
      ),
    ],
  ),
  scene(
    'a02-15-snatch-done',
    [
      N(
        'He tears the pack off the pole and is gone in a streak of cloud. The monk sits up, dizzy but unhurt.',
      ),
      SD('That wasn’t like him. Even at his worst, that wasn’t like him.', 'think'),
    ],
    [
      ask(
        0,
        'science',
        'what a cloud is made of',
        null,
        [N('Monkey escapes on a streak of cloud. What is a real cloud made of?')],
        [
          opt(
            'Tiny drops of water, or ice crystals, floating in the air',
            [N('Yes. Clouds form when water vapour cools and turns into droplets.')],
            true,
          ),
          opt('Cotton and smoke', [
            N('They look like cotton, but they are water.'),
            N('Droplets of water or ice.'),
          ]),
        ],
        'Your child learned what clouds are made of.',
      ),
    ],
  ),
  scene(
    'a02-15-twins',
    [
      N(
        'Sandy goes to the Mountain of Flowers and Fruit. He comes back with news: Monkey is there with a monk, a Pigsy, a Sandy and your luggage.',
      ),
      N(
        'At Guanyin’s island Sandy finds the real Monkey, who has been sulking there all along. Then the false one turns up, and there are two of him.',
      ),
      MK('Who are you? Why have you got my face?', 'angry'),
      FM('Who are you? Why have you got my face?', 'angry'),
      N(
        'Guanyin says the quiet words of the band. Both Monkeys clutch their heads and roll on the ground together.',
      ),
      GY('I cannot tell them apart.', 'think'),
      N(
        'They fight all the way up to Heaven. The Jade Emperor’s mirror shows two Monkeys, exactly the same, down to the last hair.',
      ),
      N(
        'Your Nubbin, who can always find Monkey in a crowd, looks from one to the other and starts to cry.',
      ),
    ],
    [
      ask(
        6,
        'maths',
        'lines of symmetry',
        '4.G.A.3',
        [
          N('The mirror shows two identical Monkeys, as if one were folded onto the other.'),
          N(
            'A line of symmetry is a fold that makes both halves match. How many lines of symmetry does a square have?',
          ),
        ],
        [
          opt(
            '4',
            [N('Yes. Two through the middles of the sides and two through opposite corners.')],
            true,
          ),
          opt('2', [
            N('Two is a good start: fold it top to bottom and left to right.'),
            N('Then try corner to corner. That makes four in all.'),
          ]),
        ],
        'Your child counted the lines of symmetry in a square.',
      ),
    ],
  ),
  scene(
    'a02-15-which',
    [
      N(
        'The two Monkeys tumble down out of the sky and land in the road in front of the monk, still fighting.',
      ),
      N('The monk stands up. He doesn’t look at either of them; he looks at you.'),
      MO(
        'On White Tiger Ridge, you believed him when I would not. You trusted what you saw.',
        'sad',
      ),
      MO('So look now. Which one is my disciple?'),
      N(
        'Two Monkeys, two staffs, two golden bands. Both faces are looking at you, hopeful and furious, exactly alike.',
      ),
      N('Your Nubbin is holding both their tails, one in each paw, and won’t let go of either.'),
    ],
    [
      ask(
        5,
        'sel',
        'is “I can’t tell” an answer? (a think question)',
        'CASEL: Self-awareness',
        [
          N(
            'You cannot tell which Monkey is real. Is it better to guess, or to say plainly that you cannot tell?',
          ),
          N('There is no single right answer. Think about it, then choose.'),
        ],
        [
          opt('Say it plainly: a guess might hurt someone', [
            N('That is a fair answer. Honest uncertainty is better than a confident mistake.'),
            N(
              'Scientists say “we do not know yet” all the time. It is where careful testing starts.',
            ),
          ]),
          opt('Guess: someone needs an answer now', [
            N(
              'That is a fair answer. Sometimes we have to act, though we should say it is a guess.',
            ),
          ]),
        ],
        'Your child weighed honesty about uncertainty against the pressure to answer.',
      ),
    ],
    [
      {
        id: 'left',
        label: 'Point at the one on the left.',
        then: [
          FM('Ha! You see? The little luggage-carrier knows me.', 'happy'),
          MK('Ha! You see? The little luggage-carrier knows me.', 'happy'),
          N(
            'They say it at the same moment, in the same voice, with the same grin. Your pointing finger feels very foolish.',
          ),
          MO('That settles nothing. I am sorry I asked you to carry it.', 'sad'),
        ],
      },
      {
        id: 'right',
        label: 'Point at the one on the right.',
        then: [
          MK('There! Somebody with eyes in their head at last.', 'happy'),
          FM('There! Somebody with eyes in their head at last.', 'happy'),
          N('Both of them bow to you. Both bows are exactly as deep, and exactly as rude.'),
          MO('That settles nothing. I am sorry I asked you to carry it.', 'sad'),
        ],
      },
      {
        id: 'plain',
        label: 'Say it plainly: “I can’t tell. I won’t pretend I can.”',
        then: [
          N('Both Monkeys open their mouths, and then neither of them says anything at all.'),
          MO('Thank you. That is the first true thing anyone has said since this began.', 'soft'),
          SD('Then we stop asking people who can’t know, and go to the one who does.'),
        ],
      },
    ],
  ),
  scene(
    'a02-15-named',
    [
      N(
        'The two Monkeys fight all the way to the Buddha’s hall. The Buddha is talking with his disciples, and he stops, and smiles.',
      ),
      BU(
        'There are four kinds of monkey that the world does not list. This is the one with six ears. He hears everything, from everywhere.',
        'soft',
      ),
      BU('He heard your story, Wukong, and wanted to be you. That is all.'),
      N(
        'The false Monkey tries to run. The Buddha’s golden bowl comes down over him like a lid on a pot.',
      ),
      N(
        'When it lifts, there is only a small monkey with six ears, shaking. Monkey raises his staff.',
      ),
      N('Then he looks at the monk, and at your Nubbin, and lowers it.'),
      MK('Go on. Go. Be yourself somewhere. It’s harder, but it’s yours.', 'soft'),
    ],
    [
      ask(
        1,
        'science',
        'why some animals have big or many ears',
        '4-LS1-2',
        [
          N(
            'The six-eared monkey “hears everything”. Why do animals with large ears often hear well?',
          ),
        ],
        [
          opt(
            'Bigger ears can collect more sound',
            [
              N(
                'Yes. Large ears gather sound waves, like a satellite dish, which is why bats, foxes and elephants have such good hearing.',
              ),
            ],
            true,
          ),
          opt('Large ears keep their eyes warm', [
            N(
              'Some big ears, like an elephant’s, help cool the body, but for hearing it is about collecting sound.',
            ),
          ]),
        ],
        'Your child learned how large ears help animals hear.',
      ),
      ask(
        6,
        'sel',
        'being yourself',
        'CASEL: Self-awareness',
        [
          N(
            'Monkey tells the copycat to be himself, even though it is harder. Why is it worth it?',
          ),
        ],
        [
          opt(
            'Copying someone leaves you without a self of your own',
            [
              N(
                'Yes. Being yourself is harder, but it is the only way to have a life that is truly yours.',
              ),
            ],
            true,
          ),
          opt('Copying is easier, so it is better', [
            N('Easier, yes. Better, not usually.'),
            N('Being yourself is harder and more yours.'),
          ]),
        ],
        'Your child thought about why being yourself is worthwhile.',
      ),
    ],
  ),
  scene(
    'a02-15-complete',
    [
      N(
        'The six-eared monkey runs off into the trees and doesn’t look back. The luggage comes home, a bit dusty.',
      ),
      MO('Wukong. Will you come back? Please?', 'sad'),
      MK('Only if you say it twice.', 'soft'),
      MO('Please.', 'soft'),
      N(
        'Your Nubbin lets go of the tail it has been holding. It has been holding the right one, as it happens, all along.',
      ),
      N(
        'By evening the four of you, and the horse, are walking west again, and nobody mentions the cloud.',
      ),
    ],
    [
      ask(
        2,
        'literacy',
        'what a character wants',
        'RL.3.3',
        [N('Why does Monkey ask the monk to say “please” twice?')],
        [
          opt(
            'He is hurt and wants to be sure he is truly wanted',
            [N('Yes. The repeat shows that he needs to hear it again, to believe it.')],
            true,
          ),
          opt('He is just being annoying', [
            N('It sounds like teasing, but look at his mood: soft.'),
            N('He needs to be sure he is wanted.'),
          ]),
        ],
        'Your child inferred a character’s feelings from a small request.',
      ),
    ],
  ),
];

// ================================================================== A2-16 The Flaming Mountains
const Q16_SCENES: EduScene[] = [
  scene(
    'a02-16-ask',
    [
      N(
        'Ahead the whole land is on fire: the Flaming Mountains, eight hundred li of them. The only way over is a magic palm-leaf fan.',
      ),
      N('It belongs to Princess Iron Fan. She is Red Boy’s mother.'),
      IF(
        'You! You gave my son to that lady! He lives on her island and sweeps her floors now!',
        'angry',
      ),
      MK('He’s happy! He’s learning things! He’s not setting fire to people any more!'),
      N(
        'She takes out the fan and waves it once. Monkey goes flying fifty thousand li, end over end, and out of sight.',
      ),
      N('Your Nubbin steps forward and holds out the red ribbon from Red Boy’s jacket.'),
    ],
    [
      notice(
        0,
        'social-studies',
        'the real Flaming Mountains',
        'D2.Geo.2.K-2',
        [
          N(
            'The Flaming Mountains are real: a range of red sandstone hills in the Turpan area of north-west China, on the old Silk Road.',
          ),
          N(
            'Summer days there can pass 40 °C (104 °F). The real Xuanzang travelled through that region.',
          ),
        ],
        'Your child heard about a real place in China on the Silk Road.',
      ),
      ask(
        4,
        'maths',
        'compare distances: 50,000 li and the Earth',
        '4.MD.A.2',
        [
          N(
            'Fifty thousand li is about 25,000 kilometres, and the Earth is about 40,000 kilometres round. Has Monkey flown more or less than halfway round the world?',
          ),
        ],
        [
          opt(
            'More: half of 40,000 is 20,000, and 25,000 is bigger',
            [
              N(
                'Yes. Monkey has flown more than halfway round the world in a single wave of the fan.',
              ),
            ],
            true,
          ),
          opt('Less than halfway', [
            N('Halfway round would be 20,000 kilometres.'),
            N('25,000 is more than 20,000.'),
          ]),
        ],
        'Your child compared a distance with half the Earth’s circumference.',
      ),
    ],
    [
      {
        id: 'ribbon',
        label: 'Tell her where your Nubbin found it.',
        then: [
          IF('His. That’s his. He was always losing it.', 'sad'),
          N(
            'She holds it for a long time. She doesn’t give you the fan, but she doesn’t blow you away, either.',
          ),
        ],
      },
      {
        id: 'quiet',
        label: 'Let her take it without a word.',
        then: [
          N(
            'She takes it and turns away, and you hear her breathe out, slowly. The door stays open.',
          ),
        ],
      },
    ],
  ),
  scene(
    'a02-16-ask-done',
    [
      N(
        'Monkey comes back with a wind-fixing pill in his cheek, turns into a tiny fly, and gets into her tea.',
      ),
      N(
        'After some time, and some kicking from inside, the princess hands over a fan. Monkey comes out very pleased.',
      ),
    ],
    [
      ask(
        0,
        'literacy',
        'multiple-meaning words: fly',
        'L.3.4',
        [
          N(
            'Monkey turns into a “fly”, and earlier he went “flying” fifty thousand li. What are the two meanings of fly?',
          ),
        ],
        [
          opt(
            'A small insect, and to move through the air',
            [
              N(
                'Yes. The same word spelled the same way can have more than one meaning, and context tells us which.',
              ),
            ],
            true,
          ),
          opt('Only the insect', [
            N('The fan makes Monkey fly through the air, too.'),
            N('Two meanings: insect, and moving through the air.'),
          ]),
        ],
        'Your child found two meanings of "fly" from context.',
      ),
    ],
  ),
  scene(
    'a02-16-fake',
    [
      N('Monkey stands at the edge of the flames and waves the fan with a flourish.'),
      N(
        'The fire leaps up twice as high. He waves again, and it leaps higher still, and his tail starts to smoke.',
      ),
      MK('It’s a fake! She gave me a fake!', 'angry'),
      PG('Run!', 'shock'),
      N('Everybody runs. Pigsy runs fastest, which nobody has ever seen before.'),
      MO('Wukong, your tail. Your tail is on fire.', 'shock'),
    ],
    [
      ask(
        1,
        'science',
        'why fanning makes a fire bigger',
        '4-PS3-2',
        [
          N(
            'Monkey waves the fan, and the fire leaps up higher. Why does fanning a fire make it bigger?',
          ),
        ],
        [
          opt(
            'It brings more air, and fire needs air to burn',
            [
              N(
                'Yes: fanning pushes in fresh air with oxygen, and that feeds the flames. The fan really was a fake.',
              ),
            ],
            true,
          ),
          opt('It cools the fire so it grows', [
            N('Fanning does cool things sometimes, but a hot fire needs the air more.'),
            N('More air makes it burn harder.'),
          ]),
        ],
        'Your child learned that moving air feeds a fire.',
      ),
      ask(
        5,
        'sel',
        'was it fair to trick him? (a think question)',
        'CASEL: Responsible decision-making',
        [
          N(
            'Princess Iron Fan gave Monkey a fake fan, just after he crept into her tea. Who is more in the wrong, and does one trick ever cancel out another?',
          ),
          N('There is no single right answer. Think about it, then choose.'),
        ],
        [
          opt('Monkey: he tricked her first', [
            N(
              'That is a fair answer. Monkey crept into her tea, and she was entitled to be angry.',
            ),
          ]),
          opt('The princess: a fake that burns someone is cruel', [
            N('That is a fair answer. She knew what the fake would do.'),
          ]),
          opt('Both: and neither fixed anything', [
            N('That is a fair answer. Two tricks leave two people angry.'),
          ]),
        ],
        'Your child weighed up two tricks and who was more at fault.',
      ),
    ],
    [
      {
        id: 'tail',
        label: 'Pat out Monkey’s tail.',
        then: [MK('Thank you. That’s my good tail. I only have the one.', 'soft')],
      },
      {
        id: 'laugh',
        label: 'Try very hard not to laugh.',
        then: [
          N('You fail. Your Nubbin fails too, rolling about in the dust.'),
          MK('Yes. All right. It was quite funny.', 'think'),
        ],
      },
    ],
  ),
  scene(
    'a02-16-real',
    [
      N(
        'There is a long and complicated business with the Bull Demon King, Monkey in disguise, and Pigsy in a temper.',
      ),
      N(
        'In the end, Princess Iron Fan comes out herself with the real fan, and gives it to the monk, not to Monkey.',
      ),
      IF(
        'Wave it forty-nine times. Then the fire goes out for ever, and it rains, and things grow.',
        'soft',
      ),
      IF('My boy would have wanted the fire. I think I want the rain.'),
      N(
        'The fan is enormous. It takes you and Sandy together to hold it up, and Monkey to swing it.',
      ),
      N(
        'Your Nubbin sits on top of your head and counts on its paws. It runs out of paws at four, and starts again.',
      ),
    ],
    [
      ask(
        4,
        'maths',
        'divide: 49 waves',
        '3.OA.A.3',
        [
          N(
            'Suppose Monkey swings the fan seven times a minute. How many minutes will forty-nine waves take?',
          ),
        ],
        [
          opt('7 minutes', [N('Yes. 49 ÷ 7 = 7. Seven groups of seven waves.')], true),
          opt('9 minutes', [
            N('Nine minutes at seven a minute would be 63 waves.'),
            N('49 ÷ 7 = 7.'),
          ]),
        ],
        'Your child divided 49 by 7.',
      ),
    ],
  ),
  scene(
    'a02-16-real-done',
    [
      N(
        'Forty-nine, and the flames go out. The first rain in a thousand years comes down, cool and grey, and steam rises everywhere.',
      ),
      N('The steam climbs, cools, and gathers into a small, grey cloud.'),
    ],
    [
      notice(
        1,
        'science',
        'the water cycle in a few steps',
        null,
        [
          N('Rain on hot ground turns partly to steam. Steam is water as a gas.'),
          N(
            'High up it cools into droplets and makes clouds, and clouds make more rain. That is the water cycle.',
          ),
        ],
        'Your child heard how steam, clouds and rain make a cycle.',
      ),
    ],
  ),
  scene(
    'a02-16-complete',
    [
      N(
        'You walk over the Flaming Mountains in the rain. The ground is warm under your feet, and already a bit green.',
      ),
      N(
        'Monkey gives the fan back to Princess Iron Fan, which surprises everyone, including Monkey.',
      ),
      IF('Tell my son I kept his ribbon.', 'soft'),
      MO('We shall tell him.'),
      N('Behind you, the Flaming Mountains steam and hiss, green where there was red.'),
      N(
        'Your Nubbin puts one paw on the damp ground, and a tiny shoot has already pushed through.',
      ),
    ],
    [
      ask(
        2,
        'sel',
        'why a small kindness can change things',
        'CASEL: Relationship skills',
        [N('Why does Princess Iron Fan, who started out angry, end up kind?')],
        [
          opt(
            'The ribbon showed her that someone cared about her son',
            [
              N(
                'Yes. A small kind act told her that she and her son mattered, and it changed how she felt about the pilgrims.',
              ),
            ],
            true,
          ),
          opt('She was tired of fighting', [
            N('That might be part of it, but the ribbon came first.'),
            N('Kindness changed her heart.'),
          ]),
        ],
        'Your child thought about how a small kindness can shift someone’s mood.',
      ),
    ],
  ),
];

// ================================================================== A2-17 Cobweb Cave
const Q17_SCENES: EduScene[] = [
  scene(
    'a02-17-cottage',
    [
      MO(
        'All this way, and you have fetched every meal. Let me fetch one. I am a monk. Begging is my job.',
        'soft',
      ),
      MK('Master, I really think…'),
      MO('Let me.'),
      N(
        'So he goes alone to a pretty cottage at the edge of the trees. Monkey sends you and your Nubbin after him, quietly.',
      ),
      N(
        'Seven women sit in the garden, spinning, very politely. Their eyes are a little too many, and a little too shiny.',
      ),
      SS('A monk? How lovely. Come in. Do sit down. Do stay.', 'soft'),
      N(
        'Your Nubbin tugs your sleeve. There are threads across the path behind the monk, fine as hair, catching the light.',
      ),
    ],
    [
      notice(
        0,
        'social-studies',
        'monks and alms',
        'D2.His.2.K-2',
        [
          N(
            'Buddhist monks have traditionally lived on alms: food that kind people choose to give them.',
          ),
          N('“Begging” in the story means collecting alms, a respected part of a monk’s life.'),
        ],
        'Your child learned what alms means for Buddhist monks.',
      ),
      ask(
        4,
        'maths',
        'multiply: 7 spiders with 8 legs',
        '3.OA.A.3',
        [
          N(
            'The seven women turn out to be spiders, and a spider has eight legs. How many legs is that altogether?',
          ),
        ],
        [
          opt(
            '56',
            [
              N(
                'Yes. 7 × 8 = 56. Eight legs is how you tell a spider from an insect, which has six.',
              ),
            ],
            true,
          ),
          opt('15', [
            N('That adds 7 + 8. Seven spiders with eight legs each means we multiply.'),
            N('7 × 8 = 56.'),
          ]),
        ],
        'Your child distinguished spiders from insects.',
      ),
    ],
  ),
  scene(
    'a02-17-cottage-done',
    [
      N(
        'When he tries to leave, the threads are everywhere. The monk is wrapped up and hung in the doorway like a parcel.',
      ),
      N('Each thread is as fine as a hair, and none of them breaks.'),
    ],
    [
      notice(
        1,
        'science',
        'spider silk is thin and strong',
        '4-LS1-1',
        [
          N(
            'Spiders make silk inside their own bodies. Thread for thread, spider silk is among the strongest natural materials: thin as a hair, yet hard to snap.',
          ),
        ],
        'Your child learned that spider silk is thin but very strong.',
      ),
    ],
  ),
  scene(
    'a02-17-web',
    [
      N(
        'The cottage is really a cave, and the cave is all web. Silk hangs everywhere in great white sheets.',
      ),
      MK('I can cut it, but there’s more every time. It’s like trying to sweep up fog.', 'angry'),
      N('Suppose each of the seven spiders has spun nine metres of thread.'),
      N(
        'Your Nubbin puts one paw on a thread and follows it with its eyes. Then it starts walking along it.',
      ),
      N(
        'It goes round three rocks and under a root, very slowly, to a peg of stone at the back. Every thread comes back here.',
      ),
      SD('Of course. Everything that holds on has to hold on to something.', 'think'),
      MK('Cousin. If I’d been a bit smaller and a lot more patient, I’d have found that.', 'soft'),
    ],
    [
      ask(
        2,
        'maths',
        'multiply: 7 spiders, 9 metres each',
        '3.OA.A.3',
        [
          N(
            'Seven spiders have each spun nine metres of thread. How many metres of silk is that altogether?',
          ),
        ],
        [
          opt('63 metres', [N('Yes. 7 × 9 = 63 metres. No wonder it is like fog.')], true),
          opt('16 metres', [
            N('That adds 7 + 9. Seven equal lengths means we multiply.'),
            N('7 × 9 = 63.'),
          ]),
        ],
        'Your child multiplied 7 × 9.',
      ),
      ask(
        6,
        'sel',
        'patience or strength? (a think question)',
        'CASEL: Self-management',
        [
          N(
            'Monkey could not solve the web by force, but your Nubbin solved it by being patient. When is patience stronger than strength?',
          ),
          N('There is no single right answer. Think about it, then choose.'),
        ],
        [
          opt('When the problem is tangled and force makes it worse', [
            N('That is a fair answer. Cutting the web only added more web.'),
          ]),
          opt('Never: strength gets things done faster', [
            N(
              'That is a fair answer. Strength is useful, though here it was the patient search that won.',
            ),
          ]),
          opt('Both are needed at different times', [
            N(
              'That is a fair answer. Patience found the peg, and a single stroke of force finished the job.',
            ),
          ]),
        ],
        'Your child weighed up patience against force.',
      ),
    ],
    [
      {
        id: 'cut',
        label: 'Untie the anchor thread from the peg.',
        then: [
          N(
            'You untie it. All through the cave, the white sheets go slack, and drift down, and lie on the floor like snow.',
          ),
        ],
      },
      {
        id: 'monkey',
        label: 'Call Monkey to cut it.',
        then: [
          MK('There? That little one? Cousin, you’re a genius.', 'happy'),
          N('One stroke. The whole web sighs down to the floor.'),
        ],
      },
    ],
  ),
  scene(
    'a02-17-out',
    [
      N('Sandy unwraps the monk, who is grey with dust, and furious with himself, and fine.'),
      MO('I wanted to do one thing for you all. One thing.', 'sad'),
      MK('You did. You showed us where the spiders lived.', 'soft'),
      N(
        'The seven spinners have become seven spiders, scuttling for the cracks. Pigsy lifts his rake.',
      ),
      MO('Leave them. Let them spin somewhere else.'),
      N('Pigsy lowers it. Your Nubbin watches the last spider go, and waves.'),
    ],
    [
      ask(
        2,
        'literacy',
        'theme: everyone contributes',
        'RL.4.2',
        [
          N(
            'The monk wanted to do “one thing”. What is the best way to state the idea in this scene?',
          ),
        ],
        [
          opt(
            'Even a mistake can help, and everyone has something to give',
            [
              N(
                'Yes. Monkey turns the monk’s mistake into a contribution, which is a kind way to look at it.',
              ),
            ],
            true,
          ),
          opt('Monks should never beg', [
            N('The scene does not say that.'),
            N('The idea is that everyone can help, even through a mistake.'),
          ]),
        ],
        'Your child stated the theme of a short scene.',
      ),
      notice(
        4,
        'science',
        'spiders help keep insects in balance',
        '3-LS4-3',
        [
          N(
            'Spiders eat large numbers of insects, including pests, so without them there would be far more flies and mosquitoes.',
          ),
          N('Letting them go is a small gift to the gardens nearby.'),
        ],
        'Your child learned that spiders help keep insect numbers in balance.',
      ),
    ],
  ),
  scene(
    'a02-17-complete',
    [
      N('That night the monk eats the supper Monkey fetches, and says thank you twice.'),
      MO('Perhaps it is all right to be the one who is carried, now and then.', 'soft'),
      PG('I’ve always said so. Nobody listens.'),
      N(
        'Your Nubbin has a thread of silk caught round one ear. It keeps it there for days, like a ribbon.',
      ),
      N(
        'Outside the cave mouth the stars come out, and Sandy says that it is a good night for walking.',
      ),
      N('Pigsy has found a log to lean on, and the monk has found someone to talk to.'),
    ],
    [
      notice(
        1,
        'sel',
        'it is okay to receive help',
        'CASEL: Self-awareness',
        [
          N(
            'The monk always carried others’ burdens, and he finds it hard to be carried. Receiving help gracefully is a skill, too.',
          ),
        ],
        'Your child heard that accepting help is part of being kind and strong.',
      ),
    ],
  ),
];

// ================================================================== A2-18 Vulture Peak
const Q18_SCENES: EduScene[] = [
  scene(
    'a02-18-road',
    [
      N(
        'The page says you have been walking for fourteen years. It feels like a long afternoon, and also like a life.',
      ),
      N(
        'The land ahead is quiet and green. People look up from their fields and smile, as if they knew the pilgrims were coming.',
      ),
      MO('Is this it? Wukong, is this it?', 'shock'),
      MK('That’s it, master. That mountain there. You can stop worrying now.', 'soft'),
      N('The monk sits down in the road, and cries, and laughs, and cannot stop doing either.'),
      N(
        'Your Nubbin climbs into his lap. Pigsy sits down too, mainly because everyone else is sitting.',
      ),
    ],
    [
      notice(
        0,
        'social-studies',
        'the Silk Road and the real journey',
        'D2.Geo.2.K-2',
        [
          N(
            'The Silk Road was a web of trade routes linking China with Central Asia, India and beyond.',
          ),
          N(
            'The real Xuanzang followed parts of it. Silk, paper, spices and ideas all travelled the same roads.',
          ),
        ],
        'Your child heard what the Silk Road was.',
      ),
      ask(
        0,
        'maths',
        'time: how long was the real journey?',
        '4.MD.A.2',
        [N('The real Xuanzang left in 629 and came home in 645. How many years was he away?')],
        [
          opt(
            '16 years',
            [
              N(
                'Yes. 645 − 629 = 16. The novel says fourteen, so story and history differ a little.',
              ),
            ],
            true,
          ),
          opt('26 years', [N('Be careful with the tens: 645 − 629.'), N('45 − 29 = 16.')]),
        ],
        'Your child subtracted years to find a time interval.',
      ),
    ],
  ),
  scene(
    'a02-18-boat',
    [
      N(
        'Between you and the mountain runs a wide river. The only bridge is a single slippery log.',
      ),
      N(
        'A ferryman poles over in a boat with no bottom. You can see the water rushing straight through it.',
      ),
      MO('I can’t. It has no bottom. I really can’t.', 'shock'),
      MK('You’ve walked fourteen years on trust, master. Try one more step.'),
      N(
        'Monkey gives him a gentle shove. The monk steps in, and the bottomless boat holds him up as if it were stone.',
      ),
      N('The ferryman smiles at you, and holds out a hand.'),
    ],
    [
      notice(
        1,
        'science',
        'why real boats float',
        '3-PS2-1',
        [
          N('Real boats float because their hulls push aside water, and the water pushes back up.'),
          N('A boat with no bottom could not do that, so this one has to be magic.'),
        ],
        'Your child learned why real boats float.',
      ),
      ask(
        4,
        'sel',
        'trust: when is it wise? (a think question)',
        'CASEL: Responsible decision-making',
        [
          N('Monkey asks the monk to trust him and step into a boat with no bottom.'),
          N('When is it wise to trust a friend, and when is it wise to check first?'),
          N('There is no single right answer. Think about it, then choose.'),
        ],
        [
          opt('Trust when they have earned it over time', [
            N('That is a fair answer. Fourteen years of walking together is a good record.'),
          ]),
          opt('Check first when the risk is big', [
            N(
              'That is a fair answer. A bottomless boat deserves a second look, even from a friend.',
            ),
          ]),
          opt('Both: trust, and keep your eyes open', [
            N('That is a fair answer. Many wise travellers do just that.'),
          ]),
        ],
        'Your child weighed up trust against checking first.',
      ),
    ],
    [
      {
        id: 'step',
        label: 'Step in after him.',
        then: [
          N(
            'Your foot goes onto nothing, and the nothing holds. Your Nubbin hops in after you, looking very pleased with itself.',
          ),
        ],
      },
      {
        id: 'nubbin',
        label: 'Let your Nubbin go first.',
        then: [
          N(
            'Your Nubbin hops in without a second thought; it has never once doubted a boat. You follow it.',
          ),
        ],
      },
    ],
  ),
  scene(
    'a02-18-boat-done',
    [
      N(
        'On the far side, everyone feels lighter, as if they have put down a pack they forgot they were carrying.',
      ),
      N('Nobody had noticed how tired they were until the tiredness went.'),
    ],
    [
      ask(
        0,
        'literacy',
        'a metaphor for worry',
        'L.4.5',
        [
          N(
            '“As if they have put down a pack they forgot they were carrying.” What is the pack really standing for?',
          ),
        ],
        [
          opt(
            'Worries and tension',
            [
              N(
                'Yes. A comparison with a heavy pack helps us feel what carrying worry is like, and how it feels to set it down.',
              ),
            ],
            true,
          ),
          opt('The luggage', [
            N('The luggage is still on the pole.'),
            N('The pack stands for worry and tension.'),
          ]),
        ],
        'Your child read a figure of speech about worry.',
      ),
    ],
  ),
  scene(
    'a02-18-scriptures',
    [
      N(
        'The Buddha’s hall is full of light and very calm. The monk kneels, and Monkey kneels too, without being asked.',
      ),
      BU('You have come a long way. Rest a little, and then take what you came for.', 'soft'),
      N(
        'Disciples bring out scrolls, bundle after bundle. You load them onto the horse and the pole with Sandy, carefully.',
      ),
      N(
        'Halfway down the mountain a wind tears open a bundle. The pages inside are blank, every one.',
      ),
      MO('Blank? After all this? Did we do something wrong?', 'sad'),
      N('You go back up. The Buddha is not cross, and not surprised.'),
      BU('The blank ones are the truest. But in the East, people need words. So: words.', 'soft'),
      N(
        'As thanks, the monk gives the golden bowl the emperor gave him, which is all he has. The new scrolls are full of writing.',
      ),
    ],
    [
      notice(
        2,
        'social-studies',
        'translating and copying texts',
        'D2.His.2.K-2',
        [
          N(
            'The real Xuanzang spent the rest of his life translating the Buddhist texts he brought home into Chinese.',
          ),
          N('Before printing was common, texts were copied by hand, one careful scroll at a time.'),
        ],
        'Your child heard how the real monk’s texts were translated and copied.',
      ),
      ask(
        6,
        'literacy',
        'words and silence (a think question)',
        'RL.4.2',
        [
          N(
            'The Buddha says the blank scrolls are truest, but that people need words. What can words give that silence cannot, and what can silence give that words cannot?',
          ),
          N('There is no single right answer. Think about it, then choose.'),
        ],
        [
          opt('Words let ideas travel across distance and time', [
            N(
              'That is a fair answer. A written page can reach someone far away, long after it was written.',
            ),
          ]),
          opt('Silence lets us notice what words cannot say', [
            N('That is a fair answer. Some things are felt before they can be named.'),
          ]),
          opt('We need both', [N('That is a fair answer. The Buddha seems to say just that.')]),
        ],
        'Your child reflected on what words and silence each offer.',
      ),
    ],
  ),
  scene(
    'a02-18-complete',
    [
      N(
        'Five thousand and forty-eight rolls of scripture, tied up in neat bundles. You and Sandy take the pole between you.',
      ),
      MO('We have them. We actually have them.', 'happy'),
      MK('Told you. India by lunch.', 'happy'),
      PG('It was fourteen years.', 'think'),
      MK('A very long lunch.'),
      N(
        'The mountain behind you glows in the late sun, and the scrolls hang from the pole like a great, patient bird.',
      ),
    ],
    [
      ask(
        3,
        'maths',
        'compare: rolls and days',
        '4.MD.A.2',
        [
          N(
            'Fourteen years is about 5,110 days, and the pilgrims brought back 5,048 rolls. Are there more rolls than days, or fewer?',
          ),
        ],
        [
          opt(
            'Fewer: 5,048 is less than 5,110',
            [N('Yes. That is nearly one roll for every day of the trip.')],
            true,
          ),
          opt('More: 5,048 is bigger', [
            N('Compare digit by digit: 5,0 is below 5,1.'),
            N('5,048 is less than 5,110.'),
          ]),
        ],
        'Your child compared two four-digit numbers.',
      ),
    ],
  ),
];

// ================================================================== A2-19 The Eighty-First Hardship
const Q19_SCENES: EduScene[] = [
  scene(
    'a02-19-turtle',
    [
      N(
        'Far away, Guanyin is reading a list of every hardship the pilgrims met. There were eighty, and there ought to be eighty-one.',
      ),
      GY('One more, then. A gentle one.', 'soft'),
      N(
        'At the River of Heaven, the old white turtle who carried you all across on the way out is waiting, smiling.',
      ),
      N(
        'The page skipped that crossing years ago, between one chapter and the next. The turtle has not skipped anything.',
      ),
      TT(
        'Welcome back. Did you ask the Buddha my question? When I shall stop being a turtle, and become a person?',
      ),
      MO('Oh. Oh, no. I forgot. I am so sorry. I forgot.', 'sad'),
      N(
        'The turtle doesn’t say anything. He just sinks, very slowly and quite sadly, into the river.',
      ),
      N(
        'Everyone goes into the water: monk, Monkey, Pigsy, Sandy, horse, scrolls, you. Your Nubbin is delighted.',
      ),
    ],
    [
      ask(
        5,
        'sel',
        'what to do when you forget something that matters',
        'CASEL: Relationship skills',
        [
          N(
            'The monk forgot the turtle’s question. What is the best thing to do when you forget something that matters to someone?',
          ),
        ],
        [
          opt(
            'Say sorry, and then do what you can to put it right',
            [N('Yes. An honest sorry, followed by an action, is a strong mix.')],
            true,
          ),
          opt('Hope they won’t mind', [
            N('The turtle did mind, quietly.'),
            N('An honest apology and a plan work better.'),
          ]),
        ],
        'Your child thought about how to apologise for forgetting.',
      ),
    ],
  ),
  scene(
    'a02-19-turtle-done',
    [
      N(
        'Your Nubbin swims round and round the turtle, then sits on his shell and pats it, as if to say it was a fair point.',
      ),
      TT('No harm done. I only wanted to be remembered.', 'soft'),
    ],
    [
      notice(
        1,
        'social-studies',
        'oral history: stories keep people remembered',
        'D2.His.2.K-2',
        [
          N(
            'Before most people could read, families kept the past alive by telling it, from grandparent to grandchild.',
          ),
          N(
            'Monkey’s adventures were told aloud in teahouses and acted on stages for centuries, before and after the novel was written down.',
          ),
        ],
        'Your child heard how telling stories aloud keeps people and the past remembered.',
      ),
    ],
  ),
  scene(
    'a02-19-rock',
    [
      N(
        'You all haul the scrolls out of the river and lay them on a big flat rock to dry in the sun.',
      ),
      N(
        'When you lift them, a few of the last pages stick fast to the stone. They tear, and the ends stay behind.',
      ),
      MO(
        'No. No! We came all this way. We crossed the whole world. And now they’re not whole.',
        'sad',
      ),
      N('Monkey looks at the torn edges for a long time. He doesn’t make a joke.'),
      MK(
        'Heaven and earth aren’t whole either, master. Nothing is. These are just honest about it.',
        'soft',
      ),
      MK(
        'Maybe they’re meant to be not quite finished. So there’s room for whoever reads them next.',
      ),
    ],
    [
      notice(
        0,
        'science',
        'drying in sun and wind',
        '2-PS1-4',
        [
          N('Wet paper dries when the water in it turns to vapour and drifts away.'),
          N(
            'Sun warms it, and wind carries the vapour off, which is why a sunny, breezy rock is a good drying place.',
          ),
        ],
        'Your child learned why sun and wind dry wet things.',
      ),
      ask(
        5,
        'sel',
        'is something less valuable if it is unfinished? (a think question)',
        'CASEL: Self-awareness',
        [
          N(
            'Monkey says the scrolls may be meant to be not quite finished. Is something less valuable if it is incomplete?',
          ),
          N('There is no single right answer. Think about it, then choose.'),
        ],
        [
          opt('No: gaps leave room for others', [
            N('That is a fair answer. An unfinished thing can invite the next person in.'),
          ]),
          opt('Yes: complete is better', [
            N(
              'That is a fair answer. Whole things are easier to use, though the monk learns to live with this one.',
            ),
          ]),
          opt('It depends what is missing', [
            N(
              'That is a fair answer. A missing last page and a missing foundation are not the same.',
            ),
          ]),
        ],
        'Your child reflected on the value of unfinished things.',
      ),
    ],
    [
      {
        id: 'peel',
        label: 'Try to peel the last pages free.',
        then: [
          N(
            'You try, very carefully, but they stay where they are. In the end you leave them, and the rock keeps a few words for itself.',
          ),
        ],
      },
      {
        id: 'leave',
        label: 'Leave them on the rock.',
        then: [
          N(
            'You leave them. Your Nubbin pats the torn edges, as if they were a pet that had done its best.',
          ),
        ],
      },
    ],
  ),
  scene(
    'a02-19-rock-done',
    [
      MO('Not quite complete. Yes. All right. That will do.', 'soft'),
      N('The words left on the rock face the sun, ending in the middle of a sentence.'),
    ],
    [
      doIt(
        1,
        'literacy',
        'write the missing words',
        'RL.3.3',
        'edu:write:sentence:missing-words',
        [
          N(
            '(Write one sentence that could finish the torn page. What would a traveller like to read next?)',
          ),
        ],
        'Your child wrote an ending to an unfinished sentence.',
      ),
    ],
  ),
  scene(
    'a02-19-home',
    [
      N(
        'The city of Chang’an turns out to meet you. The pines by the monastery gate, people say, all turned to point east the morning he came home.',
      ),
      N(
        'The emperor himself walks out to meet the monk, and the scrolls are carried in with music.',
      ),
      N(
        'Then, before anyone has finished cheering, the pilgrims are lifted back to Vulture Peak on a soft wind.',
      ),
      N('The Buddha gives each of them a new name. The monk becomes a buddha, and so does Monkey.'),
      MK(
        'A buddha! Me! Then take this band off, master. A buddha in a headband looks silly.',
        'happy',
      ),
      MO('Touch your head, Wukong.', 'soft'),
      N('Monkey touches his head, and the band is gone. Nobody saw it go.'),
    ],
    [
      notice(
        0,
        'social-studies',
        'Chang’an is Xi’an',
        'D2.Geo.2.K-2',
        [
          N(
            'Chang’an was a real capital city, the eastern end of the Silk Road. Today it is called Xi’an.',
          ),
          N(
            'A tall pagoda built there to keep the scrolls, the Great Wild Goose Pagoda, still stands.',
          ),
        ],
        'Your child heard that Chang’an is today’s Xi’an and where the scrolls were kept.',
      ),
      ask(
        0,
        'science',
        'shadows at sunrise',
        '5-ESS1-2',
        [
          N(
            'The pines point east, towards the rising sun. At sunrise, which way do the pines’ shadows point?',
          ),
        ],
        [
          opt(
            'West, away from the sun',
            [
              N(
                'Yes. A shadow points away from its light, so sunrise shadows are long and fall to the west.',
              ),
            ],
            true,
          ),
          opt('East, towards the sun', [
            N('A shadow always falls on the side away from the light.'),
            N('The sun is in the east, so shadows fall west.'),
          ]),
        ],
        'Your child worked out the direction of a sunrise shadow.',
      ),
    ],
  ),
  scene(
    'a02-19-complete',
    [
      MK('Gone. It went when I stopped needing it. Of course it did.', 'soft'),
      N(
        'He turns to you. His eyes are still little suns, but kinder now, the way the sun is kinder in the evening.',
      ),
      MK('You believed me once, when nobody else did. On the ridge. I never forgot.', 'soft'),
      MO(
        'And you were right. I was afraid, and I called it being careful. I am glad he came back.',
        'soft',
      ),
      N('He plucks a hair and blows on it. It becomes a thin gold band, just Nubbin-sized.'),
      MK(
        'This one does nothing at all. It doesn’t tighten. It doesn’t come off unless you want it to. That’s the best kind.',
        'happy',
      ),
      MK(
        'And here. A little cloud. For when your Grove feels too big. Somersault, Cousin, and there you are.',
      ),
      N(
        'Your Nubbin tries the cloud at once, rolls over twice, and lands in your arms. Then the page turns, and you are home.',
      ),
    ],
    [
      ask(
        3,
        'sel',
        'admitting you were afraid',
        'CASEL: Self-awareness',
        [
          N(
            'The monk says, “I was afraid, and I called it being careful.” Why is that a brave thing to say?',
          ),
        ],
        [
          opt(
            'It means looking honestly at your own feelings',
            [N('Yes. Naming a fear for what it is takes courage, and often helps mend things.')],
            true,
          ),
          opt('It is not brave, it is just an excuse', [
            N('An excuse hides the truth. The monk is doing the opposite.'),
            N('Naming the fear honestly is brave.'),
          ]),
        ],
        'Your child thought about why admitting fear is brave.',
      ),
      doIt(
        7,
        'art',
        'make a shadow puppet',
        'ELOF: Approaches to Learning',
        'edu:shadow:hand:monkey',
        [
          N(
            '(Hold your hand between a lamp and a wall. Shape a monkey with your fingers, and make it somersault across the wall.)',
          ),
        ],
        'Your child made a shadow puppet with their hands.',
      ),
    ],
  ),
];

// ================================================================== variants (a02-believed = monk)
const A02_VARIANTS: EduScene[] = [
  scene(
    'a02-15-which-monk',
    [
      N(
        'The two Monkeys tumble down out of the sky and land in the road in front of the monk, still fighting.',
      ),
      N(
        'One of them steps back, and the other steps back too, in exactly the same way. Both look at you.',
      ),
      MK(
        'On White Tiger Ridge you took his side, not mine. You said you can’t strike on a hunch.',
        'sad',
      ),
      FM(
        'On White Tiger Ridge you took his side, not mine. You said you can’t strike on a hunch.',
        'sad',
      ),
      N(
        'Two voices, one sentence. Both faces are looking at you, hopeful and furious, exactly alike.',
      ),
      MK('So no hunches now, Cousin’s keeper. Tell them. Which one of us is me?'),
      N('Your Nubbin is holding both their tails, one in each paw, and won’t let go of either.'),
    ],
    [
      ask(
        6,
        'sel',
        'a rule you made yourself (a think question)',
        'CASEL: Self-awareness',
        [
          N(
            'On the ridge you said you cannot strike on a hunch, and now you cannot tell which Monkey is real. Does that rule still help?',
          ),
          N('There is no single right answer. Think about it, then choose.'),
        ],
        [
          opt('Yes: it tells me not to guess', [
            N(
              'That is a fair answer. The rule you chose before protects you now from a confident mistake.',
            ),
          ]),
          opt('It helps, but I still need a way to find out', [
            N(
              'That is a fair answer. A rule keeps us from harm, and finding the answer needs some other tool.',
            ),
          ]),
        ],
        'Your child applied a rule they had chosen to a new problem.',
      ),
    ],
    [
      {
        id: 'left',
        label: 'Point at the one on the left.',
        then: [
          FM('Ha! You see? The little luggage-carrier knows me.', 'happy'),
          MK('Ha! You see? The little luggage-carrier knows me.', 'happy'),
          N(
            'They say it at the same moment, in the same voice, with the same grin. Your pointing finger feels very foolish.',
          ),
          MK('That settles nothing, Cousin’s keeper. I’m sorry I asked.', 'sad'),
        ],
      },
      {
        id: 'right',
        label: 'Point at the one on the right.',
        then: [
          MK('There! Somebody with eyes in their head at last.', 'happy'),
          FM('There! Somebody with eyes in their head at last.', 'happy'),
          N('Both of them bow to you. Both bows are exactly as deep, and exactly as rude.'),
          MK('That settles nothing, Cousin’s keeper. I’m sorry I asked.', 'sad'),
        ],
      },
      {
        id: 'plain',
        label: 'Say it plainly: “I can’t tell. I won’t pretend I can.”',
        then: [
          N('Both Monkeys open their mouths, and then neither of them says anything at all.'),
          MK('Good. Everyone else has been guessing, and guessing is how you lose a monk.', 'soft'),
          SD('Then we stop asking people who can’t know, and go to the one who does.'),
        ],
      },
    ],
  ),
  scene(
    'a02-19-complete-monk',
    [
      MK('Gone. It went when I stopped needing it. Of course it did.', 'soft'),
      N(
        'He turns to you. His eyes are still little suns, but kinder now, the way the sun is kinder in the evening.',
      ),
      MK(
        'On the ridge you took his side. I was so angry. You were right not to just take my word, though.',
        'soft',
      ),
      MO(
        'And he was right about the demon. We were both a little right. That is how it usually goes.',
        'soft',
      ),
      N('Monkey plucks a hair and blows on it. It becomes a thin gold band, just Nubbin-sized.'),
      MK(
        'This one does nothing at all. It doesn’t tighten. It doesn’t come off unless you want it to. That’s the best kind.',
        'happy',
      ),
      MK(
        'And here. A little cloud. For when your Grove feels too big. Somersault, Cousin, and there you are.',
      ),
      N(
        'Your Nubbin tries the cloud at once, rolls over twice, and lands in your arms. Then the page turns, and you are home.',
      ),
    ],
    [
      ask(
        3,
        'sel',
        'two people can both be partly right',
        'CASEL: Social awareness',
        [
          N(
            'The monk says, “We were both a little right.” Can two people who disagree both be partly right?',
          ),
        ],
        [
          opt(
            'Yes: each may see a different part of the truth',
            [N('Yes. Hearing the other side can show us the part we missed.')],
            true,
          ),
          opt('No: one must be wrong', [
            N('Sometimes, but not always.'),
            N('Often each sees part of it.'),
          ]),
        ],
        'Your child considered that two people can each be partly right.',
      ),
      doIt(
        7,
        'art',
        'make a shadow puppet',
        'ELOF: Approaches to Learning',
        'edu:shadow:hand:monkey',
        [
          N(
            '(Hold your hand between a lamp and a wall. Shape a monkey with your fingers, and make it somersault across the wall.)',
          ),
        ],
        'Your child made a shadow puppet with their hands.',
      ),
    ],
  ),
];

// ================================================================== quests
const g = (goal: string, hint: string) => ({ goal, hint });

const quest = (
  n: string,
  title: string,
  goals: EduQuest['goals'],
  scenes: EduScene[],
  glossary: GlossaryEntry[] = [],
): EduQuest => ({
  id: `reader:a02-${n}`,
  of: `a02-${n}`,
  band: 'reader',
  title,
  goals,
  scenes,
  ...(glossary.length ? { glossary } : {}),
});

export const EDU_A02_READER: EduQuest[] = [
  quest(
    '01',
    'Born from Stone',
    {
      'a02-01-s1': g(
        'Step into the painted page and climb to the stone egg at the top.',
        'Touch the page, then follow the smell of peaches uphill.',
      ),
      'a02-01-s2': g(
        'Watch the stone egg hatch.',
        'Stay close to the egg. Your Nubbin knows what hatching sounds like.',
      ),
      'a02-01-s3': g(
        'Look down from the clouds with Heaven’s court.',
        'Follow the gold light up to the Hall of Divine Mists.',
      ),
    },
    Q01_SCENES,
    [
      gloss(
        'weathering',
        'The slow wearing away of rock by wind, rain and ice.',
        'a02-01-page-done',
      ),
      gloss('herald', 'A messenger who brings important news.', 'a02-01-heaven'),
    ],
  ),
  quest(
    '02',
    'The Water-Curtain Cave',
    {
      'a02-02-s1': g(
        'Follow the stream up to its waterfall.',
        'Walk up beside the stream with the monkeys.',
      ),
      'a02-02-s2': g(
        'Leap through the waterfall and look behind it.',
        'Dive after Monkey. Water is not a wall.',
      ),
      'a02-02-s3': g('Sit at the feast in the cave.', 'Find a seat near Monkey in the cave.'),
    },
    Q02_SCENES,
    [gloss('immortal', 'Someone who never dies or never grows old, in stories.', 'a02-02-king')],
  ),
  quest(
    '03',
    'Lessons in Shape-Changing',
    {
      'a02-03-s1': g(
        'Visit Monkey’s teacher in his cave.',
        'Climb the quiet mountain with Monkey.',
      ),
      'a02-03-s2': g(
        'Wait on the back step through the night.',
        'Sit outside the back door and keep still.',
      ),
      'a02-03-s3': g('Watch Monkey show off under the pines.', 'Stand in the yard and watch.'),
    },
    Q03_SCENES,
    [
      gloss(
        'watch',
        'In old China, one of the five parts into which the night was divided.',
        'a02-03-night',
      ),
    ],
  ),
  quest(
    '04',
    'Havoc in Heaven',
    {
      'a02-04-s1': g('Visit the heavenly stables.', 'Go up to Heaven with Monkey.'),
      'a02-04-s2': g(
        'Look at the peach trees in the garden.',
        'Walk slowly. Your Nubbin is watching the peaches.',
      ),
      'a02-04-s3': g('Watch what happens at the banquet.', 'Follow Monkey to the Jade Pool.'),
    },
    Q04_SCENES,
    [
      gloss('banquet', 'A large, grand meal for many guests.', 'a02-04-banquet'),
      gloss(
        'elixir',
        'A magic liquid or pill, said to heal or make people live longer.',
        'a02-04-banquet',
      ),
    ],
  ),
  quest(
    '05',
    'Under the Mountain',
    {
      'a02-05-s1': g('Wait by the furnace door.', 'Sit by the furnace. Your Nubbin will not move.'),
      'a02-05-s2': g('Talk with the Buddha by his open palm.', 'Stand near the Buddha’s wrist.'),
      'a02-05-s3': g('Sit with Monkey under the mountain.', 'Climb down and sit by his free hand.'),
    },
    Q05_SCENES,
    [gloss('wager', 'A bet: an agreement about who wins, and what they get.', 'a02-05-palm')],
  ),
  quest(
    '06',
    'The Monk',
    {
      'a02-06-s1': g('Carry the monk’s luggage along the road.', 'Take the luggage when he asks.'),
      'a02-06-s2': g(
        'Climb the mountain and peel off the gold paper.',
        'Hold the monk’s staff and push when he slips.',
      ),
      'a02-06-s3': g('Wait at the roadside while tempers cool.', 'Sit down by the road and wait.'),
    },
    Q06_SCENES,
    [
      gloss('disciple', 'A student or follower of a teacher.', 'a02-06-seal'),
      gloss(
        'sheepish',
        'A little embarrassed, because you know you did something silly.',
        'a02-06-band',
      ),
    ],
  ),
  quest(
    '07',
    'The White Dragon Horse',
    {
      'a02-07-s1': g('Walk to Eagle Grief Stream.', 'Follow the sound of rushing water.'),
      'a02-07-s2': g('Talk with the lady of the willow branch.', 'Stand at the water’s edge.'),
      'a02-07-s3': g('Watch the dragon change.', 'Stay close to the bank.'),
    },
    Q07_SCENES,
    [
      gloss(
        'erosion',
        'The slow carrying away of rock and soil by water, wind or ice.',
        'a02-07-stream',
      ),
      gloss(
        'bodhisattva',
        'In Buddhism, a wise and kind being who helps others find peace.',
        'a02-07-guanyin',
      ),
    ],
  ),
  quest(
    '08',
    'The Stolen Robe',
    {
      'a02-08-s1': g('Visit the monastery’s guest hall.', 'Go inside with the monk.'),
      'a02-08-s2': g('Look into the smoke in the guest hall.', 'Follow your Nubbin to the door.'),
      'a02-08-s3': g(
        'Find the robe on Black Wind Mountain.',
        'Carry the little round pill up on a dish.',
      ),
    },
    Q08_SCENES,
    [
      gloss('abbot', 'The head of a monastery.', 'a02-08-hall'),
      gloss('dormitory', 'A big room where many people sleep.', 'a02-08-fire'),
    ],
  ),
  quest(
    '09',
    'Pigsy',
    {
      'a02-09-s1': g('Talk with Old Gao at the farm.', 'Listen to his story.'),
      'a02-09-s2': g(
        'Wait quietly in the back house at night.',
        'Hide behind the screen with your Nubbin.',
      ),
      'a02-09-s3': g('Talk with Pigsy outside his cave.', 'Bring the flowers your Nubbin kept.'),
    },
    Q09_SCENES,
    [
      gloss(
        'snout',
        'The long front part of an animal’s face, with its nose and mouth.',
        'a02-09-gao',
      ),
      gloss('marshal', 'A high-ranking officer.', 'a02-09-cave'),
    ],
  ),
  quest(
    '10',
    'Sandy',
    {
      'a02-10-s1': g('Walk to the River of Flowing Sands.', 'Follow the monk to the bank.'),
      'a02-10-s2': g('Swim down and meet the river spirit.', 'Follow your Nubbin into the river.'),
      'a02-10-s3': g('Wait on the bank for Moksa.', 'Sit by the water and wait.'),
    },
    Q10_SCENES,
    [
      gloss(
        'personification',
        'Describing a thing as if it were a person, with feelings or actions.',
        'a02-10-under-done',
      ),
    ],
  ),
  quest(
    '11',
    'The Ginseng Fruit',
    {
      'a02-11-s1': g('Visit the quiet temple.', 'Walk in with the monk.'),
      'a02-11-s2': g('Look at the tree in the garden.', 'Go through to the garden.'),
      'a02-11-s3': g(
        'Carry water to the fallen tree.',
        'Fetch jade cups of water and pour gently.',
      ),
    },
    Q11_SCENES,
    [
      gloss('acolyte', 'A helper or junior member of a temple.', 'a02-11-temple'),
      gloss('ginseng', 'A plant whose root is used in traditional medicine.', 'a02-11-temple'),
    ],
  ),
  quest(
    '12',
    'The White Bone Demon',
    {
      'a02-12-s1': g('Watch the girl on White Tiger Ridge.', 'Stay by the monk.'),
      'a02-12-s2': g(
        'Watch the old woman on the ridge.',
        'Stay by the monk, and keep your Nubbin close.',
      ),
      'a02-12-s3': g(
        'Choose whom to believe.',
        'Think about what you saw and what you were told. Then say why.',
      ),
      'a02-12-s4': g(
        'Walk to the Mountain of Flowers and Fruit.',
        'Go with Pigsy. It is easier with two.',
      ),
    },
    Q12_SCENES,
    [
      gloss('disguise', 'Clothes or a shape you use to hide who you really are.', 'a02-12-girl'),
      gloss('evidence', 'Facts or clues that help show whether something is true.', 'a02-12-girl'),
    ],
  ),
  quest(
    '13',
    'The Magic Gourd',
    {
      'a02-13-s1': g('Talk with Monkey in the pine wood.', 'Listen to the rule of the gourd.'),
      'a02-13-s2': g(
        'Wait at the cave and do not answer.',
        'Keep your mouth shut. So does your Nubbin.',
      ),
      'a02-13-s3': g('Watch the gourd get swapped.', 'Stay still and quiet.'),
    },
    Q13_SCENES,
  ),
  quest(
    '14',
    'Red Boy',
    {
      'a02-14-s1': g(
        'Look at the boy tied to the pine tree.',
        'Look at your Nubbin, then at the boy.',
      ),
      'a02-14-s2': g('Carry water to Monkey at Fire Cloud Cave.', 'Run with the bucket.'),
      'a02-14-s3': g('Talk with Guanyin at the cave.', 'Stand by the lotus seat.'),
    },
    Q14_SCENES,
  ),
  quest(
    '15',
    'The Two Monkeys',
    {
      'a02-15-s1': g('Carry the luggage along the road.', 'Hold on to the pack.'),
      'a02-15-s2': g('Watch the two Monkeys at the South Sea.', 'Stand beside Guanyin.'),
      'a02-15-s3': g(
        'Choose which Monkey is the real one.',
        'It is allowed to say you cannot tell.',
      ),
      'a02-15-s4': g(
        'Talk with the Buddha at the monastery.',
        'Follow the two Monkeys into the hall.',
      ),
    },
    Q15_SCENES,
    [
      gloss(
        'symmetry',
        'When one half of a shape matches the other half, like a mirror image.',
        'a02-15-twins',
      ),
    ],
  ),
  quest(
    '16',
    'The Flaming Mountains',
    {
      'a02-16-s1': g('Talk with Princess Iron Fan.', 'Hold out the red ribbon.'),
      'a02-16-s2': g('Watch Monkey try the fan.', 'Stand well back from the flames.'),
      'a02-16-s3': g('Carry the real fan across the mountains.', 'Hold it up with Sandy.'),
    },
    Q16_SCENES,
  ),
  quest(
    '17',
    'Cobweb Cave',
    {
      'a02-17-s1': g(
        'Visit the pretty cottage at the edge of the trees.',
        'Follow the monk quietly.',
      ),
      'a02-17-s2': g('Find where the web is tied.', 'Follow one thread with your Nubbin.'),
      'a02-17-s3': g('Help the monk out of the cave.', 'Walk him to the cave mouth.'),
    },
    Q17_SCENES,
    [
      gloss('alms', 'Food or gifts given freely to monks or those in need.', 'a02-17-cottage'),
      gloss('anchor', 'A fixed point that holds something in place.', 'a02-17-web'),
    ],
  ),
  quest(
    '18',
    'Vulture Peak',
    {
      'a02-18-s1': g(
        'Walk the green road to Vulture Peak.',
        'Follow Monkey. He knows the way now.',
      ),
      'a02-18-s2': g(
        'Cross the river in the bottomless boat.',
        'Take one step. Your Nubbin will help.',
      ),
      'a02-18-s3': g(
        'Talk with the Buddha and take the scrolls.',
        'Load the horse and the pole gently.',
      ),
    },
    Q18_SCENES,
    [
      gloss('pilgrim', 'A person who makes a long journey for a holy reason.', 'a02-18-road'),
      gloss('scripture', 'A holy text.', 'a02-18-complete'),
    ],
  ),
  quest(
    '19',
    'The Eighty-First Hardship',
    {
      'a02-19-s1': g('Swim with the old white turtle.', 'Dive in. Your Nubbin is already there.'),
      'a02-19-s2': g('Lay the scrolls on the rock to dry.', 'Set them out in the sun, one by one.'),
      'a02-19-s3': g('Bring the scrolls home to Chang’an.', 'Walk to the city gate with the monk.'),
    },
    Q19_SCENES,
    [
      gloss(
        'hardship',
        'Something difficult or painful that you have to get through.',
        'a02-19-turtle',
      ),
    ],
  ),
];

/** Reader versions of every scene in ATLAS_A02_VARIANTS. */
export const EDU_A02_READER_VARIANTS: EduScene[] = A02_VARIANTS;

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  'edu:rub:hands:warm',
  'edu:write:sentence:missing-words',
  'edu:shadow:hand:monkey',
];
