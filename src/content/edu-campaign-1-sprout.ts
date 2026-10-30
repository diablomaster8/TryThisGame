/**
 * The Learning Grove, sprout band (ages 3–6, read aloud): Book One, chapters 1–4, plus the
 * global triggered scenes (t-*). Educational versions of every scene in BOOK1_SCENES
 * (campaign-book1.ts), matched by id (`sprout:c1-letter` replaces `c1-letter`). See EDU-STYLE.md.
 *
 * Band notes
 * - Hazel is "away, helping lost Nubbins". Sprout leaves out "up the hill" in her letter (in
 *   the valley that phrase means the memorial flowers), so no child hears Gran might be dead.
 * - The Tale of the Four is a gentle picture-book tale. Fading is said plainly ("That means
 *   they die"), with the comfort straight after: the loved one stays, the flower, the
 *   remembering. The very long winter is cold and sad, never frightening.
 * - Corvin is a man with a cold hand who wants to buy your Nubbin; the child says no.
 * - c2-corvin leaves out 'sell' (defaultChoice 'refuse'); c3-open leaves out 'grab'
 *   (defaultChoice 'slow'). Every other choice id is kept, with its original set/friendship.
 * - The Lantern Song (c4-close) is sung as written: verse one in the scene, the refrain as a
 *   join-in beat. Luna sings the first line alone; speaker chorus (everyone) sings the rest. The third verse ("sleeping eyes") is left out, because sprout never pairs
 *   death with sleep.
 */
import type { EduCampaign, EduScene, Lesson } from './types';
import type { Line, Choice } from '../config/story';

type Mood = NonNullable<Line['mood']>;

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

const N = say('narrator');
const YOU = say('you');
const HAZEL = say('hazel');
const FERN = say('fern');
const SPARKS = say('sparks');
const MARINA = say('marina');
const CORVIN = say('corvin');
const LUNA = say('luna');
const CLOVER = say('clover');
const MOSS = say('moss');
const BYTE = say('byte');
const CHORUS = say('chorus');

const scene = (
  of: string,
  lines: Line[],
  lessons: Lesson[],
  choices?: Choice[],
  defaultChoice?: string,
): EduScene => {
  const s: EduScene = { id: `sprout:${of}`, of, band: 'sprout', lines, lessons };
  if (choices) s.choices = choices;
  if (defaultChoice) s.defaultChoice = defaultChoice;
  return s;
};

const lid = (of: string, n: number): string => `sprout:${of}-l${n}`;

// ---------------------------------------------------------------- chapter 1: The Letter

const CH1: EduScene[] = [
  scene(
    'c1-letter',
    [
      { ...N('The gate is stuck. Lift and push! Lift and push!'), act: 'gate', refrain: 'lift-push' },
      N('Creak! It opens. This is Gran’s Grove. But Gran is not here.'),
      N('On the signpost is a letter. Your name is on the front!'),
      HAZEL('“I’ve gone to help some lost Nubbins. Don’t make a fuss.”', 'soft'),
      HAZEL('“Two eggs are in the long grass. They need warm hands. Yours!”', 'soft'),
      HAZEL('“Love, Gran. P.S. The gate sticks. Lift and push!”', 'happy'),
      N('You laugh. You miss her too. Two feelings at once.'),
      N('Up on the hill, something small and grey watches. Very still.'),
      FERN('Hello! I’m Fern, from next door. Chin up! You’ve got Gran’s chin!', 'happy'),
      FERN('I put that stone on the letter. That was my job!', 'happy'),
    ],
    [
      {
        id: lid('c1-letter', 1),
        domain: 'literacy',
        skill: 'the first sound of your own name',
        standard: 'RF.K.2',
        kind: 'do',
        after: 2,
        check: 'edu:say:first-sound:name',
        lines: [
          N('(Say the name on the letter. It’s your name!)'),
          N('(What sound does your name start with? Say just that sound.)'),
          N('(Now draw that letter in the air with one finger.)'),
        ],
        parentNote:
          'Your child said their own name, picked out its first sound and drew its first letter in the air.',
      },
      {
        id: lid('c1-letter', 2),
        domain: 'sel',
        skill: 'listening to and remembering three kind rules',
        standard: 'CASEL: Responsible decision-making',
        kind: 'do',
        after: 4,
        check: 'edu:say:rules:3',
        lines: [
          HAZEL('“Rule one: feed them before you feed yourself.”'),
          HAZEL('“Rule two: never, ever throw one.”'),
          HAZEL('“Rule three: when you’re stuck, sit down next to them and wait.”'),
          N('(Gran wants you to remember these. Say them with me!)'),
          N('(Hold up one finger for each rule: one, two, three.)'),
        ],
        parentNote:
          'Your child listened to Gran’s three rules for caring for animals and said them back.',
      },
    ],
    [
      {
        id: 'stone',
        label: 'It’s a very good stone.',
        friendship: { fern: 2 },
        then: [
          FERN('Thank you! Nobody ever says that about the stone.', 'happy'),
          FERN('It came from the stream. It has a friendly face.'),
          N('Off you go to find the eggs. Listen, they go hum, hum!'),
        ],
      },
      {
        id: 'need',
        label: 'What do you need?',
        friendship: { fern: 1 },
        then: [
          FERN('Oh, lots! A ladder. Someone to hold the ladder.', 'think'),
          FERN('And someone to say the pear tree isn’t my fault.'),
          FERN('The pear tree is a tiny bit my fault.', 'soft'),
          N('Off you go to find the eggs. Listen, they go hum, hum!'),
        ],
      },
      {
        id: 'eggs',
        label: 'Say nothing. Go to the eggs.',
        then: [
          FERN('Straight to work! Just like your Gran.', 'soft'),
          N('The long grass tickles your knees. The eggs go hum, hum, close by.'),
        ],
      },
    ],
  ),
  scene(
    'c1-close',
    [
      N('Crack! The egg opens. Out comes a baby Nubbin!', 'happy'),
      N('It is small and warm. It wears a shell hat!'),
      N('The shell hat slips over its eyes. Pop! Up it goes again.'),
      N('It leans into your hand. You both stay very still.'),
      SPARKS('HEY! Don’t move! I’m fixing this lantern post!', 'shock'),
      SPARKS('Fixed it! I’m Sparks. Is your Nubbin fast? It looks fast!', 'happy'),
      FERN('It is three minutes old, Sparks.'),
      SPARKS('Potential, Fern. I’m talking about potential.'),
      N('Dusk. The lanterns light up, one by one. Gold on the water!'),
      SPARKS('That fourth one only flickers. Never has, not properly.', 'think'),
      N('On the hill, the little grey shape comes one step down.'),
    ],
    [
      {
        id: lid('c1-close', 1),
        domain: 'science',
        skill: 'which baby animals hatch from eggs',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'ask',
        after: 3,
        prompt: [
          FERN('Your Nubbin hatched from an egg!'),
          FERN('Which baby animal hatches from an egg too?'),
        ],
        options: [
          {
            label: 'A chick',
            best: true,
            reply: [
              FERN('Yes! Chicks hatch from eggs. So do ducklings and baby turtles.', 'happy'),
            ],
          },
          {
            label: 'A puppy',
            reply: [
              FERN('A puppy in an egg? Crack… woof! That would be silly!'),
              FERN('Puppies grow inside their mum. They are born, not hatched.'),
              FERN('Chicks hatch from eggs, like your Nubbin!', 'happy'),
            ],
          },
          {
            label: 'A kitten',
            reply: [
              FERN('A kitten in an egg? Crack… meow! What a surprise!'),
              FERN('Kittens grow inside their mum. They are born, not hatched.'),
              FERN('Chicks hatch from eggs, like your Nubbin!', 'happy'),
            ],
          },
        ],
        parentNote:
          'Your child learned that some babies, like chicks, hatch from eggs, while puppies and kittens are born.',
      },
      {
        id: lid('c1-close', 2),
        domain: 'maths',
        skill: 'add one more (3 and 1 make 4)',
        standard: 'K.OA.A.1',
        kind: 'ask',
        after: 8,
        prompt: [
          SPARKS('Three lanterns glow bright. One more just flickers.'),
          N('(Count the bright ones together, then add the flickery one.)'),
          SPARKS('So how many lanterns are there?'),
        ],
        options: [
          {
            label: '3',
            reply: [
              SPARKS('Three bright ones, yes! Now one more: four!'),
              SPARKS('One, two, three… four lanterns.', 'happy'),
            ],
          },
          {
            label: '4',
            best: true,
            reply: [SPARKS('Four! Three and one more make four.', 'happy')],
          },
          {
            label: '5',
            reply: [
              SPARKS('Let’s count again. One, two, three… and four.'),
              SPARKS('Three and one more make four!', 'happy'),
            ],
          },
        ],
        parentNote: 'Your child counted three lanterns and added one more to make four.',
      },
    ],
  ),
];

