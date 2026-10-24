/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Atlas A10 The Heart of
 * the Island.
 *
 * Source: atlas-a10.ts (ATLAS_A10 and A10_VARIANTS). One EduScene per original scene, every step
 * scene, done scene, complete scene and the four variants, id `sprout:<original id>`. Every
 * choice keeps its original id and `set`, so a10-step and a10-approach still work. All the page's
 * choices are kind and safe, so none is dropped. See EDU-STYLE.md.
 *
 * What it teaches (the outline's Learning Grove angle), at this age:
 *   - the Pacific on a map (land and water; the biggest ocean; islands);
 *   - the stars rise and set in the same places, swells and sea birds point to land, which is how
 *     real wayfinders sailed; the 1976 voyage of the Hokulea canoe from Hawaii to Tahiti;
 *   - coral reefs (tiny animals build them; fish live there; clean clear water);
 *   - plus counting, positions, patterns, shapes, sound words, feelings and being a good friend.
 *
 * Care notes kept: Maui is treated with respect (a hero of many island peoples; his deeds are
 * told straight). Tattoos are never described as something to copy. No chant, haka or prayer is
 * written out, and Gramma's song is never written out. No lines from the film or its songs.
 * Hard things: Gramma Tala's death is said plainly (her body stopped working and it won't start
 * again) with comfort straight after; Tui's friend who died at sea is one plain line; Maui's
 * first family not keeping him is told softly. Te Ka is loud and spooky, nobody is hurt.
 * Every fact is well established (Pacific is the largest ocean; stars rise in the east and set
 * in the west; coral polyps are tiny animals; noddies and terns are land birds that fish at sea;
 * Hokulea sailed Hawaii to Tahiti in 1976 with no instruments; manta rays are gentle filter
 * feeders; many Pacific islands began as volcanoes).
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
const M = say('a10-moana');
const G = say('a10-tala');
const T = say('a10-tui');
const S = say('a10-sina');
const MU = say('a10-maui');
const TM = say('a10-tamatoa');
const FM = say('a10-farmer');
const F = say('a10-fisher');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];
type Domain = Lesson['domain'];

const opt = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

const std = (standard?: string) => (standard ? { standard } : {});

const notice = (
  domain: Domain,
  skill: string,
  standard: string | undefined,
  after: number,
  lines: Line[],
  parentNote: string,
): Beat => ({ domain, skill, ...std(standard), kind: 'notice', after, lines, parentNote });

const ask = (
  domain: Domain,
  skill: string,
  standard: string | undefined,
  after: number,
  prompt: Line[],
  options: Opt[],
  parentNote: string,
): Beat => ({ domain, skill, ...std(standard), kind: 'ask', after, prompt, options, parentNote });

const doit = (
  domain: Domain,
  skill: string,
  standard: string | undefined,
  after: number,
  check: string,
  lines: Line[],
  parentNote: string,
): Beat => ({ domain, skill, ...std(standard), kind: 'do', after, check, lines, parentNote });

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

const g = (goal: string, hint: string) => ({ goal, hint });

// ---------------------------------------------------------------- shared pieces
const A14_HOME: Line[] = [
  N('The page sighs. You are in the Grove, with the atlas on your knee.'),
  N('Your Nubbin smells of salt. It is still swaying.'),
  N('By the pond is a small canoe with two hulls and a woven sail.'),
  N('On the hill, a ring of flat stones has appeared in the grass.'),
];

const HOME_DRAW = (after: number): Beat =>
  doit(
    'social-studies',
    'show where home is',
    'D2.Geo.2.K-2',
    after,
    'edu:draw:home',
    [
      N('(Draw your home on paper, or point to it on a map.)'),
      N('Moana knows her way home. Can you show where your home is?'),
    ],
    'Drew or pointed to their own home, linking places and maps.',
  );

const WAVE_STEP = (after: number): Beat =>
  doit(
    'health',
    'copy a slow, gentle movement',
    'ELOF: Perceptual, Motor, and Physical Development',
    after,
    'edu:move:wave-step',
    [
      N('(Stand up. Rise on your toes, sink down, and roll your arms.)'),
      N('Up, down. Up, down. Slow and soft!'),
    ],
    'Copied a slow rising and sinking movement, like a wave.',
  );

const HOKULEA = (after: number): Beat =>
  notice(
    'social-studies',
    'real voyagers crossed the Pacific by the stars, waves and birds',
    'D2.His.2.K-2',
    after,
    [
      N('This is a story. But real sailors did this, long ago.'),
      N('Their canoes had two hulls. They sailed with no maps.'),
      N('In 1976 a canoe called Hōkūleʻa sailed from Hawaiʻi to Tahiti.'),
      N('The sailors read the stars, the waves and the birds.'),
    ],
    'Heard that real canoe sailors crossed the Pacific long ago and again in 1976.',
  );

// ================================================================== A10-1 The Chosen One
const Q01 = quest(
  'a10-01',
  'The Chosen One',
  {
    'a10-01-s1': g('Step onto the island. Listen to the story.', 'Follow the children’s laughter.'),
    'a10-01-s2': g('Hear the rest of the story.', 'Sit with the children.'),
    'a10-01-s3': g('Look after the baby turtle.', 'Go down to the water.'),
  },
  [
    sc(
      'a10-01-page',
      [
        N('Nova’s atlas opens. The page is blue, with a green island.'),
        N('The paint turns to sand. Squish, squish! You are on a beach.'),
        N('A big house has a roof and no walls. Children sit inside.'),
        N('An old woman tells a story with her hands.'),
        G('Sit, sit! A guest! Your little one can sit on the end.', 'happy'),
        N('A small girl with lots of hair pats your Nubbin like a drum.'),
      ],
      [
        notice(
          'social-studies',
          'a map shows land and water; an island has water all round',
          '2-ESS2-2',
          1,
          [
            N('Nova’s page is a map. A map shows where land and water are.'),
            N('Green is land and blue is water. An island has water all round.'),
          ],
          'Heard that maps show land and water, and what an island is.',
        ),
      ],
    ),
    sc(
      'a10-01-page-done',
      [G('Now, where was I? The heart of the island!', 'think')],
      [
        ask(
          'literacy',
          'name where a story happens',
          'RL.K.3',
          0,
          [N('Where is this story? Point to your answer.')],
          [
            opt(
              'On an island, by the sea',
              [G('Yes! An island, with sand and palm trees.', 'happy')],
              true,
            ),
            opt('In a snowy town', [
              G('Not snow here! Look: sand, sea and palm trees. An island!'),
            ]),
            opt('On the moon', [G('Not the moon! We are on an island by the sea.')]),
          ],
          'Named the setting of the story: an island by the sea.',
        ),
      ],
    ),
    sc(
      'a10-01-story',
      [
        G('Long ago there was only sea. Then an island came up out of it.'),
        G('The island had a heart. It made green things grow.'),
        G('A trickster took the heart. His name was Maui.'),
        G('Maui could turn into a hawk. Then the island began to crumble.', 'sad'),
        N('Some children squeal and hide behind each other. The small girl leans in.'),
        T('Mother, that is enough. The little ones will be scared.'),
        N('Gramma Tala says her son is a good chief. He is also wrong.'),
      ],
      [
        ask(
          'sel',
          'naming a scared feeling and what helps',
          'CASEL: Self-awareness',
          4,
          [N('Some children feel scared. What could help them?')],
          [
            opt(
              'A cuddle, and a grown-up nearby',
              [G('Yes. A cuddle helps. Scared feelings get smaller.', 'soft')],
              true,
            ),
            opt('Hide all alone', [G('Hiding alone feels lonely. A cuddle works better.')]),
            opt('Pretend not to be scared', [
              G('It is fine to be scared. Say so, and ask for a hug.'),
            ]),
          ],
          'Talked about scared feelings and that a cuddle or a nearby grown-up helps.',
        ),
      ],
    ),
    sc(
      'a10-01-story-done',
      [N('Gramma Tala picks up a stick and walks to the shore, humming.'), N('You follow her.')],
      [
        notice(
          'social-studies',
          'oral history: people tell stories out loud to remember the past',
          'D2.His.2.K-2',
          1,
          [
            N('Gramma Tala tells her story out loud. She learned it from her gramma.'),
            N('Long ago, people kept the past alive by telling stories.'),
          ],
          'Heard that people kept the past alive by telling stories aloud.',
        ),
      ],
    ),
    sc(
      'a10-01-turtle',
      [
        N('The small girl has run to the beach. She frowns at something flat.'),
        N('It is a baby turtle. It is trying to reach the sea.'),
        N('Birds circle above. The girl holds a big leaf over it, like a roof.'),
      ],
      [
        ask(
          'science',
          'where sea turtles live and what they need',
          'K-ESS3-1',
          1,
          [N('The baby turtle wants to get home. Where does a sea turtle live?')],
          [
            opt('In the sea', [N('Yes! A sea turtle lives in the sea. It needs the water.')], true),
            opt('Up a tree', [N('Not up a tree! A sea turtle swims, and its home is the sea.')]),
            opt('In a house', [N('Not in a house! Its home is the big blue sea.')]),
          ],
          'Learned that a sea turtle lives in the sea.',
        ),
      ],
      {
        choices: [
          {
            id: 'shade',
            label: 'Send your Nubbin to walk beside the turtle.',
            then: [N('Your Nubbin waddles beside it, arms up. A very slow parade!')],
          },
          {
            id: 'birds',
            label: 'Wave the birds away.',
            then: [N('You flap your arms, and your Nubbin flaps its wings. The birds fly off.')],
          },
        ],
      },
    ),
    sc(
      'a10-01-turtle-done',
      [N('The turtle reaches the foam. Splash! It is gone, and the girl claps.', 'happy')],
      [
        notice(
          'sel',
          'helping someone smaller',
          'ELOF: Social and Emotional Development',
          0,
          [
            N('The little girl helped the turtle. Helping feels good.'),
            N('Who could you help today?'),
          ],
          'Noticed how good it feels to help someone smaller.',
        ),
      ],
    ),
    sc(
      'a10-01-complete',
      [
        N('The sea pulls back. It stands up in a wall of water!'),
        N('Fish hang in it like flecks in glass. The water leans down, gently.'),
        N('It gives her a shell, then another shell. Then a green stone!'),
        T('Moana! Where are you?'),
        N('The water falls back. Gramma Tala picks up the green stone.'),
        N('She keeps it safe in the shell at her neck.'),
        G('The sea picks who it picks. It never says why.', 'soft'),
      ],
      [
        doit(
          'maths',
          'count to 3',
          'K.CC.B.5',
          2,
          'edu:count:gifts:3',
          [
            N('(Count the gifts together on your fingers.)'),
            N('A shell, a shell, a green stone: one, two, three. Three gifts!'),
          ],
          'Counted three gifts from the sea, one finger each.',
        ),
      ],
    ),
  ],
  'A10-1. Sets the map, the stories-out-loud idea and the baby turtle.',
);

