/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Atlas A2, The Monkey and
 * the Monk (Journey to the West, China).
 *
 * Source: atlas-a02.ts (ATLAS_A02 and ATLAS_A02_VARIANTS). One EduScene per original scene, id
 * `sprout:<original id>`: every step scene, every done scene, every complete scene and both
 * variants. See EDU-STYLE.md.
 *
 * - Choice ids and `set` flags are copied from the originals so a02-believed still works. Every
 *   choice in A2 is a kind one, so this band keeps them all and needs no `defaultChoice`.
 * - Learning angles from the outline: the real monk Xuanzang and the Silk Road; reading a map
 *   and the compass (he went west); the Chinese zodiac stories (Monkey, Dragon, Horse and Pig
 *   all have a place in the Great Race); shadow-puppet theatre (light, shadow and flat figures).
 *   Plus counting, shapes, feelings, fire and water safety, spiders, and honest "I don't know".
 * - Care notes kept. The Buddha and Guanyin are wise and kind, never mocked. Demons are tricksters,
 *   not frights: nobody is hurt, a fight is a bump, a puff of dust. Monkey is "stopped", not
 *   hurt, under the mountain, with a friend beside him. The fire in the guest hall is a wrong
 *   thing done by greedy people, and every monk gets out. The six-eared monkey is spared. The
 *   ginseng fruit are "shaped like tiny babies" and the monk simply says no thank you.
 * - Sprout never goes dark: Red Boy's fire is a smoky fright, the bones are a chalky heap that
 *   was only a trick, and the novel's grim extras stay out, as they do in the main script.
 * - Nubbins never speak. The source's own characters talk, as canon 31 allows inside an Atlas.
 * - No lines from any translation, film or comic. All lines are new.
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
const MK = say('a02-monkey');
const MO = say('a02-monk');
const PG = say('a02-pigsy');
const SD = say('a02-sandy');
const GY = say('a02-guanyin');
const BU = say('a02-buddha');
const JE = say('a02-jade');
const HE = say('a02-herald');
const GB = say('a02-gibbon');
const TE = say('a02-teacher');
const GS = say('a02-gardener');
const QM = say('a02-queen');
const DR = say('a02-dragon');
const AB = say('a02-abbot');
const BR = say('a02-bear');
const GA = say('a02-gao');
const MS = say('a02-moksa');
const BM = say('a02-moon');
const PW = say('a02-wind');
const ZY = say('a02-zhenyuan');
const BN = say('a02-bone');
const SH = say('a02-silver');
const LL = say('a02-lao');
const RB = say('a02-redboy');
const FM = say('a02-false');
const IF = say('a02-ironfan');
const SS = say('a02-spider');
const TT = say('a02-turtle');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

/** One answer option. `best` marks the answer the lesson teaches. */
const opt = (label: string, reply: Line[], best = false): Opt =>
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

const notice = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | null,
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

// ================================================================== A2-1 Born from Stone
const Q01_SCENES: EduScene[] = [
  sc(
    'a02-01-page',
    [
      N('Nova’s big book opens to a painted mountain.'),
      N('Peach trees! A waterfall! Clouds like curly hair.'),
      N('Whoosh! You and your Nubbin step into the picture.'),
      N('Sniff, sniff. Everything smells of peaches.'),
      N('At the top sits a big stone egg. It is taller than you!'),
      N('Your Nubbin walks round the egg. Round once. Round twice.'),
    ],
    [
      doIt(
        5,
        'maths',
        'count to 2',
        'K.CC.B.4',
        'edu:count:laps:2',
        [N('(Count the trips round the egg on your fingers. One. Two.)')],
        'Your child counted two trips round the egg.',
      ),
    ],
    {
      choices: [
        {
          id: 'knock',
          label: 'Knock on the egg.',
          then: [N('Knock, knock! Something inside knocks back.')],
        },
        {
          id: 'sit',
          label: 'Sit down beside it and wait.',
          then: [N('You sit. Your Nubbin sits. The wind sits too.')],
        },
      ],
    },
  ),
  sc(
    'a02-01-page-done',
    [N('A wind comes and leans on the egg. Push, push, push!')],
    [
      notice(
        0,
        'science',
        'wind is moving air that pushes',
        'ELOF: Scientific Reasoning',
        [N('Wind is air on the move. It can push leaves, kites and eggs.')],
        'Your child heard that moving air can push things.',
      ),
    ],
  ),
  sc(
    'a02-01-hatch',
    [
      N('Crack! The egg breaks. A stone ball rolls out.'),
      N('The ball unfolds into a little grey monkey.'),
      N('He bows to the north. He bows to the south.'),
      N('He bows to the east. He bows to the west.'),
      MK('Ha! Who are you? You are very round for a rock.', 'happy'),
      N('Your Nubbin came out of an egg too. This is family!'),
      MK('A cousin! You can have some of the view.', 'happy'),
    ],
    [
      doIt(
        3,
        'social-studies',
        'four directions: north, south, east, west',
        'D2.Geo.2.K-2',
        'edu:point:compass:four-ways',
        [N('(Stand up. Bow four ways with Monkey: north, south, east, west.)')],
        'Your child named the four compass directions.',
      ),
    ],
  ),
  sc(
    'a02-01-hatch-done',
    [
      N('Monkey’s eyes shine gold. Two beams of light shoot up high.'),
      N('Far above, someone puts down his tea.'),
    ],
    [
      notice(
        0,
        'literacy',
        'rhyming words: gold, old, cold',
        'RF.K.2',
        [N('Gold! Gold rhymes with old and cold. Can you think of another?')],
        'Your child played with words that rhyme with "gold".',
      ),
    ],
  ),
  sc(
    'a02-01-heaven',
    [
      N('The page lifts. Now you sit on a cloud, high up.'),
      JE('Two beams of light! Who is making a fuss?', 'think'),
      HE('Only a little monkey, Majesty. Born this morning.'),
      JE('Let him play. Small things grow.', 'soft'),
      N('Your Nubbin leans over the cloud. It waves at a tiny grey dot.'),
      N('The tiny dot waves back!'),
    ],
    [
      ask(
        4,
        'science',
        'faraway things look small',
        'ELOF: Scientific Reasoning',
        [N('Monkey looks so tiny from the cloud. Why?')],
        [
          opt('He is far away', [N('Yes! Things that are far away look small.')], true),
          opt('He shrank', [
            N('He did not shrink. Far-away things just look small.'),
            N('When he is close, he looks big again.'),
          ]),
        ],
        'Your child learned that faraway things look smaller.',
      ),
    ],
  ),
  sc(
    'a02-01-complete',
    [
      N('By evening, Monkey has learned to walk, then climb.'),
      N('Next he eats peaches. Last he argues with the other monkeys.'),
      MK('Cousin! Tomorrow I will do something enormous.', 'happy'),
      N('Long ago, twelve animals ran a big race.'),
      N('Monkey came ninth. He still says it was close.'),
      N('He gives your Nubbin a peach. It is mostly bite marks!'),
      N('Your Nubbin holds it like treasure.'),
      N('Then your Nubbin breaks it in two and gives Monkey half.'),
    ],
    [
      ask(
        6,
        'sel',
        'sharing',
        'CASEL: Relationship skills',
        [N('Your Nubbin has one peach, and Monkey has none. What is kind?')],
        [
          opt('Share it', [N('Yes! Sharing is kind. Now they both have some.')], true),
          opt('Eat it all', [
            N('Then Monkey would be sad and hungry.'),
            N('Sharing is kinder. Your Nubbin shares.'),
          ]),
        ],
        'Your child chose sharing as the kind thing to do.',
      ),
    ],
  ),
];

// ================================================================== A2-2 The Water-Curtain Cave
const Q02_SCENES: EduScene[] = [
  sc(
    'a02-02-stream',
    [
      N('It is a hot day. The monkeys splash in the stream.'),
      GB('Where does all this water come from?'),
      N('So everyone goes to look. Everyone means everyone!'),
      N('The stream ends at a waterfall. It hangs like a white curtain.'),
      GB('Who goes through the curtain and comes back? That one is king!'),
      MK('I will go! Rocks do not mind water.', 'happy'),
      N('Your Nubbin steps up beside him. It likes waterfalls.'),
    ],
    [
      ask(
        1,
        'science',
        'streams come from rain on hills',
        'ELOF: Scientific Reasoning',
        [N('Where does the stream’s water come from?')],
        [
          opt('Rain on the hills', [N('Yes! Rain falls on the hills and runs down.')], true),
          opt('A big tap', [
            N('A tap on the hill? Silly! Rain falls there, and the water runs down.'),
            N('That is how a stream is born.'),
          ]),
        ],
        'Your child learned that streams are fed by rain running off hills.',
      ),
    ],
    {
      choices: [
        {
          id: 'careful',
          label: 'Tell them both to be careful.',
          then: [MK('Careful is for monkeys who are not going to be king.', 'happy')],
        },
        {
          id: 'count',
          label: 'Offer to count them in.',
          then: [
            MK('Yes! Count! Kings should start on a number.'),
            N('You count: one, two, three. Monkey goes on two.'),
          ],
        },
      ],
    },
  ),
  sc(
    'a02-02-stream-done',
    [N('Monkey crouches down. He shuts his eyes. He leaps!')],
    [
      notice(
        0,
        'literacy',
        'syllables in "waterfall"',
        'RF.K.2',
        [N('Clap the word: wa-ter-fall. Three claps for three parts.')],
        'Your child clapped the three syllables of "waterfall".',
      ),
    ],
  ),
  sc(
    'a02-02-leap',
    [
      N('Splash! Your Nubbin dives after him. You dive too.'),
      N('The water thunders. Then it stops.'),
      N('Behind the curtain it is dry! There is a cave.'),
      N('Stone beds. Stone pots. Stone bowls.'),
      MK('Nobody lives here! It has a front door made of waterfall!', 'happy'),
      N('Your Nubbin tries every stone bed. They are all just right.'),
    ],
    [
      doIt(
        3,
        'maths',
        'sort and count',
        'K.MD.B.3',
        'edu:sort:cave-things:kind',
        [N('(Point to each kind. How many beds? Pots? Bowls? Count together.)')],
        'Your child sorted cave things into kinds and counted each.',
      ),
    ],
  ),
  sc(
    'a02-02-leap-done',
    [
      N('Monkey shoots out through the water, shouting.'),
      N('Splash, splash, splash! Wet monkeys shoot in.'),
    ],
    [
      notice(
        0,
        'science',
        'sound is made by shaking',
        '1-PS4-1',
        [N('A waterfall is loud. Loud sounds are big shakes in the air.')],
        'Your child heard that sound comes from vibrations.',
      ),
    ],
  ),
  sc(
    'a02-02-king',
    [
      N('The monkeys make him king. Hooray!'),
      N('Many feasts go by. Then one night, the king cries.'),
      MK('One day I will be old. One day I will stop.', 'sad'),
      N('Monkey is scared. His eyes are wet.'),
      N('Your Nubbin climbs into his lap, to sit with him.'),
      GB('Some wise ones live for a very long time. Far away.'),
      MK('Then I will go and find them.'),
    ],
    [
      ask(
        4,
        'sel',
        'what helps when someone is scared',
        'CASEL: Social awareness',
        [N('Monkey is sad and scared. What helps?')],
        [
          opt('A hug and a friend', [N('Yes! Sitting close helps a lot.')], true),
          opt('Say hush', [
            N('Saying hush does not help much.'),
            N('A hug and a friend do. That is what Nubbin gives.'),
          ]),
        ],
        'Your child practised comforting a scared friend.',
      ),
    ],
    {
      choices: [
        {
          id: 'old',
          label: 'Tell him growing old isn’t the worst thing.',
          then: [
            MK('You say that because you are not a king.', 'think'),
            N('He keeps your Nubbin in his lap, though.'),
          ],
        },
        {
          id: 'go',
          label: 'Tell him to go and find out.',
          then: [MK('Yes. That is the right answer!', 'happy')],
        },
      ],
    },
  ),
  sc(
    'a02-02-complete',
    [
      N('In the morning the monkeys build a raft.'),
      N('They pile on fruit: one, two, three, four, five pieces.'),
      N('You and your Nubbin hop on too. Waving from shore is rude.'),
      MK('I will be back. And I will not ever have to stop.'),
      N('The raft goes out over the big water. Everyone waves and waves.'),
    ],
    [
      doIt(
        1,
        'maths',
        'count to 5',
        'K.CC.B.5',
        'edu:count:fruit:5',
        [N('(Count the fruit on the raft together. One, two, three, four, five.)')],
        'Your child counted five pieces of fruit.',
      ),
    ],
  ),
];

