/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Atlas page A26, The Wall of
 * Uruk (the Epic of Gilgamesh, Mesopotamia, now Iraq).
 *
 * Source: atlas-a26.ts (ATLAS_A26 and A26_VARIANTS). One EduScene per original scene, id
 * `sprout:<original id>`, with the same choice ids and `set` flags. Every step scene, done scene,
 * complete scene and variant has a version, and each has exactly one lesson. Domains never repeat
 * back to back, across scenes and quests, and on every variant path (each variant keeps the domain
 * of the scene it replaces, except the Humbaba and Hazel notes, which differ from both neighbours).
 *
 * What it teaches (outline: geography, cuneiform on clay, sun-dried and kiln-fired bricks, the flood
 * tablet read again in 1872, how friends remember each other): Uruk stood by a river in the land
 * between the Tigris and the Euphrates, now Iraq; writing pressed into wet clay with a reed; bricks that
 * ring; counting and taking away; first sounds and rhymes; day and night; water, rest and washing;
 * naming feelings, waiting, saying sorry, sitting beside a friend, and remembering.
 *
 * Left out or softened for this age (EDU-STYLE.md, “Hard things”):
 * - No lines from any translation. Shamhat is “a woman from the city” who teaches Enkidu to talk, and
 *   nothing more. Ishtar asks Gilgamesh to stay with her and be her king; her old friends’ sad
 *   stories are one plain line.
 * - Humbaba: he begs, and Gilgamesh decides. Humbaba dies, said once and plainly, offscreen, then the
 *   comfort (the quiet forest, the tree that stays). The sprout band offers “speak for him” and “say
 *   nothing”. “Agree with Enkidu” is left out, with `defaultChoice: 'silent'`.
 * - The Bull of Heaven is stopped and lies down. Nobody is hurt.
 * - Enkidu dies, said plainly (“his body stopped working, and it will not start again”), with the
 *   comfort straight after: the Nubbin in Gilgamesh’s lap, the statue, the remembering.
 * - Tablets are never treasure to take: the tablet stays in its box, and some that were taken have
 *   come home. The barley drink is just “barley drink”.
 * - Facts used: Uruk stood by the Euphrates in what is now Iraq; cuneiform was pressed into wet clay
 *   with a reed; bricks that ring are solid; kiln-fired bricks last longer than sun-dried; bread
 *   comes from grain; the sun rises in the east; scorpions have eight legs; wind is moving air; a
 *   snake sheds its skin as it grows; George Smith read the flood tablet in 1872.
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
const MO = say('moss');
const BR = say('a26-brickmaker');
const GI = say('a26-gilgamesh');
const EN = say('a26-enkidu');
const NI = say('a26-ninsun');
const SH = say('a26-shamhat');
const TR = say('a26-trapper');
const SP = say('a26-shepherd');
const TW = say('a26-townswoman');
const EL = say('a26-elder');
const HU = say('a26-humbaba');
const IS = say('a26-ishtar');
const SS = say('a26-shamash');
const SC = say('a26-scorpion');
const SI = say('a26-siduri');
const UR = say('a26-urshanabi');
const UT = say('a26-uta');
const UW = say('a26-utawife');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const words = (t: string) => t.trim().split(/\s+/).length;
const parts = (t: string) => t.split(/(?<=[.!?”)])\s+(?=[A-Z“(‘])/);

/**
 * Keeps every line to 14 words or fewer and at most two sentences, as the sprout band requires: a
 * longer line is cut at sentence ends into several lines by the same speaker (the mood stays on the
 * first). `map[i]` is the index of the last piece of original line i, so a lesson’s `after` can follow.
 */
const split = (lines: Line[]): { lines: Line[]; map: number[] } => {
  const out: Line[] = [];
  const map: number[] = [];
  for (const l of lines) {
    const chunks: string[] = [];
    const counts: number[] = [];
    for (const sentence of parts(l.text)) {
      const last = chunks[chunks.length - 1];
      const n = counts[counts.length - 1] ?? 0;
      if (last !== undefined && n < 2 && words(last) + words(sentence) <= 14) {
        chunks[chunks.length - 1] = `${last} ${sentence}`;
        counts[counts.length - 1] = n + 1;
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

const std = (standard?: string) => (standard ? { standard } : {});

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
  ...std(standard),
  kind: 'ask',
  after,
  prompt: sp(prompt),
  options,
  parentNote,
});

const notice = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string,
  lines: Line[],
  parentNote: string,
): Beat => ({
  domain,
  skill,
  ...std(standard),
  kind: 'notice',
  after,
  lines: sp(lines),
  parentNote,
});

const doit = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string,
  check: string,
  lines: Line[],
  parentNote: string,
): Beat => ({
  domain,
  skill,
  ...std(standard),
  kind: 'do',
  after,
  check,
  lines: sp(lines),
  parentNote,
});

/** A choice, with its original id and flags. */
const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice => ({
  id,
  label,
  ...(set ? { set } : {}),
  then: sp(then),
});

/** Maps a lesson's original line index to its split index; a bad index fails loudly at load. */
const mapped = (map: number[], at: number, of: string): number => {
  const i = map[at];
  if (i === undefined) throw new Error(`${of}: lesson after line ${at} is out of range`);
  return i;
};

/** One sprout scene. Lesson ids are `sprout:<of>-l<n>`, numbered in play order. */
const sc = (
  of: string,
  lines: Line[],
  beats: Beat[],
  extra: { choices?: Choice[]; defaultChoice?: string } = {},
): EduScene => {
  const { lines: out, map } = split(lines);
  return {
    id: `sprout:${of}`,
    of,
    band: 'sprout',
    lines: out,
    ...extra,
    lessons: [...beats]
      .sort((a, b) => a.after - b.after)
      .map((b, i) => ({ id: `sprout:${of}-l${i + 1}`, ...b, after: mapped(map, b.after, of) })),
  };
};

const quest = (
  of: string,
  title: string,
  goals: EduQuest['goals'],
  scenes: EduScene[],
): EduQuest => ({
  id: `sprout:${of}`,
  of,
  band: 'sprout',
  title,
  goals,
  scenes,
});

const M = 'ELOF: Mathematics Development';
const SOC = 'ELOF: Social and Emotional Development';
const LIT = 'ELOF: Literacy';
const LANG = 'ELOF: Language and Communication';
const SCI = 'ELOF: Scientific Reasoning';
const PHYS = 'ELOF: Perceptual, Motor, and Physical Development';

