/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Atlas page A6, Seven Voyages.
 *
 * One EduScene per original scene (every step scene, done scene, complete scene and variant), id
 * `sprout:<original id>`. Source: atlas-a06.ts. See EDU-STYLE.md and docs/briefs/edu-new.md.
 *
 * - Every choice keeps its original id and `set` flag (a06-stone and a06-ivory still work). All the
 *   original choices are kind and safe, so none are dropped.
 * - Hard things: Sinbad’s wife dies (A6-8), said plainly and gently with comfort straight after; the
 *   burial custom is never described, only “a hard rule that sent him down into a dark cave”.
 *   Pirates and slavery (A6-13) become “pirates took the ship and carried everyone far away; Sinbad
 *   has to work and cannot go home”. No snake strikes, nobody is eaten or hurt, no elephant is hurt.
 * - Cultural care kept: Baghdad is a city of learning; the Caliph is shown with dignity; no ivory is
 *   ever a prize; the four faiths on Sri Pada are left to the reader band; no quotes from any text.
 * - Facts used (all well established): paper is for writing, whales breathe air, snakes warm up in
 *   the sun, wood floats and stone sinks, baby birds hatch from eggs, elephants live in families led
 *   by the oldest female, the monsoon winds change direction in the year.
 */
import type { EduQuest, EduScene, Lesson } from './types';
import type { Line, Choice } from '../config/story';

type Mood = Line['mood'];
const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const Y = say('you');
const P = say('a06-porter');
const S = say('a06-sailor');
const YS = say('a06-young');
const ST = say('a06-steward');
const D = say('a06-daughter');
const CP = say('a06-captain');
const KI = say('a06-king-isle');
const ME = say('a06-merchant');
const GA = say('a06-gatherer');
const FA = say('a06-farmer');
const KS = say('a06-king-serendib');
const CA = say('a06-caliph');
const TR = say('a06-translator');
const MA = say('a06-master');
const NV = say('nova');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];
type Dom = Lesson['domain'];

const o = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

const nt = (
  after: number,
  domain: Dom,
  skill: string,
  standard: string | undefined,
  lines: Line[],
  parentNote: string,
): Beat => ({
  domain,
  skill,
  ...(standard ? { standard } : {}),
  kind: 'notice',
  after,
  lines,
  parentNote,
});

const ak = (
  after: number,
  domain: Dom,
  skill: string,
  standard: string | undefined,
  prompt: Line[],
  options: Opt[],
  parentNote: string,
): Beat => ({
  domain,
  skill,
  ...(standard ? { standard } : {}),
  kind: 'ask',
  after,
  prompt,
  options,
  parentNote,
});

const dn = (
  after: number,
  domain: Dom,
  skill: string,
  standard: string | undefined,
  check: string,
  lines: Line[],
  parentNote: string,
): Beat => ({
  domain,
  skill,
  ...(standard ? { standard } : {}),
  kind: 'do',
  after,
  check,
  lines,
  parentNote,
});

const CAP = 14;
const wc = (t: string): number => t.trim().split(/\s+/).length;

/** Splits text into pieces of at most CAP words, at sentence ends first, then at commas. */
const pieces = (text: string): string[] => {
  if (wc(text) <= CAP) return [text];
  const sentences = text.split(/(?<=[.!?”)])\s+/);
  const out: string[] = [];
  let cur = '';
  for (const sen of sentences) {
    const parts = wc(sen) <= CAP ? [sen] : sen.split(/(?<=[,;:])\s+/);
    for (const part of parts) {
      if (cur && wc(`${cur} ${part}`) > CAP) {
        out.push(cur);
        cur = part;
      } else cur = cur ? `${cur} ${part}` : part;
    }
  }
  if (cur) out.push(cur);
  return out;
};

/** Keeps every line within the sprout cap. Returns the new lines and, for each old index, the new index of its last piece. */
const fit = (lines: Line[]): { out: Line[]; last: number[] } => {
  const out: Line[] = [];
  const last: number[] = [];
  for (const l of lines) {
    pieces(l.text).forEach((t, i) =>
      out.push(i === 0 && l.mood ? { who: l.who, text: t, mood: l.mood } : { who: l.who, text: t }),
    );
    last.push(out.length - 1);
  }
  return { out, last };
};

