/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Atlas page A8, The Twelve
 * Tasks (A8-1 to A8-14). One EduScene per original scene (every step scene, done scene and complete
 * scene), id `sprout:<original id>`, plus the three Banquet variants in EDU_A08_SPROUT_VARIANTS.
 * See EDU-STYLE.md and docs/atlas.md (A8, "Learning Grove version").
 *
 * What it teaches, as the outline lists: Roman Gaul on a map; Latin everyday words (salve, vale,
 * gratias, aqua, amicus, unus, duo, tres); Roman numerals I to XII (one per task, in the
 * complete scenes); the Olympic Games’ Greek origins; and, gently, what a bureaucracy is (a lot of
 * rules that only send you somewhere else). Around those: counting, shapes, sounds, feelings.
 *
 * - Every choice keeps its original id and `set` (a08-form still works), so no `defaultChoice` is
 *   needed: the comedy is slapstick, nobody is hurt, and no choice here is cruel.
 * - Care notes kept: the champions are proud and kind, nothing is said about anyone’s looks or
 *   faith, the Isle is cakes and cushions, the Beast is only scared, Obelix fells no living tree,
 *   the lions turn friendly, and no song is sung.
 * - Every fact is well established (the Olympic Games began in Greece and came every four years;
 *   Rome was a very big city; Gaul was roughly where France is now; aqueducts carry water downhill).
 * - No lines are taken from the film or the books. Everything is original.
 */
import type { EduDomain, EduQuest, EduScene, Lesson } from './types';
import type { Line, Choice } from '../config/story';

type Mood = Line['mood'];
const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const A = say('a08-asterix');
const O = say('a08-obelix');
const G = say('a08-getafix');
const V = say('a08-chief');
const BD = say('a08-bard');
const CS = say('a08-caesar');
const P = say('a08-pupus');
const AS = say('a08-asbestos');
const VE = say('a08-verses');
const CI = say('a08-cilindric');
const H = say('a08-hostess');
const IR = say('a08-iris');
const MK = say('a08-chef');
const PO = say('a08-porter');
const CL = say('a08-clerk');
const PF = say('a08-prefect');
const OM = say('a08-oldman');
const GH = say('a08-ghost');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

/** One answer option. `best` marks the answer the lesson teaches. */
const opt = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

const std = (standard?: string) => (standard ? { standard } : {});

/** A notice: a character shares something true. */
const nt = (
  domain: EduDomain,
  skill: string,
  after: number,
  lines: Line[],
  parentNote: string,
  standard?: string,
): Beat => ({ domain, skill, ...std(standard), kind: 'notice', after, lines, parentNote });

/** An ask: a question with options, one marked best. */
const ak = (
  domain: EduDomain,
  skill: string,
  after: number,
  prompt: Line[],
  options: Opt[],
  parentNote: string,
  standard?: string,
): Beat => ({ domain, skill, ...std(standard), kind: 'ask', after, prompt, options, parentNote });

/** A do: the child does something in the Grove. */
const dd = (
  domain: EduDomain,
  skill: string,
  after: number,
  check: string,
  lines: Line[],
  parentNote: string,
  standard?: string,
): Beat => ({ domain, skill, ...std(standard), kind: 'do', after, check, lines, parentNote });

/** One sprout scene. Lesson ids are `sprout:<of>-l<n>`, numbered in play order. */
const sc = (
  of: string,
  lines: Line[],
  beats: Beat[],
  extra: { choices?: Choice[]; defaultChoice?: string } = {},
): EduScene => ({
  id: `sprout:${of}`,
  of,
  band: 'sprout',
  lines,
  ...extra,
  lessons: [...beats]
    .sort((a, b) => a.after - b.after)
    .map((b, i) => ({ id: `sprout:${of}-l${i + 1}`, ...b })),
});

const quest = (
  of: string,
  title: string,
  goals: EduQuest['goals'],
  scenes: EduScene[],
  notes?: string,
): EduQuest => ({
  id: `sprout:${of}`,
  of,
  band: 'sprout',
  title,
  goals,
  scenes,
  ...(notes ? { notes } : {}),
});

// ================================================================== A8-1 Caesar’s Challenge
const Q1 = quest(
  'a08-01',
  'Caesar’s Challenge',
  {
    'a08-01-s1': {
      goal: 'Touch the little green dot on the map.',
      hint: 'The map is all red. Look by the sea for one green dot.',
    },
    'a08-01-s2': {
      goal: 'Go to the village and hear what the Romans want.',
      hint: 'Follow Obelix and the boars. Everyone is in the square.',
    },
  },
  [
    sc(
      'a08-01-map',
      [
        N('Nova’s book opens at a big map.'),
        N('The map is red. Red, red, red!'),
        N('Red is for the Romans. They have nearly everywhere.'),
        N('But one little dot is green. It sits by the sea.'),
        N('You touch the green dot and whoosh! You are in a wood.'),
        N('A small white dog zooms out of the bushes.'),
        N('He sniffs your Nubbin. Your Nubbin sniffs back.'),
        N('Wag, wag, wag! They are best friends already.', 'happy'),
      ],
      [
        ak(
          'social-studies',
          'a map shows where places are',
          3,
          [N('(Point.) Where is the village? In the red, or the green dot?')],
          [
            opt(
              'In the green dot',
              [N('Yes! The village is the little green dot by the sea.', 'happy')],
              true,
            ),
            opt('In the red', [N('Not quite: red is the Romans. The village is the green dot.')]),
          ],
          'Read a simple map: found the village as the green dot among the red.',
          'D2.Geo.2.K-2',
        ),
      ],
      {
        choices: [
          {
            id: 'sniff',
            label: 'Let them work it out.',
            then: [N('Circle, circle, sneeze! Then they are friends.', 'happy')],
          },
          {
            id: 'crouch',
            label: 'Crouch down and hold out a hand.',
            then: [
              N('The dog gives your hand one lick. Then he runs back to your Nubbin.', 'happy'),
            ],
          },
        ],
      },
    ),
    sc(
      'a08-01-map-done',
      [
        N('Two men come running through the trees.'),
        N('One is small, with a winged helmet. One is very big.'),
        O('Dogmatix! You found a little round friend!', 'happy'),
        N('The dog wags his whole body.'),
      ],
      [
        dd(
          'maths',
          'count to 3',
          1,
          'edu:count:friends:3',
          [
            N('(Count the two men and the dog together. One, two, three!)'),
            N('Three! Two men and one dog.'),
          ],
          'Counted three together: two men and a dog.',
          'K.CC.B.5',
        ),
      ],
    ),
    sc(
      'a08-01-square',
      [
        N('The village is round and noisy. Everyone stands in the square.'),
        P('Salve! That is Latin for hello. I am Caius Pupus.'),
        P('Caesar says: do twelve hard tasks. Then you are gods.'),
        V('Twelve? Ha! We will do them all, and have lunch.', 'happy'),
        A('Who will say if we pass? Not a Roman. Not a Gaul.'),
        N('Everyone looks at you. You are neither!'),
      ],
      [
        dd(
          'literacy',
          'Latin word: salve means hello',
          1,
          'edu:say:latin-word:salve',
          [
            N('(Say it back: SAL-weh! Wave as you say it.)'),
            P('Salve! Lovely. The Romans said it every day.', 'happy'),
          ],
          'Learned and said the Latin word “salve”, which means hello.',
          'ELOF: Language and Communication',
        ),
      ],
      {
        choices: [
          {
            id: 'yes',
            label: '“All right. I’ll referee.”',
            then: [V('Splendid! A referee who is on nobody’s side!', 'happy')],
          },
          {
            id: 'who',
            label: '“Me? I only came in through a map.”',
            then: [A('That is why you are fair. You do not belong to anyone’s side.')],
          },
        ],
      },
    ),
    sc(
      'a08-01-square-done',
      [
        P('Here is your wax tablet. It is for ticking off tasks.'),
        N('Down the side are marks. I, II, III, IV, V…'),
        N('The Romans wrote numbers with letters. I means one.'),
        N('One line for every task. Twelve in all.'),
      ],
      [
        nt(
          'maths',
          'Romans wrote numbers with letters; I is one',
          2,
          [
            P('The Romans wrote one as I. A little twig. Like one finger.'),
            P('Hold up one finger. That is I!', 'happy'),
          ],
          'Heard that Romans wrote numbers as letters, and that I means one.',
        ),
      ],
    ),
    sc(
      'a08-01-complete',
      [
        N('Getafix the druid stirs a big cauldron.'),
        G('This potion is for Asterix. Only a little.'),
        O('Can I have some? Please?', 'sad'),
        G('You fell in it as a baby. You do not need more.'),
        N('Obelix is sad for a moment. Then he thinks of boar.'),
        N('Your Nubbin and the dog curl up asleep by the fire.'),
      ],
      [
        ak(
          'sel',
          'naming feelings and what helps',
          2,
          [N('Obelix is sad. How could we help him feel better?')],
          [
            opt(
              'Give him a hug',
              [N('A hug helps. Obelix feels a little bit better.', 'happy')],
              true,
            ),
            opt('Laugh at him', [N('That would make him feel worse. A hug or a kind word helps.')]),
            opt('Walk away', [N('He would feel lonely. Staying close helps when we are sad.')]),
          ],
          'Named a sad feeling and chose a kind way to help a friend.',
          'CASEL: Social awareness',
        ),
      ],
    ),
  ],
);

