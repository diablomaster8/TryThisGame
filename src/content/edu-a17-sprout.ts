/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Atlas page A17, The
 * Camphor Tree (*My Neighbor Totoro*, Japan).
 *
 * Source: atlas-a17.ts (ATLAS_A17 and A17_VARIANTS). One EduScene per original scene, id
 * `sprout:<original id>`, with the same choice ids and `set` flags. Every step scene, done scene,
 * complete scene and variant has a version, and each has exactly one lesson.
 *
 * What it teaches (outline: how an acorn becomes a tree and why you wait for seeds; camphor
 * trees and old trees honoured at shrines; the Japanese countryside of the 1950s; family words;
 * the rainy season): seeds, roots and shoots, waiting for plants; the camphor as a big evergreen
 * that shelters small lives; shoes off at the step; telegrams and letters in the past; rice
 * paddies; the Jizo statues and the rope on the old tree, told with respect; the words
 * arigatō, onee-chan and obaa-chan; rain, light, sound and the Moon; patience, saying sorry, and
 * asking for help.
 *
 * Left out or softened for this age (EDU-STYLE.md, “Hard things”):
 * - Mrs Kusakabe’s illness is never named. She “has a cold and is resting in hospital”, and
 *   every scene about her says she is getting better. The telegram is a delay, not a danger.
 * - A17-13: Mei is lost for only a few lines; the sandal is “not Mei’s” at once, and the lesson
 *   is what to do when lost (stay still, tell a grown-up), with Mei found next scene.
 * - Japanese care notes kept: the Jizo statues and the shrine are shown with respect, nobody
 *   plays on them, and the bow to the tree is told as narration, never a choice or a task. The
 *   shared family bath is not described at all (only “the family has a bath”, you wait outside).
 * - Choices are all kept with their ids and flags (`a17-tunnel` = hunt | wait); none is cruel,
 *   so no `defaultChoice` is needed.
 * - No quotes from the film or either English dub; no song lyrics. The great spirit, the
 *   Catbus and the soot sprites stay Ghibli’s designs and are never named beyond the page.
 * - Facts used: rice grows in flooded fields called paddies; Japan is a country of islands;
 *   camphor trees are evergreen and their leaves smell sharp and clean; acorns are the seeds of
 *   oak trees; roots take water from the ground; seeds need soil, water, warmth and time; yellow
 *   and blue make green; arigatō means thank you; a cold is a small illness that goes away with
 *   rest; the Moon does not make its own light; a hospital word has three beats (hos-pi-tal);
 *   corn kernels are seeds; a loud sound travels far.
 */
import type { EduDomain, EduQuest, EduScene, Lesson } from './types';
import type { Line, Choice } from '../config/story';

type Mood = NonNullable<Line['mood']>;
const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const Y = say('you');
const SA = say('a17-satsuki');
const ME = say('a17-mei');
const FA = say('a17-father');
const MO = say('a17-mother');
const GR = say('a17-granny');
const KA = say('a17-kanta');
const M = say('moss');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const words = (t: string) => t.trim().split(/\s+/).length;

/**
 * Keeps every line to 14 words or fewer and two sentences or fewer, as the sprout band requires: a long line is cut at
 * sentence ends into several lines by the same speaker (the mood stays on the first). `map[i]`
 * is the index of the last piece of original line i, so a lesson’s `after` can follow.
 */
const split = (lines: Line[]): { lines: Line[]; map: number[] } => {
  const out: Line[] = [];
  const map: number[] = [];
  for (const l of lines) {
    const sentences = l.text.split(/(?<=[.!?”)])\s+(?=[A-Z“(])/);
    const chunks: string[] = [];
    const counts: number[] = [];
    for (const sentence of sentences) {
      const last = chunks[chunks.length - 1];
      if (
        last !== undefined &&
        counts[counts.length - 1]! < 2 &&
        words(last) + words(sentence) <= 14
      ) {
        chunks[chunks.length - 1] = `${last} ${sentence}`;
        counts[counts.length - 1]!++;
      } else {
        chunks.push(sentence);
        counts.push(1);
      }
    }
    chunks.forEach((text, i) =>
      out.push(i === 0 && l.mood ? { who: l.who, text, mood: l.mood } : { who: l.who, text }),
    );
    map.push(out.length - 1);
  }
  return { lines: out, map };
};
const sp = (lines: Line[]): Line[] => split(lines).lines;

/** One answer option. `best` marks the answer the lesson teaches. */
const o = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply: sp(reply) } : { label, reply: sp(reply) };

/** An ask lesson. */
const ask = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string,
  prompt: Line[],
  options: Opt[],
  parentNote: string,
): Beat => ({
  domain,
  skill,
  standard,
  kind: 'ask',
  after,
  prompt: sp(prompt),
  options,
  parentNote,
});

/** A notice lesson: a character shares one true thing. */
const notice = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string,
  lines: Line[],
  parentNote: string,
): Beat => ({ domain, skill, standard, kind: 'notice', after, lines: sp(lines), parentNote });

/** A do lesson: the child does something in the Grove. */
const doit = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string,
  check: string,
  lines: Line[],
  parentNote: string,
): Beat => ({ domain, skill, standard, kind: 'do', after, check, lines: sp(lines), parentNote });

/** One sprout scene. Lesson ids are `sprout:<of>-l<n>`, numbered in play order. */
const sc = (of: string, lines: Line[], beats: Beat[], choices?: Choice[]): EduScene => {
  const cut = split(lines);
  const cutChoices = choices?.map((c) => (c.then ? { ...c, then: sp(c.then) } : c));
  return {
    id: `sprout:${of}`,
    of,
    band: 'sprout',
    lines: cut.lines,
    ...(cutChoices ? { choices: cutChoices } : {}),
    lessons: [...beats]
      .sort((a, b) => a.after - b.after)
      .map((b, i) => ({ id: `sprout:${of}-l${i + 1}`, ...b, after: cut.map[b.after] ?? b.after })),
  };
};

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

/** A choice with its id, label and one short reply line. */
const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice =>
  set ? { id, label, set, then } : { id, label, then };

// ---------------------------------------------------------------- shared pieces
const PAGE: Line[] = [
  N('Nova’s atlas opens. You see a country road in summer.'),
  N('A bus stop. Green rice fields. A huge tree on a hill.'),
];

// ================================================================== A17-1 The Old House
const A1: EduQuest = quest(
  'a17-01',
  'The Old House',
  {
    'a17-01-s1': {
      goal: 'Go into the summer page. Say hello to Granny at the bus stop.',
      hint: 'Touch the page. Then walk down the road to the bus stop.',
    },
    'a17-01-s2': {
      goal: 'Help carry boxes at the old house.',
      hint: 'Take the boxes from the lorry to the step. Take your boots off at the door.',
    },
    'a17-01-s3': {
      goal: 'Look at the big tree on the hill.',
      hint: 'Stand in the back garden and look up the hill.',
    },
  },
  [
    sc(
      'a17-01-road',
      [
        ...PAGE,
        N('Cicadas buzz. Zzzzz! You are standing in the road.'),
        N('An old woman waits at the bus stop. She has a straw hat.'),
        GR('You are the one who is staying with me. Good!'),
        N('A boy sits on the fence. He is called Kanta.'),
        KA('…lo.'),
        N('A lorry comes down the road. Two girls wave from the back.'),
      ],
      [
        notice(
          1,
          'social-studies',
          'rice grows in watery fields called paddies; Japan is a country of islands',
          'D2.Geo.2.K-2',
          [
            N('Look at the green fields. This is rice.'),
            N('Rice grows with its feet in water. The fields are called paddies.'),
            N('This story is in Japan, a country made of islands.'),
          ],
          'Learned that rice grows in flooded fields called paddies, and that Japan is a country of islands.',
        ),
      ],
      [
        ch('wave', 'Wave back.', [N('You wave. The little girl waves with both arms.')]),
        ch('ask', 'Ask Granny who they are.', [GR('The new family. Their mum is in hospital.')]),
        ch('kanta', 'Ask Kanta who they are.', [KA('Dunno.'), N('He does know. He goes pink.')]),
      ],
    ),
    sc(
      'a17-01-road-done',
      [
        GR('Go on, then. They will want help. I will make supper.'),
        N('The lorry is little and has wheels at the front and the back.'),
        N('Your Nubbin trots after it in the dust.'),
      ],
      [
        doit(
          1,
          'maths',
          'count to 3',
          'K.CC.B.5',
          'edu:count:lorry-wheels:3',
          [
            N('Count the wheels on the little lorry.'),
            N('(Point and count together: one, two, three.)'),
            N('Three wheels. A car has four.'),
          ],
          'Counted three wheels aloud, matching one number to each wheel.',
        ),
      ],
    ),
    sc(
      'a17-01-unload',
      [
        N('The old house has a hedge and a little porch.'),
        FA('Hello! Please mind the step. Thank you for helping.'),
        N('At the step, everyone takes off their shoes. They put them in a line.'),
        N('Your Nubbin has no shoes. It waits anyway.'),
        SA('Mei! The post is wobbly!', 'happy'),
        N('Plop! An acorn bounces at your feet. Plop! Another.'),
      ],
      [
        notice(
          2,
          'social-studies',
          'taking shoes off at the door is a way of showing respect and keeping the floor clean',
          'D2.Civ.8.K-2',
          [
            N('In many homes in Japan, shoes come off at the door.'),
            N('It keeps the floor clean. It is a way of being polite.'),
            N('(Where do shoes go in your house?)'),
          ],
          'Learned that taking shoes off at the door is a polite, ordinary custom in Japan.',
        ),
      ],
      [
        ch('pocket', 'Put the acorn in your pocket.', [
          N('It sits in your pocket, small and smooth.'),
        ]),
        ch('mei', 'Give it to Mei.', [ME('Thank you! Now I have two!', 'happy')]),
        ch('leave', 'Leave it where it fell.', [N('Later, it is gone.')]),
      ],
    ),
    sc(
      'a17-01-unload-done',
      [
        FA('That is the last box. Who wants to find the well?'),
        N('Mei wants to. Satsuki wants to. Your Nubbin wants to!'),
      ],
      [
        ask(
          1,
          'sel',
          'taking turns when everyone wants to go first',
          'CASEL: Relationship skills',
          [N('Three friends all want to go first. What can they do?')],
          [
            o(
              'Take turns, one then the next.',
              [N('Yes! Taking turns is fair. Everyone gets a go.')],
              true,
            ),
            o('Push to the front.', [
              N('Pushing makes someone sad.'),
              N('Taking turns is kinder.'),
            ]),
            o('Nobody goes.', [
              N('The well is fun!'),
              N('Taking turns lets everyone have a go.'),
            ]),
          ],
          'Chose taking turns as a fair way for everyone to go first.',
        ),
      ],
    ),
    sc(
      'a17-01-tree',
      [
        N('Behind the house the ground goes up. Up goes the tree.'),
        SA('Dad, what tree is that?'),
        FA('A camphor tree. It is very, very old.'),
        ME('It is the biggest in the world!'),
        N('The wind blows. The whole tree moves, slow and soft.'),
        N('Your Nubbin sits down in the grass and looks up.'),
      ],
      [
        notice(
          4,
          'science',
          'big trees give shade and homes to birds and bugs',
          'K-ESS2-2',
          [
            N('A tree this big makes a cool, shady place.'),
            N('Birds, bugs and little animals can live in it.'),
            N('Its leaves stay green all year. They smell clean and sharp.'),
          ],
          'Learned that a big tree gives shade and homes to small animals.',
        ),
      ],
    ),
    sc(
      'a17-01-complete',
      [
        N('At dusk you take your boots off at Granny’s step.'),
        N('Supper is rice, pickles and fish.'),
        N('Cicadas stop buzzing. Frogs start. Ribbit! Ribbit!'),
        GR('The old house was empty for a long time. It will like children.'),
      ],
      [
        doit(
          2,
          'music',
          'clap a steady beat',
          'RL.2.4',
          'edu:clap:beat:frogs',
          [
            N('The frogs sing a steady song. Ribbit, ribbit, ribbit.'),
            N('(Clap a steady beat with the frogs. Ribbit, ribbit.)'),
          ],
          'Clapped a steady beat along with the frogs.',
        ),
      ],
    ),
  ],
);

