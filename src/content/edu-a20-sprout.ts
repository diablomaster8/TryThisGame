/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Atlas page A20, The
 * Weeping (Baldr and the Fimbulwinter, Snorri Sturluson’s Prose Edda, Iceland).
 *
 * Source: atlas-a20.ts (ATLAS_A20 and ATLAS_A20_VARIANTS). One EduScene per original scene (every
 * step scene, done scene, complete scene and variant), id `sprout:<original id>`, with every choice
 * kept under its original id and `set` flag (`a20-thokk`). All choices are kind and safe, so no
 * `defaultChoice` is needed. Each scene has one lesson (the page-opening scene has two). See
 * EDU-STYLE.md. British spelling. No line of the original or of Brodeur’s translation is used.
 *
 * What it teaches (outline: geography, history, science, culture, feelings): Iceland is an island
 * far to the north; Snorri wrote the stories in a book, by hand, long ago, and some people still
 * honour these gods; frost melts into drops in the sun; mistletoe is a green plant that grows on a
 * branch of another tree; winter days are short in the far north; counting to 9 (the nights) and
 * to 8 (Sleipnir’s legs); first sounds and clapping syllables; what helps when we are worried or
 * sad; and that a trick is not the fault of the one who was tricked.
 *
 * Left out or softened for this age (EDU-STYLE.md, “Hard things”):
 * - Baldr’s death is said plainly (“he has died: his body stopped working, and it will not start
 *   again”), with no wound, then comfort straight away. Hödr is told it was a trick and was not
 *   his fault. Nanna’s death is one plain line; Hel’s hall is “the quiet hall where those who have
 *   died stay”. Nothing is called sleep.
 * - Loki is “a trickster who did a wrong thing”, held still under the ground. The snake and the
 *   venom are left out: drops fall from the rock and Sigyn catches them in a bowl. The shaking is
 *   one wobble. The Ragnarok scene is far-off, small and never reaches the wood.
 * - Frost, mistletoe, winter daylight, dew, seeds and the salmon’s journey are all well
 *   established facts. Mistletoe grows on a host tree and makes its own food in green leaves.
 * - Heathenry is kept respectful (“some people still honour these gods today”). No runes or other
 *   symbols. The gods are shown with dignity. Snorri’s book is “one way the story goes”.
 * - The Nubbin and the animals never speak. Corvin and the Cinder hints are not needed here.
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
const FR = say('a20-frigg');
const FU = say('a20-fulla');
const BA = say('a20-baldr');
const HO = say('a20-hodr');
const TH = say('a20-thor');
const OD = say('a20-odin');
const CR = say('a20-crone');
const VO = say('a20-voice');
const HE = say('a20-hermodr');
const NA = say('a20-nanna');
const MO = say('a20-modgudr');
const HL = say('a20-hel');
const MS = say('a20-messenger');
const TK = say('a20-thokk');
const SI = say('a20-sigyn');
const LI = say('a20-lif');
const LT = say('a20-lifthrasir');
const VI = say('a20-vidarr');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const SE = 'ELOF: Social and Emotional Development';
const LANG = 'ELOF: Language and Communication';
const MATH = 'ELOF: Mathematics Development';
const SCI = 'ELOF: Scientific Reasoning';
const PHYS = 'ELOF: Perceptual, Motor, and Physical Development';

/** One answer option. `best` marks the answer the lesson teaches. */
const opt = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

const ask = (
  after: number,
  domain: EduDomain,
  standard: string,
  skill: string,
  prompt: Line[],
  options: Opt[],
  parentNote: string,
): Beat => ({ domain, skill, standard, kind: 'ask', after, prompt, options, parentNote });

const notice = (
  after: number,
  domain: EduDomain,
  standard: string,
  skill: string,
  lines: Line[],
  parentNote: string,
): Beat => ({ domain, skill, standard, kind: 'notice', after, lines, parentNote });

const doit = (
  after: number,
  domain: EduDomain,
  standard: string,
  skill: string,
  check: string,
  lines: Line[],
  parentNote: string,
): Beat => ({ domain, skill, standard, kind: 'do', after, check, lines, parentNote });

const MAX_WORDS = 14;
const wc = (t: string) => t.trim().split(/\s+/).length;

/**
 * Cuts lines at sentence ends so that every line keeps to the sprout caps (14 words; narration
 * at most two sentences). A cut line keeps its speaker, and its mood stays on the first piece.
 * `map[i]` is the index of the last piece of original line i, so a lesson's `after` can follow.
 */
