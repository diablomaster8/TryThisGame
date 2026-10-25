/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Atlas page A30, The Word on
 * the Brow (the Golem of Prague, a Jewish legend from the Czech lands). Led by Ori from the Hebrew
 * questline, who reads the atlas over your shoulder.
 *
 * Source: atlas-a30.ts (ATLAS_A30 and ATLAS_A30_VARIANTS). One EduScene per original scene, id
 * `sprout:<original id>`, with the same choice ids and the `a30-order` flag set in a30-07-order.
 * Every step scene, done scene, complete scene and variant has a version with exactly one lesson.
 * Domains never repeat back to back, across scenes, quests and variant paths (each variant has a
 * different domain from the scenes either side of it).
 *
 * What it teaches (outline): three Hebrew letters (alef, mem, tav) and that Hebrew is written right
 * to left; the word אֱמֶת, emet, “truth”; that alef, mem and tav are the first, a letter near the middle
 * (the old teachers’ “middle”; mem is the 13th of 22) and the last letters of the alef-bet; Prague and its river on a map; the Sabbath as a day of rest. Around
 * them: counting, taking away, shapes, first sounds, rhymes, feelings, light and the stars,
 * clay and water, babies, sleep and breathing, helping and fairness. The word מֵת (met) is left to
 * the reader band.
 *
 * Left out or softened for this age (EDU-STYLE.md, “Hard things”):
 * - The “fear outside the walls” stays unnamed: a story that is not true, and some grown-ups talking
 *   late at night beyond the gate. Nothing happens. The comfort is a lamp, a hand, and a hug.
 * - The clay man is not alive like a person. He “lies down to rest” and “goes still”; nobody says he
 *   is sleeping, and the word for dead is not used. When the rabbi rubs out the letter in the forgotten
 *   Friday, the clay simply falls, “soft as sand”, and says plainly that nobody is hurt.
 * - The psalm is “a Sabbath song”, never printed. The Name is never written, spoken or hinted at.
 * - No lines from the source or the 1904 encyclopedia: the childLines replacements are the guide.
 * - Facts used: Prague is a city on the Vltava river, in the Czech lands; Hebrew is written right to
 *   left and has 22 letters; alef is first and tav is last; the Sabbath is a day of rest that starts
 *   on Friday evening and ends on Saturday night, when three stars come out; challah is plaited
 *   bread; a lamp gives light so we can see; wet clay is soft and dries hard; babies are small when
 *   born and grown-ups look after them; running makes the heart beat faster; hands made 3 − 1 = 2.
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
const OR = say('ori');
const LO = say('a30-loew');
const AV = say('a30-avram');
const DV = say('a30-dvora');
const RI = say('a30-rivka');
const SH = say('a30-shmuel');
const MI = say('a30-mirele');
const HA = say('a30-hannah');
const IS = say('a30-isaac');
const JA = say('a30-jacob');
const BO = say('a30-boy');
const M = say('moss');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const words = (t: string) => t.trim().split(/\s+/).length;
const parts = (t: string) => t.split(/(?<=[.!?”)])\s+(?=[A-Z“(‘])/);

/**
 * Keeps every line to 14 words or fewer, as the sprout band requires: a long line is cut at
 * sentence ends into several lines by the same speaker (the mood stays on the first). `map[i]`
 * is the index of the last piece of original line i, so a lesson’s `after` can follow.
 */