// ---------------------------------------------------------------- chapter 2: Shells and Promises

const CH2: EduScene[] = [
  scene(
    'c2-open',
    [
      N('Morning. A lady comes up the lane. Splash, splash, goes her bucket.'),
      MARINA('I’m Marina. I taught Gran’s Nubbins to swim!', 'happy'),
      MARINA('What’s Gran’s rule one?', 'think'),
      YOU('Feed them before you feed yourself.'),
      MARINA('Yes! Then feed yourself too. Gran always forgot that bit.'),
      SPARKS('Hand-feeding! I’m GREAT at it. Flat hand. Fruit in the middle!', 'happy'),
      MARINA('Hold still. Let them come the last bit. That bit is theirs.'),
      N('Your Nubbin takes the plum. Then it takes Sparks’s thumb!'),
      SPARKS('OW! I didn’t do it FLAT!', 'shock'),
      MARINA('Rule four: don’t be Sparks.', 'happy'),
    ],
    [
      {
        id: lid('c2-open', 1),
        domain: 'health',
        skill: 'food gives our bodies energy',
        standard: 'K-LS1-1',
        kind: 'notice',
        after: 4,
        lines: [
          MARINA('Nubbins need food. So do you.'),
          MARINA('Food gives your body energy. Energy to run and swim and play.'),
          N('(What did you eat today? Tell Marina!)'),
        ],
        parentNote:
          'Your child heard that people and animals need food for energy, and talked about what they ate today.',
      },
      {
        id: lid('c2-open', 2),
        domain: 'sel',
        skill: 'waiting calmly',
        standard: 'CASEL: Self-management',
        kind: 'do',
        after: 6,
        check: 'edu:wait:count:5',
        lines: [
          N('(Hold your hand out flat, like Sparks says.)'),
          N('(Now keep it very still. Count slowly to five with me.)'),
          N('(One… two… three… four… five.)'),
          MARINA('Waiting is hard. You did it. Here it comes!', 'happy'),
        ],
        parentNote:
          'Your child practised waiting calmly, holding still while counting slowly to five.',
      },
    ],
  ),
  scene(
    'c2-corvin',
    [
      N('Late afternoon. A man in a grey coat stands at the gate.'),
      N('He doesn’t lift. He doesn’t push. The gate opens for him. No creak!'),
      N('That’s odd. It never does that for you.'),
      CORVIN('I’m Corvin. I run the races up the valley. I knew your Gran.'),
      N('He shakes your hand. Brr! His hand is cold, like ice.'),
      N('His hand goes to his coat pocket. It stays there.'),
      CORVIN('Your little Nubbin. I will give you lots of Shells for it.'),
      N('Your Nubbin hides behind your legs. It is scared.'),
      N('What will you say to Corvin?'),
    ],
    [
      {
        id: lid('c2-corvin', 1),
        domain: 'literacy',
        skill: 'hearing the same first sound (Corvin, cold, cat)',
        standard: 'RF.K.2',
        kind: 'ask',
        after: 4,
        prompt: [
          N('Corvin. Cold. Listen: c-c-Corvin. C-c-cold.'),
          N('They start with the same sound! Which word starts that way too?'),
        ],
        options: [
          {
            label: 'Cat',
            best: true,
            reply: [N('Yes! C-c-cat. Corvin, cold, cat. They all start with C.')],
          },
          {
            label: 'Sun',
            reply: [
              N('Corvin in the sun? Brr, he’d melt!'),
              N('Sun starts with sss. Listen again: c-c-Corvin.'),
              N('C-c-cat starts the same way! Corvin, cold, cat.'),
            ],
          },
          {
            label: 'Fish',
            reply: [
              N('A fish called Corvin? Splish, splash!'),
              N('Fish starts with fff. Listen again: c-c-Corvin.'),
              N('C-c-cat starts the same way! Corvin, cold, cat.'),
            ],
          },
        ],
        parentNote:
          'Your child listened for the hard “c” sound at the start of Corvin, cold and cat.',
      },
    ],
    [
      {
        id: 'refuse',
        label: 'No. They’re not for sale.',
        set: { corvinOffer: 'refused' },
        friendship: { marina: 2, ember: 2 },
        then: [
          CORVIN('Hm. You have her chin.'),
          N('He goes. On the gate, where his hand was, sits a little frost.'),
          N('Your Nubbin peeks out. Phew. It feels safe again.', 'soft'),
        ],
      },
      {
        id: 'consider',
        label: 'Let me think about it.',
        set: { corvinOffer: 'considered' },
        friendship: { marina: -1 },
        then: [
          CORVIN('Think, then. I’ll be at my races.'),
          N('He goes. On the gate, where his hand was, sits a little frost.'),
          N('Your Nubbin comes out slowly. It holds on to your leg.', 'soft'),
        ],
      },
    ],
    'refuse',
  ),
];

