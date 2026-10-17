/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Atlas page A28, The Box of
 * Stories (the Anansesem, Akan spider stories of Ghana, with a Jamaican Anancy telling).
 *
 * Source: atlas-a28.ts (ATLAS_A28 and ATLAS_A28_VARIANTS). One EduScene per original scene, id
 * `sprout:<original id>`, with the same choice ids and `set` flags (`a28-fairy` in a28-06-wait,
 * `a28-gate` in a28-12-last-driven). Every step scene, done scene, complete scene and variant has a
 * version, and each has exactly one lesson. Domains never repeat back to back, across scenes and
 * quests, and each variant has the same domain as the scene it replaces (the margin note is a
 * feelings lesson, between a literacy scene and a science scene).
 *
 * What it teaches (outline: geography, Akan day names, spider silk, hornet nests, how stories
 * travel): Ghana as a country in Africa and Jamaica as an island; day names (Kwaku is a boy born on
 * a Wednesday); spiders have eight legs and make silk; hornets chew wood into paper; counting to 8,
 * adding 1 or 2, more and less, halves, shapes; clapping syllables, first sounds, rhymes, sound
 * words, first-next-last; and listening, waiting, saying thank you, being brave, telling the truth.
 *
 * Left out or softened for this age (EDU-STYLE.md, “Hard things”):
 * - No lines from Rattray or any published telling. The storyteller’s opening and closing and
 *   Ntikuma’s idea are our own plain words (the same safe replacements as the originals’ childLines).
 * - Every creature goes up to the Sky-god alive and unharmed. Ya Nsia goes as a guest.
 * - Aso’s mother’s funeral: said plainly (“died” means her body stopped working and will not start
 *   again), with the comfort straight after: the family together, the food, the drums.
 * - The one sentence about enslaved people in the Jamaican yard is kept, short and plain: people
 *   were taken by force, it was wrong, and they kept their stories. Nothing is shown.
 * - Mmoatia’s capture: she is cross and scared, never hurt. All three `a28-fairy` choices are kept,
 *   and the “leave her be” choice is worded gently, so no `defaultChoice` is needed.
 * - Facts used (all well established): Ghana is a country in West Africa; spiders have eight legs
 *   and make silk from spouts at the back of the body; hornets chew wood into paper for their
 *   nests; snakes flick their tongues to smell; snakes have no legs; leopards have spots and hunt
 *   mostly at night; yams grow under the ground; sap is sticky; a buttercup has five petals;
 *   dandelion seeds fly on the wind; frogs sing to call other frogs; a drum skin shakes; heat moves
 *   from hot things to cooler ones; hot air rises; fires need wood; Jamaica is a warm island in the
 *   Caribbean Sea; Kwaku is a Wednesday boy’s name and Ama a Saturday girl’s.
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
const ST = say('a28-storyteller');
const CH = say('a28-children');
const AN = say('a28-ananse');
const NY = say('a28-nyame');
const AS = say('a28-aso');
const ON = say('a28-onini');
const OS = say('a28-osebo');
const MM = say('a28-mmoatia');
const YA = say('a28-ya-nsia');
const NT = say('a28-ntikuma');
const MO = say('a28-mourner');
const EL = say('a28-elder');
const YC = say('a28-yard-child');
const W = say('wisp');

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

// ================================================================== A28-1 We Don’t Really Mean It
const A1: EduQuest = quest(
  'a28-01',
  'We Don’t Really Mean It',
  {
    'a28-01-s1': {
      goal: 'Step into the courtyard and find a mat by the fire.',
      hint: 'Touch the carved stool on the page. Then walk to the fire.',
    },
    'a28-01-s2': {
      goal: 'Listen to how the storyteller begins. Shout back with the children!',
      hint: 'Stay on your mat by the fire until she has spoken.',
    },
    'a28-01-s3': {
      goal: 'Fall into the story. Meet the spider.',
      hint: 'Keep listening. When the courtyard fades, look beside you.',
    },
  },
  [
    sc(
      'a28-01-courtyard',
      [
        N('Nova’s big book opens. A warm night! A fire! Faces all in a ring.'),
        N('You touch the carved stool. Now you are in a courtyard.'),
        N('This is a village in Ghana. Ghana is a country in Africa.'),
        N('Children sit on mats by the fire. Crickets sing.'),
        CH('Nana is coming! Nana!', 'happy'),
        N('An old woman walks slowly across the yard. She has all the time in the world.'),
        N('One mat is empty, right at the front.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'Ghana is a country in Africa',
          'D2.Geo.2.K-2',
          [N('(Point to the picture of the village.) Is Ghana a country in Africa, or a pond?')],
          [
            o(
              'A country in Africa.',
              [N('Yes! Ghana is a country in Africa, with a village in it.')],
              true,
            ),
            o('A pond.', [N('Ghana is much bigger than a pond! It is a whole country.')]),
          ],
          'Learned that Ghana is a country in Africa, and that this story begins in a Ghanaian village.',
        ),
      ],
      [
        ch('front', 'Sit on the front mat.', [
          N('A small girl shuffles over to make room.'),
          N('She never takes her eyes off the stool.'),
        ]),
        ch('back', 'Sit at the back, by a doorway.', [
          N('A man in the doorway nods hello.'),
          N('Your Nubbin goes to the front anyway. It sits on the end of the girl’s mat.'),
        ]),
      ],
    ),
    sc(
      'a28-01-courtyard-done',
      [
        N('The old woman sits on the stool. The fire pops.'),
        N('Everybody goes quiet. Even the grown-ups.'),
        N('Quiet ears help us hear a story.'),
      ],
      [
        doit(
          2,
          'sel',
          'listening with quiet ears',
          'ELOF: Social and Emotional Development',
          'edu:listen:quiet:5',
          [
            N('(Sit very still. Listen for five slow breaths.)'),
            N('Good listening! Now you can hear the fire crackle.'),
          ],
          'Practised being still and quiet to listen, the way the village listens to a storyteller.',
        ),
      ],
    ),
    sc(
      'a28-01-stool',
      [
        ST('Before I begin, listen. None of this is really true.', 'think'),
        ST('Not really. Not really at all!'),
        N('The children shout back, all together. The moths jump off the wall!'),
        CH('Tell it! Tell it anyway!', 'happy'),
        N('The girl beside you nudges you. Shout too!'),
      ],
      [
        doit(
          3,
          'literacy',
          'a repeated line, said together',
          'RL.2.4',
          'edu:say:refrain:tell-it-anyway',
          [
            N('(Shout it together: “Tell it! Tell it anyway!”)'),
            ST('Lovely loud shouting! That is how we begin.', 'happy'),
          ],
          'Joined in a call-and-reply refrain, a repeated line that storytellers and listeners share.',
        ),
      ],
      [
        ch('shout', 'Shout it with them.', [
          Y('Tell it anyway!', 'happy'),
          N('Your Nubbin shouts too. It comes out as a squeak.'),
          N('The old woman points at it, delighted.'),
        ]),
        ch('mouth', 'Say it a bit shyly.', [
          N('The girl shouts it again, for both of you.'),
          N('Your Nubbin bounces in time. That counts!'),
        ]),
      ],
    ),
    sc(
      'a28-01-stool-done',
      [
        ST('Good! Now I will tell you exactly how it happened.', 'happy'),
        N('The children laugh. You laugh too.'),
        N('Four children sit on the front mat, squashed up tight.'),
      ],
      [
        doit(
          2,
          'maths',
          'count to 4 to find how many',
          'K.CC.B.5',
          'edu:count:children:4',
          [
            N('(Point to each child on the front mat. Count them together.)'),
            N('One, two, three, four. Four children!'),
          ],
          'Counted four children on a mat, touching each one once.',
        ),
      ],
    ),
    sc(
      'a28-01-fall',
      [
        ST('This story is about Kwaku Ananse, the spider.'),
        CH('Ananse!', 'happy'),
        ST('Once there were no stories on the earth. Not one.'),
        ST('The Sky-god, Nyame, kept every story with him.'),
        N('Her voice goes low. The stars come down close.'),
        N('Crickets chirp in the dark. Chirp, chirp, chirp!'),
        N('Then the mat is red earth. There are trees. It is morning.'),
        N('Something sits on a log, swinging lots of legs.'),
      ],
      [
        notice(
          5,
          'science',
          'a cricket’s song is made by shaking wings',
          'ELOF: Scientific Reasoning',
          [
            ST('A cricket sings by rubbing its wings together.'),
            ST('The wings shake, and the shaking makes the sound. Chirp!'),
          ],
          'Learned that crickets make their song by rubbing their wings, and that shaking makes sound.',
        ),
      ],
    ),
    sc(
      'a28-01-fall-done',
      [
        N('It is a spider the size of a cooking pot, in a hat!'),
        AN('You have two arms. Excellent. I have eight legs.', 'happy'),
        N('Your Nubbin touches a silver thread. It sticks!'),
        N('The spider pulls it free. He has done this many times.'),
      ],
      [
        doit(
          1,
          'maths',
          'count to 8 to find how many',
          'K.CC.B.5',
          'edu:count:legs:8',
          [
            N('(Count Ananse’s legs together. Point to each one.)'),
            AN('One, two, three, four, five, six, seven, eight. Eight legs!', 'happy'),
          ],
          'Counted a spider’s eight legs, one by one.',
        ),
      ],
    ),
    sc(
      'a28-01-complete',
      [
        AN('I am Kwaku Ananse. You will carry things for me.', 'happy'),
        AN('In return, you will see the cleverest thing ever done.'),
        N('Far behind you, the old woman is still telling.'),
        AN('Come! We are going to see the Sky-god. Walk tall. Not too tall.'),
        N('Your Nubbin follows, stepping where he steps.'),
      ],
      [
        ask(
          3,
          'literacy',
          'who a story is about (characters)',
          'RL.K.3',
          [N('Every story has someone it is about. Who is this story about?')],
          [
            o(
              'Ananse the spider.',
              [N('Yes! This story is about Ananse, the spider in the hat.')],
              true,
            ),
            o('A big brown dog.', [
              N('There is no dog yet! This story is about Ananse, the spider.'),
            ]),
          ],
          'Named the main character of the story, Ananse the spider.',
        ),
      ],
    ),
  ],
);

