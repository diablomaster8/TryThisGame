/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): new side stories, set A.
 *
 * Sources: side-stories-new-1.ts (S11 The Blight, S15 Lucky Eggs, S16 The Workyard) and
 * side-stories-new-2.ts (S12 The Hum, S17 Nightjar, S18 The Grove Museum). One EduScene per
 * original scene, id `sprout:<original id>`. See EDU-STYLE.md.
 *
 * - Choice ids and `set` flags are copied from the originals so every flag still works.
 * - Left out for this age: S11's “stand between her and the torch” (`stand`), which models
 *   facing down fire. s11-dusk has `defaultChoice: 'map'`. S11's “together” is kept, rewritten so
 *   the grown-ups burn only the three poorly trees while the child watches from far back.
 * - Hard things follow EDU-STYLE.md: Fossil and the Queen-Mother die, said plainly; Nightjar’s
 *   own chicks died in a cold spring long ago, said plainly, with what helps. Corvin hints (the
 *   Circuit sticker, “I’m no Circuit man”, “twenty-two years”) are left out for this band.
 * - S12’s `own` choice renames Solo; no lesson depends on the letters of the name “Solo”.
 * - Every fact in a lesson or a plaque line is well established (insects have six legs, the
 *   seven-spot ladybird, humming is vibration, owls’ quiet flight, moulting, the Plough’s seven
 *   stars, the Pole Star, the Moon’s one face, owl pellets, hermit crabs, sea stars’ regrowth).
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
const FE = say('fern');
const SP = say('sparks');
const CL = say('clover');
const EM = say('ember');
const BY = say('byte');
const LU = say('luna');
const PX = say('pixel');
const NO = say('nova');
const DU = say('dusty');
const MA = say('marina');
// new speakers (declared in the source quests)
const DA = say('dashwood');
const JP = say('jackpot');
const PI = say('pip');
const KD = say('kids');
const BK = say('brisk');
const TH = say('thrums');
const SO = say('solo');
const QM = say('queen-mother');
const NJ = say('nightjar');
const DE = say('delve');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

/** One answer option. `best` marks the answer the lesson teaches. */
const opt = (label: string, reply: Line[], best = false): Opt => (best ? { label, best, reply } : { label, reply });

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
  lessons: [...beats].sort((a, b) => a.after - b.after).map((b, i) => ({ id: `sprout:${of}-l${i + 1}`, ...b })),
});

const quest = (
  of: string,
  title: string,
  goals: EduQuest['goals'],
  scenes: EduScene[],
  notes?: string,
): EduQuest => ({ id: `sprout:${of}`, of, band: 'sprout', title, goals, scenes, ...(notes ? { notes } : {}) });

// ================================================================== S11 The Blight
const S11: EduQuest = quest(
  's11',
  'The Blight',
  {
    's11-step1': {
      goal: 'Go next door. Look at Fern’s poorly plum trees.',
      hint: 'Go through the gap in the hedge. The poorly trees are at the bottom of the hill.',
    },
    's11-step2': {
      goal: 'Look at every tree with Byte’s magnifying glass.',
      hint: 'Look at a leaf, the bark and the fruit. Then pick a tag. You can always look again.',
    },
    's11-step3': {
      goal: 'Catch one of the tiny bugs on the leaves.',
      hint: 'Keep the sun in front of you, so your shadow stays behind you. Don’t look right at the sun.',
    },
    's11-step4': {
      goal: 'Help Clover let the ladybirds go in the hedge.',
      hint: 'Open the jar by the old dead tree. Then step back and keep still.',
    },
  },
  [
    sc(
      's11-fern',
      [
        N('Fern is at your gate. It is very early.'),
        N('She holds out a plum. It has black spots.'),
        FE('Don’t touch it. Just look.', 'sad'),
        N('She tips her hand. Squish! The plum goes soft and dusty.'),
        FE('Three of my trees look like this. They were fine yesterday.'),
        FE('Hazel helped me plant these trees. Years ago.', 'soft'),
        FE('I haven’t told anyone. I’m too worried.', 'sad'),
      ],
      [
        {
          domain: 'sel',
          skill: 'telling someone when you are worried',
          standard: 'ELOF: Social and Emotional Development',
          kind: 'ask',
          after: 6,
          prompt: [N('Fern is worried. What could help her?')],
          options: [
            opt('Tell a friend about it', [FE('You’re right. Telling someone helps. And I just told you!', 'happy')], true),
            opt('Keep it a secret', [FE('Secrets make worries feel bigger. Telling you helps already.', 'soft')]),
            opt('Pretend it isn’t there', [FE('I tried that. The plums are still spotty! Telling helps more.', 'think')]),
          ],
          parentNote: 'Talked about what helps a worried friend: telling someone they trust.',
        },
      ],
      {
        choices: [
          {
            id: 'look',
            label: 'Go and look now.',
            set: { 's11-first': 'look' },
            then: [N('You go through the hedge. Fern follows, slowly.')],
          },
          {
            id: 'comfort',
            label: 'Give her a hug first.',
            set: { 's11-first': 'comfort' },
            then: [FE('Oh! Thank you. That helps a bit.', 'soft'), N('Then she marches off through the hedge.')],
          },
          {
            id: 'byte',
            label: 'Say you’ll fetch Byte.',
            set: { 's11-first': 'byte' },
            then: [FE('Byte! Yes. Byte loves a puzzle.', 'think')],
          },
        ],
      },
    ),
    sc(
      's11-ember',
      [
        N('Three trees at the bottom are poorly.'),
        N('Their leaves are curled up and black.'),
        N('Ember is at the wall. Her arms are folded tight.'),
        EM('Burn them all! Tonight! Before it spreads!', 'angry'),
        FE('All of them? There are forty trees!', 'shock'),
        CL('Wait. We don’t know what it is yet.', 'soft'),
        EM('I waited once, and I lost my Ash.', 'sad'),
        N('Fern sits down on a box. She is very quiet.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'more and fewer',
          standard: 'K.CC.C.6',
          kind: 'ask',
          after: 4,
          prompt: [
            CL('Lots of trees are green and well. Only three are poorly.'),
            CL('Are there more well trees, or more poorly trees?', 'think'),
          ],
          options: [
            opt('More well trees', [CL('Yes! Lots and lots of well trees. Only three poorly ones.', 'happy')], true),
            opt('More poorly trees', [CL('Let’s look again. Only three are poorly. Lots more are well!')]),
          ],
          parentNote: 'Compared two groups and saw that the big group of healthy trees had more.',
        },
      ],
    ),
    sc(
      's11-lens',
      [
        N('Byte runs up. He has a magnifying glass on a string.'),
        BY('Nobody burns anything till we look properly.', 'think'),
        EM('You have till sunset. Then I’m doing it.', 'angry'),
        BY('This glass makes little things look big.'),
        N('Byte ties a tag on each tree. NOT FINE. FINE. PROBABLY FINE.'),
        BY('Look at the leaf, the bark and the fruit.'),
        BY('And don’t lick anything! I have to say that.', 'think'),
        CL('This branch looks lonely. Can I give it a bandage?', 'soft'),
        BY('It isn’t hurt. It’s a branch.'),
      ],
      [
        {
          domain: 'science',
          skill: 'parts of a tree: leaf, bark, fruit',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'do',
          after: 5,
          check: 'edu:point:tree-parts:leaf-bark-fruit',
          lines: [
            N('(Point to a leaf. Now the bark. Now a plum.)'),
            BY('Leaf, bark, fruit. A plum tree has all three.', 'happy'),
          ],
          parentNote: 'Named three parts of a fruit tree: leaf, bark and fruit.',
        },
      ],
    ),
    sc(
      's11-map',
      [
        N('By the afternoon, every tree has a tag.'),
        N('Three trees say NOT FINE. They are all in a row.'),
        BY('Look! The poorly trees are all where the wind blows.', 'think'),
        BY('Something came on the wind. Something tiny.'),
        Y('What is in the wind?'),
        BY('Good question. I have a jar!', 'happy'),
      ],
      [
        {
          domain: 'science',
          skill: 'wind can carry light things',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'do',
          after: 3,
          check: 'edu:blow:wind:tissue',
          lines: [
            N('(Hold up a tissue or a leaf. Blow gently: whoosh!)'),
            BY('See? Moving air pushes light things. Wind can carry tiny bugs too.'),
          ],
          parentNote: 'Blew on something light to see how wind can carry small, light things.',
        },
      ],
    ),
    sc(
      's11-jar',
      [
        N('Byte gives you a jam jar with a cloth lid.'),
        N('Clover gives you another one. Just in case.'),
        N('You crouch in the long grass. The sun is warm.'),
        N('A tiny grey bug lands on a leaf.'),
        N('Your shadow touches the leaf. Plop! The bug drops away.'),
        CL('Shy things hide from shadows. Keep the sun in front of you.', 'soft'),
        CL('Then your shadow stays behind you. Never look right at the sun!'),
        EM('Or we could just burn it all.', 'angry'),
        N('But Ember stays. She watches every try.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'keeping still and calm; patience',
          standard: 'CASEL: Self-management',
          kind: 'do',
          after: 6,
          check: 'edu:keep:still:count-5',
          lines: [
            CL('Let’s be still as a stone. Count to five, slowly.'),
            N('(Count slowly together: one… two… three… four… five.)'),
            CL('Still and slow. That’s how you catch shy things.', 'happy'),
          ],
          parentNote: 'Practised keeping their body still and calm while counting slowly to five.',
        },
      ],
    ),
    sc(
      's11-beetle',
      [
        N('Got it! A tiny grey beetle in the jar.'),
        N('It is no bigger than a lentil.'),
        BY('It’s covered in black dust. That’s the poorly stuff!', 'shock'),
        BY('The black dust rides on the beetle. Like a bus!', 'happy'),
        BY('The beetle isn’t sick. It gives the dust a ride.'),
        N('Byte follows the wind. He finds an old dead tree, full of beetles.'),
        BY('Only the trees near this one get poorly. The rest are safe!', 'happy'),
        CL('I have ladybirds at home. Ladybirds eat beetle eggs!', 'happy'),
        CL('Look! One tree in the poorly row is fine.', 'shock'),
        FE('That’s Grudge. Hazel’s old tree. It has the sourest plums.', 'think'),
        N('Byte puts a new tag on the jar. It says: GUILTY.'),
      ],
      [
        {
          domain: 'science',
          skill: 'insects have six legs',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'do',
          after: 1,
          check: 'edu:count:legs:6',
          lines: [
            N('(Look closely. Count the beetle’s legs together.)'),
            BY('One, two, three, four, five, six. Six legs!'),
            BY('Beetles are insects. Every insect has six legs.', 'happy'),
          ],
          parentNote: 'Counted a beetle’s legs and learned that all insects have six legs.',
        },
      ],
    ),
    sc(
      's11-dusk',
      [
        N('The sun goes down. Bats fly over the stream.'),
        N('A light comes through the hedge. It’s Ember, with a burning torch.'),
        EM('I’m sorry, Fern. I can’t wait.', 'sad'),
        EM('I waited once, for Ash. I waited too long.', 'sad'),
        N('Ember’s face looks cross. But inside, she is scared.'),
        N('Byte holds the map. Clover holds Fern’s hand.'),
        N('Everybody looks at you.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'naming feelings: scared can look like cross',
          standard: 'CASEL: Social awareness',
          kind: 'ask',
          after: 4,
          prompt: [N('Ember looks cross. What is she really feeling?')],
          options: [
            opt('Scared', [CL('Yes. Ember is scared of losing the trees. Scared can look cross.', 'soft')], true),
            opt('Happy', [CL('Look at her face. Not happy. She’s scared. Scared can look cross.', 'soft')]),
            opt('Silly', [CL('Not silly. She’s scared. Sometimes scared looks cross.', 'soft')]),
          ],
          parentNote: 'Noticed that a person who looks cross may really be feeling scared.',
        },
      ],
      {
        defaultChoice: 'map',
        choices: [
          {
            id: 'map',
            label: 'Show her Byte’s map, kindly.',
            set: { 's11-dusk': 'map' },
            then: [
              N('You hold out the map. Ember reads it by torchlight.'),
              EM('Three trees. Not forty. Just three.', 'think'),
              N('She dips the torch in the water butt. Hiss! It goes out.'),
              EM('Show me the old tree. I’ll help.', 'soft'),
            ],
          },
          {
            id: 'together',
            label: 'Ask the grown-ups to burn only the poorly trees, safely.',
            set: { 's11-dusk': 'together' },
            then: [
              N('Ember nods. Fern helps her. They go very carefully.'),
              N('They burn only the three poorly trees and the old dead tree.'),
              N('You stay far back with Clover. Fire is for grown-ups.'),
              EM('Not on my own this time. Not in a rush.', 'soft'),
              N('Fern brings out tea. The fire gets small, then goes out.'),
            ],
          },
        ],
      },
    ),
    sc(
      's11-ladybirds',
      [
        N('Clover opens her jar.'),
        N('Out come ladybirds! Hundreds of them, red as berries.'),
        CL('Ladybirds eat tiny bugs that hurt plants. Gardeners love them.', 'happy'),
        CL('Off you go, ladybirds! Gobble up the beetle eggs!', 'happy'),
        N('One lands on your thumb. Then three more.'),
        BY('I tried to tag them all. They’re all called LADYBIRD now.', 'think'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 7',
          standard: 'K.CC.B.5',
          kind: 'do',
          after: 4,
          check: 'edu:count:spots:7',
          lines: [
            N('(Look at the ladybird on your thumb. Count its spots together.)'),
            CL('One, two, three, four, five, six, seven. Seven spots!', 'happy'),
            CL('This kind is called a seven-spot ladybird.'),
          ],
          parentNote: 'Counted seven spots and met the seven-spot ladybird, a gardener’s friend.',
        },
      ],
    ),
    sc(
      's11-complete',
      [
        N('A week later, the orchard is quiet and green.'),
        N('Three old stumps. Lots and lots of happy trees.'),
        N('In the middle stands Grudge, full of sour purple plums.'),
        FE('The beetles don’t like Grudge. Too bitter for them!', 'happy'),
        FE('This was Hazel’s. A little knife for joining trees.', 'soft'),
        FE('It’s sharp. We’ll use it together, you and me.'),
        FE('You saved my orchard. You’re the Orchard Warden now!', 'happy'),
        N('Byte had put a tag on Ember. It said CROSS.'),
        N('He crosses it out. He writes: SCARED.'),
        EM('…Yes. That’s me. Scared.', 'soft'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'taste words: sour and sweet',
          standard: 'RL.1.4',
          kind: 'do',
          after: 2,
          check: 'edu:make:face:sour',
          lines: [
            N('(Make a sour face together! Now a sweet, happy face.)'),
            FE('Sour like a lemon. Sweet like a strawberry. Grudge is sour!', 'happy'),
          ],
          parentNote: 'Acted out the taste words “sour” and “sweet”.',
        },
        {
          domain: 'health',
          skill: 'staying safe with sharp things',
          standard: 'CASEL: Responsible decision-making',
          kind: 'ask',
          after: 5,
          prompt: [FE('Who should help when we use something sharp?', 'think')],
          options: [
            opt('A grown-up', [FE('Yes. Sharp things need a grown-up. Then everyone stays safe.', 'happy')], true),
            opt('Nobody', [FE('Ouch, no! Sharp things can cut. A grown-up helps every time.', 'soft')]),
            opt('A Nubbin', [FE('Ha! Nubbins have no hands for knives. A grown-up helps.', 'happy')]),
          ],
          parentNote: 'Learned that a grown-up always helps when something sharp is used.',
        },
      ],
    ),
  ],
  'Sprout leaves out s11-dusk’s “stand” (facing down a torch); defaultChoice is “map”. In “together”, ' +
    'grown-ups burn only the poorly trees and the child watches from far back.',
);

