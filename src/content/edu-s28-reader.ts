/**
 * The Learning Grove, reader band (ages 7–10): S28, the side story of Parcel, the polite stray
 * with a label who moves in with Byte.
 *
 *   Teaches (from the outline): being a good neighbour, saying sorry and thank you; measuring in
 *   the kitchen (temperature, timing, the cold-saucer test); Seville oranges and why marmalade uses
 *   them; what labels and addresses are for; children who once travelled with labels, and why
 *   welcome matters. Also: multiplying and subtracting with jars and spoons, time to five minutes,
 *   sound as vibration, glass and warmth, a seed's life cycle, layers and trapped air, how a
 *   wound spring drives a watch, similes, and theme. Think questions (no best answer): keeping a
 *   secret (s28-for-byte), whether Parcel is a thief (s28-glasshouse), whether Null's timetable is
 *   fair (s28-null-minder) and why Hazel chose Byte (s28-why).
 *
 * Source: side-stories-s28.ts. One EduScene per original scene (every step scene, every done
 * scene, the complete scene and every variant, including Byte's bark pool), id
 * `reader:<original id>`. Every choice keeps its original id and `set`. See EDU-STYLE.md.
 *
 * - No lifted text. The tag and the back of Hazel's recipe card use new words of our own.
 * - Canon: Parcel never speaks (it bows, stares and gestures). Moss speaks only to you, in
 *   chapter 8; Byte cannot hear him yet. Hazel appears only in chapter 11 here; earlier, only her
 *   handwriting. She is very poorly, said plainly, with comfort after. Mr Grue is a grump, not a
 *   villain. Pixel is she/her.
 * - Facts: setting point 104.5 °C (about 220 °F), water boils at 100 °C at sea level; Seville
 *   oranges are bitter and rich in pectin, named after Seville in Spain; sugar in high amounts
 *   preserves fruit; glass lets sunlight in and holds warmth; layers trap air, which slows heat
 *   loss; a wound mainspring stores energy that gears pass to the hands. The British evacuation
 *   of children from cities in 1939, with name labels, is well documented. The jar and spoon
 *   numbers (15 spoons a jar) are story numbers.
 */
import type { EduQuest, EduScene, Lesson, GlossaryEntry } from './types';
import type { Line, Choice } from '../config/story';

type Mood = NonNullable<Line['mood']>;

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const Y = say('you');
const BY = say('byte');
const M = say('moss');
const PX = say('pixel');
const HZ = say('hazel');
// new speakers (declared in the source quest)
const GR = say('mr-grue');
const CA = say('s28-carter');
const DO = say('s28-dot');

// ---------------------------------------------------------------- builders
type LessonIn = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const opt = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

/** Builds `reader:<of>` and numbers its lessons `reader:<of>-l1`, `-l2` in play order. */
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

// ---------------------------------------------------------------- shared pieces
/** Step 10: the second half of Byte's sentence. Ends both cart-stop choices. */
const KEEPING: Line[] = [
  BY('…and I’m keeping it.', 'soft'),
  BY(
    'That was the end of the sentence. I never asked for it, and I’m keeping it. You left before the end.',
    'soft',
  ),
  N(
    'He takes the tag gently, turns it over, and writes on the blank back with the pencil from behind his ear.',
  ),
  N('His own name, his own house, “Next to Mr Grue’s”, and under it, in neat capitals: RECEIVED.'),
  N(
    'Parcel looks at the back of its tag for a long time. Then it bows, and lets Byte carry it home inside his coat.',
  ),
];

/** Step 8: what you offer Mr Grue for his oranges. Pays off in step 13. */
const OFFER: Choice[] = [
  {
    id: 'jar',
    label: 'Promise him the first jar of marmalade.',
    set: { 's28-offer': 'jar' },
    then: [
      Y('The first jar we make. It’s yours.'),
      GR('The first jar. Not the second. I’ll know.', 'think'),
      N(
        'He puts five oranges in a paper bag, then a sixth, scowling at it as if it jumped in on its own.',
      ),
    ],
  },
  {
    id: 'weed',
    label: 'Offer to weed his glasshouse for a morning.',
    set: { 's28-offer': 'weed' },
    then: [
      Y('I’ll weed the glasshouse. A whole morning.'),
      GR('There aren’t any weeds. …There are some weeds. Saturday. Early.', 'think'),
      N(
        'He fills a paper bag with oranges, then holds the lamp for you all the way back to the hedge.',
      ),
    ],
  },
  {
    id: 'stare',
    label: 'Give him a hard stare of your own.',
    set: { 's28-offer': 'stare' },
    then: [
      N('You look at Mr Grue, long and level. You think about lighthouses.'),
      GR('Oh, not you as well.', 'shock'),
      N(
        'He lasts six seconds. Then he pushes a bag of oranges into Byte’s hands and goes in, muttering.',
      ),
    ],
  },
];

/** Step 13 complete: the opening shared by all three versions. */
const LOG_OPEN: Line[] = [
  N(
    'When the cake is crumbs, Byte stands up with his notebook, PARCEL: INCIDENTS. It has got quite fat since the autumn.',
  ),
  BY('I’m going to read the log. It’s procedure. Also, I want to.', 'think'),
  BY(
    'Incidents. Bath, flood. Fence, Grue. Pyramid, jam. Glasshouse, oranges. Snow. Watch, eleven pieces.',
    'think',
  ),
];

/** Step 13 complete: the gifts, shared by all three versions. */
const GIFTS: Line[] = [
  N(
    'Parcel climbs down off its chair and gives you Hazel’s jar from the Hollow, the empty one, washed. Then it bows.',
  ),
  N(
    'Byte gives your Nubbin a rain hat with room under it for half a sandwich. Parcel already has one: parity.',
  ),
  N('And a luggage tag on string, lettered by Byte in neat capitals: RECEIVED.'),
  N(
    'At the door, Mr Grue gives you a cutting from the orange tree in damp newspaper, and says it probably won’t take.',
  ),
  N('It will. You can tell from how carefully he wrapped it.'),
];

/** Theme beat for every complete scene: a think question, no marked answer. */
const themeBeat = (after: number): LessonIn => ({
  domain: 'literacy',
  skill: 'finding the theme of a story',
  standard: 'RL.4.2',
  kind: 'ask',
  after,
  prompt: [
    N('Byte started the log to count Parcel’s mistakes. What do you think his longest column is saying?'),
  ],
  options: [
    opt('That kindness counts, even when you can’t measure it.', [
      N('That’s a fair answer. Byte’s best column is the one that isn’t a measurement.'),
    ]),
    opt('That Parcel did far more good than harm.', [
      N('That’s a fair answer. Byte set out to count mistakes, and the page told him something else.'),
    ]),
    opt('That Byte changed his mind about Parcel.', [
      N('That’s a fair answer. A man who trusts proof had to trust what he saw. That is a big change.'),
    ]),
  ],
  parentNote: 'Thought about what the story is saying, with no single right answer.',
});

/** Step 13 done: the watch, shared by all three versions. */
const watchBeat = (after: number): LessonIn => ({
  domain: 'maths',
  skill: 'multiplication as equal groups, with time',
  standard: '3.OA.A.3',
  kind: 'ask',
  after,
  prompt: [
    PX(
      'Before I fixed it, it lost four minutes every day. How many minutes would it lose in a week?',
      'think',
    ),
  ],
  options: [
    opt(
      '28 minutes',
      [
        PX(
          'Yes! Seven days, four minutes each: 7 × 4 = 28. Nearly half an hour late by Sunday.',
          'happy',
        ),
      ],
      true,
    ),
    opt('11 minutes', [
      PX('That’s 7 + 4. We want seven lots of four: 4, 8, 12, 16, 20, 24, 28. So 28 minutes.'),
    ]),
    opt('4 minutes', [
      PX('That’s just one day. A week is seven days of four minutes: 7 × 4 = 28.'),
    ]),
  ],
  parentNote: 'Multiplied 7 × 4 to work out how far a slow watch drifts in a week.',
});

/** Step 6 done: shared vocabulary beat for the three log scenes. */
const incidentBeat = (after: number): LessonIn => ({
  domain: 'literacy',
  skill: 'working out what a word means from the sentence around it',
  standard: 'L.2.4',
  kind: 'notice',
  after,
  lines: [
    N('An “incident” is something that happens, usually something that goes a bit wrong.'),
    N(
      'Byte’s log was built for incidents. Null and Parcel becoming friends doesn’t fit there neatly, which is the point.',
    ),
  ],
  parentNote: 'Learned the word “incident” from how Byte uses it.',
});

