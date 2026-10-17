/**
 * The Learning Grove, reader band (ages 7–10): Atlas page A22, The Candle (a Colombian family and
 * their house, in the coffee country of the Andes).
 *
 * Source: atlas-a22.ts (ATLAS_A22 and A22_VARIANTS). One EduScene per original scene (every step
 * scene, every done scene, every complete scene and every variant), id `reader:<original id>`,
 * with every choice kept under its original id and `set` flag (`a22-job`). Reader keeps all
 * choices, so no `defaultChoice` is needed. See EDU-STYLE.md. British spelling.
 *
 * Learning angles, from the outline: geography (Colombia: the Andes, two coasts, coffee country,
 * the Magdalena river), food (arepas, buñuelos, coffee), Spanish family words (abuela, tía, primo),
 * music (the tiple), craft (the Zenú sombrero vueltiao), and families who must leave home, told
 * gently. Around them: maths (multiplying, division, perimeter, area, fractions, symmetry, units),
 * science (flames, sound, sand and erosion, plants, rats, wax, the senses, life cycles, light),
 * language (family words, compound words, personification, exaggeration) and feelings.
 *
 * Think questions (`ask` with no `best`) in every quest: what to carry when you leave home, what
 * makes a person special, why people look away from problems, whether a person is worth what they
 * do, whether to keep a secret, whether hiding is love, whether pleasing everyone is kindness,
 * whether both sides can be right, why fear makes us hold tight, whether help should be repaid,
 * and what helps us wait.
 *
 * Care notes kept: the war is never named (“trouble in the land where we lived”); the riders stay a
 * thin line far away. Pedro’s death is said plainly and gently. Abuela is frightened, never a
 * villain, and the river answers her fear. Colombian life is everyday, never quaint. The Zenú hat
 * is described plainly as a craft; the Learning Grove version needs the advisers’ read (see the
 * log). No film names beyond the page’s own, no songs, nothing quoted.
 * Facts used: Colombia is in the north-west of South America, with the Caribbean Sea to the north
 * and the Pacific Ocean to the west; the Andes split into three ranges there; coffee beans are
 * seeds of red coffee cherries; the Magdalena is Colombia’s main river and flows north to the
 * Caribbean; arepas are corn cakes; buñuelos are fried cheese-dough balls; a tiple has twelve
 * strings in four sets of three; the capybara is the largest rodent; rats’ front teeth never stop
 * growing; a butterfly goes egg, caterpillar, chrysalis, butterfly; a cactus stores water; the
 * Sun rises in the east; children aged 6 to 12 need about nine to twelve hours of sleep.
 */
import type { EduDomain, EduQuest, EduScene, GlossaryEntry, Lesson } from './types';
import type { Line, Choice } from '../config/story';

type Mood = NonNullable<Line['mood']>;

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const Y = say('you');
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
const fits = (t: string) => words(t) <= 26 && t.length <= 150;

/**
 * Keeps narration to two sentences a line and within the reader caps (30 words, 160 characters):
 * a long narrator line is cut at sentence ends into several lines (the mood stays on the first).
 * Brackets and the characters’ own lines are left as written. `map[i]` is the index of the last
 * piece of original line i, so a lesson’s `after` can follow.
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
      if (last !== undefined && count < 2 && fits(`${last} ${sentence}`)) {
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

/** One answer option. `best` marks the answer the lesson teaches; think questions have none. */
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

/** One reader scene. Lesson ids are `reader:<of>-l<n>`, numbered in play order. */
const sc = (of: string, lines: Line[], beats: Beat[], choices?: Choice[]): EduScene => {
  const cut = split(lines);
  return {
    id: `reader:${of}`,
    of,
    band: 'reader',
    lines: cut.lines,
    ...(choices ? { choices } : {}),
    lessons: [...beats]
      .sort((a, b) => a.after - b.after)
      .map((b, i) => ({ id: `reader:${of}-l${i + 1}`, ...b, after: cut.map[b.after] ?? b.after })),
  };
};

const gl = (word: string, meaning: string, scene: string): GlossaryEntry => ({
  word,
  meaning,
  scene: `reader:${scene}`,
});

const quest = (
  of: string,
  title: string,
  goals: EduQuest['goals'],
  scenes: EduScene[],
  glossary: GlossaryEntry[] = [],
): EduQuest => ({
  id: `reader:${of}`,
  of,
  band: 'reader',
  title,
  goals,
  scenes,
  ...(glossary.length ? { glossary } : {}),
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
      hint: 'Touch the candle in the window on the atlas page, then sit at the edge of the painted bed.',
    },
    'a22-01-s2': {
      goal: 'Walk into the valley on the morning of Antonio’s ceremony and meet the family.',
      hint: 'Let the page turn, then climb the hill from the market square to the house with green shutters.',
    },
  },
  [
    sc(
      'a22-01-story',
      [
        N(
          'Nova’s atlas falls open at a valley ringed by green mountains: white walls, red roofs, tall palms and a candle in one window.',
        ),
        N('The page does not come alive at once. It stays painted, and you step into the paint.'),
        N(
          'It is night, years ago. In a bedroom made of brushstrokes, an old woman sits beside a little girl in round glasses.',
        ),
        AB(
          'Come in, then. You may as well hear it too. Mirabel has heard it a hundred times, and she still wants it.',
        ),
        MI('Tell the river part!', 'happy'),
        AB(
          'First the beginning. When I was young there was trouble in the land where we lived, and we had to leave our home.',
        ),
        N(
          'The painting changes: a young couple on a road at night, with three babies wrapped against the cold.',
        ),
        AB(
          'Pedro carried two of the babies, and I carried one. We walked for days with other families who had to leave too.',
        ),
        N(
          'Far behind them, on a ridge, there is a thin dark line of riders. The painting does not bring them any closer.',
        ),
        AB(
          'At a river, the trouble caught up with us. Pedro told me to cross with the babies. He stayed on the bank, so that we could.',
        ),
        AB('He did not come. Pedro died there, and I have missed him every day.', 'sad'),
        N(
          'In the painting, the candle in her hand blazes, and the mountains rise round the river like hands closing round a flame.',
        ),
        AB(
          'The candle gave us a home where nobody could take us from each other. A house that loves us. A miracle.',
          'soft',
        ),
      ],
      [
        notice(
          0,
          'social-studies',
          'finding Colombia: its coasts, its mountains and its coffee country',
          'D2.Geo.2.K-2',
          [
            N(
              'This page is set in a real country: Colombia, in the north-west corner of South America.',
            ),
            N(
              'It has a coast on the Caribbean Sea to the north and on the Pacific Ocean to the west.',
            ),
            N(
              'The Andes mountains run up through it in three long ranges, and coffee grows on their slopes.',
            ),
          ],
          'Learned that Colombia is in north-west South America, with two coasts, three Andes ranges and coffee country.',
        ),
      ],
      [
        ch('listen', 'Keep listening.', [
          N(
            'You keep very still. The little girl has her fist in the blanket, holding on to the part about the river.',
          ),
        ]),
        ch('pedro', 'Ask about Pedro.', [
          AB(
            'He was kind, and he was brave, and he was not very good at dancing. That is enough for one night.',
            'soft',
          ),
          N('She says it lightly. Her hand on the blanket does not move at all.'),
        ]),
      ],
    ),
    sc(
      'a22-01-story-done',
      [
        AB(
          'Every child in this family is given a gift when they are old enough. Tomorrow is yours, Mirabel.',
        ),
        MI('What will it be?'),
        AB('Sleep, and see.', 'soft'),
        N('Mirabel lies awake anyway, with Abuela’s story still in the room.'),
        N(
          'Her grandmother’s family left home with almost nothing but each other. In many places and times, families still have to do that.',
        ),
      ],
      [
        ask(
          4,
          'sel',
          'imagining what matters most when a family must leave home',
          'CASEL: Social awareness',
          [
            N(
              'Abuela’s family left home in a hurry, carrying three babies and very little else. If you had to leave quickly, what would matter most to take?',
            ),
          ],
          [
            o('The people I love', [
              N(
                'That is the answer many families give. People matter most, and they are the hardest thing to leave behind.',
              ),
            ]),
            o('Something that reminds me of home', [
              N(
                'A fair answer. A small thing from home can carry a lot of memory, and many families take one.',
              ),
            ]),
            o('Something to keep me comfortable', [
              N(
                'A fair answer too. Comfort matters when everything else is changing, and a blanket can feel like home.',
              ),
            ]),
          ],
          'Thought about what a family would take if they had to leave home quickly, and how that feels.',
        ),
      ],
    ),
    sc(
      'a22-01-casita',
      [
        N(
          'The page turns by itself. The paint goes thin and bright and real: morning, ten years later, and a market full of noise.',
        ),
        N(
          'Up the hill is a house with white walls, green shutters and a red roof. Its shutters open and close by themselves.',
        ),
        N(
          'A young woman in round glasses and an embroidered skirt comes down the steps two at a time, with a list.',
        ),
        N(
          'You know the glasses. The little girl from the painting has grown up, and the house is the one the candle made.',
        ),
        MI(
          'Hi! Hello! You’re the traveller. Abuela said there’d be a traveller. Sorry, are you a traveller?',
        ),
        N('The floor tiles clack in a ripple across the doorway, like a dog thumping its tail.'),
        MI('That’s Casita. Casita, be nice. Guest.'),
        MI('Come and meet everyone: my abuela, my tías and tíos, my primos. You’ll lose track.'),
        N('A shutter swings out and taps you gently on the shoulder.'),
        MI(
          'I’m Mirabel. I don’t have a gift, before anyone tells you. It’s fine. It’s totally fine.',
        ),
      ],
      [
        ask(
          7,
          'literacy',
          'Spanish family words: abuela, tía, primo',
          'L.2.4',
          [
            N(
              'In Spanish, abuela means grandmother and tía means aunt. From the way Mirabel lists her family, what do you think primo means?',
            ),
          ],
          [
            o(
              'Cousin',
              [
                N(
                  'Yes. A boy cousin is a primo and a girl cousin is a prima. Antonio and Camilo are Mirabel’s primos, and Dolores is her prima.',
                ),
              ],
              true,
            ),
            o('Uncle', [
              N('Close, but an uncle is a tío. A cousin is a primo, or a prima for a girl.'),
            ]),
            o('Baby', [
              N('Not quite. A baby is a bebé. A cousin is a primo, or a prima for a girl.'),
            ]),
          ],
          'Worked out the Spanish family word primo (cousin) from context, alongside abuela and tía.',
        ),
      ],
      [
        ch('yes', 'Say you are the traveller.', [
          MI('Great. Perfect. You’re in the blue room. The house likes guests. Mostly.', 'happy'),
        ]),
        ch('nubbin', 'Point out that your Nubbin is travelling too.', [
          MI('Oh, hello! Look at you. Antonio is going to lose his mind. In a good way.', 'happy'),
        ]),
        ch('list', 'Ask what the list is for.', [
          MI(
            'Tonight. Antonio’s gift ceremony. My little cousin. Everything has to be perfect, so it’s a long list.',
          ),
        ]),
      ],
    ),
    sc(
      'a22-01-lamp',
      [
        N(
          'Abuela Alma meets you in the courtyard. She is older than in the painting, straight as a broom, with a black shawl.',
        ),
        N(
          'She looks at the little lamp at your belt, the one from your Long-Grass post. Its glass is dark.',
        ),
        AB('Nobody in this house walks about in the dark. Come.'),
        N(
          'She lights it from the candle in the window. The flame is gold and steady, and it isn’t yours, and it is very kind of her.',
        ),
      ],
      [
        ask(
          3,
          'science',
          'a flame can light another wick without being used up',
          '4-PS3-2',
          [N('Abuela lights your lamp from her candle. Does her candle’s flame get any smaller?')],
          [
            o(
              'No: one flame can light many wicks',
              [
                N(
                  'Right. The heat from the first flame warms the new wick until it catches. Each flame then burns its own wax.',
                ),
              ],
              true,
            ),
            o('Yes: it gives away half its flame', [
              N(
                'It is a nice idea, but flames do not work like that. The first flame passes on heat and stays the same size.',
              ),
            ]),
            o('It goes out', [
              N(
                'Not at all. Lighting a second wick takes only a little heat, and the first flame keeps burning.',
              ),
            ]),
          ],
          'Learned that heat from one flame can light another wick, and the first flame is not used up.',
        ),
      ],
    ),
    sc(
      'a22-01-complete',
      [
        N(
          'Your room is small and blue, with a window over the valley. The bed turns its own covers down when you look at it.',
        ),
        N(
          'Your Nubbin climbs onto the windowsill and looks across the courtyard at the candle in the window opposite.',
        ),
        N(
          'Downstairs somebody is laughing, somebody is cooking, and three people are arguing about chairs.',
        ),
        N(
          'Each of the three is carrying four chairs, and each wants to put them somewhere different.',
        ),
        N('Somewhere in the walls there is a small scurry, and then nothing.'),
      ],
      [
        ask(
          3,
          'maths',
          'equal groups: 3 × 4',
          '3.OA.A.1',
          [N('Three people are each carrying four chairs. How many chairs is that altogether?')],
          [
            o(
              'Twelve',
              [N('Yes. Three groups of four is 4 + 4 + 4 = 12, which we write as 3 × 4 = 12.')],
              true,
            ),
            o('Seven', [
              N('That is 3 + 4. We need three groups of four: 4 + 4 + 4 = 12, or 3 × 4 = 12.'),
            ]),
            o('Nine', [N('Try it as three groups of four: 4, 8, 12. So 3 × 4 = 12.')]),
          ],
          'Used equal groups to find 3 × 4 = 12.',
        ),
      ],
    ),
  ],
  [
    gl('abuela', 'The Spanish word for grandmother.', 'a22-01-story'),
    gl('miracle', 'A wonderful event that seems impossible.', 'a22-01-story'),
    gl('tía', 'The Spanish word for aunt.', 'a22-01-casita'),
    gl('primo', 'The Spanish word for a boy cousin. A girl cousin is a prima.', 'a22-01-casita'),
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
      goal: 'Meet the rest of the Madrigals at the house.',
      hint: 'Go back up the hill with Mirabel and talk to the family in the courtyard.',
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
        N(
          'Market morning. The square is full of stalls: oranges, coffee sacks, bolts of bright cloth and somebody’s goat.',
        ),
        MI(
          'Okay. Quick tour. Everyone in my family has a gift, and everyone in town knows exactly what it is.',
        ),
        N('A tall young woman walks past with a donkey over each shoulder.'),
        MI('That’s Luisa, my sister. Super strong. Hi, Luisa!'),
        LU('Hi. Can’t stop. The church is crooked again.'),
        N('A woman at a stall has a small grey cloud over her head. It is raining on her onions.'),
        MI('Tía Pepa. Her weather is her mood. Tía, the cloud.'),
        PE('What cloud? There is no cloud. I am perfectly calm.'),
        N(
          'The cloud thunders, very quietly. A man in a yellow shirt hurries over and fans it away with his hat.',
        ),
        MI('Tío Félix. He says his gift is Tía Pepa.'),
        FE('It is a very big gift. I am a lucky man!', 'happy'),
      ],
      [
        notice(
          0,
          'social-studies',
          'coffee country: how coffee grows in the Andes',
          'D2.Geo.2.K-2',
          [
            N(
              'The coffee sacks are no accident. This valley is in Colombia’s coffee country, high in the Andes, where the cool mountain air suits coffee bushes.',
            ),
            N(
              'Coffee beans are really seeds. They grow inside bright red fruits called coffee cherries.',
            ),
          ],
          'Learned that Colombian coffee grows on mountain slopes, and that beans are seeds inside red coffee cherries.',
        ),
      ],
      [
        ch('pepa', 'Tell Tía Pepa the cloud is fine.', [
          PE('It is fine, isn’t it?', 'happy'),
          N('The cloud turns into a small, pleased rainbow.'),
        ]),
        ch('felix', 'Ask Félix how he copes.', [
          FE(
            'Umbrellas. Many umbrellas. And I tell her she’s beautiful, which is true, so it’s easy.',
            'happy',
          ),
        ]),
        ch('nubbin', 'Check on your Nubbin.', [
          N(
            'Your Nubbin has found the goat, and the goat has found your Nubbin. They are deciding whether to be friends.',
          ),
        ]),
      ],
    ),
    sc(
      'a22-02-market-done',
      [
        N('Mirabel ticks something off her list and nearly walks into a post.'),
        MI(
          'Party shopping done: three bags of oranges at four Shells a bag, and one loaf for five Shells. I paid with a twenty-Shell coin.',
        ),
        MI('Next, my cousins. Brace yourself.'),
      ],
      [
        ask(
          1,
          'maths',
          'two-step money problem: multiply, add, then subtract from 20',
          '3.OA.D.8',
          [N('How many Shells of change should Mirabel get back?')],
          [
            o(
              'Three',
              [
                N(
                  'Yes. Oranges cost 3 × 4 = 12 Shells. With the loaf that is 12 + 5 = 17 Shells. 20 − 17 = 3 Shells of change.',
                ),
              ],
              true,
            ),
            o('Eight', [
              N(
                'That is 20 − 12, which forgets the loaf. With the loaf, 12 + 5 = 17 and 20 − 17 = 3.',
              ),
            ]),
            o('Seventeen', [
              N('Seventeen is what she spent. The change is what is left of 20: 20 − 17 = 3.'),
            ]),
          ],
          'Solved a two-step money problem: 3 × 4 = 12, 12 + 5 = 17, 20 − 17 = 3.',
        ),
      ],
    ),
    sc(
      'a22-02-cousins',
      [
        N(
          'In the courtyard a young woman steps out of a cloud of petals: perfect hair, perfect smile, roses at her feet.',
        ),
        MI('My sister Isabela. Flowers. Everyone loves her. I love her!'),
        IS('Mirabel. And a guest. How nice.'),
        N(
          'She smiles, and an orchid grows out of the wall beside your head. It is a lovely smile, and it never changes.',
        ),
        N('A girl in a pale dress drifts past, whispering very fast to nobody.'),
        MI('Cousin Dolores. She hears everything. If you sneeze in the market, she knows.'),
        DO('You did sneeze in the market. Bless you.'),
        N(
          'A boy turns round, and he is Mirabel, then Félix, then himself again, a lanky teenager, grinning.',
        ),
        CA('Camilo. Faces. I can do yours if you stand still.'),
      ],
      [
        ask(
          8,
          'sel',
          'what makes a person themselves, apart from how they look',
          'CASEL: Self-awareness',
          [
            N(
              'Camilo can look exactly like Félix, but he is still Camilo. What really makes a person themselves?',
            ),
          ],
          [
            o(
              'What they care about and how they treat people',
              [
                N(
                  'Yes. A face can be copied, but your kindness, your humour and what you care about are yours alone.',
                ),
              ],
              true,
            ),
            o('Their hair and clothes', [
              N(
                'Those are part of how we look, and they can change. What stays is what we care about and how we treat people.',
              ),
            ]),
            o('Their gift', [
              N(
                'Mirabel has no gift, and she is entirely herself. Who we are is what we care about and how we treat others.',
              ),
            ]),
          ],
          'Reflected on what makes a person themselves: values and kindness, not looks or gifts.',
        ),
      ],
      [
        ch('still', 'Stand still.', [
          N(
            'Camilo looks at you hard, and then you are looking at yourself, a little taller, with better hair.',
          ),
          CA('I improved you. You’re welcome.', 'happy'),
        ]),
        ch('move', 'Don’t stand still.', [
          CA('Fair. People hate it. Mostly my sisters. Mostly when I do them.'),
        ]),
      ],
    ),
    sc(
      'a22-02-kitchen',
      [
        N(
          'In the kitchen a woman with a kind, tired face is cooking arepas. A boy with a burnt finger eats one, and the burn is gone.',
        ),
        JU('You must be hungry. Everyone who comes up that hill is hungry. Sit.'),
        N(
          'The arepa is hot and buttery, with cheese in the middle. The ache in your legs from the long page just stops.',
        ),
        AG('Welcome! Welcome. Don’t mind the bee. I’m used to the bee.'),
        N('A gentle man in glasses waves from the doorway. A bee is sitting on his nose.'),
        MI('Mamá and Papá. So that’s everyone. Everyone with a gift, I mean, and me.'),
        N(
          'Across the courtyard there is a tower with a dark door. Everybody manages not to look at it, all at once.',
        ),
        N(
          'Félix starts to say a name. Pepa’s cloud cracks with thunder, and Félix turns it into a cough.',
        ),
        N('Then everybody talks at once, about chairs.'),
      ],
      [
        notice(
          2,
          'health',
          'what corn and cheese give a growing body',
          'K-LS1-1',
          [
            N(
              'Arepas are eaten all over Colombia. They are made from ground corn, grilled or fried, often with cheese.',
            ),
            N(
              'Corn gives you energy to run about. Cheese gives protein and calcium, which help muscles and bones grow.',
            ),
          ],
          'Learned that corn gives energy, and cheese gives protein and calcium for growing muscles and bones.',
        ),
      ],
      [
        ch('ask', 'Ask about the tower.', [
          MI('Oh! That’s nobody. Nobody’s up there. It’s just a room.', 'shock'),
          N(
            'She says it in a rush. Julieta puts another arepa on your plate, which is also an answer.',
          ),
        ]),
        ch('leave', 'Let it go.', [
          N(
            'You let it go. Mirabel gives you a small grateful look, and the house rattles a single tile, like a sigh.',
          ),
        ]),
        ch('nubbin', 'Watch your Nubbin.', [
          N(
            'Your Nubbin is at the courtyard’s edge, looking up at the tower. A small grey face looks back from a crack, and vanishes.',
          ),
        ]),
      ],
    ),
    sc(
      'a22-02-complete',
      [
        N(
          'By afternoon you know the gifts by heart: healing, weather, strength, flowers, hearing, faces.',
        ),
        N(
          'Mirabel hangs paper lanterns, carries chairs and ties ribbons all day, and nobody once asks her to.',
        ),
        MI('It’s fine. Somebody has to do the stuff that isn’t magic.', 'soft'),
        N('She says it brightly. Your Nubbin leans against her ankle anyway.'),
      ],
      [
        ask(
          3,
          'literacy',
          'reading feelings from actions as well as words',
          'RL.3.3',
          [
            N(
              'Mirabel says “It’s fine” in a bright voice, and your Nubbin leans against her anyway. How can you tell how someone really feels when their words say one thing?',
            ),
          ],
          [
            o('Watch their face and what they do', [
              N(
                'A good clue. Actions often tell us more than words, and a writer shows feelings that way too.',
              ),
            ]),
            o('Listen to how they say it', [
              N(
                'Another good clue. A bright voice that is a little too bright can hide a sore feeling.',
              ),
            ]),
            o('Ask them kindly', [
              N(
                'The kindest clue of all. Asking gently, and waiting, gives people room to say what is true.',
              ),
            ]),
          ],
          'Thought about how to read someone’s real feelings from their words, voice and actions.',
        ),
      ],
    ),
  ],
  [
    gl(
      'arepa',
      'A round cake of ground corn, grilled or fried and often filled with cheese, eaten in Colombia.',
      'a22-02-kitchen',
    ),
  ],
);

