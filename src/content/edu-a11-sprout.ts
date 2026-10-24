/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Atlas page A11, The
 * Enchanted Place (Forest, England).
 *
 * Source: atlas-a11.ts (ATLAS_A11 and A11_VARIANTS). One EduScene per original scene, id
 * `sprout:<original id>`: every step scene, every done scene, the twenty complete scenes and
 * all eleven variants. See EDU-STYLE.md.
 *
 * - Learning angles from the outline: which way a stream flows and why the stick on the fast side
 *   wins; spelling wobbles are fine, and how to sound a word out; counting a circle of
 *   “sixty-something” trees; weather words (snow, blustery, flood, mist); how to be a friend to
 *   someone gloomy: sit with them.
 * - No lifted text. The five lines the original quotes (the stairs, “Very Little Brain”, “Silly old
 *   Bear”, the honey line, TUESDAY) are replaced by our own lines. Pooh’s hums, Eeyore’s poem
 *   and the Rissolution are described, never given.
 * - Choice ids and `set` flags are copied from the originals, so a11-gift and a11-mist still work.
 *   Every choice is kept: none leads anywhere cruel. Rabbit’s plan in A11-17 and the swap in
 *   A11-7 are softened to hiding in the mist (Piglet says plainly it is not kind) and a borrowed Roo, and each carries a
 *   “tell a grown-up / stay where you are” beat.
 * - Hard things: nothing dies on this page. The goodbye stays Milne’s: gentle and unexplained.
 *   Nobody says “school” or “growing up”. Hazel’s margin note says she wrote it long ago.
 * - Facts used are well established (kangaroos carry joeys in a pouch, six-legged beetles, snow is
 *   frozen water, mist is tiny water drops, cats climb up more easily than down, Brazil is a
 *   country in South America, a stream runs fastest in the middle).
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
const P = say('a11-pooh');
const PG = say('a11-piglet');
const CR = say('a11-cr');
const E = say('a11-eeyore');
const O = say('a11-owl');
const R = say('a11-rabbit');
const K = say('a11-kanga');
const RO = say('a11-roo');
const T = say('a11-tigger');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

/** One answer option. `best` marks the answer the lesson teaches. */
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

const notice = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | null,
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

const doIt = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | null,
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

/** One sprout scene. Lesson ids are `sprout:<of>-l<n>`, numbered in play order. */
const sc = (of: string, lines: Line[], beats: Beat[], choices?: Choice[]): EduScene => ({
  id: `sprout:${of}`,
  of,
  band: 'sprout',
  lines,
  ...(choices ? { choices } : {}),
  lessons: [...beats]
    .sort((a, b) => a.after - b.after)
    .map((b, i) => ({ id: `sprout:${of}-l${i + 1}`, ...b })),
});

const quest = (
  of: string,
  title: string,
  goals: EduQuest['goals'],
  scenes: EduScene[],
): EduQuest => ({ id: `sprout:${of}`, of, band: 'sprout', title, goals, scenes });

// ================================================================== A11-1 A Boy and a Bear
const Q01: EduQuest = quest(
  'a11-01',
  'A Bear on the Stairs',
  {
    'a11-01-s1': {
      goal: 'Meet the boy and his bear at the edge of the Forest.',
      hint: 'Touch the pencil page. Then walk up the path.',
    },
    'a11-01-s2': {
      goal: 'Hold the balloon string while Pooh floats up to the bees.',
      hint: 'Stand under the big oak tree. Hold on tight.',
    },
    'a11-01-s3': {
      goal: 'Help Pooh come down again. Try not to laugh.',
      hint: 'Keep the string steady.',
    },
  },
  [
    sc(
      'a11-01-page',
      [
        N('The atlas page is drawn in soft pencil.'),
        N('Pencil, pencil, whoosh! Now it is a real, green Forest.'),
        N('A boy comes up the path. He has a bear under his arm.'),
        N('The bear is upside down. He does not mind a bit.'),
        CR('Hello! This is Pooh. He came down the stairs on his head.'),
        P('Hello. Is that a Heffalump?', 'think'),
        CR('No, Pooh. I think it is a Friend.'),
        P('A very small Heffalump. They start small.'),
        N('Your Nubbin looks behind itself. No Heffalump there.'),
      ],
      [
        ask(
          3,
          'maths',
          'compare two things: bigger and smaller',
          'K.MD.A.2',
          [N('(Point to the boy. Point to the bear.) Who is bigger?')],
          [
            opt('The boy', [N('Yes! The boy is bigger. The bear is smaller.')], true),
            opt('The bear', [N('Look again. The boy is taller. The bear is smaller.')]),
          ],
          'Compared two characters by size: bigger and smaller.',
        ),
      ],
      [
        {
          id: 'nubbin',
          label: 'Tell Pooh it is a Nubbin.',
          then: [P('A Nubbin. That is just what a Heffalump would say.', 'think')],
        },
        {
          id: 'decide',
          label: 'Let your Nubbin decide.',
          then: [N('Your Nubbin sits on Pooh’s foot, and Pooh lets it. Nice!')],
        },
        {
          id: 'what',
          label: 'Ask what a Heffalump is.',
          then: [CR('Nobody knows. That is the best sort of animal.')],
        },
      ],
    ),
    sc(
      'a11-01-page-done',
      [
        P('I was going to see about some honey. Come too.'),
        P('Honey is better with someone to watch.', 'happy'),
        N('Pooh hums as he walks. Hum, hum, hum.'),
      ],
      [
        notice(
          2,
          'literacy',
          'listening for the story: who and where',
          'RL.K.3',
          [
            N('Every story has people in it. We call them characters.'),
            N('Here, the characters are Pooh and the boy. The place is a Forest.'),
          ],
          'Heard that stories have characters and a setting.',
        ),
      ],
    ),
    sc(
      'a11-01-balloon',
      [
        N('Buzz, buzz! A buzzing comes from high in an oak.'),
        P('A honey buzz! Honey is always at the top of things.', 'happy'),
        P('Christopher Robin, have you got a balloon?'),
        N('Pooh rolls in mud. Now he is round and black, like a cloud.'),
        N('Your Nubbin rolls in the mud too, just in case.'),
        CR('Hold the string. Do not let go unless he says.'),
        N('Up goes Pooh, past the branches, up to the bees.'),
      ],
      [
        ask(
          6,
          'maths',
          'position words: above and below',
          'K.G.A.1',
          [N('(Point up, then down.) Is Pooh above you, or below you?')],
          [
            opt('Above', [N('Yes! Pooh is above you, up high. You are below, holding on.')], true),
            opt('Below', [N('Look up! Pooh is above you, up high. You are below him.')]),
          ],
          'Used the position words above and below.',
        ),
      ],
    ),
    sc(
      'a11-01-balloon-done',
      [
        N('The string tugs in your hands. Tug, tug.'),
        P('Christopher Robin? These bees look at me very strangely.', 'think'),
        N('Bzzz. The bees buzz round and round.'),
      ],
      [
        notice(
          2,
          'science',
          'bees live in a nest and make honey',
          'K-LS1-1',
          [
            N('Bees live together in a nest. They make honey from flower juice.'),
            N('The honey is their food. Pooh wants some too!'),
          ],
          'Learned that bees live in a nest and make honey for food.',
        ),
      ],
    ),
    sc(
      'a11-01-bees',
      [
        P('Walk up and down with your umbrella. Say it looks like rain.'),
        N('Christopher Robin walks up and down. Nobody is fooled.'),
        P('I shall come down now. But how?', 'think'),
        P('Pop the balloon with your popgun. Gently.'),
        CR('I might miss.'),
        P('Try not to.'),
      ],
      [
        ask(
          3,
          'sel',
          'staying kind when something is funny',
          'CASEL: Social awareness',
          [N('Pooh looks very serious. What is the kind thing to do?')],
          [
            opt(
              'Hold steady and stay quiet',
              [N('Yes. Pooh feels braver when you stay kind.')],
              true,
            ),
            opt('Laugh at him', [N('Funny things can still hurt feelings. A kind friend waits.')]),
          ],
          'Talked about being kind to a friend who is in a silly, scary spot.',
        ),
      ],
      [
        {
          id: 'lip',
          label: 'Bite your lip and hold steady.',
          then: [N('You hold steady. Pooh looks down, and he is glad.')],
        },
        {
          id: 'laugh',
          label: 'Laugh, a little, into your sleeve.',
          then: [
            P('I heard that.', 'sad'),
            CR('It is all right. I laughed too. He forgave me by lunch.'),
          ],
        },
      ],
    ),
    sc(
      'a11-01-bees-done',
      [
        N('Pop! goes the popgun. “Ow!” says Pooh.'),
        P('That was not the balloon.', 'sad'),
        N('Pop! The second one gets the balloon.'),
        N('Pooh floats down like a big, muddy leaf. Whoosh.'),
      ],
      [
        notice(
          3,
          'literacy',
          'sound words: pop, ow, whoosh',
          'RL.1.4',
          [
            N('Pop! Ow! Whoosh! These are sound words.'),
            N('(Say them together. Make the sounds big, then small.)'),
          ],
          'Played with sound words in a story.',
        ),
      ],
    ),
    sc(
      'a11-01-complete',
      [
        N('Pooh’s arms stay up in the air, like a surprised bear.'),
        CR('They will come down in a week. Pooh, blow that fly off.'),
        N('Pooh blows the fly off his nose. He is proud.'),
        N('Christopher Robin ties a blue ribbon on your Nubbin.'),
        CR('So everyone knows it is a Friend.'),
        N('A ribbon is tied in a bow. First one loop, then another.'),
      ],
      [
        notice(
          5,
          'sel',
          'a friend is someone who is kind to you',
          'ELOF: Social and Emotional Development',
          [
            CR('A friend is someone who is kind and glad to see you.'),
            CR('Now you are a Friend of the Forest. A good thing to be.'),
          ],
          'Heard what makes a friend: being kind and glad to see someone.',
        ),
      ],
    ),
  ],
);

// ================================================================== A11-2 A Tight Place
const Q02: EduQuest = quest(
  'a11-02',
  'A Tight Place',
  {
    'a11-02-s1': {
      goal: 'Go visiting with Pooh, to Rabbit’s.',
      hint: 'Follow Pooh along the sandbank to the hole.',
    },
    'a11-02-s2': {
      goal: 'Fetch Christopher Robin to see the stuck bear.',
      hint: 'Run to his house. Then walk back together.',
    },
    'a11-02-s3': {
      goal: 'Read to Pooh while he gets thinner.',
      hint: 'Sit by Pooh’s head. Choose a story.',
    },
  },
  [
    sc(
      'a11-02-visit',
      [
        N('Pooh hums along the sandbank. Hum, hum.'),
        P('A hole! A hole means Rabbit. Rabbit means a little something.', 'happy'),
        R('Nobody is in. Go away.'),
        P('Then who said that?', 'think'),
        R('Nobody. I said it for him.'),
        R('Oh, all right. Come in. Wipe your feet.'),
        N('Pooh has a little honey, then a little more, then the rest.'),
      ],
      [
        notice(
          5,
          'sel',
          'sharing: leave some for others',
          'CASEL: Social awareness',
          [
            N('Pooh ate all of Rabbit’s honey. Sharing means leaving some for others.'),
            N('A good guest asks, “Is there enough for everyone?”'),
          ],
          'Heard that sharing means leaving some for others.',
        ),
      ],
    ),
    sc(
      'a11-02-visit-done',
      [
        R('Must you go? What a shame.'),
        N('Pooh pushes out of the front door.'),
        N('His front half gets out. The rest is too full of honey.'),
        P('Oh dear. I seem to have stopped.', 'shock'),
      ],
      [
        ask(
          1,
          'maths',
          'compare: wide and narrow',
          'K.MD.A.2',
          [N('The door is small. Pooh is round. Is the door wide, or narrow?')],
          [
            opt('Narrow', [N('Yes, narrow. And Pooh is wide. That is why he is stuck.')], true),
            opt('Wide', [N('Wide is the other way. This door is narrow, and Pooh is wide.')]),
          ],
          'Used the words wide and narrow to compare a door and a bear.',
        ),
      ],
    ),
    sc(
      'a11-02-stuck',
      [
        N('Pooh is stuck. His head is out in the sun.'),
        P('I cannot go forwards. I cannot go back.', 'sad'),
        R('Somebody ate too much honey. I am only saying.'),
        N('You run for Christopher Robin. He walks back calmly.'),
        CR('He will have to stay until he is thin again. A week.'),
        P('A week! What about meals?', 'shock'),
        P('Please read to me. Something comforting.', 'sad'),
      ],
      [
        notice(
          4,
          'sel',
          'asking for help when you are stuck',
          'CASEL: Self-management',
          [
            N('Pooh is stuck. He did not hide it. He told everyone.'),
            N('When we are stuck, asking for help is the clever thing to do.'),
          ],
          'Heard that asking for help is a clever thing to do when you are stuck.',
        ),
      ],
    ),
    sc(
      'a11-02-stuck-done',
      [
        CR('We will take turns. You read in the mornings.'),
        CR('I will read in the afternoons.'),
        N('Pooh sniffs. Then he smiles a very small smile.'),
      ],
      [
        notice(
          1,
          'literacy',
          'sharing books by reading aloud',
          'ELOF: Literacy',
          [
            N('Reading to someone is a lovely gift.'),
            N('Your voice makes the words come alive, like a friend in the room.'),
          ],
          'Heard that reading aloud is a kind way to keep someone company.',
        ),
      ],
    ),
    sc(
      'a11-02-week',
      [
        N('So you sit on the sandbank. You read to Pooh.'),
        N('Inside the hole, Rabbit hangs his washing on Pooh’s back legs.'),
        R('It is a waste of good legs otherwise.'),
        P('I do not mind. What is on them?'),
        R('Tea towels.'),
        N('Your Nubbin gives Pooh an acorn to look at.'),
        P('What are we reading today?'),
      ],
      [
        doIt(
          6,
          'maths',
          'put the days of the week in order, to 7',
          'K.CC.A.1',
          'edu:order:days-of-week',
          [
            N('A week has seven days. One, two, three, four, five, six, seven.'),
            N('Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.'),
            N('(Say them together. Count one on your fingers for each.)'),
          ],
          'Said the seven days of the week in order and counted them.',
        ),
      ],
      [
        {
          id: 'bear',
          label: 'A story about a bear who was exactly the right size.',
          then: [P('I like him. Does he get stuck?', 'happy'), Y('Never.'), P('Lucky bear.')],
        },
        {
          id: 'sea',
          label: 'A book about the sea, where there are no doors.',
          then: [P('No doors? That sounds very comfortable.', 'soft')],
        },
        {
          id: 'quiet',
          label: 'Just sit with him. Do not read.',
          then: [
            N('You sit by his head. You say nothing at all.'),
            P('That is the most comforting one so far.', 'soft'),
          ],
        },
      ],
    ),
    sc(
      'a11-02-week-done',
      [
        N('On the seventh day, Christopher Robin takes Pooh’s paws.'),
        N('Rabbit takes Christopher Robin. Rabbit’s family takes Rabbit.'),
        N('You are at the end. Your Nubbin takes you.'),
        CR('Pull! Pull! Pull!'),
        N('Pop! Out comes Pooh, and everybody sits down at once.'),
      ],
      [
        notice(
          2,
          'science',
          'pulling together is stronger than pulling alone',
          '3-PS2-1',
          [
            N('One friend pulling is not enough. A long line of friends is much stronger.'),
            N('When we all pull the same way, big things can move.'),
          ],
          'Noticed that many friends pulling together can move something heavy.',
        ),
      ],
    ),
    sc(
      'a11-02-complete',
      [
        P('Thank you all. Especially the one at the end.', 'happy'),
        N('Pooh walks off humming. He is thinner now.'),
        R('He will be back. I need a wider door.', 'think'),
        N('Rabbit looks at the empty hall. He almost misses the legs.'),
      ],
      [
        notice(
          3,
          'sel',
          'a good friend waits with you',
          'CASEL: Relationship skills',
          [
            N('For a whole week, friends sat and waited with Pooh.'),
            N('Waiting with someone is a way of saying, I care about you.'),
          ],
          'Heard that sitting and waiting with a friend shows you care.',
        ),
      ],
    ),
  ],
);

