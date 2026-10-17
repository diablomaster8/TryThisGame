/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Atlas page A23,
 * Remember Who You Are (a savanna page, Rafiki’s baobab and the Pride Lands).
 *
 * Source: atlas-a23.ts (ATLAS_A23 and A23_VARIANTS). One EduScene per original scene, id
 * `sprout:<original id>`, with every choice kept under its original id and `set` flag
 * (`a23-path`), so no `defaultChoice` is needed. See EDU-STYLE.md.
 *
 * Left out for this band: A23-8 The Gorge and A23-15 Home are audience `main` in the script and
 * have no Learning Grove version. A23-9 says plainly, once, that Simba’s father died, that it was
 * not Simba’s fault, and what helps when we are sad. The fall itself is never told, and nothing
 * is told of Scar’s end. Nothing is quoted from the film: Mufasa’s three famous lines are
 * replaced by original words. The Swahili is the outline’s list (karibu, polepole, twiga, asante,
 * nyota, mvua, simba) plus pole sana.
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
const RA = say('a23-rafiki');
const SI = say('a23-simba');
const NA = say('a23-nala');
const MU = say('a23-mufasa');
const SB = say('a23-sarabi');
const ZA = say('a23-zazu');
const SC = say('a23-scar');
const TI = say('a23-timon');
const PU = say('a23-pumbaa');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const words = (t: string) => t.trim().split(/\s+/).length;

/**
 * Keeps every line to 14 words or fewer and two sentences or fewer, as the sprout band requires: a long line is cut at
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

/** A notice lesson: a character shares one true thing. */
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

// ---------------------------------------------------------------- standards used often
const SE = 'ELOF: Social and Emotional Development';
const LANG = 'ELOF: Language and Communication';
const SCI = 'ELOF: Scientific Reasoning';
const PMP = 'ELOF: Perceptual, Motor, and Physical Development';

// ================================================================== A23-1 The Presentation
const Q1: EduQuest = quest(
  'a23-01',
  'The Presentation',
  {
    'a23-01-s1': {
      goal: 'Step into the page. Find Rafiki’s big baobab tree.',
      hint: 'Touch the red rock on the page. Then follow the path to the big tree.',
    },
    'a23-01-s2': {
      goal: 'Walk with Rafiki to the great rock.',
      hint: 'Stay close behind Rafiki’s stick. The animals will make way for him.',
    },
    'a23-01-s3': {
      goal: 'Watch Rafiki show the new cub from the top of the rock.',
      hint: 'Stand at the back with the gourd. Your Nubbin will want a better view.',
    },
  },
  [
    sc(
      'a23-01-page',
      [
        N('Nova’s atlas opens. A red rock stands over a golden plain.'),
        N('The sun comes up. It feels warm on your hands.'),
        N('Down in the dry grass grows a huge old tree. It is a baobab.'),
        N('An old mandrill sits in the tree. He has a white beard and a long stick.'),
        RA('Karibu! That means welcome.', 'happy'),
        RA('Say it with me. Ka-ri-bu!'),
        N('Your Nubbin climbs the tree. It sits in the fork.'),
        RA('Today a king shows his new baby to everyone. Will you help me carry gourds?'),
      ],
      [
        doit(
          5,
          'literacy',
          'clap the three parts of a word',
          'RF.K.2',
          'edu:clap:syllables:karibu',
          [N('(Clap each part of the word: ka, ri, bu. How many claps? Three!)')],
          'Clapped the three syllables of the Swahili word karibu (welcome).',
        ),
      ],
      {
        choices: [
          {
            id: 'gourd',
            label: 'Take the small gourd, carefully.',
            then: [RA('Carefully. Good.', 'happy')],
          },
          {
            id: 'nubbin',
            label: 'Ask what your Nubbin can carry.',
            then: [RA('Itself, today. That is plenty.', 'soft')],
          },
          {
            id: 'hurry',
            label: 'Say you must hurry.',
            then: [RA('Polepole. That means slowly.', 'think'), N('He will say it a lot.')],
          },
        ],
      },
    ),
    sc(
      'a23-01-page-done',
      [
        N('Rafiki swings down from the tree. He sets off across the grass.'),
        N('Your tummy bounces. You want to hurry after him!'),
        RA('Polepole. Slowly. The sun is not going anywhere.'),
        N('You slow down. Your Nubbin slows down too.'),
      ],
      [
        ask(
          1,
          'sel',
          'slowing down when we feel hurried',
          'CASEL: Self-management',
          [N('Your tummy bounces and you want to rush. What helps you slow down?')],
          [
            o(
              'Take a slow, deep breath',
              [RA('Yes. In slowly, out slowly. Polepole.', 'happy')],
              true,
            ),
            o('Stamp your feet', [
              RA('Stamping is fun, but breathing slowly works better.', 'soft'),
            ]),
            o('Run faster', [RA('Running makes the bounce bigger. Try a slow breath.', 'think')]),
          ],
          'Practised a calming strategy: breathing slowly when we feel rushed.',
        ),
      ],
    ),
    sc(
      'a23-01-gathering',
      [
        N('The whole plain walks to the big rock. Zebra, antelope and elephants.'),
        N('Giraffes walk by with their heads up high.'),
        RA('Twiga. That is giraffe. Say it!'),
        Y('Twiga!'),
        N('Zazu the hornbill flaps down. He is very important.'),
        ZA('Are you on the list? I keep the list.', 'think'),
        RA('They are with me, Zazu.'),
        ZA('Very well. Go up. Mind the king’s tail.'),
      ],
      [
        doit(
          1,
          'maths',
          'count four things',
          'K.CC.B.5',
          'edu:count:giraffes:4',
          [N('Four giraffes walk past. (Point and count: one, two, three, four.)')],
          'Counted four giraffes, matching each one to a number.',
        ),
      ],
      {
        choices: [
          {
            id: 'list',
            label: 'Ask to see the list.',
            then: [ZA('Certainly not. It is safe in my head.')],
          },
          {
            id: 'bow',
            label: 'Bow to Zazu.',
            then: [
              ZA('Oh! Somebody was raised properly.', 'happy'),
              N('He bows back. He nearly falls off his stone.'),
            ],
          },
          {
            id: 'nubbin',
            label: 'Let your Nubbin say hello.',
            then: [N('Your Nubbin waves. Zazu looks at it for a long time.')],
          },
        ],
      },
    ),
    sc(
      'a23-01-gathering-done',
      [
        N('The king comes down to meet Rafiki.'),
        N('The big lion and the old mandrill hug.'),
        MU('Rafiki. You came.'),
        RA('I always come.', 'happy'),
        N('Rafiki is a Swahili word. It means friend.'),
      ],
      [
        notice(
          1,
          'social-studies',
          'people greet each other in many ways',
          'D2.His.2.K-2',
          [
            N('Rafiki and the king hug hello. People say hello in many ways.'),
            N('A wave. A smile. A hug. Or a word like karibu.'),
          ],
          'Heard that people greet each other in different ways, including with the Swahili word karibu.',
        ),
      ],
    ),
    sc(
      'a23-01-presentation',
      [
        N('Sarabi, the lioness, moves her paws apart.'),
        N('A tiny cub lies between them. He is only three days old.'),
        SB('Gently. He is very new.', 'soft'),
        N('Rafiki draws a red line on the cub’s brow.'),
        N('He lifts the cub up high, for everyone to see.'),
        N('Your Nubbin climbs on your head to see.'),
        N('Down on the plain, the zebras stamp. The birds fly in a big wheel.'),
        N('Then the whole plain kneels.'),
      ],
      [
        ask(
          2,
          'science',
          'parents look after their young',
          '1-LS1-2',
          [N('Sarabi keeps her tiny cub close. What do mums and dads do for babies?')],
          [
            o(
              'Keep them safe, warm and fed',
              [N('Yes! Lion mums and dads, and Nubbin grown-ups, all do that.')],
              true,
            ),
            o('Leave them alone all day', [
              N('Tiny cubs cannot look after themselves. They need a grown-up close by.'),
            ]),
          ],
          'Learned that parents keep their young safe, warm and fed.',
        ),
      ],
      {
        choices: [
          {
            id: 'kneel',
            label: 'Kneel with the plain.',
            then: [N('You kneel on the warm stone. Your Nubbin kneels too.')],
          },
          {
            id: 'watch',
            label: 'Stay standing and watch the king.',
            then: [N('The king is looking at his son. He looks very proud.', 'soft')],
          },
        ],
      },
    ),
    sc(
      'a23-01-complete',
      [
        N('The cub goes back to his mum. He falls fast asleep.'),
        MU('His name is Simba. That is the Swahili word for lion.'),
        N('Simba. Say it slowly: sss-im-ba.'),
        RA('Now we have painting to do.'),
      ],
      [
        ask(
          2,
          'literacy',
          'hear the first sound of a word',
          'RF.K.2',
          [N('Simba starts with a sss sound. Which of these starts with sss too?')],
          [
            o('Sun', [N('Yes! Sss-sun and sss-Simba both start with sss.')], true),
            o('Moon', [N('Moon starts with mmm. Simba starts with sss. Try again: sss-sun!')]),
            o('Tree', [N('Tree starts with ttt. The sss word is sun.')]),
          ],
          'Matched words that begin with the same first sound (s).',
        ),
      ],
    ),
  ],
);

// ================================================================== A23-2 Rafiki’s Tree
const Q2: EduQuest = quest(
  'a23-02',
  'Rafiki’s Tree',
  {
    'a23-02-s1': {
      goal: 'Mix Rafiki’s paints: yellow earth and red fruit.',
      hint: 'Bring yellow earth from the dry river and ripe fruit from the tree. Grind them in the shell.',
    },
    'a23-02-s2': {
      goal: 'Hold the shell while Rafiki paints the cub on the tree wall.',
      hint: 'Stand still beside him with the paints. Your Nubbin will try to help.',
    },
  },
  [
    sc(
      'a23-02-paints',
      [
        N('Inside, the baobab is hollow and cool.'),
        N('The walls are covered in painted lions.'),
        RA('I need paint for the new cub. Yellow and red.'),
        RA('You mix it. My knees are tired.'),
        N('You grind yellow earth in a shell. It makes soft yellow dust.'),
        N('Your Nubbin finds a red fruit. Juice drips down its arms.'),
      ],
      [
        ask(
          5,
          'art',
          'mixing red and yellow makes orange',
          'ELOF: Approaches to Learning',
          [N('Rafiki mixes red paint and yellow paint. What colour does he make?')],
          [
            o('Orange', [RA('Orange! Like the sun when it comes up.', 'happy')], true),
            o('Blue', [RA('Blue needs another paint. Red and yellow make orange.')]),
            o('Green', [RA('Green is yellow and blue. Red and yellow make orange.')]),
          ],
          'Learned that red and yellow paint mix to make orange.',
        ),
      ],
      {
        choices: [
          {
            id: 'grind',
            label: 'Grind it slowly, the way he showed you.',
            then: [RA('Polepole. Slow paint stays on the wall.', 'happy')],
          },
          {
            id: 'fast',
            label: 'Grind it fast.',
            then: [N('Puff! Yellow dust goes up your nose. Atchoo!'), RA('Polepole.')],
          },
          {
            id: 'taste',
            label: 'Ask if the fruit is nice to eat.',
            then: [RA('It is. Eat one first. A hungry painter paints only food.')],
          },
        ],
      },
    ),
    sc(
      'a23-02-paints-done',
      [
        N('The paint is thick and warm. It is yellow and red.'),
        RA('Good work. Asante! That means thank you.'),
        RA('Now you say it to me.'),
        N('You say asante. Rafiki smiles all the way up to his ears.'),
      ],
      [
        ask(
          2,
          'sel',
          'saying thank you shows we notice what others do',
          'CASEL: Relationship skills',
          [N('Rafiki says asante to you. Why do we say thank you?')],
          [
            o(
              'It shows someone we noticed their help',
              [RA('Yes. A thank you makes a helper feel good.', 'happy')],
              true,
            ),
            o('Only because we have to', [
              RA('We say it because it is kind, not only because of a rule.'),
            ]),
          ],
          'Thought about why we say thank you (asante) when someone helps.',
        ),
      ],
    ),
    sc(
      'a23-02-wall',
      [
        N('Rafiki climbs inside the tree with the shell.'),
        N('He paints with his fingers.'),
        N('A round body. Four fat paws. Two little ears.'),
        RA('There. That is Simba.'),
        N('Last, he paints a red line on the brow.'),
        N('Your Nubbin puts a red paw-print on its own head.'),
        RA('Ha! Painting someone means you want to remember them.', 'happy'),
      ],
      [
        doit(
          2,
          'maths',
          'count to four',
          'K.CC.B.5',
          'edu:count:cub-paws:4',
          [N('The painted cub has four fat paws. (Count them: one, two, three, four.)')],
          'Counted four paws on a painted cub.',
        ),
      ],
      {
        choices: [
          {
            id: 'ask',
            label: 'Ask why he paints them.',
            then: [RA('A lion is quick. A wall is slow. Somebody must hold on to things.')],
          },
          {
            id: 'old',
            label: 'Look at the oldest paintings.',
            then: [N('Up near the roof, one lion is so faint you must squint.')],
          },
          {
            id: 'wipe',
            label: 'Wipe your Nubbin’s forehead.',
            then: [RA('Leave it. Red suits a small brave one. It will wash off.')],
          },
        ],
      },
    ),
    sc(
      'a23-02-complete',
      [
        N('Rafiki gives your Nubbin a tiny dried gourd on a string.'),
        RA('Nothing is in it yet. That is the best kind of gourd.'),
        N('Your Nubbin shakes it. Rattle, rattle!'),
      ],
      [
        ask(
          0,
          'science',
          'materials have properties that make them useful',
          '2-PS1-1',
          [N('A dried gourd is hard and light. What could it carry well?')],
          [
            o(
              'Water',
              [RA('Yes! People have used dried gourds as bottles for a very long time.')],
              true,
            ),
            o('A big heavy rock', [
              RA('A rock would crack it. A gourd is light, so it carries water well.'),
            ]),
          ],
          'Linked a material’s properties (hard and light) to a use (carrying water).',
        ),
      ],
    ),
  ],
);

