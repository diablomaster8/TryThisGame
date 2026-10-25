/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Atlas page A24, The Law of
 * the Jungle (Kipling’s Jungle Books, central India, with “The White Seal” as the coda).
 *
 * Source: atlas-a24.ts (ATLAS_A24 and ATLAS_A24_VARIANTS). One EduScene per original scene, id
 * `sprout:<original id>`, with the same choice ids and `set` flags (`a24-stones` in a24-10-road).
 * Every step scene, done scene, complete scene and variant has a version, and each has exactly one
 * lesson. Domains never repeat back to back, across scenes and quests, and each variant has the
 * same domain as the scene it replaces (the margin note is a feelings lesson).
 *
 * What it teaches (outline: geography, animals, the monsoon, fur seals, Steller’s sea cow): that
 * India is a big country with hills and jungle; wolves, bears, tigers, snakes, monkeys, elephants
 * and seals, what they need and how they live; rain and dry times; the cold northern sea; counting
 * to 5 and a little beyond, taking away, halves, patterns; first sounds, rhymes and clapping
 * syllables; asking first, sharing, saying sorry, telling someone, calming breaths, and grief.
 *
 * Left out or softened for this age (EDU-STYLE.md, “Hard things”):
 * - No lines from Kipling or any film. The Master Words become a plain “family” line. The intro
 *   card says Kipling loved India and believed some unfair things, and that we can think for
 *   ourselves.
 * - Shere Khan’s end: the herd rushes through, there is dust, and afterwards Akela says plainly
 *   that Shere Khan died and will not come back. The hide is “his striped coat”.
 * - Akela’s death is said plainly (“his body stopped working and won’t start again”), with the
 *   comfort straight after: the howl, the remembering, the people who stay.
 * - The stones: frightened villagers shout, and a pebble bumps along the road. Both stones
 *   choices are kind, and both are kept with their `set` flags, so no `defaultChoice` is needed.
 * - The Cold Lairs and the Red Dog fight: no wounds; the red dogs are swept away by the river.
 * - The White Seal: men take some young seals away, for their fur; Kotick is sad and cross
 *   and turns away. The Unangax̂ are named as the people of the islands and are never villains.
 * - Steller’s sea cow is said plainly: real sea cows were hunted, and they are all gone for ever,
 *   then the comfort: we can look after the animals that are still here.
 * - Facts used: India is a big country; Seoni is in its middle; wolves live in dens and packs;
 *   black panthers are leopards with dark fur; snakes shed their skin as they grow and feel the
 *   ground; bees make honey and help flowers become fruit; elephants are the biggest land
 *   animals; tigers hide in tall grass; fur seals live in cold northern seas; babies sleep a lot.
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
const MG = say('a24-mowgli');
const MW = say('a24-mother-wolf');
const FW = say('a24-father-wolf');
const TB = say('a24-tabaqui');
const SK = say('a24-shere-khan');
const AK = say('a24-akela');
const BL = say('a24-baloo');
const BG = say('a24-bagheera');
const KA = say('a24-kaa');
const CH = say('a24-chil');
const BD = say('a24-bandar');
const ME = say('a24-messua');
const BU = say('a24-buldeo');
const VI = say('a24-villager');
const GB = say('a24-grey-brother');
const YW = say('a24-young-wolf');
const HA = say('a24-hathi');
const KO = say('a24-kotick');
const MK = say('a24-matkah');
const SC = say('a24-sea-catch');
const SL = say('a24-sea-lion');
const SV = say('a24-sea-vitch');
const SE = say('a24-seal');
const FE = say('fern');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const words = (t: string) => t.trim().split(/\s+/).length;
const parts = (t: string) => t.split(/(?<=[.!?”)])\s+(?=[A-Z“(‘])/);

/**
 * Keeps every line to 14 words or fewer, as the sprout band requires: a long line is cut at
 * sentence ends into several lines by the same speaker (the mood stays on the first). `map[i]`
 * is the index of the last piece of original line i, so a lesson’s `after` can follow.
 */