const split = (lines: Line[]): { lines: Line[]; map: number[] } => {
  const out: Line[] = [];
  const map: number[] = [];
  for (const l of lines) {
    const chunks: string[] = [];
    const counts: number[] = [];
    for (const sentence of parts(l.text)) {
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

/** A choice, kept under its original id. */
const ch = (
  id: string,
  label: string,
  then: Line[],
  set?: Record<string, number | boolean | string>,
): Choice => ({ id, label, ...(set ? { set } : {}), then: sp(then) });

/** One sprout scene. Lesson ids are `sprout:<of>-l<n>`, numbered in play order. */
const sc = (of: string, lines: Line[], beats: Beat[], choices?: Choice[]): EduScene => {
  const cut = split(lines);
  return {
    id: `sprout:${of}`,
    of,
    band: 'sprout',
    lines: cut.lines,
    ...(choices ? { choices } : {}),
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

const G = (goal: string, hint: string) => ({ goal, hint });

// ================================================================== A30-1 The Jewish Town
const A1: EduQuest = quest(
  'a30-01',
  'The Jewish Town',
  {
    'a30-01-s1': G(
      'Step into the brown-ink page and find the caretaker’s house.',
      'Touch the page, then follow the lane to the door with the ring of keys.',
    ),
    'a30-01-s2': G(
      'Carry water from the well with Rivka.',
      'Rivka knows the way. The well is where three lanes meet.',
    ),
    'a30-01-s3': G(
      'Fetch the bread from Hannah’s bakery.',
      'The bakery is the door with the warm step. Your Nubbin has found it already.',
    ),
  },
  [
    sc(
      'a30-01-page',
      [
        N('Nova’s atlas opens at a page of brown ink.'),
        N('There is a steep roof, little houses, and a wavy line of water.'),
        OR('This is Prague, a city. A wavy line runs right through it. (Point to the wavy line.)'),
        OR('Long ago, people told a story about this place. It is a story, not a fact.'),
        N('Rabbi Loew was a real teacher here. The clay man is only in the story.'),
        N('You step into the page. A kind man with a ring of keys waves at you.'),
        AV('I am Avram. I look after the keys. You can be our lodger.', 'happy'),
      ],
      [
        ask(
          2,
          'social-studies',
          'finding a river on a map',
          'D2.Geo.2.K-2',
          [OR('A map shows land and water. What is the wavy line of water?')],
          [
            o(
              'A river',
              [OR('Yes! The river is called the Vltava. It runs through the middle of Prague.')],
              true,
            ),
            o('A road', [OR('A road is for walking. Water is blue and wavy. It is a river!')]),
            o('A roof', [OR('The roof is the steep triangle on top. The wavy line is a river.')]),
          ],
          'Read a simple map: found the river, the Vltava, and Prague as a city beside it.',
        ),
      ],
      [
        ch('hand', 'Shake his hand.', [AV('A good grip! You will carry water.', 'happy')]),
        ch('keys', 'Ask which key is which.', [
          AV('This one is the big door. This one is the cupboard. This one? I do not know!'),
        ]),
        ch('basket', 'Take the basket he is carrying.', [
          N('He lets you take it. He looks pleased that you helped without being asked.'),
        ]),
      ],
    ),
    sc(
      'a30-01-page-done',
      [
        DV('Come in, come in! Water first, and then you can rest.'),
        RI('I will show you the well! I know the well best of all!', 'happy'),
        N('Rivka hops from one foot to the other. She cannot wait.'),
        RI('That is Shmuel, my little brother. He is five. He asks questions.'),
        N('Shmuel waves from under the table.'),
      ],
      [
        ask(
          2,
          'sel',
          'naming a feeling',
          'ELOF: Social and Emotional Development',
          [N('Rivka is hopping and grinning. How does Rivka feel?')],
          [
            o('Excited', [N('Yes! Excited. Her feet cannot keep still.')], true),
            o('Sleepy', [N('Not sleepy. Sleepy people yawn. Rivka is hopping. She is excited!')]),
            o('Cross', [N('Not cross. She is grinning. She is excited!')]),
          ],
          'Named a feeling (excited) from how someone looks and moves.',
        ),
      ],
    ),
    sc(
      'a30-01-water',
      [
        N('Rivka walks backwards the whole way, so she can talk to you.'),
        RI('That is the study house. That is Hannah’s bakery. Do not look, you will want it!'),
        RI('Worn-out books are put to rest in the attic, not thrown away.'),
        N('At the well you fill two buckets. Your Nubbin fills one little cup.'),
        N('Plop! Plop! The water splashes and sparkles.'),
      ],
      [
        ask(
          3,
          'maths',
          'counting up to 3',
          'K.OA.A.1',
          [N('You have two buckets. Your Nubbin has one cup. (Count them on your fingers.)')],
          [
            o('3 things', [N('Yes! Two buckets and one cup. One, two, three!')], true),
            o('2 things', [N('Let us count again: bucket, bucket, cup. That is three!')]),
            o('4 things', [N('Count with me: one, two, three. Three things, not four.')]),
          ],
          'Added 2 and 1 with objects to make 3.',
        ),
      ],
    ),
    sc(
      'a30-01-water-done',
      [
        DV('Good. Now you are guests. Rivka, take them to the bakery before it shuts.'),
        N('Rivka grins. She loves the bakery.'),
      ],
      [
        ask(
          0,
          'literacy',
          'the first sound of a word',
          'RF.K.2',
          [
            DV(
              'Bakery. Bread. Both start with the same sound. Which word starts the same: bread or well?',
            ),
          ],
          [
            o('Bread', [DV('Yes! B, b, bakery. B, b, bread. The same sound at the start.')], true),
            o('Well', [DV('Well starts with w. Bakery and bread both start with b!')]),
          ],
          'Matched the first sound b in bakery and bread.',
        ),
      ],
    ),
    sc(
      'a30-01-bakery',
      [
        N('Your Nubbin sits on the bakery step. The step is warm, and its eyes are shut.'),
        HA('Is this one yours? It has not moved since you came.'),
        N('Behind Hannah, plaited loaves stand in rows, waiting for Friday.'),
        HA('Those are for the Sabbath. This is a crust I burnt. It is for you.'),
        N('Your Nubbin holds the crust in both paws, as if it were a medal.'),
      ],
      [
        ask(
          3,
          'science',
          'baking cannot be undone',
          '2-PS1-4',
          [
            HA(
              'The soft dough went into the hot oven and came out as bread. Can it turn back into dough?',
            ),
          ],
          [
            o('No, heat changed it for good', [HA('Right! Baking changes dough for good.')], true),
            o('Yes, it can', [
              HA('Not this time. Once bread is baked, it cannot go back to dough.'),
            ]),
          ],
          'Noticed that baking changes dough into bread and it cannot be changed back.',
        ),
      ],
    ),
    sc(
      'a30-01-complete',
      [
        N('The loft is small and smells of apples.'),
        N('Across the lane, a lamp still burns in the study house. Someone is reading.'),
        RI('That is the rabbi. He reads all night sometimes.'),
        N('Your Nubbin falls asleep with flour on its nose.'),
      ],
      [
        ask(
          3,
          'sel',
          'what helps when you are tired',
          'CASEL: Self-management',
          [N('It was a big day. Your Nubbin is tired. What helps when we are tired?')],
          [
            o('Rest and sleep', [N('Yes. Rest helps bodies feel better.')], true),
            o('Running faster', [N('Running makes us more tired! Rest is what helps.')]),
          ],
          'Talked about tiredness and that rest helps.',
        ),
      ],
    ),
  ],
);

// ================================================================== A30-2 The Rabbi
const A2: EduQuest = quest(
  'a30-02',
  'The Rabbi',
  {
    'a30-02-s1': G(
      'Go to the study house with Avram and sit at the back.',
      'The bench by the door. Sit still, and listen.',
    ),
    'a30-02-s2': G(
      'Answer the rabbi’s question, if you can.',
      'He is looking at the back bench. There is no wrong answer.',
    ),
  },
  [
    sc(
      'a30-02-study',
      [
        N('The study house is one long room full of books and noise.'),
        N('Students sit in pairs, and talk and talk about one page.'),
        AV('It is meant to be loud. Thinking is noisy!'),
        N('At the front sits an old man with a grey beard.'),
        LO('Here is a very old story. A man made of clay was spoken to, and he did not answer.'),
        LO('So the wise man knew he was only clay.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'how people learned long ago',
          'D2.His.2.K-2',
          [N('In the study house, students learn in pairs and talk it out. How do they learn?')],
          [
            o('Together, with a partner', [N('Yes! Two heads think better than one.')], true),
            o('All alone and silent', [N('Not here! In this study house everyone talks.')]),
          ],
          'Compared how students learned in the past (talking in pairs) with today.',
        ),
      ],
    ),
    sc(
      'a30-02-study-done',
      [
        N('The rabbi lets the story sit in the room.'),
        N('It is like bread that must rest before you cut it.'),
      ],
      [
        ask(
          0,
          'literacy',
          'knowing who a story is about',
          'RL.K.3',
          [N('In the rabbi’s story, who was made of clay and could not answer?')],
          [
            o('A clay man', [N('Yes! A man made of clay.')], true),
            o('A baker', [N('The baker is Hannah. The story was about a man made of clay.')]),
          ],
          'Named the character in a short story.',
        ),
      ],
    ),
    sc(
      'a30-02-question',
      [
        LO('Now. What makes a person a person? Someone tell me.'),
        N('A student says, “Someone who answers.” Another says, “Someone you can talk to.”'),
        LO('An old prayer says: before I was made, you saw me.'),
        LO('So we were all clay once, and someone saw us. What makes the difference?', 'think'),
        N('He looks at the back bench. At you.'),
      ],
      [
        ask(
          4,
          'sel',
          'showing feelings without words',
          'CASEL: Social awareness',
          [N('Your Nubbin cannot speak. How can it show you it is happy?')],
          [
            o(
              'It bounces and smiles',
              [N('Yes! Faces and bodies show feelings, even without words.')],
              true,
            ),
            o('It cannot show anything', [
              N('It can! Smiles, bounces and hugs tell us how someone feels.'),
            ]),
          ],
          'Noticed that people show feelings with faces and bodies as well as words.',
        ),
      ],
      [
        ch('answers', 'Someone who can answer.', [
          LO('Braver, from the back of the room. Good.', 'happy'),
        ]),
        ch('asks', 'Someone who can ask.', [
          LO('Then this is a room of people, and I worry for nothing.', 'happy'),
        ]),
        ch('nubbin', 'Look at your Nubbin.', [
          LO('It does not speak. But it looked up when I said clay.', 'soft'),
          LO('Answering is more than words.'),
        ]),
      ],
    ),
    sc(
      'a30-02-complete',
      [
        N('At the door the rabbi looks down at your Nubbin.'),
        LO('Does it do as it is told?'),
        AV('Never, Rabbi! It is a great comfort to the house.'),
        LO('Good! I would worry otherwise.', 'happy'),
        N('He goes out, and leaves his coat behind on the peg.'),
      ],
      [
        ask(
          4,
          'literacy',
          'rhyming words',
          'RF.K.2',
          [N('The rabbi forgot his coat. Coat rhymes with…which word: goat or cup?')],
          [
            o('Goat', [N('Yes! Coat, goat. They sound the same at the end.')], true),
            o('Cup', [N('Cup does not sound like coat. Goat does: coat, goat!')]),
          ],
          'Found a rhyming word (coat and goat).',
        ),
      ],
    ),
  ],
);

// ================================================================== A30-3 Fear
const A3: EduQuest = quest(
  'a30-03',
  'Fear',
  {
    'a30-03-s1': G(
      'Find out why Avram has come home early.',
      'He is on the woodpile in the courtyard.',
    ),
    'a30-03-s2': G(
      'Get through the night.',
      'Choose where to be. Nothing will happen to you. It is only a long night.',
    ),
  },
  [
    sc(
      'a30-03-rumour',
      [
        N('Avram comes home at noon and sits on the woodpile.'),
        AV('Some people outside the walls are telling a story about us. It is not true.', 'sad'),
        DV('Stories that are not true can be told for a long time. We stay together.'),
        N('Dvora puts her hand on his shoulder, and leaves it there.'),
        RI('Will they come in?'),
        DV('The gates shut at night. We look after each other.'),
      ],
      [
        ask(
          3,
          'sel',
          'what helps when you are worried',
          'CASEL: Self-management',
          [N('Avram is worried. What helps when we feel worried?')],
          [
            o('A hand to hold and a kind word', [N('Yes. Being together helps.')], true),
            o('Hiding and saying nothing', [
              N('Telling someone and staying close helps more than hiding.'),
            ]),
          ],
          'Talked about what helps when we feel worried: staying close to someone kind.',
        ),
      ],
    ),
    sc(
      'a30-03-rumour-done',
      [
        AV('Bar the shutters at dusk. Then we rest, if we can.'),
        N('There are four shutters on the house.'),
        N('(Count the shutters with your finger: one, two, three, four.)'),
      ],
      [
        doit(
          2,
          'maths',
          'count to 4',
          'K.CC.B.5',
          'edu:count:shutters:4',
          [N('(Tap each shutter as you count: one, two, three, four.)')],
          'Counted four shutters, one for each number said.',
        ),
      ],
    ),
    sc(
      'a30-03-night',
      [
        N('It is dark now. Across the lane, the rabbi’s window glows with lamplight.'),
        N('Some grown-ups are talking, far away beyond the gate. You cannot hear the words.'),
        N('Shmuel climbs into his sister’s bed, and she lets him.'),
        SH('Is the rabbi scared?'),
        RI('The rabbi is thinking. It looks the same from outside.'),
      ],
      [
        ask(
          1,
          'science',
          'we see things when there is light',
          '1-PS4-2',
          [N('It is dark, but you can see the rabbi’s window. Why can you see it?')],
          [
            o('The lamp gives light', [N('Yes! A lamp makes light, so we can see.')], true),
            o('The window is loud', [
              N('Windows are not loud. The lamp makes light, and we see the light.'),
            ]),
          ],
          'Noticed that a lamp gives light, so we can see in the dark.',
        ),
      ],
      [
        ch('children', 'Sit on the floor by the children’s bed.', [
          N('A small hand comes down and holds your collar.'),
          N('Your Nubbin climbs up between them. Shmuel goes to sleep.'),
        ]),
        ch('watch', 'Keep watch at the shutter with Avram.', [
          AV('There is nothing to see. I look anyway.'),
          N('You look together, until the lights far away go out.'),
        ]),
        ch('rabbi', 'Watch the rabbi’s window.', [
          N(
            'Very late, a shadow crosses the lamp, back and forth. Someone is walking, and thinking.',
          ),
        ]),
      ],
    ),
    sc(
      'a30-03-complete',
      [
        N('In the morning everything is fine. Nothing happened, this time.'),
        N('Hannah’s oven is lit, and the lane smells of bread.'),
        LO('Good morning. It is a good morning.', 'soft'),
        DV('He did not sleep. He always gets thoughtful before breakfast.'),
        N('Your Nubbin comes out wearing the rabbi’s coat. Most of it trails behind.'),
        DV('He leaves his coat on a peg. Every week!'),
        LO('Ah! I wondered where I had got to.', 'happy'),
      ],
      [
        ask(
          3,
          'literacy',
          'the meaning of a new word',
          'L.2.4',
          [DV('Thoughtful means thinking hard about something. What is the rabbi doing?')],
          [
            o('Thinking hard', [DV('Yes! He is being thoughtful.')], true),
            o('Eating cake', [DV('No cake! Thoughtful means thinking hard.')]),
          ],
          'Learned the word thoughtful from how it is used.',
        ),
      ],
    ),
  ],
);

// ================================================================== A30-4 The Answer
const A4: EduQuest = quest(
  'a30-04',
  'The Answer',
  {
    'a30-04-s1': G(
      'Take the rabbi his supper in the study house.',
      'Dvora has wrapped it in a cloth. He will forget to eat it.',
    ),
    'a30-04-s2': G(
      'Listen to what the rabbi asks of you.',
      'He is at the study house door with two men.',
    ),
    'a30-04-s3': G('Light the lantern in Avram’s window.', 'The lantern hangs by the door.'),
  },
  [
    sc(
      'a30-04-ask',
      [
        N('Dvora sends you across the lane with bread and soup.'),
        N('The rabbi sits very still with his hand over his eyes.'),
        LO('I asked how to keep my town safe. That was all.', 'think'),
        LO('The answer is: be patient, be careful, be kind, and wait.'),
        N('Your Nubbin pushes the soup an inch closer. It is a good suggestion.'),
      ],
      [
        ask(
          3,
          'sel',
          'calm waiting',
          'CASEL: Self-management',
          [N('The rabbi has to wait. What can help us wait?')],
          [
            o(
              'Slow breaths',
              [N('Yes. In through the nose. Out through the mouth. Slowly.')],
              true,
            ),
            o('Shouting', [N('Shouting makes waiting feel harder. Slow breaths help.')]),
          ],
          'Practised the idea that slow breathing helps while we wait.',
        ),
      ],
    ),
    sc(
      'a30-04-ask-done',
      [
        N('In the morning the bowl is empty.'),
        N('The rabbi is asleep at the table, with his cheek on a book.'),
      ],
      [
        ask(
          1,
          'health',
          'food and sleep help bodies',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('The rabbi ate his soup and had a sleep. What do bodies need to stay strong?')],
          [
            o('Food and sleep', [N('Yes! Food, water and sleep keep us strong.')], true),
            o('Only sweets', [N('Sweets are a treat. Bodies need good food and sleep.')]),
          ],
          'Named food and sleep as things bodies need.',
        ),
      ],
    ),
    sc(
      'a30-04-helpers',
      [
        N('By noon the rabbi looks calm. Two men stand beside him.'),
        N('Isaac is broad and quiet. Jacob is thin and quick.'),
        LO('Isaac, Jacob: be ready tonight. Wear old clothes.'),
        LO('Keep a lantern lit in Avram’s window. Do not follow us.', 'soft'),
      ],
      [
        ask(
          1,
          'literacy',
          'telling characters apart',
          'RL.K.3',
          [N('Isaac is broad and quiet. Jacob is thin and quick. Which one is quick?')],
          [
            o('Jacob', [N('Yes! Jacob is thin and quick.')], true),
            o('Isaac', [N('Isaac is broad and quiet. Jacob is the quick one.')]),
          ],
          'Told two characters apart by how they are described.',
        ),
      ],
      [
        ch('promise', 'I’ll keep it lit.', [
          LO('Thank you. A light someone kept is a kind thing.', 'soft'),
        ]),
        ch('why', 'Ask where they are going.', [
          JA('To the river!', 'shock'),
          LO('Well. To the river. It is no secret where rivers are.', 'happy'),
        ]),
        ch('nod', 'Just nod.', [N('The rabbi nods back, once.')]),
      ],
    ),
    sc(
      'a30-04-lantern',
      [
        N('Dvora lights the lantern, and you carry it up to the loft window.'),
        N('The flame stands up straight in the still air.'),
        RI('Who is it for?'),
        N('You tell her it is for the rabbi. She sits down beside it to mind it.'),
        N('Your Nubbin sits too, and copies her exactly.'),
      ],
      [
        doit(
          1,
          'science',
          'moving air',
          'ELOF: Scientific Reasoning',
          'edu:feel:air:blow',
          [
            N('The air is still, so the flame stands straight.'),
            N('(Blow softly on your hand, and feel the air move.)'),
          ],
          'Felt moving air on their hand, and learned that still air keeps a flame steady.',
        ),
      ],
    ),
    sc(
      'a30-04-complete',
      [
        N('At midnight the study house door opens softly.'),
        N('Three shapes go down the lane towards the river.'),
        N('Rivka is still awake, and watches the lantern.'),
        RI('I will mind it. You are not very good at not following, are you?'),
      ],
      [
        ask(
          1,
          'maths',
          'count to 3',
          'K.CC.B.4',
          [N('The rabbi, Isaac and Jacob go to the river. How many shapes? (Count them.)')],
          [
            o('3', [N('Yes! One, two, three.')], true),
            o('2', [N('Count again: the rabbi, Isaac, Jacob. That is 3.')]),
            o('5', [N('One, two, three. Just three people.')]),
          ],
          'Counted three people to say how many.',
        ),
      ],
    ),
  ],
);

// ================================================================== A30-5 Clay from the River
const A5: EduQuest = quest(
  'a30-05',
  'Clay from the River',
  {
    'a30-05-s1': G(
      'Follow the three of them to the river, at a distance.',
      'Keep well back. Stop at the willows above the bank.',
    ),
    'a30-05-s2': G(
      'Let your Nubbin help, if they will have it.',
      'Your Nubbin has made up its own mind. Stay on the bank.',
    ),
  },
  [
    sc(
      'a30-05-follow',
      [
        N('You follow at a distance, through the sleeping lanes, out to the river.'),
        N('The river is wide and dark, and it talks to itself.'),
        N('You stop in the willows. Your Nubbin holds on to your trouser leg.'),
        N('Below you, three people kneel on the mud with their sleeves rolled up.'),
        N('They dig clay out of the river bank with their hands.'),
      ],
      [
        ask(
          4,
          'social-studies',
          'places give people what they need',
          'D2.Geo.2.K-2',
          [N('The three people take clay from the river bank. Where does the clay come from?')],
          [
            o('From the river bank', [N('Yes! Rivers leave soft clay on their banks.')], true),
            o('From the sky', [N('Not from the sky. The clay is in the mud by the river.')]),
          ],
          'Learned that people use what a place gives them, like clay from a river bank.',
        ),
      ],
      [
        ch('closer', 'Go a little closer.', [
          N('You go one tree closer, and stop. It feels like walking into a quiet room.'),
        ]),
        ch('stay', 'Stay where you are.', [
          N('You stay in the willows. Your Nubbin looks up at you, thinking.'),
        ]),
      ],
    ),
    sc(
      'a30-05-clay',
      [
        N('The clay on the ground makes a shape: a head, shoulders, two long arms.'),
        N('It is as long as a door. The three people smooth it, like making bread.'),
        N(
          'The wind dries the clay. Isaac carries water up from the river in cupped hands, but it is slow.',
        ),
        N('Your Nubbin runs down the bank, fills its cheeks, and trots back.'),
        N('Splish! It wets the clay, very carefully. Then it goes again, and again.'),
      ],
      [
        ask(
          2,
          'science',
          'clay is soft when wet and hard when dry',
          '2-PS1-1',
          [N('Wet clay is soft. What happens when the wind dries it?')],
          [
            o('It gets hard', [N('Yes! Dry clay is hard. Wet clay is soft.')], true),
            o('It gets bigger', [
              N('It does not grow. Dry clay gets hard, so it needs water to stay soft.'),
            ]),
          ],
          'Noticed that clay is soft when wet and hard when dry.',
        ),
      ],
    ),
    sc(
      'a30-05-clay-done',
      [
        N('Near dawn Isaac carries your Nubbin up the bank himself.'),
        N('It is muddy up to its ears.'),
        IS('Go home. He knows you are here.', 'soft'),
      ],
      [
        ask(
          1,
          'sel',
          'feeling proud after helping',
          'CASEL: Self-awareness',
          [N('Your Nubbin helped all night. How might it feel now?')],
          [
            o('Proud', [N('Yes! Helping can make us feel proud.')], true),
            o('Grumpy', [N('It might be a bit tired, but helping usually feels proud.')]),
          ],
          'Named the feeling of pride after helping.',
        ),
      ],
    ),
    sc(
      'a30-05-complete',
      [
        N('You go home first. The lantern is still burning in the loft window.'),
        N('Rivka is asleep beside it. She has been minding it all night.'),
        N('You put a blanket over her. Your Nubbin curls up on the end of it.'),
      ],
      [
        ask(
          1,
          'literacy',
          'the meaning of mind',
          'L.2.4',
          [N('Rivka was minding the lantern. What does it mean to mind a lantern?')],
          [
            o('To look after it', [N('Yes! To mind something means to look after it.')], true),
            o('To shout at it', [N('No shouting. To mind something means to look after it.')]),
          ],
          'Learned that mind can mean look after.',
        ),
      ],
    ),
  ],
);

// ================================================================== A30-6 The Word
const A6: EduQuest = quest(
  'a30-06',
  'The Word',
  {
    'a30-06-s1': G(
      'Go back down to the river when the rabbi sends for you.',
      'Jacob is at the door. Go with him.',
    ),
    'a30-06-s2': G(
      'Watch the rabbi write three letters.',
      'Stand where he puts you. Your Nubbin will want to be nearer.',
    ),
  },
  [
    sc(
      'a30-06-tellings',
      [
        N('Before sunrise, Jacob knocks at the door. The rabbi wants you at the river.'),
        LO('You followed. I thought you would. Come and see, and be quiet a little while.'),
        N('The clay man lies on the bank under the grey sky. He is as long as a door.'),
        N(
          'Some people tell this story one way, and some tell it another. Stories grow when they are told many times.',
        ),
        LO(
          'Here, I will write one plain word on his brow: truth. A word anyone can read. Three letters.',
        ),
      ],
      [
        ask(
          3,
          'social-studies',
          'how stories travelled long ago',
          'D2.His.2.K-2',
          [N('Long ago there were few books. How did most stories travel?')],
          [
            o(
              'By people telling them aloud',
              [N('Yes! People told stories to each other, again and again.')],
              true,
            ),
            o('By computer', [N('There were no computers then. People told stories aloud.')]),
          ],
          'Learned that stories travelled by being told aloud, so they changed a little each time.',
        ),
      ],
      [
        ch('why', 'Why truth?', [
          LO(
            'A guard should stand on something true. And anyone in the lane can read it.',
            'happy',
          ),
        ]),
        ch('quiet', 'Say nothing, as he asked.', [
          LO('Good. You were listening. That is most of it.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a30-06-letters',
      [
        LO('Hebrew is read from the right. So the first letter goes on the right.'),
        LO('Alef, א. It is a quiet letter. It makes no sound of its own.'),
        OR('Alef. The quiet one goes first.'),
        LO('Mem, מ, from near the middle. And tav, ת, the very last letter.'),
        N('Three letters in a row, from right to left: אמת.'),
        LO('Emet. That means truth. Truth is when something is real and honest.'),
        OR('(Put your finger on the right, and slide it left: alef, mem, tav.)'),
        N('The clay man opens his eyes. He sits up slowly, and waits to be told what to do.'),
        LO('Get up, then, my friend. We will walk home.', 'soft'),
      ],
      [
        doit(
          6,
          'literacy',
          'three Hebrew letters, read from right to left',
          'ELOF: Literacy',
          'edu:point:letters:alef-mem-tav',
          [OR('Point to alef, then mem, then tav, moving your finger from right to left.')],
          'Pointed to alef, mem and tav from right to left, and heard that emet means truth.',
        ),
      ],
    ),
    sc(
      'a30-06-letters-done',
      [
        N('He stands up, a head taller than Isaac, with his hands open.'),
        N('There were three letters on his brow: alef, mem, tav.'),
        JA('What do we call him?'),
        LO('Josef. A good plain name.'),
      ],
      [
        ask(
          1,
          'maths',
          'count to 3',
          'K.CC.B.5',
          [N('(Count the letters on his brow: alef, mem, tav.) How many letters are there?')],
          [
            o('3', [N('Yes! Three letters: one, two, three.')], true),
            o('2', [N('Count with your finger: alef is one, mem is two, tav is three!')]),
            o('4', [N('Count again: one, two, three. Three letters.')]),
          ],
          'Counted three letters to say how many.',
        ),
      ],
    ),
    sc(
      'a30-06-complete',
      [
        N('You walk back in the first light with the rabbi and a clay man.'),
        N('Your Nubbin walks one step behind the clay man, like a duckling.'),
        N('By noon the children of the lane have met him. They call him Yossele.'),
        LO('He has a name the children gave him. That is worth more than mine.', 'happy'),
      ],
      [
        ask(
          3,
          'sel',
          'welcoming someone new',
          'CASEL: Relationship skills',
          [N('Yossele is new in the lane. How could you welcome someone new?')],
          [
            o(
              'Say hello and share',
              [N('Yes! A hello and a smile help new people feel welcome.')],
              true,
            ),
            o('Ignore them', [N('Ignoring makes new people feel lonely. A hello is kinder.')]),
          ],
          'Talked about kind ways to welcome someone new.',
        ),
      ],
    ),
  ],
);

// ================================================================== A30-7 Yossele’s Work
const A7: EduQuest = quest(
  'a30-07',
  'Yossele’s Work',
  {
    'a30-07-s1': G(
      'Watch Yossele at his work.',
      'He is in the courtyard. Your Nubbin is already a step behind him.',
    ),
    'a30-07-s2': G(
      'Stop the kitchen flooding.',
      'Bail, mop, and fetch the rabbi. Yossele will not stop on his own.',
    ),
    'a30-07-s3': G(
      'Give Yossele his standing order.',
      'The rabbi asks you. Choose what Yossele does when no one has told him anything.',
    ),
  },
  [
    sc(
      'a30-07-chores',
      [
        N('Yossele lives in the rabbi’s house now. He fetches water, chops wood and sweeps.'),
        N('He never speaks, and he never gets tired.'),
        AV('Told to sweep the step, he sweeps the step. Only the step!', 'happy'),
        N('Everywhere he goes, your Nubbin goes too, one step behind.'),
      ],
      [
        ask(
          1,
          'social-studies',
          'life in the past and today',
          'D2.His.2.K-2',
          [
            N(
              'In Prague long ago, people fetched water from a well. Where does your water come from now?',
            ),
          ],
          [
            o(
              'From a tap',
              [N('Yes! Most of us turn on a tap. Long ago, people carried water.')],
              true,
            ),
            o('From a cloud, by hand', [
              N('Rain comes from clouds, but at home water comes through pipes to a tap.'),
            ]),
          ],
          'Compared how people got water long ago (a well) and today (a tap).',
        ),
      ],
    ),
    sc(
      'a30-07-flood',
      [
        DV('Yossele, fill the barrel for me, there is a dear.'),
        N('He fills the barrel. Then he fills it again, because nobody said stop.'),
        N('Water runs over the rim, across the kitchen, and out into the lane.'),
        N('You bail with a pan. Your Nubbin bails with its cheeks, which does not help at all.'),
        N('A hen floats past on a cabbage. Your Nubbin climbs into the bread trough and sails.'),
        DV('Yossele! That is enough!', 'shock'),
        N('He does not stop. She is not the one who made him.'),
        N('Then the rabbi says, “Stop,” and Yossele puts the bucket down.'),
      ],
      [
        ask(
          5,
          'maths',
          'taking away',
          'K.OA.A.2',
          [N('The barrel holds 3 buckets. Yossele poured 5. How many buckets too many?')],
          [
            o('2', [N('Yes! Five take away three is two.')], true),
            o('3', [N('Let us count: five buckets, take away three. Two are left over.')]),
            o('5', [N('Five is how many he poured. Take away the three that fit: two too many.')]),
          ],
          'Took away 3 from 5 in a story about buckets.',
        ),
      ],
    ),
    sc(
      'a30-07-flood-done',
      [
        DV('My kitchen. My good floor. My onions are floating!', 'sad'),
        N('She hands you an apron. It is too late to keep dry, but it is kindly meant.'),
        DV('Keep it. You have earned it.'),
      ],
      [
        ask(
          0,
          'literacy',
          'the meaning of float',
          'L.2.4',
          [DV('Onions float. That means they sit on top of the water. What else floats?')],
          [
            o('A duck', [DV('Yes! Ducks float on top of the water.')], true),
            o('A stone', [DV('Stones sink to the bottom. A duck floats on top.')]),
          ],
          'Learned the word float and named something that floats.',
        ),
      ],
    ),
    sc(
      'a30-07-order',
      [
        N('That evening the rabbi sits on the step with you, and watches Yossele sweep.'),
        LO('He does what he is told, and only that. So when nobody tells him anything, he waits.'),
        LO(
          'A thing that only waits is lonely. He should have something of his own to do.',
          'think',
        ),
        LO('One standing order, for when no one has told him anything. You choose it.'),
        N('Yossele has stopped sweeping. Your Nubbin, a step behind, has stopped too.'),
      ],
      [
        ask(
          3,
          'sel',
          'a kind way to help',
          'CASEL: Responsible decision-making',
          [N('Yossele wants to help well. What is a kind way to help someone?')],
          [
            o('Ask what they need', [N('Yes! Asking first is a kind way to help.')], true),
            o('Do everything at once', [N('That could make a big mess! Asking first is kinder.')]),
            o('Do nothing at all', [N('Helpers help. A good helper asks, then does.')]),
          ],
          'Thought about asking before helping.',
        ),
      ],
      [
        ch(
          'safe',
          'Keep everyone safe.',
          [
            LO('Keep everyone safe. That is what I made him for.', 'soft'),
            N('Yossele looks down the lane, at every door, one by one.'),
          ],
          { 'a30-order': 'safe' },
        ),
        ch(
          'help',
          'Help where you are asked.',
          [
            LO('Help where you are asked. Dvora will be glad.', 'happy'),
            N('Yossele picks up the broom again, and waits to be asked.'),
          ],
          { 'a30-order': 'help' },
        ),
        ch(
          'sit',
          'Sit with the little ones.',
          [
            LO('The little ones. The children, and this one. Hm.', 'think'),
            N('Yossele looks down at your Nubbin, and sits beside it on the step.'),
          ],
          { 'a30-order': 'sit' },
        ),
      ],
    ),
    sc(
      'a30-07-complete',
      [
        N('Dvora hangs the onions up to dry, all in a row.'),
        AV('He fills barrels very well. Nobody can say he does not.'),
        N('You go up to the loft in your new apron, still damp.'),
      ],
      [
        ask(
          0,
          'science',
          'what helps wet things dry',
          'ELOF: Scientific Reasoning',
          [N('The wet onions hang up to dry. What helps wet things dry?')],
          [
            o('Warm air and wind', [N('Yes! Warm, moving air dries wet things.')], true),
            o('Snow', [N('Snow is cold and wet. Warm air and wind dry things.')]),
          ],
          'Learned that warm, moving air helps wet things dry.',
        ),
      ],
    ),
  ],
);

// ================================================================== A30-8 The Night Guard
const A8: EduQuest = quest(
  'a30-08',
  'The Night Guard',
  {
    'a30-08-s1': G(
      'Walk the night round with Yossele.',
      'Every lane, every gate, once. Your Nubbin will try to keep up.',
    ),
    'a30-08-s2': G(
      'Stand with Yossele at the end of the street.',
      'He knows where to stand. Stand behind him.',
    ),
  },
  [
    sc(
      'a30-08-round',
      [
        N('At night Yossele walks the lanes of the town, from gate to gate.'),
        N('Tonight you walk with him. The cobbles are wet, and the houses are dark.'),
        N('At every gate he puts his hand flat on the wood.'),
        N('Your Nubbin keeps up for three lanes. On the fourth lane it sits down.'),
        N('You lift it onto his shoulder. It holds his ear and falls asleep.'),
      ],
      [
        doit(
          3,
          'maths',
          'count to 4',
          'K.CC.B.5',
          'edu:count:lanes:4',
          [N('(Count the lanes with Yossele: one, two, three, four. Nubbin sits on the fourth!)')],
          'Counted four lanes, saying one number for each lane.',
        ),
      ],
    ),
    sc(
      'a30-08-street-end',
      [
        N('At the end of the street, lantern light shines beyond the gate. Voices, far away.'),
        N('Yossele stands in the middle of the street, as tall as a door.'),
        N('He does nothing at all. Your Nubbin sleeps on his shoulder.'),
        N('The voices stop. Then the lanterns turn and go away up the hill.'),
        N('Nobody is hurt. Yossele stays until the last light is gone.'),
      ],
      [
        ask(
          3,
          'sel',
          'calm helps others feel safe',
          'CASEL: Social awareness',
          [N('Yossele stood still and calm. Calm people help others feel…what?')],
          [
            o('Safe', [N('Yes! A calm friend helps us feel safe.')], true),
            o('More scared', [N('Calm helps people feel safe, not scared.')]),
          ],
          'Talked about how staying calm can help other people feel safe.',
        ),
      ],
      [
        ch('behind', 'Stand close behind him.', [
          N('He is warm, like a wall at the end of a sunny day.'),
        ]),
        ch('foot', 'Hold your Nubbin’s dangling foot.', [
          N('Your Nubbin curls its toes round your finger in its sleep.'),
        ]),
      ],
    ),
    sc(
      'a30-08-complete',
      [
        N('By breakfast, everybody says they slept well.'),
        AV('I slept like a stone! I dreamt about keys.', 'happy'),
        LO('He did not have to do anything. That is the best kind of guard.', 'soft'),
        N('Avram gives you a small lantern with a horn window. Your Nubbin will not give it back.'),
      ],
      [
        ask(
          1,
          'health',
          'sleep helps our bodies',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('Avram slept well, and he feels better. Why is sleep good for us?')],
          [
            o(
              'It helps our bodies and brains rest',
              [N('Yes! Sleep helps us rest and grow.')],
              true,
            ),
            o('It makes us tired', [N('Sleep is how we get un-tired! It helps our bodies rest.')]),
          ],
          'Learned that sleep helps bodies and brains rest and grow.',
        ),
      ],
    ),
  ],
);

// ================================================================== A30-9 Fridays
const A9: EduQuest = quest(
  'a30-09',
  'Fridays',
  {
    'a30-09-s1': G(
      'Find Yossele before the Sabbath comes in.',
      'Friday afternoon. Everyone is hurrying. Yossele is not.',
    ),
    'a30-09-s2': G('Help the rabbi lay Yossele down to rest.', 'Gently. Support his head.'),
  },
  [
    sc(
      'a30-09-friday',
      [
        N('Friday afternoon. The whole lane hurries: floors swept, pots on the fire.'),
        N('Hannah’s plaited loaves go past in baskets, shining.'),
        DV('The Sabbath starts at sunset. Find Yossele before then, please!'),
        N('Your Nubbin knows exactly where he is. It runs, and you follow.'),
        N('You find him at the caretaker’s door, with the children.'),
        N('The rabbi is already coming down the lane.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'a family tradition: the Sabbath',
          'D2.His.2.K-2',
          [DV('Everyone is getting ready for the Sabbath. The Sabbath is a day of…what?')],
          [
            o(
              'Rest',
              [DV('Yes! The Sabbath is a day to rest, from Friday evening to Saturday night.')],
              true,
            ),
            o('Racing', [DV('No racing! It is a day of rest, after all the hurrying on Friday.')]),
          ],
          'Learned that the Sabbath is a day of rest that begins on Friday evening.',
        ),
      ],
    ),
    sc(
      'a30-09-rest',
      [
        LO('Yossele. Come and lie down.'),
        N('He lies on a blanket in the back room, as long as a door. You hold his head.'),
        LO('Every week, before the Sabbath, everything rests. Even Yossele.'),
        N('The rabbi rubs out the first letter, the alef. It comes away like flour.'),
        N('Two letters are left on the brow.'),
        N('The warmth goes out of him, slowly, like a stove at night. Now he is only clay.'),
        N('Your Nubbin puts its paw on his arm, and keeps it there.'),
      ],
      [
        ask(
          4,
          'literacy',
          'recognising alef, the first letter',
          'ELOF: Literacy',
          [
            OR(
              'The rabbi rubbed out a letter. Which one: alef, the quiet one that goes first, or tav, the last?',
            ),
          ],
          [
            o(
              'Alef',
              [OR('Yes! Alef, the quiet one on the right. Three letters, and now two.')],
              true,
            ),
            o('Tav', [
              OR('Tav is the last letter, on the left. He rubbed out alef, the first one.'),
            ]),
          ],
          'Found alef, the first Hebrew letter, as the one rubbed out.',
        ),
      ],
      [
        ch('blanket', 'Pull the blanket up over him.', [
          LO('Yes. I do that too. I do not know who it is for.', 'soft'),
        ]),
        ch('ask', 'Does he know?', [
          LO('I do not know. He is made of clay, and clay is not alive the way you are.', 'think'),
        ]),
      ],
    ),
    sc(
      'a30-09-rest-done',
      [
        N('On Saturday night, when three stars are out, the rabbi writes the alef again.'),
        N('Yossele sits up and looks around.'),
        N('Your Nubbin waits by the door. It falls in a step behind him.'),
      ],
      [
        ask(
          0,
          'maths',
          'taking away',
          'K.OA.A.1',
          [N('Emet has three letters. The rabbi rubbed out one. How many were left?')],
          [
            o('2', [N('Yes! Three take away one is two.')], true),
            o('1', [
              N('Let us count: alef, mem, tav. Take away alef. Mem and tav are left. That is two.'),
            ]),
            o('3', [N('Three was before. He rubbed one out, so two were left.')]),
          ],
          'Took 1 away from 3 using letters.',
        ),
      ],
    ),
    sc(
      'a30-09-complete',
      [
        N('It happens every Friday after that. You learn to hold his head, gently.'),
        LO('You have good hands for it. Slow ones.', 'soft'),
        N('Dvora lights the candles. The lane goes quiet, as if the whole town has sat down.'),
      ],
      [
        ask(
          1,
          'sel',
          'being gentle and slow',
          'CASEL: Self-management',
          [LO('You have slow hands. When is it good to be slow and gentle?')],
          [
            o(
              'When holding something small or fragile',
              [LO('Yes! Slow, gentle hands are kind.')],
              true,
            ),
            o('Always rushing', [
              LO('Rushing can break things. Slow and gentle is kind with fragile things.'),
            ]),
          ],
          'Talked about when to be slow and gentle.',
        ),
      ],
    ),
  ],
);

// ================================================================== A30-10 The Forgotten Friday
const A10: EduQuest = quest(
  'a30-10',
  'The Forgotten Friday',
  {
    'a30-10-s1': G(
      'Get through Friday afternoon. The rabbi has been called away.',
      'Help in the house. The rabbi will be back before sunset.',
    ),
    'a30-10-s2': G('Wait in the synagogue courtyard as the Sabbath comes in.', 'Watch the lane.'),
    'a30-10-s3': G('Run for the rabbi.', 'To the synagogue door. Avram is there.'),
  },
  [
    sc(
      'a30-10-called',
      [
        N('Another Friday. You are helping Dvora when a boy runs up the lane.'),
        BO('Rabbi! A baby is coming, and the family is worried. They asked for you!'),
        LO('Of course I will come.'),
        N('He goes at once, with his coat half on.'),
        N('Yossele stands in the courtyard, waiting. Nobody has told him anything.'),
      ],
      [
        ask(
          2,
          'science',
          'parents look after their young',
          '1-LS1-2',
          [N('A new baby is small and cannot do things alone. Who looks after a new baby?')],
          [
            o('Parents and family', [N('Yes! Grown-ups feed, hold and keep babies warm.')], true),
            o('Nobody', [N('Babies need grown-ups to feed them and keep them warm.')]),
          ],
          'Learned that grown-ups look after young babies.',
        ),
      ],
      [
        ch('ask', 'What about Yossele?', [
          N('The rabbi is already round the corner. Nobody hears but you.'),
        ]),
        ch('pots', 'Help Dvora with the pots.', [
          N('You scrub, and stir, and fetch. The afternoon goes quickly.'),
        ]),
      ],
    ),
    sc(
      'a30-10-called-done',
      [
        DV('He will be back. He has never been late for the Sabbath.'),
        N('You trust Dvora. She sounds sure.'),
      ],
      [
        ask(
          0,
          'sel',
          'trusting someone who keeps their word',
          'CASEL: Relationship skills',
          [N('Dvora knows the rabbi keeps his promises. How does that make her feel?')],
          [
            o('Calm and trusting', [N('Yes! We feel calm with people who keep their word.')], true),
            o('Cross', [N('She is not cross. People who keep their word help us feel calm.')]),
          ],
          'Talked about trusting someone who keeps their promises.',
        ),
      ],
    ),
    sc(
      'a30-10-psalm',
      [
        N('The sun is low. The baby has come, and the rabbi has hurried to the synagogue.'),
        N('From inside comes a murmur. The grown-ups are saying the Sabbath song.'),
        N('You wait in the courtyard with the children. The Sabbath is coming in, like a tide.'),
        RI('He did not lay Yossele down. Did he?', 'shock'),
        N(
          'The rabbi had forgotten. Yossele had not been put to rest, and the day of rest had come.',
        ),
        N('Down the lane, in the rabbi’s courtyard, something begins to move.'),
      ],
      [
        doit(
          1,
          'literacy',
          'clap the syllables of a word',
          'RF.K.2',
          'edu:clap:syllables:sabbath',
          [N('(Clap the word Sabbath with me: Sab-bath.)'), N('(How many claps? Two!)')],
          'Clapped the two syllables of the word Sabbath.',
        ),
      ],
    ),
    sc(
      'a30-10-fetch',
      [
        N('You run to the synagogue door, where Avram waits with his keys.'),
        N('Your heart goes thump, thump, thump, you are running so fast.'),
        AV('What is it?'),
        N('You do not have to say. He looks down the lane and goes in.'),
        N('The rabbi runs out, with no coat. He goes straight to Yossele and reaches up.'),
        N('He rubs out the alef. The great clay man stands still, and then falls, soft as sand.'),
        N('Nobody is hurt. Things are broken, and the lane is messy, but nobody is hurt.'),
      ],
      [
        ask(
          1,
          'health',
          'what running does to your heart',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('You ran very fast. What does your heart do after running?')],
          [
            o(
              'Beats faster',
              [N('Yes! Fast running makes your heart go thump, thump, thump.')],
              true,
            ),
            o('Stops', [N('It never stops! It beats faster when we run.')]),
          ],
          'Noticed that running makes the heart beat faster.',
        ),
      ],
    ),
    sc(
      'a30-10-complete',
      [
        N('The lane is quiet. The clay lies in a long heap across the cobbles.'),
        N('The rabbi stands beside it, out of breath, with his hand on the clay.'),
        LO('I forgot. A baby was born, and I was so glad, and I forgot him.', 'sad'),
        LO('Come. The Sabbath does not wait, and neither should we.', 'soft'),
      ],
      [
        ask(
          2,
          'sel',
          'owning up to a mistake',
          'CASEL: Responsible decision-making',
          [N('The rabbi made a mistake, and he said so. What can we do when we make a mistake?')],
          [
            o(
              'Say so, and try to put it right',
              [N('Yes! Owning up and putting things right is brave.')],
              true,
            ),
            o('Hide it', [N('Hiding makes it harder. Saying so and fixing it is braver.')]),
          ],
          'Talked about owning up to a mistake and putting it right.',
        ),
      ],
    ),
  ],
);

// ================================================================== A30-11 Twice
const A11: EduQuest = quest(
  'a30-11',
  'Twice',
  {
    'a30-11-s1': G('Wait at the synagogue door while they begin again.', 'Sit on the step.'),
    'a30-11-s2': G('Go home to the Sabbath table.', 'Dvora has kept your places.'),
  },
  [
    sc(
      'a30-11-again',
      [
        N('The rabbi goes back into the synagogue. The door closes.'),
        N('You sit on the step. Inside, they begin the Sabbath song again from the very start.'),
        N('It comes through the old wall as a low murmur, like rain.'),
        N('People say they still say it twice in that synagogue, to this day.'),
        N('Your Nubbin leans against you. It shivers a little, though the evening is warm.'),
      ],
      [
        doit(
          2,
          'literacy',
          'repeated sounds and rhythm',
          'RL.2.4',
          'edu:say:sound-word:plip-plop',
          [N('Rain goes plip, plop, plip, plop. (Say it twice with the song, soft and slow.)')],
          'Said a rhythmic sound-word twice, like a repeated line in a song.',
        ),
      ],
    ),
    sc(
      'a30-11-table',
      [
        N('At Avram’s house the candles are lit, and the table has a white cloth.'),
        N('Hannah’s plaited loaf sits under its cover. Avram says the blessings.'),
        SH('Is Yossele all right?'),
        DV(
          'Tomorrow night we will talk about Yossele. Tonight is the Sabbath, and we rest.',
          'soft',
        ),
        N('Shmuel thinks about this, and nods, and eats his bread.'),
      ],
      [
        ask(
          3,
          'social-studies',
          'the Sabbath as a day of rest',
          'D2.His.2.K-2',
          [N('Dvora says that on the Sabbath, we rest even from worrying. What is the Sabbath?')],
          [
            o('A day of rest', [N('Yes! A day to rest and be together.')], true),
            o('A day of work', [N('No work on the Sabbath! It is a day of rest.')]),
          ],
          'Reinforced that the Sabbath is a day of rest and being together.',
        ),
      ],
      [
        ch('eat', 'Eat, and say nothing.', [
          N('The bread is soft and sweet, and better than any you ate all week.'),
        ]),
        ch('share', 'Give your Nubbin half your bread.', [
          N('Your Nubbin eats it slowly, as if it knows this is a special loaf.'),
        ]),
      ],
    ),
    sc(
      'a30-11-complete',
      [
        N('Late, the rabbi comes by, and looks in at the window.'),
        LO('Good. Rest. That is the whole of it.', 'soft'),
        N('He goes home slowly, and walks round the place where the clay is.'),
      ],
      [
        ask(
          1,
          'sel',
          'what helps us feel calm',
          'CASEL: Self-management',
          [N('After a hard day, what helps you feel calm?')],
          [
            o(
              'Rest, and being near people I love',
              [N('Yes! Rest and company help us feel calm.')],
              true,
            ),
            o('Rushing about', [N('Rushing makes us more tired. Rest and company help.')]),
          ],
          'Talked about what helps us feel calm after a hard day.',
        ),
      ],
    ),
  ],
);

// ================================================================== A30-12 The Attic
const A12: EduQuest = quest(
  'a30-12',
  'The Attic',
  {
    'a30-12-s1': G(
      'Hold the lantern at the foot of the attic steps.',
      'Saturday night, once three stars are out.',
    ),
    'a30-12-s2': G(
      'Stay with your Nubbin at the foot of the wall.',
      'It will not come away yet. Sit down next to it, and wait.',
    ),
  },
  [
    sc(
      'a30-12-stars',
      [
        N('Saturday night. Three stars are out over the steep roof. The Sabbath is over.'),
        N('The rabbi, Isaac and Jacob carry the clay up the lane on a door.'),
        AV('The attic. I have the key I never knew the door for.', 'soft'),
        N('It fits! You hold the lantern at the foot of the steps.'),
        N('Up there, worn-out books lie in rows. They lay the clay among them, gently.'),
        N('People say the clay is up there, resting among the old books.'),
      ],
      [
        ask(
          0,
          'science',
          'stars come out at night',
          '1-ESS1-1',
          [N('Three stars are out, and the Sabbath is over. When do we see stars?')],
          [
            o(
              'At night',
              [N('Yes! Stars shine all day, but we only see them when the sky is dark.')],
              true,
            ),
            o('At lunchtime', [
              N('The Sun is too bright at lunchtime. We see stars when the sky is dark.'),
            ]),
          ],
          'Learned that we see stars when the sky is dark, at night.',
        ),
      ],
    ),
    sc(
      'a30-12-steps',
      [
        LO('Nobody is to go up there. Let him rest.'),
        N('Isaac and Jacob take the steps away. The attic door is high in the wall.'),
        N('Your Nubbin sits at the foot of the wall and looks up.'),
        N('It does not move when you call. So you sit down next to it, and wait.'),
      ],
      [
        ask(
          0,
          'social-studies',
          'treating old books with respect',
          'D2.Civ.8.K-2',
          [
            N(
              'The attic is where worn-out holy books are put to rest. Why not put them in the bin?',
            ),
          ],
          [
            o('People respect them', [N('Yes! People treat words they love with respect.')], true),
            o('There is no room', [
              N('It is about respect, not room. People treat special books with care.'),
            ]),
          ],
          'Learned that worn-out holy books are kept respectfully, not thrown away.',
        ),
      ],
      [
        ch('arm', 'Put your arm round it.', [N('It leans into you, and keeps looking up.')]),
        ch('call', 'Call it once more, softly.', [
          N('It looks at you, and back at the door. It is not ready yet.'),
        ]),
      ],
    ),
    sc(
      'a30-12-steps-done',
      [
        N('Near midnight the rabbi comes out with a blanket.'),
        N('He sits down on the other side of your Nubbin.'),
        LO('I thought there would be someone here. I hoped so.', 'soft'),
        N('The three of you sit a long time. Then your Nubbin gets up, and lets you take it home.'),
      ],
      [
        ask(
          2,
          'sel',
          'what helps a sad friend',
          'CASEL: Relationship skills',
          [N('Your Nubbin feels sad. What helps a sad friend?')],
          [
            o('Sit beside them', [N('Yes! Sitting beside someone is a kind way to help.')], true),
            o('Tell them to hurry up', [N('Hurrying does not help. Sitting beside them does.')]),
          ],
          'Talked about sitting with a sad friend as a way to help.',
        ),
      ],
    ),
    sc(
      'a30-12-complete',
      [
        N('In the morning there is a little heap of river clay by the wall.'),
        N('Nobody sweeps it away. Not Avram, not Dvora, not anyone, all week.'),
      ],
      [
        ask(
          1,
          'literacy',
          'how characters respond to events',
          'RL.2.3',
          [N('Nobody swept the clay away. What does that tell us about how they felt?')],
          [
            o('They wanted to remember', [N('Yes! They wanted to remember Yossele.')], true),
            o('They were too lazy', [
              N('Not lazy. They kept the clay because they wanted to remember.'),
            ]),
          ],
          'Worked out what a character’s actions tell us about their feelings.',
        ),
      ],
    ),
  ],
);

// ================================================================== A30-13 What the Rabbi Says
const A13: EduQuest = quest(
  'a30-13',
  'What the Rabbi Says',
  {
    'a30-13-s1': G(
      'Sit with the rabbi on the study house bench.',
      'A week later. He has kept a place for you.',
    ),
    'a30-13-s2': G(
      'Go and see what Rivka has made for you.',
      'She is at the caretaker’s door, holding something behind her back.',
    ),
  },
  [
    sc(
      'a30-13-bench',
      [
        N('A week later the rabbi sits on a bench in the sun. He moves over to make room.'),
        LO('I think about my clay man a lot. He did what he was told, and only that.', 'think'),
        LO('A helper who only obeys cannot stop by himself. And hands forget.', 'sad'),
        LO('In Chełm, people say, a rabbi made a clay man before me. It grew and grew.'),
        LO('So he rubbed out the word, very gently. His clay man lay down to rest for good.'),
        LO('He had more sense than me. He did it before anyone had to run.'),
      ],
      [
        ask(
          3,
          'social-studies',
          'finding far-away places on a map',
          'D2.Geo.2.K-2',
          [
            N(
              'Chełm and Prague are two places, far apart. What do we use to find far-away places?',
            ),
          ],
          [
            o('A map', [N('Yes! A map shows where places are, even far away.')], true),
            o('A spoon', [N('A spoon is for soup! A map shows where places are.')]),
          ],
          'Learned that a map shows where far-apart places are, like Prague and Chełm.',
        ),
      ],
      [
        ch('baby', 'You were glad about the baby.', [
          LO('I was. I would forget again for her. That is the worst of it, and the best.', 'soft'),
        ]),
        ch('sit', 'Sit with him, and say nothing.', [
          N('So you sit. After a while he pats your knee twice.'),
        ]),
      ],
    ),
    sc(
      'a30-13-tile',
      [
        N('Rivka waits at the door with both hands behind her back. That means it is a present.'),
        RI('I took a little clay from outside the wall. Nobody said not to.'),
        N('She holds out a small square tile, with three wobbly letters on it.'),
        N('אמת, emet. Alef first, on the right.'),
        RI('There is a clay bird for your Nubbin, too. It has a fat tummy and no feet.'),
      ],
      [
        ask(
          2,
          'maths',
          'naming a square',
          'K.G.A.2',
          [N('Rivka’s tile has four sides, and all four are the same length. What shape is it?')],
          [
            o('A square', [N('Yes! Four equal sides make a square.')], true),
            o('A circle', [
              N('A circle is round with no corners. Four equal sides make a square.'),
            ]),
            o('A triangle', [N('A triangle has three sides. This tile has four: a square.')]),
          ],
          'Named a square from its four equal sides.',
        ),
      ],
    ),
    sc(
      'a30-13-complete',
      [
        N('Rivka walks you to the end of the lane. The page goes thin and brown.'),
        N('Behind you stands the steep roof, and high in its gable, the attic window.'),
        N('The attic shutter is shut and barred. It looks like a door holding itself shut.'),
        N('Your Nubbin looks up at the window for a long time. Then it takes your hand.'),
        N('You are back in the Grove. A clay tile is in your pocket, still cool.'),
      ],
      [
        ask(
          3,
          'sel',
          'holding hands makes us feel close',
          'CASEL: Relationship skills',
          [N('Your Nubbin takes your hand. Why do we hold hands with someone we love?')],
          [
            o('It helps us feel close and safe', [N('Yes! Holding hands says: I am here.')], true),
            o('To stop them running', [N('We hold hands to feel close, not to stop people.')]),
          ],
          'Talked about holding hands as a way to feel close and safe.',
        ),
      ],
    ),
  ],
);

// ================================================================== variants
/**
 * One EduScene per ATLAS_A30_VARIANTS entry (20 in all). Each variant’s domain differs from the
 * scenes either side of it, so the no-two-in-a-row rule holds on every path:
 * - a30-09-order-*   plays between a30-09-friday (social studies) and a30-09-rest (literacy)
 * - a30-10-grow-*    between a30-10-psalm (literacy) and a30-10-ember / a30-10-fetch (science / health)
 * - a30-10-ember     between the grow insert and a30-10-fetch; a30-10-ember-settle after fetch
 * - a30-margin-hazel after a30-12-complete (literacy), before a30-13-bench (social studies)
 * - a30-13-order-*   between a30-13-bench (social studies, or feelings in the reader band) and kept / tile
 * - a30-13-kept      between the order insert (literacy) and a30-13-tile (maths)
 * - a30-13-tile-paw  after a30-13-tile (maths); the complete scenes (feelings) follow
 * - the Grove keepsake scenes follow the complete scene (feelings), so they are literacy
 */
export const EDU_A30_SPROUT_VARIANTS: EduScene[] = [
  sc(
    'a30-01-ember',
    [
      N('Your Nubbin carries a little lantern with a red pebble inside. It glows.'),
      DV('A little glowing coal! Keep it away from my curtains, please.'),
      N('Your Nubbin hugs the lantern close, like something it has been lent.'),
    ],
    [
      ask(
        1,
        'science',
        'we see things when there is light',
        '1-PS4-2',
        [N('The pebble glows in the dim lane. What does a glow give us?')],
        [
          o(
            'Light, so we can see',
            [N('Yes! A glow is light. It helps us see in the dark.')],
            true,
          ),
          o('Rain', [N('A glow does not make rain. It makes light, so we can see.')]),
        ],
        'Learned that a glow gives light and we see things when there is light.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A30-9 order inserts
  sc(
    'a30-09-order-safe',
    [
      N('Yossele stands in the doorway, one arm across it like a gate.'),
      N('Shmuel and Mirele want to go out to see the bread. He will not let them.'),
      SH('He will not let us out! We only want to see the bread!', 'angry'),
      N('Gently, he lifts them back in, every time.'),
      DV('He does that at every door, all afternoon. They are very safe.', 'think'),
    ],
    [
      ask(
        4,
        'sel',
        'children need to play and go outside',
        'CASEL: Responsible decision-making',
        [N('Is it kind to keep children indoors all afternoon?')],
        [
          o(
            'No, children need to go out and play',
            [N('Yes! Safe is good. But children also need fresh air and play.')],
            true,
          ),
          o('Yes, always', [N('Safe is good, but children need to play outside too.')]),
        ],
        'Thought about the difference between being safe and being free to play.',
      ),
    ],
  ),
  sc(
    'a30-09-order-help',
    [
      N('Yossele sweeps the caretaker’s step. It is very clean.'),
      N('Neighbours keep asking, “Yossele, would you…” and he always does.'),
      RI('Look! He has moved six chairs that nobody asked him to move.'),
      N('The chairs stand in a neat row. He has started helping before he is asked.'),
    ],
    [
      doit(
        2,
        'maths',
        'count to 6',
        'K.CC.B.5',
        'edu:count:chairs:6',
        [N('(Count the chairs in the row: one, two, three, four, five, six.)')],
        'Counted six chairs in a row, one number for each chair.',
      ),
    ],
  ),
  sc(
    'a30-09-order-sit',
    [
      N('Yossele sits on the caretaker’s step, as long as the step.'),
      N('Shmuel is on one knee, and Mirele is on the other. Rivka leans on his arm.'),
      N('Your Nubbin is asleep in his lap, with its paws in the air.'),
      MI('He does not talk. But he listens properly!', 'happy'),
    ],
    [
      ask(
        3,
        'sel',
        'how it feels to be listened to',
        'CASEL: Relationship skills',
        [N('Rivka tells a long story, and Yossele listens. How does Rivka feel?')],
        [
          o('Happy and heard', [N('Yes! Being listened to feels lovely.')], true),
          o('Left out', [N('He is listening, so Rivka feels heard and happy.')]),
        ],
        'Talked about how it feels when someone listens to us.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A30-10 grow inserts
  sc(
    'a30-10-grow-safe',
    [
      N('Yossele goes down the lane, shutting every door with his hand flat on it.'),
      N('Each time he moves he is a little taller. The cobbles crack under his feet.'),
      N('He drags Hannah’s cart across the end of the lane. Nobody in, nobody out.'),
      RI('He has shut the whole lane in! The rabbi does not know!', 'shock'),
    ],
    [
      ask(
        3,
        'social-studies',
        'fairness: everyone should be free to come and go',
        'D2.Civ.8.K-2',
        [N('Is it fair to shut everyone inside their houses?')],
        [
          o(
            'No, people should be free to come and go',
            [N('Yes! Fair means everyone can go out and come home.')],
            true,
          ),
          o('Yes, it is fair', [N('Not fair! Everyone should be able to open their own door.')]),
        ],
        'Thought about fairness: everyone should be free to open their own door.',
      ),
    ],
  ),
  sc(
    'a30-10-grow-help',
    [
      N('Yossele does everything at once: sweeping, fetching water, chopping wood.'),
      N('Each time he moves he is a little taller. Two brooms snap in his hands.'),
      N('The water barrel splits. Nobody asked him. He just keeps helping.'),
      DV('My pots! He is scrubbing them into pieces!', 'shock'),
    ],
    [
      ask(
        2,
        'maths',
        'adding to 3',
        'K.OA.A.1',
        [N('Two brooms snapped and one barrel split. How many things are broken?')],
        [
          o('3', [N('Yes! Two and one make three.')], true),
          o('2', [N('Two brooms and one barrel. Two plus one is three.')]),
          o('1', [N('Count them all: two brooms, one barrel. That is three.')]),
        ],
        'Added 2 and 1 to make 3 in a story about broken things.',
      ),
    ],
  ),
  sc(
    'a30-10-grow-sit',
    [
      N('In the rabbi’s courtyard, Yossele sits with your Nubbin in his lap.'),
      N('He grows a little as you watch. The step cracks under him.'),
      N('He stands up. First, very carefully, he sets your Nubbin down on its feet.'),
      RI('He put it down first! Did you see?', 'shock'),
    ],
    [
      ask(
        3,
        'sel',
        'being gentle and careful with others',
        'CASEL: Social awareness',
        [N('Yossele put your Nubbin down gently before he went. That was careful and…what?')],
        [
          o('Kind', [N('Yes! Being gentle with someone small is kind.')], true),
          o('Rude', [N('Not rude! It was kind and careful.')]),
        ],
        'Named gentle, careful behaviour as kindness.',
      ),
    ],
  ),
  sc(
    'a30-10-ember',
    [
      N('In your Nubbin’s little lantern, the red pebble flares up, bright and hot.'),
      N('Your Nubbin holds the lantern out at arm’s length, and looks at you.'),
    ],
    [
      ask(
        1,
        'science',
        'a brighter light shows more',
        '1-PS4-2',
        [N('The pebble is very bright now. Does a bright light show us more, or less?')],
        [
          o('More', [N('Yes! A bright light helps us see more of the lane.')], true),
          o('Less', [N('A bright light shows more. A dim light shows less.')]),
        ],
        'Learned that a brighter light helps us see more.',
      ),
    ],
  ),
  sc(
    'a30-10-ember-settle',
    [
      N('In the lantern, the red pebble dims, slowly, back to its own small glow.'),
      N('It settles, like someone sitting down. Your Nubbin hugs it close again.'),
    ],
    [
      ask(
        1,
        'science',
        'a dimmer light shows less',
        '1-PS4-2',
        [N('The pebble glows softly now. Does it give more light, or less?')],
        [
          o('Less', [N('Yes! A soft glow gives less light.')], true),
          o('More', [N('Now it is soft and dim, so it gives less light.')]),
        ],
        'Compared a bright and a dim light.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A30-12, after complete
  sc(
    'a30-margin-hazel',
    [
      N('Nova’s atlas lies open at the steep roof and its little window.'),
      N('Beside the window, in faint pencil, there is a note in the margin. You know the hand.'),
      N('“A clay man, a word, and one forgotten Friday.” It is Gran Hazel’s writing.'),
      N('Your Nubbin puts one paw on the drawing of the attic window.'),
    ],
    [
      ask(
        3,
        'sel',
        'feeling close to someone through what they wrote',
        'CASEL: Self-awareness',
        [N('Gran Hazel wrote this note. What helps us feel close to someone we miss?')],
        [
          o(
            'Their words, and remembering them',
            [N('Yes! Notes and memories help us feel close.')],
            true,
          ),
          o('Forgetting them', [N('We keep people close by remembering them.')]),
        ],
        'Talked about feeling close to someone through their words and memories.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A30-13 order inserts
  sc(
    'a30-13-order-safe',
    [
      LO('You told him to keep everyone safe. And he kept the whole lane in.', 'soft'),
      LO('A guard who keeps everyone in is like a wall. And a wall is not a home.', 'think'),
      LO('A home has a door that opens.'),
    ],
    [
      ask(
        2,
        'literacy',
        'what a door is for',
        'L.2.4',
        [LO('A wall stays shut. A door opens. Which one lets you go outside?')],
        [
          o('A door', [LO('Yes! A door opens, so you can go out and come home.')], true),
          o('A wall', [LO('A wall does not open. A door does!')]),
        ],
        'Used the words wall and door to talk about being safe and being free.',
      ),
    ],
  ),
  sc(
    'a30-13-order-help',
    [
      LO('You told him to help where he was asked. At the end, he helped where nobody asked.'),
      N('He smiles a little, sadly.'),
      LO('He was a very good servant. That was the trouble.', 'sad'),
      LO('Help nobody asked for can make a mess. Asking first is best.'),
    ],
    [
      ask(
        3,
        'literacy',
        'why a character did what he did',
        'RL.2.3',
        [LO('At the end, Yossele did every job at once and broke things. Why?')],
        [
          o(
            'He did not wait to be asked',
            [LO('Yes! He kept helping, and did not wait to be asked.')],
            true,
          ),
          o('He was sleepy', [LO('Not sleepy. He did not wait to be asked.')]),
        ],
        'Worked out why a character acted the way he did.',
      ),
    ],
  ),
  sc(
    'a30-13-order-sit',
    [
      LO(
        'You told him to sit with the little ones. I have thought about that most of all.',
        'think',
      ),
      LO('Everything in him, I put there. The clay, the word, the work.'),
      LO('But at the end, he put your little one down on the step.'),
      LO('Nobody told him to do that. I did not put that in him.', 'soft'),
    ],
    [
      ask(
        2,
        'literacy',
        'what a character did that nobody told him to do',
        'RL.2.3',
        [LO('What did Yossele do before he went, that nobody told him to do?')],
        [
          o(
            'He put your Nubbin down gently',
            [LO('Yes! He put your Nubbin down on its feet.')],
            true,
          ),
          o('He ran away', [LO('He put your Nubbin down gently before he went.')]),
        ],
        'Recalled what a character did on his own, and what it shows about him.',
      ),
    ],
  ),
  sc(
    'a30-13-kept',
    [
      N('The rabbi looks at your pocket, where the stone is.'),
      LO('You carry something heavy for its size. What is it?'),
    ],
    [
      ask(
        1,
        'sel',
        'private things and secrets that worry us',
        'CASEL: Responsible decision-making',
        [
          N(
            'It is fine to keep something private. If a secret makes you worried, what should you do?',
          ),
        ],
        [
          o(
            'Tell a grown-up I trust',
            [N('Yes! Worrying secrets are best shared with someone we trust.')],
            true,
          ),
          o('Keep it forever', [
            N('Private is fine. But a worrying secret is best told to someone we trust.'),
          ]),
        ],
        'Talked about private things, and telling a trusted adult about a worrying secret.',
      ),
    ],
    [
      ch('tell', 'Tell him about the stone.', [
        N('You tell him. The stone hums one word: safe. He listens to the end.'),
        LO('Some things are made to protect, and then must be put somewhere high.', 'soft'),
        LO('There is no shame in carrying them up the steps.'),
      ]),
      ch('keep', 'Keep it to yourself.', [
        LO('Then keep it. You are allowed.', 'soft'),
        LO('Some things are made to protect, and then must be put somewhere high.'),
      ]),
    ],
  ),
  sc(
    'a30-13-tile-paw',
    [
      N('Beside the three letters is a tiny pawprint in the corner.'),
      RI('Your Nubbin did that. It put its paw on, and I did not smooth it.', 'happy'),
    ],
    [
      ask(
        1,
        'science',
        'soft clay keeps a print',
        'ELOF: Scientific Reasoning',
        [N('The print stayed in the clay. What kind of clay can hold a pawprint?')],
        [
          o(
            'Soft clay',
            [N('Yes! A paw leaves a print in soft clay, and then the clay dries hard.')],
            true,
          ),
          o('Hard, dry clay', [N('Dry clay is too hard. A paw leaves a print in soft clay.')]),
        ],
        'Learned that soft clay holds a print, and then dries hard.',
      ),
    ],
  ),
  sc(
    'a30-13-complete-help',
    [
      N('Rivka walks you to the end of the lane. The page goes thin and brown.'),
      N('Behind you stands the steep roof, and high in its gable, the attic window.'),
      N('On the sill, high up, a broom leans against the wall. Nobody has tried to fetch it down.'),
      N('Your Nubbin looks up at the window for a long time. Then it takes your hand.'),
      N('You are back in the Grove. A clay tile is in your pocket, still cool.'),
    ],
    [
      ask(
        3,
        'sel',
        'holding hands makes us feel close',
        'CASEL: Relationship skills',
        [N('Your Nubbin takes your hand. Why do we hold hands with someone we love?')],
        [
          o('It helps us feel close and safe', [N('Yes! Holding hands says: I am here.')], true),
          o('To stop them running', [N('We hold hands to feel close, not to stop people.')]),
        ],
        'Talked about holding hands as a way to feel close and safe.',
      ),
    ],
  ),
  sc(
    'a30-13-complete-sit',
    [
      N('Rivka walks you to the end of the lane. The page goes thin and brown.'),
      N('Behind you stands the steep roof, and high in its gable, the attic window.'),
      N('On the sill, high up, there is a small clay bird. A child’s.'),
      N('Your Nubbin looks up at the window for a long time. Then it takes your hand.'),
      N('You are back in the Grove. A clay tile is in your pocket, still cool.'),
    ],
    [
      ask(
        3,
        'sel',
        'holding hands makes us feel close',
        'CASEL: Relationship skills',
        [N('Your Nubbin takes your hand. Why do we hold hands with someone we love?')],
        [
          o('It helps us feel close and safe', [N('Yes! Holding hands says: I am here.')], true),
          o('To stop them running', [N('We hold hands to feel close, not to stop people.')]),
        ],
        'Talked about holding hands as a way to feel close and safe.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- Grove keepsake scenes
  sc(
    'a30-grove-tile-cinder',
    [
      N('You set the clay tile on the cottage hearth, beside Hazel’s old clay tablets.'),
      N('Moss comes in from the step, and stops beside it.'),
      M('Cinder would have liked him. That is the trouble with her.', 'soft'),
      N('Your Nubbin puts its little lantern down beside the tile.'),
    ],
    [
      ask(
        1,
        'literacy',
        'which side Hebrew starts on',
        'ELOF: Literacy',
        [N('The tile says emet. Hebrew starts on one side. Which side: right or left?')],
        [
          o(
            'The right',
            [N('Yes! Hebrew goes from right to left, so alef is on the right.')],
            true,
          ),
          o('The left', [N('English starts on the left. Hebrew starts on the right.')]),
        ],
        'Remembered that Hebrew is read from right to left.',
      ),
    ],
  ),
  sc(
    'a30-grove-tile',
    [
      N('You set the clay tile on the cottage hearth, beside Hazel’s old clay tablets.'),
      N('Moss comes in from the step. You tell him the word: emet, truth.'),
      M('Truth. A good word to keep by the fire.', 'soft'),
      N('Your Nubbin sits by the hearth and looks at the tile until dark.'),
    ],
    [
      ask(
        1,
        'literacy',
        'what emet means',
        'ELOF: Language and Communication',
        [N('The tile says emet. What does emet mean?')],
        [
          o('Truth', [N('Yes! Emet means truth.')], true),
          o('Bread', [N('Bread is a different word. Emet means truth.')]),
        ],
        'Remembered that the Hebrew word emet means truth.',
      ),
    ],
  ),
  sc(
    'a30-grove-tile-quiet',
    [
      N('You set the clay tile on the cottage hearth, beside Hazel’s old clay tablets.'),
      N('The cottage is quiet. You say the word out loud: emet. Truth.'),
      N('Your Nubbin sits by the hearth and looks at the tile until dark.'),
    ],
    [
      ask(
        1,
        'literacy',
        'the last Hebrew letter',
        'ELOF: Literacy',
        [OR('The tile has three letters. Alef is first. Which letter is last: tav or mem?')],
        [
          o('Tav', [OR('Yes! Tav is the very last letter, on the left.')], true),
          o('Mem', [OR('Mem is near the middle. Tav is the last.')]),
        ],
        'Named tav as the last Hebrew letter.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A30_SPROUT: EduQuest[] = [A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, A13];

/** Every `edu:` check string used by the lessons above. */
export const CHECKS: string[] = [
  'edu:clap:syllables:sabbath',
  'edu:count:chairs:6',
  'edu:count:lanes:4',
  'edu:count:shutters:4',
  'edu:feel:air:blow',
  'edu:point:letters:alef-mem-tav',
  'edu:say:sound-word:plip-plop',
];