// ================================================================== A11-3 The Woozle
const Q03: EduQuest = quest(
  'a11-03',
  'The Woozle',
  {
    'a11-03-s1': {
      goal: 'Follow Pooh round the trees after the mystery tracks.',
      hint: 'Walk round the spinney in the snow. Do not tell the secret yet.',
    },
    'a11-03-s2': {
      goal: 'Watch from the oak with Christopher Robin.',
      hint: 'Climb the big oak and keep quiet.',
    },
  },
  [
    sc(
      'a11-03-tracks',
      [
        N('It is a snowy day. Piglet sweeps snow off his step.'),
        N('Pooh goes past, round and round in a circle.'),
        PG('Pooh, why do you go round and round?'),
        P('I am following something. Paw prints!', 'think'),
        PG('A Woozle?', 'shock'),
        P('It might be. Woozles are hard to tell from the front.'),
        N('Your Nubbin puts its feet carefully in the snow.'),
      ],
      [
        notice(
          0,
          'science',
          'snow is frozen water',
          '2-ESS2-3',
          [
            N('Snow is water that has frozen into tiny, soft crystals.'),
            N('When the sun comes out, snow melts back into water. Drip, drip.'),
          ],
          'Learned that snow is frozen water and melts when it warms up.',
        ),
      ],
      [
        {
          id: 'tell',
          label: 'Tell them the little prints are your Nubbin’s.',
          then: [P('Yes, yes. Do keep up.'), N('Nobody listens. They are too busy tracking.')],
        },
        {
          id: 'hush',
          label: 'Say nothing. Let it play out.',
          then: [N('You say nothing. It feels like carrying a full cup.')],
        },
        {
          id: 'again',
          label: 'Let your Nubbin go round once more.',
          then: [N('Round goes your Nubbin. Now there is one more set of prints.')],
        },
      ],
    ),
    sc(
      'a11-03-tracks-done',
      [
        N('Round they go. Round and round.'),
        N('Every time, there are more tracks.'),
        N('(Point to the footprints. Count them: one, two, three.)'),
      ],
      [
        doIt(
          2,
          'maths',
          'count footprints to 3',
          'K.CC.B.5',
          'edu:count:footprints:3',
          [
            N('Pooh’s prints. Piglet’s prints. Your Nubbin’s tiny prints.'),
            N('One, two, three sets. Each friend makes their own.'),
          ],
          'Counted three sets of footprints, one for each walker.',
        ),
      ],
    ),
    sc(
      'a11-03-count',
      [
        P('Look! Two Woozles now. And one little one.', 'shock'),
        PG('I just remembered something I meant to do. Bye!', 'shock'),
        N('Up in the oak, Christopher Robin sits very still.'),
        CR('Do not say anything. It is better when he finds out himself.'),
        N('Pooh puts his foot in a print. It fits!'),
        P('Oh.', 'think'),
        N('Piglet looks at your Nubbin’s feet. He goes pink.'),
      ],
      [
        ask(
          4,
          'science',
          'testing an idea: does my foot fit the print?',
          'ELOF: Scientific Reasoning',
          [N('Pooh tries his foot in the print. How does he find out?')],
          [
            opt(
              'He tries it and sees if it fits',
              [N('Yes! Trying it is a clever way to find out.')],
              true,
            ),
            opt('He guesses', [
              N('Guessing is a start. Trying his foot is how he really finds out.'),
            ]),
          ],
          'Saw that testing an idea (does the foot fit?) is a way of finding out.',
        ),
      ],
    ),
    sc(
      'a11-03-count-done',
      [
        N('Christopher Robin climbs down from the tree.'),
        CR('Oh, Pooh. Whose footprints do you think those are?', 'happy'),
        P('My own. I have been following my own feet.', 'sad'),
        CR('There is no better bear anywhere.', 'soft'),
      ],
      [
        notice(
          3,
          'sel',
          'feeling silly is fine; friends are kind',
          'CASEL: Self-awareness',
          [
            N('Pooh felt a little silly. Everybody feels silly sometimes.'),
            N('Christopher Robin did not laugh at him. He said something kind.'),
          ],
          'Heard that feeling silly is ordinary and kind friends stay kind.',
        ),
      ],
    ),
    sc(
      'a11-03-complete',
      [
        P('Being silly is hungry work. Is it lunch?', 'happy'),
        N('Pooh and Christopher Robin go home.'),
        N('Piglet walks a long way round your Nubbin. Then a shorter way.'),
        PG('I knew it was not a Woozle. Mostly.', 'soft'),
        N('Your Nubbin holds out a paw. Piglet shakes it, twice.'),
      ],
      [
        ask(
          2,
          'maths',
          'compare: a long way and a short way',
          'K.MD.A.2',
          [N('First Piglet goes a long way round. Then a short way. Which is shorter?')],
          [
            opt(
              'The second way',
              [N('Yes! The second way is shorter. Piglet is less worried now.')],
              true,
            ),
            opt('The first way', [
              N('The first way was long. The second way is shorter, and closer.'),
            ]),
          ],
          'Compared a long path and a short path, and saw Piglet grow less worried.',
        ),
      ],
    ),
  ],
);

// ================================================================== A11-4 Eeyore's Tail
const Q04: EduQuest = quest(
  'a11-04',
  'Eeyore’s Tail',
  {
    'a11-04-s1': {
      goal: 'Find out what is wrong with Eeyore.',
      hint: 'He is in the thistly corner of the Forest.',
    },
    'a11-04-s2': {
      goal: 'Go with Pooh to ask Owl.',
      hint: 'Owl lives high in a tree, behind a grand door.',
    },
    'a11-04-s3': {
      goal: 'Hold the tail straight while Christopher Robin nails it on.',
      hint: 'Carry the tail back. Hold it where Christopher Robin points.',
    },
  },
  [
    sc(
      'a11-04-gloomy',
      [
        N('Eeyore is a grey donkey. He stands in the thistles, all by himself.'),
        P('Good morning, Eeyore.'),
        E('Good morning. If it is. Which I doubt.', 'sad'),
        P('What is the matter?'),
        E('Nothing. Nobody minds.'),
        N('Pooh walks round Eeyore. Then round again.'),
        P('Eeyore! Where is your tail?', 'shock'),
        E('It is gone. That explains a great deal.', 'sad'),
      ],
      [
        ask(
          7,
          'sel',
          'how a sad friend feels, and what helps',
          'ELOF: Social and Emotional Development',
          [N('Eeyore is sad. What could help him?')],
          [
            opt('Sit with him and help look', [E('Thank you. That helps a bit.', 'soft')], true),
            opt('Tell him not to be sad', [
              N('Feelings do not just go away. Sitting with him helps more.'),
            ]),
            opt('Walk away', [N('Eeyore is lonely. Staying close helps more.')]),
          ],
          'Talked about being with a sad friend and helping.',
        ),
      ],
      [
        {
          id: 'promise',
          label: 'Promise you will help find it.',
          then: [E('Kind of you. Do not trouble. Somebody is using it, I expect.')],
        },
        {
          id: 'sit',
          label: 'Sit with him for a moment first.',
          then: [
            N('You sit in the prickly thistles beside him.'),
            N('Eeyore notices, and does not say so. That is his thank you.'),
          ],
        },
        {
          id: 'look',
          label: 'Look behind the thistles.',
          then: [N('Your Nubbin looks behind the thistles and under a stone. No tail.')],
        },
      ],
    ),
    sc(
      'a11-04-gloomy-done',
      [
        P('I shall find your tail, Eeyore. Me. Pooh.'),
        E('Thank you, Pooh. You are a real friend.', 'soft'),
        N('Eeyore’s ears lift, just a little.'),
      ],
      [
        notice(
          2,
          'science',
          'thistles are prickly to keep animals off',
          '4-LS1-1',
          [
            N('Thistles have sharp prickles all over.'),
            N('The prickles help the plant. Most animals do not want to nibble it.'),
          ],
          'Learned that thistle prickles help protect the plant.',
        ),
      ],
    ),
    sc(
      'a11-04-owl',
      [
        N('Owl lives high in a tree, behind a grand door.'),
        N('There are two signs by the door. They are spelled in Owl’s own way.'),
        O('Ah, Pooh. How do you do?'),
        P('Eeyore has lost his tail. How do I find it?'),
        O('There is a Proper Way. First, one Puts Up a Notice.'),
        P('I am only a small bear. Big words make my head go fuzzy.'),
        O('A Notice is a sign. One writes on it and pins it up.'),
        O('Usually I do the writing.'),
        N('Your Nubbin is not listening. It stares at the bell-pull.'),
      ],
      [
        ask(
          5,
          'literacy',
          'asking what a word means',
          'L.2.4',
          [N('Pooh does not know the big words. What can he do?')],
          [
            opt(
              'Ask Owl what the word means',
              [O('Quite right. “Notice” just means a sign.')],
              true,
            ),
            opt('Pretend he knows', [N('Asking is brave and clever. Owl is happy to explain.')]),
          ],
          'Saw that asking what a new word means is a good thing to do.',
        ),
      ],
    ),
    sc(
      'a11-04-owl-done',
      [
        P('Owl, that bell-pull. Where did you get it?', 'think'),
        O('I found it on a bush. It came away in my wing.'),
        P('It is Eeyore’s! It is his tail!'),
        N('(Point to the grey tail with a tuft at the end.)'),
      ],
      [
        notice(
          3,
          'science',
          'looking closely finds things',
          'ELOF: Scientific Reasoning',
          [
            N('Your Nubbin did not listen to the long words. It looked closely.'),
            N('Looking carefully is how scientists find answers.'),
          ],
          'Heard that looking closely helps us find answers.',
        ),
      ],
    ),
    sc(
      'a11-04-nail',
      [
        N('You carry the tail carefully, as if it might wake.'),
        N('Christopher Robin has a little hammer and one tiny nail.'),
        CR('Hold it straight. There. Eeyore, this will not hurt.'),
        E('Do not mind me.'),
        N('Tap, tap. Eeyore does not flinch, but your Nubbin does, twice.'),
        E('Hm. It works. Not that anyone asked.'),
        N('Swish, swish! Eeyore swishes his tail, and he is happy.'),
      ],
      [
        doIt(
          4,
          'maths',
          'count the taps: 2',
          'K.CC.B.5',
          'edu:count:taps:2',
          [N('Tap, tap. (Tap the table with me.)'), N('One tap, two taps. The tail is on tight.')],
          'Counted two taps of the hammer while a tail was fixed on.',
        ),
      ],
    ),
    sc(
      'a11-04-nail-done',
      [
        E('Thank you, Pooh. And the one with the bow.', 'soft'),
        N('Eeyore swishes his tail. Swish.'),
        N('He is glad. He would rather you did not mention it.'),
      ],
      [
        notice(
          1,
          'literacy',
          'sound words: swish',
          'RL.1.4',
          [
            N('Swish is a sound word. It sounds like what it does.'),
            N('(Swish your arm like a tail: swish, swish!)'),
          ],
          'Heard and acted out the sound word swish.',
        ),
      ],
    ),
    sc(
      'a11-04-complete',
      [
        N('Pooh walks home. He feels he has done a Good Deed.'),
        N('He is ready for a little something by eleven o’clock.'),
        P('Owl knows ever such a lot. But your Nubbin looked at the bell-pull.', 'happy'),
        N('Your Nubbin looks proud.'),
      ],
      [
        notice(
          3,
          'sel',
          'everyone is good at something different',
          'CASEL: Self-awareness',
          [
            N('Owl is good at long words. Your Nubbin is good at looking.'),
            N('Everybody is good at something. It all helps.'),
          ],
          'Heard that everyone has different things they are good at.',
        ),
      ],
    ),
  ],
);

// ================================================================== A11-5 The Heffalump Trap
const Q05: EduQuest = quest(
  'a11-05',
  'The Very Deep Pit',
  {
    'a11-05-s1': {
      goal: 'Help Pooh and Piglet dig a deep pit by the Six Pine Trees.',
      hint: 'Dig where Pooh points.',
    },
    'a11-05-s2': {
      goal: 'Keep the lantern steady while Pooh checks the honey.',
      hint: 'Walk with Pooh and hold the lantern still.',
    },
    'a11-05-s3': {
      goal: 'Let Piglet meet the “Heffalump”. Do not explain.',
      hint: 'Stay by the pit with the lantern.',
    },
  },
  [
    sc(
      'a11-05-dig',
      [
        CR('I saw a Heffalump today. I think.'),
        PG('A Heffalump! Pooh, what do we do?', 'shock'),
        P('We catch it in a Very Deep Pit, by the Six Pine Trees.', 'think'),
        N('Piglet digs and Pooh watches. You do most of it.'),
        N('Your Nubbin moves one pebble a very long way.'),
        PG('What do Heffalumps like?'),
        P('Honey.', 'happy'),
      ],
      [
        doIt(
          5,
          'maths',
          'count the pine trees: 6',
          'K.CC.B.5',
          'edu:count:pine-trees:6',
          [
            N('The Six Pine Trees stand in a row. (Point and count them.)'),
            N('One, two, three, four, five, six. Six pine trees!'),
          ],
          'Counted six pine trees by pointing at each one.',
        ),
      ],
      [
        {
          id: 'then',
          label: 'Ask what they will do once it is caught.',
          then: [P('Be very polite to it, I expect.'), PG('Oh, d-dear.', 'shock')],
        },
        {
          id: 'step',
          label: 'Dig a little step in one side, in case.',
          then: [
            PG('A step? For the Heffalump?'),
            Y('For anyone who falls in by mistake.'),
            P('Very sensible.'),
          ],
        },
        {
          id: 'deep',
          label: 'Check it is deep enough.',
          then: [N('You climb in. It comes up to your chin!')],
        },
      ],
    ),
    sc(
      'a11-05-dig-done',
      [
        N('Pooh fetches his very last jar of honey.'),
        N('He lowers it into the pit. Down, down, down.'),
        N('He looks at it for a long time.'),
      ],
      [
        notice(
          2,
          'science',
          'honey keeps for a very long time',
          'K-LS1-1',
          [
            N('Honey is made by bees, and it keeps for a very long time.'),
            N('That is why Pooh’s last jar will still be good tomorrow.'),
          ],
          'Learned that honey keeps for a very long time.',
        ),
      ],
    ),
    sc(
      'a11-05-night',
      [
        N('That night Pooh cannot sleep.'),
        P('I will see if the honey is still there. Hold the lantern?', 'think'),
        N('You walk with the lantern. Your Nubbin stays in the light.'),
        N('Pooh climbs down into the pit and licks the honey.'),
        P('Mmff. Mmff mff.', 'shock'),
        N('The jar is stuck on Pooh’s head!'),
      ],
      [
        ask(
          2,
          'maths',
          'position words: inside and outside',
          'K.G.A.1',
          [N('Your Nubbin stays in the circle of light. Is it inside, or outside?')],
          [
            opt('Inside', [N('Yes! Inside the light. Outside, it is dark.')], true),
            opt('Outside', [N('Look again. It stays inside the light, where it can see.')]),
          ],
          'Used the position words inside and outside.',
        ),
      ],
      [
        {
          id: 'steady',
          label: 'Hold the lantern steady and wait.',
          then: [N('You hold it steady. It trembles once, because you giggle.')],
        },
        {
          id: 'pull',
          label: 'Try to pull the jar off.',
          then: [N('It will not come. This will have to be a morning job.')],
        },
      ],
    ),
    sc(
      'a11-05-night-done',
      [
        N('Pooh climbs out somehow.'),
        N('He wanders off in the grey morning, with the jar on his head.'),
        P('Mmff mmm mmff.', 'happy'),
      ],
      [
        ask(
          1,
          'science',
          'sounds are muffled inside a jar',
          '1-PS4-1',
          [N('Pooh talks inside the jar. Do his words sound loud and clear?')],
          [
            opt(
              'No, they sound muffled and boomy',
              [N('Yes! A jar changes how a voice sounds.')],
              true,
            ),
            opt('Yes, loud and clear', [
              N('Not quite. In a jar the voice sounds muffled and boomy.'),
            ]),
          ],
          'Noticed that a voice sounds different inside a jar.',
        ),
      ],
    ),
    sc(
      'a11-05-morning',
      [
        N('At first light, Piglet comes to look.'),
        N('A big round head walks round the pit. Roar!'),
        N('Pooh says “Mmff” inside the jar. It comes out as a roar.'),
        PG('Help! A Heffalump! It has Pooh’s honey!', 'shock'),
        N('Piglet runs to Christopher Robin.'),
        N('You stay with the lantern. You do not explain.'),
        N('The jar bangs on a root and breaks. There is Pooh!'),
        PG('…Oh. It was Pooh.', 'sad'),
      ],
      [
        ask(
          2,
          'maths',
          'shapes: round is a circle',
          'K.G.A.2',
          [N('The big head is round. Which shape is round?')],
          [
            opt('A circle', [N('Yes! A circle is round, like the jar on Pooh’s head.')], true),
            opt('A square', [N('A square has corners. A round shape is a circle.')]),
          ],
          'Named a round shape: a circle.',
        ),
      ],
    ),
    sc(
      'a11-05-morning-done',
      [
        N('Piglet goes home to bed. He has a headache.'),
        N('Pooh goes home to breakfast.'),
        N('Your Nubbin keeps one piece of the jar.'),
      ],
      [
        notice(
          1,
          'sel',
          'being scared is fine; checking helps',
          'CASEL: Self-management',
          [
            N('Piglet got a big fright. Frights make hearts go thump.'),
            N('A deep breath helps. So does looking again, slowly.'),
          ],
          'Heard that being frightened is normal and slow breaths and a second look help.',
        ),
      ],
    ),
    sc(
      'a11-05-complete',
      [
        P('I thought I might be a Heffalump. It was echoey in there.'),
        CR('You were a bear in a jar. That is better.'),
        P('Then who is the Heffalump?', 'think'),
        N('Everyone looks at your Nubbin. It looks behind itself.'),
      ],
      [
        notice(
          0,
          'literacy',
          'funny stories: a mix-up',
          'RL.K.3',
          [
            N('A mix-up! Piglet saw a bear in a jar and thought Heffalump.'),
            N('Stories make us laugh when someone gets the wrong idea.'),
          ],
          'Noticed how a mix-up makes a story funny.',
        ),
      ],
    ),
  ],
);

