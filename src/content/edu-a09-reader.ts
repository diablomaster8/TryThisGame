/**
 * The Learning Grove, reader band (ages 7–10): Atlas page A9, The Comet (Comet in Moominland, Finland).
 *
 * One EduScene per original scene in atlas-a09.ts (every step scene, every done scene, every
 * complete scene) plus the three variants, id `reader:<original id>`. Every choice keeps its
 * original id and `set` (a09-answer, a09-brought). See EDU-STYLE.md. British spelling.
 *
 *   A9-1  Strange Signs     Finland and its two languages; why round stones are round (4-ESS2-1); what a
 *                           comet is and why its tail points away from the Sun; multiplication (3.OA.A.1)
 *   A9-2  The Raft          perimeter (3.MD.D.8); “sound” has two meanings (L.3.4); why wood floats;
 *                           the compass; time intervals (3.MD.A.1); think: what makes something valuable?
 *   A9-3  Snufkin           pitch and vibration (1-PS4-1); needs and wants; echoes; unit fractions
 *                           (3.NF.A.1); similes (L.4.5); think: does owning more make us safer?
 *   A9-4  The Observatory   telling time to the minute (8:42 and 18 minutes to nine; 3.MD.A.1); how
 *                           telescopes and tail lengths work; sharing a worry; think: what do you say to a
 *                           frightened friend when you don’t know?
 *   A9-5  The Snork Maiden  weathering (4-ESS2-1); how plants defend themselves (4-LS1-1); returning
 *                           lost things; division (3.OA.A.3); think: is it brave to act before thinking?
 *   A9-6  The Snork         how meetings work; adding votes (1.OA.A.1); area (3.MD.C.7); think: is a
 *                           meeting always the best way to decide?
 *   A9-7  The Hemulen       life cycle (3-LS3 and 3-LS1-1); why butterflies rest at dusk; field notes;
 *                           lines of symmetry (4.G.A.3); think: is watching as good as owning?
 *   A9-8  The Dry Sea       tides and the Moon; days saved (2.OA.A.1); balance (3-PS2-1); shells and
 *                           how they protect (4-LS1-1); why a comet shines; think: say the scary thing?
 *   A9-9  The Octopus       an octopus’s body (4-LS1-1); 8 − 2 (1.OA.A.1); rules; “even” (L.3.4); think: was it
 *                           fair to frighten the octopus?
 *   A9-10 The Race Home     distance and time (4.MD.A.2); tornadoes; air resistance; counting (2.OA.A.1);
 *                           think: useful or beautiful?
 *   A9-11 The Cave          emergency kits; time intervals (3.MD.A.1); suspense; comfort; think: what do
 *                           you carry?
 *   A9-12 The Night It Missed  real comets (Halley); tides; sleep for children; migrating birds; call and
 *                           response; theme (RL.4.2); thank you in Finnish and Swedish
 *
 * Facts used are well established: a comet is a ball of ice and dust; near the Sun it releases gas and
 * dust that form tails pointing away from the Sun; Halley’s comet returns about every 76 years;
 * Finland’s two national languages are Finnish and Swedish; Tove Jansson, a Swedish-speaking Finn,
 * wrote the books; an octopus has eight arms, three hearts and no bones; wood floats because it is less
 * dense than water; butterflies are cold-blooded and rest when it cools; tides come from the Moon’s pull.
 * Nothing is lifted from the books. The care notes are kept: worry is named and never mocked, nobody is
 * hurt, the octopus goes home unharmed, both Hemulens are “he”, and a dress is never the joke.
 */
import type { EduQuest, EduScene, Lesson, GlossaryEntry } from './types';
import type { Line, Choice } from '../config/story';

type Mood = NonNullable<Line['mood']>;

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const Y = say('you');
const MT = say('a09-moomintroll');
const SN = say('a09-sniff');
const MM = say('a09-moominmamma');
const MP = say('a09-moominpappa');
const MU = say('a09-muskrat');
const SK = say('a09-snufkin');
const PR = say('a09-professor');
const P2 = say('a09-professor-2');
const SM = say('a09-snork-maiden');
const SO = say('a09-snork');
const HE = say('a09-hemulen');
const H2 = say('a09-hemulen-2');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];
type Domain = Lesson['domain'];

/** One answer option. `best` marks the answer the lesson teaches; a think question has no best. */
const opt = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };
const std = (s?: string): { standard?: string } => (s ? { standard: s } : {});

const ask = (
  domain: Domain,
  skill: string,
  after: number,
  prompt: Line[],
  options: Opt[],
  parentNote: string,
  standard?: string,
): Beat => ({
  domain,
  skill,
  ...std(standard),
  kind: 'ask',
  after,
  prompt,
  options,
  parentNote,
});
const note = (
  domain: Domain,
  skill: string,
  after: number,
  lines: Line[],
  parentNote: string,
  standard?: string,
): Beat => ({
  domain,
  skill,
  ...std(standard),
  kind: 'notice',
  after,
  lines,
  parentNote,
});
const doit = (
  domain: Domain,
  skill: string,
  after: number,
  check: string,
  lines: Line[],
  parentNote: string,
  standard?: string,
): Beat => ({
  domain,
  skill,
  ...std(standard),
  kind: 'do',
  after,
  check,
  lines,
  parentNote,
});

/** Builds `reader:<of>`; `after: -1` means after the last line. Lessons are numbered in play order. */
const scene = (of: string, lines: Line[], beats: Beat[], choices?: Choice[]): EduScene => {
  const id = `reader:${of}`;
  const s: EduScene = {
    id,
    of,
    band: 'reader',
    lines,
    lessons: beats
      .map((b) => (b.after < 0 ? { ...b, after: lines.length - 1 } : b))
      .sort((a, b) => a.after - b.after)
      .map((b, i) => ({ id: `${id}-l${i + 1}`, ...b })),
  };
  if (choices) s.choices = choices;
  return s;
};

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
  notes: string,
): EduQuest => ({
  id: `reader:${of}`,
  of,
  band: 'reader',
  title,
  goals,
  scenes,
  glossary,
  notes,
});

// ================================================================== A9-1 Strange Signs
const A01 = quest(
  'a09-01',
  'Strange Signs',
  {
    'a09-01-s1': {
      goal: 'Step into the valley on the atlas page and meet whoever lives in the tall blue house.',
      hint: 'Touch the blue house on the page, then follow the path to the garden gate.',
    },
    'a09-01-s2': {
      goal: 'Follow Sniff’s secret path down to the shore and see what is wrong with the sea.',
      hint: 'Take the narrow path behind the woodshed. It goes through the bushes, not round them.',
    },
    'a09-01-s3': {
      goal: 'Ask the Muskrat in the hammock what the grey dust means.',
      hint: 'He is in the hammock between the two birch trees, and he will not be getting out of it.',
    },
  },
  [
    scene(
      'a09-01-valley',
      [
        N(
          'Nova’s atlas falls open at a green valley by the sea, with a tall blue house in it like a stove that grew.',
        ),
        N('You touch the chimney. The page smells of wet grass, and then so does the air.'),
        N('It is morning, but a grey one. Everything looks dusted with ash and forgotten.'),
        N(
          'A round white someone is standing in the garden, holding a cup and frowning at the sky.',
        ),
        MT(
          'Oh! Hello. Are you a visitor? Mamma will be pleased. She likes visitors best on grey days.',
          'happy',
        ),
        N(
          'A smaller, sharper someone pops out from behind the water butt and looks straight at your Nubbin.',
        ),
        SN(
          'What’s that? Is it valuable? It looks valuable. It looks like it would fit in a pocket.',
          'think',
        ),
        MT('That’s Sniff. He means hello.'),
        SN('I mean hello AND is it valuable.'),
      ],
      [
        ask(
          'literacy',
          'what a character’s words tell us about him',
          8,
          [
            N(
              'Sniff’s first question is whether your Nubbin is valuable. What does that tell us about Sniff?',
            ),
          ],
          [
            opt(
              'He likes to collect and keep things safe.',
              [
                N(
                  'Yes. He asks about value and pockets, so he is a collector who worries about losing things.',
                ),
              ],
              true,
            ),
            opt('He wants to be rude.', [
              N(
                'He is blunt, but he says hello too. His question is really about what he cares about: keeping things close.',
              ),
            ]),
            opt('He does not like Nubbins.', [
              N(
                'Not at all. He wants to put it in his pocket, which is his way of liking something.',
              ),
            ]),
          ],
          'Worked out a character trait (a collector who wants things safe) from his first lines.',
          'RL.3.3',
        ),
      ],
      [
        {
          id: 'pocket',
          label: 'Let your Nubbin try Sniff’s pocket.',
          then: [
            N(
              'Your Nubbin climbs into Sniff’s coat pocket, turns round twice and settles, as if it has been waiting all its life for this pocket.',
            ),
            SN('It fits! It fits exactly. I’ll be very careful with it. Probably.', 'happy'),
          ],
        },
        {
          id: 'arms',
          label: 'Keep your Nubbin in your arms for now.',
          then: [
            SN('Suit yourself. I only offered. It’s a very good pocket.', 'sad'),
            N(
              'Your Nubbin looks at the pocket for a long moment. Then it wriggles down and climbs in anyway.',
            ),
          ],
        },
      ],
    ),
    scene(
      'a09-01-valley-done',
      [
        N('Moomintroll holds out a paw. It is soft, and slightly sticky with jam.'),
        MT('I’m Moomintroll. Come and see the sea. Something’s wrong with it.'),
        N(
          'Moomintroll and Sniff come from a book. It was written in a real country: Finland, in the far north of Europe.',
        ),
      ],
      [
        note(
          'social-studies',
          'Finland has two national languages, Finnish and Swedish',
          -1,
          [
            N(
              'Finland has two national languages: Finnish, which most people speak, and Swedish, which some Finns speak as their first language.',
            ),
            N(
              'Tove Jansson, who created the Moomins, grew up speaking Swedish in Finland. She wrote the books in it.',
            ),
            N(
              'Hello is “hei” in Finnish and “hej” in Swedish. They look nearly the same, but the languages are very different.',
            ),
          ],
          'Learned that Finland has two national languages, Finnish and Swedish, and that the Moomin books were written in Swedish by a Finn.',
        ),
      ],
    ),
    scene(
      'a09-01-shore',
      [
        SN('This is my secret path. I found it. Nobody else knows about it.'),
        MT('I know about it.'),
        SN(
          'Nobody else EXCEPT you. And now them. It’s getting very crowded for a secret.',
          'angry',
        ),
        N(
          'The path ducks under brambles and comes out on a beach of round stones. The sea is the colour of an old spoon.',
        ),
        N(
          'A fine grey dust floats on it. It moves when the water moves, and it does not wash away.',
        ),
        MT('It was blue yesterday. It’s always been blue.', 'sad'),
        N(
          'Along the shore, under a lip of rock, there is a cave. The mouth is low; inside it is dry, and the floor is soft sand.',
        ),
        SN('That’s our cave. Mine, mostly. You can come in, but don’t touch anything.'),
        N('There is nothing in it to touch. Sniff looks round it proudly anyway.'),
      ],
      [
        note(
          'science',
          'waves wear stones round, slowly (weathering and erosion)',
          3,
          [
            N(
              'Why are beach stones round? Waves roll them against each other, over and over, for hundreds or thousands of years.',
            ),
            N(
              'Each knock wears away a few grains, and the sharp corners go first. Wearing away like this is called erosion.',
            ),
          ],
          'Learned that moving water slowly rounds off stones, which is a kind of erosion.',
          '4-ESS2-1',
        ),
      ],
    ),
    scene(
      'a09-01-shore-done',
      [
        N('You sit in the cave mouth and watch the grey sea breathe in and out.'),
        MT('Mamma would like this cave. It feels like being kept.', 'soft'),
        N('Sniff sits a little closer to you than he needs to, and says nothing.'),
      ],
      [
        ask(
          'literacy',
          'figurative language: “being kept”',
          -1,
          [N('Moomintroll says the cave “feels like being kept”. What does he mean?')],
          [
            opt(
              'It feels safe, like somebody is looking after you.',
              [
                N(
                  'Yes. “Kept” is how you talk about something precious that someone looks after. He feels cherished and safe.',
                ),
              ],
              true,
            ),
            opt('He wants to take the cave home.', [
              N(
                'A fair guess, but he does not mean owning it. He means how the cave makes him feel: held safe.',
              ),
            ]),
          ],
          'Explained a metaphor (“feels like being kept”) as feeling safe and looked after.',
          'L.4.5',
        ),
      ],
    ),
    scene(
      'a09-01-hammock',
      [
        N(
          'Back in the garden, a Muskrat lies in a hammock with his paws folded on his stomach, thinking very hard about nothing.',
        ),
        MT('Muskrat, the sea’s gone grey. Do you know why?'),
        MU('Of course I know why. Something is coming. Something always is.', 'think'),
        MU('A comet, very probably. A star with a tail, falling where it likes.'),
        SN(
          'Falling where? Not here. Somewhere else. Somewhere a long way off with nothing valuable in it.',
          'shock',
        ),
        MU(
          'Where it falls is no concern of a philosopher. Everything ends. It is rather restful, if you think about it.',
        ),
        N('Sniff does think about it. You can tell, because he goes the colour of the sea.'),
        N(
          'Moominpappa comes out on the veranda with his hat on, which is how you know he has had an idea.',
        ),
        MP(
          'There’s an Observatory in the Lonely Mountains, full of professors with telescopes. They’ll know.',
        ),
        MP(
          'Somebody should go and ask them. Somebody young, and brave, with a good raft.',
          'happy',
        ),
      ],
      [
        ask(
          'sel',
          'the same thought can feel different to different people',
          6,
          [
            N(
              'The Muskrat finds “everything ends” restful. Sniff goes pale. Why might one thought feel so different to two people?',
            ),
          ],
          [
            opt('They care about different things.', [
              N(
                'That’s a fair answer. The Muskrat loves quiet, and Sniff loves his pockets and his friends, so there is more for Sniff to lose.',
              ),
            ]),
            opt('One of them is more frightened than the other.', [
              N(
                'That’s a fair answer. Fear is part of it, and what we are afraid of depends on what matters to us.',
              ),
            ]),
            opt('The Muskrat has not really thought about it.', [
              N(
                'That’s a fair answer. Perhaps he says it so often that it has stopped feeling real. Sniff is feeling it for the first time.',
              ),
            ]),
          ],
          'Thought about why one idea can comfort one person and frighten another.',
          'CASEL: Social awareness',
        ),
      ],
      [
        {
          id: 'brave',
          label: '“We’ll go.”',
          then: [
            Y('We’ll go.'),
            MT('Yes! We’ll go. All of us. Sniff too.', 'happy'),
            SN('Sniff too? Who said Sniff too?', 'shock'),
          ],
        },
        {
          id: 'ask',
          label: 'Ask the Muskrat if he’s ever been wrong.',
          then: [
            MU(
              'Once. I thought I would get a whole afternoon without being asked questions.',
              'angry',
            ),
            MT('That means he doesn’t know. We’ll go and ask the professors.'),
          ],
        },
      ],
    ),
    scene(
      'a09-01-hammock-done',
      [
        N('That night you all stand on the veranda, and Moominmamma points.'),
        N(
          'Low over the mountains there is a new star. It has a tail, faint and red, like a match just blown out.',
        ),
        N(
          'Over the next days, the tail will grow, and it will always point one way: away from where the Sun is.',
        ),
      ],
      [
        note(
          'science',
          'a comet’s tail points away from the Sun, and grows as it nears it',
          -1,
          [
            N(
              'A comet is a lump of ice and dust, a bit like a dirty snowball, often only a few kilometres across.',
            ),
            N(
              'Far from the Sun it is frozen and dark. As it gets closer, the ice turns to gas and loosens dust. Both stream away and glow.',
            ),
            N('Sunlight and a stream of particles from the Sun push that gas and dust away.'),
            N(
              'So the tail always points away from the Sun, even when the comet is heading out again.',
            ),
          ],
          'Learned what a comet is, and why its tail grows near the Sun and always points away from it.',
        ),
      ],
    ),
    scene(
      'a09-01-complete',
      [
        MM(
          'Well. If you’re going, you’re going properly. Pullovers. Sandwiches. Something for colds.',
          'soft',
        ),
        MM('Two sandwiches each, for the three of you, and I’ll hear no arguing.'),
        MM('And you’ll come home when you’ve found out. Whatever they say.'),
        MT('We’ll come home, Mamma. Of course we will.'),
        N('Sniff pats his pocket. Your Nubbin pats back from the inside.'),
        SN('I’m only going because the Nubbin wants to. Somebody has to look after it.'),
      ],
      [
        doit(
          'maths',
          'multiplication as equal groups: 3 travellers, 2 sandwiches each',
          1,
          'edu:multiply:sandwiches:6',
          [
            N(
              'Three travellers, two sandwiches each. Make three groups of two in the basket. How many sandwiches is that? (3 × 2)',
            ),
          ],
          'Used equal groups to work out 3 × 2 = 6 sandwiches.',
          '3.OA.A.1',
        ),
      ],
    ),
  ],
  [
    gloss(
      'valuable',
      'Worth a lot to somebody, in money or because they love it.',
      'a09-01-valley',
    ),
    gloss('veranda', 'A roofed porch along the outside of a house.', 'a09-01-hammock'),
    gloss(
      'philosopher',
      'A person who thinks long and hard about big questions.',
      'a09-01-hammock',
    ),
  ],
  'Lessons: a character from his words; Finnish and Swedish, with hei and hej; erosion and round stones; a metaphor; a think question on why one thought feels different to two people; what a comet is and why its tail points away from the Sun; 3 × 2.',
);

