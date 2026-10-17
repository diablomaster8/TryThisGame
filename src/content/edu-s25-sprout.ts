/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): S25 “Real”.
 *
 * Source: side-stories-s25.ts (SIDE_STORY_S25 and SIDE_STORY_S25_VARIANTS). One EduScene per
 * original scene, id `sprout:<original id>`. See EDU-STYLE.md.
 *
 * - Every choice keeps its original id and `set`. Sprout keeps all of them: S25 has no cruel or
 *   bleak choice (both fates of the toy are gentle; nothing dies in this story).
 * - No text is lifted from the book. The book’s lines (Moss as the old horse, the clockwork-toy
 *   page, “He isn’t a toy”, the shabbiness line, “carefully kept”) are rewritten in new words.
 * - Moss: steps 1–2 can play in chapter 3, so in s25-sill he is only “a little grey one” on the
 *   hill, silent. s25-sill-late names him and he stays silent. He speaks from s25-real on, and
 *   only you hear him; Clank, Byte and Clover get his words from you.
 * - Nubbins, wild Nubbins and Sable never speak. The toy is “it” until Fern’s, “he” after.
 * - The chill is said plainly and gently (a small cold, better by morning).
 * - Lesson facts: lightning and thunder, light helps us see, hot water helps wash out germs,
 *   hot water shrinks old wool, a towel soaks up water, the sun dries wet things, water from deep
 *   underground can be warm, spring flowers.
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
const M = say('moss');
const FE = say('fern');
const SP = say('sparks');
const PX = say('pixel');
const CL = say('clover');
const BY = say('byte');
const CK = say('clank');

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

// ---------------------------------------------------------------- shared beats
const STORM: Line[] = [
  N('Then, one night, a big storm comes. Boom! Crash!'),
  N('Your Nubbin can’t settle. Its ears are flat.'),
  N('It is scared of the loud bangs.'),
  N('Flash! The lightning lights up the toy on the windowsill.'),
];

/** The storm lesson, after the last storm line (index given). */
const stormBeat = (after: number): Beat => ({
  domain: 'sel',
  skill: 'what helps when you feel scared',
  standard: 'ELOF: Social and Emotional Development',
  kind: 'ask',
  after,
  prompt: [N('Your Nubbin is scared of the storm. What could help it?')],
  options: [
    opt('Something soft to hold', [N('Yes! Something soft and cosy to hug can help us feel safe.')], true),
    opt('Being told to stop it', [N('Being told off doesn’t help a scared feeling. Something soft to hug helps more.')]),
    opt('Being left all alone', [N('Being alone can feel scarier. A hug, or something soft to hold, helps more.')]),
  ],
  parentNote: 'Talked about what helps when someone feels scared: comfort, and something soft to hold.',
});

const sillBeat: Beat = {
  domain: 'maths',
  skill: 'count to 7 (the days in a week)',
  standard: 'K.CC.B.5',
  kind: 'do',
  after: 3,
  check: 'edu:count:days:7',
  lines: [
    N('One week is seven days. Let’s count them!'),
    N('(Count to seven together on your fingers.)'),
    N('One, two, three, four, five, six, seven!'),
  ],
  parentNote: 'Counted to seven, the number of days in a week.',
};

const fallsBeat: Beat = {
  domain: 'science',
  skill: 'water from deep underground can be warm',
  standard: 'ELOF: Scientific Reasoning',
  kind: 'notice',
  after: 4,
  lines: [
    N('Deep, deep under the ground, the Earth is very hot.'),
    N('Water that comes up from down there can be warm, like a bath.'),
  ],
  parentNote: 'Heard that some springs are warm because the Earth is hot deep underground.',
};

const pageBeat = (after: number): Beat => ({
  domain: 'literacy',
  skill: 'words that show feelings',
  standard: 'RL.1.4',
  kind: 'ask',
  after,
  prompt: [N('Clank’s whistle goes low. How does Clank feel?')],
  options: [
    opt('Sad', [N('Yes. A low, quiet whistle is a sad sound. Moss helps him.')], true),
    opt('Silly', [N('Silly whistles go up and down! A low whistle is a sad sound.')]),
    opt('Hungry', [N('Clank doesn’t eat. His low whistle is a sad sound.')]),
  ],
  parentNote: 'Used a clue (a low whistle) to name a feeling: sad.',
});

// ---------------------------------------------------------------- the spring coda
type ToyName = 'button' | 'bobble' | 'mister';
const NAMES: Record<ToyName, { said: string; stitched: string; letter: string }> = {
  button: { said: 'Button?', stitched: 'BUTTON', letter: 'B' },
  bobble: { said: 'Bobble?', stitched: 'BOBBLE', letter: 'B' },
  mister: { said: 'Mister?', stitched: 'MISTER', letter: 'M' },
};

const codaWild = (name: ToyName): EduScene =>
  sc(
    `s25-coda-wild-${name}`,
    [
      N('Spring is here! Flowers open on the hill.'),
      N('A wild Nubbin sits at the edge of the long grass.'),
      N('Its coat is soft and lumpy, like knitting.'),
      N('One eye shines like a button.'),
      Y(NAMES[name].said, 'soft'),
      N('It turns its head!'),
      N('Hop, hop! It hops twice, high and neat.'),
      N('Then it goes back into the long grass.'),
    ],
    [
      {
        domain: 'science',
        skill: 'seasons: flowers open in spring',
        standard: 'K-ESS2-1',
        kind: 'ask',
        after: 0,
        prompt: [N('Flowers are opening. Which season is it?')],
        options: [
          opt('Spring', [N('Yes! In spring, flowers open and new leaves grow.')], true),
          opt('Winter', [N('In winter it is cold, and most flowers sleep. Flowers open in spring.')]),
          opt('Night-time', [N('Night isn’t a season! Spring is the season when flowers open.')]),
        ],
        parentNote: 'Linked flowers opening to the season of spring.',
      },
    ],
  );

