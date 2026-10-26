/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Pixel’s Arcade cartridge
 * PA1, The Chao Altar.
 *
 * Source: arcade-pa1.ts (ARCADE_PA1 and PA1_VARIANTS). One EduScene per original scene, id
 * `sprout:<original id>`: every step scene, every done scene, every complete scene and every
 * variant an open gate can reach, each with exactly one lesson. Choice ids and `set` flags are copied from the originals
 * so the cartridge’s own flags (pa1-gate, pa1-stood) still work. See EDU-STYLE.md.
 *
 * - The frame: you step through Pixel’s cabinet with your Nubbin; Pixel (she/her) stays outside
 *   and talks through the speaker. You are a guest in the cartridge. Sonic and his friends keep
 *   their story; your Nubbin acts and never speaks. Chao, Chaos, Froggy and the birds never speak.
 * - Dropped for this age (EDU-STYLE.md, “Hard things”): the gate’s “lock” choice in pa1-02-gate
 *   (`defaultChoice: 'open'`), so a sprout never sees the huddled Chao, and pa1-17-chao tells you
 *   the open gate was your doing. The lock-only variants (pa1-17-chao-locked, pa1-18-last-locked,
 *   pa1-18-last-locked-stood) cannot play in this band and have no sprout version (exempt in
 *   content-check). Every other choice is kind and is kept.
 * - Hard things said plainly, once, with comfort straight after: Tikal lived long ago and died;
 *   her light stayed to look after Chaos. Some Chao died the day the warriors came; Tikal stayed
 *   with Chaos so it was not alone. Knuckles’s people died long ago, and now he has friends. Gamma’s
 *   end is not shown: the last thing is birds flying free. Nobody is hurt in the flood.
 * - Chaos is never called a monster or evil. It is the one who worries most, and it is sad.
 * - Neither lifted prayer line appears. The prayer is “Tikal’s grandmother’s words”, never given.
 * - Pixel hums Cinder’s tune without the words; no rhyme is quoted.
 */
import type { EduDomain, EduQuest, EduScene, Lesson } from './types';
import type { Choice, Line, Mood } from '../config/story';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const Y = say('you');
const PX = say('pixel');
const CK = say('clank');
const TI = say('pa1-tikal');
const SO = say('pa1-sonic');
const TA = say('pa1-tails');
const KN = say('pa1-knuckles');
const AM = say('pa1-amy');
const BI = say('pa1-big');
const GA = say('pa1-gamma');
const EG = say('pa1-eggman');
const PA = say('pa1-pachacamac');
const OF = say('pa1-officer');
const RA = say('pa1-radio');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

/** One answer option. `best` marks the answer the lesson teaches. */
const o = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

const ask = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | null,
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

const doIt = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | null,
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
): EduQuest => ({ id: `sprout:${of}`, of, band: 'sprout', title, goals, scenes });

/** A choice with the original id (and `set` flag, if it had one). */
const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice =>
  set ? { id, label, set, then } : { id, label, then };

const G = (goal: string, hint: string) => ({ goal, hint });

// ================================================================== PA1-1 The Cabinet
const Q01: EduQuest = quest(
  'pa1-01',
  'The Cabinet',
  {
    'pa1-01-s1': G('Look at Pixel’s big game box.', 'It is in the lantern shed, by the back wall.'),
    'pa1-01-s2': G(
      'Push the cartridge in. Step through!',
      'Push it in the slot. Step on the plate.',
    ),
  },
  [
    sc(
      'pa1-01-shed',
      [
        N('The lantern shed smells of sawdust. Something is humming.'),
        N('It is a big old game box. It has a dent in the side.'),
        PX('Don’t touch the coin slot. A mouse family lived in there!', 'happy'),
        PX('I fixed it. One fuse, four wires. Three whole days.'),
        PX('Byte says it might catch fire. Byte says that about toast.'),
        N('Pixel lifts a flap. Inside sit five cartridges in a row.'),
        PX('Each one is a whole world. You go in. I stay here.'),
        N('The label shows a garden, a pool, and little round creatures.'),
        N('Your Nubbin presses its face to the picture. It goes very still.'),
      ],
      [
        ask(
          5,
          'maths',
          'count to 5',
          'K.CC.B.5',
          [PX('How many cartridges are in the row? (Count them together.)')],
          [
            o('Five', [PX('Five! One, two, three, four, five. Five worlds.')], true),
            o('Three', [PX('Let’s count again. One, two, three, four, five. Five!')]),
          ],
          'Your child counted five cartridges.',
        ),
      ],
      {
        choices: [
          ch('cousins', 'They look like our Nubbins.', [PX('Don’t they? Like cousins.', 'soft')]),
          ch('safe', 'Is it safe in there?', [
            PX('Safe as a game. You can’t get hurt. You might get wet feet.'),
            PX('And I will talk to you the whole time.'),
          ]),
          ch('old', 'How old is this thing?', [
            PX('Very old. Older than the sawmill roof.', 'think'),
          ]),
        ],
      },
    ),
    sc(
      'pa1-01-shed-done',
      [
        N('Pixel blows the dust off the cartridge. Puff!'),
        N('She wipes the shiny bit on her sleeve.'),
        PX('Clean contacts, happy cartridge. Everyone knows that.'),
      ],
      [
        ask(
          0,
          'science',
          'blowing moves dust',
          'ELOF: Scientific Reasoning',
          [N('Pixel blows. The dust flies off. What moved the dust?')],
          [
            o('The air from her puff', [N('Yes! Moving air pushes dust away. Puff!')], true),
            o('Magic', [N('Not magic. Her puff is moving air, and air can push dust. Puff!')]),
          ],
          'Your child noticed that moving air pushes dust.',
        ),
      ],
    ),
    sc(
      'pa1-01-slot',
      [
        N('Clunk! The cartridge goes in. The screen goes blue, then white.'),
        N('A sound like the sea comes out of the speaker. Shhhh.'),
        PX('Player two, ready!', 'happy'),
        PX('Rules. I can see you. I can’t come in. Say if you want out.'),
        N('The screen is a window now. Warm air comes through. It smells of grass.'),
        N('Your Nubbin looks at you. Then at the window. Then at you.'),
        Y('Together, then.'),
        N('You pick up your Nubbin and lean into the light.'),
      ],
      [
        ask(
          3,
          'sel',
          'asking for help',
          'CASEL: Self-management',
          [PX('If you feel scared in there, what can you do?')],
          [
            o('Say so, and Pixel helps', [PX('Yes! Just say the word. I am right here.')], true),
            o('Keep quiet', [PX('You don’t have to keep quiet. Say so, and I will help.')]),
          ],
          'Your child learned to ask for help when scared.',
        ),
      ],
    ),
    sc(
      'pa1-01-slot-done',
      [
        N('Behind you, the shed goes small and far away.'),
        N('Like a room seen through a keyhole.'),
        PX('See you on the other side! Well, I’ll see you.'),
      ],
      [
        ask(
          1,
          'science',
          'far-away things look small',
          'ELOF: Scientific Reasoning',
          [N('The shed looks tiny now. Is it near, or far away?')],
          [
            o('Far away', [N('Yes! Far-away things look small. Near things look big.')], true),
            o('Near', [N('It looks small because it is far away now.')]),
          ],
          'Your child noticed that far-away things look small.',
        ),
      ],
    ),
    sc(
      'pa1-01-complete',
      [
        N('Bump! You land on soft grass.'),
        N('There is a pool, a palm tree, and stepping stones.'),
        PX('You’re in! Your hair has gone a bit square. It suits you.', 'happy'),
        N('Your Nubbin rolls off your arm. It sits up and stares.'),
      ],
      [
        ask(
          1,
          'maths',
          'naming shapes',
          'K.G.A.2',
          [PX('Your hair has gone square! What shape is a square?')],
          [
            o('Four straight sides', [PX('Yes! Four sides, four corners. Square hair!')], true),
            o('Round', [
              PX('Round is a circle. A square has four straight sides and four corners.'),
            ]),
          ],
          'Your child described a square.',
        ),
      ],
    ),
  ],
);

// ================================================================== PA1-2 A Garden Like Ours
const Q02: EduQuest = quest(
  'pa1-02',
  'A Garden Like Ours',
  {
    'pa1-02-s1': G(
      'Meet the Chao in the garden.',
      'Walk round the pool. Your Nubbin will find them.',
    ),
    'pa1-02-s2': G('Look at the little gate.', 'It is between the grass and the hotel.'),
  },
  [
    sc(
      'pa1-02-garden',
      [
        N('It is a garden with a glass roof. You can see the sky.'),
        N('Eggs sit in the grass. Little round creatures wobble about.'),
        N('Each one has a tiny ball floating over its head.'),
        PX('Those are Chao. It says so on the sleeve. CHAO.'),
        N('Your Nubbin walks into the middle. A Chao sits on it!'),
        N('The Chao gets up and pats your Nubbin. Its ball turns into a heart.'),
        PX('They’re cousins. They are absolutely cousins.', 'happy'),
        N('A Chao gives your Nubbin half a fruit. Your Nubbin gives back a pebble.'),
      ],
      [
        ask(
          5,
          'sel',
          'reading a feeling from a sign',
          'ELOF: Social and Emotional Development',
          [N('The Chao’s ball turned into a heart. How does the Chao feel?')],
          [
            o('Happy', [N('Yes! A heart means happy. It likes your Nubbin.')], true),
            o('Cross', [N('Cross would be a spiral. A heart means happy!')]),
          ],
          'Your child read a feeling from a sign.',
        ),
      ],
    ),
    sc(
      'pa1-02-garden-done',
      [
        N('You find a watering can by the pool.'),
        N('You fill the trough under the fruit tree. Glug, glug.'),
        N('Three Chao come to watch, very seriously.'),
      ],
      [
        ask(
          1,
          'science',
          'what plants need',
          'K-LS1-1',
          [N('You give the tree water. Why does a tree need water?')],
          [
            o(
              'To grow and stay alive',
              [N('Yes! Plants drink water with their roots, to live and grow.')],
              true,
            ),
            o('To have a bath', [
              N('Trees don’t bath! They drink water through their roots, to grow.'),
            ]),
          ],
          'Your child learned that plants need water to live.',
        ),
      ],
    ),
    sc(
      'pa1-02-gate',
      [
        N('The garden door opens onto the hotel. A radio is on, loud.'),
        RA('…a creature made of water. Please stay indoors…'),
        N('Far away, sirens. The Chao don’t mind. They don’t know what sirens are.'),
        PX('Hmm. That’s new.', 'think'),
        N('The garden has a little wooden gate, with a latch and a key.'),
        PX('We could leave it open, so they can wander, like ours do.'),
        N('A Chao is sitting on the latch, swinging its feet.'),
      ],
      [
        ask(
          2,
          'science',
          'what a siren is for',
          'ELOF: Language and Communication',
          [N('Nee-naw, nee-naw! What is a siren for?')],
          [
            o(
              'To say “make way, hurry!”',
              [N('Yes! A loud siren means helpers are coming. Make way!')],
              true,
            ),
            o('To sing a song', [
              N('It is loud, not a song. It says: helpers are coming, make way!'),
            ]),
          ],
          'Your child learned what a siren means.',
        ),
      ],
      {
        choices: [
          ch(
            'open',
            'Leave it open. Let them come and go.',
            [
              N('You prop the gate with a stone. The Chao rides it open. Wheee!'),
              PX('Chao who go out and come home, like ours. All right.'),
            ],
            { 'pa1-gate': 'open' },
          ),
        ],
        defaultChoice: 'open',
      },
    ),
    sc(
      'pa1-02-gate-done',
      [
        N('The sirens go off toward the square.'),
        N('Your Nubbin is the last to leave the pool. It looks back twice.'),
      ],
      [
        ask(
          1,
          'sel',
          'saying goodbye kindly',
          'ELOF: Social and Emotional Development',
          [N('Your Nubbin looks back at its new friends. What can you do?')],
          [
            o('Wave and say “see you soon”', [N('Yes! A wave says goodbye nicely. Wave!')], true),
            o('Run off', [N('Running off is not kind. A wave says: see you soon!')]),
          ],
          'Your child practised a kind goodbye.',
        ),
      ],
    ),
    sc(
      'pa1-02-complete',
      [
        N('The radio is still talking. The man turns it up, then down, then up.'),
        PX('Let’s go and look. Just look. From far away.'),
        PX('I said “far away”. Remember I said it.', 'think'),
      ],
      [
        ask(
          1,
          'health',
          'keeping a safe distance',
          'ELOF: Perceptual, Motor, and Physical Development',
          [PX('Something big and strange is in the square. Where do we stand?')],
          [
            o(
              'Far back, where it’s safe',
              [PX('Yes! Far back. Look with your eyes, not your hands.')],
              true,
            ),
            o('Right up close', [PX('Not close! Stand far back and look with your eyes.')]),
          ],
          'Your child learned to keep a safe distance from something strange.',
        ),
      ],
    ),
  ],
);