// ================================================================== A17-2 Soot Sprites
const A2: EduQuest = quest(
  'a17-02',
  'Soot Sprites',
  {
    'a17-02-s1': {
      goal: 'Find the stairs to the dark room at the top of the house.',
      hint: 'The stairs are behind a plain door in the kitchen. Take a lantern up.',
    },
    'a17-02-s2': {
      goal: 'Ask Granny about the little black things.',
      hint: 'Granny is on the porch with her rags.',
    },
  },
  [
    sc(
      'a17-02-stairs',
      [
        SA('Where are the stairs? Please will you help us look?'),
        N('Your Nubbin finds a plain door in the kitchen.'),
        N('Behind it, steep stairs. At the top, only dark.'),
        N('You go up together with your lantern.'),
        N('Scritch, scratch! Little black things run away from the light.'),
        ME('I will catch one!'),
      ],
      [
        ask(
          3,
          'science',
          'we see when there is light',
          '1-PS4-2',
          [N('The stairs are dark. What helps you see?')],
          [
            o('A lantern, to make light.', [N('Yes! We see things when there is light.')], true),
            o('Closing my eyes.', [
              N('Eyes shut means no seeing.'),
              N('A lantern makes light, so we can see.'),
            ]),
            o('Going very fast.', [
              N('Fast feet make no light.'),
              N('A lantern makes light, so we can see.'),
            ]),
          ],
          'Chose light as the thing that lets us see in the dark.',
        ),
      ],
      [
        ch('lantern', 'Hold the lantern up high.', [N('Mei slaps her hands on the floor. Pat!')]),
        ch('still', 'Sit still and wait.', [N('A black thing peeps out. Mei pounces. Pat!')]),
      ],
    ),
    sc(
      'a17-02-stairs-done',
      [
        N('Mei holds up her hands. They are empty.'),
        N('But her hands are black. Her feet are black too.'),
        ME('I got its black on me!', 'happy'),
      ],
      [
        doit(
          1,
          'art',
          'name a colour and find it around you',
          'ELOF: Approaches to Learning',
          'edu:name:colour:black',
          [
            N('Mei has black hands. What colour is that?'),
            N('(Say it: black. Now find something black near you.)'),
          ],
          'Named the colour black and found a black thing nearby.',
        ),
      ],
    ),
    sc(
      'a17-02-granny',
      [
        N('Granny comes with rags and a bucket.'),
        ME('Obaa-chan! There are black things in our house!'),
        GR('Soot sprites. I saw them when I was little.'),
        GR('They like quiet, dusty houses. A cheerful house makes them go.'),
        ME('I will laugh. I am good at it!'),
        N('A boy looks over the hedge. It is Kanta. He puts a basket on the step.'),
        KA('Your house is haunted!'),
        N('He runs away, very fast. The basket stays.'),
      ],
      [
        ask(
          3,
          'sel',
          'a way to calm down when something feels a bit scary: laugh and share',
          'CASEL: Self-management',
          [GR('Something feels a little scary. What can we do?')],
          [
            o(
              'Laugh and sing with a friend.',
              [N('Yes! It makes scary things feel smaller.')],
              true,
            ),
            o('Run away and hide alone.', [
              N('Laughing with a friend helps a worry feel smaller.'),
            ]),
            o('Stay still and say nothing.', [
              N('Telling a friend, or laughing together, helps more.'),
            ]),
          ],
          'Thought of calming ways to feel braver: laughing and being with someone.',
        ),
      ],
      [
        ch('call', 'Call: “Thank you for the basket!”', [
          N('Kanta runs faster.'),
          GR('He has good manners. He keeps them hidden.'),
        ]),
        ch('laugh', 'Laugh. It is a lovely house.', [SA('It is! I always wanted one!', 'happy')]),
        ch('quiet', 'Pick up the basket.', [N('Inside are warm rice cakes.')]),
      ],
    ),
    sc(
      'a17-02-granny-done',
      [
        GR('Now, rags. Everybody gets one.'),
        N('Granny, Satsuki, Mei and you. One rag each.'),
        N('Then the scrubbing begins. Swish, swish!'),
      ],
      [
        doit(
          1,
          'maths',
          'count to 4',
          'K.CC.B.5',
          'edu:count:rags:4',
          [
            N('How many rags? Count them. Granny, Satsuki, Mei, you.'),
            N('(Count on your fingers: one, two, three, four.)'),
          ],
          'Counted four rags, one for each person.',
        ),
      ],
    ),
    sc(
      'a17-02-complete',
      [
        N('You all clean until dusk. The girls race the rags down the floor.'),
        N('Your Nubbin rinses a rag in the bucket. It sits in it.'),
        GR('A house with its windows open. That is more like it.'),
      ],
      [
        notice(
          2,
          'health',
          'fresh air and a clean room help us stay well',
          'ELOF: Perceptual, Motor, and Physical Development',
          [
            GR('Open windows let fresh air in.'),
            GR('Clean floors and fresh air help us feel well.'),
          ],
          'Learned that fresh air and a clean room help us stay healthy.',
        ),
      ],
    ),
  ],
);

// ================================================================== A17-3 The Bath in the Storm
const A3: EduQuest = quest(
  'a17-03',
  'The Bath in the Storm',
  {
    'a17-03-s1': {
      goal: 'Help shut the rain shutters before the storm.',
      hint: 'Pull each wooden shutter along until the house is closed.',
    },
    'a17-03-s2': {
      goal: 'Wait in the main room while the family has their bath.',
      hint: 'Sit by the low table. Join in when Mr Kusakabe calls.',
    },
    'a17-03-s3': {
      goal: 'Sit on Granny’s step and watch the hill.',
      hint: 'Go home through the hedge. Sit on the step and look up.',
    },
  },
  [
    sc(
      'a17-03-shutters',
      [
        N('The wind gets up. Whoosh! The rice fields go silver.'),
        GR('Go and help with the shutters.'),
        FA('One is stuck. Can you help?'),
        N('You lift it a little. Slide! It runs all the way along.'),
        N('The boards creak. The house groans like a ship.'),
        FA('The house is only stretching, Mei. Old houses do.'),
      ],
      [
        ask(
          3,
          'science',
          'a stuck thing may move when we lift and push in a better way',
          'K-2-ETS1-1',
          [N('The shutter is stuck. What can we try?')],
          [
            o(
              'Lift a little, then push.',
              [N('Yes! Trying a new way solves a stuck problem.')],
              true,
            ),
            o('Walk away.', [
              N('The shutter stays stuck.'),
              N('A new way, like lift and push, can fix it.'),
            ]),
            o('Pull the wrong way harder.', [
              N('Harder is not always better.'),
              N('Lifting a little and pushing works best.'),
            ]),
          ],
          'Chose a new way of lifting and pushing to solve a stuck shutter.',
        ),
      ],
    ),
    sc(
      'a17-03-shutters-done',
      [
        FA('Stay till the wind drops. The bath is nearly hot.'),
        N('Your Nubbin sits by the stove. Rattle! The shutters jump.'),
        N('Creak! Bang! The house makes lots of noises.'),
      ],
      [
        doit(
          2,
          'literacy',
          'sound words that copy noises: creak, rattle, bang',
          'RL.1.4',
          'edu:say:sound-words:creak',
          [
            N('The old house is noisy! Say the sounds with me.'),
            N('(Say them in a big voice: creak, rattle, bang.)'),
          ],
          'Said sound words that copy noises: creak, rattle and bang.',
        ),
      ],
    ),
    sc(
      'a17-03-bath',
      [
        N('The family has a bath at the back. You wait in the main room.'),
        N('A gust hits the house. Bang! The lamp swings.'),
        ME('Dad! I heard something!', 'shock'),
        FA('Do you know what to do? Laugh, as loud as you can!'),
        N('From the back comes a big, silly laugh. Ha ha ha!'),
      ],
      [
        ask(
          2,
          'sel',
          'telling a trusted grown-up when we feel scared',
          'CASEL: Relationship skills',
          [N('Mei heard a noise and felt scared. What did she do?')],
          [
            o(
              'She told her dad.',
              [N('Yes! Telling someone you trust is a good thing to do.')],
              true,
            ),
            o('She hid and said nothing.', [
              N('Hiding keeps the worry big.'),
              N('Mei told her dad, and that helped.'),
            ]),
            o('She ran out into the storm.', [
              N('Not safe! Mei told her dad.'),
              N('Telling a grown-up is brave.'),
            ]),
          ],
          'Noticed that telling a trusted adult helps when we feel scared.',
        ),
      ],
      [
        ch('loud', 'Laugh as loud as you can.', [
          N('You laugh. It sounds so silly, you laugh more.'),
        ]),
        ch('nubbin', 'Tickle your Nubbin.', [N('Your Nubbin squeaks and rolls. Everyone laughs.')]),
        ch('honk', 'Try to laugh. Out comes a honk.', [ME('Do it again!', 'happy')]),
      ],
    ),
    sc(
      'a17-03-bath-done',
      [
        N('The wind blows on. Inside, nobody minds any more.'),
        N('Mei comes out pink and warm in a towel.'),
        N('She falls asleep on the floor. Snore!'),
      ],
      [
        notice(
          1,
          'health',
          'a warm bath makes us clean and sleepy, and sleep helps us grow',
          'ELOF: Perceptual, Motor, and Physical Development',
          [
            N('A warm bath makes you clean. It makes you sleepy too.'),
            N('When you sleep, your body rests and grows.'),
          ],
          'Learned that a warm bath cleans us, and that sleep helps our bodies rest and grow.',
        ),
      ],
    ),
    sc(
      'a17-03-moon',
      [
        N('The wind is gone. The Moon is up. The fields are wet and shiny.'),
        N('You sit on Granny’s step. Your Nubbin looks at the old house.'),
        N('Soft black things float up from the eaves. Up, up, up the hill.'),
        N('Satsuki sees you. She lifts her hand.'),
      ],
      [
        notice(
          1,
          'science',
          'the Moon does not make its own light; the Sun lights it up',
          '1-ESS1-1',
          [
            N('Look at the Moon. It does not make its own light.'),
            N('The Sun lights it up, like a torch shining on a ball.'),
          ],
          'Learned that the Moon shines because the Sun lights it.',
        ),
      ],
      [
        ch('wave', 'Lift your hand back.', [N('You both nod. You keep the secret.')]),
        ch('point', 'Point up at the tree.', [N('Satsuki nods. You both know.')]),
      ],
    ),
    sc(
      'a17-03-complete',
      [
        N('The last little black thing goes into the dark tree.'),
        GR('Still up? They have gone. They will find another empty house.', 'soft'),
        N('Granny brings barley tea. She sits with you and says nothing.'),
      ],
      [
        notice(
          2,
          'sel',
          'sitting quietly beside someone is a kind thing to do',
          'CASEL: Social awareness',
          [
            N('Granny does not talk. She just sits beside you.'),
            N('Sometimes being close is the kindest thing.'),
          ],
          'Noticed that sitting quietly beside someone can be a kindness.',
        ),
      ],
    ),
  ],
);