// ================================================================== A11-6 Eeyore's Birthday
const Q06: EduQuest = quest(
  'a11-06',
  'Eeyore’s Birthday',
  {
    'a11-06-s1': {
      goal: 'Find out why Eeyore is sadder than usual.',
      hint: 'He is by the stream, looking at the water.',
    },
    'a11-06-s2': {
      goal: 'Go with Pooh and Piglet to fetch presents.',
      hint: 'Carry the honey pot for Pooh.',
    },
    'a11-06-s3': {
      goal: 'Choose what your Nubbin gives Eeyore.',
      hint: 'There is no wrong present. Nothing at all is a choice.',
    },
  },
  [
    sc(
      'a11-06-stream',
      [
        N('Eeyore stands by the stream. He looks at himself in the water.'),
        E('Even the one in the water looks glum.', 'sad'),
        P('Good morning, Eeyore.'),
        E('Is it? It would be just like it.'),
        E('It is my birthday. Not that it matters.'),
        P('Your birthday!', 'shock'),
        E('How many presents? None. That is zero. I counted twice.'),
        N('Pooh looks left and right. No presents.'),
        P('Wait here, Eeyore.'),
      ],
      [
        ask(
          7,
          'maths',
          'zero means none',
          'K.CC.B.5',
          [N('Eeyore counted his presents. How many did he have?')],
          [
            opt(
              'Zero. None at all',
              [N('Yes! Zero means none. Eeyore has no presents yet.')],
              true,
            ),
            opt('One', [N('One would be a present. “None” means zero: nothing at all.')]),
          ],
          'Learned that none means zero.',
        ),
      ],
    ),
    sc(
      'a11-06-presents',
      [
        N('Pooh has a pot of honey. Piglet has a green balloon.'),
        N('Your Nubbin carries a thistle in both paws.'),
        N('Pooh sits down. He peeks in the pot, just to see.'),
        N('Lick, lick, lick. The pot is empty!'),
        P('Bother. I ate my present.', 'sad'),
        P('But a pot is useful! I will give Eeyore a Useful Pot.', 'happy'),
        N('Piglet runs to be first, and trips. He lands on the balloon.'),
        N('Bang! Now it is a bit of damp rag.'),
        PG('Oh, d-dear.', 'sad'),
      ],
      [
        notice(
          8,
          'science',
          'a balloon is full of air that pushes out',
          'ELOF: Scientific Reasoning',
          [
            N('A balloon is full of air. The air pushes out on the rubber.'),
            N('Squash it too hard, and bang! The air rushes out.'),
          ],
          'Learned that squashing a balloon too hard makes it burst.',
        ),
      ],
    ),
    sc(
      'a11-06-presents-done',
      [
        N('Your Nubbin looks at the pot, the rag and the thistle.'),
        N('The pot is empty, the rag is floppy, and the thistle is prickly.'),
        N('(Touch your arm. Is it soft or prickly?)'),
      ],
      [
        notice(
          1,
          'literacy',
          'describing words for how things feel',
          'RL.1.4',
          [
            N('Empty, floppy, prickly: these are describing words.'),
            N('They tell us how a thing feels. Can you think of one more?'),
          ],
          'Learned describing words for how things feel.',
        ),
      ],
    ),
    sc(
      'a11-06-gift',
      [
        PG('Happy birthday, Eeyore. I brought a balloon.'),
        E('A balloon? For me?', 'shock'),
        PG('It burst. I am so sorry.', 'sad'),
        P('I brought a Useful Pot. To put things in.', 'happy'),
        P('There is nothing in it. That is what makes it useful.'),
        N('Eeyore puts the damp rag in the pot, and takes it out. In again!'),
        E('It goes in and out. Fancy that.', 'happy'),
        N('Nobody has seen Eeyore happy before. Nobody speaks.'),
        N('Now it is your Nubbin’s turn. It can give something, or nothing.'),
      ],
      [
        notice(
          8,
          'sel',
          'a gift does not have to be big',
          'CASEL: Social awareness',
          [
            N('A present does not have to be big, or new, or shiny.'),
            N('A ribbon is a gift. So is a thistle. So is sitting beside someone.'),
          ],
          'Heard that a gift can be small, or just time spent together.',
        ),
      ],
      [
        {
          id: 'ribbon',
          label: 'Your Nubbin gives Eeyore its blue ribbon.',
          set: { 'a11-gift': 'ribbon' },
          then: [
            N('Your Nubbin tugs its blue bow undone. It lays the ribbon at Eeyore’s feet.'),
            E('Christopher Robin tied that. I know what it says.', 'shock'),
            E('I shall keep it somewhere safe. In the pot.', 'soft'),
          ],
        },
        {
          id: 'thistle',
          label: 'Your Nubbin gives him the thistle it carried.',
          set: { 'a11-gift': 'thistle' },
          then: [
            N('Your Nubbin holds out the thistle. Its paws are sore from carrying it.'),
            E('The good sort. Purple on top. Somebody carried that far.', 'soft'),
            E('I shall not eat it today. I shall keep it.'),
          ],
        },
        {
          id: 'sat',
          label: 'Nothing. You both just sit with him.',
          set: { 'a11-gift': 'sat' },
          then: [
            N('You sit on the bank. Your Nubbin sits beside you.'),
            N('Pooh and Piglet go home, but you stay. The afternoon goes slowly.'),
            E('Nobody has done that before. Sat. Without wanting anything.', 'soft'),
          ],
        },
      ],
    ),
    sc(
      'a11-06-gift-done',
      [
        N('By evening Eeyore still puts the rag in and out of the pot.'),
        N('In, out, in, out, in, out.'),
        N('He looks almost cheerful.'),
      ],
      [
        notice(
          1,
          'literacy',
          'repeated words and actions in a story',
          'RL.2.4',
          [
            N('In, out. In, out. In, out. The story repeats it.'),
            N('Repeated words are fun to say together. (Say “in, out” with a clap.)'),
          ],
          'Noticed that repeated words and actions make a story fun to say.',
        ),
      ],
    ),
    sc(
      'a11-06-complete',
      [
        N('Christopher Robin arrives with a cake. First he cuts it in half.'),
        N('Then more slices, one for everyone. Eeyore gets the most icing.'),
        E('A pot, a balloon, and cake. People will say I am spoiled.'),
        P('Will they?'),
        E('No. But they could.'),
        N('Pooh gives you an empty pot too. Eeyore adds a bit of balloon.'),
      ],
      [
        ask(
          0,
          'maths',
          'two equal parts are halves',
          '1.G.A.3',
          [N('The cake is cut into two equal parts. What is each part called?')],
          [
            opt('A half', [N('Yes! Two equal parts. Each one is a half.')], true),
            opt('A whole', [N('The whole is all of it. One of two equal parts is a half.')]),
          ],
          'Learned that two equal parts are halves.',
        ),
      ],
    ),
  ],
);

// ================================================================== A11-7 Kanga and Baby Roo
const Q07: EduQuest = quest(
  'a11-07',
  'Kanga and Baby Roo',
  {
    'a11-07-s1': {
      goal: 'Listen to Rabbit’s plan about the newcomers.',
      hint: 'Rabbit has a meeting by his front door.',
    },
    'a11-07-s2': {
      goal: 'Make sure Roo has a nice time.',
      hint: 'Run alongside Rabbit. Keep Roo company.',
    },
    'a11-07-s3': {
      goal: 'Go and see how Piglet is getting on.',
      hint: 'Kanga’s house is by the Sandy Pit.',
    },
  },
  [
    sc(
      'a11-07-plan',
      [
        N('Someone new is in the Forest. Her name is Kanga.'),
        R('Who said she could come? She keeps her baby in her pocket!', 'angry'),
        P('Where should it ride?'),
        R('Here is my plan. We borrow her baby for a game of hide.'),
        R('Piglet hops in the pocket, so Kanga does not notice.'),
        PG('V-very small. Yes.', 'shock'),
        N('Your Nubbin looks at you. You look at Rabbit.'),
      ],
      [
        notice(
          2,
          'science',
          'kangaroo mothers carry their babies in a pouch',
          '1-LS1-2',
          [
            N('Real kangaroos have a pouch, like a pocket, on their tummy.'),
            N('A baby kangaroo is called a joey. The pouch keeps it safe and warm.'),
          ],
          'Learned that mother kangaroos carry their babies in a pouch.',
        ),
      ],
      [
        {
          id: 'bad',
          label: 'Say it is a bad plan.',
          then: [R('It is a good plan. It has Steps.'), N('You cannot stop a plan with Steps.')],
        },
        {
          id: 'roo',
          label: 'Ask what happens to the baby.',
          then: [R('He stays at mine. Briefly. He will be safe.'), N('You will be there too.')],
        },
        {
          id: 'follow',
          label: 'Say nothing, and go along.',
          then: [N('You go along. Someone should be there who is not part of the plan.')],
        },
      ],
    ),
    sc(
      'a11-07-plan-done',
      [
        R('The baby is called Roo. Look after him on the way, Keeper.'),
        R('Happy Roos stay quiet.'),
        N('(Whisper “Quiet Roo.” Now whisper louder, then quieter.)'),
      ],
      [
        ask(
          1,
          'sel',
          'tell your grown-up before you go anywhere',
          'CASEL: Responsible decision-making',
          [N('Roo is going off with Rabbit. Who should Roo tell first?')],
          [
            opt(
              'His grown-up, Kanga',
              [N('Yes. Always tell your grown-up where you are going.')],
              true,
            ),
            opt('Nobody', [N('Grown-ups worry. Telling them keeps you safe.')]),
          ],
          'Learned to tell a grown-up before going off anywhere.',
        ),
      ],
    ),
    sc(
      'a11-07-swap',
      [
        N('By the Sandy Pit, Kanga teaches Roo to jump.'),
        N('Pooh keeps her busy with a long, long story.'),
        N('Rabbit lifts Roo into a pillowcase. Piglet hops in Kanga’s pocket.'),
        N('You run alongside.'),
        RO('Is this a game? It smells of carrots!', 'happy'),
        RO('Can your Nubbin come too?'),
      ],
      [
        notice(
          1,
          'science',
          'kangaroos hop on strong back legs',
          '4-LS1-1',
          [
            N('Real kangaroos have very strong back legs.'),
            N('They hop to get about, boing, boing, boing. Roo is learning how.'),
          ],
          'Learned that kangaroos hop on strong back legs.',
        ),
      ],
      [
        {
          id: 'ride',
          label: 'Let your Nubbin ride with Roo.',
          then: [N('Your Nubbin climbs in. Roo giggles all the way.')],
        },
        {
          id: 'count',
          label: 'Count the trees with Roo as they go by.',
          then: [RO('One, two, lots, lots, lots, home!', 'happy')],
        },
        {
          id: 'story',
          label: 'Tell Roo a story.',
          then: [
            RO('Is there a Roo in it?'),
            Y('There is now.'),
            RO('Make him jump a lot.', 'happy'),
          ],
        },
      ],
    ),
    sc(
      'a11-07-swap-done',
      [
        N('At Rabbit’s, Roo hops off the step. Hop!'),
        N('Rabbit pretends not to count the hops.'),
        N('He counts them anyway.'),
      ],
      [
        doIt(
          2,
          'maths',
          'count hops to 5',
          'K.CC.A.1',
          'edu:count:hops:5',
          [
            N('Hop! Roo hops again. (Hop with me and count.)'),
            N('One, two, three, four, five hops. Whew!'),
          ],
          'Counted five hops, one number for each.',
        ),
      ],
    ),
    sc(
      'a11-07-bath',
      [
        N('At Kanga’s house, Kanga has noticed. Kangas always notice.'),
        K('Bath time, Roo dear.', 'soft'),
        N('She says it to Piglet. She looks right at him.'),
        PG('I am not Roo! I am Piglet!', 'shock'),
        K('Of course you are, dear.', 'happy'),
        N('Splash! Kanga scrubs him and gives him some medicine.'),
        N('Kanga winks at you. She knows, and she is enjoying herself.'),
        N('Piglet escapes and runs home.'),
      ],
      [
        notice(
          5,
          'health',
          'only a grown-up gives you medicine',
          'ELOF: Perceptual, Motor, and Physical Development',
          [
            N('Medicine helps a body get well. Take it only from a grown-up.'),
            N('Never take medicine by yourself, even if it looks like a sweet.'),
          ],
          'Heard that only a trusted grown-up should give medicine.',
        ),
      ],
    ),
    sc(
      'a11-07-bath-done',
      [
        N('Kanga collects Roo from Rabbit’s. She smiles.'),
        N('She knew all along.'),
        R('I was only borrowing.'),
      ],
      [
        ask(
          2,
          'sel',
          'ask first before borrowing',
          'CASEL: Responsible decision-making',
          [N('What could Rabbit do next time, before borrowing Roo?')],
          [
            opt('Ask Kanga first', [N('Yes. Asking first is kind and fair.')], true),
            opt('Do it quietly', [N('Quiet is not the same as kind. Asking is better.')]),
          ],
          'Learned that asking first is the kind and fair way to borrow.',
        ),
      ],
    ),
    sc(
      'a11-07-complete',
      [
        R('Well. She can stay. Roo jumps very well.', 'think'),
        N('Rabbit is friendly now. A bit stiffly, like a new shoe.'),
        RO('Can I go in the pillowcase again?', 'happy'),
        K('Thank you for watching him, dear.', 'soft'),
      ],
      [
        notice(
          1,
          'social-studies',
          'being kind to someone new',
          'D2.Civ.8.K-2',
          [
            N('Rabbit was cross at first, because Kanga and Roo were new.'),
            N('Being friendly to newcomers helps them feel they belong.'),
          ],
          'Heard that being friendly to newcomers helps them belong.',
        ),
      ],
    ),
  ],
);