// ================================================================== A9-2 The Raft
const A02 = quest(
  'a09-02',
  'The Raft',
  {
    'a09-02-s1': {
      goal: 'Help Moominpappa build a raft on the riverbank.',
      hint: 'Carry planks from the woodshed to the bank. Moominpappa will tell you where they go.',
    },
    'a09-02-s2': {
      goal: 'Load the raft and push off into the river.',
      hint: 'The basket goes in the middle. Sniff’s things go wherever Sniff can be talked into putting them.',
    },
    'a09-02-s3': {
      goal: 'Steer the raft downriver until it is time to make camp.',
      hint: 'Keep to the middle of the river and watch the banks.',
    },
  },
  [
    scene(
      'a09-02-build',
      [
        N(
          'Moominpappa has laid out planks on the riverbank in the shape of a raft: two metres wide, three metres long.',
        ),
        MP('Now. A raft must be sound, and it must have a mast, and it must have a name.', 'think'),
        MT('Does it need a name?'),
        MP('Everything that goes anywhere needs a name. Otherwise how will it know it’s gone?'),
        N(
          'You carry planks and Moomintroll ties knots. Sniff supervises from a stump and offers advice nobody takes.',
        ),
        SN(
          'That plank’s crooked. That one’s too short. That one is fine, I suppose, if you like that sort of plank.',
        ),
        N(
          'By noon there is a raft, and it floats. Moominpappa looks as if he has built a ship of the line.',
        ),
        MP('What shall we call her?', 'happy'),
      ],
      [
        ask(
          'literacy',
          'multiple-meaning words: “sound”',
          1,
          [
            N(
              'Moominpappa says a raft must be “sound”. “Sound” can also be what your ears hear. Which meaning does he intend?',
            ),
          ],
          [
            opt(
              'Strong and in good condition.',
              [
                N(
                  'Yes. A sound raft has no weak planks or loose knots. The same word means what we hear, but the sentence tells us which.',
                ),
              ],
              true,
            ),
            opt('Noisy.', [
              N(
                'That would be a funny raft! Check the rest of the sentence: it is about a raft that must not fall apart. That is “sound” meaning strong.',
              ),
            ]),
          ],
          'Chose the right meaning of the multiple-meaning word “sound” from context.',
          'L.3.4',
        ),
        ask(
          'maths',
          'perimeter of a rectangle',
          6,
          [
            N(
              'Moomintroll wants to tie a rope all the way round the edge of the raft: 2 m wide, 3 m long. How much rope goes round the edge?',
            ),
          ],
          [
            opt(
              '10 metres',
              [N('Yes: 2 + 3 + 2 + 3 = 10. The distance round the edge is called the perimeter.')],
              true,
            ),
            opt('6 metres', [
              N(
                'That is the area in square metres: 2 × 3. The rope goes round the edges: 2 + 3 + 2 + 3 = 10 metres.',
              ),
            ]),
            opt('5 metres', [
              N(
                'That is only one width and one length. The rope goes right round: two widths and two lengths, which is 10 metres.',
              ),
            ]),
          ],
          'Found the perimeter of a 2 m by 3 m rectangle by adding all four sides.',
          '3.MD.D.8',
        ),
      ],
      [
        {
          id: 'mamma',
          label: 'Suggest calling it after Moominmamma.',
          then: [
            MP('Ah. Yes. Then she’ll be sure to bring you home.', 'soft'),
            N('He paints MAMMA on the stern in careful blue letters.'),
          ],
        },
        {
          id: 'sniff',
          label: 'Suggest “The Valuable”.',
          then: [
            SN('Oh. Oh, that’s a very good name. That’s the best name.', 'happy'),
            N(
              'Moominpappa paints it on, and Sniff stands next to it for a long time with his paws behind his back.',
            ),
          ],
        },
      ],
    ),
    scene(
      'a09-02-build-done',
      [
        N('Moominmamma comes down the bank with a basket so full the lid will not close.'),
        MM('Sandwiches on top. Pullovers underneath. Don’t eat the pullovers.', 'happy'),
        N(
          'A nail drops out of Moominpappa’s pocket and sinks to the bottom of the river at once, while a plank bobs beside it.',
        ),
      ],
      [
        ask(
          'science',
          'why things float: density',
          -1,
          [
            N(
              'The nail sinks and the plank floats. Why does a whole wooden raft float, even loaded with a basket and three passengers?',
            ),
          ],
          [
            opt(
              'Wood is lighter than the same amount of water, so the water holds it up.',
              [
                N(
                  'Yes. Wood is less dense than water, so it floats. Iron is denser, so a lone nail sinks.',
                ),
              ],
              true,
            ),
            opt('The river is calm.', [
              N(
                'A calm river helps us steer, but it is not why it floats. Wood weighs less than the same volume of water.',
              ),
            ]),
            opt('Because the raft is big.', [
              N(
                'Size alone does not decide it. A big stone still sinks. A raft floats because wood is less dense than water.',
              ),
            ]),
          ],
          'Learned that things float when they are less dense than water.',
        ),
      ],
    ),
    scene(
      'a09-02-launch',
      [
        N(
          'Sniff arrives with a sack of his things: a tin box, a broken compass, a piece of red glass and a great many buttons.',
        ),
        MT('Sniff, there isn’t room for all that.'),
        SN(
          'There’s room for the Nubbin. The Nubbin’s valuable. These are valuable. It’s the same thing.',
          'angry',
        ),
        N('Your Nubbin, in his pocket, looks at the sack. Then it looks at you.'),
        MM('Sniff, dear. Things are lovely, but they don’t row.', 'soft'),
        SN('These ones might. You don’t know. Nobody’s ever asked them.'),
      ],
      [
        ask(
          'social-studies',
          'what makes something valuable',
          -1,
          [
            N(
              'Sniff says his buttons are “valuable”. Is a thing valuable because of what it costs, or because of what it means to someone? Think about it.',
            ),
          ],
          [
            opt('Because of what it costs.', [
              N(
                'That’s a fair answer. Money is one way people measure value. Sniff’s buttons would not sell for much, though, so he must mean something else too.',
              ),
            ]),
            opt('Because of what it means to someone.', [
              N(
                'That’s a fair answer. A single button can be priceless to the person who found it. Value can be a feeling as well as a price.',
              ),
            ]),
            opt('Both, depending on who you ask.', [
              N(
                'That’s a fair answer. A jeweller and Sniff may both call something valuable, for different reasons.',
              ),
            ]),
          ],
          'Thought about whether value comes from price or from what a thing means to a person.',
          'D2.Eco.1.3-5',
        ),
      ],
      [
        {
          id: 'one',
          label: 'Help Sniff choose the one thing he’d miss most.',
          then: [
            N(
              'It takes Sniff a very long time. In the end he picks the red glass, because the sun comes through it.',
            ),
            SN('The rest can stay with Moominmamma. She’s nearly as careful as me.', 'soft'),
          ],
        },
        {
          id: 'all',
          label: 'Find room for all of it.',
          then: [
            N(
              'You find room. The raft sits a little lower in the water and turns, very slowly, in a circle.',
            ),
            N('Halfway round, Sniff quietly takes the buttons back up the bank to Moominmamma.'),
          ],
        },
      ],
    ),
    scene(
      'a09-02-launch-done',
      [
        N(
          'Moominpappa pushes the raft off with his foot. Moominmamma waves her apron until the bend.',
        ),
        N('Then there is only the river, the grey sky and the red tail low over the hills.'),
        N(
          'Sniff takes out his broken compass. The needle swings, wobbles and sticks, pointing at nothing in particular.',
        ),
      ],
      [
        note(
          'science',
          'a compass needle is a magnet that points north',
          -1,
          [
            N(
              'A compass needle is a small magnet. The Earth is a giant magnet too, so the needle swings round until it points to the magnetic north pole.',
            ),
            N(
              'That is why a working compass points the same way wherever you stand. Sailors have used one for hundreds of years.',
            ),
          ],
          'Learned that a compass needle is a magnet that lines up with the Earth’s magnetic field, pointing north.',
        ),
      ],
    ),
    scene(
      'a09-02-river',
      [
        N(
          'The river carries you through woods and meadows. Everything you pass seems to be leaving.',
        ),
        N(
          'Birds fly low and quiet, all one way. A line of ants crosses a log with their eggs held over their heads.',
        ),
        MT('Where are they all going?'),
        SN('Away. Which is what sensible people do. We’re going TOWARDS it.', 'shock'),
        MT('We’re going towards finding out. That’s different.'),
        SN('It doesn’t feel different. It feels exactly the same.', 'sad'),
        N(
          'The river forks round a rock. One way is quick and white; the other is slow and dark under the trees.',
        ),
      ],
      [
        ask(
          'science',
          'animals move where their needs are met',
          -1,
          [
            N(
              'Animals often leave a place when it stops giving them what they need. Which of these is a real reason birds and ants might move away?',
            ),
          ],
          [
            opt(
              'Food, water or shelter is running out, or the weather is changing.',
              [
                N(
                  'Yes. Animals move to places where their needs are met. Many sense changes in weather before we do.',
                ),
              ],
              true,
            ),
            opt('They have finished their holiday.', [
              N(
                'A funny thought, but animals move for survival. They go where food, water and shelter are.',
              ),
            ]),
          ],
          'Learned that animals move to places where their needs for food, water and shelter are met.',
        ),
        note(
          'sel',
          'the same action can feel different from inside',
          5,
          [
            N(
              'Moomintroll and Sniff are walking the same way. Moomintroll feels he is going to find out.',
            ),
            N(
              'Sniff feels he is going to meet the thing he fears. Doing a brave thing can feel scary and brave at once.',
            ),
          ],
          'Noticed that two people can do the same thing and feel differently about it, and that bravery can sit alongside fear.',
          'CASEL: Self-awareness',
        ),
      ],
      [
        {
          id: 'quick',
          label: 'Take the quick channel.',
          then: [
            N(
              'The raft bucks and spins and shoots out into a pool, and everybody laughs, even Sniff, once it is over.',
            ),
            SN('I wasn’t frightened. My pocket was frightened.', 'happy'),
          ],
        },
        {
          id: 'slow',
          label: 'Take the slow channel.',
          then: [
            N(
              'You drift under the trees in green half-dark. A heron watches you go by and does not bother to move.',
            ),
            MT('This is nice. You could almost forget.', 'soft'),
          ],
        },
      ],
    ),
    scene(
      'a09-02-river-done',
      [
        N(
          'You pushed off at one o’clock. At dusk, at seven in the evening, you pull in to a sandy bank.',
        ),
        N('Moomintroll unpacks the sandwiches.'),
        N('Upstream, a thin line of smoke rises from somebody else’s fire.'),
      ],
      [
        ask(
          'maths',
          'time intervals',
          -1,
          [
            N(
              'You set off at 1:00 in the afternoon and landed at 7:00 in the evening. How long were you on the river?',
            ),
          ],
          [
            opt('6 hours', [N('Yes. From 1 to 7 is 6 hours: 1 to 2, 2 to 3, and so on.')], true),
            opt('8 hours', [
              N(
                'Count the hours from 1 to 7: that is 6. If it helps, count on your fingers one hour at a time.',
              ),
            ]),
            opt('7 hours', [
              N('7:00 is the end time, not the length. Count from 1 up to 7 and you get 6 hours.'),
            ]),
          ],
          'Worked out a time interval of 6 hours from 1:00 to 7:00.',
          '3.MD.A.1',
        ),
      ],
    ),
    scene(
      'a09-02-complete',
      [
        N('Sniff eats his sandwich very slowly, to make it last.'),
        SN(
          'When I was small, I thought the sky was a lid. Like on a tin. And nothing could get through it.',
          'soft',
        ),
        MT('And now?'),
        SN('Now I think it’s just sky. Anything can get through sky.', 'sad'),
        N(
          'Your Nubbin climbs out of his pocket and sits on his knee, which is as near as it can get to a lid.',
        ),
      ],
      [
        ask(
          'literacy',
          'a character’s motive',
          -1,
          [N('Why does Sniff tell Moomintroll about the lid, just now, at the end of a long day?')],
          [
            opt(
              'He is saying out loud what really frightens him.',
              [
                N(
                  'Yes. A lid would keep the comet out. “Anything can get through sky” is his fear, spoken at last.',
                ),
              ],
              true,
            ),
            opt('He is bored and wants to chat.', [
              N(
                'Not quite. Look at how he says it: softly, and sadly. It is a worry he has been keeping inside.',
              ),
            ]),
          ],
          'Worked out why Sniff shares a childhood memory: to say his fear aloud.',
          'RL.3.3',
        ),
      ],
    ),
  ],
  [
    gloss(
      'sound',
      'Strong and in good condition. (It can also mean something you hear.)',
      'a09-02-build',
    ),
    gloss(
      'perimeter',
      'The distance all the way round the outside edge of a shape.',
      'a09-02-build',
    ),
    gloss(
      'compass',
      'A tool with a magnetic needle that points north, so you can find your way.',
      'a09-02-launch-done',
    ),
  ],
  'Lessons: multiple-meaning “sound”; perimeter 2+3+2+3; why wood floats; a think question on what makes things valuable; the compass as a magnet; animals leaving; two feelings at once; 1 to 7 is 6 hours; a character’s motive.',
);