// ================================================================== A28-2 The Sky-god’s Stories
const A2: EduQuest = quest(
  'a28-02',
  'The Sky-god’s Stories',
  {
    'a28-02-s1': {
      goal: 'Climb Ananse’s thread up to the Sky-god’s court.',
      hint: 'Follow Ananse up the silver line.',
    },
    'a28-02-s2': {
      goal: 'Stand with Ananse while he asks the Sky-god his price.',
      hint: 'Stay one step behind Ananse.',
    },
    'a28-02-s3': {
      goal: 'Walk into the forest with Ananse.',
      hint: 'Sit with Ananse on the root and listen.',
    },
  },
  [
    sc(
      'a28-02-climb',
      [
        N('Ananse spins a thread straight up into the morning.'),
        N('He climbs it. You climb after him.'),
        AN('A spider’s silk is made inside its body. It comes out of tiny spouts at the back.'),
        AN('Don’t look down!', 'happy'),
        N('At the top is a court of white cloud. Elders sit on carved stools.'),
        N('At the far end is a light too bright to look at.'),
        N('Rich men are leaving. The Sky-god said no to all their gifts.'),
        AN('Kings could not pay. But I have no money. Nobody watches a poor spider.'),
      ],
      [
        notice(
          2,
          'science',
          'spiders make silk inside their bodies',
          'ELOF: Scientific Reasoning',
          [
            N(
              'Spiders make silk in their bodies, and spin it out of tiny spouts. That is how a spider makes a thread.',
            ),
          ],
          'Learned that spiders make silk inside their bodies and spin it out of tiny spouts.',
        ),
      ],
      [
        ch('pay', 'Ask what he means to pay with.', [
          AN('With whatever he asks for. Agree first. Work out how afterwards.'),
        ]),
        ch('hair', 'Unstick your Nubbin from your hair.', [
          N('It takes a while. An elder watches and nods when it is done.'),
        ]),
      ],
    ),
    sc(
      'a28-02-climb-done',
      [
        N('Ananse straightens his hat. He takes three steps.'),
        N('He bows so low that his hat touches the cloud.'),
        N('You bow too. Bowing says: I respect you.'),
      ],
      [
        ask(
          2,
          'sel',
          'showing respect to an elder',
          'CASEL: Social awareness',
          [N('Ananse bows to the elders. How can we show respect to an elder?')],
          [
            o(
              'Say hello kindly and listen.',
              [N('Yes! Kind words and good listening show respect.')],
              true,
            ),
            o('Shout over them.', [N('Shouting is not respectful. Kind words and listening are.')]),
          ],
          'Talked about how kind words and good listening show respect for elders.',
        ),
      ],
    ),
    sc(
      'a28-02-price',
      [
        NY('Kwaku Ananse. You have come a long way for a spider.'),
        AN('Great one, I have come to buy your stories.', 'happy'),
        NY('Kings tried. Towns tried. They could not pay.'),
        NY('Bring me four things. Onini, the python. Mmoboro, the hornets.'),
        NY('Bring me Osebo, the leopard. And Mmoatia, the fairy.'),
        AN(
          'I will bring them all! And my old mother will come too, to sit on the best stool.',
          'happy',
        ),
        N('Your Nubbin stares at him. So do you.'),
        NY('So be it. Go, Kwaku Ananse.'),
      ],
      [
        ask(
          5,
          'maths',
          'add 1 more: 4 and 1 make 5',
          'K.OA.A.2',
          [
            N('(Count the four things on your fingers: python, hornets, leopard, fairy.)'),
            N('Then Ananse adds his mother. How many is that?'),
          ],
          [
            o('Five.', [N('Yes! Four things and one more makes five.')], true),
            o('Four.', [N('Four things, and Ya Nsia makes one more. Four and one is five.')]),
          ],
          'Counted four things and added one more to make five.',
        ),
      ],
      [
        ch('mother', 'Whisper, “Your mother?”', [
          AN('She will love it up there. Very good stools.', 'think'),
        ]),
        ch('silent', 'Say nothing.', [N('Ananse glances at you. He knows what you are thinking.')]),
      ],
    ),
    sc(
      'a28-02-price-done',
      [
        N('Down the thread, Ananse is humming.'),
        N('You count on your fingers. Your Nubbin counts on its toes.'),
        AN('My name is Kwaku. Clap it with me: Kwa-ku!'),
      ],
      [
        doit(
          2,
          'literacy',
          'clapping the syllables in a name',
          'RF.K.2',
          'edu:clap:syllables:kwaku',
          [
            N('(Clap twice as you say it: Kwa, ku. Two claps!)'),
            AN('Two claps. Kwa-ku. That is how my name sounds.', 'happy'),
          ],
          'Clapped the two syllables in the name Kwaku.',
        ),
      ],
    ),
    sc(
      'a28-02-road',
      [
        N('At the foot of the thread, Ananse sits on a root.'),
        AN('Eight legs, I have. Two arms, you have.', 'think'),
        N('Your Nubbin sits in a puddle of sap. It sticks!'),
        AN('Ah. A specialist.'),
        AN('They call me Kwaku. I was born on a Wednesday!', 'happy'),
        AN('Every child has a day name. What is yours?'),
      ],
      [
        notice(
          4,
          'social-studies',
          'Akan day names',
          'D2.His.2.K-2',
          [
            AN('In Ghana, many families name a baby for the day it was born.'),
            AN('Kwaku is a boy born on a Wednesday. Ama is a girl born on a Saturday.'),
            N('(Do you know your birth day? Tell a grown-up.)'),
          ],
          'Learned that many Ghanaian families give babies a day name, such as Kwaku for a Wednesday boy.',
        ),
      ],
      [
        ch('day', 'Tell him the day you were born.', [
          AN('A fine day. Not as fine as Wednesday. But fine.', 'happy'),
        ]),
        ch('unknown', 'Say you don’t know.', [
          AN('Then you can choose one. I would choose Wednesday.'),
        ]),
      ],
    ),
    sc(
      'a28-02-road-done',
      [
        N('Ananse gets up and dusts off his hat.'),
        AN('Python first. He is the vainest. Vain ones are easy.'),
        N('A python is a big snake. It has no legs.'),
        N('It flicks its tongue, flick, flick! That is how it smells.'),
      ],
      [
        notice(
          3,
          'science',
          'snakes smell with their tongues',
          'ELOF: Scientific Reasoning',
          [
            N('A snake flicks its tongue to taste the air. That is how it smells.'),
            N('(Flick your tongue like a snake!)'),
          ],
          'Learned that a snake flicks its tongue to smell the air.',
        ),
      ],
    ),
    sc(
      'a28-02-complete',
      [
        N('The forest is huge, green and noisy.'),
        AN('One thing at a time. That is how you eat a whole yam.', 'happy'),
        N('Big jobs get smaller when we do one bit at a time.'),
        N('You set off. Your Nubbin follows, with a leaf stuck to its foot.'),
      ],
      [
        ask(
          2,
          'sel',
          'breaking a big job into small steps',
          'CASEL: Self-management',
          [N('A job feels very big. What helps?')],
          [
            o(
              'Do one small bit at a time.',
              [N('Yes! Small bits, one at a time, get big jobs done.')],
              true,
            ),
            o('Give up straight away.', [
              N('Try one small bit first. Little by little, big jobs get done.'),
            ]),
          ],
          'Talked about how a big job feels easier when we do one small bit at a time.',
        ),
      ],
    ),
  ],
);

// ================================================================== A28-3 Onini the Python
const A3: EduQuest = quest(
  'a28-03',
  'Onini the Python',
  {
    'a28-03-s1': {
      goal: 'Find a long palm branch and some creeper.',
      hint: 'Look on the forest floor. Your Nubbin walks into the creeper.',
    },
    'a28-03-s2': {
      goal: 'Watch Ananse and Aso argue by the python’s tree.',
      hint: 'Stand by the branch. Keep a straight face.',
    },
    'a28-03-s3': {
      goal: 'Hold the python’s tail.',
      hint: 'Take the tail end and hold on tight.',
    },
  },
  [
    sc(
      'a28-03-branch',
      [
        AN('We need a palm branch. A long one. And creeper for tying.'),
        N('You find a branch. It is longer than a canoe!'),
        N('Your Nubbin finds the creeper by walking into it.'),
        N('Creeper is a vine. It is bendy and strong.'),
        AN('Now my wife Aso is coming. We will have a loud argument.'),
        AS('I always argue with you loudly. I do not need a reason.'),
      ],
      [
        ask(
          3,
          'science',
          'a bendy, strong material is good for tying',
          '2-PS1-1',
          [N('Which is better for tying a bundle: a stiff stick, or a bendy creeper?')],
          [
            o(
              'A bendy creeper.',
              [N('Yes! A creeper bends round things, and it is strong.')],
              true,
            ),
            o('A stiff stick.', [N('A stiff stick will not wrap round. A bendy creeper will!')]),
          ],
          'Compared materials: a bendy, strong creeper ties better than a stiff stick.',
        ),
      ],
    ),
    sc(
      'a28-03-branch-done',
      [
        N('You drag the branch to a great tree.'),
        N('Its roots look like knuckles on a big brown hand.'),
        N('Something long sleeps up in the branches. Hhh, hhh. It is breathing.'),
        N('Tree. Three. Those words rhyme!'),
      ],
      [
        doit(
          3,
          'literacy',
          'words that rhyme',
          'RF.K.2',
          'edu:say:rhyme:tree',
          [
            N('(Say it: tree, three. They sound the same at the end.)'),
            N('Can you think of another word that rhymes with tree? Try “bee” or “me”.'),
          ],
          'Heard and said rhyming words: tree and three.',
        ),
      ],
    ),
    sc(
      'a28-03-argue',
      [
        AN('He IS longer than this branch!', 'angry'),
        AS('He is NOT! Anybody can see!', 'angry'),
        N('They shout and shout. They have had lots of practice.'),
        N('A head comes down out of the tree, followed by lots of python.'),
        ON('What is all this noise about my length?'),
        AN('Settle it for us, Onini. Lie down by the branch.'),
        ON('Lay the branch down. I will lie beside it.', 'angry'),
        N('He stretches and stretches. There is still a hand’s width of branch left.'),
      ],
      [
        ask(
          2,
          'sel',
          'settling a disagreement without shouting',
          'CASEL: Relationship skills',
          [N('Ananse and Aso disagree. What helps most?')],
          [
            o(
              'Check the facts together.',
              [N('Yes! Looking at the facts together settles it.')],
              true,
            ),
            o('Shout louder.', [N('Shouting does not settle it. Checking the facts does.')]),
          ],
          'Talked about settling a disagreement by checking the facts, not by shouting.',
        ),
      ],
      [
        ch('nearly', 'Tell Onini he very nearly has it.', [
          ON('Nearly is not a length a python accepts.', 'angry'),
        ]),
        ch('straight', 'Keep a very straight face.', [
          N('You manage. Your Nubbin does not. It turns to look hard at a tree.'),
        ]),
      ],
    ),
    sc(
      'a28-03-argue-done',
      [
        AN('Your tail keeps slipping, Onini.'),
        AN('My helper will hold it, so we can measure you properly.'),
      ],
      [
        ask(
          1,
          'maths',
          'compare lengths: shorter and longer',
          'K.MD.A.2',
          [
            N(
              'Onini lay beside the branch. (Look at the picture.) Is Onini shorter or longer than the branch?',
            ),
          ],
          [
            o('Shorter.', [N('Yes! Onini is shorter. There is branch left over.')], true),
            o('Longer.', [
              N('Look again. There is branch left over at the end. Onini is shorter.'),
            ]),
          ],
          'Compared two lengths and saw that the python was shorter than the branch.',
        ),
      ],
    ),
    sc(
      'a28-03-tie',
      [
        N('You hold the tail end. It is heavy and strong.'),
        AN('Just to measure you properly. Now a bit in the middle.'),
        N('Round and round goes the creeper, nose to tail.'),
        ON('This is not measuring!', 'shock'),
        AN('No. You are very long, though!', 'happy'),
        N('Your Nubbin ties its own foot into the knot.'),
      ],
      [
        ask(
          5,
          'science',
          'a snake has no legs; it moves with its body',
          '4-LS1-1',
          [N('A snake has no legs. How does it move?')],
          [
            o(
              'It slithers.',
              [N('Yes! A snake slithers, pushing along with its strong body.')],
              true,
            ),
            o('It hops.', [N('Snakes do not hop. They slither along the ground.')]),
          ],
          'Learned that a snake has no legs and slithers using its strong body.',
        ),
      ],
      [
        ch('sorry', 'Tell Onini you’re sorry.', [
          ON('Sorry, from the one holding my tail.', 'sad'),
          N('You keep holding it anyway. You feel bad.'),
        ]),
        ch('pat', 'Pat the python’s nose, carefully.', [
          N('He looks at you with one cold eye.'),
          N('It is not friendship. But it is not biting either.'),
        ]),
      ],
    ),
    sc(
      'a28-03-tie-done',
      [
        N('Ananse unties your Nubbin’s foot, one strand at a time.'),
        N('Onini is still tied up. He looks cross and a bit sad.'),
        N('Onini feels tricked. Being tricked feels bad.'),
      ],
      [
        ask(
          2,
          'sel',
          'naming how someone feels',
          'CASEL: Social awareness',
          [N('Onini has been tricked. How does Onini feel?')],
          [
            o('Cross and sad.', [N('Yes! Onini feels cross and sad. Being tricked hurts.')], true),
            o('Very happy.', [N('Look at his face. Onini is cross and sad, not happy.')]),
          ],
          'Named the feelings of a character who had been tricked: cross and sad.',
        ),
      ],
    ),
    sc(
      'a28-03-complete',
      [
        AN('One! One thing paid, by a spider with no money!', 'happy'),
        AS('I saw. I argued. You are welcome.'),
        N('Onini goes up the thread to the Sky-god. He is cross all the way.'),
        N('He will be looked after. It is a court, not a kitchen.'),
        AN('Hornets next. Find me a gourd!'),
      ],
      [
        notice(
          3,
          'social-studies',
          'elders listen to everyone so rules are fair',
          'D2.Civ.8.K-2',
          [
            N('In a village, elders help keep things fair. They listen to everybody.'),
            N('At the Sky-god’s court, Onini will be listened to too.'),
          ],
          'Learned that elders keep rules fair by listening to everyone.',
        ),
      ],
    ),
  ],
);