const split = (lines: Line[]): { lines: Line[]; map: number[] } => {
  const out: Line[] = [];
  const map: number[] = [];
  for (const l of lines) {
    const chunks: string[] = [];
    const counts: number[] = [];
    for (const sentence of parts(l.text)) {
      const last = chunks[chunks.length - 1];
      const n = counts[counts.length - 1] ?? 0;
      if (last !== undefined && n < 2 && words(last) + words(sentence) <= 14) {
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

/** A notice lesson: a character shares something true in their own voice. */
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

/** A choice, kept under its original id. */
const ch = (
  id: string,
  label: string,
  then: Line[],
  set?: Record<string, number | boolean | string>,
): Choice => ({ id, label, ...(set ? { set } : {}), then: sp(then) });

/** One sprout scene. Lesson ids are `sprout:<of>-l<n>`, numbered in play order. */
const sc = (of: string, lines: Line[], beats: Beat[], choices?: Choice[]): EduScene => {
  const cut = split(lines);
  return {
    id: `sprout:${of}`,
    of,
    band: 'sprout',
    lines: cut.lines,
    ...(choices ? { choices } : {}),
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

// ================================================================== A24-1 The Cave
const A1: EduQuest = quest(
  'a24-01',
  'The Cave',
  {
    'a24-01-s1': {
      goal: 'Step into the hills and find the wolves’ cave.',
      hint: 'Touch the page where the cave is. Then climb up.',
    },
    'a24-01-s2': {
      goal: 'Sit quietly in the cave.',
      hint: 'Sit by the wall. Watch the door.',
    },
    'a24-01-s3': {
      goal: 'Stand behind Mother Wolf.',
      hint: 'Stay close to Mother Wolf. She is brave.',
    },
  },
  [
    sc(
      'a24-01-page',
      [
        N('Nova’s big book opens. Warm hills! A blue evening sky!'),
        N('A card is tucked inside. Nova wrote it small.'),
        N('“A man named Kipling wrote this story long ago. He loved India.”'),
        N('“He also believed some things that were not fair. We can think for ourselves.”'),
        N('You step into the page. Dry grass crunches under your boots.'),
        N('There is a cave in the hills. A big flat rock sits above it.'),
        FW('Who is at the door? A guest! A very small one.', 'happy'),
        MW('Come in, if you come politely. Mind the cubs’ tails.'),
      ],
      [
        ask(
          5,
          'social-studies',
          'India is a big country; a map shows where places are',
          'D2.Geo.2.K-2',
          [
            N(
              'India is a big country. The wolves live in its hills. (Point to the hills in the picture.) What is India?',
            ),
          ],
          [
            o(
              'A country.',
              [N('Yes! India is a big country with hills, jungle and cities.')],
              true,
            ),
            o('A tiny pond.', [N('No, it is much bigger! India is a whole country.')]),
          ],
          'Learned that India is a big country, and that the story is set in its hills.',
        ),
      ],
      [
        ch('bow', 'Bow and wait to be asked.', [MW('Good manners! Come in.', 'happy')]),
        ch('nubbin', 'Let your Nubbin go in first.', [
          N('Your Nubbin trots in. The cubs sniff it all over.'),
        ]),
        ch('sit', 'Sit down outside.', [FW('You sit so politely. Come in out of the dew.')]),
      ],
    ),
    sc(
      'a24-01-page-done',
      [
        N('The cave smells of warm fur. It is cosy inside.'),
        N('Mother Wolf’s eyes shine like two little lamps.'),
        MW('This is our den. It is our home. You can sit by the wall.'),
      ],
      [
        ask(
          2,
          'science',
          'animals live in homes that meet their needs',
          'K-ESS3-1',
          [
            N(
              'A wolf’s home is called a den. It keeps the cubs warm and safe. Where do wolves sleep?',
            ),
          ],
          [
            o('In a den.', [N('Yes! A den is a cosy home for wolves.')], true),
            o('In a boat.', [N('Not a boat! Wolves sleep in a den.')]),
          ],
          'Learned that wolves live in dens, which keep their young warm and safe.',
        ),
      ],
    ),
    sc(
      'a24-01-cub',
      [
        N('A thin jackal slides in. His name is Tabaqui.'),
        TB('What a lovely cave! What lovely cubs! Have you a bone for me?', 'happy'),
        FW('There is a bone by the wall. Take it and go.'),
        N('Tabaqui crunches the bone and slinks away.'),
        N('A roar rumbles in the valley. It is Shere Khan, the tiger!'),
        N('Then something rustles. A tiny brown baby toddles in.'),
        N('He is not scared. He snuggles in with the cubs to get warm.'),
      ],
      [
        ask(
          1,
          'literacy',
          'first sounds: T for Tabaqui',
          'RF.K.2',
          [
            N(
              'Tabaqui begins with a sound: t, t, t. Which word begins like Tabaqui: tiger or wolf?',
            ),
          ],
          [
            o('Tiger.', [N('Yes! Tabaqui, tiger: t, t, t!')], true),
            o('Wolf.', [N('Wolf begins with w. Tabaqui and tiger both begin with t!')]),
          ],
          'Practised hearing the first sound t in Tabaqui and tiger.',
        ),
      ],
      [
        ch('room', 'Make room for the baby.', [
          N('Your Nubbin scoots over. The baby leans on it like a cushion.'),
        ]),
        ch('still', 'Keep very still.', [N('You are so still. Mother Wolf smiles at you.')]),
      ],
    ),
    sc(
      'a24-01-cub-done',
      [
        MW('A baby with no fur at all! And he is not scared.', 'soft'),
        N('Four wolf cubs sleep in a heap. The baby sleeps beside them.'),
        N('(Count the cubs on your fingers: one, two, three, four.)'),
      ],
      [
        ask(
          2,
          'maths',
          'add one more: 4 cubs and 1 baby make 5',
          'K.OA.A.1',
          [N('Four cubs are asleep. One baby boy snuggles in too. How many sleepers is that?')],
          [
            o('5.', [N('Yes! Four and one more makes five.')], true),
            o('3.', [N('Count again: four cubs, and one more baby. That makes five!')]),
          ],
          'Added one to four to find five sleepers.',
        ),
      ],
    ),
    sc(
      'a24-01-door',
      [
        N('The moonlight goes dark. A big striped head fills the door.'),
        N('It is Shere Khan, the tiger! He cannot fit inside.'),
        SK('Give me the baby!', 'angry'),
        MW('No. The baby is mine. He is safe here.', 'angry'),
        MW('Go away, Shere Khan. Go!'),
        N('Shere Khan backs out, grumbling.'),
        MW('I will call you Mowgli the Frog, little one. Sleep now.', 'soft'),
      ],
      [
        ask(
          6,
          'sel',
          'being scared and brave together; what helps when we feel scared',
          'ELOF: Social and Emotional Development',
          [N('Mother Wolf felt scared, and she was brave. What can you do when you feel scared?')],
          [
            o(
              'Take a slow breath and ask for help.',
              [N('Yes! Breathe in, breathe out, and tell someone.')],
              true,
            ),
            o('Hide and never tell anyone.', [
              N('Hiding can feel safe. But telling someone helps most.'),
            ]),
          ],
          'Talked about feeling scared and being brave, and that slow breaths and asking for help can help.',
        ),
      ],
      [
        ch('brave', 'Say she was brave.', [MW('I was just a mother. It looks the same!', 'happy')]),
        ch('quiet', 'Breathe out slowly.', [N('You breathe out. So does Father Wolf. Whoosh!')]),
      ],
    ),
    sc(
      'a24-01-door-done',
      [
        FW('We must show the baby to the pack.', 'think'),
        MW('We will show him at the full moon.'),
        N('A pale moon hangs above the cave. It is nearly round.'),
      ],
      [
        ask(
          2,
          'science',
          'we see the Moon at night',
          '1-ESS1-1',
          [N('(Point to the moon.) When do we see the moon in the sky?')],
          [
            o('At night.', [N('Yes! The moon shines in the night sky.')], true),
            o('At lunchtime.', [
              N('Sometimes we see it in the day too. But it shines brightest at night.'),
            ]),
          ],
          'Learned that the Moon is seen in the night sky.',
        ),
      ],
    ),
    sc(
      'a24-01-complete',
      [
        N('Night comes. Mother Wolf licks the baby clean.'),
        N('Then the cubs. Then your Nubbin! It falls over, surprised.'),
        N('Your Nubbin curls up with the cubs and sleeps.'),
        MW('A pack is a family. You are in ours now.', 'happy'),
        N('You lie by the wall and hear everyone breathe. Soft and slow.'),
      ],
      [
        ask(
          3,
          'sel',
          'a family is people who love and look after each other',
          'ELOF: Social and Emotional Development',
          [N('Mother Wolf says a family looks after each other. What makes a family?')],
          [
            o(
              'People who love and look after you.',
              [N('Yes! Families come in all shapes. Love makes them.')],
              true,
            ),
            o('People who look the same.', [
              N('Not quite. Families can look very different. Love makes them.'),
            ]),
          ],
          'Heard that a family is made by people loving and looking after one another.',
        ),
      ],
    ),
  ],
);

// ================================================================== A24-2 The Council Rock
const A2: EduQuest = quest(
  'a24-02',
  'The Council Rock',
  {
    'a24-02-s1': {
      goal: 'Go up to the Council Rock with the wolves.',
      hint: 'Walk behind Mother Wolf. Sit at the edge.',
    },
    'a24-02-s2': {
      goal: 'Watch the wolves decide about the baby.',
      hint: 'Stay quiet. Only the wolves talk.',
    },
  },
  [
    sc(
      'a24-02-climb',
      [
        N('At the full moon, the wolves climb up to the Council Rock.'),
        N('Mowgli toddles beside Mother Wolf. The cubs tumble round him.'),
        N('A great grey wolf lies on the flat rock. It is Akela.'),
        FW('Akela is strong, and clever, and fair.'),
        N('Your Nubbin looks at the moon. It howls! Awooo!'),
        YW('What was that?', 'shock'),
        MW('A guest. Do not stare. It is rude.', 'happy'),
      ],
      [
        doit(
          4,
          'science',
          'sounds are made when things wiggle (vibrate)',
          '1-PS4-1',
          'edu:feel:throat:hum',
          [N('Put a hand on your throat. Hum like a wolf. Mmmmm. What do you feel? A buzz!')],
          'Felt the buzz of a hum on the throat, learning that sounds are made by vibrations.',
        ),
      ],
      [
        ch('hush', 'Hush your Nubbin gently.', [N('It hushes. Then it practises quietly.')]),
        ch('proud', 'Tell it that was a fine howl.', [
          N('It sits up very tall and looks at the moon.'),
        ]),
      ],
    ),
    sc(
      'a24-02-climb-done',
      [
        N('You sit at the edge, among the rocks.'),
        N('Mowgli sits in the moonlight and plays with pebbles.'),
        MG('Three white pebbles. Two grey pebbles. Look!', 'happy'),
      ],
      [
        ask(
          2,
          'maths',
          'add small groups: 3 + 2 = 5',
          'K.OA.A.2',
          [MG('How many pebbles do I have? (Count them on your fingers.)')],
          [
            o('5.', [N('Yes! Three and two makes five.')], true),
            o('2.', [N('Count them all: one, two, three, four, five. Five pebbles!')]),
          ],
          'Added 3 and 2 within 10 to find 5.',
        ),
      ],
    ),
    sc(
      'a24-02-council',
      [
        AK('Look closely, wolves. Look closely at the baby.'),
        N('A roar comes from behind the rocks. Shere Khan is here.'),
        SK('Give me the man’s cub!', 'angry'),
        AK('Who speaks for the baby?'),
        N('A big brown bear stands up. It is Baloo.'),
        BL('I will speak for him. I will teach him myself.', 'think'),
        N('A black panther drops down. It is Bagheera.'),
        BG('I speak for him too. I will give a gift to the pack.'),
        N('The wolves look at the baby. They decide he can stay.'),
      ],
      [
        ask(
          8,
          'social-studies',
          'friends can speak up for someone; fair rules',
          'D2.Civ.8.K-2',
          [
            N(
              'Baloo and Bagheera speak up for Mowgli. Why is it good to have friends who speak up for you?',
            ),
          ],
          [
            o(
              'They help when you cannot speak for yourself.',
              [N('Yes! Good friends help each other.')],
              true,
            ),
            o('They make you do chores.', [N('No. Good friends help and care.')]),
          ],
          'Talked about friends speaking up for someone, and why fair groups listen to more than one voice.',
        ),
      ],
      [
        ch('edge', 'Stay still and quiet.', [N('You are so quiet. Your Nubbin forgets to blink.')]),
        ch('hand', 'Put a hand on your Nubbin.', [
          N('Your Nubbin leans on you. Mother Wolf nods.'),
        ]),
      ],
    ),
    sc(
      'a24-02-council-done',
      [
        N('The wolves come, one by one, to look at Mowgli.'),
        AK('He is the pack’s now. Take him home.'),
        N('Baloo, Bagheera, Bear. B, B, B!'),
      ],
      [
        ask(
          2,
          'literacy',
          'first sounds: B for Baloo, Bagheera and bear',
          'RF.K.2',
          [
            N(
              'Baloo, Bagheera, bear. They all begin with b, b, b. Which begins with b: ball or sun?',
            ),
          ],
          [
            o('Ball.', [N('Yes! Ball, bear, Baloo: b, b, b!')], true),
            o('Sun.', [N('Sun begins with s. Ball begins with b, like Baloo!')]),
          ],
          'Heard the first sound b in Baloo, Bagheera, bear and ball.',
        ),
      ],
    ),
    sc(
      'a24-02-complete',
      [
        N('Shere Khan roars. Nobody answers him.'),
        BG('Shout all you like. The baby will grow.'),
        N('Bagheera looks at you with long yellow eyes.'),
        BG('You were still and quiet. That is kind.'),
        BL('Lessons start soon. You too. And that!', 'happy'),
        N('“That” is your Nubbin, trying to howl again, very small.'),
      ],
      [
        ask(
          3,
          'sel',
          'listening with a quiet body and a quiet voice',
          'CASEL: Self-management',
          [N('Bagheera liked how you listened. How do we listen to a friend?')],
          [
            o('Look at them, stay quiet and wait.', [N('Yes! That is good listening.')], true),
            o('Talk at the same time.', [N('Then we cannot hear! Quiet is how we listen.')]),
          ],
          'Practised what good listening looks like: looking, staying quiet and waiting.',
        ),
      ],
    ),
  ],
);

// ================================================================== A24-3 Baloo's Lessons
const A3: EduQuest = quest(
  'a24-03',
  'Baloo’s Lessons',
  {
    'a24-03-s1': {
      goal: 'Join Mowgli at Baloo’s lessons.',
      hint: 'The glade is by the fallen tree. Bring your Nubbin.',
    },
    'a24-03-s2': {
      goal: 'Learn the Master Words from Baloo.',
      hint: 'Say them slowly, in the right voice.',
    },
    'a24-03-s3': {
      goal: 'Practise the calls with Baloo.',
      hint: 'Growl for hunters. Whistle for birds. Hiss for snakes.',
    },
  },
  [
    sc(
      'a24-03-glade',
      [
        N('Time passes. Mowgli is seven now. He is quick and brown.'),
        N('Baloo sits on a fallen tree with his eyes half shut.'),
        BL('Sit down, all three of you. The Law is old, and long.'),
        MG('I am bored. You have taught me for ever!', 'angry'),
        BL('I am a sloth bear. I love ants, fruit and honey!', 'happy'),
        BL('Be polite to the bees. Say sorry to a bat you wake.'),
        N('Your Nubbin looks at Baloo, the bees and the bat. Its eyes cross!'),
      ],
      [
        ask(
          4,
          'science',
          'a sloth bear eats ants, fruit and honey',
          'K-LS1-1',
          [BL('I am a sloth bear. What do I like to eat: ants and honey, or pizza?')],
          [
            o(
              'Ants and honey.',
              [BL('Yes! Sloth bears dig for ants and love honey.', 'happy')],
              true,
            ),
            o('Pizza.', [BL('Ha! No pizza in the jungle. Ants and honey for me!')]),
          ],
          'Learned that a sloth bear digs for ants and loves honey and fruit.',
        ),
      ],
      [
        ch('listen', 'Listen hard and say each one back.', [
          BL('A guest who listens. Good!', 'happy'),
        ]),
        ch('mowgli', 'Whisper to Mowgli that you are bored too.', [
          BL('I heard that. Bears hear everything.'),
        ]),
      ],
    ),
    sc(
      'a24-03-glade-done',
      [
        BL('First, the Strangers’ Call. You give it before you hunt on someone’s land.'),
        BL('It means: may I, please?'),
        MG('Why ask? I am hungry!'),
        N('Your Nubbin tiptoes politely across the glade.'),
      ],
      [
        ask(
          1,
          'social-studies',
          'asking first shows respect',
          'D2.Civ.8.K-2',
          [N('Baloo says: ask first. What do you do before you go into a friend’s house?')],
          [
            o('Ask first.', [N('Yes! Asking first is polite.')], true),
            o('Run in without a word.', [N('We ask first. It shows we care.')]),
          ],
          'Understood that asking before using someone else’s space shows respect.',
        ),
      ],
    ),
    sc(
      'a24-03-words',
      [
        BL('Now the Master Words. They matter most of all.'),
        BL('Say them for the hunters. Say them for the birds. Say them for the snakes.'),
        N('Mowgli gabbles them. Baloo gives a gentle cuff.'),
        MG('Ow! You always hit me! I hate you!', 'angry'),
        BG('He wants you safe, little brother.', 'soft'),
        BL('You and I are family, all of us, under the same sky.'),
        N('That is the Master Word. Say it with a growl, a whistle, a hiss.'),
      ],
      [
        doit(
          1,
          'literacy',
          'clapping the syllables of a name',
          'RF.K.2',
          'edu:clap:syllables:baloo',
          [N('Clap the parts of the bear’s name. Ba-loo. How many claps? Two!')],
          'Clapped the two syllables of Baloo.',
        ),
      ],
      [
        ch('repeat', 'Say the words slowly.', [
          N('You say them in a deep voice. Baloo closes his eyes. That is praise.'),
        ]),
        ch('why', 'Ask Baloo why the words work.', [
          BL('Because everyone keeps them. That is what a law is.', 'think'),
        ]),
        ch('sit', 'Sit beside Mowgli.', [N('You sit and say nothing. Soon Mowgli stops sulking.')]),
      ],
    ),
    sc(
      'a24-03-words-done',
      [
        N('Your Nubbin puffs up. It gives a small hiss.'),
        BL('That is not wrong! The snakes might like that.', 'shock'),
        MG('Baloo hit me. Then he praised Nubbin. It is not fair.', 'sad'),
      ],
      [
        ask(
          2,
          'sel',
          'saying “I feel cross” in words',
          'ELOF: Social and Emotional Development',
          [N('Mowgli is cross. What could he say to Baloo with words?')],
          [
            o('“I feel cross. That hurt.”', [N('Yes! Telling someone how we feel helps.')], true),
            o('“I hate you!”', [N('That can hurt. “I feel cross” is kinder and clearer.')]),
          ],
          'Practised using words to say “I feel cross” instead of shouting something hurtful.',
        ),
      ],
    ),
    sc(
      'a24-03-calls',
      [
        BL('Now we practise. I am the jungle!'),
        N('Baloo hides behind a bush. He is a bad bird, a bad snake, a bear.'),
        MG('He is the worst bird in the world!', 'happy'),
        N('Your Nubbin hisses at the bear and growls at the bird.'),
        BL('Growl. Whistle. Hiss. Growl. Whistle. Hiss.'),
      ],
      [
        ask(
          4,
          'maths',
          'patterns: growl, whistle, hiss, growl, whistle, ...',
          'ELOF: Mathematics Development',
          [BL('Growl, whistle, hiss, growl, whistle... what comes next?')],
          [
            o('Hiss.', [BL('Yes! The pattern goes round and round.', 'happy')], true),
            o('Growl.', [BL('Listen again: growl, whistle, hiss. Next is hiss.')]),
          ],
          'Found the next item in a repeating pattern.',
        ),
      ],
    ),
    sc(
      'a24-03-calls-done',
      [
        BL('Enough. The cub knows it. The guest is learning.', 'think'),
        N('Your Nubbin hisses at a stick insect. The insect does not move.'),
        BL('A snake has no ears you can see. It feels your feet on the ground.'),
      ],
      [
        ask(
          2,
          'science',
          'snakes feel the ground through their bodies',
          'ELOF: Scientific Reasoning',
          [N('Snakes have no ears you can see. How do they feel footsteps?')],
          [
            o('Through the ground.', [N('Yes! A snake feels the ground wiggle.')], true),
            o('Through its tail feathers.', [N('Snakes have no feathers! They feel the ground.')]),
          ],
          'Learned that snakes feel footsteps through the ground.',
        ),
      ],
    ),
    sc(
      'a24-03-complete',
      [
        N('Baloo lies back with a happy grunt.'),
        BL('The Law is like a creeper on a tree. It holds things up.'),
        N('A creeper is a plant that climbs a tree.'),
        MG('Can I go now?'),
        BL('Go. But stay away from the Monkey-People!', 'think'),
        N('Mowgli looks away fast.'),
      ],
      [
        ask(
          2,
          'literacy',
          'a new word: creeper (a climbing plant)',
          'ELOF: Language and Communication',
          [N('A creeper is a plant that climbs up a tree. What does a creeper do?')],
          [
            o('Climbs.', [N('Yes! A creeper climbs and holds on.')], true),
            o('Swims.', [N('No. A creeper climbs up trees.')]),
          ],
          'Learned that a creeper is a plant that climbs.',
        ),
      ],
    ),
  ],
);

// ================================================================== A24-4 The Monkey-People
const A4: EduQuest = quest(
  'a24-04',
  'The Monkey-People',
  {
    'a24-04-s1': {
      goal: 'Look for Mowgli under the trees.',
      hint: 'Follow the chattering. Monkeys are never quiet.',
    },
    'a24-04-s2': {
      goal: 'Watch for Chil the kite.',
      hint: 'Look up! Chil circles in the sky.',
    },
    'a24-04-s3': {
      goal: 'Go with Baloo and Bagheera to find Kaa.',
      hint: 'Kaa is on a warm ledge. Speak politely.',
    },
  },
  [
    sc(
      'a24-04-trees',
      [
        N('Mowgli rests on Bagheera’s back in the warm sun.'),
        MG('The monkeys are nice to me. They give me nuts!'),
        BL('The Monkey-People forget everything. Do not trust them.', 'angry'),
        N('Mowgli goes red. He stomps away to sulk under a tree.'),
        N('Above him, the leaves whisper. Many grey hands reach down!'),
        BD('Hoo hoo! Look how clever we are! Ooh, a nut!', 'happy'),
        N('The monkeys swing up into the trees with Mowgli.'),
        MG('Baloo! Bagheera!', 'shock'),
      ],
      [
        ask(
          6,
          'science',
          'monkeys live together in groups',
          'K-ESS3-1',
          [N('Monkeys live together in a big group. Do monkeys live alone, or together?')],
          [
            o('Together.', [N('Yes! A group of monkeys is called a troop.')], true),
            o('Alone.', [N('Not alone! Monkeys live together, in a troop.')]),
          ],
          'Learned that monkeys live together in groups called troops.',
        ),
      ],
      [
        ch('shout', 'Shout for Baloo and Bagheera.', [
          N('They run! Baloo runs like a rolling rock. Bagheera runs like a shadow.'),
        ]),
        ch('follow', 'Run underneath and keep watching.', [
          N('You run. Your Nubbin watches the treetops. Bonk! It walks into a tree.'),
        ]),
      ],
    ),
    sc(
      'a24-04-trees-done',
      [
        N('The monkeys swing along the treetops. They are high and fast.'),
        N('Below, nobody can keep up.'),
        N('Up in the sky, a kite is circling. It sees everything.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'a view from above is like a map',
          'D2.Geo.2.K-2',
          [
            N(
              'A kite flies high in the sky. Who can see more: a kite up high, or a mouse on the ground?',
            ),
          ],
          [
            o('The kite.', [N('Yes! From high up you see the whole place, like a map.')], true),
            o('The mouse.', [N('The mouse sees only a little. The kite sees much more.')]),
          ],
          'Learned that a view from high above shows the whole place, like a map.',
        ),
      ],
    ),
    sc(
      'a24-04-chil',
      [
        N('Mowgli whistles the bird word.'),
        N('High above, Chil the kite tips his wing and swoops down.'),
        CH('You are not a bird. But you know the word!'),
        MG('Watch where they take me! Tell Baloo and Bagheera!', 'shock'),
        N('Chil swings away, high up into the blue. He keeps watching.'),
        CH('They have taken him to the old city on the hill.'),
      ],
      [
        ask(
          1,
          'science',
          'birds have wings to fly',
          'K-LS1-1',
          [N('Chil has big wings. What does Chil use to fly?')],
          [
            o('His wings.', [N('Yes! Wings help birds fly high.')], true),
            o('His tummy.', [N('Wings are for flying! Chil flaps and glides.')]),
          ],
          'Learned that birds use their wings to fly.',
        ),
      ],
      [
        ch('thanks', 'Thank Chil with the bird whistle.', [
          CH('You whistle like a duck. But you whistle!', 'happy'),
        ]),
        ch('baloo', 'Turn to Baloo. What now?', [
          BL('Now I think. Bears think slowly, but all the way down.', 'think'),
        ]),
      ],
    ),
    sc(
      'a24-04-chil-done',
      [
        BG('The old city. They are not afraid of us there.', 'angry'),
        BL('They are afraid of one friend. Kaa the snake.'),
        N('(Count who is running to find Kaa: Baloo, Bagheera, you, Nubbin.)'),
      ],
      [
        doit(
          2,
          'maths',
          'count to 4',
          'K.CC.B.5',
          'edu:count:runners:4',
          [N('Count the runners on your fingers. Baloo, Bagheera, you, Nubbin. How many? Four!')],
          'Counted four runners.',
        ),
      ],
    ),
    sc(
      'a24-04-kaa',
      [
        N('Kaa lies on a warm ledge in the sun. He has a new skin!'),
        KA('Well, well. Visitors. What brings you here?', 'think'),
        BG('The monkeys have taken our man’s cub.'),
        KA('Have they.', 'angry'),
        N('Kaa goes very still. Every monkey in the jungle knows that stillness.'),
        KA('The monkeys have been very foolish.'),
      ],
      [
        ask(
          5,
          'literacy',
          'first sounds: K for Kaa and kite',
          'RF.K.2',
          [N('Kaa begins with a sound: k, k, k. Which begins like Kaa: kite or bear?')],
          [
            o('Kite.', [N('Yes! Kaa, kite: k, k, k!')], true),
            o('Bear.', [N('Bear begins with b. Kaa and kite begin with k!')]),
          ],
          'Heard the first sound k in Kaa and kite.',
        ),
      ],
      [
        ch('polite', 'Say his new skin looks lovely.', [
          KA('It does! Thank you. Nobody notices.', 'happy'),
        ]),
        ch('nubbin', 'Keep your Nubbin behind you.', [KA('Wise little guest.', 'think')]),
      ],
    ),
    sc(
      'a24-04-kaa-done',
      [
        KA('I will come by my own road. Do not wait.'),
        N('He slides off the ledge. The grass does not even move.'),
        N('On the warm stone lies Kaa’s old skin. It is long and papery.'),
      ],
      [
        ask(
          2,
          'science',
          'snakes shed their skin as they grow',
          'ELOF: Scientific Reasoning',
          [
            N(
              'Kaa left his old skin on the stone. Why? Because he grew bigger, or because he was bored?',
            ),
          ],
          [
            o('He grew bigger.', [N('Yes! Snakes grow, and slip out of the old skin.')], true),
            o('He was bored.', [N('Not bored! Snakes grow bigger, so they get a new skin.')]),
          ],
          'Learned that snakes shed their skin because they grow.',
        ),
      ],
    ),
    sc(
      'a24-04-complete',
      [
        N('You run all afternoon with Baloo and Bagheera.'),
        BL('I should have watched him better.', 'sad'),
        BG('You taught him the Words. He used them. That was you!'),
        N('Your Nubbin rides on Baloo’s back for the last mile.'),
        N('Baloo lets it. He is a gentle bear.'),
      ],
      [
        ask(
          2,
          'sel',
          'when something goes wrong it is not all your fault; kind words help',
          'ELOF: Social and Emotional Development',
          [
            N(
              'Baloo feels sorry. Bagheera says it was not all his fault. What helps when we feel bad?',
            ),
          ],
          [
            o('A kind word from a friend.', [N('Yes! Kind words help us feel better.')], true),
            o('Being told off again.', [N('That would make it worse. A kind word helps most.')]),
          ],
          'Talked about how kind words from a friend help when we feel sorry about something.',
        ),
      ],
    ),
  ],
);

// ================================================================== A24-5 The Cold Lairs
const A5: EduQuest = quest(
  'a24-05',
  'The Cold Lairs',
  {
    'a24-05-s1': {
      goal: 'Creep into the old city and find Mowgli.',
      hint: 'Keep to the shadows of the broken walls.',
    },
    'a24-05-s2': {
      goal: 'Watch while Bagheera and Baloo come in.',
      hint: 'Keep your Nubbin close.',
    },
    'a24-05-s3': {
      goal: 'Get your Nubbin out of the old city.',
      hint: 'Cover your Nubbin’s eyes. Follow Mowgli out.',
    },
  },
  [
    sc(
      'a24-05-cistern',
      [
        N('The Cold Lairs is a lost city on a hill. It is full of ruins.'),
        N('Kings built it long ago. Nobody remembers which kings.'),
        BD('We are great! We have a man’s cub! Ooh, a nut!', 'happy'),
        N('They drop Mowgli through the roof of a little house.'),
        N('Inside, cobras! They spread their wide hoods.'),
        MG('You and I are family, all of us, under the same sky.'),
        N('The cobras lower their hoods. Mowgli is safe.'),
      ],
      [
        ask(
          1,
          'social-studies',
          'old places tell us about long ago',
          'D2.His.2.K-2',
          [N('The ruined city is very, very old. Which is old: a ruined city, or a new toy?')],
          [
            o('The ruined city.', [N('Yes! Old places tell us about long ago.')], true),
            o('The new toy.', [N('A new toy is new! The ruined city is old.')]),
          ],
          'Learned that old buildings and ruins tell us about the past.',
        ),
      ],
      [
        ch('signal', 'Wave to Mowgli through the window.', [
          MG('You came! Is Baloo cross?', 'happy'),
        ]),
        ch('stay', 'Stay hidden and watch for Bagheera.', [
          N('A black shape moves along the wall. Slow, like a cloud.'),
        ]),
      ],
    ),
    sc(
      'a24-05-cistern-done',
      [
        MG('The snakes are fine. I said the Words.', 'think'),
        N('The cobras sway softly. A spread hood says: keep back.'),
        N('Outside, the moon hides behind a cloud.'),
      ],
      [
        ask(
          1,
          'health',
          'if you see a wild snake: stay calm, step back, tell a grown-up',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('If you ever see a wild snake, what should you do?')],
          [
            o(
              'Stand still, step back, tell a grown-up.',
              [N('Yes! Step back slowly and tell a grown-up.')],
              true,
            ),
            o('Pick it up.', [N('No! Never touch a wild snake. Tell a grown-up.')]),
          ],
          'Practised what to do if you see a wild snake: stay calm, step back and tell a grown-up.',
        ),
      ],
    ),
    sc(
      'a24-05-fight',
      [
        N('Bagheera runs up the terrace. Monkeys tumble like skittles!'),
        BG('Get to the water!', 'angry'),
        BL('I am coming! There are too many!', 'angry'),
        N('Then thump, thump, the wall shakes. Stones fall in.'),
        N('Through the gap comes Kaa!'),
        BD('Kaa! Run! Run!', 'shock'),
        N('The monkeys scatter. Four little ones run past you.'),
      ],
      [
        ask(
          6,
          'maths',
          'take away: 4 monkeys, 2 go up the wall, how many are left?',
          'K.OA.A.1',
          [N('Four monkeys run. Two go up the wall. The rest run to the trees. How many is that?')],
          [
            o('2.', [N('Yes! Four take away two leaves two.')], true),
            o('4.', [N('Two went up the wall. Four take away two leaves two.')]),
          ],
          'Subtracted 2 from 4 with a story.',
        ),
      ],
      [
        ch('cheer', 'Cheer quietly behind your hand.', [
          N('You cheer. Your Nubbin cheers with both hands over its eyes.'),
        ]),
        ch('help', 'Kick open the door for Mowgli.', [
          N('The door gives way. Mowgli climbs out, dusty and safe.'),
        ]),
      ],
    ),
    sc(
      'a24-05-fight-done',
      [
        N('Bagheera climbs out of the water, dripping. He shakes himself.'),
        N('Baloo sits down very suddenly.'),
        BL('I am not hurt. I am old. It is different.', 'think'),
      ],
      [
        ask(
          2,
          'sel',
          'saying what you need when you are tired',
          'CASEL: Self-awareness',
          [N('Baloo is tired, but he does not say so. What could Baloo say?')],
          [
            o('“I need a rest.”', [N('Yes! Saying it helps friends help us.')], true),
            o('Nothing at all.', [N('If we say nothing, nobody knows. Saying it helps.')]),
          ],
          'Practised saying “I need a rest” to tell people what you need.',
        ),
      ],
    ),
    sc(
      'a24-05-dance',
      [
        KA('Now stay, all of you. I will dance the Hunger Dance.'),
        N('Kaa has no legs. He slides in slow loops, round and round.'),
        N('The monkeys feel sleepy. They creep down from the walls.'),
        N('Baloo and Bagheera step forward too, with dreamy eyes.'),
        MG('Do not look! Come away!', 'shock'),
        N('Mowgli pulls them out. They shake themselves awake.'),
      ],
      [
        ask(
          1,
          'science',
          'snakes slide without legs',
          'K-LS1-1',
          [N('Kaa has no legs. How does Kaa move: does he slide, or does he skip?')],
          [
            o('He slides.', [N('Yes! A snake slides on its tummy.')], true),
            o('He skips.', [N('Snakes have no legs to skip! They slide.')]),
          ],
          'Learned that snakes slide along on their bodies because they have no legs.',
        ),
      ],
      [
        ch('eyes', 'Cover your Nubbin’s eyes and pick it up.', [
          N('You lift it with your hand over its eyes. It feels safe.'),
        ]),
        ch('turn', 'Turn your Nubbin to face you.', [
          N('It looks at your face. You walk out backwards.'),
        ]),
      ],
    ),
    sc(
      'a24-05-dance-done',
      [
        N('Outside the walls, the moon is clean and bright.'),
        N('Your Nubbin rubs its eyes. It feels shaky.'),
        N('Breathe in slowly, through your nose. Breathe out, through your mouth.'),
      ],
      [
        doit(
          2,
          'sel',
          'calming down with slow breaths',
          'ELOF: Social and Emotional Development',
          'edu:breathe:slow:3',
          [N('Take three slow breaths with Nubbin. In, out. In, out. In, out. Better!')],
          'Took three slow breaths to calm down after a scare.',
        ),
      ],
    ),
    sc(
      'a24-05-complete',
      [
        BG('You went with the monkeys. We had to come and get you.', 'think'),
        MG('I am sorry. I was wrong.', 'sad'),
        N('Bagheera gives him a long, stern look. Then it is finished.'),
        BG('Jump on my back. We are going home.', 'soft'),
        N('Kaa nods slowly from the moonlit wall.'),
        KA('Come and see me, guest. My coils are very warm.'),
      ],
      [
        ask(
          3,
          'social-studies',
          'saying sorry and making things right',
          'D2.Civ.8.K-2',
          [N('Mowgli said sorry. How can we make things right when we are sorry?')],
          [
            o(
              'Say sorry and help put it right.',
              [N('Yes! Sorry and helping puts things right.')],
              true,
            ),
            o('Walk away and say nothing.', [N('Saying sorry and helping is better.')]),
          ],
          'Talked about making things right: saying sorry and helping.',
        ),
      ],
    ),
  ],
);

// ================================================================== A24-6 The Red Flower
const A6: EduQuest = quest(
  'a24-06',
  'The Red Flower',
  {
    'a24-06-s1': {
      goal: 'Find Bagheera and Mowgli under the trees.',
      hint: 'Bagheera lies on a branch in the shade.',
    },
    'a24-06-s2': {
      goal: 'Go to the village with Mowgli at dawn.',
      hint: 'Wait in the ditch. Mowgli goes in alone.',
    },
    'a24-06-s3': {
      goal: 'Help Mowgli keep the fire alive.',
      hint: 'Bring dry twigs. Feed it a little at a time.',
    },
  },
  [
    sc(
      'a24-06-branch',
      [
        N('Years pass. Mowgli is ten now. He has never lived in a house.'),
        N('Akela is old. Shere Khan has made friends with the young wolves.'),
        N('Bagheera lies on a branch. His fur is black as ink.'),
        BG('Little brother, Shere Khan has not forgotten you.', 'think'),
        BG('Men keep a thing in their huts. The Red Flower. Fire.'),
        MG('They are my brothers. Why would they want me gone?', 'sad'),
      ],
      [
        ask(
          1,
          'science',
          'a black panther is a leopard with dark fur',
          '1-LS3-1',
          [N('Bagheera is a black panther: a leopard with dark fur. What colour is his fur?')],
          [
            o('Black.', [N('Yes! Black as ink. In the sun you can see spots.')], true),
            o('Pink.', [N('Not pink! Bagheera is black.')]),
          ],
          'Learned that a black panther is a leopard, a big cat, with very dark fur.',
        ),
      ],
      [
        ch('ask', 'Ask Bagheera what Mowgli should do.', [
          BG('Fetch the Red Flower, little brother.'),
        ]),
        ch('mowgli', 'Look at Mowgli. He is very quiet.', [
          BG('Be ready for them, little brother.'),
        ]),
      ],
    ),
    sc(
      'a24-06-branch-done',
      [
        MG('I know where the Red Flower is. I will go now.'),
        BG('Take the guest. Guests are good at carrying things.'),
        N('Long ago, people learned to use fire. It gave them warmth and light.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'people long ago used fire for warmth and light',
          'D2.His.2.K-2',
          [N('Long ago, fire helped people. What does fire give us: warmth, or a cold wind?')],
          [
            o('Warmth and light.', [N('Yes! Fire gives warmth and light.')], true),
            o('A cold wind.', [N('No! Fire is warm and bright.')]),
          ],
          'Learned that long ago people used fire for warmth and light.',
        ),
      ],
    ),
    sc(
      'a24-06-pot',
      [
        N('You lie in a ditch at the edge of the village. It is nearly dawn.'),
        N('A woman puts a clay pot of glowing coals by her door.'),
        N('She goes back in. Mowgli darts out and takes it!'),
        MG('She looks like me. They all look like me.', 'think'),
        VI('My fire-pot! Where is my fire?', 'shock'),
        N('The woman looks sad. She has a cold breakfast.'),
      ],
      [
        ask(
          5,
          'sel',
          'asking first before taking something',
          'CASEL: Responsible decision-making',
          [
            N(
              'Mowgli took the pot without asking. What should we do first when we want something?',
            ),
          ],
          [
            o('Ask first.', [N('Yes! Asking first is kind.')], true),
            o('Just take it.', [N('The woman felt sad. Asking first is kinder.')]),
          ],
          'Talked about asking before taking something, and how it feels for the person.',
        ),
      ],
      [
        ch('coin', 'Leave something on the step.', [
          N('You leave a smooth stone with a hole. It is a thank-you.'),
        ]),
        ch('go', 'Run after Mowgli with the pot.', [
          N('A neighbour shares her fire with the woman. It is a kind village.'),
        ]),
      ],
    ),
    sc(
      'a24-06-pot-done',
      [
        N('Back in the jungle, Mowgli puts the pot on a flat stone.'),
        MG('If I do not feed it, it will die. Fire eats sticks.'),
        N('Under the ash, a few coals glow red.'),
      ],
      [
        ask(
          2,
          'science',
          'fire needs wood to burn',
          'ELOF: Scientific Reasoning',
          [N('A fire needs food. What does a fire eat: dry sticks, or water?')],
          [
            o('Dry sticks.', [N('Yes! Fire burns wood. Water puts it out.')], true),
            o('Water.', [N('Water puts a fire out. Fire eats dry sticks.')]),
          ],
          'Learned that a fire needs dry wood to burn, and that water puts it out.',
        ),
      ],
    ),
    sc(
      'a24-06-feed',
      [
        N('All day you and Mowgli feed the fire with dry twigs.'),
        MG('Two sticks first. Then one more.'),
        N('Your Nubbin brings a twig. It is a beetle! It puts it back.'),
        MG('It eats like a wolf cub. Always hungry!', 'happy'),
        N('A wolf passes and goes the long way round.'),
        MG('He is scared of fire. I am not. Is that what being a man means?', 'think'),
      ],
      [
        doit(
          1,
          'maths',
          'add 2 and 1 to make 3',
          'K.OA.A.2',
          'edu:count:sticks:3',
          [
            N(
              'Mowgli puts in two sticks, then one more. How many sticks is that? Count: one, two, three!',
            ),
          ],
          'Added 2 and 1 to make 3 sticks.',
        ),
      ],
      [
        ch('answer', 'Tell him you do not know. You are still learning.', [
          MG('Good. I like people who still learn.', 'happy'),
        ]),
        ch('blow', 'Show him how to blow gently.', [
          N('The coals glow like a cat’s eyes. Mowgli laughs.'),
        ]),
      ],
    ),
    sc(
      'a24-06-feed-done',
      [
        N('By evening the fire glows steadily.'),
        N('Tabaqui slinks into the clearing, grinning.'),
        TB('The young wolves want Mowgli at the Council Rock. All of them!', 'happy'),
      ],
      [
        ask(
          1,
          'literacy',
          'a word for a sneaky walk: slink',
          'RL.1.4',
          [N('Tabaqui slinks. Slinking is a sneaky, quiet walk. Which is sneaky: slink or stomp?')],
          [
            o('Slink.', [N('Yes! Slink, slink, slink. Show me a sneaky walk!')], true),
            o('Stomp.', [N('Stomping is loud! Slinking is quiet and sneaky.')]),
          ],
          'Learned that “slink” is a word for a sneaky, quiet way of walking.',
        ),
      ],
    ),
    sc(
      'a24-06-complete',
      [
        BG('Akela missed his hunt tonight.', 'sad'),
        MG('Then I will go to the Council. With this.'),
        N('He lifts the pot. It lights his face from below.'),
        BG('Stay near him, guest.', 'soft'),
        N('Fire is useful, and it is serious. Matches are for grown-ups.'),
      ],
      [
        ask(
          4,
          'health',
          'fire safety: leave matches alone and tell a grown-up',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('If you find matches at home, what should you do?')],
          [
            o('Leave them and tell a grown-up.', [N('Yes! Matches are for grown-ups.')], true),
            o('Play with them.', [N('No! Fire can be dangerous. Tell a grown-up.')]),
          ],
          'Practised fire safety: leaving matches alone and telling a grown-up.',
        ),
      ],
    ),
  ],
);

// ================================================================== A24-7 The Council of Fire
const A7: EduQuest = quest(
  'a24-07',
  'The Council of Fire',
  {
    'a24-07-s1': {
      goal: 'Go up to the Council Rock with Mowgli and the fire.',
      hint: 'Keep the pot steady. Sit at the edge.',
    },
    'a24-07-s2': {
      goal: 'Sit with Mowgli on the rock.',
      hint: 'Sit beside him. You do not need to talk.',
    },
  },
  [
    sc(
      'a24-07-council',
      [
        N('Akela lies beside his rock tonight. He is old and tired.'),
        N('Shere Khan walks up and down. The young wolves listen to him.'),
        SK('Give me the man’s cub!', 'angry'),
        AK('Mowgli has been good to us. Please leave him alone.', 'think'),
        N('Mowgli stands up with the fire-pot. He tips it out.'),
        MG('Men carry this. So I brought some!'),
        N('The coals light the dry moss. Whoosh! A bright flame!'),
        N('The wolves feel the heat. They scramble back, ears flat.'),
      ],
      [
        ask(
          7,
          'science',
          'we feel heat from a fire',
          'ELOF: Scientific Reasoning',
          [N('The wolves feel the fire before they touch it. What do we feel from a fire?')],
          [
            o('Heat.', [N('Yes! A fire is hot. We keep back.')], true),
            o('Cold.', [N('No! A fire is hot, not cold.')]),
          ],
          'Learned that a fire gives out heat we can feel from a distance.',
        ),
      ],
      [
        ch('back', 'Step back with your Nubbin.', [
          N('Your Nubbin hides its face in your knees. Then it peeks.'),
        ]),
        ch('stand', 'Stand behind Mowgli.', [
          N('Mother Wolf sees you there. Her eyes say thank you.'),
        ]),
      ],
    ),
    sc(
      'a24-07-council-done',
      [
        N('Mowgli swings a burning branch round and round.'),
        N('Crackle, crackle, the flames go. Sparks fly!'),
        N('Shere Khan turns and runs into the dark.'),
      ],
      [
        doit(
          1,
          'literacy',
          'a sound word: crackle',
          'ELOF: Language and Communication',
          'edu:say:sound-word:crackle',
          [N('Fire goes crackle, crackle! Say it with me. Crackle, crackle, crackle!')],
          'Said the sound word “crackle”.',
        ),
      ],
    ),
    sc(
      'a24-07-tears',
      [
        MG('Go away, all of you! Leave Akela alone!', 'angry'),
        MG('I am going to my own people. The jungle is shut to me.', 'sad'),
        N('The wolves have run. Only Akela and Bagheera stay, and you.'),
        N('Water runs down Mowgli’s face. He has never cried before.'),
        MG('What is this? Is something wrong with me?', 'shock'),
        BG('No, little brother. Those are tears. It is all right to cry.', 'soft'),
      ],
      [
        ask(
          5,
          'sel',
          'crying is okay; it helps feelings come out',
          'CASEL: Self-awareness',
          [N('Mowgli is crying. Is it all right to cry when we are sad?')],
          [
            o(
              'Yes. Crying helps feelings come out.',
              [N('Yes! Crying is okay. It helps the sad feeling out.')],
              true,
            ),
            o('No. We must never cry.', [N('Everybody cries sometimes. It is okay.')]),
          ],
          'Learned that crying is all right and helps big feelings come out.',
        ),
      ],
      [
        ch('sit', 'Sit beside him and wait.', [N('Your Nubbin climbs onto his lap and stays.')]),
        ch('arm', 'Put your arm round his shoulders.', [
          N('He leans on you, like a cub on its mother.'),
        ]),
      ],
    ),
    sc(
      'a24-07-tears-done',
      [
        MG('My face is wet. I feel tired.', 'sad'),
        BG('That is what crying does. Have a drink, and rest.'),
        MG('Now I will say goodbye to my mother.', 'sad'),
        N('He goes to the cave. Mother Wolf holds him. The cubs howl softly.'),
      ],
      [
        ask(
          1,
          'health',
          'after crying: a drink of water, rest and a hug',
          'CASEL: Self-management',
          [
            N(
              'After a big cry, Mowgli feels tired. What helps: a drink, a rest and a hug, or running a mile?',
            ),
          ],
          [
            o('A drink, a rest and a hug.', [N('Yes! Our bodies need water and rest.')], true),
            o('Running a mile.', [N('Running is for later. Rest, a drink and a hug come first.')]),
          ],
          'Learned that after crying, water, rest and a hug help the body and heart.',
        ),
      ],
    ),
    sc(
      'a24-07-complete',
      [
        MW('Come back soon, my little frog.', 'sad'),
        MG('I will come back. I will not forget you.', 'soft'),
        N('Mowgli goes down the hill alone. (Count his steps with him.)'),
        N('The fire-pot is cold on the rock. Bagheera pushes it to you.'),
        BG('Keep it, guest. You fed it.'),
      ],
      [
        doit(
          2,
          'maths',
          'count steps to 5',
          'K.CC.B.4',
          'edu:count:steps:5',
          [N('Count Mowgli’s steps. One, two, three, four, five. Bye, Mowgli!')],
          'Counted five steps aloud, matching each number to one step.',
        ),
      ],
    ),
  ],
);

// ================================================================== A24-8 Messua
const A8: EduQuest = quest(
  'a24-08',
  'Messua',
  {
    'a24-08-s1': {
      goal: 'Walk into the village with Mowgli.',
      hint: 'Walk slowly. Hold your Nubbin. The dogs are nervous.',
    },
    'a24-08-s2': {
      goal: 'Go with Mowgli to herd the buffalo.',
      hint: 'Sit on a buffalo’s back. Mowgli knows which ones bite.',
    },
    'a24-08-s3': {
      goal: 'Go with Mowgli to the big tree.',
      hint: 'Sit at the back. The men tell stories there.',
    },
  },
  [
    sc(
      'a24-08-gate',
      [
        N('Mowgli walks from the hills to the plain. He has never seen so many people.'),
        N('There are flat fields, a shiny river, and a well by the gate.'),
        VI('A wolf-child! Poor lost boy. Someone should take him in.'),
        N('A woman with copper rings comes forward. It is Messua.'),
        ME('You look like my little Nathoo. He died long ago.', 'soft'),
        ME('Come home, whoever you are. You both look hungry.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'villages are near water and fields',
          'D2.Geo.2.K-2',
          [
            N(
              'A village needs water. Where does the village get water: a well, or a cloud in a jar?',
            ),
          ],
          [
            o('A well.', [N('Yes! A well gives the village water.')], true),
            o('A cloud in a jar.', [N('Funny! The village gets water from a well and the river.')]),
          ],
          'Learned that villages are built near water, such as a well or river, and near fields.',
        ),
      ],
      [
        ch('thank', 'Thank her and bow.', [
          ME('Such good manners! Who taught you?', 'happy'),
          Y('A bear.'),
        ]),
        ch('mowgli', 'Let Mowgli go in first.', [
          N('Mowgli goes in slowly. Messua does not hurry him.'),
        ]),
      ],
    ),
    sc(
      'a24-08-gate-done',
      [
        N('Messua gives Mowgli milk and bread.'),
        ME('My Nathoo had a little red cap. He never took it off.', 'sad'),
        N('Mowgli looks at the floor. His hands are still.'),
      ],
      [
        ask(
          1,
          'sel',
          'being kind to someone who is sad: sit with them',
          'CASEL: Social awareness',
          [
            N(
              'Messua misses her little boy. She is sad. How can we be kind to someone who is sad?',
            ),
          ],
          [
            o('Sit with them and listen.', [N('Yes! Sitting with someone is a gift.')], true),
            o('Tell them to cheer up.', [
              N('Feelings do not switch off. Sitting with them is kinder.'),
            ]),
          ],
          'Talked about being kind to someone who is sad by sitting with them and listening.',
        ),
      ],
    ),
    sc(
      'a24-08-herd',
      [
        N('Mowgli learns to speak, and to wear a cloth.'),
        N('Then they give him the buffalo to look after.'),
        N('At noon the buffalo roll in the cool mud. Only their noses show!'),
        GB('Little brother! Shere Khan has gone away to heal. I came to warn you.', 'happy'),
        MG('I am not afraid. Watch for him for me.'),
      ],
      [
        ask(
          2,
          'science',
          'buffalo roll in mud to keep cool',
          'K-ESS3-1',
          [N('The buffalo roll in the mud. Why? To keep cool, or to get dirty for fun?')],
          [
            o('To keep cool.', [N('Yes! Mud keeps them cool in the hot sun.')], true),
            o('To get dirty for fun.', [N('They like it! But it helps them stay cool.')]),
          ],
          'Learned that buffalo roll in mud to stay cool and protect their skin.',
        ),
      ],
      [
        ch('pet', 'Scratch Grey Brother behind the ears.', [
          GB('Does your Nubbin still howl like a kettle?', 'happy'),
        ]),
        ch('nubbin', 'Let your Nubbin say hello.', [
          N('Your Nubbin tumbles against Grey Brother’s legs.'),
        ]),
      ],
    ),
    sc(
      'a24-08-herd-done',
      [
        N('Days pass in the heat. The buffalo wallow in the mud.'),
        N('Mowgli counts the buffalo every evening.'),
        N('Your Nubbin rides a buffalo. It falls off twice. Splat!'),
      ],
      [
        doit(
          1,
          'maths',
          'counting buffalo to 5',
          'K.CC.B.5',
          'edu:count:buffalo:5',
          [N('Count the buffalo with Mowgli. One, two, three, four, five. Five buffalo!')],
          'Counted five buffalo, one number for each.',
        ),
      ],
    ),
    sc(
      'a24-08-tree',
      [
        N('In the evenings the men sit under a great fig tree.'),
        N('Buldeo the hunter tells the best stories.'),
        BU('The tiger is a ghost! A ghost tiger!', 'think'),
        N('Mowgli laughs. Everyone turns to look.'),
        MG('He is no ghost. He is just old and cross.', 'happy'),
        N('Buldeo’s face goes hot. He looks a little scared.'),
      ],
      [
        ask(
          2,
          'literacy',
          'pretend and real: a ghost tiger is a tall tale',
          'RL.K.3',
          [N('Buldeo says the tiger is a ghost. Is a ghost tiger real, or pretend?')],
          [
            o('Pretend.', [N('Yes! A ghost tiger is a story. Stories can be fun!')], true),
            o('Real.', [N('Ghosts are pretend. A tall story is for fun.')]),
          ],
          'Told the difference between real and pretend with a tall tale about a ghost tiger.',
        ),
      ],
      [
        ch('buldeo', 'Ask Buldeo to tell you more.', [
          BU('At last, someone who listens!', 'happy'),
        ]),
        ch('mowgli', 'Nudge Mowgli. Buldeo feels silly.', [
          MG('Oh. I should not say so. Wolves just say so.', 'think'),
        ]),
      ],
    ),
    sc(
      'a24-08-tree-done',
      [
        N('Buldeo goes home early.'),
        N('Next day, the headman tells Mowgli to graze the buffalo far away.'),
        ME('Come home and sleep, son. Leave old men to their stories.', 'soft'),
      ],
      [
        ask(
          1,
          'social-studies',
          'villages have a headman to help decide things',
          'D2.Civ.8.K-2',
          [
            N(
              'In a village, someone helps decide. It is the headman. Who helps decide in the village?',
            ),
          ],
          [
            o('The headman.', [N('Yes! The headman listens and helps decide.')], true),
            o('The buffalo.', [N('The buffalo give milk, but the headman helps decide.')]),
          ],
          'Learned that a village has a headman or council that helps people decide things fairly.',
        ),
      ],
    ),
    sc(
      'a24-08-complete',
      [
        N('Messua makes you a bed by the fire.'),
        N('She makes your Nubbin one too, in a basket.'),
        ME('Two strays and a boy. I always wanted a full house!', 'happy'),
        N('That night Mowgli goes out to sleep under the sky.'),
        N('Messua hears. She does not stop him.'),
      ],
      [
        ask(
          3,
          'sel',
          'people like different things; that is okay',
          'CASEL: Social awareness',
          [N('Mowgli likes to sleep outside. Messua lets him. Why is that kind?')],
          [
            o(
              'She lets him choose what he needs.',
              [N('Yes! Letting a friend be themselves is kind.')],
              true,
            ),
            o('She does not care.', [N('She cares. She lets him choose.')]),
          ],
          'Understood that letting a friend choose what they need is a way of being kind.',
        ),
      ],
    ),
  ],
);

// ================================================================== A24-9 Tiger! Tiger!
const A9: EduQuest = quest(
  'a24-09',
  'Tiger! Tiger!',
  {
    'a24-09-s1': {
      goal: 'Meet Grey Brother at the river with Mowgli.',
      hint: 'The river is wide here. Watch for a grey back in the grass.',
    },
    'a24-09-s2': {
      goal: 'Watch from the top of the ravine.',
      hint: 'Stay low. Wave when the herd is in. Then cover your ears.',
    },
    'a24-09-s3': {
      goal: 'Watch at the ravine mouth.',
      hint: 'Keep your Nubbin back. Akela will handle Buldeo.',
    },
  },
  [
    sc(
      'a24-09-ford',
      [
        N('A grey shape is on the rock by the river. It is Grey Brother.'),
        N('Here the river is wide and shallow. It flows slow.'),
        GB('Shere Khan is asleep in the dry ravine. He ate well last night.', 'think'),
        MG('Then he is slow. And the ravine has a mouth at each end!'),
        N('Akela rises from the long grass. He is old, with bright eyes.'),
        AK('I have waited for you to need me, little brother.', 'happy'),
      ],
      [
        ask(
          1,
          'science',
          'a river slows down where it spreads out wide and shallow',
          'ELOF: Scientific Reasoning',
          [N('Here the river spreads out wide and shallow. Does it run fast here, or slow?')],
          [
            o(
              'Slow.',
              [N('Yes! A wide river runs slowly. That is why we cross here.')],
              true,
            ),
            o('Fast.', [
              N('Squeezed into a narrow gap, it runs fast. Spread out wide, it runs slow.'),
            ]),
          ],
          'Learned that a wide, shallow river flows more slowly.',
        ),
      ],
      [
        ch('help', 'Ask what you can do.', [
          MG('Stand at the top of the ravine and wave. Do not come down.'),
        ]),
        ch('akela', 'Greet Akela.', [
          AK('Welcome, guest. You stood by him. The pack noticed.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a24-09-ford-done',
      [
        N('Akela and Grey Brother run in among the buffalo.'),
        MG('Three cows at this end. Two bulls at the other.'),
        N('You climb to the top of the ravine. You lie flat in the grass.'),
      ],
      [
        ask(
          1,
          'maths',
          'add: 3 + 2 = 5',
          'K.OA.A.2',
          [MG('Three cows and two bulls. How many buffalo in all? (Count on your fingers.)')],
          [
            o('5.', [N('Yes! Three and two makes five.')], true),
            o('3.', [N('Count them all: one, two, three, four, five.')]),
          ],
          'Added 3 and 2 to make 5 buffalo.',
        ),
      ],
    ),
    sc(
      'a24-09-ravine',
      [
        N('Mowgli rides the lead bull. Akela drives the others in.'),
        N('Both groups are in. You wave your arms.'),
        MG('Shere Khan! Wake up! I have brought the buffalo!', 'angry'),
        N('The herd pours in from both ends. Boom, boom, boom!'),
        N('Red dust rises up the walls. It is very, very loud!'),
        N('You put your hands over your Nubbin’s ears. Then over your own.'),
        N('Then it is quiet. Only dust, settling.'),
      ],
      [
        ask(
          6,
          'health',
          'cover your ears when it is very loud',
          'CASEL: Responsible decision-making',
          [N('It was so loud! What do we do when a noise is very loud?')],
          [
            o('Cover our ears.', [N('Yes! That keeps our ears safe.')], true),
            o('Shout louder.', [N('Shouting makes it louder. Cover your ears.')]),
          ],
          'Learned to cover our ears or move away when a noise is very loud.',
        ),
      ],
      [
        ch('wait', 'Wait until the dust clears.', [
          N('You wait. Mowgli climbs down and walks into the dust.'),
        ]),
        ch('hold', 'Hold your Nubbin and count your breaths.', [
          N('You count to forty. Then Akela sits beside you, panting.'),
        ]),
      ],
    ),
    sc(
      'a24-09-ravine-done',
      [
        AK('It is finished. Shere Khan has died. His body stopped working.', 'think'),
        AK('Mowgli is safe now. We will sit with him.', 'soft'),
        N('The buffalo spread out across the plain and eat grass.'),
        N('They graze side by side, shoulder to shoulder.'),
      ],
      [
        ask(
          3,
          'science',
          'herd animals stay together to be safe',
          'K-ESS3-1',
          [N('The buffalo stay close together. Is it safer alone, or all together?')],
          [
            o('All together.', [N('Yes! Many eyes can watch out for danger.')], true),
            o('Alone.', [N('Together is safer. Many eyes watch out.')]),
          ],
          'Learned that animals in a herd stay together because it keeps them safer.',
        ),
      ],
    ),
    sc(
      'a24-09-bounty',
      [
        N('Down at the ravine mouth, Mowgli kneels. He takes the striped coat.'),
        N('Buldeo comes running with his old gun.'),
        BU('A prize for that tiger! It is mine! Leave it, boy!', 'angry'),
        MG('It is my coat to take. Go away, old man.'),
        MG('Akela. This man is bothering me.'),
        N('Akela stands up. Buldeo falls flat on his back. Akela does not bite.'),
        N('He only stands there, big and calm, like a heavy rug.'),
      ],
      [
        ask(
          6,
          'social-studies',
          'rules help keep tigers safe',
          'D2.Civ.8.K-2',
          [N('Today there is a rule: people must not hunt tigers. Why is that a good rule?')],
          [
            o('It keeps tigers safe.', [N('Yes! Rules help keep wild animals safe.')], true),
            o('It is not a good rule.', [
              N('It is! There are not many wild tigers. The rule helps them.'),
            ]),
          ],
          'Learned that laws today protect tigers, helping them stay safe.',
        ),
      ],
      [
        ch('help', 'Help Buldeo up.', [N('He takes your hand, shaking. He nods.')]),
        ch('mowgli', 'Ask Mowgli to let him go.', [
          MG('Let him up, brother. He is just a frightened old man.', 'think'),
        ]),
      ],
    ),
    sc(
      'a24-09-bounty-done',
      [
        N('Buldeo runs home as fast as he can.'),
        MG('He will say I am a wizard. Let him.', 'think'),
        N('Buldeo was cross, and Mowgli was kind to him anyway.'),
      ],
      [
        ask(
          2,
          'sel',
          'being kind to someone who is scared',
          'CASEL: Social awareness',
          [N('Buldeo was scared. Mowgli was kind. Can we be kind to a scared person?')],
          [
            o(
              'Yes. We can be kind.',
              [N('Yes! Scared people often act cross. Kindness helps.')],
              true,
            ),
            o('No. Be unkind back.', [N('Unkind makes it worse. Kindness helps.')]),
          ],
          'Talked about being kind to someone who is scared and acting cross.',
        ),
      ],
    ),
    sc(
      'a24-09-complete',
      [
        N('By evening the striped coat is rolled and tied.'),
        AK('You did what you said you would do. Not many do.'),
        MG('I said it on the Council Rock. So it has to go there.'),
        N('Behind you, the village lights come on, one by one.'),
      ],
      [
        ask(
          2,
          'literacy',
          'keeping a promise',
          'ELOF: Literacy',
          [
            N(
              'Mowgli said he would bring the coat to the Council Rock. What does keeping a promise mean?',
            ),
          ],
          [
            o('Doing what you said you would do.', [N('Yes! Mowgli kept his promise.')], true),
            o('Forgetting what you said.', [N('Keeping a promise means doing what you said.')]),
          ],
          'Learned that keeping a promise means doing what you said you would do.',
        ),
      ],
    ),
  ],
);

// ================================================================== A24-10 Stones
const A10: EduQuest = quest(
  'a24-10',
  'Stones',
  {
    'a24-10-s1': {
      goal: 'Walk back to the village with Mowgli at dusk.',
      hint: 'Walk at his side. Hold your Nubbin when the voices start.',
    },
    'a24-10-s2': {
      goal: 'Choose: go with Mowgli, or stay with Messua.',
      hint: 'Both roads are kind. Mowgli will understand.',
    },
  },
  [
    sc(
      'a24-10-dusk',
      [
        N('At the edge of the village, everyone waits with torches.'),
        BU('That is the boy who talks to wolves!', 'angry'),
        VI('Go away! We are scared of you!', 'shock'),
        N('A pebble bumps along the road. The villagers are very scared.'),
        MG('First the wolves send me away. Now the men do.', 'sad'),
        N('Messua runs through the crowd with her arms out. She is crying.'),
        ME('Oh, my son! Go quickly, before they hurt you!', 'sad'),
      ],
      [
        ask(
          6,
          'sel',
          'scared people may shout; breathe and ask for help',
          'ELOF: Social and Emotional Development',
          [N('The villagers are scared, so they shout. What can we do when we feel scared?')],
          [
            o(
              'Take a slow breath and ask for help.',
              [N('Yes! A slow breath helps us stay kind.')],
              true,
            ),
            o('Shout and throw things.', [
              N('That can hurt. A slow breath and asking for help is kinder.'),
            ]),
          ],
          'Talked about what to do when scared: breathe slowly and ask for help instead of shouting.',
        ),
      ],
      [
        ch('shield', 'Stand between Messua and the villagers.', [
          N('You stand in the road. Nobody comes near.'),
        ]),
        ch('nubbin', 'Hold your Nubbin tight.', [
          N('Your Nubbin trembles. A pebble rolls to a stop by your boot.'),
        ]),
      ],
    ),
    sc(
      'a24-10-dusk-done',
      [
        MG('Go back, Messua. You were good to me.', 'soft'),
        ME('Goodbye, my son. I love you, whoever you are.', 'sad'),
        N('She holds her hands together until you can hardly see her.'),
      ],
      [
        ask(
          1,
          'literacy',
          'a word for a big feeling: love',
          'RL.1.4',
          [N('Messua says “I love you”. Which word shows how she feels: love, or sock?')],
          [
            o('Love.', [N('Yes! Love is a big feeling word.')], true),
            o('Sock.', [N('A sock is for feet! Love is the feeling word.')]),
          ],
          'Picked out a word, “love”, that shows a character’s feeling.',
        ),
      ],
    ),
    sc(
      'a24-10-road',
      [
        N('Mowgli walks up the road to the dark trees. Akela and Grey Brother meet him.'),
        N('Messua stands behind you with her hands on her mouth.'),
        MG('Are you coming? The jungle is home. You can come.', 'think'),
        N('Your Nubbin looks at Mowgli, then at Messua, then at you.'),
        ME('Go on, both of you. I will be well enough.', 'sad'),
      ],
      [
        ask(
          4,
          'social-studies',
          'choosing one thing means not choosing another',
          'D2.Eco.1.K-2',
          [
            N(
              'You can go with Mowgli, or stay with Messua. When we choose one, can we be in both places at once?',
            ),
          ],
          [
            o(
              'No. We pick one at a time.',
              [N('Yes! A choice means picking one. Both are kind.')],
              true,
            ),
            o('Yes. We can be in two places.', [
              N('We cannot be in two places! So we choose one.'),
            ]),
          ],
          'Learned that a choice means picking one thing at a time, and that both choices here are kind.',
        ),
      ],
      [
        ch(
          'mowgli',
          'Go with Mowgli into the jungle.',
          [MG('Good! The wolves will be glad.', 'happy')],
          { 'a24-stones': 'mowgli' },
        ),
        ch(
          'messua',
          'Stay a little with Messua.',
          [MG('Yes. Stay with her. Someone should.', 'soft')],
          { 'a24-stones': 'messua' },
        ),
      ],
    ),
    sc(
      'a24-10-road-done',
      [
        N('You catch up with Mowgli at the edge of the trees.'),
        N('The sun has set. Frogs croak. An owl calls. Hoo hoo!'),
        N('Your Nubbin trots between Akela and Grey Brother, proud as a wolf.'),
      ],
      [
        ask(
          1,
          'science',
          'owls are awake at night',
          'K-ESS3-1',
          [N('An owl is hooting. When is an owl awake: at night, or at lunchtime?')],
          [
            o('At night.', [N('Yes! Owls are awake at night, when it is dark.')], true),
            o('At lunchtime.', [N('Owls sleep in the day. They wake at night.')]),
          ],
          'Learned that owls and some other animals are awake at night.',
        ),
      ],
    ),
    sc(
      'a24-10-complete',
      [
        MG('Tonight the coat goes to the Council Rock. Then you hunt with us.'),
        N('So you do, through the whole year. You learn the jungle from inside.'),
        N('Here the year has three big seasons: hot, rainy and cool.'),
        GB('You are not good at it yet. But you are getting better!', 'happy'),
      ],
      [
        doit(
          2,
          'maths',
          'count the three seasons of central India',
          'K.CC.B.5',
          'edu:count:seasons:3',
          [N('Count the seasons on your fingers. Hot, rainy, cool. Three!')],
          'Counted the three big seasons of central India: hot, rainy and cool.',
        ),
      ],
    ),
  ],
);

// ================================================================== A24-11 Look Well
const A11: EduQuest = quest(
  'a24-11',
  'Look Closely',
  {
    'a24-11-s1': {
      goal: 'Climb to the Council Rock as the moon comes up.',
      hint: 'Follow the path up the hill. Mowgli is already there.',
    },
    'a24-11-s2': {
      goal: 'Watch the pack come to the Council Rock.',
      hint: 'Sit still. This is the pack’s business.',
    },
  },
  [
    sc(
      'a24-11-climb',
      [
        N('You reach the Council Rock as the moon rises over the hills.'),
        N('Mowgli has spread the striped coat on the stone.'),
        MG('I said I would bring it. I keep my word.'),
        N('Your Nubbin sits on the very corner, like a cushion.'),
        N('Akela lies down on the coat, in his old place.'),
        AK('There. It feels the same. My bones are older.', 'soft'),
      ],
      [
        ask(
          1,
          'science',
          'the Moon changes shape; a full moon is round',
          '1-ESS1-1',
          [N('(Point to the moon.) Tonight the moon is full. What shape is a full moon?')],
          [
            o('A circle.', [N('Yes! A full moon is a big round circle.')], true),
            o('A square.', [N('No corners on the moon! A full moon is round, like a circle.')]),
          ],
          'Learned that the Moon changes shape, and that a full moon is round.',
        ),
      ],
      [
        ch('sit', 'Sit at the edge, where guests sit.', [
          N('You sit in your old place. It fits you better now.'),
        ]),
        ch('akela', 'Sit near Akela.', [AK('Sit, guest. You have earned a closer seat.', 'happy')]),
      ],
    ),
    sc(
      'a24-11-climb-done',
      [
        N('Akela lifts his head and gives the old Council call.'),
        N('Your Nubbin answers. It still sounds like a kettle!'),
        N('A-ke-la. Clap the parts of his name.'),
      ],
      [
        doit(
          2,
          'literacy',
          'clapping the syllables of a name: a-ke-la',
          'RF.K.2',
          'edu:clap:syllables:akela',
          [N('Clap along: a, ke, la. Three claps! Akela!')],
          'Clapped the three syllables of Akela.',
        ),
      ],
    ),
    sc(
      'a24-11-pack',
      [
        N('The wolves come up the hill. They are thin and tired.'),
        N('Without a leader, the pack fell apart.'),
        AK('Look closely, wolves. Have I kept my word?', 'think'),
        YW('Lead us again, Akela. We are sorry.', 'sad'),
        BG('You only want him because you are hungry.', 'angry'),
        MG('I will hunt on my own. With my four brothers, if they come.', 'think'),
      ],
      [
        ask(
          5,
          'sel',
          'someone says sorry: listen, and think about forgiving',
          'ELOF: Social and Emotional Development',
          [N('The young wolves are sorry. What can we do when someone says sorry?')],
          [
            o(
              'Listen, and think about forgiving.',
              [N('Yes! Listening to a sorry is kind. Forgiving can take time.')],
              true,
            ),
            o('Shout at them.', [N('Shouting does not help. Listening does.')]),
          ],
          'Talked about listening when someone says sorry, and that forgiving can take time.',
        ),
      ],
      [
        ch('proud', 'Look at Mowgli and nod.', [
          N('He does not nod back. But he stands a little straighter.'),
        ]),
        ch('pack', 'Look at the thin young wolves.', [
          N('One wolf sees you looking. He looks at his paws.'),
        ]),
      ],
    ),
    sc(
      'a24-11-pack-done',
      [
        GB('We will come. All four of us.'),
        N('Akela lies on the coat and looks at the hills.'),
        N('A wolf pack is a family. Mum, dad and pups share their food.'),
      ],
      [
        ask(
          2,
          'science',
          'wolf packs are families that share food',
          '1-LS1-2',
          [N('A wolf pack is a family. Who is in a wolf pack: mum, dad and pups, or a shark?')],
          [
            o('Mum, dad and pups.', [N('Yes! A wolf pack is a family.')], true),
            o('A shark.', [N('Sharks live in the sea. A pack is a wolf family.')]),
          ],
          'Learned that a wolf pack is a family where parents and pups share food and look after each other.',
        ),
      ],
    ),
    sc(
      'a24-11-complete',
      [
        N('The pack goes. The Council Rock is empty and warm.'),
        BG('Good. He did not need them in the end.', 'think'),
        BG('Mowgli and his four brothers. That is enough.'),
        N('Your Nubbin climbs onto the stone and watches the moon.'),
        BG('It is calling a Council of one!', 'happy'),
      ],
      [
        ask(
          2,
          'maths',
          'add: Mowgli + 4 wolf brothers = 5',
          'K.OA.A.1',
          [BG('Mowgli is one. His brothers are four. How many hunters is that?')],
          [
            o('5.', [N('Yes! One and four makes five.')], true),
            o('4.', [N('Do not forget Mowgli! One and four makes five.')]),
          ],
          'Added 1 and 4 to make 5.',
        ),
      ],
    ),
  ],
);

// ================================================================== A24-12 The Water Truce
const A12: EduQuest = quest(
  'a24-12',
  'The Water Truce',
  {
    'a24-12-s1': {
      goal: 'Walk down the dry river with Mowgli and Baloo.',
      hint: 'Follow the riverbed. Water is left at the Peace Rock.',
    },
    'a24-12-s2': {
      goal: 'Sit by the pool while Hathi tells an old story.',
      hint: 'Sit near Hathi. When he talks, the jungle listens.',
    },
    'a24-12-s3': {
      goal: 'Let your Nubbin drink at the pool.',
      hint: 'Set it down on the bank. It will find a place.',
    },
  },
  [
    sc(
      'a24-12-dry',
      [
        N('A year comes when the rain does not. Everything goes brown and dry.'),
        N('The streams dry up. Even the big river is a trickle.'),
        BL('I have never seen it this bad. I am half the bear I was.', 'sad'),
        N('Your Nubbin walks all round Baloo. It is looking for the other half!'),
        BL('It is still in here, little one.', 'happy'),
        N('A long blue rock stands up in the river. It is the Peace Rock.'),
        N('Hathi the elephant stands beside it. He has called the Water Truce.'),
        N('Elephants can dig for water in a dry river, with their feet and trunks.'),
        BL('A truce means: nobody hunts here, while there is water.'),
      ],
      [
        ask(
          7,
          'science',
          'plants and animals need water; elephants can dig for it',
          'K-LS1-1',
          [N('It has not rained for a long time. What do plants and animals need to live?')],
          [
            o('Water.', [N('Yes! Every living thing needs water. Hathi digs for it.')], true),
            o('Sweets.', [N('Sweets are nice! But water is what they need.')]),
          ],
          'Learned that plants and animals need water to live, and that elephants can dig for it in a dry river.',
        ),
      ],
      [
        ch('carry', 'Carry your Nubbin over the hot stones.', [
          N('The stones are hot. Your Nubbin pants in your arms.'),
        ]),
        ch('baloo', 'Walk beside Baloo.', [
          BL('Thank you. A bear has his pride, even when thin.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a24-12-dry-done',
      [
        N('At the Peace Rock the whole jungle comes to drink.'),
        N('Deer stand beside wolves. Pigs stand beside a panther.'),
        MG('Two deer and two wolves are drinking. Count them!'),
      ],
      [
        ask(
          2,
          'maths',
          'add two groups: 2 + 2 = 4',
          'K.OA.A.1',
          [MG('Two deer and two wolves drink. How many animals is that?')],
          [
            o('4.', [N('Yes! Two and two makes four.')], true),
            o('2.', [N('Count them all: one, two, three, four.')]),
          ],
          'Added 2 and 2 to make 4 animals.',
        ),
      ],
    ),
    sc(
      'a24-12-tale',
      [
        HA('You ask why we keep the Truce. Listen. This is how fear came.', 'think'),
        HA('Long ago, nobody in the jungle was afraid of anyone.'),
        HA('The First Tiger was a fair judge.'),
        HA('One day, by mistake, he hurt another animal. The jungle learned fear.'),
        HA('The First Tiger ran into the reeds. The reeds made stripes on his coat.'),
        HA('So when the water is low, we all drink together.'),
        MG('Is that true, Hathi?', 'think'),
        HA('It is old. That is different from true, and sometimes better.'),
      ],
      [
        ask(
          6,
          'literacy',
          'an old story is told again and again',
          'RL.K.3',
          [N('Hathi told an old story. Who told the story: Hathi, or the moon?')],
          [
            o('Hathi.', [N('Yes! Hathi the elephant told it.')], true),
            o('The moon.', [N('It was Hathi who told it.')]),
          ],
          'Named the character who told the story.',
        ),
      ],
      [
        ch('thank', 'Thank Hathi for the story.', [HA('Thank me by keeping the Truce.')]),
        ch('quiet', 'Say nothing, and look at the water.', [
          N('The water is low and still. Everyone is drinking.'),
        ]),
      ],
    ),
    sc(
      'a24-12-tale-done',
      [
        BG('Good story. It is better when you are thirsty.', 'think'),
        BL('Everything is better when you are thirsty. Except being thirsty.'),
        BG('Stripes really help a tiger hide in tall grass.'),
      ],
      [
        ask(
          2,
          'science',
          'stripes help tigers hide in tall grass',
          'ELOF: Scientific Reasoning',
          [
            N(
              'Stripes help a tiger hide. Where is a tiger hard to see: tall grass, or a white wall?',
            ),
          ],
          [
            o('Tall grass.', [N('Yes! The stripes look like grass. Shh, hide!')], true),
            o('A white wall.', [N('Stripes would show on a white wall! They hide in tall grass.')]),
          ],
          'Learned that a tiger’s stripes help it hide in tall grass.',
        ),
      ],
    ),
    sc(
      'a24-12-drink',
      [
        N('You set your Nubbin down on the bank.'),
        N('It walks to the edge between two deer, and drinks.'),
        N('A young fawn with white spots drinks beside it.'),
        N('They drink side by side, as if they always had.'),
        MG('There. The Truce. I thought it was just words.', 'soft'),
        BL('It is words that everyone keeps. That is what a law is.'),
      ],
      [
        ask(
          4,
          'sel',
          'sharing water; everyone gets some',
          'CASEL: Relationship skills',
          [N('Everyone shares the water. What happens when we share?')],
          [
            o('Everyone gets some.', [N('Yes! Sharing is kind. Everyone gets a turn.')], true),
            o('Only the biggest gets some.', [N('Sharing means everyone gets some.')]),
          ],
          'Talked about sharing, which means everyone gets some.',
        ),
      ],
      [
        ch('watch', 'Watch them drink.', [N('You watch. It is very quiet and kind.')]),
        ch('join', 'Kneel and drink too.', [
          N('You cup the water in your hands. It tastes of stone and rain.'),
        ]),
      ],
    ),
    sc(
      'a24-12-drink-done',
      [
        N('That night, far off, thunder rumbles.'),
        N('The first big drops fall. Plink, plink, plink!'),
        N('Then the rain comes. The Truce is over, and nobody minds.'),
      ],
      [
        ask(
          1,
          'science',
          'rain comes from clouds',
          'K-ESS2-1',
          [N('The rain is falling! Where does rain come from: clouds, or the floor?')],
          [
            o('Clouds.', [N('Yes! Rain falls from clouds.')], true),
            o('The floor.', [N('It falls from the clouds, up high.')]),
          ],
          'Learned that rain falls from clouds.',
        ),
      ],
    ),
    sc(
      'a24-12-complete',
      [
        N('The rain pours. The river comes back, brown and loud.'),
        N('It covers the Peace Rock by morning.'),
        HA('Now there is plenty of water. We remember the Truce.', 'think'),
        N('Your Nubbin stands in the rain with its mouth open.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'when there is only a little, we share',
          'D2.Eco.1.K-2',
          [N('When there is only a little water, what do we do?')],
          [
            o('Share it.', [N('Yes! When there is a little, we share.')], true),
            o('Keep it all.', [N('Sharing is fair. Everyone needs some.')]),
          ],
          'Learned that when there is not much of something, we share it fairly.',
        ),
      ],
    ),
  ],
);

// ================================================================== A24-13 Letting in the Jungle
const A13: EduQuest = quest(
  'a24-13',
  'Letting in the Jungle',
  {
    'a24-13-s1': {
      goal: 'Wait by Messua’s hut in the dark.',
      hint: 'Stay out of the torchlight. Mowgli comes when the village sleeps.',
    },
    'a24-13-s2': {
      goal: 'Go with Messua and her husband to the road.',
      hint: 'Keep to the dark under the trees. The wolves run beside you.',
    },
    'a24-13-s3': {
      goal: 'Watch the jungle come into the village.',
      hint: 'Climb to the ridge and watch. It takes a long time. Nobody is hurt.',
    },
  },
  [
    sc(
      'a24-13-hut',
      [
        N('A message comes through the jungle, from wolf to wolf.'),
        N('The villagers have tied Messua’s door shut, with her inside.'),
        N('You wait with Mowgli in the trees. Torches move below.'),
        N('When the village is asleep, Mowgli slips in at the back.'),
        N('Your Nubbin wriggles. It wants to rush down to Messua.'),
        N('You hold it tight and breathe slowly.'),
        MG('Messua. It is me. Hush. I have come to take you away.', 'soft'),
      ],
      [
        ask(
          5,
          'sel',
          'waiting calmly with slow breaths',
          'CASEL: Self-management',
          [N('Your Nubbin wants to rush in, but it must wait. What helps us wait?')],
          [
            o('A slow breath.', [N('Yes! A slow breath helps us wait.')], true),
            o('Run in fast.', [N('That could wake everyone! A slow breath helps us wait.')]),
          ],
          'Practised waiting calmly with slow breaths.',
        ),
      ],
      [
        ch('watch', 'Keep watch on the street.', [
          N('One dog barks, once. Then it thinks better of it.'),
        ]),
        ch('nubbin', 'Hold your Nubbin still.', [
          N('Your Nubbin trembles. You hold it, and it lets you.'),
        ]),
      ],
    ),
    sc(
      'a24-13-hut-done',
      [
        N('The back door opens. Mowgli comes out with Messua and her husband.'),
        ME('My son! I knew you would come. I hoped and hoped.', 'sad'),
        N('She is shaking, but she is smiling too.'),
      ],
      [
        ask(
          1,
          'literacy',
          'a word for a feeling: hope',
          'RL.1.4',
          [N('Messua hoped. She is smiling. Is Messua feeling happy, or cross?')],
          [
            o('Happy.', [N('Yes! She is happy and relieved.')], true),
            o('Cross.', [N('She is smiling! She is happy.')]),
          ],
          'Named a character’s feeling from how she speaks and what she does.',
        ),
      ],
    ),
    sc(
      'a24-13-road',
      [
        N('Mowgli leads them through the dark, the long way round.'),
        MG('The town is that way, where the sun comes up. It is a long walk.', 'think'),
        ME('Come with us, please. Be my son where nobody throws stones.', 'sad'),
        MG('I cannot. Not yet. But I will know where you are.'),
        MG('Guest, go to Hathi. Tell him: the fields.'),
        N('You run up the hill. Hathi is pulling down branches.'),
        HA('The fields. Yes. Tell him yes.', 'think'),
      ],
      [
        ask(
          1,
          'social-studies',
          'the sun comes up in the east',
          'D2.Geo.2.K-2',
          [
            MG(
              'The town is where the sun comes up. Where does the sun come up: east, or under the ground?',
            ),
          ],
          [
            o('East.', [N('Yes! The sun comes up in the east.')], true),
            o('Under the ground.', [N('The sun comes up in the east, over the hills.')]),
          ],
          'Learned that the Sun comes up in the east.',
        ),
      ],
      [
        ch('ask', 'Ask Hathi what he will do.', [
          HA('Nothing quick. Nothing cruel. We will let the jungle in.'),
        ]),
        ch('nod', 'Bow to Hathi and go back.', [
          N('Hathi lifts his trunk to you, slowly, like a hat.'),
        ]),
      ],
    ),
    sc(
      'a24-13-road-done',
      [
        N('When you get back, Messua and her husband are far away.'),
        N('The sky is pink and grey. The sun is nearly up.'),
        N('She turns at the bend and lifts her hand. You lift yours.'),
      ],
      [
        ask(
          1,
          'science',
          'dawn comes in the morning',
          '1-ESS1-2',
          [N('The sky is pink and bright. The sun is nearly up. Is it morning, or midnight?')],
          [
            o('Morning.', [N('Yes! The sky lights up at dawn, in the morning.')], true),
            o('Midnight.', [N('At midnight it is dark. Dawn is morning.')]),
          ],
          'Learned that dawn is the start of the morning, when the sky lights up.',
        ),
      ],
    ),
    sc(
      'a24-13-jungle',
      [
        N('It is not one night. It takes the whole rainy season.'),
        N('Hathi and his sons walk through the fields at night.'),
        N('Creepers climb the walls. Trees push up through the floors.'),
        N('The villagers pack their carts. They go to live in the valley.'),
        N('Nobody is hurt. The jungle comes in slowly.'),
        MG('They were going to hurt Messua. Now there is no village.', 'angry'),
        MG('It is sad. I am glad Messua is safe. I feel both.', 'sad'),
      ],
      [
        ask(
          6,
          'sel',
          'we can feel more than one feeling at once',
          'ELOF: Social and Emotional Development',
          [N('Mowgli feels sad and glad together. Can we feel two feelings at once?')],
          [
            o('Yes. It happens a lot.', [N('Yes! Feelings can be mixed up. That is okay.')], true),
            o('No. Only one at a time.', [N('Sometimes we feel two at once. That is okay.')]),
          ],
          'Learned that we can feel two feelings at the same time, such as sad and glad.',
        ),
      ],
      [
        ch('sad', 'Tell him it is sad all the same.', [
          MG('It is. I do not feel how I thought I would.', 'sad'),
        ]),
        ch('quiet', 'Look at the green roofs.', [N('A peacock stands on the old well.')]),
      ],
    ),
    sc(
      'a24-13-jungle-done',
      [
        N('By next year you can hardly tell a village was here.'),
        N('A fig tree grows out of the old stone platform.'),
        N('Its roots push the stones apart, bit by bit.'),
      ],
      [
        ask(
          1,
          'science',
          'a tree grows from a seed',
          'ELOF: Scientific Reasoning',
          [N('A tree is growing on the stone. What does a tree grow from?')],
          [
            o('A seed.', [N('Yes! A tiny seed grows into a big tree.')], true),
            o('A sock.', [N('Not a sock! Trees grow from seeds.')]),
          ],
          'Learned that a tree grows from a seed.',
        ),
      ],
    ),
    sc(
      'a24-13-complete',
      [
        N('You sit on the ridge with Mowgli. You look at the green humps.'),
        MG('Messua got to the town. She has a house with a blue door.', 'soft'),
        MG('She walked for four hours. Chil counted.'),
        N('Your Nubbin falls asleep. It dreams it is running with wolves.'),
      ],
      [
        doit(
          2,
          'maths',
          'count the hours to 4',
          'K.CC.B.5',
          'edu:count:hours:4',
          [N('Count the hours Messua walked. One, two, three, four. Four hours!')],
          'Counted four hours aloud.',
        ),
      ],
    ),
  ],
);

// ================================================================== A24-14 Red Dog
const A14: EduQuest = quest(
  'a24-14',
  'Red Dog',
  {
    'a24-14-s1': {
      goal: 'Go with Mowgli to ask Kaa for a plan.',
      hint: 'Kaa is on the river bank. He thinks slowly, and then he is right.',
    },
    'a24-14-s2': {
      goal: 'Watch the red dogs come up the river.',
      hint: 'Stay on the high bank with your Nubbin.',
    },
    'a24-14-s3': {
      goal: 'Sit with Akela and Mowgli on the river bank.',
      hint: 'Go down to the bank. Sit beside them. You do not need to talk.',
    },
  },
  [
    sc(
      'a24-14-plan',
      [
        N('A wolf comes to the hills, limping, with bad news.'),
        GB('Red wild dogs are coming up the river. Lots of them!', 'shock'),
        MG('The Free People do not run. Kaa will know what to do.', 'angry'),
        N('Kaa lies along the river bank. He is old, wise and big.'),
        KA('The dogs do not think. That is their weakness.', 'think'),
        KA('Near here is a gorge with a nest of wild bees.'),
        KA('Lead the dogs past the bees, and into the river. The wolves wait below.'),
      ],
      [
        ask(
          5,
          'science',
          'bees live in a hive and make honey',
          '2-LS2-2',
          [N('Wild bees live together in a nest. What do bees make: honey, or ice cream?')],
          [
            o(
              'Honey.',
              [N('Yes! Bees make honey. They help flowers make fruit, too. Buzz!')],
              true,
            ),
            o('Ice cream.', [N('Bees make honey, not ice cream.')]),
          ],
          'Learned that bees live together in a nest, make honey and help flowers become fruit.',
        ),
      ],
      [
        ch('clever', 'Tell Kaa that is very clever.', [
          KA('Of course. Being old is mostly being clever.', 'happy'),
        ]),
        ch('bees', 'Ask what the bees will do.', [
          KA('What bees do when you run through their house. Buzz!'),
        ]),
      ],
    ),
    sc(
      'a24-14-plan-done',
      [
        MG('First, I will lead the dogs past the bees.'),
        MG('Next, I will jump in the river.'),
        KA('Last, I will be waiting in the water to pull you out.'),
      ],
      [
        ask(
          2,
          'literacy',
          'first, next, last',
          'RL.K.3',
          [N('Mowgli says what happens first, next and last. What does Mowgli do first?')],
          [
            o(
              'Leads the dogs past the bees.',
              [N('Yes! First he leads the dogs. Next the river. Last Kaa.')],
              true,
            ),
            o('Pulls himself out of the river.', [
              N('That comes last! First he leads the dogs past the bees.'),
            ]),
          ],
          'Put a plan in order using first, next and last.',
        ),
      ],
    ),
    sc(
      'a24-14-river',
      [
        N('You stand on the high bank with the wolves.'),
        N('Far up the gorge, the whole world hums. Then barking!'),
        N('The red dogs run after Mowgli. The bees swarm out after them.'),
        N('Mowgli jumps into the river. Kaa’s big coil lifts him up.'),
        N('The river carries the dogs far away. Splash and spray!'),
        AK('Stay back, guest. This is the pack’s fight.', 'think'),
      ],
      [
        ask(
          5,
          'science',
          'moving water pushes things along',
          'ELOF: Scientific Reasoning',
          [N('The river carries the dogs. What pushes a leaf along a river?')],
          [
            o('The water.', [N('Yes! Moving water pushes things along.')], true),
            o('A fish tickle.', [N('It is the water that pushes it.')]),
          ],
          'Learned that moving water pushes things along.',
        ),
      ],
      [
        ch('hold', 'Hold your Nubbin close and keep watching.', [
          N('Your Nubbin trembles, but keeps watching.'),
        ]),
        ch('cover', 'Turn your Nubbin away from the river.', [
          N('You turn it to the trees. You watch for both of you.'),
        ]),
      ],
    ),
    sc(
      'a24-14-river-done',
      [
        N('It goes on a long time. Then the river is only a river.'),
        N('The red dogs are gone. The pack holds the river.'),
        GB('Three wolves are tired. Two wolves are fine. We are all here.', 'soft'),
      ],
      [
        ask(
          2,
          'maths',
          'add: 3 + 2 = 5',
          'K.OA.A.2',
          [N('Three wolves are tired, and two are fine. How many wolves is that?')],
          [
            o('5.', [N('Yes! Three and two makes five.')], true),
            o('3.', [N('Count them all: one, two, three, four, five.')]),
          ],
          'Added 3 and 2 to make 5 wolves.',
        ),
      ],
    ),
    sc(
      'a24-14-akela',
      [
        N('Akela lies very still on the pebbles. Mowgli kneels beside him.'),
        AK('It was a good fight. I wanted the last one to be good.', 'soft'),
        MG('Rest now. You can rest.', 'sad'),
        AK('Lift my head, little brother. Let me see the hills.', 'soft'),
        N('Mowgli holds the old grey head, so Akela can see the hills.'),
        N('Akela closes his eyes. His breath goes slow, and stops.'),
        N('Akela has died. His body stopped working, and it will not start again.'),
      ],
      [
        ask(
          6,
          'sel',
          'what died means, said plainly; feeling sad is okay',
          'CASEL: Social awareness',
          [N('Akela has died. What does that mean?')],
          [
            o(
              'His body stopped working.',
              [N('Yes. He will not wake up. It is all right to feel sad.')],
              true,
            ),
            o('He is asleep.', [N('No. A sleeping body wakes up. A body that has died does not.')]),
          ],
          'Learned plainly what died means, and that feeling sad is a normal response.',
        ),
      ],
      [
        ch('sit', 'Sit down beside them and wait.', [
          N('You sit on the pebbles. Nobody says anything for a long time.'),
        ]),
        ch('hand', 'Put your hand on Mowgli’s back.', [
          N('He leans back against your hand a little.'),
        ]),
      ],
    ),
    sc(
      'a24-14-akela-done',
      [
        N('Your Nubbin lies down against Akela’s grey side.'),
        N('It stays there until the sun is high.'),
        N('Mowgli’s eyes are red. His arms feel heavy. That is what sadness does.'),
      ],
      [
        ask(
          2,
          'health',
          'when we are sad: a hug, a rest, and being with people',
          'CASEL: Self-management',
          [N('When we are very sad, what helps? A hug and a rest, or being all alone?')],
          [
            o('A hug and a rest.', [N('Yes! A hug, a rest, and people who care.')], true),
            o('Being all alone.', [N('Some quiet is fine. But a hug and a friend help most.')]),
          ],
          'Learned that when we are very sad, a hug, rest and people who care help.',
        ),
      ],
    ),
    sc(
      'a24-14-complete',
      [
        N('That evening the pack howls for Akela from the Council Rock.'),
        N('Mowgli howls with them, and so do you.'),
        N('Your Nubbin howls too. For once it sounds like a wolf.'),
        GB('He waited all those years for you to need him.', 'sad'),
        MG('He was the best of us. We will remember him.', 'sad'),
      ],
      [
        ask(
          4,
          'literacy',
          'remembering someone means thinking of them kindly',
          'ELOF: Language and Communication',
          [N('The wolves howl for Akela. How do we remember someone we love?')],
          [
            o(
              'We think of them, and tell stories.',
              [N('Yes! Remembering keeps them close.')],
              true,
            ),
            o('We never talk about them.', [N('Talking about them is a lovely way to remember.')]),
          ],
          'Talked about remembering someone we love by thinking of them and telling stories.',
        ),
      ],
    ),
  ],
);

// ================================================================== A24-15 The Spring Running
const A15: EduQuest = quest(
  'a24-15',
  'The Spring Running',
  {
    'a24-15-s1': {
      goal: 'Find Mowgli, who is sad.',
      hint: 'He is by the river, throwing stones. It is spring.',
    },
    'a24-15-s2': {
      goal: 'Run north through the night with Mowgli.',
      hint: 'Keep up. Watch for a light ahead.',
    },
  },
  [
    sc(
      'a24-15-spring',
      [
        N('Mowgli is nearly grown up. He is tall and strong.'),
        N('Then spring comes. The whole jungle is singing and nesting.'),
        MG('I feel funny. Not hungry. Just funny.', 'sad'),
        N('Mowgli throws a stone in the river, and another.'),
        MG('Why do I feel like this, guest?', 'sad'),
      ],
      [
        ask(
          4,
          'sel',
          'it is okay to feel something and not know why; tell a friend',
          'CASEL: Self-awareness',
          [N('Mowgli feels funny and does not know why. Who can we tell when we feel funny?')],
          [
            o('A friend or a grown-up.', [N('Yes! Telling someone helps.')], true),
            o('Nobody ever.', [N('Telling someone we trust helps us feel lighter.')]),
          ],
          'Learned that it is okay to feel something without knowing why, and that telling someone helps.',
        ),
      ],
      [
        ch('dunno', 'Tell him you do not know. It happens to people.', [
          MG('People. Not wolves. That is always the answer.', 'sad'),
        ]),
        ch('sit', 'Sit and throw stones too.', [
          N('Your Nubbin throws one over its own head. Mowgli almost laughs.'),
        ]),
      ],
    ),
    sc(
      'a24-15-spring-done',
      [
        MG('I am going to run all night.', 'angry'),
        GB('I will come too. Keep the still star in front of you.', 'soft'),
        N('One star hangs low over the north. It does not move.'),
      ],
      [
        ask(
          2,
          'science',
          'we see stars at night',
          '1-ESS1-1',
          [N('(Point to the star in the picture.) When do we see the stars in the sky?')],
          [
            o('At night.', [N('Yes! Stars shine in the night sky. One star shows north.')], true),
            o('At lunchtime.', [N('The stars are there, but we see them at night.')]),
          ],
          'Learned that we see stars in the night sky, and that one star helps show which way is north.',
        ),
      ],
    ),
    sc(
      'a24-15-lamp',
      [
        N('You run all night, north, through jungle you do not know.'),
        N('Your Nubbin rides on Grey Brother’s back.'),
        N('Near dawn, a light! A lamp in the window of a little hut.'),
        N('A woman comes to the door with the lamp. It is Messua.'),
        ME('Who is it? There is nothing to steal. Only me and my baby.', 'shock'),
        MG('It is me, Messua.', 'soft'),
        ME('Mowgli! Oh, how tall you are. Come in, come in!', 'happy'),
      ],
      [
        ask(
          6,
          'literacy',
          'first sounds: L for lamp',
          'RF.K.2',
          [N('Lamp starts with l, l, l. Which also starts with l: leaf or sun?')],
          [
            o('Leaf.', [N('Yes! Lamp, leaf: l, l, l!')], true),
            o('Sun.', [N('Sun begins with s. Lamp and leaf begin with l!')]),
          ],
          'Heard the first sound l in lamp and leaf.',
        ),
      ],
      [
        ch('follow', 'Follow Mowgli in.', [N('The hut smells of smoke and milk and baby.')]),
        ch('wait', 'Stay in the doorway.', [N('Grey Brother lies at your feet.')]),
      ],
    ),
    sc(
      'a24-15-lamp-done',
      [
        N('Messua gives Mowgli milk and a round loaf.'),
        N('She cuts it in two halves. Mowgli eats one half.'),
        N('A baby sleeps on a mat, with one fist in the air.'),
      ],
      [
        ask(
          1,
          'maths',
          'halves: one of two equal pieces is left',
          '1.G.A.3',
          [
            N(
              'Messua cuts the loaf into two equal halves. Mowgli eats one. How many halves are left?',
            ),
          ],
          [
            o('One.', [N('Yes! One half is left.')], true),
            o('Four.', [N('There were only two halves. One is left.')]),
          ],
          'Understood that when a loaf is cut into two halves and one is eaten, one half is left.',
        ),
      ],
    ),
    sc(
      'a24-15-complete',
      [
        N('Mowgli eats everything. Then he falls asleep on her floor.'),
        N('Messua covers him with a blanket. She sits beside him, mending.'),
        N('Grey Brother lies by the door. Your Nubbin lies with him.'),
        N('You sit on the step in the sun.'),
      ],
      [
        notice(
          2,
          'sel',
          'being near someone is a way of caring',
          'CASEL: Relationship skills',
          [
            ME('He does not need me to say anything.', 'soft'),
            ME('Sitting quietly beside someone says: I care.'),
          ],
          'Heard that sitting quietly beside someone is a way of showing care.',
        ),
      ],
    ),
  ],
);

// ================================================================== A24-16 Man Goes to Man
const A16: EduQuest = quest(
  'a24-16',
  'Man Goes to Man',
  {
    'a24-16-s1': {
      goal: 'Go back with Mowgli to the Council Rock.',
      hint: 'Baloo and Kaa are waiting. They know already.',
    },
    'a24-16-s2': {
      goal: 'Wait at the Council Rock for Bagheera.',
      hint: 'He will come. Panthers are always last, on purpose.',
    },
    'a24-16-s3': {
      goal: 'Do what Mowgli asked of you.',
      hint: 'He asked you one thing. Do that.',
    },
  },
  [
    sc(
      'a24-16-rock',
      [
        N('You come to the Council Rock before dawn. Baloo is there, very old.'),
        N('Kaa is coiled round the rock, three times.'),
        BL('Cub, we know. We have known since spring.', 'soft'),
        MG('I want to go. But I do not want to go. Both.', 'sad'),
        KA('People belong with people in the end. But the jungle is always your home too.'),
        BL('Make your own trail, cub. We will still be here.', 'soft'),
      ],
      [
        ask(
          1,
          'maths',
          'count the three coils',
          'K.CC.B.5',
          [N('Kaa is coiled round the rock. How many times: three, or ten?')],
          [
            o('Three.', [N('Yes! One, two, three coils.')], true),
            o('Ten.', [N('Let us count: one, two, three. Three coils.')]),
          ],
          'Counted three coils, one number for each.',
        ),
      ],
      [
        ch('baloo', 'Go and sit by Baloo.', [
          BL('Is that the guest? Your voice has changed.', 'happy'),
        ]),
        ch('kaa', 'Thank Kaa for the old city.', [
          KA('It was nothing. A dance. A wall. I liked the wall.', 'happy'),
        ]),
      ],
    ),
    sc(
      'a24-16-rock-done',
      [
        MG('Where is Bagheera? I cannot go without him.', 'sad'),
        N('Far down the hill, something moves in the bushes.'),
        BL('A panther is silent when he wants to be. If you hear him, he wants us to.'),
      ],
      [
        ask(
          2,
          'science',
          'cats have soft paws and walk quietly',
          'K-LS1-1',
          [N('Bagheera walks very quietly. Are a cat’s paws soft, or hard like rock?')],
          [
            o('Soft.', [N('Yes! Soft paws, no sound. Pad, pad, pad.')], true),
            o('Hard like rock.', [N('Cat paws are soft, so they walk quietly.')]),
          ],
          'Learned that cats have soft paw pads that help them walk quietly.',
        ),
      ],
    ),
    sc(
      'a24-16-bagheera',
      [
        N('Bagheera comes up the hill at a trot.'),
        BG('Long ago I paid a bull for you. Today I paid another.', 'think'),
        BG('The debt is all done. You go free.'),
        MG('Bagheera. I will come and see you.', 'sad'),
        BG('Do not come back for us. Come back for yourself, if you need to.', 'soft'),
        N('He licks Mowgli’s feet, once. Then he turns away.'),
        BG('Good luck on your new road. Never forget that Bagheera loved you.', 'soft'),
        N('Mowgli stands with his hands open, as if he has dropped something.'),
        MG('Guest, say the Words with me. One more time.', 'sad'),
        Y('You and I are family, all of us, under the same sky.'),
      ],
      [
        ask(
          7,
          'sel',
          'saying goodbye kindly: say what you feel and wish them well',
          'CASEL: Relationship skills',
          [N('Bagheera says goodbye. What can we say when we say goodbye to a friend?')],
          [
            o('“I will miss you. Good luck!”', [N('Yes! A kind goodbye says what we feel.')], true),
            o('Nothing at all.', [N('Saying something kind is better.')]),
          ],
          'Practised a kind goodbye: saying what you feel and wishing a friend well.',
        ),
      ],
    ),
    sc(
      'a24-16-bagheera-done',
      [
        N('Mowgli looks at you for a long time.'),
        N('He puts his hand on your Nubbin’s head.'),
        MG('Will you walk the first mile with me?', 'soft'),
        N('Mowgli, Grey Brother and three wolves: that is a team.'),
      ],
      [
        ask(
          3,
          'maths',
          'add: Mowgli + 4 wolves = 5',
          'K.OA.A.2',
          [N('Mowgli and four wolf brothers go together. How many travellers is that?')],
          [
            o('5.', [N('Yes! One and four makes five.')], true),
            o('4.', [N('Do not forget Mowgli! One and four makes five.')]),
          ],
          'Added 1 and 4 to make 5 travellers.',
        ),
      ],
    ),
    sc(
      'a24-16-trail',
      [
        N('You walk the first mile with Mowgli, down off the hills.'),
        N('Grey Brother and three wolves run beside you, very quiet.'),
        GB('The jungle is not shut. We will be his brothers always.', 'happy'),
        N('Your Nubbin trots in the middle. It still thinks it is a wolf.'),
        MG('Here is the mile. The stone with the moss.', 'soft'),
        N('He does not make a speech. He just looks at you and nods.'),
      ],
      [
        ask(
          4,
          'social-studies',
          'a landmark helps us find a place',
          'D2.Geo.2.K-2',
          [
            N(
              'Mowgli says: “The stone with the moss.” What helps us find a place: a big stone, or nothing?',
            ),
          ],
          [
            o('A big stone we can see.', [N('Yes! A landmark helps us find a place.')], true),
            o('Nothing.', [N('A stone or a tree we can see helps us find the way.')]),
          ],
          'Learned that a landmark, such as a stone or a tree, helps us find the way.',
        ),
        ask(
          5,
          'literacy',
          'rhymes: trail and snail',
          'RF.K.2',
          [GB('Trail. Trail. What rhymes with trail: snail, or sun?')],
          [
            o('Snail.', [GB('Yes! Trail, snail: they rhyme!', 'happy')], true),
            o('Sun.', [GB('Trail, snail! They end the same.')]),
          ],
          'Found a word that rhymes with trail.',
        ),
      ],
      [
        ch('hunting', 'Tell him: safe travels.', [
          MG('Safe travels, guest. Safe travels, little wolf.', 'happy'),
        ]),
        ch('hug', 'Hug him.', [
          N('He does not know how to hug. He bumps his head on your shoulder.'),
        ]),
      ],
    ),
    sc(
      'a24-16-trail-done',
      [
        N('He walks on up the trail with the four wolves.'),
        N('He does not look back. That is how you know he will be all right.'),
        N('Your Nubbin sits on the mossy stone. You sit with it.'),
      ],
      [
        ask(
          2,
          'science',
          'wolves find a trail with their noses',
          'ELOF: Scientific Reasoning',
          [
            N(
              'The wolves follow the trail. What do wolves use to follow a trail: their noses, or their toes?',
            ),
          ],
          [
            o('Their noses.', [N('Yes! Wolves have super sniffy noses.')], true),
            o('Their toes.', [N('Wolves sniff! Their noses are very good.')]),
          ],
          'Learned that a wolf follows a trail with its excellent sense of smell.',
        ),
      ],
    ),
    sc(
      'a24-16-complete',
      [
        N('The last thing you see is the trail going north in the sun.'),
        N('Far behind, the Council Rock sits empty, and it does not mind.'),
        N('Your Nubbin looks back once, like a wolf. Then it trots on.'),
        N('The page goes soft. It is your own kitchen, and the book is on the table.'),
        N('Tucked in the back is a plank, carved by somebody patient.'),
      ],
      [
        notice(
          2,
          'sel',
          'you can belong in more than one place',
          'CASEL: Social awareness',
          [
            N('Mowgli lives with people now. The jungle is still home to him.'),
            N('You can love more than one home.'),
          ],
          'Heard that we can belong in more than one place and love more than one home.',
        ),
      ],
    ),
  ],
);

// ================================================================== A24-17 The White Seal
const A17: EduQuest = quest(
  'a24-17',
  'The White Seal',
  {
    'a24-17-s1': {
      goal: 'Turn the page and step onto the seals’ beach.',
      hint: 'Keep to the rocks at the top. The big seals are busy.',
    },
    'a24-17-s2': {
      goal: 'Paddle in the surf while Kotick learns to swim.',
      hint: 'Stay in the shallows.',
    },
    'a24-17-s3': {
      goal: 'Follow Kotick up the beach, and turn back with him.',
      hint: 'Stay with Kotick. When he turns away, turn with him.',
    },
  },
  [
    sc(
      'a24-17-beach',
      [
        N('The jungle page has a last leaf folded in. The air goes cold.'),
        N('This is a cold island, far in the north. Unangax̂ families live here.'),
        N('Below you is a beach, roaring with thousands of seals!'),
        N('The big bulls shove each other for the best rocks. Nobody is hurt.'),
        N('A mother seal nuzzles her new pup. Her name is Matkah.'),
        MK('Oh, look! Our baby is white! White as sea-foam!', 'shock'),
        N('The father seal snorts. “Nonsense. There has never been a white seal.”'),
        MK('There is one now.'),
      ],
      [
        ask(
          3,
          'social-studies',
          'a cold sea is far north',
          'D2.Geo.2.K-2',
          [N('The seals live in a cold sea, far north. Is it cold there, or hot?')],
          [
            o('Cold.', [N('Yes! The northern sea is cold. Seals have thick fur.')], true),
            o('Hot.', [N('It is very cold in the north.')]),
          ],
          'Learned that the Pribilof Islands, in the Bering Sea, are far north and cold, and are home to these seals and to Unangax̂ families.',
        ),
      ],
      [
        ch('look', 'Creep closer to look at the pup.', [
          N('He is pale as sea-foam, with soft blue eyes.'),
        ]),
        ch('nubbin', 'Keep your Nubbin back from the big seals.', [
          N('A seal the size of a wardrobe flops past. Your Nubbin peeks.'),
        ]),
      ],
    ),
    sc(
      'a24-17-beach-done',
      [
        N('They name the pup Kotick.'),
        N('The father seal is called Sea Catch.'),
        N('He crawls to your Nubbin. They look at each other.'),
        N('Your Nubbin decides it is a seal as well.'),
      ],
      [
        ask(
          3,
          'science',
          'young are like, but not the same as, their parents',
          '1-LS3-1',
          [
            N(
              'Most seal pups are dark. Kotick is different. What colour is Kotick: white, or green?',
            ),
          ],
          [
            o('White.', [N('Yes! Kotick is white, and very special.')], true),
            o('Green.', [N('Not green! Kotick is white as sea-foam.')]),
          ],
          'Noticed that young animals can look different from the others, like a white seal pup.',
        ),
      ],
    ),
    sc(
      'a24-17-surf',
      [
        N('Seal pups cannot swim when they are born. They must learn.'),
        MK('In you go. Ride the waves. That is all swimming is.', 'happy'),
        N('A wave puts Kotick back on the beach, upside down!'),
        N('He tries again. And again. Three tries!'),
        N('Your Nubbin paddles beside him.'),
        KO('I am swimming! Look, Mother!', 'happy'),
      ],
      [
        doit(
          3,
          'maths',
          'count the tries to 3',
          'K.CC.B.5',
          'edu:count:waves:3',
          [N('Count the waves with Kotick. One, two, three. Three tries, and he swims!')],
          'Counted three tries, one number for each.',
        ),
      ],
      [
        ch('cheer', 'Cheer for Kotick.', [
          N('Kotick does a roll and gets a mouthful of sea. He splutters, pleased.'),
        ]),
        ch('warm', 'Wrap your Nubbin in your coat.', [
          N('It shivers, then falls asleep, smelling of seaweed.'),
        ]),
      ],
    ),
    sc(
      'a24-17-surf-done',
      [
        N('By autumn Kotick swims like a seal born to it.'),
        KO('The young ones are going up the beach. I want to see.', 'think'),
        N('Splash! Splosh! The waves go splash on the sand.'),
      ],
      [
        doit(
          2,
          'literacy',
          'a sound word: splash',
          'RF.K.2',
          'edu:say:sound-word:splash',
          [N('The waves go splash! Say it with me. Splash, splash, splash!')],
          'Said the sound word “splash” in a repeated line.',
        ),
      ],
    ),
    sc(
      'a24-17-drove',
      [
        N('Men from the village walk young seals up the beach.'),
        N('Men take some young seals away, for their warm fur.'),
        N('Kotick watches. He does not like it one bit.'),
        N('He turns away. You turn with him. The page turns too.'),
        KO('I do not like it. I am so sad. I am cross.', 'shock'),
        MK('It has been so for a long time, Kotick.', 'sad'),
        KO('I will find a beach where nobody takes seals away.', 'angry'),
      ],
      [
        ask(
          6,
          'sel',
          'when we feel sad, we can tell a friend',
          'ELOF: Social and Emotional Development',
          [N('Kotick is sad. Who can we tell when we feel sad?')],
          [
            o('A friend.', [N('Yes! Telling a friend helps.')], true),
            o('Nobody.', [N('Telling a friend or a grown-up helps.')]),
          ],
          'Talked about telling a friend when we feel sad. Grown-up note: in the story the village men did this hard work for a company far away, because they were made to.',
        ),
      ],
      [
        ch('believe', 'Tell Kotick you believe him.', [KO('Do you? You are the first.', 'soft')]),
        ch('sit', 'Sit beside him on the cold beach.', [
          N('You sit beside him. Soon he stops shaking, and looks to the sea.'),
        ]),
      ],
    ),
    sc(
      'a24-17-drove-done',
      [
        KO('I will look every summer and winter until I find it.', 'angry'),
        N('Your Nubbin sits up and looks to sea, as if to help.'),
        N('Today there is a rule that keeps these seals safe.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'a rule helps keep animals safe',
          'D2.Civ.8.K-2',
          [N('Today there is a rule to keep fur seals safe. What is a rule?')],
          [
            o(
              'Something people agree to follow.',
              [N('Yes! A rule helps keep animals safe.')],
              true,
            ),
            o('A kind of fish.', [N('A rule is something we agree to do.')]),
          ],
          'Learned that a rule is something people agree to follow, and that rules help keep animals safe.',
        ),
      ],
    ),
    sc(
      'a24-17-complete',
      [
        N('That night Kotick swims out past the end of the beach.'),
        N('He is a white speck in the dark water.'),
        MK('He is white, and different, and he will not be told.', 'sad'),
        SC('He gets that from me.'),
        MK('He gets it from both of us. Go to sleep.', 'soft'),
      ],
      [
        ask(
          2,
          'science',
          'seals live and swim in the sea',
          'K-ESS3-1',
          [N('Kotick swims off into the sea. Which animal swims: a seal, or a cat?')],
          [
            o('A seal.', [N('Yes! Seals are made for swimming.')], true),
            o('A cat.', [N('Most cats do not swim much. Seals do!')]),
          ],
          'Learned that seals live and swim in the sea.',
        ),
      ],
    ),
  ],
);

// ================================================================== A24-18 Where No Man Comes
const A18: EduQuest = quest(
  'a24-18',
  'The Hidden Beaches',
  {
    'a24-18-s1': {
      goal: 'Search the northern sea with Kotick.',
      hint: 'Ask everyone. The old sea lion first. The walrus is grumpy.',
    },
    'a24-18-s2': {
      goal: 'Follow the Sea Cows through the dark water.',
      hint: 'Stay close behind Kotick. This page lets you breathe.',
    },
    'a24-18-s3': {
      goal: 'Go home with Kotick and watch him bring the seals.',
      hint: 'Stay at the top of the beach. Nobody gets hurt.',
    },
  },
  [
    sc(
      'a24-18-search',
      [
        N('Kotick searches for a long time, through fog and ice.'),
        KO('Old sea lion, is there a beach where men never come?', 'think'),
        SL('I do not know. Ask Sea Vitch. He is ruder than me.'),
        N('Sea Vitch the walrus is asleep. He has two big tusks.'),
        SV('Go away! I was asleep. Shoo!', 'angry'),
        N('Gulls squawk from the rocks. They never liked Sea Vitch.'),
        N('The gulls sing: “Clam-crack! Clam-crack! Sea Vitch is a clam-crack!”'),
        N('Say it with the gulls: clam-crack, clam-crack!'),
        SV('I LIKE clams.'),
        SV('Ask the Sea Cows, then. If they are still alive.'),
      ],
      [
        ask(
          9,
          'literacy',
          'first sounds: S for sea, seal and sun',
          'RF.K.2',
          [N('Sea Vitch begins with a sound: s, s, s. Which begins like sea: seal or boat?')],
          [
            o('Seal.', [N('Yes! Sea, seal: s, s, s!')], true),
            o('Boat.', [N('Boat begins with b. Sea and seal begin with s!')]),
          ],
          'Heard the first sound s in sea and seal.',
        ),
      ],
      [
        ch('sorry', 'Say sorry to Sea Vitch for the noise.', [
          SV('Manners. From a land-thing. Still go away.', 'think'),
        ]),
        ch('gulls', 'Shoo the gulls away.', [
          N('They fly up squawking, then land again two feet away.'),
        ]),
      ],
    ),
    sc(
      'a24-18-search-done',
      [
        KO('The Sea Cows. Nobody has seen one.', 'think'),
        N('Five summers and five winters go by. Kotick grows big and strong.'),
        N('He is still as white as the first day.'),
      ],
      [
        doit(
          1,
          'maths',
          'count to 5',
          'K.CC.B.5',
          'edu:count:years:5',
          [N('Count the years Kotick looked. One, two, three, four, five. Five years!')],
          'Counted five years aloud.',
        ),
      ],
    ),
    sc(
      'a24-18-cows',
      [
        N('At last, far to the west, Kotick finds them.'),
        N('Huge, slow, dark shapes, eating seaweed. They are Sea Cows.'),
        KO('Excuse me. Is there a safe beach?', 'think'),
        N('The Sea Cows say nothing. They begin to swim north.'),
        N('They dive into a dark tunnel in the cliff. You follow.'),
        N('Then light! Green and gold. A quiet bay with long beaches.'),
        N('Real sea cows lived long ago. People hunted them, and now they are all gone for ever.'),
        N('That is sad. We can look after animals that are still here.'),
      ],
      [
        ask(
          7,
          'science',
          'we can look after animals and their homes',
          'K-ESS3-3',
          [N('What can we do to keep animals safe?')],
          [
            o(
              'Look after them and their homes.',
              [N('Yes! We keep animals safe by looking after their homes.')],
              true,
            ),
            o('Nothing. They do it alone.', [
              N('We can help! We look after them and their homes.'),
            ]),
          ],
          'Learned plainly that sea cows were hunted until none were left, and that we can look after animals today.',
        ),
      ],
      [
        ch('look', 'Look round the bay.', [N('There are quiet beaches, with cliffs all round.')]),
        ch('thank', 'Thank the Sea Cows.', [N('They are already going. One looks back, once.')]),
      ],
    ),
    sc(
      'a24-18-cows-done',
      [
        KO('This is it! Nobody can come here but seals!', 'happy'),
        N('Kotick hauls out on the beach in the sun.'),
        N('Your Nubbin lies down beside him.'),
        N('The Sea Cows never said a word, but they showed the way.'),
      ],
      [
        ask(
          3,
          'literacy',
          'we can help without words',
          'ELOF: Language and Communication',
          [N('The Sea Cows helped without words. How can you help without talking?')],
          [
            o(
              'Show the way, or give a hug.',
              [N('Yes! We can help with a hug, or by showing.')],
              true,
            ),
            o('You cannot.', [N('You can! Showing the way and hugging help a lot.')]),
          ],
          'Talked about helping without words, as the Sea Cows did.',
        ),
      ],
    ),
    sc(
      'a24-18-home',
      [
        N('Kotick swims home and tells the seals about the beaches.'),
        N('They laugh at him. A white seal, with stories!'),
        SE('Hidden beaches! Go and lie in the sun!', 'happy'),
        N('Kotick pushes his chest against the biggest seal.'),
        N('He shoves and roars, all along the beach. Nobody is hurt.'),
        SC('That is my son!', 'happy'),
        MK('He gets that from you.'),
        SC('He does!', 'happy'),
        KO('Who is coming with me?', 'angry'),
      ],
      [
        ask(
          8,
          'sel',
          'keeping on with a good idea',
          'ELOF: Social and Emotional Development',
          [N('The seals laughed at Kotick. Did he give up?')],
          [
            o('No, he kept going.', [N('Yes! Kotick kept going, and his dad was proud.')], true),
            o('Yes.', [N('He did not give up! He asked, “Who is coming with me?”')]),
          ],
          'Talked about keeping on with a good idea, even when others laugh, as Kotick did.',
        ),
      ],
      [
        ch('cheer', 'Cheer from the top of the beach.', [
          N('Your Nubbin cheers like a kettle. A seal kettle!'),
        ]),
        ch('matkah', 'Look for Matkah.', [
          MK('He was always going to do it. I told his father.', 'happy'),
        ]),
      ],
    ),
    sc(
      'a24-18-home-done',
      [
        N('The seals stop laughing. They look at the white seal.'),
        N('Then, ten at a time, they follow him out to sea.'),
        N('Count by tens with the seals: ten, twenty, thirty.'),
      ],
      [
        doit(
          2,
          'maths',
          'count by tens to 30',
          'K.CC.A.1',
          'edu:count:by-tens:30',
          [N('Count by tens with the seals. Ten, twenty, thirty! Thirty seals!')],
          'Counted by tens to 30.',
        ),
      ],
    ),
    sc(
      'a24-18-complete',
      [
        N('You stand on the empty beach and watch the herd go.'),
        N('One white seal swims at the front.'),
        N('Your Nubbin watches until the white speck is gone.'),
        N('The page goes soft. You are back in your kitchen.'),
        N('A small white seal sits by the pond, looking pleased.'),
        N('Kotick took them to the safe beaches. They live there still.'),
      ],
      [
        ask(
          5,
          'social-studies',
          'protected places keep animals safe',
          'D2.Civ.8.K-2',
          [
            N(
              'Some places are kept safe by rules, for wild animals to live. What do people make to keep animals safe?',
            ),
          ],
          [
            o('Rules and safe places.', [N('Yes! Rules and safe places help animals.')], true),
            o('Nothing.', [N('People can make rules and safe places.')]),
          ],
          'Learned that rules and protected places help keep wild animals safe.',
        ),
      ],
    ),
  ],
);

// ================================================================== Variant scenes
/**
 * One EduScene per ATLAS_A24_VARIANTS entry. Each has the same lesson domain as the scene it
 * replaces (the margin note, which plays after a24-17-complete, is a feelings lesson), so the
 * order of domains holds on every path.
 */
export const EDU_A24_SPROUT_VARIANTS: EduScene[] = [
  // Fern’s memory (s8Reunited): replaces a24-02-council-done
  sc(
    'a24-02-council-done-fern',
    [
      N('The wolves come, one by one, to look at Mowgli.'),
      N('A soft voice comes from the edge of the page. It is Fern, remembering.'),
      FE('That is what Bramble did for the strays.', 'soft'),
      AK('He is the pack’s now. Take him home.'),
    ],
    [
      ask(
        2,
        'literacy',
        'naming a character from the story',
        'RL.K.3',
        [
          N(
            'Fern remembers someone who helped little strays. Who did Fern remember: Bramble, or a bear?',
          ),
        ],
        [
          o('Bramble.', [N('Yes! Fern remembers Bramble, who helped strays.')], true),
          o('A bear.', [N('It was Bramble. Fern remembers her.')]),
        ],
        'Named the character, Bramble, that Fern remembers.',
      ),
    ],
  ),
  // stones = messua: replaces a24-10-road-done
  sc(
    'a24-10-road-done-messua',
    [
      N('Mowgli goes into the trees with Akela and Grey Brother.'),
      N('Your Nubbin leans against Messua’s leg.'),
      ME('You stayed. Come in. I will make something hot.', 'sad'),
      N('An owl flies over the hut. It makes no sound at all.'),
    ],
    [
      ask(
        3,
        'science',
        'owls have soft feathers and fly quietly',
        'K-LS1-1',
        [N('The owl flew without a sound. Are an owl’s feathers soft, or hard like stones?')],
        [
          o('Soft.', [N('Yes! Soft feathers, no sound. Whoosh, quiet!')], true),
          o('Hard like stones.', [N('Owl feathers are very soft. That is why they fly quietly.')]),
        ],
        'Learned that owls have soft feathers that help them fly without a sound.',
      ),
    ],
  ),
  // stones = messua: replaces a24-10-complete
  sc(
    'a24-10-complete-messua',
    [
      N('You stay with Messua a while.'),
      N('You carry her water from the well. Two pails, then two more.'),
      ME('He was my son for a year. That is more than I hoped.', 'soft'),
      N('At moonrise, Grey Brother scratches at the door. Mowgli wants you.'),
      ME('Go on. Come back after. The door is on the latch.', 'soft'),
    ],
    [
      ask(
        1,
        'maths',
        'add: 2 pails + 2 pails = 4',
        'K.OA.A.1',
        [N('You carry two pails, and then two more. How many pails is that?')],
        [
          o('4.', [N('Yes! Two and two makes four.')], true),
          o('2.', [N('Count them all: one, two, three, four.')]),
        ],
        'Added 2 and 2 to make 4 pails.',
      ),
    ],
  ),
  // stones = messua: replaces a24-13-hut
  sc(
    'a24-13-hut-messua',
    [
      N('It has been a quiet season in Messua’s hut.'),
      N('One evening, men with torches tie the hut door shut with rope.'),
      N('Messua and her husband are inside. Nobody knows what a guest is.'),
      ME('Do not. Stay out of it. I am worried for you.', 'shock'),
      N('You wait until the guard falls asleep. Then you start on the knots on the door.'),
      N('Your Nubbin helps. It makes it worse, then better.'),
      MG('You did it! Good. Come on, all of you.', 'happy'),
    ],
    [
      ask(
        3,
        'sel',
        'we can care about others even when we are scared',
        'ELOF: Social and Emotional Development',
        [N('Messua is scared, but she worries about you. Who does she worry about?')],
        [
          o('You.', [N('Yes! She cares about you, even when she is scared.')], true),
          o('Nobody.', [N('She worries about you. That is very kind.')]),
        ],
        'Noticed that Messua cares about the Keeper even when she is scared herself.',
      ),
    ],
    [
      ch('watch', 'Keep an eye on the sleeping guard.', [N('He snores on. One dog barks, once.')]),
      ch('nubbin', 'Lift your Nubbin before it chews the rope.', [
        N('It has a bit of rope in its mouth, and looks proud.'),
      ]),
    ],
  ),
  // stones = messua: replaces a24-13-hut-done
  sc(
    'a24-13-hut-done-messua',
    [
      N('The back door opens without a sound.'),
      N('Messua leans on you. Her husband leans on Mowgli.'),
      ME('My son. And you. I hoped and hoped.', 'sad'),
    ],
    [
      ask(
        1,
        'literacy',
        'who is in the scene',
        'RL.K.3',
        [N('Messua says, “My son, and you.” Who is she glad to see: Mowgli and you, or nobody?')],
        [
          o('Mowgli and you.', [N('Yes! She is glad to see you both.')], true),
          o('Nobody.', [N('She is very glad to see you both.')]),
        ],
        'Named the characters in a scene and who they are glad to see.',
      ),
    ],
  ),
  // stones = messua: replaces a24-13-road
  sc(
    'a24-13-road-messua',
    [
      MG('Guest, take them to the road. Walk towards the sunrise.', 'think'),
      MG('Nobody there knows them. The law there will keep them safe.'),
      N('You walk Messua and her husband through the dark.'),
      N('In the grass, there is a soft sound, like something grey keeping pace.'),
      ME('You stayed with me. I will not forget it.', 'soft'),
      ME('Go and find him. Tell him we are safe.', 'soft'),
    ],
    [
      ask(
        1,
        'social-studies',
        'the sun comes up in the east',
        'D2.Geo.2.K-2',
        [N('You walk towards the sunrise. Where does the sun come up: east, or under the ground?')],
        [
          o('East.', [N('Yes! The sun comes up in the east.')], true),
          o('Under the ground.', [N('The sun comes up in the east.')]),
        ],
        'Learned that the Sun comes up in the east.',
      ),
    ],
    [
      ch('promise', 'Promise you will.', [ME('Good. And you eat properly too.', 'happy')]),
      ch('nubbin', 'Let your Nubbin say goodbye.', [
        N('Your Nubbin hugs her ankle. She kisses its head.'),
      ]),
    ],
  ),
  // stones = messua: replaces a24-13-road-done
  sc(
    'a24-13-road-done-messua',
    [
      N('You watch them go. Two small shapes on the road.'),
      N('The grass is wet with dew. There was no rain.'),
      N('She turns at the bend and lifts her hand. You lift yours.'),
    ],
    [
      ask(
        1,
        'science',
        'dew is tiny drops of water on the grass in the morning',
        'K-ESS2-1',
        [
          N(
            'The grass is wet in the morning. Tiny drops sit on it. They are called dew. What is dew made of?',
          ),
        ],
        [
          o('Water.', [N('Yes! Dew is tiny drops of water.')], true),
          o('Sugar.', [N('Dew is water, not sugar.')]),
        ],
        'Learned that dew is tiny drops of water that form on grass in the cool of the night.',
      ),
    ],
  ),
  // stones = mowgli: replaces a24-15-lamp
  sc(
    'a24-15-lamp-mowgli',
    [
      N('Messua looks at you over Mowgli’s head.'),
      ME('Were you here before? With… feathers?', 'think'),
      N('Your Nubbin drops one feather on her floor.'),
      ME('Never mind. Sit down and eat.', 'soft'),
      ME('Are you hungry too? Come in. You came with my son.', 'soft'),
      N('You sit by the door and eat her bread.'),
    ],
    [
      ask(
        4,
        'literacy',
        'a kind character',
        'RL.K.3',
        [N('Messua gives you bread, even though she cannot remember you. Is Messua kind, or cross?')],
        [
          o('Kind.', [N('Yes! She is kind to everyone who comes in.')], true),
          o('Cross.', [N('She feeds you! That is kind.')]),
        ],
        'Described a character as kind from what she does.',
      ),
    ],
  ),
  // stones = messua: replaces a24-15-lamp
  sc(
    'a24-15-lamp-messua',
    [
      N('Messua sees you. Her face lights up like a lamp.'),
      ME('You! You stayed with me when nobody else would.', 'happy'),
      N('She lifts the sleeping baby into your arms.'),
      ME('Hold him. He likes being held.', 'happy'),
      N('The baby opens his eyes. He looks at your Nubbin.'),
    ],
    [
      ask(
        2,
        'literacy',
        'who a character trusts',
        'RL.K.3',
        [N('Messua lets you hold her baby. Who does she trust: you, or nobody?')],
        [
          o('You.', [N('Yes! She trusts you, because you stayed.')], true),
          o('Nobody.', [N('She trusts you. You stayed with her.')]),
        ],
        'Named who a character trusts, and why: the Keeper stayed with her.',
      ),
    ],
  ),
  // stones = messua: replaces a24-16-bagheera-done
  sc(
    'a24-16-bagheera-done-messua',
    [
      N('Mowgli looks at you for a long time.'),
      MG('You stayed with Messua when I could not. Will you look in on her?', 'soft'),
      N('Mowgli, Grey Brother and three wolves are going north. That is a team.'),
    ],
    [
      ask(
        2,
        'maths',
        'add: Mowgli + 4 wolves = 5',
        'K.OA.A.2',
        [N('Mowgli and four wolves go north together. How many travellers is that?')],
        [
          o('5.', [N('Yes! One and four makes five.')], true),
          o('4.', [N('Do not forget Mowgli! One and four makes five.')]),
        ],
        'Added 1 and 4 to make 5 travellers.',
      ),
    ],
  ),
  // stones = messua: replaces a24-16-trail
  sc(
    'a24-16-trail-messua',
    [
      N('You walk with Mowgli to a fork in the trail.'),
      MG('This way for me. That way for you: the hut with the lamp.', 'soft'),
      N('He goes off along the ridge with the wolves. He does not look back.'),
      N('You take the path through the fields. The lamp is lit in the window.'),
      ME('Is he coming? Tell me he is coming.', 'think'),
    ],
    [
      ask(
        1,
        'social-studies',
        'a landmark helps us pick the right path',
        'D2.Geo.2.K-2',
        [N('Mowgli says: look for the hut with the lamp. Why is a lit lamp easy to find?')],
        [
          o(
            'We can see its light from far away.',
            [N('Yes! A lamp is a landmark. It shows the way.')],
            true,
          ),
          o('It is very, very small.', [N('It is the light that helps. A lamp shows the way.')]),
        ],
        'Learned that a landmark, such as a lit lamp, helps us find the right path.',
      ),
    ],
    [
      ch('yes', 'Tell her he is coming.', [ME('Then I will make all the bread!', 'happy')]),
      ch('baby', 'Ask after the baby first.', [
        ME('Asleep, for once. Come and see. Quietly.', 'soft'),
      ]),
    ],
  ),
  // stones = messua: replaces a24-16-trail-done
  sc(
    'a24-16-trail-done-messua',
    [
      N('Inside, the baby is asleep on his mat.'),
      N('Babies sleep a lot, to grow big and strong.'),
      N('Your Nubbin lies down beside him, very carefully.'),
    ],
    [
      ask(
        1,
        'science',
        'babies sleep a lot to grow',
        '1-LS1-2',
        [N('The baby sleeps and sleeps. Why do babies sleep so much? To grow big, or to hide?')],
        [
          o('To grow big.', [N('Yes! Sleep helps babies grow.')], true),
          o('To hide.', [N('Babies sleep to grow big and strong.')]),
        ],
        'Learned that babies sleep a lot because they are growing.',
      ),
    ],
  ),
  // stones = messua: replaces a24-16-complete
  sc(
    'a24-16-complete-messua',
    [
      N('The last thing you see is the hut in the evening.'),
      N('The lamp is lit. The baby is asleep inside.'),
      N('Somewhere up the trail, Mowgli walks towards it with four wolves.'),
      N('The page goes soft, like lamplight. You are back in your kitchen.'),
      N('Tucked in the back is a plank, carved by somebody patient.'),
    ],
    [
      notice(
        1,
        'sel',
        'a lit lamp means someone is waiting for you',
        'CASEL: Social awareness',
        [
          ME('A lit lamp in a window says: someone is waiting for you here.', 'soft'),
          ME('That is what a home is.'),
        ],
        'Heard that a lit lamp, and someone waiting, is a way of belonging.',
      ),
    ],
  ),
  // s24Done: plays once after a24-17-complete
  sc(
    'a24-17-margin-hazel',
    [
      N('Nova’s book lies open at the seals’ beach.'),
      N('Low in the margin, there is a pencil note. You know the hand.'),
      N('“Safe beach first. Then a well one.”', 'soft'),
      N('“He found both.”', 'soft'),
      N('And under it, one letter: H.'),
      N('Your Nubbin puts its nose on the white seal, and on the H.'),
    ],
    [
      ask(
        4,
        'sel',
        'feeling safe: what makes us feel safe',
        'CASEL: Self-awareness',
        [N('Hazel wrote about a safe beach. What makes you feel safe: a hug, or a roar?')],
        [
          o('A hug.', [N('Yes! A hug from someone who loves us makes us feel safe.')], true),
          o('A roar.', [N('A hug from someone who loves us makes us feel safe.')]),
        ],
        'Talked about what makes us feel safe, using Hazel’s margin note as a prompt.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A24_SPROUT: EduQuest[] = [
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
];

/** Every `edu:` check string used by the lessons above. */
export const CHECKS: string[] = [
  'edu:breathe:slow:3',
  'edu:clap:syllables:akela',
  'edu:clap:syllables:baloo',
  'edu:count:buffalo:5',
  'edu:count:by-tens:30',
  'edu:count:hours:4',
  'edu:count:runners:4',
  'edu:count:seasons:3',
  'edu:count:steps:5',
  'edu:count:sticks:3',
  'edu:count:waves:3',
  'edu:count:years:5',
  'edu:feel:throat:hum',
  'edu:say:sound-word:crackle',
  'edu:say:sound-word:splash',
];