// ---------------------------------------------------------------- chapter 3: The One Who Hides

const CH3: EduScene[] = [
  scene(
    'c3-open',
    [
      N('Early summer. A warm night. You sit on the step.'),
      N('Moths tap the window. In the reeds, a frog goes plop!'),
      N('Something is at the edge of the long grass. A grey Nubbin!'),
      N('She is thin. One wing is hurt. When you breathe, she jumps.'),
      LUNA('Shh. Not yet.', 'soft'),
      LUNA('I’m Luna. I garden at night. She comes to eat, then runs.'),
      LUNA('Somebody held her too tight once. Now hands scare her.', 'sad'),
      LUNA('She’s gone grey. The grey stays. But she can feel better, slowly.', 'think'),
      LUNA('I call her Sable. What will you do?'),
    ],
    [
      {
        id: lid('c3-open', 1),
        domain: 'science',
        skill: 'some animals are awake at night',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'ask',
        after: 1,
        prompt: [
          LUNA('The moths and the frog are awake. Lots of animals wake up at night.'),
          LUNA('Which of these is awake at night too?'),
        ],
        options: [
          {
            label: 'An owl',
            best: true,
            reply: [LUNA('Yes! Lots of owls hunt at night. Hoo, hoo. So do hedgehogs.', 'happy')],
          },
          {
            label: 'A hen',
            reply: [
              LUNA('A hen up at midnight? Snore, snore! She’s asleep.'),
              LUNA('Hens sleep at night, up on a perch.'),
              LUNA('Owls are the night ones. Hoo, hoo!', 'happy'),
            ],
          },
        ],
        parentNote:
          'Your child learned that some animals, like owls, moths and hedgehogs, are awake at night.',
      },
      {
        id: lid('c3-open', 2),
        domain: 'sel',
        skill: 'noticing when someone is scared, and what helps',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 7,
        prompt: [LUNA('Look at her. She jumps when you breathe. How is Sable feeling?')],
        options: [
          {
            label: 'Scared',
            best: true,
            reply: [
              LUNA('Yes. Scared. Her body is ready to run.', 'soft'),
              LUNA('Quiet and slow and kind. That helps scared ones.'),
            ],
          },
          {
            label: 'Silly',
            reply: [
              LUNA('Silly Sable? She’d be dancing a jig! Boing, boing!', 'soft'),
              LUNA('She jumps at every sound. That means scared, not silly.'),
              LUNA('Quiet and kind helps.'),
            ],
          },
          {
            label: 'Sleepy',
            reply: [
              LUNA('A sleepy Sable? Zzz… she’d be snoring on the grass!', 'soft'),
              LUNA('Her eyes are wide open. That means scared, not sleepy.'),
              LUNA('Quiet and kind helps.'),
            ],
          },
        ],
        parentNote:
          'Your child read the signs that Sable is scared and heard that quiet, slow kindness helps.',
      },
    ],
    [
      {
        id: 'slow',
        label: 'Sit down. Put fruit on the ground. Wait.',
        set: { sableFirst: 'slow', sableTrustBonus: 6 },
        friendship: { luna: 4 },
        then: [
          N('You sit. You put a plum down. You wait… and wait…'),
          N('Step. Step. Sable comes. She eats, and she watches you.'),
          LUNA('That’s the whole trick. That’s all of it. Hazel would have liked you.', 'happy'),
        ],
      },
    ],
    'slow',
  ),
  scene(
    'c3-close',
    [
      N('Day after day, you leave fruit. You sit. You wait.'),
      N('Out on the lane, a child skips to a rhyme. Badly!'),
      N('Now Sable lets you sit near. She doesn’t run away!'),
      CLOVER('Oh, she’s letting you near! I’m Clover. I look after gentle ones.', 'happy'),
      CLOVER('The grey won’t go away. But that doesn’t mean she’s broken.', 'soft'),
      CLOVER('She’s carrying something sad. We can help make it lighter.', 'soft'),
      N('Next morning, look! Frost on the grass where Sable slept. Only there.'),
      N('And last night’s plums are gone. Munch, munch, all of them!'),
      N('On the sunny wall sits a little pile of plum stones.'),
      CLOVER('Someone’s taking her food! I’ll bring her in and knit her a blanket!', 'angry'),
      LUNA('No. She’ll come in her own time. That’s hers to choose.'),
    ],
    [
      {
        id: lid('c3-close', 1),
        domain: 'science',
        skill: 'sunshine warms the ground and melts frost',
        standard: 'K-PS3-1',
        kind: 'ask',
        after: 6,
        prompt: [
          CLOVER('Frost is tiny bits of ice. Here comes the sun.', 'think'),
          CLOVER('What will the sunshine do to the frost?'),
        ],
        options: [
          {
            label: 'Melt it away',
            best: true,
            reply: [
              CLOVER('Yes! The sun warms the grass. The frost melts. Drip, drip, gone!', 'happy'),
            ],
          },
          {
            label: 'Make it bigger',
            reply: [
              CLOVER('Bigger frost? A frosty mountain on the grass! Hee, hee!'),
              CLOVER('The sun is warm, and warm melts ice.'),
              CLOVER('Watch. Drip, drip… the frost is gone!', 'happy'),
            ],
          },
          {
            label: 'Turn it pink',
            reply: [
              CLOVER('Pink frost would be lovely!'),
              CLOVER('But warm melts ice. Drip, drip… gone!', 'happy'),
            ],
          },
        ],
        parentNote: 'Your child predicted that sunshine warms the ground and melts frost.',
      },
      {
        id: lid('c3-close', 2),
        domain: 'maths',
        skill: 'count to 6 to answer “how many?”',
        standard: 'K.CC.B.5',
        kind: 'do',
        after: 8,
        check: 'edu:count:plum-stones:6',
        lines: [
          LUNA('Let’s count the plum stones. Then we’ll know how many plums went.'),
          N('(Point to each stone and count together: 1, 2, 3, 4, 5, 6.)'),
          LUNA('Six! Sable is too little to eat six. It wasn’t her.', 'think'),
        ],
        parentNote:
          'Your child counted six plum stones, touching each one once, to find how many plums were eaten.',
      },
    ],
    [
      {
        id: 'side-luna',
        label: 'Luna’s right. Her own time.',
        friendship: { luna: 2 },
        then: [
          CLOVER('Yes. I know. I don’t like it.', 'sad'),
          CLOVER('I’ll just leave the blanket near her. By accident.'),
          LUNA('That’s allowed.', 'soft'),
        ],
      },
      {
        id: 'side-clover',
        label: 'Clover’s right. Nobody should be cold alone.',
        friendship: { clover: 2 },
        then: [
          CLOVER('Thank you!', 'happy'),
          LUNA('Then put the blanket down and walk away. Like fruit.'),
          CLOVER('Fine. But I’m making it extra thick!'),
        ],
      },
      {
        id: 'side-both',
        label: 'Both! Leave a blanket out. Let her find it.',
        friendship: { clover: 1, luna: 1 },
        then: [
          CLOVER('Oh!', 'soft'),
          LUNA('Hm. That’s very Hazel.', 'happy'),
          CLOVER('I’ll knit it in grey. Then she matches.'),
        ],
      },
    ],
  ),
];

