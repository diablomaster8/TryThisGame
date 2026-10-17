/**
 * The Learning Grove, reader band (ages 7–10): Atlas A16, The Fox and the Rose.
 *
 * Source: atlas-a16.ts (ATLAS_A16 and ATLAS_A16_VARIANTS). The outline says this page's Learning
 * Grove version is for the older band only and ends at the well, where the prince says he is
 * going home to his rose. So there is no sprout file, and this file covers A16-1 to A16-15
 * (every step scene, done scene and complete scene) plus the ten variant scenes that play inside
 * those quests. Left out on purpose: A16-16 The Wall, A16-17 The Stars (and their variants), and
 * the three Grove scenes that play after the page (a16-grove-t20, a16-grove-luna,
 * a16-grove-sparks). See docs/logs/edu-a16.md.
 *
 * What it teaches, blended into the story: deserts and where the Sahara is; cool desert nights;
 * what a snake can and can't swallow; asteroids and their numbers; how many steps round a tiny
 * planet; plant life cycles; glass; almanacs, sunset times and time intervals; why a planet's
 * day is one spin (and why size doesn't decide it); maps, compass directions and scale; erosion;
 * echoes; dunes; the fennec; the Pole Star; wool and warmth; pulleys; thirst and water; and a few
 * French words (renard, étoile, puits). Feelings: honesty and kindness, asking what someone wants,
 * sitting beside someone who is sad, being stuck in a habit, patience with shy animals.
 *
 * Care: the drinker is "a sad man who can't stop doing something that makes him sadder", with no
 * bottles and no named substance. The snake is only ever a riddling voice. The three lifted lines
 * of the fox never appear: the fox's secret is told in new words, and the French is limited to
 * single vocabulary words. The prince's story stops before the wall; "he went home" is never
 * replaced by anything blunter in this file, and nothing here shows or hints at a bite.
 * Every quest has at least one think question (an `ask` with no `best`). British spelling.
 */
import type { EduDomain, EduQuest, EduScene, GlossaryEntry, Lesson, LessonOption } from './types';
import type { Choice, Line } from '../config/story';

type Mood = NonNullable<Line['mood']>;

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const PI = say('a16-pilot');
const PR = say('a16-prince');
const RO = say('a16-rose');
const KI = say('a16-king');
const VA = say('a16-vain');
const DR = say('a16-drinker');
const BU = say('a16-business');
const LA = say('a16-lamplighter');
const GE = say('a16-geographer');
const SN = say('a16-snake');
const FL = say('a16-flower');
const EC = say('a16-echo');
const RS = say('a16-roses');
const FX = say('a16-fox');
const SW = say('a16-switchman');
const ME = say('a16-merchant');

// ---------------------------------------------------------------- builders
type LessonIn = Omit<Lesson, 'id'>;

/** Builds `reader:<of>` and numbers its lessons `reader:<of>-l1`, `-l2`. */
const scene = (of: string, lines: Line[], lessons: LessonIn[], choices?: Choice[]): EduScene => {
  const id = `reader:${of}`;
  const s: EduScene = {
    id,
    of,
    band: 'reader',
    lines,
    lessons: lessons.map((l, i) => ({ id: `${id}-l${i + 1}`, ...l })),
  };
  if (choices) s.choices = choices;
  return s;
};

const quest = (
  of: string,
  title: string,
  goals: EduQuest['goals'],
  scenes: EduScene[],
  glossary?: GlossaryEntry[],
): EduQuest => {
  const q: EduQuest = { id: `reader:${of}`, of, band: 'reader', title, goals, scenes };
  if (glossary) q.glossary = glossary;
  return q;
};

const g = (goal: string, hint: string) => ({ goal, hint });

const gloss = (word: string, meaning: string, of: string): GlossaryEntry => ({
  word,
  meaning,
  scene: `reader:${of}`,
});

const opt = (label: string, reply: Line[], best = false): LessonOption =>
  best ? { label, best: true, reply } : { label, reply };

const ask = (
  domain: EduDomain,
  skill: string,
  after: number,
  prompt: Line[],
  options: LessonOption[],
  parentNote: string,
  standard?: string,
): LessonIn => ({
  domain,
  skill,
  kind: 'ask',
  after,
  prompt,
  options,
  parentNote,
  ...(standard ? { standard } : {}),
});

const notice = (
  domain: EduDomain,
  skill: string,
  after: number,
  lines: Line[],
  parentNote: string,
  standard?: string,
): LessonIn => ({
  domain,
  skill,
  kind: 'notice',
  after,
  lines,
  parentNote,
  ...(standard ? { standard } : {}),
});

const doIt = (
  domain: EduDomain,
  skill: string,
  after: number,
  check: string,
  lines: Line[],
  parentNote: string,
  standard?: string,
): LessonIn => ({
  domain,
  skill,
  kind: 'do',
  after,
  check,
  lines,
  parentNote,
  ...(standard ? { standard } : {}),
});

const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice =>
  set ? { id, label, set, then } : { id, label, then };

// ================================================================== A16-1 Drawing Number One

/** The desert opening, with an optional Sable line (t45 / bonded) before the plane comes into view. */
const desertScene = (of: string, sable?: Line): EduScene => {
  const lines: Line[] = [
    N(
      'Nova’s atlas falls open at a page that is almost empty: one small planet, one chair, and a sunset behind it.',
    ),
    N(
      'You touch the sunset. It turns warm like sand, and then it is sand, and you are standing in it.',
    ),
    N(
      'Dunes in every direction, under a sky so clean it looks scrubbed. Your Nubbin sneezes at the size of it.',
    ),
    ...(sable ? [sable] : []),
    N(
      'A few dunes away, a small aeroplane sits nose-down in the sand. A pair of legs sticks out from under the engine.',
    ),
    PI('Unless you’re a mechanic, keep back. If you are one, come quickly.', 'think'),
    N('He slides out: a man with oil to his elbows and a face that hasn’t slept.'),
    PI('I’m days from anywhere. You’re the last thing I expected to see.'),
    PI(
      'Where did you come from? No, don’t tell me. I’ve stopped expecting sensible answers out here.',
    ),
  ];
  return scene(
    of,
    lines,
    [
      notice(
        'science',
        'what a desert is, and that the Sahara is the biggest hot desert',
        lines.length - 1,
        [
          PI(
            'Welcome to the Sahara, by the way. It’s a desert: a place that gets very little rain.',
          ),
          PI(
            'Less than 25 centimetres (10 inches) in a whole year. Plenty of sand, not much to drink.',
          ),
          PI('It’s the biggest hot desert on Earth. You’ll want a hat.'),
        ],
        'Learned that a desert gets very little rain, and that the Sahara is the biggest hot desert.',
        '2-LS4-1',
      ),
    ],
    [
      ch('spanner', 'Offer to hold the spanner.', [
        PI('Hold it, and don’t hand it over unless I ask. I have a system. It’s mostly muttering.'),
      ]),
      ch('hurt', 'Ask if he’s hurt.', [
        PI('Only my pride. And the engine. The engine is worse.', 'soft'),
      ]),
      ch('shade', 'Sit down in the shade of the wing.', [
        N(
          'You sit, and your Nubbin sits. After a moment the man sits too, because it seems rude not to.',
        ),
      ]),
    ],
  );
};

const Q1_SCENES: EduScene[] = [
  desertScene('a16-01-desert'),
  scene(
    'a16-01-desert-done',
    [
      N(
        'He slides back under the engine. Every so often a hand comes out for a tool, then disappears again.',
      ),
      PI(
        'Sixteen litres of water, that’s all I have. I drink two a day, and I’m careful about it.',
      ),
      PI('So that’s eight days for me. But water goes faster when somebody shares it.'),
      PI(
        'When I get this running, I’ll show you something. Nobody has ever got it right. Not once.',
      ),
    ],
    [
      ask(
        'maths',
        'dividing a total by a daily amount',
        2,
        [
          PI(
            'Say one more person shares it and drinks two litres a day too. How long do sixteen litres last then?',
          ),
        ],
        [
          opt(
            'Four days.',
            [
              N('Yes. Two people use 2 + 2 = 4 litres a day, and 16 ÷ 4 = 4.'),
              N('Four days. Sharing makes the water go twice as fast.'),
            ],
            true,
          ),
          opt('Six days.', [
            N('Let’s count it. Two people use 4 litres a day: 4, 8, 12, 16.'),
            N('That’s four days, not six.'),
          ]),
          opt('Eight days.', [
            N(
              'Eight days is for one person. Two people use twice as much, so the water lasts half as long.',
            ),
            N('Half of eight is four days.'),
          ]),
        ],
        'Divided 16 litres by 4 litres a day to find how many days the water lasts.',
        '3.OA.A.3',
      ),
    ],
  ),
  scene(
    'a16-01-drawing',
    [
      N(
        'At noon the sun is too hot to work in. The pilot crawls out, wipes his hands, and takes a battered notebook from his jacket.',
      ),
      PI('When I was six, I drew this. I showed it to every grown-up I knew.'),
      N('It is a brown shape like a hill, or a lump, or a hat with a very low crown.'),
      PI(
        'I asked if it frightened them. They all said, “Why would anyone be frightened of a hat?”',
      ),
      PI('I still show it to everyone I meet. It’s a test. Go on. What is it?'),
      N(
        'Your Nubbin climbs onto your knee to see. It studies the drawing for a long time, with its head on one side.',
      ),
    ],
    [
      ask(
        'literacy',
        'two people can see the same thing differently',
        4,
        [
          N('The grown-ups saw a hat, but the boy who drew it saw something else.'),
          N('Why might they see different things?'),
        ],
        [
          opt('Each person looks with their own ideas.', [
            N('That’s a fair answer. What we already know and expect changes what we see.'),
            N('Looking slowly, like your Nubbin, can show you more.'),
          ]),
          opt('The grown-ups guessed quickly, and the boy knew what he had drawn.', [
            N('That’s a fair answer. He knew the answer, and they didn’t stop to look closely.'),
          ]),
          opt('It was not a very clear drawing.', [
            N('That’s a fair answer. A drawing can be hard to read.'),
            N('But someone who looks carefully, like your Nubbin, can find much more in it.'),
          ]),
        ],
        'Thought about why two people can look at the same picture and see different things.',
        'RL.3.6',
      ),
    ],
    [
      ch('hat', 'Say it’s a hat.', [
        PI('Of course it is. Everybody says so.', 'sad'),
        N('But your Nubbin is still looking.'),
      ]),
      ch('wait', 'Wait for your Nubbin.', [
        N('You wait, and the pilot waits. Your Nubbin is in no hurry at all.'),
      ]),
      ch('inside', 'Say it looks like something with something inside it.', [
        PI('Go on…', 'think'),
      ]),
    ],
  ),
  scene(
    'a16-01-drawing-done',
    [
      N(
        'Your Nubbin puts a paw on the lump and traces it: a long body, a tail, and in the middle a great round bulge.',
      ),
      N('Then it lies flat on its tummy and tries to look as full as possible.'),
      PI('A snake. A snake that has swallowed an elephant whole.', 'shock'),
      PI('Twenty-odd years, and the first one to see it is… that.', 'happy'),
    ],
    [
      notice(
        'science',
        'snakes swallow food whole; a real snake could not swallow an elephant',
        3,
        [
          PI('No real snake could swallow an elephant, mind you. It would never fit.'),
          PI(
            'But real snakes do swallow their food whole. Their jaws stretch wide, because they can’t chew.',
          ),
          PI('And one big meal can keep a snake going for weeks.'),
        ],
        'Learned that snakes swallow their food whole and can go for weeks after a big meal.',
        '4-LS1-1',
      ),
    ],
  ),
  scene(
    'a16-01-complete',
    [
      N(
        'He turns the page. The same snake is drawn again, opened up like a map, with a very calm elephant inside.',
      ),
      PI('I had to draw the inside for them. Grown-ups always need things explained.'),
      PI(
        'Then they told me to stop drawing and learn something useful. So I learnt to fly, which is how I got here.',
      ),
      N('He looks at the nose-down plane and laughs, which you didn’t expect.'),
      PI(
        'Stay, if you like. It’s a big desert. There’s room for two strangers. Three, with that one.',
      ),
    ],
    [
      notice(
        'art',
        'a cross-section shows the inside of something',
        1,
        [
          PI(
            'A drawing that shows the inside of a thing is called a cross-section. It’s as if you’d cut it open.',
          ),
          PI('Engine makers use them all the time. So do doctors, and so do people who dig wells.'),
        ],
        'Learned that a cross-section is a drawing that shows the inside of something.',
        'L.2.4',
      ),
      ask(
        'sel',
        'welcoming someone new',
        4,
        [
          N(
            'The pilot is tired and far from home, but he invites strangers to stay. How can you make someone new feel welcome?',
          ),
        ],
        [
          opt(
            'Say hello, include them, and ask what they would like to do.',
            [N('Yes. A friendly hello and a real invitation make a stranger feel they belong.')],
            true,
          ),
          opt('Leave them alone until they speak first.', [
            N('Some people are shy, so it can feel polite to wait.'),
            N('A small hello from you can make it much easier for them.'),
          ]),
          opt('Tell them all the rules straight away.', [
            N('Rules can help later. But first, people want to feel they are wanted.'),
            N('A smile and an invitation come first.'),
          ]),
        ],
        'Thought about how to make a newcomer feel welcome.',
        'CASEL: Relationship skills',
      ),
    ],
  ),
];

const Q1 = quest(
  'a16-01',
  'Drawing Number One',
  {
    'a16-01-s1': g(
      'Step into the desert page and find the stranger under the plane.',
      'Touch the little planet on the page, then walk towards the plane in the dunes.',
    ),
    'a16-01-s2': g(
      'Look at the pilot’s first drawing, and say what you see.',
      'Sit by the pilot when he takes out his notebook at noon.',
    ),
  },
  Q1_SCENES,
  [
    gloss('dunes', 'Hills of sand made by the wind.', 'a16-01-desert'),
    gloss(
      'cross-section',
      'A picture or cut that shows what is inside something.',
      'a16-01-complete',
    ),
  ],
);

// ================================================================== A16-2 Draw Me a Sheep