// ================================================================== A11-8 The Expotition
const Q08: EduQuest = quest(
  'a11-08',
  'The Expotition',
  {
    'a11-08-s1': {
      goal: 'Join Christopher Robin’s Expotition to the North Pole.',
      hint: 'He is outside his house in his Big Boots.',
    },
    'a11-08-s2': {
      goal: 'Help get Roo out of the stream.',
      hint: 'Take the other end of Pooh’s pole.',
    },
    'a11-08-s3': {
      goal: 'Help Christopher Robin mark the spot.',
      hint: 'Push the pole into the bank.',
    },
  },
  [
    sc(
      'a11-08-setoff',
      [
        N('Christopher Robin puts on his Big Boots. That means an Adventure!'),
        CR('We are going on an Expotition, to find the North Pole.'),
        P('What is the North Pole?', 'think'),
        CR('A thing at the North. You will know it when you see it.'),
        N('Everyone comes: Rabbit, Kanga, Roo, Owl, Piglet. Eeyore comes last.'),
        E('Nobody told me. Well, somebody did. Not properly.', 'sad'),
        R('Single file!'),
        N('Your Nubbin marches in line, between Pooh and Piglet.'),
      ],
      [
        ask(
          7,
          'maths',
          'first and last in a line',
          'K.G.A.1',
          [N('(Look at the line.) Who is at the very end?')],
          [
            opt('Eeyore', [N('Yes! Eeyore comes last, at the back.')], true),
            opt('Christopher Robin', [N('He is at the front. Eeyore is last, at the back.')]),
          ],
          'Used first and last to describe a line of friends.',
        ),
        notice(
          5,
          'sel',
          'including everyone and telling them the plan',
          'CASEL: Social awareness',
          [
            N('Eeyore was told about the Expotition, but not properly.'),
            N('Being left out feels sad. Telling everyone the plan helps them belong.'),
          ],
          'Heard that telling everyone the plan helps them feel included.',
        ),
      ],
      [
        {
          id: 'back',
          label: 'Walk at the back with Eeyore.',
          then: [E('Someone has to be at the back. It might as well be me.')],
        },
        {
          id: 'front',
          label: 'Walk at the front with Christopher Robin.',
          then: [CR('Good. You can look out for the Pole.')],
        },
        {
          id: 'ambush',
          label: 'Look out for Ambushes.',
          then: [N('You find two gorse bushes, a log and Owl.')],
        },
      ],
    ),
    sc(
      'a11-08-roo',
      [
        N('By a pool in the stream, everyone has lunch.'),
        N('Roo falls in with a splash, and the water carries him off.'),
        RO('Look, Kanga! I am swimming!', 'happy'),
        N('Your Nubbin does not mind water. It paddles beside him.'),
        N('Pooh holds a long pole across the stream. You hold the other end.'),
        N('Roo bumps the pole and holds on. You lift him out.'),
      ],
      [
        notice(
          5,
          'health',
          'water safety: reach, do not jump in',
          'CASEL: Responsible decision-making',
          [
            N('Nubbins do not mind water. People should be careful.'),
            N('If a friend falls in, stay on the bank.'),
            N('Reach with a pole, and shout for a grown-up.'),
          ],
          'Learned to reach with a pole and call a grown-up if someone falls in water.',
        ),
      ],
    ),
    sc(
      'a11-08-roo-done',
      [
        RO('Did you see me swimming? Did you?', 'happy'),
        K('We did, dear. Now come and be dried.', 'soft'),
        N('The stream keeps running, down, down, down.'),
      ],
      [
        notice(
          2,
          'science',
          'streams flow downhill and carry things along',
          'ELOF: Scientific Reasoning',
          [
            N('A stream always runs downhill. Whoosh!'),
            N('It carries leaves, sticks, and Roo. Water pushes things along.'),
          ],
          'Noticed that streams flow downhill and carry things with them.',
        ),
      ],
    ),
    sc(
      'a11-08-pole',
      [
        CR('Pooh, do you know what you are holding?', 'think'),
        P('A pole. A wet one.'),
        CR('It is the North Pole! You found it!', 'happy'),
        P('Oh!', 'shock'),
        N('Christopher Robin pushes it into the bank.'),
        N('He writes a sign on it. The spelling wobbles.'),
        E('My tail has been in the pool ten minutes. It is numb.', 'sad'),
        CR('Oh, Eeyore. Let me dry it.'),
      ],
      [
        notice(
          5,
          'literacy',
          'spelling can wobble; sound it out',
          'ELOF: Literacy',
          [
            N('Christopher Robin wrote the sign by listening to the sounds.'),
            N('Pole is spelled P-O-L-E. He might write P-O-L, and that is fine.'),
            N('Sounding out is how we all start.'),
          ],
          'Heard that wobbly spelling is fine when you sound a word out.',
        ),
      ],
    ),
    sc(
      'a11-08-pole-done',
      [
        N('Everyone walks home in a long happy line.'),
        N('Roo is asleep on Kanga.'),
        N('Pooh walks very upright. That is how discoverers walk.'),
      ],
      [
        notice(
          1,
          'social-studies',
          'the real North Pole is at the top of the world',
          'D2.Geo.2.K-2',
          [
            N('The real North Pole is at the very top of the Earth.'),
            N('It is covered in ice and it is very, very cold.'),
          ],
          'Learned that the real North Pole is a cold place at the top of the world.',
        ),
      ],
    ),
    sc(
      'a11-08-complete',
      [
        CR('This is the spare pole. Every Expotition needs a hat-stand.'),
        N('It is shorter, and it has a forked top.'),
        P('Did I really discover it?'),
        CR('You did.'),
        P('I thought it would be bigger. But it is very nice.', 'happy'),
      ],
      [
        doIt(
          4,
          'maths',
          'on top of, under, beside',
          'K.G.A.1',
          'edu:place:hat:on-top-of-pole',
          [
            N('Hang a hat on the forked pole.'),
            N('Is the hat on top of the pole, or under it?'),
            N('(Put something on top of something, then under it, then beside it.)'),
          ],
          'Used the position words on top of, under and beside.',
        ),
      ],
    ),
  ],
);

// ================================================================== A11-9 Entirely Surrounded by Water
const Q09: EduQuest = quest(
  'a11-09',
  'Surrounded by Water',
  {
    'a11-09-s1': {
      goal: 'Find out where Piglet is, in all this rain.',
      hint: 'Watch the flood from the high bank.',
    },
    'a11-09-s2': {
      goal: 'Help Pooh get the message to Christopher Robin.',
      hint: 'Paddle the wash-tub beside the Floating Bear.',
    },
    'a11-09-s3': {
      goal: 'Sail the Brain of Pooh to Piglet’s tree.',
      hint: 'Keep your tub beside the umbrella.',
    },
  },
  [
    sc(
      'a11-09-rain',
      [
        N('Rain, rain, rain. It rains all day and all night.'),
        N('The stream grows big. It spills over its banks.'),
        N('Low places fill first. Water runs downhill.'),
        N('Piglet’s house is in a beech tree. Water is all around.'),
        PG('Everyone else will be fine. I am just small and wet.', 'sad'),
        N('He writes HELP and his name. He corks it in a bottle.'),
        N('You are up on the high bank. You see the bottle float by.'),
      ],
      [
        ask(
          2,
          'literacy',
          'weather words: flood',
          'ELOF: Language and Communication',
          [N('What do we call it when a stream spills over its banks?')],
          [
            opt(
              'A flood',
              [N('Yes, a flood! Lots of rain made the water too big for the stream.')],
              true,
            ),
            opt('A drought', [N('A drought is no rain at all. This is a flood: too much water.')]),
          ],
          'Learned the word flood and what it means.',
        ),
      ],
    ),
    sc(
      'a11-09-rain-done',
      [
        N('You follow the bottle along the bank.'),
        N('Bob, bob, bob. It floats all the way to Pooh.'),
        N('Pooh is sitting on a branch above his own front door.'),
      ],
      [
        notice(
          1,
          'science',
          'a corked bottle has air in it, so it floats',
          '2-PS1-1',
          [
            N('A closed bottle is full of air. The air helps it float.'),
            N('Some things float. Some things sink. A stone sinks.'),
          ],
          'Noticed that a bottle with air inside floats.',
        ),
      ],
    ),
    sc(
      'a11-09-bear',
      [
        P('A bottle with a letter! I can only read the P.'),
        P('P is for Pooh. So it must be for me!', 'think'),
        N('Pooh puts his big empty jar on the water.'),
        N('It tips over, so he tries again, sitting on top. It floats!'),
        P('This is the Floating Bear. Mostly it floats.', 'happy'),
        N('You find a wash-tub in a bush. You paddle with your hands.'),
        N('Your Nubbin rides on your head, nice and dry.'),
      ],
      [
        ask(
          1,
          'literacy',
          'the first sound and letter of a name',
          'RF.K.2',
          [N('Pooh starts with P. Which other friend starts with P too?')],
          [
            opt('Piglet', [N('Yes! Piglet and Pooh both start with P. Puh, puh!')], true),
            opt('Owl', [N('Owl starts with O. Piglet starts with P, like Pooh.')]),
          ],
          'Matched a name to the first letter and sound P.',
        ),
      ],
      [
        {
          id: 'close',
          label: 'Paddle close enough to grab him.',
          then: [N('Twice the Floating Bear tips. Twice you push it back up.')],
        },
        {
          id: 'tow',
          label: 'Tow him with a bit of string.',
          then: [P('A tow! Like a proper ship. I shall sit very still.', 'happy')],
        },
      ],
    ),
    sc(
      'a11-09-bear-done',
      [
        N('You bump into the hill where Christopher Robin lives.'),
        N('It is an island now. A boy stands on it.'),
        N('(Point to the water all round the hill.)'),
      ],
      [
        notice(
          2,
          'social-studies',
          'an island is land with water all round',
          'D2.Geo.2.K-2',
          [
            N('An island is land with water all the way round it.'),
            N('On a map, islands are bits of land, with blue all round.'),
          ],
          'Learned that an island is land surrounded by water.',
        ),
      ],
    ),
    sc(
      'a11-09-umbrella',
      [
        CR('Piglet is stuck in his tree. We need a boat.'),
        P('Your umbrella is a bowl turned over. A bowl is a sort of boat.', 'think'),
        N('Christopher Robin opens it. He sets it on the water.'),
        N('It floats, wobbles, and holds. Pooh climbs in too.'),
        CR('I name this ship the Brain of Pooh. It was your idea.', 'happy'),
        P('The Brain of Pooh. Oh.', 'soft'),
        N('You paddle beside them. Your Nubbin is the lookout.'),
      ],
      [
        notice(
          3,
          'science',
          'a bowl shape floats because it holds air',
          '3-5-ETS1-2',
          [
            N('A bowl shape pushes water aside, so it can float and carry things.'),
            N('Pooh had a clever idea: use what you have to build a boat.'),
          ],
          'Learned that a bowl shape can float and used a clever idea to solve a problem.',
        ),
      ],
    ),
    sc(
      'a11-09-umbrella-done',
      [
        N('Piglet is at his window. He is very small and very wet.'),
        N('He sees the Brain of Pooh. He jumps up and down.'),
        PG('Pooh! Christopher Robin! You came!', 'happy'),
      ],
      [
        notice(
          2,
          'sel',
          'friends come when you ask for help',
          'CASEL: Relationship skills',
          [
            N('Piglet was scared. He sent a message asking for help.'),
            N('Asking for help was brave. Friends came, because he asked.'),
          ],
          'Heard that asking for help is brave and friends come.',
        ),
      ],
    ),
    sc(
      'a11-09-complete',
      [
        N('Piglet climbs down into the umbrella. It holds three, just.'),
        PG('I knew someone would come.'),
        CR('It was Pooh’s idea. All of it.'),
        P('Was it? I must have more of them.', 'happy'),
        N('Your Nubbin sneezes. It is the driest thing for miles.'),
      ],
      [
        ask(
          1,
          'maths',
          'add one more: 2 and 1 makes 3',
          'K.OA.A.1',
          [N('Two friends are in the umbrella. Piglet climbs in. How many now?')],
          [
            opt('Three', [N('Yes! Two and one more makes three.')], true),
            opt('Two', [N('Two was before Piglet. Add Piglet: one, two, three!')]),
          ],
          'Added one more to two to make three.',
        ),
      ],
    ),
  ],
);

// ================================================================== A11-10 The Pooh Party
const Q10: EduQuest = quest(
  'a11-10',
  'The Long Table',
  {
    'a11-10-s1': {
      goal: 'Help Owl tell everyone about the party.',
      hint: 'Go round the Forest and tell everyone in short words.',
    },
    'a11-10-s2': {
      goal: 'Set the long table. Save Eeyore a seat at the end.',
      hint: 'Lay a plate at each place. Then put a cushion on the last chair.',
    },
  },
  [
    sc(
      'a11-10-invites',
      [
        CR('A party for Pooh! He saved Piglet.', 'happy'),
        O('Very good. I shall Announce a Gathering of All Residents.'),
        N('Owl flies off. You go too, to say it in shorter words.'),
        N('At the Gloomy Place, Owl tells Eeyore.'),
        E('A party. For me. Nobody has a party for me. Until now.', 'think'),
        O('No, it is for…'),
        N('But Eeyore has turned away to think.'),
      ],
      [
        ask(
          3,
          'literacy',
          'clear messages use short, simple words',
          'ELOF: Language and Communication',
          [N('Which is easier: “A party for Pooh!” or “A Gathering of All Residents”?')],
          [
            opt(
              '“A party for Pooh!”',
              [N('Yes! Short, clear words help everyone hear the news.')],
              true,
            ),
            opt('“A Gathering of All Residents”', [
              N('That is Owl’s long way. Short words are easier: a party for Pooh!'),
            ]),
          ],
          'Learned that short, clear words make a message easy to understand.',
        ),
      ],
      [
        {
          id: 'tell',
          label: 'Tell Eeyore it is for Pooh.',
          then: [E('Is it. Well. I shall come anyway, if I am wanted. Which I doubt.')],
        },
        {
          id: 'seat',
          label: 'Tell him there will be a seat for him.',
          then: [
            E('A seat. At the end, I expect.'),
            Y('Wherever you like.'),
            E('The end. I like the end. You can see who is leaving.'),
          ],
        },
      ],
    ),
    sc(
      'a11-10-table',
      [
        N('Christopher Robin makes a long table in the open air.'),
        N('You lay the plates. Your Nubbin puts a leaf on each one.'),
        R('Owl at the top. Then Kanga. Then me.'),
        N('One chair is left at the very end.'),
        N('You put a cushion on it, and a card that says EEYORE.'),
        E('A place at the end. With my name on.', 'soft'),
        E('The cushion is a nice touch.'),
      ],
      [
        doIt(
          4,
          'maths',
          'one plate for each friend',
          'K.CC.B.4',
          'edu:place:plates:one-each',
          [
            N('Put one plate for each friend, down the long table.'),
            N('One plate, one friend. One plate, one friend. No one gets left out.'),
          ],
          'Matched one plate to each friend, one to one.',
        ),
      ],
    ),
    sc(
      'a11-10-table-done',
      [
        CR('This party is for what somebody did, and we all know who.'),
        N('Eeyore half stands, to make a speech.'),
        N('Then Christopher Robin gives Pooh a present.'),
        N('Eeyore sits down again.'),
      ],
      [
        notice(
          1,
          'literacy',
          'the first letter of a name: E for Eeyore',
          'RF.K.2',
          [
            N('The card on the end chair says EEYORE. It starts with E.'),
            N('Here E says “ee”, like the start of Eeyore. (Can you find an E?)'),
          ],
          'Linked the first letter E to the first sound in Eeyore.',
        ),
      ],
    ),
    sc(
      'a11-10-complete',
      [
        N('Pooh’s present is a Special Pencil Case.'),
        N('Inside are pencils marked B, HB and BB.'),
        N('Pooh cannot write. But he looks at every pencil.'),
        E('Pencils. When I was young we had sticks.'),
        N('Walking home, Pooh and Piglet are quiet. It is a friendly quiet.'),
      ],
      [
        notice(
          3,
          'social-studies',
          'leaving a place for everyone',
          'D2.Civ.8.K-2',
          [
            N('Eeyore had a place at the party, with a cushion and his name.'),
            N('Saving a place for everyone, even the quiet ones, helps them feel they belong.'),
          ],
          'Heard that saving a place for everyone makes people feel they belong.',
        ),
      ],
    ),
  ],
);