// ================================================================== A2-3 Lessons in Shape-Changing
const Q03_SCENES: EduScene[] = [
  sc(
    'a02-03-lesson',
    [
      N('High on a quiet mountain is a cave. A teacher lives there.'),
      TE('A monkey. You shall be called Sun Wukong. You are mostly noise.', 'soft'),
      N('Seven years go by. Monkey sweeps and sweeps the floor.'),
      TE('I can teach you fortunes, or sitting still, or medicines.'),
      MK('Will any of them make me live for ever?'),
      TE('No.'),
      MK('Then no, thank you.'),
      N('The teacher taps Monkey three times on the head. Tap, tap, tap!'),
      N('He walks out with his hands behind his back. Monkey grins.'),
    ],
    [
      doIt(
        7,
        'maths',
        'count to 3',
        'K.CC.B.4',
        'edu:tap:head:3',
        [N('(Gently tap your own head three times. One, two, three.)')],
        'Your child counted three taps.',
      ),
      notice(
        1,
        'literacy',
        'a name can have a meaning',
        'ELOF: Literacy',
        [N('Wukong is a name. It has a meaning, like many names do.')],
        'Your child heard that names often carry a meaning.',
      ),
    ],
    {
      choices: [
        {
          id: 'ask',
          label: 'Ask Monkey why he’s grinning.',
          then: [
            MK('Three taps. Come at the third watch of the night.', 'happy'),
            MK('Hands behind his back. Use the back door!'),
            MK('It is a secret. Do not tell Cousin. It cannot keep one.'),
          ],
        },
        {
          id: 'guess',
          label: 'Work it out for yourself.',
          then: [N('Three taps. Hands behind the back. Monkey winks at you.')],
        },
      ],
    },
  ),
  sc(
    'a02-03-night',
    [
      N('In the deep of the night, the back door opens a crack.'),
      N('Monkey slips in. You sit on the step outside.'),
      N('Your Nubbin falls asleep. Snore, snore, snore.'),
      N('Years of nights go by. Then Monkey comes out, walking on air!'),
      MK('I can be anything! And look at this!', 'happy'),
      N('He somersaults on a cloud. Whoosh! He is gone, then back.'),
    ],
    [
      ask(
        1,
        'science',
        'night and day',
        '1-ESS1-1',
        [N('Monkey comes in the night. When is it dark outside?')],
        [
          opt('At night', [N('Yes! The sky is dark at night, with stars.')], true),
          opt('At lunch time', [
            N('At lunch time the sun is high and bright.'),
            N('It is dark at night.'),
          ]),
        ],
        'Your child linked darkness to night-time.',
      ),
    ],
  ),
  sc(
    'a02-03-pine',
    [
      N('The other students gather under the pine trees.'),
      MK('A pine tree? Easy!'),
      N('Pop! Monkey is a pine tree. The students cheer.'),
      N('Your Nubbin copies. It holds its arms up very still.'),
      TE('Who is shouting in my yard?', 'angry'),
      N('Pop! The pine tree is a monkey again.'),
      TE('Showing off makes trouble. Go home, Monkey.', 'sad'),
    ],
    [
      ask(
        4,
        'sel',
        'listening and feelings',
        'CASEL: Self-awareness',
        [N('The teacher is cross. How does Monkey feel now?')],
        [
          opt('Sorry and sad', [N('Yes. He feels sorry. That is a big feeling.')], true),
          opt('Very proud', [
            N('He was proud. But now he is sorry and sad.'),
            N('Feelings can change very fast.'),
          ]),
        ],
        'Your child named a changing feeling.',
      ),
    ],
    {
      choices: [
        {
          id: 'speak',
          label: 'Tell the teacher Monkey meant no harm.',
          then: [TE('I know. That is the trouble. He never means any.', 'soft')],
        },
        {
          id: 'quiet',
          label: 'Stay out of it.',
          then: [N('You stay out of it. Your Nubbin, still a pine tree, does too.')],
        },
      ],
    },
  ),
  sc(
    'a02-03-complete',
    [
      N('Monkey bows to his teacher. All the way to the floor.'),
      MK('Hold on to my tail, Cousin’s keeper. I know a quick way.', 'soft'),
      N('One somersault. The world rolls by like a rug.'),
      N('Then there are peaches again!'),
      N('Your Nubbin tumbles onto the grass. It beams. Again, please!'),
    ],
    [
      notice(
        0,
        'social-studies',
        'bowing is a polite thing in China',
        'D2.Civ.8.K-2',
        [N('In China, a bow can mean thank you and respect.')],
        'Your child heard that bowing can show thanks and respect.',
      ),
    ],
  ),
];

// ================================================================== A2-4 Havoc in Heaven
const Q04_SCENES: EduScene[] = [
  sc(
    'a02-04-stables',
    [
      N('Heaven gives Monkey a job. He looks after the horses.'),
      MK('A grand title! They must think a lot of me.', 'happy'),
      N('The horses grow fat and shiny. Your Nubbin rides one.'),
      MK('What rank is horse-keeper, exactly?'),
      N('It is the smallest job in Heaven. Monkey throws down his hat.'),
      N('He goes straight home, cross as a cat.'),
    ],
    [
      ask(
        2,
        'science',
        'what animals need',
        'K-LS1-1',
        [N('The horses grow fat and shiny. What do horses need?')],
        [
          opt('Grass, water and care', [N('Yes! Food, water and care keep them well.')], true),
          opt('Only sweets', [
            N('Sweets are not good for a horse.'),
            N('Horses need grass, water and care.'),
          ]),
        ],
        'Your child named what a horse needs to live.',
      ),
    ],
  ),
  sc(
    'a02-04-stables-done',
    [JE('Give him the Peach Garden to look after. It will keep him busy.', 'think')],
    [
      notice(
        0,
        'sel',
        'a big feeling needs a good job to do',
        'CASEL: Self-management',
        [N('When we feel cross, a calm job can help, like digging, painting or walking.')],
        'Your child heard that a calming activity can help with a cross feeling.',
      ),
    ],
  ),
  sc(
    'a02-04-garden',
    [
      GS('So many trees, Great Sage! Seven rows of peaches.'),
      N('Your Nubbin goes very still. It looks at the peaches.'),
      MK('Thank you. You may go. I will inspect the trees alone.'),
      N('The spirit goes. Monkey climbs the oldest tree.'),
      N('He eats the best peach, then the next best. Then he naps.'),
      N('A ripe peach drops by your Nubbin’s feet. It glows a little.'),
    ],
    [
      doIt(
        0,
        'maths',
        'count to 7',
        'K.CC.B.5',
        'edu:count:rows:7',
        [N('(Count the rows of trees on your fingers. Seven!)')],
        'Your child counted seven rows of peach trees.',
      ),
      notice(
        5,
        'science',
        'a seed is inside the fruit',
        'ELOF: Scientific Reasoning',
        [
          N('Inside a peach is a big stone, and inside the stone is a seed.'),
          N('The seed can grow into a new peach tree.'),
        ],
        'Your child learned that fruit holds a seed that can grow into a tree.',
      ),
    ],
    {
      choices: [
        {
          id: 'hang',
          label: 'Hang the peach back on its branch.',
          then: [
            N('It will not stay. You put it gently at the foot of the tree.'),
            N('Your Nubbin sighs from its toes, and lets it go.'),
          ],
        },
        {
          id: 'sniff',
          label: 'Let your Nubbin sniff it, and no more.',
          then: [N('Sniff, sniff, sniff! It glows a little, then leaves it be.')],
        },
      ],
    },
  ),
  sc(
    'a02-04-banquet',
    [
      N('Seven fairy maidens come to pick peaches.'),
      N('(Count the maidens. One, two, three, four, five, six, seven.)'),
      N('They tell Monkey who is invited. Everyone, except him.'),
      MK('Everyone?', 'angry'),
      N('Monkey is hurt and cross. He makes the maidens freeze like statues.'),
      N('Then he eats the whole feast, and the magic pills too.'),
      MK('Oh. That might have been a mistake.', 'shock'),
      MK('Cousin! Home! Now!'),
    ],
    [
      ask(
        3,
        'sel',
        'being left out and what to do',
        'CASEL: Self-awareness',
        [N('Monkey was left out. How would that feel?')],
        [
          opt('Sad and cross', [N('Yes. Being left out feels sad and cross.')], true),
          opt('Happy', [
            N('Most people feel sad when they are left out.'),
            N('Monkey felt sad and cross.'),
          ]),
        ],
        'Your child named the feelings that come with being left out.',
      ),
    ],
  ),
  sc(
    'a02-04-complete',
    [
      N('Heaven sends its soldiers. Bonk! Bonk! Helmets ring like bells.'),
      MK('Equal to Heaven? I am better than equal. Tell them, Cousin.', 'happy'),
      N('Your Nubbin hides behind a rock. It would rather not.'),
      N('The fairy maidens unfreeze at last and see the empty trees.'),
      N('They hurry off to tell the Queen Mother.'),
    ],
    [
      notice(
        0,
        'music',
        'loud and quiet sounds',
        'ELOF: Perceptual, Motor, and Physical Development',
        [
          N('A helmet can ring like a drum.'),
          N('(Tap softly on the table. Now tap loudly. Can you hear the difference?)'),
        ],
        'Your child noticed loud and quiet sounds.',
      ),
    ],
  ),
];

// ================================================================== A2-5 Under the Mountain
const Q05_SCENES: EduScene[] = [
  sc(
    'a02-05-furnace',
    [
      N('Monkey is hard to stop. So Lord Lao puts him in a furnace.'),
      N('For forty-nine days, the fire burns. Your Nubbin waits, like a good friend.'),
      N('Monkey hides in the one corner that is only wind.'),
      N('Out he jumps! His eyes are two little suns.'),
      MK('Cousin! You waited. I am going to be rude to everyone.', 'happy'),
      N('He runs the length of Heaven. Generals tumble like skittles.'),
    ],
    [
      ask(
        1,
        'health',
        'staying back from fire',
        'CASEL: Responsible decision-making',
        [N('The furnace is very hot. What do we do near a hot fire?')],
        [
          opt('Stay well back', [N('Yes! Hot things can burn. We stay well back.')], true),
          opt('Touch it', [N('Ouch! Hot things burn.'), N('We stay well back from a fire.')]),
        ],
        'Your child learned to stay well back from fire.',
      ),
    ],
  ),
  sc(
    'a02-05-furnace-done',
    [JE('Fetch the Buddha. Ask him, please, to come.', 'sad')],
    [
      notice(
        0,
        'sel',
        'asking for help is brave',
        'CASEL: Relationship skills',
        [N('Even a big, strong emperor asks for help sometimes. That is wise.')],
        'Your child heard that asking for help is wise.',
      ),
    ],
  ),
  sc(
    'a02-05-palm',
    [
      N('The Buddha comes in quietly. Everything goes quiet.'),
      BU('What is it you want?', 'soft'),
      MK('The big throne. It is my turn.'),
      BU('Then jump out of my right hand, and it is yours.'),
      MK('Your hand is tiny! I go far in one somersault!', 'happy'),
      N('Monkey jumps onto the palm. Zoom! He is gone.'),
      N('He flies to five pink pillars at the edge of the world.'),
      N('He writes his name on the middle one. But look: the pillars are fingers!'),
    ],
    [
      doIt(
        6,
        'maths',
        'count to 5 on your fingers',
        'K.CC.B.4',
        'edu:count:fingers:5',
        [N('(Hold up one hand. Count the five fingers, one by one.)')],
        'Your child counted five fingers.',
      ),
    ],
    {
      choices: [
        {
          id: 'gentle',
          label: 'When he lands, tell him gently: it was the hand all along.',
          then: [MK('Rubbish! I went to the end of the world.', 'angry')],
        },
        {
          id: 'quiet',
          label: 'Say nothing. Let the Buddha show him.',
          then: [N('You say nothing. The Buddha glances at you, and his face says thank you.')],
        },
      ],
    },
  ),
  sc(
    'a02-05-palm-done',
    [
      N('The Buddha lifts his hand. On one finger is a name, in tiny writing.'),
      MK('That cannot be. I went…', 'shock'),
    ],
    [
      ask(
        0,
        'literacy',
        'writing carries a message',
        'ELOF: Literacy',
        [N('Someone wrote a name on the finger. Who wrote it?')],
        [
          opt('Monkey did', [N('Yes. Monkey wrote it, on a finger!')], true),
          opt('The Buddha did', [N('The Buddha did not. Monkey did.')]),
        ],
        'Your child understood that writing records a message from a writer.',
      ),
    ],
  ),
  sc(
    'a02-05-mountain',
    [
      N('The Buddha turns his hand over. It becomes a mountain.'),
      N('Monkey is under it. He is not hurt, only stopped.'),
      BU('Feed him when he is hungry. Give him water when he is thirsty.', 'soft'),
      MK('For how long?', 'sad'),
      BU('Until he has learned. Then someone will come.'),
      N('Your Nubbin sits by his free hand. Monkey holds its foot.'),
    ],
    [
      ask(
        4,
        'sel',
        'sitting with a friend who is sad',
        'CASEL: Social awareness',
        [N('Monkey is sad and stuck. How does your Nubbin help?')],
        [
          opt('It stays beside him', [N('Yes. Being there is a big help.')], true),
          opt('It runs away', [
            N('It does not run away. It stays.'),
            N('Staying beside a sad friend helps.'),
          ]),
        ],
        'Your child saw that staying beside a sad friend is a help.',
      ),
    ],
  ),
  sc(
    'a02-05-complete',
    [
      N('The Queen Mother of the West brings a dish of peaches.'),
      QM('You stood by my trees and took nothing. This one is given.', 'soft'),
      N('Your Nubbin eats it slowly and glows like a lantern.'),
      QM('Keep the stone. Plant it where you will be glad to see it.'),
      N('The page turns, and turns. Many years pass.'),
      N('Moss grows on Monkey’s hand. Your Nubbin keeps its foot there.'),
    ],
    [
      notice(
        4,
        'science',
        'plants grow from seeds, slowly',
        'ELOF: Scientific Reasoning',
        [N('A peach stone is a seed. It grows into a tree, slowly.')],
        'Your child heard that some things in nature change very slowly.',
      ),
    ],
  ),
];