const Q2_SCENES: EduScene[] = [
  scene(
    'a16-02-dawn',
    [
      N(
        'That night you sleep on the sand by the wing. There are so many stars that the dark between them looks crowded.',
      ),
      N('At sunrise a small voice wakes the pilot. It is quite a polite voice, and quite certain.'),
      PR('Please. Would you draw a sheep for me?'),
      N(
        'A boy stands in the sand with a long scarf, a serious face, and not a speck of dust on him.',
      ),
      PI('A what?'),
      PR('A sheep. Please, if you’re not too busy.', 'soft'),
      PI('I can’t draw. I only ever learnt the one. Here.'),
      N(
        'He draws the snake with the elephant inside, from the outside, and hands it over with a shrug.',
      ),
      PR('No, no. Snakes are dangerous, and elephants take up far too much room. A sheep.'),
      N('The pilot’s mouth falls open. Your Nubbin looks delighted, as if it has found a cousin.'),
    ],
    [
      notice(
        'science',
        'desert nights are cold because the dry, clear air lets heat escape',
        3,
        [
          PI('Brr. Chilly, this early. You’d never think the sand was baking yesterday.'),
          PI('In the Sahara it can be over 40 °C (104 °F) by day and near 10 °C (50 °F) by night.'),
          PI(
            'Dry, clear air has no clouds to hold the heat in. When the Sun goes, the warmth just leaves.',
          ),
        ],
        'Learned why deserts can be very hot by day and cold at night.',
        'K-PS3-1',
      ),
    ],
    [
      ch('sit', 'Sit down to watch.', [
        N(
          'You sit cross-legged in the sand. The boy sits too, opposite, and waits for his sheep as if it were a bus.',
        ),
      ]),
      ch('hello', 'Say hello to the boy.', [
        PR('Hello. Can you draw sheep?'),
        N('You say sorry, you can’t draw sheep.'),
        PR('That’s all right. Nobody can, it seems.'),
      ]),
    ],
  ),
  scene(
    'a16-02-drawings',
    [
      N('The pilot draws a sheep. The boy studies it with great care.'),
      PR('No. That one is poorly already. Another, please.'),
      N('The second sheep is fluffier. The boy smiles kindly, the way you smile at a mistake.'),
      PR('That one has horns. That’s a ram. I asked for a sheep.'),
      N('The third is small and neat, with a tidy face.'),
      PR('He looks tired already. Mine has to last a long time.', 'sad'),
      N(
        'The pilot glances at his engine, which is waiting, and at the sun, which is climbing. He scribbles four quick lines.',
      ),
      PI('This is a box. The sheep you want is inside.'),
      N('It is a plain box with three holes in the side. The boy’s whole face lights up.'),
      PR('That’s him! That’s exactly him! Will he need a lot of grass?', 'happy'),
      PI('Why?'),
      PR('Where I live, there isn’t much room for grass. Or for anything.'),
      N('He bends close to the holes and whispers, so as not to wake anybody.'),
      PR('Shh. He’s already asleep.', 'soft'),
    ],
    [
      ask(
        'sel',
        'being honest and gentle together',
        5,
        [
          N(
            'The boy told the pilot the truth about every drawing, and he never was rude. How do you tell someone you don’t like their work, kindly?',
          ),
        ],
        [
          opt(
            'Say what you need, in a friendly way, like “I need one that will last”.',
            [
              N('Yes. Being honest and gentle at once is a skill.'),
              N('The pilot gets a clear clue, and nobody feels small.'),
            ],
            true,
          ),
          opt('Say you love it, even if you don’t.', [
            N('That’s kind, but then he wouldn’t get the sheep the boy wanted.'),
            N('Telling the truth gently helps both people.'),
          ]),
          opt('Say it’s awful.', [
            N('That’s honest, but it hurts, and it doesn’t help him draw a better one.'),
            N('We can be honest without being harsh: say what you need.'),
          ]),
        ],
        'Practised giving honest feedback in a kind way.',
        'CASEL: Relationship skills',
      ),
    ],
  ),
  scene(
    'a16-02-drawings-done',
    [
      N(
        'Your Nubbin climbs onto the lid of the box and sits on it gently, as if it might be somebody’s bed.',
      ),
      N('Neither of you can see the sheep. The boy can, and that seems to be enough for everyone.'),
    ],
    [
      notice(
        'literacy',
        'inferring: using clues to work out what the story doesn’t say',
        1,
        [
          N(
            'The boy sees a sheep because a box with holes and a few words give him clues, and his mind fills in the rest.',
          ),
          N(
            'Readers do this too, using clues to work out what a story doesn’t say. That is called inferring.',
          ),
        ],
        'Learned that inferring means using clues to work out what is not said.',
        'RL.2.3',
      ),
    ],
  ),
  scene(
    'a16-02-muzzle',
    [
      N(
        'The boy lies on his front with one eye to the holes. The pilot has gone back under his engine.',
      ),
      PR('Sheep eat bushes, don’t they?'),
      N('From under the plane comes a muffled “Mostly.”'),
      PR('Good. That’s very useful.', 'think'),
      PR('And flowers? Do they eat flowers?'),
      N('The voice under the plane says sheep eat whatever they find, even flowers with thorns.'),
      N(
        'The boy goes quiet, the way people do when they have thought of something and put it away for later.',
      ),
      N(
        'You look at the box, with your Nubbin on the lid. A sheep that eats everything might need a muzzle, one day.',
      ),
    ],
    [
      notice(
        'science',
        'sheep are herbivores; what a muzzle is for',
        5,
        [
          PI(
            'Sheep are herbivores, which means they eat only plants. Mostly grass, but also leaves, shrubs and flowers.',
          ),
          PI(
            'A muzzle goes round an animal’s nose and mouth so it can’t nibble things it shouldn’t.',
          ),
        ],
        'Learned that sheep are herbivores and what a muzzle is for.',
        'K-LS1-1',
      ),
    ],
    [
      ch(
        'asked',
        'Ask the pilot to draw a muzzle for the sheep now, before it’s too late.',
        [
          PI('A muzzle. Fair enough. Pass me the pencil.'),
          N(
            'He draws one on a scrap of paper: a little muzzle, a leather strap to fasten it, and a proper buckle.',
          ),
          PR('Not now. He’s asleep. He’d hate it.', 'soft'),
          PI('Then I’ll keep it till you need it. Strap and all.'),
          N('He folds the scrap into the very back of his notebook.'),
        ],
        { 'a16-strap': 'asked' },
      ),
      ch(
        'left',
        'Leave it. The sheep’s asleep.',
        [
          N(
            'You leave it. The boy has his sheep, the sheep has its box, and nobody is thinking about muzzles yet.',
          ),
        ],
        { 'a16-strap': 'left' },
      ),
    ],
  ),
  scene(
    'a16-02-muzzle-done',
    [
      PR('At night I can put him in his box. Then nobody ever has to tie him up.'),
      PI('Where’s that? Where do you live?'),
      N(
        'The boy doesn’t answer. He asks what the plane is instead, and is delighted to hear that it fell out of the sky.',
      ),
      PR('You fell out of the sky? So did I, in a way. Which star is yours?', 'happy'),
    ],
    [
      ask(
        'sel',
        'what animals need to be safe and happy',
        0,
        [
          N(
            'The boy would rather not tie his sheep up at all. What helps an animal live safely and happily?',
          ),
        ],
        [
          opt('A safe place to rest, food and water, and room to move.', [
            N(
              'That’s a fair answer. Animals need safety and freedom, and people who think about what they want.',
            ),
          ]),
          opt('Keeping it tied up, so it can’t run off.', [
            N(
              'That’s a fair answer. Tying keeps an animal close, and the boy has thought about that too.',
            ),
            N('But a tied-up animal can’t move or choose, so he wants another way.'),
          ]),
          opt('Food, and someone who loves it.', [
            N('That’s a fair answer. Food and love matter a great deal.'),
            N('Water, shelter and room to move matter too.'),
          ]),
        ],
        'Thought about what animals need to be safe and happy, including freedom.',
        'CASEL: Social awareness',
      ),
    ],
  ),
  scene(
    'a16-02-complete',
    [
      N('The pilot laughs and wipes his forehead with his wrist, leaving a long black streak.'),
      PI('Here. One for you as well. Anyone and anything ought to have a sheep.'),
      N(
        'He draws another box with three holes in it, and gives it to you. Your Nubbin climbs in and peers out of a hole.',
      ),
      PR('Yours is asleep too. You can tell from how quiet it is.', 'happy'),
    ],
    [
      ask(
        'maths',
        'equal groups: 2 groups of 3',
        2,
        [
          N(
            'Your box has three holes, and so does the boy’s. How many holes are there in the two boxes together?',
          ),
        ],
        [
          opt('Six.', [N('Yes: 3 + 3 = 6. Or two groups of three: 2 × 3 = 6.')], true),
          opt('Five.', [
            N('Close! Count again: 1, 2, 3 on one box, then 4, 5, 6 on the other.'),
            N('That makes six holes.'),
          ]),
          opt('Three.', [
            N('Three is the holes in one box. There are two boxes, so three twice: 3 + 3 = 6.'),
          ]),
        ],
        'Used equal groups to work out 2 × 3.',
        '3.OA.A.1',
      ),
    ],
  ),
];

const Q2 = quest(
  'a16-02',
  'Draw Me a Sheep',
  {
    'a16-02-s1': g(
      'Spend the night by the plane, and see who comes at sunrise.',
      'Rest in the shade of the wing until the page’s dawn.',
    ),
    'a16-02-s2': g(
      'Watch the pilot try to draw a sheep that is good enough.',
      'Stay by the boy while the pilot draws.',
    ),
    'a16-02-s3': g(
      'Decide whether to ask for a muzzle for the sheep.',
      'Talk to the pilot while the boy is busy with his box.',
    ),
  },
  Q2_SCENES,
  [
    gloss(
      'muzzle',
      'A strap or cover that goes over an animal’s nose and mouth, so it can’t nibble or eat things.',
      'a16-02-muzzle',
    ),
  ],
);

// ================================================================== A16-3 Asteroid B-612

const Q3_SCENES: EduScene[] = [
  scene(
    'a16-03-telling',
    [
      N(
        'It takes days to get anything out of the boy. He asks questions all the time, and hardly hears yours.',
      ),
      N('But at night, by the cold engine, under the stars, he begins to tell.'),
      PR(
        'My planet is hardly bigger than a house. You can walk all round it before your tea gets cold.',
      ),
      N(
        'The pilot murmurs that it must be an asteroid, one of the little ones with only a number for a name.',
      ),
      PI('Call it B-612, then, for now. Every little asteroid needs a number.'),
      PR('Grown-ups love numbers. Tell them about a friend, and they ask how much he weighs.'),
      PR('It’s forty-one steps round. My steps are small, about half a metre each.'),
      N(
        'He tells it so well that the sand under you curves. The sky comes down close, and you are standing on a planet the size of a house.',
      ),
    ],
    [
      notice(
        'science',
        'asteroids are small rocky worlds; real ones have numbers and names',
        4,
        [
          PI('Real asteroids are small, rocky worlds left over from when the planets were made.'),
          PI(
            'Most circle the Sun between Mars and Jupiter. Each gets a number, and many get a name too, like 4 Vesta.',
          ),
        ],
        'Learned that asteroids are small rocky worlds and that real ones are numbered.',
        '1-ESS1-1',
      ),
      ask(
        'maths',
        'multiplying by a half-metre step and converting units',
        7,
        [
          PR(
            'Forty-one steps, and every step is 50 centimetres. About how far is it all the way round?',
          ),
        ],
        [
          opt(
            'About 20 metres and 50 centimetres.',
            [
              N('Yes. 41 × 50 cm is 2,050 cm, and 100 cm make a metre.'),
              N(
                'So it’s 20 metres and 50 centimetres. A tiny planet, but a long walk for a small boy.',
              ),
            ],
            true,
          ),
          opt('41 metres.', [
            N('That would be if each step were a whole metre.'),
            N(
              'Each step is half a metre, so the answer is about half of 41: 20 and a half metres.',
            ),
          ]),
          opt('9 metres.', [
            N('Let’s check. 40 steps of 50 cm is 2,000 cm, which is 20 metres.'),
            N('One more step makes 20 metres and 50 centimetres.'),
          ]),
        ],
        'Multiplied 41 × 50 cm and changed centimetres into metres.',
        '4.MD.A.1',
      ),
    ],
    [
      ch('colour', 'Ask what colour his sunsets are.', [
        PR('Every colour, one after another. You’ll see those too.', 'happy'),
      ]),
      ch('steps', 'Ask how many steps it is round.', [
        PR('That’s a grown-up question.', 'sad'),
        PR('Forty-one. Not counting going round the rose.'),
      ]),
      ch('nubbin', 'Watch your Nubbin.', [
        N(
          'Your Nubbin has already set off round the planet. It comes back from the other side almost at once, astonished.',
        ),
      ]),
    ],
  ),
  scene(
    'a16-03-weeding',
    [
      N(
        'It is morning on the little planet. There are three volcanoes, each about knee-high, and two of them are warm.',
      ),
      PR(
        'I sweep them out every day. Then they burn slow and steady, and I can heat my breakfast on them.',
      ),
      PR('That one’s asleep. I sweep it anyway. You never know with volcanoes.', 'think'),
      N(
        'Then he kneels and shows you the soil. Tiny green shoots are coming up everywhere, and they all look much the same.',
      ),
      PR(
        'These are baobabs. They grow as big as hills, and if you let them, their roots go right through the planet.',
      ),
      PR(
        'These others might be roses. You have to tell them apart while they’re small. And then you mustn’t wait.',
      ),
      N('Your Nubbin grips a shoot in both paws and looks up, waiting to be told.'),
    ],
    [
      ask(
        'sel',
        'dealing with small problems early',
        6,
        [
          PR(
            'A baobab shoot is easy to pull when it’s small, and impossible when it’s a tree. So when should I deal with a small problem?',
          ),
        ],
        [
          opt('Early, while it’s small.', [
            N(
              'That’s a fair answer. Small problems are much easier to fix early, like baobab shoots.',
            ),
          ]),
          opt('Later, when I have more time.', [
            N('That’s a fair answer. Later feels easier.'),
            N('The boy would say that small problems grow, like baobabs, and get harder to pull.'),
          ]),
          opt('It depends how big the problem is.', [
            N('That’s a fair answer. Some problems do fade away, and others grow.'),
            N('The hard part is telling which is which. Baobabs look harmless at first.'),
          ]),
        ],
        'Thought about dealing with small problems before they grow.',
        'CASEL: Responsible decision-making',
      ),
    ],
    [
      ch('pull', 'Pull it. It has a baobab’s fat stem.', [
        N(
          'Out it comes, root and all. The boy nods once, like a teacher who has seen a sum done right.',
        ),
      ]),
      ch('ask', 'Ask him which it is first.', [
        PR('Baobab. Good. Asking is better than pulling up a rose.'),
        N('Out it comes, root and all.'),
      ]),
      ch('wait', 'Leave it a day, to be sure.', [
        PR('No. By tomorrow it’ll be too big to tell you anything but trouble.'),
        N('He pulls it himself, gently and at once.'),
      ]),
    ],
  ),
  scene(
    'a16-03-weeding-done',
    [
      N(
        'By the time the sun is properly up, the planet is clean. You have a heap of baobab shoots, and not one rose in it.',
      ),
      PR(
        'I knew a planet where a lazy man left three of them. You can’t see the ground there any more.',
        'sad',
      ),
    ],
    [
      notice(
        'science',
        'real baobabs live in dry lands and store water in their trunks',
        1,
        [
          N('Real baobab trees are not nearly so dreadful.'),
          N(
            'They grow in Africa, Madagascar and Australia, and store water in thick trunks to get through dry months.',
          ),
          N('Some live for more than a thousand years.'),
        ],
        'Learned that real baobab trees store water in their trunks and can live for over a thousand years.',
        '3-LS4-3',
      ),
    ],
  ),
  scene(
    'a16-03-complete',
    [
      PR('Every morning, first thing. If you leave it for later, later turns into trees.'),
      N(
        'The telling fades. The sand comes back under you, and the pilot is lying by the plane with his hands behind his head.',
      ),
      PI('Baobabs. All right. I’ll draw you one, so nobody forgets.'),
      N(
        'He draws a little planet with three enormous trees squeezing it. Your Nubbin gives the drawing a very hard look.',
      ),
    ],
    [
      notice(
        'literacy',
        'a metaphor says one thing and means another',
        0,
        [
          N(
            'The boy says “later turns into trees”. Later can’t really grow leaves, so this is a metaphor.',
          ),
          N(
            'A metaphor talks about one thing to explain another. Here it means a problem you put off keeps on growing.',
          ),
        ],
        'Learned that a metaphor describes one thing by talking about another.',
        'L.4.5',
      ),
    ],
  ),
];

const Q3 = quest(
  'a16-03',
  'Asteroid B-612',
  {
    'a16-03-s1': g(
      'Listen to the boy tell where he comes from.',
      'Sit by the plane after dark, when the boy starts talking.',
    ),
    'a16-03-s2': g(
      'Help with one morning’s weeding on the little planet.',
      'Pull the baobab shoots while they’re tiny. Leave anything that might be a rose.',
    ),
  },
  Q3_SCENES,
  [
    gloss('asteroid', 'A small rocky world that travels round the Sun.', 'a16-03-telling'),
    gloss(
      'baobab',
      'A real tree with a very thick trunk, which grows in dry lands.',
      'a16-03-weeding',
    ),
    gloss(
      'metaphor',
      'Describing one thing by saying it is another, to help explain it.',
      'a16-03-complete',
    ),
  ],
);

// ================================================================== A16-4 The Sunsets

