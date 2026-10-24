/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Atlas page A9, The Comet.
 *
 * Source: atlas-a09.ts (Comet in Moominland, Finland), twelve quests. One EduScene per original scene
 * (every step scene, every done scene, every complete scene and the three variants), id
 * `sprout:<original id>`. See EDU-STYLE.md.
 *
 * - Choice ids and `set` flags are copied from the originals (a09-answer, a09-brought), so the
 *   signature choice and the bring choice still work. Every choice here is kind and safe, so
 *   no sprout choice is dropped.
 * - The comet is a mystery in the sky, never a threat: the bush, the octopus and the tornado
 *   are a bump or a fright, with comfort straight after. The stranded fish rests in a puddle.
 * - Lessons (the outline’s angle): what a comet is and why its tail points away from the Sun;
 *   the clock (nearly nine, half past); Finland and its two languages; naming a worry and saying
 *   it out loud; plus counting, shapes, sound, floating, butterflies, octopus arms and weather.
 * - Facts used are well established: a comet is ice and dust with a glowing tail; the tail
 *   points away from the Sun; real comets almost always pass by; Finnish and Swedish are
 *   spoken in Finland; Tove Jansson wrote the books in Finland; an octopus has eight arms;
 *   butterflies have four wings; wood floats and stones sink; sound is a vibration; tides.
 * - Nothing is lifted from the books; every line is new.
 */
import type { EduQuest, EduScene, Lesson } from './types';
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

/** One answer option. `best` marks the answer the lesson teaches. */
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

/** One sprout scene. `after: -1` means after the last line. Lesson ids are `sprout:<of>-l<n>`. */
const sc = (
  of: string,
  lines: Line[],
  beats: Beat[],
  extra: { choices?: Choice[]; defaultChoice?: string } = {},
): EduScene => ({
  id: `sprout:${of}`,
  of,
  band: 'sprout',
  lines,
  ...extra,
  lessons: beats
    .map((b) => (b.after < 0 ? { ...b, after: lines.length - 1 } : b))
    .sort((a, b) => a.after - b.after)
    .map((b, i) => ({ id: `sprout:${of}-l${i + 1}`, ...b })),
});

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