// ================================================================== A22-3 Antonio’s Door
const Q3: EduQuest = quest(
  'a22-03',
  'Antonio’s Door',
  {
    'a22-03-s1': {
      goal: 'Find Antonio before his ceremony.',
      hint: 'Look in the nursery Antonio shares with Mirabel.',
    },
    'a22-03-s2': {
      goal: 'Walk Antonio up to his door with Mirabel.',
      hint: 'Climb the stairs two steps behind Mirabel and Antonio.',
    },
  },
  [
    sc(
      'a22-03-hiding',
      [
        N(
          'Evening: the courtyard is full of the whole town in their best clothes, every one holding a candle. Antonio is not.',
        ),
        PE('Where is he? Where is my baby?', 'shock'),
        MI('I’ll find him. Come on. He likes hiding places.'),
        N(
          'You find him under the bed in the nursery. He is five, he is lying on his tummy with his chin on his fists, and he is not coming out.',
        ),
        AN('What if I don’t get one?', 'sad'),
        N(
          'Mirabel lies down flat on the floor, so their faces are level. You do too, and so does your Nubbin.',
        ),
        MI('Then you get to be you, which is already the best thing in this house.'),
        AN('You didn’t get one.'),
        MI('No. I didn’t.', 'soft'),
      ],
      [
        ask(
          8,
          'sel',
          'what makes a person special, with or without a gift',
          'CASEL: Self-awareness',
          [
            N(
              'Mirabel has no gift, yet she tells Antonio that being himself is the best thing in the house. Does she believe it? What makes a person special?',
            ),
          ],
          [
            o('Yes, she means it', [
              N(
                'A fair answer. Mirabel does seem to mean it for Antonio, even if it is harder to believe for herself.',
              ),
            ]),
            o('Partly, and she is still hurting', [
              N(
                'A thoughtful answer. People can believe something for someone else and still struggle to believe it about themselves.',
              ),
            ]),
            o('It’s how we treat other people', [
              N(
                'A strong answer. Mirabel is special because of what she does for Antonio right now: she lies on the floor beside him.',
              ),
            ]),
          ],
          'Thought about what makes a person special beyond any gift or talent.',
        ),
      ],
      [
        ch('hand', 'Hold out your hand.', [
          N(
            'Antonio looks at your hand for a long time, then takes Mirabel’s instead. That is the right answer, and you both know it.',
          ),
        ]),
        ch('nubbin', 'Let your Nubbin go under first.', [
          N(
            'Your Nubbin wriggles under the bed and lies down beside him, nose to nose. Antonio giggles before he can stop himself.',
          ),
        ]),
        ch('wait', 'Wait.', [
          N(
            'Nobody hurries him. After a while a small hand comes out from under the bed and finds Mirabel’s sleeve.',
          ),
        ]),
      ],
    ),
    sc(
      'a22-03-hiding-done',
      [
        AN('Will you walk me? Both of you?'),
        MI('All the way to the door.', 'soft'),
        N(
          'Antonio’s hands are cold and his heart is going fast. Fear does that to a body: it gets ready to run.',
        ),
      ],
      [
        doit(
          2,
          'health',
          'slow breathing calms a frightened body',
          'CASEL: Self-management',
          'edu:breathe:slowly:5',
          [
            N(
              'A slow breath tells the body that it is safe. Breathe in for four counts, hold for one, and out for six.',
            ),
            N('(Do it five times with Antonio, until his hands feel warmer.)'),
          ],
          'Practised slow breathing and learned that it tells a frightened body it is safe.',
        ),
      ],
    ),
    sc(
      'a22-03-door',
      [
        N(
          'The stairs are lined with family. On the landing a new door glows faintly, with no picture on it yet.',
        ),
        N(
          'Mirabel walks Antonio up, holding his hand. You walk two steps behind, between rows of candlelit faces.',
        ),
        N(
          'Halfway up, Mirabel slows down. For a moment you see another night instead: little Mirabel at a glowing door, and Abuela stooping to her.',
        ),
        AB(
          'Whatever happens tomorrow, little one, you are loved in this house. That does not depend on any door.',
          'soft',
        ),
        N(
          'In the memory, little Mirabel reaches for the handle. The door’s light goes out, and the door fades back into wall.',
        ),
        N(
          'Then it is now again. Antonio touches his door. It blazes with light, and a picture of him grows on it, with animals all round.',
        ),
        N(
          'A toucan swoops down and lands on his head. A jaguar pads out of the jungle in his new room, then capybaras, then coatis.',
        ),
        AN('They’re talking! I can hear them!', 'happy'),
        N(
          'The courtyard roars. Mirabel cheers louder than anybody, and goes on cheering a beat too long.',
        ),
      ],
      [
        ask(
          6,
          'science',
          'animals of Colombia’s forests and wetlands: the capybara is the largest rodent',
          '2-LS4-1',
          [
            N(
              'These animals live in Colombia’s forests and wetlands. Which of them is the biggest rodent in the world?',
            ),
          ],
          [
            o(
              'The capybara',
              [
                N(
                  'Yes. Rodents have front teeth that never stop growing, and the capybara is the largest rodent alive.',
                ),
              ],
              true,
            ),
            o('The jaguar', [
              N('The jaguar is a big cat, not a rodent. The capybara is the largest rodent.'),
            ]),
            o('The toucan', [
              N('The toucan is a bird with a huge beak. The capybara is the largest rodent.'),
            ]),
          ],
          'Learned that the capybara is the world’s largest rodent, among animals of Colombia’s forests and wetlands.',
        ),
      ],
      [
        ch('cheer', 'Cheer with Mirabel.', [
          N('You cheer with her, until she stops, and then you stop too.'),
        ]),
        ch('look', 'Look at Mirabel.', [
          N(
            'She catches you looking and smiles hard. Her glasses have steamed up, and she says it’s the candles.',
          ),
        ]),
      ],
    ),
    sc(
      'a22-03-door-done',
      [
        N(
          'Antonio’s jaguar sniffs your Nubbin from head to foot. Your Nubbin holds very still, then sniffs it back.',
        ),
        N('Your Nubbin trills at the jaguar. Antonio listens, delighted.'),
        AN('She says it smells like a garden. And your Nubbin says you snore.', 'happy'),
      ],
      [
        ask(
          1,
          'literacy',
          'sound words that copy the sound they name',
          'RL.1.4',
          [
            N(
              'Some words sound like the thing they name, such as “sniff”. Which of these words does that?',
            ),
          ],
          [
            o(
              'Sniff',
              [
                N(
                  'Yes. “Sniff” copies the sound of a nose, and “trill” does too. Words like this are called onomatopoeia.',
                ),
              ],
              true,
            ),
            o('Garden', [
              N('“Garden” does not sound like a garden. “Sniff” sounds like what it names.'),
            ]),
            o('Jaguar', [
              N('“Jaguar” does not sound like a jaguar. “Sniff” sounds like what it names.'),
            ]),
          ],
          'Identified sound words (onomatopoeia) such as sniff and trill.',
        ),
      ],
    ),
    sc(
      'a22-03-complete',
      [
        N(
          'The family photograph is taken on the stairs. Everyone crowds round Antonio, and the photographer waves Mirabel left, then out.',
        ),
        N(
          'Ten Madrigals are in the crowd round him: Abuela, Julieta, Agustín, Pepa, Félix, Isabela, Luisa, Dolores, Camilo and Antonio.',
        ),
        N(
          'Mirabel ends up at the edge of the courtyard holding a vase, smiling at the camera from very far away.',
        ),
        N(
          'Your Nubbin goes and sits by her feet, so that the vase and the Nubbin are at least in the same picture.',
        ),
        MI('Thanks.', 'soft'),
      ],
      [
        ask(
          2,
          'maths',
          'adding one to ten',
          '2.OA.A.1',
          [
            N(
              'Ten Madrigals crowd round Antonio, and Mirabel stands at the edge. How many people is that altogether?',
            ),
          ],
          [
            o('Eleven', [N('Yes. Ten in the crowd and one at the edge: 10 + 1 = 11.')], true),
            o('Ten', [N('Ten is just the crowd. Mirabel makes one more: 10 + 1 = 11.')]),
            o('Twelve', [
              N('Count again: ten in the crowd, and one more is Mirabel. 10 + 1 = 11.'),
            ]),
          ],
          'Added 10 + 1 = 11 in a story about a family photograph.',
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
        N(
          'The party fills the house. Music, dancing, food on every surface, and Luisa holding up the piano so people can dance under it.',
        ),
        N(
          'A man in the corner plays a tiple, a small Colombian guitar, and the whole courtyard keeps its beat.',
        ),
        N('Mirabel slips away to the edge of the courtyard, where it’s quieter. You follow her.'),
        MI('I’m happy for him. I am. I’m so happy for him.', 'sad'),
        N(
          'There is a crack in the plaster by her hand. As you watch, it runs up the wall like a crack in ice, and splits.',
        ),
        N(
          'The cracks race across the tiles, under the dancers’ feet, up the stairs and along the landing, towards the candle.',
        ),
        N('In the window, the candle’s flame shudders, and shrinks, and shudders.'),
        MI('No. Not the candle.', 'shock'),
        N('Mirabel runs. You run after her, through the dancers, and nobody else looks down.'),
      ],
      [
        doit(
          1,
          'music',
          'a steady beat; strings make sound by vibrating',
          '1-PS4-1',
          'edu:clap:beat:party',
          [
            N(
              'The tiple has twelve strings, in four sets of three. A string makes sound by shaking quickly when it is plucked.',
            ),
            N('(Clap along with the music: four steady beats, over and over.)'),
          ],
          'Clapped a steady beat, and learned that a tiple’s strings make sound by vibrating.',
        ),
      ],
      [
        ch('cracks', 'Follow the cracks.', [
          N(
            'You keep your eyes on the cracks. They are racing ahead of you, and they are all going one way: to the candle.',
          ),
        ]),
        ch('mirabel', 'Keep up with Mirabel.', [
          N(
            'You keep at her elbow, through a crowd that keeps stepping back into your way, all smiling.',
          ),
        ]),
      ],
    ),
    sc(
      'a22-04-party-done',
      [
        N('You reach the landing with her. The cracks reach it with you.'),
        N(
          'The landing floor is tiled in four rows of six tiles, and the cracks run across it corner to corner.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'rows and columns: 4 × 6',
          '3.MD.C.7',
          [N('The landing is tiled in four rows of six tiles. How many tiles are on the floor?')],
          [
            o(
              'Twenty-four',
              [N('Yes. Four rows of six is 6 + 6 + 6 + 6 = 24, or 4 × 6 = 24.')],
              true,
            ),
            o('Ten', [N('Ten is 4 + 6. We need four rows of six: 6, 12, 18, 24.')]),
            o('Twenty', [N('Close. Count the rows of six: 6, 12, 18, 24. So 4 × 6 = 24.')]),
          ],
          'Found the number of floor tiles by multiplying rows by columns: 4 × 6 = 24.',
        ),
      ],
    ),
    sc(
      'a22-04-cracks',
      [
        MI('Everybody! The house is in danger! Look at the cracks!', 'shock'),
        N('The music stops. The whole town turns round and looks up at the landing.'),
        N(
          'The wall behind her is smooth, and the tiles are whole. Casita has mended every crack in the time it took to shout.',
        ),
        AB('Mirabel. What cracks?', 'think'),
        MI('There were cracks. Right here, all through the house, and the candle was...'),
        N('The candle burns tall and still in the window, as if it had never moved.'),
        AB('Everything is fine. The miracle is strong. Music, please!', 'happy'),
        N(
          'The music starts again, louder. People dance a little too fast, and nobody quite looks at Mirabel.',
        ),
      ],
      [
        ask(
          7,
          'sel',
          'why people look away from a problem',
          'CASEL: Social awareness',
          [
            N(
              'Abuela says everything is fine, and the music starts again. Why might a person not want to see a problem, even when it is right in front of them?',
            ),
          ],
          [
            o('Because they are afraid of what it means', [
              N(
                'A thoughtful answer. Fear can make us look away, because seeing a problem might mean changing something precious.',
              ),
            ]),
            o('Because they want everyone to stay happy', [
              N(
                'A fair answer. Wanting a happy party can make us hush the one person who says something is wrong.',
              ),
            ]),
            o('Because they truly cannot see it', [
              N(
                'It can be true. Sometimes only one person sees a problem first, and that is lonely for them.',
              ),
            ]),
          ],
          'Thought about why people avoid seeing a problem, and how it feels to be the one who sees it.',
        ),
      ],
      [
        ch('saw', 'Say you saw them too.', [
          Y('I saw them.'),
          N(
            'Abuela looks at you, polite and closed, the way you look at a guest who has said something odd at dinner.',
          ),
          AB('Our guest is tired. It was a long journey.'),
        ]),
        ch('quiet', 'Say nothing, and stay by Mirabel.', [
          N(
            'You stand beside her and say nothing. It isn’t much, but she isn’t standing there alone.',
          ),
        ]),
      ],
    ),
    sc(
      'a22-04-lamp',
      [
        N(
          'You look down at the lamp at your belt. Its gold flame, the one Abuela lit from the candle, is shuddering.',
        ),
        N(
          'It shudders exactly as the candle did. Then it steadies, at the same moment the candle does.',
        ),
        MI('Yours too. You saw. You saw it.', 'shock'),
        N('She grips your wrist hard, then lets go, because her grandmother is watching.'),
      ],
      [
        ask(
          1,
          'science',
          'moving air makes a flame flicker',
          '3-PS2-1',
          [N('In real life, what is the usual reason a candle flame shudders?')],
          [
            o(
              'A draught of moving air',
              [
                N(
                  'Yes. Moving air pushes the flame and the hot gases rising from it, so the flame flickers.',
                ),
              ],
              true,
            ),
            o('A very loud noise', [
              N('Loud noises hardly bother a flame. Moving air does: a draught or a breath.'),
            ]),
            o('The colour of the candle', [
              N('Colour makes no difference to a flame. Moving air, such as a draught, does.'),
            ]),
          ],
          'Learned that moving air is the usual reason a candle flame flickers.',
        ),
      ],
    ),
    sc(
      'a22-04-complete',
      [
        N(
          'The party goes on until late. When the last neighbour goes home, the house tucks itself up, shutter by shutter.',
        ),
        N(
          'Mirabel sleeps alone in the nursery for the first time. Through the wall you hear her say goodnight to Antonio’s empty bed.',
        ),
        MI('Night, Toñito.', 'soft'),
        N('Your Nubbin, without being asked, goes and sleeps on the end of her bed.'),
      ],
      [
        notice(
          3,
          'health',
          'sleep helps the body and mind repair and grow',
          'CASEL: Self-management',
          [
            N(
              'Sleep is when the body does its repairs. Muscles rest and mend, and the brain sorts out the day.',
            ),
            N(
              'Children your age need about nine to twelve hours a night. A calm bedtime routine helps.',
            ),
          ],
          'Learned that sleep repairs the body and mind, and that children their age need about nine to twelve hours.',
        ),
      ],
    ),
  ],
  [
    gl(
      'tiple',
      'A small Colombian guitar with twelve strings in four sets of three.',
      'a22-04-party',
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
      goal: 'Decide how you will help Mirabel save the miracle.',
      hint: 'Choose your job: the eyes, the ears or the hands.',
    },
  },
  [
    sc(
      'a22-05-prayer',
      [
        N(
          'Late at night you wake to a soft light on the landing. Mirabel is already there, crouched behind the banister.',
        ),
        MI('Shh. Abuela.'),
        N(
          'Abuela Alma is alone at the candle. Beside it hangs a portrait of a young man with a kind face and a hat in his hands.',
        ),
        N('She speaks to the painting the way you speak to someone across a kitchen table.'),
        AB('Pedro. Something is wrong. I can feel it, and I can’t see it.', 'sad'),
        AB(
          'I have kept them safe. I have kept them strong. Every one of them has done their part.',
        ),
        AB('Tell me what I am doing wrong. Tell me what to do, and I will do it.', 'soft'),
        N(
          'The candle burns, and does not answer. Abuela touches the frame very lightly, and goes to bed with her back very straight.',
        ),
        N('Mirabel sits down on the top stair with her arms round her knees.'),
        MI('She’s scared. I’ve never seen her scared.', 'sad'),
      ],
      [
        ask(
          3,
          'social-studies',
          'how families keep the past alive: stories, pictures and keepsakes',
          'D2.His.2.K-2',
          [
            N(
              'Abuela talks to a portrait of Pedro, who died long ago. How do families keep the past alive when someone is gone?',
            ),
          ],
          [
            o('By telling stories aloud', [
              N(
                'A good way. Stories told aloud, passed from person to person, are called oral history, and they carry the past a long way.',
              ),
            ]),
            o('By keeping pictures and keepsakes', [
              N(
                'A good way too. A portrait, a hat or a letter can bring a person back into the room.',
              ),
            ]),
            o(
              'Both: stories, pictures and keepsakes together',
              [
                N(
                  'Yes. Families use all of them. Stories carry the voice, and pictures and keepsakes carry the face and the things a person touched.',
                ),
              ],
              true,
            ),
          ],
          'Talked about how families remember people through oral history, pictures and keepsakes.',
        ),
      ],
      [
        ch('sit', 'Sit down next to Mirabel.', [
          N(
            'You sit down beside her on the stair. Neither of you says anything for a while, and that helps more than talking would.',
          ),
        ]),
        ch('painting', 'Look at the painting.', [
          N(
            'Pedro is painted young, with a straw hat in his hands. He looks like a man who would stay behind on a riverbank.',
          ),
        ]),
      ],
    ),
    sc(
      'a22-05-plan',
      [
        N(
          'Mirabel waits until her grandmother’s door closes. Then she stands up, and you can see the decision land.',
        ),
        MI('Okay. Nobody else sees it. So I fix it. I save the miracle.', 'think'),
        MI(
          'I don’t have a gift, so I don’t have a gift to lose. I can go where they can’t, and ask what they won’t.',
        ),
        N('She is already making a list, in the dark, in pen on the back of her hand.'),
        MI('But I can’t do it alone. Will you help me? What do you want to be?'),
        MI(
          'My eyes, to map every crack? My ears, with Dolores, who hears everything? Or my hands, with Luisa, who carries everything?',
        ),
      ],
      [
        notice(
          5,
          'science',
          'animals’ senses suit their lives',
          '4-LS1-2',
          [
            N('Mirabel offers you three of the senses: sight, hearing and touch.'),
            N(
              'Animals rely on the senses that suit their lives. Owls have huge eyes and sharp hearing for the night, and bats find their way by listening to echoes.',
            ),
          ],
          'Learned that animals use the senses that suit their lives, such as owls’ sight and hearing and bats’ echoes.',
        ),
      ],
      [
        ch(
          'eyes',
          'Be the eyes: map the cracks with Mirabel.',
          [
            MI(
              'Yes. Two people looking. We start in the morning, and we write everything down.',
              'happy',
            ),
            N(
              'She tears a page out of her sketchbook for you. On it, in ink, she has drawn the whole house.',
            ),
          ],
          { 'a22-job': 'eyes' },
        ),
        ch(
          'ears',
          'Be the ears: make friends with Dolores.',
          [
            MI(
              'Dolores. Good. She hears everything, and nobody ever listens to her. Be kind to her.',
            ),
            N('From two floors away, a small voice says, “Thank you.” You both jump.'),
          ],
          { 'a22-job': 'ears' },
        ),
        ch(
          'hands',
          'Be the hands: help Luisa with her loads.',
          [
            MI(
              'Luisa. Yes. She’s carrying the whole town. If anything is cracking, she knows where it’s heavy.',
            ),
            N('Outside, very late, something very heavy is being put down very carefully.'),
          ],
          { 'a22-job': 'hands' },
        ),
      ],
    ),
    sc(
      'a22-05-complete',
      [
        N('Mirabel shakes your hand, very formally, in the dark on the stairs.'),
        MI(
          'Partners. Secret partners. Nobody can know, because if Abuela finds out I’m poking at the miracle...',
        ),
        N(
          'She does not finish. Your Nubbin offers its stubby hand too, and she shakes that just as seriously.',
        ),
        N('Then you both go to bed, and neither of you sleeps for ages.'),
      ],
      [
        ask(
          3,
          'sel',
          'carrying a worry alone versus sharing it',
          'CASEL: Responsible decision-making',
          [
            N(
              'Mirabel will carry this secret mostly alone. Is it fair for one person to carry a family’s trouble? What might help her?',
            ),
          ],
          [
            o('Telling someone she trusts', [
              N(
                'A wise idea. A worry shared is usually lighter, and a trusted person can see what we cannot.',
              ),
            ]),
            o('Carrying on carefully by herself', [
              N(
                'It is a brave plan, but a heavy one. Even careful people need somebody to talk to.',
              ),
            ]),
            o('Letting her new partner share it', [
              N(
                'A good start. Sharing with a partner is lighter, and she has chosen you for that.',
              ),
            ]),
          ],
          'Thought about whether one person should carry a family’s trouble alone, and what helps.',
        ),
      ],
    ),
  ],
  [gl('portrait', 'A painting or drawing of a person.', 'a22-05-prayer')],
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
        N('In the morning Mirabel starts with Luisa, because Luisa notices when things get heavy.'),
        N(
          'You find her at the edge of the village, carrying donkeys back from the river, two at a time.',
        ),
        N('There are fourteen donkeys to bring back, and she can carry only two on each trip.'),
        LU(
          'Hi. Can’t talk. Donkeys. Then the bridge. Then the church wants moving a bit to the left.',
        ),
        MI('The church?'),
        LU('The priest says the light’s better.'),
        MI('Luisa. Have you seen anything weird? With the house? Cracks?'),
        N('Luisa goes still. Then she laughs, too loudly, and picks the donkeys up again.'),
        LU('I’m fine. Everything’s fine. I’m the strong one. Nothing cracks on me.'),
      ],
      [
        ask(
          2,
          'maths',
          'division: 14 ÷ 2',
          '3.OA.A.3',
          [N('There are fourteen donkeys, and Luisa carries two on each trip. How many trips?')],
          [
            o('Seven', [N('Yes. 14 ÷ 2 = 7, because 7 × 2 = 14.')], true),
            o('Twelve', [N('Twelve is 14 − 2. Share 14 into twos: 14 ÷ 2 = 7, since 7 × 2 = 14.')]),
            o('Twenty-eight', [
              N('That is 14 × 2, which is double. We want 14 ÷ 2 = 7, since 7 × 2 = 14.'),
            ]),
          ],
          'Divided 14 by 2 to find the number of trips.',
        ),
      ],
      [
        ch('carry', 'Offer to carry something.', [
          LU('You?'),
          N(
            'She hands you a sack of coffee beans, the smallest thing she has. You carry it as if it matters, and she notices.',
          ),
        ]),
        ch('walk', 'Walk beside her, and don’t ask anything.', [
          N(
            'You walk beside her all the way to the bridge. By the time you get there, her shoulders have come down half an inch.',
          ),
        ]),
      ],
    ),
    sc(
      'a22-06-loads-done',
      [
        N(
          'By noon the bridge is mended and the church is a bit to the left. Luisa sits down on a wall as if somebody had cut her strings.',
        ),
        N('Her arms are trembling. Her muscles have been working without a break since dawn.'),
      ],
      [
        ask(
          1,
          'health',
          'muscles repair and grow stronger with rest',
          '4-LS1-1',
          [N('Why do tired muscles feel better after a rest?')],
          [
            o(
              'Rest lets them mend and grow stronger',
              [
                N(
                  'Yes. Hard work makes tiny tears in muscle, and resting, eating well and sleeping let the body repair them.',
                ),
              ],
              true,
            ),
            o('Rest makes them smaller', [
              N('It does not. Muscles grow stronger when they get time to repair.'),
            ]),
            o('They do not change', [
              N('They do. During rest, the body repairs muscles so they can work again.'),
            ]),
          ],
          'Learned that muscles repair and grow stronger when they rest.',
        ),
      ],
    ),
    sc(
      'a22-06-boot',
      [
        N(
          'Your Nubbin, which has trotted behind the donkeys all morning, climbs onto Luisa’s boot, turns round twice, and falls asleep.',
        ),
        N('Luisa looks down at it. She does not move her foot.'),
        LU('It’s heavy. For a little thing.', 'soft'),
        LU('Do you ever feel like if you stop, even for a second, everything falls over?', 'sad'),
        MI('You can stop, Luisa.'),
        LU('I can’t. If I’m not strong, what am I for?', 'sad'),
        N(
          'Nobody answers that, because there isn’t an answer that would help. Your Nubbin snores, very softly, on her boot.',
        ),
        LU('There’s something. Before Tío Bruno left, he had a vision about the house.', 'think'),
        LU(
          'He went up his tower and saw something, and then he was gone. Abuela won’t have it talked about.',
        ),
        MI('Saw what?'),
        LU('Nobody knows. It’s still up there, in his room. Nobody goes in his room.'),
      ],
      [
        ask(
          5,
          'sel',
          'a person’s worth and what they can do',
          'CASEL: Self-awareness',
          [
            N(
              'Luisa asks, “If I’m not strong, what am I for?” Is a person only worth what they can do for others?',
            ),
          ],
          [
            o('No: people are worth something just by being themselves', [
              N(
                'A kind answer, and many people would agree. Luisa is loved for who she is, though she finds that hard to believe.',
              ),
            ]),
            o('It’s nice to be useful, but that isn’t all there is', [
              N(
                'A balanced answer. Helping others is a joy, but it is only one part of who a person is.',
              ),
            ]),
            o('I’m not sure', [
              N(
                'That is an honest answer. It is a big question, and Luisa is only just starting to ask it.',
              ),
            ]),
          ],
          'Thought about whether a person is worth only what they can do, and how it feels to believe that.',
        ),
      ],
      [
        ch('thank', 'Thank her.', [
          LU('Don’t. I didn’t say anything.', 'soft'),
          N('But she smiles, a little, for the first time today.'),
        ]),
        ch('stay', 'Stay until your Nubbin wakes up.', [
          N(
            'You stay. Luisa doesn’t move her boot for half an hour, and the town manages without her, and nothing falls over.',
          ),
        ]),
      ],
    ),
    sc(
      'a22-06-complete',
      [
        N(
          'Your Nubbin wakes, yawns, and climbs down. Luisa stands up and stretches, and something in her back clicks.',
        ),
        LU('Don’t tell anyone I sat down.', 'happy'),
        MI('Bruno’s tower. We have to go up.', 'think'),
        N(
          'Up the hill, the tower at the end of the house stands with its back to everybody, as if it isn’t listening.',
        ),
      ],
      [
        ask(
          3,
          'literacy',
          'personification: giving a thing human behaviour',
          'L.4.5',
          [
            N(
              'The writer says the tower “stands with its back to everybody, as if it isn’t listening.” What is the writer doing?',
            ),
          ],
          [
            o(
              'Describing the tower as if it were a person',
              [
                N(
                  'Yes. Giving a thing human behaviour is called personification. It tells us the tower feels shut away and secretive.',
                ),
              ],
              true,
            ),
            o('Giving the tower a real back', [
              N(
                'A tower has no back like a person. The writer is comparing it to a person, which is called personification.',
              ),
            ]),
            o('Saying the tower is broken', [
              N(
                'Not broken. The writer is describing the tower as if it were a person who has turned away.',
              ),
            ]),
          ],
          'Recognised personification: describing a tower as if it were a person.',
        ),
      ],
    ),
  ],
  [gl('exhausted', 'Very, very tired, with no energy left.', 'a22-06-boot')],
);