// ================================================================== A23-3 Everything the Light Touches
const Q3: EduQuest = quest(
  'a23-03',
  'Everything the Light Touches',
  {
    'a23-03-s1': {
      goal: 'Carry Rafiki’s message up to the king.',
      hint: 'Climb the back path to the top of the rock. Arrive quietly.',
    },
    'a23-03-s2': {
      goal: 'Stand with the king and his son as the sun comes up.',
      hint: 'Find a spot at the top of the rock. Watch where the light goes.',
    },
    'a23-03-s3': {
      goal: 'Watch the pouncing lesson. Let your Nubbin have a go.',
      hint: 'Keep low in the grass behind Simba. Zazu is the target.',
    },
  },
  [
    sc(
      'a23-03-dawn',
      [
        N('The page turns. Simba is bigger now, all feet and ears.'),
        N('You climb the rock with a message from Rafiki.'),
        N('A small lion lands on your feet. It is Simba!'),
        SI('Do you want to see me pounce?'),
        N('Simba pounces on your Nubbin. They roll down the rock together.'),
        MU('Simba. Guests are not for pouncing.'),
        SI('It started it!'),
        N('Your Nubbin looks delighted. It dives back in.'),
      ],
      [
        ask(
          4,
          'sel',
          'asking before you play rough',
          'CASEL: Relationship skills',
          [N('Simba pounced without asking. What could he do first?')],
          [
            o(
              'Ask: “Do you want to play?”',
              [MU('Exactly. Asking first keeps play fun for both.', 'happy')],
              true,
            ),
            o('Pounce even harder', [MU('Hard pouncing can hurt. Ask first, then play gently.')]),
            o('Run away', [MU('Running away is not asking. A kind question comes first.')]),
          ],
          'Practised asking a friend before playing, so play stays kind.',
        ),
      ],
      {
        choices: [
          {
            id: 'wrestle',
            label: 'Let them wrestle.',
            then: [N('They roll about until they are the same colour.')],
          },
          {
            id: 'part',
            label: 'Pull them apart gently.',
            then: [N('Nobody cries. Simba thinks it is a new game.')],
          },
        ],
      },
    ),
    sc(
      'a23-03-dawn-done',
      [
        N('The king walks to the top of the rock.'),
        N('Simba scrambles after him. You follow.'),
        N('Tap, tap, tap, tap. Your feet make a steady beat.'),
      ],
      [
        doit(
          2,
          'music',
          'keep a steady beat',
          PMP,
          'edu:clap:beat:walking',
          [N('(Clap a steady beat with your hands. Tap, tap, tap, tap.)')],
          'Kept a steady beat, clapping in time with walking feet.',
        ),
      ],
    ),
    sc(
      'a23-03-light',
      [
        N('The sun comes up over the edge of the plain.'),
        N('Light runs across the grass like water.'),
        MU('Look, Simba. As far as the light goes.'),
        N('Far away is a grey place. Nothing seems to grow there.'),
        MU('Stay away from there, Simba.'),
        N('Your Nubbin holds its hands up to the sun.'),
      ],
      [
        ask(
          1,
          'science',
          'sunlight warms the ground',
          'K-PS3-1',
          [N('The sun is up and shining on the grass. What does it do to the ground?')],
          [
            o('It warms it', [N('Yes. Sunlight warms the ground, so mornings get warmer.')], true),
            o('It makes it colder', [
              N('Sunlight warms things up. That is why the morning feels nicer.'),
            ]),
            o('Nothing at all', [N('Sunlight does a lot! Put your hand in it. It warms you too.')]),
          ],
          'Learned that sunlight warms the ground.',
        ),
      ],
      {
        choices: [
          {
            id: 'lift',
            label: 'Hold your Nubbin up to see the light.',
            then: [N('It squints at the sun. Then it sneezes.')],
          },
          {
            id: 'grey',
            label: 'Ask the king about the grey place.',
            then: [MU('Somewhere I hope none of you ever see.')],
          },
        ],
      },
    ),
    sc(
      'a23-03-pounce',
      [
        N('Zazu lands on a rock with the morning report. It is very long.'),
        MU('Simba, creep low in the grass. Stay very still.'),
        N('Simba wiggles his bottom. One step, two steps, three steps.'),
        N('Pounce! He lands on Zazu.'),
        N('Your Nubbin watches. It wiggles, it creeps, and it pounces.'),
        N('It misses! It lands in a bush.'),
      ],
      [
        doit(
          2,
          'maths',
          'count three steps',
          'K.CC.B.4',
          'edu:count:steps:3',
          [N('(Creep three steps with Simba. One, two, three! How many steps? Three.)')],
          'Counted three creeping steps, one number for each step.',
        ),
      ],
      {
        choices: [
          {
            id: 'cheer',
            label: 'Cheer anyway.',
            then: [N('Your Nubbin bows. Simba cheers louder.')],
          },
          {
            id: 'help',
            label: 'Help it out of the bush.',
            then: [N('It comes out covered in burrs and very pleased.')],
          },
        ],
      },
    ),
    sc(
      'a23-03-complete',
      [
        ZA('This is what comes of having guests.'),
        MU('Your small one will be a fine hunter. With a bigger bush.'),
        N('Simba lies on his back with his paws in the air.'),
        N('He is out of breath and very proud.'),
      ],
      [
        ask(
          3,
          'literacy',
          'find rhyming words',
          'RF.K.2',
          [N('Simba loves to pounce. Which word rhymes with pounce?')],
          [
            o('Bounce', [N('Pounce, bounce! Yes, they rhyme.')], true),
            o('Creep', [N('Creep does not rhyme with pounce. Pounce, bounce!')]),
            o('Bush', [N('Bush does not rhyme. Pounce, bounce, ounce!')]),
          ],
          'Found a word that rhymes with pounce.',
        ),
      ],
    ),
  ],
);

// ================================================================== A23-4 Uncle Scar
const Q4: EduQuest = quest(
  'a23-04',
  'Uncle Scar',
  {
    'a23-04-s1': {
      goal: 'Follow Simba round to his uncle’s ledge.',
      hint: 'Simba has gone round the shady side of the rock. Keep up.',
    },
    'a23-04-s2': {
      goal: 'Listen to what Uncle Scar says to Simba.',
      hint: 'Stay close to Simba and listen carefully.',
    },
  },
  [
    sc(
      'a23-04-ledge',
      [
        N('Simba runs round the shady side of the rock.'),
        N('A thin dark lion lies on a ledge. It is Uncle Scar.'),
        SI('Uncle Scar! Dad showed me the whole kingdom!'),
        SC('How lovely. I will not get up.'),
        N('Scar looks at you for a long time. Your tummy feels funny.'),
        N('Your Nubbin hides behind your leg.'),
      ],
      [
        ask(
          4,
          'sel',
          'noticing an uneasy feeling and telling a trusted grown-up',
          'CASEL: Self-awareness',
          [N('Your tummy feels funny near Scar. What can you do?')],
          [
            o(
              'Tell a grown-up you trust',
              [N('Yes. A funny tummy is a clue. A trusted grown-up can help.', 'soft')],
              true,
            ),
            o('Pretend it is nothing', [
              N('Better to listen to that funny feeling. Tell someone you trust.'),
            ]),
          ],
          'Practised noticing an uneasy feeling and deciding to tell a trusted adult.',
        ),
      ],
      {
        choices: [
          {
            id: 'greet',
            label: 'Say good morning politely.',
            then: [SC('Good morning. Such good manners.')],
          },
          {
            id: 'stare',
            label: 'Look straight back at him.',
            then: [N('He does not blink. You look away first.')],
          },
          {
            id: 'behind',
            label: 'Keep your Nubbin behind your legs.',
            then: [N('Your Nubbin wants to stay very far from this lion.')],
          },
        ],
      },
    ),
    sc(
      'a23-04-ledge-done',
      [
        N('Scar stretches, slowly and carefully.'),
        N('He lies back in the cool shade.'),
        N('The sun never reaches his ledge.'),
        N('The rock is in the way.'),
      ],
      [
        ask(
          3,
          'science',
          'shade is cooler because something blocks the sun',
          'K-PS3-1',
          [N('The ledge is cool and shady. Why?')],
          [
            o(
              'The rock blocks the sunlight',
              [N('Yes. When something blocks the light, we get shade, and shade is cooler.')],
              true,
            ),
            o('The sun is asleep', [
              N('The sun is still up. The rock is in the way, so it is shady.'),
            ]),
          ],
          'Learned that shade happens when something blocks sunlight, and it is cooler.',
        ),
      ],
    ),
    sc(
      'a23-04-slip',
      [
        SC('Did your dad show you the far border?'),
        SI('He said I can’t go there.'),
        SC('Good. It is only for very bold lions.'),
        SI('I am bold! What is out there?'),
        SC('Oh no. I could not say.'),
        N('He says it as if he is sorry. His tail says he is not.'),
        N('Simba’s eyes go round and shiny.'),
        SC('Do not tell your dad I said anything.'),
      ],
      [
        ask(
          7,
          'sel',
          'tell a trusted adult about a secret that makes you uneasy',
          'CASEL: Responsible decision-making',
          [N('Scar says: “Keep it secret from your dad.” What is the wise thing to do?')],
          [
            o(
              'Tell a grown-up you trust',
              [N('Yes. A secret that gives you a funny tummy is one to tell.', 'soft')],
              true,
            ),
            o('Keep it secret', [
              N('Careful. Secrets that make us uneasy should be told to a trusted grown-up.'),
            ]),
          ],
          'Learned that an uneasy secret should be shared with a trusted grown-up.',
        ),
      ],
      {
        choices: [
          {
            id: 'tell',
            label: 'Say you will tell the king.',
            then: [SC('Do. He will be so grateful.')],
          },
          {
            id: 'horrible',
            label: 'Say it sounds like a horrible place.',
            then: [SI('It sounds amazing.')],
          },
          {
            id: 'leave',
            label: 'Take Simba away from the ledge.',
            then: [N('Simba comes. He looks back twice.')],
          },
        ],
      },
    ),
    sc(
      'a23-04-complete',
      [
        N('Back at the baobab, you tell Rafiki what Scar said.'),
        RA('Hmm. That was not kind.', 'think'),
        RA('Let us fill the gourds. Cubs get thirsty.'),
        N('You fill three gourds with water.'),
      ],
      [
        doit(
          3,
          'maths',
          'count three gourds',
          'K.CC.B.5',
          'edu:count:gourds:3',
          [N('(Count the full gourds with Rafiki: one, two, three.)')],
          'Counted three full gourds.',
        ),
      ],
    ),
  ],
);