const Q4_SCENES: EduScene[] = [
  scene(
    'a16-04-chairs',
    [
      N(
        'Another evening by the plane, and another telling. This time the boy says only one word: sunsets.',
      ),
      N(
        'Then you are on his planet again. He sets out his little chair, one for you, and a flat pebble for your Nubbin.',
      ),
      PR(
        'On my planet you don’t have to wait for the sun to set. You just move your chair a few steps, and it sets again.',
      ),
      N(
        'The sun goes down. He gets up, moves his chair a few steps and sits, and the sun goes down again.',
      ),
      N(
        'You move your chair, and your Nubbin rolls its pebble. The sun goes down a third time, pink and then gold.',
      ),
      PR(
        'Once I watched it lots and lots of times in one day. I lost count somewhere after forty.',
      ),
      N('He doesn’t say why. He moves his chair again, and sits, and holds his knees.'),
    ],
    [
      doIt(
        'maths',
        'multiplication: equal groups of steps',
        5,
        'edu:count:chair-steps:40',
        [
          PR('Four chair-steps for every sunset. Move your chair and count along with me.'),
          N(
            'Ten sunsets make ten groups of four steps. Count them in fours: 4, 8, 12, and on until you reach forty.',
          ),
        ],
        'Skip-counted in fours to find 10 × 4 = 40.',
        '3.OA.A.3',
      ),
    ],
    [
      ch('why', 'Ask him why.', [
        PR('You only want that many when something’s wrong.', 'sad'),
        N('He doesn’t say what.'),
      ]),
      ch('quiet', 'Say nothing, and move your chair when he does.', [
        N('You move when he moves. Sunset after sunset, nobody says anything, and nobody has to.'),
      ]),
      ch('lean', 'Let your Nubbin lean on him.', [
        N(
          'Your Nubbin leaves its pebble and leans on his ankle. He doesn’t look down, but he moves his foot so it fits better.',
        ),
      ]),
    ],
  ),
  scene(
    'a16-04-chairs-done',
    [
      N(
        'Pink, gold, red, violet. The planet is so small you can feel it turning under the chair legs.',
      ),
      N('After a long time he stops moving his chair, and lets the night come.'),
    ],
    [
      notice(
        'art',
        'warm and cool colours: touch words borrowed for colour',
        0,
        [
          N(
            'Warm and cool are words for how things feel to touch. Artists borrow them for colours.',
          ),
          N(
            'Red, orange, pink and gold are warm colours, and blue and violet are cool. A sunset puts them side by side.',
          ),
        ],
        'Learned the difference between warm and cool colours, and that the names come from touch.',
        'RL.1.4',
      ),
    ],
  ),
  scene(
    'a16-04-dark',
    [
      N('The stars come out over the little planet one by one, the way lamps come on in a street.'),
      PR('There’s a flower. On my planet. That’s why I couldn’t stop watching.'),
      PR('I’ll tell you about her. Not tonight.', 'soft'),
      N(
        'The planet lets go of you. You’re back on the sand, and the pilot is turning a bolt over and over in his fingers.',
      ),
      PI('He cries sometimes, you know. I don’t know what to do about it.'),
      PI(
        'I’ve never known what to do when somebody cries. They don’t teach you that with engines.',
        'sad',
      ),
    ],
    [
      ask(
        'sel',
        'how to help someone who is crying',
        5,
        [N('The pilot doesn’t know what to do when someone is crying. What could he try?')],
        [
          opt('Sit beside him and listen.', [
            N('That’s a fair answer. Being close and quiet shows someone they’re not alone.'),
          ]),
          opt('Ask him if he would like company or time alone.', [
            N('That’s a fair answer, and a thoughtful one. Asking lets him choose.'),
          ]),
          opt('Cheer him up with a joke.', [
            N('That’s a fair answer. A joke can help.'),
            N('Some people need to feel sad first, so it may help to wait and see.'),
          ]),
        ],
        'Thought about how to be a good friend to someone who is crying.',
        'CASEL: Social awareness',
      ),
    ],
  ),
  scene(
    'a16-04-complete',
    [
      N('The boy has fallen asleep against the plane’s wheel, with his scarf over his nose.'),
      N(
        'The pilot puts his jacket over him very carefully, as if he has never done it before. He probably hasn’t.',
      ),
      PI('A flower. All that, for a flower.', 'think'),
      PI('Well. I suppose that’s as good a reason as any.', 'soft'),
    ],
    [
      ask(
        'literacy',
        'working out a character’s feelings from clues',
        3,
        [N('Why did the boy watch so many sunsets in one day?')],
        [
          opt(
            'He was sad about his flower, and the sunsets comforted him.',
            [
              N(
                'Yes. He told us you only want that many when something is wrong, and he said “there’s a flower”.',
              ),
              N('Those are the clues.'),
            ],
            true,
          ),
          opt('Because he loved sunsets more than anything.', [
            N('He may love them. But he said you only want that many when something is wrong.'),
            N('That’s a clue that he was sad.'),
          ]),
          opt('Because he couldn’t work out how to stop the sun.', [
            N('He moved his own chair, so he was in charge of the sunsets.'),
            N('The better clue is what he said about something being wrong.'),
          ]),
        ],
        'Used clues in the story to work out why a character acted as he did.',
        'RL.3.3',
      ),
    ],
  ),
];

const Q4 = quest(
  'a16-04',
  'The Sunsets',
  {
    'a16-04-s1': g(
      'Sit with the boy on his planet, and watch the sunsets.',
      'Sit in the chair beside his. Move when he moves.',
    ),
    'a16-04-s2': g(
      'Stay with him until the last sunset is over.',
      'Keep sitting. Wait for the stars.',
    ),
  },
  Q4_SCENES,
);

// ================================================================== A16-5 The Rose

const Q5_SCENES: EduScene[] = [
  scene(
    'a16-05-bud',
    [
      N('This time he tells it as soon as the sun is down, as if he has been saving it up.'),
      N(
        'His planet, long ago: one morning, a shoot nobody has seen before, not a baobab and not a weed. He watches it every day.',
      ),
      N(
        'It grows a bud, an enormous one, and then it takes ages. Inside the green, something is choosing its colours very carefully.',
      ),
      PR(
        'She wanted to come out perfect. She wasn’t going to be rushed. Not by me. Not by the sun.',
        'soft',
      ),
      N('Then one morning, exactly at sunrise, she opens, and yawns.'),
      RO('Oh. I’ve only just woken up. Please excuse me. I must look a sight.'),
      PR('You look like nothing I’ve ever seen.', 'shock'),
      RO('Naturally. And I came out at sunrise, which is the proper time.'),
      RO('I believe it’s time for breakfast. If somebody would be so kind.'),
      N(
        'He runs for the watering can. Your Nubbin runs too, though nobody asked it to and it has no watering can.',
      ),
    ],
    [
      notice(
        'science',
        'a flower’s life cycle: seed, shoot, bud, flower, new seeds',
        2,
        [
          N(
            'A flower has a life cycle. It begins as a seed, grows into a shoot, then a bud, then a flower.',
          ),
          N('The flower makes new seeds. When they grow, the cycle begins all over again.'),
        ],
        'Learned the life cycle of a flowering plant.',
        '3-LS1-1',
      ),
    ],
    [
      ch('bow', 'Bow to her.', [RO('Well. At least somebody here has manners.', 'happy')]),
      ch('can', 'Help him fill the watering can.', [
        N(
          'You hold the can and he pours. The rose watches you both as if she is marking you out of ten.',
        ),
      ]),
      ch('thorns', 'Look at her thorns.', [
        RO('Four. Quite enough for anything with claws. Let them come.'),
        N('Your Nubbin takes a step back, to be polite.'),
      ]),
    ],
  ),
  scene(
    'a16-05-bud-done',
    [
      RO(
        'There’s a wind on this planet that comes from nowhere. A screen would be the least you could do.',
      ),
      N('She coughs, a small cough and possibly an invented one. He runs for the screen anyway.'),
    ],
    [
      ask(
        'literacy',
        'what a narrator’s word choice tells us about a character',
        1,
        [
          N(
            'The narrator says her cough is “possibly an invented one”. What does that tell us about the rose?',
          ),
        ],
        [
          opt(
            'She may be exaggerating, to get attention.',
            [
              N('Yes. “Possibly invented” is a clue that she might be pretending a little.'),
              N('And the boy runs for the screen anyway, which tells us about him.'),
            ],
            true,
          ),
          opt('She is very ill.', [
            N(
              'The narrator says “possibly invented”, which hints she may not be as ill as she sounds.',
            ),
            N('We can’t be sure, but look at the exact words.'),
          ]),
          opt('She doesn’t like the boy at all.', [
            N('She does demand a lot. But nothing here says she dislikes him.'),
            N('The clue is in “possibly invented”: she may be pretending to get what she wants.'),
          ]),
        ],
        'Used the narrator’s exact words as a clue to a character’s traits.',
        'RL.3.3',
      ),
    ],
  ),
  scene(
    'a16-05-globe',
    [
      N(
        'After that she is always wanting something: water, the screen, a better angle to the sun. He brings it all, and gets sadder.',
      ),
      PR('I believed every word she said. That was the trouble.', 'sad'),
      PR(
        'She filled the whole planet with her sweet smell every morning, and I only noticed the complaining.',
      ),
      N(
        'He has made a glass globe to keep off the cold at night. It is as clear as water, and nearly as heavy.',
      ),
      PR('Help me carry it? It’s the only thing on my planet that can break.'),
      N(
        'You take one side and he takes the other. Your Nubbin walks in front, looking for stones to warn you about.',
      ),
    ],
    [
      ask(
        'social-studies',
        'respecting what someone wants by asking them',
        2,
        [
          N(
            'The boy guessed what the rose needed, and never asked her. How can you find out what someone really wants?',
          ),
        ],
        [
          opt(
            'Ask them, and really listen to the answer.',
            [N('Yes. Asking and listening is a way of showing respect.')],
            true,
          ),
          opt('Decide for them. You know best.', [
            N(
              'It can feel kind. But if you don’t ask, you may give them something they never wanted.',
            ),
            N('Respect means listening first.'),
          ]),
          opt('Wait until they complain.', [
            N(
              'Complaints can be clues. But the rose complained all the time and was still never asked.',
            ),
            N('Asking calmly is clearer.'),
          ]),
        ],
        'Thought about asking people what they want, and listening, as a way of showing respect.',
        'D2.Civ.8.K-2',
      ),
    ],
    [
      ch('slow', 'Go slowly round the volcanoes.', [
        N(
          'Slowly round the warm ones, slower round the sleeping one. The globe catches the sun the whole way.',
        ),
      ]),
      ch('asked', 'Ask if she asked for it.', [
        PR(
          'Not exactly. She said she was cold. I thought a globe was the same as listening.',
          'think',
        ),
      ]),
    ],
  ),
  scene(
    'a16-05-globe-done',
    [
      N(
        'He puts the globe over her that night. Through the glass she looks like a flower in a story, and very far away.',
      ),
      RO('It’s warm. Thank you. It’s very quiet in here.', 'soft'),
    ],
    [
      notice(
        'science',
        'properties of glass: transparent, hard, brittle, blocks wind',
        0,
        [
          N(
            'Glass is transparent, which means light passes through it. That is why the boy can see her, and she can see the stars.',
          ),
          N(
            'It keeps the wind off. But it is hard and brittle, which means it smashes if it is dropped.',
          ),
        ],
        'Learned some properties of glass: transparent, hard and brittle.',
        '2-PS1-1',
      ),
    ],
  ),
  scene(
    'a16-05-goodbye',
    [
      N(
        'Then comes the morning he decides to go. He sweeps the volcanoes, all three, and pulls the last baobab shoots.',
      ),
      N('He waters the rose one last time, and his hands are not quite steady.'),
      RO('I was difficult. I know I was. I’m sorry.', 'soft'),
      RO('Go and be happy somewhere. That’s an order, since I’m the one giving them.'),
      N('He reaches for the glass globe, the way he does every evening.'),
      RO('No, not that. I’m a flower, not a cake on a plate. I can stand a little cold.'),
      PR('But at night. Anything could happen.'),
      RO('Then it can happen. I have four thorns. I am not made of glass.'),
      N(
        'He turns to you with the globe in his hands. He looks very young, and very frightened for her.',
      ),
      PR('Should I put it on her anyway? Just to be safe?'),
    ],
    [
      ask(
        'sel',
        'safe is not always the same as well; respecting someone’s choice',
        9,
        [
          N('Safe and well are not always the same thing.'),
          N(
            'Before you answer him, think: what might the rose lose under glass, and what might she risk without it?',
          ),
        ],
        [
          opt('Let her choose, even if it’s a risk.', [
            N('That’s a fair answer. Choosing for yourself is part of being well.'),
            N('The rose has said clearly what she wants.'),
          ]),
          opt('Keep her safe, whatever she says.', [
            N('That’s a fair answer. Wanting to keep someone safe is a way of loving them.'),
            N('It’s worth asking what being safe costs her.'),
          ]),
          opt('It’s hard. Both things matter.', [
            N('That’s a fair answer too. It is a hard choice, and the boy is stuck on it as well.'),
          ]),
        ],
        'Thought about the difference between keeping someone safe and respecting their choice.',
        'CASEL: Responsible decision-making',
      ),
    ],
    [
      ch(
        'free',
        'Leave her free.',
        [
          PR('Free. Yes. She’d never forgive me otherwise.', 'soft'),
          N(
            'He sets the globe down beside her, empty. As he turns away, one petal falls, and he puts it in his pocket without a word.',
          ),
        ],
        { 'a16-globe': 'free' },
      ),
      ch(
        'glass',
        'Put the globe on her.',
        [
          N(
            'He lifts it over her. She looks at him through the glass, and he can’t do it, and lifts it away again.',
          ),
          PR('She said no. I’ll take it with me, so it isn’t sitting here looking at her.'),
        ],
        { 'a16-globe': 'glass' },
      ),
    ],
  ),
  scene(
    'a16-05-goodbye-done',
    [
      RO('Go on, then. Don’t hang about. You’ve decided.'),
      N('She looks hard at the sun, so he can’t see her face. Nobody is prouder than a rose.'),
    ],
    [
      notice(
        'literacy',
        'actions can show feelings that words hide',
        1,
        [
          N(
            'The rose says “Go on, then,” but she looks hard at the sun. Her words and her actions don’t match.',
          ),
          N(
            'When that happens in a story, the action often shows the real feeling. Here, she is hiding that she is sad.',
          ),
        ],
        'Learned that what a character does can show a feeling their words hide.',
        'RL.2.3',
      ),
    ],
  ),
  scene(
    'a16-05-complete',
    [
      N(
        'He goes with a flock of wild birds passing over, and the little planet drops away under him.',
      ),
      N(
        'Back on the sand, the boy is quiet for a long time. Then he takes a stick and draws four tiny thorns.',
      ),
      PR(
        'I didn’t know how to look after her. I thought looking after was the same as fussing.',
        'sad',
      ),
      PI('Do you think she’s all right?'),
      PR('She has four thorns.', 'soft'),
    ],
    [
      notice(
        'art',
        'a few simple marks can stand for a whole thing',
        1,
        [
          N('Four little marks in the sand, and we know exactly who he means.'),
          N(
            'Artists don’t have to draw everything. One small part, drawn well, can stand for the whole.',
          ),
          N(
            'He chose her thorns, the thing she was proudest of. That shows how well he knows her.',
          ),
        ],
        'Learned that a simple mark or shape can stand for something bigger, and what the choice shows about a character.',
        'RL.4.3',
      ),
    ],
  ),
];

const Q5 = quest(
  'a16-05',
  'The Rose',
  {
    'a16-05-s1': g(
      'See the new flower on the boy’s planet come out.',
      'Wait by the strange shoot until it opens at sunrise.',
    ),
    'a16-05-s2': g(
      'Help the boy carry a glass globe to the rose, for her nights.',
      'Carry the globe round the planet to her, and don’t drop it.',
    ),
    'a16-05-s3': g(
      'Be there on the morning the boy leaves his rose.',
      'Stay by the rose while he says goodbye.',
    ),
  },
  Q5_SCENES,
  [
    gloss(
      'transparent',
      'Clear, so that light goes through and you can see through it.',
      'a16-05-globe-done',
    ),
  ],
);

// ================================================================== A16-6 The King