// ================================================================== A9-1 Strange Signs
const A01 = quest(
  'a09-01',
  'Strange Signs',
  {
    'a09-01-s1': {
      goal: 'Meet Moomintroll and Sniff in the green valley.',
      hint: 'Touch the blue house. Then walk to the garden gate.',
    },
    'a09-01-s2': {
      goal: 'Follow Sniff’s secret path down to the sea.',
      hint: 'The path is behind the woodshed. It goes through the bushes.',
    },
    'a09-01-s3': {
      goal: 'Ask the Muskrat in the hammock about the grey dust.',
      hint: 'He is between the two birch trees. He is not getting up.',
    },
  },
  [
    sc(
      'a09-01-valley',
      [
        N('Nova’s atlas opens on a green valley by the sea.'),
        N('A tall blue house stands in it, round like a stove.'),
        N('It is morning, but a grey one. Grey dust is on everything.'),
        N('A round white friend stands in the garden, frowning at the sky.'),
        MT('Hello! I am Moomintroll. Are you a visitor?', 'happy'),
        N('A smaller friend peeks out from behind the water butt.'),
        SN('I am Sniff. Is your Nubbin valuable? It would fit my pocket.', 'think'),
      ],
      [
        ask(
          'literacy',
          'the first sound of a name',
          -1,
          [N('Say it slowly: Sss-niff. What sound does Sniff start with?')],
          [
            opt('Sss', [N('Yes! Sss, sss, Sniff. The snake sound.')], true),
            opt('Mmm', [N('Mmm is Moomintroll. Sniff starts with sss. Say it: Sss-niff!')]),
          ],
          'Listened for the first sound of a name (Sniff starts with s).',
          'RF.K.2',
        ),
      ],
      {
        choices: [
          {
            id: 'pocket',
            label: 'Let your Nubbin try Sniff’s pocket.',
            then: [
              N('Your Nubbin climbs into the pocket. It turns round twice.'),
              SN('It fits! Exactly!', 'happy'),
            ],
          },
          {
            id: 'arms',
            label: 'Keep your Nubbin in your arms for now.',
            then: [
              SN('Suit yourself. It is a very good pocket.', 'sad'),
              N('Your Nubbin wriggles down and climbs in anyway.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a09-01-valley-done',
      [
        N('Moomintroll holds out a paw. It is soft and sticky with jam.'),
        MT('Come and see the sea. Something is wrong with it.'),
        N('This story is from Finland, a country in the far north.'),
        N('There is snow in winter, and lakes, and a lot of trees.'),
      ],
      [
        note(
          'social-studies',
          'Finland is a real country in the north of the world',
          -1,
          [
            N('The Moomin books come from Finland. Tove Jansson wrote them.'),
            N('Finland has two languages: Finnish and Swedish.'),
            N('(Find Finland on a globe, if you have one.)'),
          ],
          'Heard that the Moomin stories come from Finland, a real country in the north with two languages, Finnish and Swedish.',
          'D2.Geo.2.K-2',
        ),
      ],
    ),
    sc(
      'a09-01-shore',
      [
        SN('This is my secret path. Only I know it.'),
        MT('I know it too.'),
        SN('Only me and you, then. And now them. It is getting crowded.', 'angry'),
        N('The path comes out on a stony beach. Five big stones sit there.'),
        N('The sea looks like an old grey spoon.'),
        MT('It was blue yesterday. It is always blue.', 'sad'),
        N('Under a rock there is a cave. Inside, the sand is soft and dry.'),
      ],
      [
        doit(
          'maths',
          'count five stones',
          4,
          'edu:count:stones:5',
          [
            N('Five big stones by the water.'),
            N('(Point and count them together: one, two, three, four, five.)'),
          ],
          'Counted five objects, touching each one once.',
          'K.CC.B.5',
        ),
      ],
    ),
    sc(
      'a09-01-shore-done',
      [
        N('You sit in the cave mouth and watch the grey sea.'),
        MT('Mamma would like this cave. It feels cosy and safe.', 'soft'),
        N('Sniff sits close, very close, and says nothing.'),
      ],
      [
        note(
          'sel',
          'a safe place helps us feel calm',
          -1,
          [
            N('Moomintroll feels safe in the cave.'),
            N('What makes a place feel safe to you? A blanket? A hug?'),
            N('(Wait for an answer.)'),
          ],
          'Talked about what makes a place feel safe and calm.',
          'ELOF: Social and Emotional Development',
        ),
      ],
    ),
    sc(
      'a09-01-hammock',
      [
        N('A Muskrat lies in a hammock between two birch trees.'),
        MT('Muskrat, the sea has gone grey. Do you know why?'),
        MU('Something is coming. I think a comet.', 'think'),
        MU('A comet is a star with a tail.'),
        SN('Is it coming here? I do not like it.', 'shock'),
        N('Sniff turns the colour of the sea.'),
        MP('There are professors in the mountains. They will know.'),
        MP('We need a brave person and a good raft.', 'happy'),
      ],
      [
        ask(
          'science',
          'we see comets and stars in the night sky',
          -1,
          [
            N('A comet is not really a star, but it shines like one.'),
            N('When can we see stars and comets best?'),
          ],
          [
            opt(
              'At night, when it is dark',
              [N('Yes! The Sun is too bright by day. Night is for stars.')],
              true,
            ),
            opt('At midday in the sun', [
              N('The Sun is so bright then. We cannot see the stars. Night is better.'),
            ]),
          ],
          'Learned that stars and comets are best seen in the dark night sky.',
          '1-ESS1-1',
        ),
      ],
      {
        choices: [
          {
            id: 'brave',
            label: '“We’ll go.”',
            then: [
              Y('We will go.'),
              MT('Yes! All of us. Sniff too.', 'happy'),
              SN('Sniff too? Who said Sniff too?', 'shock'),
            ],
          },
          {
            id: 'ask',
            label: 'Ask the Muskrat if he’s ever been wrong.',
            then: [
              MU('Once. I thought I would get a quiet afternoon.', 'angry'),
              MT('So he does not know. We will ask the professors.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a09-01-hammock-done',
      [
        N('That night you all stand on the veranda.'),
        N('Low over the mountains is a new light. It has a tail.'),
        N('The tail is faint and red, like a match just blown out.'),
      ],
      [
        ask(
          'art',
          'noticing colours',
          -1,
          [N('The sea is grey. The grass is grey. What colour is the comet’s tail?')],
          [
            opt('Red', [N('Yes, a faint red. The only bit of colour left!')], true),
            opt('Grey', [N('Nearly! Everything else is grey. The tail is red.')]),
          ],
          'Noticed and named a colour in a picture.',
        ),
      ],
    ),
    sc(
      'a09-01-complete',
      [
        MM('If you are going, go properly. Pullovers. Sandwiches.', 'soft'),
        MM('And come home when you have found out.'),
        MT('We will come home, Mamma.'),
        N('Sniff pats his pocket. Your Nubbin pats back.'),
      ],
      [
        note(
          'science',
          'a comet is a ball of ice and dust, with a glowing tail',
          -1,
          [
            N('A comet is a big ball of ice and dust, far out in space.'),
            N('Near the Sun, it warms up. Gas and dust stream off it.'),
            N('The Sun lights them up. That shining stream is its tail.'),
            N('The tail always points away from the Sun, like hair blown by a wind.'),
          ],
          'Heard that a comet is a ball of ice and dust, and its glowing tail points away from the Sun.',
        ),
      ],
    ),
  ],
  'Lessons: first sounds, counting to five, Finland on the map, a safe place, night sky, colours, what a comet is.',
);

// ================================================================== A9-2 The Raft
const A02 = quest(
  'a09-02',
  'The Raft',
  {
    'a09-02-s1': {
      goal: 'Help Moominpappa build a raft.',
      hint: 'Carry the planks from the woodshed to the river bank.',
    },
    'a09-02-s2': {
      goal: 'Pack the raft and push off.',
      hint: 'The basket goes in the middle. Sniff will argue about his things.',
    },
    'a09-02-s3': {
      goal: 'Float down the river until it gets dark.',
      hint: 'Keep to the middle of the river. Watch the banks.',
    },
  },
  [
    sc(
      'a09-02-build',
      [
        N('There are five planks on the river bank.'),
        MP('A raft must be sound. It needs a mast. And a name.', 'think'),
        MT('Does it need a name?'),
        MP('Everything that goes places needs a name.'),
        N('You carry planks and Moomintroll ties knots. Sniff gives advice.'),
        SN('That plank is crooked. That one is too short.'),
        N('By noon there is a raft, and it floats!'),
        MP('What shall we call her?', 'happy'),
      ],
      [
        doit(
          'maths',
          'count five planks',
          4,
          'edu:count:planks:5',
          [
            N('Carry the planks, one at a time.'),
            N('(Count them together: one, two, three, four, five.)'),
          ],
          'Counted five planks while carrying them.',
          'K.CC.B.5',
        ),
      ],
      {
        choices: [
          {
            id: 'mamma',
            label: 'Suggest calling it after Moominmamma.',
            then: [
              MP('Then she will be sure to bring you home.', 'soft'),
              N('He paints the name on the back, in blue.'),
            ],
          },
          {
            id: 'sniff',
            label: 'Suggest “The Valuable”.',
            then: [
              SN('Oh! That is the best name!', 'happy'),
              N('Sniff stands next to it for a long time.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a09-02-build-done',
      [
        N('Moominmamma comes down the bank with a big basket.'),
        MM('Sandwiches on top. Pullovers underneath.', 'happy'),
        N('Then she looks at the raft, and the river, and the planks.'),
      ],
      [
        ask(
          'science',
          'wood floats, stone sinks',
          -1,
          [
            N('The raft is made of wood.'),
            N('Which would float on the river: a plank or a stone?'),
          ],
          [
            opt('A plank', [N('Yes! Wood floats. That is why the raft is wood.')], true),
            opt('A stone', [N('Plop! A stone sinks. Wood floats, so the raft is wood.')]),
          ],
          'Learned that wood floats and stone sinks.',
          '2-PS1-1',
        ),
      ],
    ),
    sc(
      'a09-02-launch',
      [
        N('Sniff arrives with a big sack of things.'),
        N('There is a tin box, a broken compass, red glass and buttons.'),
        MT('Sniff, there is not room for all that.'),
        SN('These are valuable. They are all valuable!', 'angry'),
        MM('Things are lovely, dear. But they do not row.', 'soft'),
        N('Your Nubbin looks at the sack. Then it looks at you.'),
      ],
      [
        ask(
          'social-studies',
          'when there is not enough room, we choose',
          -1,
          [N('The raft is small. Not everything fits. What can Sniff do?')],
          [
            opt(
              'Choose the thing he loves most',
              [N('Yes! When we cannot have it all, we choose what matters most.')],
              true,
            ),
            opt('Take everything anyway', [
              N('The raft would sink low and spin! It is wiser to choose.'),
            ]),
          ],
          'Talked about choosing when there is not enough room for everything.',
          'D2.Eco.1.K-2',
        ),
      ],
      {
        choices: [
          {
            id: 'one',
            label: 'Help Sniff choose the one thing he’d miss most.',
            then: [
              N('It takes a long time. He picks the red glass.'),
              SN('The rest can stay with Moominmamma.', 'soft'),
            ],
          },
          {
            id: 'all',
            label: 'Find room for all of it.',
            then: [
              N('The raft sits low and turns in a slow circle.'),
              N('Sniff quietly takes the buttons back to Mamma.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a09-02-launch-done',
      [
        N('Moominpappa pushes the raft off with his foot.'),
        N('Moominmamma waves her apron until the bend.'),
        N('Sniff’s compass is broken. It points to nothing.'),
      ],
      [
        note(
          'science',
          'a working compass always points north',
          -1,
          [
            N('A real compass has a little needle.'),
            N('It always points the same way, to the north.'),
            N('That helps travellers find their way.'),
          ],
          'Heard that a compass needle points north and helps people find their way.',
        ),
      ],
    ),
    sc(
      'a09-02-river',
      [
        N('The river carries you past woods and meadows.'),
        N('Three birds fly low and quiet, all one way.'),
        MT('Where are they all going?'),
        SN('Away. Which is sensible. We are going toward it.', 'shock'),
        MT('We are going toward finding out. That is different.'),
        SN('It does not feel different. It feels the same.', 'sad'),
        N('The river splits round a rock. One way is quick, and one is slow.'),
      ],
      [
        doit(
          'maths',
          'count three birds',
          1,
          'edu:count:birds:3',
          [N('Look up! Three birds. (Count them on your fingers: one, two, three.)')],
          'Counted three birds, matching one number to each bird.',
          'K.CC.B.5',
        ),
      ],
      {
        choices: [
          {
            id: 'quick',
            label: 'Take the quick channel.',
            then: [
              N('Whoosh! The raft spins and splashes, and everyone laughs.'),
              SN('I was not frightened. My pocket was.', 'happy'),
            ],
          },
          {
            id: 'slow',
            label: 'Take the slow channel.',
            then: [
              N('You drift under green trees. A heron watches.'),
              MT('This is nice. You could almost forget.', 'soft'),
            ],
          },
        ],
      },
    ),
    sc(
      'a09-02-river-done',
      [
        N('At dusk you pull in to a sandy bank.'),
        N('Moomintroll unpacks the sandwiches.'),
        N('Far up the river, a thin line of smoke rises.'),
      ],
      [
        note(
          'science',
          'dusk is the time between day and night',
          -1,
          [
            N('Dusk is when the Sun goes down and the light gets dim.'),
            N('It comes after day and before night.'),
          ],
          'Learned that dusk comes between day and night.',
          '1-ESS1-1',
        ),
      ],
    ),
    sc(
      'a09-02-complete',
      [
        N('Sniff eats his sandwich very slowly.'),
        SN('When I was small, I thought the sky was a lid.', 'soft'),
        MT('And now?'),
        SN('Now it is just sky. And that is scarier.', 'sad'),
        N('Your Nubbin climbs on his knee.'),
        N('It is as near to a lid as it can get.'),
      ],
      [
        note(
          'sel',
          'saying a feeling out loud',
          -1,
          [
            N('Sniff said he feels scared.'),
            N('Saying a scared feeling out loud makes it smaller.'),
            N('Moomintroll listened, and that helped.'),
          ],
          'Heard that saying a scared feeling out loud, to a listener, helps it feel smaller.',
          'CASEL: Self-awareness',
        ),
      ],
    ),
  ],
  'Lessons: counting, floating, choosing, compass, dusk, saying a feeling out loud.',
);

// ================================================================== A9-3 Snufkin
const A03 = quest(
  'a09-03',
  'Snufkin',
  {
    'a09-03-s1': {
      goal: 'Follow the smoke and the music upriver.',
      hint: 'Listen for a tune. It goes up like a question.',
    },
    'a09-03-s2': { goal: 'Sit by Snufkin’s fire.', hint: 'Sit on the log nearest the flames.' },
    'a09-03-s3': {
      goal: 'Look at the comet with Snufkin.',
      hint: 'Walk down to the water, where the trees open up.',
    },
  },
  [
    sc(
      'a09-03-camp',
      [
        N('You follow the smoke along the bank.'),
        N('Before you see the fire, you hear a tune.'),
        N('It is a harmonica. The tune goes up like a question.'),
        N('A small green tent stands by the water.'),
        N('A fisherman in a green hat sits on a stone.'),
        SK('Come and sit, if you are coming. The fish have heard you.'),
        SK('They only pretend to be scared. Then they do not get caught.', 'happy'),
      ],
      [
        doit(
          'music',
          'a tune can go up and down',
          2,
          'edu:hum:tune:up-and-down',
          [
            N('Let’s hum Snufkin’s tune.'),
            N('Up, up, up, like a question.'),
            N('Down, down, down, like an answer.'),
          ],
          'Hummed a tune that goes up and then down, noticing the pitch.',
          'ELOF: Language and Communication',
        ),
      ],
    ),
    sc(
      'a09-03-camp-done',
      [
        SK('I am Snufkin. There is coffee, from the one cup.'),
        N('He passes the cup round. It goes round twice.'),
        N('Nobody minds. Everybody waits for a turn.'),
      ],
      [
        ask(
          'sel',
          'taking turns',
          -1,
          [N('There is only one cup, and lots of friends. What do they do?')],
          [
            opt('Take turns', [N('Yes! One by one. Everybody gets a go.')], true),
            opt('Grab it first', [N('Then someone would be left out. Taking turns is fairer.')]),
          ],
          'Talked about taking turns when there is only one of something.',
          'ELOF: Social and Emotional Development',
        ),
      ],
    ),
    sc(
      'a09-03-fire',
      [
        SN('Where is all your stuff?', 'shock'),
        SK('This is all of it: tent, pipe, cup, harmonica, hat.', 'think'),
        SN('That is hardly anything! What if you want something?'),
        SK('I look at it. Then I leave it. It is still beautiful.'),
        SK('You do not own a friend. You walk beside them.', 'soft'),
      ],
      [
        doit(
          'maths',
          'count five things',
          2,
          'edu:count:snufkin-things:5',
          [
            N(
              'Snufkin’s things: tent, pipe, cup, harmonica, hat. (Count them on your fingers. How many?)',
            ),
          ],
          'Counted the five things in Snufkin’s list.',
          'K.CC.B.5',
        ),
      ],
      {
        choices: [
          {
            id: 'where',
            label: 'Ask where he’s going.',
            then: [
              SK('South, in the end. But I am in no hurry.'),
              N('He looks at the tail in the sky.'),
            ],
          },
          {
            id: 'lonely',
            label: 'Ask if he ever gets lonely.',
            then: [
              SK('Sometimes. Then I find a friend. Both are good.', 'think'),
              MT('You could come with us.'),
              SK('I could.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a09-03-fire-done',
      [
        N('Snufkin plays again, softly.'),
        N('The tune goes round the fire and over the water.'),
        N('Your Nubbin sits by his boot to listen.'),
      ],
      [
        doit(
          'science',
          'sound is a wiggle, a vibration',
          -1,
          'edu:feel:throat:hum',
          [
            N('Put your fingers on your throat and hum.'),
            N('(Feel the tickle? That wiggle is a vibration.)'),
            N('Sound is made of wiggles.'),
          ],
          'Felt a vibration in the throat while humming: sound is a wiggle.',
          '1-PS4-1',
        ),
      ],
    ),
    sc(
      'a09-03-sky',
      [
        N('By the water, the trees open up.'),
        N('The comet is brighter than last night. Its tail is longer.'),
        SK('It looks lonely. All that way, on its own.', 'soft'),
        MT('Are you frightened of it?'),
        SK('A bit. Being frightened is all right.', 'think'),
        SK('It means you have noticed something.'),
        SN('I have noticed everything.', 'sad'),
      ],
      [
        ask(
          'sel',
          'feeling frightened is okay',
          -1,
          [
            N('Snufkin says being a bit frightened is all right.'),
            N('Is it okay to feel frightened?'),
          ],
          [
            opt(
              'Yes, all feelings are okay',
              [N('Yes. Feelings are never naughty. What helps is saying them.')],
              true,
            ),
            opt('No, we must hide it', [N('No need to hide it. Snufkin says it is all right.')]),
          ],
          'Talked about how every feeling, including being frightened, is okay.',
          'CASEL: Self-awareness',
        ),
      ],
    ),
    sc(
      'a09-03-sky-done',
      [
        SK('I will come with you to the mountains.'),
        N('He finds a second harmonica in his tent. It is dented.'),
        SK('I have two. I do not like having two. I like one.'),
        N('He holds it out to you.'),
      ],
      [
        ask(
          'maths',
          'take away one from two',
          -1,
          [
            N('Snufkin has two harmonicas. He gives one away.'),
            N('How many harmonicas does he have now?'),
          ],
          [
            opt('One', [N('Yes! Two take away one is one. Just how he likes it.')], true),
            opt('Two', [
              N('He gave one away!'),
              N('(Hold up two fingers, then fold one down.)'),
              N('Now there is one.'),
            ]),
          ],
          'Took one away from two to find that one is left.',
          'K.OA.A.1',
        ),
      ],
    ),
    sc(
      'a09-03-complete',
      [
        N('You try a note. It sounds like a duck in a cupboard.'),
        SK('That is the right note. It is just in the wrong place.', 'happy'),
        N('Your Nubbin claps. Sniff claps a beat later.'),
        SK('Play it when you are home. Then the tune will know where it lives.'),
      ],
      [
        ask(
          'literacy',
          'animal sounds',
          1,
          [N('Your note sounded like a duck. What sound does a duck make?')],
          [
            opt(
              'Quack!',
              [N('Quack, quack! Say it with me. You are very good at duck sounds.')],
              true,
            ),
            opt('Moo!', [N('That is a cow. A duck says quack, quack!')]),
          ],
          'Matched an animal to the sound it makes.',
        ),
      ],
    ),
  ],
  'Lessons: humming a tune, taking turns, counting five, sound as a vibration, feelings, take-away, animal sounds.',
);

// ================================================================== A9-4 The Observatory
const A04 = quest(
  'a09-04',
  'The Observatory',
  {
    'a09-04-s1': {
      goal: 'Climb the Lonely Mountains to the Observatory.',
      hint: 'Follow the little stone piles. Snufkin ties a rope on the steep bit.',
    },
    'a09-04-s2': {
      goal: 'Ask the professors when the comet will come.',
      hint: 'They are by the huge telescope. You may need to ask twice.',
    },
    'a09-04-s3': {
      goal: 'Sit with Sniff on the Observatory step.',
      hint: 'He is on the step outside, holding his pocket.',
    },
  },
  [
    sc(
      'a09-04-climb',
      [
        N('The Lonely Mountains are grey stone and grey sky.'),
        N('The path zigzags up. Snufkin goes first, and Sniff goes last.'),
        SN('My legs are the shortest. So the mountain is taller for me.'),
        SK('Then you will have climbed the most.', 'happy'),
        SN('I had not thought of that.'),
        N('A steep slab needs a rope. Snufkin ties it to a rock.'),
        N('At the top is a round white building with a slot in its roof.'),
      ],
      [
        ask(
          'maths',
          'compare lengths',
          2,
          [N('Sniff’s legs are short. Whose legs are longer, Sniff’s or Snufkin’s?')],
          [
            opt(
              'Snufkin’s',
              [N('Yes! Snufkin is taller, so his legs are longer. Sniff’s legs are shorter.')],
              true,
            ),
            opt('Sniff’s', [
              N('Look again! Snufkin is taller. His legs are longer, and Sniff’s are shorter.'),
            ]),
          ],
          'Compared two lengths with the words longer and shorter.',
          'K.MD.A.2',
        ),
      ],
      {
        choices: [
          {
            id: 'help',
            label: 'Give Sniff a hand up the slab.',
            then: [
              N('Sniff takes your hand and holds on hard.'),
              SN('I could have done it. I just did not want to.'),
            ],
          },
          {
            id: 'wait',
            label: 'Wait at the top and let Sniff do it himself.',
            then: [
              N('It takes him a while. He gets there!'),
              SN('Did you see? Did everybody see?', 'happy'),
            ],
          },
        ],
      },
    ),
    sc(
      'a09-04-climb-done',
      [
        N('The Observatory door is open.'),
        N('Inside, someone is counting in a whisper.'),
        N('A very long telescope points at the sky.'),
      ],
      [
        note(
          'science',
          'a telescope makes faraway things look close',
          -1,
          [
            N('A telescope is a tube with glass in it.'),
            N('It makes faraway things, like stars, look big and close.'),
          ],
          'Heard that a telescope makes faraway things look closer.',
        ),
      ],
    ),
    sc(
      'a09-04-telescope',
      [
        N('Two professors stand under the telescope, writing.'),
        MT('When will the comet come? And where?'),
        PR('On the seventh of October, in the evening.', 'think'),
        PR('At eight forty-two. That is nearly nine o’clock.'),
        P2('Possibly eight forty-three. We are arguing about that.'),
        N('(Point to a clock, if you have one. Where is nine?)'),
        PR('It will land about here. How interesting!', 'happy'),
      ],
      [
        note(
          'maths',
          'a clock tells the time; eight forty-two is nearly nine',
          -1,
          [
            N('A clock tells us the time.'),
            N('The short hand shows the hour.'),
            N('At eight forty-two, the short hand is nearly at nine.'),
          ],
          'Heard that a clock tells the time, and met “nearly nine o’clock”.',
          '1.MD.B.3',
        ),
      ],
    ),
    sc(
      'a09-04-telescope-done',
      [
        N('Nobody says a word.'),
        MT('Mamma does not know the date.', 'shock'),
        SK('Then we had better tell her.'),
        N('Moomintroll is already on his way.'),
      ],
      [
        ask(
          'literacy',
          'what a character does after big news',
          -1,
          [N('Moomintroll hears big news. What does he do next?')],
          [
            opt(
              'He hurries home to tell Mamma',
              [N('Yes! He thinks of Mamma first. Telling her helps her get ready.')],
              true,
            ),
            opt('He keeps it a secret', [
              N('No, he is already on his way. He wants Mamma to know.'),
            ]),
          ],
          'Told what a character does after big news, and why.',
          'RL.2.3',
        ),
      ],
    ),
    sc(
      'a09-04-step',
      [
        N('The light is going. Moomintroll hops, ready to leave.'),
        N('Sniff sits on the step, holding his pocket tight.'),
        N('You sit down beside him. The comet hangs over the peaks.'),
        SN('The seventh is in four days. I counted.', 'sad'),
        SN('Will it hit? Tell me. I am brave once I know.'),
        N('He looks at you.'),
        N('He is a little bit brave, and a little bit scared.'),
      ],
      [
        note(
          'sel',
          'a worry gets smaller when you say it out loud',
          -1,
          [
            N('Sniff said his worry out loud. That is brave.'),
            N('A worry feels smaller when it is shared with a friend.'),
          ],
          'Heard that naming a worry and sharing it makes it feel smaller.',
          'CASEL: Self-awareness',
        ),
      ],
      {
        choices: [
          {
            id: 'dunno',
            label: '“I don’t know.”',
            set: { 'a09-answer': 'dunno' },
            then: [
              Y('I do not know, Sniff.'),
              N('He nods slowly. It is a true answer.'),
              SN('No. Nobody knows. Not even them.', 'soft'),
            ],
          },
          {
            id: 'home',
            label: '“We’ll be home by then.”',
            set: { 'a09-answer': 'home' },
            then: [
              Y('We will be home by then.'),
              N('Sniff tucks the words away, like a button.'),
              SN('Home by then. All right.', 'soft'),
            ],
          },
        ],
      },
    ),
    sc(
      'a09-04-step-done',
      [
        N('Sniff stands up.'),
        N('Then he holds out his paw to help you up.'),
        N('It is the first thing he has ever given anybody.'),
      ],
      [
        ask(
          'literacy',
          'how a character feels from what they do',
          -1,
          [N('Sniff helps you up. How do you think Sniff feels?')],
          [
            opt('Kind and caring', [N('Yes! He is being kind. Helping is a way of caring.')], true),
            opt('Cross', [
              N('Not this time. He holds out a paw to help.'),
              N('That is what a kind friend does.'),
            ]),
          ],
          'Worked out a character’s feeling from what he did.',
          'RL.2.3',
        ),
      ],
    ),
    sc(
      'a09-04-complete',
      [
        N('You go down the mountain by the comet’s light.'),
        SK('Four days. That is enough to get home.'),
        SN('I always stop to look at things.'),
        SK('So do I. We will look quickly.', 'happy'),
      ],
      [
        doit(
          'maths',
          'count four days',
          1,
          'edu:count:days:4',
          [
            N('Four days to get home.'),
            N('(Hold up your fingers: one day, two days, three days, four days.)'),
          ],
          'Counted four days on their fingers.',
          'K.CC.B.5',
        ),
      ],
    ),
  ],
  'Lessons: longer and shorter, a telescope, the clock, what a character does next, saying a worry out loud, reading feelings, counting days.',
);

// ================================================================== A9-5 The Snork Maiden
const A05 = quest(
  'a09-05',
  'The Snork Maiden',
  {
    'a09-05-s1': {
      goal: 'Look into the glinting crack in the rocks.',
      hint: 'It is beside the path, just below the rope.',
    },
    'a09-05-s2': {
      goal: 'Run to help whoever is calling in the valley.',
      hint: 'Follow the voice into the trees. Stay behind Moomintroll.',
    },
    'a09-05-s3': {
      goal: 'See the gold ring find its owner.',
      hint: 'Sit with everyone while she catches her breath.',
    },
  },
  [
    sc(
      'a09-05-crevice',
      [
        N('On the way down, something glints in a crack in the rock.'),
        N('Moomintroll reaches in. He pulls out a small gold ring.'),
        MT('What is it for? It is too small for a crown.', 'think'),
        SN('It is mine. I saw it first.'),
        N('Sniff goes to sulk. Then he finds a tiny red stone.'),
        SN('A garnet, probably. Better than a ring.'),
        SN('You hold it. Not keep it. Just hold it.', 'soft'),
      ],
      [
        ask(
          'literacy',
          'the first sound of a word',
          2,
          [N('Say it slowly: rrr-ing. What sound does ring start with?')],
          [
            opt('Rrr', [N('Yes! Rrr, rrr, ring. Like a growly puppy.')], true),
            opt('Mmm', [N('Mmm is for Moomintroll. Ring starts with rrr. Say it: rrr-ing!')]),
          ],
          'Listened for the first sound of a word (ring starts with r).',
          'RF.K.2',
        ),
      ],
    ),
    sc(
      'a09-05-crevice-done',
      [
        N('The garnet is warm from his paw.'),
        N('Snufkin lifts one eyebrow at Sniff, and says nothing, kindly.'),
        N('Sniff has shared something. It was hard, and it was good.'),
      ],
      [
        note(
          'sel',
          'sharing is hard and feels good',
          -1,
          [
            N('Sharing can feel wobbly at first. Afterwards it can feel warm.'),
            N('Can you think of a time you shared?'),
            N('(Wait for an answer.)'),
          ],
          'Talked about how sharing can feel hard first and warm afterwards.',
          'ELOF: Social and Emotional Development',
        ),
      ],
    ),
    sc(
      'a09-05-bush',
      [
        N('In the valley below, someone is shouting for help.'),
        N('A dark bush has wound itself round a small friend.'),
        SM('Do not touch it! It stings!', 'shock'),
        N('Moomintroll runs straight in. Snufkin pulls the branches.'),
        N('You use a long stick to hold one branch down.'),
        N('Your Nubbin hides in Sniff’s pocket. Everyone helps.'),
      ],
      [
        ask(
          'health',
          'do not touch plants you do not know',
          -1,
          [N('You find a strange plant. You do not know what it is.'), N('What do you do?')],
          [
            opt(
              'Look, and ask a grown-up',
              [N('Yes! Look with eyes, not hands. Ask a grown-up if it is safe.')],
              true,
            ),
            opt('Pick it up', [
              N('Wait! Some plants sting or make us ill. Look first, and ask a grown-up.'),
            ]),
          ],
          'Learned to look and ask a grown-up before touching an unknown plant.',
          'ELOF: Perceptual, Motor, and Physical Development',
        ),
      ],
    ),
    sc(
      'a09-05-bush-done',
      [
        N('The last branch lets go.'),
        N('Moomintroll catches her. They sit down in the grass.'),
        SM('You came straight at it.', 'soft'),
        MT('I will think later.'),
      ],
      [
        note(
          'literacy',
          'first, next, last',
          -1,
          [
            N('First, the bush held her. Next, they pulled the branches. Last, she was free.'),
            N('(Say it together: first, next, last.)'),
          ],
          'Heard a story in order, using first, next and last.',
          'RL.K.3',
        ),
      ],
    ),
    sc(
      'a09-05-ring',
      [
        N('She is shaking a little, and pretending not to.'),
        SM('I lost a gold ring in the mountains. I wear it round my ankle.', 'sad'),
        MT('Is it this?'),
        SM('My ankle ring! Thank you!', 'happy'),
        SN('I saw it first.'),
        N('Sniff has an argument ready. But there is nobody to argue with.'),
      ],
      [
        ask(
          'sel',
          'give lost things back to their owner',
          -1,
          [N('You find a lost ring. Whose is it, and what do we do?')],
          [
            opt(
              'Give it back to its owner',
              [N('Yes! It belongs to her. Giving it back is the kind and honest thing.')],
              true,
            ),
            opt('Keep it', [N('It is not ours. She was sad without it. We give it back.')]),
          ],
          'Talked about returning lost things to their owner.',
          'CASEL: Responsible decision-making',
        ),
      ],
      {
        choices: [
          {
            id: 'tell',
            label: 'Tell her about the comet.',
            then: [
              Y('A comet is coming. On the seventh.'),
              SM('I know. I saw the tail. I kept busy.', 'think'),
            ],
          },
          {
            id: 'ask',
            label: 'Ask if she’s all right.',
            then: [
              SM('I am now. It is strange to be all right again.', 'soft'),
              N('She slips the ring on her ankle.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a09-05-complete',
      [
        SM('I am the Snork Maiden. My brother makes lists.'),
        SM('Can we come with you? I do not want to be alone.'),
        MT('Of course. Mamma always makes enough for everybody.', 'happy'),
        N('Moomintroll, Sniff, Snufkin, the Snork Maiden, and you.'),
      ],
      [
        doit(
          'maths',
          'count five friends',
          3,
          'edu:count:friends:5',
          [
            N('How many friends are walking together?'),
            N('(Count on your fingers: Moomintroll, Sniff, Snufkin, the Snork Maiden, you.)'),
          ],
          'Counted five friends, one number for each.',
          'K.CC.B.5',
        ),
      ],
    ),
  ],
  'Lessons: first sounds, sharing, plant safety, first-next-last, returning lost things, counting five friends.',
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
      goal: 'Sit in the Snork’s meeting.',
      hint: 'Sit in the circle. Put your paw up when there is a vote.',
    },
  },
  [
    sc(
      'a09-06-snork',
      [
        N('Her brother has a very neat camp under a pine.'),
        N('A sign on the tent says OFFICE.'),
        SO('Sister. You are late. I had you down for four.', 'angry'),
        SM('A bush tried to eat me.'),
        SO('That is not on my list!', 'shock'),
        MT('We are going home before the comet.'),
        SO('Without a meeting? Never!', 'think'),
      ],
      [
        ask(
          'literacy',
          'letters and first sounds',
          1,
          [N('The sign says OFFICE. Oh, oh, office. Which letter does it start with?')],
          [
            opt('O', [N('Yes, O! A round letter, like an open mouth. Oh-ffice.')], true),
            opt('S', [N('S is for Snork. Office starts with a round O.')]),
          ],
          'Found the first letter of a word on a sign.',
          'RF.K.2',
        ),
      ],
    ),
    sc(
      'a09-06-snork-done',
      [
        SO('Everybody sit in a circle. I shall be chairman.'),
        SO('And secretary, because nobody else has a pencil.'),
        SK('I have a pencil.'),
        SO('Then you may be the audience.'),
      ],
      [
        note(
          'social-studies',
          'one voice at a time keeps a meeting fair',
          -1,
          [
            N('In a meeting, one person talks and the others listen.'),
            N('Then everybody gets a turn, and it is fair.'),
          ],
          'Heard why one voice at a time is fair in a meeting.',
          'D2.Civ.8.K-2',
        ),
      ],
    ),
    sc(
      'a09-06-meeting',
      [
        SO('Item one. Is the comet coming? Show of paws.'),
        N('Everybody puts a paw up. Your Nubbin puts up two.'),
        SO('Carried. Item two. Should we be worried?', 'think'),
        SN('Both my paws. And my ears.', 'shock'),
        SO('Carried. Item three. What shall we do? Suggestions?'),
        N('Nobody says anything. The comet moves a little.'),
      ],
      [
        ask(
          'maths',
          'count the paws',
          1,
          [N('Your Nubbin puts up both paws. How many paws is that?')],
          [
            opt('Two', [N('Yes! One paw, two paws. A pair.')], true),
            opt('Three', [N('Count with me: one paw, two paws. That is two!')]),
          ],
          'Counted two paws and matched a number to them.',
          'K.CC.B.5',
        ),
      ],
      {
        choices: [
          {
            id: 'home',
            label: 'Propose going home at once.',
            then: [Y('I say we go home. Now.'), SM('Me too! Everyone! You are outvoted!', 'happy')],
          },
          {
            id: 'sub',
            label: 'Propose a subcommittee to decide on the way.',
            then: [
              SO('A subcommittee! A sensible person!', 'happy'),
              SK('It will meet while walking. Fast.'),
              SO('Agreed.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a09-06-meeting-done',
      [
        N('The Snork writes the minutes and reads them out.'),
        N('Under “Any other business” he has written: Sniff is worried.'),
        SN('Well, I am.'),
        SO('It is official. Everyone must bear it in mind.', 'soft'),
      ],
      [
        note(
          'sel',
          'naming a worry so friends can help',
          -1,
          [
            N('When a worry is said out loud, friends can help carry it.'),
            N('Sniff’s worry is now known.'),
            N('Everyone will be kind to him.'),
          ],
          'Talked about how naming a worry lets friends help.',
          'CASEL: Social awareness',
        ),
      ],
    ),
    sc(
      'a09-06-complete',
      [
        N('The Snork folds his tent into a tiny square parcel.'),
        SO('Meeting closed. We march.'),
        N('The Snork walks at the front. Snufkin walks in front of him.'),
        N('The Snork does not notice.'),
      ],
      [
        ask(
          'maths',
          'a square has four equal sides',
          1,
          [N('The tent is folded into a square. How many sides does a square have?')],
          [
            opt('Four', [N('Yes! Four sides, all the same. (Trace a square in the air.)')], true),
            opt('Three', [
              N('Three is a triangle. A square has four sides: top, bottom, left, right.'),
            ]),
          ],
          'Learned that a square has four sides.',
          'K.G.A.2',
        ),
      ],
    ),
  ],
  'Lessons: first letters, fair meetings, counting paws, naming a worry, squares.',
);

// ================================================================== A9-7 The Hemulen
const A07 = quest(
  'a09-07',
  'The Hemulen',
  {
    'a09-07-s1': {
      goal: 'Find out who is running about the meadow with a net.',
      hint: 'Follow the sound of somebody falling over things.',
    },
    'a09-07-s2': {
      goal: 'Help the Hemulen find his rare butterfly.',
      hint: 'Look on the tall flowers at the edge, where the sun still reaches.',
    },
  },
  [
    sc(
      'a09-07-meadow',
      [
        N('A large person in a long dress runs round a meadow.'),
        N('He is holding a butterfly net.'),
        HE('Hold still, you! You are the last one I need!', 'angry'),
        MT('Have you seen the comet?'),
        HE('A what? Is it a butterfly?', 'think'),
        MT('It is a star with a tail. It might land here.'),
        HE('Then it had better land quietly. I am looking for a Mourning Blue.'),
      ],
      [
        note(
          'science',
          'a butterfly begins as an egg, then a caterpillar',
          -1,
          [
            N('A butterfly starts as a tiny egg.'),
            N('Then a caterpillar. Then a chrysalis. Then a butterfly!'),
            N('(Say the four steps together.)'),
          ],
          'Heard the four steps of a butterfly’s life.',
          '3-LS1-1',
        ),
      ],
    ),
    sc(
      'a09-07-meadow-done',
      [
        SM('He is not listening. Hemulens never listen when collecting.'),
        SK('Then we will help him finish.'),
        N('It is hard to talk to someone who is busy.'),
      ],
      [
        ask(
          'sel',
          'what helps when someone is not listening',
          -1,
          [N('The Hemulen is too busy to listen. What helps?')],
          [
            opt(
              'Wait, and try again kindly',
              [N('Yes! Waiting for a good moment and trying again kindly often works.')],
              true,
            ),
            opt('Shout very loudly', [
              N('Shouting can make people feel cross. Waiting and asking kindly is better.'),
            ]),
          ],
          'Talked about waiting and asking kindly when someone is busy.',
          'CASEL: Relationship skills',
        ),
      ],
    ),
    sc(
      'a09-07-butterfly',
      [
        N('Everyone walks softly across the meadow.'),
        HE('Softly. It hates a fuss.', 'think'),
        N('Your Nubbin stands very still on a stone.'),
        N('A butterfly the colour of dusk lands on its head!'),
        N('Nobody breathes. Nobody moves.'),
      ],
      [
        doit(
          'health',
          'calm breathing and standing still',
          -1,
          'edu:breathe:still:3',
          [
            N('Let’s be as still as the Nubbin.'),
            N('Breathe in slowly. Breathe out slowly. Do it three times.'),
          ],
          'Practised slow, calm breathing and keeping still.',
          'ELOF: Perceptual, Motor, and Physical Development',
        ),
      ],
      {
        choices: [
          {
            id: 'show',
            label: 'Call the Hemulen over, softly.',
            then: [
              N('The Hemulen tiptoes over, like a cupboard tiptoeing.'),
              HE('There it is. Oh, I will put it in my book.', 'happy'),
            ],
          },
          {
            id: 'quiet',
            label: 'Keep quiet and let it fly.',
            then: [
              N('The butterfly opens its wings and flies up.'),
              HE('It chose your little one. I will write that down.', 'soft'),
            ],
          },
        ],
      },
    ),
    sc(
      'a09-07-butterfly-done',
      [
        N('The Hemulen writes in a fat notebook.'),
        HE('A sighting! Now. What was that about a star?', 'think'),
        N('He wrote down what he saw. He did not need a net.'),
      ],
      [
        doit(
          'art',
          'drawing what we see',
          -1,
          'edu:draw:butterfly:dusk',
          [
            N('Let’s draw the butterfly for his book.'),
            N('(Use dusk colours: blue, purple, a little pink.)'),
          ],
          'Drew a butterfly from memory, choosing colours.',
        ),
      ],
    ),
    sc(
      'a09-07-complete',
      [
        MT('We are going to my valley. Mamma looks after everyone.'),
        HE('Will there be butterflies?'),
        MT('After. There are always butterflies after.', 'soft'),
        HE('Then I will come.', 'happy'),
      ],
      [
        ask(
          'maths',
          'two and two make four',
          -1,
          [
            N('A butterfly has four wings. Two on this side, two on that.'),
            N('Two and two make…?'),
          ],
          [
            opt(
              'Four',
              [N('Yes! Two and two make four wings. (Wiggle four fingers like wings.)')],
              true,
            ),
            opt('Three', [N('Count again: one, two, three, four. Two and two make four!')]),
          ],
          'Added two and two to find four wings.',
          'K.OA.A.1',
        ),
      ],
    ),
  ],
  'Lessons: butterfly life, listening and waiting, calm stillness, drawing, two and two.',
);

// ================================================================== A9-8 The Dry Sea
const A08 = quest(
  'a09-08',
  'The Dry Sea',
  {
    'a09-08-s1': {
      goal: 'Come to the shore and see the sea.',
      hint: 'The path ends at the cliff top. Look out.',
    },
    'a09-08-s2': {
      goal: 'Help Snufkin make stilts.',
      hint: 'Gather long straight poles from the driftwood.',
    },
    'a09-08-s3': {
      goal: 'Walk across the seabed on stilts.',
      hint: 'Stay in the line. Step where Snufkin steps.',
    },
  },
  [
    sc(
      'a09-08-shore',
      [
        N('You come over the last hill. Everyone stops.'),
        N('The sea has gone! There is a great hollow of mud and rock.'),
        MT('There was a whole sea here.', 'shock'),
        SK('It is hiding. Everything hides from something big.'),
        SO('Around the bay takes three days. Across takes one.'),
        N('Far out, a fish waits in a puddle that is just enough.'),
      ],
      [
        note(
          'science',
          'fish need water to live',
          -1,
          [
            N('Fish live in water. They breathe it with their gills.'),
            N('A fish needs the sea, or a puddle just big enough.'),
          ],
          'Heard that fish need water to live and breathe.',
          'K-LS1-1',
        ),
      ],
    ),
    sc(
      'a09-08-shore-done',
      [
        N('Three days is more than you have.'),
        N('A map would show the land and the water.'),
        N('Across is the short way. Around is the long way.'),
      ],
      [
        note(
          'social-studies',
          'a map shows land and water',
          -1,
          [
            N('A map is a picture of a place from above.'),
            N('It shows land, water, paths and houses.'),
            N('(Draw a map of the bay with your finger.)'),
          ],
          'Heard that a map shows land and water, and traced a short and a long route.',
          'D2.Geo.2.K-2',
        ),
      ],
    ),
    sc(
      'a09-08-stilts',
      [
        SK('Stilts. We will walk over the mud on stilts.', 'think'),
        N('You gather driftwood. Snufkin ties on footrests.'),
        N('The Hemulen’s stilts are the tallest. Sniff’s are the shortest.'),
        SN('Mine are short.'),
        SK('Short stilts fall over less far.'),
        N('Everybody practises, and everybody falls over. Then up again!'),
      ],
      [
        ask(
          'maths',
          'compare heights: tallest and shortest',
          3,
          [N('Whose stilts are the tallest, and whose are the shortest?')],
          [
            opt(
              'Hemulen’s tallest, Sniff’s shortest',
              [N('Yes! Tall, taller, tallest. Short, shorter, shortest.')],
              true,
            ),
            opt('Sniff’s tallest', [
              N('Look again. The Hemulen’s are tallest. Sniff’s are the shortest.'),
            ]),
          ],
          'Compared stilts using tallest and shortest.',
          'K.MD.A.2',
        ),
      ],
      {
        choices: [
          {
            id: 'tall',
            label: 'Ask for tall stilts.',
            then: [
              N('You can see the whole bay from up here!'),
              N('You fall over once, magnificently.'),
            ],
          },
          {
            id: 'short',
            label: 'Ask for short stilts, like Sniff’s.',
            then: [
              SN('Good. Now we are the short-stilts club.', 'happy'),
              SO('Meetings must be registered with me.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a09-08-stilts-done',
      [
        N('Everybody wobbles in a line.'),
        N('Everybody has fallen over at least once.'),
        SK('Nobody minds a fall. You just get up.'),
        N('Snufkin puts his harmonica away. It is time.'),
      ],
      [
        ask(
          'sel',
          'trying again after a fall',
          -1,
          [N('Everyone fell over on the stilts. What do they do next?')],
          [
            opt(
              'Get up and try again',
              [N('Yes! Every try teaches your legs something new.')],
              true,
            ),
            opt('Give up for ever', [N('Not this time. They get up, brush off, and try again.')]),
          ],
          'Talked about getting up and trying again after a fall.',
          'CASEL: Self-management',
        ),
      ],
    ),
    sc(
      'a09-08-seabed',
      [
        N('You walk out on to the seabed on your stilts.'),
        N('The mud goes squelch, squelch, squelch.'),
        N('You see a sunk boat, an anchor, and a wardrobe!'),
        SM('Why is there a wardrobe?', 'think'),
        N('In a puddle lies a pink shell with a curl.'),
        N('You pick it up. You hold it to your ear.'),
        MT('It is waiting. It is listening for the sea, like us.', 'soft'),
      ],
      [
        ask(
          'science',
          'a shell is an animal’s home',
          -1,
          [N('The shell is empty. Who lived in the shell, a long time ago?')],
          [
            opt(
              'A small sea animal',
              [N('Yes! A shell is a sea animal’s home. It grows with them.')],
              true,
            ),
            opt('A bird', [N('Birds live in nests. Shells are homes for small sea animals.')]),
          ],
          'Learned that a shell was an animal’s home.',
          'K-ESS3-1',
        ),
      ],
    ),
    sc(
      'a09-08-seabed-done',
      [
        N('You put the shell in your pocket.'),
        N('It is pink, and curly, and very light.'),
        N('It seems to want carrying.'),
      ],
      [
        ask(
          'literacy',
          'describing words',
          -1,
          [N('The shell is pink, curly and light. What word tells us how it looks?')],
          [
            opt('Curly', [N('Yes! Curly. Describing words tell us what things are like.')], true),
            opt('Loud', [N('A shell is not loud. Pink, curly and light are describing words.')]),
          ],
          'Picked out a describing word for how something looks.',
          'RL.1.4',
        ),
      ],
    ),
    sc(
      'a09-08-complete',
      [
        N('The sun goes down behind you.'),
        N('Out on the seabed, the light comes from the sky, red and steady.'),
        SK('We will go on in the dark. The comet lights the way.'),
        N('Sniff counts his stilts, his pocket, his Nubbin, and you.'),
      ],
      [
        note(
          'science',
          'the Sun goes down every evening',
          -1,
          [
            N('The Sun goes down every evening, and comes up every morning.'),
            N('Day, then night, then day again.'),
          ],
          'Heard that the Sun sets each evening and rises each morning.',
          '1-ESS1-1',
        ),
      ],
    ),
  ],
  'Lessons: what fish need, maps, tallest and shortest, trying again, shells, describing words, sunset.',
);

// ================================================================== A9-9 The Octopus
const A09 = quest(
  'a09-09',
  'The Octopus',
  {
    'a09-09-s1': {
      goal: 'Cross the deep part of the seabed.',
      hint: 'Keep to the ridge of rock. Stay away from the dark pool.',
    },
    'a09-09-s2': {
      goal: 'Keep everyone together while the Snork Maiden helps.',
      hint: 'Hold the line on the ridge. Hold a light up if you can.',
    },
  },
  [
    sc(
      'a09-09-deep',
      [
        N('The seabed dips down. The pools are dark and deep.'),
        N('Everything is red in the comet’s light.'),
        SO('We keep to the ridge. Single file. That is a rule.', 'think'),
        MT('Not far now. I can almost smell the jam.', 'happy'),
        N('Moomintroll steps off the ridge to take a shortcut.'),
        N('His stilt sinks into the edge of a dark pool.'),
        N('The water in the pool moves, though there is no wind.'),
      ],
      [
        ask(
          'social-studies',
          'rules keep us safe',
          -1,
          [N('The Snork says: keep to the ridge.'), N('Why do we have a rule like that?')],
          [
            opt(
              'It keeps us safe',
              [N('Yes! Rules are there to look after us. The ridge is the safe path.')],
              true,
            ),
            opt('To be bossy', [
              N('The Snork can be bossy! But this rule is to keep everyone safe.'),
            ]),
          ],
          'Talked about how rules keep people safe.',
          'D2.Civ.8.K-2',
        ),
      ],
    ),
    sc(
      'a09-09-deep-done',
      [
        SK('Moomintroll. Come back on the ridge. Slowly.'),
        N('Snufkin’s voice is low and calm.'),
        N('A calm voice helps a friend who is in a fix.'),
      ],
      [
        note(
          'sel',
          'a calm voice helps a friend feel steady',
          -1,
          [
            N('When someone is in trouble, a calm voice helps them feel steady.'),
            N('Try it: say “slowly, slowly” in a soft voice.'),
          ],
          'Practised a calm, soft voice for helping a friend.',
          'CASEL: Self-management',
        ),
      ],
    ),
    sc(
      'a09-09-octopus',
      [
        N('A long arm comes out of the pool. Then another.'),
        N('An octopus lifts its head. It looks at him with one big, sad eye.'),
        N('It has eight arms. One curls round Moomintroll’s stilt.'),
        MT('Help! I cannot pull free!', 'shock'),
        N('Sniff squeaks and hides behind the Hemulen.'),
        N('The Snork Maiden grabs a lantern and runs.'),
        SM('Let him go!', 'angry'),
        N('She swings the lantern. Gold light flares on the rock.'),
      ],
      [
        doit(
          'maths',
          'count eight arms',
          2,
          'edu:count:octopus-arms:8',
          [
            N('An octopus has eight arms.'),
            N('(Count them on your fingers: one, two, three, four, five, six, seven, eight.)'),
          ],
          'Counted to eight on the arms of an octopus.',
          'K.CC.A.1',
        ),
      ],
      {
        choices: [
          {
            id: 'light',
            label: 'Hold your own light up behind her.',
            then: [
              N('You hold the pink shell up. It throws the light back.'),
              N('The octopus blinks, and its arms open.'),
            ],
          },
          {
            id: 'line',
            label: 'Grab Moomintroll’s paw and pull.',
            then: [
              N('You catch his paw. The Hemulen catches you.'),
              N('The arms open, and everyone tumbles back in a heap.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a09-09-octopus-done',
      [
        N('The octopus slides back into its pool. Not a splash.'),
        N('It was only curious, and a bit frightened by the lights.'),
        N('Moomintroll is fine. He just stares at the Snork Maiden.'),
      ],
      [
        ask(
          'sel',
          'animals can be scared too',
          -1,
          [N('The octopus was curious and a little scared. Was it being mean?')],
          [
            opt(
              'No, it was scared and curious',
              [N('Yes! Animals have feelings too. It wanted to be safe, just like us.')],
              true,
            ),
            opt('Yes, it was wicked', [
              N('It never wanted to hurt anyone. It was curious and scared.'),
              N('We can be kind to animals.'),
            ]),
          ],
          'Talked about how animals can feel scared and curious too.',
          'CASEL: Social awareness',
        ),
      ],
    ),
    sc(
      'a09-09-complete',
      [
        MT('You saved me.', 'shock'),
        SM('You saved me first. Now we are even.', 'happy'),
        MT('I did not know you could do that.'),
        SM('Neither did I. I was too busy doing it.'),
        N('Sniff and your Nubbin come out, surprised to be fine.'),
      ],
      [
        ask(
          'literacy',
          'how a character feels',
          -1,
          [N('Moomintroll says, “You saved me.” How does he feel about the Snork Maiden?')],
          [
            opt(
              'Thankful and amazed',
              [N('Yes! He feels thankful, and amazed. Good word for feelings: thankful.')],
              true,
            ),
            opt('Grumpy', [N('He is not grumpy. He is thankful. He is amazed she was so brave.')]),
          ],
          'Worked out how a character feels from what he says.',
          'RL.2.3',
        ),
      ],
    ),
  ],
  'Lessons: safety rules, calm voices, counting eight, animal feelings, reading feelings.',
);

// ================================================================== A9-10 The Race Home
const A10 = quest(
  'a09-10',
  'The Race Home',
  {
    'a09-10-s1': {
      goal: 'Get off the seabed and on to the road home.',
      hint: 'Climb the shingle bank on the far side. Then keep walking.',
    },
    'a09-10-s2': {
      goal: 'Hold on together when the wind comes.',
      hint: 'Get everyone behind the stone wall. Hold the nearest paw.',
    },
    'a09-10-s3': {
      goal: 'Run the last bit to the valley.',
      hint: 'Down through the birch wood. You know the way.',
    },
  },
  [
    sc(
      'a09-10-road',
      [
        N('You climb off the seabed in the morning.'),
        N('The sky is red, even in the daytime.'),
        N('The air is hot and still. The leaves hang down.'),
        SM('What day is it?'),
        SO('The seventh. I wish it was not.', 'sad'),
        MT('We can do it! It comes in the evening.'),
        N('Sniff walks a little faster.'),
      ],
      [
        note(
          'science',
          'wind makes leaves move; still air does not',
          2,
          [
            N('When the air is still, leaves hang down.'),
            N('When the wind blows, they dance. Wind is air that moves.'),
          ],
          'Heard that wind is moving air, and that still air leaves leaves hanging.',
          'K-ESS2-1',
        ),
      ],
    ),
    sc(
      'a09-10-road-done',
      [
        N('At a crossroads, a second Hemulen sits on a milestone.'),
        N('He wears a big flowered dress and fans himself.'),
        H2('Cousin! What are you doing out on a day like this?', 'shock'),
        HE('Walking very fast, cousin.'),
      ],
      [
        ask(
          'maths',
          'beside means next to',
          -1,
          [N('The second Hemulen sits on a milestone beside the road. What does beside mean?')],
          [
            opt('Next to', [N('Yes! Beside means next to. The stone is next to the road.')], true),
            opt('Far away', [N('Beside means close. He is right next to the road.')]),
          ],
          'Learned the position word “beside”.',
          'K.G.A.1',
        ),
      ],
    ),
    sc(
      'a09-10-tornado',
      [
        N('A great wind comes. Dust spins up in a column.'),
        SK('Down behind the wall, everybody!'),
        N('It picks up the other Hemulen, in his dress.'),
        N('The dress fills up like a sail! He holds on to Moomintroll.'),
        N('Then everyone holds on to everyone.'),
        SK('Spread your skirts out wide! Like wings!'),
        N('The Hemulen spreads his dress. You are gliding, all in a chain.'),
      ],
      [
        doit(
          'health',
          'moving the body like wings',
          -1,
          'edu:move:arms:wings',
          [
            N('Let’s glide! Stretch your arms out wide like wings, and sway.'),
            N('(Hold on to the nearest hand, too.)'),
          ],
          'Moved arms wide like wings, practising balance and big movements.',
          'ELOF: Perceptual, Motor, and Physical Development',
        ),
      ],
      {
        choices: [
          {
            id: 'hold',
            label: 'Hold on tight to Sniff.',
            then: [N('Sniff has his eyes shut tight.'), SN('Tell me when it is over.', 'shock')],
          },
          {
            id: 'look',
            label: 'Open your eyes and look down.',
            then: [
              N('Below, the whole country is spread out like a map.'),
              N('At the river’s end, a green valley, and a tall blue house.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a09-10-tornado-done',
      [
        N('The wind sets you all down, gently.'),
        N('One after another, like washing off a line.'),
        H2('My best dress. It has never been so useful.', 'happy'),
        N('(Say it together, like a drum: Hold on tight! Hold on tight!)'),
      ],
      [
        note(
          'literacy',
          'a repeated line, a refrain',
          -1,
          [
            N('A line we say again and again is called a refrain.'),
            N('Say it with me: Hold on tight! Hold on tight!'),
            N('We are flying through the sky!'),
          ],
          'Joined in a repeated line (a refrain), listening to its rhythm.',
          'RL.2.4',
        ),
      ],
    ),
    sc(
      'a09-10-run',
      [
        N('Everyone sits up in the meadow and counts.'),
        SO('Seven friends, a Nubbin and a cousin. Nobody missing!', 'happy'),
        N('The comet fills a third of the sky now.'),
        SM('How far is it to the valley?'),
        MT('Over the hill and through the birch wood.', 'happy'),
        N('Snufkin pats his head. His hat has gone.'),
        N('It is caught on a thistle, three steps away.'),
      ],
      [
        doit(
          'maths',
          'count seven friends',
          1,
          'edu:count:friends:7',
          [
            N('Count the friends together, on your fingers.'),
            N('Moomintroll, Sniff, Snufkin, the Snork Maiden, the Snork, the Hemulen, you.'),
          ],
          'Counted seven friends in the group.',
          'K.CC.B.5',
        ),
      ],
      {
        choices: [
          {
            id: 'catch',
            label: 'Run and catch it.',
            then: [
              N('You grab it just as it lifts. It smells of woodsmoke.'),
              SK('Hold it for me. My hands are full of Sniff.', 'happy'),
            ],
          },
          {
            id: 'nubbin',
            label: 'Let your Nubbin fetch it.',
            then: [
              N('Your Nubbin runs. The hat settles right over it.'),
              N('The hat walks back. Snufkin laughs out loud.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a09-10-run-done',
      [
        N('Then you run, all of you, down through the birch wood.'),
        MT('There! There is the house! There is the smoke!', 'happy'),
        N('Moomintroll feels happy, and excited, and nearly home.'),
      ],
      [
        ask(
          'sel',
          'naming feelings: excited, happy',
          -1,
          [N('Moomintroll sees his house. How does he feel?')],
          [
            opt(
              'Happy and excited',
              [N('Yes! He feels excited. Feelings can have lots of names.')],
              true,
            ),
            opt('Sleepy and bored', [N('Not this time! He is jumping up and down. Excited!')]),
          ],
          'Named a feeling (excited) from a character’s actions.',
          'CASEL: Self-awareness',
        ),
      ],
    ),
    sc(
      'a09-10-complete',
      [
        N('The garden is empty and the house is shut.'),
        N('A note is pinned to the door, in Mamma’s round writing.'),
        MT('It says: gone to the cave. Come quickly.'),
        SN('The cave! My cave!', 'happy'),
        N('The other Hemulen still holds his dress out, in case.'),
      ],
      [
        note(
          'literacy',
          'writing tells us things',
          -1,
          [
            N('Mamma left a note, so everyone would know where she went.'),
            N('Writing can tell us things when nobody is there.'),
            N('(Point to some writing near you.)'),
          ],
          'Heard that a note tells us something when the writer is not there.',
          'ELOF: Literacy',
        ),
      ],
    ),
  ],
  'Lessons: wind, beside, wings and balance, a refrain, counting seven, naming a feeling, notes.',
);

// ================================================================== A9-11 The Cave
const A11 = quest(
  'a09-11',
  'The Cave',
  {
    'a09-11-s1': {
      goal: 'Take everyone down to the cave on the shore.',
      hint: 'Use Sniff’s secret path. It is the quickest.',
    },
    'a09-11-s2': {
      goal: 'Choose the one thing you bring into the cave.',
      hint: 'Moominmamma is at the cave mouth. Show her what you are carrying.',
    },
    'a09-11-s3': {
      goal: 'Sit with Sniff in the dark.',
      hint: 'He is at the very back of the cave. Sit down beside him.',
    },
  },
  [
    sc(
      'a09-11-arrive',
      [
        N('Sniff leads the way down his secret path, fast.'),
        N('The cave mouth glows. Inside, there is a room!'),
        N('Blankets, lamps, a rocking chair, and the kitchen clock.'),
        MM('There you all are. More of you than went!', 'happy'),
        N('Moomintroll runs into her apron and stays.'),
        MM('There is cake. There is always cake, at the end of the world.', 'soft'),
        MU('I brought my hammock. Nobody else thought of it.', 'think'),
      ],
      [
        ask(
          'sel',
          'what makes a place feel safe',
          -1,
          [N('Mamma made a cave feel safe. What can make a place feel safe?')],
          [
            opt(
              'Blankets, light, and people who care',
              [N('Yes! Safe is a feeling. Cosy things and kind people make it.')],
              true,
            ),
            opt('Being all alone', [
              N('Some people like quiet. But many feel safest with others who care.'),
            ]),
          ],
          'Talked about what makes a place feel safe.',
          'CASEL: Social awareness',
        ),
      ],
    ),
    sc(
      'a09-11-arrive-done',
      [
        N('The kitchen clock says half past seven.'),
        N('It ticks loudly. Everybody is listening.'),
        N('The long hand points straight down, at six.'),
      ],
      [
        note(
          'maths',
          'half past: the long hand points to six',
          -1,
          [
            N('Half past means half an hour after the hour.'),
            N('The long hand points straight down, to the six. Tick, tock!'),
          ],
          'Heard that half past means the long hand points to six.',
          '1.MD.B.3',
        ),
      ],
    ),
    sc(
      'a09-11-door',
      [
        N('Moominmamma stands at the cave mouth with a blanket.'),
        MM('A small cave. Many friends. One thing each, the thing you love.', 'soft'),
        MM('The rest waits outside. It will be there in the morning.'),
        N('You put down your things on the rock.'),
        N('Three are left: the shell, the garnet, and your Nubbin.'),
        N('Your arms are only so big.'),
      ],
      [
        ask(
          'social-studies',
          'we choose when we cannot have everything',
          -1,
          [N('Your arms only hold so much.'), N('What do we do when we cannot take everything?')],
          [
            opt(
              'Choose what we love most',
              [N('Yes! Choosing means picking what matters most to you.')],
              true,
            ),
            opt('Take it all and drop it', [
              N('Then things might break. Choosing carefully is wiser.'),
            ]),
          ],
          'Talked about choosing what matters most when we cannot have everything.',
          'D2.Eco.1.K-2',
        ),
      ],
      {
        choices: [
          {
            id: 'shell',
            label: 'The shell with no sea in it.',
            set: { 'a09-brought': 'shell' },
            then: [
              N('You bring the shell. Your Nubbin comes too, as Sniff’s one thing.'),
              MM('It is waiting for something. Bring it in.'),
            ],
          },
          {
            id: 'garnet',
            label: 'The garnet Sniff gave you to hold.',
            set: { 'a09-brought': 'garnet' },
            then: [
              N('You bring the garnet. Sniff sees, and pretends not to.'),
              MM('Somebody has been generous.', 'soft'),
            ],
          },
          {
            id: 'nubbin',
            label: 'Nothing but your Nubbin, held in both arms.',
            set: { 'a09-brought': 'nubbin' },
            then: [
              N('You hold your Nubbin in both arms. The rest stays out.'),
              MM('Yes. That is the right size for arms.', 'soft'),
            ],
          },
        ],
      },
    ),
    sc(
      'a09-11-dark',
      [
        N('The lamps go out one by one, to save oil.'),
        N('The kitchen clock says twenty to nine.'),
        N('Outside, the sky is red. It lies on the sand like a carpet.'),
        N('A sound begins, far away, like the sky taking a breath.'),
        N('Sniff is at the very back of the cave. You sit beside him.'),
        N('He does not ask you anything this time.'),
        N('In the dark his paw finds your hand and holds on.'),
        N('Neither of you says a word. You wait, together.'),
      ],
      [
        doit(
          'sel',
          'a held hand can help when we are worried',
          -1,
          'edu:hold:hand:friend',
          [
            N('Holding a friend’s hand can help a worry feel smaller.'),
            N('(Hold hands with the grown-up reading, and take three slow breaths.)'),
          ],
          'Held a hand and breathed slowly, noticing how it helps with worries.',
          'ELOF: Social and Emotional Development',
        ),
      ],
    ),
    sc(
      'a09-11-dark-done',
      [
        N('The kitchen clock says eight forty-two.'),
        N('The clock has gone on ticking, tick, tick, tick.'),
        N('Time goes on, even when we wait.'),
      ],
      [
        note(
          'maths',
          'the clock hands move forward as time passes',
          -1,
          [
            N('Half past seven, then twenty to nine, then eight forty-two.'),
            N('The clock’s hands creep round and round as time goes by.'),
          ],
          'Noticed that clock hands move on as time passes, reading three times in the story.',
          '1.MD.B.3',
        ),
      ],
    ),
    sc(
      'a09-11-complete',
      [
        N('Then there is light and noise.'),
        N('Boom, rumble! The ground shakes, softly.'),
        MM('Hush now. Hush. Everyone is here.', 'soft'),
        N('Everyone is here.'),
      ],
      [
        note(
          'literacy',
          'sound words',
          1,
          [
            N('Boom! Rumble! Hush!'),
            N('Some words sound like what they mean.'),
            N('Say them together, loud, then soft.'),
          ],
          'Joined in with sound words (boom, rumble, hush).',
          'ELOF: Language and Communication',
        ),
      ],
    ),
  ],
  'Lessons: safe places, half past, choosing, holding a hand, clock hands moving, sound words.',
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
      goal: 'Go out in the morning and see the sea.',
      hint: 'Walk out of the cave mouth and down to the water.',
    },
    'a09-12-s3': {
      goal: 'Say goodbye, and give Snufkin back his hat.',
      hint: 'Snufkin is at the gate with his pack. Bring the hat.',
    },
  },
  [
    sc(
      'a09-12-night',
      [
        N('The roar goes over. It goes on a long time.'),
        N('Then it is less. Then it is going away.'),
        MU('It seems to have missed.', 'think'),
        N('The Snork Maiden laughs in the dark. Then everybody laughs.'),
        SN('Has it gone? Tell me exactly.', 'shock'),
        MP('It brushed us with its tail, and went on its way.', 'soft'),
        N('The lamps come on. Moominmamma cuts the cake.'),
      ],
      [
        note(
          'science',
          'real comets almost always pass by',
          -1,
          [
            N('Real comets travel round the Sun on very long paths.'),
            N('They are far, far from us. Nearly always, they just pass by.'),
          ],
          'Heard that real comets almost always just pass by, far away.',
        ),
      ],
    ),
    sc(
      'a09-12-night-done',
      [
        N('One by one, everybody falls asleep where they sit.'),
        N('They are in a heap, like puppies.'),
        N('It was a big night. Their bodies need rest.'),
      ],
      [
        ask(
          'health',
          'sleep helps our bodies rest',
          -1,
          [N('After a big, long day, what do bodies need?')],
          [
            opt(
              'Sleep and rest',
              [N('Yes! Sleep lets our bodies and minds rest and grow strong.')],
              true,
            ),
            opt('More running', [
              N('Running is fun, but after a big day we need rest. Sleep helps!'),
            ]),
          ],
          'Talked about sleep helping bodies rest after a long day.',
          'ELOF: Perceptual, Motor, and Physical Development',
        ),
      ],
    ),
    sc(
      'a09-12-dawn',
      [
        N('In the morning, you wake with sand in your ear.'),
        N('The light is not red. It is ordinary, yellow, wonderful.'),
        N('The grey has gone off everything. The grass is green.'),
        N('The sea is coming back, in long, slow, shining sheets.'),
        MT('It came back. Everything came back.', 'happy'),
        SK('Things mostly do.', 'soft'),
      ],
      [
        note(
          'science',
          'the tide: the sea goes out and comes back',
          3,
          [
            N('Real seas move in and out each day. We call that the tide.'),
            N('The sea goes out, and it always comes back.'),
          ],
          'Heard that the sea moves in and out each day, called the tide.',
        ),
      ],
    ),
    sc(
      'a09-12-dawn-done',
      [
        N('Your Nubbin runs down to the water.'),
        N('It sits in the first wave. The sea comes home round it.'),
        SN('It is all right, then. I can tell, because it is doing that.', 'happy'),
      ],
      [
        ask(
          'sel',
          'feeling relieved',
          -1,
          [N('Sniff feels all the worry go away. What do we call that feeling?')],
          [
            opt(
              'Relieved',
              [N('Yes! Relieved. It is the breath-out feeling, after a worry.')],
              true,
            ),
            opt('Angry', [N('Not angry. Sniff feels the worry lift. That is relieved.')]),
          ],
          'Named relief as the feeling after a worry has gone.',
          'CASEL: Self-awareness',
        ),
      ],
    ),
    sc(
      'a09-12-gate',
      [
        N('Snufkin is at the gate with his tent on his back.'),
        N('You hold out his hat.'),
        SK('Keep it. I will find another.', 'happy'),
        N('He puts it on your head. It comes down over your eyes!'),
        MM('Something to remember the house by.', 'soft'),
        N('She gives you a little blue stove.'),
        MM('Wherever you light it, people come home to it.'),
      ],
      [
        ask(
          'maths',
          'one and one make two',
          -1,
          [N('Snufkin gives you a hat. Mamma gives you a stove. How many gifts?')],
          [
            opt('Two', [N('Yes! One and one make two. Two gifts, and two thank-yous!')], true),
            opt('One', [N('Count them: a hat is one, a stove is two. Two gifts!')]),
          ],
          'Added one and one to count two gifts.',
          'K.OA.A.1',
        ),
      ],
    ),
    sc(
      'a09-12-gate-done',
      [
        N('Snufkin is at the bend in the road.'),
        N('He plays a few notes without looking back.'),
        N('You play a few back.'),
        N('He waves his hand over his head.'),
      ],
      [
        doit(
          'music',
          'call and response',
          -1,
          'edu:sing:call-and-response',
          [
            N('Snufkin plays, and you play back. Let’s do it.'),
            N('The grown-up hums three notes, and you hum them back.'),
          ],
          'Echoed a short tune back, practising call and response.',
          'ELOF: Language and Communication',
        ),
      ],
    ),
    sc(
      'a09-12-complete',
      [
        N('The page begins to curl at the edges.'),
        MT('Will you come back? There is always a bed for you.', 'happy'),
        SN('Bring the Nubbin. My pocket will be empty.', 'soft'),
        N('The blue house and the sea go flat and still.'),
        N('You are back in the Grove, with a little blue stove.'),
      ],
      [
        note(
          'literacy',
          'a story has a beginning, a middle and an end',
          -1,
          [
            N('This story is at its end. It began with a grey sea.'),
            N('In the middle, the friends travelled. At the end, everyone was home.'),
          ],
          'Heard that stories have a beginning, a middle and an end.',
          'RL.K.3',
        ),
      ],
    ),
  ],
  'Lessons: comets pass by, rest, tides, naming relief, one and one, listening, call and response, story shape.',
);

// ================================================================== variants
/** Variant scenes chosen by a09-answer and a09-brought. Each replaces the base scene named in its `of`. */
export const EDU_A09_SPROUT_VARIANTS: EduScene[] = [
  sc(
    'a09-11-dark-home',
    [
      N('The lamps go out one by one, to save oil.'),
      N('The kitchen clock says twenty to nine.'),
      N('Outside, the sky is red. It lies on the sand like a carpet.'),
      N('A sound begins, far away, like the sky taking a breath.'),
      N('Sniff is at the very back of the cave. You sit beside him.'),
      SN('We are home by then. You said. We are home.', 'soft'),
      N('He has carried your words like a button. Now he gives them back.'),
      N('You wait, together.'),
    ],
    [
      note(
        'sel',
        'saying a worry out loud, and keeping a promise in mind',
        -1,
        [
          N('Sniff said his words out loud. Saying a worry out loud helps.'),
          N('And the words you said gave him something good to hold.'),
        ],
        'Heard that kind words stay with a friend, and that saying a worry out loud helps.',
        'CASEL: Self-awareness',
      ),
    ],
  ),
  sc(
    'a09-12-dawn-done-shell',
    [
      N('You take the pink shell out of your pocket.'),
      N('You hold it to your ear.'),
      N('Very faint, you hear the sea. It got home first.'),
      MT('Let me listen! Oh. It is home.', 'happy'),
    ],
    [
      doit(
        'music',
        'listening closely to quiet sounds',
        -1,
        'edu:listen:quiet-sounds',
        [
          N('Shh. Quiet sounds are there if we are very still.'),
          N('A shell catches tiny sounds and makes them sound like waves.'),
          N('(Cup your hand round your ear. What can you hear?)'),
        ],
        'Listened very closely for quiet sounds, and heard why a shell seems to hold the sea.',
        'ELOF: Perceptual, Motor, and Physical Development',
      ),
    ],
  ),
  sc(
    'a09-12-dawn-done-garnet',
    [
      N('You hold out the garnet to Sniff.'),
      SN('No. You keep it. You held it all night.', 'soft'),
      N('He looks surprised at himself.'),
      N('Then he looks pleased, which surprises him more.'),
    ],
    [
      note(
        'sel',
        'giving feels good',
        -1,
        [
          N('Sniff gave his garnet away, and he feels pleased.'),
          N('Giving a gift can make the giver feel warm, too.'),
        ],
        'Talked about how giving can feel good for the giver.',
        'ELOF: Social and Emotional Development',
      ),
    ],
  ),
  sc(
    'a09-12-dawn-mamma',
    [
      N('In the morning, you wake with sand in your ear.'),
      N('The light is not red. It is ordinary, yellow, wonderful.'),
      N('The grey has gone off everything. The grass is green.'),
      N('The sea is coming back, in long, slow, shining sheets.'),
      MT('It came back. Everything came back.', 'happy'),
      SK('Things mostly do.', 'soft'),
      N('The raft drifts in on the first wave.'),
      N('Its name is still on the stern.'),
      SN('She came home on her own. That is allowed, isn’t it?', 'happy'),
      MP('Of course. She is named after someone who always comes home.', 'soft'),
    ],
    [
      note(
        'science',
        'the tide: the sea goes out and comes back',
        3,
        [
          N('Real seas move in and out each day. We call that the tide.'),
          N('The sea goes out, and it always comes back.'),
        ],
        'Heard that the sea moves in and out each day, called the tide.',
      ),
    ],
  ),
  sc(
    'a09-12-dawn-valuable',
    [
      N('In the morning, you wake with sand in your ear.'),
      N('The light is not red. It is ordinary, yellow, wonderful.'),
      N('The grey has gone off everything. The grass is green.'),
      N('The sea is coming back, in long, slow, shining sheets.'),
      MT('It came back. Everything came back.', 'happy'),
      SK('Things mostly do.', 'soft'),
      N('The raft drifts in on the first wave.'),
      N('Its name is still on the stern.'),
      SN('She came home on her own. That is what a valuable does.', 'happy'),
      MP('Of course. She is called The Valuable. We do not lose a valuable.'),
    ],
    [
      note(
        'science',
        'the tide: the sea goes out and comes back',
        3,
        [
          N('Real seas move in and out each day. We call that the tide.'),
          N('The sea goes out, and it always comes back.'),
        ],
        'Heard that the sea moves in and out each day, called the tide.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A09_SPROUT: EduQuest[] = [
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
  'edu:count:stones:5',
  'edu:count:planks:5',
  'edu:count:birds:3',
  'edu:hum:tune:up-and-down',
  'edu:count:snufkin-things:5',
  'edu:feel:throat:hum',
  'edu:count:days:4',
  'edu:count:friends:5',
  'edu:breathe:still:3',
  'edu:draw:butterfly:dusk',
  'edu:count:octopus-arms:8',
  'edu:move:arms:wings',
  'edu:count:friends:7',
  'edu:hold:hand:friend',
  'edu:sing:call-and-response',
  'edu:listen:quiet-sounds',
];