// ================================================================== PA1-3 The Water Creature
const Q03: EduQuest = quest(
  'pa1-03',
  'The Water Creature',
  {
    'pa1-03-s1': G('Go and see what is in the square.', 'Through the hotel, out to the tape.'),
    'pa1-03-s2': G('Hide behind the bench and watch.', 'Keep your Nubbin behind the bench.'),
  },
  [
    sc(
      'pa1-03-square',
      [
        N('The square is bright glass and fountains. Today it has police tape too.'),
        N('In the middle stands something made of clear water.'),
        N('It is shaped like a person. Its heart glows green.'),
        OF('Stay back, please. Behind the line. You too, and your… whatever that is.'),
        N('Your Nubbin holds your shirt with both hands.'),
        PX('Look at its head! Look at the shape!', 'shock'),
        N('Its head curls up and over. Just like a Chao. Just like your Nubbin.'),
      ],
      [
        ask(
          6,
          'maths',
          'spotting what is the same',
          'K.MD.A.2',
          [PX('The creature’s head and your Nubbin’s head. Same, or different?')],
          [
            o('The same curl', [PX('Yes! Both curl up and over. Same shape!')], true),
            o('Different', [PX('Look again. Both curl up and over. Same shape!')]),
          ],
          'Your child compared two shapes and found a match.',
        ),
      ],
    ),
    sc(
      'pa1-03-square-done',
      [N('Then a blue blur zooms down the street. Whoosh!'), N('Everyone’s hair stands up.')],
      [
        ask(
          0,
          'literacy',
          'sound words',
          'RL.1.4',
          [N('Whoosh! What does “whoosh” tell you?')],
          [
            o(
              'Something went past fast',
              [N('Yes! Whoosh is the sound of fast. Say it: whoosh!')],
              true,
            ),
            o('Something is asleep', [N('Asleep would be “zzz”. Whoosh means fast! Whoosh!')]),
          ],
          'Your child matched a sound word to its meaning.',
        ),
      ],
    ),
    sc(
      'pa1-03-sonic',
      [
        SO('Hey, hey! Everybody back! I’ve got this one.', 'happy'),
        N('A blue hedgehog skids to a stop. He is grinning.'),
        N('He bounces. The creature splashes. You stay behind the bench.'),
        N('Then the creature pours into a drain, all at once. Glug.'),
        SO('Huh. Slippery. Didn’t even say goodbye.', 'think'),
        N('Just before it goes, it looks at your Nubbin.'),
        N('It does not look cross. It looks lost.'),
        PX('Did you see? It wasn’t angry. It was lost.', 'soft'),
      ],
      [
        ask(
          6,
          'sel',
          'naming a feeling',
          'ELOF: Social and Emotional Development',
          [N('The creature looked lost. How does lost feel?')],
          [
            o('Scared and alone', [N('Yes. Lost feels scared and alone. A friend helps.')], true),
            o('Happy', [N('Lost is not happy. It feels scared and alone. A friend helps.')]),
          ],
          'Your child named the feeling of being lost.',
        ),
      ],
      {
        choices: [
          ch('tell', 'Tell Sonic it looked lost.', [
            SO('Lost things still splash. Thanks, though.'),
          ]),
          ch('drain', 'Look down the drain.', [N('The water runs away fast. It glows green.')]),
          ch('quiet', 'Say nothing.', []),
        ],
      },
    ),
    sc(
      'pa1-03-sonic-done',
      [
        N('Sonic is gone, fast as he came.'),
        N('The police roll up their tape.'),
        PX('So that’s the water creature. We will see it again.'),
      ],
      [
        ask(
          0,
          'science',
          'water takes the shape of its container',
          '2-ESS2-3',
          [PX('The creature poured down the drain. Why can water do that?')],
          [
            o(
              'Water flows and fits any shape',
              [PX('Yes! Water is a liquid. It flows and fits any hole.')],
              true,
            ),
            o('Water is hard', [PX('Ice is hard. Water flows. It fits any hole it finds!')]),
          ],
          'Your child learned that liquid water flows into any shape.',
        ),
      ],
    ),
    sc(
      'pa1-03-complete',
      [
        N('A small pink light bobs above the drain. It is plum-sized.'),
        N('It comes to your face. It circles your Nubbin once. Then it waits.'),
        PX('That’s not on the sleeve either.', 'think'),
      ],
      [
        ask(
          0,
          'maths',
          'size words',
          'K.MD.A.2',
          [N('The light is the size of a plum. Is that big, or small?')],
          [
            o('Small', [N('Yes! Plum-sized is small. Small enough to hold.')], true),
            o('Big', [N('A plum fits in your hand. That is small!')]),
          ],
          'Your child compared a size to a plum.',
        ),
      ],
    ),
  ],
);

// ================================================================== PA1-4 The Light
const Q04: EduQuest = quest(
  'pa1-04',
  'The Light',
  {
    'pa1-04-s1': G('Follow the pink light.', 'It waits for you down the quiet street.'),
    'pa1-04-s2': G('Sit by the pool with Tikal.', 'Sit on the warm stone, quietly.'),
  },
  [
    sc(
      'pa1-04-follow',
      [
        N('The pink light drifts down a quiet street. It waits for you.'),
        N('It is warm. Not hot like a lamp. Warm like a hand.'),
        PX('There’s no button for this. It isn’t me.', 'think'),
        N('Your Nubbin reaches up. The light dips to be touched.'),
        PX('It likes your Nubbin. That’s a good sign.'),
        N('At the end of the street, the light grows and grows.'),
      ],
      [
        ask(
          1,
          'science',
          'warm and hot',
          'K.MD.A.2',
          [N('Warm like a hand, or hot like a lamp. Which is safe to touch?')],
          [
            o(
              'Warm like a hand',
              [N('Yes! Warm is safe. Hot can burn. We don’t touch hot lamps.')],
              true,
            ),
            o('Hot like a lamp', [N('Hot lamps can burn. Warm, like a hand, is safe to touch.')]),
          ],
          'Your child told warm from hot.',
        ),
      ],
    ),
    sc(
      'pa1-04-follow-done',
      [
        N('The city sounds go out, like a candle.'),
        N('Birds sing instead. It smells of warm stone.'),
        PX('Keeper? The screen’s gone gold. Where are you?', 'shock'),
      ],
      [
        ask(
          1,
          'literacy',
          'listening for sounds',
          'ELOF: Language and Communication',
          [N('Close your eyes. What can you hear now? (Wait for an answer.)')],
          [
            o('Birds singing', [N('Yes! Tweet, tweet. Birds. The city is gone.')], true),
            o('Cars and sirens', [N('Not any more! Listen. Tweet, tweet. Birds.')]),
          ],
          'Your child listened for a sound in the story.',
        ),
      ],
    ),
    sc(
      'pa1-04-shrine',
      [
        N('You stand on old stone steps by a jungle. It is morning, long ago.'),
        N('On a stone altar sits a huge green jewel. It glows.'),
        N('Around it are pools of clear water, full of Chao.'),
        N('A girl sits with her feet in the pool. She has long braids.'),
        TI('Oh! A visitor. And a little one. Sit down quietly.', 'happy'),
        TI('I’m Tikal. Your little one looks like a cousin of ours.'),
        N('Then the water rises. It is the water creature.'),
        N('It is not lost now. It stands tall and watches over the Chao.'),
        TI('Don’t be afraid. That’s Chaos. It looks after them.', 'soft'),
        TI('Some say it’s a monster. It isn’t. It just worries the most.'),
      ],
      [
        ask(
          9,
          'sel',
          'worrying about someone',
          'CASEL: Social awareness',
          [TI('Chaos worries about the Chao. Who worries about you?')],
          [
            o(
              'The grown-ups who love me',
              [TI('Yes. Worrying is a kind of loving. Chaos loves the Chao.')],
              true,
            ),
            o('Nobody', [
              TI('Someone does! The grown-ups who love you. Worrying is a kind of loving.'),
            ]),
          ],
          'Your child talked about who looks after them.',
        ),
      ],
      {
        choices: [
          ch('bow', 'Bow to Chaos.', [N('You bow. Chaos lowers its head, just a little.')]),
          ch('ask', 'Ask Tikal what it is.', [
            TI('It was a Chao once. The jewel’s light changed it.'),
          ]),
          ch('watch', 'Watch your Nubbin.', [
            N('Your Nubbin floats to Chaos’s feet. Chaos turns it the right way up.'),
          ]),
        ],
      },
    ),
    sc(
      'pa1-04-shrine-done',
      [
        N('The gold comes back. The birds go quiet.'),
        N('You are in the street, with your hand on a wall.'),
        PX('You were gone nine seconds. Nine! You look like it was all afternoon.', 'shock'),
      ],
      [
        ask(
          2,
          'maths',
          'short and long times',
          'ELOF: Mathematics Development',
          [PX('Nine seconds, or all afternoon. Which is longer?')],
          [
            o('All afternoon', [PX('Yes! An afternoon is hours. Nine seconds is a blink.')], true),
            o('Nine seconds', [PX('Count to nine. Done already! An afternoon is much longer.')]),
          ],
          'Your child compared a short time with a long one.',
        ),
      ],
    ),
    sc(
      'pa1-04-complete',
      [
        PX('That was the water creature. But kind.', 'think'),
        Y('It was looking after them.'),
        PX('Then what happened to it?'),
        N('The pink light bobs at your shoulder and goes quiet.'),
      ],
      [
        ask(
          0,
          'literacy',
          'then and now',
          'RL.K.3',
          [PX('Long ago, Chaos was kind and calm. Now it looks lost. Which came first?')],
          [
            o(
              'Kind and calm',
              [PX('Yes. First kind, long ago. Lost came after. Something happened.')],
              true,
            ),
            o('Lost', [
              PX('The pool was long, long ago. First kind, then lost. Something happened.'),
            ]),
          ],
          'Your child put two story events in order.',
        ),
      ],
    ),
  ],
);

// ================================================================== PA1-5 Tails’s Workshop
const Q05: EduQuest = quest(
  'pa1-05',
  'Tails’s Workshop',
  {
    'pa1-05-s1': G('Ride the train to the workshop.', 'The station is across the square.'),
    'pa1-05-s2': G('Give Tails the right spanner.', 'Your Nubbin knows which one.'),
    'pa1-05-s3': G('Hide when Eggman comes.', 'Get behind the bench. Stay there.'),
  },
  [
    sc(
      'pa1-05-train',
      [
        N('A train takes you to a green valley full of old stones.'),
        N('On the hill is a workshop with a bright little plane.'),
        TA('Hand me the… no, the… thank you, that’s the one.'),
        N('A young fox is inside the plane’s nose. He has two tails!'),
        TA('Hi! I’m Tails. Your friend has a head like a Chao.'),
        TA('We found a jewel. It’s making my instruments go funny.'),
        PX('A fox with two tails, who fixes planes. I love this game.', 'happy'),
      ],
      [
        ask(
          3,
          'maths',
          'add 1',
          'K.OA.A.1',
          [N('A fox has one tail. Tails has one more! How many?')],
          [
            o('Two', [N('Yes! One and one more is two. Two tails!')], true),
            o('Three', [N('One tail, and one more. Hold up one finger, then another. Two!')]),
          ],
          'Your child added one to one.',
        ),
      ],
    ),
    sc(
      'pa1-05-train-done',
      [
        N('Tails hooks a stool out with his foot. He keeps working.'),
        N('Your Nubbin climbs onto the stool and watches.'),
      ],
      [
        ask(
          0,
          'sel',
          'being a good helper',
          'ELOF: Approaches to Learning',
          [N('Tails is busy. How can you be a good helper?')],
          [
            o(
              'Wait, watch, and pass things',
              [N('Yes! Watch, wait, and hand him what he needs.')],
              true,
            ),
            o('Grab the tools and run', [
              N('Grabbing would not help. Watch, wait, and pass things.'),
            ]),
          ],
          'Your child thought about how to help someone busy.',
        ),
      ],
    ),
    sc(
      'pa1-05-spanner',
      [
        TA('Pass the spanner? The silver one.'),
        N('There are seven silver spanners on the bench.'),
        TA('The other silver one.'),
        N('Your Nubbin picks one up in both arms. It beams.'),
        PX('Tell him “the shiny one.”'),
        N('All seven are shiny. The whole bench is shiny.'),
        TA('Nearly there. The jewel is sending out a signal. Something is following it.', 'think'),
      ],
      [
        doIt(
          1,
          'maths',
          'count to 7',
          'K.CC.B.5',
          'edu:count:spanners:7',
          [N('Count the spanners on the bench. (Touch each one as you count.)')],
          'Your child counted seven spanners by touching each one.',
        ),
      ],
      {
        choices: [
          ch('nubbin', 'Take the one your Nubbin is holding.', [
            TA('That’s it! Thank you, both of you.', 'happy'),
          ]),
          ch('small', 'Hand him the smallest.', [
            TA('Close! One up.'),
            N('Your Nubbin hands him the right one.'),
          ]),
          ch('ask', 'Ask which one he means.', [
            TA('The shiny one. Sorry. They are all shiny.'),
            N('Your Nubbin is already holding it.'),
          ]),
        ],
      },
    ),
    sc(
      'pa1-05-spanner-done',
      [
        N('The engine coughs. Then it purrs. Brrrm!'),
        N('Tails punches the air. He bangs his head on the propeller. Bonk!'),
      ],
      [
        ask(
          0,
          'literacy',
          'sound words',
          'RF.K.2',
          [N('Cough, purr, brrrm! Which sound is the engine working well?')],
          [
            o('Brrrm', [N('Yes! Brrrm is a happy engine. Say it: brrrm!')], true),
            o('Cough', [N('A cough is a poorly engine. Brrrm is a happy one. Brrrm!')]),
          ],
          'Your child matched sound words to what they mean.',
        ),
      ],
    ),
    sc(
      'pa1-05-ambush',
      [
        N('A shadow falls on the runway. A round machine hums down.'),
        N('In it sits a round man with a huge moustache.'),
        EG('Good afternoon! I’ll take that jewel. Don’t get up.', 'happy'),
        TA('It’s Eggman! Sonic, he’s here!', 'shock'),
        N('You get down behind the bench with your Nubbin. Small as can be.'),
        N('Clatter! A metal claw grabs the jewel.'),
        N('The water creature rises from a puddle. Eggman tosses it the jewel.'),
        N('It swallows the light, and grows. Its eyes look at nothing.'),
        EG('Two jewels, two sizes! Toodle-oo!'),
      ],
      [
        ask(
          4,
          'health',
          'making yourself small and safe',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('You get down behind the bench. Can you make yourself small? (Try it!)')],
          [
            o('Curl up small', [N('Yes! Curl up behind something safe, and wait.')], true),
            o('Jump up and shout', [N('Not now. Curl up small behind the bench, and wait.')]),
          ],
          'Your child practised staying small and safe.',
        ),
      ],
    ),
    sc(
      'pa1-05-ambush-done',
      [
        N('Sonic chases the creature into the valley.'),
        N('Eggman’s machine hums away over the trees.'),
        TA('Are you two all right?'),
        PX('Nobody look at the claw marks on the bench. Nobody.', 'shock'),
      ],
      [
        ask(
          2,
          'sel',
          'checking on a friend',
          'CASEL: Relationship skills',
          [N('Tails asks if you are all right. Why is that kind?')],
          [
            o(
              'He cares how you feel',
              [N('Yes! Asking “are you all right?” shows you care.')],
              true,
            ),
            o('He is being nosy', [N('Not nosy. Asking “are you all right?” shows you care.')]),
          ],
          'Your child noticed a caring question.',
        ),
      ],
    ),
    sc(
      'pa1-05-complete',
      [
        N('Tails finds another spanner inside the plane’s nose. It was there all along!'),
        TA('Thanks for the help. Most people just ask about the tails.'),
        PX('I was going to ask about the tails.', 'sad'),
        N('Tails says your Nubbin can keep its spanner. It carries it everywhere.'),
      ],
      [
        ask(
          0,
          'sel',
          'where did I leave it?',
          'ELOF: Approaches to Learning',
          [N('The spanner was in the plane all along. What helps you find lost things?')],
          [
            o(
              'Think where you had it last',
              [N('Yes! Think back to where you had it last. Then look there.')],
              true,
            ),
            o('Cry', [N('Crying is allowed, but first think: where did I have it last?')]),
          ],
          'Your child learned a way to find lost things.',
        ),
      ],
    ),
  ],
);