// ================================================================== A8-2 Asbestos
const Q2 = quest(
  'a08-02',
  'Asbestos',
  {
    'a08-02-s1': {
      goal: 'Walk along the running road and meet the runner.',
      hint: 'Walk from the start stone to the post. Then say hello.',
    },
    'a08-02-s2': {
      goal: 'Drop your hand to start the race.',
      hint: 'Drop your hand. Then watch the road.',
    },
  },
  [
    sc(
      'a08-02-track',
      [
        N('Task one is a race on a long dirt road.'),
        N('A young man is stretching. His name is Asbestos.'),
        AS('I am from Greece. I run very, very fast.', 'happy'),
        A('How nice.'),
        N('Your Nubbin and the dog crouch down at the stone.'),
        N('Their bottoms wiggle. They think they are racing too.'),
      ],
      [
        nt(
          'social-studies',
          'the Olympic Games began in Greece',
          2,
          [
            AS('The Olympic Games began in Greece, long, long ago.'),
            AS('People came to Olympia to run. We still have the Games today!', 'happy'),
          ],
          'Heard that the Olympic Games began in Greece, long ago, and still happen today.',
          'D2.His.2.K-2',
        ),
      ],
      {
        choices: [
          {
            id: 'let',
            label: 'Let them race too.',
            then: [
              P('Animals are not in the rules.'),
              N('You say they are not out of the rules either. Pupus sighs.'),
            ],
          },
          {
            id: 'hold',
            label: 'Scoop them up out of the way.',
            then: [N('You lift your Nubbin. The dog sits on your foot.')],
          },
        ],
      },
    ),
    sc(
      'a08-02-track-done',
      [
        N('You lift your hand. The runner is still as a statue.'),
        N('Asterix yawns a very big yawn.'),
        N('Everyone waits for you to say the words.'),
      ],
      [
        ak(
          'maths',
          'count down from three',
          2,
          [N('Let us count down to the start. Three, two… What comes next?')],
          [
            opt('One!', [N('Yes! Three, two, one… GO!', 'happy')], true),
            opt('Four', [N('Four comes before three. Counting down goes three, two, one… GO!')]),
          ],
          'Counted down from three to one to start the race.',
          'ELOF: Mathematics Development',
        ),
      ],
    ),
    sc(
      'a08-02-race',
      [
        N('Your hand drops. Whoosh, dust everywhere!'),
        N('The runner is a speck on the road.'),
        N('Asterix walks slowly. He takes one sip of potion.'),
        N('Zoom! Now he sits on the finish post, waving.'),
        N('The runner zooms past. He is too surprised to stop.'),
      ],
      [
        dd(
          'literacy',
          'sound words',
          1,
          'edu:say:sound-word:whoosh',
          [
            N('(Say it with a wave of your arm: Whoosh!)'),
            N('Whoosh! That is the sound of something fast.'),
          ],
          'Said a sound word, “whoosh”, with an arm movement.',
          'ELOF: Literacy',
        ),
      ],
    ),
    sc(
      'a08-02-race-done',
      [
        N('Far away, a speck is still running.'),
        N('Obelix shades his eyes and watches.'),
        O('He is very fast. He just was not first.'),
      ],
      [
        ak(
          'sel',
          'it is all right to lose and be kind',
          2,
          [N('Asbestos did not win. How might he feel?')],
          [
            opt(
              'Surprised, and maybe a bit sad',
              [N('Yes. Feelings can be mixed. A kind word helps him.', 'soft')],
              true,
            ),
            opt('Nothing at all', [
              N('Everybody feels something. Losing can feel sad or surprising.'),
            ]),
          ],
          'Named the feelings of someone who loses a race, and that kindness helps.',
          'CASEL: Social awareness',
        ),
      ],
    ),
    sc(
      'a08-02-complete',
      [
        N('You scratch a mark on the wax tablet.'),
        N('It is the first mark. It looks like this: I.'),
        N('Dogmatix drops a twig on the tablet.'),
        P('I! One twig!', 'happy'),
        P('One task done. Eleven to go.'),
        N('Your Nubbin and the dog look proud, as if they won.'),
      ],
      [
        dd(
          'maths',
          'I is one',
          4,
          'edu:show:fingers:1',
          [
            N('(Hold up one finger. That is I, for one.)'),
            N('Eleven tasks left. We will count them all.'),
          ],
          'Showed one finger for the Roman numeral I.',
          'K.CC.B.4',
        ),
      ],
    ),
  ],
);

// ================================================================== A8-3 Verses
const Q3 = quest(
  'a08-03',
  'Verses',
  {
    'a08-03-s1': {
      goal: 'Carry the three javelins to the line.',
      hint: 'They are long. Carry one at a time.',
    },
    'a08-03-s2': {
      goal: 'Watch the throws and count your steps.',
      hint: 'Stand by the far marker. Count to the end of the field.',
    },
  },
  [
    sc(
      'a08-03-field',
      [
        N('Task two is a wide field with a white line.'),
        VE('I am Verses, from Persia. I will throw today.'),
        N('He has three long javelins wrapped in silk.'),
        VE('This one is Swift. This one is Patient.'),
        VE('And this one is saving herself for later.', 'happy'),
        N('You will carry them to the line. Three long javelins!'),
      ],
      [
        dd(
          'literacy',
          'first sound of a name',
          3,
          'edu:say:first-sound:s-swift',
          [
            N('(Say it slowly: sss-wift. What sound does Swift start with?)'),
            N('Sss! Swift starts with sss, like a snake.'),
          ],
          'Listened for and said the first sound in the name “Swift”.',
          'ELOF: Literacy',
        ),
      ],
      {
        choices: [
          {
            id: 'careful',
            label: 'Carry them very carefully, like Verses would.',
            then: [VE('You carry them like friends. Thank you.', 'happy')],
          },
          {
            id: 'obelix',
            label: 'Ask Obelix to help.',
            then: [N('Obelix carries all three in one hand. He asks where to put the cart.')],
          },
        ],
      },
    ),
    sc(
      'a08-03-field-done',
      [
        N('You lay the javelins down by the line.'),
        N('Your Nubbin sits beside the one called Patient.'),
        N('Swift is long, and Patient is longer. The third one is longest of all.'),
      ],
      [
        ak(
          'maths',
          'compare lengths: long, longer, longest',
          2,
          [N('(Point to the javelins.) Which one is the longest?')],
          [
            opt(
              'The third one',
              [N('Yes! Long, longer, longest. The third one is longest.', 'happy')],
              true,
            ),
            opt('Swift', [
              N('Swift is long, but the third one is longer still. It is the longest.'),
            ]),
          ],
          'Compared three lengths: long, longer, longest.',
          'K.MD.A.2',
        ),
      ],
    ),
    sc(
      'a08-03-throws',
      [
        N('Verses throws Swift. It flies like a bird.'),
        N('It lands far down the field. Quiver, quiver!'),
        N('You walk the field. One step, two steps, three steps…'),
        N('Then Asterix throws. His javelin flies away, over the hill.'),
        VE('Where is it going?', 'shock'),
        A('I just threw it!'),
        VE('What is your javelin called?'),
        A('Er... Stick.'),
        N('Dogmatix drops a twig at your feet. It is his eleventh today.'),
      ],
      [
        ak(
          'sel',
          'being a good sport',
          8,
          [N('Verses threw so well, and Asterix threw further. What can Verses do?')],
          [
            opt(
              'Say “well done”',
              [VE('Well done! Yes. A good sport is kind, win or lose.', 'happy')],
              true,
            ),
            opt('Stamp and shout', [
              N('That would feel bad for everyone. “Well done” feels good.'),
            ]),
          ],
          'Talked about being a good sport: saying well done when someone else does better.',
          'CASEL: Self-management',
        ),
      ],
      {
        choices: [
          {
            id: 'measure',
            label: 'Start walking after it with your tablet.',
            then: [
              P('Come back! We will be here for a week.'),
              N('You come back and call it a win.'),
            ],
          },
          {
            id: 'call',
            label: 'Call it: the javelin is still going.',
            then: [VE('A fair ruling. A throw that is still flying cannot be measured.', 'happy')],
          },
        ],
      },
    ),
    sc(
      'a08-03-complete',
      [
        N('Verses wraps Swift up in its silk again.'),
        VE('A good throw is a good throw. Whoever throws it.', 'happy'),
        N('You make a mark on the tablet: II.'),
        N('Dogmatix drops another twig. He wags at both.'),
        N('Two twigs, I and I. Two tasks done!'),
      ],
      [
        nt(
          'maths',
          'II is two',
          4,
          [
            P('Two tasks, so two twigs: I, I. The Romans wrote II.'),
            P('Hold up two fingers. That is II!', 'happy'),
          ],
          'Learned that the Roman numeral II is two twigs.',
        ),
      ],
    ),
  ],
);