// ================================================================== A28-4 Mmoboro the Hornets
const A4: EduQuest = quest(
  'a28-04',
  'Mmoboro the Hornets',
  {
    'a28-04-s1': {
      goal: 'Fill a gourd with water for Ananse’s “rain”.',
      hint: 'Take the water gourd to the stream and fill it up.',
    },
    'a28-04-s2': {
      goal: 'Pour the rain when Ananse says.',
      hint: 'Stand under the nest with the water. Wait for Ananse.',
    },
    'a28-04-s3': {
      goal: 'Stop up the gourd before the hornets work it out.',
      hint: 'Take the grass plug from Ananse. Close the gourd fast.',
    },
  },
  [
    sc(
      'a28-04-gourd',
      [
        N('Ananse cuts the top off a dry gourd. He gives you a second gourd for water.'),
        AN('The dry one is the house. The wet one is the rain.'),
        N('He holds a big plantain leaf over his head, like an umbrella.'),
        AN('Fill it to the brim!'),
        N('You fill the gourd at the stream. Your Nubbin brings half of one.'),
      ],
      [
        ask(
          4,
          'maths',
          'compare amounts: more and less',
          'K.MD.A.2',
          [N('Your gourd is full. Nubbin’s gourd is half full. Which gourd has more water?')],
          [
            o('The full gourd.', [N('Yes! The full gourd has more. Half full has less.')], true),
            o('The half-full gourd.', [
              N('Look again. The full gourd has more. Half full has less.'),
            ]),
          ],
          'Compared a full gourd with a half-full one and said which held more.',
        ),
      ],
      [
        ch('why', 'Ask why the hornets would believe it’s raining.', [
          AN('Because I will tell them. Nobody argues with weather.', 'happy'),
        ]),
        ch('leaf', 'Offer to hold the leaf.', [
          AN('No. The leaf is the costume. I am the actor. You are the weather.'),
        ]),
      ],
    ),
    sc(
      'a28-04-gourd-done',
      [
        N('The nest hangs from a branch like a grey paper lantern.'),
        N('It hums. It hums louder the closer you get.'),
        N('Hornets chew wood into paper. They build the nest from it.'),
      ],
      [
        notice(
          2,
          'science',
          'hornets build paper nests from chewed wood',
          'ELOF: Scientific Reasoning',
          [
            N('Hornets chew wood and mix it with spit. It dries into paper.'),
            N('That is how they build their nest. Clever!'),
          ],
          'Learned that hornets make a paper nest by chewing wood.',
        ),
      ],
    ),
    sc(
      'a28-04-rain',
      [
        AN('Now. Pour.'),
        N('You tip the water. Splash! Ananse taps his leaf. Drum, drum, drum!'),
        AN('Rain! Rain, Mmoboro! You will be soaked!', 'shock'),
        AN('Come into my dry gourd. It is lovely in here.'),
        N('The humming changes. Buzz, buzz, BUZZ!'),
        N('The hornets pour into the gourd, like smoke going down a chimney.'),
      ],
      [
        doit(
          5,
          'literacy',
          'sound words (drum, splash, buzz)',
          'RL.2.4',
          'edu:say:sound-words:drum-buzz',
          [
            N('(Say the sounds: splash! drum, drum, drum! buzz, buzz!)'),
            N('Sound words make a story noisy and fun.'),
          ],
          'Said sound words from the story: splash, drum and buzz.',
        ),
      ],
    ),
    sc(
      'a28-04-stopper',
      [
        N('Ananse holds out a plug of twisted grass. His legs jiggle.'),
        AN('Now! Now, now, now!', 'shock'),
        N('A hornet’s head pokes out. It goes back in.'),
        N('Your heart goes thump, thump. It feels fast.'),
        N('A slow breath helps you stay calm.'),
      ],
      [
        doit(
          4,
          'sel',
          'a slow breath to stay calm',
          'CASEL: Self-management',
          'edu:breathe:slow:3',
          [
            N('(Breathe in slowly, then out slowly, three times.)'),
            N('Calm hands can close a gourd. Now you are ready.'),
          ],
          'Took three slow breaths to calm down when things felt hurried.',
        ),
      ],
      [
        ch('jam', 'Jam the stopper in.', [
          N('It goes in with a squeak.'),
          N('The gourd buzzes in your hands, like a pot coming to the boil.'),
        ]),
        ch('sit', 'Let your Nubbin close it.', [
          N('Your Nubbin sits on the hole. It is about the right size.'),
          N('You slide the grass in under it, carefully.'),
        ]),
      ],
    ),
    sc(
      'a28-04-stopper-done',
      [
        N('One last hornet lands on your Nubbin’s nose. It stings!'),
        N('Your Nubbin’s eyes go wide. Then they go narrow.'),
        AN('Two!', 'happy'),
        N('Two things are paid: the python and the hornets.'),
      ],
      [
        ask(
          3,
          'maths',
          'take away: 4 take away 2',
          'K.OA.A.2',
          [N('The Sky-god asked for four things. Ananse has two. How many more are left?')],
          [
            o('Two.', [N('Yes! Four take away two leaves two: the leopard and the fairy.')], true),
            o('Four.', [N('Ananse has two already. Four take away two is two more to find.')]),
          ],
          'Solved a take-away problem: 4 things asked, 2 paid, so 2 left.',
        ),
      ],
    ),
    sc(
      'a28-04-complete',
      [
        N('Ananse dances on eight legs, with the gourd over his hat.'),
        N('The hornets go up to the Sky-god. They are fine.'),
        N('Your Nubbin’s nose has a small red bump.'),
        N('It is cross with the gourd, the hornets and the sky!'),
        AN('Leopard next. For a leopard, we dig.'),
      ],
      [
        ask(
          3,
          'literacy',
          'words for feelings',
          'RL.1.4',
          [N('Your Nubbin is cross about its nose. Which word is a feeling word?')],
          [
            o('Grumpy.', [N('Yes! Grumpy is a feeling word. Your Nubbin is grumpy.')], true),
            o('Square.', [N('Square is a shape. A feeling word is grumpy, glad or sad.')]),
          ],
          'Picked out a feeling word (grumpy) to say how a character feels.',
        ),
      ],
    ),
  ],
);

// ================================================================== A28-5 Osebo the Leopard
const A5: EduQuest = quest(
  'a28-05',
  'Osebo the Leopard',
  {
    'a28-05-s1': {
      goal: 'Help Ananse dig a pit across the leopard’s path.',
      hint: 'Dig where Ananse scratched a line. Cover the hole with sticks and leaves.',
    },
    'a28-05-s2': {
      goal: 'Come back to the pit at dawn.',
      hint: 'Rest at Ananse’s house. Go back to the path at first light.',
    },
    'a28-05-s3': {
      goal: 'Carry the bundle to the foot of the thread.',
      hint: 'Take the front. Your Nubbin takes the tail.',
    },
  },
  [
    sc(
      'a28-05-pit',
      [
        N('Ananse finds the leopard’s path. The paw prints are big.'),
        AN('Dig here! Deep enough for a leopard to sit and think.'),
        N('You dig. Your Nubbin digs a little hole of its own.'),
        AN('Now put sticks across the top. Then leaves on the sticks.'),
        N('The sticks go over the hole. The leaves go on top.'),
        N('Now it looks like a path. You must remember where it isn’t!'),
      ],
      [
        ask(
          4,
          'maths',
          'positions: on top, under',
          'K.G.A.1',
          [N('The hole is under the sticks. Where are the leaves?')],
          [
            o('On top.', [N('Yes! The leaves are on top of the sticks.')], true),
            o('Under the hole.', [
              N('The leaves are on top of the sticks. The hole is underneath.'),
            ]),
          ],
          'Used position words (on top, under) to describe a covered hole.',
        ),
      ],
    ),
    sc(
      'a28-05-pit-done',
      [
        AN('Now we go home and sleep.'),
        AN('Leopards walk at night. That is when the hole will work.'),
        N('Leopards have spots. They are good at climbing trees too.'),
      ],
      [
        ask(
          2,
          'science',
          'leopards are mostly active at night',
          'ELOF: Scientific Reasoning',
          [N('When do leopards like to walk about?')],
          [
            o('At night.', [N('Yes! Leopards mostly hunt at night, in the dark.')], true),
            o('Only at noon.', [N('Leopards mostly walk about at night, when it is dark.')]),
          ],
          'Learned that leopards are mostly active at night.',
        ),
      ],
    ),
    sc(
      'a28-05-fall',
      [
        N('In the night: crash! Thump! A long, low growl.'),
        N('At first light you creep back. The pit has a leopard in it!'),
        OS('Who dug a hole in my road?', 'angry'),
        N('Osebo is spotty and magnificent. He is very embarrassed.'),
        AN('My poor friend! Who would do such a thing?', 'sad'),
      ],
      [
        ask(
          4,
          'sel',
          'telling the truth',
          'CASEL: Responsible decision-making',
          [
            N(
              'Ananse dug the hole. But he says, “Who would do such a thing?” Is that telling the truth?',
            ),
          ],
          [
            o(
              'No. He is fibbing.',
              [N('Yes. Ananse is pretending. Telling the truth is better.')],
              true,
            ),
            o('Yes. It is all true.', [
              N('Ananse dug it himself! He is pretending. The truth is better.'),
            ]),
          ],
          'Talked about the difference between pretending and telling the truth.',
        ),
      ],
      [
        ch('look', 'Look anywhere but at the pile of earth.', [
          N('You look at the sky, and so does your Nubbin.'),
          N('The pile of earth is right behind you, being obvious.'),
        ]),
        ch('help', 'Ask Osebo if he’s hurt.', [OS('Only my pride. Which is worse.', 'sad')]),
      ],
    ),
    sc(
      'a28-05-web',
      [
        AN('Let me help you out. I am wonderful with ropes!'),
        OS('You? Help? You are a spider.', 'think'),
        AN('Exactly. Put your arms through this loop.'),
        N('The web goes round and round and round.'),
        N('The tree springs up and Osebo goes with it. He is wrapped, cross and not hurt.'),
        OS('Spider! When I get out of this!', 'angry'),
        AN('Yes, yes. Everyone says that.', 'happy'),
      ],
      [
        notice(
          4,
          'science',
          'spider silk is strong, and some of it is sticky',
          'ELOF: Scientific Reasoning',
          [
            AN('My silk is very strong, for something so thin.'),
            AN('Some of it is sticky, to catch flies.'),
          ],
          'Learned that spider silk is strong for its thinness, and that some of it is sticky.',
        ),
      ],
      [
        ch('court', 'Tell Osebo the Sky-god keeps a fine court.', [
          OS('Then the Sky-god can come and untie me himself.', 'angry'),
        ]),
        ch('quiet', 'Say nothing, and take the heavy end.', [
          N('Osebo looks at you upside down.'),
          N('He seems to think better of you for not explaining.'),
        ]),
      ],
    ),
    sc(
      'a28-05-web-done',
      [
        N('The bundle is heavy and very cross. You carry the front.'),
        N('Your Nubbin carries the tip of the tail.'),
        N('Your Nubbin gets stuck to the web. It goes up the thread, stuck!'),
        N('Ananse unpicks it, bit by bit.'),
      ],
      [
        ask(
          1,
          'maths',
          'compare weights: heavier and lighter',
          'K.MD.A.2',
          [N('The leopard bundle is heavy. The tail tip is light. Which does your Nubbin carry?')],
          [
            o(
              'The light tail tip.',
              [N('Yes! The tail tip is light, so Nubbin can carry it.')],
              true,
            ),
            o('The heavy middle.', [
              N('The heavy middle is too much for a Nubbin. It carries the light tip.'),
            ]),
          ],
          'Compared heavy and light, and worked out which part a small Nubbin could carry.',
        ),
      ],
    ),
    sc(
      'a28-05-complete',
      [
        N('Osebo goes up to the Sky-god. He is alive and very cross.'),
        AN('Three! Python, hornets, leopard.', 'happy'),
        AN('Now the hard one. Nobody sees a fairy unless she wants to be seen.'),
        N('Ghana has hot green forest in the south and drier grassland in the north.'),
        N('Leopards live in places like these.'),
      ],
      [
        ask(
          4,
          'social-studies',
          'places have different land: forest and grassland',
          'D2.Geo.2.K-2',
          [
            N(
              '(Point to the green part of the map.) Ghana has forest in the south. What grows in a forest?',
            ),
          ],
          [
            o('Lots of trees.', [N('Yes! A forest is full of trees.')], true),
            o('Only sand.', [N('Sand is for deserts and beaches. A forest is full of trees.')]),
          ],
          'Learned that Ghana has forest in the south and grassland in the north.',
        ),
      ],
    ),
  ],
);