// ================================================================== PA1-6 The Shattered Emerald
const Q06: EduQuest = quest(
  'pa1-06',
  'The Shattered Emerald',
  {
    'pa1-06-s1': G('Visit the floating island.', 'Tails flies you there. Climb the steps.'),
    'pa1-06-s2': G('Help Knuckles find the green pieces.', 'Look in the ferns on the left.'),
  },
  [
    sc(
      'pa1-06-island',
      [
        N('High in the sky floats a whole island! Tails flies you there.'),
        N('In the middle is a shrine with steps. On top, the big green jewel.'),
        N('Someone sits on the steps with his arms folded, glaring.'),
        KN('Who let you up here? Nobody comes up here.', 'angry'),
        KN('I’m Knuckles. I guard the Master Emerald. Don’t touch it. Don’t lick it.'),
        N('Your Nubbin, who was about to lick it, sits down.'),
        KN('…It can stay. It looks like a Chao. Chao lived up here once.', 'soft'),
        N('Then the sky goes dark! The jewel flashes. The steps shake.'),
        N('Water rises out of the jewel and strikes it. Crack!'),
        N('The jewel breaks into a hundred green pieces. They fly everywhere.'),
        EG('Splendid work, Chaos! Enjoy your swim, Knuckles!', 'happy'),
        N('The island tips, slowly, like a big ship. Then it falls.'),
      ],
      [
        ask(
          6,
          'sel',
          'rules keep things safe',
          'CASEL: Responsible decision-making',
          [N('Knuckles says: don’t touch, don’t lick. Why does he have rules?')],
          [
            o(
              'To keep the jewel safe',
              [N('Yes. The jewel is precious. Rules keep precious things safe.')],
              true,
            ),
            o('Because he is mean', [
              N('Not mean. He is a guard. Rules keep precious things safe.'),
            ]),
          ],
          'Your child thought about why a rule exists.',
        ),
      ],
    ),
    sc(
      'pa1-06-island-done',
      [
        N('You hold the steps and hold your Nubbin.'),
        N('SPLASH! The island lands in the sea, with a long sigh.'),
        N('When the spray settles, it floats. Everyone is fine.'),
        PX('You’re all right? Good. My hands are shaking out here.', 'shock'),
      ],
      [
        ask(
          2,
          'science',
          'floating',
          'ELOF: Scientific Reasoning',
          [N('The island floats on the sea. What else floats? (Think of bath time.)')],
          [
            o('A boat, or a duck', [N('Yes! Boats and rubber ducks float. Stones sink.')], true),
            o('A stone', [N('A stone sinks, plop. Boats and ducks float on top!')]),
          ],
          'Your child named something that floats.',
        ),
      ],
    ),
    sc(
      'pa1-06-shards',
      [
        KN('Great. A hundred pieces, everywhere.', 'angry'),
        KN('Without the jewel, the island stays down. Guarding it is my job.', 'sad'),
        N('He kicks a stone. He stares at the jungle. He does not move.'),
        PX('He’ll be ages. Look how much jungle there is.'),
        N('Your Nubbin trots into the ferns. It comes back with a green piece!'),
        KN('…How did it do that?', 'shock'),
        PX('Nubbins are good at finding green things.', 'happy'),
        KN('Fine. Small one, you’re with me. Keeper, keep up.'),
      ],
      [
        ask(
          2,
          'sel',
          'a big job feels smaller with help',
          'CASEL: Relationship skills',
          [N('Knuckles has a big job and feels stuck. What helps?')],
          [
            o('A friend to help look', [N('Yes! A big job feels smaller with a friend.')], true),
            o('Kicking more stones', [
              N('Kicking stones doesn’t find pieces. A friend helping does!'),
            ]),
          ],
          'Your child learned that help makes a big job smaller.',
        ),
      ],
      {
        choices: [
          ch('search', 'Search with Knuckles.', [
            KN('You take the left. I’ll take the right. Shout if you find one.'),
          ]),
          ch('people', 'Ask about his people.', [
            KN('Echidnas. There was a whole clan. Now there’s me.', 'sad'),
            KN('Anyway. Pieces. Left side.'),
          ]),
        ],
      },
    ),
    sc(
      'pa1-06-shards-done',
      [
        N('By sunset you have a sack of green pieces.'),
        N('Knuckles counts them twice and scowls. That is how he says thank you.'),
        KN('Not all of them. Not yet. But it’s a start.'),
      ],
      [
        ask(
          1,
          'maths',
          'counting again to check',
          'K.CC.B.4',
          [N('Knuckles counts the pieces twice. Why count twice?')],
          [
            o(
              'To check the number is right',
              [N('Yes! Counting again checks you got it right.')],
              true,
            ),
            o('Because he forgot how', [
              N('He didn’t forget. Counting again checks the number is right.'),
            ]),
          ],
          'Your child learned that counting again checks an answer.',
        ),
      ],
    ),
    sc(
      'pa1-06-complete',
      [
        N('Knuckles gives your Nubbin the smallest piece to hold.'),
        N('He takes it back. Then he gives it again.'),
        KN('Just for tonight. Don’t lose it. That piece is a bit of my home.'),
        N('Your Nubbin sleeps holding it. In the morning it gives it back.'),
      ],
      [
        ask(
          3,
          'sel',
          'giving something back',
          'CASEL: Responsible decision-making',
          [N('Your Nubbin gives the piece back without being asked. Why is that good?')],
          [
            o(
              'It was lent, not given',
              [N('Yes! When something is lent, we give it back. That builds trust.')],
              true,
            ),
            o('It didn’t like it', [
              N('It liked it! But it was lent, so it goes back. That builds trust.'),
            ]),
          ],
          'Your child learned that lent things go back.',
        ),
      ],
    ),
  ],
);

// ================================================================== PA1-7 The Prayer
const Q07: EduQuest = quest(
  'pa1-07',
  'The Prayer',
  {
    'pa1-07-s1': G('Go to the pink light by the altar.', 'It is at the top of the steps.'),
    'pa1-07-s2': G('Sit with Tikal while she learns.', 'Sit beside her on the top step.'),
  },
  [
    sc(
      'pa1-07-light',
      [
        N('In the morning, the pink light floats over the empty altar.'),
        N('It turns slow circles, as if it lost something.'),
        KN('That light’s been here since I was small. It just hangs about.', 'think'),
        KN('Go on, then. If it wants you, it wants you.'),
        PX('Gold screen again. Hold your Nubbin’s hand.'),
        N('Your Nubbin takes your finger. The light comes down like a warm hat.'),
      ],
      [
        ask(
          1,
          'maths',
          'shapes: circle',
          'K.G.A.2',
          [N('The light goes round and round. What shape is it drawing?')],
          [
            o('A circle', [N('Yes! Round and round makes a circle. Draw one in the air!')], true),
            o('A square', [N('A square has corners. Round and round is a circle!')]),
          ],
          'Your child named a circle.',
        ),
      ],
    ),
    sc(
      'pa1-07-light-done',
      [
        N('Birds sing. The stone is warm.'),
        N('The big green jewel is whole again, glowing on its altar.'),
      ],
      [
        ask(
          1,
          'literacy',
          'then and now',
          'RL.K.3',
          [N('Now the jewel is whole. Is this now, or long ago?')],
          [
            o(
              'Long ago',
              [N('Yes! The light took you back. Long ago, the jewel was whole.')],
              true,
            ),
            o('Now', [N('Now it is in pieces. Whole means long ago. The light took you back!')]),
          ],
          'Your child told long ago from now.',
        ),
      ],
    ),
    sc(
      'pa1-07-prayer',
      [
        N('Tikal kneels on the top step, hands together.'),
        N('She says the same words again and again, very quietly.'),
        N('Seven small jewels stand around the big one. Each is a different colour.'),
        TI('Oh, it’s you! Sit with me. Grandmother taught me the prayer.', 'happy'),
        TI('She said: learn it, not just say it.'),
        TI('It is about the seven jewels. I don’t know all it means yet.', 'think'),
        N('Down in the pools, the Chao splash. Chaos stands still, like a heron.'),
        TI('I think it means something I haven’t grown into yet.', 'soft'),
      ],
      [
        doIt(
          2,
          'art',
          'name colours',
          'K.MD.B.3',
          'edu:sort:colours:emeralds',
          [N('Seven jewels, seven colours. Point to each and say its colour. Red, blue…')],
          'Your child named the colours of the seven jewels.',
        ),
      ],
      {
        choices: [
          ch('chao', 'Maybe they are for the Chao.', [
            TI('The Chao? The smallest ones?', 'think'),
            TI('I like that.', 'happy'),
          ]),
          ch('who', 'Maybe it depends who’s asking.', [
            TI('Like a gate that opens for some. Maybe.', 'think'),
          ]),
          ch('listen', 'Just listen to her say it.', [
            N('You sit and listen. She says it slower.'),
            TI('Thank you. It goes easier with someone listening.', 'soft'),
          ]),
        ],
      },
    ),
    sc(
      'pa1-07-prayer-done',
      [
        N('The light comes back for you. Tikal smiles and waves.'),
        PX('She’s nice. Is it strange that I’m worried about her?', 'soft'),
      ],
      [
        ask(
          1,
          'sel',
          'worrying about a friend',
          'CASEL: Social awareness',
          [PX('I’m worried about Tikal. Is that strange?')],
          [
            o(
              'No, it means you care',
              [PX('That’s right. Worrying about a friend means you care.')],
              true,
            ),
            o('Yes, very strange', [
              PX('Not strange at all. Worrying about a friend means you care.'),
            ]),
          ],
          'Your child linked worry to caring.',
        ),
      ],
    ),
    sc(
      'pa1-07-complete',
      [
        KN('Well? What did it want?'),
        Y('To show me someone praying.'),
        KN('My people prayed here. Nobody was left to teach me.', 'sad'),
        N('He sits on the broken altar with his back to you. Nobody speaks.'),
      ],
      [
        ask(
          2,
          'sel',
          'sitting with someone who is sad',
          'ELOF: Social and Emotional Development',
          [N('Knuckles is sad. What is a kind thing to do?')],
          [
            o(
              'Sit quietly near him',
              [N('Yes. You don’t need words. Sitting near someone helps.')],
              true,
            ),
            o('Tell him to cheer up', [
              N('That can feel like a push. Sitting quietly near him helps more.'),
            ]),
          ],
          'Your child learned to sit with someone who is sad.',
        ),
      ],
    ),
  ],
);