// ================================================================== A17-4 The Hospital
const A4: EduQuest = quest(
  'a17-04',
  'The Hospital',
  {
    'a17-04-s1': {
      goal: 'Ride bicycles with the family to the hospital.',
      hint: 'Borrow Granny’s bicycle. Follow Mr Kusakabe along the road.',
    },
    'a17-04-s2': {
      goal: 'Go in with the family to see Mrs Kusakabe.',
      hint: 'Follow them down the long corridor to the last room.',
    },
    'a17-04-s3': {
      goal: 'Wait in the corridor so the family can be together.',
      hint: 'Sit on the bench outside the door. They will come out.',
    },
  },
  [
    sc(
      'a17-04-ride',
      [
        FA('We are visiting their mum today. Would you like to come?'),
        N('Granny lends you her bicycle. Squeak, squeak, squeak!'),
        N('The road goes past the fields and a pond. Frogs everywhere.'),
        ME('Faster, Dad! Faster than the Keeper!', 'happy'),
      ],
      [
        ask(
          3,
          'science',
          'a bicycle goes faster downhill and needs more push uphill',
          'ELOF: Scientific Reasoning',
          [N('Which way is easier on a bike: down the hill, or up?')],
          [
            o(
              'Down the hill.',
              [N('Yes! The hill helps you roll, whoosh! Uphill needs lots of push.')],
              true,
            ),
            o('Up the hill.', [
              N('Uphill is hard work. Pedal, pedal, puff!'),
              N('Down the hill is easier.'),
            ]),
          ],
          'Compared riding downhill and uphill: downhill is easier.',
        ),
      ],
      [
        ch('race', 'Race them to the top.', [N('Mr Kusakabe wins by a wheel. Then he puffs.')]),
        ch('slow', 'Ride slowly and let them win.', [N('Mei shouts happily all the way down.')]),
      ],
    ),
    sc(
      'a17-04-ride-done',
      [
        N('The hospital is long and white, among pine trees.'),
        N('All its windows are open.'),
        SA('Mum’s window is the third one. Mei, walk!'),
        N('Mei runs.'),
      ],
      [
        doit(
          1,
          'literacy',
          'clap the three beats in hospital',
          'RF.K.2',
          'edu:clap:syllables:hospital',
          [
            N('This is a hospital. Clap its beats: hos-pi-tal.'),
            N('(Clap three times: hos, pi, tal.)'),
          ],
          'Clapped the three syllables in the word hospital.',
        ),
      ],
    ),
    sc(
      'a17-04-room',
      [
        N('Mrs Kusakabe sits up in bed by the window. She looks tired and kind.'),
        ME('Mum!', 'happy'),
        MO('Mei! Satsuki! Come here, both of you.', 'happy'),
        N('Mei climbs on the bed. Satsuki holds her mum’s hand.'),
        MO('The nurses and doctors are looking after me. I am getting better.'),
      ],
      [
        ask(
          4,
          'sel',
          'naming the feeling of missing someone, and what helps',
          'CASEL: Self-awareness',
          [N('Mei and Satsuki miss their mum. What helps when we miss someone?')],
          [
            o('A big hug.', [N('Yes! A hug is a good help.')], true),
            o('Talking about them.', [N('Yes! Talking about someone helps too.')], true),
            o('Pretend we do not miss them.', [
              N('Missing someone is okay. A hug helps.'),
              N('So does talking about them.'),
            ]),
          ],
          'Named missing someone as a real feeling, and chose hugs and talking as help.',
        ),
      ],
    ),
    sc(
      'a17-04-room-done',
      [
        MO('Soon I will come home for a weekend. Then a little longer.', 'soft'),
        N('Your Nubbin puts its chin on the bed.'),
        N('Mrs Kusakabe strokes its head.'),
      ],
      [
        notice(
          0,
          'health',
          'rest, good food and kind helpers all help a body get well',
          'ELOF: Perceptual, Motor, and Physical Development',
          [
            N('Mrs Kusakabe is resting. Rest helps a body get well.'),
            N('Nurses, doctors, good food and sleep help too.'),
          ],
          'Learned that rest, food and caring helpers all help a body get well.',
        ),
      ],
    ),
    sc(
      'a17-04-corridor',
      [
        N('You sit on the bench outside the door.'),
        N('Through the gap you see the window and the pine trees.'),
        MO('You have been looking after everyone. I will take a turn.', 'soft'),
        N('Satsuki shuts her eyes. A nurse goes by and smiles.'),
      ],
      [
        ask(
          1,
          'sel',
          'giving a family private time to be together',
          'CASEL: Social awareness',
          [N('The family wants a quiet moment together. What does the Keeper do?')],
          [
            o('Wait outside, quietly.', [N('Yes! Waiting gives them space to be together.')], true),
            o('Go back in and chatter.', [
              N('Chattering would break their quiet moment.'),
              N('Waiting outside gives them space.'),
            ]),
          ],
          'Understood that giving people quiet time together is kind.',
        ),
      ],
      [
        ch('wait', 'Keep waiting. There is no hurry.', [
          N('The corridor smells of soap. A clock ticks.'),
        ]),
        ch('door', 'Pull the door gently shut.', [N('Behind it you hear laughing.')]),
      ],
    ),
    sc(
      'a17-04-complete',
      [
        N('On the way home it is uphill. Everybody walks the bicycles.'),
        N('Mei sleeps on the seat. Her dad keeps a hand on her back.'),
        SA('She looked better. Didn’t she?'),
        FA('She did. Much better.', 'soft'),
      ],
      [
        doit(
          1,
          'maths',
          'count to 4: wheels on two bicycles',
          'K.CC.B.5',
          'edu:count:bike-wheels:4',
          [
            N('Two bicycles are walking home. Count the wheels.'),
            N('(One bicycle has two wheels. Count them all: one, two, three, four.)'),
          ],
          'Counted the four wheels on two bicycles.',
        ),
      ],
    ),
  ],
);

// ================================================================== A17-5 The Small Ones
const A5: EduQuest = quest(
  'a17-05',
  'The Small Ones',
  {
    'a17-05-s1': {
      goal: 'Keep an eye on Mei in the garden.',
      hint: 'Sit at the edge of the garden. Mei will find something first.',
    },
    'a17-05-s2': {
      goal: 'Crawl after Mei through the tunnel in the hedge.',
      hint: 'Get down low. Follow Mei’s yellow hat.',
    },
  },
  [
    sc(
      'a17-05-garden',
      [
        FA('Please watch Mei for me. I am just in here, with my books.'),
        N('Mei is picking up acorns in a tin bucket. She has three.'),
        N('Your Nubbin gives her two more.'),
        N('Then your Nubbin stops. Something small and white walks through the grass.'),
        N('A bigger blue one follows. It has a little sack of acorns.'),
        ME('Oh! Wait for me!'),
      ],
      [
        notice(
          2,
          'science',
          'acorns are the seeds of oak trees',
          'ELOF: Scientific Reasoning',
          [
            N('Mei has five acorns. An acorn is a seed.'),
            N('It is the seed of an oak tree. A tiny oak can grow from it!'),
          ],
          'Learned that an acorn is the seed of an oak tree.',
        ),
      ],
      [
        ch('call', 'Call to Mr Kusakabe.', [
          Y('Mr Kusakabe! Mei is following something!'),
          FA('Is she? Good for her.'),
          N('He does not look up, and turns a page. Mei is nearly at the hedge.'),
        ]),
        ch('follow', 'Follow quietly.', [N('You tiptoe. The small ones walk a little faster.')]),
      ],
    ),
    sc(
      'a17-05-garden-done',
      [
        N('The small ones go under the house and out the other side.'),
        N('Into the hedge they go.'),
        ME('They went in there! There is a tunnel!'),
      ],
      [
        ask(
          1,
          'maths',
          'where things are: under, through, in',
          'K.G.A.1',
          [N('The small ones went under the house. Where did they go?')],
          [
            o('Under the house.', [N('Yes! Under means below.')], true),
            o('On top of the roof.', [
              N('On top is up high. They went down low.'),
              N('They went under the house.'),
            ]),
          ],
          'Used position words: under, in and through.',
        ),
      ],
    ),
    sc(
      'a17-05-hedge',
      [
        N('A low gap in the hedge, round like a door.'),
        N('Inside is a green tunnel with a leafy roof.'),
        N('Mei goes in first. Your Nubbin goes next. Then you.'),
        N('Mei’s yellow hat bobs out into the sunshine.'),
      ],
      [
        notice(
          3,
          'sel',
          'telling a grown-up where we are going keeps us safe',
          'CASEL: Responsible decision-making',
          [
            N('Mei followed the small ones very fast.'),
            N('It is safer to tell a grown-up where you are going.'),
            N('Then they will know where to find you.'),
          ],
          'Learned that telling a grown-up where we are going is a safe choice.',
        ),
      ],
      [
        ch('hurry', 'Hurry after her.', [N('The tunnel stretches. You pop out on soft moss.')]),
        ch('nubbin', 'Let your Nubbin lead.', [
          N('Its tail knows the way. You pop out on soft moss.'),
        ]),
      ],
    ),
    sc(
      'a17-05-complete',
      [
        N('You are in an old, quiet wood. Long lines of light come down.'),
        N('A tree root is as wide as a road. Above it, the camphor tree goes up and up.'),
        N('Mei’s hat is on the moss. Mei is not in it.'),
      ],
      [
        notice(
          1,
          'science',
          'roots take water from the ground and hold the tree up',
          'K-LS1-1',
          [
            N('The roots go down into the ground.'),
            N('They drink water. They hold the tree up too.'),
          ],
          'Learned that roots drink water from the ground and hold a tree up.',
        ),
      ],
    ),
  ],
);

// ================================================================== A17-6 The Camphor Tree
const A6: EduQuest = quest(
  'a17-06',
  'The Camphor Tree',
  {
    'a17-06-s1': {
      goal: 'Find Mei under the camphor tree.',
      hint: 'Look between the roots for a way in.',
    },
    'a17-06-s2': {
      goal: 'Help Satsuki and her dad look for the way Mei went.',
      hint: 'Go back to the hedge with the family. Mei will show you.',
    },
    'a17-06-s3': {
      goal: 'Walk up the hill with the family to the camphor tree.',
      hint: 'Follow the path up past the little shrine. Stand with the others.',
    },
  },
  [
    sc(
      'a17-06-hollow',
      [
        N('Your Nubbin finds a gap between two roots.'),
        N('You slide down into a warm, dim hollow. It smells of earth and leaves.'),
        N('Something big is breathing. In. Out. In. Out.'),
        N('A great grey-and-white shape is fast asleep.'),
        N('Mei lies on his tummy. It goes up and down.'),
        ME('Shh. He is asleep. He is so soft.', 'happy'),
      ],
      [
        doit(
          2,
          'health',
          'slow breathing: belly goes up and down',
          'ELOF: Perceptual, Motor, and Physical Development',
          'edu:breathe:belly:3',
          [
            N('Listen to the big sleeper breathe. In. Out.'),
            N('(Hand on your tummy. Breathe in slowly, then out, three times.)'),
          ],
          'Practised three slow belly breaths.',
        ),
      ],
      [
        ch('sit', 'Sit and watch.', [N('You sit on a root. Your eyes close for a moment.')]),
        ch('touch', 'Touch his fur.', [N('It is soft like warm grass. Your eyes close.')]),
      ],
    ),
    sc(
      'a17-06-hollow-done',
      [
        N('You wake up on soft moss in a green clearing.'),
        N('Mei is asleep beside you. Gold light shines through the leaves.'),
        N('The tree root is gone. Your Nubbin looks all around.'),
      ],
      [
        ask(
          1,
          'art',
          'yellow and blue paint make green',
          'ELOF: Approaches to Learning',
          [N('The clearing is green and gold. Which two paints make green?')],
          [
            o('Blue and yellow.', [N('Yes! Blue and yellow together make green.')], true),
            o('Red and pink.', [
              N('Red and pink make a deeper pink.'),
              N('Blue and yellow make green.'),
            ]),
          ],
          'Learned that mixing blue and yellow makes green.',
        ),
      ],
    ),
    sc(
      'a17-06-found',
      [
        SA('Mei! There you are! Dad, they are here!', 'shock'),
        ME('There was a big one! Bigger than the house!'),
        N('Mei goes back to the hedge. Every gap leads to the garden.'),
        ME('It was here. I am not telling fibs.', 'sad'),
        FA('I believe you, Mei. Not many people are so lucky.', 'soft'),
      ],
      [
        ask(
          3,
          'sel',
          'listening kindly to a friend’s big story',
          'CASEL: Social awareness',
          [N('A friend tells you something very big and wonderful. What is a kind thing to do?')],
          [
            o(
              'Listen, and ask about it.',
              [N('Yes! Listening makes your friend feel heard.')],
              true,
            ),
            o('Laugh at them.', [
              N('Laughing can hurt feelings.'),
              N('Listening and asking is kinder.'),
            ]),
            o('Walk away.', [N('Then your friend feels alone.'), N('Listening is kinder.')]),
          ],
          'Chose to listen kindly when a friend shares a big story.',
        ),
      ],
    ),
    sc(
      'a17-06-found-done',
      [
        FA('When someone lets you visit, you say thank you.'),
        FA('Come on. All of us.'),
        N('Mei takes your hand. Off you go, up the hill.'),
      ],
      [
        doit(
          1,
          'literacy',
          'say arigatō, thank you in Japanese',
          'ELOF: Language and Communication',
          'edu:say:word:arigato',
          [
            N('In Japanese, thank you is arigatō.'),
            N('(Say it together in a whisper: a-ri-ga-tō.)'),
            N('(Now say it big: a-ri-ga-tō!)'),
          ],
          'Said arigatō, the Japanese word for thank you.',
        ),
      ],
    ),
    sc(
      'a17-06-greet',
      [
        N('A path goes up the hill, past a little stone shrine.'),
        N('It leads to the great tree.'),
        N('A thick rope of twisted straw goes round its trunk.'),
        SA('Dad, why does it have a rope?'),
        FA('Because it is a very old, special tree. People look after it.'),
        N('The family bows to the tree. You stand behind them.'),
        FA('Thank you for looking after Mei.'),
      ],
      [
        notice(
          2,
          'social-studies',
          'in Japan a rope on a very old tree shows it is special and should be looked after',
          'D2.Civ.8.K-2',
          [
            N('In Japan, a rope round a very old tree shows it is special.'),
            N('People look after it with respect.'),
          ],
          'Learned that in Japan a rope on a very old tree shows it is special, and people look after it.',
        ),
      ],
      [
        ch(
          'hunt',
          'Go back and hunt for the tunnel.',
          [N('You search the hedge gap by gap. It is just a hedge.')],
          { 'a17-tunnel': 'hunt' },
        ),
        ch(
          'wait',
          'Leave it. He will come when he wants.',
          [
            ME('He will come when he wants. Won’t he?'),
            N('Your Nubbin sits and waits on purpose.'),
          ],
          { 'a17-tunnel': 'wait' },
        ),
      ],
    ),
    sc(
      'a17-06-complete',
      [
        N('That night you can see the camphor tree against the stars.'),
        ME('The big one was this big! No, this big!'),
        N('Every time Mei tells it, the spirit gets a bit bigger.'),
        GR('A big one, was it? Hm.', 'think'),
      ],
      [
        doit(
          1,
          'literacy',
          'tell a story in order: first, next, last',
          'RL.K.3',
          'edu:order:story:mei-and-the-tree',
          [
            N('Mei tells her story. First, a tunnel. Next, the big sleeper. Last, a nap.'),
            N('(Tell the story back: first, next, last.)'),
          ],
          'Retold a story in order: first, next, last.',
        ),
      ],
    ),
  ],
);