// ================================================================== S15 Lucky Eggs
const S15: EduQuest = quest(
  's15',
  'Lucky Eggs',
  {
    's15-step1': {
      goal: 'Help Byte count what comes out of the Mystery Eggs.',
      hint: 'Stand by the wagon. Each time an egg opens, tap PLAIN or SPARKLY.',
    },
    's15-step2': {
      goal: 'Tiptoe to the wagon and talk to Jackpot the parrot.',
      hint: 'Dashwood is having a nap. Go along the stream stones. Don’t touch the wagon, or the bells ring!',
    },
    's15-step3': {
      goal: 'Shine a light through the special egg to see inside.',
      hint: 'Go somewhere dim, like under the bridge. Hold the egg in front of the lantern.',
    },
    's15-step4': {
      goal: 'Make an honest egg stall with Byte.',
      hint: 'Put the stall by the bridge or by your gate. Byte writes the true numbers on the board.',
    },
  },
  [
    sc(
      's15-wagon',
      [
        N('A wagon rolls down the lane. Ting-a-ling! Bells on the roof!'),
        N('A man in a yellow waistcoat sits on top. That’s Dashwood Prance.'),
        N('A brass parrot sits on his shoulder. Tick, tick, tick.'),
        DA('Mystery Eggs! Every egg a winner!', 'happy'),
        JP('MOST EGGS ARE PLAIN.'),
        DA('Thank you, Jackpot.', 'happy'),
        N('A big sign says: ONE IN THREE IS SPARKLY!'),
        KD('Sparkly! Sparkly! Sparkly!', 'happy'),
        N('A little girl from the village jingles her purse. That’s Pip.'),
        BY('Is that true? Let’s count every egg and see.', 'think'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'hearing rhymes',
          standard: 'RF.K.2',
          kind: 'ask',
          after: 8,
          prompt: [PI('Egg, egg, I love an egg!', 'happy'), PI('What rhymes with egg?', 'think')],
          options: [
            opt('leg', [PI('Yes! Egg, leg. They rhyme!', 'happy')], true),
            opt('bell', [PI('Bell rhymes with shell! Egg rhymes with leg.')]),
            opt('wagon', [PI('Egg… wagon. No! Egg rhymes with leg.', 'happy')]),
          ],
          parentNote: 'Listened for a rhyme: egg and leg.',
        },
      ],
      {
        choices: [
          {
            id: 'buy',
            label: 'Buy an egg yourself. Let’s see!',
            set: { 's15-bought': true },
            then: [
              DA('A Keeper! Choose with your heart!', 'happy'),
              N('You choose one. It’s plain. Jackpot says nothing, very loudly.'),
              BY('That’s one egg. Let’s keep counting.'),
            ],
          },
          {
            id: 'pip',
            label: 'Ask Pip to wait before she spends it all.',
            set: { 's15-pip': 'asked' },
            then: [PI('Wait? But the sparkly ones might run out!', 'shock'), JP('THEY WILL NOT RUN OUT.')],
          },
          {
            id: 'odds',
            label: 'Ask Dashwood how he knows.',
            set: { 's15-asked': true },
            then: [
              DA('I know it in my heart, friend!', 'happy'),
              BY('Numbers don’t live in hearts. They live in counting.', 'think'),
            ],
          },
        ],
      },
    ),
    sc(
      's15-tally',
      [
        PI('I saved my Shells! I can buy four eggs!', 'happy'),
        N('By lunchtime, Byte’s card is full.'),
        BY('Lots and lots of plain eggs. Only three sparkly ones.', 'think'),
        BY('That’s not one in three. The sign is wrong.'),
        N('Pip sits on the bridge with four plain eggs.'),
        N('She is trying hard to be brave.'),
        PI('The plain ones are nice too. They’re warm.', 'sad'),
      ],
      [
        {
          domain: 'maths',
          skill: 'more and fewer',
          standard: 'K.CC.C.6',
          kind: 'ask',
          after: 2,
          prompt: [BY('Plain eggs or sparkly eggs: which are there more of?', 'think')],
          options: [
            opt('Plain eggs', [BY('Yes! Many more plain eggs than sparkly ones.', 'happy')], true),
            opt('Sparkly eggs', [BY('Look again. Only three sparkly. Lots and lots of plain. More plain!')]),
          ],
          parentNote: 'Compared two groups and saw there were more plain eggs than sparkly ones.',
        },
      ],
    ),
    sc(
      's15-sneak',
      [
        BY('Jackpot always tells the truth. Let’s ask him.', 'think'),
        N('After lunch, Dashwood has a nap. Snore… snore…'),
        N('Jackpot sits in the window. Tick, tick, tick.'),
        BY('Don’t touch the wagon. All the bells will ring!'),
        N('There are stepping stones by the stream.'),
        N('One stone wobbles. One stone is a frog! Ribbit!'),
      ],
      [
        {
          domain: 'health',
          skill: 'moving slowly and quietly',
          standard: 'ELOF: Perceptual, Motor, and Physical Development',
          kind: 'do',
          after: 4,
          check: 'edu:tiptoe:steps:5',
          lines: [
            N('(Let’s tiptoe! Five tiny, quiet steps together.)'),
            N('(Count them: one, two, three, four, five.)'),
            BY('Quiet feet! Like a cat.', 'happy'),
          ],
          parentNote: 'Controlled their body to take five slow, quiet tiptoe steps.',
        },
      ],
    ),
    sc(
      's15-jackpot',
      [
        JP('HELLO. I CANNOT LIE. IT IS MY SPRINGS.'),
        Y('How many eggs are sparkly, Jackpot?'),
        JP('TEN EGGS. ONE SPARKLY. NINE PLAIN. HE WROTE IT DOWN.'),
        N('Byte holds up ten fingers. He folds down nine.'),
        BY('And the big sign?', 'think'),
        JP('HE SAYS THE SIGN IS A POEM. A POEM IS NOT A NUMBER.'),
        JP('ALSO THE SPECIAL EGG IS NOT SPECIAL. OOPS.'),
        N('The snoring stops. You freeze! Then it starts again.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'honesty: telling the truth is fair',
          standard: 'CASEL: Responsible decision-making',
          kind: 'ask',
          after: 6,
          prompt: [BY('The sign says something that isn’t true. Is that fair?', 'think')],
          options: [
            opt('No, it isn’t fair', [BY('Right. The truth is fair. Then people can choose.', 'happy')], true),
            opt('Yes, it’s fine', [BY('Hmm. Pip spent her Shells because of that sign. Not fair to Pip.', 'soft')]),
          ],
          parentNote: 'Talked about why telling the truth is fair to other people.',
        },
      ],
    ),
    sc(
      's15-legendary',
      [
        N('Dashwood wakes up. He shines the special egg.'),
        DA('Lovely, isn’t she? Hold her for one Shell a minute!', 'happy'),
        BY('Here are three Shells. Three minutes, please.', 'think'),
        N('Under the bridge, it is dim and green.'),
        N('Byte lights a little lantern.'),
        BY('Light behind an egg shows what’s inside. Hazel taught us.'),
      ],
      [
        {
          domain: 'science',
          skill: 'light can shine through thin things',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'do',
          after: 5,
          check: 'edu:shine:light:fingers',
          lines: [
            N('(With a grown-up, shine a torch through your fingers.)'),
            N('(Look! Your fingers glow pink. Light shines through thin things.)'),
            BY('Eggshells are thin too. Let’s look!', 'happy'),
          ],
          parentNote: 'Shone a torch through their fingers to see that light passes through thin things.',
        },
      ],
    ),
    sc(
      's15-painted',
      [
        N('The light shines through the egg. Glitter sparkles everywhere.'),
        N('But the egg inside is plain pink. Something little is moving!'),
        BY('It’s a plain egg with paint on! There’s a big thumbprint.', 'shock'),
        BY('It’s a healthy egg, though. It will hatch in a week.', 'soft'),
        N('Glitter gets on your fingers. It stays for days!'),
      ],
      [
        {
          domain: 'maths',
          skill: 'a week is seven days; show 7',
          standard: 'K.CC.B.4',
          kind: 'do',
          after: 3,
          check: 'edu:show:fingers:7',
          lines: [
            N('(A week is seven days. Hold up seven fingers together.)'),
            BY('Seven days. Then, crack! A baby Nubbin.', 'happy'),
          ],
          parentNote: 'Learned that a week is seven days and showed seven on their fingers.',
        },
      ],
    ),
    sc(
      's15-verdict',
      [
        N('Dashwood sees the glitter on your hands.'),
        N('He sits down on the wagon step.'),
        DA('When I was little, I bought a golden egg.', 'soft'),
        DA('I carried it home in my hat. I loved it.', 'soft'),
        DA('It hatched brown. It had been painted.', 'think'),
        DA('But I loved that brown baby anyway. So much.', 'happy'),
        JP('HE MEANS IT. I CANNOT LIE.'),
        N('The children wait. Pip holds her four plain eggs.'),
      ],
      [
        {
          domain: 'social-studies',
          skill: 'fairness: putting things right, kindly',
          standard: 'D2.Civ.8.K-2',
          kind: 'ask',
          after: 7,
          prompt: [BY('The sign wasn’t true. How can we make it fair?', 'think')],
          options: [
            opt('Tell the truth, kindly', [BY('Yes. Kind and true. That fixes things best.', 'happy')], true),
            opt('Shout at Dashwood', [BY('Shouting makes people sad and cross. Kind and true works better.', 'soft')]),
            opt('Do nothing', [BY('Then Pip loses her Shells. Let’s be kind and true.', 'soft')]),
          ],
          parentNote: 'Thought about how to make an unfair thing fair by being truthful and kind.',
        },
      ],
      {
        choices: [
          {
            id: 'expose',
            label: 'Show everyone the count and the painted egg.',
            set: { 's15-verdict': 'exposed' },
            then: [
              N('You hold up the painted egg. Byte reads the count.'),
              KD('One in TEN? That’s not fair!', 'angry'),
              DA('It was only a poem. I’m sorry.', 'sad'),
              N('Dashwood drives away before dark.'),
              N('He leaves a table, a box of eggs, and Jackpot.'),
              JP('I DID NOT WANT TO GO. I CANNOT LIE.'),
            ],
          },
          {
            id: 'refund',
            label: 'Ask him to give the Shells back and fix the sign.',
            set: { 's15-verdict': 'refunded' },
            then: [
              DA('Give them back? Oh… all right.', 'shock'),
              N('He counts the Shells back into small hands. One by one.'),
              N('He changes the sign. Now it says ONE IN TEN.'),
              PI('I’m keeping one egg. I don’t mind if it’s plain!', 'happy'),
              N('Jackpot stays with you. Everybody agrees.'),
            ],
          },
          {
            id: 'buy',
            label: 'Buy his wagon. Run an honest stall yourself.',
            set: { 's15-verdict': 'bought' },
            then: [
              DA('Buy Marigold? My wagon? Hmm. How much?', 'think'),
              N('Byte does the sums. Byte loves doing sums.'),
              DA('Polish her once a year. And keep her away from goats!', 'sad'),
              N('He walks off down the lane, whistling.'),
            ],
          },
        ],
      },
    ),
    sc(
      's15-odds-board',
      [
        N('Byte puts up a board. He writes in big chalk letters.'),
        N('PLAIN: 9 IN 10. SPARKLY: 1 IN 10.'),
        N('Underneath, smaller: ALL OF THEM ARE WARM.'),
        PI('Why do I like this board better?', 'think'),
        BY('Because it’s true. True feels good.', 'happy'),
        N('Some children buy eggs. Some just come to read the board.'),
      ],
      [
        {
          domain: 'maths',
          skill: '9 and 1 make 10',
          standard: 'K.OA.A.1',
          kind: 'do',
          after: 1,
          check: 'edu:show:fingers:9-and-1',
          lines: [
            N('(Hold up ten fingers. Fold one down for the sparkly egg.)'),
            BY('How many are still up? Nine! Nine plain, one sparkly. Ten eggs.', 'happy'),
          ],
          parentNote: 'Used ten fingers to see that 9 and 1 make 10.',
        },
      ],
    ),
    sc(
      's15-complete',
      [
        N('The last egg is wrapped in a red spotty hanky.'),
        N('You unwrap it. It glows all over, like a pearl!'),
        JP('THAT ONE IS REAL. I CHECKED. TWICE.'),
        N('A card says: For the Keeper. This one really is a winner.'),
        N('Jackpot hops onto your shoulder. Tick, tick.'),
        JP('I WOULD LIKE TO LIVE WITH YOU. I CANNOT LIE.'),
        N('Dashwood gave Pip the painted egg as he left.'),
        N('Pip takes the painted egg home in her hat.'),
        N('A week later, it hatches. It is brown as a boot.'),
        N('Pip loves it more than anything.'),
      ],
      [
        {
          domain: 'art',
          skill: 'naming and finding a colour: brown',
          kind: 'do',
          after: 8,
          check: 'edu:find:colour:brown',
          lines: [
            N('(Can you find something brown near you? Point to it!)'),
            N('Brown like a boot. Brown like Pip’s new Nubbin.'),
          ],
          parentNote: 'Named the colour brown and found something brown nearby.',
        },
        {
          domain: 'sel',
          skill: 'loving friends just as they are',
          standard: 'CASEL: Social awareness',
          kind: 'notice',
          after: 9,
          lines: [
            N('Pip’s Nubbin isn’t sparkly. Pip doesn’t mind one bit.'),
            N('We love our friends just as they are.'),
          ],
          parentNote: 'Heard that friends are loved for who they are, not for being fancy.',
        },
      ],
    ),
  ],
  'All choices kept; “expose” is softened (the children are cross, nobody kicks anything). The Circuit sticker ' +
    'and the bulk buyer up the valley are left out for this band.',
);