// ================================================================== PA1-8 Amy and the Bird
const Q08: EduQuest = quest(
  'pa1-08',
  'Amy and the Bird',
  {
    'pa1-08-s1': G('Meet the girl running across the square.', 'She is heading for the fountain.'),
    'pa1-08-s2': G('Hide the bird in the garden.', 'Put the bird on the grass with the Chao.'),
    'pa1-08-s3': G('Stay very still while the robot looks.', 'Stay in the ring. Don’t move.'),
  },
  [
    sc(
      'pa1-08-amy',
      [
        N('A girl in a red dress runs across the square. She is holding something.'),
        N('A blocky red robot thumps behind her. Beep, beep.'),
        AM('Excuse me, sorry, coming through, out of the way!'),
        N('She skids round the fountain and nearly trips on your Nubbin.'),
        AM('Oh, you’re lovely. Hi. I’m Amy. I can’t stop.', 'happy'),
        N('In her arms is a little blue bird. It is trembling.'),
        AM('The robots keep chasing him! He hasn’t done anything!', 'angry'),
        PX('Look at its necklace. It’s glowing green.'),
        AM('Please. Have you got somewhere we could hide?'),
      ],
      [
        ask(
          5,
          'sel',
          'reading a scared animal',
          'ELOF: Social and Emotional Development',
          [N('The bird is trembling. How does the bird feel?')],
          [
            o('Scared', [N('Yes. Trembling means scared. Gentle hands help.')], true),
            o('Cold', [N('Maybe a bit! But it is being chased. Trembling means scared.')]),
          ],
          'Your child read fear in an animal.',
        ),
      ],
      {
        choices: [
          ch('garden', 'The Chao Garden, behind the hotel.', [
            AM('A garden with a door? Perfect. Lead the way.'),
          ]),
          ch('think', 'Let me think.', [
            AM('Think fast!'),
            N('Beep, beep. You think of the garden.'),
          ]),
        ],
      },
    ),
    sc(
      'pa1-08-amy-done',
      [
        N('You run for the hotel. Amy runs beside you.'),
        N('Your Nubbin bounces along behind, like a dropped ball.'),
      ],
      [
        ask(
          1,
          'literacy',
          'like a… (comparing)',
          'RL.1.4',
          [N('Your Nubbin bounces like a ball. Boing! What else bounces?')],
          [
            o('A frog, or a spring', [N('Yes! Boing, boing. Frogs and springs bounce too.')], true),
            o('A rock', [N('A rock goes thud. Frogs and springs bounce. Boing!')]),
          ],
          'Your child played with a comparison.',
        ),
      ],
    ),
    sc(
      'pa1-08-hide',
      [
        N('The garden is quiet. A Chao is asleep in the watering can.'),
        AM('Here? Will he be safe here?'),
        N('The bird hops onto the grass. A Chao comes to look.'),
        N('The Chao sits down by the bird. Another sits down too.'),
        N('Soon the bird is in the middle of a ring of Chao.'),
        PX('They’re hiding him. They’re hiding him with themselves.', 'soft'),
        N('Your Nubbin sits in the ring too. The bird stops trembling.'),
        AM('Oh, you darlings.', 'happy'),
      ],
      [
        doIt(
          4,
          'maths',
          'count to 6',
          'K.CC.B.5',
          'edu:count:chao:6',
          [N('Count the Chao in the ring. (Go round the circle together.)')],
          'Your child counted six Chao in a ring.',
        ),
      ],
    ),
    sc(
      'pa1-08-hide-done',
      [
        N('Footsteps in the hall. Thump. Thump. Heavy and slow.'),
        N('And a hum of machinery under them.'),
      ],
      [
        ask(
          0,
          'music',
          'slow and fast beats',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('Thump… thump… thump. Is that a slow beat, or a fast one? (Clap it.)')],
          [
            o('Slow', [N('Yes! Slow and heavy. Clap it slowly: thump… thump…')], true),
            o('Fast', [N('Fast would be thumpthumpthump. This one is slow: thump… thump…')]),
          ],
          'Your child clapped a slow beat.',
        ),
      ],
    ),
    sc(
      'pa1-08-gamma',
      [
        N('A tall robot steps in the door. Red and black, with a round face.'),
        GA('Target: small blue bird. Location: confirmed.'),
        AM('Don’t you dare!', 'angry'),
        N('The robot looks down. Six little faces look up.'),
        N('Six balls turn into exclamation marks!'),
        N('The robot’s arm stops halfway.'),
        GA('…Query.', 'think'),
        N('A Chao walks over and touches its foot.'),
        GA('This unit will report: target not found.'),
        N('It goes. At the door it stops, as if to say something. It doesn’t.'),
        PX('Did a robot just change its mind?', 'shock'),
      ],
      [
        ask(
          9,
          'sel',
          'changing your mind is allowed',
          'CASEL: Responsible decision-making',
          [N('The robot stopped itself. Is it all right to change your mind?')],
          [
            o(
              'Yes, when it is the kind thing',
              [N('Yes! Stopping to do the kind thing is brave.')],
              true,
            ),
            o('No, never', [N('It is allowed! Stopping to do the kind thing is brave.')]),
          ],
          'Your child learned that changing your mind can be kind.',
        ),
      ],
    ),
    sc(
      'pa1-08-gamma-done',
      [
        N('Amy lets out a big breath. Phew!'),
        AM('Did you see its face? It didn’t want to.', 'think'),
      ],
      [
        doIt(
          0,
          'health',
          'a big breath out',
          'ELOF: Perceptual, Motor, and Physical Development',
          'edu:breathe:slow:phew',
          [N('Amy lets out a big breath. You try! Breathe in… and out. Phew!')],
          'Your child did a calming breath out.',
        ),
      ],
    ),
    sc(
      'pa1-08-complete',
      [
        AM('I’ll find Sonic. He always knows what to do.'),
        N('She picks up the bird. She kisses every Chao on the head.'),
        N('That takes a while. Then she goes.'),
        PX('I’ve got a funny feeling.', 'think'),
      ],
      [
        ask(
          1,
          'maths',
          'more takes longer',
          'ELOF: Mathematics Development',
          [N('Amy kisses every Chao. Six kisses, or one kiss. Which takes longer?')],
          [
            o('Six kisses', [N('Yes! More kisses take more time. Mwah, mwah, mwah…')], true),
            o('One kiss', [N('One kiss is quick. Six take longer! Mwah, mwah, mwah…')]),
          ],
          'Your child linked more things to more time.',
        ),
      ],
    ),
  ],
);

// ================================================================== PA1-9 Big and Froggy
const Q09: EduQuest = quest(
  'pa1-09',
  'Big and Froggy',
  {
    'pa1-09-s1': G('Find who is calling in the jungle.', 'Follow the river to the plank hut.'),
    'pa1-09-s2': G('Sit still and fish with Big.', 'Sit on the bank. Keep still.'),
  },
  [
    sc(
      'pa1-09-big',
      [
        N('Deep in the jungle, a very big cat sits by a river, looking sad.'),
        BI('Froggy? Froggyyy.', 'sad'),
        N('He has a fishing rod and a huge tackle box.'),
        BI('Oh. Hello. I’m Big. Have you seen my friend? He’s a green frog.'),
        BI('He swallowed a shiny green stone. Then he grew a tail!', 'think'),
        PX('A green stone. Another jewel. And a tail like the water creature’s?', 'shock'),
        BI('He jumped in the river. I’ve been fishing for him all day.'),
        N('Your Nubbin sits by Big. Big pats its head with one big finger.'),
        BI('You can help. But you have to be quiet.'),
      ],
      [
        ask(
          4,
          'science',
          'frogs and tails',
          'K-LS1-1',
          [N('Froggy grew a tail. Do grown-up frogs have tails?')],
          [
            o(
              'No, only tadpoles do',
              [N('Yes! Baby frogs are tadpoles with tails. Grown frogs have none.')],
              true,
            ),
            o('Yes, long ones', [
              N('Grown frogs have no tails. Only baby tadpoles do. Froggy is being odd!'),
            ]),
          ],
          'Your child learned that tadpoles have tails and grown frogs do not.',
        ),
      ],
    ),
    sc(
      'pa1-09-big-done',
      [N('Big gives you a spare rod.'), N('On the end is a little rubber bug with a bell. Ting!')],
      [
        ask(
          1,
          'science',
          'what makes a sound',
          '1-PS4-1',
          [N('Ting! The little bell rings when it shakes. Why?')],
          [
            o(
              'Shaking makes it wobble and ring',
              [N('Yes! Wobbling, shaking things make sound. Ting!')],
              true,
            ),
            o('It is singing', [
              N('Bells don’t sing. Shaking makes them wobble, and wobbling makes sound!'),
            ]),
          ],
          'Your child learned that shaking makes sound.',
        ),
      ],
    ),
    sc(
      'pa1-09-fish',
      [
        N('You sit on the bank beside Big. The river slides by, slow.'),
        BI('Froggy likes it when you’re still. If you wiggle, he hides.'),
        N('Big is very good at being still. Your Nubbin is excellent.'),
        PX('This is the slowest game ever. I love it.', 'happy'),
        N('Dragonflies come and go.'),
        N('The bell rings once. Ting. Then it doesn’t.'),
      ],
      [
        doIt(
          2,
          'health',
          'being still',
          'CASEL: Self-management',
          'edu:sit:still:froggy',
          [N('Can you be as still as Big? Hands in your lap. Count to ten.')],
          'Your child practised being still for a count of ten.',
        ),
      ],
      {
        choices: [
          ch('wait', 'Keep waiting.', [N('You keep still. After a while, waiting feels easy.')]),
          ch('move', 'Try another spot.', [
            BI('Nope. This is the spot.'),
            N('You put the rod back down.'),
          ]),
        ],
      },
    ),
    sc(
      'pa1-09-fish-done',
      [
        N('Something green climbs out and sits on your Nubbin’s foot.'),
        N('It has a long, wobbly tail, clear as water.'),
        BI('FROGGY!', 'happy'),
        N('Froggy jumps back in the river. Splash! Big is still beaming.'),
        BI('He’s all right. He’s being silly. I always find him.'),
      ],
      [
        ask(
          3,
          'literacy',
          'first sound: F',
          'RF.K.2',
          [BI('Froggy starts with fff. What else starts with fff?')],
          [
            o('Fish, fox, foot', [BI('Yes! Fff: fish, fox, foot, Froggy!')], true),
            o('Cat, cup', [BI('Cat is c-c-c. Fff is fish, fox, foot, Froggy!')]),
          ],
          'Your child found words that start with F.',
        ),
      ],
    ),
    sc(
      'pa1-09-complete',
      [
        PX('A frog with a watery tail. The water creature has been near here.', 'think'),
        BI('That big water fella? I saw him. He was looking for something.'),
        BI('Same as me. I know that look.', 'soft'),
        N('Big goes back to his rod, perfectly still, waiting for his friend.'),
      ],
      [
        ask(
          2,
          'sel',
          'understanding someone else’s feeling',
          'CASEL: Social awareness',
          [N('Big says “I know that look.” How does he know how Chaos feels?')],
          [
            o(
              'He is looking for a friend too',
              [N('Yes. Big misses Froggy. So he understands missing someone.')],
              true,
            ),
            o('He read it in a book', [
              N('No book! Big misses Froggy, so he understands missing someone.'),
            ]),
          ],
          'Your child noticed someone understanding another’s feeling.',
        ),
      ],
    ),
  ],
);