// ================================================================== A2-6 The Monk
const Q06_SCENES: EduScene[] = [
  sc(
    'a02-06-road',
    [
      N('A monk comes along the road on a pale horse.'),
      N('He has a bowl, a staff, a robe, and far too much luggage.'),
      MO('Good morning. Is this the road west?'),
      MO('I am Tang Sanzang. I must fetch books from India.', 'think'),
      MO('You carry nothing. I carry everything. May I ask for help?'),
      N('You take the luggage. Your Nubbin climbs on top of it.'),
      MO('Thank you. You are my second disciple. I keep forgetting the horse.', 'happy'),
    ],
    [
      ask(
        3,
        'social-studies',
        'the sun sets in the west',
        'D2.Geo.2.K-2',
        [N('The monk walks west. Where does the sun go down?')],
        [
          opt('In the west', [N('Yes! The sun sets in the west. The monk follows it.')], true),
          opt('In the east', [
            N('The sun comes up in the east.'),
            N('It goes down in the west, where the monk is going.'),
          ]),
        ],
        'Your child learned that the sun sets in the west.',
      ),
      ask(
        5,
        'maths',
        'heavier and lighter',
        'K.MD.A.2',
        [N('Your Nubbin sits on the luggage. Is it heavier or lighter now?')],
        [
          opt('Heavier', [N('Yes! More weight on top makes it heavier.')], true),
          opt('Lighter', [N('Not lighter. Your Nubbin adds weight.'), N('So it is heavier now.')]),
        ],
        'Your child compared a load with and without an extra weight.',
      ),
    ],
  ),
  sc(
    'a02-06-road-done',
    [N('From the mountain ahead, a voice shouts. Loud!'), N('It shakes the leaves.')],
    [
      ask(
        0,
        'literacy',
        'loud and quiet voices',
        'ELOF: Language and Communication',
        [N('Is that a shout, or a whisper?')],
        [
          opt('A shout', [N('Yes! A shout is a big loud voice.')], true),
          opt('A whisper', [
            N('A whisper is very quiet. This voice shakes leaves!'),
            N('That is a shout.'),
          ]),
        ],
        'Your child told a shout from a whisper.',
      ),
    ],
  ),
  sc(
    'a02-06-seal',
    [
      MK('Master! You came! A lady told me to wait for a monk!', 'happy'),
      N('Monkey’s head sticks out of the mountain. There is grass in his ears.'),
      MK('Cousin! You are still here.', 'soft'),
      MO('Oh dear. Are you a demon?', 'shock'),
      MK('I am your disciple. Please peel the paper off the top.'),
      N('The monk climbs. You hold his staff and push.'),
      N('At the top is a strip of gold paper. He peels it, gently.'),
    ],
    [
      ask(
        4,
        'maths',
        'top and bottom',
        'K.G.A.1',
        [N('Where is the gold paper? At the top, or the bottom?')],
        [
          opt('At the top', [N('Yes! Up at the top of the mountain.')], true),
          opt('At the bottom', [
            N('Monkey is at the bottom, by the grass.'),
            N('The paper is at the top.'),
          ]),
        ],
        'Your child used the words top and bottom.',
      ),
    ],
  ),
  sc(
    'a02-06-seal-done',
    [
      N('The mountain splits like bread. Monkey bounds out!'),
      N('He bows to the monk four times. Then he hugs your Nubbin.'),
      MK('Right! Where are we going? India? Easy! We will be there by lunch!', 'happy'),
    ],
    [
      ask(
        1,
        'sel',
        'saying thank you',
        'CASEL: Relationship skills',
        [N('Monkey bows to say thank you. What do we say when someone helps us?')],
        [
          opt('Thank you', [N('Yes! Thank you. Say it with Monkey.')], true),
          opt('Nothing', [N('We can say something kind.'), N('Thank you makes a helper smile.')]),
        ],
        'Your child practised saying thank you.',
      ),
    ],
  ),
  sc(
    'a02-06-band',
    [
      N('Six robbers jump out of the trees. Boo!'),
      N('Monkey chases them over three hills. Soon they are gone.'),
      MO('You frightened them! A monk must not do that.', 'angry'),
      MK('I just helped, and this is the thanks?', 'angry'),
      N('Monkey somersaults away. The road is empty.'),
      N('A kind old lady gives the monk a cap with a gold band.'),
      N('Monkey comes back and puts it on. He likes it.'),
      N('The monk says some quiet words. The band gets snug!'),
      N('Monkey hops round the road, holding his head.'),
    ],
    [
      doIt(
        0,
        'maths',
        'count to 6',
        'K.CC.B.5',
        'edu:count:robbers:6',
        [N('(Count the robbers on your fingers. One to six.)')],
        'Your child counted six robbers.',
      ),
      ask(
        2,
        'sel',
        'what to do instead of scaring people',
        'CASEL: Responsible decision-making',
        [N('The monk says Monkey scared them. What could Monkey do instead?')],
        [
          opt('Ask them to stop', [N('Yes! Asking kindly can work too.')], true),
          opt('Scare them more', [
            N('That would frighten them even more.'),
            N('Asking them to stop is kinder.'),
          ]),
        ],
        'Your child thought about a kinder way to stop trouble.',
      ),
    ],
    {
      choices: [
        {
          id: 'stop',
          label: 'Ask the monk to stop.',
          then: [
            MO('Oh! Yes. I had no idea it was so strong.', 'shock'),
            MO('I will only use it when I must. I promise.'),
          ],
        },
        {
          id: 'wait',
          label: 'Wait. He’s stopping already.',
          then: [N('The monk stops at once. He looks as shaken as Monkey.')],
        },
      ],
    },
  ),
  sc(
    'a02-06-complete',
    [
      N('Monkey tugs at the band. It will not come off.'),
      MK('Fine. I will behave. Mostly. Some of the time.', 'sad'),
      MO('That is all anyone can promise.', 'soft'),
      N('You pick up the luggage. Your Nubbin climbs on.'),
      N('The monk, Monkey, you, your Nubbin, and the horse go west.'),
    ],
    [
      doIt(
        4,
        'maths',
        'count to 5',
        'K.CC.B.5',
        'edu:count:travellers:5',
        [N('(Count them: monk, Monkey, you, Nubbin, horse. How many?)')],
        'Your child counted five travellers.',
      ),
    ],
  ),
];

// ================================================================== A2-7 The White Dragon Horse
const Q07_SCENES: EduScene[] = [
  sc(
    'a02-07-stream',
    [
      N('Eagle Grief Stream runs fast and green between steep rocks.'),
      N('The horse does not like it. Your Nubbin does not either.'),
      N('Splash! A white dragon swoops up. It carries off the horse!'),
      MO('My horse! How will I cross the world now?', 'sad'),
      MK('I will get it back. Wait there.', 'angry'),
      MK('It will not come out. Water is cheating.', 'angry'),
      N('Your Nubbin peeks into the stream. It sees a long white shape, sulking.'),
    ],
    [
      ask(
        0,
        'science',
        'streams flow downhill',
        'ELOF: Scientific Reasoning',
        [N('The stream rushes between the rocks. Which way does water run?')],
        [
          opt('Downhill', [N('Yes! Water runs down, from high to low.')], true),
          opt('Uphill', [
            N('Water does not run uphill by itself.'),
            N('It runs downhill. That is why the stream is so quick!'),
          ]),
        ],
        'Your child learned that water flows downhill.',
      ),
    ],
  ),
  sc(
    'a02-07-stream-done',
    [
      MK('Local spirits say a lady put that dragon here.'),
      MK('I know which lady. I will fetch her.'),
    ],
    [
      ask(
        0,
        'literacy',
        'where a story happens',
        'RL.K.3',
        [N('Where are our friends now? In a cave, or by a stream?')],
        [
          opt('By a stream', [N('Yes! By Eagle Grief Stream.')], true),
          opt('In a cave', [
            N('Not a cave this time.'),
            N('They are by a stream, with rushing water.'),
          ]),
        ],
        'Your child named the setting of the scene.',
      ),
    ],
  ),
  sc(
    'a02-07-guanyin',
    [
      N('A soft light comes over the water, like morning.'),
      N('In it stands a lady with a vase and a willow branch.'),
      N('You know her kind eyes. She was the old woman on the road!'),
      MK('You gave him the band!', 'angry'),
      GY('I did. You are clever, Monkey. Clever ones need a friend beside them.', 'soft'),
      N('Your Nubbin gives her a pebble, its very best gift. She smiles.'),
    ],
    [
      notice(
        4,
        'science',
        'willow trees grow by water',
        'ELOF: Scientific Reasoning',
        [N('Willow trees love water. They often grow beside streams and ponds.')],
        'Your child heard that willow trees grow near water.',
      ),
    ],
  ),
  sc(
    'a02-07-dragon',
    [
      GY('Prince Yulong, come up. The monk is on your bank.', 'soft'),
      N('The white dragon rises up, dripping and ashamed.'),
      DR('I did not know who he was. I was hungry, and cross, and sad.', 'sad'),
      GY('Then be something better. Carry him all the way.'),
      N('She touches him with the willow branch. He shrinks, and changes.'),
      N('Now a white horse stands on the bank. He shakes his mane. Splash!'),
    ],
    [
      ask(
        2,
        'sel',
        'saying sorry',
        'CASEL: Relationship skills',
        [N('The dragon says he is sorry. Why does saying sorry help?')],
        [
          opt('It shows you care', [N('Yes! Sorry says: I know I was wrong.')], true),
          opt('It does not help', [
            N('It does help. Sorry shows you care about the other person.'),
          ]),
        ],
        'Your child heard why saying sorry helps.',
      ),
    ],
    {
      choices: [
        {
          id: 'peach',
          label: 'Let your Nubbin give the horse its peach stone to sniff.',
          then: [N('The horse sniffs the stone and blows softly. A friendship begins.')],
        },
        {
          id: 'stroke',
          label: 'Stroke his nose.',
          then: [N('He lets you. His nose is cool, like the inside of a river.')],
        },
      ],
    },
  ),
  sc(
    'a02-07-complete',
    [
      N('Guanyin gives Monkey three willow hairs, for when he needs them.'),
      MO('A dragon. I am riding a dragon!', 'happy'),
      MK('Nobody at home will believe that. Get used to it.'),
      N('The white horse carries the monk with great care.'),
    ],
    [
      ask(
        1,
        'social-studies',
        'the Chinese zodiac: Dragon is fifth, Horse is seventh',
        'D2.His.2.K-2',
        [N('In an old race, Dragon was fifth and Horse was seventh. Who was ahead?')],
        [
          opt('Dragon was ahead of Horse', [N('Yes! Fifth comes before seventh.')], true),
          opt('Horse was ahead of Dragon', [
            N('Dragon was fifth, and Horse was seventh.'),
            N('So Dragon was ahead. Five comes before seven!'),
          ]),
        ],
        'Your child compared the order of two zodiac animals.',
      ),
    ],
  ),
];

// ================================================================== A2-8 The Stolen Robe
const Q08_SCENES: EduScene[] = [
  sc(
    'a02-08-hall',
    [
      N('The monastery is rich. The abbot is very old.'),
      N('He has so many robes. He shows you every one.'),
      AB('Has anyone ever seen more?', 'happy'),
      MK('My master has one better. Show him, master.'),
      MO('Please, no. Never show off to a collector.', 'think'),
      N('Monkey shows it anyway. The whole hall fills with light.'),
      AB('Oh my. May I borrow it, just for tonight?', 'soft'),
    ],
    [
      doIt(
        1,
        'maths',
        'sort by colour',
        'K.MD.B.3',
        'edu:sort:robes:colour',
        [N('(Sort the robes by colour: reds here, blues there. Count each pile.)')],
        'Your child sorted robes into colour groups.',
      ),
    ],
  ),
  sc(
    'a02-08-fire',
    [
      N('In the night, your Nubbin wakes you. Smoke is under the door!'),
      N('Greedy monks lit the fire. They want to keep the robe.'),
      N('Monkey is already awake. He spreads a cover over the monk.'),
      MK('And now a little wind.', 'angry'),
      N('Whoosh! The wind turns the fire away from the guest hall.'),
      N('Your Nubbin tugs your sleeve towards where the young monks sleep.'),
    ],
    [
      ask(
        1,
        'health',
        'what to do if you smell smoke',
        'CASEL: Responsible decision-making',
        [N('There is smoke! What should we do?')],
        [
          opt('Get out and tell a grown-up', [N('Yes! Get out fast and tell a grown-up.')], true),
          opt('Hide under the bed', [
            N('Hiding is not safe.'),
            N('Get out, stay low, and tell a grown-up.'),
          ]),
        ],
        'Your child learned to leave and tell a grown-up if there is smoke.',
      ),
    ],
    {
      choices: [
        {
          id: 'shout',
          label: 'Run and shout until every monk is out.',
          then: [
            N('You run and shout. Monks tumble out in their nightclothes. All safe!'),
            MK('You are rescuing them? They lit it!', 'shock'),
            N('Monkey grumbles. Then he blows the fire away from the beds.'),
          ],
        },
        {
          id: 'wake',
          label: 'Wake the monk. He would want to know.',
          then: [
            MO('Fire? Then everyone out. I do not care who started it.', 'shock'),
            N('Monkey groans, and blows the fire away from the beds.'),
          ],
        },
      ],
    },
  ),
  sc(
    'a02-08-fire-done',
    [
      N('On the hill, a big black bear comes down. He says he will help.'),
      N('He does not help. He finds the robe instead!'),
      N('By morning the robe is gone, and so is the bear.'),
    ],
    [
      doIt(
        2,
        'literacy',
        'what happened first, next and last',
        'RL.K.3',
        'edu:order:story:fire',
        [N('(What came first? Smoke. Next? The wind. Last? The robe was gone.)')],
        'Your child put three story events in order.',
      ),
    ],
  ),
  sc(
    'a02-08-bear',
    [
      N('On Black Wind Mountain, the Black Bear plans a party.'),
      N('Guanyin comes, looking like the Bear’s friend.'),
      N('Monkey turns into a tiny round pill. You carry him on a dish.'),
      BR('A gift from my friend! How kind.', 'happy'),
      N('He swallows it. Gurgle. Rumble. Somersaults inside the Bear!'),
      BR('Ow! All right! Take the robe!', 'shock'),
    ],
    [
      ask(
        2,
        'maths',
        'a round shape is a circle',
        'K.G.A.2',
        [N('The pill is small and round. What shape is it?')],
        [
          opt('A circle', [N('Yes! A circle, round all the way.')], true),
          opt('A square', [
            N('A square has four corners. This pill has none.'),
            N('It is a circle.'),
          ]),
        ],
        'Your child named a circle.',
      ),
    ],
    {
      choices: [
        {
          id: 'sorry',
          label: 'Tell the Bear you’re sorry about his tummy.',
          then: [BR('So am I. You are the only one who said so.', 'sad')],
        },
        {
          id: 'robe',
          label: 'Hold out your arms for the robe.',
          then: [N('The robe comes back, warm and a little smoky. Your Nubbin smooths it flat.')],
        },
      ],
    },
  ),
  sc(
    'a02-08-complete',
    [
      N('Monkey pops out of the Bear’s mouth. He looks pleased.'),
      GY('You are strong. Come and guard my mountain. It is a good job.', 'soft'),
      BR('Yes. All right. Thank you. I think.', 'sad'),
      N('At the monastery, the monks sweep up very quietly.'),
      N('The monk gives them the last of his rice.'),
    ],
    [
      notice(
        1,
        'sel',
        'people can get a second chance',
        'CASEL: Social awareness',
        [N('Guanyin gives the Bear a new job. Everyone can try again.')],
        'Your child heard that people can be given another chance.',
      ),
    ],
  ),
];

