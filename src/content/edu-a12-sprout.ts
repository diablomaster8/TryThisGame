/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Atlas A12, The Mirror Shard.
 *
 * Source: atlas-a12.ts (ATLAS_A12 and A12_VARIANTS). One EduScene per original scene (every step
 * scene, every done scene, every complete scene and every variant), id `sprout:<original id>`.
 * See EDU-STYLE.md. British spelling.
 *
 * - Every choice id and `set` flag is copied from the original, so `a12-nubbin` still works. The
 *   sprout band keeps every choice: all of A12's choices are kind and safe (no `defaultChoice` needed).
 * - No line is lifted from the source. The story is retold in new words.
 * - Softened for this age: Kay's “kiss” becomes a wrap in the fur; the raven's death is said plainly
 *   with comfort; the robber girl's knife stays in the wall (and a lesson says knives are for
 *   grown-ups); the Snow Queen is tall, pale and cold, never a monster.
 * - Culture: always “the Sámi woman” and “the Finnish woman”, never “Lapp”. No gákti, drum or
 *   sacred item is described. Reindeer herding is a living job today. The far north is a real place.
 * - Every fact is well established (six-armed snowflakes, melting and freezing, frost, seasons,
 *   reindeer antlers and lichen, midnight sun and polar night, the Pole Star, vibrations make sound).
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
const GE = say('a12-gerda');
const KA = say('a12-kay');
const GR = say('a12-gran');
const QU = say('a12-queen');
const TR = say('a12-troll');
const OW = say('a12-old-woman');
const RO = say('a12-roses');
const BW = say('a12-bindweed');
const SD = say('a12-snowdrop');
const BC = say('a12-buttercup');
const NA = say('a12-narcissus');
const RA = say('a12-raven');
const PR = say('a12-palace-raven');
const PN = say('a12-prince');
const PS = say('a12-princess');
const RG = say('a12-robber-girl');
const BA = say('a12-bae');
const PI = say('a12-pigeons');
const SA = say('a12-sami');
const FI = say('a12-finnish');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];
type Domain = Lesson['domain'];

/** One answer option. `best` marks the answer the lesson teaches. */
const opt = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

