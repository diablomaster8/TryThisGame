/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Atlas page A13, The Wooden
 * Boy (Collodi’s Pinocchio, Tuscany).
 *
 * Source: atlas-a13.ts (ATLAS_A13 and A13_VARIANTS). One EduScene per original scene, id
 * `sprout:<original id>`, with the same choice ids and `set` flags. Every step scene, done scene,
 * complete scene and variant has a version, and each has exactly one lesson.
 *
 * What it teaches (outline: geography, history, science, maths, language, feelings, culture):
 * where Italy and Tuscany are, that *pinocchio* is a pine nut, a few Italian words (babbo,
 * grazie, ciao), the old masks Harlequin and Punchinello, that wood comes from trees, has rings
 * and floats, and that a fib grows (honesty, gently, no shaming).
 *
 * Left out or softened for this age (EDU-STYLE.md, “Hard things”):
 * - No quotes from the book or its translation. The original lines were already told in our own
 *   words, and these are new again.
 * - The Talking-cricket is knocked off the wall and is plainly alive on both routes. The doctors’
 *   “dead or alive” joke becomes “very ill or very sleepy”.
 * - A13-9: the Big Oak is “tied by his jacket”, like a coat on a peg, and he is rescued at once.
 * - A13-15: the stone says she “went away, missing him”. The boat is hidden by a big wave far
 *   away and Pinocchio swims out to help. No sinking close up.
 * - A13-18: the drum man only lowers the donkey into the sea on a rope; no talk of a hide.
 * - A13-20: Candlewick the donkey dies, said plainly with what it means, and the comfort follows
 *   in the next scene (the flower-and-remembering way the Grove does it).
 * - Choices are all kept with their ids and flags (`a13-cricket`, `a13-crust`), reworded to be
 *   kind; none is a cruel one, so no `defaultChoice` is needed.
 * - Clank stays a he; “love” is said gently as “the word”, and the grown-up is invited to talk
 *   about it.
 * - Facts used: Italy is a country in Europe shaped like a boot; Tuscany is in the middle and the
 *   sea is on its west; pinocchio means pine nut; babbo is Tuscan for dad; the Italian flag is
 *   green, white and red; wood floats; a chick grows in an egg; a pear tree grows from a seed;
 *   a coat holds in body warmth; owls and bats are awake at night; pigeons can carry messages
 *   home; a donkey is a farm animal with long ears; snails glide on one foot.
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
const CK = say('clank');
const P = say('a13-pin');
const G = say('a13-geppetto');
const MC = say('a13-cherry');
const LG = say('a13-log');
const CR = say('a13-cricket');
const CB = say('a13-carabineer');
const CH = say('a13-chick');
const NC = say('a13-nightcap');
const HQ = say('a13-harlequin');
const PU = say('a13-punch');
const FE = say('a13-fireeater');
const FX = say('a13-fox');
const CT = say('a13-cat');
const IK = say('a13-innkeeper');
const ST = say('a13-sack-tall');
const SS = say('a13-sack-short');
const FY = say('a13-fairy');
const MD = say('a13-medoro');
const CW = say('a13-crow');
const OW = say('a13-owl');
const RB = say('a13-rabbit');
const PR = say('a13-parrot');
const JG = say('a13-judge');
const FM = say('a13-farmer');
const MT = say('a13-marten');
const PG = say('a13-pigeon');
const CO = say('a13-coalman');
const WO = say('a13-woman');
const SB = say('a13-schoolboy');
const EU = say('a13-eugene');
const AL = say('a13-alidoro');
const GF = say('a13-fisher');
const CW2 = say('a13-candlewick');
const LM = say('a13-littleman');
const MA = say('a13-marmot');
const BU = say('a13-buyer');
const TU = say('a13-tunny');
const SN = say('a13-snail');
const GI = say('a13-giangio');
const PX = say('pixel');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const words = (t: string) => t.trim().split(/\s+/).length;

/**
 * Keeps every line to 14 words or fewer, as the sprout band requires: a long line is cut at
 * sentence ends into several lines by the same speaker (the mood stays on the first). `map[i]`
 * is the index of the last piece of original line i, so a lesson’s `after` can follow.
 */