// ================================================================== A2-9 Pigsy
const Q09_SCENES: EduScene[] = [
  sc(
    'a02-09-gao',
    [
      GA('A strong young man came here three years ago.', 'sad'),
      GA('He ploughed without an ox. Then his face began to change.'),
      GA('Now he has big ears and a long snout. He eats so much!'),
      GA('He keeps my daughter in the back house. Can you help?'),
      MK('Big ears, big snout, big appetite? I will sort it. I need a dress.', 'happy'),
      MO('A what?', 'shock'),
    ],
    [
      ask(
        2,
        'science',
        'which animal has a snout',
        'ELOF: Scientific Reasoning',
        [N('Big ears and a long snout. Which animal does that sound like?')],
        [
          opt('A pig', [N('Yes! A pig has a snout and big ears.')], true),
          opt('A bird', [
            N('A bird has a beak, not a snout.'),
            N('Big ears and a snout sound like a pig.'),
          ]),
        ],
        'Your child matched body parts to an animal.',
      ),
    ],
  ),
  sc(
    'a02-09-backhouse',
    [
      N('Miss Gao goes safely home to her father.'),
      N('In her bed lies Monkey, in a nightcap. He looks silly.'),
      N('You and your Nubbin hide behind a screen. Shh!'),
      N('The door blows open. In comes a round, bristly fellow with flowers.'),
      PG('I brought flowers. Why are you so hairy tonight, my dear?', 'soft'),
      MK('I am not well.', 'sad'),
      N('Monkey sits up and pulls off the nightcap. Surprise!'),
      N('The fellow squeals and zooms out of the window.'),
    ],
    [
      doIt(
        2,
        'sel',
        'staying quiet and still',
        'CASEL: Self-management',
        'edu:hush:finger-on-lips',
        [N('(Put a finger on your lips. Hide as still as a mouse. Shh!)')],
        'Your child practised staying quiet and still.',
      ),
    ],
  ),
  sc(
    'a02-09-backhouse-done',
    [N('Your Nubbin picks up the dropped flowers. Somebody ought to.')],
    [
      notice(
        0,
        'science',
        'picked flowers still need water',
        'K-LS1-1',
        [N('Picked flowers still need water. Your Nubbin finds a cup for them.')],
        'Your child heard that plants need water and light.',
      ),
    ],
  ),
  sc(
    'a02-09-cave',
    [
      N('Monkey and the fellow fight all night. Staff against rake.'),
      N('The rake has nine teeth. Clang, clang!'),
      PG('Who are you? What are you doing here?', 'angry'),
      MK('I escort a monk to fetch books. Tang Sanzang.'),
      N('The rake drops. The pig-faced fellow goes pink.'),
      PG('The lady told me to wait for him! I got hungry while I waited.', 'shock'),
    ],
    [
      doIt(
        1,
        'maths',
        'count to 9',
        'K.CC.B.5',
        'edu:count:teeth:9',
        [N('(Count the nine teeth of the rake on your fingers.)')],
        'Your child counted nine teeth on a rake.',
      ),
      ask(
        5,
        'sel',
        'waiting is hard; calming ideas help',
        'CASEL: Self-management',
        [N('Waiting is hard when you are hungry. What helps us wait?')],
        [
          opt('Singing or counting', [N('Yes! Singing, counting and deep breaths help.')], true),
          opt('Giving up', [
            N('Giving up is easy, but waiting was worth it.'),
            N('Singing or counting makes waiting easier.'),
          ]),
        ],
        'Your child heard calming ideas for waiting.',
      ),
    ],
    {
      choices: [
        {
          id: 'flowers',
          label: 'Let your Nubbin give him back his flowers.',
          then: [PG('You kept them! Oh, you good little thing. I like you.', 'happy')],
        },
        {
          id: 'welcome',
          label: 'Tell him there’s room on the road.',
          then: [PG('Is there room for lunch on the road? That is the main thing.', 'happy')],
        },
      ],
    },
  ),
  sc(
    'a02-09-complete',
    [
      N('He walks back to Gao Village with his rake on his shoulder.'),
      MO('You shall be called Bajie. It means Eight Rules.', 'soft'),
      PG('Pigsy for short. Everyone does.'),
      PG('Keep my room for me, will you? Just in case.'),
      N('Pigsy carries the luggage pole for a whole mile.'),
    ],
    [
      notice(
        1,
        'social-studies',
        'the Pig is the last animal in the Chinese zodiac',
        'D2.His.2.K-2',
        [N('The Pig came last in the old race. Pigsy is a pig.')],
        'Your child heard that the pig is the twelfth zodiac animal.',
      ),
    ],
  ),
];

// ================================================================== A2-10 Sandy
const Q10_SCENES: EduScene[] = [
  sc(
    'a02-10-river',
    [
      N('The River of Flowing Sands is wide, and the colour of weak tea.'),
      N('A stone says not even a feather floats on it.'),
      N('Your Nubbin drops a feather in. Plop! It sinks.'),
      PG('Well, that is that. Back to Gao Village!', 'happy'),
      N('A big blue-faced river spirit rises out of the water.'),
      N('Monkey and Pigsy splash and bellow. They come up spitting sand.'),
    ],
    [
      doIt(
        2,
        'science',
        'sink or float',
        '2-PS1-1',
        'edu:sort:things:sink-float',
        [N('(Try a leaf, a spoon and a stone in water. Sink or float?)')],
        'Your child sorted objects by whether they sink or float.',
      ),
    ],
  ),
  sc(
    'a02-10-under',
    [
      N('Your Nubbin slips into the river. You hold your breath and follow.'),
      N('Down in the brown water, the river spirit sits alone.'),
      N('He is not frightening here. He looks like he has waited a long time.'),
      SD('Every traveller wants to fight me or run away.', 'sad'),
      SD('I used to work in Heaven. I broke one crystal cup. One!', 'sad'),
      N('Your Nubbin pats his knee. He pats it back.'),
    ],
    [
      ask(
        3,
        'sel',
        'being kind to someone lonely',
        'CASEL: Social awareness',
        [N('Sandy is lonely. What does your Nubbin do to help?')],
        [
          opt('Pats his knee', [N('Yes! A pat says: I am here, friend.')], true),
          opt('Swims away', [
            N('Your Nubbin does not swim away.'),
            N('A pat and a smile help a lonely friend.'),
          ]),
        ],
        'Your child saw a kind way to help someone who is lonely.',
      ),
    ],
  ),
  sc(
    'a02-10-under-done',
    [
      N('You come up gasping. Big breath in!'),
      N('Monkey has somersaulted off to the South Sea to fetch help.'),
    ],
    [
      doIt(
        0,
        'health',
        'a slow, calming breath',
        'ELOF: Perceptual, Motor, and Physical Development',
        'edu:breathe:slow:in-out',
        [N('(Breathe in slowly, and out slowly, like blowing a feather. Twice.)')],
        'Your child practised slow breathing.',
      ),
    ],
  ),
  sc(
    'a02-10-moksa',
    [
      N('Monkey comes back with Moksa. He carries a small red gourd.'),
      MS('Sha Wujing! The monk you were waiting for is on the bank. Come up.'),
      N('The river spirit comes up. He kneels on the sand.'),
      SD('I did not know. He looks so ordinary.', 'shock'),
      MO('I am very ordinary. That is rather the point.', 'soft'),
      N('Moksa puts the gourd on the water. It grows into a raft!'),
    ],
    [
      ask(
        5,
        'science',
        'a raft floats',
        '2-PS1-1',
        [N('The gourd grows into a raft. Will a raft sink or float?')],
        [
          opt('Float', [N('Yes! A raft floats and carries us over the water.')], true),
          opt('Sink', [N('A raft is made to float.'), N('It floats, so it carries us over.')]),
        ],
        'Your child predicted that a raft floats.',
      ),
    ],
    {
      choices: [
        {
          id: 'pole',
          label: 'Offer Sandy the other end of the luggage pole.',
          then: [
            SD('Thank you. I like carrying things. You know where you are with a weight.', 'soft'),
          ],
        },
        {
          id: 'raft',
          label: 'Help Sandy load the raft.',
          then: [
            N('He loads it neatly, heaviest at the bottom.'),
            N('Pigsy sits on the lightest bit and calls it helping.'),
          ],
        },
      ],
    },
  ),
  sc(
    'a02-10-complete',
    [
      N('The raft crosses the wide river in an afternoon.'),
      MO('Wujing. We shall call you Sandy.', 'soft'),
      MO('Wukong, Bajie, Wujing, the horse, and you. I have the count right!', 'happy'),
      N('Now there are six of you, and the horse.'),
      N('Sandy takes the back of the pole. You take the front.'),
    ],
    [
      doIt(
        3,
        'maths',
        'count to 6',
        'K.CC.B.5',
        'edu:count:pilgrims:6',
        [N('(Count the friends: monk, Monkey, Pigsy, Sandy, you, Nubbin. Six!)')],
        'Your child counted six travelling friends.',
      ),
    ],
  ),
];

// ================================================================== A2-11 The Ginseng Fruit
const Q11_SCENES: EduScene[] = [
  sc(
    'a02-11-temple',
    [
      N('The temple is quiet and lovely. Its master is away.'),
      N('Two young helpers look after it: Bright Moon and Pure Wind.'),
      BM('Our master said a monk would come. We must give him two fruits.'),
      PW('They ripen once in a very, very long time.'),
      N('They bring two fruits on a dish. Each looks like a tiny sleeping baby.'),
      MO('No thank you. Please take them away.', 'shock'),
      N('So the helpers eat them in the kitchen. Pigsy listens at the wall.'),
      N('He makes a small, hungry sound.'),
    ],
    [
      ask(
        5,
        'sel',
        'saying no politely',
        'CASEL: Relationship skills',
        [N('The monk says no, kindly. What do we say instead of yuck?')],
        [
          opt('No thank you', [N('Yes! No thank you is polite and clear.')], true),
          opt('Yuck!', [N('Yuck can hurt feelings.'), N('No thank you is kinder.')]),
        ],
        'Your child practised saying no politely.',
      ),
    ],
  ),
  sc(
    'a02-11-tree',
    [
      PG('Brother. Wise brother. Just three. One each. Nobody would notice.', 'soft'),
      N('Monkey knocks a fruit down. It sinks into the ground like water.'),
      N('He knocks down three more. Monkey, Pigsy and Sandy eat one each.'),
      PG('I did not taste it! I swallowed it whole!', 'sad'),
      N('The helpers count their fruit. They come back shouting.'),
      MK('Then nobody gets any!', 'angry'),
      N('Monkey pushes the whole tree over. Its roots come up out of the ground.'),
    ],
    [
      notice(
        6,
        'science',
        'roots hold a tree and drink water',
        '2-LS2-1',
        [N('Roots hold a tree in the ground.'), N('Roots drink water, too. A tree needs both.')],
        'Your child heard that roots anchor a plant and take in water.',
      ),
    ],
    {
      choices: [
        {
          id: 'own',
          label: 'Tell the acolytes the truth: you saw it all.',
          then: [
            BM('Thank you. At least someone is honest.', 'sad'),
            N('Monkey glares at you. Then he stops glaring.'),
          ],
        },
        {
          id: 'tree',
          label: 'Go and kneel by the fallen tree.',
          then: [N('Its leaves are curling. Your Nubbin lies down beside the roots.')],
        },
      ],
    },
  ),
  sc(
    'a02-11-tree-done',
    [
      N('The master comes home that night. He sweeps up all of you, gently.'),
      ZY('Mend my tree, and I will let you go.', 'angry'),
    ],
    [
      notice(
        0,
        'sel',
        'mending a mistake',
        'CASEL: Responsible decision-making',
        [N('When we break something, we can help mend it. That is brave.')],
        'Your child heard that fixing a mistake is brave and helpful.',
      ),
    ],
  ),
  sc(
    'a02-11-mend',
    [
      N('Monkey searches three islands for a cure. Nobody has one.'),
      N('At last he goes to the South Sea. Guanyin comes with her vase.'),
      GY('Bring water, in jade cups. Pour gently.', 'soft'),
      N('You carry cup after cup. Your Nubbin has a very small cup.'),
      N('It pours very slowly, and gets most of it in.'),
      N('Guanyin sprinkles dew, and the tree stands up! Its leaves are green and glossy.'),
    ],
    [
      ask(
        2,
        'science',
        'plants need water',
        '2-LS2-1',
        [N('The tree is drooping. What does it need most?')],
        [
          opt('Water', [N('Yes! Water helps a thirsty tree stand tall.')], true),
          opt('A hat', [N('A hat is fun, but trees need water.')]),
        ],
        'Your child said that plants need water.',
      ),
      ask(
        3,
        'maths',
        'bigger and smaller cups',
        'K.MD.A.2',
        [N('Which holds more water: the big jade cup, or your Nubbin’s small cup?')],
        [
          opt('The big cup', [N('Yes! The big cup holds more.')], true),
          opt('The small cup', [N('The small cup holds less. The big cup holds more.')]),
        ],
        'Your child compared how much two cups hold.',
      ),
    ],
  ),
  sc(
    'a02-11-complete',
    [
      ZY('That is the most trouble in a thousand years. Come and eat.', 'happy'),
      N('There is a feast. This time the monk eats one fruit.'),
      MO('It tastes like the first morning of spring.', 'soft'),
      N('Master Zhenyuan and Monkey promise to be brothers.'),
      N('Monkey looks a little shy, which is new.'),
    ],
    [
      ask(
        2,
        'literacy',
        'words for tastes and seasons',
        'RL.1.4',
        [N('The monk says it tastes like spring morning. Is that fresh, or old?')],
        [
          opt('Fresh', [N('Yes! Fresh and new, like a new day.')], true),
          opt('Old', [N('Spring mornings are fresh and new. That is the idea.')]),
        ],
        'Your child understood a describing phrase about taste.',
      ),
    ],
  ),
];

