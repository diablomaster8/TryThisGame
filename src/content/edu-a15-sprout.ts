/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Atlas page A15, The Humbug
 * (Baum’s The Wonderful Wizard of Oz, 1900, USA).
 *
 * Source: atlas-a15.ts (ATLAS_A15 and ATLAS_A15_VARIANTS). One EduScene per original scene, id
 * `sprout:<original id>`, with the same choice ids and `set` flags (`a15-cap`, `a15-lamb`). Every
 * step scene, done scene, complete scene and variant has a version, and each has exactly one
 * lesson. See EDU-STYLE.md.
 *
 * What it teaches (outline: Kansas and the prairie, cyclones, how a hot-air balloon flies, how
 * coloured lenses change what you see, brains / heart / courage or naming what you already have):
 * flat prairie land, wind as moving air, a safe place in a storm, counting to 5 and 10, colours,
 * first sounds and syllables, sorting materials (straw, tin, silk), oil and a stuck joint, six-legged
 * insects and eight-legged spiders, floating wood, hot air rising, green glass making a green
 * world, a heartbeat, taking turns, saying sorry, waiting, and telling a grown-up about a secret
 * that feels wrong.
 *
 * Left out or softened for this age (EDU-STYLE.md, “Hard things”):
 * - No quotes from the book. Baum’s lines are told again in new words (the grey house, the home
 *   speech).
 * - Staged off the page: the Witch of the East is only two silver shoes; wolves, crows and bees are
 *   sent running; the wildcat is shooed away; the Kalidahs are stuck on the far side when the
 *   Woodman drops the log bridge; the spider “will not trouble anyone again”. The Witch of the
 *   West melts quickly in a puddle, said plainly (“She melts all away, into a brown puddle. She cannot hurt anyone now”),
 *   with Dorothy sorry straight after.
 * - One choice is left out: in a15-14-secret a grown-up asks the child to keep a secret from the
 *   others, so “keep” is dropped (`defaultChoice: 'theirs'`; the choice sets no flag). The lamb
 *   choices stay: the china lamb never suffers, it only goes still.
 * - Corvin: the three variants of a15-14-screen-done name only “a lonely man who fibbed to keep
 *   folk safe”; the chapter 9 detail is left out for this band.
 * - Facts used: Kansas is a flat state in the middle of the USA; a prairie is wide, flat, grassy
 *   land; wind is moving air; Omaha is in Nebraska, next to Kansas (reader only); tin cans and
 *   iron joints can rust when wet; oil helps parts slide; insects have six legs and spiders have
 *   eight; wood floats; hot air is lighter than cold air so it rises; the first people to fly in a
 *   hot-air balloon did so in France in 1783 (reader only); green glass lets green light through;
 *   a heart beats and you can feel it at your wrist; china (porcelain) is clay baked hard.
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
const D = say('a15-dorothy');
const SC = say('a15-scarecrow');
const TW = say('a15-woodman');
const L = say('a15-lion');
const AE = say('a15-em');
const UH = say('a15-henry');
const NW = say('a15-north');
const MK = say('a15-munchkin');
const B = say('a15-boq');
const ST = say('a15-stork');
const Q = say('a15-queen');
const G = say('a15-guardian');
const GW = say('a15-soldier');
const O = say('a15-oz');
const W = say('a15-witch');
const WK = say('a15-winkie');
const MO = say('a15-monkey');
const MM = say('a15-milkmaid');
const PR = say('a15-princess');
const TG = say('a15-tiger');
const HH = say('a15-hammerhead');
const GL = say('a15-glinda');

// ---------------------------------------------------------------- domains and standards
const M: EduDomain = 'maths';
const LIT: EduDomain = 'literacy';
const S: EduDomain = 'science';
const SS: EduDomain = 'social-studies';
const E: EduDomain = 'sel';
const MU: EduDomain = 'music';
const A: EduDomain = 'art';
const H: EduDomain = 'health';

const SE = 'ELOF: Social and Emotional Development';
const LANG = 'ELOF: Language and Communication';
const LITS = 'ELOF: Literacy';
const MATH = 'ELOF: Mathematics Development';
const SCI = 'ELOF: Scientific Reasoning';
const PHYS = 'ELOF: Perceptual, Motor, and Physical Development';
/** ELOF Approaches to Learning includes Creativity: used for the art and music lessons. */
const APP = 'ELOF: Approaches to Learning';
const CASEL_SA = 'CASEL: Self-awareness';
const CASEL_SM = 'CASEL: Self-management';
const CASEL_SO = 'CASEL: Social awareness';
const CASEL_RS = 'CASEL: Relationship skills';

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const words = (t: string) => t.trim().split(/\s+/).length;
const count = (t: string) => (t.match(/[.!?]+(\s|$)/g) ?? []).length;

/**
 * Keeps every line to 14 words or fewer, as the sprout band requires: a long line is cut at
 * sentence ends into several lines by the same speaker (the mood stays on the first). `map[i]`
 * is the index of the last piece of original line i, so a lesson’s `after` can follow.
 */
