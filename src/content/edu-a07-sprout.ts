/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Atlas A7, The Marigold Bridge.
 *
 * Source: atlas-a07.ts (ATLAS_A07 and ATLAS_A07_VARIANTS). One EduScene per original scene, id
 * `sprout:<original id>`: every step scene, every done scene, every complete scene and all 8
 * variants. Every choice keeps its original id and `set`, so a7-name and a7-plea still work; no
 * choice in A7 is cruel, so none is dropped and no `defaultChoice` is needed. See EDU-STYLE.md.
 *
 * Learning angles (from the outline): Día de Muertos traditions (the ofrenda, cempasúchil
 * marigolds, pan de muerto, papel picado, calavera face paint, remembering together), Oaxacan and
 * Mexican alebrijes, and Spanish family words (mamá, papá, abuelita, tía, tío, hola, gracias).
 *
 * Care notes kept: Día de Muertos is presented as a living tradition, joyful and homely, never
 * “Mexican Halloween”. Skeletons are bright and friendly. Mamá Coco’s forgetting is shown with
 * dignity. Hard things follow EDU-STYLE.md: Chicharrón fades (said plainly: he is gone for good),
 * Héctor died long ago and never got home (said once, no detail, with comfort), and Mamá Coco has
 * died in the epilogue (said plainly, with comfort straight after). Ernesto’s part is “an unkind
 * trick”; nothing is shown. The fall into the cenote is a splash and a glow, never a peril.
 * Nothing is quoted from the film and no song is given.
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
const M = say('a7-miguel');
const H = say('a7-hector');
const I = say('a7-imelda');
const AB = say('a7-abuelita');
const CO = say('a7-coco');
const ER = say('a7-ernesto');
const RO = say('a7-rosita');
const JU = say('a7-julio');
const TW = say('a7-twins');
const OF = say('a7-officer');
const CL = say('a7-clerk');
const CH = say('a7-chicharron');
const EM = say('a7-emcee');
const PA = say('a7-painter');
const EN = say('a7-enrique');