// ================================================================== A23-5 Losing Zazu
const Q5: EduQuest = quest(
  'a23-05',
  'Losing Zazu',
  {
    'a23-05-s1': {
      goal: 'Set off with Simba, Nala and Zazu.',
      hint: 'Zazu is in charge of the walk. Stay with the group.',
    },
    'a23-05-s2': {
      goal: 'Keep up with the cubs as they run through the herds.',
      hint: 'Follow the cubs. Duck under the zebra and go round the rhino.',
    },
  },
  [
    sc(
      'a23-05-walk',
      [
        N('Next day Simba brings a friend. Her name is Nala.'),
        SI('We are going to the waterhole!'),
        NA('It is not the waterhole.'),
        N('Zazu comes too. He has one rule.'),
        ZA('Stay together, in a line, please.'),
        RA('Take water. Keep your eyes open.'),
        N('Your Nubbin walks between the two cubs.'),
      ],
      [
        ask(
          4,
          'social-studies',
          'rules keep a group safe',
          'D2.Civ.8.K-2',
          [N('Why does Zazu want everyone to stay together?')],
          [
            o(
              'So nobody gets lost',
              [ZA('Exactly. A group is safer when it stays together.', 'happy')],
              true,
            ),
            o('So we walk slowly', [
              ZA('Slowness is not the point. Staying together keeps us safe.'),
            ]),
          ],
          'Thought about why a group rule (stay together) keeps everyone safe.',
        ),
      ],
      {
        choices: [
          {
            id: 'back',
            label: 'Walk at the back with Zazu.',
            then: [ZA('A sensible person. You and I will keep order.')],
          },
          {
            id: 'front',
            label: 'Walk at the front with the cubs.',
            then: [NA('You know it is not the waterhole, right?'), Y('I know.')],
          },
        ],
      },
    ),
    sc(
      'a23-05-walk-done',
      [
        N('Halfway across the plain, Simba looks at Nala.'),
        N('Nala looks back. Then both of them run!'),
        N('They run far ahead. Zazu is far behind.'),
      ],
      [
        ask(
          2,
          'maths',
          'ahead and behind',
          'K.G.A.1',
          [N('Nala and Simba run ahead. Where is Zazu?')],
          [
            o('Behind them', [N('Yes! The cubs are in front. Zazu is behind.')], true),
            o('In front of them', [N('In front is where the cubs are. Zazu is behind.')]),
          ],
          'Used the position words in front and behind.',
        ),
      ],
    ),
    sc(
      'a23-05-chase',
      [
        N('The cubs run into a herd of zebra.'),
        N('Stripes, stripes, stripes everywhere!'),
        ZA('Come back! This is not a line!'),
        N('You lose the cubs. You find them. You fall in the dust.'),
        N('Simba runs under a giraffe. Nala goes round a big rhino.'),
        N('Far behind, Zazu flies into a flock of flamingos.'),
      ],
      [
        notice(
          1,
          'science',
          'each zebra has its own stripes',
          SCI,
          [
            N('Look at the stripes! Every zebra has its own pattern. No two are the same.'),
            N('Just like your fingerprints.'),
          ],
          'Heard that every zebra has its own stripe pattern.',
        ),
      ],
      {
        choices: [
          {
            id: 'zazu',
            label: 'Tell them to go back for Zazu.',
            then: [SI('Zazu is fine. Zazu is always fine.')],
          },
          {
            id: 'laugh',
            label: 'Laugh, because it was funny.',
            then: [NA('See? The guest thinks we are clever.')],
          },
          {
            id: 'water',
            label: 'Give them a drink from the gourd.',
            then: [N('They drink as if they had run across a country.')],
          },
        ],
      },
    ),
    sc(
      'a23-05-chase-done',
      [
        N('Ahead of you, the grass stops.'),
        N('The ground goes grey and cracked.'),
        N('Steam puffs up out of the cracks. Pssshhh!'),
      ],
      [
        doit(
          2,
          'literacy',
          'say a sound word that matches what we hear',
          'RL.1.4',
          'edu:say:sound-word:psssh',
          [N('(Make the steam sound: psssh! Make it loud, then soft, then loud.)')],
          'Practised a sound word (psssh) that matches what we hear.',
        ),
      ],
    ),
    sc(
      'a23-05-complete',
      [
        N('A giant white rib sticks up out of the ground.'),
        NA('Whoa.'),
        SI('This is the place of old bones. Told you!'),
        N('There are more bones. And a huge skull.'),
        N('Your Nubbin holds on to your leg.'),
        Y('We should go back.'),
        SI('We have only just got here!'),
      ],
      [
        ask(
          4,
          'sel',
          'comforting a frightened friend',
          SE,
          [N('Your Nubbin is scared. How can you help it?')],
          [
            o(
              'Give it a cuddle and stay close',
              [N('Yes. A cuddle and a friend nearby help scared feelings shrink.', 'soft')],
              true,
            ),
            o('Tell it not to be silly', [
              N('Scared is a real feeling. A cuddle helps more than “don’t be silly”.'),
            ]),
          ],
          'Practised comforting a frightened friend with closeness.',
        ),
      ],
    ),
  ],
);

// ================================================================== A23-6 The Graveyard
const Q6: EduQuest = quest(
  'a23-06',
  'The Graveyard',
  {
    'a23-06-s1': {
      goal: 'Keep the cubs together among the bones.',
      hint: 'Stay in the open between the ribs. Do not go into the skull.',
    },
    'a23-06-s2': {
      goal: 'Run! Get the cubs away through the ribs.',
      hint: 'Weave between the ribs. Keep Nala and Simba ahead of you.',
    },
  },
  [
    sc(
      'a23-06-bones',
      [
        N('Everything here is grey. The ground, the sky, the bones.'),
        N('Simba peeks into the big skull.'),
        SI('I am not scared!'),
        ZA('Out, out, out! We are in the wrong place!'),
        N('Giggle, giggle! Someone is laughing inside the skull.'),
        N('Three hyenas peek out. They are grinning.'),
        N('Shenzi, Banzai and Ed. One, two, three!'),
      ],
      [
        doit(
          6,
          'maths',
          'count three',
          'K.CC.B.5',
          'edu:count:hyenas:3',
          [N('(Count the grinning hyenas: one, two, three. How many? Three!)')],
          'Counted three hyenas.',
        ),
      ],
      {
        choices: [
          {
            id: 'front',
            label: 'Step in front of the cubs.',
            then: [N('The hyenas giggle. They think you are brave.')],
          },
          {
            id: 'coat',
            label: 'Pick up your Nubbin.',
            then: [N('It burrows into your coat. Only its feet show.')],
          },
        ],
      },
    ),
    sc(
      'a23-06-chase',
      [
        ZA('Run!'),
        N('You run with the cubs between the giant ribs.'),
        N('Your Nubbin kicks a hyena on the nose. Boing!'),
        NA('This way!'),
        N('You all slide down a hill of bones.'),
        N('At the bottom, there is nowhere to go. Three hyenas grin.'),
        N('Simba tries to roar. It comes out as a squeak!'),
        N('Then a real roar comes. A big, big roar!'),
      ],
      [
        ask(
          7,
          'music',
          'loud and quiet sounds',
          SCI,
          [N('Simba’s roar was a tiny squeak. Which sound is loud?')],
          [
            o('The big, big roar', [N('Yes! The squeak is quiet. The big roar is loud.')], true),
            o('The tiny squeak', [N('The squeak is quiet. The big roar is the loud one.')]),
          ],
          'Compared loud and quiet sounds.',
        ),
      ],
      {
        choices: [
          {
            id: 'bone',
            label: 'Throw a bone to distract them.',
            then: [N('Banzai turns to look at it. It buys you a moment.')],
          },
          {
            id: 'stand',
            label: 'Stay in front of the cubs.',
            then: [N('Your knees shake. You stay put anyway.')],
          },
        ],
      },
    ),
    sc(
      'a23-06-chase-done',
      [
        N('The king runs down the hill of bones.'),
        N('The hyenas scatter like skittles.'),
        MU('Never come near my son again.'),
        N('Three hyenas run away into the steam.'),
        N('Ed is still giggling.'),
      ],
      [
        ask(
          3,
          'health',
          'what to do if you feel lost or scared',
          PMP,
          [N('If you ever feel lost or scared, what is the safest thing to do?')],
          [
            o(
              'Stay where you are and call a grown-up',
              [N('Yes. Stay still and call. Grown-ups can find you fast that way.')],
              true,
            ),
            o('Run away alone', [
              N('Running far makes you harder to find. Stay and call for a grown-up.'),
            ]),
          ],
          'Learned a safety rule: if lost or scared, stay still and call a trusted grown-up.',
        ),
      ],
    ),
    sc(
      'a23-06-complete',
      [
        N('Mufasa breathes hard. He looks at Simba.'),
        SI('Dad, I…'),
        MU('Zazu. Take Nala home.'),
        N('Zazu does not say a single word. That is strange.'),
        N('Nala looks back at Simba all the way home.'),
      ],
      [
        ask(
          4,
          'sel',
          'guessing how another person feels',
          'CASEL: Social awareness',
          [N('Zazu is quiet. Nala keeps looking back. How might Simba feel?')],
          [
            o(
              'Sorry and worried',
              [N('Yes. He feels sorry and worried. Feelings show in how we act.')],
              true,
            ),
            o('Sleepy and silly', [N('Sleepy is not it. Simba feels sorry and worried.')]),
          ],
          'Guessed how a character feels from how the others behave.',
        ),
      ],
    ),
  ],
);