// ================================================================== A17-7 Kanta’s Umbrella
const A7: EduQuest = quest(
  'a17-07',
  'Kanta’s Umbrella',
  {
    'a17-07-s1': {
      goal: 'Walk home from school with Satsuki and Mei.',
      hint: 'Meet them at the school gate. Take the road between the fields.',
    },
    'a17-07-s2': {
      goal: 'Help give Kanta his umbrella back, kindly.',
      hint: 'Talk about it. Then take the umbrella to Granny’s.',
    },
  },
  [
    sc(
      'a17-07-rain',
      [
        N('Rain! It comes all at once. Splash, splash, splash!'),
        N('By the road is a tiny wooden shrine. A small stone statue stands inside.'),
        SA('Please may we shelter here a little while?'),
        N('Satsuki bows to the statue. You bow too.'),
        N('Kanta runs up with a big black umbrella. He pushes it at Satsuki.'),
        KA('Here.', 'angry'),
        N('He runs off into the rain with no cover at all.'),
      ],
      [
        notice(
          3,
          'social-studies',
          'Jizo statues watch over children and travellers; we ask politely and are respectful',
          'D2.Civ.8.K-2',
          [
            N('The small statue is called Jizo. He watches over children and travellers.'),
            N('Satsuki asks politely. Being polite is a way of showing respect.'),
          ],
          'Learned about Jizo, who watches over children and travellers, and how Satsuki shows respect.',
        ),
      ],
    ),
    sc(
      'a17-07-rain-done',
      [
        N('The umbrella is old, with a patch and a little hole.'),
        ME('Kanta’s house is haunted too.'),
        SA('Mei.'),
      ],
      [
        ask(
          1,
          'science',
          'a cloth umbrella keeps rain out because water cannot get through it',
          '2-PS1-1',
          [N('Which keeps the rain off best?')],
          [
            o(
              'Umbrella cloth.',
              [N('Yes! Rain cannot get through cloth that is made for rain.')],
              true,
            ),
            o('A sponge.', [N('A sponge soaks water up.'), N('Umbrella cloth keeps rain out.')]),
            o('A net.', [
              N('Water runs right through a net.'),
              N('Umbrella cloth keeps rain out.'),
            ]),
          ],
          'Compared materials and chose the one that keeps rain out.',
        ),
      ],
    ),
    sc(
      'a17-07-return',
      [
        N('The rain has stopped. The umbrella is dry and folded.'),
        SA('We must give it back. But Kanta gets shy.', 'think'),
        ME('I will say thank you very loudly!'),
        SA('That is what we cannot do.'),
        SA('Keeper, what do we do?'),
      ],
      [
        ask(
          3,
          'sel',
          'saying thank you in a gentle way that does not embarrass someone',
          'CASEL: Social awareness',
          [N('How can they thank shy Kanta kindly?')],
          [
            o('Leave a kind note.', [N('Yes! A note lets him feel proud, not shy.')], true),
            o('Shout it in the street.', [
              N('That would make him very shy.'),
              N('A quiet note is gentler.'),
            ]),
            o('Say nothing at all.', [
              N('Then he would not know.'),
              N('A kind note says thank you gently.'),
            ]),
          ],
          'Chose a gentle way of saying thank you to someone who is shy.',
        ),
      ],
      [
        ch('stand', 'Put it in Granny’s stand with a note.', [
          N('The note says Thank you. Next day it is gone.'),
        ]),
        ch('granny', 'Give it to Granny.', [GR('He did, did he? The daft boy.', 'happy')]),
        ch('satsuki', 'Let Satsuki give it back.', [
          SA('Thank you. It was very kind.'),
          KA('S’all right.'),
        ]),
      ],
    ),
    sc(
      'a17-07-complete',
      [
        N('Next time it rains, the umbrella goes to school.'),
        N('Kanta holds it a little to one side. One person under it. One space beside.'),
        GR('That boy would give you the coat off his back.', 'happy'),
      ],
      [
        doit(
          1,
          'maths',
          'add one and one to make two',
          'K.OA.A.1',
          'edu:add:umbrella-people:2',
          [
            N('One child under the umbrella. One more steps in.'),
            N('(Hold up one finger, then one more. How many in all?)'),
            N('Two!'),
          ],
          'Added one and one to make two.',
        ),
      ],
    ),
  ],
);

// ================================================================== A17-8 Granny’s Field
const A8: EduQuest = quest(
  'a17-08',
  'Granny’s Field',
  {
    'a17-08-s1': {
      goal: 'Pick vegetables in Granny’s field.',
      hint: 'Pick from the rows by the stream. Then cool them in the water.',
    },
    'a17-08-s2': {
      goal: 'Listen to Satsuki’s letter to her mum.',
      hint: 'Sit with Satsuki at the low table.',
    },
  },
  [
    sc(
      'a17-08-field',
      [
        N('Granny’s field runs down to a stream. Tomatoes! Cucumbers! Tall corn!'),
        GR('Fresh vegetables are good for everyone.'),
        N('Mei sniffs a tomato. It smells of sunshine.'),
        N('The girls cool the vegetables in the stream.'),
        ME('This corn is for Mum. Only this one.', 'think'),
      ],
      [
        ask(
          2,
          'science',
          'plants need sun and water to grow',
          '2-LS2-1',
          [N('What helped these tomatoes grow big?')],
          [
            o('Sunshine and water.', [N('Yes! Plants need light and water.')], true),
            o('Only a loud shout.', [
              N('Plants cannot hear shouting.'),
              N('Sunshine and water help them grow.'),
            ]),
          ],
          'Learned that plants need sunshine and water to grow.',
        ),
      ],
      [
        ch('corn', 'Help Mei pull her corn.', [ME('Got it! For Mum!', 'happy')]),
        ch('cucumber', 'Pick the straightest cucumber.', [N('Granny nods. That is a medal.')]),
        ch('tomato', 'Eat a tomato off the plant.', [GR('That is what they are for.', 'happy')]),
      ],
    ),
    sc(
      'a17-08-field-done',
      [
        N('Mei carries her ear of corn home herself.'),
        N('She holds it in both arms, like a baby.'),
        N('Nobody else may hold it.'),
      ],
      [
        notice(
          1,
          'sel',
          'feeling proud when we carry a gift ourselves',
          'CASEL: Self-awareness',
          [
            N('Mei feels proud. She carries her gift all by herself.'),
            N('Pride feels warm and big, like a hug inside.'),
          ],
          'Named pride as a feeling: Mei is proud to carry her gift herself.',
        ),
      ],
    ),
    sc(
      'a17-08-letter',
      [
        N('Satsuki is writing a letter to her mum.'),
        SA('Dear Mum. Mei has met a spirit. He is big and grey.'),
        SA('Please get better soon. I miss you.', 'soft'),
        N('Mei has drawn a picture at the bottom.'),
      ],
      [
        doit(
          1,
          'literacy',
          'hear the first sound in a name',
          'RF.K.2',
          'edu:say:first-sound:m',
          [
            N('Satsuki starts with S. Mei starts with M. Mum starts with M!'),
            N('(Say mmm. Which two names begin the same?)'),
            N('Mei and Mum!'),
          ],
          'Listened for the first sound: Mei and Mum both start with m.',
        ),
      ],
      [
        ch('right', 'Say it is right.', [SA('Really? Good.', 'happy')]),
        ch('line', 'Suggest saying how she is.', [N('Satsuki writes, I am fine and I miss you.')]),
        ch('nubbin', 'Ask if your Nubbin can be in it.', [ME('I will draw it!', 'happy')]),
      ],
    ),
    sc(
      'a17-08-complete',
      [
        N('In the morning you post the letter in a red box.'),
        ME('Will it go fast?'),
        SA('First the bus. Next the train. Last a man brings it.'),
        ME('I could go faster.', 'think'),
      ],
      [
        doit(
          2,
          'social-studies',
          'put the steps of a letter’s journey in order',
          'D2.His.2.K-2',
          'edu:order:letter:box-bus-train-carrier',
          [
            N('Long ago, few homes had a phone. People wrote letters.'),
            N('(Say it: box, bus, train, then a man brings it.)'),
          ],
          'Put a letter’s journey in order: box, bus, train, person.',
        ),
      ],
    ),
  ],
);

// ================================================================== A17-9 The Bus Stop in the Rain
const A9: EduQuest = quest(
  'a17-09',
  'The Bus Stop in the Rain',
  {
    'a17-09-s1': {
      goal: 'Take umbrellas to the bus stop with Satsuki and Mei.',
      hint: 'Carry Granny’s lantern. Walk down the dark road with the girls.',
    },
    'a17-09-s2': {
      goal: 'Keep waiting at the bus stop in the rain.',
      hint: 'Stand still beside Satsuki. Something is coming.',
    },
    'a17-09-s3': {
      goal: 'Watch what comes along the dark road.',
      hint: 'Stay at the bus stop. Hold the lantern up.',
    },
  },
  [
    sc(
      'a17-09-walk',
      [
        N('Rain, rain, rain! Mr Kusakabe went to work with no umbrella.'),
        SA('We will take Dad’s umbrella to the bus stop.'),
        N('Satsuki has her umbrella and her dad’s. Mei has a small one.'),
        N('You carry the lantern. Your Nubbin hides under Mei’s umbrella.'),
        N('A bus comes. Nobody gets off. It drives away.'),
        SA('He will be on the next one.'),
      ],
      [
        doit(
          2,
          'maths',
          'count to 3',
          'K.CC.B.5',
          'edu:count:umbrellas:3',
          [
            N('How many umbrellas? Satsuki’s, her dad’s, and Mei’s.'),
            N('(Point and count: one, two, three.)'),
          ],
          'Counted three umbrellas.',
        ),
      ],
      [
        ch('wait', 'Wait with them.', [
          N('You wait. There is nothing else to do, so you do it well.'),
        ]),
        ch('offer', 'Offer to take Mei home.', [ME('No! I am waiting for Dad!', 'angry')]),
      ],
    ),
    sc(
      'a17-09-walk-done',
      [
        N('The next bus is a long time coming.'),
        N('Mei gets heavier and sleepier.'),
        N('Satsuki lifts her on to her back.'),
      ],
      [
        ask(
          1,
          'sel',
          'helping a tired little one with a kind act',
          'CASEL: Relationship skills',
          [N('Mei is very tired. How does Satsuki help?')],
          [
            o(
              'She carries Mei on her back.',
              [N('Yes! A kind helper makes a tired child feel safe.')],
              true,
            ),
            o('She leaves Mei on the road.', [
              N('Not safe! Satsuki carries Mei.'),
              N('That is how we look after people.'),
            ]),
          ],
          'Noticed Satsuki caring for her tired sister.',
        ),
      ],
    ),
    sc(
      'a17-09-wait',
      [
        N('Mei is asleep. The rain drips, drips, drips.'),
        N('Your Nubbin slowly turns its head.'),
        N('Next to Satsuki stands something huge and grey, with a leaf on its head.'),
        N('It looks at the dark road, like people at a bus stop.'),
        N('Then it looks at you. It blinks, once, very slowly.'),
      ],
      [
        doit(
          0,
          'music',
          'clap a steady beat like drips',
          'RL.2.4',
          'edu:clap:beat:rain',
          [
            N('Listen. Drip. Drip. Drip. The rain makes a steady beat.'),
            N('(Clap the beat with the rain: drip, drip, drip.)'),
          ],
          'Clapped a steady beat to match the dripping rain.',
        ),
      ],
      [
        ch('nod', 'Nod, like to a neighbour.', [N('His whiskers move. Maybe a nod back.')]),
        ch('still', 'Stand still and let him look.', [
          N('He looks at you, and you look at him. Nobody blinks.'),
          N('Then he blinks again, very slowly. You win!'),
        ]),
      ],
    ),
    sc(
      'a17-09-wait-done',
      [
        N('Satsuki holds up her dad’s umbrella over the great one.'),
        N('A drop falls on it. Tok!'),
        N('Then the drops in every tree fall at once. Tok, tok, tok!'),
        N('He leaps with joy. A happy roar goes through you like warm wind.'),
      ],
      [
        notice(
          1,
          'science',
          'a hit makes things shake, and shaking makes sound',
          '1-PS4-1',
          [
            N('Tok! A drop hits the umbrella. The cloth shakes a tiny bit.'),
            N('When things shake, they make sound.'),
          ],
          'Learned that when something is hit it shakes, and shaking makes sound.',
        ),
      ],
    ),
    sc(
      'a17-09-catbus',
      [
        N('He gives Satsuki a little bundle tied with grass.'),
        N('Two lights come bounding through the wood. Yellow, like lamps.'),
        N('It is a bus. It is also a cat! It grins.'),
        N('A sign on top flickers with words.'),
        N('The great one climbs in. Whoosh! It bounds away over the trees.'),
      ],
      [
        doit(
          3,
          'literacy',
          'the first sound in bus',
          'RF.K.2',
          'edu:say:first-sound:b',
          [
            N('A bus with a cat’s grin! Say bus. Bus starts with b, b, b.'),
            N('(What else starts with b?)'),
            N('Bear, ball, banana!'),
          ],
          'Listened for the first sound b in the word bus.',
        ),
      ],
      [
        ch('satsuki', 'Look at Satsuki.', [SA('You saw it too!', 'shock')]),
        ch('bundle', 'Look at the bundle.', [N('It smells of green things and earth.')]),
      ],
    ),
    sc(
      'a17-09-catbus-done',
      [
        N('A plain bus comes round the bend. Mr Kusakabe gets off.'),
        FA('All of you? In this rain? Why do you all look like that?'),
      ],
      [
        ask(
          1,
          'sel',
          'sharing something wonderful with someone you trust',
          'CASEL: Relationship skills',
          [N('You saw something wonderful. What can you do?')],
          [
            o(
              'Tell Dad all about it.',
              [N('Yes! Sharing a happy thing makes it even bigger.')],
              true,
            ),
            o('Keep it a secret forever.', [
              N('Secrets are fun for a while.'),
              N('Sharing with someone you trust feels lovely.'),
            ]),
          ],
          'Thought about sharing a happy discovery with someone trusted.',
        ),
      ],
    ),
    sc(
      'a17-09-complete',
      [
        N('The girls tell their dad all the way home.'),
        FA('Took my umbrella, did he? He is welcome. It leaked.', 'happy'),
        N('At Granny’s door, your Nubbin finds a big leaf. It wears it like a hat.'),
        N('It will not take it off for supper.'),
      ],
      [
        doit(
          2,
          'art',
          'draw a leaf shape',
          'ELOF: Approaches to Learning',
          'edu:draw:leaf',
          [
            N('Your Nubbin’s leaf hat is long and round, with a point.'),
            N('(Draw a leaf in the air. Round and wide, with a pointy tip.)'),
          ],
          'Drew the shape of a leaf in the air.',
        ),
      ],
    ),
  ],
);