// ================================================================== A11-11 A House at Pooh Corner
const Q11: EduQuest = quest(
  'a11-11',
  'A House for Eeyore',
  {
    'a11-11-s1': {
      goal: 'Help Pooh and Piglet build Eeyore a house.',
      hint: 'Carry sticks to Pooh Corner.',
    },
    'a11-11-s2': {
      goal: 'Go with Christopher Robin and Eeyore to look for his missing house.',
      hint: 'Walk Eeyore through the snow to Pooh Corner.',
    },
    'a11-11-s3': {
      goal: 'Let Eeyore work it out his own way.',
      hint: 'Stand back and let Eeyore look.',
    },
  },
  [
    sc(
      'a11-11-snow',
      [
        N('It is snowing. The Forest is white and soft.'),
        N('Pooh hums a snow hum. It gets longer as it goes.'),
        P('Eeyore has no house. Everybody has one except him.', 'think'),
        PG('We could build him one, at Pooh Corner. Out of sticks.'),
        N('A heap of sticks lies on the far side of the wood.'),
        N('You carry sticks. Your Nubbin carries one, the long way round.'),
        PG('It is a very good house. Eeyore will be pleased.'),
      ],
      [
        ask(
          1,
          'science',
          'weather words: snow',
          'ELOF: Scientific Reasoning',
          [N('What is falling from the sky in this story?')],
          [
            opt('Snow', [N('Yes, snow! Soft, white and cold.')], true),
            opt('Rain', [N('Rain is wet drops. This is snow: soft, white flakes.')]),
          ],
          'Named the weather in the story: snow.',
        ),
      ],
      [
        {
          id: 'wide',
          label: 'Make the doorway wide enough for a donkey.',
          then: [N('You make it wider. Pooh likes wide doors, ever since Rabbit’s.')],
        },
        {
          id: 'roof',
          label: 'Put a roof on, in case.',
          then: [PG('In case of snow? It is snow already.'), Y('In case of more.'), PG('Oh. Yes.')],
        },
        {
          id: 'last',
          label: 'Let your Nubbin choose the last stick.',
          then: [N('It picks a crooked one. It looks right, somehow.')],
        },
      ],
    ),
    sc(
      'a11-11-snow-done',
      [
        N('The house stands at Pooh Corner. It is a little lopsided.'),
        N('The roof is shaped like a triangle.'),
        N('Snow slides off the sloping roof. Plop! Right onto Pooh.'),
        N('(Draw a triangle in the air: three sides, three corners.)'),
      ],
      [
        notice(
          3,
          'maths',
          'a triangle has three sides and three corners',
          'K.G.A.2',
          [
            N('A triangle has three straight sides and three corners.'),
            N('A sloping roof like a triangle lets snow slide off.'),
          ],
          'Learned that a triangle has three sides and three corners.',
        ),
      ],
    ),
    sc(
      'a11-11-missing',
      [
        N('At Christopher Robin’s door, Eeyore stands in the snow.'),
        E('It is snowing. I built a house. Now it is not there.', 'sad'),
        CR('Where was it?'),
        E('By the wood. A house of sticks. It has gone.'),
        N('You think of a heap of sticks. Uh-oh.'),
        CR('Let us go and look.'),
        N('You walk with them through the snow.'),
      ],
      [
        notice(
          4,
          'sel',
          'a funny feeling in your tummy can mean a mistake',
          'CASEL: Self-awareness',
          [
            N('Your tummy feels funny. That can be a worry feeling.'),
            N('It may mean we made a mistake. We can put it right.'),
          ],
          'Learned that a funny tummy feeling can mean we have made a mistake and can put it right.',
        ),
      ],
    ),
    sc(
      'a11-11-missing-done',
      [
        N('At Pooh Corner stands a house of sticks.'),
        N('Pooh and Piglet are admiring it.'),
        N('Snow is on the roof. Inside, it is dry.'),
      ],
      [
        notice(
          2,
          'science',
          'a house keeps us warm and dry',
          'K-ESS3-1',
          [
            N('A house has walls and a roof. They keep out snow and wind.'),
            N('Animals have homes too. Birds have nests. Rabbits have burrows.'),
          ],
          'Learned that homes keep people and animals warm and dry.',
        ),
      ],
    ),
    sc(
      'a11-11-wind',
      [
        E('There. That is my house. It is here. And I built it there.', 'shock'),
        E('The wind must have moved it.', 'think'),
        N('Pooh and Piglet look at you. You say nothing, which is the kind thing.'),
        E('It is better here. Not so draughty.', 'happy'),
        CR('It is a lovely house, Eeyore.'),
        E('Somebody somewhere must like me.', 'soft'),
      ],
      [
        ask(
          0,
          'maths',
          'position words: here and there',
          'K.G.A.1',
          [N('(Point to something near you. Now something far away.) Which one is here?')],
          [
            opt('The near one', [N('Yes! Here is near. There is far away.')], true),
            opt('The far one', [N('The far one is there. Here is near, close to you.')]),
          ],
          'Used the position words here (near) and there (far).',
        ),
      ],
    ),
    sc(
      'a11-11-door',
      [
        N('Eeyore goes in. He comes out again, to look at his door.'),
        N('On the latch is a blue ribbon, tied in a bow.'),
        E('It keeps the door from banging. Useful. Like a Friend.', 'soft'),
      ],
      [
        notice(
          2,
          'sel',
          'small kind things can last a long time',
          'CASEL: Social awareness',
          [
            N('The ribbon was a small gift. Eeyore found a use for it.'),
            N('A small kind thing can go on helping for a long, long time.'),
          ],
          'Heard that a small kind gift can keep helping for a long time.',
        ),
      ],
    ),
    sc(
      'a11-11-complete',
      [
        N('Pooh and Piglet walk home in the snow.'),
        PG('Pooh. Did we take Eeyore’s house?'),
        P('We did. And then we gave it back, in a better place.', 'think'),
        PG('I think that counts.', 'soft'),
        N('Your Nubbin walks in Pooh’s footprints all the way. Hop, hop.'),
      ],
      [
        ask(
          4,
          'maths',
          'compare: big and small footprints',
          'K.MD.A.2',
          [N('(Look at the footprints.) Whose feet are bigger: Pooh’s, or your Nubbin’s?')],
          [
            opt('Pooh’s', [N('Yes! Pooh’s feet are bigger. That is why your Nubbin hops.')], true),
            opt('Your Nubbin’s', [
              N('Your Nubbin’s feet are small. Pooh’s are bigger, so it hops.'),
            ]),
          ],
          'Compared big and small footprints.',
        ),
      ],
    ),
  ],
);

// ================================================================== A11-12 Tigger Comes to the Forest
const Q12: EduQuest = quest(
  'a11-12',
  'A Bouncy Visitor',
  {
    'a11-12-s1': {
      goal: 'Find out what is making that noise at Pooh’s door.',
      hint: 'You are staying the night at Pooh’s. Open the door.',
    },
    'a11-12-s2': {
      goal: 'Help Tigger try honey, haycorns and thistles.',
      hint: 'Go from Pooh’s to Piglet’s to Eeyore’s.',
    },
    'a11-12-s3': {
      goal: 'Take Tigger to Kanga’s for one last try.',
      hint: 'Kanga’s house is by the Sandy Pit.',
    },
  },
  [
    sc(
      'a11-12-night',
      [
        N('In the night, at Pooh’s house, there is a noise.'),
        N('It is a growly, wobbly noise. A pleased sort of noise.'),
        P('Is it you?', 'think'),
        N('It is not. Pooh opens the door.'),
        T('Hello! I am Tigger. I have just come!', 'happy'),
        N('Tigger has orange and black stripes. Orange, black, orange, black.'),
        N('He has a fight with the tablecloth. He wins.'),
        N('He bounces your Nubbin. Your Nubbin bounces back.'),
      ],
      [
        ask(
          5,
          'maths',
          'a stripe pattern: what comes next?',
          'ELOF: Mathematics Development',
          [N('Tigger’s stripes go orange, black, orange, black. What comes next?')],
          [
            opt('Orange', [N('Yes! Orange, black, orange, black, orange! Patterns repeat.')], true),
            opt('Green', [N('Green is not in the pattern. After black comes orange again.')]),
          ],
          'Continued an orange and black stripe pattern.',
        ),
      ],
      [
        {
          id: 'breakfast',
          label: 'Offer to help find Tigger some breakfast.',
          then: [T('Breakfast! Tiggers like everything for breakfast. Probably.', 'happy')],
        },
        {
          id: 'cloth',
          label: 'Put the tablecloth back.',
          then: [N('You put it back. Tigger watches it, in case it starts again.')],
        },
        {
          id: 'where',
          label: 'Ask Tigger where he came from.',
          then: [T('From over there. From just now. Is there breakfast?')],
        },
      ],
    ),
    sc(
      'a11-12-night-done',
      [
        N('In the morning, Pooh sets out a pot of honey.'),
        N('The very best kind.'),
        N('The night is over. The sun is up.'),
      ],
      [
        notice(
          2,
          'science',
          'day and night',
          '1-ESS1-1',
          [
            N('At night it is dark, and many of us sleep.'),
            N('In the morning the sun comes up, and it is day again.'),
          ],
          'Noticed the change from night to morning.',
        ),
      ],
    ),
    sc(
      'a11-12-breakfast',
      [
        N('Tigger takes a big mouthful of honey.'),
        T('Yuck. It sticks to my whiskers.', 'sad'),
        N('Pooh tries to look sorry. He has the rest himself.'),
        N('At Piglet’s, Tigger tries a haycorn.'),
        T('They are all corners. Tiggers do not do corners.'),
        N('At Eeyore’s, Tigger tries a thistle.'),
        T('Ow! Prickly! That is a punishment!', 'shock'),
        E('Some of us eat them every day. We hardly complain.', 'sad'),
      ],
      [
        ask(
          6,
          'literacy',
          'describing words: sticky and prickly',
          'RL.1.4',
          [N('Honey sticks to everything. A thistle pricks. Which word means ow, it pricks?')],
          [
            opt('Prickly', [N('Yes! Prickly. Sharp little points.')], true),
            opt('Sticky', [N('Sticky is the honey. The thistle is prickly.')]),
          ],
          'Used the describing words sticky and prickly.',
        ),
      ],
    ),
    sc(
      'a11-12-breakfast-done',
      [
        P('Only Kanga is left. She might have something.', 'think'),
        N('Tigger has tried three things. Honey, haycorns, thistles.'),
        N('(Hold up three fingers. One more try!)'),
      ],
      [
        doIt(
          2,
          'maths',
          'count the tries to 3',
          'K.CC.B.5',
          'edu:count:breakfast-tries:3',
          [
            N('First honey. Next haycorns. Last thistles.'),
            N('One, two, three tries. Tigger is a brave eater.'),
          ],
          'Counted three tries and used first, next and last.',
        ),
      ],
    ),
    sc(
      'a11-12-malt',
      [
        N('At Kanga’s house, Roo is having a spoon of sticky brown malt.'),
        RO('Do I have to? It is brown and sticks to the spoon.'),
        K('Just one spoonful, dear. It makes you big and strong.'),
        K('Would you like to try, Tigger? One spoon, from me.'),
        N('Tigger tries it. His tail goes straight up.'),
        T('That is it! That is a Tigger breakfast!', 'happy'),
        RO('He can have mine! Always!', 'happy'),
        K('Then he had better stay. I will fetch another spoon.', 'soft'),
      ],
      [
        notice(
          7,
          'science',
          'different living things eat different food',
          'K-LS1-1',
          [
            N('Pooh likes honey. Eeyore eats thistles. Tigger likes malt.'),
            N('Real animals eat different foods too. Bees drink flower juice. Donkeys eat plants.'),
          ],
          'Learned that different animals eat different foods.',
        ),
      ],
    ),
    sc(
      'a11-12-malt-done',
      [
        N('So Tigger lives at Kanga’s from then on.'),
        N('He has malt for breakfast, dinner and tea.'),
        N('He tried and tried until he found what suited him.'),
      ],
      [
        notice(
          2,
          'sel',
          'keep trying until you find what suits you',
          'CASEL: Self-management',
          [
            N('Tigger did not give up after honey. Or haycorns. Or thistles.'),
            N('Trying again is a brave thing to do. Soon he found his breakfast.'),
          ],
          'Heard that trying again until you find what suits you is brave.',
        ),
      ],
    ),
    sc(
      'a11-12-complete',
      [
        P('Tiggers like the one thing nobody else does. Handy!', 'think'),
        T('And Tiggers like Keepers! Bounce!', 'happy'),
        N('Tigger bounces your Nubbin, gently.'),
        N('It lands on its feet.'),
      ],
      [
        doIt(
          1,
          'literacy',
          'clapping syllables in names',
          'RF.K.2',
          'edu:clap:syllables:tigger',
          [
            N('Clap the names with me. Tig-ger: two claps. Pooh: one clap.'),
            N('Kan-ga: two claps. Bounce: one big clap!'),
          ],
          'Clapped the syllables in Tigger, Pooh, Kanga and bounce.',
        ),
      ],
    ),
  ],
);

// ================================================================== A11-13 The Search for Small
const Q13: EduQuest = quest(
  'a11-13',
  'The Search for Small',
  {
    'a11-13-s1': {
      goal: 'Get your orders from Captain Rabbit.',
      hint: 'Rabbit has a list and a pencil.',
    },
    'a11-13-s2': {
      goal: 'Search by the Six Pine Trees, where the old pit is.',
      hint: 'Walk with Pooh. Mind the pit.',
    },
    'a11-13-s3': {
      goal: 'Help everyone out of the pit, and look closely at Pooh.',
      hint: 'Take one of Pooh’s paws.',
    },
  },
  [
    sc(
      'a11-13-orders',
      [
        N('Rabbit is busy, and likes it. He has a list.'),
        R('Small is missing. One of my friends. A very small beetle.', 'think'),
        P('What does Small look like?'),
        R('Small.'),
        P('Ah. That helps.'),
        R('Look under things. That is called being Thorough.'),
        N('Your Nubbin looks under a leaf at once.'),
      ],
      [
        ask(
          6,
          'maths',
          'compare: which is smaller?',
          'K.MD.A.2',
          [N('Which is smaller: a beetle, or a bear?')],
          [
            opt('A beetle', [N('Yes! A beetle is tiny. A bear is much bigger.')], true),
            opt('A bear', [N('A bear is big. A beetle is smaller. Smaller still: Small!')]),
          ],
          'Compared two animals by size.',
        ),
      ],
      [
        {
          id: 'salute',
          label: 'Salute.',
          then: [R('Good. Someone here understands organisation.', 'happy')],
        },
        {
          id: 'how',
          label: 'Ask how small, exactly.',
          then: [R('Smaller than that. No. Smaller.')],
        },
        {
          id: 'go',
          label: 'Start looking straight away.',
          then: [N('Your Nubbin is already under a stone.')],
        },
      ],
    ),
    sc(
      'a11-13-pit',
      [
        N('Pooh walks along thinking about honey.'),
        N('You remember the old pit. A moment too late.'),
        N('Whump! Pooh is gone.'),
        PG('Help! Something fell on me! A Heffalump!', 'shock'),
        P('It is only me.'),
        N('You look over the edge. Pooh is in the pit.'),
        N('Piglet is under Pooh.'),
        PG('I was searching. Under things.', 'sad'),
      ],
      [
        ask(
          2,
          'science',
          'things fall down: gravity pulls',
          'ELOF: Scientific Reasoning',
          [N('Pooh walks into the pit and falls. What pulls him down?')],
          [
            opt(
              'Gravity, a pull towards the ground',
              [N('Yes! Gravity pulls everything down.')],
              true,
            ),
            opt('Piglet', [N('Poor Piglet is only underneath. Gravity did the pulling.')]),
          ],
          'Learned that gravity pulls things down.',
        ),
      ],
    ),
    sc(
      'a11-13-pit-done',
      [
        N('Christopher Robin comes to the edge of the pit.'),
        N('He looks. Then he sits down to laugh.'),
        N('Pooh and Piglet laugh too, after a bit.'),
      ],
      [
        notice(
          2,
          'sel',
          'laughing with someone, not at them',
          'CASEL: Social awareness',
          [
            N('When everyone laughs together, it feels warm.'),
            N('Laughing at someone can hurt. Laughing with them is kind.'),
          ],
          'Heard the difference between laughing with and laughing at someone.',
        ),
      ],
    ),
    sc(
      'a11-13-small',
      [
        CR('Out you come. Take my hand, Pooh. Keeper, take his paw.'),
        N('You heave. Up comes Pooh, and up comes Piglet.'),
        N('Your Nubbin climbs up Pooh to help. It stops and stares.'),
        N('A tiny beetle sits in Pooh’s fur.'),
        CR('Pooh! You found Small!', 'happy'),
        P('Where was he?'),
        CR('On you.'),
      ],
      [
        doIt(
          4,
          'science',
          'a beetle has six legs',
          null,
          'edu:count:beetle-legs:6',
          [
            N('Look closely at Small. A beetle is an insect. Every insect has six legs.'),
            N('(Count them on your fingers: one, two, three, four, five, six.)'),
          ],
          'Learned that insects have six legs and counted to six.',
        ),
      ],
    ),
    sc(
      'a11-13-complete',
      [
        R('Found! By my search. Well done, me.', 'happy'),
        N('Small says nothing, being a beetle.'),
        P('I found him without looking. That is the easiest way.', 'happy'),
        N('Your Nubbin looks under every leaf on the way home.'),
      ],
      [
        notice(
          2,
          'sel',
          'working together to find a friend',
          'CASEL: Relationship skills',
          [
            N('Rabbit, Pooh, Piglet, Christopher Robin and you all helped.'),
            N('When friends go looking together, things get found.'),
          ],
          'Heard that friends can find things together.',
        ),
      ],
    ),
  ],
);

