/**
 * The Learning Grove, reader band (ages 7–10, read alone): Atlas A12, The Mirror Shard.
 *
 * Source: atlas-a12.ts (ATLAS_A12 and A12_VARIANTS). One EduScene per original scene (every step
 * scene, every done scene, every complete scene and every variant), id `reader:<original id>`.
 * See EDU-STYLE.md. British spelling. Built the same way as edu-a12-sprout.ts.
 *
 * - Every choice id and `set` flag is copied from the original, so `a12-nubbin` still works. The
 *   reader band keeps every choice, including the signature choice in A12-9 (both answers honest).
 * - No line is lifted from the source. The story is retold in new words; none of the eight passages
 *   the outline lists appears, and the rose hymn, Gerda's prayer and Grandmother's reading are never
 *   given in words.
 * - Learning angles (from the outline): where Denmark is and who Andersen was (A12-1, 2); six-armed
 *   snowflakes and their symmetry (A12-3, 14); how frost forms (A12-2, 13); the Arctic Circle, the
 *   midnight sun, polar night and the northern lights (A12-10 to 15); the Sámi today: Sápmi across
 *   four countries, reindeer herding as a living job, the Sámi languages (A12-11, 17); and the
 *   seasons turning on Gerda's road (A12-2, 5, 6, 17, 18).
 * - Hard things: Kay's cruelty is the splinter's; the raven's death is said plainly, with comfort;
 *   the robber girl's knife stays in the wall; the Snow Queen is cold and lovely, never a monster.
 * - Culture: always “the Sámi woman” and “the Finnish woman”, never “Lapp”. No gákti, drum or sacred
 *   item is described. Sámi facts are kept to the well established, for the Sámi adviser to check.
 * - Temperatures in °C with °F in brackets.
 */
import type { EduQuest, EduScene, GlossaryEntry, Lesson } from './types';
import type { Line, Choice } from '../config/story';

type Mood = Line['mood'];
const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const Y = say('you');
const GE = say('a12-gerda');
const KA = say('a12-kay');
const GR = say('a12-gran');
const QU = say('a12-queen');
const TR = say('a12-troll');
const OW = say('a12-old-woman');
const RO = say('a12-roses');
const BW = say('a12-bindweed');
const SD = say('a12-snowdrop');
const BC = say('a12-buttercup');
const NA = say('a12-narcissus');
const RA = say('a12-raven');
const PR = say('a12-palace-raven');
const PN = say('a12-prince');
const PS = say('a12-princess');
const RG = say('a12-robber-girl');
const BA = say('a12-bae');
const PI = say('a12-pigeons');
const SA = say('a12-sami');
const FI = say('a12-finnish');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];
type Domain = Lesson['domain'];

/** One answer option. `best` marks the answer the lesson teaches; a think question has none. */
const opt = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

