/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): S31 The Great Gourd.
 *
 * Source: side-stories-s31.ts. One EduScene per original scene (every step scene, every done
 * scene, the complete scene and all 17 variants, the ambient lines included), id
 * `sprout:<original id>`. See EDU-STYLE.md.
 *
 * - Every choice keeps its original id and `set`. No choice here is cruel or bleak, so this band
 *   keeps them all and needs no `defaultChoice`.
 * - The three lifted lines (the creed, Ned’s line about his bag, Tam’s line about Nettie) never
 *   appear; every line is original.
 * - Hazel’s third rule is named once, in the `sat` choice of sprout:s31-long-grass, as canon 14 asks.
 * - Nubbins and animals never speak. Sable is narrated only (“Her ears stay up.”). Wisp’s ear is torn.
 * - Fear: the frost is cold, not dangerous; Tam’s faint is a fright that passes, and he is fine.
 * - Facts used: gourds grow from seeds on vines and flowers; frost is frozen water; owls sleep by day;
 *   basalt is cooled lava; acorns are oak seeds; children in Scotland and Ireland once carved turnips.
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
const MOSS = say('moss');
const FERN = say('fern');
const SPARKS = say('sparks');
const CLOVER = say('clover');
const TAM = say('s31-tam');
const GB = say('granny-brock');
const BYTE = say('byte');
const PIXEL = say('pixel');
const IVY = say('s31-ivy');
const NED = say('s31-ned');
const NETTIE = say('s31-nettie');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

/** One answer option. `best` marks the answer the lesson teaches. */
const opt = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

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

// ---------------------------------------------------------------- shared lines
const KEEPSAKES = N('Sparks says to keep the goggles. Your gourd lantern glows by the gate.');
const MORNING = N('Next morning, Tam runs down to the long grass.');
const FOUR_LANTERN = N('At four o’clock, a lantern comes bobbing down the lane.');

const COUNT_ROCKS = (after: number): Beat => ({
  domain: 'maths',
  skill: 'count to 5',
  standard: 'K.CC.B.5',
  kind: 'do',
  after,
  check: 'edu:count:rocks:5',
  lines: [
    N('(Count Ned’s rocks together on your fingers.)'),
    N('One, two, three, four, five. Five rocks!'),
  ],
  parentNote: 'Counted five rocks, one finger for each.',
});

const SUN_MELTS = (after: number): Beat => ({
  domain: 'science',
  skill: 'the sun warms the ground and melts frost; frost ends the gourd season',
  standard: 'K-PS3-1',
  kind: 'notice',
  after,
  lines: [
    N('The sun warms the grass. Warm makes the white frost melt.'),
    N('Gourd plants don’t like frost. It makes their leaves go floppy and brown.'),
    N('So Fern picks all her gourds before the frost comes.'),
  ],
  parentNote:
    'Heard that sunshine warms the ground and melts frost, and that frost ends the gourd season.',
});