// ================================================================== PA1-10 Pachacamac
const Q10: EduQuest = quest(
  'pa1-10',
  'Pachacamac',
  {
    'pa1-10-s1': G(
      'Go back with the light. See who has come.',
      'Stand at the bottom of the steps.',
    ),
    'pa1-10-s2': G('Choose where to stand with Tikal.', 'Up by Tikal, or down with the Chao.'),
  },
  [
    sc(
      'pa1-10-council',
      [
        N('The pink light finds you by the river. It is in a hurry.'),
        N('At the shrine it is evening. Torches burn on the steps.'),
        N('A crowd stands below the altar, in feathers and beads.'),
        N('At the front is a big echidna in a tall headdress. Tikal’s father.'),
        PA('Our neighbours have walls and spears. We have prayers.', 'angry'),
        PA('With the jewels’ power, nobody could ever threaten us again.'),
        N('The warriors bang their spears. The Chao stop playing and look up.'),
        TI('Father. Please. The jewels aren’t for that. Grandmother said…', 'sad'),
        PA('Your grandmother is gone, Tikal.'),
      ],
      [
        ask(
          6,
          'sel',
          'loud voices can be scary',
          'ELOF: Social and Emotional Development',
          [N('The spears bang. The Chao stop playing. How do the Chao feel?')],
          [
            o(
              'Worried',
              [N('Yes. Loud, cross noises make small ones worried. A cuddle helps.')],
              true,
            ),
            o('Excited', [
              N('Not excited. Loud, cross noises make small ones worried. A cuddle helps.'),
            ]),
          ],
          'Your child named how loud, cross noises feel.',
        ),
      ],
    ),
    sc(
      'pa1-10-council-done',
      [
        N('The warriors go quiet.'),
        N('Tikal looks round. She sees you at the bottom of the steps.'),
      ],
      [
        ask(
          1,
          'maths',
          'top and bottom',
          'K.G.A.1',
          [N('Tikal is at the top of the steps. Where are you?')],
          [
            o('At the bottom', [N('Yes! Tikal is at the top. You are at the bottom.')], true),
            o('At the top', [N('Tikal is at the top. You are down at the bottom, looking up.')]),
          ],
          'Your child used the position words top and bottom.',
        ),
      ],
    ),
    sc(
      'pa1-10-stand',
      [
        TI('The Chao live here because it’s peaceful. Take the power, and it won’t be.'),
        PA('Peace is a word for people who haven’t been attacked yet.'),
        TI('Then let us be those people, as long as we can.', 'soft'),
        N('Her father’s face does not change. He decided long ago.'),
        PX('He’s not listening, is he? Not really.', 'sad'),
        N('Tikal is shaking. She does not step back.'),
      ],
      [
        ask(
          5,
          'sel',
          'being brave while scared',
          'CASEL: Self-awareness',
          [N('Tikal is shaking, but she does not step back. What is that called?')],
          [
            o(
              'Being brave',
              [N('Yes! Brave is doing the right thing even when you’re scared.')],
              true,
            ),
            o('Being silly', [
              N('Not silly. Brave is doing the right thing even when you’re scared.'),
            ]),
          ],
          'Your child learned that brave means scared and doing it anyway.',
        ),
      ],
      {
        choices: [
          ch(
            'stand',
            'Climb up and stand beside her.',
            [
              N('You climb up and stand next to Tikal, so she isn’t alone.'),
              N('Her father looks at you. His face stays hard. Nothing changes.'),
              TI('Thank you.', 'soft'),
            ],
            { 'pa1-stood': true },
          ),
          ch(
            'chao',
            'Stay down with the Chao.',
            [
              N('You stay with the Chao. Your Nubbin climbs into your lap.'),
              N('Tikal looks down at you all, and her shoulders come down a little.'),
            ],
            { 'pa1-stood': false },
          ),
        ],
      },
    ),
    sc(
      'pa1-10-stand-done',
      [
        PA('At dawn we take what the jewels can give. Tikal, stand aside.'),
        N('He goes. The warriors go. The torches go with them.'),
        N('The shrine is very dark.'),
      ],
      [
        ask(
          2,
          'science',
          'light and dark',
          '1-PS4-2',
          [N('The torches have gone. Why is the shrine dark now?')],
          [
            o(
              'The light went away',
              [N('Yes! No light means dark. We need light to see things.')],
              true,
            ),
            o('Someone shut their eyes', [
              N('Eyes are open! The torches left. No light means dark.'),
            ]),
          ],
          'Your child learned that we need light to see.',
        ),
      ],
    ),
    sc(
      'pa1-10-complete',
      [
        TI('He wasn’t always like this. He used to carry me on his shoulders.', 'sad'),
        TI('You being here doesn’t change anything. I know that.'),
        TI('I’m still glad. Isn’t that strange?', 'soft'),
        N('Chaos sinks into the pool. Its glow lights the water from underneath.'),
        PX('Keeper. I don’t want to watch the next part.', 'soft'),
        Y('Neither do I.'),
      ],
      [
        ask(
          2,
          'sel',
          'company helps even when it can’t fix things',
          'CASEL: Relationship skills',
          [TI('You can’t fix it, but I’m glad you’re here. Does company help?')],
          [
            o(
              'Yes, you feel less alone',
              [TI('Yes. Some things can’t be fixed. Company still helps.')],
              true,
            ),
            o('No, only fixing helps', [
              TI('Fixing is good. But company helps too: you feel less alone.'),
            ]),
          ],
          'Your child learned that company helps even when nothing can be fixed.',
        ),
      ],
    ),
  ],
);

// ================================================================== PA1-11 The Egg Carrier
const Q11: EduQuest = quest(
  'pa1-11',
  'The Egg Carrier',
  {
    'pa1-11-s1': G('Fly up to the big ship with Tails.', 'Stay close to Sonic and Tails.'),
    'pa1-11-s2': G('Take the ship’s Chao to the lifeboats.', 'Up two decks, on the left.'),
    'pa1-11-s3': G('Stay by the hatch and watch.', 'Stay by the open hatch.'),
  },
  [
    sc(
      'pa1-11-board',
      [
        N('Back in the city, a huge flying ship fills the sky. Red and gold.'),
        TA('That’s Eggman’s ship. A robot took Amy and the bird. We’re going in.', 'angry'),
        SO('In, find Amy, out. Easy. Stay close. Don’t press any red buttons.'),
        N('Tails drops you on the deck. Whoosh! Sonic is gone at once.'),
        PX('A flying fortress. I love that. I hate that. Both.', 'shock'),
        N('Your Nubbin stays tucked inside your jacket.'),
      ],
      [
        ask(
          4,
          'sel',
          'two feelings at once',
          'CASEL: Self-awareness',
          [PX('I love it AND I hate it. Can you feel two things at once?')],
          [
            o(
              'Yes, you can',
              [PX('Yes! Excited and scared at the same time. That’s normal.')],
              true,
            ),
            o('No, only one', [PX('You can! Excited and scared at the same time. That’s normal.')]),
          ],
          'Your child learned that two feelings can come at once.',
        ),
      ],
    ),
    sc(
      'pa1-11-board-done',
      [
        N('Down a ladder, past a door marked EGG STORAGE.'),
        N('You hear something you didn’t expect up here: Chao!'),
      ],
      [
        ask(
          0,
          'literacy',
          'first letter: E',
          'ELOF: Literacy',
          [N('EGG. What letter does “egg” start with? (Point to the sign.)')],
          [
            o('E', [N('Yes! E for egg. E, e, egg. Eggman starts with E too!')], true),
            o('G', [N('G is in the middle: e-g-g. The first letter is E. E for egg!')]),
          ],
          'Your child found the first letter of egg.',
        ),
      ],
    ),
    sc(
      'pa1-11-garden',
      [
        N('There is a Chao garden inside the ship. Plastic grass. A plastic tree.'),
        N('And lots of frightened Chao.'),
        N('The floor shudders. Something far below has been hit.'),
        PX('There are lifeboats. Two decks up, on the left.'),
        N('You pick up two Chao. Three more follow your Nubbin in a wobbly line.'),
        PX('Every one of them, Keeper. Not one stays behind.'),
      ],
      [
        ask(
          4,
          'maths',
          'add 2 and 3',
          'K.OA.A.2',
          [PX('You carry two Chao. Three follow your Nubbin. How many is that?')],
          [
            o('Five', [PX('Yes! Two and three make five. Five Chao on the way!')], true),
            o('Four', [
              PX('Let’s count. Two in your arms: one, two. Three more: three, four, five!'),
            ]),
          ],
          'Your child added two and three.',
        ),
      ],
      {
        choices: [
          ch('carry', 'Carry them two at a time.', [
            N('Up and down, two at a time. Nobody gets left.'),
          ]),
          ch('line', 'Let your Nubbin lead them.', [
            N('Every Chao follows your Nubbin, like ducklings.'),
          ]),
        ],
      },
    ),
    sc(
      'pa1-11-garden-done',
      [
        N('The last Chao is in the last lifeboat. You pull the lever.'),
        N('It floats down under a parachute with Eggman’s face on it.'),
        PX('The parachutes have his face on them. I can’t believe it.', 'happy'),
      ],
      [
        ask(
          1,
          'science',
          'parachutes catch air',
          'ELOF: Scientific Reasoning',
          [N('The parachute opens wide. Why does the lifeboat float down slowly?')],
          [
            o(
              'The big parachute catches the air',
              [N('Yes! A big open parachute catches air and slows the fall.')],
              true,
            ),
            o('Eggman’s face is magic', [
              N('Not magic! The big open parachute catches air and slows the fall.'),
            ]),
          ],
          'Your child learned that parachutes catch air.',
        ),
      ],
    ),
    sc(
      'pa1-11-chaos',
      [
        N('On the back deck, Eggman holds a fistful of glowing jewels.'),
        EG('Four, Chaos! Four jewels! Show them what you’ve become!', 'happy'),
        N('Chaos rises from a tank. It is huge now, with big clawed arms.'),
        N('It isn’t looking at Eggman. It is looking at the empty Chao garden.'),
        PX('It’s looking for them. It doesn’t know they got out.', 'soft'),
        N('Sonic is there, with Amy holding the bird. You stay by the hatch.'),
      ],
      [
        ask(
          4,
          'sel',
          'how it feels not to know',
          'CASEL: Social awareness',
          [PX('Chaos thinks they’re gone. If it knew they were safe, how would it feel?')],
          [
            o('Better', [PX('Yes. Knowing they are safe would help it feel better.')], true),
            o('Angrier', [PX('Not angrier. Knowing they are safe would help it feel better.')]),
          ],
          'Your child thought about what another character does not know.',
        ),
      ],
    ),
    sc(
      'pa1-11-chaos-done',
      [
        N('There is a long, splashy fight. You peek through your fingers.'),
        N('At the end, Chaos pours away over the side, still looking back.'),
        AM('Keeper! You’re here too? I saved the bird!', 'happy'),
      ],
      [
        ask(
          2,
          'sel',
          'being proud of a kind thing',
          'CASEL: Self-awareness',
          [AM('I saved the bird! Is it all right to feel proud?')],
          [
            o(
              'Yes, you did a kind thing',
              [AM('Yes! Feeling proud of a kind thing is lovely.')],
              true,
            ),
            o('No, be quiet about it', [
              AM('You can say it! Feeling proud of a kind thing is lovely.'),
            ]),
          ],
          'Your child learned that pride in kindness is fine.',
        ),
      ],
    ),
    sc(
      'pa1-11-complete',
      [
        N('From the rail you see the lifeboats floating down. Lots of little parachutes.'),
        N('Your Nubbin waves with both arms until the last one is gone.'),
        PX('That’s the Chao safe. Now everybody else.'),
      ],
      [
        doIt(
          0,
          'maths',
          'count to 4',
          'K.CC.B.5',
          'edu:count:lifeboats:4',
          [N('Count the little parachutes you can see. (Point to each one.)')],
          'Your child counted four parachutes.',
        ),
      ],
    ),
  ],
);

// ================================================================== PA1-12 Gamma
const Q12: EduQuest = quest(
  'pa1-12',
  'Gamma',
  {
    'pa1-12-s1': G('See what happens to the garden robot.', 'He is in the hangar at the back.'),
    'pa1-12-s2': G('Watch Gamma open the first robot.', 'Stay with Amy by the cradles.'),
    'pa1-12-s3': G('Look back at the sky from the plane.', 'Look toward the clouds.'),
  },
  [
    sc(
      'pa1-12-gamma',
      [
        N('In a big hangar, the tall robot stands in front of Eggman.'),
        EG('Gamma! You let the bird go! I built you, you ungrateful toaster!', 'angry'),
        GA('Query. Why was the bird the target?'),
        EG('Because I SAID so! Go to the scrap room.'),
        N('Eggman stamps off. Gamma stands alone. Then it walks the other way.'),
        AM('He didn’t give me up. I think he’s trying to be good.', 'soft'),
        PX('Follow him? I want to follow him.'),
      ],
      [
        ask(
          3,
          'sel',
          'asking why is allowed',
          'CASEL: Responsible decision-making',
          [N('Gamma asks “why?” Eggman says “because I said so.” Is asking why good?')],
          [
            o(
              'Yes, asking why helps you choose',
              [N('Yes! Asking why helps you choose what is right.')],
              true,
            ),
            o('No, just do as you’re told', [
              N('Asking why is good! It helps you choose what is right.'),
            ]),
          ],
          'Your child learned that asking why helps good choices.',
        ),
      ],
    ),
    sc(
      'pa1-12-gamma-done',
      [
        N('Gamma walks to a row of robots in their charging beds.'),
        N('Its brothers. The same shape, in different colours.'),
      ],
      [
        ask(
          1,
          'maths',
          'same shape, different colour',
          'K.G.A.2',
          [N('Same shape, different colours. Are the robots still the same shape?')],
          [
            o(
              'Yes, colour doesn’t change shape',
              [N('Yes! Red or blue, a square is still a square.')],
              true,
            ),
            o('No', [N('They are! Colour doesn’t change shape. Red or blue, same shape.')]),
          ],
          'Your child learned that colour does not change shape.',
        ),
      ],
    ),
    sc(
      'pa1-12-birds',
      [
        N('Gamma opens a little door on the first robot’s back.'),
        N('Inside is a small bird in a cage. It is alive!'),
        GA('Power source: living creature. Discovery logged.'),
        GA('This unit… also contains one.', 'think'),
        N('It opens the cage. The bird hops out and flies up to the roof.'),
        AM('They run on birds? Oh, poor Gamma.', 'sad'),
        N('Gamma looks at your Nubbin for a long moment.'),
        GA('You and the small one. Leave this ship. This unit has work to do.'),
      ],
      [
        ask(
          4,
          'science',
          'what birds need',
          'K-LS1-1',
          [N('The bird flies free. What does a bird need to be happy?')],
          [
            o(
              'Sky to fly in, food and water',
              [N('Yes! Birds need room to fly, and food and water.')],
              true,
            ),
            o('A tiny cage', [N('A tiny cage is sad for a bird. It needs sky, food and water.')]),
          ],
          'Your child named what a bird needs.',
        ),
      ],
      {
        choices: [
          ch('thank', 'Thank him.', [GA('Acknowledged.'), N('It turns back to its brothers.')]),
          ch('come', 'Ask him to come with you.', [
            GA('Negative. There are more of them. Go.'),
            N('It says it kindly.'),
          ]),
        ],
      },
    ),
    sc(
      'pa1-12-birds-done',
      [
        N('Tails comes back in the plane. You climb in with Amy.'),
        N('The big ship falls away behind you into the clouds.'),
      ],
      [
        ask(
          1,
          'science',
          'clouds',
          'K-ESS2-1',
          [N('The ship hides in the clouds. What are clouds made of?')],
          [
            o(
              'Tiny drops of water',
              [N('Yes! Clouds are lots of tiny water drops, floating high up.')],
              true,
            ),
            o('Cotton wool', [
              N('They look fluffy, but clouds are tiny water drops, floating high up.'),
            ]),
          ],
          'Your child learned that clouds are made of water drops.',
        ),
      ],
    ),
    sc(
      'pa1-12-sky',
      [
        N('Nobody says much. Tails flies low over the sea.'),
        AM('Gamma will be all right. Won’t it? It is very big.', 'sad'),
        PX('Amy. I don’t know.', 'soft'),
        PX('I hope so. I really hope so.', 'soft'),
        N('Your Nubbin kneels on the seat, hands on the glass, looking back.'),
        N('Then, out of the cloud, comes one bird. Then another. Then another!'),
        N('They fly free over the water, toward the land.'),
      ],
      [
        doIt(
          5,
          'maths',
          'count to 3',
          'K.CC.B.5',
          'edu:count:birds:3',
          [N('One bird, then another, then another. Count them on your fingers.')],
          'Your child counted three birds.',
        ),
      ],
    ),
    sc(
      'pa1-12-sky-done',
      [
        AM('That’s from him. I know it is.', 'soft'),
        PX('I’m fine. I’m not crying. The screen’s just very bright.', 'sad'),
      ],
      [
        ask(
          1,
          'sel',
          'happy-sad tears',
          'ELOF: Social and Emotional Development',
          [N('Pixel is a bit teary. Can something be kind and sad at once?')],
          [
            o('Yes', [N('Yes. Kind-and-sad things can make tears. That’s all right.')], true),
            o('No, only when you’re hurt', [
              N('You can! Kind-and-sad things can make tears too. That’s all right.'),
            ]),
          ],
          'Your child learned that tears can come from kind, sad moments.',
        ),
      ],
    ),
    sc(
      'pa1-12-complete',
      [
        N('Amy holds her little bird up to the window, to see the others go.'),
        AM('Thank you, Gamma.', 'soft'),
        N('Your Nubbin stays at the glass until the last bird is gone.'),
      ],
      [
        ask(
          1,
          'sel',
          'saying thank you',
          'ELOF: Social and Emotional Development',
          [N('Amy says thank you, even though Gamma can’t hear. Why?')],
          [
            o('Because she means it', [N('Yes. Thank you is for the one who says it, too.')], true),
            o('Because she has to', [
              N('Nobody made her. She means it. Thank you is for the giver too.'),
            ]),
          ],
          'Your child thought about why we say thank you.',
        ),
      ],
    ),
  ],
);