// ================================================================== A9-3 Snufkin
const A03 = quest(
  'a09-03',
  'Snufkin',
  {
    'a09-03-s1': {
      goal: 'Find whoever is camping upstream.',
      hint: 'Follow the smoke along the bank; listen for music.',
    },
    'a09-03-s2': {
      goal: 'Sit by Snufkin’s fire and hear how he travels.',
      hint: 'Sit on the log nearest the fire.',
    },
    'a09-03-s3': {
      goal: 'Look at the comet with Snufkin before you all sleep.',
      hint: 'Walk down to the water’s edge, where the trees open up.',
    },
  },
  [
    scene(
      'a09-03-camp',
      [
        N('You follow the smoke along the bank. Before you see the fire, you hear a tune.'),
        N(
          'It is a harmonica, playing something that goes up like a question and comes down without needing an answer.',
        ),
        N(
          'A small green tent stands by the water. In front of it, someone in an old green hat sits on a stone, fishing.',
        ),
        N('The tune stops. He does not turn round.'),
        SK('Come and sit down, if you’re coming. The fish have heard you anyway.'),
        MT('We didn’t mean to scare them.'),
        SK(
          'They don’t mind. They’re only pretending to be scared, so they don’t have to be caught.',
          'happy',
        ),
      ],
      [
        ask(
          'music',
          'pitch: high and low notes',
          1,
          [
            N(
              'Snufkin’s tune “goes up like a question and comes down without needing an answer”. When a tune goes up, are the notes getting higher or lower in pitch?',
            ),
          ],
          [
            opt(
              'Higher',
              [
                N(
                  'Yes. Going up in a tune means the pitch is rising. Try humming a question, such as “Really?”. Your voice goes up at the end.',
                ),
              ],
              true,
            ),
            opt('Lower', [
              N(
                'Lower is going down. A question tends to lift at the end, like the start of Snufkin’s tune. Try saying “Really?” and listen to your voice rise.',
              ),
            ]),
          ],
          'Identified rising pitch as the notes going higher.',
        ),
        note(
          'science',
          'a harmonica makes sound with vibrating reeds',
          3,
          [
            N(
              'Inside a harmonica are tiny metal strips called reeds. Breathe across one and it vibrates, wobbling to and fro very fast.',
            ),
            N(
              'That vibration shakes the air, and the shaking air is the sound you hear. Short, stiff reeds vibrate faster and make higher notes.',
            ),
          ],
          'Learned that vibrating reeds make the sound of a harmonica, and that faster vibration gives a higher note.',
          '1-PS4-1',
        ),
      ],
    ),
    scene(
      'a09-03-camp-done',
      [
        SK('I’m Snufkin. There’s coffee, if you don’t mind it out of the one cup.'),
        N('He passes the cup round, and it goes round twice. Nobody minds.'),
        N(
          'There are four of you: Snufkin, Moomintroll, Sniff and you. Everybody takes one sip each time round.',
        ),
      ],
      [
        ask(
          'maths',
          'multiplication as equal groups: 4 people × 2 rounds',
          -1,
          [
            N(
              'The cup goes round twice, with one sip each time for each of the four of you. How many sips is that altogether?',
            ),
          ],
          [
            opt('8', [N('Yes. Two rounds of four sips: 4 × 2 = 8. Or 4 + 4.')], true),
            opt('6', [
              N('Close. Each round has four sips, not three. Two rounds is 4 + 4, which is 8.'),
            ]),
            opt('4', [N('That is only one trip round. It goes round twice: 4 + 4 = 8 sips.')]),
          ],
          'Worked out 4 × 2 = 8 using equal groups.',
          '3.OA.A.1',
        ),
      ],
    ),
    scene(
      'a09-03-fire',
      [
        N('Sniff is looking around the camp with growing alarm.'),
        SN('Where’s all your stuff?', 'shock'),
        SK('This is all my stuff. A tent, a pipe, a cup, a harmonica. A hat.', 'think'),
        SN('That’s not stuff. That’s hardly anything. What do you do when you want something?'),
        SK(
          'I look at it. Then I leave it where it is, and it’s still beautiful, and I don’t have to carry it.',
        ),
        N('Sniff holds his pocket as if Snufkin might suggest leaving your Nubbin where it is.'),
        SK('Not that. You don’t own a friend; you just walk next to them.', 'soft'),
      ],
      [
        note(
          'social-studies',
          'needs and wants',
          5,
          [
            N('A need is something you cannot do without, like food, water, warmth and shelter.'),
            N(
              'A want is something you would like, like a collection of buttons. People often disagree about which is which.',
            ),
          ],
          'Learned the difference between needs and wants.',
          'D2.Eco.1.3-5',
        ),
        ask(
          'sel',
          'does owning more make us feel safer?',
          6,
          [
            N(
              'Snufkin owns almost nothing and seems content. Sniff owns a lot and is always worried. Does owning more make people feel safer? Think about it.',
            ),
          ],
          [
            opt('Yes, more things means more protection.', [
              N(
                'That’s a fair answer. Having enough food and a roof really does help us feel safe. Snufkin has what he needs, too.',
              ),
            ]),
            opt('No, feeling safe comes from somewhere else.', [
              N(
                'That’s a fair answer. Many people find that friends, and trusting that they can cope, matter more than things.',
              ),
            ]),
            opt('It depends how much they already have.', [
              N(
                'That’s a fair answer. After our needs are met, extra things may add less and less, while worry about losing them can grow.',
              ),
            ]),
          ],
          'Thought about whether having more possessions makes people feel safer.',
          'CASEL: Self-awareness',
        ),
      ],
      [
        {
          id: 'where',
          label: 'Ask where he’s going.',
          then: [
            SK('South, in the end. I always go south in the end. But I’ve no hurry.'),
            SK('Except there’s that.'),
            N('He tips his hat back and looks at the tail over the hills.'),
          ],
        },
        {
          id: 'lonely',
          label: 'Ask if he ever gets lonely.',
          then: [
            SK(
              'Sometimes. Then I go and find someone. Then I go away again. Both are good.',
              'think',
            ),
            MT('You could come with us.'),
            SK('I could.'),
          ],
        },
      ],
    ),
    scene(
      'a09-03-fire-done',
      [
        N(
          'He plays again, softer. The tune goes round the fire and out over the water, and comes back sounding older.',
        ),
        N('Your Nubbin climbs out of Sniff’s pocket and sits by Snufkin’s boot to listen.'),
      ],
      [
        note(
          'science',
          'echoes: sound bounces off surfaces',
          -1,
          [
            N(
              'Sound travels in waves, and when a wave meets a hard surface, such as a cliff or still water, some of it bounces back. That bounce is an echo.',
            ),
            N(
              'On a quiet night by the water, the echo arrives a moment after the tune, a little fainter, which is why it “comes back older”.',
            ),
          ],
          'Learned that sound waves bounce off hard surfaces, making echoes.',
          '4-PS3-2',
        ),
      ],
    ),
    scene(
      'a09-03-sky',
      [
        N(
          'By the water the trees open up. The comet is brighter than last night, and its tail is longer.',
        ),
        SK(
          'It looks lonely, doesn’t it. Coming all that way on its own, and nobody pleased to see it.',
          'soft',
        ),
        MT('Are you frightened of it?'),
        SK('A bit. Being frightened’s all right. It just means you’ve noticed something.'),
        SN('I’ve noticed EVERYTHING.', 'sad'),
        SK('Then you’re very well informed, Sniff.'),
        N('Sniff thinks about this, and decides it is a compliment, and stands slightly taller.'),
        SK(
          'I’ll come with you to the mountains. I like a mountain, and I’d like to know about this one.',
          'think',
        ),
      ],
      [
        ask(
          'sel',
          'naming a worry and talking about it',
          5,
          [
            N(
              'Snufkin names his fear out loud (“a bit frightened”) and talks about it calmly. What does naming a worry do?',
            ),
          ],
          [
            opt(
              'It makes the worry smaller and easier to share.',
              [N('Yes. A named worry is easier to look at, and a friend can help carry it.')],
              true,
            ),
            opt('It makes the worry bigger.', [
              N(
                'It can feel that way at first. But a worry kept silent usually grows. Saying it, as Snufkin does, tends to shrink it.',
              ),
            ]),
            opt('It makes the worry go away for ever.', [
              N(
                'Not quite. The worry may still be there, but it feels lighter once someone else knows. That is still a big help.',
              ),
            ]),
          ],
          'Learned that naming a worry out loud can make it feel smaller and easier to share.',
          'CASEL: Self-awareness',
        ),
      ],
    ),
    scene(
      'a09-03-sky-done',
      [
        N(
          'Snufkin rummages in his tent and comes out with a second harmonica, dented, with one cover loose.',
        ),
        SK('I’ve got two. I don’t like having two of anything. It makes me feel heavy.'),
        N(
          'He holds it out to you. Now he will have one harmonica left of his two: one half of what he started with.',
        ),
      ],
      [
        ask(
          'maths',
          'unit fractions: one half',
          -1,
          [
            N(
              'Snufkin had two harmonicas and gave one away. What fraction of his harmonicas did he give away?',
            ),
          ],
          [
            opt('One half', [N('Yes. One out of two equal parts is one half, written 1/2.')], true),
            opt('One third', [
              N('One third would mean one out of three. He had two, so one of them is one half.'),
            ]),
            opt('Two halves', [
              N('Two halves would be both of them. He gave away one, so it is one half.'),
            ]),
          ],
          'Recognised one out of two as the unit fraction 1/2.',
          '3.NF.A.1',
        ),
      ],
    ),
    scene(
      'a09-03-complete',
      [
        N('You try a note. It comes out like a duck in a cupboard.'),
        SK('That’s the right note. You just played it in the wrong place.', 'happy'),
        N('Your Nubbin claps. Sniff claps, a beat later, because the Nubbin did.'),
        SK('Play it when you’re home. Then the tune will know where it lives.'),
      ],
      [
        ask(
          'literacy',
          'similes',
          1,
          [
            N(
              '“It comes out like a duck in a cupboard.” This compares the note to a duck, using “like”. What is that kind of comparison called?',
            ),
          ],
          [
            opt(
              'A simile',
              [
                N(
                  'Yes. A simile compares two things using “like” or “as”. It paints a funny picture of a squawky note.',
                ),
              ],
              true,
            ),
            opt('A metaphor', [
              N(
                'Close. A metaphor says one thing is another. A simile says one thing is like another, as here.',
              ),
            ]),
            opt('A rhyme', [
              N(
                'Not here. A rhyme is words with matching sounds. This compares a note to a duck: it is a simile.',
              ),
            ]),
          ],
          'Identified a simile (“like a duck in a cupboard”).',
          'L.4.5',
        ),
      ],
    ),
  ],
  [
    gloss('pitch', 'How high or low a musical note sounds.', 'a09-03-camp'),
    gloss(
      'reed',
      'A thin strip of metal or cane that vibrates to make a sound in a musical instrument.',
      'a09-03-camp',
    ),
    gloss('echo', 'A sound that bounces off something and comes back.', 'a09-03-fire-done'),
  ],
  'Lessons: pitch and reeds; 4 × 2 sips; needs and wants; a think question on whether owning more makes us feel safer; echoes; naming a worry; 1/2; a simile.',
);

// ================================================================== A9-4 The Observatory
const A04 = quest(
  'a09-04',
  'The Observatory',
  {
    'a09-04-s1': {
      goal: 'Climb the Lonely Mountains to the Observatory.',
      hint: 'Follow the cairns up the path. Snufkin knows where the rope is needed.',
    },
    'a09-04-s2': {
      goal: 'Ask the professors when the comet will come.',
      hint: 'They are by the great telescope. You may have to ask twice.',
    },
    'a09-04-s3': {
      goal: 'Sit with Sniff on the Observatory step before you go back down.',
      hint: 'He is on the outside step, holding his pocket.',
    },
  },
  [
    scene(
      'a09-04-climb',
      [
        N(
          'The Lonely Mountains are grey stone and grey sky, with nothing growing on them that has not had to argue for it.',
        ),
        N(
          'A cairn, a neat pile of stones, marks the path every ten metres. By the slab you have passed six of them.',
        ),
        N('Snufkin goes first, then Moomintroll, then you, then Sniff, complaining.'),
        SN(
          'My legs are shorter than everybody’s. That means this mountain is taller for me. It isn’t fair.',
        ),
        SK('Then you’ll have climbed more of it than anybody, when we’re at the top.', 'happy'),
        SN('…I hadn’t thought of that.'),
        N(
          'Halfway up there is a steep slab. Snufkin ties a rope round a rock and throws you the end.',
        ),
        N(
          'Above you, against the clouds, sits a round white building with a slot in its roof, like a money box for stars.',
        ),
      ],
      [
        ask(
          'maths',
          'multiplication: equal jumps',
          1,
          [
            N(
              'There is a cairn every ten metres, and you have passed six. How far have you climbed along the path?',
            ),
          ],
          [
            opt('60 metres', [N('Yes. Six lots of ten: 6 × 10 = 60 metres.')], true),
            opt('16 metres', [
              N(
                'That adds 6 and 10. Each cairn is ten metres apart, so six cairns is 6 × 10 = 60.',
              ),
            ]),
            opt('10 metres', [
              N('That is just the first gap. With six of them, it is 6 × 10 = 60 metres.'),
            ]),
          ],
          'Multiplied 6 × 10 to find the distance of 60 metres.',
          '3.OA.A.3',
        ),
        ask(
          'sel',
          'looking at a difficulty a different way',
          4,
          [N('Snufkin turns Sniff’s complaint into a compliment. What did he do?')],
          [
            opt(
              'He found a different way to look at the same fact.',
              [
                N(
                  'Yes. Sniff’s legs are still short, but now it means he is climbing further. Looking at a problem another way can change how it feels.',
                ),
              ],
              true,
            ),
            opt('He pretended the mountain was small.', [
              N(
                'He did not change the facts. Short legs still mean more steps. He changed how Sniff sees it.',
              ),
            ]),
          ],
          'Saw how re-framing a difficulty can change how we feel about it.',
          'CASEL: Self-management',
        ),
      ],
      [
        {
          id: 'help',
          label: 'Give Sniff a hand up the slab.',
          then: [
            N(
              'Sniff takes your hand and pretends he does not need it, and holds on hard all the way.',
            ),
            SN('I could have done it. I just didn’t want to.'),
          ],
        },
        {
          id: 'wait',
          label: 'Wait at the top and let Sniff do it himself.',
          then: [
            N(
              'It takes him a while. When he gets to the top, he is so proud of himself he forgets to complain.',
            ),
            SN('Did you see? Did everybody see?', 'happy'),
          ],
        },
      ],
    ),
    scene(
      'a09-04-climb-done',
      [
        N('The Observatory door is open. Inside, somebody is counting in a whisper.'),
        N(
          'The slot in the roof is open too, and a telescope as long as a boat points through it at the sky.',
        ),
      ],
      [
        note(
          'science',
          'how a telescope works',
          -1,
          [
            N(
              'A telescope gathers far more light than your eye can, using a big lens or a curved mirror, and brings it to a point.',
            ),
            N('That makes dim, faraway things such as stars and comets look brighter and bigger.'),
            N(
              'The slot in the roof lets the telescope see the sky while the building keeps off the wind.',
            ),
          ],
          'Learned that a telescope gathers extra light with a lens or mirror, so distant things look bigger and brighter.',
        ),
      ],
    ),
    scene(
      'a09-04-telescope',
      [
        N(
          'Two professors stand under a telescope as long as a boat, both writing in notebooks and not looking up.',
        ),
        MT('Excuse me. We’ve come from the valley by the sea. We want to know about the comet.'),
        PR('So do we. Everybody does. It is a most remarkable comet.', 'happy'),
        P2('Most remarkable. Its tail alone is a thousand…'),
        PR('Two thousand.'),
        P2('…a great many miles long.'),
        MT('But when will it come? And where?'),
        PR(
          'It will arrive on the seventh of October, at eight forty-two in the evening. To the minute.',
          'think',
        ),
        P2('Possibly eight forty-three. We are arguing about the forty-three.'),
        MT('And where will it land?'),
        PR(
          'Oh, somewhere about here, we think. It will be extremely interesting to observe.',
          'happy',
        ),
      ],
      [
        ask(
          'maths',
          'telling time to the minute',
          7,
          [
            N(
              'The comet is due at 8:42 in the evening. On a clock, how many minutes is that before 9:00?',
            ),
          ],
          [
            opt(
              '18 minutes',
              [
                N(
                  'Yes. From 42 to 60 is 18 minutes. Count up: 42 to 50 is 8, and 50 to 60 is 10; 8 + 10 = 18.',
                ),
              ],
              true,
            ),
            opt('42 minutes', [
              N(
                'That is how many minutes past 8 it is. To find how many until 9, count from 42 up to 60: that is 18.',
              ),
            ]),
            opt('12 minutes', [N('Count carefully from 42 up to 60. The distance is 18 minutes.')]),
          ],
          'Read 8:42 and worked out there are 18 minutes until 9:00.',
          '3.MD.A.1',
        ),
        note(
          'science',
          'a comet’s tail can be millions of kilometres long',
          10,
          [
            N('The professors argue about the length of the tail.'),
            N(
              'A real comet’s tail can stretch millions of kilometres, many times the distance from the Earth to the Moon.',
            ),
            N('It is thinner than the finest mist.'),
          ],
          'Learned that comet tails can be millions of kilometres long yet very thin.',
        ),
      ],
    ),
    scene(
      'a09-04-telescope-done',
      [
        N('Nobody says anything. One of the professors writes down that nobody says anything.'),
        MT('Mamma doesn’t know. She doesn’t know the date.', 'shock'),
        SK('Then we’d better take it to her.'),
      ],
      [
        note(
          'science',
          'scientists write down what they observe',
          -1,
          [
            N(
              'Scientists write down what they see, even when it seems small. A written record lets other people check the work and add to it.',
            ),
          ],
          'Learned that scientists record their observations so others can check them.',
        ),
      ],
    ),
    scene(
      'a09-04-step',
      [
        N(
          'Outside, the light is going. Moomintroll is already at the top of the path, hopping from foot to foot to be gone.',
        ),
        N('Sniff sits on the step with both paws round his pocket. Your Nubbin is asleep in it.'),
        N('You sit down next to him. The comet hangs over the far peaks, closer than yesterday.'),
        SN('The seventh is in four days. I counted.', 'sad'),
        SN('Will it hit? You can tell me. I’m very brave about things, once I know them.'),
        N('He looks at you. He is not very brave, and you both know it, and he is asking anyway.'),
      ],
      [
        ask(
          'sel',
          'honesty and comfort with a frightened friend',
          5,
          [
            N(
              'Sniff asks a question nobody can answer for certain. What is the kindest thing to say to a frightened friend when you do not know? Think about it.',
            ),
          ],
          [
            opt('Tell him the truth: you don’t know.', [
              N(
                'That’s a fair answer. An honest “I don’t know”, said gently, can be more trustworthy than a promise you cannot keep.',
              ),
            ]),
            opt('Tell him it will be fine, to make him feel better.', [
              N(
                'That’s a fair answer. Comfort matters. The risk is that he may not believe it, or may be more upset if it turns out wrong.',
              ),
            ]),
            opt('Say what you do know, and stay with him.', [
              N(
                'That’s a fair answer. Sometimes the best help is facts you are sure of, plus company.',
              ),
            ]),
          ],
          'Thought about how to be honest and kind to a frightened friend.',
          'CASEL: Responsible decision-making',
        ),
      ],
      [
        {
          id: 'dunno',
          label: '“I don’t know.”',
          set: { 'a09-answer': 'dunno' },
          then: [
            Y('I don’t know, Sniff.'),
            N(
              'He nods slowly, as if that is a heavier thing to carry than a yes, and also a truer one.',
            ),
            SN('No. Nobody does. Not even them, with their telescope.', 'soft'),
          ],
        },
        {
          id: 'home',
          label: '“We’ll be home by then.”',
          set: { 'a09-answer': 'home' },
          then: [
            Y('We’ll be home by then.'),
            N(
              'Sniff looks at you for a long moment. Then he tucks the words away somewhere, like a button.',
            ),
            SN('Home by then. All right.', 'soft'),
          ],
        },
      ],
    ),
    scene(
      'a09-04-step-done',
      [
        N('Sniff gets up, and then, after a moment, holds out his paw to help you up.'),
        N('It is the first thing he has ever given anybody.'),
      ],
      [
        ask(
          'literacy',
          'how a character changes',
          -1,
          [
            N(
              '“It is the first thing he has ever given anybody.” What does this small moment show about Sniff?',
            ),
          ],
          [
            opt(
              'He is starting to trust and care about you.',
              [
                N(
                  'Yes. Sniff has always held on to things. Giving help is a big step for him, and it shows he trusts you.',
                ),
              ],
              true,
            ),
            opt('He is tired of sitting.', [
              N(
                'Possibly, but the narrator makes a bigger point of it: the first thing he has ever given. It marks a change in him.',
              ),
            ]),
          ],
          'Saw a small action as evidence of how a character is changing.',
          'RL.3.3',
        ),
      ],
    ),
    scene(
      'a09-04-complete',
      [
        N(
          'You start down the mountain in the dark, by the light of the comet, and sleep under an overhang halfway.',
        ),
        SK('Four days. That’s enough to get home, if nobody stops to look at anything.'),
        SN('I always stop to look at things.'),
        SK('So do I. We’ll have to look quickly.', 'happy'),
      ],
      [
        ask(
          'maths',
          'time: hours in days',
          1,
          [
            N(
              'Four days remain. A day has 24 hours. How many hours is that? (Hint: 4 × 24 is the same as 4 × 20 plus 4 × 4.)',
            ),
          ],
          [
            opt('96 hours', [N('Yes. 4 × 20 = 80 and 4 × 4 = 16, and 80 + 16 = 96 hours.')], true),
            opt('88 hours', [N('Check the second part: 4 × 4 is 16, not 8. So 80 + 16 = 96.')]),
            opt('100 hours', [N('That is close, but not exact. 4 × 24 = 96.')]),
          ],
          'Worked out that 4 days is 4 × 24 = 96 hours.',
          '3.OA.A.3',
        ),
      ],
    ),
  ],
  [
    gloss('cairn', 'A pile of stones that marks a path or a place.', 'a09-04-climb'),
    gloss('observatory', 'A building with telescopes for studying the sky.', 'a09-04-climb-done'),
    gloss('remarkable', 'Unusual and worth noticing.', 'a09-04-telescope'),
  ],
  'Lessons: 6 × 10; re-framing a difficulty; how telescopes work; 18 minutes before nine and 8:42; tail length; a joke about missing feelings; a think question on honesty with a frightened friend; character change; 4 days is 96 hours.',
);

