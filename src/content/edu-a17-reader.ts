/**
 * The Learning Grove, reader band (ages 7–10): Atlas page A17, The Camphor Tree (*My Neighbor
 * Totoro*, Japan).
 *
 * Source: atlas-a17.ts (ATLAS_A17 and A17_VARIANTS). One EduScene per original scene (every step
 * scene, every done scene, every complete scene and every variant), id `reader:<original id>`,
 * with every choice kept under its original id and `set` flag (`a17-tunnel` = hunt | wait).
 *
 * What it teaches (outline: how an acorn becomes a tree, and why you wait for seeds; camphor
 * trees (*kusunoki*) and old trees honoured at shrines; the Japanese countryside of the 1950s,
 * with its rice fields, buses and telegrams; family words such as *onee-chan* and *obaa-chan*;
 * the rainy season): the life cycle of an oak and what a seed holds, why the camphor is an
 * evergreen with strong-smelling leaves, forests and rice paddies in Japan, the rainy season
 * (*tsuyu*), the Moon and its phases, sound and vibration, light and shadow, friction and
 * downhill motion, steam, how a telegram and a crank telephone worked, how mail travelled,
 * tell-the-time and equal-groups sums, simile and metaphor, vocabulary, and a think question in
 * every quest (waiting, being brave all the time, saying sorry, accepting comfort, believing a
 * friend).
 *
 * Care notes kept (outline and script):
 * - Mrs Kusakabe’s illness is never named; it is “a cold”, and she is always getting better.
 *   Mei lost (A17-13) is kept short, and the lesson is what to do when lost.
 * - The Jizo statues and the shrine are shown with respect, as ordinary parts of Japanese life.
 *   Nobody plays on them; the bow to the tree is narration, never a choice or a task. The shared
 *   family bath is not described; steam is taught from the kettle-and-bath idea in general.
 * - Customs (shoes off at the step, sliding doors, the hand pump) are everyday life, not quaint.
 *   *Onee-chan* and *obaa-chan* are used correctly (obaa-chan is for any older woman you love).
 *   The countryside stays in one time, the 1950s.
 * - No quotes from the film or either English dub; no song lyrics.
 * - Facts used: Japan is a chain of islands and about two thirds of it is forest; rice grows in
 *   flooded paddies; the rainy season runs from about June into July; camphor trees are
 *   evergreen and their leaves hold a strong-smelling oil; oaks grow from acorns and take
 *   decades to bear acorns of their own; a full Moon comes about every 29½ days; a sound is
 *   a vibration; steam you can see is tiny drops of water; a seed holds a baby plant and its
 *   food; bamboo is a giant grass with hollow stems; a cold is caused by a virus.
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
const SA = say('a17-satsuki');
const ME = say('a17-mei');
const FA = say('a17-father');
const MO = say('a17-mother');
const GR = say('a17-granny');
const KA = say('a17-kanta');
const M = say('moss');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const words = (t: string) => t.trim().split(/\s+/).length;
const fits = (t: string) => words(t) <= 26 && t.length <= 150;

/**
 * Keeps every line within the reader caps (30 words, 160 characters, two sentences): a long
 * line is cut at sentence ends into several lines by the same speaker (the mood stays on the
 * first). `map[i]` is the index of the last piece of original line i, so a lesson’s `after`
 * can follow.
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
      if (last !== undefined && counts[counts.length - 1]! < 2 && fits(`${last} ${sentence}`)) {
        chunks[chunks.length - 1] = `${last} ${sentence}`;
        counts[counts.length - 1]!++;
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

/** One answer option. `best` marks the answer the lesson teaches; think questions have none. */
const o = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply: sp(reply) } : { label, reply: sp(reply) };

/** An ask lesson. */
const ask = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string,
  prompt: Line[],
  options: Opt[],
  parentNote: string,
): Beat => ({
  domain,
  skill,
  standard,
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
  standard: string,
  lines: Line[],
  parentNote: string,
): Beat => ({ domain, skill, standard, kind: 'notice', after, lines: sp(lines), parentNote });

/** A do lesson: the child does something in the Grove. */
const doit = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string,
  check: string,
  lines: Line[],
  parentNote: string,
): Beat => ({ domain, skill, standard, kind: 'do', after, check, lines: sp(lines), parentNote });