const Q6_SCENES: EduScene[] = [
  scene(
    'a16-06-king',
    [
      N(
        'The boy tells his travels in order, one planet a night. The first planet is so small that a king’s robe covers nearly all of it.',
      ),
      N('The robe is purple, trimmed with white fur, and you have to step over it to go anywhere.'),
      KI('Ah! A subject! Two subjects! And a… third, smaller subject. Approach.'),
      PR('How does he know who we are? He’s never seen us.'),
      KI('To a king, everybody is a subject. It saves a great deal of introducing.'),
      N('It has been a long night’s telling. Your Nubbin yawns, enormously.'),
      KI('A yawn! At court! That is not done.', 'angry'),
      N('Your Nubbin yawns again. It can’t help it.'),
      KI(
        'Then I command it. Yawn, small subject. Yawn as much as you like. By royal order.',
        'happy',
      ),
    ],
    [
      ask(
        'social-studies',
        'fair rules treat everyone equally and can be followed',
        8,
        [
          N(
            'The king only gives orders that people will obey anyway. Which of these would be a fair rule for a place everyone shares?',
          ),
        ],
        [
          opt(
            '“Everyone takes turns on the swing.”',
            [N('Yes. A fair rule treats everyone the same, and everyone can follow it.')],
            true,
          ),
          opt('“Only the king may use the swing.”', [
            N('That rule could be obeyed, but it isn’t fair to everybody else.'),
            N('A fair rule treats people equally.'),
          ]),
          opt('“Nobody may ever breathe.”', [
            N('Nobody could obey that. A rule nobody can follow is a silly rule.'),
            N('It’s as silly as ordering the sun to do something it was going to do anyway.'),
          ]),
        ],
        'Thought about what makes a rule fair and possible to follow.',
        'D2.Civ.8.K-2',
      ),
    ],
    [
      ch('bow', 'Bow to the king.', [
        KI('Splendid. I command you to bow. There. Obeyed at once.', 'happy'),
      ]),
      ch('yawn', 'Yawn as well.', [
        KI('Yes, yes. Commanded. All of it. Nobody yawns here without my say-so.'),
      ]),
      ch('sit', 'Ask if you may sit down.', [
        KI('Sit! At once! That was my idea, you understand.'),
        N('There is nowhere to sit that isn’t robe. You sit on the robe.'),
      ]),
    ],
  ),
  scene(
    'a16-06-king-done',
    [
      KI(
        'I rule over everything, you know. But I am reasonable about it. I only give orders that can be obeyed.',
      ),
      KI(
        'If I ordered the sand to stand up and dance, and it didn’t, I should look very silly. So I don’t.',
        'think',
      ),
    ],
    [
      notice(
        'literacy',
        'a word can be used with a joke in it; “reasonable”',
        1,
        [
          N('“Reasonable” means sensible and fair. The king says he is reasonable.'),
          N(
            'But look: he only orders what would happen anyway, so nobody ever disobeys him. The author is poking gentle fun.',
          ),
        ],
        'Learned the word “reasonable” and spotted gentle humour in how a character uses it.',
        'L.3.4',
      ),
    ],
  ),
  scene(
    'a16-06-sunset',
    [
      PR('Please, would you order the sun to set? I’d like a sunset.', 'soft'),
      KI('Certainly. Certainly. You shall have one. At the proper time.'),
      N('He brings out an enormous almanac, licks his thumb, and turns a great many pages.'),
      KI(
        'This evening. At sunset. That is when I shall command it. And you will see how well I am obeyed.',
      ),
      N('The boy sighs. Your Nubbin sits down to wait, which turns out to be the right thing.'),
      KI(
        'Meanwhile I shall make you my Minister of Justice. There’s an old rat somewhere under the robe. Judge him.',
      ),
      PR('I don’t want to judge anybody. And there’s nobody else here.'),
      KI(
        'Then judge yourself. That is the hardest of all. Do that well, and you are wiser than most kings.',
      ),
    ],
    [
      notice(
        'science',
        'almanacs list sunrise and sunset times, which change through the year',
        2,
        [
          N(
            'An almanac is a book of tables for the year. It lists things like sunrise and sunset times.',
          ),
          N(
            'Sunset comes at a different time each day, because the Earth is tilted as it travels round the Sun.',
          ),
        ],
        'Learned that sunset times change through the year because the Earth is tilted.',
        '1-ESS1-2',
      ),
      ask(
        'maths',
        'time intervals: adding minutes to a clock time',
        4,
        [
          KI(
            'Today sunset is at 5:48 in the evening. It gets two minutes later each day. What time will it be in five days?',
          ),
        ],
        [
          opt(
            '5:58 in the evening.',
            [N('Yes. Five days of two minutes is 10 minutes, and 5:48 plus 10 minutes is 5:58.')],
            true,
          ),
          opt('5:50 in the evening.', [
            N('That’s only one day later. Five days is five lots of two: 2, 4, 6, 8, 10 minutes.'),
            N('5:48 plus 10 minutes is 5:58.'),
          ]),
          opt('6:08 in the evening.', [
            N('Careful. Ten minutes is the total, not twenty.'),
            N('5:48 plus 10 minutes is 5:58.'),
          ]),
        ],
        'Added a time interval to a clock time to find a later sunset.',
        '3.MD.A.1',
      ),
    ],
    [
      ch('wait', 'Wait for the sunset with the king.', [
        N(
          'You wait, and the king fidgets with his robe. The sun goes down exactly when it was always going to.',
        ),
      ]),
      ch('minister', 'Ask the king to make you a minister too.', [
        KI('You are Minister of… of Small Subjects. Your first duty is to wait.'),
        N('So you wait, officially. The sun goes down exactly when it was always going to.'),
      ]),
    ],
  ),
  scene(
    'a16-06-sunset-done',
    [
      KI('Sun! I command you to set!', 'happy'),
      N('The sun sets. The king looks so pleased that nobody has the heart to say anything.'),
    ],
    [
      ask(
        'sel',
        'honesty and kindness: when to say a hard truth',
        1,
        [
          N('The sun was going to set anyway. The king is proud and happy.'),
          N('Would you tell him the truth, or let him enjoy it?'),
        ],
        [
          opt('Tell him the truth, gently.', [
            N('That’s a fair answer. Honesty matters, and a gentle truth shows respect.'),
          ]),
          opt('Let him enjoy it, this time.', [
            N('That’s a fair answer. Kindness matters too.'),
            N('It can be hard to tell when a small fib stops being harmless.'),
          ]),
          opt('Ask him a question, so he can work it out.', [
            N('That’s a clever answer. It lets him think for himself without feeling silly.'),
          ]),
        ],
        'Thought about when to be honest and when to be gentle.',
        'CASEL: Responsible decision-making',
      ),
    ],
  ),
  scene(
    'a16-06-complete',
    [
      PR('I think I’ll go now.'),
      KI('Go? But I have only just… Then I make you my ambassador! Go! By order!', 'shock'),
      N(
        'The boy steps off the edge of the planet with your Nubbin under his arm, and the telling lets you down onto the sand.',
      ),
      PR('He was nice, really. He just didn’t have anybody to order about but the sun.', 'think'),
      N('Your Nubbin is still yawning. Somewhere, a very small king is taking the credit.'),
    ],
    [
      notice(
        'health',
        'why we yawn; how much sleep children need',
        4,
        [
          N('Yawns are catching, and they also show a body is tired.'),
          N(
            'Children between 6 and 12 need about nine to twelve hours of sleep every night. Sleep is when growing bodies mend and learn.',
          ),
        ],
        'Learned that children aged 6 to 12 need about 9 to 12 hours of sleep.',
        'CASEL: Self-management',
      ),
    ],
  ),
];

const Q6 = quest(
  'a16-06',
  'The King',
  {
    'a16-06-s1': g(
      'Visit the first planet on the boy’s travels, and the king who rules it.',
      'Follow the boy onto the planet covered in robe.',
    ),
    'a16-06-s2': g(
      'Ask the king for a sunset, and wait for it.',
      'Stay with the king until his almanac says it’s time.',
    ),
  },
  Q6_SCENES,
  [
    gloss('reasonable', 'Sensible and fair.', 'a16-06-king-done'),
    gloss('almanac', 'A yearly book of tables, such as sunrise and sunset times.', 'a16-06-sunset'),
  ],
);

// ================================================================== A16-7 The Vain Man and the Drinker

const Q7_SCENES: EduScene[] = [
  scene(
    'a16-07-vain',
    [
      N(
        'The second planet belongs to a man in a very tall hat. He sees you coming from a long way off, and stands up straight.',
      ),
      VA('Visitors! Admirers! I knew you’d come eventually.', 'happy'),
      PR('That’s a funny hat.'),
      VA(
        'It is for raising. When people clap me, I raise it. Unfortunately, hardly anybody comes this way.',
      ),
      N(
        'The boy claps a few times, to be kind, and off comes the hat. It goes on for five minutes and gets very dull.',
      ),
      N('Now the man looks at you hopefully. He has arranged his feet for bowing.'),
    ],
    [
      ask(
        'maths',
        'changing minutes to seconds and dividing',
        4,
        [
          N(
            'Say the boy claps once every two seconds, and the hat comes off each time. How many times does it come off in five minutes?',
          ),
        ],
        [
          opt(
            '150 times.',
            [N('Yes. Five minutes is 5 × 60 = 300 seconds, and 300 ÷ 2 = 150.')],
            true,
          ),
          opt('10 times.', [
            N('That’s 5 × 2. First change five minutes into seconds: 5 × 60 = 300.'),
            N('Then split 300 into twos: 150.'),
          ]),
          opt('300 times.', [
            N('There are 300 seconds, but the hat only comes off once every two of them.'),
            N('So 300 ÷ 2 = 150.'),
          ]),
        ],
        'Changed minutes to seconds, then divided to find how many claps and hat-lifts.',
        '4.MD.A.1',
      ),
    ],
    [
      ch('clap', 'Clap.', [
        N('You clap, and off comes the hat with a sweep. You clap again, and off it comes again.'),
        VA('More! More!', 'happy'),
      ]),
      ch('nubbin', 'Let your Nubbin clap.', [
        N(
          'Your Nubbin claps its paws together, very seriously. The man bows to it so low his hat falls off.',
        ),
      ]),
      ch('why', 'Ask him why he wants clapping.', [
        VA('Because I deserve it. Ask anyone on this planet.'),
        PR('There’s only you.'),
        VA('Exactly. And I think so.', 'happy'),
      ]),
    ],
  ),
  scene(
    'a16-07-vain-done',
    [
      PR('Do people really need clapping that much?', 'think'),
      N(
        'Your Nubbin looks at the man, then at the hat, then at you. It has never been so baffled in its life.',
      ),
    ],
    [
      ask(
        'sel',
        'where lasting pride comes from',
        1,
        [
          N('Praise feels nice, but the man needs it all the time.'),
          N('What helps a person feel good about themselves for longer?'),
        ],
        [
          opt('Doing something they care about, and being proud of it themselves.', [
            N(
              'That’s a fair answer. Praise is lovely, but pride in your own work lasts after the clapping stops.',
            ),
          ]),
          opt('Having friends who like them as they are.', [
            N('That’s a fair answer. Being liked for who you are doesn’t need a hat to lift.'),
          ]),
          opt('Getting more and more clapping.', [
            N('That’s a fair answer. Clapping feels lovely.'),
            N('But it fades the moment it stops, which is why the man always needs more.'),
          ]),
        ],
        'Thought about the difference between enjoying praise and needing it.',
        'CASEL: Self-awareness',
      ),
    ],
  ),
  scene(
    'a16-07-drinker',
    [
      N(
        'The next planet is very small and very quiet. A man sits there, still and alone, with his hands hanging between his knees.',
      ),
      N('He doesn’t look up when you come. He looks as if he hasn’t looked up for a long time.'),
      PR('Are you all right?'),
      DR(
        'No. And I know why. There’s something I do over and over, and it makes me feel worse.',
        'sad',
      ),
      DR(
        'I do it so I won’t have to think about it. Then I feel ashamed of doing it. So I do it again.',
      ),
      N('He says it as if it were a sum he has done many times, and always gets the same answer.'),
      PR('Isn’t there a way out of it?'),
      DR('I expect there is. I can’t see it from here.', 'sad'),
    ],
    [
      ask(
        'health',
        'feeling stuck in a habit, shame, and asking for help',
        7,
        [
          N(
            'The man feels stuck in a habit that makes him sadder. What could help someone who feels stuck like that?',
          ),
        ],
        [
          opt(
            'Telling someone who cares, and asking for help.',
            [
              N('Yes. Feeling stuck is nothing to be ashamed of.'),
              N(
                'Telling a person you trust is the first step out, and people who know how can help.',
              ),
            ],
            true,
          ),
          opt('Hiding it, so nobody finds out.', [
            N('Shame makes people want to hide. But hiding keeps the feeling stuck.'),
            N('Telling someone safe is the first step.'),
          ]),
          opt('Telling him it’s his own fault.', [
            N('That wouldn’t help. He already feels ashamed, and that is part of what traps him.'),
            N('Kindness, and help from people who know how, works better.'),
          ]),
        ],
        'Talked about feeling stuck, feeling ashamed, and why asking for help matters.',
        'CASEL: Social awareness',
      ),
    ],
    [
      ch('sit', 'Sit with him a moment.', [
        N(
          'You sit on the edge of his little planet. He doesn’t say anything, but he doesn’t ask you to go.',
        ),
      ]),
      ch('leave', 'Leave him quietly.', [
        N('You step away softly, the way you’d leave a room where someone is sleeping badly.'),
      ]),
    ],
  ),
  scene(
    'a16-07-drinker-done',
    [
      N('The boy goes away very sad. He doesn’t say anything for a long time.'),
      N('Neither does your Nubbin. It holds on to the end of his scarf the whole way.'),
    ],
    [
      ask(
        'literacy',
        'how characters respond to events',
        1,
        [N('Your Nubbin holds the scarf and says nothing. What does that show?')],
        [
          opt(
            'It is sad too, and wants to stay close.',
            [N('Yes. Holding on and staying quiet shows it feels what the boy feels.')],
            true,
          ),
          opt('It is bored.', [
            N('Look at what it does: it holds on tight and stays quiet.'),
            N('That sounds like worry or sadness, not boredom.'),
          ]),
          opt('It is hungry.', [
            N('Nothing here is about food.'),
            N(
              'The clue is that it holds on and stays quiet, which shows it feels the boy’s sadness.',
            ),
          ]),
        ],
        'Used a character’s actions as clues to how it feels.',
        'RL.2.3',
      ),
    ],
  ),
  scene(
    'a16-07-complete',
    [
      N(
        'Back by the plane, the boy throws pebbles at nothing. Your Nubbin brings them back, one by one.',
      ),
      PR(
        'The man in the hat only wanted clapping. The other one only wanted to stop. Neither of them got it.',
        'think',
      ),
      PI('Grown-ups.'),
      PR('Grown-ups.', 'sad'),
      N(
        'Your Nubbin looks from one to the other. It doesn’t understand them either, and says so by sitting on the pilot’s foot.',
      ),
    ],
    [
      ask(
        'maths',
        'subtraction within 20',
        0,
        [
          N(
            'The boy throws nine pebbles, and your Nubbin fetches four back. How many are still out in the sand?',
          ),
        ],
        [
          opt('Five.', [N('Yes. 9 − 4 = 5.')], true),
          opt('Thirteen.', [
            N(
              'That adds them together. We want the ones still out there, so take four away from nine: five.',
            ),
          ]),
          opt('Four.', [N('Four is how many came back. Nine take away four leaves five.')]),
        ],
        'Solved a subtraction word problem within 20.',
        '1.OA.A.1',
      ),
    ],
  ),
];

const Q7 = quest(
  'a16-07',
  'The Vain Man and the Drinker',
  {
    'a16-07-s1': g(
      'Visit the planet of the man who wants to be admired.',
      'Follow the boy to the next planet and meet the man in the hat.',
    ),
    'a16-07-s2': g('Visit the sad man’s planet, quietly.', 'Go gently. Stay by the boy.'),
  },
  Q7_SCENES,
  [
    gloss('admirers', 'People who look at someone with pleasure and praise them.', 'a16-07-vain'),
    gloss(
      'habit',
      'Something you do again and again, often without choosing to.',
      'a16-07-drinker',
    ),
  ],
);