/** A notice beat: a character shares something true. */
const note = (
  after: number,
  domain: Domain,
  skill: string,
  standard: string,
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

/** An ask beat: a question with options. */
const ask = (
  after: number,
  domain: Domain,
  skill: string,
  standard: string,
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

/** A do beat: the child does something in the Grove. */
const doit = (
  after: number,
  domain: Domain,
  skill: string,
  standard: string,
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

// ================================================================== A12-1 The Troll’s Mirror
const Q01: EduQuest = quest(
  'a12-01',
  'The Troll’s Mirror',
  {
    'a12-01-s1': {
      goal: 'Climb the stairs and meet Grandmother.',
      hint: 'Touch the page. Then go up the attic stairs.',
    },
    'a12-01-s2': {
      goal: 'Hold the candle for Grandmother’s shadow-show.',
      hint: 'Stand by the wall. Keep the candle still.',
    },
    'a12-01-s3': {
      goal: 'Watch the troll’s mirror break.',
      hint: 'Keep the candle steady to the end of the show.',
    },
  },
  [
    sc(
      'a12-01-arrive',
      [
        N('Nova’s atlas opens at a page made of cut paper.'),
        N('Rooftops! Chimneys! Two attic windows, side by side.'),
        N('You climb a steep wooden stair with your Nubbin.'),
        GR('There you are, lodger. Your bed is by the chimney.'),
        GR('The other bed creaks. It grumbles all night.'),
        GR('Mind your head on the beam. Everyone bumps it.'),
        N('Across the gutter, a boy and a girl wave. They are Kay and Gerda.'),
        GR('And what is this? It is not a cat.', 'think'),
      ],
      [
        ask(
          5,
          'maths',
          'above and below',
          'K.G.A.1',
          [N('Where is the beam? Above your head, or under your feet?')],
          [
            opt('Above my head', [GR('Yes! Look up. The beam is above you.', 'happy')], true),
            opt('Under my feet', [GR('Look up! The beam is above your head. Mind it.')]),
          ],
          'Practised the position words above and below.',
        ),
      ],
      {
        choices: [
          {
            id: 'nubbin',
            label: 'Tell her it’s a Nubbin.',
            then: [GR('A Nubbin! It can have the end of the bed.')],
          },
          {
            id: 'friend',
            label: 'Say it’s your friend.',
            then: [GR('Good. Friends are worth a bed.', 'soft')],
          },
          {
            id: 'bow',
            label: 'Let your Nubbin bow.',
            then: [
              N('Your Nubbin bows. Boing! It nearly tumbles down.'),
              GR('Manners. It can stay.', 'happy'),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-01-arrive-done',
      [
        GR('That is Kay and Gerda. They live across the gutter.'),
        GR('Each evening there is a story. You hold the candle.'),
      ],
      [
        ask(
          1,
          'sel',
          'saying yes to helping',
          'CASEL: Relationship skills',
          [N('Grandmother asks you to hold the candle. What do you say?')],
          [
            opt(
              'Yes, I will help!',
              [GR('Thank you. Helping is a kind thing to do.', 'happy')],
              true,
            ),
            opt('No, that is boring.', [GR('It might be fun! Helping makes a story go well.')]),
          ],
          'Talked about saying yes when someone asks for help.',
        ),
      ],
    ),
    sc(
      'a12-01-show',
      [
        N('Late summer. Kay and Gerda climb across the gutter.'),
        N('Grandmother has black paper and long scissors. Snip, snip, snip!'),
        GR('Hold the candle high. Now the wall is a stage.'),
        N('A paper troll steps onto the wall. He holds a thin mirror.'),
        GR('His mirror made good things look small.'),
        GR('And it made ugly things look big.', 'think'),
        KA('I’d like to look in it.'),
        GE('I wouldn’t.', 'sad'),
      ],
      [
        ask(
          3,
          'science',
          'shadows need light',
          '1-PS4-2',
          [N('The troll is a shadow on the wall. What makes a shadow?')],
          [
            opt(
              'Paper that blocks the candle light',
              [GR('Yes! The paper blocks the light. That makes a dark shape.', 'happy')],
              true,
            ),
            opt('Nothing at all', [
              GR('Something blocks the light. Try it: hold your hand in front of a lamp.'),
            ]),
          ],
          'Learned that a shadow is made when something blocks light.',
        ),
      ],
    ),
    sc(
      'a12-01-show-done',
      [
        N('Grandmother does the troll’s voice. It is deep and pleased.'),
        TR('Ha! See how small good things look in my mirror!', 'happy'),
      ],
      [
        ask(
          1,
          'literacy',
          'words for feelings',
          'RL.1.4',
          [N('How does the troll feel? Pleased, or sad?')],
          [
            opt('Pleased', [GR('Yes. He is pleased with his wicked mirror.', 'happy')], true),
            opt('Sad', [GR('Listen to his big laugh. He is pleased, not sad.')]),
          ],
          'Named a character’s feeling from the way he sounded.',
        ),
      ],
    ),
    sc(
      'a12-01-shards',
      [
        GR('The troll had a school. His pupils took the mirror everywhere.'),
        GR('Then it slipped from their hands. Crash!', 'shock'),
        N('Grandmother opens her fingers. Paper snips fall like snow.'),
        GR('It broke into more pieces than people. Some were as small as sand.'),
        GR('A piece in your eye makes things look wrong.'),
        GR('A piece in your heart makes it cold.', 'sad'),
        KA('And then what?'),
        GR('Then you need someone to come and fetch you.', 'soft'),
      ],
      [
        ask(
          4,
          'maths',
          'comparing sizes',
          'K.MD.A.2',
          [N('Which is smaller: a grain of sand, or a big snip?')],
          [
            opt(
              'A grain of sand',
              [GR('Yes! A grain of sand is tiny, tinier than any snip.', 'happy')],
              true,
            ),
            opt('A big snip', [GR('A big snip is bigger. The grain of sand is the smaller one.')]),
          ],
          'Compared two sizes: smaller and bigger.',
        ),
      ],
      {
        choices: [
          {
            id: 'brush',
            label: 'Brush the snips off Gerda’s sleeve.',
            then: [N('You brush them off. Gerda checks her other sleeve, twice.')],
          },
          {
            id: 'catch',
            label: 'Catch a snip as it falls.',
            then: [N('You catch one. It is only paper. You look at it a long time.')],
          },
          {
            id: 'ask',
            label: 'Ask who comes to fetch you.',
            then: [GR('Whoever loves you most. They are stubborn about it.')],
          },
        ],
      },
    ),
    sc(
      'a12-01-shards-done',
      [
        N('The troll laughs on the wall. Grandmother blows out the candle.'),
        N('In the dark, something glints once. Then it is gone.'),
      ],
      [
        note(
          1,
          'science',
          'no light, no shadows',
          '1-PS4-2',
          [GR('Whoosh, the candle is out. No light means no shadows.')],
          'Heard that we need light to see, and that shadows need light too.',
        ),
      ],
    ),
    sc(
      'a12-01-complete',
      [
        N('Later you lie in the bed by the chimney.'),
        N('The other bed goes creak, creak. It grumbles, just as Grandmother said.'),
        N('Two small rose trees bloom in the dark across the gutter.'),
        N('Your Nubbin curls up on your feet.'),
        N('Rain begins to fall. Pitter, patter, pitter, patter.'),
      ],
      [
        doit(
          4,
          'literacy',
          'clap the syllables',
          'RF.K.2',
          'edu:clap:syllables:pitter-patter',
          [N('(Clap along: pit, ter, pat, ter. Four claps!)')],
          'Clapped the parts of the words pitter-patter.',
        ),
      ],
    ),
  ],
);

// ================================================================== A12-2 Two Windows
const Q02: EduQuest = quest(
  'a12-02',
  'Two Windows',
  {
    'a12-02-s1': {
      goal: 'Water the roses in the gutter boxes.',
      hint: 'Climb out to the gutter with the watering can.',
    },
    'a12-02-s2': {
      goal: 'Warm a coin and melt a peephole in the frosty window.',
      hint: 'Warm a coin on the stove. Press it on the glass.',
    },
    'a12-02-s3': {
      goal: 'Look out of your window that night.',
      hint: 'Wait quietly at your peephole.',
    },
  },
  [
    sc(
      'a12-02-roses',
      [
        N('In the morning you see two attics. Their roofs nearly touch.'),
        N('A gutter runs between them. Peas hang over the boxes.'),
        N('In each box grows a rose tree. Together they make an arch.'),
        GE('You’re tallest. Water the top of the arch.'),
        GE('Not too much water! The peas sulk.'),
        KA('Peas don’t sulk.'),
        GE('These ones do. Look. Sulky peas.'),
        KA('Gran says the roses will last until we’re old.'),
        N('Your Nubbin tries to help. It sits in the watering can.'),
      ],
      [
        ask(
          6,
          'science',
          'what plants need',
          'K-LS1-1',
          [N('What do roses need to grow?')],
          [
            opt(
              'Water and sunshine',
              [GE('Yes! Water and sunshine make roses grow.', 'happy')],
              true,
            ),
            opt('Only sweets', [GE('Roses like water and sunshine. Not sweets!')]),
          ],
          'Learned that plants need water and light to live.',
        ),
      ],
      {
        choices: [
          {
            id: 'top',
            label: 'Water the top of the arch.',
            then: [N('Drip, drip! A drop falls on Kay’s head. He pretends not to notice.')],
          },
          {
            id: 'peas',
            label: 'Give the peas a bit extra.',
            then: [GE('See? They are cheering up.', 'happy'), KA('They look the same.')],
          },
          {
            id: 'nubbin',
            label: 'Lift your Nubbin out of the can.',
            then: [N('Your Nubbin comes out dripping. Gerda dries it. All is forgiven.')],
          },
        ],
      },
    ),
    sc(
      'a12-02-roses-done',
      [
        GE('In winter we can’t climb across.'),
        GE('We go down all our stairs and up all the others.'),
        KA('It takes years!'),
        GE('It takes two minutes.'),
      ],
      [
        ask(
          3,
          'maths',
          'longer and shorter',
          'K.MD.A.2',
          [N('Which way is shorter? Across the gutter, or down all the stairs?')],
          [
            opt(
              'Across the gutter',
              [GE('Yes! The gutter is the short way. It takes no time.', 'happy')],
              true,
            ),
            opt('Down all the stairs', [GE('The stairs are the long way. The gutter is shorter.')]),
          ],
          'Compared a short path with a long path.',
        ),
      ],
    ),
    sc(
      'a12-02-frost',
      [
        N('Winter comes. Ice ferns grow on the windows.'),
        N('Kay and Gerda warm copper coins on the stove.'),
        N('They press a coin on the glass. The ice melts into a round hole.'),
        N('Through the hole, a bright eye looks across the snow.'),
        GR('Look at the white bees swarming in the snow.', 'soft'),
        KA('Do they have a queen?'),
        GR('They do. Some nights she looks in at windows.'),
        KA('I’d put her on the hot stove! She would melt.', 'happy'),
      ],
      [
        ask(
          2,
          'science',
          'warm things melt ice',
          '2-PS1-4',
          [N('What melts the ice on the window?')],
          [
            opt('A warm coin', [GR('Yes! Warm things melt ice.', 'happy')], true),
            opt('A cold spoon', [GR('A cold spoon keeps ice icy. A warm coin melts it.')]),
          ],
          'Learned that something warm melts ice.',
        ),
      ],
      {
        choices: [
          {
            id: 'rude',
            label: 'Tell Kay that’s unkind to a guest.',
            then: [KA('She isn’t a guest. She’s weather.')],
          },
          {
            id: 'seen',
            label: 'Ask Grandmother if she has seen her.',
            then: [GR('Once or twice, through the glass. Not close.', 'think')],
          },
          {
            id: 'peep',
            label: 'Look out of your own peephole.',
            then: [N('Snowflakes whirl past by the thousand. One seems to look back.')],
          },
        ],
      },
    ),
    sc(
      'a12-02-frost-done',
      [N('Grandmother smooths Kay’s hair.'), N('She tells a story about a goose instead.')],
      [
        ask(
          0,
          'sel',
          'kind wishes',
          'CASEL: Social awareness',
          [N('Kay wished the queen would melt. Is that a kind wish?')],
          [
            opt(
              'No, it isn’t kind',
              [GR('Right. Unkind wishes make hearts cold. Kind words keep them warm.', 'soft')],
              true,
            ),
            opt('Yes, it is kind', [
              GR('Hmm. Wishing someone harm is not kind. Kind words keep hearts warm.'),
            ]),
          ],
          'Talked about why a kind wish is better than an unkind one.',
        ),
      ],
    ),
    sc(
      'a12-02-night',
      [
        N('That night you can’t sleep. Your Nubbin looks out the peephole.'),
        N('Across the gutter, Kay stands on a chair at his window.'),
        N('A big snowflake lands on the flower box. It grows!'),
        N('It grows into a tall lady made of ice and starlight.'),
        N('She is lovely and cold. Her eyes shine like stars.'),
        N('She looks in at Kay. She waves her hand. Come!'),
      ],
      [
        ask(
          1,
          'science',
          'seasons and weather',
          'K-ESS2-1',
          [N('Snow is falling. Which season is it? Summer, or winter?')],
          [
            opt('Winter', [GR('Yes! Snow comes in the cold winter.', 'happy')], true),
            opt('Summer', [GR('Summer is warm. Snow comes in winter.')]),
          ],
          'Linked snow to winter weather.',
        ),
      ],
      {
        choices: [
          {
            id: 'knock',
            label: 'Knock on your window.',
            then: [
              N('You knock hard. Kay jumps down.'),
              N('The lady is gone. A big white bird flies past.'),
            ],
          },
          {
            id: 'call',
            label: 'Call Kay’s name.',
            then: [
              N('You call his name. Kay jumps down.'),
              N('The box is empty. Something white flies by, like a big bird.'),
            ],
          },
          {
            id: 'hold',
            label: 'Pull your Nubbin back from the glass.',
            then: [
              N('Your Nubbin is cold right through. It snuggles into your shirt.'),
              N('Kay jumps down. A white bird passes. The box is empty.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-02-night-done',
      [N('You sit up until morning.'), N('The frost on your window has grown into ferns.')],
      [
        note(
          1,
          'science',
          'frost is ice',
          '2-ESS2-3',
          [GR('Frost is ice. Water from the air freezes on the cold glass.')],
          'Heard that frost is ice that grows on very cold glass.',
        ),
      ],
    ),
    sc(
      'a12-02-complete',
      [
        KA('It was a dream. I dreamed a lady on the box.'),
        GE('I dreamed you stood on a chair.', 'think'),
        KA('Well, I wasn’t.'),
        N('Grandmother looks at Kay a little longer than usual.'),
        N('Then the thaw comes. The swallows come back. The roses wake up.'),
      ],
      [
        ask(
          4,
          'science',
          'spring follows winter',
          'K-ESS2-1',
          [N('The swallows are back and the snow has melted. Which season is it?')],
          [
            opt('Spring', [GR('Yes! After winter comes spring.', 'happy')], true),
            opt('Winter', [GR('Winter is cold and snowy. Melting snow and swallows mean spring.')]),
          ],
          'Named spring as the season that follows winter.',
        ),
      ],
    ),
  ],
);

// ================================================================== A12-3 The Splinter
const Q03: EduQuest = quest(
  'a12-03',
  'The Splinter',
  {
    'a12-03-s1': {
      goal: 'Sit under the rose arch with Kay and Gerda.',
      hint: 'Climb to the gutter. Take the spare stool.',
    },
    'a12-03-s2': {
      goal: 'Put the rose box straight again.',
      hint: 'Lift the box. Press the earth round the roots.',
    },
    'a12-03-s3': { goal: 'Go out in the snow with Kay.', hint: 'Follow Gerda down to the street.' },
  },
  [
    sc(
      'a12-03-arch',
      [
        N('It is summer. The roses are the best ever.'),
        N('Gerda sings a rose hymn. Kay sings it back.'),
        N('They look at a picture book of animals. Kay does the noises.'),
        KA('That is an elk. It goes like this.'),
        GE('It does not!', 'happy'),
        N('The church clock begins to strike five.'),
        KA('Ow! Something stung my heart. And my eye!', 'sad'),
        N('A tiny bit of the troll’s mirror flies into Kay’s eye.'),
        N('Another bit goes into his heart.'),
      ],
      [
        ask(
          6,
          'maths',
          'count the bongs',
          'K.CC.B.5',
          [N('Bong, bong, bong, bong, bong. How many bongs did the clock make?')],
          [
            opt('Five', [GE('Yes! One, two, three, four, five. Five o’clock!', 'happy')], true),
            opt('Three', [GE('Let’s count again: one, two, three, four, five. Five bongs.')]),
          ],
          'Counted five bongs of a clock.',
        ),
      ],
      {
        choices: [
          {
            id: 'eye',
            label: 'Look in Kay’s eye.',
            then: [N('You look gently. There is nothing there, you think.')],
          },
          {
            id: 'hand',
            label: 'Hold Kay’s hand.',
            then: [N('His hand is warm. Then it is not quite so warm.')],
          },
          {
            id: 'gran',
            label: 'Call Grandmother.',
            then: [
              N('Grandmother peers in. She finds nothing at all.'),
              GR('Blink. Again. There. Gone.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-03-arch-done',
      [KA('It’s gone. I think it’s gone.'), N('It hasn’t gone.')],
      [
        ask(
          0,
          'sel',
          'naming feelings',
          'ELOF: Social and Emotional Development',
          [N('Kay says “Ow!” and looks sad. How does Kay feel?')],
          [
            opt(
              'Hurt and worried',
              [GR('Yes. Hurt and worried. It is fine to feel that.', 'soft')],
              true,
            ),
            opt('Very happy', [GR('Look at his face. He is hurt and worried, not happy.')]),
          ],
          'Named a friend’s feelings: hurt and worried.',
        ),
      ],
    ),
    sc(
      'a12-03-kick',
      [
        GE('Kay? Are you all right?', 'sad'),
        KA('Stop crying! It looks silly!', 'angry'),
        KA('These roses are ugly. They have worms.'),
        N('The mirror bit makes Kay say mean things. It is not really Kay talking.'),
        N('He kicks the box. Two roses fall over the edge.'),
        N('You reach for him. But you can’t pull a splinter out of a heart.', 'sad'),
        N('Kay slams his window. Gerda holds her book close.'),
        GE('He said it is a baby book.', 'sad'),
        N('Your Nubbin glares at every window in the street, just in case.'),
      ],
      [
        ask(
          6,
          'sel',
          'helping a sad friend',
          'CASEL: Social awareness',
          [N('Gerda is sad. What helps a sad friend?')],
          [
            opt('Sit close and be kind', [GE('Yes. Sitting close helps a lot.', 'soft')], true),
            opt('Tell her to stop crying', [
              GE('That does not help. Sitting close and listening does.'),
            ]),
          ],
          'Talked about what really helps a sad friend.',
        ),
      ],
      {
        choices: [
          {
            id: 'roses',
            label: 'Fetch the two roses back for Gerda.',
            then: [N('You fish them back. Gerda puts them in a cup of water.')],
          },
          {
            id: 'knock',
            label: 'Knock on Kay’s window.',
            then: [N('Kay opens it. He pulls a horrible face at you.'), N('Then he shuts it.')],
          },
          {
            id: 'quiet',
            label: 'Say nothing. Straighten the box together.',
            then: [N('You lift the box together. Your Nubbin pats the earth flat.')],
          },
        ],
      },
    ),
    sc(
      'a12-03-kick-done',
      [
        N('The rose tree has lost two flowers and a bit of bark.'),
        N('Roses forgive that, if you leave them be.'),
      ],
      [
        note(
          1,
          'science',
          'plants can recover',
          'K-LS1-1',
          [GR('Give a rose water and sun, and it grows new flowers.')],
          'Heard that a plant with water and light can grow back.',
        ),
      ],
    ),
    sc(
      'a12-03-glass',
      [
        N('All autumn, Kay is clever and unkind. He copies Grandmother’s voice.'),
        N('Everyone laughs. But he copies Gerda too, only the parts that hurt.'),
        N('When snow comes, he runs out with a big glass.'),
        N('He catches snowflakes on his sleeve.'),
        KA('Look, Gerda! Look how perfect they are!', 'happy'),
        N('Under the glass each flake is a six-pointed star.'),
        GE('Real flowers smell of something.'),
        KA('That’s what is wrong with them.'),
      ],
      [
        doit(
          5,
          'maths',
          'count how many',
          'K.CC.B.5',
          'edu:count:snowflake-arms:6',
          [N('(Point to the star’s arms and count them. One, two, three, four, five, six!)')],
          'Counted the six arms of a snowflake.',
        ),
      ],
      {
        choices: [
          {
            id: 'look',
            label: 'Look in the glass.',
            then: [N('You look. The flake is lovely, but it feels cold and flat.')],
          },
          {
            id: 'snowball',
            label: 'Throw a snowball at Kay.',
            then: [N('Splat! Kay almost laughs. Then he brushes it off, bored.')],
          },
          {
            id: 'gerda',
            label: 'Stand by Gerda.',
            then: [N('You stand by Gerda. Your Nubbin leans on her boot.')],
          },
        ],
      },
    ),
    sc(
      'a12-03-glass-done',
      [KA('I’m allowed in the big square tomorrow. Gran said.'), GE('Gran said maybe.', 'think')],
      [
        ask(
          1,
          'literacy',
          'what “maybe” means',
          'ELOF: Language and Communication',
          [N('Gran said “maybe”. Does maybe mean yes?')],
          [
            opt(
              'No. Maybe means not sure yet',
              [GE('Right. Maybe means we will see.', 'happy')],
              true,
            ),
            opt('Yes, it means yes', [GE('Not quite. Maybe means not sure yet.')]),
          ],
          'Learned that “maybe” means not sure yet.',
        ),
      ],
    ),
    sc(
      'a12-03-complete',
      [
        N('That evening Gerda sits on her stool in the cold.'),
        GE('He’s still in there. Something is in front of him.', 'soft'),
        N('You sit down next to her on Kay’s stool.'),
        N('You wait with her. Waiting together is a kind of help.'),
      ],
      [
        doit(
          3,
          'sel',
          'calm and wait together',
          'CASEL: Self-management',
          'edu:breathe:slow:10',
          [N('(Sit beside a grown-up. Take ten slow breaths together.)')],
          'Practised sitting calmly beside someone and breathing slowly.',
        ),
      ],
    ),
  ],
);

// ================================================================== A12-4 The Big Sledge
const Q04: EduQuest = quest(
  'a12-04',
  'The Big Sledge',
  {
    'a12-04-s1': {
      goal: 'Follow Kay to the great square.',
      hint: 'Go to the square. Keep Kay in sight.',
    },
    'a12-04-s2': { goal: 'Run after the white sledge.', hint: 'Run! Keep going to the town gate.' },
    'a12-04-s3': {
      goal: 'Watch from the hill.',
      hint: 'Stay on the hill. You can’t reach them from here.',
    },
  },
  [
    sc(
      'a12-04-square',
      [
        N('Kay comes past with big gloves and his sledge on his back.'),
        KA('I’m going to the big square!'),
        GE('Go with him, please. Stay close to him.', 'sad'),
        N('The square is busy. Bold boys tie sledges to farmers’ carts.'),
        N('A great white sledge comes in. The driver wears white fur.'),
        N('The white driver watches only Kay.'),
      ],
      [
        ask(
          3,
          'health',
          'staying safe on sledges',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('The boys tie their sledges to moving carts. Is that safe?')],
          [
            opt(
              'No, it isn’t safe',
              [N('Right. A cart can pull you too fast. A little hill is much safer.')],
              true,
            ),
            opt('Yes, it’s safe', [
              N('A moving cart can pull you too fast. A little hill is safer.'),
            ]),
          ],
          'Talked about why it is not safe to hitch a sledge to a moving cart.',
        ),
      ],
      {
        choices: [
          {
            id: 'shout',
            label: 'Shout to Kay to stay put.',
            then: [
              KA('Mind your own business, lodger!', 'angry'),
              N('He doesn’t look round. He watches the white sledge.'),
            ],
          },
          {
            id: 'cord',
            label: 'Push through to get hold of his cord.',
            then: [N('There are too many boys. The square is suddenly very wide.')],
          },
          {
            id: 'nubbin',
            label: 'Pick up your Nubbin. It has gone very still.',
            then: [N('It stares at the white sledge. It feels cold, like at the window.')],
          },
        ],
      },
    ),
    sc(
      'a12-04-square-done',
      [N('Kay holds his cord. He ties a careful knot, tongue between his teeth.')],
      [
        ask(
          0,
          'science',
          'sledges slide on snow',
          'ELOF: Scientific Reasoning',
          [N('Which is better for sledging, snow or grass?')],
          [
            opt('Snow', [N('Yes! A sledge slides well on smooth snow.')], true),
            opt('Grass', [N('Grass is bumpy and stops a sledge. Smooth snow lets it slide.')]),
          ],
          'Learned that a sledge slides best on smooth snow.',
        ),
      ],
    ),
    sc(
      'a12-04-chase',
      [
        N('The white sledge circles again. Kay ties his sledge to it. Off he goes!'),
        N('Faster, into the next street. Faster!'),
        N('The driver nods to Kay kindly, as if they are old friends.'),
        N('You run. Your Nubbin runs ahead. You scoop it up and run faster.'),
        N('Out through the town gate. The snow comes down thick and white.'),
        KA('Stop! I want to get off!', 'shock'),
        N('You lose them. Then, from a hill, you see the sledge has stopped.'),
      ],
      [
        ask(
          3,
          'maths',
          'in front and behind',
          'K.G.A.1',
          [N('Your Nubbin runs ahead. Is it in front of you, or behind?')],
          [
            opt('In front of me', [N('Yes! It is in front of you.')], true),
            opt('Behind me', [
              N('Behind is at your back. Your Nubbin is in front, running ahead.'),
            ]),
          ],
          'Practised the position words in front and behind.',
        ),
      ],
    ),
    sc(
      'a12-04-chase-done',
      [
        N('The driver stands up. Under the snow is a tall lady, pale and sparkling.'),
        N('It is the lady from the window. It is the Snow Queen.'),
      ],
      [
        ask(
          1,
          'literacy',
          'who is in the story',
          'RL.K.3',
          [N('Who is driving the white sledge?')],
          [
            opt('The Snow Queen', [N('Yes. The lady from the window is the Snow Queen.')], true),
            opt('Grandmother', [
              N('Grandmother is at home. The driver is the lady from the window.'),
            ]),
          ],
          'Named a character from the story.',
        ),
      ],
    ),
    sc(
      'a12-04-kiss',
      [
        QU('We have come a long way. You are shivering.'),
        QU('Creep in under my fur.'),
        N('She wraps Kay in her white bearskin. He sinks in like a snowdrift.'),
        QU('Are you still cold?'),
        N('She touches his forehead. It is colder than ice.'),
        N('Now Kay does not feel cold at all.'),
        N('Gerda, Grandmother, the roses: Kay forgets them. But you do not.', 'sad'),
        N('The sledge rises over the forest. A big white moon comes out.'),
      ],
      [
        ask(
          6,
          'sel',
          'all feelings are allowed',
          'ELOF: Social and Emotional Development',
          [N('Kay feels nothing now. Is feeling nothing better than feeling sad?')],
          [
            opt(
              'No. Feelings come with loving people',
              [N('Yes. Feelings are part of being alive. Sad is allowed.', 'soft')],
              true,
            ),
            opt('Yes. Feeling nothing is better', [
              N('Feelings are allowed. A hug or a friend helps with the hard ones.', 'soft'),
            ]),
          ],
          'Talked about how all feelings, even sad ones, are okay.',
        ),
      ],
      {
        choices: [
          {
            id: 'call',
            label: 'Call his name, as loud as you can.',
            then: [N('The wind blows your voice back towards the town, to Gerda.')],
          },
          {
            id: 'watch',
            label: 'Stand and watch until they’re gone.',
            then: [N('You watch till the sledge is a speck, then a star, then nothing.')],
          },
        ],
      },
    ),
    sc(
      'a12-04-kiss-done',
      [N('You walk back in the dark. The town gate is still open.')],
      [
        note(
          0,
          'science',
          'the Moon in the night sky',
          '1-ESS1-1',
          [N('The Moon shines in the night sky. Its shape changes each month.')],
          'Heard that the Moon is seen at night and changes shape through the month.',
        ),
      ],
    ),
    sc(
      'a12-04-complete',
      [
        N('Gerda waits at the top of the stairs. You tell her everything.'),
        GE('Then he isn’t lost. He has been taken. That is different.', 'think'),
        N('People in the town say Kay fell in the river.'),
        GE('No. He hates water. He would never go near the river.'),
        N('Grandmother is sad all winter. Gerda is brave and quiet.'),
      ],
      [
        ask(
          3,
          'literacy',
          'how a character responds',
          'RL.2.3',
          [N('Everyone says Kay is gone. What does Gerda think?')],
          [
            opt(
              'He can still be found',
              [N('Yes. Gerda keeps hoping, and she will go and look.', 'soft')],
              true,
            ),
            opt('They are right', [
              N('Gerda does not agree. She believes Kay can still be found.'),
            ]),
          ],
          'Noticed how Gerda responds when others lose hope.',
        ),
      ],
    ),
  ],
);

// ================================================================== A12-5 The Red Shoes
const Q05: EduQuest = quest(
  'a12-05',
  'The Red Shoes',
  {
    'a12-05-s1': {
      goal: 'Sit with Gerda through the long winter.',
      hint: 'Find Gerda on her stool by the gutter.',
    },
    'a12-05-s2': {
      goal: 'Go down to the river with Gerda at dawn.',
      hint: 'Walk with Gerda to the boats in the rushes.',
    },
    'a12-05-s3': { goal: 'Jump into the boat after Gerda.', hint: 'Run along the bank and jump!' },
  },
  [
    sc(
      'a12-05-winter',
      [
        N('It is a long, dark winter. People stop saying Kay’s name.'),
        N('Only Gerda says it.'),
        N('Then spring comes. The sun is warm on the gutter again.'),
        GE('Some people say Kay has died.', 'sad'),
        N('Died means a body stops working, and does not start again.'),
        GE('But I think Kay is alive. I think he is just far away.', 'soft'),
        N('The sunshine does not believe it. Neither do the swallows.'),
        GE('I don’t believe it either.', 'soft'),
      ],
      [
        ask(
          7,
          'science',
          'signs of spring',
          'K-ESS2-1',
          [N('The swallows are back. What else says it is spring?')],
          [
            opt(
              'Warm sun and new flowers',
              [N('Yes! Warm sun and new flowers are signs of spring.', 'happy')],
              true,
            ),
            opt('Snow and ice', [
              N('Snow and ice come in winter. Spring has warm sun and flowers.'),
            ]),
          ],
          'Named signs of spring: warm sun, flowers and returning birds.',
        ),
      ],
      {
        choices: [
          {
            id: 'agree',
            label: '“Nor do I.”',
            then: [Y('Nor do I.'), GE('Good. That makes three of us, and the swallows.')],
          },
          {
            id: 'north',
            label: 'Remind her: the sledge went north.',
            then: [GE('North. Then I will go north. I’ll ask the river first.', 'think')],
          },
          {
            id: 'sit',
            label: 'Sit with her and say nothing.',
            then: [N('You sit a long time. A swallow lands and looks at you both.')],
          },
        ],
      },
    ),
    sc(
      'a12-05-winter-done',
      [
        GE('I’m going to give the river my two red shoes.'),
        GE('Kay never saw them. They are my best thing.'),
      ],
      [
        ask(
          1,
          'maths',
          'a pair is two',
          'K.CC.B.4',
          [N('Gerda has a pair of red shoes. How many shoes make a pair?')],
          [
            opt('Two', [N('Yes! A pair is two. One for each foot.', 'happy')], true),
            opt('Three', [N('Count her feet: one, two. A pair of shoes is two.')]),
          ],
          'Counted the two shoes in a pair.',
        ),
      ],
    ),
    sc(
      'a12-05-river',
      [
        N('At dawn Gerda puts on her new red shoes.'),
        N('She kisses sleeping Grandmother and goes out.'),
        N('You go with her to the river. Your Nubbin is under your arm.'),
        GE('River, did you take my friend? I’ll give you my red shoes.'),
        N('The little waves nod. She throws the shoes in.'),
        N('Splash! The waves bring them straight back.'),
        GE('I didn’t throw them far enough.'),
        N('There is a boat in the rushes. She climbs in.'),
      ],
      [
        ask(
          7,
          'health',
          'water safety',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('Who should be with a child near deep water?')],
          [
            opt('A grown-up', [N('Yes. A grown-up keeps children safe near water.')], true),
            opt('Nobody', [N('Always have a grown-up near deep water. It keeps you safe.')]),
          ],
          'Learned to stay with a grown-up near deep water.',
        ),
      ],
      {
        choices: [
          {
            id: 'wait',
            label: 'Stay on the bank. It’s her gift to give.',
            then: [N('You stay on the bank. It is hers to give.')],
          },
          {
            id: 'warn',
            label: 'Tell her to be careful.',
            then: [GE('I am being careful. Careful and quick.', 'think')],
          },
        ],
      },
    ),
    sc(
      'a12-05-river-done',
      [
        N('She throws the shoes from the end of the boat.'),
        N('The boat isn’t tied. It slides out of the rushes.'),
        GE('Oh!', 'shock'),
      ],
      [
        note(
          2,
          'science',
          'rivers flow downhill to the sea',
          'ELOF: Scientific Reasoning',
          [N('Rivers flow downhill. They carry things along, all the way to the sea.')],
          'Heard that rivers flow downhill towards the sea.',
        ),
      ],
    ),
    sc(
      'a12-05-boat',
      [
        N('The boat is already a step from the bank, and gliding.'),
        N('Your Nubbin jumps first. You jump after it.'),
        N('Thump! You land in the bottom of the boat.'),
        GE('You came. You didn’t have to.', 'soft'),
        N('The red shoes float behind. They can’t catch up.'),
      ],
      [
        ask(
          3,
          'sel',
          'being a loyal friend',
          'CASEL: Relationship skills',
          [N('Gerda is glad you came. What does a good friend do?')],
          [
            opt(
              'Helps, and stays close',
              [GE('Yes. A good friend helps and stays close.', 'soft')],
              true,
            ),
            opt('Goes away when it’s hard', [
              GE('A good friend stays and helps, even when it is hard.'),
            ]),
          ],
          'Talked about what a good friend does when things are hard.',
        ),
      ],
      {
        choices: [
          {
            id: 'oar',
            label: 'Look for an oar.',
            then: [N('No oar. Only a can, some rope and an apple. Your Nubbin eats it.')],
          },
          {
            id: 'shoes',
            label: 'Reach for the red shoes.',
            then: [
              N('You stretch over the side. Your fingers brush one shoe. The river takes it.'),
            ],
          },
          {
            id: 'sit',
            label: 'Sit back and let the boat take you.',
            then: [N('You sit back. Gerda sits beside you in her stockings.')],
          },
        ],
      },
    ),
    sc(
      'a12-05-boat-done',
      [
        N('The banks are lovely: flowers and old trees.'),
        N('Three sheep and two cows graze on the slopes.'),
        N('There isn’t a single person anywhere.'),
      ],
      [
        ask(
          1,
          'maths',
          'add within 10',
          'K.OA.A.2',
          [N('Three sheep and two cows. How many animals altogether?')],
          [
            opt('Five', [N('Yes! Three and two make five.', 'happy')], true),
            opt('Four', [N('Count them: one, two, three sheep, then four, five cows. Five!')]),
          ],
          'Added three and two to make five.',
        ),
      ],
    ),
    sc(
      'a12-05-complete',
      [
        N('All day the boat goes downstream. Gerda sings. Your Nubbin hums.'),
        N('You come to a cherry orchard and a house with red and blue windows.'),
        N('Two wooden soldiers stand outside, as still as statues.'),
        GE('Hello! Can you help us?'),
        N('The soldiers can’t answer, being wooden. But somebody else does.'),
      ],
      [
        doit(
          1,
          'art',
          'name the colours',
          'ELOF: Language and Communication',
          'edu:point:colours:red-blue',
          [N('(Point to something red. Now point to something blue.)')],
          'Named and pointed to red and blue.',
        ),
      ],
    ),
  ],
);

// ================================================================== A12-6 The Garden That Forgets
const Q06: EduQuest = quest(
  'a12-06',
  'The Garden That Forgets',
  {
    'a12-06-s1': {
      goal: 'Meet the old woman of the cherry house.',
      hint: 'Let her pull the boat in. Go inside.',
    },
    'a12-06-s2': {
      goal: 'Spend the summer in the garden.',
      hint: 'Explore the flower beds. Follow your Nubbin.',
    },
    'a12-06-s3': {
      goal: 'Ask the flowers about Kay.',
      hint: 'Talk to the roses, then the other flowers.',
    },
  },
  [
    sc(
      'a12-06-cherries',
      [
        N('An old woman comes out. She wears a big hat with painted flowers.'),
        OW('You poor little thing. How did you get on this wide river?', 'soft'),
        N('She pulls the boat in with her stick. She is strong.'),
        N('She gives you cherries, as many as you like.'),
        OW('Kay? He hasn’t come by. Don’t be sad. Eat your cherries.'),
        N('She combs Gerda’s hair with a golden comb. Gerda grows sleepy.'),
        N('She isn’t wicked. She just always wanted a little girl.'),
      ],
      [
        ask(
          3,
          'maths',
          'take away within 10',
          'K.OA.A.2',
          [N('You have three cherries. Your Nubbin eats one. How many are left?')],
          [
            opt('Two', [N('Yes! Three, take away one, leaves two.', 'happy')], true),
            opt('Three', [N('Your Nubbin ate one! Three take away one leaves two.')]),
          ],
          'Took one away from three to make two.',
        ),
      ],
      {
        choices: [
          {
            id: 'eat',
            label: 'Have another cherry.',
            then: [N('It is the best cherry ever. You forget the second best.')],
          },
          {
            id: 'ask',
            label: 'Ask her the way north.',
            then: [
              OW('North? Nobody goes north. Have a cherry.', 'happy'),
              N('You forget your question halfway through the cherry.'),
            ],
          },
          {
            id: 'nubbin',
            label: 'Give a cherry to your Nubbin.',
            then: [N('Your Nubbin tucks it in your pocket. One eye stays on the comb.')],
          },
        ],
      },
    ),
    sc(
      'a12-06-cherries-done',
      [
        N('While you doze, the old woman goes into the garden.'),
        N('She points her stick at the rose bushes. They sink into the ground.'),
      ],
      [
        note(
          1,
          'science',
          'roots live under the ground',
          'K-LS1-1',
          [N('Plants have roots under the ground. Roots drink water for the plant.')],
          'Heard that plants have roots that drink water under the ground.',
        ),
      ],
    ),
    sc(
      'a12-06-garden',
      [
        N('The garden has every flower, from every season, all at once.'),
        N('Gerda plays here all day. She has stopped asking about Kay.'),
        N('You can’t remember what day it is.'),
        N('Your Nubbin keeps digging at one bare patch by the wall.'),
        N('One day the old woman’s painted hat lies on the bench.'),
        N('Gerda sees a rose painted on the hat.'),
        GE('Roses! Where are the roses? There are none here!', 'shock'),
      ],
      [
        note(
          0,
          'science',
          'flowers bloom in different seasons',
          '',
          [N('In a real garden, snowdrops come in late winter. Roses come in summer.')],
          'Heard that different flowers bloom in different seasons.',
        ),
      ],
      {
        choices: [
          {
            id: 'patch',
            label: 'Show her where your Nubbin has dug.',
            then: [N('You show her the bare patch. Your Nubbin sits tall beside it.')],
          },
          {
            id: 'search',
            label: 'Search with her.',
            then: [N('You search bed by bed. Your Nubbin sits on a bare patch.')],
          },
        ],
      },
    ),
    sc(
      'a12-06-garden-done',
      [
        N('Gerda sits by the bare patch and cries. Her tears fall on the earth.'),
        N('A rose bush comes up, in full flower!'),
      ],
      [
        ask(
          1,
          'science',
          'plants drink water',
          'K-LS1-1',
          [N('Gerda’s tears fall on the earth. What do plants drink?')],
          [
            opt('Water', [N('Yes! Plants drink water through their roots.', 'happy')], true),
            opt('Milk', [N('Plants drink water. Milk is for people, not plants!')]),
          ],
          'Learned that plants take in water through their roots.',
        ),
      ],
    ),
    sc(
      'a12-06-flowers',
      [
        GE('I’ve been so long! Do you know where Kay is?'),
        RO('He isn’t here. We were underground, and he wasn’t there.', 'soft'),
        GE('Thank you!', 'happy'),
        N('Gerda asks the other flowers, one by one.'),
        N('Each flower is dreaming its own story. None is about Kay.'),
        BW('There is a castle, and a girl on the balcony. That is my story.'),
        GE('Is it about Kay?'),
        BW('It’s my story. It is not about anybody else.'),
      ],
      [
        ask(
          6,
          'literacy',
          'who a story is about',
          'RL.K.3',
          [N('Is the bindweed’s story about Kay?')],
          [
            opt(
              'No. It is about a castle and a girl',
              [N('Yes. Every flower has its own story.')],
              true,
            ),
            opt('Yes, it is about Kay', [
              N('Listen again: a castle and a girl on a balcony. Not Kay.'),
            ]),
          ],
          'Said who and what a story was about.',
        ),
      ],
      {
        choices: [
          {
            id: 'snowdrop',
            label: 'Ask the snowdrop.',
            then: [
              SD('Two girls on a swing blow bubbles. Each bubble is a world. Pop!'),
              GE('A lovely story. But no help.'),
            ],
          },
          {
            id: 'buttercup',
            label: 'Ask the buttercup.',
            then: [
              BC('A granny in a sunny yard. Her granddaughter comes home. That’s enough.', 'soft'),
              GE('Poor Gran. She is at home without us.', 'sad'),
            ],
          },
          {
            id: 'narcissus',
            label: 'Ask the narcissus.',
            then: [
              NA('I can see myself! How lovely I smell!', 'happy'),
              GE('That isn’t about Kay. That isn’t about anyone.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-06-flowers-done',
      [
        GE('It’s no good. They only know their own stories.'),
        GE('I have to go. I’ve stayed too long.'),
      ],
      [
        ask(
          1,
          'sel',
          'keeping a promise to a friend',
          'CASEL: Responsible decision-making',
          [N('Gerda remembers her friend. What does she do next?')],
          [
            opt(
              'Keeps looking for Kay',
              [N('Yes. She does not give up on her friend.', 'soft')],
              true,
            ),
            opt('Stays in the garden', [
              N('She could stay, but she wants to find Kay. So she goes.'),
            ]),
          ],
          'Talked about not giving up on a friend.',
        ),
      ],
    ),
    sc(
      'a12-06-complete',
      [
        N('Gerda runs to the gate. It is rusty and stuck.'),
        N('You push with her. Your Nubbin pushes too. Creeeak!'),
        N('Outside, it is late autumn. Yellow leaves fall.'),
        GE('How long was I there? It was always summer.', 'sad'),
        N('Gerda’s feet are bare and sore. She keeps walking.'),
        N('You walk with her.'),
      ],
      [
        doit(
          2,
          'maths',
          'count to three',
          'K.CC.A.1',
          'edu:count:leaves:3',
          [N('(Count the yellow leaves as they fall: one, two, three!)')],
          'Counted three falling leaves.',
        ),
      ],
    ),
  ],
);

// ================================================================== A12-7 The Raven
const Q07: EduQuest = quest(
  'a12-07',
  'The Raven',
  {
    'a12-07-s1': {
      goal: 'Meet the raven in the snow.',
      hint: 'Rest by the hedge where the big bird hops.',
    },
    'a12-07-s2': {
      goal: 'Hear about the boy with the creaky boots.',
      hint: 'Sit by the hedge. Let the raven tell it.',
    },
    'a12-07-s3': {
      goal: 'Wait by the palace garden after dark.',
      hint: 'Wait in the avenue until the lights go out.',
    },
  },
  [
    sc(
      'a12-07-hedge',
      [
        N('Winter comes fast. A big black raven hops over the snow.'),
        RA('Caw! Good day! Where are you going, all alone?'),
        N('Gerda tells him everything. Has he seen Kay?'),
        RA('It might be Kay. It might be!', 'think'),
        RA('There is a clever princess in this land.', 'happy'),
        RA('She has read every newspaper in the world.'),
        RA('And forgotten them all again. That is how clever she is.'),
      ],
      [
        ask(
          1,
          'science',
          'parts of a bird',
          'ELOF: Scientific Reasoning',
          [N('What does a raven fly with?')],
          [
            opt('Wings', [N('Yes! A raven has wings and feathers to fly.', 'happy')], true),
            opt('Paws', [N('Paws are for cats. A raven flies with wings.')]),
          ],
          'Named wings as the part a bird flies with.',
        ),
      ],
      {
        choices: [
          {
            id: 'polite',
            label: 'Ask him, politely, to go on.',
            then: [RA('Politely! A rare thing. I will go on at once.', 'happy')],
          },
          {
            id: 'how',
            label: 'Ask how a raven knows all this.',
            then: [
              RA('My sweetheart at the palace is tame. She tells me everything. I tell everybody.'),
            ],
          },
          {
            id: 'nubbin',
            label: 'Let your Nubbin say hello.',
            then: [N('Your Nubbin bows. The raven bows lower, so as not to be outdone.')],
          },
        ],
      },
    ),
    sc(
      'a12-07-hedge-done',
      [RA('She wanted a husband who could answer, not just look grand.')],
      [
        ask(
          0,
          'literacy',
          'what a character wants',
          'RL.K.3',
          [N('What does the princess want? Someone who can…')],
          [
            opt('Talk back', [RA('Yes! She wants someone who can really talk to her.')], true),
            opt('Stand very still', [
              RA('No, no. Standing still is the boring part. She wants someone who can talk.'),
            ]),
          ],
          'Said what a story character wants.',
        ),
      ],
    ),
    sc(
      'a12-07-boots',
      [
        RA('The papers said: any young man may come and talk to her.'),
        RA('Crowds came! But at the silver guards, they went quiet.'),
        RA('On the third day came a little fellow, marching up.'),
        RA('His eyes shone like yours. His clothes were shabby.'),
        GE('That was Kay! I’ve found him!', 'happy'),
        RA('His boots creaked all over the hall. He was not afraid.'),
        RA('He came to hear how clever she was. They liked each other.'),
      ],
      [
        ask(
          5,
          'literacy',
          'rhyming words',
          'RF.K.2',
          [N('Which word rhymes with creak? Squeak, or boat?')],
          [
            opt('Squeak', [RA('Yes! Creak and squeak rhyme.', 'happy')], true),
            opt('Boat', [RA('Say them: creak, squeak. They end the same. Boat does not.')]),
          ],
          'Found a word that rhymes with creak.',
        ),
      ],
      {
        choices: [
          {
            id: 'believe',
            label: 'It must be Kay.',
            then: [GE('It must be. Kay was always clever. He could do sums in his head.', 'happy')],
          },
          {
            id: 'doubt',
            label: 'Plenty of boys have creaky boots.',
            then: [
              GE('Not like Kay’s.'),
              RA('She has a point. I never met a pair that creaked like that.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-07-boots-done',
      [
        GE('Please, can you get us in? I have to see him.'),
        RA('I’ll speak to my sweetheart. Wait here.'),
      ],
      [
        ask(
          1,
          'sel',
          'waiting patiently',
          'CASEL: Self-management',
          [N('The raven says “wait here”. What can you do while you wait?')],
          [
            opt('Wait calmly', [N('Yes. Waiting calmly helps the plan work.')], true),
            opt('Run in anyway', [N('Running in could spoil the plan. Waiting calmly is better.')]),
          ],
          'Talked about waiting calmly when asked.',
        ),
      ],
    ),
    sc(
      'a12-07-avenue',
      [
        N('At dusk the raven brings a bread roll from the palace kitchen.'),
        RA('My sweetheart sends her regards. Not the front door: guards!'),
        RA('But there is a back staircase. She knows where the key is.'),
        N('You walk the great avenue. Leaves fall, one at a time.'),
        N('Four palace windows glow. Then one goes dark.'),
        N('The raven leads you to a back door, just ajar.'),
        N('Gerda’s heart goes thump, thump. So does yours.'),
      ],
      [
        ask(
          4,
          'maths',
          'take away within 10',
          'K.OA.A.2',
          [N('Four windows glow. One goes dark. How many still glow?')],
          [
            opt('Three', [N('Yes! Four take away one leaves three.', 'happy')], true),
            opt('Four', [N('One went dark. Four take away one leaves three.')]),
          ],
          'Took one away from four to make three.',
        ),
      ],
      {
        choices: [
          {
            id: 'first',
            label: 'Go in first.',
            then: [N('You go in first. The back stairs smell of soap and toast.')],
          },
          {
            id: 'hand',
            label: 'Take Gerda’s hand.',
            then: [N('Her hand is shaking. Then it isn’t.')],
          },
        ],
      },
    ),
    sc(
      'a12-07-avenue-done',
      [
        N('At the top, a little lamp burns on a cupboard.'),
        N('The tame raven turns her head this way and that.'),
        PR('My intended has told me so much about you, little miss.', 'happy'),
      ],
      [
        note(
          1,
          'science',
          'a lamp gives light to see by',
          '1-PS4-2',
          [N('A lamp gives light, so we can see in the dark.')],
          'Heard that we need light to see in the dark.',
        ),
      ],
    ),
    sc(
      'a12-07-complete',
      [
        PR('Your story is touching. Take the lamp, and I will lead the way.'),
        N('Shadows rush past on the walls: horses with flying manes.'),
        PR('Only dreams. They come to fetch thoughts out hunting.'),
        N('Your Nubbin ducks under a dream horse, just in case.'),
      ],
      [
        note(
          1,
          'sel',
          'telling someone when you feel scared',
          'ELOF: Social and Emotional Development',
          [
            N(
              'Shadows can look big and scary. Everyone feels scared sometimes. Tell someone you trust.',
            ),
          ],
          'Heard that feeling scared is normal, and that telling someone helps.',
        ),
      ],
    ),
  ],
);

// ================================================================== A12-8 Not Kay
const Q08: EduQuest = quest(
  'a12-08',
  'Not Kay',
  {
    'a12-08-s1': {
      goal: 'Climb the back stairs through the palace.',
      hint: 'Follow the tame raven. Keep the lamp low.',
    },
    'a12-08-s2': { goal: 'Wait while Gerda looks in the red bed.', hint: 'Keep the light steady.' },
    'a12-08-s3': {
      goal: 'See what the prince and princess give Gerda.',
      hint: 'In the morning, help Gerda ask for what she needs.',
    },
  },
  [
    sc(
      'a12-08-halls',
      [
        N('You go from hall to hall. The walls are rose-coloured satin.'),
        N('Dreams rush past, too fast to see whose they are.'),
        PR('Wipe your feet. Not you, the little one. Well, all of you.'),
        N('Then the bedroom. The ceiling is a glass palm tree.'),
        N('Two beds hang from it, each like a lily.'),
        N('One is white, with the princess asleep. One is red.'),
        GE('Kay will be in the red one.', 'soft'),
      ],
      [
        ask(
          4,
          'maths',
          'count how many',
          'K.CC.B.5',
          [N('How many beds hang from the palm tree?')],
          [
            opt('Two', [N('Yes! One white bed and one red bed make two.', 'happy')], true),
            opt('Five', [N('Count them: one white, two red. Just two beds.')]),
          ],
          'Counted two beds.',
        ),
      ],
      {
        choices: [
          {
            id: 'lamp',
            label: 'Hold the lamp up for her.',
            then: [N('You hold the lamp up. It shakes a little. You make it stop.')],
          },
          {
            id: 'door',
            label: 'Stay back by the door with the raven.',
            then: [N('You stay by the door, because this bit is Gerda’s.')],
          },
        ],
      },
    ),
    sc(
      'a12-08-halls-done',
      [N('Gerda tiptoes to the red bed.')],
      [
        ask(
          0,
          'sel',
          'thinking of others',
          'CASEL: Social awareness',
          [N('Why does Gerda tiptoe at night?')],
          [
            opt(
              'So she doesn’t wake anyone',
              [N('Yes. Being quiet is kind to people who are sleeping.', 'soft')],
              true,
            ),
            opt('To be loud', [N('Tiptoeing is quiet. It lets sleepers sleep.')]),
          ],
          'Talked about being quiet so others can sleep.',
        ),
      ],
    ),
    sc(
      'a12-08-redbed',
      [
        N('Gerda bends back a red petal. A brown neck. Dark hair.'),
        GE('Kay!', 'happy'),
        N('He wakes. He turns his head.'),
        N('It isn’t Kay.'),
        N('The prince has a neck like Kay’s, and that is all.'),
        N('The princess peeps out of her white lily. What is going on?'),
        N('Gerda cries. She tells them the whole story.', 'sad'),
      ],
      [
        ask(
          6,
          'sel',
          'naming a feeling: disappointed',
          'CASEL: Self-awareness',
          [N('Gerda hoped it was Kay, but it was not. How does she feel?')],
          [
            opt(
              'Disappointed and sad',
              [N('Yes. That is called disappointed. It is okay to cry.', 'soft')],
              true,
            ),
            opt('Very excited', [
              N('She was excited, then it was not Kay. Now she feels disappointed.'),
            ]),
          ],
          'Named the feeling of disappointment.',
        ),
      ],
      {
        choices: [
          {
            id: 'fault',
            label: 'Say it’s all your fault, really.',
            then: [PS('Is it? It sounds like the ravens’ fault. A very nice fault.')],
          },
          {
            id: 'ravens',
            label: 'Put in a word for the ravens.',
            then: [N('You say the ravens meant well. The tame raven puffs up with pride.')],
          },
          {
            id: 'quiet',
            label: 'Hold the lamp. Let Gerda tell it.',
            then: [N('You hold the lamp. Gerda tells it well, right from the troll’s mirror.')],
          },
        ],
      },
    ),
    sc(
      'a12-08-redbed-done',
      [
        PN('You poor child.', 'soft'),
        PS('Nobody is angry. Though the ravens mustn’t make a habit of it.'),
      ],
      [
        note(
          1,
          'sel',
          'forgiving an honest mistake',
          'CASEL: Relationship skills',
          [N('Kind people forgive honest mistakes. Saying sorry and being forgiven feels good.')],
          'Heard that kind people forgive honest mistakes.',
        ),
      ],
    ),
    sc(
      'a12-08-gifts',
      [
        PS('Ravens, would you like to fly free? Or have a post at court?'),
        N('Both ravens bow. They ask for the post. They think ahead.'),
        N('The prince lets Gerda sleep in his bed.'),
        N('In the morning she wears silk and velvet.'),
        GE('Thank you. I need a carriage, a horse and boots, to find Kay.'),
        PN('Boots, and a muff for the cold. And a proper carriage.'),
      ],
      [
        ask(
          5,
          'science',
          'warm and cold materials',
          'ELOF: Scientific Reasoning',
          [N('Which keeps your hands warm: a fur muff, or an ice cube?')],
          [
            opt('A fur muff', [N('Yes! Fur traps warm air round your hands.', 'happy')], true),
            opt('An ice cube', [N('An ice cube is cold! A fur muff keeps hands warm.')]),
          ],
          'Chose a warm material to keep hands warm.',
        ),
      ],
      {
        choices: [
          {
            id: 'muff',
            label: 'Put your Nubbin in the muff.',
            then: [
              N('Your Nubbin climbs into the muff and turns round twice.'),
              GE('Oh, it’s warm! It’s like a little stove.', 'happy'),
            ],
          },
          {
            id: 'boots',
            label: 'Check that the boots fit.',
            then: [
              N('You press the toes: room for socks. Meanwhile your Nubbin climbs into the muff.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-08-gifts-done',
      [N('The coach is pure gold. A golden star shines on the door.')],
      [
        ask(
          0,
          'maths',
          'name shapes',
          'K.G.A.2',
          [N('What shape is a coach wheel?')],
          [
            opt('A circle', [N('Yes! A wheel is a circle. Circles roll.', 'happy')], true),
            opt('A square', [N('A square has corners and would bump. A wheel is a circle.')]),
          ],
          'Named a circle as the shape of a wheel.',
        ),
      ],
    ),
    sc(
      'a12-08-complete',
      [
        N('The coach is lined with sugar plums. There is fruit and gingerbread.'),
        N('Footmen ride behind in golden crowns.'),
        N('The raven rides along for a few miles. He sits beside Gerda.'),
        N('His sweetheart waves from the door. Her head aches from too much food.'),
        GE('Goodbye! Goodbye!', 'happy'),
        N('Gerda keeps her hands in the muff. Your Nubbin keeps them warm.'),
      ],
      [
        note(
          3,
          'health',
          'a mix of foods is best',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('Too many sweets give you a tummy ache. A mix of foods is best.')],
          'Heard that a mix of foods is better than too many sweets.',
        ),
      ],
    ),
  ],
);

// ================================================================== A12-9 The Robber Girl
const Q09: EduQuest = quest(
  'a12-09',
  'The Robber Girl',
  {
    'a12-09-s1': {
      goal: 'Ride the golden coach through the dark forest.',
      hint: 'Keep your head down when the coach stops.',
    },
    'a12-09-s2': {
      goal: 'Go into the robbers’ castle.',
      hint: 'Follow the robber girl in, past the dogs.',
    },
    'a12-09-s3': {
      goal: 'Answer the robber girl. She wants your Nubbin.',
      hint: 'Choose what to say. Either answer is kind and honest.',
    },
  },
  [
    sc(
      'a12-09-forest',
      [
        N('The road goes into a dark forest. The golden coach shines like a torch.'),
        N('Robbers jump out, shouting, “Gold!”'),
        N('The coachman and footmen run off and hide. Nobody is hurt.'),
        N('A girl pushes the old robber woman aside.'),
        RG('She’s mine. She can play with me and sleep in my bed.'),
        N('The robber girl is Gerda’s size, with black eyes that look almost sad.'),
        N('Gerda tells her everything. The robber girl puts her hands in the muff.'),
        RG('What’s this? It’s warm. It’s alive!', 'shock'),
      ],
      [
        ask(
          4,
          'sel',
          'people are not possessions',
          'CASEL: Social awareness',
          [N('The robber girl says, “She’s mine!” Can a person belong to someone else?')],
          [
            opt(
              'No. People belong to themselves',
              [N('Yes. Friends choose each other. Nobody owns a friend.', 'soft')],
              true,
            ),
            opt('Yes, if you want them', [
              N('Wanting someone is not owning them. A friend is free to choose.'),
            ]),
          ],
          'Talked about why a person cannot be owned, and a friend is chosen.',
        ),
      ],
      {
        choices: [
          {
            id: 'tell',
            label: 'Tell her it’s your Nubbin.',
            then: [RG('A Nubbin. Never heard of one. I like it.')],
          },
          {
            id: 'gerda',
            label: 'Let Gerda explain.',
            then: [GE('It’s the lodger’s. It kept my hands warm.'), RG('Has it, now.', 'think')],
          },
        ],
      },
    ),
    sc(
      'a12-09-forest-done',
      [N('The robber girl keeps one hand in the muff the whole way.')],
      [
        note(
          0,
          'science',
          'living bodies make heat',
          '',
          [N('Your Nubbin is warm because living bodies make their own heat.')],
          'Heard that living bodies make their own warmth.',
        ),
      ],
    ),
    sc(
      'a12-09-castle',
      [
        N('The coach stops in a cracked old castle yard. Crows fly out.'),
        N('Big dogs leap up. They don’t bark.'),
        N('In the hall, soup bubbles in a big pot on a fire.'),
        RG('You’ll sleep with me and my animals.'),
        N('In her corner, about a hundred pigeons sleep on perches.'),
        RG('Those wood pigeons would fly off if not tied. And here’s old Bae.'),
        N('A reindeer is tied to the wall by a copper ring.'),
        N('She has a long knife, kept in a crack in the wall.'),
      ],
      [
        ask(
          7,
          'health',
          'sharp things are for grown-ups',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('The robber girl has a sharp knife. Who should use a sharp knife?')],
          [
            opt(
              'A grown-up',
              [N('Yes. Sharp knives are for grown-ups. Children ask for help.')],
              true,
            ),
            opt('Any child', [N('Sharp knives can hurt. Ask a grown-up to help you.')]),
          ],
          'Learned that sharp knives are for grown-ups to use.',
        ),
      ],
      {
        choices: [
          {
            id: 'away',
            label: 'Ask her to put the knife away.',
            then: [RG('No.'), N('But she puts it in the wall, close by. A kind of yes.')],
          },
          {
            id: 'bae',
            label: 'Stroke Bae’s nose.',
            then: [N('Bae lowers his head. His nose is soft. His eyes are tired.')],
          },
        ],
      },
    ),
    sc(
      'a12-09-castle-done',
      [RG('Tell me about Kay again. The warm thing stays where I can see it.')],
      [
        doit(
          0,
          'maths',
          'count to a hundred by tens',
          'K.CC.A.1',
          'edu:count:tens:100',
          [N('(Count the pigeons in tens: ten, twenty, thirty, all the way to a hundred.)')],
          'Counted to one hundred by tens.',
        ),
      ],
    ),
    sc(
      'a12-09-keep',
      [
        N('She holds out both hands, the way she did to the muff.'),
        RG('I want that one. It’s warm. It’s mine now.'),
        GE('It isn’t yours. It isn’t mine either.', 'think'),
        RG('I didn’t ask you.'),
        N('Your Nubbin looks at you. It waits to see what you will do.'),
        N('The robber girl’s hands are chapped. There is a scar on one knuckle.'),
      ],
      [
        ask(
          3,
          'sel',
          'asking, and saying no kindly',
          'CASEL: Responsible decision-making',
          [N('Who gets to decide what happens to your Nubbin?')],
          [
            opt(
              'You and your Nubbin',
              [N('Yes. You decide together. And you can say no kindly.', 'soft')],
              true,
            ),
            opt('The robber girl', [N('She can ask. But you and your Nubbin decide.')]),
          ],
          'Practised the idea that you can say no kindly, and that asking is not the same as taking.',
        ),
      ],
      {
        choices: [
          {
            id: 'no',
            label: '“No.” Plainly and kindly.',
            set: { 'a12-nubbin': 'no' },
            then: [
              Y('No.'),
              RG('No?', 'angry'),
              Y('No. A Nubbin is not a thing to keep. It stays with me.'),
              N('She stares. Then she shrugs, as if she meant to lose.'),
              RG('Fine. Keep your warm thing.', 'angry'),
            ],
          },
          {
            id: 'night',
            label: '“You can hold it for one night.”',
            set: { 'a12-nubbin': 'night' },
            then: [
              Y('You can hold it tonight. In the morning it comes back to me.'),
              RG('One night?', 'think'),
              N('She holds your Nubbin in both hands, very carefully.'),
              RG('One night. Fine.'),
              N('Your Nubbin snuggles on her shoulder and falls asleep.', 'soft'),
              N('She looks as if nobody has ever done that before.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-09-keep-done',
      [
        N('The robber girl falls asleep with an arm round Gerda, and snores.'),
        N('Gerda lies awake and stares at the pigeons. You stare at Gerda.'),
      ],
      [
        note(
          1,
          'sel',
          'lonely people want friends',
          'ELOF: Social and Emotional Development',
          [N('Some people are lonely. They can act grumpy, but they just want a friend.')],
          'Heard that grumpy behaviour can hide loneliness.',
        ),
      ],
    ),
    sc(
      'a12-09-complete',
      [
        N('By the fire the robbers sing. The old robber woman does a somersault.'),
        N('Bae stands in the dark with his copper ring on, looking at the door.'),
        N('The pigeons shuffle and murmur on their perches.'),
        N('Only the robber girl sleeps. She sleeps like someone who has won.'),
      ],
      [
        ask(
          2,
          'literacy',
          'animal sounds',
          'ELOF: Language and Communication',
          [N('The pigeons murmur. What sound does a pigeon make?')],
          [
            opt('Coo, coo', [N('Yes! Coo, coo, coo.', 'happy')], true),
            opt('Moo, moo', [N('Moo is a cow! A pigeon says coo.')]),
          ],
          'Matched an animal to its sound.',
        ),
      ],
    ),
  ],
);

// ---------------------------------------------------------------- shared pieces (as in the source)
/** A12-10, step 3: the robber girl unties Bae (both a12-nubbin paths). */
const FREE: Line[] = [
  RG('Bae, I’m untying you. Carry this girl to the Snow Queen’s.'),
  N('Bae leaps for joy. The robber girl lifts Gerda onto his back.'),
  RG('Here are your boots. I’m keeping the muff. It’s too pretty.'),
  RG('Take Mother’s big mittens. They reach your elbows.'),
  RG('Two loaves for the road. And don’t cry. Look happy!'),
  BA('Climb on behind her, lodger. You weigh less than a sack of salt.'),
  RG('Run! And look after her!'),
];
const FREE_CHOICES: Choice[] = [
  {
    id: 'wave',
    label: 'Wave goodbye to the robber girl.',
    then: [N('You wave. She doesn’t wave back, but she watches until you are gone.')],
  },
  {
    id: 'nod',
    label: 'Nod to her, as one equal to another.',
    then: [N('You nod. She nods back, once, hard, like shutting a box.')],
  },
];
/** A12-13, step 2: how you wait (base and both ember variants). */
const WAIT_CHOICES: Choice[] = [
  {
    id: 'count',
    label: 'Count the berries again.',
    then: [N('So many berries! Your Nubbin points at one you missed.')],
  },
  {
    id: 'hum',
    label: 'Hum Gerda’s rose tune, under your breath.',
    then: [N('You hum quietly. Your Nubbin hums it back, a beat behind.')],
  },
  {
    id: 'sit',
    label: 'Just sit.',
    then: [N('You just sit. It turns out you are good at it.')],
  },
];
/** A12-17, step 3: the robber girl's news (both a12-nubbin paths). */
const NEWS: Line[] = [
  RG('So this is Kay. Was he worth running to the world’s end?', 'think'),
  GE('How are the prince and princess? And the ravens?'),
  RG('The prince and princess went abroad. The old raven died.'),
  N('The raven’s body stopped working. He was very old.', 'soft'),
  RG('His sweetheart wears a black thread on her leg, to remember him.'),
];
const NEWS_CHOICES: Choice[] = [
  {
    id: 'sorry',
    label: 'Say you’re sorry about the raven.',
    then: [RG('Don’t be. He had a good job and all the scraps he wanted.', 'soft')],
  },
  {
    id: 'cap',
    label: 'Admire her red cap.',
    then: [RG('It’s a good cap. You can’t have it.', 'happy')],
  },
];
/** A12-18: the close of the complete scene (both a12-nubbin paths). */
const END: Line[] = [
  N('The page settles under your hand, like paper laid flat.'),
  N('You are back in the Grove with Nova’s atlas. A rose petal lies inside.'),
  N('On the cottage windowsill stands a window box with a rose tree.'),
  N('Another stands on the lantern shed across the way. Between them is a plank.'),
];

// ================================================================== A12-10 The Reindeer
const Q10: EduQuest = quest(
  'a12-10',
  'The Reindeer',
  {
    'a12-10-s1': {
      goal: 'Listen to the wood pigeons in the night.',
      hint: 'Lie still in the straw. Listen.',
    },
    'a12-10-s2': {
      goal: 'In the morning, ask Bae the way north.',
      hint: 'Talk to Bae while the robber girl listens.',
    },
    'a12-10-s3': {
      goal: 'Go with Gerda and Bae.',
      hint: 'Help tie Gerda on, then climb up behind her.',
    },
  },
  [
    sc(
      'a12-10-pigeons',
      [
        PI('Coo, coo. We have seen little Kay.'),
        GE('What? What did you say?', 'shock'),
        PI('A big white bird pulled his sledge. Like a hen, but flying!'),
        PI('She flew low over the forest and breathed on us. We were cold.'),
        GE('Where was she going?'),
        PI('North, we think, where there is always snow. Ask the reindeer.'),
        BA('Snow and ice! It’s glorious. You can run free in great shining valleys.', 'happy'),
        BA('The Snow Queen’s castle is far north, in the ice. Very far. Bring socks.'),
        GE('Oh, Kay. Little Kay.', 'sad'),
      ],
      [
        ask(
          7,
          'social-studies',
          'north is up on a map',
          'D2.Geo.2.K-2',
          [N('Bae says north. On most maps, which way is north? Up, or down?')],
          [
            opt('Up', [N('Yes! On most maps, north is at the top.', 'happy')], true),
            opt('Down', [N('Down is south. On most maps, north is at the top.')]),
          ],
          'Learned that north is usually at the top of a map.',
        ),
      ],
      {
        choices: [
          {
            id: 'way',
            label: 'Whisper to Bae: do you know the way?',
            then: [BA('Know it? I’d find it eyes shut. I’d go, but for this ring.', 'sad')],
          },
          {
            id: 'hand',
            label: 'Hold Gerda’s hand in the dark.',
            then: [N('You find her hand in the straw. She holds on tight.')],
          },
          {
            id: 'hush',
            label: 'Hush them before the robber girl wakes.',
            then: [N('The robber girl stirs. Everyone is quiet until she snores again.')],
          },
        ],
      },
    ),
    sc(
      'a12-10-pigeons-done',
      [N('Nobody sleeps much after that, except the robber girl and one very old pigeon.')],
      [
        ask(
          0,
          'sel',
          'what helps when you are worried at bedtime',
          'CASEL: Self-management',
          [N('Gerda can’t sleep. What helps when we are worried at bedtime?')],
          [
            opt(
              'A cuddle and a soft song',
              [N('Yes. A cuddle and a soft song help worries get smaller.', 'soft')],
              true,
            ),
            opt('Lying awake and worrying', [
              N('That makes worries bigger. A cuddle and a soft song help.'),
            ]),
          ],
          'Talked about calming down when worried at bedtime.',
        ),
      ],
    ),
    sc(
      'a12-10-morning',
      [
        N('In the morning Gerda tells the robber girl what the pigeons said.'),
        RG('The far north. Bae, do you know the way?'),
        BA('Of course I know it! I was born there.', 'happy'),
        N('His eyes shine. He shakes his big antlers.'),
        RG('The men are all out. Only Mother is here, and she naps at noon.'),
        RG('Then I’ll do something for you.'),
      ],
      [
        note(
          3,
          'science',
          'reindeer mums and dads both grow antlers',
          'ELOF: Scientific Reasoning',
          [N('Reindeer are special deer. Mums and dads can both grow big antlers.')],
          'Heard that both male and female reindeer can grow antlers.',
        ),
      ],
      {
        choices: [
          {
            id: 'thank',
            label: 'Thank her.',
            then: [RG('Don’t thank me yet. I might change my mind.', 'angry')],
          },
          {
            id: 'why',
            label: 'Ask her why.',
            then: [RG('Because I want to. That is why I do everything.')],
          },
        ],
      },
    ),
    sc(
      'a12-10-morning-done',
      [N('At noon the old robber woman has a nap, chin on chest.')],
      [
        ask(
          0,
          'literacy',
          'first sounds',
          'RF.K.2',
          [N('Which word starts with the sound “s”? Sleep, or nap?')],
          [
            opt('Sleep', [N('Yes! S, s, sleep. It starts with s.', 'happy')], true),
            opt('Nap', [N('Nap starts with n. S, s, sleep starts with s.')]),
          ],
          'Found a word that starts with the sound s.',
        ),
      ],
    ),
    sc(
      'a12-10-free',
      [
        N('The robber girl goes to Bae. She does not look at you.'),
        RG('I am helping Bae. I am not helping you.', 'angry'),
        N('She sounds cross. But she is being kind.'),
        ...FREE,
      ],
      [
        ask(
          3,
          'social-studies',
          'fairness: letting someone go home',
          'D2.Civ.8.K-2',
          [N('Bae wants to go home. Is it kind to let him go?')],
          [
            opt(
              'Yes. He wants to go home',
              [N('Yes. It is fair and kind to let someone go home.', 'soft')],
              true,
            ),
            opt('No. Keep him tied', [
              N('Bae is tired and wants his home. Letting him go is kinder.'),
            ]),
          ],
          'Talked about fairness: letting an animal go home.',
        ),
      ],
      { choices: FREE_CHOICES },
    ),
    sc(
      'a12-10-free-done',
      [
        N('Bae runs over stumps and bushes, through forest and plains.'),
        N('Above you the sky flares green and white.'),
        BA('Those are my old lights! Look at them flash!', 'happy'),
      ],
      [
        note(
          1,
          'science',
          'the northern lights',
          '',
          [N('The northern lights are glowing colours, high in the far north sky.')],
          'Heard that the northern lights glow in the sky near the far north.',
        ),
      ],
    ),
    sc(
      'a12-10-complete',
      [
        N('You ride north day and night. Two loaves, then one, then none.'),
        N('Gerda’s hands are in great mittens. Your Nubbin rides inside her coat.'),
        GE('Is it much further?'),
        BA('Yes. But we’re nearer than we were.'),
      ],
      [
        ask(
          0,
          'maths',
          'take away within 10',
          'K.OA.A.2',
          [N('There were two loaves. You eat one. How many are left?')],
          [
            opt('One', [N('Yes! Two take away one leaves one.', 'happy')], true),
            opt('Two', [N('You ate one! Two take away one leaves one.')]),
          ],
          'Took one away from two to make one.',
        ),
      ],
    ),
  ],
);

// ================================================================== A12-11 The Sámi Woman
const Q11: EduQuest = quest(
  'a12-11',
  'The Sámi Woman',
  {
    'a12-11-s1': {
      goal: 'Find the little house in the snow.',
      hint: 'Follow Bae towards the smoke and lamplight.',
    },
    'a12-11-s2': {
      goal: 'Get warm while Bae tells his story.',
      hint: 'Sit by the lamp and eat what you are given.',
    },
    'a12-11-s3': {
      goal: 'Carry the message on the dried fish.',
      hint: 'Take the fish from the Sámi woman. Keep it safe.',
    },
  },
  [
    sc(
      'a12-11-hut',
      [
        N('Bae stops at a little house. Its roof comes down to the snow.'),
        N('The door is low. You crawl in. Your Nubbin goes in on its belly.'),
        N('Inside, by lamplight, a woman is frying fish.'),
        N('A reindeer, a cold girl and a lodger crawl in. She stays calm.'),
        SA('Well. Come in. Shut the cold out. Mind the pan.'),
        N('Gerda is too cold to speak. The woman rubs her hands by the lamp.'),
      ],
      [
        note(
          2,
          'social-studies',
          'the Sámi people today',
          'D2.His.2.K-2',
          [
            N('The Sámi are real people of the far north. They live there today.'),
            N('Many live in towns. Some herd reindeer.'),
          ],
          'Learned that the Sámi are a living people of the far north, in towns and as reindeer herders.',
        ),
      ],
      {
        choices: [
          {
            id: 'feet',
            label: 'Help rub Gerda’s feet.',
            then: [N('You rub Gerda’s feet while the woman does her hands. Warm comes back.')],
          },
          {
            id: 'pan',
            label: 'Mind the pan.',
            then: [N('You turn the fish. The woman nods: right side, right moment.')],
          },
        ],
      },
    ),
    sc(
      'a12-11-hut-done',
      [SA('There. Fingers are coming back. Toes next.', 'soft')],
      [
        note(
          0,
          'health',
          'warming up when very cold',
          '',
          [N('When very cold, go inside and warm up slowly, with a warm drink.')],
          'Heard how to warm up gently when very cold.',
        ),
      ],
    ),
    sc(
      'a12-11-lamp',
      [
        N('Bae tells his own story first. Then he tells Gerda’s.'),
        SA('You’ve been tied up a long while. Hold still.'),
        N('She checks Bae’s legs and neck, quickly and gently.'),
        SA('My son has our herd out on the winter grass. I know tired reindeer.'),
        N('She feeds you fish and broth. She fetches Bae a heap of lichen.'),
        SA('You’ve a long way to go, to where the Snow Queen is.'),
        GE('Do you know where she is?'),
        SA('I know her weather. She lights up the sky every evening, further north.'),
      ],
      [
        ask(
          4,
          'science',
          'what reindeer eat',
          'K-ESS3-1',
          [N('Bae is a reindeer. What does the woman fetch for him to eat?')],
          [
            opt('Lichen', [SA('Yes. Reindeer love lichen, which grows on rocks and trees.')], true),
            opt('Fish', [
              SA('Fish is for us. Reindeer eat lichen, which grows on rocks and trees.'),
            ]),
          ],
          'Learned that reindeer eat lichen.',
        ),
      ],
      {
        choices: [
          {
            id: 'herd',
            label: 'Ask about her herd.',
            then: [SA('Big enough. My son knows each one by its face.', 'happy')],
          },
          {
            id: 'thank',
            label: 'Thank her for the food.',
            then: [SA('It’s only fish. You’d do the same, if I came to your door.')],
          },
          {
            id: 'lichen',
            label: 'Help feed Bae his lichen.',
            then: [N('Bae eats from your hands, softly, then all at once.')],
          },
        ],
      },
    ),
    sc(
      'a12-11-lamp-done',
      [SA('My friend further north knows that country better than I do.')],
      [
        ask(
          0,
          'sel',
          'kindness to strangers',
          'CASEL: Social awareness',
          [N('The woman gave strangers food and a warm seat. That was…')],
          [
            opt(
              'Kind and generous',
              [N('Yes. Sharing with people who need help is kind.', 'soft')],
              true,
            ),
            opt('Silly', [N('Helping someone who is cold and hungry is kind, not silly.')]),
          ],
          'Talked about being kind to people who need help.',
        ),
      ],
    ),
    sc(
      'a12-11-fish',
      [
        SA('I’ve no paper. I’ll write it on a fish.'),
        N('She writes careful lines on a dried fish and hands it to you.'),
        SA('Look after that. Don’t let the reindeer eat it. Don’t eat it yourself.'),
        N('She ties Gerda onto Bae with her own knots, which are better.'),
        N('She gives you a rolled-up reindeer skin.'),
        SA('To sit on, wherever you end up sitting. Snow is colder from underneath.', 'think'),
        N('She doesn’t say how she knows. She knows the country.'),
      ],
      [
        ask(
          5,
          'science',
          'a skin keeps the cold out',
          'ELOF: Scientific Reasoning',
          [N('Why sit on a reindeer skin, and not straight on the snow?')],
          [
            opt(
              'The skin keeps the cold out',
              [SA('Yes. The thick fur keeps the cold of the snow away.')],
              true,
            ),
            opt('The snow is too soft', [
              SA('Snow is soft, but cold. The thick fur keeps the cold away.'),
            ]),
          ],
          'Learned that thick fur stops the cold of the snow reaching you.',
        ),
      ],
      {
        choices: [
          {
            id: 'coat',
            label: 'Put the fish inside your coat.',
            then: [N('You tuck it in. It smells of fish, and so will you.')],
          },
          {
            id: 'why',
            label: 'Ask why she thinks you’ll be sitting.',
            then: [SA('Everyone who goes north ends up waiting for someone.')],
          },
        ],
      },
    ),
    sc(
      'a12-11-fish-done',
      [SA('Go well. Come back this way after. I’ll want to know how it ends.')],
      [
        ask(
          0,
          'literacy',
          'beginning and end of a story',
          'ELOF: Literacy',
          [N('Which comes first in a story: the beginning, or the end?')],
          [
            opt('The beginning', [N('Yes! Beginning, then middle, then end.', 'happy')], true),
            opt('The end', [N('The end comes last. First comes the beginning, then the middle.')]),
          ],
          'Put the beginning, middle and end of a story in order.',
        ),
      ],
    ),
    sc(
      'a12-11-complete',
      [
        N('Bae runs on into the night. The lights burn blue all night.'),
        GE('She didn’t ask for anything. Not even our names.', 'soft'),
        N('The fish letter is warm in your coat. Your Nubbin sniffs it, hopefully.'),
        BA('Not far now. Further than you’d like, but not far.'),
      ],
      [
        ask(
          3,
          'social-studies',
          'north on the map',
          'D2.Geo.2.K-2',
          [N('Her friend lives further north. Is that nearer the cold, or the warm?')],
          [
            opt('Nearer to the cold', [N('Yes. Further north is colder, with more snow.')], true),
            opt('Nearer to the warm', [N('Warm lands are in the south. Further north is colder.')]),
          ],
          'Learned that going further north means colder places.',
        ),
      ],
    ),
  ],
);

// ================================================================== A12-12 The Finnish Woman
const Q12: EduQuest = quest(
  'a12-12',
  'The Finnish Woman',
  {
    'a12-12-s1': {
      goal: 'Deliver the fish letter.',
      hint: 'There is no door. Knock on the chimney.',
    },
    'a12-12-s2': {
      goal: 'Listen while Bae asks the Finnish woman for help.',
      hint: 'Sit in the heat and listen.',
    },
    'a12-12-s3': {
      goal: 'Ask the Finnish woman if you should go with Gerda.',
      hint: 'Ask her in the corner, before Bae sets off.',
    },
  },
  [
    sc(
      'a12-12-chimney',
      [
        N('The Finnish woman’s house has no door. Bae knocks on the chimney.'),
        N('A voice says, come down. Inside, it is so hot the air shimmers.'),
        N('The Finnish woman is small, with rolled-up sleeves and very wise eyes.'),
        FI('Boots off, mittens off, coat open, or you’ll cook!'),
        N('She puts a block of ice on Bae’s head. He looks so relieved.'),
        N('You give her the fish. She reads it three times.'),
        N('Then she pops it in the soup pot. She never wastes anything.'),
      ],
      [
        ask(
          4,
          'science',
          'ice takes heat away',
          '2-PS1-4',
          [N('Bae is too hot. A block of ice makes him feel…')],
          [
            opt('Cooler', [N('Yes! Ice is cold. It takes the heat away.', 'happy')], true),
            opt('Hotter', [N('Ice is very cold. It makes Bae feel cooler.')]),
          ],
          'Learned that ice is cold and cools something hot.',
        ),
      ],
      {
        choices: [
          {
            id: 'soup',
            label: 'Watch the letter go in the soup.',
            then: [N('It goes in with a respectful plop. Your Nubbin watches the pot.')],
          },
          {
            id: 'ice',
            label: 'Ask for a block of ice for yourself.',
            then: [FI('Ha! Here. You’re cooking too. Everybody does, the first time.', 'happy')],
          },
        ],
      },
    ),
    sc(
      'a12-12-chimney-done',
      [FI('Well. So you’re the ones. Sit.')],
      [
        ask(
          0,
          'health',
          'dress for the weather',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('It is very hot inside. What should you take off?')],
          [
            opt(
              'My coat and mittens',
              [N('Yes! Take off warm things when you are hot.', 'happy')],
              true,
            ),
            opt('Nothing at all', [N('You would get too hot. Take off your coat and mittens.')]),
          ],
          'Chose to take off warm clothes when too hot.',
        ),
      ],
    ),
    sc(
      'a12-12-power',
      [
        N('Bae tells his story, then Gerda’s. The Finnish woman says nothing.'),
        BA('You are so clever. Can you give her the strength of twelve men?', 'sad'),
        FI('The strength of twelve men! Much good that would do her.', 'think'),
        N('She takes Bae to a corner and puts fresh ice on his head.'),
        FI('Kay has a splinter in his heart and glass in his eye.'),
        FI('They must come out, or he will never be himself again.'),
        FI('I can’t give her more than she has. Look how much that is!'),
        FI('People help her. Animals carry her. She has come this far barefoot.'),
        FI('It is in her heart. She loves someone, all the way through.', 'soft'),
      ],
      [
        ask(
          8,
          'sel',
          'strength comes from caring',
          'ELOF: Social and Emotional Development',
          [N('Where does Gerda’s strength come from?')],
          [
            opt(
              'From her loving heart',
              [FI('Yes. Love and kindness make her strong. No magic needed.', 'soft')],
              true,
            ),
            opt('From a magic drink', [FI('No magic. Her caring heart is her strength.')]),
          ],
          'Talked about how love and kindness give us strength.',
        ),
      ],
    ),
    sc(
      'a12-12-power-done',
      [N('Gerda, by the stove, hasn’t heard a word. She sleeps in the heat.')],
      [
        note(
          0,
          'health',
          'warm clothes for snow',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('It is snowing outside. Boots and mittens keep Gerda warm.')],
          'Heard that warm clothes help in snowy weather.',
        ),
      ],
    ),
    sc(
      'a12-12-ask',
      [
        N('You go to the corner. You ask: should you go with Gerda?'),
        FI('No.'),
        FI('Two miles on, by the Snow Queen’s garden, stands a red-berried bush.'),
        FI('Take her as far as the bush. Then stop. Then wait.'),
        FI('Some doors only open for one person.', 'think'),
        N('She looks at you, as if checking you are the waiting sort.'),
      ],
      [
        ask(
          5,
          'sel',
          'waiting well',
          'CASEL: Self-management',
          [N('The Finnish woman asks you to wait. What helps with waiting?')],
          [
            opt(
              'Counting quietly',
              [FI('Yes. Counting quietly makes waiting easier.', 'soft')],
              true,
            ),
            opt('Running about', [
              FI('Running about is hard to do while waiting. Counting helps.'),
            ]),
          ],
          'Talked about ways to wait calmly.',
        ),
      ],
      {
        choices: [
          {
            id: 'long',
            label: '“How long?”',
            then: [FI('As long as it takes. That is the only length waiting comes in.')],
          },
          {
            id: 'if',
            label: '“And if she doesn’t come out?”',
            then: [
              FI(
                'Then you will still have waited. That is worth something. But she will come.',
                'soft',
              ),
            ],
          },
          {
            id: 'nod',
            label: 'Nod. You understand.',
            then: [FI('Good. Most people argue.')],
          },
        ],
      },
    ),
    sc(
      'a12-12-ask-done',
      [FI('Now go. Put her down at the bush. Let the reindeer come straight back.')],
      [
        ask(
          0,
          'maths',
          'long and short distances',
          'K.MD.A.2',
          [N('The bush is two miles away. Which is longer, two steps or two miles?')],
          [
            opt('Two miles', [N('Yes! Two miles is much, much longer.', 'happy')], true),
            opt('Two steps', [N('Two steps is tiny. Two miles is much longer.')]),
          ],
          'Compared two steps with two miles.',
        ),
      ],
    ),
    sc(
      'a12-12-complete',
      [
        N('The Finnish woman lifts sleeping Gerda onto Bae. Off he runs!'),
        GE('Oh! My boots! My mittens!', 'shock'),
        N('Bae doesn’t dare stop. He runs through the hard cold.'),
        N('You look back once. The little hot house is a spark, then nothing.'),
      ],
      [
        note(
          2,
          'science',
          'reindeer hooves spread on snow',
          'K-LS1-1',
          [N('Reindeer have wide hooves. They spread out on the snow, like snowshoes.')],
          'Heard that reindeer have wide hooves that help them walk on snow.',
        ),
      ],
    ),
  ],
);

// ================================================================== A12-13 The Bush with Red Berries
const Q13: EduQuest = quest(
  'a12-13',
  'The Bush with Red Berries',
  {
    'a12-13-s1': {
      goal: 'Reach the bush with red berries.',
      hint: 'Hold on to Bae until he stops.',
    },
    'a12-13-s2': {
      goal: 'Wait by the bush, as long as it takes.',
      hint: 'Sit on the reindeer skin and wait. That is the job.',
    },
  },
  [
    sc(
      'a12-13-bush',
      [
        N('The bush stands alone in the snow, with berries red as Gerda’s shoes.'),
        N('Bae sets Gerda down and touches her cheek with his nose. Big tears fall.'),
        BA('I can’t go further. Go well, little one.', 'sad'),
        N('He turns and runs back, so he won’t change his mind.'),
        N('Gerda stands in her stockings, with no boots and no mittens.'),
        N('In the distance something glitters, huge and cold.'),
      ],
      [
        ask(
          3,
          'sel',
          'it is okay to cry at goodbyes',
          'ELOF: Social and Emotional Development',
          [N('Bae cries at the goodbye. Is it okay to cry when sad?')],
          [
            opt(
              'Yes, it’s okay',
              [N('Yes. Crying is how sadness comes out. A hug helps.', 'soft')],
              true,
            ),
            opt('No, never', [N('It is always okay to cry when you feel sad. A hug helps.')]),
          ],
          'Talked about how crying is okay when we feel sad.',
        ),
      ],
      {
        choices: [
          {
            id: 'coat',
            label: 'Offer Gerda your coat.',
            then: [GE('No. You need it. Waiting is the coldest part.', 'soft')],
          },
          {
            id: 'nubbin',
            label: 'Offer her your Nubbin, to keep her hands warm.',
            then: [
              N('Gerda strokes your Nubbin and shakes her head.'),
              GE('Keep it warm for me, so it’s warm when we come back.', 'soft'),
            ],
          },
          {
            id: 'go',
            label: '“Go on, then.”',
            then: [Y('Go on, then.'), GE('I’m going.', 'happy')],
          },
        ],
      },
    ),
    sc(
      'a12-13-bush-done',
      [
        N('Gerda runs off across the snow. She does not look back.'),
        N('You are alone by the bush with your Nubbin. The quiet comes down.'),
      ],
      [
        doit(
          1,
          'maths',
          'count how many',
          'K.CC.B.5',
          'edu:count:berries:10',
          [N('(Count ten red berries on the bush, pointing with your finger. One, two, three…)')],
          'Counted up to ten berries.',
        ),
      ],
    ),
    sc(
      'a12-13-wait',
      [
        N('You unroll the reindeer skin and sit. Snow is colder from underneath.'),
        N('Your Nubbin climbs inside your coat. You keep each other warm.'),
        N('There is no wind. Just the cold, the quiet and the bush.'),
        N('You count the berries. Then you count again. A different number!'),
        N('Far off, green and white lights rise over the palace.'),
        N('You don’t know how long. You will be here when it’s over.', 'soft'),
      ],
      [
        doit(
          4,
          'music',
          'humming makes a tickle',
          '1-PS4-1',
          'edu:hum:tune:slow',
          [N('(Hum a slow tune together. Touch your lips. Do they tickle?)')],
          'Hummed a tune and felt the vibration on their lips.',
        ),
      ],
      { choices: WAIT_CHOICES },
    ),
    sc(
      'a12-13-wait-done',
      [N('Your feet go numb, and come back, and go numb again. You stay.')],
      [
        ask(
          0,
          'sel',
          'keeping your word',
          'CASEL: Responsible decision-making',
          [N('Why do you stay at the bush, even when it is hard?')],
          [
            opt(
              'Because I said I would',
              [N('Yes. Keeping your word is a big thing.', 'soft')],
              true,
            ),
            opt('Because it is easy', [N('It isn’t easy! You stay because you said you would.')]),
          ],
          'Talked about keeping a promise even when it is hard.',
        ),
      ],
    ),
    sc(
      'a12-13-complete',
      [
        N('Night comes. The stars come out thick as frost.'),
        N('Far away, tiny Gerda is still walking. Something moves towards her.'),
        N('You stand up on the skin to see. You do not step off it.'),
        N('You hold your Nubbin tight and stay where you are.'),
      ],
      [
        note(
          0,
          'science',
          'stars are there in the day too',
          '1-ESS1-1',
          [
            N('Stars shine by day too. The Sun’s glare hides them.'),
            N('At night, we can see them.'),
          ],
          'Heard that stars are there by day but hidden by the Sun’s brightness.',
        ),
      ],
    ),
  ],
);

// ================================================================== A12-14 The Snowflake Guards
const Q14: EduQuest = quest(
  'a12-14',
  'The Snowflake Guards',
  {
    'a12-14-s1': {
      goal: 'Watch Gerda from the bush.',
      hint: 'Stand on the reindeer skin and look out.',
    },
    'a12-14-s2': { goal: 'Watch what Gerda does.', hint: 'Keep watching. Don’t look away.' },
  },
  [
    sc(
      'a12-14-guards',
      [
        N('Gerda is a dark speck on the white.'),
        N('Towards her run the snowflakes, along the ground.'),
        N('The nearer they get, the bigger they grow.'),
        N('Some are like spiky hedgehogs. Some are like fat little bears.'),
        N('They are the Snow Queen’s guards. They make a ring round Gerda.'),
      ],
      [
        ask(
          4,
          'maths',
          'name a shape',
          'K.G.A.2',
          [N('The guards make a ring round Gerda. What shape is a ring?')],
          [
            opt('A circle', [N('Yes! A ring is a circle.', 'happy')], true),
            opt('A triangle', [
              N('A triangle has three corners. A ring goes round and round: a circle.'),
            ]),
          ],
          'Named a circle as the shape of a ring.',
        ),
      ],
      {
        choices: [
          {
            id: 'shout',
            label: 'Shout to her.',
            then: [N('You shout. The cold drops your voice in the snow a yard away.')],
          },
          {
            id: 'step',
            label: 'Take one step off the skin.',
            then: [N('You take one step. Then you remember the Finnish woman. You step back on.')],
          },
          {
            id: 'hold',
            label: 'Hold your Nubbin tight.',
            then: [N('You hold it. It holds you. You both keep watching.')],
          },
        ],
      },
    ),
    sc(
      'a12-14-guards-done',
      [N('Gerda stops. She doesn’t run.')],
      [
        ask(
          0,
          'sel',
          'stop and breathe when scared',
          'CASEL: Self-management',
          [N('When we feel frightened, what can we do first?')],
          [
            opt(
              'Stop and take a slow breath',
              [N('Yes. A slow breath helps us feel calmer.', 'soft')],
              true,
            ),
            opt('Run away fast', [
              N('Running can make it scarier. Stopping and breathing helps first.'),
            ]),
          ],
          'Talked about stopping and breathing when frightened.',
        ),
      ],
    ),
    sc(
      'a12-14-prayer',
      [
        N('Gerda folds her hands and says the prayer Grandmother taught her.'),
        N('You can’t hear it from here, and you don’t need to.'),
        N('It is so cold her breath comes out like smoke.'),
        N('The smoke turns into small bright figures with helmets and spears.'),
        N('There are more with every breath she takes.'),
        N('They clear the road ahead of her.'),
        N('They stroke her hands and feet. She feels the cold less.', 'soft'),
        N('She walks on, quickly and bravely.'),
      ],
      [
        note(
          2,
          'science',
          'you can see your breath when it is cold',
          '',
          [N('On a cold day, you can see your breath. It makes a little cloud.')],
          'Heard that breath makes a little cloud on a cold day.',
        ),
      ],
    ),
    sc(
      'a12-14-prayer-done',
      [N('They go with her to the gate. Then they fade, like breath on glass.')],
      [
        doit(
          0,
          'science',
          'breath fogs cold glass',
          '',
          'edu:breathe:window:fog',
          [N('(Breathe on a cold window. See the little cloud? Watch it fade.)')],
          'Breathed on cold glass and watched the mist fade.',
        ),
      ],
    ),
    sc(
      'a12-14-complete',
      [
        N('The palace gate is made of cutting winds. Gerda says her evening prayer.'),
        N('The winds drop, as if they have gone to sleep.'),
        N('She goes in. The gate closes. The winds get up again.'),
        N('You sit back down on the reindeer skin.'),
        N('Now there is nothing to watch but the walls.'),
      ],
      [
        ask(
          1,
          'science',
          'we see what wind moves',
          'K-ESS2-1',
          [N('We can’t see wind. How do we know it is blowing?')],
          [
            opt(
              'Things move, like leaves and flags',
              [N('Yes! We see what the wind moves.', 'happy')],
              true,
            ),
            opt('We can’t know', [
              N('We can! Leaves, flags and snow all move when the wind blows.'),
            ]),
          ],
          'Learned that we can tell wind is blowing by what it moves.',
        ),
      ],
    ),
  ],
);

// ================================================================== A12-15 The Ice Puzzle
const Q15: EduQuest = quest(
  'a12-15',
  'The Ice Puzzle',
  {
    'a12-15-s1': {
      goal: 'Watch the Snow Queen fly south.',
      hint: 'Look through the clear patch in the frost, then up at the sky.',
    },
    'a12-15-s2': {
      goal: 'Watch Kay at his puzzle.',
      hint: 'Keep looking through the clear patch in the frost.',
    },
  },
  [
    sc(
      'a12-15-south',
      [
        N('Your Nubbin breathes on the frozen crust. The frost clears like a window.'),
        N('You see inside the palace, before Gerda gets there.'),
        N('The halls are drifted snow. Cold winds are the windows.'),
        N('Northern lights shine on them. They are huge and empty.'),
        N('The Snow Queen stands in the greatest hall, ready to go.'),
        QU('I’m off to the warm lands.'),
        QU('Make the word while I’m gone, and I’ll give you the world.'),
      ],
      [
        ask(
          5,
          'social-studies',
          'north and south',
          'D2.Geo.2.K-2',
          [N('The queen goes to the warm lands. Which way? South, or north?')],
          [
            opt('South', [N('Yes! The warm lands are south of the cold north.', 'happy')], true),
            opt('North', [N('North is even colder. The warm lands are to the south.')]),
          ],
          'Learned that warmer places lie to the south of the cold north.',
        ),
      ],
      {
        choices: [
          {
            id: 'up',
            label: 'Look up as she passes.',
            then: [N('She flies over the bush, high up, a long white streak heading south.')],
          },
          {
            id: 'down',
            label: 'Keep your head down.',
            then: [N('A long white shadow crosses the snow. The berries rattle on the bush.')],
          },
        ],
      },
    ),
    sc(
      'a12-15-south-done',
      [N('In the great hall Kay is alone. He is the only thing that moves.')],
      [
        ask(
          0,
          'maths',
          'compare sizes',
          'K.MD.A.2',
          [N('Kay is small in a huge hall. Is the hall bigger than Kay?')],
          [
            opt('Bigger', [N('Yes! The hall is much bigger than Kay.', 'happy')], true),
            opt('Smaller', [N('Look how tiny Kay is. The hall is much bigger.')]),
          ],
          'Compared the size of a hall and a boy.',
        ),
      ],
    ),
    sc(
      'a12-15-puzzle',
      [
        N('In the hall is a frozen lake, cracked into a thousand pieces.'),
        N('The Snow Queen calls it the Mirror of Understanding.'),
        N('Kay sits on it. He is blue with cold, and does not notice.'),
        N('He pushes flat, sharp pieces of ice about. He fits them together.'),
        N('To Kay, the shapes are the most important thing in the world.'),
        N('He makes words. But one word he cannot make.'),
        KA('Nearly. It just needs one more piece.'),
        N('It doesn’t. He sits and thinks until he creaks, stiff and still.', 'sad'),
      ],
      [
        doit(
          3,
          'maths',
          'find a triangle',
          'K.G.A.2',
          'edu:tap:shape:triangle',
          [N('(Look around the room. Find a triangle. Triangles have three corners.)')],
          'Found and named a triangle.',
        ),
      ],
      {
        choices: [
          {
            id: 'name',
            label: 'Say his name, out loud, to nobody.',
            then: [Y('Kay.'), N('He can’t hear you. Someone should say it, so you did.')],
          },
          {
            id: 'away',
            label: 'Look away for a moment.',
            then: [N('You look at the red berries. It helps a bit. Then you look back.')],
          },
          {
            id: 'watch',
            label: 'Keep watching.',
            then: [N('You keep watching. Your Nubbin watches the way it watches an egg.')],
          },
        ],
      },
    ),
    sc(
      'a12-15-puzzle-done',
      [N('Then a small figure in stockings comes in through the gate of winds.')],
      [
        ask(
          0,
          'sel',
          'bravery',
          'ELOF: Social and Emotional Development',
          [N('Gerda is scared, and she comes in anyway. What is that called?')],
          [
            opt(
              'Being brave',
              [N('Yes! Being brave means doing it even when you feel scared.', 'happy')],
              true,
            ),
            opt('Being silly', [N('It is not silly. It is being brave, even when scared.')]),
          ],
          'Learned that bravery means acting even when you feel scared.',
        ),
      ],
    ),
    sc(
      'a12-15-complete',
      [
        N('Gerda walks into the empty hall. It takes her a long time.'),
        N('Kay does not look up. He is counting pieces.'),
        N('Your Nubbin holds its breath. So do you.'),
        N('Over the palace the northern lights go quiet.'),
      ],
      [
        ask(
          3,
          'music',
          'loud and quiet',
          'ELOF: Language and Communication',
          [N('The lights go quiet. Which is quieter, a whisper or a shout?')],
          [
            opt('A whisper', [N('Yes! A whisper is very quiet.', 'happy')], true),
            opt('A shout', [N('A shout is loud. A whisper is quiet.')]),
          ],
          'Compared loud and quiet sounds.',
        ),
      ],
    ),
  ],
);

// ================================================================== A12-16 Gerda’s Tears
const Q16: EduQuest = quest(
  'a12-16',
  'Gerda’s Tears',
  {
    'a12-16-s1': {
      goal: 'Watch Gerda find Kay.',
      hint: 'Watch through the clear patch in the frost.',
    },
    'a12-16-s2': {
      goal: 'Watch Kay come back.',
      hint: 'Keep watching. This is the part you waited for.',
    },
    'a12-16-s3': {
      goal: 'Watch the ice spell the word.',
      hint: 'Watch the pieces of ice on the lake.',
    },
  },
  [
    sc(
      'a12-16-found',
      [
        N('Gerda sees him. She knows him at once.'),
        N('She runs and throws her arms round his neck.'),
        GE('Kay! It’s you! I’ve found you!', 'happy'),
        N('Kay sits quite still. He is stiff and cold. He doesn’t know her.'),
        N('Gerda cries, the way you cry at the end of a very long way.', 'sad'),
        N('Her warm tears fall on his chest and reach his heart.'),
        N('They thaw the ice. The little splinter melts, as if it never was.'),
        N('Kay looks at her.'),
      ],
      [
        note(
          7,
          'sel',
          'not giving up',
          'CASEL: Self-management',
          [N('Gerda walked a very long way. She did not give up.')],
          'Talked about how Gerda kept going until she found Kay.',
        ),
      ],
      {
        choices: [
          {
            id: 'stand',
            label: 'Stand up on the skin.',
            then: [N('You stand up. Your Nubbin climbs onto your shoulder to see.')],
          },
          {
            id: 'still',
            label: 'Stay perfectly still.',
            then: [N('You don’t move. You don’t want to break anything, even from far away.')],
          },
        ],
      },
    ),
    sc(
      'a12-16-found-done',
      [N('Gerda sings the rose hymn. You know the tune, and hum along.')],
      [
        doit(
          0,
          'music',
          'keep a steady beat',
          'RL.2.4',
          'edu:clap:beat:slow',
          [N('(Hum a slow tune and clap a steady beat together.)')],
          'Clapped a steady beat to a hummed tune.',
        ),
        note(
          0,
          'science',
          'warm things melt ice',
          '2-PS1-4',
          [
            N('Gerda’s tears are warm. Warm melts ice.'),
            N('That is how her tears melt the cold in Kay.'),
          ],
          'Learned that something warm melts ice.',
        ),
      ],
    ),
    sc(
      'a12-16-tears',
      [
        N('Kay bursts into tears. The grain of glass washes out of his eye.'),
        N('He blinks. He sees her.'),
        KA('Gerda? It’s you! Where did I go? How long have I been away?', 'shock'),
        N('He looks round the hall as if for the first time.'),
        KA('It’s so cold in here. It’s so big and empty.', 'sad'),
        N('He holds Gerda. She laughs and cries at once. So do you.'),
      ],
      [
        ask(
          2,
          'maths',
          'long and short times',
          'ELOF: Mathematics Development',
          [N('Which is longer: a day, or a year?')],
          [
            opt('A year', [N('Yes! A year is much longer than a day.', 'happy')], true),
            opt('A day', [N('A day is short. A year has many, many days in it.')]),
          ],
          'Compared the length of a day and a year.',
        ),
      ],
      {
        choices: [
          {
            id: 'cheer',
            label: 'Cheer.',
            then: [N('You cheer out loud, alone in the far north. Your Nubbin squeaks.')],
          },
          {
            id: 'sit',
            label: 'Sit down hard on the skin.',
            then: [N('Your legs go wobbly. You sit on the skin and laugh.')],
          },
        ],
      },
    ),
    sc(
      'a12-16-tears-done',
      [N('Even the pieces of ice begin to move.')],
      [
        ask(
          0,
          'literacy',
          'describing words',
          'RL.1.4',
          [N('The ice is dancing. Which word fits best: sparkly, or soggy?')],
          [
            opt('Sparkly', [N('Yes! Dancing ice is sparkly.', 'happy')], true),
            opt('Soggy', [N('Soggy is wet and floppy. Dancing ice is sparkly.')]),
          ],
          'Chose a describing word that fits the picture.',
        ),
      ],
    ),
    sc(
      'a12-16-word',
      [
        N('It is such a glad moment that the ice dances round them.'),
        N('When it is tired, it lies down in the shape of a word.'),
        N('It is the word Kay could not make: ETERNITY.'),
        N('Kay didn’t make it. It made itself when he stopped trying and was glad.'),
        N('Gerda hugs him. His cheeks go pink. His eyes shine like hers.'),
        N('He is well and strong again.'),
      ],
      [
        doit(
          2,
          'literacy',
          'the letter E',
          'ELOF: Literacy',
          'edu:trace:letter:e',
          [N('(The word starts with the letter E. Draw a big E in the air!)')],
          'Recognised and traced the letter E.',
        ),
      ],
      {
        choices: [
          {
            id: 'read',
            label: 'Read the word out loud.',
            then: [Y('Eternity.'), N('It is a long word for something so simple.')],
          },
          {
            id: 'gerda',
            label: 'Look at Gerda instead of the word.',
            then: [N('You look at Gerda. The word is the queen’s business. Gerda is yours.')],
          },
        ],
      },
    ),
    sc(
      'a12-16-word-done',
      [N('Kay’s freedom is written there on the lake, in shining letters.')],
      [
        doit(
          0,
          'maths',
          'count how many',
          'K.CC.B.5',
          'edu:count:letters:8',
          [N('(Count the letters in ETERNITY: E, T, E, R, N, I, T, Y. Eight!)')],
          'Counted the eight letters in a word.',
        ),
      ],
    ),
    sc(
      'a12-16-complete',
      [
        N('Kay and Gerda take hands and walk out of the great palace.'),
        N('They talk about Grandmother and the roses on the roof.'),
        N('Wherever they go, the winds drop and the sun comes out.'),
        N('The patch of frost fogs over. You can see them coming.'),
        GE('There! By the bush! It’s our lodger. They waited!', 'happy'),
        KA('Waited? Out here? For me?', 'think'),
      ],
      [
        ask(
          5,
          'sel',
          'showing a friend they matter',
          'CASEL: Relationship skills',
          [N('You waited for Kay. What does waiting for a friend show?')],
          [
            opt(
              'That we care about them',
              [N('Yes. Waiting shows a friend they matter.', 'soft')],
              true,
            ),
            opt('That we have nothing to do', [
              N('You waited because you care. That is what it shows.'),
            ]),
          ],
          'Talked about how waiting for a friend shows we care.',
        ),
      ],
    ),
  ],
);

// ================================================================== A12-17 The Road Home
const Q17: EduQuest = quest(
  'a12-17',
  'The Road Home',
  {
    'a12-17-s1': {
      goal: 'Meet Bae back at the bush.',
      hint: 'Stay by the bush. Bae is coming back.',
    },
    'a12-17-s2': {
      goal: 'Go south past the Finnish woman’s house and the Sámi woman’s.',
      hint: 'Stop at both houses on the way.',
    },
    'a12-17-s3': { goal: 'Meet the rider in the forest.', hint: 'Walk on into the green forest.' },
  },
  [
    sc(
      'a12-17-doe',
      [
        N('Bae is back at the bush. He has brought a young doe.'),
        N('She gives the children her warm milk to drink.'),
        BA('I said I’d come straight back. I never said I’d stay away.', 'happy'),
        KA('Hello, lodger. I’m sorry about the face I pulled at you.', 'sad'),
        N('He means the horrible face at the window. He remembers, and he is ashamed.'),
        GE('He’s really back. He’s cross about his feet, which is how I know.', 'happy'),
      ],
      [
        ask(
          4,
          'sel',
          'accepting an apology',
          'CASEL: Relationship skills',
          [N('Kay says sorry. What can you say back?')],
          [
            opt(
              '“Thank you. It’s okay.”',
              [KA('Thank you. That makes me feel better.', 'soft')],
              true,
            ),
            opt('“I’m still cross.”', [KA('That’s fair. I’ll try to make it up to you.', 'sad')]),
          ],
          'Practised answering an apology kindly.',
        ),
      ],
      {
        choices: [
          {
            id: 'face',
            label: 'Tell Kay it was a very good impression.',
            then: [KA('It was, wasn’t it. I won’t do it again. Probably.', 'happy')],
          },
          {
            id: 'hug',
            label: 'Hug them both.',
            then: [
              N('You hug them both. Your Nubbin gets squashed in the middle and doesn’t mind.'),
            ],
          },
          {
            id: 'skin',
            label: 'Wrap them in the reindeer skin.',
            then: [N('You wrap the skin round them. They look like one small, pleased bundle.')],
          },
        ],
      },
    ),
    sc(
      'a12-17-doe-done',
      [N('Bae and the doe carry them south. You walk beside them.')],
      [
        ask(
          0,
          'maths',
          'add within 10',
          'K.OA.A.2',
          [N('Two reindeer and two children. How many altogether?')],
          [
            opt('Four', [N('Yes! Two and two make four.', 'happy')], true),
            opt('Three', [N('Count on your fingers: two reindeer, then two children. Four!')]),
          ],
          'Added two and two to make four.',
        ),
      ],
    ),
    sc(
      'a12-17-south',
      [
        N('First you stop at the Finnish woman’s hot little house.'),
        N('The children warm up. She gives Gerda back her boots and mittens.'),
        FI('I told you she would come. You waited well. Most people fidget.'),
        N('Then on to the Sámi woman. She has sewn new clothes for both children.'),
        N('She has her sledge ready.'),
        SA('Well. You’re back, and there are two of them. That is how it ends.', 'happy'),
        N('She drives you south herself, to the edge of her country.'),
        N('There the first green is coming through the snow.'),
        SA('Go well, all of you. Even the one who wanted to eat my letter.'),
      ],
      [
        ask(
          5,
          'literacy',
          'what happened first',
          'RL.K.3',
          [N('Which house came first: the Finnish woman’s, or the Sámi woman’s?')],
          [
            opt(
              'The Finnish woman’s',
              [N('Yes! First the hot little house, then the Sámi woman’s.', 'happy')],
              true,
            ),
            opt('The Sámi woman’s', [
              N('Let’s remember: first the Finnish woman’s house. Then the Sámi woman’s.'),
            ]),
          ],
          'Put two story events in order.',
        ),
      ],
      {
        choices: [
          {
            id: 'thanks',
            label: 'Thank her for everything.',
            then: [SA('It was only fish and a skin. Keep the skin.', 'soft')],
          },
          {
            id: 'bae',
            label: 'Say goodbye to Bae.',
            then: [
              BA('Goodbye, lodger. You sit well. I’ve never seen anyone sit so well.', 'happy'),
              N('He touches his nose to your Nubbin and turns for home.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-17-south-done',
      [N('Bae and the doe run north, side by side, into the snow.')],
      [
        note(
          0,
          'social-studies',
          'the Sámi languages',
          'D2.His.2.K-2',
          [
            N('The Sámi people have their own languages. There are several.'),
            N('In North Sámi, “good day” is “buorre beaivi”.'),
          ],
          'Heard that the Sámi have their own languages, and one greeting in North Sámi.',
        ),
      ],
    ),
    sc(
      'a12-17-rider',
      [
        N('Birds sing. The forest has green buds. A horse comes out of it.'),
        N('On it rides a girl in a red cap. It is the robber girl!'),
        RG('I got bored at home. I’m off to see the world.'),
        N('Two wood pigeons ride on her saddle, tied by the leg.'),
        ...NEWS,
      ],
      [
        note(
          8,
          'sel',
          'when someone dies, and remembering',
          'ELOF: Social and Emotional Development',
          [
            N('When someone dies, their body stops working, and it does not start again.'),
            N('It is okay to feel sad. We can remember them, and talk about them.'),
          ],
          'Heard what death means in plain words, and that sadness and remembering are okay.',
        ),
      ],
      { choices: NEWS_CHOICES },
    ),
    sc(
      'a12-17-rider-done',
      [
        N('As she rides off, she tosses something small and red over her shoulder.'),
        N('It lands on your Nubbin’s head: a little red cap.'),
        RG('Robbers always have two of everything!', 'happy'),
      ],
      [
        ask(
          2,
          'sel',
          'saying thank you',
          'ELOF: Social and Emotional Development',
          [N('The robber girl gives your Nubbin a cap. What can you say?')],
          [
            opt('Thank you!', [RG('Don’t mention it. I mean it. Don’t.', 'happy')], true),
            opt('Nothing at all', [RG('Hm. You could say thank you. It’s nice to hear.')]),
          ],
          'Practised saying thank you for a gift.',
        ),
      ],
    ),
    sc(
      'a12-17-complete',
      [
        N('The robber girl rides into the wide world without looking back.'),
        N('Kay and Gerda walk on, hand in hand. It is spring.'),
        N('Your Nubbin wears its red cap at a slant.'),
        N('Somewhere ahead, church bells are ringing.'),
      ],
      [
        note(
          3,
          'science',
          'bells make sound by vibrating',
          '1-PS4-1',
          [N('A bell rings when it shakes very fast. Shaking makes sound.')],
          'Heard that things that shake (vibrate) make sound.',
        ),
      ],
    ),
  ],
);

// ================================================================== A12-18 Summer
const Q18: EduQuest = quest(
  'a12-18',
  'Summer',
  {
    'a12-18-s1': {
      goal: 'Walk home into the town.',
      hint: 'Follow the church bells to Grandmother’s door.',
    },
    'a12-18-s2': {
      goal: 'Sit by the roses with Kay and Gerda.',
      hint: 'Climb out to the little stools under the rose arch.',
    },
  },
  [
    sc(
      'a12-18-bells',
      [
        N('The church bells ring. You know the high towers. It is the town.'),
        N('You go through the streets to Grandmother’s door and up the stairs.'),
        N('Everything is where it was. The clock says tick, tick.'),
        N('But Kay and Gerda notice something. They have grown up.'),
        KA('Was the door always this low?', 'think'),
        GE('We have been gone a long time.', 'soft'),
      ],
      [
        ask(
          3,
          'science',
          'growing taller',
          'ELOF: Scientific Reasoning',
          [N('Kay and Gerda have grown. What happens to children as they grow?')],
          [
            opt(
              'They get taller',
              [N('Yes! Children grow taller as time goes by.', 'happy')],
              true,
            ),
            opt('They get smaller', [
              N('Children get taller as they grow. That is why the door seems low.'),
            ]),
          ],
          'Learned that children grow taller over time.',
        ),
      ],
      {
        choices: [
          {
            id: 'duck',
            label: 'Duck under the beam, out of habit.',
            then: [N('You duck. Kay, who never had to before, bumps his head, and laughs.')],
          },
          {
            id: 'clock',
            label: 'Listen to the clock.',
            then: [N('Tick, tick. It kept going all the time. Someone kept winding it.')],
          },
        ],
      },
    ),
    sc(
      'a12-18-bells-done',
      [N('The window is open. Gutter roses bloom and grow in at the window.')],
      [
        ask(
          0,
          'science',
          'our senses: smell',
          'ELOF: Scientific Reasoning',
          [N('The roses smell sweet. What do you smell with?')],
          [
            opt('My nose', [N('Yes! You smell with your nose. Sniff, sniff!', 'happy')], true),
            opt('My elbow', [N('Not your elbow! You smell with your nose. Sniff, sniff!')]),
          ],
          'Named the nose as the body part for smelling.',
        ),
      ],
    ),
    sc(
      'a12-18-roses',
      [
        N('Two little stools sit under the arch. Kay and Gerda are too big now.'),
        N('The Snow Queen’s cold halls have faded, like a dream after breakfast.'),
        N('Grandmother sits in the sun, reading aloud from her old book. She reads slowly.'),
        N('Kay and Gerda understand the old rose hymn, all at once.'),
        N('They are grown up, and they are children too, in the place that counts.', 'soft'),
        N('And it is summer: warm, glorious summer.'),
      ],
      [
        ask(
          4,
          'sel',
          'staying yourself as you grow',
          'ELOF: Social and Emotional Development',
          [N('You grow tall on the outside. What can stay the same on the inside?')],
          [
            opt(
              'Your kind, playful heart',
              [N('Yes. Your kind heart can stay with you always.', 'soft')],
              true,
            ),
            opt('Your shoes', [N('Ha! Shoes get too small. Your kind heart stays with you.')]),
          ],
          'Talked about what stays the same inside as we grow.',
        ),
      ],
      {
        choices: [
          {
            id: 'gutter',
            label: 'Sit on the gutter’s edge beside them.',
            then: [N('You sit with your feet over the boxes. Grandmother nods and reads on.')],
          },
          {
            id: 'water',
            label: 'Fetch the watering can.',
            then: [N('You water the arch. A drop lands on Kay. He pretends not to notice.')],
          },
        ],
      },
    ),
    sc(
      'a12-18-roses-done',
      [
        GR('There you are, lodger. I kept your room.', 'soft'),
        GR('I thought you’d want it back, after.'),
      ],
      [
        ask(
          1,
          'literacy',
          'who did what in the story',
          'RL.K.3',
          [N('Who kept your room all this time?')],
          [
            opt(
              'Grandmother',
              [GR('That’s right. I did. Rooms like yours are worth keeping.', 'happy')],
              true,
            ),
            opt('The robber girl', [GR('Not the robber girl! It was me, your Grandmother.')]),
          ],
          'Recalled which character kept the room.',
        ),
      ],
    ),
    sc(
      'a12-18-complete',
      [
        N('Your Nubbin sits alone among the roses, in its red cap, quite content.'),
        N('Nobody is holding it, and nobody needs to. It stays because it wants to.', 'soft'),
        ...END,
      ],
      [
        doit(
          5,
          'maths',
          'count how many',
          'K.CC.B.5',
          'edu:count:window-boxes:2',
          [N('(Count the window boxes with the plank between them: one, two!)')],
          'Counted two window boxes.',
        ),
      ],
    ),
  ],
);

// ================================================================== variants
const A12_SPROUT_VARIANTS: EduScene[] = [
  // ---- A12-1, cinder
  sc(
    'a12-01-ember-forgiven',
    [
      N('Your Nubbin carries a little lantern. In it is Cinder’s ember, small and red.'),
      N('It burns steady. Grandmother holds her hands out to it.'),
      GR('Now that’s a good little fire. Bring it up; the eaves get cold.', 'soft'),
    ],
    [
      ask(
        1,
        'science',
        'a fire gives heat and light',
        'ELOF: Scientific Reasoning',
        [N('A little fire gives two things. Which two?')],
        [
          opt('Warmth and light', [GR('Yes! A fire gives warmth and light.', 'happy')], true),
          opt('Ice and snow', [GR('Ice and snow are cold! A fire gives warmth and light.')]),
        ],
        'Learned that a fire gives warmth and light.',
      ),
    ],
  ),
  sc(
    'a12-01-ember-remembered',
    [
      N('Your Nubbin carries a little lantern. In it is Cinder’s ember, small and red.'),
      N('It flickers now and then, as if remembering. It never goes out.'),
      GR('That one has a story in it. Bring it up; the eaves get cold.', 'think'),
    ],
    [
      note(
        1,
        'science',
        'flames flicker when air moves',
        '',
        [GR('A flame flickers when air moves. A lantern keeps it safe.')],
        'Heard that flames flicker when air moves.',
      ),
    ],
  ),
  // ---- A12-4, keptStone
  sc(
    'a12-04-kept',
    [
      N('You have a small cold stone from the Wellspring. You kept it.'),
      N('The white sledge doesn’t pass you. It stops right beside you.'),
      N('The driver looks down. Her face is ice, lovely and still.'),
      QU('You keep things too.'),
      N('She says nothing about the stone in your pocket.'),
      N('She opens her white bearskin. It is soft and very quiet inside.'),
      N('Nothing would hurt there. But nothing would be warm, either.'),
    ],
    [
      ask(
        6,
        'sel',
        'feelings are part of you',
        'ELOF: Social and Emotional Development',
        [N('Is it okay to keep your feelings, even the sad ones?')],
        [
          opt(
            'Yes. They are part of me',
            [N('Yes. All your feelings are part of you. That is okay.', 'soft')],
            true,
          ),
          opt('No. I should feel nothing', [
            N('Feelings are allowed. The hard ones get easier with a hug.', 'soft'),
          ]),
        ],
        'Talked about keeping all our feelings, including the hard ones.',
      ),
    ],
    {
      choices: [
        {
          id: 'refuse',
          label: '“No.”',
          then: [
            Y('No, thank you.'),
            N('She looks at you a moment longer, without anger. Then she drives on.'),
          ],
        },
        {
          id: 'step',
          label: 'Say nothing. Step back.',
          then: [
            N('You step back, out of reach of the fur.'),
            N('She almost smiles. Then she drives on.'),
          ],
        },
      ],
    },
  ),
  // ---- A12-10, a12-nubbin = night
  sc(
    'a12-10-free-night',
    [
      N('The robber girl comes to you first, holding your sleepy Nubbin.'),
      RG('There. I gave it back. Nobody made me.', 'think'),
      RG('If I can give one back, I can give two.'),
      ...FREE,
    ],
    [
      ask(
        2,
        'sel',
        'doing the right thing on your own',
        'CASEL: Responsible decision-making',
        [N('The robber girl gave the Nubbin back by herself. That was…')],
        [
          opt(
            'Kind and honest',
            [N('Yes. She chose to do the right thing, with nobody making her.', 'soft')],
            true,
          ),
          opt('Silly', [N('Giving back what is not yours is kind and honest, not silly.')]),
        ],
        'Talked about choosing to do the right thing without being made to.',
      ),
    ],
    { choices: FREE_CHOICES },
  ),
  // ---- A12-12, cinder
  sc(
    'a12-12-ember-forgiven',
    [
      N('The Finnish woman stops. She looks at the lantern and its steady ember.'),
      FI('That was a fierce fire once.', 'think'),
      FI('Now it only keeps someone warm. That’s the right size for a fire.', 'soft'),
      N('She warms her hands at it, as if greeting someone.'),
    ],
    [
      ask(
        3,
        'health',
        'only grown-ups handle real flame',
        'ELOF: Perceptual, Motor, and Physical Development',
        [N('A real flame is hot. Who should look after it?')],
        [
          opt(
            'A grown-up',
            [N('Yes. Grown-ups look after fire. The lantern keeps the flame safe.')],
            true,
          ),
          opt('Any child', [N('Fire can burn. Leave it to grown-ups, and keep your distance.')]),
        ],
        'Learned that grown-ups look after real flames.',
      ),
    ],
  ),
  sc(
    'a12-12-ember-remembered',
    [
      N('The Finnish woman stops. She looks at the lantern and its flickering ember.'),
      FI('That was a fierce fire once.', 'think'),
      FI('Now it only keeps someone warm. That’s the right size for a fire.', 'soft'),
      N('The ember flickers while she looks. It doesn’t go out.'),
    ],
    [
      note(
        3,
        'sel',
        'things and people can change',
        'ELOF: Social and Emotional Development',
        [N('The ember was fierce once. Now it is gentle. People can change too.')],
        'Heard that people, like the ember, can grow gentler.',
      ),
    ],
  ),
  // ---- A12-13, cinder
  sc(
    'a12-13-wait-forgiven',
    [
      N('You unroll the reindeer skin and sit. Your Nubbin sets its lantern down.'),
      N('Cinder’s ember burns steady. It isn’t much of a fire, but it’s enough.'),
      N('The cold comes to the edge of its light and stops.'),
      N('There is no wind. Just the quiet, the bush and the red berries.'),
      N('You count the berries. Then you count again. A different number!'),
      N('You don’t know how long. You will be here when it’s over.', 'soft'),
    ],
    [
      note(
        2,
        'science',
        'warmth spreads from a fire',
        'ELOF: Scientific Reasoning',
        [N('Warmth spreads from a fire. We sit close, but not too close.')],
        'Heard that warmth spreads out from a fire.',
      ),
    ],
    { choices: WAIT_CHOICES },
  ),
  sc(
    'a12-13-wait-remembered',
    [
      N('You unroll the reindeer skin and sit. Your Nubbin sets its lantern down.'),
      N('Cinder’s ember flickers now and then, as if remembering. It never goes out.'),
      N('It keeps you both from freezing. That is all it does now.'),
      N('There is no wind. Just the quiet, the bush and the red berries.'),
      N('You count the berries. Then you count again. A different number!'),
      N('You don’t know how long. You will be here when it’s over.', 'soft'),
    ],
    [
      note(
        1,
        'science',
        'a lantern shields a flame from the wind',
        'ELOF: Scientific Reasoning',
        [N('Wind can blow a flame out. A lantern keeps the flame safe and still.')],
        'Heard that a lantern shields a flame from the wind.',
      ),
    ],
    { choices: WAIT_CHOICES },
  ),
  // ---- A12-14, keptStone
  sc(
    'a12-14-prayer-kept',
    [
      N('You have a small cold stone from the Wellspring. You kept it.'),
      N('Gerda says her prayer. Her breath turns to smoke, then to bright figures.'),
      N('They clear the road. She walks on, quickly and bravely.'),
      N('Then some snowflakes turn, and run along the ground towards you.'),
      N('They reach the skin and stop. Then they part, like a door opening.'),
      N('In your pocket, the stone hums. It sounds pleased.'),
      N('The road is open. Nothing would stop you.'),
      N('You could walk in. You know how welcome you would be.', 'think'),
    ],
    [
      ask(
        7,
        'sel',
        'keeping a promise',
        'CASEL: Responsible decision-making',
        [N('The road is open, but you promised to wait. What do you do?')],
        [
          opt(
            'Keep my promise and wait',
            [N('Yes. Keeping a promise is a strong and kind thing to do.', 'soft')],
            true,
          ),
          opt('Go in anyway', [N('Gerda must do this part alone. Waiting is how you help.')]),
        ],
        'Talked about keeping a promise when something tempting is offered.',
      ),
    ],
    {
      choices: [
        {
          id: 'sit',
          label: 'Sit back down.',
          then: [
            N('You sit down on the skin. After a while the snowflakes close the road.'),
            N('The stone goes quiet. Your Nubbin climbs back into your coat.'),
          ],
        },
        {
          id: 'turn',
          label: 'Turn your back on the road.',
          then: [
            N('You face the way you came. The snowflakes close up like a door.'),
            N('The stone goes quiet. Your Nubbin climbs back into your coat.'),
          ],
        },
      ],
    },
  ),
  // ---- A12-17, a12-nubbin = night
  sc(
    'a12-17-rider-night',
    [
      N('Birds sing. The forest has green buds. A horse comes out of it.'),
      N('On it rides a girl in a red cap. It is the robber girl!'),
      RG('I got bored at home. I’m off to see the world.'),
      N('Two wood pigeons ride on her saddle, and they are not tied.'),
      RG('They’re not tied any more.'),
      RG('Mostly.', 'think'),
      ...NEWS,
    ],
    [
      note(
        10,
        'sel',
        'when someone dies, and remembering',
        'ELOF: Social and Emotional Development',
        [
          N('When someone dies, their body stops working, and it does not start again.'),
          N('It is okay to feel sad. We can remember them, and talk about them.'),
        ],
        'Heard what death means in plain words, and that sadness and remembering are okay.',
      ),
    ],
    { choices: NEWS_CHOICES },
  ),
  // ---- A12-18, keptStone
  sc(
    'a12-18-pocket',
    [
      N('You have a small cold stone from the Wellspring. You kept it.'),
      GR('Lodger. Why is your hand always on your pocket?', 'think'),
      N('You look down, and it is. You hadn’t noticed.'),
      GR('Kay held his burning-glass tight, all last winter. I would not see that again.', 'sad'),
    ],
    [
      ask(
        3,
        'sel',
        'noticing our habits',
        'CASEL: Self-awareness',
        [N('Why is it good to notice what our hands and bodies are doing?')],
        [
          opt(
            'So we can choose what to do',
            [GR('Yes. Noticing gives us a choice.', 'soft')],
            true,
          ),
          opt('It is not good', [GR('It is useful. When we notice, we can choose.')]),
        ],
        'Talked about how noticing our habits lets us choose.',
      ),
    ],
    {
      choices: [
        {
          id: 'habit',
          label: '“Habit.”',
          then: [GR('A habit is only a thing we have stopped noticing. So notice it.')],
        },
        {
          id: 'keeping',
          label: '“Something I’m keeping.”',
          then: [GR('Keeping is fine. Just be the one doing the keeping.', 'soft')],
        },
        {
          id: 'hand',
          label: 'Say nothing. Take your hand out of your pocket.',
          then: [N('You take your hand out. Grandmother holds it until it is warm.')],
        },
      ],
    },
  ),
  // ---- A12-18, complete (night)
  sc(
    'a12-18-complete-night',
    [
      N('A wood pigeon lands on the roses. Nothing ties it, and it stays.'),
      N('It might be one of the robber girl’s. Either way, it chose this.'),
      N('Your Nubbin, in its red cap, sits beside it. They watch the rooftops.'),
      ...END,
    ],
    [
      ask(
        1,
        'sel',
        'freedom and friendship',
        'CASEL: Social awareness',
        [N('Nobody tied the pigeon. Why does it stay?')],
        [
          opt(
            'It likes it here',
            [N('Yes. It stays because it wants to. That is how friends are.', 'soft')],
            true,
          ),
          opt('It is stuck', [N('Nothing holds it. It stays because it wants to.')]),
        ],
        'Talked about how friends stay because they want to.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A12_SPROUT: EduQuest[] = [
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

/** Sprout versions of every scene in A12_VARIANTS. */
export const EDU_A12_SPROUT_VARIANTS: EduScene[] = A12_SPROUT_VARIANTS;

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  'edu:clap:syllables:pitter-patter',
  'edu:breathe:slow:10',
  'edu:count:snowflake-arms:6',
  'edu:point:colours:red-blue',
  'edu:count:tens:100',
  'edu:count:berries:10',
  'edu:hum:tune:slow',
  'edu:breathe:window:fog',
  'edu:tap:shape:triangle',
  'edu:clap:beat:slow',
  'edu:trace:letter:e',
  'edu:count:letters:8',
  'edu:count:window-boxes:2',
];