/** One sprout scene. Lesson ids are `sprout:<of>-l<n>`, numbered in play order. Lines over the cap are split at a sentence break. */
const sc = (
  of: string,
  rawLines: Line[],
  beats: Beat[],
  extra: { choices?: Choice[] } = {},
): EduScene => {
  const { out, last } = fit(rawLines);
  const choices = extra.choices?.map((c) => ({
    ...c,
    ...(c.then ? { then: fit(c.then).out } : {}),
  }));
  return {
    id: `sprout:${of}`,
    of,
    band: 'sprout',
    lines: out,
    ...(choices ? { choices } : {}),
    lessons: [...beats]
      .sort((a, b) => a.after - b.after)
      .map((beat, i) => {
        const lesson: Lesson = {
          id: `sprout:${of}-l${i + 1}`,
          ...beat,
          after: last[beat.after] ?? beat.after,
        };
        if (beat.lines) lesson.lines = fit(beat.lines).out;
        if (beat.prompt) lesson.prompt = fit(beat.prompt).out;
        if (beat.options)
          lesson.options = beat.options.map((op) => ({ ...op, reply: fit(op.reply).out }));
        return lesson;
      }),
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

const SEL = 'ELOF: Social and Emotional Development';
const LANG = 'ELOF: Language and Communication';
const LIT = 'ELOF: Literacy';

// ================================================================== A6-1 Two Sinbads
const A01: EduQuest = quest(
  'a06-01',
  'Two Sinbads',
  {
    'a06-01-s1': {
      goal: 'Help your friend Sinbad carry paper to the big library.',
      hint: 'Pick up the basket. Follow Sinbad through the lanes.',
    },
    'a06-01-s2': {
      goal: 'Sit on the bench in the shade by the big house.',
      hint: 'Sit down beside Sinbad by the gate.',
    },
    'a06-01-s3': {
      goal: 'Go in and meet the old man of the house.',
      hint: 'Follow the helper through the courtyard.',
    },
  },
  [
    sc(
      'a06-01-street',
      [
        N('A page in Nova’s atlas opens. A round city sits by a river.'),
        N('You touch the river and, whoosh, you are in a busy lane!'),
        P('Steady now! This basket has paper in it.'),
        P('Paper is for writing. Clever people write books on it.'),
        N('Your Nubbin rides on top of the paper rolls.'),
        P('How many rolls are in your basket? Let’s count.'),
        N('(Point to each roll. Count them together.)'),
        N('One, two, three, four, five!'),
      ],
      [
        dn(
          6,
          'maths',
          'count to 5 and say how many',
          'K.CC.B.5',
          'edu:count:paper-rolls:5',
          [P('Five rolls! Touch each one as you say its number.', 'happy')],
          'Counted five paper rolls, touching each one.',
        ),
      ],
      {
        choices: [
          {
            id: 'take',
            label: 'Take one of his baskets as well.',
            then: [P('Thank you, friend! Now we carry together.', 'happy')],
          },
          {
            id: 'ask',
            label: 'Ask what the scholars do with all this paper.',
            then: [
              P('They write and read. They make books about stars, and numbers, and medicine.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a06-01-street-done',
      [
        N('At the big library, a young man counts the rolls.'),
        N('He pays Sinbad. Clink, clink!'),
        P('This is the House of Wisdom. It is a library.'),
        P('People come here to read, and write, and learn.'),
      ],
      [
        nt(
          3,
          'social-studies',
          'a long time ago there were big libraries in cities',
          'D2.His.2.K-2',
          [
            P('A very long time ago, people in Baghdad shared books here.'),
            P('They shared what they knew. Sharing is a good thing to do.'),
          ],
          'Heard that long ago there was a big library in a city called Baghdad where people shared books.',
        ),
      ],
    ),
    sc(
      'a06-01-bench',
      [
        N('Sinbad and you walk home. You stop by a big house.'),
        N('Sinbad sits on a stone bench. He puts down his baskets.'),
        N('Yum! You can smell warm food from the gate.'),
        P('Somebody in there is eating lamb. I am going home to lentils!', 'angry'),
        P('I carry heavy loads all day. It is not fair!'),
        N('Sinbad says this very loudly. A window opens up high.'),
        N('Your Nubbin looks up at the window.'),
      ],
      [
        ak(
          4,
          'sel',
          'name a feeling',
          SEL,
          [N('Sinbad’s face is scrunched up. His fists are tight. How does he feel?')],
          [
            o(
              'Cross.',
              [
                N(
                  'Yes! Sinbad is cross. His face is scrunched. Cross is a feeling, and feelings are allowed.',
                ),
              ],
              true,
            ),
            o('Sleepy.', [
              N('Not quite. Look at his scrunched face and his tight fists. Sinbad is cross.'),
            ]),
            o('Silly.', [
              N('Not quite. Silly people giggle. Sinbad is scrunched up and growly. He is cross.'),
            ]),
          ],
          'Named a feeling (cross) from a face and body.',
        ),
      ],
      {
        choices: [
          {
            id: 'hush',
            label: 'Tell him to keep his voice down.',
            then: [P('Why? It is true, even in a whisper.')],
          },
          {
            id: 'agree',
            label: 'Say it isn’t fair.',
            then: [P('Thank you! I feel a little better.', 'happy')],
          },
        ],
      },
    ),
    sc(
      'a06-01-bench-done',
      [
        N('The gate opens. A helper in a neat turban looks out.'),
        ST('My master wants to meet the man who was talking.'),
        ST('And his friend. And that.'),
        N('(That is your Nubbin. It waves.)'),
      ],
      [
        ak(
          1,
          'literacy',
          'first sound of a name',
          'RF.K.2',
          [N('Sinbad starts with a “sss” sound. Which of these starts with “sss” too?')],
          [
            o('Sun.', [N('Yes! Sss-sun and Sss-Sinbad start the same.')], true),
            o('Moon.', [
              N('Mmm-moon starts with “mmm”. Sinbad starts with “sss”. Sss-sun does too!'),
            ]),
            o('Boat.', [N('Buh-boat starts with “buh”. Sss-sun starts like Sss-Sinbad!')]),
          ],
          'Matched the first sound “s” in Sinbad and sun.',
        ),
      ],
    ),
    sc(
      'a06-01-hall',
      [
        N('Inside, there is a courtyard with a fountain.'),
        N('Then there is a long room with soft cushions.'),
        N('An old man with a white beard sits at the end.'),
        S('Sit, sit! Eat first. Lamb is better than grumbling.', 'happy'),
        P('You heard me grumble?', 'shock'),
        S('The whole street heard! What is your name?'),
        P('Sinbad. Sinbad the porter.'),
        S('Ha! I am Sinbad too. Sinbad the sailor.', 'happy'),
      ],
      [
        ak(
          7,
          'maths',
          'positions: on, under, beside',
          'K.G.A.1',
          [
            N(
              'Sinbad the porter sits on the very edge of a cushion. Is he sitting on the cushion, or under it?',
            ),
          ],
          [
            o('On it.', [N('Yes! He is on the cushion. (Pat a cushion near you.)')], true),
            o('Under it.', [
              N(
                'Not under. A cushion is soft, but nobody sits under it! Sinbad is on the cushion.',
              ),
            ]),
          ],
          'Used the position word “on” for where someone sits.',
        ),
      ],
    ),
    sc(
      'a06-01-hall-done',
      [
        N('The porter sits right on the edge of the cushion.'),
        N('He looks a little shy in such a fancy room.'),
      ],
      [
        nt(
          1,
          'sel',
          'feeling shy is okay',
          SEL,
          [
            N('Sinbad feels shy. Shy means a bit nervous with new people.'),
            N('That is okay. A smile and a friend help. Look, you are his friend!'),
          ],
          'Learned that feeling shy is okay, and that a smile or a friend helps.',
        ),
      ],
    ),
    sc(
      'a06-01-complete',
      [
        S('Seven times I went to sea. Seven stories!'),
        S('I will tell one story each night. You can take food home.'),
        P('My daughter will love that.', 'soft'),
        S('You too, little friend. Sit close.'),
        N('The old man smiles at you and your Nubbin.'),
      ],
      [
        nt(
          4,
          'social-studies',
          'long ago, stories were told out loud',
          'D2.His.2.K-2',
          [
            N('Long ago, many people could not read. So they told stories out loud.'),
            N('Families still tell stories at bedtime. Does somebody tell you one?'),
          ],
          'Heard that long ago stories were told out loud, and linked it to bedtime stories today.',
        ),
      ],
    ),
  ],
);

// ================================================================== A6-2 The Island That Moved
const A02: EduQuest = quest(
  'a06-02',
  'The Island That Moved',
  {
    'a06-02-s1': {
      goal: 'Listen to the first story. Step into it.',
      hint: 'Sit on your cushion until the carpet turns to sea.',
    },
    'a06-02-s2': {
      goal: 'Pick up sticks for the fire on the little island.',
      hint: 'Pick up sticks under the trees. Take them to the fire.',
    },
    'a06-02-s3': {
      goal: 'Hold on to the washtub in the sea.',
      hint: 'Keep hold of the tub and kick.',
    },
  },
  [
    sc(
      'a06-02-telling',
      [
        S('When I was young, I spent my money too fast.'),
        S('So I went to a city called Basra to take a ship.'),
        N('The carpet turns blue. It starts to move!'),
        N('Now you are on a ship. It has a big triangle sail.'),
        N('A young man leans on the rail. He grins at the sea.'),
        YS('You are new! Good. Nobody else has heard my jokes.', 'happy'),
      ],
      [
        ak(
          3,
          'maths',
          'name a triangle',
          'K.G.A.2',
          [N('The ship’s big sail has three corners and three straight sides. What shape is it?')],
          [
            o(
              'A triangle.',
              [N('Yes! Three corners, three sides. A triangle! (Trace one in the air.)')],
              true,
            ),
            o('A circle.', [
              N(
                'A circle is round with no corners. This sail has three corners. It is a triangle!',
              ),
            ]),
            o('A square.', [
              N(
                'A square has four corners. Count the sail’s corners: one, two, three. A triangle!',
              ),
            ]),
          ],
          'Named a triangle by counting its sides and corners.',
        ),
      ],
      {
        choices: [
          {
            id: 'joke',
            label: 'Ask to hear a joke.',
            then: [
              YS('What is the difference between a merchant and a sailor?'),
              YS('About three days out of Basra!', 'happy'),
            ],
          },
          {
            id: 'sea',
            label: 'Ask if he’s been to sea before.',
            then: [YS('Never! Isn’t it wonderful?', 'happy')],
          },
        ],
      },
    ),
    sc(
      'a06-02-telling-done',
      [
        N('Days and days of blue sea go by. Splash, splash!'),
        N('Then a sailor shouts, “Land!”'),
        N('A small green island. It is flat as a plate.'),
      ],
      [
        nt(
          2,
          'science',
          'sea and land are different places',
          'K-ESS3-1',
          [
            YS(
              'The sea is water, and the island is land. Fish live in the sea, and trees grow on land.',
            ),
          ],
          'Noticed that sea and land are different places where different things live.',
        ),
      ],
    ),
    sc(
      'a06-02-island',
      [
        CP('Everybody ashore! Wash your shirts. Back by evening!'),
        N('The island feels soft and bouncy.'),
        YS('Sticks for the fire! Let’s cook on dry land.', 'happy'),
        N('The sailors light a fire. Somebody sings.'),
        N('Your Nubbin sits down. Then it jumps up!'),
        N('The ground is warm. It is warm from underneath.'),
      ],
      [
        dn(
          2,
          'maths',
          'count sticks to 4',
          'K.CC.B.5',
          'edu:count:firewood:4',
          [YS('Four sticks make a good fire. Count them with me: one, two, three, four!')],
          'Counted four sticks for the fire.',
        ),
      ],
      {
        choices: [
          {
            id: 'tell',
            label: 'Tell Sinbad the ground is warm.',
            then: [YS('It is just the sun, friend. Have a date.')],
          },
          {
            id: 'fire',
            label: 'Kick sand over the fire.',
            then: [YS('Hey! That was our supper!', 'angry')],
          },
        ],
      },
    ),
    sc(
      'a06-02-island-done',
      [
        N('The island shakes. Wobble, wobble!'),
        N('All the little trees lean the same way.'),
        CP('It is not an island! It is a fish! Run!', 'shock'),
      ],
      [
        nt(
          2,
          'science',
          'whales are big animals that breathe air',
          'K-LS1-1',
          [
            N('It is a whale! Whales are very big animals. They live in the sea.'),
            N('Whales breathe air, like you. So they come up to the top to breathe.'),
          ],
          'Learned that a whale is a big sea animal that breathes air.',
        ),
      ],
    ),
    sc(
      'a06-02-tub',
      [
        N('The whale rolls over, slowly. A great eye opens.'),
        N('Then it dives. Everyone falls into the sea!'),
        YS('Here! The washtub! Hold on!', 'shock'),
        N('Sinbad holds the tub, and you hold Sinbad. Your Nubbin holds your ear.'),
        N('Far below, something sings one long, low note. Ooooo.'),
        N('Then it is quiet.'),
      ],
      [
        ak(
          4,
          'music',
          'high and low sounds',
          undefined,
          [
            N(
              'The whale sings a long, low note. Is a whale’s song high like a mouse, or low like a drum?',
            ),
          ],
          [
            o(
              'Low, like a drum.',
              [N('Yes! Big animals often make deep, low sounds. Ooooo! (Hum it low.)')],
              true,
            ),
            o('High, like a mouse.', [
              N('Mice squeak high. The whale is huge, and its note is low. Ooooo!'),
            ]),
          ],
          'Linked a big animal with a low sound.',
        ),
      ],
      {
        choices: [
          { id: 'kick', label: 'Kick, hard.', then: [N('The tub spins round and round. Whee!')] },
          {
            id: 'float',
            label: 'Float, and let the current take you.',
            then: [YS('Good thinking. The sea knows where it is going.', 'think')],
          },
        ],
      },
    ),
    sc(
      'a06-02-tub-done',
      [
        N('A day goes by, then a night, then another day.'),
        N('Bump! The tub hits sand.'),
        YS('Land! Hooray!', 'happy'),
      ],
      [
        ak(
          2,
          'literacy',
          'put events in order: first, next, last',
          LANG,
          [N('First there was a day. Next there was a night. What came last?')],
          [
            o('Another day.', [N('Yes! A day, a night, then another day.')], true),
            o('Another night.', [
              N('Listen again: a day, a night, and then another day. That came last.'),
            ]),
          ],
          'Retold a short sequence in order.',
        ),
      ],
    ),
    sc(
      'a06-02-complete',
      [
        N('The carpet is a carpet again. The porter’s mouth is open.'),
        P('A fish. With trees on it!'),
        S('A whale. We did not know the word then.'),
        P('And you lit a fire on its back!', 'think'),
        S('It was a very good fire.', 'happy'),
        N('Your Nubbin is still damp. Drip, drip.'),
      ],
      [
        nt(
          4,
          'sel',
          'laughing together',
          SEL,
          [
            P('Everybody laughed. Laughing together makes friends feel close.'),
            P('You can laugh with a friend, and never at them.'),
          ],
          'Heard that laughing together helps friends feel close.',
        ),
      ],
    ),
  ],
);

// ================================================================== A6-3 The King’s Stables
const A03: EduQuest = quest(
  'a06-03',
  'The King’s Stables',
  {
    'a06-03-s1': {
      goal: 'Go with the groom to meet the king.',
      hint: 'Follow the groom up from the beach.',
    },
    'a06-03-s2': {
      goal: 'Help Sinbad look at the cargo of a ship.',
      hint: 'Look at the marks on the bales.',
    },
    'a06-03-s3': {
      goal: 'Help Sinbad show who he is.',
      hint: 'Look inside the bale with the green cord.',
    },
  },
  [
    sc(
      'a06-03-shore',
      [
        N('You are on a beach. Sinbad sits up and counts his fingers.'),
        N('Down the beach, lovely horses eat grass by the waves.'),
        N('A kind groom takes you both to see his king.'),
        KI('A man who came out of the sea in a tub! Tell me about your city.', 'happy'),
        YS('It is round, your majesty. Perfectly round. The palace is in the middle.'),
        KI('Round? Why round?', 'think'),
      ],
      [
        ak(
          5,
          'maths',
          'name a circle',
          'K.G.A.2',
          [N('Sinbad’s city is round, like a plate. What shape is a plate?')],
          [
            o(
              'A circle.',
              [N('Yes! A circle is round, with no corners. (Draw a big circle in the air.)')],
              true,
            ),
            o('A triangle.', [N('A triangle has three corners. A round city is a circle!')]),
          ],
          'Named a circle as the shape of a round thing.',
        ),
      ],
      {
        choices: [
          {
            id: 'fair',
            label: 'Say: so the palace is the same distance from every gate.',
            then: [KI('Fair! I like a fair city.', 'happy')],
          },
          {
            id: 'market',
            label: 'Say: so the markets never come to an end.',
            then: [KI('Ha! A city you can’t get out of!', 'happy')],
          },
        ],
      },
    ),
    sc(
      'a06-03-shore-done',
      [
        N('The king makes Sinbad keeper of the harbour.'),
        N('Sinbad writes down every ship that comes and goes.'),
        N('And he asks each captain the way to Baghdad.'),
      ],
      [
        nt(
          1,
          'literacy',
          'writing helps us remember',
          LIT,
          [YS('I write the ships in my book. Then I do not forget. Writing helps us remember!')],
          'Heard that writing things down helps us remember.',
        ),
      ],
    ),
    sc(
      'a06-03-harbour',
      [
        N('Months go by. One day a ship sails in with a patch on its sail.'),
        YS('That is our ship! That is my ship!', 'shock'),
        CP('We sell these bales for a merchant who drowned. Sinbad of Baghdad.'),
        YS('I am Sinbad! I am him!'),
        CP('Everyone says they are Sinbad when there is a bale to be had.', 'angry'),
        N('Sinbad’s shoulders droop. Nobody believes him.'),
      ],
      [
        ak(
          5,
          'sel',
          'feelings when nobody believes you',
          SEL,
          [N('Sinbad tells the truth, but nobody believes him. How might he feel?')],
          [
            o(
              'Sad, and cross.',
              [
                N(
                  'Yes. It feels sad and cross when nobody believes you. A friend nearby helps. You are right here!',
                ),
              ],
              true,
            ),
            o('Very, very happy.', [
              N('Hmm. His shoulders are drooping. He feels sad and cross, and a friend can help.'),
            ]),
          ],
          'Thought about how it feels when nobody believes you.',
        ),
      ],
    ),
    sc(
      'a06-03-harbour-done',
      [
        N('The captain folds his arms.'),
        N('The bales sit on the quay.'),
        N('Your Nubbin sniffs one. Sniff, sniff!'),
      ],
      [
        ak(
          2,
          'science',
          'the nose smells',
          'K-LS1-1',
          [N('Your Nubbin sniffs a bale. Which part of the body does the smelling?')],
          [
            o('The nose.', [N('Yes! The nose smells. Sniff, sniff! (Touch your nose.)')], true),
            o('The knee.', [N('Knees bend, but they do not smell! Noses do. Sniff, sniff!')]),
          ],
          'Named the nose as the part that smells.',
        ),
      ],
    ),
    sc(
      'a06-03-proof',
      [
        YS('Ask me anything about the voyage.'),
        CP('What is in the bale with the green cord?', 'think'),
        N('Sinbad goes blank. He cannot remember.'),
        N('Your Nubbin tugs the cord. A corner of blue cloth peeks out.'),
        N('(Point to the blue. Say “blue”!)'),
      ],
      [
        dn(
          4,
          'art',
          'name the colour blue',
          'ELOF: Approaches to Learning',
          'edu:tap:colour:blue',
          [YS('Blue! It is blue cloth! It is indigo, from my uncle’s shop!', 'happy')],
          'Found and named the colour blue.',
        ),
      ],
      {
        choices: [
          {
            id: 'point',
            label: 'Point at the blue cloth, and let Sinbad say it.',
            then: [
              YS('Indigo! Twenty lengths from my uncle’s shop!', 'happy'),
              CP('That is right!', 'shock'),
            ],
          },
          {
            id: 'whisper',
            label: 'Whisper, “Your uncle’s shop.”',
            then: [
              YS('My uncle’s indigo! Twenty lengths!', 'happy'),
              CP('Only Sinbad would know that!', 'shock'),
            ],
          },
        ],
      },
    ),
    sc(
      'a06-03-proof-done',
      [
        CP('I am sorry I left you.', 'soft'),
        CP('Please take your bales. And take my hand.'),
        N('Sinbad shakes the captain’s hand.'),
      ],
      [
        nt(
          1,
          'sel',
          'saying sorry and forgiving',
          SEL,
          [
            N('The captain says sorry. Saying sorry is brave.'),
            N('Sinbad says okay. That is called forgiving. Friends do both.'),
          ],
          'Heard that saying sorry is brave and that friends can forgive.',
        ),
      ],
    ),
    sc(
      'a06-03-complete',
      [
        N('Sinbad sells his bales. He gives the king a gift.'),
        N('He sails home with the captain. They are friends now.'),
        P('He left you in the sea, and you shook his hand?'),
        S('He came back with all my things. That is rare.'),
      ],
      [
        ak(
          3,
          'literacy',
          'who did what in a story',
          'RL.K.3',
          [N('Who said sorry to Sinbad?')],
          [
            o('The captain.', [N('Yes! The captain said sorry, and Sinbad forgave him.')], true),
            o('The king.', [
              N('The king was kind, but the captain said sorry. Sinbad forgave the captain.'),
            ]),
          ],
          'Remembered who did what in the story.',
        ),
      ],
    ),
  ],
);

// ================================================================== A6-4 The Roc’s Egg
const A04: EduQuest = quest(
  'a06-04',
  'The Roc’s Egg',
  {
    'a06-04-s1': {
      goal: 'Find out where the ship has gone.',
      hint: 'Climb the tallest tree and look all round.',
    },
    'a06-04-s2': { goal: 'Walk round the white dome.', hint: 'Walk round it. Put your ear to it.' },
    'a06-04-s3': {
      goal: 'Tie yourselves to the big bird’s foot.',
      hint: 'Help Sinbad with the turban cloth.',
    },
  },
  [
    sc(
      'a06-04-left',
      [
        S('This is the second voyage. I got bored, so I sailed again.'),
        N('You are on an island with fruit trees and a cold spring.'),
        YS('Rest for an hour. The captain said an hour.'),
        N('You and Sinbad sleep under a tree.'),
        N('You wake up, and the sea is empty. The ship has gone!'),
        YS('Twice now! Why does everyone leave me?', 'sad'),
      ],
      [
        ak(
          5,
          'sel',
          'what to do when you feel left out',
          SEL,
          [N('Sinbad feels sad and left out. What could help him?')],
          [
            o(
              'A friend beside him.',
              [N('Yes! A friend sits close. You are here. That helps a lot.')],
              true,
            ),
            o('Hiding all alone.', [
              N('Hiding can make sad feel bigger. A friend sitting close helps more.'),
            ]),
          ],
          'Thought about what helps when someone feels sad and left out.',
        ),
      ],
      {
        choices: [
          {
            id: 'comfort',
            label: 'Say it isn’t him, it’s captains.',
            then: [YS('That is kind. It is probably true.', 'soft')],
          },
          {
            id: 'climb',
            label: 'Say you should climb a tree and look.',
            then: [YS('Yes! Doing something is better than sulking.')],
          },
        ],
      },
    ),
    sc(
      'a06-04-left-done',
      [
        N('You climb the tallest tree on the island.'),
        N('From the top, you can see everything. The bushes below look tiny!'),
        N('On the far side is a great white dome. It shines.'),
      ],
      [
        ak(
          1,
          'maths',
          'compare: tallest',
          'K.MD.A.2',
          [N('You climb the tallest tree. Is the tallest tree taller or shorter than the bushes?')],
          [
            o(
              'Taller.',
              [N('Yes! The tallest tree is taller than the bushes. (Stretch up high!)')],
              true,
            ),
            o('Shorter.', [
              N(
                'Tallest means the most tall. The tree is taller than the bushes. (Stretch up high!)',
              ),
            ]),
          ],
          'Compared heights using “tall” and “taller”.',
        ),
      ],
    ),
    sc(
      'a06-04-dome',
      [
        N('The white dome is smooth and round. It has no door.'),
        N('Your Nubbin puts an ear to the wall. It goes very still.'),
        N('Tap, tap, tap! Something inside is tapping.'),
        N('The sun goes out. A giant bird lands on the dome.'),
        YS('It is an egg! And that is its mother!', 'shock'),
      ],
      [
        ak(
          4,
          'science',
          'baby birds hatch from eggs',
          'K-LS1-1',
          [N('Tap, tap! Something is inside the egg. What do baby birds do when they are ready?')],
          [
            o(
              'They hatch out.',
              [N('Yes! A baby bird taps its way out of the egg. That is hatching!')],
              true,
            ),
            o('They fly away inside it.', [
              N('Not yet! A baby bird taps with its beak, and the shell cracks. Out it hatches!'),
            ]),
          ],
          'Learned that baby birds hatch out of eggs.',
        ),
      ],
    ),
    sc(
      'a06-04-dome-done',
      [
        N('The giant bird tucks her head under her wing.'),
        N('She snores, zzzzz! The snore lifts your hair.'),
      ],
      [
        nt(
          1,
          'literacy',
          'sound words',
          'RL.2.4',
          [
            N('Zzzzz! Snore is a sound word. Sound words sound like what they mean.'),
            N('Can you snore like the bird? (Make a big snore.)'),
          ],
          'Enjoyed a sound word (zzzzz) and made the sound.',
        ),
      ],
    ),
    sc(
      'a06-04-leg',
      [
        YS('She will fly at sunrise. We must go with her.'),
        N('Sinbad unwinds his turban. It is very long.'),
        N('You tie yourselves to one great toe, gently.'),
        YS('Don’t pull. Don’t tickle. Don’t breathe.'),
        N('At dawn, the bird spreads her wings. Whoosh, up you go!'),
      ],
      [
        nt(
          4,
          'science',
          'birds have wings and feathers',
          'K-LS1-1',
          [
            N(
              'Birds fly with wings and feathers. Their feathers are light, so the wind can lift them.',
            ),
            N('(Flap your arms like wings.)'),
          ],
          'Learned that birds have wings and feathers, and flapped like a bird.',
        ),
      ],
      {
        choices: [
          {
            id: 'look',
            label: 'Look down.',
            then: [N('The island is a coin, then a crumb, then gone.')],
          },
          {
            id: 'shut',
            label: 'Shut your eyes.',
            then: [N('Your Nubbin keeps its eyes open for both of you.')],
          },
        ],
      },
    ),
    sc(
      'a06-04-leg-done',
      [
        N('At noon, the bird lands on a high ridge.'),
        N('You untie the turban. You are shaking, but you did it.'),
      ],
      [
        nt(
          1,
          'sel',
          'being brave when scared',
          SEL,
          [
            N('You felt scared up high. Being brave means doing it while you feel scared.'),
            N('Take a big breath. In... and out. You were brave!'),
          ],
          'Heard that being brave means acting while scared, and tried a calming breath.',
        ),
      ],
    ),
    sc(
      'a06-04-complete',
      [
        N('The big bird flies back up into the sun.'),
        N('A feather floats down. It is as long as you are tall!'),
        N('Your Nubbin catches it, and falls over.'),
        YS('Keep it. Now people will believe you.', 'happy'),
        P('That is not a chicken.'),
      ],
      [
        ak(
          4,
          'maths',
          'compare: longer and shorter',
          'K.MD.A.2',
          [N('The feather is as long as you are tall. Is it longer than your hand, or shorter?')],
          [
            o(
              'Longer.',
              [
                N(
                  'Yes! A feather as long as you is much longer than your hand. (Hold up your hand.)',
                ),
              ],
              true,
            ),
            o('Shorter.', [N('Look again. It is as tall as you! That is longer than a hand.')]),
          ],
          'Compared a long feather with a hand using “longer”.',
        ),
      ],
    ),
  ],
);

// ================================================================== A6-5 The Valley of Diamonds
const A05: EduQuest = quest(
  'a06-05',
  'The Valley of Diamonds',
  {
    'a06-05-s1': {
      goal: 'Walk down into the valley on tiptoe.',
      hint: 'Step on the bare stone between the sleepy snakes.',
    },
    'a06-05-s2': {
      goal: 'Work out where the meat comes from.',
      hint: 'Watch the rim of the valley and the eagles.',
    },
    'a06-05-s3': {
      goal: 'Ride the eagle up out of the valley.',
      hint: 'Hold on to Sinbad’s belt until the top.',
    },
  },
  [
    sc(
      'a06-05-valley',
      [
        N('You look down into a deep, narrow valley. It sparkles like stars.'),
        YS('Diamonds! Look how big they are!', 'shock'),
        N('Long snakes lie in the sun. They are fast asleep.'),
        N('You tiptoe down, between the snakes. Tip, tip, tip.'),
        N('Your Nubbin tiptoes too. It does it very well.'),
      ],
      [
        nt(
          2,
          'science',
          'snakes warm up in the sun',
          'K-LS1-1',
          [
            N('Snakes lie in the sun to warm up. Their bodies do not make much heat.'),
            N('When the sun warms them, they feel good. Just like a cat on a warm wall.'),
          ],
          'Learned that snakes lie in the sun to warm up.',
        ),
      ],
      {
        choices: [
          {
            id: 'breath',
            label: 'Hold your breath past the biggest snake.',
            then: [N('The snake opens one eye. It is not hungry, so it closes it again.')],
          },
          {
            id: 'round',
            label: 'Go the long way round it.',
            then: [N('It takes an hour. Sinbad grumbles in a whisper.')],
          },
        ],
      },
    ),
    sc(
      'a06-05-valley-done',
      [
        N('Something falls out of the sky. Splat, it is a big piece of meat!'),
        N('Everyone stares at it. What is it doing here?'),
      ],
      [
        dn(
          0,
          'literacy',
          'clap the beats in a word',
          'RF.K.2',
          'edu:clap:syllables:eagle',
          [N('Eagles carry the meat up. E-agle. Clap twice: ea-gle! Two claps.')],
          'Clapped the two beats in “eagle”.',
        ),
      ],
    ),
    sc(
      'a06-05-meat',
      [
        N('More meat falls, splat, splat! Diamonds stick to it.'),
        N('Men at the top throw it down. Eagles swoop and carry it up.'),
        YS('If an eagle can lift that, it can lift me!', 'think'),
        N('He ties himself under a big piece of meat.'),
        YS('Take some stones! Quick!', 'happy'),
        N('By your foot is a small, clear stone. It is as small as a lentil.'),
      ],
      [
        nt(
          5,
          'social-studies',
          'we choose how much to take',
          'D2.Eco.1.K-2',
          [
            N('Sinbad wants lots of stones. You can take a little, or take none.'),
            N('Choosing is yours. Both are fine.'),
          ],
          'Heard that we can choose how much to take; either choice is fine.',
        ),
      ],
      {
        choices: [
          {
            id: 'stone',
            label: 'Take one small stone, for the porter.',
            set: { 'a06-stone': 'taken' },
            then: [
              N('You put it in your pocket. It is warm from the sun.'),
              YS('Only one? You are madder than the fish!', 'happy'),
            ],
          },
          {
            id: 'nothing',
            label: 'Take nothing.',
            set: { 'a06-stone': 'left' },
            then: [
              N('You leave it where it lies. It goes on shining.'),
              YS('Nothing? Well, more for me.', 'think'),
            ],
          },
        ],
      },
    ),
    sc(
      'a06-05-meat-done',
      [N('Your Nubbin climbs into Sinbad’s sash.'), N('You hold on to his belt with both hands.')],
      [
        dn(
          1,
          'maths',
          'count to 3',
          'K.CC.B.5',
          'edu:count:friends:3',
          [N('One Sinbad. One you. One Nubbin. How many friends are holding on? Three!')],
          'Counted three friends.',
        ),
      ],
    ),
    sc(
      'a06-05-lift',
      [
        N('An eagle swoops down and lifts the meat. Up you go!'),
        N('The snakes look as small as string.'),
        N('At the top, a merchant bangs two pans. The eagle lets go and flaps away.'),
        ME('A man on my meat! And no diamonds!', 'angry'),
        YS('Peace, friend. Here, take some stones.'),
        N('The merchant stops shouting at once.'),
      ],
      [
        nt(
          3,
          'sel',
          'calming down',
          'CASEL: Self-management',
          [
            N('The merchant was cross, and then he was calm. How? Sinbad spoke gently.'),
            N('A kind voice can help someone calm down. So can a big, slow breath.'),
          ],
          'Heard that a kind voice and slow breaths help us calm down.',
        ),
      ],
    ),
    sc(
      'a06-05-lift-done',
      [
        ME('Twenty years I threw meat. Nobody ever came up on it before!', 'think'),
        N('Sinbad grins. Your Nubbin grins too.'),
      ],
      [
        ak(
          0,
          'literacy',
          'feeling words',
          'RL.1.4',
          [N('The merchant is very surprised. Which word means “very surprised”?')],
          [
            o('Amazed.', [N('Yes! Amazed means very surprised. (Make big round eyes!)')], true),
            o('Sleepy.', [N('Sleepy is for bedtime. Amazed means very surprised.')]),
          ],
          'Matched a feeling word (amazed) to surprise.',
        ),
      ],
    ),
    sc(
      'a06-05-complete',
      [
        N('The carpet is a carpet again.'),
        S('I came home rich. I gave lots to people who needed it.'),
        N('You put the little stone in the porter’s hand.'),
        P('Nobody ever gave me a jewel. I will never sell it.', 'soft'),
        S('Good. A stone you keep is worth more than one you sell.', 'happy'),
      ],
      [
        nt(
          3,
          'sel',
          'a gift from a friend feels special',
          SEL,
          [
            P('A gift does not have to be big. It can be tiny, and still mean so much.'),
            P('It tells someone: I was thinking of you.'),
          ],
          'Heard that a small gift can mean a lot because it shows we thought of someone.',
        ),
      ],
    ),
  ],
);

// ================================================================== A6-6 The Giant’s Island
const A06: EduQuest = quest(
  'a06-06',
  'The Giant’s Island',
  {
    'a06-06-s1': {
      goal: 'Look round the giant’s yard with the sailors.',
      hint: 'Look round the yard. Count everyone.',
    },
    'a06-06-s2': {
      goal: 'Get everyone past the sleepy giant.',
      hint: 'Find something that makes people sneeze.',
    },
    'a06-06-s3': {
      goal: 'Build rafts and sail away.',
      hint: 'Tie driftwood together on the beach.',
    },
  },
  [
    sc(
      'a06-06-castle',
      [
        S('I will tell this story gently, for the little ones.', 'soft'),
        N('There is a storm. Then an island, with a house as big as a hill.'),
        N('In the yard there are cooking pots big enough to bath in.'),
        N('Boom, boom, the ground shakes! A giant ducks in at the gate.'),
        N('He has one big eye. He yawns and looks at his pots.'),
        N('Then he lies down across the gate, and falls fast asleep.'),
      ],
      [
        ak(
          4,
          'maths',
          'compare: bigger and smaller',
          'K.MD.A.2',
          [N('The giant’s pot is as big as a bath. Your cup is little. Which is bigger?')],
          [
            o(
              'The pot.',
              [
                N(
                  'Yes! The giant’s pot is bigger. The cup is smaller. (Make big hands, then small hands.)',
                ),
              ],
              true,
            ),
            o('The cup.', [N('Think of a bath, and then a cup. The pot is much bigger!')]),
          ],
          'Compared big and small using “bigger” and “smaller”.',
        ),
      ],
      {
        choices: [
          {
            id: 'pot',
            label: 'Hide in a cooking pot.',
            then: [N('Your Nubbin is already in it. It is a very good pot.')],
          },
          {
            id: 'count',
            label: 'Count the sailors, to be sure everyone is here.',
            then: [N('All here, and all very quiet. Shh!')],
          },
        ],
      },
    ),
    sc(
      'a06-06-castle-done',
      [YS('He is asleep across the only way out.'), N('Everyone whispers. Shh, shh.')],
      [
        nt(
          1,
          'sel',
          'feeling scared and what helps',
          SEL,
          [
            N('The sailors feel scared. Their hearts go thump, thump.'),
            N('Staying together helps. So do slow breaths. Breathe in... and out.'),
          ],
          'Learned that being scared is a feeling, and that staying together and breathing slowly help.',
        ),
      ],
    ),
    sc(
      'a06-06-gate',
      [
        N('The giant snores. It ruffles the sailors’ beards.'),
        YS('Pepper! The cook has pepper. Giants sneeze like anyone.', 'think'),
        N('Your Nubbin carries the bag to the giant’s nose, very quietly.'),
        N('It tips the bag. The giant breathes in.'),
        N('Atchoo! He sits up and his eye is full of tears.'),
        YS('Now! Everybody out!', 'shock'),
      ],
      [
        nt(
          3,
          'science',
          'a sneeze clears the nose',
          'K-LS1-1',
          [
            N('Pepper tickles the nose. Then, atchoo! A sneeze blows the tickle out.'),
            N('Your body does this by itself. Atchoo! (Do a pretend sneeze.)'),
          ],
          'Learned that a sneeze is the body clearing a tickle from the nose.',
        ),
      ],
      {
        choices: [
          {
            id: 'grab',
            label: 'Grab your Nubbin off the giant’s chin on the way past.',
            then: [N('You catch it. The next sneeze blows you both out of the gate!')],
          },
          {
            id: 'last',
            label: 'Wait and go last, after the sailors.',
            then: [N('Everyone is out. You go last, with pepper in your hair.')],
          },
        ],
      },
    ),
    sc(
      'a06-06-gate-done',
      [
        N('Behind you the giant sneezes, and sneezes, and sneezes.'),
        N('Atchoo, atchoo, atchoo! Not one is aimed at anybody.'),
      ],
      [
        nt(
          1,
          'literacy',
          'repeated sounds make a rhythm',
          'RL.2.4',
          [
            N('Atchoo, atchoo, atchoo! Repeating a sound makes a beat.'),
            N('Clap the beat with me: atchoo, atchoo, atchoo!'),
          ],
          'Enjoyed a repeated sound and clapped its beat.',
        ),
      ],
    ),
    sc(
      'a06-06-raft',
      [
        N('On the beach the sailors tie driftwood together.'),
        YS('Push! Push off!'),
        N('The giant throws rocks. Splash, they land far away!'),
        N('You sail past the reef. The giant is tiny now.'),
        YS('Nobody lost! Not one!', 'happy'),
      ],
      [
        ak(
          4,
          'science',
          'wood floats, stone sinks',
          '2-PS1-1',
          [N('The sailors used driftwood for the raft. Why not stones? Which one floats?')],
          [
            o(
              'Wood floats.',
              [N('Yes! Wood floats on water. Stones sink. That is why rafts are made of wood.')],
              true,
            ),
            o('Stones float.', [
              N(
                'Drop a stone in a pond, and plop! It sinks. Wood floats. That is why rafts are wood.',
              ),
            ]),
          ],
          'Learned that wood floats and stones sink.',
        ),
      ],
    ),
    sc(
      'a06-06-complete',
      [
        P('You sneezed a giant!'),
        S('Not me. Your friend’s little one did. I only ran.', 'happy'),
        P('My daughter will like that one.', 'happy'),
        S('That is how I tell it to children. It is the truest way I know.', 'soft'),
      ],
      [
        nt(
          3,
          'sel',
          'being gentle with little ones',
          'CASEL: Social awareness',
          [
            S('Some things are better told gently to little ones.'),
            S('Being gentle with little ones is a way of caring for them.'),
          ],
          'Heard that we can be gentle with little ones and look after their feelings.',
        ),
      ],
    ),
  ],
);

// ================================================================== A6-7 The Serpent
const A07: EduQuest = quest(
  'a06-07',
  'The Serpent',
  {
    'a06-07-s1': { goal: 'Climb a tall tree before dark.', hint: 'Climb the nearest tall tree.' },
    'a06-07-s2': {
      goal: 'Build a box of planks in the tree.',
      hint: 'Pull up the planks. Tie them round the branches.',
    },
    'a06-07-s3': {
      goal: 'Wave to the ship on the sea.',
      hint: 'Wave something long from the top of the tree.',
    },
  },
  [
    sc(
      'a06-07-island',
      [
        N('The rafts reach a second island. Everyone is very tired.'),
        N('At dusk, a long hiss comes from the grass. Sssss.'),
        N('A huge snake slides out. It is longer than a ship!'),
        YS('Up the trees, all of you!', 'shock'),
        N('You climb. Your Nubbin climbs faster.'),
        N('The snake winds round the tree. It waits.'),
      ],
      [
        nt(
          1,
          'science',
          'dusk: day turns to night',
          '1-ESS1-1',
          [
            N('Dusk is when the sun goes down. The sky gets dim, and then dark.'),
            N('Day turns to night, again and again. It happens every day.'),
          ],
          'Learned that dusk is when day turns to night.',
        ),
      ],
      {
        choices: [
          {
            id: 'higher',
            label: 'Climb higher.',
            then: [N('The branches get thin. The snake cannot quite reach.')],
          },
          {
            id: 'still',
            label: 'Stay where you are, and keep very still.',
            then: [N('The snake’s tongue flicks below your foot. Then it sinks away.')],
          },
        ],
      },
    ),
    sc(
      'a06-07-island-done',
      [
        YS('Snakes can climb. We need a way to be safe.', 'think'),
        N('Everybody looks at the broken raft planks.'),
      ],
      [
        ak(
          1,
          'sel',
          'solving a problem together',
          'CASEL: Responsible decision-making',
          [N('Sinbad has a big problem. What can friends do with a big problem?')],
          [
            o(
              'Think of a plan together.',
              [N('Yes! Friends can think together. Two heads are better than one.')],
              true,
            ),
            o('Give up.', [N('Giving up never fixes it. Friends can think of a plan together.')]),
          ],
          'Thought about solving a problem by planning together with friends.',
        ),
      ],
    ),
    sc(
      'a06-07-box',
      [
        N('Sinbad pulls up planks from the broken rafts.'),
        YS('A box round us. With gaps to breathe.'),
        N('You tie, and he ties. Your Nubbin holds each knot.'),
        N('All night the snake goes round and round.'),
        N('Nobody sleeps. Sinbad whispers about his round city.'),
      ],
      [
        dn(
          4,
          'maths',
          'count the sides of a box',
          'K.CC.B.5',
          'edu:count:planks:4',
          [YS('Four planks make four sides. Count them: one, two, three, four!')],
          'Counted four sides of a plank box.',
        ),
      ],
      {
        choices: [
          {
            id: 'home',
            label: 'Ask what he’ll do when he gets home.',
            then: [YS('Never go to sea again.'), YS('I always say that.', 'soft')],
          },
          {
            id: 'hum',
            label: 'Hum a Grove tune to your Nubbin.',
            then: [N('It helps. Even the snake goes still for a while.')],
          },
        ],
      },
    ),
    sc(
      'a06-07-box-done',
      [
        N('At first light the snake gives up.'),
        N('It pours itself away into the grass.'),
        N('It does not come back.'),
      ],
      [
        nt(
          2,
          'science',
          'the sun rises in the morning',
          '1-ESS1-1',
          [
            N('Morning comes when the sun rises. Light fills the sky.'),
            N('Night turns into day. Dark goes, and light comes back.'),
          ],
          'Learned that the sun rises in the morning and night turns into day.',
        ),
      ],
    ),
    sc(
      'a06-07-sail',
      [
        N('A sail! A sail on the sea!'),
        N('Sinbad waves his long turban. Wave, wave, wave!'),
        CP('Castaways! Up you come, all of you!'),
        CP('We have goods for a man we left on an island. His name was Sinbad.'),
        YS('You did not!', 'happy'),
        N('Sinbad laughs and laughs.'),
      ],
      [
        dn(
          3,
          'literacy',
          'find the letter S',
          LIT,
          'edu:tap:letter:s',
          [N('Ship starts with S. Sinbad starts with S. Sail starts with S too. Sss!')],
          'Found the letter S in ship, sail and Sinbad.',
        ),
      ],
    ),
    sc(
      'a06-07-complete',
      [
        S('Third voyage done. I swore, never again.'),
        P('Never again?'),
        S('Never again.'),
        P('How long did that last?', 'think'),
        S('Long enough to get bored.', 'happy'),
      ],
      [
        dn(
          0,
          'maths',
          'count to 3 on fingers',
          'K.CC.B.4',
          'edu:count:fingers:3',
          [N('Three voyages so far! Hold up a finger for each one: one, two, three.')],
          'Counted three voyages on fingers.',
        ),
      ],
    ),
  ],
);

// ================================================================== A6-8 The Strange Custom
const A08: EduQuest = quest(
  'a06-08',
  'The Strange Custom',
  {
    'a06-08-s1': {
      goal: 'Listen to the fourth story from your cushion.',
      hint: 'Stay by the old man while he tells it.',
    },
    'a06-08-s2': {
      goal: 'In the dark cave, find where fresh air comes from.',
      hint: 'Stand still. Feel the air on your face.',
    },
    'a06-08-s3': {
      goal: 'Follow the little animal to the sea.',
      hint: 'Go where the striped animal goes.',
    },
  },
  [
    sc(
      'a06-08-telling',
      [
        S('I will tell the fourth story from here. It is a sad one.', 'soft'),
        S('I sailed to a kind kingdom. I made saddles for their horses.'),
        S('I married a lovely woman. I loved her very much.', 'happy'),
        S(
          'Then she was ill, and she died. That means her body stopped working. It will not start again.',
          'sad',
        ),
        S('I held her hand at the end. I still remember her with love.', 'soft'),
        S('I was very, very sad. Then a hard rule sent me down into a dark cave.', 'sad'),
        P('All on your own?'),
        S('Yes. I was frightened and sad, both at once.'),
      ],
      [
        ak(
          7,
          'sel',
          'what helps when we are very sad',
          'CASEL: Relationship skills',
          [N('Sinbad was very sad. What helps when someone is very sad?')],
          [
            o(
              'A hug, or a friend sitting close.',
              [N('Yes. A hug helps. So does a friend sitting close. Sad feelings are allowed.')],
              true,
            ),
            o('Pretending to feel fine.', [
              N(
                'Hiding sad feelings can make them heavy. A hug or a friend sitting close helps most.',
              ),
            ]),
          ],
          'Thought about what helps when someone is very sad.',
        ),
      ],
      {
        choices: [
          {
            id: 'hand',
            label: 'Put your hand on his.',
            then: [S('Thank you. It was long ago. It is also tonight.', 'soft')],
          },
          {
            id: 'lap',
            label: 'Let your Nubbin climb into his lap.',
            then: [N('It sits on his knee. He rests a hand on its head, and goes on.')],
          },
        ],
      },
    ),
    sc(
      'a06-08-telling-done',
      [
        S('Come in now, just for the dark part, and the light after it.', 'soft'),
        N('The lamps flicker. The porter holds his breath.'),
      ],
      [
        nt(
          0,
          'literacy',
          'opposites: dark and light',
          LANG,
          [
            N('Dark and light are opposites. Opposites are as different as can be.'),
            N('Dark and light. Big and small. Can you think of another pair?'),
          ],
          'Learned the opposites dark and light, and thought of another pair.',
        ),
      ],
    ),
    sc(
      'a06-08-dark',
      [
        N('The carpet goes black. It is cold and quiet.'),
        YS('Hello. You came. I did not want to ask anyone.', 'sad'),
        N('Sinbad is younger here. His voice is steady, but he is sad.'),
        N('Your Nubbin turns its head to the left.'),
        N('You feel a little air on your face. It smells of salt.'),
      ],
      [
        ak(
          4,
          'science',
          'we feel with our skin',
          'ELOF: Scientific Reasoning',
          [N('You feel air on your face. Which part of you feels the air moving?')],
          [
            o(
              'My skin.',
              [
                N(
                  'Yes! Your skin feels air, and warm, and cold. Air that moves like this is called a breeze.',
                ),
              ],
              true,
            ),
            o('My toes only.', [
              N(
                'Toes feel things, but the air is on your face. Skin all over can feel air moving.',
              ),
            ]),
          ],
          'Learned that skin can feel moving air.',
        ),
      ],
      {
        choices: [
          {
            id: 'follow',
            label: 'Take Sinbad’s hand and follow the draught.',
            then: [N('You walk slowly. He holds on tight.')],
          },
          {
            id: 'listen',
            label: 'Stay still and listen first.',
            then: [N('Far off, something small is scratching. It is alive, and not afraid.')],
          },
        ],
      },
    ),
    sc(
      'a06-08-dark-done',
      [
        N('Something brushes your ankle.'),
        N('It is a little animal with a striped face. It knows where it is going.'),
      ],
      [
        ak(
          1,
          'literacy',
          'describing words',
          'RL.1.4',
          [N('The little animal has a striped face. Which word tells us about its face?')],
          [
            o(
              'Striped.',
              [N('Yes! Striped tells what its face looks like. Stripes, stripes!')],
              true,
            ),
            o('Slowly.', [
              N('“Slowly” tells how it moves. “Striped” tells what its face looks like.'),
            ]),
          ],
          'Picked out a describing word (striped).',
        ),
      ],
    ),
    sc(
      'a06-08-tunnel',
      [
        N('The little animal slips into a crack in the rock.'),
        YS('If it gets in and out, so can we.'),
        N('The crack is tight, so you go sideways. Your Nubbin waits at each bend.'),
        N('You hear the sea. You see grey light.'),
        N('You come out on the shingle at the foot of a cliff.'),
        N('Sinbad sits on the stones and cries. You sit beside him.'),
      ],
      [
        nt(
          5,
          'sel',
          'crying is okay and a friend can sit beside you',
          'CASEL: Self-awareness',
          [
            N('Crying is okay. Crying lets sad feelings out.'),
            N('You did not fix anything. You sat beside him. That helps a lot.'),
          ],
          'Heard that crying is okay and that sitting beside a sad friend helps.',
        ),
      ],
    ),
    sc(
      'a06-08-tunnel-done',
      [N('Some days later a ship sees his fire on the stones.'), N('The sailors take him home.')],
      [
        nt(
          1,
          'social-studies',
          'helpers who look after others',
          'D2.Civ.8.K-2',
          [
            N(
              'The sailors saw a fire and came to help. People who help others are called helpers.',
            ),
            N('Can you think of a helper you know?'),
          ],
          'Heard about people who help others, and thought of a helper they know.',
        ),
      ],
    ),
    sc(
      'a06-08-complete',
      [
        N('The lamps glow in the long room. The porter has stopped eating.'),
        P('I am sorry about your wife.', 'soft'),
        S('Thank you. Nobody has said that for a long time.', 'soft'),
        P('I said a foolish thing on your bench.'),
        S('You said a true thing. It was half the truth. Come back for the other half.'),
      ],
      [
        ak(
          2,
          'sel',
          'what to say to someone who is sad',
          'CASEL: Social awareness',
          [N('The porter said sorry about the wife. What could you say to a sad friend?')],
          [
            o(
              '“I am sorry you feel sad.”',
              [N('Yes. Kind words show you care. A hug can help too, if they want one.')],
              true,
            ),
            o('“Stop being sad.”', [
              N('Sad feelings cannot just stop. Saying “I am sorry you feel sad” helps more.'),
            ]),
          ],
          'Practised a kind thing to say to someone who is sad.',
        ),
      ],
    ),
  ],
);

// ================================================================== A6-9 The Roc’s Revenge
const A09: EduQuest = quest(
  'a06-09',
  'The Roc’s Revenge',
  {
    'a06-09-s1': {
      goal: 'Try to stop the merchants cracking the egg.',
      hint: 'Get to the white dome before the merchants.',
    },
    'a06-09-s2': {
      goal: 'Hold on to a plank in the sea.',
      hint: 'Grab a plank. Keep your Nubbin close.',
    },
  },
  [
    sc(
      'a06-09-egg',
      [
        S('The fifth voyage. I had my own ship by then.'),
        N('There is an island, and a white dome. You know what it is.'),
        YS('Do not touch it. I have met its mother!'),
        N('The merchants laugh. They knock on the shell.'),
        N('Crack! A big, fluffy chick tumbles out and shrieks.'),
        YS('You fools!', 'angry'),
      ],
      [
        ak(
          4,
          'science',
          'parents look after their babies',
          '1-LS1-2',
          [N('The big birds are the chick’s parents. What do bird parents do for their babies?')],
          [
            o(
              'Keep them safe, and feed them.',
              [N('Yes! Bird parents keep their babies safe and feed them. So do many animals.')],
              true,
            ),
            o('Leave them alone.', [
              N('Bird parents stay close. They keep their babies safe and feed them.'),
            ]),
          ],
          'Learned that parents look after their babies.',
        ),
      ],
      {
        choices: [
          {
            id: 'chick',
            label: 'Help the chick into the shade of the rocks.',
            then: [N('It is as soft as a pillow. It lets you push it, grumbling, into the shade.')],
          },
          {
            id: 'between',
            label: 'Stand between the merchants and the chick.',
            then: [N('The merchants back away. One looks at the sky, and goes pale.')],
          },
        ],
      },
    ),
    sc(
      'a06-09-egg-done',
      [N('Two huge shadows cross the island.'), N('One, then two. The parents are home.')],
      [
        dn(
          1,
          'maths',
          'count to 2',
          'K.CC.B.5',
          'edu:count:shadows:2',
          [N('One shadow, two shadows. How many parents? Two!')],
          'Counted two shadows.',
        ),
      ],
    ),
    sc(
      'a06-09-boulders',
      [
        N('Sinbad gets everyone on the ship. It races away.'),
        N('The big birds carry boulders in their claws.'),
        YS('Hard over! Hard over!', 'shock'),
        N('Splash! The boulders crash into the sea.'),
        N('The ship breaks into planks. You hold a plank, and your Nubbin holds you.'),
        N(
          'The big birds fly home to their chick. They were not being cruel. They were looking after their baby.',
        ),
      ],
      [
        nt(
          5,
          'sel',
          'why someone is cross',
          'CASEL: Social awareness',
          [
            N('The big birds were upset because their baby was frightened.'),
            N('When we know why someone is cross, we can understand them better.'),
          ],
          'Heard that people are often cross because they want to protect someone, and understanding that helps.',
        ),
      ],
      {
        choices: [
          { id: 'shout', label: 'Shout for Sinbad.', then: [YS('Here! Over here! Swim to me!')] },
          {
            id: 'float',
            label: 'Float, and save your breath.',
            then: [N('An hour later, Sinbad’s plank bumps into yours. He is very pleased.')],
          },
        ],
      },
    ),
    sc(
      'a06-09-boulders-done',
      [
        N('A current carries you both along.'),
        N('By evening there is an island. It has fruit and running water.'),
      ],
      [
        ak(
          1,
          'science',
          'what living things need',
          'K-LS1-1',
          [N('The island has fruit and fresh water. Why is that good for people?')],
          [
            o(
              'People need food and water.',
              [
                N(
                  'Yes! People, animals and plants all need water. Animals and people need food too.',
                ),
              ],
              true,
            ),
            o('To play with.', [
              N('Fun, but also something more. People need food and water to live.'),
            ]),
          ],
          'Learned that living things need food and water.',
        ),
      ],
    ),
    sc(
      'a06-09-complete',
      [
        N('The porter has brought his little daughter. She is asleep on the cushions.'),
        P('The merchants had it coming.'),
        S('I knew, and I did not make them listen.', 'think'),
        P('You told them.'),
        S('Telling is not the same as making someone listen.'),
      ],
      [
        ak(
          3,
          'literacy',
          'good listening',
          'SL.K.1',
          [N('Listening is hard. What does a good listener do?')],
          [
            o(
              'Looks at you and stays quiet.',
              [N('Yes! Eyes on the speaker, and a quiet mouth. That is good listening.')],
              true,
            ),
            o('Talks over you.', [
              N(
                'That makes it hard to hear! A good listener looks, and keeps quiet until it is their turn.',
              ),
            ]),
          ],
          'Practised what good listening looks like.',
        ),
      ],
    ),
  ],
);

// ================================================================== A6-10 The Old Man of the Sea
const A10: EduQuest = quest(
  'a06-10',
  'The Old Man of the Sea',
  {
    'a06-10-s1': {
      goal: 'Help the little old man across the stream.',
      hint: 'Go to the stream where the old man sits.',
    },
    'a06-10-s2': {
      goal: 'Find a way to make him let go.',
      hint: 'Watch what he reaches for. Look for a low branch.',
    },
    'a06-10-s3': {
      goal: 'Help the sailors pick coconuts.',
      hint: 'Throw pebbles near the monkeys, never at them.',
    },
  },
  [
    sc(
      'a06-10-bank',
      [
        N('By a stream sits a little old man in seaweed.'),
        N('He does not speak. He points across the stream.'),
        YS('He wants to be carried. Up you come, grandfather.', 'soft'),
        N('On the far bank, he does not get down!'),
        N('He drums his heels, and points at a fig tree.'),
      ],
      [
        nt(
          3,
          'sel',
          'asking before you take',
          'CASEL: Relationship skills',
          [
            N('The old man never asked. He just climbed up and would not get down.'),
            N('A good friend asks first: “May I?” And listens for the answer.'),
          ],
          'Heard that asking before taking or climbing on someone is kind.',
        ),
      ],
      {
        choices: [
          {
            id: 'pull',
            label: 'Try to lift him off.',
            then: [N('His legs squeeze tighter. You stop at once.')],
          },
          {
            id: 'ask',
            label: 'Ask him politely to get down.',
            then: [N('He looks at you with bright black eyes. He points at another fig tree.')],
          },
        ],
      },
    ),
    sc(
      'a06-10-bank-done',
      [
        N('Days pass like this.'),
        N('The old man’s legs are long, and limp, and wrinkly.'),
        N('He never gets down.'),
      ],
      [
        ak(
          1,
          'literacy',
          'describing words',
          'RL.1.4',
          [N('The old man has long, limp, wrinkly legs. Which word means the opposite of long?')],
          [
            o('Short.', [N('Yes! Short is the opposite of long. Long legs, short legs!')], true),
            o('Wrinkly.', [N('Wrinkly is about bumpy skin. The opposite of long is short.')]),
          ],
          'Matched the opposite of long (short).',
        ),
      ],
    ),
    sc(
      'a06-10-fig',
      [
        YS('I cannot lie down. He steers me by the ears.', 'sad'),
        N('Your Nubbin watches the old man’s hands. They always reach for fruit.'),
        N('A fig tree has a low branch full of ripe fruit.'),
        N('Your Nubbin points at the branch. Then it bends its knees.'),
        YS('Walk under the branch. Then duck!', 'think'),
      ],
      [
        ak(
          4,
          'maths',
          'under and over',
          'K.G.A.1',
          [N('Sinbad will walk under the branch. Will he go over it, or under it?')],
          [
            o(
              'Under it.',
              [
                N(
                  'Yes! Under means below. He goes under the branch. (Put your hand under your chin.)',
                ),
              ],
              true,
            ),
            o('Over it.', [N('Over means on top. Sinbad ducks, so he goes under the branch!')]),
          ],
          'Used the position word “under”.',
        ),
      ],
      {
        choices: [
          {
            id: 'steer',
            label: 'Lead Sinbad under the low branch.',
            then: [N('The old man reaches up with both arms. His legs loosen.')],
          },
          {
            id: 'tickle',
            label: 'Send your Nubbin to tickle his feet first.',
            then: [N('He squirms. Then he sees the figs, and his legs loosen.')],
          },
        ],
      },
    ),
    sc(
      'a06-10-fig-done',
      [
        YS('Now!'),
        N('Sinbad ducks. The old man hangs from the branch by both hands.'),
        N('His mouth is full of fig. He is quite surprised, and not hurt at all.'),
      ],
      [
        nt(
          2,
          'sel',
          'sulking is a feeling too',
          SEL,
          [
            N('The old man feels cross and sulky. Sulking means feeling cross and going quiet.'),
            N('Nobody was hurt. He just needs time to calm down.'),
          ],
          'Heard that feeling cross and sulky is a feeling and needs time to calm down.',
        ),
      ],
    ),
    sc(
      'a06-10-coconuts',
      [
        N('You run, and run, to the shore.'),
        N('Sailors are picking coconuts. They are amazed that Sinbad got away.'),
        GA('Come with us. Watch how we do it.'),
        N('The palm trees are tall and full of monkeys.'),
        N('The sailors throw pebbles near the monkeys, carefully missing.'),
        N('The monkeys throw coconuts back. Thud, thud!'),
      ],
      [
        ak(
          3,
          'science',
          'animals live where they get what they need',
          'K-ESS3-1',
          [N('The monkeys live up in the palm trees. Why do monkeys like palm trees?')],
          [
            o(
              'They find food and a safe place.',
              [N('Yes! Animals live where they find food and a safe place. Palm trees have both.')],
              true,
            ),
            o('To be near the sea only.', [
              N('The sea is close by. But food and a safe place matter most.'),
            ]),
          ],
          'Learned that animals live where their needs are met.',
        ),
      ],
      {
        choices: [
          {
            id: 'throw',
            label: 'Throw a pebble.',
            then: [N('A coconut comes back and lands in your arms. You win!')],
          },
          {
            id: 'faces',
            label: 'Let your Nubbin pull faces at them instead.',
            then: [N('It rains coconuts!'), GA('We are keeping that one.', 'happy')],
          },
        ],
      },
    ),
    sc(
      'a06-10-complete',
      [
        YS('He was not wicked. He just found a good shoulder.'),
        N('In the long room, the porter rubs his own shoulders.'),
        P('I have carried men like that. I never put them down.'),
        S('You did. You got up from my bench and came in.'),
        P('Hm.', 'soft'),
      ],
      [
        nt(
          4,
          'sel',
          'putting down a worry',
          'CASEL: Self-management',
          [
            N('The porter put down his cross feelings and came in. That felt lighter.'),
            N('When you have a worry, telling a friend helps you put it down.'),
          ],
          'Heard that sharing a worry can make it feel lighter.',
        ),
      ],
    ),
  ],
);

// ================================================================== A6-11 The River of Jewels
const A11: EduQuest = quest(
  'a06-11',
  'The River of Jewels',
  {
    'a06-11-s1': {
      goal: 'Look along the beach for a way out.',
      hint: 'Follow the river along the beach.',
    },
    'a06-11-s2': {
      goal: 'Build a raft from the broken ships.',
      hint: 'Gather planks and rope by the cave.',
    },
    'a06-11-s3': { goal: 'Ride the raft through the mountain.', hint: 'Lie flat and hold on.' },
  },
  [
    sc(
      'a06-11-coast',
      [
        S('The sixth voyage. I was an old fool by then.'),
        P('I was not going to say so.', 'happy'),
        N('A ship is broken on a mountain beach. Wrecks lie all along it.'),
        YS('Everything anyone ever lost is here. None of it is any use.'),
        N('A river runs down the beach. It runs into a cave!'),
        YS('Water goes somewhere. A river always goes somewhere.', 'think'),
      ],
      [
        nt(
          5,
          'science',
          'rivers flow downhill to the sea',
          undefined,
          [
            N('Rivers flow downhill. Most run all the way to the sea.'),
            N('Water always flows down, not up, like a ball rolling down a slope.'),
          ],
          'Learned that rivers flow downhill.',
        ),
      ],
      {
        choices: [
          {
            id: 'mountain',
            label: 'Look up at the mountain road.',
            then: [N('It goes up into cloud, steep and bare. Sinbad looks back at the river.')],
          },
          {
            id: 'river',
            label: 'Put your hand in the river.',
            then: [N('It is cold and quick. It tugs your fingers.')],
          },
        ],
      },
    ),
    sc(
      'a06-11-coast-done',
      [
        YS('A raft, then. If the river goes in, it comes out.'),
        N('Sinbad looks at the planks along the beach.'),
      ],
      [
        ak(
          0,
          'literacy',
          'first, next, last',
          LANG,
          [N('Sinbad has a plan. First he builds a raft. What does he do next?')],
          [
            o(
              'Rides it down the river.',
              [N('Yes! First build, next ride, and last, come out the other side.')],
              true,
            ),
            o('Eats a sandwich.', [
              N('Yum, but not in his plan. First build, next ride the raft down the river.'),
            ]),
          ],
          'Put the steps of a plan in order.',
        ),
      ],
    ),
    sc(
      'a06-11-raft',
      [
        N('You find planks and ropes from the broken ships.'),
        N('The pebbles in the river are jewels! Red and blue and green.'),
        YS('Nobody would believe me!', 'happy'),
        N('Your Nubbin picks up a green one. It puts it back.'),
        YS('You and your friend are no good at being rich.'),
      ],
      [
        dn(
          4,
          'maths',
          'sort by colour',
          'K.MD.B.3',
          'edu:sort:pebbles:colour',
          [N('Put the red pebbles together. Put the blue together. Put the green together.')],
          'Sorted jewel pebbles by colour.',
        ),
      ],
      {
        choices: [
          {
            id: 'help',
            label: 'Help him tie the sack to the raft.',
            then: [YS('If we sink, at least we sink impressively!', 'happy')],
          },
          {
            id: 'tease',
            label: 'Ask if he’s ever been good at it.',
            then: [YS('I am good at getting rich. Being rich is different.', 'think')],
          },
        ],
      },
    ),
    sc(
      'a06-11-dark',
      [
        N('The cave swallows the raft. It gets dark.'),
        N('You lie flat. Your Nubbin lies flat on top of you.'),
        YS('Keep your head down. Think of something nice.'),
        N('The rock glitters a little, like tiny stars.'),
        N('Sinbad falls asleep, and so do you.'),
      ],
      [
        nt(
          2,
          'sel',
          'thinking of something nice calms us',
          'CASEL: Self-management',
          [
            N(
              'When we feel nervous, we can think of something nice. A pond. A cosy bed. A friend.',
            ),
            N('What is your something nice? (Wait for an answer.)'),
          ],
          'Practised calming down by thinking of something nice.',
        ),
      ],
      {
        choices: [
          {
            id: 'grove',
            label: 'Think of the Grove.',
            then: [N('You think of the pond and the fruit trees. It helps.')],
          },
          {
            id: 'porter',
            label: 'Think of the porter, waiting on his cushion.',
            then: [N('You can almost hear him: “I will mind the dates.”')],
          },
        ],
      },
    ),
    sc(
      'a06-11-complete',
      [
        N('You wake to sunshine. The raft is tied to a bank by green fields.'),
        P('Where did it come out?'),
        S('Serendib. A great island, far from here.'),
        P('You cannot stop there!', 'angry'),
        S('I am old. I can stop where I like.', 'happy'),
      ],
      [
        ak(
          2,
          'social-studies',
          'an island is land with water all around',
          'D2.Geo.2.K-2',
          [N('Serendib is an island. What is an island?')],
          [
            o(
              'Land with water all round.',
              [
                N(
                  'Yes! An island is land with water all around it. (Draw a little island with your finger.)',
                ),
              ],
              true,
            ),
            o('Water with land all round.', [
              N('That is a lake! An island is land with water all around it.'),
            ]),
          ],
          'Learned what an island is.',
        ),
      ],
    ),
  ],
);

// ================================================================== A6-12 Serendib
const A12: EduQuest = quest(
  'a06-12',
  'Serendib',
  {
    'a06-12-s1': {
      goal: 'Walk with the farmer to see the king.',
      hint: 'Walk through the fields to the palace.',
    },
    'a06-12-s2': {
      goal: 'Tell the king about Baghdad.',
      hint: 'Sit with Sinbad in front of the king.',
    },
    'a06-12-s3': {
      goal: 'Climb the great mountain to see the sunrise.',
      hint: 'Join the people on the steps at night.',
    },
  },
  [
    sc(
      'a06-12-bank',
      [
        FA('You came out of the mountain! Nobody does that.', 'shock'),
        YS('I did not mean to. I come from Baghdad.'),
        FA('Come with me. Our king will want to hear this.', 'happy'),
        N('Green rice fields step down the hills. Water shines in each one.'),
        N('The trees smell of cinnamon when you rub them.'),
        N('Your Nubbin rubs every tree. It arrives smelling like a pudding.'),
      ],
      [
        nt(
          3,
          'science',
          'rice plants need water and light',
          '2-LS2-1',
          [
            FA(
              'Rice plants love water. Their roots stand in it, and their leaves reach for the sun.',
            ),
            FA('Plants need water and light to grow big and green.'),
          ],
          'Learned that plants need water and light, like rice in its watery fields.',
        ),
      ],
      {
        choices: [
          {
            id: 'cinnamon',
            label: 'Ask the farmer about the trees.',
            then: [FA('Cinnamon! It comes from tree bark. We sell it far away.', 'happy')],
          },
          {
            id: 'rice',
            label: 'Ask about the water in the terraces.',
            then: [FA('It flows from field to field. Each farmer passes it on to the next.')],
          },
        ],
      },
    ),
    sc(
      'a06-12-bank-done',
      [
        N('The palace is cool and open. Birds fly in and out.'),
        N('The king is waiting. He is as curious as a boy.'),
      ],
      [
        nt(
          1,
          'social-studies',
          'kings and leaders listen',
          'D2.Civ.8.K-2',
          [
            N('A good leader listens. The king wants to hear about other places.'),
            N('Listening to other people helps us learn.'),
          ],
          'Heard that good leaders listen to others.',
        ),
      ],
    ),
    sc(
      'a06-12-court',
      [
        KS('Welcome! Sit. You came through the mountain?'),
        YS('I did, your majesty. Not on purpose.'),
        KS('Tell me about your Caliph. Is he fair?', 'think'),
        YS('They say he walks the city to see how people live.'),
        KS('A king who looks for himself. Good! I will write to him.', 'happy'),
        KS('You will carry my letter. You will be my messenger.'),
      ],
      [
        ak(
          5,
          'sel',
          'greeting someone politely',
          'CASEL: Relationship skills',
          [N('Sinbad is meeting a king. How can we greet someone new in a polite way?')],
          [
            o(
              'Say hello, and smile.',
              [N('Yes! Hello and a smile make people feel welcome. (Wave and smile.)')],
              true,
            ),
            o('Look away and say nothing.', [
              N('That could make them feel left out. A hello and a smile feel friendly.'),
            ]),
          ],
          'Practised greeting someone new politely.',
        ),
      ],
      {
        choices: [
          {
            id: 'honour',
            label: 'Nudge Sinbad to accept.',
            then: [
              YS('It would be an honour, your majesty.'),
              N('Then he whispers to you, “What have I done?”'),
            ],
          },
          {
            id: 'nubbin',
            label: 'Let your Nubbin bow to the king.',
            then: [N('It bows so low it rolls over. The king laughs out loud!')],
          },
        ],
      },
    ),
    sc(
      'a06-12-peak',
      [
        N('Before the ship sails, Sinbad climbs the great mountain.'),
        N('Many people climb it, all night, to see the sun rise.'),
        FA('People come for different reasons. Everyone climbs the same steps.', 'soft'),
        N('The sun comes up, red, over the sea.'),
        N('Everyone goes quiet. Your Nubbin sits very still on your foot.'),
      ],
      [
        nt(
          3,
          'social-studies',
          'respect for other people’s beliefs',
          'D2.Civ.8.K-2',
          [
            N('People believe different things, and that is okay. They can climb side by side.'),
            N('Being kind to people who are different from us is called respect.'),
          ],
          'Heard that people believe different things and that respecting each other is kind.',
        ),
      ],
    ),
    sc(
      'a06-12-complete',
      [
        N('The king gives Sinbad a letter, and gifts, and a ship home.'),
        P('A king who writes to another king, because a sailor washed up.'),
        S('That is how many friendships between countries begin.'),
        P('Did you swear again?', 'happy'),
        S('I did. That one nearly took.', 'happy'),
      ],
      [
        nt(
          2,
          'sel',
          'friendships can start in surprising ways',
          'CASEL: Relationship skills',
          [
            N('A sailor washed up, and two kings became friends.'),
            N('Friendships can start in surprising ways. How did you meet a friend?'),
          ],
          'Heard that friendships can start in surprising ways, and remembered meeting a friend.',
        ),
      ],
    ),
  ],
);

// ================================================================== A6-13 The Caliph’s Gift
const A13: EduQuest = quest(
  'a06-13',
  'The Caliph’s Gift',
  {
    'a06-13-s1': {
      goal: 'Take the king’s letter to the Caliph.',
      hint: 'Go into the palace and wait to be called.',
    },
    'a06-13-s2': {
      goal: 'Sail with the wind to give the Caliph’s letter to the king.',
      hint: 'Board the ship at Basra when the wind turns.',
    },
  },
  [
    sc(
      'a06-13-palace',
      [
        N('Sinbad comes home to the round city. He goes straight to the palace.'),
        N('The court is full of scholars and busy clerks.'),
        CA('Peace be upon you. You are the man who came out of a mountain?'),
        YS('And upon you, peace. Through a mountain, yes.'),
        CA('The King of Serendib has written to me. Please read it.', 'think'),
        TR('He has heard that you are fair. He sends a ruby cup, and asks to be your friend.'),
        TR('It is in Arabic, and very good Arabic. Somebody there reads our books.'),
        CA('Then he shall have more books, and an answer. Sinbad, you will carry it.', 'happy'),
      ],
      [
        ak(
          6,
          'literacy',
          'people speak and write in different languages',
          LANG,
          [
            N(
              'The translator helps people read a letter in a different language. What does a translator do?',
            ),
          ],
          [
            o(
              'Changes words from one language to another.',
              [N('Yes! A translator turns words into another language, so people can understand.')],
              true,
            ),
            o('Cooks the dinner.', [
              N('Not that! A translator turns words into another language so people understand.'),
            ]),
          ],
          'Learned that a translator helps people understand another language.',
        ),
      ],
      {
        choices: [
          {
            id: 'translator',
            label: 'Ask the translator which languages they read at the House of Wisdom.',
            then: [
              TR(
                'Greek, Persian, and many more. If a book exists, someone here wants to read it.',
                'happy',
              ),
            ],
          },
          {
            id: 'cup',
            label: 'Let your Nubbin look into the ruby cup.',
            then: [
              N('It sees its own face, small and red. It is delighted.'),
              CA('The gift has found its true admirer.', 'happy'),
            ],
          },
        ],
      },
    ),
    sc(
      'a06-13-palace-done',
      [
        N('The Caliph sends books, and fine cloth, and a silver saddle.'),
        N('Sinbad looks at the saddle. He says nothing.'),
      ],
      [
        dn(
          0,
          'maths',
          'count to 3',
          'K.CC.B.5',
          'edu:count:gifts:3',
          [N('Books, cloth, and a saddle. Touch each gift and count: one, two, three!')],
          'Counted three gifts.',
        ),
      ],
    ),
    sc(
      'a06-13-monsoon',
      [
        N('At Basra, ships crowd the quay. They are all waiting for the wind.'),
        CP('For half the year the wind blows one way. For half the year it blows the other way.'),
        CP('We sail out on one wind. We sail home on the other.'),
        N('In the night the wind turns. In the morning every sail fills at once.'),
        N('Weeks of blue. Then green hills, and a king on the shore.'),
        KS('Books! He sent me books!', 'happy'),
      ],
      [
        nt(
          3,
          'science',
          'wind changes direction through the year',
          'K-ESS2-1',
          [
            CP('Wind is moving air. It blows one way for months, and then it turns.'),
            CP('Sailors learn the winds, like you learn your own street.'),
          ],
          'Learned that the wind can blow one way for months and then turn.',
        ),
      ],
    ),
    sc(
      'a06-13-monsoon-done',
      [
        KS('Go home safely, messenger. Tell your Caliph I am reading.'),
        N('The king hugs his new books. He waves as the ship sails off.'),
      ],
      [
        nt(
          0,
          'literacy',
          'books and reading are for sharing',
          LIT,
          [
            N(
              'Books can be shared across the sea. Someone far away reads the same words that you can read.',
            ),
            N('Books connect people. What is your favourite book?'),
          ],
          'Heard that books can be shared and connect people.',
        ),
      ],
    ),
    sc(
      'a06-13-complete',
      [
        N('On the way home, pirates take the ship. They carry everyone far away.'),
        N('In a far town, Sinbad has to work for a rich merchant. He is not allowed to leave.'),
        P('After all that? After the letter?', 'shock'),
        S('After all that. The sea never asked if I deserved it.', 'soft'),
        S('Come back for the next part. Sinbad is brave. And there is a kind choice in it.'),
      ],
      [
        nt(
          4,
          'sel',
          'it is okay to feel worried; Sinbad stays brave',
          'CASEL: Self-awareness',
          [
            N('That is a hard bit. Feeling worried about it is okay.'),
            N(
              'Sinbad is still brave. And the story is kind to him. A grown-up can give you a hug.',
            ),
          ],
          'Heard that feeling worried about a hard part of a story is okay, with reassurance.',
        ),
      ],
    ),
  ],
);

// ================================================================== A6-14 The Elephant Hunter
const A14: EduQuest = quest(
  'a06-14',
  'The Elephant Hunter',
  {
    'a06-14-s1': {
      goal: 'Sit in the tree by the elephants’ path.',
      hint: 'Climb up beside Sinbad before dawn.',
    },
    'a06-14-s2': {
      goal: 'Go where the elephants take you.',
      hint: 'Hold on to Sinbad. Let the elephants lead.',
    },
    'a06-14-s3': {
      goal: 'The master is at his gate. Decide what to tell him.',
      hint: 'Talk to the master at the gate.',
    },
  },
  [
    sc(
      'a06-14-tree',
      [
        MA(
          'You talk to kings? Good. Sit in the tree. When the elephants pass, shoot. I need ivory.',
        ),
        N('Every morning, you sit in the tree with Sinbad.'),
        N('The herd walks past. An old elephant leads them.'),
        N('Every morning, Sinbad’s arrows land far away in the mud.'),
        YS('I am the worst archer in the world. On purpose. Do not tell him.'),
      ],
      [
        dn(
          2,
          'maths',
          'count the calves',
          'K.CC.B.5',
          'edu:count:calves:4',
          [
            N(
              'Look at the little ones walking under their mothers. Count the calves: one, two, three, four!',
            ),
          ],
          'Counted four elephant calves.',
        ),
      ],
      {
        choices: [
          {
            id: 'promise',
            label: 'Promise not to tell.',
            then: [YS('Thank you. He is not a bad man. He just has a warehouse.', 'soft')],
          },
          {
            id: 'calves',
            label: 'Count the calves in the herd.',
            then: [N('Four calves walk under their mothers. One looks up at you.')],
          },
        ],
      },
    ),
    sc(
      'a06-14-tree-done',
      [
        N('Weeks go by, with mud and missed arrows.'),
        N('The master grumbles, and buys more arrows.'),
      ],
      [
        nt(
          0,
          'sel',
          'kindness to animals',
          'CASEL: Social awareness',
          [
            YS(
              'I will not hurt the elephants. They have done nothing wrong. They are somebody’s mums and babies.',
            ),
            N('Being gentle to animals is kind.'),
          ],
          'Heard that being gentle with animals is a way of being kind.',
        ),
      ],
    ),
    sc(
      'a06-14-herd',
      [
        N('One morning the herd stops by the tree. It is quiet.'),
        N('The old elephant pulls the tree over, slowly and gently.'),
        N('Sinbad falls. She catches him in her trunk, and sets him on her back.'),
        N('You climb up too. Your Nubbin comes too.'),
        N('They walk all day to a valley with a white floor. It is full of old tusks and bones.'),
        N('The old elephant sets you down, safe. The herd turns and goes.'),
      ],
      [
        ak(
          5,
          'science',
          'elephants live in families led by an old female',
          '1-LS1-2',
          [N('The herd followed the oldest elephant. Who leads an elephant family?')],
          [
            o(
              'The oldest mother elephant.',
              [
                N(
                  'Yes! An elephant herd is a family. The oldest female leads, and she remembers the way.',
                ),
              ],
              true,
            ),
            o('The smallest calf.', [
              N(
                'Calves follow their mothers. The oldest female leads, because she remembers the way.',
              ),
            ]),
          ],
          'Learned that elephants live in families led by the oldest female.',
        ),
      ],
    ),
    sc(
      'a06-14-herd-done',
      [
        YS('Go to the town ahead. I twisted my ankle.'),
        YS('You decide what he is told. I have done enough deciding for elephants.'),
      ],
      [
        ak(
          0,
          'health',
          'what helps a hurt ankle',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('Sinbad has a sore ankle. What helps a sore ankle get better?')],
          [
            o(
              'Rest it, and ask a grown-up for help.',
              [N('Yes! Rest, a cool cloth and a grown-up’s help make a sore ankle feel better.')],
              true,
            ),
            o('Run and jump on it.', [
              N('Ouch! That would hurt more. A sore ankle needs rest, and a grown-up’s help.'),
            ]),
          ],
          'Learned that a hurt body part needs rest and a grown-up’s help.',
        ),
      ],
    ),
    sc(
      'a06-14-gate',
      [
        N('The master meets you at his gate. He looks worried.'),
        MA('The tree is down. Where is Sinbad?', 'shock'),
        N('Far behind you, the herd walks home in a long grey line.'),
        N('Your Nubbin looks at the herd, then at you. It waits.'),
      ],
      [
        nt(
          3,
          'sel',
          'both choices come from caring',
          'CASEL: Responsible decision-making',
          [
            N(
              'You can tell, and ask for a promise. Or you can keep the elephants’ secret. Both come from caring.',
            ),
            N('Which feels right to you?'),
          ],
          'Thought about a choice where both options come from caring.',
        ),
      ],
      {
        choices: [
          {
            id: 'tell',
            label: 'Tell him, once he swears to take only the old tusks and never hunt again.',
            set: { 'a06-ivory': 'told' },
            then: [
              Y('There is a valley. Before I show you, you must promise.'),
              MA('I promise. On my children.', 'soft'),
            ],
          },
          {
            id: 'keep',
            label: 'Keep the elephants’ secret.',
            set: { 'a06-ivory': 'kept' },
            then: [
              Y('I do not know where he went.'),
              MA('He will come back. Where else would he go?', 'think'),
            ],
          },
        ],
      },
    ),
    sc(
      'a06-14-gate-done',
      [
        N('That evening Sinbad limps through the gate.'),
        N('He looks at you and the master. He understands, without a word.'),
      ],
      [
        ak(
          1,
          'literacy',
          'we can tell feelings without words',
          'RL.1.4',
          [N('Sinbad understood without words. How can we tell how people feel?')],
          [
            o(
              'Look at their faces and bodies.',
              [N('Yes! Faces, eyes and bodies show feelings, even when no one speaks.')],
              true,
            ),
            o('We can never tell.', [
              N('We can often tell! Faces, eyes and bodies show feelings.'),
            ]),
          ],
          'Learned that faces and bodies show feelings.',
        ),
      ],
    ),
    sc(
      'a06-14-complete',
      [
        N(
          'The master takes his carts to the white valley. He loads old tusks that were left behind.',
        ),
        N('On the road, the herd passes. The master bows his head to them.'),
        MA('You are free, Sinbad. Go home.'),
        YS('The elephants paid for my freedom. I want to remember that.', 'soft'),
        MA('Nobody in this town will hunt them again. I have promised.'),
      ],
      [
        nt(
          4,
          'science',
          'we look after wild animals',
          'K-ESS3-3',
          [
            N('Elephants are wild animals. People can look after them by leaving them in peace.'),
            N('Many places make rules to keep elephants safe. That is called protecting them.'),
          ],
          'Learned that people can protect wild animals such as elephants.',
        ),
      ],
    ),
  ],
);

// ================================================================== A6-15 Home
const A15: EduQuest = quest(
  'a06-15',
  'Home',
  {
    'a06-15-s1': {
      goal: 'Come home to Baghdad with Sinbad.',
      hint: 'Walk with Sinbad from the quay to the city.',
    },
    'a06-15-s2': {
      goal: 'Walk the porter home to his street.',
      hint: 'Leave the great house with the porter and his daughter.',
    },
  },
  [
    sc(
      'a06-15-quay',
      [
        N('The ship comes into Basra early. It sits low in the water.'),
        YS('Home! Rich, early, and safe. That never happened before!', 'happy'),
        N('He walks in through the city gate. You are beside him.'),
        YS('Seven voyages! And I promise you now: there is no eighth.'),
        N('For once, he keeps his promise.'),
      ],
      [
        ak(
          3,
          'sel',
          'what a promise is',
          'CASEL: Responsible decision-making',
          [N('Sinbad makes a promise. What is a promise?')],
          [
            o(
              'Saying you will do something, and doing it.',
              [
                N(
                  'Yes! A promise is saying you will, and then doing it. Keeping a promise is trustworthy.',
                ),
              ],
              true,
            ),
            o('Saying something and forgetting.', [
              N('A promise is something you really do. It helps people trust you.'),
            ]),
          ],
          'Learned what a promise is.',
        ),
      ],
      {
        choices: [
          {
            id: 'believe',
            label: 'Say you believe him this time.',
            then: [YS('So do I. That is new.', 'happy')],
          },
          {
            id: 'doubt',
            label: 'Ask how long it will last.',
            then: [
              YS('Ha! Fair.', 'happy'),
              YS('This time, for good. I have run out of things to be bored of.', 'soft'),
            ],
          },
        ],
      },
    ),
    sc(
      'a06-15-street',
      [
        N('The carpet is a carpet again. The old man smiles at his hands.'),
        S('I came home heavy that time. Porter, does your street have a fountain?'),
        P('There is a well at the far end. The women walk there all morning.', 'think'),
        S('Then it has a fountain now.'),
        N('Next morning, workmen are on his street with stone.'),
        D('Baba! They are building water! Right here!', 'happy'),
      ],
      [
        nt(
          4,
          'social-studies',
          'a fountain shares water with everyone',
          'D2.Civ.8.K-2',
          [
            N('A fountain gives water to everybody in the street, big or small.'),
            N('Sharing things with everyone is fair.'),
          ],
          'Heard that a public fountain shares water fairly with everyone.',
        ),
      ],
      {
        choices: [
          {
            id: 'why',
            label: 'Ask the old man why.',
            then: [S('Because a man complained on my bench, and he was right.')],
          },
          {
            id: 'cup',
            label: 'Promise the daughter you’ll come back for the first drink.',
            then: [D('You have to! I will save you the first cup!', 'happy')],
          },
        ],
      },
    ),
    sc(
      'a06-15-complete',
      [
        N('Back in the long room, the old man opens a chest.'),
        S('I have something for you and your little one.'),
        N('It is a folded sail. It has a patch you have seen before.'),
        S('From my first ship. Hang it where you can see the wind.', 'soft'),
        P('Then give me one more evening. Next time, you will hear mine.'),
        S('Yours?', 'happy'),
      ],
      [
        ak(
          3,
          'science',
          'wind pushes sails',
          'K-ESS2-1',
          [N('A sail catches the wind. What pushes a sailing ship?')],
          [
            o(
              'The wind.',
              [N('Yes! Wind pushes the sail, and the sail pushes the ship. Whooosh!')],
              true,
            ),
            o('The sail by itself.', [
              N('A sail needs the wind to push it. Without wind, a ship sits still.'),
            ]),
          ],
          'Learned that wind pushes a sail.',
        ),
      ],
    ),
  ],
);

// ================================================================== A6-16 The Porter’s Voyage
const A16: EduQuest = quest(
  'a06-16',
  'The Porter’s Voyage',
  {
    'a06-16-s1': {
      goal: 'Listen to the porter tell his own story.',
      hint: 'Sit in the long room with the household.',
    },
    'a06-16-s2': {
      goal: 'Bring the storyteller’s cushion home.',
      hint: 'Step back through the page. Put the cushion where your Nubbins can sit.',
    },
    'a06-16-s3': {
      goal: 'Tell your own story to the Grove.',
      hint: 'Sit on the storyteller’s cushion.',
    },
  },
  [
    sc(
      'a06-16-telling',
      [
        N('It is the last evening. Everyone is in the long room.'),
        P('I have never told a story. I have only carried a few.'),
        N('He puts something on the low table. It is a small, clear stone.'),
        P('This is the first line of my story. A friend brought it from a valley.'),
        P('I will never sell it.'),
        P('I am a porter. I carry paper, and I cannot read, so I listen.'),
      ],
      [
        nt(
          5,
          'literacy',
          'a story has a beginning',
          'RL.K.3',
          [
            N('Every story starts somewhere. The porter began with the stone.'),
            N('A story has a beginning, a middle, and an end.'),
          ],
          'Heard that a story has a beginning, a middle, and an end.',
        ),
      ],
    ),
    sc(
      'a06-16-telling-done',
      [
        P('And at the end, a herd walked home through the hills.'),
        P('Nobody shot at them. Nobody ever will.'),
        P('The elephants were paid for in bones.', 'soft'),
        N('Nobody speaks. Then the old man claps, and everyone claps.'),
      ],
      [
        nt(
          3,
          'sel',
          'sharing a story is brave',
          'CASEL: Self-awareness',
          [
            N(
              'The porter felt nervous. It takes courage to share a story. Clapping says, “well done!”',
            ),
            N('(Clap like the crowd. Clap, clap, clap!)'),
          ],
          'Heard that sharing a story takes courage and that clapping shows kindness.',
        ),
      ],
    ),
    sc(
      'a06-16-grove',
      [
        S('Take this cushion. I told from it, all seven nights.'),
        N('It is round and faded. A tiny ship is sewn on it.'),
        P('Now he wants to listen, and he starts with me.', 'happy'),
        N('You step back through the page. The Grove’s evening is all round you.'),
        N('Your Nubbin drags the cushion over the lawn.'),
      ],
      [
        ak(
          4,
          'science',
          'shade is cooler than sunshine',
          'K-PS3-1',
          [
            N(
              'Under the fruit trees it is shady. Is the shade cooler or warmer than the sunny grass?',
            ),
          ],
          [
            o('Cooler.', [N('Yes! The leaves block the sun, so the shade stays cool.')], true),
            o('Warmer.', [
              N('The sun warms the grass it shines on. The leaves block it, so shade is cooler.'),
            ]),
          ],
          'Learned that sunshine warms the ground and shade stays cooler.',
        ),
      ],
      {
        choices: [
          {
            id: 'pond',
            label: 'Set it down by the pond.',
            then: [N('Where the water can listen too. Your Nubbin sits on it at once.')],
          },
          {
            id: 'trees',
            label: 'Set it down under the fruit trees.',
            then: [N('In the shade. Your Nubbin sits on it at once.')],
          },
        ],
      },
    ),
    sc(
      'a06-16-grove-done',
      [
        N('One by one, your Nubbins come over the grass.'),
        N('They sit in a ring round the cushion.'),
      ],
      [
        dn(
          1,
          'maths',
          'count the Nubbins in the ring',
          'K.CC.B.5',
          'edu:count:nubbins:ring',
          [N('Touch each Nubbin as you count them. How many are in the ring?')],
          'Counted the Nubbins in the ring, touching each one.',
        ),
      ],
    ),
    sc(
      'a06-16-tell',
      [
        N('You sit on the cushion. All the little faces look up.'),
        N('Nova sits down at the back of the ring.'),
        N('You have never told a story either.'),
        N('Your Nubbin sits on your foot, to help.'),
        N('You take a breath. Then you begin.'),
      ],
      [
        nt(
          4,
          'literacy',
          'talking and listening in turns',
          'SL.K.1',
          [
            N('When one person tells, the others listen. Then it is someone else’s turn.'),
            N('Talking and listening in turns is how stories are shared.'),
          ],
          'Heard that stories are shared by talking and listening in turns.',
        ),
      ],
      {
        choices: [
          {
            id: 'whale',
            label: 'Begin with the island that was a whale.',
            then: [
              Y('Once there was an island that was fast asleep...'),
              N('Your Nubbin rolls onto its back, being the whale.'),
            ],
          },
          {
            id: 'porter',
            label: 'Begin with the porter on the bench.',
            then: [Y('Once there was a man who carried every book in Baghdad...')],
          },
          {
            id: 'elephants',
            label: 'Begin with the elephants.',
            then: [
              Y('Once there was a herd of elephants who wanted to be left alone...'),
              N('Every Nubbin goes very still.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a06-16-complete',
      [
        N('It takes you all evening. Your Nubbin acts every part, especially the big bird.'),
        NV('A woman in Persia told stories to a king. One story each night.', 'soft'),
        NV('She told them until he learned to be kind.'),
        NV('Persian, then Arabic, then French, then English. And now you, on a cushion.'),
        NV('Stories travel like sailors. They come home a little changed.', 'happy'),
      ],
      [
        ak(
          4,
          'social-studies',
          'stories travel from person to person',
          'D2.His.2.K-2',
          [N('Stories travel from place to place. How does a story travel?')],
          [
            o(
              'People tell it to each other.',
              [N('Yes! People tell stories to each other, and then those people tell them again.')],
              true,
            ),
            o('The story walks by itself.', [
              N('Stories do not walk! People carry them, by telling them.'),
            ]),
          ],
          'Learned that stories travel because people tell them to each other.',
        ),
      ],
    ),
  ],
);

// ================================================================== variant scenes
export const EDU_A06_SPROUT_VARIANTS: EduScene[] = [
  // plays once after a06-01-complete (or when the page opens) if s24Done is set
  sc(
    'a06-margin-hazel',
    [
      N('Beside the round city, there is a pencil note. You know the hand.'),
      N(
        '“Seven trips, and he still came home to tell it to a friend. Somebody must stay and listen, and I will. H.”',
      ),
      N('Underneath is a tiny whale, with a tree on its back.'),
    ],
    [
      nt(
        2,
        'literacy',
        'a margin note is writing beside the main words',
        LIT,
        [
          N('Hazel wrote a little note in the margin. The margin is the empty edge of a page.'),
          N('Notes tell a reader, “I was here.”'),
        ],
        'Learned that a note can be written in the margin of a page.',
      ),
    ],
  ),
  // a06-stone = left: replaces a06-05-complete
  sc(
    'a06-05-complete-left',
    [
      N('The carpet is a carpet again.'),
      S('I came home rich. I gave lots to people who needed it.'),
      N('Your pockets are empty. The porter sees you check.'),
      P('Nothing? In a valley of diamonds?'),
      P('That is wise, or silly. I will think about it tonight.', 'think'),
    ],
    [
      nt(
        4,
        'social-studies',
        'choosing to take nothing is a choice too',
        'D2.Eco.1.K-2',
        [
          S('You cannot spend what you left behind. Taking less is a choice too.'),
          S('Everyone chooses for themselves. That is fair.'),
        ],
        'Heard that choosing to take nothing is a choice, and that people choose for themselves.',
      ),
    ],
  ),
  // a06-ivory = kept: replaces a06-14-complete
  sc(
    'a06-14-complete-kept',
    [
      N('Sinbad stays a season longer. A dry season, then the rains.'),
      N(
        'Three times the herd walks past the master’s gate. They harm nothing, not even his garden.',
      ),
      MA('They could flatten my house, and they walk round my beans.', 'think'),
      MA('No more arrows. No more hunting. Not by me.', 'soft'),
      MA('You are free, Sinbad. I am sorry I have nothing to give you.', 'sad'),
      YS('You are giving me home. That is plenty.', 'soft'),
    ],
    [
      nt(
        4,
        'sel',
        'seeing kindness can change our minds',
        'CASEL: Social awareness',
        [
          N('The master watched the gentle herd. It changed his mind.'),
          N('Seeing someone be kind can help us change our minds. That is very brave.'),
        ],
        'Heard that noticing kindness can change our minds.',
      ),
    ],
  ),
  // a06-ivory = kept: replaces a06-15-quay
  sc(
    'a06-15-quay-kept',
    [
      N('Sinbad comes home late, with a staff and a borrowed cloak.'),
      N('He walks the river road from Basra. It takes eleven days.'),
      YS('Home! Poor, late, and safe. That still counts.'),
      YS('Seven voyages! And I promise: there is no eighth.'),
      N('For once, he keeps his promise.'),
    ],
    [
      nt(
        2,
        'literacy',
        'feeling words: content',
        'RL.1.4',
        [
          N('Sinbad is poor, but he is content. Content means calm and happy with what you have.'),
          N('Being home with friends can feel like enough.'),
        ],
        'Learned the feeling word “content”.',
      ),
    ],
    {
      choices: [
        {
          id: 'believe',
          label: 'Say you believe him this time.',
          then: [YS('So do I. That is new.', 'happy')],
        },
        {
          id: 'doubt',
          label: 'Ask how long it will last.',
          then: [
            YS('Ha! Fair.', 'happy'),
            YS('This time, for good. I have nothing left to go to sea for.', 'soft'),
          ],
        },
      ],
    },
  ),
  // a06-ivory = kept: replaces a06-15-street
  sc(
    'a06-15-street-kept',
    [
      N('The carpet is a carpet again. The old man smiles.'),
      S('I came home with nothing that time. It is the voyage I am proudest of.'),
      P('Nothing? Then tonight you eat at mine.', 'soft'),
      N('The porter’s home is one clean room. His daughter gives the old man the only cushion.'),
      D('Baba says you were poor once too. Is that true?'),
      S('Once, for a season. It was a very good season.', 'soft'),
    ],
    [
      nt(
        3,
        'sel',
        'sharing a meal with someone',
        'CASEL: Relationship skills',
        [
          N('The porter shared what he had. Sharing a meal is a way to say, “you matter to me.”'),
          N('Who do you like to share a meal with?'),
        ],
        'Heard that sharing a meal shows someone they matter.',
      ),
    ],
    {
      choices: [
        {
          id: 'eat',
          label: 'Eat the lentils with them.',
          then: [
            S('I have eaten at the Caliph’s table. These are better. Do not tell him.', 'happy'),
          ],
        },
        {
          id: 'nubbin',
          label: 'Let your Nubbin sit with the daughter.',
          then: [
            N('She feeds it lentils, one at a time.'),
            N('She tells it the whale story, all wrong, and very proudly.'),
          ],
        },
      ],
    },
  ),
  // a06-stone = left: replaces a06-16-telling
  sc(
    'a06-16-telling-nothing',
    [
      N('It is the last evening. Everyone is in the long room.'),
      P('I have never told a story. I have only carried a few.'),
      N('He puts nothing on the low table. He smiles at the empty place.'),
      P('I had nothing, so I listened.'),
      P('A friend brought me nothing from a valley of diamonds. I decided it was a present.'),
      P('I am a porter. I carry paper, and I cannot read, so I listen.'),
    ],
    [
      nt(
        4,
        'literacy',
        'listening is a way of learning',
        LIT,
        [
          N(
            'The porter learns by listening. Listening is a way of learning, even when you cannot read.',
          ),
          N('Your ears help you learn!'),
        ],
        'Heard that listening is a way of learning.',
      ),
    ],
  ),
  // a06-ivory = kept: replaces a06-16-telling-done
  sc(
    'a06-16-telling-done-kept',
    [
      P('And at the end, a herd walked past a gate three times.'),
      P('Nobody shot at them. Nobody ever will.'),
      P('The elephants were paid for in a season.', 'soft'),
      N('Nobody speaks. Then the old man claps, and everyone claps.'),
    ],
    [
      ak(
        2,
        'sel',
        'waiting is hard, and things help',
        'CASEL: Self-management',
        [
          N('Sinbad waited a whole dry season, and then the rains. That is a long wait!'),
          N('What helps when you have to wait a long time?'),
        ],
        [
          o(
            'Doing something nice while you wait.',
            [N('Yes! Singing, drawing or helping a friend makes waiting feel shorter.')],
            true,
          ),
          o('Shouting “Is it time yet?”', [
            N('Waiting is hard, and that is okay. Doing something nice helps the time go by.'),
          ]),
        ],
        'Thought about what helps when we have to wait a long time.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A06_SPROUT: EduQuest[] = [
  A01,
  A02,
  A03,
  A04,
  A05,
  A06,
  A07,
  A08,
  A09,
  A10,
  A11,
  A12,
  A13,
  A14,
  A15,
  A16,
];

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  'edu:count:paper-rolls:5',
  'edu:count:fingers:3',
  'edu:count:firewood:4',
  'edu:tap:colour:blue',
  'edu:clap:syllables:eagle',
  'edu:count:friends:3',
  'edu:count:planks:4',
  'edu:tap:letter:s',
  'edu:count:shadows:2',
  'edu:sort:pebbles:colour',
  'edu:count:gifts:3',
  'edu:count:calves:4',
  'edu:count:nubbins:ring',
];