// ================================================================== A16-8 The Businessman

const Q8_SCENES: EduScene[] = [
  scene(
    'a16-08-desk',
    [
      N(
        'The fourth planet is all desk. Behind the desk is a man adding up, so busy that he doesn’t hear you arrive.',
      ),
      BU('Four hundred and six, four hundred and seven… Don’t interrupt. I’ll lose my place.'),
      PR('What are you counting?'),
      BU(
        'The little shiny things that idle people stare at and daydream about. I am not idle. I count them.',
      ),
      N('He means the stars. You can tell, because he will not look up at a single one of them.'),
      BU('Several hundred million, and rising. They are all mine.'),
      PR('How can anybody own a star?'),
      BU('Nobody else had thought of owning them. So I did. That’s how owning works.'),
    ],
    [
      notice(
        'literacy',
        'a French word: étoile means star',
        4,
        [
          N(
            'The book this page comes from was first written in French. In French, a star is une étoile, said “ay-TWAL”.',
          ),
          N(
            '“Les étoiles” means “the stars”. The businessman has never once looked at les étoiles.',
          ),
        ],
        'Learned the French word étoile (star).',
        'L.2.4',
      ),
      ask(
        'social-studies',
        'what owning means, and why we need fair rules about it',
        7,
        [
          N(
            'Can a person own a star, just by being the first to say so? What do you think “owning” means?',
          ),
        ],
        [
          opt('No. Owning needs a fair rule that everyone agrees on.', [
            N(
              'That’s a fair answer. Owning usually depends on shared rules, like buying something or being given it.',
            ),
            N('Nobody has agreed a rule for stars.'),
          ]),
          opt('Yes, if he really looks after them.', [
            N('That’s a fair answer, and the boy will say something close to it.'),
            N('Perhaps owning something means taking care of it.'),
          ]),
          opt('It depends who you ask.', [
            N('That’s a fair answer. People do disagree about what can be owned.'),
            N('That is exactly why we need fair rules.'),
          ]),
        ],
        'Thought about what owning means and why fair rules matter.',
        'D2.Civ.8.K-2',
      ),
    ],
    [
      ch('what', 'Ask what he does with them.', [
        BU('I count them, and count them again. Then I put them in the bank.'),
      ]),
      ch('up', 'Ask him to look up, just once.', [
        BU('Look up? I haven’t time to look up. I have them to count.', 'angry'),
        N('He still doesn’t.'),
      ]),
    ],
  ),
  scene(
    'a16-08-desk-done',
    [
      N(
        'He writes the total on a slip of paper, puts it in a drawer, and locks the drawer with a little key.',
      ),
      BU('There. In the bank. Perfectly safe.', 'happy'),
    ],
    [
      ask(
        'maths',
        'multiplying equal bundles and adding the rest',
        1,
        [
          N('He counts in bundles of five to go faster.'),
          N('He has seven bundles and three stars on their own. How many stars is that?'),
        ],
        [
          opt('38.', [N('Yes. Seven fives are 35, and 35 + 3 = 38.')], true),
          opt('10.', [
            N('That adds 7 and 3. But each bundle holds five stars, so first 7 × 5 = 35.'),
          ]),
          opt('73.', [
            N('That puts the digits side by side. Seven bundles of five make 35, and 35 + 3 = 38.'),
          ]),
        ],
        'Used 7 × 5 plus 3 to count a total in bundles.',
        '3.OA.A.1',
      ),
    ],
  ),
  scene(
    'a16-08-useful',
    [
      PR('I own a flower. I water her every day.'),
      PR('I own three volcanoes. I sweep them out, even the sleeping one.'),
      PR(
        'My volcanoes are better for it. My flower is better for it. Are the stars any better for being in your drawer?',
        'think',
      ),
      N(
        'The businessman opens his mouth, then shuts it again. Nobody has ever asked him that before.',
      ),
      N(
        'Your Nubbin climbs onto the desk and looks at him, then up at the sky, then at him again, to give him the idea.',
      ),
      BU('I… must get on. Where was I?', 'think'),
      N('He doesn’t know. For the first time in years, he has lost count.'),
    ],
    [
      ask(
        'literacy',
        'finding the theme of a scene',
        3,
        [
          N(
            'The boy says that what you own should be better for belonging to you. What is the big idea the author is showing?',
          ),
        ],
        [
          opt(
            'What you own matters most when you take care of it.',
            [N('Yes. That’s the theme: caring for something is what makes it truly yours.')],
            true,
          ),
          opt('Counting is boring.', [
            N('The businessman does count a lot, but the story is about more than counting.'),
            N('Look at what the boy does for his flower and volcanoes.'),
          ]),
          opt('Stars belong in a bank.', [
            N(
              'The businessman thinks so, but the boy’s question shows that locking stars in a drawer helps nobody.',
            ),
          ]),
        ],
        'Worked out the theme of a scene: that caring is what makes something yours.',
        'RL.4.2',
      ),
    ],
  ),
  scene(
    'a16-08-complete',
    [
      N(
        'As you leave, you look back. He is bent over his paper, adding it all up again from the start.',
      ),
      N('Above him every one of his stars is shining, and he hasn’t seen a single one.'),
      PR(
        'All those stars, and he’s never once looked up. I think that’s the saddest planet so far.',
        'sad',
      ),
      PI('Sadder than the sad man’s?'),
      PR('No. The other one knows he’s sad.', 'soft'),
    ],
    [
      notice(
        'science',
        'the Sun is a star; stars look tiny because they are far away; we can’t see them by day',
        1,
        [
          N(
            'The Sun is a star, too. The other stars look like tiny dots only because they are very, very far away.',
          ),
          N(
            'In the daytime the Sun is so bright that we can’t see the other stars. They are still there.',
          ),
        ],
        'Learned that the Sun is a star and that stars look tiny because they are far away.',
        '5-ESS1-2',
      ),
      ask(
        'sel',
        'noticing what matters when you are busy',
        2,
        [
          N('The businessman is so busy counting that he never looks up.'),
          N('What could help a busy person notice what really matters to them?'),
        ],
        [
          opt(
            'Stopping now and then to look around and ask, “What do I care about?”',
            [N('Yes. A short pause can show us what we are missing.')],
            true,
          ),
          opt('Counting faster, so the work is finished sooner.', [
            N('That might finish the counting. But there will always be more to count.'),
            N('Stopping is what lets you notice.'),
          ]),
          opt('Asking a friend to remind them.', [
            N('That’s a good idea. Friends often see what we miss.'),
            N('It also helps to pause and look for yourself.'),
          ]),
        ],
        'Thought about pausing to notice what matters when you are busy.',
        'CASEL: Self-awareness',
      ),
    ],
  ),
];

const Q8 = quest(
  'a16-08',
  'The Businessman',
  {
    'a16-08-s1': g(
      'Visit the businessman who says he owns the stars.',
      'Follow the boy to the planet with the desk.',
    ),
    'a16-08-s2': g(
      'Hear what the boy says to the businessman.',
      'Stay by the desk while the boy thinks it through.',
    ),
  },
  Q8_SCENES,
);

// ================================================================== A16-9 The Lamplighter

const Q9_SCENES: EduScene[] = [
  scene(
    'a16-09-lamp',
    [
      N(
        'The fifth planet is the smallest of all. There is just room for one street lamp and one lamplighter.',
      ),
      N(
        'As you land it is dusk, and he lights the lamp. Then it is dawn, and he puts it out, and then it is dusk again.',
      ),
      LA('Good evening. Good morning. Good evening.', 'sad'),
      PR('Why do you keep lighting it and putting it out?'),
      LA(
        'Those are my orders. Light it at dusk, out at dawn. It was a good job once. I had the whole night to sleep.',
      ),
      LA(
        'But the planet turns faster every year, and the orders never changed. Now a whole day goes by in a minute.',
      ),
      N('He mops his forehead with a large handkerchief. Dusk: he lights the lamp.'),
      LA('I haven’t sat down in a month. Good morning.'),
    ],
    [
      notice(
        'science',
        'a day is one spin of a planet; size doesn’t decide how long a day is',
        5,
        [
          LA(
            'A day is how long a planet takes to spin round once. The Earth takes 24 hours. My planet takes one minute.',
          ),
          LA(
            'Size doesn’t decide it. Giant Jupiter spins once in about ten hours, and little Mercury takes about 59 Earth days.',
          ),
        ],
        'Learned that a day is one spin of a planet, and that a planet’s size doesn’t decide the length of its day.',
        '5-ESS1-2',
      ),
    ],
    [
      ch('help', 'Offer to help with the lamp.', [
        LA('Would you? Just the once. Dusk is coming. It’s always coming.', 'happy'),
      ]),
      ch('stop', 'Ask why he doesn’t just stop.', [
        LA('Then the lamp would be out when it ought to be lit. Somebody might be looking for it.'),
        PR('Who?'),
        LA('I don’t know. That’s why I keep it lit.'),
      ]),
    ],
  ),
  scene(
    'a16-09-lamp-done',
    [
      PR(
        'Your planet’s so tiny, you could just stroll after the sun. You’d never get to dusk at all.',
      ),
      LA('I don’t want it to be day for ever. I want a night off.', 'sad'),
    ],
    [
      ask(
        'social-studies',
        'rules should change when things change',
        1,
        [
          N(
            'The lamplighter’s orders never changed, even though his planet did. What should happen to a rule when things change?',
          ),
        ],
        [
          opt('Someone should look at it again, and change it if it no longer makes sense.', [
            N('That’s a fair answer. A good rule serves the people who follow it.'),
            N('When it stops working, it needs another look.'),
          ]),
          opt('Keep it exactly as it is. Rules are rules.', [
            N('That’s a fair answer. Keeping to a rule feels safe, and rules do matter.'),
            N('But the lamplighter hasn’t slept in a month. What would you say to him?'),
          ]),
          opt('Ask whoever made the rule to change it.', [
            N('That’s a fair answer. Asking is a calm way to fix a rule that has stopped working.'),
          ]),
        ],
        'Thought about why rules sometimes need to change.',
        'D2.Civ.8.K-2',
      ),
    ],
  ),
  scene(
    'a16-09-light',
    [
      N('He hands you a long taper with a small flame at the end. It smells of beeswax.'),
      LA('Dusk is in… now. No. Now. Ready?'),
      N(
        'The sky slides from gold to violet in the time it takes to breathe. The lamp waits, cold, at the top of its post.',
      ),
      LA('Up, and in, and… there.'),
      N(
        'You lift the taper, with your Nubbin on your shoulder leaning too. The wick catches, and light spreads over the whole planet.',
      ),
      LA('Oh, that’s lovely. I haven’t seen it from the outside in years.', 'happy'),
      N(
        'For one whole minute he stands back with his hands in his pockets, and just looks at his lamp.',
      ),
    ],
    [
      doIt(
        'maths',
        'telling the time in hours and half hours; one dusk a minute',
        5,
        'edu:count:lamp-lightings:30',
        [
          LA(
            'One dusk every minute, remember. Count the lightings with me, one for each minute that passes.',
          ),
          N(
            'Thirty dusks make half an hour, and sixty make a whole hour. In one of our days he lights it 1,440 times.',
          ),
        ],
        'Counted one lamp-lighting per minute to find how many in half an hour and an hour.',
        '1.MD.B.3',
      ),
    ],
  ),
  scene(
    'a16-09-light-done',
    [
      N('Then it is dawn, and he must put it out. He does, very gently.'),
      PR(
        'Of all of them, he’s the one I’d have stayed with. He looks after something that isn’t himself.',
        'soft',
      ),
      PR('Only there isn’t room. It’s him, and the lamp, and that’s the whole planet.', 'sad'),
    ],
    [
      ask(
        'sel',
        'caring for something beyond yourself shows who you are',
        2,
        [
          N(
            'The boy says the lamplighter looks after something that isn’t himself. Why might that make someone a good friend?',
          ),
        ],
        [
          opt(
            'People who care for things outside themselves tend to care about friends too.',
            [N('Yes. How we look after what matters to us shows what kind of person we are.')],
            true,
          ),
          opt('Because he has a lamp.', [
            N(
              'The lamp is only the clue. What matters is that he cares about something beyond himself.',
            ),
          ]),
          opt('Because he works hard.', [
            N('Working hard is good. But the boy points at something else.'),
            N('The lamplighter looks after something, not only himself.'),
          ]),
        ],
        'Thought about why caring for something beyond yourself is a sign of a good friend.',
        'CASEL: Social awareness',
      ),
    ],
  ),
  scene(
    'a16-09-complete',
    [
      LA('Here. Take this. It’s a spare, from before the orders got silly.'),
      N(
        'He gives you a small lamp on a short post, green, with brass at the top. It is the right size for a hill.',
      ),
      LA('It lights itself at dusk and goes out at dawn. It doesn’t need anybody.', 'soft'),
      LA('Good evening. Good morning. Goodbye.'),
      N('He waves his handkerchief until the telling folds him away.'),
    ],
    [
      notice(
        'science',
        'how a lamp can switch itself on at dusk: light sensor and stored solar energy',
        2,
        [
          N(
            'How can a lamp light itself? Some have a light sensor, a part that notices when daylight fades and switches the lamp on.',
          ),
          N(
            'Many garden lights also store the Sun’s energy in a battery by day, and turn it into light by night.',
          ),
        ],
        'Learned that a lamp can use a light sensor and stored solar energy to light itself.',
        '4-PS3-4',
      ),
    ],
  ),
];

const Q9 = quest(
  'a16-09',
  'The Lamplighter',
  {
    'a16-09-s1': g(
      'Visit the smallest planet, where a lamplighter never rests.',
      'Follow the boy to the planet with one street lamp.',
    ),
    'a16-09-s2': g(
      'Help the lamplighter light his lamp, once.',
      'When the sky goes violet, lift the taper to the lamp.',
    ),
  },
  Q9_SCENES,
  [gloss('taper', 'A thin candle, used for lighting lamps.', 'a16-09-light')],
);

// ================================================================== A16-10 The Geographer