// ================================================================== the scenes
const SCENES: EduScene[] = [
  // ------------------------------------------------ 1. The Letter
  sc(
    's31-wall',
    [
      N('It’s autumn. The plums are soft. The wind smells of bonfires.'),
      N('A boy sits on your Grove wall, wrapped in a patchwork quilt.'),
      TAM('I’m Tam. I’m seven. I’m writing a letter.'),
      TAM('It’s to the Great Gourd. Can you help me spell?', 'think'),
      Y('The Great Gourd?'),
      TAM('He flies over on Gourd Night. He brings toys!', 'happy'),
      TAM('He only comes if you’re really sure. You must never say “if”.'),
      TAM('Nobody else believes in him. That’s all right.'),
      N('His letter says DEAR GRAET GORD. Oh dear.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'hear the first sound of a word',
        standard: 'RF.K.2',
        kind: 'ask',
        after: 8,
        prompt: [N('Say them slowly: Gourd. Great.'), N('Which sound do they both start with?')],
        options: [
          opt(
            '“g”, like goose',
            [TAM('Yes! G for Gourd. G for Great. G for goose!', 'happy')],
            true,
          ),
          opt('“t”, like Tam', [TAM('T starts my name! Listen again: g-g-Gourd. It’s “g”.')]),
          opt('“s”, like sun', [N('Sun starts with “s”. Gourd and Great start with “g”. G-g-g!')]),
        ],
        parentNote: 'Listened for the first sound in “Gourd” and “Great”.',
      },
    ],
  ),
  sc(
    's31-letter',
    [
      N('You help Tam. GRAET turns into GREAT.'),
      N('Tam keeps GORD for a bit. Then he lets it go.'),
      TAM('Now, what do I ask for? You choose.', 'think'),
      TAM('You’re a grown-up. He might listen to you more.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'asking nicely',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'ask',
        after: 3,
        prompt: [N('Tam wants to ask nicely. Which is a kind asking word?')],
        options: [
          opt('Please', [TAM('Please! I’ll write it twice, to be sure.', 'happy')], true),
          opt('Gimme', [N('“Gimme” sounds grabby. “Please” is the kind word.')]),
          opt('Now!', [N('“Now!” sounds bossy. “Please” is the kind word.')]),
        ],
        parentNote: 'Picked “please” as the kind way to ask for something.',
      },
    ],
    {
      choices: [
        {
          id: 'toys',
          label: 'Ask for toys.',
          set: { 's31-letter': 'toys' },
          then: [
            Y('Ask for toys!'),
            TAM('Toys. Not greedy ones. Medium toys.', 'happy'),
            N('He writes PLEASE. Then he writes it again.'),
          ],
        },
        {
          id: 'strays',
          label: 'Ask for something for the strays.',
          set: { 's31-letter': 'strays' },
          then: [
            Y('Ask for something for the strays. Nobody brings them anything.'),
            TAM('The hungry animals past the falls? He’d like that.', 'soft'),
            N('He writes SOMETHING FOR THE STRAYS. Then: THEY ARE NOT GREEDY.'),
          ],
        },
        {
          id: 'busy',
          label: 'Tell him he needn’t come if he’s busy.',
          set: { 's31-letter': 'busy' },
          then: [
            TAM('Not come?', 'shock'),
            Y('Only if he’s busy. It’s a long night.'),
            TAM('That’s kind. Nobody ever thinks he might be tired.', 'think'),
          ],
        },
      ],
    },
  ),
  // ------------------------------------------------ 2. Three Things
  sc(
    's31-creed',
    [
      N('Two bigger children come down the lane.'),
      IVY('I’m Ivy. I’m ten. Tam is my little brother.'),
      IVY('Tam, are you writing to that pumpkin again?', 'angry'),
      TAM('Gourd. A pumpkin is one kind of gourd.'),
      NED('I’m Ned. Does he really fly? I’m only asking.', 'think'),
      N('Ivy laughs. Ned laughs too, a bit late.'),
      N('Tam stands up very tall, quilt and all.'),
      TAM('I don’t argue about the Great Gourd. Not with anybody. Not ever.'),
      NETTIE('I’m Nettie. I’m six. I believe Tam!', 'happy'),
      IVY('Come on. Mum wants the biggest gourd. Tam’s carrying it.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'being kind to someone who believes something different',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'ask',
        after: 8,
        prompt: [
          N('Tam believes in the Great Gourd. Ivy doesn’t.'),
          N('What is a kind thing to do?'),
        ],
        options: [
          opt(
            'Listen to Tam',
            [N('Yes. You can listen kindly, even if you think something else.')],
            true,
          ),
          opt('Laugh at him', [
            N('Laughing can hurt. Listening is kinder, even if you don’t agree.'),
          ]),
          opt('Tell him he’s wrong', [
            N('That might make him sad. You can listen, and still think your own thing.'),
          ]),
        ],
        parentNote: 'Talked about being kind to a friend who believes something different.',
      },
    ],
  ),
  sc(
    's31-patch',
    [
      N('Fern’s gourd patch is a tangle of long green vines.'),
      N('The gourds are lumpy. Some are bumpy. Some lean over.'),
      FERN('Sorry about the patch. I grow them badly on purpose.'),
      N('Ivy points at the biggest gourd of all.'),
      IVY('That one. Tam, lift it.'),
      TAM('It’s bigger than me!', 'shock'),
    ],
    [
      {
        domain: 'science',
        skill: 'how a gourd grows: seed, vine, flower, gourd',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'notice',
        after: 2,
        lines: [
          FERN('Every gourd starts as one little seed.'),
          FERN('The seed grows a long vine. The vine grows yellow flowers.'),
          FERN('Bees buzz from flower to flower. Then a gourd starts to grow!'),
        ],
        parentNote: 'Heard how a gourd grows: a seed, then a vine, then flowers, then the gourd.',
      },
    ],
  ),
  // ------------------------------------------------ 3. The Biggest One
  sc(
    's31-carve',
    [
      N('Tam carries the big gourd home. Slowly. Very slowly.'),
      N('Mum stays to help with the big knife. Ivy cuts the top off. Chop!'),
      TAM('Nobody told me you cut them!', 'shock'),
      IVY('It’s only a gourd, Tam. It’s got seeds inside.'),
      N('Inside are lots of flat, white seeds.'),
      N('Ivy carves a face with spiky teeth. It looks a bit like Ivy.'),
      N('Tam hides under his quilt. Nettie hides under a tea towel, to be fair.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'count to 5',
        standard: 'K.CC.B.5',
        kind: 'do',
        after: 4,
        check: 'edu:count:seeds:5',
        lines: [
          N('(Take out five seeds. Count them together.)'),
          N('One, two, three, four, five seeds!'),
        ],
        parentNote: 'Counted five gourd seeds.',
      },
    ],
  ),
  sc(
    's31-kinder',
    [
      N('You pick a small, lopsided gourd.'),
      N('You carve it slowly, next to Tam.'),
      N('Two round eyes. No teeth. A little smile.'),
      N('A corner of the quilt lifts up.'),
      TAM('That one’s kind. He won’t mind that one.', 'soft'),
      TAM('You keep it. Put it where he can see it from the sky.'),
    ],
    [
      {
        domain: 'art',
        skill: 'draw a circle: the shape of the lantern’s eyes',
        kind: 'do',
        after: 2,
        check: 'edu:tap:shape:circle',
        lines: [
          N('The eyes are round. They are circles.'),
          N('(Draw a circle in the air together.)'),
        ],
        parentNote: 'Named the lantern’s round eyes as circles and drew one in the air.',
      },
      {
        domain: 'social-studies',
        skill: 'lanterns long ago: carved turnips',
        standard: 'D2.His.2.K-2',
        kind: 'notice',
        after: 5,
        lines: [
          N('Long ago, children in Scotland and Ireland made lanterns too.'),
          N('They didn’t have pumpkins. They carved turnips!'),
          TAM('Turnips? Poor turnips.', 'think'),
        ],
        parentNote: 'Heard that children in Scotland and Ireland once carved turnip lanterns.',
      },
    ],
  ),
  // ------------------------------------------------ 4. The Ball
  sc(
    's31-ball',
    [
      N('Next morning, Ivy holds a ball on the green with one finger.'),
      IVY('Ned, run up and kick it. I won’t pull it away.'),
      NED('You pulled it away last time.', 'think'),
      IVY('This time I wrote it down. See? A promise.'),
      NED('Will you sign it too? Then it counts.', 'soft'),
    ],
    [
      {
        domain: 'sel',
        skill: 'what a promise means',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'ask',
        after: 3,
        prompt: [N('Ivy made a promise. What does a promise mean?')],
        options: [
          opt(
            'You really will do it',
            [NED('Yes! A promise means you really, truly do it.', 'happy')],
            true,
          ),
          opt('You can change your mind', [
            N('Not with a promise. A promise means you really do it.'),
          ]),
          opt('Nothing much', [N('A promise matters! It means you do what you said.')]),
        ],
        parentNote: 'Talked about what a promise means.',
      },
    ],
    {
      choices: [
        {
          id: 'sign',
          label: 'Sign it.',
          then: [N('You sign your name.'), NED('Right. This is it!', 'happy')],
        },
        {
          id: 'warn',
          label: 'Sign it, and tell Ned to watch her finger.',
          then: [
            N('You sign. You whisper, “Watch her finger.”'),
            NED('I will. The whole way.', 'think'),
            IVY('No helping!'),
          ],
        },
        {
          id: 'dont',
          label: 'Don’t sign. Tell Ned not to do it.',
          set: { 's31-witness': 'refused' },
          then: [
            Y('Don’t do it, Ned.'),
            NED('But it’s written down.', 'sad'),
            N('He signs it himself, very small.'),
          ],
        },
      ],
    },
  ),
  sc(
    's31-kick',
    [
      N('Ned runs and runs. Thud, thud, thud!'),
      N('Ivy lifts her finger. The ball rolls away.'),
      N('Ned kicks the air. Whoosh! He lands on his back. Bump!'),
      NED('You promised.', 'sad'),
      IVY('Doesn’t count. The Keeper is your friend. Friends don’t count.'),
      N('Ivy walks off. Ned looks up at the sky.'),
      N('Ned isn’t hurt. But he is sad. A broken promise hurts inside.'),
    ],
    [
      {
        domain: 'science',
        skill: 'a push makes things move',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'notice',
        after: 2,
        lines: [
          N('A kick is a push. A push makes a ball roll.'),
          N('No ball to push? Then Ned’s leg keeps swinging. Up goes Ned!'),
        ],
        parentNote: 'Heard that a kick is a push, and a push makes things move.',
      },
    ],
  ),
  // ------------------------------------------------ 5. Two Lists
  sc(
    's31-lists',
    [
      N('Ned has a card shaped like a cog.'),
      NED('Sparks asked me to her party! Me!', 'happy'),
      IVY('Sparks has two lists. Who to ask, and who not to ask.'),
      IVY('You’re on the wrong one. I’m only helping.'),
      NED('Oh. I thought it was a nice card.', 'sad'),
      TAM('Ask her. That’s what you do. You ask.'),
      NED('I can’t. Will you ask for me?'),
    ],
    [
      {
        domain: 'sel',
        skill: 'asking to find out, instead of worrying',
        standard: 'ELOF: Approaches to Learning',
        kind: 'ask',
        after: 6,
        prompt: [N('Ned is worried. What is the best way to find out?')],
        options: [
          opt('Ask Sparks', [TAM('Yes! Asking is how you know.', 'happy')], true),
          opt('Guess', [N('Guessing can be wrong. Asking Sparks is the way to know.')]),
          opt('Hide', [N('Hiding keeps the worry. Asking Sparks makes it go away.')]),
        ],
        parentNote: 'Chose asking as the way to find out, instead of guessing or worrying.',
      },
    ],
  ),
  sc(
    's31-everybody',
    [
      N('Sparks is up a ladder, hanging little lights.'),
      SPARKS('Two lists? No! There’s only ONE list!', 'shock'),
      N('She points at her door. Big chalk letters say EVERYBODY.'),
      SPARKS('Everybody comes to my party. Everybody!', 'happy'),
      SPARKS('NED! You’re asked!'),
      N('Down the lane, Ned sits up very fast.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'clap the syllables in a word',
        standard: 'RF.K.2',
        kind: 'do',
        after: 3,
        check: 'edu:clap:syllables:party',
        lines: [N('Let’s clap it: par-ty. (Clap “party” together.)'), N('Two claps! Par-ty!')],
        parentNote: 'Clapped the two beats in “party”.',
      },
    ],
  ),
  // ------------------------------------------------ 6. The Most Sincere Patch
  sc(
    's31-sincere',
    [
      N('Tam looks at every gourd patch in the valley. Then he picks a spot.'),
      N('Three lantern posts are lit. The fourth post is dark.'),
      N('The dark post stands in the long, wild grass.'),
      TAM('This one. It isn’t pretending. The Great Gourd likes a patch that’s honest.', 'think'),
      N('Tam’s sign says WELCOME GREAT GOURD.'),
      N('One R is backwards. On purpose. For luck!'),
      N('He has a toffee apple too, in case the Great Gourd is hungry.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'count to 4',
        standard: 'K.CC.B.5',
        kind: 'do',
        after: 1,
        check: 'edu:count:posts:4',
        lines: [
          N('(Count the posts together.)'),
          N('One, two, three lit posts. And one dark post. Four posts!'),
        ],
        parentNote: 'Counted three lit posts and one dark one: four.',
      },
    ],
  ),
  sc(
    's31-moss',
    [
      N('You hammer the sign in. Tap, tap, ouch! Your thumb!'),
      N('Tam puts the toffee apple on top of the sign.'),
      N('Moss walks by, slowly. He stops to read the sign.'),
      TAM('Moss, you’re very old. Is the Great Gourd real?'),
      MOSS('I have never seen him. I have never seen the wind, either.', 'think'),
      N('Tam nods. He thinks that means yes.'),
      N('Clover comes with three blankets. She puts them down by the sign.'),
      CLOVER('One each, and a spare. Don’t ask me about it.'),
    ],
    [
      {
        domain: 'science',
        skill: 'some real things can’t be seen, like the wind',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'ask',
        after: 5,
        prompt: [N('Some real things, we can’t see. Which one can’t we see?')],
        options: [
          opt('The wind', [N('Yes! We can’t see the wind. We see it wave the grass.')], true),
          opt('A gourd', [N('We can see gourds! But we only see the wind wave the grass.')]),
        ],
        parentNote: 'Talked about the wind: real, but we only see what it moves.',
      },
    ],
  ),
  // ------------------------------------------------ 7. Ghosts
  sc(
    's31-dusk',
    [
      N('It’s Gourd Night! The sun goes down behind the hill.'),
      N('Gourd lanterns glow on every step. One, then another, then another.'),
      IVY('I’m a witch. Witches are mean. So it’s the opposite of me.'),
      N('Ned says nothing. Very, very carefully.'),
      IVY('NED.'),
      N('Ned is a ghost. His sheet has lots and lots of holes.'),
      NED('The scissors were tricky. But I can see really well!', 'happy'),
      SPARKS('For your Nubbin! Goggles and a scarf!', 'happy'),
      N('Tam is in the long grass already. Nettie holds his hand.'),
    ],
    [
      {
        domain: 'science',
        skill: 'in autumn the days get shorter',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'notice',
        after: 0,
        lines: [
          N('In autumn, it gets dark earlier.'),
          N('The days get shorter. The nights get longer.'),
        ],
        parentNote: 'Heard that autumn days get shorter and nights get longer.',
      },
    ],
  ),
  sc(
    's31-ace',
    [
      N('The goggles go on top.'),
      N('The red scarf goes round twice. It still trails!'),
      N('Your Nubbin looks up at the sky. Very serious.'),
      N('It’s a flying ace now. A brave pretend pilot.'),
    ],
    [
      {
        domain: 'art',
        skill: 'find the colour red',
        kind: 'do',
        after: 1,
        check: 'edu:tap:colour:red',
        lines: [
          N('(Point to something red near you.)'),
          N('Red like the scarf. Red like an apple!'),
        ],
        parentNote: 'Found something red to match the scarf.',
      },
    ],
  ),
  // ------------------------------------------------ 8. The Long Grass
  sc(
    's31-long-grass',
    [
      N('The guisers stop by the grass. Guisers are children in costumes.'),
      N('Ivy is a witch. Ned is a ghost. Three tiny children are bats.'),
      IVY('Tam, you’ll sit out here all night? In the cold?'),
      TAM('If I’m not here, he’ll think nobody meant it.'),
      NETTIE('I’m staying too. I mean it. I think.'),
      IVY('I’ll fetch you both at four. I told Mum and Clover.'),
      N('Up the lane, Clover’s window has a lamp. It stays on all night.'),
      N('Granny Brock comes down the lane. She looks at the sign.'),
      GB('Waiting for a gourd. In the cold. Hm.'),
      N('She leaves a quilt and a flask of soup. She says nothing else.'),
      N('Tam skips to keep warm. He gets the rhyme wrong. Again.'),
      IVY('Keeper, come with us? The bat children are very small.'),
      SPARKS('Keeper! Party! Everybody’s on the list!', 'happy'),
      N('Tam doesn’t ask you anything. He just waits.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'waiting is hard; noticing what helps',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'notice',
        after: 13,
        lines: [
          N('Waiting is hard. It can feel very, very long.'),
          N('What helps you wait? (Talk about it together.)'),
        ],
        parentNote: 'Talked about how waiting feels, and what helps.',
      },
    ],
    {
      choices: [
        {
          id: 'guise',
          label: 'Go guising with Ivy and the bats.',
          set: { 's31-night': 'guise' },
          then: [
            N('You hold the smallest bat’s hand. It’s sticky.'),
            TAM('Go on. I’ll tell him you were busy.'),
          ],
        },
        {
          id: 'party',
          label: 'Go to Sparks’s party.',
          set: { 's31-night': 'party' },
          then: [
            SPARKS('Hooray! The Keeper’s coming!', 'happy'),
            TAM('Bring Nettie a sandwich. She’ll want one.'),
          ],
        },
        {
          id: 'sat',
          label: 'Sit down next to Tam and wait.',
          set: { 's31-night': 'sat' },
          then: [
            N('You sit down in the long grass. It’s wet.'),
            Y('My gran had a rule for this. Her third one.'),
            Y('When you don’t know what to do, sit down next to them and wait.'),
            TAM('That’s a rule? Good. I like rules.', 'happy'),
          ],
        },
      ],
    },
  ),
  // ------------------------------------------------ 9. The rocks
  sc(
    's31-guising',
    [
      N('Down the lane go the guisers. Knock, knock!'),
      N('At each door they tell a joke. Then they hold out their bags.'),
      NED('Knock, knock! Who’s there? Ned! Ned who? Um… I forget.'),
      N('Everybody laughs. Even Ivy. Ned gets a rock.'),
      N('Ivy gets a toffee apple. The bats get nuts.'),
      N('Ned looks in his bag. A rock!'),
      N('Knock, knock! Another door, another rock. And another!'),
      FERN('Oh dear. I panicked. Here’s a rock.', 'shock'),
      N('At Byte’s door, Ned gets a rock with a little label.'),
      NED('Knock, knock! I remember now! … No, I don’t.'),
      N('Five doors. Five rocks. Poor Ned!'),
    ],
    [COUNT_ROCKS(7)],
  ),
  sc(
    's31-rock',
    [
      N('Ned holds up the rock with the label. It says BASALT.'),
      NED('All rocks. I think the rocks like me best.', 'sad'),
      NED('But Byte wrote what it is! Nobody ever does that.', 'soft'),
      NED('You have it. For being my witness.', 'soft'),
      N('It’s heavy and cold. You keep it safe in your pocket.'),
    ],
    [
      {
        domain: 'science',
        skill: 'basalt is a rock made from cooled lava',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'notice',
        after: 0,
        lines: [
          N('Basalt is a dark rock.'),
          N('Long ago it was hot, runny rock from a volcano.'),
          N('It cooled down and went hard.'),
        ],
        parentNote: 'Heard that basalt was once hot, runny rock that cooled and went hard.',
      },
    ],
  ),
  // ------------------------------------------------ 10. The Flying Ace
  sc(
    's31-ace-roof',
    [
      N('Up on a roof, your Nubbin plays flying aces.'),
      N('It ducks. It weaves. It shakes a paw at the sky.'),
      N('Brrm, brrm… sputter! Pretend engine trouble!'),
      N('It spins, slides down the roof, and lands in the rain barrel. Splash!'),
      N('It sits in the barrel. It has a hat of leaves now.'),
      N('It climbs out and wrings out its scarf. Very brave.'),
      N('Far away, Sparks’s workshop glows. Party time!'),
    ],
    [
      {
        domain: 'health',
        skill: 'move like a pilot: balance and big arm movements',
        standard: 'ELOF: Perceptual, Motor, and Physical Development',
        kind: 'do',
        after: 5,
        check: 'edu:act:fly:arms',
        lines: [
          N('(Stand up. Be a flying ace! Arms out wide.)'),
          N('Zoom, zoom! Now land, very gently.'),
        ],
        parentNote: 'Played at being a pilot: arms out, zooming, and a gentle landing.',
      },
    ],
  ),
  sc(
    's31-ace-party',
    [
      N('Your Nubbin creeps under the hedges to the party.'),
      N('It hides in the apple tub. Ivy dips her face in for an apple.'),
      IVY('Something LICKED me!', 'shock'),
      N('Pixel plays the pianola. A fast tune.'),
      BYTE('Too fast, Pixel.'),
      PIXEL('Your feet are too slow, Byte.'),
      N('Then a slow tune.'),
      N('Your Nubbin dances to the fast one. It droops for the slow one.'),
      N('Then it howls by accident. Ooo! It looks very surprised.'),
      N('Off it creeps into the dark, scarf trailing.'),
    ],
    [
      {
        domain: 'music',
        skill: 'fast and slow music feel different',
        kind: 'do',
        after: 7,
        check: 'edu:clap:tempo:fast-slow',
        lines: [
          N('(Clap fast, like a happy tune. Now clap slow.)'),
          N('Fast can feel merry. Slow can feel sad.'),
        ],
        parentNote: 'Clapped fast and slow, and talked about how each one feels.',
      },
    ],
  ),
  // ------------------------------------------------ 11. If
  sc(
    's31-if',
    [
      N('It’s midnight. The middle of the night.'),
      N('Three lanterns glow. The fourth post is dark.'),
      N('Granny Brock’s flask is still warm. Nettie has the soup. Tam has the lid.'),
      NETTIE('Tam, my feet are cold.', 'sad'),
      NETTIE('What if he isn’t coming?'),
      TAM('He’s coming! If he comes, I’ll ask him—', 'happy'),
      TAM('…If. I said “if”. Now he’ll think I’m not sure!', 'sad'),
      N('Tam pulls his quilt over his head. Sniff.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'midnight is twelve o’clock at night',
        standard: '1.MD.B.3',
        kind: 'notice',
        after: 0,
        lines: [
          N('Midnight is twelve o’clock at night.'),
          N('(Show twelve on your fingers: ten, and two more.)'),
        ],
        parentNote: 'Learned that midnight is twelve o’clock at night.',
      },
    ],
    {
      choices: [
        {
          id: 'everyone',
          label: '“Everyone says ‘if’ sometimes.”',
          then: [
            Y('Everyone says “if”, Tam. Even about things they’re sure of.'),
            TAM('Even you?'),
            Y('Especially me.'),
            N('The quilt comes down a little.'),
          ],
        },
        {
          id: 'closer',
          label: 'Say nothing. Sit a bit closer.',
          then: [
            N('You shift closer. Your shoulder touches the quilt.'),
            N('After a while, the quilt leans on you.'),
          ],
        },
      ],
    },
  ),
  sc(
    's31-midnight',
    [
      N('Midnight comes and goes. Nothing comes up out of the grass.'),
      N('Only the cold.'),
      N('An owl flies over, very low. Whoo!'),
      NETTIE('Is that him?', 'shock'),
      TAM('That’s an owl.', 'sad'),
    ],
    [
      {
        domain: 'science',
        skill: 'owls are awake at night',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'ask',
        after: 4,
        prompt: [N('The owl is awake at night. So when do owls sleep?')],
        options: [
          opt('In the daytime', [N('Yes! Owls sleep in the day and fly at night.')], true),
          opt('At night', [N('Not owls! They sleep in the day and fly about at night.')]),
        ],
        parentNote: 'Learned that owls sleep in the day and are awake at night.',
      },
    ],
  ),
  // ------------------------------------------------ 12. Something in the Grass
  sc(
    's31-frost',
    [
      N('Late in the night, the frost comes.'),
      N('It creeps over the grass, white and sparkly.'),
      N('The grass goes stiff and crunchy.'),
      N('Nettie is asleep. One boot is off.'),
      TAM('It’s so cold! The Great Gourd must be close!', 'shock'),
      N('Out by the post, something moves.'),
    ],
    [
      {
        domain: 'science',
        skill: 'frost is frozen water',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'notice',
        after: 2,
        lines: [
          N('Frost is ice. Water from the air freezes on the cold grass.'),
          N('Brr! That’s why we wrap up warm, like Tam in his quilt.'),
        ],
        parentNote: 'Heard that frost is water that froze on the grass.',
      },
    ],
  ),
  sc(
    's31-shape',
    [
      N('A round shape rises at the edge of the grass. Goggles! A scarf!'),
      N('Tam says “Oh,” very politely. Then he faints. Flop!'),
      N('It’s your Nubbin, home from its game.'),
      N('It climbs into your lap and falls asleep.'),
      NETTIE('He does that. He fainted at a goose once. He’s fine.'),
      N('Tam is all right. He was very tired. Now he is fast asleep.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'naming feelings: surprised and scared',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'ask',
        after: 5,
        prompt: [N('Tam got a big fright. How did he feel?')],
        options: [
          opt(
            'Surprised and a bit scared',
            [N('Yes. A big surprise can feel scary. Then it passes.')],
            true,
          ),
          opt('Happy', [N('More like surprised! Frights feel big, and then they pass.')]),
        ],
        parentNote: 'Named a fright as surprised and a bit scared, and heard that frights pass.',
      },
    ],
  ),
  // ------------------------------------------------ 13. Four in the Morning
  sc(
    's31-four',
    [
      FOUR_LANTERN,
      IVY('Four o’clock. I said four. Look at you all!', 'angry'),
      N('Ivy doesn’t laugh. She lifts Tam up, quilt and all.'),
      N('She has a blanket. She drops it on you.'),
      IVY('You look frozen. I’m not saying anything nice.'),
      N('But that WAS nice. That’s Ivy’s way.'),
      N('Off they go. Nettie carries the lantern, yawning.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'count the hours from midnight to four o’clock',
        standard: '1.MD.B.3',
        kind: 'do',
        after: 1,
        check: 'edu:count:hours:4',
        lines: [
          N('Midnight, then one, two, three, four o’clock.'),
          N('(Count the hours on your fingers. Four!)'),
        ],
        parentNote: 'Counted the hours from midnight to four o’clock.',
      },
    ],
  ),
  sc(
    's31-light',
    [
      N('Ivy gets Tam home. She takes his boots off.'),
      N('She tucks him into bed. Then she goes to her own room.'),
      N('In the long grass, the sky gets light. Slowly.'),
      N('The sun comes up. The frost melts away.'),
      N('Your Nubbin wakes up in its goggles. It salutes the sign.'),
      N('Nobody told it the game is over!'),
      N('Tam’s sign is still there. WELCOME GREAT GOURD.'),
    ],
    [SUN_MELTS(3)],
  ),
  // ------------------------------------------------ 14. Next Year
  sc(
    's31-next-year',
    [
      N('Tam sleeps until lunch. Then he’s back on the wall.'),
      N('Ned sits next to him. Ned wants to help.'),
      NED('I do silly things too. I tried to kick that ball ten times.', 'soft'),
      NED('So don’t feel bad about waiting all night.'),
      TAM('Silly?', 'angry'),
      TAM('He didn’t come because I said “if”. That isn’t silly.', 'angry'),
      N('Nettie walks past. Her nose is in the air. She’s cross!'),
      TAM('Nettie’s the crossest of all. She missed the guising, waiting with me.'),
      TAM('He’ll come next year. I just know it.', 'happy'),
    ],
    [
      {
        domain: 'sel',
        skill: 'words can hurt even when we mean well',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'ask',
        after: 5,
        prompt: [N('Ned wanted to help. But Tam got cross. Why?')],
        options: [
          opt(
            'Ned called his night silly',
            [N('Yes. “Silly” hurt Tam’s feelings, even though Ned meant well.')],
            true,
          ),
          opt('Tam was hungry', [N('Maybe! But mostly the word “silly” hurt his feelings.')]),
        ],
        parentNote: 'Noticed that a word can hurt, even when someone is trying to help.',
      },
    ],
  ),
  sc(
    's31-promise',
    [
      N('Ned goes home. Tam turns round on the wall.'),
      TAM('You sat with me. All night. Even the cold bit.'),
      TAM('Next year, will you wait with me again?', 'soft'),
      N('He looks at you, and waits.'),
    ],
    [
      {
        domain: 'science',
        skill: 'the order of the seasons',
        standard: 'K-ESS2-1',
        kind: 'do',
        after: 3,
        check: 'edu:order:seasons',
        lines: [
          N('Gourd Night comes once a year, in autumn.'),
          N('(Put the seasons in order: autumn, winter, spring, summer.)'),
          N('Then autumn again!'),
        ],
        parentNote: 'Put the four seasons in order, from autumn round to autumn again.',
      },
    ],
    {
      choices: [
        {
          id: 'yes',
          label: '“Yes.”',
          then: [
            Y('Yes.'),
            TAM('Good. You’re at the top of my list.', 'happy'),
            N('His sign stays in the long grass all winter.'),
          ],
        },
        {
          id: 'blanket',
          label: '“Yes. And I’m bringing my own blanket.”',
          then: [
            Y('Yes. And I’m bringing my own blanket.'),
            TAM('Fair. The spare one’s his.', 'think'),
            N('His sign stays in the long grass all winter.'),
          ],
        },
      ],
    },
  ),
  // ------------------------------------------------ complete (letter = toys)
  sc(
    's31-complete',
    [
      MORNING,
      N('By his sign is one acorn. Round and shiny.'),
      TAM('A toy! A medium toy! He read my letter!', 'happy'),
      N('Up on the hill, Moss sits very, very still.'),
      N('He looks like someone who has never seen an acorn. Ever.'),
      KEEPSAKES,
    ],
    [
      {
        domain: 'science',
        skill: 'an acorn is an oak tree’s seed',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'notice',
        after: 2,
        lines: [
          N('An acorn is a seed. It comes from an oak tree.'),
          N('Plant it, and one day it can grow into a new oak!'),
        ],
        parentNote: 'Learned that an acorn is an oak seed that can grow into a tree.',
      },
    ],
  ),
];