// ================================================================== PA1-13 The Charge
const Q13: EduQuest = quest(
  'pa1-13',
  'The Charge',
  {
    'pa1-13-s1': G('Go back with the light to the shrine.', 'Stand with Tikal on the top step.'),
    'pa1-13-s2': G('Stay in the light. Hold your Nubbin.', 'Hold on. You can’t change it.'),
  },
  [
    sc(
      'pa1-13-dawn',
      [
        N('The pink light comes for you. This time it is trembling.'),
        N('The shrine at dawn. Mist on the pools. The Chao sleep in heaps.'),
        N('Tikal sits on the top step. She has decided something.'),
        TI('You came. You don’t have to stay for this.', 'sad'),
        N('Chaos stands in the middle pool, tall and watchful.'),
        N('Far off in the trees, drums start. Boom. Boom.'),
        PX('Keeper. I could pull the plug. Gently. Say the word.', 'sad'),
      ],
      [
        ask(
          1,
          'science',
          'mist in the morning',
          'K-ESS2-1',
          [N('There is mist on the pools. When do we see mist?')],
          [
            o('Cool mornings', [N('Yes! Cool mornings make mist. The sun warms it away.')], true),
            o('Hot afternoons', [N('Mist likes cool mornings. The hot sun warms it away.')]),
          ],
          'Your child linked mist to cool mornings.',
        ),
      ],
      {
        choices: [
          ch('stay', 'Stay with Tikal.', [
            Y('I’ll stay.'),
            TI('Then hold your little one close.', 'soft'),
          ]),
          ch('wake', 'Wake the Chao.', [
            N('They roll over, sleepy, and settle again.'),
            TI('Let them sleep as long as they can.', 'soft'),
          ]),
        ],
      },
    ),
    sc(
      'pa1-13-dawn-done',
      [
        N('Tikal goes down and stands in front of the pools, arms wide.'),
        N('The Chao wake one by one. They gather behind her.'),
      ],
      [
        ask(
          0,
          'sel',
          'standing up for little ones',
          'CASEL: Social awareness',
          [N('Tikal stands in front of the Chao, arms wide. What is she doing?')],
          [
            o('Protecting them', [N('Yes. She puts herself in front, to keep them safe.')], true),
            o('Playing a game', [N('Not a game. She puts herself in front, to keep them safe.')]),
          ],
          'Your child recognised protecting someone smaller.',
        ),
      ],
    ),
    sc(
      'pa1-13-charge',
      [
        N('The warriors come out of the trees in a line. They do not stop.'),
        TI('Father! Stop! Please, the Chao!', 'shock'),
        N('The pink light closes round you. The shrine goes far away.'),
        N('Through the light: running feet, and a sound like a very big wave.'),
        N('Then it goes quiet.'),
        N('Some of the Chao were hurt that day, and some of them died.'),
        N('That is why Chaos grew so big and so sad.'),
        N('Then you hear Tikal, very clearly, talking softly to Chaos.'),
        TI('Please. Hold it. Hold it, and I’ll stay with it. I’ll stay.', 'sad'),
        N('A great green light. Tikal stays with Chaos, so it is not alone.'),
        N('Your Nubbin presses against you with its hands over its eyes.'),
      ],
      [
        ask(
          9,
          'sel',
          'sad things and comfort',
          'ELOF: Social and Emotional Development',
          [N('Tikal stays with Chaos, so it isn’t alone. When you’re sad, what helps?')],
          [
            o(
              'Someone staying with me',
              [N('Yes. Someone staying close helps. You never have to be sad alone.')],
              true,
            ),
            o('Being by myself', [
              N('Sometimes a bit. But someone staying close helps most. You’re never sad alone.'),
            ]),
          ],
          'Your child talked about comfort after a sad thing in the story.',
        ),
      ],
    ),
    sc(
      'pa1-13-charge-done',
      [
        N('The light lets go. You are on the floating island, now.'),
        N('It is raining, very softly. Pitter, patter.'),
        PX('I’m here. I’m just being quiet for a bit.', 'soft'),
      ],
      [
        ask(
          1,
          'literacy',
          'soft sound words',
          'RF.K.2',
          [N('Pitter, patter. Is that soft rain or big rain? (Tap it on your knees.)')],
          [
            o('Soft rain', [N('Yes! Pitter, patter is soft. Big rain goes splash, splash!')], true),
            o('Big rain', [N('Big rain goes splash, splash. Pitter, patter is soft rain.')]),
          ],
          'Your child matched a sound word to soft rain.',
        ),
      ],
    ),
    sc(
      'pa1-13-complete',
      [
        N('Knuckles finds you by the broken altar. He doesn’t ask anything.'),
        N('He sits down on the other side of it.'),
        KN('Bad dream?'),
        Y('An old one.'),
        KN('Yeah. This place has lots of those.', 'sad'),
        N('He fetches a big leaf to keep the rain off your Nubbin.'),
      ],
      [
        ask(
          5,
          'sel',
          'quiet kindness',
          'CASEL: Relationship skills',
          [N('Knuckles doesn’t say much. He brings a leaf for the rain. Is that kind?')],
          [
            o(
              'Yes, kindness can be quiet',
              [N('Yes! You don’t need lots of words to be kind. A leaf will do.')],
              true,
            ),
            o('No, he should talk more', [
              N('He is kind his own way. You don’t need lots of words.'),
            ]),
          ],
          'Your child saw kindness without many words.',
        ),
      ],
    ),
  ],
);

// ================================================================== PA1-14 The Ruins
const Q14: EduQuest = quest(
  'pa1-14',
  'The Ruins',
  {
    'pa1-14-s1': G('Look at the pictures in the old temple.', 'Walk along the painted wall.'),
    'pa1-14-s2': G('Listen to what the light says.', 'Stand with Sonic by the pictures.'),
  },
  [
    sc(
      'pa1-14-murals',
      [
        N('In the jungle is an old stone temple. It is very, very old now.'),
        N('Inside, the walls are painted with pictures. Faded, but clear.'),
        N('A pool with little round shapes. A girl with braids. A tall water shape.'),
        N('Then a line of warriors. Then fire, painted red gone brown.'),
        N('Then a big green stone, and the girl curled up beside it.'),
        PX('That’s Tikal. Somebody stayed behind and painted it all.', 'sad'),
        N('Your Nubbin puts its hand on a painted Chao, very gently.'),
      ],
      [
        ask(
          4,
          'literacy',
          'first, next, last',
          'RL.K.3',
          [N('The pictures tell the story in order. What came first: pool, or fire?')],
          [
            o(
              'The pool',
              [N('Yes! First the pool and the Chao. Next the warriors. Then the fire.')],
              true,
            ),
            o('The fire', [
              N('The fire came after. First the pool, next the warriors, then the fire.'),
            ]),
          ],
          'Your child put story pictures in order.',
        ),
      ],
      {
        choices: [
          ch('touch', 'Touch the painted girl.', [
            N('The stone is cool. Then, for a moment, a little warm.'),
          ]),
          ch('read', 'Look for writing.', [
            N('There are marks you can’t read. Pixel zooms in and gets moss.'),
            PX('Sorry. Moss.'),
          ]),
        ],
      },
    ),
    sc(
      'pa1-14-murals-done',
      [
        N('Footsteps! Sonic comes in out of the rain.'),
        N('He shakes himself like a dog. Flap, flap, flap!'),
        SO('Hey. Following me again? Or am I following you?'),
      ],
      [
        ask(
          1,
          'science',
          'animals shake off water',
          'K-LS1-1',
          [N('Sonic shakes like a wet dog. Why do dogs shake when wet?')],
          [
            o(
              'To fling the water off',
              [N('Yes! A big shake flings the water drops off their fur.')],
              true,
            ),
            o('Because they are cross', [
              N('Not cross! A big shake flings the water drops off their fur.'),
            ]),
          ],
          'Your child learned why wet animals shake.',
        ),
      ],
    ),
    sc(
      'pa1-14-tikal',
      [
        N('The pink light floats out and stops in front of the pictures.'),
        N('For a moment it is a girl with braids, made of soft pink glow.'),
        SO('Whoa. Uh. Hi?', 'shock'),
        TI('Tikal lived long, long ago. She died a very long time ago.'),
        N('Her light stayed, to look after Chaos. Now it speaks.'),
        TI('Chaos isn’t angry at you. It is carrying something too heavy.', 'soft'),
        TI('When the Chao were hurt, its sadness grew into a flood.'),
        TI('Each jewel makes the sadness bigger. Not the creature. The sadness.', 'sad'),
        SO('So how do I stop it?'),
        TI('I could only hold it. Maybe someone could help it put it down.', 'think'),
        N('She looks at you, and at your Nubbin. Then she is only a light.'),
      ],
      [
        ask(
          7,
          'sel',
          'big sad feelings',
          'CASEL: Self-management',
          [TI('Chaos’s sadness is too heavy to carry. What helps with a heavy feeling?')],
          [
            o(
              'Telling someone, and a hug',
              [TI('Yes. Telling someone makes it lighter. A hug helps too.')],
              true,
            ),
            o('Holding it in', [
              TI('Holding it in makes it heavier. Telling someone makes it lighter.'),
            ]),
          ],
          'Your child learned what helps a big, heavy feeling.',
        ),
      ],
    ),
    sc(
      'pa1-14-tikal-done',
      [
        SO('Well. That was new.'),
        SO('Sad, huh. Can’t run away from that one.', 'think'),
        N('He runs off anyway, very fast, into the rain.'),
      ],
      [
        ask(
          1,
          'sel',
          'you can’t run from feelings',
          'CASEL: Self-awareness',
          [SO('I’m fast, but I can’t outrun a feeling. Why not?')],
          [
            o(
              'Feelings come with you',
              [SO('Right. Feelings come along, however fast you go. Best to face them.')],
              true,
            ),
            o('You just need to run faster', [
              SO('Nope! Feelings come along, however fast you go. Best to face them.'),
            ]),
          ],
          'Your child learned that feelings can’t be outrun.',
        ),
      ],
    ),
    sc(
      'pa1-14-complete',
      [
        PX('Back home there’s an old story about Cinder.', 'think'),
        PX('She loved the little ones, and held on too tight.', 'think'),
        PX('It just feels like the same shape.', 'soft'),
        N('Your Nubbin looks up at the painted water shape for a long time.'),
      ],
      [
        ask(
          2,
          'literacy',
          'stories can be alike',
          'RL.K.3',
          [PX('Two stories, the same shape. What do Chaos and Cinder both do?')],
          [
            o(
              'Love too hard and hold too tight',
              [PX('Yes. Both love too hard and hold on too tight. Same shape.')],
              true,
            ),
            o('Nothing alike', [
              PX('Look again: both love too hard and hold on too tight. Same shape.'),
            ]),
          ],
          'Your child compared two stories.',
        ),
      ],
    ),
  ],
);