const Q10_SCENES: EduScene[] = [
  scene(
    'a16-10-books',
    [
      N(
        'The sixth planet is a good deal bigger. An old gentleman lives on it among books piled higher than his head.',
      ),
      GE('An explorer! At last! Sit down, sit down. Tell me everything.'),
      PR('What are all these books?'),
      GE(
        'I am a geographer. I write down where the seas are, and the rivers, the towns, the mountains and the deserts.',
      ),
      PR('Are there seas on your planet?'),
      GE(
        'Haven’t the least idea. Going and looking is for explorers. I sit here, and they come and tell me.',
      ),
      GE(
        'Then I check what they say. If they claim a mountain, I make them bring me a big stone from it.',
      ),
    ],
    [
      notice(
        'social-studies',
        'maps and the four compass directions',
        3,
        [
          GE(
            'A map shows where things are. A compass rose on it shows four main directions: north, south, east and west.',
          ),
          GE(
            'The Sun rises in the east and sets in the west. Stand with the sunrise on your right, and you are facing north.',
          ),
        ],
        'Learned the four compass directions and how the Sun’s position helps find them.',
        '2-ESS2-2',
      ),
      notice(
        'literacy',
        'the word “evidence”: something real that shows whether a claim is true',
        6,
        [
          N(
            'A stone from the mountain is evidence: something real you can look at and test, not just a story.',
          ),
          N('Scientists check what people claim by asking for evidence too.'),
        ],
        'Learned the word “evidence”: something real you can check, as scientists do.',
        'L.2.4',
      ),
    ],
    [
      ch('grove', 'Describe the Grove for his book.', [
        N(
          'You tell him about a pond, and a hill, and a gate that sticks. He writes down the pond and the hill.',
        ),
        GE('A gate? A gate is not geography. Gates change.'),
      ]),
      ch('seen', 'Ask him if he’s ever seen a mountain.', [
        GE('Seen one? Good heavens, no. I have written down four hundred.', 'happy'),
      ]),
    ],
  ),
  scene(
    'a16-10-books-done',
    [
      GE('Now, young man. Your planet. Describe it.'),
      N('He opens a fresh page and licks his pencil. The boy stands up a little straighter.'),
    ],
    [
      ask(
        'maths',
        'scale: one centimetre on the map stands for one metre',
        1,
        [
          GE(
            'Draw it small. One centimetre on my map stands for one metre of planet. Yours is about 20 metres round. How long is the line on my map?',
          ),
        ],
        [
          opt(
            '20 centimetres.',
            [N('Yes. Each metre becomes one centimetre, so 20 metres is 20 centimetres.')],
            true,
          ),
          opt('20 metres.', [
            N('The real planet is 20 metres round. The map shrinks it.'),
            N('One metre becomes one centimetre, so the line is 20 centimetres.'),
          ]),
          opt('2 centimetres.', [
            N('That would be if ten metres made one centimetre.'),
            N('Here every single metre is one centimetre, so the answer is 20.'),
          ]),
        ],
        'Used a simple scale (1 cm for 1 m) to work out a length on a map.',
        '4.MD.A.1',
      ),
    ],
  ),
  scene(
    'a16-10-flower',
    [
      PR('There are three volcanoes. Two awake and one asleep.'),
      GE('Asleep or awake, a volcano is a volcano. I’ll put down three.'),
      PR('And I have a flower.'),
      GE('We don’t write down flowers.'),
      PR('Why not? She’s the prettiest thing on it!'),
      GE('Because flowers don’t last. Geography is for things that stay, like mountains and seas.'),
      GE(
        'A flower is here, and then it isn’t. Not tomorrow, perhaps. But one day. That is what flowers are like.',
      ),
      N(
        'The boy goes very still. For the first time since he left, he thinks of his rose with worry instead of hurt.',
      ),
      PR('Four thorns. That’s all she’s got. And I just went.', 'sad'),
    ],
    [
      notice(
        'science',
        'mountains change too, slowly, through erosion',
        5,
        [
          N(
            'Is the geographer right that mountains stay? Not quite, because mountains change too, only very slowly.',
          ),
          N(
            'Wind, rain and ice wear mountains away, bit by bit, over thousands and millions of years. That is called erosion.',
          ),
        ],
        'Learned that mountains change slowly through erosion by wind, rain and ice.',
        '4-ESS2-1',
      ),
    ],
  ),
  scene(
    'a16-10-flower-done',
    [
      PR('Where should I go next? Where’s worth seeing?'),
      GE('Try the Earth. Big. Well thought of. Plenty to write down, I hear.'),
    ],
    [
      ask(
        'sel',
        'what to do with a worry about someone far away',
        1,
        [
          N(
            'The boy felt hurt before, and now he feels worried. What could he do with a worry about someone far away?',
          ),
        ],
        [
          opt('Tell someone, and think about what he can do next.', [
            N(
              'That’s a fair answer. Sharing a worry makes it lighter, and a next step gives it somewhere to go.',
            ),
          ]),
          opt('Keep busy, and try not to think about it.', [
            N('That’s a fair answer. Being busy can help for a while.'),
            N('But a worry often comes along with us, so it may help to talk about it too.'),
          ]),
          opt('Go back at once.', [
            N('That’s a fair answer. Going back would show how much he cares.'),
            N('It’s very far, though, so he may need to think about how.'),
          ]),
        ],
        'Thought about sharing a worry and choosing a next step.',
        'CASEL: Self-management',
      ),
    ],
  ),
  scene(
    'a16-10-complete',
    [
      N('So he goes to Earth, thinking about his flower the whole way.'),
      N(
        'The telling stops. By the plane, the boy is sitting with his chin on his knees, looking at nothing.',
      ),
      PI('Is that when you came here?'),
      PR('That’s when I came here.', 'soft'),
    ],
    [
      notice(
        'literacy',
        'a turning point is where a character changes direction',
        3,
        [
          N('A turning point is the moment in a story when a character changes direction.'),
          N(
            'Before the geographer, the boy was only travelling. After him, he is worried about his rose, and he heads for Earth.',
          ),
        ],
        'Learned what a turning point is in a story.',
        'RL.3.3',
      ),
    ],
  ),
];

const Q10 = quest(
  'a16-10',
  'The Geographer',
  {
    'a16-10-s1': g(
      'Visit the old geographer and his books.',
      'Follow the boy to the planet ten times bigger than the last.',
    ),
    'a16-10-s2': g(
      'Hear what the geographer says about flowers.',
      'Stay while the boy describes his planet.',
    ),
  },
  Q10_SCENES,
  [
    gloss(
      'geographer',
      'Someone who studies and writes about the land, seas and places of the Earth.',
      'a16-10-books',
    ),
    gloss('evidence', 'Facts or objects that show whether something is true.', 'a16-10-books'),
    gloss(
      'erosion',
      'The slow wearing away of rock and soil by wind, water or ice.',
      'a16-10-flower',
    ),
  ],
);

// ================================================================== A16-11 The Yellow Snake

const Q11_SCENES: EduScene[] = [
  scene(
    'a16-11-earth',
    [
      N(
        'In the telling, the boy lands on Earth, in this same desert, a year ago. Nobody is there, nobody at all.',
      ),
      PR('I thought I’d got the wrong planet. The geographer said it was full of people.'),
      N('It is a very big planet, and the desert is a very big part of it. Not a person in sight.'),
      N(
        'Something moves in the sand by his foot: a ring the colour of moonlight, thin as a finger.',
      ),
      PR('Good evening.'),
      N('The ring lifts its head. It is a snake, small and yellow, and it says good evening back.'),
    ],
    [
      ask(
        'social-studies',
        'the Sahara is in Africa',
        2,
        [N('This desert is the Sahara. Which continent is it in?')],
        [
          opt(
            'Africa.',
            [
              N('Yes. The Sahara covers a huge part of northern Africa.'),
              N('It is the biggest hot desert in the world.'),
            ],
            true,
          ),
          opt('Asia.', [
            N(
              'Asia has big deserts too, such as the Gobi. But the Sahara is in the north of Africa.',
            ),
          ]),
          opt('Australia.', [
            N('Australia has deserts as well. But the Sahara is in the north of Africa.'),
          ]),
        ],
        'Learned that the Sahara is a desert in northern Africa.',
        'D2.Geo.2.K-2',
      ),
    ],
    [
      ch('close', 'Stay close beside the boy.', [
        N(
          'You stand at his shoulder. The snake looks at you, and then away, as if you aren’t the one it came about.',
        ),
      ]),
      ch('nubbin', 'Pick up your Nubbin.', [
        N(
          'You pick up your Nubbin. It doesn’t struggle, but watches the snake over your arm without blinking.',
        ),
      ]),
    ],
  ),
  scene(
    'a16-11-riddles',
    [
      PR('Which planet is this?'),
      SN('The Earth. The desert part. People don’t stay in deserts.'),
      PR('You’re a funny animal. You’re as thin as a finger.'),
      SN('I’m more than I look.'),
      PR('That’s a riddle.'),
      SN('Everything I say is. Riddles keep better.'),
      SN(
        'You’re very far from home, and very new. One day you may miss your planet more than you can carry.',
      ),
      SN('If that day comes, look for me. I’m the shortest way there is.'),
      N('The boy looks at it for a long time. Then he shakes his head.'),
      PR('Not yet. I don’t need you yet.', 'soft'),
      N(
        'The snake doesn’t mind. It settles back into its ring, as if it had all the time in the world.',
      ),
    ],
    [
      ask(
        'literacy',
        'riddles and figurative language; reading what a character’s answer shows',
        10,
        [
          N(
            'A riddle says one thing and means another. The snake calls itself “the shortest way” home, and the boy answers, “Not yet.”',
          ),
          N('What does “not yet” tell us about the boy?'),
        ],
        [
          opt('He still has things he wants to do, and a rose to think about.', [
            N('That’s a fair answer. “Not yet” means he isn’t ready, and the rose is on his mind.'),
          ]),
          opt('He is polite and calm, even when he is unsure.', [
            N('That’s a fair answer. He answers gently, and doesn’t sound afraid.'),
          ]),
          opt('He doesn’t quite understand the riddle.', [
            N('That’s a fair answer. Riddles are hard to read.'),
            N('He may not know what it means, but he knows what his answer is.'),
          ]),
        ],
        'Worked out what a character’s short reply tells us, in a scene with a riddling speaker.',
        'RL.3.3',
      ),
    ],
  ),
  scene(
    'a16-11-complete',
    [
      N(
        'The telling goes quiet. By the plane, the pilot has stopped working, a spanner in one hand.',
      ),
      PI('I don’t like that snake.'),
      PR('It wasn’t unkind. It was just very sure.', 'think'),
      N(
        'Your Nubbin wriggles round in your arms so that it can keep its back to the dunes for the rest of the night.',
      ),
    ],
    [
      ask(
        'sel',
        'what to do when something makes you uneasy',
        2,
        [
          N(
            'The pilot doesn’t like the snake, and your Nubbin turns its back on the dunes. What can help when something makes you feel uneasy?',
          ),
        ],
        [
          opt(
            'Say how you feel to someone you trust, and stay near them.',
            [N('Yes. Naming a feeling makes it smaller, and a friend close by helps.')],
            true,
          ),
          opt('Pretend you feel fine.', [
            N('Pretending can make the feeling louder inside.'),
            N('Saying it out loud, as the pilot does, helps more.'),
          ]),
          opt('Keep staring at whatever it is.', [
            N(
              'Sometimes looking helps us understand. But turning away, like your Nubbin, is allowed too.',
            ),
            N('Being near someone who cares helps most.'),
          ]),
        ],
        'Thought about what helps when something makes you feel uneasy.',
        'CASEL: Self-management',
      ),
      notice(
        'science',
        'dunes move as wind pushes sand grains along',
        3,
        [
          N(
            'Dunes are never quite still. The wind pushes sand grains up the gentle side of a dune, and they tumble down the steep side.',
          ),
          N(
            'Grain by grain, the whole dune creeps along. That is why nobody leaves tracks for long in the Sahara.',
          ),
        ],
        'Learned that wind moves sand grains, so dunes slowly shift.',
        '4-ESS2-1',
      ),
    ],
  ),
];

const Q11 = quest(
  'a16-11',
  'The Yellow Snake',
  {
    'a16-11-s1': g(
      'Follow the boy’s first night on Earth, in the empty desert.',
      'Walk with the boy over the dunes.',
    ),
    'a16-11-s2': g(
      'Hear what the snake says, and remember it.',
      'Stay by the boy while the snake talks.',
    ),
  },
  Q11_SCENES,
);

// ================================================================== A16-12 The Echo and the Garden

const Q12_SCENES: EduScene[] = [
  scene(
    'a16-12-flower',
    [
      N(
        'The boy crosses the desert in the telling. In all that sand he meets one flower: three petals, and nothing much else.',
      ),
      PR('Good morning. Where are the people?'),
      FL('People? A few went by, a long time ago. They were in a great hurry.'),
      FL(
        'They go past. They’re always looking for something, and they never stop long enough to find it.',
      ),
      PR('Which way did they go?'),
      FL('That way. Or that way. The wind moves the sand about. Nobody leaves tracks here.'),
    ],
    [
      ask(
        'sel',
        'noticing someone who is alone, and offering time',
        5,
        [
          N(
            'The flower has hardly ever had anyone stop. What could you do for someone who is on their own?',
          ),
        ],
        [
          opt('Stop, say hello, and spend a little time with them.', [
            N('That’s a fair answer. Time is a big gift, and staying a while shows you care.'),
          ]),
          opt('Ask if they would like some company.', [
            N('That’s a fair answer. Asking lets them choose, and some people do want space.'),
          ]),
          opt('Give them a present.', [
            N('That’s a fair answer. A present is kind.'),
            N('Some people say time is the bigger gift. What do you think?'),
          ]),
        ],
        'Thought about noticing someone alone and offering time and company.',
        'CASEL: Social awareness',
      ),
    ],
    [
      ch('shade', 'Give her a little shade.', [
        N(
          'You stand so your shadow falls across her. Her three petals open a little wider, in surprise.',
        ),
        FL('Oh. Thank you. Nobody’s ever stopped before.', 'soft'),
      ]),
      ch('thank', 'Thank her, and go on.', [
        FL('Goodbye. I’ll remember you. There isn’t much else to remember.', 'soft'),
      ]),
    ],
  ),
  scene(
    'a16-12-echo',
    [
      N(
        'Then a high mountain, the first he has ever climbed. On his planet the volcanoes only came up to his knee.',
      ),
      PR('From up there I’ll see the whole planet, and all the people at once.', 'happy'),
      N('From the top you see peaks, sharp as needles, all the way round. No people at all.'),
      PR('Hello?'),
      EC('Hello… hello… hello…'),
      PR('Who’s there?'),
      EC('…there? …there? …there?'),
      PR('I’d like a friend. Is anybody there?', 'sad'),
      EC('…anybody… there… there…'),
      N(
        'Your Nubbin sits down very firmly on the peak, and looks at the echo as if it has been rude.',
      ),
      PR('This planet doesn’t talk back. It only copies.', 'sad'),
    ],
    [
      notice(
        'science',
        'an echo is sound bouncing back; sound speed makes the delay',
        8,
        [
          N(
            'An echo is sound that bounces back. Sound travels in waves, and hard, flat surfaces such as cliffs send them back.',
          ),
          N(
            'Sound travels about 340 metres every second. If a cliff is 340 metres away, the echo comes back after 2 seconds.',
          ),
        ],
        'Learned that an echo is a sound wave bouncing back, and that sound takes time to travel.',
        '4-PS3-2',
      ),
    ],
  ),
  scene(
    'a16-12-roses',
    [
      N(
        'After a long time walking there is a road, and the road leads to a garden, and the garden is full of roses.',
      ),
      N('Five thousand of them, nodding in rows. Every single one looks exactly like his.'),
      RS('Good morning. We are roses.'),
      PR('Roses.', 'shock'),
      N('He stares at them. She told him she was the only one of her kind anywhere.'),
      PR('If she saw this, she’d be furious. And then she’d be ever so ill, all of a sudden.'),
      PR('I thought she was the only one. I thought that made me somebody.', 'sad'),
      PR('She’s just a rose. And my volcanoes only come up to my knee.'),
      N('He lies down in the grass, puts his face in his arms, and cries.'),
    ],
    [
      ask(
        'sel',
        'what helps when someone is very sad',
        8,
        [
          N(
            'The boy is crying, and you can’t fix this for him. What is the most helpful thing you can do?',
          ),
        ],
        [
          opt(
            'Sit beside him and wait.',
            [N('Yes. Staying close, and not rushing him, tells him he isn’t alone.')],
            true,
          ),
          opt('Tell him not to cry.', [
            N('That comes from kindness. But crying is how big feelings come out.'),
            N('He needs to feel them, not hide them.'),
          ]),
          opt('Explain why he shouldn’t be upset.', [
            N('The reasons may all be true. But explaining can make a sad person feel unheard.'),
            N('Sitting close and saying nothing often helps first.'),
          ]),
        ],
        'Thought about how to support a friend who is very sad.',
        'CASEL: Social awareness',
      ),
    ],
    [
      ch('sit', 'Sit down beside him, and wait.', [
        N(
          'You sit down in the grass beside him and don’t say anything. Your Nubbin lies against his side, warm, and waits too.',
        ),
      ]),
      ch('tell', 'Tell him she’s still special.', [
        PR('You don’t know that. You’ve never met her.', 'sad'),
        N(
          'He’s right. So you sit down beside him instead, and wait, and that turns out to be the thing.',
        ),
      ]),
    ],
  ),
  scene(
    'a16-12-roses-done',
    [
      N(
        'The roses nod on their stalks, and the sun moves. After a long time he stops crying, rolls over, and looks at the sky.',
      ),
      PR('Thank you for not saying anything.', 'soft'),
    ],
    [
      ask(
        'maths',
        'division with multiples of 100',
        1,
        [N('There are 5,000 roses growing in rows of 100. How many rows is that?')],
        [
          opt(
            '50 rows.',
            [
              N('Yes: 50 × 100 = 5,000, so there are 50 rows.'),
              N('Fifty rows of roses, and not one of them is his.'),
            ],
            true,
          ),
          opt('500 rows.', [
            N('500 rows of 100 would be 50,000 roses. That’s ten times too many.'),
            N('50 × 100 = 5,000, so it’s 50 rows.'),
          ]),
          opt('5 rows.', [
            N('Five rows of 100 would only be 500 roses.'),
            N('We need ten times as many: 50 rows.'),
          ]),
        ],
        'Divided 5,000 by 100 to find the number of rows.',
        '3.OA.A.3',
      ),
    ],
  ),
  scene(
    'a16-12-complete',
    [
      N(
        'Someone is watching from under an apple tree at the edge of the garden. Someone with a tail.',
      ),
      N('The telling holds its breath. So does your Nubbin.'),
      FX('Good morning.'),
      PR('Good morning. I can’t see you properly. Who are you?'),
      FX('A fox. And you’re in a bad way. I can tell from here.'),
    ],
    [
      notice(
        'literacy',
        'a French word: renard means fox',
        4,
        [
          N(
            'The book this page comes from was first written in French. In French, a fox is un renard, said “ruh-NAR”.',
          ),
          N(
            'So this is the renard of the story, the one who teaches the boy the biggest lesson of all.',
          ),
        ],
        'Learned the French word renard (fox).',
        'L.2.4',
      ),
    ],
  ),
];