// ================================================================== A23-7 Under the Stars
const Q7: EduQuest = quest(
  'a23-07',
  'Under the Stars',
  {
    'a23-07-s1': {
      goal: 'Walk home behind the king and his son, a little way off.',
      hint: 'Keep your distance. This is their talk, but do not get lost.',
    },
    'a23-07-s2': {
      goal: 'Sit a little way off while the king talks with his son under the stars.',
      hint: 'Stay where you are and look up. Your Nubbin will try to count the stars.',
    },
  },
  [
    sc(
      'a23-07-dusk',
      [
        N('The sun is going down. Mufasa walks ahead.'),
        N('Simba steps in his dad’s big footprints.'),
        N('Each print is bigger than Simba! He has to jump.'),
        MU('Simba, you did not listen. That was not safe.'),
        SI('I only wanted to be like you.'),
        MU('When I saw them near you, I was very scared.'),
      ],
      [
        ask(
          2,
          'maths',
          'compare sizes: bigger and smaller',
          'K.MD.A.2',
          [N('Mufasa’s footprint is big. Simba’s footprint is…?')],
          [
            o(
              'Smaller',
              [N('Yes! Simba’s paw is smaller, so he has to jump from print to print.')],
              true,
            ),
            o('Bigger', [
              N('Look again. Mufasa’s print is bigger than all of Simba. Simba’s is smaller.'),
            ]),
          ],
          'Compared two sizes using bigger and smaller.',
        ),
      ],
      {
        choices: [
          {
            id: 'stop',
            label: 'Stop walking, so they can go on alone.',
            then: [N('You sit in the grass. The king gives you a little nod.')],
          },
          {
            id: 'hold',
            label: 'Hold your Nubbin a bit tighter.',
            then: [N('It lets you. It does not usually.')],
          },
        ],
      },
    ),
    sc(
      'a23-07-dusk-done',
      [
        N('They stop on a low hill. The first stars come out.'),
        N('You sit a little way off. Your Nubbin sits on your knee.'),
        N('The sky goes from orange to dark blue.'),
      ],
      [
        ask(
          2,
          'science',
          'stars come out at night',
          '1-ESS1-1',
          [N('The sun has gone down and the sky is dark. What can we see?')],
          [
            o(
              'Stars',
              [N('Yes! The stars were there all day. We can see them when the sky is dark.')],
              true,
            ),
            o('The sun again', [
              N('The sun has gone to the other side of the world. Now we see stars.'),
            ]),
          ],
          'Learned that we see stars when the sky is dark at night.',
        ),
      ],
    ),
    sc(
      'a23-07-stars',
      [
        SI('Dad, were you really scared?'),
        MU('Yes. I was very scared. Being scared is okay.'),
        N('Simba thinks about that. Then he pounces on his dad’s tail!'),
        N('They both laugh.'),
        MU('Look up, Simba. The stars shine all night.'),
        N('Simba looks up. Your Nubbin looks up too.'),
        N('It tries to count the stars. There are too many.'),
      ],
      [
        notice(
          1,
          'sel',
          'everyone feels scared sometimes',
          SE,
          [
            N('Even a big, strong king feels scared sometimes.'),
            N('Feeling scared is not bad. It is a feeling, like feeling hungry or sleepy.'),
          ],
          'Heard that everyone feels scared sometimes, and that scared is a normal feeling.',
        ),
      ],
      {
        choices: [
          {
            id: 'look',
            label: 'Look up with them.',
            then: [N('The sky is so full of stars. You look for a long time.')],
          },
          {
            id: 'away',
            label: 'Look away, and let them have it to themselves.',
            then: [N('You look at the grass instead. Some moments are for two.')],
          },
          {
            id: 'point',
            label: 'Point out one star to your Nubbin.',
            then: [N('Your Nubbin looks at your finger. Then at the star.')],
          },
        ],
      },
    ),
    sc(
      'a23-07-complete',
      [
        N('At the baobab, Rafiki is waiting up with a pot of tea. It is cold.'),
        Y('The king said he was scared today.'),
        RA('Then he is a good king. Everyone is scared sometimes.'),
        RA('Look out of the window. Nyota. That is star.'),
        RA('Say it with me. Nyota!'),
        N('Out of the tree window, two green eyes watch the rock.'),
      ],
      [
        doit(
          4,
          'literacy',
          'say a new word from another language',
          LANG,
          'edu:say:word:nyota',
          [N('(Say it together: nyota, nyota! Point to a star on the page.)')],
          'Said the Swahili word nyota (star).',
        ),
      ],
    ),
  ],
);