// ================================================================== S16 The Workyard
const S16: EduQuest = quest(
  's16',
  'The Workyard',
  {
    's16-step1': {
      goal: 'Walk up the river with Sparks and Clover to the Workyard.',
      hint: 'Follow the river path. Listen for the saws: bzzz!',
    },
    's16-step2': {
      goal: 'Watch the Workyard Nubbins quietly. What do they like to do?',
      hint: 'Hide behind the log piles. If a Nubbin sees you, it works to be polite. Just try again!',
    },
    's16-step3': {
      goal: 'Make a Fair Roster. Each Nubbin picks the job it likes.',
      hint: 'Put each Nubbin’s card under the job it chose. Then hold Sparks’s ladder.',
    },
    's16-step4': {
      goal: 'Go back to the Workyard in a week. How is it going?',
      hint: 'Wait seven days. Then follow the river path. Brisk will have the kettle on.',
    },
  },
  [
    sc(
      's16-sparks',
      [
        N('Sparks arrives with wire looped over both shoulders.'),
        SP('Job up the river! A sawmill needs lights!', 'happy'),
        SP('I need someone to hold the ladder and say “wow”.'),
        CL('I’m not good with ladders. I’m good at not falling off.', 'think'),
        N('You can hear the saws far away. Bzzz! Like wasps.'),
        SP('Brisk says his Nubbins love it there. He wrote it twice!'),
        CL('Twice is a lot.', 'think'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'sound words',
          standard: 'RL.1.4',
          kind: 'do',
          after: 4,
          check: 'edu:say:sound-word:bzzz',
          lines: [N('(Make the saw sound together: bzzzzz!)'), SP('Bzzz! That’s a sound word. Say it loud!', 'happy')],
          parentNote: 'Said a sound word (“bzzz”) that sounds like what it names.',
        },
      ],
    ),
    sc(
      's16-yard',
      [
        N('The Workyard! Sheds, logs and lots of busy Nubbins.'),
        N('Each one wears a tiny yellow hard hat.'),
        N('A sign says: WORK IS PLAY!'),
        N('Three Nubbins run inside a big wooden wheel. Round and round.'),
        BK('Welcome! I’m Brisk Hollins! My Nubbins love working!', 'happy'),
        N('A big Nubbin carries a log on his back. He hums. That’s Lug.'),
        BK('Lug’s my best worker. I can’t stop him!', 'happy'),
        N('Behind the logs sit five Nubbins. Their colours look faded.'),
        CL('Those ones are tired. Not lazy. Tired.', 'soft'),
      ],
      [
        {
          domain: 'health',
          skill: 'tired bodies need rest',
          standard: 'ELOF: Perceptual, Motor, and Physical Development',
          kind: 'ask',
          after: 8,
          prompt: [CL('What does a tired body need?', 'think')],
          options: [
            opt('Rest', [CL('Yes. Rest helps a tired body feel better.', 'happy')], true),
            opt('More work', [CL('More work makes tired bodies more tired. Rest helps.', 'soft')]),
            opt('Run faster', [CL('Running makes us puff! A tired body needs rest.', 'soft')]),
          ],
          parentNote: 'Learned that when our bodies are tired, they need rest.',
        },
      ],
    ),
    sc(
      's16-shadow',
      [
        BK('Tired? Nonsense! Look at my chart!', 'happy'),
        N('His chart line goes up so high it runs off the paper!'),
        CL('That chart is about logs. I’m asking about Nubbins.', 'think'),
        SP('Brisk, what do they do when nobody’s watching?', 'think'),
        N('Brisk opens his mouth. Then he shuts it. He doesn’t know!'),
        BK('Good question! Go and find out!'),
        CL('Hide where they can’t see you. Or they’ll work to be polite.', 'soft'),
      ],
      [
        {
          domain: 'maths',
          skill: 'position words: behind, beside, under',
          standard: 'K.G.A.1',
          kind: 'do',
          after: 6,
          check: 'edu:point:position:behind',
          lines: [
            N('(Where can you hide? Behind the log pile! Point behind you.)'),
            CL('Behind the logs. Beside the shed. Under the bench. Good hiding places.'),
          ],
          parentNote: 'Used the position words behind, beside and under.',
        },
      ],
      {
        choices: [
          {
            id: 'lug',
            label: 'Watch Lug first.',
            set: { 's16-first': 'lug' },
            then: [N('Lug sees you. He picks up a bigger log, to show off!'), N('You’ll need to be sneakier.')],
          },
          {
            id: 'tired',
            label: 'Watch the tired ones first.',
            set: { 's16-first': 'tired' },
            then: [CL('Good. Start with the ones nobody’s counting.', 'soft')],
          },
          {
            id: 'wheel',
            label: 'Watch the big wheel first.',
            set: { 's16-first': 'wheel' },
            then: [SP('That wheel! It’s wired backwards, for a start.', 'angry')],
          },
        ],
      },
    ),
    sc(
      's16-notes',
      [
        N('By sunset, your clipboard is full.'),
        N('The choppers chop even on their breaks. They like the thunk!'),
        N('The wheel runners sneak out and hide under the bench.'),
        N('The five tired ones just lie in the sun.'),
        N('And Lug carries little planks out to the reeds.'),
        N('You follow him. In the reeds is a tiny house!'),
        N('The five tired Nubbins are asleep inside.'),
        CL('He built them a house!', 'shock'),
        SP('Nobody asked him to. He just did.', 'soft'),
      ],
      [
        {
          domain: 'sel',
          skill: 'noticing kindness and how others feel',
          standard: 'CASEL: Social awareness',
          kind: 'ask',
          after: 8,
          prompt: [CL('How do the tired Nubbins feel in their little house?', 'think')],
          options: [
            opt('Safe and cosy', [CL('Yes. Lug made them feel safe. That’s real kindness.', 'happy')], true),
            opt('Cross', [CL('I don’t think so. They’re snoozing! They feel safe and cosy.', 'soft')]),
            opt('Scared', [CL('Look how they snuggle. They feel safe. Lug was kind.', 'soft')]),
          ],
          parentNote: 'Noticed a kind act and thought about how it made others feel.',
        },
      ],
    ),
    sc(
      's16-roster',
      [
        N('You show Brisk the clipboard. And Lug’s little house.'),
        BK('I thought they loved it. They were always so busy.', 'sad'),
        BK('Busy isn’t the same as happy, is it?', 'think'),
        N('He takes down WORK IS PLAY. He puts up a new sign.'),
        N('It says: WORK IS… OFTEN PLAY!'),
        SP('That’s worse.', 'think'),
        BK('I know. I’m working on it.', 'sad'),
        CL('Each Nubbin gets a card. They pick the job they like.', 'soft'),
        SP('And the big wheel comes off! The water wheel can work the lights.', 'happy'),
      ],
      [
        {
          domain: 'maths',
          skill: 'sorting into groups',
          standard: 'K.MD.B.3',
          kind: 'do',
          after: 7,
          check: 'edu:sort:cards:jobs',
          lines: [
            N('(Help sort the cards! Choppers here. Stackers there. Resters over here.)'),
            CL('Every Nubbin in its own group. Now let’s count each group!', 'happy'),
          ],
          parentNote: 'Sorted job cards into groups and counted each group.',
        },
      ],
    ),
    sc(
      's16-bell',
      [
        N('The Fair Roster hangs by the gate. A card for every Nubbin.'),
        N('Next to it hangs a little bell. Low down, so everyone can reach.'),
        N('Clover paints on it: NO THANK YOU.'),
        N('The big wheel stops. A Nubbin is asleep inside it.'),
        N('A wheel runner walks to the bell. It rings it, softly. Ding.'),
        N('Then it sits in the sun. Nobody stops it!'),
        BK('Well I never! Fewer logs! Happier Nubbins!', 'happy'),
      ],
      [
        {
          domain: 'music',
          skill: 'soft and loud sounds',
          kind: 'do',
          after: 4,
          check: 'edu:ring:bell:soft-loud',
          lines: [
            N('(Ring a pretend bell softly: ding. Now loudly: DING!)'),
            CL('Soft and loud. A soft ding says “No, thank you” nicely.', 'soft'),
          ],
          parentNote: 'Made a pretend bell sound softly and then loudly.',
        },
      ],
    ),
    sc(
      's16-question',
      [
        N('Brisk walks you to the river path.'),
        BK('Can I ask you something, Keeper?', 'think'),
        BK('Your Nubbins fetch you apples. Do you ask them first?', 'think'),
        N('You think about your Nubbins. They bring you apples. They look happy.'),
        Y('I don’t know.'),
        BK('Me neither. Now, the five tired ones. What shall I do?', 'think'),
      ],
      [
        {
          domain: 'sel',
          skill: 'asking first; letting others say yes or no',
          standard: 'CASEL: Relationship skills',
          kind: 'ask',
          after: 4,
          prompt: [BK('Before a friend helps you, what can you say?', 'think')],
          options: [
            opt('“Would you like to help?”', [BK('Yes! Ask first. Then they can say yes, or no thank you.', 'happy')], true),
            opt('“Do it now!”', [BK('That’s a bit bossy, isn’t it? Asking first is kinder.', 'soft')]),
            opt('Say nothing', [BK('Then they never get to choose. Ask first!', 'soft')]),
          ],
          parentNote: 'Practised asking before someone helps, so they can choose yes or no.',
        },
      ],
      {
        choices: [
          {
            id: 'grove',
            label: 'Bring them to the Grove to rest.',
            set: { 's16-tired': 'grove' },
            then: [
              BK('Yes. That’s kind. Lug will want to visit.', 'soft'),
              N('Lug picks up their whole little house, with them inside!'),
            ],
          },
          {
            id: 'morale',
            label: 'Keep them here as the cheer-up team.',
            set: { 's16-tired': 'morale' },
            then: [
              BK('Cheer-up team! Their job is sitting in the sun, being lovely!', 'happy'),
              SP('Is that just a job with a nicer hat?', 'think'),
            ],
          },
          {
            id: 'wild',
            label: 'Let them go and live by the river.',
            set: { 's16-tired': 'wild' },
            then: [
              BK('By the river? Who’ll look after them?', 'shock'),
              CL('They can look after themselves. Some Nubbins like being free.', 'soft'),
              N('Brisk looks up the river. He doesn’t say no.'),
            ],
          },
        ],
      },
    ),
    sc(
      's16-week',
      [
        N('A week later, the Workyard is louder. And slower.'),
        N('Everybody stops for fruit, morning and afternoon.'),
        N('Someone has hung up a hammock!'),
        N('The new sign says: ASK FIRST.'),
        BK('Fewer logs. But the lights stay on! The water wheel does it.', 'happy'),
        SP('I knew it. I said so. Loudly.', 'happy'),
        N('Lug walks past with a log, humming. He just likes it.'),
      ],
      [
        {
          domain: 'science',
          skill: 'moving water can push and turn things',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'notice',
          after: 4,
          lines: [
            SP('The river pushes the water wheel round and round.'),
            SP('The turning wheel makes the lights work. Water power!', 'happy'),
          ],
          parentNote: 'Heard how moving river water pushes a wheel round, and the wheel can power lights.',
        },
      ],
    ),
    sc(
      's16-complete',
      [
        BK('Here! Every Keeper needs a hard hat.', 'happy'),
        N('A yellow hard hat, just your size.'),
        N('On the brim, in Lug’s pencil: KEEPER.'),
        BK('Try the Fair Roster at the Grove. Let them pick.', 'soft'),
        N('Back home, you hang the roster by the door.'),
        N('By morning, three Nubbins have picked jobs.'),
        N('Watering. Fetching apples. And sitting with Moss.'),
        SP('That last one isn’t a job!', 'think'),
        CL('It is to Moss.', 'happy'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'first sounds: k',
          standard: 'RF.K.2',
          kind: 'ask',
          after: 2,
          prompt: [SP('KEEPER! What sound does KEEPER start with?', 'think')],
          options: [
            opt('“k”, like kite', [SP('Yes! K-k-keeper. Like kite and kitten!', 'happy')], true),
            opt('“s”, like sun', [SP('Listen: k-k-keeper. It starts with k, like kite!')]),
            opt('“m”, like Moss', [SP('M is for Moss! Keeper starts with k-k-k.')]),
          ],
          parentNote: 'Heard the first sound “k” in the word “Keeper”.',
        },
      ],
    ),
  ],
  'All choices kept. Brisk’s Circuit line is left out for this band. The tired Nubbins are “faded”, never “grey”.',
);