// ================================================================== A17-10 The Seeds
const A10: EduQuest = quest(
  'a17-10',
  'The Seeds',
  {
    'a17-10-s1': {
      goal: 'Open the bundle with the family.',
      hint: 'Sit at the low table while Satsuki unties the grass.',
    },
    'a17-10-s2': {
      goal: 'Plant the seeds in the garden. Then wait.',
      hint: 'Dig a bed by the house. Plant every seed. Mark the place.',
    },
  },
  [
    sc(
      'a17-10-bundle',
      [
        N('Everyone sits at the low table. Satsuki unties the grass.'),
        N('Inside are nuts and acorns. Five acorns!'),
        ME('Acorns! He gave us acorns!', 'happy'),
        FA('Seeds are a promise. You must keep your side.'),
        N('Your Nubbin sniffs every one.'),
      ],
      [
        doit(
          1,
          'maths',
          'count five acorns, one for each number',
          'K.CC.B.4',
          'edu:count:acorns:5',
          [
            N('Mei counts, “One, two, five, nine!” That is not quite right.'),
            N('(Help her count each acorn once: one, two, three, four, five.)'),
          ],
          'Counted five acorns, matching one number to each.',
        ),
      ],
      [
        ch('count', 'Help Mei count them.', [
          ME('One, two, five!', 'think'),
          SA('Mei! One, two, three…'),
        ]),
        ch('smell', 'Smell the leaves.', [N('They smell of the great tree. Clean and sharp.')]),
      ],
    ),
    sc(
      'a17-10-bundle-done',
      [
        SA('We will make a seed bed in the garden.'),
        SA('Will you help dig?'),
        N('Many hands. Dig, dig, dig!'),
      ],
      [
        notice(
          1,
          'sel',
          'working together makes a big job lighter',
          'CASEL: Relationship skills',
          [
            N('Digging a bed is hard for one person.'),
            N('With many helping hands it is quicker, and more fun.'),
          ],
          'Noticed that teamwork makes a hard job lighter.',
        ),
      ],
    ),
    sc(
      'a17-10-plant',
      [
        N('You dig a bed in the sun. Satsuki plants in rows. Mei plants in clumps.'),
        N('Your Nubbin pats the earth down.'),
        ME('Now they grow.'),
        N('They do not. Mei squats and waits. Your Nubbin squats too.'),
        N('Nothing comes up. Not today. Not tomorrow.'),
      ],
      [
        ask(
          3,
          'science',
          'seeds need soil, water, light and time',
          'K-LS1-1',
          [N('What do seeds need to grow?')],
          [
            o(
              'Soil, water, sun and time.',
              [N('Yes! And time is the part we must wait for.')],
              true,
            ),
            o('Only a big shout.', [
              N('Seeds cannot hear shouts.'),
              N('Soil, water, sun and time help seeds grow.'),
            ]),
            o('Nothing at all.', [
              N('Seeds need help to grow.'),
              N('Soil, water, sun and time help them.'),
            ]),
          ],
          'Learned that seeds need soil, water, sun and time to grow.',
        ),
      ],
      [
        ch('sign', 'Make a sign for the bed.', [
          N('SEEDS, PLEASE DON’T STEP. Mei draws the spirit.'),
        ]),
        ch('stones', 'Ring the bed with white stones.', [N('Mei counts them, her way.')]),
        ch('squat', 'Squat down and wait with them.', [
          N('Three of you now. The waiting is better company.'),
        ]),
      ],
    ),
    sc(
      'a17-10-complete',
      [
        FA('Seeds take their time. Most good things do.', 'soft'),
        ME('He would make them grow. If he came.'),
        N('That night your Nubbin sits at the window. It looks at the old house.'),
      ],
      [
        ask(
          1,
          'sel',
          'waiting is hard, and we can wait kindly and calmly',
          'CASEL: Self-management',
          [N('Waiting is hard. What can we do while we wait?')],
          [
            o(
              'Sing, draw or look at the sky.',
              [N('Yes! Doing something calm helps waiting go by.')],
              true,
            ),
            o('Shout at the seeds.', [
              N('Seeds do not hear shouts.'),
              N('Singing or drawing helps us wait.'),
            ]),
          ],
          'Chose calm things to do while waiting.',
        ),
      ],
    ),
  ],
);

// ================================================================== A17-11 The Night Dance
const A11: EduQuest = quest(
  'a17-11',
  'The Night Dance',
  {
    'a17-11-s1': {
      goal: 'Follow your Nubbin to the seed bed at midnight.',
      hint: 'Go quietly through the hedge to the old house garden.',
    },
    'a17-11-s2': {
      goal: 'Dance round the seed bed.',
      hint: 'Follow the great one. Arms up. Bend. Arms up. Bend.',
    },
    'a17-11-s3': {
      goal: 'Hold on tight and ride up into the night.',
      hint: 'Climb on behind the girls. Hold on to the soft fur.',
    },
  },
  [
    sc(
      'a17-11-midnight',
      [
        N('Pat, pat. Your Nubbin pats your face. It is the middle of the night.'),
        N('The Moon is round and bright.'),
        N('In the old house garden, three spirits walk round the seed bed.'),
        N('Satsuki and Mei come out in their nightclothes.'),
        ME('He came! Onee-chan, he came!', 'happy'),
      ],
      [
        notice(
          1,
          'science',
          'the Moon looks round at full moon and changes shape over the weeks',
          '1-ESS1-1',
          [
            N('Tonight the Moon is round, like a big plate.'),
            N('Over the next days it will look smaller and smaller.'),
            N('Then it grows round again.'),
          ],
          'Learned that the Moon changes shape over weeks and is sometimes round.',
        ),
      ],
      [
        ch('join', 'Join the line.', [N('You join the end of the line.')]),
        ch('girls', 'Wait for the girls, then join.', [N('Mei takes your hand and pulls you in.')]),
      ],
    ),
    sc(
      'a17-11-dance',
      [
        N('Round the bed you go. Arms up. Bend. Arms up. Bend.'),
        N('A shoot comes up. Then another. Then lots!'),
        N('They twist and grow. A sapling, then a tree.'),
        N('It grows as tall as the great tree on the hill.'),
        SA('We did it!', 'happy'),
      ],
      [
        ask(
          1,
          'maths',
          'continue a simple pattern',
          'ELOF: Mathematics Development',
          [N('Arms up, bend. Arms up, bend. What comes next?')],
          [
            o('Arms up.', [N('Yes! The pattern goes up, bend, up, bend.')], true),
            o('Jump.', [
              N('Jumping is fun, but the pattern is up, bend.'),
              N('After bend comes arms up.'),
            ]),
          ],
          'Continued the pattern: arms up, bend, arms up, bend.',
        ),
      ],
      [
        ch('cheer', 'Cheer with the girls.', [N('The great one grins as wide as the hedge.')]),
        ch('lie', 'Lie down and look up.', [N('The stars shine through the leaves like fruit.')]),
      ],
    ),
    sc(
      'a17-11-dance-done',
      [
        N('The great one sets a huge wooden top spinning.'),
        N('He steps on it. He holds out a paw to the girls.'),
        N('Round and round it goes. Whirr!'),
      ],
      [
        notice(
          2,
          'sel',
          'doing something together feels special and joyful',
          'CASEL: Relationship skills',
          [
            N('The dance worked because everyone did it together.'),
            N('Doing things with others can feel joyful.'),
          ],
          'Noticed that joining in together feels joyful.',
        ),
      ],
    ),
    sc(
      'a17-11-flight',
      [
        N('Satsuki and Mei climb on. You hold the soft fur.'),
        N('Up goes the top. The garden gets small.'),
        ME('We are the wind!', 'happy'),
        N('At the very top of the tree, little flutes play.'),
        N('You hear frogs, wind and the stream, all at once.'),
      ],
      [
        ask(
          4,
          'music',
          'link a night sound to what makes it',
          'RL.1.4',
          [N('Listen to the night. Which sound goes ribbit?')],
          [
            o('The frogs.', [N('Yes! Frogs go ribbit, ribbit.')], true),
            o('The wind.', [N('The wind goes whoo, whoosh.'), N('Frogs go ribbit.')]),
            o('The stream.', [N('The stream goes babble, splash.'), N('Frogs go ribbit.')]),
          ],
          'Matched a night sound to its source: frogs go ribbit.',
        ),
      ],
      [
        ch('listen', 'Just listen.', [N('Your Nubbin falls asleep against you.')]),
        ch('satsuki', 'Ask Satsuki if she is dreaming.', [SA('Probably. Do not wake me.', 'soft')]),
      ],
    ),
    sc(
      'a17-11-complete',
      [
        N('You wake at sunrise on Granny’s floor.'),
        N('Across the hedge there is no great tree.'),
        N('But in the seed bed, little green shoots are up!'),
        SA('It was a dream! But it was not!', 'happy'),
        N('On your windowsill is a small black seed.'),
        N('It smells of the camphor tree. You keep it.'),
      ],
      [
        ask(
          2,
          'science',
          'a seed grows into a shoot, then a plant',
          'K-LS1-1',
          [N('The seeds have little green shoots. What comes after a shoot?')],
          [
            o('A bigger plant.', [N('Yes! First a seed, then a shoot, then a plant.')], true),
            o('Back to a seed.', [
              N('Plants do not go backwards.'),
              N('After a shoot comes a bigger plant.'),
            ]),
          ],
          'Put a plant’s growth in order: seed, shoot, plant.',
        ),
      ],
    ),
  ],
);