// ================================================================== A10-2 The Reef
const Q02 = quest(
  'a10-02',
  'The Reef',
  {
    'a10-02-s1': g('Walk with Moana to the coconut trees.', 'Go up to the grove.'),
    'a10-02-s2': g('Go to the lagoon. The nets are empty.', 'Find the fishermen.'),
    'a10-02-s3': g('Go out to the reef with Moana.', 'Wade out and be ready to pull.'),
  },
  [
    sc(
      'a10-02-coconuts',
      [
        N('Moana is sixteen now. She is learning to be chief.'),
        M('You are Gramma’s guest! I knew you would come back.', 'happy'),
        N('A farmer holds out a coconut, cracked in half.'),
        N('Inside it is black and soft. It should be white!'),
        FM('Whole trees of them. Young trees too.'),
        M('Then we will plant a new grove. There is good ground over there.', 'think'),
      ],
      [
        notice(
          'science',
          'plants need water, light and good soil to stay well',
          'K-LS1-1',
          3,
          [
            N('Coconut trees need sun, water and good ground to grow.'),
            N('When a tree gets poorly, its fruit goes soft and dark.'),
          ],
          'Heard what plants need to stay healthy.',
        ),
      ],
      {
        choices: [
          {
            id: 'dig',
            label: 'Dig the first hole for the new grove.',
            then: [
              FM('A guest who digs!', 'happy'),
              N('Your Nubbin sits in the hole to check it is the right size.'),
            ],
          },
          {
            id: 'ask',
            label: 'Ask how long the trees have been sick.',
            then: [
              FM('Since the rains. It walked this way, one tree at a time.', 'think'),
              N('Moana looks past the island, at the sea.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a10-02-coconuts-done',
      [M('That is one trouble. Next will be the fishing. It is always the fishing.')],
      [
        ask(
          'sel',
          'noticing how someone else feels',
          'CASEL: Social awareness',
          0,
          [N('The farmer’s trees are poorly. How might he feel?')],
          [
            opt('Worried', [N('Yes. He is worried. He cares about his trees.')], true),
            opt('Silly', [N('Not silly. His trees are poorly, so he feels worried.')]),
            opt('Sleepy', [N('Not sleepy! He is worried about his trees.')]),
          ],
          'Named a feeling (worried) for someone whose trees were poorly.',
        ),
      ],
    ),
    sc(
      'a10-02-lagoon',
      [
        N('The fishing canoes sit on the sand. Their nets are empty.'),
        F('Every day, fewer fish. Today, none.', 'sad'),
        M('Then we go out past the reef! The fish are out there.', 'think'),
        N('The fishermen go quiet. The chief has walked up.'),
        T('We do not cross the reef. It is our rule. It keeps us safe.'),
        N('Your Nubbin senses a mood. It sits on Moana’s foot.'),
      ],
      [
        ask(
          'social-studies',
          'rules help keep people safe',
          'D2.Civ.8.K-2',
          4,
          [N('The chief has a rule. Why might a rule like this help?')],
          [
            opt(
              'It keeps people safe',
              [N('Yes. Rules can keep people safe. Moana will ask why.')],
              true,
            ),
            opt('To be cross', [N('Not to be cross. A good rule helps keep people safe.')]),
            opt('To spoil the fun', [
              N('Not to spoil fun. A good rule is there to keep people safe.'),
            ]),
          ],
          'Talked about why rules exist: to keep people safe.',
        ),
      ],
    ),
    sc(
      'a10-02-lagoon-done',
      [
        N('The chief walks away. Moana watches the reef.'),
        N('Five canoes lie on the sand, with nothing in them.'),
        M('He never says why.', 'angry'),
      ],
      [
        doit(
          'maths',
          'count to 5',
          'K.CC.B.5',
          1,
          'edu:count:canoes:5',
          [
            N('(Count the canoes with your finger.)'),
            N('One, two, three, four, five. Five empty canoes!'),
          ],
          'Counted five canoes, saying one number for each.',
        ),
      ],
    ),
    sc(
      'a10-02-breakers',
      [
        N('Later, Moana pushes a small canoe out. Pua the pig sits in front.'),
        M('I am only going to look!'),
        N('At the reef, the waves come in big and close. Whoosh! Whoosh!'),
        N('The third wave tips the canoe over. Splash!'),
        Y('Moana!', 'shock'),
        N('You wade in. Your Nubbin paddles past you, fast.'),
        N('Together you pull Moana and Pua to safety.'),
      ],
      [
        notice(
          'science',
          'coral reefs: tiny animals build a reef where fish live',
          'K-ESS3-1',
          2,
          [
            N('A reef is like a wall in the sea. Tiny coral animals build it.'),
            N('Lots of fish live in a reef. It is their home.'),
          ],
          'Heard that tiny coral animals build reefs, and that fish make their homes there.',
        ),
      ],
    ),
    sc(
      'a10-02-breakers-done',
      [
        N('Moana sits on the sand, by the canoe in two pieces. Pua sulks.'),
        M('Fine. I will not go past the reef. Probably.', 'sad'),
        N('Your Nubbin comes out of the sea with a spiral shell.'),
      ],
      [
        ask(
          'literacy',
          'hear the first sound of a word',
          'RF.K.2',
          2,
          [N('Say them slowly: sea, sand, sun. What sound do they all start with?')],
          [
            opt(
              '“s”, like a snake',
              [N('Yes! S-s-sea, s-s-sand, s-s-sun. They all start with “s”.')],
              true,
            ),
            opt('“b”, like a ball', [N('Listen again: sss-sea, sss-sand. They start with “s”.')]),
            opt('“m”, like Moana', [N('M starts Moana. Sea, sand and sun start with “s”.')]),
          ],
          'Listened for the first sound, “s”, in sea, sand and sun.',
        ),
      ],
    ),
    sc(
      'a10-02-complete',
      [
        M('Dad is right. I nearly drowned the pig.', 'sad'),
        N('She looks at the cut on her foot, not at the reef.'),
        N('Your Nubbin drops the spiral shell in your hand. You keep it safe.'),
        M('That is Gramma, round the point. She dances with the sea.', 'soft'),
      ],
      [
        ask(
          'sel',
          'naming feelings and what helps',
          'ELOF: Social and Emotional Development',
          1,
          [N('Moana feels sad and cross with herself. What could help?')],
          [
            opt(
              'Talk to Gramma or a friend',
              [N('Yes. Talking to someone you trust helps.')],
              true,
            ),
            opt('Keep it all inside', [N('Keeping it inside is heavy. Telling someone helps.')]),
            opt('Be cross at the pig', [
              N('Pua did nothing wrong! Talking to a friend helps more.'),
            ]),
          ],
          'Talked about what helps when you feel sad and cross: telling someone you trust.',
        ),
      ],
    ),
  ],
  'A10-2. Coconut health, a rule that keeps people safe, and coral reefs.',
);

// ================================================================== A10-3 Gramma Tala
const Q03 = quest(
  'a10-03',
  'Gramma Tala',
  {
    'a10-03-s1': g('Find Gramma Tala dancing by the water.', 'Walk round the point.'),
    'a10-03-s2': g(
      'Let Gramma teach your Nubbin one step.',
      'Stand in the shallows. Choose a step.',
    ),
    'a10-03-s3': g('Sit on the sand with Gramma and Moana.', 'Sit beside Gramma Tala.'),
  },
  [
    sc(
      'a10-03-point',
      [
        N('Round the point, the waves come in long and slow.'),
        N('Gramma Tala dances at the edge of the water.'),
        N('She moves like the sea: forward, then back. In, then out.'),
        G('Do not stand there like a post. The sea does not bite!'),
        M('Gramma, you should not be out here alone.'),
        G('I have the sea, a guest and a round little thing with wings.', 'happy'),
      ],
      [
        notice(
          'science',
          'waves come in and go out all day',
          'ELOF: Scientific Reasoning',
          2,
          [
            N('Watch the waves. They come in, and they go out.'),
            N('In, out. In, out. The sea keeps moving all day.'),
          ],
          'Noticed that waves move in and out all the time.',
        ),
      ],
    ),
    sc(
      'a10-03-point-done',
      [
        N('Your Nubbin tries to copy her. It falls over. Plop!'),
        G('Oh, that one will be a dancer one day!', 'happy'),
      ],
      [
        notice(
          'sel',
          'trying again after a wobble is brave',
          'CASEL: Self-management',
          1,
          [
            N('Your Nubbin fell over and did not mind. It got up to try again.'),
            N('Trying again is brave. Every wobble helps you learn.'),
          ],
          'Heard that falling over and trying again is a brave way to learn.',
        ),
      ],
    ),
    sc(
      'a10-03-step',
      [
        G('Come here, small one. Feet in the water. Feel it pull?'),
        N('Your Nubbin rocks a little each time the water goes out.'),
        G('I have two steps for a beginner. You get one today.'),
        G('Which shall it be?', 'think'),
      ],
      [
        doit(
          'health',
          'copy a slow, gentle movement',
          'ELOF: Perceptual, Motor, and Physical Development',
          2,
          'edu:move:sway',
          [
            N('(Stand up. Sway side to side, slowly, like the sea.)'),
            N('Swish, swish. Slow and soft. That is how Gramma moves.'),
          ],
          'Swayed slowly and gently, copying Gramma Tala’s movement.',
        ),
      ],
      {
        choices: [
          {
            id: 'glide',
            label: 'The stingray glide.',
            set: { 'a10-step': 'glide' },
            then: [
              G('Arms out wide and soft. Lean. Let the sea carry you.'),
              N('Your Nubbin slides along the foam on one foot. Whee!', 'happy'),
            ],
          },
          {
            id: 'wave',
            label: 'The wave step.',
            set: { 'a10-step': 'wave' },
            then: [
              G('Up on your toes when it comes in. Down when it goes.'),
              N('Your Nubbin rises, sinks and rolls its arms. Right on the sea!', 'happy'),
            ],
          },
        ],
      },
    ),
    sc(
      'a10-03-step-done',
      [G('There. That is yours now. A step is like a name. It stays.', 'soft')],
      [
        doit(
          'literacy',
          'clap the beats in a word',
          'RF.K.2',
          0,
          'edu:clap:syllables:manta',
          [
            N('(Clap the beats in each word.)'),
            N('Wave and step: one clap each. Man-ta: two claps!'),
          ],
          'Clapped syllables in wave, step and manta.',
        ),
      ],
    ),
    sc(
      'a10-03-sand',
      [
        N('Gramma sits on the sand. Moana sits beside her, and so do you.'),
        M('I tried to go past the reef. I nearly drowned Pua.'),
        G('I know. Wrong boat, wrong tide. Otherwise, very good.', 'happy'),
        G('Safe is good. But safe is not the only thing.', 'soft'),
        G('You have a big question in you. Go on. Ask it.', 'think'),
      ],
      [
        ask(
          'sel',
          'asking when you want to know something',
          'CASEL: Relationship skills',
          4,
          [N('Moana has a big question. What can you do when you want to know?')],
          [
            opt(
              'Ask a grown-up you trust',
              [G('Yes! Asking is brave. Good questions help us learn.', 'happy')],
              true,
            ),
            opt('Never ask', [G('Questions are good! Ask them. People like to help.')]),
            opt('Guess and hope', [
              G('Guessing is fine sometimes. But asking gets a real answer.'),
            ]),
          ],
          'Talked about asking a trusted grown-up when you want to know something.',
        ),
      ],
    ),
    sc(
      'a10-03-sand-done',
      [
        M('Who are we? Where did we come from? Why do we never leave?', 'think'),
        G('Good. Get your guest. Bring a torch.'),
      ],
      [
        notice(
          'social-studies',
          'families have stories about long ago',
          'D2.His.2.K-2',
          0,
          [
            N('Moana wants to know where her people came from.'),
            N('Every family has stories about long ago. Ask a grown-up to tell you one.'),
          ],
          'Heard that families have stories about the past, and was invited to ask for one.',
        ),
      ],
    ),
    sc(
      'a10-03-complete',
      [
        N('Gramma gets up. It takes three tries, and a hand from you.'),
        N('Your Nubbin walks up the beach, doing its step, a bit crooked.'),
        G('It will come. Everything good comes slowly.', 'soft'),
      ],
      [
        notice(
          'sel',
          'helping someone kindly, without a fuss',
          'CASEL: Relationship skills',
          0,
          [
            N('You gave Gramma a hand up, and nobody made a fuss.'),
            N('Quiet help is kind. It lets people feel strong, not silly.'),
          ],
          'Heard that helping quietly, without a fuss, is a kind way to help.',
        ),
      ],
    ),
  ],
  'A10-3. Signature choice a10-step is kept as in the original.',
);

// ================================================================== A10-4 The Cave of Canoes
const Q04 = quest(
  'a10-04',
  'The Cave of Canoes',
  {
    'a10-04-s1': g('Follow Gramma behind the waterfall.', 'Carry the torch up the stream.'),
    'a10-04-s2': g('Look at what is hidden in the cave.', 'Go down the passage and look.'),
    'a10-04-s3': g('Watch what the drum remembers.', 'Stand back while Moana beats the drum.'),
  },
  [
    sc(
      'a10-04-falls',
      [
        N('Gramma leads you up a stream. A waterfall tumbles down a cliff.'),
        G('The secret is behind the waterfall. Moana first, then our guest.'),
        N('Moana steps through. You hear her gasp.'),
        N('You follow. The water hits your head. Splash! Brr!'),
        N('Behind the falls is a passage in the rock.'),
      ],
      [
        ask(
          'maths',
          'words for where things are',
          'K.G.A.1',
          3,
          [N('Where is the secret passage? Point to your answer.')],
          [
            opt(
              'Behind the waterfall',
              [N('Yes! Behind the waterfall. Moana went through the water.')],
              true,
            ),
            opt('On top of the waterfall', [N('Not on top. It is behind the waterfall.')]),
            opt('Beside a tree', [N('Not beside a tree. The passage is behind the waterfall.')]),
          ],
          'Used a position word (behind) to say where the passage was.',
        ),
      ],
    ),
    sc(
      'a10-04-falls-done',
      [
        N('The torch makes the wet rock shine.'),
        N('Your Nubbin’s emote ball glows too. It is company.'),
      ],
      [
        notice(
          'sel',
          'a friend nearby helps you feel brave',
          'CASEL: Self-awareness',
          1,
          [
            N('The cave is dark, and a bit spooky. But you are not alone.'),
            N('A friend nearby helps you feel brave. Who helps you feel brave?'),
          ],
          'Heard that having a friend close by helps us feel brave in the dark.',
        ),
      ],
    ),
    sc(
      'a10-04-canoes',
      [
        N('The passage opens into a huge cave. Blue light comes in from the sea.'),
        N('Moana lifts the torch. The shapes in the dark are boats!'),
        N('They are great canoes, with two hulls each and sails folded up.'),
        M('Whose are these? Nobody builds these any more!', 'shock'),
        N('Your Nubbin sits on a hull, under a very tall mast.'),
        N('At the front is a great drum.'),
      ],
      [
        doit(
          'maths',
          'count to 5',
          'K.CC.B.5',
          2,
          'edu:count:canoes:5',
          [
            N('(Count the canoes in the front row.)'),
            N('One, two, three, four, five. Five great canoes!'),
          ],
          'Counted five canoes, saying one number for each.',
        ),
      ],
      {
        choices: [
          {
            id: 'dust',
            label: 'Brush the dust off the nearest prow.',
            then: [N('Under the dust the wood is carved with waves, stars and tiny people.')],
          },
          {
            id: 'torch',
            label: 'Hold the torch high so Moana can see.',
            then: [N('Moana walks along, touching each hull, like counting heads.')],
          },
        ],
      },
    ),
    sc(
      'a10-04-canoes-done',
      [G('Bang the drum, Moana. It has been waiting for you.', 'soft')],
      [
        notice(
          'science',
          'a drum makes sound when its skin shakes',
          '1-PS4-1',
          0,
          [
            N('When Moana bangs the drum, the skin shakes. Shake, shake!'),
            N('The shaking makes the sound you hear.'),
          ],
          'Heard that a shaking drum skin makes sound.',
        ),
      ],
    ),
    sc(
      'a10-04-drum',
      [
        N('Moana beats the drum. Boom! The sound goes all round the cave.'),
        N('Then you are not in a cave. You are on the open sea!'),
        N('Great canoes sail all round, full of singing people.'),
        N('A woman at a steering oar grins right at you.'),
        N('They find an island, land and plant. Then they sail on.'),
        N('Your Nubbin is doing its step without knowing it.'),
      ],
      [
        notice(
          'social-studies',
          'ancestors are family from long ago',
          'D2.His.2.K-2',
          4,
          [
            N('These people are Moana’s ancestors. Ancestors are family from long, long ago.'),
            N('They sailed from island to island, all across a huge ocean.'),
          ],
          'Heard what ancestors are, and that Pacific peoples sailed between islands.',
        ),
      ],
    ),
    sc(
      'a10-04-drum-done',
      [
        N('The drum stops ringing. You are in the cave again.'),
        N('There is dust on your feet and sea sounds at the far end.'),
      ],
      [
        doit(
          'music',
          'clap a steady beat',
          'ELOF: Perceptual, Motor, and Physical Development',
          0,
          'edu:clap:beat:steady',
          [N('(Clap a slow, steady beat, like a drum.)'), N('Boom, boom, boom. Keep it steady!')],
          'Clapped a slow, steady beat.',
        ),
      ],
    ),
    sc(
      'a10-04-complete',
      [
        M('They did not stay! They sailed on to every island. We did that!', 'happy'),
        G('We did. Then the dark came, and the chiefs said, stay inside the reef.'),
        G('And we hid the boats and forgot. All but a few of us.', 'soft'),
        N('Gramma takes out the green stone with the spiral on it.'),
        G('This is the heart of Te Fiti, the mother island.', 'soft'),
        G('Maui took it. So Maui must put it back.'),
        M('You take it, you bring it back. That is the rule!', 'happy'),
        M('I have to tell Dad. Right now!', 'happy'),
      ],
      [
        ask(
          'literacy',
          'remember what happened earlier in a story',
          'RL.K.3',
          4,
          [N('Gramma kept the green stone safe. Who gave it to Moana, long ago?')],
          [
            opt('The sea', [N('Yes! The sea gave it to her when she was very small.')], true),
            opt('Her dad', [N('Not her dad. The sea gave Moana the stone, on the beach.')]),
            opt('A turtle', [N('The turtle went home to the sea. The sea gave her the stone.')]),
          ],
          'Remembered an earlier event in the story: the sea gave Moana the stone.',
        ),
      ],
    ),
  ],
  'A10-4. The ancestors are shown as real voyagers; the song is never written out.',
);

// ================================================================== A10-5 Setting Sail
const Q05 = quest(
  'a10-05',
  'Setting Sail',
  {
    'a10-05-s1': g('Stand by Moana while she tells the chief.', 'Go to the meeting house.'),
    'a10-05-s2': g('Sit with Gramma Tala in her house.', 'Sit by her mat.'),
    'a10-05-s3': g('Carry food and water to the hidden canoe.', 'Take the bundles from Sina.'),
  },
  [
    sc(
      'a10-05-council',
      [
        N('Moana runs into the meeting house with cobweb in her hair.'),
        M('Our people sailed! There are boats in a cave! We can find Maui!', 'happy'),
        T('The cave. She showed you.', 'angry'),
        T('We are not going past the reef.', 'angry'),
        T('When I was young, I went past the reef with my best friend.', 'sad'),
        T('The sea was rough. My friend died there. I came home alone.', 'sad'),
        N('For a moment he is just a man who has been afraid.'),
      ],
      [
        ask(
          'sel',
          'naming a feeling and why',
          'CASEL: Social awareness',
          6,
          [N('Tui’s friend died at sea, so he fears for Moana. How does he feel?')],
          [
            opt(
              'Sad and scared',
              [N('Yes. He is sad about his friend, and scared for Moana.')],
              true,
            ),
            opt('Cross', [
              N('A bit cross, maybe. Mostly he is sad and scared, because he loves her.'),
            ]),
            opt('Proud', [N('He is proud of Moana. Today he is mostly scared for her.')]),
          ],
          'Named feelings (sad, scared) behind a worried parent’s rule.',
        ),
      ],
    ),
    sc(
      'a10-05-council-done',
      [N('A boy runs in, out of breath. Gramma Tala has fallen by the shore.', 'shock')],
      [
        ask(
          'literacy',
          'tell what happened first, next and last',
          'RL.K.3',
          0,
          [
            N('First Moana told her dad. Next the boy ran in.'),
            N('What was the news the boy brought?'),
          ],
          [
            opt(
              'Gramma Tala has fallen',
              [N('Yes. Gramma Tala has fallen. Moana will go to her.')],
              true,
            ),
            opt('The fish came back', [N('Not that. The news was about Gramma Tala.')]),
            opt('It is lunchtime', [N('Not lunch. The news was that Gramma Tala has fallen.')]),
          ],
          'Followed the order of events and said what the news was.',
        ),
      ],
    ),
    sc(
      'a10-05-bedside',
      [
        N('Gramma lies on her mat. A healer sits beside her.'),
        N('She is very small now. Her hands are cool.'),
        G('Do not fuss. I am very old, and very poorly.', 'soft'),
        G('You must go. Tonight. Find Maui. Make him give it back.'),
        M('I cannot leave you. Not now.', 'sad'),
        G('I will be the bit of you that keeps going.', 'soft'),
        N('She puts the shell with the heart in it into Moana’s hand.'),
        G('And look after our guest. Guests are a big job.', 'happy'),
      ],
      [
        notice(
          'sel',
          'sad feelings are allowed, and hugs help',
          'CASEL: Self-awareness',
          7,
          [
            N('Moana feels sad. It is hard when someone you love is very old.'),
            N('Feeling sad is allowed. A hug, a sit-down and a friend all help.'),
          ],
          'Heard that sadness is allowed and that hugs and company help.',
        ),
      ],
    ),
    sc(
      'a10-05-bedside-done',
      [G('Go on, my brave girl. I love you very much.', 'soft')],
      [
        doit(
          'literacy',
          'saying a kind thing out loud to someone you love',
          'SL.K.1',
          0,
          'edu:say:kind-words',
          [
            N('(Tell a grown-up one kind thing about them.)'),
            N('Kind words feel warm. Gramma’s words stay with Moana.'),
          ],
          'Said one kind thing to a loved one, as Gramma did.',
        ),
      ],
    ),
    sc(
      'a10-05-pack',
      [
        N('In Moana’s house, her mother Sina is packing food.'),
        S('Dried fish. Good coconuts. And water. Four gourds of water.'),
        S('I am not going to stop you. I am going to feed you.', 'soft'),
        N('She hugs Moana for a long time. Then she hugs you too.'),
        N('You carry the bundles to the cave’s sea mouth, in the dark.'),
        N('There the smallest canoe waits. It still looks enormous.'),
      ],
      [
        doit(
          'maths',
          'count to 4',
          'K.CC.B.5',
          1,
          'edu:count:gourds:4',
          [
            N('(Count the water gourds on your fingers.)'),
            N('One, two, three, four. Four gourds of water!'),
          ],
          'Counted four water gourds, one finger each.',
        ),
      ],
      {
        choices: [
          {
            id: 'steady',
            label: 'Hold the canoe steady while she loads.',
            then: [N('You hold the hull still. By the third bundle her hands are steady.')],
          },
          {
            id: 'water',
            label: 'Tell her what Sina said about water.',
            then: [
              M('I always forget water!', 'soft'),
              N('She counts the gourds out loud. Then once more, for her mum.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a10-05-pack-done',
      [N('You turn round, and your Nubbin is gone! So is Heihei the rooster.')],
      [
        ask(
          'literacy',
          'guess what might happen next',
          'RL.K.3',
          0,
          [N('Where might Nubbin and Heihei be hiding?')],
          [
            opt('Inside the canoe', [N('Yes! A good guess. Look at the canoe’s dark hull.')], true),
            opt('Up a palm tree', [
              N('Maybe! But look at the canoe first. It is the best hiding place.'),
            ]),
            opt('In Gramma’s house', [N('Hmm. Gramma’s house is quiet. Check the canoe!')]),
          ],
          'Made a guess about what happens next in the story.',
        ),
      ],
    ),
    sc(
      'a10-05-complete',
      [
        N('Moana pushes the canoe off into the dark. The sail goes up crooked.'),
        N('From under the deck comes a small cluck, and a small squeak.'),
        Y('Wait! My Nubbin is in your boat!', 'shock'),
        N('You wade out. The sea lifts you gently onto the deck.'),
        M('Did the ocean just give me a passenger?', 'shock'),
        N('On the shore, a light goes out in Gramma Tala’s house.'),
        N('Gramma Tala has died. Her body stopped working, and it will not start again.', 'sad'),
        N('Moana sees the light go, and she knows. She is very sad.', 'sad'),
        N('Under the canoe, a soft blue light glows. A big manta ray glides past.', 'soft'),
        N('Moana wipes her eyes. She follows the glow.', 'soft'),
      ],
      [
        notice(
          'sel',
          'feelings after someone dies, and what helps',
          'CASEL: Self-awareness',
          8,
          [
            N('When someone dies, we can feel sad, cross or scared. All are fine.'),
            N('A hug helps, and so does telling someone. Remembering them helps, too.'),
          ],
          'Heard that sad, cross and scared are all fine feelings after a death, and what helps.',
        ),
      ],
    ),
  ],
  'A10-5. Death said plainly, with comfort straight after: the glowing manta and remembering.',
);

// ================================================================== A10-6 Maui
const Q06 = quest(
  'a10-06',
  'Maui',
  {
    'a10-06-s1': g('Ride out the storm in the canoe.', 'Bail water. Hold on tight.'),
    'a10-06-s2': g('Meet the demigod on his rock.', 'Walk up the beach.'),
    'a10-06-s3': g('Get out of the cave.', 'Climb up inside the stone figure.'),
  },
  [
    sc(
      'a10-06-storm',
      [
        N('Day one is blue and easy. Your Nubbin and Heihei sit on deck.'),
        N('On the second night a storm comes. Whoosh! Crash!'),
        M('Bail! Hold on to something!', 'shock'),
        N('You bail with a shell. Your Nubbin bails with its hands, and soaks you.'),
        N('A huge wave rolls the canoe. Everything goes dark and loud.'),
      ],
      [
        notice(
          'science',
          'a storm has strong wind and heavy rain',
          'K-ESS2-1',
          1,
          [
            N('A storm has strong wind and heavy rain. The sea gets big and rough.'),
            N('After the storm, the weather goes calm again.'),
          ],
          'Heard what a storm is like and that weather calms again.',
        ),
      ],
    ),
    sc(
      'a10-06-storm-done',
      [
        N('You wake on a beach with sand in your mouth.'),
        N('Your Nubbin is asleep on top of Heihei, who has not noticed.'),
      ],
      [
        doit(
          'literacy',
          'sound words show what we hear',
          'RL.1.4',
          0,
          'edu:say:sound-words:whoosh',
          [
            N('(Say the storm’s sounds: whoosh, splash, crash!)'),
            N('Sound words let us hear a story. What sound does the sea make?'),
          ],
          'Practised sound words (whoosh, splash, crash).',
        ),
      ],
    ),
    sc(
      'a10-06-maui',
      [
        N('A shadow falls on the beach. A huge man stands there, grinning.'),
        N('Pictures of great deeds are drawn on his skin.'),
        MU('Visitors! A thousand years on a rock, and now an audience!', 'happy'),
        MU('I am Maui. I pulled islands out of the sea. I slowed the sun.'),
        MU('And what is this? A coconut with opinions?', 'think'),
        M('My island is dying. You are coming with me to put it right.', 'angry'),
      ],
      [
        notice(
          'social-studies',
          'Maui is a hero in the stories of many Pacific peoples',
          'D2.His.2.K-2',
          3,
          [
            N('Many island peoples across the Pacific tell stories about Maui.'),
            N('In the stories he fishes up islands, slows the sun and brings fire.'),
          ],
          'Heard that Maui is a hero in the stories of many Pacific island peoples.',
        ),
      ],
      {
        choices: [
          {
            id: 'thank',
            label: 'Thank him for the long days.',
            then: [
              MU('See? Somebody was brought up properly.', 'happy'),
              N('Moana gives you a long look. You are meant to be on her side.'),
            ],
          },
          {
            id: 'behind',
            label: 'Keep your Nubbin behind your legs.',
            then: [N('Your Nubbin peeks out, and Maui peeks back. Nobody blinks first.')],
          },
        ],
      },
    ),
    sc(
      'a10-06-maui-done',
      [MU('Thanks for the boat. I have waited a long time for one.', 'happy')],
      [
        ask(
          'maths',
          'compare sizes: bigger and smaller',
          'K.MD.A.2',
          0,
          [N('Look at Maui and your Nubbin. Who is bigger?')],
          [
            opt('Maui is bigger', [N('Yes! Maui is huge. Your Nubbin is tiny next to him.')], true),
            opt('The Nubbin is bigger', [
              N('Look again. Maui is as big as a hill, and the Nubbin is smaller.'),
            ]),
            opt('They are the same', [N('Not the same! Maui is much bigger than your Nubbin.')]),
          ],
          'Compared two sizes and said which is bigger.',
        ),
      ],
    ),
    sc(
      'a10-06-statue',
      [
        N('Maui has shut you in a cave with a boulder.'),
        M('He is taking my boat!', 'angry'),
        N('Inside the cave is a huge stone Maui. It is hollow.'),
        N('Moana climbs up inside it. You climb after her.'),
        N('At the top is a hole. Far below, a canoe sails away.'),
        M('Right.', 'angry'),
        N('She jumps, and so do you. Your Nubbin shuts its eyes, but falls anyway.'),
      ],
      [
        ask(
          'sel',
          'calming down when you feel cross',
          'CASEL: Self-management',
          2,
          [N('Moana feels cross. What can help when you feel cross?')],
          [
            opt(
              'Take a slow, deep breath',
              [N('Yes. Big, slow breaths help the cross feeling get smaller.')],
              true,
            ),
            opt('Stamp and shout for hours', [
              N('Stamping is very noisy. Slow breaths help most.'),
            ]),
            opt('Hide away', [N('Hiding does not fix it. A slow breath is a better start.')]),
          ],
          'Talked about calming down when cross: slow, deep breaths.',
        ),
      ],
    ),
    sc(
      'a10-06-statue-done',
      [N('The sea catches you like a hand. It sets you on the deck.')],
      [
        ask(
          'literacy',
          'tell what happened first, next and last',
          'RL.K.3',
          0,
          [N('First Moana climbed. Next she jumped.'), N('What came last?')],
          [
            opt(
              'The sea set them on the canoe',
              [N('Yes! Last, the sea set them gently on the deck.')],
              true,
            ),
            opt('They ate dinner', [N('Not yet! Last, the sea set them on the canoe.')]),
            opt('They flew home', [N('No flying home. The sea set them on the canoe.')]),
          ],
          'Put events in order: climbed, jumped, landed on the canoe.',
        ),
      ],
    ),
    sc(
      'a10-06-complete',
      [
        MU('No, no. You cannot be on my boat!', 'shock'),
        N('He drops Moana over the side. The sea puts her back.'),
        N('He does it again. The sea puts her back again.'),
        N('He tries your Nubbin. The sea puts it back on his head.'),
        N('Heihei walks off the edge. Plop. The sea puts him back.'),
        N('Heihei does not notice. Heihei never notices.'),
        MU('Fine! The ocean is on your side.', 'angry'),
      ],
      [
        doit(
          'maths',
          'count to 2',
          'K.CC.B.5',
          2,
          'edu:count:times:2',
          [
            N('(Count how many times the sea put Moana back.)'),
            N('One time, two times. The sea put Moana back two times!'),
          ],
          'Counted two times, using fingers.',
        ),
      ],
    ),
  ],
  'A10-6. Maui is shown with respect as a hero of many island peoples.',
);

// ================================================================== A10-7 The Kakamora
const Q07 = quest(
  'a10-07',
  'The Kakamora',
  {
    'a10-07-s1': g('Watch the strange boat come out of the fog.', 'Stand at the stern.'),
    'a10-07-s2': g('Get Heihei back from the pirates.', 'Follow Moana across.'),
    'a10-07-s3': g('Get the canoe away from the raft.', 'Hold the sail line tight.'),
  },
  [
    sc(
      'a10-07-fog',
      [
        N('Maui is steering. Moana counts that as a start.'),
        N('A fog bank lies ahead. Out of it comes a sound of drums.'),
        N('A raft comes out, made of many boats. Little round people crew it.'),
        N('They wear coconut armour, with faces painted on the front.'),
        MU('Kakamora! Pirates! They take everything they see.', 'shock'),
        N('Your Nubbin looks at them. They look at your Nubbin.'),
      ],
      [
        notice(
          'science',
          'fog is a low cloud that makes it hard to see far',
          'ELOF: Scientific Reasoning',
          1,
          [
            N('Fog is a cloud that sits low over the sea.'),
            N('In fog, it is hard to see far. Sailors go slowly and listen.'),
          ],
          'Heard that fog is a low cloud that makes it hard to see.',
        ),
      ],
      {
        choices: [
          {
            id: 'wave',
            label: 'Let your Nubbin wave at them.',
            then: [N('Your Nubbin waves. Forty coconuts wave back, all at once.')],
          },
          {
            id: 'hold',
            label: 'Scoop your Nubbin up and hold it close.',
            then: [N('Across the water, several painted faces look hurt.')],
          },
        ],
      },
    ),
    sc(
      'a10-07-fog-done',
      [
        M('Why are they looking at it like that?', 'think'),
        MU('They think it is one of theirs. A little one without a coconut.', 'think'),
      ],
      [
        ask(
          'literacy',
          'understand why characters act as they do',
          'RL.2.3',
          1,
          [N('Why do the Kakamora stare at Nubbin?')],
          [
            opt(
              'They think it is one of them',
              [MU('Yes. Round, small, and a bit lost. Just like them!')],
              true,
            ),
            opt('They are hungry', [N('Not hungry. They think your Nubbin is one of theirs.')]),
            opt('They want to race', [N('Not a race. They think your Nubbin belongs with them.')]),
          ],
          'Worked out a character’s reason: the Kakamora thought Nubbin was one of theirs.',
        ),
      ],
    ),
    sc(
      'a10-07-chase',
      [
        N('Little darts stick in the deck. Pirates swarm aboard.'),
        N('One pirate grabs Heihei and runs off with him.'),
        M('Heihei swallowed the heart! He thought it was a pebble!', 'shock'),
        N('Moana jumps to their raft. Your Nubbin jumps too.'),
        N('The pirates let it through. One paints a face on its tummy.'),
        N('Your Nubbin picks up Heihei and walks back. Nobody stops it.'),
      ],
      [
        ask(
          'maths',
          'name a shape',
          'K.G.A.2',
          4,
          [N('A coconut is round like a ball. Which flat shape is round?')],
          [
            opt('A circle', [N('Yes! A circle is round, like the front of a coconut.')], true),
            opt('A triangle', [N('A triangle has three corners. A circle is round.')]),
            opt('A square', [N('A square has four corners. A circle is round.')]),
          ],
          'Named a circle as the round shape.',
        ),
      ],
    ),
    sc(
      'a10-07-chase-done',
      [
        N('Moana swings back on a rope. Your Nubbin clings to her back.'),
        N('Heihei clings to your Nubbin. He is calmly eating a dart.'),
      ],
      [
        ask(
          'science',
          'animal sounds',
          'ELOF: Scientific Reasoning',
          1,
          [N('Heihei is a rooster. What sound does a rooster make?')],
          [
            opt('Cock-a-doodle-doo!', [N('Yes! Cock-a-doodle-doo! Do it with me!')], true),
            opt('Moo', [N('Moo is a cow! A rooster goes cock-a-doodle-doo.')]),
            opt('Woof', [N('Woof is a dog! A rooster goes cock-a-doodle-doo.')]),
          ],
          'Matched an animal (rooster) with its sound.',
        ),
      ],
    ),
    sc(
      'a10-07-escape',
      [
        MU('Hold that line! Tighter! No, the other line!', 'angry'),
        N('You hold a rope that hums. The canoe leans and leaps.'),
        N('The raft comes after you, drums going.'),
        N('Moana points to a gap between two boats of the raft.'),
        M('There! Go between them!'),
        N('The canoe shoots through the gap. The raft comes unlashed.'),
      ],
      [
        ask(
          'maths',
          'words for where things are',
          'K.G.A.1',
          4,
          [N('Where does the canoe go? Point to your answer.')],
          [
            opt('Between the two boats', [N('Yes! Between the two boats. Whoosh!')], true),
            opt('Over the top', [N('Not over. The canoe goes between them.')]),
            opt('Under the water', [N('Not under! It goes between the two boats.')]),
          ],
          'Used a position word (between) to say where the canoe went.',
        ),
      ],
    ),
    sc(
      'a10-07-escape-done',
      [N('The pirates drift off in the fog, drumming crossly.')],
      [
        notice(
          'sel',
          'teamwork: each person has a job',
          'CASEL: Relationship skills',
          0,
          [
            N('Maui steered and Moana pointed. You held the rope.'),
            N('Everyone had a job. Teams work best when everyone helps.'),
          ],
          'Noticed that a team works when everyone has a job.',
        ),
      ],
    ),
    sc(
      'a10-07-complete',
      [
        N('Heihei coughs up the green stone. Moana washes it twice.'),
        M('Now you must help me. I saved your boat.', 'happy'),
        MU('My boat.', 'angry'),
        MU('A fire demon guards the heart. I need my hook to get past.', 'think'),
        MU('My hook is at the bottom of the world.'),
        M('Then teach me to sail.'),
        N('Your Nubbin still has a fierce face on its tummy.'),
      ],
      [
        doit(
          'art',
          'draw a face to show a feeling',
          'ELOF: Approaches to Learning',
          6,
          'edu:draw:face:happy',
          [
            N('(Draw a face on paper. Make it happy, or fierce, or silly.)'),
            N('Faces can show how we feel. How does yours feel?'),
          ],
          'Drew a face to show a feeling.',
        ),
      ],
    ),
  ],
  'A10-7. Darts are blunt; nobody is hit; the pirates drum and never speak.',
);

// ================================================================== A10-8 Wayfinding
const Q08 = quest(
  'a10-08',
  'Wayfinding',
  {
    'a10-08-s1': g('Learn to read the stars with your hand.', 'Sit at the stern after dark.'),
    'a10-08-s2': g('Feel the swell through the hull.', 'Lie on the deck, one hand on the wood.'),
    'a10-08-s3': g('Watch for the bird going home.', 'At dusk, watch from the bow.'),
  },
  [
    sc(
      'a10-08-stars',
      [
        N('Night falls clear. The sky is so full of stars it looks crowded.'),
        MU('You want to sail? Start with the stars. Hold your hand out flat.'),
        N('Moana holds out her hand, and so do you. Your Nubbin tries too.'),
        MU('Stars come up in the same places, every night. Learn where.'),
        MU('Then you know which way you are going.'),
        M('That is it? That is the secret?', 'think'),
        MU('That is night one. It takes years.', 'soft'),
      ],
      [
        notice(
          'science',
          'stars rise and set in the same places each night',
          '1-ESS1-1',
          3,
          [
            N('Stars come up on one side of the sky and set on the other.'),
            N('They do it every night. Sailors use them like a map in the sky.'),
          ],
          'Heard that stars rise and set in the same places, so sailors can steer by them.',
        ),
      ],
    ),
    sc(
      'a10-08-stars-done',
      [N('Moana checks her hand against the same star, again and again.')],
      [
        doit(
          'maths',
          'count to 5',
          'K.CC.B.5',
          0,
          'edu:count:fingers:5',
          [
            N('(Hold out your hand. Count your fingers.)'),
            N('One, two, three, four, five. A whole hand is five fingers!'),
          ],
          'Counted five fingers on one hand.',
        ),
      ],
    ),
    sc(
      'a10-08-swell',
      [
        MU('Clouds hide the stars. Now what?'),
        MU('Lie down. Put your hand on the hull. Shut your eyes. Be quiet.', 'think'),
        N('The canoe lifts and falls, slow as breathing.'),
        MU('That is the swell. Big, slow waves from far away.'),
        MU('Keep it at the same angle, and you keep your course.'),
        M('There! I can feel two swells!', 'happy'),
      ],
      [
        doit(
          'science',
          'swells are long, slow waves',
          'ELOF: Scientific Reasoning',
          3,
          'edu:move:swell',
          [
            N('(Lay your hand flat. Lift it up and down, slowly, like a swell.)'),
            N('Swells are long, slow waves from far away. They keep coming the same way.'),
          ],
          'Felt a slow rise and fall, like an ocean swell, with their own hand.',
        ),
      ],
      {
        choices: [
          {
            id: 'feel',
            label: 'Feel for the second swell yourself.',
            then: [N('You wait. Then you feel it: a second, smaller lift.')],
          },
          {
            id: 'nubbin',
            label: 'Let your Nubbin try.',
            then: [N('Your Nubbin lies with its whole face on the wood. It falls asleep.')],
          },
        ],
      },
    ),
    sc(
      'a10-08-swell-done',
      [MU('Huh. Not bad. Not good. Not bad.', 'think')],
      [
        notice(
          'sel',
          'learning takes time and patience',
          'CASEL: Self-management',
          0,
          [
            N('Moana did not learn it all in one go. Nobody does.'),
            N('Learning takes time. Being patient with yourself helps.'),
          ],
          'Heard that learning something new takes time and patience.',
        ),
      ],
    ),
    sc(
      'a10-08-birds',
      [
        N('At dusk, Maui sits at the bow beside your Nubbin.'),
        MU('In the morning, sea birds fly out from land. At dusk, they fly home.'),
        N('A white bird crosses the red sky. It is in a hurry.'),
        N('Your Nubbin points with its whole arm. Then its whole body.', 'happy'),
        MU('Good. That way is land!'),
        M('Stars. Swells. Birds.', 'think'),
      ],
      [
        ask(
          'science',
          'some sea birds fly home to land at dusk',
          'ELOF: Scientific Reasoning',
          2,
          [N('The bird flies home at dusk. Which way is land?')],
          [
            opt(
              'The way the bird is flying',
              [MU('Yes! Follow the bird home, and you find land.', 'happy')],
              true,
            ),
            opt('The way the bird came from', [
              MU('Not quite. At dusk the bird is heading home to land.'),
            ]),
            opt('Nobody can tell', [
              MU('We can! The bird is going home. So land is where it goes.'),
            ]),
          ],
          'Learned that at dusk some sea birds fly home to land, which shows sailors where land is.',
        ),
      ],
    ),
    sc(
      'a10-08-birds-done',
      [N('Moana takes the steering oar for the first time. Maui lets her.')],
      [
        notice(
          'social-studies',
          'real sailors steered by stars, swells and birds',
          'D2.His.2.K-2',
          0,
          [
            N('Real sailors in the Pacific did this long ago.'),
            N('They used stars, swells and birds, and no maps. Some still learn it today.'),
          ],
          'Heard that real Pacific sailors steered by stars, swells and birds long ago, and some still do.',
        ),
      ],
    ),
    sc(
      'a10-08-complete',
      [
        N('That night, Moana weaves strips of leaf left over from the sail.'),
        N('In the morning there is a tiny woven sail on your Nubbin’s back.'),
        M('Every voyager needs a sail. Even a small one.', 'happy'),
        N('Your Nubbin spins to see it. Heihei spins too.'),
      ],
      [
        ask(
          'maths',
          'continue a pattern',
          'ELOF: Mathematics Development',
          1,
          [N('Weaving goes: over, under, over, under.'), N('What comes next?')],
          [
            opt('Over', [N('Yes! Over, under, over, under, over. A pattern!')], true),
            opt('Under', [N('Close! Say it slowly: over, under, over, under... then over.')]),
            opt('Jump', [N('Jump is not in the pattern. Over, under, over, under, then over!')]),
          ],
          'Continued an over-under weaving pattern.',
        ),
      ],
    ),
  ],
  'A10-8. Star compass, swells and birds in very simple form; the reward is a woven sail.',
);

// ================================================================== A10-9 Lalotai
const Q09 = quest(
  'a10-09',
  'Lalotai',
  {
    'a10-09-s1': g(
      'Climb the tall rock at the edge of the world.',
      'Climb the pillar, ledge by ledge.',
    ),
    'a10-09-s2': g('Find your way through the Realm of Monsters.', 'Follow the glowing plants.'),
    'a10-09-s3': g('Get the hook back from the crab.', 'Keep Tamatoa talking.'),
  },
  [
    sc(
      'a10-09-pillar',
      [
        N('A stone pillar stands alone in the sea. Its top is in the clouds.'),
        MU('The way down is at the top. Yes. The way down is up.'),
        N('Maui climbs it by being huge. Moana climbs with fingers and toes.'),
        N('You climb behind her. Your Nubbin holds your heel.'),
        N('At the top, Maui speaks old words, low and quiet.', 'soft'),
        N('The rock opens. Below is a long way down, and a glow.'),
      ],
      [
        ask(
          'literacy',
          'opposites',
          'ELOF: Language and Communication',
          1,
          [N('Maui says, “The way down is up.” What is the opposite of up?')],
          [
            opt(
              'Down',
              [MU('Yes! Up and down are opposites. Silly way, but true here.', 'happy')],
              true,
            ),
            opt('Over', [MU('Close, but not quite. The opposite of up is down.')]),
            opt('Round', [MU('Not round. The opposite of up is down.')]),
          ],
          'Named the opposite of up (down).',
        ),
      ],
    ),
    sc(
      'a10-09-pillar-done',
      [
        MU('Wait here. This is no place for a… Moana? Moana!', 'shock'),
        N('She has jumped, and so has your Nubbin. You sigh, and jump too.'),
      ],
      [
        ask(
          'sel',
          'stopping to think before you act',
          'CASEL: Responsible decision-making',
          1,
          [N('Moana jumped fast. What can you do before you jump into something new?')],
          [
            opt('Look and think first', [N('Yes. Look, think, then go. It keeps us safe.')], true),
            opt('Close your eyes and go', [N('Looking first is safer. Look, think, then go.')]),
            opt('Never try new things', [N('New things are great! Just look and think first.')]),
          ],
          'Talked about looking and thinking before trying something new.',
        ),
      ],
    ),
    sc(
      'a10-09-depths',
      [
        N('You land on a big flower. It closes up a little, curious.'),
        N('Lalotai is upside down. The sea is the sky here.'),
        N('Below you, everything glows: purple, green and gold.'),
        N('Something with too many eyes blinks at you, and goes back to its crack.'),
        M('Maui’s hook is with something that loves shiny things.', 'think'),
        N('Your Nubbin’s glowing ball floats above its head. Many eyes turn.', 'shock'),
      ],
      [
        notice(
          'science',
          'some deep-sea animals make their own light',
          'ELOF: Scientific Reasoning',
          2,
          [
            N('Deep in the real sea it is very dark. The sun’s light cannot reach.'),
            N('Some animals there make their own light. They glow like tiny lamps.'),
          ],
          'Heard that some deep-sea animals make their own light.',
        ),
      ],
    ),
    sc(
      'a10-09-depths-done',
      [
        N('A trail of shiny things leads into a cave.'),
        N('A shell, a bone, an earring, a golden canoe!'),
      ],
      [
        doit(
          'maths',
          'count to 4',
          'K.CC.B.5',
          1,
          'edu:count:treasure:4',
          [
            N('(Count the shiny things on your fingers.)'),
            N('A shell, a bone, an earring, a golden canoe. Four things!'),
          ],
          'Counted four shiny things, one finger each.',
        ),
      ],
    ),
    sc(
      'a10-09-lair',
      [
        N('Below is a crab as big as a house, covered in treasure.'),
        N('A bone fish hook sits on the very top.'),
        TM('Visitors! Lunch does not usually knock.'),
        TM('Oh! What is that on the little round one? It glows!', 'happy'),
        N('Your Nubbin, worried, turns its ball into a question mark.'),
        TM('It does tricks!', 'shock'),
      ],
      [
        notice(
          'literacy',
          'punctuation marks show feeling: ! and ?',
          'ELOF: Literacy',
          4,
          [
            N('Nubbin’s ball can be a question mark. That means, “I am not sure.”'),
            N('It can be an exclamation mark! That means, “Wow!”'),
          ],
          'Heard what question marks and exclamation marks mean.',
        ),
      ],
      {
        choices: [
          {
            id: 'show',
            label: 'Let your Nubbin show off its ball.',
            then: [N('Heart, spiral, plain ball, exclamation mark. Tamatoa claps his claws.')],
          },
          {
            id: 'ask',
            label: 'Ask Tamatoa about his shell.',
            then: [
              TM('Since you ask. Every piece is a story. Let me start at the bottom.', 'happy'),
            ],
          },
        ],
      },
    ),
    sc(
      'a10-09-lair-done',
      [N('Behind him, Moana climbs his shell and lifts off the hook.')],
      [
        notice(
          'science',
          'crabs have a hard shell and claws',
          'ELOF: Scientific Reasoning',
          0,
          [
            N('Real crabs have a hard shell on the outside, and two claws.'),
            N('Most crabs walk sideways. The shell keeps their soft body safe.'),
          ],
          'Heard that crabs have a hard shell and two claws, and walk sideways.',
        ),
      ],
    ),
    sc(
      'a10-09-complete',
      [
        TM('Wait! That is mine. Everything here is mine!', 'angry'),
        N('Moana throws the hook to Maui. He catches it.'),
        N('Tamatoa topples onto his back, with his legs waving.'),
        TM('Somebody turn me over! I am never undignified!', 'angry'),
        N('A warm geyser carries you all up into the real sky.'),
        N('Your Nubbin’s painted face washes off in the sea.'),
      ],
      [
        ask(
          'sel',
          'naming a feeling',
          'ELOF: Social and Emotional Development',
          3,
          [N('Tamatoa is stuck on his back. How might he feel?')],
          [
            opt(
              'Embarrassed and cross',
              [N('Yes. He feels embarrassed. Proud crabs hate looking silly!')],
              true,
            ),
            opt('Calm and sleepy', [N('Not calm. He is waving his legs and shouting.')]),
            opt('Very hungry', [N('Maybe a bit! But mostly he is embarrassed and cross.')]),
          ],
          'Named feelings (embarrassed, cross) for a character stuck on his back.',
        ),
      ],
    ),
  ],
  'A10-9. Monsters glow and are never gory; the old words at the pillar are not written out.',
);

// ================================================================== A10-10 The Hook
const Q10 = quest(
  'a10-10',
  'The Hook',
  {
    'a10-10-s1': g('Watch Maui try to change shape.', 'Stay well back on the deck.'),
    'a10-10-s2': g('Sit with Maui while he talks.', 'Sit near him. Do not push.'),
    'a10-10-s3': g('Help Maui find his hawk.', 'Steer into the wind.'),
  },
  [
    sc(
      'a10-10-practice',
      [
        MU('My hook is back! Hawk!', 'happy'),
        N('Flash! Where Maui was, a fish flaps on the deck.'),
        MU('Hawk!', 'angry'),
        N('Flash! Now a pig. Your Nubbin and Pua would get on.'),
        MU('A thousand years without it. Hawk!', 'angry'),
        N('Flash! A hawk with a shark’s head flops into the sea.'),
      ],
      [
        ask(
          'science',
          'where animals live',
          'K-ESS3-1',
          1,
          [N('Maui turned into a fish. Where do fish live?')],
          [
            opt('In water', [N('Yes! Fish live in water. They breathe with gills.')], true),
            opt('In trees', [N('Not trees. Fish live in water.')]),
            opt('In beds', [N('Not beds! Fish live in water: the sea, rivers and ponds.')]),
          ],
          'Learned that fish live in water.',
        ),
      ],
    ),
    sc(
      'a10-10-practice-done',
      [N('Maui climbs back aboard as himself. He sits down hard at the stern.')],
      [
        notice(
          'literacy',
          'a new feeling word: frustrated',
          'ELOF: Language and Communication',
          0,
          [
            N('Maui is frustrated. That means cross, because something will not work.'),
            N('Say it with me: frus-trat-ed. Have you ever felt frustrated?'),
          ],
          'Learned the feeling word “frustrated” and linked it to their own experience.',
        ),
      ],
    ),
    sc(
      'a10-10-story',
      [
        N('Nobody speaks for a long time. You all sit near Maui.'),
        M('Are all your tattoos things you did?'),
        MU('Every one. I earned every one.', 'soft'),
        MU('When I was a baby, my first family did not keep me.', 'sad'),
        MU('So I gave people gifts. So they would want me.', 'sad'),
        M('The gifts were kind. But nobody has to earn being loved.', 'soft'),
      ],
      [
        notice(
          'sel',
          'you are loved just for being you',
          'CASEL: Self-awareness',
          5,
          [
            N('Moana is right. Nobody has to earn love.'),
            N('Every child is loved just for being them, not for what they do.'),
          ],
          'Heard that every child is loved just for being themselves.',
        ),
      ],
      {
        choices: [
          {
            id: 'water',
            label: 'Pass him the water gourd.',
            then: [N('He takes it, holds it, and does not give it back.')],
          },
          {
            id: 'closer',
            label: 'Say nothing. Sit a little closer.',
            then: [N('Your Nubbin climbs into Maui’s lap and stays there.')],
          },
        ],
      },
    ),
    sc(
      'a10-10-story-done',
      [N('Maui does not answer. But he does not turn his back again.')],
      [
        ask(
          'literacy',
          'how characters respond to events',
          'RL.2.3',
          0,
          [N('Maui stayed close this time. What does that show?')],
          [
            opt(
              'He felt a little better',
              [N('Yes. Being listened to helped Maui feel a little better.')],
              true,
            ),
            opt('He wanted a nap', [
              N('Maybe, but mostly he felt a little better being listened to.'),
            ]),
            opt('He was cross', [
              N('He was sad, not cross. Staying close shows he felt a bit better.'),
            ]),
          ],
          'Understood how a character’s actions show his feelings.',
        ),
      ],
    ),
    sc(
      'a10-10-hawk',
      [
        M('Try again. Not because you have to. Because you can.'),
        MU('…Hawk.', 'think'),
        N('A flash. A softer flash this time.'),
        N('A great hawk lifts off and climbs in a wide spiral.', 'happy'),
        M('Look at him go!', 'happy'),
        N('You steer into the wind. Your Nubbin throws its arms up, as if flying.'),
      ],
      [
        notice(
          'science',
          'hawks have wide wings and ride the wind',
          'ELOF: Scientific Reasoning',
          3,
          [
            N('A hawk has wide, strong wings. It can ride the wind without flapping.'),
            N('That is how it glides high up, in big circles.'),
          ],
          'Heard that hawks have wide wings and glide on the wind.',
        ),
      ],
    ),
    sc(
      'a10-10-hawk-done',
      [N('The hawk dives, pulls up, and lands on the mast. It is grinning.')],
      [
        ask(
          'maths',
          'words for where things are',
          'K.G.A.1',
          0,
          [N('Where did the hawk land?')],
          [
            opt('On top of the mast', [N('Yes! On top of the mast. High above the deck.')], true),
            opt('Under the canoe', [N('Not under. The hawk landed on top of the mast.')]),
            opt('Beside the sun', [N('Not beside the sun! On top of the mast.')]),
          ],
          'Used a position word (on top of) for where the hawk landed.',
        ),
      ],
    ),
    sc(
      'a10-10-complete',
      [
        MU('Did you see? The roll at the end? I did a roll!', 'happy'),
        M('We saw. The fish saw too.', 'happy'),
        N('He teaches her steering and the shapes of waves. He is a good teacher.'),
        N('That evening, Moana steers alone. Maui sleeps.'),
      ],
      [
        notice(
          'sel',
          'practice helps you get better',
          'CASEL: Self-management',
          0,
          [
            N('Maui tried again and again, until the hawk came.'),
            N('Practice, and kind friends, help us get better at hard things.'),
          ],
          'Heard that practice and kind friends help us improve at hard things.',
        ),
      ],
    ),
  ],
  'A10-10. Maui’s first family not keeping him is told softly; the lesson is that love is not earned.',
);

// ================================================================== A10-11 Te Ka
const Q11 = quest(
  'a10-11',
  'Te Kā',
  {
    'a10-11-s1': g('Sail up to the dark islands at night.', 'Keep watch from the bow.'),
    'a10-11-s2': g('Get the canoe away from the fire.', 'Bail and hold the sail.'),
    'a10-11-s3': g('Stand by while Maui and Moana talk.', 'Stay on deck.'),
  },
  [
    sc(
      'a10-11-barrier',
      [
        N('A ring of black islands lies across the sea, smoking.'),
        MU('The island is behind them. Te Kā guards the way. Let me go first.'),
        M('I know the swell now. There is a gap.'),
        N('The ash moves. A giant of rock and fire stands up.'),
        N('Your Nubbin hides under the deck with Heihei. Very sensible.'),
      ],
      [
        notice(
          'science',
          'many Pacific islands began as volcanoes under the sea',
          '2-ESS1-1',
          0,
          [
            N('Many real islands in the Pacific began as volcanoes under the sea.'),
            N('Hot rock came up, cooled, and built the island, bit by bit.'),
          ],
          'Heard that many Pacific islands began as volcanoes and grew slowly.',
        ),
      ],
    ),
    sc(
      'a10-11-barrier-done',
      [N('Te Kā roars. It is the sound of a very loud, very cross mountain.')],
      [
        ask(
          'sel',
          'what to do when something feels too big and scary',
          'CASEL: Responsible decision-making',
          0,
          [N('Something loud and scary is near. What can you do?')],
          [
            opt(
              'Stay safe and tell a grown-up',
              [N('Yes. Stay safe, and tell a grown-up. Scared is fine.')],
              true,
            ),
            opt('Run at it', [N('Running at something scary is not safe. Tell a grown-up.')]),
            opt('Pretend it is not there', [N('Pretending does not help. Tell a grown-up.')]),
          ],
          'Talked about what to do when scared: stay safe and tell a grown-up.',
        ),
      ],
    ),
    sc(
      'a10-11-gap',
      [
        N('Moana turns for the gap. Maui, as a hawk, leads Te Kā away.'),
        N('Te Kā swats at him. He swerves and dives.'),
        M('Nearly there!'),
        N('Te Kā’s hand comes down. Maui blocks it with his hook. Crack!', 'shock'),
        N('The wave throws the canoe far out into the dark sea. Nobody is hurt.'),
      ],
      [
        doit(
          'maths',
          'count to 4',
          'K.CC.B.5',
          4,
          'edu:count:crew:4',
          [
            N('(Count who is on the canoe.)'),
            N('Moana, you, Nubbin and Heihei. Four!'),
            N('Heihei counts, even if he does not know it.'),
          ],
          'Counted four friends on the canoe.',
        ),
      ],
      {
        choices: [
          {
            id: 'line',
            label: 'Grab the sail line.',
            then: [N('You get the line and keep it. The sail tears but stays on.')],
          },
          {
            id: 'heihei',
            label: 'Grab Heihei, who has wandered out again.',
            then: [N('You catch Heihei by the tail. He gives you a funny look.')],
          },
        ],
      },
    ),
    sc(
      'a10-11-gap-done',
      [N('The sea goes quiet. The sail is torn, and Te Kā’s glow sinks.')],
      [
        notice(
          'science',
          'wind pushes a sail and waves push a boat',
          'ELOF: Scientific Reasoning',
          0,
          [
            N('Wind pushes a sail, and the boat moves. Waves can push a boat too.'),
            N('Strong wind and big waves push hard. That is how the sail got torn.'),
          ],
          'Heard that wind pushes sails and waves push boats.',
        ),
      ],
    ),
    sc(
      'a10-11-crack',
      [
        N('Maui holds his hook. A crack runs through it.'),
        MU('I told you to turn back. Look at it.', 'angry'),
        M('We can fix it. We will try again.'),
        MU('One more hit and it is gone. And then who wants me?', 'angry'),
        M('That is not true. You know it is not.', 'sad'),
        MU('I am sorry. Good luck.', 'sad'),
        N('A hawk lifts off the stern and flies north.'),
      ],
      [
        ask(
          'sel',
          'what friends can do after an argument',
          'CASEL: Relationship skills',
          6,
          [N('Maui and Moana argued. What can friends do afterwards?')],
          [
            opt(
              'Say sorry and listen',
              [N('Yes. Sorry and listening help friends feel close again.')],
              true,
            ),
            opt('Never speak again', [
              N('Never speaking keeps hurt going. Sorry and listening help.'),
            ]),
            opt('Pretend it did not happen', [
              N('Pretending does not fix hurt. Sorry and listening do.'),
            ]),
          ],
          'Talked about repairing an argument with sorry and listening.',
        ),
      ],
    ),
    sc(
      'a10-11-crack-done',
      [N('Moana watches him get smaller. Then he is gone.', 'sad')],
      [
        ask(
          'literacy',
          'explain what is happening in a story',
          'RL.K.3',
          0,
          [N('Why does Maui get smaller and smaller?')],
          [
            opt(
              'He is flying far away',
              [N('Yes! The farther away he flies, the smaller he looks.')],
              true,
            ),
            opt('He is shrinking', [N('He is not shrinking. He is flying far away.')]),
            opt('He is hiding', [N('Not hiding. He is flying away, so he looks small.')]),
          ],
          'Explained that things look smaller when they are farther away.',
        ),
      ],
    ),
    sc(
      'a10-11-complete',
      [
        N('Moana sits at the bow with the green stone. She does not cry.'),
        M('I cannot do this. I am not enough.', 'sad'),
        N('She holds the stone out. The sea takes it, gently.'),
        N('You do not say anything. You sit beside her.'),
        N('Your Nubbin comes out and sits beside you too.'),
        N('You all sit like that, for a long time.'),
      ],
      [
        notice(
          'sel',
          'sitting beside someone helps',
          'CASEL: Relationship skills',
          5,
          [
            N('You did not fix Moana’s sad feeling. You sat beside her.'),
            N('Sitting beside someone is a kind way to help.'),
          ],
          'Noticed that simply sitting beside a sad friend is kind and helpful.',
        ),
      ],
    ),
  ],
  'A10-11. Te Ka is spooky but nobody is hurt; the hand that comes down is blocked.',
);

// ================================================================== A10-12 The Manta Ray
const Q12 = quest(
  'a10-12',
  'The Manta Ray',
  {
    'a10-12-s1': g('Watch the light under the water.', 'Look over the side.'),
    'a10-12-s2': g('Watch the manta. Let your Nubbin answer.', 'Bring your Nubbin to the side.'),
    'a10-12-s3': g('Listen to Gramma’s song.', 'Sit with Moana and Gramma.'),
  },
  [
    sc(
      'a10-12-light',
      [
        N('Late at night, a soft blue light comes up under the canoe.'),
        N('It is a manta ray, glowing, circling the hulls.'),
        N('At the stern sits Gramma Tala, glowing blue like the manta.', 'soft'),
        N('It is not her body. It is her spirit, come to visit.', 'soft'),
        G('Well. You are a long way past the reef.'),
        M('Gramma?', 'shock'),
        G('I told you I would come back as one of those.', 'happy'),
        N('Moana hugs her. Gramma is see-through, like mist.'),
        N('The hug feels real anyway.', 'soft'),
      ],
      [
        notice(
          'science',
          'manta rays are huge, gentle fish that glide',
          'ELOF: Scientific Reasoning',
          1,
          [
            N('A real manta ray is a very big flat fish. It has wide wings.'),
            N('It is gentle. It glides through the water and eats tiny sea food.'),
          ],
          'Heard that manta rays are huge, gentle, gliding fish.',
        ),
      ],
      {
        choices: [
          {
            id: 'room',
            label: 'Go to the bow and give them room.',
            then: [N('You look at the stars. Gramma catches your eye and nods.')],
          },
          {
            id: 'hello',
            label: 'Bring your Nubbin to say hello.',
            then: [
              N('Your Nubbin pats Gramma’s knee, gently.'),
              G('Hello, small one. Still a bit crooked? Good!', 'happy'),
            ],
          },
        ],
      },
    ),
    sc(
      'a10-12-light-done',
      [G('I am not here to give orders. I am here because you are sad.', 'soft')],
      [
        notice(
          'sel',
          'you can miss someone and still love them',
          'CASEL: Self-awareness',
          0,
          [
            N('Moana misses Gramma. Missing someone is a kind of love.'),
            N('Remembering them keeps them close in your heart.'),
          ],
          'Heard that missing someone is a kind of love, and remembering keeps them close.',
        ),
      ],
    ),
    sc(
      'a10-12-manta',
      [
        N('The manta turns and rises. It glides beside the canoe.'),
        N('Its wings are out wide and level. It never flaps.'),
        N('Your Nubbin stands up, very slowly.'),
        N('It spreads its arms, leans, and slides along the deck on one foot.', 'happy'),
        N('The manta glides, and your Nubbin glides. Side by side!'),
        G('There. You did not forget.', 'soft'),
        N('Moana laughs. It is her first laugh since the dark islands.'),
      ],
      [
        doit(
          'health',
          'copy a gliding movement',
          'ELOF: Perceptual, Motor, and Physical Development',
          3,
          'edu:move:glide-step',
          [
            N('(Stand up and hold your arms out wide. Lean and glide, slow and soft.)'),
            N('Glide, glide, glide. Never flap!'),
          ],
          'Copied a slow, gliding movement.',
        ),
      ],
    ),
    sc(
      'a10-12-manta-done',
      [G('Things you are taught with love, you keep. They stay put.', 'soft')],
      [
        ask(
          'literacy',
          'what a character says teaches us a lesson',
          'RL.2.3',
          0,
          [N('What does Gramma say stays with us?')],
          [
            opt(
              'Things we learn with love',
              [G('Yes! Things taught with love stay in our hearts.', 'soft')],
              true,
            ),
            opt('Things we lose', [G('Not lost things. The things we learn with love stay.')]),
            opt('Only toys', [G('Not just toys. What we learn with love stays with us.')]),
          ],
          'Understood a character’s message: what we learn with love stays with us.',
        ),
      ],
    ),
    sc(
      'a10-12-song',
      [
        G('Tell me about yourself. Not the chief’s daughter bit. The rest.', 'soft'),
        M('I do not know. I thought I did.', 'sad'),
        N('Gramma sings, very low. An old voyaging song.'),
        N('It has names of islands in it. And names of people, back and back.'),
        N('The stars become sails. The great canoes cross the sky.'),
        N('Moana stands up straight. She is crying and she is strong.'),
        M('Everything I was taught, I still have. I will take it back myself.', 'happy'),
      ],
      [
        notice(
          'social-studies',
          'songs and stories carry memory across generations',
          'D2.His.2.K-2',
          6,
          [
            N('Gramma’s song has names in it. Long ago, songs helped people remember.'),
            N('Songs and stories carry the past, from grown-ups to children.'),
          ],
          'Heard that songs and stories helped people remember the past.',
        ),
      ],
    ),
    sc(
      'a10-12-song-done',
      [
        N('She swims down into the dark. The sea puts the stone in her hand.'),
        N('The sea is very good at putting things back.', 'happy'),
      ],
      [
        ask(
          'sel',
          'what helps us feel strong',
          'CASEL: Self-awareness',
          1,
          [N('What helped Moana feel strong?')],
          [
            opt(
              'Remembering people who love her',
              [N('Yes. Love and kind words make us feel strong.')],
              true,
            ),
            opt('Having a new hat', [N('Hats are nice! But remembering love helps most.')]),
            opt('Eating lunch', [
              N('Lunch helps! But remembering people who love her helped most.'),
            ]),
          ],
          'Talked about what helps us feel strong: remembering people who love us.',
        ),
      ],
    ),
    sc(
      'a10-12-complete',
      [
        N('Moana climbs back aboard, and the stern is empty. The manta glides away.'),
        N('She mends the sail by starlight. You hold the edges.'),
        M('She is not gone, is she? Not really.'),
        Y('Nobody you love is ever all the way gone.', 'soft'),
        M('No. I do not think so either.', 'soft'),
        N('At dawn she turns the canoe back towards the dark islands.'),
      ],
      [
        notice(
          'science',
          'the sun rises in the east',
          '1-ESS1-1',
          5,
          [
            N('The sun comes up in the east each morning.'),
            N('Moana can steer by the dawn, just as she did by the stars.'),
          ],
          'Heard that the sun rises in the east each morning.',
        ),
      ],
    ),
  ],
  'A10-12. Gramma’s song is never written out. The step payoff variant is a10-12-manta-wave.',
);

// ================================================================== A10-13 Te Fiti
const Q13 = quest(
  'a10-13',
  'Te Fiti',
  {
    'a10-13-s1': g('Run the dark islands again.', 'Hold the sail while Moana steers.'),
    'a10-13-s2': g('Look at where the green island should be.', 'Climb the mast.'),
    'a10-13-s3': g('Walk the path behind Moana.', 'Choose how you go.'),
  },
  [
    sc(
      'a10-13-run',
      [
        N('This time Moana sails the swell: left, right, left, right.'),
        N('Te Kā’s fire falls where the canoe was, not where it is.'),
        M('Hold it! Now let go! Now!'),
        N('You let go. The canoe spins round a rock, as if dancing.'),
        N('A hawk drops from the sky. It becomes Maui, with his cracked hook.', 'shock'),
        MU('Told you to let me go first.', 'happy'),
        M('You came back!', 'happy'),
      ],
      [
        ask(
          'maths',
          'continue a pattern',
          'ELOF: Mathematics Development',
          1,
          [N('Moana sails: left, right, left, right.'), N('What comes next?')],
          [
            opt('Left', [N('Yes! Left, right, left, right, left. A pattern!')], true),
            opt('Right', [N('Close. Say it slowly: left, right, left, right... then left.')]),
            opt('Up', [N('Not up. Left, right, left, right, then left!')]),
          ],
          'Continued a left-right pattern.',
        ),
      ],
    ),
    sc(
      'a10-13-run-done',
      [MU('Go! I will hold her!'), N('His hook meets Te Kā’s fist and breaks. He stands firm.')],
      [
        notice(
          'sel',
          'coming back to help is brave',
          'CASEL: Relationship skills',
          1,
          [
            N('Maui had left. Then he came back to help.'),
            N('Coming back is brave. Friends can start again.'),
          ],
          'Noticed that coming back to help a friend is brave.',
        ),
      ],
    ),
    sc(
      'a10-13-spiral',
      [
        N('Moana climbs the mast. You climb after her.'),
        N('Where the green island should be, there is only a hollow in the sea.', 'shock'),
        N('On Te Kā’s chest is a mark: a spiral.'),
        N('It is the same spiral as on the green stone. And your shell.'),
        M('Oh.', 'soft'),
        M('She is Te Fiti, without her heart.', 'soft'),
      ],
      [
        ask(
          'maths',
          'name a shape',
          'ELOF: Mathematics Development',
          3,
          [N('What shape is on the stone, the shell and Te Kā’s chest?')],
          [
            opt('A spiral', [N('Yes! A spiral goes round and round, and in.')], true),
            opt('A square', [
              N('A square has four corners. This one goes round and round: a spiral.'),
            ]),
            opt('A star', [N('Not a star. It goes round and round: a spiral.')]),
          ],
          'Named a spiral shape seen on three objects.',
        ),
      ],
    ),
    sc(
      'a10-13-spiral-done',
      [
        N('Moana climbs down. She holds up her hand to the open water.'),
        N('The sea parts. A path of wet sand opens, straight to Te Kā.', 'shock'),
      ],
      [
        ask(
          'literacy',
          'say who a character really is',
          'RL.K.3',
          1,
          [N('Moana knows a secret now. Who is the fiery giant, really?')],
          [
            opt(
              'Te Fiti, without her heart',
              [N('Yes! The giant is Te Fiti. She lost her heart.')],
              true,
            ),
            opt('A big crab', [N('Not a crab. The spiral shows it: the giant is Te Fiti.')]),
            opt('A storm cloud', [N('Not a cloud. The giant is Te Fiti, missing her heart.')]),
          ],
          'Worked out who a character really is from a clue (the spiral).',
        ),
      ],
    ),
    sc(
      'a10-13-walk',
      [
        N('Moana walks down the path through the sea.'),
        N('Te Kā sees her and comes roaring down. Moana keeps walking.'),
        N('You step onto the wet sand. Your heart goes like a drum.'),
      ],
      [
        ask(
          'sel',
          'a gentle way to meet someone upset',
          'CASEL: Social awareness',
          2,
          [
            N('Te Kā is hurting, and hurting can look scary.'),
            N('Walking up to fire giants is a job for heroes in stories.'),
            N('When a friend is upset, how can you go to them gently?'),
          ],
          [
            opt('Slowly, with open hands', [N('Yes. Slow and open says, “I am a friend.”')], true),
            opt('Shouting back', [N('Shouting adds noise. Slow and open hands is gentler.')]),
            opt('Run at them, roaring', [
              N('That is what Te Kā does! Slow and kind is better.'),
            ]),
          ],
          'Talked about a gentle way to go to an upset friend: slowly, with open hands.',
        ),
      ],
      {
        choices: [
          {
            id: 'gift',
            label: 'Carry the spiral shell in your open hand.',
            set: { 'a10-approach': 'gift' },
            then: [
              N('You hold out the little spiral shell on your palm.'),
              N('Te Kā sees the same spiral. The roar goes quieter.', 'soft'),
            ],
          },
          {
            id: 'word',
            label: 'Say, out loud, that you remember her.',
            set: { 'a10-approach': 'word' },
            then: [
              Y('We remember you. All the green. We remember who gave it.', 'soft'),
              N('Your voice is small against the fire. It carries anyway.'),
            ],
          },
          {
            id: 'walk',
            label: 'Just keep walking, slowly, hands open.',
            set: { 'a10-approach': 'walk' },
            then: [
              N('You say nothing. You walk slowly with your hands open.'),
              N('Your Nubbin walks beside you, step for step.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a10-13-walk-done',
      [
        N('Te Kā stoops, enormous. Fire runs off her like water.'),
        M('I see the spiral. I know you. You have waited a long time.', 'soft'),
        N('Moana touches her forehead to Te Kā’s. The giant goes very still.'),
      ],
      [
        ask(
          'literacy',
          'the meaning of a new word',
          'ELOF: Language and Communication',
          2,
          [N('The giant goes very still. What does still mean?')],
          [
            opt('Not moving', [N('Yes! Still means not moving at all. Calm and quiet.')], true),
            opt('Very fast', [N('Not fast. Still means not moving.')]),
            opt('Very loud', [N('Not loud. Still means not moving, and quiet.')]),
          ],
          'Learned that “still” means not moving.',
        ),
      ],
    ),
    sc(
      'a10-13-complete',
      [
        N('Moana sets the green stone into the spiral on Te Kā’s chest. It fits.'),
        N('The fire goes out. Moss grows, then ferns, then flowers.'),
        N('The giant softens into a green woman lying down.'),
        N('She becomes an island again. Green, and more green, and more.', 'happy'),
        N('Te Fiti opens her eyes. She looks at Moana, you, and your Nubbin.'),
        N('She gives Maui his hook, mended and new.', 'soft'),
        MU('I am sorry for what I took.', 'sad'),
        N('Te Fiti smiles. The sea around her goes clear and full of fish.', 'soft'),
      ],
      [
        notice(
          'science',
          'clean, clear water helps coral reefs and fish; plants need soil, water and light',
          'K-ESS3-3',
          7,
          [
            N('When the sea is clean and clear, coral and fish do well.'),
            N('Plants grow when they have soil, water and light. We can look after them.'),
          ],
          'Heard that clean water helps reefs and fish, and what plants need.',
        ),
      ],
    ),
  ],
  'A10-13. Signature choice a10-approach is kept as in the original.',
);

// ================================================================== A10-14 Voyagers Again
const Q14 = quest(
  'a10-14',
  'Voyagers Again',
  {
    'a10-14-s1': g('Say goodbye to Maui.', 'Stand with Moana on deck.'),
    'a10-14-s2': g('Bring the canoe home to Motunui.', 'Sail in through the reef.'),
    'a10-14-s3': g('Sail out with Motunui’s first voyage.', 'Take your place at the bow.'),
  },
  [
    sc(
      'a10-14-farewell',
      [
        N('The canoe rides a clear sea. Maui sits at the stern, one last time.'),
        MU('You could come with me. Lots of islands.'),
        M('I have an island. And lots of people to teach.', 'happy'),
        MU('Teach them the stars, the swells, and the birds.', 'soft'),
        N('On his arm is a new mark: a girl at a steering oar.', 'soft'),
        MU('I did not do that one. It just turned up. Best one I have.', 'happy'),
        MU('Goodbye, coconut. You were the least use, and I will miss you most.', 'happy'),
      ],
      [
        notice(
          'sel',
          'goodbyes can feel sad and happy together',
          'CASEL: Self-awareness',
          6,
          [
            N('Saying goodbye can feel sad and happy at once.'),
            N('You can wave, hug, or draw a picture to say goodbye.'),
          ],
          'Heard that goodbyes can feel sad and happy together.',
        ),
      ],
      {
        choices: [
          {
            id: 'heart',
            label: 'Let your Nubbin say goodbye its own way.',
            then: [N('Your Nubbin holds up a heart ball as high as it can.')],
          },
          {
            id: 'hawks',
            label: 'Tell him you will watch for hawks.',
            then: [
              Y('We will watch for hawks. Any hawk.', 'soft'),
              MU('Do. If it does a roll at the top, it is me.', 'happy'),
            ],
          },
        ],
      },
    ),
    sc(
      'a10-14-farewell-done',
      [N('A flash. A hawk climbs in a spiral, rolls, and is gone.')],
      [
        notice(
          'social-studies',
          'the Pacific is the biggest ocean, with thousands of islands',
          '2-ESS2-2',
          0,
          [
            N('Moana’s sea is the Pacific Ocean. It is the biggest ocean on Earth.'),
            N('It has thousands of islands. On a map, they look like tiny green dots.'),
          ],
          'Heard that the Pacific is the biggest ocean and holds thousands of islands.',
        ),
      ],
    ),
    sc(
      'a10-14-home',
      [
        N('Motunui rises from the sea, green and greener.'),
        N('There are fish in the lagoon, flicking silver over the sand.'),
        N('Moana steers in through the same reef, without a wobble.'),
        N('Her mother runs down the beach. Her father runs too.'),
        T('Moana!'),
        T('You went past the reef.', 'soft'),
        M('I went past the reef. And I came home. Both.', 'happy'),
        S('Of course she did. I packed her lunch.', 'happy'),
        N('Chief Tui looks at Sina. Sina looks at the sea.'),
        N('Nobody says who knew.'),
      ],
      [
        ask(
          'sel',
          'naming a feeling',
          'CASEL: Social awareness',
          8,
          [N('Tui sees Moana safe at home. How does he feel?')],
          [
            opt('Happy and relieved', [N('Yes! Happy and relieved. A big breath out.')], true),
            opt('Grumpy', [N('Not grumpy. He is so happy and relieved to see her.')]),
            opt('Sleepy', [N('Not sleepy! He is happy and relieved.')]),
          ],
          'Named feelings (happy, relieved) for a parent seeing a child safe.',
        ),
      ],
    ),
    sc(
      'a10-14-home-done',
      [N('Moana climbs the hill of chiefs’ stones. She puts a shell on top.')],
      [
        ask(
          'maths',
          'words for where things are',
          'K.G.A.1',
          0,
          [N('Where does Moana put her shell?')],
          [
            opt('On top of the stones', [N('Yes! On top of the stones. The highest place.')], true),
            opt('Under the stones', [N('Not under. She puts it on top.')]),
            opt('Beside the sea', [N('Not beside the sea. On top of the stones.')]),
          ],
          'Used a position word (on top of) for where the shell goes.',
        ),
      ],
    ),
    sc(
      'a10-14-bow',
      [
        N('The village goes through the waterfall. The great canoes come into the light.'),
        N('You carry an oar, and your Nubbin carries Heihei. Pua bosses everyone.'),
        N('The sails go up. Moana holds her hand out flat to the horizon.'),
        N('A blue light comes up under the hulls. The manta glides beside you.', 'soft'),
        N('Your Nubbin climbs to the bow tip. It does Gramma’s glide over the water.', 'happy'),
        N('The people see, and point. Some laugh, and some cry.'),
        T('That is my mother’s step. I thought it was just her.', 'soft'),
        M('It is never just one person.', 'soft'),
      ],
      [HOKULEA(3)],
    ),
    sc(
      'a10-14-bow-done',
      [N('The canoes sail on, towards an island nobody has seen yet.', 'happy')],
      [
        doit(
          'maths',
          'count to 3',
          'K.CC.B.5',
          0,
          'edu:count:clues:3',
          [
            N('(Hold up three fingers. Say them: stars, swells, birds.)'),
            N('Three clues for finding the way. Three fingers!'),
          ],
          'Counted three wayfinding clues: stars, swells and birds.',
        ),
      ],
    ),
    sc(
      'a10-14-complete',
      [
        N('At sunset, Moana sits beside you at the bow.'),
        M('You never said where you came from.'),
        Y('A garden with a pond. I am a long way from it.', 'soft'),
        M('Then you know the way home. You always know where you started.', 'soft'),
        N('Out at sea, Te Fiti’s shore is green. Your shell is there, with her.'),
        ...A14_HOME,
        N('A white spiral shell is painted on the canoe’s prow.', 'happy'),
      ],
      [HOME_DRAW(3)],
    ),
  ],
  'A10-14. Rewards are unchanged. The Hokulea notice is the 1976 voyage to Tahiti.',
);

// ================================================================== variants
export const EDU_A10_SPROUT_VARIANTS: EduScene[] = [
  sc(
    'a10-12-manta-wave',
    [
      N('The manta turns and rises. It rolls along beside the canoe.'),
      N('It rises with each swell and sinks with it.'),
      N('Your Nubbin stands up, very slowly.'),
      N('It goes up on its toes, and down, rolling its arms, right on beat.', 'happy'),
      N('The manta rises, and your Nubbin rises. Side by side!'),
      G('There. You did not forget.', 'soft'),
      N('Moana laughs. It is her first laugh since the dark islands.'),
    ],
    [WAVE_STEP(3)],
  ),
  sc(
    'a10-14-bow-wave',
    [
      N('The village goes through the waterfall. The great canoes come into the light.'),
      N('You carry an oar, and your Nubbin carries Heihei. Pua bosses everyone.'),
      N('The sails go up. Moana holds her hand out flat to the horizon.'),
      N('A blue light comes up under the hulls. The manta rises and sinks.', 'soft'),
      N('Your Nubbin climbs to the bow tip. It does Gramma’s wave step.', 'happy'),
      N('The people see, and point. Some laugh, and some cry.'),
      T('That is my mother’s step. I thought it was just her.', 'soft'),
      M('It is never just one person.', 'soft'),
    ],
    [HOKULEA(3)],
  ),
  sc(
    'a10-14-complete-word',
    [
      N('At sunset, Moana sits beside you at the bow.'),
      M('You never said where you came from.'),
      Y('A garden with a pond. I am a long way from it.', 'soft'),
      M('Then you know the way home. You always know where you started.', 'soft'),
      M('On the path, you said you remembered her. I think she heard.', 'soft'),
      ...A14_HOME,
      N('Along the hull is a line of small carved spirals. Your Nubbin counts them.', 'happy'),
    ],
    [HOME_DRAW(3)],
  ),
  sc(
    'a10-14-complete-walk',
    [
      N('At sunset, Moana sits beside you at the bow.'),
      M('You never said where you came from.'),
      Y('A garden with a pond. I am a long way from it.', 'soft'),
      M('Then you know the way home. You always know where you started.', 'soft'),
      M('On the path, you said nothing. You just came. That was brave.', 'happy'),
      ...A14_HOME,
      N('Two pairs of footprints are painted on the deck. Your Nubbin stands in one.', 'happy'),
    ],
    [HOME_DRAW(3)],
  ),
];

// ================================================================== exports
export const EDU_A10_SPROUT: EduQuest[] = [
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
];

/** Every `edu:` check string used by a `do` lesson in this band. */
export const CHECKS: string[] = [
  'edu:count:gifts:3',
  'edu:count:canoes:5',
  'edu:move:sway',
  'edu:clap:syllables:manta',
  'edu:clap:beat:steady',
  'edu:say:kind-words',
  'edu:count:gourds:4',
  'edu:say:sound-words:whoosh',
  'edu:count:times:2',
  'edu:draw:face:happy',
  'edu:count:fingers:5',
  'edu:move:swell',
  'edu:count:treasure:4',
  'edu:count:crew:4',
  'edu:move:glide-step',
  'edu:move:wave-step',
  'edu:count:clues:3',
  'edu:draw:home',
];