// ================================================================== S12 The Hum
const S12: EduQuest = quest(
  's12',
  'The Hum',
  {
    's12-step1': {
      goal: 'Carry the little beetle home to the old wall.',
      hint: 'The old wall is on the north side of the Grove. Carry the teacup flat and steady.',
    },
    's12-step2': {
      goal: 'Put your ear to the old wall at dusk. Listen!',
      hint: 'Lie down by the bottom stone, near the lantern post. Keep very still and quiet.',
    },
    's12-step3': {
      goal: 'Sit with Solo in Luna’s garden until morning.',
      hint: 'Sit on the bench by the moon flowers after dark. Don’t get up.',
    },
    's12-step4': {
      goal: 'Follow the buzzing swarm with Pixel’s tuning fork.',
      hint: 'Tap the fork and turn slowly. It buzzes most when you face the swarm.',
    },
  },
  [
    sc(
      's12-solo',
      [
        N('Evening in Luna’s night garden. The moon flowers open.'),
        LU('Keeper! Over here. I’ve got something in a teacup.', 'think'),
        N('In the cup is a round bronze beetle. It’s fuzzy, like a peach.'),
        N('It’s a Nubbin! Its wings buzz when it talks.'),
        LU('It’s a Thrum. Lots of them live in the old wall.'),
        LU('They hum together. They never come out alone.'),
        SO('We are— no.', 'shock'),
        SO('I. I am. Hello. I think I am sorry.', 'sad'),
        LU('It needs a name, I think.'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'the words “I” and “we”: one and lots',
          standard: 'ELOF: Language and Communication',
          kind: 'ask',
          after: 7,
          prompt: [LU('It’s just one beetle. Should it say “I” or “we”?', 'think')],
          options: [
            opt('“I”', [LU('Yes! One on your own says “I”. Lots together say “we”.', 'happy')], true),
            opt('“We”', [LU('“We” is for lots together. One on its own says “I”.')]),
          ],
          parentNote: 'Learned that we say “I” about one person and “we” about a group.',
        },
      ],
      {
        choices: [
          {
            id: 'solo',
            label: 'Call it Solo.',
            set: { 's12-name': 'solo' },
            then: [SO('Solo. That means just one. Yes. That’s me.', 'think'), LU('Good name.', 'soft')],
          },
          {
            id: 'own',
            label: 'Give it a name of your own.',
            set: { 's12-name': 'own' },
            then: [
              N('You say a name. The beetle says it three times, quietly.'),
              SO('Nobody ever said a thing just to me before!', 'shock'),
            ],
          },
          {
            id: 'ask',
            label: 'Ask what it would like to be called.',
            set: { 's12-name': 'asked' },
            then: [
              SO('Like? I never liked anything on my own before.', 'think'),
              SO('I would like you to choose. That’s my first like!', 'soft'),
              N('You call it Solo. It fits.'),
            ],
          },
        ],
      },
    ),
    sc(
      's12-wall',
      [
        N('The old wall hums. Put your hand on it. Buzzzz!'),
        N('It smells a little of honey.'),
        N('Every crack has a tiny round door. Every door has a face.'),
        TH('Hello, Keeper. Thank you for bringing the one home.'),
        TH('The one is welcome. Wait. We are checking we all agree.', 'think'),
        N('A long, buzzy pause.'),
        TH('We agree! Welcome! Sorry. We are very many.', 'happy'),
        N('But Solo climbs up your sleeve instead. And stays there.'),
        SO('In a minute. I’ll go in a minute.', 'sad'),
      ],
      [
        {
          domain: 'science',
          skill: 'sounds are made by shaking (vibration)',
          standard: '1-PS4-1',
          kind: 'do',
          after: 0,
          check: 'edu:hum:feel:throat',
          lines: [
            N('(Hum a long hmmm. Touch your throat. Can you feel the buzz?)'),
            N('Sounds are made by things shaking very fast. That’s the buzz!'),
          ],
          parentNote: 'Felt their throat buzz while humming: sounds are made by vibrations.',
        },
      ],
    ),
    sc(
      's12-flat',
      [
        N('Next morning, Pixel is at the wall. She has a tuning fork.'),
        PX('I tune my lantern clock to this wall. It always hums one note.'),
        N('She taps the fork. It sings. The wall sings back, a bit lower.'),
        PX('It’s gone flat! Walls don’t do that!', 'shock'),
        TH('Sorry. It’s our Queen-Mother. She is getting quieter.', 'sad'),
        TH('Soon, half of us will fly away to a new home.'),
        PX('That’s the saddest thing a wall ever said to me.', 'sad'),
        N('In your sleeve, Solo has gone very still.'),
      ],
      [
        {
          domain: 'music',
          skill: 'high and low notes',
          kind: 'do',
          after: 2,
          check: 'edu:sing:notes:high-low',
          lines: [
            N('(Sing a high note together: laaa! Now a low note: looo.)'),
            PX('High and low! The wall went a little bit lower.', 'think'),
          ],
          parentNote: 'Sang a high note and a low note and heard the difference.',
        },
      ],
    ),
    sc(
      's12-queen',
      [
        N('At dusk, you lie down with your ear on the bottom stone.'),
        N('Deep inside, one slow note. Hmmmm. Like a big, sleepy bee.'),
        QM('Ah. The Keeper. And the little one in your sleeve.', 'soft'),
        QM('I am the middle of the hum. It’s a bit lonely here.', 'sad'),
        QM('Soon, half will go. The little one must choose.', 'soft'),
        QM('Go, or stay. Don’t choose for it. Let it choose.', 'happy'),
        N('Solo makes a tiny sound. Like a question.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'helping someone who feels lonely',
          standard: 'CASEL: Social awareness',
          kind: 'ask',
          after: 3,
          prompt: [N('The Queen-Mother feels lonely. What helps when someone is lonely?')],
          options: [
            opt('A friend to talk to', [QM('Yes. You’re here, talking to me. I feel less lonely already.', 'soft')], true),
            opt('Being told to cheer up', [QM('That doesn’t help much. A friend who listens helps most.', 'soft')]),
            opt('Going away', [QM('Then I’d feel lonelier! A friend nearby helps.', 'soft')]),
          ],
          parentNote: 'Thought about what helps a lonely friend: company and listening.',
        },
      ],
    ),
    sc(
      's12-dark',
      [
        N('Solo won’t go into the wall. So you go to Luna’s garden.'),
        N('It is night. The paths shine a little in the dark.'),
        SO('In the hum, I’m warm all over. Nothing is scary.', 'soft'),
        SO('Out here, the dark is big. I feel scared.', 'sad'),
        SO('But I want to see what happens next. Is that greedy?', 'think'),
        LU('I garden at night. Some nights I’m a bit scared too.', 'soft'),
        LU('I come out anyway. Wanting to see isn’t greedy. It’s brave.'),
      ],
      [
        {
          domain: 'science',
          skill: 'day and night animals',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'ask',
          after: 1,
          prompt: [LU('Some animals wake up at night. Which one?', 'think')],
          options: [
            opt('An owl', [LU('Yes! Lots of owls wake up at night. So do moths and bats.', 'happy')], true),
            opt('A butterfly', [LU('Butterflies rest at night. Owls, moths and bats wake up!')]),
            opt('A hen', [LU('Hens go to bed at night! Owls, moths and bats wake up.', 'happy')]),
          ],
          parentNote: 'Learned that some animals, like owls, moths and bats, are awake at night.',
        },
      ],
    ),
    sc(
      's12-swarm-goes',
      [
        N('You wake up on the bench. The morning is warm and still.'),
        N('Across the Grove, the old wall ROARS!'),
        N('Bronze Thrums pour out of every crack, sparkling in the sun.'),
        TH('Goodbye! Some of us are leaving. We are deciding which!', 'shock'),
        N('When a bee family gets too big, some fly off. That’s a swarm.'),
        TH('Sorry it’s slow. We’re trying to be quick and polite.'),
        SO('I want to see where they go. Just see.', 'think'),
        PX('Come on. I’ve got my tuning fork!', 'happy'),
      ],
      [
        {
          domain: 'maths',
          skill: 'taking away leaves fewer',
          standard: 'K.OA.A.1',
          kind: 'ask',
          after: 4,
          prompt: [PX('Lots fly out. Now, are there more or fewer in the wall?', 'think')],
          options: [
            opt('Fewer', [PX('Yes! When some go away, there are fewer left.', 'happy')], true),
            opt('More', [PX('They flew away, so there are fewer. Fewer left behind.')]),
          ],
          parentNote: 'Understood that when some of a group leave, fewer are left.',
        },
      ],
    ),
    sc(
      's12-follow',
      [
        N('Pixel gives you her tuning fork. PROPERTY OF PIXEL, it says.'),
        PX('Tap it on your knee. Hold it up. Turn slowly.'),
        PX('When it buzzes in your fingers, that’s them. Walk that way.'),
        PX('And don’t walk into the stream. People do.'),
        PX('Not me. Other people.', 'think'),
      ],
      [
        {
          domain: 'science',
          skill: 'our ears can tell where a sound comes from',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'do',
          after: 2,
          check: 'edu:point:sound:where-from',
          lines: [
            N('(Close your eyes. Your grown-up says “buzz” from somewhere.)'),
            N('(Point to where the sound came from!)'),
            PX('Good ears! Ears can tell where a sound comes from.', 'happy'),
          ],
          parentNote: 'Listened with eyes closed and pointed to where a sound came from.',
        },
      ],
    ),
    sc(
      's12-settled',
      [
        N('The fork leads you over the stream to Hazel’s crooked tree.'),
        N('The swarm hangs from a branch, like a big buzzing pear.'),
        PX('It was never one note! It’s hundreds of tiny hums together!', 'shock'),
        TH('We are a new we. Solo, will you come in?', 'soft'),
        SO('Keeper. I don’t know what to do.', 'sad'),
        SO('Sit with me. No. Tell me. No. Both?', 'sad'),
        N('You sit down beside Solo. You wait for Solo to choose.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'making a hard choice slowly, with a friend',
          standard: 'CASEL: Responsible decision-making',
          kind: 'ask',
          after: 6,
          prompt: [N('Solo can’t decide. What helps when you can’t decide?')],
          options: [
            opt('Take your time, with a friend', [SO('Slowly. With you here. Yes. That helps.', 'soft')], true),
            opt('Hurry up and pick!', [SO('Hurrying makes my wings wobble. Slowly, with a friend, helps.', 'sad')]),
            opt('Let someone else pick', [SO('The Queen-Mother said I must choose. With a friend beside me.', 'think')]),
          ],
          parentNote: 'Thought about making a hard choice: slowly, with a friend beside you.',
        },
      ],
      {
        choices: [
          {
            id: 'hum',
            label: 'Solo picks the hum. You nod.',
            set: { 's12-solo': 'hum' },
            then: [
              N('You carry Solo back to the old wall.'),
              SO('Will you remember this for me?', 'soft'),
              N('Solo walks in through a little round door.'),
              PX('Listen. The hum sounds just right again.', 'soft'),
            ],
          },
          {
            id: 'alone',
            label: 'Solo picks a home of its own. You nod.',
            set: { 's12-solo': 'alone' },
            then: [
              N('You find a little hole in the gatepost. It looks at the pond.'),
              SO('Mine! I chose it!', 'happy'),
              N('Every evening, one tiny hum comes from the gatepost.'),
            ],
          },
          {
            id: 'gaps',
            label: 'Solo asks the hum for a little room. You nod.',
            set: { 's12-solo': 'gaps' },
            then: [
              SO('Could Thrums go out, and come back in?', 'think'),
              TH('We will talk about it.', 'think'),
              N('They talk until lunch. Pixel eats two sandwiches. Then yours.'),
              TH('We agree! Ones may go out, and come back in.', 'happy'),
              SO('In for supper. Out for the stars. Yes!', 'happy'),
            ],
          },
        ],
      },
    ),
    sc(
      's12-complete',
      [
        N('A week later, the Queen-Mother dies, in the night.'),
        N('She was very, very old. Her body stopped working.'),
        N('Her whole family hummed around her. She wasn’t alone.'),
        N('In the morning, there’s a present on your doorstep.'),
        N('A little clay hive. It hums a tune you know!'),
        TH('For the Keeper. We taught it to hum. We hope that’s not rude.', 'soft'),
        N('Beside it is a thimble of golden nectar. It smells of summer.'),
        PX('I’ve changed my lantern clock. It listens to the whole crowd now.', 'happy'),
      ],
      [
        {
          domain: 'sel',
          skill: 'feeling sad when someone dies; remembering together',
          standard: 'CASEL: Self-awareness',
          kind: 'notice',
          after: 2,
          lines: [N('It’s all right to feel sad when someone dies.'), N('Remembering them together helps.')],
          parentNote: 'Heard that sadness after a death is normal, and that remembering together helps.',
        },
        {
          domain: 'music',
          skill: 'speaking in chorus, at the same time',
          kind: 'do',
          after: 5,
          check: 'edu:say:chorus:hello',
          lines: [
            N('(Say “hello” at the very same time as your grown-up. Ready?)'),
            N('Together, like the Thrums! That’s called a chorus.'),
          ],
          parentNote: 'Said a word in chorus, at the same time as their grown-up.',
        },
      ],
    ),
  ],
  'All choices kept. The Queen-Mother’s death is said plainly and gently in s12-complete. No lesson depends on ' +
    'the letters of the name “Solo”, so the “own” renaming is safe.',
);