// ================================================================== A11-14 Tiggers Don't Climb Trees
const Q14: EduQuest = quest(
  'a11-14',
  'Up a Tree',
  {
    'a11-14-s1': {
      goal: 'Follow Tigger and Roo into the Forest.',
      hint: 'They went to the tall pines with a bag of sandwiches.',
    },
    'a11-14-s2': {
      goal: 'Hold one corner of the tunic while Tigger jumps.',
      hint: 'Pull your corner tight. Do not let go.',
    },
  },
  [
    sc(
      'a11-14-climb',
      [
        N('Tigger takes Roo for a walk, with malt sandwiches.'),
        RO('Can Tiggers climb trees?'),
        T('Tiggers are the best tree-climbers!', 'happy'),
        N('Up goes Tigger, with Roo on his back. Whoosh!'),
        N('Then Tigger looks down. He looks for a long time.'),
        T('Up is easy. Down is not their best thing.', 'shock'),
        RO('We are stuck! Is it lovely? We are up a tree!', 'happy'),
      ],
      [
        ask(
          6,
          'sel',
          'asking for help when you cannot get down',
          'CASEL: Responsible decision-making',
          [N('Tigger cannot get down. What is a good thing to do?')],
          [
            opt('Call for help', [N('Yes! Calling for help is the safe thing to do.')], true),
            opt('Jump', [N('Jumping could hurt. Calling for help is safer.')]),
          ],
          'Learned to call for help rather than jump when stuck up high.',
        ),
      ],
      [
        {
          id: 'call',
          label: 'Call up that help is coming.',
          then: [T('Good! Tiggers are not worried. But do hurry.')],
        },
        {
          id: 'company',
          label: 'Send your Nubbin up to sit with them.',
          then: [N('Your Nubbin climbs to the lowest branch, and sits there for company.')],
        },
        {
          id: 'run',
          label: 'Run for Christopher Robin.',
          then: [N('You run. Pooh and Piglet are already coming.')],
        },
      ],
    ),
    sc(
      'a11-14-climb-done',
      [
        N('Soon everyone stands at the bottom of the pine.'),
        N('They all look up.'),
        N('(Point up. Point down. Up is high. Down is low.)'),
      ],
      [
        notice(
          2,
          'science',
          'cats climb up easily and need help down',
          '4-LS1-1',
          [
            N('Cats do this too. They climb up fast, and then find coming down hard.'),
            N('Their claws curve the wrong way for going down. They need a little help.'),
          ],
          'Learned that cats climb up easily but may need help coming down.',
        ),
      ],
    ),
    sc(
      'a11-14-tunic',
      [
        N('Christopher Robin holds out his tunic, like a sheet.'),
        N('You, Pooh, Piglet and Christopher Robin take a corner each.'),
        CR('Pull it tight, Keeper. Pooh, yours is sagging.'),
        P('It is not sagging. It is having a little sit-down.'),
        N('Roo jumps, boing! He bounces out, and in again.'),
        N('Tigger thinks about jumping for a long, long time.'),
        N('You hold your corner. Your arms ache, but you do not let go.'),
        N('Then Tigger jumps, all at once.'),
      ],
      [
        doIt(
          1,
          'maths',
          'a square has four corners',
          'K.G.A.2',
          'edu:count:corners:4',
          [
            N('The tunic is flat and square. (Point to each corner.)'),
            N('One, two, three, four corners. Four friends hold one each.'),
          ],
          'Counted the four corners of a square.',
        ),
      ],
    ),
    sc(
      'a11-14-tunic-done',
      [
        N('Crash! Everyone falls in a heap.'),
        E('Thank you. I was quite comfortable down here.', 'sad'),
        N('Eeyore is at the bottom of the heap. He is fine.'),
      ],
      [
        notice(
          1,
          'sel',
          'waiting for someone to feel brave',
          'CASEL: Social awareness',
          [
            N('Tigger needed a long time to feel brave. You waited. You did not rush.'),
            N('Being patient with a friend is a way of being kind.'),
          ],
          'Heard that being patient while a friend feels brave is kind.',
        ),
      ],
    ),
    sc(
      'a11-14-complete',
      [
        T('Did you see me? Tiggers can jump out of trees. Easily.', 'happy'),
        CR('Let us say it is a thing they do with help.'),
        N('Christopher Robin puts his tunic back on.'),
        N('It has a Tigger-shaped stretch now.'),
        N('Your Nubbin cannot get down its branch either. It has to be lifted.'),
      ],
      [
        ask(
          4,
          'literacy',
          'what happened first, next and last',
          'RL.K.3',
          [N('Tigger climbed up first. Then he got stuck. What happened last?')],
          [
            opt('He jumped into the tunic', [N('Yes! First up, next stuck, last jump!')], true),
            opt('He flew home', [N('Tigger cannot fly. Last, he jumped into the tunic.')]),
          ],
          'Put the events of a story in order: first, next, last.',
        ),
      ],
    ),
  ],
);

// ================================================================== A11-15 Rabbit's Busy Day
const Q15: EduQuest = quest(
  'a11-15',
  'The Note on the Door',
  {
    'a11-15-s1': {
      goal: 'Go with Rabbit to Christopher Robin’s house.',
      hint: 'Rabbit is off to tell Christopher Robin what to do.',
    },
    'a11-15-s2': {
      goal: 'Ask Owl what the note means.',
      hint: 'Take the note to Owl’s tree.',
    },
    'a11-15-s3': {
      goal: 'Ask Eeyore, who has been learning something with sticks.',
      hint: 'Eeyore stands over three sticks.',
    },
  },
  [
    sc(
      'a11-15-note',
      [
        N('Rabbit wakes up feeling important.'),
        R('I shall tell Christopher Robin what to do today.'),
        N('But Christopher Robin is not at home.'),
        N('A note is pinned to his door. The spelling wobbles.'),
        R('Backson? What is a Backson? Gone out with a Backson?', 'think'),
        R('I must ask Owl. Owl can read.'),
      ],
      [
        ask(
          4,
          'literacy',
          'sound out a word: back-son',
          'ELOF: Literacy',
          [N('Sound it out slowly: back… son. What does it sound like?')],
          [
            opt('Back soon', [N('Yes! Back soon! Christopher Robin spelled it by sound.')], true),
            opt('A big animal', [N('Say it slowly again: back… son. It sounds like back soon.')]),
          ],
          'Sounded out a wobbly word and found it said back soon.',
        ),
      ],
      [
        {
          id: 'again',
          label: 'Read the note again, slowly.',
          then: [N('You read it again, and it is no clearer. Some notes are like that.')],
        },
        {
          id: 'seen',
          label: 'Ask Rabbit if he has ever seen a Backson.',
          then: [R('Certainly not. But that is what a Backson would want me to say.', 'think')],
        },
        {
          id: 'sniff',
          label: 'Let your Nubbin sniff the note.',
          then: [N('Your Nubbin sniffs it. It smells of breakfast and pencil.')],
        },
      ],
    ),
    sc(
      'a11-15-owl',
      [
        O('Ah. Let me see.', 'think'),
        N('Owl reads the note upside down. Then the right way up.'),
        O('A perfectly ordinary message. He has gone out with a Backson.'),
        R('What does a Backson look like?'),
        O('Large, I should think.'),
        O('I know my days. Tuesday. T, U, E… there is an S somewhere.'),
        N('Your Nubbin cannot spell anything. It looks at Owl with respect.'),
      ],
      [
        ask(
          5,
          'maths',
          'the order of the days of the week',
          'ELOF: Mathematics Development',
          [N('Owl is trying to spell Tuesday. Which day comes after Tuesday?')],
          [
            opt('Wednesday', [N('Yes! Monday, Tuesday, Wednesday.')], true),
            opt('Monday', [N('Monday comes before Tuesday. After Tuesday comes Wednesday.')]),
          ],
          'Named the day after Tuesday.',
        ),
      ],
    ),
    sc(
      'a11-15-owl-done',
      [
        R('Eeyore might have seen it. He sees most things.'),
        N('Owl does not always spell every word right.'),
        N('Nobody does. That is how we learn.'),
      ],
      [
        notice(
          2,
          'sel',
          'mistakes help us learn',
          'ELOF: Approaches to Learning',
          [
            N('Owl is clever, and still gets some words wobbly.'),
            N('Mistakes are not bad. They help us learn, one try at a time.'),
          ],
          'Heard that mistakes help us learn.',
        ),
      ],
    ),
    sc(
      'a11-15-a',
      [
        N('Eeyore stands over three sticks on the ground.'),
        N('Two lean together at the top. One goes across the middle.'),
        E('Do you know what that is? An A! I made it.', 'think'),
        R('Of course it is an A. Everybody knows that.'),
        N('Rabbit says it airily. Eeyore’s ears go down.'),
        E('Christopher Robin taught me. He goes out in the mornings now, to learn things.'),
        R('Learn? Then the Backson is… oh.', 'think'),
        N('Rabbit stands very still. It is the first time today he is not busy.'),
      ],
      [
        doIt(
          1,
          'literacy',
          'making the letter A out of lines',
          'ELOF: Literacy',
          'edu:build:letter:A',
          [
            N('The letter A is made of three lines. Two lean together at the top.'),
            N('One goes across the middle. Make an A with three sticks, or three fingers.'),
          ],
          'Built the letter A from three lines.',
        ),
      ],
    ),
    sc(
      'a11-15-a-done',
      [
        E('Somebody has to look after the A. In case he forgets it.', 'soft'),
        N('Eeyore’s ears are up again.'),
        N('He is proud of his A. He worked hard on it.'),
      ],
      [
        ask(
          1,
          'sel',
          'saying something kind about someone’s work',
          'CASEL: Relationship skills',
          [N('Eeyore is proud of his A. What is a kind thing to say?')],
          [
            opt('Well done, Eeyore!', [N('Yes! Kind words help someone feel proud.')], true),
            opt('That is easy', [
              N('Easy things can still be hard to learn. “Well done” is kinder.'),
            ]),
          ],
          'Chose kind words to say about a friend’s work.',
        ),
      ],
    ),
    sc(
      'a11-15-complete',
      [
        N('Christopher Robin comes home at lunchtime, with ink on his fingers.'),
        CR('Hello! Did you see my note? I said I would be back soon.', 'happy'),
        N('He is. Rabbit walks home slowly, thinking about mornings.'),
        N('Your Nubbin guards Eeyore’s A until Eeyore says it can go.'),
      ],
      [
        notice(
          1,
          'literacy',
          'wobbly spelling is how we start writing',
          'ELOF: Literacy',
          [
            N('Back soon. We could read it, even with wobbly letters.'),
            N('Everyone starts to write by listening for sounds. Wobbly spelling is a good start.'),
          ],
          'Heard that wobbly spelling is a good way to start writing.',
        ),
      ],
    ),
  ],
);

// ================================================================== A11-16 Poohsticks
const Q16: EduQuest = quest(
  'a11-16',
  'Sticks on the Bridge',
  {
    'a11-16-s1': {
      goal: 'Watch Pooh invent a game on the bridge.',
      hint: 'Pooh is on the little wooden bridge with a fir-cone.',
    },
    'a11-16-s2': {
      goal: 'Play the stick game with everyone on the bridge.',
      hint: 'Drop your stick on “now”. Run to the other side.',
    },
    'a11-16-s3': {
      goal: 'Help Pooh wash Eeyore to the bank.',
      hint: 'Help lift the big stone. Drop it beside Eeyore, not on him.',
    },
  },
  [
    sc(
      'a11-16-cone',
      [
        N('Pooh crosses the bridge with a fir-cone.'),
        N('He trips over nothing, and plop! The cone falls in the river.'),
        P('Bother.'),
        N('He runs to the other side. The cone comes out from under the bridge!'),
        P('I dropped it on that side. It came out on this one.', 'think'),
        N('He drops two cones at once, a big one and a small one.'),
        N('Cones all look the same. Pooh picks sticks instead.'),
        N('That is how the stick game begins.'),
      ],
      [
        ask(
          4,
          'science',
          'which way a stream flows',
          null,
          [N('Pooh drops the cone on one side. Where does it come out?')],
          [
            opt(
              'On the other side, with the water',
              [N('Yes! The stream carries things along, under the bridge.')],
              true,
            ),
            opt('Back where it started', [
              N('Not quite. A stream flows one way, and carries the cone with it.'),
            ]),
          ],
          'Noticed that a stream carries things in the direction it flows.',
        ),
      ],
    ),
    sc(
      'a11-16-game',
      [
        N('Soon everyone plays: Pooh, Piglet, Rabbit, Roo, you and your Nubbin.'),
        CR('Everybody drop on “now”. Then run to the other side.'),
        N('Your Nubbin drops its stick. Then it drops itself in, too!'),
        N('Your Nubbin swims out to the fast middle. Its stick rides along beside it.'),
        RO('That is not fair! Can I do that?'),
        CR('Not you, Roo. You are too small for the river.'),
        P('I think it is fair. Nothing says you cannot go with your stick.', 'think'),
        N('Your Nubbin’s stick comes out first, and wins. It shakes itself all over Piglet.'),
        CR('Does that count? Probably. I think.', 'think'),
        PG('Woozles shake like that. I am nearly sure.', 'shock'),
      ],
      [
        notice(
          1,
          'social-studies',
          'fair rules: everyone starts together',
          'D2.Civ.8.K-2',
          [
            N('Everybody drops on “now”. Nobody gets a head start.'),
            N('Starting together is a fair rule. Fair rules help everyone enjoy the game.'),
          ],
          'Heard that starting together is a fair rule in a game.',
        ),
        doIt(
          3,
          'science',
          'the middle of a stream flows fastest',
          'ELOF: Scientific Reasoning',
          'edu:drop:stick:middle-of-stream',
          [
            N('Near the bank, the stream is slow. In the middle, it is fast.'),
            N('Whoosh! A stick in the fast middle wins.'),
            N('(Drop one near the edge, one in the middle.)'),
          ],
          'Learned that a stream flows fastest in the middle, so a stick there wins.',
        ),
      ],
      [
        {
          id: 'counts',
          label: 'Let it count.',
          then: [P('It counts. It is my game, so I say.', 'happy')],
        },
        {
          id: 'not',
          label: 'Say it should not count.',
          then: [P('Then it won the next best thing, which is getting wet on purpose.')],
        },
        {
          id: 'mine',
          label: 'Drop your own stick and run.',
          then: [N('Your stick comes out last. Some sticks like the view.')],
        },
      ],
    ),
    sc(
      'a11-16-eeyore',
      [
        N('Something big and grey floats out from under the bridge.'),
        N('It is Eeyore, on his back, upside down. He looks calm.'),
        E('Do not mind me. I am upside down in a river. It is restful.', 'sad'),
        CR('Eeyore, what are you doing there?'),
        E('Floating. Not by choice.'),
        P('A big stone makes a wave. A wave pushes him to the bank.', 'think'),
        N('You help Pooh lift the stone. Your Nubbin pushes from underneath.'),
        P('Now!'),
        N('Splash! A great wave rolls Eeyore over, and he walks out.'),
      ],
      [
        ask(
          5,
          'maths',
          'compare: heavier and lighter',
          'K.MD.A.2',
          [N('The stone is very big. Is it heavier than a leaf, or lighter?')],
          [
            opt(
              'Heavier',
              [N('Yes! The stone is heavy. That is why it takes three to lift.')],
              true,
            ),
            opt('Lighter', [N('A leaf is light. The stone is heavier. It takes three to lift.')]),
          ],
          'Compared a stone and a leaf: heavier and lighter.',
        ),
      ],
    ),
    sc(
      'a11-16-bounced',
      [
        E('I was bounced. Into the river. Tigger bounced me.', 'angry'),
        N('Tigger arrives. He says he only coughed.'),
        N('Everyone looks at Tigger. Tigger looks at the sky.'),
        T('Just a cough. A big Tigger cough.'),
        E('Some coughs are bouncier than others. That is all I am saying.'),
      ],
      [
        ask(
          3,
          'sel',
          'saying sorry when you have bumped someone',
          'CASEL: Relationship skills',
          [N('Eeyore got bounced into the river. What would help him feel better?')],
          [
            opt(
              'Tigger says, “Sorry, Eeyore”',
              [N('Yes! A real sorry helps someone feel seen.')],
              true,
            ),
            opt('Everyone looks away', [N('Looking away does not help. A kind sorry does.')]),
          ],
          'Talked about how saying sorry helps someone feel better.',
        ),
      ],
    ),
    sc(
      'a11-16-complete',
      [
        N('Afterwards everyone plays again, Eeyore too, dripping.'),
        N('He wins twice and says it does not count.'),
        P('The best thing about this game is you can play for ever.', 'happy'),
        N('Your Nubbin watches the water go under. Same water, new water.'),
        CR('You could have a bridge like this at home. Any stream will do.'),
      ],
      [
        doIt(
          2,
          'maths',
          'first, second and last',
          'ELOF: Mathematics Development',
          'edu:order:sticks:first-second-last',
          [
            N('Drop three sticks. Watch them come out.'),
            N('Which comes out first? Which is second? Which is last? (Point to each.)'),
          ],
          'Put three sticks in order: first, second and last.',
        ),
      ],
    ),
  ],
);