// ================================================================== A8-4 Cilindric
const Q4 = quest(
  'a08-04',
  'Cilindric',
  {
    'a08-04-s1': {
      goal: 'Read the rule book before the bout.',
      hint: 'The book is on the bench. Open it together.',
    },
    'a08-04-s2': { goal: 'Referee the bout.', hint: 'Stand by the rope. Asterix has an idea.' },
  },
  [
    sc(
      'a08-04-rules',
      [
        N('Task three is a ring made of rope.'),
        N('A square man is folding a towel into neat quarters.'),
        CI('I am Cilindric. Please read my rules.'),
        N('The rule book is as thick as a loaf of bread.'),
        CI('Rule one: bow. Rule two: bow again.', 'happy'),
        N('Rules help everyone play fairly. Even long ones.'),
      ],
      [
        ak(
          'social-studies',
          'rules help everyone be fair',
          5,
          [N('Why do games have rules?')],
          [
            opt(
              'So everyone plays fairly',
              [N('Yes! Rules help everyone to be fair and safe.', 'happy')],
              true,
            ),
            opt('So nobody has fun', [N('Not quite. Good rules help us all have fun together.')]),
          ],
          'Talked about why rules in a game help everyone to be fair.',
          'D2.Civ.8.K-2',
        ),
      ],
      {
        choices: [
          {
            id: 'read',
            label: 'Read every rule, properly.',
            then: [CI('A referee who reads! I like you.', 'happy')],
          },
          {
            id: 'skim',
            label: 'Skim it and nod wisely.',
            then: [CI('Hm. You skipped the page about nodding.', 'think')],
          },
        ],
      },
    ),
    sc(
      'a08-04-rules-done',
      [
        N('You close the book. Cilindric bows to it.'),
        N('Then he bows to you, and to Asterix.'),
        N('Then he bows to the meadow.'),
      ],
      [
        dd(
          'literacy',
          'Latin word: vale means goodbye',
          2,
          'edu:say:latin-word:vale',
          [
            N('(Bow and say it: WAH-leh!)'),
            P('Vale! That is Latin for goodbye. Romans said it when they left.', 'happy'),
          ],
          'Learned the Latin word “vale”, which means goodbye.',
          'ELOF: Language and Communication',
        ),
      ],
    ),
    sc(
      'a08-04-bout',
      [
        N('They bow. Cilindric moves like water.'),
        A('Show me that again, slowly, please.'),
        CI('Of course. The hand, here. The foot, here. The turn, so.'),
        N('He turns and tucks, and turns again.'),
        N('Oh! He has tied himself in a knot!', 'shock'),
        CI('I beat myself. The rule book says whoever beats himself loses!', 'shock'),
      ],
      [
        ak(
          'sel',
          'helping a friend who feels silly',
          5,
          [N('Cilindric is tied in a knot and feels silly. What helps?')],
          [
            opt(
              'Help him get free, kindly',
              [N('Yes. Helping, with no laughing, makes him feel better.', 'happy')],
              true,
            ),
            opt('Point and laugh', [N('That would make him feel sadder. Helping is kinder.')]),
          ],
          'Chose kind help over laughing at a friend who feels embarrassed.',
          'CASEL: Relationship skills',
        ),
      ],
      {
        choices: [
          {
            id: 'untie',
            label: 'Help untie him.',
            then: [
              N('It takes you, Obelix and both animals. He thanks everyone by name.', 'happy'),
            ],
          },
          {
            id: 'rule',
            label: 'Look up rule three hundred and twelve to be sure.',
            then: [CI('A referee who checks! Wonderful.', 'happy')],
          },
        ],
      },
    ),
    sc(
      'a08-04-complete',
      [
        CI('A tidy result. Please keep the rule book.', 'happy'),
        N('He folds his towel and walks away.'),
        N('You make a mark: III. Three twigs, I, I, I.'),
        O('He was nice too.'),
      ],
      [
        nt(
          'maths',
          'III is three',
          2,
          [P('Three tasks, so three twigs: III. Hold up three fingers!')],
          'Learned that the Roman numeral III is three twigs.',
        ),
      ],
    ),
  ],
);

// ================================================================== A8-5 The Isle of Pleasure
const Q5 = quest(
  'a08-05',
  'The Isle of Pleasure',
  {
    'a08-05-s1': {
      goal: 'Row across the lake to the island.',
      hint: 'Take an oar. Pull together with Obelix.',
    },
    'a08-05-s2': {
      goal: 'Get everyone back to the boat.',
      hint: 'Find your Nubbin and the dog first.',
    },
  },
  [
    sc(
      'a08-05-boat',
      [
        N('Task four is an island in a blue lake.'),
        N('Soft music floats over the water. It smells of honey cakes.'),
        P('Everyone who goes there wants to stay. That is the hard part.'),
        N('You row with one oar. Obelix rows with the other.'),
        N('Splash, splash! The boat goes sideways, mostly.'),
        N('The dog stands at the front like a little figurehead.'),
      ],
      [
        ak(
          'science',
          'some things float and some sink',
          4,
          [N('The boat floats on the lake. A big stone dropped in the water would…?')],
          [
            opt('Sink', [N('Yes! A stone sinks. A boat is shaped to float.', 'happy')], true),
            opt('Float', [N('Not a stone: stones sink. Boats are shaped so they float.')]),
          ],
          'Talked about floating and sinking: boats float, stones sink.',
          'ELOF: Scientific Reasoning',
        ),
      ],
    ),
    sc(
      'a08-05-boat-done',
      [
        N('Bump! The boat stops on white sand.'),
        N('There are cushions on the beach. Lots of them.'),
        N('You hear a drip and a splash in the water.'),
      ],
      [
        dd(
          'literacy',
          'Latin word: aqua means water',
          2,
          'edu:say:latin-word:aqua',
          [
            N('(Splash your hands and say it: AH-kwa!)'),
            P('Aqua! That is the Latin word for water. We use it in English too.', 'happy'),
          ],
          'Learned the Latin word “aqua”, which means water.',
          'ELOF: Language and Communication',
        ),
      ],
    ),
    sc(
      'a08-05-isle',
      [
        N('Kind women bring plates of cakes and cups of juice.'),
        H('Sit down. Rest. You never have to do anything again.'),
        N('Asterix sits on a cushion. His legs did it by themselves.'),
        A('Only for a moment.', 'soft'),
        N('Your Nubbin and the dog roll in the clover, sleepy.'),
        O('Excuse me. Is there any boar?'),
        O('No boar? Then I am leaving.', 'angry'),
      ],
      [
        ak(
          'sel',
          'resting is good, and so is doing things',
          5,
          [N('Resting is lovely. But what else do we need besides resting?')],
          [
            opt(
              'Playing, helping and doing things',
              [N('Yes! We need rest, and play, and helping. A bit of each.', 'happy')],
              true,
            ),
            opt('Only resting, for ever', [
              N('Resting is good. But staying on a cushion for ever means missing the fun.'),
            ]),
          ],
          'Talked about balance: rest is good, and so are playing, helping and doing things.',
          'CASEL: Self-management',
        ),
      ],
      {
        choices: [
          {
            id: 'fetch',
            label: 'Go and fetch the Nubbin and the dog.',
            then: [N('You lift them out of the clover. They are warm and floppy.')],
          },
          {
            id: 'cake',
            label: 'Have just one cake first.',
            then: [N('It is so yummy that you sit down. Then you get up again, quickly.', 'shock')],
          },
        ],
      },
    ),
    sc(
      'a08-05-isle-done',
      [
        N('Obelix picks up Asterix like a sack of flour.'),
        N('He carries him back to the boat.'),
        O('Sorry. Lovely island. No boar.'),
        N('Far behind, the soft music plays on. It is very quiet.'),
      ],
      [
        dd(
          'music',
          'soft and loud',
          3,
          'edu:hum:soft-loud:lullaby',
          [
            N('(Hum very softly, like the island music. Now hum a bit louder.)'),
            N('Soft and loud. Humming is fun.'),
          ],
          'Hummed softly and then louder, noticing the difference.',
          'ELOF: Perceptual, Motor, and Physical Development',
        ),
      ],
    ),
    sc(
      'a08-05-complete',
      [
        N('Halfway home, Asterix shakes his head.'),
        A('I was going to stay. I really was.', 'shock'),
        O('You were not. There was no boar.'),
        N('You make a mark on the tablet: IV.'),
        N('Dogmatix drops a fourth twig. Pupus writes IV instead.'),
        N('Dogmatix looks betrayed.', 'sad'),
        N('Four tasks done. Only eight to go!'),
      ],
      [
        nt(
          'maths',
          'IV is four',
          6,
          [P('A twig before V takes one away. Five, take away one, is four!', 'happy'),
            P('Hold up four fingers!', 'happy')],
          'Heard that the Roman numeral IV means four: one less than five.',
        ),
      ],
    ),
  ],
);