// ================================================================== A17-12 The Telegram
const A12: EduQuest = quest(
  'a17-12',
  'The Telegram',
  {
    'a17-12-s1': {
      goal: 'See what Kanta is running with.',
      hint: 'Wait at the end of the corn row.',
    },
    'a17-12-s2': {
      goal: 'Walk with Satsuki to the telephone.',
      hint: 'Follow Kanta to the big house. Wait while Satsuki calls.',
    },
    'a17-12-s3': {
      goal: 'Be there for the sisters.',
      hint: 'Go back to Granny’s porch. Choose where to sit.',
    },
  },
  [
    sc(
      'a17-12-telegram',
      [
        N('You are all picking corn. Kanta runs along the path.'),
        KA('A telegram! For the Kusakabes!'),
        N('Satsuki takes it. She reads it slowly.'),
        SA('It says, please telephone the hospital.', 'shock'),
        SA('We have no telephone. Dad is in town.'),
        KA('My uncle has one. Come on!'),
      ],
      [
        notice(
          1,
          'social-studies',
          'long ago a telegram was a short message sent along wires and brought on paper',
          'D2.His.2.K-2',
          [
            N('Long ago, many houses had no phone.'),
            N('A telegram was a short message sent along wires.'),
            N('A person brought it to your door on paper.'),
          ],
          'Learned that long ago a telegram was a short message sent along wires and brought on paper.',
        ),
      ],
      [
        ch('go', 'Go with them.', [N('Granny takes Mei’s hand and keeps it.')]),
        ch('mei', 'Stay with Mei and Granny.', [
          N('Then you see Satsuki’s face. You go after her.'),
        ]),
      ],
    ),
    sc(
      'a17-12-phone',
      [
        N('The big house has a black telephone on the wall.'),
        N('Kanta’s uncle shows Satsuki how to use it.'),
        SA('Hello? Please may I speak to Mr Kusakabe? Thank you.'),
        N('She waits. Then her dad calls the hospital and rings back.'),
        SA('Mum has a cold. She must rest. She cannot come home this weekend.'),
      ],
      [
        doit(
          2,
          'literacy',
          'polite phone words: hello, please, thank you',
          'SL.K.1',
          'edu:say:phone-words:hello',
          [
            N('Satsuki is polite on the phone. She says hello. She says please.'),
            N('(Pretend to hold a phone. Say hello, please, thank you.)'),
          ],
          'Practised polite words for a phone call: hello, please, thank you.',
        ),
      ],
      [
        ch('good', 'Say, “She is all right.”', [SA('Yes. She is all right.')]),
        ch('quiet', 'Say nothing. Walk back with her.', [N('Kanta walks behind, kicking stones.')]),
      ],
    ),
    sc(
      'a17-12-phone-done',
      [
        KA('Your mum will be all right. My gran says it is the best hospital.'),
        N('Satsuki does not answer.'),
        N('Kanta goes pink and stays on the path.'),
      ],
      [
        ask(
          2,
          'sel',
          'kind words for a friend who is worried',
          'CASEL: Social awareness',
          [N('Your friend is worried. What kind thing can you say?')],
          [
            o('I am here with you.', [N('Yes! Being there is a lovely thing to say.')], true),
            o('Do not be silly.', [
              N('That can make a friend feel small.'),
              N('“I am here with you” is kinder.'),
            ]),
            o('Nothing, ever.', [
              N('Sometimes quiet is fine.'),
              N('But “I am here” can help a worried friend.'),
            ]),
          ],
          'Chose kind words to say to a worried friend.',
        ),
      ],
    ),
    sc(
      'a17-12-lap',
      [
        N('Mei waits on the porch with her corn. Satsuki tells her.'),
        ME('But she said! I picked the corn!', 'angry'),
        SA('She cannot come, Mei. She just cannot.'),
        N('Mei cries. Satsuki clenches her fists.'),
        N('Granny comes out. Satsuki cries into her lap.', 'sad'),
        GR('Hush now. A cold is only a cold. You have been brave too long.', 'soft'),
      ],
      [
        doit(
          2,
          'health',
          'slow breaths help big feelings settle',
          'ELOF: Perceptual, Motor, and Physical Development',
          'edu:breathe:flower-candle:3',
          [
            N('Big feelings need slow breaths.'),
            N('(Pretend to smell a flower, then blow out a candle. Do it three times.)'),
          ],
          'Practised slow breaths to help big feelings settle.',
        ),
      ],
      [
        ch('mei', 'Sit with Mei.', [N('Your Nubbin climbs into her lap, on the corn.')]),
        ch('satsuki', 'Sit near Satsuki and Granny.', [
          N('After a long time her breathing slows.'),
        ]),
        ch('kettle', 'Put the kettle on.', [
          N('You make tea. It is something to do with your hands.'),
        ]),
      ],
    ),
    sc(
      'a17-12-complete',
      [
        N('When the tea is ready, Satsuki sits up. She wipes her face.'),
        SA('I am sorry, Mei. I am sorry I shouted. Mei?'),
        N('Mei’s place on the step is empty. There is only a dent in the cushion.'),
        N('Your Nubbin is gone too.'),
      ],
      [
        doit(
          1,
          'maths',
          'count the people on the step and see who is missing',
          'K.CC.B.5',
          'edu:count:step-people:3',
          [
            N('Who is still here? Granny, Satsuki and you.'),
            N('(Count them: one, two, three. Who is missing?)'),
            N('Mei, and your Nubbin.'),
          ],
          'Counted three people left on the step and noticed who was missing.',
        ),
      ],
    ),
  ],
);

// ================================================================== A17-13 Mei Goes Alone
const A13: EduQuest = quest(
  'a17-13',
  'Mei Goes Alone',
  {
    'a17-13-s1': {
      goal: 'Search for Mei and your Nubbin with the village.',
      hint: 'Choose a road and look. Ask anyone you meet.',
    },
    'a17-13-s2': {
      goal: 'Go to the pond.',
      hint: 'Run down to the big pond where the people are.',
    },
  },
  [
    sc(
      'a17-13-gone',
      [
        SA('She has gone to the hospital with the corn!', 'shock'),
        N('Satsuki runs down the road.'),
        GR('Kanta! Fetch everybody!', 'shock'),
        N('Soon there are people in all the fields. They call her name: “Mei, Mei!”'),
        N('Mei is walking somewhere with her corn. Your Nubbin is with her.'),
      ],
      [
        notice(
          4,
          'social-studies',
          'a map shows roads, fields and ponds, and helpers search different places',
          'D2.Geo.2.K-2',
          [
            N('Picture a map of the village. Roads, fields, a pond.'),
            N('The searchers go to different places. Then they can look everywhere.'),
          ],
          'Learned that a map shows places, and that helpers can search different places.',
        ),
      ],
      [
        ch('road', 'Take the hospital road.', [N('A farmer thinks he saw a little girl.')]),
        ch('fields', 'Search the edges of the rice fields.', [N('Only frogs. Lots of frogs.')]),
        ch('kanta', 'Go with Kanta.', [KA('Come on! I know the paths.')]),
      ],
    ),
    sc(
      'a17-13-gone-done',
      [
        N('Someone shouts by the big pond.'),
        N('People start to run that way.'),
        N('You run too, and your heart goes thump.'),
      ],
      [
        notice(
          2,
          'health',
          'our heart beats faster when we run',
          '',
          [
            N('When you run, your heart beats faster. Thump, thump, thump!'),
            N('It slows down again when you rest.'),
          ],
          'Learned that the heart beats faster when we run and slows again with rest.',
        ),
      ],
    ),
    sc(
      'a17-13-pond',
      [
        N('People stand along the bank. A man holds up a small sandal.'),
        N('Granny puts her hands together.'),
        SA('It is not Mei’s. Hers are different.'),
        GR('Oh, thank goodness.', 'soft'),
        N('Granny sits down on the bank, all at once.'),
      ],
      [
        notice(
          3,
          'sel',
          'relief is a feeling like a big breath out',
          'CASEL: Self-awareness',
          [
            N('Granny feels relief. It feels like a big breath out.'),
            N('Her legs go wobbly. That is what relief can do.'),
          ],
          'Named relief as a feeling that can make our bodies relax.',
        ),
      ],
      [
        ch('granny', 'Sit with Granny.', [GR('Go and find her. I am all right.')]),
        ch('satsuki', 'Go to Satsuki.', [N('She is looking up at the great tree.')]),
      ],
    ),
    sc(
      'a17-13-complete',
      [
        N('The sun is low over the rice fields. The village still calls her name.'),
        SA('I know who can find her.', 'think'),
        N('She turns and runs for the hedge.'),
      ],
      [
        notice(
          0,
          'science',
          'the Sun is low in the sky in the evening, before night',
          '1-ESS1-1',
          [
            N('The Sun is low. It is going down. Evening is here.'),
            N('Every day the Sun goes down, and every morning it comes up.'),
          ],
          'Noticed that the Sun is low at the end of the day.',
        ),
      ],
    ),
  ],
);

// ================================================================== A17-14 Satsuki and the Spirit
const A14: EduQuest = quest(
  'a17-14',
  'Satsuki and the Spirit',
  {
    'a17-14-s1': {
      goal: 'Follow Satsuki through the hedge.',
      hint: 'Run after her. Go in at the gap in the hedge.',
    },
    'a17-14-s2': {
      goal: 'See what the great one calls.',
      hint: 'Hold on at the top of the tree. Watch the woods.',
    },
  },
  [
    sc(
      'a17-14-tunnel',
      [
        N('Satsuki runs into the garden and crawls into the gap.'),
        N('This time it is the tunnel, green and gold.'),
        SA('Please. Please be there.'),
        N('She drops into the hollow, on to something soft.'),
        N('The great one opens one eye. Then both.'),
        SA('Please help me. Mei is lost.', 'sad'),
        N('He looks at her. Then he grins, the widest grin.'),
      ],
      [
        ask(
          5,
          'sel',
          'asking for help politely when we need it',
          'CASEL: Relationship skills',
          [N('Satsuki needs help. What does she say?')],
          [
            o(
              'Please help me.',
              [N('Yes! Asking nicely, and saying what you need, is brave.')],
              true,
            ),
            o('Nothing, and hope.', [
              N('Help comes when we ask.'),
              N('“Please can you help me?” is how we ask.'),
            ]),
          ],
          'Learned that asking for help politely is a brave thing to do.',
        ),
      ],
      [
        ch('back', 'Stand back. This is hers to ask.', [
          N('You stay on the root. He is listening to her.'),
        ]),
        ch('nubbin', 'Tell him your Nubbin is with Mei.', [
          Y('My Nubbin is with her.'),
          N('He blinks. He knew.'),
        ]),
      ],
    ),
    sc(
      'a17-14-tunnel-done',
      [
        N('He gets up, with Satsuki on his tummy.'),
        N('He climbs up the tree, like wind. You climb after.'),
        N('Up, up, up. The roots are far below.'),
      ],
      [
        ask(
          2,
          'maths',
          'above and below',
          'K.G.A.1',
          [N('You are at the top of the tree. Are the roots above or below you?')],
          [
            o('Below.', [N('Yes! The roots are below. The sky is above.')], true),
            o('Above.', [
              N('Above is up high, like the sky.'),
              N('The roots are below.'),
            ]),
          ],
          'Used the position words above and below.',
        ),
      ],
    ),
    sc(
      'a17-14-call',
      [
        N('At the very top, he lifts his head and roars.'),
        N('It rolls over the valley like thunder.'),
        N('Far off, two yellow lights come bounding.'),
        N('The Catbus lands on the branch beside you with a thump.'),
        N('Its sign turns round. It shows a name: MEI.'),
        SA('It knows where she is!', 'happy'),
      ],
      [
        notice(
          1,
          'science',
          'a loud sound shakes the air and travels far',
          '1-PS4-1',
          [N('A big roar is a big shake in the air.'), N('It travels far, far across the valley.')],
          'Learned that a loud sound travels a long way.',
        ),
      ],
      [
        ch('climb', 'Climb aboard.', [N('The seats are soft, warm and furry. They purr.')]),
        ch('thank', 'Look back at the great one first.', [N('He grins. You climb aboard.')]),
      ],
    ),
    sc(
      'a17-14-complete',
      [
        N('The Catbus leaps! It runs along the wires, over the rice.'),
        N('Whoosh! Thump! Clatter!'),
        SA('Hurry. Please hurry.'),
        N('You hold Satsuki’s hand. She lets you.'),
      ],
      [
        doit(
          1,
          'literacy',
          'sound words that copy noises: whoosh, thump, clatter',
          'RL.1.4',
          'edu:say:sound-words:whoosh',
          [N('The Catbus is noisy. Say its sounds!'), N('(Say them big: whoosh, thump, clatter.)')],
          'Said sound words that copy noises: whoosh, thump and clatter.',
        ),
      ],
    ),
  ],
);