// ================================================================== variants
// Refused-witness clones (SR-20261027-1257): the base scene with one line swapped.
const refusedClone = (of: string, at: number, line: Line): EduScene => {
  const base = SCENES.find((s) => s.of === of);
  if (!base) throw new Error(`missing base scene ${of}`);
  return {
    ...base,
    id: `sprout:${of}-refused`,
    of: `${of}-refused`,
    lines: base.lines.map((l, i) => (i === at ? line : l)),
    lessons: base.lessons.map((l) => ({
      ...l,
      id: l.id.replace(`sprout:${of}-l`, `sprout:${of}-refused-l`),
    })),
  };
};

export const EDU_S31_SPROUT_VARIANTS: EduScene[] = [
  refusedClone('s31-kick', 4, IVY('Ned signed it himself. Ned can’t be his own witness. Doesn’t count.')),
  refusedClone('s31-rock', 3, NED('You have it. You were the only one who said no.', 'soft')),
  sc(
    's31-guising-sat',
    [
      N('Late at night, a ghost comes back up the lane. It’s Ned.'),
      NED('Has he come yet?', 'soft'),
      TAM('Not yet. He’s busy somewhere.'),
      NETTIE('What did you get? I’m only asking.', 'think'),
      N('Ned tips out his bag. Rocks fall out. Clonk, clonk, clonk!'),
      N('One rock has a little paper label.'),
    ],
    [COUNT_ROCKS(4)],
  ),
  sc(
    's31-guising-party',
    [
      N('The guisers burst into the party. Brr, cold air!'),
      N('Ivy and the bats tip out their bags. Toffee apples! Nuts! Pennies!'),
      N('Ned tips out his bag last. Five rocks. Clonk!'),
      SPARKS('Oh, Ned.', 'sad'),
      N('The smallest bat gives Ned a nut. Then another one.'),
      N('One of Ned’s rocks has a little paper label.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'sharing helps a sad friend',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'ask',
        after: 4,
        prompt: [N('The little bat shared. How might Ned feel now?')],
        options: [
          opt('Happy and cared for', [N('Yes. Sharing helps a sad friend feel better.')], true),
          opt('Cross', [N('Probably not! Sharing usually helps a sad friend feel cared for.')]),
        ],
        parentNote: 'Talked about how sharing helps a friend who feels left out.',
      },
    ],
  ),
  sc(
    's31-if-away',
    [
      N('Midnight. Three lanterns glow. The fourth post is dark.'),
      N('Tam and Nettie sit together under a quilt and a blanket.'),
      N('Luna walks by with her lantern. She keeps an eye on them.'),
      N('Clover’s lamp is still on. Grown-ups are watching over them.'),
      NETTIE('Tam. What if he isn’t coming?', 'sad'),
      TAM('He’s coming! If he comes… oh. I said “if”.', 'sad'),
      N('Tam hides under his quilt. Nettie pats it. Pat, pat.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'grown-ups should know where you are',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'notice',
        after: 3,
        lines: [
          N('Tam and Nettie aren’t alone. Grown-ups know where they are.'),
          N('It’s good to tell a grown-up where you’ll be.'),
        ],
        parentNote: 'Heard why it matters that a grown-up always knows where you are.',
      },
    ],
  ),
  sc(
    's31-midnight-wisp',
    [
      N('Just after midnight, a thin grey animal creeps out.'),
      N('One of his ears is torn.'),
      N('He takes Tam’s toffee apple. Crunch, crunch!'),
      TAM('Is that him?', 'soft'),
      NETTIE('That’s a thief.'),
      N('It’s Wisp. He licks his lips and slips back under the hedge.'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'taking without asking is not fair; sharing with the hungry is kind',
        standard: 'D2.Civ.8.K-2',
        kind: 'ask',
        after: 5,
        prompt: [N('Wisp took the apple without asking. Was that fair?')],
        options: [
          opt(
            'Not fair, but he was hungry',
            [N('Yes. Taking isn’t fair. But Wisp was hungry. We can share with hungry animals.')],
            true,
          ),
          opt('Yes, fair', [
            N('Taking without asking isn’t fair. But hungry animals need food, so we can share.'),
          ]),
        ],
        parentNote:
          'Thought about fairness: taking without asking, and sharing with someone hungry.',
      },
    ],
  ),
  sc(
    's31-shape-sable',
    [
      N('A grey shape rises out of the frosty grass.'),
      N('Tam says “Oh.” Then he faints. Flop!'),
      N('It’s Sable, the grey wild Nubbin. The cold can’t hurt her.'),
      N('She looks at Tam. Then she looks at you.'),
      N('She sits down beside you. Close.'),
      N('Sable says nothing. Her ears stay up.'),
      N('You don’t say anything either. You just sit together.'),
      N('Tam is all right. He’s fast asleep now.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'friends can be together without words',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'notice',
        after: 6,
        lines: [
          N('Sometimes friends don’t need words.'),
          N('Sitting close together can say, “I’m here.”'),
        ],
        parentNote: 'Talked about how sitting close can show you care, even without words.',
      },
    ],
  ),
  sc(
    's31-shape-away',
    [
      N('A round shape rises at the edge of the grass. Goggles! A scarf!'),
      N('Tam says “Oh.” Then he faints. Flop!'),
      N('You come back with a lantern before it’s light.'),
      N('Tam is asleep. Your Nubbin is asleep on top of him.'),
      NETTIE('Your Nubbin came out of the grass and Tam FAINTED!', 'angry'),
      NETTIE('I got no toffee. I sat in a field ALL NIGHT!', 'angry'),
    ],
    [
      {
        domain: 'sel',
        skill: 'what helps when someone is cross',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'ask',
        after: 5,
        prompt: [N('Nettie is very cross. What might help her?')],
        options: [
          opt(
            'Listen and say sorry',
            [N('Yes. Listening and saying sorry help cross feelings get smaller.')],
            true,
          ),
          opt('Laugh', [N('That might make her crosser! Listening and saying sorry help more.')]),
          opt('Walk away', [N('She might feel alone. Staying, listening and saying sorry help.')]),
        ],
        parentNote: 'Chose listening and saying sorry as ways to help a cross friend.',
      },
    ],
  ),
  sc(
    's31-four-sable',
    [
      FOUR_LANTERN,
      IVY('Four o’clock. I said four. Look at—'),
      N('Ivy sees Sable. For once, Ivy has nothing to say!'),
      N('Ivy lifts Tam up, quilt and all.'),
      N('She drops a blanket on you as she goes past.'),
      N('Sable doesn’t move. Only her ears turn. Swish.'),
      N('Off they go. Nettie carries the lantern, yawning.'),
    ],
    [
      {
        domain: 'science',
        skill: 'many animals turn their ears towards sounds',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'notice',
        after: 5,
        lines: [
          N('Many animals can turn their ears towards a sound, to hear it better.'),
          N('(Cup your hands behind your ears. Can you hear more?)'),
        ],
        parentNote:
          'Heard that many animals turn their ears to listen, and tried cupping their own.',
      },
    ],
  ),
  sc(
    's31-four-away',
    [
      FOUR_LANTERN,
      IVY('Four o’clock. I said four. Look at him.', 'angry'),
      N('Ivy lifts Tam up, quilt and all. He doesn’t wake.'),
      N('She has a blanket over her arm. She keeps it.'),
      IVY('Nettie. Home.'),
      N('Nettie stamps after them with the lantern. Stamp, stamp!'),
    ],
    [
      {
        domain: 'sel',
        skill: 'keeping a promise',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'notice',
        after: 2,
        lines: [
          N('Ivy said she’d come at four o’clock. And she came at four.'),
          N('She kept her promise this time!'),
        ],
        parentNote: 'Noticed Ivy keeping her promise to fetch Tam.',
      },
    ],
  ),
  sc(
    's31-light-sable',
    [
      N('Ivy gets Tam home and tucks him into bed.'),
      N('Sable stays beside you until the sky gets light.'),
      N('The sun peeks over the hill.'),
      N('Sable stands up. She shakes the frost off her back. Shake, shake!'),
      N('Then off she goes to find breakfast.'),
      N('Tam’s sign is still there. WELCOME GREAT GOURD.'),
    ],
    [SUN_MELTS(3)],
  ),
  sc(
    's31-promise-went',
    [
      N('Ned goes home. Tam looks at you. Then he looks away.'),
      TAM('I don’t need anybody. I can wait on my own.'),
      TAM('Nettie doesn’t count. She fell asleep.'),
      N('Tam goes home, holding his quilt up out of the mud.'),
      N('Next morning, there’s a new little sign in the grass.'),
      N('It says SEAT FOR A KEEPER. And then, small: IF.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'noticing what someone really feels',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 5,
        prompt: [
          N('Tam said he didn’t need anybody. But he made you a seat.'),
          N('How does he really feel?'),
        ],
        options: [
          opt(
            'He hopes you’ll come',
            [N('Yes. Tam’s words were cross. But the seat says, “Please come.”')],
            true,
          ),
          opt('He doesn’t care', [N('Look at the sign! He made a seat for you. He does care.')]),
        ],
        parentNote: 'Noticed that what Tam did showed his real feelings more than what he said.',
      },
    ],
  ),
  sc(
    's31-complete-strays',
    [
      MORNING,
      N('By his sign is a little heap of fruit.'),
      N('Three plums, two apples and one pear!'),
      TAM('He read my letter! It’s for the strays!', 'happy'),
      N('You put the fruit out at the edge of the Grove.'),
      N('By the next morning, it’s all gone. Yum!'),
      KEEPSAKES,
    ],
    [
      {
        domain: 'maths',
        skill: 'add small groups',
        standard: 'K.OA.A.1',
        kind: 'do',
        after: 2,
        check: 'edu:count:fruit:6',
        lines: [
          N('(Count the fruit together.)'),
          N('Three plums and two apples make five. And one pear. Six!'),
        ],
        parentNote: 'Added three plums, two apples and one pear to make six.',
      },
    ],
  ),
  sc(
    's31-complete-busy',
    [
      MORNING,
      N('There’s nothing there. Just the sign and the grass.'),
      TAM('Nothing! Because we said he needn’t come if he was busy.', 'think'),
      TAM('So he was busy. And he was polite back!', 'happy'),
      KEEPSAKES,
    ],
    [
      {
        domain: 'sel',
        skill: 'thinking about how others feel',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'notice',
        after: 3,
        lines: [
          N('Tam’s letter thought about how the Great Gourd might feel.'),
          N('Thinking about how others feel is kind.'),
        ],
        parentNote: 'Talked about thinking of how other people feel.',
      },
    ],
  ),
  sc(
    's31-ambient-tam',
    [TAM('I’m practising sitting. For next year. You have to start early.', 'think')],
    [
      {
        domain: 'health',
        skill: 'sitting still and calm',
        standard: 'ELOF: Perceptual, Motor, and Physical Development',
        kind: 'do',
        after: 0,
        check: 'edu:act:sit:still',
        lines: [
          N('(Sit very still with Tam. Count to five.)'),
          N('Well done! Sitting still is hard.'),
        ],
        parentNote: 'Practised sitting still for a count of five.',
      },
    ],
  ),
  sc(
    's31-ambient-ivy',
    [IVY('I’ve told Tam ten times the Great Gourd isn’t real. He keeps count.')],
    [
      {
        domain: 'maths',
        skill: 'count to 10',
        standard: 'K.CC.A.1',
        kind: 'do',
        after: 0,
        check: 'edu:count:to:10',
        lines: [
          N('(Count to ten with Ivy.)'),
          N('One, two, three… all the way to ten! Tam counted every one.'),
        ],
        parentNote: 'Counted to ten.',
      },
    ],
  ),
  sc(
    's31-ambient-ned',
    [NED('I gave my best rock away. Byte’s bringing me a new one!', 'happy')],
    [
      {
        domain: 'science',
        skill: 'rocks are different colours and textures',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'notice',
        after: 0,
        lines: [N('Rocks come in lots of colours. Some are speckly. Some are smooth.')],
        parentNote: 'Heard that rocks come in different colours and textures.',
      },
    ],
  ),
  sc(
    's31-ambient-nettie',
    [NETTIE('Next year I’m going guising. I’ve decided. Unless Tam says.')],
    [
      {
        domain: 'sel',
        skill: 'making your own choice',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'notice',
        after: 0,
        lines: [
          N('Nettie is making her own choice. Well, nearly!'),
          N('It’s fine to choose for yourself, and fine to change your mind.'),
        ],
        parentNote: 'Talked about making your own choices.',
      },
    ],
  ),
  sc(
    's31-ambient-lantern',
    [
      TAM('Did you see? The fourth lantern lit up by itself!', 'happy'),
      TAM('It was the Great Gourd. I told you that patch was special.', 'happy'),
      TAM('Ivy says he’s very late. I say he’s very careful.'),
    ],
    [
      {
        domain: 'science',
        skill: 'light helps us see in the dark',
        standard: '1-PS4-2',
        kind: 'notice',
        after: 0,
        lines: [N('A lantern gives light. Light helps us see in the dark.')],
        parentNote: 'Heard that we need light to see in the dark.',
      },
    ],
  ),
];