// ================================================================== S17 Nightjar
const S17: EduQuest = quest(
  's17',
  'Nightjar',
  {
    's17-step1': {
      goal: 'Look for clues around the nursery.',
      hint: 'Look at the straw, the roof and the top of the fence. Show Luna what you find.',
    },
    's17-step2': {
      goal: 'Creep quietly through Luna’s garden to the hiding place.',
      hint: 'Walk on the soft moss, not the crunchy gravel. Move when the wind blows the leaves.',
    },
    's17-step3': {
      goal: 'Climb up to Nightjar’s nest, slowly.',
      hint: 'Hold on where the ferns grow. Stop when she turns her head.',
    },
    's17-step4': {
      goal: 'Carry the eggs home, one at a time.',
      hint: 'Hold each egg in both hands. Walk, don’t run.',
    },
    's17-step5': {
      goal: 'Visit Nightjar at night, when the little egg hatches.',
      hint: 'Go up the cliff path after dark. Sit and wait.',
    },
  },
  [
    sc(
      's17-missing',
      [
        N('Autumn. Shiny conkers lie on the ground.'),
        N('In the straw is an empty, warm dip. An egg is gone!'),
        LU('One egg a night. Always the warmest one.', 'think'),
        LU('Never a crack. Whoever it is, they’re careful.'),
        NO('Morning! I’m not stopping. I heard there’s a mystery.'),
        NO('Badger.', 'think'),
        LU('It’s not a badger.'),
        NO('A tall badger.'),
        LU('Let’s look for clues first. Gently.', 'soft'),
      ],
      [
        {
          domain: 'science',
          skill: 'signs of autumn: conkers and falling leaves',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'ask',
          after: 0,
          prompt: [LU('Conkers fall in autumn. What else falls off trees in autumn?', 'think')],
          options: [
            opt('Leaves', [LU('Yes! Leaves fall in autumn. Crunch, crunch!', 'happy')], true),
            opt('Snowflakes', [LU('Snow comes later, in winter. In autumn, leaves fall. Crunch!')]),
          ],
          parentNote: 'Named signs of autumn: conkers and falling leaves.',
        },
      ],
    ),
    sc(
      's17-clues',
      [
        N('On the fence: a big grey feather. As long as your arm!'),
        N('On the roof: tiny scratches. Something landed very gently.'),
        N('The dip in the straw is still warm.'),
        LU('That’s an owl feather. A really big owl.', 'shock'),
        NO('Two badgers in a coat, with an owl feather!', 'happy'),
        LU('Nova.'),
        NO('Fine. Tonight, then. I’m not stopping. I’m just staying up.', 'think'),
      ],
      [
        {
          domain: 'maths',
          skill: 'comparing lengths: longer, shorter, the same',
          standard: 'K.MD.A.2',
          kind: 'do',
          after: 0,
          check: 'edu:compare:length:feather-arm',
          lines: [
            N('(Stretch out your arm. Is the feather longer, shorter, or the same?)'),
            LU('The same! This feather is as long as your arm.', 'happy'),
          ],
          parentNote: 'Compared two lengths using the words longer, shorter and the same.',
        },
      ],
    ),
    sc(
      's17-night',
      [
        N('At night, Luna’s garden glows. The white flowers are open.'),
        LU('We hide in here and watch the nursery.', 'think'),
        LU('Stay on the soft moss. The gravel goes crunch!'),
        LU('If something lands, don’t stare. Owls don’t like it. Nor do I.'),
        NO('Can I bring my list?'),
        LU('In your head. Quietly.', 'soft'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'loud and quiet sound words',
          standard: 'RL.1.4',
          kind: 'do',
          after: 2,
          check: 'edu:say:sound-words:crunch-shh',
          lines: [
            N('(Say it with Luna: gravel goes CRUNCH. Moss goes… shhh.)'),
            LU('Crunch is a loud word. Shhh is a quiet word.', 'happy'),
          ],
          parentNote: 'Said loud and quiet sound words: “crunch” and “shhh”.',
        },
      ],
      {
        choices: [
          {
            id: 'luna',
            label: 'Follow Luna’s footsteps exactly.',
            set: { 's17-path': 'luna' },
            then: [LU('Good. Step on the thyme. It smells nice.', 'soft')],
          },
          {
            id: 'own',
            label: 'Find your own way.',
            set: { 's17-path': 'own' },
            then: [
              N('Crack! You step on an empty snail shell. Everyone freezes.'),
              LU('…Your own way is very loud.', 'think'),
            ],
          },
        ],
      },
    ),
    sc(
      's17-reveal',
      [
        N('Midnight. Something flies across the moon. Not a sound.'),
        N('A huge grey owl lands on the nursery roof.'),
        N('She lifts an egg very gently in her feet.'),
        N('She turns her head nearly all the way round. She looks at you.'),
        NJ('Hoo-oo.', 'soft'),
        N('Then she flies off to the cliffs, holding the egg.'),
        NO('…I’m crossing off the badgers.', 'shock'),
        LU('That’s Nightjar. Hazel told me about her.', 'soft'),
        LU('The biggest owl in the valley. And the saddest.'),
      ],
      [
        {
          domain: 'science',
          skill: 'owls fly quietly on soft feathers',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'notice',
          after: 0,
          lines: [LU('Owls have soft, fluffy feathers.', 'soft'), LU('That makes their flying very, very quiet.', 'soft')],
          parentNote: 'Learned that owls’ soft feathers let them fly almost silently.',
        },
      ],
    ),
    sc(
      's17-cliffs',
      [
        N('Next night, you follow her to the high cliffs.'),
        N('Halfway up is a nest. It’s as big as a cart wheel!'),
        NO('I slept up here once. An owl called all night. Two notes.', 'think'),
        LU('She’ll go hunting soon. We could climb up then.', 'think'),
        LU('Or we could wait, and let her see us coming.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'being gentle with a shy animal',
          standard: 'CASEL: Social awareness',
          kind: 'ask',
          after: 4,
          prompt: [LU('How do we meet a shy animal?', 'think')],
          options: [
            opt('Slowly and quietly', [LU('Yes. Slow and quiet, so she isn’t scared.', 'soft')], true),
            opt('Run up fast', [LU('That might scare her. Slow and quiet is kinder.', 'soft')]),
            opt('Shout hello', [LU('Loud sounds scare shy animals. Slow and quiet is better.', 'soft')]),
          ],
          parentNote: 'Thought about how to be gentle and calm around a shy animal.',
        },
      ],
      {
        choices: [
          {
            id: 'sneak',
            label: 'Climb while she’s out hunting.',
            set: { 's17-approach': 'sneak' },
            then: [
              N('You climb up, hand over hand.'),
              N('Whoosh! A quiet shadow. She’s home already.'),
              NO('She was always going to be home, wasn’t she.', 'soft'),
            ],
          },
          {
            id: 'wait',
            label: 'Wait where she can see you.',
            set: { 's17-approach': 'wait' },
            then: [
              N('You sit on a rock below the nest. She comes home.'),
              N('She looks at you a long time. Then she moves over, a little.'),
              LU('I think that means come up. Slowly.', 'think'),
            ],
          },
        ],
      },
    ),
    sc(
      's17-nest',
      [
        N('The nest is made of heather, wool and soft grey feathers.'),
        N('Under Nightjar are eggs. All whole. All warm.'),
        N('Deep in the nest are two old, cracked eggshells.'),
        LU('Hazel told me. Long ago, a cold night came in spring.', 'soft'),
        LU('Nightjar’s own two eggs got too cold. The babies inside died.', 'sad'),
        LU('They never hatched. She has been sad ever since.', 'sad'),
        N('Now she keeps other eggs warm. It helps her feel a little better.'),
        NJ('Hoo-oo.', 'sad'),
        N('She settles over the eggs, like a blanket.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 5; 4 and 1 make 5',
          standard: 'K.OA.A.1',
          kind: 'do',
          after: 1,
          check: 'edu:count:eggs:5',
          lines: [
            N('(Count the eggs together.)'),
            N('One, two, three, four, five. Five eggs!'),
            N('Four glow, like Grove eggs. One doesn’t. Four and one make five.'),
          ],
          parentNote: 'Counted five eggs and saw that four and one more make five.',
        },
        {
          domain: 'sel',
          skill: 'understanding grief; being gentle with someone sad',
          standard: 'CASEL: Social awareness',
          kind: 'notice',
          after: 6,
          lines: [
            LU('Someone can stay sad for a long time when someone dies.', 'soft'),
            LU('Being kind and gentle helps. Let’s be gentle with her.', 'soft'),
          ],
          parentNote: 'Heard, gently, that grief can last a long time, and that kindness helps.',
        },
      ],
    ),
    sc(
      's17-return',
      [
        N('Nightjar won’t let you take them all at once.'),
        N('You lift two. Clack! goes her beak.'),
        LU('One at a time, then. Let her watch each one go.', 'soft'),
        NO('That’s four climbs. In the dark!', 'shock'),
        LU('That’s four climbs. In the dark.', 'happy'),
        N('Nightjar watches the first egg all the way down.'),
      ],
      [
        {
          domain: 'health',
          skill: 'careful, gentle movement',
          standard: 'ELOF: Perceptual, Motor, and Physical Development',
          kind: 'do',
          after: 2,
          check: 'edu:carry:gently:two-hands',
          lines: [
            N('(Pretend to carry an egg. Two hands. Slow, gentle steps.)'),
            LU('Two hands, slow feet. That’s how to carry an egg.', 'soft'),
          ],
          parentNote: 'Practised moving slowly and carefully with both hands, as if carrying an egg.',
        },
      ],
    ),
    sc(
      's17-wild',
      [
        N('Morning. Four eggs are back in the nursery.'),
        N('One egg is still under Nightjar. It’s small and speckled.'),
        NO('That’s a wild egg. Its mummy never came back.', 'think'),
        LU('Let’s leave it with her. She can keep it warm.', 'soft'),
        N('On the way down, Luna stops.'),
        LU('Next spring, she might come back to the nursery. What shall we do?', 'think'),
      ],
      [
        {
          domain: 'sel',
          skill: 'thinking about how someone else feels',
          standard: 'CASEL: Social awareness',
          kind: 'ask',
          after: 3,
          prompt: [LU('How might Nightjar feel, with a baby egg to keep warm?', 'think')],
          options: [
            opt('Happier', [LU('Yes. Caring for someone can help a sad heart.', 'soft')], true),
            opt('Cross', [LU('Look how gently she sits. I think she feels happier.', 'soft')]),
          ],
          parentNote: 'Imagined how caring for someone small can help a sad heart feel better.',
        },
      ],
      {
        choices: [
          {
            id: 'open',
            label: 'Leave the nursery open, with a lantern for her.',
            set: { 's17-nursery': 'open' },
            then: [
              NO('A night nurse with a beak!', 'happy'),
              LU('She can sit on our eggs, where we can see. Like Hazel would.', 'soft'),
            ],
          },
          {
            id: 'shut',
            label: 'Move the nursery inside, by the warm stove.',
            set: { 's17-nursery': 'shut' },
            then: [
              LU('That’s fair. The eggs come first.', 'think'),
              NO('She’ll sit on the roof and look at the chimney.', 'sad'),
              LU('I’ll leave her a snack on the step sometimes.', 'soft'),
            ],
          },
        ],
      },
    ),
    sc(
      's17-feathers',
      [
        N('Some weeks later, a grey feather is on your windowsill.'),
        N('The next night, there’s another one.'),
        LU('She’s calling you! The little egg must be hatching.', 'soft'),
        LU('Go after dark. Just go and sit.'),
        NO('I’m not coming. I’ll just be on the path. By accident.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'adding one more',
          standard: 'K.OA.A.1',
          kind: 'ask',
          after: 1,
          prompt: [N('One feather, then one more. How many feathers now?')],
          options: [
            opt('2', [LU('Yes! One and one more make two.', 'happy')], true),
            opt('3', [LU('Let’s count: one… two. Two feathers!')]),
            opt('1', [LU('One, and one more… two feathers!')]),
          ],
          parentNote: 'Added one more to one to make two.',
        },
      ],
    ),
    sc(
      's17-hatching',
      [
        N('The egg is rocking. Nightjar moves over a little.'),
        N('Crack! A tiny beak pokes out.'),
        N('Out comes a fluffy grey baby. All eyes. Very cross!'),
        NJ('Hoo-oo. Hoo-oo.', 'happy'),
        N('The same two notes. But now they sound happy.'),
        N('The baby owl tumbles into your lap. Nightjar lets it.'),
        LU('She’s sharing. Look at that.', 'soft'),
      ],
      [
        {
          domain: 'science',
          skill: 'animal babies: an owlet',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'ask',
          after: 2,
          prompt: [LU('A baby owl has a special name. What is it?', 'think')],
          options: [
            opt('An owlet', [LU('Yes! A baby owl is an owlet.', 'happy')], true),
            opt('A kitten', [LU('A kitten is a baby cat. A baby owl is an owlet!')]),
            opt('A puppy', [LU('A puppy is a baby dog. A baby owl is an owlet!')]),
          ],
          parentNote: 'Learned the name for a baby owl: an owlet.',
        },
      ],
    ),
    sc(
      's17-complete',
      [
        N('At the end of autumn, Nightjar drops her old feathers.'),
        N('The wind blows them down into the Grove.'),
        LU('I sewed them into a cloak for you!', 'happy'),
        N('It’s light as a breath. Warm as a bird.'),
        N('Nightjar swoops down. She lifts you gently in her feet.'),
        N('The cloak keeps you warm. Whoosh! You fly home over the valley.'),
        NO('Show-off.', 'happy'),
        NO('…Take me next time.', 'soft'),
      ],
      [
        {
          domain: 'science',
          skill: 'birds moult: old feathers fall out, new ones grow',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'notice',
          after: 1,
          lines: [
            LU('Birds drop their old feathers. New ones grow in their place.'),
            LU('It’s called moulting. Lots of birds do it every year.'),
          ],
          parentNote: 'Learned that birds moult: old feathers fall out and new ones grow.',
        },
      ],
    ),
  ],
  'All choices kept. Nightjar’s lost chicks are said plainly in s17-nest. The “twenty-two years” hint is left out ' +
    'for this band. The snail shell in s17-night is an empty one. No ordinary frost in S17 (chapter 7 frost is the ' +
    'shard’s sign), so s17-missing opens with conkers. NURSERY PAYOFF (mirrors the S17 notes): s17-complete plays one ' +
    'extra narrator line after index 3 (“It’s light as a breath…”). With open: “Now a lantern glows on the nursery roof. ' +
    'Sometimes a grey owl sits beside it.” With shut: “Sometimes a grey owl sits on the cottage roof. Luna leaves her a ' +
    'snack.”',
);