// ================================================================== A2-12 The White Bone Demon
const Q12_SCENES: EduScene[] = [
  sc(
    'a02-12-girl',
    [
      N('White Tiger Ridge is bare rock and thin wind.'),
      N('The monk is hungry. Monkey has gone to find fruit.'),
      N('A girl comes with a basket of rice and noodles. She does not blink.'),
      BN('Kind travellers! Please eat.', 'soft'),
      N('Your Nubbin hides behind your legs. It never hides from food.'),
      N('Monkey comes back, takes one look, and taps her with his staff.'),
      N('Poof! She flops like an empty coat. A cold puff floats away.'),
      MO('She was only a girl!', 'shock'),
      MK('Look in the basket. No noodles. Only worms and frogs.'),
    ],
    [
      ask(
        4,
        'sel',
        'listening to a worried feeling',
        'CASEL: Self-awareness',
        [N('Your Nubbin feels scared and hides. What can we do if something feels odd?')],
        [
          opt('Tell someone we trust', [N('Yes! Tell a grown-up or a friend.')], true),
          opt('Keep it secret', [
            N('Secrets can make worried feelings bigger.'),
            N('Tell someone you trust.'),
          ]),
        ],
        'Your child heard that telling a trusted person helps with a worried feeling.',
      ),
    ],
  ),
  sc(
    'a02-12-girl-done',
    [N('The monk says the quiet words. Monkey holds his head and says nothing.')],
    [
      ask(
        0,
        'literacy',
        'how a character shows a feeling',
        'RL.2.3',
        [N('Monkey holds his head and goes quiet. How does he feel?')],
        [
          opt('Hurt and sad', [N('Yes. His head hurts, and his heart feels hurt too.')], true),
          opt('Very happy', [N('Not happy. He goes quiet because he feels hurt.')]),
        ],
        'Your child read a feeling from what a character does.',
      ),
    ],
  ),
  sc(
    'a02-12-old-woman',
    [
      N('An old woman comes up the path, leaning on a stick.'),
      BN('Have you seen my girl? She went this way.', 'sad'),
      N('She does not blink either. Your Nubbin shakes against your ankles.'),
      N('Monkey taps. The old woman folds away like paper.'),
      MO('Twice! In one morning!', 'angry'),
      MK('The same trickster. She keeps coming back.', 'angry'),
    ],
    [
      doIt(
        4,
        'maths',
        'count to 2',
        'K.CC.B.4',
        'edu:count:visitors:2',
        [N('(Count the visitors so far: a girl, an old woman. Two!)')],
        'Your child counted two visitors.',
      ),
    ],
  ),
  sc(
    'a02-12-bones',
    [
      N('An old man comes last, with prayer beads. He does not blink.'),
      N('Monkey calls the mountain spirits to stand guard. Then he taps.'),
      N('The old man folds up. Where he stood is a chalky heap of bones.'),
      MK('Bones. There is your trickster. Now do you believe me?', 'angry'),
      PG('He made them look like bones. It is a trick!', 'think'),
      MO('Three people, Wukong. I cannot walk beside that.', 'sad'),
      MO('You carry our things. You have seen it all. What do you think?', 'sad'),
    ],
    [
      notice(
        5,
        'sel',
        'friends can disagree, and listen',
        'CASEL: Responsible decision-making',
        [N('When friends disagree, we can say what we saw. We can listen too.')],
        'Your child heard that friends can disagree and still listen to each other.',
      ),
    ],
    {
      choices: [
        {
          id: 'monkey',
          label: 'Believe Monkey. You saw your Nubbin hide.',
          set: { 'a02-believed': 'monkey' },
          then: [
            Y('I believe him. My Nubbin hid from her three times.'),
            MO('A Nubbin’s feelings are not proof. I am sorry.', 'sad'),
            MK('Thank you. Remember you said it.', 'soft'),
          ],
        },
        {
          id: 'monk',
          label: 'Believe the monk. You can’t hit people on a guess.',
          set: { 'a02-believed': 'monk' },
          then: [
            Y('Even if you are right, you cannot hit people because you are sure.'),
            MK('I was not sure. I knew.', 'angry'),
            MK('Fine. Remember you said it, Cousin’s keeper.', 'sad'),
          ],
        },
      ],
    },
  ),
  sc(
    'a02-12-bones-done',
    [
      N('Monkey will not leave without a bow. He pulls three hairs and blows.'),
      N('Three more Monkeys! Four Monkeys bow to the monk, all round him.'),
      MO('Go home, Wukong. Please go.', 'sad'),
      N('So Monkey goes home. He is very sad.'),
      N('Your Nubbin sits in the road. It looks at the empty place.'),
    ],
    [
      doIt(
        1,
        'maths',
        'one and three more make four',
        'K.OA.A.1',
        'edu:add:monkeys:1+3',
        [N('(Hold up one finger, then three more. How many Monkeys? Four!)')],
        'Your child added one and three to make four.',
      ),
    ],
  ),
  sc(
    'a02-12-return',
    [
      N('Without Monkey, it goes badly. A yellow-robed trickster grabs the monk.'),
      PG('I will have to fetch him. I will have to say sorry.', 'sad'),
      PG('I hate saying sorry. You come too. It is easier with two.'),
      N('On the Mountain of Flowers and Fruit, Monkey is king again.'),
      PG('The trickster says you are just a jumped-up monkey.', 'think'),
      MK('He said that? Right.', 'angry'),
      N('Pigsy winks at you. It is the cleverest thing he has done.'),
    ],
    [
      notice(
        2,
        'literacy',
        'words that sound the same: too and two',
        'RF.K.2',
        [N('Listen: “You come too. It is easier with two.”'), N('Too and two sound the same!')],
        'Your child heard two words that sound the same but mean different things.',
      ),
    ],
  ),
  sc(
    'a02-12-return-done',
    [
      N('Monkey sends the trickster flying. The monk is a monk again, shaky.'),
      MO('I was wrong to send you away, Wukong. I am sorry.', 'sad'),
      MK('I am scared of how strong I am, too, sometimes.', 'soft'),
    ],
    [
      ask(
        2,
        'sel',
        'it is okay to be scared',
        'CASEL: Self-awareness',
        [N('Monkey says he is sometimes scared of his own strength. Is that okay?')],
        [
          opt(
            'Yes, it is okay',
            [N('Yes. Even strong people feel scared. Saying so helps.')],
            true,
          ),
          opt('No', [N('It is okay. Everyone feels scared sometimes, even Monkey.')]),
        ],
        'Your child heard that feeling scared is normal and okay to say.',
      ),
    ],
  ),
  sc(
    'a02-12-complete',
    [
      N('The monk takes Monkey’s hand in both of his.'),
      N('It is the first time either of them has done that.'),
      N('Sandy picks up the back of the pole. You pick up the front.'),
      MK('Cousin’s keeper. I have not forgotten what you said.', 'think'),
      N('Your Nubbin rides on his shoulder the rest of the day.'),
    ],
    [
      doIt(
        1,
        'maths',
        'count to 3',
        'K.CC.B.5',
        'edu:count:hands:3',
        [N('(Count the hands: Monkey’s one hand, and the monk’s two. One, two, three!)')],
        'Your child counted three hands.',
      ),
    ],
  ),
];

// ================================================================== A2-13 The Magic Gourd
const Q13_SCENES: EduScene[] = [
  sc(
    'a02-13-rule',
    [
      N('Two sly brothers, Gold Horn and Silver Horn, have caught the monk.'),
      N('They have a magic gourd that calls your name.'),
      MK('If you answer, whoosh! You are inside.'),
      SD('So do not answer.'),
      MK('I answered a made-up name. It still got me!', 'think'),
      N('Your Nubbin checks that its own mouth is shut.'),
    ],
    [
      ask(
        3,
        'health',
        'stay with your grown-up',
        'CASEL: Responsible decision-making',
        [N('A stranger calls your name. What do you do?')],
        [
          opt('Stay close to my grown-up', [N('Yes! Stay close and tell your grown-up.')], true),
          opt('Go and see', [
            N('Do not go with someone you do not know.'),
            N('Stay close to your grown-up.'),
          ]),
        ],
        'Your child learned to stay close to a trusted grown-up if a stranger calls.',
      ),
    ],
  ),
  sc(
    'a02-13-gourd',
    [
      N('Silver Horn holds the gourd upside down at the cave mouth.'),
      SH('Little round one! Little Nubbin!'),
      N('Your Nubbin blinks. It says nothing at all.'),
      SH('Answer me! It is rude not to answer!', 'angry'),
      N('He shakes the gourd. Then he looks at you.'),
      SH('You, carrying the luggage. Answer me!'),
    ],
    [
      doIt(
        1,
        'literacy',
        'clap the syllables in "Nubbin"',
        'RF.K.2',
        'edu:clap:syllables:nubbin',
        [N('(Clap the name: Nub-bin. Two claps, two parts.)')],
        'Your child clapped the two syllables of "Nubbin".',
      ),
    ],
    {
      choices: [
        {
          id: 'silent',
          label: 'Keep your mouth shut, like your Nubbin.',
          then: [N('You say nothing. Your Nubbin looks up at you, very proud.')],
        },
        {
          id: 'answer',
          label: 'Start to say, “Who wants to know?”',
          then: [
            N('You begin “Who”, and the gourd pulls! Monkey tugs you behind a rock.'),
            MK('What did I just say? What did I literally just say?', 'shock'),
          ],
        },
      ],
    },
  ),
  sc(
    'a02-13-swap',
    [
      N('While Silver Horn shouts, a little fly lands on his sleeve.'),
      N('A moment later, his gourd is swapped for a fake!'),
      N('Monkey stands on a rock with the real one, upside down.'),
      MK('Silver Horn!', 'happy'),
      SH('What?', 'angry'),
      N('Whoosh! Monkey puts the stopper in.'),
    ],
    [
      doIt(
        0,
        'maths',
        'count to 6',
        'K.CC.B.5',
        'edu:count:legs:6',
        [N('(A fly has six legs. Count them on your fingers. One to six.)')],
        'Your child counted six legs on a fly.',
      ),
    ],
  ),
  sc(
    'a02-13-swap-done',
    [N('Gold Horn goes the same way. Sandy unties the monk, and Pigsy, who grumbles.')],
    [
      ask(
        0,
        'sel',
        'being patient with a grumbler',
        'CASEL: Social awareness',
        [N('Pigsy grumbles while Sandy unties him. What is Sandy being?')],
        [
          opt('Patient and kind', [N('Yes! Sandy is patient. Grumblers need kind friends.')], true),
          opt('Cross', [N('Sandy is not cross. He stays patient and kind.')]),
        ],
        'Your child named patience in a friend.',
      ),
    ],
  ),
  sc(
    'a02-13-complete',
    [
      N('An old man with a long white beard walks out of the clouds.'),
      LL('Those two are my helpers. They took my gourd. May I have it back?'),
      MK('You might have watched them better.', 'think'),
      LL('So might the Jade Emperor, on you. Yet here we all are.', 'soft'),
      N('He leads both brothers home, by the hand.'),
    ],
    [
      ask(
        1,
        'social-studies',
        'giving things back to their owner',
        'D2.Civ.8.K-2',
        [N('The gourd belongs to Lord Lao. What is the right thing to do?')],
        [
          opt('Give it back', [N('Yes! Things go back to the one they belong to.')], true),
          opt('Keep it', [N('It is not ours to keep. We give it back.')]),
        ],
        'Your child chose to return something to its owner.',
      ),
    ],
  ),
];