// ================================================================== A11-17 Tigger Is Unbounced
const Q17: EduQuest = quest(
  'a11-17',
  'A Game in the Mist',
  {
    'a11-17-s1': {
      goal: 'Hear Rabbit’s plan, and choose whom to walk with.',
      hint: 'Your choice decides where you are when the mist comes down.',
    },
    'a11-17-s2': {
      goal: 'Get through the mist.',
      hint: 'Stay close to whoever you are with. Listen.',
    },
  },
  [
    sc(
      'a11-17-plan',
      [
        R('Tigger is very bouncy. He bounces on everybody.', 'angry'),
        R('Here is my plan. A game of hide-and-seek, in the mist.'),
        P('Why?'),
        R('We hide in the mist. Tigger cannot find us.'),
        R('He is lost for a bit, and we get some peace.'),
        PG('Lost? On his own? That is not kind.'),
        N('A mist is coming up from the river, white and soft.'),
        T('A walk! Tiggers love walks!', 'happy'),
      ],
      [
        notice(
          6,
          'science',
          'mist is tiny drops of water in the air',
          'ELOF: Scientific Reasoning',
          [
            N('Mist is tiny drops of water floating in the air near the ground.'),
            N('It is like a soft, low cloud. It makes things hard to see.'),
          ],
          'Learned that mist is tiny drops of water in the air.',
        ),
      ],
      [
        {
          id: 'rabbit',
          label: 'Go with Rabbit.',
          set: { 'a11-mist': 'rabbit' },
          then: [R('Good. Someone sensible. Keep up, and keep quiet.')],
        },
        {
          id: 'tigger',
          label: 'Stay with Tigger.',
          set: { 'a11-mist': 'tigger' },
          then: [T('Hooray! Tiggers like company.', 'happy')],
        },
      ],
    ),
    sc(
      'a11-17-plan-done',
      [
        N('Into the mist they go. Rabbit leads.'),
        N('Tigger bounces round the outside of everybody.'),
        N('The Forest goes soft and white.'),
      ],
      [
        notice(
          2,
          'sel',
          'a plan should be kind to everyone',
          'CASEL: Social awareness',
          [
            N('Piglet said the plan was not very kind. He was right to say so.'),
            N('A good plan asks: how would I feel?'),
            N('If it would make a friend lonely, it is not kind.'),
          ],
          'Heard that a good plan is kind to everyone, and it is okay to say when it is not.',
        ),
      ],
    ),
    sc(
      'a11-17-mist',
      [
        N('At the top of the Forest, in a hollow, Rabbit whispers, “Now!”'),
        N('They duck behind a bank. Tigger bounces on, with you.'),
        T('Where is everybody? Hello?', 'think'),
        T('They must be lost. Poor things.'),
        N('Tigger bounces you home to Kanga’s.'),
        N('Pooh and Piglet come in, damp. Rabbit does not come.'),
        T('Tiggers never get lost. I will fetch him!', 'happy'),
        T('Where would a Rabbit be? Under things. Rabbits like under.', 'think'),
        N('He looks under a leaf, a stone, and you. No Rabbit!'),
        N('He bounces into the white. You follow, holding your Nubbin close.'),
      ],
      [
        notice(
          9,
          'health',
          'if you are lost, stay still and call out',
          'CASEL: Responsible decision-making',
          [
            N('If you are lost, here is the rule: stop, stay put, and call out.'),
            N('Do not wander off. A grown-up will find you faster if you stay still.'),
          ],
          'Learned the safety rule: if lost, stop, stay put and call out.',
        ),
      ],
    ),
    sc(
      'a11-17-found',
      [
        N('You hear a small voice in a hollow, saying, “Hello?” Very bravely.'),
        T('Rabbit! There you are! Tiggers are good at finding!', 'happy'),
        N('Rabbit comes out. For once, he has no plan.'),
        R('Tigger. Oh, Tigger. I am glad to see you.', 'soft'),
      ],
      [
        ask(
          0,
          'science',
          'in mist we hear further than we see',
          'ELOF: Scientific Reasoning',
          [N('In the mist it is hard to see. What helps you find a friend?')],
          [
            opt('Listening', [N('Yes! Ears help when eyes cannot see far.')], true),
            opt('Running fast', [
              N('Running can get you more lost. Listening helps you find a friend.'),
            ]),
          ],
          'Noticed that listening helps when it is hard to see.',
        ),
      ],
    ),
    sc(
      'a11-17-complete',
      [
        N('Tigger takes everyone home, bouncing, by a short way.'),
        R('He is still very bouncy. Too bouncy.', 'think'),
        N('Rabbit says it quietly. He does not quite mean it any more.'),
        T('Tiggers do not get lost. Tiggers find.', 'happy'),
      ],
      [
        notice(
          2,
          'literacy',
          'characters can change in a story',
          'RL.K.3',
          [
            N('First Rabbit was cross with Tigger. Now he is glad of him.'),
            N('In stories, characters can change. (Make a cross face. Now a glad face.)'),
          ],
          'Noticed that a character changed from cross to glad.',
        ),
      ],
    ),
  ],
);

// ================================================================== A11-18 Piglet Does a Very Grand Thing
const Q18: EduQuest = quest(
  'a11-18',
  'A Very Grand Thing',
  {
    'a11-18-s1': {
      goal: 'Visit Owl with Pooh and Piglet on a very windy day.',
      hint: 'Hold on to something on the way.',
    },
    'a11-18-s2': {
      goal: 'Hold the string while Piglet climbs out through the letter-box.',
      hint: 'Take your place on the string behind Pooh.',
    },
    'a11-18-s3': {
      goal: 'Help Eeyore find a new house for Owl.',
      hint: 'Follow Eeyore through the Forest.',
    },
  },
  [
    sc(
      'a11-18-wind',
      [
        N('It is a very windy day. Piglet’s ears stream out behind him.'),
        PG('What if a tree fell on us, Pooh?', 'shock'),
        P('Most trees stay up. That is what they are best at.'),
        N('You all reach Owl’s house, and go in.'),
        N('Crash! The room tips over slowly, and everything slides.'),
        N('The floor is a wall. The door is in the ceiling.'),
        PG('Pooh, is it still the same day?', 'shock'),
        O('My house is on its side. This has never happened.', 'sad'),
      ],
      [
        notice(
          0,
          'science',
          'weather words for wind: breeze, blustery, gale',
          'ELOF: Scientific Reasoning',
          [
            N('A breeze is a soft wind. A blustery day has big, gusty puffs.'),
            N('A gale is a very strong wind. Today is blustery.'),
          ],
          'Learned the weather words breeze, blustery and gale.',
        ),
      ],
      [
        {
          id: 'check',
          label: 'Check everyone is all right.',
          then: [N('Everyone is all right. Owl is ruffled, and Pooh sits on the tablecloth.')],
        },
        {
          id: 'out',
          label: 'Look for a way out.',
          then: [N('The windows are full of branches. There is only the letter-box.')],
        },
        {
          id: 'hand',
          label: 'Hold Piglet’s hand.',
          then: [PG('Th-thank you. I am not frightened. My hand is.', 'soft')],
        },
      ],
    ),
    sc(
      'a11-18-wind-done',
      [
        P('The letter-box. Only somebody very small could get through.', 'think'),
        N('Everyone looks at Piglet.'),
        N('(Point to the smallest friend.)'),
      ],
      [
        ask(
          2,
          'health',
          'in a strong wind, a strong low house away from tall trees is safest',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('In a strong, blustery wind, where is the safest place to be?')],
          [
            opt(
              'In a strong, low house, away from tall trees',
              [N('Yes! Owl’s house was up a tree. That is why it fell over.')],
              true,
            ),
            opt('Under a big tree', [
              N('Owl lived up a tree. His house fell over! Low houses are safer.'),
            ]),
          ],
          'Learned that a strong, low house away from tall trees is safest in a strong wind.',
        ),
      ],
    ),
    sc(
      'a11-18-letterbox',
      [
        N('Everyone looks at Piglet. Piglet looks at the letter-box.'),
        PG('M-me? Through there?'),
        P('Then you fetch Christopher Robin, and he gets us out.'),
        O('I shall tie a string round you. My knots are well known.'),
        N('Pooh holds the string, you hold Pooh, and your Nubbin holds you.'),
        N('Up goes Piglet to the letter-box in the ceiling.'),
        N('He squeezes, wriggles, and goes through with a squeak.'),
        PG('I am going for Christopher Robin! I am not frightened! Only a bit!'),
      ],
      [
        ask(
          7,
          'sel',
          'brave means doing it even when you feel scared',
          'CASEL: Self-management',
          [N('Piglet feels scared, and he goes anyway. What does brave mean?')],
          [
            opt(
              'Doing it even when you feel scared',
              [N('Yes! Piglet was brave. Brave is not the same as not scared.')],
              true,
            ),
            opt('Never feeling scared', [
              N('Everyone feels scared sometimes. Brave means going on anyway.'),
            ]),
          ],
          'Learned that being brave means acting even when you feel scared.',
        ),
      ],
    ),
    sc(
      'a11-18-letterbox-done',
      [
        N('Soon Christopher Robin arrives with a ladder.'),
        N('Piglet comes with him, very proud, trying not to be.'),
        N('(Count the ladder steps with me: one, two, three, four, five.)'),
      ],
      [
        doIt(
          2,
          'maths',
          'count the ladder steps to 5',
          'K.CC.A.1',
          'edu:count:ladder-steps:5',
          [
            N('Up the ladder, step by step. One, two, three, four, five.'),
            N('Five steps up, and out into the fresh air.'),
          ],
          'Counted five ladder steps in order.',
        ),
      ],
    ),
    sc(
      'a11-18-house',
      [
        N('Pooh makes up a long hum about Piglet’s grand thing.'),
        N('Piglet listens to every part. At the end he asks for it again.'),
        O('I need a new house. With a knocker.', 'sad'),
        E('Leave it to me. I know the Forest.'),
        N('The next day, Eeyore leads you to a beech tree.'),
        E('There. A house. Nobody is using it.', 'happy'),
        N('It is Piglet’s house. Everybody knows, except Eeyore.'),
        N('Piglet looks at Eeyore. Eeyore is happier than anyone has seen him.'),
      ],
      [
        notice(
          4,
          'science',
          'owls often live in holes in trees',
          '2-LS4-1',
          [
            N('Real owls often make their homes in holes in trees.'),
            N('Different animals live in different places. Squirrels, birds, and owls too.'),
          ],
          'Learned that owls often live in tree holes.',
        ),
      ],
    ),
    sc(
      'a11-18-house-done',
      [
        PG('Yes. It is just the house for Owl.', 'soft'),
        N('Piglet says it bravely.'),
        N('Then he has to look at the ground for a while.'),
      ],
      [
        ask(
          2,
          'sel',
          'feelings can mix: proud and sad together',
          'CASEL: Self-awareness',
          [N('Piglet gave up his house. How might Piglet feel?')],
          [
            opt('Proud and a little sad', [N('Yes. We can feel two things at once.')], true),
            opt('Only happy', [N('He may feel happy. But giving up a home can feel sad too.')]),
          ],
          'Talked about feeling two things at once.',
        ),
      ],
    ),
    sc(
      'a11-18-complete',
      [
        P('Piglet, you could come and live with me. Will you?', 'soft'),
        PG('Oh, Pooh. Yes. Thank you.', 'happy'),
        N('Owl moves into Piglet’s old house. He gives it a grand new name.'),
        N('He spells it wrong.'),
        N('Your Nubbin carries Piglet’s smallest chair to Pooh’s, very carefully.'),
      ],
      [
        notice(
          1,
          'social-studies',
          'noticing when a friend needs help',
          'D2.Civ.8.K-2',
          [
            N('Pooh saw that Piglet had no home, and he offered his own.'),
            N('Noticing what a friend needs is one of the kindest things we can do.'),
          ],
          'Heard that noticing a friend’s need is a kind thing to do.',
        ),
      ],
    ),
  ],
);

// ================================================================== A11-19 The Rissolution
const S19_DELIVER: Line[] = [
  N('Everyone walks to Christopher Robin’s door.'),
  N('Nobody wants to go first.'),
  N('Eeyore goes first, because it is his poem.'),
  CR('What is this?'),
  E('A Rissolution. From all of us. You read it.', 'sad'),
  N('Christopher Robin reads it to the end, and all the names.'),
  CR('Thank you. All of you.', 'soft'),
];

const Q19: EduQuest = quest(
  'a11-19',
  'The Rissolution',
  {
    'a11-19-s1': {
      goal: 'Go to the meeting Rabbit has called, and sign the Rissolution.',
      hint: 'Everyone is at Pooh Corner. Sign at the bottom, any way you like.',
    },
    'a11-19-s2': {
      goal: 'Take the Rissolution to Christopher Robin.',
      hint: 'Walk with everyone to his door.',
    },
  },
  [
    sc(
      'a11-19-meeting',
      [
        N('Soon Christopher Robin will be somewhere else, most of the time.'),
        N('Nobody says so. But everybody knows.'),
        N('Everyone feels sad. Sad is allowed.'),
        R('A Meeting has been called. By me. Eeyore has written a poem.', 'think'),
        E('A Rissolution. Do not expect much.', 'sad'),
        N('Eeyore reads it. It rhymes in places, and it says: we will miss you.'),
        N('Nobody laughs. Even Tigger stands still.'),
        PG('It is a very good poem, Eeyore.'),
        R('Now everybody signs their name at the bottom.'),
      ],
      [
        notice(
          8,
          'literacy',
          'poems often rhyme',
          'RF.K.2',
          [
            N('Eeyore’s poem rhymes in places. Rhymes are words that end the same way.'),
            N('Miss and kiss rhyme. Pooh and you rhyme. What rhymes with Roo?'),
          ],
          'Learned that poems often rhyme and gave rhyming words.',
        ),
        ask(
          7,
          'sel',
          'what helps when you feel sad about a goodbye',
          'ELOF: Social and Emotional Development',
          [N('Everyone feels sad. What could help?')],
          [
            opt(
              'Make something kind, together',
              [N('Yes! Making a poem for him was a loving thing.')],
              true,
            ),
            opt('Pretend not to be sad', [
              N('Sad feelings need room. Sharing them, or making something, helps.'),
            ]),
            opt('Hide away', [N('Being together helps more. Friends can be sad together.')]),
          ],
          'Talked about feeling sad and what helps: sharing and making something kind.',
        ),
      ],
      [
        {
          id: 'name',
          label: 'Sign your name.',
          then: [N('You sign it, in your best letters, under Piglet’s.')],
        },
        {
          id: 'paw',
          label: 'Let your Nubbin sign with a paw.',
          then: [N('Your Nubbin presses an inky paw down. Crooked, and its own.')],
        },
        {
          id: 'pooh',
          label: 'Help Pooh with his letters.',
          then: [P('P, O, O, H. It looks right. It looks like me.', 'happy')],
        },
      ],
    ),
    sc(
      'a11-19-signed',
      [
        N('Tigger signs next to you. His T bounces off the edge.'),
        T('Is he coming back? He is. Isn’t he?', 'think'),
        N('Nobody answers. Tigger bounces once, very small.'),
        N('(Grown-up: you can say, “I do not know, but he loves you all.”)'),
      ],
      [
        ask(
          3,
          'literacy',
          'the first letter of a name: T for Tigger',
          'RF.K.2',
          [N('Tigger signs his name. Which letter does Tigger start with?')],
          [
            opt('T', [N('Yes! T for Tigger. Tuh, tuh, Tigger!')], true),
            opt('P', [N('P is for Pooh and Piglet. Tigger starts with T.')]),
          ],
          'Matched Tigger’s name to its first letter, T.',
        ),
      ],
    ),
    sc(
      'a11-19-scroll',
      [
        N('Rabbit rolls up the scroll. A blue ribbon is already round it.'),
        E('I took it off my door. My door can bang for a bit.', 'soft'),
        E('It is a Friend ribbon. He will know.', 'soft'),
        ...S19_DELIVER,
      ],
      [
        notice(
          9,
          'sel',
          'giving away something you use shows someone matters',
          'CASEL: Relationship skills',
          [
            N('Eeyore took the ribbon off his own door, to give to his friend.'),
            N('Giving away something you use is a way of saying: you matter to me.'),
          ],
          'Heard that giving away something you use shows a friend they matter.',
        ),
      ],
    ),
    sc(
      'a11-19-scroll-done',
      [
        N('Then everyone goes home quietly, one by one.'),
        N('Rabbit goes. Owl goes. Eeyore goes.'),
        N('Tigger goes, very quietly, for a Tigger.'),
        N('Piglet goes last of all. Only Pooh is left.'),
        N('You wait by the gate with your Nubbin.'),
        N('Nobody asked you to. It seems the right place to be.'),
      ],
      [
        notice(
          5,
          'maths',
          'one by one: count the friends who went home',
          'K.CC.B.5',
          [
            N('One by one means one at a time. (Hold up a finger for each.)'),
            N('Rabbit, Owl, Eeyore, Tigger, Piglet. Five friends went home. Pooh stayed.'),
          ],
          'Counted the five friends who went home, one at a time.',
        ),
      ],
    ),
    sc(
      'a11-19-complete',
      [
        N('After a while Christopher Robin comes out. Pooh is with him.'),
        CR('We are walking to the top of the Forest. Come some of the way?', 'soft'),
        N('Your Nubbin is already on its feet.'),
      ],
      [
        ask(
          2,
          'sel',
          'how to say goodbye kindly',
          'CASEL: Relationship skills',
          [N('A friend is going somewhere new. What is a kind thing to do?')],
          [
            opt(
              'Tell them you will remember them',
              [N('Yes! Telling someone you will remember them is a lovely gift.')],
              true,
            ),
            opt('Say nothing at all', [
              N('Words, a hug or a card can help. Saying you will remember is best.'),
            ]),
          ],
          'Talked about kind ways to say goodbye to a friend.',
        ),
      ],
    ),
  ],
);