// ================================================================== A17-15 The Roadside Statues
const A15: EduQuest = quest(
  'a17-15',
  'The Roadside Statues',
  {
    'a17-15-s1': {
      goal: 'Find Mei.',
      hint: 'Get down from the Catbus by the row of statues.',
    },
    'a17-15-s2': {
      goal: 'Watch the Catbus sign change again.',
      hint: 'Wait by the Catbus while Satsuki asks.',
    },
  },
  [
    sc(
      'a17-15-statues',
      [
        N('The Catbus lands on a country road. Small stone statues stand by the verge.'),
        N('Each one wears a red bib. Someone left fresh flowers.'),
        N('Mei sits beside them with her corn. Your Nubbin is next to her.'),
        SA('Mei!'),
        ME('Onee-chan!', 'sad'),
        N('The sisters run into each other and hold on.'),
        ME('I am sorry. I wanted to give Mum the corn.', 'sad'),
        SA('I am sorry too, Mei. I am sorry I shouted.', 'sad'),
      ],
      [
        ask(
          7,
          'sel',
          'saying sorry and forgiving',
          'CASEL: Relationship skills',
          [N('Mei and Satsuki both said sorry. What do you say when someone says sorry?')],
          [
            o(
              'It is okay. I forgive you.',
              [N('Yes! Forgiving helps hearts feel light again.')],
              true,
            ),
            o('I am still cross forever.', [
              N('Feeling cross is okay for a while.'),
              N('Forgiving helps hearts feel light again.'),
            ]),
          ],
          'Practised saying sorry and forgiving.',
        ),
      ],
      [
        ch('back', 'Stand back and let them have this.', [N('Nobody hurries them.')]),
        ch('nubbin', 'Pick your Nubbin up.', [
          N('It is dusty. It walked a long way on short legs.'),
        ]),
        ch('corn', 'Check the corn.', [ME('It is not even bent!', 'happy')]),
      ],
    ),
    sc(
      'a17-15-sign',
      [
        N('Six little statues keep watch by the road.'),
        SA('Mei, do you still want to take Mum the corn?'),
        N('Mei nods hard.'),
        N('Mei walked a long way, and that was not safe. Satsuki was so scared.'),
        N('Satsuki bows a little to the Catbus. She asks it nicely.'),
        N('The sign rolls round. It says HOSPITAL.'),
        N('The sisters climb in. The door stays open for you.'),
      ],
      [
        ask(
          3,
          'health',
          'when lost, stay where you are and tell a grown-up',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('If you are ever lost, what is the safest thing to do?')],
          [
            o(
              'Stay put and call a grown-up.',
              [N('Yes! Staying put helps people find you.')],
              true,
            ),
            o('Walk far away.', [
              N('Walking far makes finding you harder.'),
              N('Stay put and call a grown-up.'),
            ]),
          ],
          'Learned that if you are lost, you stay where you are and call a trusted grown-up.',
        ),
        doit(
          0,
          'maths',
          'count to 6',
          'K.CC.B.5',
          'edu:count:statues:6',
          [
            N('Count the little statues by the road.'),
            N('(Point and count: one, two, three, four, five, six.)'),
          ],
          'Counted six statues, one number for each.',
        ),
      ],
      [
        ch('climb', 'Climb aboard.', [N('Your Nubbin falls asleep on the purring seat.')]),
        ch('look', 'Look back at the statues.', [N('They keep the road, as they always have.')]),
      ],
    ),
    sc(
      'a17-15-complete',
      [
        N('The Catbus runs over hills in the dusk.'),
        N('Mei sits on Satsuki’s lap with the corn.'),
        ME('Are we nearly there?'),
        SA('Nearly.', 'soft'),
      ],
      [
        notice(
          2,
          'science',
          'corn has a husk outside and seeds called kernels inside',
          'ELOF: Scientific Reasoning',
          [
            N('Look at Mei’s corn. It has a green husk outside.'),
            N('Inside are yellow kernels. Each kernel is a seed.'),
          ],
          'Learned that corn has a husk outside and kernels, which are seeds, inside.',
        ),
      ],
    ),
  ],
);

// ================================================================== A17-16 Corn on the Sill
const A16: EduQuest = quest(
  'a17-16',
  'Corn on the Sill',
  {
    'a17-16-s1': {
      goal: 'Look in at the hospital window.',
      hint: 'Keep very still. Nobody inside must know you are there.',
    },
    'a17-16-s2': {
      goal: 'Leave the corn on the windowsill.',
      hint: 'Watch while the sisters send the corn across.',
    },
  },
  [
    sc(
      'a17-16-window',
      [
        N('The Catbus settles in a tall pine outside the hospital.'),
        N('Through the open window you see the bed.'),
        N('Mrs Kusakabe sits up. Mr Kusakabe sits beside her.'),
        MO('It is only a cold. The doctor is fussing.', 'happy'),
        N('She looks tired, but she is laughing.'),
        SA('She is laughing. She is all right.'),
      ],
      [
        notice(
          3,
          'health',
          'a cold is a small illness that goes away with rest and drinks',
          'ELOF: Perceptual, Motor, and Physical Development',
          [
            N('A cold is a small illness. It goes away.'),
            N('Rest, warm drinks and sleep help a cold get better.'),
          ],
          'Learned that a cold goes away with rest, drinks and sleep.',
        ),
      ],
      [
        ch('quiet', 'Stay quiet. Let them look.', [N('The Catbus holds its breath.')]),
        ch('nubbin', 'Lift your Nubbin up so it can see.', [
          N('It looks at the lady who stroked its head.'),
        ]),
      ],
    ),
    sc(
      'a17-16-corn',
      [
        SA('We cannot go in. We will leave the corn, Mei.'),
        N('Satsuki holds Mei’s hand round a twig.'),
        N('Together they scratch letters into the husk.'),
        N('A long, soft paw puts the corn on the windowsill.'),
        N('Mr Kusakabe finds it. It says, To Mother.'),
      ],
      [
        doit(
          3,
          'literacy',
          'trace the letters of a short word',
          'ELOF: Literacy',
          'edu:trace:letters:to',
          [
            N('Mei cannot write yet. Satsuki helps her trace letters.'),
            N('(Trace T and O with your finger in the air. The word is: To.)'),
          ],
          'Traced the letters T and O in the air.',
        ),
      ],
    ),
    sc(
      'a17-16-corn-done',
      [
        N('The Catbus slips away. You fly home over dark hills.'),
        N('Mei falls asleep before the first field.'),
        N('Satsuki watches the lights get smaller.'),
      ],
      [
        ask(
          2,
          'science',
          'faraway lights look small',
          'ELOF: Scientific Reasoning',
          [N('The hospital lights are far away now. How do they look?')],
          [
            o('Small and tiny.', [N('Yes! Things look smaller when they are far away.')], true),
            o('Bigger and bigger.', [
              N('Things look bigger when they are close.'),
              N('Far away, the lights look small.'),
            ]),
          ],
          'Noticed that faraway lights look small.',
        ),
      ],
    ),
    sc(
      'a17-16-complete',
      [
        N('The Catbus puts you down at the old house gate.'),
        N('Granny is on the step with the lamp.'),
        N('She hugs Mei, then Satsuki, then you.'),
        GR('Oh, the three of you.', 'soft'),
        N('Later in the summer, Mrs Kusakabe comes home. She is getting well.'),
        N('You are back in the Grove. There is a bus-stop bench by the lane.'),
      ],
      [
        ask(
          3,
          'literacy',
          'feeling words: relieved and happy',
          'RL.1.4',
          [N('Granny hugs everyone. “Oh, the three of you.” How does Granny feel?')],
          [
            o('Happy and relieved.', [N('Yes! Relieved means the worry is over. Phew!')], true),
            o('Cross.', [
              N('She is hugging everyone.'),
              N('She is happy and relieved.'),
            ]),
          ],
          'Named a feeling from what a character says and does: relieved and happy.',
        ),
      ],
    ),
  ],
);

const QUESTS: EduQuest[] = [A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, A13, A14, A15, A16];

// ================================================================== variants
const HUNT_BIKE: Line[] = [
  N('Kanta’s uncle’s bicycle is old and very fast downhill.'),
  N('You ride on the carrier, holding your Nubbin.'),
];