const codaCoat = (name: ToyName): EduScene =>
  sc(
    `s25-coda-coat-${name}`,
    [
      N('Spring is here! Fern and Clover bring a parcel.'),
      N('Inside is a little knitted coat, just for your Nubbin.'),
      N('It’s the same pattern as the toy!'),
      FE('Look inside the collar.', 'happy'),
      N(`Fern has stitched a name in red: ${NAMES[name].stitched}.`),
      N('Your Nubbin puts it on. It sits by the toy.'),
      N('Now they match!'),
      CL('Matching! Oh, I could cry. I am crying.', 'soft'),
    ],
    [
      {
        domain: 'literacy',
        skill: `first letter of a name (${NAMES[name].letter})`,
        standard: 'ELOF: Literacy',
        kind: 'do',
        after: 4,
        check: `edu:tap:letter:${NAMES[name].letter.toLowerCase()}`,
        lines: [
          N(`${NAMES[name].stitched} starts with the letter ${NAMES[name].letter}.`),
          N(`(Find the ${NAMES[name].letter} in the collar and tap it.)`),
        ],
        parentNote: `Found the first letter of the toy’s name, ${NAMES[name].letter}.`,
      },
    ],
  );

// ================================================================== S25 Real
const S25: EduQuest = {
  id: 'sprout:s25',
  of: 's25',
  band: 'sprout',
  title: 'Real',
  goals: {
    's25-step1': { goal: 'Open the soft parcel in the loft.', hint: 'It is on the trunk, under the little window. Pull the string.' },
    's25-step2': { goal: 'Help Pixel mend the loft lamp.', hint: 'Hold the lamp still. Pass Pixel the small cog.' },
    's25-step3': { goal: 'Sit on the window seat until Moss has finished.', hint: 'Sit still and wait. Moss is slow.' },
    's25-step4': { goal: 'Give your Nubbin something soft to hold.', hint: 'Put the knitted toy in its basket.' },
    's25-step5': { goal: 'Find the toy before bedtime.', hint: 'Take a lantern. Look by the pond.' },
    's25-step6': { goal: 'Take the toy to Fern’s for tea.', hint: 'Your Nubbin will carry him in.' },
    's25-step7': { goal: 'Let the wild Nubbins look at the toy.', hint: 'Stand by Moss and keep very still.' },
    's25-step8': { goal: 'Find the right page in Gran Hazel’s book.', hint: 'Look for the page with the old horse.' },
    's25-step9': { goal: 'Hold the toy while Clover mends him.', hint: 'Hold him still. Clover is quick.' },
    's25-step10': { goal: 'Sit with your Nubbin all night.', hint: 'Stay by the basket. Give it water when it wakes.' },
    's25-step11': { goal: 'Carry the rag bundle to the shed.', hint: 'Put it by the shed door.' },
    's25-step12': { goal: 'Wait until morning, then go and look.', hint: 'Stay at the window seat until it is light.' },
    's25-step13': { goal: 'Tell Moss about the warm water.', hint: 'Sit by his ledge. He will listen.' },
  },
  scenes: [
    // ------------------------------------------------ step 1
    sc(
      's25-loft',
      [
        N('Pitter-patter. Warm rain on the roof.'),
        N('The lamp in the loft is broken. Pixel will mend it after lunch.'),
        N('You climb the ladder. Up, up, up!'),
        N('The loft smells of apples and dust.'),
        N('Your Nubbin climbs up too. Atchoo! Dusty!'),
        N('Under the little window is a big box, called a trunk.'),
        N('On the trunk is a soft parcel, tied with string.'),
        N('Gran Hazel wrote on it, a long time ago: “For when they come back.”'),
      ],
      [
        {
          domain: 'maths',
          skill: 'position words: on and under',
          standard: 'K.G.A.1',
          kind: 'ask',
          after: 6,
          prompt: [N('Where is the parcel? (Wait for an answer.)')],
          options: [
            opt('On the trunk', [N('Yes! The parcel is ON the trunk, UNDER the window.')], true),
            opt('Under the bed', [N('Let’s look again. The parcel is ON the trunk.')]),
            opt('In the pond', [N('Splash! Not in the pond. It’s ON the trunk, nice and dry.')]),
          ],
          parentNote: 'Practised the position words “on” and “under”.',
        },
      ],
    ),
    sc(
      's25-name',
      [
        N('You pull the string. The bow falls open.'),
        N('Inside is a knitted Nubbin, soft and lumpy.'),
        N('One button eye is tight. One hangs on a long thread.'),
        N('There is a thin book too, with a rabbit on it.'),
        N('You remember! Gran Hazel made this toy for you.'),
        N('You were three. You took it everywhere.'),
        N('What did you call it? Can you remember?'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'first sounds: b',
          standard: 'RF.K.2',
          kind: 'do',
          after: 6,
          check: 'edu:say:first-sound:b',
          lines: [
            N('Button and Bobble start with the same sound. B, b, b!'),
            N('(Say “b, b, Button” and “b, b, Bobble” together.)'),
          ],
          parentNote: 'Heard and said the first sound “b” in Button and Bobble.',
        },
      ],
      {
        choices: [
          {
            id: 'button',
            label: '“Button.” For its eye.',
            set: { 's25-name': 'button' },
            then: [N('Button! Your Nubbin looks up, then goes back to a hatbox.')],
          },
          {
            id: 'bobble',
            label: '“Bobble.” For the bobble on top.',
            set: { 's25-name': 'bobble' },
            then: [N('Bobble! Your Nubbin looks up, then goes back to a hatbox.')],
          },
          {
            id: 'mister',
            label: '“Mister.” Just Mister.',
            set: { 's25-name': 'mister' },
            then: [N('Mister! A very polite name. Your Nubbin looks up, then back at a hatbox.')],
          },
        ],
      },
    ),
    // ------------------------------------------------ step 2
    sc(
      's25-lamp',
      [
        N('After lunch, Pixel climbs up with her toolbox.'),
        PX('Hello! The lamp is tired. I brought some helpers.', 'happy'),
        N('Sparks and Fern climb up to watch.'),
        N('Out come Pixel’s clockwork things.'),
        N('A little moth. A tiny fan. A turning cog.'),
        SP('Ooh! Does any of it go bang?', 'happy'),
        PX('Not on purpose.'),
        N('Whirr! The moth flies round and lands on Fern’s head.'),
        N('Your Nubbin chases the shiny flashes. Squeak! Squeak!'),
        N('The knitted toy sits on the trunk. Nobody looks at it.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 3',
          standard: 'K.CC.B.5',
          kind: 'do',
          after: 4,
          check: 'edu:count:clockwork:3',
          lines: [
            N('How many clockwork things? (Point and count together.)'),
            N('Moth, one. Fan, two. Cog, three. Three!'),
          ],
          parentNote: 'Counted three things, pointing at each one.',
        },
      ],
    ),
    sc(
      's25-sill',
      [
        N('Click! The lamp comes on. Tick, tick, tick.'),
        N('Everyone goes down the ladder, talking about the moth.'),
        N('You put the toy and the book on the window seat.'),
        N('One week goes by. Then two weeks.'),
        N('The toy sits on the windowsill, in the sun.'),
        N('Nobody plays with it.'),
        N('Far away on the hill, a little grey one is looking this way.'),
      ],
      [sillBeat],
    ),
    // ------------------------------------------------ step 3
    sc(
      's25-real',
      [
        N('One morning, Moss comes all the way down the hill.'),
        N('He sits on the ledge outside the window. The toy sits inside.'),
        N('It is a long walk for Moss. He is very old and slow.'),
        M('Don’t say anything. I’m not here.'),
        N('You sit on the window seat and wait. Quietly.'),
        M('Hazel knitted that toy in one week.', 'happy'),
        M('She read you that book on this seat. I listened too.'),
        N('Then Moss talks to the toy, not to you.'),
        M('Real isn’t in your stitches. It grows on you, slowly.', 'soft'),
        M('Somebody has to love you for ages. Properly. That’s how it starts.', 'soft'),
      ],
      [
        {
          domain: 'sel',
          skill: 'waiting quietly',
          standard: 'CASEL: Self-management',
          kind: 'do',
          after: 4,
          check: 'edu:sit:still:5',
          lines: [
            N('Waiting quietly is hard. Let’s try it.'),
            N('(Sit very still together and count to five in a whisper.)'),
          ],
          parentNote: 'Practised sitting still and waiting quietly.',
        },
      ],
      {
        choices: [
          {
            id: 'hurt',
            label: 'Ask Moss: does it hurt?',
            set: { 's25-ask': 'hurt' },
            then: [Y('Does it hurt?'), N('Moss answers the toy, not you.')],
          },
          {
            id: 'when',
            label: 'Ask Moss: does it happen quickly?',
            set: { 's25-ask': 'when' },
            then: [Y('Does it happen quickly?'), N('Moss answers the toy, not you.')],
          },
          {
            id: 'sit',
            label: 'Say nothing. Just sit with them.',
            set: { 's25-ask': 'sit' },
            then: [N('You say nothing. Moss nods, very slowly, and goes on.')],
          },
        ],
      },
    ),
    sc(
      's25-hurt',
      [
        M('Sometimes it hurts a little. But a Real one isn’t so scared of that.', 'soft'),
        M('It doesn’t happen quickly. It’s slow, like a tree growing tall.'),
        M('It’s harder for someone with sharp edges.', 'think'),
        M('Or someone kept on a high shelf, where nobody can hug them.'),
        N('Then Moss climbs down, one slow foot at a time.'),
        N('He walks back to his hill. It will take him all day.'),
        M('Your toy has a good face. Don’t keep him on a shelf.'),
      ],
      [
        {
          domain: 'science',
          skill: 'some things grow slowly',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'ask',
          after: 1,
          prompt: [N('Moss says being Real is slow. What else grows slowly?')],
          options: [
            opt('A tree', [N('Yes! A tree grows a tiny bit every year. Slowly, slowly.')], true),
            opt('A splash', [N('A splash is very quick! A tree grows slowly.')]),
            opt('A sneeze', [N('Atchoo! A sneeze is quick. A tree grows slowly.')]),
          ],
          parentNote: 'Compared fast and slow changes: a tree grows slowly.',
        },
      ],
    ),
    // ------------------------------------------------ step 4
    sc(
      's25-storm',
      [
        N('Later that week, Sable walks past the window.'),
        N('She stops. She looks at the toy for a long time.'),
        N('Moss said sharp edges make it hard. Sable has sharp edges.'),
        N('She lies down near the toy and goes to sleep. She doesn’t take it.'),
        ...STORM,
      ],
      [stormBeat(7)],
    ),
    sc(
      's25-sleeps',
      [
        N('You put the toy in your Nubbin’s basket.'),
        N('Your Nubbin climbs in. It curls all the way round the toy.'),
        N('Boom! Thunder! Your Nubbin doesn’t even wake up.'),
        N('In the morning, it is still holding the toy.'),
        N('From now on, the toy belongs to your Nubbin.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'name a shape: circle',
          standard: 'K.G.A.2',
          kind: 'ask',
          after: 1,
          prompt: [N('Your Nubbin curls up round the toy. What shape does it make?')],
          options: [
            opt('A circle', [N('Yes! Curled up round and round, like a circle.')], true),
            opt('A square', [N('A square has four corners. Your Nubbin has no corners! It’s a circle.')]),
            opt('A triangle', [N('A triangle has three points. A curled-up Nubbin is round, like a circle.')]),
          ],
          parentNote: 'Named a circle in a curled-up shape.',
        },
      ],
    ),
    // ------------------------------------------------ step 5
    sc(
      's25-everywhere',
      [
        N('Now the toy goes everywhere.'),
        N('First, it goes to the pond. Splash!'),
        N('Next, it goes to a picnic. It gets jam on it.'),
        N('Last, it has a bath. Bubbles!'),
        N('Then, one evening, the toy is missing!'),
        N('Your Nubbin stands up in its basket. It won’t lie down.'),
        N('The toy is out in the Grove. It’s getting dark.'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'order events: first, next, last',
          standard: 'RL.K.3',
          kind: 'do',
          after: 3,
          check: 'edu:order:toy-trip',
          lines: [
            N('Where did the toy go first? Next? Last?'),
            N('(Put the pictures in order: pond, picnic, bath.)'),
          ],
          parentNote: 'Put three events in order using first, next and last.',
        },
      ],
    ),
    sc(
      's25-lantern',
      [
        N('You take a lantern. Its light shines in the dark.'),
        N('There! The toy is in the wet grass by the pond.'),
        N('You carry it home. Your Nubbin is still waiting.'),
        N('It hugs the toy and falls asleep. Zzz.'),
      ],
      [
        {
          domain: 'science',
          skill: 'we need light to see',
          standard: '1-PS4-2',
          kind: 'ask',
          after: 1,
          prompt: [N('It is dark outside. What helped you find the toy?')],
          options: [
            opt('The lantern’s light', [N('Yes! We need light to see. The lantern lit up the grass.')], true),
            opt('Closing my eyes', [N('With eyes shut, we can’t see at all! The lantern’s light helped.')]),
            opt('A sock', [N('A sock can’t shine. The lantern’s light helped you see.')]),
          ],
          parentNote: 'Learned that we need light to see things in the dark.',
        },
      ],
    ),
    // ------------------------------------------------ step 6
    sc(
      's25-fern',
      [
        N('You go to Fern’s house. The toy comes too.'),
        N('Your Nubbin puts the toy on Fern’s good chair.'),
        FE('Oh, not on the chair, love. It’s only a toy.'),
        N('Fern reaches for it. Your Nubbin squeaks, very loudly!'),
        N('Your Nubbin stands in front of the toy. It looks at you.'),
        Y('He’s not only a toy! He matters. He’s Real to us!'),
        N('Fern looks at the toy properly, for the first time.'),
        FE('Oh. I see. Then I owe him a sorry.', 'think'),
        FE('Come for tea tomorrow. Bring him.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'reading how someone feels',
          standard: 'ELOF: Social and Emotional Development',
          kind: 'ask',
          after: 4,
          prompt: [N('Fern reached for the toy. How does your Nubbin feel?')],
          options: [
            opt('Worried and cross', [N('Yes. It loves the toy, and it doesn’t want it on the floor.')], true),
            opt('Sleepy', [N('Not sleepy! That loud squeak means worried and cross.')]),
            opt('Hungry', [N('Not hungry. It is worried about its toy, and a bit cross.')]),
          ],
          parentNote: 'Named feelings (worried, cross) from a clue in the story.',
        },
      ],
    ),
    sc(
      's25-apology',
      [
        N('Fern has her best cups out. And a tiny cup for the toy!'),
        FE('Sir, I said you were only a toy. That was wrong.'),
        FE('I am sorry. Very, very sorry.'),
        N('Your Nubbin thinks about it. Then it puts him on the cushion.'),
        N('It eats a biscuit for him.'),
        FE('A good sorry says what you did. Then you make it right.', 'happy'),
      ],
      [
        {
          domain: 'sel',
          skill: 'saying sorry',
          standard: 'CASEL: Relationship skills',
          kind: 'do',
          after: 5,
          check: 'edu:say:sorry',
          lines: [
            N('Let’s practise a good sorry, like Fern.'),
            N('(Take turns: “I’m sorry I… I will…”)'),
          ],
          parentNote: 'Practised a good apology: say what you did, then make it right.',
        },
      ],
    ),
    // ------------------------------------------------ step 7
    sc(
      's25-grass',
      [
        N('A hot, still day. Your Nubbin takes the toy to the long grass.'),
        N('The wild Nubbins live in the long grass.'),
        N('Moss is sitting on a flat stone nearby.'),
        M('Keep still. They’re shy. And a bit rude. They’re young.'),
        N('Your Nubbin puts the toy down in the grass.'),
        N('Rustle, rustle. Something is moving in the grass.'),
      ],
      [
        {
          domain: 'science',
          skill: 'animals live where their needs are met',
          standard: 'K-ESS3-1',
          kind: 'ask',
          after: 1,
          prompt: [N('Where do the wild Nubbins live?')],
          options: [
            opt('In the long grass', [N('Yes! The long grass is their home. It is a good place to hide.')], true),
            opt('In a teacup', [N('Too small! The wild ones live in the long grass.')]),
            opt('On the roof', [N('Not on the roof. They live in the long grass, where they can hide.')]),
          ],
          parentNote: 'Talked about where animals live: a home that meets their needs.',
        },
      ],
    ),
    sc(
      's25-wild',
      [
        N('Out come the wild Nubbins.'),
        N('Sniff, sniff. They bounce away. They come back.'),
        M('That one thinks he can’t hop.', 'think'),
        M('That one says he smells of indoors.'),
        N('Then the wild ones are gone. Whoosh!'),
        N('Your Nubbin hugs the toy tight.'),
        M('They think Real means hopping. I used to think so too.', 'happy'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 3',
          standard: 'K.CC.B.5',
          kind: 'do',
          after: 0,
          check: 'edu:count:wild-nubbins:3',
          lines: [
            N('How many wild Nubbins? (Point and count together.)'),
            N('One, two, three. Three wild Nubbins!'),
          ],
          parentNote: 'Counted three wild Nubbins.',
        },
      ],
    ),
    // ------------------------------------------------ step 8
    sc(
      's25-clank',
      [
        N('A wet day. Moss sits on the window ledge again.'),
        N('Squeak, squeak, whistle! Clank rolls up the path.'),
        CK('Announcement: I am watering the rain!', 'happy'),
        CK('What is that? On the windowsill?'),
        Y('He’s a toy. Gran Hazel knitted him.'),
        CK('Somebody made him? Pixel made me!', 'think'),
        CK('Is there a book? Is there a me in it?', 'soft'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'first sounds: the “k” sound',
          standard: 'RF.K.2',
          kind: 'ask',
          after: 1,
          prompt: [N('Clank starts with a “k” sound. Which word starts like Clank?')],
          options: [
            opt('Cat', [N('Yes! C-c-cat and C-c-Clank. Same first sound.')], true),
            opt('Sun', [N('Sun starts with “s”. Cat starts like Clank: c-c-c!')]),
            opt('Moon', [N('Moon starts with “m”. Cat starts like Clank: c-c-c!')]),
          ],
          parentNote: 'Matched words with the same first sound.',
        },
      ],
    ),
    sc(
      's25-page',
      [
        N('You find a page about clockwork toys. You read it out.'),
        N('The page says clockwork toys stay toys for ever.'),
        N('Clank’s whistle goes low and quiet.'),
        M('That book was wrong. I’m older than that book.'),
        N('You tell Clank what Moss said. Clank’s light comes up.'),
        CK('Is Real the word? The one I couldn’t find?', 'soft'),
        M('No. It lives next door to that word. Keep looking.'),
        N('You tell Clank. He thinks very hard.'),
        CK('Next door! Announcement: I am going to look next door.', 'soft'),
      ],
      [pageBeat(2)],
    ),
    // ------------------------------------------------ step 9
    sc(
      's25-shabby',
      [
        N('Summer goes by. The toy gets carried everywhere.'),
        N('Now he is grey and worn. His bobble has gone.'),
        CL('Oh, look at him! There’s a hole in his elbow!', 'sad'),
        CL('I could knit you a new one.'),
        N('Your Nubbin looks at the new wool. Then it sits on the old toy!'),
        M('Once you’re Real, worn-out bits don’t matter.', 'soft'),
        N('Clover can’t hear Moss. But she understands.'),
        CL('You’re right. No new one. I’ll mend his elbow instead.', 'soft'),
      ],
      [
        {
          domain: 'sel',
          skill: 'old, loved things are precious',
          standard: 'ELOF: Social and Emotional Development',
          kind: 'ask',
          after: 4,
          prompt: [N('Why does your Nubbin want the old toy, not a new one?')],
          options: [
            opt('Because it loves him', [N('Yes. Loved things stay special, even when they’re old.')], true),
            opt('Because he’s shiny', [N('He isn’t shiny at all! He’s special because he is loved.')]),
            opt('Because he’s new', [N('He’s very old! He’s special because he is loved.')]),
          ],
          parentNote: 'Talked about why old, loved things matter to us.',
        },
      ],
    ),
    sc(
      's25-darned',
      [
        N('Clover sews up the hole. In and out, in and out.'),
        N('Your Nubbin watches every little stitch.'),
        N('Snip! The elbow is mended.'),
        CL('Mended isn’t the same as new. It’s better.', 'happy'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 5',
          standard: 'K.CC.B.5',
          kind: 'do',
          after: 1,
          check: 'edu:count:stitches:5',
          lines: [
            N('Let’s count Clover’s stitches. (Tap each one.)'),
            N('One, two, three, four, five. Five stitches!'),
          ],
          parentNote: 'Counted five stitches, touching each one.',
        },
      ],
    ),
    // ------------------------------------------------ step 10
    sc(
      's25-chill',
      [
        N('One morning, your Nubbin sneezes. Atchoo! Atchoo!'),
        N('It feels hot. It doesn’t want its plum.'),
        N('Your Nubbin is poorly. You run to get help.'),
        CL('It’s a chill. Just a small cold. It will be all right.', 'soft'),
        CL('It needs rest, sips of water and a warm bed.'),
        CL('And someone to sit with it all night.'),
        N('Your Nubbin curls up in its basket, with the toy.'),
      ],
      [
        {
          domain: 'health',
          skill: 'what helps when you are poorly',
          standard: 'ELOF: Perceptual, Motor, and Physical Development',
          kind: 'ask',
          after: 5,
          prompt: [N('What helps a poorly Nubbin get better?')],
          options: [
            opt('Rest, water and a cuddle', [N('Yes! Rest, sips of water and someone kind nearby.')], true),
            opt('Running races', [N('Running is for when we’re well. Poorly bodies need rest.')]),
            opt('Staying up all night', [N('Poorly bodies need lots of sleep. Rest and water help.')]),
          ],
          parentNote: 'Talked about what helps when we feel poorly: rest, water and care.',
        },
      ],
    ),
    sc(
      's25-better',
      [
        N('Clover peeks in, again and again, all night.'),
        N('In the morning your Nubbin feels cool again. Hooray!'),
        N('It is hungry. It eats two plums, and half of yours!'),
        CL('Told you! All better.', 'happy'),
        CL('Now everything it slept on must be washed.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 3',
          standard: 'K.CC.B.4',
          kind: 'do',
          after: 0,
          check: 'edu:count:visits:3',
          lines: [
            N('Clover came at midnight, then later, then later again.'),
            N('(Knock three times, like Clover. Knock, knock, knock! Three visits.)'),
          ],
          parentNote: 'Counted three knocks, one for each visit.',
        },
      ],
    ),
    // ------------------------------------------------ step 11
    sc(
      's25-bundle',
      [
        N('The big wash pot is hot. In go the blankets. Splash!'),
        N('Clover reaches for the toy. Then she stops.'),
        CL('Oh, no. Hot water makes old wool shrink, tiny and hard.', 'sad'),
        CL('He could go out with the old rags, for the rag cart.'),
        CL('Or you could wash him by hand, in cold water. Slowly.', 'think'),
        N('Your Nubbin is better. It is asleep in the sun.'),
        N('The toy is in your hands. What will you do?'),
      ],
      [
        {
          domain: 'health',
          skill: 'why we wash bedding after someone is ill',
          standard: 'ELOF: Perceptual, Motor, and Physical Development',
          kind: 'notice',
          after: 0,
          lines: [
            N('When someone is poorly, tiny germs get on their bed.'),
            N('A hot wash gets the germs out. Fresh and clean!'),
          ],
          parentNote: 'Heard why bedding is washed after someone has been poorly.',
        },
        {
          domain: 'science',
          skill: 'hot and cold change things',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'ask',
          after: 4,
          prompt: [N('Which water keeps the old toy the same size?')],
          options: [
            opt('Cold water', [N('Yes! Cold water, and gentle hands, keep old wool soft.')], true),
            opt('Hot water', [N('Hot water makes old wool shrink. Cold water is gentler.')]),
          ],
          parentNote: 'Learned that hot water can shrink wool, and cold water is gentler.',
        },
      ],
      {
        choices: [
          {
            id: 'gone',
            label: 'Let him go with the rag bundle.',
            set: { 's25-toy': 'gone' },
            then: [N('You put him on top, the right way up, looking at the sky.'), CL('That’s a kind way to do it.', 'soft')],
          },
          {
            id: 'kept',
            label: 'Wash him yourself, in cold water.',
            set: { 's25-toy': 'kept' },
            then: [CL('Squeeze him gently. Don’t twist. And don’t rush!')],
          },
        ],
      },
    ),
    sc(
      's25-shed',
      [
        N('You carry the bundle out to the shed. The toy sits on top.'),
        N('The sun goes down behind the hill.'),
        N('Your Nubbin is still asleep. You let it sleep.'),
        N('Goodnight, sun.'),
      ],
      [
        {
          domain: 'science',
          skill: 'day and night',
          standard: '1-ESS1-1',
          kind: 'ask',
          after: 1,
          prompt: [N('The sun goes down. What comes next?')],
          options: [
            opt('Night', [N('Yes! When the sun goes down, it gets dark. Night-time.')], true),
            opt('Breakfast', [N('Breakfast is in the morning! After sunset comes night.')]),
            opt('Lunch', [N('Lunch is in the middle of the day. After sunset comes night.')]),
          ],
          parentNote: 'Talked about the pattern of day and night.',
        },
      ],
    ),
    // ------------------------------------------------ step 12
    sc(
      's25-dew',
      [
        N('That night you sit by the window. You look at the shed.'),
        N('Drip. A drop of dew runs off the toy’s button eye.'),
        N('Something tiny and pale lifts out of the grass.'),
        N('It’s a little light, as small as a thimble.'),
        N('It floats over the lawn, slowly, slowly.'),
        N('It goes into the long grass, where the wild ones live.'),
        N('You don’t follow it. You just watch.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'compare sizes: smallest',
          standard: 'K.MD.A.2',
          kind: 'ask',
          after: 3,
          prompt: [N('A thimble fits on the tip of your finger. Which is the smallest?')],
          options: [
            opt('A thimble', [N('Yes! A thimble is tiny. The little light was tiny too.')], true),
            opt('A teapot', [N('A teapot is much bigger. The thimble is the smallest.')]),
            opt('A hat', [N('A hat fits your whole head! The thimble is the smallest.')]),
          ],
          parentNote: 'Compared sizes and picked the smallest.',
        },
      ],
    ),
    sc(
      's25-gap',
      [
        N('In the morning, the toy is not on the bundle.'),
        N('There is a toy-shaped gap. Nothing else has moved.'),
        N('In the grass you find his button eye. You keep it.'),
        N('Your Nubbin sits by the long grass for a while.'),
        N('It isn’t sad. It looks like it just waved goodbye.'),
        N('Moss looks at the long grass all day.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'remembering someone we miss',
          standard: 'ELOF: Social and Emotional Development',
          kind: 'ask',
          after: 2,
          prompt: [N('You keep the button. Why?')],
          options: [
            opt('To remember the toy', [N('Yes. Keeping something small helps us remember someone we miss.')], true),
            opt('To eat it', [N('Oh no, not for eating! It’s for remembering the toy.')]),
            opt('To throw it away', [N('You keep it safe instead. It helps you remember.')]),
          ],
          parentNote: 'Talked about keepsakes, and how they help us remember.',
        },
      ],
    ),
    // ------------------------------------------------ step 13
    sc(
      's25-falls',
      [
        N('You come home late from the Hollow.'),
        N('Moss is on the window ledge.'),
        N('On the window seat is a faded patch, where the toy used to sit.'),
        N('You have something to tell Moss.'),
        N('Today you went behind the waterfall. The rock was warm!'),
      ],
      [fallsBeat],
    ),
    sc(
      's25-twice',
      [
        Y('There’s a warm pool behind the waterfall.'),
        M('The Wellspring. Yes.', 'soft'),
        M('Long ago, the first ones came out of that water, as little lights.', 'think'),
        M('Nobody ever told me where the lights came from.'),
        N('Moss looks past the pond, to the long grass.'),
        M('I have a guess.', 'soft'),
      ],
      [
        {
          domain: 'maths',
          skill: 'position words: past, to',
          standard: 'K.G.A.1',
          kind: 'ask',
          after: 4,
          prompt: [N('Where is Moss looking?')],
          options: [
            opt('At the long grass', [N('Yes! Past the pond, to the long grass, where the light went.')], true),
            opt('At the ceiling', [N('Not up! He looks out, past the pond, to the long grass.')]),
            opt('At his toes', [N('Not down! He looks out, past the pond, to the long grass.')]),
          ],
          parentNote: 'Followed position words (past, to) to find where Moss was looking.',
        },
      ],
    ),
  ],
  notes:
    'Sprout band. Keeps every choice (no defaultChoice needed). No lifted text. Moss is silent and unnamed in s25-sill ' +
    '(chapter 3), named and silent in s25-sill-late, and speaks from s25-real on, heard only by you.',
};