// ================================================================== A23-9 Run
const Q9: EduQuest = quest(
  'a23-09',
  'Run',
  {
    'a23-09-s1': {
      goal: 'Carry Zazu along the edge of the gorge.',
      hint: 'Keep along the rim and watch where Simba goes.',
    },
    'a23-09-s2': {
      goal: 'Choose: follow Simba, or carry Zazu home to Rafiki.',
      hint: 'You cannot do both. Both are kind. The page goes on with you either way.',
    },
  },
  [
    sc(
      'a23-09-chase',
      [
        N('The page turns to a gorge. A gorge is a deep, rocky valley.'),
        N('Something very sad happens there. Simba’s dad, Mufasa, dies.'),
        N('That means his body stops working. It cannot start again.'),
        N('Scar tells Simba it was his fault. That is not true!'),
        N('Simba is very sad and very scared. He runs.'),
        N('Zazu has bumped his wing on the rocks. You scoop him up and follow.'),
        N('Three silly, scary hyenas chase Simba to the thorn bushes.'),
        N('They stop at the thorns. Simba is far away now.'),
      ],
      [
        notice(
          4,
          'sel',
          'it is okay to be very sad; what helps',
          'CASEL: Self-awareness',
          [
            N('When someone we love dies, we feel very sad. That is okay.'),
            N('A hug helps. So does crying, telling someone, and sitting together.'),
            N('Sad feelings get easier to carry when someone is beside us.'),
          ],
          'Heard plainly that a death makes us sad, that sad is okay, and that company helps.',
        ),
      ],
      {
        choices: [
          {
            id: 'quiet',
            label: 'Keep still until the hyenas have gone.',
            then: [N('You wait with Zazu against your chest. The giggling fades.')],
          },
          {
            id: 'glare',
            label: 'Frown after them.',
            then: [N('They do not see it. You feel a tiny bit better.')],
          },
        ],
      },
    ),
    sc(
      'a23-09-chase-done',
      [
        N('The thorns are still shaking where Simba went through.'),
        N('Thorns are sharp points on a plant.'),
        N('They stop animals from nibbling the leaves.'),
        N('Beyond the thorns there is only dry sand.'),
      ],
      [
        ask(
          2,
          'science',
          'plant parts help the plant survive',
          '4-LS1-1',
          [N('Why do some plants have thorns?')],
          [
            o(
              'To stop animals eating them',
              [N('Yes! Thorns are a plant’s way of saying “please don’t nibble me”.')],
              true,
            ),
            o('To look pretty', [
              N('They do look sharp, not pretty. Thorns help plants stay safe.'),
            ]),
            o('To catch the rain', [
              N('Rain falls on leaves, not thorns. Thorns keep nibblers away.'),
            ]),
          ],
          'Learned that thorns protect plants from being eaten.',
        ),
      ],
    ),
    sc(
      'a23-09-choice',
      [
        N('You stand at the thorns with Zazu in your arms.'),
        N('Zazu has a hurt wing. He cannot fly.'),
        ZA('Somebody must go with Simba. Somebody must tell Rafiki.'),
        ZA('I cannot choose. You choose.'),
        N('Your Nubbin looks at the thorns, then at Zazu, then at you.'),
      ],
      [
        ask(
          4,
          'sel',
          'making a hard choice between two kind things',
          'CASEL: Responsible decision-making',
          [N('Both choices are kind. What helps when it is hard to choose?')],
          [
            o(
              'Stop, breathe, and think who needs you most',
              [N('Yes. A slow breath and a think help us choose well.')],
              true,
            ),
            o('Pick without thinking', [
              N('Quick picks can be fine, but a big choice deserves a slow think.'),
            ]),
          ],
          'Practised pausing to think when choosing between two kind options.',
        ),
      ],
      {
        choices: [
          {
            id: 'simba',
            label: 'Follow Simba through the thorns.',
            set: { 'a23-path': 'simba' },
            then: [
              ZA('Yes. Go. Put me under that bush. Hornbills are excellent at limping.'),
              N('You leave Zazu in the shade, with half your water. You push into the thorns.'),
            ],
          },
          {
            id: 'rafiki',
            label: 'Carry Zazu home to Rafiki’s tree.',
            set: { 'a23-path': 'rafiki' },
            then: [
              ZA('Rafiki will know what to do. He always does.'),
              N('You turn your back on the thorns. It is hard.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a23-09-complete',
      [
        N('The sun goes down, red over the gorge.'),
        N('The page lets go of the day slowly.'),
        N('Your Nubbin holds your hand. It does not let go.'),
      ],
      [
        ask(
          0,
          'art',
          'name sunset colours',
          'ELOF: Approaches to Learning',
          [N('The sun is going down over the gorge. What colours are in the sky?')],
          [
            o(
              'Red, orange and pink',
              [N('Yes! A sunset can paint the whole sky in warm colours.')],
              true,
            ),
            o('Only green', [N('Look again. Sunsets are warm colours: red, orange and pink.')]),
          ],
          'Named the warm colours of a sunset.',
        ),
      ],
    ),
  ],
);

// ================================================================== A23-10 The Desert
const Q10: EduQuest = quest(
  'a23-10',
  'The Desert',
  {
    'a23-10-s1': {
      goal: 'Get through the first long day after the gorge.',
      hint: 'Stay with whoever you chose. Walk when they walk, and rest when they rest.',
    },
    'a23-10-s2': {
      goal: 'See the evening in, whatever it brings.',
      hint: 'Stay close. Help is coming, one way or another.',
    },
  },
  [
    sc(
      'a23-10-desert',
      [
        N('Past the thorns, the ground turns to orange sand.'),
        N('The sun sits right on top of it.'),
        N('Simba walks ahead. He will not look at you.'),
        SI('You do not have to come.'),
        Y('I know.'),
        N('You walk beside him anyway.'),
        N('It is very hot. You share the last of your water.'),
        N('Simba lies down in the sand.'),
      ],
      [
        ask(
          6,
          'health',
          'water and shade help a hot body',
          PMP,
          [N('It is very hot. What helps a hot body most?')],
          [
            o('Water and shade', [N('Yes! Water and shade help a hot body feel better.')], true),
            o('Running faster', [N('Running makes us hotter. Rest in the shade and drink.')]),
            o('A woolly coat', [N('A coat would make us hotter. Shade and water are best.')]),
          ],
          'Learned that water and shade help when we are hot.',
        ),
      ],
      {
        choices: [
          {
            id: 'shade',
            label: 'Make shade over him with your coat.',
            then: [N('You hold your coat up. It is a small square of shade. He crawls in.')],
          },
          {
            id: 'sit',
            label: 'Sit down next to him and wait.',
            then: [N('You sit beside him and wait. He puts his chin on your boot.')],
          },
        ],
      },
    ),
    sc(
      'a23-10-desert-done',
      [
        N('Big birds circle in the sky. They are vultures.'),
        N('They ride the warm air. They hardly flap at all!'),
        N('Your Nubbin shakes its gourd at them. Rattle, rattle!'),
      ],
      [
        notice(
          1,
          'science',
          'warm air rises, and birds can glide on it',
          SCI,
          [
            N('Warm air rises, like bubbles in a bath. Big birds float on it.'),
            N('That is how vultures circle for a long time without flapping.'),
          ],
          'Heard that warm air rises and big birds glide on it.',
        ),
      ],
    ),
    sc(
      'a23-10-help',
      [
        N('A warthog runs out of the bushes. A meerkat rides on his back.'),
        TI('Shoo! Go and bother a rhino!'),
        N('The vultures fly away.'),
        PU('Look, Timon. A little lion. Can we keep him?'),
        TI('Fine! But I am not carrying him.'),
        N('Pumbaa carries Simba. Timon carries nothing at all.'),
      ],
      [
        ask(
          4,
          'sel',
          'kindness to someone who feels sad',
          'CASEL: Social awareness',
          [N('Pumbaa helps a stranger. How can you help someone who feels sad?')],
          [
            o(
              'Sit beside them and be kind',
              [N('Yes. Being near and being kind is a big help.', 'soft')],
              true,
            ),
            o('Tell them to cheer up', [
              N('Cheer up is hard to do on command. Kind company helps more.'),
            ]),
          ],
          'Thought about how to help someone who is sad by being near and kind.',
        ),
      ],
      {
        choices: [
          {
            id: 'thank',
            label: 'Thank them.',
            then: [TI('Don’t thank us. Thanking is how they get you.')],
          },
          {
            id: 'guest',
            label: 'Say you are only a guest here.',
            then: [PU('That is okay. Everybody is a guest somewhere.')],
          },
        ],
      },
    ),
    sc(
      'a23-10-complete',
      [
        N('Pumbaa and Timon take Simba to a stream.'),
        N('Simba drinks and drinks. Then he sits with his back to everyone.'),
        TI('So, kid. What’s your story?'),
        SI('I don’t have one.'),
        N('Pumbaa looks at you. You shake your head a little.'),
        N('Pumbaa does not ask again. He sits near Simba.'),
        N('Simba, Timon, Pumbaa, your Nubbin and you. How many friends by the stream?'),
      ],
      [
        doit(
          6,
          'maths',
          'count five',
          'K.CC.B.5',
          'edu:count:friends:5',
          [N('(Count everyone by the stream: Simba, Timon, Pumbaa, your Nubbin, you. Five!)')],
          'Counted five friends, one number for each.',
        ),
      ],
    ),
  ],
);

// ================================================================== A23-11 No Worries
const Q11: EduQuest = quest(
  'a23-11',
  'No Worries',
  {
    'a23-11-s1': {
      goal: 'Live through the long seasons that come next.',
      hint: 'The page turns the years for you. Stay with whoever you are with.',
    },
    'a23-11-s2': {
      goal: 'See what supper looks like now.',
      hint: 'Go where the others are gathering, and take what you are offered.',
    },
  },
  [
    sc(
      'a23-11-oasis',
      [
        N('Timon and Pumbaa live in a green place past the desert.'),
        N('There are ferns, waterfalls and lots of bugs.'),
        TI('Bad thing happened? Don’t look at it. Look at the log!'),
        PU('We say “no worries”. In Swahili, people say hakuna matata.'),
        N('Simba says it quietly. He smiles a little.'),
        N('Your Nubbin lies on the log next to him.'),
      ],
      [
        ask(
          4,
          'sel',
          'looking away helps a little; talking helps more',
          'CASEL: Self-management',
          [
            N(
              'Timon says look at the log and not at the sad thing. What helps a big sad feeling most?',
            ),
          ],
          [
            o(
              'Talking to someone who listens',
              [N('Yes. Looking away helps for a minute. Talking helps for much longer.')],
              true,
            ),
            o('Never think about it', [
              N(
                'Not thinking works for a while. Talking to someone helps the feeling get smaller.',
              ),
            ]),
          ],
          'Compared looking away from a sad feeling with talking to someone about it.',
        ),
      ],
      {
        choices: [
          {
            id: 'say',
            label: 'Try saying it yourself.',
            then: [PU('Perfect! No worries at all!')],
          },
          {
            id: 'watch',
            label: 'Keep quiet and watch Simba.',
            then: [N('He is smiling. It does not reach his eyes yet.')],
          },
        ],
      },
    ),
    sc(
      'a23-11-oasis-done',
      [
        N('The page turns its seasons, one after another.'),
        N('Simba grows bigger. A thick gold mane grows in.'),
        N('You and your Nubbin do not change. The atlas keeps your time.'),
      ],
      [
        ask(
          1,
          'science',
          'young animals grow into adults',
          '1-LS3-1',
          [N('Simba was a tiny cub. What does he grow into?')],
          [
            o(
              'A grown-up lion',
              [N('Yes! He grows bigger, and a mane grows too. A lion cub grows into a lion.')],
              true,
            ),
            o('A zebra', [N('A lion cub is always a lion. Simba grows into a grown-up lion.')]),
          ],
          'Learned that young animals grow into adults like their parents.',
        ),
      ],
    ),
    sc(
      'a23-11-grubs',
      [
        N('Supper is under a log. Pumbaa rolls it over.'),
        N('Wriggle, wriggle! Grubs and beetles!'),
        TI('Tasty! The crunchy ones too!'),
        N('Your Nubbin looks at the grub. It folds its arms.'),
        N('It sits down with a thump. No grubs for this Nubbin!'),
      ],
      [
        doit(
          4,
          'maths',
          'sort things into two groups',
          'K.MD.B.3',
          'edu:sort:food:bugs-or-fruit',
          [
            N('(Sort the foods into two groups: bugs, and fruit.)'),
            N('Grub, beetle, fig, plum. How many are bugs? Two!'),
          ],
          'Sorted foods into bugs and fruit, and counted each group.',
        ),
      ],
      {
        choices: [
          {
            id: 'fig',
            label: 'Find your Nubbin a fig instead.',
            then: [N('Your Nubbin eats the whole fig. Then it looks smug.')],
          },
          {
            id: 'try',
            label: 'Try a grub yourself, to be polite.',
            then: [N('It is crunchy, then it is something else. You swallow.')],
          },
        ],
      },
    ),
    sc(
      'a23-11-complete',
      [
        N('That night you all lie on a log and look at the sky.'),
        PU('I think the stars are other warthogs’ campfires.'),
        SI('Somebody told me they are old kings, keeping watch.'),
        TI('Kings in the sky? Who said that?'),
        SI('Nobody. It does not matter.'),
        N('He turns away from the sky. Your Nubbin keeps looking at the stars.'),
      ],
      [
        notice(
          2,
          'social-studies',
          'people tell different stories about the stars',
          'D2.His.2.K-2',
          [
            N('People all over the world told stories about the stars.'),
            N('Pumbaa has one story. Simba has another. Each is a story about the same stars.'),
          ],
          'Heard that people in different places tell different stories about the same stars.',
        ),
      ],
    ),
  ],
);

// ================================================================== A23-12 Nala
const Q12: EduQuest = quest(
  'a23-12',
  'Nala',
  {
    'a23-12-s1': {
      goal: 'Be there when the hunter in the long grass finds the warthog.',
      hint: 'Stay near the stream at the edge of the green place. Keep your Nubbin close.',
    },
    'a23-12-s2': {
      goal: 'Give Simba and Nala some room, but stay within call.',
      hint: 'Wait by the waterfall with Timon and Pumbaa. This is between the two of them.',
    },
  },
  [
    sc(
      'a23-12-hunt',
      [
        N('Pumbaa is looking for beetles by the stream.'),
        PU('Did I hear a swishy noise?'),
        N('A lioness runs out of the long grass.'),
        N('She runs straight at Pumbaa!'),
        PU('Aaagh!'),
        N('Simba jumps out of the ferns. They roll over in the mud.'),
        N('She holds him down. She knows him.'),
        SI('Nala?'),
      ],
      [
        notice(
          4,
          'science',
          'warthogs run with their tails up',
          SCI,
          [
            N('Pumbaa runs with his tail straight up, like a little flag.'),
            N('Warthogs really do that when they run.'),
          ],
          'Heard a true fact about warthogs: they run with their tails held up.',
        ),
      ],
      {
        choices: [
          {
            id: 'hold',
            label: 'Hold on to your Nubbin.',
            then: [N('It wants to help. You hold on anyway.')],
          },
          {
            id: 'pumbaa',
            label: 'Pull Pumbaa out of the way.',
            then: [PU('My hero!'), N('He hugs you. He is very heavy.')],
          },
        ],
      },
    ),
    sc(
      'a23-12-hunt-done',
      [
        NA('Simba? It is you!'),
        NA('Everyone thought you were lost forever!'),
        N('Then she sees you in the stream. Her eyes go wide.'),
        NA('Rafiki’s guest! You were with him all this time?'),
      ],
      [
        ask(
          2,
          'sel',
          'naming the feeling of surprise',
          'CASEL: Self-awareness',
          [N('Nala’s eyes go wide. How does she feel?')],
          [
            o('Surprised', [N('Yes. Surprised! Her eyes go wide and her mouth falls open.')], true),
            o('Sleepy', [N('Sleepy eyes are half shut. Nala’s are wide open. She is surprised.')]),
            o('Cross', [N('She is not cross. Wide eyes mean she is surprised.')]),
          ],
          'Named the feeling of surprise from how a character looks.',
        ),
      ],
    ),
    sc(
      'a23-12-talk',
      [
        N('Simba and Nala walk off along the stream.'),
        TI('She will take him away. I feel it in my fur.'),
        PU('Maybe she is nice.'),
        TI('That is worse!'),
        N('Under the waterfall, you hear them talk.'),
        NA('There is no rain. The river is mud. We are all hungry.'),
        SI('I cannot go back.'),
      ],
      [
        ask(
          5,
          'science',
          'plants and animals need water to live',
          'K-LS1-1',
          [
            N(
              'Nala says the river has turned to mud, and everyone is hungry. What do plants and animals need to live?',
            ),
          ],
          [
            o(
              'Water',
              [N('Yes! Plants and animals need water. That is why the dry time was so hard.')],
              true,
            ),
            o('Toys', [N('Toys are fun, but living things need water, food and air.')]),
          ],
          'Learned that plants and animals need water to live.',
        ),
      ],
      {
        choices: [
          {
            id: 'stay',
            label: 'Stay with Timon and Pumbaa, and let them talk.',
            then: [N('Pumbaa hands you a beetle as a comfort. You hold it.')],
          },
          {
            id: 'nubbin',
            label: 'Let your Nubbin go to Nala.',
            then: [N('It sits by her. She puts a paw round it.')],
          },
        ],
      },
    ),
    sc(
      'a23-12-complete',
      [
        N('They come back. Nala will not look at Simba.'),
        NA('Tell him he has to come home.'),
        SI('Leave them out of this.'),
        N('He walks off into the dark, alone.'),
        N('After a moment, you follow him.'),
      ],
      [
        ask(
          3,
          'literacy',
          'name who did what in the story',
          'RL.K.3',
          [N('Who walked off into the dark alone?')],
          [
            o('Simba', [N('Yes, Simba walked off, and you followed him.')], true),
            o('Nala', [N('Nala stayed. It was Simba who walked off.')]),
            o('Timon', [N('Timon stayed by the water. Simba is the one who walked off.')]),
          ],
          'Recalled which character did what in the story.',
        ),
      ],
    ),
  ],
);

// ================================================================== A23-13 The Wind
const Q13: EduQuest = quest(
  'a23-13',
  'The Wind',
  {
    'a23-13-s1': {
      goal: 'Get through the night after Nala’s news.',
      hint: 'Keep going. Stay with whoever needs you most tonight.',
    },
    'a23-13-s2': {
      goal: 'Watch where the wind goes.',
      hint: 'Keep still, and follow the dust with your eyes.',
    },
  },
  [
    sc(
      'a23-13-ridge',
      [
        N('Simba climbs a bare ridge. You climb after him.'),
        N('The sky is huge. Every star is out.'),
        SI('My dad died. I think it was my fault.'),
        N('He throws himself down on the ridge with a thump.'),
      ],
      [
        ask(
          2,
          'sel',
          'comforting someone who blames themselves',
          'CASEL: Social awareness',
          [N('Simba thinks it was his fault. What can you tell him?')],
          [
            o(
              'It was not your fault',
              [
                N(
                  'Yes. Simba was only a cub, and it was not his fault. Hearing that helps.',
                  'soft',
                ),
              ],
              true,
            ),
            o('It was your fault', [N('No. It was not Simba’s fault. He was only a cub.')]),
            o('Do not be sad', [
              N(
                'Telling someone not to be sad does not work. Telling them the truth, kindly, does.',
              ),
            ]),
          ],
          'Practised comforting someone who blames themselves for something that was not their fault.',
        ),
      ],
      {
        choices: [
          {
            id: 'wait',
            label: 'Sit down next to him and wait.',
            then: [N('You sit beside him. He does not tell you to go.')],
          },
          {
            id: 'fault',
            label: 'Tell him it was not his fault.',
            then: [N('He says you did not see. That is true. You say it anyway.')],
          },
        ],
      },
    ),
    sc(
      'a23-13-ridge-done',
      [N('A puff of dust and fur lifts from the ridge.'), N('The wind catches it.')],
      [
        notice(
          1,
          'science',
          'wind pushes light things',
          SCI,
          [
            N('Wind pushes light things: dust, leaves, feathers and fur.'),
            N('Heavy things, like stones, stay where they are.'),
          ],
          'Heard that wind moves light things but not heavy ones.',
        ),
      ],
    ),
    sc(
      'a23-13-wind',
      [
        N('The dust and fur drift up into the night.'),
        N('They float up and away, high over the trees.'),
        N('First the green place. Then the desert. Last, the home plain.'),
        N('Your Nubbin watches until it is only a dot.'),
        SI('What are you looking at?'),
        N('The wind smells of dust and, faintly, of home.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'follow places in order on a journey',
          'D2.Geo.2.K-2',
          [
            N(
              'The fur floats over the green place, then the desert, then the home plain. Which place is last?',
            ),
          ],
          [
            o(
              'The home plain',
              [N('Yes. The green place first, the desert next, the home plain last.')],
              true,
            ),
            o('The desert', [N('The desert comes in the middle. The home plain is last.')]),
          ],
          'Put places in order on a journey: first, next, last.',
        ),
      ],
      {
        choices: [
          {
            id: 'nubbin',
            label: 'Watch it go with your Nubbin.',
            then: [N('You watch together until there is nothing left to see.')],
          },
          {
            id: 'simba',
            label: 'Watch Simba instead.',
            then: [N('He pretends to be asleep. He is not very good at it.')],
          },
        ],
      },
    ),
    sc(
      'a23-13-complete',
      [
        N('Late that night, somebody hums badly in the ferns.'),
        N('Then a cheerful voice calls from a treetop.'),
        RA('There you are! Asante for staying with him.'),
        N('It is Rafiki. He has burrs in his beard.'),
        Y('How did you find us?'),
        RA('The wind told me.'),
      ],
      [
        doit(
          0,
          'music',
          'sound is a buzz you can feel',
          '1-PS4-1',
          'edu:hum:throat:buzz',
          [N('(Hum a long note. Put a hand on your throat. Can you feel the buzz?)')],
          'Hummed a note and felt the vibration in the throat: sound is a buzz.',
        ),
      ],
    ),
  ],
);

// ================================================================== A23-14 Look Harder
const Q14: EduQuest = quest(
  'a23-14',
  'Look Harder',
  {
    'a23-14-s1': {
      goal: 'Watch Rafiki find Simba in the green place.',
      hint: 'Stay back among the ferns. Rafiki has his own way of doing this.',
    },
    'a23-14-s2': {
      goal: 'Follow Rafiki through the roots to the still pool.',
      hint: 'Keep up with him. Duck under the roots and listen for his stick.',
    },
    'a23-14-s3': {
      goal: 'Look up at the clouds.',
      hint: 'Stand still and look up. Do not say anything.',
    },
  },
  [
    sc(
      'a23-14-find',
      [
        N('In the morning, Simba sits alone by the trees.'),
        N('Rafiki walks up and sits down beside him.'),
        N('He says nothing at all.'),
        SI('What do you want?'),
        RA('Nothing. I am sitting. You can sit too.'),
        N('Simba moves away. Rafiki moves too, and sits again.'),
        RA('I am not following you. I am sitting next to you.'),
      ],
      [
        ask(
          6,
          'sel',
          'sitting beside someone helps them feel less alone',
          'CASEL: Relationship skills',
          [N('Rafiki just sits beside Simba. How does that help?')],
          [
            o(
              'Simba feels less alone',
              [
                N(
                  'Yes. Sitting beside someone, even quietly, tells them they are not alone.',
                  'soft',
                ),
              ],
              true,
            ),
            o('It does not help', [N('It does! Being near a kind friend helps a sad feeling.')]),
          ],
          'Learned that quiet company helps someone feel less alone.',
        ),
      ],
      {
        choices: [
          {
            id: 'ferns',
            label: 'Stay back in the ferns.',
            then: [N('You stay where you are. This one is not yours to do.')],
          },
          {
            id: 'sit',
            label: 'Let your Nubbin go and sit with them too.',
            then: [N('It sits on Simba’s other side. He gives up and stays.')],
          },
        ],
      },
    ),
    sc(
      'a23-14-find-done',
      [
        N('Rafiki sets off into the trees. He runs very fast!'),
        N('He goes over a log, under a root, and through the ferns.'),
        N('Simba goes after him. So do you.'),
      ],
      [
        ask(
          1,
          'maths',
          'above and below',
          'K.G.A.1',
          [N('Rafiki goes under the root. Is he above the root or below it?')],
          [
            o('Below it', [N('Yes! Under means below. He ducks beneath the root.')], true),
            o('Above it', [N('Above means on top. Under means below.')]),
          ],
          'Used the position words above and below.',
        ),
      ],
    ),
    sc(
      'a23-14-pool',
      [
        N('The trees open on a small round pool.'),
        N('The water is perfectly still.'),
        RA('Look down. Into the water.'),
        N('Simba sees himself. A tired lion.'),
        RA('Look again. Slowly.'),
        N('Rafiki touches the water. Ripples spread out in circles.'),
        N('As the ripples settle, Simba sees his father’s face.'),
        RA('You carry him with you, in your memory.'),
        N('Your Nubbin sees only itself, with a red mark on its brow.'),
      ],
      [
        notice(
          7,
          'sel',
          'we can remember people we love after they have died',
          SE,
          [
            N('When someone we love has died, we can still remember them.'),
            N('We can say their name, tell stories, and look at pictures. That keeps them close.'),
          ],
          'Heard that we can keep someone we love close by remembering them.',
        ),
      ],
      {
        choices: [
          {
            id: 'look',
            label: 'Look into the pool yourself.',
            then: [N('You see your face, and a grey sky moving fast.')],
          },
          {
            id: 'simba',
            label: 'Keep watching Simba.',
            then: [N('Simba holds his breath. He does not want the water to move.')],
          },
        ],
      },
    ),
    sc(
      'a23-14-clouds',
      [
        N('A wind comes. The clouds pile up and turn.'),
        N('A great shape comes out of the cloud. It looks like a lion.'),
        SI('Father?'),
        MU('Simba. You have been sad for a long time.'),
        MU('One sad day is not all of you.'),
        MU('Go home, my son. People who love you are waiting.'),
        N('Then the clouds are only clouds.'),
      ],
      [
        notice(
          0,
          'science',
          'clouds are made of tiny drops of water',
          SCI,
          [
            N('Clouds are made of tiny drops of water, floating high in the sky.'),
            N('Wind can push them into big shapes.'),
          ],
          'Heard that clouds are made of tiny drops of water.',
        ),
      ],
    ),
    sc(
      'a23-14-clouds-done',
      [
        N('Simba stands still in the wind.'),
        N('Rafiki does not hurry him.'),
        N('Your Nubbin looks up at the clouds for a long time.'),
        N('Behind them, the little pool lies calm and round.'),
      ],
      [
        ask(
          3,
          'maths',
          'name a circle',
          'K.G.A.2',
          [N('The pool is round. Which shape is round?')],
          [
            o('A circle', [N('Yes! A circle is round, with no corners.')], true),
            o('A square', [N('A square has four corners. The round pool is a circle.')]),
            o('A triangle', [N('A triangle has three corners. The round pool is a circle.')]),
          ],
          'Named the circle as the shape of the round pool.',
        ),
      ],
    ),
    sc(
      'a23-14-complete',
      [
        SI('If I go home, everyone will look at me.'),
        N('Rafiki raps him on the head with his stick. Not hard.'),
        SI('Ow!'),
        RA('Does it still sting?'),
        SI('Yes!'),
        RA('A thing that happened can follow you.'),
        RA('You can carry it, or it can chase you.'),
        N('Rafiki swings the stick again. This time Simba ducks!'),
        RA('Ha! You learn.'),
        N('Simba looks at the sky. Then he runs for home.'),
      ],
      [
        ask(
          8,
          'literacy',
          'how a character responds to what happens',
          'RL.2.3',
          [N('Rafiki swung the stick a second time. What did Simba do?')],
          [
            o('He ducked', [N('Yes! He learned from the first time. He ducked!')], true),
            o('He said ow again', [N('The first time he said ow. The second time he ducked.')]),
          ],
          'Noticed how a character responds differently the second time.',
        ),
      ],
    ),
  ],
);

// ================================================================== A23-16 The Rains
const Q16: EduQuest = quest(
  'a23-16',
  'The Rains',
  {
    'a23-16-s1': {
      goal: 'Stand in the first rain on the rock.',
      hint: 'Stay out in the open. Let it rain on you.',
    },
    'a23-16-s2': {
      goal: 'Watch Simba climb to the top of the rock and roar.',
      hint: 'Stay below with the pride, and look up.',
    },
    'a23-16-s3': {
      goal: 'Take your place on the rock for the new cub.',
      hint: 'Go up to the top of the rock with Rafiki.',
    },
  },
  [
    sc(
      'a23-16-rain',
      [
        N('Simba is home. Scar is not in charge any more.'),
        N('Everyone knows now that it was never Simba’s fault.'),
        N('A drop lands on your nose. Another lands on your Nubbin.'),
        N('Then the sky opens. It rains and rains!'),
        RA('Mvua! Mvua! That means rain!'),
        N('Steam rises from the hot rock.'),
        N('The land has been dry for a very long time.'),
        N('Your Nubbin splashes in every puddle.'),
      ],
      [
        ask(
          6,
          'science',
          'plants need water to grow',
          '2-LS2-1',
          [N('The land has been dry for a long time. After the rain, what will the dry grass do?')],
          [
            o(
              'Grow green again',
              [N('Yes! Plants need water. After rain, the grass grows green.')],
              true,
            ),
            o('Turn blue', [N('Grass does not turn blue. With water it grows green.')]),
          ],
          'Learned that plants need water, so dry grass turns green after rain.',
        ),
      ],
      {
        choices: [
          {
            id: 'dance',
            label: 'Dance with Rafiki.',
            then: [RA('Yes! Badly! It is the only way!')],
          },
          {
            id: 'stand',
            label: 'Stand still and let it rain on you.',
            then: [N('You stand still. The rain runs down your collar. You do not mind.')],
          },
          {
            id: 'puddle',
            label: 'Join your Nubbin in the puddles.',
            then: [N('You jump in the biggest puddle together.')],
          },
        ],
      },
    ),
    sc(
      'a23-16-rain-done',
      [
        N('Simba walks up the rock through the rain.'),
        N('Pitter, patter, pitter, patter. The rain makes a beat.'),
        N('He goes to the very top, where his father used to stand.'),
      ],
      [
        doit(
          1,
          'music',
          'soft and loud beats',
          PMP,
          'edu:clap:beat:rain',
          [N('(Tap your fingers softly, like light rain. Then tap harder, like heavy rain.)')],
          'Tapped soft and loud beats like rain.',
        ),
      ],
    ),
    sc(
      'a23-16-roar',
      [
        N('Simba stands at the edge, in the rain.'),
        N('He lifts his head and roars!'),
        N('The roar goes out over the plain. Then it comes back from the hills.'),
        N('Nala and Sarabi roar back. Then all the lionesses.'),
        N('Your Nubbin takes a deep breath. It squeaks a tiny squeak.'),
        N('Simba looks down. He roars again, gently, just for it.'),
      ],
      [
        ask(
          2,
          'science',
          'sound can bounce back as an echo',
          '1-PS4-1',
          [N('The roar bounced off the hills and came back. What is that called?')],
          [
            o(
              'An echo',
              [N('Yes! An echo is a sound that bounces back. Try it in a big room!')],
              true,
            ),
            o('A shadow', [N('A shadow is made by light. A sound that bounces back is an echo.')]),
            o('A rainbow', [
              N('A rainbow is made by light and rain. A sound that comes back is an echo.'),
            ]),
          ],
          'Learned that a sound that bounces back is an echo.',
        ),
      ],
      {
        choices: [
          {
            id: 'roar',
            label: 'Roar too.',
            then: [N('You roar. It is not very good. Pumbaa joins in, louder.')],
          },
          {
            id: 'again',
            label: 'Help your Nubbin try again.',
            then: [N('It tries again. A slightly bigger squeak. It looks very pleased.')],
          },
        ],
      },
    ),
    sc(
      'a23-16-roar-done',
      [
        N('The page turns slowly, like someone staying on the last good bit.'),
        N('Rain, then sun, then rain again.'),
        N('The wet times and the dry times come round each year.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'places on the map: real savannas in East Africa',
          'D2.Geo.2.K-2',
          [
            N(
              'The plain in this story is made up. Real savannas like it are in which part of the world?',
            ),
          ],
          [
            o(
              'East Africa, in Kenya and Tanzania',
              [N('Yes! Real savannas with giraffes and zebras are in Kenya and Tanzania.')],
              true,
            ),
            o('The North Pole', [
              N('The North Pole is icy. Savannas are warm and grassy, in places like Kenya.'),
            ]),
            o('Under the sea', [
              N('Fish live under the sea. Giraffes live on savannas, in Kenya and Tanzania.'),
            ]),
          ],
          'Learned that real savannas like the one in the story are found in East Africa.',
        ),
      ],
    ),
    sc(
      'a23-16-green',
      [
        N('Now the plain is green again, all the way to the hills.'),
        N('The river is full. The herds are back.'),
        N('Giraffes walk by with their heads high. Twiga!'),
        N('Three giraffes. Then one more joins them.'),
        N('All the animals gather below the rock.'),
        N('At the top, Simba stands tall. Nala holds something small between her paws.'),
        N('A tiny cub, three days old.'),
      ],
      [
        ask(
          3,
          'maths',
          'add one more',
          'K.OA.A.1',
          [N('Three giraffes walk by. One more joins them. How many now?')],
          [
            o('Four', [N('Yes! Three and one more is four. Twiga, twiga, twiga, twiga!')], true),
            o('Two', [N('Two is fewer than three. Three and one more makes four.')]),
          ],
          'Added one more to three with objects.',
        ),
      ],
    ),
    sc(
      'a23-16-complete',
      [
        N('Rafiki marks the cub’s brow with a red line.'),
        N('He lifts the cub high over everything.'),
        N('The whole plain kneels.'),
        TI('Hey! Guest! Come and stand with family!'),
        PU('We came all this way together.'),
        N('You stand with them while the plain kneels.'),
        N('Then the light comes, and the kitchen table.'),
        N('Nova’s atlas lies open at a green plain.'),
        N('A new bookmark lies between the pages. It smells of rain.'),
      ],
      [
        ask(
          4,
          'sel',
          'friends make room for you',
          'CASEL: Relationship skills',
          [N('Pumbaa says you stand with them. What does it show?')],
          [
            o(
              'They care about you',
              [N('Yes. Making room for someone shows we care about them.', 'soft')],
              true,
            ),
            o('They are bossy', [N('They were being kind. They made room for a friend.')]),
          ],
          'Noticed that making room for someone shows we care.',
        ),
      ],
    ),
  ],
);

// ================================================================== variants (A23_VARIANTS)
/** Sprout versions of every scene in A23_VARIANTS (the Rafiki path, the Grove scenes, the margin note). */
export const EDU_A23_SPROUT_VARIANTS: EduScene[] = [
  // ---- Rafiki path, A23-10
  sc(
    'a23-10-desert-rafiki',
    [
      N('It is dark when you reach the baobab.'),
      N('Rafiki sits in the fork of the tree. He already knows.'),
      RA('Bring him up. Slowly.'),
      N('He looks at the wing you bound. He does not undo it.'),
      RA('Good work. Slow work. Polepole.'),
      ZA('The king, Rafiki. And the boy…'),
      RA('I know. Hush. Rest now.'),
      N('Zazu falls asleep on a bed of leaves.'),
    ],
    [
      ask(
        4,
        'health',
        'a hurt body needs rest and care',
        PMP,
        [N('Zazu’s wing is hurt. What does a hurt wing need most?')],
        [
          o(
            'Rest and gentle care',
            [N('Yes. Resting and gentle care help a hurt wing mend.')],
            true,
          ),
          o('Flapping hard', [
            N('Flapping would hurt it more. Rest and gentle care help it mend.'),
          ]),
        ],
        'Learned that a hurt body needs rest and gentle care.',
      ),
    ],
    {
      choices: [
        {
          id: 'tell',
          label: 'Tell Rafiki what you saw.',
          then: [N('You tell him all of it. He listens and nods slowly.')],
        },
        {
          id: 'sit',
          label: 'Sit down beside him and say nothing.',
          then: [N('You sit beside him. After a while, he puts his old hand on yours.')],
        },
      ],
    },
  ),
  sc(
    'a23-10-desert-done-rafiki',
    [
      N('Rafiki climbs up inside the tree in the dark.'),
      N('He stands in front of the painted cub.'),
      N('Rafiki thinks Simba is lost for ever. He is very sad.'),
      N('He wipes the painted cub off the wall.'),
      RA('Pole sana, little one. Pole sana.'),
      N('Pole sana means “I am so sorry” in Swahili.'),
    ],
    [
      ask(
        5,
        'literacy',
        'a Swahili phrase for sympathy',
        LANG,
        [N('Rafiki says pole sana. What is he telling the little cub on the wall?')],
        [
          o(
            'I am so sorry',
            [N('Yes. Pole sana is a kind thing to say when someone is sad.')],
            true,
          ),
          o('Hello', [N('Hello is jambo. Pole sana means I am so sorry.')]),
          o('Thank you', [N('Thank you is asante. Pole sana means I am so sorry.')]),
        ],
        'Learned the Swahili phrase pole sana (I am so sorry).',
      ),
    ],
  ),
  sc(
    'a23-10-help-rafiki',
    [
      N('In the morning, you climb the baobab with Rafiki.'),
      N('A thin dark lion stands on top of the rock.'),
      RA('Scar.'),
      N('Up the path come hyenas. Many, many hyenas.'),
      ZA('I must go back. Someone must stand by the queen.'),
      RA('Your wing, Zazu.'),
      ZA('I will walk. Hornbills are excellent at walking.'),
    ],
    [
      ask(
        6,
        'sel',
        'asking for help when we are hurt',
        'CASEL: Responsible decision-making',
        [N('Zazu is hurt, but he wants to go back. What could he do?')],
        [
          o(
            'Ask a friend to help him',
            [N('Yes. Asking for help is a clever, brave thing to do.')],
            true,
          ),
          o('Go alone and say nothing', [
            N('Going alone with a hurt wing is hard. It is wise to ask a friend.'),
          ]),
        ],
        'Thought about asking for help when we are hurt.',
      ),
    ],
    {
      choices: [
        {
          id: 'help',
          label: 'Help Zazu down the tree.',
          then: [N('You carry him down. He walks off with his chin up.')],
        },
        {
          id: 'stay',
          label: 'Ask him to stay.',
          then: [ZA('I cannot. It is my job.')],
        },
      ],
    },
  ),
  sc(
    'a23-10-complete-rafiki',
    [
      N('That evening you sit with Rafiki in the tree.'),
      N('Rafiki has four gourds on a shelf. He mends them one by one.'),
      RA('Hard days have come. We watch. We carry water. We wait.'),
      RA('Waiting is not nothing. Done well, it is hard work.'),
      N('Your Nubbin looks up at the smudge where the cub was.'),
    ],
    [
      doit(
        1,
        'maths',
        'count four',
        'K.CC.B.5',
        'edu:count:gourds:4',
        [N('(Count the gourds on Rafiki’s shelf: one, two, three, four.)')],
        'Counted four gourds.',
      ),
    ],
  ),
  // ---- Rafiki path, A23-11
  sc(
    'a23-11-oasis-rafiki',
    [
      N('The page turns its seasons, one after another. Each is drier.'),
      N('The herds go first. One day the zebra are there. Next, a line of dust.'),
      N('The grass goes yellow, then grey. The river shrinks to mud.'),
      RA('A plain is everyone on it, looking after each other.'),
      N('Every day you carry water up to the rock in Rafiki’s gourds.'),
      RA('Polepole. You walk too fast in this heat.'),
    ],
    [
      ask(
        2,
        'science',
        'animals move to where their needs are met',
        'K-ESS3-1',
        [N('The grass is gone and the river is mud. Why do the herds leave?')],
        [
          o(
            'To find new grass and water',
            [N('Yes! Animals go where they can find food and water.')],
            true,
          ),
          o('To play a game', [
            N(
              'They leave because they are hungry and thirsty. They are looking for grass and water.',
            ),
          ]),
        ],
        'Learned that animals move to places where they can find food and water.',
      ),
    ],
    {
      choices: [
        {
          id: 'carry',
          label: 'Carry an extra gourd up the rock.',
          then: [N('It is heavy. You carry it all the way up.')],
        },
        {
          id: 'rest',
          label: 'Rest in the shade first.',
          then: [RA('Good. Resting is part of carrying.')],
        },
      ],
    },
  ),
  sc(
    'a23-11-oasis-done-rafiki',
    [
      N('Up at the rock, hyenas lie about in the shade.'),
      N('There is nothing left for them to eat.'),
      N('Zazu is up there too, stuck near Scar’s place.'),
      N('He sees you. He lifts his chin.'),
    ],
    [
      ask(
        3,
        'sel',
        'guessing how a friend feels',
        'CASEL: Social awareness',
        [N('Zazu sees you, and he lifts his chin. How might he feel?')],
        [
          o('Hopeful, because a friend came', [N('Yes. Seeing a friend gives us hope.')], true),
          o('Sleepy', [N('A lifted chin looks hopeful, not sleepy.')]),
        ],
        'Guessed a friend’s feeling (hope) from how they look.',
      ),
    ],
  ),
  sc(
    'a23-11-grubs-rafiki',
    [
      N('At the top of the rock, the lionesses come back from hunting.'),
      N('They have found nothing to eat. They are tired and hungry.'),
      N('Four lionesses walk in a line. Sarabi is at the front.'),
      SC('Sarabi. Where is the food?'),
      SB('There is nothing left, Scar. We should follow the herds.'),
      N('You set your gourd down at Sarabi’s feet.'),
      N('She drinks a little. She gives the rest to the youngest lioness.'),
      SB('Asante. Tell Rafiki we are still here.'),
    ],
    [
      doit(
        2,
        'maths',
        'count four',
        'K.CC.B.5',
        'edu:count:lionesses:4',
        [N('(Count the lionesses in the line: one, two, three, four.)')],
        'Counted four lionesses.',
      ),
    ],
    {
      choices: [
        {
          id: 'stand',
          label: 'Stand beside Sarabi.',
          then: [N('Scar looks at you crossly. You stand beside her and do not move.')],
        },
        {
          id: 'cubs',
          label: 'Let your Nubbin play with the cubs.',
          then: [N('The cubs tumble about with your Nubbin. For a minute, nobody is hungry.')],
        },
      ],
    },
  ),
  sc(
    'a23-11-complete-rafiki',
    [
      N('That night someone scratches at the baobab.'),
      N('It is Nala, grown up and thin as a reed.'),
      NA('I am going to find help. Anyone. Anything.'),
      RA('Go with her. Carry water. She will need it.'),
      N('You fill every gourd you can carry.'),
      NA('Come on, then. Keep up.'),
      RA('Polepole! Slowly, now.'),
    ],
    [
      ask(
        4,
        'social-studies',
        'sharing scarce water fairly',
        'D2.Civ.8.K-2',
        [N('Water is short. What is the fair way to use the gourds?')],
        [
          o(
            'Share it with those who need it most',
            [N('Yes. Sharing fairly helps everyone.')],
            true,
          ),
          o('Keep it all for yourself', [
            N('When water is short, sharing is the fair thing to do.'),
          ]),
        ],
        'Thought about sharing a scarce resource (water) fairly.',
      ),
    ],
  ),
  // ---- Rafiki path, A23-12
  sc(
    'a23-12-hunt-rafiki',
    [
      N('Two days out in the desert, the gourds are nearly empty.'),
      N('Then the sand turns to scrub, and the scrub to green.'),
      N('There are waterfalls, ferns and trees full of fruit.'),
      NA('Warthog.'),
      N('Nala races into the long grass, low and fast.'),
      PU('Aaagh! She is going to eat me!'),
      N('A young lion jumps out of the ferns. They roll in the mud.'),
      SI('Nala?'),
    ],
    [
      ask(
        2,
        'science',
        'animals live where their needs are met',
        'K-ESS3-1',
        [N('So many animals live by the waterfalls and ferns. Why?')],
        [
          o(
            'There is water and food here',
            [N('Yes! Animals live where they find water and food.')],
            true,
          ),
          o('There are no animals here', [
            N('Look! Pumbaa, a meerkat and fruit trees are here. Water and food bring animals.'),
          ]),
        ],
        'Learned that animals live where they can find water and food.',
      ),
    ],
    {
      choices: [
        {
          id: 'hold',
          label: 'Hold on to your Nubbin.',
          then: [N('It wants to help. You hold on anyway.')],
        },
        {
          id: 'run',
          label: 'Run after her.',
          then: [N('You get there out of breath, just in time to see who it is.')],
        },
      ],
    },
  ),
  sc(
    'a23-12-hunt-done-rafiki',
    [
      SI('You! Rafiki’s guest. You have not changed at all!'),
      Y('It is a long story. There is a book in it.'),
      NA('Rafiki sent them with me. Simba, we all thought you were lost.'),
    ],
    [
      ask(
        0,
        'sel',
        'naming the feeling of surprise',
        'CASEL: Self-awareness',
        [N('Simba’s mouth falls open when he sees you. How does he feel?')],
        [
          o(
            'Surprised',
            [N('Yes. Surprised! A mouth that falls open is a surprised mouth.')],
            true,
          ),
          o('Bored', [N('Bored faces look sleepy. A mouth that falls open means surprise.')]),
        ],
        'Named the feeling of surprise.',
      ),
    ],
  ),
  sc(
    'a23-12-complete-rafiki',
    [
      N('They come back. Nala will not look at Simba.'),
      NA('Go back to Rafiki. Tell him Simba is alive.'),
      NA('Tell him Simba will not come. I am staying with him.'),
      SI('Rafiki? He thinks I am…'),
      N('He does not finish. He walks off into the dark alone.'),
      N('You fill your gourds and turn for home across the desert.'),
    ],
    [
      ask(
        4,
        'literacy',
        'name who did what in the story',
        'RL.K.3',
        [N('Who is staying with Simba, even though he is sad?')],
        [
          o('Nala', [N('Yes. Nala stays with Simba. She does not give up on him.')], true),
          o('You', [N('You are going home to tell Rafiki. Nala is the one staying.')]),
        ],
        'Recalled who stayed with Simba.',
      ),
    ],
  ),
  // ---- Rafiki path, A23-13
  sc(
    'a23-13-ridge-rafiki',
    [
      N('You cross the desert back the way you came.'),
      N('Rafiki sees you coming. He hurries down to meet you.'),
      RA('Polepole. Breathe first. Then tell me.'),
      Y('Simba is alive. He is grown up. He will not come home.'),
      N('Rafiki sits down hard on a root.'),
      RA('Alive. And I wiped him off my wall. Oh, I am a silly old man.'),
    ],
    [
      ask(
        5,
        'sel',
        'forgiving ourselves when we did not know',
        'CASEL: Social awareness',
        [N('Rafiki is sorry he wiped the cub off the wall. What can you tell him?')],
        [
          o('You did not know', [N('Yes. We can only do our best with what we know.')], true),
          o('Yes, that was silly', [N('Unkind words make it worse. He did not know.')]),
        ],
        'Practised comforting someone who feels bad about a mistake they could not help.',
      ),
    ],
    {
      choices: [
        {
          id: 'known',
          label: 'Tell him he could not have known.',
          then: [RA('No. But I could have hoped.')],
        },
        {
          id: 'wait',
          label: 'Sit down next to him and wait.',
          then: [N('You sit beside him. Your Nubbin climbs into his lap.')],
        },
      ],
    },
  ),
  sc(
    'a23-13-ridge-done-rafiki',
    [
      N('Out over the desert, the wind gets up.'),
      N('It blows through the branches of the baobab. They creak.'),
    ],
    [
      notice(
        1,
        'science',
        'wind is moving air that can make sounds',
        SCI,
        [
          N(
            'Wind is air that moves. When it pushes past branches, it can make creaks and whistles.',
          ),
        ],
        'Heard that wind is moving air and can make sounds.',
      ),
    ],
  ),
  sc(
    'a23-13-wind-rafiki',
    [
      N('A puff of dust blows in. It has gold hairs in it.'),
      N('Rafiki catches it in his fist. He sniffs.'),
      RA('Him! That is the boy, grown up!'),
      N('He laughs and climbs the inside of the tree like a young mandrill.'),
      RA('Paint! Yellow earth! Polepole. But quickly!'),
      N('You mix the yellow earth with shaking hands.'),
      N('Rafiki paints the cub back. He gives it a mane.'),
      RA('There. Now we go and fetch him.'),
    ],
    [
      notice(
        5,
        'art',
        'paint can be made from earth',
        'ELOF: Approaches to Learning',
        [
          N('Long ago, people made paint from earth. Yellow, red and brown earth is called ochre.'),
          N('Rafiki’s yellow paint is made just that way.'),
        ],
        'Heard that ochre is a natural earth colour people have used as paint.',
      ),
    ],
    {
      choices: [
        {
          id: 'mane',
          label: 'Help him with the mane.',
          then: [
            N('You paint the last bit. It comes out lopsided. Rafiki says that is just right.'),
          ],
        },
        {
          id: 'nubbin',
          label: 'Lift your Nubbin up to look.',
          then: [N('Your Nubbin puts its red forehead against the painted lion’s. Nose to nose.')],
        },
      ],
    },
  ),
  sc(
    'a23-13-complete-rafiki',
    [
      N('Rafiki takes his stick and his biggest gourd.'),
      N('He does not lock the tree. He has never locked it.'),
      RA('Come. You know the way now. You are the guide, and I am the guest!'),
      N('You set off across the grey plain with the wind at your backs.'),
      N('Your Nubbin walks in front, very important.'),
    ],
    [
      doit(
        3,
        'music',
        'keep a steady beat',
        PMP,
        'edu:clap:beat:journey',
        [N('(March on the spot to a steady beat. One, two, one, two. Keep it going!)')],
        'Kept a steady marching beat.',
      ),
    ],
  ),
  // ---- the cloud scene after the campaign, the margin note, the Grove painting
  sc(
    'a23-14-clouds-done-after',
    [
      N('Simba stands still in the wind, looking at the sky.'),
      N('Rafiki does not hurry him.'),
      N('Your Nubbin looks up at the clouds. Then it turns and looks at you.'),
      N('Rafiki puts a hand on your shoulder. He says nothing.'),
      N('You stand together, the three of you, until the wind goes down.'),
    ],
    [
      notice(
        3,
        'sel',
        'quiet company helps when we miss someone',
        SE,
        [
          N('Sometimes we miss someone very much. A friend standing beside us helps.'),
          N('We do not have to say anything at all.'),
        ],
        'Heard that quiet company helps when we miss someone.',
      ),
    ],
  ),
  sc(
    'a23-margin-hazel',
    [
      N('Nova’s atlas lies open at the still pool, among the roots.'),
      N('Beside the pool, in faint pencil, there is a note in the margin.'),
      N('You know the handwriting.'),
      N('“We carry the people we love in our faces and our hearts.”'),
      N('It is signed with one letter: H.'),
      N('You touch your own chin. Your Nubbin looks at you, then at the pool.'),
    ],
    [
      ask(
        4,
        'sel',
        'feeling two feelings at once',
        SE,
        [N('You find a note from someone you love. How might that feel?')],
        [
          o(
            'Happy and a little sad, both at once',
            [N('Yes. We can feel two feelings at once. Both are okay.')],
            true,
          ),
          o('Nothing at all', [N('A note from someone we love can make us happy and a bit sad.')]),
        ],
        'Learned that we can feel happy and sad at the same time, and both are okay.',
      ),
    ],
  ),
  sc(
    'a23-16-complete-rafiki',
    [
      N('Rafiki walks to the edge of the rock. He turns round.'),
      N('He holds out a gourd to you.'),
      RA('Here. You crack it.'),
      RA('You carried every gourd. Carry this one the last step.'),
      N('You crack it on his stick. He marks the cub’s brow with red.'),
      N('Then he lifts the cub high. The whole plain kneels.'),
      RA('Asante. Slowly you came, and slowly you stayed. That is how good things get done.'),
      N('Then the light comes, and the kitchen table.'),
      N('A new bookmark lies between the pages. It smells of rain.'),
    ],
    [
      ask(
        3,
        'sel',
        'small steps add up',
        'CASEL: Self-management',
        [N('You carried every gourd, a little at a time. What does that show?')],
        [
          o(
            'Small steps add up to big things',
            [RA('Yes. Slowly, one gourd at a time. Polepole.', 'happy')],
            true,
          ),
          o('Only big steps count', [RA('Small steps count too. Polepole gets us all the way.')]),
        ],
        'Reflected that doing a little at a time (polepole) adds up.',
      ),
    ],
  ),
  sc(
    'a23-grove-painting',
    [
      N('You look into the hollow of Hazel’s crooked tree, as you sometimes do.'),
      N('Something new is inside. It is a little painting on a piece of bark.'),
      N('It is your Nubbin, in yellow ochre, round and pleased.'),
      N('It has a red line across its brow, like the painted cub.'),
      N('Your Nubbin touches its own forehead, where the red mark used to be.'),
      N('Painting someone means you want to remember them. Someone, somewhere, does.'),
    ],
    [
      ask(
        3,
        'art',
        'name the colours in a painting',
        'ELOF: Approaches to Learning',
        [N('The little painting is yellow with a red line. Which two colours?')],
        [
          o(
            'Yellow and red',
            [N('Yes! Yellow ochre and fruit-red, just like Rafiki’s paints.')],
            true,
          ),
          o('Blue and green', [N('Look again. The painting is yellow, with one red line.')]),
        ],
        'Named the colours in a painting (yellow and red).',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A23_SPROUT: EduQuest[] = [
  Q1,
  Q2,
  Q3,
  Q4,
  Q5,
  Q6,
  Q7,
  Q9,
  Q10,
  Q11,
  Q12,
  Q13,
  Q14,
  Q16,
];

/** Every `edu:` check string used by the lessons above. */
export const CHECKS: string[] = [
  'edu:clap:beat:journey',
  'edu:clap:beat:rain',
  'edu:clap:beat:walking',
  'edu:clap:syllables:karibu',
  'edu:count:cub-paws:4',
  'edu:count:friends:5',
  'edu:count:giraffes:4',
  'edu:count:gourds:3',
  'edu:count:gourds:4',
  'edu:count:hyenas:3',
  'edu:count:lionesses:4',
  'edu:count:steps:3',
  'edu:hum:throat:buzz',
  'edu:say:sound-word:psssh',
  'edu:say:word:nyota',
  'edu:sort:food:bugs-or-fruit',
];