const Q12 = quest(
  'a16-12',
  'The Echo and the Garden',
  {
    'a16-12-s1': g(
      'Cross the desert with the boy, and meet the one flower in it.',
      'Walk with the boy until you find the flower.',
    ),
    'a16-12-s2': g(
      'Climb the high mountain with the boy, and see what’s at the top.',
      'Follow him up to the peak.',
    ),
    'a16-12-s3': g(
      'Sit down next to the boy in the garden of roses, and wait.',
      'When he lies down in the grass, sit beside him. Don’t say anything.',
    ),
  },
  Q12_SCENES,
  [gloss('echo', 'A sound that bounces off a hard surface and comes back to you.', 'a16-12-echo')],
);

// ================================================================== A16-13 The Fox

/** The fox's first scene, with optional Sable lines straight after the opening line. */
const foxScene = (of: string, extra: Line[] = []): EduScene => {
  const k = extra.length;
  return scene(
    of,
    [
      N(
        'The fox sits in the grass under the apple tree, tail wrapped round its feet, and comes no nearer.',
      ),
      ...extra,
      PR('Come and play with me. Please. I’ve had a very bad day.', 'sad'),
      FX('Play? I can’t. Nobody has tamed me.'),
      PR('Tamed?'),
      FX('It’s an old word. It means making ties with someone, slowly, one step at a time.'),
      FX('Right now you’re one more boy, and I’m one more fox. There are plenty of both.'),
      FX(
        'Tame me, and I’ll know your step from every other step. You’ll need me, and I’ll need you.',
      ),
      PR('I don’t know how to tame anybody. I don’t think I know how to be tamed, either.', 'sad'),
    ],
    [
      notice(
        'science',
        'the fennec: a desert fox with big ears for hearing and cooling',
        0,
        [
          N(
            'The real Sahara has a fox a lot like this one: the fennec, the smallest fox in the world.',
          ),
          N(
            'Its huge ears hear insects moving under the sand. They also give off heat, which helps it stay cool.',
          ),
          N('Fennecs dig burrows and hunt mostly at night, when the desert is cooler.'),
        ],
        'Learned about the fennec fox and how its ears help it survive in the desert.',
        '4-LS1-1',
      ),
      notice(
        'literacy',
        'words with more than one meaning: “tame”',
        4 + k,
        [
          N('“Tame” has more than one meaning. It can mean not wild, like a tame rabbit.'),
          N(
            'Here the fox means making friends slowly, one step at a time. The words around a word show which meaning it has.',
          ),
        ],
        'Learned that a word can have more than one meaning and that nearby words show which.',
        'L.3.4',
      ),
    ],
    [
      ch('how', 'Ask the fox how it’s done.', [
        FX('Patience. That’s nearly all of it. I’ll show you.'),
      ]),
      ch('hand', 'Hold out your hand to the fox.', [
        N('The fox leans back all at once, ears flat.'),
        FX('Too fast. That’s the first thing. Never quick.'),
      ]),
      ch('sniff', 'Let your Nubbin sniff the air.', [
        N(
          'Your Nubbin sniffs, and the fox sniffs back. Neither moves an inch, and it seems to be going rather well.',
        ),
      ]),
    ],
  );
};

/** The same-hour scene. `tail` is what happens once the boy sits down, different when Sable is with you. */
const hourScene = (of: string, tail: Line[]): EduScene =>
  scene(
    of,
    [
      FX('You must be very patient. First you sit down a little way off, like that, in the grass.'),
      FX('Don’t look straight at me, and don’t talk. Talking gets in the way.'),
      FX(
        'And come at the same hour each day: when the apple tree’s shadow touches that white stone.',
      ),
      PR('Why the same hour?'),
      FX(
        'So I know when you’re coming. Then I can start being happy a whole hour before you get here.',
      ),
      FX('The closer it gets, the happier I am. Looking forward is half of it.'),
      N(
        'Days on this page are short: a few minutes from sunrise to stars. You watch the shadow crawl towards the white stone.',
      ),
      ...tail,
    ],
    [
      doIt(
        'maths',
        'time intervals: one hour before a clock time',
        5,
        'edu:read:clock:three',
        [
          FX(
            'If the boy comes at four o’clock, at what time do I start being happy? Set the clock hands for me.',
          ),
          N(
            'One hour before four o’clock is three o’clock. The fox starts feeling happy at three, long before the boy arrives.',
          ),
        ],
        'Found one hour before four o’clock to work out when the fox starts looking forward.',
        '1.MD.B.3',
      ),
    ],
  );

/** The scene after the taming, with a closing line that depends on Sable. */
const hourDoneScene = (of: string, closing: Line): EduScene =>
  scene(
    of,
    [
      N(
        'The fox lets the boy put a hand on its head. Soon they are sitting together, looking at the same sunset.',
      ),
      closing,
    ],
    [
      ask(
        'sel',
        'how to befriend a shy animal gently',
        0,
        [N('How do you make friends with a shy animal? Think about what the boy did.')],
        [
          opt(
            'Sit quietly, stay calm, and go a little nearer each day, letting it choose.',
            [N('Yes. Slow and calm helps a shy animal feel safe, and lets the animal choose.')],
            true,
          ),
          opt('Pick it up at once, so it gets used to you.', [
            N('Quick moves frighten a shy animal.'),
            N('The boy sat still, a little way off, and let the fox come to him.'),
          ]),
          opt('Stare straight at it until it comes.', [
            N('Staring can scare an animal.'),
            N('The boy looked away and said nothing, so the fox felt safe.'),
          ]),
        ],
        'Thought about gentle, patient ways to make friends with a shy animal.',
        'CASEL: Relationship skills',
      ),
    ],
  );

/** The fox's secret, told in new words (never the three lifted lines), plus the Sable-free base scene. */
const secretScene = (): EduScene =>
  scene(
    'a16-13-secret',
    [
      N('Then the hour comes for the boy to go. The fox knows before he says it.'),
      FX('There. Now I’m going to cry. I knew I would.', 'sad'),
      PR('Then taming you was no good to you at all.', 'sad'),
      FX('It was. Wheat never meant anything to me. Now it’s the colour of your hair.'),
      FX('Every time the wind moves through the wheat, I’ll have you.'),
      FX(
        'Go and look at the roses once more. Then come back, and I’ll give you a secret as a present.',
      ),
      N(
        'So you go back to the garden with him. He stands in front of the five thousand roses, and isn’t afraid of them any more.',
      ),
      PR(
        'You’re lovely. But nobody has sat with you. Nobody has waited for you. She’s mine, because she’s the one I looked after.',
      ),
      N(
        'He comes back to the apple tree. The fox is waiting at the white stone, though it isn’t quite the hour.',
      ),
      FX('Here is the secret. It’s very simple.'),
      FX(
        'Looking only shows you the surface. To see what someone is really like, you have to get to know them.',
      ),
      PR('So I have to know her. Not just look at her.', 'think'),
      FX('The hours you spent on your rose are what make her matter so much to you.'),
      PR('All those mornings. The water, and the screen.', 'soft'),
      FX('And once someone has come to trust you, you’re the one who looks after them. Always.'),
      PR('My rose. I have to look after my rose.', 'soft'),
    ],
    [
      ask(
        'literacy',
        'theme: knowing someone is how we see what matters',
        10,
        [
          N(
            'The fox says looking only shows you the surface. You find out what someone is really like by getting to know them.',
          ),
          N('What do you think that means?'),
        ],
        [
          opt('You learn what someone is like by spending time with them.', [
            N('That’s a fair answer. Time shows you things a first look can’t.'),
          ]),
          opt('You can’t tell what someone feels just by how they look.', [
            N('That’s a fair answer. Faces can hide a lot, and friends learn to notice.'),
          ]),
          opt('Things we care for become special because we care.', [
            N('That’s a fair answer too, and it is close to what the fox says next.'),
          ]),
        ],
        'Thought about what the fox means by saying that knowing someone shows more than looking.',
        'RL.4.2',
      ),
    ],
  );

/** After the secret. The glass version also has the fox turn to you. */
const secretDoneScene = (of: string, glass: boolean): EduScene =>
  scene(
    of,
    glass
      ? [
          N('Then the fox turns its head, and looks at you as well.'),
          FX(
            'You’re the one who wanted her under glass. Keeping someone safe isn’t the same as keeping them close.',
          ),
          FX('Think about that, both of you.'),
          N(
            'Then it goes back into the wheat. You can see where it goes by the way the gold moves.',
          ),
          PR('I’ll remember. I have to remember.', 'soft'),
        ]
      : [
          N(
            'The fox goes back into the wheat. You can see where it goes by the way the gold moves.',
          ),
          PR('I’ll remember. I have to remember.', 'soft'),
        ],
    [
      notice(
        'art',
        'a colour can hold a memory of a person',
        glass ? 3 : 0,
        [
          N(
            'Ripe wheat is gold, and the wind makes it ripple like water. The fox says it will remind it of the boy.',
          ),
          N(
            'Artists know that a colour can hold a memory. Gold, for the fox, now means “my friend”.',
          ),
        ],
        'Learned that artists use colour to stand for feelings and memories.',
        'RL.1.4',
      ),
    ],
  );

const Q13_SCENES: EduScene[] = [
  foxScene('a16-13-fox'),
  hourScene('a16-13-hour', [
    N(
      'The shadow touches the stone. The boy sits down a long way off and says nothing, and the fox looks at him sideways.',
    ),
    N('Sunset, stars, sunrise. The shadow crawls, and the boy sits down again, a little nearer.'),
    N(
      'And again, a little nearer. On the fourth day, the fox is waiting at the stone before the shadow gets there.',
      'happy',
    ),
  ]),
  hourDoneScene(
    'a16-13-hour-done',
    N('You think of the hill where something small and grey once watched.', 'soft'),
  ),
  secretScene(),
  secretDoneScene('a16-13-secret-done', false),
  scene(
    'a16-13-complete',
    [
      N(
        'By the plane the telling ends. The boy is quiet and very calm, the way you are after crying.',
      ),
      PI('A fox told you all that?'),
      PR('A fox let me tame it. That’s how it told me.', 'happy'),
      N(
        'Your Nubbin is sitting a little nearer the boy than it was this morning. Nobody saw it move.',
      ),
    ],
    [
      notice(
        'health',
        'crying helps the body let big feelings out',
        0,
        [
          N(
            'Crying is one way the body lets big feelings out. Afterwards many people feel calmer, and a little tired.',
          ),
          N('It is a normal and healthy thing to do, for children and for grown-ups.'),
        ],
        'Learned that crying is a normal way for the body to let big feelings out.',
        'CASEL: Self-management',
      ),
    ],
  ),
];

const Q13 = quest(
  'a16-13',
  'The Fox',
  {
    'a16-13-s1': g(
      'Meet the fox under the apple tree, and hear what taming is.',
      'Walk with the boy to the apple tree. Don’t go too close.',
    ),
    'a16-13-s2': g(
      'Help the boy tame the fox: sit at the same hour, a little closer each time.',
      'When the tree’s shadow touches the white stone, sit. Say nothing. Each time, a little nearer.',
    ),
    'a16-13-s3': g(
      'Say goodbye to the fox, and hear its secret.',
      'Go and see the roses once more, then come back to the apple tree.',
    ),
  },
  Q13_SCENES,
  [
    gloss(
      'tame',
      'Here: to make friends with a wild or shy animal, slowly and gently.',
      'a16-13-fox',
    ),
  ],
);

// ================================================================== A16-14 The Switchman and the Merchant

const Q14_SCENES: EduScene[] = [
  scene(
    'a16-14-trains',
    [
      N(
        'More of the telling, the night after. A railway in the dark, and a switchman in his box, sorting trains.',
      ),
      SW('Evening. Mind the rails. They’re coming through in bundles tonight.'),
      N(
        'A lit-up express roars past one way, rattling the box. A minute later, another roars past the other way.',
      ),
      PR('They’re in a great hurry. What are they looking for?'),
      SW(
        'Couldn’t tell you. I don’t think they could either. Everybody wants to be where they aren’t.',
      ),
      N(
        'A third train thunders by. In every window grown-ups sleep or yawn, but here and there a child has its nose to the glass.',
      ),
      PR('The children are looking out. They’re the only ones looking.', 'soft'),
      SW('Hm. I never noticed that. I don’t look in the windows much.'),
    ],
    [
      ask(
        'sel',
        'stopping to ask yourself what you really want',
        4,
        [
          N(
            'Lots of people rush without knowing what they’re looking for. What could help you work out what you really want?',
          ),
        ],
        [
          opt('Stop for a moment, and ask yourself.', [
            N('That’s a fair answer. A quiet moment can show you what matters.'),
          ]),
          opt('Look out of the window, like the children.', [
            N('That’s a fair answer. Looking, wondering and noticing are what the children do.'),
          ]),
          opt('Ask a friend what they think.', [
            N('That’s a fair answer. A friend can help you see what you want.'),
            N('In the end, only you can say what is right for you.'),
          ]),
        ],
        'Thought about pausing to work out what you really want.',
        'CASEL: Self-awareness',
      ),
    ],
    [
      ch('wave', 'Wave at the children.', [
        N(
          'You wave. A small hand waves back from a window, and then the train is gone into the dark.',
        ),
      ]),
      ch('where', 'Ask where they’re all going.', [
        SW('Somewhere else. Then back again. Same as yesterday.'),
      ]),
    ],
  ),
  scene(
    'a16-14-pills',
    [
      N('Then a merchant with a tray round his neck, selling little pills.'),
      ME(
        'One a week, and you’ll never be thirsty. It saves fifty-three minutes. Experts worked it out.',
      ),
      PR('What do you do with the fifty-three minutes?'),
      ME('Use them! Anything at all! Experts say it’s very efficient.', 'happy'),
      N('The boy thinks about it seriously, the way he thinks about everything.'),
      PR(
        'Fifty-three spare minutes? I’d use them to walk to a spring. Slowly, all the way there.',
        'soft',
      ),
      N('The merchant looks at his tray, and at the boy, and doesn’t seem to know what to say.'),
    ],
    [
      ask(
        'maths',
        'adding minutes and converting to hours and minutes',
        1,
        [
          N(
            'The pills save fifty-three minutes a week. After two weeks, how much time is that, in minutes and then in hours and minutes?',
          ),
        ],
        [
          opt(
            '106 minutes, which is 1 hour 46 minutes.',
            [
              N('Yes: 53 + 53 = 106 minutes.'),
              N('Sixty of them make an hour, and 46 are left over.'),
            ],
            true,
          ),
          opt('53 minutes.', [
            N('That’s only one week. Two weeks of 53 minutes means adding: 53 + 53 = 106.'),
            N('106 minutes is 1 hour and 46 minutes.'),
          ]),
          opt('100 minutes.', [
            N('Close. But 53 + 53 = 106, not 100.'),
            N('106 minutes is 1 hour and 46 minutes.'),
          ]),
        ],
        'Added two lots of 53 minutes and changed the total into hours and minutes.',
        '3.MD.A.1',
      ),
    ],
    [
      ch('ask', 'Ask what he does with his own minutes.', [
        ME('Mine? I… I haven’t saved enough yet to spend any.', 'think'),
      ]),
      ch('walk', 'Say you’d walk too.', [
        PR('You see? Two of us. You should sell walks instead.', 'happy'),
      ]),
    ],
  ),
  scene(
    'a16-14-complete',
    [
      N(
        'The telling stops: the boy has finished his travels. He looks at the pilot, who is staring at his water tin.',
      ),
      PI('That’s a lovely story. I mean it. But I’ve just drunk the last of the water.', 'sad'),
      PI(
        'It’s the eighth day. I ought to be walking to a spring myself, if I knew where there was one.',
      ),
      PR('My friend the fox said…'),
      PI('Not now. I’m sorry. We’re out of water, and that’s serious.', 'sad'),
      PR('I’m thirsty too. Let’s look for a well.'),
    ],
    [
      notice(
        'health',
        'people need water every day; they can last weeks without food but only days without water',
        4,
        [
          N('A person can live for weeks without food, but only a few days without water.'),
          N(
            'More than half of your body is water, and it needs topping up every day. That is why finding a well matters so much.',
          ),
        ],
        'Learned that the body needs water every day, and can manage only a few days without it.',
        'CASEL: Self-management',
      ),
    ],
  ),
];