// ================================================================== A8-6 Iris
const Q6 = quest(
  'a08-06',
  'Iris',
  {
    'a08-06-s1': {
      goal: 'Find the tent with the moon on it.',
      hint: 'Follow the painted eyes on the trees.',
    },
    'a08-06-s2': {
      goal: 'Referee the staring contest.',
      hint: 'Watch the sand timer, not the eyes.',
    },
  },
  [
    sc(
      'a08-06-tent',
      [
        N('A path has painted eyes on all the trees.'),
        N('It leads to a tent with a moon on it.'),
        IR('I am Iris, from Egypt. Look into my eyes.'),
        N('His eyes are big and dark. You look, and oh!'),
        IR('Whoever looks away first, loses.'),
      ],
      [
        dd(
          'literacy',
          'the first letter of a name: I',
          2,
          'edu:trace:letter:i',
          [
            N('(Iris starts with I. Draw an I in the air, top to bottom.)'),
            N('I for Iris! It looks just like the Roman one.', 'happy'),
          ],
          'Traced the letter I, the first letter of Iris’s name.',
          'ELOF: Literacy',
        ),
      ],
      {
        choices: [
          {
            id: 'brave',
            label: 'Try a practice stare yourself.',
            then: [N('You last two seconds. Then you hum like a bee.', 'shock')],
          },
          {
            id: 'away',
            label: 'Look at the floor, sensibly.',
            then: [IR('A wise referee. The floor is safe.')],
          },
        ],
      },
    ),
    sc(
      'a08-06-stare',
      [
        N('Asterix sits down. You turn the sand timer over.'),
        IR('You are a small, soft dormouse.'),
        A('No, I am not. I am Asterix.'),
        N('Iris looks puzzled. Then he sniffs the cushion.'),
        N('He thinks he is a boar! He trots out, grunting.'),
        A('Iris is a person. Iris will be himself by supper.'),
      ],
      [
        ak(
          'sel',
          'knowing who you are',
          2,
          [N('Iris said Asterix was a dormouse. Was he?')],
          [
            opt(
              'No. He knows who he is',
              [N('Right! We know who we are, even when somebody says something silly.', 'happy')],
              true,
            ),
            opt('Yes, a dormouse', [
              N('No, Asterix is a person. He knows who he is, and so do you.'),
            ]),
          ],
          'Talked about knowing who you are, even when someone says something silly.',
          'CASEL: Self-awareness',
        ),
      ],
    ),
    sc(
      'a08-06-stare-done',
      [
        N('The last grain of sand falls. Plink!'),
        N('Inside the tent it is dark. You can hardly see.'),
        N('The dog barks at the door, where it is light.'),
      ],
      [
        nt(
          'science',
          'we see things when there is light',
          2,
          [
            N('(Hold your hands over your eyes. Now peek!)'),
            N('We can see things when there is light. In the dark we cannot.'),
          ],
          'Noticed that we see things when there is light, and not in the dark.',
          '1-PS4-2',
        ),
      ],
    ),
    sc(
      'a08-06-complete',
      [
        N('Outside, Iris snuffles among the acorns.'),
        P('It wears off. I will bring him a cushion.', 'soft'),
        N('You make a mark on the tablet: V.'),
        N('V looks like a hand with the fingers open. V is five!'),
      ],
      [
        dd(
          'maths',
          'V is five',
          3,
          'edu:show:fingers:5',
          [
            N('(Hold up one hand and open your fingers wide. That is V!)'),
            N('Five fingers. Five tasks.'),
          ],
          'Showed five fingers for the Roman numeral V.',
          'K.CC.B.4',
        ),
      ],
    ),
  ],
);

// ================================================================== A8-7 Mannekenpix
const Q7 = quest(
  'a08-07',
  'Mannekenpix',
  {
    'a08-07-s1': {
      goal: 'Carry the dishes from the kitchen.',
      hint: 'Take them from the hatch to the long table.',
    },
    'a08-07-s2': {
      goal: 'Keep the plates coming. Watch Obelix.',
      hint: 'Count the courses as they go.',
    },
  },
  [
    sc(
      'a08-07-kitchen',
      [
        N('Task six is a feast. The table is long.'),
        N('A round chef is stirring four pots.'),
        MK('I am Mannekenpix. Nobody goes hungry here.', 'happy'),
        O('Is this task mine? Oh good.', 'happy'),
        N('You carry soup. It is as big as a bath!'),
      ],
      [
        dd(
          'literacy',
          'Latin word: gratias means thank you',
          4,
          'edu:say:latin-word:gratias',
          [
            N('(Say it to the chef: GRAH-tee-ahs!)'),
            MK('Gratias! That is Latin for thank you. I like it!', 'happy'),
          ],
          'Learned the Latin word “gratias”, which means thank you.',
          'ELOF: Language and Communication',
        ),
      ],
      {
        choices: [
          {
            id: 'taste',
            label: 'Ask what’s in the soup.',
            then: [MK('Everything I had, and a bit of love.', 'happy')],
          },
          {
            id: 'carry',
            label: 'Just carry, and carry quickly.',
            then: [MK('Good! Hot food goes out hot.', 'happy')],
          },
        ],
      },
    ),
    sc(
      'a08-07-kitchen-done',
      [
        N('First comes soup. Then comes fish.'),
        N('Then come three pies. Pie, pie, pie!'),
        N('Last come crisp fried potatoes.'),
      ],
      [
        ak(
          'maths',
          'count to answer how many',
          2,
          [N('(Point to the pies.) How many pies are there?')],
          [
            opt('Three', [N('Yes! One, two, three pies. Three!', 'happy')], true),
            opt('Two', [N('Let us count again: one, two, three. Three pies!')]),
          ],
          'Counted three pies to answer “how many?”.',
          'K.CC.B.5',
        ),
      ],
    ),
    sc(
      'a08-07-feast',
      [
        N('Obelix eats and eats. Every plate comes back clean.'),
        N('At last the hatch is empty.'),
        O('That was a lovely starter. When is the main course?', 'happy'),
        N('The chef laughs until he must sit on a flour sack.'),
        N('Your Nubbin and the dog look at the clean plates. Hungry!'),
      ],
      [
        ak(
          'sel',
          'sharing with friends',
          4,
          [N('Your Nubbin and the dog are hungry too. What kind thing could we do?')],
          [
            opt(
              'Share some food with them',
              [N('Yes! Sharing makes friends feel happy and cared for.', 'happy')],
              true,
            ),
            opt('Eat it all ourselves', [
              N('Then they would feel left out. Sharing is kinder, and it feels warm.'),
            ]),
          ],
          'Talked about how sharing makes friends feel cared for.',
          'CASEL: Relationship skills',
        ),
      ],
      {
        choices: [
          {
            id: 'scraps',
            label: 'Save the scraps for the Nubbin and Dogmatix.',
            then: [N('There are no scraps. Obelix gives them each a crust from his pocket.')],
          },
          {
            id: 'clap',
            label: 'Applaud the chef.',
            then: [N('Clap, clap, clap! The chef takes a floury bow.', 'happy')],
          },
        ],
      },
    ),
    sc(
      'a08-07-complete',
      [
        MK('Take these potatoes for the road.', 'happy'),
        N('Obelix holds the parcel like a baby.'),
        N('You make a mark on the tablet: VI.'),
        N('V is five, and one more twig makes VI. That is six!'),
      ],
      [
        nt(
          'maths',
          'VI is six',
          3,
          [P('VI is five and one more. Hold up five fingers, then one more.', 'happy')],
          'Heard that the Roman numeral VI is five and one more, which is six.',
          'K.OA.A.1',
        ),
      ],
    ),
  ],
);