// ================================================================== A28-6 Mmoatia and the Gum Doll
const A6: EduQuest = quest(
  'a28-06',
  'Mmoatia and the Gum Doll',
  {
    'a28-06-s1': {
      goal: 'Carve a small doll for Ananse’s trap.',
      hint: 'Take the wood and knife from Ananse. Carve at the table.',
    },
    'a28-06-s2': {
      goal: 'Hide by the odum tree and watch who comes.',
      hint: 'Crouch behind the big root. Keep still until dusk.',
    },
    'a28-06-s3': {
      goal: 'Choose what to do while Ananse fetches rope.',
      hint: 'Go to the fairy under the odum tree.',
    },
  },
  [
    sc(
      'a28-06-doll',
      [
        AN('Carve me a doll. A small one, with a face and arms and legs.'),
        N('You carve. It comes out round-headed and solemn, with its arms held out.'),
        N('Its head is a circle. Its body is a rectangle.'),
        N('Your Nubbin sits up straighter.'),
        AN('Lovely. Now the gum.'),
      ],
      [
        ask(
          2,
          'maths',
          'name shapes: circle',
          'K.G.A.2',
          [N('The doll’s head is round. Which shape is round: a circle or a square?')],
          [
            o('A circle.', [N('Yes! A circle is round, like the doll’s head.')], true),
            o('A square.', [N('A square has corners. A circle is round, like the doll’s head.')]),
          ],
          'Named a circle as the round shape, using the doll’s head.',
        ),
      ],
    ),
    sc(
      'a28-06-doll-done',
      [
        N('Ananse paints the doll with gum, thick and shiny.'),
        N('Gum is sap from a tree. It is sticky.'),
        N('Your Nubbin touches it. Stuck! It takes both of you to pull it free.'),
        N('Ananse sets a bowl of mashed yam in the doll’s lap.'),
        AN('Now we hide. Very quiet. You especially.'),
      ],
      [
        ask(
          2,
          'science',
          'sorting by how things feel: sticky or not',
          '2-PS1-1',
          [N('Which one is sticky: gum or a feather?')],
          [
            o('Gum.', [N('Yes! Gum is sticky. It holds on to things.')], true),
            o('A feather.', [N('A feather is soft and light, not sticky. Gum is sticky.')]),
          ],
          'Sorted things by a property: gum is sticky, a feather is not.',
        ),
      ],
    ),
    sc(
      'a28-06-fairy',
      [
        N('You hide behind a root until dusk.'),
        N('Something small comes down from the odum tree. It is Mmoatia, a fairy.'),
        MM('Little one, may I have some of your yam?'),
        N('The doll says nothing. Mmoatia eats the yam. Yum.'),
        MM('Thank you. I said thank you.'),
        N('The doll says nothing.'),
        MM('When somebody thanks you, you answer!', 'angry'),
        N('She slaps the doll. Her hand sticks! Then her other hand sticks!'),
        MM('Let go of me!', 'shock'),
        AN('Rope! Stay there. I will fetch rope!', 'happy'),
      ],
      [
        ask(
          6,
          'sel',
          'saying “you’re welcome”',
          'CASEL: Relationship skills',
          [N('Mmoatia said thank you. What can we say back?')],
          [
            o(
              'You’re welcome.',
              [N('Yes! “You’re welcome” shows we heard and we are kind.')],
              true,
            ),
            o('Nothing at all.', [N('Saying “you’re welcome” is kinder. It shows we heard.')]),
          ],
          'Practised answering a thank-you with “you’re welcome”.',
        ),
      ],
    ),
    sc(
      'a28-06-fairy-done',
      [
        N('Then Ananse is gone.'),
        N('The fairy pulls and pulls. Nothing comes apart.'),
        N('Both of her hands are stuck. One hand. Two hands.'),
        N('She stops. She looks straight at your root.'),
      ],
      [
        doit(
          2,
          'maths',
          'count two hands',
          'K.CC.B.5',
          'edu:count:hands:2',
          [N('(Hold up your hands. Count them: one, two.)'), N('Two hands, just like Mmoatia.')],
          'Counted two hands, matching one number to each.',
        ),
      ],
    ),
    sc(
      'a28-06-wait',
      [
        N('It is nearly dark. Far away, a spider is looking for rope.'),
        MM('You. You are with him.', 'angry'),
        N('Mmoatia is not crying. She has gone very still.'),
        N('She is scared. Her eyes are big.'),
        N('Your Nubbin looks at her, then at you.'),
      ],
      [
        ask(
          4,
          'sel',
          'what helps someone who is scared',
          'CASEL: Social awareness',
          [N('Mmoatia is scared. What helps someone who is scared?')],
          [
            o(
              'Staying close and being kind.',
              [N('Yes! Staying close and being kind helps a lot.')],
              true,
            ),
            o('Telling them to hurry up.', [
              N('Hurrying them does not help. Staying close and kind does.'),
            ]),
          ],
          'Talked about how staying close and being kind helps someone who is scared.',
        ),
      ],
      [
        ch(
          'freed',
          'Work one of her hands free.',
          [
            N('You loosen the gum with your thumbs. One small hand comes free.'),
            MM('Only one?', 'think'),
            Y('The other has to stay. It is his story. But you can have that one back.'),
            N('She opens and closes her free hand. She looks at you for a long time.'),
          ],
          { 'a28-fairy': 'freed' },
        ),
        ch(
          'left',
          'Wait by your root.',
          [
            N('You stay by your root. It is the spider’s story, not yours.'),
            MM('I see. Alright.', 'sad'),
            N('She lifts her chin and waits for the rope.'),
          ],
          { 'a28-fairy': 'left' },
        ),
        ch(
          'sat',
          'Sit beside her and wait.',
          [
            N('You sit down beside her in the leaves. Your Nubbin sits on her other side.'),
            N('She glares at you both. After a while she stops glaring.'),
            N('When the frogs start up, she leans a little on your arm.'),
          ],
          { 'a28-fairy': 'sat' },
        ),
      ],
    ),
    sc(
      'a28-06-wait-done',
      [
        N('Ananse comes back at last with lots of rope. He is puffing.'),
        AN('Four! Four, and my mother makes five!', 'happy'),
        N('First the python. Next the hornets. Then the leopard. Last, the fairy.'),
      ],
      [
        ask(
          2,
          'literacy',
          'first, next, last: the order of events',
          'RL.K.3',
          [N('Ananse caught four things, one after another. Which one did he catch first?')],
          [
            o(
              'The python.',
              [N('Yes! First the python, next the hornets, then the leopard, last the fairy.')],
              true,
            ),
            o('The fairy.', [N('The fairy was last. The python was first.')]),
          ],
          'Put story events in order using first, next and last.',
        ),
      ],
    ),
    sc(
      'a28-06-complete',
      [
        N('Ananse ties the fairy, doll and all. He is careful.'),
        N('She goes up the thread with her chin high.'),
        AN('Tomorrow, the court. Wash. You are covered in gum.'),
        N('Your Nubbin is stuck to the yam bowl. It does not mind.'),
        N('Yam grows under the ground. It is a root, full of food.'),
      ],
      [
        ask(
          4,
          'science',
          'some plants grow food underground',
          'ELOF: Scientific Reasoning',
          [N('Where does a yam grow: up in a tree, or under the ground?')],
          [
            o('Under the ground.', [N('Yes! A yam grows under the ground.')], true),
            o('Up in a tree.', [N('Not in a tree! A yam grows under the ground.')]),
          ],
          'Learned that yams grow under the ground.',
        ),
      ],
    ),
  ],
);

// ================================================================== A28-7 Spider Stories
const A7: EduQuest = quest(
  'a28-07',
  'Spider Stories',
  {
    'a28-07-s1': {
      goal: 'Walk with Ya Nsia up to the Sky-god’s court.',
      hint: 'Find Ya Nsia at Ananse’s door. Go up the thread with her.',
    },
    'a28-07-s2': {
      goal: 'Stand in the court while Ananse pays the price.',
      hint: 'Stand a step behind Ananse, among the elders.',
    },
  },
  [
    sc(
      'a28-07-mother',
      [
        N('Ananse’s mother waits at his door. She wears her good cloth.'),
        YA('Kwaku. You said I am included.', 'think'),
        AN('As an honoured guest, Mother! The best stools!', 'happy'),
        N('She takes your arm, not his. Your Nubbin carries her bundle of snacks.'),
        YA('He was always like this. Even in the egg.'),
      ],
      [
        ask(
          4,
          'sel',
          'helping an older person',
          'CASEL: Social awareness',
          [N('Ya Nsia is old. How can you help her walk?')],
          [
            o('Offer her your arm.', [N('Yes! An arm to lean on is a kind way to help.')], true),
            o('Run on ahead.', [
              N('Running ahead leaves her behind. Offering your arm is kinder.'),
            ]),
          ],
          'Talked about helping an older person by offering an arm and walking at her pace.',
        ),
      ],
      [
        ch('proud', 'Tell her she must be proud of him.', [
          YA('Proud. Tired. It is the same face, with a spider.', 'happy'),
        ]),
        ch('arm', 'Just give her your arm, and walk.', [
          N('She pats your hand twice, like a friend.'),
        ]),
      ],
    ),
    sc(
      'a28-07-mother-done',
      [
        N('Up the thread go Ya Nsia, you, your Nubbin and Ananse.'),
        N('The old lady goes first. Ananse comes last, practising what to say.'),
      ],
      [
        doit(
          0,
          'maths',
          'count four climbers',
          'K.CC.B.4',
          'edu:count:climbers:4',
          [
            N('(Point to each climber on the thread and count them.)'),
            N('One, two, three, four. Four climbers! The last number tells how many.'),
          ],
          'Counted four climbers, and understood that the last number counted tells how many there are.',
        ),
      ],
    ),
    sc(
      'a28-07-court',
      [
        N('The elders sit on carved stools in the cloud court.'),
        N('Ananse lays the price on the cloud.'),
        N('The python, the hornets, the leopard and the fairy.'),
        ON('I am still longer than that branch!', 'angry'),
        OS('Spider. I have not forgotten.', 'angry'),
        NY('Kings could not pay. Kwaku Ananse has paid.'),
        NY('From today the stories are his. They will be called spider stories.'),
        N('Ananse takes off his hat and holds it to his chest. For once, he says nothing.'),
      ],
      [
        notice(
          0,
          'social-studies',
          'carved stools are seats of honour in Akan culture',
          'D2.His.2.K-2',
          [
            N('In Ghana, a carved stool can be a seat of honour for elders.'),
            N('People take care of their stools, and treat them with respect.'),
          ],
          'Learned that a carved stool is a seat of honour in Akan culture.',
        ),
      ],
      [
        ch('bow', 'Bow, as the elders do.', [
          N('You bow. Your Nubbin bows too, too low.'),
          N('It has to be helped up off the cloud.'),
        ]),
        ch('clap', 'Clap, before you can stop yourself.', [
          N('You are the only one. Then an elder claps, and another.'),
          N('Soon the whole court is clapping.'),
        ]),
      ],
    ),
    sc(
      'a28-07-court-done',
      [
        NY('Ya Nsia will stay with us as our guest. She will want for nothing.'),
        YA('I will want for the snacks, if the small one gives them back.', 'happy'),
        N('These tales are called Anansesem. That means spider stories.'),
        N('Spider and story both start with the sound sss.'),
      ],
      [
        ask(
          3,
          'literacy',
          'first sounds: sss in spider and story',
          'RF.K.2',
          [N('Spider and story start with the same sound. Is it sss, or mmm?')],
          [
            o('Sss.', [N('Yes! Spider, story: sss, sss.')], true),
            o('Mmm.', [N('Say them slowly: sss-pider, sss-tory. They start with sss.')]),
          ],
          'Heard the same first sound (sss) at the start of spider and story.',
        ),
      ],
    ),
    sc(
      'a28-07-complete',
      [
        N('At the edge of the court, the elders give Ananse a carved box.'),
        N('The python gets a long warm shelf. The leopard gets a shady corner.'),
        N('The hornets are let out into a garden in the sky.'),
        YA('For the small one. You got stuck to more of this than anybody.', 'soft'),
        N('She puts a shawl of spider silk on your Nubbin.'),
      ],
      [
        ask(
          1,
          'science',
          'animals need the right place; snakes like warmth',
          'K-ESS3-1',
          [N('Snakes need to keep warm. Where would a python like to lie?')],
          [
            o('On a warm shelf.', [N('Yes! A snake gets warm from sunny, warm places.')], true),
            o('On cold ice.', [N('Ice is far too cold. A snake likes to lie somewhere warm.')]),
          ],
          'Learned that snakes need warm places, so a python likes a warm shelf.',
        ),
      ],
    ),
  ],
);