const Q14 = quest(
  'a16-14',
  'The Switchman and the Merchant',
  {
    'a16-14-s1': g(
      'Watch the trains go by at the switchman’s box.',
      'Stand by the switchman while the trains rush past.',
    ),
    'a16-14-s2': g(
      'Meet the merchant and his thirst pills.',
      'Follow the boy to the man with the tray.',
    ),
  },
  Q14_SCENES,
  [
    gloss(
      'switchman',
      'A railway worker who moves the switches that send trains onto the right track.',
      'a16-14-trains',
    ),
    gloss('merchant', 'Someone whose job is to sell things.', 'a16-14-pills'),
  ],
);

// ================================================================== A16-15 The Well

/** The scene after the water is drawn. Bonded: Sable drinks first, and the sharing sum has five. */
const wellDoneScene = (of: string, bonded: boolean): EduScene =>
  scene(
    of,
    bonded
      ? [
          N(
            'The bucket sits on the wall, full to the brim. The water in it is gold with the sunrise.',
          ),
          N(
            'Sable puts her front paws on the stone and drinks first, before anyone. Nobody says a word; everyone waits for her.',
          ),
          PI(
            'It holds fifteen litres. There are five of us now, counting Sable, so it’s shared equally.',
          ),
        ]
      : [
          N(
            'The bucket sits on the wall, full to the brim. The water in it is gold with the sunrise.',
          ),
          PI(
            'It holds twelve litres. There are four of us: the boy, you, your Nubbin and me. We’ll share it equally.',
          ),
        ],
    [
      doIt(
        'maths',
        'sharing equally: dividing within 100',
        bonded ? 2 : 1,
        'edu:share:water:3',
        bonded
          ? [
              PI('Pour it into five equal cups. How much does each cup get?'),
              N('Fifteen litres shared by five is three litres each, because 5 × 3 = 15.'),
            ]
          : [
              PI('Pour it into four equal cups. How much does each cup get?'),
              N('Twelve litres shared by four is three litres each, because 4 × 3 = 12.'),
            ],
        'Shared a total equally by dividing, and checked it with multiplication.',
        '3.OA.A.3',
      ),
    ],
  );

const Q15_SCENES: EduScene[] = [
  scene(
    'a16-15-night',
    [
      N(
        'A well, in all this desert, is a silly idea. You set off anyway, all of you together, as the sun goes down.',
      ),
      N('The stars come out. The sand is cold under your feet, and silver, and goes on for ever.'),
      PI('Here. Your little one’s shivering.'),
      N(
        'He unwinds the long scarf from his own neck and winds it round and round your Nubbin, until only its eyes show.',
      ),
      PR('There’s water somewhere. You can tell. The sand goes quiet over it.', 'think'),
      N('After a long time the boy stumbles, and sits, and falls asleep where he sits.'),
      N(
        'The pilot picks him up very carefully, as if he might break, and carries him on through the night.',
      ),
      PI('He weighs nothing. I keep thinking I’ll drop him, and he weighs nothing at all.', 'soft'),
    ],
    [
      ask(
        'social-studies',
        'finding north with the Pole Star',
        1,
        [
          PI(
            'Keep the Pole Star in front of us. It stays above the north all night, while the other stars wheel round it.',
          ),
          PI('If it’s straight ahead, which way are we walking?'),
        ],
        [
          opt(
            'North.',
            [
              N(
                'Yes. The Pole Star shows where north is, so walking towards it means walking north.',
              ),
            ],
            true,
          ),
          opt('South.', [
            N('South would be behind us.'),
            N('The Pole Star marks north, so if it is straight ahead, we are walking north.'),
          ]),
          opt('West.', [
            N('West would be on our left.'),
            N('The Pole Star marks north, so if it is straight ahead, we are walking north.'),
          ]),
        ],
        'Learned that the Pole Star shows north and used it to work out a walking direction.',
        'D2.Geo.2.K-2',
      ),
      notice(
        'science',
        'wool traps air, which keeps body heat in',
        3,
        [
          N(
            'A knitted wool scarf keeps you warm because it traps tiny pockets of air, and trapped air lets heat escape slowly.',
          ),
          N('That’s why a long scarf makes a good coat for a cold desert night.'),
        ],
        'Learned that wool keeps us warm by trapping air.',
        '2-PS1-1',
      ),
    ],
    [
      ch('box', 'Carry the sheep box.', [
        N(
          'You carry the box with holes. Your Nubbin rides on it in its scarf, keeping an eye on the sheep.',
        ),
      ]),
      ch('tin', 'Carry the empty water tin.', [
        N(
          'It is very light, and it rattles. You carry it anyway, so you’ll have something to fill.',
        ),
      ]),
      ch('wind', 'Walk on the windy side of the pilot.', [
        N(
          'You walk on the wind’s side. The pilot doesn’t say anything, but he walks a little closer.',
        ),
      ]),
    ],
  ),
  scene(
    'a16-15-night-done',
    [
      N('Dawn comes up grey, then gold. The boy wakes in the pilot’s arms, and points.'),
      N(
        'The cold slides out of the sand. The first sunlight is pale, then yellow, then warm on your face.',
      ),
    ],
    [
      notice(
        'literacy',
        'colour words and the feelings they carry',
        1,
        [
          N(
            'The sky goes grey, then gold. Writers use colour words to show a feeling as well as a colour.',
          ),
          N(
            'Grey feels quiet and tired, while gold feels warm and hopeful. Can you find other colour words in this story?',
          ),
        ],
        'Learned that colour words can show feelings as well as colours.',
        'RL.1.4',
      ),
    ],
  ),
  scene(
    'a16-15-well',
    [
      N(
        'A well. Not a hole in the sand, like desert wells, but a real one: a stone ring, a rope, a pulley and a bucket.',
      ),
      PI('This doesn’t belong here. It’s a village well. Where’s the village?', 'shock'),
      PR('Shh. Listen.'),
      N(
        'He takes hold of the rope and pulls. The pulley turns and creaks, like an old gate that hasn’t been asked to open for years.',
      ),
      PR('It’s complaining. Nobody’s woken it up for ages.', 'happy'),
      PI('Let me. It’s too heavy for you.'),
      N(
        'The pilot hauls the bucket up, hand over hand. You steady it on the stone, with the sun shaking in the water.',
      ),
    ],
    [
      notice(
        'science',
        'a pulley changes the direction of a pull, so you can use your weight',
        5,
        [
          PI(
            'A pulley is a wheel with a rope over it. Pull down on one end, and the bucket goes up.',
          ),
          PI(
            'It doesn’t make the bucket lighter. It changes the direction of the pull, so I can lean my weight on the rope.',
          ),
        ],
        'Learned that a pulley changes the direction of a pull to make lifting easier.',
        '3-PS2-1',
      ),
      notice(
        'literacy',
        'a French word: puits means well',
        6,
        [
          N('In French, a well is un puits, said “pwee”.'),
          N('Wells like this one reach down to water hidden far below the sand.'),
        ],
        'Learned the French word puits (well).',
        'L.2.4',
      ),
    ],
  ),
  wellDoneScene('a16-15-well-done', false),
  scene(
    'a16-15-water',
    [
      PR('Can I have some? That’s the water I wanted. That one.'),
      N(
        'The pilot lifts the bucket to the boy’s lips. He drinks with his eyes shut, as if it were his birthday.',
      ),
      PR('It isn’t just the water. It’s the walk.', 'soft'),
      PI('Your turn.'),
      N('The bucket is heavy and cold on the outside, and the sun is in it.'),
      N('Your Nubbin stands on tiptoe on the stone, looking in.'),
    ],
    [
      ask(
        'sel',
        'fairness when sharing something everyone needs',
        5,
        [
          N(
            'There is water for everyone, and everyone is thirsty. Who should drink first, and why?',
          ),
        ],
        [
          opt('The one who needs it most.', [
            N('That’s a fair answer. Needing something is a good reason to go first.'),
          ]),
          opt('Everyone takes a turn, in order.', [
            N('That’s a fair answer too. Taking turns treats everybody the same.'),
          ]),
          opt('The one who carried the bucket.', [
            N('That’s a fair answer. Some people would say the others are just as tired, though.'),
          ]),
        ],
        'Thought about different ways to share fairly when everyone has a need.',
        'CASEL: Responsible decision-making',
      ),
    ],
    [
      ch('nubbin', 'Let your Nubbin drink first.', [
        N(
          'You tip the bucket for your Nubbin. It puts its whole face in, scarf and all, and comes up dripping and happy.',
        ),
      ]),
      ch('drink', 'Drink.', [
        N('You drink. Your Nubbin drinks after you, with its nose right in the bucket.'),
      ]),
      ch('hold', 'Hold the bucket for the pilot.', [
        N(
          'You hold it while he drinks, both hands round it. He nods at you over the rim, and doesn’t stop for a long time.',
        ),
      ]),
    ],
  ),
  scene(
    'a16-15-water-done',
    [
      N(
        'It tastes of the walk: the cold sand and the stars, the creak of the pulley, and being carried.',
      ),
      PI('That’s the best thing I’ve ever drunk.', 'happy'),
    ],
    [
      notice(
        'health',
        'why water tastes so good when you are thirsty',
        1,
        [
          N(
            'Water tastes best when you’re very thirsty. Your body keeps track of how much water it has.',
          ),
          N(
            'When it runs low, your brain makes you feel thirsty. Drinking switches that feeling off, and it feels wonderful.',
          ),
        ],
        'Learned that thirst is the body’s signal that it needs water.',
        'CASEL: Self-awareness',
      ),
    ],
  ),
  scene(
    'a16-15-complete',
    [
      N('You all sit with your backs against the warm stone. The boy looks at the pilot sideways.'),
      PR('You’ll mend your engine soon. I can tell. Then you can fly home.'),
      PR('It’s nearly a year since I came down, just near here. That’s a long time to be away.'),
      PR('I’m going home to my rose. It’s a long way.', 'soft'),
      N('The pilot unwinds the scarf from your Nubbin, looks at it, and winds it back on again.'),
      PI('Keep it. It’s walked further than I have tonight.'),
      N(
        'Going home can mean a place, and it can mean someone you look after. For the boy, it means both.',
      ),
    ],
    [
      ask(
        'maths',
        'a year in weeks and days',
        2,
        [
          N(
            'A year is 365 days, and a week is 7 days. How many whole weeks are in a year, and how many days are left over?',
          ),
        ],
        [
          opt(
            '52 weeks and 1 day.',
            [N('Yes. 52 × 7 = 364, and 365 − 364 = 1 day left over.')],
            true,
          ),
          opt('50 weeks.', [
            N('50 weeks is only 350 days, so 15 days are left. That’s two more weeks and a day.'),
            N('So it’s 52 weeks and 1 day.'),
          ]),
          opt('53 weeks.', [
            N('53 × 7 = 371, which is more than 365.'),
            N('52 × 7 = 364, so it’s 52 weeks and 1 day.'),
          ]),
        ],
        'Divided 365 days by 7 to find the number of whole weeks and days left over.',
        '4.MD.A.1',
      ),
    ],
  ),
];

const Q15 = quest(
  'a16-15',
  'The Well',
  {
    'a16-15-s1': g(
      'Walk through the night with the pilot, looking for a well.',
      'Keep up with the pilot across the dunes. Don’t stop.',
    ),
    'a16-15-s2': g(
      'Find the well at daybreak, and draw up the water.',
      'Help the pilot haul the bucket. Steady it on the wall.',
    ),
    'a16-15-s3': g('Share the water.', 'Hold the bucket so that everyone can drink.'),
  },
  Q15_SCENES,
  [gloss('pulley', 'A wheel with a rope over it, used to lift things.', 'a16-15-well')],
);

// ================================================================== exports

export const EDU_A16_READER: EduQuest[] = [
  Q1,
  Q2,
  Q3,
  Q4,
  Q5,
  Q6,
  Q7,
  Q8,
  Q9,
  Q10,
  Q11,
  Q12,
  Q13,
  Q14,
  Q15,
];

/** Reader versions of the ten ATLAS_A16_VARIANTS scenes that play inside A16-1 to A16-15. */
export const EDU_A16_READER_VARIANTS: EduScene[] = [
  desertScene(
    'a16-01-desert-t45',
    N(
      'Sable has come with you. She stands inside your shadow, as if the sun might not notice her there.',
    ),
  ),
  desertScene(
    'a16-01-desert-bonded',
    N(
      'Sable has come with you. She walks at your heel, grey as a pebble against the gold, and doesn’t hide.',
    ),
  ),
  foxScene('a16-13-fox-t45', [
    N(
      'Sable is with you, in your shadow. The fox’s ears turn towards her, and then politely away.',
    ),
  ]),
  foxScene('a16-13-fox-bonded', [
    N('Sable sits at your heel in the long grass. The fox looks at her for a long moment.'),
    FX('That one is tamed already. See how she watches you.'),
  ]),
  hourScene('a16-13-hour-t45', [
    N(
      'The shadow touches the stone, and the boy sits down a long way off. Behind you, out of your shadow, Sable sits down too.',
    ),
    FX('Oh, look. She’s listening. Same hour, for her as well.'),
    N(
      'Sunset, stars, sunrise, and the shadow touches the stone. The boy moves nearer the fox, and Sable moves one step nearer you.',
    ),
    N(
      'And again, one step, her ears up. She doesn’t look straight at you, and you don’t look straight at her.',
    ),
    N(
      'On the fourth day, when the shadow touches the stone, Sable is sitting one step from your hand.',
      'soft',
    ),
  ]),
  hourDoneScene(
    'a16-13-hour-done-t20',
    N(
      'You think of the long grass at home, where something small and grey still runs when you come near. Same hour, a little nearer.',
      'soft',
    ),
  ),
  hourDoneScene(
    'a16-13-hour-done-t45',
    N(
      'Sable comes no closer than that one step. But she doesn’t go back into your shadow, either.',
      'soft',
    ),
  ),
  hourDoneScene(
    'a16-13-hour-done-bonded',
    N(
      'Sable has watched it all from your heel without moving. The fox catches her eye, and its tail twitches, as if they agree.',
      'soft',
    ),
  ),
  secretDoneScene('a16-13-secret-done-glass', true),
  wellDoneScene('a16-15-well-done-bonded', true),
];

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  'edu:count:chair-steps:40',
  'edu:count:lamp-lightings:30',
  'edu:read:clock:three',
  'edu:share:water:3',
];