const split = (lines: Line[]): { lines: Line[]; map: number[] } => {
  const out: Line[] = [];
  const map: number[] = [];
  for (const l of lines) {
    const sentences = l.text.split(/(?<=[.!?”)])\s+(?=[A-Z“(])/);
    const chunks: string[] = [];
    for (const sentence of sentences) {
      const last = chunks[chunks.length - 1];
      if (last !== undefined && words(last) + words(sentence) <= 14)
        chunks[chunks.length - 1] = `${last} ${sentence}`;
      else chunks.push(sentence);
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

/** An ask lesson. */
const ask = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | undefined,
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

/** A notice lesson: a character shares one true thing. */
const notice = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | undefined,
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

/** A do lesson: the child does something in the Grove. */
const doit = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | undefined,
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

/** One sprout scene. Lesson ids are `sprout:<of>-l<n>`, numbered in play order. */
const sc = (
  of: string,
  lines: Line[],
  beats: Beat[],
  extra: { choices?: Choice[]; defaultChoice?: string } = {},
): EduScene => {
  const cut = split(lines);
  const choices = extra.choices?.map((c) => (c.then ? { ...c, then: sp(c.then) } : c));
  return {
    id: `sprout:${of}`,
    of,
    band: 'sprout',
    lines: cut.lines,
    ...(choices ? { choices } : {}),
    ...(extra.defaultChoice ? { defaultChoice: extra.defaultChoice } : {}),
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

// ---------------------------------------------------------------- shared pieces
const PAGE: Line[] = [
  N('Nova’s atlas opens. The page is all brown ink.'),
  N('A hill town. A long white road. The sea at the bottom.'),
  N('This story begins with a piece of wood. Just wood!'),
];
const LOG: Line[] = [
  N('Master Cherry has a nose like a ripe red cherry.'),
  MC('I will make a table leg from this old log.'),
  N('He lifts his axe.'),
  LG('Ow! Not so hard!'),
];
const COAT: Line[] = [
  N('Geppetto comes home in the snow. He has a new spelling-book.'),
  P('Babbo, where is your coat?'),
  G('I sold it. I was too warm.', 'happy'),
  N('Pinocchio hugs him tight. He understands.'),
];
const LEAVE: Line[] = [N('The doctors pick up their bags. The cricket goes last, slowly.')];
const SEA: Line[] = [
  N('Little fish nibble and nibble. Nibble, nibble! The donkey coat is all gone.'),
  N('Up from the sea comes a wooden puppet, wriggling like an eel!'),
  BU('Where is my donkey?', 'shock'),
  P('The fish ate my donkey coat! Nibble, nibble! I am a puppet again!', 'happy'),
  N('Pinocchio swims away, laughing.'),
];
const THANKS: Line[] = [
  N('On the sand, Pinocchio helps his babbo sit down.'),
  P('Thank you, Tunny. I want a bigger word than thank you.', 'soft'),
  N('He cannot find one. So he kisses the Tunny on the nose.'),
];
const CANDLE: Line[] = [N('Your Nubbin keeps the green bottle. It will not give it up.')];
const HUT: Line[] = [
  CR('Oh, my Pinocchio.'),
  P('Oh, my dear little Cricket!', 'happy'),
  CR('A goat gave me this hut. A blue goat.'),
  P('Blue... like the Fairy’s hair!'),
  P('I am sorry about the mallet. Please forgive me.', 'sad'),
  CR('I forgive you. I only wanted to remind you.', 'soft'),
  CR('Be kind to everyone you can. Then someone may be kind to you.'),
];
const WAKE: Line[] = [
  N('Pinocchio jumps out of bed. He is not wood. He is a boy!'),
  N('Geppetto is well again. He is carving a frame and whistling.'),
  P('Babbo! Look at me!', 'happy'),
  G('I am looking. I have always been looking.', 'soft'),
  N('The old wooden puppet leans on a chair. It is only wood now.'),
  P('Look at it! All knees and nose!', 'happy'),
  N('Your Nubbin taps the wooden nose. Nothing happens. Your Nubbin is relieved.'),
  P('I am glad that is over. I am so glad I am me.', 'happy'),
];
const HOME: Line[] = [
  G('Take my old bench. The little Nubbin on it is lovely as it is.', 'soft'),
  N('The page closes softly. You are back in the Grove, with sawdust in your hair.'),
];
const WORD_A: Line[] = [
  CK('Did they love this one? The wooden one?', 'think'),
  Y('Yes. He sold his coat for him.'),
  G('Before he did a single thing.', 'soft'),
  CK('If I am not helpful, will you still love me?', 'soft'),
  G('Yes. Always. Even when you knock things over.'),
  N('Clank knocks something over, to check.'),
  N('Your Nubbin climbs up on his hood. Geppetto puts down his chisel.'),
  CK('Love. That is the word.', 'soft'),
];
const WORD_B: Line[] = [
  CK('Nobody puts it in. Somebody does it to you first.'),
  N('Clank is still a kettle on one wheel. And that is just right.'),
];

const LOVE_LESSON: Beat = ask(
  7,
  'sel',
  'what love can feel like: being looked after and looked at',
  'CASEL: Social awareness',
  [N('Who has shown love to you today?'), N('(Let your child think and answer.)')],
  [
    o('Someone who cooks for me.', [N('Yes! Feeding someone is a kind of love.')], true),
    o('Someone who gives me a cuddle.', [N('Yes! A cuddle is love too.')], true),
    o('I do not know yet.', [
      N('That is fine. Love is often small and quiet. Look out for it today.'),
    ]),
  ],
  'Talked about the people who show love to us, and the small ways they do it.',
);

// ================================================================== A13-1 The Piece of Wood
const A1: EduQuest = quest(
  'a13-01',
  'The Piece of Wood',
  {
    'a13-01-s1': {
      goal: 'Step into the brown-ink page, and out of the rain.',
      hint: 'Touch the page. Find the open door with sawdust on its step.',
    },
    'a13-01-s2': {
      goal: 'Stay in Master Cherry’s shop. Keep your Nubbin out from under their feet.',
      hint: 'Stand by the bench. Two old men are about to argue.',
    },
  },
  [
    sc(
      'a13-01-page',
      [
        ...PAGE,
        N('The ink turns to rain. Splash! You and your Nubbin get wet.'),
        N('One door is open. It smells of warm pine. In you go.'),
        MC('Come in! Shut the weather out. Mind the shavings.'),
        ...LOG,
      ],
      [
        notice(
          1,
          'social-studies',
          'Italy is a country shaped like a boot; Tuscany is in the middle',
          'D2.Geo.2.K-2',
          [
            N('This page is in Italy. Italy is a country shaped like a boot.'),
            N('(Trace a boot in the air.) The hill town is in Tuscany, in the middle.'),
          ],
          'Met Italy, a country shaped like a boot, and Tuscany, the part in the middle.',
        ),
      ],
    ),
    sc(
      'a13-01-page-done',
      [
        N('Master Cherry looks under the bench. He looks up the chimney.'),
        MC('Did you say that? Nobody said that!', 'shock'),
        MC('I imagined it. It was only the weather.'),
      ],
      [
        notice(
          2,
          'science',
          'wood comes from trees, and a tree grows a ring each year',
          'ELOF: Scientific Reasoning',
          [
            N('Wood comes from trees. This log was once part of a tree.'),
            N('Each year a tree grows one new ring inside. More rings means an older tree.'),
          ],
          'Heard that wood comes from trees, and that each year a tree grows one ring.',
        ),
      ],
    ),
    sc(
      'a13-01-plane',
      [
        N('Master Cherry gives the log a whack.'),
        LG('Ow! That hurt!'),
        N('He sits down on the floor. Then he tries his plane.'),
        LG('Stop it! You are tickling!'),
        N('In comes a little old man in a bright yellow wig.'),
        G('Good morning, Master Antonio. I want to carve a puppet.'),
        LG('Good idea, Polendina!'),
        N('Geppetto goes red. He thinks Master Cherry said it!'),
      ],
      [
        ask(
          3,
          'literacy',
          'first sounds: log starts with the sound l',
          'RF.K.2',
          [
            N('The log says “Ow!” The word log starts with the sound l, l, l.'),
            N('Which word starts the same? Lamp, or hat?'),
          ],
          [
            o('Lamp', [N('Yes! L, l, lamp. L, l, log.')], true),
            o('Hat', [N('Hat starts with h, h, h. Lamp starts with l, l, l, just like log.')]),
          ],
          'Listened for the first sound of a word (l for log and lamp).',
        ),
      ],
      {
        choices: [
          {
            id: 'log',
            label: 'Tell Geppetto it was the log.',
            then: [G('A log said that? Now I have heard everything.', 'angry')],
          },
          {
            id: 'out',
            label: 'Keep out of it. It is their argument.',
            then: [N('You keep out of it. Not for long!')],
          },
        ],
      },
    ),
    sc(
      'a13-01-plane-done',
      [
        N('The two old men shout and tug. They swap wigs by mistake!'),
        N('Then they swap back and shake hands.'),
        N('Master Cherry gives Geppetto the log. It bounces on his toe.'),
        N('Then it is peace, and the rain has stopped.'),
      ],
      [
        ask(
          3,
          'sel',
          'making up after a quarrel',
          'ELOF: Social and Emotional Development',
          [N('The two old men were cross. How did they make friends again?')],
          [
            o(
              'They shook hands.',
              [N('Yes. Shaking hands, or a hug, or sorry, can mend a quarrel.')],
              true,
            ),
            o('They shouted more.', [
              N('More shouting makes it worse. They stopped, and shook hands. That helped.'),
            ]),
          ],
          'Talked about how to make up after a quarrel.',
        ),
      ],
    ),
    sc(
      'a13-01-complete',
      [
        G('You have no roof tonight, traveller. Come with me.'),
        N('His room is under the stairs. It has one chair, one bed and one table.'),
        N('There is a fire in the wall. It is only a painting!'),
        G('It keeps me warm if I do not think about it.', 'happy'),
        N('He hangs his felt cap on a nail. Your Nubbin hops in.'),
        G('Ha. It may stay. It is the warmest thing in the house.', 'happy'),
      ],
      [
        doit(
          2,
          'maths',
          'count three things in a room',
          'K.CC.B.5',
          'edu:count:room-things:3',
          [
            N('Count with Geppetto: one chair, one bed, one table.'),
            N('How many things is that? (Count on your fingers.)'),
          ],
          'Counted three things in a room.',
        ),
      ],
    ),
  ],
);

// ================================================================== A13-2 Geppetto Carves a Puppet
const A2: EduQuest = quest(
  'a13-02',
  'Geppetto Carves a Puppet',
  {
    'a13-02-s1': {
      goal: 'Hold the lamp while Geppetto carves.',
      hint: 'Stand at his elbow. Watch the nose.',
    },
    'a13-02-s2': {
      goal: 'Help Geppetto teach the puppet to walk.',
      hint: 'Hold one wooden hand. Mind the door.',
    },
  },
  [
    sc(
      'a13-02-carve',
      [
        N('Geppetto rolls up his sleeves. He looks at the log.'),
        G('I shall call him Pinocchio.'),
        N('Geppetto smiles. It is a good name for a pine puppet.'),
        N('He carves the hair, then the eyes. The eyes look back!'),
        G('Wooden eyes, why are you looking at me?', 'shock'),
        N('He carves the nose. It grows. And grows!'),
        N('He carves the mouth. It sticks out its tongue.'),
      ],
      [
        notice(
          2,
          'literacy',
          'pinocchio means pine nut in Italian',
          'L.2.4',
          [
            G('Pinocchio is a real Italian word. It means a pine nut.'),
            G(
              'Pine nuts are tiny seeds. They hide in pine cones. And this puppet is made of pine!',
            ),
          ],
          'Learned that pinocchio is the Italian word for a pine nut.',
        ),
      ],
      {
        choices: [
          {
            id: 'nose',
            label: 'Point out that the nose is growing.',
            then: [G('I know. I have decided not to notice.', 'think')],
          },
          {
            id: 'quiet',
            label: 'Keep the lamp steady and say nothing.',
            then: [N('You hold the lamp still. Geppetto works faster.')],
          },
        ],
      },
    ),
    sc(
      'a13-02-carve-done',
      [
        N('Geppetto carves the hands. They grab his yellow wig!'),
        G('Pinocchio! Give that back!'),
        N('Pinocchio gives it back. His eyes are laughing.'),
      ],
      [
        ask(
          2,
          'sel',
          'naming a feeling: Geppetto is cross but also fond',
          'CASEL: Self-awareness',
          [N('Geppetto shouts. But is he really very angry?')],
          [
            o(
              'A little cross, and a little fond.',
              [N('Yes! Sometimes we feel two things at once.')],
              true,
            ),
            o('Only very angry.', [
              N('He is cross. But look, he is smiling a bit. Two feelings together!'),
            ]),
          ],
          'Noticed that people can feel two feelings at once.',
        ),
      ],
    ),
    sc(
      'a13-02-legs',
      [
        N('Geppetto carves the legs and feet.'),
        N('The first thing the feet do is kick his nose. Bonk!'),
        N('You hold one wooden hand. Geppetto holds the other.'),
        N('One step. Two steps. Then Pinocchio is running!'),
        P('I have LEGS!', 'happy'),
        N('Clack, clack, clack! Out of the door and down the street.'),
        G('Catch him! Catch him!'),
      ],
      [
        ask(
          5,
          'maths',
          'clapping beats and counting steps',
          'K.CC.B.4',
          [N('Clack, clack, clack! That is three clacks. Can you clap three?')],
          [
            o('Clap, clap, clap!', [N('Yes! One, two, three. Three clacks!')], true),
            o('Clap, clap.', [N('Let us try again. Clack, clack, clack. One, two, three.')]),
          ],
          'Counted three steps by clapping.',
        ),
      ],
    ),
    sc(
      'a13-02-street',
      [
        N('At the bottom of the street, a carabineer catches him by the nose.'),
        N('Geppetto arrives, out of breath.'),
        N('Pinocchio lies down on the stones and will not walk.'),
        N('The crowd thinks the old man is being unkind to the puppet.'),
        CB('You, old man. You can come with me.'),
      ],
      [
        notice(
          4,
          'literacy',
          'babbo is the Tuscan word for dad',
          'L.2.4',
          [
            N('Geppetto is Pinocchio’s babbo.'),
            N('In Tuscany, children say babbo for dad. Say it with me: bab-bo.'),
          ],
          'Learned the Italian word babbo, for dad.',
        ),
      ],
    ),
    sc(
      'a13-02-complete',
      [
        N('So it is Geppetto who is led away. He is sad.'),
        G('I worked so hard. I should have thought.', 'sad'),
        N('Your Nubbin hops out of the cap. The street is empty.'),
        N('Pinocchio runs home across the fields, fast as a hare.'),
        N('The room under the stairs is very quiet.'),
      ],
      [
        ask(
          4,
          'sel',
          'what helps when a room feels empty and quiet',
          'CASEL: Self-management',
          [N('The room feels lonely. What helps when you feel lonely?')],
          [
            o(
              'Cuddle a friend or a toy.',
              [N('Yes. A cuddle helps. So does telling someone.')],
              true,
            ),
            o('Telling a grown-up.', [N('Yes. Telling someone you trust helps too.')], true),
          ],
          'Thought about what helps when we feel lonely.',
        ),
      ],
    ),
  ],
);

// ================================================================== A13-3 The Talking-cricket
const A3: EduQuest = quest(
  'a13-03',
  'The Talking-cricket',
  {
    'a13-03-s1': {
      goal: 'Find what is going cri-cri-cri in the dark.',
      hint: 'Listen along the wall by the hearth.',
    },
    'a13-03-s2': {
      goal: 'Listen to the Talking-cricket. Then see what happened at the hearth.',
      hint: 'Hear him out. Then go and look.',
    },
  },
  [
    sc(
      'a13-03-cri',
      [
        N('Pinocchio shuts the door and sighs. A whole room, all his!'),
        P('Mine. The chair, the table, the painted fire.', 'happy'),
        N('Then, a small sound. Cri, cri, cri.'),
        P('Who is that?', 'shock'),
        N('Your Nubbin’s ears go straight up.'),
      ],
      [
        doit(
          3,
          'literacy',
          'sound words: cri, cri, cri',
          'RF.K.2',
          'edu:say:sound-word:cri',
          [
            N('A cricket goes cri, cri, cri. Can you make the sound?'),
            N('What sound does a dog make? A duck?'),
          ],
          'Made animal and sound words, like cri, cri, cri.',
        ),
      ],
    ),
    sc(
      'a13-03-cri-done',
      [
        N('On the wall climbs a big cricket. He looks very grand.'),
        CR('I am the Talking-cricket. I have lived here a hundred years.'),
      ],
      [
        ask(
          1,
          'science',
          'where a cricket lives and what it does',
          'K-ESS3-1',
          [N('Crickets chirp by rubbing their wings. Where do real crickets live?')],
          [
            o(
              'In grass, and in cosy cracks.',
              [N('Yes! They hide in grass, under stones and in warm cracks.')],
              true,
            ),
            o('In the sea.', [
              N('Not the sea. Crickets live on land, in grass and in cosy cracks.'),
            ]),
          ],
          'Learned that crickets live in grass and cracks and chirp with their wings.',
        ),
      ],
    ),
    sc(
      'a13-03-cricket',
      [
        CR('Listen, Pinocchio. Be kind to your babbo. Go to school.'),
        P('I would rather chase butterflies.'),
        CR('Then you will be sorry.', 'sad'),
        N('Pinocchio picks up a mallet and throws it. He is not really aiming.'),
        N('Thump! The cricket tumbles off the wall, into the ash.'),
        P('Oh! I did not mean to!', 'shock'),
        N('(The cricket is only dazed. He is a very tough old cricket.)'),
      ],
      [
        ask(
          6,
          'sel',
          'what to do after hurting someone by accident: check they are all right',
          'CASEL: Responsible decision-making',
          [N('The mallet bumped the cricket. What should Pinocchio do now?')],
          [
            o(
              'Go and check he is all right.',
              [N('Yes. When we hurt someone, we go and see if they are all right.')],
              true,
            ),
            o('Pretend nothing happened.', [
              N('Pretending does not help. Going to check, and saying sorry, does.'),
            ]),
          ],
          'Practised what to do after an accident that hurts someone: check, and say sorry.',
        ),
      ],
      {
        choices: [
          {
            id: 'search',
            label: 'Look in the hearth for the cricket.',
            set: { 'a13-cricket': 'carried' },
            then: [
              N('You look in the ash. Your Nubbin finds him! Squeak!'),
              CR('I am not hurt. I am cross. Cross, not hurt.', 'angry'),
              N('You carry him to the hedge on a leaf. He is safe.'),
              CR('Thank you, kind friend.'),
            ],
          },
          {
            id: 'leave',
            label: 'Wait. Give the cricket a little time.',
            set: { 'a13-cricket': 'left' },
            then: [
              N('You wait. Later you see a tiny track in the ash.'),
              N('It goes to the crack under the door. The cricket walked away, grumbling.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a13-03-cricket-done',
      [N('The room is quiet. Pinocchio rests his chin on his fists.'), P('Anyway. I am hungry.')],
      [
        ask(
          1,
          'sel',
          'naming a feeling: hungry, and also a little sorry',
          'ELOF: Social and Emotional Development',
          [N('Pinocchio’s tummy is rumbling. But is he feeling something else too?')],
          [
            o('A little sorry.', [N('Yes. He is sorry, and he cannot say it yet.')], true),
            o('Only hungry.', [N('He is hungry. But his quiet face looks a little sorry too.')]),
          ],
          'Noticed a feeling that is hiding behind another one.',
        ),
      ],
    ),
    sc(
      'a13-03-complete',
      [
        N('Night comes. Pinocchio’s tummy rumbles like a small dog.'),
        P('Is there any supper? Somewhere?'),
        N('Your Nubbin curls up against your boot.'),
        N('Outside, the wind is getting up.'),
      ],
      [
        notice(
          2,
          'science',
          'day and night: it gets dark at night',
          '1-ESS1-1',
          [
            N('Night comes when our side of the Earth turns away from the Sun.'),
            N('The Sun is still there. We just cannot see it.'),
          ],
          'Heard that night comes as our side of the Earth turns away from the Sun.',
        ),
      ],
    ),
  ],
);

// ================================================================== A13-4 The Flying Egg
const A4: EduQuest = quest(
  'a13-04',
  'The Flying Egg',
  {
    'a13-04-s1': {
      goal: 'Help Pinocchio look for something to eat.',
      hint: 'Try the cupboard, the drawers and the heap in the corner.',
    },
    'a13-04-s2': { goal: 'Watch Pinocchio cook his egg.', hint: 'Stand back from the pan.' },
    'a13-04-s3': {
      goal: 'Go with Pinocchio into the storm, to the village.',
      hint: 'Keep your Nubbin under your coat.',
    },
  },
  [
    sc(
      'a13-04-hungry',
      [
        N('Pinocchio runs to the pot on the fire. His nose goes right through!'),
        P('Painted. Even the soup is painted.', 'sad'),
        N('He tries the drawers. A button. A cork. A bent nail.'),
        N('Your Nubbin digs in the heap in the corner.'),
      ],
      [
        doit(
          3,
          'maths',
          'sort things into groups: things you can eat and things you cannot',
          'K.MD.B.3',
          'edu:sort:drawer-things:edible',
          [
            N('Button, cork, nail. Can you eat any of them? No!'),
            N('Sort them: how many things can we eat? None!'),
          ],
          'Sorted objects into things we can eat and things we cannot.',
        ),
      ],
      {
        choices: [
          {
            id: 'dig',
            label: 'Dig with your Nubbin.',
            then: [N('You dig too. It is not grand, but it is company.')],
          },
          {
            id: 'cheer',
            label: 'Tell Pinocchio there is sure to be something.',
            then: [P('There had better be. I am empty all the way through.', 'sad')],
          },
        ],
      },
    ),
    sc(
      'a13-04-hungry-done',
      [
        N('In the heap is something round and white. An egg!'),
        P('An egg! I will fry it!', 'happy'),
      ],
      [
        ask(
          1,
          'science',
          'eggs come from hens, and a chick grows inside',
          '1-LS1-2',
          [N('Who laid the egg? A hen! And what might grow inside a hen’s egg?')],
          [
            o(
              'A chick!',
              [N('Yes! A chick grows inside, with its mother hen keeping it warm.')],
              true,
            ),
            o('A fish.', [N('Fish eggs are in the water. A hen’s egg can grow a chick.')]),
          ],
          'Learned that a chick can grow inside a hen’s egg.',
        ),
      ],
    ),
    sc(
      'a13-04-egg',
      [
        N('He puts a pan on the brazier. The water steams.'),
        N('He cracks the egg. Out pops a fluffy chick!'),
        CH('Thank you for opening my house! Good evening! Give my love to your family!', 'happy'),
        N('Pinocchio holds the empty shell. His mouth is wide open. Your Nubbin opens its mouth too.'),
        N('The chick flies out of the window and away.'),
        P('Oh. The cricket was right. I wish I had not run off.', 'sad'),
      ],
      [
        ask(
          5,
          'sel',
          'saying what you wish you had done differently',
          'CASEL: Self-awareness',
          [N('Pinocchio wishes he had stayed home. What could he do now?')],
          [
            o(
              'Say sorry, and try again.',
              [N('Yes. Saying sorry and trying again is brave.')],
              true,
            ),
            o('Hide under the bed.', [
              N('Hiding feels safe for a bit. But sorry and trying again help more.'),
            ]),
          ],
          'Talked about saying sorry and starting again.',
        ),
      ],
    ),
    sc(
      'a13-04-egg-done',
      [
        N('Outside, the wind is a storm. Pinocchio puts his cap on.'),
        P('There is a village. Someone will give me bread. I will ask nicely.'),
      ],
      [
        notice(
          1,
          'literacy',
          'a polite way to ask: please and thank you',
          'ELOF: Language and Communication',
          [
            N('Pinocchio says he will ask nicely. Nice words are please and thank you.'),
            N('Say them with me: please. Thank you.'),
          ],
          'Practised polite words for asking: please and thank you.',
        ),
      ],
    ),
    sc(
      'a13-04-storm',
      [
        N('The night is black. Thunder rumbles over the hills.'),
        N('Every window in the village is shut tight.'),
        N('Pinocchio pulls a doorbell, again and again.'),
        NC('What do you want at this hour?', 'angry'),
        P('A bit of bread, please.'),
        NC('Wait there.'),
        N('Splash! He tips a basin of water over Pinocchio’s head.'),
      ],
      [
        doit(
          2,
          'science',
          'weather words: thunder, lightning, wind, rain',
          'K-ESS2-1',
          'edu:name:weather:storm',
          [
            N('Point to what you can hear in a storm.'),
            N('Rumble, rumble: thunder! Whoosh: wind! Pitter-patter: rain!'),
          ],
          'Named weather words and sounds in a storm.',
        ),
      ],
    ),
    sc(
      'a13-04-storm-done',
      [
        N('You walk home together, dripping.'),
        N('Your Nubbin is dry under your coat.'),
        N('Pinocchio puts his wet feet on the brazier. He falls asleep.'),
      ],
      [
        ask(
          2,
          'science',
          'a hot fire dries wet things and can burn wood',
          'K-PS3-1',
          [
            N(
              'Pinocchio’s feet are wet. What dries them faster, something warm or something cold?',
            ),
          ],
          [
            o(
              'Something warm.',
              [N('Yes. Warmth dries things. But wood must not get too close to a fire!')],
              true,
            ),
            o('Something cold.', [
              N(
                'Cold is slow. Warm air dries things faster. A fire is very warm, so we keep wood far from it.',
              ),
            ]),
          ],
          'Learned that warmth dries wet things, and that wood must stay away from a fire.',
        ),
      ],
    ),
    sc(
      'a13-04-complete',
      [
        N('In the morning someone knocks.'),
        G('Pinocchio! It is me. Open the door.'),
        P('Babbo!', 'happy'),
        N('He jumps up, and falls on his face.'),
        N('His feet burned away in the night. He did not feel a thing, because he is wood.'),
        N('(He is fine. Geppetto will make him new ones.)'),
      ],
      [
        ask(
          3,
          'sel',
          'being kind to someone who made a mistake',
          'CASEL: Relationship skills',
          [N('Pinocchio’s feet are gone. Will Geppetto be kind or cross?')],
          [
            o(
              'Kind. He loves Pinocchio.',
              [N('Yes. Geppetto will be kind, and he will mend the feet.')],
              true,
            ),
            o('Cross, and walk away.', [
              N('He might be a bit cross. But watch, he stays and helps.'),
            ]),
          ],
          'Thought about being kind to someone who has had an accident.',
        ),
      ],
    ),
  ],
);

// ================================================================== A13-5 Three Pears
const A5: EduQuest = quest(
  'a13-05',
  'Three Pears',
  {
    'a13-05-s1': { goal: 'Let Geppetto in.', hint: 'Give Geppetto a hand over the window sill.' },
    'a13-05-s2': {
      goal: 'Help with breakfast: three pears, peeled.',
      hint: 'Do not throw the peel away. You will see.',
    },
    'a13-05-s3': {
      goal: 'Wait at the window while Geppetto goes out into the snow.',
      hint: 'Keep the room warm. Watch the road.',
    },
  },
  [
    sc(
      'a13-05-window',
      [
        P('Babbo, I cannot open the door! My feet are gone!', 'sad'),
        N('Geppetto climbs in through the window. It is a small window!'),
        N('You lean out and take his arm. Up he comes.'),
        G('Now, you young— Oh. Oh, my boy. Your feet.', 'shock'),
        N('He came to scold. He looks at the feet, and hugs him instead.'),
      ],
      [
        ask(
          4,
          'sel',
          'choosing kindness over scolding when someone is hurt',
          'CASEL: Social awareness',
          [N('Geppetto wanted to scold. Then he hugged. Why did he change?')],
          [
            o(
              'He saw Pinocchio needed help.',
              [N('Yes. When someone needs help, a hug comes first.')],
              true,
            ),
            o('He forgot he was cross.', [
              N('He did not forget. He chose to be kind first. That is a strong thing to do.'),
            ]),
          ],
          'Talked about choosing kindness first when someone needs help.',
        ),
      ],
    ),
    sc(
      'a13-05-window-done',
      [
        P('I am so hungry, Babbo.', 'sad'),
        N('Geppetto takes three pears from his pocket. It is his own breakfast.'),
        N('He holds them out and says nothing about it.'),
      ],
      [
        doit(
          1,
          'maths',
          'count three pears',
          'K.CC.B.5',
          'edu:count:pears:3',
          [
            N('Point and count the pears. One, two, three.'),
            N('Three pears. How many is that? Three!'),
          ],
          'Counted three pears.',
        ),
      ],
    ),
    sc(
      'a13-05-pears',
      [
        P('Peel them for me, please. I only like them peeled.'),
        N('Geppetto peels all three. He puts the peel and cores aside.'),
        N('Pinocchio gobbles up all three pears. Munch, munch, munch!'),
        P('I am still hungry.', 'sad'),
        G('I have only the peel and the cores.'),
        N('Pinocchio looks at them for quite a while.'),
      ],
      [
        notice(
          2,
          'science',
          'a pear has seeds in its core, and seeds grow into trees',
          'ELOF: Scientific Reasoning',
          [
            N('The core of a pear has little brown seeds. A seed can grow into a pear tree!'),
            N('It needs soil, water and sun.'),
          ],
          'Heard that a seed in a pear’s core can grow into a tree.',
        ),
      ],
      {
        choices: [
          {
            id: 'ask',
            label: 'Ask Geppetto if he has eaten.',
            then: [
              G('Me? Oh yes. Ages ago.', 'happy'),
              N('His tummy rumbles loudly. He talks over it.'),
            ],
          },
          {
            id: 'save',
            label: 'Put the peel and cores on a plate for later.',
            then: [N('You put them on a plate. The plate waits.')],
          },
        ],
      },
    ),
    sc(
      'a13-05-pears-done',
      [
        N('A minute later the peel is gone, and the cores too.'),
        P('I feel very well now.', 'happy'),
        G('You see? Do not be too fussy.'),
      ],
      [
        ask(
          2,
          'sel',
          'sharing: Geppetto gave away his own breakfast',
          'ELOF: Social and Emotional Development',
          [N('Geppetto gave away his breakfast. What is that called?')],
          [
            o(
              'Sharing. It is kind.',
              [N('Yes! Sharing is giving some of what you have to someone else.')],
              true,
            ),
            o('Being silly.', [
              N('It is not silly. It is sharing, and it is one of the kindest things there is.'),
            ]),
          ],
          'Talked about sharing: giving some of what you have to someone else.',
        ),
      ],
    ),
    sc(
      'a13-05-snow',
      [
        N('Geppetto makes new feet for Pinocchio. They are his best yet.'),
        N('From the scraps, he starts a little wooden Nubbin for you.'),
        G('I will finish it tomorrow. There is always tomorrow for small things.', 'happy'),
        N('He makes Pinocchio a paper suit with flowers on it, and bark shoes.'),
        P('But I need a spelling-book for school.'),
        N('Geppetto has no money. He puts on his old patched coat and goes out.'),
        N('It is snowing.'),
      ],
      [
        notice(
          6,
          'science',
          'a coat keeps you warm by holding your body’s warmth in',
          'ELOF: Scientific Reasoning',
          [N('A thick coat holds your warmth close, like a hug. In snow, a coat helps a lot.')],
          'Learned that a warm coat keeps our own body warmth in.',
        ),
      ],
    ),
    sc(
      'a13-05-coat',
      [...COAT],
      [
        ask(
          2,
          'literacy',
          'how a character feels from what he says and does',
          'RL.2.3',
          [N('Geppetto said “I was too warm.” But it was snowing! Why did he say that?')],
          [
            o(
              'So Pinocchio would not feel bad.',
              [N('Yes. He gave something up, and he did not want Pinocchio to worry.')],
              true,
            ),
            o('Because he was hot.', [
              N('It was snowy! He was kind, and he did not want Pinocchio to worry.'),
            ]),
          ],
          'Worked out why a character said something kind that was not quite true.',
        ),
      ],
    ),
    sc(
      'a13-05-complete',
      [
        N('Next morning Pinocchio walks to school, talking all the way.'),
        P('Today I learn to read. Tomorrow, to write. The day after, sums.', 'happy'),
        N('Geppetto watches from the door in his shirt-sleeves.'),
        N('The half-carved Nubbin waits on the bench. Ears, and nothing else.'),
      ],
      [
        doit(
          2,
          'maths',
          'count three days: today, tomorrow, the day after',
          'K.CC.B.4',
          'edu:count:days:3',
          [N('Today. Tomorrow. The day after. Count on your fingers: one, two, three days.')],
          'Counted three days in order.',
        ),
      ],
    ),
  ],
);

// ================================================================== A13-6 The Puppet Show
const A6: EduQuest = quest(
  'a13-06',
  'The Puppet Show',
  {
    'a13-06-s1': {
      goal: 'Walk Pinocchio to school.',
      hint: 'Keep to the road. Something by the sea is making a noise.',
    },
    'a13-06-s2': {
      goal: 'Get into the puppet theatre.',
      hint: 'Your Nubbin knows a gap under the canvas.',
    },
  },
  [
    sc(
      'a13-06-road',
      [
        N('Halfway to school there is music. Fifes and a big drum!'),
        P('Do you hear that? I like that!', 'happy'),
        N('One foot points to school. One foot points to the music.'),
        N('At the bottom of the hill is a great tent with flags.'),
        N('The poster says THE GREAT PUPPET THEATRE.'),
      ],
      [
        doit(
          1,
          'music',
          'a drum makes sound when it shakes: vibration',
          '1-PS4-1',
          'edu:clap:beat:drum',
          [
            N('A drum goes boom, boom. Tap your knees in a steady beat.'),
            N('When the drum skin shakes, it makes the sound.'),
          ],
          'Made a steady beat and heard that shaking makes sound.',
        ),
      ],
      {
        choices: [
          {
            id: 'coat',
            label: 'Remind him what the spelling-book cost.',
            then: [P('I know! I will go to school tomorrow.', 'angry')],
          },
          {
            id: 'let',
            label: 'Say nothing. It is his road.',
            then: [N('You say nothing. He looks at you, hoping you might.')],
          },
        ],
      },
    ),
    sc(
      'a13-06-road-done',
      [
        N('A ticket costs four pennies. Pinocchio has no pennies.'),
        N('He has a spelling-book. He sells it for four pennies.'),
        N('Oh, Pinocchio.'),
      ],
      [
        doit(
          1,
          'maths',
          'count out four pennies',
          'K.CC.B.5',
          'edu:count:pennies:4',
          [N('Count four pennies into Pinocchio’s hand. One, two, three, four.')],
          'Counted out four pennies.',
        ),
      ],
    ),
    sc(
      'a13-06-show',
      [
        N('You crawl in under the canvas. You find a place at the back.'),
        N('On stage, Harlequin and Punchinello are quarrelling.'),
        HQ('Look! It is our brother Pinocchio!', 'shock'),
        PU('Come up! Come up!', 'happy'),
        N('Pinocchio jumps onto the stage. Hugs, and kisses, and friendly pokes!'),
      ],
      [
        notice(
          1,
          'social-studies',
          'Harlequin and Punchinello are old Italian puppet and theatre characters',
          'D2.His.2.K-2',
          [
            N('Harlequin and Punchinello are very old characters from Italy.'),
            N('Harlequin wears bright patchwork. Punchinello has a big curved nose.'),
          ],
          'Met Harlequin and Punchinello, two old puppet and theatre characters from Italy.',
        ),
      ],
    ),
    sc(
      'a13-06-show-done',
      [
        N('Then the showman comes out. He is as big as a door.'),
        N('His beard reaches the floor. His eyes are like red lanterns.'),
        FE('What is all this? Who is that?', 'angry'),
      ],
      [
        ask(
          2,
          'sel',
          'it is all right to feel scared, and some things help',
          'CASEL: Self-management',
          [N('Fire-eater looks big and loud. What helps if you feel scared?')],
          [
            o(
              'Take a big slow breath.',
              [N('Yes. In through the nose, out through the mouth. Try it.')],
              true,
            ),
            o('Hold a friend’s hand.', [N('Yes! A hand to hold helps too.')], true),
          ],
          'Practised ways to calm down when something feels scary.',
        ),
      ],
    ),
    sc(
      'a13-06-complete',
      [
        N('Nobody answers. Even the drum is quiet.'),
        FE('We will talk about him after the show. Hang him up!'),
        N('Pinocchio hangs by his paper jacket on a nail, like a coat.'),
        N('The showman’s name is Fire-eater. It is only a name.'),
      ],
      [
        doit(
          3,
          'literacy',
          'first sound: Fire starts with f',
          'RF.K.2',
          'edu:say:first-sound:f',
          [
            N('Fire-eater starts with f, f, f. Fox starts with f too.'),
            N('Can you think of another f word? Fish? Foot? Fan?'),
          ],
          'Listened for the first sound f in Fire, Fox, fish and foot.',
        ),
      ],
    ),
  ],
);

// ================================================================== A13-7 Fire-eater Sneezes
const A7: EduQuest = quest(
  'a13-07',
  'Fire-eater Sneezes',
  {
    'a13-07-s1': {
      goal: 'Follow the puppets to Fire-eater’s kitchen.',
      hint: 'Keep behind Harlequin.',
    },
    'a13-07-s2': {
      goal: 'Stay close while Pinocchio pleads for Harlequin.',
      hint: 'Stand near. This bit is his.',
    },
  },
  [
    sc(
      'a13-07-kitchen',
      [
        N('After the show, Fire-eater has supper. His fire is getting low.'),
        FE('I need more wood. Bring me that new puppet.'),
        N('Pinocchio is brought in, wriggling like an eel.'),
        P('Babbo! Save me!', 'shock'),
        N('Fire-eater’s nose twitches. His eyes water. Then he sneezes!'),
        HQ('Good news, brother. When he sneezes, he is sorry for you.', 'happy'),
      ],
      [
        notice(
          5,
          'health',
          'a sneeze is how our body clears our nose; cover it with an elbow',
          'ELOF: Perceptual, Motor, and Physical Development',
          [
            N('Atchoo! A sneeze clears tickles out of your nose.'),
            N('We sneeze into our elbow, like this. (Show how.)'),
          ],
          'Learned that a sneeze clears the nose and practised sneezing into an elbow.',
        ),
      ],
      {
        choices: [
          {
            id: 'speak',
            label: 'Step forward and speak up for Pinocchio.',
            then: [
              FE('And who are you? Sit down, traveller. You are in my light.'),
              N('You sit. He looks at you twice.'),
            ],
          },
          {
            id: 'hold',
            label: 'Hold your Nubbin tight and keep still.',
            then: [N('You keep still. Your Nubbin watches the whip very carefully.')],
          },
        ],
      },
    ),
    sc(
      'a13-07-kitchen-done',
      [
        FE('I will not burn you. But my supper must be cooked.', 'think'),
        FE('Bring me Harlequin instead.'),
      ],
      [
        ask(
          1,
          'maths',
          'which group has more: 5 logs or 2 logs',
          'K.CC.C.6',
          [
            N('Fire-eater wants a big fire. Here are two piles of logs. Five logs, and two logs.'),
            N('Which pile has more?'),
          ],
          [
            o('The pile of five.', [N('Yes! Five is more than two.')], true),
            o('The pile of two.', [N('Count them: five logs, then two logs. Five is more.')]),
          ],
          'Compared two groups and found which had more.',
        ),
      ],
    ),
    sc(
      'a13-07-harlequin',
      [
        N('Harlequin is so scared his legs fold up like a stool.'),
        P('Have pity, Your Excellency!', 'sad'),
        N('Fire-eater sits up. He likes being called Your Excellency.'),
        P('Please do not hurt Harlequin. Take me instead.'),
        N('Pinocchio takes off his cap and holds it to his chest.'),
        N('Fire-eater’s nose twitches. Atchoo! Atchoo! Atchoo!'),
      ],
      [
        ask(
          4,
          'sel',
          'helping a friend, even when it is hard',
          'CASEL: Relationship skills',
          [N('Pinocchio spoke up for his friend. What was that?')],
          [
            o('Brave and kind.', [N('Yes! It takes courage to stand up for a friend.')], true),
            o('Silly.', [N('Not silly. It was brave and kind, and it saved Harlequin.')]),
          ],
          'Talked about standing up for a friend.',
        ),
      ],
    ),
    sc(
      'a13-07-harlequin-done',
      [
        FE('Oh, very well! Nobody burns tonight.', 'sad'),
        N('The puppets dance till dawn. So do you!'),
        N('Your Nubbin dances along Fire-eater’s beard.'),
      ],
      [
        doit(
          1,
          'music',
          'keep a steady beat and dance to it',
          'ELOF: Perceptual, Motor, and Physical Development',
          'edu:clap:beat:dance',
          [
            N('Let us dance with the puppets! Clap and stamp to a steady beat.'),
            N('Clap, clap, stamp. Clap, clap, stamp.'),
          ],
          'Danced and clapped to a steady beat.',
        ),
      ],
    ),
    sc(
      'a13-07-complete',
      [
        N('In the morning Fire-eater asks about Pinocchio’s father.'),
        P('He is poor. He sold his coat for my spelling-book.', 'sad'),
        N('Fire-eater sneezes again. He gives Pinocchio five gold pieces.'),
        FE('For your father. Tell him to buy a coat.', 'soft'),
        N('Pinocchio hugs every puppet twice, and goes home with the gold.'),
      ],
      [
        ask(
          3,
          'social-studies',
          'choosing: money can buy a coat or a toy, but not both',
          'D2.Eco.1.K-2',
          [
            N('Five gold pieces. A warm coat for Babbo, or a toy for Pinocchio?'),
            N('We cannot buy both. We have to choose.'),
          ],
          [
            o(
              'The coat for Babbo.',
              [N('A good choice. Choosing means picking what matters most.')],
              true,
            ),
            o('The toy.', [
              N(
                'A toy is fun. But Babbo is cold. When we cannot have both, we choose what matters most.',
              ),
            ]),
          ],
          'Thought about choosing what to spend on when we cannot have everything.',
        ),
      ],
    ),
  ],
);

// ================================================================== A13-8 The Fox and the Cat
const A8: EduQuest = quest(
  'a13-08',
  'The Fox and the Cat',
  {
    'a13-08-s1': {
      goal: 'Walk home with Pinocchio and his five gold pieces.',
      hint: 'Watch who you meet on the road.',
    },
    'a13-08-s2': {
      goal: 'Stop for supper at the Inn of the Red Craw-fish.',
      hint: 'Pinocchio is paying. He does not know yet.',
    },
  },
  [
    sc(
      'a13-08-road',
      [
        N('On the road you meet a lame Fox and a blind Cat.'),
        FX('Good day, Pinocchio.', 'happy'),
        P('How do you know my name?'),
        FX('I know your babbo. I saw him shivering at his door.', 'sad'),
        P('Look! Five gold pieces. I am buying Babbo a coat!', 'happy'),
        N('The Fox stretches out his lame leg. The Cat opens his eyes, then shuts them.'),
        N('Nobody sees but you.'),
      ],
      [
        ask(
          6,
          'sel',
          'staying safe with people you have just met: check with a grown-up you trust',
          'CASEL: Responsible decision-making',
          [N('A stranger knows your name and wants your money. What should you do?')],
          [
            o(
              'Say no, and tell a grown-up I trust.',
              [N('Yes! Always check with a grown-up you trust first.')],
              true,
            ),
            o('Give it to them.', [
              N('Not yet! Strangers can be tricky. Check with a grown-up you trust first.'),
            ]),
          ],
          'Practised staying safe: check with a trusted grown-up before trusting someone new.',
        ),
      ],
      {
        choices: [
          {
            id: 'warn',
            label: 'Warn him. The Cat opened its eyes.',
            then: [P('Shame on you. He is blind!', 'angry'), CT('We forgive you, traveller.')],
          },
          {
            id: 'quiet',
            label: 'Say nothing yet, and watch the Fox.',
            then: [N('The Fox sees you watching. He smiles with all his teeth.')],
          },
        ],
      },
    ),
    sc(
      'a13-08-road-done',
      [
        FX('Would you like to make five gold pieces into a thousand?'),
        FX('Plant a coin in the Field of Miracles. A tree will grow with gold on it!'),
        N('A white blackbird calls to Pinocchio not to listen.'),
        N('The Cat leaps. The blackbird flies away safe.'),
      ],
      [
        ask(
          1,
          'science',
          'plants grow from seeds, not coins; they need soil, water and sun',
          '2-LS2-1',
          [N('Can a gold coin grow into a tree? What grows into a tree?')],
          [
            o('A seed!', [N('Yes! A seed, with soil, water and sun.')], true),
            o('A gold coin.', [
              N('Coins are metal. They cannot grow. Only a seed can, with soil, water and sun.'),
            ]),
          ],
          'Learned that trees grow from seeds, not from coins.',
        ),
      ],
    ),
    sc(
      'a13-08-inn',
      [
        N('At night you reach the Inn of the Red Craw-fish.'),
        N('The Cat orders lots and lots of fish. The Fox orders chicken.'),
        N('Pinocchio is too excited to eat. He has a walnut.'),
        P('Tonight a seed. Tomorrow a tree!', 'happy'),
      ],
      [
        ask(
          1,
          'science',
          'fish live in water and breathe with gills',
          'K-ESS3-1',
          [N('The Cat ordered fish. Where do fish live?')],
          [
            o('In the water.', [N('Yes! Fish live in water and breathe with gills.')], true),
            o('Up in the trees.', [
              N('Birds live in trees. Fish live in water, and breathe through gills.'),
            ]),
          ],
          'Learned that fish live in water and breathe through gills.',
        ),
      ],
      {
        choices: [
          {
            id: 'bill',
            label: 'Ask who is paying for all this.',
            then: [FX('Paying? Among friends? What a question!', 'happy')],
          },
          {
            id: 'pocket',
            label: 'Wrap Pinocchio’s leftover bread for his pocket.',
            then: [N('You tuck the bread in his pocket. He will be glad of it later.')],
          },
        ],
      },
    ),
    sc(
      'a13-08-inn-done',
      [
        N('At midnight the innkeeper knocks. The Fox and Cat have gone ahead.'),
        IK('They said you would pay. One gold piece.'),
        N('Pinocchio pays. He had five gold pieces. Now he has four.'),
      ],
      [
        doit(
          2,
          'maths',
          'take away one from five: 5 − 1 = 4',
          'K.OA.A.2',
          'edu:count:gold-left:4',
          [
            N('Pinocchio had five gold pieces. He paid one.'),
            N('Take one away. How many are left? Count: four!'),
          ],
          'Took one away from five to make four.',
        ),
      ],
    ),
    sc(
      'a13-08-complete',
      [
        N('The night is very dark. Something rustles in the hedge.'),
        N('From low in the leaves comes a tiny sound. Cri.'),
        P('Not you. I am not listening.', 'shock'),
        N('He walks faster. There is only dark in the hedge.'),
      ],
      [
        ask(
          2,
          'sel',
          'what helps when the dark feels scary',
          'CASEL: Self-management',
          [N('Pinocchio hears a noise in the dark. What helps when you feel scared?')],
          [
            o('Stay close to a friend.', [N('Yes. Stay near someone safe.')], true),
            o(
              'Tell myself it is only the dark.',
              [N('Yes. Breathe slowly, and remind yourself you are safe.')],
              true,
            ),
          ],
          'Talked about what helps when the dark feels scary.',
        ),
      ],
    ),
  ],
);

// ================================================================== A13-9 The Assassins
const A9: EduQuest = quest(
  'a13-09',
  'The Assassins',
  {
    'a13-09-s1': { goal: 'Keep close to Pinocchio on the dark road.', hint: 'Stay on the road.' },
    'a13-09-s2': {
      goal: 'Run after Pinocchio across the fields.',
      hint: 'Follow the clack of his feet. Jump the ditch.',
    },
  },
  [
    sc(
      'a13-09-sacks',
      [
        N('Behind you, two shapes in black sacks hop along.'),
        P('Robbers!', 'shock'),
        N('Pinocchio pops the gold under his tongue, quick as a squirrel.'),
        ST('Give us your gold!'),
        N('Pinocchio cannot answer. His mouth is full of gold!'),
        SS('Hand it over, or else!'),
        N('One sounds just like a Fox with a cold.'),
      ],
      [
        notice(
          5,
          'science',
          'squirrels hide food to eat later',
          'ELOF: Scientific Reasoning',
          [N('Squirrels hide nuts in the ground and in trees. They find them later, in winter.')],
          'Heard that squirrels store food to eat later.',
        ),
      ],
      {
        choices: [
          {
            id: 'stick',
            label: 'Grab a stick and stand with him.',
            then: [
              N('You grab a stick. A sack takes it politely. You land in the ditch.'),
              N('Your Nubbin hops in after you.'),
            ],
          },
          {
            id: 'shout',
            label: 'Pick up your Nubbin and shout for help.',
            then: [N('You shout till the hills shout back. Nobody comes.')],
          },
        ],
      },
    ),
    sc(
      'a13-09-sacks-done',
      [
        N('A sack grabs Pinocchio’s chin. Chomp! Pinocchio bites hard.'),
        N('The sack yowls just like a cat, and lets go.'),
        N('Pinocchio hops over the hedge and runs.'),
      ],
      [
        ask(
          1,
          'literacy',
          'rhymes: chin and pin',
          'RF.K.2',
          [N('Chin. Does it rhyme with pin, or with sock?')],
          [
            o('Pin!', [N('Yes! Chin, pin. They rhyme.')], true),
            o('Sock.', [N('Chin, pin: same ending sound. Sock is different.')]),
          ],
          'Found a rhyme: chin and pin.',
        ),
      ],
    ),
    sc(
      'a13-09-chase',
      [
        N('He runs across the fields. You run after him.'),
        N('There is a muddy ditch. Pinocchio jumps over it. So do you!'),
        N('The sacks jump too, and land in the middle. Splash!'),
        N('Far off there is a little white house. Pinocchio knocks.'),
        P('Help! Open up! Please!'),
        N('A girl with blue hair opens the window. She has her eyes shut.'),
        FY('Nobody is home. I am only waiting.', 'soft'),
        N('The window closes softly.'),
      ],
      [
        ask(
          2,
          'maths',
          'position words: over, under, in the middle',
          'K.G.A.1',
          [
            N('Pinocchio jumps OVER the ditch. The sacks land IN the ditch.'),
            N('Is the ditch under you when you jump?'),
          ],
          [
            o(
              'Yes! I am over it.',
              [N('Yes! Over the ditch means above it. Hop to show it.')],
              true,
            ),
            o('No, it is beside me.', [
              N('When you jump, the ditch is under you. You are over it.'),
            ]),
          ],
          'Used position words: over, under and in.',
        ),
      ],
    ),
    sc(
      'a13-09-chase-done',
      [
        N('The sacks catch Pinocchio at the door. They shake him.'),
        N('They hang him by his paper jacket from the Big Oak.'),
        N('He dangles like a coat on a peg. He is not hurt.'),
        ST('We will be back in the morning.'),
      ],
      [
        ask(
          2,
          'sel',
          'asking for help when you are stuck',
          'ELOF: Social and Emotional Development',
          [N('Pinocchio is stuck on a branch. What can he do?')],
          [
            o('Call for help.', [N('Yes. Calling for help is clever, not silly.')], true),
            o('Stay quiet.', [N('If we are stuck, we can call for help. Someone will hear.')]),
          ],
          'Talked about asking for help when stuck.',
        ),
      ],
    ),
    sc(
      'a13-09-complete',
      [
        N('You cannot reach the branch, even standing on a stone.'),
        N('The north wind swings him like a bell.'),
        P('Oh, Babbo. If you were here.', 'sad'),
        N('Pinocchio is worn out. His eyes close.'),
        N('Behind you, the window of the white house opens again.'),
      ],
      [
        notice(
          1,
          'science',
          'wind is moving air, and it moves things',
          'K-ESS2-1',
          [N('Wind is air that is moving. It can push a branch, a kite, or a puppet.')],
          'Heard that wind is moving air that pushes things.',
        ),
      ],
    ),
  ],
);

// ================================================================== A13-10 The Big Oak
const A10: EduQuest = quest(
  'a13-10',
  'The Big Oak',
  {
    'a13-10-s1': {
      goal: 'Watch the Fairy’s falcon cut Pinocchio down.',
      hint: 'Stand under the oak. Be ready to catch.',
    },
    'a13-10-s2': {
      goal: 'Wait by the bed while the doctors look at Pinocchio.',
      hint: 'Look at the third doctor.',
    },
  },
  [
    sc(
      'a13-10-falcon',
      [
        N('The girl at the window is a Fairy with blue hair.'),
        N('She claps three times. A great Falcon lands on the sill.'),
        FY('Cut the knot with your beak. Let him down gently.'),
        N('Snip! You catch Pinocchio. He is light as kindling.'),
        FY('Bring him in. Medoro! The coach!'),
        N('A poodle in a coachman’s coat leads a tiny coach. A hundred white mice pull it!'),
        MD('Mind the custard, please. It is for the journey.'),
      ],
      [
        notice(
          2,
          'science',
          'a falcon has a hooked beak, sharp claws and big eyes that help it hunt',
          'K-LS1-1',
          [
            N('A falcon is a bird with a hooked beak and sharp claws.'),
            N('Its eyes are very good. It can spot a mouse from far away.'),
          ],
          'Learned how a falcon’s beak, claws and eyes help it live.',
        ),
      ],
      {
        choices: [
          {
            id: 'who',
            label: 'Ask the Fairy who she is.',
            then: [FY('Someone who lives here. Bring him in.', 'soft')],
          },
          {
            id: 'lift',
            label: 'Lift Pinocchio into the coach yourself.',
            then: [
              N('You lay him on soft feathers. Your Nubbin sits on his chest to keep it warm.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a13-10-falcon-done',
      [N('The Fairy puts Pinocchio to bed.'), N('She sends for the three best doctors nearby.')],
      [
        doit(
          1,
          'maths',
          'count three doctors',
          'K.CC.B.5',
          'edu:count:doctors:3',
          [
            N('Three doctors are coming: a Crow, an Owl and a Cricket.'),
            N('Hold up three fingers and count them.'),
          ],
          'Counted three doctors.',
        ),
      ],
    ),
    sc(
      'a13-10-doctors',
      [
        N('In come a Crow, an Owl and a Talking-cricket.'),
        N('You look twice. It is the cricket! A little grey, and a little stiff.'),
        FY('Doctors, is this poor puppet very ill?'),
        CW('I think so. Or perhaps he is only very sleepy.', 'think'),
        OW('I think he is ill. Or perhaps he is only very sleepy.'),
        CR('A wise doctor keeps quiet when he does not know. But I know this puppet.'),
        CR('He is a rascal. But a rascal can mend his ways.'),
        N('From under the sheet comes a sound of crying.'),
        CW('When a patient cries, it is a sign he is getting better.'),
      ],
      [
        ask(
          3,
          'health',
          'doctors and grown-ups help us when we are ill',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('Pinocchio is ill. Who helps us when we are ill?')],
          [
            o(
              'A doctor, and a grown-up who loves me.',
              [N('Yes! Doctors help, and so do the grown-ups at home.')],
              true,
            ),
            o('Nobody.', [
              N(
                'Lots of people help. Doctors, nurses, and the grown-ups at home. Always tell one.',
              ),
            ]),
          ],
          'Talked about who helps us when we are ill.',
        ),
      ],
    ),
    sc(
      'a13-10-doctors-done',
      [
        ...LEAVE,
        N('Under the sheet, Pinocchio stops crying to listen.'),
        N('He hears that slow, uneven step go down the stairs.'),
      ],
      [
        ask(
          2,
          'sel',
          'forgiveness: the cricket still came to help',
          'CASEL: Social awareness',
          [
            N('Pinocchio threw a mallet at the cricket. Yet the cricket came to help.'),
            N('What is that?'),
          ],
          [
            o(
              'Forgiving. It is kind.',
              [N('Yes! Forgiving means letting go of being cross.')],
              true,
            ),
            o('Silly.', [N('Not silly. It is forgiving, a very kind thing.')]),
          ],
          'Talked about forgiveness: letting go of being cross.',
        ),
      ],
    ),
    sc(
      'a13-10-complete',
      [
        N('The Fairy sits on the edge of the bed.'),
        N('She puts her hand on Pinocchio’s forehead. He is very warm.'),
        FY('Fever. Silly boy. Silly, silly boy.', 'soft'),
        FY('You came in with him. Stay, then.'),
      ],
      [
        notice(
          3,
          'health',
          'a fever means your body is warm and fighting a germ; rest and a cool drink help',
          'ELOF: Perceptual, Motor, and Physical Development',
          [
            N('A fever is when your body feels extra hot. It is fighting off a germ.'),
            N('Rest, a cool drink and a grown-up’s help make it better.'),
          ],
          'Learned that a fever means the body is fighting a germ, and that rest and a drink help.',
        ),
      ],
    ),
  ],
);

// ================================================================== A13-11 The Nose
const A11: EduQuest = quest(
  'a13-11',
  'The Nose',
  {
    'a13-11-s1': {
      goal: 'Get Pinocchio to take his medicine.',
      hint: 'He will bargain. Sugar first, then the glass.',
    },
    'a13-11-s2': {
      goal: 'Stay while the Fairy asks about the gold.',
      hint: 'Stand where he can see you.',
    },
  },
  [
    sc(
      'a13-11-medicine',
      [
        FY('Drink this, and you will be well in a day or two.'),
        P('Is it sweet or bitter?'),
        FY('Bitter. But it is good for you.'),
        P('Then I want a lump of sugar first.'),
        N('Crunch! He eats the sugar. He pushes the glass away.'),
        P('Another lump. Then I will drink it. Probably.'),
        N('In come four black rabbits, walking on their back legs.'),
        RB('We heard you were not taking your medicine.', 'think'),
        P('Give me the glass! Quick!', 'shock'),
        N('Gulp! He drinks it all. The rabbits go out, grumbling.'),
      ],
      [
        ask(
          9,
          'health',
          'take medicine only from a grown-up who looks after you, and as they say',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('The Fairy gave Pinocchio his medicine. Who gives you medicine?')],
          [
            o(
              'A grown-up who looks after me.',
              [N('Yes. Only take medicine from a grown-up you trust.')],
              true,
            ),
            o('I find it myself.', [
              N('Never take medicine by yourself. Ask the grown-up who looks after you.'),
            ]),
          ],
          'Learned to take medicine only from a trusted grown-up.',
        ),
      ],
    ),
    sc(
      'a13-11-medicine-done',
      [
        N('In a few minutes Pinocchio jumps out of bed. He is well!'),
        N('Puppets get ill quickly, and well quickly.'),
      ],
      [
        doit(
          0,
          'maths',
          'add one more: 1 lump of sugar + 1 more = 2',
          'K.OA.A.1',
          'edu:add:sugar-lumps:2',
          [
            N('Pinocchio ate one lump of sugar. Then he asked for one more.'),
            N('One lump, and one more. Count them: one, two lumps!'),
          ],
          'Added one more to one to make two.',
        ),
      ],
    ),
    sc(
      'a13-11-nose',
      [
        FY('Now. Where are the four gold pieces?'),
        P('I lost them.'),
        N('That is a fib. His nose grows two fingers longer!'),
        P('I lost them in the wood.'),
        N('His nose grows again. It bumps the bed and the window.'),
        FY('Fibs are found out quickly, my boy.'),
        N('He cannot get through the door. His nose is too long!'),
      ],
      [
        ask(
          6,
          'sel',
          'honesty: telling the truth, even when it is hard',
          'CASEL: Responsible decision-making',
          [N('Pinocchio fibbed. What is better to do?')],
          [
            o('Tell the truth.', [N('Yes! The truth is easier to carry than a fib.')], true),
            o('Fib again.', [
              N(
                'Another fib makes it grow more! The truth is better, and nobody needs to feel ashamed.',
              ),
            ]),
          ],
          'Talked about telling the truth, even when it is hard, without shame.',
        ),
      ],
      {
        choices: [
          {
            id: 'laugh',
            label: 'Laugh, kindly. You cannot help it.',
            then: [
              P('It is not funny!', 'angry'),
              N('It is a little funny. In a minute even he thinks so.'),
            ],
          },
          {
            id: 'truth',
            label: 'Tell him the coins are in his pocket. He knows.',
            then: [
              P('They are in my pocket.', 'sad'),
              N('His nose stops growing. That is a start.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a13-11-nose-done',
      [
        N('Pinocchio cries for a while. The Fairy lets him.'),
        N('Then she claps. A thousand woodpeckers fly in.'),
        N('Tap, tap, tap! They peck his nose back to size.'),
      ],
      [
        notice(
          2,
          'science',
          'woodpeckers tap on trees with strong beaks to find food and make homes',
          'K-LS1-1',
          [
            N('Real woodpeckers tap on trees. Tap, tap, tap!'),
            N('Their strong beaks help them find bugs and make a home.'),
          ],
          'Learned how a woodpecker’s beak helps it find food and make a home.',
        ),
      ],
    ),
    sc(
      'a13-11-complete',
      [
        FY('There. I will be your sister, if you will be a good brother.', 'soft'),
        FY('Your babbo is on his way. He will be here by dark.'),
        P('Babbo! Here? I will go and meet him!', 'happy'),
        N('He is off in a rattle of bark shoes.'),
      ],
      [
        ask(
          3,
          'literacy',
          'family words: sister, brother, mother, father',
          'ELOF: Language and Communication',
          [N('The Fairy says she will be Pinocchio’s sister. Who is in your family?')],
          [
            o(
              'My family has people I love.',
              [N('Yes! Families come in all kinds, and all of them are family.')],
              true,
            ),
            o('Families are all the same.', [
              N('Families are all different. Who is in yours? Tell your grown-up.'),
            ]),
          ],
          'Named family members and noticed that families come in many kinds.',
        ),
      ],
    ),
  ],
);

// ================================================================== A13-12 The Field of Miracles
const A12: EduQuest = quest(
  'a13-12',
  'The Field of Miracles',
  {
    'a13-12-s1': {
      goal: 'Walk with Pinocchio to meet Geppetto on the road.',
      hint: 'The road goes past the Big Oak.',
    },
    'a13-12-s2': {
      goal: 'Help Pinocchio plant his coins in the Field of Miracles.',
      hint: 'Dig, plant, water. Then wait.',
    },
  },
  [
    sc(
      'a13-12-oak',
      [
        N('At the Big Oak sit the Fox and the Cat, as if nothing happened.'),
        FX('Our dear Pinocchio!', 'happy'),
        N('The Cat keeps one paw tucked in his coat.'),
        P('I promised the Fairy. I will go and meet Babbo. Straight there!'),
        FX('With four coins, you could have two thousand. Think how proud Babbo would be.'),
        P('Is it far?'),
        N('Pinocchio thinks of the Fairy, and of Babbo. And of two thousand.'),
      ],
      [
        ask(
          6,
          'sel',
          'keeping a promise, even when someone tempts you',
          'CASEL: Responsible decision-making',
          [
            N('Pinocchio promised to meet his babbo. The Fox wants him to go instead.'),
            N('What is the wise thing to do?'),
          ],
          [
            o(
              'Keep my promise.',
              [N('Yes. Keeping a promise shows people they can trust us.')],
              true,
            ),
            o('Go with the Fox.', [
              N('That sounds exciting. But a promise matters. Keep it, and meet Babbo first.'),
            ]),
          ],
          'Talked about keeping a promise when someone tempts you away.',
        ),
      ],
      {
        choices: [
          {
            id: 'babbo',
            label: 'Remind him Geppetto is on this very road.',
            then: [
              P('Then he will wait! He is good at waiting.'),
              N('He says it as if it were a reason.'),
            ],
          },
          {
            id: 'go',
            label: 'Go with him. Somebody should.',
            then: [N('You go with him. The Fox gives you a long look.')],
          },
        ],
      },
    ),
    sc(
      'a13-12-oak-done',
      [
        N('The town of Catchfools is full of sad animals.'),
        N('Dogs with no coats, shivering. Sheep with no wool. Hens with no crests.'),
        N('Butterflies who sold their wings!'),
      ],
      [
        ask(
          1,
          'literacy',
          'feeling words: shivering, hungry, shy',
          'RL.1.4',
          [
            N('The dogs are shivering. Shivering is a word for feeling very cold.'),
            N('Can you shiver like a cold dog?'),
          ],
          [
            o('Brrr! I am shivering!', [N('Yes! Brrr. You are shivering like a cold dog.')], true),
            o('Not sure.', [N('Try wiggling all over and saying brrr. That is shivering.')]),
          ],
          'Practised a feeling and sense word: shivering.',
        ),
      ],
    ),
    sc(
      'a13-12-field',
      [
        N('Outside the town is a lonely field.'),
        FX('Dig a hole. Plant the coins. Water them. Add a pinch of salt.'),
        N('Pinocchio digs with his hands, and you help.'),
        N('He fills his shoe with water from the ditch and pours it on.'),
        FX('Now go away for twenty minutes.'),
        CT('We want nothing for it.'),
        N('The Fox and Cat hurry off down the road.'),
      ],
      [
        doit(
          2,
          'science',
          'planting in order: dig, plant, water',
          '2-LS2-1',
          'edu:order:planting:dig-plant-water',
          [
            N('Real seeds are planted like this. First dig. Next plant. Last water.'),
            N('Put the steps in order: dig, plant, water.'),
          ],
          'Put the steps of planting a seed in order: dig, plant, water.',
        ),
      ],
      {
        choices: [
          {
            id: 'stay',
            label: 'Offer to stay and watch the hole.',
            then: [P('Trees are shy! Come on.'), N('He tugs you away by the sleeve.')],
          },
          {
            id: 'count',
            label: 'Count the twenty minutes with him in town.',
            then: [N('He counts every minute out loud. Some of them twice.')],
          },
        ],
      },
    ),
    sc(
      'a13-12-field-done',
      [
        N('Twenty minutes later, back at the field. There is no tree.'),
        N('There is only a hole, and it is empty.'),
        PR('Ha ha! Your friends dug up your gold and ran off.', 'happy'),
      ],
      [
        doit(
          1,
          'maths',
          'count aloud to 10',
          'K.CC.A.1',
          'edu:count:aloud:10',
          [
            N('Pinocchio counted the minutes. Let us count to ten out loud.'),
            N('One, two, three, four, five, six, seven, eight, nine, ten!'),
          ],
          'Counted aloud from one to ten.',
        ),
      ],
    ),
    sc(
      'a13-12-complete',
      [
        N('Pinocchio digs the hole deeper. There is only more field.'),
        P('Then I will go to the judge. Judges are for this.', 'angry'),
        N('Your Nubbin throws a small clod at the Parrot. It misses.'),
        N('The Parrot laughs again.'),
      ],
      [
        ask(
          1,
          'sel',
          'anyone can be tricked; telling a grown-up helps',
          'CASEL: Self-awareness',
          [N('Pinocchio feels foolish. He was tricked. Is it his fault?')],
          [
            o(
              'Tricksters trick. It is not only his fault.',
              [N('Yes. Anyone can be tricked. Telling someone helps.')],
              true,
            ),
            o('He is just silly.', [
              N('Not silly. Tricksters are good at tricks. Telling a grown-up helps.'),
            ]),
          ],
          'Learned that anyone can be tricked, and that telling a grown-up helps.',
        ),
      ],
    ),
  ],
);

// ================================================================== A13-13 The Gorilla Judge
const A13: EduQuest = quest(
  'a13-13',
  'The Gorilla Judge',
  {
    'a13-13-s1': {
      goal: 'Go with Pinocchio to the court in Catchfools.',
      hint: 'The courthouse has the biggest door in town.',
    },
    'a13-13-s2': { goal: 'Wait outside the prison.', hint: 'Your Nubbin fits between the bars.' },
  },
  [
    sc(
      'a13-13-court',
      [
        N('The judge of Catchfools is a large old Gorilla in glass-less spectacles.'),
        N('Pinocchio tells him everything. He asks for justice.'),
        JG('Dear me. Poor boy.', 'sad'),
        N('The Judge nods and blows his nose. Then he rings a bell.'),
        JG('This boy was robbed. Take him away and lock him up.'),
      ],
      [
        ask(
          4,
          'social-studies',
          'fairness: it is not fair to punish someone who was robbed',
          'D2.Civ.8.K-2',
          [N('The judge locks up the boy who was robbed. Is that fair?')],
          [
            o('No. That is not fair.', [N('Yes. Fair means everyone gets treated rightly.')], true),
            o('Yes. The judge is the boss.', [
              N('Bosses must be fair too. Locking up someone who was robbed is not fair.'),
            ]),
          ],
          'Talked about fairness and why punishing a person who was robbed is not fair.',
        ),
      ],
      {
        choices: [
          {
            id: 'object',
            label: 'Object. He is the one who was robbed!',
            then: [JG('But the robbers are not here. Who else can I lock up?', 'think')],
          },
          {
            id: 'quiet',
            label: 'Keep quiet. Nothing here makes sense anyway.',
            then: [N('You keep quiet. One guard gives you a sorry look.')],
          },
        ],
      },
    ),
    sc(
      'a13-13-court-done',
      [
        N('Four months in jail for being robbed.'),
        N('Pinocchio is led away, too surprised to cry.'),
      ],
      [
        doit(
          1,
          'maths',
          'count four months',
          'K.CC.B.4',
          'edu:count:months:4',
          [
            N('Four months. Hold up four fingers and count them: one, two, three, four.'),
            N('Four months is a long, long time. Winter can turn into spring!'),
          ],
          'Counted four months on fingers.',
        ),
      ],
    ),
    sc(
      'a13-13-prison',
      [
        N('The atlas turns its own pages. Four months go by.'),
        N('You rent a room over the baker’s. Your Nubbin takes crusts to the window.'),
        N('One morning, bells! Flags are everywhere.'),
        N('The young Emperor has won a victory. All prisoners may go free.'),
        N('The jailer opens the cells. He shuts the door on Pinocchio.'),
        P('I beg your pardon. I am a rascal as well.'),
        N('The jailer bows and opens the door.'),
      ],
      [
        notice(
          2,
          'social-studies',
          'Italy’s flag is green, white and red',
          'D2.Geo.2.K-2',
          [
            N('Italy’s flag has three stripes. Green, white and red.'),
            N('(Point to the colours on a picture, if you have one.)'),
          ],
          'Learned that the Italian flag is green, white and red.',
        ),
      ],
    ),
    sc(
      'a13-13-prison-done',
      [N('Pinocchio walks out into the sunshine.'), N('His nose stays exactly where it is.')],
      [
        ask(
          0,
          'literacy',
          'rascal means a cheeky, naughty person',
          'L.2.4',
          [
            N('Pinocchio called himself a rascal. A rascal is a cheeky one.'),
            N('Are rascals always bad? Or can rascals be good?'),
          ],
          [
            o(
              'They can be good too.',
              [N('Yes. A rascal can learn, say sorry, and be kind.')],
              true,
            ),
            o('Always bad.', [N('Not always. A rascal can say sorry and learn to be good.')]),
          ],
          'Learned the word rascal and thought about whether people can change.',
        ),
      ],
    ),
    sc(
      'a13-13-complete',
      [
        P('Straight home now. No stopping.'),
        N('After an hour he walks slowly. After two he looks at the vineyards.'),
        P('Just one bunch of grapes. I am so hungry.', 'sad'),
        N('He is over the wall before you can speak.'),
      ],
      [
        ask(
          2,
          'sel',
          'take only what is yours: ask first',
          'CASEL: Responsible decision-making',
          [N('Grapes grow on a vine. Whose grapes are these?')],
          [
            o(
              'The farmer’s. We should ask first.',
              [N('Yes! We always ask before we take something that is not ours.')],
              true,
            ),
            o('Anyone’s.', [N('They belong to the farmer, who grew them. We ask first.')]),
          ],
          'Talked about asking before taking what belongs to someone else.',
        ),
      ],
    ),
  ],
);

// ================================================================== A13-14 The Guard Dog
const A14: EduQuest = quest(
  'a13-14',
  'The Guard Dog',
  {
    'a13-14-s1': {
      goal: 'Go after Pinocchio into the vineyard.',
      hint: 'Watch where you put your feet.',
    },
    'a13-14-s2': {
      goal: 'Keep watch with Pinocchio by the hen-house.',
      hint: 'Sit in the dark. Be quiet when the visitors come.',
    },
  },
  [
    sc(
      'a13-14-trap',
      [
        N('Pinocchio reaches for a grape. Snap! A trap closes on his ankles.'),
        N('It does not hurt. He is made of wood. But it will not let go.'),
        P('Help! Get it off!'),
        N('At dark, a farmer comes with a lantern.'),
        FM('So you are the one who has been at my hens.', 'angry'),
        P('No! I only wanted two bunches of grapes!'),
        FM(
          'My old dog Melampo died this morning. He was very old. You can be my watchdog tonight.',
        ),
      ],
      [
        ask(
          6,
          'sel',
          'owning up and saying sorry',
          'CASEL: Responsible decision-making',
          [N('Pinocchio took grapes that were not his. What should he say now?')],
          [
            o(
              'I am sorry. I should have asked.',
              [N('Yes! Owning up and saying sorry is brave.')],
              true,
            ),
            o('It was not me.', [N('The truth is better. Say sorry, and put it right.')]),
          ],
          'Practised owning up and saying sorry.',
        ),
      ],
      {
        choices: [
          {
            id: 'plead',
            label: 'Tell the farmer he is only a hungry puppet.',
            then: [FM('Then he will be a hungry watchdog. It is one night. The kennel is dry.')],
          },
          {
            id: 'straw',
            label: 'Help Pinocchio settle into the kennel straw.',
            then: [N('You shake out the straw. Pinocchio sits there, the saddest dog in Tuscany.')],
          },
        ],
      },
    ),
    sc(
      'a13-14-trap-done',
      [
        N('The farmer puts a brass collar on Pinocchio, on a long chain.'),
        FM('If thieves come, bark. Goodnight.'),
        P('The cricket said this would happen.', 'sad'),
      ],
      [
        notice(
          1,
          'science',
          'dogs hear and smell much better than people, which helps them guard',
          'K-LS1-1',
          [
            N('Real dogs are good guards. They hear tiny sounds and smell very well.'),
            N('A dog’s nose is much better than ours.'),
          ],
          'Learned that dogs have very good hearing and sense of smell.',
        ),
      ],
    ),
    sc(
      'a13-14-martens',
      [
        N('Around midnight, four long little shapes slip out of the dark.'),
        N('They are martens. They smell of hens.'),
        MT('Good evening, Melampo.'),
        P('I am not Melampo.'),
        MT('Melampo was very reasonable. He kept quiet. Are you reasonable too?'),
        P('Oh, very reasonable. Go right in.'),
        N('One by one, they go into the hen-house.'),
        N('Your Nubbin counts the tails going in. One, two, three, four. Shut!'),
        N('Pinocchio shuts the door. He rolls a stone against it.'),
        N('Bow-wow! Bow-wow! Bow-wow!'),
      ],
      [
        doit(
          8,
          'maths',
          'count four martens going in',
          'K.CC.B.5',
          'edu:count:martens:4',
          [
            N('Four martens go into the hen-house. Count them as they go in.'),
            N('One, two, three, four!'),
          ],
          'Counted four martens one by one.',
        ),
      ],
    ),
    sc(
      'a13-14-martens-done',
      [
        N('The farmer runs out in his nightshirt, with a lantern.'),
        N('He puts all four martens in a sack.'),
        FM('Well done, dog! Well done, boy. Whatever you are.', 'happy'),
      ],
      [
        ask(
          1,
          'science',
          'some animals are awake at night: owls, bats, martens',
          'K-ESS3-1',
          [N('The martens came at night. Which animal is also awake at night?')],
          [
            o('An owl.', [N('Yes! Owls and bats come out at night.')], true),
            o('A butterfly.', [N('Butterflies sleep at night. Owls and bats are up at night.')]),
          ],
          'Learned that some animals, like owls and bats, are awake at night.',
        ),
      ],
    ),
    sc(
      'a13-14-complete',
      [
        FM('And Melampo, all those years. Did he take hens off them?'),
        N('Pinocchio knows the answer. He looks at the empty kennel.'),
        P('Melampo was a good old dog. Let him keep his good name. It costs nothing.', 'soft'),
        N('The farmer lets him go. He gives you grapes for the road.'),
      ],
      [
        ask(
          2,
          'sel',
          'speaking kindly about someone who is not there',
          'CASEL: Social awareness',
          [N('Pinocchio kept quiet about the old dog’s tricks. Was that kind?')],
          [
            o('Yes. Kind words cost nothing.', [N('Yes. Choosing kind words is a gift.')], true),
            o('No. He should have told.', [
              N('Telling the truth matters. But kind words, said gently, can be true and kind.'),
            ]),
          ],
          'Talked about choosing kind words about others.',
        ),
      ],
    ),
  ],
);

// ================================================================== A13-15 The Stone and the Pigeon
const A15: EduQuest = quest(
  'a13-15',
  'The Stone and the Pigeon',
  {
    'a13-15-s1': {
      goal: 'Go with Pinocchio to the Fairy’s white house.',
      hint: 'Through the wood, past the Big Oak.',
    },
    'a13-15-s2': { goal: 'Follow the Pigeon to the sea.', hint: 'You take the coast road. Hurry.' },
  },
  [
    sc(
      'a13-15-stone',
      [
        N('Pinocchio runs to the Big Oak. The little white house is gone.'),
        N('There is only grass, and a small white stone with words on it.'),
        P('What does it say? I cannot read. I sold my book.', 'sad'),
        N('You kneel by the stone. Your Nubbin brushes leaves off it.'),
        P('Read it. Please.'),
      ],
      [
        ask(
          4,
          'literacy',
          'first letters: P for Pinocchio',
          'RF.K.2',
          [N('Pinocchio’s name starts with P, p, p. Which word starts with P too?')],
          [
            o('Pear!', [N('Yes! P, p, pear. P, p, Pinocchio.')], true),
            o('Bell.', [N('Bell starts with b. Pear starts with p, like Pinocchio.')]),
          ],
          'Listened for the first letter of Pinocchio’s name: P, like pear.',
        ),
      ],
      {
        choices: [
          {
            id: 'exact',
            label: 'Read it exactly as it is written.',
            then: [
              Y('“Here the girl with blue hair waited for her little brother Pinocchio.”'),
              Y('“He did not come. She went away, missing him.”'),
              N('Pinocchio sits down on the grass, very suddenly.'),
            ],
          },
          {
            id: 'gentle',
            label: 'Read it gently, and say it in small pieces.',
            then: [
              Y('It says she waited for you. Then she had to go away.'),
              P('Read the rest, please.', 'sad'),
              Y('“…and she went away, missing him.”'),
              N('Pinocchio sits down on the grass, very suddenly.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a13-15-stone-done',
      [
        N('He cries all night. The hills cry back in echoes.'),
        P('Little Fairy, come back. Where is Babbo?', 'sad'),
      ],
      [
        ask(
          1,
          'sel',
          'it is all right to cry; hugs and telling someone help',
          'CASEL: Self-awareness',
          [N('Pinocchio is very sad, and he is crying. Is it all right to cry?')],
          [
            o('Yes. Crying is okay.', [N('Yes. Crying lets sadness out. A hug helps too.')], true),
            o('No. Be brave.', [N('Being brave includes crying. It is all right. A hug helps.')]),
          ],
          'Learned that crying is all right and that a hug or telling someone helps.',
        ),
      ],
    ),
    sc(
      'a13-15-pigeon',
      [
        N('In the morning a great Pigeon circles down.'),
        PG('Do you know a puppet called Pinocchio?'),
        P('It is me!'),
        PG('Your babbo is by the sea. He is building a little boat to look for you.'),
        P('Babbo! Can you take me?', 'shock'),
        PG('Climb on my back. Traveller, it is the coast road for you.'),
        N('Off they go over the trees. You walk all day.'),
      ],
      [
        notice(
          1,
          'science',
          'pigeons can find their way home and carry messages',
          'ELOF: Scientific Reasoning',
          [
            N('Real pigeons can find their way home from far away.'),
            N('Long ago, people used them to carry messages.'),
          ],
          'Heard that pigeons find their way home and once carried messages.',
        ),
      ],
    ),
    sc(
      'a13-15-pigeon-done',
      [
        N('At dawn you come out on the shore.'),
        N('A crowd points out to sea. A tiny boat is rowing.'),
        N('Pinocchio is on a rock, waving his cap.'),
      ],
      [
        notice(
          1,
          'social-studies',
          'the shore is where land meets sea; Tuscany’s sea is on its west side',
          'D2.Geo.2.K-2',
          [
            N('The shore is where the land meets the sea.'),
            N('Tuscany is in the middle of Italy. Its sea is on the west side.'),
          ],
          'Learned that the shore is where land meets sea, and that Tuscany’s sea is to the west.',
        ),
      ],
    ),
    sc(
      'a13-15-complete',
      [
        P('Babbo! BABBO! It is me!', 'happy'),
        N('The little old man waves back.'),
        N('A big wave hides the boat from view.'),
        P('I will help him!'),
        N('Pinocchio jumps in. Wood floats, so he swims like a fish.'),
      ],
      [
        doit(
          4,
          'science',
          'wood floats; some things sink',
          '2-PS1-1',
          'edu:sort:float-or-sink:wood',
          [
            N('Wood floats. A stone sinks. Sort these: wood, stone, leaf, key.'),
            N('Floaters: wood and leaf. Sinkers: stone and key.'),
          ],
          'Sorted things into floaters and sinkers and learned that wood floats.',
        ),
      ],
    ),
  ],
);

// ================================================================== A13-16 The Island of Busy Bees
const A16: EduQuest = quest(
  'a13-16',
  'The Island of Busy Bees',
  {
    'a13-16-s1': {
      goal: 'Cross to the island and find Pinocchio.',
      hint: 'A fishing boat will take you. Look for the puppet asking for a penny.',
    },
    'a13-16-s2': {
      goal: 'Help carry the water home.',
      hint: 'Pinocchio takes one can. Your Nubbin tries the other.',
    },
    'a13-16-s3': {
      goal: 'Walk Pinocchio to the island school.',
      hint: 'He has promised. Walk beside him.',
    },
  },
  [
    sc(
      'a13-16-island',
      [
        N('A fishing boat takes you over. This is the Island of Busy Bees.'),
        N('Everyone here is busy. Pinocchio is very hungry.'),
        N('He asks everyone for a penny.'),
        CO('Help me pull my coal cart, and I will give you forty pennies.'),
        P('Pull a cart? I am not a donkey!', 'angry'),
        N('A bricklayer says he can carry bricks for his supper.'),
        P('Bricks are heavy. Look at my arms.'),
      ],
      [
        ask(
          6,
          'social-studies',
          'everybody’s work matters, and we respect people who do it',
          'D2.Civ.8.K-2',
          [N('The coalman and the bricklayer both work hard. Are their jobs important?')],
          [
            o(
              'Yes. Every job helps.',
              [N('Yes! Coal heats homes. Bricks build them. We say thank you to workers.')],
              true,
            ),
            o('No. They are just jobs.', [
              N('Every job helps someone. Coal keeps us warm. Bricks build our homes.'),
            ]),
          ],
          'Talked about why every job matters and why we respect workers.',
        ),
      ],
      {
        choices: [
          {
            id: 'carry',
            label: 'Carry a hod of bricks yourself, to show him.',
            then: [N('You carry them. They are heavy. Your Nubbin carries one brick, proudly.')],
          },
          {
            id: 'tell',
            label: 'Tell him work is not the end of the world.',
            then: [
              P('It is the end of the morning. That is worse.'),
              N('But he watches the coal cart go. He might follow.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a13-16-island-done',
      [N('Along the street comes a little woman, carrying two cans of water.')],
      [
        doit(
          0,
          'maths',
          'count two cans',
          'K.CC.B.5',
          'edu:count:cans:2',
          [N('The woman carries two cans. Count them: one, two.')],
          'Counted two cans of water.',
        ),
      ],
    ),
    sc(
      'a13-16-water',
      [
        P('Good woman, may I have a drink?'),
        WO('Drink. Then carry a can home for me, and I will give you bread.'),
        N('Pinocchio picks up the can. It is as big as he is!'),
        N('Your Nubbin tries the other can. Splash! Into a puddle.'),
        N('At her house, he eats bread and a cream sweet.'),
        P('You have blue hair. Like her. Just like her!', 'shock'),
        N('The little woman only smiles.'),
        P('It is you! You grew up!', 'happy'),
        FY('Then call me mother, if you like.', 'soft'),
      ],
      [
        ask(
          0,
          'science',
          'all living things need water',
          'K-LS1-1',
          [N('Pinocchio drinks water. Who else needs water to live?')],
          [
            o('Plants, animals and people.', [N('Yes! Everything alive needs water.')], true),
            o('Only fish.', [N('Fish need water. So do plants, animals and you!')]),
          ],
          'Learned that all living things need water.',
        ),
      ],
    ),
    sc(
      'a13-16-water-done',
      [
        P('Why did you grow, and I did not? I am the same as the day I was carved.'),
        FY('Puppets do not grow. They stay as they were made.'),
        P('I am tired of being wood! I want to be a boy!', 'sad'),
        FY('You can be. But nobody can earn it for you.', 'soft'),
      ],
      [
        ask(
          3,
          'sel',
          'growing takes time and trying, and nobody can do it for you',
          'CASEL: Self-management',
          [N('Children grow by trying, a little every day. What can you try today?')],
          [
            o(
              'Something new, a little bit.',
              [N('Yes! A little try every day helps us grow.')],
              true,
            ),
            o('Nothing. I will wait.', [
              N('Waiting is fine sometimes. But a little try helps us grow.'),
            ]),
          ],
          'Talked about growing by trying a little each day.',
        ),
      ],
    ),
    sc(
      'a13-16-school',
      [
        P('I will be good. I will go to school.'),
        FY('If you are good, I think you will see Babbo again.'),
        N('Next morning he goes to school. He is the only wooden boy in forty.'),
        N('The boys hang their caps on his nose!'),
        N('He puts up with it for a morning. Then they all like him.'),
        N('The teacher praises him. He is first through the door.'),
      ],
      [
        doit(
          5,
          'literacy',
          'clap the beats in a word: puppet, school, teacher',
          'RF.K.2',
          'edu:clap:syllables:puppet',
          [
            N('Clap the beats in the word puppet: pup-pet. Two claps!'),
            N('School has one clap. Teacher has two: teach-er.'),
          ],
          'Clapped the beats (syllables) in puppet, school and teacher.',
        ),
      ],
    ),
    sc(
      'a13-16-school-done',
      [N('The atlas turns a page. A whole school year goes by. Pinocchio comes top in the tests.')],
      [
        notice(
          0,
          'science',
          'a year has four seasons: spring, summer, autumn, winter',
          'K-ESS2-1',
          [
            N('A school year goes through all four seasons.'),
            N('Spring, summer, autumn, winter. Then spring again.'),
          ],
          'Named the four seasons in order.',
        ),
      ],
    ),
    sc(
      'a13-16-complete',
      [
        FY('I am pleased with you. Go on like this.', 'soft'),
        P('I will. You will see.', 'happy'),
        N('He means it, at the time.'),
        N('Your Nubbin has been to school too. It can sit still for nearly a minute.'),
      ],
      [
        ask(
          3,
          'sel',
          'what helps you sit still and listen',
          'CASEL: Self-management',
          [N('Your Nubbin is learning to sit still. What helps you sit still and listen?')],
          [
            o('A slow breath.', [N('Yes. Breathe in slowly, and out. Try it now.')], true),
            o(
              'Wiggling my toes quietly.',
              [N('That helps too! Little quiet wiggles can keep you calm.')],
              true,
            ),
          ],
          'Practised calm breathing and quiet ways to stay still.',
        ),
      ],
    ),
  ],
);

// ================================================================== A13-17 The Dog-fish Trick
const A17: EduQuest = quest(
  'a13-17',
  'The Dog-fish Trick',
  {
    'a13-17-s1': {
      goal: 'Go down to the beach with Pinocchio and the schoolboys.',
      hint: 'Keep up. They are running.',
    },
    'a13-17-s2': {
      goal: 'Keep clear of the fight on the beach.',
      hint: 'You cannot stop it. Watch the books.',
    },
    'a13-17-s3': { goal: 'Get Alidoro out of the sea.', hint: 'Wade in from the shallows.' },
    'a13-17-s4': {
      goal: 'Find Pinocchio along the shore.',
      hint: 'Look for smoke coming out of a cave.',
    },
  },
  [
    sc(
      'a13-17-lure',
      [
        SB('Pinocchio! The Terrible Dog-fish is on the beach! Come and see!'),
        P('After school. We will go after school.'),
        SB('After school he will be gone!'),
        N('The boys are already running.'),
        N('Pinocchio looks at the school. Then at the road to the sea.'),
      ],
      [
        ask(
          4,
          'sel',
          'it is all right to say no when friends push you to break a promise',
          'CASEL: Relationship skills',
          [N('The boys want Pinocchio to skip school. What can he say?')],
          [
            o(
              'No, thank you. I will go after school.',
              [N('Yes! Saying no kindly takes courage.')],
              true,
            ),
            o('Yes, let us go.', [
              N('That is what he does. But we can say no kindly, and keep a promise.'),
            ]),
          ],
          'Practised saying no kindly when friends push you.',
        ),
      ],
      {
        choices: [
          {
            id: 'school',
            label: 'Tell him: school first, the beach after.',
            then: [
              P('After! Everything is after!', 'angry'),
              N('He runs. You follow, because somebody should.'),
            ],
          },
          {
            id: 'go',
            label: 'Go with him. You want to see the Dog-fish too.',
            then: [N('You go. It is a silly idea. The sun is out.')],
          },
        ],
      },
    ),
    sc(
      'a13-17-lure-done',
      [
        N('At the beach the sea is flat and empty, smooth as a plate.'),
        N('There is no Dog-fish. There never was.'),
      ],
      [
        ask(
          1,
          'science',
          'wind makes waves on the sea',
          'K-ESS2-1',
          [N('The sea is flat today. What makes waves on the sea?')],
          [
            o('Wind.', [N('Yes! Wind blows over the water and makes waves.')], true),
            o('Fish.', [N('Big fish can make ripples. But most waves come from wind.')]),
          ],
          'Learned that wind makes waves on the sea.',
        ),
      ],
    ),
    sc(
      'a13-17-fight',
      [
        SB('Ha! You came! You make us look bad, being good.', 'happy'),
        N('Somebody pushes somebody. Soon there is a fight.'),
        N('They throw their school books. The books splash into the sea.'),
        N('The fish nibble a page and swim off.'),
        N('A big book hits a boy called Eugene on the head. He sits down.'),
        N('Everyone runs. Except Pinocchio. He wets his hanky in the sea for Eugene’s head.'),
      ],
      [
        ask(
          5,
          'social-studies',
          'a kind rule: hands are for helping, books are for reading',
          'D2.Civ.8.K-2',
          [N('The boys threw books. What is a kind rule for hands and books?')],
          [
            o(
              'Hands are for helping.',
              [N('Yes! Hands help. Books are for reading, not throwing.')],
              true,
            ),
            o('Throw the books.', [
              N('Throwing can hurt someone. Hands are for helping. Books are for reading.'),
            ]),
          ],
          'Talked about a kind rule: hands are for helping.',
        ),
      ],
    ),
    sc(
      'a13-17-fight-done',
      [
        EU('Ow. Who threw the sums?'),
        N('Eugene sits up. He has a bump like half an egg. He is all right.'),
        N('Two carabineers come down the beach. They see a wooden boy and a book.'),
        N('Pinocchio runs. They let their dog off after him.'),
      ],
      [
        ask(
          1,
          'health',
          'a cold cloth helps a bump; tell a grown-up if you bump your head',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('Eugene has a bump on his head. What helps? And who do you tell?')],
          [
            o(
              'A cold cloth, and tell a grown-up.',
              [N('Yes! A cool cloth helps, and a grown-up should always know.')],
              true,
            ),
            o('Nothing. Keep playing.', [
              N('A bump on the head needs a rest. A cool cloth helps, and tell a grown-up.'),
            ]),
          ],
          'Learned that a cold cloth helps a bump, and that we tell a grown-up about a bump on the head.',
        ),
      ],
    ),
    sc(
      'a13-17-alidoro',
      [
        N('The dog is a big mastiff called Alidoro.'),
        N('Pinocchio throws himself into the sea. Alidoro goes in after him.'),
        N('Alidoro cannot swim. Splash, glug, splash!'),
        AL('Help! Pinocchio! Save me!', 'shock'),
        P('If I save you, will you promise not to chase me?'),
        AL('I promise! Anything!'),
      ],
      [
        doit(
          2,
          'literacy',
          'sound words: splash, glug, plop',
          'RL.2.4',
          'edu:say:sound-words:splash',
          [
            N('Splash! Glug! Plop! Those are sound words.'),
            N('Say them in a big voice, then a small voice.'),
          ],
          'Said sound words: splash, glug and plop.',
        ),
      ],
    ),
    sc(
      'a13-17-alidoro-done',
      [
        N('Pinocchio swims back and catches Alidoro by the tail.'),
        N('You wade in and take the other end. Out comes the dog, like a wet carpet.'),
        AL('You saved me. I do not forget a thing like that.', 'soft'),
        N('He shakes himself all over you, and trots off home.'),
      ],
      [
        ask(
          3,
          'sel',
          'kindness often finds its way back to you',
          'CASEL: Social awareness',
          [N('Pinocchio helped the dog who chased him. What do you think the dog feels?')],
          [
            o('Thankful.', [N('Yes! Thankful. Kindness often finds its way back to you.')], true),
            o('Cross.', [
              N('He was in trouble. Now he is thankful. Kindness often finds its way back to you.'),
            ]),
          ],
          'Talked about being thankful, and about kindness finding its way back to you.',
        ),
      ],
    ),
    sc(
      'a13-17-fisher',
      [
        N('Round the point there is a cave with smoke in it.'),
        N('A fisherman is frying fish. He is green all over, even his beard!'),
        N('He has a net of fish. In the middle is Pinocchio.'),
        GF('Mullet, in the pan. Bream, in the pan. And what are you?', 'happy'),
        P('I am a puppet!'),
        N('He rolls Pinocchio in flour from head to foot.'),
        P('I am not a fish! Fish do not wear shoes!', 'shock'),
      ],
      [
        notice(
          5,
          'science',
          'flour is made by grinding grains like wheat; bread is made from flour',
          'ELOF: Scientific Reasoning',
          [
            N('Flour is made from grains, like wheat. People grind the grains to a soft powder.'),
            N('Then bakers use flour to make bread.'),
          ],
          'Learned that flour is ground from grains like wheat and is used to bake bread.',
        ),
      ],
    ),
    sc(
      'a13-17-fisher-done',
      [
        N('A big dog bounds into the cave. It is Alidoro, dry now.'),
        N('He gently takes Pinocchio in his teeth, and is gone.'),
        AL('Now we are even.', 'happy'),
      ],
      [
        ask(
          2,
          'maths',
          'even means the same: one rescue each',
          'K.CC.C.6',
          [
            N('Pinocchio saved Alidoro. Alidoro saved Pinocchio. One rescue each.'),
            N('Is that more for one, or the same?'),
          ],
          [
            o('The same. We are even.', [N('Yes! One and one. The same. Even!')], true),
            o('More for Pinocchio.', [
              N('One rescue each. That is the same, and that is what even means.'),
            ]),
          ],
          'Compared two groups and found them equal: even.',
        ),
      ],
    ),
    sc(
      'a13-17-complete',
      [
        N('Pinocchio goes to the Fairy’s house, floury as a loaf.'),
        N('The Snail who keeps the door looks out of the top window.'),
        N('It takes her nine hours to come down! Pinocchio falls asleep on the step.'),
        FY('Tomorrow you will stop being a puppet. You will be a boy.', 'soft'),
        P('Tomorrow? Really? I will invite everybody!', 'happy'),
      ],
      [
        notice(
          2,
          'science',
          'snails are slow because they glide on one muscly foot over a trail of slime',
          'ELOF: Scientific Reasoning',
          [
            N('Snails are slow. They glide on one soft foot.'),
            N('A trail of slime helps them slide. See the shiny path?'),
          ],
          'Learned that a snail glides on one foot over a trail of slime.',
        ),
      ],
    ),
  ],
);

// ================================================================== A13-18 The Land of Toys
const A18: EduQuest = quest(
  'a13-18',
  'The Land of Toys',
  {
    'a13-18-s1': {
      goal: 'Go with Pinocchio to invite his friends.',
      hint: 'The last one on his list is the hardest to find.',
    },
    'a13-18-s2': {
      goal: 'Find Pinocchio in the Land of Toys.',
      hint: 'Look anywhere there is noise.',
    },
    'a13-18-s3': {
      goal: 'Stay near Pinocchio in the circus ring.',
      hint: 'Watch the lady in the box above the ring.',
    },
  },
  [
    sc(
      'a13-18-candlewick',
      [
        N('The last friend on the list is Candlewick, thin and pale as a candle.'),
        N('You find him at midnight, in a doorway, with a bundle.'),
        CW2('I am going to the Land of Toys! No schools. No books. Just holidays.', 'happy'),
        P('I cannot. I promised the Fairy.'),
        N('A silent coach comes down the road, pulled by donkeys in white boots.'),
        N('A Little Man drives it. He is as round and shiny as butter.'),
        LM('Climb up, my dears. There is always room, for boys.', 'happy'),
      ],
      [
        ask(
          6,
          'sel',
          'play and learning both matter; a good day has some of each',
          'CASEL: Responsible decision-making',
          [N('The Land of Toys has only play. What is a good day made of?')],
          [
            o(
              'Some play, and some learning.',
              [N('Yes! Play is great, and learning helps us grow. A good day has both.')],
              true,
            ),
            o('Only play.', [
              N('Play is wonderful. But a bit of learning and rest makes a good day.'),
            ]),
          ],
          'Talked about balance: a good day has play, learning and rest.',
        ),
      ],
      {
        choices: [
          {
            id: 'coat',
            label: 'Remind him of the coat Geppetto sold.',
            then: [
              P('That was ages ago! I will only stay a day.', 'angry'),
              N('He climbs up anyway.'),
            ],
          },
          {
            id: 'hand',
            label: 'Take his hand and turn him towards home.',
            then: [N('He lets you for three steps. Then he runs, and climbs up.')],
          },
        ],
      },
    ),
    sc(
      'a13-18-candlewick-done',
      [
        N('One donkey turns its head and speaks, very low.'),
        N('Poor boy, it says. Take care.'),
        N('The coach rolls away without a sound. You run after it all night.'),
      ],
      [
        notice(
          0,
          'science',
          'a donkey is a farm animal with long ears that carries loads',
          'ELOF: Scientific Reasoning',
          [
            N('A donkey is a farm animal with long ears. Donkeys carry loads and pull carts.'),
            N('They are gentle and strong.'),
          ],
          'Learned that a donkey is a strong farm animal with long ears.',
        ),
      ],
    ),
    sc(
      'a13-18-toys',
      [
        N('The Land of Toys is boys, boys, boys. Playing, shouting, stilt-walking.'),
        N('On the walls, in chalk, it says LONG LIF TOYS.'),
        N('Pinocchio is laughing so hard he holds a lamp-post.'),
        P('Isn’t it wonderful?', 'happy'),
        N('Your Nubbin finds paper donkey ears and wears them.'),
        N('The atlas turns its pages. Five months go by, all holidays.'),
      ],
      [
        doit(
          5,
          'maths',
          'count to five: five months',
          'K.CC.A.1',
          'edu:count:months:5',
          [N('Five months of holidays. Count on your hand: one, two, three, four, five.')],
          'Counted five months on one hand.',
        ),
      ],
    ),
    sc(
      'a13-18-toys-done',
      [
        N('One morning Pinocchio wakes with long, hairy ears.'),
        N('The Marmot upstairs shakes her head.'),
        MA('Donkey fever. Soon you will be a donkey.', 'sad'),
      ],
      [
        ask(
          1,
          'literacy',
          'describing words for how things feel: soft, hairy, long',
          'RL.1.4',
          [N('Pinocchio’s new ears are long and hairy. What do donkey ears feel like?')],
          [
            o('Soft and hairy.', [N('Yes! Soft and hairy. Good describing words.')], true),
            o('Hard and bumpy.', [
              N('Donkey ears are soft and hairy. Hard and bumpy is like a stone.'),
            ]),
          ],
          'Used describing words for how things feel: soft, hairy, long.',
        ),
      ],
    ),
    sc(
      'a13-18-circus',
      [
        N('Candlewick has the ears too. Soon they are both donkeys.'),
        N('The Little Man sells them. That was always his business.'),
        N('Pinocchio goes to a circus. He has to jump through hoops.'),
        N('A lady in a box has a locket with a puppet’s picture.'),
        N('He tries to call to her. Out comes a bray!'),
        N('Your Nubbin’s paper ears flap. It brays too, very small.'),
        N('Then the laughing stops. The tent goes quiet.', 'sad'),
        N('He catches his leg on a hoop. After that, he limps.'),
        N('A drum-maker buys him. He lowers the donkey into the sea on a rope.'),
      ],
      [
        doit(
          2,
          'maths',
          'a hoop is a circle; find circles around you',
          'K.G.A.2',
          'edu:tap:shape:circle',
          [
            N('The circus hoop is a circle. A circle is round, with no corners.'),
            N('Can you find a circle near you? A plate? A wheel?'),
          ],
          'Named a circle and found circles in everyday things.',
        ),
      ],
    ),
    sc(
      'a13-18-sea',
      [...SEA],
      [
        notice(
          4,
          'health',
          'sea water is too salty to drink',
          'ELOF: Perceptual, Motor, and Physical Development',
          [
            N('Sea water is very salty. We must never drink it.'),
            N('Fresh water from a tap or a cup is for drinking.'),
          ],
          'Learned that sea water is too salty to drink.',
        ),
      ],
    ),
    sc(
      'a13-18-complete',
      [
        N('The drum man lends you his boat. You row out, with your Nubbin in the bow.'),
        N('Ahead, Pinocchio swims for a white rock. A little goat with blue wool bleats at him.'),
        N('Behind him, the sea rises. A great head comes out, with a mouth like a cave.'),
        N(
          'It is the Terrible Dog-fish. It breathes in. In goes Pinocchio, and in goes the sea. In go you!',
        ),
        N('Gulp! Everything goes dark.'),
      ],
      [
        notice(
          5,
          'science',
          'a dog-fish is a kind of shark; the biggest shark eats only tiny food',
          'ELOF: Scientific Reasoning',
          [
            N(
              'A dog-fish is a kind of shark. Real dog-fish are small, as long as a grown-up’s arm.',
            ),
            N('The biggest shark is as long as a bus. It eats only tiny sea creatures!'),
          ],
          'Heard that a dog-fish is a small shark, and that the biggest shark eats tiny food.',
        ),
      ],
    ),
  ],
);

// ================================================================== A13-19 The Terrible Dog-fish
const A19: EduQuest = quest(
  'a13-19',
  'The Terrible Dog-fish',
  {
    'a13-19-s1': {
      goal: 'Find your way through the dark inside the Dog-fish.',
      hint: 'Follow the faint light, far off.',
    },
    'a13-19-s2': {
      goal: 'Go to the old man at the table.',
      hint: 'You know who it is. Let Pinocchio go first.',
    },
    'a13-19-s3': {
      goal: 'Light the way to the Dog-fish’s mouth.',
      hint: 'Your Nubbin carries the candle. Walk softly.',
    },
  },
  [
    sc(
      'a13-19-belly',
      [
        N('It is dark and wet in here. It smells of fried fish.'),
        P('Help! Is anyone here?', 'shock'),
        TU('Only us unfortunates.'),
        TU('I am a Tunny. I was swallowed too.'),
        P('I am a puppet. And that is a traveller, and a Nubbin.'),
        N('Far away, down the dark, there is a little light.'),
      ],
      [
        ask(
          5,
          'science',
          'we need light to see',
          '1-PS4-2',
          [N('It is very dark inside. Why can we see the little light far away?')],
          [
            o(
              'Because it is a light in the dark.',
              [N('Yes! We see things when there is light.')],
              true,
            ),
            o('Because it is loud.', [N('Light is not a sound. We see because of light.')]),
          ],
          'Learned that we can see because of light.',
        ),
      ],
      {
        choices: [
          {
            id: 'light',
            label: 'Head for the light.',
            then: [N('You start towards it. Your Nubbin goes first. It has the best eyes.')],
          },
          {
            id: 'how',
            label: 'Ask the Tunny how big the Dog-fish is.',
            then: [
              TU('Very big. I never counted the tail.'),
              N('You decide to head for the light.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a13-19-belly-done',
      [
        N('The light is a candle, stuck in a green glass bottle.'),
        N('At the table sits an old man, white as snow. He is eating a tiny fish.'),
      ],
      [
        doit(
          1,
          'maths',
          'count the things on the table',
          'K.CC.B.5',
          'edu:count:table-things:3',
          [N('On the table: a candle, a bottle, a fish. Count them: one, two, three.')],
          'Counted three things on a table.',
        ),
      ],
    ),
    sc(
      'a13-19-babbo',
      [
        N('Pinocchio stops. He shakes all over.'),
        P('Babbo! It is you! I will never leave you again!', 'happy'),
        G('Pinocchio? My Pinocchio?', 'shock'),
        N('Pinocchio hugs him, and talks, and cries, all at once.'),
        G('Hush. You are here.', 'soft'),
        G('This is my last candle. When it goes out, we are in the dark.', 'sad'),
        P('Then we must get out. I can swim. I am wood. I will carry you.'),
      ],
      [
        ask(
          3,
          'sel',
          'naming a feeling: relief and joy when you find someone you missed',
          'CASEL: Self-awareness',
          [N('Pinocchio found his babbo. How does he feel?')],
          [
            o(
              'Happy, and relieved.',
              [N('Yes! Happy and relieved. Both feelings together.')],
              true,
            ),
            o('Cross.', [N('Not cross. Look, he is hugging him. Happy and relieved.')]),
          ],
          'Named the feelings of joy and relief at finding someone you missed.',
        ),
      ],
    ),
    sc(
      'a13-19-babbo-done',
      [
        G('Ciao, traveller. You came all this way.', 'soft'),
        N('Your Nubbin climbs on his shoulder. He laughs for the first time in two years.'),
      ],
      [
        notice(
          0,
          'literacy',
          'ciao is an Italian word for hello and goodbye',
          'L.2.4',
          [
            N('Geppetto says ciao. It is an Italian word for hello and for goodbye.'),
            N('Say it with me: chow!'),
          ],
          'Learned the Italian word ciao, for hello and goodbye.',
        ),
      ],
    ),
    sc(
      'a13-19-mouth',
      [
        N('Your Nubbin carries the candle in its green bottle.'),
        N('The Dog-fish is very old. It sleeps with its mouth open.'),
        N('Past its teeth you can see a piece of sky full of stars.'),
        N('You climb over the soft tongue, quietly.'),
        P('Babbo, climb on my back. Hold on tight.'),
        N('Achoo! The Dog-fish sneezes, and you tumble back down.'),
        N('You try again, very quietly. Then you all jump into the sea.'),
      ],
      [
        notice(
          2,
          'science',
          'stars are far-away suns that we see at night',
          '1-ESS1-1',
          [
            N('Look! Stars! Stars are suns, very far away.'),
            N('We only see them at night, when our side of the Earth is dark.'),
          ],
          'Heard that stars are far-away suns that we see at night.',
        ),
      ],
    ),
    sc(
      'a13-19-mouth-done',
      [
        N('Pinocchio swims and swims. The shore is far, and the water is cold.'),
        P('Babbo, I cannot. I am going under.', 'sad'),
        TU('Who is going under?'),
        N('It is the Tunny! He swims up beneath them both, like a boat.'),
      ],
      [
        ask(
          3,
          'sel',
          'asking for help, and helping, when someone is tired',
          'CASEL: Relationship skills',
          [N('Pinocchio is too tired. What can he do?')],
          [
            o('Ask for help.', [N('Yes! Asking for help is brave. And the Tunny came.')], true),
            o('Try even harder alone.', [
              N('Trying is good. But when we are too tired, we ask for help.'),
            ]),
          ],
          'Talked about asking for help when you are tired and trying alone is too much.',
        ),
      ],
    ),
    sc(
      'a13-19-complete',
      [N('The Tunny carries them to shore. You swim beside him.'), ...THANKS, ...CANDLE],
      [
        doit(
          4,
          'literacy',
          'say thank you in Italian: grazie',
          'L.2.4',
          'edu:say:word:grazie',
          [
            N('Pinocchio could not find a big enough word. In Italian, thank you is grazie.'),
            N('Say it: GRAHT-see-eh. Grazie, Tunny!'),
          ],
          'Said thank you in Italian: grazie.',
        ),
      ],
    ),
  ],
);

// ================================================================== A13-20 The Wheel and the Chair
const A20: EduQuest = quest(
  'a13-20',
  'The Wheel and the Chair',
  {
    'a13-20-s1': {
      goal: 'Walk with Pinocchio and Geppetto, and find shelter.',
      hint: 'Go slowly. Somebody is begging by the road.',
    },
    'a13-20-s2': {
      goal: 'Stand by Pinocchio while he speaks to the Talking-cricket.',
      hint: 'Let him say it himself.',
    },
    'a13-20-s3': {
      goal: 'Help Pinocchio earn a glass of milk at the water-wheel.',
      hint: 'A hundred buckets for one glass. Count with him.',
    },
    'a13-20-s4': {
      goal: 'Keep Pinocchio company through the winter.',
      hint: 'He works every day now. The pennies are for a new coat.',
    },
  },
  [
    sc(
      'a13-20-road',
      [
        N('Geppetto can hardly stand. You walk slowly up the road.'),
        N('By the road sit a thin Fox with no tail, and a Cat.'),
        N('The Cat cannot see now. Really cannot.'),
        FX('Oh, Pinocchio! Have pity on two poor creatures!', 'sad'),
        P('Goodbye, you cheats. You fooled me once. You will not fool me twice.', 'angry'),
        N('He walks on, holding his babbo up.'),
      ],
      [
        ask(
          5,
          'sel',
          'you can be kind and careful at the same time',
          'CASEL: Social awareness',
          [
            N(
              'The Fox and Cat tricked Pinocchio. Now they are hungry. What could kindness look like?',
            ),
          ],
          [
            o(
              'Share a little, and stay careful.',
              [N('Yes. You can be kind and careful together.')],
              true,
            ),
            o('Walk by without a word.', [
              N('Walking on is safe. Kindness might share a little, and stay careful.'),
            ]),
          ],
          'Talked about being kind and careful at the same time.',
        ),
      ],
      {
        choices: [
          {
            id: 'crust',
            label: 'Give the Cat a crust from your pocket.',
            set: { 'a13-crust': 'given' },
            then: [
              N('You put a crust in the Cat’s paw. You say nothing.'),
              CT('Thank you, Pinocchio. You were always the kind one.', 'soft'),
              N('Pinocchio’s ears go red. Nobody says anything.'),
            ],
          },
          {
            id: 'walk',
            label: 'Walk on with Pinocchio.',
            set: { 'a13-crust': 'kept' },
            then: [N('You walk on. Behind you, the Fox says it was only the wind.')],
          },
        ],
      },
    ),
    sc(
      'a13-20-road-done',
      [
        N('At the end of a lane is a little straw hut.'),
        N('A sign on the door says PULL THE CORD. So Pinocchio does.'),
        N('Inside, on a beam, sits the Talking-cricket.'),
      ],
      [
        doit(
          1,
          'literacy',
          'signs tell us what to do: pull the cord',
          'ELOF: Literacy',
          'edu:read:sign:pull-the-cord',
          [
            N('A sign has words that tell us what to do. This one says PULL.'),
            N('Where else do you see signs? On a road? A shop?'),
          ],
          'Talked about signs and how words on them tell us what to do.',
        ),
      ],
    ),
    sc(
      'a13-20-hut',
      [...HUT],
      [
        ask(
          6,
          'literacy',
          'how a character changes: the mallet then, sorry now',
          'RL.2.3',
          [N('At first Pinocchio threw a mallet at the cricket. What does he do now?')],
          [
            o(
              'He says sorry.',
              [N('Yes! He has changed. Saying sorry is hard, and he did it.')],
              true,
            ),
            o('He throws another.', [N('He does not! He has grown kinder. He says sorry.')]),
          ],
          'Noticed how a character changes from the start of a story to the end.',
        ),
      ],
    ),
    sc(
      'a13-20-hut-done',
      [
        N('Pinocchio lays his babbo on the straw. Geppetto is so weak he can only smile.'),
        P('Milk. He needs milk. I will get him some.'),
      ],
      [
        notice(
          1,
          'science',
          'milk comes from animals like cows and goats',
          'ELOF: Scientific Reasoning',
          [
            N('Milk comes from animals, like cows and goats.'),
            N('Milk is a good drink to help us grow strong.'),
          ],
          'Learned that milk comes from animals like cows and goats.',
        ),
      ],
    ),
    sc(
      'a13-20-wheel',
      [
        N('The gardener, Giangio, has milk at a penny a glass. Pinocchio has no penny.'),
        GI('Then turn my water-wheel. A hundred buckets, and you can have a glass.'),
        N('Pinocchio turns the wheel and you count. Ten, twenty, thirty!'),
        N('At a hundred buckets he is wet right through.'),
        GI('My donkey turned that wheel before. He is very old and tired.'),
        N('In the stable, a donkey lies on straw. He opens his eyes.'),
        CW2('Pinocchio. It is me. Candlewick.', 'soft'),
        P('Candlewick! Oh, Candlewick.', 'sad'),
        N('Candlewick puts his head in Pinocchio’s lap. Then Candlewick dies.'),
        N('That means his body stopped working, and it will not start again. It did not hurt.'),
      ],
      [
        doit(
          2,
          'maths',
          'count to 100 by tens',
          'K.CC.A.1',
          'edu:count:by-tens:100',
          [
            N('Count with Pinocchio by tens. Ten, twenty, thirty, forty, fifty.'),
            N('Sixty, seventy, eighty, ninety, one hundred!'),
          ],
          'Counted by tens up to one hundred.',
        ),
      ],
    ),
    sc(
      'a13-20-wheel-done',
      [
        GI('Why cry over a donkey?'),
        P('He was my friend. We sat at the same desk.', 'sad'),
        N('Your Nubbin sits by his head. So do you, for a while.'),
        N('Being sad is all right. Remembering him is a way to love him still.'),
      ],
      [
        ask(
          3,
          'sel',
          'sadness when a friend dies is allowed; sitting together and remembering help',
          'CASEL: Self-awareness',
          [N('Pinocchio is very sad about his friend. What helps when we are sad?')],
          [
            o(
              'Sit with a friend, and remember him.',
              [N('Yes. Sitting together and remembering helps.')],
              true,
            ),
            o('Pretend we are not sad.', [N('Sad is allowed. A hug and a memory help more.')]),
          ],
          'Talked about feeling sad when a friend dies, and what helps.',
        ),
      ],
    ),
    sc(
      'a13-20-coat',
      [
        N('The atlas turns its pages slowly now.'),
        N('Pinocchio turns the wheel every morning, and weaves rush baskets every evening.'),
        N('He looks after Geppetto as if Geppetto were the puppet.'),
        N('He saves forty pennies in a jar. That is a new coat.'),
        N('One morning, a Snail crosses the road to him. It takes a while.'),
        SN('Pinocchio. I kept the Fairy’s door. She is very poorly now, and has nothing.', 'sad'),
        N('He tips out the jar. Every penny goes to the Snail.'),
        P('Take her this. I do not need a coat. It was too warm anyway.', 'soft'),
        SN('I will go as fast as I can.', 'happy'),
      ],
      [
        ask(
          3,
          'social-studies',
          'saving means keeping some money for later; giving is another choice',
          'D2.Eco.1.K-2',
          [N('Pinocchio saved pennies in a jar. What is saving?')],
          [
            o(
              'Keeping some for later.',
              [N('Yes! And he chose to give his savings away. That is a kind choice.')],
              true,
            ),
            o('Spending it all now.', [
              N('Spending is fun. Saving keeps some for later, as he did.'),
            ]),
          ],
          'Learned that saving means keeping some for later, and thought about giving.',
        ),
      ],
    ),
    sc(
      'a13-20-coat-done',
      [
        N('That night Pinocchio dreams of the Fairy, smiling and well.'),
        N('She tells him his good heart has made up for everything.'),
        N('In the morning, he wakes up.'),
      ],
      [
        ask(
          1,
          'sel',
          'giving can make us feel warm inside',
          'CASEL: Self-awareness',
          [N('Pinocchio gave away his coat money. How does it feel to give something kind?')],
          [
            o('Warm inside.', [N('Yes! Giving can feel warm, even when we have less.')], true),
            o('Sad.', [N('Sometimes a little. But often giving feels warm inside.')]),
          ],
          'Talked about the warm feeling that giving can bring.',
        ),
      ],
    ),
    sc(
      'a13-20-complete',
      [
        ...WAKE,
        N('Your Nubbin climbs into the old puppet’s lap and curls up, nose to tail.'),
        G('Leave it. The little Nubbin likes it.', 'soft'),
        ...HOME,
      ],
      [
        doit(
          8,
          'literacy',
          'tell a story in order: first, next, last',
          'RL.K.3',
          'edu:order:story:pinocchio',
          [
            N('Tell the story in order. First: a piece of wood. Next: a puppet. Last: a boy.'),
            N('Can you tell your grown-up what happened in the middle?'),
          ],
          'Retold the story in order: first, next, last.',
        ),
      ],
    ),
  ],
);

// ================================================================== variants
/** Sprout versions of every scene in A13_VARIANTS. */
export const EDU_A13_SPROUT_VARIANTS: EduScene[] = [
  // ------------------------------------------------ A13-1 step 1 scene, with Clank
  sc(
    'a13-01-page-clank',
    [
      ...PAGE,
      N('The ink turns to rain. You, your Nubbin and Clank get wet.'),
      CK('Announcement: it is steps! This whole country is made of steps!', 'shock'),
      N('Clank unfolds a ramp that Byte made. It has three boards.'),
      CK('Unfold, roll, fold up. Byte made me practise forty times.'),
      N('One door is open, with sawdust on the step. In you go.'),
      MC('Come in! Shut the weather out. And bring your… kettle?'),
      CK('Announcement: I am Clank! I am a guest! I love it!', 'happy'),
      ...LOG,
    ],
    [
      notice(
        4,
        'science',
        'a ramp is a way to solve the problem of steps',
        'K-2-ETS1-1',
        [
          N('Steps are a problem for wheels. A ramp is a clever answer.'),
          N('A ramp is a smooth slope. Wheels can roll up it!'),
        ],
        'Heard that a ramp can solve the problem that steps make for wheels.',
      ),
    ],
  ),
  // ------------------------------------------------ A13-5 step 3 done, with Clank
  sc(
    'a13-05-coat-clank',
    [
      ...COAT,
      CK('He sold his coat. For a puppet that kicked his nose.', 'think'),
      CK('Is that a job?'),
      Y('No. It is not a job.'),
      N('Clank’s chimney-light flickers. He is thinking about it.'),
    ],
    [
      ask(
        6,
        'sel',
        'people do loving things because they care, not because it is a job',
        'CASEL: Social awareness',
        [N('Clank asks: is it a job? Why did Geppetto sell his coat?')],
        [
          o(
            'Because he loves Pinocchio.',
            [N('Yes. Love is not a job. It is something we do for someone we care about.')],
            true,
          ),
          o('Because it was a job.', [
            N('Not a job. Nobody paid him. He did it because he cared.'),
          ]),
        ],
        'Talked about doing loving things because we care, not because it is a job.',
      ),
    ],
  ),
  // ------------------------------------------------ A13-10 step 2 done, you carried the cricket
  sc(
    'a13-10-doctors-done-carried',
    [
      ...LEAVE,
      N('At the door he stops. He nods to you. A small, neat nod.'),
      N('Then he goes down the stairs.'),
    ],
    [
      ask(
        2,
        'sel',
        'a nod can say thank you without words',
        'CASEL: Social awareness',
        [N('The cricket nods to you. What is he saying, without any words?')],
        [
          o('Thank you.', [N('Yes! A nod, a smile or a wave can say thank you.')], true),
          o('Go away.', [N('He is saying thank you, for the hedge. A nod can say a lot.')]),
        ],
        'Noticed that a nod or a smile can say thank you.',
      ),
    ],
  ),
  // ------------------------------------------------ A13-18 step 3 done, you carried the cricket
  sc(
    'a13-18-sea-carried',
    [
      ...SEA,
      N('He swims under your rock and looks up.'),
      P('Your cricket was right. I did grow up a donkey.', 'sad'),
      P('Do not tell him I said so.'),
    ],
    [
      ask(
        5,
        'sel',
        'saying “I was wrong” is brave',
        'CASEL: Self-awareness',
        [N('Pinocchio says the cricket was right. Is it hard to say “I was wrong”?')],
        [
          o('Yes, but it is brave.', [N('Yes! Saying “I was wrong” takes courage.')], true),
          o('No, it is easy.', [N('For most of us, it is hard. That is why it is so brave.')]),
        ],
        'Talked about how brave it is to say “I was wrong”.',
      ),
    ],
  ),
  // ------------------------------------------------ A13-19 step 1 scene, with Clank
  sc(
    'a13-19-belly-clank',
    [
      N('It is dark and wet in here. It smells of fried fish.'),
      P('Help! Is anyone here?', 'shock'),
      TU('Only us unfortunates.'),
      CK('Announcement: we have been eaten!', 'shock'),
      CK('I have a ramp. There is no door. That is a problem.'),
      TU('Please. Be dignified. We are in a fish.'),
      TU('I am a Tunny. I was swallowed too.'),
      P('I am a puppet. And that is a traveller, and a Nubbin.'),
      N('Far away, down the dark, there is a little light.'),
    ],
    [
      ask(
        8,
        'science',
        'we need light to see',
        '1-PS4-2',
        [N('It is very dark inside. Why can we see the little light far away?')],
        [
          o(
            'Because it is a light in the dark.',
            [N('Yes! We see things when there is light.')],
            true,
          ),
          o('Because it is loud.', [N('Light is not a sound. We see because of light.')]),
        ],
        'Learned that we can see because of light.',
      ),
    ],
    {
      choices: [
        {
          id: 'light',
          label: 'Head for the light.',
          then: [N('You start towards it. Your Nubbin goes first. It has the best eyes.')],
        },
        {
          id: 'how',
          label: 'Ask the Tunny how big the Dog-fish is.',
          then: [TU('Very big. I never counted the tail.'), N('You decide to head for the light.')],
        },
      ],
    },
  ),
  // ------------------------------------------------ A13-19 complete, with Clank
  sc(
    'a13-19-complete-clank',
    [
      N('The Tunny carries them to shore. Clank rides on his back.'),
      ...THANKS,
      N('Clank looks at Pinocchio. Something inside him clicks.'),
      CK('He does not have the word either.', 'soft'),
      CK('Nobody put it in him.'),
      ...CANDLE,
    ],
    [
      doit(
        1,
        'science',
        'metal sinks and wood floats, so Clank rides on the Tunny',
        '2-PS1-1',
        'edu:sort:float-or-sink:kettle',
        [
          N('Clank is metal. Metal kettles sink. So he rides the Tunny!'),
          N('Sort: wood floats, kettle sinks, leaf floats, stone sinks.'),
        ],
        'Sorted things into floaters and sinkers, including a metal kettle.',
      ),
    ],
  ),
  // ------------------------------------------------ A13-20 step 2 scene, you carried the cricket
  sc(
    'a13-20-hut-carried',
    [
      ...HUT,
      CR('And thank your friend for the hedge.', 'soft'),
      N('He settles on his beam, and looks at you. That is plenty.'),
    ],
    [
      ask(
        7,
        'sel',
        'saying thank you to someone who helped us',
        'ELOF: Social and Emotional Development',
        [N('The cricket says thank you to you, for the hedge. Who helped you this week?')],
        [
          o(
            'Someone helped me. I can say thank you.',
            [N('Yes! Say thank you, or draw a picture for them.')],
            true,
          ),
          o('Nobody helped me.', [
            N('Think again. A grown-up, a friend, a pet. Someone helps us every day.'),
          ]),
        ],
        'Thought about who helped them this week and how to say thank you.',
      ),
    ],
  ),
  // ------------------------------------------------ A13-20 complete, with Clank
  sc(
    'a13-20-complete-clank',
    [
      ...WAKE,
      N('Clank rolls down his ramp. He parks beside the old puppet.'),
      N('He does not say anything about it.'),
    ],
    [
      ask(
        9,
        'sel',
        'sitting quietly beside someone is a way to care',
        'ELOF: Social and Emotional Development',
        [N('Clank sits beside the old puppet, saying nothing. Is that kind?')],
        [
          o('Yes. Being close is kind.', [N('Yes! Sitting close shows we care.')], true),
          o('No. He should talk.', [
            N('We do not have to talk. Sitting close can be the kindest thing.'),
          ]),
        ],
        'Talked about sitting quietly beside someone as a way to show we care.',
      ),
    ],
  ),
  // ------------------------------------------------ Clank’s word
  sc('a13-20-word', [...WORD_A, ...WORD_B, ...HOME], [LOVE_LESSON]),
  // ------------------------------------------------ Clank’s word, after S25
  sc(
    'a13-20-word-next-door',
    [
      ...WORD_A,
      ...WORD_B,
      ...HOME,
    ],
    [LOVE_LESSON],
  ),
  // ------------------------------------------------ Grove: one dusk
  sc(
    'a13-grove-clank-dusk',
    [
      N('It is dusk in the Grove. The Nubbins come in from the grass.'),
      N('They climb onto Clank, because he is warm.'),
      N('One sits on his wheel. One sits on his hood, like a hat.'),
      CK('Announcement.', 'soft'),
      CK('Love.', 'soft'),
      CK('I am only saying it once, so it does not wear out.'),
    ],
    [
      notice(
        0,
        'science',
        'dusk is when day turns to night',
        '1-ESS1-1',
        [
          N('Dusk is the time when day turns into night.'),
          N('The Sun goes down, the sky goes soft, and the first star comes out.'),
        ],
        'Heard that dusk is when day turns into night.',
      ),
    ],
  ),
  // ------------------------------------------------ Grove: Pixel
  sc(
    'a13-grove-pixel',
    [
      N('Pixel is at the lantern shed, cleaning Clank’s nose.'),
      CK('Pixel. You did not put it in.'),
      PX('Put what in?', 'think'),
      CK('The word. The one I did not have.'),
      PX('I know. I am sorry.', 'sad'),
      CK('Do not be. Geppetto did not either.', 'happy'),
      N('Pixel laughs, and puts Clank’s nose back on.'),
    ],
    [
      ask(
        4,
        'sel',
        'when someone says sorry, we can forgive',
        'CASEL: Relationship skills',
        [N('Pixel said sorry. What did Clank say back?')],
        [
          o(
            '“Do not be.” He forgave her.',
            [N('Yes! Forgiving means letting go, and being kind.')],
            true,
          ),
          o('He was cross.', [N('He was not. He forgave her kindly.')]),
        ],
        'Noticed that saying sorry and forgiving each other helps friends.',
      ),
    ],
  ),
  // ------------------------------------------------ Grove: Clank’s idle lines
  sc(
    'a13-grove-clank-idle',
    [
      CK('Announcement: I am just here.', 'soft'),
      CK('Announcement: still just here.'),
      CK('Not helping. Just here. Both are allowed.', 'happy'),
    ],
    [
      notice(
        2,
        'sel',
        'being together without doing anything is good too',
        'ELOF: Social and Emotional Development',
        [
          N('Sometimes friends just sit together. They do not need to play or help.'),
          N('Being together is enough.'),
        ],
        'Heard that being together without doing anything is enough.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A13_SPROUT: EduQuest[] = [
  A1,
  A2,
  A3,
  A4,
  A5,
  A6,
  A7,
  A8,
  A9,
  A10,
  A11,
  A12,
  A13,
  A14,
  A15,
  A16,
  A17,
  A18,
  A19,
  A20,
];

/** Every `edu:` check string used by the lessons above. */
export const CHECKS: string[] = [
  'edu:add:sugar-lumps:2',
  'edu:clap:beat:dance',
  'edu:clap:beat:drum',
  'edu:clap:syllables:puppet',
  'edu:count:aloud:10',
  'edu:count:by-tens:100',
  'edu:count:cans:2',
  'edu:count:days:3',
  'edu:count:doctors:3',
  'edu:count:gold-left:4',
  'edu:count:martens:4',
  'edu:count:months:4',
  'edu:count:months:5',
  'edu:count:pears:3',
  'edu:count:pennies:4',
  'edu:count:room-things:3',
  'edu:count:table-things:3',
  'edu:name:weather:storm',
  'edu:order:planting:dig-plant-water',
  'edu:order:story:pinocchio',
  'edu:read:sign:pull-the-cord',
  'edu:say:first-sound:f',
  'edu:say:sound-word:cri',
  'edu:say:sound-words:splash',
  'edu:say:word:grazie',
  'edu:sort:drawer-things:edible',
  'edu:sort:float-or-sink:kettle',
  'edu:sort:float-or-sink:wood',
  'edu:tap:shape:circle',
];