// ================================================================== A28-8 The Box Opens
const A8: EduQuest = quest(
  'a28-08',
  'The Box Opens',
  {
    'a28-08-s1': {
      goal: 'Help Ananse carry the box of stories home.',
      hint: 'Take one end of the box. Go down the thread with Ananse.',
    },
    'a28-08-s2': {
      goal: 'Watch what happens when Ananse lifts the lid.',
      hint: 'Stay on the step with Ananse.',
    },
    'a28-08-s3': {
      goal: 'See if Ananse pays what he owes.',
      hint: 'Stay by the empty box on the step.',
    },
  },
  [
    sc(
      'a28-08-carry',
      [
        N('The box is heavy. It is warm like bread, and it hums.'),
        AN('Careful! Every story in the world is in there.'),
        N('You carry one end. Ananse carries the other.'),
        N('Your Nubbin presses its ear to the lid.'),
        AN('Mine. All of them. My name on every one.', 'happy'),
      ],
      [
        ask(
          2,
          'maths',
          'sharing a load: halves',
          '1.G.A.3',
          [N('Two carry one box. Does each carrier carry the whole box, or half?')],
          [
            o('Half.', [N('Yes! Two carriers share it. Each carries half.')], true),
            o('The whole box.', [N('Two carriers share the load. Each carries half.')]),
          ],
          'Understood that two carriers share a load, each carrying half.',
        ),
      ],
    ),
    sc(
      'a28-08-carry-done',
      [
        N('At his door, Ananse puts the box on the step.'),
        AN('I am not going to open it. I just want to look.'),
        N('He looks and looks. It is hard to wait.'),
        N('Waiting is hard, even for a spider.'),
      ],
      [
        ask(
          3,
          'sel',
          'what helps us wait',
          'CASEL: Self-management',
          [N('Ananse finds it hard to wait. What helps us wait?')],
          [
            o('Taking a slow breath.', [N('Yes! Slow breaths and counting help us wait.')], true),
            o('Peeking anyway.', [
              N('Peeking is hard to resist. Slow breaths help us wait better.'),
            ]),
          ],
          'Talked about things that help us wait, like slow breaths and counting.',
        ),
      ],
    ),
    sc(
      'a28-08-open',
      [
        AN('Just a peep. One little story.'),
        N('He lifts the lid a finger’s width. Whoosh!'),
        N('Out comes a story, bright as a bird. Then another!'),
        AN('No! Come back! You are mine!', 'shock'),
        N('The stories fly over trees, hills and sea, to every place.'),
        N('Stories travel when people tell them.'),
      ],
      [
        doit(
          5,
          'literacy',
          'telling a story to someone',
          'SL.K.1',
          'edu:tell:story:grown-up',
          [
            N('(Tell a grown-up one little story. It can be about your day!)'),
            N('Now your story has travelled, from you to them.'),
          ],
          'Told a short story to a grown-up, passing it on the way storytellers do.',
        ),
      ],
      [
        ch('sorry', 'Tell Ananse you’re sorry.', [
          AN('Sorry? Why? They are still mine. Whoever tells them. That was the deal.', 'think'),
        ]),
        ch('watch', 'Watch them go, all the way to the edge of the sky.', [
          N('You watch until the last one is only a glint.'),
          N('It seems the right thing to do with stories.'),
        ]),
      ],
    ),
    sc(
      'a28-08-open-done',
      [
        AN('Everywhere! Everyone will tell them now. Badly, mostly.', 'happy'),
        N('The stories fly over Africa and over a big sea, the Atlantic.'),
        N('Far across the water are islands. One is called Jamaica.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'an island has water all around it',
          'D2.Geo.2.K-2',
          [N('Jamaica is an island. What is all around an island?')],
          [
            o('Water.', [N('Yes! An island has water all around it.')], true),
            o('Only sand.', [
              N('An island has water all the way round it, with land in the middle.'),
            ]),
          ],
          'Learned that an island is land with water all around it, and that Jamaica is an island.',
        ),
      ],
    ),
    sc(
      'a28-08-debt',
      [
        N('Ananse sits by the empty box. Your Nubbin sits by Ananse, with a buttercup.'),
        AN('What have you got there? I will trade you one story for it.'),
        N('Your Nubbin hands over the buttercup.'),
        AN('Here is your story. “Ananse.”', 'happy'),
        N('That is the whole story. One word!'),
        AN('All the stories are about me now. Very handy.'),
      ],
      [
        ask(
          5,
          'literacy',
          'who a story is about (characters)',
          'RL.K.3',
          [N('Ananse’s story had one word. Who was the story about?')],
          [
            o('Ananse.', [N('Yes! The one-word story was about Ananse himself.')], true),
            o('A leopard.', [N('The word was “Ananse”. The story was about him.')]),
          ],
          'Named who a very short story was about.',
        ),
      ],
      [
        ch('fair', 'Tell him that is not a story.', [
          AN(
            'It has a beginning, a middle and an end. They just happen to be the same word.',
            'happy',
          ),
        ]),
        ch('let', 'Let your Nubbin decide.', [
          N('Your Nubbin thinks, and nods.'),
          N('It seems to have enjoyed the story, because it was about someone.'),
        ]),
      ],
    ),
    sc(
      'a28-08-debt-done',
      [
        N('Ananse sits back on his step, very pleased.'),
        N('Buttercups grow all round the step.'),
        N('A buttercup is a yellow flower. It has five petals.'),
      ],
      [
        doit(
          2,
          'science',
          'a buttercup has five petals',
          'ELOF: Scientific Reasoning',
          'edu:count:petals:5',
          [
            N('(Look at a buttercup picture. Count its petals with your finger.)'),
            N('One, two, three, four, five. Five yellow petals!'),
          ],
          'Looked closely at a flower and counted its five petals.',
        ),
      ],
    ),
    sc(
      'a28-08-complete',
      [
        N('Evening comes down on Ananse’s house. The box sits on the step, open and empty.'),
        AN('The best part? I do not have to keep them. Somebody else carries them now.', 'happy'),
        N('Far off, you hear the courtyard fire. People tell stories in the evening.'),
        AN('There. She is telling one. Mine.', 'soft'),
      ],
      [
        ask(
          2,
          'social-studies',
          'people gather in the evening to share stories',
          'D2.His.2.K-2',
          [N('In many villages, people gather by the fire in the evening. What do they share?')],
          [
            o('Stories.', [N('Yes! Telling stories round a fire is a very old tradition.')], true),
            o('Spelling tests.', [N('Not spelling tests! They share stories, songs and food.')]),
          ],
          'Learned that people in many villages gather in the evening to share stories.',
        ),
      ],
    ),
  ],
);

// ================================================================== A28-9 The Pot of Wisdom
const A9: EduQuest = quest(
  'a28-09',
  'The Pot of Wisdom',
  {
    'a28-09-s1': {
      goal: 'Hold the pot while Ananse sweeps up all the wisdom.',
      hint: 'Follow Ananse and keep the pot upright.',
    },
    'a28-09-s2': {
      goal: 'Watch Ananse try to climb with the pot.',
      hint: 'Stand at the foot of the tall tree.',
    },
    'a28-09-s3': {
      goal: 'See what happens to the wisdom.',
      hint: 'Stay under the tall tree. Hold out your hands.',
    },
  },
  [
    sc(
      'a28-09-sweep',
      [
        N('The forest flickers. For a moment you are back at the fire.'),
        ST('Long ago, they say, there was a spider called Kwaku Ananse.'),
        ST('One day he swept up all the wisdom in the world.'),
        N('Back in the forest, Ananse is sweeping. Wisdom looks like bright dust.'),
        AN('Mine. All of it!', 'happy'),
        N('Your Nubbin gets swept into the pile. Ananse tips it out.'),
        AN('Not you. You are not wisdom. You are luggage.'),
      ],
      [
        ask(
          1,
          'literacy',
          'how a story begins: “Long ago, they say…”',
          'ELOF: Literacy',
          [
            N(
              'Storytellers often start with “Long ago, they say…”. Does that start a story, or end it?',
            ),
          ],
          [
            o(
              'It starts a story.',
              [N('Yes! “Long ago, they say…” tells us a story is beginning.')],
              true,
            ),
            o('It ends a story.', [
              N('Stories end with “the end”. “Long ago, they say…” starts one.'),
            ]),
          ],
          'Noticed how a traditional story opening tells listeners that a tale is about to begin.',
        ),
      ],
    ),
    sc(
      'a28-09-sweep-done',
      [
        AN('Now I will hang it at the top of the tallest tree.'),
        N('The tree is very tall. Ananse is very small.'),
      ],
      [
        ask(
          1,
          'maths',
          'compare heights: taller and shorter',
          'K.MD.A.2',
          [N('(Look at the picture.) Which is taller, the tree or Ananse?')],
          [
            o('The tree.', [N('Yes! The tree is much taller than Ananse.')], true),
            o('Ananse.', [N('Look again. The tree is far taller. Ananse is small.')]),
          ],
          'Compared two heights and said which was taller.',
        ),
      ],
    ),
    sc(
      'a28-09-tree',
      [
        N('Ananse ties the pot in front of him and starts to climb.'),
        N('Bump! The pot hits the tree. He slides down.'),
        N('He tries again. Bump! Slide!'),
        AN('This tree is badly made.', 'angry'),
        N('A small spider is watching. It is Ntikuma, his son.'),
        NT('Father, tie the pot on your back. Then you can climb.'),
        AN('Hmph.', 'angry'),
        N('Ananse looks at the pot. He looks at his back. He looks at his son.'),
      ],
      [
        ask(
          7,
          'sel',
          'listening when a small person has a good idea',
          'CASEL: Relationship skills',
          [N('Ntikuma is small, but he has a good idea. What should a grown-up do?')],
          [
            o(
              'Listen to the idea.',
              [N('Yes! Good ideas can come from anybody, big or small.')],
              true,
            ),
            o('Ignore it.', [N('Ignoring a good idea wastes it. Listening is wiser.')]),
          ],
          'Talked about listening to good ideas, even from someone small.',
        ),
      ],
      [
        ch('laugh', 'Try very hard not to laugh.', [
          N('You manage, just. Your Nubbin has its paws over its mouth.'),
        ]),
        ch('nod', 'Give Ntikuma a small nod.', [
          N('Ntikuma nods back, very seriously.'),
          N('Two people who were each right about a pot.'),
        ]),
      ],
    ),
    sc(
      'a28-09-scatter',
      [
        N('Ananse sits in the tree with the pot in his lap.'),
        AN('A small boy knew a thing I did not.', 'sad'),
        N('He throws the pot down. Crash! Pitter-patter!'),
        N('The wisdom flies out like dandelion seeds in the wind.'),
        ST('That is why there is a little wisdom everywhere. Nobody has it all.'),
      ],
      [
        notice(
          3,
          'science',
          'wind carries dandelion seeds far away',
          'ELOF: Scientific Reasoning',
          [
            N('A dandelion seed has a fluffy top, like a tiny parachute.'),
            N('The wind blows it far away. Then a new flower can grow. Whoosh!'),
          ],
          'Learned that the wind carries dandelion seeds to new places.',
        ),
      ],
    ),
    sc(
      'a28-09-scatter-done',
      [
        N('The pieces land on ants, frogs and a very surprised goat.'),
        N('None come your way.'),
        N('Your Nubbin holds out its paws anyway. They stay empty.'),
        N('It is a little sad. But it is glad it tried.'),
      ],
      [
        ask(
          3,
          'sel',
          'trying is worthwhile even without a prize',
          'CASEL: Self-awareness',
          [N('Your Nubbin tried, and got nothing. How might it feel?')],
          [
            o(
              'A bit sad, but proud it tried.',
              [N('Yes! We can feel sad and proud at once.')],
              true,
            ),
            o('Nothing at all.', [N('Look at its face. It feels a bit sad, and glad it tried.')]),
          ],
          'Named mixed feelings: sad about missing out and proud for having tried.',
        ),
      ],
    ),
    sc(
      'a28-09-complete',
      [
        N('Ananse climbs down. Ntikuma waits with the broken pot.'),
        AN('I would have thought of the back. Eventually.', 'think'),
        N('They walk home together. Ananse keeps a leg on his son’s shoulder.'),
        N('You keep the broken gourd. It still sparkles.'),
        N('It broke in two equal halves. Two halves make one whole pot.'),
      ],
      [
        ask(
          4,
          'maths',
          'halves: two equal halves make a whole',
          '1.G.A.3',
          [N('The pot broke into two equal halves. How many halves make a whole pot?')],
          [
            o('Two.', [N('Yes! Two equal halves make one whole.')], true),
            o('Five.', [N('Two halves make one whole. Count them: one half, two halves.')]),
          ],
          'Learned that two equal halves make one whole.',
        ),
      ],
    ),
  ],
);