// ================================================================== A11-20 An Enchanted Place
const Q20: EduQuest = quest(
  'a11-20',
  'The Ring of Trees',
  {
    'a11-20-s1': {
      goal: 'Walk with Christopher Robin and Pooh to the top of the Forest.',
      hint: 'Walk a little way behind them, up to the ring of trees.',
    },
    'a11-20-s2': {
      goal: 'Wait at the edge of the circle while they talk.',
      hint: 'Stay at the edge. This part is theirs.',
    },
  },
  [
    sc(
      'a11-20-climb',
      [
        N('Christopher Robin and Pooh walk up through the Forest.'),
        N('You walk a little way behind, with your Nubbin.'),
        CR('Pooh. Of all the things there are, what do you like best?', 'think'),
        P('Coming to yours. And you saying there is honey.'),
        CR('I like that too. But best of all is doing Nothing.'),
        P('What does Nothing look like?', 'think'),
        CR('It is going out for no reason. And the whole day is yours.'),
        P('Oh. I do that a lot.', 'happy'),
        N('At the top is a ring of trees, sixty-something of them.'),
        N('Nobody can count them. It changes every time.'),
      ],
      [
        doIt(
          9,
          'maths',
          'count a circle: mark where you started',
          'K.CC.B.5',
          'edu:count:trees:circle',
          [
            N('In a circle, there is no first one and no last one.'),
            N('Tie a ribbon on one tree. Count round till you reach the ribbon.'),
          ],
          'Learned to count a circle by marking where you started.',
        ),
      ],
      [
        {
          id: 'count',
          label: 'Count the trees.',
          then: [
            N('You count sixty-three, then sixty-four. Your Nubbin gives up at four, content.'),
          ],
        },
        {
          id: 'look',
          label: 'Do not count them. Just look.',
          then: [N('You just look. It seems a place that would rather not be counted.')],
        },
      ],
    ),
    sc(
      'a11-20-knight',
      [
        N('At the edge of the circle, you stop. Your Nubbin sits down.'),
        N('Christopher Robin and Pooh go into the middle, and sit.'),
        N('They talk about kings and queens, and a place called Brazil.'),
        N('Pooh listens. He does not mind not knowing.'),
        CR('Pooh. Stand up.'),
        N('Christopher Robin touches Pooh’s shoulders with a stick.'),
        CR('Arise, Sir Pooh. Knight of the Forest, and my truest friend.'),
        N('Then he is quiet for a long time, looking at the trees.'),
        CR('Pooh, will you remember me? Always?', 'soft'),
        P('I will. I promise.', 'soft'),
        CR('If I am not here so much, it is not because of you.'),
        P('I shall know. Even if I do not know why.'),
      ],
      [
        notice(
          2,
          'social-studies',
          'Brazil is a country in South America',
          'D2.Geo.2.K-2',
          [
            N('Brazil is a real place on the map. It is in South America.'),
            N('A map shows where places are. (Can you find the top of a map?)'),
          ],
          'Learned that Brazil is a country in South America.',
        ),
        notice(
          11,
          'sel',
          'a promise is words you keep; remembering is how love stays',
          'CASEL: Relationship skills',
          [
            N('A promise is something you say and then keep.'),
            N('Remembering someone is a way of keeping them close, wherever they are.'),
          ],
          'Heard that a promise is kept and that remembering keeps people close.',
        ),
      ],
    ),
    sc(
      'a11-20-knight-done',
      [
        N('Christopher Robin laughs, and jumps up, and holds out his hand.'),
        N('Pooh takes it.'),
        CR('Come on, Pooh.'),
        P('Where?'),
        CR('Anywhere.', 'happy'),
      ],
      [
        notice(
          4,
          'health',
          'quiet time with a friend helps us feel calm',
          'ELOF: Perceptual, Motor, and Physical Development',
          [
            N('Doing Nothing together is a lovely way to rest.'),
            N('Quiet, slow time helps our bodies feel calm and our hearts feel full.'),
          ],
          'Heard that quiet time with a friend helps us rest and feel calm.',
        ),
      ],
    ),
    sc(
      'a11-20-complete',
      [
        N('Christopher Robin and Pooh walk off together.'),
        N('You do not follow. This part is theirs.'),
        N('Christopher Robin gave back the blue ribbon. Your Nubbin ties it on a tree.'),
        N('A boy and his Bear are playing in that ring of trees.'),
        N('The page closes gently, like a door nobody bangs.'),
        N('You are back in the Grove, with the atlas on your knee.'),
        N('By the stream is a little bridge. A blue ribbon is on its rail.'),
      ],
      [
        ask(
          2,
          'maths',
          'a marker shows where you started counting',
          'K.CC.B.5',
          [N('The ribbon is on the first tree. Why is that handy for counting?')],
          [
            opt(
              'It shows where we started',
              [N('Yes! When we get back to the ribbon, we know we are done.')],
              true,
            ),
            opt('It makes the tree pretty', [
              N('Pretty, yes! But the best reason: it marks where we started counting.'),
            ]),
          ],
          'Understood that a marker shows where counting started.',
        ),
      ],
    ),
  ],
);

// ================================================================== variants
const A11_VARIANTS_SPROUT: EduScene[] = [
  // ---------------------------------------------------------------- A11-11, step 3 done
  sc(
    'a11-11-door-thistle',
    [
      N('Eeyore goes in. He comes out again, to look at his step.'),
      N('Beside the step, a purple top pokes through the snow.'),
      N('It is the thistle your Nubbin gave him. He has planted it.'),
      E('I did not eat it. It ought to have somewhere to live.', 'soft'),
    ],
    [
      notice(
        3,
        'science',
        'plants need water and light to grow',
        '2-LS2-1',
        [
          N('A plant needs water and sunlight to grow.'),
          N('In snow, a plant can rest and wait. In spring it grows again.'),
        ],
        'Learned that plants need water and light to grow.',
      ),
    ],
  ),
  sc(
    'a11-11-door-sat',
    [
      N('Eeyore goes in. He comes out again, and sits on his new step.'),
      N('Then he shuffles to one side.'),
      N('There is a space just your size, and a smaller one beside it.'),
      E('I kept you a place. Not that you have to. Sit, I mean.', 'soft'),
    ],
    [
      notice(
        3,
        'sel',
        'sitting with a gloomy friend is a good way to be a friend',
        'CASEL: Relationship skills',
        [
          N('You sat with Eeyore when he felt gloomy. Now he saves you a place.'),
          N('Sitting with a friend who feels low is a very good thing to do.'),
        ],
        'Heard that sitting with a gloomy friend builds friendship.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A11-16, step 3 done (sat)
  sc(
    'a11-16-bounced-sat',
    [
      N('Eeyore stands dripping on the bank.'),
      N('He looks at everybody. Then, slowly, at you.'),
      E('You tell them. You are the one who sits. They will believe you.', 'soft'),
      N('You tell them, plainly, that Eeyore was bounced.'),
      N('Everyone listens. Eeyore stands a little taller.'),
      N('Tigger says he only coughed. Then he looks at his feet.'),
      T('It was a bouncy sort of cough. Sorry, Eeyore.', 'sad'),
      E('That is the first sorry I have had this year. I shall keep it.', 'soft'),
    ],
    [
      notice(
        4,
        'sel',
        'being trusted because you were kind',
        'CASEL: Social awareness',
        [
          N('Eeyore trusts you because you sat with him.'),
          N('When we are kind and steady, people feel safe. That is trust.'),
        ],
        'Heard that kindness builds trust.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A11-17, step 2 (rabbit)
  sc(
    'a11-17-mist-rabbit',
    [
      N('At the top, in a hollow, Rabbit whispers, “Now!”'),
      N('You duck behind a bank. Tigger bounces on, and on, and away.'),
      R('There. Now we go home.', 'happy'),
      N('You pass a sand-pit. Later, you pass the same sand-pit again.'),
      P('We keep coming back to this pit.', 'think'),
      R('Nonsense. I shall walk away and come straight back.'),
      N('Rabbit walks off into the mist. He does not come back.'),
      N('Pooh and Piglet follow the smell of honey home.'),
      N('You go after Rabbit, with your Nubbin, into the white.'),
      N('You find him in a hollow, small and damp.'),
      R('Oh. Good. I was not lost. I was waiting for somebody.', 'sad'),
    ],
    [
      notice(
        4,
        'health',
        'in mist it is easy to go round in circles: stop and call out',
        'CASEL: Responsible decision-making',
        [
          N('When we cannot see far, it is easy to walk in circles.'),
          N('If you are lost, stop, stay still, and call out. Help will find you.'),
        ],
        'Learned that in mist it is easy to go in circles, so stop and call out.',
      ),
    ],
  ),
  sc(
    'a11-17-found-rabbit',
    [
      N('You sit with Rabbit in the hollow while the mist drips.'),
      N('Rabbit does not say anything. Neither do you.'),
      N('Then, far off, you hear it first: a bounce, and another.'),
      Y('Listen.'),
      T('Rabbit? Keeper? Tiggers are good at finding!', 'happy'),
      R('Tigger. Oh, Tigger. I am glad to see you.', 'soft'),
    ],
    [
      notice(
        1,
        'sel',
        'sitting quietly with a scared friend',
        'CASEL: Social awareness',
        [
          N('You did not need words. You sat with Rabbit while he felt small.'),
          N('Sitting quietly with someone who is scared helps them feel less alone.'),
        ],
        'Heard that sitting quietly with a scared friend helps them feel less alone.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A11-19, step 1 done (rabbit)
  sc(
    'a11-19-signed-rabbit',
    [
      N('Rabbit signs next to you, very neatly.'),
      N('He stays there, and clears his throat.'),
      R('About the mist. I was grateful for the company. That is all.', 'soft'),
      N('He goes back to his list. He does not look up for some time.'),
    ],
    [
      notice(
        3,
        'literacy',
        'a new word: grateful',
        'ELOF: Language and Communication',
        [
          N('Grateful is a big word. It means thankful: glad that someone helped.'),
          N('Rabbit said it stiffly. A stiff thank you still counts.'),
        ],
        'Learned the word grateful, and that a stiff thank you still counts.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A11-19, step 2 scene (thistle, sat)
  sc(
    'a11-19-scroll-thistle',
    [
      N('Rabbit rolls up the scroll. Something falls out.'),
      N('It is a thistle, pressed flat. Its purple has gone pale.'),
      E('I put that in. From my step. It is not much. Well. It is.', 'soft'),
      ...S19_DELIVER,
    ],
    [
      notice(
        9,
        'science',
        'pressing a flower dries it flat so it lasts',
        null,
        [
          N('If you press a flower between pages, it dries out and stays flat.'),
          N('That is how Eeyore’s thistle lasted. It is a way of keeping something special.'),
        ],
        'Learned that pressing a plant between pages dries it so it lasts.',
      ),
    ],
  ),
  sc(
    'a11-19-scroll-sat',
    [
      N('Rabbit rolls up the scroll. Eeyore stops him.'),
      N('He asks for it back, and adds one more line at the bottom.'),
      E('Somebody sat with me.', 'soft'),
      N('He does not explain. He hands it back, and does not look at you.'),
      ...S19_DELIVER,
    ],
    [
      notice(
        10,
        'sel',
        'sitting with someone is a gift they remember',
        'CASEL: Relationship skills',
        [
          N('Eeyore wrote down that you sat with him.'),
          N('It cost nothing, and he will remember it. Time together is a gift.'),
        ],
        'Heard that time spent with someone is a gift they remember.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- A11-20, complete (thistle, sat)
  sc(
    'a11-20-complete-thistle',
    [
      N('Christopher Robin and Pooh walk off together.'),
      N('You do not follow. This part is theirs.'),
      N('Your Nubbin plants a thistle at the edge of the circle.'),
      N('A boy and his Bear are playing in that ring of trees.'),
      N('The page closes gently, like a door nobody bangs.'),
      N('You are back in the Grove, with the atlas on your knee.'),
      N('By the stream is a little bridge. A thistle grows at the far end.'),
    ],
    [
      notice(
        2,
        'science',
        'plants grow from seeds and need water',
        '2-LS2-1',
        [
          N('Thistles grow from seeds. Planted in soil, they need water and sunshine.'),
          N('Give it time, and a small plant will grow where your Nubbin planted it.'),
        ],
        'Learned that plants grow from seeds and need water and sunshine.',
      ),
    ],
  ),
  sc(
    'a11-20-complete-sat',
    [
      N('Christopher Robin and Pooh walk off together.'),
      N('You do not follow. This part is theirs.'),
      N('Your Nubbin turns round three times in the grass, and sits.'),
      N('A flat round is left, like the one by Eeyore’s step.'),
      N('A boy and his Bear are playing in that ring of trees.'),
      N('The page closes gently, like a door nobody bangs.'),
      N('You are back in the Grove, with the atlas on your knee.'),
      N('By the stream is a little bridge. One place is worn smooth, for sitting.'),
    ],
    [
      notice(
        3,
        'science',
        'flattened grass shows where an animal has sat',
        'K-ESS2-2',
        [
          N('When an animal sits or sleeps in grass, it leaves a flat round.'),
          N('Signs like this tell us who has been there. Scientists call it a clue.'),
        ],
        'Learned that flattened grass is a clue that an animal has rested there.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- Hazel's margin note
  sc(
    'a11-margin-hazel',
    [
      N('The atlas lies open at the last page of the Forest.'),
      N('Beside the ring of trees is a note in the margin, in soft pencil.'),
      N('You know the writing. It is Gran Hazel’s.'),
      N('It says: Read this to the little one, the summer they stayed.'),
      N('They asked where Christopher Robin went.'),
      N('Somewhere, I said. Not away.', 'soft'),
      N('At the bottom is one letter: H.'),
      N('Maybe you remember a little: a lap, a voice, a turning page.'),
      N('Your Nubbin climbs into your lap. You sit with the page.'),
    ],
    [
      notice(
        7,
        'sel',
        'writing things down keeps people close',
        'CASEL: Self-awareness',
        [
          N('Gran Hazel wrote this note a long time ago. And it still reaches you.'),
          N('A note, a drawing or a letter can keep someone close.'),
          N('You can make one too.'),
        ],
        'Heard that a note or drawing can keep someone close.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A11_SPROUT: EduQuest[] = [
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
  Q19,
  Q20,
];

/** Sprout versions of every scene in A11_VARIANTS. */
export const EDU_A11_SPROUT_VARIANTS: EduScene[] = A11_VARIANTS_SPROUT;

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  'edu:order:days-of-week',
  'edu:count:footprints:3',
  'edu:count:taps:2',
  'edu:count:pine-trees:6',
  'edu:count:hops:5',
  'edu:place:hat:on-top-of-pole',
  'edu:place:plates:one-each',
  'edu:count:breakfast-tries:3',
  'edu:clap:syllables:tigger',
  'edu:count:beetle-legs:6',
  'edu:count:corners:4',
  'edu:build:letter:A',
  'edu:drop:stick:middle-of-stream',
  'edu:order:sticks:first-second-last',
  'edu:count:ladder-steps:5',
  'edu:count:trees:circle',
];