// ================================================================== S28
const SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: the carrier's cart
  scene(
    's28-cart',
    [
      N('The morning after the Hollow. You slept badly, with Gran Hazel’s notebook under your pillow.'),
      N(
        'Hooves in the lane. The carrier’s cart pulls up at the gate, and the carter leans down without getting off.',
      ),
      CA('Morning. Got a passenger for this end of the valley. Wouldn’t give its name.'),
      N(
        'On a crate in the back sits a small brown Nubbin, very upright, with a basket on its knees.',
      ),
      N('It sees you, and bows. Not a nod: a proper bow, from the middle.'),
      N('Round its neck, on a piece of string, hangs a luggage tag.'),
      N('“Please be kind to this small one. It has come a long way.”'),
      N('Underneath, smaller: “For Byte. H.”'),
      CA(
        'Never saw who put it on. It was sat on the milestone at the ford, with a plum on its head for the fare.',
      ),
      N(
        'You know that handwriting. You have read a letter in it so many times the folds have gone soft.',
      ),
      N('The ink has run a little, in some old rain. It doesn’t say where she is, or how she is.'),
      N(
        'The Nubbin climbs down off the cart with great care, one step at a time, and waits by your boot.',
      ),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'what labels and addresses are for',
        standard: 'D2.Geo.2.K-2',
        kind: 'ask',
        after: 7,
        prompt: [
          N(
            'A label usually says who a thing is for and where it should go. What is missing from this one?',
          ),
        ],
        options: [
          opt(
            'An address: it doesn’t say where Byte lives.',
            [
              N(
                'Exactly. A name says who; an address says where. Luckily the carter only had one end of the valley to try.',
              ),
            ],
            true,
          ),
          opt('The name of the person it’s for.', [
            N(
              'Look again: “For Byte.” The name is there. What’s missing is the address, the where.',
            ),
          ]),
          opt('Nothing at all.', [
            N(
              'It has a name, but no address: no house, no lane, no village. Without one, a parcel relies on someone who knows.',
            ),
          ]),
        ],
        parentNote:
          'Thought about what a label needs: a name to say who, and an address to say where.',
      },
    ],
  ),
  scene(
    's28-for-byte',
    [
      N(
        'Byte opens his door before you knock. He has a pencil behind each ear, in case one runs out.',
      ),
      BY('That’s a Nubbin. Why have you brought me a Nubbin? I didn’t order a Nubbin.', 'shock'),
      N(
        'The Nubbin bows to him, from the middle. After a long moment Byte bows back, very slightly, in case it’s a trick.',
      ),
      N('He reads the tag, then the back of the tag, which is blank, then the front again.'),
      BY('“For Byte. H.” Who’s H.?', 'think'),
      N('You think you know. But you can’t prove it, and you don’t know where Gran Hazel is.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'honesty and when to share what you know',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 5,
        prompt: [
          N('Is keeping what you suspect to yourself the same as lying?'),
        ],
        options: [
          opt('No. You can wait until you’re sure.', [
            N(
              'That’s a fair answer. A guess said too soon can hurt, and waiting to be sure can be kind.',
            ),
          ]),
          opt('Sort of. Byte has a right to know.', [
            N(
              'That’s a fair answer too. It’s his parcel, and his question. Hiding a clue can feel like a fib.',
            ),
          ]),
          opt('It depends why you keep it.', [
            N(
              'A thoughtful answer. Keeping quiet to protect someone is different from keeping quiet to trick them.',
            ),
          ]),
        ],
        parentNote:
          'Thought about the difference between keeping something to yourself and being dishonest.',
      },
    ],
    [
      {
        id: 'told',
        label: 'Tell him it’s Hazel’s hand.',
        set: { 's28-told': true },
        friendship: { byte: 1 },
        then: [
          Y('It’s Hazel’s writing. I’d know it anywhere.'),
          N(
            'Byte goes very still. He holds the tag up to the window, as if her hand might show through the card.',
          ),
          BY('She’s been gone since the snow. Where did it get on?', 'shock'),
          Y('The ford. That’s all the carter knows.'),
          BY('Then that’s all we know. Right. I’ll want to work out the rest.', 'think'),
        ],
      },
      {
        id: 'kept',
        label: 'Keep it to yourself for now.',
        set: { 's28-told': false },
        then: [
          N(
            'You let the question go by. It’s only an initial; there must be dozens of H’s in the valley.',
          ),
          BY(
            'Unknown sender. I’ll make a list of everyone with an H. It’ll be a short list.',
            'think',
          ),
          BY('Not Hazel, obviously. Missing people don’t post parcels. That’s procedure.', 'think'),
          N('It won’t be a short list. He will be very thorough about it.'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 2: one jar
  scene(
    's28-one-jar',
    [
      N(
        'In the Nubbin’s basket there is a scarf, a dried apple ring and an empty jar, licked very clean.',
      ),
      N('The jar has a label, in the same leaning hand: “Marmalade. Hollow. Last of.”'),
      BY('It’s lived on this. All the way down the valley. On one jar.', 'think'),
      BY('Nubbins eat fruit. Fruit. It’s in every book. Nobody writes “marmalade” in a book.'),
      N(
        'The Nubbin holds the jar out to him upside down, to show him it’s empty. Then it waits, politely, in case he has another.',
      ),
      N(
        'You remember a shelf in Hazel’s pantry. Preserves in jars with paper lids and string, all in a row, all the same orange.',
      ),
      Y('I think I know where there’s more.'),
      BY('How many?'),
      Y('Some.'),
      BY('“Some” isn’t a number. Go and get “some”. I’ll make a note.', 'think'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'sugar preserves fruit; one word with more than one meaning',
        standard: 'L.3.4',
        kind: 'notice',
        after: 9,
        lines: [
          N(
            'To “preserve” something means to keep it safe from spoiling. “Preserves” are jams and marmalades.',
          ),
          N(
            'They keep for months because they are full of sugar. Moulds and germs find it very hard to grow in that much sugar.',
          ),
        ],
        parentNote: 'Learned the two meanings of “preserve”, and why sugary jams keep for so long.',
      },
    ],
  ),
  scene(
    's28-received',
    [
      N(
        'Six jars, with paper lids and string. Under the sixth, a recipe card in Hazel’s hand, spotted with old orange.',
      ),
      N(
        'Byte files the card under R, then counts the jars. Then he counts them again, in case one moved.',
      ),
      BY('Six. Right. And you’re… one. Received.', 'think'),
      BY('Parcel. That’s your name. Parcel, received. I’ll sign for you.', 'soft'),
      N('He writes PARCEL in his notebook and underlines it. Parcel bows.'),
      BY('Fifteen spoons a jar, near enough. One spoon a day. I’ll want a plan.', 'think'),
      N(
        'Your own Nubbin has its face in the open jar. When it comes out it looks alarmed, and goes straight back in.',
      ),
      BY('That’s one spoon unaccounted for already.', 'shock'),
    ],
    [
      {
        domain: 'maths',
        skill: 'multiplying equal groups',
        standard: '3.OA.A.3',
        kind: 'ask',
        after: 5,
        prompt: [BY('Six jars, fifteen spoons in each. How many spoons is that?', 'think')],
        options: [
          opt(
            '90 spoons',
            [
              BY(
                'Ninety. Six fifteens: 15, 30, 45, 60, 75, 90. That’s ninety days at a spoon a day.',
                'happy',
              ),
            ],
            true,
          ),
          opt('21 spoons', [
            BY('That’s 6 + 15. We need six lots of fifteen: 15, 30, 45, 60, 75, 90. Ninety.'),
          ]),
          opt('60 spoons', [
            BY('That’s only four jars’ worth. Count on two more: 75, 90. Ninety spoons.'),
          ]),
        ],
        parentNote: 'Multiplied 6 × 15 by counting in fifteens.',
      },
    ],
  ),
  // ------------------------------------------------ step 3: hot water
  scene(
    's28-bath',
    [
      N('Parcel came down from the Hollow on a cart, and a good deal of the Hollow came with it.'),
      BY('It’s muddy to the knees. Has it got knees? It’s muddy to where knees would be.', 'think'),
      BY('Bath. Standard procedure. I’ll run it. You find a towel.'),
      N('Byte puts the plug in, shows Parcel the taps, and goes to look for the bath thermometer.'),
      N('Parcel, wishing to be helpful, turns both taps on full.'),
      N('Then it sits on the edge of the bath, very upright, and waits to be told when to stop.'),
      N('Nobody tells it.'),
      N(
        'By the time you find a towel, the bath is full. By the time Byte finds the thermometer, so is the landing.',
      ),
      BY('WHY IS THE HALL WET?', 'shock'),
      N(
        'The water goes down the stairs, along the hall, under the front door and out into the garden. It keeps going.',
      ),
      N(
        'Next door is a very tidy garden, and water likes a tidy garden. It goes under the fence to see.',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'sorting materials by how well they absorb water',
        standard: '2-PS1-1',
        kind: 'ask',
        after: 10,
        prompt: [N('You need to soak up a flood fast. Which is most absorbent?')],
        options: [
          opt(
            'A thick cotton towel',
            [N('Yes. Cotton is full of tiny gaps between its fibres, and water creeps into them.')],
            true,
          ),
          opt('A plastic tray', [
            N(
              'Plastic is waterproof: water runs straight off it. Good for carrying, useless for soaking. The towel wins.',
            ),
          ]),
          opt('A metal bucket lid', [
            N('Metal doesn’t soak anything up. The towel’s fibres hold water in their gaps.'),
          ]),
        ],
        parentNote: 'Compared materials by how well they soak up water.',
      },
    ],
  ),
  scene(
    's28-nubbin',
    [
      N(
        'A head comes up over the fence, then the rest of a man: a cardigan, a moustache and an expression.',
      ),
      GR('NUBBIN!', 'angry'),
      N('Mr Grue, from next door. He doesn’t say anything else, and he doesn’t need to.'),
      GR('Send it back where it came from!', 'angry'),
      BY('It stays until I’ve verified the sender. That’s procedure.', 'think'),
      N(
        'Upstairs, Parcel has turned the taps off by itself. It appears at the bathroom window, clean and pleased, and bows to Mr Grue.',
      ),
      GR('Don’t you bow at me.', 'angry'),
    ],
    [
      {
        domain: 'sel',
        skill: 'putting things right with a neighbour',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 6,
        prompt: [
          N('Your side made the mess, even by accident. What would a good neighbour do first?'),
        ],
        options: [
          opt(
            'Say sorry, and offer to help clear up.',
            [
              N(
                'Yes. An accident isn’t done on purpose, but it’s still your mess. Sorry plus help is what mends a fence.',
              ),
            ],
            true,
          ),
          opt('Explain that it was Parcel, not you.', [
            N(
              'That may be true, but Mr Grue’s lettuces are still drowned. Saying sorry and helping comes first; explaining can come after.',
            ),
          ]),
          opt('Stay inside until he calms down.', [
            N(
              'Giving someone space can help. But a quick sorry and an offer of help usually calms things faster.',
            ),
          ]),
        ],
        parentNote: 'Thought about how to put things right with a neighbour after an accident.',
      },
    ],
  ),
  // ------------------------------------------------ step 4: the hard stare, and Byte's log
  scene(
    's28-compensation',
    [
      N(
        'Next morning Mr Grue is on Byte’s step, with a sheet of paper, a pencil and his best cardigan.',
      ),
      GR('I’ve made a list. I want compensation.', 'angry'),
      BY('So have I. Mine’s longer. Go on.', 'think'),
      GR(
        'Item. Lettuces, drowned. Item. Path, unlevelled. Item. One pair of slippers, left on the step to air, now soup.',
      ),
      GR(
        'Item. My peace of mind. I’ll want something for that. I’ll be generous. I’ll take it in coal.',
        'angry',
      ),
      N(
        'Parcel comes out from behind Byte’s legs. It stands on the step, very upright, and looks at Mr Grue.',
      ),
      N(
        'It doesn’t blink or move. It just looks, long and level, the way a lighthouse looks at the sea.',
      ),
      N('Byte, without taking his eyes off it, starts counting under his breath.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'similes',
        standard: 'L.4.5',
        kind: 'ask',
        after: 6,
        prompt: [
          N(
            '“The way a lighthouse looks at the sea” is a simile. What does it tell you about Parcel’s stare?',
          ),
        ],
        options: [
          opt(
            'It is steady and patient, and it doesn’t give up.',
            [
              N(
                'Yes. A lighthouse never blinks or looks away, however rough the sea gets. That’s Parcel.',
              ),
            ],
            true,
          ),
          opt('Parcel’s eyes are shining like a lamp.', [
            N(
              'Nice idea, but the simile is about how it looks, not how bright. A lighthouse is steady, patient and unmoving.',
            ),
          ]),
          opt('Parcel is standing by the sea.', [
            N(
              'Not quite: it’s on Byte’s step. A simile compares two things. Parcel’s stare is as steady as a lighthouse.',
            ),
          ]),
        ],
        parentNote: 'Explained what a simile (“like a lighthouse”) shows about a character.',
      },
    ],
  ),
  scene(
    's28-eleven-seconds',
    [
      N('Mr Grue stops. Mr Grue starts again, and stops.'),
      GR('Well. I…', 'shock'),
      N(
        'He folds the list and puts it in his cardigan pocket. He goes home, and shuts his gate very quietly.',
      ),
      BY('Eleven seconds.', 'shock'),
      BY('Eleven. I’ve never seen anybody hold one past four. Not even Ember, and she once out-stared a goose.'),
      N(
        'That evening Byte opens a fresh notebook and writes on the cover, in neat capitals: PARCEL: INCIDENTS.',
      ),
      N(
        'Inside, he rules a column, INCIDENT, and a second, TIME. Then he looks at you over the top of it.',
      ),
      BY('Any other columns? I don’t usually ask. I’m asking.', 'think'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'words with more than one meaning',
        standard: 'L.3.4',
        kind: 'notice',
        after: 6,
        lines: [
          N('A “column” can be a tall stone pillar holding up a roof.'),
          N(
            'In a notebook or a chart, it means a tall strip of boxes going down the page. Both are tall and upright, like Parcel.',
          ),
        ],
        parentNote: 'Learned two meanings of the word “column”.',
      },
    ],
    [
      {
        id: 'good',
        label: 'Suggest a column called “Good things”.',
        set: { 's28-column': 'good' },
        then: [
          BY('“Good things.” That isn’t a measurement.', 'think'),
          N(
            'He rules it anyway, at the end, narrower than the others. You notice he leaves room to widen it.',
          ),
        ],
      },
      {
        id: 'unverified',
        label: 'Suggest a column called “Unverified”.',
        set: { 's28-column': 'unverified' },
        then: [
          BY('Yes. Good. For anything I can’t prove yet.', 'happy'),
          N(
            'He rules it wide, and letters it in his best capitals. It is, you suspect, his favourite word.',
          ),
        ],
      },
      {
        id: 'none',
        label: 'Leave it. It’s his log.',
        set: { 's28-column': 'none' },
        then: [
          Y('It’s your log, Byte.'),
          BY('…Yes. It is. Right.', 'soft'),
          N(
            'He looks at his two columns for a while, as if one were missing and he couldn’t think which.',
          ),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 5: elevenses
  scene(
    's28-sandwich',
    [
      N('A week on, Parcel has a routine. Byte has written it down, with times.'),
      BY(
        'Up at seven. Bows to the kettle. Marmalade. Tidies its basket. Bows to the kettle again.',
        'think',
      ),
      BY(
        'And at eleven it makes a sandwich, cuts it in half, and goes out with one half. Comes back without it.',
      ),
      BY(
        'I’ve followed it twice. It loses me at the wall. I think it does it on purpose.',
        'think',
      ),
      N('The clock in the hall says five to eleven. In the kitchen, a knife goes down.'),
      N(
        'Parcel comes out with half a marmalade sandwich held in front of it in both paws, like a tray. It bows to you on the way past.',
      ),
      BY('Go on. You’re less noticeable than me. Everyone’s less noticeable than me.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'telling time to the nearest five minutes',
        standard: '2.MD.C.7',
        kind: 'ask',
        after: 4,
        prompt: [N('“Five to eleven.” How would a digital clock show that?')],
        options: [
          opt(
            '10:55',
            [N('Yes. Five minutes before eleven o’clock is 55 minutes past ten: 10:55.')],
            true,
          ),
          opt('11:05', [N('That’s five past eleven, after it. Five to eleven is before: 10:55.')]),
          opt('11:55', [
            N('That would be nearly noon! Five to eleven is still in the ten o’clock hour: 10:55.'),
          ]),
        ],
        parentNote: 'Converted “five to eleven” into digital time (10:55).',
      },
    ],
  ),
  scene(
    's28-elevenses',
    [
      N(
        'The low wall at the foot of the hill, in thin autumn sun. Moss sits on it; these days you can see a little of the wall through him.',
      ),
      N(
        'Parcel climbs up beside him, sets the half sandwich on the stone between them, very precisely, and bows.',
      ),
      M('Elevenses.', 'soft'),
      M(
        'It brings one every morning. I don’t eat. It knows that. It brings one anyway. Somebody raised it properly.',
        'soft',
      ),
      M(
        'Plenty have come down that road with a label and a small case, you know. Most of the good ones did.',
        'soft',
      ),
      M(
        'People think precious things shine. Mostly they’re a bit worn. They’ve been held a lot.',
        'soft',
      ),
      N(
        'Footsteps. Byte comes round the end of the wall at four minutes past eleven, out of breath.',
      ),
      M('His lace.'),
      N(
        'You look at Byte. You don’t say anything; you don’t have to. Byte can’t hear Moss, but he can read your face.',
      ),
      BY('It’s untied, isn’t it. He’s said it. You’ve got the face.', 'think'),
      N('Byte ties it. Moss watches him tie it with great interest.'),
      M('Other one.'),
    ],
    [
      {
        domain: 'social-studies',
        skill:
          'how the past is remembered: children evacuated with labels, and the families who welcomed them',
        standard: 'D2.His.2.K-2',
        kind: 'notice',
        after: 4,
        lines: [
          N(
            'In 1939, when war came to Britain, many city children were sent to the countryside to be safer. They were called evacuees.',
          ),
          N(
            'They travelled by train with a small case and a label pinned to their coats, with their name on it.',
          ),
          N(
            'Some were homesick. Many were welcomed by kind families, and some stayed friends with them for life. A welcome made all the difference.',
          ),
        ],
        parentNote:
          'Learned about the children evacuated in 1939 with name labels, and why a kind welcome mattered.',
      },
      {
        domain: 'literacy',
        skill: 'understanding a metaphor',
        standard: 'L.4.5',
        kind: 'ask',
        after: 5,
        prompt: [
          N(
            'Moss says precious things are “a bit worn” because they’ve “been held a lot”. What does he mean?',
          ),
        ],
        options: [
          opt(
            'Things and people we love get worn from being loved, and that’s what makes them precious.',
            [
              N(
                'Yes. A teddy with no fur left on its ear has been hugged the most. Moss is talking about more than teddies.',
              ),
            ],
            true,
          ),
          opt('Old things should be thrown away.', [
            N(
              'Moss means the opposite: the worn things are the precious ones, because they’ve been loved and used.',
            ),
          ]),
        ],
        parentNote: 'Explained a metaphor: being worn from love is what makes something precious.',
      },
    ],
  ),
  // ------------------------------------------------ step 6: Null
  scene(
    's28-null',
    [
      N(
        'Byte’s garden, late afternoon. Null comes out of the hedge after a moth, with a leaf on its head, as usual.',
      ),
      BY(
        'Null, this is Parcel. Parcel, Null. Null chases things. Parcel bows at things. You’ll have a lot to talk about.',
        'think',
      ),
      N(
        'Parcel bows. Null has never been bowed at: it thinks about it, and falls over backwards, which is nearly the same.',
      ),
      N(
        'Then Null sees the sandwich: cut into triangles, on a saucer, carried out by Parcel to share.',
      ),
      N(
        'Null doesn’t want the bread. It takes only the marmalade, off the top, in one long lick, and runs.',
      ),
      N(
        'Parcel looks at the bare bread, then at Null, long and level. Null looks straight back, chewing.',
      ),
      N(
        'Nobody has ever held the stare before, and Parcel seems delighted. It gives Null the rest of the bread.',
      ),
      BY(
        'They’ve adopted each other. I couldn’t tell you which one did it first. I wasn’t quick enough.',
        'happy',
      ),
    ],
    [
      {
        domain: 'sel',
        skill: 'how friendships start',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 7,
        prompt: [
          N(
            'Null stole the marmalade, and Parcel gave it the bread anyway. Why might that start a friendship?',
          ),
        ],
        options: [
          opt(
            'Parcel was generous instead of cross, so Null felt safe.',
            [N('Yes. Answering cheekiness with kindness tells someone “you’re welcome here”.')],
            true,
          ),
          opt('Null only wanted free food.', [
            N(
              'Maybe at first! But staying to stare back, and being given more, turned a snack into a friend.',
            ),
          ]),
        ],
        parentNote: 'Thought about how generosity can turn a cheeky moment into a friendship.',
      },
    ],
  ),
  scene(
    's28-logged',
    [
      N('That night Byte writes it up. He lets you watch over his shoulder, which is new.'),
      N(
        'He writes it under INCIDENT. Then he stops, and writes it again, smaller, under GOOD THINGS.',
      ),
      BY('It can be both. I’ve checked. There’s nothing in the rules.', 'think'),
      N('He looks at the two entries, side by side, as if they might argue.'),
      N('They don’t. They sit there quite happily.'),
      N('He closes the notebook carefully, so the page won’t smudge.'),
    ],
    [incidentBeat(1)],
  ),
  // ------------------------------------------------ step 7: a shopping expedition
  scene(
    's28-market',
    [
      N(
        'Market day. The square below the bridge is all awnings and shouting and the smell of hot chestnuts.',
      ),
      BY(
        'It shivers in the mornings. I’ve logged it. It needs a coat. Something with fastenings it can manage.',
        'think',
      ),
      BY('I’ve put the stalls in order of efficiency. We’ll do them in that order.'),
      N(
        'You do the first stall in that order. When you turn round from the second, Parcel isn’t there.',
      ),
      BY(
        'Where is it? It was there. I had it at the edge of my vision. I have very good edges.',
        'shock',
      ),
      N('Somewhere across the square there is a noise like a xylophone falling downstairs.'),
      N(
        'Your Nubbin is off towards it already, nose first. It knows that smell: oranges, boiled with sugar.',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'sound is made by vibrations',
        standard: '1-PS4-1',
        kind: 'notice',
        after: 5,
        lines: [
          N(
            'Every clink is a jar wobbling very fast when it’s struck. Those quick wobbles are vibrations.',
          ),
          N(
            'The vibrations shake the air, the air carries them to your ears, and you hear a sound. Lots of jars, lots of clinks.',
          ),
        ],
        parentNote: 'Learned that sounds are made by vibrations that travel through the air.',
      },
    ],
  ),
  scene(
    's28-jam-stall',
    [
      N(
        'A preserves stall. There was a pyramid of jars on it, very tall, very proud, with one orange-coloured jar on top.',
      ),
      N(
        'There is now a slope of jars. Parcel is at the bottom, holding the top jar up in both paws, unbroken.',
      ),
      N('Nothing has broken. Everything has simply rolled, very far, in every direction.'),
      DO('My PYRAMID. Three hours, that pyramid took!', 'angry'),
      N(
        'A crowd has gathered, so Parcel bows to it. The crowd claps, and starts picking up jars, and paying for them.',
      ),
      DO(
        'Well. That’s the bramble jelly gone. And the damson. Oh, go on, then, take the plum.',
        'shock',
      ),
      N(
        'By noon the stall has sold out. Dot Amblin sits on her empty table with her cash tin, looking at Parcel as if it were weather.',
      ),
      DO(
        'Keep that one, little one. Apricot. On the house. Come back next market, and bring your bow.',
        'happy',
      ),
      N(
        'Byte buys a knitted coat with toggles, brown, Parcel-sized. Then a second, smaller, for your Nubbin.',
      ),
      BY(
        'Parity. If one of them has a coat, they both have a coat. I’ve done the maths on fair.',
        'think',
      ),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'buying and selling at a market; when goods run out',
        standard: 'D2.Eco.1.K-2',
        kind: 'ask',
        after: 6,
        prompt: [
          N(
            'Dot’s stall sold out by noon. What does “sold out” mean for the next person who wants jam?',
          ),
        ],
        options: [
          opt(
            'There’s none left, so they’ll have to choose something else or wait.',
            [
              N(
                'Yes. When something runs out, people have to choose: another stall, another jam, or next market.',
              ),
            ],
            true,
          ),
          opt('Dot will make more jam straight away.', [
            N(
              'Not today: jam takes hours to make. When goods run out, buyers have to choose something else or wait.',
            ),
          ]),
        ],
        parentNote:
          'Thought about what happens when goods sell out, and the choices buyers then make.',
      },
    ],
  ),
  // ------------------------------------------------ step 8: the last jar, and the glasshouse
  scene(
    's28-graph',
    [
      N(
        'Early winter, and frost on Byte’s very straight hedge. He meets you at the door with a sheet of squared paper.',
      ),
      BY(
        'Ninety spoons, one a day. Ninety days. That gets you to midwinter, near enough. I worked it out the week it came.',
        'think',
      ),
      BY('This is what actually happened. The last spoon went on day sixty.'),
      N(
        'The line on the graph goes down like a dropped scarf. In the margin, in capitals: MOSS, ROBINS, YOUR NUBBIN (TWICE), MR GRUE’S STEP???',
      ),
      BY(
        'It shares. It feeds everyone before it feeds itself. That isn’t in any book either.',
        'sad',
      ),
      N('You know that rule. You have it in a letter, in the same leaning hand as the tag.'),
      N(
        'On the kitchen table stands the last jar: empty, washed, its lid beside it. Parcel has put it there very neatly.',
      ),
      BY('It washed it and put it out. Like a milk bottle. In case somebody comes.', 'sad'),
      N('That night, Parcel isn’t in its basket.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'subtraction word problems within 100',
        standard: '2.OA.A.1',
        kind: 'ask',
        after: 2,
        prompt: [BY('Planned: ninety days. Actual: sixty. How many days short is that?', 'think')],
        options: [
          opt(
            '30 days',
            [BY('Thirty. 90 − 60 = 30. A whole month of marmalade, given away.', 'sad')],
            true,
          ),
          opt('150 days', [BY('That’s 90 + 60. We want the difference: 90 − 60 = 30.')]),
          opt('6 days', [BY('Six is the number of jars. The gap in days is 90 − 60 = 30.')]),
        ],
        parentNote: 'Subtracted 60 from 90 to compare a plan with what really happened.',
      },
    ],
  ),
  scene(
    's28-glasshouse',
    [
      N(
        'At the bottom of Mr Grue’s tidy garden the glasshouse is lit. Steam on the glass, and a lamp held up.',
      ),
      N(
        'Inside, a tree in a tub: dark leaves, and small, rough, bright oranges. The only one in the valley.',
      ),
      N('Parcel is under it with an orange in both paws. Over it stands Mr Grue, with the lamp.'),
      GR('Thief. In my glasshouse. In the night. I’ll have the—', 'angry'),
      N(
        'Byte comes through the gap in the hedge in his dressing gown and slippers, and steps between them.',
      ),
      BY('It’s in my care. Anything it’s done is my responsibility. Send me the bill.', 'angry'),
      N(
        'You have never seen Byte stand in front of anything that wasn’t a number. From his face, neither has Byte.',
      ),
      GR(
        '…Those are Seville. Bitter. You can’t eat them raw. It’s in for a nasty surprise.',
        'think',
      ),
      GR(
        'My mother brought the pip over the pass in her coat pocket. Grew it in a teacup.',
        'soft',
      ),
      GR(
        'Sixty years, and one person ever asked for them. Came every winter with a basket. Not this winter.',
        'soft',
      ),
      GR('Well? What’s on offer? I’m not giving them away.', 'angry'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'fairness and intention',
        standard: 'D2.Civ.8.K-2',
        kind: 'ask',
        after: 3,
        prompt: [
          N(
            'Parcel took an orange without asking. Perhaps it only wanted more marmalade to share. Is Parcel a thief?',
          ),
        ],
        options: [
          opt('Yes. It took something that wasn’t its own.', [
            N(
              'That’s a fair answer. Taking without asking is still taking, whatever the reason. Mr Grue would agree.',
            ),
          ]),
          opt('No. It didn’t understand the rules.', [
            N(
              'That’s fair too. Parcel came from the Hollow, where nobody owns the fruit. Not knowing a rule is different from breaking it on purpose.',
            ),
          ]),
          opt('It needs to put it right either way.', [
            N(
              'A wise answer. Whatever we call it, Mr Grue is owed something, and that’s what happens next.',
            ),
          ]),
        ],
        parentNote:
          'Discussed whether taking something is wrong if you didn’t know the rule, and how to put it right.',
      },
      {
        domain: 'science',
        skill: 'a seed grows into a plant that makes fruit and seeds: a life cycle',
        standard: '3-LS1-1',
        kind: 'notice',
        after: 8,
        lines: [
          N(
            'One pip, in a teacup: that’s a whole life cycle. Seed, seedling, young tree, flowers, fruit, and new pips inside the fruit.',
          ),
          N(
            'Sixty years on, the same tree is still making seeds. Each one could start a tree of its own.',
          ),
        ],
        parentNote: 'Followed the life cycle of an orange tree from a single pip.',
      },
    ],
    OFFER,
  ),
  // ------------------------------------------------ step 9: the setting point
  scene(
    's28-kitchen',
    [
      N(
        'Byte’s kitchen, on a Saturday. Oranges cut, pips in a muslin bag, and the whole house smelling like a brighter house.',
      ),
      BY(
        'Setting point is a hundred and four and a half degrees. I’ve calibrated the thermometer. Twice.',
        'think',
      ),
      N(
        'Hazel’s recipe card leans on the sugar bag. Under “boil hard” she has written: “Cold saucer, push it, see if it wrinkles.”',
      ),
      BY('“See if it wrinkles.” That isn’t a test. That’s a feeling.', 'think'),
      N(
        'Parcel has put a saucer out on the frosty windowsill. It sits beside it, guarding it, in case someone steals the cold.',
      ),
      N(
        'Your Nubbin licks the cold saucer to see if it’s ready. Parcel gives it a long, level stare, and it puts the saucer back.',
      ),
      BY('Contaminated. That saucer is now the control.', 'think'),
      N(
        'Byte turns the card over, looking for the rest of the method. On the back, in the same hand, is one line.',
      ),
      BY(
        '“Mind your manners, mind your neighbours, and always save some for the next one.”',
        'think',
      ),
      BY('That isn’t a recipe.'),
      Y('It’s on the recipe card.'),
      BY('Then it’s an ingredient. Unverified.', 'think'),
      N('He props the card back against the sugar bag. Writing side out.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'measuring temperature, and finding a difference',
        standard: '4.MD.A.2',
        kind: 'ask',
        after: 1,
        prompt: [
          BY(
            'Water boils at 100 °C (212 °F). Setting point is 104.5 °C (about 220 °F). How much hotter is that?',
            'think',
          ),
        ],
        options: [
          opt(
            '4.5 degrees Celsius',
            [
              BY(
                'Four and a half. 104.5 − 100 = 4.5. Sugar lets the mixture get hotter than plain water can.',
                'happy',
              ),
            ],
            true,
          ),
          opt('204.5 degrees', [
            BY('That’s adding them. We want the difference: 104.5 − 100 = 4.5 degrees.'),
          ]),
          opt('45 degrees', [
            BY('Watch the point. It’s four and a half, not forty-five: 104.5 − 100 = 4.5.'),
          ]),
        ],
        parentNote: 'Found the difference between two temperatures, including a half.',
      },
      {
        domain: 'science',
        skill: 'why marmalade uses Seville oranges',
        standard: '2-PS1-1',
        kind: 'notice',
        after: 9,
        lines: [
          N(
            'Seville oranges are named after Seville, a city in Spain. They’re too bitter to eat raw, but perfect for marmalade.',
          ),
          N(
            'Their peel and pips are rich in pectin, a natural substance that helps jam set. That’s why the pips go in the muslin bag, not the bin.',
          ),
        ],
        parentNote: 'Learned why bitter Seville oranges, rich in pectin, make good marmalade.',
      },
    ],
  ),
  scene(
    's28-wrinkle',
    [
      N(
        'The thermometer says a hundred and four and a half. At the same moment, on the cold saucer, the marmalade wrinkles under Parcel’s paw.',
      ),
      BY('They agree. The feeling and the thermometer agree.', 'shock'),
      BY('I don’t know how I feel about that.', 'think'),
      N('Nine jars glow on the table like a row of small windows. Parcel bows to each one.'),
      N(
        'The first jar goes over the hedge to Mr Grue, promised or not. He takes it at arm’s length.',
      ),
      GR('I’m taking this as evidence.', 'angry'),
      N('He doesn’t carry it home at arm’s length. He carries it the way you’d carry an egg.'),
    ],
    [
      {
        domain: 'science',
        skill: 'some changes from heating and cooling can be reversed, and some can’t',
        standard: '2-PS1-4',
        kind: 'ask',
        after: 3,
        prompt: [
          N(
            'The cold saucer cools a drop of hot marmalade so it thickens and wrinkles. Could you turn the marmalade back into oranges and sugar?',
          ),
        ],
        options: [
          opt(
            'No. Cooking changed it for good.',
            [
              N(
                'Right. Boiling changed the fruit and sugar into something new. Like a baked cake, it can’t be un-made.',
              ),
            ],
            true,
          ),
          opt('Yes, if you froze it.', [
            N(
              'Freezing would make it stiffer, and warming would soften it again. But it would still be marmalade. Cooking can’t be undone.',
            ),
          ]),
        ],
        parentNote:
          'Learned that some changes caused by heating, like cooking marmalade, cannot be reversed.',
      },
    ],
  ),
  // ------------------------------------------------ step 10: gone to the cart stop
  scene(
    's28-first-snow',
    [
      N('The first snow comes in the night, quietly, the way it always means to.'),
      N(
        'In the morning Byte is at the fence with Mr Grue. They are both pretending to talk about the weather.',
      ),
      GR('So it’s staying, then, your delivery. You’ve verified your sender.', 'think'),
      BY('No. I haven’t. I never asked for it, Mr Grue. It just came. I never asked for it—'),
      N('Behind him, on the step, Parcel puts down its half sandwich. It picks up its basket.'),
      N(
        'By the time Byte has found the end of his sentence, there is nobody on the step to hear it.',
      ),
      GR(
        'Your… it’s gone. Down the lane. Had that tag held out in front of it, like a ticket.',
        'shock',
      ),
      GR('Well, don’t stand there! Go on! It’s snowing!', 'angry'),
      BY('I hadn’t finished. I hadn’t FINISHED.', 'shock'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'a character’s motive, from what they hear',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 8,
        prompt: [N('Why did Parcel leave?')],
        options: [
          opt(
            'It overheard half a sentence and thought Byte didn’t want it.',
            [
              N(
                'Yes. “I never asked for it” sounds like a goodbye if you don’t hear the end. Parcel didn’t wait for the end.',
              ),
            ],
            true,
          ),
          opt('It wanted to see the snow.', [
            N(
              'It took its basket and its tag, as if it were going back. It thought it wasn’t wanted, from half a sentence.',
            ),
          ]),
          opt('Mr Grue told it to go.', [
            N(
              'Not this time: Mr Grue is shouting at Byte to go after it. Parcel left because of what it overheard.',
            ),
          ]),
        ],
        parentNote: 'Worked out a character’s motive from what it overheard.',
      },
    ],
  ),
  scene(
    's28-cart-stop',
    [
      N(
        'The cart stop on the valley road is a sign, a bench and a milestone. The cart doesn’t run in the snow.',
      ),
      N(
        'Parcel is under the sign, very upright, with snow on its head. It is holding its tag out, to be sent back.',
      ),
      N('It sees you both, and bows. It doesn’t put the tag down.'),
      N(
        'A tag with a name but no address can only be sent back. One with an address can be sent home.',
      ),
      N('Byte’s pencil is already out.'),
      N(
        'The snow is falling softly. Parcel’s coat is warm, and it has only been here a little while.',
      ),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'the parts of an address',
        standard: 'D2.Geo.2.K-2',
        kind: 'ask',
        after: 4,
        prompt: [
          N('Byte is about to write Parcel a proper address. Which of these does an address need?'),
        ],
        options: [
          opt(
            'A name, a house, a road or lane, and a town or village.',
            [
              N(
                'Yes. Most addresses also have a postcode. Together they lead from the whole country down to one front door.',
              ),
            ],
            true,
          ),
          opt('Just a name.', [
            N(
              'A name says who, not where. An address adds the house, the lane and the village, so anyone can find the door.',
            ),
          ]),
          opt('A favourite food.', [
            N(
              'Marmalade, obviously. But an address needs a name, a house, a lane or road, and a village or town.',
            ),
          ]),
        ],
        parentNote: 'Learned the parts of an address and how they narrow down to one home.',
      },
    ],
    [
      {
        id: 'sit',
        label: 'Sit down in the snow beside Parcel.',
        then: [
          N(
            'You sit. The snow is very cold, very fast; Parcel looks at you, then at the road, and doesn’t move away.',
          ),
          N('After a moment Byte sits down on its other side, in the snow, in his good trousers.'),
          ...KEEPING,
        ],
      },
      {
        id: 'back',
        label: 'Hang back. Let Byte go.',
        then: [
          N(
            'You stop at the bend. Byte doesn’t: he goes all the way to the sign and crouches in the snow, in his good trousers.',
          ),
          ...KEEPING,
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 11: the coldest hour, and Hazel's bench
  scene(
    's28-crust',
    [
      N(
        'The second morning after the Long Night. The Grove is soft with snow, and nobody has slept enough yet.',
      ),
      N('Byte is at your gate, early, with Parcel in its coat and a matchbox in his hand.'),
      BY('I want to tell you something. It isn’t data. I’m going to say it anyway.', 'think'),
      BY('Three hours and twelve minutes in. The third cold. The one where nobody talked.'),
      BY(
        'My hands were shaking so hard I couldn’t write. I couldn’t write anything down. That has never happened.',
        'sad',
      ),
      BY(
        'And Parcel came along the line of us, at knee height. With half a sandwich. It gave it to me.',
        'soft',
      ),
      BY(
        'And my hands stopped. I don’t know why. It doesn’t make sense. I’ve stopped needing it to.',
        'soft',
      ),
      N('He opens the matchbox. Inside, on cotton wool, is a sandwich crust.'),
      BY('I’ve kept it. It’s a keepsake. Don’t say anything.', 'soft'),
      N(
        'You don’t. Parcel looks up the lane at Hazel’s chimney, smoking, and sets off without either of you.',
      ),
    ],
    [
      {
        domain: 'sel',
        skill: 'how fear shows in the body, and what helps',
        standard: 'CASEL: Self-management',
        kind: 'ask',
        after: 6,
        prompt: [
          N('Fear made Byte’s hands shake. What helps a body calm down when it’s frightened?'),
        ],
        options: [
          opt(
            'Someone close by, something warm, and slow breaths.',
            [
              N(
                'Yes. A friend nearby tells your body it isn’t alone. Shaking hands often settle when someone kind is close.',
              ),
            ],
            true,
          ),
          opt('Pretending you aren’t scared.', [
            N(
              'Lots of people try that. But fear is easier to calm when it’s noticed and shared, like Byte’s was.',
            ),
          ]),
          opt('Running away by yourself.', [
            N(
              'Sometimes moving away from danger is right. But being alone can make fear bigger. A friend nearby helps.',
            ),
          ]),
        ],
        parentNote: 'Talked about how fear shows in the body and what helps it calm down.',
      },
    ],
  ),
  scene(
    's28-bench',
    [
      N(
        'Hazel is on the bench by the cottage door, in three coats, awake. The thin grey Nubbin sleeps in the crook of her arm.',
      ),
      N(
        'Parcel walks up the path, stops at her boot, and bows. Lower than it has ever bowed to anyone.',
      ),
      HZ('Hello again, you. Look at that coat. Somebody’s been looking after you.', 'soft'),
      N(
        'Parcel undoes one toggle, takes out half a sandwich, and holds it up to the thin grey Nubbin.',
      ),
      N('The thin grey Nubbin wakes and sniffs. It takes one corner, very carefully, and eats it.'),
      HZ(
        'Two days it took me, with an apple. You turn up with a sandwich and do it in one go. Show-off.',
        'happy',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'layers trap air, which keeps heat in',
        standard: '2-PS1-1',
        kind: 'notice',
        after: 5,
        lines: [
          N(
            'Layers keep you warm. Air gets trapped between them, and still air is very slow to let heat escape.',
          ),
          N('Birds do the same thing when they fluff up their feathers in winter.'),
        ],
        parentNote: 'Learned that layers of clothing trap air, which keeps body heat in.',
      },
    ],
  ),
  // ------------------------------------------------ step 12: why him
  scene(
    's28-why',
    [
      N(
        'Byte has been standing at the gate. Now he comes up the path with his notebook held in front of him, like a ticket.',
      ),
      BY('Hazel. I’ve a theory. Can I say it before you say anything? It’s tidier.', 'think'),
      HZ('Go on, love.', 'soft'),
      BY(
        'You couldn’t keep it. Not where you were. You knew you might not be there to see it fed.',
        'think',
      ),
      BY(
        'So you needed it written down. Every day, every spoon. By somebody who’d notice if a day went missing.',
      ),
      BY('So you sent it to the one person in the valley who writes everything down.'),
      N('Hazel looks at him for a long time. Then she nods, once.'),
      HZ('You count things, love. I needed someone who’d count this one.', 'soft'),
      N('Byte opens his notebook, finds the page, and writes VERIFIED. He doesn’t cross it out.'),
      N(
        'Then he sits down on the step, not suddenly. He has had since the autumn to get used to the idea.',
      ),
    ],
    [
      {
        domain: 'literacy',
        skill: 'your point of view and a character’s',
        standard: 'RL.3.6',
        kind: 'ask',
        after: 7,
        prompt: [
          N(
            'Hazel says she needed someone who’d “count this one”. Why do you think she chose Byte, not you?',
          ),
        ],
        options: [
          opt('Because Byte notices small things nobody else does.', [
            N(
              'That’s a fair answer. Counting every spoon is a kind of paying attention, and attention is a kind of love.',
            ),
          ]),
          opt('Because Byte needed Parcel as much as Parcel needed him.', [
            N('A thoughtful answer. Hazel may have been looking after two strays at once.'),
          ]),
          opt('Because you already had your hands full with the Grove.', [
            N('That’s fair too. Hazel knows how much you carry. And you still kept turning up.'),
          ]),
        ],
        parentNote: 'Thought about a character’s reasons and compared them with their own view.',
      },
    ],
  ),
  scene(
    's28-on-the-step',
    [
      N(
        'You sit on the step beside Byte, with Parcel between you. Nobody says anything for a while, which is the best thing anyone says all morning.',
      ),
      N(
        'Hazel is very poorly now, and the doctors can’t make her better. She sleeps a lot, and wakes up for the good bits.',
      ),
      N(
        'She falls asleep in the middle of looking at the three of you. The thin grey Nubbin falls asleep in the middle of her.',
      ),
      N('It’s all right to feel sad about Hazel and happy to be here, both at once.'),
      BY('I’m going to throw it a party. A welcome party.', 'soft'),
      BY('It’s very late for a welcome party. I’ve checked. There’s no rule.', 'think'),
    ],
    [
      {
        domain: 'sel',
        skill: 'holding two feelings at once, and the comfort of quiet company',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 3,
        lines: [
          N(
            'People often feel two things together: sad and glad, worried and loved. Neither feeling cancels the other.',
          ),
          N(
            'Sitting quietly with someone is one of the oldest ways of saying “I’m here”. Nobody on the step needs to talk.',
          ),
        ],
        parentNote:
          'Learned that it’s normal to feel two feelings at once, and that quiet company is a comfort.',
      },
    ],
  ),
  // ------------------------------------------------ step 13: a disappearing trick
  scene(
    's28-party',
    [
      N(
        'Byte’s front room, decorated: bunting cut from squared paper, and a cake with PARCEL on it, iced in very straight capitals.',
      ),
      PX('I got the cake stand down from our loft. It rotates. He’s banned the rotate.', 'happy'),
      BY('It’s a cake, not a fairground.'),
      PX(
        'He said that at our wedding. It rotated anyway. So did his lace, all the way down the aisle.',
      ),
      BY('It’s tradition now.'),
      N(
        'Mr Grue has come “for procedure”, in his best cardigan. He sits on the edge of his chair as if it might go off.',
      ),
      BY(
        'And now. Parcel has prepared a trick. I wasn’t told what. I’m finding that difficult.',
        'think',
      ),
      N(
        'Parcel walks up to Mr Grue and bows. Then it holds out one paw towards his waistcoat pocket, and waits.',
      ),
      GR('My watch? What does it want my watch for?', 'think'),
      N(
        'Everyone looks at him, so he hands the watch over. It was his father’s, he says, twice, on the way.',
      ),
      N(
        'Parcel wraps the watch in a napkin, taps the napkin with a spoon, and unwraps it. The watch has gone.',
      ),
      N('Applause, and a whistle from Pixel. Mr Grue claps three times, against his will.'),
      N('Parcel taps the napkin again and unwraps it. The watch is back, in eleven pieces.'),
      BY('Eleven.', 'shock'),
      GR('MY FATHER’S WATCH!', 'angry'),
      N('Mr Grue goes out of the front door so hard that the bunting comes down.'),
      PX('Give me all the bits. All of them. Nobody sneeze.', 'think'),
      BY('She’ll fix it. She fixes every clock in our house, broken or not.'),
    ],
    [
      {
        domain: 'science',
        skill: 'a wound spring stores energy that makes a watch move',
        standard: '4-PS3-4',
        kind: 'notice',
        after: 17,
        lines: [
          PX(
            'Look: the mainspring. Winding the watch coils it tight, and a tight spring stores energy.',
            'think',
          ),
          PX(
            'As it slowly uncoils, the gears pass that energy along, a tiny bit at a time, and the hands move. Stored energy into movement.',
            'happy',
          ),
        ],
        parentNote:
          'Learned how a wound spring stores energy and gears turn it into the movement of a watch’s hands.',
      },
    ],
  ),
  scene(
    's28-grue-back',
    [
      N(
        'Half an hour later the watch is ticking in Pixel’s palm. It was losing four minutes a day, she says, and it isn’t now.',
      ),
      N('There is a knock. Mr Grue is on the step, holding a paper bag.'),
      GR('I’ve come for the marmalade. That’s all. Not the party.', 'angry'),
      N(
        'He holds out the bag. Oranges, small and rough and bright, from the tree that started in a teacup.',
      ),
      GR('For the next lot. You’ll want to start early. Don’t read anything into it.', 'think'),
      N(
        'Parcel bows to him, lower than to anyone but Hazel. It is the nearest thing to sorry a Nubbin has.',
      ),
      N(
        'Pixel hands Mr Grue the watch. He holds it to his ear for a long time, then sits down, properly, all the way back in the chair.',
      ),
    ],
    [watchBeat(0)],
  ),
  // ------------------------------------------------ complete (column: good)
  scene(
    's28-complete',
    [
      ...LOG_OPEN,
      N(
        'Then he turns the notebook sideways. The last column has grown so wide that it runs onto the facing page.',
      ),
      BY(
        'Good things. Bowed to the kettle. Took Moss elevenses. Shared. Shared. Shared. Washed the jar. Gave me half a sandwich.',
        'soft',
      ),
      BY('The good column is longer. I measured it. It’s longer by a page and a half.', 'soft'),
      ...GIFTS,
    ],
    [
      {
        domain: 'sel',
        skill: 'reading feelings from actions; gifts that carry a memory',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 9,
        prompt: [
          N(
            'Mr Grue says the cutting probably won’t take. Why do you think he wrapped it so carefully anyway?',
          ),
        ],
        options: [
          opt(
            'Because it matters to him, and he wants it to matter to you.',
            [
              N(
                'Yes. That tree came over the pass in his mother’s pocket. Grumpy words, careful hands: the hands are telling the truth.',
              ),
            ],
            true,
          ),
          opt('Because he wants it back later.', [
            N(
              'He might ask how it’s doing! But careful wrapping usually means “this is precious, and so are you”.',
            ),
          ]),
        ],
        parentNote:
          'Read a character’s feelings from his actions rather than his words, and thought about gifts that carry a memory.',
      },
      themeBeat(10),
    ],
  ),
];

// ================================================================== variants
const VARIANTS: EduScene[] = [
  // step 6 scene: the Minder is still ticking
  scene(
    's28-null-minder',
    [
      N(
        'Byte’s front room. The Minder ticks on the shelf: a clock that rings a bell and drops a treat down a chute.',
      ),
      N(
        'Null sits in the little bed under it, perfectly upright, waiting. Its blue has gone thin at the edges.',
      ),
      BY(
        'This is Null. It’s on a schedule. Don’t mind the clock. It’s an experiment. It’s going very well.',
        'think',
      ),
      N('Parcel bows to Null, but Null doesn’t look up. It is watching the bell.'),
      N(
        'Parcel considers this. Then it climbs into the bed beside Null, folds its paws, sits very upright, and waits for the bell too.',
      ),
      N('Byte goes pale, then paler. You didn’t know he had another shade in him.'),
      BY('No. Not that one. That one isn’t…', 'shock'),
      BY('It isn’t mine. It’s on loan. You don’t put a thing that isn’t yours on a clock.', 'sad'),
      N(
        'He lifts Parcel out, gently, and carries it into the kitchen. Then he comes back and stands looking at the lever on the side of the Minder.',
      ),
      N('He doesn’t pull it, not yet. But he looks at it for a long time.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'fairness and consent for animals',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 9,
        prompt: [
          N(
            'Null can’t say yes or no to the schedule. Is it fair to decide an animal’s whole day for it?',
          ),
        ],
        options: [
          opt('No. Null needs to choose some things for itself.', [
            N(
              'That’s a fair answer. Animals can’t speak, so the people who keep them have to watch for what they need.',
            ),
          ]),
          opt('Sometimes. Pets do need routines.', [
            N(
              'That’s fair too. Regular meals help. The question is whether the routine is for Null, or for the clock.',
            ),
          ]),
          opt('Only if Null seems happy.', [
            N(
              'A thoughtful answer. Look at Null’s thin blue and its watching eyes. What do you think they say?',
            ),
          ]),
        ],
        parentNote:
          'Thought about fairness and consent for animals who can’t speak for themselves.',
      },
    ],
  ),
  // step 6 done: by s28-column
  scene(
    's28-logged-unverified',
    [
      N('That night Byte writes it up. He lets you watch over his shoulder, which is new.'),
      N(
        'He writes it under INCIDENT. Then, after a while, he writes it again under UNVERIFIED, and underlines it twice.',
      ),
      BY('Twice means I hope it’s true. Once means I’m checking. Don’t tell anyone that.', 'soft'),
      N('“Unverified” means not proven yet. Byte likes to be sure before he believes anything.'),
      N('But the second line under it is wobbly, as if his hand were hoping.'),
      N('He closes the notebook carefully, so the page won’t smudge.'),
    ],
    [incidentBeat(1)],
  ),
  scene(
    's28-logged-none',
    [
      N('That night Byte writes it up. He lets you watch over his shoulder, which is new.'),
      N('He writes it under INCIDENT, in very small letters, as if it might not count.'),
      BY('It isn’t really an incident. There isn’t a column for what it is.', 'think'),
      N('He taps the pencil on the page, where a third column might go.'),
      N('Then he puts the pencil back behind his ear.'),
      N('He closes the notebook carefully, so the page won’t smudge.'),
    ],
    [incidentBeat(1)],
  ),
  // step 11 done: Bramble's youngest came down with Hazel (colour only)
  scene(
    's28-bench-bramble',
    [
      N(
        'Hazel is on the bench by the cottage door, in three coats, awake. Bramble’s youngest sleeps in the crook of her arm.',
      ),
      N(
        'Parcel walks up the path, stops at her boot, and bows. Lower than it has ever bowed to anyone.',
      ),
      HZ('Hello again, you. Look at that coat. Somebody’s been looking after you.', 'soft'),
      N(
        'Parcel undoes one toggle, takes out half a sandwich, and holds it up to the little grey one with the folded ear.',
      ),
      N('Bramble’s youngest wakes and sniffs. It takes one corner, very carefully, and eats it.'),
      HZ(
        'Two days it took me, with an apple. You turn up with a sandwich and do it in one go. Show-off.',
        'happy',
      ),
      HZ(
        'Fern will want to hear about this. Fern wants to hear about everything this one does.',
        'soft',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'layers trap air, which keeps heat in',
        standard: '2-PS1-1',
        kind: 'notice',
        after: 5,
        lines: [
          N(
            'Layers keep you warm. Air gets trapped between them, and still air is very slow to let heat escape.',
          ),
          N('Birds do the same thing when they fluff up their feathers in winter.'),
        ],
        parentNote: 'Learned that layers of clothing trap air, which keeps body heat in.',
      },
    ],
  ),
  // step 12 scene: s28-told is false
  scene(
    's28-why-untold',
    [
      N(
        'Byte has been standing at the gate. Now he comes up the path slowly, looking from Parcel to Hazel and back.',
      ),
      N(
        'Hazel sees the tag round Parcel’s neck, with Byte’s writing on the back of hers, and smiles at it.',
      ),
      HZ('Byte. I hoped it’d be you that read it.', 'soft'),
      N(
        'Byte looks at the tag: at the H, at the leaning hand. Then at Hazel’s hand, resting on the thin grey Nubbin’s back.',
      ),
      BY('H.', 'shock'),
      BY(
        'I had a list. Forty-one people. I crossed you off first. Missing people don’t post parcels.',
        'shock',
      ),
      BY('I had Mr Grue on it. His first name’s Horace. I interviewed him.', 'shock'),
      N(
        'He sits down on the step all at once, as if somebody had taken the step away and put it back lower.',
      ),
      BY('Why me? I don’t… I count things. That’s all I do.'),
      HZ('You count things, love. I needed someone who’d count this one.', 'soft'),
      N('Byte puts his face in his notebook for a while. Nobody minds.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'big surprises and what helps',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 10,
        prompt: [N('Byte had to sit down all at once. What do you think he is feeling?')],
        options: [
          opt(
            'Surprised, glad and a bit wobbly, all at once.',
            [
              N(
                'Yes. A big surprise, even a happy one, can make your legs go. Sitting down and taking a minute is wise.',
              ),
            ],
            true,
          ),
          opt('Cross that nobody told him.', [
            N(
              'Maybe a little! Mostly he looks amazed and glad. Big surprises can make anyone need to sit down.',
            ),
          ]),
        ],
        parentNote: 'Named mixed feelings after a big surprise, and what helps.',
      },
    ],
  ),
  // step 13 done: by s28-offer
  scene(
    's28-grue-back-weed',
    [
      N(
        'Half an hour later the watch is ticking in Pixel’s palm. It was losing four minutes a day, she says, and it isn’t now.',
      ),
      N('There is a knock. Mr Grue is on the step, holding a kitchen chair.'),
      GR('I’ve come for the marmalade. That’s all. Not the party.', 'angry'),
      GR(
        'Brought my own chair. Yours are all too low. You weeded round my tree as if it mattered. I’ll sit at the back.',
        'think',
      ),
      N(
        'Parcel bows to him, lower than to anyone but Hazel. It is the nearest thing to sorry a Nubbin has.',
      ),
      N('Pixel hands Mr Grue the watch. He holds it to his ear for a long time.'),
      N('Then he puts his chair at the front, and sits down in it, properly, all the way back.'),
    ],
    [watchBeat(0)],
  ),
  scene(
    's28-grue-back-stare',
    [
      N(
        'Half an hour later the watch is ticking in Pixel’s palm. It was losing four minutes a day, she says, and it isn’t now.',
      ),
      N('There is a knock. Mr Grue is on the step, empty-handed.'),
      GR('I’ve come for the marmalade. That’s all. Not the party.', 'angry'),
      N(
        'Parcel bows to him, lower than to anyone but Hazel. It is the nearest thing to sorry a Nubbin has.',
      ),
      N(
        'Mr Grue takes his watch back from Pixel. He holds it to his ear, and says nothing at all.',
      ),
      N(
        'But he stays. Right to the end, past the last of the cake, and he helps Byte put the bunting back up.',
      ),
    ],
    [watchBeat(0)],
  ),
  // complete: by s28-column
  scene(
    's28-complete-unverified',
    [
      ...LOG_OPEN,
      BY('Unverified. Kind to Moss. Shares on purpose. Was missed, when it went.', 'think'),
      N(
        'He stops, and with the pencil from behind his ear crosses out UNVERIFIED by the first one. Then the next, and then all of them, one by one.',
      ),
      BY('There. Verified. All of it. I should have done that in the autumn.', 'soft'),
      ...GIFTS,
    ],
    [
      {
        domain: 'literacy',
        skill: 'how a character changes',
        standard: 'RL.2.3',
        kind: 'ask',
        after: 5,
        prompt: [N('In the autumn, Byte wanted proof of everything. What has changed?')],
        options: [
          opt(
            'He trusts what he has seen and felt, not only what he can prove.',
            [
              N(
                'Yes. He still loves proof. But he has learned that some true things don’t fit in a column.',
              ),
            ],
            true,
          ),
          opt('He has stopped writing things down.', [
            N(
              'He hasn’t: he’s still holding the notebook! What changed is what he’s willing to believe without proof.',
            ),
          ]),
        ],
        parentNote: 'Described how Byte changed over the story.',
      },
      themeBeat(10),
    ],
  ),
  scene(
    's28-complete-none',
    [
      ...LOG_OPEN,
      N(
        'He reads three pages of incidents. It takes a while, and Mr Grue checks his watch, which works now, twice.',
      ),
      N(
        'Then Byte stops, and looks at the page for a long time. He rules a new column down the edge, there and then.',
      ),
      BY('Good things. It needed one. I didn’t know what to call it in the autumn.', 'soft'),
      N('He fills it in while you all watch. It takes longer than the incidents did.'),
      ...GIFTS,
    ],
    [
      {
        domain: 'literacy',
        skill: 'how a character changes',
        standard: 'RL.2.3',
        kind: 'ask',
        after: 6,
        prompt: [N('Nobody told Byte to add the column. Why do you think he did it now?')],
        options: [
          opt(
            'He noticed his log was only telling half the story.',
            [
              N(
                'Yes. Three pages of incidents, and none of the best bits. He saw the gap himself, which is how it sticks.',
              ),
            ],
            true,
          ),
          opt('Mr Grue told him to.', [
            N(
              'Mr Grue was busy checking his watch! Byte worked it out himself: the log was missing the good half.',
            ),
          ]),
        ],
        parentNote: 'Explained why a character changed his mind on his own.',
      },
      themeBeat(11),
    ],
  ),
  // not a played scene: Byte's idle lines after s28Done
  scene(
    's28-byte-barks',
    [
      BY('Parcel bowed to the gatepost this morning. I bowed back. Don’t log that.'),
      BY('I’ve stopped timing Parcel’s naps. I know roughly. Roughly is, it turns out, fine.'),
      BY('Mr Grue says hello. He didn’t. But he meant to. I could tell.'),
      BY('Marmalade? It’s the good batch. They’re all the good batch.'),
      BY('I’ve started leaving a bit of room at the end of every page. In case.'),
      BY(
        'Parcel shared its breakfast with a robin. Then the robin brought its friends. I’ve ordered more bread.',
      ),
    ],
    [
      {
        domain: 'literacy',
        skill: 'reading a character through what he says',
        standard: 'RL.3.3',
        kind: 'notice',
        after: 4,
        lines: [
          N(
            '“Leaving room at the end of every page, in case” is Byte’s way of saying he’s ready for more good things.',
          ),
          N(
            'Writers often show a change in a character through small habits like this, instead of saying it straight out.',
          ),
        ],
        parentNote: 'Noticed how a small habit shows that a character has changed.',
      },
    ],
  ),
];

// ================================================================== the quest
const S28: EduQuest = {
  id: 'reader:s28',
  of: 's28',
  band: 'reader',
  title: 'The Nubbin with the Tag',
  goals: {
    's28-step1': {
      goal: 'Take the stray from the carrier’s cart to Byte’s house.',
      hint: 'Walk slowly and it will follow you. Byte’s house is the one with the very straight hedge, next to the glasshouse.',
    },
    's28-step2': {
      goal: 'Fetch Hazel’s marmalade from her pantry for the stray.',
      hint: 'The jars are on the top shelf of the pantry in Hazel’s cottage. Carry them to Byte’s house.',
    },
    's28-step3': {
      goal: 'Help Byte with Parcel’s bath, and then with the water.',
      hint: 'Mop from the bathroom outwards, towards the front door. The water is heading for the garden fence.',
    },
    's28-step4': {
      goal: 'Be at Byte’s when Mr Grue comes round about his garden.',
      hint: 'Go to Byte’s house in the morning. You won’t have to do anything. Probably.',
    },
    's28-step5': {
      goal: 'Follow Parcel when it sets off at eleven with half a sandwich.',
      hint: 'Walk behind Parcel, not beside it: it likes to lead. It goes towards the foot of the hill.',
    },
    's28-step6': {
      goal: 'See how Parcel gets on with Null.',
      hint: 'Null is at Byte’s house. Sit back and watch: Parcel will do the introducing.',
    },
    's28-step7': {
      goal: 'Go to market day with Byte to buy Parcel a coat, and keep an eye on Parcel.',
      hint: 'Follow the noise across the square. Parcel likes looking at the tops of things.',
    },
    's28-step8': {
      goal: 'Find Parcel. It wasn’t in its basket at bedtime.',
      hint: 'Look for a light next door. Mr Grue keeps a lamp burning in his glasshouse in winter.',
    },
    's28-step9': {
      goal: 'Make marmalade with Byte and Parcel from Mr Grue’s oranges.',
      hint: 'Follow Hazel’s card or Byte’s thermometer: either works. Test the set before you pour it into jars.',
    },
    's28-step10': {
      goal: 'Find Parcel in the snow.',
      hint: 'Small prints, close together, going down the lane towards the valley road. Follow them before the snow fills them in.',
    },
    's28-step11': {
      goal: 'Follow Parcel up to the cottage.',
      hint: 'Parcel has seen the smoke from Hazel’s chimney. Walk with Byte; it is heading for the bench by the cottage door.',
    },
    's28-step12': {
      goal: 'Stay with Byte while he talks to Hazel.',
      hint: 'Sit on the step by the bench. There’s no hurry.',
    },
    's28-step13': {
      goal: 'Get Mr Grue’s watch back together after Parcel’s trick.',
      hint: 'Gather every piece from the napkin, the floor and the jam, and take them to Pixel at the kitchen table.',
    },
  },
  scenes: SCENES,
  glossary: [
    gloss(
      'carrier',
      'Someone whose job is carrying goods and passengers from place to place, often by cart.',
      's28-cart',
    ),
    gloss('thorough', 'Careful to do every part of a job, leaving nothing out.', 's28-for-byte'),
    gloss(
      'preserves',
      'Jams, jellies and marmalades: fruit cooked with sugar so it keeps for a long time.',
      's28-one-jar',
    ),
    gloss('procedure', 'The proper, step-by-step way of doing something.', 's28-bath'),
    gloss('absorbent', 'Able to soak up liquid, like a sponge or a towel.', 's28-bath'),
    gloss('verified', 'Checked and proved to be true.', 's28-nubbin'),
    gloss('compensation', 'Something given to make up for a loss or damage.', 's28-compensation'),
    gloss(
      'routine',
      'The things you do in the same order, at the same times, most days.',
      's28-sandwich',
    ),
    gloss(
      'evacuee',
      'Someone moved away from a dangerous place to keep them safe.',
      's28-elevenses',
    ),
    gloss(
      'incident',
      'Something that happens, often something that goes a bit wrong.',
      's28-logged',
    ),
    gloss('efficiency', 'Doing something with the least wasted time or effort.', 's28-market'),
    gloss('parity', 'Being equal: the same for everyone.', 's28-jam-stall'),
    gloss(
      'responsibility',
      'Something that is your job to look after, and to put right if it goes wrong.',
      's28-glasshouse',
    ),
    gloss(
      'calibrated',
      'Checked against a known measurement, so it reads correctly.',
      's28-kitchen',
    ),
    gloss(
      'pectin',
      'A natural substance in fruit, especially peel and pips, that helps jam set.',
      's28-kitchen',
    ),
    gloss(
      'keepsake',
      'A small thing you keep to help you remember someone or something.',
      's28-crust',
    ),
    gloss('theory', 'An idea that tries to explain why something happened.', 's28-why'),
  ],
  notes:
    'Lessons: labels and addresses (D2.Geo.2.K-2, twice); preserves and sugar (L.3.4); 6 × 15 (3.OA.A.3), 90 − 60 ' +
    '(2.OA.A.1), 104.5 − 100 (4.MD.A.2), 7 × 4 (3.OA.A.3), five to eleven (2.MD.C.7); absorbent ' +
    'materials and layers (2-PS1-1), sound as vibration (1-PS4-1), seed to tree (3-LS1-1), Seville oranges and pectin, ' +
    'irreversible cooking (2-PS1-4), a wound spring (4-PS3-4); simile and metaphor (L.4.5), column and incident, motive, ' +
    'character change, theme; sorry to a neighbour, generosity, fear in the body, two feelings at once; the 1939 ' +
    'evacuees (D2.His.2.K-2); selling out (D2.Eco.1.K-2). Think questions with no best answer: s28-for-byte, ' +
    's28-glasshouse, s28-null-minder, s28-why. The tag and the back of the recipe card use new words, not the lifted ' +
    'lines. Story numbers: 15 spoons a jar, the last spoon on day 60.',
};

// ================================================================== exports
export const EDU_S28_READER: EduQuest[] = [S28];

export const EDU_S28_READER_VARIANTS: EduScene[] = VARIANTS;

/** Every `edu:` check used by a `do` lesson in this file (this band has none). */
export const CHECKS: string[] = [];