// ================================================================== A26-1 The Wall
const Q1 = quest(
  'a26-01',
  'The Wall',
  {
    'a26-01-s1': {
      goal: 'Step into the book. Walk along the great wall.',
      hint: 'Touch the sunny wall on the page. Follow the old brickmaker.',
    },
    'a26-01-s2': {
      goal: 'Find the copper box at the bottom of the wall.',
      hint: 'It is beside the stairs. The brickmaker will show you.',
    },
  },
  [
    sc(
      'a26-01-page',
      [
        N('Nova’s book falls open. A great brick wall shines in the sun.'),
        N('There are palm trees and a wide river. You step in with your Nubbin.'),
        N('An old woman sits on a pile of bricks, eating a date.'),
        BR('Hello, new friend! Come and walk the wall with me.', 'happy'),
        BR('This city is called Uruk. Long ago it stood where Iraq is today.'),
        BR('A river runs beside it. People made their homes near the water.'),
      ],
      [
        ask(
          5,
          'social-studies',
          'a city can sit beside a river, in a place on the map',
          'D2.Geo.2.K-2',
          [N('(Look at the river on the page.) Where is Uruk?')],
          [
            o(
              'Beside a river',
              [BR('Yes! Uruk is beside a river. Water is good for drinking and for growing food.')],
              true,
            ),
            o('Up on the moon', [
              BR('Not quite! Uruk is on the ground, beside a river. Look at the water.'),
            ]),
            o('In the middle of the sea', [
              BR('Not quite! It is beside a river, with land all around.'),
            ]),
          ],
          'Learned that Uruk stood beside a river, in the land that is now Iraq.',
        ),
      ],
      {
        choices: [
          ch('bricks', 'Ask how you tell a good brick.', [
            BR('You knock it. A good brick rings!', 'happy'),
          ]),
          ch('king', 'Ask who built the wall.', [
            BR('The king says he did. But many hands helped. Come and see.', 'think'),
          ]),
        ],
      },
    ),
    sc(
      'a26-01-page-done',
      [
        N('Your Nubbin knocks on the wall. Knock, knock! It listens.'),
        BR('Mind the third stair. It has been mended many times.'),
      ],
      [
        doit(
          0,
          'science',
          'a tap makes a thing shake, and the shake makes a sound',
          '1-PS4-1',
          'edu:tap:brick:listen',
          [
            BR(
              '(Tap the table with one finger. Listen.) Your tap makes it shake a tiny bit. The shake makes the sound!',
            ),
          ],
          'Tapped and listened: shaking makes sound.',
        ),
      ],
    ),
    sc(
      'a26-01-tablet',
      [
        N('At the bottom of the stairs there is a copper box. It is green with age.'),
        BR('Slide the bolt. This box is meant to be opened.'),
        N('Inside lies a blue stone tablet with tiny pointy marks.'),
        BR('That is writing! People pressed marks like these into wet clay with a reed.'),
        BR('It tells of a king who saw many things.'),
      ],
      [
        notice(
          3,
          'literacy',
          'cuneiform: writing pressed into wet clay with a reed',
          LIT,
          [
            BR('Press, lift, press, lift. Each little mark is a wedge.'),
            BR(
              'The marks are called cuneiform. People wrote like this over four thousand years ago.',
            ),
          ],
          'Heard that long ago people wrote by pressing a reed into wet clay.',
        ),
      ],
      {
        choices: [
          ch('read', 'Read on.', [
            N('You read on. The marks become words, and the words become a street.'),
          ]),
          ch('nubbin', 'Let your Nubbin turn the tablet over.', [
            N('Your Nubbin turns it over, ever so gently. The story goes on.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-01-tablet-done',
      [
        N('The brickmaker puts the tablet back and slides the bolt home.'),
        BR('It stays here so everyone can come and read it.'),
      ],
      [
        ask(
          1,
          'sel',
          'leaving something special where everyone can share it',
          SOC,
          [BR('Why does the tablet stay in its box?')],
          [
            o(
              'So everyone can share it',
              [BR('Yes! Special things are for sharing, so we put them back.')],
              true,
            ),
            o('So nobody can ever see it', [
              BR('Not quite! It stays so anybody can open the box and see.'),
            ]),
          ],
          'Talked about leaving special things where others can enjoy them.',
        ),
      ],
    ),
    sc(
      'a26-01-complete',
      [
        N('The street is full of tired people.'),
        N('A drum goes boom, boom, boom. It never stops.'),
        N('Your Nubbin holds your leg. You are in the story now.'),
      ],
      [
        doit(
          1,
          'maths',
          'count three beats',
          'K.CC.B.4',
          'edu:count:drum-beats:3',
          [N('(Clap along: boom, boom, boom. Count your claps on your fingers.) How many? Three!')],
          'Counted three drum beats on fingers.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-2 The King Who Never Rests
const Q2 = quest(
  'a26-02',
  'The King Who Never Rests',
  {
    'a26-02-s1': {
      goal: 'Watch the king’s games in the big square.',
      hint: 'Follow the drum. Find a place by the well.',
    },
    'a26-02-s2': {
      goal: 'Go up to the temple with the people.',
      hint: 'At dusk the crowd climbs the steps. Go with the woman from the square.',
    },
  },
  [
    sc(
      'a26-02-games',
      [
        N('In the big square, young men run races and carry stones.'),
        N('Nobody looks happy. They look very, very tired.'),
        GI('Again! Faster! Nobody is tired!', 'happy'),
        N('This is Gilgamesh, king of Uruk. He is big and strong, and he never stops.'),
        TW('He has not let us go home for a month.', 'sad'),
        N('A boy sits down in the dust. He is too tired to get up.'),
      ],
      [
        ask(
          5,
          'health',
          'bodies need water and rest',
          PHYS,
          [N('What does the tired boy need?')],
          [
            o('A drink and a rest', [N('Yes! Bodies need water and rest to feel better.')], true),
            o('Another race', [
              N('Oh no! He needs a rest first. Bodies get tired when they run and run.'),
            ]),
            o('Nothing at all', [N('He needs something! A drink and a rest help a tired body.')]),
          ],
          'Talked about water and rest as things a tired body needs.',
        ),
      ],
      {
        choices: [
          ch('water', 'Take the boy some water from the well.', [
            N('You carry him a cup. He drinks it all and smiles.'),
          ]),
          ch('sit', 'Sit down in the dust beside him.', [
            N('You sit beside him. Your Nubbin sits too. So does his mum.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-02-games-done',
      [
        N('The king does not see. He starts another race.'),
        TW('Thank you. That was kind.', 'soft'),
      ],
      [
        ask(
          1,
          'sel',
          'noticing how kindness makes someone feel',
          'CASEL: Social awareness',
          [N('The boy’s mum smiles at you. How does she feel?')],
          [
            o(
              'Thankful',
              [N('Yes! She feels thankful. A kind act made her feel warm inside.')],
              true,
            ),
            o('Cross', [N('Look at her smile. She feels thankful, because you were kind.')]),
            o('Sleepy', [N('She might be sleepy! But her smile says she feels thankful.')]),
          ],
          'Noticed that being kind helps others feel thankful and cared for.',
        ),
      ],
    ),
    sc(
      'a26-02-clay',
      [
        N('At dusk, tired people climb the temple steps with lamps.'),
        TW('Please, gods. Give the king a friend his own size.', 'sad'),
        N('High in the sky, a goddess named Aruru washes her hands.'),
        N('She picks up a little wet clay and rolls it in her palms.'),
        N('Then she drops it gently, far away in the wild grass.'),
        N('Your Nubbin watches it fall, with its mouth open.'),
      ],
      [
        ask(
          3,
          'science',
          'clay is soft when wet and hard when it dries',
          '2-PS1-1',
          [N('Wet clay is soft and squishy. What happens when clay dries in the sun?')],
          [
            o(
              'It gets hard',
              [N('Yes! Clay gets hard when it dries. That is why people made bricks from it.')],
              true,
            ),
            o('It turns into water', [
              N('Not quite! Dry clay does not turn into water. It gets hard.'),
            ]),
            o('It grows legs', [N('Ha! No legs. Dry clay just gets hard.')]),
          ],
          'Learned that clay is soft when wet and hardens as it dries.',
        ),
      ],
      {
        choices: [
          ch('tell', 'Tell the woman what you saw.', [
            TW('Clay, in the wild? Well. I asked for help.', 'think'),
          ]),
          ch('keep', 'Keep it to yourself for now.', [N('The woman pats your arm kindly.')]),
        ],
      },
    ),
    sc(
      'a26-02-clay-done',
      [
        N('Far away, in the long grass, someone new opens his eyes.'),
        N('His name will be Enkidu.'),
      ],
      [
        ask(
          1,
          'literacy',
          'words that start with the same first sound',
          'RF.K.2',
          [N('Enkidu starts with the sound “eh”. Which word starts the same: egg, dog or sun?')],
          [
            o('Egg', [N('Yes! Egg, Enkidu. Eh, eh, eh!')], true),
            o('Dog', [N('Dog starts with “d”. Egg starts with “eh”, like Enkidu.')]),
            o('Sun', [N('Sun starts with “s”. Egg starts with “eh”, like Enkidu.')]),
          ],
          'Matched a first sound: egg and Enkidu.',
        ),
      ],
    ),
    sc(
      'a26-02-complete',
      [
        N('The drum goes boom in the square. The king still does not stop.'),
        N('Your Nubbin faces the wild. Its ears stand up.'),
      ],
      [
        ask(
          1,
          'social-studies',
          'fair rules: everyone needs a rest',
          'D2.Civ.8.K-2',
          [N('Is it fair to make everyone work and never rest?')],
          [
            o(
              'No. Everyone needs rest',
              [N('Yes! A fair rule gives everyone time to rest.')],
              true,
            ),
            o('Yes, it is fair', [
              N('Hmm. Everyone gets tired, so a fair rule lets everybody rest.'),
            ]),
          ],
          'Talked about why a fair rule gives everyone time to rest.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-3 The Wild Man
const HERD_DONE_BEAT = ask(
  2,
  'science',
  'animals live where their needs are met, such as a water hole',
  'K-ESS3-1',
  [N('Why do the gazelles come to this water hole?')],
  [
    o(
      'They need water to live',
      [N('Yes! Animals live and gather where they can find water and food.')],
      true,
    ),
    o('To play hide and seek', [
      N('Maybe a little! But mostly they come because they need water.'),
    ]),
  ],
  'Learned that animals gather where they can find what they need, such as water.',
);

const Q3 = quest(
  'a26-03',
  'The Wild Man',
  {
    'a26-03-s1': {
      goal: 'Go out to the water hole in the dry grass.',
      hint: 'Leave Uruk by the river gate. Follow the gazelle tracks.',
    },
    'a26-03-s2': {
      goal: 'Find out who dug the pits and what happened to them.',
      hint: 'Walk the edge of the grass. Look for filled-in pits.',
    },
  },
  [
    sc(
      'a26-03-herd',
      [
        N('Three days from the wall, the grass is dry and the sky is huge.'),
        N('At the water hole, four gazelles drink. A man drinks with them!'),
        N('He is hairy all over. He has never worn clothes.'),
        N('He eats grass with the gazelles. He is happy with them.'),
        N('Your Nubbin runs down and drinks beside the smallest gazelle.'),
        EN('Hhh?', 'think'),
        N('He looks at your Nubbin. Then he goes back to drinking.'),
      ],
      [
        doit(
          1,
          'maths',
          'count four gazelles',
          'K.CC.B.5',
          'edu:count:gazelles:4',
          [N('(Point and count the gazelles at the water. One, two, three, four!)')],
          'Counted four gazelles one by one.',
        ),
      ],
      {
        choices: [
          ch('let', 'Let your Nubbin stay with the herd.', [
            N('Your Nubbin lies down in the cool mud, happy.'),
          ]),
          ch('call', 'Call your Nubbin back.', [
            N('Your Nubbin flicks an ear. It stays right where it is.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-03-herd-done',
      [
        N('You sit under a thorn tree and watch.'),
        N('Your Nubbin is in the herd, nose to nose with a fawn.'),
        N('Enkidu strokes a gazelle’s ear, ever so gently.'),
      ],
      [HERD_DONE_BEAT],
    ),
    sc(
      'a26-03-pits',
      [
        N('At the edge of the grass there are pits to catch animals.'),
        N('Every pit has been filled in. Every net has been torn up.'),
        N('A man with a net comes over the hill. He stops and goes pale.'),
        TR('Every pit! Every net! I worked three days.', 'angry'),
        TR('A wild man did this. I cannot feed my family with empty nets.', 'sad'),
      ],
      [
        ask(
          4,
          'sel',
          'seeing how someone else feels, and being kind',
          'CASEL: Social awareness',
          [N('The man is upset about his family’s supper. How can we be kind?')],
          [
            o(
              'Say we are sorry he is upset',
              [TR('Thank you. That helps a little.', 'soft')],
              true,
            ),
            o('Laugh at him', [
              N('Oh dear. Laughing would hurt his feelings. Saying sorry is kinder.'),
            ]),
            o('Walk away', [N('He would feel all alone. Saying sorry is kinder.')]),
          ],
          'Practised noticing someone’s worry and answering kindly.',
        ),
      ],
      {
        choices: [
          ch('sorry', 'Tell him you are sorry about his work.', [
            TR('Thank you. I am sorry I am scared of him.', 'soft'),
          ]),
          ch('herd', 'Say the herd seemed happy.', [
            TR('Happy! Well, the gazelles are happy.', 'think'),
            N('Then he laughs, once.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-03-pits-done',
      [
        N('He runs off to the river with his net flapping.'),
        N('At the water, the wild man fills in another pit.'),
      ],
      [
        ask(
          1,
          'literacy',
          'why a character acts as he does',
          'RL.K.3',
          [N('Why does Enkidu fill in the pits?')],
          [
            o('He wants his animal friends to be safe', [N('Yes! He cares about them.')], true),
            o('He likes to dig', [N('Not quite! He fills them in to keep his friends safe.')]),
          ],
          'Thought about why a character does what he does.',
        ),
      ],
    ),
    sc(
      'a26-03-complete',
      [
        N('By evening the man is far away on the road to Uruk.'),
        N('Your Nubbin is still with the herd. It does not look round.'),
      ],
      [
        notice(
          0,
          'social-studies',
          'a map shows rivers and roads',
          'D2.Geo.2.K-2',
          [
            N('(On Nova’s map, find the wiggly blue line.)'),
            N('That is the river. The road runs beside it.'),
          ],
          'Found a river and a road on a simple map.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-4 Shamhat
const Q4 = quest(
  'a26-04',
  'Shamhat',
  {
    'a26-04-s1': {
      goal: 'Walk with the woman from the city to the water hole.',
      hint: 'Meet the trapper at the river gate. Carry her bundle.',
    },
    'a26-04-s2': {
      goal: 'Sit by the water until Enkidu knows her words.',
      hint: 'Sit by the water. Do not chase. It takes days.',
    },
    'a26-04-s3': {
      goal: 'Bring your Nubbin back from the herd.',
      hint: 'Go slowly. Let your Nubbin come to you.',
    },
  },
  [
    sc(
      'a26-04-road',
      [
        N('The trapper comes back with a woman from the city.'),
        SH('Hello! I am Shamhat. I teach people words and songs.', 'happy'),
        N('You carry her bundle. It smells of bread and sweet oil.'),
        N('Inside there are two flat loaves and three dates.'),
        SH('I do not want to boss him. I want to be his friend.'),
      ],
      [
        ask(
          3,
          'maths',
          'add two groups to make five',
          'K.OA.A.2',
          [N('Two loaves and three dates. How many foods in all?')],
          [
            o(
              'Five',
              [N('Yes! Two and three make five. Count them: one, two, three, four, five.')],
              true,
            ),
            o('Four', [
              N(
                'Let us count together: two loaves, then three dates. One, two, three, four, five. Five!',
              ),
            ]),
            o('Six', [N('Let us count together: one, two, three, four, five. Five!')]),
          ],
          'Added two and three to make five.',
        ),
      ],
      {
        choices: [
          ch('how', 'Ask how she will do it.', [
            SH('I will sit where he can see me, and wait.', 'soft'),
          ]),
          ch('nubbin', 'Tell her your Nubbin ran off with the herd.', [
            SH('Then we have the same job, you and I.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-04-sit',
      [
        N('Shamhat sits on a flat rock by the water. You sit a little way off.'),
        N('On the first day, Enkidu peeks from behind a gazelle.'),
        N('On the second day, he comes closer and sniffs the bread.'),
        SH('This is bread. This is my hand. That is yours.'),
        N('By the fourth day, he sits across from her.'),
        EN('Hand.', 'think'),
        SH('Yes! Hand! And what is your name?', 'happy'),
        EN('Enkidu.'),
      ],
      [
        ask(
          4,
          'sel',
          'waiting patiently helps a friend feel safe',
          'CASEL: Relationship skills',
          [N('Shamhat does not chase Enkidu. She sits and waits. Why does waiting help?')],
          [
            o(
              'He feels safe and comes when he is ready',
              [N('Yes! Waiting kindly helps a friend feel safe.')],
              true,
            ),
            o('Waiting does nothing', [N('Look what happened! Waiting helped him feel safe.')]),
          ],
          'Talked about why patient waiting helps someone feel safe.',
        ),
      ],
    ),
    sc(
      'a26-04-sit-done',
      [
        N('He says it again, louder. Then he laughs a big laugh.'),
        SH('There you are! I knew you were in there.', 'happy'),
      ],
      [
        ask(
          1,
          'literacy',
          'words that start with the same sound: hand and hat',
          LANG,
          [N('Enkidu’s first word was “hand”. Which word starts the same: hat, sun or cup?')],
          [
            o('Hat', [N('Yes! Hand, hat. Huh, huh, huh!')], true),
            o('Sun', [N('Sun starts with “s”. Hand starts with “h”, like hat.')]),
            o('Cup', [N('Cup starts with “k”. Hand starts with “h”, like hat.')]),
          ],
          'Matched the first sound of “hand” with “hat”.',
        ),
      ],
    ),
    sc(
      'a26-04-coax',
      [
        N('Enkidu walks to the gazelles, the way he always has.'),
        N('They lift their heads. They sniff. Then they run away.'),
        EN('Wait! It is me!', 'sad'),
        N('Your Nubbin has been left behind too. It sits alone in the grass.'),
        SH('Go to yours. I will go to mine.', 'soft'),
      ],
      [
        ask(
          1,
          'science',
          'animals use their noses and eyes to tell who is who',
          SCI,
          [N('How do gazelles know who is who?')],
          [
            o(
              'They use their noses and eyes',
              [N('Yes! Animals sniff and look. Enkidu smells like a person now.')],
              true,
            ),
            o('They read name tags', [N('Ha! No name tags. They use their noses and eyes.')]),
          ],
          'Learned that animals use senses like smell and sight to know each other.',
        ),
      ],
      {
        choices: [
          ch('call', 'Call its name.', [N('Your Nubbin thinks about it. Then it runs to you.')]),
          ch('wait', 'Sit down in the grass and wait.', [
            N('You wait. Then there is a warm weight against your side.'),
          ]),
          ch('date', 'Hold out a date from the bundle.', [
            N('Your Nubbin comes for the date and stays for you.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-04-coax-done',
      [
        N('Enkidu sits with his head in his hands. Shamhat sits beside him.'),
        N('She says nothing. After a while, he leans on her shoulder.'),
      ],
      [
        ask(
          1,
          'sel',
          'what helps when we feel sad',
          'CASEL: Self-awareness',
          [N('Enkidu is sad. What helps when we are sad?')],
          [
            o(
              'A friend sitting close',
              [N('Yes! Sitting close, with no words, can help a lot.')],
              true,
            ),
            o('Being all alone', [
              N('Sometimes we want a little quiet. But a friend nearby helps most.'),
            ]),
          ],
          'Named sadness and what helps: a friend sitting close.',
        ),
      ],
    ),
    sc(
      'a26-04-complete',
      [
        SH('You lost the herd. But you found the whole world.', 'soft'),
        EN('Will it run away from me too?', 'sad'),
        SH('Some of it. Not the best of it.'),
        N('She takes his hand. They walk to the shepherds.'),
      ],
      [
        ask(
          1,
          'literacy',
          'words that tell a feeling',
          'RL.1.4',
          [N('Enkidu’s voice is wobbly. Which word tells how he feels: sad, purple or round?')],
          [
            o('Sad', [N('Yes! “Sad” is a feeling word.')], true),
            o('Purple', [N('Purple is a colour. “Sad” is the feeling word.')]),
            o('Round', [N('Round is a shape. “Sad” is the feeling word.')]),
          ],
          'Picked out a word that names a feeling.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-5 Bread and Ale
const Q5 = quest(
  'a26-05',
  'Bread and Barley',
  {
    'a26-05-s1': {
      goal: 'Help the shepherds give Enkidu his first supper.',
      hint: 'Carry the bread and the jugs from the fire.',
    },
    'a26-05-s2': {
      goal: 'Keep watch over the sheep with Enkidu at night.',
      hint: 'Take a lamp to the sheepfold and stay up with him.',
    },
  },
  [
    sc(
      'a26-05-bread',
      [
        N('The shepherds’ camp is a ring of tents and a warm fire.'),
        SP('Sit down, friend! You must be hungry.'),
        N('You set down a round loaf and a jug of barley drink.'),
        EN('What is this?', 'think'),
        SH('That is bread. People eat it. Go on!'),
        N('He sniffs the bread. He licks it. Slurp!'),
        N('He takes a tiny bite. Crunch! His eyebrows jump up.'),
        EN('More!'),
        N('Your Nubbin licks its own bread too, to be polite.'),
        N('He eats until he is full. Then he sings a song with no words.'),
      ],
      [
        ask(
          9,
          'science',
          'bread comes from a plant that grows grain',
          SCI,
          [N('Bread is made from flour. Flour is made from grain. Where does grain start?')],
          [
            o(
              'A plant growing in a field',
              [N('Yes! Grain grows on plants, in fields, with sun and water.')],
              true,
            ),
            o('A cloud', [N('Not quite! Grain grows on plants in a field.')]),
            o('A rock', [N('Not quite! Grain grows on plants. Plants need sun and water.')]),
          ],
          'Learned that bread starts as a plant growing grain.',
        ),
      ],
      {
        choices: [
          ch('clap', 'Clap along.', [N('You clap. The shepherds clap. Your Nubbin hops in time.')]),
          ch('bread', 'Break your own loaf with your Nubbin.', [
            N('Enkidu watches. Then he shares his loaf too.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-05-bread-done',
      [
        N('Afterwards, the shepherds trim his hair. He washes in the stream.'),
        N('He rubs oil on his skin. Shamhat gives him clothes.'),
        SP('Look at him!', 'happy'),
      ],
      [
        ask(
          2,
          'health',
          'washing keeps us clean and healthy',
          PHYS,
          [N('Enkidu washed in the stream. Why do we wash?')],
          [
            o(
              'To get clean and stay healthy',
              [N('Yes! Washing takes away dirt and germs.')],
              true,
            ),
            o('To make the water dirty', [
              N('Ha! The water does get dirty, but we wash to get clean.'),
            ]),
          ],
          'Talked about washing to stay clean and healthy.',
        ),
      ],
    ),
    sc(
      'a26-05-night',
      [
        N('That night the shepherds sleep. Enkidu keeps watch on the wall.'),
        N('Stars shine over the sheepfold.'),
        EN('I know the wolves. I used to drink beside them.'),
        N('Shadows move at the edge of the grass.'),
        N('Enkidu speaks to them, not in words. They turn and go.'),
        EN('They know whose side I am on now.', 'sad'),
      ],
      [
        ask(
          1,
          'science',
          'stars shine at night',
          '1-ESS1-1',
          [N('The stars are out and it is dark. Is it day or night?')],
          [
            o('Night', [N('Yes! We see stars at night.')], true),
            o('Day', [N('In the day the sun shines. Stars come out at night.')]),
          ],
          'Told night from day using stars.',
        ),
      ],
      {
        choices: [
          ch('lamp', 'Hold the lamp up anyway.', [
            EN('That is for the sheep, so they know someone is here.', 'happy'),
          ]),
          ch('sit', 'Sit beside him on the wall.', [
            N('Your Nubbin climbs between you and falls asleep.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-05-night-done',
      [
        N('Five little lambs sleep safe in the fold.'),
        N('Every night after that, no lamb is lost. They call Enkidu “the watchman”.'),
      ],
      [
        doit(
          0,
          'maths',
          'count five lambs',
          'K.CC.B.5',
          'edu:count:lambs:5',
          [N('(Count the lambs in the fold. One, two, three, four, five!)')],
          'Counted five lambs.',
        ),
      ],
    ),
    sc(
      'a26-05-complete',
      [
        N('One morning a traveller walks by. He grumbles about the king who never rests.'),
        EN('Someone should tell the king to stop.', 'angry'),
        SH('Someone should. Shall we go to the city?'),
        N('Enkidu looks at the sheep, then at you. He nods.'),
      ],
      [
        ask(
          3,
          'sel',
          'choosing a kind way to help',
          'CASEL: Responsible decision-making',
          [N('Enkidu wants the king to stop. What is a good first step?')],
          [
            o('Go and talk to him', [N('Yes! Talking first is a good start.')], true),
            o('Shout from far away', [
              N('Shouting from far away will not help. Talking face to face is better.'),
            ]),
          ],
          'Thought about a kind first step when something is unfair.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-6 Ninsun's Dreams
const Q6 = quest(
  'a26-06',
  'Ninsun’s Dreams',
  {
    'a26-06-s1': {
      goal: 'Carry the cups to the queen mother’s hall.',
      hint: 'The palace steward needs help. Take the tray.',
    },
    'a26-06-s2': {
      goal: 'Stay and hear what Ninsun says about the dreams.',
      hint: 'Stand by the fountain with the tray.',
    },
  },
  [
    sc(
      'a26-06-cups',
      [
        N('The palace steward gives you a tray of silver cups.'),
        N('There are five cups on the tray. They shine.'),
        N('Ninsun’s hall is cool and quiet, with a fountain.'),
        GI('Mother, I had a dream. A star fell from the sky.', 'think'),
        GI('I could not lift it. But I loved it.'),
        N('You hold out the tray. He takes one cup and forgets to give it back.'),
      ],
      [
        ask(
          5,
          'maths',
          'take one away from five',
          'K.OA.A.1',
          [N('There were five cups. Gilgamesh took one. How many are left on the tray?')],
          [
            o('Four', [N('Yes! Five take away one leaves four.')], true),
            o('Three', [N('Let us count: one, two, three, four. Four cups are left.')]),
            o('Five', [N('One cup is gone. Count the rest: one, two, three, four. Four!')]),
          ],
          'Took one away from five.',
        ),
      ],
      {
        choices: [
          ch('wait', 'Wait with the tray until he has finished.', [
            N('Ninsun’s mouth turns up at the corner.'),
          ]),
          ch('ninsun', 'Offer Ninsun a cup too.', [
            NI('Thank you. Someone remembers the rest of us drink as well.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-06-cups-done',
      [
        NI('Sit down, my son. You are walking up and down, up and down.'),
        N('Gilgamesh sits at last.'),
      ],
      [
        ask(
          1,
          'literacy',
          'words that rhyme',
          'RF.K.2',
          [N('Down. Which word rhymes with down: town, cup or sun?')],
          [
            o('Town', [N('Yes! Down, town. They rhyme!')], true),
            o('Cup', [N('Cup does not sound like down. Town does!')]),
            o('Sun', [N('Sun does not sound like down. Town does!')]),
          ],
          'Found a rhyme for “down”.',
        ),
      ],
    ),
    sc(
      'a26-06-meaning',
      [
        GI('There was an axe in the street. I loved it too.'),
        NI('The star and the axe are the same. They mean a friend.'),
        NI('A friend is coming to you. He will stand beside you.'),
        GI('A friend? I have a whole city.', 'think'),
        NI('You have a city that is tired of you.', 'soft'),
        N('Gilgamesh opens his mouth. Then he shuts it again.'),
      ],
      [
        ask(
          5,
          'sel',
          'what makes a friend',
          'CASEL: Relationship skills',
          [N('What is a friend?')],
          [
            o(
              'Someone kind to you, and you to them',
              [N('Yes! Friends are kind to each other.')],
              true,
            ),
            o('Someone who does what you say', [
              N('Not quite! A friend is kind, and listens too.'),
            ]),
            o('Anyone in a crowd', [
              N('A crowd is lots of people. A friend is someone kind to you.'),
            ]),
          ],
          'Talked about what makes a friend.',
        ),
      ],
      {
        choices: [
          ch('true', 'Tell him you think she is right.', [
            GI('Do you? Hm. You may have seen more of my city than I have.', 'think'),
          ]),
          ch('quiet', 'Say nothing, and refill his cup.', [
            N('He looks at you as if he had just noticed you.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-06-complete',
      [
        GI('Who are you? Whose are you?'),
        Y('Nobody’s. I am new here.'),
        GI('Stay new. Carry my cups.'),
        N('That night the drum stops early. A thin moon hangs over Uruk.'),
      ],
      [
        ask(
          3,
          'science',
          'the Moon shines in the night sky',
          '1-ESS1-1',
          [N('A thin moon hangs in the dark sky. When do we often see the moon?')],
          [
            o('At night', [N('Yes! We often see the moon at night, and the sun by day.')], true),
            o('Only at lunchtime', [N('The moon shines at night. The sun shines by day.')]),
          ],
          'Linked the Moon with the night sky.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-7 The Door
const Q7 = quest(
  'a26-07',
  'The Door',
  {
    'a26-07-s1': {
      goal: 'Meet Enkidu and Shamhat at the gate. Bring them into the city.',
      hint: 'They are coming up the river road. Wait at the great gate.',
    },
    'a26-07-s2': {
      goal: 'Watch the two of them meet at the door.',
      hint: 'Stand back in the crowd. Keep your Nubbin out of the way.',
    },
  },
  [
    sc(
      'a26-07-gate',
      [
        N('Enkidu walks up the river road in borrowed clothes.'),
        N('Shamhat walks beside him. People stop work to stare.'),
        TW('Look at him! He is the king’s size exactly.'),
        N('Enkidu sees you by the gate. He grins.'),
        EN('The water-carrier! With the little one from my gazelles!', 'happy'),
        N('Your Nubbin hides behind your leg.'),
        SH('He wants to meet your king.'),
      ],
      [
        ask(
          6,
          'social-studies',
          'people live beside rivers for water and food',
          'D2.Geo.2.K-2',
          [N('Uruk and its road are beside a river. Why do people live by rivers?')],
          [
            o(
              'For water to drink and to grow food',
              [N('Yes! A river gives people water for drinking and for growing crops.')],
              true,
            ),
            o('To hide from the sun', [
              N('Not quite! People live by rivers for water to drink and to grow food.'),
            ]),
          ],
          'Learned that people settle beside rivers for drinking water and farming.',
        ),
      ],
      {
        choices: [
          ch('warn', 'Warn him the king is very strong.', [
            EN('Good. So am I. Someone should tell him.'),
          ]),
          ch('gentle', 'Tell him the king is lonely.', [
            EN('Lonely?', 'think'),
            N('He knows that word from the day the herd ran.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-07-gate-done',
      [
        N('The crowd follows you through the streets, and it grows and grows.'),
        N('There were three people at the gate. Now there are nine in the big square.'),
      ],
      [
        ask(
          1,
          'maths',
          'which group has more',
          'K.CC.C.6',
          [N('Three people at the gate. Nine people in the square. Where are there more?')],
          [
            o('In the square', [N('Yes! Nine is more than three.')], true),
            o('At the gate', [
              N('Count again: the gate has three. The square has nine. Nine is more!'),
            ]),
          ],
          'Compared three and nine to say which has more.',
        ),
      ],
    ),
    sc(
      'a26-07-door',
      [
        N('Gilgamesh strides across the square to a big door.'),
        N('Enkidu stands in the doorway and plants his feet.'),
        GI('Out of my way.'),
        EN('No.'),
        N('Gilgamesh stops. Nobody has said no to him before.'),
        N('Then they grab each other and push and pull, push and pull.'),
        N('The doorposts shake. Dust falls from the roofs.'),
        N('At last Gilgamesh’s knee touches the ground.'),
      ],
      [
        ask(
          5,
          'science',
          'a push or a pull makes things move',
          SCI,
          [N('The friends push and pull. What makes something move?')],
          [
            o(
              'A push or a pull',
              [N('Yes! A push or a pull can make things move, or stop.')],
              true,
            ),
            o('Wishing very hard', [
              N('Not quite! Things move when something pushes or pulls them.'),
            ]),
          ],
          'Learned that pushes and pulls make things move.',
        ),
      ],
      {
        choices: [
          ch('hold', 'Hold your Nubbin back from the fight.', [
            N('You scoop up your Nubbin. It cheers for both sides at once.'),
          ]),
          ch('cover', 'Pull the woman from the square out of the dust.', [
            N('You pull her under an awning. She grips your arm.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-07-door-done',
      [
        N('Gilgamesh kneels in the dust, breathing hard.'),
        N('Then he laughs, and Enkidu laughs too.'),
        N('Enkidu holds out a hand, and the king takes it.'),
      ],
      [
        ask(
          2,
          'sel',
          'making up after a quarrel',
          'CASEL: Relationship skills',
          [N('They pushed, then they laughed. What helps friends after a quarrel?')],
          [
            o(
              'Making up and being kind',
              [N('Yes! Friends make up, and they are kind again.')],
              true,
            ),
            o('Staying cross for ever', [
              N('That would be a long time to be cross! Making up feels better.'),
            ]),
          ],
          'Talked about making up with a friend after a quarrel.',
        ),
      ],
    ),
    sc(
      'a26-07-complete',
      [
        GI('Where have you been all my life?', 'happy'),
        EN('Eating grass, mostly.'),
        NI('You are my son now, and his brother.', 'soft'),
        N('Enkidu has never had a mother. He does not know where to put his hands.'),
        N('Your Nubbin shows him. It climbs into her lap.'),
      ],
      [
        ask(
          3,
          'literacy',
          'words that show a feeling',
          'RL.1.4',
          [N('Enkidu does not know where to put his hands. How does he feel?')],
          [
            o('Shy and surprised', [N('Yes! “Shy” and “surprised” are feeling words.')], true),
            o('Sleepy and hungry', [
              N(
                'He might be! But not knowing where to put his hands shows he feels shy and surprised.',
              ),
            ]),
          ],
          'Named feelings shown by what a character does.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-8 The Cedar Forest
const Q8 = quest(
  'a26-08',
  'The Cedar Forest',
  {
    'a26-08-s1': {
      goal: 'Bring water to the friends on the palace roof.',
      hint: 'Fill the jar at the palace well. Climb up to the roof.',
    },
    'a26-08-s2': {
      goal: 'Go with the friends to the elders, then up to Ninsun’s roof.',
      hint: 'The elders meet at the city gate. Ninsun looks at the sun at sunrise.',
    },
    'a26-08-s3': {
      goal: 'Pack the bread for the road while the smiths make the axes.',
      hint: 'Go to the bakehouse. Then carry the packs to the gate.',
    },
  },
  [
    sc(
      'a26-08-plan',
      [
        N('You carry water up to the roof. The friends lie looking at the sky.'),
        GI('Let us do something big. Let us visit the Cedar Forest!', 'happy'),
        N('Enkidu sits up. He is afraid.'),
        EN('I know that forest. Its guard is very scary.', 'shock'),
        GI('Are you frightened? I will go first.'),
      ],
      [
        ask(
          4,
          'sel',
          'telling a friend when you feel scared',
          'CASEL: Self-awareness',
          [N('Enkidu feels scared. What can he do with a scared feeling?')],
          [
            o(
              'Tell a friend he is scared',
              [N('Yes! Saying “I am scared” out loud can help.')],
              true,
            ),
            o('Pretend nothing is wrong', [
              N('Pretending can make a worry bigger. Telling a friend helps.'),
            ]),
          ],
          'Talked about saying out loud that you feel scared.',
        ),
      ],
      {
        choices: [
          ch('why', 'Ask why he wants to go.', [
            GI('So people remember me.'),
            N('Enkidu looks at you, hoping you know.'),
          ]),
          ch('water', 'Pour them both a cup and say nothing.', [
            N('Enkidu holds his cup without drinking. His hands shake.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-08-plan-done',
      [
        N('You pour water for both friends. The jug is big, and the cup is small.'),
        EN('If you go, I will go. Someone must bring you home.', 'sad'),
      ],
      [
        ask(
          0,
          'maths',
          'compare which holds more',
          'K.MD.A.2',
          [N('Which holds more water: the big jug or the little cup?')],
          [
            o('The big jug', [N('Yes! The big jug holds more.')], true),
            o('The little cup', [N('Look again. The big jug is bigger, so it holds more.')]),
          ],
          'Compared two containers to see which holds more.',
        ),
      ],
    ),
    sc(
      'a26-08-elders',
      [
        N('The elders sit on benches by the gate. They listen to Gilgamesh.'),
        EL('You are young. Your heart runs ahead of you.'),
        EL('Let Enkidu go first. He knows the road.', 'soft'),
        N('At sunrise, Ninsun climbs her roof in her best robe.'),
        NI('Please watch over my son. Bring him home.', 'sad'),
      ],
      [
        ask(
          2,
          'social-studies',
          'listening to people who know the way',
          'D2.Civ.8.K-2',
          [
            N(
              'The elders say Enkidu should lead because he knows the road. Why listen to someone who knows?',
            ),
          ],
          [
            o(
              'They can help us stay safe',
              [N('Yes! Listening to people who know the way helps us stay safe.')],
              true,
            ),
            o('They are bossy', [
              N('They are being careful. Listening to them helps us stay safe.'),
            ]),
          ],
          'Talked about listening to people who know more about the road.',
        ),
      ],
      {
        choices: [
          ch('bow', 'Bow your head while she prays.', [
            N('You bow your head. Your Nubbin does too, and peeks.'),
          ]),
          ch('watch', 'Watch the sun come up.', [
            N('The sun is huge and gold. It seems to look right back.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-08-elders-done',
      [
        N('The sun climbs up, big and gold, over the roof.'),
        NI('Enkidu, I am giving him to you to look after. Bring him home.', 'soft'),
      ],
      [
        ask(
          0,
          'science',
          'the Sun comes up in the morning',
          '1-ESS1-1',
          [N('The sun is coming up. Is it morning or night?')],
          [
            o('Morning', [N('Yes! The sun comes up in the morning, in the east.')], true),
            o('Night', [N('At night the sun is down. It comes up in the morning, in the east.')]),
          ],
          'Learned that the sun comes up in the morning.',
        ),
      ],
    ),
    sc(
      'a26-08-pack',
      [
        N('All morning the smiths’ hammers ring. Clang, clang!'),
        N('Your job is bread. You pack six flat loaves into two packs.'),
        N('You put the soft things on top, so nothing gets squashed.'),
        GI('Bread? I am off on an adventure!'),
        EN('You always need bread. That is the first thing I learned about people.'),
        N('Enkidu checks the pack and nods.'),
      ],
      [
        ask(
          1,
          'maths',
          'share six into two equal groups',
          M,
          [N('Six loaves go into two packs, the same in each. How many loaves in one pack?')],
          [
            o('Three', [N('Yes! Three and three make six.')], true),
            o('Two', [
              N('Let us share one at a time: one, one, two, two, three, three. Three each!'),
            ]),
            o('Six', [N('Six is all of them. Shared into two packs, there are three in each.')]),
          ],
          'Shared six loaves into two equal packs.',
        ),
      ],
      {
        choices: [
          ch('extra', 'Pack an extra loaf, just in case.', [
            EN('Good. That one is for coming home.'),
          ]),
          ch('water', 'Fill the waterskins too.', [
            N('You fill them at the well. You are a good water-carrier.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-08-complete',
      [
        N('The whole city comes to the gate to say goodbye.'),
        EL('Go safely, and come home soon.'),
        N('You go too, with your Nubbin on the pack.'),
        N('The wall of Uruk gets smaller and smaller, then it is gone.'),
      ],
      [
        doit(
          1,
          'literacy',
          'clap the three parts of a name',
          'RF.K.2',
          'edu:clap:syllables:gilgamesh',
          [N('(Clap the parts of the king’s name: Gil-ga-mesh.)'), N('How many claps? Three!')],
          'Clapped the syllables of Gilgamesh.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-9 Dreams on the Mountain
const Q9 = quest(
  'a26-09',
  'Dreams on the Mountain',
  {
    'a26-09-s1': {
      goal: 'Make camp on the mountain and keep the fire.',
      hint: 'Gather brush on the slope. Build the fire in the hollow.',
    },
    'a26-09-s2': {
      goal: 'Keep watch through the nights on the road.',
      hint: 'Sit up by the fire while the friends sleep.',
    },
  },
  [
    sc(
      'a26-09-fire',
      [
        N('Every evening the friends climb a hill. Then you make camp.'),
        N('You gather brush and build a fire. Enkidu builds a little brush shelter.'),
        N('In the night Gilgamesh sits up with a start.'),
        GI('I dreamed a mountain fell on me. I am cold all over.', 'shock'),
        EN('A good dream! The mountain will fall, and we will stand on it.', 'happy'),
      ],
      [
        ask(
          1,
          'science',
          'a fire needs wood to keep burning',
          SCI,
          [N('A fire needs wood to keep burning. What should we add to keep it going?')],
          [
            o('More wood', [N('Yes! Wood is the fuel. More wood keeps the fire going.')], true),
            o('Water', [N('Oh no! Water would put the fire out. We add wood.')]),
          ],
          'Learned that a fire needs wood as fuel to keep burning.',
        ),
      ],
      {
        choices: [
          ch('fire', 'Build the fire up higher.', [
            N('You add more brush. The fire jumps up, and the dark backs off.'),
          ]),
          ch('blanket', 'Put your blanket over the king.', [
            N('He does not notice. In the morning he will think he dreamed it.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-09-fire-done',
      [
        N('Enkidu waits until the king is snoring. He looks at you across the fire.'),
        N('His face is not happy at all.'),
      ],
      [
        ask(
          1,
          'sel',
          'noticing a friend’s feelings from their face',
          'CASEL: Social awareness',
          [N('Enkidu looks at you. How can you tell he is worried?')],
          [
            o(
              'His face looks sad and tight',
              [N('Yes! Faces show feelings. A worried face tells us someone needs a friend.')],
              true,
            ),
            o('He is smiling', [N('Look again: he is not smiling. His face looks worried.')]),
          ],
          'Read a friend’s feelings from a face.',
        ),
      ],
    ),
    sc(
      'a26-09-watch',
      [
        N('Every night is the same: a mountain, a dream, a cold wake.'),
        N('Every morning, Enkidu says it was a good dream.'),
        N('On the fifth night, Enkidu sits down beside you at the fire.'),
        EN('They were scary dreams. But I say they were good.', 'sad'),
        EN('A friend should not go to a big day feeling scared. So I cheer him up.'),
      ],
      [
        doit(
          2,
          'maths',
          'count five nights',
          'K.CC.B.5',
          'edu:count:nights:5',
          [N('(Count the nights on your fingers: one, two, three, four, five!)')],
          'Counted five nights on fingers.',
        ),
      ],
      {
        choices: [
          ch('right', 'Tell him he did the right thing.', [
            EN('Did I? I hope so. I am new at friends.'),
          ]),
          ch('you', 'Ask him who tells him the dreams are good.', [
            EN('Nobody. That is all right. I have you, keeping the fire.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-09-watch-done',
      [
        N('He falls asleep sitting up. You keep the fire until dawn.'),
        N('In the morning there is a dark green line on the hill.'),
        N('It smells fresh and piney, like a newly cut log.'),
      ],
      [
        ask(
          2,
          'literacy',
          'using words for what our senses tell us',
          'RL.1.4',
          [N('Which part of you smells the piney forest?')],
          [
            o('Your nose', [N('Yes! Your nose smells. “Piney” is a smell word.')], true),
            o('Your knees', [N('Not quite! Your nose does the smelling.')]),
          ],
          'Linked a smell word with the sense of smell.',
        ),
      ],
    ),
    sc(
      'a26-09-complete',
      [
        N('The cedars are taller than the wall of Uruk.'),
        N('Their shade is cool and deep, like water.'),
        GI('There! Good dreams, every one.', 'happy'),
        N('Enkidu says nothing. He puts his hand on the first cedar.'),
      ],
      [
        ask(
          1,
          'science',
          'plants need sun and water to grow',
          'K-LS1-1',
          [N('Cedar trees grow very tall. What do trees need to grow?')],
          [
            o('Sun and water', [N('Yes! Plants need sunlight and water to grow.')], true),
            o('Sweets and toys', [N('Ha! No. Trees need sunlight and water.')]),
          ],
          'Learned that trees need sun and water to grow.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-10 Humbaba
const Q10 = quest(
  'a26-10',
  'Humbaba',
  {
    'a26-10-s1': {
      goal: 'Follow the friends into the Cedar Forest.',
      hint: 'Keep to the wide path between the trees. Stay behind Enkidu.',
    },
    'a26-10-s2': {
      goal: 'Stand by while Humbaba asks for help. Decide what to say.',
      hint: 'Stay close to the friends. Choose what to say when the king looks round.',
    },
    'a26-10-s3': {
      goal: 'Help send the great cedar down the river.',
      hint: 'Carry the ropes to the river. Help tie the raft.',
    },
  },
  [
    sc(
      'a26-10-forest',
      [
        N('A wide, clean path runs into the forest.'),
        N('The cedars smell of sap. No birds sing.'),
        GI('This one is the tallest. Let us see if he comes.'),
        N('Gilgamesh cuts into a tree. The sound rolls through the forest.'),
        N('Far away, something roars.'),
        HU('Who is in my forest?', 'angry'),
        N('Then he is there, huge and old, with a face like wool.'),
      ],
      [
        notice(
          6,
          'social-studies',
          'where cedar forests grow today, on a map',
          'D2.Geo.2.K-2',
          [
            N('(Find Lebanon on Nova’s map.)'),
            N('Cedar trees grow on its mountains. The forest in the story may have been like it.'),
          ],
          'Heard where cedar trees still grow and found it on a map.',
        ),
      ],
      {
        choices: [
          ch('still', 'Stand very still.', [N('His eyes pass over you and move on.')]),
          ch('hide', 'Pull your Nubbin behind a cedar.', [
            N('The bark is warm. The tree seems to breathe.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-10-forest-done',
      [
        GI('Shamash, help us now!', 'shock'),
        N('Your Nubbin’s knees wobble. Your heart goes thump, thump.'),
      ],
      [
        ask(
          1,
          'health',
          'slow breaths help when we feel scared',
          'CASEL: Self-management',
          [N('Your heart goes thump. What helps you calm down?')],
          [
            o(
              'Slow, deep breaths',
              [N('Yes! Breathe in slowly, and out slowly. (Try it together.)')],
              true,
            ),
            o('Shouting loudly', [
              N('Shouting can make the thumping faster. Slow breaths help more.'),
            ]),
          ],
          'Practised slow breaths to calm a scared feeling.',
        ),
      ],
    ),
    sc(
      'a26-10-plea',
      [
        N('A voice comes out of the sun. Then great winds come from every side.'),
        N('The winds hold Humbaba still, like a hand on a leaf.'),
        HU('Please let me live. I will look after the forest.', 'sad'),
        HU('This forest is all I have.'),
        N('Gilgamesh lowers his axe. He looks at Humbaba for a long time.'),
        EN('Do not listen to him! Go on! Make your name!', 'angry'),
        N('Gilgamesh turns his head and looks at you.'),
      ],
      [
        ask(
          6,
          'sel',
          'being kind to someone who is frightened',
          'CASEL: Responsible decision-making',
          [N('Humbaba is frightened and asks for help. What could you say?')],
          [
            o(
              'Say something kind, and ask for mercy',
              [N('Yes. Kind words can help a frightened one.')],
              true,
            ),
            o('Say nothing, because I am not sure', [
              N('That is all right too. It is hard to know what is right when you are scared.'),
            ]),
          ],
          'Talked about being kind to someone who is frightened.',
        ),
      ],
      {
        choices: [
          ch(
            'spoke',
            'Speak for Humbaba: let him go.',
            [
              Y('Please let him go. He is only looking after his trees.'),
              N('Gilgamesh’s axe drops lower. For a long breath, nobody moves.'),
            ],
            { 'a26-humbaba': 'spoke' },
          ),
          ch(
            'silent',
            'Say nothing.',
            [N('You do not know what is right. You hold your Nubbin. Gilgamesh looks away.')],
            { 'a26-humbaba': 'silent' },
          ),
        ],
        defaultChoice: 'silent',
      },
    ),
    sc(
      'a26-10-plea-done',
      [
        N('Gilgamesh has already decided. He steps forward into the wind.'),
        N('You hide your face in your Nubbin’s fur.'),
        N('The great winds drop, all at once.'),
        N('The forest goes very quiet. Humbaba has died.'),
        N('That is a sad thing, and it cannot be undone.'),
        N('It is all right to feel sad. Your Nubbin snuggles close.'),
      ],
      [
        ask(
          5,
          'health',
          'what helps when a sad thing happens',
          'CASEL: Self-awareness',
          [N('Something sad happened. What helps when we feel sad?')],
          [
            o(
              'A cuddle, and telling a grown-up',
              [N('Yes. A cuddle helps, and so does telling a grown-up how you feel.')],
              true,
            ),
            o('Pretending it did not happen', [
              N('Pretending is hard work. A cuddle and a grown-up to talk to help more.'),
            ]),
          ],
          'Talked about what helps after something sad: a cuddle, and telling a grown-up.',
        ),
      ],
    ),
    sc(
      'a26-10-river',
      [
        N('Afterwards, nobody talks much. The friends cut cedars and tie logs.'),
        N('Your Nubbin brings one twig at a time to the raft.'),
        N('At last the raft is ready. Three big logs are tied side by side.'),
        N('The friends push it into the river. It turns, and floats home.'),
        N('Your Nubbin sits at the back. It watches the forest get small.'),
      ],
      [
        doit(
          2,
          'maths',
          'count three logs',
          'K.CC.B.5',
          'edu:count:logs:3',
          [N('(Count the big logs on the raft: one, two, three!)')],
          'Counted three logs on a raft.',
        ),
      ],
      {
        choices: [
          ch('cone', 'Keep a cedar cone in your pocket.', [
            N('It smells of the forest all the way home.'),
          ]),
          ch('look', 'Look back at the forest until it is gone.', [
            N('You look back until it is only a dark line, then nothing.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-10-complete',
      [
        N('The river carries you home through the reeds.'),
        N('A heron stands on one leg and watches the raft float by.'),
        N('Gilgamesh has made his name. It does not fit him quite right.'),
      ],
      [
        ask(
          2,
          'literacy',
          'words that show a feeling',
          'RL.1.4',
          [N('Gilgamesh has made his name, but he does not look happy. How might he feel?')],
          [
            o('Sorry and quiet', [N('Yes! “Sorry” and “quiet” fit how he looks.')], true),
            o('Excited and silly', [
              N('Look at his face. He is not silly. He looks sorry and quiet.'),
            ]),
          ],
          'Named a character’s feelings from how he looks.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-11 Ishtar
const Q11 = quest(
  'a26-11',
  'Ishtar',
  {
    'a26-11-s1': {
      goal: 'Fetch warm water for the king to wash.',
      hint: 'Heat water in the palace kitchen. Carry it to the king’s rooms.',
    },
    'a26-11-s2': {
      goal: 'Stand by while the goddess Ishtar speaks to the king.',
      hint: 'Stay by the door with your Nubbin.',
    },
  },
  [
    sc(
      'a26-11-wash',
      [
        N('Back in Uruk, Gilgamesh asks for warm water.'),
        N('You carry it up, jar after jar. The room fills with steam.'),
        N('He washes the forest out of his hair and puts on his crown.'),
        GI('Do I look like a king who has made a name?'),
        EN('You look like a king who has had a bath.', 'happy'),
        N('Then the light goes gold and strange. Your Nubbin’s fur stands up.'),
      ],
      [
        ask(
          1,
          'science',
          'hot water makes steam',
          SCI,
          [N('Hot water makes steam. Is steam hot or cold?')],
          [
            o('Hot', [N('Yes! Steam is hot. Be careful of it.')], true),
            o('Cold', [N('Not quite! Steam comes from hot water, so it is hot.')]),
          ],
          'Learned that steam comes from hot water and is hot.',
        ),
      ],
      {
        choices: [
          ch('cloth', 'Hand Enkidu a dry cloth.', [
            N('He holds it like a shield and peers at the gold light.'),
          ]),
          ch('jar', 'Put down the jar and stand by the door.', [
            N('Whoever is coming, you would like to be near the way out.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-11-offer',
      [
        N('The goddess Ishtar stands in the doorway, bright as the evening star.'),
        IS('Gilgamesh, stay with me. Be my king, and I will give you a golden chariot.'),
        IS('You will have everything you want.'),
        N('Gilgamesh shakes his head.'),
        GI('Everyone you loved ended up sad. Why would I be different?', 'think'),
        IS('You will be sorry.', 'angry'),
      ],
      [
        ask(
          3,
          'social-studies',
          'making a choice between yes and no',
          'D2.Eco.1.K-2',
          [
            N(
              'Ishtar asks. Gilgamesh gets to decide yes or no. What do we call picking one thing?',
            ),
          ],
          [
            o('A choice', [N('Yes! Picking one thing is a choice.')], true),
            o('A race', [N('Not quite! Picking one thing is called a choice.')]),
          ],
          'Learned that picking one thing from several is making a choice.',
        ),
      ],
      {
        choices: [
          ch('bow', 'Bow low as she passes.', [
            N('You bow low. She glances at you, then sweeps on.'),
          ]),
          ch('nubbin', 'Keep your Nubbin out of her way.', [
            N('You scoop it up. Her robe crackles past like summer lightning.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-11-offer-done',
      [EN('That was not clever, brother.', 'shock'), GI('No. But it was true.')],
      [
        ask(
          1,
          'sel',
          'telling the truth takes courage',
          'CASEL: Responsible decision-making',
          [N('Gilgamesh told the truth, even though it was hard. Is telling the truth brave?')],
          [
            o('Yes, it takes courage', [N('Yes! Telling the truth can be hard, and brave.')], true),
            o('No, it is easy', [
              N('Sometimes it is easy and sometimes hard. When it is hard, it is brave.'),
            ]),
          ],
          'Thought about honesty as a brave thing.',
        ),
      ],
    ),
    sc(
      'a26-11-complete',
      [
        N('High above the city, Ishtar weeps in front of her father Anu.'),
        N('She asks him for the Bull of Heaven.'),
        N('Anu says yes. A huge storm cloud gathers over Uruk.'),
      ],
      [
        ask(
          1,
          'literacy',
          'who the characters are in a story',
          'RL.K.3',
          [N('Who is crying and asking her father for help?')],
          [
            o('Ishtar', [N('Yes! Ishtar is asking her father Anu.')], true),
            o('Your Nubbin', [N('Your Nubbin is by the door. It is Ishtar who is asking.')]),
          ],
          'Named a character and what she does in the story.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-12 The Bull of Heaven
const Q12 = quest(
  'a26-12',
  'The Bull of Heaven',
  {
    'a26-12-s1': {
      goal: 'Help the children in the market get away from the cracks.',
      hint: 'Lead them up the wall stairs, away from the river side.',
    },
    'a26-12-s2': {
      goal: 'Watch from the wall as the friends face the Bull together.',
      hint: 'Stay on the wall with the children. Keep them back from the edge.',
    },
  },
  [
    sc(
      'a26-12-bull',
      [
        N('A huge bull comes down from the sky, grey as a storm cloud.'),
        N('It snorts. The ground cracks, and the market stalls tip over.'),
        TW('The children! Somebody get the children!', 'shock'),
        N('You hold out both hands. Up the wall stairs you go, two at a time.'),
        N('Your Nubbin runs ahead and waits on every step.'),
      ],
      [
        ask(
          4,
          'maths',
          'add two and two and two',
          'K.OA.A.2',
          [N('You lead two children, then two more, then two more. How many children in all?')],
          [
            o('Six', [N('Yes! Two, four, six.')], true),
            o('Four', [N('Count by twos: two, four, six. Six children!')]),
            o('Eight', [N('Count by twos: two, four, six. Six children!')]),
          ],
          'Counted by twos to six.',
        ),
      ],
      {
        choices: [
          ch('lead', 'Lead the children up the stairs.', [
            N('You lead them up in a long chain, holding hands.'),
          ]),
          ch('carry', 'Carry the smallest one.', [
            N('She grips your collar with both fists and does not cry once.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-12-bull-done',
      [
        N('From the wall you can see the Bull, the cracks, and two small figures.'),
        TW('That is the king and his brother!', 'shock'),
        N('The children hold hands tight. Some feel scared, and some feel brave.'),
      ],
      [
        ask(
          2,
          'sel',
          'what helps when we are scared',
          'CASEL: Self-awareness',
          [N('The children feel scared. What helps?')],
          [
            o('Holding hands with a friend', [N('Yes! Holding hands helps us feel safe.')], true),
            o('Hiding all alone', [N('Hiding alone can feel lonely. Holding hands helps more.')]),
          ],
          'Talked about what helps when we feel scared.',
        ),
      ],
    ),
    sc(
      'a26-12-fight',
      [
        N('Enkidu grabs the Bull by the horns. Whoosh!'),
        EN('Now, brother! Together!'),
        N('Gilgamesh runs in. A great cloud of dust goes up. Poof!'),
        N('Achoo! Achoo! Everybody sneezes. Even the Bull.'),
        N('Your Nubbin sneezes the loudest. Then it peeks with one eye.'),
        N('When the dust settles, the Bull lies down on the ground. It is stopped.'),
        N('Ishtar appears on the wall in a golden storm. Enkidu shouts at her.'),
        EN('Go home! Leave our city alone!', 'angry'),
        N('Ishtar turns away. Then she is gone.'),
      ],
      [
        ask(
          4,
          'literacy',
          'sound words',
          LIT,
          [N('Which one is a sound word: achoo, table or green?')],
          [
            o('Achoo', [N('Yes! “Achoo” sounds like a sneeze.')], true),
            o('Table', [N('A table is a thing. “Achoo” is the sound word.')]),
            o('Green', [N('Green is a colour. “Achoo” is the sound word.')]),
          ],
          'Picked out a sound word.',
        ),
      ],
      {
        choices: [
          ch('cheer', 'Cheer with the children.', [
            N('You cheer. The children cheer. Somebody bangs a pot.'),
          ]),
          ch('quiet', 'Look at the Bull for a while.', [
            N('It came because someone was angry. It never chose to come.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-12-complete',
      [
        N('That night the friends ride through Uruk in a chariot.'),
        N('The people line the street and cheer their names.'),
        GI('Whose names do we shout tonight?', 'happy'),
        TW('Gilgamesh! And Enkidu!'),
        N('Enkidu waves harder when he sees you. Your Nubbin waves back with both arms.'),
      ],
      [
        ask(
          1,
          'social-studies',
          'life long ago and today',
          'D2.His.2.K-2',
          [N('Long ago, people rode in chariots. What do people ride in today?')],
          [
            o('Cars, buses and bikes', [N('Yes! Today we have cars, buses and bikes.')], true),
            o('Only chariots', [N('Not only chariots! Today we have cars, buses and bikes too.')]),
          ],
          'Compared how people travelled long ago and today.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-13 The Gods' Council
const Q13 = quest(
  'a26-13',
  'The Gods’ Council',
  {
    'a26-13-s1': {
      goal: 'Sit with Enkidu when he wakes from his dream.',
      hint: 'He has called for you before dawn. Go to his room.',
    },
    'a26-13-s2': {
      goal: 'Walk with Enkidu to the cedar door.',
      hint: 'He wants to see the great door at the temple.',
    },
  },
  [
    sc(
      'a26-13-dream',
      [
        N('Before dawn, a servant wakes you. Enkidu is asking for you.'),
        N('He sits on his bed with a blanket round his shoulders. He is very pale.'),
        EN('I had a bad dream. The great gods said one of us must die.', 'sad'),
        EN('They said it would be me.'),
        GI('It was only a dream. I will tell you it was a good one.', 'shock'),
      ],
      [
        ask(
          4,
          'health',
          'telling someone about a bad dream helps',
          'CASEL: Self-management',
          [N('Enkidu had a bad dream and feels scared. What can help after a bad dream?')],
          [
            o(
              'Telling someone about it',
              [N('Yes! Telling a friend can make a bad dream feel smaller.')],
              true,
            ),
            o('Keeping it a secret', [
              N('Secrets can make a scary feeling bigger. Telling helps.'),
            ]),
          ],
          'Talked about telling someone after a bad dream.',
        ),
      ],
      {
        choices: [
          ch('sit', 'Sit down on the bed beside him.', [
            N('The bed creaks. Your Nubbin climbs up on his other side.'),
          ]),
          ch('water', 'Bring him a cup of water.', [
            N('His hands shake, so you hold the cup with him.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-13-dream-done',
      [
        N('Enkidu turns to look at you. He does not say anything.'),
        N('He takes your hand and holds it hard while the window turns grey.'),
      ],
      [
        ask(
          1,
          'sel',
          'holding a hand shows a friend is not alone',
          'CASEL: Relationship skills',
          [N('Why did holding hands help Enkidu?')],
          [
            o('It showed he was not alone', [N('Yes! A hand to hold says, “I am here.”')], true),
            o('It made the window grey', [
              N('Ha! The window turns grey at dawn. The hand helps because he is not alone.'),
            ]),
          ],
          'Talked about how holding a hand shows a friend you are there.',
        ),
      ],
    ),
    sc(
      'a26-13-door',
      [
        N('He wants to see the cedar door. You walk him to the temple, slowly.'),
        EN('I am cross with the door, and the trapper, and everyone.', 'angry'),
        N('The sun comes up over the wall. It shines straight into the doorway.'),
        SS('Enkidu, Shamhat gave you bread and clothes. She gave you a friend.'),
        N('Enkidu stands still in the warm sunlight. His face softens.'),
      ],
      [
        ask(
          4,
          'literacy',
          'soft and loud voices',
          LANG,
          [N('Enkidu was cross. Then his face went soft. Which is soft: a whisper or a shout?')],
          [
            o('A whisper', [N('Yes! A whisper is soft. A shout is loud.')], true),
            o('A shout', [N('A shout is loud. A whisper is the soft one.')]),
          ],
          'Talked about soft and loud voices after Enkidu was cross.',
        ),
      ],
      {
        choices: [
          ch('bread', 'Tell him she gave him bread, too, the first day.', [
            EN('She did. I licked it first. You were there.'),
          ]),
          ch('quiet', 'Stay quiet, and let him think.', [
            N('The sun is warm on all three of you.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-13-door-done',
      [
        EN('Shamhat, I am sorry. Thank you. I take it back. I bless you.', 'soft'),
        EN('You found me in the grass and brought me home.', 'soft'),
      ],
      [
        ask(
          1,
          'sel',
          'taking back unkind words',
          'CASEL: Self-awareness',
          [N('Enkidu took back his cross words. What did he do?')],
          [
            o(
              'He said sorry and thank you',
              [N('Yes! Saying sorry and thank you can mend hurt feelings.')],
              true,
            ),
            o('He shouted louder', [N('No, he spoke softly. He said sorry and thank you.')]),
          ],
          'Talked about saying sorry and thank you after being cross.',
        ),
      ],
    ),
    sc(
      'a26-13-complete',
      [
        N('By noon he is too tired to stand.'),
        N('Gilgamesh carries him back to bed, gently.'),
        GI('Rest now. You always get better.'),
        EN('Thank you, brother.', 'soft'),
      ],
      [
        ask(
          3,
          'sel',
          'how a friend shows care',
          'CASEL: Relationship skills',
          [N('Gilgamesh carried his friend. How does a friend show care?')],
          [
            o('By helping and staying close', [N('Yes! Helping and staying close shows care.')], true),
            o('By going far away', [N('Going away is not care. Helping and staying close is.')]),
          ],
          'Talked about how a friend shows care.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-14 Twelve Days
const Q14 = quest(
  'a26-14',
  'Twelve Days',
  {
    'a26-14-s1': {
      goal: 'Sit with Enkidu while he is ill.',
      hint: 'Take water to his room, and stay.',
    },
    'a26-14-s2': {
      goal: 'Stay with Enkidu and Gilgamesh on the twelfth day.',
      hint: 'Stay in the room. There is nothing to do but be there.',
    },
    'a26-14-s3': {
      goal: 'Go with Gilgamesh when he has a statue made of his friend.',
      hint: 'Find the king in the smiths’ street, with the gold and the blue stone.',
    },
  },
  [
    sc(
      'a26-14-sickbed',
      [
        N('Enkidu is ill for twelve days. Each day he is a little more tired.'),
        N('You fetch water and cool cloths. Mostly you sit on the stool by his bed.'),
        EN('Tell me where you live.'),
        Y('It is small. It has a garden, a pond and a hill.'),
        EN('A hill. Good. You can see what is coming.'),
        N('Your Nubbin lies across his feet to keep them warm.'),
      ],
      [
        ask(
          1,
          'health',
          'what helps a poorly friend',
          'CASEL: Social awareness',
          [N('Enkidu is poorly. What helps a poorly friend feel better?')],
          [
            o(
              'Water, rest and a friend close by',
              [N('Yes! Water, rest and company are good care.')],
              true,
            ),
            o('Loud, bouncy games', [
              N('A poorly friend needs it quiet. Water, rest and company help.'),
            ]),
          ],
          'Talked about how to care for a friend who is ill.',
        ),
      ],
      {
        choices: [
          ch('grove', 'Tell him about the Grove.', [
            N('You tell him about the Nubbins and fruit trees. He listens, smiling.'),
          ]),
          ch('hum', 'Hum the tune he sang at the shepherds’ fire.', [
            N('You get it a bit wrong. He hums it back, right, very quietly.'),
          ]),
          ch('hand', 'Just hold his hand.', [N('His hand is big and warm. It holds yours back.')]),
        ],
      },
    ),
    sc(
      'a26-14-sickbed-done',
      [
        EN('Water-carrier, will you do something for me, after?'),
        EN('Look after the gazelles at the water hole. Make sure nobody digs pits there.', 'soft'),
        Y('I will.'),
      ],
      [
        ask(
          2,
          'science',
          'looking after animals and where they live',
          'K-ESS3-3',
          [N('Enkidu asks you to look after the gazelles. How do we look after animals?')],
          [
            o(
              'Keep their water and homes safe',
              [N('Yes! Animals need clean water and safe places to live.')],
              true,
            ),
            o('Chase them away', [
              N('That would frighten them. We keep their water and homes safe.'),
            ]),
          ],
          'Learned that looking after animals means protecting their water and homes.',
        ),
      ],
    ),
    sc(
      'a26-14-death',
      [
        N('On the twelfth day the house is very quiet.'),
        GI('I let you win, at the door.'),
        EN('You did not.', 'happy'),
        N('He laughs a little and closes his eyes.'),
        N('Then his body stops working. Enkidu has died.'),
        N('That means his body will not start again. It is not like sleeping.'),
        N('Gilgamesh pulls a cloth gently over his friend’s face.'),
        GI('Enkidu was my friend. Who will I tell my dreams to now?', 'sad'),
        N('You sit on the floor by the bed. It is all right to cry.'),
      ],
      [
        ask(
          5,
          'health',
          'it is all right to feel sad; what helps',
          'CASEL: Self-awareness',
          [N('Enkidu has died. What can we do when we feel very sad?')],
          [
            o(
              'Cry, and stay close to someone',
              [N('Yes! Crying is all right. Staying close to someone helps.')],
              true,
            ),
            o('Pretend to feel nothing', [
              N('Feelings are allowed. Crying and staying close to someone helps.'),
            ]),
          ],
          'Talked plainly about death and what helps with sadness.',
        ),
      ],
    ),
    sc(
      'a26-14-death-done',
      [
        N('Your Nubbin climbs into Gilgamesh’s lap when at last he sits.'),
        N('It makes no sound all night. It is the kindest thing anyone does.'),
      ],
      [
        ask(
          1,
          'sel',
          'staying close helps even without words',
          'CASEL: Relationship skills',
          [N('The Nubbin did not say anything. How did it help?')],
          [
            o(
              'It stayed close',
              [N('Yes! Sometimes just being there is the kindest thing.')],
              true,
            ),
            o('It did a dance', [N('No dancing. It stayed close, and that was enough.')]),
          ],
          'Talked about how staying close can comfort someone who is sad.',
        ),
      ],
    ),
    sc(
      'a26-14-statue',
      [
        N('Gilgamesh asks every smith and jeweller in Uruk for a statue.'),
        N('They make it of gold and blue stone. It has Enkidu’s big hands and his grin.'),
        N('The whole city cries for Enkidu.'),
        GI('It is beautiful. But he is not in it.', 'sad'),
        N('Gilgamesh looks at his own hands. Then he looks at you.'),
        GI('One day I will die too. I am scared.', 'shock'),
      ],
      [
        ask(
          2,
          'social-studies',
          'ways people remember someone',
          'D2.His.2.K-2',
          [
            N(
              'People make statues and plant flowers to remember someone. What else helps us remember?',
            ),
          ],
          [
            o(
              'Telling stories about them',
              [N('Yes! Telling stories keeps people close in our hearts.')],
              true,
            ),
            o('Forgetting them', [
              N('We keep loving people we miss. Stories and little things help us remember.'),
            ]),
          ],
          'Talked about ways to remember someone we miss.',
        ),
      ],
      {
        choices: [
          ch('date', 'Put a date by the statue, for Enkidu.', [
            N('It is the first thing he ever ate from a person’s hand.'),
          ]),
          ch('stand', 'Stand next to Gilgamesh.', [
            N('He does not look at you. But he does not send you away.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-14-complete',
      [
        GI('A man far away has lived a very long time. I will go and ask him.'),
        N('He puts on rough lion skins and walks out of the gate.'),
        N('You fill three waterskins. Your Nubbin climbs onto the pack.'),
      ],
      [
        doit(
          2,
          'maths',
          'count three waterskins',
          'K.CC.B.5',
          'edu:count:waterskins:3',
          [N('(Count the waterskins on the pack: one, two, three!)')],
          'Counted three waterskins.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-15 Lion Skins
const Q15 = quest(
  'a26-15',
  'Lion Skins',
  {
    'a26-15-s1': {
      goal: 'Follow Gilgamesh to the twin mountains.',
      hint: 'Keep up with him across the wild land. Carry the water.',
    },
    'a26-15-s2': {
      goal: 'Wait while the guards decide whether to let you through.',
      hint: 'Stand back behind Gilgamesh and let him talk.',
    },
    'a26-15-s3': {
      goal: 'Walk the dark road holding on to Gilgamesh’s belt.',
      hint: 'Do not let go. Count as you go.',
    },
  },
  [
    sc(
      'a26-15-road',
      [
        N('Gilgamesh walks the wild places in his lion skins.'),
        N('At night he lies awake and looks at the stars.'),
        GI('I used to be afraid of nothing. Now I am afraid of everything.', 'sad'),
        N('You give him water. He drinks a little, and that is a good day.'),
        N('At last two tall mountains rise ahead, with a gate between them.'),
      ],
      [
        ask(
          3,
          'sel',
          'what helps when we feel afraid',
          'CASEL: Self-awareness',
          [N('Gilgamesh feels afraid. What can help when we feel afraid?')],
          [
            o(
              'Tell someone, and stay close to a friend',
              [N('Yes! Telling someone and staying close can help.')],
              true,
            ),
            o('Run away from everyone', [
              N('Running away alone can make fear bigger. Staying close helps.'),
            ]),
          ],
          'Talked about what helps when we feel afraid.',
        ),
      ],
      {
        choices: [
          ch('eat', 'Make him eat some bread.', [GI('You sound like him.'), N('But he eats it.')]),
          ch('stars', 'Lie down and look at the stars with him.', [
            N('After a while he points out a star Enkidu liked.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-15-road-done',
      [
        N('By the gate stand two guards. They are people down to the waist.'),
        N('Below the waist, they are scorpions.'),
      ],
      [
        ask(
          1,
          'maths',
          'count the two guards',
          'K.CC.B.5',
          [N('Count the guards at the gate: one, two. How many guards are there?')],
          [
            o('Two', [N('Yes! One guard, two guards. There are two.')], true),
            o('Five', [N('Not five. Count again: one, two. There are two guards.')]),
          ],
          'Counted two guards at the gate.',
        ),
      ],
    ),
    sc(
      'a26-15-gate',
      [
        N('The scorpion-man is big and scary to look at. His wife stands beside him.'),
        SC('Wife, this one is two parts god. Who is the small one with the water?'),
        N('His wife looks at your Nubbin and tilts her head. She likes small ones.'),
        GI('Please open the gate. I am looking for a very old man.'),
        SC('No one has gone this way. It is dark for a long, long way.', 'think'),
        GI('I will go anyway. Please open the gate.'),
        SC('Then go, and come back safe. The gate is open.', 'soft'),
      ],
      [
        ask(
          3,
          'literacy',
          'polite words for asking',
          LANG,
          [N('Gilgamesh says “please”. Which is a kind way to ask: “please” or “give it to me”?')],
          [
            o('Please', [N('Yes! “Please” is a kind word for asking.')], true),
            o('Give it to me', [N('“Please” is kinder. It shows respect.')]),
          ],
          'Practised polite words for asking.',
        ),
      ],
      {
        choices: [
          ch('thank', 'Thank the scorpion-people.', [
            N('His wife lifts one claw, very slightly, like a wave.'),
          ]),
          ch('belt', 'Take hold of Gilgamesh’s belt before the dark.', [
            N('He looks down at your hand, and then lets you.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-15-dark',
      [
        N('The dark inside the mountain is very thick. You hold on to Gilgamesh’s belt.'),
        N('He counts out loud, so you know he is there.'),
        N('You count with him, so he knows you are there.'),
        GI('One. Two. Three. Still dark.'),
        GI('Nine. I feel a breeze on my face.'),
        GI('Eleven. Look! There is light!', 'shock'),
        N('At twelve, you step out into the sun, into a garden of jewels.'),
      ],
      [
        doit(
          2,
          'maths',
          'count slowly up to twelve',
          'K.CC.B.5',
          'edu:count:steps:12',
          [N('(Count slowly to twelve together: one, two, three... twelve!)')],
          'Counted up to twelve.',
        ),
      ],
    ),
    sc(
      'a26-15-dark-done',
      [
        N('Your Nubbin shivers from the cold dark.'),
        N('Gilgamesh cuts a strip of lion skin. He wraps it round your Nubbin like a cloak.'),
      ],
      [
        ask(
          1,
          'science',
          'we need light to see',
          '1-PS4-2',
          [N('Why could you not see inside the dark mountain?')],
          [
            o('There was no light', [N('Yes! We see things when there is light.')], true),
            o('Your eyes were closed', [
              N('Your eyes were open, but with no light, nothing can be seen.'),
            ]),
          ],
          'Learned that we need light to see.',
        ),
      ],
    ),
    sc(
      'a26-15-complete',
      [
        GI('There. Now you look like a hero too.', 'happy'),
        N('It is his first joke for a long time. Your Nubbin wears the cloak with pride.'),
        N(
          'Beyond the garden there is a sea. A little house stands by it, with smoke from its chimney.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'kindness warms someone who is sad',
          'CASEL: Relationship skills',
          [
            N(
              'Gilgamesh made a joke and wrapped up the Nubbin. How does kindness help someone who is sad?',
            ),
          ],
          [
            o('It warms their heart', [N('Yes! A kind act can warm a sad heart a little.')], true),
            o('It makes them grumpy', [
              N('Look! It made Gilgamesh smile. Kindness warms a sad heart.'),
            ]),
          ],
          'Talked about how small kindnesses help someone who feels sad.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-16 Siduri
const SIDURI_DONE_BEAT = ask(
  1,
  'health',
  'sleep helps our bodies rest and grow',
  PHYS,
  [N('Your Nubbin is fast asleep. Why do we need sleep?')],
  [
    o(
      'It helps our bodies rest and grow',
      [N('Yes! Sleep gives our bodies a rest, and helps us grow.')],
      true,
    ),
    o('To make us cross', [N('Sleep helps us feel better! It helps our bodies rest and grow.')]),
  ],
  'Learned that sleep helps our bodies rest and grow.',
);

const Q16 = quest(
  'a26-16',
  'Siduri',
  {
    'a26-16-s1': {
      goal: 'Sit in Siduri’s tavern by the sea and hear what she says.',
      hint: 'Siduri has barred her door. Wait until she opens it.',
    },
    'a26-16-s2': {
      goal: 'Find Ur-Shanabi the boatman in the woods.',
      hint: 'Follow Gilgamesh into the woods by the shore.',
    },
    'a26-16-s3': {
      goal: 'Help cut poles for the crossing.',
      hint: 'Gather the straight poles Gilgamesh cuts. Stack them by the boat.',
    },
  },
  [
    sc(
      'a26-16-siduri',
      [
        N('By the sea there is a little tavern with a vine over the door.'),
        N('Siduri sees a man in lion skins and bars her door.'),
        SI('Who are you, looking so tired?', 'shock'),
        GI('I am Gilgamesh. My friend died. I am so sad.'),
        N('Siduri looks at him a long time. Then she opens the door.'),
        SI('Eat your supper. Wash your face. Sing, and hug the people you love.'),
        N('She gives you each a stool and a cup.'),
      ],
      [
        ask(
          6,
          'literacy',
          'how a character feels about another',
          'RL.K.3',
          [
            N(
              'Siduri opened her door and gave everyone a stool and a cup. How did she feel about them?',
            ),
          ],
          [
            o('Kind', [N('Yes! Opening the door and sharing a cup is kind.')], true),
            o('Cross', [N('Not cross. She opened her door and shared a cup, so she felt kind.')]),
          ],
          'Thought about how a character feels from what she does.',
        ),
      ],
      {
        choices: [
          ch('listen', 'Tell Siduri you were listening.', [
            SI('I know. You have the face of someone who listens.'),
          ]),
          ch('paw', 'Hold your Nubbin’s paw.', [
            N('Siduri sees, says nothing, and refills your cup.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-16-siduri-done',
      [
        N('Your Nubbin climbs into your lap and falls asleep, warm and heavy.'),
        GI('Where is the boatman?', 'angry'),
        SI('In the woods by the shore. Be gentle with him.'),
      ],
      [SIDURI_DONE_BEAT],
    ),
    sc(
      'a26-16-stones',
      [
        N('Gilgamesh runs into the woods. There is a crash, and then a silence.'),
        N('In a clearing, among broken stones, a boatman stares at the king.'),
        UR('Those were the Stone Things. They crewed my boat. You smashed them.', 'shock'),
        GI('I did not think.', 'sad'),
        UR('People do not, when they are very sad.', 'soft'),
      ],
      [
        ask(
          4,
          'sel',
          'saying sorry and helping fix things',
          'CASEL: Self-management',
          [N('Gilgamesh was very sad, and he broke things. What could he do now?')],
          [
            o(
              'Say sorry and help fix it',
              [N('Yes! Saying sorry and helping is a good way to mend things.')],
              true,
            ),
            o('Run away', [
              N('Running away does not mend anything. Saying sorry and helping does.'),
            ]),
          ],
          'Talked about saying sorry and helping fix what we broke.',
        ),
      ],
      {
        choices: [
          ch('pieces', 'Help gather the pieces into a pile.', [
            N('You gather them into a neat pile. Ur-Shanabi nods.'),
          ]),
          ch('ask', 'Ask Ur-Shanabi if there is another way.', [
            UR('There is. It is harder. Can you carry poles, little one?'),
          ]),
        ],
      },
    ),
    sc(
      'a26-16-poles',
      [
        UR('We must cut poles. Long, straight poles, and many.'),
        N('Gilgamesh cuts, you carry, and Ur-Shanabi trims.'),
        N('Soon there are ten poles in a stack.'),
        N('Your Nubbin drags one small branch to the pile as its share.'),
        N('The work helps Gilgamesh. He is tired, and calmer.'),
        GI('Enkidu would have been better at this.', 'soft'),
      ],
      [
        doit(
          2,
          'maths',
          'count ten poles',
          'K.CC.B.5',
          'edu:count:poles:10',
          [N('(Count the poles together: one, two, three... ten!)')],
          'Counted ten poles.',
        ),
      ],
      {
        choices: [
          ch('ask', 'Ask him to tell you about Enkidu.', [
            N('He tells you about the steppe, the door and the forest. He laughs twice.'),
          ]),
          ch('work', 'Just keep carrying.', [
            N('You carry and he cuts, side by side. Some work is a kind of talking.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-16-complete',
      [
        N('At dawn you push off. The water is black and flat.'),
        N('Gilgamesh punts with the poles. Each one touches the water once.'),
        N('When the poles are gone, he holds up his lion skins for a sail.'),
        N('The wind pushes, and the boat sails to the far shore.'),
        UR('The far shore. Someone has been waiting a long time.'),
      ],
      [
        ask(
          3,
          'science',
          'wind pushes a sail',
          SCI,
          [N('What pushes the boat when the lion-skin sail is up?')],
          [
            o('The wind', [N('Yes! Wind pushes on the sail, and the boat moves.')], true),
            o('The moon', [N('Not the moon! The wind pushes the sail.')]),
          ],
          'Learned that wind pushes a sail and moves a boat.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-17 Uta-Napishtim
const Q17 = quest(
  'a26-17',
  'Uta-Napishtim',
  {
    'a26-17-s1': {
      goal: 'Hear Uta-Napishtim’s story on the far shore.',
      hint: 'Sit by his door with Gilgamesh and listen.',
    },
    'a26-17-s2': {
      goal: 'Watch over Gilgamesh while he tries to stay awake.',
      hint: 'Stay by him. Help Uta-Napishtim’s wife with the loaves.',
    },
    'a26-17-s3': {
      goal: 'Watch Gilgamesh dive for the plant at the bottom of the sea.',
      hint: 'Stay in the boat with Ur-Shanabi and hold the rope.',
    },
    'a26-17-s4': {
      goal: 'Walk home with Gilgamesh and Ur-Shanabi.',
      hint: 'Stop with them at the pool on the road home.',
    },
  },
  [
    sc(
      'a26-17-tale',
      [
        N('On the far shore an old man sits by his door.'),
        UT('Who is this, so tired, in a lion skin?'),
        GI('I want what you have. I do not want to die. My friend died.', 'sad'),
        UT('Nothing stays for ever. The river rises, and it goes down.', 'soft'),
        UT('Sit down. I will tell you my story.'),
        N('He tells of a great flood, and a boat, and all kinds of animals.'),
        N('He sent out a dove, then a swallow. Both came back. Then a raven, which did not.'),
        N('His wife coughs.'),
        UW('The raven was my idea.'),
      ],
      [
        ask(
          8,
          'literacy',
          'who did not come back',
          'RL.K.3',
          [N('The dove came back. The swallow came back. Who did not come back?')],
          [
            o('The raven', [N('Yes! The raven found land, so it stayed away.')], true),
            o('The dove', [N('The dove came back. The raven found land and stayed.')]),
          ],
          'Remembered which bird did not come back in the story.',
        ),
      ],
      {
        choices: [
          ch('animals', 'Ask what happened to the animals.', [
            UT('They walked off the boat and never thanked me. That is animals.'),
          ]),
          ch('wife', 'Ask his wife if she minds living for ever.', [
            UW('Some days. The bread is good, though.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-17-tale-done',
      [
        GI('Then the gods could do it again. For me.'),
        UT('Let us see if you can do something smaller first.'),
      ],
      [
        ask(
          1,
          'sel',
          'feelings when we want something we cannot have',
          'CASEL: Self-awareness',
          [N('Gilgamesh wants something he cannot have. How does that feel?')],
          [
            o(
              'Sad or cross, and that is all right',
              [N('Yes! Feelings are allowed. Telling a friend can help.')],
              true,
            ),
            o('Nothing at all', [
              N('It often feels like something! Sad or cross are normal feelings.'),
            ]),
          ],
          'Talked about feelings when we cannot have what we want.',
        ),
      ],
    ),
    sc(
      'a26-17-test',
      [
        UT('Stay awake for seven days. Then we will see.'),
        GI('Easily. I have hardly slept since...', 'angry'),
        N('He sits down on the sand. At once, he is fast asleep.'),
        UW('Wake him, and let him go home.', 'soft'),
        UT('Bake a loaf each day and set it by his head. Then he will know.'),
        N('Each day she bakes a loaf. After seven days, seven loaves sit in a row.'),
      ],
      [
        doit(
          5,
          'maths',
          'count seven loaves',
          'K.CC.B.5',
          'edu:count:loaves:7',
          [N('(Count the loaves in the row: one, two, three, four, five, six, seven!)')],
          'Counted seven loaves.',
        ),
      ],
      {
        choices: [
          ch('wake', 'Try to wake him on the first day.', [
            N('You shake his shoulder. He just snores.'),
          ]),
          ch('count', 'Help her count the loaves.', [
            N('You count one, two, three, all in a row.'),
          ]),
          ch('sleep', 'Let him sleep. He needs it.', [N('His wife looks at you and nods.')]),
        ],
      },
    ),
    sc(
      'a26-17-test-done',
      [
        N('On the seventh day Uta-Napishtim touches him, and he wakes.'),
        GI('I only just shut my eyes.'),
        N('Then he sees the loaves. The first is dry and hard.'),
        N('Gilgamesh knocks on it. Knock, knock! It rings like a brick.'),
        UW('That one was fresh on the first day.'),
        N('The last loaf is still warm.'),
        N('He puts his face in his hands.'),
        UT('Take him to wash, and give him clean clothes.'),
      ],
      [
        ask(
          5,
          'science',
          'bread gets old over days',
          SCI,
          [N('The first loaf was baked days ago. Is it the oldest or the newest?')],
          [
            o('The oldest', [N('Yes! The first loaf is the oldest, so it is dry and hard.')], true),
            o('The newest', [N('The newest is the warm one. The first loaf is the oldest.')]),
          ],
          'Used order (first to last) to tell old from new.',
        ),
      ],
    ),
    sc(
      'a26-17-plant',
      [
        N('He is washed, and wears new clothes. He looks like a king again.'),
        UW('He cannot go home with nothing.', 'soft'),
        UT('There is a plant at the bottom of the sea. It has thorns.'),
        N('Gilgamesh ties stones to his feet. He drops into the deep. Splash!'),
        N('You hold the rope. Your Nubbin peeks at the green water.'),
        N('He comes up gasping. In his hand is a plant with a pale flower like a star.'),
      ],
      [
        ask(
          5,
          'literacy',
          'words with the same first sound',
          'RF.K.2',
          [N('Star starts with “s”. Which word starts the same: sea, dog or hat?')],
          [
            o('Sea', [N('Yes! Star, sea. Sss, sss, sss!')], true),
            o('Dog', [N('Dog starts with “d”. Sea starts with “s”, like star.')]),
            o('Hat', [N('Hat starts with “h”. Sea starts with “s”, like star.')]),
          ],
          'Matched the first sound of “star” with “sea”.',
        ),
      ],
      {
        choices: [
          ch('pull', 'Haul him into the boat.', [
            N('You haul until he flops over the side, laughing and dripping.'),
          ]),
          ch('hands', 'Look at his hands.', [
            N('Ur-Shanabi wraps them in a strip of your spare cloth.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-17-plant-done',
      [
        GI('Look at it! I will take it home and try it on an old man first.', 'happy'),
        N('The plant has four leaves.'),
        GI('Then everyone I love can have a leaf.'),
      ],
      [
        ask(
          2,
          'maths',
          'take two away from four',
          'K.OA.A.1',
          [N('Four leaves. Two go to friends. How many leaves are left?')],
          [
            o('Two', [N('Yes! Four take away two leaves two.')], true),
            o('Four', [N('Two leaves have gone. Count what is left: one, two. Two!')]),
            o('Three', [N('Count what is left: one, two. Two leaves!')]),
          ],
          'Took two away from four.',
        ),
      ],
    ),
    sc(
      'a26-17-snake',
      [
        N('You walk home. Gilgamesh carries the plant in both hands.'),
        N('At a cool pool he lays the plant on the bank. Then he goes in to bathe.'),
        N('Your Nubbin splashes in the shallows.'),
        N('A snake slides out of the grass. It sniffs the plant and takes it.'),
        N('It is gone. On the bank is only the snake’s old skin.'),
        GI('No. No, no.', 'shock'),
        N('Gilgamesh sits down on the bank and cries.'),
      ],
      [
        ask(
          4,
          'science',
          'snakes shed their skin as they grow',
          SCI,
          [N('A snake slips out of its old skin. Why does a snake shed its skin?')],
          [
            o(
              'Because it grows',
              [N('Yes! A snake grows, and the old skin gets too small.')],
              true,
            ),
            o('To play dress-up', [N('Ha! No. A snake sheds its skin because it grows.')]),
          ],
          'Learned that snakes shed their skin as they grow.',
        ),
      ],
      {
        choices: [
          ch('sit', 'Sit down beside him.', [
            N('He cries like a child, with his whole body. You stay.'),
          ]),
          ch('skin', 'Pick up the snake’s old skin.', [
            N('It is light as paper. The snake is bigger now.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-17-snake-done',
      [
        GI('All that way. And a snake has it.', 'sad'),
        UR('Yes. And now we go home anyway. Come on.'),
      ],
      [
        ask(
          1,
          'sel',
          'a friend beside you helps with a big disappointment',
          'CASEL: Self-awareness',
          [N('Gilgamesh lost the plant and feels very sad. What can help?')],
          [
            o('A friend beside him', [N('Yes! A friend walking beside us helps.')], true),
            o('Being left alone', [
              N('Sometimes quiet is fine. But a friend beside us helps most.'),
            ]),
          ],
          'Talked about how a friend’s company helps with a big disappointment.',
        ),
      ],
    ),
    sc(
      'a26-17-complete',
      [
        N('You walk on, the three of you. It is a quiet walk.'),
        N('In your pocket there is a tiny reed boat, plaited tight.'),
        N('Uta-Napishtim’s wife must have made it while the loaves baked.'),
      ],
      [
        ask(
          1,
          'science',
          'reeds are light and float',
          '2-PS1-1',
          [N('The little boat is made of reeds. Will it float or sink?')],
          [
            o('Float', [N('Yes! Reeds are light, so a reed boat floats.')], true),
            o('Sink', [N('Reeds are light and hold air, so a reed boat floats.')]),
          ],
          'Learned that light, bendy reeds float and can make boats.',
        ),
      ],
    ),
  ],
);

// ================================================================== A26-18 The Wall of Uruk
const FOOT_BEAT = ask(
  6,
  'science',
  'fire in a kiln makes clay very hard',
  SCI,
  [N('The brick will go into a very hot kiln. What does fire do to wet clay?')],
  [
    o(
      'Makes it very hard',
      [N('Yes! Fire bakes clay hard, so a kiln brick lasts a very long time.')],
      true,
    ),
    o('Makes it soft', [N('Not quite! Fire makes clay hard, not soft.')]),
  ],
  'Learned that a kiln’s fire makes clay bricks very hard.',
);

const FOOT_CHOICES = [
  ch('tablet', 'Ask her if the tablet is still in the box.', [
    BR('It is. It stays, if people leave it be.'),
  ]),
  ch('name', 'Ask if she will put her own mark on it too.', [
    BR('Me? No. I am on all the others.'),
  ]),
];

const BRICK_LINES = [
  BR('Every brick has someone’s hand in it. Want yours in?'),
  N('She lays a fresh clay brick. You press your hand in. Your Nubbin presses a paw.'),
  BR('This one will go in the kiln. Fire makes it hard, so it lasts a very long time.'),
];

const MOSS_HOME = [
  GI('Go home, water-carrier. Walk on your own wall.'),
  N('The sun on the bricks turns to lamplight on a page.'),
  N('In your hands there is a warm brick with a handprint and a pawprint.'),
];

const COMPLETE_BEAT = ask(
  2,
  'sel',
  'how friends remember each other',
  'CASEL: Relationship skills',
  [
    N('You pressed your hand into a brick, so people will remember you.'),
    N('How do friends remember each other?'),
  ],
  [
    o(
      'By telling stories and keeping little things',
      [N('Yes! Stories and little keepsakes keep friends close.')],
      true,
    ),
    o('By never speaking of them', [
      N('We remember best when we talk about them and keep something small.'),
    ]),
  ],
  'Talked about how friends remember each other with stories and keepsakes.',
);

const Q18 = quest(
  'a26-18',
  'The Wall of Uruk',
  {
    'a26-18-s1': {
      goal: 'Walk the wall of Uruk with Gilgamesh and Ur-Shanabi.',
      hint: 'Climb the wall stair. Mind the third step.',
    },
    'a26-18-s2': {
      goal: 'Go down to the foot of the wall, where the story started.',
      hint: 'The old brickmaker is waiting by the copper box.',
    },
  },
  [
    sc(
      'a26-18-wall',
      [
        N('You come home across the plain at evening. The wall of Uruk glows gold.'),
        UR('So that is your city. It is big.'),
        GI('It is. Come up. I will show you.'),
        N('You climb the wall stair together. Your Nubbin waits on the third step.'),
        N('On top, the whole city lies below: roofs, orchards, and smoke from supper fires.'),
        GI('This part is the town. This part is the orchards. This part is the clay pits.'),
        GI('Three parts, all inside one wall.'),
      ],
      [
        ask(
          6,
          'maths',
          'count three parts',
          M,
          [N('Town, orchards, clay pits. How many parts are inside the wall?')],
          [
            o('Three', [N('Yes! Town, orchards, clay pits. One, two, three.')], true),
            o('Two', [N('Count again with your finger: town, orchards, clay pits. Three!')]),
          ],
          'Counted three parts of the city.',
        ),
      ],
      {
        choices: [
          ch('knock', 'Knock on a brick.', [N('It rings. Gilgamesh hears it and smiles.')]),
          ch('look', 'Look at the city with them.', [
            N('Someone calls children in for supper. Someone sings. It all goes on.'),
          ]),
        ],
      },
    ),
    sc(
      'a26-18-wall-done',
      [GI('I went to the end of the world. And here it is. It was here the whole time.', 'soft')],
      [
        ask(
          0,
          'literacy',
          'where a story takes place',
          LIT,
          [N('Where does this story end: at the wall of Uruk, or at the sea?')],
          [
            o('At the wall of Uruk', [N('Yes! It ends where it began, at the wall.')], true),
            o('At the sea', [N('The sea was in the middle. The story ends at the wall of Uruk.')]),
          ],
          'Named where the story begins and ends.',
        ),
      ],
    ),
    sc(
      'a26-18-foot',
      [
        N('At the foot of the wall, the old brickmaker sits eating a date.'),
        BR('There you are. Long story, was it?'),
        N('By the river, a gazelle grazes. It looks at you and does not run.'),
        GI('He asked you to look after them. You did.', 'soft'),
        ...BRICK_LINES,
      ],
      [FOOT_BEAT],
      { choices: FOOT_CHOICES },
    ),
    sc(
      'a26-18-foot-done',
      [
        BR('Some tablets were taken away from their places.', 'sad'),
        BR('Some have come home. Each one is a little bit of the city put back.'),
        N('Gilgamesh gives you a small cedar box. It smells like the forest.'),
        GI('Put your own stories in it. Leave it where people can open it.'),
      ],
      [
        ask(
          1,
          'social-studies',
          'giving back what belongs to someone else',
          'D2.Civ.8.K-2',
          [
            N(
              'The tablets belong where they came from. What should we do with things that belong to someone else?',
            ),
          ],
          [
            o(
              'Give them back',
              [N('Yes! Giving back what belongs to someone else is fair.')],
              true,
            ),
            o('Keep them', [N('That would not be fair. We give back what belongs to others.')]),
          ],
          'Talked about giving back what belongs to someone else.',
        ),
      ],
    ),
    sc(
      'a26-18-complete',
      [N('Your Nubbin climbs up on your shoulder and looks at the wall.'), ...MOSS_HOME],
      [COMPLETE_BEAT],
    ),
  ],
);

// ================================================================== variants
export const EDU_A26_SPROUT_VARIANTS: EduScene[] = [
  sc(
    'a26-01-page-moss',
    [
      N('Nova’s book falls open. A great brick wall shines in the sun.'),
      N('Moss climbs your sleeve and settles on your shoulder.'),
      MO('Old, that wall. I will come, if it is all the same to you.'),
      N('The bricks are warm under your feet. A city of flat roofs runs down to a river.'),
      N('An old woman sits on a pile of bricks, eating a date.'),
      BR('Hello, new friends! Come and walk the wall with me.', 'happy'),
      BR('This city is called Uruk. Long ago it stood where Iraq is today.'),
      BR('A river runs beside it. People made their homes near the water.'),
    ],
    [
      ask(
        7,
        'social-studies',
        'a city can sit beside a river, in a place on the map',
        'D2.Geo.2.K-2',
        [N('(Look at the river on the page.) Where is Uruk?')],
        [
          o(
            'Beside a river',
            [BR('Yes! Uruk is beside a river. Water is good for drinking and for growing food.')],
            true,
          ),
          o('Up on the moon', [
            BR('Not quite! Uruk is on the ground, beside a river. Look at the water.'),
          ]),
          o('In the middle of the sea', [
            BR('Not quite! It is beside a river, with land all around.'),
          ]),
        ],
        'Learned that Uruk stood beside a river, in the land that is now Iraq.',
      ),
    ],
    {
      choices: [
        ch('bricks', 'Ask how you tell a good brick.', [
          BR('You knock it. A good brick rings!', 'happy'),
        ]),
        ch('king', 'Ask who built the wall.', [
          BR('The king says he did. But many hands helped. Come and see.', 'think'),
        ]),
      ],
    },
  ),
  sc(
    'a26-03-herd-done-moss',
    [
      N('You sit under a thorn tree. Moss climbs down and sits beside you.'),
      N('Enkidu strokes a gazelle’s ear, ever so gently.'),
      MO('Nothing wrong with him. He just has not met anyone yet.'),
    ],
    [HERD_DONE_BEAT],
  ),
  sc(
    'a26-13-dream-done-spoke',
    [
      N('Enkidu turns to look at you. His eyes are wet.'),
      EN('You said to let him go. You were the only one.', 'sad'),
      EN('I was scared, so I was unkind. I am sorry.'),
      N('He holds your hand while the window turns grey.'),
    ],
    [
      ask(
        2,
        'sel',
        'saying sorry mends hurt feelings',
        'CASEL: Relationship skills',
        [N('Enkidu says sorry. Why is it good to say sorry?')],
        [
          o('It helps mend hurt feelings', [N('Yes! A true sorry helps mend things.')], true),
          o('It makes the dream go away', [
            N('Not the dream. But saying sorry helps mend hurt feelings.'),
          ]),
        ],
        'Talked about why saying sorry helps.',
      ),
    ],
  ),
  sc(
    'a26-13-dream-done-agreed',
    [
      N('Enkidu turns to look at you. He tries to smile.'),
      EN('We did it together. We will carry it together.'),
      N('He holds your hand while the window turns grey.'),
    ],
    [
      ask(
        1,
        'sel',
        'sharing a heavy feeling makes it lighter',
        'CASEL: Relationship skills',
        [N('Friends carry sad things together. Why does sharing help?')],
        [
          o(
            'A shared feeling feels lighter',
            [N('Yes! Heavy feelings feel lighter when a friend shares them.')],
            true,
          ),
          o('It makes the feeling bigger', [
            N('It can feel the opposite! Shared feelings feel lighter.'),
          ]),
        ],
        'Talked about sharing a heavy feeling with a friend.',
      ),
    ],
  ),
  sc(
    'a26-14-sickbed-done-spoke',
    [
      EN('Water-carrier, will you do something for me, after?'),
      N('He opens his big hand. In it is a small brown cedar seed.'),
      EN('Plant it. A tree for the forest. You will know where.', 'soft'),
      Y('I will.'),
    ],
    [
      ask(
        2,
        'science',
        'seeds need soil, water and sun to grow',
        'K-LS1-1',
        [N('A seed can grow into a tree. What does a seed need?')],
        [
          o('Soil, water and sun', [N('Yes! Seeds need soil, water and sunlight to grow.')], true),
          o('Loud music', [N('Ha! No music. Seeds need soil, water and sunlight.')]),
        ],
        'Learned that seeds need soil, water and sun to grow.',
      ),
    ],
  ),
  sc(
    'a26-14-sickbed-done-agreed',
    [
      EN('Water-carrier, will you do something for me, after?'),
      EN(
        'Tell the shepherds their watchman thought of them. Tell them to keep the lamps lit.',
        'soft',
      ),
      Y('I will.'),
    ],
    [
      ask(
        2,
        'social-studies',
        'stories keep people remembered',
        'D2.His.2.K-2',
        [
          N(
            'Enkidu asks you to tell the shepherds something. Why do we tell stories about people we care about?',
          ),
        ],
        [
          o('So they are remembered', [N('Yes! Stories keep people close, long after.')], true),
          o('So we forget them', [N('No, the opposite. Stories help us remember.')]),
        ],
        'Talked about how stories help us remember people.',
      ),
    ],
  ),
  sc(
    'a26-14-death-done-moss',
    [
      N('Moss climbs down from your shoulder and sits at the end of the bed.'),
      N('He says nothing at all, all night. It is the kindest thing he has.'),
      N('Your Nubbin climbs into Gilgamesh’s lap too.'),
    ],
    [
      ask(
        2,
        'sel',
        'staying close helps even without words',
        'CASEL: Relationship skills',
        [N('Moss did not say anything. How did he help?')],
        [
          o('He stayed close', [N('Yes! Sometimes just being there is the kindest thing.')], true),
          o('He sang a loud song', [N('No song. He stayed close, and that was enough.')]),
        ],
        'Talked about how staying close can comfort someone who is sad.',
      ),
    ],
  ),
  sc(
    'a26-16-siduri-done-moss',
    [
      MO('She is right. I would have said it shorter.'),
      SI('Who is this on your shoulder?'),
      MO('Someone who has lost many friends, and still has supper.', 'soft'),
      SI('Then you will have a cup with me.', 'soft'),
      GI('Where is the boatman?', 'angry'),
      SI('In the woods by the shore. Be gentle with him.'),
      N('Your Nubbin climbs into your lap and falls fast asleep.'),
    ],
    [{ ...SIDURI_DONE_BEAT, after: 6 }],
  ),
  sc(
    'a26-17-snake-done-hazel',
    [
      GI('All that way. And a snake has it.', 'sad'),
      UR('Yes. And now we go home anyway. Come on.'),
      N('In the margin of the page there is writing in pencil.'),
      N('You know the hand.'),
      N('“Lost the plant. Kept the wall.”'),
      N('“Good trade.”'),
      N('And under it, one letter: H.'),
    ],
    [
      ask(
        6,
        'literacy',
        'what happened in a story',
        'RL.K.3',
        [N('Hazel wrote “Kept the wall”. What did Gilgamesh keep?')],
        [
          o('The wall of his city', [N('Yes! He lost the plant but kept the wall.')], true),
          o('The plant', [N('The snake took the plant. Gilgamesh kept the wall of his city.')]),
        ],
        'Named what a character kept at the end of a story.',
      ),
    ],
  ),
  sc(
    'a26-18-foot-spoke',
    [
      N('At the foot of the wall, the old brickmaker sits eating a date.'),
      BR('There you are. Long story, was it?'),
      N('By the river there is a cedar sapling, no higher than your knee.'),
      N('Gilgamesh kneels beside it. He touches one little needle, very gently.'),
      GI('You told me to let him go. I should have listened.', 'sad'),
      ...BRICK_LINES,
    ],
    [{ ...FOOT_BEAT, after: 7 }],
    { choices: FOOT_CHOICES },
  ),
  sc(
    'a26-18-foot-agreed',
    [
      N('At the foot of the wall, the old brickmaker sits eating a date.'),
      BR('There you are. Long story, was it?'),
      N('Gilgamesh stops beside you. He looks at you for a long time.'),
      GI('We both learned it late.', 'soft'),
      ...BRICK_LINES,
    ],
    [{ ...FOOT_BEAT, after: 6 }],
    { choices: FOOT_CHOICES },
  ),
  sc(
    'a26-18-complete-moss',
    [
      N('Moss has been quiet all the way home. He looks at the wall, brick by brick.'),
      MO(
        'He walked to the end of the world so as not to die. Then he came home and pointed at a wall.',
      ),
      MO('That is the right answer. He just took the long way.', 'soft'),
      ...MOSS_HOME,
    ],
    [{ ...COMPLETE_BEAT, after: 3 }],
  ),
  sc(
    'a26-18-complete-moss-spoke',
    [
      N('Moss has been quiet all the way home. He looks at the wall, brick by brick.'),
      MO(
        'He walked to the end of the world so as not to die. Then he came home and pointed at a wall.',
      ),
      MO('That is the right answer. He just took the long way.', 'soft'),
      N('He looks down at the cedar sapling by the river for a while.'),
      MO('And somebody let a tree live. That is the other answer.', 'soft'),
      ...MOSS_HOME,
    ],
    [{ ...COMPLETE_BEAT, after: 5 }],
  ),
  sc(
    'a26-grove-brick',
    [
      N('You carry the brick up the hill to the flat stone where Moss sits.'),
      N('Your handprint and the pawprint face the sky.'),
      N('Your Nubbin knocks on the brick. It rings.'),
      N('You put the cedar box on the cottage shelf. It smells like a forest far away.'),
    ],
    [
      ask(
        3,
        'literacy',
        'words that tell about our senses',
        'RL.1.4',
        [N('Which part of you smells the cedar box: your nose or your ears?')],
        [
          o('Your nose', [N('Yes! Your nose smells the forest in the box.')], true),
          o('Your ears', [N('Ears hear. Your nose does the smelling.')]),
        ],
        'Linked the sense of smell with the nose.',
      ),
    ],
  ),
  sc(
    'a26-grove-brick-flower',
    [
      N('You carry the brick up the hill to Moss’s flower by the flat stone.'),
      N('Your handprint and the pawprint face the sky.'),
      N('Your Nubbin knocks on the brick. It rings.'),
      N('You sit a while by the flower and the brick. It feels right.'),
      N('You put the cedar box on the cottage shelf. It smells like a forest far away.'),
    ],
    [
      ask(
        4,
        'literacy',
        'words that tell about our senses',
        'RL.1.4',
        [N('Which part of you smells the cedar box: your nose or your ears?')],
        [
          o('Your nose', [N('Yes! Your nose smells the forest in the box.')], true),
          o('Your ears', [N('Ears hear. Your nose does the smelling.')]),
        ],
        'Linked the sense of smell with the nose.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A26_SPROUT: EduQuest[] = [
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
  Q16,
  Q17,
  Q18,
];

/** Every `edu:` check string used by the lessons above. */
export const CHECKS: string[] = [
  'edu:tap:brick:listen',
  'edu:count:drum-beats:3',
  'edu:count:gazelles:4',
  'edu:count:lambs:5',
  'edu:clap:syllables:gilgamesh',
  'edu:count:nights:5',
  'edu:count:logs:3',
  'edu:count:waterskins:3',
  'edu:count:steps:12',
  'edu:count:poles:10',
  'edu:count:loaves:7',
];