// ================================================================== S18 The Grove Museum
const S18: EduQuest = quest(
  's18',
  'The Grove Museum',
  {
    's18-step1': {
      goal: 'Dig up three fossils with Dusty. Put them in order, oldest first.',
      hint: 'The deepest layer is the oldest, like the bottom blanket on a bed.',
    },
    's18-step2': {
      goal: 'Wait quietly by Luna’s moth sheet for three night finds.',
      hint: 'Keep very still. The stiller you are, the faster the finds come.',
    },
    's18-step3': {
      goal: 'Find three creatures in Marina’s rock pools.',
      hint: 'Look under the weed and the stones. Always put each stone back the same way up.',
    },
    's18-step4': {
      goal: 'Find the Pole Star with Nova. Then wait for the Moon.',
      hint: 'Find the seven stars of the Plough. The two end stars point to the Pole Star.',
    },
    's18-step5': {
      goal: 'Fill the middle case. Then talk to Professor Delve at the door.',
      hint: 'Put something special in the big case in the middle of the barn.',
    },
  },
  [
    sc(
      's18-barn',
      [
        N('Hazel’s old barn smells of hay. Swallows’ mud nests line the roof.'),
        N('A mole in a tweed waistcoat stands by a barrow of glass boxes.'),
        DE('Hello! I’m Professor Delve. I want to make a museum!', 'happy'),
        DE('Four rooms. Twelve treasures. And every sign must be true!', 'think'),
        N('A little brown moth lands on his nose.'),
        DE('Oh! A mo… a mo… a MOTH!', 'shock'),
        N('Professor Delve faints, very neatly, into the barrow.'),
        DE('I’m all right. I’m just lying down.', 'sad'),
        N('Dusty is at the door, holding a trowel.'),
        DU('I heard “fossils”. My hands want a job. Can I help?', 'soft'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'first sounds: d',
          standard: 'RF.K.2',
          kind: 'ask',
          after: 9,
          prompt: [N('Delve and Dusty start with the same sound. Which one?')],
          options: [
            opt('“d”, like dig', [DU('D-d-Dusty. D-d-Delve. And d for dig!', 'happy')], true),
            opt('“m”, like mole', [DU('Mole starts with m. Delve and Dusty start with d-d-d!')]),
            opt('“s”, like sun', [DU('Listen: d-d-Dusty, d-d-Delve. They start with d!')]),
          ],
          parentNote: 'Heard the same first sound, “d”, in two names.',
        },
      ],
    ),
    sc(
      's18-fossils',
      [
        N('The cliff has stripes, like a cake. Lots of layers.'),
        DU('Deeper is older. Like blankets on a bed.', 'think'),
        N('Fossils are signs of plants and animals from long ago, kept in stone.'),
        N('You find a curly shell, a flat fern and a little stone bug.'),
        DU('My Nubbin was called Fossil. Like these! She always slept while I dug.', 'happy'),
        DU('Fossil died, not long ago. She was my best friend.', 'soft'),
        DU('It’s very quiet without her snoring.', 'soft'),
        N('Dusty does Fossil’s snore. Zzz-pff. Then Dusty smiles, a little.'),
        DE('A trilobite! A sea animal from long, long ago.', 'happy'),
        DE('A fern! Ferns have no flowers.'),
        DE('An ammonite! A curly-shelled sea animal. A cousin of the octopus.'),
        DE('True, true and true! Hooray!', 'happy'),
      ],
      [
        {
          domain: 'science',
          skill: 'first and last: the deepest rock layer is the oldest',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'ask',
          after: 1,
          prompt: [DU('When you make a bed, which blanket goes on first?', 'think')],
          options: [
            opt('The bottom one', [DU('Yes! Bottom first. So the bottom rock is the oldest.', 'happy')], true),
            opt('The top one', [DU('The top one goes on last! Bottom first. The bottom rock is oldest.')]),
          ],
          parentNote: 'Used first and last to see why the deepest layer of rock is the oldest.',
        },
        {
          domain: 'sel',
          skill: 'missing someone who died',
          standard: 'CASEL: Self-awareness',
          kind: 'notice',
          after: 6,
          lines: [
            N('When someone dies, their body stops, for always.'),
            DU('I miss her. Missing someone means you loved them.', 'soft'),
            N('Dusty feels sad. It’s all right to feel sad.'),
          ],
          parentNote: 'Heard that missing someone who died is a sign of love, and that sadness is all right.',
        },
      ],
    ),
    sc(
      's18-night',
      [
        N('Luna hangs a white sheet between two trees.'),
        N('A lantern shines on it. It glows like a sail.'),
        LU('A moth trap. Nobody gets hurt. We look, we draw, they go home.', 'soft'),
        DE('I shall watch from far away. Very far away.', 'think'),
        N('He sits at the end of the garden, under a blanket.'),
        LU('Now, the hard part. We wait. And we don’t talk.', 'soft'),
        LU('…That was me talking. Starting now.', 'happy'),
      ],
      [
        {
          domain: 'sel',
          skill: 'waiting quietly',
          standard: 'CASEL: Self-management',
          kind: 'do',
          after: 6,
          check: 'edu:wait:quietly:count-10',
          lines: [
            N('(Be as quiet as a moth. Your grown-up counts to ten.)'),
            N('(One… two… three… all the way to ten. Shhh.)'),
            LU('Lovely waiting! You stayed so still.', 'soft'),
          ],
          parentNote: 'Practised waiting quietly and still while a grown-up counted to ten.',
        },
      ],
    ),
    sc(
      's18-night-finds',
      [
        N('A moth lands on the sheet. It’s green and black.'),
        N('It’s hard to see! It looks just like old tree bark.'),
        LU('Its name means “Marvel of the Day”. But it flies at night!', 'happy'),
        N('Far away: thump. Professor Delve has fainted again.'),
        N('By morning: a moth drawing, a spider web and an owl pellet.'),
        DE('Owls swallow little meals whole. They cough up the fur and bones.'),
        DE('Spiders make silk inside their bodies. They spin it into webs.'),
      ],
      [
        {
          domain: 'science',
          skill: 'camouflage: colours that help animals hide',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'ask',
          after: 1,
          prompt: [LU('Why is the moth so hard to see on the bark?', 'think')],
          options: [
            opt('Its colours match the bark', [LU('Yes! Its colours match. It hides in plain sight.', 'happy')], true),
            opt('It’s invisible', [LU('Not invisible! Its colours just match the bark. That’s how it hides.')]),
            opt('It’s asleep', [LU('Maybe! But mostly its colours match the bark. That’s how it hides.')]),
          ],
          parentNote: 'Learned that some animals hide because their colours match where they rest.',
        },
      ],
    ),
    sc(
      's18-shore',
      [
        N('Low tide. Marina’s rock pools shine like little mirrors.'),
        MA('Rule one. Turn a stone, then turn it back the same way.', 'think'),
        MA('That stone is somebody’s roof.'),
        MA('And the tide always comes back. Even if you’re not ready!', 'happy'),
        N('A little crab walks past Professor Delve’s boot.'),
        DE('Not a moth! What a good day.', 'happy'),
      ],
      [
        {
          domain: 'science',
          skill: 'looking after animals’ homes',
          standard: 'K-ESS3-3',
          kind: 'ask',
          after: 2,
          prompt: [MA('Why do we put the stone back the same way?', 'think')],
          options: [
            opt('It’s a little animal’s home', [MA('Yes. Little crabs live under there. We keep their homes safe.', 'soft')], true),
            opt('So it looks nice', [MA('It does look nice! But mostly, it’s somebody’s home.')]),
            opt('It doesn’t matter', [MA('It does! Little animals live under it. It’s their home.', 'soft')]),
          ],
          parentNote: 'Learned to put stones back in rock pools to look after the animals that live there.',
        },
      ],
    ),
    sc(
      's18-shore-finds',
      [
        N('You find an orange sea star. One arm is short. It’s growing back!'),
        N('You find a limpet, stuck tight to its rock.'),
        N('And a hermit crab, moving into a bigger shell!'),
        DE('A sea star can grow back an arm it lost.', 'happy'),
        DE('A hermit crab moves to a bigger shell when it grows.'),
        MA('Look, it left its old shell. A smaller crab might want it.', 'think'),
        DE('Or a museum might want it. I’m only saying.', 'think'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 5',
          standard: 'K.CC.B.5',
          kind: 'do',
          after: 0,
          check: 'edu:count:arms:5',
          lines: [
            N('(Count the sea star’s arms together.)'),
            N('One, two, three, four, five. Five arms. One is little!'),
          ],
          parentNote: 'Counted the five arms of a sea star.',
        },
      ],
      {
        choices: [
          {
            id: 'take',
            label: 'Take the empty shell for the museum.',
            set: { 's18-shell': 'taken' },
            then: [MA('Fair. There are lots of shells.'), DE('It shall have a little cushion!', 'happy')],
          },
          {
            id: 'leave',
            label: 'Leave the shell for the next crab.',
            set: { 's18-shell': 'left' },
            then: [
              MA('Good. Somebody’s old house is somebody’s new one.', 'soft'),
              DE('Then we’ll have a drawing instead.', 'happy'),
            ],
          },
        ],
      },
    ),
    sc(
      's18-stars',
      [
        N('Night on the hill. Nova lies in the cold grass.'),
        NO('Clear night. Best sky in the valley.'),
        NO('I brought you something. It’s a rock. It’s not a big thing.', 'think'),
        N('A black stone, heavy and bumpy. Like burnt toast.'),
        N('A Nubbin sniffs the rock that looks like toast. It is not toast!'),
        NO('It fell from the sky. I walked two days to find it.'),
        DE('A rock from space! It has no wings at all! I love it!', 'happy'),
        NO('Be gentle with it. It walked a long way.'),
        NO('Now. Find me north.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'saying thank you for a gift',
          standard: 'CASEL: Relationship skills',
          kind: 'ask',
          after: 3,
          prompt: [N('Nova gives you a present. What can you say?')],
          options: [
            opt('“Thank you!”', [NO('…You’re welcome. Shh. Look at the stars.', 'happy'), N('Nova smiles at the sky. Just a little.')], true),
            opt('“Is that all?”', [N('That might hurt Nova’s feelings. “Thank you” is kinder.')]),
            opt('Say nothing', [N('A “thank you” lets Nova know you love it.')]),
          ],
          parentNote: 'Practised saying thank you for a present.',
        },
      ],
    ),
    sc(
      's18-star-finds',
      [
        N('Look for seven stars in the shape of a pan. That’s the Plough.'),
        N('The two end stars point to the Pole Star.'),
        N('The Pole Star stays still. The other stars turn slowly round it.'),
        NO('That star helped me find my way home. Lots of times.', 'soft'),
        N('Late at night, the Moon comes up. Orange, then white.'),
        DE('The Moon always shows us the same face.'),
        DE('A shooting star isn’t a star. It’s space rock or dust, burning up.', 'happy'),
        N('Whoosh! A shooting star. Professor Delve ducks under his hat.'),
        DE('It isn’t a moth. I just like to be safe.', 'shock'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 7',
          standard: 'K.CC.B.5',
          kind: 'do',
          after: 0,
          check: 'edu:count:stars:7',
          lines: [N('(Count the stars of the Plough together.)'), N('One, two, three, four, five, six, seven!')],
          parentNote: 'Counted the seven stars of the Plough.',
        },
      ],
    ),
    sc(
      's18-heart',
      [
        N('Twelve cases are full. The big middle case is empty.'),
        DE('Every museum has a middle case. It holds the most special thing.', 'think'),
        N('Dusty comes in, holding a bent card.'),
        DU('Fossil’s card. From the hill, by her flower.', 'soft'),
        DU('I don’t want it in a drawer. I want people to see it.', 'sad'),
        DE('A museum helps everybody remember.', 'soft'),
        DE('Or there’s Hazel’s egg book. Every egg Hazel ever hatched is in it.', 'think'),
        DU('That’s a good thing. It just isn’t Fossil.', 'sad'),
      ],
      [
        {
          domain: 'sel',
          skill: 'remembering someone we love',
          standard: 'CASEL: Self-awareness',
          kind: 'ask',
          after: 5,
          prompt: [N('How can we remember someone we love?')],
          options: [
            opt('Tell stories about them', [DU('Yes. Telling stories keeps her close.', 'soft')], true),
            opt('Hide all their things away', [DU('Then I might forget. I want to see her card and remember.', 'soft')]),
          ],
          parentNote: 'Talked about remembering someone who died by sharing stories about them.',
        },
      ],
      {
        choices: [
          {
            id: 'card',
            label: 'Put Fossil’s card in the middle case.',
            set: { 's18-centre': 'card' },
            then: [
              DU('Thank you. She’d hate the glass. She’d sit on top of it!', 'happy'),
              DE('And Hazel’s book stays at the cottage. It’s still being written.', 'soft'),
            ],
          },
          {
            id: 'register',
            label: 'Put Hazel’s egg book in the middle case.',
            set: { 's18-centre': 'register' },
            then: [
              DU('Can Fossil’s card go inside it? Like a bookmark?', 'soft'),
              DE('A bookmark is allowed. A bookmark is very welcome!', 'happy'),
              DE('The book is only borrowed. When you want it back, I’ll carry it home.', 'soft'),
            ],
          },
          {
            id: 'empty',
            label: 'Leave the case empty, for whoever comes next.',
            set: { 's18-centre': 'empty' },
            then: [
              N('You put a card inside: For whoever we remember next.'),
              DE('An empty case! People will stand and think.', 'think'),
              DU('Good. Fossil’s card can go beside it.', 'soft'),
            ],
          },
        ],
      },
    ),
    sc(
      's18-door',
      [
        N('The barn is swept. Twelve signs shine.'),
        DE('One last thing. The door.', 'think'),
        DE('The roof has a hole. Drip, drip! Two Shells a visit would mend it.'),
        DE('Or it could be free. Then I’ll mend the roof with my hat.'),
        N('He looks at his hat. His hat looks worried.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'adding 2 and 2',
          standard: 'K.OA.A.2',
          kind: 'ask',
          after: 2,
          prompt: [DE('Two Shells for you. Two Shells for a friend. How many?', 'think')],
          options: [
            opt('4', [DE('Yes! Two and two make four.', 'happy')], true),
            opt('3', [DE('Let’s count on fingers: one, two… three, four. Four!')]),
            opt('2', [DE('That’s just one visit. Two and two more make four!')]),
          ],
          parentNote: 'Added two and two to make four.',
        },
      ],
      {
        choices: [
          {
            id: 'shells',
            label: 'Two Shells a visit, to keep it mended.',
            set: { 's18-entry': 'shells' },
            then: [DE('Sensible. Places need mending.', 'think'), DE('Anyone shorter than the door handle goes free!', 'happy')],
          },
          {
            id: 'free',
            label: 'Keep it free for everyone.',
            set: { 's18-entry': 'free' },
            then: [
              DE('Free. Yes. It belongs to the whole valley.', 'think'),
              DE('I’ll put out a jar. Just a hopeful one.', 'happy'),
            ],
          },
        ],
      },
    ),
    sc(
      's18-complete',
      [
        N('Opening day! Half the valley comes.'),
        N('Children press their noses on the trilobite case.'),
        N('Sparks reads every sign out loud. Very loud.'),
        DE('You did this, Curator. That means you look after the museum. Well done!', 'happy'),
        N('He gives you his old magnifying glass, on a ribbon.'),
        DE('It makes little things look big. I’d like it to keep looking.', 'soft'),
        N('Then a moth flies in. The Curator catches the professor!'),
      ],
      [
        {
          domain: 'social-studies',
          skill: 'museums keep things from long ago',
          standard: 'D2.His.2.K-2',
          kind: 'notice',
          after: 1,
          lines: [DE('A museum keeps old things safe.'), DE('Then children can learn about long ago.', 'happy')],
          parentNote: 'Heard that museums keep old things safe so we can learn about the past.',
        },
        {
          domain: 'literacy',
          skill: 'clapping syllables',
          standard: 'RF.K.2',
          kind: 'do',
          after: 3,
          check: 'edu:clap:syllables:curator',
          lines: [N('(Clap it together: Cu-ra-tor. How many claps?)'), N('Three claps! Cu-ra-tor.')],
          parentNote: 'Clapped the three syllables in “Curator”.',
        },
      ],
    ),
  ],
  'All choices kept. Fossil’s death is said plainly (s18-fossils). Delve’s plaque facts are kept true and simplified ' +
    'for reading aloud.',
);