// ================================================================== A9-5 The Snork Maiden
const A05 = quest(
  'a09-05',
  'The Snork Maiden',
  {
    'a09-05-s1': {
      goal: 'Look into the glinting crack in the rocks on the way down.',
      hint: 'It is beside the path where it turns, just below the rope.',
    },
    'a09-05-s2': {
      goal: 'Run to whoever is calling for help in the valley below.',
      hint: 'Follow the voice down into the trees. Stay behind Moomintroll.',
    },
    'a09-05-s3': {
      goal: 'See the gold ring find its owner.',
      hint: 'Sit with everyone in the clearing while she gets her breath back.',
    },
  },
  [
    scene(
      'a09-05-crevice',
      [
        N('In the morning, on the way down, something glints in a crack in the rock.'),
        N(
          'Moomintroll lies on his stomach and reaches in up to the shoulder. He comes out with a small gold ring.',
        ),
        MT('It’s too big for a paw and too small for a crown. What’s it for?', 'think'),
        SN('It’s for me. I saw it first. I saw the glint before the glint even glinted.'),
        MT('You were looking at your feet.'),
        SN('I saw it with my feet.', 'angry'),
        N(
          'Sniff goes off to sulk behind a boulder, and comes back with a tiny red stone, smooth and polished by the weather.',
        ),
        SN('Fine. I found my own. It’s a garnet, probably. It’s better than a ring, probably.'),
        SN('You hold it. Not keep it. Hold it. I’ve got too many pockets full.', 'soft'),
      ],
      [
        note(
          'science',
          'weathering makes stones smooth',
          6,
          [
            N(
              '“Polished by the weather” is real. Rain, wind, frost and ice slowly wear a stone’s surface, grain by grain. This slow wearing is called weathering.',
            ),
            N(
              'Garnets are real gems. They form deep in rock, often as dark red crystals, and they are hard, so they stay shiny for a very long time.',
            ),
          ],
          'Learned that weather slowly wears stone smooth, and heard that garnets are hard, red gems.',
          '4-ESS2-1',
        ),
        ask(
          'sel',
          'trust and generosity: holding, not keeping',
          8,
          [
            N(
              'Sniff gives you the garnet “to hold, not keep”. Why might that be hard for a collector like Sniff, and a big step?',
            ),
          ],
          [
            opt(
              'He is trusting you with something he loves.',
              [
                N(
                  'Yes. Letting someone hold something precious is a way of saying you trust them.',
                ),
              ],
              true,
            ),
            opt('He has too many pockets full.', [
              N(
                'That is what he says, and it is funny, but the real reason is underneath: he is choosing to trust you.',
              ),
            ]),
          ],
          'Thought about how lending something precious shows trust.',
          'CASEL: Relationship skills',
        ),
      ],
    ),
    scene(
      'a09-05-crevice-done',
      [
        N(
          'The garnet is warm from his paw. Snufkin raises an eyebrow at Sniff, and says nothing, kindly.',
        ),
        N('Sniff pretends not to see. His ears have gone slightly pink.'),
      ],
      [
        ask(
          'literacy',
          'reading what is not said',
          -1,
          [N('Snufkin “says nothing, kindly”. Why is saying nothing the kind thing to do here?')],
          [
            opt(
              'Sniff is being generous, and teasing him would spoil it.',
              [
                N(
                  'Yes. A comment might embarrass Sniff. Snufkin’s silence lets him have the moment.',
                ),
              ],
              true,
            ),
            opt('Snufkin has nothing to say.', [
              N(
                'He has plenty on his mind, as the eyebrow shows. He chooses silence out of kindness.',
              ),
            ]),
          ],
          'Understood why a character’s silence can be kind.',
          'RL.3.3',
        ),
      ],
    ),
    scene(
      'a09-05-bush',
      [
        N(
          'Below the mountain there is a valley of strange, thick plants. Somebody in it is shouting for help.',
        ),
        N(
          'In a clearing a bush with long dark branches has wound itself round a small someone with a golden fringe.',
        ),
        N('The branches move slowly, like fingers that have all the time in the world.'),
        SM('Don’t touch it! It stings! Its leaves are poison!', 'shock'),
        N('Moomintroll does not even stop. He pulls out his penknife and goes at the branches.'),
        MT('Hold still! Hold quite still!'),
        N(
          'Snufkin pulls branches back with his walking stick. You find a long dead branch and pin the nearest one down.',
        ),
        N(
          'Your Nubbin hides in Sniff’s pocket, and Sniff hides behind you. Everyone is, in their way, helping.',
        ),
      ],
      [
        note(
          'science',
          'how plants defend themselves',
          2,
          [
            N(
              'A plant cannot run away, so many have other defences: stinging hairs, thorns, bitter or poisonous leaves.',
            ),
            N(
              'Real nettles, for example, have tiny hairs that inject a stinging liquid. Those features help the plant survive, even if this bush in the story is much bolder.',
            ),
          ],
          'Learned that plants have structures such as stinging hairs and poisons that help them survive.',
          '4-LS1-1',
        ),
        ask(
          'health',
          'helping safely',
          7,
          [
            N(
              'Moomintroll charges in with a penknife. Snufkin uses a long stick, and you use a dead branch. Whose way of helping keeps the helpers safest?',
            ),
          ],
          [
            opt(
              'Using a stick or branch, to stay out of reach of the stings.',
              [
                N(
                  'Yes. Tools keep your skin away from the danger, so you can help without becoming a second person who needs rescuing.',
                ),
              ],
              true,
            ),
            opt('Rushing in with bare paws.', [
              N(
                'Brave, but risky. A helper who gets stung cannot help. A tool, and a plan, is safer.',
              ),
            ]),
          ],
          'Compared ways of helping someone and chose the one that keeps the helper safe.',
          'CASEL: Responsible decision-making',
        ),
      ],
    ),
    scene(
      'a09-05-bush-done',
      [
        N(
          'The last branch gives. Moomintroll catches her before she falls, and they both sit down hard in the grass.',
        ),
        SM('You came straight at it. You didn’t even think.', 'soft'),
        MT('There wasn’t time to think. I’ll think later.'),
      ],
      [
        ask(
          'sel',
          'bravery',
          -1,
          [
            N(
              'Moomintroll acted before he thought. Is that the same as being brave? What do you think?',
            ),
          ],
          [
            opt('Yes, being brave means acting even when you are afraid.', [
              N(
                'That’s a fair answer. Some bravery is just doing the right thing quickly, when someone is in trouble.',
              ),
            ]),
            opt('No, bravery means thinking first, then acting.', [
              N(
                'That’s a fair answer. Careful bravery can keep everybody safer. Snufkin’s stick shows a thoughtful kind.',
              ),
            ]),
            opt('Both can be brave, in different moments.', [
              N(
                'That’s a fair answer. Sometimes there is time to plan, and sometimes only to act. Good judgment helps tell them apart.',
              ),
            ]),
          ],
          'Thought about whether acting without thinking is bravery.',
          'CASEL: Responsible decision-making',
        ),
      ],
    ),
    scene(
      'a09-05-ring',
      [
        N(
          'She is shaking a little, and pretending not to. She smooths her fringe and checks it twice.',
        ),
        SM(
          'I was looking for something. I lost a gold ring in the mountains, a little one I wear round my ankle.',
          'sad',
        ),
        N('Moomintroll goes very pink and holds out his paw.'),
        MT('Is it this?'),
        SM('My ankle ring! Where did you find it?', 'happy'),
        MT('In a crack. I reached in up to here.'),
        SN('I saw it first.'),
        SM('Then thank you both. Thank you very much.', 'happy'),
        N('Sniff, who was ready for an argument, has nowhere to put it and goes rather quiet.'),
      ],
      [
        ask(
          'social-studies',
          'lost property belongs to its owner',
          -1,
          [
            N(
              'Sniff says he saw the ring first. Moomintroll found it. But whose ring is it, and what is the right thing to do?',
            ),
          ],
          [
            opt(
              'It is the Snork Maiden’s, so it should go back to her.',
              [
                N(
                  'Yes. Finding something does not make it yours if someone else lost it. Returning it is the honest and kind thing.',
                ),
              ],
              true,
            ),
            opt('It belongs to whoever saw it first.', [
              N(
                'Seeing first can matter for a race, but not for ownership. The ring had an owner already: the one who lost it.',
              ),
            ]),
            opt('It belongs to whoever needs it most.', [
              N(
                'A kind thought, but the ring already has an owner who wants it back, and she should have it.',
              ),
            ]),
          ],
          'Worked out that a found item should be returned to its owner, whoever saw it first.',
          'D2.Civ.8.3-5',
        ),
      ],
      [
        {
          id: 'tell',
          label: 'Tell her about the comet.',
          then: [
            Y('There’s a comet coming. The seventh, at eight forty-two in the evening.'),
            SM(
              'I know. I’ve seen the tail. I thought if I kept busy it wouldn’t notice me.',
              'think',
            ),
          ],
        },
        {
          id: 'ask',
          label: 'Ask if she’s all right.',
          then: [
            SM(
              'I am now. I wasn’t. It’s a strange thing, being all right after not being.',
              'soft',
            ),
            N(
              'She slips the gold ring round her ankle and looks at it, to be sure it is still there.',
            ),
          ],
        },
      ],
    ),
    scene(
      'a09-05-complete',
      [
        SM('I’m the Snork Maiden. My brother is somewhere about, probably making a list.'),
        SM('Can we come with you? I don’t want to be anywhere on my own just now.'),
        MT('Of course. Mamma always makes enough for everybody.', 'happy'),
        N(
          'Moominmamma’s basket still holds twelve sandwiches. She packed six. Nobody is surprised. With the Snork Maiden, there are five friends and a Nubbin: six in all.',
        ),
        N('The garnet is still in your hand. Sniff has not asked for it back.'),
      ],
      [
        ask(
          'maths',
          'division: sharing equally',
          3,
          [
            N(
              'Twelve sandwiches are shared equally among five friends and a Nubbin, six in all. How many does each get?',
            ),
          ],
          [
            opt('2', [N('Yes. 12 ÷ 6 = 2, because 6 × 2 = 12.')], true),
            opt('3', [N('Check it: 6 × 3 = 18, which is too many. 6 × 2 = 12, so each gets 2.')]),
            opt('6', [N('That is the number of sharers. Divide 12 by 6 to find each share: 2.')]),
          ],
          'Shared 12 equally among 6 and found 12 ÷ 6 = 2.',
          '3.OA.A.3',
        ),
      ],
    ),
  ],
  [
    gloss(
      'weathering',
      'The slow wearing away of rock by rain, wind, frost and ice.',
      'a09-05-crevice',
    ),
    gloss('garnet', 'A hard, usually deep red gemstone.', 'a09-05-crevice'),
  ],
  'Lessons: weathering and garnets; trust in lending; the kindness of silence; how plants defend themselves; helping safely; a think question on bravery; returning lost property; 12 ÷ 6.',
);

// ================================================================== A9-6 The Snork
const A06 = quest(
  'a09-06',
  'The Snork',
  {
    'a09-06-s1': {
      goal: 'Find the Snork Maiden’s brother.',
      hint: 'Look for a neat camp with a sign on it.',
    },
    'a09-06-s2': {
      goal: 'Sit through the Snork’s meeting and help it reach a decision.',
      hint: 'Sit in the circle. When a vote comes, put your paw up.',
    },
  },
  [
    scene(
      'a09-06-snork',
      [
        N(
          'Her brother has made camp under a pine, very neatly. There is a sign on the tent that says OFFICE.',
        ),
        SO('Sister. You are late. I had you down for back at four.', 'angry'),
        SM('A bush tried to eat me.'),
        SO('That is not on the list.', 'shock'),
        N('He writes it on the list, then crosses it off, because it is over.'),
        SO(
          'And who are all these people? Have they been introduced? Has anyone taken their names?',
        ),
        MT('We’re going home before the comet. We’ve come to fetch you both.'),
        SO('Going home? Without a meeting? Nothing should be decided without a meeting.', 'think'),
      ],
      [
        ask(
          'literacy',
          'character traits',
          1,
          [
            N(
              'The Snork has a sign saying OFFICE on a tent, and a list for everything. Which trait describes him best?',
            ),
          ],
          [
            opt(
              'Orderly: he loves rules and lists.',
              [N('Yes. His neat camp, sign, list and meetings all show a love of order.')],
              true,
            ),
            opt('Lazy.', [
              N('He is the opposite. He keeps busy, checking and recording everything.'),
            ]),
            opt('Careless.', [
              N(
                'He is very careful, even about a bush trying to eat his sister, which he still writes on his list.',
              ),
            ]),
          ],
          'Identified a character trait (orderly) from his actions and belongings.',
          'RL.3.3',
        ),
        ask(
          'sel',
          'when is a meeting the best way to decide?',
          7,
          [
            N(
              'The Snork says nothing should be decided without a meeting. Is a meeting always the best way to decide? Think about it.',
            ),
          ],
          [
            opt('Yes, so everybody has a say.', [
              N(
                'That’s a fair answer. Meetings can make decisions fair, because every voice gets heard.',
              ),
            ]),
            opt('No, sometimes you must act at once.', [
              N(
                'That’s a fair answer. If someone is in danger, a long meeting could cost too much time.',
              ),
            ]),
            opt('It depends how big and how urgent the decision is.', [
              N(
                'That’s a fair answer. Small, slow decisions suit meetings. Emergencies need quick action, and a meeting afterwards.',
              ),
            ]),
          ],
          'Thought about when group meetings are the best way to decide.',
          'CASEL: Responsible decision-making',
        ),
      ],
    ),
    scene(
      'a09-06-snork-done',
      [
        SO(
          'Everybody sit in a circle. I shall be the chairman, and I shall keep the minutes, as nobody else has a pencil.',
        ),
        SK('I have a pencil.'),
        SO('Then you may be the audience.'),
      ],
      [
        note(
          'social-studies',
          'how a meeting works',
          -1,
          [
            N(
              'In a real meeting the chairman leads, so that one person talks at a time.',
            ),
            N(
              'The minutes are the written record of what was decided. The Snork has volunteered to keep them.',
            ),
          ],
          'Learned what a chairman does and what minutes are.',
        ),
      ],
    ),
    scene(
      'a09-06-meeting',
      [
        SO('Item one. The comet. Is it coming? Show of paws.'),
        N(
          'Everybody puts a paw up. There are six of you, one paw each, and your Nubbin puts up both of its own, from Sniff’s pocket.',
        ),
        SO('Carried. Item two. Should we be concerned? Show of paws.', 'think'),
        SN('Both my paws. And my ears, if they count.', 'shock'),
        SO('Carried. Item three: what to do about it. I shall now accept suggestions.'),
        N(
          'There is a pause, in which nobody suggests anything and the comet moves a little further across the sky.',
        ),
      ],
      [
        ask(
          'maths',
          'adding to count a vote',
          1,
          [
            N(
              'Six of you put one paw up each, and your Nubbin puts up two paws. How many paws are in the air?',
            ),
          ],
          [
            opt('8', [N('Yes. Six paws plus two paws: 6 + 2 = 8.')], true),
            opt('7', [N('The Nubbin puts up both paws, so that is two, not one. 6 + 2 = 8.')]),
            opt('12', [
              N('That would be everyone with two paws up. Only the Nubbin used both: 6 + 2 = 8.'),
            ]),
          ],
          'Added 6 and 2 to count the paws raised in a vote.',
          '1.OA.A.1',
        ),
        note(
          'social-studies',
          'voting is a fair way to decide',
          5,
          [
            N(
              'A show of paws is a vote. Each person gets the same say, and the choice with the most votes wins.',
            ),
            N('Counting votes carefully, as the Snork does, is part of what makes a vote fair.'),
          ],
          'Learned that voting gives each person an equal say and the most votes wins.',
          'D2.Civ.8.3-5',
        ),
      ],
      [
        {
          id: 'home',
          label: 'Propose going home at once.',
          then: [
            Y('I propose we go home. Now.'),
            SN('I say we go home. Now.'),
            MT('Me too.'),
            SO('That is not how motions work.'),
            SN('It is now.'),
          ],
        },
        {
          id: 'sub',
          label: 'Propose a subcommittee to decide on the way.',
          then: [
            SO('A subcommittee! Now that is a sensible person.', 'happy'),
            SK('The subcommittee will meet while walking. Very fast. Towards the valley.'),
            SO('…Agreed.'),
          ],
        },
      ],
    ),
    scene(
      'a09-06-meeting-done',
      [
        N(
          'The Snork writes the minutes and reads them back. Under “Any other business” he has written: Sniff is worried.',
        ),
        SN('Well, I am.'),
        SO('It is in the minutes. It is official. Everybody is to bear it in mind.', 'soft'),
      ],
      [
        ask(
          'sel',
          'naming a worry so that others can help',
          -1,
          [N('The Snork writes “Sniff is worried” in the minutes. What does it do for Sniff?')],
          [
            opt(
              'It makes his worry known and taken seriously by the group.',
              [
                N(
                  'Yes. A written worry is a worry nobody can ignore. The group has promised to bear it in mind, which is a way of caring.',
                ),
              ],
              true,
            ),
            opt('It embarrasses him.', [
              N(
                'It might have, but look at Sniff’s answer: “Well, I am.” He accepts it, because it is said kindly and nobody laughs.',
              ),
            ]),
          ],
          'Saw how naming a worry in front of caring friends helps.',
          'CASEL: Social awareness',
        ),
      ],
    ),
    scene(
      'a09-06-complete',
      [
        N(
          'The Snork folds his tent into a parcel so small and square that Sniff looks at it with something like love.',
        ),
        N('The parcel is six centimetres on each side.'),
        SO('Meeting closed. We march.'),
        N(
          'You march. The Snork walks at the front, and Snufkin walks at the front of him, and the Snork does not notice.',
        ),
      ],
      [
        ask(
          'maths',
          'area of a square',
          1,
          [
            N(
              'A square with sides of 6 cm covers how many square centimetres? (Area = side × side.)',
            ),
          ],
          [
            opt(
              '36',
              [N('Yes. 6 × 6 = 36 square centimetres. Imagine six rows of six little squares.')],
              true,
            ),
            opt('24', [
              N('That is the perimeter (6 + 6 + 6 + 6). Area is the space inside: 6 × 6 = 36.'),
            ]),
            opt('12', [N('That is 6 + 6. For area we multiply: 6 × 6 = 36.')]),
          ],
          'Found the area of a 6 cm square as 6 × 6 = 36 square centimetres.',
          '3.MD.C.7',
        ),
      ],
    ),
  ],
  [
    gloss('chairman', 'The person who leads a meeting.', 'a09-06-snork-done'),
    gloss(
      'minutes',
      'The written record of what was said and decided in a meeting.',
      'a09-06-snork-done',
    ),
  ],
  'Lessons: an orderly character; a think question on whether meetings are always best; the roles in a meeting; 6 + 2 paws; voting; naming a worry; the area of a 6 cm square.',
);