/** One reader scene. Lesson ids are `reader:<of>-l<n>`, numbered in play order. */
const sc = (of: string, lines: Line[], beats: Beat[], choices?: Choice[]): EduScene => {
  const cut = split(lines);
  const cutChoices = choices?.map((c) => (c.then ? { ...c, then: sp(c.then) } : c));
  return {
    id: `reader:${of}`,
    of,
    band: 'reader',
    lines: cut.lines,
    ...(cutChoices ? { choices: cutChoices } : {}),
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

/** A choice with its id, label and a short reply. */
const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice =>
  set ? { id, label, set, then } : { id, label, then };

// ================================================================== A17-1 The Old House
const A1: EduQuest = quest(
  'a17-01',
  'The Old House',
  {
    'a17-01-s1': {
      goal: 'Step into the summer page and find Granny at the bus stop.',
      hint: 'Touch the page, then walk down the country road to the bus stop.',
    },
    'a17-01-s2': {
      goal: 'Help the Kusakabes unload the lorry at the old house.',
      hint: 'Carry the boxes from the lorry to the step. Take your boots off before you go in.',
    },
    'a17-01-s3': {
      goal: 'Look at the great tree on the hill with the family.',
      hint: 'Stand in the back garden and look up the hill behind the house.',
    },
  },
  [
    sc(
      'a17-01-road',
      [
        N(
          'Nova’s atlas falls open at a country road in summer. There is a bus stop, green rice fields, and a tree on a hill.',
        ),
        N('The tree is drawn so big that it runs off the top of the page.'),
        N(
          'The page hums under your hand. It is cicadas, thousands of them, and you are standing in the road.',
        ),
        N(
          'An old woman waits at the bus stop in a straw hat. She looks you and your Nubbin up and down.',
        ),
        GR(
          'You’ll be stopping with me for the summer. Good. The girls will call me obaa-chan, and you may as well.',
        ),
        N('A boy in a vest sits on the fence, pretending not to look at you. He is looking.'),
        GR('That’s Kanta, my grandson. Say hello, Kanta.'),
        KA('…lo.'),
        N(
          'Down the road comes a small lorry piled with furniture. Two girls ride in the back, waving at everything.',
        ),
      ],
      [
        notice(
          3,
          'social-studies',
          'Japan is a chain of islands; rice grows in flooded fields called paddies',
          'D2.Geo.2.K-2',
          [
            GR(
              'Look at the rice. We grow it with its feet in water, in flooded fields called paddies.',
            ),
            GR('Japan is a long chain of islands, and in summer the paddies are bright green.'),
          ],
          'Learned that Japan is a chain of islands and that rice grows in flooded fields called paddies.',
        ),
        ask(
          4,
          'literacy',
          'words from other languages: obaa-chan means granny',
          'L.3.4',
          [
            N(
              'Granny says her name for the summer is obaa-chan. It means “granny”, and people use it for any older woman they are fond of.',
            ),
          ],
          [
            o(
              'It is a loving name for an older woman, whether or not she is your own granny.',
              [N('Yes. In Japan the word is a mark of affection as well as family.')],
              true,
            ),
            o('It is a kind of rice.', [
              N('A good guess, with all those rice fields! But no.'),
              N('Obaa-chan means granny, and it is used for any older woman you love.'),
            ]),
            o('It is the name of the bus.', [
              N('Not quite. The bus is only a bus.'),
              N('Obaa-chan means granny, a loving name for an older woman.'),
            ]),
          ],
          'Learned that obaa-chan is a Japanese word for granny, used for any older woman you are fond of.',
        ),
      ],
      [
        ch('wave', 'Wave back.', [
          N(
            'You wave. The smaller girl waves with both arms, so hard she nearly falls out, and the bigger one grabs her dress.',
          ),
        ]),
        ch('ask', 'Ask Granny who they are.', [
          GR(
            'The new family for the old house. A professor and his two girls. Their mother’s in hospital over the hill.',
          ),
        ]),
        ch('kanta', 'Ask Kanta who they are.', [
          KA('Dunno.'),
          N('He knows. He watches the lorry to the turning, and goes red when you notice.'),
        ]),
      ],
    ),
    sc(
      'a17-01-road-done',
      [
        GR('Go on, then. They’ll want hands for all that. I’ll have supper on.'),
        N(
          'The lorry is a small, rattling thing with three wheels, one at the front and two at the back.',
        ),
        N('Your Nubbin is already trotting after it, in the dust.'),
        N('A cloud of cicadas lifts from the hedge as it passes, and settles again behind it.'),
      ],
      [
        ask(
          1,
          'maths',
          'equal groups: 2 groups of 3 make 6',
          '3.OA.A.1',
          [
            N(
              'This little lorry has 3 wheels. If two lorries like it came down the road together, how many wheels would that be?',
            ),
          ],
          [
            o('6 wheels: two groups of 3.', [N('Yes. 3 + 3 = 6, which is 2 × 3.')], true),
            o('5 wheels.', [
              N('Let’s check: one lorry has 3 wheels, and a second lorry has 3 more.'),
              N('3 + 3 = 6. Two groups of 3 make 6.'),
            ]),
            o('9 wheels.', [
              N('9 would be three lorries. Count in threes: 3, then 6.'),
              N('Two lorries have 6 wheels.'),
            ]),
          ],
          'Used equal groups to find that two lorries with 3 wheels each have 6 wheels.',
        ),
      ],
    ),
    sc(
      'a17-01-unload',
      [
        N(
          'The old house sits back from the road behind a hedge: a wooden house, a little tall, with a porch at one side.',
        ),
        N(
          'A man in round glasses lifts a chest off the lorry. He hands you the other end as if he’d been expecting you.',
        ),
        FA('Oh, hello! Are you from next door? Wonderful. Mind the step, it bites.'),
        N(
          'At the step everybody slips their shoes off and lines them up. Your Nubbin has no shoes, but it waits anyway.',
        ),
        SA('Mei! The porch post is rotten! Look, it wobbles!', 'happy'),
        ME('It’s rotten! It’s going to fall down!', 'happy'),
        N(
          'They push the post together, shrieking, and run off. Something drops off the porch roof and bounces at your feet: an acorn.',
        ),
        ME('Acorns! Onee-chan, there are acorns!'),
        N(
          'There are no oaks anywhere near the house. Your Nubbin looks up at the roof, and keeps looking.',
        ),
      ],
      [
        notice(
          3,
          'social-studies',
          'taking shoes off at the step keeps floors clean and shows respect',
          'D2.Civ.8.K-2',
          [
            N('In Japan, shoes come off in the entrance hall, called the genkan, and stay there.'),
            N(
              'Many floors are for sitting and sleeping on, so keeping them clean is a way of being considerate.',
            ),
          ],
          'Learned that taking shoes off at the genkan is an everyday custom that keeps floors clean and shows consideration.',
        ),
        ask(
          4,
          'science',
          'why the porch post is rotten: fungi break down damp wood slowly',
          '2-ESS1-1',
          [N('The porch post is rotten and wobbly. What most likely made it so?')],
          [
            o(
              'Years of damp, which let fungi slowly break the wood down.',
              [
                N(
                  'Yes. Rot is slow. A damp post that nobody has mended for years is perfect for fungi.',
                ),
              ],
              true,
            ),
            o('The girls pushing it for a minute.', [
              N('A push can make a rotten post wobble, but it was already weak.'),
              N('The weakness came slowly, from damp and fungi.'),
            ]),
            o('It was built wobbly.', [
              N('Possibly, but a sound post of good wood does not go wobbly on its own.'),
              N('Slow rot from damp and fungi is the usual cause.'),
            ]),
          ],
          'Learned that wood rots slowly when it stays damp, because fungi break it down.',
        ),
      ],
      [
        ch('pocket', 'Put the acorn in your pocket.', [
          N(
            'It sits in your pocket all afternoon, small and smooth. Every so often you check it is still there.',
          ),
        ]),
        ch('mei', 'Give it to Mei.', [
          ME('Thank you! Now I’ve got two.', 'happy'),
          N('She puts both in her pocket and looks up at the roof, the same way your Nubbin does.'),
        ]),
        ch('leave', 'Leave it where it fell.', [
          N('You leave it on the step. When you come back with the next box, it has gone.'),
        ]),
      ],
    ),
    sc(
      'a17-01-unload-done',
      [
        FA(
          'That’s the last of it. Thank you. Now, Satsuki, Mei, which of you wants to find the well?',
        ),
        N('Both of them do, at once, and so does your Nubbin.'),
        N(
          'Three small people each take a step towards the back garden, and stop, and look at each other.',
        ),
        N('Nobody wants to be second to the well.'),
      ],
      [
        ask(
          2,
          'sel',
          'a think question: what is a fair way to decide who goes first?',
          'CASEL: Responsible decision-making',
          [
            N(
              'Three of them each want to be first to the well. What would be a fair way to decide? Think about it, and choose the one that feels right.',
            ),
          ],
          [
            o('Take turns, and draw lots for the order.', [
              N(
                'That’s a fair answer. Drawing lots means luck decides, so nobody can say it was unkind.',
              ),
              N('Satsuki would nod at that.'),
            ]),
            o('The youngest goes first.', [
              N('That’s a fair answer, too. It says that smaller people deserve a chance first.'),
              N('Mei would be very pleased with it.'),
            ]),
            o('Everyone goes together.', [
              N('That’s a fair answer. Nobody is first, and nobody is left behind.'),
              N('It would be a noisy trip to the well, but a happy one.'),
            ]),
          ],
          'Thought about fair ways to decide who goes first and gave reasons.',
        ),
      ],
    ),
    sc(
      'a17-01-tree',
      [
        N('Behind the house the ground rises into woods, and out of the woods rises the tree.'),
        N('It is the biggest thing you have ever seen. Not the biggest tree: the biggest thing.'),
        SA('Dad, what kind of tree is that?'),
        FA(
          'A camphor. Kusunoki. It must be very old. Older than the house, older than the village, I should think.',
        ),
        ME('It’s the biggest in the world.'),
        FA('Very possibly, Mei.'),
        N(
          'The wind comes down the hill, and the whole tree moves at once, slowly, like something breathing.',
        ),
        N('Your Nubbin sits down in the grass and looks at it with its mouth a little open.'),
      ],
      [
        notice(
          4,
          'science',
          'camphor trees are evergreen, and their leaves hold a strong-smelling oil',
          '4-LS1-1',
          [
            FA('A camphor tree keeps its leaves all year, so it is called an evergreen.'),
            FA(
              'Crush a leaf and you’ll smell it. The oil in the leaves is sharp and clean, and bugs don’t care for it.',
            ),
          ],
          'Learned that camphor trees are evergreen and that the strong-smelling oil in their leaves helps keep bugs away.',
        ),
        ask(
          6,
          'literacy',
          'recognising a simile: like something breathing',
          'L.4.5',
          [
            N(
              '“The whole tree moves at once, slowly, like something breathing.” What is “like something breathing” doing here?',
            ),
          ],
          [
            o(
              'It compares the tree to a living thing, to show how slow and alive it feels.',
              [N('Yes. That is a simile: it uses “like” to compare two things.')],
              true,
            ),
            o('It says the tree really is breathing.', [
              N('It is only an image. The tree does not really breathe like us.'),
              N('A simile uses “like” or “as” to compare. This one makes the tree feel alive.'),
            ]),
            o('It is a fact about camphor trees.', [
              N('It is not a fact, but a picture the writer paints.'),
              N('A simile compares two things with “like” or “as”.'),
            ]),
          ],
          'Identified a simile and what it does: it compares a tree to something breathing.',
        ),
      ],
    ),
    sc(
      'a17-01-complete',
      [
        N(
          'At dusk you go back through the gap in the hedge to Granny’s, and take your boots off at her step.',
        ),
        N(
          'Supper is rice, pickles and a fish each. Granny sets out three plates with two pickles on each.',
        ),
        N('The cicadas stop all at once when the frogs start.'),
        GR('The old house has stood empty a long while. It’ll be glad of children.'),
        N(
          'Across the hedge, a window is lit in the old house. Your Nubbin watches the dark one above it, at the top of the stairs.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'equal groups: 3 plates with 2 pickles each',
          '3.OA.A.1',
          [
            N(
              'Granny puts 2 pickles on each of 3 plates. How many pickles has she put out in all?',
            ),
          ],
          [
            o('6 pickles.', [N('Yes. Three groups of 2 is 2 + 2 + 2 = 6, or 3 × 2.')], true),
            o('5 pickles.', [
              N('Let’s count again: 2 on the first plate, 2 on the second, 2 on the third.'),
              N('2 + 2 + 2 = 6 pickles.'),
            ]),
            o('8 pickles.', [
              N('8 would need four plates. Here there are three.'),
              N('Three plates with 2 each makes 6.'),
            ]),
          ],
          'Used equal groups to find that 3 plates with 2 pickles each hold 6 pickles.',
        ),
      ],
    ),
  ],
  [
    gl('paddies', 'Flooded fields where rice is grown.', 'a17-01-road'),
    gl(
      'obaa-chan',
      'A Japanese word for granny, used for any older woman you are fond of.',
      'a17-01-road',
    ),
    gl(
      'genkan',
      'The entrance hall of a Japanese house, where shoes are taken off.',
      'a17-01-unload',
    ),
    gl('evergreen', 'A tree that keeps its leaves all year round.', 'a17-01-tree'),
  ],
);

// ================================================================== A17-2 Soot Sprites
const A2: EduQuest = quest(
  'a17-02',
  'Soot Sprites',
  {
    'a17-02-s1': {
      goal: 'Find the stairs up to the dark room at the top of the house.',
      hint: 'The stairs are behind a plain door in the kitchen. Take a lantern up.',
    },
    'a17-02-s2': {
      goal: 'Ask Granny what the black things are.',
      hint: 'Granny has come over to help clean. Find her on the porch with the rags.',
    },
  },
  [
    sc(
      'a17-02-stairs',
      [
        SA('There’s a window up top, but we can’t find any stairs. Will you help us look?'),
        N(
          'They aren’t in the hall, or behind any sliding door. Your Nubbin finds them: behind a plain wooden door in the kitchen.',
        ),
        N('The stairs are steep and narrow, and at the top there is only dark.'),
        ME('You go first, Onee-chan.'),
        SA('No, you.'),
        N(
          'In the end they go up together, side by side, which the stairs are not wide enough for. You follow with the lantern.',
        ),
        N(
          'At the top something rustles. Dozens of small black things scatter from the light, like soot with somewhere to be.',
        ),
        N('They pour into the cracks in the boards, and are gone.'),
        ME('I’ll catch one!'),
      ],
      [
        ask(
          6,
          'science',
          'we see things when light bounces off them into our eyes',
          '1-PS4-2',
          [
            N(
              'You only see the small black things when the lantern shines on them. Why does the light help you see them?',
            ),
          ],
          [
            o(
              'Light bounces off them and into your eyes.',
              [
                N(
                  'Yes. We see an object when light from it reaches our eyes. No light, nothing to see.',
                ),
              ],
              true,
            ),
            o('The lantern makes the sprites move.', [
              N('They do scatter, but that’s fright, not the light’s doing.'),
              N('We see because light bounces off them into our eyes.'),
            ]),
            o('Your eyes make their own light.', [
              N('Eyes only catch light. They don’t make any.'),
              N('Light bounces off the sprites and into your eyes, so you see them.'),
            ]),
          ],
          'Learned that we see things when light bounces off them and enters our eyes.',
        ),
        ask(
          5,
          'sel',
          'going together makes it easier to be brave',
          'CASEL: Self-management',
          [
            N(
              'Both girls say “you go first”, and then climb the stairs together. What does that tell us about being brave?',
            ),
          ],
          [
            o(
              'It’s easier to be brave with someone beside you.',
              [N('Yes. Courage grows when we’re not alone.')],
              true,
            ),
            o('Brave people never feel scared.', [
              N('Brave people often feel scared, and do it anyway.'),
              N('Going together is what made the stairs easier.'),
            ]),
            o('You should always go first.', [
              N('Someone has to go first sometimes, but nobody has to do it alone.'),
              N('Sharing the fright makes it smaller.'),
            ]),
          ],
          'Thought about how company makes it easier to be brave.',
        ),
      ],
      [
        ch('lantern', 'Hold the lantern high, so she can see.', [
          N(
            'You lift the lantern. Mei slaps both hands flat on the boards, very pleased with herself, and holds them up.',
          ),
        ]),
        ch('still', 'Sit still on the top stair and wait.', [
          N(
            'You sit down on the top stair, and the room goes quiet. After a while, one small black thing peeps out of a crack.',
          ),
          N('Mei pounces. She holds her hands up, very pleased with herself.'),
        ]),
      ],
    ),
    sc(
      'a17-02-stairs-done',
      [
        N('Her hands are empty. Her palms are black, as if she had patted a stove.'),
        ME('I got one! It got away. Look, I’ve got its black on me!', 'happy'),
        SA('Mei, your feet are black too!'),
        N(
          'The black comes off on the boards, on the sleeve of her dress, and on your Nubbin, which has been leaning on her.',
        ),
        N('A fine black powder, as light as breath, like the dust that gathers in a chimney.'),
      ],
      [
        ask(
          4,
          'literacy',
          'vocabulary: soot and scatter',
          'L.3.4',
          [
            N(
              'Soot is the fine black powder left behind by smoke, and to scatter is to rush off in every direction. Which sentence uses “scatter” correctly?',
            ),
          ],
          [
            o(
              'The pigeons scatter when the dog runs at them.',
              [N('Yes. The pigeons rush off in all directions.')],
              true,
            ),
            o('She will scatter her book on the shelf.', [
              N('Not quite. You place a book on a shelf.'),
              N('Scatter means to spread or rush off in every direction, like startled pigeons.'),
            ]),
            o('Soot will scatter the tea.', [
              N('Not quite. Soot is black powder, and tea is something you drink.'),
              N('Scatter means to spread or rush off in every direction.'),
            ]),
          ],
          'Learned the meanings of soot and scatter and used scatter in a sentence.',
        ),
      ],
    ),
    sc(
      'a17-02-granny',
      [
        N(
          'Granny has come over with rags and a bucket to help the family clean. Mei shows her the black hands and feet.',
        ),
        ME('Obaa-chan, there are black things in our house! Little round ones! They ran away!'),
        GR('Soot sprites, were they? Well I never. I saw them myself, when I was your age.'),
        SA('Really? Are they bad?', 'shock'),
        GR('Bad? No. They live in empty houses, in the dust and the dark, and they like it quiet.'),
        GR('When people come back, they move on, one night, and nobody sees them go.'),
        GR(
          'So laugh a lot, and live here properly, and they’ll take the hint. They don’t care for a cheerful house.',
        ),
        ME('I’ll laugh. I’m very good at it.'),
        N('A face appears over the hedge: Kanta, holding a basket his mother has sent.'),
        KA('Your house is haunted!'),
        N('He drops the basket on the step and runs, as fast as he can go.'),
      ],
      [
        notice(
          2,
          'social-studies',
          'oral history: old stories are passed down by word of mouth',
          'D2.His.2.K-2',
          [
            GR('My own granny told me about them, and her granny told her.'),
            GR(
              'Stories get handed down like that, mouth to ear. Nobody writes them down, and they last for years anyway.',
            ),
          ],
          'Learned that stories can be handed down by word of mouth from one generation to the next.',
        ),
        ask(
          6,
          'sel',
          'a think question: why does laughing make scary things feel smaller?',
          'CASEL: Self-management',
          [
            N(
              'Granny says a cheerful house makes the sprites go. Why might laughing and company make a scary thing feel smaller? Think about it.',
            ),
          ],
          [
            o('Because when we laugh our bodies relax.', [
              N(
                'That’s a fair answer. A laugh loosens tight shoulders, and a loose body feels braver.',
              ),
              N('Granny would say you’d noticed something true.'),
            ]),
            o('Because we aren’t alone with it.', [
              N('That’s a fair answer. A fear shared with a friend is lighter to carry.'),
              N('Satsuki would agree.'),
            ]),
            o('Because the scary thing hears us and leaves.', [
              N(
                'That’s a fair answer, and a lovely one. In stories, noise and cheer do drive shadows away.',
              ),
              N('Real fears often shrink the same way, though, when we aren’t alone with them.'),
            ]),
          ],
          'Thought about why laughing and being together can make fear feel smaller.',
        ),
      ],
      [
        ch('call', 'Call after him: “Thank you for the basket!”', [
          N('Kanta runs faster. Granny shakes her head at the hedge.'),
          GR('He has manners. He keeps them somewhere safe.'),
        ]),
        ch('laugh', 'Laugh. It’s a lovely haunted house.', [
          SA('It is, isn’t it? I always wanted to live in a haunted house.', 'happy'),
          ME('Me too! I wanted it first!'),
        ]),
        ch('quiet', 'Say nothing and pick up the basket.', [
          N('Under the cloth there are rice cakes, still warm. Granny looks at them and sighs.'),
          GR('His mother sent those. He’ll have eaten one.'),
        ]),
      ],
    ),
    sc(
      'a17-02-granny-done',
      [
        GR('Now. Rags. That floor won’t clean itself, and the sprites won’t do it either.'),
        N('She wrings a rag out until it is only damp, and hands it to Satsuki.'),
        GR('Damp, not wet, and not dry. A dry rag only flings the dust back in the air.'),
        N('Soon the whole house smells of soap and wet wood.'),
      ],
      [
        notice(
          2,
          'health',
          'dust is made of tiny bits; a damp cloth traps it, and we wash our hands after cleaning',
          'CASEL: Self-management',
          [
            GR(
              'Dust is only tiny bits of dirt, fluff and flakes of skin. A damp cloth traps them, and a dry one flicks them about.',
            ),
            GR('That’s why we wash our hands when we’ve done, and open the windows while we work.'),
          ],
          'Learned that a damp cloth traps dust, and that washing hands after cleaning keeps us healthy.',
        ),
      ],
    ),
    sc(
      'a17-02-complete',
      [
        N(
          'You all clean until dusk. The girls run the rags down the long boards in a race, bottoms in the air.',
        ),
        N('Your Nubbin rinses the rags in the bucket by the hand pump, mostly by sitting in it.'),
        N(
          'Every so often, in a corner, something small and black watches you all. Nobody minds any more.',
        ),
        GR('There. A house with its windows open. That’s more like it.'),
      ],
      [
        ask(
          1,
          'science',
          'a hand pump changes the movement of an arm into the lifting of water',
          '4-PS3-4',
          [
            N(
              'At the hand pump, Satsuki pushes the handle up and down and water comes out of the spout. What is the pump doing?',
            ),
          ],
          [
            o(
              'It turns the movement of her arm into the lifting of water.',
              [
                N(
                  'Yes. A pump is a device that changes one kind of energy, the push of an arm, into another, moving water.',
                ),
              ],
              true,
            ),
            o('It makes water out of air.', [
              N('The water was already underground, in the well.'),
              N('The pump uses her arm’s movement to lift it.'),
            ]),
            o('It heats the water.', [
              N('Pumped well water is usually cold.'),
              N('The pump changes the movement of an arm into the lifting of water.'),
            ]),
          ],
          'Learned that a hand pump changes the movement of an arm into the lifting of water.',
        ),
      ],
    ),
  ],
  [
    gl('soot', 'The fine black powder left behind by smoke.', 'a17-02-stairs-done'),
    gl('scatter', 'To rush off, or spread out, in every direction.', 'a17-02-stairs-done'),
  ],
);

// ================================================================== A17-3 The Bath in the Storm
const A3: EduQuest = quest(
  'a17-03',
  'The Bath in the Storm',
  {
    'a17-03-s1': {
      goal: 'Help the family slide the rain shutters shut before the storm.',
      hint: 'Granny sent you over. Pull each wooden shutter along its groove until the house is closed.',
    },
    'a17-03-s2': {
      goal: 'Wait in the main room while the family has their bath.',
      hint: 'Sit by the low table. When Mr Kusakabe calls out, join in.',
    },
    'a17-03-s3': {
      goal: 'Watch from Granny’s step when the wind drops.',
      hint: 'Go home through the hedge, then sit on Granny’s step and look at the hill.',
    },
  },
  [
    sc(
      'a17-03-shutters',
      [
        N(
          'In the evening the wind gets up. The rice fields go silver, then dark, as the gusts run across them.',
        ),
        GR('Go and help them with the shutters. A professor won’t know which way they slide.'),
        N(
          'At the old house, Mr Kusakabe is pulling at a rain shutter that is stuck halfway along its groove.',
        ),
        FA('Ah! Reinforcements. I think it slides this way. Or possibly the other.'),
        N(
          'You lift it a little and it runs, rattling, all the way along. Then the next one, and the next, until the house is shut.',
        ),
        N('There are nine shutters in all. You slide five, and Mr Kusakabe does the rest.'),
        N(
          'The wind finds every gap anyway. The boards creak, and the house leans and groans like a ship.',
        ),
        ME('Dad, the house is going to fall down.', 'sad'),
        FA('It’s only stretching, Mei. Old houses do.'),
      ],
      [
        ask(
          5,
          'maths',
          'subtraction within 20: 9 − 5 = 4',
          '2.OA.A.1',
          [N('There are 9 shutters, and you slide 5 of them. How many does Mr Kusakabe slide?')],
          [
            o('4 shutters.', [N('Yes. 9 − 5 = 4.')], true),
            o('5 shutters.', [
              N('Let’s count: 9 shutters, take away the 5 you slid.'),
              N('9 − 5 = 4 for Mr Kusakabe.'),
            ]),
            o('14 shutters.', [
              N('14 is 9 + 5, which would be adding. We are taking away.'),
              N('9 − 5 = 4 shutters for him.'),
            ]),
          ],
          'Solved a take-away word problem within 20: 9 shutters, 5 slid by you, 4 by him.',
        ),
        ask(
          7,
          'science',
          'lifting a stuck shutter reduces friction so the push can move it',
          '3-PS2-1',
          [
            N(
              'The shutter was stuck until you lifted it a little, and then it slid all the way. Why did lifting help?',
            ),
          ],
          [
            o(
              'Lifting took weight off the groove, so there was less friction and your push could win.',
              [
                N(
                  'Yes. Friction pushes against movement. Less friction means the same push can move it.',
                ),
              ],
              true,
            ),
            o('Lifting made the shutter lighter in the air for ever.', [
              N('It only took some weight off the groove for a moment.'),
              N('That was enough to cut the friction so your push could win.'),
            ]),
            o('The wind pushed it for you.', [
              N('The wind was pushing the other way, in fact.'),
              N('Lifting cut the friction in the groove, and your push moved it.'),
            ]),
          ],
          'Learned that friction works against movement, and that lifting a stuck shutter cuts it.',
        ),
      ],
    ),
    sc(
      'a17-03-shutters-done',
      [
        FA(
          'Stay till the wind drops. Granny won’t mind. The bath’s nearly hot, and we’ve got plenty of tea.',
        ),
        N('Your Nubbin sits by the stove in the kitchen and watches the shutters jump.'),
        N('The old house stretches and settles round you, creaking in a dozen places.'),
        FA('See? It’s not falling. It’s only getting comfortable.'),
      ],
      [
        ask(
          3,
          'literacy',
          'metaphor: a house that is “stretching”',
          'L.4.5',
          [
            N(
              'Mr Kusakabe says the house is “only stretching”. Houses don’t really stretch like people. What is he doing with the word?',
            ),
          ],
          [
            o(
              'Using a metaphor, to describe the creaking as if the house were alive.',
              [
                N(
                  'Yes. And there’s a true fact underneath: old wooden beams do creak as they shift with changes in damp and temperature.',
                ),
              ],
              true,
            ),
            o('Telling a lie to scare Mei.', [
              N('No, he is trying to comfort her, not frighten her.'),
              N(
                'He is using a metaphor, talking about the house as if it were a creature stretching.',
              ),
            ]),
            o('Teaching a lesson about exercise.', [
              N('Ha! Not quite.'),
              N('He is using a metaphor to make the creaks sound friendly.'),
            ]),
          ],
          'Recognised a metaphor (a house “stretching”) and the true idea beneath it: wood shifts as it dries and warms.',
        ),
      ],
    ),
    sc(
      'a17-03-bath',
      [
        N(
          'The family take their bath at the back of the house, in the bathhouse. You wait in the main room with your Nubbin, by the low table.',
        ),
        N('A gust hits the house. Something bangs outside, and the lamp swings on its cord.'),
        ME('Dad! Dad, I heard something!', 'shock'),
        SA('So did I. Is it the black things? Are they coming back?', 'shock'),
        FA('Shall I tell you the best thing to do when you’re frightened?', 'think'),
        FA(
          'Laugh. As loud as you can. Then anything listening will think we’re far too jolly to bother with.',
        ),
        N(
          'Steam drifts under the door. From the bathhouse comes the biggest, silliest laugh you have ever heard from a grown man, and then two small ones.',
        ),
      ],
      [
        ask(
          5,
          'sel',
          'a think question: does laughing really chase fear away?',
          'CASEL: Self-management',
          [
            N(
              'Mr Kusakabe says laughing chases fright away. Does it really work? What else helps when you are scared? Think about it.',
            ),
          ],
          [
            o('Yes, laughing makes my body feel calmer.', [
              N(
                'That’s a fair answer. A big laugh does loosen the body, and a loose body feels less afraid.',
              ),
              N('Mr Kusakabe would be glad you agreed.'),
            ]),
            o('Not really, but being with people does.', [
              N('That’s a fair answer. It may be the company that helps, as much as the laughing.'),
              N('Either way, the girls aren’t alone, and that matters.'),
            ]),
            o('It helps, but so does telling a grown-up.', [
              N('That’s a fair answer. Mei told her father what she heard, and that was brave.'),
              N('Laughing and telling someone together make a good pair.'),
            ]),
          ],
          'Thought about whether laughing helps with fear and what else helps.',
        ),
        ask(
          6,
          'science',
          'steam you can see is tiny drops of water that formed when hot water vapour met cooler air',
          '2-PS1-4',
          [
            N(
              'Steam drifts under the door. Hot bath water gives off invisible water vapour. What turns it into the steam you can see?',
            ),
          ],
          [
            o(
              'The vapour meets cooler air and turns back into tiny drops of water.',
              [
                N(
                  'Yes. Cooling turns the vapour into drops, and the drops make the white cloud. It’s a change that can go backwards, too, with heat.',
                ),
              ],
              true,
            ),
            o('The water burns and makes smoke.', [
              N('Nothing is burning. It is not smoke.'),
              N('Cooler air turns the invisible vapour back into tiny drops of water.'),
            ]),
            o('The steam is made of air.', [
              N('Steam is water, not air.'),
              N('Vapour meets cooler air and turns back into tiny water drops.'),
            ]),
          ],
          'Learned that visible steam is tiny drops of water made when hot vapour meets cooler air.',
        ),
      ],
      [
        ch('loud', 'Laugh as loud as you can.', [
          N('You laugh as loud as you can. It sounds ridiculous, which makes you laugh properly.'),
        ]),
        ch('nubbin', 'Tickle your Nubbin until it squeaks.', [
          N(
            'Your Nubbin squeaks and rolls, and you laugh at it, and from the bathhouse three people laugh at you laughing.',
          ),
        ]),
        ch('honk', 'Try to laugh and produce a honk.', [
          N('What comes out is a honk. There is a silence in the bathhouse.'),
          ME('Do it again!', 'happy'),
        ]),
      ],
    ),
    sc(
      'a17-03-bath-done',
      [
        N('The wind blows on. Inside, nobody seems to mind it any more.'),
        N(
          'Mei comes out pink and steaming, wrapped in a towel, and falls asleep on the floor before anybody can stop her.',
        ),
        N('Her father lifts her and carries her to the futon laid out in the next room.'),
        N('She does not stir. The lamp goes down, and the house settles round her.'),
      ],
      [
        notice(
          2,
          'health',
          'children need about nine to twelve hours of sleep, which helps bodies grow and minds learn',
          'CASEL: Self-management',
          [
            FA('Children your age need nine to twelve hours of sleep a night.'),
            FA(
              'Sleep is when a body grows, and a brain sorts out what it learned all day. Mei needs it more than most.',
            ),
          ],
          'Learned that children need about nine to twelve hours of sleep for growing and learning.',
        ),
      ],
    ),
    sc(
      'a17-03-moon',
      [
        N(
          'By the time you go home, the wind has blown itself out. The moon is up, and the fields are wet and shining.',
        ),
        N('You sit on Granny’s step to take your boots off, and don’t get round to it.'),
        N(
          'Your Nubbin is looking at the dark window at the top of the old house stairs, under the eaves.',
        ),
        N('Out of the eaves, something drifts. A thread of black, thin as smoke, and then more.'),
        N(
          'A whole cloud of soot sprites rises over the roof in the moonlight, and floats away up the hill to the camphor tree.',
        ),
        N(
          'In the old house, a window slides open. A small face looks out, then a bigger one beside it.',
        ),
        N('Satsuki sees you on the step. She doesn’t call out; she just lifts her hand.'),
      ],
      [
        ask(
          0,
          'science',
          'a full Moon comes about every 29½ days',
          '1-ESS1-1',
          [
            N(
              'The Moon is bright over the rice fields. A full Moon comes round about once a month. About how many days does the Moon take to go from full to full again?',
            ),
          ],
          [
            o(
              'About 29 and a half days.',
              [
                N(
                  'Yes. The Moon takes about 29½ days to go through all its phases and come back to full.',
                ),
              ],
              true,
            ),
            o('About 7 days.', [
              N('That’s about a quarter of the way round, from full to half.'),
              N('The whole trip from full to full takes about 29½ days.'),
            ]),
            o('A whole year.', [
              N('A year is the Earth’s trip round the Sun.'),
              N('From full Moon to full Moon takes about 29½ days.'),
            ]),
          ],
          'Learned that the Moon takes about 29½ days to go from one full Moon to the next.',
        ),
        ask(
          2,
          'literacy',
          'vocabulary: eaves',
          'L.3.4',
          [
            N(
              'The soot sprites drift out from under the eaves. The eaves are the edges of a roof that hang out beyond the walls. Where are the eaves of a house?',
            ),
          ],
          [
            o(
              'At the bottom edge of the roof, hanging over the walls.',
              [N('Yes. The eaves keep the rain off the walls, which is useful in a rainy season.')],
              true,
            ),
            o('Inside the cellar.', [
              N('The cellar is under the house. Eaves are at the top.'),
              N('Eaves are the edges of the roof that hang out over the walls.'),
            ]),
            o('At the front door.', [
              N('The door is lower down. Eaves are higher.'),
              N('Eaves are the roof’s edges that hang out beyond the walls.'),
            ]),
          ],
          'Learned that the eaves are the overhanging edges of a roof.',
        ),
      ],
      [
        ch('wave', 'Lift your hand back.', [
          N(
            'You lift your hand. Across the hedge, in the moonlight, two people who have seen the same thing agree to say nothing.',
          ),
        ]),
        ch('point', 'Point up the hill, at the tree.', [
          N(
            'You point at the tree. Satsuki nods, very seriously, as if you have both signed something.',
          ),
        ]),
      ],
    ),
    sc(
      'a17-03-complete',
      [
        N(
          'The last of the soot sprites goes into the dark of the tree. The house below is just a house with children in it.',
        ),
        GR(
          'Still up? They’ve gone, have they? Good. They’ll find another empty place. There’s always one.',
          'soft',
        ),
        N(
          'She brings you a cup of barley tea, and sits on the step with you a while without saying anything.',
        ),
        N('You drink it slowly. It tastes of toast.'),
      ],
      [
        notice(
          2,
          'social-studies',
          'barley tea (mugicha) is a popular, caffeine-free tea in Japan, drunk hot or cold',
          'D2.His.2.K-2',
          [
            GR('Mugicha. Roasted barley tea. We make it in summer by the potful.'),
            GR(
              'It has no caffeine, so even children can drink it. Some people have it hot, some cold, and I take it any way it comes.',
            ),
          ],
          'Learned that mugicha is a roasted-barley tea popular in Japan, with no caffeine.',
        ),
      ],
    ),
  ],
  [
    gl('eaves', 'The edges of a roof that hang out beyond the walls.', 'a17-03-moon'),
    gl('friction', 'The rubbing force that slows things down when they touch.', 'a17-03-shutters'),
    gl('corridor', 'A long passage inside a building with rooms off it.', 'a17-04-corridor'),
  ],
);

// ================================================================== A17-4 The Hospital
const A4: EduQuest = quest(
  'a17-04',
  'The Hospital',
  {
    'a17-04-s1': {
      goal: 'Cycle with the family to Shichikokuyama Hospital.',
      hint: 'Borrow Granny’s bicycle and follow Mr Kusakabe along the road past the fields.',
    },
    'a17-04-s2': {
      goal: 'Go in with the family to see Mrs Kusakabe.',
      hint: 'Follow them down the long corridor to the room at the end.',
    },
    'a17-04-s3': {
      goal: 'Wait in the corridor so the family can have a moment together.',
      hint: 'Sit on the bench outside the door. They’ll come out when they’re ready.',
    },
  },
  [
    sc(
      'a17-04-ride',
      [
        FA(
          'We’re visiting their mother today. Would you like to come? It’s a long way, but it’s all downhill. Going.',
        ),
        N(
          'Granny lends you her bicycle, which is black and heavy and squeaks on every turn of the pedals.',
        ),
        N(
          'Mr Kusakabe rides in front, with Mei on a little seat on the handlebars and Satsuki on the carrier behind.',
        ),
        N(
          'You set off at ten past nine. The road runs between the rice fields, past a pond, and over the hill. Everywhere there are frogs.',
        ),
        ME('Faster, Dad! Faster than the Keeper!', 'happy'),
      ],
      [
        ask(
          4,
          'science',
          'on a downhill slope, gravity speeds a bicycle up; uphill needs more push',
          '3-PS2-1',
          [
            N(
              'Going downhill, your bicycle runs faster without any extra pedalling. What force is speeding it up?',
            ),
          ],
          [
            o(
              'Gravity, pulling you and the bicycle down the slope.',
              [
                N(
                  'Yes. Gravity pulls everything towards the Earth, and on a slope that pull speeds you up.',
                ),
              ],
              true,
            ),
            o('The wind, always.', [
              N('Wind can help or hinder, but it isn’t what speeds you downhill.'),
              N('Gravity pulls you down the slope, and that speeds you up.'),
            ]),
            o('The squeaking.', [
              N('Ha! The squeak is only a noise.'),
              N('Gravity pulling you down the slope is what speeds you up.'),
            ]),
          ],
          'Learned that gravity pulls a bicycle down a slope and speeds it up.',
        ),
        ask(
          4,
          'maths',
          'time intervals: 9:10 to 9:50 is 40 minutes',
          '3.MD.A.1',
          [N('You set off at 9:10 and reach the hospital at 9:50. How long was the ride?')],
          [
            o('40 minutes.', [N('Yes. From 9:10 to 9:50 is 40 minutes.')], true),
            o('50 minutes.', [
              N('Let’s count on: 9:10 to 9:20 is 10 minutes, and on to 9:50 is 30 more.'),
              N('10 + 30 = 40 minutes.'),
            ]),
            o('1 hour 40 minutes.', [
              N('That would mean arriving after eleven. The clock only moved 40 minutes.'),
              N('From 9:10 to 9:50 is 40 minutes.'),
            ]),
          ],
          'Found a time interval: 9:10 to 9:50 is 40 minutes.',
        ),
      ],
      [
        ch('race', 'Race them to the top of the hill.', [
          N(
            'You stand on the pedals, and Mr Kusakabe stands on his. Both bicycles squeak like geese.',
          ),
          N(
            'He wins, by a wheel, and then has to sit at the top getting his breath back for quite a long time.',
          ),
        ]),
        ch('slow', 'Ride slowly and let them win.', [
          N(
            'You let them win. Mei shouts back at you all the way down the other side, and your Nubbin waves at her from the basket.',
          ),
        ]),
      ],
    ),
    sc(
      'a17-04-ride-done',
      [
        N(
          'Shichikokuyama Hospital is a long white building among pine trees, very quiet, with all its windows open.',
        ),
        SA('This is it. Mum’s window is the third one along. Mei, walk, don’t run.'),
        N('Mei runs.'),
        N('You prop the bicycle against a pine and follow.'),
      ],
      [
        ask(
          1,
          'literacy',
          'word roots: hospital, hotel and hostel all come from the Latin for guest or host',
          'L.3.4',
          [
            N(
              'The word hospital comes from the old Latin word for a guest or host. Which other words come from the same root?',
            ),
          ],
          [
            o(
              'Hotel and hostel.',
              [N('Yes. All three began as places that welcomed guests and looked after them.')],
              true,
            ),
            o('Horse and house.', [
              N('Those look a bit alike, but they have other roots.'),
              N('Hotel and hostel share the guest-and-host root with hospital.'),
            ]),
            o('Hospital stands alone.', [
              N('Words usually have relatives.'),
              N('Hotel and hostel share the guest-and-host root.'),
            ]),
          ],
          'Learned that hospital, hotel and hostel share a Latin root meaning guest or host.',
        ),
      ],
    ),
    sc(
      'a17-04-room',
      [
        N(
          'Mrs Kusakabe is sitting up in bed by the open window. She is pale and tired, and her face is very kind.',
        ),
        ME('Mum!', 'happy'),
        MO('Mei! And Satsuki. Come here, both of you. Let me see you.', 'happy'),
        N(
          'Mei climbs straight on to the bed. Satsuki stands beside it, very upright, until her mother holds out her other arm.',
        ),
        MO(
          'The nurses and doctors are looking after me, and I rest a great deal. The doctor says I’m getting better.',
        ),
        SA('This is the Keeper, from next door. That’s their Nubbin. It follows Mei everywhere.'),
        MO(
          'Thank you for looking after my girls. Somebody has to, while their father’s reading.',
          'happy',
        ),
        FA('I heard that.'),
      ],
      [
        ask(
          3,
          'sel',
          'letting someone comfort us when we are holding big feelings in',
          'CASEL: Self-awareness',
          [
            N(
              'Satsuki stands very upright until her mother holds out an arm. What helps when we are holding big feelings in?',
            ),
          ],
          [
            o(
              'Letting someone close hug us or listen.',
              [N('Yes. A hug or a listening ear helps big feelings settle.')],
              true,
            ),
            o('Standing even straighter.', [
              N('Standing tall can feel safe, but the feeling stays inside.'),
              N('A hug or a listening ear helps it ease.'),
            ]),
            o('Pretending we do not have the feeling.', [
              N('That works for a little while, but feelings tend to grow.'),
              N('Letting someone hug us or listen helps them settle.'),
            ]),
          ],
          'Thought about how comfort from someone close helps big feelings ease.',
        ),
        notice(
          4,
          'health',
          'hospitals help bodies get well with rest, care from nurses and doctors, good food and cleanliness',
          'CASEL: Self-management',
          [
            MO(
              'A hospital helps in lots of small ways. Rest, clean sheets, good food, and nurses who know what to look for.',
            ),
            MO('The body does most of the mending itself. The hospital gives it the best chance.'),
          ],
          'Learned that rest, care and clean surroundings help the body mend itself.',
        ),
      ],
    ),
    sc(
      'a17-04-room-done',
      [
        MO('Soon I’ll come home for a weekend, to see this famous haunted house.'),
        ME('There were soot sprites but they went away! And there’s a great big tree!'),
        MO('A whole weekend. Then a bit longer, and then for good.', 'soft'),
        N(
          'Your Nubbin has put its chin on the edge of the bed. Mrs Kusakabe strokes its head without looking, the way mothers do.',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'equal groups: 3 weekends of 2 days make 6 days',
          '3.OA.A.1',
          [
            N(
              'A weekend is Saturday and Sunday: 2 days. If Mrs Kusakabe comes home for 3 weekends, how many days is that in all?',
            ),
          ],
          [
            o('6 days.', [N('Yes. Three groups of 2 days is 3 × 2 = 6 days.')], true),
            o('5 days.', [
              N('Let’s count: 2 days, then 2 more is 4, then 2 more.'),
              N('2 + 2 + 2 = 6 days.'),
            ]),
            o('9 days.', [
              N('9 would be 3 groups of 3, but a weekend has 2 days.'),
              N('3 weekends of 2 days make 6 days.'),
            ]),
          ],
          'Used equal groups: 3 weekends of 2 days make 6 days.',
        ),
      ],
    ),
    sc(
      'a17-04-corridor',
      [
        N(
          'You go out into the corridor and sit on the bench, with your Nubbin on your knee. The door stays a little open.',
        ),
        N(
          'Through it you can see the window, the pines, and Mrs Kusakabe brushing Satsuki’s hair, slowly, all the way down.',
        ),
        MO(
          'You’ve been looking after everybody, haven’t you. Mei, and your father, and the house.',
          'soft',
        ),
        SA('Somebody has to.'),
        MO('I know. But you can stop sometimes, when I’m home. I’ll take a turn.', 'soft'),
        N('Satsuki doesn’t say anything. She leans back into the brush, with her eyes shut.'),
        N('A nurse goes by with a tray, and smiles at your Nubbin, and doesn’t ask.'),
      ],
      [
        ask(
          3,
          'sel',
          'a think question: when does a family deserve to be left alone?',
          'CASEL: Social awareness',
          [
            N(
              'The door is a little open. Should you shut it gently, or keep sitting quietly? Think about why privacy matters.',
            ),
          ],
          [
            o('Shut it gently, so the moment is only theirs.', [
              N('That’s a fair answer. A closed door says, “this is yours”, without a word.'),
              N('Mrs Kusakabe would be glad of it.'),
            ]),
            o('Keep sitting quietly, and don’t listen.', [
              N('That’s a fair answer. Not listening, and not hurrying them, is a way of respect.'),
              N('You are giving them space either way.'),
            ]),
            o('It does not matter, it is only a door.', [
              N('That’s an honest answer. Some people would not mind at all.'),
              N('But for people holding a tender moment, a little privacy often means a lot.'),
            ]),
          ],
          'Thought about why giving a family private time together is a kindness.',
        ),
        ask(
          3,
          'literacy',
          'motive: why Satsuki says “somebody has to”',
          'RL.3.3',
          [N('When her mother thanks her, Satsuki says, “Somebody has to.” Why does she say it?')],
          [
            o(
              'She has taken on the job of looking after everyone, and feels she must.',
              [
                N(
                  'Yes. Her answer shows how responsible she feels, maybe more than a girl her age should.',
                ),
              ],
              true,
            ),
            o('She does not like her sister.', [
              N('She cares for Mei a great deal.'),
              N(
                'She says it because she feels the job of looking after everyone has fallen to her.',
              ),
            ]),
            o('She wants to be paid.', [
              N('Ha! No.'),
              N('She feels responsible for everyone, and says so plainly.'),
            ]),
          ],
          'Worked out a character’s motive: Satsuki feels responsible for looking after everyone.',
        ),
      ],
      [
        ch('wait', 'Keep waiting. There’s no hurry.', [
          N(
            'You wait. The corridor is cool and smells of soap, and somewhere a clock ticks: a good place to wait.',
          ),
        ]),
        ch('door', 'Get up and pull the door gently to.', [
          N(
            'You pull the door gently to, so it is theirs. Through the wood you hear Mei laugh, and then all three of them.',
          ),
        ]),
      ],
    ),
    sc(
      'a17-04-complete',
      [
        N(
          'On the way home it is uphill, as promised. Everybody walks the bicycles, and nobody minds.',
        ),
        N(
          'Mei falls asleep on the handlebar seat, and her father walks the whole way with one hand on her back.',
        ),
        SA('She looked better than last time. Didn’t she? She looked better.'),
        FA('She did. Much better.', 'soft'),
      ],
      [
        ask(
          2,
          'sel',
          'a caring, honest reply to a worried person',
          'CASEL: Social awareness',
          [
            N(
              'Satsuki asks, “She looked better, didn’t she?” What is a reply that is both honest and caring?',
            ),
          ],
          [
            o(
              '“She did, and the doctor says she’s getting better.”',
              [N('Yes. It is true, and it gives her something solid to hold.')],
              true,
            ),
            o('“Don’t worry about it.”', [
              N('Kind, but it can feel like being brushed aside.'),
              N('Something true and specific, like what the doctor said, helps more.'),
            ]),
            o('“I don’t know.”', [
              N('Honest, but not much comfort on a long walk home.'),
              N('Saying what you do know, that she’s getting better, is honest and caring.'),
            ]),
          ],
          'Chose a reply that is both truthful and comforting for a worried person.',
        ),
      ],
    ),
  ],
  [gl('futon', 'A folding mattress that is laid on the floor to sleep on.', 'a17-03-bath-done')],
);

// ================================================================== A17-5 The Small Ones
const A5: EduQuest = quest(
  'a17-05',
  'The Small Ones',
  {
    'a17-05-s1': {
      goal: 'Keep an eye on Mei in the garden while her father works.',
      hint: 'Sit at the edge of the garden. Mei will find something before you do.',
    },
    'a17-05-s2': {
      goal: 'Crawl after Mei and your Nubbin through the tunnel in the hedge.',
      hint: 'Get down on your elbows and go in after them. Don’t lose sight of Mei’s hat.',
    },
  },
  [
    sc(
      'a17-05-garden',
      [
        N(
          'Satsuki is at school. Mr Kusakabe is at his desk in the room that opens on the garden, surrounded by books.',
        ),
        FA('Would you keep half an eye on Mei? I’m only in here. She’s no trouble. Mostly.'),
        N(
          'Mei is playing in the long grass with a tin bucket, picking up acorns. She has three. Your Nubbin finds four more and gives them to her.',
        ),
        N(
          'Then your Nubbin stops dead, with an acorn in its mouth. It is looking at the grass under the house.',
        ),
        N(
          'Something small and white is walking through the grass. It is about the size of a cat, and you can see the grass through it.',
        ),
        ME('Oh!'),
        N(
          'Behind it comes a second one, bigger, and blue. It has a little sack over its shoulder, and acorns are dribbling out of a hole.',
        ),
        ME('Wait! Wait for me!'),
      ],
      [
        ask(
          2,
          'science',
          'an acorn grows into a seedling, a sapling and then an oak, which takes decades to make acorns of its own',
          '3-LS1-1',
          [
            N(
              'Mei’s bucket is full of acorns. What does an acorn grow into, and how long does it take before the new tree makes acorns itself?',
            ),
          ],
          [
            o(
              'An oak tree, after many years, often twenty to fifty.',
              [
                N(
                  'Yes. Seedling, sapling, tree. An oak is slow, and that is why oaks are treasured.',
                ),
              ],
              true,
            ),
            o('An oak tree, by next week.', [
              N('A seedling can sprout within weeks, but a tree takes much longer.'),
              N('It can be twenty to fifty years before an oak makes acorns of its own.'),
            ]),
            o('A camphor tree.', [
              N('A camphor tree grows from a camphor seed, which is a small round berry.'),
              N('An acorn grows into an oak, which takes many years.'),
            ]),
          ],
          'Learned that an acorn grows into an oak, a slow process that takes many years.',
        ),
        ask(
          2,
          'maths',
          'addition and subtraction within 20: 3 + 4 = 7, then 7 − 2 = 5',
          '2.OA.A.1',
          [
            N(
              'Mei has 3 acorns, and your Nubbin gives her 4 more. Then 2 roll away into the long grass. How many does she have left?',
            ),
          ],
          [
            o('5 acorns.', [N('Yes. 3 + 4 = 7, and 7 − 2 = 5.')], true),
            o('9 acorns.', [
              N('3 + 4 = 7 so far. But then 2 roll away, so we take away.'),
              N('7 − 2 = 5 acorns.'),
            ]),
            o('7 acorns.', [
              N('7 is right before any roll away.'),
              N('After 2 roll away, 7 − 2 = 5 acorns.'),
            ]),
          ],
          'Solved a two-step word problem with adding and taking away within 20.',
        ),
      ],
      [
        ch('call', 'Call to Mr Kusakabe.', [
          Y('Mr Kusakabe? Mei’s… following something.'),
          FA('Is she? Good for her. Don’t let her go out of the garden.', 'happy'),
          N('He doesn’t look up. Mei is already at the end of the garden.'),
        ]),
        ch('follow', 'Follow quietly. Don’t frighten them.', [
          N(
            'You follow on tiptoe. The small ones look back, see Mei and your Nubbin, and walk a little faster.',
          ),
        ]),
      ],
    ),
    sc(
      'a17-05-garden-done',
      [
        N(
          'The two small ones duck under the house and out the other side, into the hedge at the back of the garden.',
        ),
        N('A hedge is a row of bushes grown close together, like a living fence.'),
        ME('They went in there! There’s a tunnel!'),
        N('Your Nubbin is already at the gap, ears up, waiting for you to catch up.'),
      ],
      [
        ask(
          0,
          'literacy',
          'multiple-meaning words: duck',
          'L.3.4',
          [
            N(
              '“The two small ones duck under the house.” Here, duck is a verb. What does it mean? A duck is also a bird, so be careful.',
            ),
          ],
          [
            o(
              'To bend down quickly and go under something.',
              [N('Yes. Duck is a word with two meanings: a bird, and a quick dip down.')],
              true,
            ),
            o('To quack like a bird.', [
              N('A duck the bird does quack, but here the word is something the small ones do.'),
              N('It means to bend down quickly and move under something.'),
            ]),
            o('To fly high.', [
              N('Ducking is the opposite of up high.'),
              N('It means to bend down quickly and move under something.'),
            ]),
          ],
          'Used context to work out which meaning of the word duck fits the sentence.',
        ),
      ],
    ),
    sc(
      'a17-05-hedge',
      [
        N(
          'There is a gap low in the hedge, round as a doorway. Inside it is a green tunnel, roofed with leaves.',
        ),
        N(
          'Mei goes in on her hands and knees without stopping to think. Your Nubbin goes in after her, and you after it.',
        ),
        N(
          'It is a tunnel made for someone Mei’s size. You go on your elbows, with twigs in your hair.',
        ),
        N(
          'The light is green and gold. Somewhere ahead, acorns drop one by one, and Mei picks every one of them up.',
        ),
        ME('Little one! Big little one! Where are you going?'),
        N('The tunnel bends, and bends again. It goes on far longer than the hedge ever could.'),
        N('Then Mei’s yellow hat bobs out of the far end into sunlight, and she is gone.'),
      ],
      [
        ask(
          1,
          'health',
          'safety: tell a grown-up where you are going before you follow something',
          'CASEL: Responsible decision-making',
          [
            N(
              'Mei followed the small ones without telling anyone. What is the safest first step before following something into a tunnel?',
            ),
          ],
          [
            o(
              'Tell a grown-up where you are going.',
              [N('Yes. Then someone always knows where to find you.')],
              true,
            ),
            o('Go as far as you can, as fast as you can.', [
              N('That is exciting, but if you got stuck, nobody would know.'),
              N('Telling a grown-up first is the safest step.'),
            ]),
            o('Wait until nobody is looking.', [
              N('Hiding it makes it harder for people to help you.'),
              N('Telling a grown-up where you are going keeps you safe.'),
            ]),
          ],
          'Chose the safest first step: telling a grown-up where you are going.',
        ),
        ask(
          5,
          'sel',
          'a think question: when is curiosity a good guide, and when should we pause?',
          'CASEL: Responsible decision-making',
          [
            N(
              'Curiosity pulls Mei and your Nubbin into the tunnel. When is curiosity a good guide, and when should we stop and think first? Think about it.',
            ),
          ],
          [
            o('When it is safe, and someone knows where we are.', [
              N('That’s a fair answer. Curiosity is wonderful with a safety net.'),
              N('Mr Kusakabe would add that he knew Mei was in the garden.'),
            ]),
            o('When we are with someone we trust.', [
              N('That’s a fair answer. A trusted friend can say “let’s wait” or “let’s go”.'),
              N('You are following along with Mei, which helps.'),
            ]),
            o('Always, because curiosity finds the best things.', [
              N('That’s a fair answer. Many great discoveries began with curiosity.'),
              N('Even explorers tell someone where they are going before they set off, though.'),
            ]),
          ],
          'Thought about when curiosity is a good guide and when we should stop and think first.',
        ),
      ],
      [
        ch('hurry', 'Hurry after her.', [
          N(
            'You hurry. The tunnel seems to stretch to make room for you, then squeezes you out on to soft moss.',
          ),
        ]),
        ch('nubbin', 'Let your Nubbin lead.', [
          N(
            'You follow your Nubbin’s tail, which knows the way better than you. It brings you out on to soft moss.',
          ),
        ]),
      ],
    ),
    sc(
      'a17-05-complete',
      [
        N(
          'You are in a wood. It is very old and very quiet, and the light comes down in long slanting columns.',
        ),
        N(
          'In front of you there is a tree root as wide as a road, and above it the camphor tree goes up and up, out of sight.',
        ),
        N(
          'In Japan, old shrines often keep a little of the oldest woods around them, left to grow as they please.',
        ),
        N('Mei’s hat is lying on the moss. Mei is not in it.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'about two thirds of Japan is forest, and shrines often protect old woods',
          'D2.Geo.2.K-2',
          [
            N(
              'Japan is a chain of islands, many of them hilly. About how much of the country is covered in forest?',
            ),
          ],
          [
            o(
              'About two thirds.',
              [
                N(
                  'Yes. Forest covers around two thirds of Japan, much of it on steep hills where farming is hard.',
                ),
              ],
              true,
            ),
            o('About one tenth.', [
              N('That would be far too little for a country of so many mountains.'),
              N('It’s about two thirds.'),
            ]),
            o('Almost none.', [
              N('Japan is one of the most forested countries in the world.'),
              N('About two thirds of it is forest.'),
            ]),
          ],
          'Learned that about two thirds of Japan is covered in forest.',
        ),
      ],
    ),
  ],
  [
    gl('hedge', 'A row of bushes grown close together, like a living fence.', 'a17-05-garden-done'),
    gl('duck', 'To bend down quickly and move under something.', 'a17-05-garden-done'),
  ],
);

// ================================================================== A17-6 The Camphor Tree
const A6: EduQuest = quest(
  'a17-06',
  'The Camphor Tree',
  {
    'a17-06-s1': {
      goal: 'Find Mei in the hollow under the camphor tree.',
      hint: 'Look round the roots for a way in. Your Nubbin will find it first.',
    },
    'a17-06-s2': {
      goal: 'Help Satsuki and her father look for the way Mei went.',
      hint: 'Go back to the hedge with the family and let Mei show you.',
    },
    'a17-06-s3': {
      goal: 'Walk up the hill with the family to the camphor tree.',
      hint: 'Follow the path up past the little shrine gate. Stand with the others at the foot of the tree.',
    },
  },
  [
    sc(
      'a17-06-hollow',
      [
        N(
          'Your Nubbin finds the hole: a gap between two roots, big enough for a small girl who wasn’t looking where she was going.',
        ),
        N(
          'You slide down after it, into a hollow under the tree. It is warm and dim, and smells of earth and leaves.',
        ),
        N('Something is breathing. Something very large.'),
        N(
          'A great grey-and-white shape is asleep in the hollow, bigger than Granny’s house. Its ears twitch in its sleep.',
        ),
        N(
          'And on top of it, on its round white stomach, Mei is lying on her front with her chin in her hands.',
        ),
        ME('Shh. He’s asleep. He’s so soft. He told me his name. It’s a big rumbly one.', 'happy'),
        N(
          'The great spirit opens his mouth in a yawn like a gate swinging open. Mei laughs, and he closes it again, and sleeps on.',
        ),
        N(
          'Your Nubbin climbs up his side, very carefully, and curls up next to Mei. The stomach rises and falls under both of them.',
        ),
      ],
      [
        ask(
          1,
          'science',
          'a hollow in an old tree can shelter animals',
          '2-LS4-1',
          [
            N(
              'The hollow under the tree is warm and dim. Why might a hollow in an old tree be a good home for animals?',
            ),
          ],
          [
            o(
              'It gives shelter from weather and from enemies.',
              [
                N(
                  'Yes. Owls, bats, squirrels and insects all use tree hollows. Old trees are full of lodgers.',
                ),
              ],
              true,
            ),
            o('It is the only place they can find food.', [
              N('Hollows are not food stores.'),
              N('They give shelter from weather and from enemies.'),
            ]),
            o('Animals live in hollows only in stories.', [
              N('Many real animals do, from owls to bats.'),
              N('A hollow gives shelter from weather and enemies.'),
            ]),
          ],
          'Learned that a hollow in an old tree shelters animals from weather and enemies.',
        ),
        ask(
          1,
          'literacy',
          'sensory words: warm, dim, smelling of earth and leaves',
          'RL.1.4',
          [
            N(
              '“It is warm and dim, and smells of earth and leaves.” Which senses do those words use?',
            ),
          ],
          [
            o(
              'Touch (warm), sight (dim) and smell.',
              [N('Yes. A good writer gives you the hollow through three senses at once.')],
              true,
            ),
            o('Only sight.', [
              N('“Dim” is sight, but “warm” is touch, and “smells” is smell.'),
              N('Touch, sight and smell are all there.'),
            ]),
            o('Only hearing.', [
              N('Nothing in that line is a sound.'),
              N('It uses touch, sight and smell.'),
            ]),
          ],
          'Identified sensory words (touch, sight, smell) in a description.',
        ),
      ],
      [
        ch('sit', 'Sit at the edge of the hollow and watch.', [
          N(
            'You sit on a root and watch them breathe, all three. The hollow is very warm, and your eyes close for just a moment.',
          ),
        ]),
        ch('touch', 'Reach out and touch his fur.', [
          N(
            'His fur is like warm grass after a long summer. He doesn’t wake, but makes a small noise, like a big drum touched softly.',
          ),
          N(
            'You sit down beside him. It is very warm in the hollow, and your eyes close for just a moment.',
          ),
        ]),
      ],
    ),
    sc(
      'a17-06-hollow-done',
      [
        N('You wake on soft moss in a small clearing in the bamboo. Mei is asleep beside you.'),
        N(
          'Bamboo is a giant grass with hollow stems. Solid rings along each stem make it strong but light.',
        ),
        N(
          'There is no hollow and no tree root. Your Nubbin is sitting up, looking all round, with leaves on its back.',
        ),
        N('Some bamboo grows nearly a metre in a single day, if you could only sit and watch.'),
      ],
      [
        ask(
          1,
          'science',
          'bamboo is a grass with hollow stems strengthened by solid rings',
          '4-LS1-1',
          [N('Bamboo stems are hollow, with solid rings along them. Why is that a clever design?')],
          [
            o(
              'The rings make the stem strong, and the hollows keep it light.',
              [
                N(
                  'Yes. Strong and light together is why bamboo is used for ladders, fishing rods and scaffolding.',
                ),
              ],
              true,
            ),
            o('Hollow stems are weak, and the rings are for decoration.', [
              N('Hollow tubes are surprisingly strong, and the rings add to that.'),
              N('Strong and light, together, is the clever part.'),
            ]),
            o('It is not designed at all.', [
              N(
                'Nobody designed it, but over millions of years the strongest, lightest stems did best.',
              ),
              N('Bamboo’s rings and hollows make it strong and light.'),
            ]),
          ],
          'Learned that bamboo is a grass with hollow stems made strong by solid rings.',
        ),
      ],
    ),
    sc(
      'a17-06-found',
      [
        SA('Mei! Mei! There you are! Dad, they’re here!', 'shock'),
        N(
          'Satsuki is home from school, out of breath, with her father behind her. Mei sits up and rubs her eyes.',
        ),
        ME(
          'There was a big one! Bigger than the house! He had a great big mouth and he went like this!',
        ),
        N(
          'She opens her mouth as wide as it goes. Satsuki looks at you, and you look at your Nubbin, which still has leaves on.',
        ),
        ME('He’s this way. Come on, I’ll show you.'),
        N(
          'Mei leads them back to the hedge and crawls in at the gap. She comes out the other side, into the garden.',
        ),
        N(
          'She tries again further along, and again. Every gap goes straight through to the garden, or nowhere at all.',
        ),
        ME('It was here. It was. I’m not lying.', 'sad'),
        N('Mr Kusakabe crouches down in front of her, so he is the right size to talk to her.'),
        FA(
          'I believe you, Mei. I think the one who looks after this wood let you visit him. Not many people are that lucky.',
          'soft',
        ),
      ],
      [
        ask(
          8,
          'sel',
          'a think question: should we believe someone without proof?',
          'CASEL: Social awareness',
          [
            N(
              'Mei cannot prove her story, and her father believes her anyway. Should we believe someone who has no proof? Think about it.',
            ),
          ],
          [
            o('Yes, if we know they are honest.', [
              N('That’s a fair answer. Trust grows from knowing a person.'),
              N('Mei has never given her father a reason to doubt her.'),
            ]),
            o('We can believe them and still wonder how it happened.', [
              N('That’s a fair answer. Mr Kusakabe does exactly that.'),
              N('He believes her, and doesn’t press her to explain what she can’t.'),
            ]),
            o('No, we should wait for proof.', [
              N('That’s a fair answer. Proof matters when a lot depends on it.'),
              N('Here, though, a four-year-old’s feelings depend on being listened to.'),
            ]),
          ],
          'Thought about when to believe someone who has no proof, and why kindness matters.',
        ),
      ],
    ),
    sc(
      'a17-06-found-done',
      [
        FA('And when somebody lets you visit, you go and say thank you. Come on. All of us.'),
        N('In Japanese, thank you is arigatō, and a bit more politely, arigatō gozaimasu.'),
        N('Please is onegai shimasu, a good thing to know if you want a second helping of rice.'),
        N('Mei takes your hand and pulls you towards the hill.'),
      ],
      [
        ask(
          1,
          'literacy',
          'Japanese words: arigatō means thank you',
          'L.3.4',
          [N('Which of these Japanese words means “thank you”?')],
          [
            o('Arigatō.', [N('Yes. Arigatō, or arigatō gozaimasu to be extra polite.')], true),
            o('Onegai shimasu.', [N('That one is “please”.'), N('“Thank you” is arigatō.')]),
            o('Obaa-chan.', [
              N('That one is a loving name for an older woman.'),
              N('“Thank you” is arigatō.'),
            ]),
          ],
          'Learned that arigatō means thank you in Japanese, and onegai shimasu means please.',
        ),
      ],
    ),
    sc(
      'a17-06-greet',
      [
        N(
          'The path goes up the hill through the wood, past a small stone shrine, to the foot of the camphor tree.',
        ),
        N(
          'Close to, it is too big to see all at once. A thick rope of twisted straw is tied round its trunk, with paper streamers hanging from it.',
        ),
        SA('Dad, why does it have a rope on?'),
        FA(
          'Because it’s a special tree. A very old one, that people have looked after for a very long time.',
        ),
        N(
          'The family stands in a row at the foot of the tree. You stand behind them, with your Nubbin.',
        ),
        N(
          'Mr Kusakabe bows to the tree, and the girls bow with him. He thanks it, out loud, for looking after Mei.',
        ),
        FA('And please go on looking after us, while we live here.'),
        N(
          'Above you the leaves move, all together, though there is no wind. Then the family turns to go home.',
        ),
        N('Behind them, Mei keeps looking back at the hedge at the bottom of the hill.'),
      ],
      [
        notice(
          3,
          'social-studies',
          'in Japan a straw rope called shimenawa marks a very old tree or place as sacred',
          'D2.Civ.8.K-2',
          [
            N(
              'The rope is called a shimenawa. In Japan it marks a very old tree, a rock or a place as special, a place for respect.',
            ),
            N(
              'People bow and say thank you. It is a custom with meaning, not a game, so you only watch.',
            ),
          ],
          'Learned that a shimenawa rope marks a sacred tree or place in Japan, and that people treat it with respect.',
        ),
        ask(
          7,
          'sel',
          'a think question: is waiting a harder choice than searching?',
          'CASEL: Self-management',
          [
            N(
              'You can hunt for the tunnel, or leave it until he wants to be found. Which is harder, searching or waiting? When has waiting worked for you? Think about it.',
            ),
          ],
          [
            o('Waiting is harder, because I want to do something.', [
              N(
                'That’s a fair answer. Waiting is a kind of strength, though it doesn’t look like one.',
              ),
              N('Mei finds it hard, too.'),
            ]),
            o('Searching is harder, because it might not work.', [
              N('That’s a fair answer. Searching can feel hopeful and tiring at the same time.'),
              N('Some things only come when we stop pushing them.'),
            ]),
            o('They are both hard in different ways.', [
              N('That’s a fair answer. Each takes courage of a different kind.'),
              N('Choosing between them is part of the story.'),
            ]),
          ],
          'Thought about whether searching or waiting is harder, and when waiting works.',
        ),
      ],
      [
        ch(
          'hunt',
          'Go back down to the hedge and hunt for the tunnel.',
          [
            N(
              'You go back down and work along the hedge on your knees, gap by gap. Your Nubbin helps, mostly by sitting in the gaps.',
            ),
            N(
              'By dusk you have scratched arms and leaves in your collar, and every gap goes straight through to the garden.',
            ),
            N(
              'There is no tunnel. There is only a hedge, and it is a perfectly ordinary hedge, and it would like you to know that.',
            ),
          ],
          { 'a17-tunnel': 'hunt' },
        ),
        ch(
          'wait',
          'Leave it. He’ll be found when he wants to be.',
          [
            N('You leave the hedge alone. Mei looks at you, and then she leaves it alone too.'),
            ME('He’ll come when he wants. Won’t he.'),
            N(
              'Your Nubbin sits down facing the hill, as if it has decided to be patient on purpose.',
            ),
          ],
          { 'a17-tunnel': 'wait' },
        ),
      ],
    ),
    sc(
      'a17-06-complete',
      [
        N(
          'That night, from Granny’s window, you can see the camphor tree black against the stars.',
        ),
        N(
          'Down in the old house Mei is telling the story again, louder each time. The great spirit gets a little bigger with every telling.',
        ),
        GR('A big one, was it, under the camphor? Hm.', 'think'),
        N(
          'Granny doesn’t say anything else. But she leaves the lamp in the window a little longer than usual.',
        ),
      ],
      [
        ask(
          1,
          'literacy',
          'character feeling: why Mei’s story grows with each telling',
          'RL.3.3',
          [
            N(
              'Each time Mei tells it, the spirit gets a little bigger. What does that tell us about how she feels?',
            ),
          ],
          [
            o(
              'She is so excited that it still feels huge to her.',
              [N('Yes. The size of the story shows the size of the feeling.')],
              true,
            ),
            o('She is trying to trick everyone.', [
              N('Nobody is fooled, and she isn’t trying to be.'),
              N('She is excited, and the spirit still feels huge to her.'),
            ]),
            o('She has forgotten the spirit.', [
              N('If she had forgotten, she wouldn’t keep telling it.'),
              N('She is excited, and the story grows with her feeling.'),
            ]),
          ],
          'Worked out that a story growing with each telling shows how excited a character feels.',
        ),
      ],
    ),
  ],
  [
    gl(
      'hollow',
      'An empty space inside something, like the inside of an old tree.',
      'a17-06-hollow',
    ),
    gl(
      'shimenawa',
      'A thick rope of twisted straw that marks a sacred tree or place in Japan.',
      'a17-06-greet',
    ),
  ],
);

// ================================================================== A17-7 Kanta’s Umbrella
const A7: EduQuest = quest(
  'a17-07',
  'Kanta’s Umbrella',
  {
    'a17-07-s1': {
      goal: 'Walk home from school with Satsuki and Mei.',
      hint: 'Meet them at the school gate and take the road between the fields.',
    },
    'a17-07-s2': {
      goal: 'Help the sisters give Kanta his umbrella back, without embarrassing him.',
      hint: 'Talk it over on the walk home, then take the umbrella round to Granny’s.',
    },
  },
  [
    sc(
      'a17-07-rain',
      [
        N(
          'Granny is busy, so you take Mei to meet Satsuki at the school gate. Halfway home the sky goes dark.',
        ),
        N(
          'The rain comes all at once, the way summer rain does. The road turns to running water in a minute.',
        ),
        SA('This way! Quick!'),
        N(
          'By the side of the road there is a tiny wooden shrine, no bigger than a cupboard, with a roof. Inside stands a small stone Jizo.',
        ),
        N('He wears a red bib. Somebody has left him a flower and a rice ball.'),
        N('At the edge of the roof Satsuki stops, puts her hands together, and bows to him.'),
        SA('Jizo-sama, please may we shelter here a little while, till the rain stops?'),
        N(
          'You bow too, and so does Mei. Then the three of you squeeze in at the very edge of the roof, out of the wet.',
        ),
        N(
          'A boy comes splashing up the road under a huge black umbrella: Kanta. He shoves it at Satsuki, handle first.',
        ),
        KA('Here.', 'angry'),
        N(
          'He runs off into the rain with nothing over his head, his bag held over it instead. It doesn’t help at all.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'weather data by season: Japan’s rainy season, tsuyu, runs from about June into July',
          '3-ESS2-1',
          [
            N(
              'In much of Japan the rainy season, called tsuyu, brings weeks of rain. About when does it come?',
            ),
          ],
          [
            o(
              'From about June into July.',
              [
                N(
                  'Yes. Tsuyu is written with the signs for “plum” and “rain”, because it comes as the plums ripen. The paddies drink it gladly.',
                ),
              ],
              true,
            ),
            o('In the middle of winter.', [
              N('Winter in Japan is cold and often snowy or dry.'),
              N('Tsuyu comes from about June into July.'),
            ]),
            o('All year round.', [
              N('Japan has four seasons, and the rainy season is only one.'),
              N('Tsuyu runs from about June into July.'),
            ]),
          ],
          'Learned that Japan’s rainy season, tsuyu, runs from about June into July.',
        ),
        notice(
          6,
          'social-studies',
          'Jizo statues are guardians of children and travellers, and people treat them with respect',
          'D2.Civ.8.K-2',
          [
            N(
              'Jizo statues stand by roads all over Japan. They watch over children and travellers, and people leave flowers and food.',
            ),
            N(
              'Satsuki asks politely before she shelters. It is how you behave in someone else’s place.',
            ),
          ],
          'Learned about Jizo statues, which watch over children and travellers, and the respect people show them.',
        ),
      ],
    ),
    sc(
      'a17-07-rain-done',
      [
        N(
          'The umbrella is old and patched, with a hole near the top. It is the best thing that has happened all day.',
        ),
        N('Rain drips through the hole in a thin silver line, on to Mei’s nose.'),
        ME('Kanta’s house is haunted too.'),
        SA('Mei.'),
      ],
      [
        ask(
          1,
          'science',
          'sorting materials by their properties: waterproof or water-soaking',
          '2-PS1-1',
          [
            N(
              'Rain is dripping through the hole in the umbrella. Which material would make the best patch?',
            ),
          ],
          [
            o(
              'Waterproof cloth, which water cannot soak through.',
              [N('Yes. A good patch is waterproof. It keeps the rain out where the hole was.')],
              true,
            ),
            o('Paper, which is light and thin.', [
              N(
                'Plain paper soaks through and tears when wet. Oiled paper is waterproof, but ordinary paper is not.',
              ),
              N('Waterproof cloth is the best patch.'),
            ]),
            o('A sponge, because it holds water.', [
              N('A sponge soaks up water and then drips it right back out.'),
              N('Waterproof cloth keeps the rain out.'),
            ]),
          ],
          'Sorted materials by whether they let water through, and chose a waterproof one.',
        ),
      ],
    ),
    sc(
      'a17-07-return',
      [
        N(
          'By evening the rain has stopped. The umbrella stands in the Kusakabes’ porch, dried and folded, a little more patched than before.',
        ),
        SA(
          'We have to give it back. But if we take it to him, he’ll go red and run off and it’ll be awful.',
          'think',
        ),
        SA('And he got soaked. His mother will have shouted at him. And it was really kind.'),
        ME('I’ll say thank you very loudly.'),
        SA('That’s exactly what we can’t do.'),
        N(
          'Kanta lives at Granny’s, in the room at the back. Through the hedge you can hear him being told off, mildly.',
        ),
        SA('Keeper, you live there. What do we do?'),
      ],
      [
        ask(
          6,
          'sel',
          'a think question: how do you thank someone who would be embarrassed?',
          'CASEL: Social awareness',
          [
            N(
              'Kanta is shy about being thanked. How can you thank someone who would be embarrassed by it? Think about it.',
            ),
          ],
          [
            o('Thank them quietly, so no one else sees.', [
              N('That’s a fair answer. A quiet thank-you lets him keep his pride.'),
              N('Satsuki’s own plan is much like it.'),
            ]),
            o('Do something kind for them in return.', [
              N('That’s a fair answer. A kind act can say thank you without a word.'),
              N('Kanta might be easier with that than with a speech.'),
            ]),
            o('Write it down in a note.', [
              N('That’s a fair answer. A note can be read in private, and kept.'),
              N('Satsuki’s best handwriting would do nicely.'),
            ]),
          ],
          'Thought about ways of saying thank you that do not embarrass a shy person.',
        ),
        ask(
          6,
          'literacy',
          'point of view: how Kanta and the sisters see the umbrella',
          'RL.3.6',
          [
            N(
              'Satsuki thinks, “If we take it to him, he’ll go red and run off.” How might Kanta see the same moment?',
            ),
          ],
          [
            o(
              'He did something kind and feels shy that people noticed.',
              [
                N(
                  'Yes. Seeing a moment through each person’s eyes shows why it feels so delicate.',
                ),
              ],
              true,
            ),
            o('He wants to be thanked loudly.', [
              N('Everything we know about Kanta says the opposite.'),
              N('He did something kind and feels shy about being noticed.'),
            ]),
            o('He has forgotten about the umbrella.', [
              N('A boy who walked home soaked has not forgotten.'),
              N('He feels shy that his kindness was noticed.'),
            ]),
          ],
          'Compared the sisters’ view with Kanta’s view of the same moment.',
        ),
      ],
      [
        ch('stand', 'Put it in Granny’s umbrella stand with a note.', [
          N(
            'You stand it in Granny’s umbrella stand, with a note tied to the handle in Satsuki’s best writing: Thank you.',
          ),
          N(
            'Next morning the note is gone and the umbrella is too. Kanta doesn’t say anything all day, and walks a bit taller.',
          ),
        ]),
        ch('granny', 'Give it to Granny to pass on.', [
          GR('He did, did he? In that rain? The daft thing.', 'happy'),
          N(
            'Granny hands it to Kanta at supper without a word. He looks at it, then at his rice, and eats a great deal very fast.',
          ),
        ]),
        ch('satsuki', 'Let Satsuki give it back herself. Just stand nearby.', [
          N(
            'Satsuki goes round to the back of Granny’s and holds the umbrella out at the door. You stand by the pump, looking at the pump.',
          ),
          SA('Thank you. It was very kind. Here.'),
          KA('S’all right.'),
          N('He goes red, but he doesn’t run. That’s more than anyone expected.'),
        ]),
      ],
    ),
    sc(
      'a17-07-complete',
      [
        N(
          'The next time it rains, the umbrella goes past Granny’s gate on its way to school, with Kanta under it.',
        ),
        N(
          'He holds it a little to one side, as if someone might want to share it. Nobody does, and he holds it to one side anyway.',
        ),
        GR('That boy. He’d give you his head if it wasn’t screwed on.', 'happy'),
      ],
      [
        ask(
          1,
          'sel',
          'empathy: Kanta’s shy hope of sharing',
          'CASEL: Social awareness',
          [
            N(
              'Kanta holds the umbrella a little to one side, though nobody is there. What does that tell us about him?',
            ),
          ],
          [
            o(
              'He is kind, and hopes someone might want to share.',
              [N('Yes. It is a shy kind of hope: leaving room, and not asking.')],
              true,
            ),
            o('He is bad at holding umbrellas.', [
              N('He holds it deliberately. It is on purpose.'),
              N('It shows a shy hope that someone might want to share.'),
            ]),
            o('He wants to keep the rain off his bag only.', [
              N('He kept his own head wet for Satsuki, remember.'),
              N('He is kind, and hopes someone might share.'),
            ]),
          ],
          'Read a small action as a sign of a character’s shy kindness.',
        ),
      ],
    ),
  ],
  [
    gl('tsuyu', 'The rainy season in Japan, from about June into July.', 'a17-07-rain'),
    gl('Jizo', 'A stone statue in Japan that watches over children and travellers.', 'a17-07-rain'),
  ],
);

// ================================================================== A17-8 Granny’s Field
const A8: EduQuest = quest(
  'a17-08',
  'Granny’s Field',
  {
    'a17-08-s1': {
      goal: 'Help pick vegetables in Granny’s field for Mrs Kusakabe’s weekend home.',
      hint: 'Pick from the rows by the stream, then cool them in the water.',
    },
    'a17-08-s2': {
      goal: 'Read over Satsuki’s letter to her mother.',
      hint: 'Sit with Satsuki at the low table and read her letter through.',
    },
  },
  [
    sc(
      'a17-08-field',
      [
        N(
          'Granny’s field runs down to the stream: cucumbers, tomatoes, aubergines, and tall corn at the end.',
        ),
        GR('Their mother’s coming home for the weekend. We’ll send her something proper.'),
        GR(
          'Vegetables picked fresh and eaten fresh. There’s nothing better for anyone who’s been poorly.',
        ),
        N(
          'Mei picks 4 tomatoes and Satsuki picks 6 cucumbers. Granny wants 15 vegetables in the basket.',
        ),
        N('Mei smells a tomato, then holds it up to you to smell too. It smells of sun.'),
        N(
          'The girls put the cucumbers and tomatoes in the stream to cool, in a basket weighed down with a stone.',
        ),
        N(
          'Mei has gone to the corn. She is pulling at a fat ear with both hands, and it isn’t coming.',
        ),
        ME('This one’s for Mum. Only this one.', 'think'),
      ],
      [
        ask(
          3,
          'maths',
          'a two-step word problem: 4 + 6 = 10, then 15 − 10 = 5',
          '2.OA.A.1',
          [
            N(
              'Mei has picked 4 tomatoes and Satsuki 6 cucumbers. Granny wants 15 vegetables in all. How many more do they need?',
            ),
          ],
          [
            o('5 more.', [N('Yes. 4 + 6 = 10 so far, and 15 − 10 = 5 more.')], true),
            o('10 more.', [
              N('10 is how many they have already. We want how many are still missing.'),
              N('15 − 10 = 5 more.'),
            ]),
            o('25 more.', [
              N('25 is 15 + 10. Adding takes us further away from 15.'),
              N('They need 15 − 10 = 5 more.'),
            ]),
          ],
          'Solved a two-step word problem: 4 + 6 = 10 and 15 − 10 = 5.',
        ),
        ask(
          6,
          'science',
          'we eat different parts of plants: tomatoes and cucumbers are fruits, and corn kernels are seeds',
          '3-LS1-1',
          [
            N(
              'Tomatoes and cucumbers are fruits, because they hold seeds. The yellow kernels on an ear of corn are what part of the plant?',
            ),
          ],
          [
            o(
              'The seeds.',
              [
                N(
                  'Yes. Each kernel is a seed, and if you planted one, it could grow into a new corn plant.',
                ),
              ],
              true,
            ),
            o('The roots.', [
              N('Roots grow under the ground.'),
              N('The kernels are the corn plant’s seeds.'),
            ]),
            o('The flowers.', [
              N('The flowers come earlier and become the kernels after they are pollinated.'),
              N('The kernels themselves are seeds.'),
            ]),
          ],
          'Learned that corn kernels are seeds, and that tomatoes and cucumbers are fruits.',
        ),
      ],
      [
        ch('corn', 'Help Mei pull her ear of corn.', [
          N(
            'You hold the stalk and Mei pulls. The ear comes off with a snap, and she sits down hard in the dirt, holding it up.',
          ),
          ME('Got it! For Mum!', 'happy'),
        ]),
        ch('cucumber', 'Pick the straightest cucumber in the row.', [
          N(
            'You find the straightest cucumber in the row. Granny inspects it and nods, which from Granny is a medal.',
          ),
        ]),
        ch('tomato', 'Eat a tomato straight off the plant.', [
          GR('That’s it. That’s what they’re for.', 'happy'),
          N(
            'It is warm, and the juice runs down your chin. Mei does the same, and gets it everywhere.',
          ),
        ]),
      ],
    ),
    sc(
      'a17-08-field-done',
      [
        N(
          'Mei carries her ear of corn home herself, in both arms, like a baby. Nobody else is allowed to hold it.',
        ),
        GR(
          'Eat the red ones and the green ones and the yellow ones. Each colour feeds you in a different way.',
        ),
        N('It is good advice, and the whole way home the basket smells of sun and green leaves.'),
      ],
      [
        ask(
          1,
          'health',
          'a mix of colourful vegetables gives a mix of vitamins; fresh vegetables keep more vitamin C',
          'CASEL: Self-management',
          [
            N(
              'Granny says to eat red, green and yellow vegetables. Why is a mix of colours a good idea?',
            ),
          ],
          [
            o(
              'Different colours carry different vitamins and minerals.',
              [
                N(
                  'Yes. Variety gives your body a wider mix of what it needs. Fresh vegetables keep more of some vitamins, too.',
                ),
              ],
              true,
            ),
            o('Only red vegetables are healthy.', [
              N('Every colour has something to offer.'),
              N('A mix of colours gives a mix of vitamins.'),
            ]),
            o('Colour does not matter at all.', [
              N('It is a good clue, though: colours often show different goodness inside.'),
              N('A mix of colours gives a mix of vitamins.'),
            ]),
          ],
          'Learned that eating a mix of colourful vegetables gives the body a mix of vitamins.',
        ),
      ],
    ),
    sc(
      'a17-08-letter',
      [
        N(
          'In the evening Satsuki sits at the low table with a pencil, writing to her mother. She has been at it for an hour.',
        ),
        SA(
          'Will you check it? Not the writing. Just whether it sounds silly. And if I’ve spelled anything wrong.',
        ),
        N(
          'She reads it out in a small, careful voice. The atlas is kind about languages, and you follow every word.',
        ),
        SA(
          'Dear Mother. Mei has met a spirit. He lives under the camphor tree, and he is grey, and very big, and he was asleep.',
        ),
        SA(
          'Granny has given us vegetables for you. Please get better quickly. I am looking after everyone. Satsuki.',
        ),
        SA('Is “spirit” right? I wasn’t sure. I nearly put “ghost”, but he isn’t one.'),
        N(
          'Mei has drawn the spirit at the bottom of the page, enormous, with a tiny Mei on his stomach. The ear of corn is in it too.',
        ),
      ],
      [
        ask(
          5,
          'literacy',
          'choosing the right word: spirit or ghost',
          'L.3.4',
          [
            N(
              'Satsuki chose “spirit” instead of “ghost”. A ghost is said to be someone who has died and come back. What might a spirit be?',
            ),
          ],
          [
            o(
              'A being that belongs to a place, like a wood, and isn’t a person who died.',
              [
                N(
                  'Yes. Choosing the exact word matters: “spirit” says what she means, and “ghost” would not.',
                ),
              ],
              true,
            ),
            o('The same thing exactly.', [
              N('They overlap, but they are not the same.'),
              N(
                'Satsuki chose spirit to say he belongs to the wood, not that he was once a person.',
              ),
            ]),
            o('A kind of animal.', [
              N('A spirit is not an animal, though this one looks a little like several.'),
              N('It is a being that belongs to a place, like a wood.'),
            ]),
          ],
          'Learned that choosing the exact word, spirit rather than ghost, changes the meaning of a sentence.',
        ),
        ask(
          4,
          'sel',
          'a think question: is it better to say we are fine, or say how we feel?',
          'CASEL: Self-awareness',
          [
            N(
              'Satsuki wrote “I am looking after everyone.” Is it better to tell people we are fine, or to say how we really feel? Think about it.',
            ),
          ],
          [
            o('Say how we feel, because then people can help.', [
              N(
                'That’s a fair answer. A letter that says “I miss you” lets her mother care for her, too.',
              ),
              N('Satsuki’s mum would like to hear it.'),
            ]),
            o('Say we are fine, so nobody worries.', [
              N('That’s a fair answer. It is a kind wish, to spare someone worry.'),
              N('The trouble is that carrying everything alone gets heavy.'),
            ]),
            o('A bit of both, gently.', [
              N('That’s a fair answer. “I am fine, and I miss you” says both.'),
              N('It is honest, and still kind.'),
            ]),
          ],
          'Thought about whether to say we are fine or say how we feel, and why honesty can help.',
        ),
      ],
      [
        ch('right', 'Tell her it’s right, all of it.', [
          SA('Really? Good.', 'happy'),
          N('She folds it twice and puts it in the envelope before she can change her mind.'),
        ]),
        ch('line', 'Suggest she cross out “I am looking after everyone.”', [
          SA('Why? It’s true.'),
          Y('She knows. She’d rather hear how you are.'),
          N(
            'Satsuki crosses it out, and writes instead: I am fine, and I miss you. Then she looks at it a long time.',
            'soft',
          ),
        ]),
        ch('nubbin', 'Ask if your Nubbin can be in the drawing.', [
          ME('I’ll do it!', 'happy'),
          N(
            'Mei adds your Nubbin, the size of a bean, next to her, and gives it a smile bigger than its face.',
          ),
        ]),
      ],
    ),
    sc(
      'a17-08-complete',
      [
        N(
          'In the morning you post the letter in the red box by the bus stop, with Mei lifted up to do the actual posting.',
        ),
        ME('Will it go fast?'),
        SA(
          'It goes on the bus. Then on the train. Then a man carries it. It’ll be there tomorrow.',
        ),
        ME('I could go faster.', 'think'),
        N('Nobody pays much attention to that, at the time.'),
      ],
      [
        ask(
          3,
          'social-studies',
          'how people sent messages in the 1950s: letters by bus and train, telegrams, and telephones in few houses',
          'D2.His.2.K-2',
          [
            N(
              'Today we can send a message across the world in a second. In the 1950s countryside, how did a letter get to Mrs Kusakabe?',
            ),
          ],
          [
            o(
              'By bus, then train, then a postman on foot or bicycle.',
              [
                N(
                  'Yes. A letter might take a day or more. Fast messages were telegrams, and few houses had a telephone.',
                ),
              ],
              true,
            ),
            o('By email.', [
              N('Email did not exist yet. It would be about forty years before it spread.'),
              N('A letter went by bus, then train, then a postman.'),
            ]),
            o('By a text message.', [
              N('Mobile phones came much later.'),
              N('In the 1950s a letter went by bus, then train, then a postman.'),
            ]),
          ],
          'Learned how letters travelled in the 1950s countryside: by bus, train and postman.',
        ),
      ],
    ),
  ],
  [
    gl('kernel', 'One seed of an ear of corn.', 'a17-08-field'),
    gl(
      'spirit',
      'A being that belongs to a place or the natural world, not a person who died.',
      'a17-08-letter',
    ),
  ],
);

// ================================================================== A17-9 The Bus Stop in the Rain
const A9: EduQuest = quest(
  'a17-09',
  'The Bus Stop in the Rain',
  {
    'a17-09-s1': {
      goal: 'Take the umbrellas down to the bus stop with Satsuki and Mei.',
      hint: 'Carry Granny’s lantern and walk down the dark road with the girls.',
    },
    'a17-09-s2': {
      goal: 'Keep waiting at the bus stop in the rain.',
      hint: 'Stand still beside Satsuki. Don’t go anywhere. Something is coming.',
    },
    'a17-09-s3': {
      goal: 'Watch what comes for him along the dark road.',
      hint: 'Stay at the bus stop and look down the road. Hold the lantern up.',
    },
  },
  [
    sc(
      'a17-09-walk',
      [
        N(
          'It has rained since teatime. Mr Kusakabe went to the university without an umbrella, as he always does.',
        ),
        SA('We’ll take Dad’s umbrella to the bus stop. Mei’s coming too. She won’t stay behind.'),
        GR('Take my lantern, and take the Keeper. It’s black as a boot out there.'),
        N(
          'So the four of you go down the road in the dark: Satsuki with two umbrellas, Mei under a small one, you with the lantern.',
        ),
        N(
          'The bus stop is a sign on a post and a little wooden shelter, at the edge of the wood. The rain drums on everything.',
        ),
        N(
          'A bus comes, all lit up, with its wipers going. It stops, nobody gets off, and it drives away. The shelter clock says 7:20.',
        ),
        SA('He’ll be on the next one. The sign says it’s due at 7:50.'),
        N(
          'Your lantern makes a small yellow room in the rain, and your shadow stretches long and thin across the road.',
        ),
      ],
      [
        ask(
          5,
          'maths',
          'time intervals: 7:20 to 7:50 is 30 minutes',
          '3.MD.A.1',
          [
            N(
              'The bus has just gone at 7:20, and the next is due at 7:50. How long must they wait?',
            ),
          ],
          [
            o('30 minutes.', [N('Yes. From 7:20 to 7:50 is 30 minutes, or half an hour.')], true),
            o('20 minutes.', [
              N('Let’s count on from 7:20: ten minutes gets us to 7:30, then 7:40, then 7:50.'),
              N('That is three jumps of 10, so 30 minutes.'),
            ]),
            o('70 minutes.', [
              N('70 would be an hour and ten minutes. The sign says 7:50, not 8:30.'),
              N('From 7:20 to 7:50 is 30 minutes.'),
            ]),
          ],
          'Found a time interval: 7:20 to 7:50 is 30 minutes.',
        ),
        ask(
          7,
          'science',
          'light travels in straight lines, so a low lantern makes long shadows',
          '1-PS4-2',
          [
            N(
              'Your lantern makes your shadow long and thin across the road. Why is a shadow long when the light is low down?',
            ),
          ],
          [
            o(
              'Light travels in straight lines, and a low light stretches the shadow along the ground.',
              [
                N(
                  'Yes. The lower the light, the longer the shadow. It is why shadows are long at sunset.',
                ),
              ],
              true,
            ),
            o('The rain makes the shadow stretch.', [
              N('Rain does not stretch shadows.'),
              N('A low light, shining in straight lines, makes a long shadow.'),
            ]),
            o('Shadows are always the same length.', [
              N('They change all day. Watch your own shadow at noon, and again at sunset.'),
              N('A low light makes a long shadow.'),
            ]),
          ],
          'Learned that a low light source makes a long shadow because light travels in straight lines.',
        ),
      ],
      [
        ch('wait', 'Wait with them.', [
          N('You wait with them. There is nothing else to do, so you all do it properly.'),
        ]),
        ch('offer', 'Offer to take Mei home.', [
          ME('No! I’m waiting for Dad.', 'angry'),
          SA('She won’t go. It’s all right. We’ll all wait.'),
        ]),
      ],
    ),
    sc(
      'a17-09-walk-done',
      [
        N('The next bus is a long time coming. Mei gets heavier and heavier against her sister.'),
        N('In the end Satsuki lifts her on to her back, and holds her umbrella over both of them.'),
        N(
          'She stands very straight, with one arm round her sister’s legs and the other hand on the handle. Her arm begins to shake.',
        ),
      ],
      [
        ask(
          2,
          'sel',
          'a think question: when is it right to ask for help?',
          'CASEL: Relationship skills',
          [
            N(
              'Satsuki carries Mei, an umbrella and a lantern’s worth of worry. When is it right to ask for help? Think about it.',
            ),
          ],
          [
            o('When we are carrying too much, even if we can manage.', [
              N('That’s a fair answer. Asking before the load drops is wise.'),
              N('You have a hand free, and it might be a good moment.'),
            ]),
            o('When something is really too hard.', [
              N('That’s a fair answer. A clear “too hard” is the usual signal.'),
              N('Satsuki’s shaking arm is a clue that she is close to it.'),
            ]),
            o('Never, because we should manage on our own.', [
              N('That’s a fair answer, and many people feel it. It can feel like being strong.'),
              N('But being strong often includes letting someone take half the load.'),
            ]),
          ],
          'Thought about when it is right to ask for help.',
        ),
      ],
    ),
    sc(
      'a17-09-wait',
      [
        N(
          'Mei is asleep on Satsuki’s back. The rain drips off the edge of the shelter, steady as a clock.',
        ),
        N('Your Nubbin, under the shelter, slowly turns its head to the right.'),
        N(
          'Next to Satsuki there is something standing in the rain. You hear its claws first, on the wet road.',
        ),
        N(
          'It is huge, and grey, and round. It has a big leaf on its head, and the rain runs off the leaf and on to its fur.',
        ),
        N('Satsuki stares up at it. It stares out at the dark, the way people do at bus stops.'),
        N(
          'Then it turns its great round eyes, slowly, and looks straight at you. It blinks, once, very slowly.',
        ),
      ],
      [
        doit(
          0,
          'music',
          'keep a steady beat, four counts at a time',
          'RL.2.4',
          'edu:clap:beat:rain-four',
          [
            N(
              'Listen to the drips from the shelter edge. They fall at a steady beat, like a pulse.',
            ),
            N('Clap along: one, two, three, four. Keep it even, and don’t rush.'),
          ],
          'Clapped a steady beat in groups of four to match dripping rain.',
        ),
      ],
      [
        ch('nod', 'Nod to him, as you would to a neighbour.', [
          N(
            'You nod. The great spirit seems to think about this, and then his whiskers move, which might be a nod back.',
          ),
        ]),
        ch('still', 'Stand very still and let him look.', [
          N(
            'You stand very still. He looks at you a long time, as if you are an interesting sort of weather.',
          ),
        ]),
      ],
    ),
    sc(
      'a17-09-wait-done',
      [
        N(
          'Satsuki holds out her father’s umbrella to him. He doesn’t know what it is, so she opens it and holds it up high, over his head.',
        ),
        N(
          'A drop falls from the trees on to the umbrella, tok, and everything under it goes still. Another drop: tok.',
        ),
        N(
          'Something huge jumps. The ground shakes, and every drop in every tree comes down on the umbrella at once.',
        ),
        N('A roar of pure happiness goes through you like warm wind.'),
      ],
      [
        ask(
          1,
          'science',
          'a drop hitting the umbrella makes it vibrate, and vibrations carry sound',
          '1-PS4-1',
          [N('Each raindrop goes “tok” on the umbrella. What makes that sound?')],
          [
            o(
              'The drop makes the umbrella cloth vibrate, and the vibration travels through the air to our ears.',
              [
                N(
                  'Yes. Every sound is a vibration. Hit something, and it shakes, and the shake carries as sound.',
                ),
              ],
              true,
            ),
            o('The drop is shouting.', [
              N('Ha! A drop can’t shout, though it makes a good noise.'),
              N('The cloth vibrates when the drop hits it, and that vibration is the sound.'),
            ]),
            o('The sound is already in the umbrella.', [
              N('It is only made when the drop hits.'),
              N('The hit makes the cloth vibrate, and the vibration is the sound.'),
            ]),
          ],
          'Learned that a sound is a vibration, such as a raindrop making cloth shake.',
        ),
      ],
    ),
    sc(
      'a17-09-catbus',
      [
        N(
          'He holds something out to Satsuki: a little bundle of leaves, tied up with a stalk of grass.',
        ),
        N(
          'She takes it in both hands. Then two lights come bounding through the wood towards you, yellow, like headlamps.',
        ),
        N(
          'It is a bus. It is also a cat: a huge grinning cat, with many legs and a body you could sit in.',
        ),
        N(
          'It stops at the bus stop, as buses do, and its door opens. Its sign, up top, flickers with a word that won’t hold still.',
        ),
        N(
          'The great spirit steps in, with the umbrella. He looks out at you all through the window as it goes.',
        ),
        N(
          'The Catbus bounds off over the fields, over the wires, over the trees, and the dark is just dark again.',
        ),
        N(
          'Your Nubbin is standing up on its back legs, staring after it. You realise that so are you.',
        ),
      ],
      [
        ask(
          5,
          'literacy',
          'compound words are made of two words: Catbus is cat + bus',
          'L.3.4',
          [
            N(
              '“Catbus” is a compound word: two words joined into one. Which of these is also a compound word?',
            ),
          ],
          [
            o(
              'Rainbow.',
              [N('Yes. Rain + bow. A compound word is two words joined to make a new one.')],
              true,
            ),
            o('Umbrella.', [
              N(
                'Umbrella is one word with a different history, and it doesn’t split into two words.',
              ),
              N('Rainbow is rain + bow, a compound word.'),
            ]),
            o('Tunnel.', [
              N('Tunnel doesn’t break into two smaller words.'),
              N('Rainbow is rain + bow, a compound word.'),
            ]),
          ],
          'Identified a compound word made of two smaller words.',
        ),
      ],
      [
        ch('satsuki', 'Look at Satsuki.', [
          SA('Did you see it? You did. You saw it.', 'shock'),
          Y('I saw it.'),
          SA('Mei’s going to be so cross she was asleep.', 'happy'),
        ]),
        ch('bundle', 'Look at the bundle.', [
          N(
            'Satsuki is holding the bundle against her chest with both hands. It smells of green things and earth.',
          ),
        ]),
      ],
    ),
    sc(
      'a17-09-catbus-done',
      [
        N(
          'A little after, an ordinary bus comes round the bend with its lights on. The clock in the shelter says 8:15.',
        ),
        N('Mr Kusakabe gets off and stops dead.'),
        FA(
          'All three of you? And the Keeper? In this? I’m sorry, my bus was held up. Why are you all looking like that?',
        ),
        N('Satsuki opens her mouth, and shuts it again.'),
      ],
      [
        ask(
          1,
          'maths',
          'time intervals: due at 7:50, arrived at 8:15, so 25 minutes late',
          '3.MD.A.1',
          [N('The bus was due at 7:50 and arrives at 8:15. How many minutes late is it?')],
          [
            o(
              '25 minutes.',
              [N('Yes. 7:50 to 8:00 is 10 minutes and 8:00 to 8:15 is 15 more, so 10 + 15 = 25.')],
              true,
            ),
            o('15 minutes.', [
              N('15 is only the part after eight o’clock. We need to count from 7:50.'),
              N('7:50 to 8:00 is 10, and 8:00 to 8:15 is 15, so 25 minutes.'),
            ]),
            o('35 minutes.', [
              N('35 would mean arriving at 8:25.'),
              N('From 7:50 to 8:15 is 25 minutes.'),
            ]),
          ],
          'Found a time interval across the hour: 7:50 to 8:15 is 25 minutes.',
        ),
      ],
    ),
    sc(
      'a17-09-complete',
      [
        N(
          'The girls tell him all the way home, both at once. Mei, who saw none of it, tells it loudest.',
        ),
        FA(
          'A spirit at the bus stop. Took my umbrella, did he? Well, he’s welcome to it. It leaked.',
          'happy',
        ),
        N(
          'At Granny’s door, your Nubbin stops. It has found a big leaf by the step, the size of a hat, and it puts it on.',
        ),
        N(
          'Rain beads on the leaf and runs off its pointed tip. Your Nubbin wears it into the house and won’t take it off for supper.',
        ),
      ],
      [
        ask(
          3,
          'science',
          'waxy, pointed leaves shed rain, a structure that helps plants survive',
          '4-LS1-1',
          [
            N(
              'Rain beads on the leaf and runs off its tip. How does that help the plant that grew it?',
            ),
          ],
          [
            o(
              'The water runs off, so the leaf doesn’t stay wet and soggy, where fungi like to grow.',
              [
                N(
                  'Yes. Many wet-climate plants have waxy leaves and pointed tips that shed water fast.',
                ),
              ],
              true,
            ),
            o('The water runs off so the plant never gets any.', [
              N('Plants drink through their roots, and the rain still soaks the ground.'),
              N('Shedding water from the leaf keeps it from staying wet and growing fungi.'),
            ]),
            o('It does not help at all.', [
              N('Plants’ shapes have usually been shaped by what helps them survive.'),
              N('Shedding water keeps leaves dry and healthy.'),
            ]),
          ],
          'Learned that waxy, pointed leaves shed rain, helping plants stay healthy in wet places.',
        ),
      ],
    ),
  ],
  [
    gl('shelter', 'A small building or cover that keeps you out of the rain.', 'a17-09-walk'),
    gl('compound word', 'A word made by joining two smaller words together.', 'a17-09-catbus'),
  ],
);

// ================================================================== A17-10 The Seeds
const A10: EduQuest = quest(
  'a17-10',
  'The Seeds',
  {
    'a17-10-s1': {
      goal: 'Open the spirit’s bundle with the family.',
      hint: 'Sit at the low table in the old house while Satsuki unties the grass.',
    },
    'a17-10-s2': {
      goal: 'Plant the seeds in a bed in the garden, then wait.',
      hint: 'Dig the bed by the house, plant every seed, and mark the place.',
    },
  },
  [
    sc(
      'a17-10-bundle',
      [
        N(
          'In the morning everyone sits round the low table in the old house, and Satsuki unties the stalk of grass.',
        ),
        N(
          'The leaves fall open. Inside there are 12 nuts and acorns: 5 brown, 4 striped, and 3 you have never seen.',
        ),
        ME('Acorns! He gave us acorns!', 'happy'),
        SA('It’s a present. It’s a thank-you, for the umbrella.'),
        FA('Then you’d better plant them. Seeds are a promise. You have to keep your side.'),
        ME('And they’ll grow into a forest! A whole forest, and he can live in it!'),
        FA('It might take a while, Mei.'),
        N(
          'Your Nubbin sniffs every single nut in turn, and then puts its nose on the table and looks at them all.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'division as equal sharing: 12 ÷ 3 = 4',
          '3.OA.A.3',
          [
            N(
              'There are 12 nuts. If Satsuki, Mei and their father share them equally, how many does each get?',
            ),
          ],
          [
            o(
              '4 each.',
              [N('Yes. 12 shared among 3 is 12 ÷ 3 = 4, and you can check it: 3 × 4 = 12.')],
              true,
            ),
            o('3 each.', [
              N('3 each would use only 9 nuts: 3 × 3 = 9.'),
              N('12 ÷ 3 = 4 each, and 3 × 4 = 12.'),
            ]),
            o('6 each.', [N('6 each would need 18 nuts: 3 × 6 = 18.'), N('12 ÷ 3 = 4 each.')]),
          ],
          'Shared 12 nuts equally among 3 people: 12 ÷ 3 = 4.',
        ),
        ask(
          6,
          'science',
          'a seed holds a baby plant and a store of food',
          '3-LS1-1',
          [N('Inside each acorn is a seed. What does a seed hold that lets it grow into a tree?')],
          [
            o(
              'A tiny baby plant and a store of food to start it off.',
              [
                N(
                  'Yes. The food store feeds the baby plant until its roots and leaves can feed it themselves.',
                ),
              ],
              true,
            ),
            o('A tiny tree already full-grown, folded up.', [
              N('It is a baby plant, not a folded-up tree.'),
              N('A seed holds a tiny plant and food to get it started.'),
            ]),
            o('Nothing, it is just a hard lump.', [
              N('It is far from empty.'),
              N('A seed holds a tiny plant and a store of food.'),
            ]),
          ],
          'Learned that a seed holds a baby plant and a store of food to start it growing.',
        ),
      ],
      [
        ch('count', 'Help Mei count them.', [
          ME('One, two, five, nine, eleven…', 'think'),
          SA('Mei, that’s not how counting goes.'),
          ME('It is for acorns.'),
        ]),
        ch('smell', 'Smell the leaves they came in.', [
          N(
            'The leaves smell of the camphor tree: clean and sharp, like a medicine chest kept in a forest.',
          ),
        ]),
      ],
    ),
    sc(
      'a17-10-bundle-done',
      [
        SA('We’ll make a seed bed in the garden. A proper one. Will you help dig?'),
        N('Mr Kusakabe looks at the nuts, and at his daughters.'),
        FA('A promise is a promise. If you plant them, you must look after them.'),
        N('Everyone nods, even Mei, who nods so hard her hat falls off.'),
      ],
      [
        ask(
          2,
          'sel',
          'keeping a promise means doing your part until the end',
          'CASEL: Responsible decision-making',
          [
            N(
              'Mr Kusakabe says a gift of seeds is a promise. What does it mean to keep your side of a promise?',
            ),
          ],
          [
            o(
              'To plant them and look after them until they grow.',
              [N('Yes. A promise to look after something means carrying on, not only starting.')],
              true,
            ),
            o('To plant them and forget about them.', [
              N('Seeds need water and attention. Forgetting would break the promise.'),
              N('Keeping the promise means looking after them until they grow.'),
            ]),
            o('To keep them in a drawer.', [
              N('A seed in a drawer cannot grow.'),
              N('Planting and looking after them keeps the promise.'),
            ]),
          ],
          'Thought about what it means to keep a promise: following through until the end.',
        ),
      ],
    ),
    sc(
      'a17-10-plant',
      [
        N(
          'You dig a bed in the sun by the house. Satsuki plants 8 seeds in 2 neat rows of 4, and Mei plants the other 4 in clumps.',
        ),
        N('Your Nubbin pats the earth down over each one, very firmly, with both paws.'),
        ME('Now they grow.'),
        N('They don’t. Mei squats over the bare earth with her chin on her knees, and waits.'),
        N('Your Nubbin squats beside her, chin on its knees, and waits too.'),
        SA('Mei, it’s been about a minute.'),
        ME('Then they’re late.', 'angry'),
        N(
          'Nothing comes up that day, or the next day, or the day after that. Every morning, two small shapes squat beside the bed.',
        ),
      ],
      [
        ask(
          2,
          'maths',
          'rows of equal size: 2 rows of 4 make 8',
          '3.OA.A.1',
          [N('Satsuki plants 2 rows with 4 seeds in each row. How many seeds is that?')],
          [
            o('8 seeds.', [N('Yes. Two rows of 4 is 4 + 4 = 8, which is 2 × 4.')], true),
            o('6 seeds.', [
              N('6 is 2 + 4. Rows of 4 mean we add 4 for each row.'),
              N('4 + 4 = 8 seeds.'),
            ]),
            o('24 seeds.', [
              N('24 looks like writing 2 and 4 side by side. We multiply instead.'),
              N('3 × 4 = 12 seeds.'),
            ]),
          ],
          'Used equal rows to find that 3 rows of 4 seeds make 12 seeds.',
        ),
        ask(
          6,
          'science',
          'seeds need water and warmth to sprout, and a fair test changes one thing at a time',
          '2-LS2-1',
          [
            N(
              'Mei wonders why nothing has come up. Plants need water and light, and seeds need warmth. How could you find out if a seed needs light to sprout?',
            ),
          ],
          [
            o(
              'Plant two the same, give one light and the other none, and compare.',
              [
                N(
                  'Yes. A fair test changes one thing, here the light, and keeps the rest the same.',
                ),
              ],
              true,
            ),
            o('Dig up every seed each hour.', [
              N('Digging them up would hurt the seeds, and teach us little.'),
              N('A fair test gives one seed light and one none, and compares.'),
            ]),
            o('Ask the seeds.', [
              N('Seeds can’t talk, but they do answer, through what they do.'),
              N('A fair test with and without light will tell us.'),
            ]),
          ],
          'Learned how a fair test changes one thing, such as light, and keeps everything else the same.',
        ),
      ],
      [
        ch('sign', 'Make a sign for the bed.', [
          N(
            'You make a sign out of a bit of board: SEEDS, PLEASE DON’T STEP. Mei adds a drawing of the spirit, for the seeds to look at.',
          ),
        ]),
        ch('stones', 'Ring the bed with white stones.', [
          N(
            'You ring the bed with white stones from the stream, so nobody treads on it in the dark. Mei counts them, her way.',
          ),
        ]),
        ch('squat', 'Squat down with them and wait.', [
          N(
            'You squat down too: three of you now, chins on knees. Nothing comes up, but the waiting is better company.',
          ),
        ]),
      ],
    ),
    sc(
      'a17-10-complete',
      [
        FA('Seeds are like that. They take their time. Most good things do.', 'soft'),
        ME('He’d make them grow. If he came.'),
        N(
          'That night, at Granny’s, your Nubbin won’t settle. It sits at the window with its nose on the glass, facing the old house.',
        ),
        N('You think about waiting, and how it looks from the outside: like nothing at all.'),
      ],
      [
        ask(
          3,
          'sel',
          'a think question: is waiting a kind of doing?',
          'CASEL: Self-management',
          [
            N(
              'Mr Kusakabe says good things take their time. Is waiting a way of doing something, or is it doing nothing? Think about it.',
            ),
          ],
          [
            o('It is doing something, because it takes effort not to give up.', [
              N('That’s a fair answer. Patience is work, even when nothing shows.'),
              N('Mei is working very hard at it.'),
            ]),
            o('It is doing nothing, but sometimes nothing is right.', [
              N('That’s a fair answer. Doing less, on purpose, can be wise.'),
              N('A seed grows best when it isn’t dug up to be checked.'),
            ]),
            o('It depends what you do while you wait.', [
              N(
                'That’s a fair answer. Watering, watching and keeping the weeds off are part of waiting.',
              ),
              N('Mei does her part by squatting there each morning.'),
            ]),
          ],
          'Thought about whether waiting is a way of doing something, and what patience takes.',
        ),
      ],
    ),
  ],
  [gl('promise', 'A serious word to do something, which you must keep.', 'a17-10-bundle-done')],
);

// ================================================================== A17-11 The Night Dance
const A11: EduQuest = quest(
  'a17-11',
  'The Night Dance',
  {
    'a17-11-s1': {
      goal: 'Follow your Nubbin to the seed bed at midnight.',
      hint: 'Your Nubbin has woken you. Go quietly through the hedge to the old house garden.',
    },
    'a17-11-s2': {
      goal: 'Dance round the seed bed with the spirits.',
      hint: 'Follow the great spirit round the bed. Arms up when he lifts, bend when he bends.',
    },
    'a17-11-s3': {
      goal: 'Hold on tight and ride the spinning top up into the night.',
      hint: 'Climb on behind the girls and hold on to his fur. Don’t look down. Or do.',
    },
  },
  [
    sc(
      'a17-11-midnight',
      [
        N('Something is patting your face. It is your Nubbin, and it is the middle of the night.'),
        N(
          'The moon is full and bright. Across the hedge, in the old house garden, something is moving round the seed bed.',
        ),
        N('You go through the gap in the hedge in your socks. Then you stop.'),
        N(
          'Three spirits are walking round the seed bed, slowly, in a line: the great grey one, the blue one and the little white one.',
        ),
        N(
          'They hold their arms up, all together, and bend, all together, as if they were pulling something up out of the earth.',
        ),
        N(
          'Satsuki and Mei come out on to the veranda of the old house in their nightclothes, barefoot.',
        ),
        ME('He came. Onee-chan, he came!', 'happy'),
        N('Your Nubbin is already in the line, behind the little white one, holding up its paws.'),
      ],
      [
        ask(
          1,
          'science',
          'moonlight is sunlight that bounces off the Moon',
          '1-ESS1-1',
          [N('The full Moon lights the whole garden. Where does moonlight come from?')],
          [
            o(
              'It is sunlight bouncing off the Moon.',
              [
                N(
                  'Yes. The Moon makes no light of its own. A full Moon is bright because we see the whole sunlit face.',
                ),
              ],
              true,
            ),
            o('The Moon makes its own light, like a lamp.', [
              N('It looks like a lamp, but it’s a mirror of sorts.'),
              N('Moonlight is sunlight bouncing off the Moon.'),
            ]),
            o('It comes from the stars.', [
              N('Stars are very far away, and give only a faint glow.'),
              N('Moonlight is sunlight bouncing off the Moon.'),
            ]),
          ],
          'Learned that moonlight is sunlight reflected off the Moon.',
        ),
      ],
      [
        ch('join', 'Join the line.', [
          N(
            'You join the end of the line. Satsuki and Mei are just in front of you, holding their arms up, bending when he bends.',
          ),
        ]),
        ch('girls', 'Wait for the girls, then join together.', [
          N(
            'You wait at the edge until the girls reach you. Mei takes your hand and Satsuki’s, and pulls you both into the line.',
          ),
        ]),
      ],
    ),
    sc(
      'a17-11-dance',
      [
        N('Round the bed you all go, slowly: arms up, bend, arms up, bend. Nobody says a word.'),
        N(
          'A shoot comes up out of the earth, then another. Then all of them, together, like hands.',
        ),
        N(
          'The great spirit lifts his arms higher, and strains, and the shoots rise with them. They twist round each other as they rise.',
        ),
        N(
          'They grow into a sapling, then a young tree, then a tree as tall as the house. It goes on growing.',
        ),
        N(
          'It roars up into the night until it is as tall as the camphor on the hill, and its branches cover half the sky.',
        ),
        SA('We did it. We did it!', 'happy'),
        N(
          'Mei is jumping up and down. Your Nubbin is lying on its back in the grass, looking up into the branches.',
        ),
      ],
      [
        ask(
          0,
          'maths',
          'a repeating pattern: up, bend, up, bend',
          '4.OA.C.5',
          [N('The dance goes up, bend, up, bend, and on. What is the 9th move?')],
          [
            o(
              'Up.',
              [
                N(
                  'Yes. The odd moves, the 1st, 3rd, 5th, 7th and 9th, are all “up”, and the even moves are “bend”.',
                ),
              ],
              true,
            ),
            o('Bend.', [
              N('Let’s write it out: 1 up, 2 bend, 3 up, 4 bend, 5 up, 6 bend, 7 up, 8 bend, 9 …'),
              N('The 9th is up.'),
            ]),
            o('Jump.', [
              N('Jump isn’t in this dance.'),
              N('The pattern is up, bend, and the 9th is up.'),
            ]),
          ],
          'Continued a repeating pattern by rule: odd moves up, even moves bend.',
        ),
        ask(
          3,
          'science',
          'a plant grows from seed to sapling to tree, though real trees take years',
          '3-LS1-1',
          [
            N(
              'In the dance, the shoots become a tree in minutes. In real life, how does a tree grow from a seed?',
            ),
          ],
          [
            o(
              'Slowly: seed, seedling, sapling, tree, over many years.',
              [
                N(
                  'Yes. The spirits’ way is magic. A real tree takes years, and in the meantime it must be watered and kept safe.',
                ),
              ],
              true,
            ),
            o('The same way, in minutes.', [
              N('That is only in the story. It’s a lovely idea, though.'),
              N('Real trees grow slowly, over many years.'),
            ]),
            o('Overnight, if it rains.', [
              N('Rain helps, but growing a tree is a long job.'),
              N('Real trees grow slowly: seed, seedling, sapling, tree.'),
            ]),
          ],
          'Learned that a real tree grows slowly from seed to seedling to sapling to tree.',
        ),
      ],
      [
        ch('cheer', 'Cheer with Satsuki and Mei.', [
          N(
            'You cheer. The great spirit looks round at the noise, and grins, a grin as wide as the hedge.',
          ),
        ]),
        ch('lie', 'Lie down in the grass by your Nubbin and look up.', [
          N(
            'You lie down by your Nubbin and look up. The branches go up and up, and the stars show through them like fruit.',
          ),
        ]),
      ],
    ),
    sc(
      'a17-11-dance-done',
      [
        N(
          'The great spirit picks up a wooden spinning top, as big as a cartwheel, and sets it spinning on the grass.',
        ),
        N(
          'He steps up on to it, with the little white one and the blue one clinging to his fur. He holds out a paw to the girls.',
        ),
        N(
          'You think about the dance: it only worked because everyone did it together, at the same time.',
        ),
        N('Even the smallest, even Mei, was needed to keep the pattern going.'),
      ],
      [
        ask(
          2,
          'sel',
          'a think question: why do some jobs only work when everyone joins in?',
          'CASEL: Relationship skills',
          [
            N(
              'The dance only worked when everyone joined in. What jobs only work when everyone joins in? Think about it.',
            ),
          ],
          [
            o('Rowing a boat, because everyone has to pull together.', [
              N('That’s a fair answer. A rowing crew that is out of step goes nowhere.'),
              N('The spirits’ dance needs the same rhythm.'),
            ]),
            o('Singing in a choir, because each voice matters.', [
              N('That’s a fair answer. One missing voice changes the whole song.'),
              N('Mei’s part mattered, too.'),
            ]),
            o('Tidying a room, because many hands finish faster.', [
              N('That’s a fair answer. Some jobs go faster with many hands.'),
              N('Though a room can be tidied alone, the dance cannot.'),
            ]),
          ],
          'Thought about jobs that only work when everyone joins in together.',
        ),
      ],
    ),
    sc(
      'a17-11-flight',
      [
        N(
          'Satsuki and Mei climb up on to his stomach, and you hold on to the fur at his side, and your Nubbin holds on to you.',
        ),
        N(
          'He roars, and the top rises. It lifts off the grass, and spins, and the garden falls away.',
        ),
        ME('We’re the wind! We’re the wind!', 'happy'),
        N(
          'The great spirit flies to the top of the camphor tree on the hill, and settles on its highest branch.',
        ),
        N(
          'The three spirits take out little clay flutes, and play. The smallest flute makes the highest note.',
        ),
        N('It sounds like the night: frogs, and wind in the rice, and the stream, all at once.'),
        N(
          'Below you the whole valley is asleep. Satsuki leans on your shoulder, and Mei is already asleep on his stomach.',
        ),
      ],
      [
        ask(
          5,
          'science',
          'sounds come from different vibrating things: frogs, wind in leaves and moving water',
          '4-PS3-2',
          [
            N(
              'Frogs, wind in the rice and the stream all make sound at once. What do all those sounds have in common?',
            ),
          ],
          [
            o(
              'Each one is something vibrating.',
              [
                N(
                  'Yes. A frog’s throat, rice leaves in the wind and water all shake the air, and our ears catch it.',
                ),
              ],
              true,
            ),
            o('They are all quiet.', [
              N('They are fairly quiet, but not all of them are the same.'),
              N('What they share is that each is something vibrating.'),
            ]),
            o('They all come from the Moon.', [
              N('The Moon makes no sound at all.'),
              N('Each is something vibrating, and our ears catch it.'),
            ]),
          ],
          'Learned that every sound, from frogs, wind or water, is something vibrating.',
        ),
        ask(
          6,
          'music',
          'a shorter pipe gives a higher note',
          '1-PS4-1',
          [
            N(
              'The smallest clay flute makes the highest note. Why does a shorter pipe sound higher?',
            ),
          ],
          [
            o(
              'The air inside it is a shorter column, so it vibrates faster.',
              [
                N(
                  'Yes. A shorter column vibrates faster and makes a higher sound. A long column vibrates slower and sounds lower.',
                ),
              ],
              true,
            ),
            o('Small flutes are just louder.', [
              N('Loud and high are different. High is about speed of vibration.'),
              N('A shorter air column vibrates faster, and makes a higher note.'),
            ]),
            o('Big flutes are broken.', [
              N('Not at all. They simply play lower.'),
              N('A longer air column vibrates slower, and sounds lower.'),
            ]),
          ],
          'Learned that a shorter pipe makes a higher note because its air vibrates faster.',
        ),
      ],
      [
        ch('listen', 'Just listen.', [
          N(
            'You listen. Your Nubbin falls asleep against you, and you very nearly do too, at the top of the world.',
          ),
        ]),
        ch('satsuki', 'Ask Satsuki if she’s dreaming.', [
          SA('Probably. I don’t mind. Don’t wake me up.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a17-11-complete',
      [
        N(
          'You wake on Granny’s floor at sunrise, with your Nubbin asleep on your chest. Your socks have grass on them.',
        ),
        N(
          'Across the hedge, Satsuki and Mei are already out on the veranda, staring at the garden. There is no great tree.',
        ),
        N(
          'But in the seed bed, in rows and in clumps, there are shoots. Little green ones, just up.',
        ),
        SA('It was a dream! But it wasn’t!', 'happy'),
        ME('We did it! We did it!', 'happy'),
        N(
          'On your windowsill, where nobody put it, there is a small black seed. It smells of the camphor tree.',
        ),
        N(
          'You keep it. When you go home through the atlas, it goes with you, and comes out as a young camphor tree in a pot.',
        ),
      ],
      [
        ask(
          5,
          'science',
          'camphor seeds are small black berries that birds spread',
          '2-LS2-2',
          [
            N(
              'The small black seed on your windowsill is a camphor seed: a little black berry. How might camphor seeds travel to new places?',
            ),
          ],
          [
            o(
              'Birds eat the berries and drop the seeds far away.',
              [
                N(
                  'Yes. Animals spread seeds in what they leave behind, and that is how a forest of camphor trees can grow.',
                ),
              ],
              true,
            ),
            o('The berries walk.', [
              N('Ha! Not quite, though they do travel.'),
              N('Birds eat them and drop the seeds far away.'),
            ]),
            o('They stay under the tree for ever.', [
              N('Then there would be no new trees spread across the hills.'),
              N('Birds carry the seeds away and drop them.'),
            ]),
          ],
          'Learned that birds eat camphor berries and spread the seeds to new places.',
        ),
      ],
    ),
  ],
  [
    gl(
      'veranda',
      'A roofed platform along the outside of a house, like a porch.',
      'a17-11-midnight',
    ),
    gl('sapling', 'A young tree.', 'a17-11-dance'),
  ],
);

// ================================================================== A17-12 The Telegram
const A12: EduQuest = quest(
  'a17-12',
  'The Telegram',
  {
    'a17-12-s1': {
      goal: 'See what Kanta is running across the fields with.',
      hint: 'You are in Granny’s field with the girls. Wait for Kanta at the end of the row.',
    },
    'a17-12-s2': {
      goal: 'Walk with Satsuki to the telephone at Kanta’s uncle’s house.',
      hint: 'Follow Kanta along the path to the big house, and wait while Satsuki calls.',
    },
    'a17-12-s3': {
      goal: 'Be there for the sisters when it all comes out.',
      hint: 'Go back to Granny’s porch. Decide where to sit.',
    },
  },
  [
    sc(
      'a17-12-telegram',
      [
        N(
          'The day before the weekend, you are all in Granny’s field picking corn. Somebody is running along the path, shouting.',
        ),
        N('It is Kanta, red in the face, holding up a folded paper.'),
        KA('Telegram! For the Kusakabes! Nobody’s at your house! The man gave it to me!'),
        N(
          'Satsuki takes it. A telegram is a short message sent along wires, and brought to the door on paper.',
        ),
        N(
          'Telegrams were charged by length, so they were short. One that came out of the blue was rarely good news.',
        ),
        SA('It says… please telephone Shichikokuyama Hospital.', 'shock'),
        N('Nobody says anything. Mei looks from face to face, holding her corn.'),
        SA('Dad’s in town. At the university. We haven’t got a telephone.'),
        KA('My uncle has. At the big house. Come on.'),
      ],
      [
        ask(
          4,
          'social-studies',
          'how telegrams worked: short messages sent along wires, priced by length',
          'D2.His.2.K-2',
          [N('Why were telegrams short, and why did one that came out of the blue worry people?')],
          [
            o(
              'They were charged by length, so people kept them brief, and only used them for urgent news.',
              [
                N(
                  'Yes. Telegrams were quick but costly, so they were kept for news that could not wait.',
                ),
              ],
              true,
            ),
            o('They were short because paper was rare.', [
              N('It wasn’t the paper. It was the price per word or letter.'),
              N('They were charged by length, so people kept them brief.'),
            ]),
            o('They were never short.', [
              N('They almost always were, because every extra word cost money.'),
              N('They were charged by length, so people kept them brief.'),
            ]),
          ],
          'Learned that telegrams were short, quick messages charged by length and kept for urgent news.',
        ),
        ask(
          6,
          'literacy',
          'inference about feelings: why everyone goes quiet at a telegram',
          'RL.3.3',
          [N('Nobody says anything when Satsuki reads the telegram. Why does everyone go quiet?')],
          [
            o(
              'A telegram out of the blue usually means urgent news, so they feel worried.',
              [N('Yes. Silence can tell us how characters feel, even when nobody says it aloud.')],
              true,
            ),
            o('They are all hungry.', [
              N('They may be, but the scene is about the telegram.'),
              N('They go quiet because urgent news makes them worry.'),
            ]),
            o('They are bored.', [
              N('Nobody is bored when a telegram comes.'),
              N('They go quiet because they are worried by the news.'),
            ]),
          ],
          'Used what characters do to work out that they feel worried.',
        ),
      ],
      [
        ch('go', 'Go with them.', [N('You go with them. Granny takes Mei’s hand and keeps it.')]),
        ch('mei', 'Stay with Mei and Granny.', [
          N(
            'You stay with Mei, until you see Satsuki’s face as she turns to go. You go after her, and Granny keeps Mei.',
          ),
        ]),
      ],
    ),
    sc(
      'a17-12-phone',
      [
        N(
          'The big house has a black telephone on the wall in the hall, with a handle you turn. Kanta’s uncle shows Satsuki how.',
        ),
        N(
          'She asks the operator for her father’s university, in Tokyo, reading the number off a paper from her pocket.',
        ),
        SA('Hello? Please may I speak to Mr Kusakabe? It’s his daughter. Yes, I’ll wait.'),
        N(
          'She waits a long time with the earpiece pressed to her ear. Kanta stands in the doorway, not going away.',
        ),
        N('It rings. She grabs it.'),
        SA(
          'Yes. Yes. A cold. She can’t come home this weekend. She has to rest. Yes. No, I’m all right. Goodbye.',
        ),
        SA(
          'Mum caught a cold. It’s only a setback, he says. She’s all right. She just can’t come home. Not this weekend.',
        ),
      ],
      [
        ask(
          2,
          'science',
          'a telephone turns sound into electricity and back into sound',
          '4-PS3-4',
          [
            N(
              'Satsuki speaks into the telephone, and her father hears her far away. What does the telephone do to her voice on the way?',
            ),
          ],
          [
            o(
              'It turns the sound into electrical signals, sends them along the wire, and turns them back into sound.',
              [
                N(
                  'Yes. A telephone is a device that changes energy from one form to another and back again.',
                ),
              ],
              true,
            ),
            o('It shouts louder than she does.', [
              N('A telephone does not shout. It carries a copy of her voice.'),
              N('It turns sound into electricity, then back into sound.'),
            ]),
            o('It sends her breath down the wire.', [
              N('Breath stays in the room.'),
              N('It turns sound into electricity, then back into sound.'),
            ]),
          ],
          'Learned that a telephone changes sound into electrical signals and back into sound.',
        ),
      ],
      [
        ch('good', '“That’s all right, then. She’s all right.”', [
          SA('Yes. She’s all right.'),
          N('She says it in a very flat voice, like someone reading it off a card.'),
        ]),
        ch('quiet', 'Say nothing. Walk back with her.', [
          N(
            'You don’t say anything. You walk back with her, and Kanta walks behind you both, kicking at stones.',
          ),
        ]),
      ],
    ),
    sc(
      'a17-12-phone-done',
      [
        KA('Your mum. She’ll be all right. My gran says that hospital’s the best one.'),
        N(
          'Satsuki doesn’t answer. Kanta goes red, and stops following, and stands at the edge of the path until you’re gone.',
        ),
        N('He meant it kindly. It came out clumsy.'),
        N('Kanta kicks a stone into the ditch, hard, and does not look to see where it lands.'),
      ],
      [
        ask(
          1,
          'sel',
          'kind words for a worried friend: being present matters more than being clever',
          'CASEL: Social awareness',
          [
            N(
              'Kanta’s words came out clumsy. What could he say that would help a worried friend more?',
            ),
          ],
          [
            o(
              '“I’m here. Do you want me to walk with you?”',
              [N('Yes. Being present, and offering something small, helps more than explaining.')],
              true,
            ),
            o('“Don’t be silly, it’s fine.”', [
              N('It tries to help, but it can make a worried person feel unheard.'),
              N('“I’m here” is warmer.'),
            ]),
            o('Nothing, ever.', [
              N('Silence can be kind, but a short word of company helps.'),
              N('“I’m here” tells a worried friend they are not alone.'),
            ]),
          ],
          'Chose a kind way of offering company to a worried friend.',
        ),
      ],
    ),
    sc(
      'a17-12-lap',
      [
        N('Mei is waiting on Granny’s porch with her ear of corn. Satsuki tells her.'),
        ME('No! She’s coming home! She said! I picked the corn!', 'angry'),
        SA('Well, she can’t, Mei. She just can’t.'),
        ME('Then I’ll take it to her. I’ll go myself.', 'angry'),
        SA('Don’t be such a baby! You can’t go anywhere! Stop it!', 'angry'),
        N(
          'Mei cries, loudly, the way four-year-olds do. Satsuki stands there with her fists shut.',
        ),
        N(
          'Then Granny comes out on to the porch, and Satsuki’s face crumples, and she runs to her.',
        ),
        SA(
          'What if she doesn’t get better? What if it’s like last time, when it was only going to be a little while?',
          'sad',
        ),
        GR(
          'Hush now. She’ll be home. A cold is a cold. You’ve been brave too long, that’s all this is.',
          'soft',
        ),
      ],
      [
        doit(
          6,
          'health',
          'slow breathing helps the body calm down',
          'CASEL: Self-management',
          'edu:breathe:square:4',
          [
            GR(
              'When it all boils over, breathe with me. In for four, hold for four, out for four, hold for four.',
            ),
            GR('Slow breathing tells your body it is safe. Try it three times.'),
          ],
          'Practised slow, even breathing to help the body calm down.',
        ),
        ask(
          8,
          'sel',
          'a think question: is it wrong to be strong all the time?',
          'CASEL: Self-awareness',
          [
            N(
              'Granny says, “You’ve been brave too long.” Is it wrong to be strong all the time? What helps? Think about it.',
            ),
          ],
          [
            o('Yes, because everyone needs a turn to be looked after.', [
              N('That’s a fair answer. Being strong for others is lovely, and so is being held.'),
              N('Satsuki’s mother said something very like it.'),
            ]),
            o('No, but it helps to let the feelings out sometimes.', [
              N('That’s a fair answer. Strength includes crying when we need to.'),
              N('Satsuki let it out in Granny’s lap.'),
            ]),
            o('It depends on how heavy the load is.', [
              N('That’s a fair answer. A load can be carried for a while, and then needs sharing.'),
              N('Satsuki’s load has become very heavy.'),
            ]),
          ],
          'Thought about whether being strong all the time is healthy, and what helps.',
        ),
      ],
      [
        ch('mei', 'Sit with Mei.', [
          N(
            'You sit beside Mei on the step, and she cries against your arm. Your Nubbin climbs into her lap, on top of the corn.',
          ),
        ]),
        ch('satsuki', 'Sit near Satsuki and Granny, and wait.', [
          N(
            'You sit on the step near them and don’t say anything. After a long time Satsuki’s breathing goes slower.',
          ),
        ]),
        ch('kettle', 'Put the kettle on.', [
          N(
            'You go into Granny’s kitchen and put the kettle on, because somebody should, and because it’s something to do with your hands.',
          ),
        ]),
      ],
    ),
    sc(
      'a17-12-complete',
      [
        N(
          'By the time the tea is made, Satsuki has stopped crying. She sits up and wipes her face with the heel of her hand.',
        ),
        SA('Sorry, Obaa-chan. I’m all right. Mei, I’m sorry I shouted. Mei?'),
        N(
          'Five of you were on the porch: you, Satsuki, Granny, Mei and your Nubbin. Where Mei sat, there is only a dent in the cushion.',
        ),
        N('Your Nubbin is gone too.'),
      ],
      [
        ask(
          2,
          'maths',
          'subtraction within 20: 5 − 2 = 3',
          '2.OA.A.1',
          [
            N(
              'Five were on the porch: you, Satsuki, Granny, Mei and your Nubbin. Mei and your Nubbin are gone. How many are left?',
            ),
          ],
          [
            o('3 are left.', [N('Yes. 5 − 2 = 3: you, Satsuki and Granny.')], true),
            o('4 are left.', [
              N('Two went, not one. Count them off: 5, then 4, then 3.'),
              N('5 − 2 = 3 are left.'),
            ]),
            o('7 are left.', [
              N('7 is 5 + 2. When people leave, we take away.'),
              N('5 − 2 = 3 are left.'),
            ]),
          ],
          'Solved a take-away problem within 20: 5 − 2 = 3.',
        ),
      ],
    ),
  ],
  [
    gl(
      'telegram',
      'A short message sent along wires and brought to the door on paper.',
      'a17-12-telegram',
    ),
    gl('operator', 'A person who connects telephone calls by hand.', 'a17-12-phone'),
  ],
);

// ================================================================== A17-13 Mei Goes Alone
const A13: EduQuest = quest(
  'a17-13',
  'Mei Goes Alone',
  {
    'a17-13-s1': {
      goal: 'Search for Mei and your Nubbin with the whole village.',
      hint: 'Choose a road and look. Ask anyone you meet.',
    },
    'a17-13-s2': {
      goal: 'Go to the pond.',
      hint: 'Run down to the big pond where the people are.',
    },
  },
  [
    sc(
      'a17-13-gone',
      [
        SA('She’s gone to the hospital. With the corn. She doesn’t even know the way!', 'shock'),
        N('Satsuki is off down the road before anyone can stop her, running as fast as she can.'),
        GR('Kanta! Fetch your father. Fetch everybody.', 'shock'),
        N(
          'Kanta runs. In a very short time there are people in all the fields: neighbours, farmers, the man from the big house.',
        ),
        N('They call Mei’s name along the paths and across the water. You are in it with them.'),
        N(
          'Somewhere Mei is walking with an ear of corn, and somewhere next to her, you are sure, is your Nubbin.',
        ),
      ],
      [
        ask(
          4,
          'social-studies',
          'reading a map and splitting up to search covers more ground',
          'D2.Geo.2.K-2',
          [
            N(
              'Picture a map of the village: three roads, the paddies and the pond. How can the searchers cover the most ground?',
            ),
          ],
          [
            o(
              'Split up, with each person or group taking a different road.',
              [
                N(
                  'Yes. A map shows the places to cover, and splitting up covers more of them. They call to each other to share what they find.',
                ),
              ],
              true,
            ),
            o('All go along the same road together.', [
              N('That would search one road very well and leave the rest empty.'),
              N('Splitting up covers more ground.'),
            ]),
            o('Wait in the village for Mei to come back.', [
              N('Waiting is wise for some people, such as Granny, who keeps watch at home.'),
              N('To find someone quickly, splitting up works best.'),
            ]),
          ],
          'Learned that a map shows places to search, and that splitting up covers more ground.',
        ),
        ask(
          5,
          'sel',
          'a think question: why do neighbours help when someone is missing?',
          'CASEL: Social awareness',
          [
            N(
              'The whole village turns out to look for one small girl. Why do neighbours help, even people who hardly know her? Think about it.',
            ),
          ],
          [
            o('Because a child in danger belongs to everyone a little.', [
              N(
                'That’s a fair answer. Many places share this idea, that a village raises its children.',
              ),
              N('Granny would nod.'),
            ]),
            o('Because they would want help if it were their child.', [
              N(
                'That’s a fair answer. Imagining ourselves in someone’s place is where empathy starts.',
              ),
              N('It is a good rule for the whole valley.'),
            ]),
            o('Because it is the right thing to do.', [
              N('That’s a fair answer. Sometimes we help simply because it is right.'),
              N('You are in it with them.'),
            ]),
          ],
          'Thought about why neighbours help when someone is missing.',
        ),
      ],
      [
        ch('road', 'Take the hospital road.', [
          N(
            'You run the hospital road as far as the hill. A farmer on a cart saw a little girl, he thinks, an hour ago, or yesterday.',
          ),
        ]),
        ch('fields', 'Search the edges of the rice fields.', [
          N(
            'You go along the edges of the rice fields, looking in every ditch. Only frogs: hundreds of frogs, and no Mei.',
          ),
        ]),
        ch('kanta', 'Go with Kanta.', [
          KA('She’s small. She’ll go where it’s easy. Come on.'),
          N('He’s quicker than you, and he knows every path. He doesn’t stop shouting her name.'),
        ]),
      ],
    ),
    sc(
      'a17-13-gone-done',
      [
        N(
          'Someone is shouting by the big pond at the bottom of the village. People are starting to run towards it.',
        ),
        N('Your heart goes thump, thump, in your ears.'),
        N('You run too, because that is what your legs have decided.'),
        N('Behind you, Granny follows as fast as she can, with her skirt in her hands.'),
      ],
      [
        ask(
          1,
          'health',
          'if you are lost, stay where you are and find a trusted grown-up',
          'CASEL: Responsible decision-making',
          [
            N(
              'Mei is lost, and every grown-up in the village is looking for her. If you are ever lost, what is the safest thing to do?',
            ),
          ],
          [
            o(
              'Stay where you are, and look for a trusted grown-up.',
              [
                N(
                  'Yes. People searching for you need to find you, and a moving child is harder to find.',
                ),
              ],
              true,
            ),
            o('Keep walking until you find your way.', [
              N('Walking on can take you further from the people looking.'),
              N('Staying put and looking for a trusted grown-up is safest.'),
            ]),
            o('Hide until someone finds you.', [
              N('Hiding makes it harder for helpers to see you.'),
              N('Stay in the open, where you are, and find a trusted grown-up.'),
            ]),
          ],
          'Learned that if you are lost, you should stay put and look for a trusted grown-up.',
        ),
      ],
    ),
    sc(
      'a17-13-pond',
      [
        N('There are people all along the bank, and men in the shallows with poles.'),
        N('One of them holds up something small: a child’s sandal, dripping, from the water.'),
        N('Granny’s hands come together. She doesn’t make a sound, but her lips move.'),
        N(
          'Satsuki comes running down the bank, red-faced, out of breath. She stops, and looks at the sandal carefully.',
        ),
        SA('It isn’t hers. It isn’t Mei’s. Hers are different.'),
        GR('Oh. Oh, thank goodness. Oh, thank goodness.', 'soft'),
        N(
          'Granny sits down on the bank, all at once, as if her legs have been pulled from under her.',
        ),
      ],
      [
        ask(
          4,
          'sel',
          'calm checking beats panic: Satsuki looks closely before deciding',
          'CASEL: Self-management',
          [
            N(
              'Satsuki’s heart is racing, but she stops and looks closely at the sandal. Why is that a good idea?',
            ),
          ],
          [
            o(
              'Calm looking tells you what is true, and panic only guesses.',
              [N('Yes. She noticed it was a different sandal, and that kept hope alive.')],
              true,
            ),
            o('She wanted to take her time.', [
              N('She didn’t take long. She simply looked before deciding.'),
              N('Calm looking tells you what is true.'),
            ]),
            o('She was not worried.', [
              N('Her red face and quick breaths say she was very worried.'),
              N('She stayed calm enough to check, and that helped.'),
            ]),
          ],
          'Noticed that checking calmly can be better than reacting in panic.',
        ),
      ],
      [
        ch('granny', 'Sit down with Granny for a moment.', [
          N('You sit with her. She holds your arm very tight, and then lets go, and pats it.'),
          GR('Go on. Go and find her. I’m all right.'),
        ]),
        ch('satsuki', 'Go to Satsuki.', [
          N('You go to Satsuki. She is already looking away, up the hill, to the camphor tree.'),
        ]),
      ],
    ),
    sc(
      'a17-13-complete',
      [
        N(
          'It is getting late. The sun is low over the rice fields, and the whole village is still calling her name.',
        ),
        SA('I know who can find her.', 'think'),
        N('She turns, and runs for home. For the hedge.'),
        N('Her shadow runs ahead of her, long and thin, down the dusty road.'),
      ],
      [
        ask(
          2,
          'literacy',
          'character motive: why Satsuki runs for the hedge',
          'RL.3.3',
          [
            N(
              'Satsuki says, “I know who can find her,” and runs for the hedge. Why does she go there?',
            ),
          ],
          [
            o(
              'She trusts the one who looks after the wood, who is kind and has helped before.',
              [N('Yes. Her trust, and a plan, give her a reason to run towards something.')],
              true,
            ),
            o('She is running away from the search.', [
              N('She runs towards something, not away.'),
              N('She trusts the one who lives under the camphor tree to help.'),
            ]),
            o('She has forgotten about Mei.', [
              N('She is doing this because of Mei.'),
              N('She trusts the one under the camphor tree to help.'),
            ]),
          ],
          'Worked out why a character acts as she does: she trusts the forest spirit to help.',
        ),
      ],
    ),
  ],
);

// ================================================================== A17-14 Satsuki and the Spirit
const A14: EduQuest = quest(
  'a17-14',
  'Satsuki and the Spirit',
  {
    'a17-14-s1': {
      goal: 'Follow Satsuki through the hedge.',
      hint: 'Run after her into the old house garden, and go in at the gap in the hedge.',
    },
    'a17-14-s2': {
      goal: 'See what the great spirit calls.',
      hint: 'Hold on at the top of the tree and watch the woods.',
    },
  },
  [
    sc(
      'a17-14-tunnel',
      [
        N(
          'Satsuki runs into the old house garden, straight at the hedge, and goes in at the gap on her hands and knees.',
        ),
        N(
          'You go in after her. Last time this gap went nowhere; this time it is the tunnel, green and gold, going on and on.',
        ),
        SA('Please. Please be there.'),
        N(
          'She comes out among the roots of the camphor tree and drops straight down into the hollow, on to something soft.',
        ),
        N('The great spirit opens one eye. Then both.'),
        SA(
          'Please help me. Mei’s lost. She went to find our mum, and it’s getting dark, and I can’t find her anywhere.',
          'sad',
        ),
        N('She is crying properly now, holding on to his fur with both hands.'),
        N(
          'The great spirit looks at her for a long moment. Then he grins, the widest grin in the world.',
        ),
      ],
      [
        ask(
          5,
          'sel',
          'asking for help clearly: say what happened and what you need',
          'CASEL: Relationship skills',
          [
            N(
              'Satsuki says, “Please help me. Mei’s lost.” What makes it a good way to ask for help?',
            ),
          ],
          [
            o(
              'She says what happened and what she needs.',
              [N('Yes. A clear request lets a helper act at once.')],
              true,
            ),
            o('She says nothing and hopes he guesses.', [
              N('Hoping to be guessed can leave the problem unsolved.'),
              N('She says what happened and what she needs, and that is why it works.'),
            ]),
            o('She asks very quietly.', [
              N('She is crying, not quiet. And the words matter more than the volume.'),
              N('She says what happened and what she needs.'),
            ]),
          ],
          'Learned that asking for help works best when you say what happened and what you need.',
        ),
      ],
      [
        ch('back', 'Stand back. This is hers to ask.', [
          N(
            'You stay on the root at the edge of the hollow. It is hers to ask, and he is listening to her.',
          ),
        ]),
        ch('nubbin', 'Tell him your Nubbin is with Mei too.', [
          Y('My Nubbin’s with her. Wherever she is.'),
          N('He turns his great eyes to you and blinks once, slowly, as if he knew that already.'),
        ]),
      ],
    ),
    sc(
      'a17-14-tunnel-done',
      [
        N(
          'He gets up, with Satsuki on his stomach. Then he goes up the camphor tree the way wind goes up a tree, and you climb after.',
        ),
        N('This camphor tree is about 24 metres tall, and the hedge below is about 2 metres.'),
        N(
          'Branch after branch goes by. The roots, the hollow and the garden shrink to a green postage stamp.',
        ),
        N('You do not look down. You do, once.'),
      ],
      [
        ask(
          1,
          'maths',
          'division: how many 6-metre houses stacked make 24 metres?',
          '3.OA.A.3',
          [
            N(
              'The camphor tree is about 24 metres tall. A two-storey house is about 6 metres high. How many houses stacked on top of each other would reach the top?',
            ),
          ],
          [
            o('4 houses.', [N('Yes. 24 ÷ 6 = 4, because 4 × 6 = 24.')], true),
            o('3 houses.', [
              N('3 houses are only 3 × 6 = 18 metres tall.'),
              N('24 ÷ 6 = 4 houses.'),
            ]),
            o('18 houses.', [
              N('18 is 24 − 6. We want how many 6s fit into 24.'),
              N('24 ÷ 6 = 4 houses.'),
            ]),
          ],
          'Used division to find how many 6-metre houses make 24 metres: 4.',
        ),
      ],
    ),
    sc(
      'a17-14-call',
      [
        N(
          'At the very top of the camphor tree he lifts his head and roars. It rolls out over the valley like thunder.',
        ),
        N('Far off, over the woods, two yellow lights come bounding.'),
        N(
          'The Catbus comes running along the treetops, its legs a blur, and lands on the branch beside you with a thump.',
        ),
        N(
          'Its door opens, and Satsuki climbs in. The sign up top turns, like a rolling drum, to a new word.',
        ),
        N('It is a name. MEI.'),
        SA('It says Mei! It knows where she is!', 'happy'),
        N('The Catbus looks at you with its great grin. The door stays open.'),
      ],
      [
        ask(
          1,
          'science',
          'sound spreads out as it travels, so a far-off roar sounds fainter',
          '4-PS3-2',
          [
            N(
              'The roar rolls across the whole valley, but it is fainter far away. Why does a sound get quieter as it travels?',
            ),
          ],
          [
            o(
              'The sound spreads out in all directions, so each place gets less of it.',
              [
                N(
                  'Yes. Sound carries energy through the air, and it spreads and fades as it goes. A big roar still reaches far.',
                ),
              ],
              true,
            ),
            o('Sound gets tired and stops.', [
              N('Ha! Not tired, but it does fade.'),
              N('It spreads out in all directions, so each place gets less.'),
            ]),
            o('Sound only travels in one straight line.', [
              N('It spreads in all directions, like ripples on a pond.'),
              N('That spreading is why it gets quieter with distance.'),
            ]),
          ],
          'Learned that sound spreads out as it travels, so it gets fainter with distance.',
        ),
      ],
      [
        ch('climb', 'Climb aboard.', [
          N('You climb aboard. The seats are soft and warm and furry, and they purr.'),
        ]),
        ch('thank', 'Look back at the great spirit first.', [
          N(
            'He is sitting on the branch, grinning, enormous against the evening. You climb aboard, and the seats purr.',
          ),
        ]),
      ],
    ),
    sc(
      'a17-14-complete',
      [
        N(
          'The Catbus leaps. It runs along the power lines, over the rice, past people in the fields who feel only a gust of wind.',
        ),
        N('A scarecrow’s hat blows off. Nobody else can see it, nobody at all.'),
        SA('Hurry. Please hurry.'),
        N(
          'Satsuki sits at the front with her face to the glass. You sit beside her and hold her hand, and she lets you.',
        ),
        N(
          'It is harder than it looks, to let someone hold your hand when you are trying to be strong.',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'a think question: why can accepting comfort feel hard, and is it brave?',
          'CASEL: Self-awareness',
          [
            N(
              'Satsuki lets you hold her hand, though she has been so strong. Why can accepting comfort feel hard, and is it a brave thing to do? Think about it.',
            ),
          ],
          [
            o('It feels hard because it shows we are not fine, and that is brave.', [
              N('That’s a fair answer. Showing a soft side takes courage.'),
              N('Satsuki shows it by letting you hold on.'),
            ]),
            o('It is not brave, it is just sensible.', [
              N(
                'That’s a fair answer. Accepting help often is sensible, and sensible is a good thing to be.',
              ),
              N('And it can be brave too, when we have been holding out for a long time.'),
            ]),
            o('It depends who is offering.', [
              N('That’s a fair answer. We let in the people we trust.'),
              N('Satsuki has come to trust you, a little.'),
            ]),
          ],
          'Thought about why accepting comfort can feel hard, and whether it is brave.',
        ),
      ],
    ),
  ],
  [],
);

// ================================================================== A17-15 The Roadside Statues
const A15: EduQuest = quest(
  'a17-15',
  'The Roadside Statues',
  {
    'a17-15-s1': {
      goal: 'Find Mei.',
      hint: 'Get down from the Catbus at the row of statues by the road.',
    },
    'a17-15-s2': {
      goal: 'Watch the Catbus’s sign change again.',
      hint: 'Wait by the Catbus while Satsuki asks it.',
    },
  },
  [
    sc(
      'a17-15-statues',
      [
        N(
          'The Catbus comes down on a country road far out among the fields, where six small stone statues stand by the verge.',
        ),
        N(
          'They are Jizo, in a row, each in a red bib. Someone has put 2 fresh flowers at each one’s feet.',
        ),
        N(
          'Beside them, on the grass, sits Mei, with her knees up and her ear of corn in her lap. Your Nubbin is sitting next to her.',
        ),
        SA('Mei!'),
        ME('Onee-chan!', 'sad'),
        N(
          'Satsuki is out of the door before it is properly open. The sisters run into each other and hold on.',
        ),
        ME('I got lost. I’m sorry. I wanted to give Mum the corn.', 'sad'),
        SA('No, I’m sorry. I’m sorry I shouted. I’m so sorry, Mei.', 'sad'),
        N(
          'Your Nubbin comes to you and leans on your leg, hard, as if it has been holding something heavy all afternoon.',
        ),
      ],
      [
        ask(
          1,
          'maths',
          'equal groups: 6 statues with 2 flowers each make 12',
          '3.OA.A.1',
          [
            N(
              'There are 6 statues, and 2 fresh flowers at each one’s feet. How many flowers is that in all?',
            ),
          ],
          [
            o('12 flowers.', [N('Yes. Six groups of 2 is 6 × 2 = 12.')], true),
            o('8 flowers.', [
              N('8 is 6 + 2. We want 2 for each of the 6, so we count in twos.'),
              N('2, 4, 6, 8, 10, 12: 12 flowers.'),
            ]),
            o('26 flowers.', [
              N('26 looks like writing 2 and 6 side by side. We multiply.'),
              N('6 × 2 = 12 flowers.'),
            ]),
          ],
          'Used equal groups to find that 6 statues with 2 flowers each have 12 flowers.',
        ),
        ask(
          7,
          'sel',
          'a think question: does saying sorry fix everything?',
          'CASEL: Relationship skills',
          [
            N(
              'Mei says sorry for going off, and Satsuki says sorry for shouting. Does saying sorry fix everything? What else do we need? Think about it.',
            ),
          ],
          [
            o('Not everything, but it opens the door to making it better.', [
              N('That’s a fair answer. A sorry is a beginning, and then comes what we do.'),
              N('The hug that follows is part of it.'),
            ]),
            o('Yes, if we truly mean it.', [
              N('That’s a fair answer. A sincere sorry carries great weight.'),
              N('These two plainly mean every word.'),
            ]),
            o('No. We also need to do better afterwards.', [
              N('That’s a fair answer. A sorry means more when it is followed by a change.'),
              N('Satsuki may think twice before she shouts again.'),
            ]),
          ],
          'Thought about whether saying sorry fixes everything, and what else matters.',
        ),
      ],
      [
        ch('back', 'Stand back and let them have this.', [
          N(
            'You stand back by the Catbus. The sisters hold on to each other for a long time, and nobody hurries them.',
          ),
        ]),
        ch('nubbin', 'Pick your Nubbin up.', [
          N(
            'You pick your Nubbin up. It is warm and dusty, and it has walked a very long way on very short legs.',
          ),
        ]),
        ch('corn', 'Check the corn is all right.', [
          ME('I held it the whole way. It’s not even bent.', 'happy'),
          N('It isn’t. She has carried it all afternoon like an egg.'),
        ]),
      ],
    ),
    sc(
      'a17-15-sign',
      [
        SA('Mei. Do you still want to take Mum the corn?'),
        N('Mei nods, very hard.'),
        SA('Then…'),
        N(
          'Satsuki turns to the Catbus, and doesn’t quite know how to ask a bus a favour. She bows, a little, and asks anyway.',
        ),
        SA('Please, could you take us to Shichikokuyama Hospital?'),
        N(
          'The Catbus grins. Up top the sign rolls round again, and stops: SHICHIKOKUYAMA HOSPITAL.',
        ),
        ME('It says Mum! It says Mum’s hospital!', 'happy'),
        N(
          'The sisters climb in, Mei holding the corn up out of the way. The door stays open for you and your Nubbin.',
        ),
      ],
      [
        ask(
          3,
          'literacy',
          'vocabulary: a favour is a kind thing you ask someone to do for you',
          'L.3.4',
          [N('Satsuki doesn’t know how to ask a bus a favour. What is a favour?')],
          [
            o(
              'A kind thing you ask someone to do for you, which they don’t have to do.',
              [
                N(
                  'Yes. A favour is a kindness you ask for. That is why Satsuki says please and bows.',
                ),
              ],
              true,
            ),
            o('A kind of bus.', [
              N('Ha! No, though this bus is a rather special one.'),
              N('A favour is a kind thing someone does because you asked.'),
            ]),
            o('A piece of corn.', [
              N('Mei’s corn is a gift, not a favour.'),
              N('A favour is a kindness you ask someone to do for you.'),
            ]),
          ],
          'Learned that a favour is a kind thing you ask someone to do for you.',
        ),
      ],
      [
        ch('climb', 'Climb aboard.', [
          N(
            'You climb aboard with your Nubbin in your arms. It falls asleep on the purring seat at once.',
          ),
        ]),
        ch('look', 'Look back at the statues before you go.', [
          N(
            'The six small statues stand in their red bibs in the last of the light, keeping the road, as they always have.',
          ),
        ]),
      ],
    ),
    sc(
      'a17-15-complete',
      [
        N(
          'The Catbus runs over the hills in the dusk, through the pine woods, faster than any bus has ever gone.',
        ),
        N('Mei sits in Satsuki’s lap with the corn in hers. Neither of them lets go of anything.'),
        N(
          'Under its green husk, the corn is packed with hundreds of kernels. Each kernel is joined to a silky thread.',
        ),
        ME('Onee-chan, are we nearly there?'),
        SA('Nearly.', 'soft'),
      ],
      [
        ask(
          2,
          'science',
          'each silk thread of a corn ear is joined to one kernel, which grows when pollen reaches the thread',
          '3-LS1-1',
          [
            N(
              'Each silky thread on an ear of corn is joined to one kernel. When wind-blown pollen lands on a thread, that kernel can grow. So how many threads does a full ear need?',
            ),
          ],
          [
            o(
              'Hundreds, one for each kernel.',
              [N('Yes. One thread for each kernel, which is why an ear has so many silks.')],
              true,
            ),
            o('Just one thread for the whole ear.', [
              N('One thread would make only one kernel.'),
              N('A full ear needs hundreds of threads, one for each kernel.'),
            ]),
            o('No threads at all.', [
              N('The threads do the important job of catching pollen.'),
              N('A full ear has hundreds, one for each kernel.'),
            ]),
          ],
          'Learned that every silk thread on an ear of corn is joined to one kernel.',
        ),
      ],
    ),
  ],
  [],
);

// ================================================================== A17-16 Corn on the Sill
const A16: EduQuest = quest(
  'a17-16',
  'Corn on the Sill',
  {
    'a17-16-s1': {
      goal: 'Look in at the hospital window.',
      hint: 'Keep still. Nobody inside must know you’re there.',
    },
    'a17-16-s2': {
      goal: 'Leave the corn on the windowsill.',
      hint: 'Watch while the sisters send the corn across.',
    },
  },
  [
    sc(
      'a17-16-window',
      [
        N(
          'The Catbus settles in a tall pine outside the hospital, as quietly as a cat settling on a wall.',
        ),
        N(
          'Through its window, and through the open window of the hospital, you can see the room and the bed.',
        ),
        N(
          'Mrs Kusakabe is sitting up, and Mr Kusakabe is sitting beside her. He came straight from town, and still has his bag.',
        ),
        N('She is laughing at something he has said. She looks tired, but she is laughing.'),
        MO('You needn’t have come all this way. It’s only a cold. The doctor’s fussing.', 'happy'),
        FA('You’d have come, if it were me.'),
        MO(
          'I just wanted to see the girls this weekend. That’s all. I wanted to see them so much.',
          'soft',
        ),
        N(
          'In the Catbus, Satsuki has both hands over her mouth. Mei is smiling, with tears on her face, holding the corn.',
        ),
      ],
      [
        notice(
          4,
          'health',
          'a cold is caused by a virus; it goes away with rest and drinks, and washing hands stops it spreading',
          'CASEL: Self-management',
          [
            N(
              'A cold is caused by a tiny germ called a virus. It usually goes away in a week or so, with rest, warm drinks and sleep.',
            ),
            N(
              'Antibiotics don’t work on colds. Washing your hands often does help stop a cold spreading.',
            ),
          ],
          'Learned that a cold is caused by a virus and goes away with rest, while handwashing stops it spreading.',
        ),
      ],
      [
        ch('quiet', 'Stay quiet. Let them look.', [
          N(
            'You don’t make a sound, and neither does the Catbus. It holds its breath, which for a bus is a lot of breath.',
          ),
        ]),
        ch('nubbin', 'Lift your Nubbin up so it can see.', [
          N(
            'You lift your Nubbin to the glass. It looks for a long time at the lady who stroked its head without looking.',
          ),
        ]),
      ],
    ),
    sc(
      'a17-16-corn',
      [
        SA('We can’t go in. We’re not meant to be here. And how would we explain a Catbus?'),
        SA('We’ll leave the corn, Mei. Here. Write on it.'),
        N(
          'Mei can’t write yet. Satsuki holds her hand round a twig, and together they scratch into the husk, slowly, letter by letter.',
        ),
        N(
          'The Catbus stretches out one long, long paw from the pine, and sets the corn on the windowsill without a sound.',
        ),
        MO('I thought I saw Satsuki and Mei just now. In that pine tree. Smiling at me.', 'think'),
        FA('Did you? Well. Look at this.'),
        N(
          'He picks up the ear of corn from the sill and turns it over. Scratched into the husk, in two hands at once: To Mother.',
        ),
        N('He looks out at the dark pine for a long moment, and smiles, and doesn’t say anything.'),
      ],
      [
        ask(
          7,
          'literacy',
          'theme: small acts can carry big feelings',
          'RL.4.2',
          [
            N(
              'The sisters can’t go in, so they send an ear of corn with “To Mother” scratched on it. What big idea does this small act show?',
            ),
          ],
          [
            o(
              'Love can be shown through small, careful acts.',
              [N('Yes. Two words and a gift from the field say more than a long speech.')],
              true,
            ),
            o('Corn is better than flowers.', [
              N('It is a lovely gift, but the idea is about what the gift means.'),
              N('Love can be shown through small, careful acts.'),
            ]),
            o('You should never visit hospitals.', [
              N('Not at all. The story shows how much visiting matters.'),
              N('Love can be shown through small, careful acts.'),
            ]),
          ],
          'Identified a theme: small, careful acts can carry big feelings.',
        ),
      ],
    ),
    sc(
      'a17-16-corn-done',
      [
        N(
          'The Catbus slips out of the pine as quietly as it came, and you are flying home over the dark hills.',
        ),
        N(
          'Mei falls asleep before the first field. Satsuki watches the hospital lights until they’re gone.',
        ),
        N('They grow small and dim, then smaller, then are only one yellow point, then nothing.'),
        N('Satsuki keeps watching the place where they were.'),
      ],
      [
        ask(
          3,
          'science',
          'a light looks smaller and fainter the further away it is',
          '1-PS4-2',
          [
            N(
              'The hospital lights shrink and fade as you fly away. Are they really getting smaller and dimmer?',
            ),
          ],
          [
            o(
              'No. They only look smaller and fainter because they are further away.',
              [
                N(
                  'Yes. The lamp is the same; the light reaching your eyes is less, so it looks smaller and dimmer.',
                ),
              ],
              true,
            ),
            o('Yes, someone is turning them off.', [
              N('A good guess, but it is only the distance.'),
              N('They look smaller and fainter because they are further away.'),
            ]),
            o('Yes, lights always shrink at night.', [
              N('Lights are the same size all the time.'),
              N('It is the distance that makes them look smaller and fainter.'),
            ]),
          ],
          'Learned that far-away lights only look smaller and fainter because of distance.',
        ),
      ],
    ),
    sc(
      'a17-16-complete',
      [
        N(
          'The Catbus sets you down at the old house gate. Granny is on the step with the lamp, where she has been all evening.',
        ),
        N('She doesn’t ask. She grabs Mei, and then Satsuki, and then, for some reason, you.'),
        GR('You bad girl. You good girl. Oh, the pair of you. Oh, the three of you.', 'soft'),
        N(
          'Later in the summer Mrs Kusakabe comes home. It was only a cold, and she is getting well.',
        ),
        N(
          'She comes up the road from the bus stop, slowly, and the girls run down to meet her. You watch from Granny’s step.',
        ),
        N(
          'Then the page goes soft under your hand, and it is the Grove, with Nova’s atlas on your knee.',
        ),
        N(
          'Your Nubbin is still wearing its leaf. By the lane there is a bench like a country bus stop, and on the shelf an ear of corn, dried gold.',
        ),
      ],
      [
        ask(
          3,
          'sel',
          'a think question: why did the sisters leave the corn instead of going in?',
          'CASEL: Responsible decision-making',
          [
            N(
              'The sisters could have gone in, but they left the corn on the sill. Why might they have chosen that? Think about it.',
            ),
          ],
          [
            o('They knew they weren’t meant to be there, and wanted to respect the rules.', [
              N('That’s a fair answer. Satsuki says so herself.'),
              N('It shows a careful, responsible kind of love.'),
            ]),
            o('They wanted their mother to rest, not be surprised.', [
              N(
                'That’s a fair answer. A surprise can be lovely, but rest matters for a body that is mending.',
              ),
              N('It was a kind thing to think of.'),
            ]),
            o('They wanted the gift to be the surprise.', [
              N(
                'That’s a fair answer. A gift with no giver in sight is a special kind of delight.',
              ),
              N('Mr Kusakabe smiled at it.'),
            ]),
          ],
          'Thought about why the sisters left the corn instead of going in, and what that shows.',
        ),
        ask(
          6,
          'social-studies',
          'life in the 1950s countryside compared with today',
          'D2.His.2.K-2',
          [N('Which of these did people in the 1950s countryside use to send news or get water?')],
          [
            o(
              'A telegram, a crank telephone and a hand pump.',
              [
                N(
                  'Yes. They are all in this story, and none is quaint to the people who used them. They were everyday tools.',
                ),
              ],
              true,
            ),
            o('A smartphone and a video call.', [
              N('Those came decades later.'),
              N('A telegram, a crank telephone and a hand pump were the tools of the time.'),
            ]),
            o('Email and a washing machine tap.', [
              N('Email came much later, and few country houses had running taps.'),
              N('A telegram, a crank telephone and a hand pump were the tools of the time.'),
            ]),
          ],
          'Compared the tools of 1950s country life, such as telegrams and hand pumps, with those of today.',
        ),
      ],
    ),
  ],
  [],
);

const QUESTS: EduQuest[] = [A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, A13, A14, A15, A16];

// ================================================================== variants
const HUNT_BIKE: Line[] = [
  N('Kanta’s uncle’s bicycle is very old and very fast downhill.'),
  N('You ride on the carrier, holding your Nubbin and Kanta’s shirt.'),
];

const A17_VARIANTS_READER: EduScene[] = [
  // ---------------------------------------------------------------- A17-9 step 2 (hunt)
  sc(
    'a17-09-wait-hunt',
    [
      N(
        'Mei is asleep on Satsuki’s back. The rain drips off the edge of the shelter, steady as a clock.',
      ),
      N('Your Nubbin, under the shelter, slowly turns its head to the right.'),
      N(
        'Next to Satsuki, something is standing in the rain. You hear its claws first, on the wet road.',
      ),
      N(
        'You can’t see past Satsuki and her umbrella. You see two feet: grey, enormous, with claws like garden forks.',
      ),
      N(
        'The rain runs off something high above, and drips on to the feet. One of them shifts its weight, like someone waiting.',
      ),
      N(
        'You lean, a little, to see round the umbrella. The feet shift away, politely, the way people do at bus stops.',
      ),
    ],
    [
      doit(
        0,
        'music',
        'keep a steady beat, four counts at a time',
        'RL.2.4',
        'edu:clap:beat:rain-four',
        [
          N('Listen to the drips from the shelter edge. They fall at a steady beat, like a pulse.'),
          N('Clap along: one, two, three, four. Keep it even, and don’t rush.'),
        ],
        'Clapped a steady beat in groups of four to match dripping rain.',
      ),
    ],
    [
      ch('lean', 'Lean further to see.', [
        N(
          'You lean further, and the feet move further. Whatever it is, it isn’t ready to be looked at by you, not yet.',
        ),
      ]),
      ch('still', 'Stand still and look at the road.', [
        N(
          'You stand still and look at the road, as people do at bus stops. Beside you, something huge does the same.',
        ),
      ]),
    ],
  ),
  // ---------------------------------------------------------------- A17-11 step 2 (s1Done)
  sc(
    'a17-11-dance-charm',
    [
      N('Round the bed you all go, slowly: arms up, bend, arms up, bend. Nobody says a word.'),
      N(
        'At the edge of the bed your Nubbin stops dancing. It is digging, with both paws, a little hole beside the girls’ rows.',
      ),
      N(
        'It looks up at you, and then at the acorn on its loop of string round your neck: Moss’s acorn charm.',
      ),
      N(
        'You untie the acorn from the string and put it in the hole. Your Nubbin pats the earth down over it, very firmly.',
      ),
      N(
        'A shoot comes up out of the earth, then another. Then all of them together, and one more, darker, from the little hole.',
      ),
      N(
        'They rise with his arms, twisting round each other, into a tree as tall as the camphor on the hill.',
      ),
      SA('We did it. We did it!', 'happy'),
    ],
    [
      ask(
        0,
        'maths',
        'a repeating pattern: up, bend, up, bend',
        '4.OA.C.5',
        [N('The dance goes up, bend, up, bend, and on. What is the 9th move?')],
        [
          o(
            'Up.',
            [
              N(
                'Yes. The odd moves, the 1st, 3rd, 5th, 7th and 9th, are all “up”, and the even moves are “bend”.',
              ),
            ],
            true,
          ),
          o('Bend.', [
            N('Let’s write it out: 1 up, 2 bend, 3 up, 4 bend, 5 up, 6 bend, 7 up, 8 bend, 9 …'),
            N('The 9th is up.'),
          ]),
          o('Jump.', [
            N('Jump isn’t in this dance.'),
            N('The pattern is up, bend, and the 9th is up.'),
          ]),
        ],
        'Continued a repeating pattern by rule: odd moves up, even moves bend.',
      ),
      ask(
        4,
        'science',
        'an acorn grows into an oak, which takes decades to make acorns of its own',
        '3-LS1-1',
        [
          N(
            'You planted Moss’s acorn in the little hole. If it grows into an oak, how long before it makes acorns of its own?',
          ),
        ],
        [
          o(
            'Often twenty to fifty years.',
            [N('Yes. An oak is slow to grow up, but it may live for hundreds of years.')],
            true,
          ),
          o('About a week.', [
            N('A seedling can sprout in weeks, but a tree takes much longer.'),
            N('It is often twenty to fifty years before an oak makes acorns.'),
          ]),
          o('Never, an acorn cannot grow.', [
            N('An acorn is a seed, and given soil, water and time, it can grow.'),
            N('It is often twenty to fifty years before an oak makes acorns.'),
          ]),
        ],
        'Learned that an oak takes many years to grow up and make acorns of its own.',
      ),
    ],
    [
      ch('cheer', 'Cheer with Satsuki and Mei.', [
        N(
          'You cheer. The great spirit looks round at the noise, and grins, a grin as wide as the hedge.',
        ),
      ]),
      ch('lie', 'Lie down in the grass by your Nubbin and look up.', [
        N(
          'You lie down by your Nubbin and look up. Somewhere up there, among all the other leaves, are some that are oak.',
        ),
      ]),
    ],
  ),
  // ---------------------------------------------------------------- A17-11 complete (s1Done)
  sc(
    'a17-11-complete-oak',
    [
      N(
        'You wake on Granny’s floor at sunrise, with your Nubbin asleep on your chest. Your socks have grass on them.',
      ),
      N(
        'Across the hedge, Satsuki and Mei are already out on the veranda, staring at the garden. There is no great tree.',
      ),
      N(
        'But in the seed bed, in rows and in clumps, there are shoots. Little green ones, just up.',
      ),
      SA('It was a dream! But it wasn’t!', 'happy'),
      ME('We did it! We did it!', 'happy'),
      N(
        'Beside the bed, where you planted the acorn, the earth is smooth and bare. There is nothing there at all.',
      ),
      N(
        'The string round your neck is empty, and very light. Your Nubbin looks at it, and then up at the hill, as if it knows something.',
      ),
    ],
    [
      ask(
        5,
        'science',
        'a seed sends out its root first, underground, before any shoot shows',
        '2-LS2-1',
        [
          N(
            'Where the acorn is planted, the earth is smooth and bare. Is it doing nothing? What is happening underground first?',
          ),
        ],
        [
          o(
            'It is growing a root first, which goes down before any shoot comes up.',
            [N('Yes. The root anchors the seed and drinks water. The shoot comes later.')],
            true,
          ),
          o('Nothing at all.', [
            N('A lot goes on out of sight.'),
            N('The seed grows a root first, underground, long before a shoot shows.'),
          ]),
          o('It is growing leaves already, hidden.', [
            N('Leaves come after the shoot reaches the light.'),
            N('The root grows first, underground.'),
          ]),
        ],
        'Learned that a seed grows a root underground first, before any shoot shows.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A17-14 (hunt)
  sc(
    'a17-14-tunnel-hunt',
    [
      N(
        'Satsuki runs into the old house garden, straight at the hedge, and goes in at the gap on her hands and knees.',
      ),
      N(
        'You dive in after her. For one moment it is the tunnel, green and gold, with Satsuki’s heels ahead of you.',
      ),
      N(
        'Then the branches close in front of your face. It is a hedge, just a hedge, and you are stuck in it.',
      ),
      N('By the time you back out, scratched, there is no sound from the other side at all.'),
      N(
        'A bicycle bell rings in the lane. Kanta, on a bicycle much too big for him, stops with one foot down.',
      ),
      KA('Where’s Satsuki? I saw her run in here.'),
      Y('She’s gone to get help. Somewhere I can’t follow.'),
      KA('Then we look on our own. Get on. My uncle’s bike. He doesn’t know.'),
    ],
    [
      ask(
        6,
        'sel',
        'asking for help clearly: say what happened and what you need',
        'CASEL: Relationship skills',
        [
          N(
            'You tell Kanta where Satsuki went, and he offers his bicycle. What made it easy for him to help?',
          ),
        ],
        [
          o(
            'You said what happened, so he knew what to do.',
            [N('Yes. A clear message lets a helper act at once.')],
            true,
          ),
          o('You didn’t say anything.', [
            N('You did say something, and that helped.'),
            N('Saying what happened lets a helper know what to do.'),
          ]),
          o('He was already planning it.', [
            N('He may have been, but you made it easy.'),
            N('Saying what happened lets a helper know what to do.'),
          ]),
        ],
        'Learned that saying clearly what happened makes it easy for a helper to act.',
      ),
    ],
    [
      ch('get-on', 'Get on the back.', [
        N(
          'You climb on the carrier with Kanta’s schoolbag digging into your knees, and he pushes off.',
        ),
      ]),
      ch('hedge', 'Look at the hedge once more.', [
        N('You look back at the hedge. You did go looking for the way in, and it remembers.'),
      ]),
    ],
  ),
  sc(
    'a17-14-tunnel-hunt-done',
    [
      N('Kanta pedals hard along the lane, standing up, shouting Mei’s name at every turning.'),
      N('He rides 2 kilometres in 10 minutes, and does not slow.'),
      N('Your Nubbin hangs on to your sleeve, ears flat in the wind.'),
      N('Fields, then a pond, then a bridge, go by in a blur.'),
    ],
    [
      ask(
        1,
        'maths',
        'distance, time and rate: 2 km in 10 minutes is 6 km in 30 minutes',
        '4.MD.A.2',
        [
          N(
            'Kanta rides 2 kilometres in 10 minutes. If he keeps that pace, how far does he go in 30 minutes?',
          ),
        ],
        [
          o(
            '6 kilometres.',
            [N('Yes. 30 minutes is three lots of 10 minutes, and 3 × 2 = 6 kilometres.')],
            true,
          ),
          o('4 kilometres.', [
            N('4 km would be 20 minutes’ riding.'),
            N('30 minutes is three lots of 10, so 3 × 2 = 6 kilometres.'),
          ]),
          o('12 kilometres.', [
            N('12 km would be 60 minutes’ riding.'),
            N('30 minutes is three lots of 10, so 3 × 2 = 6 kilometres.'),
          ]),
        ],
        'Used a steady rate: 2 km in 10 minutes gives 6 km in 30 minutes.',
      ),
    ],
  ),
  sc(
    'a17-14-call-hunt',
    [
      N('From the hill behind you comes a roar. It rolls out over the whole valley like thunder.'),
      KA('What was that? Thunder? There’s no clouds.', 'shock'),
      N(
        'A wind comes over the rice from behind you. The rice bends flat in a long line, as if something huge is running across it.',
      ),
      N(
        'Two yellow lights go over your heads, along the power lines, and away towards the hills. Nobody in the fields looks up.',
      ),
      KA('Did you see that? What did you see?'),
      N('Up top, as it goes, there is a sign. You can just read it: MEI.'),
      Y('That way. Follow it. Follow the wind.'),
    ],
    [
      ask(
        1,
        'science',
        'sound travels about 340 metres a second in air, so a distant roar arrives seconds later',
        '4-PS3-2',
        [
          N(
            'Sound travels about 340 metres every second. The roar came from a hill 3,400 metres away. About how many seconds did it take to reach you?',
          ),
        ],
        [
          o(
            'About 10 seconds.',
            [N('Yes. 3,400 ÷ 340 = 10, the same sum people use to guess how far away thunder is.')],
            true,
          ),
          o('About 1 second.', [
            N('In 1 second sound goes only 340 metres.'),
            N('3,400 ÷ 340 = 10 seconds.'),
          ]),
          o('No time at all.', [
            N('Sound takes real time to travel, unlike what it seems.'),
            N('3,400 ÷ 340 = 10 seconds.'),
          ]),
        ],
        'Used speed of sound (about 340 m per second) to work out how long a sound takes to arrive.',
      ),
    ],
    [
      ch('follow', 'Point Kanta after the lights.', [
        KA('That’s the old road. Out by the statues. Hold on!'),
        N('He stands on the pedals. The bicycle rattles like a tin of nails.'),
      ]),
      ch('kanta', 'Tell Kanta what you saw.', [
        KA('A bus. Shaped like a cat. Running on the wires.'),
        N('He doesn’t laugh. He turns the bicycle that way, and pedals.'),
      ]),
    ],
  ),
  sc(
    'a17-14-call-hunt-done',
    [
      N('The wind dies away ahead of you.'),
      N('Kanta keeps pedalling the way it went, and doesn’t ask any more questions.'),
      N('He has seen the sign, and the lights, and the flattened rice. He has not said a word.'),
      N('His face is set, as if he has made up his mind about something.'),
    ],
    [
      ask(
        2,
        'literacy',
        'inference: why Kanta stops asking questions',
        'RL.3.3',
        [N('Kanta keeps pedalling and stops asking questions. What does that tell us about him?')],
        [
          o(
            'He has decided to trust you, even though it sounds impossible.',
            [N('Yes. His silence is a kind of belief, and it comes with action.')],
            true,
          ),
          o('He has lost interest.', [
            N('A boy who pedals faster has not lost interest.'),
            N('He has decided to trust you, and shows it by riding on.'),
          ]),
          o('He is angry with you.', [
            N('His face is set, but he is not angry with you.'),
            N('He has decided to trust you.'),
          ]),
        ],
        'Used a character’s actions and silence to infer that he has decided to trust someone.',
      ),
    ],
  ),
  sc(
    'a17-14-complete-hunt',
    [
      N(
        'The old road runs out between the fields, white in the dusk. Kanta is breathing like a pump, and doesn’t slow down.',
      ),
      KA('If she’s hurt. If she’s fallen in a ditch.', 'sad'),
      Y('She isn’t. My Nubbin’s with her.'),
      KA('Your Nubbin’s the size of a rice ball.'),
      Y('It’s with her.'),
      N('Kanta doesn’t answer. He pedals faster.'),
    ],
    [
      ask(
        4,
        'sel',
        'a think question: why keep trusting someone when you have doubts?',
        'CASEL: Responsible decision-making',
        [
          N(
            'Kanta doubts that a Nubbin can protect Mei, but he pedals faster anyway. Why do people act on trust when they still have doubts? Think about it.',
          ),
        ],
        [
          o('Because doing something is better than doing nothing.', [
            N('That’s a fair answer. Action can be a way of coping with worry.'),
            N('Kanta’s pedalling is very much that.'),
          ]),
          o('Because they trust the person, even without proof.', [
            N('That’s a fair answer. Trust sometimes goes ahead of proof.'),
            N('He has seen enough of you to take a chance.'),
          ]),
          o('Because they have nothing to lose.', [
            N('That’s a fair answer. When someone is missing, any chance is worth taking.'),
            N('Kanta’s face shows how much he cares.'),
          ]),
        ],
        'Thought about why people act on trust when they still have doubts.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A17-15 (hunt)
  sc(
    'a17-15-statues-hunt',
    [
      N(
        'The bicycle comes round a bend, and there by the verge stands a row of six small stone statues in red bibs.',
      ),
      N('They are Jizo, keeping the road. Someone has put fresh flowers at their feet.'),
      N('Each bib is a square of red cloth, about 30 centimetres across.'),
      N(
        'Beside them, in a whirl of dust and leaves, Satsuki and Mei are holding each other tight. Mei still has her corn.',
      ),
      N(
        'Behind them, by the road, something is waiting, huge and furry and grinning, with its door open.',
      ),
      KA('Mei! She’s there! She’s all right! Mei!', 'happy'),
      N('Kanta can see the girls, but not what they are standing next to. You can.'),
      N(
        'Your Nubbin comes running down the road to you, as fast as its legs go, and throws itself at your shins.',
      ),
    ],
    [
      ask(
        2,
        'maths',
        'units of length: 6 × 30 cm = 180 cm = 1 m 80 cm',
        '4.MD.A.1',
        [
          N(
            'Each bib is about 30 centimetres of cloth. Laid end to end, how long would the six bibs be, in metres and centimetres?',
          ),
        ],
        [
          o(
            '1 metre 80 centimetres.',
            [N('Yes. 6 × 30 = 180 centimetres, and 100 centimetres make a metre, so 1 m 80 cm.')],
            true,
          ),
          o('30 centimetres.', [
            N('That is only one bib.'),
            N('6 × 30 = 180 centimetres, which is 1 m 80 cm.'),
          ]),
          o('6 metres.', [
            N('6 metres would be 600 centimetres. Six bibs make 180.'),
            N('6 × 30 = 180 centimetres, which is 1 m 80 cm.'),
          ]),
        ],
        'Used multiplication and metres and centimetres: 6 × 30 cm = 1 m 80 cm.',
      ),
      ask(
        6,
        'sel',
        'relief and joy after a scare: Kanta’s feelings as well as the sisters’',
        'CASEL: Social awareness',
        [
          N(
            'Kanta shouts for Mei, and the sisters hold on to each other. What feeling do they all share?',
          ),
        ],
        [
          o(
            'Relief, a big breath out after a long fright.',
            [N('Yes. Relief is the feeling of a long worry letting go.')],
            true,
          ),
          o('Boredom.', [
            N('Nobody is bored after a night like this.'),
            N('They share relief, after a long fright.'),
          ]),
          o('Anger.', [
            N('Some of them may be a little cross, but mostly it is something gentler.'),
            N('They share relief after a long fright.'),
          ]),
        ],
        'Named relief as the feeling shared after a long fright.',
      ),
    ],
    [
      ch('nubbin', 'Pick your Nubbin up.', [
        N(
          'You pick your Nubbin up. It is warm and dusty, and it has walked a very long way on very short legs.',
        ),
      ]),
      ch('wave', 'Wave to the sisters.', [
        N(
          'Satsuki sees you over Mei’s head. She can’t wave, with her arms full of sister, so she nods instead, fiercely.',
        ),
      ]),
    ],
  ),
  sc(
    'a17-15-sign-hunt',
    [
      N('You get off the bicycle and start towards them. It is not very far; it is just too far.'),
      N(
        'Satsuki turns to the waiting thing, and bows a little, and asks it something you can’t hear.',
      ),
      N(
        'Up top, its sign rolls round, and stops. You can read it from here: SHICHIKOKUYAMA HOSPITAL.',
      ),
      N(
        'The sisters climb in, Mei holding up the corn, and the door closes. The Catbus looks at you, and grins, and leaps.',
      ),
      N(
        'A gust of wind goes over the six statues and away towards the hills. The flowers at their feet nod, and are still.',
      ),
      KA('Where did they go? They were just there. They were just there!', 'shock'),
      Y('The hospital. They’ve gone to see their mother.'),
      KA('That’s miles. How can they…', 'think'),
    ],
    [
      ask(
        4,
        'literacy',
        'point of view: what the scene looks like to Kanta and to you',
        'RL.3.6',
        [
          N(
            'You can see the Catbus, but Kanta can’t. How does the same moment look different to the two of you?',
          ),
        ],
        [
          o(
            'You see a bus leap away; Kanta sees two girls vanish in a gust of wind.',
            [
              N(
                'Yes. Each of you tells the story from where you stand, so the same moment feels different.',
              ),
            ],
            true,
          ),
          o('They look exactly the same.', [
            N('They don’t: you know something Kanta does not.'),
            N('You see a bus leap away; Kanta sees two girls vanish in the wind.'),
          ]),
          o('Neither of you sees anything.', [
            N('Both of you see the girls go.'),
            N('You see a bus; Kanta sees only a gust of wind.'),
          ]),
        ],
        'Compared two points of view on the same moment: what you can see and what Kanta can see.',
      ),
    ],
    [
      ch('follow', '“We can go too.”', [
        KA('On my uncle’s bike. In the dark. Over the hill.'),
        N('He thinks about it for exactly one second.'),
        KA('Get on.'),
      ]),
      ch('granny', '“Somebody has to tell Granny.”', [
        N(
          'A farmer comes by with a handcart. Kanta shouts to him to run and tell Granny that Mei is found, and safe.',
        ),
        KA('There. Now get on. We’re going to the hospital.'),
      ]),
    ],
  ),
  sc(
    'a17-15-sign-hunt-done',
    [
      N(
        'The six statues stand in their red bibs in the last of the light, keeping the road, as they always have.',
      ),
      N(
        'Jizo statues like these stand beside roads all over Japan, because they are guardians of travellers and children.',
      ),
      N('People leave flowers, and sometimes a little cloth, to say thank you.'),
      N('You don’t touch them, or climb on them. You only bow.'),
    ],
    [
      notice(
        1,
        'social-studies',
        'Jizo statues stand by roads as guardians of travellers and children, and people treat them with respect',
        'D2.Civ.8.K-2',
        [
          N(
            'Roadside Jizo are cared for by the people who pass. Someone brings flowers and sweeps the ground.',
          ),
          N('It is a way a community shows it looks after its travellers and its children.'),
        ],
        'Learned that Jizo statues by roads are guardians of travellers, cared for by the community.',
      ),
    ],
  ),
  sc(
    'a17-15-complete-hunt',
    [
      ...HUNT_BIKE,
      N(
        'Up the long hill you walk it, and down the other side Kanta lets it fly, and your Nubbin’s ears blow straight back.',
      ),
      N(
        'You push, and grunt, and puff on the way up, then freewheel on the way down without a single pedal.',
      ),
      KA('I’m going to be in so much trouble.', 'happy'),
      N('He doesn’t sound as if he minds at all.'),
    ],
    [
      ask(
        3,
        'science',
        'gravity and friction: uphill needs a push, downhill gravity helps',
        '3-PS2-1',
        [
          N(
            'Going up the hill takes a hard push. Going down takes none. What changes between the two?',
          ),
        ],
        [
          o(
            'On the way up, gravity pulls against you; on the way down it pulls you along.',
            [
              N(
                'Yes. The same force, gravity, works against you uphill and for you downhill. Friction slows you in both.',
              ),
            ],
            true,
          ),
          o('The bicycle gets lighter.', [
            N('The bicycle weighs the same either way.'),
            N('Gravity pulls against you uphill, and along with you downhill.'),
          ]),
          o('The wind turns round.', [
            N('The wind may do something, but it is gravity that matters here.'),
            N('Gravity pulls against you uphill, and along with you downhill.'),
          ]),
        ],
        'Learned that gravity pulls against you going uphill and helps you going downhill.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A17-16 (hunt)
  sc(
    'a17-16-window-hunt',
    [
      N(
        'It is nearly dark when you reach the hospital. You stop on the road below, under the pines, with the bicycle ticking.',
      ),
      N(
        'One window above you is lit and open. Through it you can see Mr Kusakabe sitting on the edge of the bed.',
      ),
      N(
        'Mrs Kusakabe is sitting up, laughing at something he said. She looks tired, but she is laughing.',
      ),
      MO('You needn’t have come all this way. It’s only a cold. The doctor’s fussing.', 'happy'),
      FA('You’d have come, if it were me.'),
      N(
        'In the tall pine opposite the window, the branches sag, as if something heavy and furry were lying along them.',
      ),
      N('And on a branch, two small shapes are sitting very still: one in a yellow hat.'),
      KA('Is that them? Up the tree? How did they get up there?', 'shock'),
    ],
    [
      ask(
        3,
        'health',
        'a cold spreads through coughs and touch; washing hands helps stop it',
        'CASEL: Self-management',
        [
          N(
            'Mrs Kusakabe has a cold. How does a cold spread from person to person, and what helps stop it?',
          ),
        ],
        [
          o(
            'Through coughs, sneezes and touch; washing hands helps stop it.',
            [
              N(
                'Yes. Cold viruses travel on tiny droplets and on hands. Soap and water are real protection.',
              ),
            ],
            true,
          ),
          o('Through looking at someone.', [
            N('Looking can’t pass a cold on.'),
            N('Coughs, sneezes and touch spread it, and washing hands helps stop it.'),
          ]),
          o('Through moonlight.', [
            N('Moonlight is harmless.'),
            N('Coughs, sneezes and touch spread colds, and washing hands helps stop it.'),
          ]),
        ],
        'Learned that colds spread through coughs, sneezes and touch, and that washing hands helps.',
      ),
    ],
    [
      ch('shh', 'Shh him.', [
        N(
          'You put a finger to your lips. Kanta shuts his mouth so fast his teeth click, and stares up at the pine.',
        ),
      ]),
      ch('nubbin', 'Lift your Nubbin up so it can see.', [
        N(
          'You lift your Nubbin up. It looks for a long time at the lit window, and the lady who stroked its head without looking.',
        ),
      ]),
    ],
  ),
  sc(
    'a17-16-corn-hunt',
    [
      MO(
        'I just wanted to see the girls this weekend. That’s all. I wanted to see them so much.',
        'soft',
      ),
      N(
        'In the pine, something long and pale reaches out from the branches, slowly, towards the open window.',
      ),
      N(
        'When it draws back, there is an ear of corn on the windowsill. Nobody inside saw it come.',
      ),
      MO('I thought I saw Satsuki and Mei just now. In that pine tree. Smiling at me.', 'think'),
      FA('Did you? Well. Look at this.'),
      N(
        'He picks the corn up off the sill and turns it over. Scratched into the husk, in two hands at once: To Mother.',
      ),
      N(
        'He looks out at the dark pine a long moment, then down at the road, at two people and a Nubbin under the trees.',
      ),
      N('He lifts his hand, just a little. You lift yours.'),
    ],
    [
      ask(
        7,
        'literacy',
        'showing a character through action: Mr Kusakabe says nothing, but lifts his hand',
        'RL.4.3',
        [
          N(
            'Mr Kusakabe says nothing, but he lifts his hand to you. What does that small action show about him?',
          ),
        ],
        [
          o(
            'He understands, and is quietly saying thank you.',
            [
              N(
                'Yes. A writer can show a character’s feelings through what he does, without saying them.',
              ),
            ],
            true,
          ),
          o('He is waving goodbye for ever.', [
            N('It is a quieter gesture than that.'),
            N('He understands, and is quietly thanking you.'),
          ]),
          o('He is cross.', [
            N('A cross person wouldn’t lift a hand so gently.'),
            N('He understands, and is quietly thanking you.'),
          ]),
        ],
        'Read a small gesture as showing a character’s understanding and thanks.',
      ),
    ],
  ),
  sc(
    'a17-16-corn-hunt-done',
    [
      N(
        'A gust goes through the pine, and it springs back up straight. The two small shapes are gone.',
      ),
      N(
        'Two yellow lights go away over the hills towards home. Kanta watches them all the way, and says nothing at all.',
      ),
      N(
        'They grow small and faint, then smaller, then are only one point of yellow, then nothing.',
      ),
      N('Then there is only the dark, and the frogs.'),
    ],
    [
      ask(
        3,
        'science',
        'a light looks smaller and fainter the further away it is',
        '1-PS4-2',
        [
          N(
            'The yellow lights shrink and fade as they go. Are they really getting smaller and dimmer?',
          ),
        ],
        [
          o(
            'No. They only look smaller and fainter because they are further away.',
            [
              N(
                'Yes. The lamp is the same; the light reaching your eyes is less, so it looks smaller and dimmer.',
              ),
            ],
            true,
          ),
          o('Yes, someone is turning them off.', [
            N('A good guess, but it is only the distance.'),
            N('They look smaller and fainter because they are further away.'),
          ]),
          o('Yes, lights always shrink at night.', [
            N('Lights are the same size all the time.'),
            N('It is the distance that makes them look smaller and fainter.'),
          ]),
        ],
        'Learned that far-away lights only look smaller and fainter because of distance.',
      ),
    ],
  ),
  sc(
    'a17-16-complete-hunt',
    [
      ...HUNT_BIKE,
      N(
        'It is full dark when you reach the old house gate. Granny is on the step with the lamp, with both girls asleep against her.',
      ),
      GR('There you are. You bad boy. You good boy. Oh, the pair of you.', 'soft'),
      N('Kanta goes red to the ears, and is very busy with the bicycle.'),
      N(
        'Later in the summer Mrs Kusakabe comes home. It was only a cold, and she is getting well.',
      ),
      N(
        'Then the page goes soft under your hand, and it is the Grove, with Nova’s atlas on your knee.',
      ),
      N(
        'Your Nubbin is still wearing its leaf. By the lane there is a bench like a country bus stop, and on the shelf an ear of corn, dried gold.',
      ),
    ],
    [
      ask(
        3,
        'sel',
        'a think question: is it right to keep some wonders to yourself?',
        'CASEL: Responsible decision-making',
        [
          N(
            'Kanta and you go home having seen things nobody will believe. Is it right to keep some wonders to yourselves? Think about it.',
          ),
        ],
        [
          o('Yes, some things are more precious when they are kept.', [
            N('That’s a fair answer. A private wonder can be a small treasure.'),
            N('Kanta looks as if he agrees.'),
          ]),
          o('No, sharing makes wonder grow.', [
            N('That’s a fair answer. Shared joy often doubles.'),
            N('Mei will certainly be telling it, louder each time.'),
          ]),
          o('It depends who is listening.', [
            N('That’s a fair answer. The right listener makes all the difference.'),
            N('Granny, with her lamp, looks like a good one.'),
          ]),
        ],
        'Thought about whether to share or keep a private wonder, and who makes a good listener.',
      ),
      ask(
        5,
        'social-studies',
        'life in the 1950s countryside compared with today',
        'D2.His.2.K-2',
        [N('Which of these did people in the 1950s countryside use to send news or get water?')],
        [
          o(
            'A telegram, a crank telephone and a hand pump.',
            [
              N(
                'Yes. They are all in this story, and none is quaint to the people who used them. They were everyday tools.',
              ),
            ],
            true,
          ),
          o('A smartphone and a video call.', [
            N('Those came decades later.'),
            N('A telegram, a crank telephone and a hand pump were the tools of the time.'),
          ]),
          o('Email and a washing machine tap.', [
            N('Email came much later, and few country houses had running taps.'),
            N('A telegram, a crank telephone and a hand pump were the tools of the time.'),
          ]),
        ],
        'Compared the tools of 1950s country life, such as telegrams and hand pumps, with those of today.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- Grove keepsake scenes
  sc(
    'a17-grove-oak',
    [
      N('You step out of Nova’s atlas into the Grove. Something on the western hill has changed.'),
      N(
        'By the flat stone where Moss sits there is an oak. Not a sapling: a full-grown oak, its crown spread over half the hill.',
      ),
      N(
        'Moss is on his stone underneath it, looking up. He doesn’t look round when you come up the path.',
      ),
      N(
        'He looks for a long time. Long enough for your Nubbin to sit down, and then lie down, and then fall asleep.',
      ),
      M(
        'I planted one of those when the valley was young. It took four hundred years. You’ve been cheating.',
        'think',
      ),
    ],
    [
      ask(
        4,
        'sel',
        'a think question: how does teasing show fondness?',
        'CASEL: Relationship skills',
        [
          N(
            'Moss says, “You’ve been cheating.” He is teasing. How can teasing show that someone is fond of you? Think about it.',
          ),
        ],
        [
          o('A gentle tease says “I notice you, and I like you”.', [
            N('That’s a fair answer. A kind tease is a way of paying attention.'),
            N('Moss pays attention to everything.'),
          ]),
          o('It only works if both people are laughing.', [
            N('That’s a fair answer. Teasing has to be gentle, or it stops being kind.'),
            N('Moss’s tone is warm.'),
          ]),
          o('It can hide big feelings in a small joke.', [
            N(
              'That’s a fair answer. Moss is moved by the oak, and a joke is a safer way to say so.',
            ),
            N('He looks at it for a very long time.'),
          ]),
        ],
        'Thought about how gentle teasing can show fondness.',
      ),
      ask(
        4,
        'science',
        'an oak can live for hundreds of years',
        '3-LS1-1',
        [N('Moss says his own oak took four hundred years. How long can a healthy oak live?')],
        [
          o(
            'Often several hundred years, and sometimes more than a thousand.',
            [
              N(
                'Yes. Oaks are among the longest-lived trees in many lands, which is why they stand for whole histories.',
              ),
            ],
            true,
          ),
          o('About ten years.', [
            N('Ten years is a young sapling.'),
            N('Oaks often live for several hundred years.'),
          ]),
          o('Only as long as a person.', [
            N('A person’s lifetime is much shorter than an oak’s.'),
            N('Oaks often live for several hundred years.'),
          ]),
        ],
        'Learned that oaks can live for hundreds of years, sometimes over a thousand.',
      ),
    ],
    [
      ch('tell', 'Tell him where the acorn went.', [
        Y('It was Hazel’s acorn. I planted it somewhere. I had a lot of help.'),
        M('She always did get help. Never once asked for it, mind. It just turned up.', 'soft'),
      ]),
      ch('sit', 'Sit down on the stone beside him.', [
        N(
          'You sit beside him, and neither of you says anything. The oak creaks the way old trees do, though this one is new.',
        ),
      ]),
    ],
  ),
  sc(
    'a17-grove-oak-acorn',
    [
      M('It’s a good tree. Bad manners, growing that fast. Good tree.', 'soft'),
      N('Something drops through the leaves and lands in your hand. An acorn: the oak’s first.'),
      M(
        'There. It gives back. Put it on the string. Then something of hers is walking about the Grove again, and something of mine.',
        'soft',
      ),
      N('You thread the new acorn on to the old string. It fits as if it had been measured.'),
      N('Moss counts in centuries, the way other people count in weeks.'),
    ],
    [
      ask(
        4,
        'maths',
        'division: 400 years ÷ 100 = 4 centuries',
        '3.OA.A.3',
        [
          N(
            'A century is 100 years. Moss says his oak took 400 years. How many centuries is that?',
          ),
        ],
        [
          o('4 centuries.', [N('Yes. 400 ÷ 100 = 4, because 4 × 100 = 400.')], true),
          o('40 centuries.', [
            N('40 centuries would be 4,000 years.'),
            N('400 ÷ 100 = 4 centuries.'),
          ]),
          o('400 centuries.', [N('That would be 40,000 years.'), N('400 ÷ 100 = 4 centuries.')]),
        ],
        'Used division to convert 400 years into 4 centuries.',
      ),
    ],
  ),
  sc(
    'a17-grove-oak-sleeps',
    [
      N(
        'You step out of Nova’s atlas into the Grove. On the western hill, by the flat stone where Moss always sat, there is an oak.',
      ),
      N('Moss faded. That means he died: his body stopped working, and it will not start again.'),
      N('His flower grows by the flat stone.'),
      N(
        'The oak is full-grown, as if it had always been there. Its branches spread over the stone, and over his flower.',
      ),
      N('The shade falls exactly where he used to sit.'),
      N(
        'The Nubbins have found it already. They are asleep in a heap in its shade, all of them, breathing slowly together.',
      ),
      N('Something drops through the leaves and lands in your hand. An acorn: the oak’s first.'),
      N(
        'You thread it on to the old string, where his used to be. You sit down on the flat stone a while, and remember him.',
        'soft',
      ),
    ],
    [
      ask(
        7,
        'sel',
        'grief: what helps when we are sad that someone has died',
        'CASEL: Self-awareness',
        [
          N(
            'Moss has died, and it is natural to feel sad. What helps when we are sad that someone has died?',
          ),
        ],
        [
          o(
            'Remembering them with other people, and telling their stories.',
            [
              N(
                'Yes. Remembering together keeps them close, and sad feelings are allowed to come and go.',
              ),
            ],
            true,
          ),
          o('Pretending it did not happen.', [
            N('That is a very natural wish, but the sadness tends to wait.'),
            N('Remembering them with other people helps it ease.'),
          ]),
          o('Being alone and never speaking of it.', [
            N('Some quiet is good, but being alone with it all the time is hard.'),
            N('Remembering together, and telling their stories, helps.'),
          ]),
        ],
        'Learned that remembering someone with others helps when we are sad that they have died.',
      ),
      ask(
        4,
        'literacy',
        'how a setting detail carries feeling: the shade where Moss sat',
        'RL.4.3',
        [N('“The shade falls exactly where he used to sit.” Why might the writer tell us that?')],
        [
          o(
            'It makes the oak seem to keep his place for him, so we think of him.',
            [N('Yes. One small detail about a place can hold a lot of feeling.')],
            true,
          ),
          o('To tell us what time of day it is.', [
            N('Shade can tell the time, but that isn’t why it is here.'),
            N('The oak seems to keep Moss’s place, so we think of him.'),
          ]),
          o('Because shade is cool.', [
            N('It is, but the writer means more than that.'),
            N('The oak seems to keep Moss’s place, so we think of him.'),
          ]),
        ],
        'Explained how a detail of a setting can carry a feeling: the oak keeps Moss’s place.',
      ),
    ],
  ),
  sc(
    'a17-grove-camphor',
    [
      N(
        'You step out of Nova’s atlas into the Grove with a pot in your arms. In it is a young camphor tree, as high as your knee.',
      ),
      N(
        'Its leaves are glossy and new, and they smell clean and sharp, like a medicine chest kept in a forest.',
      ),
      N('Your Nubbin, still in its leaf hat, sits down beside the pot with its chin on its knees.'),
      N('It has learned how you wait for a tree. It means to be very good at it.'),
      N(
        'You find it a place by the window, where the light is good, and wonder what else it will want.',
      ),
    ],
    [
      ask(
        4,
        'science',
        'a potted plant needs light, water, and drainage so roots do not rot',
        '2-LS2-1',
        [N('Your young camphor tree is in a pot. Which set of things does it need to grow well?')],
        [
          o(
            'Sunshine, water when the soil is dry, and a pot that drains.',
            [
              N(
                'Yes. Roots need air as well as water, so a pot with drainage holes keeps them healthy.',
              ),
            ],
            true,
          ),
          o('Darkness and no water.', [
            N('A plant needs light and water to grow.'),
            N('Sunshine, water when dry and a pot that drains keep it well.'),
          ]),
          o('Water all day, every day.', [
            N('Too much water can rot the roots.'),
            N('Water when the soil is dry, in a pot that drains.'),
          ]),
        ],
        'Learned what a potted plant needs: light, water when dry, and drainage.',
      ),
      ask(
        3,
        'sel',
        'looking after something that grows slowly takes patient, regular care',
        'CASEL: Self-management',
        [
          N(
            'Your Nubbin has learned to wait for a tree. How can we look after something that grows slowly?',
          ),
        ],
        [
          o(
            'Care for it a little, regularly, and be patient.',
            [N('Yes. Small, regular care adds up, and patience is part of the job.')],
            true,
          ),
          o('Check on it every five minutes and poke it.', [
            N('Too much poking can hurt a young plant.'),
            N('A little regular care, and patience, works best.'),
          ]),
          o('Forget about it until it is big.', [
            N('Then it might not survive to get big.'),
            N('A little regular care, and patience, works best.'),
          ]),
        ],
        'Learned that growing something slowly takes small, regular care and patience.',
      ),
    ],
  ),
];

// ================================================================== exports
/** Reader versions of every scene in ATLAS_A17. */
export const EDU_A17_READER: EduQuest[] = QUESTS;

/** Reader versions of every scene in A17_VARIANTS. */
export const EDU_A17_READER_VARIANTS: EduScene[] = A17_VARIANTS_READER;

/** Every `edu:` check string used by the lessons above. */
export const CHECKS: string[] = ['edu:breathe:square:4', 'edu:clap:beat:rain-four'];