// ================================================================== the quest
export const EDU_S31_SPROUT: EduQuest[] = [
  {
    id: 'sprout:s31',
    of: 's31',
    band: 'sprout',
    title: 'The Great Gourd',
    goals: {
      's31-step1': {
        goal: 'Help Tam spell his letter.',
        hint: 'Tam is on the Grove wall, by the gate.',
      },
      's31-step2': {
        goal: 'Walk with the children to Fern’s gourd patch.',
        hint: 'Fern’s patch is next door, past the hens.',
      },
      's31-step3': {
        goal: 'Make a kind gourd lantern with Tam.',
        hint: 'Pick a small gourd. Give it round eyes and a smile.',
      },
      's31-step4': {
        goal: 'Watch Ned kick the ball.',
        hint: 'Ned is on the green at the end of the lane.',
      },
      's31-step5': {
        goal: 'Find out if Ned is asked to the party.',
        hint: 'Sparks is up a ladder by her workshop.',
      },
      's31-step6': {
        goal: 'Help Tam put up his sign.',
        hint: 'Tam is in the long grass by the fourth lantern post.',
      },
      's31-step7': {
        goal: 'Dress your Nubbin in goggles and a scarf.',
        hint: 'Tap your Nubbin. Choose Dress.',
      },
      's31-step8': {
        goal: 'Choose where to be on Gourd Night.',
        hint: 'Ivy, Sparks and Tam are all waiting. Pick one. The others will be fine.',
      },
      's31-step9': {
        goal: 'Find out what Ned got.',
        hint: 'Ned has something in his bag to show you.',
      },
      's31-step10': {
        goal: 'Help your Nubbin get to the party.',
        hint: 'Keep low by the hedges. Stay out of the frosty grass.',
      },
      's31-step11': {
        goal: 'It is midnight. Tam is still waiting.',
        hint: 'There is nothing to do but wait. Waiting can be hard.',
      },
      's31-step12': {
        goal: 'The frost comes before morning.',
        hint: 'Keep your Nubbins at the edge, out of the white grass.',
      },
      's31-step13': {
        goal: 'See Tam safely home.',
        hint: 'Ivy is coming at four o’clock, like she promised.',
      },
      's31-step14': {
        goal: 'Find Tam at the Grove wall.',
        hint: 'He is on the wall by the gate, where he wrote his letter.',
      },
    },
    scenes: SCENES,
    notes:
      'Sprout keeps every choice. Lessons: first sounds, counting (seeds, posts, rocks, hours, fruit, to ten), ' +
      'circles, syllables, seasons, how gourds grow, frost, owls, basalt, acorns, turnip lanterns, promises, ' +
      'kindness to someone who believes differently, and waiting.',
  },
];

/** Every `edu:` check string used in this file. */
export const CHECKS: string[] = [
  'edu:count:seeds:5',
  'edu:tap:shape:circle',
  'edu:clap:syllables:party',
  'edu:count:posts:4',
  'edu:tap:colour:red',
  'edu:count:rocks:5',
  'edu:act:fly:arms',
  'edu:clap:tempo:fast-slow',
  'edu:count:hours:4',
  'edu:order:seasons',
  'edu:count:fruit:6',
  'edu:act:sit:still',
  'edu:count:to:10',
];