// ================================================================== A9-7 The Hemulen
const A07 = quest(
  'a09-07',
  'The Hemulen',
  {
    'a09-07-s1': {
      goal: 'Find out who is crashing about in the meadow with a net.',
      hint: 'Follow the sound of somebody falling over things.',
    },
    'a09-07-s2': {
      goal: 'Help the Hemulen find his rare butterfly.',
      hint: 'Look on the tall flowers at the edge of the meadow, where the sun still reaches.',
    },
  },
  [
    scene(
      'a09-07-meadow',
      [
        N(
          'In a meadow full of late flowers, a large person in a long dress is running in circles with a butterfly net.',
        ),
        N(
          'He swings, misses, falls into a bush, gets up and swings again, without once looking anywhere but up.',
        ),
        HE('Hold still, you! You! I know what you are! You’re the very last one I need!', 'angry'),
        SN('Who’s that?'),
        SK('A Hemulen. You can tell, because he’s busy.'),
        MT('Excuse me! Have you seen the comet?'),
        HE('The what? No. Is it a butterfly?', 'think'),
        MT('It’s a star with a tail. It’s coming on the seventh. It might land here.'),
        HE(
          'Then it had better land quietly. There is a Mourning Blue in this meadow and I will not have it disturbed.',
        ),
      ],
      [
        note(
          'science',
          'the life cycle of a butterfly',
          8,
          [
            N('A butterfly goes through four stages.'),
            N(
              'It begins as an egg, hatches into a caterpillar that eats and grows, then forms a chrysalis, and finally comes out as an adult butterfly.',
            ),
            N(
              'This change of body shape is called metamorphosis. The Hemulen only ever hunts the last stage, the one with wings.',
            ),
          ],
          'Learned the four stages of a butterfly’s life cycle: egg, caterpillar, chrysalis and adult.',
          '3-LS1-1',
        ),
      ],
    ),
    scene(
      'a09-07-meadow-done',
      [
        SM('He’s not listening. Hemulens never listen when they’re collecting.'),
        SK('Then we’ll have to help him finish collecting.'),
      ],
      [
        ask(
          'sel',
          'getting a busy person’s attention kindly',
          -1,
          [
            N(
              'Snufkin’s idea is to help the Hemulen finish collecting first. Why might that work better than interrupting him over and over?',
            ),
          ],
          [
            opt(
              'He will have time and attention for us once his task is done.',
              [N('Yes. Joining in with what matters to someone can win their attention kindly.')],
              true,
            ),
            opt('It will annoy him less than shouting.', [
              N(
                'True, and that is part of it. But helping also changes the situation, so he can listen.',
              ),
            ]),
          ],
          'Learned that helping a busy person finish a task can be a kind way to get their attention.',
          'CASEL: Relationship skills',
        ),
      ],
    ),
    scene(
      'a09-07-butterfly',
      [
        N(
          'Everyone spreads out across the meadow, walking softly. Even the Snork, who makes it a motion.',
        ),
        HE(
          'Softly. Softly. It is the colour of the hour after sunset, and it hates a fuss.',
          'think',
        ),
        SN('So do I. Nobody ever asks.'),
        N('Your Nubbin climbs out of Sniff’s pocket and stands very still on a stone.'),
        N(
          'A butterfly the colour of dusk comes down out of nowhere and lands on your Nubbin’s head.',
        ),
        N(
          'Your Nubbin does not breathe, and nor do you. Somewhere behind you, the Hemulen draws in a huge breath.',
        ),
      ],
      [
        note(
          'science',
          'butterflies are cold-blooded and rest when it cools',
          2,
          [
            N(
              'Butterflies are cold-blooded, which means they rely on the air and sunshine to keep warm. They need warmth to fly.',
            ),
            N(
              'At dusk, when the air cools, a butterfly settles to rest and keeps still, so it is easier to approach.',
            ),
          ],
          'Learned that butterflies depend on outside warmth, so they rest when it cools at dusk.',
        ),
        doit(
          'health',
          'slow breathing to stay calm and still',
          5,
          'edu:breathe:still:5',
          [
            N(
              'Be as still as your Nubbin. Breathe in slowly for a count of four, out slowly for four. Do it five times.',
            ),
          ],
          'Practised slow breathing to stay calm and still.',
          'CASEL: Self-management',
        ),
      ],
      [
        {
          id: 'show',
          label: 'Call the Hemulen over, softly.',
          then: [
            N('The Hemulen tiptoes over, which for a Hemulen is like a cupboard tiptoeing.'),
            N(
              'He does not swing the net. He just looks, for a long time, with his mouth a little open.',
            ),
            HE(
              'There. There it is. Oh, I’ll put it in the book, and it will be complete.',
              'happy',
            ),
          ],
        },
        {
          id: 'quiet',
          label: 'Keep quiet and let it fly.',
          then: [
            N(
              'The butterfly opens its wings once and goes up into the evening. Nobody says a word.',
            ),
            N('The Hemulen comes over with his net hanging down. He saw it go.'),
            HE(
              'It sat on your little one. It chose. I suppose I can write that down instead.',
              'soft',
            ),
          ],
        },
      ],
    ),
    scene(
      'a09-07-butterfly-done',
      [
        N('The Hemulen writes in a fat notebook with his tongue between his teeth.'),
        HE(
          'Complete, as far as this meadow goes. Now. What was it you were saying about a star?',
          'think',
        ),
        N('He wrote down what he saw. He never needed to catch it.'),
      ],
      [
        doit(
          'literacy',
          'writing a field note: where, when, what you saw',
          -1,
          'edu:write:field-note:butterfly',
          [
            N(
              'Write a three-line field note for the Hemulen’s book: where you were, when it was, and what you saw. Include one colour and one number.',
            ),
          ],
          'Wrote a short field note with place, time and observations.',
        ),
        ask(
          'sel',
          'watching and owning',
          1,
          [
            N(
              'The Hemulen records the butterfly instead of catching it. Is watching something as good as owning it? Think about it.',
            ),
          ],
          [
            opt('Yes, it can be better, because the butterfly stays alive and free.', [
              N(
                'That’s a fair answer. Watching leaves the living thing unharmed, and many people find the memory lasts.',
              ),
            ]),
            opt('No, owning means you can keep it for ever.', [
              N(
                'That’s a fair answer. Keeping something can feel good. But some things, like a living butterfly, are only themselves while they are free.',
              ),
            ]),
            opt('It depends on the thing.', [
              N(
                'That’s a fair answer. A book can be owned and read again; a butterfly is better watched.',
              ),
            ]),
          ],
          'Thought about whether watching a living thing can be better than owning it.',
          'CASEL: Responsible decision-making',
        ),
      ],
    ),
    scene(
      'a09-07-complete',
      [
        MT('It’s coming on the seventh. We’re going to my valley. Mamma will look after everyone.'),
        HE('Will there be butterflies?'),
        MT('After. There are always butterflies after.', 'soft'),
        HE('Then I shall come. I can be very useful, when I have finished something.', 'happy'),
        N('He folds his net and walks with you, still glancing up, the way some people hum.'),
        N(
          'Butterflies have a pattern on the left wings that matches the right. Fold a picture of one down the middle and the halves would meet.',
        ),
      ],
      [
        ask(
          'maths',
          'lines of symmetry',
          -1,
          [
            N(
              'A butterfly’s pattern matches on both sides of its body. How many lines of symmetry does a typical butterfly have?',
            ),
          ],
          [
            opt(
              'One, down the middle.',
              [
                N(
                  'Yes. One line down the middle of the body turns the left half into the right half. That is a line of symmetry.',
                ),
              ],
              true,
            ),
            opt('Two.', [N('A rectangle has two. A butterfly has only the line down its body.')]),
            opt('None.', [
              N(
                'It does have one. Imagine folding it in half down the body: the sides would match.',
              ),
            ]),
          ],
          'Identified one line of symmetry on a butterfly.',
          '4.G.A.3',
        ),
      ],
    ),
  ],
  [
    gloss(
      'metamorphosis',
      'A big change of body shape as an animal grows, like a caterpillar becoming a butterfly.',
      'a09-07-meadow',
    ),
    gloss(
      'chrysalis',
      'The resting stage, inside a hard skin, when a caterpillar turns into a butterfly.',
      'a09-07-meadow',
    ),
  ],
  'Lessons: the butterfly life cycle; getting a busy person’s attention kindly; why butterflies rest at dusk; slow breathing; a field note; a think question on watching and owning; one line of symmetry.',
);

// ================================================================== A9-8 The Dry Sea
const A08 = quest(
  'a09-08',
  'The Dry Sea',
  {
    'a09-08-s1': {
      goal: 'Come down to the shore and see what has happened to the sea.',
      hint: 'The path ends at the cliff top. Look out.',
    },
    'a09-08-s2': {
      goal: 'Help Snufkin make stilts for everyone.',
      hint: 'Gather long straight poles from the driftwood above the tideline.',
    },
    'a09-08-s3': {
      goal: 'Walk out across the seabed on stilts.',
      hint: 'Stay in the line and step where Snufkin steps.',
    },
  },
  [
    scene(
      'a09-08-shore',
      [
        N('You come over the last hill and stop. Everyone stops, all along the line.'),
        N(
          'The sea has gone. Where it was there is a great grey hollow of mud and weed and rock, going down and down.',
        ),
        MT('It was here. There was a whole sea here.', 'shock'),
        SK('It’s hiding. Everything hides from something that big.'),
        SO('The valley is on the other side. Around the bay is three days. Across is one.'),
        SN('Across WHAT? It’s all squelch!', 'shock'),
        N(
          'Far out on the seabed, a stranded fish flaps once in a puddle that is, for now, just enough.',
        ),
      ],
      [
        ask(
          'maths',
          'subtraction: days saved',
          4,
          [
            N(
              'Around the bay takes three days and straight across takes one. How many days does the shorter way save?',
            ),
          ],
          [
            opt('2 days', [N('Yes. 3 − 1 = 2 days saved.')], true),
            opt('4 days', [N('That adds them. To find how much is saved, subtract: 3 − 1 = 2.')]),
            opt('1 day', [
              N('Across takes one day, but the saving is the difference: 3 − 1 = 2 days.'),
            ]),
          ],
          'Subtracted 1 from 3 to find 2 days saved.',
          '2.OA.A.1',
        ),
        note(
          'science',
          'tides and the Moon',
          1,
          [
            N(
              'On real coasts the sea rises and falls every day. These tides are caused mainly by the Moon’s pull on the water, with a smaller pull from the Sun.',
            ),
            N(
              'At low tide the sea draws back and shows the sand and rocks beneath. The sea in the story has gone out far, far further than any real tide would.',
            ),
          ],
          'Learned that tides are caused mostly by the Moon’s pull, and that low tide uncovers the shore.',
        ),
      ],
    ),
    scene(
      'a09-08-shore-done',
      [
        N('Three days is more than you have. Nobody needs to say it.'),
        N('Nobody does. The silence is long, and it is not an empty one.'),
      ],
      [
        ask(
          'sel',
          'saying the hard thing out loud',
          -1,
          [
            N(
              'Everyone knows three days is too long, and nobody says it. Is it better to say a frightening thing out loud, or to leave it unsaid? Think about it.',
            ),
          ],
          [
            opt('Say it, so everyone can face it together.', [
              N(
                'That’s a fair answer. A worry shared can be planned around, and nobody has to carry it alone.',
              ),
            ]),
            opt('Leave it, so nobody panics.', [
              N(
                'That’s a fair answer. Sometimes people need a moment, and too much talk can add to fear.',
              ),
            ]),
            opt('Say it gently, and straight away follow it with a plan.', [
              N(
                'That’s a fair answer. Snufkin does exactly this next: he moves on to what can be done.',
              ),
            ]),
          ],
          'Thought about when to say a frightening thing aloud.',
          'CASEL: Self-awareness',
        ),
      ],
    ),
    scene(
      'a09-08-stilts',
      [
        SK('Stilts. We walk over the mud on stilts.', 'think'),
        N(
          'You gather driftwood along the old tideline. Snufkin binds footrests on with string from his pockets.',
        ),
        N(
          'The Hemulen’s stilts are the tallest, ninety centimetres, and the Snork’s are measured exactly. Sniff’s are thirty centimetres.',
        ),
        SN('Mine are short.'),
        SK('Short stilts fall over less far.'),
        N(
          'Everybody practises on the sand, and everybody falls over: Moomintroll often, the Snork Maiden gracefully.',
        ),
        N('Sniff falls over on purpose, to get it done.'),
        N(
          'Your Nubbin rides in Sniff’s pocket, a little higher off the ground than it is used to, and looks impressed.',
        ),
      ],
      [
        ask(
          'maths',
          'comparing lengths',
          2,
          [
            N(
              'The Hemulen’s stilts are 90 cm and Sniff’s are 30 cm. How much taller are the Hemulen’s?',
            ),
          ],
          [
            opt('60 cm', [N('Yes. 90 − 30 = 60 centimetres.')], true),
            opt('120 cm', [N('That adds them. To compare, subtract: 90 − 30 = 60.')]),
            opt('30 cm', [N('That is Sniff’s height. The difference is 90 − 30 = 60.')]),
          ],
          'Subtracted 30 from 90 to find a 60 cm difference.',
          '2.OA.A.1',
        ),
        ask(
          'science',
          'balance: lower is steadier',
          4,
          [
            N(
              'Snufkin says short stilts fall over less far. Why are short stilts easier to balance on?',
            ),
          ],
          [
            opt(
              'Your body is nearer the ground, so there is less of a topple and less far to fall.',
              [
                N(
                  'Yes. The lower your weight is, the steadier you are, and the smaller the fall if you do tip.',
                ),
              ],
              true,
            ),
            opt('Short stilts are lighter.', [
              N(
                'They are lighter, but the main reason is height. A lower body is steadier, and a smaller drop hurts less.',
              ),
            ]),
          ],
          'Learned that a lower centre of weight makes balance easier and falls smaller.',
          '3-PS2-1',
        ),
      ],
      [
        {
          id: 'tall',
          label: 'Ask for tall stilts.',
          then: [
            N(
              'You can see the whole bay from up here, and the long red stripe of the comet beyond it.',
            ),
            N('You fall over once, magnificently, and the Hemulen picks you up by the collar.'),
          ],
        },
        {
          id: 'short',
          label: 'Ask for short stilts, like Sniff’s.',
          then: [
            SN('Oh, good. Now we’re the short-stilts club. We’ll have meetings.', 'happy'),
            SO('All meetings must be registered with me.'),
          ],
        },
      ],
    ),
    scene(
      'a09-08-stilts-done',
      [
        N(
          'Snufkin looks at the line of you all, wobbling. He puts his harmonica away, which means it is time.',
        ),
        N('He does not say it. He does not need to.'),
      ],
      [
        ask(
          'literacy',
          'inference: what actions tell us',
          -1,
          [N('Snufkin puts his harmonica away “which means it is time”. What can we infer?')],
          [
            opt(
              'He plays when he is relaxed, so putting it away means it is time to get serious.',
              [
                N(
                  'Yes. The harmonica is how he relaxes. Packing it away shows the real crossing is about to begin.',
                ),
              ],
              true,
            ),
            opt('The harmonica broke.', [
              N(
                'Nothing says that. We infer from his habits: music is for easy times, silence for serious ones.',
              ),
            ]),
          ],
          'Made an inference from a character’s habit (putting the harmonica away).',
          'RL.3.3',
        ),
      ],
    ),
    scene(
      'a09-08-seabed',
      [
        N(
          'You walk out on to the seabed. It sucks at the stilts with a sound like somebody finishing soup.',
        ),
        N(
          'There are things down here nobody was meant to see: a sunk rowing boat, a broken anchor, a wardrobe.',
        ),
        SM('Why is there a wardrobe?', 'think'),
        SO('I shall note it.'),
        N('In a puddle beside your stilt lies a pink shell with a curl in it, still wet.'),
        N(
          'You lean down, very carefully, and pick it up. When you hold it to your ear, there is no sea in it at all.',
        ),
        SN('Is it broken?'),
        MT('It’s waiting. It’s listening for the sea, the same as us.', 'soft'),
      ],
      [
        ask(
          'science',
          'a shell protects the animal that grows it',
          5,
          [
            N(
              'The shell once belonged to a soft-bodied sea animal. How does a shell help the animal that grows it survive?',
            ),
          ],
          [
            opt(
              'It is a hard shield against predators and knocks.',
              [
                N(
                  'Yes. A shell protects the soft body inside, so the animal can hide and rest safely.',
                ),
              ],
              true,
            ),
            opt('It helps the animal fly.', [
              N(
                'Shells are heavy! They protect, rather than lift. The hard outer layer shields the soft body.',
              ),
            ]),
          ],
          'Learned that a shell is a protective body part for a soft-bodied animal.',
          '4-LS1-1',
        ),
      ],
    ),
    scene(
      'a09-08-seabed-done',
      [
        N('You put the shell in your pocket. It is very light, and it seems to want carrying.'),
        N(
          'You tell yourself a shell cannot want anything. Still, your hand goes back to your pocket twice.',
        ),
      ],
      [
        ask(
          'literacy',
          'personification',
          -1,
          [
            N(
              '“It seems to want carrying.” A shell cannot want anything. What is the writer doing?',
            ),
          ],
          [
            opt(
              'Describing an object as if it had feelings, like a person.',
              [
                N(
                  'Yes. This is called personification. It makes the shell feel alive, and makes you feel gently responsible for it.',
                ),
              ],
              true,
            ),
            opt('Telling a fact about shells.', [
              N(
                'Not a fact. Shells cannot want things, so the writer is using imagination to give the shell feelings.',
              ),
            ]),
          ],
          'Recognised personification: giving a non-living thing human feelings.',
          'L.4.5',
        ),
      ],
    ),
    scene(
      'a09-08-complete',
      [
        N(
          'The sun goes down behind you. Out on the seabed, the light comes from the sky now, red and steady.',
        ),
        SK(
          'We’ll go on in the dark. The comet will light the way. That’s one thing to be said for it.',
        ),
        N(
          'Sniff counts his stilts, his pocket, his Nubbin, and you, and seems relieved that the number comes out the same.',
        ),
      ],
      [
        note(
          'science',
          'a comet shines because of the Sun',
          -1,
          [
            N(
              'A comet has no fire inside. Sunlight bounces off its dust, and its gas glows when sunlight hits it.',
            ),
            N(
              'Even after the Sun has set where you stand, the comet, far out in space, is still in the Sun’s light.',
            ),
            N('That is why you can see it in a night sky.'),
          ],
          'Learned that a comet shines because of sunlight: its dust reflects it and its gas glows in it.',
        ),
      ],
    ),
  ],
  [
    gloss(
      'tide',
      'The regular rising and falling of the sea, mainly caused by the Moon.',
      'a09-08-shore',
    ),
    gloss(
      'personification',
      'Writing about a thing, like a shell, as if it had feelings or acted like a person.',
      'a09-08-seabed-done',
    ),
  ],
  'Lessons: 3 − 1 days saved; tides and the Moon; a think question on saying the hard thing aloud; 90 − 30 cm; balance and a lower body; an inference; a shell as protection; personification; why a comet shines.',
);