// ================================================================== A28-10 The Bald Head
const A10: EduQuest = quest(
  'a28-10',
  'The Bald Head',
  {
    'a28-10-s1': {
      goal: 'Go with Ananse and Aso to Aso’s mother’s funeral.',
      hint: 'Walk with them to the family house, where the drums are.',
    },
    'a28-10-s2': {
      goal: 'Keep an eye on Ananse. He is up to something.',
      hint: 'Follow him round the back of the cooking fires.',
    },
    'a28-10-s3': {
      goal: 'Help Ananse look dignified.',
      hint: 'Stay close to him in the crowd. It will not work, but try.',
    },
  },
  [
    sc(
      'a28-10-funeral',
      [
        N('Aso’s mother has died. She was very old, and everyone loved her.'),
        N('Died means her body stopped working. It will not start again.'),
        N('Her family has come to remember her. The yard is full of drums, food and cousins.'),
        N('Being sad is allowed. People stay close and share food.'),
        AS('She would have hated the fuss. She would have counted every chair.', 'soft'),
        MO('Kwaku! Will you eat?'),
        AN('Eat? Never! I will fast out of respect.', 'sad'),
        AS('He has never fasted in his life.'),
      ],
      [
        ask(
          3,
          'social-studies',
          'families gather to remember someone who has died',
          'D2.His.2.K-2',
          [N('In Ghana, families come together when someone dies. What do they do?')],
          [
            o(
              'Share food and remember her together.',
              [N('Yes! Being together helps when we are sad.')],
              true,
            ),
            o('Go away and be alone.', [
              N('People stay together. Being together helps when we are sad.'),
            ]),
          ],
          'Learned that families and neighbours gather to remember someone, and that being together helps when we are sad.',
        ),
      ],
      [
        ch('aso', 'Tell Aso you’re sorry about her mother.', [
          AS('Thank you. She was a hard woman, and fair. She would have liked you.', 'soft'),
        ]),
        ch('help', 'Help carry chairs for the guests.', [
          N('You carry chairs. Your Nubbin carries a stool on its head.'),
          N('Several aunties cheer.'),
        ]),
      ],
    ),
    sc(
      'a28-10-funeral-done',
      [
        N('The drums beat all morning. Boom, boom, boom!'),
        N('A drum has a skin. When you hit it, the skin shakes.'),
        N('By noon, Ananse looks at every pot like a dog at a gate.'),
      ],
      [
        doit(
          1,
          'science',
          'a drum makes sound when its skin shakes',
          '1-PS4-1',
          'edu:feel:drum-skin:shake',
          [
            N('(Tap a table with your hand. Can you feel it shake a tiny bit?)'),
            N('A drum skin shakes, and the shaking makes the boom.'),
          ],
          'Felt a tapped surface shake, and learned that shaking makes sound.',
        ),
      ],
    ),
    sc(
      'a28-10-beans',
      [
        N('Ananse slips behind the cooking fires. A pot of beans bubbles.'),
        N('He scoops up hot beans. He has nowhere to put them!'),
        N('So he puts them in his hat, and puts the hat back on.'),
        AN('Ow. Ow. Ow ow ow.', 'shock'),
        N('A cousin comes round the corner. Ananse stands very straight.'),
        N('He said he would not eat. Now he is hiding beans.'),
      ],
      [
        ask(
          5,
          'sel',
          'keeping a promise',
          'CASEL: Responsible decision-making',
          [N('Ananse said he would not eat. Then he took beans. Is that keeping a promise?')],
          [
            o(
              'No. He broke it.',
              [N('Yes. He broke his promise. Keeping promises matters.')],
              true,
            ),
            o('Yes. He kept it.', [
              N('He said he would not eat, but he did. That breaks a promise.'),
            ]),
          ],
          'Talked about keeping promises and what it means to break one.',
        ),
      ],
      [
        ch('warn', 'Whisper to Ananse to take the hat off.', [
          AN('Take it off? In front of people? With my dignity?', 'shock'),
        ]),
        ch('cover', 'Step in front of him, so the cousin can’t see.', [
          N('You try. Ananse is short, but the steam is tall.'),
        ]),
      ],
    ),
    sc(
      'a28-10-dance',
      [
        N('The beans are very hot. Ananse begins to shake his head.'),
        N('Shake, shake. Shake, shake, shake!'),
        MO('Kwaku, what are you doing?', 'think'),
        AN('A dance! A hat-shaking dance. Very old. Very respectful.'),
        N('Children join in, delighted. Your Nubbin dances too.'),
        AS('Kwaku. Stop.', 'angry'),
      ],
      [
        ask(
          4,
          'maths',
          'a repeating pattern',
          'ELOF: Mathematics Development',
          [N('The children dance a pattern: clap, stomp, clap, stomp, clap… What comes next?')],
          [
            o(
              'Stomp.',
              [N('Yes! Clap, stomp, clap, stomp, clap, stomp. The pattern repeats.')],
              true,
            ),
            o('Clap.', [N('We just clapped. The pattern goes clap, stomp, so next is stomp.')]),
          ],
          'Continued a repeating clap-and-stomp pattern.',
        ),
      ],
    ),
    sc(
      'a28-10-dance-done',
      [
        N('Then the hat comes off on its own. The beans fly everywhere!'),
        N('Ananse’s head is bare and shiny. Everyone laughs, kindly.'),
        N('Hot beans made the hat hot, and the hat made his head hot.'),
      ],
      [
        ask(
          2,
          'science',
          'heat moves from hot things to cooler things',
          'ELOF: Scientific Reasoning',
          [N('Ananse’s head is hot from the beans. What would cool it down?')],
          [
            o('A cool, wet leaf.', [N('Yes! Something cool takes the heat away.')], true),
            o('More hot beans.', [N('More hot beans would make it hotter! A cool leaf cools it.')]),
          ],
          'Learned that hot things warm what they touch, and that something cool takes heat away.',
        ),
      ],
    ),
    sc(
      'a28-10-complete',
      [
        N('Ananse hides in the long grass with his hat in his hand.'),
        AS('Serves him right. Mother would have laughed till she cried.', 'happy'),
        N('The funeral goes on, warmer than before.'),
        N('People tell the story of the beans.'),
        N('That is why the spider is bald, and keeps to the grass.'),
      ],
      [
        ask(
          4,
          'literacy',
          'recalling why something happened in a story',
          'RL.K.3',
          [N('In the story, why is the spider bald?')],
          [
            o('The beans were very hot.', [N('Yes! The hot beans in his hat did it.')], true),
            o('He got a haircut.', [N('No haircut! The hot beans under his hat did it.')]),
          ],
          'Recalled the cause in a “why” story: the hot beans made the spider bald.',
        ),
      ],
    ),
  ],
);