// ================================================================== A8-8 The Cave of the Beast
const Q8 = quest(
  'a08-08',
  'The Cave of the Beast',
  {
    'a08-08-s1': {
      goal: 'Go into the cave with your lantern.',
      hint: 'Light the lantern at the door. Go slowly.',
    },
    'a08-08-s2': {
      goal: 'Find out what lives in the cave.',
      hint: 'Sit down. Be quiet. Let it come to you.',
    },
  },
  [
    sc(
      'a08-08-mouth',
      [
        N('Task seven is a dark hole in a hill.'),
        P('Something lives in there. Nobody will say what.'),
        N('A long, low rumble comes from deep inside.'),
        N('The dog’s ears go flat. Your Nubbin holds your leg.'),
        N('You light the lantern. A warm glow!'),
      ],
      [
        dd(
          'literacy',
          'sound words: rumble',
          2,
          'edu:say:sound-word:rumble',
          [
            N('(Say it low and slow, like the cave: rrrumble, rrrumble.)'),
            N('Rumble is a low, deep sound word. Can you feel it in your throat?'),
          ],
          'Said the sound word “rumble” in a low voice, matching the sound in the story.',
          'RL.1.4',
        ),
      ],
      {
        choices: [
          {
            id: 'first',
            label: 'Go first, with the lantern.',
            then: [A('Brave referee. We are right behind you.'), O('A little behind.')],
          },
          {
            id: 'together',
            label: 'Ask everyone to go in side by side.',
            then: [
              N('It is a squeeze, and Obelix goes sideways. But side by side is nicer.', 'soft'),
            ],
          },
        ],
      },
    ),
    sc(
      'a08-08-mouth-done',
      [
        N('The passage opens into a huge room.'),
        N('The rumble is very near now.'),
        N('You can feel it in your tummy.'),
      ],
      [
        dd(
          'science',
          'sounds are vibrations you can feel',
          2,
          'edu:hum:feel:chest',
          [
            N('(Put a hand on your chest and hum. Do you feel it buzz?)'),
            N('Sounds shake. A big sound shakes a lot.'),
          ],
          'Hummed and felt the buzz in the chest: sounds are vibrations.',
          '1-PS4-1',
        ),
      ],
    ),
    sc(
      'a08-08-beast',
      [
        N('At the edge of the light, a big shape is curled up.'),
        N('It is not growling. It is trembling, because it is scared.'),
        A('It is scared of us.', 'soft'),
        N('You turn the lantern down low and sit very still.'),
        N('The dog sits, and your Nubbin sits. Then Obelix sits, very gently.'),
        N('A soft nose sniffs your Nubbin. Your Nubbin sniffs back.'),
        N('The rumble stops. The Beast is calm.', 'soft'),
      ],
      [
        ak(
          'sel',
          'how to help someone who is scared',
          3,
          [N('The Beast is scared. What helps a scared friend?')],
          [
            opt(
              'Sit quietly and be gentle',
              [N('Yes! Being calm and gentle helps a scared friend feel safe.', 'happy')],
              true,
            ),
            opt('Shout and wave', [N('That would scare it more. Sitting quietly helps.')]),
          ],
          'Chose to stay calm, quiet and gentle to help someone who is scared.',
          'CASEL: Social awareness',
        ),
      ],
      {
        choices: [
          {
            id: 'lantern',
            label: 'Leave the lantern, turned down low.',
            then: [N('You set it on a rock. The Beast curls up beside it.', 'soft')],
          },
          {
            id: 'quiet',
            label: 'Back out quietly, in the dark.',
            then: [N('You tiptoe out. Behind you, the Beast snores softly.', 'soft')],
          },
        ],
      },
    ),
    sc(
      'a08-08-complete',
      [
        N('Outside, the daylight is very bright.'),
        P('What was it?'),
        A('Nothing you need to worry about.'),
        N('You make a mark on the tablet: VII.'),
        N('V is five, and II is two more. Five and two make seven!'),
      ],
      [
        nt(
          'maths',
          'VII is seven',
          4,
          [P('VII is five and two more. Show five fingers, then two more.', 'happy')],
          'Heard that the Roman numeral VII is five and two more, which is seven.',
          'K.OA.A.1',
        ),
      ],
    ),
  ],
);

// ================================================================== A8-9 The Place That Sends You Mad
const Q9 = quest(
  'a08-09',
  'The Place That Sends You Mad',
  {
    'a08-09-s1': {
      goal: 'Go in and ask for Permit A38.',
      hint: 'Start with the porter at the front door. Be polite.',
    },
    'a08-09-s2': {
      goal: 'Try to get the permit the proper way.',
      hint: 'Go from counter to counter. Remember where each one sends you.',
    },
    'a08-09-s3': {
      goal: 'Make up a silly form for the clerks.',
      hint: 'Write it on a fresh page. The sillier the better.',
    },
    'a08-09-s4': {
      goal: 'Hand in your form while Asterix asks.',
      hint: 'Give the form to the clerk at counter one. Then stand back.',
    },
  },
  [
    sc(
      'a08-09-door',
      [
        N('Task eight is a very tall white building.'),
        N('It has a hundred windows, and it hums.'),
        P('You must get a paper called Permit A38.'),
        PO('Go to counter one. It will send you to counter two.'),
        N('The stairs on the right go up, round, and back down.'),
      ],
      [
        nt(
          'social-studies',
          'what a bureaucracy is',
          3,
          [
            P('This is a bureaucracy. That means a place with lots of rules and forms.'),
            P('Rules can help. But too many can send you round and round.'),
          ],
          'Heard, gently, that a bureaucracy is a place of many rules and forms, which help when they are few and clear.',
          'D2.Civ.8.K-2',
        ),
      ],
    ),
    sc(
      'a08-09-door-done',
      [
        N('The dog lies down beside the porter’s desk.'),
        N('Your Nubbin lies down too. They will wait.'),
        N('Waiting is hard. Even for a dog.'),
      ],
      [
        ak(
          'sel',
          'what helps when you have to wait',
          2,
          [N('Waiting is hard. What could help us wait well?')],
          [
            opt(
              'Take slow breaths, or play a quiet game',
              [N('Yes! Breathing slowly and playing quietly both help us wait.', 'happy')],
              true,
            ),
            opt('Stamp and shout', [
              N('That makes waiting feel longer. Slow breaths work better.'),
            ]),
          ],
          'Chose calming ways to wait: slow breaths or a quiet game.',
          'CASEL: Self-management',
        ),
      ],
    ),
    sc(
      'a08-09-counters',
      [
        CL('Counter one? Go to counter two.'),
        CL('Counter two? Go to counter three.'),
        CL('Counter three? Go back to counter one.'),
        N('You write it down: one, two, three, one, two, three.'),
        N('The arrows make a circle. Round and round!'),
      ],
      [
        ak(
          'maths',
          'a pattern repeats',
          3,
          [N('The counters go one, two, three, one, two, three. What comes next?')],
          [
            opt(
              'One',
              [N('Yes! One, two, three, then one again. It is a pattern.', 'happy')],
              true,
            ),
            opt('Four', [N('There is no counter four, so it goes back to one. A pattern!')]),
          ],
          'Continued a repeating pattern: one, two, three, one, two, three.',
          'ELOF: Mathematics Development',
        ),
      ],
      {
        choices: [
          {
            id: 'queue',
            label: 'Join the longest queue, just to see.',
            then: [N('At the front, a sign says: “Closed. Please queue at the back.”')],
          },
          {
            id: 'map',
            label: 'Draw a map of the counters.',
            then: [
              A('Show me that.'),
              N('Asterix looks at your circle of arrows. He smiles slowly.', 'happy'),
            ],
          },
        ],
      },
    ),
    sc(
      'a08-09-counters-done',
      [
        A('This place says no to everything.'),
        A('So let us ask for something that does not exist!', 'happy'),
        N('If one way does not work, try another way.'),
      ],
      [
        nt(
          'science',
          'if one way does not work, try another',
          2,
          [
            A('Stuck? Do not give up. Think of a new idea, and try that.'),
            N('That is how good problem-solvers work.'),
          ],
          'Heard that when one way does not work, we can think up and try a different way.',
          'K-2-ETS1-1',
        ),
      ],
    ),
    sc(
      'a08-09-form',
      [
        A('I will ask for Permit A39. Nobody has heard of it.'),
        A('While they look, you hand in a new, silly form.'),
        N('You find a fresh page. Obelix leans over your shoulder.'),
        O('Make it the silliest one ever!', 'happy'),
        P('It must look very serious. Then it will work.', 'think'),
      ],
      [
        dd(
          'art',
          'make up a silly design',
          4,
          'edu:draw:form:silly',
          [
            N('(Draw a silly stamp or squiggle on your form. Make it very silly.)'),
            N('What a lovely, silly form!'),
          ],
          'Drew a silly invented form, using imagination and creativity.',
          'ELOF: Approaches to Learning',
        ),
      ],
      {
        choices: [
          {
            id: 'loop',
            label: 'Form 0: Application to Find Out Whether You Need This Form.',
            set: { 'a08-form': 'loop' },
            then: [
              N('It has one box. It says: “Please stick a copy of this form here.”'),
              P('Beautiful! That could go round the building for ever.', 'shock'),
            ],
          },
          {
            id: 'boar',
            label: 'The Pink-and-Blue Form: Proof You Are Not a Boar, signed by a boar.',
            set: { 'a08-form': 'boar' },
            then: [
              N('Obelix signs with a knuckle print for the boar.'),
              O('Now we must find a boar who can write.', 'happy'),
            ],
          },
          {
            id: 'plain',
            label: 'A short form: your name, what you need, and a signature.',
            set: { 'a08-form': 'plain' },
            then: [
              N('It fits on one page. A child could fill it in.'),
              P('They will not accept this. It is far too sensible.', 'think'),
            ],
          },
        ],
      },
    ),
    sc(
      'a08-09-form-done',
      [
        P('Here is a sheet of papyrus. Copy your form out neatly.'),
        N('You write a big A for Asterix at the top.'),
        N('Asterix straightens his helmet and walks to counter one.'),
      ],
      [
        dd(
          'literacy',
          'recognise the first letter of a name',
          1,
          'edu:point:letter:a',
          [
            N('(Point to the A on the form. A is for Asterix, and for apple!)'),
            N('A makes the sound at the start of apple and Asterix: a, a, a!'),
          ],
          'Found the first letter A of Asterix’s name.',
          'ELOF: Literacy',
        ),
      ],
    ),
    sc(
      'a08-09-a39',
      [
        A('Good morning. I would like Permit A39, please.'),
        CL('A39? There is no A39!', 'shock'),
        N('The clerk goes pale. Is it a new rule? Did he miss it?'),
        N('The clerk whispers to the clerk behind him.'),
        N('The whisper runs up the stairs. Clerks run everywhere!'),
        N('You slide your form across. Stamp, and it is passed on!'),
        N('Papers fly like birds. A bell rings at the top.'),
      ],
      [
        dd(
          'health',
          'slow breaths help us calm down',
          5,
          'edu:breathe:slow:3',
          [
            N('(Everyone is rushing! Take three slow breaths: in… and out.)'),
            N('Slow breaths help our bodies calm down.'),
          ],
          'Took three slow breaths to calm down while everyone else rushed.',
          'CASEL: Self-management',
        ),
      ],
    ),
    sc(
      'a08-09-a39-done',
      [
        PF('Take what you want, and please go away!', 'angry'),
        A('Permit A38, please.'),
        N('Asterix says please, even to a grumpy prefect.'),
      ],
      [
        ak(
          'sel',
          'polite words',
          2,
          [N('Asterix says “please”. Which other word is a polite word?')],
          [
            opt(
              'Thank you',
              [
                N(
                  'Yes! Please and thank you are polite words. They make people feel respected.',
                  'happy',
                ),
              ],
              true,
            ),
            opt('Go away', [N('That is not so polite. Thank you is a polite word.')]),
          ],
          'Named polite words (please, thank you) and why they help.',
          'ELOF: Social and Emotional Development',
        ),
      ],
    ),
    sc(
      'a08-09-complete',
      [
        N('The prefect stamps a small paper. It flutters down to you.'),
        N('It says PERMIT A38 in big letters.'),
        P('Nobody has ever got one. I did not think it was real.', 'shock'),
        N('You make a mark on the tablet: VIII.'),
        N('V is five and III is three. Five and three make eight!'),
        O('That was the best one. Can we do it again?', 'happy'),
        A('Never, Obelix.'),
      ],
      [
        nt(
          'maths',
          'VIII is eight',
          4,
          [P('VIII is five, and three more. Five and three make eight.', 'happy')],
          'Heard that the Roman numeral VIII is five and three more, which is eight.',
          'K.OA.A.1',
        ),
      ],
    ),
  ],
);