// ================================================================== A2-14 Red Boy
const Q14_SCENES: EduScene[] = [
  sc(
    'a02-14-pine',
    [
      N('A boy is tied to the top of a pine tree, crying for help.'),
      N('He is about seven, in a red jacket.'),
      RB('Robbers left me here! Please take me home!', 'sad'),
      MO('Wukong, untie him at once and carry him.'),
      MK('Master, a child does not tie himself to a pine tree.', 'think'),
      MO('Wukong. A child is crying. Untie him.', 'angry'),
    ],
    [
      notice(
        0,
        'science',
        'pine trees stay green all year',
        'ELOF: Scientific Reasoning',
        [N('A pine tree has thin needles, not flat leaves. It stays green all year.')],
        'Your child learned that pine trees keep their needles all year.',
      ),
    ],
    {
      choices: [
        {
          id: 'eyes',
          label: 'Look at your Nubbin first.',
          then: [
            N('Your Nubbin is not hiding. It tilts its head and smells bonfires.'),
            MK('Puzzled, not scared. Good. I will carry him. Carefully.', 'think'),
          ],
        },
        {
          id: 'help',
          label: 'Help untie him.',
          then: [N('The knots come undone too easily. Monkey takes the boy on his back.')],
        },
      ],
    },
  ),
  sc(
    'a02-14-pine-done',
    [
      N('The boy makes himself heavy as a mountain.'),
      N('Then, whoosh! He and the monk are gone.'),
      MK('Of course he was.', 'angry'),
    ],
    [
      doIt(
        0,
        'health',
        'heavy and light movements',
        'ELOF: Perceptual, Motor, and Physical Development',
        'edu:act:heavy-light',
        [N('(Walk heavy as a mountain. Now walk light as a feather.)')],
        'Your child moved in heavy and light ways.',
      ),
    ],
  ),
  sc(
    'a02-14-fire',
    [
      N('At Fire Cloud Cave, the boy comes out with a spear.'),
      RB('I am Red Boy! You are my uncle, but I do not care!', 'happy'),
      N('Monkey calls for rain on the fire. It only burns hotter!'),
      N('Monkey comes out smoky. He dives into a cold stream.'),
      N('The cold stops him. He is shivery and still.'),
      SD('Water, not too cold, not too fast.', 'shock'),
      N('You run with a bucket, three times. Pigsy rubs Monkey’s back and hands.'),
      N('Your Nubbin lies on Monkey’s chest, to warm him.'),
    ],
    [
      doIt(
        6,
        'maths',
        'count to 3',
        'K.CC.B.4',
        'edu:count:buckets:3',
        [N('(Pretend to carry the bucket three times. One, two, three! Splash!)')],
        'Your child counted three bucket trips.',
      ),
    ],
  ),
  sc(
    'a02-14-fire-done',
    [
      MK('Ugh. I am all right. Get off, Cousin. No, stay there a minute.', 'soft'),
      MK('There is only one person for this.'),
    ],
    [
      notice(
        0,
        'sel',
        'words and wishes can be different',
        'CASEL: Relationship skills',
        [
          N('Monkey says get off, but he wants your Nubbin to stay.'),
          N('Listen to feelings, too.'),
        ],
        'Your child heard that feelings can differ from words.',
      ),
    ],
  ),
  sc(
    'a02-14-lotus',
    [
      N('Guanyin comes. She sets a lotus seat outside the cave.'),
      GY('Bring him out, Monkey. Then let him see this seat.', 'soft'),
      N('Red Boy sits right down on it, laughing.'),
      N('The seat closes gently round him, like a flower at evening.'),
      RB('Let me go! I want my mother!', 'sad'),
      GY('You shall see her. First, will you learn a little?', 'soft'),
      N('Red Boy looks at her for a long time. Then he bows.'),
    ],
    [
      notice(
        3,
        'science',
        'some flowers close at night',
        'ELOF: Scientific Reasoning',
        [N('Lotus flowers open in the morning and close in the evening.')],
        'Your child heard that lotus flowers close at night.',
      ),
      ask(
        4,
        'sel',
        'what helps when you miss someone',
        'CASEL: Self-management',
        [N('Red Boy misses his mum. What helps when we miss someone?')],
        [
          opt(
            'Tell someone, and hug a toy',
            [N('Yes! Telling someone helps, and so does a cuddle.')],
            true,
          ),
          opt('Keep it inside', [N('It helps to tell someone. We do not need to hold it in.')]),
        ],
        'Your child heard ideas for coping with missing someone.',
      ),
    ],
  ),
  sc(
    'a02-14-complete',
    [
      N('The monk is untied, smelling of smoke.'),
      N('Red Boy walks a step behind Guanyin, quite quiet.'),
      MO('He was only a boy, really.', 'sad'),
      MK('He was a boy who set fire to me. But yes.', 'think'),
      N('Your Nubbin finds a red ribbon. It keeps it for Red Boy’s mum.'),
    ],
    [
      doIt(
        4,
        'maths',
        'sort by colour',
        'K.MD.B.3',
        'edu:sort:things:red',
        [N('(Find three red things in the room. Count them.)')],
        'Your child found and counted red things.',
      ),
    ],
  ),
];

// ================================================================== A2-15 The Two Monkeys
const Q15_SCENES: EduScene[] = [
  sc(
    'a02-15-snatch',
    [
      N('Bandits on the road again! Monkey is too rough, so he is sent away.'),
      N('Everyone is tired. Pigsy goes for water, and Sandy follows.'),
      N('Then a Monkey comes back alone, with a cup of water.'),
      N('His tail is the wrong way round. Hmm!'),
      MO('Go away, Wukong. I meant it.', 'sad'),
      N('This Monkey’s face changes. He bumps the monk down.'),
      N('He grabs the luggage you carry. Your Nubbin hisses.'),
      N('It has never hissed at Monkey before.'),
    ],
    [
      ask(
        6,
        'sel',
        'noticing when someone acts unlike themselves',
        'CASEL: Social awareness',
        [N('Would our real Monkey bump the monk down?')],
        [
          opt('No, that is not like him', [N('Yes! It was not like him. Something is odd.')], true),
          opt('Yes, he would', [N('Monkey is rough, but not that. It is not like him.')]),
        ],
        'Your child noticed when a character acted out of character.',
      ),
    ],
  ),
  sc(
    'a02-15-snatch-done',
    [
      N('He tears off the pack and whooshes away on a cloud.'),
      N('The monk sits up, dizzy but not hurt.'),
    ],
    [
      notice(
        0,
        'science',
        'clouds are tiny drops of water',
        'ELOF: Scientific Reasoning',
        [N('A cloud is made of tiny drops of water, floating high in the sky.')],
        'Your child heard that clouds are made of tiny water droplets.',
      ),
    ],
  ),
  sc(
    'a02-15-twins',
    [
      N('Sandy brings news. A pretend Monkey is on the Mountain, with a pretend monk!'),
      N('At Guanyin’s island, Sandy finds the real Monkey, sulking.'),
      N('Then the other one turns up. There are two Monkeys!'),
      MK('Who are you? Why do you have my face?', 'angry'),
      FM('Who are you? Why do you have my face?', 'angry'),
      GY('I cannot tell them apart.', 'think'),
      N('Even the Jade Emperor’s mirror shows two, exactly the same.'),
      N('Your Nubbin looks from one to the other. It cries, and that is okay.'),
    ],
    [
      doIt(
        2,
        'maths',
        'same and different, two of something',
        'K.CC.B.4',
        'edu:count:monkeys:2',
        [N('(How many Monkeys now? Point to each one. Two!)')],
        'Your child counted two Monkeys.',
      ),
    ],
  ),
  sc(
    'a02-15-which',
    [
      N('The two Monkeys tumble down. They land in front of the monk.'),
      N('The monk looks at you, not at them.'),
      MO('Which one is my disciple?', 'sad'),
      N('Two staffs. Two gold bands. Both faces look at you.'),
      N('Your Nubbin holds both tails, one in each paw.'),
    ],
    [
      ask(
        3,
        'sel',
        'it is okay to say "I don’t know"',
        'CASEL: Self-awareness',
        [N('You cannot tell which is the real Monkey. What can you say?')],
        [
          opt('I do not know', [N('Yes! “I do not know” is a true and brave thing to say.')], true),
          opt('Guess loudly', [N('A loud guess is not true knowing. “I do not know” is honest.')]),
        ],
        'Your child heard that "I don’t know" is an honest answer.',
      ),
    ],
    {
      choices: [
        {
          id: 'left',
          label: 'Point at the one on the left.',
          then: [
            FM('Ha! You see? The luggage-carrier knows me.', 'happy'),
            MK('Ha! You see? The luggage-carrier knows me.', 'happy'),
            N('They say it together, with the same grin.'),
            MO('That settles nothing. I am sorry I asked.', 'sad'),
          ],
        },
        {
          id: 'right',
          label: 'Point at the one on the right.',
          then: [
            MK('There! Somebody with eyes at last.', 'happy'),
            FM('There! Somebody with eyes at last.', 'happy'),
            N('Both bow. Both bows are exactly as deep.'),
            MO('That settles nothing. I am sorry I asked.', 'sad'),
          ],
        },
        {
          id: 'plain',
          label: 'Say it plainly: “I can’t tell. I won’t pretend I can.”',
          then: [
            N('Both Monkeys open their mouths. Then neither says a word.'),
            MO('Thank you. That is the first true thing anyone has said.', 'soft'),
            SD('Then we ask the one who does know.'),
          ],
        },
      ],
    },
  ),
  sc(
    'a02-15-named',
    [
      N('The two Monkeys fight all the way to the Buddha’s hall.'),
      BU('This one has six ears. He hears everything. He heard your story, Wukong.', 'soft'),
      BU('He wanted to be you. That is all.'),
      N('The golden bowl comes down over the false Monkey, like a lid.'),
      N('Under it is a small monkey with six ears, shaking.'),
      N('Monkey lifts his staff. Then he lowers it.'),
      MK('Go. Be yourself somewhere. It is harder, but it is yours.', 'soft'),
    ],
    [
      doIt(
        4,
        'maths',
        'count to 6',
        'K.CC.B.5',
        'edu:count:ears:6',
        [N('(Count the six ears with your fingers. Real monkeys have two!)')],
        'Your child counted six ears.',
      ),
      notice(
        6,
        'sel',
        'being yourself',
        'CASEL: Self-awareness',
        [N('Being yourself is hard. But your own self is the best one.')],
        'Your child heard that being yourself is worthwhile.',
      ),
    ],
  ),
  sc(
    'a02-15-complete',
    [
      N('The six-eared monkey runs off into the trees.'),
      N('The luggage comes home, a bit dusty.'),
      MO('Wukong. Will you come back? Please?', 'sad'),
      MK('Only if you say it twice.', 'soft'),
      MO('Please.', 'soft'),
      N('Your Nubbin lets go of its tail. It was the right one all along.'),
    ],
    [
      ask(
        4,
        'literacy',
        'the word please',
        'ELOF: Language and Communication',
        [N('What kind word did the monk say?')],
        [
          opt('Please', [N('Yes! Please. A small word with big power.')], true),
          opt('Goodbye', [N('Not goodbye. The monk said please.')]),
        ],
        'Your child named a polite word.',
      ),
    ],
  ),
];

// ================================================================== A2-16 The Flaming Mountains
const Q16_SCENES: EduScene[] = [
  sc(
    'a02-16-ask',
    [
      N('Ahead, the whole land looks like it is on fire. The Flaming Mountains!'),
      N('The only way over is a magic palm-leaf fan.'),
      N('It belongs to Princess Iron Fan. She is Red Boy’s mum.'),
      IF('You gave my son to that lady! He sweeps her floors!', 'angry'),
      MK('He is happy! He is learning!'),
      N('She waves the fan once. Whoosh! Monkey flies far away, end over end.'),
      N('Your Nubbin steps forward. It holds out the red ribbon.'),
    ],
    [
      notice(
        0,
        'social-studies',
        'real red hills in China are very hot',
        'D2.Geo.2.K-2',
        [N('Real red hills in China are called the Flaming Mountains. They get very hot.')],
        'Your child heard about a real place in China.',
      ),
      ask(
        3,
        'sel',
        'why someone is cross',
        'CASEL: Social awareness',
        [N('Princess Iron Fan is cross. Why?')],
        [
          opt(
            'She misses her son',
            [N('Yes! She misses him, and missing someone can feel cross and sad.')],
            true,
          ),
          opt('She is hungry', [N('Not hungry. She misses her son.')]),
        ],
        'Your child worked out why a character was upset.',
      ),
    ],
    {
      choices: [
        {
          id: 'ribbon',
          label: 'Tell her where your Nubbin found it.',
          then: [
            IF('His. That is his. He was always losing it.', 'sad'),
            N('She holds it a long time.'),
            N('She does not give you the fan, but she does not blow you away.'),
          ],
        },
        {
          id: 'quiet',
          label: 'Let her take it without a word.',
          then: [
            N('She takes it and turns away. You hear her breathe out.'),
            N('The door stays open.'),
          ],
        },
      ],
    },
  ),
  sc(
    'a02-16-ask-done',
    [
      N('Monkey comes back. He turns into a tiny fly.'),
      N('He hops into her tea. After a fuss, she hands over a fan.'),
    ],
    [
      doIt(
        0,
        'literacy',
        'rhyming words: fly and sky',
        'RF.K.2',
        'edu:rhyme:fly:sky',
        [N('(Fly, sky! Can you think of another word that rhymes with fly?)')],
        'Your child played with rhymes.',
      ),
    ],
  ),
  sc(
    'a02-16-fake',
    [
      N('Monkey waves the fan at the edge of the flames.'),
      N('The fire leaps up twice as high! His tail starts to smoke.'),
      MK('It is a fake! She gave me a fake!', 'angry'),
      PG('Run!', 'shock'),
      N('Everybody runs, and Pigsy runs fastest. Nobody has seen that before.'),
      MO('Wukong, your tail!', 'shock'),
    ],
    [
      ask(
        5,
        'health',
        'stop, drop and roll',
        null,
        [N('If clothes ever catch fire, what should we do?')],
        [
          opt('Stop, drop and roll', [N('Yes! Stop, drop, and roll. And tell a grown-up.')], true),
          opt('Run fast', [
            N('Running makes a fire burn more.'),
            N('Stop, drop and roll. Tell a grown-up.'),
          ]),
        ],
        'Your child learned stop, drop and roll.',
      ),
    ],
    {
      choices: [
        {
          id: 'tail',
          label: 'Pat out Monkey’s tail.',
          then: [MK('Thank you. That is my good tail. I only have the one.', 'soft')],
        },
        {
          id: 'laugh',
          label: 'Try very hard not to laugh.',
          then: [
            N('You fail. Your Nubbin fails too, rolling in the dust.'),
            MK('Yes. All right. It was quite funny.', 'think'),
          ],
        },
      ],
    },
  ),
  sc(
    'a02-16-real',
    [
      N('Monkey puts on a big pretend beard. It falls off.'),
      N('He sticks it back on, upside down. Nobody notices!'),
      N('At last, Princess Iron Fan brings the real fan to the monk.'),
      IF('Wave it forty-nine times. Then the fire goes out, and it rains.', 'soft'),
      IF('My boy would have wanted the fire. I think I want the rain.'),
      N('The fan is huge. You and Sandy hold it, and Monkey swings it.'),
      N('Your Nubbin sits on your head and counts on its paws.'),
    ],
    [
      doIt(
        5,
        'maths',
        'count in tens',
        'K.CC.A.1',
        'edu:count:waves:10',
        [N('(Count ten waves with Monkey. One, two... ten! Monkey keeps going for you.)')],
        'Your child counted by tens.',
      ),
    ],
  ),
  sc(
    'a02-16-real-done',
    [
      N('Forty-nine waves, and the flames go out.'),
      N('The first rain in a thousand years falls. Steam rises everywhere.'),
    ],
    [
      notice(
        1,
        'science',
        'rain on hot ground makes steam',
        'ELOF: Scientific Reasoning',
        [N('Rain on hot ground turns to steam. Steam is water in the air.')],
        'Your child heard that hot water can become steam.',
      ),
    ],
  ),
  sc(
    'a02-16-complete',
    [
      N('You walk over the Flaming Mountains in the rain.'),
      N('The ground is warm under your feet, and a little green.'),
      N('Monkey gives the fan back to the princess. Everyone is surprised.'),
      IF('Tell my son I kept his ribbon.', 'soft'),
      MO('We shall tell him.'),
    ],
    [
      ask(
        3,
        'sel',
        'a small kind act can open a door',
        'CASEL: Relationship skills',
        [N('Why did the princess feel kinder at the end?')],
        [
          opt(
            'Your Nubbin was kind',
            [N('Yes! A kind act, like the ribbon, can open a door.')],
            true,
          ),
          opt('She was tired', [N('Not tired. Your Nubbin’s kind ribbon changed her heart.')]),
        ],
        'Your child saw how a kind act can change someone’s heart.',
      ),
    ],
  ),
];