// ================================================================== PA1-15 Perfect Chaos
const Q15: EduQuest = quest(
  'pa1-15',
  'Perfect Chaos',
  {
    'pa1-15-s1': G('Get up high when the water comes.', 'The stairs on the side of the bank.'),
    'pa1-15-s2': G('Carry Chao and people up to the roof.', 'Up the stairs and down again.'),
  },
  [
    sc(
      'pa1-15-flood',
      [
        N('In the morning, the sky over the city turns dark green.'),
        N('Out of the sea rises Chaos. It keeps rising. Taller than the hotel!'),
        N('Eggman’s ship zooms at it. Chaos swats it away like a fly.'),
        EG('That… was not in the plan!', 'shock'),
        N('Then the water comes. A whole sea, walking into the city.'),
        PX('Get up high. Keeper, now. Find a roof.', 'shock'),
        N('People run, carrying Chao. Some Chao carry each other!'),
      ],
      [
        ask(
          5,
          'health',
          'high ground when water comes',
          'ELOF: Perceptual, Motor, and Physical Development',
          [PX('Water is coming. Where is the safe place?')],
          [
            o('Up high', [PX('Yes! Water stays low. Up high is safe. Up the stairs!')], true),
            o('Down low', [PX('Water goes to low places. Up high is safe. Up the stairs!')]),
          ],
          'Your child learned that high ground is safe from water.',
        ),
      ],
    ),
    sc(
      'pa1-15-flood-done',
      [N('Water pours down the station steps.'), N('Like a waterfall going the wrong way!')],
      [
        ask(
          1,
          'science',
          'water flows downhill',
          'ELOF: Scientific Reasoning',
          [N('Water pours down the steps. Does water run down, or up?')],
          [
            o('Down', [N('Yes! Water always runs downhill. Down the steps, splash.')], true),
            o('Up', [N('Water can’t climb! It always runs downhill. Down the steps, splash.')]),
          ],
          'Your child learned that water runs downhill.',
        ),
      ],
    ),
    sc(
      'pa1-15-roofs',
      [
        N('Iron stairs climb the side of the bank. The water is at your knees.'),
        N('A man with a pushchair. A boy with two Chao. An old lady’s cat.'),
        PX('Pushchair first. Then the boy. I’ll count the floors for you.'),
        N('Up and down, up and down. Your Nubbin swims, a Chao on its back!'),
        PX('Two more down there. Go on. I’ve got the count.'),
      ],
      [
        doIt(
          2,
          'maths',
          'count to 5',
          'K.CC.A.1',
          'edu:count:floors:5',
          [PX('Count the floors as you climb. One, two… (Count the stairs together.)')],
          'Your child counted five floors going up.',
        ),
      ],
      {
        choices: [
          ch('cat', 'Go back for the cat.', [
            N('The cat sits on a postbox, dry and cross. It lets you carry it.'),
          ]),
          ch('raft', 'Go back for the Chao on the bin lid.', [
            N('The Chao rides the bin lid like a boat. It holds out its arms.'),
          ]),
        ],
      },
    ),
    sc(
      'pa1-15-roofs-done',
      [
        N('The roof is crowded and wet. Nobody is missing.'),
        N('The cat sits on a vent, judging everyone.'),
        PX('Everyone’s up. Good. Good.', 'soft'),
      ],
      [
        ask(
          0,
          'sel',
          'everyone counted, everyone safe',
          'CASEL: Social awareness',
          [PX('Nobody is missing. Why do we check everyone is here?')],
          [
            o(
              'So nobody is left behind',
              [PX('Yes. We count heads so nobody is left behind. Everyone matters.')],
              true,
            ),
            o('For fun', [
              PX('Not just fun. We count heads so nobody is left behind. Everyone matters.'),
            ]),
          ],
          'Your child learned why we check everyone is safe.',
        ),
      ],
    ),
    sc(
      'pa1-15-complete',
      [
        N('From the roof, the city is a lake. Chaos coils through it, slow.'),
        N('It doesn’t see the people on the roofs. It is looking under the water.'),
        PX('It’s still looking for them. It’s still looking for its Chao.', 'sad'),
      ],
      [
        ask(
          1,
          'maths',
          'over and under',
          'K.G.A.1',
          [N('Chaos looks under the water. The people are on roofs: over, or under?')],
          [
            o(
              'Over, up on top',
              [N('Yes! Over, on top of the roofs. Chaos looks under. It can’t see them.')],
              true,
            ),
            o('Under', [N('The people are over, up on the roofs. Chaos looks under the water.')]),
          ],
          'Your child used the position words over and under.',
        ),
      ],
    ),
  ],
);

// ================================================================== PA1-16 Positive Energy
const Q16: EduQuest = quest(
  'pa1-16',
  'Positive Energy',
  {
    'pa1-16-s1': G(
      'Watch Sonic’s friends bring the jewels.',
      'Stay on the roof. They come to you.',
    ),
    'pa1-16-s2': G('Hold the Chao and watch.', 'Stay on the roof with the Chao.'),
  },
  [
    sc(
      'pa1-16-friends',
      [
        N('Sonic lands on your roof, soaked and out of breath.'),
        SO('Okay. That’s big. That’s really, really big.', 'shock'),
        N('Tails comes. Knuckles comes. Amy comes, with the bird. Big comes, with Froggy!'),
        N('Froggy puts up one hand. He would like to be counted too.'),
        N('They bring all seven jewels. The jewels are dull and grey now.'),
        KN('Chaos used them up. They’re empty.', 'angry'),
        TA('Not empty. Not all the way.', 'think'),
        TA('Chaos took the sad part. But the good part is still in there.'),
        TA('Use what’s left, Sonic. Use the good.'),
      ],
      [
        doIt(
          2,
          'maths',
          'count to 4',
          'K.CC.B.5',
          'edu:count:friends:4',
          [N('Count Sonic’s friends: Tails, Knuckles, Amy, Big. (Count on your fingers.)')],
          'Your child counted four friends.',
        ),
      ],
    ),
    sc(
      'pa1-16-friends-done',
      [
        N('Sonic looks round at all of them. Then at you and your Nubbin.'),
        SO('The good, huh. Okay. Let’s see what we’ve got.'),
      ],
      [
        ask(
          1,
          'sel',
          'friends make you braver',
          'CASEL: Relationship skills',
          [N('Sonic looks at all his friends before he tries. Why?')],
          [
            o(
              'Friends make you feel braver',
              [N('Yes! Friends nearby make a hard thing feel possible.')],
              true,
            ),
            o('He forgot their names', [
              N('He knows their names! Friends nearby make a hard thing feel possible.'),
            ]),
          ],
          'Your child learned that friends help you feel brave.',
        ),
      ],
    ),
    sc(
      'pa1-16-super',
      [
        N('The jewels float up out of everyone’s hands. They circle Sonic.'),
        N('They glow soft and gold, like seven lamps in a dark house.'),
        N('A Chao climbs into your arms. Then another. Your Nubbin holds your sleeve.'),
        N('Sonic goes gold all over! Then he is up in the sky, flying.'),
        PX('He’s flying! Oh, I wish you could see your own face.', 'happy'),
        N('A gold spark circles the water coil, like a bee round a bear.'),
      ],
      [
        ask(
          1,
          'art',
          'warm colours',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('The jewels glow gold, like lamps. Does gold feel warm, or cold?')],
          [
            o('Warm', [N('Yes! Gold, orange and red are warm colours, like fire and sun.')], true),
            o('Cold', [N('Blue and grey feel cold. Gold is warm, like fire and sun.')]),
          ],
          'Your child sorted a colour as warm.',
        ),
      ],
      {
        choices: [
          ch('hold', 'Hold the Chao and watch.', [
            N('One Chao falls asleep in your arms. Very brave.'),
          ]),
          ch('cheer', 'Cheer.', [
            N('You cheer! Amy cheers louder. Big cheers so loud Froggy hides.'),
          ]),
        ],
      },
    ),
    sc(
      'pa1-16-super-done',
      [
        N('The gold spark strikes, and strikes again. Chaos roars and shrinks.'),
        N('Then the water goes down, all at once. Like a bath draining!'),
      ],
      [
        ask(
          1,
          'science',
          'where bath water goes',
          'ELOF: Scientific Reasoning',
          [N('Pull the plug and the bath empties. Where does the water go?')],
          [
            o('Down the drain', [N('Yes! Down the hole, down the pipe, away. Gurgle!')], true),
            o('Up into the sky', [N('Not up! Down the hole, down the pipe, away. Gurgle!')]),
          ],
          'Your child linked a drain to water going down.',
        ),
      ],
    ),
    sc(
      'pa1-16-complete',
      [
        N('The sea goes back out of the streets. Cars and benches come up, dripping.'),
        N('In the middle of the square, in a small puddle, something small is left.'),
        PX('Is that…?', 'think'),
      ],
      [
        ask(
          0,
          'maths',
          'big and small',
          'K.MD.A.2',
          [N('Chaos was taller than the hotel. Now it’s a puddle. Bigger, or smaller?')],
          [
            o('Smaller', [N('Yes! Much smaller. From hotel-tall to puddle-small.')], true),
            o('Bigger', [N('A puddle is tiny next to a hotel. It got smaller!')]),
          ],
          'Your child compared big and small.',
        ),
      ],
    ),
  ],
);

// ================================================================== PA1-17 The Chao
const Q17: EduQuest = quest(
  'pa1-17',
  'The Chao',
  {
    'pa1-17-s1': G(
      'Walk out to the small shape in the puddle.',
      'Down the stairs, across the square.',
    ),
    'pa1-17-s2': G('Let Chaos see the garden Chao.', 'Look up at the hotel roof.'),
  },
  [
    sc(
      'pa1-17-small',
      [
        N('You climb down into ankle-deep water and wade across the square.'),
        N('In the puddle is Chaos, small again, clear and quiet.'),
        N('Its glow is faint and green. It is only looking around.'),
        SO('Easy, everybody. I don’t think it wants to fight any more.'),
        N('Your Nubbin sits at the edge of the puddle. Chaos looks down at it.'),
        PX('It thinks they’re gone, doesn’t it?', 'sad'),
      ],
      [
        ask(
          3,
          'sel',
          'gentle voices for scared ones',
          'CASEL: Relationship skills',
          [SO('I say “easy, easy” in a soft voice. Why soft?')],
          [
            o(
              'Soft voices calm scared ones',
              [SO('Yes. Soft and slow says: you’re safe. Loud would scare it.')],
              true,
            ),
            o('Because I’m tired', [
              SO('Not tired! Soft and slow says: you’re safe. Loud would scare it.'),
            ]),
          ],
          'Your child learned that soft voices calm.',
        ),
      ],
      {
        choices: [
          ch('sit', 'Sit at the edge of the puddle.', [
            N('You sit in the wet. Chaos looks at you and does not move away.'),
          ]),
          ch('back', 'Keep back and let it look.', [
            N('You stay where you are. So does everyone.'),
          ]),
        ],
      },
    ),
    sc(
      'pa1-17-small-done',
      [
        N('Chaos looks round the square. At the buildings. At the people.'),
        N('And at none of the small ones.'),
      ],
      [
        ask(
          1,
          'literacy',
          'what is missing',
          'RL.K.3',
          [N('Chaos looks for the small ones. Who are the small ones?')],
          [
            o('The Chao', [N('Yes! The Chao. Chaos is looking for its Chao.')], true),
            o('The cars', [N('Not cars. The Chao! Chaos is looking for its Chao.')]),
          ],
          'Your child followed who a character is looking for.',
        ),
      ],
    ),
    sc(
      'pa1-17-chao',
      [
        N('Then a sound comes from up high. Small and cheerful.'),
        N('Along the hotel roof sits a whole row of Chao, legs dangling!'),
        N('They went out through the open gate when the water came. They went up.'),
        PX('The gate was open! You did that!', 'happy'),
        N('Now they come down: by the drainpipe, by the stairs, sliding down awnings.'),
        N('They walk right up to the puddle. They are not afraid at all.'),
        N('Chaos looks at them. Its glow goes still, and soft, and warm.'),
        PX('They’re all right. And it can see them.', 'soft'),
        N('A Chao reaches up and touches the water. Chaos bends down and lets it.'),
      ],
      [
        ask(
          6,
          'sel',
          'relief',
          'ELOF: Social and Emotional Development',
          [N('Chaos sees they are safe. Its glow goes soft. How does it feel now?')],
          [
            o(
              'Relieved and calm',
              [N('Yes. That feeling is relief. The worry goes, and calm comes.')],
              true,
            ),
            o('Still worried', [
              N('Not now! They are safe. The worry goes, and calm comes. That is relief.'),
            ]),
          ],
          'Your child named the feeling of relief.',
        ),
      ],
    ),
    sc(
      'pa1-17-chao-done',
      [
        N('Chaos sinks down, smaller and smaller, till it’s hardly taller than a Chao.'),
        N('It sits in the puddle among them. At last, it looks to be resting.'),
      ],
      [
        ask(
          1,
          'health',
          'rest after a hard day',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('Chaos sits down to rest. Why do we need rest after a hard day?')],
          [
            o(
              'To let our bodies and feelings calm',
              [N('Yes. Rest lets bodies and feelings settle. Then we feel better.')],
              true,
            ),
            o('We don’t need rest', [
              N('We do! Rest lets bodies and feelings settle. Then we feel better.'),
            ]),
          ],
          'Your child learned why rest matters.',
        ),
      ],
    ),
    sc(
      'pa1-17-complete',
      [
        SO('Huh. So that’s all it wanted.', 'soft'),
        AM('Of course that’s all it wanted. That’s all anybody wants.'),
        N('Knuckles wipes his eyes and says it’s the rain.'),
      ],
      [
        ask(
          1,
          'sel',
          'what everyone wants',
          'CASEL: Social awareness',
          [AM('That’s all anybody wants. What does Chaos want?')],
          [
            o(
              'To know its friends are safe',
              [AM('Yes. To know the ones you love are safe. That’s all.')],
              true,
            ),
            o('More jewels', [AM('Not jewels! To know the ones you love are safe. That’s all.')]),
          ],
          'Your child named what the character truly wanted.',
        ),
      ],
    ),
  ],
);