// ================================================================== A28-11 Across the Water
const A11: EduQuest = quest(
  'a28-11',
  'Across the Water',
  {
    'a28-11-s1': {
      goal: 'Follow the page as it turns. See where the spider has gone.',
      hint: 'Touch the corner of the page when it lifts by itself.',
    },
    'a28-11-s2': {
      goal: 'Sit on the step and listen to the elder.',
      hint: 'Take the space the children made for you.',
    },
    'a28-11-s3': {
      goal: 'Hear Miss Ivy’s way of telling the gum story.',
      hint: 'Stay on the step until the story is done.',
    },
  },
  [
    sc(
      'a28-11-yard',
      [
        N('The page lifts and turns. Now it is a different night.'),
        N('Frogs sing. The air smells of the sea.'),
        N('This is a yard in Jamaica. Jamaica is a warm island.'),
        N('An old woman sits on the step with a cup of tea.'),
        N('Children sit on the steps below. Your Nubbin sits with them.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'Jamaica is a warm island',
          'D2.Geo.2.K-2',
          [N('Jamaica is a warm island in the Caribbean Sea. What would you wear there?')],
          [
            o('A sun hat.', [N('Yes! It is warm and sunny in Jamaica.')], true),
            o('A snow coat.', [N('Jamaica is warm, not snowy. A sun hat is better.')]),
          ],
          'Learned that Jamaica is a warm island in the Caribbean Sea.',
        ),
      ],
    ),
    sc(
      'a28-11-yard-done',
      [
        N('One child budges up. There is room for you too.'),
        N('Nobody asks where you came from.'),
        N('Making room feels kind and warm.'),
      ],
      [
        ask(
          2,
          'sel',
          'welcoming someone new',
          'CASEL: Social awareness',
          [N('A new child comes along. What can we do?')],
          [
            o(
              'Make room and say hello.',
              [N('Yes! Making room helps a new friend feel welcome.')],
              true,
            ),
            o('Turn our backs.', [N('Turning away feels lonely. Making room feels welcoming.')]),
          ],
          'Talked about welcoming someone new by making room and saying hello.',
        ),
      ],
    ),
    sc(
      'a28-11-step',
      [
        YC('Miss Ivy, tell an Anancy one. Please.'),
        EL('Which one have I not told you yet?', 'think'),
        YC('You have told us all of them.'),
        EL('Then I will tell one again. That is what they are for.', 'happy'),
        N('She says where Anancy comes from, like saying where a cousin lives.'),
        EL('Long ago, people were taken from Africa by force. They were made to cross the sea.'),
        EL('That was wrong. They kept their stories, and nobody could take those.', 'soft'),
        N('The children nod. They know. This is where the story stands.'),
      ],
      [
        ask(
          6,
          'social-studies',
          'stories can be kept and passed on through hard times',
          'D2.His.2.K-2',
          [N('Miss Ivy says the people kept something nobody could take. What was it?')],
          [
            o(
              'Their stories.',
              [N('Yes. They kept their stories, and told them to their children.')],
              true,
            ),
            o('Their houses.', [
              N('Their stories. Stories travel inside people, so nobody can take them.'),
            ]),
          ],
          'Learned that people who were taken from Africa kept their stories and passed them on.',
        ),
      ],
    ),
    sc(
      'a28-11-step-done',
      [
        EL('Now. Anancy, and the gum.', 'happy'),
        N('Frogs sing in the dark. They call loudly to each other.'),
        N('Frogs sing so other frogs can find them.'),
      ],
      [
        ask(
          2,
          'science',
          'frogs call to each other',
          'ELOF: Scientific Reasoning',
          [N('Why do frogs sing at night?')],
          [
            o(
              'To call to other frogs.',
              [N('Yes! Frogs call so other frogs can find them.')],
              true,
            ),
            o('To make soup.', [N('Silly! Frogs sing to call to other frogs.')]),
          ],
          'Learned that frogs sing to call to each other.',
        ),
      ],
    ),
    sc(
      'a28-11-gum',
      [
        EL('Anancy was stealing peas from a farmer’s field. Every night, a few more.'),
        EL('So the farmer made a little man of wood, and covered him in gum.'),
        EL('Anancy said good evening. The little man said nothing.'),
        N('The children mouth the next part along with her.'),
        EL('So Anancy slapped him, and stuck. Then the other hand, and stuck again.'),
        N('In her story, Anancy got caught. In yours, he was the one catching.'),
      ],
      [
        ask(
          4,
          'literacy',
          'who gets stuck in this telling of the story',
          'RL.K.3',
          [N('In Miss Ivy’s story, who got stuck to the gum man?')],
          [
            o('Anancy.', [N('Yes! In her story, Anancy got stuck.')], true),
            o('The fairy.', [N('The fairy was in your story. In Miss Ivy’s, Anancy got stuck.')]),
          ],
          'Compared two tellings of one story and said who got stuck in this one.',
        ),
      ],
      [
        ch('tell', 'Tell her you heard it the other way round.', [
          EL('Did you now? Where?', 'think'),
          Y('A long way off. The spider made the doll, and a fairy got stuck.'),
          EL('Well. That one is right too. He gets about, that spider.', 'happy'),
        ]),
        ch('listen', 'Just listen to the end.', [
          EL('And how did he get loose? The same way as always. He talked.', 'happy'),
          N('The children cheer.'),
        ]),
      ],
    ),
    sc(
      'a28-11-gum-done',
      [
        N('Your Nubbin looks at its paw. It has stuck to lots of things today.'),
        N('Silk. Sap. Gum. Web.'),
        N('Four sticky things!'),
      ],
      [
        doit(
          1,
          'maths',
          'count four things to find how many',
          'K.CC.B.5',
          'edu:count:sticky-things:4',
          [
            N('(Count on your fingers: silk, sap, gum, web.)'),
            N('One, two, three, four. Four sticky things!'),
          ],
          'Counted four sticky things, one finger for each.',
        ),
      ],
    ),
    sc(
      'a28-11-complete',
      [
        N('The lamp on the nail hums. Somebody turns the radio off.'),
        EL(
          'There are a hundred ways to tell him. Every one is right, if he gets away at the end.',
          'soft',
        ),
        N('Two tellings of one story, on two sides of an ocean.'),
        N('Neither one is wrong.'),
        N('The page lifts. It begins to turn back.'),
      ],
      [
        ask(
          3,
          'sel',
          'respecting that people tell things differently',
          'CASEL: Social awareness',
          [N('Two people tell a story in different ways. Can both tellings be good?')],
          [
            o('Yes, both can be good.', [N('Yes! Each teller can tell it their own way.')], true),
            o('Only one can.', [
              N('Many tellers can each tell it their own way. Both can be good.'),
            ]),
          ],
          'Talked about how two different tellings of one story can both be good.',
        ),
      ],
    ),
  ],
);

// ================================================================== A28-12 Take Some Elsewhere
const A12: EduQuest = quest(
  'a28-12',
  'Take Some Elsewhere',
  {
    'a28-12-s1': {
      goal: 'Come back to the courtyard fire.',
      hint: 'Let the page turn back. Find your mat by the fire.',
    },
    'a28-12-s2': {
      goal: 'Tell the courtyard a story of your own.',
      hint: 'Stand by the stool. You know which story it is.',
    },
    'a28-12-s3': {
      goal: 'Hear the storyteller’s last story of the night.',
      hint: 'Sit back down on your mat.',
    },
  },
  [
    sc(
      'a28-12-return',
      [
        N('The page turns back. It is the courtyard again.'),
        N('The fire is low. The children are sleepy.'),
        N('Moths flutter by the wall.'),
        ST('Another story? It is late.', 'think'),
        ST('Long ago, they say, there was a spider… no. I have told enough.', 'happy'),
        ST('Somebody else tells one now. You. Your turn.'),
        N('Your Nubbin climbs up on the stool beside her.'),
      ],
      [
        ask(
          1,
          'science',
          'a fire needs wood to keep burning',
          'ELOF: Scientific Reasoning',
          [N('The fire is low. What does it need to keep burning?')],
          [
            o('More wood.', [N('Yes! A fire needs wood to burn.')], true),
            o('More water.', [N('Water puts a fire out! A fire needs wood to keep burning.')]),
          ],
          'Learned that a fire needs wood (fuel) to keep burning.',
        ),
      ],
    ),
    sc(
      'a28-12-return-done',
      [
        N('The children turn on their mats to look at you.'),
        N('Four children sit on the front mat. Four sit on the next mat.'),
        N('Everyone waits, just as they waited for her.'),
      ],
      [
        ask(
          1,
          'maths',
          'add within 10: 4 and 4',
          'K.OA.A.2',
          [N('Four children on one mat. Four on another. How many children altogether?')],
          [
            o('Eight.', [N('Yes! Four and four make eight.')], true),
            o('Four.', [N('That is one mat. Four and four more make eight.')]),
          ],
          'Added two groups of four to make eight.',
        ),
      ],
    ),
    sc(
      'a28-12-tell',
      [
        Y('This one is about a fairy and a doll covered in gum.'),
        N('You tell them about the odum tree, the yam and the thank-you.'),
        N('You tell them how she stuck, and how the spider ran for rope.'),
        Y('While he was gone, somebody waited by a root. It was not their story to change.'),
        Y('She went up to the sky caught. But she went up with her chin high.'),
        N('The courtyard is quiet. A small boy at the front frowns. That is a good sign.'),
        ST('Hm. That one is a true one.', 'soft'),
        ST('Things get caught. That is how it is. I will keep a piece of that. The chin.'),
      ],
      [
        ask(
          5,
          'literacy',
          'retelling events in order: first, then, last',
          'RL.K.3',
          [N('What came first: the fairy ate the yam, or she got stuck?')],
          [
            o('She ate the yam.', [N('Yes! First the yam. Then she got stuck.')], true),
            o('She got stuck.', [N('She ate the yam first. Then she got stuck.')]),
          ],
          'Retold a story in order, saying what happened first.',
        ),
      ],
    ),
    sc(
      'a28-12-tell-done',
      [
        N('The storyteller keeps a piece of your story, safe.'),
        N('The children whisper it to each other.'),
        N('It feels good when someone listens to you.'),
      ],
      [
        ask(
          2,
          'sel',
          'listening well to a friend',
          'CASEL: Relationship skills',
          [N('How can you listen well when a friend is talking?')],
          [
            o(
              'Look at them and wait my turn.',
              [N('Yes! Looking and waiting shows you care.')],
              true,
            ),
            o('Talk over them.', [
              N('Talking over a friend is hard to listen to. Looking and waiting is kind.'),
            ]),
          ],
          'Talked about how to listen well: look at the speaker and wait for your turn.',
        ),
      ],
    ),
    sc(
      'a28-12-last',
      [
        ST('One more. A short one. I heard it from a spider.', 'happy'),
        ST('A small round one paid a buttercup for a story.'),
        ST('The story was one word long. The word was the spider’s name.'),
        N('Your Nubbin sits up straight on the stool.'),
        ST('The small round one thought it fair. And it was right.', 'soft'),
        ST('It was a story about someone. That is all stories are.'),
      ],
      [
        ask(
          4,
          'literacy',
          'recalling who did what in a story',
          'RL.K.3',
          [N('Who paid a buttercup for a story?')],
          [
            o('The small round one.', [N('Yes! The small round one paid a buttercup.')], true),
            o('The leopard.', [N('It was the small round one, with a buttercup.')]),
          ],
          'Recalled who paid a buttercup for a story.',
        ),
      ],
    ),
    sc(
      'a28-12-last-done',
      [
        N('The children are quiet for a moment. Then they stretch and yawn.'),
        N('Sparks from the fire float up and up.'),
        N('Hot air goes up. It carries the sparks.'),
      ],
      [
        ask(
          2,
          'science',
          'hot air rises',
          'ELOF: Scientific Reasoning',
          [N('Sparks float up from the fire. Which way does hot air go?')],
          [
            o('Up.', [N('Yes! Hot air goes up, and it carries the sparks with it.')], true),
            o('Down.', [N('Hot air goes up. That is why the sparks float up.')]),
          ],
          'Learned that hot air rises, which carries sparks upward.',
        ),
      ],
    ),
    sc(
      'a28-12-complete',
      [
        N('The old woman stands up. She says the last words.'),
        ST(
          'That is my story. If you liked it, or if you did not, take some with you. Bring some back to me.',
        ),
        CH('Some come back!', 'happy'),
        N('The fire sinks. The courtyard folds into a page.'),
        N('You are in the Grove with Nova’s atlas on your knees.'),
        N('By the hearth is a carved box. Something inside hums.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'sharing stories keeps a tradition alive',
          'D2.His.2.K-2',
          [N('The storyteller says, “Take some with you.” What do we do with a story we love?')],
          [
            o('Share it with someone.', [N('Yes! Sharing a story keeps it alive.')], true),
            o('Hide it forever.', [N('Stories are for sharing. Telling them keeps them alive.')]),
          ],
          'Learned that sharing stories keeps traditions alive.',
        ),
      ],
    ),
  ],
);

// ================================================================== Variant scenes
/**
 * One EduScene per ATLAS_A28_VARIANTS entry. Each has the same lesson domain as the scene it
 * replaces (the margin note is a feelings lesson), so the order of domains holds on every path.
 */