// ---------------------------------------------------------------- chapter 4: Moss Remembers

const CH4: EduScene[] = [
  scene(
    'c4-open',
    [
      N('Halfway up the hill sits the little grey shape. Very still.'),
      N('You climb up. You sit beside him. You wait. That’s rule three.'),
      N('A bee goes buzz. The wind goes swish through the grass.'),
      MOSS('…You lift and push.', 'think'),
      N('The voice is small and dry. It’s coming from him!', 'shock'),
      MOSS('I am Moss. Gran said I was stubborn. She was being kind.'),
      YOU('Where is Gran?'),
      MOSS('She went past the waterfall, to find lost Nubbins.'),
      MOSS('Tonight is Lantern Night. She has never missed one.', 'soft'),
      MOSS('Tell me something. What do you think the lanterns are for?', 'think'),
    ],
    [
      {
        id: lid('c4-open', 1),
        domain: 'literacy',
        skill: 'the first sound of a name (M for Moss)',
        standard: 'RF.K.2',
        kind: 'ask',
        after: 5,
        prompt: [
          MOSS('Moss. Mmm-Moss. My name starts with mmm. The letter M.'),
          MOSS('What else starts with mmm?'),
        ],
        options: [
          {
            label: 'Moon',
            best: true,
            reply: [MOSS('Mmm-moon. Yes. The moon is old, like me.', 'happy')],
          },
          {
            label: 'Sun',
            reply: [
              MOSS('Me, a sun? Too sleepy to shine! Ha!'),
              MOSS('Sun starts with sss. Listen: mmm-Moss, mmm-moon.'),
              MOSS('Moon starts like me.', 'happy'),
            ],
          },
          {
            label: 'Bee',
            reply: [
              MOSS('Me, buzzing like a bee? Bzzz! What a sight!'),
              MOSS('Bee starts with b-b-b. Listen: mmm-Moss, mmm-moon.'),
              MOSS('Moon starts like me.', 'happy'),
            ],
          },
        ],
        parentNote:
          'Your child heard the “mmm” sound at the start of Moss and found another word that starts with M.',
      },
    ],
    [
      {
        id: 'lamps-remember',
        label: 'To remember the ones who’ve gone.',
        then: [
          MOSS('Yes. That is the oldest answer, and a good one.'),
          MOSS('Gran patted my head while she remembered. You may too.', 'soft'),
          MOSS('Light the pond lantern first tonight.'),
        ],
      },
      {
        id: 'lamps-home',
        label: 'So people can find their way home.',
        then: [
          MOSS('That was Gran’s answer. She said it every year.', 'soft'),
          MOSS('Pat my head while we look down the road. She always did.', 'soft'),
          MOSS('Light the long-grass lantern last. That side faces home.'),
        ],
      },
      {
        id: 'lamps-together',
        label: 'So nobody is alone in the dark.',
        then: [
          MOSS('Hm. Nobody ever said that before. I like it.', 'think'),
          MOSS('Sit closer. You may pat my head, if you like.', 'soft'),
          N('Your sleepy Nubbin shuffles closer too. Nobody is alone.'),
        ],
      },
      {
        id: 'lamps-dunno',
        label: 'I don’t know.',
        then: [
          MOSS('Good. I didn’t either, for a hundred years. Light them anyway.', 'happy'),
          MOSS('You may pat my head while you wonder. She always did.', 'soft'),
          MOSS('Don’t tell anyone. I have a reputation.'),
        ],
      },
    ],
  ),
  scene(
    'c4-close',
    [
      N('Pop, pop, pop! Three lanterns glow. The fourth one flickers.'),
      N('Here come the Keepers, through the gate. Lift and push!'),
      SPARKS('Fern’s lantern buns! Crunch! They’re very crunchy!', 'happy'),
      N('An old Nubbin taps a bun. Tap, tap! It rings like a bell.'),
      FERN('Oh dear. Buns are not meant to ring.'),
      SPARKS('That’s Byte. He counts everything. He counted my sandwiches. Twice.', 'happy'),
      MOSS('Psst. Tell Byte his shoelace is undone.'),
      N('You tell Byte. Byte looks down. It is undone!'),
      BYTE('Anyone could have seen that.', 'think'),
      MOSS('Nobody did.'),
      N('Then Luna starts to sing. One by one, everyone joins in.', 'soft'),
      LUNA('Light one for the pond where the first ones woke,', 'soft'),
      CHORUS('light one for the stream and the laughing folk,', 'soft'),
      CHORUS('light one for the wall where the quiet ones keep,', 'soft'),
      CHORUS('and one for the long grass, and the ones who sleep.', 'soft'),
    ],
    [
      {
        id: lid('c4-close', 1),
        domain: 'literacy',
        skill: 'hearing rhyme (keep, sleep)',
        standard: 'RF.K.2',
        kind: 'ask',
        after: 13,
        prompt: [
          N('(Listen: woke, folk. They rhyme! They sound the same at the end.)'),
          N('The last line rhymes with keep. Which word will it be?'),
        ],
        options: [
          {
            label: 'Sleep',
            best: true,
            reply: [N('Yes! Keep, sleep. Listen for it…')],
          },
          {
            label: 'Lantern',
            reply: [N('Keep, lantern? Ha! Lantern is a long, wobbly word.'), N('They don’t sound alike. Keep, sleep. Those rhyme! Listen…')],
          },
          {
            label: 'Pond',
            reply: [N('Keep, pond? Plop! Into the water it goes!'), N('They don’t sound alike. Keep, sleep. Those rhyme! Listen…')],
          },
        ],
        parentNote:
          'Your child listened to the song’s rhymes and guessed the rhyming word that comes next.',
      },
      {
        id: lid('c4-close', 2),
        domain: 'music',
        skill: 'joining in with a repeated refrain and keeping the beat',
        standard: 'RL.2.4',
        kind: 'do',
        after: 14,
        check: 'edu:sing:refrain:lantern-song',
        lines: [
          N('(Now the bit everyone knows. Sing it together!)'),
          CHORUS('Slow hands, warm hearts, the gate stuck fast —', 'soft'),
          CHORUS('what’s kept with love is kept to last.', 'soft'),
          N('(Sing it again, and pat your knees on every beat.)'),
          N('When the song ends, everyone stands a little closer.', 'soft'),
        ],
        parentNote:
          'Your child sang the Lantern Song’s refrain with the Keepers and patted the steady beat.',
      },
    ],
  ),
  scene(
    'c4-tale',
    [
      N('Late at night, Moss sits by the pond lantern. You sit too.'),
      YOU('Moss, what does the song mean?'),
      MOSS('Ah. You were listening. Sit, then. It is an old story.'),
      MOSS('Long ago, before the trees, there was a spring.'),
      MOSS('Behind the waterfall is a cave of sparkly rock.'),
      MOSS('In it is a pool of warm water. It has never frozen.'),
      MOSS('The first Nubbins came up out of it. Each one a small light.'),
      MOSS('Most Nubbins live a while, and then they fade. That means they die.', 'soft'),
      MOSS('But one who is loved enough stays. That is an Eternal. Like me.'),
      N('Out by the long grass, the fourth lantern flickers.'),
    ],
    [
      {
        id: lid('c4-tale', 1),
        domain: 'science',
        skill: 'very cold water freezes into ice',
        standard: '2-ESS2-3',
        kind: 'ask',
        after: 5,
        prompt: [
          MOSS('Water changes when it gets very, very cold.'),
          MOSS('What does it turn into?'),
        ],
        options: [
          {
            label: 'Ice',
            best: true,
            reply: [MOSS('Ice. Yes. But not this warm pool. Not ever.', 'happy')],
          },
          {
            label: 'Sand',
            reply: [
              MOSS('Cold water turning to sand? Crunch, crunch! A sandy pond!'),
              MOSS('Think of a puddle on a frosty morning. Hard and slippy.'),
              MOSS('Very cold water turns to ice. But not this warm pool.'),
            ],
          },
          {
            label: 'Juice',
            reply: [
              MOSS('I wish it did! But cold water turns to ice.', 'happy'),
              MOSS('Not this warm pool.'),
            ],
          },
        ],
        parentNote:
          'Your child learned that very cold water freezes into ice, and warm water stays runny.',
      },
    ],
    [
      {
        id: 'ask-loved',
        label: 'Who loved you enough?',
        then: [
          MOSS('A girl with a bucket. She carried me about in it.', 'soft'),
          MOSS('I was very small and very cross.', 'happy'),
          MOSS('She died long, long ago. Before the hill had flowers.', 'soft'),
          MOSS('When the first flower came up, I planted one for her, right beside it.', 'soft'),
          MOSS('I still go and sit by them both. I remember her.', 'soft'),
        ],
      },
      {
        id: 'ask-first',
        label: 'Were you one of the first?',
        then: [
          MOSS('No. I came later. I know the first ones from stories.'),
          MOSS('Like you know your gran’s gran. By the stories. And by the chin.', 'happy'),
        ],
      },
      {
        id: 'go-on',
        label: 'Go on.',
        then: [MOSS('Patient. Good. Hazel always interrupted.', 'happy')],
      },
    ],
  ),
  scene(
    'c4-tale-2',
    [
      MOSS('Once, four friends looked after this valley. I was one.'),
      MOSS('Briar, who laughed.', 'happy'),
      MOSS('Hush, who was quiet.', 'soft'),
      MOSS('Cinder, who hugged too tight.'),
      MOSS('And me. I sat.'),
      MOSS('Then came a very long winter. Snow, snow, snow.', 'sad'),
      MOSS('Cinder made a magic ice stone.'),
      MOSS('With it, she led every cold Nubbin to a warm, safe place.'),
      MOSS('But after, they were grey and still. They didn’t play any more.', 'sad'),
      MOSS('She made them safe by making them still.', 'sad'),
    ],
    [
      {
        id: lid('c4-tale-2', 1),
        domain: 'maths',
        skill: 'count to 4, one name for each finger',
        standard: 'K.CC.B.4',
        kind: 'do',
        after: 4,
        check: 'edu:count:wardens:4',
        lines: [
          N('(Count the four friends on your fingers: Briar, Hush, Cinder, Moss.)'),
          N('(One, two, three, four!)'),
          MOSS('Four. Yes. There used to be four of us.', 'soft'),
        ],
        parentNote: 'Your child counted the four wardens, one finger for each name.',
      },
      {
        id: lid('c4-tale-2', 2),
        domain: 'sel',
        skill: 'gentle hugs, and saying “too tight”',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 9,
        prompt: [
          MOSS('Cinder held them too tight. She meant it kindly.', 'soft'),
          MOSS('What makes a good hug, do you think?'),
        ],
        options: [
          {
            label: 'A gentle one, when you both want it',
            best: true,
            reply: [
              MOSS('Yes. Gentle, and only when they want one.', 'happy'),
              MOSS('And they can always wriggle free.'),
            ],
          },
          {
            label: 'The tightest squeeze ever',
            reply: [
              MOSS('The tightest squeeze ever? Squish! Like a bun in a fist!', 'soft'),
              MOSS('Too tight can hurt. A good hug is gentle.'),
              MOSS('Anyone can say, “Too tight, please!”'),
            ],
          },
        ],
        parentNote:
          'Your child talked about gentle hugs that both people want, and that anyone can say “too tight”.',
      },
    ],
    [
      {
        id: 'ask-rhyme',
        label: 'Cinder… like the rhyme?',
        then: [
          MOSS('You know it.'),
          N('You do! Everyone skips to it in the lane.'),
          YOU('Cinder held them close and tight,'),
          YOU('kept them warm one winter night;'),
          YOU('when the morning came to call,'),
          YOU('they did not move at all.'),
          MOSS('Children remember. They kept the tune, and forgot her.', 'soft'),
        ],
      },
      {
        id: 'ask-saved',
        label: 'But she saved them.',
        then: [
          MOSS('She did. But they never ran or played again.'),
          MOSS('Was that saved? I am still wondering.', 'think'),
        ],
      },
      {
        id: 'ask-briar',
        label: 'Tell me about Briar.',
        then: [
          MOSS('She laughed at everything. Even when she was dying.', 'happy'),
          MOSS('When she died, the first flower came up on the hill.', 'soft'),
          MOSS('A yellow one. It comes up early every spring, as if it can’t wait.'),
        ],
      },
    ],
  ),
  scene(
    'c4-tale-3',
    [
      MOSS('So Briar, Hush and I took the stone away from Cinder.'),
      MOSS('We broke it into four pieces. It did not want to break.'),
      MOSS('We hid one piece under each lantern post, to keep it asleep.'),
      MOSS('Pond, stream, old wall, and the long grass.'),
      MOSS('Cinder walked away into the snow. We never saw her again.', 'sad'),
      MOSS('Then winter ended. People came. They lit the lanterns every year.'),
      MOSS('Remembering keeps the pieces asleep. That is what Lantern Night is for.'),
      MOSS('One spring came a young woman in a too-big coat, with your chin.'),
      MOSS('I sat beside her a whole winter before I spoke. That was Hazel.', 'soft'),
      MOSS('She took one helper. Clever. In a hurry…'),
    ],
    [
      {
        id: lid('c4-tale-3', 1),
        domain: 'literacy',
        skill: 'putting a story in order: first, next, last',
        standard: 'RL.K.3',
        kind: 'do',
        after: 5,
        check: 'edu:order:tale:3',
        lines: [
          N('(Tap the three pictures in order: first, next, last.)'),
          N('First, the stone breaks into four pieces.'),
          N('Next, Cinder walks away into the snow.'),
          N('Last, people come and light the lanterns.'),
          MOSS('Yes. That is how it went.', 'soft'),
        ],
        parentNote:
          'Your child put three parts of Moss’s story in order using first, next and last.',
      },
    ],
    [
      {
        id: 'ask-apprentice',
        label: 'What happened to him?',
        then: [MOSS('That part isn’t a story yet. It’s still happening.', 'sad')],
      },
      {
        id: 'ask-fourth',
        label: 'Is the fourth piece still there?',
        then: [
          N('Moss looks at the fourth lantern. He doesn’t answer.'),
          MOSS('Ask me another night.'),
        ],
      },
      {
        id: 'sit',
        label: 'Say nothing. Sit with him.',
        then: [
          N('You sit. Moss leans on your arm, just a little.'),
          MOSS('Yes. Like that.', 'soft'),
        ],
      },
    ],
  ),
  scene(
    'c4-out',
    [
      N('Near morning, a cold wind blows down the valley. Whoosh.'),
      N('The fourth lantern goes flicker… flicker… out.'),
      MOSS('Twenty-two years.', 'sad'),
      YOU('Since what?'),
      MOSS('Not tonight. The other three will see us to morning.'),
      SPARKS('Zzz… huh? I didn’t touch it! …Zzz.', 'shock'),
      N('The sun comes up. The sky turns pink, then gold.'),
      MOSS('Gran will come. She always finishes things.', 'soft'),
      MOSS('One day, will you carry me round the posts? I’d like the company.'),
      N('By the dark post, Sable sits very still, watching too.'),
    ],
    [
      {
        id: lid('c4-out', 1),
        domain: 'science',
        skill: 'the Sun comes up in the morning and goes down in the evening',
        standard: '1-ESS1-1',
        kind: 'ask',
        after: 6,
        prompt: [MOSS('There it is. When does the sun come up?')],
        options: [
          {
            label: 'In the morning',
            best: true,
            reply: [MOSS('Yes. Up every morning. Down every evening. Never once late.', 'happy')],
          },
          {
            label: 'At bedtime',
            reply: [
              MOSS('The sun, up at bedtime? It would keep everyone awake!'),
              MOSS('At bedtime the sun goes down.'),
              MOSS('In the morning, up it comes. Like now.', 'happy'),
            ],
          },
        ],
        parentNote:
          'Your child learned the daily pattern of the Sun: up in the morning, down in the evening.',
      },
    ],
  ),
];