// ================================================================== A2-17 Cobweb Cave
const Q17_SCENES: EduScene[] = [
  sc(
    'a02-17-cottage',
    [
      MO('You have fetched every meal. Let me fetch one. Begging is my job.', 'soft'),
      MK('Master, I really think…'),
      MO('Let me.'),
      N('He goes alone to a pretty cottage. You and your Nubbin follow, quietly.'),
      N('Seven women spin in the garden. They have too many shiny eyes.'),
      SS('A monk? How lovely. Do stay.', 'soft'),
      N('Your Nubbin tugs your sleeve. Fine threads lie across the path.'),
    ],
    [
      doIt(
        4,
        'maths',
        'count to 7',
        'K.CC.B.5',
        'edu:count:spinners:7',
        [N('(Count the seven spinners on your fingers.)')],
        'Your child counted seven spinners.',
      ),
    ],
  ),
  sc(
    'a02-17-cottage-done',
    [N('Threads are everywhere. The monk is wrapped like a parcel.')],
    [
      notice(
        0,
        'science',
        'spider silk is thin and strong',
        'ELOF: Scientific Reasoning',
        [N('Spiders make silk from their own bodies. It is very thin, and very strong.')],
        'Your child learned that spiders make strong silk.',
      ),
    ],
  ),
  sc(
    'a02-17-web',
    [
      N('The cottage is really a cave, and the cave is all web.'),
      MK('I can cut it, but there is more every time.', 'angry'),
      N('Your Nubbin puts a paw on a thread. It follows it, slowly.'),
      N('Round three rocks, under a root, to a peg at the back.'),
      SD('Everything that holds on has to hold on to something.', 'think'),
      MK('Cousin. If I were more patient, I would have found that.', 'soft'),
    ],
    [
      doIt(
        3,
        'maths',
        'positions: round, under, to',
        'K.G.A.1',
        'edu:follow:thread:path',
        [N('(Trace the path: round the rocks, under the root, to the peg.)')],
        'Your child followed a path using position words.',
      ),
    ],
    {
      choices: [
        {
          id: 'cut',
          label: 'Untie the anchor thread from the peg.',
          then: [N('You untie it. All through the cave, the white sheets drift down like snow.')],
        },
        {
          id: 'monkey',
          label: 'Call Monkey to cut it.',
          then: [
            MK('There? That little one? Cousin, you are a genius.', 'happy'),
            N('One stroke. The whole web sighs down to the floor.'),
          ],
        },
      ],
    },
  ),
  sc(
    'a02-17-out',
    [
      N('Sandy unwraps the monk. He is dusty, and cross with himself, and fine.'),
      MO('I wanted to do one thing for you all.', 'sad'),
      MK('You did. You showed us where the spiders lived.', 'soft'),
      N('The seven spinners are seven spiders, scuttling for the cracks.'),
      MO('Leave them. Let them spin somewhere else.'),
      N('Pigsy lowers his rake. Your Nubbin waves at the last spider.'),
    ],
    [
      ask(
        4,
        'sel',
        'being kind to small creatures',
        'CASEL: Social awareness',
        [N('The monk lets the spiders go. Why is that kind?')],
        [
          opt('They have a right to live too', [N('Yes! Small creatures matter too.')], true),
          opt('He was tired', [N('He was tired, but he chose kindness.')]),
        ],
        'Your child heard that small creatures deserve kindness.',
      ),
      doIt(
        5,
        'science',
        'spiders have eight legs',
        'ELOF: Scientific Reasoning',
        'edu:count:legs:8',
        [N('(A spider has eight legs. Count them on your fingers: eight!)')],
        'Your child counted eight spider legs.',
      ),
    ],
  ),
  sc(
    'a02-17-complete',
    [
      N('That night the monk eats the supper Monkey fetches.'),
      N('He says thank you twice.'),
      MO('Perhaps it is all right to be carried, now and then.', 'soft'),
      PG('I have always said so. Nobody listens.'),
      N('Your Nubbin has a thread of silk round one ear, like a ribbon.'),
    ],
    [
      notice(
        2,
        'sel',
        'it is okay to receive help',
        'CASEL: Self-awareness',
        [N('It is okay to be helped. Everybody needs help sometimes, even grown-ups and monks.')],
        'Your child heard that receiving help is okay.',
      ),
    ],
  ),
];

// ================================================================== A2-18 Vulture Peak
const Q18_SCENES: EduScene[] = [
  sc(
    'a02-18-road',
    [
      N('The page says you have walked for fourteen years.'),
      N('The land ahead is green and quiet. People smile from their fields.'),
      MO('Is this it? Wukong, is this it?', 'shock'),
      MK('That mountain there. You can stop worrying now.', 'soft'),
      N('The monk sits down in the road. He cries, and laughs, at once.'),
      N('Your Nubbin climbs into his lap. Pigsy sits too.'),
    ],
    [
      notice(
        0,
        'social-studies',
        'the real monk Xuanzang walked to India',
        'D2.His.2.K-2',
        [N('Long ago, a real monk called Xuanzang walked to India. It took years.')],
        'Your child heard that the story grew from a real journey.',
      ),
    ],
  ),
  sc(
    'a02-18-boat',
    [
      N('A wide river lies between you and the mountain.'),
      N('The only bridge is one slippery log.'),
      N('A ferryman poles over in a boat with no bottom.'),
      N('The water rushes through it. It looks very silly.'),
      MO('I cannot. It has no bottom.', 'shock'),
      MK('You have walked fourteen years on trust. Try one more step.'),
      N('The monk steps in. The boat holds him up, firm as stone.'),
    ],
    [
      ask(
        4,
        'sel',
        'trying something new when scared',
        'CASEL: Self-management',
        [N('The monk is afraid. What helps us try something new?')],
        [
          opt(
            'A friend, and one small step',
            [N('Yes! A friend and one small step can help.')],
            true,
          ),
          opt('Run away', [N('Running away is easy. One small step with a friend helps more.')]),
        ],
        'Your child heard that a friend and a small step help with fear.',
      ),
    ],
    {
      choices: [
        {
          id: 'step',
          label: 'Step in after him.',
          then: [
            N('Your foot goes onto nothing, and the nothing holds. Your Nubbin hops in after.'),
          ],
        },
        {
          id: 'nubbin',
          label: 'Let your Nubbin go first.',
          then: [N('Your Nubbin hops in without a second thought. You follow it.')],
        },
      ],
    },
  ),
  sc(
    'a02-18-boat-done',
    [N('On the far side, everyone feels light, like putting down a heavy pack.')],
    [
      doIt(
        0,
        'health',
        'a big breath out',
        'ELOF: Perceptual, Motor, and Physical Development',
        'edu:breathe:out:ahh',
        [N('(Breathe in. Now sigh out: ahhh. Shoulders down. Feel how light you are.)')],
        'Your child practised a relaxing breath.',
      ),
    ],
  ),
  sc(
    'a02-18-scriptures',
    [
      N('The Buddha’s hall is full of light and very calm.'),
      BU('You have come a long way. Rest, then take what you came for.', 'soft'),
      N('Disciples bring scrolls, bundle after bundle. You load the horse.'),
      N('Halfway down the mountain, a wind tears a bundle open. The pages are blank!'),
      MO('Blank? After all this?', 'sad'),
      BU('The blank ones are truest. But people in the East need words.', 'soft'),
      N('New scrolls are full of writing. The monk gives his golden bowl as thanks.'),
    ],
    [
      notice(
        2,
        'social-studies',
        'paper and writing from China',
        'D2.His.2.K-2',
        [N('Paper was first made in China, long ago. It helped books spread.')],
        'Your child heard that paper has a long history in China.',
      ),
      ask(
        5,
        'literacy',
        'why we write words down',
        'ELOF: Literacy',
        [N('Why do people need words on the pages?')],
        [
          opt('So they can read them', [N('Yes! Words let people read and remember.')], true),
          opt('To look pretty', [N('Pretty is nice, but words are for reading and remembering.')]),
        ],
        'Your child said that writing lets us read and remember.',
      ),
    ],
  ),
  sc(
    'a02-18-complete',
    [
      N('The scrolls are tied in neat bundles. There are so many!'),
      MO('We have them. We actually have them.', 'happy'),
      MK('Told you. India by lunch.', 'happy'),
      PG('It was fourteen years.', 'think'),
      MK('A very long lunch.'),
    ],
    [
      doIt(
        1,
        'maths',
        'count to 10',
        'K.CC.A.1',
        'edu:count:bundles:10',
        [N('(Count ten bundles on the horse, one to ten.)')],
        'Your child counted to ten.',
      ),
    ],
  ),
];

// ================================================================== A2-19 The Eighty-First Hardship
const Q19_SCENES: EduScene[] = [
  sc(
    'a02-19-turtle',
    [
      N('Far away, Guanyin reads a list of all the pilgrims’ hardships.'),
      N('There were eighty. There ought to be eighty-one.'),
      GY('One more, then. A gentle one.', 'soft'),
      N('At the river, an old white turtle waits.'),
      N('Long ago, he carried everyone across on his back.'),
      N('He asked the monk to ask the Buddha one question.'),
      TT('Welcome back. Did you ask him?'),
      MO('Oh no. I forgot. I am so sorry.', 'sad'),
      N('The turtle sinks slowly into the river. He is sad.'),
      N('Everyone goes into the water. Your Nubbin is delighted.'),
    ],
    [
      ask(
        8,
        'sel',
        'how it feels to be forgotten',
        'CASEL: Social awareness',
        [N('How does the turtle feel when his question is forgotten?')],
        [
          opt('Sad', [N('Yes. He feels sad, because being forgotten hurts.')], true),
          opt('Happy', [N('He is not happy. He is sad because he was forgotten.')]),
        ],
        'Your child named the feeling of being forgotten.',
      ),
    ],
  ),
  sc(
    'a02-19-turtle-done',
    [
      N('Your Nubbin swims round the turtle, then sits on his shell.'),
      TT('No harm done. I only wanted to be remembered.', 'soft'),
    ],
    [
      notice(
        1,
        'science',
        'turtles can live a very long time',
        'ELOF: Scientific Reasoning',
        [
          N('Some turtles and tortoises live for more than a hundred years.'),
          N('That is a long time to wait!'),
        ],
        'Your child heard that some turtles live for a very long time.',
      ),
    ],
  ),
  sc(
    'a02-19-rock',
    [
      N('You haul the scrolls out and lay them on a flat rock to dry.'),
      N('When you lift them, a few last pages stick to the stone.'),
      MO('No! We came all this way. Now they are not whole.', 'sad'),
      MK('Nothing is whole, master. These are just honest about it.', 'soft'),
      MK('Maybe there is room for whoever reads them next.'),
    ],
    [
      notice(
        3,
        'sel',
        'nothing is perfect, and that is okay',
        'CASEL: Self-awareness',
        [N('Nothing is perfect. Unfinished things can be good, and mistakes are okay.')],
        'Your child heard that imperfect things can still be good.',
      ),
    ],
    {
      choices: [
        {
          id: 'peel',
          label: 'Try to peel the last pages free.',
          then: [N('You try, gently, but they stay put. The rock keeps a few words.')],
        },
        {
          id: 'leave',
          label: 'Leave them on the rock.',
          then: [N('You leave them. Your Nubbin pats the torn edges, kindly.')],
        },
      ],
    },
  ),
  sc(
    'a02-19-rock-done',
    [MO('Not quite complete. Yes. All right. That will do.', 'soft')],
    [
      doIt(
        0,
        'art',
        'finish a story in your own way',
        'ELOF: Approaches to Learning',
        'edu:draw:picture:ending',
        [N('(Draw your own ending for the torn page. There is room!)')],
        'Your child drew their own ending.',
      ),
    ],
  ),
  sc(
    'a02-19-home',
    [
      N('The city of Chang’an turns out to meet you.'),
      N('The pine trees by the gate all point east, the story says.'),
      N('The emperor walks out. The scrolls are carried in with music.'),
      N('Then the pilgrims are lifted back to Vulture Peak.'),
      N('The Buddha gives each of them a new name. Monkey is a buddha now!'),
      MK('A buddha in a headband looks silly. Take it off, master.', 'happy'),
      MO('Touch your head, Wukong.', 'soft'),
      N('Monkey touches his head. The band is gone!'),
    ],
    [
      ask(
        1,
        'science',
        'the sun rises in the east',
        '1-ESS1-1',
        [N('The pines point east. Where does the sun come up?')],
        [
          opt('In the east', [N('Yes! The sun rises in the east, every morning.')], true),
          opt('In the west', [N('The sun sets in the west. It rises in the east.')]),
        ],
        'Your child learned that the sun rises in the east.',
      ),
      notice(
        0,
        'social-studies',
        'Chang’an is a real city, now called Xi’an',
        'D2.Geo.2.K-2',
        [N('Chang’an was a real city in China. Today it is called Xi’an.')],
        'Your child heard that Chang’an was a real city.',
      ),
    ],
  ),
  sc(
    'a02-19-complete',
    [
      MK('Gone. It went when I stopped needing it.', 'soft'),
      N('His eyes are still little suns, but kinder, like the evening sun.'),
      MK('You believed me once, when nobody else did. I never forgot.', 'soft'),
      MO('And you were right. I was afraid, and I called it careful.', 'soft'),
      N('Monkey blows on a hair. It becomes a thin gold band, Nubbin-sized.'),
      MK('This one never tightens. It comes off when you want.', 'happy'),
      MK('And here, a little cloud, for when your Grove feels too big.'),
      N('Your Nubbin rolls twice and lands in your arms. Then you are home.'),
    ],
    [
      ask(
        3,
        'sel',
        'admitting you were afraid is brave',
        'CASEL: Self-awareness',
        [N('The monk said he was afraid. Is that brave?')],
        [
          opt('Yes, it is brave', [N('Yes! Saying “I was afraid” takes courage.')], true),
          opt('No, it is silly', [N('It is not silly. It is honest, and brave.')]),
        ],
        'Your child heard that admitting fear is brave.',
      ),
    ],
  ),
];