const A17_VARIANTS_SPROUT: EduScene[] = [
  // ---------------------------------------------------------------- A17-9 step 2 (hunt)
  sc(
    'a17-09-wait-hunt',
    [
      N('Mei is asleep. The rain drips, drips, drips.'),
      N('Your Nubbin slowly turns its head.'),
      N('Next to Satsuki, something stands in the rain.'),
      N('You see two big grey feet. They have claws like garden forks.'),
      N('The rain drips on to the feet. One shifts, politely.'),
    ],
    [
      doit(
        0,
        'music',
        'clap a steady beat like drips',
        'RL.2.4',
        'edu:clap:beat:rain',
        [
          N('Listen. Drip. Drip. Drip. The rain makes a steady beat.'),
          N('(Clap the beat with the rain: drip, drip, drip.)'),
        ],
        'Clapped a steady beat to match the dripping rain.',
      ),
    ],
    [
      ch('lean', 'Lean to see more.', [N('The feet move away. He is not ready to be looked at.')]),
      ch('still', 'Stand still and look at the road.', [
        N('Beside you, something huge does the same.'),
      ]),
    ],
  ),
  // ---------------------------------------------------------------- A17-11 step 2 (s1Done)
  sc(
    'a17-11-dance-charm',
    [
      N('Round the bed you go. Arms up. Bend. Arms up. Bend.'),
      N('Your Nubbin stops. It digs a little hole by the girls’ rows.'),
      N('You take Moss’s acorn off its string. You put it in the hole.'),
      N('Your Nubbin pats the earth down.'),
      N('Shoots come up. One more, darker, comes from the little hole.'),
      N('They grow into a tree as tall as the great tree.'),
      SA('We did it!', 'happy'),
    ],
    [
      ask(
        1,
        'maths',
        'continue a simple pattern',
        'ELOF: Mathematics Development',
        [N('Arms up, bend. Arms up, bend. What comes next?')],
        [
          o('Arms up.', [N('Yes! The pattern goes up, bend, up, bend.')], true),
          o('Jump.', [
            N('Jumping is fun, but the pattern is up, bend.'),
            N('After bend comes arms up.'),
          ]),
        ],
        'Continued the pattern: arms up, bend, arms up, bend.',
      ),
    ],
    [
      ch('cheer', 'Cheer with the girls.', [N('The great one grins as wide as the hedge.')]),
      ch('lie', 'Lie down and look up.', [N('Somewhere up there are some oak leaves.')]),
    ],
  ),
  // ---------------------------------------------------------------- A17-11 complete (s1Done)
  sc(
    'a17-11-complete-oak',
    [
      N('You wake at sunrise on Granny’s floor.'),
      N('Across the hedge there is no great tree.'),
      N('But in the seed bed, little green shoots are up!'),
      SA('It was a dream! But it was not!', 'happy'),
      N('Where you planted the acorn, the earth is smooth and bare.'),
      N('Your Nubbin looks at the hill, as if it knows something.'),
    ],
    [
      ask(
        2,
        'science',
        'a seed grows into a shoot, then a plant',
        'K-LS1-1',
        [N('The seeds have little green shoots. What comes after a shoot?')],
        [
          o('A bigger plant.', [N('Yes! First a seed, then a shoot, then a plant.')], true),
          o('Back to a seed.', [
            N('Plants do not go backwards.'),
            N('After a shoot comes a bigger plant.'),
          ]),
        ],
        'Put a plant’s growth in order: seed, shoot, plant.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A17-14 (hunt)
  sc(
    'a17-14-tunnel-hunt',
    [
      N('Satsuki runs into the garden and crawls into the gap.'),
      N('You dive in after her. Then the branches close up.'),
      N('It is just a hedge. You are stuck!'),
      N('Ring, ring! Kanta rides up on a big bicycle.'),
      KA('Where is Satsuki?'),
      Y('She has gone to get help, somewhere I cannot follow.'),
      KA('Then we look on our own. Get on!'),
    ],
    [
      ask(
        5,
        'sel',
        'asking for help politely when we need it',
        'CASEL: Relationship skills',
        [N('You need help. What can you say to Kanta?')],
        [
          o(
            'Please can you help me?',
            [N('Yes! Asking nicely, and saying what you need, is brave.')],
            true,
          ),
          o('Nothing, and hope.', [
            N('Help comes when we ask.'),
            N('“Please can you help me?” is how we ask.'),
          ]),
        ],
        'Learned that asking for help politely is a brave thing to do.',
      ),
    ],
    [
      ch('get-on', 'Get on the back.', [N('Kanta pushes off. Off you go!')]),
      ch('hedge', 'Look at the hedge once more.', [N('It remembers that you went looking.')]),
    ],
  ),
  sc(
    'a17-14-tunnel-hunt-done',
    [
      N('Kanta pedals hard. He stands up on the pedals.'),
      N('He shouts, “Mei!” at every turning.'),
      N('Your Nubbin hangs on tight.'),
    ],
    [
      ask(
        0,
        'maths',
        'above and below',
        'K.G.A.1',
        [N('Kanta stands up on the pedals. Is his head above or below the bicycle seat?')],
        [
          o('Above.', [N('Yes! Standing up puts his head above the seat.')], true),
          o('Below.', [
            N('Below is lower down, under.'),
            N('Standing up puts his head above the seat.'),
          ]),
        ],
        'Used the position words above and below.',
      ),
    ],
  ),
  sc(
    'a17-14-call-hunt',
    [
      N('A roar rolls out from the hill, like thunder.'),
      KA('Thunder? There are no clouds!', 'shock'),
      N('The rice bends flat in a long line, as if something is running.'),
      N('Two yellow lights go over your heads, along the wires.'),
      N('A sign on top says MEI.'),
      Y('Follow that wind!'),
    ],
    [
      notice(
        1,
        'science',
        'a loud sound shakes the air and travels far',
        '1-PS4-1',
        [N('A big roar is a big shake in the air.'), N('It travels far, far across the valley.')],
        'Learned that a loud sound travels a long way.',
      ),
    ],
    [
      ch('follow', 'Point Kanta after the lights.', [KA('The old road! Hold on!')]),
      ch('kanta', 'Tell Kanta what you saw.', [
        KA('A bus shaped like a cat?'),
        N('He turns the bicycle and pedals.'),
      ]),
    ],
  ),
  sc(
    'a17-14-call-hunt-done',
    [
      N('The wind dies away ahead of you.'),
      N('Kanta keeps pedalling. He does not ask any more questions.'),
      N('The road bumps. Bump, bump, bump!'),
    ],
    [
      ask(
        0,
        'maths',
        'count to 2',
        'K.CC.B.5',
        [N('How many people ride the bicycle? You and Kanta.')],
        [
          o('Two.', [N('Yes! One, two. You and Kanta make two.')], true),
          o('Five.', [
            N('Let us count again: you, Kanta. One, two.'),
            N('Two people ride the bicycle.'),
          ]),
        ],
        'Counted two people on the bicycle.',
      ),
    ],
  ),
  sc(
    'a17-14-complete-hunt',
    [
      N('The old road runs between the fields, white in the dusk.'),
      KA('If she is hurt. If she has fallen in a ditch.', 'sad'),
      Y('She has not. My Nubbin is with her.'),
      N('Kanta pedals faster. Whoosh! Clatter!'),
    ],
    [
      doit(
        3,
        'literacy',
        'sound words that copy noises: whoosh, clatter',
        'RL.1.4',
        'edu:say:sound-words:whoosh',
        [N('The bicycle is noisy. Say its sounds!'), N('(Say them big: whoosh, clatter.)')],
        'Said sound words that copy noises: whoosh and clatter.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A17-15 (hunt)
  sc(
    'a17-15-statues-hunt',
    [
      N('The bicycle comes round a bend. Small stone statues stand by the road.'),
      N('Each wears a red bib. There are fresh flowers.'),
      N('Satsuki and Mei hold each other tight. Mei still has her corn.'),
      N('Behind them the Catbus waits. Kanta cannot see it, but you can.'),
      KA('Mei! She is all right!', 'happy'),
      N('Your Nubbin runs down the road and hugs your shins.'),
    ],
    [
      ask(
        5,
        'sel',
        'saying sorry and forgiving',
        'CASEL: Relationship skills',
        [
          N('Satsuki shouted at Mei before. Now they hug and make up.'),
          N('What do you say when someone says sorry?'),
        ],
        [
          o(
            'It is okay. I forgive you.',
            [N('Yes! Forgiving helps hearts feel light again.')],
            true,
          ),
          o('I am still cross forever.', [
            N('Feeling cross is okay for a while.'),
            N('Forgiving helps hearts feel light again.'),
          ]),
        ],
        'Practised saying sorry and forgiving.',
      ),
    ],
    [
      ch('nubbin', 'Pick your Nubbin up.', [N('It is dusty. It walked a long way on short legs.')]),
      ch('wave', 'Wave to the sisters.', [
        N('Satsuki nods fiercely. Her arms are full of sister.'),
      ]),
    ],
  ),
  sc(
    'a17-15-sign-hunt',
    [
      N('Six little statues keep watch by the road.'),
      N('Satsuki bows to the Catbus and asks it something.'),
      N('The sign rolls round. It says HOSPITAL.'),
      N('The sisters climb in. The door shuts. The Catbus leaps.'),
      KA('Where did they go? They were just there!', 'shock'),
      Y('They have gone to see their mum.'),
    ],
    [
      doit(
        0,
        'maths',
        'count to 6',
        'K.CC.B.5',
        'edu:count:statues:6',
        [
          N('Count the little statues by the road.'),
          N('(Point and count: one, two, three, four, five, six.)'),
        ],
        'Counted six statues, one number for each.',
      ),
    ],
    [
      ch('follow', '“We can go too.”', [KA('On my uncle’s bike? In the dark? Get on!')]),
      ch('granny', '“Somebody must tell Granny.”', [
        N('A farmer on a cart will tell her Mei is safe.'),
      ]),
    ],
  ),
  sc(
    'a17-15-sign-hunt-done',
    [
      N('The statues stand in their red bibs in the last light.'),
      N('They keep the road, as they always have.'),
      N('The flowers at their feet nod, and are still.'),
    ],
    [
      doit(
        0,
        'literacy',
        'hear and say rhyming words: bib, crib, rib',
        'RF.K.2',
        'edu:say:rhyme:bib',
        [
          N('Each statue wears a red bib.'),
          N('Bib rhymes with crib, and with rib.'),
          N('(Say them together: bib, crib, rib!)'),
        ],
        'Heard and said rhyming words: bib, crib and rib.',
      ),
    ],
  ),
  sc(
    'a17-15-complete-hunt',
    [
      ...HUNT_BIKE,
      N('Up the long hill you walk it. Down the other side, it flies.'),
      KA('I am going to be in so much trouble.', 'happy'),
      N('He does not sound as if he minds at all.'),
    ],
    [
      notice(
        1,
        'science',
        'going downhill is faster than going uphill',
        'ELOF: Scientific Reasoning',
        [
          N('Up the hill is slow, slow, slow.'),
          N('Down the hill, the bicycle rolls fast.'),
          N('The hill helps you go down.'),
        ],
        'Noticed that bicycles go faster downhill than uphill.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A17-16 (hunt)
  sc(
    'a17-16-window-hunt',
    [
      N('It is nearly dark at the hospital. You stop under the pines.'),
      N('One window above you is lit and open.'),
      N('Mrs Kusakabe sits up, laughing. Mr Kusakabe is with her.'),
      MO('It is only a cold. The doctor is fussing.', 'happy'),
      N('In the tall pine, two small shapes sit very still.'),
      KA('Is that them? Up the tree?', 'shock'),
    ],
    [
      notice(
        3,
        'health',
        'a cold is a small illness that goes away with rest and drinks',
        'ELOF: Perceptual, Motor, and Physical Development',
        [
          N('A cold is a small illness. It goes away.'),
          N('Rest, warm drinks and sleep help a cold get better.'),
        ],
        'Learned that a cold goes away with rest, drinks and sleep.',
      ),
    ],
    [
      ch('shh', 'Shh him.', [N('Kanta shuts his mouth so fast his teeth click.')]),
      ch('nubbin', 'Lift your Nubbin up so it can see.', [N('It looks at the lit window.')]),
    ],
  ),
  sc(
    'a17-16-corn-hunt',
    [
      N('In the pine, a long pale paw reaches slowly to the window.'),
      N('It puts down an ear of corn on the sill.'),
      N('Mr Kusakabe finds it. It says, To Mother.'),
      N('He looks out at the pine. He lifts his hand. You lift yours.'),
    ],
    [
      doit(
        2,
        'literacy',
        'trace the letters of a short word',
        'ELOF: Literacy',
        'edu:trace:letters:to',
        [
          N('The corn says, To Mother. The first word is To.'),
          N('(Trace T and O with your finger in the air.)'),
        ],
        'Traced the letters T and O in the air.',
      ),
    ],
  ),
  sc(
    'a17-16-corn-hunt-done',
    [
      N('A gust goes through the pine. The small shapes are gone.'),
      N('Two yellow lights go over the hills towards home.'),
      N('Kanta watches them all the way.'),
    ],
    [
      ask(
        2,
        'science',
        'faraway lights look small',
        'ELOF: Scientific Reasoning',
        [N('The yellow lights are far away now. How do they look?')],
        [
          o('Small and tiny.', [N('Yes! Things look smaller when they are far away.')], true),
          o('Bigger and bigger.', [
            N('Things look bigger when they are close.'),
            N('Far away, the lights look small.'),
          ]),
        ],
        'Noticed that faraway lights look small.',
      ),
    ],
  ),
  sc(
    'a17-16-complete-hunt',
    [
      ...HUNT_BIKE,
      N('At the old house gate, Granny waits with the lamp.'),
      GR('There you are. Oh, the pair of you.', 'soft'),
      N('Kanta goes pink to the ears.'),
      N('Later in the summer, Mrs Kusakabe comes home. She is getting well.'),
      N('You are back in the Grove. There is a bus-stop bench by the lane.'),
    ],
    [
      ask(
        3,
        'literacy',
        'feeling words: relieved and happy',
        'RL.1.4',
        [N('Granny says, “Oh, the pair of you.” How does Granny feel?')],
        [
          o('Happy and relieved.', [N('Yes! Relieved means the worry is over. Phew!')], true),
          o('Cross.', [
            N('She waited up with the lamp.'),
            N('She is happy and relieved.'),
          ]),
        ],
        'Named a feeling from what a character says and does: relieved and happy.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- Grove keepsake scenes
  sc(
    'a17-grove-oak',
    [
      N('You step out of the atlas. Something on the hill has changed.'),
      N('By Moss’s flat stone stands a big oak tree.'),
      N('Moss looks up at it for a long time. Your Nubbin falls asleep.'),
      M('I planted one of those, long ago. It took four hundred years.', 'think'),
      M('You did it in one night.'),
      M('Show-off.'),
    ],
    [
      notice(
        3,
        'sel',
        'wonder and quiet shared with a friend',
        'CASEL: Social awareness',
        [
          N('Moss does not say much. He looks at the tree.'),
          N('It is nice to share a quiet moment with a friend.'),
        ],
        'Noticed that we can share wonder and quiet with a friend.',
      ),
    ],
    [
      ch('tell', 'Tell him where the acorn went.', [
        Y('It was Hazel’s acorn. I had a lot of help.'),
        M('She always did.', 'soft'),
      ]),
      ch('sit', 'Sit beside him on the stone.', [
        N('Neither of you says anything. The oak creaks.'),
      ]),
    ],
  ),
  sc(
    'a17-grove-oak-acorn',
    [
      M('It is a good tree.', 'soft'),
      N('Something drops through the leaves into your hand. An acorn!'),
      M('It gives back. Put it on the string.', 'soft'),
      N('You thread it on. It fits.'),
    ],
    [
      notice(
        1,
        'science',
        'an acorn is the seed of an oak, and a big oak grows from a tiny acorn',
        'ELOF: Scientific Reasoning',
        [
          N('The new acorn is a seed. It holds a tiny oak inside.'),
          N('Oaks take a very long time to grow big.'),
        ],
        'Learned that a tiny acorn holds a seed that can grow into a big oak.',
      ),
    ],
  ),
  sc(
    'a17-grove-oak-sleeps',
    [
      N('You step out of the atlas. By Moss’s flat stone stands an oak.'),
      N('Moss faded. That means he died.'),
      N('His body stopped working, and it will not start again.'),
      N('His flower grows by the stone. The oak spreads its branches over it.'),
      N('The oak’s shade falls where he used to sit.'),
      N('The Nubbins nap in a heap in its shade.'),
      N('An acorn drops. You thread it on, where Moss’s acorn was.'),
      N('You sit on the stone a while, remembering him.', 'soft'),
    ],
    [
      notice(
        3,
        'sel',
        'feeling sad when someone dies, and remembering them',
        'CASEL: Self-awareness',
        [
          N('It is okay to feel sad when someone dies.'),
          N('We remember them. A tree and a flower help us remember.'),
        ],
        'Noticed that sadness is okay, and that remembering helps.',
      ),
    ],
  ),
  sc(
    'a17-grove-camphor',
    [
      N('You step out of the atlas with a pot in your arms.'),
      N('In it is a young camphor tree, as high as your knee.'),
      N('Its leaves are glossy and smell sharp.'),
      N('Your Nubbin sits by the pot, chin on its knees.'),
      N('It means to be very good at waiting for a tree.'),
    ],
    [
      ask(
        1,
        'maths',
        'compare heights: taller and shorter',
        'K.MD.A.2',
        [N('The little tree is as high as your knee. Is it taller or shorter than you?')],
        [
          o('Shorter.', [N('Yes! It only comes up to your knee. You are taller.')], true),
          o('Taller.', [
            N('It only reaches your knee.'),
            N('You are taller, for now!'),
          ]),
        ],
        'Compared two heights and used the words taller and shorter.',
      ),
    ],
  ),
];

// ================================================================== exports
/** Sprout versions of every scene in ATLAS_A17. */
export const EDU_A17_SPROUT: EduQuest[] = QUESTS;

/** Sprout versions of every scene in A17_VARIANTS. */
export const EDU_A17_SPROUT_VARIANTS: EduScene[] = A17_VARIANTS_SPROUT;

/** Every `edu:` check string used by the lessons above. */
export const CHECKS: string[] = [
  'edu:add:umbrella-people:2',
  'edu:breathe:belly:3',
  'edu:breathe:flower-candle:3',
  'edu:clap:beat:frogs',
  'edu:clap:beat:rain',
  'edu:clap:syllables:hospital',
  'edu:count:acorns:5',
  'edu:count:bike-wheels:4',
  'edu:count:lorry-wheels:3',
  'edu:count:rags:4',
  'edu:count:statues:6',
  'edu:count:step-people:3',
  'edu:count:umbrellas:3',
  'edu:draw:leaf',
  'edu:name:colour:black',
  'edu:order:letter:box-bus-train-carrier',
  'edu:order:story:mei-and-the-tree',
  'edu:say:first-sound:b',
  'edu:say:first-sound:m',
  'edu:say:phone-words:hello',
  'edu:say:rhyme:bib',
  'edu:say:sound-words:creak',
  'edu:say:sound-words:whoosh',
  'edu:say:word:arigato',
  'edu:trace:letters:to',
];