export const EDU_A28_SPROUT_VARIANTS: EduScene[] = [
  // Hazel’s margin note (s24Done): plays straight after a28-01-complete
  sc(
    'a28-margin-hazel',
    [
      N('Beside the courtyard, in soft pencil, there is a note. You know the writing.'),
      N('“Nova says they tell you it isn’t true before they start. Lovely manners.”'),
      N('Under it, there is a tiny spider in a hat.'),
    ],
    [
      ask(
        2,
        'sel',
        'naming a warm feeling',
        'CASEL: Self-awareness',
        [N('Finding a note from someone we love feels warm. How does it feel?')],
        [
          o('Warm and happy.', [N('Yes! A note from someone we love feels warm and happy.')], true),
          o('Nothing at all.', [N('Often it feels warm and happy. It is like a little hug.')]),
        ],
        'Named the warm feeling of finding a note from someone we love, using Hazel’s margin note.',
      ),
    ],
  ),
  // wisp = spared | sable: replaces a28-02-road
  sc(
    'a28-02-road-wisp',
    [
      N('Your bag wiggles. A grey head pops out, torn ear first.'),
      N('It is Wisp. He would not be left at home.'),
      AN('Hello! What is that?', 'think'),
      W('…mine.', 'soft'),
      AN('Lovely stone. I will give you a story for it. Later.', 'happy'),
      N('Wisp hisses. Then he holds out one paw to shake. The other holds the stone tight.'),
      W('deal. …mine still.', 'soft'),
      N('Ananse shakes with one leg. He keeps three crossed behind his back.'),
      AN('I am Kwaku. That is a Wednesday name!', 'happy'),
      N('Your Nubbin sits in sap and sticks. Nobody is surprised.'),
    ],
    [
      ask(
        8,
        'social-studies',
        'days of the week in order',
        'D2.His.2.K-2',
        [N('Ananse says Kwaku is a Wednesday name. Which day comes after Tuesday?')],
        [
          o(
            'Wednesday.',
            [N('Yes! Monday, Tuesday, Wednesday. Wednesday comes after Tuesday.')],
            true,
          ),
          o('Saturday.', [N('Saturday is later. After Tuesday comes Wednesday.')]),
        ],
        'Put days of the week in order, using a Wednesday day name (Kwaku).',
      ),
    ],
    [
      ch('warn', 'Tell Wisp he doesn’t have to.', [
        W('Hsss. Deal.', 'angry'),
        N('He has decided. You can see it in his ears.'),
      ]),
      ch('let', 'Let them shake on it.', [
        N('You let it be. A thief and a spider deserve each other.'),
        N('They both look delighted.'),
      ]),
    ],
  ),
  // a28-wisp = came: replaces a28-08-debt
  sc(
    'a28-08-debt-wisp',
    [
      N('Ananse sits by the empty box. Wisp climbs out of the bag.'),
      W('story. owed.', 'soft'),
      AN('Ah. Yes. A spider always pays.', 'think'),
      N('He hands Wisp a small gourd with a stopper.'),
      AN('A story in a gourd. Do not open it till you are home.'),
      N('Wisp opens it at once. Out comes a hornet! It stings him on the nose.'),
      N('Your Nubbin watches. Its own nose is still lumpy.'),
      N('Wisp sneezes. Then he puts Fern’s old left glove on the step.'),
      W('warm. was warm.', 'soft'),
      AN('A glove! One glove. Thank you.', 'shock'),
      N('Each of them is sure he has won.'),
    ],
    [
      ask(
        5,
        'literacy',
        'recalling events in a story',
        'RL.K.3',
        [N('What came out of the gourd when Wisp opened it?')],
        [
          o('A hornet.', [N('Yes! A hornet came out, and it stung Wisp on the nose.')], true),
          o('A hat.', [N('Not a hat! A hornet flew out of the gourd.')]),
        ],
        'Recalled what happened in a short scene: the gourd held a hornet.',
      ),
    ],
    [
      ch('nose', 'Check Wisp’s nose.', [
        N('He lets you look. There is a small bump.'),
        N('Your Nubbin pats it gently, like a friend.'),
      ]),
      ch('glove', 'Ask Ananse where the story is, then.', [
        AN('It is in the gourd. It was the hornet. A short story with a sting in it.', 'happy'),
      ]),
    ],
  ),
  // a28-fairy = freed: replaces a28-09-scatter-done
  sc(
    'a28-09-scatter-done-freed',
    [
      N('The pieces fall on ants, frogs and a surprised goat.'),
      N('Then something small darts out of the trees. It is Mmoatia!'),
      N('She catches a bright piece in her free hand, the hand you gave back.'),
      MM('Here. A hand for a hand.', 'soft'),
      N('She puts it in your Nubbin’s paws. Then she is gone.'),
    ],
    [
      ask(
        4,
        'sel',
        'saying thank you',
        'CASEL: Relationship skills',
        [N('Mmoatia gave your Nubbin a gift. What do we say?')],
        [
          o('Thank you.', [N('Yes! “Thank you” shows we are grateful.')], true),
          o('Nothing.', [N('Saying “thank you” is kind. It shows we are grateful.')]),
        ],
        'Practised saying thank you for a gift.',
      ),
    ],
  ),
  // a28-fairy = sat: replaces a28-09-scatter-done
  sc(
    'a28-09-scatter-done-sat',
    [
      N('Somebody sits down next to you under the tree. It is Mmoatia.'),
      N('She says nothing at all.'),
      N('Wisdom falls like warm rain, on you and your Nubbin and her.'),
      N('You do not catch any. You just sit and get rained on, together.'),
      N('Afterwards she leans on your arm, just a little. Then she is gone.'),
    ],
    [
      ask(
        3,
        'sel',
        'sitting quietly with a friend',
        'CASEL: Relationship skills',
        [N('Sitting quietly beside a friend can feel good. Why?')],
        [
          o(
            'You do not feel alone.',
            [N('Yes! Being together helps us feel safe and not alone.')],
            true,
          ),
          o('It is boring.', [N('Quiet company can feel warm. We do not feel alone.')]),
        ],
        'Talked about how sitting quietly beside someone can be kind.',
      ),
    ],
  ),
  // a28-fairy = freed: replaces a28-10-dance-done
  sc(
    'a28-10-dance-done-freed',
    [
      N('Behind Ananse, a small figure laughs into her free hand. It is Mmoatia.'),
      N('She reaches up and tips his hat off.'),
      N('The beans fly everywhere. His head is bare and shiny.'),
      MM('A spider caught me once. Fair is fair.', 'happy'),
      N('Everybody laughs. Hers is the loudest.'),
    ],
    [
      ask(
        2,
        'science',
        'heat moves from hot things to cooler things',
        'ELOF: Scientific Reasoning',
        [N('Ananse’s head is hot from the beans. What would cool it down?')],
        [
          o('A cool, wet leaf.', [N('Yes! Something cool takes the heat away.')], true),
          o('More hot beans.', [N('More hot beans would make it hotter! A cool leaf cools it.')]),
        ],
        'Learned that hot things warm what they touch, and that something cool takes heat away.',
      ),
    ],
  ),
  // a28-fairy = sat: replaces a28-10-dance-done
  sc(
    'a28-10-dance-done-sat',
    [
      N('The hat comes off on its own. The beans fly everywhere.'),
      N('Ananse’s head is bare and shiny. Everyone laughs, kindly.'),
      N('Later, he hides in the long grass. Someone small sits down beside him.'),
      N('It is Mmoatia. She says nothing. She lays a cool, wet leaf on his hot head.'),
      N('Ananse says nothing too.'),
    ],
    [
      notice(
        3,
        'science',
        'a cool thing takes heat away from a hot thing',
        'ELOF: Scientific Reasoning',
        [
          N('The leaf is cool and his head is hot. Heat moves into the cool leaf.'),
          N('That is why a cool leaf makes his head feel better.'),
        ],
        'Learned that heat moves from a hot thing into a cool thing, so a cool leaf cools a hot head.',
      ),
    ],
  ),
  // a28-fairy = freed: replaces a28-12-tell
  sc(
    'a28-12-tell-freed',
    [
      Y('This one is about a fairy and a doll covered in gum.'),
      N('You tell them about the odum tree, the yam and the thank-you.'),
      N('You tell them how she stuck, and how the spider ran for rope.'),
      Y('While he was gone, somebody worked one of her hands loose. Only one.'),
      Y('She went up caught, but with a hand of her own. She used it later, on hats.'),
      N('The children laugh. One claps with one hand on his knee.'),
      ST('Ha! That one is a clever one.', 'happy'),
      ST('One hand free, and the story still holds. I will keep a piece. The hand.'),
    ],
    [
      ask(
        5,
        'literacy',
        'retelling events in order: first, then, last',
        'RL.K.3',
        [N('What came first: the fairy ate the yam, or she got stuck?')],
        [
          o('She ate the yam.', [N('Yes! First the yam. Then she got stuck.')], true),
          o('She got stuck.', [N('She ate the yam first. Then she got stuck.')]),
        ],
        'Retold a story in order, saying what happened first.',
      ),
    ],
  ),
  // a28-fairy = sat: replaces a28-12-tell
  sc(
    'a28-12-tell-sat',
    [
      Y('This one is about a fairy and a doll covered in gum.'),
      N('You tell them about the odum tree, the yam and the thank-you.'),
      N('You tell them how she stuck, and how the spider ran for rope.'),
      Y('While he was gone, somebody sat down next to her. They waited with her.'),
      Y('She was still caught when the rope came. But she was not alone.'),
      N('The courtyard is very quiet. A girl at the back leans on her brother. He lets her.'),
      ST('Mm. That one is a kind one.', 'soft'),
      ST('Nothing got fixed, and it is better anyway. I will keep a piece. The sitting.'),
    ],
    [
      ask(
        5,
        'literacy',
        'retelling events in order: first, then, last',
        'RL.K.3',
        [N('What came first: the fairy ate the yam, or she got stuck?')],
        [
          o('She ate the yam.', [N('Yes! First the yam. Then she got stuck.')], true),
          o('She got stuck.', [N('She ate the yam first. Then she got stuck.')]),
        ],
        'Retold a story in order, saying what happened first.',
      ),
    ],
  ),
  // a28-wisp = came: replaces a28-12-last
  sc(
    'a28-12-last-wisp',
    [
      ST('One more. A short one. Nobody asked for it, so listen well.'),
      N('Wisp sits at the edge of the firelight, holding the egg stone.'),
      ST('There was a grey thief with a torn ear, who wanted every warm thing.'),
      ST('He kept a stone that had gone cold. He kept it a long time.'),
      ST('He traded with a spider, and both were cheated, and both went home pleased.'),
      ST('But the spider threw in something for nothing. It was the best thing in the bargain.'),
      N('Wisp’s ears come up. He is looking at her now, not the fire.'),
      N(
        'He listens to the very end. Then he gets up slowly, like someone carrying something full.',
      ),
    ],
    [
      ask(
        2,
        'literacy',
        'who a story is about (characters)',
        'RL.K.3',
        [N('The story has a grey thief with a torn ear. Who is the thief?')],
        [
          o('Wisp.', [N('Yes! The grey thief with the torn ear is Wisp.')], true),
          o('Ananse.', [N('Ananse is the spider. The grey thief with the torn ear is Wisp.')]),
        ],
        'Worked out who a character in a story was, from clues like a torn ear.',
      ),
    ],
  ),
  // Grove wisp = driven: replaces a28-12-last
  sc(
    'a28-12-last-driven',
    [
      ST('One more. A short one. But I do not know the end. You will help me.', 'think'),
      ST('There was a grey one who was sent away from a garden.'),
      ST('Some evenings he comes down the lane. He looks at the gate. He does not try it.'),
      N('The children are very quiet. Your Nubbin looks at you.'),
      ST('How does it end?'),
    ],
    [
      ask(
        2,
        'literacy',
        'recalling who a story is about',
        'RL.K.3',
        [N('Who comes down the lane to look at the gate?')],
        [
          o(
            'The grey one.',
            [N('Yes! The grey one comes down the lane to look at the gate.')],
            true,
          ),
          o('The storyteller.', [N('It is the grey one, the one who was sent away.')]),
        ],
        'Recalled who a story’s character was.',
      ),
    ],
    [
      ch(
        'unknown',
        'Say, “I don’t know.”',
        [
          ST('No. Neither do I. That is a good answer.', 'soft'),
          ST('Keep it open, then. Somebody will finish it.'),
        ],
        { 'a28-gate': 'unknown' },
      ),
      ch(
        'back',
        'Say, “He comes back.”',
        [
          ST('Does he? Good. Then that is how I will tell it.', 'happy'),
          ST('Saying it is half of it. The rest is somebody opening the gate.', 'soft'),
        ],
        { 'a28-gate': 'back' },
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A28_SPROUT: EduQuest[] = [A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12];

/** Every `edu:` check string used by the lessons above. */
export const CHECKS: string[] = [
  'edu:breathe:slow:3',
  'edu:clap:syllables:kwaku',
  'edu:count:children:4',
  'edu:count:climbers:4',
  'edu:count:hands:2',
  'edu:count:legs:8',
  'edu:count:petals:5',
  'edu:count:sticky-things:4',
  'edu:feel:drum-skin:shake',
  'edu:listen:quiet:5',
  'edu:say:refrain:tell-it-anyway',
  'edu:say:rhyme:tree',
  'edu:say:sound-words:drum-buzz',
  'edu:tell:story:grown-up',
];