/** A notice beat: a character shares something true. */
const note = (
  after: number,
  domain: Domain,
  skill: string,
  standard: string,
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

/** An ask beat: a question with options. Leave every option without `best` for a think question. */
const ask = (
  after: number,
  domain: Domain,
  skill: string,
  standard: string,
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

/** A do beat: the child does something in the Grove. */
const doit = (
  after: number,
  domain: Domain,
  skill: string,
  standard: string,
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

/** One reader scene. Lesson ids are `reader:<of>-l<n>`, numbered in play order. */
const sc = (
  of: string,
  lines: Line[],
  beats: Beat[],
  extra: { choices?: Choice[]; defaultChoice?: string } = {},
): EduScene => ({
  id: `reader:${of}`,
  of,
  band: 'reader',
  lines,
  ...extra,
  lessons: [...beats]
    .sort((a, b) => a.after - b.after)
    .map((b, i) => ({ id: `reader:${of}-l${i + 1}`, ...b })),
});

/** A glossary word, first used in the reader version of scene `of`. */
const gloss = (word: string, meaning: string, of: string): GlossaryEntry => ({
  word,
  meaning,
  scene: `reader:${of}`,
});

const quest = (
  of: string,
  title: string,
  goals: EduQuest['goals'],
  scenes: EduScene[],
  glossary: GlossaryEntry[],
  notes?: string,
): EduQuest => ({
  id: `reader:${of}`,
  of,
  band: 'reader',
  title,
  goals,
  scenes,
  ...(glossary.length ? { glossary } : {}),
  ...(notes ? { notes } : {}),
});

// ================================================================== A12-1 The Troll’s Mirror
const Q01: EduQuest = quest(
  'a12-01',
  'The Troll’s Mirror',
  {
    'a12-01-s1': {
      goal: 'Step into the cut-paper town and take the room under the eaves.',
      hint: 'Touch the page, then climb the attic stairs to Grandmother.',
    },
    'a12-01-s2': {
      goal: 'Hold the candle for Grandmother’s shadow-show.',
      hint: 'Stand by the attic wall and keep the candle still.',
    },
    'a12-01-s3': {
      goal: 'Watch the troll’s mirror break.',
      hint: 'Keep the candle steady to the end of the show.',
    },
  },
  [
    sc(
      'a12-01-arrive',
      [
        N(
          'Nova’s atlas falls open at a page of cut paper: rooftops, chimneys, and two attic windows with a gutter between them.',
        ),
        N(
          'The paper is so fine it stirs when you breathe. Then it’s a steep wooden stair, and you’re on it, with a bag and your Nubbin.',
        ),
        GR(
          'There you are. The lodger. You’ll want the room under the eaves, and the bed by the chimney.',
        ),
        GR('Mind your head on the beam. Everybody hits it, the first week.'),
        N('Grandmother is small and quick, with her spectacles pushed up into white hair.'),
        N(
          'In the window across the gutter, two faces appear: a boy and a girl, both trying to see you at once.',
        ),
        KA('Is that the new lodger? Has it got a dog?'),
        GE('That’s not a dog, Kay. Look at its ears.'),
        GR('And what’s this? It isn’t a cat. I’ve had cats.', 'think'),
      ],
      [
        ask(
          4,
          'social-studies',
          'where Denmark is',
          'D2.Geo.2.K-2',
          [
            N(
              'This town is in Denmark, a small country in northern Europe. It is one long peninsula and hundreds of islands.',
            ),
            N('Denmark’s peninsula is joined by land to only one other country. Which one?'),
          ],
          [
            opt(
              'Germany, to the south',
              [
                GR(
                  'That’s right. Walk south out of Denmark and you’re in Germany. Every other way, there’s sea.',
                  'happy',
                ),
              ],
              true,
            ),
            opt('Australia', [
              GR(
                'Australia is on the other side of the world! Denmark’s only land neighbour is Germany, to the south.',
              ),
            ]),
            opt('No country at all', [
              GR(
                'Most of Denmark is islands, so that’s a good guess. But the peninsula touches Germany, to the south.',
              ),
            ]),
          ],
          'Found Denmark on the map of Europe and learned it borders Germany.',
        ),
      ],
      {
        choices: [
          {
            id: 'nubbin',
            label: 'Tell her it’s a Nubbin.',
            then: [
              GR(
                'A Nubbin. Well, it can have the end of the bed and the heel of the loaf, same as a cat.',
              ),
            ],
          },
          {
            id: 'friend',
            label: 'Say it’s your friend, and it goes where you go.',
            then: [GR('Good. Things that go where you go are worth a bed.', 'soft')],
          },
          {
            id: 'bow',
            label: 'Let your Nubbin bow.',
            then: [
              N(
                'Your Nubbin bows, nearly falls down the stairs, and is caught by Grandmother without her looking.',
              ),
              GR('Manners. It can stay.', 'happy'),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-01-arrive-done',
      [
        GR(
          'That’s Kay and Gerda. They live across the gutter, one each side, and they’re in here more than they’re out.',
        ),
        GR('Evenings, there’s a story. You can hold the candle. Lodgers always hold the candle.'),
      ],
      [
        ask(
          1,
          'sel',
          'welcoming someone new',
          'CASEL: Social awareness',
          [
            N(
              'Grandmother gives you a job on your first day. Why might that help a newcomer feel at home?',
            ),
          ],
          [
            opt('A job means you belong', [
              GR('That’s a fair answer. When you’re needed, you’re one of us.', 'soft'),
            ]),
            opt('It stops you feeling shy', [
              GR('It often does. It’s easier to talk when your hands are busy.'),
            ]),
            opt('It doesn’t help at all', [
              GR('Maybe not for everyone. Then a friendly word and a warm bed do the rest.'),
            ]),
          ],
          'Thought about the ways people make a newcomer feel welcome.',
        ),
      ],
    ),
    sc(
      'a12-01-show',
      [
        N(
          'It’s late summer, and the light goes about nine. Kay and Gerda come across by the gutter boxes, the way they always do in summer.',
        ),
        N(
          'Grandmother sits with a sheet of black paper and a long pair of scissors, snipping without looking.',
        ),
        GR(
          'Candle a bit higher. There. Now the wall’s a stage, and you’re the sun. Don’t wobble; suns don’t.',
        ),
        KA('Do the troll one. The troll one’s best.', 'happy'),
        GE('It’s frightening.'),
        KA('That’s why.'),
        GR(
          'Right. Steady, all of you. This one starts badly and ends well, and those are the best sort.',
        ),
        N(
          'A paper troll steps onto the wall, all knees and grin. He holds a mirror cut so thin the candle shows through it.',
        ),
        GR(
          'He had made a mirror that was wrong in a particular way. Anything good shrank in it to nearly nothing.',
        ),
        GR(
          'Anything mean or ugly got bigger and worse. A green meadow looked like boiled spinach.',
          'think',
        ),
        KA('I’d like to look in it.'),
        GE('I wouldn’t.', 'sad'),
      ],
      [
        note(
          1,
          'social-studies',
          'who Hans Christian Andersen was',
          'D2.His.2.K-2',
          [
            N(
              'This story was written by Hans Christian Andersen, born in 1805 in Odense, a town in Denmark. It came out in 1844.',
            ),
            N(
              'Andersen often cut pictures out of paper while he told his stories, just as Grandmother does.',
            ),
          ],
          'Learned that Hans Christian Andersen was a Danish storyteller who made paper cut-outs.',
        ),
        ask(
          7,
          'science',
          'shadow size and distance from the light',
          '1-PS4-2',
          [GR('If I hold the troll closer to the candle, what happens to his shadow on the wall?')],
          [
            opt(
              'It gets bigger',
              [
                GR(
                  'Yes. Closer to the light, he blocks more of it, so the shadow grows. Watch him loom.',
                  'happy',
                ),
              ],
              true,
            ),
            opt('It gets smaller', [
              GR(
                'Try it and see: closer to the candle, he blocks more light, and the shadow gets bigger.',
              ),
            ]),
            opt('It disappears', [
              GR(
                'He’d still block the light, so the shadow stays. It grows bigger as he gets closer.',
              ),
            ]),
          ],
          'Learned that a shadow grows bigger when the object moves closer to the light.',
        ),
      ],
    ),
    sc(
      'a12-01-show-done',
      [
        N(
          'Grandmother does the troll’s voice. It’s lower than you would expect, and very pleased with itself.',
        ),
        TR(
          'Ha! Look how small goodness goes! Look how big the rest of it gets! Isn’t it wonderful?',
          'happy',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'character motive',
          'RL.3.3',
          [N('Why might a troll enjoy a mirror that makes good things look small?')],
          [
            opt(
              'He likes making people feel bad',
              [N('Yes. He enjoys spoiling things. That’s what makes him the villain.')],
              true,
            ),
            opt('He wants to help people', [
              N(
                'Listen to his laugh again. He’s pleased when goodness shrinks, so he isn’t helping.',
              ),
            ]),
          ],
          'Worked out a character’s motive from what he says and how he says it.',
        ),
      ],
    ),
    sc(
      'a12-01-shards',
      [
        GR(
          'The troll kept a school, if you can believe it, and his pupils carried the mirror all round the world.',
        ),
        GR('Then they thought they’d fly up to the sky with it, and make fun of the angels too.'),
        N(
          'The paper mirror climbs the wall in little jerks. The higher it goes, the wider its painted grin spreads.',
        ),
        GR(
          'And it grinned so hard it shook, and shook, until it slipped right out of their hands.',
          'shock',
        ),
        N(
          'Grandmother opens her fingers. A handful of paper snips falls through the candlelight like snow.',
        ),
        GR(
          'It broke into more pieces than there are people. Some were no bigger than a grain of sand.',
        ),
        GR(
          'Get one in your eye and everything looks wrong. Get one in your heart and it goes hard and cold, like a stone in a frosty field.',
        ),
        KA('And then what?'),
        GR('Then you need somebody to come and fetch you.', 'soft'),
      ],
      [
        ask(
          6,
          'literacy',
          'similes',
          'L.4.5',
          [
            N(
              '“Cold, like a stone in a frosty field” is a simile: it compares two things using “like” or “as”. What does this one tell you?',
            ),
          ],
          [
            opt(
              'The heart stops feeling anything',
              [
                GR(
                  'Yes. A stone in frost can’t feel the sun. That’s what a cold heart is like.',
                  'soft',
                ),
              ],
              true,
            ),
            opt('The heart turns into a real stone', [
              GR(
                'Not really. A simile says it’s like a stone: hard and unfeeling, but still a heart.',
              ),
            ]),
          ],
          'Explained what a simile means in a story.',
        ),
      ],
      {
        choices: [
          {
            id: 'brush',
            label: 'Brush the paper snips off Gerda’s sleeve.',
            then: [
              N(
                'You brush them off. Gerda checks her other sleeve herself, twice, and then Kay’s.',
              ),
            ],
          },
          {
            id: 'catch',
            label: 'Catch a snip as it falls.',
            then: [
              N(
                'You catch one on your palm, and it’s only paper. You look at it anyway, a little longer than you meant to.',
              ),
            ],
          },
          {
            id: 'ask',
            label: 'Ask who comes to fetch you.',
            then: [
              GR('Whoever loves you most and is too stubborn to stop. That’s usually how it goes.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-01-shards-done',
      [
        N(
          'The troll laughs on the wall until his paper sides split. Grandmother blows out the candle.',
        ),
        N(
          'In the dark, the draught from the window lifts one snip that isn’t paper. It glints once, and is gone.',
        ),
      ],
      [
        note(
          1,
          'science',
          'mirrors and glass reflect light',
          '1-PS4-2',
          [
            N(
              'The candle is out, so where did the glint come from? A little moonlight from the window, bouncing off glass.',
            ),
          ],
          'Learned that a shiny thing glints because it bounces light back to our eyes.',
        ),
      ],
    ),
    sc(
      'a12-01-complete',
      [
        N(
          'Later, in the room under the eaves, you lie in the bed by the chimney. The other bed creaks, as promised.',
        ),
        N(
          'From your window you can see the gutter, the two boxes across it, and two small rose trees still flowering in the dark.',
        ),
        N('Your Nubbin curls up on your feet. Across the town a clock strikes ten, slow and sure.'),
        N('You fall asleep to the sound of rain beginning, very softly, on the roof.'),
      ],
      [
        ask(
          2,
          'maths',
          'time intervals in hours',
          '3.MD.A.1',
          [
            N(
              'The clock struck ten. If you sleep until seven in the morning, how many hours of sleep is that?',
            ),
          ],
          [
            opt(
              '9 hours',
              [
                N(
                  'Yes. Two hours to midnight, then seven more: nine hours. A good long sleep.',
                  'happy',
                ),
              ],
              true,
            ),
            opt('3 hours', [
              N(
                'Ten to seven isn’t three, because midnight comes in between. Two hours to midnight, plus seven: nine.',
              ),
            ]),
            opt('17 hours', [
              N(
                'Ten plus seven is seventeen, but clocks start again at midnight. Two hours, then seven more: nine.',
              ),
            ]),
          ],
          'Worked out an overnight time interval in hours.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'lodger',
      'Someone who pays to live in a room in another person’s house.',
      'a12-01-arrive',
    ),
    gloss('peninsula', 'A piece of land with water on almost every side.', 'a12-01-arrive'),
    gloss(
      'simile',
      'A way of describing something by saying it is like something else.',
      'a12-01-shards',
    ),
  ],
);

// ================================================================== A12-2 Two Windows
const Q02: EduQuest = quest(
  'a12-02',
  'Two Windows',
  {
    'a12-02-s1': {
      goal: 'Water the roses in the gutter boxes.',
      hint: 'Climb out to the gutter with the watering can and do the top of the arch.',
    },
    'a12-02-s2': {
      goal: 'Warm a coin on the stove and melt a peephole in the frozen window.',
      hint: 'Hold a copper coin on the stove, then press it to the glass.',
    },
    'a12-02-s3': {
      goal: 'Look out of your window that night.',
      hint: 'Wait at your peephole after the house has gone to bed.',
    },
  },
  [
    sc(
      'a12-02-roses',
      [
        N(
          'In the morning you see it all properly: two attics with roofs that nearly touch, and a lead gutter running between them.',
        ),
        N(
          'Long ago the two families each put a box across the gutter. Now peas hang over the edges, and in each box grows a rose tree.',
        ),
        N(
          'The roses have climbed into an arch. Under it are two little stools, and two children who think it’s the best room in town.',
        ),
        GE('You’re tallest. You can do the top of the arch. Don’t drown the peas; they sulk.'),
        KA('Peas don’t sulk.'),
        GE('These ones do.'),
        KA(
          'Gran says the roses are older than both of us put together. She says they’ll still be here when we’re old.',
        ),
        N('Your Nubbin tries to help by sitting in the watering can.'),
      ],
      [
        ask(
          3,
          'science',
          'what plants need',
          '2-LS2-1',
          [GE('Why do roses up on a roof grow so well, do you think?')],
          [
            opt(
              'Lots of sunlight, and we water them',
              [
                GE(
                  'Exactly. Plants need light and water. Up here there’s sun all day, and we bring the water.',
                  'happy',
                ),
              ],
              true,
            ),
            opt('Because it’s high up', [
              GE(
                'Being high doesn’t feed them. It’s the sunlight up here, and the water we bring.',
              ),
            ]),
            opt('Roses don’t need anything', [
              GE('Everything living needs something! Roses need light, water and good soil.'),
            ]),
          ],
          'Learned that plants need light and water to grow.',
        ),
      ],
      {
        choices: [
          {
            id: 'top',
            label: 'Water the top of the arch, carefully.',
            then: [
              N(
                'You water the high roses. A few drops roll off onto Kay’s head, and he pretends not to notice, very badly.',
              ),
            ],
          },
          {
            id: 'peas',
            label: 'Give the peas a bit extra, in case.',
            then: [
              GE('See? They’re cheering up already.', 'happy'),
              KA('They look exactly the same.'),
            ],
          },
          {
            id: 'nubbin',
            label: 'Lift your Nubbin out of the can first.',
            then: [
              N(
                'Your Nubbin comes out of the can dripping and offended. Gerda dries it on her apron, and it forgives everybody.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-02-roses-done',
      [
        GE(
          'In winter we can’t climb across. We have to go down all our stairs and up all the others.',
        ),
        KA('It takes years.'),
        GE('It takes two minutes.'),
      ],
      [
        ask(
          2,
          'maths',
          'minutes and seconds',
          '4.MD.A.1',
          [N('There are 60 seconds in a minute. How many seconds is Gerda’s two-minute trip?')],
          [
            opt(
              '120 seconds',
              [GE('Yes. Sixty and sixty make a hundred and twenty. Not years at all.', 'happy')],
              true,
            ),
            opt('62 seconds', [
              GE(
                'That’s one minute and two seconds. Two whole minutes is sixty plus sixty: one hundred and twenty.',
              ),
            ]),
            opt('200 seconds', [GE('A bit too many. Sixty plus sixty is one hundred and twenty.')]),
          ],
          'Changed minutes into seconds.',
        ),
      ],
    ),
    sc(
      'a12-02-frost',
      [
        N(
          'Winter comes, and the windows freeze over with ferns of ice. You can’t see across the gutter at all.',
        ),
        N(
          'Kay and Gerda warm copper coins on the stove and press them to the glass. Copper passes heat on quickly, so the coin melts the ice fast.',
        ),
        N(
          'Each coin melts a round peephole, as neat as a button. A bright eye looks through each one, across the snow.',
        ),
        GR('Look at the white bees swarming.', 'soft'),
        KA('Have they got a queen? Like real bees?'),
        GR(
          'They have. She flies where the swarm is thickest, and she never stays on the ground for long.',
        ),
        GR(
          'Some nights she flies through the streets and looks in at the windows. That’s when the frost comes up in flowers.',
        ),
        KA('Let her try. I’d put her on the hot stove, and she’d melt.', 'happy'),
      ],
      [
        note(
          1,
          'science',
          'how frost forms',
          '2-ESS2-3',
          [
            N(
              'Warm air indoors holds water you can’t see, called water vapour. When it touches glass colder than 0 °C (32 °F), it freezes.',
            ),
            N('It turns straight into tiny ice crystals, which grow into those feathery ferns.'),
          ],
          'Learned that frost forms when water vapour freezes on a very cold surface.',
        ),
        ask(
          3,
          'literacy',
          'metaphors',
          'L.4.5',
          [N('Grandmother calls the snowflakes “white bees”. Why is that a good metaphor?')],
          [
            opt(
              'They swarm and buzz about in the air',
              [
                GR(
                  'Just so. Snow in the wind whirls about like a swarm of bees, and every swarm has a queen.',
                  'happy',
                ),
              ],
              true,
            ),
            opt('Snowflakes can sting you', [
              GR(
                'They don’t sting! It’s the swarming that’s alike: thousands of little white things, whirling.',
              ),
            ]),
          ],
          'Explained a metaphor that compares snowflakes to bees.',
        ),
      ],
      {
        choices: [
          {
            id: 'rude',
            label: 'Tell Kay that’s no way to treat a guest.',
            then: [KA('She isn’t a guest. She’s weather.')],
          },
          {
            id: 'seen',
            label: 'Ask Grandmother if she’s ever seen her.',
            then: [
              GR('Once or twice. Through the glass. Not close, and that’s how I like it.', 'think'),
            ],
          },
          {
            id: 'peep',
            label: 'Look out of your own peephole.',
            then: [
              N(
                'The flakes go past your peephole in their thousands. One of them seems, for a moment, to look back.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-02-frost-done',
      [
        N('Grandmother smooths Kay’s hair and starts a story about a goose instead.'),
        N('She doesn’t mention the queen again.'),
      ],
      [
        ask(
          1,
          'sel',
          'reading other people’s feelings',
          'CASEL: Social awareness',
          [N('Why do you think Grandmother changes the subject so quickly?')],
          [
            opt('Kay’s boasting worried her', [
              N(
                'That’s a thoughtful answer. Grown-ups sometimes change the subject when something worries them.',
              ),
            ]),
            opt('She just likes geese', [
              N('Maybe! But notice she smooths his hair first, which looks like care, or worry.'),
            ]),
            opt('She was tired of the story', [
              N(
                'Could be. Watch her face next time Kay talks about the queen, and see what you think.',
              ),
            ]),
          ],
          'Thought about what a character’s actions show about her feelings.',
        ),
      ],
    ),
    sc(
      'a12-02-night',
      [
        N(
          'That night you can’t sleep. Your Nubbin can’t either; it sits on the sill with its nose to your peephole.',
        ),
        N('Across the gutter Kay is up too, standing on a chair at his window.'),
        N(
          'A few flakes drift down. One, bigger than the rest, settles on the edge of a flower box, and stays.',
        ),
        N(
          'It grows into a woman, tall and fine, dressed in white gauze made of a million starry flakes.',
        ),
        N('She is lovely, and she is ice, all of her, dazzling and glittering. And she is alive.'),
        N('Her eyes are like two bright stars, but there is no rest in them at all.'),
        N('She looks in at Kay’s window. She nods to him, and lifts one hand, and beckons.'),
      ],
      [
        ask(
          5,
          'literacy',
          'describing a character',
          'RL.4.3',
          [N('Which words tell you most clearly that the woman is not a warm, ordinary person?')],
          [
            opt(
              '“She is ice, all of her”',
              [
                N(
                  'Yes. She looks like a woman, but she’s made of ice. That’s the clue that matters.',
                ),
              ],
              true,
            ),
            opt('“Tall and fine”', [
              N('Lots of people are tall and fine. The clue is “she is ice, all of her”.'),
            ]),
          ],
          'Used the words of a description to understand a character.',
        ),
      ],
      {
        choices: [
          {
            id: 'knock',
            label: 'Knock on your window.',
            then: [
              N(
                'You knock hard on the glass. Kay jumps down off his chair, and the woman turns her head towards you, slowly.',
              ),
              N(
                'Then she isn’t there. Something large and white goes past the window, like a bird.',
              ),
            ],
          },
          {
            id: 'call',
            label: 'Call Kay’s name.',
            then: [
              N('You call his name across the gutter. Kay startles and jumps down from his chair.'),
              N(
                'When you look again there’s nobody on the box. Something white goes past, like a big bird in the dark.',
              ),
            ],
          },
          {
            id: 'hold',
            label: 'Pull your Nubbin back from the glass.',
            then: [
              N(
                'You lift your Nubbin away from the window. It’s cold right through, and it burrows into your shirt.',
              ),
              N(
                'Kay jumps down off his chair. When you look again a big white bird is passing, and the box is empty.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-02-night-done',
      [
        N('You sit up until morning.'),
        N('The frost on your window has grown into flowers you have never seen in any garden.'),
      ],
      [
        note(
          1,
          'science',
          'ice crystals grow',
          '2-ESS2-3',
          [
            N(
              'Frost keeps growing all night. More water vapour freezes onto the crystals already there, so the patterns spread across the glass.',
            ),
          ],
          'Learned that frost patterns grow as more water vapour freezes onto them.',
        ),
      ],
    ),
    sc(
      'a12-02-complete',
      [
        KA('It was a dream. I dreamed a lady on the box. That’s all.'),
        GE('I dreamed you were standing on a chair.', 'think'),
        KA('Well, I wasn’t.'),
        N('Grandmother, cutting the bread, looks at Kay a moment longer than usual.'),
        N(
          'Then the thaw comes, and the swallows come back, and the roses wake up in the gutter as if nothing at all has happened.',
        ),
        N('You have seen late summer, then deep winter, and now spring. The year is turning.'),
      ],
      [
        ask(
          5,
          'science',
          'the seasons in order',
          'K-ESS2-1',
          [N('The story began in late summer. Which season comes next, after this spring?')],
          [
            opt(
              'Summer',
              [N('Yes. Summer, autumn, winter, spring, and round to summer again.', 'happy')],
              true,
            ),
            opt('Autumn', [N('Autumn comes after summer. After spring comes summer again.')]),
            opt('Winter', [
              N('Winter came before spring. Next it’s summer: the year goes round like a wheel.'),
            ]),
          ],
          'Put the four seasons in order.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'gutter',
      'A channel along the edge of a roof that carries rainwater away.',
      'a12-02-roses',
    ),
    gloss(
      'water vapour',
      'Water that has turned into an invisible gas in the air.',
      'a12-02-frost',
    ),
    gloss('beckons', 'Signals to someone with a hand to come closer.', 'a12-02-night'),
  ],
);

// ================================================================== A12-3 The Splinter
const Q03: EduQuest = quest(
  'a12-03',
  'The Splinter',
  {
    'a12-03-s1': {
      goal: 'Sit under the rose arch with Kay and Gerda.',
      hint: 'Climb out to the gutter and take the spare stool.',
    },
    'a12-03-s2': {
      goal: 'Put the rose box straight after Kay kicks it.',
      hint: 'Lift the box back onto the gutter and press the earth round the roots.',
    },
    'a12-03-s3': {
      goal: 'Go out in the snow when Kay calls you to see his glass.',
      hint: 'Follow Gerda down to the street and look where Kay shows you.',
    },
  },
  [
    sc(
      'a12-03-arch',
      [
        N(
          'It’s summer, and the roses have never been so good. Gerda has learned a hymn with roses in it, and hums it all day.',
        ),
        N(
          'She hums it to Kay under the arch, and he hums it back. Your Nubbin hums the tune a beat behind them both.',
        ),
        N(
          'They’re looking at a picture book of animals and birds. Kay is doing the noises, and the noises are terrible.',
        ),
        KA('That’s an elk. It goes like this.'),
        GE('It does not.', 'happy'),
        N('Across the town, the church clock begins to strike five.'),
        KA('Ow! Something stung me. In my heart. And my eye, something’s gone in my eye.', 'sad'),
        N('In the low sun you see it: a glint, smaller than a grain of sand, there and gone.'),
      ],
      [
        note(
          7,
          'science',
          'how eyes protect themselves',
          '4-LS1-1',
          [
            N(
              'Eyes have their own defences. Blinking sweeps dust away, and tears wash out what blinking can’t.',
            ),
          ],
          'Learned how blinking and tears protect our eyes.',
        ),
      ],
      {
        choices: [
          {
            id: 'eye',
            label: 'Look in Kay’s eye.',
            then: [
              N(
                'You hold his eyelid gently and look, and there’s nothing there. You are almost sure there’s nothing there.',
              ),
            ],
          },
          {
            id: 'hand',
            label: 'Hold Kay’s hand till it stops.',
            then: [
              N(
                'You hold his hand, and it’s warm. After a moment it isn’t quite as warm, and you tell yourself it is.',
              ),
            ],
          },
          {
            id: 'gran',
            label: 'Call Grandmother.',
            then: [
              N(
                'Grandmother comes up, peers into his eye with her spectacles on, and finds nothing at all.',
              ),
              GR('Blink. Again. There. Gone.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-03-arch-done',
      [KA('It’s gone. I think it’s gone.'), N('It hasn’t gone.')],
      [
        ask(
          1,
          'literacy',
          'point of view',
          'RL.3.6',
          [N('Kay thinks it’s gone, but the narrator says it hasn’t. Who knows more right now?')],
          [
            opt(
              'The narrator, and so do you',
              [
                N(
                  'Yes. The storyteller lets you know something Kay doesn’t. That’s what makes you worry for him.',
                ),
              ],
              true,
            ),
            opt('Kay', [
              N(
                'Kay can only feel the sting fading. The narrator sees the whole story, and says it’s still there.',
              ),
            ]),
          ],
          'Compared what a character knows with what the reader knows.',
        ),
      ],
    ),
    sc(
      'a12-03-kick',
      [
        GE('Kay? Are you all right?', 'sad'),
        KA('Why are you crying? It makes you look ugly.', 'angry'),
        KA(
          'There’s nothing the matter with me. That rose has a worm in it. And that one’s all crooked.',
        ),
        KA('They’re ugly roses. They match the ugly boxes.'),
        N(
          'He kicks the box. It skids along the gutter, and he snaps off two roses and drops them over the edge.',
        ),
        N('You reach for him, and then you understand what you saw.'),
        N(
          'You can’t take a splinter out of a heart. Not with your hands, and not with anything you own.',
          'sad',
        ),
        N(
          'Kay goes in and slams his window. Gerda stands in the gutter with her picture book held against her chest.',
        ),
        GE('He said it was a book for babies.', 'sad'),
      ],
      [
        ask(
          3,
          'sel',
          'whose fault unkindness is',
          'CASEL: Social awareness',
          [N('Is Kay choosing to be unkind, or is the splinter doing it? What do you think?')],
          [
            opt('The splinter is doing it', [
              N(
                'That’s fair: something has got in front of the real Kay. It still hurts Gerda, though.',
              ),
            ]),
            opt('Kay is choosing it', [
              N('That’s fair too. Even with a splinter, his words land on a real person.'),
            ]),
            opt('A bit of both', [
              N(
                'A thoughtful answer. Hard days can make us unkind, and we still owe a sorry after.',
              ),
            ]),
          ],
          'Thought about why people are sometimes unkind and how it affects others.',
        ),
        note(
          8,
          'literacy',
          'actions that show feelings',
          'RL.3.3',
          [
            N(
              'Look at Gerda: she holds her book tight against her chest. Writers often show a feeling through what a character does.',
            ),
            N(
              'She is hurt, and that’s allowed. When someone is unkind, it helps to be near a friend.',
            ),
          ],
          'Noticed how a character’s actions show her feelings.',
        ),
      ],
      {
        choices: [
          {
            id: 'roses',
            label: 'Fetch the two roses back for Gerda.',
            then: [
              N(
                'You lean over the gutter’s edge and fish them back. Gerda puts them in a cup of water on her sill.',
              ),
            ],
          },
          {
            id: 'knock',
            label: 'Knock on Kay’s window.',
            then: [
              N(
                'You knock. Kay opens it, looks at you, and does a perfect, horrible impression of your face.',
              ),
              N('Then he shuts it again.'),
            ],
          },
          {
            id: 'quiet',
            label: 'Say nothing. Straighten the box together.',
            then: [
              N(
                'You and Gerda lift the box back into place without a word. Your Nubbin pats the earth flat round the roots.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-03-kick-done',
      [
        N('The rose tree has lost two flowers and a bit of bark.'),
        N(
          'Roses forgive that sort of thing, if they’re left alone. It still has ten flowers open, and more in bud.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'subtraction word problem',
          '1.OA.A.1',
          [
            N(
              'Kay snapped two flowers off the rose tree, and ten are left. How many were there before?',
            ),
          ],
          [
            opt('12', [N('Yes. Ten left, plus the two he snapped: twelve.', 'happy')], true),
            opt('8', [
              N(
                'Eight would be ten take away two. But we want what was there before: ten plus two, twelve.',
              ),
            ]),
            opt('10', [N('Ten is how many are left now. Add back the two he snapped: twelve.')]),
          ],
          'Solved a word problem by working backwards with addition.',
        ),
      ],
    ),
    sc(
      'a12-03-glass',
      [
        N(
          'All that autumn Kay is clever and cruel. He puts on Grandmother’s spectacles and does her voice, and the whole street laughs.',
        ),
        N('He can do anybody. He does Gerda best of all, and he only does the bits that hurt.'),
        GR('He’s a sharp lad. Too sharp, lately.', 'sad'),
        N(
          'When the snow comes he runs out with a big burning-glass, and holds out the blue tail of his coat to catch the flakes.',
        ),
        KA('Look in the glass, Gerda. Look how perfect they are.', 'happy'),
        N(
          'Under the glass each flake is a star, sharp and exact, every arm the same as every other.',
        ),
        KA(
          'Much better than real flowers. Not a single thing wrong with them. If only they didn’t melt.',
        ),
        GE('Real flowers smell of something.'),
        KA('That’s what’s wrong with them.'),
      ],
      [
        doit(
          5,
          'science',
          'snowflakes have six arms',
          '2-ESS2-3',
          'edu:count:snowflake-arms:6',
          [
            N('Count the arms on the flake under the glass. Snow crystals almost always have six.'),
            N(
              'When water freezes, its tiny particles lock together in a six-sided pattern, so the crystal grows six arms.',
            ),
          ],
          'Counted the six arms of a snowflake and learned why there are six.',
        ),
        ask(
          6,
          'maths',
          'lines of symmetry',
          '4.G.A.3',
          [
            N(
              'A line of symmetry cuts a shape into two matching halves. How many lines of symmetry can a perfect six-armed snowflake have?',
            ),
          ],
          [
            opt(
              '6',
              [
                KA(
                  'Six. Through each pair of opposite arms, and between them too. Told you they were perfect.',
                  'happy',
                ),
              ],
              true,
            ),
            opt('1', [KA('Just one? Fold it any of six ways and it matches. Six lines.')]),
            opt('2', [
              KA(
                'More than that. There are three lines through the arms and three between them: six.',
              ),
            ]),
          ],
          'Found the lines of symmetry in a six-armed snowflake.',
        ),
      ],
      {
        choices: [
          {
            id: 'look',
            label: 'Look in the glass.',
            then: [
              N(
                'You look. The flake is beautiful and perfect, and you feel nothing at all looking at it, which frightens you.',
              ),
            ],
          },
          {
            id: 'snowball',
            label: 'Throw a snowball at Kay.',
            then: [
              N(
                'It gets him on the shoulder. For a second he almost laughs like he used to, then he brushes it off and looks bored.',
              ),
            ],
          },
          {
            id: 'gerda',
            label: 'Stand by Gerda.',
            then: [
              N(
                'You stand next to Gerda, and neither of you says anything. Your Nubbin leans on her boot.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-03-glass-done',
      [
        KA('I’m allowed in the big square tomorrow, with the boys who go sledging. Gran said.'),
        GE('Gran said maybe.', 'think'),
      ],
      [
        ask(
          1,
          'sel',
          'honesty',
          'CASEL: Responsible decision-making',
          [N('Grandmother said “maybe”, but Kay says she said yes. What is Kay doing?')],
          [
            opt(
              'Stretching the truth',
              [GE('Yes. “Maybe” isn’t “yes”. Turning one into the other is a kind of fib.')],
              true,
            ),
            opt('Telling it exactly', [
              GE('Not quite. She said maybe. Saying yes when it was maybe isn’t honest.'),
            ]),
          ],
          'Talked about the difference between telling the truth and stretching it.',
        ),
      ],
    ),
    sc(
      'a12-03-complete',
      [
        N('That evening Gerda sits on her stool in the gutter, in the cold, under the bare arch.'),
        GE(
          'He’s still in there. I know he is. It’s just that something’s got in front of him.',
          'soft',
        ),
        N(
          'She looks at you as if you might know what to do. You don’t, and you don’t pretend you do.',
        ),
        N(
          'You sit down next to her instead, on Kay’s stool, and wait with her until Grandmother calls you both in.',
        ),
      ],
      [
        note(
          3,
          'sel',
          'being with a friend who is sad',
          'CASEL: Relationship skills',
          [
            N(
              'You didn’t have an answer, so you sat with her. Being there is a real kind of help, even when you can’t fix anything.',
            ),
          ],
          'Learned that staying with a sad friend is a way of helping.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'burning-glass',
      'An old word for a magnifying glass, a lens that makes small things look bigger.',
      'a12-03-glass',
    ),
    gloss(
      'symmetry',
      'When one half of a shape is a mirror image of the other half.',
      'a12-03-glass',
    ),
  ],
);

// ================================================================== A12-4 The Big Sledge
const Q04: EduQuest = quest(
  'a12-04',
  'The Big Sledge',
  {
    'a12-04-s1': {
      goal: 'Follow Kay to the great square.',
      hint: 'Go down to the square and keep Kay in sight.',
    },
    'a12-04-s2': {
      goal: 'Run after the white sledge.',
      hint: 'Run! Keep after it through the town gate.',
    },
    'a12-04-s3': {
      goal: 'Watch from the rise.',
      hint: 'Stay on the rise. You can’t reach them from here.',
    },
  },
  [
    sc(
      'a12-04-square',
      [
        N('Kay comes past with big gloves on and his sledge on his back.'),
        KA('I’m allowed in the big square. I’m going.'),
        GE('Go with him. Please. Just keep an eye on him. He won’t let me.', 'sad'),
        N(
          'The square is full of noise. The boldest boys tie their sledges to farmers’ carts and get pulled a good way for nothing.',
        ),
        N(
          'Then a great sledge comes in, painted white. Somebody sits in it wrapped in a rough white fur, with a white cap on.',
        ),
        N(
          'It drives round the square. Every boy watches it, and the white driver watches only Kay.',
        ),
      ],
      [
        ask(
          3,
          'science',
          'friction on snow',
          '3-PS2-1',
          [
            N(
              'A cart can pull a loaded sledge across snow quite easily. Why does a sledge slide so well on snow?',
            ),
          ],
          [
            opt(
              'Snow is slippery, so there’s little friction',
              [
                N(
                  'Yes. Friction is the force that slows sliding things. Smooth snow and ice give very little.',
                ),
              ],
              true,
            ),
            opt('Sledges are very light', [
              N(
                'Some are heavy! It’s the snow: it’s slippery, so there’s hardly any friction to slow them.',
              ),
            ]),
            opt('The cold pushes them along', [
              N(
                'Cold doesn’t push. The snow is slippery, so friction is low and the pull of the cart wins.',
              ),
            ]),
          ],
          'Learned that friction is low on snow and ice, so things slide easily.',
        ),
      ],
      {
        choices: [
          {
            id: 'shout',
            label: 'Shout to Kay to stay put.',
            then: [
              KA('Mind your own business, lodger!', 'angry'),
              N('He doesn’t even look round. He’s watching the white sledge.'),
            ],
          },
          {
            id: 'cord',
            label: 'Push through to get hold of his cord.',
            then: [
              N(
                'You push through the crowd towards him. There are too many boys and too many sledges, and the square is suddenly very wide.',
              ),
            ],
          },
          {
            id: 'nubbin',
            label: 'Pick up your Nubbin. It’s gone very still.',
            then: [
              N(
                'You pick it up. It’s staring at the white sledge, and it’s cold to the touch, the way it was at the window.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-04-square-done',
      [
        N(
          'Kay has his cord in his hands. He’s tying a careful knot, with his tongue between his teeth, the way he does sums.',
        ),
      ],
      [
        ask(
          0,
          'health',
          'staying safe with strangers',
          'CASEL: Responsible decision-making',
          [
            N(
              'Kay is about to tie himself to a stranger’s sledge. What’s the safe thing to do when a stranger invites you to go with them?',
            ),
          ],
          [
            opt(
              'Say no, and tell a grown-up you trust',
              [N('Yes. Never go off with someone you don’t know, however friendly they look.')],
              true,
            ),
            opt('Go, if they look kind', [
              N('Looking kind isn’t enough. Stay put, say no, and tell a grown-up you trust.'),
            ]),
          ],
          'Talked about saying no to strangers and telling a trusted adult.',
        ),
      ],
    ),
    sc(
      'a12-04-chase',
      [
        N(
          'As the white sledge comes round again, Kay ties his little sledge to it, and off he goes.',
        ),
        N(
          'Faster, into the next street, and faster. The driver turns and nods to Kay, kindly, as if they’ve known each other for years.',
        ),
        N(
          'Every time Kay reaches to untie the cord, the driver nods again. Every time, Kay sits still.',
        ),
        N('You run. Your Nubbin runs ahead of you, and then you scoop it up and run faster.'),
        N(
          'The sledges go out through the town gate. The snow comes down so thick that you can’t see your own hand.',
        ),
        KA('Stop! Stop! I want to get off!', 'shock'),
        N(
          'He tries to say his prayers, and all that comes is his times tables: six sevens are… six sevens are…',
        ),
        N(
          'You lose them. Then the snow parts for a moment, and you see them from a rise: the sledge has stopped.',
        ),
      ],
      [
        ask(
          6,
          'maths',
          'multiplication facts',
          '3.OA.A.3',
          [N('Kay is stuck on his tables. What are six sevens?')],
          [
            opt(
              '42',
              [
                N(
                  'Yes, forty-two: six groups of seven. Kay can’t find it, because his head is full of snow.',
                ),
              ],
              true,
            ),
            opt('13', [
              N('Thirteen is six plus seven. Six times seven, six groups of seven, is forty-two.'),
            ]),
            opt('36', [N('Thirty-six is six sixes. One more six makes six sevens: forty-two.')]),
          ],
          'Recalled a multiplication fact: 6 × 7 = 42.',
        ),
      ],
    ),
    sc(
      'a12-04-chase-done',
      [
        N(
          'The driver stands up. The fur and the cap are all snow, and the driver is a lady, tall and slender and glittering white.',
        ),
        N('It’s the woman from the window. It’s the Snow Queen.'),
      ],
      [
        ask(
          0,
          'literacy',
          'word meaning from context',
          'L.2.4',
          [N('“Tall and slender.” Which word means about the same as slender?')],
          [
            opt('Thin and graceful', [N('Yes. Slender means slim, in a graceful way.')], true),
            opt('Short and round', [
              N('That’s nearly the opposite! Slender means thin and graceful.'),
            ]),
          ],
          'Worked out the meaning of a describing word from the sentence.',
        ),
      ],
    ),
    sc(
      'a12-04-kiss',
      [
        QU('We’ve come a long way. But you’re shivering. Creep in under my bearskin.'),
        N(
          'She sits Kay beside her and wraps the fur round him. He looks as if he’s sinking into a snowdrift.',
        ),
        QU('Are you still cold?'),
        N(
          'She touches his forehead with a kiss colder than ice. It goes straight to his heart, which is nearly ice already.',
        ),
        N('After that he doesn’t feel the cold at all.'),
        KA('My sledge! Don’t forget my sledge.'),
        N(
          'It’s tied to one of the white hens that fly behind her. She touches his forehead once more, and you watch him forget.',
        ),
        N(
          'Gerda, Grandmother, the roses, the attic: you see them go out of his face like lamps going out down a street.',
          'sad',
        ),
        N(
          'Then the sledge rises over the forest. The wolves howl, and the moon comes out huge and white.',
        ),
      ],
      [
        ask(
          7,
          'literacy',
          'similes',
          'L.4.5',
          [
            N(
              '“Like lamps going out down a street.” What does this simile show about Kay’s memories?',
            ),
          ],
          [
            opt(
              'They go dark one by one',
              [
                N(
                  'Yes. Not all at once: one, then the next, then the next, until the street is dark.',
                ),
              ],
              true,
            ),
            opt('He is turning the lamps off', [
              N(
                'He isn’t doing it himself. His memories are fading, one by one, like lamps going out.',
              ),
            ]),
          ],
          'Explained a simile about memories fading.',
        ),
        note(
          8,
          'sel',
          'feeling helpless',
          'CASEL: Self-awareness',
          [
            N(
              'Watching something bad and not being able to stop it is one of the hardest feelings. It isn’t your fault that you can’t reach him.',
            ),
          ],
          'Talked about the feeling of helplessness and that it is not anyone’s fault.',
        ),
      ],
      {
        choices: [
          {
            id: 'call',
            label: 'Call his name, as loud as you can.',
            then: [
              N(
                'You shout his name. The wind takes it the other way, back towards the town, as if it means to deliver it to Gerda.',
              ),
            ],
          },
          {
            id: 'watch',
            label: 'Stand and watch until they’re gone.',
            then: [N('You watch until the sledge is a speck, and then a star, and then nothing.')],
          },
        ],
      },
    ),
    sc(
      'a12-04-kiss-done',
      [
        N('You walk back in the dark.'),
        N('The town gate is still open, and nobody has noticed anything at all.'),
      ],
      [
        ask(
          1,
          'sel',
          'telling a trusted grown-up',
          'CASEL: Responsible decision-making',
          [
            N(
              'You saw what happened, and nobody else did. What’s the most important thing to do now?',
            ),
          ],
          [
            opt(
              'Tell someone who can help',
              [
                N(
                  'Yes. When you see something worrying, tell a grown-up you trust, straight away.',
                ),
              ],
              true,
            ),
            opt('Keep it a secret', [
              N('Some secrets are too heavy to carry alone. Tell someone you trust.'),
            ]),
          ],
          'Talked about telling a trusted adult when something worrying happens.',
        ),
      ],
    ),
    sc(
      'a12-04-complete',
      [
        N(
          'Gerda is waiting at the top of the stairs. You tell her everything: the white sledge, the lady, the cord.',
        ),
        GE('Then he isn’t lost. He’s been taken. That’s different.', 'think'),
        N(
          'By the end of the week the town says Kay fell in the river by the school. People are very sure about it.',
        ),
        GE('He didn’t. He hates getting wet. He’d never go near it.'),
        N('Grandmother cries quietly for a long winter. Gerda doesn’t, which is worse.'),
      ],
      [
        ask(
          3,
          'literacy',
          'rumour and evidence',
          'RL.3.6',
          [
            N(
              'The town is “very sure”, but nobody saw Kay fall in the river, and you saw the sledge. Whose story would you trust?',
            ),
          ],
          [
            opt('The person who saw it', [
              N('That’s a careful answer. Being sure isn’t the same as having seen it.'),
            ]),
            opt('Whatever most people say', [
              N('Lots of people saying it can feel convincing. Ask: did any of them see it?'),
            ]),
            opt('Nobody, until there’s more to go on', [
              N('A very careful answer. Sometimes waiting for more facts is the wise thing.'),
            ]),
          ],
          'Thought about the difference between rumour and what someone actually saw.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'friction',
      'A force that slows things down when they rub or slide against each other.',
      'a12-04-square',
    ),
    gloss('slender', 'Thin in a graceful way.', 'a12-04-chase-done'),
  ],
);

// ================================================================== A12-5 The Red Shoes
const Q05: EduQuest = quest(
  'a12-05',
  'The Red Shoes',
  {
    'a12-05-s1': {
      goal: 'Sit with Gerda through the long winter.',
      hint: 'Find Gerda on her stool by the gutter.',
    },
    'a12-05-s2': {
      goal: 'Go down to the river with Gerda at dawn.',
      hint: 'Walk with Gerda out of the town to where the boats lie in the rushes.',
    },
    'a12-05-s3': {
      goal: 'Jump into the boat after Gerda.',
      hint: 'Take a run along the bank and jump!',
    },
  },
  [
    sc(
      'a12-05-winter',
      [
        N(
          'It’s a long, dark winter. Everybody in the town has stopped saying Kay’s name, except Gerda.',
        ),
        GE('They say he’s dead. They say it to Gran in the shop, as if that’s helping.'),
        N(
          'Dead would mean his body had stopped working, for ever. But nobody saw that happen, and Gerda doesn’t believe it.',
        ),
        N(
          'Then spring comes. The sun comes out over the roofs, warm on the gutter for the first time since the sledges.',
        ),
        N('The swallows come back from their winter far away, and sit on the gutter, chattering.'),
        GE('I don’t believe it. Kay isn’t dead. He’s somewhere.', 'soft'),
      ],
      [
        note(
          4,
          'science',
          'birds that migrate',
          '3-LS2-1',
          [
            N(
              'Swallows migrate. Each autumn they fly thousands of kilometres south to Africa, where there are insects to eat, and come back in spring.',
            ),
          ],
          'Learned that swallows migrate south for the winter and return in spring.',
        ),
        ask(
          5,
          'sel',
          'hope',
          'CASEL: Self-awareness',
          [N('Everyone else has given up. Why do you think Gerda keeps hoping?')],
          [
            opt('Because she loves him', [
              N('That’s a lovely answer. Love can keep hope going when everyone else stops.'),
            ]),
            opt('Because she saw no proof', [
              N('That’s a sharp answer. Nobody actually saw anything happen to him.'),
            ]),
            opt('Because she’s stubborn', [
              N('Maybe! Grandmother said the one who fetches you is too stubborn to stop.'),
            ]),
          ],
          'Thought about why someone might keep hoping when others give up.',
        ),
      ],
      {
        choices: [
          {
            id: 'agree',
            label: '“Nor do I.”',
            then: [Y('Nor do I.'), GE('Good. That’s three of us, and the swallows.')],
          },
          {
            id: 'north',
            label: 'Remind her what you saw: the sledge went north.',
            then: [
              GE('North. Then I’ll go north. I’ll start by asking the river, in case.', 'think'),
            ],
          },
          {
            id: 'sit',
            label: 'Sit with her and say nothing.',
            then: [
              N(
                'You sit together a long time. A swallow lands on the box between you and looks from one of you to the other.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-05-winter-done',
      [
        GE(
          'I’m going to give the river my red shoes. Kay never saw them. They’re the best thing I’ve got.',
        ),
      ],
      [
        ask(
          0,
          'literacy',
          'character motive',
          'RL.3.3',
          [N('Why does Gerda choose her red shoes, and not something else?')],
          [
            opt(
              'They are the most precious thing she owns',
              [N('Yes. She offers her very best, to show how much she means it.')],
              true,
            ),
            opt('She doesn’t like them', [
              N('She calls them the best thing she’s got. Giving them up is a real sacrifice.'),
            ]),
          ],
          'Explained why a character gives up something precious.',
        ),
      ],
    ),
    sc(
      'a12-05-river',
      [
        N(
          'Early in the morning Gerda puts on her new red shoes. She kisses Grandmother, who is still asleep, and goes out.',
        ),
        N(
          'You go with her, out of the gate and down to the river, with your Nubbin under your arm.',
        ),
        GE(
          'River? Is it true you took my friend? I’ll give you my red shoes if you give him back.',
        ),
        N('The little waves nod at her, oddly, as if they understand.'),
        N(
          'She throws the shoes in. They don’t go far, and the waves carry them straight back to her feet.',
        ),
        GE(
          'I didn’t throw them far enough. The river can’t take them unless they go right out in the middle.',
        ),
        N(
          'There’s a boat among the rushes. Before you can say anything she climbs in and goes to the far end.',
        ),
      ],
      [
        ask(
          5,
          'science',
          'how water moves near the bank',
          '3-PS2-1',
          [N('Why do the shoes come straight back to the bank?')],
          [
            opt(
              'Little waves push floating things towards the shore',
              [
                N(
                  'Yes. Near the edge, ripples wash floating things back in. Out in the middle, the current carries them away.',
                ),
              ],
              true,
            ),
            opt('Shoes can’t float', [
              N(
                'These ones float. It’s the little waves at the edge that push them back to shore.',
              ),
            ]),
          ],
          'Learned that waves near a bank push floating things ashore, while the current in the middle carries them off.',
        ),
      ],
      {
        choices: [
          {
            id: 'wait',
            label: 'Stay on the bank. It’s her offering.',
            then: [N('You stay on the bank. It’s hers to give, and she gives it.')],
          },
          {
            id: 'warn',
            label: 'Tell her to be careful.',
            then: [GE('I am being careful. I’m being careful and quick.', 'think')],
          },
        ],
      },
    ),
    sc(
      'a12-05-river-done',
      [
        N(
          'She throws the shoes from the end of the boat. The boat isn’t tied, and it slides out of the rushes, and keeps going.',
        ),
        GE('Oh!', 'shock'),
      ],
      [
        ask(
          1,
          'health',
          'water safety',
          'CASEL: Responsible decision-making',
          [N('In real life, what should you always have before getting into a boat?')],
          [
            opt(
              'A grown-up with you, and a life jacket on',
              [
                N(
                  'Yes. Boats are fun with a grown-up and a life jacket. Never climb into one alone.',
                ),
              ],
              true,
            ),
            opt('A snack', [
              N('Snacks are nice! But the important things are a grown-up and a life jacket.'),
            ]),
          ],
          'Talked about staying safe near water and boats.',
        ),
      ],
    ),
    sc(
      'a12-05-boat',
      [
        N(
          'The boat is a yard out already, and gliding. Gerda scrambles to the near end, but there’s only water between her and the bank.',
        ),
        N('Your Nubbin jumps first. You don’t think about it at all; you jump after it.'),
        N(
          'You land in the bottom of the boat in a heap. Gerda grabs your coat with both hands, and doesn’t let go for a while.',
        ),
        GE('You came. You didn’t have to come.', 'soft'),
        N(
          'The sparrows fly along the bank beside you, as if to say they’d have come too, if they were bigger.',
        ),
        N(
          'The red shoes float along behind the boat. They can’t catch up, and the boat can’t stop.',
        ),
        GE('Maybe the river’s taking me to Kay. Maybe that’s its answer.', 'think'),
      ],
      [
        note(
          0,
          'maths',
          'units of length',
          '4.MD.A.1',
          [
            N(
              'A yard is an old measure, a little less than a metre: about 91 centimetres. A big stride, or one jump.',
            ),
          ],
          'Compared an old unit of length, the yard, with the metre.',
        ),
        note(
          3,
          'sel',
          'showing up for a friend',
          'CASEL: Relationship skills',
          [
            N(
              'Nobody asked you to jump. Sometimes friendship means just being there when it matters.',
            ),
          ],
          'Talked about what it means to show up for a friend.',
        ),
      ],
      {
        choices: [
          {
            id: 'oar',
            label: 'Look for an oar.',
            then: [
              N(
                'There’s no oar: only a bailing can, a bit of rope and a very old apple. Your Nubbin eats the apple.',
              ),
            ],
          },
          {
            id: 'shoes',
            label: 'Reach for the red shoes.',
            then: [
              N(
                'You stretch over the side. Your fingers brush one shoe, and then the current takes it, as if the river has said yes.',
              ),
            ],
          },
          {
            id: 'sit',
            label: 'Sit back and let it take you.',
            then: [
              N(
                'You sit back. Gerda sits beside you in her stockings, and watches the banks go by.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-05-boat-done',
      [
        N(
          'The banks are lovely: flowers, old trees, sheep and cows on the slopes. There isn’t a single person anywhere.',
        ),
      ],
      [
        ask(
          0,
          'science',
          'rivers flow downhill',
          '2-ESS2-2',
          [N('The boat drifts downstream all on its own. Which way does a river always flow?')],
          [
            opt(
              'Downhill, towards a lake or the sea',
              [N('Yes. Water runs downhill, so every river flows down towards a lake or the sea.')],
              true,
            ),
            opt('Whichever way the wind blows', [
              N(
                'Wind makes ripples, but the river itself runs downhill, towards a lake or the sea.',
              ),
            ]),
          ],
          'Learned that rivers flow downhill towards lakes and seas.',
        ),
      ],
    ),
    sc(
      'a12-05-complete',
      [
        N(
          'All day the boat goes downstream, about three kilometres every hour, for eight hours. Gerda sings a little, and your Nubbin hums along.',
        ),
        N(
          'Then you come to a cherry orchard, and a little house with odd red and blue windows and a thatched roof.',
        ),
        N('Outside stand two wooden soldiers, presenting arms as the boat goes by.'),
        GE('Hello! Hello! Can you help us?'),
        N('The soldiers don’t answer, being wooden. But somebody else does.'),
      ],
      [
        ask(
          0,
          'maths',
          'distance, speed and time',
          '4.MD.A.2',
          [N('Three kilometres every hour, for eight hours. How far has the boat drifted?')],
          [
            opt(
              '24 kilometres',
              [
                N(
                  'Yes. Eight lots of three is twenty-four kilometres. A long way from home.',
                  'happy',
                ),
              ],
              true,
            ),
            opt('11 kilometres', [
              N(
                'That’s three plus eight. It’s three kilometres for each of eight hours: three times eight, twenty-four.',
              ),
            ]),
            opt('38 kilometres', [
              N('A little too far. Three times eight is twenty-four kilometres.'),
            ]),
          ],
          'Solved a distance problem by multiplying speed by time.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'migrate',
      'To travel a long way to another place when the seasons change.',
      'a12-05-winter',
    ),
    gloss('current', 'The steady flow of water in one direction, as in a river.', 'a12-05-boat'),
  ],
);

// ================================================================== A12-6 The Garden That Forgets
const Q06: EduQuest = quest(
  'a12-06',
  'The Garden That Forgets',
  {
    'a12-06-s1': {
      goal: 'Meet the old woman of the cherry house.',
      hint: 'Let her pull the boat in with her stick, then go inside.',
    },
    'a12-06-s2': {
      goal: 'Spend the summer in the old woman’s garden.',
      hint: 'Explore the flower beds, and follow your Nubbin.',
    },
    'a12-06-s3': {
      goal: 'Ask the flowers if they know where Kay is.',
      hint: 'Talk to the roses, then to the other flowers in turn.',
    },
  },
  [
    sc(
      'a12-06-cherries',
      [
        N(
          'A very old woman comes out of the house, leaning on a crooked stick. She wears a big sun hat painted with lovely flowers.',
        ),
        OW('You poor little thing. However did you get out on this big wide river?', 'soft'),
        N(
          'She hooks the boat with her stick and draws it in to the bank. She’s strong, for somebody so old.',
        ),
        N(
          'She takes you both inside and gives you cherries, as many as you like. Gerda tells her everything.',
        ),
        OW('Kay? Hm. He hasn’t come by. He will, I expect. Don’t be sad. Eat your cherries.'),
        N(
          'While Gerda eats, the old woman combs her hair with a golden comb. With every stroke Gerda looks a little less worried.',
        ),
        N(
          'The old woman isn’t wicked. She knows a little magic, for her own amusement, and she has always wanted a little girl.',
        ),
        N(
          'You feel drowsy too, and the cherries are very good. It’s hard to remember what you were in such a hurry about.',
        ),
      ],
      [
        note(
          3,
          'science',
          'fruit holds seeds',
          '3-LS1-1',
          [
            N(
              'Every cherry has a hard stone in the middle. Inside the stone is a seed, which could grow into a whole new cherry tree.',
            ),
          ],
          'Learned that a fruit holds the seed of a new plant.',
        ),
        ask(
          6,
          'sel',
          'kindness and letting go',
          'CASEL: Social awareness',
          [
            N(
              'The old woman is kind, and lonely. Is it kind to keep someone with you if they need to be somewhere else?',
            ),
          ],
          [
            opt('No, kind means letting them go', [
              N(
                'That’s a thoughtful answer. Caring for someone means caring about what they need, too.',
              ),
            ]),
            opt('Yes, if you look after them well', [
              N('Fair: she does look after Gerda well. But Gerda has somewhere she needs to be.'),
            ]),
            opt('It depends', [
              N('A wise answer. It depends on what the other person wants and needs.'),
            ]),
          ],
          'Thought about whether keeping someone close is always kind.',
        ),
      ],
      {
        choices: [
          {
            id: 'eat',
            label: 'Have another cherry.',
            then: [
              N(
                'You have another. It’s the best cherry you’ve ever eaten, and you can’t remember the second best.',
              ),
            ],
          },
          {
            id: 'ask',
            label: 'Ask her the way north.',
            then: [
              OW('North? Nobody goes north from here. Have a cherry.', 'happy'),
              N('You have a cherry. You forget the question halfway through it.'),
            ],
          },
          {
            id: 'nubbin',
            label: 'Give a cherry to your Nubbin.',
            then: [
              N(
                'Your Nubbin takes the cherry and doesn’t eat it. It tucks it in your pocket, for later, and keeps one eye on the comb.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-06-cherries-done',
      [
        N(
          'While you doze by the stove, the old woman goes out into the garden. She points her stick at every rose bush in turn.',
        ),
        N(
          'One by one they sink into the black earth, and the earth closes over them as if they had never been.',
        ),
      ],
      [
        note(
          1,
          'science',
          'plants need light',
          '2-LS2-1',
          [
            N(
              'A real rose bush buried in the dark couldn’t last long. Green leaves need sunlight to make the plant’s food.',
            ),
          ],
          'Learned that plants need sunlight on their leaves to make food.',
        ),
      ],
    ),
    sc(
      'a12-06-garden',
      [
        N(
          'The garden has every flower you can think of, from every season, all in bloom at once. It never seems to change.',
        ),
        N(
          'Gerda plays there all day, and sleeps in a bed with silk pillows stuffed with violets. She has stopped asking about Kay.',
        ),
        N('You can’t remember what day it is. You can’t remember if there have been days.'),
        N(
          'Your Nubbin keeps going back to one bare patch of earth by the wall, and digging, and looking at you.',
        ),
        N(
          'One afternoon the old woman sits in the sun with her painted hat beside her on the bench.',
        ),
        N(
          'Gerda looks at the hat. The best flower painted on it is a rose; the old woman forgot to wipe it off.',
        ),
        GE('Roses. Where are the roses? There aren’t any roses here.', 'shock'),
        N('She runs from bed to bed, searching and searching. There isn’t one, anywhere.'),
      ],
      [
        ask(
          0,
          'science',
          'flowers bloom in their own seasons',
          'K-ESS2-1',
          [
            N(
              'Snowdrops, daffodils and summer roses all in flower at once. Why is that a clue that this garden is magic?',
            ),
          ],
          [
            opt(
              'In real life they flower in different seasons',
              [
                N(
                  'Yes. Snowdrops come in late winter, daffodils in spring, roses in summer. Never all together.',
                ),
              ],
              true,
            ),
            opt('Flowers never grow in gardens', [
              N('They do! But each kind flowers in its own season, so all at once is the magic.'),
            ]),
          ],
          'Learned that different flowers bloom in different seasons.',
        ),
      ],
      {
        choices: [
          {
            id: 'patch',
            label: 'Show her where your Nubbin has been digging.',
            then: [
              N(
                'You take her to the bare patch. Your Nubbin sits beside it, very upright, as if it has waited all summer to be asked.',
              ),
            ],
          },
          {
            id: 'search',
            label: 'Search with her.',
            then: [
              N(
                'You search the whole garden with her, bed by bed. At the end, by the wall, your Nubbin is sitting on a bare patch.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-06-garden-done',
      [
        N(
          'Gerda sits down by the bare patch and cries. Her warm tears fall on the earth, right where a rose bush sank.',
        ),
        N('The bush comes up all at once, in full flower, as fresh as the day it went down.'),
      ],
      [
        ask(
          1,
          'literacy',
          'turning points in a story',
          'RL.K.3',
          [N('Until now Gerda had forgotten Kay. What brought her memory back?')],
          [
            opt(
              'Seeing the rose painted on the hat',
              [N('Yes. One small reminder of home, and everything came back.')],
              true,
            ),
            opt('Eating cherries', [
              N('The cherries made her forget! It was the painted rose that reminded her.'),
            ]),
          ],
          'Identified the event that changes the story’s direction.',
        ),
      ],
    ),
    sc(
      'a12-06-flowers',
      [
        GE('Oh, I’ve been so long! I was going to find Kay! Do you know where he is? Is he dead?'),
        RO(
          'He isn’t dead. We’ve been down in the earth all this time, and he wasn’t there.',
          'soft',
        ),
        GE('Thank you. Oh, thank you!', 'happy'),
        N(
          'Then Gerda goes to the other flowers, one after another, and asks each of them about Kay.',
        ),
        N(
          'Every flower is dreaming its own story in the sun. Not one of them knows a thing about Kay.',
        ),
        BW(
          'There’s a castle with a balcony, and a girl leaning on it, waiting for someone. That is my story.',
        ),
        GE('Is it Kay she’s waiting for?'),
        BW('It’s my story. It isn’t about anybody else.'),
      ],
      [
        ask(
          7,
          'sel',
          'listening to others',
          'CASEL: Relationship skills',
          [
            N(
              'Gerda asks for help, and each flower only talks about its own story. What would a good listener do?',
            ),
          ],
          [
            opt(
              'Listen to her question, then answer it',
              [
                N(
                  'Yes. Good listeners hear what the other person needs before they talk about themselves.',
                ),
              ],
              true,
            ),
            opt('Tell a longer story', [
              N('That’s what the flowers do, and it doesn’t help Gerda. Listening comes first.'),
            ]),
          ],
          'Talked about what makes someone a good listener.',
        ),
      ],
      {
        choices: [
          {
            id: 'snowdrop',
            label: 'Ask the snowdrop.',
            then: [
              SD(
                'Two girls on a swing between two trees, blowing soap bubbles. Every bubble is a whole world. Then it bursts.',
              ),
              GE('That’s a lovely story. It isn’t any help at all.'),
            ],
          },
          {
            id: 'buttercup',
            label: 'Ask the buttercup.',
            then: [
              BC(
                'An old granny in a sunny yard, and her granddaughter comes home to see her. That’s all. It’s enough.',
                'soft',
              ),
              GE('Poor Gran. She’s at home without either of us.', 'sad'),
            ],
          },
          {
            id: 'narcissus',
            label: 'Ask the narcissus.',
            then: [
              NA('I can see myself! I can see myself! Oh, how lovely I smell.', 'happy'),
              GE('That isn’t about Kay. That isn’t about anybody.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-06-flowers-done',
      [
        GE('It’s no good. They only know their own stories.'),
        GE('I have to go. I’ve stayed far too long already.'),
      ],
      [
        ask(
          1,
          'sel',
          'choosing what matters',
          'CASEL: Responsible decision-making',
          [
            N(
              'Gerda leaves a beautiful garden where she was happy. Was that hard, do you think, and why does she go?',
            ),
          ],
          [
            opt('Hard, but Kay matters more', [
              N('That’s a fair answer. Sometimes we leave a nice thing for a more important one.'),
            ]),
            opt('Easy, once she remembered', [
              N('Maybe. Remembering what matters can make a hard choice feel simple.'),
            ]),
          ],
          'Thought about leaving something pleasant for something important.',
        ),
      ],
    ),
    sc(
      'a12-06-complete',
      [
        N(
          'Gerda runs to the end of the garden. The gate is shut, the latch is rusty, and it won’t give.',
        ),
        N(
          'You put your shoulder to it with her, and your Nubbin pushes too, and the gate creaks open.',
        ),
        N(
          'Outside, it’s late autumn. The leaves are yellow and falling, and the mist is cold and wet.',
        ),
        GE('How long have I been? In there it was always summer.', 'sad'),
        N(
          'Nobody comes after you. You look back once, and the garden is still in summer, as if nothing ever happens there.',
        ),
        N(
          'Gerda’s feet are bare and sore. She keeps walking anyway, and you keep walking with her.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'why trees drop their leaves',
          '1-ESS1-2',
          [
            N(
              'In autumn the days get shorter and colder. Why do many trees let their leaves fall?',
            ),
          ],
          [
            opt(
              'To rest through winter, when there’s less light',
              [
                N(
                  'Yes. With little sunlight and frozen water, leaves can’t do their job, so the tree rests till spring.',
                ),
              ],
              true,
            ),
            opt('Because the wind pulls them all off', [
              N(
                'Wind helps them fall, but the tree lets go first, to rest through the dark winter.',
              ),
            ]),
          ],
          'Learned why many trees drop their leaves in autumn.',
        ),
      ],
    ),
  ],
  [
    gloss('drowsy', 'Sleepy, as if you might drift off at any moment.', 'a12-06-cherries'),
    gloss('bloom', 'When a plant has its flowers open.', 'a12-06-garden'),
  ],
);

// ================================================================== A12-7 The Raven
const Q07: EduQuest = quest(
  'a12-07',
  'The Raven',
  {
    'a12-07-s1': {
      goal: 'Meet the raven in the snow.',
      hint: 'Rest by the hedge where the big black bird is hopping.',
    },
    'a12-07-s2': {
      goal: 'Hear about the boy with the creaking boots.',
      hint: 'Sit by the hedge and let the raven tell it.',
    },
    'a12-07-s3': {
      goal: 'Wait by the palace garden after dark.',
      hint: 'Wait in the avenue until the palace lights go out.',
    },
  },
  [
    sc(
      'a12-07-hedge',
      [
        N(
          'Winter comes on fast. You stop to rest by a hedge, and a big black raven hops across the snow towards you.',
        ),
        RA(
          'Caw! Good day. Good day! And where are you two going, out in the wide world all on your own?',
        ),
        N(
          'Gerda tells him the whole story, and asks if he has seen Kay. The raven nods, very seriously.',
        ),
        RA('It might be. It might be!', 'think'),
        GE('Really? Is he alive?'),
        RA(
          'Gently, gently. I think it may be Kay. But I think he’s forgotten you, for the princess.',
        ),
        RA(
          'In this kingdom there lives a princess who is tremendously clever. She’s read every newspaper in the world.',
          'happy',
        ),
        RA('And forgotten them all again. That’s how clever she is.'),
      ],
      [
        note(
          1,
          'science',
          'ravens are clever birds',
          '4-LS1-2',
          [
            N(
              'Real ravens are among the cleverest birds. They solve puzzles, remember faces, and can copy sounds, even a few words.',
            ),
          ],
          'Learned some real facts about how clever ravens are.',
        ),
      ],
      {
        choices: [
          {
            id: 'polite',
            label: 'Ask him, politely, to go on.',
            then: [RA('Politely! There’s a rare thing. I shall go on at once.', 'happy')],
          },
          {
            id: 'how',
            label: 'Ask how a raven knows all this.',
            then: [
              RA(
                'I have a sweetheart at the palace. She’s tame. She tells me everything, and I tell everybody.',
              ),
            ],
          },
          {
            id: 'nubbin',
            label: 'Let your Nubbin say hello.',
            then: [
              N(
                'Your Nubbin bows to the raven. The raven bows back, lower, so as not to be outdone.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-07-hedge-done',
      [
        RA('She wanted to marry. But she wanted a husband who could answer when he was spoken to.'),
        RA('Not one who just stood about looking grand.'),
      ],
      [
        ask(
          1,
          'sel',
          'good conversation',
          'CASEL: Relationship skills',
          [
            N(
              'The princess wants someone who can really talk with her. What makes a good conversation?',
            ),
          ],
          [
            opt(
              'Taking turns to listen and to speak',
              [RA('Exactly. Back and forth, like two birds on a branch.', 'happy')],
              true,
            ),
            opt('One person talking the whole time', [
              RA('That’s a speech, not a conversation. You take turns.'),
            ]),
          ],
          'Talked about taking turns in a conversation.',
        ),
      ],
    ),
    sc(
      'a12-07-boots',
      [
        RA(
          'So they put it in the papers. Any good-looking young man could come and talk to her, and the best talker would marry her.',
        ),
        RA(
          'Such crowds! But they saw the guards in silver, and the footmen in gold on the stairs, and they went dumb.',
          'happy',
        ),
        RA(
          'On the third day along came a little fellow, no horse, no carriage, marching straight up to the palace.',
        ),
        RA('His eyes shone like yours. He had lovely long hair, and very shabby clothes.'),
        GE('That was Kay! Oh, I’ve found him!', 'happy'),
        RA('He had a little knapsack on his back.'),
        GE('No, that was his sledge. He had his sledge with him.'),
        RA(
          'Very likely. But his boots creaked terribly, all over the hall, and he wasn’t the least bit afraid.',
        ),
        RA(
          'He said he’d only come to hear how clever she was. And he liked her, and she liked him.',
        ),
      ],
      [
        note(
          7,
          'science',
          'vibrations make sound',
          '1-PS4-1',
          [
            N(
              'New leather boots creak because the stiff leather rubs and bends. That makes it vibrate, and vibrations are what we hear as sound.',
            ),
          ],
          'Learned that sounds are made by vibrations.',
        ),
        ask(
          8,
          'literacy',
          'weighing evidence',
          'RL.3.3',
          [
            N(
              'Gerda hears “knapsack” and turns it into “sledge”. Is the raven’s story enough to be sure it’s Kay?',
            ),
          ],
          [
            opt('Not yet; it could be any boy', [
              N('That’s careful thinking. Shining eyes and creaky boots fit lots of boys.'),
            ]),
            opt('Yes, it sounds just like him', [
              N(
                'Fair: it does sound like him. But notice how Gerda changes the bits that don’t fit.',
              ),
            ]),
            opt('She wants it to be Kay so much', [
              N('A sharp answer. When we want something badly, we hear what we hope for.'),
            ]),
          ],
          'Thought about how wanting something can change how we hear the evidence.',
        ),
      ],
      {
        choices: [
          {
            id: 'believe',
            label: 'It must be Kay.',
            then: [
              GE(
                'It must be. He was always clever. He could do sums in his head, even fractions.',
                'happy',
              ),
            ],
          },
          {
            id: 'doubt',
            label: 'Plenty of boys have long hair and creaky boots.',
            then: [
              GE('Not plenty. Not like Kay’s.'),
              RA('She has a point. I’ve never met another pair that creaked like that.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-07-boots-done',
      [
        GE('Please, can you get us in? I have to see him.'),
        RA('I’ll speak to my sweetheart. Wait here.'),
      ],
      [
        note(
          0,
          'sel',
          'asking for help',
          'CASEL: Relationship skills',
          [
            N(
              'Gerda can’t get in on her own, so she asks, clearly and politely. Asking for help is a strength, not a weakness.',
            ),
          ],
          'Talked about asking for help clearly and politely.',
        ),
      ],
    ),
    sc(
      'a12-07-avenue',
      [
        N(
          'At dusk the raven comes back with a little bread roll from the palace kitchen, and gives it to Gerda.',
        ),
        RA(
          'My sweetheart sends her regards. You can’t go in by the front, of course. Guards in silver. Footmen in gold.',
        ),
        RA(
          'But don’t cry. My sweetheart knows a little back staircase up to the bedroom, and she knows where the key is kept.',
        ),
        N(
          'You go into the palace garden, along the great avenue. The leaves are falling, one at a time.',
        ),
        N(
          'In the palace the lights go out one by one. The raven leads you to a back door, standing just ajar.',
        ),
        N('Gerda’s heart is beating so hard you can hear it. Your own isn’t much quieter.'),
      ],
      [
        note(
          5,
          'health',
          'what nerves do to your body',
          '',
          [
            N(
              'When you’re nervous or excited, your heart beats faster and you breathe quicker: your body is getting ready. Slow breaths help it settle.',
            ),
          ],
          'Learned why the heart beats faster when we are nervous, and that slow breathing helps.',
        ),
      ],
      {
        choices: [
          {
            id: 'first',
            label: 'Go in first.',
            then: [N('You go in first, just in case. The back stairs smell of soap and toast.')],
          },
          {
            id: 'hand',
            label: 'Take Gerda’s hand.',
            then: [N('You take her hand. It’s shaking, and then it isn’t.')],
          },
        ],
      },
    ),
    sc(
      'a12-07-avenue-done',
      [
        N(
          'At the top of the stairs a little lamp burns on a cupboard. Beside it stands the tame raven, turning her head this way and that.',
        ),
        PR('My intended has told me so much about you, little miss.', 'happy'),
      ],
      [
        ask(
          1,
          'literacy',
          'word meaning from context',
          'L.3.4',
          [N('The palace raven calls the forest raven “my intended”. What does she mean?')],
          [
            opt(
              'The one she’s going to marry',
              [PR('Precisely. We are engaged. It is all very proper.', 'happy')],
              true,
            ),
            opt('Someone she meant to bump into', [
              PR('Certainly not! My intended is the one I intend to marry.'),
            ]),
          ],
          'Worked out an old-fashioned word from its sentence.',
        ),
      ],
    ),
    sc(
      'a12-07-complete',
      [
        PR('Your story is very touching. Take the lamp, would you, and I’ll lead the way.'),
        N(
          'Things rush past you on the walls: shadows of horses with flying manes, of huntsmen, of ladies riding.',
        ),
        PR(
          'Only dreams. They come to fetch the gentlefolk’s thoughts out hunting. All the better: you can look at them asleep.',
        ),
        N('Your Nubbin ducks under a dream horse, just in case.'),
      ],
      [
        ask(
          1,
          'science',
          'moving light, moving shadows',
          '1-PS4-2',
          [
            N(
              'As you carry the lamp along, the shadows on the walls race past. Why do shadows move when the lamp moves?',
            ),
          ],
          [
            opt(
              'The light hits things from a new angle',
              [N('Yes. Move the light and every shadow swings round to the other side.')],
              true,
            ),
            opt('Shadows can walk by themselves', [
              N('Only dream ones! Real shadows move because the light moves.'),
            ]),
          ],
          'Learned that shadows move when the light source moves.',
        ),
      ],
    ),
  ],
  [
    gloss('shabby', 'Old and worn, with signs of a lot of use.', 'a12-07-boots'),
    gloss('ajar', 'Open just a little.', 'a12-07-avenue'),
  ],
);

// ================================================================== A12-8 Not Kay
const Q08: EduQuest = quest(
  'a12-08',
  'Not Kay',
  {
    'a12-08-s1': {
      goal: 'Climb the back stairs through the palace halls.',
      hint: 'Follow the tame raven, and keep the lamp low.',
    },
    'a12-08-s2': {
      goal: 'Wait while Gerda looks in the red bed.',
      hint: 'Keep the light steady while she bends back a red petal.',
    },
    'a12-08-s3': {
      goal: 'See what the prince and princess give Gerda.',
      hint: 'In the morning, help Gerda ask for what she needs.',
    },
  },
  [
    sc(
      'a12-08-halls',
      [
        N(
          'You go from hall to hall, each grander than the last. The walls are rose-coloured satin, with silk flowers sewn on.',
        ),
        N('The dreams keep rushing past, so fast that you can’t make out whose they are.'),
        PR('Wipe your feet. Not you, the little one. Well, all of you.'),
        N(
          'Then the bedroom. The ceiling is a great palm tree with leaves of glass, and from it hang two beds, each like a lily.',
        ),
        N('One bed is white, and the princess is asleep in it. The other bed is red.'),
        GE('Kay will be in the red one.', 'soft'),
      ],
      [
        ask(
          3,
          'science',
          'materials and their properties',
          '2-PS1-1',
          [N('Satin walls, glass leaves. Which word describes glass, but not satin?')],
          [
            opt(
              'Hard and see-through',
              [N('Yes. Glass is hard and lets light through. Satin is soft, smooth cloth.')],
              true,
            ),
            opt('Soft and bendy', [N('That’s satin! Glass is hard and see-through.')]),
          ],
          'Compared two materials by their properties.',
        ),
      ],
      {
        choices: [
          {
            id: 'lamp',
            label: 'Hold the lamp up for her.',
            then: [
              N('You hold the lamp up. It shakes a little in your hand, and you make it stop.'),
            ],
          },
          {
            id: 'door',
            label: 'Stay back by the door with the raven.',
            then: [
              N(
                'You stay by the door, because this bit is Gerda’s. The tame raven approves of your manners.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-08-halls-done',
      [N('Gerda tiptoes to the red bed.'), N('Her hands are shaking, and she is smiling.')],
      [
        note(
          1,
          'sel',
          'mixed feelings',
          'CASEL: Self-awareness',
          [
            N(
              'Shaking and smiling at once: you can feel scared and hopeful at the same time. Mixed feelings are normal.',
            ),
          ],
          'Learned that we can feel more than one feeling at the same time.',
        ),
      ],
    ),
    sc(
      'a12-08-redbed',
      [
        N(
          'Gerda bends back one of the red petals. Underneath is a brown neck, and dark hair on the pillow.',
        ),
        GE('Kay!', 'happy'),
        N(
          'She says his name aloud and holds the lamp close. The dreams come galloping back into the room.',
        ),
        N('He wakes up. He turns his head.'),
        N('It isn’t Kay. The prince has a neck like Kay’s, and that is all.'),
        N('He’s young and handsome and very surprised, and he isn’t Kay at all.'),
        N('The princess peeps out of her white lily and asks what in the world is going on.'),
        N(
          'Gerda cries, and tells them the whole story, and everything the ravens have done for her.',
          'sad',
        ),
      ],
      [
        ask(
          4,
          'literacy',
          'words for feelings',
          'RL.1.4',
          [N('Gerda was so sure, and it isn’t him. Which word fits her feeling best?')],
          [
            opt(
              'Disappointed',
              [
                N(
                  'Yes. Disappointed is when something you hoped for doesn’t happen. It can hurt a lot.',
                  'soft',
                ),
              ],
              true,
            ),
            opt('Bored', [N('Not bored! She hoped so hard. The word is disappointed.')]),
          ],
          'Named the feeling of disappointment.',
        ),
      ],
      {
        choices: [
          {
            id: 'fault',
            label: 'Say it’s all your fault, really.',
            then: [
              PS(
                'Is it? It doesn’t sound like it. It sounds like the ravens’ fault, and quite a nice fault.',
              ),
            ],
          },
          {
            id: 'ravens',
            label: 'Put in a word for the ravens.',
            then: [
              N(
                'You tell them the ravens only meant to help. The tame raven, in the doorway, fluffs up with pride.',
              ),
            ],
          },
          {
            id: 'quiet',
            label: 'Hold the lamp and let Gerda tell it.',
            then: [
              N(
                'You hold the lamp and say nothing. Gerda tells it well, all of it, right from the troll’s mirror.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-08-redbed-done',
      [
        PN('You poor child. You poor little thing.', 'soft'),
        PS('Nobody’s angry. Though the ravens mustn’t make a habit of it.'),
      ],
      [
        ask(
          1,
          'sel',
          'responding to honest mistakes',
          'CASEL: Social awareness',
          [
            N(
              'Strangers crept into their bedroom at night, and the prince and princess are kind about it. Why, do you think?',
            ),
          ],
          [
            opt('They can see it was an honest mistake', [
              N('That’s a fair answer. Mistakes made out of love are easy to forgive.'),
            ]),
            opt('They’re just kind people', [
              N('Maybe so. Kindness is often a choice people make again and again.'),
            ]),
            opt('They feel sorry for Gerda', [
              N('Yes, they can see how far she’s come. That’s empathy.'),
            ]),
          ],
          'Thought about why people forgive honest mistakes.',
        ),
      ],
    ),
    sc(
      'a12-08-gifts',
      [
        PS(
          'Ravens, would you like to fly away free? Or have a post at court, with all the kitchen scraps you can eat?',
        ),
        N('Both ravens bow, and ask for the post. They are thinking of their old age.'),
        RA('A bird must think ahead.', 'think'),
        N(
          'The prince lets Gerda sleep in his bed. She folds her hands and thinks how kind people and animals are.',
        ),
        N(
          'In the morning she is dressed in silk and velvet from head to foot, and asked to stay at the palace and be happy.',
        ),
        GE(
          'Thank you. But please, could I have a little carriage and a horse, and some boots? I have to find Kay.',
        ),
        PN('Boots. And a muff, for the cold. And not a little carriage. A proper one.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'choices have costs',
          'D2.Eco.1.K-2',
          [
            N(
              'Freedom, or a safe job with food for life: you can’t have both. Which would you pick, if you were a raven?',
            ),
          ],
          [
            opt('Freedom', [RA('A wild choice. Brave. Cold in winter, mind.')]),
            opt('The safe job', [RA('A sensible choice, and mine. Scraps are scraps.', 'happy')]),
          ],
          'Thought about choosing between two good things when you can’t have both.',
        ),
        note(
          6,
          'science',
          'why fur keeps you warm',
          '2-PS1-1',
          [
            N(
              'A fur muff traps lots of still air between its hairs. Still air holds heat in, so hands inside stay warm.',
            ),
          ],
          'Learned that fur keeps things warm by trapping air.',
        ),
      ],
      {
        choices: [
          {
            id: 'muff',
            label: 'Put your Nubbin in the muff.',
            then: [
              N(
                'Your Nubbin climbs into the muff and turns round twice. Gerda puts her hands in after it.',
              ),
              GE('Oh, it’s warm! It’s like holding a little stove.', 'happy'),
            ],
          },
          {
            id: 'boots',
            label: 'Check that the boots fit.',
            then: [
              N(
                'You kneel and press the toes: room to grow, room for socks. While you’re busy, your Nubbin climbs into the muff.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-08-gifts-done',
      [
        N(
          'The coach is pure gold. The prince’s and princess’s coat of arms shines on the door like a star.',
        ),
      ],
      [
        note(
          0,
          'social-studies',
          'coats of arms',
          'D2.His.2.K-2',
          [
            N(
              'Long ago, noble families had a coat of arms: a special picture on a shield, so everyone knew whose coach or castle it was.',
            ),
          ],
          'Learned what a coat of arms was for in the past.',
        ),
      ],
    ),
    sc(
      'a12-08-complete',
      [
        N(
          'The coach is lined with sugar plums, and there’s fruit and gingerbread on the seat. Footmen ride behind in golden crowns.',
        ),
        N(
          'The raven rides along for the first few miles, sitting beside Gerda, because he can’t ride backwards.',
        ),
        N(
          'Gerda counts twelve sugar plums, and shares them out fairly between herself, you and the raven.',
        ),
        N(
          'His sweetheart stays in the palace doorway, flapping. She has had a headache since her promotion, from eating too much.',
        ),
        GE('Goodbye! Goodbye!', 'happy'),
        N(
          'The raven flies up into a tree, and flaps his black wings for as long as he can see the coach shining.',
        ),
        N('Gerda keeps her hands in the muff the whole way, and your Nubbin keeps them warm.'),
      ],
      [
        ask(
          2,
          'maths',
          'sharing equally (division)',
          '3.OA.A.3',
          [N('Twelve sugar plums, shared fairly between three. How many does each get?')],
          [
            opt(
              '4 each',
              [GE('Four each. Three fours are twelve. Fair and square.', 'happy')],
              true,
            ),
            opt('3 each', [
              GE('Three each is only nine. There are three left over! Four each makes twelve.'),
            ]),
            opt('6 each', [GE('Six each would need eighteen. Twelve shared by three is four.')]),
          ],
          'Shared twelve things equally between three.',
        ),
      ],
    ),
  ],
  [
    gloss('satin', 'A smooth, shiny cloth.', 'a12-08-halls'),
    gloss(
      'coat of arms',
      'A special picture on a shield that stands for a family.',
      'a12-08-gifts-done',
    ),
  ],
);

// ================================================================== A12-9 The Robber Girl
const Q09: EduQuest = quest(
  'a12-09',
  'The Robber Girl',
  {
    'a12-09-s1': {
      goal: 'Ride the golden coach through the dark forest.',
      hint: 'Keep your head down when the coach stops.',
    },
    'a12-09-s2': {
      goal: 'Go into the robbers’ castle.',
      hint: 'Follow the robber girl in, past the dogs.',
    },
    'a12-09-s3': {
      goal: 'Answer the robber girl. She wants your Nubbin.',
      hint: 'Choose what to say. Either answer is honest.',
    },
  },
  [
    sc(
      'a12-09-forest',
      [
        N(
          'The road goes into a dark forest. The golden coach shines among the trees like a torch, and it shines too far.',
        ),
        N('Robbers come out of the dark, shouting “Gold! It’s gold!”, and grab the horses.'),
        N(
          'The coachman and the footmen jump down and run for the trees, crowns and all. Nobody stops them; nobody wants footmen.',
        ),
        N('An old robber woman peers in through the door. Then a girl shoves her out of the way.'),
        RG(
          'She’s mine. She can play with me. She can give me her muff and her pretty dress, and sleep in my bed.',
        ),
        N(
          'The robber girl is Gerda’s size, broader in the shoulders, with black eyes that look almost sad.',
        ),
        RG('Nobody touches her while I like her. Are you a princess?'),
        GE('No.'),
        N(
          'Gerda tells her everything, there in the dark coach. The robber girl pushes her hands into the muff to warm them.',
        ),
        RG('What’s this? It’s alive. It’s warm. Oh.', 'shock'),
      ],
      [
        note(
          0,
          'science',
          'shiny things reflect light',
          '1-PS4-2',
          [
            N(
              'Gold is shiny because it reflects light so well. Even a little lantern light bounces off it, and can be seen a long way off.',
            ),
          ],
          'Learned that shiny materials reflect light and can be seen from far away.',
        ),
        ask(
          5,
          'literacy',
          'inferring feelings',
          'RL.3.3',
          [N('Her eyes “look almost sad”. What might that tell you about the robber girl?')],
          [
            opt('She might be lonely', [
              N(
                'That’s a thoughtful guess. She grabs Gerda as a playmate, as if she hasn’t got one.',
              ),
            ]),
            opt('She’s just tired', [
              N('Could be. Keep watching her and see if you change your mind.'),
            ]),
            opt('Nothing at all', [
              N('Maybe. But writers often hide clues in eyes, so keep an eye on hers.'),
            ]),
          ],
          'Made an inference about a character from a small detail.',
        ),
      ],
      {
        choices: [
          {
            id: 'tell',
            label: 'Tell her it’s your Nubbin.',
            then: [RG('A Nubbin. Never heard of one. I like it.')],
          },
          {
            id: 'gerda',
            label: 'Let Gerda explain.',
            then: [
              GE('It’s the lodger’s. It’s kept my hands warm all the way from the palace.'),
              RG('Has it, now.', 'think'),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-09-forest-done',
      [N('The robber girl keeps one hand in the muff the whole way, and won’t take it out.')],
      [
        note(
          0,
          'science',
          'warm-blooded animals',
          '4-LS1-1',
          [
            N(
              'Mammals and birds make their own body heat, so they stay warm even in a cold forest. That’s why a small animal feels warm in your hands.',
            ),
          ],
          'Learned that mammals and birds make their own body heat.',
        ),
      ],
    ),
    sc(
      'a12-09-castle',
      [
        N(
          'The coach stops in the yard of a robbers’ castle, cracked from top to bottom. Ravens and crows fly out of every hole.',
        ),
        N('Huge dogs leap up at you. They don’t bark; they aren’t allowed.'),
        N(
          'In the great hall a fire burns on the stone floor. Soup bubbles in a big pot, and the smoke goes where it likes.',
        ),
        RG('You’ll sleep with me and all my animals tonight.'),
        N(
          'In her corner there’s straw and old rugs. Above it, on rails and perches, sit about a hundred pigeons, asleep.',
        ),
        RG(
          'All mine. Those two are wood pigeons; they’d fly off if they weren’t tied. And here’s my dear old Bae.',
        ),
        N(
          'She tugs a reindeer forward by his antler. He has a bright copper ring round his neck, tied to the wall.',
        ),
        RG('He’d run off too, if he could. Everybody would. That’s why you tie things.'),
        N(
          'She pulls a long knife out of a crack in the wall and waves it about, mostly at the ceiling.',
        ),
        GE('Do you sleep with the knife?'),
        RG('Always. You never know what might happen.'),
      ],
      [
        note(
          6,
          'science',
          'reindeer antlers',
          '4-LS1-1',
          [
            N(
              'Reindeer are the only deer where females grow antlers as well as males. Antlers fall off and grow back every year.',
            ),
          ],
          'Learned that both male and female reindeer grow antlers, which regrow every year.',
        ),
        ask(
          7,
          'sel',
          'fairness to animals',
          'CASEL: Social awareness',
          [N('“That’s why you tie things,” she says. Is that fair to Bae, do you think?')],
          [
            opt('No. Animals need freedom too', [
              N('That’s a kind answer. Bae’s rubbed neck shows how long he’s been tied.'),
            ]),
            opt('She’s scared of being left alone', [
              N('A sharp answer. Maybe she ties things because nobody has ever stayed.'),
            ]),
            opt('It’s her reindeer, so it’s fine', [
              N('Hmm. Owning an animal means looking after what it needs, too.'),
            ]),
          ],
          'Thought about fairness to animals and why someone might hold on too tight.',
        ),
      ],
      {
        choices: [
          {
            id: 'away',
            label: 'Ask her to put the knife away.',
            then: [
              RG('No.'),
              N(
                'But she sticks it back in the wall, within reach, which for her is a kind of yes.',
              ),
            ],
          },
          {
            id: 'bae',
            label: 'Stroke Bae’s nose.',
            then: [N('Bae lowers his head and lets you. His nose is soft and his eyes are tired.')],
          },
        ],
      },
    ),
    sc(
      'a12-09-castle-done',
      [
        RG(
          'Now tell me about Kay again. The lodger can listen. And the warm thing stays where I can see it.',
        ),
      ],
      [
        note(
          0,
          'health',
          'knives are for grown-ups',
          'CASEL: Responsible decision-making',
          [
            N(
              'In real life, knives are tools for grown-ups, never toys. If you find one, leave it and tell an adult.',
            ),
          ],
          'Talked about leaving knives alone and telling an adult.',
        ),
      ],
    ),
    sc(
      'a12-09-keep',
      [
        N('She holds out both hands, the way she held them out to the muff.'),
        RG(
          'I want that one. It’s warm. I’ll keep it with the pigeons and the reindeer. It’s mine now.',
        ),
        GE('It isn’t yours. It isn’t mine either.', 'think'),
        RG('I didn’t ask you.'),
        N(
          'Your Nubbin looks at you, not frightened. It looks as if it’s waiting to see what sort of person you are.',
        ),
        N(
          'The robber girl’s hands are still out. They’re chapped, and there’s a scar across one knuckle.',
        ),
      ],
      [
        ask(
          5,
          'sel',
          'boundaries and trust',
          'CASEL: Relationship skills',
          [
            N(
              'Saying “no” kindly sets a boundary; saying “one night” gives trust, and neither is wrong. What matters most when you answer?',
            ),
          ],
          [
            opt('Being honest about what I want', [
              N('That’s a strong answer. An honest no and an honest yes are both kind.'),
            ]),
            opt('Thinking about my Nubbin', [
              N('A caring answer. Your Nubbin isn’t a thing; it’s a friend, and it trusts you.'),
            ]),
            opt('Thinking about the robber girl', [
              N('A generous answer: she’s lonely. But your answer still has to be true for you.'),
            ]),
          ],
          'Thought about saying no, and about trust, before making a choice.',
        ),
      ],
      {
        choices: [
          {
            id: 'no',
            label: '“No.” Plainly, and kindly.',
            set: { 'a12-nubbin': 'no' },
            then: [
              Y('No.'),
              RG('No?', 'angry'),
              Y('No. It isn’t a thing you keep. It stays with me.'),
              N('She stares at you a long time. Then she shrugs, as if she meant to lose.'),
              RG('Fine. Keep your warm thing.', 'angry'),
            ],
          },
          {
            id: 'night',
            label: '“You can hold it for one night.”',
            set: { 'a12-nubbin': 'night' },
            then: [
              Y('You can hold it tonight. In the morning it comes back to me.'),
              RG('One night?', 'think'),
              N(
                'She takes your Nubbin in both hands, very carefully, as if it might break or might bite.',
              ),
              RG('One night. Fine.'),
              N(
                'Your Nubbin settles against her shoulder and goes straight to sleep. She looks at it as if nobody has ever done that before.',
                'soft',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-09-keep-done',
      [
        N('The robber girl falls asleep with one arm round Gerda’s neck, and snores.'),
        N('Gerda lies awake and stares at the pigeons. You lie awake and stare at Gerda.'),
      ],
      [
        doit(
          1,
          'sel',
          'calming down with slow breaths',
          'CASEL: Self-management',
          'edu:breathe:slow:4',
          [
            N(
              'When worry keeps you awake, try this with Gerda: breathe in slowly for four, and out slowly for four. Do it four times.',
            ),
          ],
          'Practised slow breathing to calm worry.',
        ),
      ],
    ),
    sc(
      'a12-09-complete',
      [
        N(
          'By the fire the robbers sing and drink. The old robber woman turns a somersault, badly.',
        ),
        N('Bae stands in the dark with his copper ring on, looking at the door.'),
        N(
          'The pigeons shuffle on their ten rails and murmur, about ten to a rail. One of them opens an eye.',
        ),
        N(
          'Nobody in the corner is asleep except the robber girl, and she sleeps like somebody who has won.',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'multiplication as equal groups',
          '3.OA.A.1',
          [N('Ten rails, about ten pigeons on each. About how many pigeons is that?')],
          [
            opt(
              'About 100',
              [
                N(
                  'Yes. Ten groups of ten is a hundred, the same hundred you saw asleep on the perches.',
                  'happy',
                ),
              ],
              true,
            ),
            opt('About 20', [
              N('Twenty is ten plus ten. Ten groups of ten is ten times ten: a hundred.'),
            ]),
            opt('About 1,000', [N('Too many! Ten times ten is a hundred.')]),
          ],
          'Used equal groups to estimate a total.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'antler',
      'A branching bone that grows on a deer’s head and falls off each year.',
      'a12-09-castle',
    ),
    gloss('boundary', 'A line you draw about what is and isn’t all right for you.', 'a12-09-keep'),
  ],
);

// ---------------------------------------------------------------- shared pieces (as in the source)
/** A12-10, step 3: the robber girl unties Bae (both a12-nubbin paths). */
const FREE: Line[] = [
  RG(
    'Bae, I’m untying you. Run home to Lapland and carry this girl to the Snow Queen’s, where her friend is.',
  ),
  RG('You heard her story. You were listening; she talks loud enough.'),
  N(
    'Bae leaps for joy. The robber girl lifts Gerda onto his back, ties her on, and gives her a little cushion to sit on.',
  ),
  RG('Here are your fur boots. It’ll be cold. I’m keeping the muff; it’s too pretty.'),
  RG(
    'But you’re not freezing on my account. Have Mother’s big mittens. They come right up to your elbows.',
  ),
  RG('Two loaves and a ham. And don’t cry. I hate it when people cry. Look happy.'),
  BA('Climb on behind her, lodger. You weigh less than a sack of salt, and I’ve carried worse.'),
  N(
    'The robber girl coaxes the big dogs inside. Then she cuts Bae’s rope with her knife, and opens the door.',
  ),
  RG('Run! And look after her!'),
];
const FREE_CHOICES: Choice[] = [
  {
    id: 'wave',
    label: 'Wave goodbye to the robber girl.',
    then: [
      N(
        'You wave. She doesn’t wave back, but she watches until you’re out of sight, which is nearly the same.',
      ),
    ],
  },
  {
    id: 'nod',
    label: 'Nod to her, as one equal to another.',
    then: [N('You nod. She nods back, once, hard, like somebody shutting a box.')],
  },
];
/** A12-13, step 2: how you wait (base and both ember variants). */
const WAIT_CHOICES: Choice[] = [
  {
    id: 'count',
    label: 'Count the berries again.',
    then: [N('Thirty again, or twenty-nine. Your Nubbin points at one you’ve missed.')],
  },
  {
    id: 'hum',
    label: 'Hum Gerda’s rose tune, under your breath.',
    then: [
      N(
        'You hum it, not loud. Your Nubbin hums it back a beat behind, the way it did under the rose arch.',
      ),
    ],
  },
  {
    id: 'sit',
    label: 'Just sit.',
    then: [N('You just sit, and it turns out you’re good at it. You didn’t use to be.')],
  },
];
/** A12-17, step 3: the robber girl's news (both a12-nubbin paths). */
const NEWS: Line[] = [
  RG('So this is him. Hm. I wonder if he was worth running to the end of the world for.', 'think'),
  KA('I wonder that too.', 'sad'),
  GE('How are the prince and princess? And the ravens?'),
  RG('The prince and princess have gone abroad. The raven died. He was old.'),
  N(
    'He died: his body stopped working, and it won’t start again. He had a long life, and a good one.',
    'soft',
  ),
  RG(
    'His sweetheart wears a black thread round her leg now, to remember him, and tells everybody about him.',
  ),
];
const NEWS_CHOICES: Choice[] = [
  {
    id: 'sorry',
    label: 'Say you’re sorry about the raven.',
    then: [
      RG('Don’t be. He had a good post and all the scraps he wanted. Not many get that.', 'soft'),
    ],
  },
  {
    id: 'cap',
    label: 'Admire her red cap.',
    then: [RG('It’s a good cap. You can’t have it.', 'happy')],
  },
];
/** A12-18: the close of the complete scene (both a12-nubbin paths). */
const END: Line[] = [
  N('The page settles under your hand, like a paper cut-out laid flat on a table.'),
  N(
    'You’re back in the Grove, with Nova’s atlas on your knee. When you open it again, a rose petal slides out of the fold and lands on your boot.',
  ),
  N(
    'On the cottage windowsill stands a window box with a rose tree in it that wasn’t there this morning.',
  ),
  N(
    'Another stands on the lantern shed across the way, and between them somebody has laid a plank.',
  ),
];

// ================================================================== A12-10 The Reindeer
const Q10: EduQuest = quest(
  'a12-10',
  'The Reindeer',
  {
    'a12-10-s1': {
      goal: 'Listen to the wood pigeons in the night.',
      hint: 'Lie still in the straw and listen.',
    },
    'a12-10-s2': {
      goal: 'In the morning, ask Bae the way north.',
      hint: 'Talk to Bae while the robber girl listens.',
    },
    'a12-10-s3': {
      goal: 'Go with Gerda and Bae.',
      hint: 'Help tie Gerda onto Bae’s back, then climb on behind her.',
    },
  },
  [
    sc(
      'a12-10-pigeons',
      [
        PI('Coo, coo. We have seen little Kay.'),
        GE('What? What did you say?', 'shock'),
        PI('A white hen was carrying his sledge. He was sitting in the Snow Queen’s carriage.'),
        PI(
          'It went low over the forest while we were in our nest. She breathed on us as she passed, and we were cold for a long time after.',
        ),
        GE('Where was she going? Do you know?'),
        PI(
          'North, we think. To Lapland, where there’s always snow and ice. Ask the reindeer; he’s tied up just there.',
        ),
        BA(
          'Snow and ice! It’s glorious there. You can leap about free in great glittering valleys.',
          'happy',
        ),
        BA(
          'The Snow Queen has her summer tent there. But her strong castle is far to the north, on the island they call Spitsbergen.',
        ),
        GE('Oh, Kay. Little Kay.', 'sad'),
      ],
      [
        ask(
          5,
          'science',
          'compass directions on a map',
          '2-ESS2-2',
          [N('The carriage went north. On most maps, which way is north?')],
          [
            opt(
              'Towards the top',
              [
                N(
                  'Yes. North is at the top of most maps, south at the bottom, east on the right, west on the left.',
                ),
              ],
              true,
            ),
            opt('Towards the bottom', [N('That’s south. North is at the top of most maps.')]),
          ],
          'Found north on a map.',
        ),
        note(
          7,
          'social-studies',
          'the far north today',
          'D2.Geo.2.K-2',
          [
            N(
              'Lapland is the far north of Norway, Sweden and Finland, much of it inside the Arctic. Spitsbergen is a real island, part of Svalbard, which belongs to Norway.',
            ),
          ],
          'Learned where Lapland and Svalbard are.',
        ),
      ],
      {
        choices: [
          {
            id: 'way',
            label: 'Whisper to Bae: does he know the way?',
            then: [
              BA(
                'Know it? I could find it with my eyes shut. I’d go tonight, if not for this ring.',
                'sad',
              ),
            ],
          },
          {
            id: 'hand',
            label: 'Hold Gerda’s hand in the dark.',
            then: [
              N(
                'You find her hand in the straw. She holds on so tight it hurts, and you don’t mind.',
              ),
            ],
          },
          {
            id: 'hush',
            label: 'Hush them before the robber girl wakes.',
            then: [
              N(
                'The robber girl stirs and mutters in her sleep. Everybody goes very quiet until she snores again.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-10-pigeons-done',
      [
        N(
          'Nobody sleeps much after that, except the robber girl and, on the far perch, one very old pigeon.',
        ),
      ],
      [
        note(
          0,
          'science',
          'how birds sleep',
          '4-LS1-1',
          [
            N(
              'Many birds sleep perched, gripping the branch with their toes and fluffing up their feathers to keep warm.',
            ),
          ],
          'Learned how many birds sleep on a perch.',
        ),
      ],
    ),
    sc(
      'a12-10-morning',
      [
        N(
          'In the morning Gerda tells the robber girl everything the pigeons said. The robber girl looks serious, and nods.',
        ),
        RG('Lapland. Bae, do you know where Lapland is?'),
        BA(
          'Do I know? Ask a fish if it knows the river. I was born there. I ran on those snowfields as a calf.',
          'happy',
        ),
        N('His eyes shine as he says it. He has been standing in this corner a long time.'),
        RG(
          'Listen. The men are all out. Only Mother’s here, and at noon she has a drink from the big bottle and a nap.',
        ),
        RG('Then I’ll do something for you.'),
      ],
      [
        ask(
          3,
          'literacy',
          'words for feelings',
          'RL.1.4',
          [
            N(
              'Bae’s eyes shine when he talks about where he was born. Which word fits how he feels?',
            ),
          ],
          [
            opt(
              'Homesick',
              [N('Yes. Homesick is missing your home so much it aches.', 'soft')],
              true,
            ),
            opt('Grumpy', [
              N('His eyes are shining, not scowling. He misses home: he’s homesick.'),
            ]),
          ],
          'Named the feeling of homesickness.',
        ),
      ],
      {
        choices: [
          {
            id: 'thank',
            label: 'Thank her.',
            then: [RG('Don’t thank me yet. I haven’t done it. I might change my mind.', 'angry')],
          },
          {
            id: 'why',
            label: 'Ask her why.',
            then: [RG('Because I want to. That’s why I do everything.')],
          },
        ],
      },
    ),
    sc(
      'a12-10-morning-done',
      [
        N('You have been waiting since nine o’clock in the morning.'),
        N(
          'At noon the old robber woman takes a long drink from the big bottle, sits down, and her chin goes onto her chest.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'time in hours',
          '1.MD.B.3',
          [
            N(
              'Noon is twelve o’clock, and you started waiting at nine. How many hours did you wait?',
            ),
          ],
          [
            opt('3 hours', [N('Yes. Ten, eleven, twelve: three hours.', 'happy')], true),
            opt('21 hours', [
              N(
                'That’s nine plus twelve. Count on from nine instead: ten, eleven, twelve, so three hours.',
              ),
            ]),
            opt('12 hours', [
              N('Twelve is the time it is now. From nine to twelve is three hours.'),
            ]),
          ],
          'Worked out how many hours passed from nine o’clock to noon.',
        ),
      ],
    ),
    sc(
      'a12-10-free',
      [
        N(
          'The robber girl goes to Bae. She doesn’t look at you, and she doesn’t look at your Nubbin.',
        ),
        RG('Don’t think this is because of you. I was going to anyway.', 'angry'),
        ...FREE,
      ],
      [
        ask(
          1,
          'sel',
          'actions and words',
          'CASEL: Social awareness',
          [
            N(
              'She sounds cross, but she sets Bae free and gives Gerda boots and mittens. Is the robber girl kind?',
            ),
          ],
          [
            opt('Yes, her actions are kind', [
              N('That’s a fair answer. What people do can say more than how they talk.'),
            ]),
            opt('No, she’s rude', [
              N('She is rude! Can someone be rude and kind at the same time, do you think?'),
            ]),
            opt('She’s both', [
              N('A thoughtful answer. People are often more than one thing at once.'),
            ]),
          ],
          'Thought about how a character’s actions and words can tell different stories.',
        ),
      ],
      { choices: FREE_CHOICES },
    ),
    sc(
      'a12-10-free-done',
      [
        N(
          'Bae flies off over stumps and bushes, through the great forest, over marshes and plains, as fast as he can go.',
        ),
        N('Above you the sky flares up, green and white, in great sheets of light.'),
        BA('Those are my old lights! Look at them flash!', 'happy'),
      ],
      [
        note(
          2,
          'science',
          'the northern lights',
          '',
          [
            N(
              'These are the northern lights, also called the aurora borealis. Tiny particles from the Sun hit the air far above the Earth and make it glow.',
            ),
            N(
              'Green is the most common colour. They’re seen best on dark winter nights in the far north.',
            ),
          ],
          'Learned what causes the northern lights.',
        ),
      ],
    ),
    sc(
      'a12-10-complete',
      [
        N(
          'You ride north day and night. Gerda cuts each loaf into four equal pieces, but the bread runs out, and then the ham.',
        ),
        N(
          'Gerda’s hands are in the robber woman’s great mittens. Your Nubbin rides inside her coat, against her heart.',
        ),
        GE('Is it much further?'),
        BA('Yes. But we’re nearer than we were.'),
      ],
      [
        ask(
          0,
          'maths',
          'unit fractions',
          '3.NF.A.1',
          [N('A loaf cut into four equal pieces. What fraction of the loaf is one piece?')],
          [
            opt(
              'One quarter (1/4)',
              [N('Yes. Four equal parts make a whole, so each one is a quarter.', 'happy')],
              true,
            ),
            opt('One half (1/2)', [
              N('A half would be two equal pieces. Four equal pieces are quarters: 1/4 each.'),
            ]),
          ],
          'Named a unit fraction: one quarter.',
        ),
      ],
    ),
  ],
  [
    gloss('Arctic', 'The very cold region around the North Pole.', 'a12-10-pigeons'),
    gloss('homesick', 'Sad because you are missing your home.', 'a12-10-morning'),
  ],
);

// ================================================================== A12-11 The Sámi Woman
const Q11: EduQuest = quest(
  'a12-11',
  'The Sámi Woman',
  {
    'a12-11-s1': {
      goal: 'Find the little house in the snow.',
      hint: 'Follow Bae towards the smoke and the lamplight.',
    },
    'a12-11-s2': {
      goal: 'Get warm while Bae tells his story.',
      hint: 'Sit by the lamp and eat what you’re given.',
    },
    'a12-11-s3': {
      goal: 'Carry the message on the dried fish.',
      hint: 'Take the fish from the Sámi woman and keep it safe.',
    },
  },
  [
    sc(
      'a12-11-hut',
      [
        N(
          'Bae stops at a little house. Its roof comes right down to the snow, and smoke rises from the middle of it.',
        ),
        N(
          'The door is so low you have to go in on hands and knees. Your Nubbin goes in on its belly.',
        ),
        N('Inside, by the light of her lamp, a woman is frying fish. Nobody else is at home.'),
        N(
          'A reindeer, a frozen girl and a lodger all crawl through her door at once. She doesn’t turn a hair.',
        ),
        SA('Well. Come in, then. Shut the cold out behind you. Mind the pan.'),
        N(
          'Gerda is so cold she can’t speak. The woman sits her by the lamp straight away and rubs her hands.',
        ),
      ],
      [
        ask(
          2,
          'social-studies',
          'the Sámi homeland, Sápmi',
          'D2.Geo.2.K-2',
          [
            N(
              'This woman is Sámi. The Sámi are the Indigenous people of the far north, and have lived here for thousands of years.',
            ),
            N(
              'Their homeland, Sápmi, stretches across Norway, Sweden, Finland and part of Russia. How many countries is that?',
            ),
          ],
          [
            opt(
              'Four',
              [N('Yes, four. Sápmi is one homeland, though the map draws borders across it.')],
              true,
            ),
            opt('One', [
              N(
                'It’s one homeland, but it reaches across four countries: Norway, Sweden, Finland and Russia.',
              ),
            ]),
            opt('Two', [N('Count again: Norway, Sweden, Finland, Russia. Four countries.')]),
          ],
          'Learned that the Sámi homeland, Sápmi, spans four countries.',
        ),
      ],
      {
        choices: [
          {
            id: 'feet',
            label: 'Help rub Gerda’s feet.',
            then: [
              N(
                'You rub Gerda’s feet while the woman does her hands. Neither of you says much; there isn’t time for much.',
              ),
            ],
          },
          {
            id: 'pan',
            label: 'Mind the pan.',
            then: [
              N(
                'You mind the pan. The fish is nearly done, and you turn it, and the woman nods: right side, right moment.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-11-hut-done',
      [
        SA(
          'There. Fingers are coming back. Toes next. You’ve come a long way in those boots.',
          'soft',
        ),
      ],
      [
        note(
          0,
          'health',
          'warming up cold hands safely',
          '',
          [
            N(
              'Very cold fingers and toes should be warmed gently and slowly, with warm hands or warm, not hot, water.',
            ),
          ],
          'Learned how to warm up very cold hands and feet safely.',
        ),
      ],
    ),
    sc(
      'a12-11-lamp',
      [
        N(
          'Bae tells his own story first, because it seems to him much the more important. Then he tells Gerda’s.',
        ),
        SA('You’ve been tied up a long while, by the look of your neck. Hold still.'),
        N(
          'She looks over Bae’s legs and the rubbed place under his chin, quickly and gently, like somebody who has done it all her life.',
        ),
        SA(
          'My son has our herd out on the winter grazing. I know a tired reindeer when one comes to my door.',
        ),
        N(
          'She feeds you fish and broth, and fetches Bae a heap of lichen from her store. Nobody leaves her house hungry.',
        ),
        SA('You’ve a long way still to go. Hundreds of miles, to where the Snow Queen is.'),
        GE('Do you know where she is? Have you seen her?'),
        SA(
          'I know her weather. Everybody up here does. She lets off her lights every evening, further north.',
        ),
      ],
      [
        note(
          3,
          'social-studies',
          'reindeer herding as a living job',
          'D2.His.2.K-2',
          [
            N(
              'Reindeer herding is a real Sámi job, in the past and today. Herding families move with their reindeer between summer and winter grazing lands.',
            ),
            N(
              'Today many herders use snowmobiles as well as skis. Most Sámi people do all sorts of other jobs too.',
            ),
          ],
          'Learned that reindeer herding is a living Sámi job today.',
        ),
        ask(
          4,
          'science',
          'what reindeer eat in winter',
          'K-ESS3-1',
          [N('In winter the ground is deep in snow. How do reindeer find their lichen?')],
          [
            opt(
              'They dig through the snow with their hooves',
              [
                SA(
                  'That’s right. They can smell it under the snow, and dig down with their front hooves.',
                  'happy',
                ),
              ],
              true,
            ),
            opt('They eat snow instead', [
              SA(
                'Snow isn’t food! They smell the lichen underneath and dig down to it with their hooves.',
              ),
            ]),
          ],
          'Learned how reindeer find food under the snow.',
        ),
      ],
      {
        choices: [
          {
            id: 'herd',
            label: 'Ask about her herd.',
            then: [
              SA(
                'Big enough. Too big to count in a hurry. My son knows each one by its face, and pretends he doesn’t.',
                'happy',
              ),
            ],
          },
          {
            id: 'thank',
            label: 'Thank her for the food.',
            then: [SA('It’s only fish. You’d do the same, if I came to your door.')],
          },
          {
            id: 'lichen',
            label: 'Help feed Bae his lichen.',
            then: [
              N(
                'Bae eats from your hands, delicately, then all at once. The woman watches, and shows you how to hold it better.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-11-lamp-done',
      [
        SA(
          'I’ll tell you who’ll know more: my friend, further north. She knows that country better than I do.',
        ),
      ],
      [
        note(
          0,
          'social-studies',
          'the Sámi languages',
          'D2.His.2.K-2',
          [
            N(
              'There are several Sámi languages, not just one. North Sámi is the one spoken most widely, and children can learn it at school today.',
            ),
          ],
          'Learned that there are several Sámi languages spoken today.',
        ),
      ],
    ),
    sc(
      'a12-11-fish',
      [
        SA('I’ve no paper. I’ll write it on a fish. She’ll read it.'),
        N(
          'She takes a dried cod off the rack and writes a few lines on it, with care. Then she hands it to you.',
        ),
        SA(
          'Look after that. Don’t let the reindeer eat it, and don’t eat it yourself, however long the road.',
        ),
        N(
          'She ties Gerda back onto Bae with her own knots, which are better. Then she gives you a reindeer skin, rolled up.',
        ),
        SA('To sit on, wherever you end up sitting. Snow is colder from underneath.', 'think'),
        N('She doesn’t say how she knows you’ll end up sitting. She knows the country.'),
      ],
      [
        note(
          1,
          'science',
          'why dried food keeps',
          '',
          [
            N(
              'Drying takes the water out of fish. The tiny living things that make food go bad need water, so dried fish keeps for months.',
            ),
          ],
          'Learned why drying food stops it going bad.',
        ),
      ],
      {
        choices: [
          {
            id: 'coat',
            label: 'Put the fish inside your coat.',
            then: [
              N(
                'You tuck it into your coat. It smells strongly of fish, and so will you, for the rest of the journey.',
              ),
            ],
          },
          {
            id: 'why',
            label: 'Ask why she thinks you’ll be sitting.',
            then: [
              SA(
                'Everybody who goes north ends up waiting for somebody. That’s what the north is mostly for.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-11-fish-done',
      [SA('Go well. And come back this way, after. I’ll want to know how it ends.')],
      [
        ask(
          0,
          'literacy',
          'predicting',
          'RL.K.3',
          [N('She wants to know how it ends. How do you think Gerda’s journey will end?')],
          [
            opt('She finds Kay and brings him home', [
              N('A hopeful guess. Keep reading and see if you’re right.'),
            ]),
            opt('Something surprising will happen', [
              N('Stories do love a surprise. Watch for clues.'),
            ]),
            opt('I can’t tell yet', [
              N('That’s honest. Good readers wait for more clues before they decide.'),
            ]),
          ],
          'Made a prediction about how the story will end.',
        ),
      ],
    ),
    sc(
      'a12-11-complete',
      [
        N(
          'Bae runs on into the night. Overhead the lights burn blue all night long, the most beautiful you have ever seen.',
        ),
        GE('She didn’t ask for anything. Not even our names.', 'soft'),
        N('The fish letter is warm inside your coat. Your Nubbin keeps sniffing at it, hopefully.'),
        BA('Not far now. Further than you’d like, but not far.'),
      ],
      [
        ask(
          1,
          'sel',
          'hospitality and kindness to strangers',
          'CASEL: Social awareness',
          [
            N(
              'She fed and warmed three strangers and asked for nothing back. Why do you think she did it?',
            ),
          ],
          [
            opt('In the cold north, people help each other', [
              N(
                'That’s a wise answer. Where the cold is dangerous, kindness to travellers matters.',
              ),
            ]),
            opt('She could see they needed help', [
              N('Yes. Noticing what someone needs, and giving it, is real kindness.'),
            ]),
            opt('She’d want the same if it were her', [
              N('She said so herself: you’d do the same, if I came to your door.'),
            ]),
          ],
          'Thought about why people welcome and help strangers.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'Indigenous',
      'Describes the first people to live in a place, whose families have lived there for a very long time.',
      'a12-11-hut',
    ),
    gloss(
      'lichen',
      'A crusty, plant-like growth on rocks and ground that reindeer eat.',
      'a12-11-lamp',
    ),
  ],
);

// ================================================================== A12-12 The Finnish Woman
const Q12: EduQuest = quest(
  'a12-12',
  'The Finnish Woman',
  {
    'a12-12-s1': {
      goal: 'Deliver the fish letter.',
      hint: 'There’s no door. Knock on the chimney.',
    },
    'a12-12-s2': {
      goal: 'Listen while Bae asks the Finnish woman for help.',
      hint: 'Sit in the heat and listen.',
    },
    'a12-12-s3': {
      goal: 'Ask the Finnish woman if you should go with Gerda.',
      hint: 'Ask her in the corner, before Bae sets off.',
    },
  },
  [
    sc(
      'a12-12-chimney',
      [
        N(
          'The Finnish woman’s house has no door at all. Bae knocks on the chimney with his antlers, and a voice inside says come down.',
        ),
        N(
          'Inside, it’s so hot that the air shimmers. The Finnish woman is small, with her sleeves rolled up and very wise eyes.',
        ),
        FI(
          'Off. Boots off, mittens off, coat open, or you’ll cook. And you, put this on your head.',
        ),
        N('She puts a block of ice on Bae’s head. He looks very relieved.'),
        N(
          'You give her the fish. She reads it once, twice, three times, until she has it by heart.',
        ),
        N(
          'Then she puts it in the soup pot, because it’s good to eat and she never wastes anything.',
        ),
      ],
      [
        ask(
          3,
          'science',
          'melting and freezing can be reversed',
          '2-PS1-4',
          [
            N(
              'The ice on Bae’s head is melting in the heat. If you took the water outside into the snow, what would happen?',
            ),
          ],
          [
            opt(
              'It would freeze into ice again',
              [
                N(
                  'Yes. Melting and freezing can go both ways. Heat melts ice; cold freezes water again.',
                ),
              ],
              true,
            ),
            opt('It would stay water for ever', [
              N('Out in the snow it’s far below 0 °C (32 °F). The water would freeze again.'),
            ]),
          ],
          'Learned that melting and freezing are changes that can be reversed.',
        ),
      ],
      {
        choices: [
          {
            id: 'soup',
            label: 'Watch the letter go in the soup.',
            then: [
              N(
                'It goes in with a respectful plop. Your Nubbin watches the pot as if the message might still have something to add.',
              ),
            ],
          },
          {
            id: 'ice',
            label: 'Ask for a block of ice for yourself.',
            then: [FI('Ha! Here. You’re cooking too. Everybody does, the first time.', 'happy')],
          },
        ],
      },
    ),
    sc(
      'a12-12-chimney-done',
      [
        FI('Well. So you’re the ones.'),
        FI('Sit.'),
        N('You sit. The soup bubbles, and the letter, it seems, has said its piece.'),
      ],
      [
        note(
          1,
          'literacy',
          'remembering by rereading',
          '',
          [
            N(
              'She read the letter three times before it went in the pot. Reading something again and again is a good way to remember it.',
            ),
          ],
          'Learned that rereading helps us remember.',
        ),
      ],
    ),
    sc(
      'a12-12-power',
      [
        N(
          'Bae tells his own story first, and then Gerda’s. The Finnish woman blinks her wise eyes, and says nothing.',
        ),
        BA(
          'You’re so clever. Can’t you give her something? A drink to give her the strength of twelve men, to beat the Snow Queen?',
          'sad',
        ),
        FI('The strength of twelve men! Much good that would do her.', 'think'),
        N(
          'She takes Bae into a corner, puts fresh ice on his head, and speaks low. You’re near enough to hear.',
        ),
        FI('Little Kay is with the Snow Queen. He thinks it’s the best place in the world.'),
        FI(
          'That’s because there’s a splinter in his heart and a grain of glass in his eye. They must come out, or he’ll never be himself again.',
        ),
        BA('But can’t you give Gerda something? Something to make her stronger than all of it?'),
        FI(
          'I can’t give her more than she’s got. People help her. Animals carry her. She’s come this far barefoot.',
        ),
        FI(
          'It doesn’t come from me. It comes from her heart: she loves somebody, and she means it all the way through.',
          'soft',
        ),
        FI('She mustn’t hear it from us. She has to reach him herself.'),
      ],
      [
        ask(
          8,
          'literacy',
          'theme',
          'RL.4.2',
          [
            N(
              'The Finnish woman won’t give Gerda magic, because Gerda already has what she needs. What is it?',
            ),
          ],
          [
            opt(
              'Her love for Kay, and never giving up',
              [
                N(
                  'Yes. That’s the big idea of this story: love that keeps going is a kind of strength.',
                ),
              ],
              true,
            ),
            opt('A secret spell', [
              N('No spell at all. It’s her love for Kay, and the way she never gives up.'),
            ]),
            opt('The strength of twelve men', [
              N('The Finnish woman laughs at that. Gerda’s strength is love, and not giving up.'),
            ]),
          ],
          'Identified the theme of the story: love and persistence as strength.',
        ),
      ],
    ),
    sc(
      'a12-12-power-done',
      [
        N(
          'Gerda, by the stove, hasn’t heard a word. She has fallen asleep in the heat, with her boots and mittens beside her.',
        ),
      ],
      [
        note(
          0,
          'health',
          'rest after hard effort',
          '',
          [
            N(
              'After a long, cold journey, the body needs food, warmth and sleep to recover. Gerda’s is taking all three at once.',
            ),
          ],
          'Learned that the body needs food, warmth and rest to recover.',
        ),
      ],
    ),
    sc(
      'a12-12-ask',
      [
        N(
          'You go to the corner too, and ask it straight out: should you go with Gerda, all the way in?',
        ),
        FI('No.'),
        FI(
          'Two miles on, the Snow Queen’s garden begins. There’s a big bush there with red berries, standing in the snow.',
        ),
        FI('You take her as far as the bush. Then you stop. Then you wait.'),
        FI(
          'Some doors only open for one person. If you go through with her, it won’t open at all.',
          'think',
        ),
        N(
          'She looks at your Nubbin, and then at you, as if checking that you’re the waiting sort.',
        ),
      ],
      [
        note(
          2,
          'maths',
          'miles and kilometres',
          '4.MD.A.1',
          [
            N(
              'A mile is a little more than one and a half kilometres. So two miles is about three kilometres: a long walk in the snow.',
            ),
          ],
          'Compared miles with kilometres.',
        ),
        ask(
          4,
          'sel',
          'when only one person can do it',
          'CASEL: Responsible decision-making',
          [N('You want to help Gerda all the way. Why might waiting be the most helpful thing?')],
          [
            opt('Some things you have to do yourself', [
              N('That’s a wise answer. Sometimes helping means stepping back.'),
            ]),
            opt('It isn’t; I’d go anyway', [
              N(
                'That’s honest: it’s hard to stay behind. The Finnish woman says going in would close the door.',
              ),
            ]),
            opt('So someone is there when she comes back', [
              N('Yes. Waiting is a job too. Someone has to be there.'),
            ]),
          ],
          'Thought about when stepping back is the most helpful thing to do.',
        ),
      ],
      {
        choices: [
          {
            id: 'long',
            label: '“How long?”',
            then: [FI('As long as it takes. That’s the only length waiting comes in.')],
          },
          {
            id: 'if',
            label: '“And if she doesn’t come out?”',
            then: [
              FI(
                'Then you’ll still have waited, and that’s worth something. But she’ll come.',
                'soft',
              ),
            ],
          },
          {
            id: 'nod',
            label: 'Nod. You understand.',
            then: [FI('Good. Most people argue. Most people have to be told twice.')],
          },
        ],
      },
    ),
    sc(
      'a12-12-ask-done',
      [
        FI(
          'Now go. And don’t stand about talking at the bush. Put her down, and let the reindeer come straight back.',
        ),
      ],
      [
        note(
          0,
          'sel',
          'following hard advice',
          'CASEL: Self-management',
          [
            N(
              'Following good advice is hard when you’d rather do something else. Taking a breath and trusting it is a skill.',
            ),
          ],
          'Talked about following good advice even when it is hard.',
        ),
      ],
    ),
    sc(
      'a12-12-complete',
      [
        N(
          'The Finnish woman lifts the sleeping Gerda onto Bae. Bae is off like a shot, and you hang on behind.',
        ),
        GE('Oh! My boots! My mittens! They’re by the stove!', 'shock'),
        N(
          'Bae doesn’t dare stop. He runs and runs through the hard cold, towards a dark shape in the snow.',
        ),
        N('You look back once. The little hot house is a spark, and then nothing.'),
      ],
      [
        ask(
          3,
          'literacy',
          'imagery',
          'RL.1.4',
          [N('“A spark, and then nothing.” What does that picture tell you?')],
          [
            opt(
              'You are getting very far away, fast',
              [N('Yes. The house shrinks to a tiny light, then vanishes behind you.')],
              true,
            ),
            opt('The house caught fire', [
              N('No fire! It just looks tiny, like a spark, because you’re so far away.'),
            ]),
          ],
          'Explained what a picture made of words shows.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'shimmers',
      'Wobbles and shines, the way air does over something very hot.',
      'a12-12-chimney',
    ),
    gloss('theme', 'The big idea a story is really about.', 'a12-12-power'),
  ],
);

// ================================================================== A12-13 The Bush with Red Berries
const Q13: EduQuest = quest(
  'a12-13',
  'The Bush with Red Berries',
  {
    'a12-13-s1': {
      goal: 'Reach the bush with red berries.',
      hint: 'Hold on to Bae until he stops at the bush.',
    },
    'a12-13-s2': {
      goal: 'Wait by the bush, as long as it takes.',
      hint: 'Sit on the reindeer skin and wait. There’s nothing else to do, and that’s the job.',
    },
  },
  [
    sc(
      'a12-13-bush',
      [
        N(
          'The bush stands alone in the snow, dark green, covered in berries as red as Gerda’s shoes.',
        ),
        N(
          'Bae sets Gerda down. He touches his nose to her cheek, and big bright tears run down his face.',
        ),
        BA('I can’t go further. She said. Go well, little one.', 'sad'),
        N(
          'Then he turns and runs back the way you came, as fast as he can, so that he won’t change his mind.',
        ),
        N(
          'Gerda stands in the snow in her stockings, with no boots and no mittens, in the middle of the far north.',
        ),
        N(
          'In the distance something glitters, huge and cold: walls of drifted snow, and windows of wind.',
        ),
      ],
      [
        note(
          4,
          'science',
          'polar night',
          '1-ESS1-2',
          [
            N(
              'You are far north of the Arctic Circle, where in midwinter the Sun doesn’t rise for weeks, or even months. That’s called polar night.',
            ),
            N(
              'It happens because the Earth is tilted, so in winter the far north leans away from the Sun.',
            ),
          ],
          'Learned about polar night and why it happens.',
        ),
        ask(
          2,
          'sel',
          'sad goodbyes',
          'CASEL: Self-awareness',
          [
            N(
              'Bae cries, and runs off fast so he won’t change his mind. Why do you think he does it that way?',
            ),
          ],
          [
            opt('A quick goodbye hurts less', [
              N('That’s a fair answer. Some people find a quick goodbye easier.'),
            ]),
            opt('He’s scared of the palace', [
              N('Maybe. The Finnish woman also told him to come straight back.'),
            ]),
            opt('He’d stay if he waited', [
              N('Yes, I think so too. He loves her, and leaving is hard.'),
            ]),
          ],
          'Thought about why goodbyes are hard and how people manage them.',
        ),
      ],
      {
        choices: [
          {
            id: 'coat',
            label: 'Offer Gerda your coat.',
            then: [
              GE('No. You have to wait, and waiting’s the coldest part. You keep it.', 'soft'),
            ],
          },
          {
            id: 'nubbin',
            label: 'Offer her your Nubbin, to keep her hands warm.',
            then: [
              N('Gerda strokes your Nubbin once, and shakes her head.'),
              GE(
                'It would only get cold in there. Keep it warm for me, so it’s warm when we come back.',
                'soft',
              ),
            ],
          },
          {
            id: 'go',
            label: '“Go on, then.”',
            then: [Y('Go on, then.'), GE('I’m going.', 'happy')],
          },
        ],
      },
    ),
    sc(
      'a12-13-bush-done',
      [
        N('Gerda runs off across the snow. She doesn’t look back, and you understand why.'),
        N('Then you’re alone by the bush with your Nubbin, and the quiet comes down.'),
      ],
      [
        note(
          1,
          'sel',
          'being alone and calm',
          'CASEL: Self-management',
          [
            N(
              'Being alone can feel big and empty. Noticing small things around you, like berries and breath, helps you feel steady.',
            ),
          ],
          'Learned a way to feel calm when alone.',
        ),
      ],
    ),
    sc(
      'a12-13-wait',
      [
        N(
          'You unroll the Sámi woman’s reindeer skin and sit on it. She was right: snow is colder from underneath.',
        ),
        N(
          'Your Nubbin climbs inside your coat and presses itself against you. You keep each other warm, the slow way.',
        ),
        N('There’s no wind here. Just the cold, and the quiet, and the bush, and the red berries.'),
        N(
          'The nearest branch has six bunches of berries, with five berries in each bunch. You count them.',
        ),
        N('Then you count them again, get a different number, and decide not to mind.'),
        N(
          'Far off, the lights go up over the palace, green and white. Nobody is watching them but you.',
        ),
        N('You don’t know how long it will be. You know you’ll be here when it’s over.', 'soft'),
      ],
      [
        ask(
          3,
          'maths',
          'multiplication as equal groups',
          '3.OA.A.1',
          [N('Six bunches, five berries in each. How many berries on the branch?')],
          [
            opt(
              '30',
              [
                N(
                  'Yes. Six groups of five: five, ten, fifteen, twenty, twenty-five, thirty.',
                  'happy',
                ),
              ],
              true,
            ),
            opt('11', [N('That’s six plus five. Six groups of five is six times five: thirty.')]),
            opt('25', [N('That’s five fives. One more five makes six fives: thirty.')]),
          ],
          'Multiplied equal groups to find a total.',
        ),
        ask(
          6,
          'sel',
          'patience',
          'CASEL: Self-management',
          [N('Waiting with no clock and no end in sight is hard. What helps you wait?')],
          [
            opt('Counting, or humming', [
              N('Good ideas. Keeping your mind gently busy makes time pass.'),
            ]),
            opt('Having a friend with me', [
              N('Yes. Your Nubbin is here. Waiting together is easier.'),
            ]),
            opt('Knowing why I’m waiting', [
              N('That’s a wise one. Waiting for someone you love has a point to it.'),
            ]),
          ],
          'Thought about strategies that make waiting easier.',
        ),
      ],
      { choices: WAIT_CHOICES },
    ),
    sc(
      'a12-13-wait-done',
      [N('Your feet go numb, and come back, and go numb again. You stay.')],
      [
        note(
          0,
          'health',
          'why cold feet go numb',
          '4-LS1-1',
          [
            N(
              'In the cold your body keeps its warm blood near your heart, so toes get less. Wiggling them gets the blood moving again.',
            ),
          ],
          'Learned why feet go numb in the cold and how wiggling helps.',
        ),
      ],
    ),
    sc(
      'a12-13-complete',
      [
        N(
          'Night comes, if it ever went. The stars come out so thick they look like frost on a window.',
        ),
        N('Straight above, one star never moves while the others wheel slowly round it.'),
        N(
          'Across the snow, very small, Gerda is still walking. Something is moving over the snow towards her.',
        ),
        N('You stand up on the skin to see better. You don’t step off it.'),
        N(
          'Your Nubbin sits up inside your coat and looks out. You hold it a little tighter, and you stay where you are.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'the Pole Star',
          '1-ESS1-1',
          [
            N(
              'The star that stays still while the others turn round it is the Pole Star. What has it helped travellers find for centuries?',
            ),
          ],
          [
            opt(
              'Which way is north',
              [
                N(
                  'Yes. The Pole Star sits almost exactly above the North Pole. In the far north it’s nearly overhead.',
                ),
              ],
              true,
            ),
            opt('What time it is', [
              N('Other stars can help with time, but the Pole Star’s job is showing north.'),
            ]),
          ],
          'Learned that the Pole Star shows the way north.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'polar night',
      'A time in winter, near the Poles, when the Sun does not rise all day.',
      'a12-13-bush',
    ),
    gloss('numb', 'Unable to feel anything, often from cold.', 'a12-13-wait-done'),
  ],
);

// ================================================================== A12-14 The Snowflake Guards
const Q14: EduQuest = quest(
  'a12-14',
  'The Snowflake Guards',
  {
    'a12-14-s1': {
      goal: 'Watch Gerda from the bush.',
      hint: 'Stand on the reindeer skin and look out across the snow.',
    },
    'a12-14-s2': { goal: 'Watch what Gerda does.', hint: 'Keep watching. Don’t look away.' },
  },
  [
    sc(
      'a12-14-guards',
      [
        N(
          'Gerda is a dark speck on the white. Towards her, along the ground, come the snowflakes.',
        ),
        N(
          'They don’t fall from the sky; the sky is clear. They run along the snow, and the nearer they get, the bigger they grow.',
        ),
        N(
          'You remember Kay’s burning-glass, and how big the flakes looked under it. These are bigger, and they are alive.',
        ),
        N(
          'Some are like great prickly porcupines, and some like knots of snakes with their heads sticking out.',
        ),
        N('Some are like fat little bears with their fur on end. All of them are dazzling white.'),
        N('They are the Snow Queen’s guards. They close round Gerda in a ring.'),
      ],
      [
        ask(
          2,
          'maths',
          'measuring small things',
          '4.MD.A.1',
          [N('A real snowflake is tiny. About how wide is a real one, usually?')],
          [
            opt(
              'A few millimetres',
              [
                N(
                  'Yes. Most are a few millimetres across, smaller than your fingernail. These guards are pure story.',
                ),
              ],
              true,
            ),
            opt('A few metres', [
              N('A metre-wide snowflake would be a monster! Real ones are a few millimetres.'),
            ]),
            opt('A few kilometres', [
              N('That would cover a town! Real snowflakes are a few millimetres across.'),
            ]),
          ],
          'Estimated a small length using millimetres.',
        ),
      ],
      {
        choices: [
          {
            id: 'shout',
            label: 'Shout to her.',
            then: [
              N(
                'You shout. The cold takes the sound out of your mouth and drops it in the snow a yard away.',
              ),
            ],
          },
          {
            id: 'step',
            label: 'Take one step off the skin.',
            then: [
              N(
                'You take one step. Then you remember what the Finnish woman said, and you step back on.',
              ),
            ],
          },
          {
            id: 'hold',
            label: 'Hold your Nubbin tight.',
            then: [
              N(
                'You hold it, and it holds you. Neither of you takes your eyes off the speck in the ring.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-14-guards-done',
      [N('Gerda stops. She doesn’t run.'), N('She stands quite still in the middle of the ring.')],
      [
        note(
          1,
          'sel',
          'staying calm when scared',
          'CASEL: Self-management',
          [
            N(
              'When something frightening happens, stopping to think, instead of running, can help you choose what to do.',
            ),
          ],
          'Talked about stopping to think when something is frightening.',
        ),
      ],
    ),
    sc(
      'a12-14-prayer',
      [
        N(
          'Gerda folds her hands and says her prayer, the one Grandmother taught her. You can’t hear it from here, and you don’t need to.',
        ),
        N(
          'It’s so cold that her breath comes out like smoke. The smoke grows thicker as she prays.',
        ),
        N(
          'Then it turns into small bright figures, with helmets on their heads and spears and shields in their hands.',
        ),
        N(
          'They grow as they touch the ground, and there are more of them with every breath she takes.',
        ),
        N(
          'By the time she has finished her prayer, a whole crowd of them stands round her, shining.',
        ),
        N(
          'They break the snowflake guards into a hundred pieces, and clear the road ahead of her.',
        ),
        N(
          'They stroke her hands and feet so that she feels the cold less, and she walks on, quickly and bravely.',
          'soft',
        ),
      ],
      [
        note(
          1,
          'science',
          'why breath shows in cold air',
          '2-ESS2-3',
          [
            N(
              'Your breath is warm and full of water vapour. In freezing air the vapour cools into tiny droplets of water, so you can see it like smoke.',
            ),
          ],
          'Learned why breath turns into a cloud on a cold day.',
        ),
        ask(
          6,
          'sel',
          'courage',
          'CASEL: Self-awareness',
          [
            N(
              'Gerda is surely frightened, and she walks on anyway. Is that brave, even though she’s scared?',
            ),
          ],
          [
            opt('Yes. Brave means scared, and doing it anyway', [
              N('That’s a wise answer. Courage isn’t having no fear; it’s going on with it.'),
            ]),
            opt('No. Brave people aren’t scared', [
              N('Many people think so. But if you’re not scared, is it brave, or just easy?'),
            ]),
          ],
          'Thought about what courage means.',
        ),
      ],
    ),
    sc(
      'a12-14-prayer-done',
      [
        N(
          'The bright figures go with her all the way to the palace gate. Then they’re gone, like breath on a window.',
        ),
      ],
      [
        ask(
          0,
          'literacy',
          'similes',
          'L.4.5',
          [N('“Gone, like breath on a window.” What does breath on a window do?')],
          [
            opt(
              'It fades away quickly',
              [
                N(
                  'Yes. The misty patch shrinks and vanishes in a moment. So do the bright figures.',
                ),
              ],
              true,
            ),
            opt('It stays for ever', [
              N('Try it on a cold window: the mist fades away in seconds. So do the figures.'),
            ]),
          ],
          'Explained a simile using an everyday experience.',
        ),
      ],
    ),
    sc(
      'a12-14-complete',
      [
        N(
          'The palace gate is made of cutting winds. Gerda says her evening prayer, and the winds drop as if they’ve gone to sleep.',
        ),
        N('She goes in. The gate closes behind her, and the winds get up again.'),
        N('You sit back down on the reindeer skin. Your Nubbin puts its chin on your arm.'),
        N('You sat down here at about four o’clock. Now it feels like about ten.'),
        N('Now there’s nothing to watch but the walls. You watch them anyway.'),
      ],
      [
        ask(
          3,
          'maths',
          'time intervals',
          '3.MD.A.1',
          [N('From four o’clock to ten o’clock. How long have you been waiting by the bush?')],
          [
            opt(
              '6 hours',
              [N('Yes. Five, six, seven, eight, nine, ten: six hours.', 'happy')],
              true,
            ),
            opt('14 hours', [N('That’s four plus ten. Count on from four to ten: six hours.')]),
            opt('4 hours', [
              N('Count on from four: five, six, seven, eight, nine, ten. Six hours.'),
            ]),
          ],
          'Worked out a time interval by counting on.',
        ),
      ],
    ),
  ],
  [
    gloss('porcupine', 'An animal covered in long, sharp spines.', 'a12-14-guards'),
    gloss('courage', 'Being brave, even when you feel afraid.', 'a12-14-prayer'),
  ],
);

// ================================================================== A12-15 The Ice Puzzle
const Q15: EduQuest = quest(
  'a12-15',
  'The Ice Puzzle',
  {
    'a12-15-s1': {
      goal: 'Watch the Snow Queen fly south.',
      hint: 'Look through the clear patch in the frost, then up at the sky.',
    },
    'a12-15-s2': {
      goal: 'Watch Kay at his puzzle.',
      hint: 'Keep looking through the clear patch in the frost.',
    },
  },
  [
    sc(
      'a12-15-south',
      [
        N(
          'Your Nubbin breathes on the frozen crust by your feet. The frost clears like a window, and the atlas does what atlases do.',
        ),
        N(
          'It shows you the next page while you’re still on this one: inside the palace, a little earlier, in cut paper and ice.',
        ),
        N(
          'The halls are drifted snow, and the windows are cutting winds. There are more than a hundred of them, lit by the northern lights.',
        ),
        N(
          'They are vast and empty and icy and glittering. Nobody has ever had any fun in them, not once.',
        ),
        N('The Snow Queen stands in the greatest hall, ready to go.'),
        QU(
          'I’m off to the warm lands. I want to look into the black pots, the ones that smoke. I’ll whiten them a little.',
        ),
        QU(
          'Work out the word while I’m gone. Make it, and nobody will ever tell you what to do again.',
        ),
        QU('I’ll give you the whole world for it. And a new pair of skates.'),
      ],
      [
        note(
          5,
          'science',
          'snow on volcanoes',
          '2-ESS1-1',
          [
            N('The “black pots that smoke” are volcanoes, like Etna and Vesuvius in Italy.'),
            N(
              'The air gets colder the higher you go, so snow can lie on a tall volcano even in a warm country.',
            ),
          ],
          'Learned that high mountain tops are cold, so snow can settle on volcanoes in warm lands.',
        ),
        ask(
          7,
          'sel',
          'safe is not the same as well',
          'CASEL: Responsible decision-making',
          [
            N(
              'The whole world, and never being told what to do, if Kay stays cold and feels nothing. Would that be a good deal?',
            ),
          ],
          [
            opt('No. Feelings matter more than prizes', [
              N('That’s a thoughtful answer. A prize is no fun if you can’t feel glad about it.'),
            ]),
            opt('Yes, the whole world is a lot', [
              N('It is a lot! But who would Kay share it with, if he can’t feel anything?'),
            ]),
            opt('Not sure', [N('Honest: it’s a big question. Keep it in mind as you watch Kay.')]),
          ],
          'Thought about whether being safe from feelings is the same as being well.',
        ),
      ],
      {
        choices: [
          {
            id: 'up',
            label: 'Look up as she passes.',
            then: [
              N(
                'A moment later she goes over the bush, high up, a long white streak heading south. She doesn’t look down.',
              ),
            ],
          },
          {
            id: 'down',
            label: 'Keep your head down.',
            then: [
              N(
                'You keep your head down. A long white shadow goes over the snow, and the berries rattle on the bush.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-15-south-done',
      [
        N(
          'In the great hall Kay is alone. It’s miles long, and he is the only thing in it that moves, and only just.',
        ),
      ],
      [
        note(
          0,
          'sel',
          'loneliness',
          'CASEL: Self-awareness',
          [
            N(
              'Feeling lonely is a signal, like feeling hungry: it tells us we need people. Kay is too cold to notice it.',
            ),
          ],
          'Learned that loneliness is a feeling that tells us we need other people.',
        ),
      ],
    ),
    sc(
      'a12-15-puzzle',
      [
        N(
          'In the middle of the hall is a frozen lake, cracked into a thousand pieces, every piece exactly like every other.',
        ),
        N(
          'The Snow Queen calls it the Mirror of Understanding. She says it’s the only one, and the best in the world.',
        ),
        N(
          'Kay sits on it. He is blue with cold, nearly black, and he doesn’t notice; she took the shivering out of him.',
        ),
        N(
          'He drags flat, sharp pieces of ice about, fits them together, pulls them apart, and fits them again.',
        ),
        N(
          'To him the shapes are the most important things in the world. That’s the grain of glass in his eye.',
        ),
        N(
          'He makes whole words out of ice. But there’s one word he can’t make, and it’s the only one she wants.',
        ),
        KA('Nearly. It’s nearly. It just needs one more piece.'),
        N(
          'It doesn’t. He sits and thinks until he creaks, so stiff and still that you’d think he had frozen.',
          'sad',
        ),
      ],
      [
        note(
          0,
          'maths',
          'shapes that fit together',
          '',
          [
            N(
              'Some shapes, like squares, triangles and hexagons, fit together with no gaps. Bees build honeycomb that way, and the lake is cracked like floor tiles.',
            ),
          ],
          'Learned that some shapes fit together with no gaps.',
        ),
        ask(
          1,
          'literacy',
          'irony in a name',
          'RL.3.3',
          [N('It’s called the Mirror of Understanding. Does it help Kay understand anything?')],
          [
            opt(
              'No. It just keeps him busy and cold',
              [
                N(
                  'Yes. The grand name is a kind of joke: it understands nothing, and neither does he while he’s on it.',
                ),
              ],
              true,
            ),
            opt('Yes, it makes him wise', [
              N(
                'Look at him: stuck, stiff, frozen. The name promises understanding, but it doesn’t give any.',
              ),
            ]),
          ],
          'Noticed when a name means the opposite of what something really does.',
        ),
      ],
      {
        choices: [
          {
            id: 'name',
            label: 'Say his name, out loud, to nobody.',
            then: [
              Y('Kay.'),
              N('Of course he can’t hear you. Somebody should say it, out here, so you did.'),
            ],
          },
          {
            id: 'away',
            label: 'Look away for a moment.',
            then: [
              N(
                'You look away, at the red berries, and it helps a bit. Then you look back, because somebody should.',
              ),
            ],
          },
          {
            id: 'watch',
            label: 'Keep watching.',
            then: [
              N(
                'You keep watching. Your Nubbin watches too, without blinking, the way it watches an egg that’s about to hatch.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-15-puzzle-done',
      [
        N(
          'Then, at the far end of the hall, a small figure in stockings comes in through the gate of winds.',
        ),
      ],
      [
        note(
          0,
          'health',
          'dressing for the cold',
          '',
          [
            N(
              'Gerda has no boots or mittens, but in real life you’d want warm feet, hands and head in the snow. Most body heat escapes where skin is bare.',
            ),
          ],
          'Learned to cover up hands, feet and head in cold weather.',
        ),
      ],
    ),
    sc(
      'a12-15-complete',
      [
        N(
          'Gerda walks into the empty hall. It is two kilometres long, and she walks about four kilometres an hour.',
        ),
        N('Kay doesn’t look up. He is still counting pieces.'),
        N('Your Nubbin holds its breath. You find you’re holding yours.'),
        N('Over the palace the northern lights go quiet, as if they want to see too.'),
      ],
      [
        ask(
          0,
          'maths',
          'distance, speed and time',
          '4.MD.A.2',
          [N('Four kilometres in an hour. How long will it take Gerda to walk two kilometres?')],
          [
            opt(
              'Half an hour (30 minutes)',
              [N('Yes. Two is half of four, so it takes half an hour: thirty minutes.', 'happy')],
              true,
            ),
            opt('Two hours', [
              N('Two hours would get her eight kilometres. Two is half of four: half an hour.'),
            ]),
            opt('Four hours', [
              N('Much too long! Two kilometres is half of four, so it takes half an hour.'),
            ]),
          ],
          'Solved a speed, distance and time problem using halves.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'volcano',
      'A mountain that can let out hot melted rock, ash and smoke from inside the Earth.',
      'a12-15-south',
    ),
    gloss(
      'irony',
      'When something turns out the opposite of what you would expect.',
      'a12-15-puzzle',
    ),
  ],
);

// ================================================================== A12-16 Gerda’s Tears
const Q16: EduQuest = quest(
  'a12-16',
  'Gerda’s Tears',
  {
    'a12-16-s1': {
      goal: 'Watch Gerda find Kay.',
      hint: 'Watch through the clear patch in the frost.',
    },
    'a12-16-s2': {
      goal: 'Watch Kay come back.',
      hint: 'Keep watching. This is the part you waited for.',
    },
    'a12-16-s3': {
      goal: 'Watch the ice spell the word.',
      hint: 'Watch the pieces of ice on the frozen lake.',
    },
  },
  [
    sc(
      'a12-16-found',
      [
        N(
          'Gerda sees him. She knows him at once, and she runs, and throws her arms round his neck and holds on.',
        ),
        GE('Kay! Kay, it’s you! I’ve found you!', 'happy'),
        N('Kay sits quite still. He is stiff and cold, and he doesn’t know her.'),
        N(
          'Gerda cries. Not a little: she cries the way you cry at the end of a very long way.',
          'sad',
        ),
        N(
          'Her tears fall on his chest. They’re hot, and they go through, all the way to his heart.',
        ),
        N(
          'They thaw the ice round his heart. They melt the little splinter of glass inside it, as if it had never been.',
        ),
        N('Kay looks at her.'),
      ],
      [
        note(
          3,
          'sel',
          'crying is allowed',
          'CASEL: Self-awareness',
          [
            N(
              'Crying is one way big feelings come out. It’s allowed, for anyone, and it often helps.',
            ),
          ],
          'Talked about crying as a healthy way to let big feelings out.',
        ),
        ask(
          5,
          'science',
          'warmth melts ice',
          '2-PS1-4',
          [
            N(
              'Tears come out at about body temperature, 37 °C (98.6 °F). What happens when something that warm touches ice?',
            ),
          ],
          [
            opt(
              'The ice melts',
              [
                N(
                  'Yes. Warmth melts ice. In the story, Gerda’s warm tears melt the cold in Kay’s heart.',
                ),
              ],
              true,
            ),
            opt('The tears freeze and nothing happens', [
              N('In this story the warmth wins: warm things melt ice, and the ice turns to water.'),
            ]),
          ],
          'Learned that warm things melt ice.',
        ),
      ],
      {
        choices: [
          {
            id: 'stand',
            label: 'Stand up on the skin.',
            then: [
              N('You stand up; you can’t help it. Your Nubbin climbs onto your shoulder to see.'),
            ],
          },
          {
            id: 'still',
            label: 'Stay perfectly still.',
            then: [N('You don’t move. You don’t want to break anything, even from two miles off.')],
          },
        ],
      },
    ),
    sc(
      'a12-16-found-done',
      [
        N(
          'Gerda hums the old tune with the roses in it, the one from the gutter boxes. You know it, and you hum it with her.',
        ),
      ],
      [
        doit(
          0,
          'music',
          'humming a melody together',
          '',
          'edu:hum:tune:slow',
          [
            N(
              'Hum along, slow and soft. A tune you share with someone can bring back where you were together.',
            ),
          ],
          'Hummed a slow melody along with the story.',
        ),
      ],
    ),
    sc(
      'a12-16-tears',
      [
        N('Kay bursts into tears. He cries so hard that the grain of glass washes out of his eye.'),
        N('He blinks. He sees her.'),
        KA(
          'Gerda? Gerda, it’s you. Where did you go? Where did I go? How long have I been away?',
          'shock',
        ),
        N('He looks round the hall as if he’s seeing it for the first time.'),
        KA('It’s so cold in here. It’s so big, and so empty.', 'sad'),
        N('He holds on to Gerda, and she laughs and cries at once. So, two miles away, do you.'),
      ],
      [
        ask(
          5,
          'sel',
          'naming relief',
          'CASEL: Self-awareness',
          [N('Gerda laughs and cries at the same time. What kind of tears are these?')],
          [
            opt(
              'Happy tears, from relief',
              [
                N(
                  'Yes. Relief is the feeling when a big worry ends. It can make you laugh and cry at once.',
                  'soft',
                ),
              ],
              true,
            ),
            opt('Sad tears only', [
              N('She’s laughing too! These are tears of relief: the long worry is over.'),
            ]),
          ],
          'Named the feeling of relief.',
        ),
      ],
      {
        choices: [
          {
            id: 'cheer',
            label: 'Cheer.',
            then: [
              N(
                'You cheer out loud, alone, in the middle of the far north. Your Nubbin squeaks as loud as it can.',
              ),
            ],
          },
          {
            id: 'sit',
            label: 'Sit down hard on the skin.',
            then: [N('Your legs go. You sit down on the reindeer skin and laugh, and can’t stop.')],
          },
        ],
      },
    ),
    sc(
      'a12-16-tears-done',
      [
        N('Even the pieces of ice begin to move.'),
        N('They shiver, and lift, as if they want to join in.'),
      ],
      [
        ask(
          1,
          'literacy',
          'personification',
          'L.4.5',
          [
            N(
              'The ice “wants to join in”: giving a thing human feelings is called personification. Why does the writer do it here?',
            ),
          ],
          [
            opt(
              'To show the whole place is glad',
              [N('Yes. When even the ice seems happy, you know how big this moment is.')],
              true,
            ),
            opt('Because ice really has feelings', [
              N('Not real ice! It’s a way of showing that the gladness fills the whole hall.'),
            ]),
          ],
          'Explained why a writer gives human feelings to an object.',
        ),
      ],
    ),
    sc(
      'a12-16-word',
      [
        N(
          'It is such a glad moment that the pieces of ice dance. They spin round Kay and Gerda, glittering.',
        ),
        N(
          'When they’re tired, they lie down. They lie down in the shape of a word, the very word Kay couldn’t make.',
        ),
        N('It says ETERNITY, in letters of ice, as clear as a sign.'),
        N(
          'Kay didn’t make it. It made itself, the moment he stopped trying to be clever and started being glad.',
        ),
        N(
          'Gerda kisses his cheeks, and they go pink. She kisses his eyes, and they shine like hers.',
        ),
        N(
          'She kisses his hands and feet, and he is well and strong again. The Snow Queen can come home whenever she likes.',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'multiplication as equal groups',
          '3.OA.A.1',
          [
            N('Count the ice letters: E, T, E, R, N, I, T, Y. That makes eight.'),
            N('Each letter is made of six pieces of ice. How many pieces lie on the lake?'),
          ],
          [
            opt(
              '48',
              [
                N(
                  'Yes. Eight groups of six: six, twelve, eighteen, twenty-four, and on to forty-eight.',
                ),
              ],
              true,
            ),
            opt('14', [
              N('That’s eight plus six. Eight groups of six is eight times six: forty-eight.'),
            ]),
            opt('40', [
              N(
                'That’s eight fives. Each letter has six pieces, so it’s eight sixes: forty-eight.',
              ),
            ]),
          ],
          'Counted the letters in a word, then multiplied equal groups.',
        ),
        ask(
          3,
          'literacy',
          'word meaning',
          'L.2.4',
          [N('“Eternity” is a long word. What does it mean?')],
          [
            opt('For ever, with no end', [N('Yes. Eternity means time that never ends.')], true),
            opt('A kind of ice', [N('Not ice: eternity means for ever, time with no end.')]),
          ],
          'Learned the meaning of the word eternity.',
        ),
      ],
      {
        choices: [
          {
            id: 'read',
            label: 'Read the word out loud.',
            then: [
              Y('Eternity.'),
              N('It’s a long word for something so simple. Your Nubbin seems to agree.'),
            ],
          },
          {
            id: 'gerda',
            label: 'Look at Gerda instead of the word.',
            then: [
              N('You look at Gerda. The word is the Snow Queen’s business, and Gerda is yours.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-16-word-done',
      [N('Kay’s freedom is written there on the lake, in shining letters. Nobody can unwrite it.')],
      [
        ask(
          0,
          'literacy',
          'theme',
          'RL.4.2',
          [
            N(
              'Kay tried and tried to be clever enough to make the word, but it only came when he was glad. What do you think that means?',
            ),
          ],
          [
            opt('Love matters more than cleverness', [
              N('That’s a big idea, and a fair one. Cleverness alone couldn’t fix Kay.'),
            ]),
            opt('Some things can’t be forced', [
              N('A wise answer. Some things only come when we stop pushing.'),
            ]),
            opt('He just got lucky', [
              N('Maybe! But notice when it happened: the moment he felt glad.'),
            ]),
          ],
          'Thought about the theme of the story: love matters more than cleverness.',
        ),
      ],
    ),
    sc(
      'a12-16-complete',
      [
        N('Kay and Gerda take each other’s hands and walk out of the great palace.'),
        N(
          'They talk about Grandmother, and the roses up on the roof. Wherever they go, the winds drop and the sun comes out.',
        ),
        N(
          'The clear patch in the frost fogs over. It doesn’t need to show you anything now; you can see them coming.',
        ),
        GE('There! By the bush! That’s our lodger. They waited!', 'happy'),
        KA('Waited? Out here? For me?', 'think'),
      ],
      [
        note(
          4,
          'sel',
          'showing someone they matter',
          'CASEL: Relationship skills',
          [
            N(
              'Kay can hardly believe someone waited for him. Being remembered and waited for is one way we know we matter.',
            ),
          ],
          'Talked about how waiting for someone shows that they matter.',
        ),
      ],
    ),
  ],
  [
    gloss('relief', 'The happy, loosening feeling when a worry or danger is over.', 'a12-16-tears'),
    gloss('eternity', 'Time that goes on for ever, with no end.', 'a12-16-word'),
  ],
);

// ================================================================== A12-17 The Road Home
const Q17: EduQuest = quest(
  'a12-17',
  'The Road Home',
  {
    'a12-17-s1': {
      goal: 'Meet Bae back at the bush.',
      hint: 'Stay by the bush. Bae is coming back.',
    },
    'a12-17-s2': {
      goal: 'Go south by the Finnish woman’s house and the Sámi woman’s.',
      hint: 'Stop at both houses on the way.',
    },
    'a12-17-s3': { goal: 'Meet the rider in the forest.', hint: 'Walk on into the green forest.' },
  },
  [
    sc(
      'a12-17-doe',
      [
        N(
          'Bae is back at the bush when they reach it. He has brought a young doe with him, sleek and calm.',
        ),
        N('She gives the children her warm milk to drink, and touches her nose to their faces.'),
        BA('I said I’d come straight back. I never said I’d stay away.', 'happy'),
        KA(
          'Hello, lodger. Gerda says you saw the sledge. I’m sorry about the face I did at you.',
          'sad',
        ),
        N(
          'He means the impression at the window, a long time ago. He remembers it, and he’s ashamed of it, which is a good sign.',
        ),
        GE('He’s back. He’s really back. He’s cross about his feet, which is how I know.', 'happy'),
        N('The sky is getting lighter every day now. Soon, up here, it won’t get dark at all.'),
      ],
      [
        ask(
          3,
          'sel',
          'saying sorry',
          'CASEL: Relationship skills',
          [
            N(
              'Kay says sorry for something he did a long time ago. What makes an apology a good one?',
            ),
          ],
          [
            opt(
              'Saying what you did, and meaning it',
              [N('Yes. Kay names the face he pulled. A real sorry says what for, and means it.')],
              true,
            ),
            opt('Saying it fast so it’s over', [
              N(
                'A quick sorry can sound empty. Kay names exactly what he did, which shows he means it.',
              ),
            ]),
          ],
          'Talked about what makes a sincere apology.',
        ),
        note(
          6,
          'science',
          'the midnight sun',
          '1-ESS1-2',
          [
            N(
              'North of the Arctic Circle, in summer, the Sun doesn’t set at all for days, weeks or even months. That’s called the midnight sun.',
            ),
            N(
              'It’s the summer side of polar night: the Earth’s tilt now leans the far north towards the Sun.',
            ),
          ],
          'Learned about the midnight sun and why it happens.',
        ),
      ],
      {
        choices: [
          {
            id: 'face',
            label: 'Tell Kay it was a very good impression.',
            then: [KA('It was, wasn’t it. I won’t do it again. Probably.', 'happy')],
          },
          {
            id: 'hug',
            label: 'Hug them both.',
            then: [
              N(
                'You hug them both at once. Your Nubbin gets squashed in the middle and doesn’t mind at all.',
              ),
            ],
          },
          {
            id: 'skin',
            label: 'Wrap them in the reindeer skin.',
            then: [
              N(
                'You wrap the skin round both of them. They look like a very small, very pleased bundle of reindeer.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-17-doe-done',
      [
        N(
          'Bae and the doe carry them south. You walk alongside with a hand on Bae’s shoulder, and your feet don’t feel the snow.',
        ),
      ],
      [
        note(
          0,
          'science',
          'sunlight melts snow in spring',
          'K-PS3-1',
          [
            N(
              'As the days get longer, the Sun has more time to warm the ground each day. That’s why snow melts in spring.',
            ),
          ],
          'Learned that longer days of sunlight warm the ground and melt the snow.',
        ),
      ],
    ),
    sc(
      'a12-17-south',
      [
        N(
          'First you stop at the Finnish woman’s hot little house. The children get warm, and she gives Gerda back her boots and mittens.',
        ),
        FI('I told you she’d come. You waited well. Most people fidget.'),
        N(
          'Then on to the Sámi woman. She has sewn new clothes for both children, and has her sledge ready.',
        ),
        SA('Well. You’re back, and there’s two of them. So that’s how it ends.', 'happy'),
        N(
          'She drives you south herself, with Bae and the doe running alongside, to the edge of her country.',
        ),
        N('There the first green is coming through the snow, and it’s time to say goodbye.'),
        SA('Go well, all of you. Even the one that wanted to eat my letter.'),
      ],
      [
        note(
          3,
          'social-studies',
          'Sámi National Day',
          'D2.His.2.K-2',
          [
            N(
              'Every year on 6 February, Sámi people in all four countries celebrate Sámi National Day, with the Sámi flag, songs and gatherings.',
            ),
          ],
          'Learned that Sámi National Day is celebrated on 6 February.',
        ),
      ],
      {
        choices: [
          {
            id: 'thanks',
            label: 'Thank her for everything.',
            then: [
              SA('It was only fish and a skin. Keep the skin. You’ve made good use of it.', 'soft'),
            ],
          },
          {
            id: 'bae',
            label: 'Say goodbye to Bae.',
            then: [
              BA('Goodbye, lodger. You sit well. I’ve never seen anybody sit so well.', 'happy'),
              N('He touches his nose to your Nubbin, very gently, and turns for home.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-17-south-done',
      [N('Bae and the doe turn north and run, side by side, until they’re part of the snow.')],
      [
        note(
          0,
          'science',
          'animals move to where their needs are met',
          'K-ESS3-1',
          [
            N(
              'In spring, many reindeer herds travel to their summer grazing lands, where fresh plants are growing. Animals go where they can find what they need.',
            ),
          ],
          'Learned that animals move to places that meet their needs.',
        ),
      ],
    ),
    sc(
      'a12-17-rider',
      [
        N(
          'The first birds are singing, and the forest has green buds. Out of it comes a fine horse that Gerda knows: it pulled the golden coach.',
        ),
        N('On it rides a girl in a bright red cap. It’s the robber girl.'),
        RG(
          'I got bored at home. I’m off to see the world. North first, and somewhere else if north’s no good.',
        ),
        N(
          'Two wood pigeons ride on her saddle, tied by the leg. They coo at Gerda as if they remember her.',
        ),
        ...NEWS,
      ],
      [
        ask(
          9,
          'sel',
          'grief and remembering',
          'CASEL: Social awareness',
          [
            N(
              'The raven’s sweetheart wears a black thread to remember him. What are some ways people remember someone who has died?',
            ),
          ],
          [
            opt('Telling stories about them', [
              N('Yes. Like she does: telling everybody about him keeps him close.'),
            ]),
            opt('Keeping something special', [
              N('A lovely way. A thread, a photo, a flower on a hill.'),
            ]),
            opt('Just missing them', [
              N('Missing someone is a kind of remembering too. It shows how much they mattered.'),
            ]),
          ],
          'Thought about the ways people remember someone who has died.',
        ),
      ],
      { choices: NEWS_CHOICES },
    ),
    sc(
      'a12-17-rider-done',
      [
        N(
          'As she rides off, she tosses something small and red over her shoulder. It lands on your Nubbin’s head: a little red cap.',
        ),
        RG('Robbers always have two of everything!', 'happy'),
      ],
      [
        ask(
          1,
          'maths',
          'multiplication as equal groups',
          '3.OA.A.1',
          [N('If robbers really have two of everything, how many caps do five robbers have?')],
          [
            opt('10', [N('Yes. Five groups of two: two, four, six, eight, ten.', 'happy')], true),
            opt('7', [N('That’s five plus two. Five groups of two is five times two: ten.')]),
          ],
          'Multiplied equal groups of two.',
        ),
      ],
    ),
    sc(
      'a12-17-complete',
      [
        N(
          'The robber girl rides off into the wide world without looking back. You suspect she never looks back.',
        ),
        N('Kay and Gerda walk on hand in hand. It’s spring, and there are flowers everywhere.'),
        N('Your Nubbin wears its red cap at a slant, the way she does.'),
        N('Somewhere ahead, church bells are ringing.'),
      ],
      [
        ask(
          3,
          'science',
          'how bells make sound',
          '1-PS4-1',
          [N('How does a church bell make its sound?')],
          [
            opt(
              'The metal vibrates when it’s struck',
              [
                N(
                  'Yes. The clapper hits the bell, the metal shakes very fast, and those vibrations travel to your ears.',
                ),
              ],
              true,
            ),
            opt('Air blows through it like a whistle', [
              N('That’s how a whistle works. A bell is struck, and its metal vibrates.'),
            ]),
          ],
          'Learned that a bell makes sound by vibrating.',
        ),
      ],
    ),
  ],
  [
    gloss('apology', 'Saying sorry for something you did wrong, and meaning it.', 'a12-17-doe'),
    gloss('grief', 'The deep sadness we feel when someone we love dies.', 'a12-17-rider'),
  ],
);

// ================================================================== A12-18 Summer
const Q18: EduQuest = quest(
  'a12-18',
  'Summer',
  {
    'a12-18-s1': {
      goal: 'Walk home into the town.',
      hint: 'Follow the church bells to Grandmother’s door.',
    },
    'a12-18-s2': {
      goal: 'Sit by the roses with Kay and Gerda.',
      hint: 'Climb out to the little stools under the rose arch.',
    },
  },
  [
    sc(
      'a12-18-bells',
      [
        N(
          'The church bells are ringing, and you know the high towers. It’s the town: yours for a while, and theirs for always.',
        ),
        N('You go through the streets to Grandmother’s door, up the stairs, and into the room.'),
        N('Everything is where it was. The clock says tick, tick, and its hands go round.'),
        N('But as Kay and Gerda come through the door, they notice something. They’ve grown up.'),
        KA('Was the door always this low?', 'think'),
        GE('We’ve been gone a long time.', 'soft'),
      ],
      [
        ask(
          4,
          'science',
          'growing up',
          '3-LS1-1',
          [N('The door hasn’t changed. Why does it seem lower to Kay?')],
          [
            opt(
              'He has grown taller',
              [N('Yes. Children grow taller as they get older, and the door stayed the same.')],
              true,
            ),
            opt('The door shrank', [N('Doors don’t shrink! Kay grew taller while he was away.')]),
          ],
          'Learned that children grow as part of the human life cycle.',
        ),
      ],
      {
        choices: [
          {
            id: 'duck',
            label: 'Duck under the beam, out of habit.',
            then: [N('You duck. Kay, who never had to before, hits his head on it, and laughs.')],
          },
          {
            id: 'clock',
            label: 'Listen to the clock.',
            then: [N('Tick, tick: it kept going the whole time. Somebody kept winding it.')],
          },
        ],
      },
    ),
    sc(
      'a12-18-bells-done',
      [
        N(
          'The window is open. The roses in the gutter boxes are in full bloom, and they’re growing right in at the window.',
        ),
      ],
      [
        note(
          0,
          'science',
          'summer warmth and growth',
          'K-PS3-1',
          [
            N(
              'Long summer days give the roses lots of warm sunlight. That’s why they flower so well in summer.',
            ),
          ],
          'Learned that sunlight warms the ground and helps plants grow in summer.',
        ),
      ],
    ),
    sc(
      'a12-18-roses',
      [
        N(
          'There are the two little stools under the arch. Kay and Gerda sit on them, holding hands, too big for them now.',
        ),
        N(
          'The Snow Queen’s cold empty halls have gone out of their heads, like a heavy dream after breakfast.',
        ),
        N(
          'Grandmother sits in the sun, reading aloud from her Bible. She reads slowly, and stops when she reaches a part she likes.',
        ),
        N(
          'Kay and Gerda look at each other. All at once they understand the old hymn about the roses, the one they used to hum.',
        ),
        N('They’re grown up, and they’re children too, in the place where it counts.', 'soft'),
        N('And it is summer: warm, glorious summer.'),
      ],
      [
        ask(
          4,
          'literacy',
          'theme',
          'RL.4.2',
          [
            N(
              'Grown up, and still children “where it counts”. What do you think it means to be a child at heart?',
            ),
          ],
          [
            opt('Still being able to play and wonder', [
              N('That’s a lovely answer. Growing up doesn’t have to mean losing that.'),
            ]),
            opt('Still loving the people you loved', [
              N('Yes. Kay and Gerda kept that through everything.'),
            ]),
            opt('Not growing up at all', [
              N(
                'They have grown up, though! It’s more about keeping something inside while you grow.',
              ),
            ]),
          ],
          'Thought about what it means to grow up but stay a child at heart.',
        ),
        note(
          5,
          'science',
          'a year of seasons',
          'K-ESS2-1',
          [
            N(
              'The story began in late summer, and it ends in summer. Gerda’s road went through autumn, winter and spring, all the way round the year.',
            ),
          ],
          'Traced the seasons through the whole story.',
        ),
      ],
      {
        choices: [
          {
            id: 'gutter',
            label: 'Sit on the gutter’s edge beside them.',
            then: [
              N(
                'You sit on the edge of the gutter with your feet over the boxes. Grandmother looks up, nods, and reads on.',
              ),
            ],
          },
          {
            id: 'water',
            label: 'Fetch the watering can.',
            then: [
              N(
                'You water the top of the arch, carefully. A drop lands on Kay, and he pretends not to notice, very badly.',
              ),
            ],
          },
        ],
      },
    ),
    sc(
      'a12-18-roses-done',
      [
        GR('There you are, lodger. I kept your room.', 'soft'),
        GR('I thought you’d want it back, after.'),
      ],
      [
        note(
          1,
          'sel',
          'being remembered',
          'CASEL: Relationship skills',
          [
            N(
              'Grandmother kept your room ready the whole time. Being kept a place by someone is a way of being remembered.',
            ),
          ],
          'Talked about how being remembered by others feels.',
        ),
      ],
    ),
    sc(
      'a12-18-complete',
      [
        N(
          'Your Nubbin climbs out among the roses and sits there alone in the middle of them, in its red cap, quite content.',
        ),
        N('Nobody is holding it, and nobody needs to. It stays because it wants to.', 'soft'),
        ...END,
        N(
          'You think of everyone who helped Gerda on the way. She couldn’t have done it alone, and she never had to.',
        ),
      ],
      [
        ask(
          1,
          'sel',
          'freedom and friendship',
          'CASEL: Social awareness',
          [
            N(
              'You said no to the robber girl, and your Nubbin stayed with you. Why do you think it’s content to stay?',
            ),
          ],
          [
            opt('Because it chose to', [
              N('That’s a fair answer. A friend who stays because they want to is the best kind.'),
            ]),
            opt('Because it trusts you', [
              N('Yes. You kept it with you, kindly, and it knows it.'),
            ]),
            opt('Because the roses are nice', [
              N('They are lovely! And it’s with you, which counts too.'),
            ]),
          ],
          'Thought about the difference between holding on to someone and a friend choosing to stay.',
        ),
      ],
    ),
  ],
  [gloss('content', 'Quietly happy, with nothing more you need.', 'a12-18-complete')],
);

// ================================================================== variants
const A12_READER_VARIANTS: EduScene[] = [
  // ---- A12-1, cinder
  sc(
    'a12-01-ember-forgiven',
    [
      N(
        'Your Nubbin is carrying something: a little lantern, and in it Cinder’s ember, small and red.',
      ),
      N(
        'It burns steady, the colour of a hearth with the door shut. Grandmother holds her hands out to it without thinking.',
      ),
      GR('Now that’s a good little fire. Bring it up with you; the eaves get cold.', 'soft'),
    ],
    [
      note(
        1,
        'science',
        'what a fire needs',
        '',
        [
          N(
            'A fire needs three things: fuel to burn, air, and heat. The lantern glass lets air in but keeps the wind from blowing the flame about.',
          ),
        ],
        'Learned that fire needs fuel, air and heat.',
      ),
    ],
  ),
  sc(
    'a12-01-ember-remembered',
    [
      N(
        'Your Nubbin is carrying something: a little lantern, and in it Cinder’s ember, small and red.',
      ),
      N('It flickers now and then, as if it’s remembering something. It never goes out.'),
      GR('That one’s got a story in it. Bring it up with you; the eaves get cold.', 'think'),
    ],
    [
      ask(
        1,
        'science',
        'why flames flicker',
        '',
        [N('Why does a flame flicker?')],
        [
          opt(
            'Moving air pushes it about',
            [GR('Yes. Every draught nudges it. A lantern keeps out the worst.', 'soft')],
            true,
          ),
          opt('It is tired', [GR('Flames don’t get tired! Moving air pushes them about.')]),
        ],
        'Learned that flames flicker when air moves around them.',
      ),
    ],
  ),
  // ---- A12-4, keptStone
  sc(
    'a12-04-kept',
    [
      N(
        'As it comes round the square again, the white sledge doesn’t pass you. It stops, right beside you.',
      ),
      N(
        'The driver looks down. Under the white cap is a face of ice, lovely and still, with eyes like two stars.',
      ),
      QU('You keep things too.'),
      N('She says nothing about the stone in your pocket. She doesn’t need to.'),
      N(
        'She lifts the edge of her white bearskin and holds it open. Inside it’s soft and white and very quiet.',
      ),
      N(
        'It’s a place where you will never feel the cold again. Never hurt, and never warm, either.',
      ),
    ],
    [
      ask(
        5,
        'sel',
        'safe is not the same as well',
        'CASEL: Self-awareness',
        [
          N(
            'A place where nothing could ever hurt you, but nothing would ever feel warm or happy either. Would you want it?',
          ),
        ],
        [
          opt('No. I want the warm feelings too', [
            N('That’s a thoughtful answer. The good feelings and the hard ones come together.'),
          ]),
          opt('Sometimes, on a bad day', [
            N(
              'That’s honest: on hard days, feeling nothing can sound restful. A hug usually helps more.',
            ),
          ]),
          opt('I’m not sure', [
            N('It’s a big question. Notice how cold the fur looks, even though it’s soft.'),
          ]),
        ],
        'Thought about whether being safe from all feelings is the same as being well.',
      ),
    ],
    {
      choices: [
        {
          id: 'refuse',
          label: '“No.”',
          then: [
            Y('No, thank you.'),
            N(
              'She looks at you a moment longer, without anger. Then she lets the bearskin fall, and drives on.',
            ),
          ],
        },
        {
          id: 'step',
          label: 'Say nothing. Step back.',
          then: [
            N(
              'You step back, out of reach of the fur. She watches you do it, and she almost smiles.',
            ),
            N('Then she lets the bearskin fall, and drives on.'),
          ],
        },
      ],
    },
  ),
  // ---- A12-10, a12-nubbin = night
  sc(
    'a12-10-free-night',
    [
      N(
        'The robber girl comes to you before she goes to Bae. Your Nubbin is in her arms, still half asleep.',
      ),
      N('She holds it out to you. You didn’t ask, and she gives it back anyway.'),
      RG('There. I gave it back. Nobody made me.', 'think'),
      RG('And if I can give one back, I can give two.'),
      N('She goes to Bae and puts her hand flat on his neck, by the copper ring.'),
      ...FREE,
    ],
    [
      ask(
        3,
        'sel',
        'trust and keeping your word',
        'CASEL: Responsible decision-making',
        [
          N(
            'You trusted her for one night, and she kept her side. Why does it matter to her that nobody made her?',
          ),
        ],
        [
          opt('It shows she chose to be fair', [
            N(
              'That’s a fair answer. Doing the right thing by choice feels different from being forced.',
            ),
          ]),
          opt('She’s proud of herself', [
            N('Yes, I think she is. Being trusted can help people trust themselves.'),
          ]),
          opt('She wanted you to notice', [
            N('Maybe! People often want someone to see when they’ve done well.'),
          ]),
        ],
        'Thought about trust and choosing to keep your word.',
      ),
    ],
    { choices: FREE_CHOICES },
  ),
  // ---- A12-12, cinder
  sc(
    'a12-12-ember-forgiven',
    [
      N(
        'The Finnish woman stops. She’s looking at the little lantern your Nubbin carries, and the ember burning steady in it.',
      ),
      FI('That was a fierce fire once.', 'think'),
      FI('It only keeps someone warm now. That’s the right size for a fire.', 'soft'),
      N('She bends and warms her hands at it for a moment, as if she were greeting somebody.'),
    ],
    [
      ask(
        2,
        'literacy',
        'metaphor',
        'L.4.5',
        [
          N(
            '“The right size for a fire”: she might be talking about more than fire. What else could be fierce once, and warm now?',
          ),
        ],
        [
          opt('A big angry feeling that has calmed', [
            N('That’s a thoughtful reading. Anger that settles can turn into warmth.'),
          ]),
          opt('A person who has changed', [
            N('Yes, it could be. People can change from fierce to kind.'),
          ]),
          opt('Just the fire', [N('That works too. Sometimes a fire is just a fire.')]),
        ],
        'Thought about a line that could be a metaphor.',
      ),
    ],
  ),
  sc(
    'a12-12-ember-remembered',
    [
      N(
        'The Finnish woman stops. She’s looking at the little lantern your Nubbin carries, and the ember flickering in it.',
      ),
      FI('That was a fierce fire once.', 'think'),
      FI('It only keeps someone warm now. That’s the right size for a fire.', 'soft'),
      N('The ember flickers while she looks at it. It doesn’t go out.'),
    ],
    [
      note(
        3,
        'health',
        'fire safety',
        'CASEL: Responsible decision-making',
        [
          N(
            'In real life, fire is for grown-ups to handle. Even a small flame can burn, so keep back and let an adult look after it.',
          ),
        ],
        'Talked about leaving fire and flames to grown-ups.',
      ),
    ],
  ),
  // ---- A12-13, cinder
  sc(
    'a12-13-wait-forgiven',
    [
      N(
        'You unroll the Sámi woman’s reindeer skin and sit on it. Your Nubbin sets its little lantern down between your feet.',
      ),
      N('Cinder’s ember burns steady inside it. It isn’t much of a fire, and it’s exactly enough.'),
      N('The cold comes right up to the edge of its light and stops there, as if it knows better.'),
      N('There’s no wind here. Just the quiet, and the bush, and the red berries.'),
      N(
        'The nearest branch has six bunches of berries, with five berries in each bunch. You count them, twice, and decide not to mind.',
      ),
      N('You don’t know how long it will be. You know you’ll be here when it’s over.', 'soft'),
    ],
    [
      note(
        2,
        'science',
        'heat moves from warm to cold',
        '4-PS3-2',
        [
          N(
            'Heat always spreads from warmer things to colder ones. The ember warms the air nearest to it, so the coldest air stays further away.',
          ),
        ],
        'Learned that heat moves from warmer things to colder things.',
      ),
      ask(
        4,
        'maths',
        'multiplication as equal groups',
        '3.OA.A.1',
        [N('Six bunches, five in each. How many berries?')],
        [
          opt('30', [N('Yes: six fives are thirty.', 'happy')], true),
          opt('11', [N('That’s six plus five. Six groups of five make thirty.')]),
        ],
        'Multiplied equal groups to find a total.',
      ),
    ],
    { choices: WAIT_CHOICES },
  ),
  sc(
    'a12-13-wait-remembered',
    [
      N(
        'You unroll the Sámi woman’s reindeer skin and sit on it. Your Nubbin sets its little lantern down between your feet.',
      ),
      N(
        'Cinder’s ember flickers inside it now and then, as if remembering something. It never goes out.',
      ),
      N('It keeps you both from freezing. That’s all it does now, and it does it all night.'),
      N('There’s no wind here. Just the quiet, and the bush, and the red berries.'),
      N(
        'The nearest branch has six bunches of berries, with five berries in each bunch. You count them, twice, and decide not to mind.',
      ),
      N('You don’t know how long it will be. You know you’ll be here when it’s over.', 'soft'),
    ],
    [
      note(
        2,
        'science',
        'heat moves from warm to cold',
        '4-PS3-2',
        [
          N(
            'Heat spreads from warm things to cold ones. Even a small, flickering ember sends out enough warmth to keep the nearest cold away.',
          ),
        ],
        'Learned that heat moves from warmer things to colder things.',
      ),
      ask(
        5,
        'sel',
        'patience',
        'CASEL: Self-management',
        [N('What helps you wait, when you don’t know how long it will be?')],
        [
          opt('Keeping busy, like counting', [N('Good idea. A gently busy mind makes time pass.')]),
          opt('Having a friend near', [N('Yes. Your Nubbin and the ember are company.')]),
          opt('Remembering why I’m waiting', [
            N('A wise answer. Waiting for someone you care about has a point.'),
          ]),
        ],
        'Thought about strategies that make waiting easier.',
      ),
    ],
    { choices: WAIT_CHOICES },
  ),
  // ---- A12-14, keptStone
  sc(
    'a12-14-prayer-kept',
    [
      N(
        'Gerda folds her hands and says her prayer. Her breath turns to smoke, and the smoke turns to small bright figures.',
      ),
      N(
        'There are more of them with every breath. They break the guards into a hundred pieces, and she walks on, quickly and bravely.',
      ),
      N('Then some of the snowflakes turn, and come running along the ground towards you.'),
      N(
        'They reach the edge of the skin and stop. Then they part, left and right, like servants at a door.',
      ),
      N('In your pocket the stone hums, which it has never done before. It sounds pleased.'),
      N(
        'The road to the palace lies open in front of you, clear and smooth and white. Nothing would stop you.',
      ),
      N('You could walk in. You know exactly how welcome you would be.', 'think'),
    ],
    [
      ask(
        6,
        'sel',
        'keeping a promise when it’s easy to break',
        'CASEL: Responsible decision-making',
        [N('The road is open, and nobody would stop you. Why might you stay on the skin anyway?')],
        [
          opt('Because this part is Gerda’s', [
            N('That’s a fair answer. Some journeys belong to one person.'),
          ]),
          opt('Because I said I’d wait', [
            N('Yes. Keeping your word matters most when breaking it would be easy.'),
          ]),
          opt('Because being welcome there isn’t good', [
            N('A sharp answer. Being welcome somewhere cold isn’t the same as belonging.'),
          ]),
        ],
        'Thought about keeping a promise when breaking it would be easy.',
      ),
    ],
    {
      choices: [
        {
          id: 'sit',
          label: 'Sit back down.',
          then: [
            N(
              'You sit down on the reindeer skin. After a while the snowflakes close the road again, as if disappointed.',
            ),
            N('The stone goes quiet. Your Nubbin climbs back inside your coat.'),
          ],
        },
        {
          id: 'turn',
          label: 'Turn your back on the road.',
          then: [
            N(
              'You turn round and face the way you came. Behind you the snowflakes close up, softly, like a door being shut.',
            ),
            N('The stone goes quiet. Your Nubbin climbs back inside your coat.'),
          ],
        },
      ],
    },
  ),
  // ---- A12-17, a12-nubbin = night
  sc(
    'a12-17-rider-night',
    [
      N(
        'The first birds are singing, and the forest has green buds. Out of it comes a fine horse that Gerda knows: it pulled the golden coach.',
      ),
      N('On it rides a girl in a bright red cap. It’s the robber girl.'),
      RG(
        'I got bored at home. I’m off to see the world. North first, and somewhere else if north’s no good.',
      ),
      N(
        'Two wood pigeons ride on her saddle, and they aren’t tied. They could go whenever they liked, and they don’t.',
      ),
      N('You look at the pigeons, and then at her.'),
      RG('They’re not tied any more.'),
      RG('Mostly.', 'think'),
      ...NEWS,
    ],
    [
      ask(
        6,
        'sel',
        'trust can change people',
        'CASEL: Social awareness',
        [
          N(
            'She used to tie everything, and now the pigeons are free and stay anyway. What do you think changed her?',
          ),
        ],
        [
          opt('Being trusted with the Nubbin', [
            N('That’s a thoughtful answer. Being trusted can teach someone to trust.'),
          ]),
          opt('Seeing that things stay if they want to', [
            N('Yes. Your Nubbin came back to you without a rope.'),
          ]),
          opt('She just grew up a bit', [N('That too. People can change as they grow.')]),
        ],
        'Thought about how being trusted can change someone.',
      ),
      note(
        12,
        'literacy',
        'symbols in a story',
        'RL.4.2',
        [
          N(
            'The black thread is a symbol: a small thing that stands for something big. Hers stands for remembering him.',
          ),
          N(
            'It’s all right to feel sad that the raven died. Remembering him, as his sweetheart does, is a way of keeping him close.',
          ),
        ],
        'Learned what a symbol is, and talked about how remembering helps when someone dies.',
      ),
    ],
    { choices: NEWS_CHOICES },
  ),
  // ---- A12-18, keptStone
  sc(
    'a12-18-pocket',
    [
      GR('Lodger. Why is your hand always on your pocket?', 'think'),
      N('You look down, and it is. You hadn’t noticed.'),
      GR(
        'Kay kept his hand on that burning-glass of his, all that last winter. I’d not like to see it again.',
        'sad',
      ),
    ],
    [
      ask(
        2,
        'sel',
        'noticing your habits',
        'CASEL: Self-awareness',
        [
          N(
            'Sometimes we do things without noticing, like keeping a hand on something. Why might it help to notice?',
          ),
        ],
        [
          opt('So I can choose, not just do it', [
            N('That’s a wise answer. Noticing a habit gives you the choice back.'),
          ]),
          opt('It doesn’t matter', [N('Some habits don’t. Grandmother thinks this one might.')]),
          opt('To understand how I feel', [
            N('Yes. Habits can be clues to what we’re worried about.'),
          ]),
        ],
        'Thought about noticing habits and what they can tell us.',
      ),
    ],
    {
      choices: [
        {
          id: 'habit',
          label: '“Habit.”',
          then: [
            GR('A habit’s only a thing we’ve stopped noticing. Notice it, then. That’s all I ask.'),
          ],
        },
        {
          id: 'keeping',
          label: '“Something I’m keeping.”',
          then: [
            GR(
              'Keeping is fine. Just make sure it’s you doing the keeping, and not the other way about.',
              'soft',
            ),
          ],
        },
        {
          id: 'hand',
          label: 'Say nothing. Take your hand out of your pocket.',
          then: [
            N(
              'You take your hand out. It’s cold, and Grandmother holds it in both of hers until it isn’t.',
            ),
          ],
        },
      ],
    },
  ),
  // ---- A12-18, complete (night)
  sc(
    'a12-18-complete-night',
    [
      N(
        'A wood pigeon comes down out of the sky and lands on the roses in the gutter. Nothing is tied to its leg, and it stays.',
      ),
      N(
        'It might be one of the robber girl’s, and it might not. Either way, nobody tied it, and it chose this.',
      ),
      N(
        'Your Nubbin, in its red cap, sits down beside it, and they look out over the rooftops together.',
      ),
      ...END,
      N(
        'You think of the night you trusted someone with your friend. It came back, and so, it seems, did something else.',
      ),
    ],
    [
      ask(
        2,
        'sel',
        'freedom and friendship',
        'CASEL: Social awareness',
        [
          N(
            'Nobody tied the pigeon, and it stays. What’s the difference between holding on to a friend and a friend choosing to stay?',
          ),
        ],
        [
          opt('A friend who chooses is a real friend', [
            N('That’s a fair answer. Choosing to stay means something.'),
          ]),
          opt('Holding on is safer', [
            N('It can feel safer. But the robber girl found that untied things can stay too.'),
          ]),
          opt('Trust is the difference', [N('A wise answer. Trust is what lets the rope go.')]),
        ],
        'Thought about freedom, trust and friendship.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A12_READER: EduQuest[] = [
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
  Q18,
];

/** Reader versions of every scene in A12_VARIANTS. */
export const EDU_A12_READER_VARIANTS: EduScene[] = A12_READER_VARIANTS;

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  'edu:count:snowflake-arms:6',
  'edu:breathe:slow:4',
  'edu:hum:tune:slow',
];