// ================================================================== variants (a02-believed = monk)
const A02_VARIANTS: EduScene[] = [
  sc(
    'a02-15-which-monk',
    [
      N('The two Monkeys tumble down. They land in front of the monk.'),
      N('One steps back. The other steps back in just the same way.'),
      MK('On the ridge you took his side, not mine.', 'sad'),
      FM('On the ridge you took his side, not mine.', 'sad'),
      MK('Tell them, Cousin’s keeper. Which one of us is me?'),
      N('Your Nubbin holds both tails, one in each paw.'),
    ],
    [
      ask(
        4,
        'sel',
        'it is okay to say "I don’t know"',
        'CASEL: Self-awareness',
        [N('You cannot tell which is the real Monkey. What can you say?')],
        [
          opt('I do not know', [N('Yes! “I do not know” is a true and brave thing to say.')], true),
          opt('Guess loudly', [N('A loud guess is not true knowing. “I do not know” is honest.')]),
        ],
        'Your child heard that "I don’t know" is an honest answer.',
      ),
    ],
    {
      choices: [
        {
          id: 'left',
          label: 'Point at the one on the left.',
          then: [
            FM('Ha! You see? The luggage-carrier knows me.', 'happy'),
            MK('Ha! You see? The luggage-carrier knows me.', 'happy'),
            N('They say it together, with the same grin.'),
            MK('That settles nothing, Cousin’s keeper. I am sorry I asked.', 'sad'),
          ],
        },
        {
          id: 'right',
          label: 'Point at the one on the right.',
          then: [
            MK('There! Somebody with eyes at last.', 'happy'),
            FM('There! Somebody with eyes at last.', 'happy'),
            N('Both bow. Both bows are exactly as deep.'),
            MK('That settles nothing, Cousin’s keeper. I am sorry I asked.', 'sad'),
          ],
        },
        {
          id: 'plain',
          label: 'Say it plainly: “I can’t tell. I won’t pretend I can.”',
          then: [
            N('Both Monkeys open their mouths. Then neither says a word.'),
            MK('Good. Guessing is how you lose a monk.', 'soft'),
            SD('Then we ask the one who does know.'),
          ],
        },
      ],
    },
  ),
  sc(
    'a02-19-complete-monk',
    [
      MK('Gone. It went when I stopped needing it.', 'soft'),
      N('His eyes are still little suns, but kinder, like the evening sun.'),
      MK('On the ridge you took his side. I was so angry.', 'soft'),
      MK('You were right not to take my word. It was a good thing.'),
      MO('He was right about the trickster. We were both a little right.', 'soft'),
      N('Monkey blows on a hair. It becomes a thin gold band, Nubbin-sized.'),
      MK('This one never tightens. It comes off when you want.', 'happy'),
      N('He gives your Nubbin a little cloud. It rolls twice, then you are home.'),
    ],
    [
      ask(
        4,
        'sel',
        'two friends can both be a little right',
        'CASEL: Social awareness',
        [N('Monkey and the monk were both a little right. Can that happen?')],
        [
          opt('Yes, it can', [N('Yes! Friends can each see a part of the truth.')], true),
          opt('No, never', [N('It happens often. Each of them saw a part of it.')]),
        ],
        'Your child heard that two people can each be partly right.',
      ),
    ],
  ),
];

// ================================================================== quests
const g = (goal: string, hint: string) => ({ goal, hint });

const quest = (
  n: string,
  title: string,
  goals: EduQuest['goals'],
  scenes: EduScene[],
): EduQuest => ({
  id: `sprout:a02-${n}`,
  of: `a02-${n}`,
  band: 'sprout',
  title,
  goals,
  scenes,
});

export const EDU_A02_SPROUT: EduQuest[] = [
  quest(
    '01',
    'Born from Stone',
    {
      'a02-01-s1': g(
        'Climb the painted mountain to the stone egg.',
        'Follow the smell of peaches uphill.',
      ),
      'a02-01-s2': g('Watch the stone egg hatch.', 'Stay close to the egg.'),
      'a02-01-s3': g('Look down from the clouds.', 'Follow the gold light up.'),
    },
    Q01_SCENES,
  ),
  quest(
    '02',
    'The Water-Curtain Cave',
    {
      'a02-02-s1': g('Follow the stream to the waterfall.', 'Walk up the stream with the monkeys.'),
      'a02-02-s2': g('Jump through the waterfall.', 'Dive in after Monkey.'),
      'a02-02-s3': g('Join the monkeys’ feast.', 'Sit down in the cave.'),
    },
    Q02_SCENES,
  ),
  quest(
    '03',
    'Lessons in Shape-Changing',
    {
      'a02-03-s1': g('Visit Monkey’s teacher.', 'Walk up to the cave with Monkey.'),
      'a02-03-s2': g('Wait on the back step.', 'Sit outside the back door.'),
      'a02-03-s3': g('Watch Monkey under the pines.', 'Stand in the yard.'),
    },
    Q03_SCENES,
  ),
  quest(
    '04',
    'Havoc in Heaven',
    {
      'a02-04-s1': g('Visit the heavenly stables.', 'Go up to Heaven with Monkey.'),
      'a02-04-s2': g('Look at the peaches in the garden.', 'Walk among the trees.'),
      'a02-04-s3': g('Watch Monkey at the feast.', 'Go to the Jade Pool.'),
    },
    Q04_SCENES,
  ),
  quest(
    '05',
    'Under the Mountain',
    {
      'a02-05-s1': g('Wait by the furnace door.', 'Sit by the furnace.'),
      'a02-05-s2': g('Talk with the Buddha.', 'Stand near the Buddha’s hand.'),
      'a02-05-s3': g('Sit with Monkey under the mountain.', 'Climb down and sit by his hand.'),
    },
    Q05_SCENES,
  ),
  quest(
    '06',
    'The Monk',
    {
      'a02-06-s1': g('Walk with the monk to the edge of the land.', 'Carry his luggage.'),
      'a02-06-s2': g('Climb the mountain to the gold paper.', 'Hold the staff and push.'),
      'a02-06-s3': g('Wait by the road.', 'Sit and let things calm down.'),
    },
    Q06_SCENES,
  ),
  quest(
    '07',
    'The White Dragon Horse',
    {
      'a02-07-s1': g('Walk to Eagle Grief Stream.', 'Follow the rushing water.'),
      'a02-07-s2': g('Talk with the lady with the vase.', 'Stand by the water.'),
      'a02-07-s3': g('Watch the dragon change.', 'Stay by the bank.'),
    },
    Q07_SCENES,
  ),
  quest(
    '08',
    'The Stolen Robe',
    {
      'a02-08-s1': g('Visit the monastery guest hall.', 'Go inside with the monk.'),
      'a02-08-s2': g('Look at the smoke in the guest hall.', 'Follow your Nubbin.'),
      'a02-08-s3': g('Find the robe on Black Wind Mountain.', 'Carry the little round pill.'),
    },
    Q08_SCENES,
  ),
  quest(
    '09',
    'Pigsy',
    {
      'a02-09-s1': g('Talk with Old Gao at the farm.', 'Listen to his story.'),
      'a02-09-s2': g('Wait quietly in the back house.', 'Hide behind the screen.'),
      'a02-09-s3': g('Talk with Pigsy at the cave.', 'Bring the flowers.'),
    },
    Q09_SCENES,
  ),
  quest(
    '10',
    'Sandy',
    {
      'a02-10-s1': g('Walk to the River of Flowing Sands.', 'Follow the monk to the bank.'),
      'a02-10-s2': g('Swim down to meet the river spirit.', 'Follow your Nubbin into the water.'),
      'a02-10-s3': g('Wait on the bank for Moksa.', 'Sit and watch the water.'),
    },
    Q10_SCENES,
  ),
  quest(
    '11',
    'The Ginseng Fruit',
    {
      'a02-11-s1': g('Visit the quiet temple.', 'Walk in with the monk.'),
      'a02-11-s2': g('Look at the tree in the garden.', 'Go to the garden.'),
      'a02-11-s3': g('Carry water to the tree.', 'Pour it very gently.'),
    },
    Q11_SCENES,
  ),
  quest(
    '12',
    'The White Bone Demon',
    {
      'a02-12-s1': g('Watch the girl on White Tiger Ridge.', 'Stay by the monk.'),
      'a02-12-s2': g('Watch the old woman on the ridge.', 'Stay by the monk.'),
      'a02-12-s3': g('Choose who to believe.', 'Think about what you saw, and tell your reason.'),
      'a02-12-s4': g('Walk to the Mountain of Flowers and Fruit.', 'Go with Pigsy.'),
    },
    Q12_SCENES,
  ),
  quest(
    '13',
    'The Magic Gourd',
    {
      'a02-13-s1': g('Talk with Monkey in the pine wood.', 'Listen to the rule.'),
      'a02-13-s2': g('Wait at the cave and do not answer.', 'Keep your mouth shut.'),
      'a02-13-s3': g('Watch the gourd get swapped.', 'Stay still and quiet.'),
    },
    Q13_SCENES,
  ),
  quest(
    '14',
    'Red Boy',
    {
      'a02-14-s1': g('Look at the boy in the pine tree.', 'Look at your Nubbin, then at the boy.'),
      'a02-14-s2': g('Carry water to Monkey.', 'Run with the bucket.'),
      'a02-14-s3': g('Talk with Guanyin at the cave.', 'Stand by the lotus seat.'),
    },
    Q14_SCENES,
  ),
  quest(
    '15',
    'The Two Monkeys',
    {
      'a02-15-s1': g('Carry the luggage on the road.', 'Hold on to the pack.'),
      'a02-15-s2': g('Watch the two Monkeys.', 'Stand by Guanyin.'),
      'a02-15-s3': g('Choose which Monkey is the real one.', 'It is okay to say you do not know.'),
      'a02-15-s4': g('Talk with the Buddha.', 'Follow the Monkeys to the hall.'),
    },
    Q15_SCENES,
  ),
  quest(
    '16',
    'The Flaming Mountains',
    {
      'a02-16-s1': g('Talk with Princess Iron Fan.', 'Hold out the red ribbon.'),
      'a02-16-s2': g('Watch Monkey use the fan.', 'Stand back from the flames.'),
      'a02-16-s3': g('Carry the real fan.', 'Hold it with Sandy.'),
    },
    Q16_SCENES,
  ),
  quest(
    '17',
    'Cobweb Cave',
    {
      'a02-17-s1': g('Visit the pretty cottage.', 'Follow the monk quietly.'),
      'a02-17-s2': g('Find where the web is tied.', 'Follow a thread with your Nubbin.'),
      'a02-17-s3': g('Help the monk out of the cave.', 'Walk him to the mouth of the cave.'),
    },
    Q17_SCENES,
  ),
  quest(
    '18',
    'Vulture Peak',
    {
      'a02-18-s1': g('Walk to Vulture Peak.', 'Follow the green road.'),
      'a02-18-s2': g('Cross the river in the boat.', 'Take one small step.'),
      'a02-18-s3': g('Talk with the Buddha and take the scrolls.', 'Load the horse gently.'),
    },
    Q18_SCENES,
  ),
  quest(
    '19',
    'The Eighty-First Hardship',
    {
      'a02-19-s1': g('Swim with the old white turtle.', 'Dive into the river.'),
      'a02-19-s2': g('Carry the scrolls to the rock.', 'Lay them in the sun.'),
      'a02-19-s3': g('Bring the scrolls home.', 'Walk to the city gate.'),
    },
    Q19_SCENES,
  ),
];

/** Sprout versions of every scene in ATLAS_A02_VARIANTS. */
export const EDU_A02_SPROUT_VARIANTS: EduScene[] = A02_VARIANTS;

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  'edu:count:laps:2',
  'edu:point:compass:four-ways',
  'edu:count:fruit:5',
  'edu:sort:cave-things:kind',
  'edu:tap:head:3',
  'edu:count:rows:7',
  'edu:count:fingers:5',
  'edu:count:robbers:6',
  'edu:count:travellers:5',
  'edu:sort:robes:colour',
  'edu:order:story:fire',
  'edu:hush:finger-on-lips',
  'edu:count:teeth:9',
  'edu:sort:things:sink-float',
  'edu:breathe:slow:in-out',
  'edu:count:pilgrims:6',
  'edu:count:visitors:2',
  'edu:add:monkeys:1+3',
  'edu:count:hands:3',
  'edu:clap:syllables:nubbin',
  'edu:count:legs:6',
  'edu:act:heavy-light',
  'edu:count:buckets:3',
  'edu:sort:things:red',
  'edu:count:monkeys:2',
  'edu:count:ears:6',
  'edu:rhyme:fly:sky',
  'edu:count:waves:10',
  'edu:count:spinners:7',
  'edu:follow:thread:path',
  'edu:count:legs:8',
  'edu:breathe:out:ahh',
  'edu:count:bundles:10',
  'edu:draw:picture:ending',
];