// complete
S25.scenes.push(
  sc(
    's25-complete',
    [
      N('Moss asks you to write it down. So you do.'),
      N('A new page in your journal. At the top: HOW TOYS BECOME REAL.'),
      M('Twice round, and loved the whole way, and settled in itself.', 'soft'),
      Y('What does that mean?'),
      M('It means what it says. It’s late. My hill is far.'),
      N('Moss walks off into the dark, slow and happy.'),
      N('You leave the next page empty. Just in case.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'letter R',
        standard: 'ELOF: Literacy',
        kind: 'do',
        after: 1,
        check: 'edu:trace:letter:r',
        lines: [
          N('REAL starts with R. Rrrr, like a growly tiger!'),
          N('(Draw a big R in the air together.)'),
        ],
        parentNote: 'Heard the “r” sound and drew the letter R.',
      },
      {
        domain: 'maths',
        skill: 'twice means two times',
        standard: 'K.CC.B.4',
        kind: 'notice',
        after: 2,
        lines: [N('Twice means two times. (Clap twice: one, two!)')],
        parentNote: 'Learned that “twice” means two times.',
      },
    ],
  ),
);

// ================================================================== variant scenes
export const EDU_S25_SPROUT_VARIANTS: EduScene[] = [
  // step 2 done, if c4-open has played
  sc(
    's25-sill-late',
    [
      N('Click! The lamp comes on. Tick, tick, tick.'),
      N('Everyone goes down the ladder, talking about the moth.'),
      N('You put the toy and the book on the window seat.'),
      N('One week goes by. Then two weeks.'),
      N('The toy sits on the windowsill, in the sun.'),
      N('Nobody plays with it.'),
      N('On the hill, Moss is looking this way. Is he looking at the toy?'),
    ],
    [sillBeat],
  ),
  // step 4 scene, no Sable
  sc(
    's25-storm-nosable',
    [
      N('Later that week, your Nubbin finds the toy on the windowsill.'),
      N('It sniffs it. Atchoo! Then it runs off after a moth.'),
      N('Not yet, then.'),
      ...STORM,
    ],
    [stormBeat(6)],
  ),
  // step 8 done, with s21Done and a13-clank-word
  sc(
    's25-page-found',
    [
      N('You find a page about clockwork toys. You read it out.'),
      N('The page says clockwork toys stay toys for ever.'),
      N('Clank’s light stays bright. He isn’t worried.'),
      M('That book was wrong. I’m older than that book.'),
      N('You tell Clank. He does a happy spin.'),
      CK('Announcement: I found my word already! In Nova’s book.', 'happy'),
      CK('Is Real the same word? I don’t think so.', 'think'),
      M('No. It lives next door. He’s already knocked.'),
      CK('Next door! Announcement: I have a neighbour!', 'soft'),
    ],
    [
      {
        domain: 'sel',
        skill: 'being a good neighbour',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 8,
        prompt: [N('A neighbour lives next door. What do good neighbours do?')],
        options: [
          opt('Wave and say hello', [N('Yes! Good neighbours wave, say hello and help each other.')], true),
          opt('Hide from each other', [N('That’s not very friendly! Good neighbours wave and say hello.')]),
          opt('Shout over the wall', [N('Shouting isn’t kind. Good neighbours wave and say hello.')]),
        ],
        parentNote: 'Talked about being a kind neighbour.',
      },
    ],
  ),
  // step 8 scene, without s21Done
  sc(
    's25-byte',
    [
      N('A wet day. Moss sits on the window ledge again.'),
      N('Byte comes up the path with an umbrella.'),
      BY('Hazel lent me a pencil. I’m bringing it back. Nine years late.', 'think'),
      N('He sees the toy on the windowsill.'),
      BY('Fern says this toy is Real. What does Real mean?'),
      BY('Hazel had a book for everything. Is there a book?'),
    ],
    [
      {
        domain: 'science',
        skill: 'weather: what keeps us dry in the rain',
        standard: 'K-ESS2-1',
        kind: 'ask',
        after: 1,
        prompt: [N('It is raining. What keeps Byte dry?')],
        options: [
          opt('His umbrella', [N('Yes! An umbrella keeps the rain off. Pitter-patter on top.')], true),
          opt('A sunhat', [N('A sunhat is for sunny days. An umbrella keeps off the rain.')]),
          opt('A spoon', [N('A spoon is far too small! An umbrella keeps off the rain.')]),
        ],
        parentNote: 'Matched rainy weather to what keeps us dry.',
      },
    ],
  ),
  // step 8 done, without s21Done
  sc(
    's25-page-byte',
    [
      N('You read Byte the page about the old horse.'),
      N('Byte writes it all down. Then he frowns.'),
      BY('There are no numbers on this page! How can I check it?', 'think'),
      BY('Ask Moss. Can Real be measured?'),
      M('Tell him to try.'),
      N('You tell Byte. He starts a new list.'),
      BY('I’ll make a mark for every hug the toy gets.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'count marks to 5',
        standard: 'K.CC.B.5',
        kind: 'do',
        after: 6,
        check: 'edu:count:tally:5',
        lines: [
          N('Your Nubbin hugs the toy. Byte makes a mark. Again! Again!'),
          N('(Count Byte’s marks together.) One, two, three, four, five!'),
        ],
        parentNote: 'Counted five tally marks.',
      },
    ],
  ),
  // step 11 done, kept
  sc(
    's25-shed-kept',
    [
      N('You carry the rag bundle out to the shed.'),
      N('The toy is not in it. He is in a tub of cold water.'),
      N('You wash him slowly, all evening. Squeeze, squeeze.'),
      N('Never twist. Never rush. Clover checks.'),
      N('Your hands get cold. Then they get patient.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'being patient',
        standard: 'CASEL: Self-management',
        kind: 'do',
        after: 2,
        check: 'edu:squeeze:toy:slowly',
        lines: [
          N('Slow and gentle. Let’s do it too.'),
          N('(Squeeze your hands slowly together. Squeeze… and let go. Squeeze… and let go.)'),
        ],
        parentNote: 'Practised doing something slowly and gently: being patient.',
      },
    ],
  ),
  // step 12 scene, kept
  sc(
    's25-line',
    [
      N('It is dark. Clover says that will do.'),
      N('Your fingers are white and wrinkly from the cold water.'),
      N('You roll the toy in a towel. The towel drinks up the water.'),
      CL('Now let him rest by the warm stove. Not too close.'),
      N('His loose eye came off. Clover will sew it back.'),
      N('Your Nubbin lies down beside him, all night.'),
    ],
    [
      {
        domain: 'science',
        skill: 'some things soak up water',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'ask',
        after: 2,
        prompt: [N('What soaks up water best?')],
        options: [
          opt('A towel', [N('Yes! A towel is soft and thirsty. It soaks up water.')], true),
          opt('A spoon', [N('Water runs right off a spoon. A towel soaks it up.')]),
          opt('A stone', [N('A stone stays hard and dry inside. A towel soaks up water.')]),
        ],
        parentNote: 'Found out that some materials, like towels, soak up water.',
      },
    ],
  ),
  // step 12 done, kept
  sc(
    's25-line-dry',
    [
      N('In the morning, you peg the toy on the washing line.'),
      N('The sun shines. The wind blows. By lunchtime he is dry!'),
      N('He is a bit smaller now, and lumpier.'),
      N('Clover sews his eye back on, tight.'),
      N('She gives your Nubbin a spare button to wear, too.'),
      N('Moss comes to look at the toy on its bed.'),
      M('He’s Real to you now. That’s the best ending, mostly.', 'soft'),
    ],
    [
      {
        domain: 'science',
        skill: 'the sun warms and dries things',
        standard: 'K-PS3-1',
        kind: 'notice',
        after: 1,
        lines: [N('The sun warms the wet wool. Bit by bit, the water dries away.')],
        parentNote: 'Learned that the sun’s warmth helps wet things dry.',
      },
    ],
  ),
  // step 13 scene, kept
  sc(
    's25-falls-kept',
    [
      N('You come home late from the Hollow.'),
      N('Moss is on the window ledge.'),
      N('On your Nubbin’s bed, the toy is waiting. Both eyes on tight.'),
      N('You have something to tell Moss.'),
      N('Today you went behind the waterfall. The rock was warm!'),
    ],
    [fallsBeat],
  ),
  // step 13 done, kept
  sc(
    's25-twice-kept',
    [
      Y('There’s a warm pool behind the waterfall.'),
      M('The Wellspring. Yes.', 'soft'),
      M('Long ago, the first ones came out of that water, as little lights.', 'think'),
      M('Nobody ever told me where the lights came from.'),
      N('Moss looks at your Nubbin, asleep, hugging its toy.'),
      M('I have a guess. Just a guess.', 'soft'),
      M('He can stay right there while I think.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'characters in a story',
        standard: 'RL.K.3',
        kind: 'ask',
        after: 4,
        prompt: [N('Who is fast asleep, hugging the toy?')],
        options: [
          opt('Your Nubbin', [N('Yes! Your Nubbin, snug and asleep with its toy.')], true),
          opt('Moss', [N('Moss is awake, thinking. Your Nubbin is the one asleep.')]),
          opt('Clover', [N('Clover has gone home. Your Nubbin is the one asleep.')]),
        ],
        parentNote: 'Named who was doing what in the story.',
      },
    ],
  ),
  // the spring coda
  codaWild('button'),
  codaWild('bobble'),
  codaWild('mister'),
  codaCoat('button'),
  codaCoat('bobble'),
  codaCoat('mister'),
  // idle lines
  sc(
    's25-moss-kept',
    [
      N('Your Nubbin drags the toy through the daisies.'),
      N('Bump, bump, bump goes the toy.'),
      M('He’s getting more worn. Good. Keep it up.', 'happy'),
      N('Moss is smiling. Can you see?'),
    ],
    [
      {
        domain: 'maths',
        skill: 'count to 4',
        standard: 'K.CC.B.5',
        kind: 'do',
        after: 0,
        check: 'edu:count:daisies:4',
        lines: [N('How many daisies? (Point and count together.) One, two, three, four!')],
        parentNote: 'Counted four daisies.',
      },
    ],
  ),
  sc(
    's25-moss-gone',
    [
      N('Moss is looking at the long grass again.'),
      M('I’m only looking. I’m allowed to look at grass.', 'soft'),
      M('It’s most of what I do.'),
      N('You sit next to Moss and look too.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'keeping someone company',
        standard: 'CASEL: Social awareness',
        kind: 'notice',
        after: 3,
        lines: [N('Sitting next to someone, quietly, is a kind thing to do.')],
        parentNote: 'Noticed that keeping someone quiet company is kind.',
      },
    ],
  ),
  sc(
    's25-clank-next-door',
    [
      CK('Announcement: I live next door to a word!', 'happy'),
      CK('Moss says so.'),
      CK('Next door is a good place. You can wave!', 'soft'),
      N('Clank waves. Wave back to Clank!'),
    ],
    [
      {
        domain: 'sel',
        skill: 'friendly greetings',
        standard: 'CASEL: Relationship skills',
        kind: 'do',
        after: 3,
        check: 'edu:wave:clank',
        lines: [N('(Wave to Clank together. Hello, Clank!)')],
        parentNote: 'Practised a friendly greeting.',
      },
    ],
  ),
];

export const EDU_S25_SPROUT: EduQuest[] = [S25];

/** Every `edu:` check string used in this file. */
export const CHECKS: string[] = [
  'edu:say:first-sound:b',
  'edu:count:clockwork:3',
  'edu:count:days:7',
  'edu:sit:still:5',
  'edu:order:toy-trip',
  'edu:say:sorry',
  'edu:count:wild-nubbins:3',
  'edu:count:stitches:5',
  'edu:count:visits:3',
  'edu:trace:letter:r',
  'edu:count:tally:5',
  'edu:squeeze:toy:slowly',
  'edu:tap:letter:b',
  'edu:tap:letter:m',
  'edu:count:daisies:4',
  'edu:wave:clank',
];
