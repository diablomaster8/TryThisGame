/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Atlas page A31,
 * The Hero Twins (the Popol Vuh, K’iche’ Maya, Guatemala).
 *
 * Source: atlas-a31.ts (ATLAS_A31 and A31_VARIANTS). One EduScene per original scene, id
 * `sprout:<original id>`, with the same choice ids (and the `a31-rat` and `a31-corn` flags on the
 * choices that set them). Every step scene, done scene, complete scene and variant has a version,
 * each with exactly one lesson.
 *
 * What it teaches (outline: where Guatemala is and that K’iche’ Maya people live there and speak
 * K’iche’ today; how corn grows and that people in this part of the world first grew it; Maya
 * numbers counted in twenties; the rubber ball made from tree sap; why the sun and moon seem to
 * take turns): where Guatemala is, that K’iche’ is spoken today, the corn life cycle, counting to
 * 20 on fingers and toes, rubber from sap, day and night. Around those: counting to 5, shapes,
 * rhymes, first sounds, steady beats, sequencing, feelings, saying sorry, fair swaps, and a few
 * animal facts (monkey tails, birds have no teeth, bats, catfish, jaguars).
 *
 * Softened for this age (EDU-STYLE.md, “Hard things”; the outline says the fathers “stay in
 * Xibalba”, the trials are puzzles, and the oven, the bat and the sacrifice show are cut):
 * - The fathers “stayed there, far below”. Nobody dies on the page. The Four Hundred Boys are the
 *   one death, said once and plainly (“their bodies stopped working”), with the stars as comfort.
 * - Xquic’s father wants “proof” and the owls say no; the sap heart is only a red sap ball.
 * - Seven Macaw snatches a blowgun, not an arm. The bat takes a hat, not a head; a squash makes a
 *   pretend hat. The oven is a glow the twins walk into, and the river hides them as catfish. The
 *   dancers’ wonders are a vanishing straw house and a dog that lies down and jumps up. The
 *   lords’ end is an empty seat when the curtain rises.
 * - The cigars are candles. No ceremony, copal or prayer is put on the page.
 * - No lifted lines from Spence or any translation. Every margin line and every line is new.
 * - The page is a K’iche’ grandmother’s kitchen today: a real home, never “a lost civilisation”.
 * - Facts used: Guatemala is in Central America with mountains and volcanoes; K’iche’ is spoken
 *   there today; rubber comes from the milky sap of a tree; dry gourds make bowls; trees carry sap;
 *   one seed grows into a plant with an ear of many kernels; spider monkeys grip with their
 *   tails; birds have no teeth; fireflies make their own light; jaguars live in forests; bats
 *   squeak and listen for echoes; catfish have whiskers; jade is a green stone carved in
 *   Guatemala; the Earth turns, so the Sun and Moon seem to take turns; the Sun rises in the east.
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
const BY = say('byte');
const GM = say('a31-gran');
const GD = say('a31-girl');
const HP = say('a31-hunahpu');
const XB = say('a31-xbalanque');
const HH = say('a31-hun');
const VH = say('a31-vucub');
const XQ = say('a31-xquic');
const XM = say('a31-xmucane');
const OW = say('a31-owls');
const GO = say('a31-gourd');
const OM = say('a31-monkey');
const OA = say('a31-artisan');
const SM = say('a31-macaw');
const OC = say('a31-elders');
const ZP = say('a31-zipacna');
const EQ = say('a31-earthquake');
const RT = say('a31-rat');
const MQ = say('a31-mosquito');
const LS = say('a31-louse');
const TD = say('a31-toad');
const FA = say('a31-falcon');
const RD = say('a31-road');
const OD = say('a31-one-death');
const SD = say('a31-seven-death');
const LD = say('a31-lords');

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
    const counts: number[] = [];
    for (const sentence of sentences) {
      const last = chunks[chunks.length - 1];
      const n = counts[counts.length - 1] ?? 0;
      if (last !== undefined && words(last) + words(sentence) <= 14 && n < 2) {
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
): EduQuest => ({
  id: `sprout:${of}`,
  of,
  band: 'sprout',
  title,
  goals,
  scenes,
});

const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice => ({
  id,
  label,
  ...(set ? { set } : {}),
  then,
});

const SOFT_EDGE = N('The page goes soft round the edges, like a kitchen full of smoke.');
const WHICH_SUN = GM('My gran told me which one is which. One day I will tell you.', 'soft');

// ================================================================== A31-1 The Hearth
const Q1 = quest(
  'a31-01',
  'The Hearth',
  {
    'a31-01-s1': {
      goal: 'Step into the kitchen on the atlas page.',
      hint: 'Touch the warm page, then go in.',
    },
    'a31-01-s2': {
      goal: 'Sit by the fire and listen to the old story.',
      hint: 'Sit on the low stool.',
    },
  },
  [
    sc(
      'a31-01-page',
      [
        N('You touch the warm page. Whoosh! You are in a kitchen in Guatemala.'),
        N('A grandmother pats dough into round tortillas. Pat, pat, turn.'),
        N('A girl sits at the table. She keeps watching the door.'),
        GD('Grandmother! Someone is at the door!', 'shock'),
        GM('A guest, and a small guest. Come in, both of you.', 'happy'),
        N('Your Nubbin goes straight to the warm fire and sits down.'),
      ],
      [
        notice(
          1,
          'social-studies',
          'Guatemala is a country with mountains; K’iche’ Maya people live there and speak K’iche’ today',
          'D2.Geo.2.K-2',
          [
            GM('This kitchen is in Guatemala. It is a country with green mountains.'),
            GM('Many people here are K’iche’ Maya. They speak K’iche’, in kitchens like this one.'),
            N('(Point to the green mountain on the atlas page.)'),
          ],
          'Learned that Guatemala is a country with mountains, and that K’iche’ Maya people live there and speak K’iche’ today.',
        ),
      ],
      {
        choices: [
          ch('stool', 'Sit on the low stool she points to.', [
            GM('Good. Now you are the right height for a story.'),
          ]),
          ch('help', 'Offer to help with the tortillas.', [
            N('Your tortilla comes out a funny shape.'),
            GM('You eat that one yourself. That is the rule.', 'happy'),
          ]),
          ch('warm', 'Let your Nubbin warm its paws.', [
            N('It warms its paws, then its back, then its paws again.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-01-page-done',
      [
        GD('Is it a dog?'),
        GM('It is a guest. You do not ask a guest what it is. You give it a tortilla.'),
        N('Your Nubbin gets a warm tortilla. It holds it in both paws.'),
      ],
      [
        ask(
          1,
          'sel',
          'welcoming a guest kindly',
          'ELOF: Social and Emotional Development',
          [N('A new guest comes to your door. How can you help them feel welcome?')],
          [
            o(
              'Say hello and share something nice',
              [N('Yes! A hello and a share make a guest feel welcome.')],
              true,
            ),
            o('Stare and point', [
              N('Staring can make a guest feel shy. A hello and a share feel warmer.'),
            ]),
          ],
          'Thought about how to make a new guest feel welcome.',
        ),
      ],
    ),
    sc(
      'a31-01-story',
      [
        GD('Grandmother, tell the old story, please!', 'happy'),
        GM('You have heard it a hundred times.'),
        GD('So now it is one hundred and one!'),
        GM('Long ago my people wrote it down, in our own language.'),
        GM('And grandmothers still tell it today.', 'happy'),
        N('Smoke curls up past the beam. Your Nubbin watches it go.'),
        GM('Before the sun was the sun, two brothers played ball…'),
        N('The kitchen goes soft. Now there is grass under your feet.'),
      ],
      [
        notice(
          4,
          'literacy',
          'a story can live in a book and in a person’s voice',
          'ELOF: Language and Communication',
          [
            GM('A story can live in two places.'),
            GM('It can live in a book. It can live in a voice.'),
            GM('When we tell it out loud, it stays alive.'),
          ],
          'Learned that a story can be written down and also told aloud.',
        ),
      ],
      {
        choices: [
          ch('nubbin', 'Pick your Nubbin up first.', [N('It is warm right through, like a loaf.')]),
          ch('gran', 'Keep your eyes on the grandmother.', [
            GM('I am still here. I will be here the whole time.', 'soft'),
          ]),
        ],
      },
    ),
    sc(
      'a31-01-complete',
      [
        N('You stand on a hillside in the early morning.'),
        N('Thock! Something heavy and bouncy hits a wall.'),
        GM('Listen. That is them.'),
        N('Your Nubbin’s ears go up.'),
      ],
      [
        doit(
          1,
          'science',
          'a sound is a shake you can feel',
          '1-PS4-1',
          'edu:clap:thock:3',
          [
            GM('Thock! The ball hits the wall, and the wall shakes a tiny bit.'),
            GM('That shake is the sound.'),
            N('(Tap your knees: thock, thock, thock. Can you feel the shake?)'),
          ],
          'Learned that sound is a tiny shake (vibration), and felt it by tapping.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-2 The Ballplayers
const Q2 = quest(
  'a31-02',
  'The Ballplayers',
  {
    'a31-02-s1': {
      goal: 'Watch the two brothers play ball.',
      hint: 'Go down the hill and watch from the wall.',
    },
    'a31-02-s2': {
      goal: 'Bring the ball back over the wall.',
      hint: 'Follow your Nubbin and carry the ball together.',
    },
  },
  [
    sc(
      'a31-02-court',
      [
        N('Below the hill is a ballcourt with two long sloping walls.'),
        N('Two men play on it. They shout at every point.'),
        HH('That was mine!', 'happy'),
        VH('It hit your knee. Knees do not count.'),
        N('They never use their hands. They bump the ball with hips and shoulders.'),
        GM('Hun Hunahpu and Vucub Hunahpu. Good players. Noisy neighbours.'),
        N('Thock! The ball rolls to your Nubbin.'),
      ],
      [
        doit(
          4,
          'maths',
          'count to 5 bumps',
          'K.CC.B.5',
          'edu:count:bumps:5',
          [
            HH('Hip! Hip! Shoulder! Hip! Hip!'),
            N('(Count the bumps together: 1, 2, 3, 4, 5. How many?)'),
          ],
          'Counted five ball bumps, one for each count.',
        ),
      ],
      {
        choices: [
          ch('bump', 'Let your Nubbin have a go.', [
            N('It bumps the ball, and the ball does not move. Your Nubbin does, backwards!'),
            VH('Good form. Wrong direction.', 'happy'),
          ]),
          ch('hands', 'Roll it back to them.', [
            HH('No hands!', 'shock'),
            VH('Guests get one hand-ball. It is an old rule. I made it up just now.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-02-fetch',
      [
        N('The ball flies over the wall and rolls down the hill.'),
        HH('Little one, would you fetch it?'),
        N('Your Nubbin bounces down after it. Boing, boing!'),
        N('The ball is as big as your Nubbin. It is black and heavy.'),
        GM('People here made balls from tree sap, long ago, before anyone else.'),
        N('You carry it back up together.'),
      ],
      [
        notice(
          4,
          'science',
          'rubber comes from the sticky, milky sap of a tree',
          '2-PS1-1',
          [
            GM('The sap is white and sticky, like milky glue.'),
            GM('It comes from a rubber tree. When it dries, it bounces!'),
          ],
          'Learned that rubber comes from tree sap, and that sap dries into a bouncy material.',
        ),
      ],
      {
        choices: [
          ch('nubbin', 'Let your Nubbin hand it over.', [
            N('It pushes the ball up to Hun Hunahpu. He bows to it, and it bows back.'),
          ]),
          ch('throw', 'Throw it back over the wall.', [N('Thock! A cheer comes from the court.')]),
        ],
      },
    ),
    sc(
      'a31-02-complete',
      [
        N('Four owls land on the wall, all in a row.'),
        OW('We come from the lords of Xibalba. You are too loud!'),
        OW('They say: come and play. Bring your gear.'),
        HH('A game! We are the best!', 'happy'),
        N('The brothers tie their gear up high in their mum’s roof.'),
        N('They tell her not to worry. She worries anyway.'),
      ],
      [
        ask(
          0,
          'literacy',
          'words that rhyme',
          'RF.K.2',
          [N('Four owls! (Say it slowly: owl.) Which word rhymes with owl?')],
          [
            o('Howl', [N('Yes! Owl, howl. They rhyme.')], true),
            o('Hat', [N('Owl, hat. Not quite. Owl, howl: those two rhyme.')]),
            o('Tree', [N('Owl, tree. Not quite. Owl, howl: those two rhyme.')]),
          ],
          'Found a rhyme for “owl”.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-3 The Road Down
const Q3 = quest(
  'a31-03',
  'The Road Down',
  {
    'a31-03-s1': {
      goal: 'Listen to the grandmother tell about the road.',
      hint: 'Stay on the empty road and listen.',
    },
    'a31-03-s2': {
      goal: 'Look at the tree by the road.',
      hint: 'Go and look. You do not have to touch.',
    },
  },
  [
    sc(
      'a31-03-road',
      [
        N('The page goes quiet. A road goes down between rocks. Nobody is on it.'),
        GM('This part I tell. You do not need to see it.'),
        GM('The brothers went down, down, to a place called Xibalba.'),
        GM('They did not come back up. They stayed there, far below.', 'sad'),
        N('The road stays empty. A little wind moves the dust.'),
      ],
      [
        ask(
          3,
          'sel',
          'what helps when we miss someone',
          'ELOF: Social and Emotional Development',
          [N('Their mum, Xmucane, will miss them. What helps when we miss someone?')],
          [
            o(
              'Telling stories about them',
              [N('Yes. Stories keep them close. It is all right to feel sad too.')],
              true,
            ),
            o('Pretending we do not miss them', [
              N('Missing someone is a big feeling. It helps to say it, and to tell stories.'),
            ]),
          ],
          'Thought about what helps when we miss someone: feelings are allowed, and stories keep them close.',
        ),
      ],
      {
        choices: [
          ch('sit', 'Sit down at the side of the road.', [
            N('You sit. Your Nubbin sits close beside you.'),
          ]),
          ch('ask', 'Ask what happened to them.', [
            GM(
              'They stayed down there. That is enough for now. The story is not finished.',
              'soft',
            ),
          ]),
        ],
      },
    ),
    sc(
      'a31-03-tree',
      [
        N('By the road is a tree full of round green gourds.'),
        N('The atlas margin has a little drawing of it, all green and round.'),
        GD('Grandmother, why can nobody go near it?'),
        GM('The lords said nobody may touch it. So of course somebody does.'),
        N('Your Nubbin pats the trunk, the way it pats you when you are tired.'),
      ],
      [
        notice(
          3,
          'science',
          'a dried gourd shell is hard, so it makes a bowl or a cup',
          '2-PS1-1',
          [
            GM('A gourd is a fruit. When it dries, its shell goes hard.'),
            GM('People here still use dry gourds as cups and bowls.'),
          ],
          'Learned that a dried gourd has a hard shell and can be used as a cup or bowl.',
        ),
      ],
      {
        choices: [
          ch('look', 'Look for the gourd that is different.', [
            N('Every gourd looks the same. That is the point.'),
          ]),
          ch('leave', 'Leave the tree be.', [
            N('You step back onto the road. Some things you do not need to find.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-03-complete',
      [
        N('Back at home, Xmucane waits by the fire with two small grandsons.'),
        GM('One grandmother, and two boys.'),
        GM('Then a girl went to look at a tree she must not touch.'),
        GD('And then?'),
        GM('Ah. That is how most good stories start.', 'happy'),
      ],
      [
        doit(
          1,
          'maths',
          'count to 3',
          'K.CC.B.5',
          'edu:count:people:3',
          [N('(Count the people by the fire: Xmucane, one boy, two boys. How many?)')],
          'Counted three people to answer “how many?”.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-4 The Calabash Tree
const Q4 = quest(
  'a31-04',
  'The Calabash Tree',
  {
    'a31-04-s1': {
      goal: 'Watch the girl who comes to the tree.',
      hint: 'Hide behind the rock and watch.',
    },
    'a31-04-s2': {
      goal: 'Go with the owls and Xquic.',
      hint: 'Walk behind the owls through the red trees.',
    },
    'a31-04-s3': {
      goal: 'Help press the red sap into a heart shape.',
      hint: 'Hold the bowl under the sap.',
    },
  },
  [
    sc(
      'a31-04-xquic',
      [
        N('Down in Xibalba it is never quite night or day.'),
        N('A girl walks alone and looks over her shoulder.'),
        GM('Xquic. She heard about the tree. She did not like being told no.'),
        XQ('Everyone says do not go near it. Nobody says why.', 'think'),
        GO('They are only round things in a tree. Hold out your hand.'),
        N('She holds out her hand. Something magic happens in it.'),
        XQ('It is gone! My hand is empty!', 'shock'),
        GO('Nothing to see. Go home. You will understand later.'),
      ],
      [
        ask(
          3,
          'literacy',
          'why a character does something',
          'RL.K.3',
          [N('Xquic goes to the tree, even though she was told no. Why does she go?')],
          [
            o(
              'She is curious. She wants to know why',
              [N('Yes. Xquic is curious, and nobody told her why.')],
              true,
            ),
            o('She is hungry', [
              N('She does not say she is hungry. She says nobody told her why. She is curious.'),
            ]),
            o('She wants to hide', [N('She walks up to the tree. She is curious about it.')]),
          ],
          'Worked out why a character acts as she does: curiosity.',
        ),
      ],
      {
        choices: [
          ch('hide', 'Stay hidden.', [
            N('Your Nubbin keeps popping up to see if hiding is finished.'),
          ]),
          ch('show', 'Step out and walk her to the road.', [
            XQ('Who are you? No, do not tell me. I have had enough surprises today.', 'think'),
          ]),
        ],
      },
    ),
    sc(
      'a31-04-owls',
      [
        N('Months go by in the margin. Xquic is going to have a baby.'),
        GM('Her father was cross. He told four owls to take her far away.'),
        GM('He wanted proof, to show she was gone. The owls did not like it at all.'),
        OW('We do not want to. We have never wanted to.', 'sad'),
        XQ('Then do not. We will make him some pretend proof.'),
        N('She points to a tree with red bark. Red sap drips down, slow as honey.'),
      ],
      [
        ask(
          3,
          'sel',
          'saying no to something unkind',
          'CASEL: Responsible decision-making',
          [N('The owls were told to do something unkind. They said no. Was that brave?')],
          [
            o(
              'Yes. Saying no to something unkind is brave',
              [N('Yes. It is brave to say no to something unkind.')],
              true,
            ),
            o('No. They should do what they are told', [
              N('Doing what we are told is good, but not when it is unkind. The owls were brave.'),
            ]),
          ],
          'Talked about why saying no to something unkind is brave.',
        ),
      ],
      {
        choices: [
          ch('tree', 'Go and look at the tree.', [
            N('Where the bark is cut, thick red sap runs slowly.'),
          ]),
          ch('owls', 'Tell the owls they can be brave.', [
            OW('Can we? Nobody has ever asked us to.', 'think'),
            N('All four owls stand up a little taller.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-04-sap',
      [
        XQ('Help me. Catch the sap in the bowl.'),
        N('You hold the bowl. Your Nubbin holds the edge too.'),
        N('Xquic squishes the sap into a round, lumpy heart shape.'),
        OW('More lump on that side. Hearts are not neat.'),
        N('It shines dark red. It is only sap, from a tree.'),
        XQ('Now go. Tell him you did it. I am going up to the world.', 'soft'),
      ],
      [
        notice(
          2,
          'science',
          'trees carry water and food inside them in sap',
          'K-LS1-1',
          [
            GM('Trees carry water and food inside them, in a juice called sap.'),
            GM('Some sap is runny. Some goes sticky and firm.'),
          ],
          'Learned that trees carry water and food in sap, and that sap can go sticky and firm.',
        ),
      ],
      {
        choices: [
          ch('smooth', 'Press the last of it smooth.', [
            N('The owls say it is too neat now, and rough it up again.'),
          ]),
          ch('paw', 'Let your Nubbin leave a pawprint in it.', [
            N('A tiny dent on top. The owls say that is fine.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-04-complete',
      [
        N('The owls carry the bowl back. The lords sniff the smell and lean in.'),
        GM('One, two, three, four owls. All four helped.'),
        GM('The lords were fooled by a smell!', 'happy'),
        GD('By owls!'),
        N('Your Nubbin sniffs its paw. It still smells like the tree.'),
      ],
      [
        doit(
          1,
          'maths',
          'count four owls',
          'K.CC.B.5',
          'edu:count:owls:4',
          [N('(Count the owls on your fingers: 1, 2, 3, 4. How many owls?)')],
          'Counted four owls on their fingers.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-5 Xmucane’s Test
const Q5 = quest(
  'a31-05',
  'Xmucane’s Test',
  {
    'a31-05-s1': {
      goal: 'Walk Xquic up to Xmucane’s house.',
      hint: 'Go up the hill to the house with the fire.',
    },
    'a31-05-s2': {
      goal: 'Go down to the garden with one plant.',
      hint: 'Sit by the corn plant with Xquic.',
    },
    'a31-05-s3': {
      goal: 'Carry the net of corn up to Xmucane.',
      hint: 'Take one end of the net. Go slowly.',
    },
  },
  [
    sc(
      'a31-05-door',
      [
        N(
          'A little house of poles and thatch sits on a hill. It looks like the kitchen you came from.',
        ),
        XQ('Grandmother, I am your son’s wife. I carry his children.', 'soft'),
        XM('I do not believe you. Go away.', 'angry'),
        XM('Here is a test! Bring me a net of corn from the garden.'),
        N('You look down the hill. In the garden is one corn plant. Just one.'),
      ],
      [
        ask(
          2,
          'sel',
          'naming a feeling from how someone is treated',
          'ELOF: Social and Emotional Development',
          [N('Xmucane says, “I do not believe you.” How might Xquic feel?')],
          [
            o(
              'Sad, and a bit scared',
              [N('Yes. It hurts when no one believes us. Xquic feels sad.')],
              true,
            ),
            o('Silly', [
              N('Xquic is not feeling silly. Nobody believes her. She feels sad and a bit scared.'),
            ]),
          ],
          'Named a feeling (sad, scared) from how a character is treated.',
        ),
      ],
      {
        choices: [
          ch('net', 'Offer to carry the net.', [
            XQ('Thank you. I think the net is the easy part.'),
          ]),
          ch('might', 'Tell Xmucane she might be telling the truth.', [
            XM('Might. Everybody might. Go and get the corn.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-05-garden',
      [
        N('One plant. One ear.'),
        N('Xquic sits on the earth with the empty net. Your Nubbin sits too.'),
        N('She asks for help, softly, the way you ask friends for a favour.'),
        N('She lays the silk of the ear in the net. The net is full!'),
        GM('Full from one ear! Remember that.', 'happy'),
      ],
      [
        notice(
          3,
          'science',
          'a seed grows into a plant, and a plant makes new seeds',
          'K-LS1-1',
          [
            GM('One corn seed grows into one corn plant.'),
            GM('One plant makes ears. One ear has lots of kernels.'),
            GM('Each kernel is a seed. It can grow into a new plant!'),
          ],
          'Learned that a corn seed grows into a plant that makes ears full of new seeds.',
        ),
      ],
      {
        choices: [
          ch('touch', 'Touch the ear left on the plant.', [
            N('It is still there. The plant was not robbed.'),
          ]),
          ch('thank', 'Say thank you to nobody in particular.', [
            XQ('Yes. That. Thank you.', 'soft'),
          ]),
        ],
      },
    ),
    sc(
      'a31-05-carry',
      [
        N('The net is heavy. You take one end. Xquic takes the other.'),
        N('Your Nubbin rides in the middle. It does not carry anything. It supervises.'),
        XQ('The older brothers will not help. They only play flutes.'),
        XQ('Some helpers only watch. Like that one.'),
        N('You set the net down by Xmucane. She looks for a long time.'),
        XM('One plant. I planted it myself.', 'think'),
      ],
      [
        ask(
          3,
          'maths',
          'compare: which is heavier',
          'K.MD.A.2',
          [N('The net is full of corn. Which is heavier: the whole net, or one kernel?')],
          [
            o('The whole net', [N('Yes! The whole net is heavier. A kernel is tiny.')], true),
            o('One kernel', [N('One kernel is tiny. The whole net of corn is much heavier.')]),
          ],
          'Compared two things and said which is heavier.',
        ),
      ],
      {
        choices: [
          ch('wait', 'Wait outside the door.', [
            N('You wait by the door. Your Nubbin waits by your boot.'),
          ]),
          ch('sit', 'Sit down on the net.', [
            N('You sit on the corn, and so does your Nubbin. Xquic laughs.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-05-complete',
      [
        XM('Well. You are my son’s wife, then. Come in. It is cold.', 'soft'),
        N('She puts a log on the fire. She gives Xquic the good stool.'),
        GM('That is how grandmothers say sorry.', 'happy'),
        GD('You never give me the good stool!'),
        GM('You never carried a net of corn.'),
      ],
      [
        ask(
          3,
          'sel',
          'saying sorry and making it better',
          'ELOF: Social and Emotional Development',
          [N('Xmucane said sorry by giving the good stool. How can you say sorry?')],
          [
            o(
              'Say sorry, and help to fix it',
              [N('Yes. Words and kind actions together say sorry best.')],
              true,
            ),
            o('Run away', [
              N(
                'Running away leaves the sorry feeling stuck. Saying sorry and helping works better.',
              ),
            ]),
          ],
          'Practised how to say sorry with words and kind actions.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-6 The Older Brothers
const Q6 = quest(
  'a31-06',
  'The Older Brothers',
  {
    'a31-06-s1': {
      goal: 'Meet the twins.',
      hint: 'Wait by the house until two boys come down the hill.',
    },
    'a31-06-s2': {
      goal: 'Watch the older brothers climb the tree.',
      hint: 'Stand well back from the tree.',
    },
    'a31-06-s3': {
      goal: 'Wait with Xmucane by the door.',
      hint: 'Stand by the door and watch the trees.',
    },
  },
  [
    sc(
      'a31-06-born',
      [
        N('Twins are born on the mountain: Hunahpu and Xbalanque.'),
        N('They are loud from the first minute.'),
        OM('Put them outside! We are busy!', 'angry'),
        GM('The twins grew up outside, with blowguns. And very cheeky!', 'happy'),
        N('Years pass in one breath. Two boys come down the hill.'),
        HP('Hello! A guest, and a guest’s guest!', 'happy'),
        GM('This Hunahpu is a twin. His father was Hun Hunahpu, the ballplayer.'),
        GM('Same name, with a bit on the front.'),
        N('Your Nubbin and the twins are friends at once.'),
      ],
      [
        ask(
          7,
          'literacy',
          'first sounds',
          'RF.K.2',
          [
            N(
              'Hunahpu starts with “h”. (Say it: h, h, Hunahpu.) Which of these starts with “h” too?',
            ),
          ],
          [
            o('Hat', [N('Yes! Hunahpu, hat. Both start with h.')], true),
            o('Sun', [N('Sun starts with “s”. Hunahpu and hat both start with “h”.')]),
            o('Ball', [N('Ball starts with “b”. Hunahpu and hat both start with “h”.')]),
          ],
          'Matched a first sound (“h” in Hunahpu and hat).',
        ),
      ],
      {
        choices: [
          ch('hello', 'Say hello.', [
            HP('Good. Are you hungry? Nobody here eats till our brothers eat.'),
          ]),
          ch('blowgun', 'Ask about the blowguns.', [
            XB('A long tube. You blow, and a clay ball pops out at a target.', 'happy'),
          ]),
        ],
      },
    ),
    sc(
      'a31-06-tree',
      [
        HP('We found lovely birds up that tree. Somebody taller should look.', 'think'),
        OA('Fine. Artists can climb.'),
        N('The two older brothers climb up. Then the tree begins to grow!'),
        OM('It is getting bigger! Why?', 'shock'),
        XB('Tie your cloths behind you, and you can climb down!'),
        N('They do. The ends of the cloths turn into curly tails!'),
      ],
      [
        ask(
          3,
          'maths',
          'positions: above and below',
          'K.G.A.1',
          [N('The brothers are up in the tree. Are they above the ground, or below it?')],
          [
            o('Above the ground', [N('Yes! Up in the tree is above the ground.')], true),
            o('Below the ground', [
              N('Below is under the ground. The brothers are up in the tree, above it.'),
            ]),
          ],
          'Used the position words above and below.',
        ),
      ],
      {
        choices: [
          ch('laugh', 'Laugh.', [N('Your Nubbin falls over backwards. That is how it laughs.')]),
          ch('worry', 'Ask if they are all right.', [
            HP('They are fine. Look. They have never been happier in a tree.', 'happy'),
          ]),
        ],
      },
    ),
    sc(
      'a31-06-laugh',
      [
        N('The brothers swing off into the trees as monkeys.'),
        XM('Where are my older boys?', 'sad'),
        HP('Do not laugh when you see them, Grandmother.'),
        N('They swing back, with long arms and curly tails and very serious faces.'),
        XM('I am not laughing. I am not.', 'think'),
        N('She laughs! They swing back up into the trees.'),
        GM('Do not be sad for them. They still paint and play flutes up there.', 'soft'),
      ],
      [
        notice(
          3,
          'science',
          'monkeys use arms and tails to swing and hold on',
          'K-LS1-1',
          [
            GM('Monkeys swing with their long arms.'),
            GM('In Guatemala, spider monkeys use their tails like a fifth hand!'),
          ],
          'Learned that monkeys’ arms and tails help them climb, and spider monkeys grip with their tails.',
        ),
      ],
      {
        choices: [
          ch('hold', 'Try not to laugh too.', [
            N('Your face goes red. Your Nubbin does not even try.'),
          ]),
          ch('wave', 'Wave to the monkeys.', [
            N('One waves back, upside down, and plays three notes on a flute.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-06-complete',
      [
        N('That night there is flute music in the trees.'),
        XM('Did I do that?', 'sad'),
        XB('You laughed, Grandmother. They are happy up there.'),
        HP('Also, it was funny.', 'happy'),
        N('Xmucane gives the twins supper first, for the first time.'),
      ],
      [
        ask(
          0,
          'sel',
          'kind laughing and unkind laughing',
          'CASEL: Social awareness',
          [N('Which is a kind laugh?')],
          [
            o('Laughing together at something funny', [N('Yes! Laughing together is kind.')], true),
            o('Laughing at someone who is crying', [
              N('That would hurt. A kind laugh is a laugh together.'),
            ]),
          ],
          'Told a kind laugh (together) from an unkind laugh (at someone who is hurt).',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-7 Seven Macaw
const Q7 = quest(
  'a31-07',
  'Seven Macaw',
  {
    'a31-07-s1': {
      goal: 'Go with the twins to the shining bird’s tree.',
      hint: 'Follow the twins and keep low.',
    },
    'a31-07-s2': {
      goal: 'Carry the bag of white corn.',
      hint: 'Walk behind the old couple with the bag.',
    },
  },
  [
    sc(
      'a31-07-macaw',
      [
        N('The sky has no sun yet. Only a big, shining bird.'),
        SM('Look at me! Silver eyes! Jewel teeth! I am the sun!', 'happy'),
        GM('He was not the sun. He was just shiny.'),
        XB('The sun would be warm. He is not warm.', 'think'),
        N('Hunahpu blows a clay ball. Thup! It hits the bird’s beak.'),
        SM('My teeth!', 'shock'),
        N('Seven Macaw swoops down. He snatches the blowgun and flies home.'),
        HP('I am all right. Just annoyed.', 'angry'),
      ],
      [
        notice(
          3,
          'science',
          'birds have no teeth; they have beaks',
          'K-LS1-1',
          [
            GM('Real birds have no teeth! They have a beak instead.'),
            GM('Seven Macaw’s jewel teeth are only in the story.'),
          ],
          'Learned that real birds have beaks and no teeth.',
        ),
      ],
      {
        choices: [
          ch('hunahpu', 'Run to Hunahpu.', [HP('I am all right. Mostly annoyed.', 'angry')]),
          ch('chase', 'Chase the macaw.', [
            N('He is a bird, and you are not. Your Nubbin flaps its tiny wings anyway.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-07-healers',
      [
        N('Two old people with white hair meet the twins.'),
        OC('We will be tooth doctors. You walk behind us.', 'happy'),
        N('You carry the bag of white corn. Your Nubbin carries itself.'),
        SM('My teeth hurt! Doctors! Thank goodness!', 'sad'),
        OC('Out come the jewel teeth. In go white corn teeth.'),
        N('The blowgun hangs from a beam. Hunahpu waves at it.'),
      ],
      [
        doit(
          0,
          'literacy',
          'clap the syllables in a word',
          'RF.K.2',
          'edu:clap:syllables:macaw',
          [N('Macaw. (Clap the parts: ma-caw.)'), N('(How many claps? Two!)')],
          'Clapped the two syllables in “macaw”.',
        ),
      ],
      {
        choices: [
          ch('bag', 'Hand over the bag of corn with a straight face.', [
            N('You manage, just. Your Nubbin hands over one kernel by itself.'),
          ]),
          ch('arm', 'Look at the blowgun on the beam.', [N('Hunahpu gives it a small wave.')]),
        ],
      },
    ),
    sc(
      'a31-07-complete',
      [
        N('The jewel teeth come out. The white corn teeth go in.'),
        GM('Five white corn teeth go in, in a row.'),
        N('Seven Macaw is not shining now. He is a big green bird.'),
        SM('I do not feel like the sun any more.', 'sad'),
        N('The old woman gives the blowgun back to Hunahpu.'),
        HP('Thank you. It had a nice rest.', 'happy'),
      ],
      [
        doit(
          1,
          'maths',
          'count to 5',
          'K.CC.B.5',
          'edu:count:corn-teeth:5',
          [N('(Count the corn teeth on your fingers: 1, 2, 3, 4, 5.)')],
          'Counted five corn teeth.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-8 Zipacna and Earthquake
const Q8 = quest(
  'a31-08',
  'Zipacna and Earthquake',
  {
    'a31-08-s1': {
      goal: 'Help the twins make a crab that is not a crab.',
      hint: 'Gather leaves, red flowers and a flat stone.',
    },
    'a31-08-s2': {
      goal: 'Watch Zipacna go after the crab.',
      hint: 'Hide up on the edge of the ravine.',
    },
    'a31-08-s3': {
      goal: 'Dig wet clay from the riverbank.',
      hint: 'The clay is at the bend of the river.',
    },
  },
  [
    sc(
      'a31-08-crab',
      [
        GM('Seven Macaw had two sons. Both bigger, and both worse.'),
        GM('Zipacna was unkind to the Four Hundred Boys, and they died.', 'sad'),
        GM('That means their bodies stopped working. In the story, they became stars.', 'soft'),
        GM('Zipacna loved crabs. That was his weak spot.'),
        N('You gather broad leaves and red flowers. Xbalanque finds a flat stone for the shell.'),
        N('Your Nubbin finds a stick for a claw.'),
        XB('Best crab I have seen that is not a crab!', 'happy'),
      ],
      [
        doit(
          6,
          'art',
          'name a shape: circle',
          'K.G.A.2',
          'edu:tap:shape:circle',
          [
            XB('Look at the crab’s shell. It is a circle. Round and round!'),
            N('(Tap the round shell. What shape is it?)'),
          ],
          'Named a circle in the shell of a crab they helped build.',
        ),
      ],
      {
        choices: [
          ch('claw', 'Give it your Nubbin’s stick for a claw.', [
            N('Your Nubbin hands over the stick very proudly.'),
          ]),
          ch('eyes', 'Give it two pebbles for eyes.', [N('Now the crab is looking at you.')]),
        ],
      },
    ),
    sc(
      'a31-08-zipacna',
      [
        N('Zipacna comes down the river, big and hungry.'),
        ZP('A crab? Where?', 'happy'),
        HP('Down there, under the mountain.'),
        N('He squeezes in under the mountain to reach it.'),
        N('Then the mountain settles with a long, slow sigh.'),
        GM('Zipacna stayed there a very long time. He never carried mountains again.'),
        N('Your Nubbin takes its stick back, very carefully.'),
      ],
      [
        notice(
          4,
          'social-studies',
          'Guatemala has many mountains and volcanoes',
          'D2.Geo.2.K-2',
          [
            GM('Guatemala has many mountains. Some of them are volcanoes.'),
            GM('The K’iche’ highlands are high up in the mountains.'),
          ],
          'Learned that Guatemala has many mountains and volcanoes, and that the K’iche’ highlands are high up.',
        ),
      ],
      {
        choices: [
          ch('quiet', 'Keep very quiet.', [
            N('You are so quiet you can hear your Nubbin thinking about the stick.'),
          ]),
          ch('mountain', 'Pat the mountain.', [N('The mountain does not seem to mind.')]),
        ],
      },
    ),
    sc(
      'a31-08-earthquake',
      [
        GM('The second son was Earthquake. He stamped, and mountains shook loose.'),
        XB('He is hungry. We need clay.'),
        N('You dig wet clay from the riverbank. It is soft and squishy.'),
        N('The twins coat a roast bird all over in clay.'),
        EQ('That smells good! Is that for me?', 'happy'),
        N('He eats it and sits down. He is very sleepy now.'),
        N('The ground still shakes a little when he turns over in his sleep.'),
      ],
      [
        ask(
          2,
          'science',
          'wet clay is soft; dry clay is hard',
          '2-PS1-1',
          [N('Wet clay is soft and squishy. What happens to clay when it dries in the sun?')],
          [
            o('It goes hard', [N('Yes! Dry clay goes hard. That is how pots are made.')], true),
            o('It stays squishy', [N('Wet clay is squishy. When it dries, it goes hard.')]),
          ],
          'Found out that wet clay is soft and dry clay is hard.',
        ),
      ],
      {
        choices: [
          ch('wash', 'Wash the clay off in the river.', [
            N('Your Nubbin does not want clean paws. It prints them everywhere.'),
          ]),
          ch('listen', 'Put your ear to the ground.', [
            N('Far down, very faint, there is a snore.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-08-complete',
      [
        N('The world is quieter. The mountains stay where they are.'),
        HP('Is that all of them?'),
        XB('All the shiny, boasting ones.'),
        GM('People here counted in twenties. Fingers and toes!'),
        GM('Now someone must go down to Xibalba. Not yet. First, a rat.'),
      ],
      [
        doit(
          3,
          'maths',
          'count to 20',
          'K.CC.A.1',
          'edu:count:fingers-toes:20',
          [N('(Count all your fingers and toes together: ten and ten.)'), N('(How many? Twenty!)')],
          'Counted to twenty on fingers and toes, as Maya people did when they counted in twenties.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-9 The Rat
const Q9 = quest(
  'a31-09',
  'The Rat',
  {
    'a31-09-s1': {
      goal: 'Help the twins clear the garden.',
      hint: 'Go to the garden and keep watch with the dove.',
    },
    'a31-09-s2': {
      goal: 'Wait in the garden at night.',
      hint: 'Hide behind the bush with the twins.',
    },
    'a31-09-s3': {
      goal: 'Take the water jar to Xmucane at the river.',
      hint: 'Take it slowly.',
    },
  },
  [
    sc(
      'a31-09-tools',
      [
        N('The twins should clear a garden. Their tools do it for them!'),
        HP('Hoe, dig! Axe, chop!', 'happy'),
        N('A dove sits on the fence as a lookout.'),
        N('In the morning the garden is a forest again. Every tree is back!'),
        HP('What? Who did this?', 'shock'),
      ],
      [
        notice(
          3,
          'science',
          'seeds wait in the soil for water and light, then grow',
          '2-LS2-1',
          [
            GM('Seeds can sleep in the soil for a long time.'),
            GM('When rain and sun come, they wake up and grow!'),
          ],
          'Learned that seeds in the soil grow when they get water and light.',
        ),
      ],
      {
        choices: [
          ch('hoe', 'Let your Nubbin help the hoe.', [
            N('It holds the handle and gets dragged round the garden.'),
          ]),
          ch('dove', 'Keep watch with the dove.', [
            N('The dove nods at you, one lookout to another.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-09-night',
      [
        N('That night you hide behind a bush with the twins.'),
        N('At midnight the animals come: the puma, the jaguar, the deer, the rabbit.'),
        N('They tell the trees to stand up again, and the trees do.'),
        N('Hunahpu catches a rat by the tail and holds it up, gently.'),
        RT('Do not eat me! I know a secret!', 'shock'),
        RT('Your dad’s ball and gloves are up in your gran’s roof!'),
        RT('I want food for ever. That is my price.'),
      ],
      [
        ask(
          6,
          'social-studies',
          'a fair swap: both sides get something',
          'D2.Civ.8.K-2',
          [N('The rat gives a secret. The twins give food. Is that a fair swap?')],
          [
            o(
              'Yes, both get something good',
              [N('Yes! A swap is fair when both sides get something good.')],
              true,
            ),
            o('No, nobody gets anything', [
              N('Both get something: the rat gets food, and the twins get the secret.'),
            ]),
          ],
          'Learned that a swap is fair when both sides get something good.',
        ),
      ],
      {
        choices: [
          ch('fair', 'Tell the rat it is a fair price.', [
            RT('A fair price! You hear that? The guest says fair.', 'happy'),
          ]),
          ch('nose', 'Let your Nubbin say hello.', [
            N('Your Nubbin touches noses with the rat. The rat sneezes. That counts.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-09-roof',
      [
        HP('Grandmother, this chilli sauce is hot! We need water!'),
        N('Xmucane goes to the river with the big jar. You follow with a small one.'),
        N('A mosquito lands on her jar and makes a tiny hole.'),
        MQ('Pardon me. So sorry. Pardon.'),
        N('Water pours out of the hole! Everyone helps.'),
        N('At home, the rat chews a cord. Down falls a bundle: a ball and gloves.'),
        XB('Father’s.', 'soft'),
      ],
      [
        ask(
          2,
          'science',
          'spot a problem to solve',
          'K-2-ETS1-1',
          [N('The jar has a hole, and the water runs out. What problem must we solve?')],
          [
            o(
              'Stop the hole, so the water stays in',
              [N('Yes! First we must stop the hole.')],
              true,
            ),
            o('Pour the water faster', [
              N('Faster does not stop the leak. We must stop the hole.'),
            ]),
          ],
          'Named a problem to solve (a leaking jar).',
        ),
      ],
      {
        choices: [
          ch(
            'share',
            'Bring the rat a share of your own lunch too.',
            [
              N('You give the rat half your tortilla. It looks at you for a long time.'),
              RT('You. I will remember you.', 'soft'),
            ],
            { 'a31-rat': 'share' },
          ),
          ch(
            'twins',
            'Leave it to the twins.',
            [
              XB('From now on, rat, you eat what we eat. Nobody chases you out of the corn.'),
              RT('For ever is a good length.', 'happy'),
            ],
            { 'a31-rat': 'twins' },
          ),
          ch(
            'come',
            'Ask the rat to come with you to Xibalba.',
            [
              RT('Xibalba? Me? There are owls down there.', 'shock'),
              RT('Fine. But I am riding on your Nubbin.'),
            ],
            { 'a31-rat': 'come' },
          ),
        ],
      },
    ),
    sc(
      'a31-09-complete',
      [
        N('That evening the twins sweep their father’s old ballcourt and play all night.'),
        N('The rat watches from the wall, eating.'),
        GM('And who heard them?'),
        GD('The lords!'),
        GM('Under the court, trying to sleep. Just like before.', 'think'),
      ],
      [
        doit(
          0,
          'music',
          'clap a steady beat',
          'ELOF: Perceptual, Motor, and Physical Development',
          'edu:clap:beat:ball',
          [
            N('Thock, thock, thock. The ball bounces on a steady beat.'),
            N('(Clap a steady beat with the ball: thock, thock, thock, thock.)'),
          ],
          'Clapped a steady beat to the bounce of a ball.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-10 The Summons
const Q10 = quest(
  'a31-10',
  'The Summons',
  {
    'a31-10-s1': {
      goal: 'Follow the message to the ballcourt.',
      hint: 'Go with the louse. It is not quick.',
    },
    'a31-10-s2': {
      goal: 'See the twins plant their corn, and choose where you will be.',
      hint: 'Stand by the hearth while they plant.',
    },
  },
  [
    sc(
      'a31-10-relay',
      [
        N('The owls come to Xmucane’s door with the lords’ message.'),
        XM('Go and tell my grandsons, little louse. Quickly!', 'sad'),
        N('The louse is not quick. A toad gives it a lift, inside its mouth.'),
        LS('Thank you. It is a bit wet in here.'),
        N('Then a snake gives the toad a lift. Then a falcon gives the snake a lift.'),
        N('At the ballcourt, out pops the snake. Then the toad.'),
        TD('The louse is fine. It is just a bit stuck.', 'think'),
        LS('Your grandmother says come home. The lords say come down.'),
      ],
      [
        ask(
          7,
          'literacy',
          'what happens first, next, last',
          'RL.K.3',
          [
            N(
              'The louse rode in the toad. The toad rode in the snake. Who gave the very last lift?',
            ),
          ],
          [
            o('The falcon', [N('Yes! The falcon gave the last lift, carrying the snake.')], true),
            o('The toad', [N('The toad gave the first lift. The falcon gave the last.')]),
          ],
          'Followed the order of events in a story: first, next, last.',
        ),
      ],
      {
        choices: [
          ch('thank', 'Thank every messenger in turn.', [
            N('The falcon looks embarrassed. The louse bows.'),
          ]),
          ch('laugh', 'Try not to laugh at the louse.', [
            LS('Laugh if you like. I got here, did I not?'),
          ]),
        ],
      },
    ),
    sc(
      'a31-10-corn',
      [
        N('Before they go, each twin plants an ear of corn in the house.'),
        HP('Look at these every day, Grandmother.'),
        XB('If the corn goes dry, we are in trouble. If it stays green, we are doing well.'),
        XM('And if it does both?', 'think'),
        HP('Then we are being clever.'),
        N('The twins pick up their father’s gear. Your Nubbin looks at you.'),
      ],
      [
        ask(
          3,
          'science',
          'plants need water and sun to stay green',
          'K-LS1-1',
          [N('Corn stays green when it has what it needs. What does a plant need?')],
          [
            o(
              'Water and sunshine',
              [N('Yes! Plants need water and sunshine to stay green.')],
              true,
            ),
            o('Toys and a hat', [N('Plants do not need toys. They need water and sunshine.')]),
          ],
          'Said that plants need water and sunlight.',
        ),
      ],
      {
        choices: [
          ch(
            'stay',
            'Stay with Xmucane and watch the corn.',
            [
              XM('Oh. You do not have to.', 'soft'),
              N('She moves her stool over, so there is room for yours.'),
            ],
            { 'a31-corn': 'stay' },
          ),
          ch(
            'go',
            'Go down with the twins.',
            [
              XB('Good. Bring the little one. We need someone who can fetch.', 'happy'),
              XM('Look after them. And look after yourself.', 'soft'),
            ],
            { 'a31-corn': 'go' },
          ),
        ],
      },
    ),
    sc(
      'a31-10-complete',
      [
        N('In the morning the twins walk off down the road, bouncing their father’s ball.'),
        N('Behind them, two ears of corn stand green in the house.'),
        GM('Now. Which way did you go?'),
        N('The page waits, as if it is listening.'),
      ],
      [
        ask(
          2,
          'sel',
          'what helps when we wait',
          'CASEL: Responsible decision-making',
          [N('Staying and going are both brave. Waiting can be hard. What helps when we wait?')],
          [
            o(
              'A job to do, and a friend beside us',
              [N('Yes. A job and a friend make waiting easier.')],
              true,
            ),
            o('Sitting alone and worrying', [
              N('Worrying alone is heavy. A job and a friend help us wait.'),
            ]),
          ],
          'Talked about what helps when we have to wait: a job and a friend.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-11 The Crossroads
const Q11 = quest(
  'a31-11',
  'The Crossroads',
  {
    'a31-11-s1': {
      goal: 'Follow the news of the road to the crossroads.',
      hint: 'Go with the twins, or wait with Xmucane.',
    },
    'a31-11-s2': {
      goal: 'Hear how the twins greeted the lords.',
      hint: 'Stay well back from the bench, or wait at the door.',
    },
  },
  [
    sc(
      'a31-11-road',
      [
        N('The way down is steep: stairs in the rock, a river, another river.'),
        N('At the bottom, four roads meet: red, white, yellow and black.'),
        RD('I am the way! Take me!'),
        XB('That road talked to our father.', 'think'),
        N('Hunahpu pulls out a hair and blows. It turns into a mosquito!'),
        MQ('Good afternoon. How may I help?'),
        HP('Go ahead of us. Say hello to everyone sitting down there.'),
        MQ('Bite strangers? Without being introduced?', 'shock'),
      ],
      [
        notice(
          1,
          'social-studies',
          'where roads cross is a crossroads, and a map shows roads from above',
          'D2.Geo.2.K-2',
          [
            GM('Where roads cross, that place is called a crossroads.'),
            GM('A map shows roads from above, the way a bird sees them.'),
          ],
          'Learned the word crossroads and that a map shows places from above.',
        ),
      ],
      {
        choices: [
          ch('wave', 'Let your Nubbin wave the mosquito off.', [
            N('The mosquito bows three times. That is a lot of bowing for something small.'),
          ]),
          ch('road', 'Thank the black road.', [RD('Nobody thanks a road. Huh.', 'think')]),
        ],
      },
    ),
    sc(
      'a31-11-lords',
      [
        N('The hall of Xibalba is long and dim. Lords sit in a row. Some are made of wood!'),
        N('The mosquito says hello to the first lord: wood. The second: wood.'),
        OD('Ow!', 'shock'),
        SD('What is it, One Death?'),
        OD('Something bit me, Seven Death!'),
        HP('Good day, One Death! Good day, Seven Death!', 'happy'),
        XB('And good day to the wooden ones. Nice carving!'),
        N('The lords stare. Nobody has ever said hello by name.'),
        N('A seat for them glows. It is a hot stone.'),
        XB('No, thanks. We have been sitting all the way down.'),
      ],
      [
        ask(
          7,
          'sel',
          'using someone’s name is a kind thing to do',
          'CASEL: Social awareness',
          [N('The twins said hello to every lord by name. Why does saying a name feel kind?')],
          [
            o('It shows we notice them', [N('Yes. A name says: I see you.')], true),
            o('It does not matter', [
              N('Names matter. When we say a name, the person feels noticed.'),
            ]),
          ],
          'Talked about why saying someone’s name is kind.',
        ),
      ],
      {
        choices: [
          ch('grin', 'Try very hard not to grin.', [
            N('You fail. You look at the ceiling as if it is interesting.'),
          ]),
          ch('back', 'Stand well back from the bench.', [
            N('You stand back. Your Nubbin stands further back still.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-11-complete',
      [
        GM('Every lord by name. No bowing to the wood. No sitting on the hot bench.', 'happy'),
        GD('Because of a mosquito!'),
        GM('A small helper can do a big job.'),
        N('The mosquito finds your Nubbin. It lands on its crown and bows.'),
        N('The mosquito bows: one, two, three times!'),
        N('Your Nubbin says nothing. The mosquito takes that as yes.'),
      ],
      [
        doit(
          4,
          'maths',
          'count to 3',
          'K.CC.B.5',
          'edu:count:bows:3',
          [N('(Bow with the mosquito and count: 1, 2, 3. How many bows?)')],
          'Counted three bows.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-12 The Houses
const Q12 = quest(
  'a31-12',
  'The Houses',
  {
    'a31-12-s1': {
      goal: 'Spend the night in the Dark House, or sit up with Xmucane.',
      hint: 'Stay close to the light, or the corn.',
    },
    'a31-12-s2': {
      goal: 'Go through the other houses, or do the house’s work.',
      hint: 'Carry pine cones, or fetch water and look at the corn.',
    },
  },
  [
    sc(
      'a31-12-dark',
      [
        N('The lords send the twins to the Dark House. They get a torch and two little candles.'),
        LD('Keep them lit all night. Give them back whole in the morning.'),
        N('It is as dark as a cupboard with the door shut.'),
        HP('So we do not light them. We make them LOOK lit.'),
        XB('Sneaky.'),
        HP('Clever. It is different. A bit.'),
        N('Hunahpu ties a red feather on the torch. In the dark, it looks like a flame!'),
        N('Xbalanque puts a firefly on each candle. They glow on, off, on.'),
        N('A guard looks in, sees the glow, and goes away.'),
      ],
      [
        notice(
          7,
          'science',
          'we see things when there is light; fireflies make their own light',
          '1-PS4-2',
          [
            GM('We can only see when there is light.'),
            GM('The guard saw a glow, so he thought the torch was lit.'),
            GM('Fireflies make their own light inside their bodies. It does not burn!'),
          ],
          'Learned that we see things when there is light, and that fireflies make their own cool light.',
        ),
      ],
      {
        choices: [
          ch('firefly', 'Help catch the fireflies.', [
            N('You catch one in your cupped hands. It glows, pleased to help.'),
          ]),
          ch('torch', 'Let your Nubbin hold the torch.', [
            N('It holds the torch very upright. The feather does not burn.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-12-dark-done',
      [
        N('In the morning they give back the torch and the candles. Not burnt at all.'),
        OD('How?', 'shock'),
        HP('Good morning!', 'happy'),
      ],
      [
        ask(
          2,
          'literacy',
          'how characters feel at what happens',
          'RL.2.3',
          [N('How does the lord feel when he gets the candles back?')],
          [
            o('Surprised', [N('Yes! His mouth falls open. He is surprised.')], true),
            o('Sleepy', [N('He says “How?” His mouth falls open. He is surprised.')]),
          ],
          'Worked out how a character feels from what he says and does.',
        ),
      ],
    ),
    sc(
      'a31-12-houses',
      [
        GM('Then four more houses. Each one was a puzzle: Razor, Cold, Jaguar and Fire.'),
        N('In the Cold House, frost is on the walls. The twins build a fire of pine cones.'),
        N(
          'In the Jaguar House, the jaguars pace. The twins give them bones, and the jaguars lie down.',
        ),
        N('In the Fire House, the fire roars and does not hurt them.'),
        N('Your Nubbin carries pine cones for the fire, one at a time.'),
        HP('Every house, and we are still here!', 'happy'),
      ],
      [
        notice(
          2,
          'science',
          'jaguars are big cats that live in forests',
          '2-LS4-1',
          [
            GM('Real jaguars are big cats. They live in warm forests, in Guatemala and nearby.'),
            GM('They are good swimmers, too!'),
          ],
          'Learned that jaguars are big cats that live in forests and can swim.',
        ),
      ],
      {
        choices: [
          ch('cold', 'Warm your hands at the pine-cone fire.', [
            N('The fire smells of pine and somewhere better.'),
          ]),
          ch('jaguar', 'Keep well away from the jaguars.', [
            N('A jaguar looks at you, then goes back to its bone.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-12-complete',
      [
        GM('Clever every time. Clever, not strong.'),
        GM('And on the mountain, the corn stayed green the whole time.'),
        GD('Because they were safe!'),
        GM('Because they were clever. Being clever kept them safe.', 'happy'),
      ],
      [
        ask(
          0,
          'literacy',
          'what a story’s heroes use to win',
          'RL.K.3',
          [N('The twins solved every house. What did they use: big muscles, or clever ideas?')],
          [
            o('Clever ideas', [N('Yes! Feathers, fireflies and fire: clever ideas.')], true),
            o('Big muscles', [N('They used clever ideas, like feathers, fireflies and fire.')]),
          ],
          'Noticed how the heroes solved their problems: with clever ideas.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-13 The Bat House
const Q13 = quest(
  'a31-13',
  'The Bat House',
  {
    'a31-13-s1': {
      goal: 'Get through the night in the Bat House, or watch the corn.',
      hint: 'Stay together until morning.',
    },
    'a31-13-s2': {
      goal: 'Watch the game, or hear the falcon’s news at noon.',
      hint: 'Sit by the wall, or go to the doorway.',
    },
  },
  [
    sc(
      'a31-13-bats',
      [
        N('The last house is the Bat House. It is full of bats.'),
        XB('Into our blowguns! We sleep inside, and the bats cannot get in.'),
        N('You squeeze under a bench with your Nubbin.'),
        HP('Is it morning yet? I will peek.'),
        XB('Do not peek!', 'shock'),
        N('Whoosh! A bat swoops and snatches Hunahpu’s hat.'),
        XB('Animals! Everyone! I need help!', 'sad'),
        N('The animals come, each with something to share.'),
        N('Last comes the coati, rolling a big squash.'),
        N('By morning, Xbalanque has carved the squash into a funny pretend hat.'),
      ],
      [
        notice(
          5,
          'science',
          'many bats squeak and listen for echoes to find their way in the dark',
          'K-LS1-1',
          [
            GM('Bats fly at night.'),
            GM('Many bats squeak, and listen for the echoes. That helps them find their way.'),
          ],
          'Learned that many bats use squeaks and echoes to find their way at night.',
        ),
      ],
      {
        choices: [
          ch('squash', 'Help roll the squash.', [
            N('It is round and heavy, and it wants to go everywhere.'),
          ]),
          ch('hold', 'Hold your Nubbin close in the dark.', [
            N('It holds your sleeve, and you hold it, until morning.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-13-game',
      [
        N('The ballcourt of Xibalba is huge. Above the end wall hangs Hunahpu’s hat.'),
        OD('Play! Then we shall use that hat for a ball!', 'happy'),
        XB('Play first.'),
        N('Xbalanque hits the ball so hard it flies out into the trees.'),
        N('A rabbit picks it up and bounds away. The lords run after it.'),
        LD('After the ball!'),
        N('Xbalanque climbs the wall. He takes back his brother’s hat and hangs the squash there.'),
        N('A lord serves the squash. Splat! Seeds everywhere.'),
        OD('That is cheating!', 'angry'),
        HP('That is squash.'),
      ],
      [
        ask(
          9,
          'sel',
          'what to do when someone takes your things',
          'CASEL: Responsible decision-making',
          [
            N(
              'The lords wanted to play ball with Hunahpu’s hat. What can you do if someone is unkind with your things?',
            ),
          ],
          [
            o(
              'Ask a grown-up or a friend for help',
              [N('Yes. Asking for help is a wise thing to do.')],
              true,
            ),
            o('Take their things too', [N('That makes more trouble. Asking for help is better.')]),
          ],
          'Talked about asking for help when someone is unkind with your things.',
        ),
      ],
      {
        choices: [
          ch('cheer', 'Cheer.', [
            N('Your Nubbin cheers by jumping. The rabbit cheers by washing its ears.'),
          ]),
          ch('seeds', 'Pick up the squash seeds.', [
            N('You pocket a handful of seeds, without knowing why.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-13-complete',
      [
        GM('That was the hardest night. They came through it, with a squash to spare.', 'happy'),
        GD('I like the rabbit.'),
        GM('Everybody likes the rabbit.'),
        N('Far away, two ears of corn lift their leaves in the morning light.'),
      ],
      [
        notice(
          0,
          'health',
          'sleep, water and breakfast help our bodies after a hard night',
          'ELOF: Perceptual, Motor, and Physical Development',
          [
            GM('After a long, hard night, our bodies are tired.'),
            GM('Sleep, a drink of water and a good breakfast help us feel better.'),
          ],
          'Learned that rest, water and breakfast help our bodies recover.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-14 The Oven and the River
const Q14 = quest(
  'a31-14',
  'The Oven and the River',
  {
    'a31-14-s1': {
      goal: 'Stand by the twins, or stay beside Xmucane.',
      hint: 'Stay close. Look where you are told.',
    },
    'a31-14-s2': {
      goal: 'Wait five days.',
      hint: 'Sit on the bank, or by the corn. The page turns the days.',
    },
  },
  [
    sc(
      'a31-14-oven',
      [
        N('The lords are tired of losing. They make one last plan.'),
        XB('We know their plan. We have our own.', 'think'),
        N('Two wise seers, Xulu and Pacam, listen in a quiet corner.'),
        HP('Tell the lords: put us in the river. Say it like it is your idea.'),
        N('Hunahpu kneels down by you and your Nubbin.'),
        HP('Do not look at the glow. Look at the river. Five days. Promise.', 'soft'),
        N('The twins take hands and walk into the glow. Then they are gone.'),
        N('Your Nubbin hides its face in your coat.', 'sad'),
      ],
      [
        ask(
          7,
          'sel',
          'what helps when we feel scared',
          'CASEL: Self-management',
          [N('Your Nubbin is scared. What helps when we feel scared?')],
          [
            o(
              'A hug and a slow breath',
              [N('Yes. A hug and a slow breath help a scared feeling get smaller.')],
              true,
            ),
            o('Pretending we are not scared', [
              N('It is all right to be scared. A hug and a slow breath really help.'),
            ]),
          ],
          'Talked about what helps when we feel scared: a hug and slow breathing.',
        ),
      ],
      {
        choices: [
          ch('river', 'Look at the river, like he said.', [
            N('The river goes on being a river. That is something.'),
          ]),
          ch('hold', 'Hold your Nubbin.', [
            N('You hold it, and it holds you, and the glow goes down slowly.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-14-river',
      [
        N('The lords do just what the seers say. They are pleased with themselves.'),
        N('You wait on the bank. The page turns its days: one, two, three, four, five.'),
        N(
          'On day two there are two catfish in the shallows. Your Nubbin lies nose to nose with them.',
        ),
        N('On day five, two boys climb out of the river, dripping.'),
        XB('Told you. Five days!', 'happy'),
        HP('I am starving!'),
      ],
      [
        doit(
          1,
          'maths',
          'count the days to 5',
          'K.CC.A.1',
          'edu:count:days:5',
          [N('(Count the days on your fingers: 1, 2, 3, 4, 5. How many days?)')],
          'Counted five days on their fingers.',
        ),
      ],
      {
        choices: [
          ch('hug', 'Hug them both, wet as they are.', [
            N('They are cold and wet and smell of river. Your Nubbin hugs a leg each.'),
          ]),
          ch('food', 'Find them something to eat.', [
            N('You have half a tortilla in your pocket. They split it down the middle.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-14-complete',
      [
        GM('Five days. Their grandmother counted every one.', 'soft'),
        GD('Did she know they would come back?'),
        GM('No. That is why it counts.'),
        N('Far up the mountain, two ears of corn are green.'),
      ],
      [
        notice(
          0,
          'science',
          'catfish feel and taste with whiskers called barbels',
          'K-LS1-1',
          [
            GM('Catfish have whiskers. They are called barbels.'),
            GM('A catfish feels and tastes with them, even in muddy water.'),
          ],
          'Learned that catfish use whiskers to feel and taste.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-15 The Performers
const Q15 = quest(
  'a31-15',
  'The Performers',
  {
    'a31-15-s1': {
      goal: 'Watch the dancers, or hear the falcon’s news.',
      hint: 'Follow the crowd, or wait by the door.',
    },
    'a31-15-s2': {
      goal: 'Watch the last wonder, or wait at the house.',
      hint: 'Stay by the curtain, or in by the corn.',
    },
  },
  [
    sc(
      'a31-15-dancers',
      [
        N('Two ragged dancers arrive in Xibalba. They have very familiar grins!'),
        N('In the street a straw house vanishes in a puff of smoke. Pop! It is back.'),
        N('A dog lies down, then jumps up wagging.'),
        LD('Who are those two? We want a show!'),
        XB('A show for lords? We could not possibly.', 'happy'),
        N('Your Nubbin is given a job: minding the curtain rope.'),
      ],
      [
        doit(
          2,
          'music',
          'clap a pattern: stomp, stomp, clap',
          'ELOF: Perceptual, Motor, and Physical Development',
          'edu:clap:beat:drum-dance',
          [
            N('The dancers stamp a pattern: stomp, stomp, clap.'),
            N('(Do it with them: stomp, stomp, clap. Again!)'),
          ],
          'Copied a clapping and stomping pattern.',
        ),
      ],
      {
        choices: [
          ch('rope', 'Help your Nubbin mind the rope.', [
            N('You both hold the rope. It is a very well-minded rope.'),
          ]),
          ch('faces', 'Watch the lords’ faces.', [
            N('They look like children at a fair. They do love wonders.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-15-curtain',
      [
        OD('Do it to us! Make us a wonder!', 'happy'),
        HP('Are you sure?', 'think'),
        N('Xbalanque takes the rope from your Nubbin. He lets the curtain down gently.'),
        N('When it goes up again, the lords’ seats are empty. The two big lords are gone. The twins do not bring them back.'),
        GM('They died. That is sad, even for unkind lords. The other lords were not hurt.'),
        HP('I am Hunahpu. This is my brother Xbalanque. Our father is Hun Hunahpu.'),
        N('Everyone in Xibalba kneels and begs.'),
        LD('Mercy. Please.', 'shock'),
        XB('You can have mercy. Not greatness. Not any more.'),
      ],
      [
        ask(
          8,
          'sel',
          'forgiving someone who says sorry',
          'CASEL: Relationship skills',
          [N('The other lords say sorry. The twins let them stay, with jobs. What can you do when someone says sorry?')],
          [
            o(
              'Say it is okay, and try again together',
              [N('Yes. Forgiving, and trying again, is kind and wise.')],
              true,
            ),
            o('Be mean back', [
              N('Being mean back keeps the trouble going. Forgiving and trying again is better.'),
            ]),
          ],
          'Talked about forgiving someone who says sorry.',
        ),
      ],
      {
        choices: [
          ch('nubbin', 'Pick up your Nubbin.', [
            N('It looks at the empty seats, then at you. You hold it close.'),
          ]),
          ch('still', 'Stand still.', [
            N('You stand very still. In the whole hall, nobody else does.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-15-complete',
      [
        GM('From that day, the other lords of Xibalba were small. Small, not gone.'),
        GM(
          'After that, the lords had no more ball games. They had jobs to do, like everyone else.',
        ),
        GD('No more ball!', 'happy'),
        GM('That was the worst thing for a lord.'),
        N('Somewhere, a ball rolls into a corner and stays there.'),
      ],
      [
        notice(
          1,
          'social-studies',
          'in a fair place everyone shares the jobs',
          'D2.Civ.8.K-2',
          [
            GM('In a fair place, everyone shares the jobs.'),
            GM('Everyone does chores, even lords.'),
          ],
          'Learned that fairness means everyone shares the jobs.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-16 The Ballcourt and the Sky
const Q16 = quest(
  'a31-16',
  'The Ballcourt and the Sky',
  {
    'a31-16-s1': {
      goal: 'Go to the twins’ father’s place, or sit in the doorway with Xmucane.',
      hint: 'Kneel by the end wall, or sit on the doorstep.',
    },
    'a31-16-s2': {
      goal: 'Watch the first sunrise.',
      hint: 'Stay where you are and look up.',
    },
  },
  [
    sc(
      'a31-16-father',
      [
        N('The twins go to the great ballcourt, where their father stayed.'),
        N('There is only a quiet place in the earth. They kneel.'),
        HP('Father, we played. We won.', 'soft'),
        XB('You will be remembered. People will call your name first, always.'),
        N('They tell him the whole game, point by point.'),
        N('Your Nubbin puts the ball down beside the quiet place.'),
        HP('Thank you, little one. He would have liked you.', 'happy'),
      ],
      [
        ask(
          4,
          'sel',
          'ways to remember someone',
          'ELOF: Social and Emotional Development',
          [
            N(
              'The twins tell their father all the stories. What are good ways to remember someone?',
            ),
          ],
          [
            o(
              'Say their name and tell their stories',
              [N('Yes. Names and stories keep someone close.')],
              true,
            ),
            o('Never talk about them', [
              N('Talking about them keeps them close. Names and stories are a gift.'),
            ]),
          ],
          'Talked about ways to remember someone: saying their name and telling their stories.',
        ),
      ],
      {
        choices: [
          ch('kneel', 'Kneel with them.', [N('The earth is cool. It feels looked after.')]),
          ch('back', 'Stand back and let them talk.', [
            N('Some talk is for family. Your Nubbin stands straight beside you.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-16-rise',
      [
        N('The twins stand up, grin the same grin, and start to climb.'),
        N('Up into the dark above the court. It turns grey at one edge, then gold.'),
        N('One becomes the Sun. The other becomes the Moon.'),
        WHICH_SUN,
        N('After them come four hundred little lights. They are the Four Hundred Boys.'),
        N('They spread across the sky and stay. The atlas says: now they are the stars.'),
        N('The first sunlight lands on the quiet place, then on you.'),
      ],
      [
        notice(
          5,
          'science',
          'the Sun is up by day, the Moon and stars by night; the Earth turns',
          '1-ESS1-1',
          [
            GM('The Sun is up in the day. The Moon and stars are up at night.'),
            GM('They seem to take turns. Really, the Earth is turning round, slowly, like a top.'),
          ],
          'Learned that the Sun, Moon and stars seem to take turns because the Earth turns.',
        ),
      ],
      {
        choices: [
          ch('wave', 'Wave.', [
            N(
              'It is silly to wave at the sun. You do it anyway. Your Nubbin waves with both paws.',
            ),
          ]),
          ch('watch', 'Just watch.', [
            N('You watch until your eyes water. It is the first morning there has ever been.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-16-complete',
      [
        N('The light is all the way up. A green stone on a cord lies on the ball. Jade!'),
        N('Your Nubbin lets you tie it round its neck.'),
        GM('They were cheeky boys. They never forgot anyone who fetched for them.', 'soft'),
        SOFT_EDGE,
      ],
      [
        notice(
          0,
          'social-studies',
          'jade is a green stone that people in Guatemala have carved for thousands of years',
          'D2.His.2.K-2',
          [
            GM('Jade is a green stone.'),
            GM('People in Guatemala have carved jade for thousands of years, and still do today.'),
          ],
          'Learned that jade is a green stone carved in Guatemala long ago and today.',
        ),
      ],
    ),
  ],
);

// ================================================================== A31-17 The Hearth Again
const Q17 = quest(
  'a31-17',
  'The Hearth Again',
  {
    'a31-17-s1': {
      goal: 'Hear the end of the story by the hearth.',
      hint: 'Stay on the low stool while the smoke clears.',
    },
    'a31-17-s2': {
      goal: 'Give your Nubbin a warm tortilla before you go.',
      hint: 'Take a tortilla from the griddle.',
    },
  },
  [
    sc(
      'a31-17-hearth',
      [
        N('The smoke clears. You are on the low stool, with your Nubbin asleep on your feet.'),
        GM('And that is the story.'),
        GD('Is it true?', 'think'),
        GM('The sun came up this morning, did it not?'),
        GD('…Yes.'),
        GM('Then eat a tortilla. Go home.', 'happy'),
        N('Outside, somebody calls a dog in for supper.'),
      ],
      [
        ask(
          6,
          'literacy',
          'sharing who tells us stories',
          'ELOF: Language and Communication',
          [N('Grandmother’s stories are very old. Who tells YOU stories? (Wait for an answer.)')],
          [
            o('A grown-up at home', [
              N('Lovely. A story keeps us close to the people who tell it.'),
            ]),
            o('A teacher or a friend', [
              N('Lovely. A story keeps us close to the people who tell it.'),
            ]),
            o('A book', [N('Lovely. A book keeps a story safe, and someone reads it aloud.')]),
          ],
          'Talked about who tells them stories.',
        ),
      ],
      {
        choices: [
          ch('thanks', 'Thank her for the story.', [
            GM('Thank my gran. And hers. I only carried it.', 'soft'),
          ]),
          ch('again', 'Ask if you can come back and hear it again.', [
            GM('It will be here. It has been here a long time.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-17-ball',
      [
        N('The girl pulls a black rubber ball from under the table.'),
        GD('Your little one chased the ball the whole story!', 'happy'),
        N('She bumps it off her hip, thock, and your Nubbin is awake.'),
        N('It bumps the ball back, and the ball goes the wrong way. The girl laughs.'),
        GD('You can have it. Mine is better. Do not tell it.'),
        GM('A tortilla first. Nobody leaves this kitchen hungry.'),
      ],
      [
        doit(
          5,
          'maths',
          'halves: two equal parts',
          '1.G.A.3',
          'edu:share:tortilla:halves',
          [
            GM('Fold the tortilla in half. Now there are two equal parts.'),
            N('(Each part is a half.)'),
            N('(One half for you, and one half for your Nubbin.)'),
          ],
          'Saw that a half is one of two equal parts, by sharing a tortilla.',
        ),
      ],
      {
        choices: [
          ch('tortilla', 'Give your Nubbin a warm tortilla.', [
            N('It eats it in four slow bites. That is great respect.'),
          ]),
          ch('share', 'Share it, half and half.', [
            N('The girl says that is fair. Her gran says that is how it is done.'),
          ]),
        ],
      },
    ),
    sc(
      'a31-17-complete',
      [
        N('The smoke rises. You are back at your own table, with the atlas open.'),
        N('A black rubber ball is on the floor. Your Nubbin sits on it.'),
        N('Caught in the atlas spine is an ear of corn, dry and golden.'),
        N('It is light, and it rattles a little when you lift it.'),
        N('You hang it from the middle beam of the cottage.'),
        N('Out by the pond, the Nubbins come to look at the new ball. Nobody uses hands.'),
      ],
      [
        notice(
          3,
          'social-studies',
          'people in this part of the world first grew corn, long ago',
          'D2.His.2.K-2',
          [
            GM('Long, long ago, people in this part of the world first grew corn.'),
            GM('Today it grows all over the world, and people in Guatemala still grow it.'),
          ],
          'Learned that corn was first grown by people in this part of the world, and is still grown there.',
        ),
      ],
    ),
  ],
);

// ================================================================== variants
const V_RIBBONS_1 = sc(
  'a31-01-ribbons',
  [
    N('The girl sees your Nubbin’s ribbons: gold and silver, sewn with green thread.'),
    GD('Why does it have two colours?', 'think'),
    N('Her grandmother gives her a tortilla. The question goes away for now.'),
  ],
  [
    doit(
      0,
      'maths',
      'count to 3',
      'K.CC.B.5',
      'edu:count:ribbon-colours:3',
      [N('(Point to each colour and count: gold, silver, green. How many colours?)')],
      'Counted three ribbon colours.',
    ),
  ],
);

const V_ROAD_STAY = sc(
  'a31-11-road-stay',
  [
    N('The house is quiet with the twins gone.'),
    N('Xmucane sweeps the floor round the two ears of corn.'),
    XM('Do not stand on them. Do not breathe on them. I know. I am being silly.', 'think'),
    N('Xquic grinds corn on a flat stone. You fetch water from the river.'),
    N('Your Nubbin sits by the corn and looks at it.'),
    XM('They are at the crossroads by now.', 'sad'),
  ],
  [
    notice(
      3,
      'social-studies',
      'families grind corn into dough for tortillas, on a stone or with a mill',
      'D2.His.2.K-2',
      [
        GM('Xquic grinds corn on a flat stone. That is how tortillas started.'),
        GM('Many families still do. Others use a mill. Both make dough for tortillas.'),
      ],
      'Learned that corn is ground into dough for tortillas, by hand on a stone or by a mill.',
    ),
  ],
  {
    choices: [
      ch('sweep', 'Take over the sweeping.', [
        XM('Hm. You hold the broom the way he did.', 'soft'),
      ]),
      ch('sit', 'Sit by the corn with your Nubbin.', [
        N('You sit down. Nobody tells you to, and nobody tells you not to.'),
      ]),
    ],
  },
);

const V_LORDS_STAY = sc(
  'a31-11-lords-stay',
  [
    N('In the evening the falcon lands on the doorpost, out of breath.'),
    FA('News from below! A mosquito bit every lord, and they yelled each other’s names!'),
    FA('The boys said good day to every one, by name, even the wooden ones.'),
    XM('And the hot bench?'),
    FA('They did not sit on it.'),
    N('Xmucane laughs once, out loud. Then she covers her mouth.'),
    XM('Their father sat on it.', 'soft'),
  ],
  [
    ask(
      6,
      'sel',
      'feeling two feelings at once',
      'CASEL: Self-awareness',
      [
        N(
          'Xmucane laughs, and then feels sad, both in a short time. Can we feel two feelings at once?',
        ),
      ],
      [
        o(
          'Yes. That is very normal',
          [N('Yes. We can feel glad and sad together. That is normal.')],
          true,
        ),
        o('No. Only one at a time', [
          N('We can feel two at once. Xmucane feels glad and sad together.'),
        ]),
      ],
      'Learned that people can feel two feelings at once.',
    ),
  ],
  {
    choices: [
      ch('water', 'Give the falcon some water.', [
        FA('Thank you. Nobody ever gives the messenger water.', 'happy'),
      ]),
      ch('corn', 'Look at the corn.', [N('Green. Both ears, green to the tips.')]),
    ],
  },
);

const V_DARK_STAY = sc(
  'a31-12-dark-stay',
  [
    N('That night Xmucane cannot sleep. She sits up by the corn, and you sit with her.'),
    XM('They have the Dark House tonight. Their father could not keep the torch lit.', 'sad'),
    N('The fire is low. Your Nubbin curls up and watches the corn with one eye.'),
    N('Xmucane puts another log on the fire and keeps watch.'),
    XM('My mother did that when anyone was away. So I do.', 'soft'),
    N('The corn stays green. All night, both ears, green.'),
  ],
  [
    ask(
      4,
      'sel',
      'sitting with someone who is worried helps',
      'CASEL: Relationship skills',
      [N('Xmucane is worried. You sit with her. How does that help?')],
      [
        o('She feels less alone', [N('Yes. Company makes a worry feel smaller.')], true),
        o('It does not help', [
          N('It helps a lot. Nobody feels alone when a friend sits beside them.'),
        ]),
      ],
      'Learned that sitting with someone who is worried helps them feel less alone.',
    ),
  ],
  {
    choices: [
      ch('awake', 'Stay awake with her.', [
        N('When your head nods, she pokes you kindly, and you sit up again.'),
      ]),
      ch('feet', 'Let your Nubbin sleep on your feet.', [
        N('You do not move your feet for hours. Xmucane says nothing, and approves.'),
      ]),
    ],
  },
);

const V_DARK_DONE_STAY = sc(
  'a31-12-dark-done-stay',
  [
    XM('Still green.', 'soft'),
    N('She says it every morning after that.'),
    N('By the third morning, you say it with her.'),
  ],
  [
    notice(
      1,
      'literacy',
      'words that come again and again make a refrain',
      'RL.2.4',
      [
        GM('Xmucane says the same words each morning: still green.'),
        GM('Words that come back again and again are a refrain. Say it with her: still green!'),
      ],
      'Met a refrain, words repeated again and again, and joined in.',
    ),
  ],
);

const V_HOUSES_STAY = sc(
  'a31-12-houses-stay',
  [
    N('The days are long. You help with the house: water, wood, and weeds round the corn.'),
    XM('Hoe that row. No, that row.', 'think'),
    XQ('My boys are clever. Cleverer than their father.'),
    N('One corn ear has six leaves. The other has seven.'),
    N('Every time you come in, you look at the corn first.'),
    XM('Still green.', 'soft'),
  ],
  [
    doit(
      3,
      'maths',
      'count to 7 and say which has more',
      'K.CC.C.6',
      'edu:count:leaves:7',
      [N('(Count six leaves on one ear. Count seven on the other.)'), N('(Which ear has more?)')],
      'Counted six and seven leaves and said which group has more.',
    ),
  ],
  {
    choices: [
      ch('row', 'Hoe the wrong row, carefully.', [XM('That one is fine too, I suppose.')]),
      ch('count', 'Count the leaves on the corn.', [
        N('Six on one, seven on the other. Tomorrow: still six and seven.'),
      ]),
    ],
  },
);

const V_RAT_COATI = sc(
  'a31-13-rat-coati',
  [
    N('Behind the coati trots a rat, chest out. It fetched her specially.'),
    N('It nods at you. It remembered your lunch.'),
  ],
  [
    ask(
      1,
      'literacy',
      'why a character helps: cause and effect',
      'RL.2.3',
      [N('Why did the rat bring the coati to help?')],
      [
        o(
          'Because you shared your lunch with it',
          [N('Yes! A kind thing came back to you.')],
          true,
        ),
        o('Because it was bored', [N('The rat remembered your kindness. That is why it helped.')]),
      ],
      'Linked a kind act (sharing lunch) to a friend’s help later.',
    ),
  ],
);

const V_RAT_COURT = sc(
  'a31-13-rat-court',
  [
    N('Right behind the rabbit goes the rat. It rode down on your Nubbin’s head!'),
    RT('Slow! Is that running? I have seen faster cheese!', 'happy'),
    N('The lords chase it twice as far. That gives Xbalanque twice as long.'),
  ],
  [
    notice(
      1,
      'literacy',
      'animal sound words',
      'ELOF: Language and Communication',
      [
        GM('Rats go squeak, squeak! Listen to the rat.'),
        GM('Squeak is a sound word. What other animal sounds do you know?'),
      ],
      'Used animal sound words (squeak) and thought of others.',
    ),
  ],
);

const V_BATS_STAY = sc(
  'a31-13-bats-stay',
  [
    N('In the night you wake. Xmucane is already sitting up, looking at the corn.'),
    N('One ear has drooped. Its leaves hang down.'),
    XM('No. No, no.', 'sad'),
    N('She does not touch it, and she does not cry. She just looks.'),
    N('Your Nubbin climbs into your lap.'),
    XM('Sit with me. Do not say anything.', 'soft'),
    N('Near dawn, the drooping ear lifts, leaf by leaf.'),
    XM('Oh.', 'soft'),
  ],
  [
    ask(
      4,
      'sel',
      'calming a big worry with slow breaths and company',
      'CASEL: Self-management',
      [N('Xmucane has a big worry in the night. What helps most?')],
      [
        o(
          'Slow breaths, and a friend beside her',
          [N('Yes. Slow breaths and company make a big worry smaller.')],
          true,
        ),
        o('Shouting into the dark', [
          N('Shouting can feel good, but slow breaths and a friend calm us down.'),
        ]),
      ],
      'Learned that slow breathing and company help with a big worry.',
    ),
  ],
  {
    choices: [
      ch('arm', 'Put your hand on her arm.', [
        N('She puts her hand over yours and leaves it there.'),
      ]),
      ch('quiet', 'Say nothing at all.', [N('You say nothing. It turns out to be right.')]),
    ],
  },
);

const V_GAME_STAY = sc(
  'a31-13-game-stay',
  [
    N('The falcon comes at noon with its feathers all messy.'),
    FA('A bat took Hunahpu’s hat! Then a coati brought a squash!', 'shock'),
    FA(
      'And a rabbit ran off with the ball, and everyone chased it. Everything is back where it belongs.',
    ),
    XQ('Everything?'),
    FA('Everything. Both twins are fine. They splatted a squash on the lords!', 'happy'),
    XM('I saw his corn.', 'soft'),
    N('Xmucane makes tortillas, far too many, and gives the first to the falcon.'),
  ],
  [
    doit(
      6,
      'literacy',
      'retell events in order',
      'RL.K.3',
      'edu:order:story-events:3',
      [N('(Tell the news in order: first the bat, next the coati, last the rabbit.)')],
      'Retold three events from the falcon’s news in order.',
    ),
  ],
  {
    choices: [
      ch('perch', 'Give the falcon a seat by the fire.', [
        N('It sits by the fire with its tortilla. For a falcon, that is cosy.'),
      ]),
      ch('tortillas', 'Help with the tortillas.', [
        XM('Yours are the wrong shape. Make more.', 'happy'),
      ]),
    ],
  },
);

const V_COATI_TOLD = sc(
  'a31-13-rat-coati-told',
  [FA('And a rat fetched the coati. Somebody shared lunch with it once, and it does not forget.')],
  [
    notice(
      0,
      'science',
      'coatis have long ringed tails and long noses for sniffing out food',
      'K-LS1-1',
      [
        GM('A coati is a real animal of the forest.'),
        GM('It has a long, stripy tail, and a long nose for sniffing out food.'),
      ],
      'Learned that coatis have long noses for finding food and a long ringed tail.',
    ),
  ],
);

const V_COURT_TOLD = sc(
  'a31-13-rat-court-told',
  [
    FA(
      'Oh, and a rat. It rode down in Hunahpu’s pocket. It ran round and round the lords, shouting about cheese.',
      'happy',
    ),
  ],
  [
    notice(
      0,
      'science',
      'rats have whiskers to feel their way in the dark',
      'K-LS1-1',
      [
        GM('Rats have whiskers on their faces.'),
        GM('Whiskers help a rat feel its way in the dark.'),
      ],
      'Learned that whiskers help rats feel their way in the dark.',
    ),
  ],
);

const V_OVEN_STAY = sc(
  'a31-14-oven-stay',
  [
    N('The next day, the corn begins to dry from the tips down.'),
    XM('No.', 'sad'),
    N('By evening both ears are dry, and they rattle when the door opens.'),
    N('Xmucane cries. She does not hide it.'),
    N('You pull your stool up beside hers, and stay.'),
    XQ('They said: if it does both, we are being clever.', 'soft'),
    XM('I know what they said.', 'sad'),
  ],
  [
    ask(
      4,
      'sel',
      'staying close to a friend who is crying',
      'CASEL: Social awareness',
      [N('Xmucane is crying. What can you do for a friend who is crying?')],
      [
        o('Sit with them and stay close', [N('Yes. Staying close says: I am here.')], true),
        o('Tell them to stop', [
          N('Crying is allowed. Staying close helps more than saying stop.'),
        ]),
      ],
      'Learned that staying close helps a friend who is crying.',
    ),
  ],
  {
    choices: [
      ch('stay', 'Stay beside her.', [N('The fire goes down. You build it up, and you stay.')]),
      ch('xquic', 'Sit with Xquic instead.', [
        N('Xquic leans her head on your shoulder. She is frightened too.'),
      ]),
    ],
  },
);

const V_RIVER_STAY = sc(
  'a31-14-river-stay',
  [
    N('One day. Two days. Xmucane gets up each morning, looks, and sits down.'),
    N('Three days. Four days. You bring water and wood. Nobody speaks of the corn.'),
    N('On day five your Nubbin turns your head towards the middle of the house.'),
    N('A green shoot! Then another! Both ears, green.'),
    XM('Oh, you clever, clever boys!', 'happy'),
    XQ('Five days! They always keep their promises.', 'happy'),
  ],
  [
    doit(
      3,
      'maths',
      'count the days to 5',
      'K.CC.A.1',
      'edu:count:days:5',
      [N('(Count the days on your fingers: 1, 2, 3, 4, 5. How many days?)')],
      'Counted five days on their fingers.',
    ),
  ],
  {
    choices: [
      ch('laugh', 'Laugh out loud.', [
        N('Your Nubbin runs round the corn three times for no reason.'),
      ]),
      ch('hug', 'Hug Xmucane.', [XM('Get off. No. Stay there a minute.', 'soft')]),
    ],
  },
);

const V_DANCERS_STAY = sc(
  'a31-15-dancers-stay',
  [
    N('The corn grows a leaf a day, and Xmucane talks to it.'),
    XM('Eat something. Tell your brother to wear a hat.'),
    N('The falcon lands and looks pleased with itself.'),
    FA('Two ragged dancers in Xibalba! They make houses vanish and come back!'),
    XQ('Two of them?'),
    FA('Two. With grins.'),
    XM('Oh, I know those grins.', 'happy'),
  ],
  [
    doit(
      0,
      'maths',
      'count to 3',
      'K.CC.B.5',
      'edu:count:leaves:3',
      [N('A leaf a day!'), N('(Count three days of leaves: 1, 2, 3. How many leaves?)')],
      'Counted three leaves, one for each day.',
    ),
  ],
  {
    choices: [
      ch('again', 'Ask the falcon to go and look again.', [
        FA('I was going anyway. I want to see how it ends.'),
      ]),
      ch('tell', 'Tell the corn the news.', [
        N('Xmucane does not laugh at you. She adds a bit you forgot.'),
      ]),
    ],
  },
);

const V_CURTAIN_STAY = sc(
  'a31-15-curtain-stay',
  [
    N('You wait all day. Xquic grinds enough corn for twenty.'),
    N('At dusk the falcon sits on the doorpost, quiet.'),
    FA(
      'The lords asked for the wonder to be done to them. The boys did it. The lords did not come back.',
    ),
    N('Outside, the wind goes over the corn on the hill.'),
    FA('The rest begged. The boys said: mercy, yes. Greatness, no.'),
    XM('Good boys. Hard, but good.', 'soft'),
  ],
  [
    ask(
      2,
      'sel',
      'mixed feelings: glad and sad together',
      'CASEL: Social awareness',
      [
        N(
          'Xquic is quiet. She grew up down there, and she knows people there. How might she feel?',
        ),
      ],
      [
        o('Mixed up: relieved and sad', [N('Yes. She can feel relieved and sad together.')], true),
        o('Only happy', [
          N('Xquic may be glad it is over. She may be sad for people she knew too.'),
        ]),
      ],
      'Thought about how someone can feel mixed feelings at once.',
    ),
  ],
  {
    choices: [
      ch('xquic', 'Look at Xquic.', [N('Xquic is very still. She grew up down there.', 'sad')]),
      ch('corn', 'Look at the corn.', [N('Green and tall. Waiting, like you.')]),
    ],
  },
);

const V_MARGIN_HAZEL = sc(
  'a31-margin-hazel',
  [
    N('Nova’s atlas lies open at the hall of Xibalba. Two seats are empty.'),
    N('In the margin, in faint pencil, is a note. You know the hand.'),
    N('“Two boys who won by being cheeky to grumpy lords. My kind of boys.”'),
    N('Your Nubbin looks at you, asking if it may laugh. It may.'),
  ],
  [
    notice(
      1,
      'literacy',
      'a margin is the empty edge of a page, where readers write notes',
      'ELOF: Language and Communication',
      [
        GM('The margin is the empty edge of a page.'),
        GM('People write little notes there, like a message to the next reader.'),
      ],
      'Learned that the margin of a page is where readers write notes.',
    ),
  ],
);

const V_FATHER_STAY = sc(
  'a31-16-father-stay',
  [
    N('The corn is taller than the stools now.'),
    N('The falcon lands on Xmucane’s knee, which it has never done before.'),
    FA(
      'They are at the ballcourt, at their father’s place. They are telling him every point.',
      'soft',
    ),
    XM('He always liked to hear the score.', 'soft'),
    FA('They told him he will be remembered. Called first, before anyone.'),
    XM('Good. That is right.'),
    N('She takes your hand without looking.'),
    XM('Come and sit in the door. It will be morning soon.'),
  ],
  [
    notice(
      3,
      'sel',
      'remembering small things someone liked keeps them close',
      'ELOF: Social and Emotional Development',
      [
        GM('Xmucane remembers that her son liked to hear the score.'),
        GM('When we remember little things someone liked, they stay close in our hearts.'),
      ],
      'Learned that remembering small things someone liked keeps them close.',
    ),
  ],
  {
    choices: [
      ch('door', 'Sit in the doorway with her.', [
        N('The doorstep is still warm. The dark goes on a while longer.'),
      ]),
      ch('nubbin', 'Bring your Nubbin out too.', [
        N('It sits between you, facing east, as if it knows something.'),
      ]),
    ],
  },
);

const V_RISE_STAY = sc(
  'a31-16-rise-stay',
  [
    N('From Xmucane’s doorway you see dark mountains, with a grey line on top.'),
    N('Behind you, the corn stands up green in the dark.'),
    N('Two lights come up, far away, and climb. One becomes the Sun. The other becomes the Moon.'),
    WHICH_SUN,
    N('After them come four hundred little lights. The atlas says: now they are the stars.'),
    N('The first sunlight comes over the mountain and through the door.'),
    XM('There they are. There they both are.', 'happy'),
  ],
  [
    doit(
      4,
      'science',
      'the Sun rises in the east',
      '1-ESS1-1',
      'edu:point:east:sunrise',
      [
        GM('The Sun comes up in the east. That is where the day begins.'),
        N('(Point to where the sun comes up in the picture. That is east!)'),
      ],
      'Learned that the Sun rises in the east, and pointed to it.',
    ),
  ],
  {
    choices: [
      ch('wave', 'Wave.', [N('After a moment Xmucane waves too, as if nobody is watching.')]),
      ch('still', 'Stay still under her hand.', [
        N('You do not move, and neither does she. The sun gets on with it.'),
      ]),
    ],
  },
);

const V_COMPLETE_STAY_16 = sc(
  'a31-16-complete-stay',
  [
    XM(
      'You watched the corn with me. That is the hard part. The boys only had to be clever.',
      'soft',
    ),
    N('She takes a green stone on a cord from round her own neck.'),
    N('She ties it on your Nubbin.'),
    XM('For sitting up. Nobody gives you anything for sitting up. They should.'),
    SOFT_EDGE,
  ],
  [
    notice(
      1,
      'sel',
      'waiting with someone is a gift',
      'CASEL: Relationship skills',
      [GM('Waiting with someone is a big gift.'), GM('You cannot see it, but they can feel it.')],
      'Learned that waiting with someone is a kind gift.',
    ),
  ],
);

const V_RIBBONS_16 = sc(
  'a31-16-ribbons',
  [
    N('For a moment the smoke parts, and you are back in the kitchen.'),
    GD('Look! Two colours sewn down the middle!', 'happy'),
    GM('Somebody sewed that very carefully.', 'soft'),
    N('Then the smoke closes, and you are back at sunrise.'),
  ],
  [
    ask(
      1,
      'art',
      'name the colour in the middle',
      'ELOF: Approaches to Learning',
      [
        N(
          'The ribbon is gold on one side and silver on the other. What colour is sewn down the middle?',
        ),
      ],
      [
        o('Green', [N('Yes! Green stitches join the gold and the silver.')], true),
        o('Red', [N('Look again: gold, green, silver. Green is down the middle.')]),
      ],
      'Looked closely at a ribbon and named its colours.',
    ),
  ],
);

const V_COMPLETE_STAY_17 = sc(
  'a31-17-complete-stay',
  [
    N('The smoke rises. You are back at your own table, with the atlas open.'),
    N('A black rubber ball is on the floor. Your Nubbin sits on it.'),
    N('Caught in the atlas spine is an ear of corn, still green.'),
    N('It is soft, and it smells like a field after rain.'),
    N('You hang it from the middle beam of the cottage.'),
    N('Out by the pond, the Nubbins come to look at the new ball. Nobody uses hands.'),
  ],
  [
    notice(
      3,
      'science',
      'green corn is still growing; later it turns golden and dry, and its seeds can grow again',
      'K-LS1-1',
      [
        GM('Green corn is still growing.'),
        GM('Later it turns golden and dry. Its seeds can grow into new plants!'),
      ],
      'Learned that green corn is still growing and that its dry seeds can grow into new plants.',
    ),
  ],
);

const V_BYTE = sc(
  'a31-grove-byte',
  [
    N('Byte is by the pond, watching your Nubbin play hip-ball. Its ribbons flap.'),
    N('The sun is going down behind the hill. On the other side, the moon is already up.'),
    BY('Same sky. It was always the same sky. I would like that read into the record.'),
    N('He goes back to his notebook.'),
  ],
  [
    notice(
      1,
      'science',
      'the Moon can be seen in the daytime, so the Sun and Moon can share the sky',
      '1-ESS1-1',
      [
        BY('The Sun and the Moon can be in the sky together.'),
        BY('Sometimes you can see a pale Moon in the daytime. Look up and see!'),
      ],
      'Learned that the Moon can be seen in the daytime, so the Sun and Moon can share the sky.',
    ),
  ],
);

// ================================================================== exports
export const EDU_A31_SPROUT: EduQuest[] = [
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
];

export const EDU_A31_SPROUT_VARIANTS: EduScene[] = [
  V_RIBBONS_1,
  V_ROAD_STAY,
  V_LORDS_STAY,
  V_DARK_STAY,
  V_DARK_DONE_STAY,
  V_HOUSES_STAY,
  V_RAT_COATI,
  V_RAT_COURT,
  V_BATS_STAY,
  V_GAME_STAY,
  V_COATI_TOLD,
  V_COURT_TOLD,
  V_OVEN_STAY,
  V_RIVER_STAY,
  V_DANCERS_STAY,
  V_CURTAIN_STAY,
  V_MARGIN_HAZEL,
  V_FATHER_STAY,
  V_RISE_STAY,
  V_COMPLETE_STAY_16,
  V_RIBBONS_16,
  V_COMPLETE_STAY_17,
  V_BYTE,
];

/** Every `edu:` check string used by the lessons above. */
export const CHECKS: string[] = [
  ...new Set(
    [...EDU_A31_SPROUT.flatMap((q) => q.scenes), ...EDU_A31_SPROUT_VARIANTS].flatMap((s) =>
      s.lessons.flatMap((l) => (l.check ? [l.check] : [])),
    ),
  ),
].sort();