// ================================================================== EXPORTS
export const EDU_SIDE_NEW_A_SPROUT: EduQuest[] = [S11, S15, S16, S12, S17, S18];

export const CHECKS: string[] = [
  // S11
  'edu:point:tree-parts:leaf-bark-fruit',
  'edu:blow:wind:tissue',
  'edu:keep:still:count-5',
  'edu:count:legs:6',
  'edu:count:spots:7',
  'edu:make:face:sour',
  // S15
  'edu:tiptoe:steps:5',
  'edu:shine:light:fingers',
  'edu:show:fingers:7',
  'edu:show:fingers:9-and-1',
  'edu:find:colour:brown',
  // S16
  'edu:say:sound-word:bzzz',
  'edu:point:position:behind',
  'edu:sort:cards:jobs',
  'edu:ring:bell:soft-loud',
  // S12
  'edu:hum:feel:throat',
  'edu:sing:notes:high-low',
  'edu:point:sound:where-from',
  'edu:say:chorus:hello',
  // S17
  'edu:compare:length:feather-arm',
  'edu:say:sound-words:crunch-shh',
  'edu:count:eggs:5',
  'edu:carry:gently:two-hands',
  // S18
  'edu:wait:quietly:count-10',
  'edu:count:arms:5',
  'edu:count:stars:7',
  'edu:clap:syllables:curator',
];
