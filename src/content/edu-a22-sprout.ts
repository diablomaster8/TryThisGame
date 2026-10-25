/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Atlas page A22, The Candle
 * (a Colombian family and their house, in the coffee country of the Andes).
 *
 * Source: atlas-a22.ts (ATLAS_A22 and A22_VARIANTS). One EduScene per original scene (every step
 * scene, every done scene, every complete scene and every variant), id `sprout:<original id>`, with
 * every choice kept under its original id and `set` flag (`a22-job`), so no `defaultChoice` is
 * needed: every choice on this page is kind and safe. See EDU-STYLE.md. British spelling.
 *
 * Learning angles, from the outline: Colombia on a map (mountains, two seas), food (arepas,
 * buñuelos), family words in Spanish (abuela, tía), the tiple, and families who must leave home,
 * told gently. Around them: counting, shapes, patterns, colours, senses, sound, flames, plants,
 * animals, sleep, rest, feelings and turn-taking.
 *
 * Care notes kept: no war is named. The riders become “trouble, far behind, small as a thread”
 * and never come closer. Pedro’s death is said plainly, once, with comfort straight after (we
 * remember people, and the family stays together). Abuela is frightened, not cruel. No film
 * names, no quotes and no songs. Antonio’s animals are only ones that live in the real world.
 * The words and facts are well established (abuela is Spanish for grandmother, an arepa is a
 * round corn cake, Colombia has sea on two sides, a butterfly begins as a caterpillar).
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
const MI = say('a22-mirabel');
const AB = say('a22-abuela');
const JU = say('a22-julieta');
const AG = say('a22-agustin');
const PE = say('a22-pepa');
const FE = say('a22-felix');
const IS = say('a22-isabela');
const LU = say('a22-luisa');
const DO = say('a22-dolores');
const CA = say('a22-camilo');
const AN = say('a22-antonio');
const BR = say('a22-bruno');
const MA = say('a22-mariano');
const SG = say('a22-senora-guzman');
const NB = say('a22-neighbour');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const words = (t: string) => t.trim().split(/\s+/).length;

/**
 * Keeps narration to two sentences a line and 14 words or fewer, as the sprout band requires: a
 * long narrator line is cut at sentence ends into several lines (the mood stays on the first).
 * Grown-up prompts in brackets and the characters’ own lines are left as written. `map[i]` is the
 * index of the last piece of original line i, so a lesson’s `after` can follow.
 */