// ---------------------------------------------------------------- triggered scenes (any chapter)

const TRIGGERED: EduScene[] = [
  scene(
    't-first-shadow',
    [
      N('Oh no. Your Nubbin has gone grey.', 'sad'),
      N('When you reach out, it flinches away from your hand.'),
      N('So you put your hand down, slowly, on the grass.'),
      FERN('Oh, love. It was thrown, or it went hungry. That made it scared.', 'sad'),
      FERN('The grey will stay. But scared can get better. Slowly.'),
      FERN('Be gentle every single day. I’ll sit with you, if you like.', 'soft'),
    ],
    [
      {
        id: lid('t-first-shadow', 1),
        domain: 'sel',
        skill: 'saying sorry, then showing it',
        standard: 'CASEL: Relationship skills',
        kind: 'do',
        after: 3,
        check: 'edu:say:sorry:nubbin',
        lines: [
          FERN('Saying sorry is a good start. Say it softly, so it isn’t scared.', 'soft'),
          N('(Say sorry to the Nubbin, in a soft, gentle voice.)'),
          FERN('Good. Now we show it, with gentle hands, every day.'),
        ],
        parentNote:
          'Your child practised saying sorry kindly, and heard that sorry is shown by what we do next.',
      },
    ],
  ),
  scene(
    't-ran-away',
    [
      N('The long grass is flat. Something small pushed through it.'),
      N('The gate is swinging. Your Nubbin has gone.', 'sad'),
      FERN('It ran away. They do that when they aren’t happy here.', 'sad'),
      FERN('Sometimes they come back, to the edge. To see if things are better.'),
      FERN('I still look at the edge, some mornings.', 'soft'),
    ],
    [
      {
        id: lid('t-ran-away', 1),
        domain: 'sel',
        skill: 'naming a feeling and what helps',
        standard: 'CASEL: Self-awareness',
        kind: 'do',
        after: 4,
        check: 'edu:show:feeling:face',
        lines: [
          N('(How do you feel? Show it with your face.)'),
          FERN('Sad is all right to feel. I feel sad too.', 'soft'),
          N('(What could help? A hug, a sit-down, or telling someone.)'),
          FERN('Let’s sit down together for a bit.', 'soft'),
        ],
        parentNote:
          'Your child showed a feeling with their face and talked about things that help when we feel sad.',
      },
    ],
  ),
  scene(
    't-stray-returned',
    [
      N('Look! Something grey sits at the edge of the long grass.'),
      N('It is watching you. You want to run to it!'),
      N('But remember Gran’s rule three: sit down and wait.'),
      N('You put a plum down. Plop! Then a second, just in case.'),
      N('Then you sit a little way off.'),
      N('It looks at the plums. Then at you. It stays.', 'soft'),
    ],
    [
      {
        id: lid('t-stray-returned', 1),
        domain: 'maths',
        skill: 'position words: beside, on top',
        standard: 'K.G.A.1',
        kind: 'ask',
        after: 2,
        prompt: [N('Where should the fruit go?')],
        options: [
          {
            label: 'Beside the Nubbin, in the grass',
            best: true,
            reply: [N('Yes! Beside it. Close enough to reach, but not too close.')],
          },
          {
            label: 'On top of its head',
            reply: [N('Ha! On its head would give it a fright.'), N('Beside it is best.')],
          },
        ],
        parentNote:
          'Your child used position words (beside, on top) to choose where to put the fruit.',
      },
    ],
  ),
  scene(
    't-sable-bonded',
    [
      N('Plop! Sable climbs into your lap. All the way in!', 'happy'),
      N('She turns round, once, twice, and lies down.'),
      N('She lets out a big breath. Haaah. She feels safe.', 'soft'),
      LUNA('There. Grey and loved. Both at once.', 'soft'),
      N('You sit very still with her. You don’t need to go anywhere.'),
    ],
    [
      {
        id: lid('t-sable-bonded', 1),
        domain: 'literacy',
        skill: 'the first sound of a name (S for Sable)',
        standard: 'RF.K.2',
        kind: 'ask',
        after: 3,
        prompt: [
          LUNA('Sable starts with sss, like a snake. The letter S.'),
          LUNA('What else starts with sss?'),
        ],
        options: [
          {
            label: 'Sun',
            best: true,
            reply: [LUNA('Sss-sun! Sable, sun, and sitting still.', 'happy')],
          },
          {
            label: 'Moon',
            reply: [
              LUNA('Sable on the moon? What a big jump!'),
              LUNA('Moon starts with mmm. Listen: sss-Sable, sss-sun.'),
              LUNA('Sun starts like Sable!', 'happy'),
            ],
          },
          {
            label: 'Tree',
            reply: [
              LUNA('Sable up a tree? She’d never come down!'),
              LUNA('Tree starts with t-t-t. Listen: sss-Sable, sss-sun.'),
              LUNA('Sun starts like Sable!', 'happy'),
            ],
          },
        ],
        parentNote:
          'Your child heard the “sss” sound at the start of Sable and found another word that starts with S.',
      },
    ],
  ),
  scene(
    't-moss-first-pet',
    [
      N('You pat Moss’s head. He is soft, like moss on a wall.'),
      MOSS('Careful. I am very old. I bruise like fruit.'),
      N('You start to take your hand away.'),
      MOSS('…No. Don’t stop.', 'soft'),
      MOSS('She did this every evening for forty years. I missed it.', 'soft'),
    ],
    [
      {
        id: lid('t-moss-first-pet', 1),
        domain: 'sel',
        skill: 'gentle touch for someone small or old',
        standard: 'CASEL: Social awareness',
        kind: 'do',
        after: 1,
        check: 'edu:pet:gentle:moss',
        lines: [
          N('(Show gentle hands. Stroke your own arm, slowly and softly.)'),
          MOSS('Mm. Like that. Gentle.', 'soft'),
        ],
        parentNote:
          'Your child practised gentle, slow touch, the way we care for someone small or old.',
      },
    ],
  ),
  scene(
    't-moss-first-pet-early',
    [
      N('The old grey one on the hill doesn’t move away.'),
      N('You put your hand on his head. He is dry and soft.'),
      N('Then, very slowly, he leans into your hand.'),
      N('Like a plant leaning towards a sunny window.'),
      N('Pop! A tuft of grass grows on his head. You don’t mention it.'),
      N('At the bottom of the hill, you look back. He is watching you go.'),
    ],
    [
      {
        id: lid('t-moss-first-pet-early', 1),
        domain: 'science',
        skill: 'plants need light and grow towards it',
        standard: '2-LS2-1',
        kind: 'notice',
        after: 3,
        lines: [
          N('Plants really do lean towards the light. They need light to grow.'),
          N('(Is there a plant on a windowsill near you? Which way does it lean?)'),
        ],
        parentNote:
          'Your child learned that plants need light and grow towards it, and looked for a plant that does.',
      },
    ],
  ),
  scene(
    't-talk-generic',
    [
      N('You stop to say hello to a Keeper friend.'),
      N('First, you talk about the weather.'),
      N('Then a funny chat: whose Nubbin ate whose hat? Hee hee!'),
      N('That was nice. A little chat helps.', 'happy'),
    ],
    [
      {
        id: lid('t-talk-generic', 1),
        domain: 'science',
        skill: 'noticing today’s weather',
        standard: 'K-ESS2-1',
        kind: 'do',
        after: 1,
        check: 'edu:look:weather:window',
        lines: [
          N('(Look out of a window. What is the weather like today?)'),
          N('(Sunny? Rainy? Cloudy? Windy? Tell your Keeper friend.)'),
        ],
        parentNote: 'Your child looked outside and described today’s weather.',
      },
    ],
  ),
];