const split = (lines: Line[]): { lines: Line[]; map: number[] } => {
  const out: Line[] = [];
  const map: number[] = [];
  for (const l of lines) {
    const sentences = l.text.split(/(?<=[.!?”)…])\s+(?=[\p{Lu}“(‘])/u);
    const chunks: string[] = [];
    let count = 0;
    const limit = l.who === 'narrator' ? 2 : 99;
    for (const sentence of sentences) {
      const last = chunks[chunks.length - 1];
      if (last !== undefined && count < limit && wc(`${last} ${sentence}`) <= MAX_WORDS) {
        chunks[chunks.length - 1] = `${last} ${sentence}`;
        count += 1;
      } else {
        chunks.push(sentence);
        count = 1;
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

/** One sprout scene. Lesson ids are `sprout:<of>-l<n>`, numbered in play order. */
const sc = (
  of: string,
  lines: Line[],
  beats: Beat[],
  extra: { choices?: Choice[]; defaultChoice?: string } = {},
): EduScene => {
  const cut = split(lines);
  const { choices, ...rest } = extra;
  return {
    id: `sprout:${of}`,
    of,
    band: 'sprout',
    lines: cut.lines,
    ...rest,
    ...(choices ? { choices: choices.map((c) => (c.then ? { ...c, then: sp(c.then) } : c)) } : {}),
    lessons: [...beats]
      .sort((a, b) => a.after - b.after)
      .map((b, i) => ({
        id: `sprout:${of}-l${i + 1}`,
        ...b,
        after: cut.map[b.after] ?? b.after,
        ...(b.prompt ? { prompt: sp(b.prompt) } : {}),
        ...(b.lines ? { lines: sp(b.lines) } : {}),
        ...(b.options ? { options: b.options.map((o) => ({ ...o, reply: sp(o.reply) })) } : {}),
      })),
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

// ================================================================== A20-1 The Bright One
const Q01 = quest(
  'a20-01',
  'The Bright One',
  {
    'a20-01-s1': {
      goal: 'Step into the grey and gold page. Find Frigg’s hall.',
      hint: 'Touch the page. Then go in at the door.',
    },
    'a20-01-s2': {
      goal: 'Carry Frigg’s cloak up the hill.',
      hint: 'Follow the path up to the pale hall.',
    },
    'a20-01-s3': {
      goal: 'Sit with Baldr while your Nubbin sleeps.',
      hint: 'Sit on the bench. There is no hurry.',
    },
  },
  [
    sc(
      'a20-01-page',
      [
        N('Nova’s atlas opens at a grey and gold page.'),
        N('This is a very old story, from a land called Iceland.'),
        N('A man named Snorri wrote it down, long, long ago.'),
        N('His book tells one way the story goes.'),
        N('Some people still honour these gods today.'),
        N('Whoosh! The page goes soft, and you step inside.'),
        N('This is Frigg’s hall. Her spindle goes whirr, whirr, whirr.'),
        FR('Come in, guest. This is Fensalir. Will you run errands for me?', 'soft'),
        FU('Can the little one carry things?'),
        N('Your Nubbin holds up both arms. Yes!'),
      ],
      [
        ask(
          1,
          'science',
          '2-ESS2-2',
          'Iceland is an island: land with water all around',
          [
            N('Iceland is an island, far away to the north.'),
            N('(Point to the sea on the page.) What is all around an island?'),
          ],
          [
            opt('Water', [N('Yes! An island has water all the way around it.')], true),
            opt('Sand', [N('Some islands have sand. But water goes all the way around.')]),
            opt('A fence', [N('No fence. The sea is what goes all the way around.')]),
          ],
          'Learned that Iceland is an island, with sea all around it.',
        ),
        notice(
          3,
          'social-studies',
          'D2.His.2.K-2',
          'books were made by hand long ago',
          [
            N('Snorri wrote with a pen, on pages made of calfskin.'),
            N('There were no printers. Every book was made by hand.'),
          ],
          'Heard that Snorri wrote the stories in a handmade book long ago.',
        ),
      ],
      {
        choices: [
          {
            id: 'bow',
            label: 'Bow to Frigg, nice and low.',
            then: [
              N('Frigg bows back, just as low.'),
              FR('Guests and hosts bow the same, in this house.'),
            ],
          },
          {
            id: 'name',
            label: 'Say your name.',
            then: [FR('A good name. I will remember it.', 'soft')],
          },
          {
            id: 'carry',
            label: 'Ask what to carry first.',
            then: [FU('Oh, I like this one!', 'happy')],
          },
        ],
      },
    ),
    sc(
      'a20-01-ember',
      [
        N('Your Nubbin has a little lantern. A red pebble glows inside.'),
        N('The pebble is warm, but there is no flame.'),
        FU('My hands feel warm, just being near it.', 'soft'),
        FR('Someone gave that away. Keep it close, little one.', 'soft'),
      ],
      [
        ask(
          1,
          'science',
          'K-PS3-1',
          'sunshine and warm things',
          [N('The pebble makes hands feel warm. What else can warm us up?')],
          [
            opt('A sunny spot', [N('Yes! Sunshine warms the ground, and it warms us.')], true),
            opt('An ice cube', [N('Brr! An ice cube is cold. It makes hands colder.')]),
            opt('A cold wind', [N('A cold wind makes us shiver. Sunshine is better.')]),
          ],
          'Talked about things that warm us, like the sun.',
        ),
      ],
    ),
    sc(
      'a20-01-page-done',
      [
        FR('The first errand is easy. Take this cloak up the hill to my son.'),
        FU('The hall is called Breidablik. You cannot miss it.'),
      ],
      [
        doit(
          1,
          'literacy',
          'RF.K.2',
          'clap the parts of a name',
          'edu:clap:syllables:breidablik',
          [
            N('Let’s clap the name. Brei - da - blik. (Clap three times.)'),
            N('Three claps, three parts. (Now try Fen - sa - lir.)'),
          ],
          'Clapped the syllables in Breidablik and Fensalir.',
        ),
      ],
    ),
    sc(
      'a20-01-hall',
      [
        N('Breidablik stands high on a hill. Its roof is pale as the sky.'),
        N('A man sits at a long table, mending a strap.'),
        N('He is so kind and so glad that he seems to shine.'),
        BA('You came from my mother. I know her cloak.', 'happy'),
        BA('Put it down, and sit. Everyone who climbs should rest.'),
        N('Your Nubbin sits in his light. Blink. Blink. Then it tips over, fast asleep.'),
        BA('Shh. The small ones do that. Let it sleep.', 'soft'),
      ],
      [
        ask(
          2,
          'science',
          '1-PS4-2',
          'we see things when there is light',
          [N('Baldr’s light fills the hall, so we can see everything. What do we need to see?')],
          [
            opt('Light', [N('Yes! We see things when there is light.')], true),
            opt('Quiet', [N('Quiet is nice for sleeping. But to see, we need light.')]),
            opt('Cold', [N('Cold does not help us see. Light does.')]),
          ],
          'Learned that we need light to see.',
        ),
      ],
    ),
    sc(
      'a20-01-hall-done',
      [
        N('Your Nubbin is fast asleep in the brightest patch of floor.'),
        N('It snores a tiny snore. Pff. Pff.'),
        N('Baldr tiptoes round it, and bumps the table. Bonk!'),
        BA('Ow. Sorry, table.', 'happy'),
        BA('Stay till it wakes. I would like the company.'),
      ],
      [
        ask(
          3,
          'health',
          PHYS,
          'sleep helps bodies rest and grow',
          [N('Little ones need lots of sleep. Why?')],
          [
            opt(
              'It helps their bodies rest and grow',
              [N('Yes! Sleep is how little bodies rest and grow.')],
              true,
            ),
            opt('It makes them noisy', [N('Not noisy! Sleep helps bodies rest and grow.')]),
            opt('They do not need it', [
              N('Everybody needs sleep. It helps bodies rest and grow.'),
            ]),
          ],
          'Talked about why sleep matters for growing bodies.',
        ),
      ],
    ),
    sc(
      'a20-01-sit',
      [
        N('You sit on the bench. Baldr mends his strap. Stitch, stitch.'),
        BA('Everyone climbs up here with a question.'),
        BA('I like the part of the day when I listen.', 'happy'),
        BA('Ask me something. Or don’t.'),
      ],
      [
        ask(
          2,
          'sel',
          'CASEL: Relationship skills',
          'being kind by sitting quietly beside someone',
          [N('A friend is quiet and does not want to talk. What can we do?')],
          [
            opt(
              'Sit beside them',
              [N('Yes. Sitting close shows we care, even with no words.')],
              true,
            ),
            opt('Shout at them', [
              N('Shouting is too loud. Sitting quietly beside them is kinder.'),
            ]),
            opt('Run away', [N('Staying close is kinder. Sit beside them.')]),
          ],
          'Talked about staying close to a quiet friend.',
        ),
      ],
      {
        choices: [
          {
            id: 'bright',
            label: 'Ask why he shines.',
            then: [BA('I do not know. I have never been anything else.', 'think')],
          },
          {
            id: 'brother',
            label: 'Ask about his brothers.',
            then: [BA('Hödr. He cannot see, but he hears everything.', 'happy')],
          },
          {
            id: 'sit',
            label: 'Just sit.',
            then: [
              N('So you sit. Baldr sits too. Nobody says a word.'),
              BA('That was a good question.', 'soft'),
            ],
          },
        ],
      },
    ),
    sc(
      'a20-01-complete',
      [
        N('Your Nubbin wakes when the light moves across the floor.'),
        BA('It will follow me now. The small ones do.', 'soft'),
        N('He folds the cloak and puts it on the bench.'),
        BA('Tell my mother I will wear it.', 'happy'),
        N('On the way down, your Nubbin keeps looking back.'),
      ],
      [
        ask(
          3,
          'maths',
          'K.G.A.1',
          'on and under',
          [N('Baldr put the cloak on the bench. Is it on the bench, or under it?')],
          [
            opt('On the bench', [N('Yes! On means on top. The cloak is on the bench.')], true),
            opt('Under the bench', [
              N('Under means below. The cloak is on top, so it is on the bench.'),
            ]),
          ],
          'Used the words on and under for where things are.',
        ),
      ],
    ),
  ],
);

// ================================================================== A20-2 Bad Dreams
const Q02 = quest(
  'a20-02',
  'Bad Dreams',
  {
    'a20-02-s1': {
      goal: 'Take lamp oil up to Baldr.',
      hint: 'Fulla has the jar. Carry it up the hill.',
    },
    'a20-02-s2': {
      goal: 'Walk down with Baldr to tell the gods.',
      hint: 'Go with Baldr and wait by the door.',
    },
    'a20-02-s3': {
      goal: 'Help in the hall while the gods talk.',
      hint: 'Feed the fire. Fill the cups. Or just listen.',
    },
  },
  [
    sc(
      'a20-02-oil',
      [
        N('It is late. Fulla holds a jar of lamp oil.'),
        FU('His lamp burns all night. Take this up to him?'),
        N('Your Nubbin carries the lid. It holds it up like a shield!'),
        N('Baldr sits at his table. His cup has gone cold.'),
        BA('Oh, it is you. I am glad it is you.', 'soft'),
        BA('I keep having a bad dream. I go down a long road.', 'sad'),
        BA('It makes me worried. I have not told anyone.', 'sad'),
        N('Your Nubbin climbs up beside him and sits very close.'),
      ],
      [
        ask(
          6,
          'sel',
          SE,
          'telling someone when you are worried',
          [N('Baldr is worried. What could help him?')],
          [
            opt(
              'Tell someone he trusts',
              [BA('Yes. Telling someone helps. It is hard alone.', 'soft')],
              true,
            ),
            opt('Keep it a secret', [
              BA('Secrets make a worry feel bigger. Telling helps.', 'soft'),
            ]),
            opt('Pretend it is not there', [
              BA('I tried that. The dream stayed. Telling helps more.', 'think'),
            ]),
          ],
          'Talked about telling someone you trust when you are worried.',
        ),
      ],
      {
        choices: [
          {
            id: 'only',
            label: 'Say a dream is only a dream.',
            then: [BA('I keep telling myself that. It is hard to believe.', 'think')],
          },
          {
            id: 'tell',
            label: 'Say he should tell the others.',
            then: [BA('Yes. You are right. It is worse alone.')],
          },
          {
            id: 'wait',
            label: 'Sit and wait.',
            then: [N('You sit. He puts his hand on your Nubbin’s head.')],
          },
        ],
      },
    ),
    sc(
      'a20-02-oil-done',
      [
        BA('In the morning I will tell them all. Walk with me?'),
        N('He sleeps a little. The lamp stays lit, and you keep watch.'),
      ],
      [
        ask(
          1,
          'science',
          '1-ESS1-1',
          'the sun comes up in the morning',
          [N('The lamp is lit because it is night. When does the sun come up?')],
          [
            opt(
              'In the morning',
              [N('Yes! The sun comes up in the morning, and the dark goes.')],
              true,
            ),
            opt('At bedtime', [
              N('At bedtime it is getting dark. The sun comes up in the morning.'),
            ]),
          ],
          'Talked about night and morning.',
        ),
      ],
    ),
    sc(
      'a20-02-telling',
      [
        N('In the morning the gods meet in their great hall.'),
        N('Baldr tells them about the road, and the bad dream.'),
        TH('A dream is only smoke. Show me the trouble and I will fix it.'),
        OD('Not every trouble is easy to see.', 'think'),
        FR('Then we will find it. Whatever it is.'),
        N('The talk goes on and on. You find a stool by the door.'),
      ],
      [
        ask(
          1,
          'literacy',
          'RF.K.2',
          'first sounds',
          [N('Baldr starts with the sound buh. Which word starts with buh too?')],
          [
            opt('Bear', [N('Yes! Buh-buh-bear. Baldr and bear both start with buh.')], true),
            opt('Fox', [N('Fox starts with fuh. Baldr starts with buh, like bear.')]),
            opt('Hare', [N('Hare starts with huh. Baldr starts with buh, like bear.')]),
          ],
          'Matched words by their first sound (b for Baldr and bear).',
        ),
      ],
    ),
    sc(
      'a20-02-telling-done',
      [
        N('The talk goes on all morning, and into the night.'),
        N('You carry three cups to the table. Then two more.'),
        N('You listen to everything.'),
      ],
      [
        ask(
          1,
          'maths',
          'K.OA.A.2',
          'add 3 and 2',
          [N('You carried three cups, then two more. How many cups is that?')],
          [
            opt('Five', [N('Yes! One, two, three, four, five. Five cups.')], true),
            opt('Four', [N('Let’s count: one, two, three, four, five. It is five.')]),
            opt('Six', [N('Let’s count: one, two, three, four, five. Five cups.')]),
          ],
          'Added 3 and 2 using cups.',
        ),
      ],
    ),
    sc(
      'a20-02-council',
      [
        N('The hall gets dark. The fire is low.'),
        TH('We could stand round him, day and night.'),
        OD('Then he would live in a ring of spears. No.', 'sad'),
        BA('I would rather not. I would miss people.', 'soft'),
        FR('Then I will ask. Everything in the world will promise not to hurt him.', 'think'),
        TH('Everything? That is a great deal of everything.'),
        FR('Then I had better start early.'),
      ],
      [
        ask(
          3,
          'sel',
          'CASEL: Self-awareness',
          'who we like to be with',
          [N('Baldr would miss people. Who do you like to be with? (Wait for an answer.)')],
          [
            opt('My family', [N('Family is a good answer. Being together feels safe.')]),
            opt('My friends', [N('Friends are a good answer. Being together feels happy.')]),
            opt('My pet', [N('A pet is a good answer. Being together feels cosy.')]),
          ],
          'Named the people and pets they like to be with.',
        ),
      ],
      {
        choices: [
          {
            id: 'fire',
            label: 'Build the fire up.',
            then: [N('You build up the fire. Odin nods at you.')],
          },
          {
            id: 'cups',
            label: 'Fill the cups.',
            then: [N('You fill the cups. Thor’s hands are steady now.')],
          },
          {
            id: 'listen',
            label: 'Sit by the door and listen.',
            then: [N('You sit by the door and listen.')],
          },
        ],
      },
    ),
    sc(
      'a20-02-complete',
      [
        N('By dawn the gods have a plan.'),
        FR('Tomorrow we walk. We will ask the whole world.', 'soft'),
        BA('Mother, you do not have to.'),
        FR('I know.'),
        N('Your Nubbin falls asleep. You carry it down the hill.'),
      ],
      [
        ask(
          0,
          'literacy',
          'RL.K.3',
          'what happens first, next and last',
          [
            N('Let’s tell it in order. First, Baldr told his dream.'),
            N('Next, the gods made a plan. What will they do last, tomorrow?'),
          ],
          [
            opt(
              'Walk and ask the whole world',
              [N('Yes! First the dream, next the plan, last the walk.')],
              true,
            ),
            opt('Go to sleep for a year', [N('No, they have work to do. Last comes the walk.')]),
            opt('Have a big party', [N('Not a party. Last comes the walk, to ask the world.')]),
          ],
          'Put the story in order: first, next, last.',
        ),
      ],
    ),
  ],
);

// ================================================================== A20-3 The Oaths
const Q03 = quest(
  'a20-03',
  'The Oaths',
  {
    'a20-03-s1': {
      goal: 'Walk with Frigg while she asks the fire, the water and the stones.',
      hint: 'Keep one step behind Frigg.',
    },
    'a20-03-s2': {
      goal: 'Carry Frigg’s asking to the animals and birds.',
      hint: 'Go over the meadows and along the edge of the wood.',
    },
    'a20-03-s3': {
      goal: 'Let your Nubbin make its own promise.',
      hint: 'Bring your Nubbin to Frigg on the step.',
    },
  },
  [
    sc(
      'a20-03-asking',
      [
        N('Frigg walks out at first light. Fulla, you and your Nubbin follow.'),
        N('She asks the fire. The flames lie down low.'),
        N('She asks the water. It goes still as glass.'),
        N('She asks the iron. Every blade on the wall rings.'),
        N('She asks the stones and the trees, one by one.'),
        FR('Everything can be asked. It only takes time.'),
        N('Past an old oak, you see a tiny green sprig. It has two leaves.'),
        N('Your Nubbin stops to look. Frigg walks on.'),
      ],
      [
        doit(
          4,
          'science',
          'ELOF: Scientific Reasoning',
          'sorting materials: stone, wood, iron, water',
          'edu:sort:materials:hard-or-soft',
          [
            N('Frigg asked iron, stone, wood and water. (Point to each one in the picture.)'),
            N('Which of these is hard and strong: iron, or water? (Tap the hard one.)'),
          ],
          'Compared materials: hard iron and stone, and flowing water.',
        ),
      ],
    ),
    sc(
      'a20-03-asking-done',
      [FR('The animals and birds now. My feet are tired. Will you carry my asking?')],
      [
        ask(
          0,
          'sel',
          SE,
          'asking for help, and saying yes',
          [N('Frigg is tired and asks for help. Is asking for help a good thing to do?')],
          [
            opt(
              'Yes, it is brave and sensible',
              [FR('Yes. Asking for help is a good thing. Thank you.', 'soft')],
              true,
            ),
            opt('No, we should do it all alone', [
              FR('Doing it all alone is very hard. Asking is wise.', 'soft'),
            ]),
          ],
          'Talked about how asking for help is a good thing to do.',
        ),
      ],
    ),
    sc(
      'a20-03-beasts',
      [
        N('You carry Frigg’s asking over the meadows.'),
        N('The hare thumps the ground. The bear lies down flat.'),
        N('The reindeer lowers her antlers to the grass.'),
        N('The birds all fly up in one big cloud, and come down again.'),
        N('Your Nubbin tugs your sleeve. Nobody has asked it.'),
      ],
      [
        ask(
          3,
          'science',
          'K-ESS3-1',
          'animals live where their needs are met',
          [N('Birds live in trees and nests. What do birds need from trees?')],
          [
            opt(
              'A safe place to rest and make a nest',
              [N('Yes! Trees give birds a safe home.')],
              true,
            ),
            opt('A swimming pool', [N('Not a pool! Birds use trees for homes and nests.')]),
          ],
          'Learned that trees are homes for birds.',
        ),
      ],
    ),
    sc(
      'a20-03-promise',
      [
        N('Frigg sits on the step. Your Nubbin walks up to her.'),
        N('It stands up as straight as it can.'),
        FU('Oh. It wants to be asked.', 'soft'),
        FR('Of course. Everything should be. Come here, little one.'),
        FR('Will you promise not to hurt my son?'),
        N('Your Nubbin thinks about it very seriously.'),
      ],
      [
        ask(
          5,
          'sel',
          'CASEL: Responsible decision-making',
          'keeping a promise',
          [N('A promise is something we say, and then we do. What do we do with a promise?')],
          [
            opt(
              'Keep it',
              [FR('Yes. We keep our promises. It is how friends trust us.', 'soft')],
              true,
            ),
            opt('Forget it', [
              FR('Forgetting can hurt a friend. We try to keep promises.', 'soft'),
            ]),
          ],
          'Talked about what a promise means and keeping it.',
        ),
      ],
      {
        choices: [
          {
            id: 'paw',
            label: 'Let it put its paw in Frigg’s hand.',
            then: [N('Your Nubbin puts its paw in her hand.'), FR('That will hold.', 'soft')],
          },
          {
            id: 'bow',
            label: 'Let it bow, like the hare.',
            then: [N('It bows so low it nearly topples.'), FR('Twice promised!', 'happy')],
          },
          {
            id: 'for',
            label: 'Promise for it.',
            then: [
              FR('No. Let it promise for itself.'),
              N('Your Nubbin nods hard, three times. Frigg nods back.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a20-03-complete',
      [
        N('By evening, everything has promised.'),
        N('Fire, water, iron, stones and trees all said yes.'),
        FR('Everything has promised. Everything I could think of.', 'soft'),
        N('Frigg gives you her spindle. Your Nubbin falls asleep on the step.'),
      ],
      [
        doit(
          1,
          'maths',
          'K.CC.B.5',
          'count to 5',
          'edu:count:promises:5',
          [
            N('Let’s count the promises on your fingers. Fire. Water. Iron.'),
            N('Stones. Trees. (Count each one. How many did you get?)'),
          ],
          'Counted five things on their fingers.',
        ),
      ],
    ),
  ],
);

// ================================================================== A20-4 The Game
const Q04 = quest(
  'a20-04',
  'The Game',
  {
    'a20-04-s1': {
      goal: 'Go with the gods to the Thing-field.',
      hint: 'Follow the crowd to the ring of stones.',
    },
    'a20-04-s2': {
      goal: 'Join the game, or watch from the edge.',
      hint: 'Thor will give you a pebble. You can say no.',
    },
    'a20-04-s3': {
      goal: 'Find Hödr outside the ring. Tell him what is happening.',
      hint: 'Walk round the outside of the stones.',
    },
  },
  [
    sc(
      'a20-04-field',
      [
        N('The Thing-field is a wide green place with a ring of stones.'),
        N('Baldr stands in the middle. The gods throw things at him, for fun.'),
        N('A stone bumps his shoulder. Plop! It lands in the grass.'),
        N('Nothing can hurt him, because everything promised.'),
        TH('Your turn, brother! Stand still!', 'happy'),
        N('Thor’s big stone stops. Then drop! It falls to the ground.'),
        N('Everyone laughs. Baldr laughs the most.'),
        TH('That was a small one. Fetch me the millstone!'),
        FU('Thor, the mill is using it.'),
        N('The millstone rolls up to Baldr. It lies down flat, like a dog wanting a tummy rub.'),
      ],
      [
        ask(
          2,
          'literacy',
          'RL.1.4',
          'sound words',
          [N('The stone goes plop! Which one is a sound word?')],
          [
            opt('Plop', [N('Yes! Plop is a sound word. It sounds like what it is.')], true),
            opt('Grass', [N('Grass is a thing. Plop is the sound word.')]),
          ],
          'Found a sound word (plop) in the story.',
        ),
      ],
    ),
    sc(
      'a20-04-field-done',
      [
        N(
          'Your Nubbin finds the edge of Baldr’s light. It lies down in it like a cat in a sunbeam.',
        ),
      ],
      [
        ask(
          0,
          'science',
          'K-PS3-1',
          'sunlight warms',
          [N('Cats and Nubbins love a sunbeam. Why is a sunny spot cosy?')],
          [
            opt(
              'Sunlight makes it warm',
              [N('Yes! Sunlight warms the ground, so it feels cosy.')],
              true,
            ),
            opt('Sunlight makes it cold', [
              N('Sunlight warms things up. That is why it feels cosy.'),
            ]),
          ],
          'Learned that sunlight makes things warm.',
        ),
      ],
    ),
    sc(
      'a20-04-turn',
      [
        TH('Guest! Here is a pebble for you to throw.'),
        N('It is small and smooth. Baldr smiles.'),
        BA('Go on. It only tickles.', 'happy'),
        N('Outside the ring a tall man stands alone, with his hands empty.'),
        FU('That is Hödr, Baldr’s brother. He cannot see to throw.', 'soft'),
      ],
      [
        ask(
          4,
          'sel',
          'CASEL: Responsible decision-making',
          'choosing, and watching is fine too',
          [N('You may throw, or watch. Is it all right to say, “I will watch”?')],
          [
            opt(
              'Yes, watching is fine',
              [N('Yes. You can choose to watch, and that is fine.')],
              true,
            ),
            opt('No, you must join in', [
              N('You never have to join in. Choosing to watch is fine.'),
            ]),
          ],
          'Talked about making a choice, and that it is fine to watch.',
        ),
      ],
      {
        choices: [
          {
            id: 'throw',
            label: 'Throw the pebble, gently.',
            then: [N('Your pebble bumps his knee and rolls back. Everyone cheers.')],
          },
          {
            id: 'watch',
            label: 'Give it back. Watch from the edge.',
            then: [TH('Fair enough. Somebody should keep the score.')],
          },
          {
            id: 'nubbin',
            label: 'Let your Nubbin have the throw.',
            then: [
              N('It rolls the pebble to Baldr’s feet. He hands it back.'),
              BA('A draw!', 'happy'),
            ],
          },
        ],
      },
    ),
    sc(
      'a20-04-hodr',
      [
        N('You walk round to where Hödr stands. He turns his head.'),
        HO('You are the guest. I know your footsteps.', 'happy'),
        HO('Tell me what they are doing. I can hear laughing.'),
        N('So you tell him about Thor’s big stone, and your Nubbin asleep.'),
        HO('Thank you. I like to know what is funny.', 'happy'),
      ],
      [
        ask(
          1,
          'science',
          SCI,
          'we hear with our ears',
          [N('Hödr cannot see, but he hears the laughing. What do we hear with?')],
          [
            opt('Our ears', [N('Yes! Ears hear sounds. (Touch your ears.)')], true),
            opt('Our knees', [N('Not knees! (Touch your ears.) Ears are for hearing.')]),
          ],
          'Learned that we hear with our ears, and can still know things without sight.',
        ),
      ],
    ),
    sc(
      'a20-04-hodr-done',
      [HO('Come and tell me the next good one. You tell it better than they do.', 'happy')],
      [
        ask(
          0,
          'literacy',
          'RL.K.3',
          'a story has a beginning, middle and end',
          [
            N(
              'Every story has a first part. What comes first in your day: waking up, or going to bed?',
            ),
          ],
          [
            opt('Waking up', [N('Yes! First you wake up. Bed comes at the end.')], true),
            opt('Going to bed', [N('Bed comes last. First, we wake up.')]),
          ],
          'Put parts of a day in order, as a story has a beginning and an end.',
        ),
      ],
    ),
    sc(
      'a20-04-complete',
      [
        N('The game goes on till the light goes. Nobody is hurt.'),
        N('Baldr puts his arm round his brother.'),
        BA('Did you hear Thor’s big stone go drop?', 'happy'),
        HO('I heard everything. The guest told me the rest.'),
        N('Your Nubbin follows them home, holding Hödr’s bootlace.'),
      ],
      [
        ask(
          3,
          'social-studies',
          'D2.Civ.8.K-2',
          'including everyone in the game',
          [N('The guest told Hödr what he could not see. How does this help him join in?')],
          [
            opt(
              'He can be part of the fun',
              [N('Yes! Telling someone helps them be part of things.')],
              true,
            ),
            opt('It does not help', [N('It does help. Telling Hödr lets him share the fun.')]),
          ],
          'Talked about including a friend who cannot see.',
        ),
      ],
    ),
  ],
);

// ================================================================== A20-5 The Old Woman
const Q05 = quest(
  'a20-05',
  'The Old Woman',
  {
    'a20-05-s1': {
      goal: 'Fetch water for Fensalir.',
      hint: 'Take the pails to the spring and carry them back.',
    },
    'a20-05-s2': {
      goal: 'Sit by the fire while Frigg talks with the traveller.',
      hint: 'Wind the wool, and stay in the room.',
    },
  },
  [
    sc(
      'a20-05-water',
      [
        N('You fetch water. You take two pails. Your Nubbin takes a thimble.'),
        N('It brings back one drop. It carries it like a crown!'),
        N('At the door stands an old woman, wrapped in shawls.'),
        N('You can only see her hands.'),
        FU('A traveller! Bring the water in.'),
        N('Your Nubbin looks at her. Then it hides behind your legs.'),
        N('It has never done that before.'),
      ],
      [
        ask(
          1,
          'maths',
          'K.MD.A.2',
          'which holds more',
          [N('You carry pails, and your Nubbin carries a thimble. Which holds more water?')],
          [
            opt(
              'The pail',
              [N('Yes! The pail is big, so it holds more. The thimble holds a drop.')],
              true,
            ),
            opt('The thimble', [N('The thimble is tiny. The pail is bigger, so it holds more.')]),
          ],
          'Compared a pail and a thimble to see which holds more.',
        ),
      ],
    ),
    sc(
      'a20-05-talk',
      [
        N('Frigg gives the old woman the best seat, and a cup of water.'),
        CR('What are the gods doing at the Thing-field, lady?'),
        FR('Playing. Nothing can hurt my son. Everything promised.', 'happy'),
        CR('Everything? Every single thing?', 'think'),
        FR('Every thing but one little sprout. It was too young to ask.'),
        N('The old woman puts her cup down very carefully.'),
        CR('Too young. Yes. Very wise.'),
      ],
      [
        ask(
          5,
          'sel',
          'CASEL: Self-awareness',
          'feeling unsure, and what helps',
          [N('Your Nubbin hid behind your legs. It felt unsure. What helps when we feel unsure?')],
          [
            opt(
              'Stay close to a friend or a grown-up',
              [N('Yes. Staying close helps. Feeling unsure is allowed.')],
              true,
            ),
            opt('Pretend we are fine', [N('It is fine to feel unsure. Staying close helps more.')]),
            opt('Run off alone', [N('Staying close to someone safe helps more.')]),
          ],
          'Talked about feeling unsure and staying close to someone safe.',
        ),
      ],
      {
        choices: [
          {
            id: 'wind',
            label: 'Keep winding the wool.',
            then: [N('You keep winding, round and round.')],
          },
          {
            id: 'look',
            label: 'Look up at the old woman.',
            then: [N('You look up. She smiles under the shawls. Then it is only shawls.')],
          },
          {
            id: 'hold',
            label: 'Pick up your Nubbin.',
            then: [N('You hug your Nubbin. It stops shaking.')],
          },
        ],
      },
    ),
    sc(
      'a20-05-talk-done',
      [
        N('The old woman thanks Frigg, and goes out of the door.'),
        N('You look down the path. It is empty both ways.'),
      ],
      [
        ask(
          0,
          'literacy',
          'RF.K.2',
          'first sounds',
          [N('Door starts with the sound duh. Which word starts with duh too?')],
          [
            opt('Dog', [N('Yes! Duh-duh-dog. Door and dog both start with duh.')], true),
            opt('Cat', [N('Cat starts with kuh. Door starts with duh, like dog.')]),
            opt('Hen', [N('Hen starts with huh. Door starts with duh, like dog.')]),
          ],
          'Matched words by first sound (d for door and dog).',
        ),
      ],
    ),
    sc(
      'a20-05-complete',
      [
        FR('An odd guest. She asked a lot of questions.', 'think'),
        FU('I will bolt the door tonight.'),
        N('Your Nubbin sits by the door, looking out towards the old oak.'),
      ],
      [
        notice(
          2,
          'science',
          'K-LS1-1',
          'mistletoe grows on another tree',
          [
            N('The green sprout on the old oak is mistletoe. It is a real plant.'),
            N('Mistletoe grows on a branch of another tree.'),
            N('It drinks water from the tree. Its green leaves make food.'),
          ],
          'Learned that mistletoe is a green plant that grows on another tree’s branch.',
        ),
      ],
    ),
  ],
);

// ================================================================== A20-6 Hödr
const Q06 = quest(
  'a20-06',
  'Hödr',
  {
    'a20-06-s1': {
      goal: 'Go back to the Thing-field.',
      hint: 'Walk to the ring of stones. Hödr is standing apart.',
    },
    'a20-06-s2': {
      goal: 'Run for the ring.',
      hint: 'Run as fast as you can.',
    },
    'a20-06-s3': {
      goal: 'Sit with Hödr.',
      hint: 'Stay beside him outside the ring.',
    },
  },
  [
    sc(
      'a20-06-field',
      [
        N('A quiet word first: in this part, Baldr dies. It is told gently.'),
        N('The game is on again. The ring is full of laughing.'),
        N('Hödr stands outside the ring, with empty hands.'),
        N('A cloaked someone comes up beside him. You see only a hand, holding something green.'),
        VO('Why are you not throwing? Everyone else is.'),
        HO('I cannot see him. I have nothing to throw.'),
        VO('Here is a sprig. I will guide your arm.'),
        N('It is a trick. Your Nubbin knows the sprig, and starts to run.'),
        HO('Thank you. I want to be in the game.', 'happy'),
      ],
      [
        ask(
          6,
          'sel',
          'CASEL: Responsible decision-making',
          'check with someone you trust first',
          [
            N('The cloaked someone hides its face. It says, “I will guide your arm.”'),
            N('What should Hödr do?'),
          ],
          [
            opt(
              'Ask someone he trusts first',
              [N('Yes. When a hidden someone says “do it”, check with a friend first.')],
              true,
            ),
            opt('Do it straight away', [N('It is safer to ask someone you trust first.')]),
          ],
          'Talked about checking with someone you trust before doing what a stranger says.',
        ),
      ],
    ),
    sc(
      'a20-06-fall',
      [
        N('The hand turns Hödr’s arm. You run, but the field is wide.'),
        N('Hödr throws the sprig.'),
        N('Baldr falls down, and does not get up.'),
        N('He has died. His body has stopped working, and it will not start again.'),
        N('Nobody laughs. The field is very quiet.'),
        N('The gods cry so hard that nobody can find any words.'),
        N('Your Nubbin runs past them all, to Hödr. It sits by his feet.'),
      ],
      [
        notice(
          5,
          'sel',
          'CASEL: Social awareness',
          'crying is allowed when we are very sad',
          [
            N('When someone we love dies, we feel very sad. Crying is allowed.'),
            N('Crying helps. So does a hug, and sitting together.'),
          ],
          'Heard that crying is allowed when we are sad, and that hugs and company help.',
        ),
      ],
    ),
    sc(
      'a20-06-hodr',
      [
        HO('What happened? Why is it quiet?', 'shock'),
        N('Nobody can answer. The gods are crying too hard.'),
        N('Your Nubbin leans against his legs.'),
        HO('You are there. Please tell me.', 'sad'),
        N('So you tell him, kindly and plainly. He goes very still.'),
        HO('I only wanted to be in the game.', 'sad'),
        N('Someone tricked him. It was not his fault.'),
      ],
      [
        ask(
          5,
          'literacy',
          'RL.1.4',
          'words for feelings',
          [N('Hödr’s voice is small and low. Which word tells how Hödr feels?')],
          [
            opt('Sad', [N('Yes. Hödr feels sad. His voice sounds sad too.')], true),
            opt('Silly', [N('Silly is a giggly feeling. Hödr feels sad.')]),
            opt('Sleepy', [N('Sleepy is a yawny feeling. Hödr feels sad.')]),
          ],
          'Chose a word for a character’s feeling (sad).',
        ),
      ],
      {
        choices: [
          {
            id: 'sit',
            label: 'Sit down next to him.',
            then: [N('You sit in the grass beside him. After a while he sits too.')],
          },
          {
            id: 'hand',
            label: 'Hold his hand.',
            then: [N('You hold his hand. He holds on tight.')],
          },
          {
            id: 'guided',
            label: 'Tell him someone tricked him.',
            then: [HO('I felt a hand on mine. It does not help yet. Stay anyway.', 'sad')],
          },
        ],
      },
    ),
    sc(
      'a20-06-complete',
      [
        N('The gods stay at the Thing-field. It is a place of peace.'),
        N('Hödr sits in the grass. Only you and your Nubbin go to him.'),
        FU('Bring him to Fensalir. Frigg says nobody should sit alone tonight.', 'sad'),
      ],
      [
        ask(
          2,
          'sel',
          'CASEL: Relationship skills',
          'what helps someone who is very sad',
          [N('Hödr is very sad. What helps someone who is very sad?')],
          [
            opt('Stay with them', [N('Yes. Staying with someone shows we care.')], true),
            opt('Leave them alone', [N('Being alone feels lonely. Staying with them is kinder.')]),
            opt('Tell them to stop', [N('Sad feelings need time. Staying close helps.')]),
          ],
          'Talked about staying with a sad friend.',
        ),
      ],
    ),
  ],
);

// ================================================================== A20-7 Who Will Ride
const Q07 = quest(
  'a20-07',
  'Who Will Ride',
  {
    'a20-07-s1': {
      goal: 'Be in Fensalir when Frigg speaks to the gods.',
      hint: 'Bring Hödr to Fensalir. Stay by the door.',
    },
    'a20-07-s2': {
      goal: 'Bring Sleipnir from Odin’s stable.',
      hint: 'The grey horse is the one with lots of legs.',
    },
    'a20-07-s3': {
      goal: 'Say goodbye to Frigg before the road.',
      hint: 'Find Frigg at the door.',
    },
  },
  [
    sc(
      'a20-07-asks',
      [
        N('The gods come to Fensalir in the evening. Hödr sits on a stool you brought.'),
        N('Frigg stands by the cold hearth. She has stopped crying.'),
        FR('Who will ride down the long road, and ask for my son back?', 'sad'),
        N('Nobody speaks. It is a long, dark road.'),
        HE('I will.'),
        N('It is Hermódr the Bold, Baldr’s brother.'),
        FR('Thank you.', 'soft'),
      ],
      [
        ask(
          4,
          'social-studies',
          'D2.Civ.8.K-2',
          'helping our families',
          [N('Hermódr said, “I will.” How can you help your family?')],
          [
            opt('Set the table', [N('Setting the table is a lovely way to help.')]),
            opt('Tidy my toys', [N('Tidying toys is a lovely way to help.')]),
            opt('Give a hug', [N('A hug is a lovely way to help.')]),
          ],
          'Named ways they can help their family.',
        ),
      ],
    ),
    sc(
      'a20-07-asks-done',
      [
        OD('Take my horse. Nothing else could make that road.'),
        N('His horse is waiting in the stable, and it is hungry.'),
      ],
      [
        ask(
          1,
          'science',
          'K-LS1-1',
          'what horses need to live',
          [N('Odin’s horse needs looking after. What do horses need to live?')],
          [
            opt('Food and water', [N('Yes! Horses, like all animals, need food and water.')], true),
            opt('Only toys', [N('Toys are fun, but horses need food and water to live.')]),
          ],
          'Learned that animals need food and water to live.',
        ),
      ],
    ),
    sc(
      'a20-07-sleipnir',
      [
        N('Odin’s stable is long and warm. It smells of hay.'),
        N('At the end stands a tall grey horse. His name is Sleipnir.'),
        N('Sleipnir has eight legs! Your Nubbin counts them.'),
        N('Then it counts its own. Two. Hmm!'),
        HE('Good lad. We will go far, you and I.'),
        N('There is room on his back for two.'),
      ],
      [
        doit(
          3,
          'maths',
          'K.CC.B.5',
          'count to 8',
          'edu:count:sleipnir-legs:8',
          [
            N('Let’s count Sleipnir’s legs. (Point as you count: one, two, three, four.)'),
            N('Five, six, seven, eight! Eight legs. (Count them again together.)'),
          ],
          'Counted eight legs, pointing at each one.',
        ),
      ],
    ),
    sc(
      'a20-07-door',
      [
        N('Frigg is at the door. She has bread and a cloak for you.'),
        HE('We ride at first light, after the ship.'),
        FR('Yes. He would want you there.', 'soft'),
        N('Frigg puts the cloak round your shoulders herself.'),
        FR('You do not have to go so far. You came as a guest.'),
        N('Your Nubbin is already on Sleipnir’s back. It has decided.'),
      ],
      [
        ask(
          5,
          'sel',
          'CASEL: Self-management',
          'feeling brave with a friend beside you',
          [N('The road is long and dark. What helps us feel brave?')],
          [
            opt('Going with a friend', [N('Yes. A friend beside us helps us feel brave.')], true),
            opt('Going all alone', [
              N('Alone can feel scary. Going with a friend helps us feel brave.'),
            ]),
          ],
          'Talked about how having a friend beside you helps you feel brave.',
        ),
      ],
      {
        choices: [
          {
            id: 'home',
            label: 'Say, “We will bring him home.”',
            then: [FR('Do not promise that. Promise you will try.', 'soft')],
          },
          {
            id: 'try',
            label: 'Say, “We will try.”',
            then: [FR('Thank you. Trying is all I ask.', 'soft')],
          },
          {
            id: 'hand',
            label: 'Say nothing. Hold her hand.',
            then: [N('You hold her hand. She holds it back.')],
          },
        ],
      },
    ),
    sc(
      'a20-07-complete',
      [
        N('That night you sleep at Fensalir. Hermódr stays up with the horse.'),
        N('Your Nubbin sits on the step. The pale hall has no light now.'),
        N('For the first time, it does not know which way to face.'),
        FU('Come in, small one. It is cold.', 'soft'),
      ],
      [
        ask(
          3,
          'health',
          PHYS,
          'keeping warm in the cold',
          [N('It is cold at night. What helps keep us warm?')],
          [
            opt('A coat or a blanket', [N('Yes! A coat or a blanket holds our warmth in.')], true),
            opt('A cold drink', [N('A cold drink makes us colder. A coat or blanket is better.')]),
            opt('Standing in the snow', [N('Snow is cold. A coat or blanket is better.')]),
          ],
          'Talked about how to keep warm: a coat or a blanket.',
        ),
      ],
    ),
  ],
);

// ================================================================== A20-8 The Ship
const Q08 = quest(
  'a20-08',
  'The Ship',
  {
    'a20-08-s1': {
      goal: 'Help the gods launch Baldr’s ship.',
      hint: 'Push with the others when Thor calls.',
    },
    'a20-08-s2': {
      goal: 'Watch for the one who comes from the mountains.',
      hint: 'Stand back and watch the road.',
    },
    'a20-08-s3': {
      goal: 'Lay a gift on the ship, or stand back.',
      hint: 'Wade out to Fulla at the ship’s side.',
    },
  },
  [
    sc(
      'a20-08-shore',
      [
        N('Baldr’s ship is called Hringhorni. It lies on rollers, facing the sea.'),
        N('The gods have laid Baldr on board, under a cloth.'),
        TH('All together. Push!'),
        N('Everyone pushes. Your Nubbin pushes too.'),
        N('The ship does not move at all.'),
        TH('Again!'),
        N('Again, and nothing. The gods stand back, puffing.'),
        OD('Send for someone very strong.'),
      ],
      [
        ask(
          4,
          'science',
          SCI,
          'a bigger push moves heavier things',
          [N('A push can move things. A heavy ship needs a big push. What makes a push bigger?')],
          [
            opt('More pushers', [N('Yes! Many hands make a bigger push.')], true),
            opt('A tiny push', [N('A tiny push is too small for a heavy ship.')]),
          ],
          'Learned that heavy things need a bigger push.',
        ),
      ],
    ),
    sc(
      'a20-08-giantess',
      [
        N('A giant woman comes down the mountain, riding a wolf.'),
        N('She is called Hyrrokkin. She walks to the ship without a word.'),
        N('She pushes it once. Whoosh! It slides right into the sea.'),
        N('Thor is very sad and cross. His hand goes to his hammer.'),
        OD('No. She came to help. Let her be.'),
        N('Thor puts his hand down. Hyrrokkin nods, and goes home.'),
      ],
      [
        ask(
          3,
          'sel',
          'CASEL: Self-management',
          'calming down with big feelings',
          [N('Thor has big, cross feelings. What can help him calm down?')],
          [
            opt(
              'Take a slow deep breath',
              [N('Yes. A slow breath helps big feelings settle.')],
              true,
            ),
            opt('Hit someone', [N('Hitting hurts people. A slow breath helps better.')]),
            opt('Shout at everyone', [N('Shouting is too much. A slow breath helps better.')]),
          ],
          'Talked about calming down with a slow breath.',
        ),
      ],
    ),
    sc(
      'a20-08-pyre',
      [
        N('Nanna, Baldr’s wife, is on the shore. She loved him very much.'),
        N('Nanna dies too, there on the shore. Her body stops working.'),
        N('They lay her on the ship beside Baldr. Now they are together.'),
        N('Odin lays a gold ring on the cloth, as a gift.'),
        FU('Everyone gives something. You do not have to. But you can.', 'soft'),
      ],
      [
        notice(
          4,
          'social-studies',
          'D2.His.2.K-2',
          'remembering people long ago and today',
          [
            N('Long ago, people gave gifts to remember someone who had died.'),
            N('We still do. We bring flowers, and tell stories about them.'),
          ],
          'Learned that people remember loved ones with gifts and stories, then and now.',
        ),
      ],
      {
        choices: [
          {
            id: 'stone',
            label: 'Lay a pebble from the Thing-field.',
            then: [N('You lay a grey pebble beside the gold ring.')],
          },
          {
            id: 'thread',
            label: 'Lay a twist of thread from Frigg’s spindle.',
            then: [N('You lay a twist of thread on the cloth.')],
          },
          {
            id: 'back',
            label: 'Stand back with Hödr.',
            then: [N('You stand beside Hödr and tell him where everything is.')],
          },
        ],
      },
    ),
    sc(
      'a20-08-complete',
      [
        N('The ship goes out on the water. You watch the light go.'),
        N('It is a bright thing. Then a small bright thing. Then a star on the sea.'),
        N('Your Nubbin watches until it is gone.'),
        HE('First light. Eat something. We have a long way to go.', 'sad'),
      ],
      [
        ask(
          1,
          'science',
          SCI,
          'far away things look small',
          [N('The ship looks smaller as it goes far away. Why?')],
          [
            opt(
              'Things look smaller when they are far',
              [N('Yes! The ship is the same size. It only looks small.')],
              true,
            ),
            opt('The ship really shrank', [
              N('The ship did not shrink. Far away things only look small.'),
            ]),
          ],
          'Learned that things look smaller when they are far away.',
        ),
      ],
    ),
  ],
);

// ================================================================== A20-9 Nine Nights
const Q09 = quest(
  'a20-09',
  'Nine Nights',
  {
    'a20-09-s1': {
      goal: 'Ride behind Hermódr down the road.',
      hint: 'Hold on to his belt.',
    },
    'a20-09-s2': {
      goal: 'Cross the gold-roofed bridge.',
      hint: 'Ride up and answer the woman who keeps it.',
    },
  },
  [
    sc(
      'a20-09-dales',
      [
        N('Sleipnir goes down into deep, dark dales.'),
        N('You ride behind Hermódr, holding his belt.'),
        N('You ride for nine nights. It is very dark.'),
        HE('Still there, guest?'),
        Y('Still here.'),
        HE('Good. Keep saying so.'),
        N('You can hear eight hooves, and the wind.'),
        N('Clip, clop, clip, clop. Your Nubbin counts the hooves, and falls asleep at six.'),
      ],
      [
        doit(
          2,
          'maths',
          'K.CC.A.1',
          'count to 9',
          'edu:count:nights:9',
          [
            N('Nine nights! Let’s count them on your fingers. One, two, three.'),
            N('Four, five, six, seven, eight, nine. (Count all nine.)'),
          ],
          'Counted to nine, one night at a time.',
        ),
      ],
      {
        choices: [
          {
            id: 'count',
            label: 'Count the nights aloud.',
            then: [N('You count: one, two. By the sixth, Hermódr counts too.')],
          },
          {
            id: 'baldr',
            label: 'Talk about Baldr.',
            then: [
              HE('Tell me something he did. I want to remember.', 'sad'),
              N('You tell him about the strap and the bench. He laughs, once.'),
            ],
          },
          {
            id: 'quiet',
            label: 'Keep quiet and hold on.',
            then: [N('Now and then Hermódr pats your hand, to check.')],
          },
        ],
      },
    ),
    sc(
      'a20-09-bridge',
      [
        N('On the ninth night there is a light: a bridge with a gold roof.'),
        N('A river runs loud beneath it. It is called Gjöll.'),
        N('A woman stands at the bridge. Her name is Módgudr.'),
        MO('Who are you, and why do you ride this road?'),
        HE('I ride for my brother Baldr. Has he come this way?'),
        MO('Yes. He crossed yesterday. The bridge rang under him.'),
        MO('It rings louder under you, because you are alive.', 'think'),
        N('Your Nubbin peeks out of your cloak, to check.'),
      ],
      [
        ask(
          5,
          'science',
          '1-PS4-1',
          'vibrations make sound',
          [
            N(
              'The bridge rings like a bell. Hum with me, and touch your throat. What do you feel?',
            ),
          ],
          [
            opt('A little buzzing', [N('Yes! Sound is a tiny shaking, called a vibration.')], true),
            opt('Nothing at all', [
              N('Try again. Hum, and touch your throat. It buzzes. That is a vibration.'),
            ]),
          ],
          'Felt a vibration in their throat while humming.',
        ),
      ],
    ),
    sc(
      'a20-09-bridge-done',
      [MO('Go gently. Everyone down there is someone’s dear one.', 'soft')],
      [
        notice(
          0,
          'sel',
          'CASEL: Social awareness',
          'being gentle with people who are sad',
          [
            N('Being gentle means soft hands and a kind voice.'),
            N('We can be gentle with people who are sad.'),
          ],
          'Talked about being gentle with someone who is sad.',
        ),
      ],
    ),
    sc(
      'a20-09-complete',
      [
        N('You ride on, down and north. The road gets quiet.'),
        N('Ahead there is a very tall gate. Nobody is there.'),
        HE('Hold on tight. Both of you.'),
        N('Your Nubbin wraps its arms round your middle.'),
      ],
      [
        ask(
          3,
          'literacy',
          'RL.K.3',
          'first, next, last',
          [N('First you rode through the dales. Next you crossed the bridge. What is last?')],
          [
            opt(
              'The tall gate',
              [N('Yes! First the dales, next the bridge, last the gate.')],
              true,
            ),
            opt('The spindle', [N('The spindle is back at Fensalir. Last is the tall gate.')]),
          ],
          'Put the journey in order: first, next, last.',
        ),
      ],
    ),
  ],
);

// ================================================================== A20-10 Hel's Hall
const Q10 = quest(
  'a20-10',
  'Hel’s Hall',
  {
    'a20-10-s1': {
      goal: 'Hold on while Sleipnir leaps the gate.',
      hint: 'Hold Hermódr’s belt, and lean when he leans.',
    },
    'a20-10-s2': {
      goal: 'Stand with Hermódr in the quiet hall.',
      hint: 'Follow your Nubbin to the high seat.',
    },
    'a20-10-s3': {
      goal: 'Carry Baldr’s and Nanna’s gifts for home.',
      hint: 'Take what they give you. Keep it safe.',
    },
  },
  [
    sc(
      'a20-10-gate',
      [
        N('Hermódr turns Sleipnir back from the tall gate.'),
        HE('Lean when I lean!'),
        N('Sleipnir runs. Eight hooves, then none!'),
        N('He goes up, up, over the gate. Whoosh!'),
        N('You land on the other side. It is very quiet.'),
        N('Your Nubbin hops down and runs.'),
      ],
      [
        ask(
          3,
          'maths',
          'K.G.A.1',
          'over and under',
          [N('Sleipnir jumped over the gate. Did he go over it, or under it?')],
          [
            opt('Over', [N('Yes! Over means up and across the top.')], true),
            opt('Under', [N('Under means below. Sleipnir went over the top.')]),
          ],
          'Used the words over and under for position.',
        ),
      ],
    ),
    sc(
      'a20-10-gate-done',
      [N('It has seen a light. It is not a bright one, but it knows it anywhere.')],
      [
        ask(
          0,
          'science',
          '1-PS4-2',
          'dim and bright light',
          [N('The light is dim, a soft, small light. Which is brighter, a candle or the sun?')],
          [
            opt('The sun', [N('Yes! The sun is far brighter than a candle.')], true),
            opt('The candle', [N('A candle is dim. The sun is much brighter.')]),
          ],
          'Compared bright and dim light.',
        ),
      ],
    ),
    sc(
      'a20-10-hall',
      [
        N('This is the quiet hall, where those who have died stay.'),
        N('Baldr sits in the high seat. His light is low, but it is his.'),
        N('Your Nubbin curls up on the step below him.'),
        BA('Brother. And the guest. You came so far.', 'soft'),
        N('Hel comes into her hall, tall and grave. She does not hurry.'),
        HE('Lady, everyone above is crying for my brother. May he come home?'),
        HL('If everything cries for him, he may go home.', 'think'),
        HL('But if one thing will not cry, he stays.'),
        HE('Everything will. You do not know him.'),
        HL('No. But I will.', 'soft'),
      ],
      [
        ask(
          7,
          'sel',
          'CASEL: Self-awareness',
          'crying is how big feelings come out',
          [N('Everyone is crying for Baldr because they love him. Is crying okay?')],
          [
            opt(
              'Yes. Crying is how big feelings come out',
              [N('Yes. Tears are for big feelings, and love.')],
              true,
            ),
            opt('No, never cry', [N('Everybody cries sometimes. It is okay.')]),
          ],
          'Talked about crying as a normal way to show big feelings.',
        ),
      ],
    ),
    sc(
      'a20-10-gifts',
      [
        N('Baldr walks you to the door. Your Nubbin walks in his light.'),
        N('He gives Hermódr his gold ring, for Odin to remember him by.'),
        N('Nanna gives a linen smock for Frigg, and a ring for Fulla.'),
        NA('Please say thank you to Fulla, for all the times she did my hair.', 'soft'),
        BA('Guest. What did my mother say, when you left?'),
      ],
      [
        ask(
          3,
          'literacy',
          LANG,
          'polite words: thank you',
          [N('Nanna sends a thank you. Which are kind words for a gift?')],
          [
            opt('Thank you', [N('Yes! Thank you is a kind thing to say for a gift.')], true),
            opt('Give me more', [N('That is not kind. Thank you is a kind thing to say.')]),
          ],
          'Practised polite words for receiving a gift.',
        ),
      ],
      {
        choices: [
          {
            id: 'try',
            label: 'She asked us to try.',
            then: [BA('That is her. She never asks for more than you can carry.', 'soft')],
          },
          {
            id: 'ask',
            label: 'She asked the whole world once. She will ask again.',
            then: [BA('She will. Tell her I am warm here. It is true.', 'soft')],
          },
          {
            id: 'step',
            label: 'She sat on the step and said nothing.',
            then: [
              N('Baldr is quiet a long while.'),
              BA('Then sit with her. She will not ask that either.', 'soft'),
            ],
          },
        ],
      },
    ),
    sc(
      'a20-10-complete',
      [
        N('Your Nubbin will not leave his light. Baldr hands it to you at the gate.'),
        BA('Go on. I am all right. It is quiet, and Nanna is with me.', 'soft'),
        N('Sleipnir takes you back up the road. Nine nights, and the gold bridge.'),
        HE('Everything has to cry. Everything.', 'think'),
        HE('Then we ask everything, again.'),
      ],
      [
        doit(
          1,
          'health',
          PHYS,
          'slow breathing to feel calm',
          'edu:breathe:slow:3',
          [
            N('Baldr is calm and quiet. Let’s be calm too. Breathe in slowly.'),
            N('Breathe out slowly. Do it three times. (Count three breaths.)'),
          ],
          'Practised three slow, calming breaths.',
        ),
      ],
    ),
  ],
);

// ================================================================== A20-11 Everything Weeps
const Q11 = quest(
  'a20-11',
  'Everything Weeps',
  {
    'a20-11-s1': {
      goal: 'Go out with the messengers to ask the whole world.',
      hint: 'Pick a road at Fensalir’s door.',
    },
    'a20-11-s2': {
      goal: 'Carry frosty stones into the sun.',
      hint: 'Pick up the white stones and set them in the sunshine.',
    },
    'a20-11-s3': {
      goal: 'Stay with your Nubbin.',
      hint: 'Sit down beside it in the sun.',
    },
  },
  [
    sc(
      'a20-11-send',
      [
        N('Hermódr tells everyone about the long road, and Hel’s word.'),
        N('Odin turns his ring over and over in his hands.'),
        FR('Then we ask again. Everything. Send messengers on every road.', 'soft'),
        MS('There are more roads than messengers, lady.'),
        FR('Then take the guest. And the little one.'),
        N('Your Nubbin stands up straight, feet together.'),
      ],
      [
        ask(
          3,
          'social-studies',
          'D2.Geo.2.K-2',
          'places on a map: hills, shore, woods',
          [N('There is a road to the hills, the shore and the woods. Where would we find trees?')],
          [
            opt('In the woods', [N('Yes! The woods are full of trees.')], true),
            opt('At the shore', [
              N('The shore has sand, pebbles and sea. Trees are in the woods.'),
            ]),
            opt('On a hilltop', [
              N('Some hills have trees. But the woods are where trees grow together.'),
            ]),
          ],
          'Matched places (hills, shore, woods) with what is found there.',
        ),
      ],
      {
        choices: [
          {
            id: 'hills',
            label: 'Take the road to the hills.',
            then: [MS('Stones and old snow. We will go slowly.')],
          },
          {
            id: 'shore',
            label: 'Take the road to the shore.',
            then: [MS('Sand and pebbles. The sea is wide. We will ask it.')],
          },
          {
            id: 'woods',
            label: 'Take the road through the woods.',
            then: [MS('Trees. They cry easily. Let us ask them.')],
          },
        ],
      },
    ),
    sc(
      'a20-11-stones',
      [
        N('Everywhere you go, people and animals cry for Baldr.'),
        N('In a shady hollow, stones are white with frost.'),
        MS('Carry them out into the sun. You will see.'),
        N('You set a stone in the sunshine. The frost shines, then melts into drops.'),
        N('Drip, drip, drip! The stone is wet.'),
        N('Stone after stone, in the sun, drip, drip, drip.'),
      ],
      [
        ask(
          3,
          'science',
          '2-ESS2-3',
          'sunshine melts ice into water',
          [N('Frost is little bits of ice. What happens when the sun warms it?')],
          [
            opt(
              'It melts into water',
              [N('Yes! Warm sunshine melts ice into drops of water.')],
              true,
            ),
            opt('It gets bigger', [N('It does not grow. Warm sunshine melts ice into water.')]),
            opt('It turns to stone', [
              N('Frost does not turn to stone. Warm sunshine melts it into water.'),
            ]),
          ],
          'Learned that warmth melts frost into water.',
        ),
      ],
    ),
    sc(
      'a20-11-ember',
      [
        N('Your Nubbin holds its lantern up to one slow stone.'),
        N('The red pebble glows. The frost on that stone melts at once.'),
        MS('What do you carry?', 'think'),
        Y('Something warm, from far away.'),
      ],
      [
        ask(
          3,
          'sel',
          'CASEL: Relationship skills',
          'being warm and kind to a friend',
          [N('Warmth helped that stone. How can we be warm to a friend?')],
          [
            opt('Smile and say hello', [N('Yes! A smile is a warm thing to give.')], true),
            opt('Ignore them', [N('Ignoring is cold. A smile and a hello are warm.')]),
          ],
          'Talked about being warm and kind to a friend.',
        ),
      ],
    ),
    sc(
      'a20-11-stones-done',
      [
        N('The iron in a gate cries. So does the copper on a roof.'),
        N('Even the gold on a ring cries a little, in the warm.'),
      ],
      [
        ask(
          1,
          'maths',
          'K.CC.B.5',
          'count to 3',
          [N('A gate, a roof and a ring all cried. How many things is that?')],
          [
            opt('Three', [N('Yes! Gate, roof, ring: one, two, three.')], true),
            opt('Two', [N('Let’s count: gate, roof, ring. One, two, three. Three things.')]),
          ],
          'Counted three things.',
        ),
      ],
    ),
    sc(
      'a20-11-nubbin',
      [
        N('You look for your Nubbin. It sits in the sun by the last stone.'),
        N('Water runs down its face. It is not frost!'),
        N('It wipes its face with both arms, and looks very surprised.'),
        MS('There is one more thing crying than we asked.', 'soft'),
        N('You sit by it. It climbs into your lap and keeps crying.'),
        N('Far away, Baldr’s light might be a little brighter.'),
      ],
      [
        ask(
          4,
          'sel',
          'CASEL: Self-management',
          'what to do when tears come',
          [N('Your Nubbin is crying. What helps when tears come?')],
          [
            opt('A cuddle and a sit-down', [N('Yes. A cuddle and a sit-down help.')], true),
            opt('Hiding our face', [N('Tears are okay. A cuddle and a sit-down help more.')]),
          ],
          'Talked about what helps when we cry.',
        ),
      ],
    ),
    sc(
      'a20-11-complete',
      [
        N('By evening, every road you walked is wet.'),
        N('The sun goes down red and orange over a crying world.'),
        MS('That is ours done. Everything cried. Time to go home.', 'soft'),
        N('Your Nubbin carries a frost stone home, and will not put it down.'),
      ],
      [
        doit(
          1,
          'art',
          PHYS,
          'naming sunset colours',
          'edu:colour:sunset:red-orange',
          [
            N('Look at the sunset in the picture. (Point to something red.)'),
            N('Now point to something orange. Red and orange, side by side.'),
          ],
          'Found and named the colours red and orange.',
        ),
      ],
    ),
  ],
);

// ================================================================== A20-12 The Cave
const Q12 = quest(
  'a20-12',
  'The Cave',
  {
    'a20-12-s1': {
      goal: 'Walk home with the messengers.',
      hint: 'Follow the road under the cliff.',
    },
    'a20-12-s2': {
      goal: 'Ask the giantess in the cave to cry for Baldr.',
      hint: 'Go to the cave mouth with the messengers.',
    },
  },
  [
    sc(
      'a20-12-road',
      [
        N('The messengers come home along every road, wet to the knees.'),
        MS('Nothing said no. Not a stone. Not a beetle.', 'happy'),
        N('The road runs under a cliff. There is a cave in the cliff.'),
        N('A giant woman sits in the cave mouth, arms round her knees.'),
        N('Her eyes are quite dry.'),
        MS('One more. Just one.'),
      ],
      [
        ask(
          3,
          'science',
          'K-ESS3-1',
          'animals that shelter in caves',
          [N('A cave is a hollow place in a cliff. Which animal might shelter in a cave?')],
          [
            opt('A bat', [N('Yes! Bats often rest in caves. Bears sometimes do too.')], true),
            opt('A fish', [N('Fish live in water. Bats and bears shelter in caves.')]),
            opt('A whale', [N('Whales live in the sea. Bats and bears shelter in caves.')]),
          ],
          'Learned that some animals shelter in caves.',
        ),
      ],
    ),
    sc(
      'a20-12-cave',
      [
        MS('Everything in the world cries for Baldr. Will you cry too?'),
        TK('My name is Thökk. And no.'),
        TK('I will cry with dry eyes. That is all he gets.', 'angry'),
        TK('He was nothing to me. He can stay where he is.'),
        N('The messengers stand still. They asked the whole world, and it said yes.'),
        N('Your Nubbin looks at you. Its face is still wet.'),
      ],
      [
        ask(
          3,
          'sel',
          'CASEL: Social awareness',
          'it is okay for someone to say no',
          [N('Thökk said no. Is it okay for someone to say no to us?')],
          [
            opt(
              'Yes, and we can still be kind',
              [N('Yes. People can say no. We can still be kind.')],
              true,
            ),
            opt('No, they must say yes', [N('Everyone can say no. We can still be kind.')]),
          ],
          'Talked about how people can say no, and we can still be kind.',
        ),
      ],
      {
        choices: [
          {
            id: 'plead',
            label: 'Ask her again, kindly.',
            set: { 'a20-thokk': 'plead' },
            then: [Y('Please. He was kind to everyone.'), TK('No.', 'angry')],
          },
          {
            id: 'sat',
            label: 'Sit down beside her, and say nothing.',
            set: { 'a20-thokk': 'sat' },
            then: [
              N('You sit a little way off. She looks at you sideways, and lets you stay.'),
              TK('It will not make me cry, you know.'),
              N('You nod. You know.'),
            ],
          },
          {
            id: 'walked',
            label: 'Walk away.',
            set: { 'a20-thokk': 'walked' },
            then: [
              N('You walk out. Behind you, the messengers ask again and again.'),
              N('Her answer is the same each time.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a20-12-kept',
      [
        N('Thökk looks at your pocket, where the stone sits.'),
        TK('You understand. Keep what you have.'),
        N('Your hand goes to your pocket. The stone is cold.'),
      ],
      [
        ask(
          0,
          'literacy',
          LANG,
          'listening for where something is',
          [N('Where does the stone sit? Listen again: in your pocket, or on your head?')],
          [
            opt('In your pocket', [N('Yes! The stone is in your pocket.')], true),
            opt('On your head', [N('Not on your head. The stone is in your pocket.')]),
          ],
          'Listened for a detail: where the stone is.',
        ),
      ],
    ),
    sc(
      'a20-12-cave-done',
      [TK('Go home. Tell them Thökk would not.'), N('The cave stays dry, and so do her eyes.')],
      [
        ask(
          1,
          'science',
          '2-PS1-1',
          'wet and dry',
          [N('The cave stays dry. Which is dry: a rock in the sun, or a puddle?')],
          [
            opt(
              'A rock in the sun',
              [N('Yes! A rock in the sun dries off. A puddle is wet.')],
              true,
            ),
            opt('A puddle', [N('A puddle is wet, full of water. A rock in the sun is dry.')]),
          ],
          'Sorted things as wet or dry.',
        ),
      ],
    ),
    sc(
      'a20-12-complete',
      [
        N('The messengers go home slowly. Nobody wants to tell Frigg.'),
        N('They tell her. She sits on the step, and Fulla sits beside her.'),
        FR('One. Out of everything.', 'sad'),
        N('Your Nubbin keeps looking back at the cliff the whole way.'),
      ],
      [
        ask(
          2,
          'sel',
          'CASEL: Relationship skills',
          'sitting beside someone who is disappointed',
          [N('Frigg is sad and disappointed. What helps?')],
          [
            opt('Sit beside her', [N('Yes. Sitting beside someone is a kind thing to do.')], true),
            opt('Tell her to hurry up', [
              N('Sad feelings need time. Sitting beside her is kinder.'),
            ]),
          ],
          'Talked about sitting beside someone who is disappointed.',
        ),
      ],
    ),
    sc(
      'a20-margin-hazel',
      [
        N('Nova’s atlas lies open at the cave, and the giantess who would not cry.'),
        N('Beside it, in faint pencil, there is a little note. You know the writing.'),
        N('“Don’t be cross with her. Feel sorry for her.”'),
        N('And under it, one letter: H.', 'soft'),
        N('Your Nubbin pats the picture of the cave, gently.'),
      ],
      [
        ask(
          3,
          'literacy',
          'RF.K.2',
          'H is for Hazel: first sound',
          [N('H is for Hazel. Hazel starts with the sound huh. Which word starts with huh too?')],
          [
            opt('Hat', [N('Yes! Huh-huh-hat. Hazel and hat both start with huh.')], true),
            opt('Cat', [N('Cat starts with kuh. Hazel starts with huh, like hat.')]),
            opt('Dog', [N('Dog starts with duh. Hazel starts with huh, like hat.')]),
          ],
          'Matched words by their first sound (h for Hazel and hat).',
        ),
      ],
    ),
  ],
);

// ================================================================== A20-13 The Salmon
const Q13 = quest(
  'a20-13',
  'The Salmon',
  {
    'a20-13-s1': {
      goal: 'Climb with the gods to the house with four doors.',
      hint: 'Follow the gods up the mountain path.',
    },
    'a20-13-s2': {
      goal: 'Help the gods make a net like the one that burned.',
      hint: 'Look at the ash. Hold the cord.',
    },
    'a20-13-s3': {
      goal: 'Hold the net across the waterfall.',
      hint: 'Take one end and keep it low in the river.',
    },
  },
  [
    sc(
      'a20-13-house',
      [
        N('The gods know who tricked Hödr. It was Loki, and he has run away.'),
        N('They find a house high on a mountain, with a door in every wall.'),
        TH('Four doors. So he could watch every way at once.', 'angry'),
        N('The house is empty. By the fire there is a little heap of ash.'),
        OD('He was making something. He burned it when he saw us.', 'think'),
        N('Below the mountain a waterfall tumbles into a deep pool.'),
      ],
      [
        doit(
          2,
          'maths',
          'K.CC.B.5',
          'count to 4',
          'edu:count:doors:4',
          [
            N('A door in every wall. (Count the doors: one, two, three, four.)'),
            N('Four doors. One for each wall of the house.'),
          ],
          'Counted four doors.',
        ),
      ],
    ),
    sc(
      'a20-13-ash',
      [
        N('Kvasir, the wisest god, kneels by the ash and looks.'),
        N('It is the shape of a net. Nobody has made one before.'),
        OD('He will be in the water. So we will make a net too.', 'think'),
        N('The gods make a net, knot by knot. Your Nubbin gets tied into it.'),
        N('Only its nose sticks out. Wiggle, wiggle.'),
        TH('Hold still, small one. You are not the fish.', 'happy'),
        N('It is the first smile since the Thing-field.'),
      ],
      [
        doit(
          6,
          'art',
          PHYS,
          'over and under, like weaving a net',
          'edu:weave:net:over-under',
          [
            N('A net has cords that cross: over, under, over, under.'),
            N('(Wiggle your fingers over and under, like making a net.)'),
          ],
          'Moved their fingers over and under, as in weaving.',
        ),
      ],
      {
        choices: [
          {
            id: 'cord',
            label: 'Hold the cord steady.',
            then: [N('You hold it steady through every knot.')],
          },
          {
            id: 'knot',
            label: 'Tie some knots yourself.',
            then: [N('You tie a row of knots. Thor checks every one.')],
          },
          {
            id: 'untangle',
            label: 'Untangle your Nubbin first.',
            then: [N('You untangle your Nubbin. It watches with its arms folded.')],
          },
        ],
      },
    ),
    sc(
      'a20-13-falls',
      [
        N('This is Franang’s Falls. A salmon lies in the pool below. It is Loki.'),
        N('Thor wades in with the net. You hold one end on the bank.'),
        N('You drag it down the river. The salmon slips away.'),
        N('You drag it again. This time the salmon leaps!'),
        N('Thor catches it by the tail. Splash!'),
        N('The old book says that is why salmon have thin tails.'),
      ],
      [
        notice(
          3,
          'science',
          'K-ESS3-1',
          'salmon live in rivers and leap up waterfalls',
          [
            N('Real salmon are river fish. They swim up rivers to lay their eggs.'),
            N('They leap right up waterfalls on the way.'),
          ],
          'Learned that real salmon swim up rivers and leap waterfalls.',
        ),
      ],
    ),
    sc(
      'a20-13-falls-done',
      [N('In Thor’s hand the salmon is a man again, wet and still.'), N('He says nothing at all.')],
      [
        ask(
          1,
          'sel',
          'CASEL: Responsible decision-making',
          'putting things right after a wrong thing',
          [N('Loki did a wrong thing. What can a person do after a wrong thing?')],
          [
            opt(
              'Say sorry, and make it right',
              [N('Yes. Saying sorry and making it right is brave.')],
              true,
            ),
            opt('Pretend it did not happen', [
              N('The wrong thing is still there. Saying sorry is braver.'),
            ]),
            opt('Blame someone else', [N('Blaming is not fair. Saying sorry is braver.')]),
          ],
          'Talked about saying sorry and putting things right.',
        ),
      ],
    ),
    sc(
      'a20-13-complete',
      [
        N('The gods take Loki away down the mountain.'),
        N('Your Nubbin looks at you, as if it has a question.'),
        OD('Go home to Fensalir, guest. What happens next is ours to do.', 'sad'),
        N('The page turns, the way pages do.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'D2.Civ.8.K-2',
          'rules keep people safe',
          [N('Rules help keep people safe. Who helps make the rules at home or school?')],
          [
            opt(
              'Grown-ups, and we can help too',
              [N('Yes. Grown-ups make rules, and we can help.')],
              true,
            ),
            opt('Nobody', [N('Somebody always helps make them. Grown-ups, and we can too.')]),
          ],
          'Talked about who makes rules and why rules keep us safe.',
        ),
      ],
    ),
  ],
);

// ================================================================== A20-14 The Bowl
const Q14 = quest(
  'a20-14',
  'The Bowl',
  {
    'a20-14-s1': {
      goal: 'Follow the stair down under the earth.',
      hint: 'Take the steep stair, and keep your Nubbin close.',
    },
    'a20-14-s2': {
      goal: 'Stay near Sigyn and her bowl.',
      hint: 'Go nearer, or stay where you are.',
    },
    'a20-14-s3': {
      goal: 'See what happens when the bowl is full.',
      hint: 'Stay still. It will not take long.',
    },
  },
  [
    sc(
      'a20-14-cave',
      [
        N('Under the earth there is a cave, with three flat stones.'),
        N('Loki is held still on the stones, because of the wrong thing he did.'),
        N('Drops fall from the rock above him, slow and steady.'),
        N('A woman kneels by him with a bowl. It is Sigyn, his wife.'),
        N('The bowl catches the drops. Her arms are tired.'),
        N('Your Nubbin holds on to your leg.'),
      ],
      [
        ask(
          4,
          'maths',
          'K.G.A.1',
          'above and below',
          [N('The drops fall from above. Where is the bowl: above the drops, or below?')],
          [
            opt('Below', [N('Yes! The bowl is below the drops, to catch them.')], true),
            opt('Above', [N('Above means higher up. The bowl is below the drops.')]),
          ],
          'Used above and below to say where things are.',
        ),
      ],
    ),
    sc(
      'a20-14-bowl',
      [
        N('You go nearer. Sigyn knows who you are: the guest who asked at the cave.'),
        N('She looks at the bowl, and nothing else.'),
        SI('You asked so nicely, in the cave. Everyone heard.', 'sad'),
        SI('I do not ask anything of you. Please do not ask me.'),
        N('The bowl fills, drop by drop.'),
        N('Your Nubbin sits at the edge of the lamplight.'),
      ],
      [
        ask(
          4,
          'sel',
          'CASEL: Relationship skills',
          'offering help with a hard job',
          [N('Sigyn is doing a hard job, with love. What can we do for someone doing a hard job?')],
          [
            opt(
              'Ask if they need help',
              [N('Yes, asking if they need help is a kind thing to do.')],
              true,
            ),
            opt('Tell them it is boring', [
              N('That would not be kind. Asking if they need help is better.'),
            ]),
          ],
          'Talked about offering help to someone doing a hard job.',
        ),
      ],
    ),
    sc(
      'a20-14-bowl-sat',
      [
        N('You go nearer. Sigyn looks up. She knows you.'),
        SI('You sat with the one who would not cry. I heard.', 'soft'),
        N('Her bowl is nearly full. Her arms are shaking.'),
        SI('Hold this one under the drops, while I empty mine.'),
        N('She gives you a little wooden bowl. You hold it up.'),
        N('For a moment, no drops fall on him at all.'),
        SI('Thank you.', 'soft'),
      ],
      [
        ask(
          5,
          'sel',
          'CASEL: Relationship skills',
          'how help gives someone a rest',
          [N('You held the bowl for Sigyn. What did your help give her?')],
          [
            opt('A little rest', [N('Yes! Your help gave Sigyn a little rest.')], true),
            opt('More work', [N('You shared the work, so she could rest.')]),
          ],
          'Talked about how helping lets someone rest.',
        ),
      ],
    ),
    sc(
      'a20-14-bowl-walked',
      [
        N('You stop at the bottom of the stair, and go no further.'),
        N('You can see the lamp, three stones, and Sigyn with her bowl.'),
        N('The bowl fills, drop by drop.'),
        N('Your Nubbin sits down beside you on the step.'),
        N('Watching from far away is as near as you can go today.'),
      ],
      [
        notice(
          4,
          'sel',
          'CASEL: Self-awareness',
          'it is okay to stay back when something feels too big',
          [
            N('Sometimes a thing feels too big. It is okay to stay back.'),
            N('You can say, “I am not ready.” That is a brave thing to say.'),
          ],
          'Heard that it is okay to stay back when something feels too big.',
        ),
      ],
    ),
    sc(
      'a20-14-shake',
      [
        N('The bowl is full. Sigyn must take it away to empty it.'),
        N('A drop falls on Loki. He shakes, and the earth shakes too!'),
        N('Wobble, wobble. Then Sigyn is back, and it is still.'),
        N('The old book says Sigyn stays with him, all that time.'),
        N('Your Nubbin holds on to you with both arms.'),
      ],
      [
        notice(
          2,
          'science',
          '2-ESS1-1',
          'earthquakes are real: the ground moves',
          [
            N('Iceland has real earthquakes. The ground is made of huge pieces.'),
            N('The pieces slowly move, and sometimes the ground shakes.'),
          ],
          'Learned that the ground is made of huge pieces that move, so earthquakes are real.',
        ),
      ],
      {
        choices: [
          {
            id: 'hold',
            label: 'Hold your Nubbin close.',
            then: [N('You hold it close. It was shaking, and then it is not.')],
          },
          {
            id: 'stay',
            label: 'Stay a bit longer, for Sigyn.',
            then: [N('You stay. Sigyn lifts one hand, just for a moment.')],
          },
          {
            id: 'go',
            label: 'Go back up the stair.',
            then: [N('You go up into the cold air. The earth is quiet.')],
          },
        ],
      },
    ),
    sc(
      'a20-14-complete',
      [
        N('You climb up out of the earth into a grey evening.'),
        N('The wind smells of snow.'),
        N('The page turns. It is white from edge to edge.'),
        N('Your Nubbin pulls your cloak round you both. You step onto the snow.'),
      ],
      [
        ask(
          3,
          'literacy',
          'RL.1.4',
          'sound words',
          [N('Snow goes crunch, crunch. Which word sounds like what it is: splash, or table?')],
          [
            opt(
              'Splash',
              [N('Yes! Splash sounds just like water. Crunch sounds like snow.')],
              true,
            ),
            opt('Table', [N('Table is just a name. Splash sounds like what it is.')]),
          ],
          'Chose a sound word (splash) over an ordinary word.',
        ),
      ],
    ),
  ],
);

// ================================================================== A20-15 The Fimbulwinter
const Q15 = quest(
  'a20-15',
  'The Fimbulwinter',
  {
    'a20-15-s1': {
      goal: 'Cross the long white plain.',
      hint: 'Keep the wind at your back. Walk to the dark trees.',
    },
    'a20-15-s2': {
      goal: 'Find the two who are hiding in the wood.',
      hint: 'Look for trodden snow.',
    },
    'a20-15-s3': {
      goal: 'Keep Líf and Lífthrasir company.',
      hint: 'Sit in the hollow with them.',
    },
  },
  [
    sc(
      'a20-15-plain',
      [
        N('Now comes a great winter, called the Fimbulwinter.'),
        N('Snow blows from every side. The sun is pale and gives no warmth.'),
        N('Three winters come, one after another, with no summer between.'),
        N('You walk with your head down. Your Nubbin rides in your cloak.'),
        N('Ahead, through the white, there is a dark line of trees.'),
      ],
      [
        ask(
          1,
          'science',
          '1-ESS1-2',
          'winter days are short in the far north',
          [
            N(
              'In the far north, winter days are short. Is the sun up for a long time, or a short time?',
            ),
          ],
          [
            opt(
              'A short time',
              [N('Yes! In midwinter, Iceland has only a few hours of daylight.')],
              true,
            ),
            opt('A long time', [N('In winter the sun is up only a few hours in the far north.')]),
          ],
          'Learned that winter days are short in the far north.',
        ),
      ],
    ),
    sc(
      'a20-15-holt',
      [
        N('The wood is called Hoddmímir’s Holt. Under the trees, the wind cannot find you.'),
        N('Two people sit under a big tree, in one blanket.'),
        LI('Oh! Someone. I thought nobody was left.', 'shock'),
        LT('We are Líf and Lífthrasir. We live on dew.'),
        LI('It is not much. But it is enough.', 'soft'),
        N('Your Nubbin climbs out and sits between them, under the blanket.'),
        LT('It is warm. Can it stay?'),
      ],
      [
        ask(
          6,
          'sel',
          'CASEL: Social awareness',
          'welcoming someone new',
          [N('Líf and Lífthrasir welcome a new friend. How can we welcome someone new?')],
          [
            opt(
              'Say hello and make room',
              [N('Yes! Saying hello and making room helps someone feel welcome.')],
              true,
            ),
            opt('Look away', [
              N('Looking away feels lonely. Hello and a bit of room feel welcoming.'),
            ]),
          ],
          'Talked about how to welcome someone new.',
        ),
      ],
    ),
    sc(
      'a20-15-company',
      [
        N('So you stay in the wood. Every morning you lick dew off the leaves.'),
        N('Every night you sit close, under one blanket and your cloak.'),
        N('Your Nubbin shares itself out: a night by each of you.'),
        LI('You licked my leaf!'),
        LT('There is dew on all of them.'),
        LI('That one was mine. I was saving it for Tuesday.'),
        LT('There are no Tuesdays now. We stopped naming the days.', 'soft'),
        LI('Tell us something. Anything that is not snow.'),
      ],
      [
        ask(
          2,
          'maths',
          'K.OA.A.1',
          'two and two make four',
          [N('Two people were in the hollow. Then you and your Nubbin joined. How many now?')],
          [
            opt('Four', [N('Yes! Two and two make four.')], true),
            opt('Three', [N('Let’s count: Líf, Lífthrasir, you, Nubbin. One, two, three, four.')]),
            opt('Two', [N('Two were there, then two more came. Count them: four.')]),
          ],
          'Added two and two to make four.',
        ),
      ],
      {
        choices: [
          {
            id: 'valley',
            label: 'Tell them about your valley.',
            then: [
              Y('There is a pond, and a gate that sticks.'),
              LT('A gate that sticks. That sounds like a good home.', 'happy'),
            ],
          },
          {
            id: 'hall',
            label: 'Tell them about the bright hall.',
            then: [
              N('You tell them about Baldr’s light, and your Nubbin asleep on the boards.'),
              LI('Then there was a light once. Good.', 'soft'),
            ],
          },
          {
            id: 'close',
            label: 'Just sit close.',
            then: [N('You sit close. Lífthrasir leans his head on your shoulder.')],
          },
        ],
      },
    ),
    sc(
      'a20-15-ember-forgiven',
      [
        N('Your Nubbin sets its lantern in the hollow. The red pebble glows.'),
        N('It burns steady all winter. It is never hot, always warm.'),
        LI('Oh. Warm. I had forgotten.', 'soft'),
      ],
      [
        ask(
          1,
          'science',
          'K-PS3-1',
          'warm and cold things',
          [N('The glowing pebble is warm. The snow is cold. Which is warmer?')],
          [
            opt('The pebble', [N('Yes! The pebble is warm. The snow is cold.')], true),
            opt('The snow', [N('Snow is cold. The glowing pebble is warmer.')]),
          ],
          'Compared warm and cold.',
        ),
      ],
    ),
    sc(
      'a20-15-ember-remembered',
      [
        N('Your Nubbin sets its lantern in the hollow. The red pebble glows.'),
        N('It flickers in the wind. Some nights it is very low.'),
        N('But it never goes out. In the morning it is there, small and red.'),
        LT('It keeps trying. Look at it.', 'soft'),
      ],
      [
        doit(
          1,
          'literacy',
          LANG,
          'the word flicker',
          'edu:act:flicker',
          [
            N('Flicker means a light that goes bright, dim, bright, dim.'),
            N('Can you flicker your fingers like a little flame? (Try it.)'),
          ],
          'Learned the word flicker and acted it out.',
        ),
      ],
    ),
    sc(
      'a20-15-kept',
      [
        N('In your pocket the stone wakes in the cold.'),
        N('It hums one word: safe.'),
        N('Líf and Lífthrasir do not like the hum. They move to the far side.'),
      ],
      [
        ask(
          1,
          'literacy',
          'RF.K.2',
          'first sound of safe',
          [N('The stone hums safe. Safe starts with sss. Which word starts with sss too?')],
          [
            opt('Sun', [N('Yes! Sss-sss-sun. Safe and sun both start with sss.')], true),
            opt('Hat', [N('Hat starts with huh. Safe starts with sss, like sun.')]),
          ],
          'Matched words by their first sound (s for safe and sun).',
        ),
      ],
    ),
    sc(
      'a20-15-company-done',
      [LI('You stayed. Nobody stays anywhere any more.', 'soft')],
      [
        ask(
          0,
          'sel',
          'CASEL: Relationship skills',
          'staying with friends in hard times shows we care',
          [N('You stayed with Líf and Lífthrasir. What does staying show?')],
          [
            opt('That we care', [N('Yes. Staying with someone shows that we care.')], true),
            opt('That we are bored', [
              N('Staying shows we care, and it feels good to be cared for.'),
            ]),
          ],
          'Talked about how staying with friends shows care.',
        ),
      ],
    ),
    sc(
      'a20-15-complete',
      [
        N('One morning the dew tastes different.'),
        LT('Something is coming. I can feel it in the roots.', 'think'),
        LI('Not here, though. It will not come here. Will it?'),
        N('Your Nubbin climbs to the edge of the wood and looks out.'),
      ],
      [
        notice(
          0,
          'science',
          '2-ESS2-3',
          'what dew is',
          [
            N('Dew is tiny drops of water on leaves and grass in the morning.'),
            N('It forms when the night air cools.'),
          ],
          'Learned that dew is tiny drops of water that form when the air cools.',
        ),
      ],
    ),
  ],
);

// ================================================================== A20-16 The Twilight
const NEAR_FAR = (): Beat =>
  ask(
    6,
    'maths',
    MATH,
    'near and far',
    [N('Which is near: the root in Nubbin’s arms, or the far-off ship?')],
    [
      opt('The root', [N('Yes! The root is near. The ship is far away.')], true),
      opt('The ship', [N('The ship is far away. The root is near.')]),
    ],
    'Used near and far to compare distances.',
  );

const Q16 = quest(
  'a20-16',
  'The Twilight',
  {
    'a20-16-s1': {
      goal: 'Look out from the edge of the wood.',
      hint: 'Climb the roots where your Nubbin is.',
    },
    'a20-16-s2': {
      goal: 'Wait at the edge of the wood until it is over.',
      hint: 'Stay with Líf and Lífthrasir. Nothing will reach the trees.',
    },
  },
  [
    sc(
      'a20-16-edge',
      [
        N('From the edge of the wood you can see a very long way.'),
        N('Far, far away, something is happening at the end of the world.'),
        N('Tiny wolves run across the sky.'),
        N('A dark ship comes slowly over the sea.'),
        N('There is a figure at its front, who never turns.'),
        N('Far off there is a red glow, like a sunset in the wrong place.'),
        N('None of it comes near. Your Nubbin holds on to a root.'),
      ],
      [NEAR_FAR()],
    ),
    sc(
      'a20-16-edge-sat',
      [
        N('From the edge of the wood you can see a very long way.'),
        N('Far, far away, something is happening at the end of the world.'),
        N('Tiny wolves run across the sky.'),
        N('A dark ship comes slowly over the sea.'),
        N('The figure at its front turns once, and looks at the wood.'),
        N('Then it looks ahead again. Far off there is a low red glow.'),
        N('None of it comes near. Your Nubbin holds on to a root.'),
      ],
      [NEAR_FAR()],
    ),
    sc(
      'a20-16-edge-walked',
      [
        N('From the edge of the wood you can see a very long way.'),
        N('Far, far away, something is happening at the end of the world.'),
        N('Tiny wolves run across the sky.'),
        N('Something comes over the sea. You hear creaking, but cannot see it.'),
        N('Mist lies low on the water. You never see the ship.'),
        N('Far off there is a red glow, like a sunset in the wrong place.'),
        N('None of it comes near. Your Nubbin holds on to a root.'),
      ],
      [NEAR_FAR()],
    ),
    sc(
      'a20-16-wait',
      [
        N('Líf and Lífthrasir come up beside you. They look at your face.'),
        LI('Is it coming here?'),
        Y('No. Not here.'),
        LT('Then we will wait. We are good at waiting.', 'soft'),
        N('The light changes. The noise far off gets less, and then it is gone.'),
      ],
      [
        ask(
          2,
          'sel',
          'CASEL: Self-management',
          'what helps when we feel scared',
          [N('Líf and Lífthrasir feel scared. What helps when we feel scared?')],
          [
            opt(
              'Hold a hand and breathe slowly',
              [N('Yes. A hand to hold and slow breaths help.')],
              true,
            ),
            opt('Hide all alone', [
              N('Being with someone helps more. Hold a hand and breathe slowly.'),
            ]),
          ],
          'Talked about holding a hand and slow breathing when scared.',
        ),
      ],
      {
        choices: [
          {
            id: 'hand',
            label: 'Hold Líf’s hand.',
            then: [N('You hold Líf’s hand. Her fingers are cold, then warm.')],
          },
          {
            id: 'tuck',
            label: 'Tuck your Nubbin in your cloak.',
            then: [N('It puts one eye out, to keep watch with you.')],
          },
          {
            id: 'watch',
            label: 'Keep watching, so someone does.',
            then: [N('You keep watching. It is hard, but someone should.')],
          },
        ],
      },
    ),
    sc(
      'a20-16-complete',
      [
        N('Then it is quiet. A new quiet, like a room when everyone has gone home.'),
        N('The snow stops.'),
        LI('Is it over?'),
        N('Your Nubbin sniffs. The air smells of salt, and of something green.'),
      ],
      [
        ask(
          3,
          'literacy',
          'RL.1.4',
          'words for smells',
          [N('Your Nubbin smells the air. Which word describes a smell: sweet, or loud?')],
          [
            opt('Sweet', [N('Yes! Sweet can describe a smell. Loud is for sounds.')], true),
            opt('Loud', [N('Loud is for sounds. Sweet can describe a smell.')]),
          ],
          'Chose a word that describes a smell.',
        ),
      ],
    ),
  ],
);

// ================================================================== A20-17 The Green Earth
const E17: Line[] = [
  N('Before you go, Baldr gives you a sprig with two leaves.'),
  BA('Too young to ask, once. It is older now. Keep it for me.', 'soft'),
  N('Your Nubbin wakes in his light, then comes back to you on its own.'),
  N('Líf and Lífthrasir walk out together into the morning.'),
  N('You are back in the Grove. There is a gold piece in your pocket.'),
];
const S17: Line = N('The sun goes over the new land. The talk goes on, slow and easy.');

const Q17 = quest(
  'a20-17',
  'The Green Earth',
  {
    'a20-17-s1': {
      goal: 'Walk out of the wood into the new land.',
      hint: 'Follow Líf and Lífthrasir.',
    },
    'a20-17-s2': {
      goal: 'Go to the old ground where the gods’ halls stood.',
      hint: 'Walk across the fields to the grassy plain.',
    },
    'a20-17-s3': {
      goal: 'Look in the grass for the gods’ old game pieces.',
      hint: 'Search the long grass round the old stones.',
    },
  },
  [
    sc(
      'a20-17-green',
      [
        N('The sea goes down. The land comes up, wet and new, green as a first leaf.'),
        N('There are fields already. Corn grows in them, and nobody planted it.'),
        N('Líf and Lífthrasir walk out from the trees, holding hands. Then faster.'),
        LI('Grass! Feel it!', 'happy'),
        LT('And the sun. It is warm again.', 'happy'),
        N('Your Nubbin runs into a field and lies down flat in the sun.'),
      ],
      [
        notice(
          1,
          'science',
          '2-LS2-1',
          'plants grow from seeds that need water and light',
          [
            N('In real life, plants grow from seeds. Seeds wait in the soil.'),
            N('They grow when they get water and sunshine.'),
          ],
          'Learned that seeds wait in the soil and grow with water and sunshine.',
        ),
      ],
    ),
    sc(
      'a20-17-ember',
      [
        N('Líf stops by your Nubbin’s lantern. The pebble still glows.'),
        LI('That kept us warm, I think. Where did it come from?'),
      ],
      [
        ask(
          1,
          'sel',
          'CASEL: Relationship skills',
          'gifts that cost nothing',
          [N('The pebble was a gift. What can you give a friend that costs nothing?')],
          [
            opt('A hug', [N('A hug is a lovely gift, and it costs nothing.')]),
            opt('A smile', [N('A smile is a lovely gift, and it costs nothing.')]),
            opt('A song', [N('A song is a lovely gift, and it costs nothing.')]),
          ],
          'Named gifts that cost nothing, like a hug or a smile.',
        ),
      ],
      {
        choices: [
          {
            id: 'tight',
            label: 'Tell her about the one who gave it.',
            then: [
              Y('Someone gave it, who was very sad. Then they let go, and felt better.'),
              LI('Then it is a good thing to carry.', 'soft'),
            ],
          },
          {
            id: 'nothing',
            label: 'Say nothing.',
            then: [N('You say nothing. Líf nods, as if that were an answer too.')],
          },
        ],
      },
    ),
    sc(
      'a20-17-old-ground',
      [
        N('Where the gods’ halls stood there is grass, with old stones showing through.'),
        N('Some grown sons of the gods are gathering.'),
        N('Two of them carry their father’s hammer, gently.'),
        VI('Guest. Sit with us. There is time for everything.', 'soft'),
        N('Then two more come up the road from the quiet hall.'),
        N('It is Baldr, and Hödr with him!'),
        N('Baldr’s light is just as it was. Your Nubbin is running before you can stand.'),
      ],
      [
        notice(
          0,
          'social-studies',
          'D2.His.2.K-2',
          'places change over time',
          [
            N('Long ago, people built halls to meet in. Now grass grows over the stones.'),
            N('Places change over time. Old things can be remembered.'),
          ],
          'Learned that places change over time, and old things can be remembered.',
        ),
      ],
    ),
    sc(
      'a20-17-old-ground-done',
      [
        N('Your Nubbin runs into Baldr’s light and falls asleep in it, at once.'),
        N('It has been trying to get back there all this time.', 'soft'),
      ],
      [
        doit(
          1,
          'music',
          PHYS,
          'a slow, sleepy clapping beat',
          'edu:clap:lullaby:slow',
          [
            N('Let’s clap a slow, sleepy beat for your Nubbin. Clap, rest. Clap, rest.'),
            N('(Clap four slow claps, with a quiet rest between each.)'),
          ],
          'Clapped a slow, steady beat.',
        ),
      ],
    ),
    sc(
      'a20-17-pieces',
      [
        N('The brothers sit on the grass, and talk about old things.'),
        BA('Do you remember the Thing-field? Thor’s big stone that went drop?', 'happy'),
        HO('I remember the guest telling it. Better than you did.', 'happy'),
        N('In the long grass, your hand finds something small and cold.'),
        N('It is a gold game piece! There are more in the grass.'),
        VI('They were ours, before. Now they are anybody’s.', 'soft'),
      ],
      [
        doit(
          4,
          'maths',
          'K.CC.B.5',
          'count to 6',
          'edu:count:game-pieces:6',
          [
            N('Let’s count the gold pieces in the grass. (Point to each one.)'),
            N('One, two, three, four, five, six. Six gold pieces!'),
          ],
          'Counted six game pieces, pointing at each.',
        ),
      ],
      {
        choices: [
          {
            id: 'baldr',
            label: 'Give the first piece to Baldr.',
            then: [
              BA('Ha! I always lost with this one.', 'happy'),
              HO('He did. He shouted about it every time.', 'happy'),
            ],
          },
          {
            id: 'hodr',
            label: 'Give the first piece to Hödr.',
            then: [
              N('Hödr feels the shape of it.'),
              HO('A little horse. I always wanted to be the horse.', 'happy'),
            ],
          },
          {
            id: 'between',
            label: 'Set it on the grass between them.',
            then: [N('You set it between the brothers. They both reach for it, and laugh.')],
          },
        ],
      },
    ),
    sc(
      'a20-17-complete',
      [
        S17,
        N('Hödr turns his face to you. You are sitting beside him.'),
        HO('You rode to fetch my brother, and you asked for him in the cave.', 'soft'),
        HO('Thank you for trying.', 'soft'),
        ...E17,
      ],
      [
        ask(
          3,
          'sel',
          'CASEL: Responsible decision-making',
          'trying to help is worth it',
          [
            N(
              'Hödr says thank you for trying. Is trying to help worth it, even if it does not work?',
            ),
          ],
          [
            opt('Yes, trying shows we care', [N('Yes. Trying shows that we care.')], true),
            opt('No, only winning counts', [N('Trying matters too. It shows that we care.')]),
          ],
          'Talked about why trying to help matters, even when it does not work out.',
        ),
      ],
    ),
    sc(
      'a20-17-complete-sat',
      [
        S17,
        N('Baldr sits down beside Hödr, close, as they always used to.'),
        BA('You sat with the one who would not cry. Someone should.', 'soft'),
        N('Hödr nods. He does not need to say anything.'),
        ...E17,
      ],
      [
        ask(
          3,
          'sel',
          'CASEL: Social awareness',
          'what we can say to a sad friend',
          [N('You sat with someone who was sad. What can you say to a sad friend?')],
          [
            opt('“I am here.”', [N('“I am here” is a kind thing to say.')]),
            opt('“Do you want a hug?”', [N('Asking about a hug is a kind thing to do.')]),
            opt('“Take your time.”', [N('“Take your time” is a kind thing to say.')]),
          ],
          'Named kind things to say to a sad friend.',
        ),
      ],
    ),
    sc(
      'a20-17-complete-walked',
      [
        S17,
        N('Hödr sits a little apart, with his hands empty.'),
        N('Nobody goes to him at first. You do not either.'),
        BA('Brother. Come and sit here. There is room.', 'soft'),
        N('Hödr gets up, and sits down next to him.'),
        ...E17,
      ],
      [
        ask(
          3,
          'sel',
          'CASEL: Social awareness',
          'inviting someone to join in',
          [N('Baldr invites Hödr to sit with him. How can we invite someone who is alone?')],
          [
            opt(
              'Say, “Come and sit here”',
              [N('Yes. “Come and sit here” makes room for someone.')],
              true,
            ),
            opt('Wait for them to ask', [
              N('Someone who is alone may not ask. Inviting them helps.'),
            ]),
          ],
          'Talked about inviting someone who is alone to join in.',
        ),
      ],
    ),
  ],
);

// ================================================================== exports
/** Every quest as written, with the variant scenes still inside (split out below). */
const ALL_QUESTS: EduQuest[] = [
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
];

const VARIANT_IDS = new Set([
  'a20-01-ember',
  'a20-11-ember',
  'a20-12-kept',
  'a20-margin-hazel',
  'a20-14-bowl-sat',
  'a20-14-bowl-walked',
  'a20-15-ember-forgiven',
  'a20-15-ember-remembered',
  'a20-15-kept',
  'a20-16-edge-sat',
  'a20-16-edge-walked',
  'a20-17-ember',
  'a20-17-complete-sat',
  'a20-17-complete-walked',
]);

/** Sprout versions of every quest on the Weeping page, A20-1 to A20-17. */
export const EDU_A20_SPROUT: EduQuest[] = ALL_QUESTS.map((q) => ({
  ...q,
  scenes: q.scenes.filter((s) => !VARIANT_IDS.has(s.of)),
}));

/** Sprout versions of the flag-chosen variant scenes in ATLAS_A20_VARIANTS. */
export const EDU_A20_SPROUT_VARIANTS: EduScene[] = ALL_QUESTS.flatMap((q) =>
  q.scenes.filter((s) => VARIANT_IDS.has(s.of)),
);

export const CHECKS: string[] = [
  'edu:sort:materials:hard-or-soft',
  'edu:clap:syllables:breidablik',
  'edu:count:promises:5',
  'edu:count:sleipnir-legs:8',
  'edu:count:nights:9',
  'edu:breathe:slow:3',
  'edu:colour:sunset:red-orange',
  'edu:count:doors:4',
  'edu:weave:net:over-under',
  'edu:act:flicker',
  'edu:clap:lullaby:slow',
  'edu:count:game-pieces:6',
];