// ================================================================== A9-9 The Octopus
const A09 = quest(
  'a09-09',
  'The Octopus',
  {
    'a09-09-s1': {
      goal: 'Cross the deep part of the seabed by the comet’s light.',
      hint: 'Keep to the ridge of rock. Don’t go near the dark pool.',
    },
    'a09-09-s2': {
      goal: 'Keep everyone together while the Snork Maiden acts.',
      hint: 'Hold the line on the ridge. Hold a light up if you have one.',
    },
  },
  [
    scene(
      'a09-09-deep',
      [
        N(
          'The seabed dips into its deepest part. The mud gives way to black rock and pools that go down further than light.',
        ),
        N('Everything is red under the comet. The puddles shine like spilt jam.'),
        SO('We keep to the ridge. Single file. That is a rule.', 'think'),
        N(
          'Moomintroll is in front, looking ahead to where the valley must be. He is going too fast.',
        ),
        MT('Not far now. I can almost smell the house. I can almost smell the jam.', 'happy'),
        N(
          'He steps off the ridge to cut a corner. His stilt sinks into the edge of the biggest, darkest pool.',
        ),
        N('The water in the pool moves, though there is no wind.'),
      ],
      [
        note(
          'science',
          'a ridge is a high, firm path',
          -1,
          [
            N('A ridge is a long, narrow strip of high ground.'),
            N('It is firmer than the wet mud beside it. That is why the Snork wants everyone on it.'),
          ],
          'Learned that a ridge is a long, narrow strip of high ground.',
        ),
      ],
    ),
    scene(
      'a09-09-deep-done',
      [
        SK('Moomintroll. Come back on the ridge. Slowly.'),
        N(
          'Snufkin does not shout. His voice is low and even, as if there is all the time in the world.',
        ),
      ],
      [
        ask(
          'social-studies',
          'why we keep safety rules even when they cost time',
          1,
          [
            N(
              'The Snork’s rule is “keep to the ridge, single file”. It is slower than cutting corners. Why is it still a good rule here?',
            ),
          ],
          [
            opt(
              'The ridge is the safe path, and the pools are unknown.',
              [
                N(
                  'Yes. A rule can save you from dangers you cannot see. Cutting the corner saved seconds and risked much more.',
                ),
              ],
              true,
            ),
            opt('The Snork likes being in charge.', [
              N(
                'He does, and that is true. But a rule can be bossy and sensible at once, and this one is sensible.',
              ),
            ]),
          ],
          'Reasoned about why a safety rule is worth following even when it is slower.',
          'D2.Civ.8.3-5',
        ),
        ask(
          'sel',
          'a calm voice helps in a frightening moment',
          -1,
          [N('Why does Snufkin speak calmly and slowly instead of shouting?')],
          [
            opt(
              'A calm voice helps the other person stay steady and listen.',
              [
                N(
                  'Yes. Shouting can make fear grow, and calm helps people think. Calm is catching.',
                ),
              ],
              true,
            ),
            opt('He doesn’t realise it is dangerous.', [
              N(
                'He knows exactly how dangerous it is. That is why he stays calm: it is the best way to help Moomintroll get out safely.',
              ),
            ]),
          ],
          'Understood that a calm voice helps a frightened person stay steady.',
          'CASEL: Self-management',
        ),
      ],
    ),
    scene(
      'a09-09-octopus',
      [
        N('A long arm comes out of the pool, and then another, grey and slow and curious.'),
        N(
          'An octopus as big as a cart lifts its head out of the water and looks at Moomintroll with one large, sad eye.',
        ),
        N(
          'An arm curls round his stilt, and another round his middle. He cannot get back on the ridge.',
        ),
        MT('Help! It’s got hold! I can’t pull free!', 'shock'),
        N(
          'Sniff squeaks and dives behind the Hemulen. The Hemulen holds his net up, which is no use at all, but brave.',
        ),
        N(
          'The Snork Maiden is already moving. She takes the lantern off the Snork’s pack, lights it and runs at the pool.',
        ),
        SM('Let him GO!', 'angry'),
        N(
          'She swings the lantern up into the octopus’s eye. The light flares on the wet rock, gold in all that red.',
        ),
        N('Octopuses are curious, not cruel. This one has simply never seen a Moomin.'),
      ],
      [
        note(
          'sel',
          'people react to fear in different ways',
          -1,
          [
            N(
              'Sniff hides, the Hemulen holds up a net, and the Snork Maiden runs at the pool with a lantern. Each reacts to fear in a different way.',
            ),
            N('None of these is wrong. What matters is that nobody leaves Moomintroll alone.'),
          ],
          'Noticed that people respond to fear in different ways, and that helping is what matters.',
        ),
      ],
      [
        {
          id: 'light',
          label: 'Hold your own light up behind her.',
          then: [
            N(
              'You hold up the pink shell from the seabed. It catches the lantern and throws the light back, twice as bright.',
            ),
            N('The octopus blinks, both eyes, very slowly, and its arms open.'),
          ],
        },
        {
          id: 'line',
          label: 'Grab Moomintroll’s paw and pull.',
          then: [
            N(
              'You lean out from the ridge and catch his paw. The Hemulen catches your collar, and the Snork catches the Hemulen.',
            ),
            N(
              'The octopus blinks at the lantern, and its arms open, and you all fall backwards in a heap.',
            ),
          ],
        },
      ],
    ),
    scene(
      'a09-09-octopus-done',
      [
        N(
          'The octopus slides back into its pool without a splash, as if embarrassed. The water closes, and it is gone.',
        ),
        N(
          'A real octopus has eight arms, three hearts and no bones. It hides by changing colour, which is called camouflage.',
        ),
        N(
          'Moomintroll is sitting on the ridge in the mud with his stilts crossed, staring at the Snork Maiden.',
        ),
      ],
      [
        ask(
          'maths',
          'subtraction: arms holding and arms free',
          1,
          [
            N(
              'Two of the octopus’s eight arms were holding Moomintroll. How many arms were free?',
            ),
          ],
          [
            opt('6', [N('Yes. 8 − 2 = 6 arms were free, curling in the water.')], true),
            opt('10', [N('That adds them. Take the two holding arms away: 8 − 2 = 6.')]),
            opt('2', [N('Two were holding him. The rest were free: 8 − 2 = 6.')]),
          ],
          'Subtracted 2 from 8 to find the octopus’s free arms.',
          '1.OA.A.1',
        ),
        ask(
          'sel',
          'fairness to animals',
          -1,
          [
            N(
              'The octopus was curious, not cruel, and it was frightened by the lantern. Is it fair to frighten an animal to protect a friend? Think about it.',
            ),
          ],
          [
            opt('Yes, protecting a friend comes first, as long as the animal is not hurt.', [
              N(
                'That’s a fair answer. The Snork Maiden used light, not force, and the octopus went home unharmed.',
              ),
            ]),
            opt('No, we should have found a way that did not scare it.', [
              N(
                'That’s a fair answer. Animals can be frightened too, and a gentler way is worth looking for when there is time.',
              ),
            ]),
            opt('It depends on whether anyone was in danger.', [
              N(
                'That’s a fair answer. When a friend is held, there is little time. Afterwards we can still think about how to be kinder next time.',
              ),
            ]),
          ],
          'Thought about how to balance protecting a friend with fairness to an animal.',
          'CASEL: Social awareness',
        ),
      ],
    ),
    scene(
      'a09-09-complete',
      [
        MT('You saved me.', 'shock'),
        SM('You saved me first. Now we’re even. It’s much better being even.', 'happy'),
        MT('I didn’t know you could do that.'),
        SM('Neither did I. I was too busy doing it to find out.'),
        N(
          'Sniff comes out from behind the Hemulen, and your Nubbin out of his pocket. Both look surprised to be alive and fine.',
        ),
        SO('I am noting that the Snork Maiden was brave. I am underlining it. Twice.', 'soft'),
      ],
      [
        ask(
          'literacy',
          'multiple-meaning words: “even”',
          1,
          [
            N(
              'The Snork Maiden says, “Now we’re even.” “Even” can also describe numbers like 2, 4 and 6. Which meaning is it here?',
            ),
          ],
          [
            opt(
              'Equal: each of them has helped the other.',
              [
                N(
                  'Yes. “Even” here means level, with nothing owed either way. Friends often like keeping things even.',
                ),
              ],
              true,
            ),
            opt('A number that divides by two.', [
              N(
                'That is another meaning of “even”, but here nobody is talking about numbers. They are talking about favours: each has rescued the other.',
              ),
            ]),
          ],
          'Chose the right meaning of “even” from context.',
          'L.3.4',
        ),
      ],
    ),
  ],
  [
    gloss(
      'camouflage',
      'Colours or patterns that help an animal hide by matching its surroundings.',
      'a09-09-octopus-done',
    ),
  ],
  'Lessons: why safety rules matter; a calm voice; 8 − 2 free arms; octopus facts in the story; a think question on fairness to animals; “even” as equal.',
);

// ================================================================== A9-10 The Race Home
const A10 = quest(
  'a09-10',
  'The Race Home',
  {
    'a09-10-s1': {
      goal: 'Get off the seabed and on to the road home under the red sky.',
      hint: 'Climb the shingle bank on the far side, then keep walking.',
    },
    'a09-10-s2': {
      goal: 'Hold on together when the tornado comes.',
      hint: 'Get everyone into the lee of the stone wall and hold on to the nearest paw.',
    },
    'a09-10-s3': {
      goal: 'Run the last stretch to the valley.',
      hint: 'Down through the birch wood. You know the way from here.',
    },
  },
  [
    scene(
      'a09-10-road',
      [
        N('You climb off the seabed in the morning and leave the stilts in a heap on the shingle.'),
        N(
          'The sky is red now in the daytime too. The air is hot and still, and the leaves on the trees hang down, tired.',
        ),
        SM('What day is it?'),
        SO('The seventh. I have it written down. I wish I didn’t.', 'sad'),
        SN('It’s today. It’s actually today.', 'shock'),
        MT(
          'We can still do it. It doesn’t come till the evening. We can be home long before that.',
        ),
        N('Sniff looks at you, quickly, and then away, and walks a little faster.'),
      ],
      [
        ask(
          'sel',
          'reading how others feel',
          6,
          [
            N(
              'Sniff glances at you quickly, then looks away and walks faster. What might he be feeling?',
            ),
          ],
          [
            opt(
              'Hopeful and worried at the same time.',
              [
                N(
                  'Yes. He is hoping your words come true, and worried that they might not. Feelings often come in pairs.',
                ),
              ],
              true,
            ),
            opt('Bored.', [
              N(
                'Boredom does not make people walk faster. His quick glance and hurry show hope and worry together.',
              ),
            ]),
          ],
          'Read two mixed feelings from a character’s quick glance and faster walking.',
          'CASEL: Social awareness',
        ),
      ],
    ),
    scene(
      'a09-10-road-done',
      [
        N('At a crossroads there is a milestone: Valley, eighteen kilometres.'),
        N(
          'On the stone, a second Hemulen in a large flowered dress is fanning himself with a hymn sheet.',
        ),
        H2('Cousin! What are you doing out on a day like this?', 'shock'),
        HE('Walking very fast, cousin. You should too. We walk at six kilometres an hour.'),
      ],
      [
        ask(
          'maths',
          'distance, speed and time',
          -1,
          [
            N(
              'The valley is 18 km away and the group walks 6 km every hour. How many hours will it take?',
            ),
          ],
          [
            opt('3 hours', [N('Yes. 18 ÷ 6 = 3, so 3 hours.')], true),
            opt('12 hours', [
              N('That subtracts. Divide the distance by the speed: 18 ÷ 6 = 3 hours.'),
            ]),
            opt('6 hours', [
              N('That is the speed per hour. 18 km at 6 km an hour is 18 ÷ 6 = 3 hours.'),
            ]),
          ],
          'Divided 18 km by 6 km per hour to find 3 hours.',
          '4.MD.A.2',
        ),
      ],
    ),
    scene(
      'a09-10-tornado',
      [
        N(
          'The wind comes all at once, out of a still sky. Dust goes up in a spinning column that walks across the fields.',
        ),
        SK('Tornado! Down behind the wall, everybody!'),
        N(
          'It does not care about walls. It picks up a haystack, a gate, two hens, and then it picks up the other Hemulen.',
        ),
        N(
          'His flowered dress fills like a sail. He goes up, and grabs the first thing he can, which is Moomintroll.',
        ),
        N('Moomintroll grabs the Snork Maiden, the Snork Maiden grabs Sniff, and Sniff grabs you.'),
        N('Then nobody is on the ground at all.'),
        H2('This is very irregular!', 'shock'),
        SK('Hold your skirts out wide! Like wings! Wide as you can!'),
        N(
          'The other Hemulen spreads his dress, and the spinning stops, and you are gliding. All of you, in a chain, under a flowered sky.',
        ),
      ],
      [
        ask(
          'science',
          'air resistance',
          8,
          [
            N(
              'When the Hemulen spreads his dress, you glide down slowly instead of falling fast. Which force is pushing up against the wide dress?',
            ),
          ],
          [
            opt(
              'Air resistance: the air pushing back as the cloth moves through it.',
              [
                N(
                  'Yes. A wide surface catches lots of air, so the air pushes back harder. That is how parachutes work.',
                ),
              ],
              true,
            ),
            opt('Magnetism.', [
              N(
                'Magnetism pulls on magnets and some metals, not on cloth. It is air resistance that slows a wide dress.',
              ),
            ]),
            opt('Gravity.', [
              N('Gravity pulls you down. The force pushing up against it is air resistance.'),
            ]),
          ],
          'Learned that air resistance pushes up against a wide surface and slows a fall, as in a parachute.',
          '3-PS2-1',
        ),
      ],
      [
        {
          id: 'hold',
          label: 'Hold on tight to Sniff.',
          then: [
            N('Sniff has his eyes shut. He has both paws on you and one foot on his pocket.'),
            SN('Tell me when it’s over. Tell me exactly when.', 'shock'),
          ],
        },
        {
          id: 'look',
          label: 'Open your eyes and look down.',
          then: [
            N(
              'Below you the whole country is laid out like a map in red light: the mountains, the dry sea, the river.',
            ),
            N(
              'And at the end of the river, a green valley, and a tall blue house in it like a stove.',
            ),
          ],
        },
      ],
    ),
    scene(
      'a09-10-tornado-done',
      [
        N(
          'The wind drops you all, gently in the end, in a long meadow, one after the other, like socks letting go of their pegs.',
        ),
        H2('My best dress. My very best dress. It has never been so useful.', 'happy'),
        N(
          'A real tornado forms under a huge thundercloud, when warm damp air rises quickly and starts to spin. Tornadoes are rare, and forecasters watch for them.',
        ),
      ],
      [
        ask(
          'literacy',
          'similes',
          0,
          [
            N(
              '“One after the other, like socks letting go of their pegs.” What does this simile help you picture?',
            ),
          ],
          [
            opt(
              'Everyone landing softly in a row, one at a time.',
              [
                N(
                  'Yes. Socks drop off a line one at a time, which makes the landing look gentle and funny.',
                ),
              ],
              true,
            ),
            opt('Everyone crashing down together.', [
              N(
                'Socks falling off a line drop softly, not with a crash. The simile shows a gentle, one-by-one landing.',
              ),
            ]),
          ],
          'Explained what a simile makes the reader picture.',
          'L.4.5',
        ),
        ask(
          'social-studies',
          'useful or beautiful?',
          1,
          [
            N('The Hemulen calls it his “best dress” and says it has “never been so useful”.'),
            N(
              'Is something worth more when it is beautiful, or when it is useful? Think about it.',
            ),
          ],
          [
            opt('Beautiful things are worth more, because they bring joy.', [
              N('That’s a fair answer. Beauty feeds the heart, and a good life needs it.'),
            ]),
            opt('Useful things are worth more, because they help us survive.', [
              N('That’s a fair answer. A thing that saves lives has a value you can measure.'),
            ]),
            opt('Some things, like this dress, can be both.', [
              N(
                'That’s a fair answer. The dress was lovely first, and now it has earned a second kind of value.',
              ),
            ]),
          ],
          'Thought about whether beauty or usefulness gives something more worth.',
          'D2.Eco.1.3-5',
        ),
      ],
    ),
    scene(
      'a09-10-run',
      [
        N(
          'Everyone sits up in the meadow and counts themselves. The Snork counts all of you, himself last, and writes it down.',
        ),
        SO('Seven, and a Nubbin, and a cousin. Nobody missing. Nobody even bent.', 'happy'),
        N(
          'The comet fills a third of the sky now. The light is the colour of the inside of an ember.',
        ),
        SM('How far is it to the valley?'),
        MT('Over the hill and down through the birch wood. Not far. Not far at all.', 'happy'),
        N('Snufkin is patting his head. His hat has gone.'),
        N(
          'You look round. It is caught on a thistle three steps away, rocking in the last of the wind.',
        ),
      ],
      [
        ask(
          'maths',
          'adding to count a group',
          1,
          [
            N(
              'The Snork counts seven: Moomintroll, Sniff, Snufkin, the Snork Maiden, the Hemulen, you and himself. Then there are a Nubbin and a cousin. How many is that altogether?',
            ),
          ],
          [
            opt('9', [N('Yes. 7 + 1 + 1 = 9.')], true),
            opt('8', [
              N(
                'You have counted one of the extras. There are two extras: the Nubbin and the cousin. 7 + 2 = 9.',
              ),
            ]),
            opt('10', [
              N('Check it: 7, then 8 for the Nubbin, then 9 for the cousin. That is nine.'),
            ]),
          ],
          'Added 7 + 1 + 1 to count a group of 9.',
          '2.OA.A.1',
        ),
      ],
      [
        {
          id: 'catch',
          label: 'Run and catch it.',
          then: [
            N('You grab it just as it lifts. It is old and soft and smells of woodsmoke and rain.'),
            SK('Hold on to it for me. I’ve got my hands full of Sniff.', 'happy'),
          ],
        },
        {
          id: 'nubbin',
          label: 'Let your Nubbin fetch it.',
          then: [
            N(
              'Your Nubbin jumps out of Sniff’s pocket, runs, and arrives under the hat, which settles over it completely.',
            ),
            N(
              'The hat walks back to you. Snufkin laughs out loud, for the first time on the whole road.',
            ),
          ],
        },
      ],
    ),
    scene(
      'a09-10-run-done',
      [
        N(
          'Then you run, all of you, down through the birch wood, the hat in your arms, the comet filling half the sky.',
        ),
        MT('There! There’s the house! There’s the smoke from the chimney!', 'happy'),
        N(
          'The comet looks bigger and bigger as you run, the way a cart does as it comes up the lane.',
        ),
      ],
      [
        ask(
          'science',
          'things look bigger as they come closer',
          -1,
          [N('Why does something coming towards you look bigger and bigger?')],
          [
            opt(
              'The nearer it is, the more of your view it fills.',
              [
                N(
                  'Yes. Distance changes how big an object looks. Real comets stay millions of kilometres away, so none ever fills the sky like this one.',
                ),
              ],
              true,
            ),
            opt('It really is growing.', [
              N(
                'It looks that way, but the object does not change size. It only fills more of your view because it is closer.',
              ),
            ]),
          ],
          'Learned that nearer objects look bigger because they fill more of our view.',
        ),
      ],
    ),
    scene(
      'a09-10-complete',
      [
        N(
          'The garden is empty and the house is shut. A note is pinned to the door in Moominmamma’s round writing.',
        ),
        MT('“Gone to the cave. Come quickly. Have brought the cake.”'),
        SN('The cave. Our cave. My cave!', 'happy'),
        N(
          'The other Hemulen is still holding his dress out, in case. Nobody tells him he can stop.',
        ),
      ],
      [
        ask(
          'literacy',
          'reading a note for character',
          -1,
          [
            N(
              'Moominmamma’s note says where she has gone and mentions the cake. What does it tell us about her?',
            ),
          ],
          [
            opt(
              'She planned ahead, stayed calm, and is looking after her family.',
              [
                N(
                  'Yes. She picked a safe place, left a clear message, and even remembered the cake. Her calm is a kind of care.',
                ),
              ],
              true,
            ),
            opt('She forgot the family.', [
              N('She did the opposite. She left a note so they could find her.'),
            ]),
          ],
          'Inferred a character’s calm and care from the note she left.',
          'RL.3.3',
        ),
      ],
    ),
  ],
  [
    gloss('shingle', 'Small, rounded stones on a beach.', 'a09-10-road'),
    gloss(
      'tornado',
      'A fast, spinning column of air that reaches from a thundercloud to the ground.',
      'a09-10-road',
    ),
  ],
  'Lessons: how tornadoes form; reading mixed feelings; 18 ÷ 6 hours; air resistance; a simile; a think question on useful or beautiful; 7 + 1 + 1; nearer things look bigger; reading a note.',
);