// ---------------------------------------------------------------- builders
type LessonIn = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

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
): LessonIn => ({
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
): LessonIn => ({
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
): LessonIn => ({
  domain,
  skill,
  ...(standard ? { standard } : {}),
  kind: 'do',
  after,
  check,
  lines,
  parentNote,
});

/** One choice, keeping the original id and `set`. */
const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice => ({
  id,
  label,
  ...(set ? { set } : {}),
  then,
});

/** One sprout scene. Lesson ids are `sprout:<of>-l<n>`, numbered in play order. */
const sc = (of: string, lines: Line[], beats: LessonIn[], choices?: Choice[]): EduScene => {
  const s: EduScene = {
    id: `sprout:${of}`,
    of,
    band: 'sprout',
    lines,
    lessons: [...beats]
      .sort((a, b) => a.after - b.after)
      .map((b, i) => ({ id: `sprout:${of}-l${i + 1}`, ...b })),
  };
  if (choices) s.choices = choices;
  return s;
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

const ELOF_SE = 'ELOF: Social and Emotional Development';
const ELOF_LIT = 'ELOF: Literacy';
const ELOF_LANG = 'ELOF: Language and Communication';
const ELOF_MATH = 'ELOF: Mathematics Development';
const ELOF_SCI = 'ELOF: Scientific Reasoning';
const ELOF_MOTOR = 'ELOF: Perceptual, Motor, and Physical Development';

// ================================================================== A7-1 The Ofrenda
const Q01: EduQuest = quest(
  'a7-01',
  'The Ofrenda',
  {
    'a7-01-s1': {
      goal: 'Step into the marigold page. Find the town square.',
      hint: 'Touch the page. Follow the paper flags down to the square.',
    },
    'a7-01-s2': {
      goal: 'Help carry the marigolds into the house.',
      hint: 'Take the flowers from the cart. Bring them to Abuelita.',
    },
    'a7-01-s3': {
      goal: 'Look at the family ofrenda. Meet Mamá Coco.',
      hint: 'Go to the altar at the end of the room. Look at the photos.',
    },
  },
  [
    sc(
      'a7-01-plaza',
      [
        N('Nova’s atlas opens at a page of orange flowers and paper flags.'),
        N('Whoosh! You and your Nubbin are in a town in Mexico.'),
        N('Everyone carries marigolds. They are bright orange!'),
        N('A boy is shining shoes. He sees your Nubbin.'),
        M('Wow! Are you here for Día de Muertos?'),
        N('That is a festival. Families remember people who have died.'),
      ],
      [
        notice(
          1,
          'social-studies',
          'Mexico is a country, and many people there speak Spanish',
          'D2.Geo.2.K-2',
          [
            N('Mexico is a country. Many people there speak Spanish.'),
            N('(Find Mexico on a map or a globe, if you have one.)'),
          ],
          'Learned that Mexico is a country, and that many people there speak Spanish.',
        ),
        doIt(
          5,
          'literacy',
          'say “hola”, hello in Spanish',
          ELOF_LANG,
          'edu:say:word:hola',
          [M('Hola! That means hello in Spanish. Say it with me!'), N('(Wave and say “Hola!”)')],
          'Said hola, the Spanish word for hello.',
        ),
      ],
      [
        ch('visitor', 'Say you are visitors from far away.', [
          M('Then come and see our ofrenda! Abuelita’s is the best.'),
        ]),
        ch('statue', 'Ask who the man on the statue is.', [
          M('That is Ernesto de la Cruz. He was a famous singer!'),
        ]),
        ch('nubbin', 'Let your Nubbin say hello.', [
          N('Your Nubbin hops onto the shoe box. Miguel laughs and laughs.'),
        ]),
      ],
    ),
    sc(
      'a7-01-plaza-done',
      [
        M('I’m Miguel. Come on, I’ll show you my house.'),
        N('A thin, hairless dog trots along behind you. Pant, pant!'),
        M('That is Dante. He isn’t mine. He thinks he is!'),
      ],
      [
        ask(
          2,
          'science',
          'what a dog needs to live',
          'K-LS1-1',
          [N('Dante is a dog. What does a dog need to live?')],
          [
            opt(
              'Food, water and a cosy home',
              [M('Yes! Dante gets all three, and a lot of cuddles.')],
              true,
            ),
            opt('Only toys', [M('Toys are fun! But Dante needs food, water and a home first.')]),
            opt('Only sweets', [M('Dante would love that! But dogs need proper food and water.')]),
          ],
          'Talked about what a dog needs to live: food, water and a home.',
        ),
      ],
    ),
    sc(
      'a7-01-petals',
      [
        N('Miguel’s house is full of shoes. They make shoes here!'),
        AB('Visitors can carry. Take these flowers inside, please.'),
        N('Abuelita ties an orange ribbon round your Nubbin’s neck.'),
        AB('There. Now the dog won’t think it’s a toy.'),
        AB('These flowers are cempasúchil. Say it with me.'),
        AB('Sem-pa-SOO-cheel. Clap for every beat!'),
        N('They are bright, and they smell strong.'),
        N('That helps loved ones who have died find their way home.'),
        N('Your Nubbin carries one marigold, very proudly.'),
      ],
      [
        doIt(
          5,
          'literacy',
          'clap the four syllables of cempasúchil',
          'RF.K.2',
          'edu:clap:syllables:cempasuchil',
          [N('Cem. Pa. Sú. Chil. Four claps!'), N('(Clap with the beats. How many claps?)')],
          'Clapped the four syllables of the Spanish word for marigold.',
        ),
      ],
    ),
    sc(
      'a7-01-petals-done',
      [
        N('The basket is empty. Your arms smell of marigolds.'),
        AB('Now you can eat. Pan de muerto for everyone!'),
        N('It is a sweet, round bread, with strips on top like bones.'),
        N('Abuelita cuts a piece for you, one for Miguel and one for Nubbin.'),
      ],
      [
        ask(
          3,
          'maths',
          'count the pieces to answer “how many?”',
          'K.CC.B.5',
          [N('(Point to each piece in turn.) How many pieces did Abuelita cut?')],
          [
            opt('Three', [N('Yes! One, two, three. A piece each.')], true),
            opt('Two', [
              N('Let’s count again: one for you, one for Miguel, one for Nubbin. Three!'),
            ]),
            opt('Five', [N('Let’s count again: one, two, three. Three pieces.')]),
          ],
          'Counted three pieces of pan de muerto.',
        ),
      ],
    ),
    sc(
      'a7-01-photo',
      [
        N('The ofrenda is a family altar, with steps going up.'),
        N('It has candles, marigolds, bread, water and photos.'),
        N('Some photos are very old. One has a torn corner.'),
        N('A man with a guitar was in that photo. His face is gone.'),
        M('He went away to play music. He never came home.', 'sad'),
        M('Mamá Imelda was very sad. So now our house has no music.', 'sad'),
        N('An old, old lady sits by the ofrenda. This is Mamá Coco.'),
        CO('Who are you? Are you new?', 'think'),
      ],
      [
        notice(
          1,
          'social-studies',
          'an ofrenda is how a family remembers people they love',
          'D2.His.2.K-2',
          [
            N('An ofrenda is how a family remembers people who have died.'),
            N('They add photos, flowers, candles and favourite foods.'),
          ],
          'Learned what an ofrenda is, and how Mexican families use it to remember loved ones.',
        ),
      ],
      [
        ch('hand', 'Take her hand and say your name.', [
          CO('That’s a good name. I’ll try to keep it.', 'soft'),
        ]),
        ch('sit', 'Sit beside her. Say nothing.', [
          N('You sit, and watch the candles with her. She pats your knee.'),
        ]),
        ch('nubbin', 'Lift your Nubbin up so she can see.', [
          CO('Oh! You’re a funny one.', 'happy'),
        ]),
      ],
    ),
    sc(
      'a7-01-photo-done',
      [
        CO('Is Papá home? Is he coming home?', 'think'),
        M('Not today, Mamá Coco.', 'soft'),
        N('Miguel sounds sad. He has said it a hundred times.'),
      ],
      [
        ask(
          2,
          'literacy',
          'name the character in the story',
          'RL.K.3',
          [N('Mamá Coco asks about her papá. Who is she waiting for?')],
          [
            opt(
              'Her papá',
              [N('Yes. Papá is the Spanish word for dad. She misses him very much.')],
              true,
            ),
            opt('Dante the dog', [
              N('Dante is here already. She is waiting for her papá, her dad.'),
            ]),
            opt('Abuelita', [
              N('Abuelita is here too. Mamá Coco is waiting for her papá, her dad.'),
            ]),
          ],
          'Named the character in the story and learned papá, the Spanish word for dad.',
        ),
      ],
    ),
    sc(
      'a7-01-complete',
      [
        N('Supper is loud! Abuelita feeds everyone twice.'),
        N('Nobody hums, and nobody taps a spoon. The house is oddly quiet.'),
        M('After supper, I want to show you a secret.', 'think'),
        N('Your Nubbin’s ribbon flutters, bright as a marigold.'),
      ],
      [
        ask(
          2,
          'sel',
          'tell a trusted grown-up about a worry',
          ELOF_SE,
          [N('Miguel has a secret that makes him worry. Who could he tell?')],
          [
            opt(
              'A grown-up he trusts',
              [N('Yes. Telling a trusted grown-up shrinks a worry.')],
              true,
            ),
            opt('Nobody at all', [
              N('Worries get heavy when we carry them alone. A grown-up can help.'),
            ]),
            opt('Only the dog', [N('Dante is a good listener! A grown-up can help too.')]),
          ],
          'Talked about telling a trusted grown-up when a secret feels worrying.',
        ),
      ],
    ),
  ],
  'Every scene of A7-1 has a sprout version. All three choices in each choice scene are kept.',
);

// ================================================================== A7-2 The Ban
const Q02: EduQuest = quest(
  'a7-02',
  'The Ban',
  {
    'a7-02-s1': {
      goal: 'Follow Miguel up to his secret hideout.',
      hint: 'Climb the ladder. Squeeze behind the loose boards.',
    },
    'a7-02-s2': {
      goal: 'Walk with Miguel through the square.',
      hint: 'Stay close to Miguel. Watch out for Abuelita.',
    },
    'a7-02-s3': {
      goal: 'Go after Miguel. Sit down with him.',
      hint: 'Follow him out of the gate. When you find him, sit beside him.',
    },
  },
  [
    sc(
      'a7-02-hideout',
      [
        N('Up a ladder, behind a loose board, is a tiny secret room.'),
        N('There are posters, records and candles. And a guitar!'),
        M('I made it from a wooden box. Listen!'),
        N('He plucks a string. Twang!'),
        N('Your Nubbin sways. Dante thumps his tail.'),
        M('There is a talent show tonight. If I win, my family will see.'),
      ],
      [
        doIt(
          3,
          'science',
          'a shaking string makes sound',
          '1-PS4-1',
          'edu:pluck:rubber-band:feel',
          [
            N('Pluck a stretched rubber band. See it shake? Hear it hum?'),
            N('The shaking makes the sound. (Touch it, then it stops!)'),
          ],
          'Plucked a rubber band and found that shaking makes sound.',
        ),
      ],
      [
        ch('tell', 'Say, “You should tell them.”', [
          M('Tell them? You haven’t met Abuelita with a shoe!', 'shock'),
        ]),
        ch('play', 'Say, “Play it again!”', [
          N('He does, grinning. Your Nubbin claps, between the beats.'),
        ]),
        ch('why', 'Ask why there is no music.', [
          M('Because of the man in the photo. Nobody says the rest.', 'sad'),
        ]),
      ],
    ),
    sc(
      'a7-02-hideout-done',
      [
        M('Come on. I need to see the stage.'),
        N('You climb down the ladder, one rung at a time.'),
        N('Down, down, down. Now you are in the shoe shop.'),
      ],
      [
        ask(
          2,
          'maths',
          'above and below',
          'K.G.A.1',
          [N('Is the attic above the shop, or below it?')],
          [
            opt('Above', [N('Yes! Up the ladder is above.')], true),
            opt('Below', [N('Let’s look again. We climbed up the ladder, so the attic is above.')]),
          ],
          'Used the words above and below for positions.',
        ),
      ],
    ),
    sc(
      'a7-02-square',
      [
        N('In the square, a sign says, “Talent show tonight!”'),
        M('I just need a real guitar.'),
        AB('MIGUEL!', 'angry'),
        N('Abuelita is very cross. Her face is red.'),
        AB('Music! On Día de Muertos!', 'angry'),
        N('She marches Miguel home. You follow, quietly.'),
        N('At the ofrenda, Miguel sees the old photo. The guitar has a skull.'),
      ],
      [
        ask(
          4,
          'sel',
          'calming down when you feel cross',
          ELOF_SE,
          [N('Abuelita is cross. What helps when we feel cross?')],
          [
            opt(
              'Breathe in and out slowly',
              [N('Yes! In through your nose, out through your mouth. (Try it!)')],
              true,
            ),
            opt('Shout louder', [
              N('Shouting makes cross feelings bigger. A slow breath helps them shrink.'),
            ]),
            opt('Stamp and throw things', [
              N('Things can get broken that way. A slow breath is gentler.'),
            ]),
          ],
          'Practised slow breathing as a way to calm down when cross.',
        ),
      ],
    ),
    sc(
      'a7-02-square-done',
      [
        M('Look! It’s a guitar with a skull on its head!', 'shock'),
        N('The guitar has a big round hole in the middle.'),
        M('He’s my family. I’m meant to be a musician!', 'happy'),
      ],
      [
        ask(
          1,
          'maths',
          'name a circle',
          'K.G.A.2',
          [N('The hole in the guitar is round. What shape is it?')],
          [
            opt('A circle', [N('Yes! A circle. Round with no corners.')], true),
            opt('A square', [N('A square has four corners. This hole is round, a circle.')]),
            opt('A triangle', [N('A triangle has three corners. This hole is round, a circle.')]),
          ],
          'Named a circle.',
        ),
      ],
    ),
    sc(
      'a7-02-guitar',
      [
        M('I’m going to play in the talent show!'),
        EN('Mijo, no. Family comes first.', 'sad'),
        AB('No more guitar.', 'angry'),
        N('Abuelita takes the guitar. Crack! It breaks.'),
        N('Everyone is quiet. Abuelita looks sad too.'),
        M('I don’t want to be in this family!', 'angry'),
        N('Miguel runs out of the gate. Dante runs too.'),
        N('You find him on the church steps. Dante lies across his feet.'),
      ],
      [
        ask(
          7,
          'literacy',
          'name a feeling from what a character does',
          'RL.1.4',
          [N('Miguel hides his face in his knees. How does he feel?')],
          [
            opt('Sad', [N('Yes. Miguel is very sad. His guitar is broken.')], true),
            opt('Silly', [N('Silly is giggly. Miguel is hiding his face, so he is sad.')]),
            opt('Sleepy', [N('Sleepy is yawny. Miguel is hiding his face, so he is sad.')]),
          ],
          'Named a feeling, sadness, from what a character did.',
        ),
      ],
    ),
    sc(
      'a7-02-guitar-done',
      [
        N('You sit down next to Miguel. Your Nubbin leans on his arm.'),
        N('(Be very still. Count to ten, slowly.)'),
        M('Thanks.', 'soft'),
      ],
      [
        doIt(
          1,
          'sel',
          'waiting quietly with a friend',
          ELOF_SE,
          'edu:wait:beside:count-10',
          [N('Sit beside a grown-up. Count to ten, slowly, in your head.')],
          'Waited quietly beside a friend, counting slowly to ten.',
        ),
      ],
    ),
    sc(
      'a7-02-complete',
      [
        M('I still need a guitar for tonight.'),
        N('Beyond the church, the graveyard glows with candles.'),
        M('His guitar is in his tomb. He’d want me to play it.', 'think'),
        N('Dante sneezes. It sounds like an opinion.'),
      ],
      [
        ask(
          1,
          'science',
          'we see things when there is light',
          '1-PS4-2',
          [N('The candles glow in the dusk. Why do people use candles?')],
          [
            opt('To give light in the dark', [N('Yes! Light helps us see when it’s dark.')], true),
            opt('To make it noisy', [N('Candles are quiet! They give light so we can see.')]),
          ],
          'Talked about how a candle gives light in the dark.',
        ),
      ],
    ),
  ],
  'Every scene of A7-2 has a sprout version. The broken guitar is one quiet crack, with a sad Abuelita.',
);

// ================================================================== A7-3 The Guitar
const Q03: EduQuest = quest(
  'a7-03',
  'The Guitar',
  {
    'a7-03-s1': {
      goal: 'Walk through the graveyard with Miguel and Dante.',
      hint: 'Follow the candle path up the hill.',
    },
    'a7-03-s2': {
      goal: 'Hold the window steady while Miguel climbs in.',
      hint: 'Keep your hands on the window frame.',
    },
    'a7-03-s3': {
      goal: 'Find Miguel. Meet the visitors.',
      hint: 'Follow the glow down the hill.',
    },
  },
  [
    sc(
      'a7-03-cemetery',
      [
        N('The graveyard is busy at dusk. Every grave has a family round it.'),
        N('They scrub stones, light candles and set out suppers.'),
        N('An old man tells jokes to a grave. He laughs too.'),
        M('Families stay all night. They talk and remember.'),
        Y('It isn’t sad.'),
        M('A bit sad. Mostly a party. They’re visiting!'),
        N('At the top is a big tomb. A high window is open a crack.'),
      ],
      [
        notice(
          3,
          'social-studies',
          'some families in Mexico spend the night remembering together',
          'D2.His.2.K-2',
          [
            N('In Mexico, some families spend the night at the graves.'),
            N('They bring flowers and favourite foods, and share stories.'),
          ],
          'Learned that some families in Mexico remember loved ones together at Día de Muertos.',
        ),
      ],
    ),
    sc(
      'a7-03-cemetery-done',
      [
        M('Give me a boost. And hold the window!'),
        N('You make a step with your hands.'),
        N('Your Nubbin holds Dante. Or Dante holds your Nubbin!'),
        N('(Count them. You, Miguel, Dante and your Nubbin.)'),
      ],
      [
        ask(
          3,
          'maths',
          'count how many friends',
          'K.CC.B.5',
          [N('How many friends are at the tomb?')],
          [
            opt('Four', [N('Yes! You, Miguel, Dante and Nubbin. Four friends!')], true),
            opt('Two', [N('Let’s count again: you, Miguel, Dante, Nubbin. Four!')]),
            opt('Six', [N('Let’s count again, with your fingers: one, two, three, four. Four!')]),
          ],
          'Counted four friends.',
        ),
      ],
    ),
    sc(
      'a7-03-window',
      [
        N('Miguel wriggles through the window. Thump!'),
        N('You hold the frame. Moonlight comes in with you.'),
        N('A white guitar hangs in a glass case.'),
        M('Please don’t be mad. I just want to borrow it.'),
        N('He lifts the case. He takes out the guitar.'),
      ],
      [
        ask(
          3,
          'sel',
          'ask first before borrowing',
          'CASEL: Responsible decision-making',
          [N('Miguel is borrowing something. What is the best way to borrow?')],
          [
            opt('Ask first, and give it back', [N('Yes! Asking first is respectful.')], true),
            opt('Take it quietly', [
              N('Taking without asking can hurt feelings. Asking first is kinder.'),
            ]),
            opt('Hide it', [N('Hiding it isn’t honest. Ask first, then say thank you.')]),
          ],
          'Talked about asking first when borrowing.',
        ),
      ],
      [
        ch('careful', 'Say, “Careful.”', [M('I’m always careful.')]),
        ch('sure', 'Ask, “Are you sure about this?”', [
          M('No. Yes. I want to play so much.', 'think'),
        ]),
        ch('quiet', 'Say nothing. Hold the window.', [
          N('You hold the window. Your Nubbin holds your sleeve.'),
        ]),
      ],
    ),
    sc(
      'a7-03-window-done',
      [
        N('Miguel strums. One chord rings out.'),
        N('A gust comes from nowhere. Marigold petals lift and glow.'),
        N('The atlas goes warm. Whoosh! Miguel is in the Land of the Dead now.'),
        N('People who are alive cannot see him any more.'),
      ],
      [
        doIt(
          1,
          'science',
          'wind can move light things',
          ELOF_SCI,
          'edu:blow:feather:float',
          [N('Blow a feather, or a tissue. Watch it float!'), N('Wind moves light things.')],
          'Blew a feather and saw that wind moves light things.',
        ),
      ],
    ),
    sc(
      'a7-03-visitors',
      [
        N('Down the path come bright, friendly skeletons.'),
        N('They are Miguel’s family. They died long ago.'),
        N('Tonight they come home to visit. They are very happy to be here.'),
        N('They wear hats and shawls. They glow like lamps.'),
        N('They stop to smell the marigolds on their own graves.'),
        RO('Miguel? Is that our Miguel?', 'shock'),
        JU('Mijo, are you alive?', 'shock'),
        TW('He looks very alive.'),
        N('You know their faces from the ofrenda photos.'),
      ],
      [
        doIt(
          3,
          'health',
          'our bodies have bones inside',
          ELOF_MOTOR,
          'edu:touch:bones:elbow-knee',
          [
            N('You have bones inside you too. They hold you up.'),
            N('(Touch your elbow. Touch your knee. Feel the hard bit?)'),
          ],
          'Found bones by touching elbows and knees.',
        ),
      ],
    ),
    sc(
      'a7-03-visitors-done',
      [
        RO('And who’s this? A friend?'),
        N('Your Nubbin feels shy. It hides behind your leg.'),
        N('Then it peeks out and waves.'),
      ],
      [
        ask(
          1,
          'sel',
          'what helps when you feel shy',
          ELOF_SE,
          [N('Nubbin feels shy. What helps?')],
          [
            opt('A little wave hello', [N('Yes! A wave is a brave, small hello.')], true),
            opt('Hide forever', [
              N('Hiding is okay for a moment. A small wave can help you feel brave.'),
            ]),
          ],
          'Talked about a small wave as a gentle way to say hello when feeling shy.',
        ),
      ],
    ),
    sc(
      'a7-03-complete',
      [
        JU('We must take him to Mamá Imelda.'),
        TW('She always knows what to do.'),
        RO('You’ll come too. You must be meant to.', 'soft'),
        N('The atlas is warm in your pocket.'),
      ],
      [
        notice(
          0,
          'literacy',
          'Spanish family words: tía, tío, mamá, papá',
          ELOF_LANG,
          [
            N('Tía means aunt. Tío means uncle. Mamá is mum. Papá is dad.'),
            N('(Say them with me: tía, tío, mamá, papá.)'),
          ],
          'Learned the Spanish family words tía, tío, mamá and papá.',
        ),
      ],
    ),
  ],
  'Every scene of A7-3 has a sprout version. The dead are bright, friendly skeletons.',
);

// ================================================================== A7-4 The Marigold Bridge
const Q04: EduQuest = quest(
  'a7-04',
  'The Marigold Bridge',
  {
    'a7-04-s1': {
      goal: 'Cross the Marigold Bridge with the family.',
      hint: 'Walk out on the petals. Keep going, even when they glow.',
    },
    'a7-04-s2': {
      goal: 'Go through the gate on the far side.',
      hint: 'Join the queue. Wait your turn.',
    },
  },
  [
    sc(
      'a7-04-bridge',
      [
        N('Past the graves there is a bridge made of marigold petals.'),
        N('It shines, all the way across to a city of lights.'),
        RO('Come on. It’s only flowers, but it holds.'),
        N('Your Nubbin stops. Its colours are changing!'),
        N('It has pink ears, a green back and yellow dots.'),
        N('Pink, green, pink, green, pink, green… (Say it with me.)'),
      ],
      [
        ask(
          5,
          'maths',
          'finish a colour pattern',
          ELOF_MATH,
          [N('Pink, green, pink, green, pink… What comes next?')],
          [
            opt('Green', [N('Yes! Pink, green, pink, green, pink, green.')], true),
            opt('Pink', [N('Let’s say it slowly: pink, green, pink, green, pink… then green!')]),
            opt('Blue', [
              N('There’s no blue in this pattern. Pink, green, pink, green… green is next!'),
            ]),
          ],
          'Continued a pink and green colour pattern.',
        ),
      ],
      [
        ch('pick', 'Pick your Nubbin up.', [N('It is warm, and smells of marigolds.')]),
        ch('look', 'Let it look at itself in the glow.', [
          N('It turns round and round to see its own tail.'),
        ]),
      ],
    ),
    sc(
      'a7-04-bridge-done',
      [
        TW('An alebrije! The little one is a spirit guide!', 'happy'),
        JU('Alebrijes are bright painted creatures.'),
        M('My cousin sells carved ones to tourists.', 'think'),
      ],
      [
        notice(
          1,
          'art',
          'alebrijes are brightly painted creatures from Mexico',
          null,
          [
            N('Alebrijes are real! Artists in Mexico make them from paper or wood.'),
            N('Then they paint them with bright colours and patterns.'),
          ],
          'Learned that alebrijes are bright painted creatures made by artists in Mexico.',
        ),
      ],
    ),
    sc(
      'a7-04-gate',
      [
        N('At the far end, a long queue of skeletons waits.'),
        N('Everyone waits for a turn.'),
        OF('Next! Is your photo on an ofrenda tonight?'),
        N('A woman steps up, with a straight back. You know her from the photo.'),
        I('My photo is up every year. Something is wrong.', 'angry'),
        RO('Mamá Imelda! Look who we found!'),
        N('Mamá Imelda turns. She sees Miguel.'),
      ],
      [
        ask(
          1,
          'sel',
          'waiting for your turn',
          ELOF_SE,
          [N('Everyone is waiting in a queue. What can you do while you wait?')],
          [
            opt(
              'Wait calmly and hum quietly',
              [N('Yes! Waiting calmly is kind to everyone.')],
              true,
            ),
            opt('Push to the front', [N('Pushing isn’t fair. Everyone gets a turn, in order.')]),
            opt('Shout at the officer', [
              N('Shouting makes it harder for everyone. Waiting calmly is better.'),
            ]),
          ],
          'Talked about waiting calmly for a turn.',
        ),
      ],
    ),
    sc(
      'a7-04-gate-done',
      [
        I('Miguel?', 'shock'),
        M('Hola, Mamá Imelda…', 'sad'),
        N('Your Nubbin tries to look like a decoration.'),
      ],
      [
        ask(
          0,
          'literacy',
          'words that show feelings',
          'RL.1.4',
          [N('Mamá Imelda’s eyes go wide. How does she feel?')],
          [
            opt('Surprised', [N('Yes! Wide eyes and a one-word question. Surprised!')], true),
            opt('Sleepy', [
              N('Sleepy eyes are half-closed. Her eyes are wide, so she is surprised.'),
            ]),
          ],
          'Named a feeling, surprise, from how a character looked and spoke.',
        ),
      ],
    ),
    sc(
      'a7-04-complete',
      [
        N('Behind you, the bridge glows on and on.'),
        N('A petal stuck to your shoe still glows. You keep it.'),
        OF('Family business? Second floor.'),
        I('Come. All of you.'),
      ],
      [
        ask(
          1,
          'science',
          'what plants need to grow',
          'K-LS1-1',
          [N('The petal came from a marigold plant. What does a plant need to grow?')],
          [
            opt('Sun, water and soil', [N('Yes! Sun, water and soil help it grow.')], true),
            opt('Sweets', [N('Plants don’t eat sweets! They need sun, water and soil.')]),
            opt('A blanket', [N('Blankets are for us. Plants need sun, water and soil.')]),
          ],
          'Talked about what plants need to grow: sun, water and soil.',
        ),
      ],
    ),
  ],
  'Every scene of A7-4 has a sprout version. The marigold bridge is a walk, not a puzzle.',
);

// ================================================================== A7-5 The Department of Family Reunions
const Q05: EduQuest = quest(
  'a7-05',
  'The Department of Family Reunions',
  {
    'a7-05-s1': {
      goal: 'Take a number and wait your turn.',
      hint: 'Take a ticket. Sit with the family until it is called.',
    },
    'a7-05-s2': {
      goal: 'Hear what the clerk says about Miguel.',
      hint: 'Sit at the desk with Miguel and Mamá Imelda. Listen.',
    },
    'a7-05-s3': {
      goal: 'Stay with Miguel when he runs.',
      hint: 'Follow him out through the crowds. Don’t let him go alone.',
    },
  },
  [
    sc(
      'a7-05-queue',
      [
        N('The Department is a long room of desks and stamps.'),
        N('You take a ticket that says 5. The board says 3.'),
        TW('It’s quick tonight.'),
        N('A tall skeleton in a dress is arguing with a clerk.'),
        N('He has big, bushy eyebrows.'),
        PA('Please! There’s someone I must see before she forgets me.', 'sad'),
        N('The guards walk him out.'),
        N('He winks at your Nubbin. Plop! One eyebrow falls off.'),
      ],
      [
        ask(
          2,
          'maths',
          'count up to find how many more',
          'K.OA.A.2',
          [N('Ticket 5. The board says 3. Count up: 4, 5. How many more turns?')],
          [
            opt('Two', [N('Yes! Number four, then number five. Two more.')], true),
            opt('Five', [N('Let’s count up from 3: four, five. Two more turns.')]),
            opt('One', [N('Let’s count up from 3: four… five. That’s two more turns.')]),
          ],
          'Counted up from 3 to 5 to find two more turns.',
        ),
      ],
      [
        ch('wave', 'Wave goodbye.', [N('He waves back. Plop! There goes the other one.')]),
        ch('ask', 'Ask who he is.', [JU('Somebody that nobody remembers. There are many.', 'sad')]),
      ],
    ),
    sc(
      'a7-05-queue-done',
      [
        CL('Number five?'),
        N('Somehow it’s your number already.'),
        N('Stamp. Stamp. Rest. Stamp. Stamp. Rest. (Clap the pattern.)'),
      ],
      [
        doIt(
          2,
          'music',
          'clap a repeating rhythm pattern',
          ELOF_MATH,
          'edu:clap:pattern:stamp-stamp-rest',
          [N('Clap, clap, rest. Clap, clap, rest. Can you keep it going?')],
          'Clapped a repeating clap-clap-rest pattern.',
        ),
      ],
    ),
    sc(
      'a7-05-curse',
      [
        CL('A living boy here! You need a blessing from your family.'),
        CL('It must happen before sunrise.'),
        N('Miguel looks at his hand. His fingertips look pale and see-through.'),
        I('Miguel, I give you my blessing. But no music, ever.', 'angry'),
        M('That’s not fair!', 'angry'),
        I('That’s the only blessing I have.'),
      ],
      [
        ask(
          4,
          'sel',
          'saying you disagree calmly',
          'CASEL: Relationship skills',
          [N('Miguel says it’s not fair. How can he say so kindly?')],
          [
            opt(
              'Use a calm voice and say why',
              [M('I know you’re hurting. But music makes me happy.')],
              true,
            ),
            opt('Shout and stamp', [
              N('Shouting makes people stop listening. A calm voice works better.'),
            ]),
            opt('Run away', [N('Running away stops talking. A calm voice can help them listen.')]),
          ],
          'Practised saying “this isn’t fair” in a calm voice and giving a reason.',
        ),
      ],
    ),
    sc(
      'a7-05-curse-done',
      [
        N('Miguel takes the petal. It flares, and he is gone, for one breath.'),
        N('Then he is back, looking sheepish.'),
        M('I reached for the guitar. I just picked it up.', 'sad'),
        I('So. You heard me.', 'angry'),
      ],
      [
        ask(
          1,
          'science',
          'the sun rises in the morning',
          '1-ESS1-1',
          [N('The blessing is needed before sunrise. When does the sun come up?')],
          [
            opt('In the morning', [N('Yes! The sun comes up each morning.')], true),
            opt('In the evening', [
              N('In the evening the sun goes down. It comes up in the morning.'),
            ]),
          ],
          'Talked about the sun coming up in the morning.',
        ),
      ],
    ),
    sc(
      'a7-05-run',
      [
        M('I don’t need your blessing! I have another family!', 'angry'),
        N('Miguel runs down the stairs and out into the streets.'),
        N('Dante bounds after him.'),
        N('Mamá Imelda looks at you. She looks fierce, and a little scared.'),
      ],
      [
        doIt(
          1,
          'maths',
          'point up and down',
          'K.G.A.1',
          'edu:point:direction:up-down',
          [
            N('Miguel runs down the stairs and out of the door.'),
            N('(Point down for the stairs. Point up to the tall building.)'),
          ],
          'Pointed up and down to show positions.',
        ),
      ],
      [
        ch('keep', 'Say, “I’ll stay with him.”', [I('Keep him safe. And bring him back.', 'sad')]),
        ch('why', 'Ask, “Why no music?”', [
          I('I loved it. That’s the trouble.', 'sad'),
          I('Go on. Go after him.'),
        ]),
      ],
    ),
    sc(
      'a7-05-run-done',
      [
        N('You catch up with Miguel in a back street.'),
        M('I just need to find Ernesto. How hard can it be?'),
        N('A poster says SOLD OUT. (Point to the S.)'),
      ],
      [
        ask(
          2,
          'literacy',
          'the first letter and its sound',
          ELOF_LIT,
          [N('SOLD begins with the sound sss. Which word also begins with sss?')],
          [
            opt('Sun', [N('Yes! Sss-sun. Sss-sold.')], true),
            opt('Moon', [N('Mmm-moon begins with mmm. Sss-sun begins with sss, like sold.')]),
            opt('Dog', [N('Duh-dog begins with duh. Sss-sun begins with sss, like sold.')]),
          ],
          'Matched the first sound of “sold” with “sun”.',
        ),
      ],
    ),
    sc(
      'a7-05-complete',
      [
        N('In the Department, Mamá Imelda fills in a form.'),
        N('She presses so hard the pen goes through.'),
        N('She is worried. Her tummy feels tight.'),
      ],
      [
        notice(
          2,
          'health',
          'worry feels like a tight tummy, and sharing helps',
          ELOF_SE,
          [
            N('Worry can feel like a tight tummy. That is okay.'),
            N('A hug, a friend, or a deep breath can help.'),
          ],
          'Named worry as a feeling in the body and talked about what helps.',
        ),
      ],
    ),
  ],
  'Every scene of A7-5 has a sprout version. The clerk is a comic official; the sunrise deadline is a story beat, never a timer.',
);

// ================================================================== A7-6 Héctor
const Q06: EduQuest = quest(
  'a7-06',
  'Héctor',
  {
    'a7-06-s1': {
      goal: 'Hear out the tall skeleton in the alley.',
      hint: 'He is waving from behind the bins. Go and talk to him.',
    },
    'a7-06-s2': {
      goal: 'Go to Shantytown to borrow a guitar.',
      hint: 'Follow Héctor down the stairs, to the hut by the water.',
    },
    'a7-06-s3': {
      goal: 'Héctor asks you to remember his name.',
      hint: 'Sit on the step with Héctor. Choose how.',
    },
  },
  [
    sc(
      'a7-06-alley',
      [
        H('Psst! Over here! Living boy!'),
        N('It is the painter from the Department, in a shabby suit.'),
        H('I’m Héctor. I can take you to Ernesto.'),
        H('You put my photo on your ofrenda. Just one year.'),
        H('There’s someone I want to see.', 'soft'),
        N('He holds out a bony hand.'),
      ],
      [
        ask(
          4,
          'sel',
          'a promise means doing what you say',
          'CASEL: Responsible decision-making',
          [N('Héctor wants Miguel to promise. What is a promise?')],
          [
            opt(
              'Saying you will do it, and doing it',
              [H('Exactly! A promise is a small, strong thing.', 'soft')],
              true,
            ),
            opt('Saying it and forgetting', [
              H('Forgetting breaks it. A promise means you do it.'),
            ]),
          ],
          'Talked about what a promise is: saying you will do something, and doing it.',
        ),
      ],
      [
        ch('shake', 'Nod to Miguel: shake on it.', [
          M('Deal.'),
          H('Deal! You won’t regret it.', 'happy'),
        ]),
        ch('trust', 'Ask, “Can we trust you?”', [
          H('Honestly? Not always. But I will help you, amigo.'),
          N('Miguel likes that he told the truth. They shake hands.'),
        ]),
      ],
    ),
    sc(
      'a7-06-alley-done',
      [
        N('He tucks his photo into Miguel’s pocket, beside the family photo.'),
        H('For your ofrenda. Don’t lose it.'),
        H('First the boy needs a guitar. I know a man who has one.'),
      ],
      [
        ask(
          1,
          'maths',
          'add one more',
          'K.OA.A.1',
          [N('Miguel had one photo in his pocket. Now there is one more. How many?')],
          [
            opt('Two', [N('Yes! One and one more is two.')], true),
            opt('One', [N('One and one more is two. Count them: one… two.')]),
            opt('Three', [N('One and one more is two. Count them: one… two.')]),
          ],
          'Added one and one to make two photos.',
        ),
      ],
    ),
    sc(
      'a7-06-shantytown',
      [
        N('At the bottom of the city, by the water, are tin roofs and string.'),
        N('An old skeleton lies in a hammock, with a guitar.'),
        CH('Play me something first. Something I used to like.', 'soft'),
        N('Héctor plays a silly song about a moustache. Chicharrón laughs.'),
        N('Then gold light lifts off him, like dust in sunshine.'),
        N('Chicharrón has faded. That means he is gone, and won’t come back.'),
        N('He wasn’t hurt. He went laughing at his favourite song.'),
        H('Nobody remembered him any more. It makes me sad.', 'sad'),
      ],
      [
        ask(
          7,
          'sel',
          'what helps when we feel sad about a friend',
          'CASEL: Social awareness',
          [N('Héctor is sad about his friend. What helps?')],
          [
            opt(
              'A hug, and talking about him',
              [N('Yes. A hug and kind words help sad feelings.')],
              true,
            ),
            opt('Pretend nothing happened', [
              N('Feelings are allowed. A hug and talking about him help more.'),
            ]),
          ],
          'Talked about what helps when we feel sad about someone who has died: hugs and remembering.',
        ),
      ],
    ),
    sc(
      'a7-06-shantytown-done',
      [
        N('Héctor puts the guitar into Miguel’s hands.'),
        N('A guitar has strings. (Pluck them with me. One, two, three…)'),
        N('Héctor’s hand shines gold at the edges.'),
      ],
      [
        doIt(
          1,
          'maths',
          'count six strings',
          'K.CC.B.5',
          'edu:count:strings:6',
          [N('This guitar has six strings. One, two, three, four, five, six!')],
          'Counted six guitar strings.',
        ),
      ],
    ),
    sc(
      'a7-06-name',
      [
        N('Miguel tries chords. You sit on the step with Héctor.'),
        H('Only one person still remembers me. And she is very old.', 'sad'),
        H('Will you remember my name? Héctor. Just Héctor.'),
        N('He pulls a thread from his jacket.'),
        H('Or you could stitch it somewhere safe.'),
      ],
      [
        doIt(
          2,
          'literacy',
          'trace the letter H, the first letter of Héctor',
          ELOF_LIT,
          'edu:trace:letter:h',
          [
            N('Héctor starts with H. (Trace an H in the air, or on paper.)'),
            N('Down, down, and across. H!'),
          ],
          'Traced the letter H, the first letter of Héctor’s name.',
        ),
      ],
      [
        ch(
          'ribbon',
          'Stitch his name into the ribbon.',
          [
            N('You stitch slowly: H, É, C, T, O, R. The letters are crooked.'),
            H('Nobody has written my name for a hundred years. It looks good.', 'soft'),
          ],
          { 'a7-name': 'ribbon' },
        ),
        ch(
          'promise',
          'Promise him, with your word.',
          [
            Y('Héctor. I won’t forget. I promise.'),
            H('A promise. All right. Let’s see if we can keep one.', 'soft'),
          ],
          { 'a7-name': 'promise' },
        ),
      ],
    ),
    sc(
      'a7-06-name-done',
      [
        H('Right! We have a boy to make famous.', 'happy'),
        N('He jumps up, with a big smile.'),
        N('Look at his face. Look at that big smile.'),
      ],
      [
        ask(
          2,
          'sel',
          'name a feeling from a character’s face',
          'ELOF: Social and Emotional Development',
          [N('Héctor is smiling. How does he feel?')],
          [
            opt('Happy', [N('Yes! A big smile means he is happy.')], true),
            opt('Cross', [N('A cross face frowns. Héctor is smiling, so he is happy.')]),
          ],
          'Named happiness from a smile.',
        ),
      ],
    ),
    sc(
      'a7-06-complete',
      [
        M('How do we get to Ernesto?'),
        H('There’s a talent show tonight. The winner plays at his party.'),
        M('I was going to play tonight!', 'happy'),
        H('You’re already practised. Come on!'),
      ],
      [
        ask(
          1,
          'science',
          'day and night patterns',
          '1-ESS1-1',
          [N('The talent show is tonight. Is tonight in the day, or in the dark?')],
          [
            opt('In the dark', [N('Yes! Tonight comes after the sun goes down.')], true),
            opt('In the daytime', [N('The daytime has sunshine. Tonight is when it’s dark.')]),
          ],
          'Talked about day and night.',
        ),
      ],
    ),
  ],
  'Every scene of A7-6 has a sprout version. Both name choices keep their set flag (a7-name). Chicharrón’s fade is said plainly and gently, with comfort straight after.',
);

// ================================================================== A7-7 The Talent Show
const Q07: EduQuest = quest(
  'a7-07',
  'The Talent Show',
  {
    'a7-07-s1': {
      goal: 'Help paint Miguel’s face.',
      hint: 'Hand Héctor the white paint and the black. Hold the mirror.',
    },
    'a7-07-s2': {
      goal: 'Go on stage with Miguel and Héctor.',
      hint: 'Tap with the beat to get the crowd clapping.',
    },
    'a7-07-s3': {
      goal: 'Get away through the back streets.',
      hint: 'Run out behind the stage. Then stand by Miguel.',
    },
  },
  [
    sc(
      'a7-07-paint',
      [
        H('Hold still. We’ll paint you like a skeleton.'),
        N('White paint on his face. Black round his eyes. Teeth on his lips.'),
        M('Do I look like one of them?'),
        N('Your Nubbin holds up a little mirror. Miguel grins.'),
        H('Don’t get stage fright!'),
      ],
      [
        notice(
          1,
          'social-studies',
          'calavera painted faces are a happy Día de Muertos art',
          'D2.His.2.K-2',
          [
            N('Many people in Mexico paint their faces as calaveras.'),
            N('Calavera means skull. It is bright and happy art.'),
          ],
          'Learned that painted calavera faces are a cheerful Día de Muertos tradition.',
        ),
      ],
      [
        ch('mirror', 'Paint a small skull on your cheek.', [
          H('A natural! You look wonderful.', 'happy'),
        ]),
        ch('nubbin', 'Let your Nubbin dab Miguel’s nose.', [
          M('Hey!'),
          H('No, leave it. It’s artistic.', 'happy'),
        ]),
      ],
    ),
    sc(
      'a7-07-paint-done',
      [
        N('Above the square hang strings of papel picado.'),
        N('That means “paper with tiny holes cut in it”.'),
        EM('Next! The boy with the paint. And the tall one.'),
      ],
      [
        doIt(
          1,
          'art',
          'cut a pattern into paper, like papel picado',
          ELOF_MOTOR,
          'edu:cut:paper:snip-pattern',
          [
            N('Fold a piece of paper. Snip little shapes into the edges.'),
            N('Open it up. Look at the pattern! (Ask a grown-up to help.)'),
          ],
          'Cut shapes into folded paper to make a papel picado style pattern.',
        ),
      ],
    ),
    sc(
      'a7-07-stage',
      [
        N('The stage is a ring of light. Hundreds of skeletons watch.'),
        N('Miguel’s hands won’t move. He feels nervous.'),
        H('Look at me. Just play. Play like it’s the attic.', 'soft'),
        N('Miguel starts to play. It’s a quick, silly song.'),
        N('The crowd claps with the beat. Clap, clap, clap!'),
        N('Your Nubbin dances at the front of the stage.'),
      ],
      [
        ask(
          2,
          'sel',
          'what helps when you feel nervous',
          ELOF_SE,
          [N('Miguel feels nervous. What helps?')],
          [
            opt(
              'Look at a friend and breathe',
              [H('That’s it. Breathe in. Breathe out.', 'soft')],
              true,
            ),
            opt('Run away', [
              N('Running away can feel easier. A friend and a deep breath help more.'),
            ]),
          ],
          'Talked about looking at a friend and breathing when feeling nervous.',
        ),
        doIt(
          4,
          'music',
          'clap along to a steady beat',
          ELOF_MOTOR,
          'edu:clap:beat:steady',
          [N('Clap, clap, clap, clap. Keep the beat steady!')],
          'Clapped along to a steady beat.',
        ),
      ],
    ),
    sc(
      'a7-07-stage-done',
      [
        N('The crowd roars. And then a loud voice.'),
        I('MIGUEL!', 'angry'),
        N('The whole Rivera family is pushing through the crowd.'),
      ],
      [
        ask(
          0,
          'maths',
          'more and fewer',
          'K.CC.C.6',
          [N('Are there more skeletons in the crowd, or on the stage?')],
          [
            opt('More in the crowd', [N('Yes! A whole crowd is more than one small band.')], true),
            opt('More on the stage', [
              N('Look again. The crowd is much bigger. More in the crowd!'),
            ]),
          ],
          'Compared two groups, more and fewer.',
        ),
      ],
    ),
    sc(
      'a7-07-row',
      [
        N('You run out of the back of the stage, down an alley.'),
        H('You’re a musician! And my photo goes up on your ofrenda…'),
        M('Is that all you care about?', 'angry'),
        H('It’s important. You don’t understand.', 'sad'),
        M('You’re just using me!', 'angry'),
        H('Fine! Go!', 'angry'),
        N('Miguel runs. Héctor stands alone, his arms out.'),
      ],
      [
        ask(
          6,
          'sel',
          'saying sorry after unkind words',
          'CASEL: Relationship skills',
          [N('Miguel and Héctor said cross words. What can they do later?')],
          [
            opt('Say sorry, and listen', [N('Yes! Sorry and listening mend things.')], true),
            opt('Never talk again', [
              N('Not talking leaves hurt feelings. Sorry and listening mend things.'),
            ]),
          ],
          'Talked about saying sorry and listening after cross words.',
        ),
      ],
      [
        ch('follow', 'Follow Miguel.', [
          N('You go after Miguel, because Mamá Imelda asked you to.'),
        ]),
        ch('stay', 'Stop by Héctor first.', [
          N('You put a hand on his arm.'),
          H('Go on. Keep him safe. Somebody should.', 'sad'),
        ]),
      ],
    ),
    sc(
      'a7-07-complete',
      [
        N('Miguel stops under a string of papel picado cut into guitars.'),
        M('I don’t need any of them. I just need him.', 'sad'),
        N('Your Nubbin pulls one flag free and gives it to Miguel.'),
        N('He smiles, a tiny bit. The flag is a rectangle.'),
      ],
      [
        ask(
          3,
          'maths',
          'name a rectangle',
          'K.G.A.2',
          [N('The flag has four corners. Two sides are long, two are short. What shape?')],
          [
            opt('A rectangle', [N('Yes! A rectangle has four corners.')], true),
            opt('A circle', [
              N('A circle has no corners. This flag has four, so it’s a rectangle.'),
            ]),
          ],
          'Named a rectangle.',
        ),
      ],
    ),
  ],
  'Every scene of A7-7 has a sprout version. Both row choices are kept; Miguel’s unkind words are in our own words.',
);

// ================================================================== A7-8 The Mansion
const Q08: EduQuest = quest(
  'a7-08',
  'The Mansion',
  {
    'a7-08-s1': {
      goal: 'Get into the party with a band of musicians.',
      hint: 'Pick up a case and walk in with the band.',
    },
    'a7-08-s2': {
      goal: 'Help Miguel when he falls in the pool.',
      hint: 'Get to the edge. Help pull Miguel out.',
    },
  },
  [
    sc(
      'a7-08-gate',
      [
        N('The tower at the top of the city is Ernesto’s house.'),
        N('A band is going in: guitars, trumpets and violins.'),
        M('I’m with the band!'),
        N('You carry a case. Your Nubbin carries a maraca.'),
        N('The doorman sighs and waves you in.'),
        M('There he is!', 'happy'),
      ],
      [
        doIt(
          1,
          'music',
          'sort instruments by strings or blow',
          'K.MD.B.3',
          'edu:sort:instruments:strings-blow',
          [
            N('Guitars and violins have strings. Trumpets you blow into.'),
            N('(Sort them into two piles: strings and blow.)'),
          ],
          'Sorted instruments into two groups: strings and blow.',
        ),
      ],
    ),
    sc(
      'a7-08-gate-done',
      [
        N('Across the pool, under a spotlight, stands Ernesto de la Cruz.'),
        N('He is tall, in a white suit. Your Nubbin is small.'),
      ],
      [
        ask(
          1,
          'maths',
          'taller and shorter',
          'K.MD.A.2',
          [N('Who is taller, Ernesto or your Nubbin?')],
          [
            opt('Ernesto', [N('Yes! Ernesto is tall. Nubbin is small.')], true),
            opt('Your Nubbin', [N('Look again. Ernesto is tall and Nubbin is small.')]),
          ],
          'Compared who is taller.',
        ),
      ],
    ),
    sc(
      'a7-08-pool',
      [
        N('Miguel plays loudly. Nobody turns round.'),
        N('He steps back. Splash! He falls in the pool.'),
        N('Your Nubbin dives in. It swims like a little fish.'),
        N('A big white sleeve pulls Miguel out.'),
        ER('Easy! Are you all right, my boy?', 'happy'),
        N('Miguel is wet and cold.'),
      ],
      [
        ask(
          5,
          'health',
          'get dry and warm after getting wet',
          ELOF_MOTOR,
          [N('Miguel is wet and cold. What helps him get warm?')],
          [
            opt('A towel', [N('Yes! A towel dries you and keeps you warm.')], true),
            opt('Stay wet', [N('Wet clothes make us colder. A dry towel is better.')]),
          ],
          'Talked about drying off and keeping warm after getting wet.',
        ),
      ],
      [
        ch('help', 'Wrap Miguel in a towel.', [N('You find a towel and wrap it round him.')]),
        ch('nubbin', 'Help your Nubbin out of the pool.', [
          N('Your Nubbin climbs out and shakes. Spots of pink land on Ernesto’s suit.'),
        ]),
      ],
    ),
    sc(
      'a7-08-pool-done',
      [
        ER('A great-great-grandson! Everyone, cheer!', 'happy'),
        N('The crowd cheers. Miguel looks very happy.'),
        N('Your Nubbin doesn’t clap. It has a funny feeling.'),
      ],
      [
        notice(
          2,
          'sel',
          'notice a funny feeling in your body and wait to find out why',
          'CASEL: Self-awareness',
          [
            N('Sometimes we feel “not quite right”, and can’t say why.'),
            N('That is okay. We can notice it, and wait, and watch.'),
          ],
          'Learned that it is okay to notice a funny feeling and wait to understand it.',
        ),
      ],
    ),
    sc(
      'a7-08-complete',
      [
        ER('Stay the night! It’s my party.'),
        N('Fireworks go up. Boom! Pop! Fizz!'),
        N('Your Nubbin sits by your feet. It doesn’t clap.'),
        N('You don’t clap either.'),
      ],
      [
        doIt(
          1,
          'literacy',
          'say sound words (boom, pop, fizz)',
          ELOF_LIT,
          'edu:say:sound-words:boom-pop-fizz',
          [N('Fireworks go boom! Pop! Fizz! Say the sound words with me.')],
          'Said sound words for fireworks.',
        ),
      ],
    ),
  ],
  'Every scene of A7-8 has a sprout version. Nobody is in danger: the pool is shallow at the steps.',
);

// ================================================================== A7-9 The Truth
const Q09: EduQuest = quest(
  'a7-09',
  'The Truth',
  {
    'a7-09-s1': {
      goal: 'Watch Ernesto’s old films with Miguel.',
      hint: 'Sit with Miguel in the film room.',
    },
    'a7-09-s2': {
      goal: 'Hear Héctor remember his last night.',
      hint: 'Stand by Miguel and listen. Keep your Nubbin close.',
    },
  },
  [
    sc(
      'a7-09-films',
      [
        N('Ernesto shows Miguel his old films. Miguel loves them.'),
        N('Then the door opens. It is Héctor, out of breath.'),
        H('Ernesto. You took my songs and said they were yours.', 'angry'),
        M('His songs? What does he mean?', 'think'),
        N('A film plays. Two friends share a farewell toast.'),
      ],
      [
        ask(
          2,
          'sel',
          'being honest about who made something',
          'CASEL: Responsible decision-making',
          [N('Ernesto said Héctor’s songs were his. What is the honest thing to do?')],
          [
            opt('Say who really made them', [N('Yes! Being honest means giving credit.')], true),
            opt('Say you made them', [N('That isn’t honest. We say who really made things.')]),
            opt('Say nothing', [N('Saying nothing can hide the truth. Giving credit is honest.')]),
          ],
          'Talked about honesty: saying who really made something.',
        ),
      ],
    ),
    sc(
      'a7-09-films-done',
      [
        N('Héctor stops. He stares at the screen.'),
        N('Two glasses chink together. Clink!'),
        H('I know this. This isn’t how it went.', 'shock'),
      ],
      [
        doIt(
          1,
          'maths',
          'count two glasses',
          'K.CC.B.5',
          'edu:count:glasses:2',
          [N('Two friends, two glasses. One, two. Clink!')],
          'Counted two glasses.',
        ),
      ],
    ),
    sc(
      'a7-09-toast',
      [
        H('I was going home. I missed my little girl.'),
        H('Ernesto played an unkind trick. I never got home.', 'shock'),
        N('Héctor died that night. That means his body stopped working.'),
        N('It was a very long time ago. It is very sad.'),
        M('You took his songs.', 'shock'),
        ER('I did what I had to do.'),
        N('Ernesto says it calmly. Miguel feels cold inside.'),
        ER('Guards, take them away.'),
      ],
      [
        notice(
          3,
          'sel',
          'hearing something sad: feelings are allowed, and remembering helps',
          'CASEL: Self-awareness',
          [
            N('It is okay to feel sad, or cross, or shocked.'),
            N('Telling someone how you feel helps. And Héctor is remembered now.'),
          ],
          'Talked about feeling sad about a death, telling someone, and remembering together.',
        ),
      ],
      [
        ch('stand', 'Stand in front of Miguel.', [
          N('You step in front of Miguel. He isn’t alone.'),
        ]),
        ch('photo', 'Reach for Héctor’s photo.', [
          N('Ernesto steps back out of reach, and smiles.'),
        ]),
      ],
    ),
    sc(
      'a7-09-toast-done',
      [
        N('The guards walk you down a long stair, to a deep round hole.'),
        N('Dante sees you go. Woof! Woof! Woof!'),
      ],
      [
        ask(
          1,
          'literacy',
          'animal sounds',
          ELOF_LANG,
          [N('Dante barks. Which animal says woof?')],
          [
            opt('A dog', [N('Yes! Woof, woof. A dog.')], true),
            opt('A cat', [N('A cat says meow. A dog says woof.')]),
            opt('A cow', [N('A cow says moo. A dog says woof.')]),
          ],
          'Matched the sound “woof” to a dog.',
        ),
      ],
    ),
    sc(
      'a7-09-complete',
      [
        N('You slide down into the deep hole. Splash!'),
        N('You land in cool water, with Miguel and Héctor.'),
        N('Your Nubbin glows like a lantern. Its light shines on the walls.'),
      ],
      [
        ask(
          2,
          'science',
          'we see things when there is light',
          '1-PS4-2',
          [N('It is dark, but we can still see the walls. Why?')],
          [
            opt('Nubbin’s glow gives light', [N('Yes! We see things when there is light.')], true),
            opt('The walls are glowing', [
              N('It is Nubbin’s glow. The light bounces off the walls.'),
            ]),
          ],
          'Explained that we see because Nubbin’s glow gives light.',
        ),
      ],
    ),
  ],
  'Every scene of A7-9 has a sprout version. Héctor’s death is said once, plainly and gently, with comfort straight after. Ernesto’s part is “an unkind trick”; nothing is shown.',
);

// ================================================================== A7-10 The Cenote
const Q10: EduQuest = quest(
  'a7-10',
  'The Cenote',
  {
    'a7-10-s1': {
      goal: 'Find a way round the cenote. Find Héctor.',
      hint: 'Your Nubbin’s glow lights the way. Follow the ledge.',
    },
    'a7-10-s2': {
      goal: 'Sit with Héctor and Miguel by the water.',
      hint: 'Sit on the ledge. There is no rush now.',
    },
    'a7-10-s3': {
      goal: 'Watch for help from above.',
      hint: 'Look up at the rim. Something is coming.',
    },
  },
  [
    sc(
      'a7-10-dark',
      [
        N('A cenote is a deep, round well of stone, with water at the bottom.'),
        N('Your Nubbin’s stripes glow pink and green.'),
        M('Héctor? Héctor!'),
        N('Héctor sits on a ledge, with his hat in his hands.'),
        H('I never got home to my girl.', 'sad'),
        H('Her name is Coco.', 'soft'),
      ],
      [
        notice(
          0,
          'social-studies',
          'cenotes are deep water-filled holes in the ground in south-east Mexico',
          'D2.Geo.2.K-2',
          [
            N('Cenotes are real. They are in the south-east of Mexico.'),
            N('A cenote is a deep hole in the ground, filled with water.'),
          ],
          'Learned that a cenote is a water-filled hole in the ground found in south-east Mexico.',
        ),
      ],
      [
        ch('look', 'Look at Miguel.', [N('Miguel’s face has gone very still.')]),
        ch('ask', 'Ask Héctor about her.', [
          H('She’d be old now. Nearly as old as me. That’s silly, since I died.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a7-10-dark-done',
      [
        N('Miguel takes out the old family photo.'),
        M('Héctor! Your girl Coco is my Mamá Coco!', 'shock'),
        M('You are the man in the photo. You are my family!', 'happy'),
        N('Héctor’s mouth falls open.'),
        N('His jaw nearly falls off. He catches it.'),
        H('I’m your what?', 'shock'),
      ],
      [
        ask(
          5,
          'literacy',
          'family words: papá and daughter',
          ELOF_LANG,
          [N('Coco is Héctor’s daughter. So Héctor is Coco’s…?')],
          [
            opt('Papá', [N('Yes! Papá, her dad. And Miguel is family too.')], true),
            opt('Dog', [N('Dante is the dog! Héctor is Coco’s papá, her dad.')]),
          ],
          'Learned that Héctor is Coco’s papá, her dad.',
        ),
      ],
    ),
    sc(
      'a7-10-water',
      [
        N('For a while, nobody speaks. They just look at each other.'),
        H('You play like me. I knew it.', 'soft'),
        M('Mamá Coco still asks for you.'),
        N('Héctor’s hand shines gold. He is fading.'),
        N('Your Nubbin climbs onto his knee. The ribbon has his name on it.'),
        H('Look at that. Somebody wrote me down.', 'soft'),
      ],
      [
        ask(
          5,
          'sel',
          'ways to remember someone',
          ELOF_SE,
          [N('How can we remember someone we love?')],
          [
            opt(
              'Say their name and tell stories',
              [H('Yes. That’s how people stay close.', 'soft')],
              true,
            ),
            opt('Draw them a picture', [H('That’s a lovely way too.', 'soft')]),
            opt('Sing a song', [H('That works too. Songs carry a lot.', 'soft')]),
          ],
          'Talked about ways to remember someone: names, stories, pictures and songs.',
        ),
      ],
    ),
    sc(
      'a7-10-water-done',
      [
        H('If I go first, tell her something.', 'sad'),
        H('Tell her her papá was coming home.'),
        M('You tell her. You’re coming too.'),
      ],
      [
        ask(
          1,
          'literacy',
          'first, next, last in a story',
          ELOF_LIT,
          [N('What happened first? Héctor left to go home. What happened next?')],
          [
            opt(
              'Ernesto played an unkind trick',
              [N('Yes! First he set off. Next the trick. Last, he never got home.')],
              true,
            ),
            opt('He got home', [
              N('Home for tea? Ding! First the trick. Last, he never got home.'),
            ]),
          ],
          'Put the events of a story in order: first, next, last.',
        ),
      ],
    ),
    sc(
      'a7-10-glow',
      [
        N('Far above, there is barking. Woof! Woof!'),
        N('Dante’s face appears. Then he begins to shine!'),
        N('Colours sweep over him: blue, pink, green and gold.'),
        M('Dante’s an alebrije!', 'happy'),
        N('Your Nubbin glows too, every stripe and spot.'),
        N('Then a huge painted cat lands, with Mamá Imelda on her back.'),
      ],
      [
        doIt(
          3,
          'maths',
          'count four colours',
          'K.CC.B.5',
          'edu:count:colours:4',
          [N('Blue, pink, green and gold. How many colours? Count on your fingers.')],
          'Counted four colours on Dante’s alebrije glow.',
        ),
      ],
    ),
    sc(
      'a7-10-glow-done',
      [
        M('He didn’t leave you, Mamá Imelda. He was coming home.'),
        H('I was. I had my hat on and everything.', 'soft'),
        N('Mamá Imelda is still hurt. But she pulls Héctor up onto the painted cat.'),
        I('We will get that photo back.'),
      ],
      [
        notice(
          2,
          'sel',
          'helping someone even when you are still hurt',
          'CASEL: Social awareness',
          [
            N('Imelda is still hurt. But she helps Héctor up.'),
            N('Helping is kind. Feelings can take time to mend.'),
          ],
          'Talked about helping others while feelings are still mending.',
        ),
      ],
    ),
    sc(
      'a7-10-complete',
      [
        N('The painted cat rises out of the cenote, with her wings beating.'),
        N('Your Nubbin rides on Dante’s back. Both are blazing with colour.'),
        N('Below, the city glitters.'),
      ],
      [
        ask(
          0,
          'science',
          'wings help animals fly',
          ELOF_SCI,
          [N('What helps the painted cat fly up?')],
          [
            opt('Her wings', [N('Yes! Wings push the air and lift her up.')], true),
            opt('Her tail', [N('Her tail helps balance. It’s her wings that lift her.')]),
          ],
          'Talked about how wings help animals fly.',
        ),
      ],
    ),
  ],
  'Every scene of A7-10 has a sprout version. Both name routes use a variant of a7-10-water; the lesson ids differ.',
);

// ================================================================== A7-11 The Blessing
const Q11: EduQuest = quest(
  'a7-11',
  'The Blessing',
  {
    'a7-11-s1': {
      goal: 'Sneak backstage at the big concert.',
      hint: 'Stay close to the family, behind the scenery.',
    },
    'a7-11-s2': {
      goal: 'Watch Ernesto in front of the cameras.',
      hint: 'Stay behind the scenery. Watch the big screens.',
    },
    'a7-11-s3': {
      goal: 'Before sunrise, speak up for Miguel.',
      hint: 'Go to Mamá Imelda on the ledge. Choose your blessing.',
    },
  },
  [
    sc(
      'a7-11-backstage',
      [
        N('The Sunrise Spectacular fills a big stadium.'),
        N('The Rivera family sneaks in. The twins are a pantomime horse!'),
        N('One twin is the front. One twin is the back.'),
        N('The back twin asks, “Where are we going?” The front twin stops.'),
        N('Bump! The back walks into the front.'),
        JU('Find the photo. Find Ernesto. Get out.'),
        N('A stage manager pushes Mamá Imelda onto the stage.'),
        I('I… I don’t…', 'shock'),
        N('Then Héctor plays. Mamá Imelda closes her eyes, and sings.'),
        N('It is a slow song. The whole stadium goes quiet.'),
      ],
      [
        doIt(
          9,
          'music',
          'sing slowly and softly',
          ELOF_MOTOR,
          'edu:sing:song:slow-soft',
          [N('Slow songs are soft and gentle. Hum one, slowly and softly.')],
          'Hummed a slow, soft song.',
        ),
      ],
    ),
    sc(
      'a7-11-backstage-done',
      [
        N('When the song ends, Mamá Imelda looks at Héctor.'),
        I('Don’t say anything. Not yet.', 'soft'),
      ],
      [
        ask(
          0,
          'sel',
          'feeling two feelings at once',
          'CASEL: Self-awareness',
          [N('Imelda feels happy and sad at once. Can you feel two feelings at once?')],
          [
            opt('Yes, you can', [N('Yes! Feelings can mix. That is okay.')], true),
            opt('No, only one', [N('Sometimes we feel happy and sad together. That is okay.')]),
          ],
          'Learned that people can feel two feelings at once.',
        ),
      ],
    ),
    sc(
      'a7-11-screens',
      [
        N('Ernesto grabs Miguel at the stage door. A camera is filming.'),
        ER('I took the songs. I took everything.', 'angry'),
        N('The big screens show his face. Everyone hears the truth.'),
        N('The crowd boos. Fruit and pan de muerto fly!'),
        N('A big bell drops. Bonk! Ernesto is stuck, and cross.'),
        N('Nobody is hurt. Héctor’s photo slips into the water.'),
        M('No! The photo!', 'sad'),
      ],
      [
        notice(
          4,
          'science',
          'a struck bell shakes, and the shaking makes sound',
          '1-PS4-1',
          [
            N('When a bell is hit, it shakes very fast. The shaking makes the sound.'),
            N('(Tap a pan lid with a spoon. Bong! Touch it to stop it.)'),
          ],
          'Learned that a bell makes sound by shaking, and stopped the sound by touching.',
        ),
      ],
    ),
    sc(
      'a7-11-screens-done',
      [
        N('Héctor stumbles. Gold light is all over him.'),
        N('You can see the stage through his arm.'),
        H('It’s my fault for being forgettable.', 'sad'),
      ],
      [
        ask(
          2,
          'sel',
          'being kind to yourself',
          'CASEL: Self-awareness',
          [N('Héctor says it’s his fault. Is it his fault?')],
          [
            opt(
              'No, it isn’t his fault',
              [N('Right. Being forgotten isn’t anyone’s fault.')],
              true,
            ),
            opt('Yes', [N('Héctor did nothing wrong. Being forgotten isn’t his fault.')]),
          ],
          'Talked about not blaming yourself for things that are not your fault.',
        ),
      ],
    ),
    sc(
      'a7-11-blessing',
      [
        N('On a ledge above the city, the family gathers round Miguel.'),
        N('Dawn is close. Héctor is faint, like gold light.'),
        M('If Mamá Coco forgets Héctor, he will fade away. Like Chicharrón.', 'sad'),
        M('I have to go home. I have to help her remember.', 'sad'),
        N('Mamá Imelda holds a marigold petal.'),
        I('What blessing should I give?'),
      ],
      [
        doIt(
          5,
          'literacy',
          'say a kind wish in your own words',
          'ELOF: Language and Communication',
          'edu:say:blessing:kind-wish',
          [N('A blessing is a kind wish. (Make one: “May you be safe.”)')],
          'Made up a kind wish, like a blessing, for someone else.',
        ),
      ],
      [
        ch(
          'free',
          'Say, “Bless him with no rules.”',
          [I('No rules. Yes. That’s what a blessing is.', 'soft'), I('Miguel, go home.')],
          { 'a7-plea': 'free' },
        ),
        ch(
          'both',
          'Say, “Bless Héctor too.”',
          [
            I('Héctor. I never forgave you.', 'sad'),
            I('Miguel, go home. Carry Héctor with you, in your heart.'),
            N('Héctor laughs softly, like someone given a present.'),
          ],
          { 'a7-plea': 'both' },
        ),
        ch(
          'sit',
          'Say nothing. Sit beside Miguel.',
          [
            N('You sit beside Miguel. Your Nubbin sits too.'),
            M('Please, Mamá Imelda. Let me go.'),
            I('Then go, mijo. No rules. None.', 'soft'),
          ],
          { 'a7-plea': 'sit' },
        ),
      ],
    ),
    sc(
      'a7-11-blessing-done',
      [
        N('The petal glows in Miguel’s hand.'),
        H('Go on, chamaco. Go home.', 'soft'),
        N('The sun comes up. Gold petals swirl round you.'),
      ],
      [
        ask(
          2,
          'science',
          'the sun comes up in the morning',
          '1-ESS1-1',
          [N('The sun is coming up. Is it morning or evening?')],
          [
            opt('Morning', [N('Yes! The sun rises in the morning.')], true),
            opt('Evening', [
              N('In the evening the sun goes down. Now it’s coming up, so it’s morning.'),
            ]),
          ],
          'Talked about the sun rising in the morning.',
        ),
      ],
    ),
    sc(
      'a7-11-complete',
      [
        N('The atlas in your pocket goes warm. The petals turn to morning.'),
        N('You are back in the stone room, with Miguel and the white guitar.'),
        N('Your Nubbin is blue again, with a little pink on its ears.'),
        M('Mamá Coco! Come on, quick!'),
      ],
      [
        ask(
          2,
          'art',
          'name a colour',
          null,
          [N('Your Nubbin is blue. What colour are the tips of its ears?')],
          [
            opt('Pink', [N('Yes! Pink at the tips of its ears.')], true),
            opt('Green', [N('Let’s look again. The tips are pink.')]),
          ],
          'Named a colour in a description.',
        ),
      ],
    ),
  ],
  'Every scene of A7-11 has a sprout version. All three plea choices keep their a7-plea flag. Nobody is hurt by the bell.',
);

// ================================================================== A7-12 Remember
// Shared epilogue pieces (sprout wording), mirrored from the original.
const E_START = N('The atlas turns its own page. It is a year later.');
const E_RIBBON = N('Héctor’s photo is on the ofrenda, with the ribbon round it.');
const E_PROMISE = N('Héctor’s photo is on the ofrenda, in the middle.');
const E_COCO: Line[] = [
  N('Mamá Coco died in the spring, with her family round her.', 'soft'),
  N('That means her body stopped working, and it won’t start again.', 'soft'),
  N('Her photo is on the ofrenda now, beside her papá’s.', 'soft'),
  N('Tonight she crosses the marigold bridge to visit, holding his hand.', 'soft'),
];
const E_HOME = N('The page settles. You are back in the Grove, a petal in your pocket.');
const E_BOTH: Line[] = [
  N('Miguel put Héctor’s photo up, and Mamá Imelda’s too.'),
  N('Héctor walks beside Imelda, waving at everyone.'),
  N('Miguel plays in the courtyard. Abuelita dances!'),
];
const E_SIT: Line[] = [
  N('Miguel plays. Then he sits beside his shy little cousin.'),
  N('He waits. After a while, she asks him to play again.', 'soft'),
  N('Mamá Imelda sees it, and is very proud.'),
];
const E_FREE: Line[] = [
  N('The house is full of music. Abuelita is dancing!'),
  N('Mamá Imelda listens, and lets Miguel play as long as he likes.'),
];

/** The complete scene: the one lesson plays after Mamá Coco's death and the comfort of the bridge. */
const completeLesson = (): LessonIn[] => [
  notice(
    5,
    'sel',
    'when someone dies, it is sad, and remembering together helps',
    'CASEL: Self-awareness',
    [
      N('When someone we love dies, it is very sad. Feeling sad is okay.'),
      N('Remembering together helps: a photo, a story, a song.'),
    ],
    'Talked plainly about death, that sadness is okay, and that remembering together helps.',
  ),
];

const Q12: EduQuest = quest(
  'a7-12',
  'Remember',
  {
    'a7-12-s1': {
      goal: 'Run home with Miguel.',
      hint: 'Follow Miguel from the graveyard to the Riveras’ gate.',
    },
    'a7-12-s2': {
      goal: 'Sit with Mamá Coco by the ofrenda.',
      hint: 'Go to her chair. Sit down beside her.',
    },
    'a7-12-s3': {
      goal: 'Listen while Miguel sings to Mamá Coco.',
      hint: 'Stay by Mamá Coco. Listen.',
    },
  },
  [
    sc(
      'a7-12-home',
      [
        N('The graveyard is waking up. Candles have burnt down.'),
        N('At the gate, the whole family is waiting.'),
        EN('Miguel!', 'shock'),
        N('Papá, Mamá, Abuelita and two cousins run to hug him.'),
        N('(Count them in Spanish: uno, dos, tres, cuatro, cinco!)'),
        AB('Where were you? We looked all night.', 'sad'),
        M('I’m sorry. I have to see Mamá Coco. Please.'),
      ],
      [
        doIt(
          4,
          'maths',
          'count to five in Spanish',
          'K.CC.A.1',
          'edu:count:spanish:1-5',
          [N('Uno, dos, tres, cuatro, cinco. Count on your fingers!')],
          'Counted to five in Spanish.',
        ),
      ],
      [
        ch('dante', 'Nod at the door: let him go in.', [
          N('Abuelita looks at the door, and the little room beyond.'),
        ]),
        ch('arm', 'Offer Abuelita your arm.', [
          AB('Hm. Visitors. Always carrying something.', 'soft'),
          N('She takes your arm anyway.'),
        ]),
      ],
    ),
    sc(
      'a7-12-home-done',
      [AB('Go. Go to her. Quickly.', 'soft'), N('Dante gets through the door first.')],
      [
        notice(
          0,
          'literacy',
          'abuelita: grandma, with a little ending that shows love',
          ELOF_LANG,
          [
            N('Abuela is the Spanish word for grandma.'),
            N('Adding -ita makes it small and loving. Abuelita!'),
          ],
          'Learned that abuela means grandma, and that abuelita adds a loving little ending.',
        ),
      ],
    ),
    sc(
      'a7-12-coco',
      [
        N('Mamá Coco is in her chair. She looks at nothing at all.'),
        M('Mamá Coco? It’s me, Miguel.'),
        M('Please remember your papá.', 'sad'),
        N('Your Nubbin climbs into her lap.'),
        N('Her fingers find the ribbon. They find the stitched letters.'),
        CO('H… Hé…', 'think'),
      ],
      [
        ask(
          2,
          'sel',
          'being patient and gentle with someone whose memory is tired',
          'CASEL: Social awareness',
          [N('Mamá Coco finds remembering hard. What is kind?')],
          [
            opt('Be gentle and patient', [N('Yes! Gentle and patient is kind.')], true),
            opt('Hurry her up', [N('Hurrying makes it harder. Gentle and patient is kinder.')]),
          ],
          'Talked about being gentle and patient with someone who finds remembering hard.',
        ),
      ],
    ),
    sc(
      'a7-12-coco-done',
      [
        N('Miguel looks at Mamá Coco’s lips. Then he picks up the guitar.'),
        M('Mamá Coco, your papá wrote you a song.', 'soft'),
      ],
      [
        ask(
          0,
          'literacy',
          'the first sound c, as in Coco',
          'RF.K.2',
          [N('Coco starts with the sound cuh. Which word starts with cuh?')],
          [
            opt('Cat', [N('Yes! Cuh-cat. Cuh-Coco.')], true),
            opt('Hat', [N('Huh-hat begins with huh. Cuh-cat begins with cuh, like Coco.')]),
            opt('Sun', [N('Sss-sun begins with sss. Cuh-cat begins with cuh, like Coco.')]),
          ],
          'Matched the first sound of Coco with “cat”.',
        ),
      ],
    ),
    sc(
      'a7-12-song',
      [
        N('Miguel sings a lullaby, soft and slow, with the guitar.'),
        N('A lullaby is a song for bedtime.'),
        N('The family comes to the doorway, one by one.'),
        N('Mamá Coco’s eyes find Miguel. They shine.'),
        CO('Papá…', 'soft'),
        N('Then she begins to sing along.'),
        N('She opens a drawer, and takes out a folded scrap of paper.'),
        CO('I kept him. All this time.', 'happy'),
      ],
      [
        doIt(
          1,
          'music',
          'hum a lullaby, slowly and softly',
          ELOF_MOTOR,
          'edu:hum:lullaby:slow-soft',
          [N('Hum a lullaby, slowly and softly, like rocking a baby.')],
          'Hummed a lullaby, slowly and softly.',
        ),
      ],
    ),
    sc(
      'a7-12-song-done',
      [
        N('Miguel fits the torn corner into the old photo.'),
        N('It fits exactly. A family of three, all their faces showing.'),
        N('You tie the orange ribbon round the mended photo.'),
        CO('There. Now he won’t get lost.', 'soft'),
      ],
      [
        doIt(
          1,
          'maths',
          'match a piece to the space it fits',
          'K.G.A.1',
          'edu:fit:photo-corner:match',
          [N('Find the torn corner that fits the empty space. Turn it until it fits.')],
          'Matched a torn corner to the space it fits.',
        ),
      ],
    ),
    sc('a7-12-complete', [E_START, E_RIBBON, ...E_COCO, ...E_FREE, E_HOME], completeLesson()),
  ],
  'Every scene of A7-12 has a sprout version. Mamá Coco’s death is said once, plainly, with comfort straight after. Variants use the shared epilogue pieces.',
);

// =================================================================== variants
const VARIANTS: EduScene[] = [
  sc(
    'a7-10-water-promise',
    [
      N('For a while, nobody speaks. They just look at each other.'),
      H('You play like me. I knew it.', 'soft'),
      M('Mamá Coco still asks for you.'),
      N('Héctor’s hand shines gold. He is fading.'),
      N('You say his name, quietly: Héctor.'),
      H('You still have it. The promise.', 'soft'),
    ],
    [
      ask(
        5,
        'sel',
        'ways to remember someone',
        ELOF_SE,
        [N('How can we remember someone we love?')],
        [
          opt(
            'Say their name and tell stories',
            [H('Yes. That’s how people stay close.', 'soft')],
            true,
          ),
          opt('Draw them a picture', [H('That’s a lovely way too.', 'soft')]),
          opt('Sing a song', [H('That works too. Songs carry a lot.', 'soft')]),
        ],
        'Talked about ways to remember someone: names, stories, pictures and songs.',
      ),
    ],
  ),
  sc(
    'a7-12-coco-promise',
    [
      N('Mamá Coco is in her chair. She looks at nothing at all.'),
      M('Mamá Coco? It’s me, Miguel.'),
      M('Please remember your papá.', 'sad'),
      N('You promised. So you take her hand, and say it clearly.'),
      Y('Héctor. Your papá’s name is Héctor.'),
      CO('H… Hé…', 'think'),
    ],
    [
      ask(
        2,
        'sel',
        'being patient and gentle with someone whose memory is tired',
        'CASEL: Social awareness',
        [N('Mamá Coco finds remembering hard. What is kind?')],
        [
          opt('Be gentle and patient', [N('Yes! Gentle and patient is kind.')], true),
          opt('Hurry her up', [N('Hurrying makes it harder. Gentle and patient is kinder.')]),
        ],
        'Talked about being gentle and patient with someone who finds remembering hard.',
      ),
    ],
  ),
  sc(
    'a7-12-song-done-promise',
    [
      N('Miguel fits the torn corner into the old photo.'),
      N('It fits exactly. A family of three, all their faces showing.'),
      N('Mamá Coco looks at you, as if she knows you.'),
      CO('You said his name first. Thank you.', 'soft'),
    ],
    [
      doIt(
        1,
        'maths',
        'match a piece to the space it fits',
        'K.G.A.1',
        'edu:fit:photo-corner:match',
        [N('Find the torn corner that fits the empty space. Turn it until it fits.')],
        'Matched a torn corner to the space it fits.',
      ),
    ],
  ),
  sc('a7-12-complete-both', [E_START, E_RIBBON, ...E_COCO, ...E_BOTH, E_HOME], completeLesson()),
  sc('a7-12-complete-sit', [E_START, E_RIBBON, ...E_COCO, ...E_SIT, E_HOME], completeLesson()),
  sc(
    'a7-12-complete-promise',
    [E_START, E_PROMISE, ...E_COCO, ...E_FREE, E_HOME],
    completeLesson(),
  ),
  sc(
    'a7-12-complete-both-promise',
    [E_START, E_PROMISE, ...E_COCO, ...E_BOTH, E_HOME],
    completeLesson(),
  ),
  sc(
    'a7-12-complete-sit-promise',
    [E_START, E_PROMISE, ...E_COCO, ...E_SIT, E_HOME],
    completeLesson(),
  ),
];

// ================================================================== exports
export const EDU_A07_SPROUT: EduQuest[] = [
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
];

/** Sprout versions of every scene in ATLAS_A07_VARIANTS. */
export const EDU_A07_SPROUT_VARIANTS: EduScene[] = VARIANTS;

export const CHECKS: string[] = [
  'edu:say:word:hola',
  'edu:clap:syllables:cempasuchil',
  'edu:pluck:rubber-band:feel',
  'edu:wait:beside:count-10',
  'edu:blow:feather:float',
  'edu:touch:bones:elbow-knee',
  'edu:clap:pattern:stamp-stamp-rest',
  'edu:point:direction:up-down',
  'edu:count:strings:6',
  'edu:trace:letter:h',
  'edu:cut:paper:snip-pattern',
  'edu:clap:beat:steady',
  'edu:sort:instruments:strings-blow',
  'edu:say:sound-words:boom-pop-fizz',
  'edu:count:glasses:2',
  'edu:count:colours:4',
  'edu:sing:song:slow-soft',
  'edu:say:blessing:kind-wish',
  'edu:count:spanish:1-5',
  'edu:hum:lullaby:slow-soft',
  'edu:fit:photo-corner:match',
];