const split = (lines: Line[]): { lines: Line[]; map: number[] } => {
  const out: Line[] = [];
  const map: number[] = [];
  for (const l of lines) {
    const sentences = l.text.split(/(?<=[.!?”)])\s+(?=[A-Z“(])/);
    const chunks: string[] = [];
    for (const sentence of sentences) {
      const last = chunks[chunks.length - 1];
      if (last !== undefined && words(last) + words(sentence) <= 14 && count(last) < 2)
        chunks[chunks.length - 1] = `${last} ${sentence}`;
      else chunks.push(sentence);
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

/** A choice, with the original’s id and `set` flag kept. */
const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice => ({
  id,
  label,
  ...(set ? { set } : {}),
  then,
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

// ---------------------------------------------------------------- shared pieces
/** A15-14: the little man’s two confessions (all four versions of the screen-done scene). */
const POOR_WIZARD: Line[] = [
  O('I am not a wicked man. I am only a very poor Wizard.', 'sad'),
  O('I was scared of the Witches. That is why the walls are so high.', 'sad'),
];
/** A15-16: the balloon goes (both versions of the launch-done scene). */
const BALLOON_GONE: Line[] = [
  D('Wait! Come back!', 'sad'),
  O('I cannot steer it! Goodbye, my dear!', 'sad'),
  N('The green balloon floats up over the towers. It gets smaller and smaller.'),
];
/** A15-20: Dorothy’s goodbye to you (both farewell versions). */
const FAREWELL: Line[] = [
  D('You came all the way with me. I will tell Aunt Em about you.', 'soft'),
  D('Is your home grey, too?'),
];
const FAREWELL_CHOICES: Choice[] = [
  ch('green', 'Tell her it is green, with a pond.', [
    D('Then you have a lovely place to go back to.', 'soft'),
  ]),
  ch('grey', 'Tell her there is a grey one, and you love her.', [
    D('I love my grey home best. So you know.', 'soft'),
  ]),
  ch('toto', 'Let your Nubbin say goodbye to Toto.', [
    N('Nose to nose. Toto sneezes. That means goodbye.'),
  ]),
];
/** A15-20: Dorothy goes home (all four endings). */
const KANSAS: Line[] = [
  N('Dorothy hugs Toto. She taps her heels together three times.'),
  D('Take me home, please. To Aunt Em.', 'soft'),
  N('Whoosh! She is gone, and her silver shoes fall off into the desert.'),
  N('The page shows Kansas. Aunt Em runs across the grass, arms wide.', 'soft'),
];
/** A15-20: the page closes (all four endings). */
const CLOSE: Line[] = [N('The page closes, soft as a sigh. You are home in the Grove.')];
/** A15-20: the lamb wakes (both pocketed endings). */
const LAMB_WAKES: Line[] = [
  N('Over the wall, you put the lamb down in its field.', 'soft'),
  N('It stands still. Then it shakes, wakes, and runs!', 'happy'),
];

// ================================================================== A15-1 The Grey Prairie
const Q1: EduQuest = quest(
  'a15-01',
  'The Grey Prairie',
  {
    'a15-01-s1': {
      goal: 'Step into the grey page and find the little house.',
      hint: 'Touch the page. Then walk across the flat grass to the one house.',
    },
    'a15-01-s2': {
      goal: 'Help Uncle Henry and Aunt Em get ready for the storm.',
      hint: 'Look at the dark sky. Then help at the little door in the floor.',
    },
    'a15-01-s3': {
      goal: 'Ride the storm in the house. Then step out of the page.',
      hint: 'Hold on to your Nubbin. When the page curls, step through.',
    },
  },
  [
    sc(
      'a15-01-page',
      [
        N('Nova’s book opens at a grey page.'),
        N('Grey grass. Grey sky. One little grey house.'),
        N('Long ago the house was painted. The sun and rain rubbed it off.'),
        N('You step in. The dry grass goes crunch, crunch.'),
        N('There are no hills. No trees. Just sky.'),
        N('A small black dog runs up. Woof, woof!'),
        D('I am Dorothy. This is Toto.', 'happy'),
        N('Toto sniffs your Nubbin. Your Nubbin sniffs Toto.'),
      ],
      [
        ask(
          4,
          SS,
          'flat land is called a prairie',
          'D2.Geo.2.K-2',
          [N('Look all around. Is this land flat, or bumpy with hills?')],
          [
            o(
              'Flat',
              [D('Yes! Flat all the way to the sky. Wide, flat, grassy land is a prairie.')],
              true,
            ),
            o('Bumpy', [D('Look again. No hills here! It is flat. Flat grassland is a prairie.')]),
          ],
          'Described a place: a prairie is wide, flat, grassy land.',
        ),
      ],
      {
        choices: [
          ch('name', 'Tell her your name.', [D('What a nice name!', 'happy')]),
          ch('grey', 'Ask why everything is grey.', [
            D('The sun and wind are rough on it.', 'sad'),
          ]),
          ch('play', 'Let your Nubbin play with Toto.', [
            N('They race round you and tumble in the dust. Giggle!'),
          ]),
        ],
      },
    ),
    sc(
      'a15-01-page-done',
      [
        D('Come and meet Aunt Em. Follow me and Toto!'),
        N('Dorothy’s dress is pale. The grass is brown. The house is grey.'),
        N('Toto starts with the sound t. Say it: t, t, Toto!'),
      ],
      [
        doit(
          2,
          LIT,
          'first sound of a name',
          LITS,
          'edu:say:first-sound:t',
          [N('(Say t, t, Toto together. Then think of another t word: tree, toe, ten.)')],
          'Practised hearing and saying the first sound of a name.',
        ),
      ],
    ),
    sc(
      'a15-01-storm',
      [
        N('Dark clouds roll in. The wind goes whoo, whoo!'),
        UH('A big storm is coming, Em!', 'think'),
        N('The grass bends flat. Whoosh!'),
        AE('Dorothy! Into the cellar, now!', 'shock'),
        N('A cellar is a little room under the floor.'),
        N('Toto hides under the bed. Dorothy kneels down for him.'),
      ],
      [
        ask(
          2,
          S,
          'wind is moving air',
          SCI,
          [N('What do we call air that moves? (Point to the bending grass.)')],
          [
            o('Wind', [N('Yes! Wind is air that moves. It bends the grass.')], true),
            o('Rain', [N('Rain falls from clouds. Air that moves is wind. Whoo!')]),
            o('Snow', [N('Snow is cold and white. Air that moves is wind. Whoo!')]),
          ],
          'Named wind as moving air and saw what it does.',
        ),
      ],
      {
        choices: [
          ch('door', 'Hold the trap door open for her.', [
            N('You hold it tight. The floor shakes.'),
          ]),
          ch('bed', 'Reach under the bed for Toto.', [
            N('You grab his collar and pass him up. Safe!'),
          ]),
          ch('nubbin', 'Grab your Nubbin first.', [
            N('Your Nubbin is in your arms. It is shaking.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-01-storm-done',
      [
        N('The wind screams. The house shakes.'),
        N('Then the house turns round and round.'),
        N('It lifts up, up, up, like a balloon.'),
        D('Hold tight, Toto!', 'shock'),
      ],
      [
        notice(
          0,
          H,
          'go to a safe place in a storm',
          PHYS,
          [
            AE('When a big storm comes, we go to a safe place inside.', 'soft'),
            AE('A cellar is safe. So is a room with no windows.'),
            N('(Ask your grown-up: where is our safe place?)'),
          ],
          'Learned that in a big storm we go to a safe place inside, and talked about ours.',
        ),
      ],
    ),
    sc(
      'a15-01-cyclone',
      [
        N('The house floats high. Inside, it is quiet.'),
        N('It rocks like a cradle. Rock, rock, rock.'),
        N('Toto peeks out of the trap door. Uh-oh!'),
        N('Dorothy catches him and pulls him back.'),
        D('That is enough adventure for one little dog.'),
        N('Dorothy lies down to sleep. Toto cuddles close.'),
        N('You stay awake with your Nubbin.'),
        N('A gap opens in the page. You see green grass!'),
      ],
      [
        doit(
          6,
          M,
          'count to 4',
          'K.CC.B.5',
          'edu:count:travellers:4',
          [
            N('Count who is in the house: Dorothy, Toto, you, your Nubbin.'),
            N('(Count on your fingers. One, two, three, four!)'),
          ],
          'Counted four travellers, matching one number to each.',
        ),
      ],
      {
        choices: [
          ch('step', 'Step through the gap with your Nubbin.', [
            N('You step out. Bump! The house lands behind you.'),
          ]),
          ch('look', 'Take a last look at Dorothy, asleep.', [
            N('She sleeps with one arm round Toto. You step through.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-01-cyclone-done',
      [
        N('You land on soft green grass.'),
        N('Everything is bright. Green trees. A blue brook. Singing birds.'),
        N('Your Nubbin rolls over and over. Wheee!'),
      ],
      [
        ask(
          2,
          E,
          'naming a feeling about something new',
          SE,
          [N('Dorothy lands in a brand new place. How might she feel?')],
          [
            o(
              'Surprised',
              [N('Yes! Surprised, and maybe a bit scared. New places can feel big.')],
              true,
            ),
            o('Bored', [N('Not bored! Her eyes go wide. A new place is a big surprise.')]),
          ],
          'Named a feeling a character might have in a new place.',
        ),
      ],
    ),
    sc(
      'a15-01-complete',
      [
        D('Oh my! Where did Kansas go?', 'shock'),
        N('Little people in blue walk up, slowly.'),
        N('They stop and stare at the house.'),
        N('Two silver shoes poke out under one corner.'),
        N('Only your Nubbin sees them.'),
      ],
      [
        doit(
          0,
          A,
          'finding and naming a colour',
          APP,
          'edu:tap:colour:blue',
          [N('The page was grey. Now it is full of colour! Tap three blue things.')],
          'Hunted for one colour in a picture and named it.',
        ),
      ],
    ),
  ],
);

// ================================================================== A15-2 The Council with the Munchkins
const Q2: EduQuest = quest(
  'a15-02',
  'The Council with the Munchkins',
  {
    'a15-02-s1': {
      goal: 'Say hello to the little people and the old woman in white.',
      hint: 'Walk round the house to where they are waiting.',
    },
    'a15-02-s2': {
      goal: 'Ask the way home. Watch the old woman’s hat.',
      hint: 'Watch the hat while she counts.',
    },
    'a15-02-s3': {
      goal: 'Help Boq lay the tables for the night.',
      hint: 'Carry the blue dishes from the shelf to the long tables.',
    },
  },
  [
    sc(
      'a15-02-council',
      [
        N('Little people in blue gather round. Their hats have tiny bells.'),
        N('An old woman in white bows to Dorothy.'),
        NW('Welcome, my dear. You have set these people free.', 'soft'),
        D('I did not do anything!', 'shock'),
        NW('Your house did. Look under the corner.'),
        N(
          'Only two silver shoes are left. The very old Witch has dried up, like a puddle in the sun.',
        ),
        MK('We are free! Hooray!', 'happy'),
        NW('The silver shoes are yours now.'),
      ],
      [
        ask(
          1,
          SS,
          'finding east on a map',
          'D2.Geo.2.K-2',
          [N('The Munchkins live in the east. The sun comes up in the east. Which way is east?')],
          [
            o(
              'Where the sun comes up',
              [N('Yes! East is where the sun comes up. The Munchkins are that way.')],
              true,
            ),
            o('Where it goes to bed', [N('That is west. East is where the sun wakes up!')]),
          ],
          'Linked east with sunrise on a story map.',
        ),
      ],
      {
        choices: [
          ch('try', 'Tell Dorothy to try them on.', [D('They fit exactly!', 'happy')]),
          ch('careful', 'Tell her to be careful with them.', [
            NW('Wise. Know a charm before you use it.', 'think'),
          ]),
          ch('sniff', 'Let your Nubbin sniff the shoes.', [
            N('Sniff, sniff, achoo! Your Nubbin sits on them.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-02-council-done',
      [
        D('Please, can you help me get home to Aunt Em?'),
        D('She will be so worried.', 'sad'),
        NW('Ah. That is hard. Let me think.', 'think'),
      ],
      [
        ask(
          1,
          E,
          'asking for help when you are worried',
          CASEL_RS,
          [N('Dorothy is worried. What does she do?')],
          [
            o(
              'Asks for help',
              [NW('Yes. Asking is brave and it helps. Now we can work it out.')],
              true,
            ),
            o('Hides', [NW('Hiding keeps the worry big. Asking helps, and Dorothy asked.')]),
          ],
          'Saw that asking for help is a good way to deal with a worry.',
        ),
      ],
    ),
    sc(
      'a15-02-slate',
      [
        MK('Desert to the east. Desert to the west. Nobody crosses.', 'sad'),
        N('The old woman takes off her hat. She counts: one, two, three.'),
        N('The hat turns into a slate. Chalk letters appear.'),
        N('They tell Dorothy to go to the Emerald City.'),
        NW('Keep to the road of yellow bricks. It will take you there.'),
        N('She kisses Dorothy on the forehead. A round mark shines.'),
      ],
      [
        doit(
          3,
          LIT,
          'first letter of a word',
          LITS,
          'edu:say:first-sound:e',
          [
            N('The slate says Emerald City. Emerald starts with the sound eh.'),
            N('(Say eh, eh, Emerald. It starts with the letter E.)'),
          ],
          'Heard the first sound of Emerald and met the letter E.',
        ),
      ],
      {
        choices: [
          ch('you', 'Ask if she will kiss you too.', [
            NW('You carry your own luck, visitor. Share it.', 'soft'),
          ]),
          ch('mark', 'Look closely at the mark.', [N('It shines softly, like a coin in a well.')]),
          ch('nose', 'Hold your Nubbin up to say goodbye.', [
            N('She taps its nose. It goes cross-eyed, proud as can be.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-02-slate-done',
      [
        N('She spins round three times on her left heel.'),
        N('Pop! She is gone. Toto barks at the empty place.'),
        N('Tinkle, tinkle. The tiny hat bells ring.'),
      ],
      [
        doit(
          2,
          MU,
          'steady beat',
          APP,
          'edu:clap:beat:bells',
          [
            N('The bells go tinkle, tinkle, tinkle, tinkle.'),
            N('(Clap a steady beat with them. Clap, clap, clap, clap!)'),
          ],
          'Clapped a steady beat along with a sound.',
        ),
      ],
    ),
    sc(
      'a15-02-boq',
      [
        N('You walk along the yellow road. Evening comes.'),
        N('A big house. A big feast. Boq waves hello.'),
        B('Welcome, Sorceress! Welcome, little friend!', 'happy'),
        D('I am only Dorothy.'),
        B('Then you are a kind witch. That is best. Now: the tables!'),
        B('Five tables. Blue plates only!'),
        N('You carry dishes to the tables. Plates, cups, jugs.'),
      ],
      [
        doit(
          5,
          M,
          'count to 5',
          'K.CC.B.5',
          'edu:count:tables:5',
          [
            N('Count the tables with Boq: one, two, three, four, five.'),
            N('(Point to each table. Say one number for each.)'),
          ],
          'Counted five tables, one number for each.',
        ),
      ],
      {
        choices: [
          ch('toto', 'Sit next to Toto, at the end.', [N('You share a blue cake. Nobody minds.')]),
          ch('dorothy', 'Sit next to Dorothy, of course.', [
            B('A seat of honour! Fetch the tall stool!', 'happy'),
          ]),
          ch('under', 'Sit under the table, where the crumbs land.', [
            B('A practical friend! My gran was the same.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-02-boq-done',
      [
        N('Three fiddlers start to play. Everyone dances.'),
        N('Dorothy laughs, for the first time since the storm.'),
        N('The plates are dark blue. The cups are pale blue.'),
      ],
      [
        ask(
          2,
          A,
          'light and dark shades of one colour',
          APP,
          [N('Which blue is the darker blue, the plates or the cups?')],
          [
            o('The plates', [N('Yes! The plates are dark blue and the cups are pale blue.')], true),
            o('The cups', [N('Look again. The cups are the paler ones. The plates are darker.')]),
          ],
          'Compared two shades of one colour: darker and paler.',
        ),
      ],
    ),
    sc(
      'a15-02-complete',
      [
        N('Boq gives Dorothy his best bed. She falls fast asleep.'),
        N('You sit with Boq on his step. The yellow road glows.'),
        B('It is a long way. But she has the kiss, the shoes, and you.', 'soft'),
        N('Your Nubbin curls up next to the silver shoes.'),
      ],
      [
        ask(
          2,
          E,
          'what helps a friend on a long trip',
          CASEL_SO,
          [N('Dorothy has a long way to go. What helps most?')],
          [
            o(
              'Friends who go with her',
              [B('Yes. A long road is lighter with friends beside you.')],
              true,
            ),
            o('Going alone', [B('Alone is harder. Friends make a long road feel short.')]),
          ],
          'Talked about how friends help on a long, hard journey.',
        ),
      ],
    ),
  ],
);

// ================================================================== A15-3 The Scarecrow
const Q3: EduQuest = quest(
  'a15-03',
  'The Scarecrow',
  {
    'a15-03-s1': {
      goal: 'Help lift the Scarecrow down from his pole.',
      hint: 'Climb into the cornfield. Hold the pole steady.',
    },
    'a15-03-s2': {
      goal: 'Help the Scarecrow find his feet.',
      hint: 'Walk beside him on the yellow bricks. Catch him if he tips.',
    },
    'a15-03-s3': {
      goal: 'Sit by the road and listen to Dorothy talk about Kansas.',
      hint: 'Sit on the bank with them while Dorothy eats her bread.',
    },
  },
  [
    sc(
      'a15-03-pole',
      [
        N('A big cornfield. High on a pole stands a Scarecrow.'),
        N('His head is a sack stuffed with straw. He wears a blue hat.'),
        N('He winks!'),
        SC('Good morning. Would you lift me down, please?', 'happy'),
        N('Someone must hold the pole steady.'),
      ],
      [
        ask(
          1,
          S,
          'straw is light and soft',
          '2-PS1-1',
          [N('The Scarecrow is made of straw. Is straw heavy and hard, or light and soft?')],
          [
            o(
              'Light and soft',
              [N('Yes! Straw is light and soft. That is why he is easy to lift.')],
              true,
            ),
            o('Heavy and hard', [
              N('Not straw! Rocks are heavy and hard. Straw is light and soft.'),
            ]),
          ],
          'Described a material: straw is light and soft.',
        ),
      ],
      {
        choices: [
          ch('hold', 'Hold the pole steady.', [N('You hold tight. Dorothy lifts him down.')]),
          ch('catch', 'Stand underneath, ready to catch him.', [
            N('Flump! He lands on you. Like a big, soft pillow.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-03-pole-done',
      [
        SC('Thank you! I feel much more like a person.', 'happy'),
        N('He stretches. He yawns. He falls flat on his face!'),
        N('He gets up. He falls over sideways. Flop!'),
      ],
      [
        doit(
          1,
          H,
          'balance',
          PHYS,
          'edu:stand:one-foot:balance',
          [
            SC('Walking is hard at first. Try standing on one foot.'),
            N('(Stand on one foot and count to 3. Then switch feet!)'),
          ],
          'Practised balancing on one foot, as the Scarecrow learns to stand.',
        ),
      ],
    ),
    sc(
      'a15-03-feet',
      [
        N('The Scarecrow has never walked. His legs do their own thing.'),
        D('Come with me to the Emerald City. Oz may give you brains.'),
        SC('Then I shall come. What a comfort!', 'happy'),
        N('Step. Step. A hole! Plop! He falls down.'),
        N('Step. Step. Another hole! Plop!'),
        N('Then a brick gets in the way. Bump!'),
      ],
      [
        doit(
          5,
          M,
          'count to 3',
          'K.CC.B.5',
          'edu:count:falls:3',
          [N('How many times did he fall? Plop, plop, bump.'), N('(Count: one, two, three!)')],
          'Counted three falls, one number for each.',
        ),
      ],
      {
        choices: [
          ch('arm', 'Offer him your arm.', [SC('An arm! Just the thing.', 'happy')]),
          ch('holes', 'Walk ahead and call out the holes.', [
            N('Each time you call “Hole!”, he steps round it.'),
          ]),
          ch('nubbin', 'Let your Nubbin lead him.', [
            N('Your Nubbin walks slowly. He copies every step.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-03-feet-done',
      [
        N('First he can only fall.'),
        N('Next he can take small steps.'),
        N('Last he can walk in a nearly straight line.'),
      ],
      [
        ask(
          2,
          LIT,
          'first, next, last',
          LANG,
          [N('What did the Scarecrow do last?')],
          [
            o(
              'Walked nearly straight',
              [N('Yes! First he fell, next he stepped, last he walked.')],
              true,
            ),
            o('Fell down', [N('That was first! Last, he walked in a nearly straight line.')]),
          ],
          'Put three story events in order: first, next, last.',
        ),
      ],
    ),
    sc(
      'a15-03-kansas',
      [
        N('You sit on the bank. Dorothy shares her bread.'),
        SC('Tell me about your home. Kansas?'),
        D('It is grey. The ground, the house, the sky.'),
        SC('Here there is green. Why go back?', 'think'),
        D('Even if home is plain, it is where my people are.', 'soft'),
        D('Nowhere else is home.', 'soft'),
        SC('I see. Home is where the people you love are.', 'think'),
      ],
      [
        ask(
          6,
          E,
          'what makes a place feel like home',
          CASEL_SA,
          [N('What makes a place feel like home to you? (Wait for an answer.)')],
          [
            o('The people there', [SC('Yes. Home is the people you love, not the paint.')], true),
            o('The things in it', [SC('Things are nice. But the people matter most.')]),
            o('The smell of food', [SC('A lovely answer. Food made with love feels like home.')]),
          ],
          'Talked about what makes a place feel like home.',
        ),
      ],
      {
        choices: [
          ch('mine', 'Tell him what you miss about home.', [
            SC('Everyone has a place to miss.', 'happy'),
          ]),
          ch('his', 'Ask him where his home is.', [
            SC('A pole in a field. I do not miss it at all.', 'think'),
          ]),
          ch('asleep', 'Watch your Nubbin, asleep in Dorothy’s lap.', [
            N('Your Nubbin sleeps in her lap. It has found a home.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-03-kansas-done',
      [
        N('The road goes on. The corn fields fade away.'),
        N('Now there are trees on both sides.'),
        N('The Scarecrow walks between you, nearly straight.'),
      ],
      [
        ask(
          1,
          S,
          'plants grow in different places',
          'K-LS1-1',
          [N('Corn grows in open fields. Which grows in the woods?')],
          [
            o('Trees', [N('Yes! Lots of trees grow in woods.')], true),
            o('Corn rows', [N('Corn likes open fields. Woods have trees.')]),
          ],
          'Noticed that different plants grow in different places.',
        ),
      ],
    ),
    sc(
      'a15-03-complete',
      [
        SC('Shall I tell you a secret?'),
        SC('I am afraid of one thing. A lit match.', 'sad'),
        N('Straw burns easily.'),
        N('You make sure he stands far away from the campfire.'),
        N('That night he stands guard. It is the most useful he has felt.'),
      ],
      [
        notice(
          2,
          H,
          'matches are for grown-ups',
          PHYS,
          [
            SC('Fire is hot and can hurt.', 'soft'),
            SC('If you ever find matches, do not touch. Tell a grown-up.'),
          ],
          'Learned to leave matches alone and tell a grown-up.',
        ),
      ],
    ),
  ],
);

// ================================================================== A15-4 The Tin Woodman
const Q4: EduQuest = quest(
  'a15-04',
  'The Tin Woodman',
  {
    'a15-04-s1': {
      goal: 'Follow the groaning sound into the forest.',
      hint: 'Leave the road where the trees are thickest. Listen.',
    },
    'a15-04-s2': {
      goal: 'Find the oil-can in the Woodman’s cottage.',
      hint: 'Look on the shelf for the can with the long thin spout.',
    },
    'a15-04-s3': {
      goal: 'Oil the Woodman’s joints, one after another.',
      hint: 'Start with his neck. Then his arms. Then his legs.',
    },
  },
  [
    sc(
      'a15-04-groan',
      [
        N('In the forest, someone groans. Mmmm.'),
        D('Who is that?', 'shock'),
        N('A man made of tin stands still. His axe is up high.'),
        TW('Mmm. I got wet in the rain. Now I am stuck.', 'sad'),
        TW('Please oil me. The oil-can is in my cottage.'),
      ],
      [
        ask(
          3,
          S,
          'rain can make metal rusty',
          SCI,
          [N('Rain made his joints rusty. What can make metal rusty? Rain or sunshine?')],
          [
            o('Rain', [TW('Yes. Water on metal makes rust. Rusty parts get stuck.')], true),
            o('Sunshine', [TW('Not sunshine. Wet makes rust. Rusty parts get stuck.')]),
          ],
          'Learned that water can make iron rusty, and rusty parts stick.',
        ),
      ],
      {
        choices: [
          ch('go', 'Say you will fetch it.', [TW('Thank you. Mind the step.')]),
          ch('how', 'Ask how it happened.', [
            TW('The rain. I forgot to shelter. That is all.', 'sad'),
          ]),
        ],
      },
    ),
    sc(
      'a15-04-groan-done',
      [
        N('The cottage is just through the trees.'),
        N('You hurry. Your Nubbin is at your heels.'),
        TW('Thank you for stopping to look.', 'soft'),
      ],
      [
        ask(
          2,
          E,
          'helping a friend who is stuck',
          CASEL_RS,
          [
            N(
              'The Woodman was stuck for a year. You stopped to help. What do we do for a friend who is stuck?',
            ),
          ],
          [
            o('Stop and help', [N('Yes! Stopping to help is kind.')], true),
            o('Walk past', [N('Walking past leaves them stuck. Stopping to help is kind.')]),
          ],
          'Talked about stopping to help someone who is stuck.',
        ),
      ],
    ),
    sc(
      'a15-04-cottage',
      [
        N('The cottage is small and tidy.'),
        N('On a shelf stand three oil-cans.'),
        N('One is big and square. One is small and round.'),
        N('One has a long thin spout.'),
        N('Your Nubbin looks up at them.'),
      ],
      [
        ask(
          2,
          M,
          'biggest and smallest',
          'K.MD.A.2',
          [N('Point to the biggest oil-can.')],
          [
            o('The big square one', [N('Yes! The big square can is the biggest.')], true),
            o('The small round one', [
              N('That one is the smallest. The big square can is biggest.'),
            ]),
          ],
          'Compared sizes: biggest and smallest.',
        ),
      ],
      {
        choices: [
          ch('spout', 'Take the one with the long spout.', [
            N('It will reach the joints. It sloshes. It is full.'),
          ]),
          ch('big', 'Take the big square one, to be sure.', [
            N('The big one is empty. You take the full one.'),
          ]),
          ch('picture', 'Look at the picture a little longer.', [
            N('A girl, drawn in pencil, smiles. You take the can and go.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-04-cottage-done',
      [
        N('You run back through the trees.'),
        N('You still see the pencil picture in your mind.'),
        N('The girl in it has a kind face.'),
      ],
      [
        doit(
          2,
          A,
          'drawing a face',
          APP,
          'edu:draw:face:smile',
          [N('Draw a face like the one in the picture. Two eyes, a nose, a smile.')],
          'Drew a simple face, naming the parts.',
        ),
      ],
    ),
    sc(
      'a15-04-oil',
      [
        D('Where shall we start?'),
        N('You start with his neck. Drip, drip.'),
        N('His head turns. Creak, creak.'),
        N('Then his arms. They go down at last.'),
        TW('Ahh. Thank you. Now my legs, please.'),
      ],
      [
        ask(
          2,
          S,
          'oil helps parts slide',
          'K-2-ETS1-1',
          [N('The joints are stuck. What does the oil do?')],
          [
            o('Helps them slide', [N('Yes! Oil helps parts slide, so they can move.')], true),
            o('Makes them stickier', [N('The other way! Oil helps parts slide.')]),
          ],
          'Saw how oil can fix a stuck joint.',
        ),
      ],
      {
        choices: [
          ch('legs', 'Do his legs.', [N('Drip, drip. He takes three steps for fun.')]),
          ch('jaw', 'Give his jaw another drop first.', [TW('Ah. Much better.', 'happy')]),
          ch('all', 'Oil everything you can find, twice.', [N('He shines like a new kettle!')]),
        ],
      },
    ),
    sc(
      'a15-04-oil-done',
      [
        N('First you oiled his neck.'),
        N('Next you oiled his arms.'),
        N('Last you oiled his legs.'),
        TW('Thank you. One more year and I would be a statue.', 'soft'),
      ],
      [
        ask(
          3,
          LIT,
          'first, next, last',
          LANG,
          [N('What did you oil first?')],
          [
            o('His neck', [N('Yes! First the neck, next the arms, last the legs.')], true),
            o('His legs', [N('Legs came last. First was the neck.')]),
          ],
          'Retold three steps in order.',
        ),
      ],
    ),
    sc(
      'a15-04-complete',
      [
        TW('Where are you all going?'),
        D('To the Emerald City, to see Oz.'),
        TW('May I come? I want a heart.', 'think'),
        SC('I want brains.'),
        N('The Woodman taps his chest. Clong. It is empty.', 'sad'),
        N('Dorothy hands you the oil-can. It is yours to carry now.'),
      ],
      [
        ask(
          4,
          E,
          'being kind',
          CASEL_SO,
          [TW('A heart helps me be kind. What is one kind thing to do?')],
          [
            o('Help a friend', [TW('Yes! Helping is kind.')], true),
            o('Share a snack', [TW('Yes! Sharing is kind too.')], true),
            o('Take a toy', [TW('That makes people sad. Helping and sharing are kind.')]),
          ],
          'Named kind actions.',
        ),
      ],
    ),
  ],
);

// ================================================================== A15-5 The Cowardly Lion
const Q5: EduQuest = quest(
  'a15-05',
  'The Cowardly Lion',
  {
    'a15-05-s1': {
      goal: 'Walk on through the deep forest.',
      hint: 'Stay together on the yellow bricks.',
    },
    'a15-05-s2': {
      goal: 'Let your Nubbin decide about the Lion, in its own time.',
      hint: 'Sit by the road and wait. Do not push your Nubbin.',
    },
  },
  [
    sc(
      'a15-05-roar',
      [
        N('The woods are dim. Something growls far away.'),
        N('Your Nubbin walks so close that you tread on it.'),
        N('ROAR! A big Lion leaps out.'),
        N('He bats the Scarecrow. Flump! He scratches the Woodman. Ting!'),
        N('Toto barks. The Lion opens his mouth wide.'),
        D('Leave him alone! You should be ashamed!', 'angry'),
        L('I did not bite him.', 'sad'),
        N('The Lion rubs his nose. His eyes fill with tears.'),
      ],
      [
        notice(
          2,
          S,
          'lions roar to talk to each other',
          SCI,
          [
            N('Lions live in families called prides.'),
            N('A lion roars to call to its family. A roar is very loud.'),
          ],
          'Learned that lions live in prides and roar to call to each other.',
        ),
      ],
      {
        choices: [
          ch('still', 'Stand still. Your Nubbin hides behind your boots.', [
            N('Your Nubbin is flat behind your heels. You stay still.'),
          ]),
          ch('scarecrow', 'Go and pick up the Scarecrow.', [
            N('You set him on his feet and pat him back into shape.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-05-roar-done',
      [
        D('You meant to scare him. That is not kind.'),
        L('I know. Knowing does not help.', 'sad'),
        N('The Lion looks down at his big paws.'),
      ],
      [
        ask(
          2,
          E,
          'saying sorry',
          SE,
          [N('The Lion scared a little dog. What can he say?')],
          [
            o('Sorry', [N('Yes. Sorry helps. It says, I wish I had not.')], true),
            o('Nothing', [N('Saying sorry helps the hurt feeling go away.')]),
          ],
          'Talked about saying sorry after scaring someone.',
        ),
      ],
    ),
    sc(
      'a15-05-sit',
      [
        N('The Lion sits in the road. He wipes his eyes with his tail.'),
        L('A lion should be brave. But I get scared.', 'sad'),
        TW('Be glad. A scared heart is still a heart.', 'soft'),
        N('Your Nubbin comes out. One paw. Its nose. Then all of it.'),
        N('It walks across the road. It sits down next to the Lion.'),
        L('Oh! It is not afraid of me.', 'soft'),
      ],
      [
        ask(
          4,
          LIT,
          'the word brave',
          LANG,
          [N('Brave means doing a thing even when you feel scared. Was your Nubbin brave?')],
          [
            o('Yes, brave', [N('Yes! It felt scared and sat down anyway. That is brave.')], true),
            o('No, just sleepy', [
              N('Look at its trembling paws. It was scared and did it anyway. That is brave.'),
            ]),
          ],
          'Learned the word brave: doing something even when scared.',
        ),
      ],
      {
        choices: [
          ch('tell', 'Tell him it is just as scared as he is.', [
            L('And it came over anyway? Well, I never.', 'think'),
          ]),
          ch('nothing', 'Say nothing. Let them sit.', [
            N('You stay quiet. The Lion keeps very still.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-05-sit-done',
      [
        D('We are going to see Oz. Come with us.'),
        L('Would he have some courage for a lion?', 'think'),
        D('I think he has a cupboard full.'),
      ],
      [
        doit(
          2,
          M,
          'count to 3',
          'K.CC.B.5',
          'edu:count:friends:3',
          [
            N('Count the new friends Dorothy has: the Scarecrow, the Woodman, the Lion.'),
            N('(Count on your fingers. One, two, three!)'),
          ],
          'Counted three friends joining the journey.',
        ),
      ],
    ),
    sc(
      'a15-05-complete',
      [
        N('You all walk on. The Lion walks tall.'),
        N('A beetle is on the road. The Woodman nearly steps on it!'),
        N('He hops aside. He is so glad that happy tears run down.'),
        N('His jaw goes stiff. Mmm!'),
        N('You oil his jaw. The Scarecrow holds his hat.'),
      ],
      [
        doit(
          1,
          S,
          'insects have six legs',
          SCI,
          'edu:count:beetle-legs:6',
          [
            N('A beetle is an insect. Insects have six legs.'),
            N('(Count the beetle legs: one, two, three, four, five, six!)'),
          ],
          'Learned that insects have six legs and counted them.',
        ),
      ],
    ),
  ],
);

// ================================================================== A15-6 The Kalidahs
const Q6: EduQuest = quest(
  'a15-06',
  'The Kalidahs',
  {
    'a15-06-s1': {
      goal: 'Cross the first ditch on the Lion’s back.',
      hint: 'Climb on when the Lion crouches. Hold his mane.',
    },
    'a15-06-s2': {
      goal: 'Keep watch at the back as the wood grows darker.',
      hint: 'Walk last. Listen for growls.',
    },
    'a15-06-s3': {
      goal: 'Help bring the tree down across the ditch. Then hurry everyone over.',
      hint: 'Pull the rope when the Woodman shouts. Cross quickly.',
    },
  },
  [
    sc(
      'a15-06-ditch',
      [
        N('The road stops at a ditch. It is wide and deep.'),
        SC('We cannot fly. Do we jump, or stay?'),
        L('I might be able to jump that.', 'think'),
        SC('Then you are our bridge!'),
        L('I am scared of high places. But I will try.', 'sad'),
      ],
      [
        doit(
          3,
          M,
          'count down from 3',
          MATH,
          'edu:count:down:3',
          [
            N('Count down with the Lion. Three, two, one, jump!'),
            N('(Crouch down low. Then jump up on jump!)'),
          ],
          'Counted down from three and jumped.',
        ),
      ],
      {
        choices: [
          ch('second', 'Go second, with your Nubbin in your coat.', [
            N('The Lion leaps. For a moment, only air under you!'),
          ]),
          ch('last', 'Go last, after Dorothy.', [
            N('By then the Lion is good at it. He lands like a cat.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-06-ditch-done',
      [
        L('That was scary. I need to sit down.', 'shock'),
        N('He sits. Pant, pant, pant.'),
        N('Your Nubbin sits and pants too, to keep him company.'),
      ],
      [
        doit(
          1,
          H,
          'slow breaths to calm down',
          CASEL_SM,
          'edu:breathe:slow:3',
          [
            N('When we feel scared, slow breaths help.'),
            N('(Breathe in, two, three. Breathe out, two, three.)'),
            N('(Do it three times.)'),
          ],
          'Practised slow breathing to calm down after a fright.',
        ),
      ],
    ),
    sc(
      'a15-06-watch',
      [
        N('Strange noises come out of the trees. Rumble, rumble.'),
        L('Those are Kalidahs. They have long claws.', 'shock'),
        N('You walk at the back.'),
        N('A twig snaps. Crack! Your Nubbin looks behind you.'),
        N('A second ditch! It is far too wide to jump.'),
        TW('I will chop this tree. It will fall across.'),
      ],
      [
        doit(
          1,
          LIT,
          'sound words',
          LITS,
          'edu:say:sound-words:rumble',
          [
            N('The woods go rumble, rumble. A twig goes crack!'),
            N('(Say rumble in a deep voice. Then say crack in a sharp voice.)'),
          ],
          'Said sound words aloud: rumble and crack.',
        ),
      ],
      {
        choices: [
          ch('listen', 'Keep listening to the trees.', [N('The rumbling stops. That is worse.')]),
          ch('tree', 'Help the Woodman choose the tree.', [
            N('You pick the straightest one. The Woodman starts to chop.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-06-watch-done',
      [
        N('The tree begins to creak.'),
        N('Crrreak, crrreak. It leans a little more.'),
        N('Behind you, something moves in the dark wood.'),
      ],
      [
        ask(
          2,
          S,
          'things fall down',
          SCI,
          [N('The tree is falling. Does it fall up, or down?')],
          [
            o(
              'Down',
              [
                N(
                  'Yes! Things fall down. Something pulls them to the ground. It is called gravity.',
                ),
              ],
              true,
            ),
            o('Up', [N('Not up! Gravity pulls things down. Watch it fall!')]),
          ],
          'Saw that things fall down, pulled by gravity.',
        ),
      ],
    ),
    sc(
      'a15-06-bridge',
      [
        N('You loop a rope round the tree. Pull! Crash! It falls across.'),
        N('Dorothy crosses first, then the Woodman and the Scarecrow.'),
        N('Then you cross, with your Nubbin under your arm.'),
        N('Two big beasts run out of the trees.'),
        L('The Kalidahs!', 'shock'),
        N('The Lion crosses last. He turns and roars. ROAR!'),
        L('Stand behind me. I will hold them.', 'angry'),
      ],
      [
        ask(
          6,
          E,
          'what helps when you feel scared',
          CASEL_SM,
          [N('The Lion is scared but he stays. What helps when we feel scared?')],
          [
            o(
              'A friend beside us',
              [N('Yes! A friend next to us makes scared feel smaller.')],
              true,
            ),
            o('Hiding alone', [N('Hiding alone feels lonelier. A friend beside us helps.')]),
          ],
          'Talked about what helps when you feel scared: a friend beside you.',
        ),
      ],
      {
        choices: [
          ch('beside', 'Stand beside the Lion.', [N('Your knees shake. His knees shake too.')]),
          ch('back', 'Pull Dorothy back from the edge.', [
            N('You hold her sleeve. She holds yours.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-06-bridge-done',
      [
        N('The Woodman swings his axe. Chop!'),
        N('Crash! The log drops into the ditch.'),
        N('The beasts cannot cross. They grumble and go home.'),
        L('That was a close one. I did not like it.', 'shock'),
      ],
      [
        doit(
          2,
          M,
          'count to 7',
          'K.CC.B.5',
          'edu:count:crossers:7',
          [
            N(
              'Count who crossed: Dorothy, Toto, the Woodman, the Scarecrow, you, your Nubbin, the Lion.',
            ),
            N('(Point to each one. Seven friends!)'),
          ],
          'Counted seven friends who crossed safely.',
        ),
      ],
    ),
    sc(
      'a15-06-complete',
      [
        N('The trees thin out. Ahead is a wide river.'),
        N('The Woodman starts to chop logs for a raft.'),
        L('You stood beside me. You were shaking.', 'think'),
        Y('So were you.'),
        L('Yes. But we both stayed.', 'soft'),
      ],
      [
        ask(
          4,
          SS,
          'rivers are blue on a map',
          '2-ESS2-2',
          [N('On a map, rivers are drawn in a colour. Which one?')],
          [
            o('Blue', [N('Yes! Rivers are blue on maps, like water.')], true),
            o('Red', [N('Not red. Rivers are blue on maps, like water.')]),
            o('Green', [N('Not green. Rivers are blue on maps, like water.')]),
          ],
          'Learned that rivers are drawn blue on a map.',
        ),
      ],
    ),
  ],
);

// ================================================================== A15-7 The River and the Stork
const Q7: EduQuest = quest(
  'a15-07',
  'The River and the Stork',
  {
    'a15-07-s1': {
      goal: 'Tie the logs into a raft.',
      hint: 'Tie each log to the next with a double knot.',
    },
    'a15-07-s2': {
      goal: 'Ride the raft across. Get everyone ashore.',
      hint: 'Hold on in the middle. When the Lion swims, hold the Woodman’s belt.',
    },
    'a15-07-s3': {
      goal: 'Wave down the Stork and ask her to fetch the Scarecrow.',
      hint: 'Walk back up the bank until you see the pole. Then signal the big bird.',
    },
  },
  [
    sc(
      'a15-07-raft',
      [
        N('In the morning the Woodman has logs for a raft.'),
        N('You tie each join twice, to be sure.'),
        N('Your Nubbin hands you the rope ends, one by one.'),
        N('The Scarecrow cuts a long pole to push the raft.'),
        L('I will sit in the middle and keep very still.'),
        D('Where did you learn your knots?'),
      ],
      [
        ask(
          1,
          S,
          'wood floats',
          SCI,
          [N('Will a raft made of wood float, or sink?')],
          [
            o('Float', [N('Yes! Wood floats on water. That is why rafts work.')], true),
            o('Sink', [N('Wood floats! Rafts are made from it because it floats.')]),
          ],
          'Predicted that wood floats and a raft will work.',
        ),
      ],
      {
        choices: [
          ch('gran', 'From your gran. She tied up everything.', [
            D('Mine are Aunt Em’s. They are very tight!', 'happy'),
          ]),
          ch('book', 'From a book with pictures in it.', [
            SC('A book! Brains come in books, they say.', 'think'),
          ]),
          ch('chew', 'Your Nubbin taught you. It chews them.', [
            N('Your Nubbin chews the next knot. You tie it again.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-07-raft-done',
      [
        N('The raft has five logs. Tied tight.'),
        N('Everyone climbs aboard.'),
        N('The raft dips under the Lion. Then it bobs up.'),
      ],
      [
        doit(
          0,
          M,
          'count to 5',
          'K.CC.B.5',
          'edu:count:logs:5',
          [N('Count the logs in the raft.'), N('(One, two, three, four, five logs!)')],
          'Counted five logs, one number each.',
        ),
      ],
    ),
    sc(
      'a15-07-current',
      [
        N('In the middle, the river pulls the raft downstream.'),
        SC('We are going the wrong way!', 'shock'),
        N('The Scarecrow pushes his pole into the mud. It sticks.'),
        N('The raft slips away from under him. He is stuck on his pole!'),
        SC('Goodbye!', 'sad'),
        L('I can swim. Hold my tail!'),
        N('The Lion swims. You all hold on.'),
      ],
      [
        ask(
          1,
          SS,
          'rivers flow downhill',
          'D2.Geo.2.K-2',
          [N('The river pulls the raft along. Does a river flow uphill or downhill?')],
          [
            o('Downhill', [N('Yes! Rivers flow downhill, towards the sea.')], true),
            o('Uphill', [N('Water runs down, not up. Rivers flow downhill.')]),
          ],
          'Learned that rivers flow downhill.',
        ),
      ],
      {
        choices: [
          ch('shout', 'Shout to the Scarecrow that you will come back.', [
            SC('Thank you! I will not go anywhere!', 'sad'),
          ]),
          ch('spray', 'Hold your Nubbin out of the spray.', [
            N('Your Nubbin watches the Scarecrow until he is a dot.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-07-current-done',
      [
        N('At last you reach the bank. Everyone is soaked.'),
        N('You oil the Woodman at once.'),
        D('We must go back and find him.'),
      ],
      [
        ask(
          2,
          E,
          'making a plan when a friend needs help',
          CASEL_RS,
          [N('Our friend is stuck. What helps most?')],
          [
            o(
              'Make a plan together',
              [D('Yes! A plan helps. Let us walk back up the bank.')],
              true,
            ),
            o('Give up', [D('We would never leave a friend. Let us make a plan.')]),
          ],
          'Talked about making a plan together to help a friend.',
        ),
      ],
    ),
    sc(
      'a15-07-stork',
      [
        N('You walk back a long way. There he is, far out on his pole.'),
        D('He is too far to swim to.', 'sad'),
        TW('I would give anything to have him back.', 'sad'),
        N('A big Stork flies low, looking for fish.'),
        N('Your Nubbin sees her first. It stands up tall.'),
      ],
      [
        ask(
          3,
          S,
          'birds fly with wings',
          SCI,
          [N('What does the Stork use to fly?')],
          [
            o('Wings', [N('Yes! Wings. Her big wings push the air.')], true),
            o('Fins', [N('Fins are for fish. Birds fly with wings.')]),
            o('Wheels', [N('Wheels are for carts. Birds fly with wings.')]),
          ],
          'Named wings as the body part birds use to fly.',
        ),
      ],
      {
        choices: [
          ch('wave', 'Wave both arms at the Stork.', [
            N('She circles and lands, folding up like an umbrella.'),
          ]),
          ch('whistle', 'Whistle as loud as you can.', [
            N('Tweeeet! She swoops down to see who is so loud.'),
          ]),
          ch('hold', 'Hold your Nubbin up so she can see it.', [
            N('She looks. It is not a fish. She stays to talk.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-07-stork-done',
      [
        ST('What is all the waving about?'),
        D('Please, will you help our friend? He is on that pole.'),
        ST('Is he heavy?'),
        D('He is only straw. He weighs hardly anything.'),
        ST('Then I will try.'),
      ],
      [
        ask(
          1,
          LIT,
          'asking politely',
          LANG,
          [N('Dorothy wants help. Which is the polite way to ask?')],
          [
            o('Please, will you help?', [N('Yes! Please makes asking kind.')], true),
            o('Help now!', [N('That sounds bossy. Say please, will you help?')]),
          ],
          'Practised polite asking with the word please.',
        ),
      ],
    ),
    sc(
      'a15-07-complete',
      [
        N('The Stork flies out. She grips the Scarecrow and brings him back.'),
        SC('I thought I would be on a stick for ever!', 'happy'),
        N('He hugs everyone. He hugs you twice.'),
        ST('Do not mention it. My chicks are waiting.', 'happy'),
        N('She flies off. The Scarecrow waves until she is gone.'),
      ],
      [
        ask(
          2,
          E,
          'saying thank you',
          CASEL_RS,
          [N('The Scarecrow hugs everyone to say thank you. What else can we do?')],
          [
            o('Say thank you', [N('Yes! Thank you is a lovely way.')], true),
            o('Say nothing', [N('Saying thank you feels nice to hear. Try it!')]),
          ],
          'Practised ways to say thank you.',
        ),
      ],
    ),
  ],
);

const RESP = 'CASEL: Responsible decision-making';

// ================================================================== A15-8 The Poppy Field and the Field Mice
const Q8: EduQuest = quest(
  'a15-08',
  'The Poppy Field and the Field Mice',
  {
    'a15-08-s1': {
      goal: 'Carry your Nubbin out of the poppies.',
      hint: 'Head for the green grass beyond the red flowers.',
    },
    'a15-08-s2': {
      goal: 'Watch over Dorothy by the river, out of the poppies.',
      hint: 'Stay on the grass by the river bank, where the breeze is fresh.',
    },
    'a15-08-s3': {
      goal: 'Tie a string to every mouse.',
      hint: 'Loop a string gently round each mouse. Pass the end to the Woodman.',
    },
  },
  [
    sc(
      'a15-08-poppies',
      [
        N('The road leads through a meadow of flowers.'),
        N('Then comes a field of red poppies. Their smell is very sweet.'),
        N('Bees buzz from poppy to poppy.'),
        D('I will just sit down. Only for a minute.', 'soft'),
        TW('Do not sit! The smell makes you very sleepy!', 'shock'),
        N('Dorothy and Toto fall asleep. Your Nubbin lies down in the red flowers.'),
        N('Your arms feel heavy. You feel sleepy too.'),
        L('Run! Everyone run! I will wait at the other side!', 'shock'),
      ],
      [
        notice(
          2,
          S,
          'bees visit flowers for pollen',
          SCI,
          [
            N('Bees love poppies. They collect a dusty powder called pollen.'),
            N('Bees carry pollen from flower to flower. That helps new seeds grow.'),
          ],
          'Learned that bees collect pollen from flowers and help seeds grow.',
        ),
      ],
      {
        choices: [
          ch('breath', 'Hold your breath and run.', [N('You scoop up your Nubbin and run!')]),
          ch('sleeve', 'Breathe through your sleeve and walk steadily.', [
            N('One foot, then the next. Steady, steady.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-08-poppies-done',
      [
        N('You reach the green grass. Your Nubbin sneezes and wakes.'),
        N('The Lion is fast asleep, far back in the poppies.'),
        SC('He is too heavy for us to lift.', 'sad'),
      ],
      [
        doit(
          0,
          H,
          'stretching to wake up',
          PHYS,
          'edu:stretch:arms:up',
          [
            N('Fresh air helps you wake up. Stretch up high, like waking from a nap!'),
            N('(Reach up, up, up. Then wiggle your fingers and toes.)'),
          ],
          'Stretched and moved the body to feel awake.',
        ),
      ],
    ),
    sc(
      'a15-08-wildcat',
      [
        N('You lay Dorothy on the grass by the river.'),
        N('A big yellow wildcat leaps through the grass. It chases a tiny mouse!'),
        N('The Woodman jumps up with his axe, shouting. The wildcat is startled. It runs away.'),
        Q('Oh, thank you! I thought that was the end of me.'),
        TW('I have no heart. But I help anyone who needs a friend.'),
        Q('I am the Queen of the Field Mice!', 'shock'),
        N('Out of the grass come mice. Dozens. Then hundreds.'),
      ],
      [
        ask(
          1,
          S,
          'what mice eat',
          'K-LS1-1',
          [N('The wildcat wanted to eat a mouse. What do field mice eat?')],
          [
            o(
              'Seeds and grain',
              [N('Yes! Mice nibble seeds. Cats eat mice. That is a food chain.')],
              true,
            ),
            o('Cats', [N('No! Cats eat mice. Mice nibble seeds.')]),
          ],
          'Learned that mice eat seeds and cats eat mice, a simple food chain.',
        ),
      ],
      {
        choices: [
          ch('bow', 'Bow to the Queen.', [Q('Thank you! Few bow to a mouse.', 'happy')]),
          ch('still', 'Make sure your Nubbin keeps still.', [
            N('A mouse sits on its head. It is an honour.'),
          ]),
          ch('lion', 'Ask if the mice can help the Lion.', [
            Q('A Lion? Oh, my whiskers!', 'shock'),
          ]),
        ],
      },
    ),
    sc(
      'a15-08-wildcat-done',
      [
        SC('I have an idea! Lots of mice. And the Lion!', 'happy'),
        Q('A Lion? Will he eat us?'),
        SC('Not he. He is a coward. And asleep. And our friend.'),
      ],
      [
        ask(
          2,
          E,
          'small friends can help big jobs',
          CASEL_SO,
          [N('The mice are small. Can small friends help with a big job?')],
          [
            o('Yes, together', [N('Yes! Many small helpers can do a big job together.')], true),
            o('No', [N('They can! Many small helpers together can do a big job.')]),
          ],
          'Talked about how small helpers working together can do a big job.',
        ),
      ],
    ),
    sc(
      'a15-08-strings',
      [
        SC('Woodman, make a cart. Mice, bring long strings.'),
        N('The Woodman makes a low cart. It has round wheels.'),
        N('Ten mice line up, each with a string.'),
        N('You loop a string gently round each mouse. Loop, knot. Loop, knot.'),
        N('At last all ten strings are tied to the cart.'),
      ],
      [
        doit(
          4,
          M,
          'count to 10',
          'K.CC.B.5',
          'edu:count:mice:10',
          [
            N('Count the mice in the line.'),
            N('(Count to ten, touching one mouse for each number.)'),
          ],
          'Counted ten mice, one number for each.',
        ),
      ],
      {
        choices: [
          ch('count', 'Count the mice.', [N('You count and count. Ten! Well done.')]),
          ch('bow', 'Tie the little one’s string last, with a bow.', [
            Q('A bow! She will be proud for a week.', 'happy'),
          ]),
        ],
      },
    ),
    sc(
      'a15-08-strings-done',
      [
        N('The Woodman and the Scarecrow roll the sleeping Lion onto the cart.'),
        Q('Ready, my people? Pull!'),
        N('The mice pull, all together. The cart begins to move.'),
      ],
      [
        doit(
          2,
          MU,
          'pulling in time to a beat',
          APP,
          'edu:chant:heave-ho:beat',
          [
            N('The mice pull in time: heave, ho! Heave, ho!'),
            N('(Clap a steady beat and chant it with the mice.)'),
          ],
          'Chanted and clapped a steady beat.',
        ),
      ],
    ),
    sc(
      'a15-08-complete',
      [
        N('The mice pull the Lion out onto fresh grass. You untie every mouse.'),
        N('Dorothy wakes up and thanks every mouse she can reach.'),
        Q('Call us if you ever need us. We come running.'),
        N('The Lion wakes up. He is very glad to be awake.'),
        L('Mice? Little mice carried me?', 'shock'),
      ],
      [
        ask(
          3,
          SS,
          'working together makes a job easier',
          'D2.Civ.8.K-2',
          [N('Many mice pulled one cart. Does helping together make a job easier or harder?')],
          [
            o('Easier', [N('Yes! Many helpers make a big job easier.')], true),
            o('Harder', [N('It is easier. Many hands make light work.')]),
          ],
          'Saw that working together makes a hard job easier.',
        ),
      ],
    ),
  ],
);

// ================================================================== A15-9 The Green Spectacles
const Q9: EduQuest = quest(
  'a15-09',
  'The Green Spectacles',
  {
    'a15-09-s1': {
      goal: 'Follow the yellow road to the great green gate.',
      hint: 'Walk until the sky looks green. Ring the bell by the gate.',
    },
    'a15-09-s2': {
      goal: 'Let the Guardian put the green spectacles on you and your Nubbin.',
      hint: 'Sit still while he fits them.',
    },
    'a15-09-s3': {
      goal: 'Walk through the streets of the Emerald City.',
      hint: 'Follow the Guardian to the Palace in the middle.',
    },
  },
  [
    sc(
      'a15-09-gate',
      [
        N('The fences are green now. The houses are green.'),
        N('Ahead is a tall green wall with a gate of green stones.'),
        N('Dorothy rings the bell. Ting-a-ling!'),
        N('A little man in green stands inside.'),
        G('Why have you come to the Emerald City?'),
        D('Please, we would like to see Oz.'),
        G('A silly errand might make him angry!', 'shock'),
      ],
      [
        ask(
          0,
          A,
          'mixing blue and yellow makes green',
          APP,
          [N('Mix blue paint and yellow paint. What colour do you get?')],
          [
            o('Green', [N('Yes! Blue and yellow make green. Like this city!')], true),
            o('Red', [N('Not red. Blue and yellow make green.')]),
            o('Purple', [N('Not purple. Blue and yellow make green.')]),
          ],
          'Learned that mixing blue and yellow paint makes green.',
        ),
      ],
      {
        choices: [
          ch('not', 'Say it is not a silly errand.', [
            SC('Not silly. Important. We hear Oz is good.'),
          ]),
          ch('far', 'Say you have all come a very long way.', [
            G('Everyone has. It is far from everywhere.'),
          ]),
          ch('foot', 'Let your Nubbin answer, its own way.', [
            N('Your Nubbin sits on his foot. He looks less worried.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-09-gate-done',
      [
        G('You will want to see him. But spectacles first.'),
        G('Nobody goes in without spectacles.'),
        N('Spec-ta-cles. Clap each part.'),
      ],
      [
        doit(
          2,
          LIT,
          'clapping syllables',
          LITS,
          'edu:clap:syllables:spectacles',
          [N('Clap the parts of spec-ta-cles. Clap, clap, clap. Three claps!')],
          'Clapped the three syllables of spectacles.',
        ),
      ],
    ),
    sc(
      'a15-09-spectacles',
      [
        D('Why spectacles?'),
        G('The city is so bright, it would hurt your eyes.'),
        G('They lock on. I keep the only key.'),
        N('He opens a box of spectacles. Every one has green glass.'),
        N('He puts a pair on each friend. Even Toto.'),
        N('He finds a tiny pair for your Nubbin. Then yours.'),
        N('Click. Everything is green. The walls, the floor, your hands.'),
      ],
      [
        ask(
          6,
          S,
          'green glass makes everything look green',
          SCI,
          [N('You look through green glass. What colour does the world look?')],
          [
            o('Green', [N('Yes! Green glass makes everything look green.')], true),
            o('Pink', [N('Not pink. Green glass makes the world look green.')]),
          ],
          'Saw that looking through coloured glass changes how things look.',
        ),
      ],
      {
        choices: [
          ch('ask', 'Ask why they have to be locked.', [
            G('Because Oz said so. That saves everyone thinking.'),
          ]),
          ch('check', 'Check that your Nubbin is all right.', [
            N('Your Nubbin looks left, looks right, then looks at you.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-09-spectacles-done',
      [
        N('Your friends look at each other through green glass.'),
        N('Nobody asks why.'),
        N('You wonder, but you stay quiet too.'),
      ],
      [
        ask(
          2,
          E,
          'asking why when you do not understand',
          RESP,
          [N('Nobody asked why. What can we do when we do not understand?')],
          [
            o('Ask why', [N('Yes! Asking why is a good thing to do.')], true),
            o('Never ask', [N('Asking helps us understand. It is good to ask why.')]),
          ],
          'Talked about asking why when something does not make sense.',
        ),
      ],
    ),
    sc(
      'a15-09-streets',
      [
        N('The streets shine. The houses are set with green stones.'),
        N('Everyone wears green. The children stare at the Lion.'),
        N('A man sells green lemonade. It costs three pennies.'),
        SC('Everything is green. I wonder why.', 'think'),
        D('It is the Emerald City. It is meant to be.'),
      ],
      [
        doit(
          2,
          M,
          'count to 3',
          'K.CC.B.5',
          'edu:count:pennies:3',
          [
            N('Count out three green pennies for the lemonade.'),
            N('(One penny, two pennies, three pennies!)'),
          ],
          'Counted out three pennies.',
        ),
      ],
      {
        choices: [
          ch('lemonade', 'Buy your Nubbin a green lemonade.', [
            N('Your Nubbin drinks it all. Slurp! It wants more.'),
          ]),
          ch('towers', 'Look up at the towers.', [
            N('Green towers, green sky. Pretty. A little dizzy.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-09-streets-done',
      [
        N('At last you reach a great building.'),
        N('Its doors are tall and shiny.'),
        N('It is the Palace of Oz. It stands in the middle of the city.'),
      ],
      [
        ask(
          2,
          SS,
          'in the middle of a map',
          'D2.Geo.2.K-2',
          [N('Where is the Palace: in the middle, or at the edge?')],
          [
            o('In the middle', [N('Yes! The Palace is in the middle of the city.')], true),
            o('At the edge', [N('Look again. It is right in the middle.')]),
          ],
          'Described where a building is on a map: in the middle.',
        ),
      ],
    ),
    sc(
      'a15-09-complete',
      [
        N('At the door stands a soldier with a long green beard.'),
        GW('Oz will see you. One at a time. One each day.'),
        GW('Until then, you may each have a room.'),
        N('Your room has a little fountain. Your Nubbin sleeps in it.'),
      ],
      [
        notice(
          0,
          S,
          'emeralds are green gems',
          SCI,
          [
            N('An emerald is a green gem. It grows slowly deep underground, inside rock.'),
            N('Real emeralds are green because of a tiny bit of a metal inside.'),
          ],
          'Learned that emeralds are green gems that form in rock underground.',
        ),
      ],
    ),
  ],
);

// ================================================================== A15-10 Oz, the Great and Terrible
const Q10: EduQuest = quest(
  'a15-10',
  'Oz, the Great and Terrible',
  {
    'a15-10-s1': {
      goal: 'Go into the Throne Room with Dorothy.',
      hint: 'Walk in behind Dorothy. Stand where the Soldier puts you.',
    },
    'a15-10-s2': {
      goal: 'Hear what Oz looked like to the others.',
      hint: 'Wait in the green hall. Talk to whoever comes out.',
    },
    'a15-10-s3': {
      goal: 'Wait outside the Throne Room while the Lion goes in.',
      hint: 'Stand by the door and watch the light under it.',
    },
  },
  [
    sc(
      'a15-10-head',
      [
        N('The Throne Room is big and round. It is all green stones.'),
        N('On a throne sits an enormous Head. It has no body.'),
        O('You stand before Oz, the Great and Terrible. What do you want?', 'angry'),
        D('I am Dorothy. I want to go home to Kansas.'),
        O('First, you must do something for me.', 'think'),
      ],
      [
        ask(
          1,
          LIT,
          'the word enormous',
          LANG,
          [N('The Head is enormous. Enormous means very, very big. Which is enormous?')],
          [
            o('An elephant', [N('Yes! An elephant is enormous. So is the Head.')], true),
            o('An ant', [N('An ant is tiny. An elephant is enormous.')]),
          ],
          'Learned the word enormous and used it to compare.',
        ),
      ],
      {
        choices: [
          ch('hand', 'Hold Dorothy’s hand.', [N('Her hand is cold. She holds on tight.')]),
          ch('look', 'Look at the Head very carefully.', [
            N('The eyes move. The mouth moves. It is a very good Head.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-10-head-done',
      [
        O('Rid the land of the Wicked Witch of the West.'),
        O('Then I will send you home.'),
        D('But I have never hurt anything on purpose.', 'sad'),
      ],
      [
        ask(
          2,
          E,
          'being gentle',
          CASEL_SA,
          [N('Dorothy does not want to hurt anyone. What does that tell us about her?')],
          [
            o('She is gentle', [N('Yes. Dorothy is gentle and kind.')], true),
            o('She is cross', [N('She is not cross. She is gentle and kind.')]),
          ],
          'Named a character trait: gentle.',
        ),
      ],
    ),
    sc(
      'a15-10-reports',
      [
        N('Next day, the Scarecrow goes in.'),
        SC('He was a lovely Lady with wings.'),
        N('Next day, the Woodman goes in.'),
        TW('He was a Beast. He had five eyes!', 'shock'),
        D('He was a Head when I went in.', 'think'),
        SC('Then which is he, really?'),
      ],
      [
        doit(
          3,
          M,
          'count to 5',
          'K.CC.B.5',
          'edu:count:eyes:5',
          [
            N('The Beast had five eyes. Count them.'),
            N('(Draw five eyes in the air. One, two, three, four, five!)'),
          ],
          'Counted to five using the Beast’s eyes.',
        ),
      ],
      {
        choices: [
          ch('all', 'Say he might be all of them.', [
            SC('All of them? That is a lot of Wizard.', 'think'),
          ]),
          ch('none', 'Say he might be none of them.', [
            N('Everyone goes quiet.'),
            TW('None? Then what is in there?', 'shock'),
          ]),
          ch('wait', 'Say you will know when the Lion has been.', [
            L('Me? Oh dear. I forgot it was me tomorrow.', 'shock'),
          ]),
        ],
      },
    ),
    sc(
      'a15-10-reports-done',
      [
        L('I will roar at him. He will have to give me courage.'),
        L('Or I will run away. It could go either way.', 'think'),
        N('Everyone goes quiet. Nobody knows which it will be.'),
      ],
      [
        ask(
          1,
          S,
          'things that give light',
          SCI,
          [N('A Ball of Fire glows. Which gives light: a candle or a stone?')],
          [
            o('A candle', [N('Yes! A candle gives light. So does fire.')], true),
            o('A stone', [N('A stone does not glow. A candle gives light.')]),
          ],
          'Named things that give out light.',
        ),
      ],
    ),
    sc(
      'a15-10-fire',
      [
        N('The Lion goes in. The door shuts.'),
        N('A red light glows under the door. Heat comes out.'),
        SC('Mind the door! I am very dry.', 'shock'),
        N('The door bursts open. The Lion runs out!'),
        L('A Ball of Fire! It singed my whiskers!', 'shock'),
        N('Your Nubbin blows on his warm tail to cool it. Phew!'),
      ],
      [
        notice(
          3,
          H,
          'stay away from fire and tell a grown-up',
          PHYS,
          [
            L('Fire is hot. It can hurt. Stay far away from it.', 'soft'),
            L('If you see fire, step back and tell a grown-up at once.'),
          ],
          'Learned to stay away from fire and tell a grown-up.',
        ),
      ],
      {
        choices: [
          ch('whiskers', 'Look at his whiskers.', [
            N('Three whiskers are curly at the ends. He is a bit proud.'),
          ]),
          ch('said', 'Ask what the Ball of Fire said.', [
            L('The same as to all of you. The Witch first.', 'sad'),
          ]),
        ],
      },
    ),
    sc(
      'a15-10-fire-done',
      [
        L('He is the same, whatever he looks like.'),
        L('He wants the Witch gone.'),
        N('Dor-o-thy. Clap her name.'),
      ],
      [
        doit(
          2,
          LIT,
          'clapping syllables',
          LITS,
          'edu:clap:syllables:dorothy',
          [N('Clap Dor-o-thy: three claps. Clap, clap, clap!')],
          'Clapped the three syllables of Dorothy’s name.',
        ),
      ],
    ),
    sc(
      'a15-10-complete',
      [
        N('That night you all sit in the green hall.'),
        D('We must try. But I do not want to hurt anyone.', 'sad'),
        L('I will come. I will be very scared.'),
        SC('I will come too.'),
        TW('And I.'),
        N('The Guardian points west. There is no road at all.'),
      ],
      [
        ask(
          5,
          SS,
          'the sun sets in the west',
          'D2.Geo.2.K-2',
          [N('The Guardian points west. Where does the sun go to bed: east or west?')],
          [
            o('West', [N('Yes! The sun goes to bed in the west.')], true),
            o('East', [N('East is where the sun wakes up. West is where it goes to bed.')]),
          ],
          'Learned that the sun sets in the west.',
        ),
      ],
    ),
  ],
);

// ================================================================== A15-11 The Witch of the West
const Q11: EduQuest = quest(
  'a15-11',
  'The Witch of the West',
  {
    'a15-11-s1': {
      goal: 'Keep watch while the Witch sends her creatures.',
      hint: 'Stay close to the others. Call out the next one you see.',
    },
    'a15-11-s2': {
      goal: 'Hold on to Dorothy when the Winged Monkeys come.',
      hint: 'Do not run. Hold Dorothy’s hand and keep your Nubbin close.',
    },
    'a15-11-s3': {
      goal: 'Bring the Lion food in secret, as Dorothy does.',
      hint: 'When the Witch is asleep, carry what you saved out to the yard.',
    },
  },
  [
    sc(
      'a15-11-waves',
      [
        N('The land in the west is rough and yellow.'),
        N('The Witch has one eye. It can see very far.'),
        N('She blows a whistle. Wolves come running. The Woodman stands in front. They run away.'),
        N('Next come crows. The Scarecrow flaps them away.'),
        N('Next come bees. The Scarecrow covers you with straw. The bees buzz off.'),
        N('Last come soldiers. The Lion roars, and they run home.'),
        W('Then I will use the Cap!', 'angry'),
      ],
      [
        doit(
          5,
          M,
          'count to 4',
          'K.CC.B.5',
          'edu:count:waves:4',
          [
            N('The Witch sent four things: wolves, crows, bees, soldiers.'),
            N('(Count them on your fingers: one, two, three, four!)'),
          ],
          'Counted four groups sent in turn.',
        ),
      ],
      {
        choices: [
          ch('straw', 'Help stuff the Scarecrow again.', [
            SC('Thank you. A bit lumpy, but just how I like it.', 'happy'),
          ]),
          ch('fur', 'Pick the straw out of your Nubbin’s fur.', [
            N('Straw in its ears, fur and mouth. It likes the taste!'),
          ]),
        ],
      },
    ),
    sc(
      'a15-11-waves-done',
      [
        N('In the Witch’s cupboard is a Golden Cap.'),
        N('Whoever owns it can call the Winged Monkeys three times.'),
        N('The Witch puts it on.'),
      ],
      [
        notice(
          0,
          S,
          'bees are insects with six legs',
          SCI,
          [
            N('Remember the bees? A bee is an insect with six legs and four wings.'),
            N('Bees buzz because their wings beat very fast.'),
          ],
          'Learned that bees are insects with six legs and four wings.',
        ),
      ],
    ),
    sc(
      'a15-11-monkeys',
      [
        N('The sky darkens. Whoosh! Wings!'),
        MO('Sorry about this. We have no choice.', 'sad'),
        N('The Monkeys scoop up the Woodman, the Scarecrow and the Lion.'),
        N('Then the King flies at Dorothy. He stops.'),
        MO('The mark of the Good Witch! We cannot touch her.'),
        N('You are holding Dorothy’s hand. Your Nubbin holds your boot.'),
      ],
      [
        ask(
          1,
          E,
          'how someone else feels',
          CASEL_SO,
          [N('The Monkeys say sorry. They have no choice. How might they feel?')],
          [
            o('Sad', [N('Yes. They feel sad. They do not want to do it.')], true),
            o('Happy', [N('Not happy. They said sorry, so they feel sad.')]),
          ],
          'Thought about how someone forced to act might feel.',
        ),
      ],
      {
        choices: [
          ch('tighter', 'Hold on tighter.', [N('The Monkeys lift you very gently, like eggs.')]),
          ch('shout', 'Shout to the Scarecrow that you will come back.', [
            N('Far off, the Scarecrow’s hat nods. Or was it the wind?'),
          ]),
        ],
      },
    ),
    sc(
      'a15-11-monkeys-done',
      [
        N('The Monkeys set you down at the Witch’s castle.'),
        N('They fly away.'),
        W('The Good Witch’s mark. And silver shoes.', 'think'),
        W('But she does not know what they do!', 'happy'),
      ],
      [
        ask(
          2,
          LIT,
          'rhyming words',
          LITS,
          [N('Shoe rhymes with a word. Which one: blue, or shell?')],
          [
            o('Blue', [N('Yes! Shoe and blue. They sound the same at the end.')], true),
            o('Shell', [N('Shell does not sound like shoe. Blue does!')]),
          ],
          'Found a rhyming word for shoe.',
        ),
      ],
    ),
    sc(
      'a15-11-yard',
      [
        W('You! Clean the pots. Sweep the floor. Feed the fire.', 'angry'),
        N('You work in the kitchen with Dorothy.'),
        N('The Lion is shut in the yard. He will not do what she says.'),
        W('Then no food for you!', 'angry'),
        N('Each night, when she sleeps, Dorothy sneaks him food.'),
        N('Tonight it is your turn. Your Nubbin tiptoes with you.'),
      ],
      [
        ask(
          5,
          H,
          'bodies need food',
          PHYS,
          [N('What does the Lion need to stay strong?')],
          [
            o('Food', [N('Yes! Bodies need food and water to grow and stay strong.')], true),
            o('A hat', [N('A hat is nice. But bodies need food and water.')]),
          ],
          'Learned that bodies need food and water.',
        ),
      ],
      {
        choices: [
          ch('bread', 'Bring him the bread you saved from supper.', [
            L('Bread. Lovely. Did you go hungry for this?', 'soft'),
          ]),
          ch('stew', 'Bring him a bowl of the Witch’s own stew.', [
            L('Her own stew? That is brave!', 'happy'),
          ]),
          ch('sit', 'Bring the food, then stay and sit with him.', [
            N('You sit against his warm side. He purrs very softly.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-11-yard-done',
      [
        L('How will we ever get away?', 'sad'),
        D('I do not know. But we will find a way.'),
        N('The Lion purrs, very quiet.'),
      ],
      [
        doit(
          2,
          MU,
          'quiet and loud',
          APP,
          'edu:sing:quiet-loud',
          [
            N('Purr very quietly. Now ROAR loud. Now purr quietly again.'),
            N('(Try quiet, loud, quiet. Which one is the Lion’s secret voice?)'),
          ],
          'Played with quiet and loud voices.',
        ),
      ],
    ),
    sc(
      'a15-11-complete',
      [
        N('Days go by. The Witch watches the silver shoes.'),
        N('Dorothy only takes them off at night.'),
        N('The Witch is scared of the dark. She is more scared of water.'),
        N('You sweep round a bucket by the kitchen door.'),
      ],
      [
        ask(
          2,
          S,
          'we see when there is light',
          '1-PS4-2',
          [N('The Witch is scared of the dark. What do we need to see in the dark?')],
          [
            o('Light', [N('Yes! We need light to see. A lamp or a candle helps.')], true),
            o('A blanket', [N('A blanket is cosy. But to see, we need light.')]),
          ],
          'Learned that we need light to see.',
        ),
      ],
    ),
  ],
);

// ================================================================== A15-12 The Bucket of Water
const Q12: EduQuest = quest(
  'a15-12',
  'The Bucket of Water',
  {
    'a15-12-s1': {
      goal: 'See the Witch’s trick and try to warn Dorothy.',
      hint: 'Sweep near the middle of the kitchen floor. Something is not right.',
    },
    'a15-12-s2': {
      goal: 'Stand clear while Dorothy throws the bucket.',
      hint: 'Step back from the doorway. Mind your Nubbin’s feet.',
    },
    'a15-12-s3': {
      goal: 'Help the Winkies mend the Woodman and restuff the Scarecrow.',
      hint: 'Go to the rocks and the tall tree. Carry straw back.',
    },
  },
  [
    sc(
      'a15-12-bar',
      [
        N('One morning the Witch hums. She is in a good mood.'),
        N('In the middle of the floor lies an iron bar. Nobody can see it.'),
        N('Your Nubbin sniffs the spot. It will not step there.'),
        W('Fetch me the wood, girl. Straight across the floor.', 'happy'),
        N('Dorothy starts to walk. Your Nubbin’s ears go flat.'),
      ],
      [
        ask(
          4,
          LIT,
          'what might happen next',
          LITS,
          [N('Dorothy walks where the bar is. What might happen next?')],
          [
            o(
              'She might trip',
              [N('Yes! She might trip. Good thinking about what comes next.')],
              true,
            ),
            o('She might fly', [N('Hmm. Not fly. She might trip on the hidden bar.')]),
          ],
          'Predicted what might happen next in a story.',
        ),
      ],
      {
        choices: [
          ch('warn', 'Call out to Dorothy to stop.', [
            N('She turns to look, steps back, and trips.'),
          ]),
          ch('feel', 'Kneel and feel the floor where your Nubbin is sniffing.', [
            N('Your hand finds cold iron. Dorothy walks right into it.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-12-bar-done',
      [
        N('Dorothy trips and falls. One silver shoe pops off.'),
        N('The Witch snatches it and puts it on.'),
        W('Ha! One shoe is better than none.', 'happy'),
      ],
      [
        notice(
          0,
          H,
          'after a fall, check and tell a grown-up',
          PHYS,
          [
            D('Ow. Let me check. Is anything sore?', 'soft'),
            D('If you ever fall and feel sore, tell a grown-up. They will help.'),
          ],
          'Learned to check after a fall and tell a grown-up if hurt.',
        ),
      ],
    ),
    sc(
      'a15-12-bucket',
      [
        D('Give me back my shoe!', 'angry'),
        W('Certainly not. It is mine now.', 'happy'),
        N('Dorothy is so angry. She grabs the bucket and throws the water.'),
        W('Water! Oh no!', 'shock'),
        N('She melts quickly, like sugar in hot tea.'),
        N('She melts all away, into a brown puddle. She cannot hurt anyone now.'),
        D('I am sorry! I did not know!', 'shock'),
      ],
      [
        ask(
          4,
          S,
          'sugar dissolves in water',
          SCI,
          [N('Put a sugar lump in hot tea. What happens to it?')],
          [
            o(
              'It dissolves',
              [N('Yes! It mixes into the tea until you cannot see it. That is called dissolving.')],
              true,
            ),
            o('It gets bigger', [N('It gets smaller! It dissolves into the tea.')]),
          ],
          'Learned that sugar dissolves in water.',
        ),
      ],
      {
        choices: [
          ch('back', 'Hold your Nubbin back from the puddle.', [
            N('Your Nubbin wants to sniff it. You do not let it.'),
          ]),
          ch('dorothy', 'Go to Dorothy.', [
            D('I did not know it would do that.', 'sad'),
            N('She is shaking a little. You stand with her.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-12-bucket-done',
      [
        N('Dorothy picks up her silver shoe and dries it.'),
        N('She puts it back on.'),
        D('She is gone. And I did not mean it.', 'sad'),
        D('Now the Lion can come out.'),
      ],
      [
        ask(
          2,
          E,
          'feelings after an accident',
          CASEL_SA,
          [N('Dorothy did not mean it. How might she feel?')],
          [
            o(
              'Sad and sorry',
              [N('Yes. It is okay to feel sad and sorry, even after an accident.')],
              true,
            ),
            o('Proud', [N('Not proud. She did not mean it, so she feels sad.')]),
          ],
          'Named feelings after an accident: sad and sorry.',
        ),
      ],
    ),
    sc(
      'a15-12-mend',
      [
        N('Dorothy lets the Lion out of the yard.'),
        N('The Winkies are free! They dance in their yellow clothes.'),
        WK('We will help find your friends.'),
        N('The Winkie tinsmiths mend the Woodman. Tap, tap, tap.'),
        N('The Scarecrow needs new straw. Two Winkies carry two handfuls each.'),
        N('Your Nubbin packs the straw in tight.'),
      ],
      [
        ask(
          4,
          M,
          'add 2 and 2',
          'K.OA.A.1',
          [N('Two handfuls and two more handfuls of straw. How many in all?')],
          [
            o('Four', [N('Yes! Two and two make four.')], true),
            o('Three', [N('Let us count: one, two, three, four. Four handfuls!')]),
          ],
          'Added two and two with straw as objects.',
        ),
      ],
      {
        choices: [
          ch('oil', 'Oil the Woodman’s new joints.', [
            TW('Thank you. They forgot I need oiling!', 'happy'),
          ]),
          ch('straw', 'Give the Scarecrow an extra handful of straw.', [
            SC('I feel plump and important!', 'happy'),
          ]),
        ],
      },
    ),
    sc(
      'a15-12-mend-done',
      [
        SC('There. Am I myself again?', 'happy'),
        N('He is. The Woodman is too. The Lion purrs.'),
        N('The Winkies wear yellow. Yellow like the sun.'),
      ],
      [
        doit(
          2,
          A,
          'sorting by colour',
          APP,
          'edu:sort:colours:yellow',
          [
            N('Winkies wear yellow. Tap three yellow things in the picture.'),
            N('(Name each one: sun, hat, flower!)'),
          ],
          'Found and named things of one colour.',
        ),
      ],
    ),
    sc(
      'a15-12-complete',
      [
        N('Dorothy finds the Golden Cap in a cupboard.'),
        D('It is very pretty. I will wear it.'),
        WK('This one is for your little one. We made it in the night.', 'happy'),
        N('A tiny gold cap, with shiny beads. It fits your Nubbin.'),
        WK('It does not call anything. It is just a hat.'),
      ],
      [
        ask(
          2,
          S,
          'metal is shiny',
          '2-PS1-1',
          [N('Which is shiny: a gold cap or a straw hat?')],
          [
            o('A gold cap', [N('Yes! Gold is a shiny metal.')], true),
            o('A straw hat', [N('Straw is soft and dull. Gold is shiny.')]),
          ],
          'Compared materials: gold is shiny, straw is soft and dull.',
        ),
      ],
    ),
  ],
);

// ================================================================== A15-13 The Golden Cap
const Q13: EduQuest = quest(
  'a15-13',
  'The Golden Cap',
  {
    'a15-13-s1': {
      goal: 'Read the words inside the Golden Cap.',
      hint: 'Turn the Cap over and read the lining. It says which foot to stand on.',
    },
    'a15-13-s2': {
      goal: 'Fly to the Emerald City and listen to the Monkey King.',
      hint: 'Hold on to the King as he carries you. Ask him something, or just listen.',
    },
  },
  [
    sc(
      'a15-13-lost',
      [
        N('There is no road going back. You walk towards the rising sun.'),
        N('But the grass looks the same. You are lost.'),
        SC('We have passed that bush three times.', 'think'),
        D('I know! I will call the Queen of the Field Mice!'),
        Q('The Cap you wear can call the Winged Monkeys!', 'think'),
        N('Dorothy hands you the Cap. Inside are three odd words.'),
        N('There are tiny steps too, about which foot to stand on.'),
      ],
      [
        ask(
          1,
          SS,
          'the sun rises in the east',
          'D2.Geo.2.K-2',
          [N('You walk towards the rising sun. Where does the sun rise: east or west?')],
          [
            o('East', [N('Yes! The sun rises in the east. You are walking east.')], true),
            o('West', [N('West is where the sun goes to bed. It rises in the east.')]),
          ],
          'Learned that the sun rises in the east.',
        ),
      ],
      {
        choices: [
          ch('read', 'Read the words out for her, slowly.', [
            N('Dorothy says them after you. Left foot, right foot, both.'),
          ]),
          ch('foot', 'Let your Nubbin stand on one foot too.', [
            N('Wobble, wobble, plop! Dorothy laughs mid-charm.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-13-lost-done',
      [
        N('Flap! Flap! Winged Monkeys land all round you.'),
        MO('First call. What do you want?', 'think'),
        D('Please carry us to the Emerald City.'),
      ],
      [
        doit(
          0,
          LIT,
          'following spoken steps',
          LANG,
          'edu:follow:steps:left-right',
          [
            N('Dorothy followed steps: left foot, right foot, both feet.'),
            N('(Now you try: stand on your left foot, then your right, then both!)'),
          ],
          'Listened to steps in order and followed them.',
        ),
      ],
    ),
    sc(
      'a15-13-flight',
      [
        N('Monkeys carry the friends. The King carries you.'),
        N('The ground is far below. It looks like a green blanket.'),
        D('Why do you have to do what the Cap says?', 'think'),
        MO('We were free once. We played in the forest.', 'sad'),
        MO('Once we played a trick that was not kind.'),
        MO('So now we must do what the Cap says.', 'sad'),
      ],
      [
        ask(
          5,
          E,
          'showing you care what someone wants',
          CASEL_SO,
          [N('The Monkeys cannot choose. How can we show we care what someone wants?')],
          [
            o('Ask them', [N('Yes! Asking someone what they want shows you care.')], true),
            o('Guess for them', [N('Guessing can be wrong. Asking is better.')]),
          ],
          'Learned that asking someone what they want shows you care.',
        ),
      ],
      {
        choices: [
          ch(
            'ask',
            'Ask what they would do, if they were free.',
            [
              MO('Free?', 'shock'),
              MO('Nobody has asked. I will think about it.', 'think'),
              N('He looks up at the sky as if it has changed.'),
            ],
            { 'a15-cap': 'asked' },
          ),
          ch(
            'silent',
            'Say nothing. Listen to the wind.',
            [N('You listen. The wind carries his story away.')],
            { 'a15-cap': 'silent' },
          ),
        ],
      },
    ),
    sc(
      'a15-13-flight-done',
      [
        N('The Monkeys set you down at the gate. Down you go.'),
        N('They bow once. Then they fly away fast.'),
        SC('Now that is how to travel! No ditches!', 'happy'),
      ],
      [
        ask(
          0,
          S,
          'things look smaller from high up',
          SCI,
          [N('From high in the sky, do houses look big or small?')],
          [
            o('Small', [N('Yes! Things look small from far away. The higher, the smaller.')], true),
            o('Big', [N('From up high they look tiny, like toys!')]),
          ],
          'Noticed that things look smaller from high up.',
        ),
      ],
    ),
    sc(
      'a15-13-complete',
      [
        N('The Guardian is very surprised to see you.'),
        G('You went to the Witch? And you came back?', 'shock'),
        SC('Dorothy melted her with a bucket.'),
        N('He locks the green spectacles on you all again. Click.'),
        N('Your Nubbin holds still for its pair.'),
      ],
      [
        doit(
          3,
          M,
          'count to 7',
          'K.CC.B.5',
          'edu:count:travellers:7',
          [
            N(
              'Count everyone in the hall. Dorothy, Toto, Scarecrow, Woodman, Lion, you, your Nubbin.',
            ),
            N('(Point and count. Seven!)'),
          ],
          'Counted seven travellers, one number for each.',
        ),
      ],
    ),
  ],
);

// ================================================================== A15-14 The Humbug
const Q14: EduQuest = quest(
  'a15-14',
  'The Humbug',
  {
    'a15-14-s1': {
      goal: 'Go into the Throne Room together, all of you.',
      hint: 'Stand together in the middle of the room.',
    },
    'a15-14-s2': {
      goal: 'Hear the little man out.',
      hint: 'Stand still and let him talk. He is more frightened than you.',
    },
    'a15-14-s3': {
      goal: 'Decide what to do about the little man’s secret.',
      hint: 'He is asking you. Answer him.',
    },
  },
  [
    sc(
      'a15-14-voice',
      [
        N('Oz keeps you waiting four days. On the fifth, you all go in.'),
        N('There is no Head. Just an empty throne.'),
        O('Oz, the Great and Terrible, is listening. Why have you come?'),
        N('The voice comes from high up. It seems to come from everywhere.'),
        D('The Witch is gone. We have come for what you promised.'),
        O('Give me one more day to think.'),
        TW('You have had weeks!', 'angry'),
        L('I think I should roar now.', 'think'),
      ],
      [
        notice(
          3,
          S,
          'sound bounces in big round rooms',
          SCI,
          [
            N('In a big round room, sound bounces off the walls.'),
            N('That can make a voice seem to come from everywhere. It is called an echo.'),
          ],
          'Learned that sound bounces off walls and makes echoes.',
        ),
      ],
      {
        choices: [
          ch('roar', 'Tell the Lion to go on, then.', [
            N('ROAR! Toto jumps and runs into a corner.'),
          ]),
          ch('let', 'Let go of your Nubbin.', [
            N('Your Nubbin runs after Toto, who barks at a screen.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-14-voice-done',
      [
        N('Toto bumps a tall screen in the corner.'),
        N('Crash! It falls over.'),
        N('Behind it stands a little old man. He looks as surprised as you.'),
      ],
      [
        ask(
          1,
          LIT,
          'cause and effect',
          LITS,
          [N('Toto bumped the screen. What happened then?')],
          [
            o(
              'It fell over',
              [N('Yes! He bumped it, so it fell. That is cause and effect.')],
              true,
            ),
            o('It flew away', [N('It did not fly. Toto bumped it and it fell.')]),
          ],
          'Linked a cause (a bump) to its effect (the screen fell).',
        ),
      ],
    ),
    sc(
      'a15-14-screen',
      [
        TW('Who are you?', 'angry'),
        O('I am Oz. Please, do not be cross.', 'shock'),
        D('But you were a Head!'),
        O('That was pretending. I am a humbug.', 'sad'),
        O('I come from Omaha. I can make my voice come from anywhere.'),
        O('I came here in a balloon. People thought I was a great Wizard.'),
        O('So I gave everyone green spectacles. It began as a small fib.', 'sad'),
      ],
      [
        ask(
          6,
          E,
          'telling the truth',
          RESP,
          [N('Oz told a small fib, and it grew. What is better: the truth, or a fib?')],
          [
            o('The truth', [N('Yes! The truth is lighter to carry. A fib can grow.')], true),
            o('A fib', [N('Fibs grow bigger and bigger. The truth is better.')]),
          ],
          'Talked about why telling the truth is better than a growing fib.',
        ),
      ],
      {
        choices: [
          ch('band', 'Touch the gold band behind your ear.', [
            N('The city is green because you wear green glass.'),
          ]),
          ch('lenses', 'Look at your Nubbin, in its little green lenses.', [
            N('Your Nubbin has never seen this place as it really is.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-14-screen-done',
      [
        ...POOR_WIZARD,
        N('Somebody in the valley says safe, safe, all the time.'),
        N('Safe, he says. As if it came in a bottle.'),
      ],
      [
        ask(
          3,
          LIT,
          'the word humbug',
          LANG,
          [N('A humbug is someone who pretends. Who pretended: Oz, or the Lion?')],
          [
            o('Oz', [N('Yes! Oz pretended to be a great Wizard. That is a humbug.')], true),
            o('The Lion', [N('The Lion was real. Oz was the one pretending.')]),
          ],
          'Learned the word humbug: someone who pretends.',
        ),
      ],
    ),
    sc(
      'a15-14-secret',
      [
        N('The others talk quietly in a far corner.'),
        N('The little man turns to you.'),
        O('Please do not tell anyone. They think they are safe.'),
        O('If they knew, they would be scared.'),
        O('I will do my best for your friends, I promise.', 'think'),
      ],
      [
        notice(
          4,
          E,
          'secrets that feel wrong',
          RESP,
          [
            N('Some secrets are fun, like a surprise party.'),
            N('If a secret makes your tummy feel funny, tell a grown-up you trust.'),
            N('Tell them, too, if a grown-up asks you to keep a secret.'),
          ],
          'Learned that a secret that feels wrong should be told to a trusted grown-up.',
        ),
      ],
      {
        choices: [
          ch('theirs', 'Tell him it is not yours to keep. It is theirs.', [
            O('Theirs. Yes. I suppose it always was.', 'sad'),
          ]),
          ch('quiet', 'Say nothing, and look at the screen.', [
            N('You both look at the screen on the floor. Neither of you speaks.'),
          ]),
        ],
        defaultChoice: 'theirs',
      },
    ),
    sc(
      'a15-14-secret-done',
      [
        O('Come to me in the morning, all of you.'),
        O('I will have something for each of you.'),
        N('You waited four days. One, two, three, four.'),
      ],
      [
        doit(
          2,
          M,
          'count to 4',
          'K.CC.B.5',
          'edu:count:days:4',
          [
            N('Count the days you waited for Oz: one, two, three, four.'),
            N('(Hold up a finger for each day.)'),
          ],
          'Counted four days, one number for each.',
        ),
      ],
    ),
    sc(
      'a15-14-complete',
      [
        D('How will I get home to Kansas?'),
        O('That will take thinking. Give me a few days.'),
        L('You are only a humbug. What can you give?', 'think'),
        O('Most people only need to be told they have it.', 'think'),
        N('You stand the screen back up. It seems kinder.'),
      ],
      [
        ask(
          3,
          E,
          'noticing what you already have',
          CASEL_SA,
          [N('The Lion went on even when he was scared. What did he already have?')],
          [
            o('Courage', [N('Yes! He had courage inside all along.')], true),
            o('Nothing', [N('He had courage. Going on while scared is courage.')]),
          ],
          'Named courage as something the Lion already had.',
        ),
      ],
    ),
  ],
);

// ================================================================== A15-15 The Magic Art
const Q15: EduQuest = quest(
  'a15-15',
  'The Magic Art',
  {
    'a15-15-s1': {
      goal: 'Help Oz mix the Scarecrow’s brains.',
      hint: 'Count out the scoops of bran. Hand Oz what he asks for.',
    },
    'a15-15-s2': {
      goal: 'Help Oz make the Woodman’s heart.',
      hint: 'Hold the silk heart steady while Oz fills it.',
    },
    'a15-15-s3': {
      goal: 'Pour out the Lion’s courage.',
      hint: 'Hold the green dish while Oz pours. Pass it to the Lion.',
    },
  },
  [
    sc(
      'a15-15-brains',
      [
        N('In the morning, the Scarecrow goes in first.'),
        O('Please sit there. I need your help.'),
        N('Oz lifts off the top of the Scarecrow’s head.'),
        N('He fetches a sack of bran. Bran is crunchy and brown.'),
        O('Three scoops of bran, please. Then a pinch of this and that.'),
        N('You hand him the scoops. He stirs with a wooden spoon.'),
      ],
      [
        doit(
          4,
          M,
          'count to 3',
          'K.CC.B.5',
          'edu:count:scoops:3',
          [
            N('Count three scoops of bran into the bowl.'),
            N('(One scoop, two scoops, three scoops!)'),
          ],
          'Counted out three scoops.',
        ),
      ],
      {
        choices: [
          ch('more', 'Suggest a bit more, to be safe.', [O('A bit more. Yes. Very sensible.')]),
          ch('spoon', 'Ask what the spoon is for.', [
            O('For stirring. And for looking busy.', 'think'),
          ]),
          ch('taste', 'Watch your Nubbin, who is eating the bran.', [
            N('Crunch. It makes a face. No more brains for it!'),
          ]),
        ],
      },
    ),
    sc(
      'a15-15-brains-done',
      [
        N('Oz fills the Scarecrow’s head and pins it back.'),
        O('There! New brains. You will be a great thinker.', 'happy'),
        SC('I feel wise! Very wise!', 'happy'),
      ],
      [
        ask(
          2,
          S,
          'the brain is in the head',
          SCI,
          [N('Where is your brain? Touch it.')],
          [
            o('In my head', [N('Yes! Your brain is in your head. It helps you think.')], true),
            o('In my tummy', [N('Your tummy digests food. Your brain is in your head.')]),
          ],
          'Learned that the brain is in the head and helps us think.',
        ),
      ],
    ),
    sc(
      'a15-15-heart',
      [
        N('Next comes the Woodman.'),
        TW('Will it hurt?', 'think'),
        O('Not at all.'),
        N('Oz takes out a pretty silk heart. You hold it steady.'),
        N('He fills it with soft sawdust.'),
        N('He puts it in the Woodman’s chest, then patches it shut. Clink, clink.'),
      ],
      [
        doit(
          0,
          H,
          'feel your heartbeat',
          PHYS,
          'edu:feel:heartbeat',
          [
            N('You have a real heart. Put your hand on your chest.'),
            N('(Feel it? Thump, thump, thump.)'),
            N('(Your heart beats all day and night!)'),
          ],
          'Felt a heartbeat with a hand on the chest.',
        ),
      ],
      {
        choices: [
          ch('listen', 'Put your ear to the Woodman’s chest.', [
            N('A soft rustle. The Woodman holds very still.'),
          ]),
          ch('polish', 'Polish the new patch on his chest.', [
            TW('Thank you. A heart ought to show a little.', 'soft'),
          ]),
        ],
      },
    ),
    sc(
      'a15-15-heart-done',
      [
        TW('I feel it! Thank you, thank you.', 'happy'),
        O('Do not mention it. Please.', 'think'),
        N('The Woodman holds very still, listening to his chest.'),
      ],
      [
        ask(
          1,
          E,
          'a kind heart cares for others',
          CASEL_SO,
          [N('A kind heart does what? Cares for others, or grabs everything?')],
          [
            o('Cares for others', [N('Yes! A kind heart cares for other people.')], true),
            o('Grabs everything', [N('A kind heart shares. It cares for others.')]),
          ],
          'Talked about what a kind heart does.',
        ),
      ],
    ),
    sc(
      'a15-15-courage',
      [
        N('Last comes the Lion.'),
        N('Oz takes down a square green bottle. You hold the dish.'),
        N('It is green. It fizzes.'),
        L('I was scared all the way here.', 'sad'),
        O('Everyone is scared sometimes. Brave is going on anyway.', 'soft'),
        O('You did that the whole way.'),
      ],
      [
        doit(
          0,
          LIT,
          'first sound of a name',
          LITS,
          'edu:say:first-sound:l',
          [
            N('Lion starts with the sound l. Say it: l, l, Lion!'),
            N('(Can you think of another l word? Lamp, leaf, lemon!)'),
          ],
          'Heard and said the first sound of Lion.',
        ),
      ],
      {
        choices: [
          ch('hand', 'Hand the Lion the dish.', [N('He drinks it to the bottom.')]),
          ch('carry', 'Let your Nubbin carry it over.', [
            N('It spills only a little. The Lion drinks the rest.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-15-courage-done',
      [
        L('I feel very full of something.', 'happy'),
        N('The dish is round and green.'),
        N('Green is the colour of grass and leaves.'),
      ],
      [
        doit(
          1,
          A,
          'drawing a shape in one colour',
          APP,
          'edu:draw:circle:green',
          [N('Draw a big round circle in green, like the dish.')],
          'Drew a circle and named its colour.',
        ),
      ],
    ),
    sc(
      'a15-15-complete',
      [
        N('Your friends walk out into the green hall.'),
        N('The Scarecrow thinks hard. The Woodman listens. The Lion stands tall.'),
        O('I give them bran and sawdust and green water.'),
        O('And it works. They feel better.'),
        N('Your friends are happy, with what they had all along.'),
      ],
      [
        ask(
          4,
          E,
          'naming something good about yourself',
          CASEL_SA,
          [N('What is something good you already have inside you?')],
          [
            o('I am kind', [N('Yes! Kind is a good thing to have.')], true),
            o('I am a good helper', [N('Yes! Helping is a lovely thing.')], true),
            o('I am funny', [N('Yes! Making people smile is a gift.')], true),
          ],
          'Named a good quality they already have.',
        ),
      ],
    ),
  ],
);

// ================================================================== A15-16 The Balloon
const Q16: EduQuest = quest(
  'a15-16',
  'The Balloon',
  {
    'a15-16-s1': {
      goal: 'Help sew the great green balloon.',
      hint: 'Hold the silk strips straight while Dorothy sews.',
    },
    'a15-16-s2': {
      goal: 'See the balloon off from the Palace yard.',
      hint: 'Stand by the ropes. Keep an eye on Toto.',
    },
    'a15-16-s3': {
      goal: 'Ask about the way south, now the balloon has gone.',
      hint: 'Go to the Palace and listen to the Soldier.',
    },
  },
  [
    sc(
      'a15-16-sew',
      [
        N('On the third day, Oz sends for Dorothy.'),
        O('I came in a balloon. I will leave in a balloon.', 'happy'),
        N('There are five strips of green silk to sew together.'),
        N('You hold the strips straight. Dorothy sews.'),
        N('Your Nubbin sits in the silk scraps like an egg in a nest.'),
        O('Then glue inside, and a basket to sit in.'),
      ],
      [
        doit(
          2,
          M,
          'count to 5',
          'K.CC.B.5',
          'edu:count:strips:5',
          [N('Count the strips of green silk.'), N('(One, two, three, four, five strips!)')],
          'Counted five strips of silk.',
        ),
      ],
      {
        choices: [
          ch('stitch', 'Ask Dorothy to show you her stitch.', [
            D('Small and even, Aunt Em says. And do not pull.', 'soft'),
          ]),
          ch('basket', 'Test the clothes-basket with your Nubbin.', [
            N('It climbs in, turns round, and goes to sleep.'),
          ]),
          ch('steer', 'Ask Oz if he has ever steered one.', [
            O('Nobody steers a balloon. You go where the wind goes.', 'think'),
          ]),
        ],
      },
    ),
    sc(
      'a15-16-sew-done',
      [
        N('At last the balloon is finished.'),
        N('It is green and big and shiny with glue.'),
        N('Bal-loon. Clap the parts.'),
      ],
      [
        doit(
          2,
          LIT,
          'clapping syllables',
          LITS,
          'edu:clap:syllables:balloon',
          [N('Clap bal-loon. Two claps! Clap, clap!')],
          'Clapped the two syllables of balloon.',
        ),
      ],
    ),
    sc(
      'a15-16-launch',
      [
        N('Everyone in the city comes to watch.'),
        N('The Woodman lights a fire. Oz holds the balloon over it.'),
        N('Hot air fills the balloon. It swells up. Whoosh!'),
        O('I am going to visit a Wizard in the clouds!', 'happy'),
        N('Oz climbs into the basket.'),
        D('Wait! I cannot find Toto!', 'shock'),
        N('Toto chases a kitten. Dorothy chases Toto.'),
        N('Snap! The ropes break. The balloon floats up without her.'),
      ],
      [
        ask(
          2,
          S,
          'hot air rises',
          SCI,
          [N('What fills the balloon so it floats up? Hot air, or a stone?')],
          [
            o('Hot air', [N('Yes! Hot air is lighter than cold air, so it floats up.')], true),
            o('A stone', [N('A stone is heavy. It would sink! Hot air floats up.')]),
          ],
          'Learned that hot air rises, so a hot-air balloon floats.',
        ),
      ],
      {
        choices: [
          ch('rope', 'Run after the trailing rope.', [N('You jump. You miss. Up it goes.')]),
          ch('catch', 'Catch Dorothy before she falls.', [
            N('You catch her. Toto is in her arms, pleased with himself.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-16-launch-done',
      [...BALLOON_GONE, N('Smaller. Then it is gone.')],
      [
        ask(
          2,
          E,
          'comforting a sad friend',
          CASEL_SO,
          [N('Dorothy is sad. What helps a sad friend?')],
          [
            o('A hug', [N('Yes! A hug and a kind word help a sad friend.')], true),
            o('Walk away', [N('A friend who stays close helps most. Try a hug.')]),
          ],
          'Talked about how to comfort a sad friend.',
        ),
      ],
    ),
    sc(
      'a15-16-south',
      [
        N('Dorothy cries. Then she wipes her eyes.'),
        D('I will use the Cap again. Fly me home!'),
        MO('We cannot. Our wings stop at the desert.', 'sad'),
        N('They fly away. Dorothy sits down on the steps.'),
        GW('Ask Glinda, the Good Witch of the South.'),
        D('Then I will go to Glinda.'),
      ],
      [
        ask(
          4,
          SS,
          'south is a direction',
          'D2.Geo.2.K-2',
          [N('Glinda lives south. Which is the opposite of north: south, or sandwich?')],
          [
            o('South', [N('Yes! South is the opposite of north.')], true),
            o('Sandwich', [N('Ha! A sandwich is yummy. But south is the opposite of north.')]),
          ],
          'Learned that south is the opposite of north.',
        ),
      ],
      {
        choices: [
          ch('come', 'Say you will go with her.', [
            D('Will you? I could not start again alone.', 'soft'),
          ]),
          ch('look', 'Look round at the others.', [
            N('Nobody needs asking. The Lion is already standing.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-16-south-done',
      [
        L('I will come. Then I will find a forest to live in.'),
        SC('I will come as far as Glinda’s.', 'happy'),
        TW('My heart will not let me stay behind.', 'soft'),
      ],
      [
        ask(
          2,
          M,
          'take away 2 from 3',
          'K.OA.A.2',
          [N('The Cap has three calls. Two calls are used. How many are left?')],
          [
            o('One', [N('Yes! Three take away two leaves one.')], true),
            o('Two', [N('Count again: three calls, take away two. One is left.')]),
          ],
          'Subtracted within 10: three take away two.',
        ),
      ],
    ),
    sc(
      'a15-16-complete',
      [
        N('In the morning, the Guardian unlocks the spectacles.'),
        G('Keep that pair. Some people get used to them.', 'think'),
        N('Without the glasses, the city is plain stone.'),
        N('There is a little green paint here and there.'),
        N('Your Nubbin keeps its own pair on.'),
      ],
      [
        doit(
          3,
          A,
          'sorting by colour',
          APP,
          'edu:sort:colours:green-grey',
          [
            N('The city looks grey stone with a little green paint.'),
            N('(Tap something grey. Then tap something green.)'),
          ],
          'Sorted things by colour: grey and green.',
        ),
      ],
    ),
  ],
);

// ================================================================== A15-17 The Fighting Trees and the China Country
const Q17: EduQuest = quest(
  'a15-17',
  'The Fighting Trees and the China Country',
  {
    'a15-17-s1': {
      goal: 'Get through the forest of grabbing trees.',
      hint: 'Keep behind the Woodman. When a branch grabs, let him help.',
    },
    'a15-17-s2': {
      goal: 'Climb the white wall and help the cross milkmaid.',
      hint: 'Climb the ladder the Woodman makes. Go down carefully.',
    },
    'a15-17-s3': {
      goal: 'Meet the china Princess and decide about the lamb.',
      hint: 'Stand still and speak softly. Then choose.',
    },
  },
  [
    sc(
      'a15-17-trees',
      [
        N('South of the city, the land is rough.'),
        N('You come to a thick wood. There is no way round.'),
        N('The Scarecrow goes in first. Whoosh! Branches fling him back.'),
        SC('Well! How rude. I will try another tree.', 'shock'),
        TW('Let me go first.'),
        N('The Woodman holds a big branch back. The tree shakes crossly and lets him by.'),
        L('Only the first row grabs. They guard the wood.'),
      ],
      [
        ask(
          2,
          S,
          'parts of a tree',
          SCI,
          [N('Look at the tree. Which part grows under the ground: the roots, or the leaves?')],
          [
            o('The roots', [N('Yes! Roots hold the tree in the ground and drink water.')], true),
            o('The leaves', [N('Leaves are on the branches. Roots grow under the ground.')]),
          ],
          'Named a tree part: roots grow under the ground.',
        ),
      ],
      {
        choices: [
          ch('behind', 'Keep right behind the Woodman.', [
            N('A branch reaches for you, finds his axe, and thinks again.'),
          ]),
          ch('coat', 'Tuck your Nubbin inside your coat.', [
            N('A branch pats you all over, finds nothing, and gives up.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-17-trees-done',
      [
        N('Behind the first row, the trees are only trees.'),
        N('Everyone gets through. The Scarecrow is last, very ruffled.'),
        N('Tree rhymes with bee.'),
      ],
      [
        ask(
          2,
          LIT,
          'rhyming words',
          LITS,
          [N('Tree rhymes with a word. Which one: bee, or dog?')],
          [
            o('Bee', [N('Yes! Tree and bee end with the same sound.')], true),
            o('Dog', [N('Dog does not sound like tree. Bee does!')]),
          ],
          'Found a rhyming word for tree.',
        ),
      ],
    ),
    sc(
      'a15-17-wall',
      [
        N('A high white wall stands beyond the wood. It is smooth like a plate.'),
        N('The Woodman makes a ladder. You all climb up and over.'),
        N('The other side is a land of china. The houses and people are china.'),
        N('A china milkmaid milks a china cow.'),
        N('You jump down. The cow kicks! Over goes the stool.'),
        N('The cow’s leg snaps off.'),
        MM('Look what you have done! Her leg is off!', 'angry'),
        D('I am very sorry. Please forgive us.', 'sad'),
      ],
      [
        ask(
          5,
          M,
          'take away 1 from 4',
          'K.OA.A.2',
          [N('A cow has four legs. One leg broke off. How many legs are left?')],
          [
            o('Three', [N('Yes! Four take away one leaves three.')], true),
            o('Two', [N('Count: one, two, three. Three legs are left.')]),
            o('Four', [N('One broke off. So there are three left.')]),
          ],
          'Subtracted within 10: four take away one.',
        ),
      ],
      {
        choices: [
          ch('leg', 'Pick up the cow’s leg and hand it back.', [
            MM('Well. Thank you. You might have broken it worse.', 'think'),
          ]),
          ch('small', 'Say sorry too, as small as you can.', [
            N('You crouch down small and say sorry. The milkmaid sniffs.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-17-wall-done',
      [
        N('The milkmaid leads her cow away on three legs.'),
        D('We must walk carefully. Everything here breaks.', 'think'),
        N('Pretty plates and cups are called china.'),
      ],
      [
        notice(
          2,
          SS,
          'china and where the name comes from',
          'D2.His.2.K-2',
          [
            N('Long ago, people in China made very fine plates and cups from baked clay.'),
            N('Now those pretty plates and cups are called china.'),
          ],
          'Learned that china dishes are named after the people in China who made them first.',
        ),
      ],
    ),
    sc(
      'a15-17-lamb',
      [
        N('You meet a china Princess in a dress of many colours.'),
        PR('Oh! Do not run at me. If I fall, I might break.', 'shock'),
        D('Would you come home with me?'),
        PR('Here we walk and talk and do as we like.'),
        PR('Out there we would go stiff and still, like a jug on a shelf.', 'sad'),
        N('Beside the path is a china field, with tiny china lambs.'),
        N('One comes to the fence. Your Nubbin touches noses with it.'),
        N('Your Nubbin looks at your pocket. It wants the lamb so much.'),
      ],
      [
        ask(
          7,
          E,
          'where someone is happiest',
          RESP,
          [N('Where is the lamb happiest: in its own field, or in a pocket?')],
          [
            o('In its own field', [N('Yes. Home is where a lamb can run and play.')], true),
            o('In a pocket', [
              N('A pocket is cosy. But the lamb is happier free in its own field.'),
            ]),
          ],
          'Talked about what a living thing needs to be happy, not just safe.',
        ),
      ],
      {
        choices: [
          ch(
            'pocket',
            'Slip the lamb into your pocket, to keep it safe.',
            [
              N('You lift the lamb over the fence. It is warm and light.'),
              N('You tuck it in your pocket. Your Nubbin keeps a paw on it.'),
            ],
            { 'a15-lamb': 'pocketed' },
          ),
          ch(
            'field',
            'Put it back in its field.',
            [
              N('You gently lead your Nubbin away. The lamb bleats once, tiny.'),
              N('Your Nubbin looks back three times. Then it walks close to you.'),
            ],
            { 'a15-lamb': 'returned' },
          ),
        ],
      },
    ),
    sc(
      'a15-17-complete',
      [
        N('The Lion’s tail swings and knocks over a little china church.'),
        L('Oh dear! I will tiptoe from now on.', 'shock'),
        N('China people come with glue pots. They are used to mending.'),
        N('You climb the far wall and drop into soft grass.'),
        D('I am glad we saw it. I will never forget it.', 'soft'),
      ],
      [
        ask(
          0,
          A,
          'continuing a pattern',
          MATH,
          [N('A china plate has a pattern: blue, white, blue, white. What comes next?')],
          [
            o('Blue', [N('Yes! Blue, white, blue, white, blue. The pattern repeats.')], true),
            o('White', [N('White came last. Next comes blue.')]),
          ],
          'Continued a repeating AB colour pattern.',
        ),
      ],
    ),
  ],
);

// ================================================================== A15-18 The King of Beasts
const Q18: EduQuest = quest(
  'a15-18',
  'The King of Beasts',
  {
    'a15-18-s1': {
      goal: 'Go with the Lion into the great old forest.',
      hint: 'Walk among the old trees until you find the gathering of animals.',
    },
    'a15-18-s2': {
      goal: 'Wait at the edge of the clearing while the Lion goes alone.',
      hint: 'Stay with Dorothy at the edge and keep your Nubbin close.',
    },
  },
  [
    sc(
      'a15-18-council',
      [
        N('Past the tall grass is a forest of great old trees.'),
        L('What a forest. I could live here for ever.', 'soft'),
        N('In a clearing, hundreds of animals are talking at once.'),
        N('A great tiger comes up and bows to the Lion.'),
        TG('King of Beasts! We need you.', 'happy'),
        TG('A giant spider chases and frightens us.', 'sad'),
        N('Your Nubbin presses against your legs again.'),
      ],
      [
        doit(
          5,
          S,
          'spiders have eight legs',
          SCI,
          'edu:count:spider-legs:8',
          [
            N('A spider has eight legs. Count them on your fingers.'),
            N('(One, two, three, four, five, six, seven, eight!)'),
          ],
          'Learned that spiders have eight legs and counted them.',
        ),
      ],
      {
        choices: [
          ch('lion', 'Look at the Lion.', [
            N('His mane is up. You cannot tell if it is courage or worry.'),
          ]),
          ch('pick', 'Pick up your Nubbin.', [N('Its heart goes fast. So does yours.')]),
        ],
      },
    ),
    sc(
      'a15-18-council-done',
      [
        L('If I deal with this spider, will you have me for your King?', 'think'),
        TG('Gladly. All of us.'),
        L('Then wait here.'),
      ],
      [
        ask(
          1,
          SS,
          'a fair leader',
          'D2.Civ.8.K-2',
          [
            N(
              'The animals want a King. What makes a good leader: kind and fair, or loud and bossy?',
            ),
          ],
          [
            o('Kind and fair', [N('Yes! A good leader is kind and fair to everyone.')], true),
            o('Loud and bossy', [N('Bossy leaders make others unhappy. Kind and fair is best.')]),
          ],
          'Talked about what makes a fair leader.',
        ),
      ],
    ),
    sc(
      'a15-18-wait',
      [
        L('Look after my friends. I will go before I think about it.', 'think'),
        N('He goes into the trees alone.'),
        N('Your Nubbin starts after him. Then it comes back and sits down.'),
        D('He was so scared of the ditch. And now this.', 'sad'),
        TW('I think courage was inside him all the time.', 'soft'),
        N('You wait. The forest is very quiet.'),
      ],
      [
        ask(
          5,
          E,
          'what helps when you wait and worry',
          CASEL_SM,
          [N('You are waiting for a friend and feeling worried. What helps?')],
          [
            o('Sit together', [N('Yes! Sitting with a friend makes waiting easier.')], true),
            o('Slow breaths', [N('Yes! Slow breaths help worries get smaller.')], true),
            o('Run off', [N('Staying together is better. Sit and breathe slowly.')]),
          ],
          'Talked about what helps when you are waiting and worried.',
        ),
      ],
      {
        choices: [
          ch('sit', 'Sit down and wait, with your Nubbin in your lap.', [
            N('Your Nubbin climbs onto your lap. You wait the way you wait for anyone.'),
          ]),
          ch('stand', 'Stand at the edge and watch the trees.', [
            N('Once, far off, there is a sound. Then nothing.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-18-wait-done',
      [
        N('At last, the sky turns grey. Morning comes.'),
        N('The Lion walks back, slowly and very straight.'),
        L('It is done. The spider will not trouble anyone again.'),
        N('He does not say how. Nobody asks.'),
      ],
      [
        doit(
          0,
          M,
          'count to 10',
          'K.CC.A.1',
          'edu:count:aloud:10',
          [
            N('Count slowly to ten, as if you were waiting for the morning.'),
            N('(One, two, three, four, five, six, seven, eight, nine, ten!)'),
          ],
          'Counted aloud from one to ten.',
        ),
      ],
    ),
    sc(
      'a15-18-complete',
      [
        N('All the animals bow to the Lion as their King.'),
        L('I will come back after Dorothy is safe at home.'),
        TG('We will wait, Your Majesty.'),
        L('I was scared the whole time. My knees knocked.', 'soft'),
        Y('I know. You went anyway.'),
        N('Your Nubbin pats his nose, very gently.'),
      ],
      [
        ask(
          2,
          LIT,
          'rhyming words',
          LITS,
          [N('King rhymes with a word. Which one: ring, or box?')],
          [
            o('Ring', [N('Yes! King and ring sound the same at the end.')], true),
            o('Box', [N('Box does not sound like king. Ring does!')]),
          ],
          'Found a rhyming word for king.',
        ),
      ],
    ),
  ],
);

// ================================================================== A15-19 The Hammer-Heads
const Q19: EduQuest = quest(
  'a15-19',
  'The Hammer-Heads',
  {
    'a15-19-s1': {
      goal: 'Climb the rocky hill towards the south.',
      hint: 'Follow the Scarecrow up the rocks. Stop when a voice tells you to.',
    },
    'a15-19-s2': {
      goal: 'Read the charm with Dorothy for her third and last call.',
      hint: 'Stand by Dorothy and read the words inside the Cap with her.',
    },
  },
  [
    sc(
      'a15-19-hill',
      [
        N('A steep hill rises. It is covered in big rocks.'),
        SC('Rocks. Up we go.'),
        HH('Stop! Our hill! Nobody goes over our hill!', 'angry'),
        N('Some funny little people pop up from behind the rocks.'),
        N('Their heads shoot out on stretchy necks. Bonk!'),
        N('The Scarecrow tumbles all the way down the hill.'),
        N('A hundred more pop up, laughing.'),
      ],
      [
        doit(
          1,
          S,
          'hard and soft',
          '2-PS1-1',
          'edu:sort:hard-soft:rocks',
          [
            N('Rocks are hard. Straw is soft.'),
            N('(Find one hard thing and one soft thing near you. Touch each one!)'),
          ],
          'Sorted things by how they feel: hard and soft.',
        ),
      ],
      {
        choices: [
          ch('pick', 'Run down and pick up the Scarecrow.', [
            N('He is upside down in a bush.'),
            SC('I did not see that coming.', 'shock'),
          ]),
          ch('duck', 'Duck behind a rock with your Nubbin.', [
            N('A head on a long neck looks at your Nubbin, then goes away.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-19-hill-done',
      [
        N('The Lion roars and runs up the hill.'),
        N('A head shoots out. Down he rolls, bump, bump, bump.'),
        L('Ow. Courage does not help your nose.', 'sad'),
      ],
      [
        notice(
          2,
          H,
          'what to do after a bump',
          PHYS,
          [
            L('When you get a bump, sit and rest for a bit.', 'soft'),
            L('A cool, damp cloth helps. Always tell a grown-up if you are hurt.'),
          ],
          'Learned what to do after a bump: rest, a cool cloth, and tell a grown-up.',
        ),
      ],
    ),
    sc(
      'a15-19-call',
      [
        D('It is no use fighting. What shall we do?'),
        TW('Call the Winged Monkeys. You have one call left.', 'think'),
        D('It is the last call.', 'sad'),
        N('Dorothy puts on the Golden Cap and says the words.'),
        N('You read them with her, very clearly.'),
        MO('Third call. The last. What is it to be?', 'think'),
        D('Carry us over the hill to the Quadlings.'),
      ],
      [
        doit(
          4,
          MU,
          'clapping the beat of words',
          APP,
          'edu:clap:beat:golden-cap',
          [
            N('Clap the parts of Gol-den Cap. Three claps!'),
            N('(Say it a few times, steady, and clap each part.)'),
          ],
          'Clapped the beat of a phrase, one clap for each part.',
        ),
      ],
      {
        choices: [
          ch('thank', 'Thank the Monkey King.', [MO('Thank us? Nobody does that.', 'think')]),
          ch('watch', 'Watch the Monkey King as he lifts you.', [
            N('His wings beat slow and hard. He looks tired.'),
          ]),
        ],
      },
    ),
    sc(
      'a15-19-call-done',
      [
        N('The Monkeys carry you over the hill.'),
        N('The Hammer-Heads shoot their heads up high. They cannot reach.'),
        N('Your Nubbin looks down at them. They look up at your Nubbin.'),
      ],
      [
        ask(
          2,
          E,
          'being kind to someone tired',
          CASEL_SO,
          [N('The Monkey King looks tired. What can we do for someone tired?')],
          [
            o(
              'Say thank you and let them rest',
              [N('Yes! A thank you and a rest are kind.')],
              true,
            ),
            o('Ask for more', [
              N('Asking for more tires them more. A thank you and rest is kind.'),
            ]),
          ],
          'Talked about being kind to someone who is tired.',
        ),
      ],
    ),
    sc(
      'a15-19-complete',
      [
        N('The Monkeys put you down in the Quadlings’ land.'),
        N('The King looks back once from the sky.'),
        N('Everything here is red: fences, houses, bridges.'),
        D('Which way is Glinda’s castle?'),
        N('A Quadling points. Far away, a castle shines.'),
      ],
      [
        ask(
          2,
          SS,
          'matching colours to places',
          'D2.Geo.2.K-2',
          [N('Which land is red: the Quadlings’ land, or the Munchkins’ land?')],
          [
            o(
              'The Quadlings’',
              [N('Yes! The Quadlings’ land is red. The Munchkins’ land is blue.')],
              true,
            ),
            o('The Munchkins’', [N('The Munchkins’ land is blue. The Quadlings’ land is red.')]),
          ],
          'Matched the colours of the lands of Oz with their people.',
        ),
      ],
    ),
  ],
);

// ================================================================== A15-20 Glinda
const Q20: EduQuest = quest(
  'a15-20',
  'Glinda',
  {
    'a15-20-s1': {
      goal: 'Go before Glinda, the Good Witch of the South.',
      hint: 'Walk up to her throne with Dorothy and the others. Listen.',
    },
    'a15-20-s2': {
      goal: 'Hear where each friend will go, and say your goodbyes.',
      hint: 'Stand with your friends while Glinda tells each where to go.',
    },
    'a15-20-s3': {
      goal: 'Say goodbye to Dorothy.',
      hint: 'Stay with Dorothy and Toto until she is ready to go.',
    },
  },
  [
    sc(
      'a15-20-glinda',
      [
        N('Three girls in red lead you into a great room.'),
        N('Glinda sits on a red throne. Her eyes are blue and kind.'),
        GL('What do you need, my dear?', 'soft'),
        D('I want to go home to Aunt Em.', 'sad'),
        GL('The silver shoes will carry you over the desert.', 'soft'),
        GL('They could have taken you home on the very first day.'),
        SC('Then I would never have got my brains!', 'shock'),
        TW('And I would still be stuck in the forest.'),
        N('Dorothy looks down at the shoes for a long time.'),
      ],
      [
        ask(
          8,
          E,
          'good things on a long journey',
          CASEL_RS,
          [N('The walk was long. What good thing did Dorothy get from it?')],
          [
            o(
              'New friends',
              [N('Yes! She made friends who helped her, and she helped them.')],
              true,
            ),
            o('Nothing', [N('She got friends! That is a lot.')]),
          ],
          'Named a good thing that came from a long journey: friends.',
        ),
      ],
      {
        choices: [
          ch('shoes', 'Look at the shoes.', [
            N('They are dusty and scuffed. They do not look like much.'),
          ]),
          ch('mind', 'Ask Dorothy if she minds.', [D('No. I am glad I did not know.', 'soft')]),
        ],
      },
    ),
    sc(
      'a15-20-glinda-done',
      [
        GL('Knock your heels together three times.'),
        GL('Say where you want to go. The shoes will take you.'),
        N('Knock, knock, knock.'),
      ],
      [
        doit(
          1,
          M,
          'count to 3',
          'K.CC.B.5',
          'edu:count:knocks:3',
          [
            N('Knock your heels together, or tap your hands. Count three knocks.'),
            N('(One knock, two knocks, three knocks!)'),
          ],
          'Counted three knocks.',
        ),
      ],
    ),
    sc(
      'a15-20-goodbye',
      [
        GL('Scarecrow: the Monkeys will take you to the Emerald City, to rule.'),
        SC('Thank you. I have thought of eleven new rules.', 'happy'),
        GL('Woodman: they will take you to the Winkies, who want you to rule.'),
        TW('I will rule kindly. I have the heart for it.', 'soft'),
        GL('Lion: they will take you to your forest.'),
        L('Thank you. I would not like to meet the Hammer-Heads again.'),
        N('Dorothy hugs each friend, and cries, and kisses the Lion’s nose.'),
      ],
      [
        ask(
          1,
          SS,
          'fair rules',
          'D2.Civ.8.K-2',
          [
            N(
              'The Scarecrow will make rules. What makes a rule fair: everyone gets a turn, or only me?',
            ),
          ],
          [
            o('Everyone gets a turn', [N('Yes! A fair rule is fair to everyone.')], true),
            o('Only me', [N('That is not fair to others. Fair means everyone gets a turn.')]),
          ],
          'Talked about what makes a rule fair.',
        ),
      ],
      {
        choices: [
          ch('oil', 'Oil the Woodman’s jaw. He is crying.', [
            TW('Keep the can. You are the best oil-can-carrier in Oz.', 'soft'),
          ]),
          ch('scarecrow', 'Shake the Scarecrow’s hand.', [
            SC('If you need a thought, come to me. I can spare one.', 'happy'),
          ]),
          ch('lion', 'Rest your hand on the Lion’s mane.', [
            L('Goodbye, Keeper. Goodbye, little one. You sat by me first.', 'soft'),
          ]),
        ],
      },
    ),
    sc(
      'a15-20-goodbye-done',
      [
        N('Glinda’s girls give you a pair of silver shoes.'),
        N('You knock your heels together three times.'),
        N('Nothing happens at all.'),
        GL('They are only shoes, dear. Most shoes are.', 'happy'),
      ],
      [
        doit(
          3,
          LIT,
          'first sound of a name',
          LITS,
          'edu:say:first-sound:g',
          [
            N('Glinda starts with the sound g. Say it: g, g, Glinda!'),
            N('(Can you think of another g word? Grass, goat, green!)'),
          ],
          'Heard and said the first sound of Glinda.',
        ),
      ],
    ),
    sc(
      'a15-20-farewell',
      [
        N('Dorothy turns to you last. Toto is in her arms.'),
        N('Your Nubbin is sitting on your feet.'),
        N('Glinda’s girls go quiet. Even Toto keeps still.'),
        ...FAREWELL,
      ],
      [
        ask(
          4,
          E,
          'saying goodbye',
          CASEL_SA,
          [N('Goodbyes can feel sad. What helps?')],
          [
            o('A hug and a thank you', [N('Yes! A hug and a thank you help.')], true),
            o('Remembering good times', [N('Yes! Remembering makes the sad feel softer.')], true),
          ],
          'Talked about what helps with a sad goodbye.',
        ),
      ],
      { choices: FAREWELL_CHOICES },
    ),
    sc(
      'a15-20-complete',
      [
        ...KANSAS,
        N('The Monkeys carry the Scarecrow north, the Woodman west, the Lion home.'),
        N('Glinda gives the Golden Cap to the Monkey King. They are free.'),
        N('The page shows the china wall. A lamb waits to see you off.', 'soft'),
        ...CLOSE,
      ],
      [
        ask(
          3,
          LIT,
          'where a story starts and ends',
          LITS,
          [N('Dorothy’s story started in a place. She ended up there too. Where?')],
          [
            o('Kansas', [N('Yes! Dorothy’s story started and ended in Kansas.')], true),
            o('The moon', [N('Not the moon! Dorothy started and ended in Kansas.')]),
          ],
          'Retold where a story began and ended.',
        ),
      ],
    ),
  ],
);

// ================================================================== variants
/** Sprout versions of every scene in ATLAS_A15_VARIANTS. */
const HUMBUG_ASK = (after: number): Beat =>
  ask(
    after,
    LIT,
    'the word humbug',
    LANG,
    [N('A humbug is someone who pretends. Who pretended: Oz, or the Lion?')],
    [
      o('Oz', [N('Yes! Oz pretended to be a great Wizard. That is a humbug.')], true),
      o('The Lion', [N('The Lion was real. Oz was the one pretending.')]),
    ],
    'Learned the word humbug: someone who pretends.',
  );
const GONE_ASK = (after: number): Beat =>
  ask(
    after,
    E,
    'comforting a sad friend',
    CASEL_SO,
    [N('Dorothy is sad. What helps a sad friend?')],
    [
      o('A hug', [N('Yes! A hug and a kind word help a sad friend.')], true),
      o('Walk away', [N('A friend who stays close helps most. Try a hug.')]),
    ],
    'Talked about how to comfort a sad friend.',
  );

export const EDU_A15_SPROUT_VARIANTS: EduScene[] = [
  sc(
    'a15-14-screen-done-reconciled',
    [
      ...POOR_WIZARD,
      N('You think of a lonely man you know.'),
      N('He said sorry, and gave back what was not his.', 'soft'),
    ],
    [HUMBUG_ASK(3)],
  ),
  sc(
    'a15-14-screen-done-bargained',
    [
      ...POOR_WIZARD,
      N('You think of a lonely man you know.'),
      N('He swapped his trick for other things. That did not make it right.'),
    ],
    [HUMBUG_ASK(3)],
  ),
  sc(
    'a15-14-screen-done-forced',
    [
      ...POOR_WIZARD,
      N('You think of a lonely man you know.'),
      N('He only stopped when he fell, with a big bump.', 'sad'),
    ],
    [HUMBUG_ASK(3)],
  ),
  sc(
    'a15-16-launch-done-reconciled',
    [
      ...BALLOON_GONE,
      N('Your Nubbin watches it go. Then it looks back at you.'),
      N('Some people come back, you think.', 'soft'),
    ],
    [GONE_ASK(2)],
  ),
  sc(
    'a15-20-farewell-pocketed',
    [
      N('You take the china lamb out of your pocket, to show Glinda.'),
      N('It is stiff and still now. It cannot run.', 'sad'),
      N('Your Nubbin nuzzles it. Nothing happens.'),
      GL('You wanted to keep it safe. That is a loving wish.', 'soft'),
      GL('Carry it home, over its own wall, and it will wake.'),
      L('My forest lies that way. If nobody else can, I will walk you there.'),
      ...FAREWELL,
    ],
    [
      ask(
        5,
        E,
        'what a living thing needs',
        RESP,
        [N('The lamb is happiest running in its field. How can we help it?')],
        [
          o('Take it back to its field', [GL('Yes. Home is where a lamb can run and play.')], true),
          o('Keep it in the pocket', [GL('It is cosy, but a lamb needs to run. Take it home.')]),
        ],
        'Talked about taking a living thing back to where it is happy.',
      ),
    ],
    { choices: FAREWELL_CHOICES },
  ),
  sc(
    'a15-20-complete-asked',
    [
      ...KANSAS,
      N('The Monkeys carry your friends away. Glinda gives the Cap to the King.'),
      MO('You asked what we would do if we were free.', 'think'),
      MO('Play.', 'happy'),
      N('The Monkeys loop over the castle, shrieking. A feather floats down onto your Nubbin.'),
      N('The page shows the china wall. A lamb waits to see you off.', 'soft'),
      ...CLOSE,
    ],
    [
      ask(
        6,
        LIT,
        'listening to what a character says',
        LANG,
        [N('What does the Monkey King want to do now he is free?')],
        [
          o('Play', [N('Yes! He wants to play. Free monkeys can play all day.')], true),
          o('Sleep', [N('He said play! The Monkeys loop and shriek with joy.')]),
        ],
        'Listened for a character’s answer: the Monkeys want to play.',
      ),
    ],
  ),
  sc(
    'a15-20-complete-asked-pocketed',
    [
      ...KANSAS,
      N('The Monkeys carry your friends away. Glinda gives the Cap to the King.'),
      MO('You asked what we would do if free. Play!', 'happy'),
      MO('But first, a favour. We will fly you north, to the china wall.'),
      N('They loop once, shrieking. A feather lands on your Nubbin.'),
      ...LAMB_WAKES,
      ...CLOSE,
    ],
    [
      ask(
        6,
        LIT,
        'listening to what a character says',
        LANG,
        [N('Where do the Monkeys fly you, to take the lamb home?')],
        [
          o('To the china wall', [N('Yes! They fly you to the china wall.')], true),
          o('To the sea', [N('Not the sea. The china wall, to take the lamb home.')]),
        ],
        'Followed where the story takes the characters.',
      ),
    ],
  ),
  sc(
    'a15-20-complete-pocketed',
    [
      ...KANSAS,
      N('The Monkeys take the Scarecrow and the Woodman. The Lion stays.'),
      L('I will walk you there. My forest and the china wall lie north.', 'soft'),
      N('Glinda gives the Cap to the Monkey King. They fly off free.'),
      ...LAMB_WAKES,
      ...CLOSE,
    ],
    [
      ask(
        5,
        LIT,
        'listening to what a character says',
        LANG,
        [N('Who walks you to the china wall?')],
        [
          o('The Lion', [N('Yes! The Lion walks you there.')], true),
          o('The Scarecrow', [N('The Scarecrow flew with the Monkeys. The Lion walks you.')]),
        ],
        'Followed who does what in the story.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A15_SPROUT: EduQuest[] = [
  Q1,
  Q2,
  Q3,
  Q4,
  Q5,
  Q6,
  Q7,
  Q8,
  Q9,
  Q10,
  Q11,
  Q12,
  Q13,
  Q14,
  Q15,
  Q16,
  Q17,
  Q18,
  Q19,
  Q20,
];

/** Every `edu:` check string used by the lessons above. */
export const CHECKS: string[] = [
  'edu:breathe:slow:3',
  'edu:chant:heave-ho:beat',
  'edu:clap:beat:bells',
  'edu:clap:beat:golden-cap',
  'edu:clap:syllables:balloon',
  'edu:clap:syllables:dorothy',
  'edu:clap:syllables:spectacles',
  'edu:count:aloud:10',
  'edu:count:beetle-legs:6',
  'edu:count:crossers:7',
  'edu:count:days:4',
  'edu:count:down:3',
  'edu:count:eyes:5',
  'edu:count:falls:3',
  'edu:count:friends:3',
  'edu:count:knocks:3',
  'edu:count:logs:5',
  'edu:count:mice:10',
  'edu:count:pennies:3',
  'edu:count:scoops:3',
  'edu:count:spider-legs:8',
  'edu:count:strips:5',
  'edu:count:tables:5',
  'edu:count:travellers:4',
  'edu:count:travellers:7',
  'edu:count:waves:4',
  'edu:draw:circle:green',
  'edu:draw:face:smile',
  'edu:feel:heartbeat',
  'edu:follow:steps:left-right',
  'edu:say:first-sound:e',
  'edu:say:first-sound:g',
  'edu:say:first-sound:l',
  'edu:say:first-sound:t',
  'edu:say:sound-words:rumble',
  'edu:sing:quiet-loud',
  'edu:sort:colours:green-grey',
  'edu:sort:colours:yellow',
  'edu:sort:hard-soft:rocks',
  'edu:stand:one-foot:balance',
  'edu:stretch:arms:up',
  'edu:tap:colour:blue',
];