// ---------------------------------------------------------------- exports

export const EDU_CAMPAIGN_1_SPROUT: EduCampaign = {
  id: 'sprout:book1',
  band: 'sprout',
  chapters: {
    1: {
      title: 'The Letter',
      goalText: 'Find an egg in the long grass. Help it hatch. Then pet your new Nubbin!',
      goalIcon: '🥚',
      goalSay: 'Find an egg. Give it a gentle shake. Then pet your Nubbin!',
      hint: 'The eggs are in the long grass. Give one a gentle shake. Tap your Nubbin, then tap Pet.',
    },
    2: {
      title: 'Shells and Promises',
      goalText: 'Pick fruit from the trees. Feed your Nubbin from your hand. Do it two times!',
      goalIcon: '🍎',
      goalSay: 'Shake a tree. Pick a fruit. Feed your Nubbin. Two times!',
      hint: 'Tap a tree to shake it. Tap a fruit to pick it up. Tap your Nubbin, then tap Feed.',
    },
    3: {
      title: 'The One Who Hides',
      goalText: 'Help Sable trust you a little bit.',
      goalIcon: '🤲',
      goalSay: 'Sable is scared. Put fruit near her. Sit still and wait.',
      hint: 'Sable is scared. Put fruit near her. Sit and wait. Pet her when she lets you. Never throw her.',
    },
    4: {
      title: 'Moss Remembers',
      goalText: 'Pet Moss on the hill. Then light all four lanterns.',
      goalIcon: '🏮',
      goalSay: 'Pet Moss on the hill. Then light the four lanterns.',
      hint: 'Moss sits on the hill. Tap a lantern post to light it. The fourth one only flickers. That’s fine!',
    },
  },
  scenes: [...CH1, ...CH2, ...CH3, ...CH4, ...TRIGGERED],
  notes:
    'Sprout (ages 3–6, read aloud). c2-corvin leaves out “sell” (defaultChoice refuse); c3-open leaves out “grab” (defaultChoice slow). Hazel’s letter says she has gone to help lost Nubbins; “up the hill” is left out. The Lantern Song is sung as written, verse one plus the refrain as a join-in beat (Luna sings the first line, speaker chorus the rest, as in the main scene); the third verse is left out so sleep is never paired with death. In c4-tale ask-loved, Moss planted his first love’s flower beside Briar’s, the first on the hill. The Tale of the Four is told as a gentle picture-book tale with fading named plainly as dying, then comforted. Lessons by chapter: ch1 literacy, sel, science, maths; ch2 health, sel, literacy; ch3 science, sel, science, maths; ch4 literacy, literacy, music, science, maths, sel, literacy, science.',
};

export const CHECKS: string[] = [
  'edu:say:first-sound:name',
  'edu:say:rules:3',
  'edu:wait:count:5',
  'edu:count:plum-stones:6',
  'edu:sing:refrain:lantern-song',
  'edu:count:wardens:4',
  'edu:order:tale:3',
  'edu:say:sorry:nubbin',
  'edu:show:feeling:face',
  'edu:pet:gentle:moss',
  'edu:look:weather:window',
];