// ================================================================== PA1-18 Tikal and Chaos
const Q18: EduQuest = quest(
  'pa1-18',
  'Tikal and Chaos',
  {
    'pa1-18-s1': G('Watch the light come down to Chaos.', 'Stay by the puddle with the Chao.'),
    'pa1-18-s2': G('Answer Tikal’s question.', 'Talk to Tikal before she goes.'),
  },
  [
    sc(
      'pa1-18-return',
      [
        N('The pink light comes down from the clouds, slow as a falling petal.'),
        N('It opens, and it is Tikal, barefoot in the water, Chao round her ankles.'),
        TI('There you are. I’ve been looking for you such a long time.', 'soft'),
        N('Chaos looks up at her, like your Nubbin looks at you coming home.'),
        TI('It’s all right now. They’re all right. Look at them.'),
        TI('You don’t have to hold it any more. We can put it down together.'),
        N('She holds out her hand. Chaos puts its watery hand in hers.'),
        SO('So… you two are going?'),
        TI('We’ve waited a long while. Thank you, all of you.', 'happy'),
      ],
      [
        ask(
          0,
          'science',
          'things fall slowly',
          'ELOF: Scientific Reasoning',
          [N('Slow as a falling petal. What falls slowly: a petal, or a stone?')],
          [
            o(
              'A petal',
              [N('Yes! Light, wide things like petals float down slowly. Stones drop fast.')],
              true,
            ),
            o('A stone', [N('A stone drops fast, thud. Light petals float down slowly.')]),
          ],
          'Your child compared how a petal and a stone fall.',
        ),
      ],
      {
        choices: [
          ch('bow', 'Bow to Chaos.', [N('You bow. This time Chaos bows back, all the way.')]),
          ch('nubbin', 'Lift your Nubbin up so Chaos can see.', [
            N('Chaos touches your Nubbin’s head, very lightly, where the curl is.'),
          ]),
        ],
      },
    ),
    sc(
      'pa1-18-return-done',
      [
        N('Tikal turns to you last.'),
        N('The Chao round her feet turn too. They know whose turn it is.'),
      ],
      [
        ask(
          1,
          'sel',
          'taking turns',
          'ELOF: Social and Emotional Development',
          [N('Tikal spoke to Sonic. Now it is your turn. Why do we take turns?')],
          [
            o(
              'So everyone gets a go',
              [N('Yes! Turns mean everyone gets a go, and nobody is left out.')],
              true,
            ),
            o('So the fastest wins', [
              N('Not a race! Turns mean everyone gets a go, and nobody is left out.'),
            ]),
          ],
          'Your child talked about taking turns.',
        ),
      ],
    ),
    sc(
      'pa1-18-farewell',
      [
        TI('Before we go, I want to ask you something.', 'think'),
        TI('Where you come from, do you have one like Chaos?'),
        TI('Someone who loved the little ones too much?'),
        N('Your Nubbin sits in the water by Chaos, holding one of its fingers.'),
        PX('Keeper. She means…', 'soft'),
        Y('We had one. A long time ago.'),
        TI('What happened to her?'),
      ],
      [
        ask(
          2,
          'sel',
          'too much of a good thing',
          'CASEL: Social awareness',
          [TI('Can you love someone too much? What does holding too tight feel like?')],
          [
            o(
              'Squashy, it can hurt',
              [TI('Yes. Love is good, but holding too tight squashes. Gentle hands are best.')],
              true,
            ),
            o('Nice', [
              TI('A hug is nice! But holding too tight squashes. Gentle hands are best.'),
            ]),
          ],
          'Your child thought about holding gently.',
        ),
      ],
    ),
    sc(
      'pa1-18-rhyme',
      [
        N('You open your mouth. You don’t know how that story ends. Nobody does yet.'),
        N('Pixel hums a little tune under her breath. The skipping tune from the lane.'),
        N('She stops before the last line.'),
        TI('That sounds like an old one. Old ones are always a little sad.', 'soft'),
        TI('I hope somebody finds her. I hope she gets to put it down.'),
      ],
      [
        ask(
          1,
          'music',
          'humming a tune',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('Pixel hums without words. Can you hum? (Hum a tune you know, together.)')],
          [
            o(
              'Hmm hmm hmmm!',
              [N('Lovely! Humming is singing with your mouth closed. Mmm.')],
              true,
            ),
            o('I don’t know how', [N('Close your lips and sing: mmmmm. That’s humming! Try it.')]),
          ],
          'Your child hummed a tune.',
        ),
      ],
    ),
    sc(
      'pa1-18-complete',
      [
        TI('Here. For you. I made it a long while ago, and it kept.', 'happy'),
        N('She puts a crown of little pink and white flowers on your head.'),
        N('Then she takes Chaos’s hand. They turn to light, pink and green, and rise.'),
        N('The Chao wave until they’re gone. Tikal and Chaos are together, at peace.'),
        N('The world folds up gently, like a letter. You are back in the shed.'),
        PX('You’re back! You’ve got flowers in your hair!', 'shock'),
        PX('And your hair is round again. I liked it square.'),
        N('On the cabinet, a little brass plate has appeared, waiting for a name.'),
        PX('A high-score plate. We’ll do it properly after another cartridge.', 'happy'),
      ],
      [
        ask(
          4,
          'art',
          'pattern: pink, white, pink',
          'ELOF: Mathematics Development',
          [N('The crown goes pink, white, pink, white. What comes next?')],
          [
            o('Pink', [N('Yes! Pink, white, pink, white, pink. A pattern!')], true),
            o('Green', [
              N('Green is Chaos’s light! The crown goes pink, white, pink, white… pink!'),
            ]),
          ],
          'Your child continued a two-colour pattern.',
        ),
      ],
    ),
  ],
);

// ================================================================== VARIANTS
/** Sprout versions of every scene in PA1_VARIANTS. */
export const EDU_PA1_SPROUT_VARIANTS: EduScene[] = [
  // ---------------------------------------------------------------- replaces pa1-01-shed-done (s21Done)
  sc(
    'pa1-01-shed-done-clank',
    [
      N('Pixel blows the dust off the cartridge. Puff!'),
      N('She wipes the shiny bit on her sleeve.'),
      PX('Clean contacts, happy cartridge. Everyone knows that.'),
      N('Clank sits on top of the cabinet. His legs dangle over the screen.'),
      CK('Announcement: I am the lookout. Lookouts sit on top. I am on top.', 'happy'),
      PX('I said lookouts sit still.'),
      CK('I am sitting very still. Look how still. The stillest ever.'),
      N('His legs keep swinging. Bonk. Bonk. One heel hits the screen.'),
    ],
    [
      ask(
        6,
        'sel',
        'listening to what was asked',
        'ELOF: Approaches to Learning',
        [PX('I asked Clank to sit still. His legs are swinging. Is he sitting still?')],
        [
          o(
            'Not quite! His legs are moving',
            [PX('Right. Still means all of you. Legs too, Clank.')],
            true,
          ),
          o('Yes, very still', [PX('Look at those legs swing! Still means all of you. Legs too.')]),
        ],
        'Your child checked whether an instruction was really followed.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- replaces pa1-11-garden-done (s21Done)
  sc(
    'pa1-11-garden-done-clank',
    [
      N('The last Chao is in the last lifeboat. You pull the lever.'),
      N('It floats down under a parachute with Eggman’s face on it.'),
      PX('The parachutes have his face on them. I can’t believe it.', 'happy'),
      CK('Announcement: that parachute has a FACE on it. I want one with MY face.', 'happy'),
      PX('It’s Eggman’s face, Clank.'),
      CK('Then I would like a very small Eggman.'),
    ],
    [
      ask(
        1,
        'science',
        'parachutes catch air',
        'ELOF: Scientific Reasoning',
        [N('The parachute opens wide. Why does the lifeboat float down slowly?')],
        [
          o(
            'The big parachute catches the air',
            [N('Yes! A big open parachute catches air and slows the fall.')],
            true,
          ),
          o('Eggman’s face is magic', [
            N('Not magic! The big open parachute catches air and slows the fall.'),
          ]),
        ],
        'Your child learned that parachutes catch air.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- after pa1-18-return-done (pa1-stood true)
  sc(
    'pa1-18-stood',
    [
      TI('You stood beside me on the steps. In front of all of them.', 'soft'),
      TI('It didn’t change anything. It still mattered.'),
      N('She squeezes your hand once. It is warm, though it’s made of light.'),
    ],
    [
      ask(
        1,
        'sel',
        'standing by a friend',
        'CASEL: Relationship skills',
        [TI('Standing beside me changed nothing, but it mattered. Why?')],
        [
          o(
            'I wasn’t alone',
            [TI('Yes. Being with someone matters, even when it can’t fix things.')],
            true,
          ),
          o('It didn’t matter', [
            TI('It did! Being with someone matters, even when it can’t fix things.'),
          ]),
        ],
        'Your child learned that standing by a friend matters.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- replaces pa1-18-rhyme (cinder forgiven)
  sc(
    'pa1-18-cinder-forgiven',
    [
      Y('She was called Cinder. She loved them, and held on too tight.'),
      Y('At the end, somebody went up the mountain and found her. She was forgiven.'),
      N('Tikal smiles, slowly, like the sun after rain.'),
      TI('Forgiven. Oh, I’m glad.', 'happy'),
      TI('Then she can rest. That’s all the fierce ones want, in the end.', 'soft'),
    ],
    [
      ask(
        2,
        'sel',
        'forgiving',
        'CASEL: Relationship skills',
        [N('Cinder was forgiven. What does “forgive” mean?')],
        [
          o(
            'To stop being cross and let it go',
            [N('Yes. Forgiving means letting the cross feeling go. Then everyone can rest.')],
            true,
          ),
          o('To forget everything', [
            N('Not forget. Forgiving means letting the cross feeling go. Then everyone can rest.'),
          ]),
        ],
        'Your child learned what forgiving means.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- replaces pa1-18-rhyme (cinder remembered)
  sc(
    'pa1-18-cinder-remembered',
    [
      Y('She was called Cinder. She held on too tight.'),
      Y('We don’t forgive all of it. But we remember ours.'),
      TI('Remember. Yes. That’s a kind of keeping too.', 'soft'),
      N('Your Nubbin finds a red petal from home. It gives it to a Chao.'),
      N('The Chao holds the petal up to the light. Its ball becomes a heart.'),
    ],
    [
      ask(
        3,
        'art',
        'colours: red',
        'ELOF: Perceptual, Motor, and Physical Development',
        [N('The petal is red. Can you find something red near you? (Look around together.)')],
        [
          o('I found one!', [N('Red! Like the petal from the hill. Well spotted.')], true),
          o('Nothing red here', [
            N('Look again: a book, a cup, a sock? Red is everywhere once you look.'),
          ]),
        ],
        'Your child found the colour red.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- after pa1-18-complete: the last image
  sc(
    'pa1-18-last-open-stood',
    [
      N('The screen shows one last picture: the hotel roof at sunset.'),
      N('A row of Chao sits along the edge, legs dangling.'),
      N('In one corner, two tiny lights, pink and green, and a little square person.'),
      PX('That’s you. It put you in the ending!', 'happy'),
    ],
    [
      ask(
        0,
        'science',
        'sunset',
        '1-ESS1-1',
        [N('It is sunset. Where is the sun going?')],
        [
          o(
            'Down, and night comes',
            [N('Yes! At sunset the sun goes down, and night comes. Morning brings it back.')],
            true,
          ),
          o('Up', [N('Up is sunrise, in the morning. At sunset it goes down, and night comes.')]),
        ],
        'Your child learned what happens at sunset.',
      ),
    ],
  ),
  sc(
    'pa1-18-last-open',
    [
      N('The screen shows one last picture: the hotel roof at sunset.'),
      N('A row of Chao sits along the edge, legs dangling.'),
      N('In one corner, two tiny lights, pink and green, float away side by side.'),
      PX('Every one of them out, and up. Good.', 'soft'),
    ],
    [
      ask(
        2,
        'art',
        'mixing colours: pink and green',
        'ELOF: Perceptual, Motor, and Physical Development',
        [N('Two lights: one pink, one green. Which one is Tikal?')],
        [
          o('Pink', [N('Yes! Tikal is the pink light. Chaos glows green.')], true),
          o('Green', [N('Green is Chaos. Tikal is the pink light.')]),
        ],
        'Your child matched colours to characters.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_PA1_SPROUT: EduQuest[] = [
  Q01,
  Q02,
  Q03,
  Q04,
  Q05,
  Q06,
  Q07,
  Q08,
  Q09,
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

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  'edu:count:spanners:7',
  'edu:sort:colours:emeralds',
  'edu:count:chao:6',
  'edu:breathe:slow:phew',
  'edu:sit:still:froggy',
  'edu:count:lifeboats:4',
  'edu:count:birds:3',
  'edu:count:floors:5',
  'edu:count:friends:4',
];