// ================================================================== A22-7 Bruno’s Room
const Q7: EduQuest = quest(
  'a22-07',
  'Bruno’s Room',
  {
    'a22-07-s1': {
      goal: 'Get into Bruno’s tower without anyone seeing.',
      hint: 'Wait until the house is busy, then go to the dark door at the end of the landing.',
    },
    'a22-07-s2': {
      goal: 'Climb the sand stairs to the top of the tower.',
      hint: 'Keep climbing; the steps shift under you. Cross the gap together.',
    },
    'a22-07-s3': {
      goal: 'Piece together the green glass of Bruno’s vision.',
      hint: 'Fit the pieces of glass together on the cave floor.',
    },
  },
  [
    sc(
      'a22-07-door',
      [
        N(
          'You wait until the house is busy with dinner plans. Then Mirabel leads you along the landing to the door at the end.',
        ),
        N(
          'It is a dark door, with a hooded figure on it, half hidden. Its glow is very faint and very green.',
        ),
        MI('Okay. In and out. Nobody will ever know.'),
        N(
          'At the end of the corridor Antonio is sitting on the floor with a toucan and a coati, watching you with enormous eyes.',
        ),
        AN('You’re going in Tío Bruno’s room.', 'shock'),
        MI('No. Yes. Don’t tell.'),
        N('Antonio listens to the coati, very seriously.'),
        AN(
          'I won’t. She won’t either. She says your Nubbin is very brave and a bit silly.',
          'happy',
        ),
      ],
      [
        ask(
          7,
          'art',
          'a picture can say who a person is',
          'CASEL: Self-awareness',
          [
            N(
              'Every door in this house shows a picture of the person inside: Antonio’s door shows animals. What can a picture on a door say that a name cannot?',
            ),
          ],
          [
            o('What the person loves', [
              N(
                'A lovely answer. A picture can show a love, such as animals, in one look, where a name just labels you.',
              ),
            ]),
            o('What the person is good at', [
              N(
                'A good answer. A picture can show a talent at a glance, and other people can see it from far off.',
              ),
            ]),
            o('How they want to be seen', [
              N(
                'A thoughtful answer. Choosing a picture is choosing how to introduce yourself, and that is what artists do.',
              ),
            ]),
          ],
          'Thought about how a picture can show who a person is, as the doors in this house do.',
        ),
      ],
      [
        ch('coati', 'Thank the coati.', [
          N(
            'The coati sniffs, in a way you decide means you’re welcome. Antonio says it means “obviously”.',
          ),
        ]),
        ch('nubbin', 'Ask Antonio what your Nubbin thinks.', [
          AN('It says it isn’t scared, because you’re here. And it’s a bit scared.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a22-07-door-done',
      [
        N('Mirabel pushes the door, and it opens onto sand.'),
        N(
          'The sand is fine and pale, and it drifts at the edges, all the way up the stairs ahead.',
        ),
        N('The door closes behind you, by itself, softly. Casita doesn’t want anyone to hear.'),
      ],
      [
        ask(
          1,
          'science',
          'sand is made of rock worn down by wind and water',
          '4-ESS2-1',
          [N('Sand is made of tiny grains. Where do the grains come from?')],
          [
            o(
              'Rocks that wind and water slowly wear away',
              [
                N(
                  'Yes. Wind and moving water slowly break rock into smaller and smaller pieces. This is called weathering and erosion.',
                ),
              ],
              true,
            ),
            o('Burnt wood', [
              N(
                'Burnt wood makes ash, which is different. Sand is rock worn down over a very long time.',
              ),
            ]),
            o('Sugar', [
              N('It looks a little like sugar, but sand is tiny pieces of rock, worn down slowly.'),
            ]),
          ],
          'Learned that sand is rock worn down over time by wind and water.',
        ),
      ],
    ),
    sc(
      'a22-07-stairs',
      [
        N('Inside is a staircase going straight up, made of sand, with no top that you can see.'),
        N(
          'The air smells of dust and old candles. Somewhere above, sand is pouring like a slow clock.',
        ),
        N(
          'The steps shift under your feet, and Mirabel climbs, and slips, and climbs again. Your Nubbin uses its wings, which helps a bit.',
        ),
        N(
          'Halfway up, the stairs crumble in front of you, and there is a long drop into the dark.',
        ),
        MI('Okay. Big jump. Totally fine.', 'shock'),
        N('Mirabel looks at you.'),
      ],
      [
        ask(
          4,
          'sel',
          'bravery means acting while scared',
          'CASEL: Self-management',
          [
            N(
              'Mirabel says “totally fine”, but her voice shakes. Is being brave the same as not being scared?',
            ),
          ],
          [
            o(
              'No: brave means going on while you are scared',
              [
                N(
                  'Yes. Courage and fear go together. Brave people feel the fear and act anyway, and it is easier with someone beside you.',
                ),
              ],
              true,
            ),
            o('Yes: brave people feel no fear', [
              N(
                'It seems that way, but even the bravest people feel afraid. Being brave is doing it anyway.',
              ),
            ]),
          ],
          'Talked about bravery as acting while scared, and how a friend beside us helps.',
        ),
      ],
      [
        ch('jump', 'Jump first, and catch her.', [
          N(
            'You jump, and land hard, sand to your knees. Mirabel jumps, and you catch her by the wrist.',
          ),
        ]),
        ch('thread', 'Tie her embroidery thread to the rail.', [
          N(
            'Mirabel’s bag is full of embroidery thread, of course. Twisted twelve times, it holds, just.',
          ),
        ]),
        ch('nubbin', 'Let your Nubbin flap over first.', [
          N(
            'Your Nubbin flaps over, puffing, and sits on the far side looking pleased. If it can, you can, so you both jump.',
          ),
        ]),
      ],
    ),
    sc(
      'a22-07-stairs-done',
      [
        N('At the top the stairs end at a cave mouth, glittering and green.'),
        N('Inside, the floor is covered in broken glass.'),
        N('Every piece catches the green light and throws it back, in tiny sparks on the walls.'),
      ],
      [
        ask(
          2,
          'literacy',
          'words that use the senses',
          'RL.1.4',
          [N('The writer calls the cave “glittering”. Which sense is that word using?')],
          [
            o(
              'Sight',
              [N('Yes. “Glittering” tells us how the cave looks: full of tiny flashes of light.')],
              true,
            ),
            o('Hearing', [N('We cannot hear a glitter. The word tells us about sight.')]),
            o('Taste', [N('We cannot taste a glitter. The word tells us about sight.')]),
          ],
          'Identified which sense a describing word uses.',
        ),
      ],
    ),
    sc(
      'a22-07-glass',
      [
        N('The pieces are thick, green and curved, like a big broken bottle.'),
        N('There are eight pieces in all, and every one has a bit of a picture in it.'),
        MI('His visions. He made them in glass. This is it. This has to be it.'),
        N(
          'You lay the pieces on the cave floor. They click together where they fit, as if they wanted to.',
        ),
        N('A hand, a pair of round glasses, a girl’s face.'),
        N('Behind the girl, the house. And through the house, running everywhere, the cracks.'),
        MI('That’s me.', 'shock'),
        MI('That’s me, and the house is breaking behind me.', 'sad'),
        N(
          'Green light pours up out of the glass onto her face. Far below, the stairs are starting to slide.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'unit fractions: one of eight equal parts',
          '3.NF.A.1',
          [
            N(
              'Say the eight pieces of the vision were all the same size. What fraction of the whole picture would one piece be?',
            ),
          ],
          [
            o(
              'One eighth',
              [
                N(
                  'Yes. One of eight equal parts is 1/8, and all eight pieces together make one whole.',
                ),
              ],
              true,
            ),
            o('One quarter', [
              N('One quarter would need four equal pieces. With eight, each is 1/8.'),
            ]),
            o('One half', [N('One half would need two equal pieces. With eight, each is 1/8.')]),
          ],
          'Named a unit fraction: one of eight equal pieces is 1/8.',
        ),
      ],
      [
        ch('wrap', 'Help her wrap the pieces.', [
          N('You wrap the glass in your scarf, every piece, as fast as you can.'),
        ]),
        ch('hold', 'Put a hand on her shoulder.', [
          N(
            'She is shaking. You keep your hand there until she stops, which is not long, because the floor is moving.',
          ),
        ]),
      ],
    ),
    sc(
      'a22-07-complete',
      [
        N(
          'You run. The sand stairs pour away under your feet, and you slide most of the way down with the glass held tight.',
        ),
        N('You tumble out of the tower door onto the landing, covered in sand, and freeze.'),
        N(
          'Isabela is walking past with a vase of lilies, perfectly dressed. She doesn’t see you; nobody does.',
        ),
        MI('Nobody can know about this. Nobody.', 'shock'),
        N('Your Nubbin coughs up a small amount of sand.'),
      ],
      [
        ask(
          3,
          'literacy',
          'a character’s motive for secrecy',
          'RL.3.3',
          [N('Mirabel says nobody can know about the tower. Whom is she protecting?')],
          [
            o('Her family', [
              N(
                'A fair answer. She does not want her family frightened, or Abuela angry, before she understands.',
              ),
            ]),
            o('Herself', [
              N(
                'A fair answer too. She does not want to be blamed or sent away from the secret she has found.',
              ),
            ]),
            o('Both', [
              N(
                'A thoughtful answer. People’s reasons are often mixed. Mirabel is trying to protect her family and she is also afraid.',
              ),
            ]),
          ],
          'Thought about a character’s mixed motives for keeping a secret.',
        ),
      ],
    ),
  ],
  [gl('glittering', 'Shining with many small flashes of light.', 'a22-07-stairs-done')],
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
        N('You carry the wrapped glass to the nursery and slide it under Antonio’s old bed.'),
        N(
          'Mirabel sits on the floor with her back to the bed. Her father puts his head round the door, and stops.',
        ),
        AG('Is that sand? Why are you covered in sand?', 'shock'),
        MI('Papá. You can’t tell anyone. Promise.'),
        N(
          'She shows him a piece of the glass. Agustín sits down slowly on the end of the bed, and a bee lands on his ear.',
        ),
        AG('Bruno’s vision. Oh. Oh, no.', 'shock'),
        AG(
          'Mariano’s family is coming to dinner tonight. He is going to propose to Isabela. Abuela has planned it for weeks.',
        ),
        AG(
          'We say nothing until after the dinner. One night. Then we tell Abuela, together, gently.',
          'think',
        ),
      ],
      [
        ask(
          7,
          'sel',
          'whether to tell now or wait',
          'CASEL: Responsible decision-making',
          [
            N(
              'Agustín asks everyone to keep the secret for one night. Is a short delay kind, or would telling Abuela now be fairer to her?',
            ),
          ],
          [
            o('A short delay is kind', [
              N(
                'A fair view. A calm moment and a gentle voice can matter, and the dinner is only one night away.',
              ),
            ]),
            o('Telling her now is fairer', [
              N(
                'A fair view too. Abuela cares about the house most of all, and she may want to know straight away.',
              ),
            ]),
            o('It depends how worried we are', [
              N(
                'A wise view. The more serious the danger, the less waiting is safe. A worrying secret should always reach a trusted grown-up.',
              ),
            ]),
          ],
          'Weighed whether to wait or tell at once, and noted that worrying secrets should reach a trusted grown-up.',
        ),
      ],
      [
        ch('agree', 'Agree with him.', [Y('One night.'), AG('One night. Thank you.', 'soft')]),
        ch('disagree', 'Say Abuela should know now.', [
          AG('Maybe. Maybe you’re right. But not with the Guzmáns at the gate. Please.'),
        ]),
        ch('mirabel', 'Let Mirabel decide.', [MI('One night. Then everything.', 'sad')]),
      ],
    ),
    sc(
      'a22-08-hide-done',
      [
        AG('And Mirabel? Wash the sand off. It’s in your ears.'),
        N('It is in your ears too, and it itches.'),
      ],
      [
        ask(
          1,
          'health',
          'earwax protects the ear',
          '4-LS1-1',
          [N('Sand in the ears is itchy, but ears have a natural guard. What does earwax do?')],
          [
            o(
              'It traps dust and protects the ear',
              [
                N(
                  'Yes. Earwax catches dust and germs and keeps the ear clean. Never poke anything into your ears.',
                ),
              ],
              true,
            ),
            o('It helps us hear far away', [
              N('It does not help hearing. Earwax traps dust and protects the ear.'),
            ]),
            o('Nothing at all', [N('It does a useful job: it traps dust and protects the ear.')]),
          ],
          'Learned that earwax traps dust and protects the ear.',
        ),
      ],
    ),
    sc(
      'a22-08-prep',
      [
        N(
          'The whole house is getting ready: tables, cloths, flowers, and Isabela’s hair, which Casita is helping with.',
        ),
        N(
          'Pepa’s cloud is very small and very tidy. Félix keeps telling her it will be lovely, which helps a bit.',
        ),
        N(
          'Mirabel lays candles down the long table, too carefully. She keeps looking at the nursery door.',
        ),
        N(
          'The table is five metres long and one metre wide, and Casita is edging its cloth with lace.',
        ),
        N(
          'On the stairs Dolores is sitting with her hands over her ears. She looks up at you, and quickly away.',
        ),
        MI('Dolores is weird today. Weirder.', 'think'),
        N(
          'Down in the kitchen Julieta is frying buñuelos, and the smell goes all through the house.',
        ),
      ],
      [
        ask(
          3,
          'maths',
          'perimeter of a rectangle',
          '3.MD.D.8',
          [
            N(
              'Lace edging goes right round the table’s edge. The table is 5 m long and 1 m wide. How much lace is needed?',
            ),
          ],
          [
            o(
              'Twelve metres',
              [N('Yes. Perimeter is all the way round: 5 + 1 + 5 + 1 = 12 metres.')],
              true,
            ),
            o('Six metres', [
              N(
                'Six is only one long side and one short side. All four sides: 5 + 1 + 5 + 1 = 12.',
              ),
            ]),
            o('Five metres', [
              N('Five is one long side. Go all the way round: 5 + 1 + 5 + 1 = 12 metres.'),
            ]),
          ],
          'Found the perimeter of a rectangle: 5 + 1 + 5 + 1 = 12 metres.',
        ),
      ],
      [
        ch('candles', 'Help Mirabel with the candles.', [
          N(
            'You lay candles together, all the way down. At the end she lets out a breath she has been holding since the tower.',
          ),
        ]),
        ch('dolores', 'Smile at Dolores.', [
          N('Dolores smiles back, tightly, and puts her hands over her ears again.'),
        ]),
      ],
    ),
    sc(
      'a22-08-prep-done',
      [N('The bell rings at the gate. The Guzmáns are here.'), MI('One night.', 'think')],
      [
        ask(
          0,
          'science',
          'a ringing bell vibrates',
          '1-PS4-1',
          [
            N(
              'A bell makes sound because it vibrates. What would you feel if you touched a ringing bell?',
            ),
          ],
          [
            o(
              'A fast shaking',
              [
                N(
                  'Yes. The bell’s metal shakes quickly back and forth, and that shaking is the sound.',
                ),
              ],
              true,
            ),
            o('Nothing at all', [
              N('You would feel the shaking. It is the vibration that makes the sound.'),
            ]),
            o('It feels icy', [
              N('Not icy. You would feel it shake. That vibration is the sound.'),
            ]),
          ],
          'Learned that sounds are made by vibrations, such as a ringing bell.',
        ),
      ],
    ),
    sc(
      'a22-08-complete',
      [
        N(
          'Mariano Guzmán comes in with his mother. He is tall, serious, and holding flowers for Isabela, who has more flowers than anybody.',
        ),
        N('Dolores, on the stairs, watches him go by with a look you cannot read.'),
        SG('What a house. What a family!', 'happy'),
        AB('Welcome. Sit, sit. Tonight is a night for the family.', 'happy'),
        N(
          'From the kitchen comes the smell of buñuelos, crisp golden balls of fried cheese dough.',
        ),
      ],
      [
        notice(
          4,
          'social-studies',
          'welcoming guests with food and a seat; buñuelos',
          'D2.Civ.8.K-2',
          [
            N('Welcoming guests with a seat and something to eat is part of many cultures.'),
            N(
              'In many Colombian homes, guests are offered food and coffee as soon as they sit down.',
            ),
            N('Buñuelos are fried balls of cheese dough, and many families eat them at Christmas.'),
          ],
          'Learned that welcoming guests with food is part of many cultures, and met buñuelos.',
        ),
      ],
    ),
  ],
  [
    gl(
      'hospitality',
      'Welcoming guests kindly, with food, a seat and a friendly face.',
      'a22-08-complete',
    ),
    gl(
      'buñuelo',
      'A crisp, golden ball of fried cheese dough, eaten in Colombia.',
      'a22-08-complete',
    ),
  ],
);

// ================================================================== A22-9 The Dinner
const Q9: EduQuest = quest(
  'a22-09',
  'The Dinner',
  {
    'a22-09-s1': {
      goal: 'Sit down to dinner with the Madrigals and the Guzmáns.',
      hint: 'Take your seat at the long table, beside Mirabel.',
    },
    'a22-09-s2': {
      goal: 'Do the job you chose on the landing.',
      hint: 'Eyes: watch the wall the crack is running for. Ears: get Dolores out. Hands: hold up the table with Luisa.',
    },
  },
  [
    sc(
      'a22-09-dinner',
      [
        N(
          'The long table is full: candles, flowers, Julieta’s best dishes. Casita passes the plates along by itself, tile by tile.',
        ),
        SG('Mariano has something he would like to ask.', 'happy'),
        N(
          'Mariano clears his throat, and Isabela smiles her perfect smile. Under the table, Mirabel’s knee is jiggling.',
        ),
        N('Then a little sound starts on the stairs: Dolores, whispering to herself, very fast.'),
        DO('Vision. Mirabel. The house. The glass...'),
        N(
          'The whisper goes round the table like a draught. Camilo turns into a hooded figure before he can stop himself.',
        ),
        PE('Bruno? A vision?', 'shock'),
        N(
          'A little rain starts to fall on the table, then a lot. Isabela’s flowers start growing out of the soup.',
        ),
        N('And under the table, very quietly, the floor begins to crack.'),
        MI('Everybody, wait, please, it’s not...', 'shock'),
      ],
      [
        ask(
          7,
          'science',
          'how rain forms in a cloud',
          '3-PS2-1',
          [
            N(
              'Real rain forms when tiny droplets in a cloud join together. What happens when they grow heavy enough?',
            ),
          ],
          [
            o(
              'They fall as rain',
              [N('Yes. Droplets join, grow heavy, and gravity pulls them down as rain.')],
              true,
            ),
            o('They float higher', [
              N('Heavy drops cannot float. Gravity pulls them down as rain.'),
            ]),
          ],
          'Learned that rain falls when cloud droplets join and become too heavy to float.',
        ),
      ],
      [
        ch('mirabel', 'Grab Mirabel’s hand under the table.', [
          N(
            'She grips your hand so hard it hurts. Then she lets go, because you both have work to do.',
          ),
        ]),
        ch('job', 'Remember your job.', [
          N(
            'You remember the stairs at midnight, and what you promised. You push your chair back.',
          ),
        ]),
      ],
    ),
    sc(
      'a22-09-eyes',
      [
        N('Everything happens at once. You remember your job: you are the eyes.'),
        N(
          'You have mapped the cracks with Mirabel for days, on her drawing of the house. You know where they run.',
        ),
        N(
          'The crack under the table is running for the east wall, where the big painted dresser stands, full of plates.',
        ),
        N('Señora Guzmán is sitting right underneath it.'),
        N('Mirabel sees where you are looking, follows your eyes, and goes white.'),
        MI('The wall! The east wall!', 'shock'),
      ],
      [
        ask(
          2,
          'social-studies',
          'compass directions: the Sun rises in the east',
          'D2.Geo.2.K-2',
          [N('The crack is running for the east wall. In which direction does the Sun rise?')],
          [
            o(
              'East',
              [
                N(
                  'Yes. The Sun rises in the east and sets in the west. Face the sunrise, and west is behind you.',
                ),
              ],
              true,
            ),
            o('West', [N('West is where the Sun sets. It rises in the east.')]),
            o('North', [N('North is neither. The Sun rises in the east and sets in the west.')]),
          ],
          'Learned that the Sun rises in the east, and used compass directions.',
        ),
      ],
      [
        ch('warn', 'Shout to Señora Guzmán to move.', [
          Y('Señora! Move!'),
          N(
            'She moves. The dresser comes off the wall a moment later, and Luisa catches it, plates and all.',
          ),
        ]),
        ch('pull', 'Pull her chair back yourself.', [
          N(
            'You grab her chair and drag it back. The dresser tips, and Luisa catches it in one hand without looking.',
          ),
        ]),
      ],
    ),
    sc(
      'a22-09-job-done',
      [
        N('Nobody is hurt. That is the best that can be said for it.'),
        N(
          'Julieta goes from person to person: are you hurt, are you all right? She is not healing anyone now, only caring.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'checking on people after a scare',
          'CASEL: Social awareness',
          [N('After a scare, what is the first kind thing to do for the people near you?')],
          [
            o(
              'Check whether they are hurt or upset',
              [N('Yes. Caring comes first, and fixing and blaming can wait.')],
              true,
            ),
            o('Ask whose fault it was', [
              N('Blame can wait. First, check that everybody is all right.'),
            ]),
            o('Clear up the mess', [
              N('The mess can wait. People matter more, so check on them first.'),
            ]),
          ],
          'Practised putting people’s feelings and safety before blame or mess.',
        ),
      ],
    ),
    sc(
      'a22-09-complete',
      [
        N(
          'The rain stops, and the cracks stop. The room is soaked, and the Guzmáns are standing by the door with petals in their hair.',
        ),
        MA('Thank you for dinner.', 'sad'),
        N(
          'Mariano looks at the floor, and Isabela isn’t smiling now. The Guzmáns leave, and nobody stops them.',
        ),
        AB('Mirabel.', 'angry'),
        N(
          'That is all she says. Mirabel is gone, out of the room, and the candle in the window is burning lower.',
        ),
      ],
      [
        ask(
          3,
          'literacy',
          'telling apart anger and fear in a character’s voice',
          'RL.3.6',
          [
            N(
              'Abuela says only one word, “Mirabel.” Is her voice angry, or afraid? Can it be both?',
            ),
          ],
          [
            o('Angry', [
              N(
                'It sounds angry, and anger is part of it. Many readers also hear what is under it: she is frightened.',
              ),
            ]),
            o('Afraid', [
              N(
                'A good reading. Her fear is real, and it comes out hard, like anger, because she is losing control.',
              ),
            ]),
            o('Both at once', [
              N(
                'A thoughtful reading. Fear often hides under anger, and Abuela may feel both, though she shows only the anger.',
              ),
            ]),
          ],
          'Thought about how fear and anger can sound alike, and read a character’s voice.',
        ),
      ],
    ),
  ],
  [gl('dresser', 'A tall piece of furniture with shelves, used to display plates.', 'a22-09-eyes')],
);

// ================================================================== A22-10 Rats in the Walls
const Q10: EduQuest = quest(
  'a22-10',
  'Rats in the Walls',
  {
    'a22-10-s1': { goal: 'Find Mirabel after the dinner.', hint: 'Go to the nursery.' },
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
        N('You find Mirabel in the nursery, on the floor, putting the glass vision back together.'),
        MI('I ruined it. The dinner, Isabela, everything.', 'sad'),
        N(
          'Then you both notice: a piece is missing, then another. The glass is going, one piece at a time.',
        ),
        N(
          'A small grey rat is carrying a shard of green glass in its teeth towards a hole in the skirting board.',
        ),
        MI('Hey! That’s... hey!'),
        N('The rat looks at you over its shoulder, and slips into the wall.'),
      ],
      [
        ask(
          3,
          'science',
          'a rodent’s front teeth never stop growing',
          '4-LS1-1',
          [N('A rat’s front teeth never stop growing. Why does a rat gnaw so much?')],
          [
            o(
              'Gnawing wears the teeth down so they stay short',
              [
                N(
                  'Yes. Rats gnaw all day, and that keeps their ever-growing front teeth at the right length.',
                ),
              ],
              true,
            ),
            o('It makes the teeth longer', [
              N('The opposite. Gnawing wears the teeth down, which stops them growing too long.'),
            ]),
            o('It is bored', [
              N('Maybe, sometimes, but the real reason is that gnawing wears the teeth down.'),
            ]),
          ],
          'Learned that rodents gnaw to wear down teeth that never stop growing.',
        ),
      ],
      [
        ch('follow', 'Follow it.', [
          N(
            'The hole is far too small. But the panel beside it swings open, as if Casita had made up her mind.',
          ),
        ]),
        ch('antonio', 'Wake Antonio to ask the rats.', [
          AN(
            'They say they’re not allowed to tell. They say their boss is very nice and very sad.',
          ),
          N('Then the panel beside the hole swings open, as if Casita had made up her mind.'),
        ]),
      ],
    ),
    sc(
      'a22-10-glass-done',
      [
        N(
          'Behind the panel is a narrow passage between the walls, with a candle stub burning somewhere far ahead.',
        ),
        N(
          'You count forty of your own steps along it, and each of your steps is about half a metre.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'multiplying and converting units: 40 × 50 cm',
          '4.MD.A.2',
          [N('Forty steps of half a metre each. How long is the passage?')],
          [
            o('Twenty metres', [N('Yes. Half of 40 is 20, so 40 × ½ m = 20 m.')], true),
            o('Forty metres', [
              N('Forty metres would be forty full-metre steps. Half-metre steps make 20 m.'),
            ]),
            o('Eighty metres', [
              N('That doubles instead of halving. Half a metre times 40 is 20 m.'),
            ]),
          ],
          'Found a length by multiplying 40 steps by half a metre: 20 m.',
        ),
      ],
    ),
    sc(
      'a22-10-walls',
      [
        N(
          'The passage runs behind every room. Through the plaster you hear the family: Pepa crying, Félix murmuring, Luisa pacing.',
        ),
        N(
          'Every crack you pass has been patched: some with clay, some with a strip of cloth, one with chewed-up bread.',
        ),
        N(
          'You come to a little room built inside the walls from bits and pieces. A table is laid for one, with a cracked cup.',
        ),
        N(
          'In front of a crack, a thin man in a green hood is kneeling with a trowel, filling it in, very gently.',
        ),
        N('A row of rats is sitting in front of him, watching. He is doing all their voices.'),
        BR(
          'And the handsome rat says, “I will not take your cheese, señor,” and the crowd goes wild.',
          'happy',
        ),
        N('He sees you, and he sees Mirabel. He drops the trowel.'),
        BR('Oh. Oh, no. Hi.', 'shock'),
        MI('Tío Bruno?', 'shock'),
      ],
      [
        ask(
          3,
          'literacy',
          'working out a word’s meaning from context: trowel',
          'L.3.4',
          [
            N(
              'Bruno kneels with a trowel, filling in a crack very gently. From the clues, what is a trowel?',
            ),
          ],
          [
            o(
              'A small flat tool for spreading plaster or clay',
              [
                N(
                  'Yes. The clues are “filling in a crack” and “kneeling”, and a trowel is just the tool for the job.',
                ),
              ],
              true,
            ),
            o('A kind of rat', [
              N(
                'The rats are sitting in a row, and the trowel is something he holds. It is a tool for spreading plaster.',
              ),
            ]),
            o('A candle', [
              N('The candle is somewhere else. The trowel is the tool he uses to fill the crack.'),
            ]),
          ],
          'Worked out the meaning of trowel from context clues.',
        ),
      ],
      [
        ch('wave', 'Wave.', [
          BR('Hi. Sorry. Hi.'),
          N(
            'He knocks on the wall three times, quickly, and throws a pinch of salt over his shoulder.',
          ),
        ]),
        ch('rats', 'Sit down with the rats.', [
          N(
            'You sit at the end of the row, and a rat shuffles up to make room. Bruno stares at you, then, very slowly, he smiles.',
          ),
        ]),
      ],
    ),
    sc(
      'a22-10-bruno',
      [
        BR('I never left. I couldn’t leave. I just went in the walls.', 'sad'),
        BR(
          'Ten years. The cracks, I patch them. Not well. I’m not good with my hands. The rats help.',
          'soft',
        ),
        MI('You’ve been here the whole time? Right behind us?'),
        BR(
          'I could hear everybody. Pepa’s birthdays. Your mamá cooking. Antonio being born. I was at all of it, from in here.',
        ),
        BR(
          'Every time I had a vision, people thought I made the bad things happen. And I loved them. So I went where I couldn’t do harm.',
        ),
        MI('The vision. Of me. What does it mean?'),
        BR(
          'I don’t know. I didn’t see the end. It was you and the house cracking, and I couldn’t see if you broke it or saved it.',
        ),
        N(
          'He looks at Mirabel’s face for a long moment, as if he has been waiting ten years to look at it.',
        ),
        BR('I couldn’t let them think it was you. So I took the vision, and I went.', 'soft'),
      ],
      [
        ask(
          8,
          'sel',
          'whether hiding to protect others is love',
          'CASEL: Responsible decision-making',
          [
            N(
              'Bruno hid for ten years so his family could not blame him. Was that love, fear, or both? Could he have kept them safe another way?',
            ),
          ],
          [
            o('Love', [
              N(
                'A kind reading. He wanted to spare them, and he stayed close, patching their cracks.',
              ),
            ]),
            o('Fear', [
              N('A fair reading. He was afraid of being blamed, and that fear shaped his choice.'),
            ]),
            o('Both, and he could have talked to them', [
              N(
                'A thoughtful reading. Hiding protected them from a worry but also cost them his company. Talking might have done more good.',
              ),
            ]),
          ],
          'Thought about whether hiding to protect others is loving, and what else Bruno might have done.',
        ),
      ],
      [
        ch('thank', 'Thank him for patching the house.', [
          BR('Nobody’s ever...'),
          N('He has to stop. A rat pats his hand.'),
        ]),
        ch('family', 'Tell him his family misses him.', [
          BR('Pepa? She does?', 'soft'),
          N('He has to look away, at the crack, at the trowel, at anything.'),
        ]),
        ch('nubbin', 'Let your Nubbin go to him.', [
          N(
            'Your Nubbin climbs onto the table and sits in Bruno’s cracked cup, the only seat left. Bruno laughs, short and rusty.',
          ),
        ]),
      ],
    ),
    sc(
      'a22-10-complete',
      [
        MI('Tío Bruno. Have another vision. Please. I need to know how it ends.', 'think'),
        BR('No. I don’t do that any more. Visions make trouble.', 'shock'),
        MI('They make trouble when we don’t look at them. Please.'),
        N(
          'Bruno looks at you, as if you might get him out of it, and then at the rats. The rats look back, no help at all.',
        ),
        BR('Okay. Okay. I need sand. And candles. And not to be looked at while I do it.', 'think'),
      ],
      [
        ask(
          3,
          'science',
          'wax melts when heated and hardens when cooled',
          '2-PS1-4',
          [
            N(
              'Bruno needs candles. As a candle burns, the wax near the flame melts. What happens to the melted wax when it cools?',
            ),
          ],
          [
            o(
              'It goes hard again',
              [
                N(
                  'Yes. Melting and hardening can be reversed with heat and cooling, which is why a candle drip sets into a lump.',
                ),
              ],
              true,
            ),
            o('It disappears', [N('It does not vanish. Cooled wax sets hard again.')]),
            o('It turns into water', [
              N('Wax and water are different stuff. Cooled wax sets hard again.'),
            ]),
          ],
          'Learned that wax melts when heated and goes hard again when it cools.',
        ),
      ],
    ),
  ],
  [gl('trowel', 'A small, flat hand tool for spreading plaster or clay.', 'a22-10-walls')],
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
        N(
          'There is sand all through the house’s insides, it turns out, from the tower. You scoop it into a bowl.',
        ),
        N('Your bowl holds 750 millilitres of sand, and Bruno needs four bowlfuls.'),
        N(
          'Mirabel brings candles from the dining room, the ones from the dinner. Some of them are still damp.',
        ),
        BR('Not those. Those are dinner candles. They have opinions.', 'think'),
        N(
          'Bruno finds his own candles behind a loose brick: short, fat, and burnt down many times.',
        ),
        N(
          'He pours a circle of sand on the floor of his little room, and sets the candles round it.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'capacity: 4 × 750 ml in litres',
          '4.MD.A.2',
          [
            N(
              'Bruno needs four bowlfuls of 750 millilitres each. How many litres of sand is that?',
            ),
          ],
          [
            o(
              'Three litres',
              [N('Yes. 4 × 750 = 3000 millilitres, and 1000 ml make a litre, so 3 litres.')],
              true,
            ),
            o('Four litres', [
              N('Four litres would need 1000 ml in each bowl. 4 × 750 = 3000 ml = 3 litres.'),
            ]),
            o('Thirty litres', [
              N('That is ten times too much. 4 × 750 = 3000 ml, and 3000 ml is 3 litres.'),
            ]),
          ],
          'Multiplied 4 × 750 ml and converted 3000 ml to 3 litres.',
        ),
      ],
      [
        ch('circle', 'Help him smooth the circle.', [
          N(
            'You smooth the sand together. His hands are careful, and shaky, and very good at this.',
          ),
        ]),
        ch('nubbin', 'Keep your Nubbin out of the sand.', [
          N(
            'You hold your Nubbin on your lap. It wants the sand quite badly, and it is very good about it.',
          ),
        ]),
      ],
    ),
    sc(
      'a22-11-gather-done',
      [
        BR('Sit inside the circle, both of you. Hold on to each other. It gets windy.'),
        N('Mirabel takes your hand. Her palm is damp, and she is trying to look calm.'),
      ],
      [
        ask(
          1,
          'sel',
          'why holding on to a friend makes fear smaller',
          'CASEL: Relationship skills',
          [
            N(
              'Bruno tells you to hold on to each other. Why does having someone to hold on to make a frightening thing feel smaller?',
            ),
          ],
          [
            o('Because we feel less alone', [
              N('A good answer. Fear grows in loneliness, and a hand tells us someone is with us.'),
            ]),
            o('Because their calm can rub off on us', [
              N(
                'A thoughtful answer. People’s feelings do spread, so a calm friend can steady a scared one.',
              ),
            ]),
            o('Because two people can think of what to do', [
              N('A practical answer. Two minds are better than one, even in a storm of sand.'),
            ]),
          ],
          'Thought about why holding on to someone makes fear feel smaller.',
        ),
      ],
    ),
    sc(
      'a22-11-vision',
      [
        N(
          'You sit inside the circle with Mirabel. Bruno lights the last candle and kneels in front of you.',
        ),
        N(
          'The sand begins to lift. It whirls round you in a ring, faster and higher, a wall of moving gold.',
        ),
        N('Bruno’s eyes go green. All the light in the little room goes green.'),
        BR('I see the house. And the cracks. And you, Mirabel.', 'think'),
        N(
          'In the sand a picture forms, like the glass but moving: Mirabel at a doorway, and someone with flowers all round her.',
        ),
        N(
          'It is Isabela. Mirabel puts her arms round her sister, and behind them the candle burns bright, with no cracks at all.',
        ),
        BR('That’s it. That’s it. You and Isabela.', 'shock'),
        N('The sand drops all at once, and the green goes out of the light.'),
        MI(
          'I have to hug Isabela. That’s the worst thing you could possibly have told me.',
          'shock',
        ),
      ],
      [
        ask(
          3,
          'science',
          'we see things because light bounces off them into our eyes',
          '1-PS4-2',
          [
            N(
              'The little room was dark until the candles were lit. Why can you see the whirling sand now?',
            ),
          ],
          [
            o(
              'Light bounces off the sand into my eyes',
              [
                N(
                  'Yes. Light from the candles hits the sand and bounces into your eyes. With no light, there is nothing to see.',
                ),
              ],
              true,
            ),
            o('My eyes send out light', [
              N(
                'Eyes take light in; they do not send it out. Light bounces off the sand into them.',
              ),
            ]),
            o('Sand glows by itself', [
              N('Not this sand. The candles light it, and that light bounces into your eyes.'),
            ]),
          ],
          'Learned that we see things when light bounces off them into our eyes.',
        ),
      ],
      [
        ch('laugh', 'Laugh.', [
          N(
            'You laugh, and Bruno laughs, and Mirabel throws sand at both of you, and then she is laughing too.',
          ),
        ]),
        ch('encourage', 'Tell her she can do it.', [
          MI('Can I? She’s perfect, and I just wrecked her proposal.', 'sad'),
          N('She stands up anyway, brushing off the sand. That is the answer.'),
        ]),
      ],
    ),
    sc(
      'a22-11-complete',
      [
        N(
          'Bruno sets the vision in a fresh piece of green glass, quick and careful, and gives it to Mirabel.',
        ),
        BR(
          'For proof. Not that anyone will believe it. Nobody ever believes the good ones.',
          'soft',
        ),
        MI('Come with us.'),
        BR('Not yet. Not yet.', 'sad'),
        N(
          'He goes back to his crack with his trowel. The rats settle down, and he starts doing their voices again, more quietly.',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'reading what a character’s words show about how he feels',
          'RL.3.3',
          [
            N(
              'Bruno says, “Nobody ever believes the good ones.” What does that tell us about how he feels?',
            ),
          ],
          [
            o(
              'He is used to being blamed for bad news',
              [
                N(
                  'Yes. Years of being blamed have taught him to expect the worst, even from good news.',
                ),
              ],
              true,
            ),
            o('He thinks good news is boring', [
              N('Nothing in the scene suggests that. He is hurt, not bored.'),
            ]),
            o('He is angry at the rats', [
              N('The rats are his friends. The words point to years of being blamed.'),
            ]),
          ],
          'Read a character’s words to understand how he feels.',
        ),
      ],
    ),
  ],
  [gl('proof', 'Something that shows that a thing is true.', 'a22-11-complete')],
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
    'a22-12-s3': { goal: 'Be there when the sisters make up.', hint: 'Wait among the flowers.' },
  },
  [
    sc(
      'a22-12-room',
      [
        N(
          'Isabela’s room is a garden. Vines on the walls, roses in the ceiling, a swing hung from a flowering tree.',
        ),
        N(
          'She is sitting on the swing, perfectly still and perfectly dressed, with her perfect face set like a plate.',
        ),
        IS('Get out.', 'angry'),
        MI('Isabela. I came to... I’m supposed to...', 'think'),
        IS('You ruined everything. Mariano’s gone. The whole town saw.', 'angry'),
        MI('You didn’t even want to marry Mariano!', 'angry'),
        N('There is a silence like a dropped glass.'),
        IS('How do you know that?', 'shock'),
      ],
      [
        ask(
          0,
          'science',
          'plants need light and water',
          '2-LS2-1',
          [
            N(
              'Isabela’s room is full of plants. What do green plants need to make their own food?',
            ),
          ],
          [
            o(
              'Light and water',
              [
                N(
                  'Yes. Plants use sunlight, water and air to make their food, which is why gardens need sun and rain.',
                ),
              ],
              true,
            ),
            o('Only soil', [N('Soil helps, but plants make food from light, water and air.')]),
            o('Darkness', [N('Plants need light. Without it they turn pale and weak.')]),
          ],
          'Learned that plants need light and water to make their food.',
        ),
      ],
      [
        ch('step', 'Step back and let them talk.', [
          N(
            'You step back against the wall, into a soft bank of jasmine. This isn’t yours to say.',
          ),
        ]),
        ch('nubbin', 'Pick up your Nubbin before it eats a rose.', [
          N(
            'You pick up your Nubbin, which had been considering a rose. Isabela watches, and very nearly laughs.',
          ),
        ]),
      ],
    ),
    sc(
      'a22-12-room-done',
      [
        IS(
          'I was going to marry him for the family. Because Abuela wanted it. Because I always do what Abuela wants.',
          'sad',
        ),
      ],
      [
        ask(
          0,
          'sel',
          'pleasing others versus being kind',
          'CASEL: Self-awareness',
          [
            N(
              'Isabela always does what Abuela wants, and calls it being good. Is pleasing everyone the same as being kind?',
            ),
          ],
          [
            o('Yes, always', [
              N(
                'A common idea. But pleasing everyone can mean hiding what we truly want, and that can be unkind to ourselves.',
              ),
            ]),
            o('No: kindness includes being honest', [
              N(
                'A thoughtful answer. A kind person can say no, or say what they want, and still care for others.',
              ),
            ]),
            o('Sometimes yes, sometimes no', [
              N(
                'A balanced answer. Sometimes pleasing others is kind, and sometimes we owe ourselves the truth.',
              ),
            ]),
          ],
          'Thought about whether pleasing everyone is the same as being kind.',
        ),
      ],
    ),
    sc(
      'a22-12-cactus',
      [
        IS(
          'Do you know what it’s like to be perfect? Every day? Every flower, every smile...',
          'angry',
        ),
        N(
          'She clenches her fist, and something grows out of the floor at her feet. A cactus: spiky, lopsided, and magnificent.',
        ),
        IS('That’s not pretty.', 'shock'),
        MI('That’s amazing.', 'happy'),
        N(
          'Isabela looks at the cactus, and then she does it again, on purpose: a cactus, a jacaranda, a creeper with sharp little hooks.',
        ),
        N('She laughs, and it isn’t her perfect laugh. It is loud, and it is her own.'),
        N(
          'Flowers pour out of the walls: strange ones, wild ones, ones in colours flowers are not usually allowed to be.',
        ),
        IS('I didn’t know I could do that. I never tried.', 'happy'),
        N('Your Nubbin is buried up to its crown in petals and looks very content about it.'),
      ],
      [
        ask(
          2,
          'science',
          'how a cactus survives in dry places',
          '3-LS4-3',
          [
            N(
              'Isabela’s cactus is spiky, fat and tough. How does a cactus survive where little rain falls?',
            ),
          ],
          [
            o(
              'It stores water in its thick stem',
              [
                N(
                  'Yes. A cactus soaks up rain quickly and stores it in its thick stem, then uses it slowly.',
                ),
              ],
              true,
            ),
            o('It moves to wetter places', [
              N('Plants cannot move. A cactus stores water in its thick stem.'),
            ]),
            o('It does not need water', [
              N('All plants need water. A cactus stores it in its thick stem for dry times.'),
            ]),
          ],
          'Learned that a cactus survives in dry places by storing water in its thick stem.',
        ),
      ],
      [
        ch('dig', 'Dig your Nubbin out.', [
          N(
            'You dig it out. It has a purple flower stuck on its crown, and will not have it removed.',
          ),
        ]),
        ch('grow', 'Ask her to grow one for your Nubbin.', [
          N(
            'Isabela holds out her hand, and a tiny yellow orchid opens in it. She tucks it behind your Nubbin’s crown.',
          ),
        ]),
      ],
    ),
    sc(
      'a22-12-hug',
      [
        N('The two sisters stand in the middle of the flowers, both out of breath.'),
        IS(
          'I’m sorry. I was horrible to you. For years. Because you got to be not perfect.',
          'sad',
        ),
        MI('I’m sorry too. I was jealous. Because you got to be perfect.', 'sad'),
        N('They look at each other, and both start laughing at the same moment.'),
        N('Mirabel hugs her sister. Isabela hugs back, hard, with flowers coming out of her hair.'),
        N(
          'Out in the window the candle flares up bright. The cracks in the wall above you close by themselves.',
        ),
        MI('It’s working. Bruno was right. It’s working!', 'happy'),
      ],
      [
        ask(
          3,
          'sel',
          'what makes an apology a good one',
          'CASEL: Relationship skills',
          [
            N(
              'Which is the better apology: “Sorry you got upset”, or “I’m sorry I was horrible to you, and I’ll try to be kinder”?',
            ),
          ],
          [
            o('“Sorry you got upset”', [
              N('That one blames the other person’s feelings. A good apology owns what we did.'),
            ]),
            o(
              '“I’m sorry I was horrible, and I’ll try to be kinder”',
              [N('Yes. It says what we did wrong, owns it, and promises to try to change.')],
              true,
            ),
          ],
          'Compared two apologies and learned that a good one owns what we did.',
        ),
      ],
    ),
    sc(
      'a22-12-complete',
      [
        N(
          'Mirabel sits on the floor among the wild flowers with her sketchbook, and draws your Nubbin in its flower.',
        ),
        N(
          'Then she takes out her needle and the cloth she always carries, and stitches: a little skirt, or a waistcoat, whichever it likes.',
        ),
        MI(
          'Every Madrigal has their gift stitched on something. You don’t have a gift either, so this one is for being you.',
          'soft',
        ),
        N(
          'The stitching is butterflies, flowers and a little candle. It fits, more or less, and your Nubbin won’t take it off.',
        ),
      ],
      [
        ask(
          3,
          'maths',
          'lines of symmetry in a butterfly',
          '4.G.A.3',
          [
            N(
              'A butterfly’s wings match on both sides of its body. How many lines of symmetry does a butterfly picture have?',
            ),
          ],
          [
            o(
              'One',
              [
                N(
                  'Yes. Fold it down the middle, between the wings, and the two halves match exactly.',
                ),
              ],
              true,
            ),
            o('Two', [
              N(
                'Two would need it to match top to bottom as well. A butterfly has just one: down the middle.',
              ),
            ]),
            o('Four', [
              N('Four lines belongs to a square. A butterfly has just one line of symmetry.'),
            ]),
          ],
          'Found that a butterfly picture has one line of symmetry.',
        ),
      ],
    ),
  ],
  [gl('lopsided', 'Uneven, with one side higher or bigger than the other.', 'a22-12-cactus')],
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
      goal: 'Get out of the house as it breaks.',
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
        N(
          'You come down into the courtyard together, laughing, with flowers in everybody’s hair. Abuela is standing by the candle.',
        ),
        AB('What have you done?', 'angry'),
        N(
          'She looks at the wild flowers on the stairs, the cactus by the door, Isabela’s ruined hair.',
        ),
        AB(
          'The dinner. Bruno’s name in my house. Isabela’s future. And the cracks, ever since your ceremony.',
          'angry',
        ),
        AB('Everything was fine until you went looking for problems.', 'angry'),
        MI('The cracks aren’t because of me. They’re because of you!', 'angry'),
        N(
          'The courtyard goes still. Everyone has come out: Julieta, Agustín, Pepa, Félix, the cousins.',
        ),
        MI(
          'Luisa’s breaking. Isabela couldn’t be herself. Bruno’s in the walls! Nobody could ever be good enough for you!',
          'angry',
        ),
        MI('Not even me.', 'sad'),
      ],
      [
        ask(
          8,
          'literacy',
          'seeing two points of view: each person is hurt and afraid',
          'RL.3.6',
          [
            N(
              'Abuela blames Mirabel, and Mirabel blames Abuela. Can two people both be partly right? What is each of them afraid of?',
            ),
          ],
          [
            o('Yes: Abuela fears losing the miracle, Mirabel fears never being enough', [
              N(
                'A sharp reading. Each is hurt by a different fear, and each is partly right about the other.',
              ),
            ]),
            o('No: one of them must be wrong', [
              N(
                'A common feeling in a fight. But often both people carry part of the truth, and listening is how we find it.',
              ),
            ]),
            o('I’m not sure yet', [
              N('An honest answer. Keep reading: the river scene may help you decide.'),
            ]),
          ],
          'Looked at a conflict from both characters’ points of view and named what each fears.',
        ),
      ],
      [
        ch('step', 'Step in beside Mirabel.', [
          N(
            'You step in beside her, and Abuela doesn’t even look at you. This isn’t yours to finish, but you are there.',
          ),
        ]),
        ch('back', 'Stay back.', [
          N(
            'You stay back: it isn’t your family, and it isn’t your fight. Your hands are fists anyway.',
          ),
        ]),
      ],
    ),
    sc(
      'a22-13-split',
      [
        N(
          'Under your feet the tiles crack. Not a little crack this time: a great one, straight down the middle of the courtyard.',
        ),
        N(
          'The cracks run up every wall at once, faster than anything can mend them. The house groans.',
        ),
        N('The candle in the window gutters. Luisa looks down at her hands.'),
        LU('I can’t. I can’t lift it. My gift’s gone.', 'shock'),
        N('Doors go dark one by one along the balcony. Isabela’s flowers wilt on the stairs.'),
        AB('Out! Everyone out!', 'shock'),
        N(
          'Everybody runs. Mirabel runs the other way: up the cracking stairs, towards the candle.',
        ),
      ],
      [
        ask(
          6,
          'health',
          'why we never go back inside a danger for belongings',
          'CASEL: Responsible decision-making',
          [
            N(
              'Mirabel runs back towards the candle. Why do safety experts say never to go back inside for belongings?',
            ),
          ],
          [
            o(
              'Because the danger may get worse, and people matter more than things',
              [
                N(
                  'Yes. Belongings can be replaced and people cannot. Get out, stay out and let helpers handle the rest.',
                ),
              ],
              true,
            ),
            o('Because belongings are boring', [
              N(
                'Belongings can be precious, but they can be replaced. People cannot, so we stay safe.',
              ),
            ]),
            o('Because doors always lock', [
              N(
                'Doors may not lock at all. The real reason is that the danger may get worse, so people come first.',
              ),
            ]),
          ],
          'Learned the safety rule of going to a safe place and not going back inside for belongings.',
        ),
      ],
      [
        ch('after', 'Go after her.', [
          N(
            'You get halfway up, and the stairs fold under you. Casita’s tiles roll you back down, firmly, and out of the door.',
          ),
        ]),
        ch('others', 'Get the others out.', [
          N(
            'You take Antonio’s hand, and Pepa’s, and run them through the door. Behind you, the floor tilts.',
          ),
        ]),
      ],
    ),
    sc(
      'a22-13-split-done',
      [
        N('You land in the street with the family round you, all of you on your knees.'),
        N(
          'Eleven Madrigals were in the courtyard when the floor split. Mirabel ran back up the stairs.',
        ),
        N('Behind you, the walls begin to lean.'),
      ],
      [
        ask(
          1,
          'maths',
          'subtraction in a story: 11 − 1',
          '2.OA.A.1',
          [
            N(
              'Eleven Madrigals were in the courtyard, and Mirabel ran back up. How many reached the street?',
            ),
          ],
          [
            o(
              'Ten',
              [N('Yes. 11 − 1 = 10, the same ten Madrigals as in the photograph on the stairs.')],
              true,
            ),
            o('Eleven', [N('Eleven is everyone, and Mirabel went back. 11 − 1 = 10.')]),
            o('Nine', [N('Only one went back, so take away one: 11 − 1 = 10.')]),
          ],
          'Solved a subtraction story: 11 − 1 = 10.',
        ),
      ],
    ),
    sc(
      'a22-13-ruins',
      [
        N('The house comes down in a long, slow roar, room after room, like something lying down.'),
        N(
          'Then it is quiet, with dust everywhere. White wall, red tile, and a whole staircase leaning on nothing.',
        ),
        N(
          'Mirabel is sitting in the middle of it all, where the tiles carried her at the last moment. She is holding the candle.',
        ),
        N('As you reach her, the flame shrinks to a bead, and the bead goes out.'),
        MI('No. No.', 'sad'),
        N('A thin line of smoke rises from the wick, and then not even that.'),
        N('Your Nubbin climbs into her lap and pushes its head under her chin.'),
      ],
      [
        ask(
          6,
          'sel',
          'what helps someone who has just lost something',
          'CASEL: Social awareness',
          [
            N(
              'Mirabel is sitting in the dust, holding a candle that has gone out. What helps most right now?',
            ),
          ],
          [
            o(
              'Sitting beside her and not hurrying her',
              [
                N(
                  'Yes. Presence is the best first help. Fixing and advice can wait until she is ready.',
                ),
              ],
              true,
            ),
            o('Telling her it is not that bad', [
              N(
                'That is meant kindly, but it can make a sad person feel unheard. Sitting beside her helps more.',
              ),
            ]),
            o('Fixing the house at once', [
              N('The house can wait. Right now Mirabel needs company more than a plan.'),
            ]),
          ],
          'Talked about how to help someone who has just lost something: stay close and do not hurry them.',
        ),
      ],
      [
        ch('sit', 'Sit down next to her.', [
          N(
            'You sit down in the dust beside her. You don’t say anything, because there isn’t anything.',
          ),
        ]),
        ch('hand', 'Reach for her hand.', [
          N('She lets you hold it for a moment. Her hand is full of candle wax.'),
        ]),
      ],
    ),
    sc(
      'a22-13-lamp',
      [
        N(
          'At your belt, the gold flame Abuela lit for you on your first night goes out at the same moment.',
        ),
        N(
          'Your lamp is dark again. It is the darkest thing in the valley, and the whole valley is dark.',
        ),
        N('Then Mirabel is up and running, out of the ruins, and nobody sees which way.'),
      ],
      [
        ask(
          1,
          'science',
          'melting can be undone, burning cannot',
          '2-PS1-4',
          [
            N(
              'Melted wax sets hard again when it cools. But the wax a flame has burnt is gone. Can burnt wax ever come back?',
            ),
          ],
          [
            o(
              'No: burning turned it into gases and smoke',
              [
                N(
                  'Yes. Burning changes wax into new gases and smoke, and that change cannot be undone. Melting can.',
                ),
              ],
              true,
            ),
            o('Yes: it sets hard again', [
              N(
                'That is melted wax. Burnt wax has gone into the air as gases and smoke, and cannot come back.',
              ),
            ]),
          ],
          'Learned that melting can be reversed but burning cannot.',
        ),
      ],
    ),
    sc(
      'a22-13-complete',
      [
        N(
          'The family stand in the ruins, and Julieta is holding Luisa. Pepa has no cloud at all, and Isabela has no flowers.',
        ),
        N(
          'Abuela stands with her back to all of them, looking at the empty place where the window was.',
        ),
        AB('Where is she?', 'sad'),
        N(
          'Nobody knows. Then Antonio’s toucan comes down out of the dark and says something in his ear.',
        ),
        AN('The river. He says she went to the river.', 'sad'),
      ],
      [
        notice(
          4,
          'social-studies',
          'rivers run downhill from mountains to the sea; the Magdalena',
          'D2.Geo.2.K-2',
          [
            N('Rivers begin high in the mountains, from rain and springs, and run downhill.'),
            N(
              'Colombia’s main river, the Magdalena, runs north between two ranges of the Andes and ends in the Caribbean Sea.',
            ),
          ],
          'Learned that rivers run downhill to the sea, and met Colombia’s Magdalena river.',
        ),
      ],
    ),
  ],
  [
    gl(
      'gutters',
      'Burns weakly and unsteadily, as a candle does when it is about to go out.',
      'a22-13-split',
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
    'a22-14-s2': { goal: 'Listen to Abuela at the river.', hint: 'Stay still, and listen.' },
  },
  [
    sc(
      'a22-14-river',
      [
        N(
          'The river is a long way down the valley, past the last houses, where the mountains open.',
        ),
        N(
          'The water runs fast and shallow over stones. On the far bank there is long grass, and the sky is getting light.',
        ),
        N(
          'Mirabel is sitting on a rock by the water. You stop a little way off, and sit down too.',
        ),
        N('Mirabel doesn’t look round. Her glasses are in her lap.'),
        N('Your Nubbin sits between you, and nobody says anything. The water says enough.'),
        N(
          'After a while there are footsteps on the stones. It is Abuela, with her shawl round her, out of breath.',
        ),
      ],
      [
        notice(
          2,
          'science',
          'erosion: moving water smooths stones',
          '4-ESS2-1',
          [
            N(
              'River stones are smooth and round because moving water has rubbed them against each other for years.',
            ),
            N('This slow wearing away of rock by water is called erosion.'),
          ],
          'Learned that moving water wears rocks smooth, which is erosion.',
        ),
      ],
      [
        ch('go', 'Get up to leave them alone.', [
          N(
            'You stand to go, and Abuela shakes her head, very slightly: stay. You sit down again, further off.',
          ),
        ]),
        ch('stay', 'Stay where you are.', [
          N(
            'You stay where you are. Abuela looks at you, and nods, as if you were a chair she had owned for a long time.',
          ),
        ]),
      ],
    ),
    sc(
      'a22-14-pedro',
      [
        N(
          'Abuela sits down beside her granddaughter, slowly, on the cold rock. She looks at the water for a long time.',
        ),
        AB('This is the river.', 'soft'),
        MI('Here? This is where...?'),
        AB(
          'Here. I was younger than Isabela. I had three babies and nothing else, and trouble was coming.',
        ),
        AB('He told me to go. He kissed me, and he turned round, and he walked back.', 'sad'),
        AB(
          'I waited on the other side until the sun came up. He didn’t come. Pedro died there.',
          'sad',
        ),
        N('Her hands are shaking in her lap. She doesn’t hide them.'),
        AB(
          'A miracle came to me that night. I was so frightened of losing it that I held on too hard, and squeezed you all.',
          'sad',
        ),
        AB('I made the family carry everything. I made them carry me. I am sorry, Mirabel.', 'sad'),
        N(
          'Yellow butterflies are coming up off the water in the first light: dozens of them, then hundreds.',
        ),
        MI('You kept us together, Abuela. You are the miracle, more than any candle.', 'soft'),
        N(
          'Abuela makes a sound that isn’t quite laughing and isn’t quite crying. She pulls Mirabel into her arms.',
        ),
      ],
      [
        ask(
          8,
          'sel',
          'why fear makes people hold on too tight',
          'CASEL: Social awareness',
          [
            N(
              'Abuela says fear made her hold on too tight. Why can fear make people hold on harder? What would you say to her?',
            ),
          ],
          [
            o('Because losing something once makes us dread losing it again', [
              N(
                'A wise answer. After a great loss, people often grip tightly to protect what is left, even when gripping hurts.',
              ),
            ]),
            o('I would tell her it is not too late to loosen her grip', [
              N('A kind answer. Mirabel answers her in her own way, in a moment.'),
            ]),
            o('I would just hug her', [
              N('A good answer. Sometimes there are no words, and a hug is what is wanted.'),
            ]),
          ],
          'Thought about why fear and grief can make people hold on too tightly, and what could help.',
        ),
      ],
    ),
    sc(
      'a22-14-pedro-done',
      [
        N('The butterflies settle on the rock, on Mirabel’s skirt, on your Nubbin’s crown.'),
        N(
          'Footsteps again. A thin man in a green hood is standing at the top of the bank, ready to run.',
        ),
        BR('Mamá.', 'shock'),
        N(
          'Abuela stands up. She goes to him over the stones, and she holds him, hood and all, for a long time.',
        ),
      ],
      [
        ask(
          0,
          'science',
          'the butterfly life cycle',
          '3-LS1-1',
          [
            N(
              'The butterflies were once caterpillars. Which stage comes between caterpillar and butterfly?',
            ),
          ],
          [
            o(
              'A chrysalis',
              [
                N(
                  'Yes. A butterfly’s life goes egg, caterpillar, chrysalis, butterfly, and inside the chrysalis the caterpillar is rebuilt.',
                ),
              ],
              true,
            ),
            o('A seed', [
              N('Seeds belong to plants. A butterfly goes egg, caterpillar, chrysalis, butterfly.'),
            ]),
            o('An egg again', [
              N('The egg comes first. After the caterpillar comes the chrysalis.'),
            ]),
          ],
          'Learned the butterfly life cycle: egg, caterpillar, chrysalis, butterfly.',
        ),
      ],
    ),
    sc(
      'a22-14-complete',
      [
        N(
          'The sun comes over the mountains. You walk back up the valley together, and Bruno stays very close to his mother.',
        ),
        MI('Everything’s gone. The house. The gifts.', 'sad'),
        AB('Not everything.', 'soft'),
        N(
          'At the top of the road the whole village is waiting by the ruins. Every one of them has brought something.',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'exaggeration for feeling',
          'L.4.5',
          [
            N(
              'Mirabel says, “Everything’s gone.” Is that exactly true? What is she doing with her words?',
            ),
          ],
          [
            o(
              'Exaggerating to show how she feels',
              [
                N(
                  'Yes. Exaggeration shows a feeling bigger than the facts. Abuela’s “Not everything” gently corrects it.',
                ),
              ],
              true,
            ),
            o('Telling a lie', [
              N(
                'A lie is meant to fool someone. Mirabel is not trying to fool anybody; she is showing how big her sadness is.',
              ),
            ]),
            o('Counting what is left', [
              N('Counting would give a number. She is expressing a feeling instead.'),
            ]),
          ],
          'Recognised exaggeration as a way of showing feeling.',
        ),
      ],
    ),
  ],
  [
    gl(
      'chrysalis',
      'The hard case a caterpillar makes before it turns into a butterfly.',
      'a22-14-pedro-done',
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
      hint: 'Talk to the neighbours gathered at the ruins and pick up a tool.',
    },
    'a22-15-s2': {
      goal: 'Help rebuild the house, the way only you can.',
      hint: 'Eyes: build along Mirabel’s crack map. Ears: walk the ruins with Dolores. Hands: carry for Luisa.',
    },
  },
  [
    sc(
      'a22-15-village',
      [
        N(
          'Shovels, wheelbarrows, ladders, pots of whitewash. A woman with a basket of bread, and the man whose bridge Luisa mended.',
        ),
        NB('The Madrigals helped every one of us. Now we help you.'),
        N(
          'In many parts of Colombia, neighbours working together on a big job have a name for it: a minga.',
        ),
        N(
          'Señora Guzmán is there with her sleeves rolled up. Mariano is standing next to Dolores, and they are both a bit pink.',
        ),
        N(
          'There are no gifts now: Pepa has no cloud, and Luisa can’t lift a donkey. Camilo’s face is just his face.',
        ),
        LU('I don’t know what to do with my hands.', 'think'),
        N(
          'Julieta hands round arepas that heal nothing, and everybody eats them anyway, because they are delicious.',
        ),
      ],
      [
        ask(
          2,
          'social-studies',
          'fairness: should help be repaid, or given freely?',
          'D2.Civ.8.K-2',
          [
            N(
              'The neighbours help the Madrigals for nothing, because the Madrigals once helped them. Should help always be paid back, or given freely? Is there a fair way to share the work?',
            ),
          ],
          [
            o('Help should be repaid, to be fair', [
              N(
                'A fair view. Giving back keeps things even, and these neighbours are doing exactly that.',
              ),
            ]),
            o('Help should be given freely', [
              N('A generous view. Help given with no price asked can start a kindness that grows.'),
            ]),
            o('A bit of both: many people each doing a little', [
              N(
                'A thoughtful view. A minga shares the work so no one carries too much, and everyone belongs.',
              ),
            ]),
          ],
          'Thought about fairness: whether help should be repaid or given freely, and how neighbours share work.',
        ),
      ],
      [
        ch('shovel', 'Pick up a shovel.', [
          N(
            'You pick up a shovel. A man you’ve never met nods at you, as if you had been digging beside him for years.',
          ),
        ]),
        ch('ask', 'Ask where to start.', [
          AB('Anywhere. Start anywhere. Everybody else has.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a22-15-eyes',
      [
        N(
          'Mirabel unfolds her drawing of the house, the one you have marked cracks on for days. It is soft at the folds and covered in ink.',
        ),
        MI('Every crack we found. Every one. This is where it was weak.', 'think'),
        N(
          'You go through the ruins with the map, wall by wall, and show the builders where the old house was cracking.',
        ),
        N('Where it cracked, they build it thicker. Where it leaned, they set a new beam.'),
        N(
          'One new wall is four metres long and three metres high, and a tin of whitewash covers six square metres.',
        ),
        NB('Who drew this? It’s good.'),
        N(
          'Mirabel opens her mouth to explain about visions and houses, and says “We did” instead.',
        ),
      ],
      [
        ask(
          4,
          'maths',
          'area of a rectangle, then division',
          '3.MD.C.7',
          [
            N(
              'A wall is 4 m long and 3 m high, and a tin covers 6 square metres. How many tins does the wall need?',
            ),
          ],
          [
            o('Two tins', [N('Yes. Area = 4 × 3 = 12 square metres, and 12 ÷ 6 = 2 tins.')], true),
            o('Four tins', [
              N('Check the area first: 4 × 3 = 12 m². Each tin covers 6 m², so 12 ÷ 6 = 2.'),
            ]),
            o('Twelve tins', [
              N(
                'Twelve is the area in square metres. Each tin covers 6 of them, so 12 ÷ 6 = 2 tins.',
              ),
            ]),
          ],
          'Found the area of a wall (4 × 3 = 12 m²) and divided by the coverage of a tin (12 ÷ 6 = 2).',
        ),
      ],
      [
        ch('mirabel', 'Say Mirabel did.', [
          Y('She did. I held the pencil.'),
          N('Mirabel goes red, and goes on pointing.'),
        ]),
        ch('both', 'Say you did it together.', [
          Y('Both of us.'),
          N('Mirabel grins. The builder writes both your names in pencil on the new beam.'),
        ]),
      ],
    ),
    sc(
      'a22-15-job-done',
      [
        N(
          'By evening the walls are up to your shoulders, whitewashed and new. Everyone is talking at once as they work.',
        ),
        N('The sun has been hot all day, and your lips are dry.'),
      ],
      [
        ask(
          1,
          'health',
          'drink water and rest in the shade after hard work in the heat',
          'K-LS1-1',
          [N('After hard work in the heat, what should you do?')],
          [
            o(
              'Drink water and rest in the shade',
              [
                N(
                  'Yes. Working in the heat makes the body lose water as sweat, so drink and cool down.',
                ),
              ],
              true,
            ),
            o('Keep working without a drink', [
              N('That can make you dizzy and ill. Drink water and rest in the shade.'),
            ]),
            o('Drink only fizzy juice', [
              N('Fizzy juice is not the best for thirst. Water is what the body needs.'),
            ]),
          ],
          'Learned to drink water and rest in the shade after hard work in the heat.',
        ),
      ],
    ),
    sc(
      'a22-15-complete',
      [
        N(
          'It takes days. Walls, then roof, then shutters, then the courtyard tiles, one by one, in the old pattern.',
        ),
        N(
          'Bruno puts on a play for the children with his rats. Pepa has no cloud, so she says how she feels out loud, and finds she can.',
        ),
        N(
          'Abuela works beside everybody. She is not very good with a trowel, and she doesn’t mind.',
        ),
        N(
          'In the end there is a house: plain, white and new, with a red roof. It isn’t magic, and every hand in the valley built it.',
        ),
      ],
      [
        ask(
          2,
          'sel',
          'being comfortable as a beginner',
          'CASEL: Self-awareness',
          [
            N(
              'Abuela is not very good with a trowel, and she doesn’t mind. Why does it help to be happy being a beginner?',
            ),
          ],
          [
            o(
              'We learn by trying, and mistakes are part of it',
              [
                N(
                  'Yes. Everybody is a beginner at something, and being cheerful about it lets us keep learning.',
                ),
              ],
              true,
            ),
            o('Because nobody notices', [
              N(
                'People do notice, and mostly they admire the trying. It is fine to be a beginner.',
              ),
            ]),
            o('It does not help', [
              N('It does help. Feeling ashamed of being new makes learning harder.'),
            ]),
          ],
          'Talked about how being cheerful as a beginner helps us learn.',
        ),
      ],
    ),
  ],
  [
    gl(
      'minga',
      'A Colombian word for neighbours working together on a big job for everyone.',
      'a22-15-village',
    ),
    gl('whitewash', 'A white paint made of lime and water, used on walls.', 'a22-15-village'),
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
        N(
          'The front door is the last thing. It is new and plain, with a hole where the handle should go.',
        ),
        N(
          'The family stands round Mirabel in a half circle, and Antonio is bouncing. Bruno is at the back, holding a rat.',
        ),
        JU('We made you something. All of us.', 'soft'),
        N(
          'Julieta puts it in Mirabel’s hand: a doorknob, carved and painted, with a butterfly on it, and her name.',
        ),
        AB('We built the house. You are the one who brought us back to it. Put it in.', 'soft'),
        MI('Me?', 'shock'),
        AB('You.', 'soft'),
        N(
          'Mirabel looks at the doorknob, at the door, and at you. Then she fits it into the hole, and turns it.',
        ),
        N(
          'Light runs out of the doorknob, across the door, along the walls and up into the roof. Tiles ripple, and shutters fly open.',
        ),
        N('Casita wakes. In the window a candle catches, all by itself, and burns.'),
        N(
          'Luisa lifts a donkey out of habit, and puts it down again, gently. Pepa’s cloud comes back as a rainbow.',
        ),
      ],
      [
        ask(
          3,
          'literacy',
          'compound words: doorknob versus butterfly',
          'L.3.4',
          [
            N(
              '“Doorknob” is built from two smaller words. Which is a compound word whose parts both tell you what it is: doorknob, or butterfly?',
            ),
          ],
          [
            o(
              'Doorknob: a knob on a door',
              [
                N(
                  'Yes. Door plus knob makes a knob on a door. A butterfly is not a kind of fly, and it has nothing to do with butter, so its parts do not tell you what it is.',
                ),
              ],
              true,
            ),
            o('Butterfly: butter and fly', [
              N(
                'It is a compound word, but its parts are misleading. A butterfly is neither butter nor a kind of fly.',
              ),
            ]),
          ],
          'Looked at compound words, and noticed that some, like butterfly, do not mean what their parts say.',
        ),
      ],
      [
        ch('cheer', 'Cheer.', [
          N(
            'You cheer. Mirabel cheers louder than anyone, and this time she means every bit of it.',
          ),
        ]),
        ch('nubbin', 'Watch your Nubbin.', [
          N(
            'Your Nubbin is running in circles round the courtyard, chased by a ripple of happy tiles.',
          ),
        ]),
      ],
    ),
    sc(
      'a22-16-stub',
      [
        N(
          'Mirabel takes a candle stub from her pocket and lights it from the new flame in the window.',
        ),
        MI('For you. To take home.', 'soft'),
        N(
          'You hold your lamp out to it, and the stub’s flame lights your dark glass again. Mirabel watches, and frowns a little.',
        ),
        MI(
          'It might not stay lit, where you’re going. Some lights you have to wait for. Keep the stub anyway.',
          'soft',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'what helps us wait for something we want',
          'CASEL: Self-management',
          [
            N(
              'Mirabel says some lights you have to wait for. What helps you wait for something you want a lot?',
            ),
          ],
          [
            o('Keeping busy with something else', [
              N('A good tip. Busy hands and a busy mind make waiting feel shorter.'),
            ]),
            o('Remembering that it is coming', [
              N('A good tip. Hope makes waiting easier, if we trust the thing is on its way.'),
            ]),
            o('Being with people who care', [
              N('A kind tip. Waiting together is lighter than waiting alone.'),
            ]),
          ],
          'Thought about what helps us wait patiently for something we want.',
        ),
      ],
    ),
    sc(
      'a22-16-photo',
      [
        N(
          'The photographer from the village sets up his camera in the courtyard, under a black cloth.',
        ),
        N(
          'The whole family crowds onto the stairs, Bruno too, at the front this time, holding Antonio. The rats are not in it, officially.',
        ),
        MI('Wait. Wait! You too. Get in!', 'happy'),
        N(
          'You end up at the edge, beside Mirabel, with the crack map rolled up under your arm. She pulls you in close.',
        ),
        N(
          'Your Nubbin sits at your feet in Mirabel’s embroidery. A yellow butterfly lands on its crown.',
        ),
        NB('Everybody, very still!'),
      ],
      [
        ask(
          0,
          'science',
          'why an old camera needs a dark cloth',
          '1-PS4-2',
          [
            N(
              'The photographer works under a black cloth. In an old camera, a faint picture shows on a glass screen. Why does he hide under the cloth?',
            ),
          ],
          [
            o(
              'So outside light does not wash out the faint picture',
              [
                N(
                  'Yes. A faint picture is easy to lose in bright light, so the cloth blocks the light and lets him see the screen.',
                ),
              ],
              true,
            ),
            o('So nobody sees him', [
              N('He is quite visible. The cloth is there to keep light off the screen.'),
            ]),
            o('To keep warm', [
              N('It is a warm day. The cloth keeps stray light off the camera’s screen.'),
            ]),
          ],
          'Learned that a dark cloth keeps stray light off the faint picture in an old camera.',
        ),
      ],
      [
        ch('smile', 'Smile.', [N('You smile. Mirabel doesn’t need to be told.')]),
        ch('look', 'Look at Mirabel instead.', [
          N(
            'You look at Mirabel instead of the camera, and she looks at you, and the photograph catches you both laughing.',
          ),
        ]),
      ],
    ),
    sc(
      'a22-16-complete',
      [
        N('In the morning the page begins to go thin and painted again, at the edges.'),
        N(
          'The Madrigals walk you to the gate, all of them, and the house too, with its shutters waving.',
        ),
        AB('You are welcome at this table. Always.', 'soft'),
        N(
          'Antonio’s jaguar sniffs your Nubbin one last time. Antonio listens, very seriously, to what your Nubbin says back.',
        ),
        AN('It says it will come back. And it says you have to bring it.', 'happy'),
        N(
          'Then you are standing in the Grove with a candle stub, a carved doorknob Julieta slipped into your pocket, and a butterfly that came all the way home.',
        ),
      ],
      [
        notice(
          5,
          'social-studies',
          'the Zenú sombrero vueltiao, a Colombian craft',
          'D2.His.2.K-2',
          [
            N(
              'At the gate an old neighbour lifts his hat to you. It is woven in black and white rings.',
            ),
            N(
              'It is a sombrero vueltiao, a symbol of all Colombia, made by the Zenú people of the north.',
            ),
            N(
              'Weavers plait strips of a cane called caña flecha into black-and-white patterns, and “vueltiao” means “turned”, from the way the plait winds round and round.',
            ),
          ],
          'Learned about the sombrero vueltiao, a hat woven by the Zenú people of northern Colombia.',
        ),
      ],
    ),
  ],
  [
    gl(
      'caña flecha',
      'A cane whose strips the Zenú weave into hats and other crafts.',
      'a22-16-complete',
    ),
    gl(
      'vueltiao',
      'Spanish for “turned”: the plait of the hat winds round and round.',
      'a22-16-complete',
    ),
  ],
);

// ================================================================== variants
/**
 * Reader versions of every scene in A22_VARIANTS: the lamp (A22-1, 4, 13, 16), Hazel’s margin
 * note, the job-path scenes (ears and hands in A22-8, 9, 15 and 16), the kept-stone scene and the
 * two Grove keepsake scenes. Each keeps the domain of the scene it replaces, so lessons never
 * repeat a domain in a row whichever variant plays.
 */
export const EDU_A22_READER_VARIANTS: EduScene[] = [
  // ---------------------------------------------------------------- A22-1, the lamp
  sc(
    'a22-01-lamp-flicker',
    [
      N(
        'Abuela Alma meets you in the courtyard. She is older than in the painting, straight as a broom, with a black shawl.',
      ),
      N(
        'She looks at the lamp at your belt, from your Long-Grass post. A thin blue flame is shivering inside it.',
      ),
      AB('That flame is too thin to be on its own. Come.'),
      N(
        'She tips the candle to your wick. Now there are two flames in the glass, a gold one and your thin blue one, leaning together.',
      ),
    ],
    [
      ask(
        3,
        'science',
        'heat from one flame lights another wick',
        '4-PS3-2',
        [
          N(
            'Abuela tips her candle to your wick, and a second flame catches. What does her flame pass to your wick?',
          ),
        ],
        [
          o(
            'Heat',
            [
              N(
                'Yes. Heat from her flame warms your wick until it catches. Energy moves as heat, and her flame stays just as big.',
              ),
            ],
            true,
          ),
          o('Half of its flame', [
            N('Flames do not split in half. Her flame passes on heat, and stays the same size.'),
          ]),
          o('Water', [N('Water would put a flame out. Her flame passes on heat.')]),
        ],
        'Learned that heat from one flame can light another wick.',
      ),
    ],
  ),
  sc(
    'a22-01-lamp-lit',
    [
      N(
        'Abuela Alma meets you in the courtyard. She is older than in the painting, straight as a broom, with a black shawl.',
      ),
      N(
        'She looks at the lamp at your belt, lit from your Long-Grass post. The flame stands up straight and steady.',
      ),
      AB('Someone keeps that one well. Good.'),
      N('She doesn’t offer to light it. She nods at it, the way you nod to a neighbour.'),
    ],
    [
      notice(
        3,
        'science',
        'why a flame points upwards',
        '3-PS2-1',
        [
          N(
            'A flame points up because the hot gases it makes are lighter than the cool air around them, so they rise.',
          ),
          N('In still air a flame stands straight. A draught bends it.'),
        ],
        'Learned that a flame points up because hot gases rise, and that a draught bends it.',
      ),
    ],
  ),
  sc(
    'a22-01-lamp-warm',
    [
      N(
        'Abuela Alma meets you in the courtyard. She is older than in the painting, straight as a broom, with a black shawl.',
      ),
      N(
        'She looks at the lamp at your belt, lit from your Long-Grass post. Its flame is a deep red-gold, and the glass is warm.',
      ),
      AB('That one burns as if somebody is glad of it.', 'soft'),
      N(
        'She holds her hands to it for a moment, as if it were a hearth, and then remembers herself.',
      ),
    ],
    [
      notice(
        3,
        'science',
        'heat moves from a hot flame through glass to your hand',
        '4-PS3-2',
        [
          N(
            'Heat moves from the hot flame, through the glass, to anything cooler that touches it. That is why the glass feels warm.',
          ),
          N('It is also why you never touch a lamp’s glass while it burns.'),
        ],
        'Learned that heat moves from a flame through glass to cooler things, and why we must not touch it.',
      ),
    ],
  ),

  // ---------------------------------------------------------------- A22-4, the lamp
  sc(
    'a22-04-lamp-flicker',
    [
      N(
        'You look down at the lamp at your belt. Both its flames, Abuela’s gold one and your own thin blue one, are shuddering.',
      ),
      N('They shudder with the candle, all three at once, and steady all at once.'),
      MI('Yours too. You saw. You saw it.', 'shock'),
      N('She grips your wrist hard, then lets go, because her grandmother is watching.'),
    ],
    [
      ask(
        1,
        'science',
        'fuel, air and heat: what a flame needs',
        '4-PS3-4',
        [
          N(
            'A flame needs fuel, air and heat. Take one away and it goes out. In a candle, what is the fuel?',
          ),
        ],
        [
          o(
            'The wax, drawn up the wick',
            [
              N(
                'Yes. Heat melts the wax, the wick draws it up, and the flame burns the wax vapour.',
              ),
            ],
            true,
          ),
          o('The air', [N('Air is one of the three needs, but the fuel is the wax.')]),
          o('The glass', [N('The glass only shelters the flame. The fuel is the wax.')]),
        ],
        'Learned that a flame needs fuel, air and heat, and that a candle’s fuel is wax.',
      ),
    ],
  ),
  sc(
    'a22-04-lamp-lit',
    [
      N(
        'You look down at the lamp at your belt, lit from your own Long-Grass post. Its flame stands straight; it didn’t move at all.',
      ),
      N('Mirabel sees it too. She stares at it, then at the candle, then at it again.'),
      MI('Yours didn’t. Something is wrong with ours.', 'think'),
      N('She grips your wrist hard, then lets go, because her grandmother is watching.'),
    ],
    [
      ask(
        1,
        'science',
        'still air keeps a flame steady',
        '3-PS2-1',
        [N('Your flame stood still while the candle shuddered. What would keep a flame steady?')],
        [
          o(
            'Still air with no draught',
            [N('Yes. A flame wobbles when air moves, so still air keeps it steady.')],
            true,
          ),
          o('A strong wind', [
            N('A wind would make it flicker or go out. Still air keeps it steady.'),
          ]),
          o('A very noisy room', [
            N('Noise hardly matters. Moving air is what makes a flame wobble.'),
          ]),
        ],
        'Learned that a flame stays steady in still air.',
      ),
    ],
  ),
  sc(
    'a22-04-lamp-warm',
    [
      N(
        'You look down at the lamp at your belt. Its red-gold flame is warm against your hip, and it didn’t move at all.',
      ),
      N('Mirabel sees it too. She stares at it, then at the candle, then at it again.'),
      MI('Yours didn’t. Something is wrong with ours.', 'think'),
      N('She grips your wrist hard, then lets go, because her grandmother is watching.'),
    ],
    [
      ask(
        1,
        'science',
        'metal conducts heat away, so it feels colder than wood',
        '2-PS1-1',
        [
          N(
            'Your lamp’s warmth is on your hip. On a cold day, a wooden spoon and a metal spoon left outside are the same temperature. Which feels colder to touch?',
          ),
        ],
        [
          o(
            'The metal one, because it carries heat away from your hand faster',
            [
              N(
                'Yes. Metal conducts heat well, so it pulls warmth from your skin and feels colder, though both are the same temperature.',
              ),
            ],
            true,
          ),
          o('The wooden one', [
            N(
              'Wood feels warmer because it carries heat away slowly. The metal spoon feels colder.',
            ),
          ]),
          o('Neither, they feel the same', [
            N(
              'They are the same temperature, but they do not feel the same. Metal feels colder because it conducts heat away faster.',
            ),
          ]),
        ],
        'Sorted materials by a property: metal conducts heat, so it feels colder than wood.',
      ),
    ],
  ),

  // ---------------------------------------------------------------- A22-8, ears
  sc(
    'a22-08-prep-done-ears',
    [
      N(
        'As you pass the stairs, Dolores catches your sleeve. You have sat with her most mornings since the landing, and listened to her listening.',
      ),
      DO('I heard. In the nursery. Tío Agustín, and the glass. I heard all of it.', 'sad'),
      DO(
        'I hear everything. I can’t not hear it. And I can’t keep things in. They just come out.',
        'sad',
      ),
      DO('Please stay by me tonight. Please.'),
      N('The bell rings at the gate. The Guzmáns are here.'),
    ],
    [
      notice(
        1,
        'science',
        'sound is a vibration that travels through air and solids to the ear',
        '4-PS3-2',
        [
          N(
            'Sound is a vibration that travels through air, and through solid things like walls, though more quietly.',
          ),
          N(
            'Your ear catches the vibrations, and a thin skin inside it, the eardrum, shakes in time with them.',
          ),
        ],
        'Learned that sound travels as vibrations through air and solids and shakes the eardrum.',
      ),
    ],
  ),

  // ---------------------------------------------------------------- A22-9, step 2
  sc(
    'a22-09-ears',
    [
      N(
        'Everything happens at once. You remember your job: you are the ears, and Dolores is your friend.',
      ),
      N(
        'She is standing at the foot of the stairs with both hands over her mouth, and more is still coming out.',
      ),
      DO('And Mariano, and I always, I always...', 'sad'),
      N('Whatever she is about to say, it isn’t hers to say in front of the whole table.'),
      N(
        'Across the table Mariano is looking at Dolores, not at Isabela, and doesn’t seem to know why.',
      ),
      N('Mirabel sees you get up, and nods once.'),
    ],
    [
      ask(
        3,
        'health',
        'calming big feelings',
        'CASEL: Self-management',
        [
          N(
            'Dolores’s feelings are too big to hold in. What helps most when feelings feel overwhelming?',
          ),
        ],
        [
          o(
            'Slow breathing and a calm friend nearby',
            [
              N(
                'Yes. Slow breaths calm the body, and a steady friend helps the feeling settle, which is what you are about to do for her.',
              ),
            ],
            true,
          ),
          o('Holding the feelings in tighter', [
            N('That usually makes them burst out harder. Breathing and a friend help more.'),
          ]),
          o('Shouting them out in front of everyone', [
            N(
              'That can feel like a relief but may hurt others. Breathing and a calm friend help more.',
            ),
          ]),
        ],
        'Learned that slow breathing and a calm friend help with overwhelming feelings.',
      ),
    ],
    [
      ch('out', 'Take her outside.', [
        N(
          'You take Dolores’s hand and walk her out into the courtyard, fast, before the next word.',
        ),
        N('Behind you, the door swings shut, and Casita leans on it.'),
      ]),
      ch('cover', 'Knock a jug over to cover her.', [
        N('You knock a jug off the table. In the crash, you get Dolores out into the courtyard.'),
        DO('Thank you. Thank you.', 'sad'),
      ]),
    ],
  ),
  sc(
    'a22-09-hands',
    [
      N(
        'Everything happens at once. You remember your job: you are the hands, and Luisa needs them.',
      ),
      N(
        'The crack has gone right under the table, and the table is folding in the middle like a book closing.',
      ),
      N('Luisa has one end of it. Her eye is twitching hard, and her hands are shaking.'),
      LU('I can’t... I can’t hold it...', 'shock'),
      N(
        'The other end is dropping, and all of Julieta’s dishes are sliding down it towards Señora Guzmán’s lap.',
      ),
      MI('Luisa!', 'shock'),
    ],
    [
      ask(
        4,
        'maths',
        'sharing a load equally: 80 ÷ 2',
        '3.OA.A.3',
        [
          N(
            'The table and its dishes weigh 80 kilograms. You and Luisa each hold one end. If you share the weight equally, how much does each of you carry?',
          ),
        ],
        [
          o('Forty kilograms', [N('Yes. 80 ÷ 2 = 40, because 40 + 40 = 80.')], true),
          o('Eighty kilograms', [
            N('Eighty is the whole weight. Shared between two, each carries 80 ÷ 2 = 40.'),
          ]),
          o('One hundred and sixty kilograms', [
            N('That doubles instead of sharing. Each carries 80 ÷ 2 = 40 kilograms.'),
          ]),
        ],
        'Divided 80 kg between two people to get 40 kg each.',
      ),
    ],
    [
      ch('lift', 'Grab the other end.', [
        N(
          'You get your shoulder under the other end and push. It is heavier than anything has ever been.',
        ),
        N('Between you, you hold it, dishes and all. Luisa looks across at you over the soup.'),
      ]),
      ch('dishes', 'Get the dishes off first.', [
        N(
          'You and your Nubbin snatch dishes off the slope as fast as you can. With them gone, Luisa can hold it, just.',
        ),
      ]),
    ],
  ),

  // ---------------------------------------------------------------- A22-13, the lamp
  sc(
    'a22-13-lamp-flicker',
    [
      N(
        'At your belt, Abuela’s gold flame goes out with the candle. For a moment your lamp is dark.',
      ),
      N(
        'Then you see it: your own thin blue flicker, from the Long-Grass post, still there at the bottom of the wick. It never quite goes out.',
      ),
      N('Then Mirabel is up and running, out of the ruins, and nobody sees which way.'),
    ],
    [
      notice(
        1,
        'science',
        'pupils widen in the dark, so tiny lights look bright',
        '4-LS1-2',
        [
          N(
            'In the dark, the black centres of your eyes, the pupils, open wide to let in more light. That is why a tiny flame looks so bright after dark.',
          ),
        ],
        'Learned that pupils widen in the dark, which makes small lights look bright.',
      ),
    ],
  ),
  sc(
    'a22-13-lamp-lit',
    [
      N(
        'At your belt, your lamp is still burning. Its flame comes from your Long-Grass post, a long way off, and owes this house nothing.',
      ),
      N(
        'It is the only light in the ruins. The family turn towards it one by one, the way people turn towards a fire.',
      ),
      N(
        'Mirabel looks at it, and at the dead candle. Then she is up and running, out of the ruins, and nobody sees which way.',
      ),
    ],
    [
      notice(
        1,
        'science',
        'light travels in straight lines and makes shadows',
        '4-PS3-2',
        [
          N(
            'Light travels in straight lines, so anything standing in its way makes a shadow on the far side. See how each shadow stretches away from your lamp.',
          ),
        ],
        'Learned that light travels in straight lines, which is why objects make shadows.',
      ),
    ],
  ),
  sc(
    'a22-13-lamp-warm',
    [
      N(
        'At your belt, your lamp is still burning, a deep red-gold. The night should be cold up here among the mountains, and it isn’t.',
      ),
      N(
        'The air round the ruins is oddly warm, like a kitchen after the cooking. Antonio’s jaguar lies down against your feet.',
      ),
      N(
        'Mirabel looks at your lamp, and at the dead candle. Then she is up and running, out of the ruins, and nobody sees which way.',
      ),
    ],
    [
      notice(
        1,
        'science',
        'a flame gives heat as well as light',
        '4-PS3-2',
        [
          N(
            'A flame gives off heat as well as light. Sit near a fire and your skin soaks up the heat, even when the air around is cool.',
          ),
        ],
        'Learned that flames give off heat as well as light.',
      ),
    ],
  ),

  // ---------------------------------------------------------------- A22-14, keptStone
  sc(
    'a22-14-pedro-done-kept',
    [
      N(
        'Abuela turns, and sees you. She looks at your hands, at the way you are holding them, and takes them in hers.',
      ),
      N(
        'Your hands have been cold since the night at the spring. She doesn’t say a word about it; she just keeps them there.',
      ),
      N(
        'The butterflies settle on the rock and on your Nubbin’s crown. Then footsteps: a thin man in a green hood, at the top of the bank.',
      ),
      BR('Mamá.', 'shock'),
      N(
        'Abuela lets go of your hands, gently, and goes to him over the stones, and holds him for a long time.',
      ),
    ],
    [
      notice(
        1,
        'science',
        'heat moves from warmer things to cooler things',
        '4-PS3-2',
        [
          N(
            'Heat always moves from something warmer to something cooler. When Abuela holds your cold hands, her warmth flows into them until they are nearly the same temperature.',
          ),
        ],
        'Learned that heat flows from warmer things to cooler things.',
      ),
    ],
  ),

  // ---------------------------------------------------------------- Hazel’s margin note
  sc(
    'a22-margin-hazel',
    [
      N(
        'Nova’s atlas lies open at the river, and the old woman sitting on a cold rock beside her granddaughter.',
      ),
      N(
        'Beside the river, in faint pencil you have never noticed, there is a note in the margin. You know the hand.',
      ),
      N('“Abuela sat down by the river and stopped being right.”'),
      N('“Took her long enough. Took me longer.”', 'soft'),
      N('And under it, one letter: H.'),
      N(
        'Your Nubbin sits down at the edge of the page, beside the painted rock, and stays there a while.',
      ),
    ],
    [
      ask(
        4,
        'sel',
        'why it can take a long time to say “I was wrong”',
        'CASEL: Self-awareness',
        [
          N(
            'Hazel writes that Abuela “stopped being right”. Why can it take a long time to say, “I was wrong”?',
          ),
        ],
        [
          o('Because it feels like losing', [
            N(
              'A fair answer. Many people feel that way, though admitting a mistake is really how we win something: a fresh start.',
            ),
          ]),
          o('Because we fear what it says about us', [
            N(
              'A thoughtful answer. Being wrong does not make us bad, but it can feel that way until we have practised.',
            ),
          ]),
          o('Because we have been right for so long', [
            N(
              'A sharp answer. Years of habit are hard to put down, and Hazel says it took her longer still.',
            ),
          ]),
        ],
        'Thought about why admitting a mistake can take time, and why it is brave.',
      ),
    ],
  ),

  // ---------------------------------------------------------------- A22-15, step 2
  sc(
    'a22-15-ears',
    [
      N(
        'Dolores walks through the ruins with her eyes shut. You walk beside her, as you have for days, and tell her where to step.',
      ),
      DO('That wall. It’s humming wrong. Something inside it is loose.', 'think'),
      N('The builders take the wall down and set it again. Dolores listens, nods, and moves on.'),
      DO('That beam is creaking in its sleep. And that tile is about to fall on Camilo.', 'think'),
      N(
        'Camilo moves, and the tile falls where he was. He stares at Dolores, and so does everybody.',
      ),
      DO(
        'My gift’s gone, but I can still hear, the ordinary way. I never noticed how much.',
        'happy',
      ),
    ],
    [
      notice(
        1,
        'science',
        'different materials sound different when tapped',
        '4-PS3-2',
        [
          N(
            'Tap a solid wall and a hollow one, and they sound different, because they vibrate in different ways.',
          ),
          N('Builders really do tap walls and listen for the hollow spots.'),
        ],
        'Learned that materials sound different when tapped because they vibrate differently.',
      ),
    ],
    [
      ch('marvel', 'Tell her she’s a marvel.', [
        DO('Nobody ever...', 'soft'),
        N('She has to stop. Mariano, beside her, hands her a handkerchief.'),
      ]),
      ch('listen', 'Ask what she hears now.', [
        DO(
          'Hammers. Everybody laughing. Tío Bruno, telling the rats a story under the stairs. It’s lovely.',
          'soft',
        ),
      ]),
    ],
  ),
  sc(
    'a22-15-hands',
    [
      N(
        'Luisa is standing in the middle of the ruins with a load of bricks, out of habit. Her arms are shaking.',
      ),
      N('You take the bricks off her, as you have every day since the landing, and put them down.'),
      LU('I should be lifting the beams. I always do the beams.', 'sad'),
      N(
        'The beam she is looking at takes six neighbours to move, and they move it. Nobody needed her to.',
      ),
      N(
        'Luisa sits down on a pile of roof tiles, in the sun. She looks surprised to find herself there.',
      ),
      LU('I’m sitting down. I haven’t sat down in... I don’t know. Years.', 'soft'),
    ],
    [
      ask(
        3,
        'science',
        'comparing solutions: a wheelbarrow carries heavy loads more easily',
        '3-5-ETS1-2',
        [
          N(
            'To move a huge pile of bricks, would a wheelbarrow or a basket be the better solution, and why?',
          ),
        ],
        [
          o(
            'A wheelbarrow: the wheel carries the weight, and the long handles act as a lever',
            [
              N(
                'Yes. The wheel takes the load, and the lever of the handles multiplies your lifting, so you can move far more with less effort.',
              ),
            ],
            true,
          ),
          o('A basket', [
            N(
              'A basket is fine for a few bricks, but you carry all the weight yourself. A wheelbarrow does better with heavy loads.',
            ),
          ]),
          o('Both work equally well', [
            N(
              'Both carry bricks, but a wheelbarrow carries more with less strain, so it is the better design for this job.',
            ),
          ]),
        ],
        'Compared two ways to carry a heavy load and judged the wheelbarrow better.',
      ),
    ],
    [
      ch('carry', 'Carry for her.', [
        N(
          'You carry bricks all morning, and Luisa sits and tells you where to put them. She is very bossy about it, and much happier.',
        ),
      ]),
      ch('sit', 'Sit down next to her for a minute.', [
        N(
          'You sit down beside her. Your Nubbin climbs onto her boot and falls asleep, as it did once before, and she laughs.',
        ),
      ]),
    ],
  ),

  // ---------------------------------------------------------------- A22-16, the stub
  sc(
    'a22-16-stub-flicker',
    [
      N(
        'Mirabel takes a candle stub from her pocket and lights it from the new flame in the window.',
      ),
      MI('For you. To take home.', 'soft'),
      N(
        'You hold your lamp out. Your own thin blue flicker leans towards the new flame, and for a moment they burn together.',
      ),
      MI('Yours is a stubborn one. Look after it. It’ll come right.', 'soft'),
    ],
    [
      ask(
        3,
        'sel',
        'when stubbornness is a strength',
        'CASEL: Self-management',
        [
          N(
            'Mirabel calls your small blue flame stubborn, and she means it as a compliment. When is stubbornness a strength, and when is it not?',
          ),
        ],
        [
          o('A strength when we keep trying at something good', [
            N('A fair answer. Not giving up on something worthwhile is stubbornness at its best.'),
          ]),
          o('Not a strength when we refuse to listen', [
            N(
              'A fair answer. Stubbornness that shuts out other people can hurt, like Abuela’s grip.',
            ),
          ]),
          o('Both, depending on what we are being stubborn about', [
            N(
              'A thoughtful answer. The same trait can help or harm, so it is worth asking what it is for.',
            ),
          ]),
        ],
        'Thought about when stubbornness is a strength and when it is not.',
      ),
    ],
  ),
  sc(
    'a22-16-stub-lit',
    [
      N(
        'Mirabel takes a candle stub from her pocket and lights it from the new flame in the window.',
      ),
      MI('For you. To take home.', 'soft'),
      N(
        'You hold your lamp up beside it. The two flames, hers and your own, burn side by side, the same height.',
      ),
      MI('Look at that. Two houses.', 'happy'),
    ],
    [
      notice(
        3,
        'sel',
        'sharing does not make a gift smaller',
        'CASEL: Relationship skills',
        [
          N(
            'Mirabel’s new flame and your steady one burn side by side, and neither is smaller for the other. Kindness works like that: you can share it without having less.',
          ),
        ],
        'Heard that kindness can be shared without running out.',
      ),
    ],
  ),
  sc(
    'a22-16-stub-warm',
    [
      N(
        'Mirabel takes a candle stub from her pocket and lights it from the new flame in the window.',
      ),
      MI('For you. To take home.', 'soft'),
      N(
        'You hold your lamp up beside it. Your red-gold flame and her new one burn side by side, and you feel the warmth on your face.',
      ),
      MI('Yours is warm. Like a kitchen. Somebody loves that one.', 'happy'),
    ],
    [
      notice(
        3,
        'sel',
        'feeling cared for gives us warmth to share',
        'CASEL: Social awareness',
        [
          N(
            'Mirabel says somebody loves your flame. Feeling cared for is a warmth we feel inside, and it helps us look after others too.',
          ),
        ],
        'Heard that feeling cared for helps us care for others.',
      ),
    ],
  ),

  // ---------------------------------------------------------------- A22-16, the photo
  sc(
    'a22-16-photo-ears',
    [
      N(
        'The photographer from the village sets up his camera in the courtyard, under a black cloth.',
      ),
      N(
        'The whole family crowds onto the stairs, Bruno too, at the front this time, holding Antonio. The rats are not in it, officially.',
      ),
      MI('Wait. Wait! You too. Get in!', 'happy'),
      N('You end up at the edge, between Mirabel and Dolores. Dolores leans over to whisper.'),
      DO('Mariano’s going to ask me. Next week. I heard him practising in the market.', 'happy'),
      NB('Everybody, very still!'),
    ],
    [
      ask(
        4,
        'literacy',
        'a figure of speech that is not literal',
        'L.4.5',
        [
          N(
            'If you whisper that her secret is safe, Dolores replies, “I heard you think it.” She cannot really hear thoughts. What is she doing with that sentence?',
          ),
        ],
        [
          o(
            'Making a loving joke: she can guess what you are thinking',
            [
              N(
                'Yes. It is a figure of speech, and a warm one: she knows you well enough to guess your thoughts.',
              ),
            ],
            true,
          ),
          o('Telling a lie', [
            N(
              'A lie is meant to fool someone, and nobody is fooled here. It is a joke between friends.',
            ),
          ]),
          o('Telling the literal truth', [
            N(
              'Her gift lets her hear sounds, not thoughts. She is joking, and the narration tells us so.',
            ),
          ]),
        ],
        'Recognised a joke that is a figure of speech rather than a literal statement.',
      ),
    ],
    [
      ch('smile', 'Smile.', [
        N('You smile. Dolores can’t stop smiling at all, and the photograph catches her trying.'),
      ]),
      ch('secret', 'Whisper that her secret is safe.', [
        DO('I know. I heard you think it.', 'happy'),
        N('She can’t, of course. But the photograph catches you both laughing.'),
      ]),
    ],
  ),
  sc(
    'a22-16-photo-hands',
    [
      N(
        'The photographer from the village sets up his camera in the courtyard, under a black cloth.',
      ),
      N(
        'The whole family crowds onto the stairs, Bruno too, at the front this time, holding Antonio. The rats are not in it, officially.',
      ),
      MI('Wait. Wait! You too. Get in!', 'happy'),
      N(
        'You end up at the edge, beside Mirabel and Luisa. Luisa is sitting on the bottom step, and she pulls you down beside her.',
      ),
      LU('Sit. It’s allowed. I checked.', 'happy'),
      NB('Everybody, very still!'),
    ],
    [
      notice(
        4,
        'health',
        'rest and posture protect the body',
        'CASEL: Self-management',
        [
          N(
            'Sitting rests the big muscles of the legs and back. Short breaks, and sitting with your back supported, keep a body from getting strained.',
          ),
        ],
        'Learned that short rests and good posture protect the body from strain.',
      ),
    ],
    [
      ch('sit', 'Sit.', [
        N(
          'You sit. In the photograph the two of you are the only ones sitting down, and you both look very pleased about it.',
        ),
      ]),
      ch('nubbin', 'Put your Nubbin on Luisa’s boot.', [
        N('Your Nubbin climbs onto her boot for the photograph. Luisa laughs just as it is taken.'),
      ]),
    ],
  ),

  // ---------------------------------------------------------------- the Grove keepsake
  sc(
    'a22-grove-candle',
    [
      N(
        'Back in the Grove, you walk out to the fourth post by the long grass and hang the painted tin holder from its hook.',
      ),
      N(
        'The candle stub in it won’t stay lit here, and you knew it wouldn’t. Mirabel said some lights have to be waited for.',
      ),
      N(
        'Your Nubbin sits under the post with a yellow butterfly on its crown, and looks up at the stub as if it were a promise.',
      ),
    ],
    [
      ask(
        2,
        'sel',
        'what keeps hope alive while we wait',
        'CASEL: Self-management',
        [
          N(
            'Waiting for a light that may not come for a long time takes hope. What helps people keep hoping?',
          ),
        ],
        [
          o('A promise or a reminder, like the stub', [
            N('A good answer. A small keepsake can hold a hope steady until the day arrives.'),
          ]),
          o('Good company while we wait', [
            N('A good answer. Hope is easier to carry together, as your Nubbin shows.'),
          ]),
          o('Having something useful to do', [
            N('A good answer. Busy hands make the waiting go by, and your Grove is full of jobs.'),
          ]),
        ],
        'Thought about what helps people keep hoping while they wait.',
      ),
    ],
  ),
  sc(
    'a22-grove-candle-lit',
    [
      N(
        'Back in the Grove, you walk out to the fourth post by the long grass and hang the painted tin holder from its hook.',
      ),
      N(
        'The stub catches from the lantern above it at once, as if it had only been waiting to be introduced.',
      ),
      N(
        'Two flames by the long grass now, one from here and one from a valley far away. Your Nubbin sits under them, very pleased.',
      ),
    ],
    [
      notice(
        2,
        'science',
        'a flame burns the vapour of melted wax',
        '2-PS1-4',
        [
          N(
            'Heat from the lantern melts the stub’s wax, and the wick draws it up as vapour that catches fire.',
          ),
          N('A candle flame is really burning wax vapour, not the wick itself.'),
        ],
        'Learned that a candle flame burns the vapour of melted wax drawn up the wick.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A22_READER: EduQuest[] = [
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
export const CHECKS: string[] = ['edu:breathe:slowly:5', 'edu:clap:beat:party'];