// ================================================================== A8-10 The Crocodile Ravine
const Q10 = quest(
  'a08-10',
  'The Crocodile Ravine',
  {
    'a08-10-s1': {
      goal: 'Walk to the edge of the ravine.',
      hint: 'Stand at the post. Look across to the other post.',
    },
    'a08-10-s2': {
      goal: 'Find another way across.',
      hint: 'Look along the edge for a tree that has already fallen.',
    },
  },
  [
    sc(
      'a08-10-edge',
      [
        N('Task nine is a deep, narrow ravine.'),
        N('Crocodiles in the river look up. Snap, snap!'),
        P('You must cross on the magic rope. It is invisible.', 'think'),
        N('You drop a pebble from the post. It falls down, down.'),
        N('A crocodile catches it. Crunch!'),
      ],
      [
        ak(
          'literacy',
          'first sounds: c for crocodile',
          4,
          [N('Crocodile starts with a c sound: c, c, crocodile. Which word starts the same?')],
          [
            opt('Cake', [N('Yes! Cake and crocodile both start with c.', 'happy')], true),
            opt('Dog', [N('Dog starts with d. Cake starts with c, like crocodile.')]),
          ],
          'Matched the first sound of “crocodile” with “cake”.',
          'ELOF: Literacy',
        ),
      ],
      {
        choices: [
          {
            id: 'pebble',
            label: '“There’s no rope.”',
            then: [P('There is a rope. It is very good at being invisible.'), A('So is a hole.')],
          },
          {
            id: 'pupus',
            label: '“Mr Pupus, would you show us how, first?”',
            then: [P('Observers must not interfere.', 'shock'), N('Pupus takes three steps back.')],
          },
        ],
      },
    ),
    sc(
      'a08-10-log',
      [
        O('I will pull up a tree for a bridge!', 'happy'),
        N('The dog howls. He cannot bear to see trees pulled up.'),
        O('Sorry, Dogmatix. Not that one.', 'sad'),
        N('Your Nubbin leans on the dog until his ears come up.'),
        N('A big old pine lies on its side. It fell by itself, long ago.'),
        N('Obelix gives it one punch. It swings across the ravine.'),
        N('A perfect bridge! The crocodiles look cross.'),
      ],
      [
        nt(
          'science',
          'trees are alive and we look after them',
          1,
          [
            N('Trees are alive. They drink with their roots and grow tall.'),
            N('We look after trees, so we use one that has already fallen.'),
          ],
          'Heard that trees are alive, and that we look after them.',
          'K-ESS3-3',
        ),
        ak(
          'sel',
          'comforting a sad friend',
          3,
          [N('The dog is sad. What did the Nubbin do to help?')],
          [
            opt(
              'Leaned close and stayed with him',
              [N('Yes! Staying close is a lovely way to comfort a friend.', 'soft')],
              true,
            ),
            opt('Ran away', [N('Running away leaves a friend alone. The Nubbin stayed.')]),
          ],
          'Noticed how staying close comforts a sad friend.',
          'CASEL: Social awareness',
        ),
      ],
      {
        choices: [
          {
            id: 'cross',
            label: 'Cross first, carrying the Nubbin.',
            then: [N('The trunk is as wide as a road. The dog trots beside you, happy.', 'happy')],
          },
          {
            id: 'pupus',
            label: 'Offer Pupus your hand.',
            then: [
              P('I do not need… thank you.', 'soft'),
              N('He holds your hand all the way across.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a08-10-complete',
      [
        P('That was not the magic rope.', 'think'),
        A('There was not one.'),
        N('Pupus looks at the empty air for a long time.'),
        P('Fine. Write it down.'),
        N('You make a mark: IX. It is X, with a twig before it.'),
      ],
      [
        nt(
          'maths',
          'IX is nine',
          4,
          [P('X is ten. A twig before it takes one away. So IX is nine!', 'happy')],
          'Heard that the Roman numeral IX is ten with one taken away, which is nine.',
          'K.OA.A.1',
        ),
      ],
    ),
  ],
);

// ================================================================== A8-11 The Old Man of the Mountain
const Q11 = quest(
  'a08-11',
  'The Old Man of the Mountain',
  {
    'a08-11-s1': {
      goal: 'Climb to the top of the mountain.',
      hint: 'Take the goat path. It goes back and forth.',
    },
    'a08-11-s2': {
      goal: 'Answer the Old Man’s riddle.',
      hint: 'Listen to the clues. Look around the cave.',
    },
  },
  [
    sc(
      'a08-11-climb',
      [
        N('Task ten is a mountain with its top in the clouds.'),
        N('A narrow path winds up it, back and forth. So do goats!'),
        P('A very wise Old Man lives at the top.'),
        N('Near the top, the air is cold.'),
        N('You pull on your warm jumper.'),
      ],
      [
        nt(
          'science',
          'high up a mountain is colder',
          3,
          [
            N('It is colder at the top of a mountain than at the bottom.'),
            N('That is why mountain tops can have snow.'),
          ],
          'Heard that it is colder high up on a mountain.',
        ),
      ],
      {
        choices: [
          {
            id: 'view',
            label: 'Stop and look at the view.',
            then: [N('All of Gaul is under you. Green fields, silver rivers.', 'soft')],
          },
          {
            id: 'on',
            label: 'Keep going: no stopping on mountains.',
            then: [A('Good thinking. If I stop, I will never start again.')],
          },
        ],
      },
    ),
    sc(
      'a08-11-climb-done',
      [
        N('At the top, an old man sits on a rock.'),
        N('You feel tired. Your legs are wobbly.'),
        N('Obelix gives your Nubbin a ride on his shoulder.'),
      ],
      [
        ak(
          'sel',
          'asking for help when tired',
          1,
          [N('Your legs feel wobbly. What can you do?')],
          [
            opt(
              'Rest, or ask a friend for help',
              [N('Yes! Resting and asking for help are both clever things to do.', 'happy')],
              true,
            ),
            opt('Pretend you are not tired', [
              N('Everyone gets tired. Asking for help is a strong thing to do.'),
            ]),
          ],
          'Chose to rest or ask for help when tired.',
          'CASEL: Self-management',
        ),
      ],
    ),
    sc(
      'a08-11-riddle',
      [
        OM('Here is my riddle. What is white, soft and smells sweet?'),
        OM('It makes you clean. One costs two coins.'),
        OM('Or three for five! What a bargain!'),
        N('Obelix counts on his fingers. He gets to three, and stops.'),
        N('Behind him are stacks of white cakes, wrapped in leaves.'),
        A('Is it soap?'),
        OM('Yes! My Own Mountain Soap! Gentle on the beard!', 'happy'),
        N('It was not a riddle. It was an advert!'),
      ],
      [
        ak(
          'maths',
          'add two groups within 10',
          6,
          [N('One soap costs two coins. How many coins for two soaps?')],
          [
            opt('Four', [N('Yes! Two coins and two coins make four.', 'happy')], true),
            opt('Two', [N('That is for one soap. Two coins plus two coins make four.')]),
          ],
          'Added two and two to find the cost of two soaps.',
          'K.OA.A.2',
        ),
        nt(
          'literacy',
          'an advert tries to make you buy something',
          7,
          [
            N('An advert tells you good things about something, so you will buy it.'),
            N('It is good to ask: is that true, or is it an advert?'),
          ],
          'Heard that an advert wants us to buy something, and that it is good to ask questions about it.',
          'ELOF: Language and Communication',
        ),
      ],
      {
        choices: [
          {
            id: 'buy',
            label: 'Buy three soaps for five coins.',
            then: [OM('A wise traveller! A fourth, free, for honest eyes.', 'happy')],
          },
          {
            id: 'riddle',
            label: '“That wasn’t a riddle. That was an advert.”',
            then: [OM('The best riddles are. Have a free sample.', 'happy')],
          },
        ],
      },
    ),
    sc(
      'a08-11-complete',
      [
        N('You go down. It is quicker than going up.'),
        N('You smell of soap and flowers. So does Obelix.'),
        O('I smell like a lamb!', 'sad'),
        A('You smell lovely.'),
        N('You make a mark on the tablet: X.'),
      ],
      [
        dd(
          'maths',
          'X is ten',
          4,
          'edu:show:fingers:10',
          [
            N('(Cross your two arms like an X. That is the Roman ten!)'),
            N('Ten fingers make X. Hold up both hands.'),
          ],
          'Crossed arms to make X, the Roman numeral for ten.',
          'K.CC.A.1',
        ),
      ],
    ),
  ],
);

// ================================================================== A8-12 The Haunted Plain
const Q12 = quest(
  'a08-12',
  'The Haunted Plain',
  {
    'a08-12-s1': {
      goal: 'Camp by the stone and wait for midnight.',
      hint: 'Make a little fire. Stay close together.',
    },
    'a08-12-s2': {
      goal: 'Tell the ghosts what is wrong, kindly.',
      hint: 'Talk to the ghost at the front. Be specific.',
    },
  },
  [
    sc(
      'a08-12-camp',
      [
        N('Task eleven is a flat plain under a big moon.'),
        N('Mist curls round the standing stone.'),
        P('At midnight, ghosts come. Nobody has ever stayed.'),
        N('You make a small fire. Obelix shares his potatoes.'),
        N('Far off, something clanks. Clank, clank, clank!'),
      ],
      [
        nt(
          'science',
          'mist is tiny drops of water in the air',
          1,
          [
            N('Mist is made of tiny drops of water, floating in the air.'),
            N('Mist comes when the air gets cool and damp.'),
          ],
          'Heard that mist is made of tiny drops of water floating in cool air.',
          'ELOF: Scientific Reasoning',
        ),
      ],
      {
        choices: [
          {
            id: 'story',
            label: 'Tell a story to pass the time.',
            then: [N('You tell them about the Grove, the hill, and the pond.', 'soft')],
          },
          {
            id: 'watch',
            label: 'Keep watch in silence.',
            then: [N('You watch the mist. Pupus sits close beside you.')],
          },
        ],
      },
    ),
    sc(
      'a08-12-camp-done',
      [
        N('The mist parts. Out marches a line of ghosts.'),
        N('They glow a faint green. Their chains go clank!'),
        N('They are more silly than scary.'),
      ],
      [
        ak(
          'sel',
          'it is okay to feel spooked, and what helps',
          2,
          [N('Feeling a little spooked is okay. What helps?')],
          [
            opt(
              'Hold a friend’s hand',
              [N('Yes! A friend close by helps a spooky feeling go small.', 'soft')],
              true,
            ),
            opt('Hide all alone', [N('Hiding alone can feel scarier. A friend’s hand is better.')]),
          ],
          'Named that feeling spooked is okay, and that staying near a friend helps.',
          'CASEL: Self-awareness',
        ),
      ],
    ),
    sc(
      'a08-12-ghosts',
      [
        GH('Woooo! We are the lost legion! Fear us!', 'angry'),
        O('Excuse me. Some of us are trying to sleep.', 'angry'),
        GH('We are ghosts. We are meant to be scary!', 'shock'),
        A('Your chains need oil. And you are standing in our potatoes.'),
        O('And your sheets are grubby at the hem.'),
        N('The ghost looks down. It is a bit grey at the hem.', 'think'),
      ],
      [
        ak(
          'literacy',
          'say what is wrong, politely',
          5,
          [N('Obelix told the ghost what was wrong. Which way is kinder?')],
          [
            opt(
              '“Please could you be quieter? We are sleeping.”',
              [N('Yes! Say what is wrong, and say please. That is the kind way.', 'happy')],
              true,
            ),
            opt('“You are rubbish!”', [
              N('That would hurt feelings. Saying what is wrong, politely, works better.'),
            ]),
          ],
          'Chose a polite way to say what is wrong.',
          'ELOF: Language and Communication',
        ),
      ],
      {
        choices: [
          {
            id: 'noise',
            label: '“And the moaning is out of tune.”',
            then: [
              GH('It is NOT out of tune. Marcus? Are we out of tune?', 'angry'),
              N('Marcus does not answer.'),
            ],
          },
          {
            id: 'permit',
            label: '“Have you got a permit for this?”',
            then: [
              GH('A permit? For haunting? I do not think so.', 'shock'),
              N('A worried ripple runs down the line.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a08-12-ghosts-done',
      [
        GH('If we are not wanted, we will go.', 'sad'),
        N('They shuffle off into the mist, chains dragging.'),
        N('Clank, clank, clank. Then quiet.'),
      ],
      [
        nt(
          'science',
          'sounds get quieter far away',
          2,
          [
            N('(Say “clank” loudly. Now say it very softly, as if it is far away.)'),
            N('Near sounds are loud. Far sounds are quiet, and the ghosts are far off!'),
          ],
          'Noticed that a sound gets quieter as it moves further away.',
          'ELOF: Scientific Reasoning',
        ),
      ],
    ),
    sc(
      'a08-12-complete',
      [
        N('Dawn comes up pink. The ghosts are gone.'),
        P('One more task. It is in Rome.', 'think'),
        N('You make a mark on the tablet: XI.'),
        N('X is ten, and one more twig makes XI. That is eleven!'),
      ],
      [
        nt(
          'maths',
          'XI is eleven',
          3,
          [P('XI is ten and one more. Ten and one make eleven.', 'happy')],
          'Heard that the Roman numeral XI is ten and one more, which is eleven.',
          'K.OA.A.1',
        ),
      ],
    ),
  ],
);

// ================================================================== A8-13 The Circus Maximus
const Q13 = quest(
  'a08-13',
  'The Circus Maximus',
  {
    'a08-13-s1': {
      goal: 'Go with the village to Rome.',
      hint: 'The whole village is coming. Help the chief onto his shield.',
    },
    'a08-13-s2': {
      goal: 'Referee the last task from the edge of the arena.',
      hint: 'Stand at the gate with your tablet. Watch the lions.',
    },
  },
  [
    sc(
      'a08-13-rome',
      [
        N('The whole village goes to Rome!'),
        N('Rome is very big, white and gold, with lots of steps.'),
        G('Look! Tall bridges carry water into the city.'),
        BD('Shall I sing something to make Rome weep?'),
        V('No.'),
        N('Through a gate, you hear the crowd roar.'),
      ],
      [
        nt(
          'social-studies',
          'Rome was a very big city, with aqueducts that carried water',
          2,
          [
            G('Those tall bridges are called aqueducts. They carry water to the city.'),
            G('Water runs gently downhill all the way. Clever!'),
          ],
          'Heard that Rome was a big city whose aqueducts carried water gently downhill.',
          'D2.His.2.K-2',
        ),
      ],
      {
        choices: [
          {
            id: 'gate',
            label: 'Look through the gate.',
            then: [N('Sand, sun, rows of faces. A man in a laurel crown sits high up.')],
          },
          {
            id: 'pupus',
            label: 'Ask Pupus if he’s all right.',
            then: [P('I think I would like you to win.', 'soft')],
          },
        ],
      },
    ),
    sc(
      'a08-13-arena',
      [
        N('The gate goes up. The village walks onto the sand.'),
        N('Three lions come out. Big lions!'),
        N('Asterix dances with one. Round and round.'),
        N('Obelix tickles another behind the ears. It rolls over.'),
        N('Someone brings a boar. Now it is a feast.'),
        N('Up in the crowd, you see the champions, cheering.'),
        N('The crowd comes down to join the party.'),
      ],
      [
        dd(
          'literacy',
          'Latin counting: unus, duo, tres',
          2,
          'edu:say:latin-numbers:unus-duo-tres',
          [
            N('(Count the lions in Latin: unus, duo, tres. One, two, three!)'),
            P('Unus, duo, tres! The Romans counted just like that.', 'happy'),
          ],
          'Counted to three in Latin: unus, duo, tres.',
          'ELOF: Language and Communication',
        ),
      ],
    ),
    sc(
      'a08-13-arena-done',
      [
        N('Up on the balcony, Caesar stands. All is quiet.'),
        CS('Well. That is the twelfth. I had better be a good loser.', 'think'),
        N('He looks down at the party, and almost smiles.'),
      ],
      [
        ak(
          'sel',
          'being a good loser',
          1,
          [N('Caesar did not win. What is the kind thing to do?')],
          [
            opt(
              'Say well done',
              [N('Yes! Saying well done, even when we lose, is a kind thing.', 'happy')],
              true,
            ),
            opt('Be cross for ever', [
              N('Being cross for ever feels heavy. Saying well done feels light.'),
            ]),
          ],
          'Talked about being a good loser by saying well done.',
          'CASEL: Self-management',
        ),
      ],
    ),
    sc(
      'a08-13-complete',
      [
        CS('Gauls, you passed all twelve. Rome says so.'),
        V('Thank you! Come to dinner!', 'happy'),
        P('You were fair, and very strange. I would watch you again.', 'soft'),
        N('You make the last mark on the tablet: XII.'),
        N('X is ten, II is two. Ten and two make twelve!'),
      ],
      [
        dd(
          'maths',
          'count the tablet marks to twelve',
          4,
          'edu:count:marks:12',
          [
            N('(Count all the marks on the tablet together. Point to each one.)'),
            N('Twelve! I, II, III, all the way to XII.'),
          ],
          'Counted twelve marks on the tablet, one for each task.',
          'K.CC.B.5',
        ),
      ],
    ),
  ],
);

// ================================================================== A8-14 The Banquet
const Q14 = quest(
  'a08-14',
  'The Banquet',
  {
    'a08-14-s1': {
      goal: 'Help set up the banquet in the village square.',
      hint: 'Carry the boar to the spits and the benches to the tables.',
    },
    'a08-14-s2': {
      goal: 'Give your form to Asterix.',
      hint: 'Find your form from the Place That Sends You Mad.',
    },
  },
  [
    sc(
      'a08-14-square',
      [
        N('The village square is full of long tables.'),
        V('Tonight we feast! Twelve tasks, twelve boars!', 'happy'),
        N('Pupus has come too, as a friend.'),
        N('Your Nubbin and the dog carry a bone. They lose it.'),
        BD('I have a new song! It has forty-two verses!', 'happy'),
        N('Everyone goes very quiet.'),
      ],
      [
        dd(
          'literacy',
          'Latin word: amicus means friend',
          2,
          'edu:say:latin-word:amicus',
          [
            N('(Give a friend a wave and say it: ah-MEE-cuss!)'),
            P('Amicus! That is Latin for friend. I am glad to be yours.', 'happy'),
          ],
          'Learned the Latin word “amicus”, which means friend.',
          'ELOF: Language and Communication',
        ),
      ],
      {
        choices: [
          {
            id: 'let',
            label: '“Let him sing one verse.”',
            then: [
              BD('One verse! The first part is the overture, in seven parts…', 'happy'),
              N('The village looks for a very big scarf, to hush him gently.'),
            ],
          },
          {
            id: 'rope',
            label: 'Look round for some rope.',
            then: [N('There is no rope. Someone used it on a cart.')],
          },
        ],
      },
    ),
    sc(
      'a08-14-square-done',
      [
        N('From a hut comes the sound of a lyre being tuned.'),
        N('Twang, twang! The strings wobble.'),
        A('Referee, do you still have your form?'),
      ],
      [
        dd(
          'science',
          'sounds are made by things that shake',
          1,
          'edu:pluck:string:feel',
          [
            N('(Pretend to pluck a string. Wobble it with your finger.)'),
            N('A string makes a sound when it shakes. Shake, shake, twang!'),
          ],
          'Noticed that a plucked string wobbles to make a sound.',
          '1-PS4-1',
        ),
      ],
    ),
    sc(
      'a08-14-tie',
      [
        N('You take your form out of your bag. It is covered in stamps.'),
        A('That might do very nicely.'),
        BD('What are you doing? I have not started the overture!', 'shock'),
        G('Hold still, Cacofonix. It is an honour.'),
        N('Getafix reads the form, and his eyebrows go up.'),
      ],
      [
        ak(
          'sel',
          'taking turns, and letting others have a turn',
          3,
          [N('The bard wants a very long turn. What would be fair?')],
          [
            opt(
              'Short turns for everyone',
              [N('Yes! Fair means everyone gets a turn.', 'happy')],
              true,
            ),
            opt('One person talks for ever', [
              N('Then nobody else gets a turn. Fair means sharing turns.'),
            ]),
          ],
          'Talked about taking turns, so everyone gets a go.',
          'CASEL: Relationship skills',
        ),
      ],
    ),
    sc(
      'a08-14-tie-done',
      [
        N('The village gathers to see what you wrote.'),
        N('First you made the form. Next it was stamped.'),
        N('Last, it comes out at the party.'),
      ],
      [
        ak(
          'literacy',
          'first, next, last',
          2,
          [N('What happened to the form first?')],
          [
            opt(
              'You made it',
              [N('Yes! First you made it. Next it was stamped. Last, the party.', 'happy')],
              true,
            ),
            opt('It came to the party', [
              N('That came last! First you made it, and next it was stamped.'),
            ]),
          ],
          'Put three story events in order: made, stamped, used.',
          'RL.K.3',
        ),
      ],
    ),
    sc(
      'a08-14-complete',
      [
        N('The feast goes on, late into the starry night.'),
        G('For the referee. Use it kindly.', 'soft'),
        N('Getafix gives you a tiny cauldron. The chief gives you a winged helmet.'),
        O('And a menhir! My smallest one. It has a face!', 'happy'),
        N('Far away, a javelin is still flying. Verses is still following Stick.'),
        P('Vale, referee! Come back soon.', 'soft'),
        N('The map closes round you. You are home in the Grove.'),
      ],
      [
        ak(
          'literacy',
          'Latin words: salve and vale',
          5,
          [P('Which Latin word means goodbye?')],
          [
            opt('Vale', [N('Vale! Yes. Salve is hello, and vale is goodbye.', 'happy')], true),
            opt('Salve', [N('Salve is hello, and vale is goodbye. Say it with a wave.')]),
          ],
          'Remembered that “vale” is goodbye and “salve” is hello in Latin.',
          'ELOF: Language and Communication',
        ),
      ],
    ),
  ],
);

// ================================================================== Banquet variants
export const EDU_A08_SPROUT_VARIANTS: EduScene[] = [
  sc(
    'a08-14-bard-loop',
    [
      G('This form says: stick a copy of this form here.', 'think'),
      N('Every clerk did! It unrolls to your knees, and keeps going.'),
      N('The chief laughs so much he falls off his shield.'),
      N('They wind it round the bard and the oak tree.'),
      BD('This is an outrage! I shall write a song about it!', 'angry'),
      O('You cannot. Your arms are inside a form.', 'happy'),
    ],
    [
      dd(
        'maths',
        'a circle has no end',
        1,
        'edu:trace:circle:finger',
        [
          N('(Trace a big circle in the air with your finger. Round and round!)'),
          N('A circle goes round and round with no end.'),
        ],
        'Traced a circle, noticing it goes round and round with no end, like the form.',
        'ELOF: Perceptual, Motor, and Physical Development',
      ),
    ],
  ),
  sc(
    'a08-14-bard-boar',
    [
      G('Proof That You Are Not a Boar. Signed by a boar!', 'think'),
      N('Obelix goes pink with pride.'),
      V('Our referee made the silliest form in Gaul!', 'happy'),
      N('They wind it round the bard and the oak tree.'),
      BD('I am not a boar. I wish to say so loudly!', 'angry'),
      G('It is all right. Now you have it in writing.', 'happy'),
    ],
    [
      dd(
        'art',
        'make a print with your hand',
        2,
        'edu:print:knuckle:paper',
        [
          N('(Press a knuckle on the table, like Obelix signing for the boar. Press, lift!)'),
          N('A print is a mark you make by pressing. That is the boar’s signature!'),
        ],
        'Made a knuckle print, the way Obelix “signed” for the boar.',
        'ELOF: Perceptual, Motor, and Physical Development',
      ),
    ],
  ),
  sc(
    'a08-14-useful',
    [
      G('Name. What you need. Signature. One page.', 'think'),
      N('Getafix reads it twice. He tucks it in his robe.'),
      G('Too good to tie up a bard. I will file it as Useful.', 'happy'),
      A('It did not win. It was too sensible.'),
      G('Sensible things often lose on the day. Then people use them for years.', 'soft'),
      N('They use an old fishing net for the bard instead.'),
    ],
    [
      ak(
        'sel',
        'feeling all right when your idea does not win',
        4,
        [N('Your form did not win, but it is useful. How can you feel?')],
        [
          opt(
            'Proud of it, even if it did not win',
            [N('Yes! A good idea is still good, win or lose.', 'happy')],
            true,
          ),
          opt('Sad for ever', [
            N('A little sad is all right. But your form will help people for years!'),
          ]),
        ],
        'Talked about feeling proud of a good idea, even when it does not win.',
        'CASEL: Self-awareness',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A08_SPROUT: EduQuest[] = [
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
];

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  'edu:count:friends:3',
  'edu:say:latin-word:salve',
  'edu:say:sound-word:whoosh',
  'edu:show:fingers:1',
  'edu:trace:letter:i',
  'edu:say:sound-word:rumble',
  'edu:say:first-sound:s-swift',
  'edu:say:latin-word:vale',
  'edu:say:latin-word:aqua',
  'edu:hum:soft-loud:lullaby',
  'edu:show:fingers:5',
  'edu:say:latin-word:gratias',
  'edu:hum:feel:chest',
  'edu:draw:form:silly',
  'edu:point:letter:a',
  'edu:breathe:slow:3',
  'edu:show:fingers:10',
  'edu:say:latin-numbers:unus-duo-tres',
  'edu:count:marks:12',
  'edu:say:latin-word:amicus',
  'edu:pluck:string:feel',
  'edu:trace:circle:finger',
  'edu:print:knuckle:paper',
];