// ================================================================== A9-11 The Cave
const A11 = quest(
  'a09-11',
  'The Cave',
  {
    'a09-11-s1': {
      goal: 'Get everyone down to the cave on the shore.',
      hint: 'Take Sniff’s secret path. It is the quickest, and it is still a secret, mostly.',
    },
    'a09-11-s2': {
      goal: 'Choose the one thing you bring into the cave.',
      hint: 'Moominmamma is at the cave mouth. Show her what you are carrying.',
    },
    'a09-11-s3': {
      goal: 'Sit with Sniff in the dark while the comet comes.',
      hint: 'He is at the very back of the cave. Sit down beside him.',
    },
  },
  [
    scene(
      'a09-11-arrive',
      [
        N(
          'Sniff leads the way down his secret path, very fast, with everyone behind him. He does not mention it is a secret.',
        ),
        N('The cave mouth glows. Inside, Moominmamma has made it a room.'),
        N(
          'There are blankets on the sand, and lamps, and the rocking chair, and the clock from the kitchen, ticking.',
        ),
        MM('There you are. There you all are. And more of you than went.', 'happy'),
        N('Moomintroll runs into her apron and stays there for a while.'),
        MM(
          'Come in, all of you. There’s cake. There’s always cake, at the end of the world. That’s what cake is for.',
          'soft',
        ),
        MP('I brought my memoirs. In case they were needed.'),
        MU('I brought my hammock. Nobody else thought of the hammock.', 'think'),
      ],
      [
        ask(
          'health',
          'what goes in an emergency kit',
          -1,
          [
            N(
              'Moominmamma brought blankets, lamps, a clock and food. Which of these is most useful in a real family emergency kit?',
            ),
          ],
          [
            opt(
              'Water, food, a torch, a blanket and a first-aid kit.',
              [
                N(
                  'Yes. Water, food, light, warmth and first aid are the basics for staying safe until help comes. A radio and a list of phone numbers are good additions.',
                ),
              ],
              true,
            ),
            opt('A hammock and a book of memoirs.', [
              N(
                'Lovely for comfort, but the basics are water, food, light, warmth and first aid. Mamma packed some of those, too.',
              ),
            ]),
          ],
          'Learned what to put in an emergency kit: water, food, light, warmth and first aid.',
          'CASEL: Responsible decision-making',
        ),
      ],
    ),
    scene(
      'a09-11-arrive-done',
      [
        N(
          'The kitchen clock says half past seven. It ticks very loudly, as clocks do when everybody is listening.',
        ),
        N('The comet is due at 8:42.'),
      ],
      [
        ask(
          'maths',
          'time intervals',
          -1,
          [N('It is 7:30 now, and the comet is due at 8:42. How long is that?')],
          [
            opt(
              '1 hour 12 minutes',
              [N('Yes. 7:30 to 8:30 is 1 hour, and 8:30 to 8:42 is 12 more minutes.')],
              true,
            ),
            opt('1 hour 42 minutes', [
              N(
                'That would be 7:30 to 9:12. Count 7:30 to 8:30 (1 hour) and then 8:30 to 8:42 (12 minutes).',
              ),
            ]),
            opt('42 minutes', [
              N(
                '42 is the minutes on the comet’s time, not the wait. 7:30 to 8:42 is 1 hour and 12 minutes.',
              ),
            ]),
          ],
          'Found the interval from 7:30 to 8:42 as 1 hour 12 minutes.',
          '3.MD.A.1',
        ),
      ],
    ),
    scene(
      'a09-11-door',
      [
        N(
          'Moominmamma stands at the cave mouth with a blanket over her arm, looking at what everybody has carried.',
        ),
        MM(
          'It’s a small cave, dear, and there are a lot of you now. One thing each, and only what you love fits.',
          'soft',
        ),
        MM('The rest can wait out here on the rock. It’ll be there in the morning.'),
        N(
          'The Snork puts down his minutes, and the Hemulen his net. Snufkin, who has nothing, keeps it.',
        ),
        N(
          'You empty your pockets on to the rock. The harmonica can wait, and Snufkin’s hat isn’t yours to choose.',
        ),
        N(
          'That leaves three: the shell from the seabed, the garnet Sniff gave you to hold, and your Nubbin.',
        ),
        N('Your arms are only so big.'),
      ],
      [
        ask(
          'sel',
          'what we choose to carry',
          -1,
          [
            N(
              '“Only what you love fits.” If you can carry only one thing, is it the one worth the most, or the one you would miss most? Think about it.',
            ),
          ],
          [
            opt('The one worth the most.', [
              N(
                'That’s a fair answer. Worth matters, and sensible people think about what could be replaced.',
              ),
            ]),
            opt('The one I would miss the most.', [
              N('That’s a fair answer. What we love is not always what costs the most.'),
            ]),
            opt('Whatever is alive and needs me.', [
              N(
                'That’s a fair answer. Something that depends on you, like a Nubbin, can matter more than anything you own.',
              ),
            ]),
          ],
          'Thought about how we choose what to keep when we cannot keep everything.',
          'D2.Eco.1.3-5',
        ),
      ],
      [
        {
          id: 'shell',
          label: 'The shell with no sea in it.',
          set: { 'a09-brought': 'shell' },
          then: [
            N(
              'You bring the shell. Your Nubbin, who was never going to be left outside, comes in as Sniff’s one thing.',
            ),
            MM('That one’s waiting for something. Yes. Bring it in.'),
          ],
        },
        {
          id: 'garnet',
          label: 'The garnet Sniff gave you to hold.',
          set: { 'a09-brought': 'garnet' },
          then: [
            N('You bring the garnet. Sniff sees, and pretends very hard not to have seen.'),
            MM('Somebody’s been generous. That’s worth a lot of room.', 'soft'),
          ],
        },
        {
          id: 'nubbin',
          label: 'Nothing but your Nubbin, held in both arms.',
          set: { 'a09-brought': 'nubbin' },
          then: [
            N(
              'You lift your Nubbin out of Sniff’s pocket and hold it in both arms. Everything else you leave on the rock.',
            ),
            MM('Yes. That’s the right size for arms.', 'soft'),
          ],
        },
      ],
    ),
    scene(
      'a09-11-dark',
      [
        N('The lamps go out one by one, to save oil. The kitchen clock says twenty to nine.'),
        N(
          'Outside, the sky is so red it comes in at the cave mouth and lies on the sand like a carpet.',
        ),
        N('A sound begins, very far off. It is like the whole sky taking in a breath.'),
        N(
          'Sniff is at the very back of the cave, as far back as there is. You go and sit down beside him.',
        ),
        N('He doesn’t ask you anything this time. You said you didn’t know, and he remembers.'),
        N('In the dark his paw finds your hand and holds on.'),
        N(
          'Neither of you says a word. You sit there together and wait, and that is the whole of what you can do.',
        ),
      ],
      [
        ask(
          'maths',
          'minutes to the hour',
          0,
          [
            N(
              '“Twenty to nine” means 20 minutes before nine o’clock. What time is that written as? And how long is it until 8:42?',
            ),
          ],
          [
            opt(
              '8:40, so 2 minutes until 8:42.',
              [N('Yes. Twenty to nine is 8:40, and 8:42 is two minutes later.')],
              true,
            ),
            opt('9:20, so 22 minutes to go.', [
              N(
                '“To” means before the hour, so twenty to nine is earlier than nine: 8:40. 8:42 is two minutes after that.',
              ),
            ]),
            opt('8:20, so 22 minutes to go.', [
              N(
                '“Twenty to nine” means 20 minutes before 9:00, which is 8:40. “Twenty past eight” would be 8:20.',
              ),
            ]),
          ],
          'Read “twenty to nine” as 8:40 and found 2 minutes until 8:42.',
          '3.MD.A.1',
        ),
      ],
    ),
    scene(
      'a09-11-dark-done',
      [N('The kitchen clock says eight forty-two.')],
      [
        note(
          'sel',
          'waiting feels long, and that is normal',
          -1,
          [
            N(
              'When we wait for something we are afraid of, a minute can feel very long. That is a normal feeling, and it passes.',
            ),
          ],
          'Noticed that waiting for something frightening can feel long, and that the feeling passes.',
          'CASEL: Self-awareness',
        ),
      ],
    ),
    scene(
      'a09-11-complete',
      [
        N(
          'Then everything is light and noise. The ground shakes, gently, like a cupboard when a train goes by.',
        ),
        N(
          'Moominmamma’s voice comes through it, quite calm, saying what she always says at bedtime.',
        ),
        MM('Hush now. Hush. Everyone is here.', 'soft'),
      ],
      [
        note(
          'sel',
          'comforting words and staying calm',
          -1,
          [
            N(
              '“Hush now. Everyone is here.” When something frightening happens, calm, familiar words can help us feel safe.',
            ),
            N('They do not stop the noise, but they remind us we are not alone.'),
          ],
          'Noticed how calm, familiar words comfort us in frightening moments.',
          'CASEL: Relationship skills',
        ),
      ],
    ),
  ],
  [
    gloss('memoirs', 'A book in which someone writes about their own life.', 'a09-11-arrive'),
  ],
  'Lessons: an emergency kit; 7:30 to 8:42; a think question on what we choose to carry; twenty to nine is 8:40; comfort.',
);