const split = (lines: Line[]): { lines: Line[]; map: number[] } => {
  const out: Line[] = [];
  const map: number[] = [];
  for (const l of lines) {
    if (l.who !== 'narrator' || l.text.startsWith('(')) {
      out.push(l);
      map.push(out.length - 1);
      continue;
    }
    const sentences = l.text.split(/(?<=[.!?”])\s+(?=[A-Z“])/);
    const chunks: string[] = [];
    let count = 0;
    for (const sentence of sentences) {
      const last = chunks[chunks.length - 1];
      if (last !== undefined && count < 2 && words(last) + words(sentence) <= 14) {
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
  return {
    id: `sprout:${of}`,
    of,
    band: 'sprout',
    lines: cut.lines,
    ...(extra.choices ? { choices: extra.choices } : {}),
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
): EduQuest => ({
  id: `sprout:${of}`,
  of,
  band: 'sprout',
  title,
  goals,
  scenes,
});

/** A choice with the original id (and `set` flag, if it had one). */
const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice =>
  set ? { id, label, set, then: sp(then) } : { id, label, then: sp(then) };

// ================================================================== A22-1 The Candle’s Story
const Q1: EduQuest = quest(
  'a22-01',
  'The Candle’s Story',
  {
    'a22-01-s1': {
      goal: 'Step into the painted page and hear how the candle began.',
      hint: 'Touch the candle in the window. Then sit at the edge of the painted bed.',
    },
    'a22-01-s2': {
      goal: 'Walk into the valley and meet the family.',
      hint: 'Climb the hill from the market to the house with green shutters.',
    },
  },
  [
    sc(
      'a22-01-story',
      [
        N('A big book opens. It shows tall green mountains.'),
        N('A candle glows in one window. You step into the picture.'),
        N('It is night, long ago. Abuela sits by a little girl in round glasses.'),
        N('Her name is Mirabel.'),
        AB('Come in. Listen too. Mirabel loves this story.'),
        AB('Long ago, we had to leave our home. It was not safe.', 'soft'),
        N('Abuela and Pedro walked for days with three babies.'),
        N('Trouble was far behind them, small as a thread.'),
        AB('At a river, Pedro stayed behind so we could cross.'),
        AB('Pedro died that night. I miss him every day.', 'sad'),
        AB('Then a candle lit, and a warm house grew around us.', 'soft'),
      ],
      [
        doit(
          1,
          'social-studies',
          'find Colombia’s mountains and seas',
          'D2.Geo.2.K-2',
          'edu:point:mountains:colombia',
          [
            N('This is a real place. It is a country called Colombia.'),
            N('It has tall mountains. It has sea on two sides.'),
            N('(Point to the tall green mountains in the picture.)'),
          ],
          'Learned that Colombia is a real country in South America, with tall mountains and sea on two sides.',
        ),
      ],
      {
        choices: [
          ch('listen', 'Keep listening.', [
            N('You sit very still. The little girl holds her blanket tight.'),
          ]),
          ch('pedro', 'Ask about Pedro.', [
            AB('Pedro was kind. He was brave. He was a funny dancer.', 'soft'),
            N('Abuela smiles a little. Her eyes are wet.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-01-story-done',
      [
        AB('Every child in this family gets a gift one day.'),
        AB('Tomorrow is yours, Mirabel.'),
        MI('What will it be?'),
        AB('Sleep, and see.', 'soft'),
        N('Mirabel feels excited and nervous, both at once.'),
      ],
      [
        ask(
          4,
          'sel',
          'naming two feelings at once',
          'ELOF: Social and Emotional Development',
          [N('Mirabel feels excited and nervous. Can we feel two feelings together?')],
          [
            o(
              'Yes, we can',
              [N('Yes! Feelings can mix, like colours. Both are okay to feel.')],
              true,
            ),
            o('No, only one', [
              N('It can feel like one, but often two come together. Both are okay.'),
            ]),
          ],
          'Talked about feeling excited and nervous at the same time.',
        ),
      ],
    ),
    sc(
      'a22-01-casita',
      [
        N('The page turns. Ten years go by. Little Mirabel is grown up now.'),
        N('A market is full of noise. Up the hill is a house.'),
        N('It has white walls and green shutters. The shutters open by themselves!'),
        N('A young woman in round glasses runs down the steps.'),
        MI('Hello! You are the traveller. Abuela said you would come.'),
        N('The floor tiles clack, like a dog wagging its tail.'),
        MI('That is Casita. Casita, be nice. We have a guest.'),
        N('A shutter taps your shoulder, very gently.'),
        MI('I am Mirabel. I do not have a gift. It is fine.'),
      ],
      [
        doit(
          3,
          'literacy',
          'clap the three beats of abuela',
          'RF.K.2',
          'edu:clap:syllables:abuela',
          [
            N('Abuela is Spanish for grandmother. Say it with me: a-bue-la.'),
            N('(Clap each beat: a, bue, la. That is three claps.)'),
          ],
          'Learned that abuela is Spanish for grandmother and clapped its three syllables.',
        ),
      ],
      {
        choices: [
          ch('yes', 'Say you are the traveller.', [
            MI('Great! You are in the blue room. The house likes guests.', 'happy'),
          ]),
          ch('nubbin', 'Point out your Nubbin is travelling too.', [
            MI('Oh, hello! Antonio will love you.', 'happy'),
          ]),
          ch('list', 'Ask what the list is for.', [
            MI('Tonight is Antonio’s gift night. Everything must be just right.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-01-lamp',
      [
        N('Abuela meets you in the courtyard. She is tall and straight.'),
        N('You have a little lamp. Its glass is dark.'),
        AB('Nobody in this house walks in the dark. Come.'),
        N('She lights your lamp from the candle in the window.'),
        N('The flame is gold and steady. It is very kind of her.'),
      ],
      [
        ask(
          4,
          'science',
          'we need light to see',
          '1-PS4-2',
          [N('Your lamp is dark, then lit. What does a lit lamp help us do?')],
          [
            o('See in the dark', [N('Yes! We see things when there is light.')], true),
            o('Hear far away', [
              N('Light helps our eyes, not our ears. We see when there is light.'),
            ]),
            o('Smell flowers', [N('Light helps our eyes. A lamp helps us see in the dark.')]),
          ],
          'Learned that we see things when there is light.',
        ),
      ],
    ),
    sc(
      'a22-01-complete',
      [
        N('Your room is small and blue. It has a window over the valley.'),
        N('Your Nubbin sits on the windowsill and looks out.'),
        N('Downstairs there are three sounds. Laughing, cooking, and shouting about chairs.'),
        N('Somewhere in the wall, something scurries.'),
      ],
      [
        doit(
          2,
          'maths',
          'count three things on fingers',
          'K.CC.B.5',
          'edu:count:sounds:3',
          [
            N('Count the sounds from downstairs on your fingers.'),
            N('(Count with me: laughing is one, cooking is two, shouting is three.)'),
          ],
          'Counted three sounds on fingers.',
        ),
      ],
    ),
  ],
);

// ================================================================== A22-2 The Family
const Q2: EduQuest = quest(
  'a22-02',
  'The Family',
  {
    'a22-02-s1': {
      goal: 'Go down to the market with Mirabel.',
      hint: 'Follow Mirabel down the hill to the square.',
    },
    'a22-02-s2': {
      goal: 'Meet the rest of the family at the house.',
      hint: 'Go back up the hill and say hello in the courtyard.',
    },
    'a22-02-s3': {
      goal: 'Eat in the kitchen with Julieta and Agustín.',
      hint: 'Follow the smell of arepas to the kitchen.',
    },
  },
  [
    sc(
      'a22-02-market',
      [
        N('It is market morning. There are oranges, bread and sacks of coffee beans.'),
        MI('Quick tour! Everyone in my family has a special gift.'),
        N('Luisa walks by. She carries two donkeys, one on each shoulder!'),
        LU('Hi! Can’t stop. The church is crooked.'),
        N('Tía Pepa has a little grey cloud above her head.'),
        PE('What cloud? I have no cloud.'),
        N('Plip, plip, plip! The cloud rains on her onions.'),
        FE('Don’t worry, my love. We have umbrellas!', 'happy'),
      ],
      [
        ask(
          1,
          'social-studies',
          'coffee grows on mountain bushes',
          'D2.Geo.2.K-2',
          [N('Those sacks hold coffee beans. Where does coffee grow here?')],
          [
            o(
              'On bushes in the mountains',
              [N('Yes! Coffee grows on bushes on the mountain slopes in Colombia.')],
              true,
            ),
            o('In the sea', [N('Not in the sea. Coffee grows on bushes on the mountain slopes.')]),
            o('In the sky', [N('Not in the sky. It grows on bushes, high on the mountains.')]),
          ],
          'Learned that coffee grows on bushes in the mountains of Colombia.',
        ),
      ],
      {
        choices: [
          ch('pepa', 'Tell Tía Pepa the cloud is fine.', [
            PE('It is fine, isn’t it?', 'happy'),
            N('The cloud turns into a small, pleased rainbow.'),
          ]),
          ch('felix', 'Ask Félix how he copes.', [
            FE('Umbrellas! And I tell her she is lovely, which is true.', 'happy'),
          ]),
          ch('nubbin', 'Check on your Nubbin.', [
            N('Your Nubbin has found the goat. They are deciding to be friends.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-02-market-done',
      [
        N('Mirabel has ticked three things on her list.'),
        N('She ticks one more. Then she nearly walks into a post.'),
        MI('Next, my cousins. Hold on tight!'),
      ],
      [
        ask(
          1,
          'maths',
          'add one more: 3 and 1 make 4',
          'K.OA.A.2',
          [N('Three ticks, and one more tick. How many ticks now?')],
          [
            o('Four', [N('Yes! Three and one more is four.')], true),
            o('Three', [N('Let’s count: one, two, three, and one more. That is four.')]),
            o('Five', [N('Let’s count again: one, two, three, four. Four ticks.')]),
          ],
          'Added one to three and got four.',
        ),
      ],
    ),
    sc(
      'a22-02-cousins',
      [
        N('In the courtyard, flowers pop up! Pink, red and yellow.'),
        MI('My sister Isabela grows flowers. Everyone loves her.'),
        IS('Hello, guest. How nice.'),
        N('A girl in a pale dress whispers to herself. That is Dolores.'),
        DO('You sneezed in the market. Bless you.'),
        N('A boy turns into Mirabel! Then Félix! Pop!'),
        N('Then he is himself. That is Camilo. He changes faces.'),
        CA('I can do your face. Stand still!'),
      ],
      [
        ask(
          7,
          'sel',
          'what makes you you',
          'CASEL: Self-awareness',
          [N('Camilo can look like anyone. What makes you you?')],
          [
            o(
              'My own smile, laugh and heart',
              [N('Yes! Nobody has your smile, your laugh and your heart. That is you.')],
              true,
            ),
            o('My hair only', [
              N('Hair is just one bit. Your smile, laugh and heart are you too.'),
            ]),
          ],
          'Talked about what makes each person themselves.',
        ),
      ],
      {
        choices: [
          ch('still', 'Stand still.', [
            N('Camilo looks hard. Then you are looking at yourself, a little taller.'),
            CA('I improved you. You are welcome.', 'happy'),
          ]),
          ch('move', 'Don’t stand still.', [CA('Fair. People hate it. Mostly my sisters.')]),
        ],
      },
    ),
    sc(
      'a22-02-kitchen',
      [
        N('In the kitchen, Julieta is cooking arepas. They smell warm and buttery.'),
        JU('You look hungry. Sit down and eat.'),
        N('An arepa is a round corn cake. This one has melted cheese inside.'),
        N('Yum! Your tummy feels full and happy.'),
        AG('Welcome! Don’t mind the bee on my nose.'),
        N('At the end of the house is a tower with a dark door.'),
        N('Nobody looks at it. Everybody talks about chairs.'),
      ],
      [
        ask(
          1,
          'health',
          'wash hands before eating',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('Julieta says, wash your hands before you eat. Why do we do that?')],
          [
            o(
              'To wash away germs',
              [N('Yes! Soap and water wash germs away, so we stay well.')],
              true,
            ),
            o('To make our hands cold', [
              N('Not for cold. We wash to wash germs away and stay well.'),
            ]),
            o('So the arepa jumps', [N('Ha! No. We wash to wash germs away and stay well.')]),
          ],
          'Learned that washing hands with soap and water washes germs away.',
        ),
      ],
      {
        choices: [
          ch('ask', 'Ask about the tower.', [
            MI('That is nobody. Nobody is up there. It is just a room.', 'shock'),
            N('Julieta puts another arepa on your plate. That is an answer too.'),
          ]),
          ch('leave', 'Let it go.', [
            N('You let it go. Mirabel gives you a small, thankful look.'),
          ]),
          ch('nubbin', 'Watch your Nubbin.', [
            N('Your Nubbin looks up at the tower. A small grey face looks back, then hides.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-02-complete',
      [
        N('All day, Mirabel hangs lanterns. She carries chairs. She ties ribbons.'),
        N('Nobody asks her to. She does it anyway.'),
        MI('It is fine. Somebody has to do the not-magic jobs.', 'soft'),
        N('She smiles, but her smile looks small.'),
        N('Your Nubbin leans on her ankle. Lean, lean, lean.'),
      ],
      [
        ask(
          3,
          'literacy',
          'a feeling can hide behind “fine”',
          'RL.1.4',
          [N('Mirabel says, “It is fine.” But her smile looks small. How does she feel?')],
          [
            o('A little sad', [N('Yes. Her words say fine, but her small smile shows sad.')], true),
            o('Very silly', [N('Look at her small smile. She feels a little sad.')]),
            o('Sleepy', [N('Her small smile shows a feeling. She feels a little sad.')]),
          ],
          'Noticed that a face and a voice can show a feeling the words hide.',
        ),
      ],
    ),
  ],
);

// ================================================================== A22-3 Antonio’s Door
const Q3: EduQuest = quest(
  'a22-03',
  'Antonio’s Door',
  {
    'a22-03-s1': {
      goal: 'Find Antonio before his gift night.',
      hint: 'Look in the nursery, and under the bed.',
    },
    'a22-03-s2': {
      goal: 'Walk Antonio up to his door.',
      hint: 'Climb the stairs two steps behind Mirabel and Antonio.',
    },
  },
  [
    sc(
      'a22-03-hiding',
      [
        N('It is evening. Everyone wears their best clothes and holds a candle.'),
        PE('Where is Antonio?', 'shock'),
        N('You find him under the bed. He is five, and he is scared.'),
        AN('What if I do not get a gift?', 'sad'),
        N('Mirabel lies flat on the floor, so her face is by his.'),
        MI('Then you get to be you. That is the best thing in this house.'),
        AN('You did not get one.'),
        MI('No. I did not. And I am still me.', 'soft'),
      ],
      [
        ask(
          7,
          'sel',
          'what helps a scared friend',
          'CASEL: Social awareness',
          [N('Antonio is scared. What helps a scared friend?')],
          [
            o(
              'Staying close and listening',
              [N('Yes! A friend who stays close and listens helps a lot.')],
              true,
            ),
            o('Shouting at him', [
              N('Shouting makes scared feelings bigger. Staying close helps.'),
            ]),
            o('Leaving him alone', [N('Alone can feel worse. Staying close and listening helps.')]),
          ],
          'Talked about how to help a scared friend: stay close and listen.',
        ),
      ],
      {
        choices: [
          ch('hand', 'Hold out your hand.', [
            N('Antonio looks at your hand. Then he takes Mirabel’s. That is just right.'),
          ]),
          ch('nubbin', 'Let your Nubbin go under first.', [
            N('Your Nubbin wriggles under the bed. Antonio giggles before he can stop.'),
          ]),
          ch('wait', 'Wait.', [
            N('Nobody hurries him. A small hand comes out and finds Mirabel’s sleeve.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-03-hiding-done',
      [
        AN('Will you walk me? Both of you?'),
        MI('All the way to the door.', 'soft'),
        N('Antonio’s heart goes thump, thump, thump. Let’s help it slow down.'),
      ],
      [
        doit(
          2,
          'health',
          'slow breaths calm a worried body',
          'CASEL: Self-management',
          'edu:breathe:slowly:3',
          [
            N('(Breathe in slowly through your nose. Breathe out like blowing a candle.)'),
            N('(Do it three times with Antonio: in, out; in, out; in, out.)'),
          ],
          'Practised three slow breaths to calm a worried body.',
        ),
      ],
    ),
    sc(
      'a22-03-door',
      [
        N('The stairs are full of family, holding candles.'),
        N('A new door glows softly. It has no picture yet.'),
        N('Mirabel holds Antonio’s hand. You walk behind.'),
        N('Halfway up, Mirabel slows down. You see a memory.'),
        N('Long ago, a little Mirabel stood at a glowing door. The door went dark.'),
        AB('Whatever happens, you are loved, little one.', 'soft'),
        N('Then it is now. Antonio touches his door, and it glows!'),
        N('A toucan lands on his head. A jaguar and capybaras come out!'),
        AN('I can hear them! They are talking!', 'happy'),
        N('Everyone cheers. Mirabel cheers the loudest, for a long time.'),
      ],
      [
        ask(
          7,
          'science',
          'a bird has wings and a beak',
          'ELOF: Scientific Reasoning',
          [N('Which of these animals has wings and a big beak?')],
          [
            o(
              'The toucan',
              [N('Yes! A toucan has wings to fly and a big beak to eat fruit.')],
              true,
            ),
            o('The jaguar', [N('A jaguar has paws and fur, not wings.')]),
            o('The capybara', [N('A capybara has no wings. The toucan has wings and a big beak.')]),
          ],
          'Told a bird from other animals by its wings and beak.',
        ),
      ],
      {
        choices: [
          ch('cheer', 'Cheer with Mirabel.', [
            N('You cheer with her. When she stops, you stop too.'),
          ]),
          ch('look', 'Look at Mirabel.', [
            N('She catches you looking and smiles hard. Her glasses are steamy.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-03-door-done',
      [
        N('The jaguar sniffs your Nubbin. Sniff, sniff, sniff!'),
        N('Your Nubbin sniffs back. Then it trills. Trrrill!'),
        AN('She says it smells like a garden. Your Nubbin says you snore!', 'happy'),
      ],
      [
        ask(
          1,
          'literacy',
          'first sound: sniff and snore start with sn',
          'RF.K.2',
          [N('Sniff starts with “sn”. Which word starts the same way?')],
          [
            o('Snore', [N('Yes! Snore and sniff both start with sn.')], true),
            o('Toucan', [N('Toucan starts with t. Snore starts with sn, like sniff.')]),
            o('Jaguar', [N('Jaguar starts with j. Snore starts with sn, like sniff.')]),
          ],
          'Matched words that begin with the same first sounds.',
        ),
      ],
    ),
    sc(
      'a22-03-complete',
      [
        N('A photograph is taken on the stairs.'),
        N('Everyone crowds round Antonio. The photographer waves Mirabel away.'),
        N('She ends up at the edge, holding a vase.'),
        N('Your Nubbin sits by her feet. Now Mirabel, the vase and the Nubbin are in the picture.'),
        MI('Thanks.', 'soft'),
      ],
      [
        doit(
          3,
          'maths',
          'count three things at the edge of a picture',
          'K.CC.B.5',
          'edu:count:photo-things:3',
          [
            N('Count the things at the edge of the photo.'),
            N('(Count with me: Mirabel is one, the vase is two, your Nubbin is three.)'),
          ],
          'Counted three things in a picture.',
        ),
      ],
    ),
  ],
);

// ================================================================== A22-4 The Cracks
const Q4: EduQuest = quest(
  'a22-04',
  'The Cracks',
  {
    'a22-04-s1': {
      goal: 'Follow Mirabel through the party.',
      hint: 'Stay close to Mirabel at the edge of the courtyard.',
    },
    'a22-04-s2': {
      goal: 'Help Mirabel show the family the cracks.',
      hint: 'Stand on the landing by the candle with Mirabel.',
    },
  },
  [
    sc(
      'a22-04-party',
      [
        N('The party is loud and bright. There is music and dancing.'),
        N('Luisa holds up the piano, so people can dance under it!'),
        N('Mirabel slips to the quiet edge. You follow.'),
        MI('I am happy for him. I really am.', 'sad'),
        N('A crack runs up the wall by her hand. Crrrack!'),
        N('Cracks race across the tiles, towards the candle.'),
        N('The candle’s flame shakes and shrinks.'),
        MI('Oh no. The candle!', 'shock'),
        N('Mirabel runs. You run after her. Nobody else looks down.'),
      ],
      [
        doit(
          0,
          'music',
          'clap a steady beat',
          'ELOF: Approaches to Learning',
          'edu:clap:beat:party',
          [
            N('A musician plays a tiple. That is a small guitar from Colombia.'),
            N('(Clap a steady beat with the music: one, two, three, four.)'),
          ],
          'Clapped a steady beat and met the tiple, a small Colombian guitar.',
        ),
      ],
      {
        choices: [
          ch('cracks', 'Follow the cracks.', [
            N('You watch the cracks. They race ahead, and they all go one way.'),
          ]),
          ch('mirabel', 'Keep up with Mirabel.', [
            N('You stay at her elbow, through a crowd that keeps smiling.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-04-party-done',
      [
        N('You reach the landing with her. The cracks reach it with you.'),
        N('The floor tiles make a pattern: red, blue, red, blue.'),
      ],
      [
        ask(
          1,
          'maths',
          'a colour pattern: what comes next',
          'ELOF: Mathematics Development',
          [N('Red, blue, red, blue. What colour comes next?')],
          [
            o('Red', [N('Yes! Red, blue, red, blue, red. The pattern repeats.')], true),
            o('Blue', [N('Blue came just before. After blue, the pattern goes back to red.')]),
            o('Yellow', [N('There is no yellow tile. The pattern repeats: red comes next.')]),
          ],
          'Continued a repeating colour pattern.',
        ),
      ],
    ),
    sc(
      'a22-04-cracks',
      [
        MI('Everybody! The house is in danger! Look at the cracks!', 'shock'),
        N('The music stops. Everyone looks up.'),
        N('But the wall is smooth. The tiles are whole. Casita mended them.'),
        AB('Mirabel. What cracks?', 'think'),
        N('Mirabel points. There is nothing there.'),
        AB('Everything is fine. Music, please!', 'happy'),
        N('The music starts again. Nobody looks at Mirabel.'),
      ],
      [
        ask(
          6,
          'sel',
          'how it feels when no one believes you',
          'CASEL: Social awareness',
          [N('Nobody believes Mirabel. How does she feel?')],
          [
            o('Lonely and worried', [N('Yes. A friend who stays beside her helps.')], true),
            o('Very happy', [N('Look at her face. She feels lonely and worried.')]),
            o('Sleepy', [N('She is wide awake, and she feels lonely and worried.')]),
          ],
          'Named the feelings of someone who is not believed: lonely and worried.',
        ),
      ],
      {
        choices: [
          ch('saw', 'Say you saw them too.', [
            N('You say, “I saw them.” Abuela looks at you, polite and closed.'),
            AB('Our guest is tired. It was a long journey.'),
          ]),
          ch('quiet', 'Say nothing, and stay by Mirabel.', [
            N('You stand beside her. It is not much, but she is not alone.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-04-lamp',
      [
        N('Your lamp has a gold flame. Abuela lit it.'),
        N('The flame shakes, just like the candle.'),
        N('Then it goes still, when the candle does.'),
        MI('Yours too! You saw it!', 'shock'),
        N('She squeezes your wrist, then lets go.'),
      ],
      [
        ask(
          2,
          'science',
          'moving air makes a flame wobble',
          'ELOF: Scientific Reasoning',
          [N('In the real world, what makes a candle flame wobble?')],
          [
            o(
              'Moving air, like a breeze',
              [N('Yes! A breeze or a puff makes a flame dance.')],
              true,
            ),
            o('A song', [N('Not a song. Moving air, like a breeze, makes a flame wobble.')]),
            o('A colour', [N('Not a colour. Moving air, like a breeze, makes a flame wobble.')]),
          ],
          'Learned that moving air makes a flame wobble.',
        ),
      ],
    ),
    sc(
      'a22-04-complete',
      [
        N('The party goes on late. Then the house tucks itself in.'),
        N('Mirabel sleeps alone in the nursery now. Antonio’s bed is empty.'),
        MI('Night night, Antonio.', 'soft'),
        N('Your Nubbin hops up and sleeps on her bed.'),
      ],
      [
        ask(
          3,
          'health',
          'sleep helps our bodies rest and grow',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('What does your body do while you sleep?')],
          [
            o('It rests and grows', [N('Yes! Sleep helps your body rest and grow.')], true),
            o('It runs a race', [N('No race! While you sleep, your body rests and grows.')]),
            o('It eats lunch', [
              N('Lunch is for when we are awake. Sleep helps us rest and grow.'),
            ]),
          ],
          'Learned that sleep helps the body rest and grow.',
        ),
      ],
    ),
  ],
);

// ================================================================== A22-5 Abuela’s Prayer
const Q5: EduQuest = quest(
  'a22-05',
  'Abuela’s Prayer',
  {
    'a22-05-s1': {
      goal: 'Follow the light on the landing at midnight.',
      hint: 'Creep out to the banister and stay out of sight.',
    },
    'a22-05-s2': {
      goal: 'Decide how you will help Mirabel: eyes, ears or hands.',
      hint: 'Choose the job you like best. All three help.',
    },
  },
  [
    sc(
      'a22-05-prayer',
      [
        N('Late at night, a soft light shines on the landing.'),
        N('Mirabel hides behind the banister. You hide too.'),
        N('Abuela stands by the candle. A painting hangs beside it.'),
        N('It shows a young man with a kind face. It is Pedro.'),
        AB('Pedro, something is wrong. I can feel it.', 'sad'),
        AB('Tell me what to do, and I will do it.', 'soft'),
        N('The candle does not answer. Abuela goes to bed.'),
        MI('She is scared. I have never seen her scared.', 'sad'),
      ],
      [
        ask(
          7,
          'social-studies',
          'families remember people with pictures and stories',
          'D2.His.2.K-2',
          [N('Abuela keeps a painting of Pedro. How do families remember people?')],
          [
            o(
              'With pictures and stories',
              [N('Yes! Pictures and stories keep people close in our hearts.')],
              true,
            ),
            o('They never talk about them', [
              N('Talking about people we miss helps. Pictures and stories keep them close.'),
            ]),
          ],
          'Talked about how families remember people with pictures and stories.',
        ),
      ],
      {
        choices: [
          ch('sit', 'Sit down next to Mirabel.', [
            N('You sit beside her on the stair. Nobody talks. That helps.'),
          ]),
          ch('painting', 'Look at the painting.', [
            N('Pedro is painted young, with a straw hat in his hands.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-05-plan',
      [
        MI('Nobody else sees the cracks. So I will fix it.', 'think'),
        MI('I cannot do it alone. Will you help me?'),
        MI('Be my eyes? Or my ears? Or my hands?'),
      ],
      [
        ask(
          2,
          'science',
          'ears are for hearing',
          'ELOF: Scientific Reasoning',
          [N('Mirabel says, ears. Which part of you hears sounds?')],
          [
            o('Ears', [N('Yes! Ears hear. Eyes see. Hands touch.')], true),
            o('Eyes', [N('Eyes help us see. Ears help us hear.')]),
            o('Hands', [N('Hands help us touch. Ears help us hear.')]),
          ],
          'Matched ears to hearing, eyes to seeing and hands to touching.',
        ),
      ],
      {
        choices: [
          ch(
            'eyes',
            'Be the eyes: map the cracks with Mirabel.',
            [
              MI('Yes! Two people looking. We start in the morning.', 'happy'),
              N('She gives you a drawing of the whole house.'),
            ],
            { 'a22-job': 'eyes' },
          ),
          ch(
            'ears',
            'Be the ears: make friends with Dolores.',
            [
              MI('Dolores hears everything. Be kind to her.'),
              N('From two floors away, a small voice says, “Thank you.”'),
            ],
            { 'a22-job': 'ears' },
          ),
          ch(
            'hands',
            'Be the hands: help Luisa with her loads.',
            [
              MI('Luisa carries so much. Let’s help her.'),
              N('Outside, something very heavy is put down very gently.'),
            ],
            { 'a22-job': 'hands' },
          ),
        ],
      },
    ),
    sc(
      'a22-05-complete',
      [
        N('Mirabel shakes your hand, very serious.'),
        MI('Partners. Secret partners.'),
        N('Your Nubbin holds out its hand. She shakes that too.'),
        N('You both go to bed. Neither of you can sleep.'),
      ],
      [
        ask(
          3,
          'sel',
          'telling someone you trust about a worry',
          'CASEL: Self-management',
          [N('Mirabel is worried, and she cannot sleep. What could help?')],
          [
            o(
              'Telling someone she trusts',
              [N('Yes! A worry feels smaller when you share it.')],
              true,
            ),
            o('Keeping it all inside', [
              N('Worries get bigger inside. Telling someone you trust helps.'),
            ]),
          ],
          'Talked about sharing a worry with someone you trust.',
        ),
      ],
    ),
  ],
);

// ================================================================== A22-6 Luisa
const Q6: EduQuest = quest(
  'a22-06',
  'Luisa',
  {
    'a22-06-s1': {
      goal: 'Find Luisa at work in the village.',
      hint: 'Look for Luisa down by the river, where the donkeys are.',
    },
    'a22-06-s2': {
      goal: 'Sit with Luisa in the shade.',
      hint: 'Sit on the wall beside her and let your Nubbin do what it likes.',
    },
  },
  [
    sc(
      'a22-06-loads',
      [
        N('Next morning, Mirabel finds Luisa at the river.'),
        N('Luisa carries donkeys back from the river. Two at a time!'),
        LU('Hi. Can’t talk. Donkeys, then the bridge.'),
        MI('Luisa, have you seen cracks in the house?'),
        N('Luisa goes still. Then she laughs too loudly.'),
        LU('I am fine. I am the strong one. Nothing cracks on me.'),
      ],
      [
        ask(
          1,
          'maths',
          'share four things in twos',
          'K.OA.A.2',
          [N('There are four donkeys. Luisa carries two at a time. How many trips?')],
          [
            o('Two trips', [N('Yes! Two donkeys, then two more. Two trips.')], true),
            o('One trip', [
              N('One trip is only two donkeys. Two and two make four, so two trips.'),
            ]),
            o('Four trips', [N('She can carry two at once. Two and two make four: two trips.')]),
          ],
          'Split four into two groups of two.',
        ),
      ],
      {
        choices: [
          ch('carry', 'Offer to carry something.', [
            LU('You?'),
            N('She hands you a small sack of coffee beans. You carry it as if it matters.'),
          ]),
          ch('walk', 'Walk beside her, and don’t ask anything.', [
            N('You walk beside her to the bridge. Her shoulders come down a little.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-06-loads-done',
      [
        N('By noon, the bridge is mended. The church is a bit to the left.'),
        N('Luisa sits down on a wall. She is very tired.'),
      ],
      [
        ask(
          1,
          'health',
          'tired muscles need rest and water',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('Luisa worked hard all morning. What does her body need?')],
          [
            o('Rest and water', [N('Yes! Rest and water help tired muscles feel better.')], true),
            o('More hard work', [
              N('Hard work makes muscles more tired. They need rest and water.'),
            ]),
          ],
          'Learned that tired muscles need rest and water.',
        ),
      ],
    ),
    sc(
      'a22-06-boot',
      [
        N('Your Nubbin climbs onto Luisa’s boot. It falls asleep.'),
        N('Luisa does not move her foot.'),
        LU('It is heavy. For a little thing.', 'soft'),
        LU('If I stop, will everything fall over?', 'sad'),
        MI('You can stop, Luisa. It is okay to rest.'),
        N('Your Nubbin snores, very softly.'),
        LU('Before Tío Bruno went away, he saw something about the house.', 'think'),
        LU('Nobody talks about it. It is still in his room.'),
      ],
      [
        ask(
          7,
          'sel',
          'what to say to a tired friend',
          'CASEL: Relationship skills',
          [N('Luisa is tired, but she is afraid to stop. What can we say?')],
          [
            o(
              'Rest. I will stay with you',
              [N('Yes! A friend who stays gives a good rest.')],
              true,
            ),
            o('Work harder', [N('That would make her more tired. “Rest, I will stay” is kinder.')]),
            o('Go away', [N('That would make her feel alone. “Rest, I will stay” is kinder.')]),
          ],
          'Talked about being kind to a tired friend.',
        ),
      ],
      {
        choices: [
          ch('thank', 'Thank her.', [
            LU('Don’t. I did not say anything.', 'soft'),
            N('But she smiles a little, for the first time today.'),
          ]),
          ch('stay', 'Stay until your Nubbin wakes up.', [
            N('You stay. Luisa rests for a while, and nothing falls over.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-06-complete',
      [
        N('Your Nubbin wakes and yawns. Luisa stretches. Click!'),
        LU('Do not tell anyone I sat down.', 'happy'),
        MI('Bruno’s tower. We have to go up.', 'think'),
        N('The tower stands at the end of the house. It seems not to listen.'),
      ],
      [
        ask(
          0,
          'literacy',
          'rhymes: click and tick',
          'RF.K.2',
          [N('Luisa’s back goes “click”. Which word rhymes with click?')],
          [
            o('Tick', [N('Yes! Click and tick rhyme. Tick, tick, tick!')], true),
            o('Stone', [N('Stone does not rhyme with click. Tick does.')]),
            o('Sleep', [N('Sleep does not rhyme with click. Tick does.')]),
          ],
          'Found a word that rhymes with click.',
        ),
      ],
    ),
  ],
);

// ================================================================== A22-7 Bruno’s Room
const Q7: EduQuest = quest(
  'a22-07',
  'Bruno’s Room',
  {
    'a22-07-s1': {
      goal: 'Get into Bruno’s tower without anyone seeing.',
      hint: 'Wait until the house is busy. Go to the dark door at the end of the landing.',
    },
    'a22-07-s2': {
      goal: 'Climb the sand stairs to the top of the tower.',
      hint: 'Keep climbing. The steps slide. Cross the gap together.',
    },
    'a22-07-s3': {
      goal: 'Fit together the green glass of Bruno’s vision.',
      hint: 'Lay the pieces on the cave floor. They click where they fit.',
    },
  },
  [
    sc(
      'a22-07-door',
      [
        N('You wait until the house is busy. Mirabel leads you to a dark door.'),
        N('A hooded figure is on the door. It glows a faint green.'),
        N('Antonio sits nearby, with a toucan and a coati.'),
        AN('You are going in Tío Bruno’s room!', 'shock'),
        MI('Yes. No. Do not tell.'),
        AN('I will not tell. The coati will not tell.', 'happy'),
        AN('The coati says your Nubbin is brave.', 'happy'),
        AN('And a bit silly.', 'happy'),
      ],
      [
        doit(
          1,
          'art',
          'a picture can tell who lives behind a door',
          'ELOF: Approaches to Learning',
          'edu:draw:door:picture',
          [
            N('Every door in this house has a picture. Antonio’s has animals.'),
            N('(What picture would you put on your own door? Draw it, or say it.)'),
          ],
          'Thought of a picture that says who they are, as the doors in this house do.',
        ),
      ],
      {
        choices: [
          ch('coati', 'Thank the coati.', [
            N('The coati sniffs. Antonio says it means, “Of course.”'),
          ]),
          ch('nubbin', 'Ask Antonio what your Nubbin thinks.', [
            AN('It says it is not scared, because you are here. And a bit scared.', 'soft'),
          ]),
        ],
      },
    ),
    sc(
      'a22-07-door-done',
      [N('Mirabel pushes the door. It opens onto sand!'), N('The door closes softly behind you.')],
      [
        ask(
          1,
          'science',
          'sand is tiny bits of rock',
          'ELOF: Scientific Reasoning',
          [N('Look at all that sand. What is sand made of?')],
          [
            o(
              'Tiny bits of rock',
              [N('Yes! Wind and water wear rocks into tiny grains of sand.')],
              true,
            ),
            o('Sugar', [N('It looks like sugar, but sand is tiny bits of rock.')]),
            o('Snow', [N('It is not snow. Sand is tiny bits of rock.')]),
          ],
          'Learned that sand is made of tiny bits of rock.',
        ),
      ],
    ),
    sc(
      'a22-07-stairs',
      [
        N('Inside, a staircase goes straight up. It is made of sand!'),
        N('The steps slide under your feet. Mirabel climbs and slips and climbs.'),
        N('Your Nubbin flaps its wings. That helps a bit.'),
        N('Halfway up, the stairs crumble. There is a big gap!'),
        MI('Big jump. Totally fine.', 'shock'),
        N('Mirabel looks at you.'),
      ],
      [
        ask(
          4,
          'sel',
          'being brave with a friend beside you',
          'CASEL: Self-management',
          [N('Mirabel feels scared of the big jump. What helps us be brave?')],
          [
            o(
              'A friend beside us',
              [N('Yes! Brave does not mean not scared. A friend beside us helps.')],
              true,
            ),
            o('Doing it all alone', [N('Alone is harder. A friend beside us helps us be brave.')]),
          ],
          'Talked about how a friend beside us helps us be brave.',
        ),
      ],
      {
        choices: [
          ch('jump', 'Jump first, and catch her.', [
            N('You jump and land hard. Mirabel jumps, and you catch her wrist.'),
          ]),
          ch('thread', 'Tie her embroidery thread to the rail.', [
            N('Her bag is full of thread, of course. Twisted twelve times, it holds.'),
          ]),
          ch('nubbin', 'Let your Nubbin flap over first.', [
            N('Your Nubbin flaps over. If it can, you can. You both jump.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-07-stairs-done',
      [
        N('At the top is a cave mouth, glittering and green.'),
        N('Inside, the floor is covered in broken glass.'),
      ],
      [
        ask(
          1,
          'literacy',
          'words that show what we see',
          'RL.1.4',
          [N('The cave is glittering. Which word tells how it looks?')],
          [
            o('Sparkly', [N('Yes! Glittering means sparkly, like stars.')], true),
            o('Sleepy', [N('Sleepy is how we feel. Glittering means sparkly.')]),
          ],
          'Learned that glittering means sparkly.',
        ),
      ],
    ),
    sc(
      'a22-07-glass',
      [
        N('The glass is green and curved, in big broken pieces.'),
        MI('Bruno made visions in glass. This has to be one.'),
        N('You lay the pieces on the floor. Click! They fit together.'),
        N('You see a hand, round glasses, and a girl’s face.'),
        N('Behind the girl, the house. And cracks, everywhere.'),
        MI('That is me. The house is breaking behind me.', 'sad'),
        N('Green light shines on her face. The stairs start to slide.'),
      ],
      [
        ask(
          2,
          'maths',
          'two halves make a whole',
          '1.G.A.3',
          [
            N(
              'The last two big pieces click together. Each is half. How many halves make one whole?',
            ),
          ],
          [
            o('Two halves', [N('Yes! Two halves make one whole.')], true),
            o('One half', [N('One half is only part of it. Two halves make one whole.')]),
          ],
          'Learned that two halves make one whole.',
        ),
      ],
      {
        choices: [
          ch('wrap', 'Help her wrap the pieces.', [
            N('You wrap the glass in your scarf, every piece, as fast as you can.'),
          ]),
          ch('hold', 'Put a hand on her shoulder.', [
            N('She is shaking. You keep your hand there until the floor moves.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-07-complete',
      [
        N('You run. You slide down the sand stairs with the glass held tight.'),
        N('You tumble out onto the landing, covered in sand.'),
        N('Isabela walks past with lilies. She does not see you.'),
        MI('Nobody can know. Nobody.', 'shock'),
        N('Your Nubbin coughs. Out comes a little sand.'),
      ],
      [
        doit(
          0,
          'literacy',
          'tell what happened first, next and last',
          'ELOF: Literacy',
          'edu:order:story:tower-escape',
          [
            N('Let’s put the escape in order. Run, slide, tumble.'),
            N('(Ask: what came first, what came next, and what came last?)'),
          ],
          'Put three story events in order: first, next, last.',
        ),
      ],
    ),
  ],
);

// ================================================================== A22-8 Secrets
const Q8: EduQuest = quest(
  'a22-08',
  'Secrets',
  {
    'a22-08-s1': {
      goal: 'Hide the glass in the nursery.',
      hint: 'Carry the wrapped glass to the nursery without being seen.',
    },
    'a22-08-s2': {
      goal: 'Get the house ready for the dinner.',
      hint: 'Lay the candles down the long table with Mirabel.',
    },
  },
  [
    sc(
      'a22-08-hide',
      [
        N('You carry the glass to the nursery. You hide it under a bed.'),
        AG('Why are you covered in sand?', 'shock'),
        MI('Papá, promise you will not tell.'),
        N('She shows him a piece of glass. A bee lands on his ear.'),
        AG('Bruno’s vision. Oh dear.', 'shock'),
        AG('Mariano’s family comes to dinner tonight.', 'think'),
        AG('We tell Abuela after dinner. Just one night.', 'think'),
      ],
      [
        ask(
          6,
          'sel',
          'tell a trusted grown-up about a worrying secret',
          'CASEL: Responsible decision-making',
          [N('A secret can make us feel worried. What can we do about a worrying secret?')],
          [
            o(
              'Tell a grown-up we trust',
              [N('Yes! A worrying secret should be shared with a grown-up we trust.')],
              true,
            ),
            o('Keep it forever', [
              N('A worrying secret feels heavy. Telling a trusted grown-up helps.'),
            ]),
          ],
          'Learned to tell a trusted grown-up about a secret that causes worry.',
        ),
      ],
      {
        choices: [
          ch('agree', 'Agree with him.', [
            MI('Say it with me. One night.'),
            AG('One night. Thank you.'),
          ]),
          ch('disagree', 'Say Abuela should know now.', [
            AG('Maybe you are right. But not with guests at the gate. Please.'),
          ]),
          ch('mirabel', 'Let Mirabel decide.', [MI('One night. Then everything.', 'sad')]),
        ],
      },
    ),
    sc(
      'a22-08-hide-done',
      [AG('Mirabel, wash the sand off. It is in your ears.'), N('It is in your ears too.')],
      [
        ask(
          1,
          'health',
          'wash with soap and water',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('How do we get sand and dirt off us?')],
          [
            o('Wash with soap and water', [N('Yes! Soap and water make us clean.')], true),
            o('Wipe with a leaf', [N('A leaf is not enough. Soap and water make us clean.')]),
            o('Leave it on', [N('Sand in our ears feels itchy. Soap and water make us clean.')]),
          ],
          'Learned that washing with soap and water gets us clean.',
        ),
      ],
    ),
    sc(
      'a22-08-prep',
      [
        N('Everyone gets ready. There are tables, cloths and flowers.'),
        N('Pepa’s cloud is small and tidy. Félix says it will be lovely.'),
        N('Mirabel lays candles down the long table.'),
        N('She puts five on one side. Then five on the other.'),
        N('On the stairs, Dolores holds her hands over her ears.'),
        N('In the kitchen, Julieta fries buñuelos. They are crispy, round and cheesy.'),
      ],
      [
        ask(
          3,
          'maths',
          'add 5 and 5',
          'K.OA.A.2',
          [N('Five candles on one side, and five on the other. How many candles?')],
          [
            o('Ten', [N('Yes! Five and five make ten. Count them on your fingers.')], true),
            o('Five', [N('That is just one side. Five and five more make ten.')]),
            o('Eight', [N('Count with fingers: five on one hand, five on the other. Ten!')]),
          ],
          'Added five and five to make ten.',
        ),
      ],
      {
        choices: [
          ch('candles', 'Help Mirabel with the candles.', [
            N('You lay candles together, all the way down. Mirabel lets out a long breath.'),
          ]),
          ch('dolores', 'Smile at Dolores.', [
            N('Dolores smiles back, a tight smile. Then her hands go over her ears again.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-08-prep-done',
      [
        N('Ding-dong! The bell rings at the gate.'),
        N('The guests are here.'),
        MI('One night.', 'think'),
      ],
      [
        doit(
          0,
          'science',
          'sounds are made by shaking',
          '1-PS4-1',
          'edu:feel:hum:throat',
          [
            N('A bell makes a sound when it shakes.'),
            N('(Touch your throat and hum. Can you feel it shake?)'),
          ],
          'Felt a hum shake their throat, and learned that sounds are made by shaking.',
        ),
      ],
    ),
    sc(
      'a22-08-complete',
      [
        N('Mariano comes in with his mother. He holds flowers for Isabela.'),
        N('Dolores watches him from the stairs.'),
        SG('What a house. What a family!', 'happy'),
        AB('Welcome. Sit, sit. Tonight is for the family.', 'happy'),
      ],
      [
        ask(
          3,
          'social-studies',
          'welcoming guests is respectful',
          'D2.Civ.8.K-2',
          [N('Guests come to the house. What is a kind way to greet them?')],
          [
            o(
              'Say welcome, and share',
              [N('Yes! A kind welcome and a seat make guests feel at home.')],
              true,
            ),
            o('Ignore them', [N('Ignoring guests feels unkind. A warm welcome is better.')]),
          ],
          'Talked about welcoming guests kindly.',
        ),
      ],
    ),
  ],
);

// ================================================================== A22-9 The Dinner
const Q9: EduQuest = quest(
  'a22-09',
  'The Dinner',
  {
    'a22-09-s1': {
      goal: 'Sit down to dinner with the family and their guests.',
      hint: 'Take your seat at the long table, beside Mirabel.',
    },
    'a22-09-s2': {
      goal: 'Do the job you chose on the landing.',
      hint: 'Eyes: watch the wall. Ears: help Dolores. Hands: hold up the table with Luisa.',
    },
  },
  [
    sc(
      'a22-09-dinner',
      [
        N('The long table is full. Candles, flowers and Julieta’s best dishes.'),
        SG('Mariano has something to ask Isabela.', 'happy'),
        N('Then Dolores whispers on the stairs. Very fast.'),
        DO('A vision. Mirabel. The house. The glass...'),
        PE('Bruno? A vision?', 'shock'),
        N('A little rain falls on the table. Then lots of rain!'),
        N('Isabela’s flowers grow out of the soup.'),
        N('Under the table, the floor begins to crack.'),
      ],
      [
        ask(
          5,
          'science',
          'clouds are made of tiny drops of water',
          'ELOF: Scientific Reasoning',
          [N('Rain falls from a cloud. What is a cloud made of?')],
          [
            o('Tiny drops of water', [N('Yes! A cloud is made of tiny drops of water.')], true),
            o('Cotton', [N('It looks like cotton, but a cloud is tiny drops of water.')]),
            o('Smoke', [N('Not smoke. A cloud is tiny drops of water.')]),
          ],
          'Learned that clouds are made of tiny drops of water.',
        ),
      ],
      {
        choices: [
          ch('mirabel', 'Grab Mirabel’s hand under the table.', [
            N('She grips your hand. Then she lets go. You both have work to do.'),
          ]),
          ch('job', 'Remember your job.', [
            N('You remember the stairs at midnight, and what you promised.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-09-eyes',
      [
        N('You are the eyes. You know where the cracks run.'),
        N('The crack runs for the east wall. That is the wall where the sun comes up.'),
        N('A big dresser full of plates stands there.'),
        N('Señora Guzmán sits right under it, saying the soup is lovely.'),
        MI('The east wall!', 'shock'),
      ],
      [
        ask(
          1,
          'social-studies',
          'the Sun comes up in the east',
          'D2.Geo.2.K-2',
          [N('The east wall is where the sun comes up. Where does the sun come up?')],
          [
            o('In the east', [N('Yes! The sun comes up in the east, every morning.')], true),
            o('In the west', [N('The sun goes down in the west. It comes up in the east.')]),
          ],
          'Learned that the Sun comes up in the east.',
        ),
      ],
      {
        choices: [
          ch('warn', 'Shout to Señora Guzmán to move.', [
            N('You shout, “Move!” She moves. Luisa catches the dresser, plates and all.'),
          ]),
          ch('pull', 'Pull her chair back yourself.', [
            N('You drag her chair back. The dresser tips, and Luisa catches it.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-09-job-done',
      [
        N('Nobody is hurt. One small cloud is left over the soup.'),
        FE('I said umbrellas. Nobody listens to me.'),
        PE('I am calm.', 'sad'),
        N('The cloud over the soup rumbles, very quietly.'),
        N('Everyone checks on everyone else. Are you okay? Yes. Are you okay?'),
      ],
      [
        ask(
          4,
          'sel',
          'check that everyone is safe after a scare',
          'CASEL: Social awareness',
          [N('After a big scare, what is a good thing to ask a friend?')],
          [
            o('Are you okay?', [N('Yes. Asking if a friend is okay shows we care.')], true),
            o('Who is the loudest?', [N('Better to ask, “Are you okay?” That shows we care.')]),
          ],
          'Practised checking on others after a scare.',
        ),
      ],
    ),
    sc(
      'a22-09-complete',
      [
        N('The rain stops. The cracks stop. The room is soaked.'),
        MA('Thank you for dinner.', 'sad'),
        N('The guests leave. Isabela is not smiling now.'),
        AB('Mirabel.', 'angry'),
        N('That is all she says. Mirabel runs out of the room.'),
        N('The candle in the window burns lower.'),
      ],
      [
        ask(
          6,
          'literacy',
          'a character’s voice can hide a different feeling',
          'RL.2.3',
          [N('Abuela says only, “Mirabel.” She sounds cross. Underneath, she feels...')],
          [
            o('Scared', [N('Yes. Cross can be a mask for scared. Abuela is scared.')], true),
            o('Silly', [N('Look again. Behind her cross voice, Abuela is scared.')]),
          ],
          'Noticed that a cross voice can come from a scared feeling.',
        ),
      ],
    ),
  ],
);

// ================================================================== A22-10 Rats in the Walls
const Q10: EduQuest = quest(
  'a22-10',
  'Rats in the Walls',
  {
    'a22-10-s1': {
      goal: 'Find Mirabel after the dinner.',
      hint: 'Go to the nursery.',
    },
    'a22-10-s2': {
      goal: 'Follow the rats through the walls.',
      hint: 'Go along the passage behind the rooms, towards the candle.',
    },
    'a22-10-s3': {
      goal: 'Listen to Bruno.',
      hint: 'Sit at Bruno’s little table and hear him out.',
    },
  },
  [
    sc(
      'a22-10-glass',
      [
        N('Mirabel is on the floor, mending the glass.'),
        MI('I ruined the dinner. I ruined everything.', 'sad'),
        N('A piece of glass is gone. Then another.'),
        N('A little grey rat carries a green shard in its teeth.'),
        MI('Hey! That is ours!'),
        N('The rat slips into a hole in the wall.'),
      ],
      [
        ask(
          3,
          'science',
          'rats come out at night',
          'ELOF: Scientific Reasoning',
          [N('Rats like to come out when it is dark. When is that?')],
          [
            o('At night', [N('Yes! Rats are busy at night, when we are asleep.')], true),
            o('At lunchtime', [N('Lunchtime is bright. Rats like to come out at night.')]),
          ],
          'Learned that rats are mostly active at night.',
        ),
      ],
      {
        choices: [
          ch('follow', 'Follow it.', [
            N('The hole is too small. But a panel beside it swings open.'),
          ]),
          ch('antonio', 'Wake Antonio to ask the rats.', [
            AN('They say they cannot tell. Their boss is nice, and sad.'),
            N('Then a panel beside the hole swings open.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-10-glass-done',
      [N('Behind the panel is a narrow passage.'), N('A candle burns, far ahead.')],
      [
        ask(
          1,
          'maths',
          'near and far',
          'ELOF: Mathematics Development',
          [N('The candle is a tiny dot, a long way off. Is it near or far?')],
          [
            o('Far', [N('Yes! It looks tiny because it is far away.')], true),
            o('Near', [N('A near candle would look big. This one is tiny, so it is far.')]),
          ],
          'Compared near and far.',
        ),
      ],
    ),
    sc(
      'a22-10-walls',
      [
        N('The passage runs behind every room. You hear the family through the wall.'),
        N('Every crack is patched. Some with clay. One with chewed-up bread!'),
        N('In a tiny room, a thin man in a green hood kneels.'),
        N('He fills a crack with a trowel. Rats sit in a row, watching.'),
        BR('The handsome rat says, I will not take your cheese, señor!', 'happy'),
        N('He sees you. He drops his trowel.'),
        BR('Oh. Oh no. Hi.', 'shock'),
        MI('Tío Bruno?', 'shock'),
      ],
      [
        ask(
          4,
          'literacy',
          'rhymes: rat, hat, cat',
          'RF.K.2',
          [N('Rat, rat, rat. Which word rhymes with rat?')],
          [
            o('Hat', [N('Yes! Rat and hat rhyme. Rat, hat, cat, mat!')], true),
            o('Dog', [N('Dog does not rhyme with rat. Hat does.')]),
            o('Sun', [N('Sun does not rhyme with rat. Hat does.')]),
          ],
          'Found a word that rhymes with rat.',
        ),
      ],
      {
        choices: [
          ch('wave', 'Wave.', [
            BR('Hi. Sorry. Hi.'),
            N('He knocks on the wall three times. Then he throws salt over his shoulder.'),
          ]),
          ch('rats', 'Sit down with the rats.', [
            N('You sit at the end of the row. A rat shuffles up to make room.'),
            N('Bruno stares. Then, very slowly, he smiles.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-10-bruno',
      [
        BR('I never left. I went into the walls.', 'sad'),
        BR('I patch the cracks. The rats help.', 'soft'),
        MI('You have been here the whole time?'),
        BR('I could hear everyone. I was at every birthday, from in here.'),
        BR('People thought my visions made bad things happen.'),
        BR('I did not want to hurt anyone. So I hid.', 'soft'),
        N('He looks at Mirabel as if he has missed her very much.'),
      ],
      [
        ask(
          6,
          'sel',
          'naming the feelings of a hidden friend',
          'CASEL: Social awareness',
          [N('Bruno hid in the walls for ten years. How does Bruno feel?')],
          [
            o('Sad and lonely', [N('Yes. He loves his family, and he misses them.')], true),
            o('Very cross', [N('He is not cross. He is sad and lonely, and he loves his family.')]),
          ],
          'Named the feelings of someone who hides: sad and lonely.',
        ),
      ],
      {
        choices: [
          ch('thank', 'Thank him for patching the house.', [
            BR('Nobody has ever...'),
            N('He stops. A rat pats his hand.'),
          ]),
          ch('family', 'Tell him his family misses him.', [
            BR('Pepa? She does?', 'soft'),
            N('He has to look away, at anything.'),
          ]),
          ch('nubbin', 'Let your Nubbin go to him.', [
            N('Your Nubbin sits in Bruno’s cracked cup. Bruno laughs, short and rusty.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-10-complete',
      [
        MI('Tío Bruno, have another vision. Please.', 'think'),
        BR('No. Visions make trouble.', 'shock'),
        MI('They make trouble when we do not look at them.'),
        BR('Okay. I need sand and candles.', 'think'),
        N('He looks at the rats. The rats look back. No help at all.'),
      ],
      [
        ask(
          3,
          'science',
          'wax melts when it is warmed',
          '2-PS1-4',
          [N('A candle burns, and the wax gets soft and runny. What is that called?')],
          [
            o('Melting', [N('Yes! Warm wax melts. When it cools, it goes hard again.')], true),
            o('Freezing', [N('Freezing is when it gets cold and hard. Warm wax melts.')]),
          ],
          'Learned that warm wax melts and goes hard again when it cools.',
        ),
      ],
    ),
  ],
);

// ================================================================== A22-11 Look Again
const Q11: EduQuest = quest(
  'a22-11',
  'Look Again',
  {
    'a22-11-s1': {
      goal: 'Gather sand and candles for Bruno.',
      hint: 'Scoop sand from the passages and bring candles to Bruno’s room.',
    },
    'a22-11-s2': {
      goal: 'Sit in the circle while Bruno looks again.',
      hint: 'Sit inside the sand circle with Mirabel and hold on.',
    },
  },
  [
    sc(
      'a22-11-gather',
      [
        N('Sand is all through the house, from the tower.'),
        N('You scoop it into a bowl.'),
        N('Mirabel brings dinner candles. They are still damp.'),
        BR('Not those. Those have opinions.', 'think'),
        N('Bruno finds his own candles behind a loose brick.'),
        N('He makes a circle of sand. He puts four candles round it.'),
      ],
      [
        doit(
          5,
          'maths',
          'count four candles',
          'K.CC.B.5',
          'edu:count:candles:4',
          [
            N('Count the candles round the circle.'),
            N('(One, two, three, four. Touch each one as you count.)'),
          ],
          'Counted four candles, touching each one.',
        ),
      ],
      {
        choices: [
          ch('circle', 'Help him smooth the circle.', [
            N('You smooth the sand together. His hands are careful and shaky.'),
          ]),
          ch('nubbin', 'Keep your Nubbin out of the sand.', [
            N('You hold your Nubbin. It wants the sand badly, and is very good.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-11-gather-done',
      [BR('Sit inside the circle, both of you.'), BR('Hold on to each other. It gets windy.')],
      [
        ask(
          1,
          'sel',
          'holding a friend’s hand helps when nervous',
          'CASEL: Self-management',
          [N('Mirabel feels nervous. What can help her?')],
          [
            o('Holding a friend’s hand', [N('Yes! A friend’s hand helps nerves settle.')], true),
            o('Running away', [N('Running does not help nerves. A friend’s hand does.')]),
          ],
          'Talked about how a friend’s hand helps when we feel nervous.',
        ),
      ],
    ),
    sc(
      'a22-11-vision',
      [
        N('You sit in the circle with Mirabel. Bruno lights the last candle.'),
        N('The sand lifts. It whirls round you, gold and fast.'),
        N('Bruno’s eyes go green. The whole room goes green.'),
        BR('I see the house. I see the cracks. I see you, Mirabel.', 'think'),
        N('A new picture forms in the sand.'),
        N('Mirabel hugs Isabela. The candle burns bright. No cracks!'),
        N('The sand falls. The green fades.'),
        MI('I have to hug Isabela? Oh dear.', 'shock'),
      ],
      [
        ask(
          8,
          'art',
          'yellow and blue make green',
          'ELOF: Approaches to Learning',
          [N('The room turns green. Which two paints make green?')],
          [
            o('Yellow and blue', [N('Yes! Yellow and blue paint mix to make green.')], true),
            o('Red and blue', [N('Red and blue make purple. Yellow and blue make green.')]),
            o('Red and yellow', [N('Red and yellow make orange. Yellow and blue make green.')]),
          ],
          'Learned that yellow and blue make green.',
        ),
      ],
      {
        choices: [
          ch('laugh', 'Laugh.', [
            N('You laugh. Bruno laughs. Mirabel throws sand at you both, then laughs too.'),
          ]),
          ch('encourage', 'Tell her she can do it.', [
            MI('Can I? She is perfect.', 'sad'),
            N('She stands up anyway, and brushes off the sand.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-11-complete',
      [
        N('Bruno puts the new vision in a piece of green glass.'),
        BR('For proof. Nobody believes the good ones.', 'soft'),
        MI('Come with us.'),
        BR('Not yet.', 'sad'),
        N('He goes back to his crack. The rats listen to his stories.'),
      ],
      [
        ask(
          1,
          'literacy',
          'first sound: glass, green, gold',
          'RF.K.2',
          [N('Glass starts with “g”. Which word starts the same way?')],
          [
            o('Green', [N('Yes! Glass and green both start with g.')], true),
            o('Sand', [N('Sand starts with s. Green starts with g, like glass.')]),
            o('Rat', [N('Rat starts with r. Green starts with g, like glass.')]),
          ],
          'Matched words that begin with the same sound.',
        ),
      ],
    ),
  ],
);

// ================================================================== A22-12 Isabela
const Q12: EduQuest = quest(
  'a22-12',
  'Isabela',
  {
    'a22-12-s1': {
      goal: 'Go with Mirabel to Isabela’s room.',
      hint: 'Climb to the room behind the door covered in flowers.',
    },
    'a22-12-s2': {
      goal: 'Watch Isabela grow something she wants.',
      hint: 'Stay out of the way of the plants.',
    },
    'a22-12-s3': {
      goal: 'Be there when the sisters make up.',
      hint: 'Wait among the flowers.',
    },
  },
  [
    sc(
      'a22-12-room',
      [
        N('Isabela’s room is a garden. Vines on the walls, roses on the ceiling.'),
        N('She sits on a swing, very still and very neat.'),
        IS('Get out.', 'angry'),
        IS('You ruined everything. Mariano is gone.', 'angry'),
        MI('You did not even want to marry him!', 'angry'),
        N('There is a silence, like a dropped glass.'),
        IS('How do you know that?', 'shock'),
        MI('Your roses shut when he talks. Look!'),
        N('Every rose on the wall closes tight, like a fist.'),
        IS('Traitors.', 'angry'),
      ],
      [
        ask(
          1,
          'science',
          'plants need water and light',
          'K-LS1-1',
          [N('All these plants are growing in a sunny room. What do plants need?')],
          [
            o('Water and light', [N('Yes! Plants need water and light to grow.')], true),
            o('Toys and games', [N('Plants do not need toys. They need water and light.')]),
          ],
          'Learned that plants need water and light to grow.',
        ),
      ],
      {
        choices: [
          ch('step', 'Step back and let them talk.', [
            N('You step back, into a soft bank of jasmine. This is theirs to say.'),
          ]),
          ch('nubbin', 'Pick up your Nubbin before it eats a rose.', [
            N('You pick up your Nubbin. Isabela watches, and very nearly laughs.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-12-room-done',
      [
        N('Isabela looks down at her hands.'),
        IS('I was going to marry him for the family.', 'sad'),
        IS('I always do what Abuela wants.', 'sad'),
      ],
      [
        ask(
          2,
          'sel',
          'saying what you really want',
          'CASEL: Self-awareness',
          [N('Isabela always does what other people want. What would help her?')],
          [
            o('Saying what she really wants', [N('Yes! Our own wishes matter too.')], true),
            o('Doing everything perfectly', [
              N('Being perfect is tiring. Saying what she wants helps more.'),
            ]),
          ],
          'Talked about saying what you really want.',
        ),
      ],
    ),
    sc(
      'a22-12-cactus',
      [
        IS('Do you know what it is like to be perfect? Every day?', 'angry'),
        N('She squeezes her fist. A cactus pops up! Spiky, lopsided, wonderful.'),
        IS('That is not pretty.'),
        MI('That is amazing!', 'happy'),
        N('Isabela grows more. A tall tree, a creeper with hooks.'),
        N('She laughs a big, loud laugh. It is her own.'),
        N('Your Nubbin is buried in petals. It looks very happy.'),
      ],
      [
        ask(
          3,
          'science',
          'a cactus lives in hot, dry places',
          'ELOF: Scientific Reasoning',
          [N('A cactus has a fat green body that stores water. Where does a cactus live?')],
          [
            o('In hot, dry places', [N('Yes! A cactus stores water for dry places.')], true),
            o('Under the sea', [
              N('A cactus cannot live under the sea. It lives in hot, dry places.'),
            ]),
          ],
          'Learned that a cactus stores water and lives in hot, dry places.',
        ),
      ],
      {
        choices: [
          ch('dig', 'Dig your Nubbin out.', [
            N('You dig it out. It has a purple flower on its crown, and keeps it.'),
          ]),
          ch('grow', 'Ask her to grow one for your Nubbin.', [
            N('Isabela holds out her hand. A tiny yellow orchid opens in it.'),
            N('She tucks it behind your Nubbin’s crown.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-12-hug',
      [
        N('The sisters stand among the flowers. Both are out of breath.'),
        IS('I am sorry. I was horrible to you.', 'sad'),
        MI('I am sorry too. I was jealous.', 'sad'),
        N('They look at each other. They both laugh.'),
        N('They hug. Flowers pop out of Isabela’s hair.'),
        N('The candle in the window glows bright. The cracks close.'),
        MI('It is working!', 'happy'),
      ],
      [
        ask(
          6,
          'sel',
          'saying sorry and making up',
          'CASEL: Relationship skills',
          [N('The sisters said sorry, and then hugged. What did that do?')],
          [
            o(
              'It made them friends again',
              [N('Yes! Saying sorry helps to mend a friendship.')],
              true,
            ),
            o('It made them cross', [N('Sorry mends hurts. It made them friends again.')]),
          ],
          'Talked about how saying sorry can mend a friendship.',
        ),
      ],
    ),
    sc(
      'a22-12-complete',
      [
        N('Mirabel draws your Nubbin in its flower.'),
        N(
          'Then she stitches a little skirt or waistcoat. It has butterflies, flowers and a candle.',
        ),
        MI('Every Madrigal has their gift stitched. This one is for being you.', 'soft'),
        N('It fits, more or less. Your Nubbin will not take it off.'),
      ],
      [
        ask(
          1,
          'maths',
          'a butterfly’s two sides match',
          'ELOF: Mathematics Development',
          [N('Look at a stitched butterfly’s two wings. Do the two sides match?')],
          [
            o(
              'Yes, they match',
              [N('Yes! Both sides are the same. That is called symmetry.')],
              true,
            ),
            o('No, they are different', [
              N('Look again. Both wings match. That is called symmetry.'),
            ]),
          ],
          'Learned that a butterfly’s two sides match.',
        ),
      ],
    ),
  ],
);

// ================================================================== A22-13 The Breaking
const Q13: EduQuest = quest(
  'a22-13',
  'The Breaking',
  {
    'a22-13-s1': {
      goal: 'Go down to the courtyard with the sisters.',
      hint: 'Follow Mirabel and Isabela downstairs.',
    },
    'a22-13-s2': {
      goal: 'Get out of the house.',
      hint: 'Run for the front door with the family.',
    },
    'a22-13-s3': {
      goal: 'Find Mirabel in the ruins.',
      hint: 'Climb carefully into the rubble where the courtyard was.',
    },
  },
  [
    sc(
      'a22-13-confront',
      [
        N('You come down together, laughing, with flowers in your hair.'),
        N('Abuela stands by the candle.'),
        AB('What have you done?', 'angry'),
        AB('Everything was fine until you went looking for problems.', 'angry'),
        MI('The cracks are not because of me!', 'angry'),
        N('Everyone goes quiet.'),
        MI('Nobody can ever be good enough for you. Not even me.', 'sad'),
      ],
      [
        ask(
          6,
          'literacy',
          'feeling words: hurt and sad',
          'RL.1.4',
          [N('Mirabel says, “Not even me,” in a small voice. How does she feel?')],
          [
            o('Hurt and sad', [N('Yes. A small voice often shows a hurt feeling.')], true),
            o('Excited', [N('Listen to her small voice. She feels hurt and sad.')]),
          ],
          'Used feeling words to describe how a character feels.',
        ),
      ],
      {
        choices: [
          ch('step', 'Step in beside Mirabel.', [
            N('You step in beside her. Abuela does not look at you. But you are there.'),
          ]),
          ch('back', 'Stay back.', [
            N('You stay back. It is not your family. Your hands are fists anyway.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-13-split',
      [
        N('The tiles crack. A big crack runs down the courtyard.'),
        N('The walls groan.'),
        N('Luisa looks at her hands.'),
        LU('I cannot lift it. My gift is gone.', 'shock'),
        N('Isabela’s flowers wilt.'),
        AB('Out! Everyone out!', 'shock'),
        N('Everyone runs. Mirabel runs up the stairs, to the candle.'),
      ],
      [
        notice(
          5,
          'health',
          'in danger, walk fast to a safe place and stay together',
          'CASEL: Responsible decision-making',
          [
            N('When there is danger, grown-ups say, “Out!”'),
            N('Go fast to a safe place outside. Stay together. Do not go back for things.'),
          ],
          'Learned the safety rule: go to a safe place, stay together and do not go back inside.',
        ),
      ],
      {
        choices: [
          ch('after', 'Go after her.', [
            N('You get halfway up. The tiles roll you back down, and out of the door.'),
          ]),
          ch('others', 'Get the others out.', [
            N('You take Antonio’s hand, and Pepa’s, and run them out of the door.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-13-split-done',
      [
        N('You land in the street with the family round you.'),
        N('You are all on your knees. Behind you, the walls begin to lean.'),
        N('Ten of the family are out. Mirabel is still inside.'),
      ],
      [
        doit(
          2,
          'maths',
          'count ten on fingers',
          'K.CC.B.5',
          'edu:count:family:10',
          [
            N('Let’s count the family in the street.'),
            N('(Count on your fingers: ten people, from one to ten.)'),
          ],
          'Counted ten people on fingers.',
        ),
      ],
    ),
    sc(
      'a22-13-ruins',
      [
        N('The house comes down, slow and quiet, like something lying down.'),
        N('Dust floats everywhere.'),
        N('Mirabel sits in the middle. She holds the candle.'),
        N('The flame shrinks. Then it goes out.'),
        MI('No.', 'sad'),
        N('Your Nubbin climbs into her lap.'),
      ],
      [
        ask(
          5,
          'sel',
          'sitting beside someone who is sad',
          'CASEL: Social awareness',
          [N('Mirabel is very sad. What can you do?')],
          [
            o('Sit beside her', [N('Yes! Sitting close, without hurrying her, helps.')], true),
            o('Tell her to cheer up', [
              N('“Cheer up” can feel hard. Sitting beside her helps more.'),
            ]),
            o('Walk away', [N('Walking away leaves her alone. Sitting beside her helps.')]),
          ],
          'Talked about staying beside someone who is sad.',
        ),
      ],
      {
        choices: [
          ch('sit', 'Sit down next to her.', [
            N('You sit beside her in the dust. You do not say anything.'),
          ]),
          ch('hand', 'Reach for her hand.', [
            N('She lets you hold it for a moment. Her hand is full of candle wax.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-13-lamp',
      [
        N('A candle flame needs air to burn.'),
        N('At your belt, the gold flame goes out too.'),
        N('Your lamp is dark. The whole valley is dark.'),
        N('Then Mirabel jumps up and runs away.'),
      ],
      [
        ask(
          0,
          'science',
          'a flame goes out without air',
          'ELOF: Scientific Reasoning',
          [N('If a grown-up covers a flame with a jar, what happens?')],
          [
            o('It goes out', [N('Yes! With no air, a flame goes out.')], true),
            o('It gets bigger', [N('No. Without air, a flame goes out.')]),
          ],
          'Learned that a flame needs air and goes out without it.',
        ),
      ],
    ),
    sc(
      'a22-13-complete',
      [
        N('The family stands in the ruins. Julieta holds Luisa.'),
        N('Pepa has no cloud. Isabela has no flowers.'),
        AB('Where is she?', 'sad'),
        N('Antonio’s toucan whispers in his ear.'),
        AN('She went to the river.', 'sad'),
      ],
      [
        ask(
          4,
          'social-studies',
          'most rivers run to the sea',
          'D2.Geo.2.K-2',
          [N('Rivers start in the mountains and run downhill. Where do most rivers end?')],
          [
            o('In the sea', [N('Yes! Most rivers run downhill and end in the sea.')], true),
            o('In the sky', [N('Not the sky. Most rivers run downhill, all the way to the sea.')]),
          ],
          'Learned that most rivers run downhill from the mountains to the sea.',
        ),
      ],
    ),
  ],
);

// ================================================================== A22-14 The River
const Q14: EduQuest = quest(
  'a22-14',
  'The River',
  {
    'a22-14-s1': {
      goal: 'Follow Mirabel to the river.',
      hint: 'Walk down the valley past the last houses, to where the mountains open.',
    },
    'a22-14-s2': {
      goal: 'Listen to Abuela at the river.',
      hint: 'Stay still, and listen.',
    },
  },
  [
    sc(
      'a22-14-river',
      [
        N('The river is far down the valley, where the mountains open.'),
        N('The water runs fast over stones. The sky is getting light.'),
        N('Mirabel sits on a rock by the water. Her glasses are in her lap.'),
        N('You sit down too. Your Nubbin sits between you.'),
        N('Nobody speaks. The water speaks enough.'),
        N('Footsteps on the stones. It is Abuela, out of breath.'),
      ],
      [
        ask(
          1,
          'science',
          'water is a liquid that flows',
          '2-ESS2-3',
          [N('The river water splashes and flows. Is water a liquid or a solid?')],
          [
            o(
              'A liquid',
              [N('Yes! Water flows. When it freezes, it turns to ice.')],
              true,
            ),
            o('A solid', [N('Water flows, so it is a liquid. Only ice is solid.')]),
          ],
          'Learned that water is a liquid that flows, and that ice is solid water.',
        ),
      ],
      {
        choices: [
          ch('go', 'Get up to leave them alone.', [
            N('You stand to go. Abuela shakes her head, a little. You sit again, further off.'),
          ]),
          ch('stay', 'Stay where you are.', [N('You stay. Abuela looks at you and nods.')]),
        ],
      },
    ),
    sc(
      'a22-14-pedro',
      [
        N('Abuela sits beside Mirabel, slowly, on the cold rock.'),
        AB('This is the river.', 'soft'),
        AB('Pedro told me to go. He stayed on the bank so we could cross.', 'sad'),
        AB('I waited all night. He did not come.', 'sad'),
        AB('Pedro died. His body stopped working. I miss him every day.', 'sad'),
        AB('I was so afraid to lose anyone else. I held on too tight.', 'sad'),
        AB('I am sorry, Mirabel.', 'sad'),
        N('Yellow butterflies rise from the water. Dozens, then hundreds.'),
        MI('You kept us together. You are the miracle, Abuela.', 'soft'),
        N('Abuela hugs her. She laughs and cries at once.'),
      ],
      [
        ask(
          9,
          'sel',
          'what helps when we miss someone',
          'CASEL: Self-awareness',
          [N('Abuela misses Pedro, and she feels sad. What helps when we miss someone?')],
          [
            o(
              'Talking about them, and a hug',
              [N('Yes. Talking and hugging help us carry a sad feeling.')],
              true,
            ),
            o('Pretending it did not happen', [
              N('Hiding sad feelings makes them heavy. Talking and hugging help.'),
            ]),
          ],
          'Talked about what helps when we miss someone: talking about them and hugging.',
        ),
      ],
    ),
    sc(
      'a22-14-pedro-done',
      [
        N('The butterflies land on the rock, on Mirabel’s skirt, on your Nubbin.'),
        N('Then footsteps. A thin man in a green hood stands on the bank.'),
        BR('Mamá.', 'shock'),
        N('Abuela goes to him. She holds him for a long time.'),
      ],
      [
        ask(
          3,
          'science',
          'a butterfly begins as a caterpillar',
          'ELOF: Scientific Reasoning',
          [N('A butterfly was once a caterpillar. What did it look like first?')],
          [
            o(
              'A caterpillar',
              [N('Yes! First a caterpillar, then a chrysalis, then a butterfly.')],
              true,
            ),
            o('A bird', [N('Not a bird. A butterfly begins as a caterpillar.')]),
          ],
          'Learned that a butterfly begins as a caterpillar.',
        ),
      ],
    ),
    sc(
      'a22-14-complete',
      [
        N('The sun comes over the mountains. You walk back up the valley.'),
        MI('Everything is gone. The house. The gifts.', 'sad'),
        AB('Not everything.', 'soft'),
        N('The whole village waits at the ruins. Everyone has brought something.'),
      ],
      [
        ask(
          3,
          'literacy',
          'opposites: everything and nothing',
          'ELOF: Literacy',
          [N('Mirabel says, “everything.” What is the opposite of everything?')],
          [
            o('Nothing', [N('Yes! Everything and nothing are opposites.')], true),
            o('Something', [N('Something is a little. The opposite of everything is nothing.')]),
          ],
          'Found the opposite of a word: everything and nothing.',
        ),
      ],
    ),
  ],
);

// ================================================================== A22-15 Building Casita
const Q15: EduQuest = quest(
  'a22-15',
  'Building Casita',
  {
    'a22-15-s1': {
      goal: 'Join the village at the ruins.',
      hint: 'Talk to the neighbours at the ruins and pick up a tool.',
    },
    'a22-15-s2': {
      goal: 'Help rebuild the house, the way only you can.',
      hint: 'Eyes: use Mirabel’s drawing. Ears: walk the ruins with Dolores. Hands: carry for Luisa.',
    },
  },
  [
    sc(
      'a22-15-village',
      [
        N('Shovels, wheelbarrows, ladders and pots of whitewash.'),
        N('A woman brings a basket of bread.'),
        NB('The family helped every one of us. Now we help you.'),
        N('Señora Guzmán rolls up her sleeves. Mariano stands by Dolores.'),
        N('There are no gifts now. Luisa cannot lift a donkey.'),
        LU('I do not know what to do with my hands.', 'think'),
        N('Julieta hands round arepas. They cannot heal now, but they are still good.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'neighbours help each other',
          'D2.Civ.8.K-2',
          [N('The neighbours come to help the Madrigals. Why do they help?')],
          [
            o(
              'The Madrigals helped them first',
              [N('Yes! Good neighbours help each other.')],
              true,
            ),
            o('Because they have to', [
              N('They choose to. Good neighbours help each other, because they care.'),
            ]),
          ],
          'Talked about neighbours who help each other.',
        ),
      ],
      {
        choices: [
          ch('shovel', 'Pick up a shovel.', [
            N('You pick up a shovel. A man you do not know nods at you.'),
          ]),
          ch('ask', 'Ask where to start.', [
            AB('Anywhere. Start anywhere. Everybody else has.', 'soft'),
          ]),
        ],
      },
    ),
    sc(
      'a22-15-eyes',
      [
        N('Mirabel unfolds her drawing of the house.'),
        MI('Every crack we found. This is where it was weak.', 'think'),
        N('You show the builders each weak wall.'),
        N('Where it cracked, they build it thicker.'),
        NB('Who drew this? It is good.'),
        N('Mirabel says, “We did.”'),
      ],
      [
        ask(
          3,
          'maths',
          'compare thick and thin',
          'K.MD.A.2',
          [N('The builders make the weak walls thicker. Which wall is thicker?')],
          [
            o('The wide, strong wall', [N('Yes! The thicker wall is wider, and stronger.')], true),
            o('The thin wall', [
              N('The thin wall is not as wide. The thicker wall is the strong one.'),
            ]),
          ],
          'Compared thick and thin.',
        ),
      ],
      {
        choices: [
          ch('mirabel', 'Say Mirabel did.', [
            N('You say, “She did. I held the pencil.” Mirabel goes red.'),
          ]),
          ch('both', 'Say you did it together.', [
            N('You say, “Both of us.” The builder writes both your names on the beam.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-15-job-done',
      [N('By evening the walls are up to your shoulders.'), N('Everyone is thirsty and tired.')],
      [
        ask(
          1,
          'health',
          'drink water and rest after hard work',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('After hard work in the sun, what does your body need?')],
          [
            o('Water and a rest', [N('Yes! Water and a rest in the shade help your body.')], true),
            o('More work, no drink', [N('That is too tiring. Water and a rest help your body.')]),
          ],
          'Learned to drink water and rest after hard work.',
        ),
      ],
    ),
    sc(
      'a22-15-complete',
      [
        N('It takes days. Walls, then roof, then shutters.'),
        N('Then tiles for the courtyard, one by one, in the old pattern.'),
        N('Bruno puts on a play for the children, with his rats.'),
        N('Abuela works beside everyone. She is not good with a trowel. She does not mind.'),
        N('Abuela plasters a corner. The corner slides off.'),
        AB('It is resting.'),
        N('Tío Félix holds it up until it dries.'),
        N('Now there is a house. It is plain, white and new. Every hand built it.'),
      ],
      [
        ask(
          7,
          'sel',
          'it is fine to be a beginner',
          'CASEL: Self-awareness',
          [N('Abuela is not good with a trowel, and she does not mind. What can we learn?')],
          [
            o(
              'It is fine to be a beginner',
              [N('Yes! Everyone starts as a beginner. Trying is what counts.')],
              true,
            ),
            o('Never try new things', [N('Trying is how we learn. It is fine to be a beginner.')]),
          ],
          'Talked about being fine with being a beginner.',
        ),
      ],
    ),
  ],
);

// ================================================================== A22-16 The Doorknob
const Q16: EduQuest = quest(
  'a22-16',
  'The Doorknob',
  {
    'a22-16-s1': {
      goal: 'Watch Mirabel finish the house.',
      hint: 'Stand with the family by the new front door.',
    },
    'a22-16-s2': {
      goal: 'Stand in the family photograph.',
      hint: 'Stand on the steps with the family when the photographer calls.',
    },
  },
  [
    sc(
      'a22-16-doorknob',
      [
        N('The front door is the last thing. There is a hole where the handle goes.'),
        JU('We made you something, Mirabel. All of us.', 'soft'),
        N('It is a doorknob, carved and painted. It has a butterfly and her name.'),
        AB('You brought us back. You put it in.', 'soft'),
        MI('Me?', 'shock'),
        N('Mirabel fits it in the hole. She turns it.'),
        N('Light runs across the door and up the walls. Shutters fly open!'),
        N('A candle lights by itself in the window. Casita is awake!'),
        N('Luisa lifts a donkey, then puts it down gently. Pepa’s cloud is a rainbow.'),
      ],
      [
        ask(
          2,
          'literacy',
          'first sound: Mirabel and mountain',
          'RF.K.2',
          [N('Mirabel starts with “mmm”. Which word starts the same way?')],
          [
            o('Mountain', [N('Yes! Mirabel and mountain both start with mmm.')], true),
            o('Donkey', [N('Donkey starts with d. Mountain starts with mmm, like Mirabel.')]),
            o('Candle', [N('Candle starts with c. Mountain starts with mmm, like Mirabel.')]),
          ],
          'Matched words that begin with the same first sound.',
        ),
      ],
      {
        choices: [
          ch('cheer', 'Cheer.', [N('You cheer. Mirabel cheers loudest, and she means every bit.')]),
          ch('nubbin', 'Watch your Nubbin.', [
            N('Your Nubbin runs in circles, chased by happy tiles.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-16-stub',
      [
        N('Mirabel lights a candle stub from the new flame.'),
        MI('For you. To take home.', 'soft'),
        N('You hold your dark lamp to it. The flame lights your glass again.'),
        MI('It might not stay lit, where you are going.', 'soft'),
        MI('Some lights you have to wait for. Keep the stub anyway.', 'soft'),
      ],
      [
        ask(
          4,
          'sel',
          'waiting patiently',
          'CASEL: Self-management',
          [N('It is hard to wait for something we want. What can help us wait?')],
          [
            o(
              'Doing something we like',
              [N('Yes! Singing, drawing or playing helps the time pass.')],
              true,
            ),
            o('Shouting “now!”', [
              N('Shouting makes waiting harder. Doing something we like helps.'),
            ]),
          ],
          'Talked about ways to wait patiently.',
        ),
      ],
    ),
    sc(
      'a22-16-photo',
      [
        N('The photographer sets up his camera under a black cloth.'),
        N('The whole family crowds onto the stairs. Bruno is at the front, holding Antonio.'),
        MI('Wait! You too. Get in!', 'happy'),
        N('You stand at the edge beside Mirabel. She pulls you in close.'),
        N('Your Nubbin sits in Mirabel’s stitched skirt. A butterfly lands on its crown.'),
        NB('Everybody, very still!'),
      ],
      [
        ask(
          3,
          'science',
          'we see when there is light',
          '1-PS4-2',
          [N('A camera needs light to make a picture. What do your eyes need?')],
          [
            o('Light', [N('Yes! Eyes and cameras both need light.')], true),
            o('Quiet', [N('Quiet is nice, but eyes need light to see.')]),
          ],
          'Learned that eyes and cameras need light.',
        ),
      ],
      {
        choices: [
          ch('smile', 'Smile.', [N('You smile. Mirabel does not need to be told.')]),
          ch('look', 'Look at Mirabel instead.', [
            N('You look at Mirabel. She looks at you. The photo catches you both laughing.'),
          ]),
        ],
      },
    ),
    sc(
      'a22-16-complete',
      [
        N('In the morning, the page grows thin and painted at the edges.'),
        N('The family walks you to the gate. The house waves its shutters.'),
        N('Behind them, three Madrigals still argue about chairs.'),
        AB('You are welcome at this table. Always.', 'soft'),
        N('Antonio’s jaguar sniffs your Nubbin one last time.'),
        AN('It says it will come back. It says you have to bring it.', 'happy'),
        N('Then you are home in the Grove, with a candle stub and a doorknob.'),
      ],
      [
        ask(
          6,
          'social-studies',
          'Colombia is a country in South America',
          'D2.Geo.2.K-2',
          [N('Where did you travel today?')],
          [
            o(
              'Colombia, in South America',
              [N('Yes! Colombia has tall mountains and sea on two sides.')],
              true,
            ),
            o('The moon', [N('Not the moon! You visited Colombia, in South America.')]),
          ],
          'Named Colombia as a country in South America.',
        ),
      ],
    ),
  ],
);

// ================================================================== variants
/**
 * Sprout versions of every scene in A22_VARIANTS: the lamp (A22-1, 4, 13, 16), Hazel’s margin
 * note, the job-path scenes (ears and hands in A22-8, 9, 15 and 16), the kept-stone scene and the
 * two Grove keepsake scenes. Each keeps the domain of the scene it replaces, so lessons never
 * repeat a domain in a row whichever variant plays.
 */
export const EDU_A22_SPROUT_VARIANTS: EduScene[] = [
  // ---------------------------------------------------------------- A22-1, the lamp
  sc(
    'a22-01-lamp-flicker',
    [
      N('Abuela meets you in the courtyard. She is tall and straight.'),
      N('Your lamp has a thin blue flame. It shivers.'),
      AB('That flame is too thin to be on its own. Come.'),
      N('She tips her candle to your wick.'),
      N('Now two flames lean together, one gold and one blue.'),
    ],
    [
      notice(
        4,
        'science',
        'two flames give more light than one',
        '1-PS4-2',
        [N('Two flames make more light than one flame. Look how bright it is now!')],
        'Learned that two flames give more light than one.',
      ),
    ],
  ),
  sc(
    'a22-01-lamp-lit',
    [
      N('Abuela meets you in the courtyard. She is tall and straight.'),
      N('Your lamp is lit already. The flame stands up straight and steady.'),
      AB('Someone looks after that one well. Good.'),
      N('She nods at it, the way you nod to a neighbour.'),
    ],
    [
      ask(
        3,
        'science',
        'a flame is warm',
        'ELOF: Scientific Reasoning',
        [N('Is the flame in your lamp warm or cold?')],
        [
          o('Warm', [N('Yes! Flames are hot. Never touch one.')], true),
          o('Cold', [N('Flames are hot, not cold. Never touch one.')]),
        ],
        'Learned that a flame is hot and must never be touched.',
      ),
    ],
  ),
  sc(
    'a22-01-lamp-warm',
    [
      N('Abuela meets you in the courtyard. She is tall and straight.'),
      N('Your lamp burns a deep red-gold. The glass is warm.'),
      AB('That one burns as if somebody is glad of it.', 'soft'),
      N('She holds her hands to it, as to a fire. Then she remembers herself.'),
    ],
    [
      notice(
        3,
        'science',
        'flames give heat',
        'ELOF: Scientific Reasoning',
        [
          N('A flame gives light, and it gives heat. That is why the glass is warm.'),
          N('Never touch a flame, or hot glass. Leave candles to grown-ups.'),
        ],
        'Learned that flames give heat as well as light.',
      ),
    ],
  ),

  // ---------------------------------------------------------------- A22-4, the lamp
  sc(
    'a22-04-lamp-flicker',
    [
      N('Your lamp has two flames, one gold and one blue.'),
      N('Both of them shake, like the candle.'),
      N('Then they go still, all together.'),
      MI('Yours too! You saw it!', 'shock'),
      N('She squeezes your wrist, then lets go.'),
    ],
    [
      notice(
        2,
        'science',
        'a flame gives light and heat',
        'ELOF: Scientific Reasoning',
        [N('A flame gives light, and a flame gives heat. It does both at once.')],
        'Learned that a flame gives both light and heat.',
      ),
    ],
  ),
  sc(
    'a22-04-lamp-lit',
    [
      N('Your lamp burns steady. It did not move at all.'),
      N('Mirabel stares at it. Then at the candle. Then at it again.'),
      MI('Yours did not. Something is wrong with ours.', 'think'),
      N('She squeezes your wrist, then lets go.'),
    ],
    [
      ask(
        1,
        'science',
        'still air keeps a flame steady',
        'ELOF: Scientific Reasoning',
        [N('When the air is still, does a flame wobble?')],
        [
          o(
            'No, it stands still',
            [N('Yes! A flame wobbles when air moves. In still air, it stands tall.')],
            true,
          ),
          o('Yes, a lot', [N('A flame wobbles when air moves. In still air, it stands tall.')]),
        ],
        'Learned that a flame stands steady in still air.',
      ),
    ],
  ),
  sc(
    'a22-04-lamp-warm',
    [
      N('Your lamp burns a red-gold. It is warm against your hip.'),
      N('It did not move at all.'),
      MI('Yours did not. Something is wrong with ours.', 'think'),
      N('She squeezes your wrist, then lets go.'),
    ],
    [
      notice(
        1,
        'science',
        'a flame warms things near it',
        'ELOF: Scientific Reasoning',
        [N('A flame warms the air and glass around it. That is why your lamp feels warm.')],
        'Learned that a flame warms the things near it.',
      ),
    ],
  ),

  // ---------------------------------------------------------------- A22-8, ears
  sc(
    'a22-08-prep-done-ears',
    [
      N('Dolores catches your sleeve on the stairs.'),
      DO('I heard it all. In the nursery. The glass.', 'sad'),
      DO('I hear everything. I cannot keep things in.', 'sad'),
      DO('Please stay by me tonight.'),
      N('Ding-dong! The bell rings. The guests are here.'),
    ],
    [
      notice(
        5,
        'science',
        'sound travels to our ears',
        '1-PS4-1',
        [
          N('Sounds are shaking in the air. They go into our ears, and we hear.'),
          N('Ears are for hearing.'),
        ],
        'Learned that sounds shake the air and go into our ears.',
      ),
    ],
  ),

  // ---------------------------------------------------------------- A22-9, step 2
  sc(
    'a22-09-ears',
    [
      N('You are the ears, and Dolores is your friend.'),
      N('She stands at the foot of the stairs, hands over her mouth.'),
      DO('And Mariano, and I always, I always...', 'sad'),
      N('Dolores looks at Mariano. Her cheeks go pink.'),
      N('Her feelings are too big to hold in. They are not for the whole table.'),
      N('Mirabel sees you get up. She nods once.'),
    ],
    [
      ask(
        6,
        'health',
        'slow breaths with a friend help big feelings',
        'CASEL: Self-management',
        [N('Dolores has big feelings. What helps?')],
        [
          o(
            'Slow breaths with a friend',
            [N('Yes! Slow breaths and a friend help big feelings settle.')],
            true,
          ),
          o('Shouting', [
            N('Shouting makes big feelings bigger. Slow breaths with a friend help.'),
          ]),
          o('Hiding', [N('Hiding alone is lonely. Slow breaths with a friend help.')]),
        ],
        'Talked about how slow breaths and a friend help with big feelings.',
      ),
    ],
    {
      choices: [
        ch('out', 'Take her outside.', [
          N('You take Dolores’s hand and walk her out, fast.'),
          N('Behind you, the door swings shut. Casita leans on it.'),
        ]),
        ch('cover', 'Knock a jug over to cover her.', [
          N('You knock a jug over. In the crash, you get Dolores outside.'),
          DO('Thank you. Thank you.', 'sad'),
        ]),
      ],
    },
  ),
  sc(
    'a22-09-hands',
    [
      N('You are the hands, and Luisa needs them.'),
      N('The crack runs under the table. It folds in the middle, like a book.'),
      LU('I cannot hold it!', 'shock'),
      N('Dishes slide down towards Señora Guzmán.'),
      MI('Luisa!', 'shock'),
    ],
    [
      ask(
        4,
        'maths',
        'two hands and two hands make four',
        'K.OA.A.2',
        [N('Luisa has two hands. You have two hands. How many hands hold the table?')],
        [
          o('Four', [N('Yes! Two and two make four hands.')], true),
          o('Two', [N('That is only Luisa’s. Two and two more make four.')]),
        ],
        'Added two and two to make four.',
      ),
    ],
    {
      choices: [
        ch('lift', 'Grab the other end.', [
          N('You get your shoulder under the other end and push.'),
          N('Between you, you hold it, dishes and all.'),
        ]),
        ch('dishes', 'Get the dishes off first.', [
          N('You and your Nubbin snatch the dishes. Then Luisa can hold it, just.'),
        ]),
      ],
    },
  ),

  // ---------------------------------------------------------------- A22-13, the lamp
  sc(
    'a22-13-lamp-flicker',
    [
      N('At your belt, the gold flame goes out with the candle.'),
      N('But your own thin blue flame is still there, low on the wick.'),
      N('Then Mirabel jumps up and runs away.'),
    ],
    [
      notice(
        2,
        'science',
        'even a tiny light helps us see in the dark',
        '1-PS4-2',
        [N('Even a tiny flame lights up the dark. Your eyes like it.')],
        'Learned that even a tiny light helps us see in the dark.',
      ),
    ],
  ),
  sc(
    'a22-13-lamp-lit',
    [
      N('At your belt, your lamp is still burning.'),
      N('It is the only light in the ruins. The family turns towards it.'),
      N('Then Mirabel jumps up and runs away.'),
    ],
    [
      notice(
        2,
        'science',
        'light makes shadows',
        '1-PS4-2',
        [N('When light shines on something, it makes a shadow behind it.')],
        'Learned that light makes shadows.',
      ),
    ],
  ),
  sc(
    'a22-13-lamp-warm',
    [
      N('At your belt, your lamp is still burning, red-gold.'),
      N('The night should be cold. It is oddly warm.'),
      N('Antonio’s jaguar lies down against your feet.'),
      N('Then Mirabel jumps up and runs away.'),
    ],
    [
      notice(
        3,
        'science',
        'a fire gives heat',
        'ELOF: Scientific Reasoning',
        [N('A fire gives heat. Heat makes a cold night feel warm.')],
        'Learned that fire gives heat that warms a cold night.',
      ),
    ],
  ),

  // ---------------------------------------------------------------- A22-14, keptStone
  sc(
    'a22-14-pedro-done-kept',
    [
      N('Abuela sees your hands. They are cold.'),
      N('She takes them in hers, and says nothing.'),
      N('Butterflies land on the rock. Then footsteps. A thin man in a green hood.'),
      BR('Mamá.', 'shock'),
      N('Abuela lets go of your hands, gently. She goes to him, and holds him.'),
    ],
    [
      notice(
        5,
        'science',
        'warm hands share their warmth',
        'ELOF: Scientific Reasoning',
        [N('Warm hands can warm cold hands. Warmth moves from warm to cold.')],
        'Learned that warmth moves from warm hands to cold hands.',
      ),
    ],
  ),

  // ---------------------------------------------------------------- Hazel’s margin note
  sc(
    'a22-margin-hazel',
    [
      N('Nova’s book is open at the river.'),
      N('In the margin, in faint pencil, is a note. You know the hand.'),
      N('“Abuela sat down by the river and stopped being right.”'),
      N('“Took her long enough. Took me longer.”', 'soft'),
      N('And under it, one letter: H.'),
      N('Your Nubbin sits by the painted rock, and stays a while.'),
    ],
    [
      notice(
        4,
        'sel',
        'saying sorry can be hard and brave',
        'CASEL: Self-awareness',
        [N('Saying “I was wrong” can be hard. It is brave, too.')],
        'Heard that it is brave to say you were wrong.',
      ),
    ],
  ),

  // ---------------------------------------------------------------- A22-15, step 2
  sc(
    'a22-15-ears',
    [
      N('Dolores walks through the ruins with her eyes shut.'),
      N('You walk beside her, and tell her where to step.'),
      DO('That wall hums wrong. Something inside is loose.', 'think'),
      N('The builders take it down and set it again.'),
      DO('That tile is about to fall on Camilo!', 'think'),
      N('Camilo moves. The tile falls where he was.'),
      DO('My gift is gone, but I can still hear. I never noticed how much.', 'happy'),
    ],
    [
      ask(
        5,
        'science',
        'loud and quiet sounds',
        'ELOF: Scientific Reasoning',
        [N('Which sound is louder: a whisper, or a hammer?')],
        [
          o('A hammer', [N('Yes! A hammer is loud. A whisper is quiet.')], true),
          o('A whisper', [N('A whisper is quiet. A hammer is loud.')]),
        ],
        'Compared loud and quiet sounds.',
      ),
    ],
    {
      choices: [
        ch('marvel', 'Tell her she’s a marvel.', [
          DO('Nobody ever...', 'soft'),
          N('She stops. Mariano hands her a handkerchief.'),
        ]),
        ch('listen', 'Ask what she hears now.', [
          DO('Hammers. Everyone laughing. Tío Bruno telling the rats a story. Lovely.', 'soft'),
        ]),
      ],
    },
  ),
  sc(
    'a22-15-hands',
    [
      N('Luisa stands in the ruins with a load of bricks.'),
      N('You take the bricks off her and put them down.'),
      LU('I should lift the beams. I always do.', 'sad'),
      N('It takes six neighbours to move the beam. They do it.'),
      N('Luisa sits down on a pile of tiles, in the sun.'),
      LU('I am sitting down. I have not sat for years.', 'soft'),
    ],
    [
      ask(
        3,
        'science',
        'a wheelbarrow helps carry heavy loads',
        'ELOF: Scientific Reasoning',
        [N('Which helps carry lots of bricks: a wheelbarrow, or two hands?')],
        [
          o(
            'A wheelbarrow',
            [N('Yes! A wheelbarrow holds the load, and the wheel does the rolling.')],
            true,
          ),
          o('Two hands', [N('Hands can carry a few. A wheelbarrow carries many.')]),
        ],
        'Learned that a wheelbarrow helps carry heavy loads.',
      ),
    ],
    {
      choices: [
        ch('carry', 'Carry for her.', [
          N('You carry bricks all morning. Luisa tells you where to put them.'),
          N('She is very bossy, and much happier.'),
        ]),
        ch('sit', 'Sit down next to her for a minute.', [
          N('You sit beside her. Your Nubbin climbs onto her boot and sleeps.'),
          N('She laughs.'),
        ]),
      ],
    },
  ),

  // ---------------------------------------------------------------- A22-16, the stub
  sc(
    'a22-16-stub-flicker',
    [
      N('Mirabel lights a candle stub from the new flame.'),
      MI('For you. To take home.', 'soft'),
      N('Your own small blue flame leans towards the new one.'),
      N('For a moment, they burn together.'),
      MI('Yours is stubborn. Look after it. It will come right.', 'soft'),
    ],
    [
      ask(
        4,
        'sel',
        'keep trying when something is hard',
        'CASEL: Self-management',
        [N('A stubborn little flame keeps going. When something is hard, what can we say?')],
        [
          o(
            'I can keep trying',
            [N('Yes! “I can keep trying” helps us when things are hard.')],
            true,
          ),
          o('I give up for ever', [
            N('Everyone wants to stop sometimes. “I can keep trying” helps.'),
          ]),
        ],
        'Talked about not giving up when something is hard.',
      ),
    ],
  ),
  sc(
    'a22-16-stub-lit',
    [
      N('Mirabel lights a candle stub from the new flame.'),
      MI('For you. To take home.', 'soft'),
      N('You hold your lamp up beside it.'),
      N('The two flames burn side by side, the same height.'),
      MI('Look at that. Two houses.', 'happy'),
    ],
    [
      ask(
        4,
        'sel',
        'naming a happy feeling',
        'ELOF: Social and Emotional Development',
        [N('Mirabel sees the two flames side by side. How does she feel?')],
        [
          o('Happy', [N('Yes! Seeing two lights together makes her happy.')], true),
          o('Cross', [N('Look at her smile. She is happy.')]),
        ],
        'Named a happy feeling.',
      ),
    ],
  ),
  sc(
    'a22-16-stub-warm',
    [
      N('Mirabel lights a candle stub from the new flame.'),
      MI('For you. To take home.', 'soft'),
      N('You hold your lamp up beside it.'),
      N('Your red-gold flame and her new one burn side by side.'),
      MI('Yours is warm. Somebody loves that one.', 'happy'),
    ],
    [
      notice(
        4,
        'sel',
        'kindness feels warm inside',
        'ELOF: Social and Emotional Development',
        [N('Hugs and kind words can make us feel warm inside, like a lamp.')],
        'Heard that kindness can feel warm inside.',
      ),
    ],
  ),

  // ---------------------------------------------------------------- A22-16, the photo
  sc(
    'a22-16-photo-ears',
    [
      N('The photographer sets up his camera under a black cloth.'),
      N('The whole family crowds onto the stairs. Bruno is at the front, holding Antonio.'),
      MI('Wait! You too. Get in!', 'happy'),
      N('You stand at the edge, between Mirabel and Dolores.'),
      DO('Mariano is going to ask me. Next week. I heard him practising.', 'happy'),
      NB('Everybody, very still!'),
    ],
    [
      ask(
        5,
        'literacy',
        'first sound: Dolores and door',
        'RF.K.2',
        [N('Dolores starts with “d”. Which word starts the same way?')],
        [
          o('Door', [N('Yes! Dolores and door both start with d.')], true),
          o('Candle', [N('Candle starts with c. Door starts with d, like Dolores.')]),
        ],
        'Matched words that begin with the same first sound.',
      ),
    ],
    {
      choices: [
        ch('smile', 'Smile.', [
          N('You smile. Dolores cannot stop smiling, and the photo catches her.'),
        ]),
        ch('secret', 'Whisper that her secret is safe.', [
          DO('I know. I heard you think it.', 'happy'),
          N('Dolores is only joking. The photo catches you both laughing.'),
        ]),
      ],
    },
  ),
  sc(
    'a22-16-photo-hands',
    [
      N('The photographer sets up his camera under a black cloth.'),
      N('The whole family crowds onto the stairs. Bruno is at the front, holding Antonio.'),
      MI('Wait! You too. Get in!', 'happy'),
      N('You stand at the edge, beside Mirabel and Luisa.'),
      LU('Sit. It is allowed. I checked.', 'happy'),
      NB('Everybody, very still!'),
    ],
    [
      ask(
        4,
        'health',
        'sit and rest when tired',
        'ELOF: Perceptual, Motor, and Physical Development',
        [N('Luisa sits down to rest. When is it good to sit and rest?')],
        [
          o('When we are tired', [N('Yes! Resting when we are tired helps our bodies.')], true),
          o('Never', [N('Everyone needs rests. Sit and rest when you are tired.')]),
        ],
        'Learned that it is good to rest when tired.',
      ),
    ],
    {
      choices: [
        ch('sit', 'Sit.', [
          N('You sit. You and Luisa are the only ones sitting. You both look pleased.'),
        ]),
        ch('nubbin', 'Put your Nubbin on Luisa’s boot.', [
          N('Your Nubbin climbs onto her boot. Luisa laughs just as the photo is taken.'),
        ]),
      ],
    },
  ),

  // ---------------------------------------------------------------- the Grove keepsake
  sc(
    'a22-grove-candle',
    [
      N('Back in the Grove, you hang the tin holder on the fourth post.'),
      N('The stub will not stay lit here. You knew it would not.'),
      N('Mirabel said some lights have to be waited for.'),
      N('Your Nubbin sits underneath, with a yellow butterfly on its crown.'),
    ],
    [
      ask(
        3,
        'sel',
        'hope while we wait',
        'ELOF: Social and Emotional Development',
        [N('Your Nubbin looks up at the stub and waits. How does it feel?')],
        [
          o('Hopeful', [N('Yes! Waiting for something good can feel hopeful.')], true),
          o('Cross', [N('Look at its happy face. Your Nubbin feels hopeful.')]),
        ],
        'Named the feeling of hope while waiting.',
      ),
    ],
  ),
  sc(
    'a22-grove-candle-lit',
    [
      N('Back in the Grove, you hang the tin holder on the fourth post.'),
      N('The stub catches from the lantern above it at once.'),
      N('Two flames now, one from here and one from far away.'),
      N('Your Nubbin sits underneath, very pleased.'),
    ],
    [
      notice(
        3,
        'science',
        'one flame can light another',
        'ELOF: Scientific Reasoning',
        [N('One flame can light another. The first flame stays just as bright.')],
        'Learned that one flame can light another without getting smaller.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A22_SPROUT: EduQuest[] = [
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
];

/** Every `edu:` check string used by the lessons above. */
export const CHECKS: string[] = [
  'edu:breathe:slowly:3',
  'edu:clap:beat:party',
  'edu:clap:syllables:abuela',
  'edu:count:candles:4',
  'edu:count:family:10',
  'edu:count:photo-things:3',
  'edu:count:sounds:3',
  'edu:draw:door:picture',
  'edu:feel:hum:throat',
  'edu:order:story:tower-escape',
  'edu:point:mountains:colombia',
];