// ================================================================== A9-12 The Night It Missed
const A12 = quest(
  'a09-12',
  'The Night It Missed',
  {
    'a09-12-s1': {
      goal: 'Wait out the night in the cave.',
      hint: 'Stay where you are. It is nearly over.',
    },
    'a09-12-s2': {
      goal: 'Go out of the cave in the morning and see what the comet left.',
      hint: 'Walk out of the cave mouth and down to the water.',
    },
    'a09-12-s3': {
      goal: 'Say goodbye to the valley and give Snufkin back his hat.',
      hint: 'Snufkin is at the gate with his pack on. Bring the hat.',
    },
  },
  [
    scene(
      'a09-12-night',
      [
        N(
          'The roar goes over. It goes on a long time, and then it is less, and then it is going away.',
        ),
        N(
          'You can feel it going, the way you feel a cart go past in the street with your eyes shut.',
        ),
        MU('Hm. It seems to have missed. How very unphilosophical of it.', 'think'),
        N('Somebody laughs in the dark: the Snork Maiden. Then Moomintroll, and then everybody.'),
        SN('Has it gone? Is it over? Tell me exactly.', 'shock'),
        MP(
          'It brushed us with its tail and went on its way. It had somewhere else to be, I expect.',
          'soft',
        ),
        N(
          'The lamps come back on and Moominmamma cuts the cake. Nobody remembers afterwards if it was good, only that it was there.',
        ),
      ],
      [
        note(
          'science',
          'real comets orbit the Sun and almost always pass by',
          6,
          [
            N(
              'Real comets travel round the Sun on long, stretched-out paths called orbits. Some come back again and again.',
            ),
            N(
              'The most famous, Halley’s Comet, returns about every 76 years. A real comet almost never comes close to hitting the Earth; it passes at a safe, great distance.',
            ),
          ],
          'Learned that comets orbit the Sun, that Halley’s Comet returns about every 76 years, and that they almost always pass safely.',
        ),
        ask(
          'literacy',
          'irony and humour',
          2,
          [
            N(
              'The Muskrat said the end of everything was restful, but now complains the comet “missed”. What makes his remark funny?',
            ),
          ],
          [
            opt(
              'He sounds disappointed, which shows he did not mean what he said.',
              [
                N(
                  'Yes. The joke is that his own gloomy view turned out to be less comforting than he claimed. That kind of contrast is called irony.',
                ),
              ],
              true,
            ),
            opt('He was never worried.', [
              N(
                'Perhaps, but the joke is the contrast between his gloomy talk and his disappointed tone. That is irony.',
              ),
            ]),
          ],
          'Understood the irony in a character’s remark.',
          'RL.3.6',
        ),
      ],
    ),
    scene(
      'a09-12-night-done',
      [
        N('One by one, everybody falls asleep where they are sitting, in a heap, like puppies.'),
        N('It has been a very long day, and a very long night.'),
      ],
      [
        ask(
          'health',
          'sleep for growing children',
          -1,
          [
            N(
              'After a big day, everybody falls asleep. How much sleep do children aged 6 to 12 need each night, according to doctors?',
            ),
          ],
          [
            opt(
              'About 9 to 12 hours',
              [
                N(
                  'Yes. Children this age need roughly 9 to 12 hours. Sleep helps your body grow and your mind sort out the day.',
                ),
              ],
              true,
            ),
            opt('About 4 to 5 hours', [
              N('That is far too little. Growing children need about 9 to 12 hours.'),
            ]),
            opt('About 15 hours', [
              N(
                'That is closer to a baby’s needs. Children aged 6 to 12 need about 9 to 12 hours.',
              ),
            ]),
          ],
          'Learned that children aged 6 to 12 need about 9 to 12 hours of sleep.',
        ),
      ],
    ),
    scene(
      'a09-12-dawn',
      [
        N('In the morning you wake up with sand in your ear and your Nubbin asleep on your chest.'),
        N('The light at the cave mouth is not red. It is ordinary, yellow, wonderful morning.'),
        N(
          'You go out, and the grey has gone off everything. The grass is green, and wet, and has never looked so like grass.',
        ),
        N(
          'And the sea is coming back. It comes in over the seabed in long, slow, shining sheets, filling every hollow.',
        ),
        MT('It came back. Everything came back.', 'happy'),
        SK('Things mostly do. Not always. But mostly.', 'soft'),
        N(
          'The Hemulen is already in the long grass with his notebook, because there are butterflies.',
        ),
      ],
      [
        note(
          'science',
          'tides: the sea moves in and out each day',
          3,
          [
            N('On a real coast, the sea goes out and comes in twice a day. These are the tides.'),
            N('The Moon’s pull makes the water rise and fall in a steady rhythm.'),
            N('The sea in the story went much further than any tide.'),
          ],
          'Reviewed the idea that tides rise and fall twice a day, driven by the Moon.',
        ),
        ask(
          'literacy',
          'your view and a character’s: honest comfort',
          5,
          [
            N(
              'Snufkin says things “mostly” come back, “not always”. Would you rather hear “it will be fine” or “things mostly turn out all right”? Think about it.',
            ),
          ],
          [
            opt('“It will be fine” is better, because it comforts.', [
              N(
                'That’s a fair answer. Comfort has real value, especially when you are small and scared.',
              ),
            ]),
            opt('“Mostly” is better, because it is honest.', [
              N(
                'That’s a fair answer, and it is Snufkin’s view. Honesty lets us trust the person who comforts us.',
              ),
            ]),
            opt('Both, with the honest one for when we are ready.', [
              N(
                'That’s a fair answer. Comfort first, truth gently after, is a way to be kind and honest.',
              ),
            ]),
          ],
          'Compared their own view with Snufkin’s on comfort and honesty.',
          'RL.3.6',
        ),
      ],
    ),
    scene(
      'a09-12-dawn-done',
      [
        N(
          'Your Nubbin scrambles down to the water’s edge, sits in the first wave and lets the sea come home round it.',
        ),
        SN('It’s all right, then. It’s all right. I can tell, because it’s doing that.', 'happy'),
      ],
      [
        ask(
          'sel',
          'naming relief',
          -1,
          [N('Sniff’s worry has gone. Which word best names how he feels?')],
          [
            opt('Relieved', [N('Yes. Relief is the loosening you feel when a worry lifts.')], true),
            opt('Furious', [
              N('Not furious. Sniff is glad and loose, as the worry lets go. That is relief.'),
            ]),
            opt('Bored', [N('Not bored! He is happy and light, which is relief.')]),
          ],
          'Named relief as the feeling when a worry lifts.',
          'CASEL: Self-awareness',
        ),
      ],
    ),
    scene(
      'a09-12-gate',
      [
        N(
          'Snufkin is at the garden gate with his tent on his back. He is going south, in the end.',
        ),
        N('You hold out his hat. He looks at it for a while.'),
        SK('Keep it. I’ll find another. Hats come to me; it’s the strangest thing.', 'happy'),
        SK(
          'And if I had it back I’d have two again, sooner or later. You know how I feel about two.',
        ),
        N(
          'He puts it on your head, and it comes down over your eyes. Your Nubbin laughs, which is a sort of hiccup.',
        ),
        MM('Before you go, dear. Something to remember the house by.', 'soft'),
        N(
          'She gives you a little blue stove, the same blue as the house, small enough to carry and warm in your hands.',
        ),
        MM('For your own house. Wherever you light it, that’s where people come home to.'),
      ],
      [
        ask(
          'literacy',
          'theme: what makes a home',
          7,
          [
            N(
              'Moominmamma says, “Wherever you light it, that’s where people come home to.” What does she mean?',
            ),
          ],
          [
            opt(
              'A home is made by the people who gather there, not by the building.',
              [
                N(
                  'Yes. A warm stove stands for welcome, and welcome can be made anywhere. This is a theme of the whole story.',
                ),
              ],
              true,
            ),
            opt('The stove must be lit in a house of the same blue.', [
              N(
                'She is not talking about colour. She means that a home is wherever people are welcomed and warm.',
              ),
            ]),
          ],
          'Identified the theme that home is made by the people who gather there.',
          'RL.4.2',
        ),
      ],
    ),
    scene(
      'a09-12-gate-done',
      [
        N(
          'Snufkin is already at the bend in the road. He plays a few notes without looking back, and you play a few back.',
        ),
        N(
          'They come out like a duck in a cupboard. He waves his hand over his head, which means: right note, wrong place.',
        ),
      ],
      [
        note(
          'science',
          'migrating birds travel south for winter',
          1,
          [
            N('Snufkin goes south for the winter. Many birds of the north migrate that way too.'),
            N(
              'Swallows that nest in Finland spend the winter in southern Africa, many thousands of kilometres away.',
            ),
          ],
          'Learned that birds from Finland, such as swallows, migrate thousands of kilometres south for winter.',
        ),
        doit(
          'music',
          'call and response',
          -1,
          'edu:play:call-and-response',
          [
            N(
              'Snufkin plays a call and you answer. Try it: hum three notes (a call) and ask someone to echo them back (the response). Then swap.',
            ),
          ],
          'Practised call and response by echoing a short tune.',
        ),
      ],
    ),
    scene(
      'a09-12-complete',
      [
        N(
          'The page starts to curl at its edges, the way a page does when its story has got where it was going.',
        ),
        MT(
          'Will you come back? You can, you know. There’ll always be a bed. Mamma keeps a spare one for exactly this.',
          'happy',
        ),
        SN('Bring the Nubbin. My pocket will be empty otherwise. It’s a very good pocket.', 'soft'),
        N(
          'The blue house, the green valley, the sea coming home: they go flat and still, and they are paper.',
        ),
        N('You are back in the Grove, in a too-big hat, with a small blue stove in your arms.'),
      ],
      [
        ask(
          'literacy',
          'theme of the whole story',
          -1,
          [
            N(
              'Think about the whole story, from the grey sea to the blue stove. What is it mostly about?',
            ),
          ],
          [
            opt(
              'Facing something frightening together, and coming home.',
              [
                N(
                  'Yes. Worry is named, shared and carried by friends, and the story ends with everyone safe and together.',
                ),
              ],
              true,
            ),
            opt('How to build a raft.', [
              N(
                'The raft is one part. The story’s heart is bigger: friends facing a fear together.',
              ),
            ]),
            opt('How to collect butterflies.', [
              N(
                'That is one funny strand. The main theme is facing a scary thing together, with friends.',
              ),
            ]),
          ],
          'Identified the theme of the whole story: facing fear together and coming home.',
          'RL.4.2',
        ),
        note(
          'social-studies',
          'thank you in Finnish and Swedish',
          2,
          [
            N(
              'You were a guest in a Finnish story. In Finnish, “thank you” is “kiitos”. In Swedish, the other national language of Finland, it is “tack”.',
            ),
            N(
              'Try both aloud. People in Finland often know more than one language, which is a good way to make friends.',
            ),
          ],
          'Learned “thank you” in Finnish (kiitos) and Swedish (tack), the two national languages of Finland.',
        ),
      ],
    ),
  ],
  [
    gloss('orbit', 'The curved path an object takes round another in space.', 'a09-12-night'),
    gloss(
      'irony',
      'When what is said or happens is the opposite of what you expect, often for humour.',
      'a09-12-night',
    ),
    gloss(
      'migrate',
      'To travel a long way each year to find food or a warmer place.',
      'a09-12-gate-done',
    ),
  ],
  'Lessons: orbits and Halley’s Comet; irony; sleep needs; tides and a sea that went too far; relief; a think question on comfort and honesty; migrating birds; theme of a home; call and response; theme of the story; thank you in Finnish and Swedish.',
);

// ================================================================== variants
/** Variant scenes chosen by a09-answer and a09-brought. Each replaces the base scene named in its `of`. */
export const EDU_A09_READER_VARIANTS: EduScene[] = [
  scene(
    'a09-11-dark-home',
    [
      N('The lamps go out one by one, to save oil. The kitchen clock says twenty to nine.'),
      N(
        'Outside, the sky is so red it comes in at the cave mouth and lies on the sand like a carpet.',
      ),
      N('A sound begins, very far off. It is like the whole sky taking in a breath.'),
      N(
        'Sniff is at the very back of the cave, as far back as there is. You go and sit down beside him.',
      ),
      N('For a long time he doesn’t say anything. Then, in the dark, very small, he does.'),
      SN('We’re home by then. You said. We’re home by then.', 'soft'),
      N(
        'He has been carrying it since the mountain, like a button in a pocket. Now he gives it back to you to hold.',
      ),
      SN('And we are. We’re home. So that part came true.'),
      N('You sit there together and wait, and that is the whole of what you can do.'),
    ],
    [
      ask(
        'maths',
        'minutes to the hour',
        0,
        [
          N(
            '“Twenty to nine” means 20 minutes before nine o’clock. What time is that written as? And how long is it until 8:42?',
          ),
        ],
        [
          opt(
            '8:40, so 2 minutes until 8:42.',
            [N('Yes. Twenty to nine is 8:40, and 8:42 is two minutes later.')],
            true,
          ),
          opt('9:20, so 22 minutes to go.', [
            N(
              '“To” means before the hour, so twenty to nine is earlier than nine: 8:40. 8:42 is two minutes after that.',
            ),
          ]),
          opt('8:20, so 22 minutes to go.', [
            N(
              '“Twenty to nine” means 20 minutes before 9:00, which is 8:40. “Twenty past eight” would be 8:20.',
            ),
          ]),
        ],
        'Read “twenty to nine” as 8:40 and found 2 minutes until 8:42.',
        '3.MD.A.1',
      ),
      note(
        'sel',
        'keeping someone’s words, and saying a worry aloud',
        8,
        [
          N('Sniff kept your words “We’ll be home by then” for days, and now says them back.'),
          N('Kind words can stay with a person a long time.'),
          N('And saying a worry out loud, as Sniff does here, is how it begins to ease.'),
        ],
        'Noticed that kind words stay with a friend, and that saying a worry out loud helps it ease.',
        'CASEL: Self-awareness',
      ),
    ],
  ),
  scene(
    'a09-12-dawn-done-shell',
    [
      N('You take the pink shell out of your pocket and hold it to your ear.'),
      N(
        'Very faint, very far, there is the sound of the sea in it again. It must have got back first.',
      ),
      MT('Let me listen! Oh. Oh, it’s home.', 'happy'),
    ],
    [
      note(
        'science',
        'why a shell sounds like the sea',
        -1,
        [
          N('The “sea” in a shell is not the sea at all.'),
          N(
            'The hollow shell catches the small sounds around you, such as moving air and far-off voices, and makes some of them louder.',
          ),
          N(
            'That is called resonance. Try it with a mug held to your ear: you will hear almost the same rushing.',
          ),
        ],
        'Learned that the sound in a shell is the resonance of ordinary background noise.',
        '4-PS3-2',
      ),
    ],
  ),
  scene(
    'a09-12-dawn-done-garnet',
    [
      N('You hold out the garnet to Sniff. You were only holding it, after all.'),
      SN(
        'No. You keep it. I gave it to you to hold, and you held it all night, and that’s keeping.',
        'soft',
      ),
      N('He looks surprised at himself. Then he looks pleased, which surprises him more.'),
    ],
    [
      ask(
        'sel',
        'what generosity gives the giver',
        -1,
        [
          N(
            'Sniff gives away his garnet and is surprised to feel pleased. Why might giving feel good?',
          ),
        ],
        [
          opt(
            'Caring for a friend feels good, and so does trusting them.',
            [
              N(
                'Yes. Generosity usually gives the giver a warm feeling, and Sniff has found that out.',
              ),
            ],
            true,
          ),
          opt('He is glad to have less to carry.', [
            N(
              'That may be a tiny part of it, but the real warmth comes from sharing with a friend.',
            ),
          ]),
        ],
        'Reflected on why generosity can feel good for the giver.',
        'CASEL: Relationship skills',
      ),
    ],
  ),
  scene(
    'a09-12-dawn-mamma',
    [
      N('In the morning you wake up with sand in your ear and your Nubbin asleep on your chest.'),
      N('The light at the cave mouth is not red. It is ordinary, yellow, wonderful morning.'),
      N(
        'You go out, and the grey has gone off everything. The grass is green, and wet, and has never looked so like grass.',
      ),
      N(
        'And the sea is coming back. It comes in over the seabed in long, slow, shining sheets, filling every hollow.',
      ),
      MT('It came back. Everything came back.', 'happy'),
      SK('Things mostly do. Not always. But mostly.', 'soft'),
      N(
        'The Hemulen is already in the long grass with his notebook, because there are butterflies.',
      ),
        N(
          'Down at the water’s edge, the raft drifts in on the first wave, its name MAMMA still painted on the stern, as if it had only popped out.',
        ),
        SN('She came home on her own, with MAMMA still on the stern. That’s allowed, isn’t it?', 'happy'),
        MP('Naturally. She is named after Mamma. Mamma always comes home.', 'soft'),
    ],
    [
      ask(
        'sel',
        'why a character checks something he already believes',
        8,
        [
          N(
            'Sniff asks, “That’s allowed, isn’t it?” The raft is only a raft. Why might he need to check? Think about it.',
          ),
        ],
        [
          opt('He is happy, and wants someone to agree with him.', [
            N(
              'That’s a fair answer. Happy people often ask, just to hear a kind voice say yes.',
            ),
          ]),
          opt('He is not sure the rules allow a raft to come home alone.', [
            N(
              'That’s a fair answer. Sniff likes rules, and this is a new one. Moominpappa’s “Naturally” settles it.',
            ),
          ]),
        ],
        'Thought about why a character says a hopeful thing as a question.',
        'CASEL: Social awareness',
      ),
      note(
        'science',
        'tides: the sea moves in and out each day',
        3,
        [
          N('On a real coast, the sea goes out and comes in twice a day. These are the tides.'),
          N('The Moon’s pull makes the water rise and fall in a steady rhythm.'),
          N('The sea in the story went much further than any tide.'),
        ],
        'Reviewed the idea that tides rise and fall twice a day, driven by the Moon.',
      ),
    ],
  ),
  scene(
    'a09-12-dawn-valuable',
    [
      N('In the morning you wake up with sand in your ear and your Nubbin asleep on your chest.'),
      N('The light at the cave mouth is not red. It is ordinary, yellow, wonderful morning.'),
      N(
        'You go out, and the grey has gone off everything. The grass is green, and wet, and has never looked so like grass.',
      ),
      N(
        'And the sea is coming back. It comes in over the seabed in long, slow, shining sheets, filling every hollow.',
      ),
      MT('It came back. Everything came back.', 'happy'),
      SK('Things mostly do. Not always. But mostly.', 'soft'),
      N(
        'The Hemulen is already in the long grass with his notebook, because there are butterflies.',
      ),
        N(
          'Down at the water’s edge, the raft drifts in on the first wave, its name THE VALUABLE still painted on the stern. Sniff pats it, twice.',
        ),
        SN('She came home on her own. That’s what a valuable does.', 'happy'),
        MP('Naturally. She is called The Valuable. One does not lose a valuable.'),
    ],
    [
      ask(
        'sel',
        'why a character checks something he already believes',
        8,
        [
          N(
            'Sniff says, “That’s what a valuable does.” Why might he say it so firmly? Think about it.',
          ),
        ],
        [
          opt('He loves the raft, and wants it to be special.', [
            N(
              'That’s a fair answer. When we love something, we like to say what makes it special.',
            ),
          ]),
          opt('He is a little afraid it might not have come home.', [
            N(
              'That’s a fair answer. Saying something firmly can be a way of keeping a worry small.',
            ),
          ]),
        ],
        'Thought about why a character says a hopeful thing as a question.',
        'CASEL: Social awareness',
      ),
      note(
        'science',
        'tides: the sea moves in and out each day',
        3,
        [
          N('On a real coast, the sea goes out and comes in twice a day. These are the tides.'),
          N('The Moon’s pull makes the water rise and fall in a steady rhythm.'),
          N('The sea in the story went much further than any tide.'),
        ],
        'Reviewed the idea that tides rise and fall twice a day, driven by the Moon.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A09_READER: EduQuest[] = [
  A01,
  A02,
  A03,
  A04,
  A05,
  A06,
  A07,
  A08,
  A09,
  A10,
  A11,
  A12,
];

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  'edu:multiply:sandwiches:6',
  'edu:breathe:still:5',
  'edu:write:field-note:butterfly',
  'edu:play:call-and-response',
];
