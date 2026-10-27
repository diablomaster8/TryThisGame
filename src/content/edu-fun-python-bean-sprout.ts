/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): educational versions
 * of the fun quests Q1–Q20 (the Python pack, quests-python.ts) and Q21–Q30 (the Bean pack,
 * quests-bean.ts).
 *
 * Every scene keeps its story, its jokes and its choice ids, rewritten in short read-aloud
 * lines with one lesson that comes out of the joke. No original film or show quotes appear
 * anywhere (the Learning Grove rule): each approved quote is replaced by a new line.
 * Violence stays cartoonish and bloodless: Sir Dentwhistle's armour is cardboard and falls
 * off piece by piece, the dock dancers use squeaky rubber fish, and everyone who falls in
 * the water is fine. See EDU-STYLE.md.
 */
import type { EduDomain, EduQuest, EduScene, Lesson, LessonOption } from './types';
import type { Line, Choice } from '../config/story';

type Mood = NonNullable<Line['mood']>;
const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- helpers

interface Meta {
  domain: EduDomain;
  skill: string;
  standard?: string;
  parentNote: string;
}
type LessonIn = Omit<Lesson, 'id'>;

/** Lesson metadata: domain, plain skill, grown-up note, and an approved standard if one fits. */
const m = (domain: EduDomain, skill: string, parentNote: string, standard?: string): Meta =>
  standard ? { domain, skill, standard, parentNote } : { domain, skill, parentNote };

const ask = (after: number, meta: Meta, prompt: Line[], options: LessonOption[]): LessonIn => ({
  ...meta,
  kind: 'ask',
  after,
  prompt,
  options,
});
const notice = (after: number, meta: Meta, lines: Line[]): LessonIn => ({
  ...meta,
  kind: 'notice',
  after,
  lines,
});
const act = (after: number, meta: Meta, check: string, lines: Line[]): LessonIn => ({
  ...meta,
  kind: 'do',
  after,
  check,
  lines,
});
/** The answer the lesson teaches. */
const best = (label: string, ...reply: Line[]): LessonOption => ({ label, best: true, reply });
/** Any other answer: the reply kindly shows the right one. */
const opt = (label: string, ...reply: Line[]): LessonOption => ({ label, reply });

const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice =>
  set ? { id, label, set, then } : { id, label, then };

const scene = (
  of: string,
  lines: Line[],
  lessons: LessonIn[],
  choices?: Choice[],
  defaultChoice?: string,
): EduScene => {
  const s: EduScene = {
    id: `sprout:${of}`,
    of,
    band: 'sprout',
    lines,
    lessons: lessons.map((l, i) => ({ id: `sprout:${of}-l${i + 1}`, ...l })),
  };
  if (choices) s.choices = choices;
  if (defaultChoice) s.defaultChoice = defaultChoice;
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

// ---------------------------------------------------------------- speakers

const N = say('narrator');
const Y = say('you');
const SP = say('sparks');
const PX = say('pixel');
const BY = say('byte');

const TH = say('tall-hood');
const HS = say('hooded-three');
const DW = say('sir-dent');
const GO = say('old-gorrel');
const OL = say('warden-ollery');
const GW = say('gullwick');
const RO = say('sir-rollo');
const PA = say('parapet');
const RG = say('reggie');
const FQ = say('frannie');
const MG = say('old-mags');
const MB = say('mother-brindle');
const BT = say('barty');
const GN = say('gourd-nubbin');
const SN = say('shoe-nubbin');
const HT = say('harrow');
const GB = say('gorbold');
const CR = say('mr-crisp');
const FM = say('fenwick');
const ST = say('mr-strutt');
const PO = say('brother-pouffe');
const BO = say('brother-bolster');
const TF = say('sister-tuft');
const DB = say('mr-dibble');
const PI = say('mr-pilchard');
const GR = say('mr-grampus');
const SG = say('sgt-grimble');
const MT = say('mrs-thackery');
const BU = say('bunty');
const PR = say('piers');
const AL = say('algernon');
const AR = say('mr-arbour');

const TW = say('mr-tweed');
const IN = say('mrs-inkwell');
const WP = say('warden-pryce');
const OD = say('odette');
const RF = say('rufus');

// ================================================================ the Python pack (Q1–Q20)

// ------------------------------------------------------------------ Q1
const Q01 = quest(
  'q01',
  'Two Shrubberies',
  {
    'q01-s1': {
      goal: 'Make a shrubbery and give it to the three hoods.',
      hint: 'The Workshop makes one from reeds and wood. Then use Give.',
    },
    'q01-s2': {
      goal: 'Make a second shrubbery, a bit higher, with a tiny path.',
      hint: 'Make another shrubbery and a path. Put them next to the first one.',
    },
  },
  [
    scene(
      'q01-intro',
      [
        N('Splash, splash goes the waterfall.'),
        N('Three Nubbins in brown hoods stand on the path.'),
        N('The middle one looks tall. It is standing on a log!'),
        HS('Boing-a-boing!', 'angry'),
        N('Your Nubbin jumps. A little bird flies away.'),
        Y('Please may we go past?'),
        TH('Not yet. First, we need something green. Something leafy. A… bush!', 'think'),
        N('A shrubbery is a little bush. Green and leafy.'),
        N('The other two nod. One nods a bit late.'),
      ],
      [
        ask(
          7,
          m('literacy', 'first sounds: sh', 'Your child listened for the “sh” sound at the start of words.', 'RF.K.2'),
          [TH('Shrubbery starts with a shh sound. Shh!'), TH('Which word starts with shh too?')],
          [
            best('Shoe', TH('Yes! Shh-oe. Shoe and shrubbery start the same.', 'happy')),
            opt('Bird', TH('Bird starts with a b sound. Shh-oe starts with shh, like shrubbery!')),
            opt('Log', TH('Log starts with l. Listen: shh-oe. Shoe starts with shh!')),
          ],
        ),
      ],
      [
        ch('what-kind', 'What kind of shrubbery?', [TH('A nice one. Green, please.', 'think'), N('Green, like leaves.')]),
        ch(
          'chant-back',
          'Chant back: Boing-a-boing!',
          [N('You shout it back, loud and silly.'), N('The hoods look at each other. One writes it down.')],
          { 'q01-chanted': true },
        ),
        ch('agree', 'One shrubbery, coming up!', [TH('Good. We will wait here. Swaying.', 'happy')]),
      ],
    ),
    scene(
      'q01-first',
      [
        N('You put the shrubbery down. Plop.'),
        N('The hoods look at it. Top, sides, and underneath.'),
        TH('It has leaves. We like the leaves.', 'happy'),
        N('They chant softly. It means thank you.'),
      ],
      [
        notice(
          2,
          m('science', 'what plants need', 'Your child heard that plants need water and light to grow.', 'K-LS1-1'),
          [TH('A shrubbery is alive. It is a plant.'), TH('Give it water and sunshine, and it will grow.')],
        ),
      ],
    ),
    scene(
      'q01-second',
      [
        N('You step towards the path. The tall hood holds up a paw.'),
        TH('Wait. There is a second thing.', 'think'),
        Y('You said one shrubbery!'),
        TH('Now we would like two. Put the new one up higher.'),
        TH('And a tiny path between them. Just right for a beetle.'),
        N('One hood holds its paws a beetle apart.'),
        TH('Also, we have a new name. It goes like this…', 'think'),
        N('Clatter, bang, ting-a-ling! Like spoons falling down the stairs.'),
        Y('I can’t say that!'),
        TH('Nobody can. That is why it is so scary.', 'happy'),
      ],
      [
        ask(
          4,
          m('maths', 'positions: higher and lower', 'Your child practised the position words higher and lower.', 'K.G.A.1'),
          [TH('The new shrubbery goes higher. Is higher up or down?')],
          [
            best('Up!', TH('Yes! Higher means up. Point up with me!', 'happy')),
            opt('Down', TH('Down is lower. Higher means up. Point up, up, up!')),
          ],
        ),
      ],
      [
        ch('fair', 'OK. Higher, with a path.', [TH('Good. Use little stones. We love little stones.')]),
        ch('imaginary', 'Can the path be pretend?', [TH('No. We tried that. Someone fell off it.', 'sad')], {
          'q01-imaginary-path': true,
        }),
      ],
    ),
    scene(
      'q01-terraced',
      [
        N('Two shrubberies. One low, one a little higher.'),
        N('A tiny stone path wiggles between them.'),
        N('A beetle walks along it. It looks very pleased.'),
        TH('Oh. Oh, that is lovely.', 'soft'),
      ],
      [
        act(
          2,
          m('science', 'insects have six legs', 'Your child counted a beetle’s legs and learned insects have six.'),
          'edu:count:beetle-legs:6',
          [
            N('A beetle is an insect. Insects have six legs.'),
            N('(Count its legs together: one, two, three, four, five, six!)'),
          ],
        ),
      ],
    ),
    scene(
      'q01-complete',
      [
        N('The hoods step aside. Then they step back, to look again.'),
        TH('You may pass. Every day, if you like.'),
        Y('Will you stay here?'),
        TH('We have a shrubbery and a path. Of course we stay.', 'happy'),
        TH('We guarded this path for years.', 'think'),
        TH('A shrubbery is a much nicer reason to stand here.', 'soft'),
        N('One hood gets a tiny rake. Scritch, scratch.'),
        N('At dusk they practise their new name. Clatter, ting… oops!'),
      ],
      [
        ask(
          5,
          m('sel', 'naming feelings', 'Your child named the hoods’ feeling from their words and faces.', 'CASEL: Self-awareness'),
          [N('The hoods are smiling at their shrubbery.'), N('How do they feel now?')],
          [
            best('Happy', N('Yes! Happy and proud. They love their garden.')),
            opt('Cross', N('Look at their smiles. They feel happy, not cross.')),
          ],
        ),
      ],
    ),
  ],
  'The chant “Boing-a-boing!” replaces the main game’s chant in every sprout scene.',
);

// ------------------------------------------------------------------ Q2
const Q02 = quest(
  'q02',
  'The Cardboard Knight',
  {
    'q02-s1': {
      goal: 'Win a karate game against Sir Dentwhistle on the plank bridge.',
      hint: 'Choose Karate on the bridge. Any of your Nubbins can play.',
    },
    'q02-s2': {
      goal: 'Win a second karate game.',
      hint: 'If your Nubbin is tired, swap in a fresh one.',
    },
    'q02-s3': {
      goal: 'Win the last karate game.',
      hint: 'If your Nubbin keeps losing, let it rest first.',
    },
  },
  [
    scene(
      'q02-intro',
      [
        N('A plank bridge goes over the stream.'),
        N('In the middle stands a Nubbin in cardboard armour.'),
        N('A cardboard helmet. Two arm guards. Two knee pads.'),
        N('A snail is slowly climbing up its leg.'),
        Y('Hello! May we cross, please?'),
        DW('Nobody crosses my plank. Not one toe!', 'angry'),
        DW('I am Sir Dentwhistle. I have guarded it for three whole days!'),
        N('It holds up its little fists. Time for a karate game!'),
      ],
      [
        act(
          2,
          m('maths', 'count to 5', 'Your child counted five pieces of cardboard armour.', 'K.CC.B.5'),
          'edu:count:armour:5',
          [
            N('(Count the cardboard pieces together.)'),
            N('One helmet. Two arm guards. Two knee pads.'),
            N('One, two, three, four, five. Five pieces!'),
          ],
        ),
      ],
      [
        ch('bow', 'Bow politely, then play.', [DW('Polite! I shall beat you very politely.', 'happy')]),
        ch(
          'go-round',
          'Can’t we go round?',
          [
            N('There are stepping stones just down the stream.'),
            DW('Nobody uses those. They are too low. Down there.', 'think'),
          ],
          { 'q02-asked-round': true },
        ),
      ],
    ),
    scene(
      'q02-round1',
      [
        N('Hi-yah! Your Nubbin does its best move.'),
        N('Plonk! The cardboard helmet falls into the grass.'),
        N('Sir Dentwhistle has very flat hair.'),
        DW('Pfft. I didn’t even feel it.', 'angry'),
        Y('It was your helmet!'),
        DW('A helmet is only a hat. Again!'),
      ],
      [
        notice(
          2,
          m('science', 'snails and their shells', 'Your child learned that a snail carries its shell, which keeps it safe.'),
          [
            N('Look, the snail is still climbing. Slowly, slowly.'),
            N('A snail carries its shell on its back.'),
            N('When it is scared, it hides inside. Safe!'),
          ],
        ),
      ],
    ),
    scene(
      'q02-scarf',
      [
        N('Sir Dentwhistle wraps on a long woolly scarf.'),
        N('Round and round and round. Three times!'),
        DW('My mum knitted this. Nothing gets past the scarf.'),
        DW('She meant the cold. But still.', 'think'),
        Y('Has anyone tried?'),
        DW('That is not the point.', 'think'),
        N('The snail reaches its shoulder. What a view!'),
      ],
      [
        ask(
          3,
          m('health', 'dressing for the weather', 'Your child talked about how a scarf keeps us warm in cold weather.'),
          [N('What is a woolly scarf for?')],
          [
            best('Keeping warm', DW('Yes! Wool keeps your neck cosy when it is cold.', 'happy')),
            opt('Eating', DW('Ha! Not for eating. A scarf keeps you warm in cold weather.')),
          ],
        ),
      ],
    ),
    scene(
      'q02-round2',
      [
        N('Hi-yah! Your Nubbin spins.'),
        N('The scarf unwinds and floats off down the stream.'),
        N('Clatter, clatter! Off fall both cardboard arm guards.'),
        DW('Barely bothered. I was too warm anyway.', 'angry'),
        N('Its little round glasses steam up. It is cross!'),
      ],
      [
        ask(
          2,
          m('maths', 'take away 2', 'Your child took two away from four to find how many pieces were left.', 'K.OA.A.1'),
          [
            N('Sir Dentwhistle had four pieces left. Two just fell off.'),
            N('(Hold up four fingers. Fold two down.)'),
            N('How many pieces are left?'),
          ],
          [
            best('Two', N('Yes! Two knee pads left. Four take away two is two.')),
            opt('Three', N('Let’s count what’s left: knee pad, knee pad. One, two. Two!')),
            opt('None', N('Not yet! The two knee pads are still on. Two left.')),
          ],
        ),
      ],
    ),
    scene(
      'q02-glasses',
      [
        N('Sir Dentwhistle wipes its glasses on its tummy.'),
        DW('Last round. I still have my glasses and knee pads.'),
        DW('If I can’t see you, you can’t see me.', 'think'),
        Y('That’s not how seeing works!'),
        DW('It is on my bridge.'),
        N('Your Nubbin wants to win, then have a snack.'),
      ],
      [
        notice(
          3,
          m('science', 'how we see', 'Your child heard that we see with our eyes, and that glasses help some eyes.'),
          [
            N('We see with our eyes.'),
            N('Glasses help some people’s eyes see clearly.'),
            N('If you close your eyes, other people can still see you!'),
          ],
        ),
      ],
      [
        ch('gentle', 'Ask your Nubbin to be gentle.', [N('Your Nubbin nods. It will be kind.')], { 'q02-gentle': true }),
        ch('full', 'Do your very best karate!', [N('Your Nubbin cracks its knuckles. It has no knuckles!')]),
      ],
    ),
    scene(
      'q02-round3',
      [
        N('Hi-yah! Clonk, clonk! Off fall both knee pads.'),
        N('The glasses fly off too. The snail goes round them.'),
        DW('I am fine! Never better! Which one of you said that?', 'shock'),
        N('It is talking to a fence post.'),
        DW('Come back! I’m not done being brave!', 'angry'),
        N('The fence post does not move. Not one bit.'),
      ],
      [
        ask(
          1,
          m('maths', 'zero', 'Your child found that when every piece is gone, there are zero left.', 'K.OA.A.1'),
          [N('Both knee pads fell off. How many cardboard pieces are left?')],
          [
            best('None! Zero!', N('Yes! Zero. All gone. Just a little Nubbin in a vest.')),
            opt('Two', N('Look: the knee pads are on the grass. None left on. Zero!')),
          ],
        ),
      ],
    ),
    scene(
      'q02-complete',
      [
        N('Sir Dentwhistle sits down on the plank. Flump.'),
        DW('You may cross. Not because you won. I just want a sit.', 'think'),
        N('You pick up the cardboard helmet and hold it out.'),
        DW('Keep it. I have lots more. At home. In a box.', 'sad'),
        N('It does not have lots more. It keeps looking at the helmet.'),
        DW('Remember: losing is fine if you don’t mind. I never mind!', 'happy'),
        N('Its ears go pink. It minds a little bit.'),
        N('You cross the plank in two big steps.'),
        N('Now your Nubbins lose karate games with a smile.'),
      ],
      [
        ask(
          5,
          m('sel', 'losing well', 'Your child talked about what to do when we lose a game.', 'CASEL: Self-management'),
          [N('Sir Dentwhistle lost. What can we do when we lose a game?')],
          [
            best('Take a breath and say “good game”', N('Yes! That helps everyone feel good.')),
            opt(
              'Stamp and shout',
              N('It’s OK to feel cross when we lose.'),
              N('Then we take a big breath and say “good game”.'),
            ),
          ],
        ),
      ],
      [
        ch(
          'honours-even',
          'Shall we say we both did well?',
          [DW('Yes! I was just going to say that.', 'happy'), N('It shakes your hand. Then the fence post’s.')],
          { 'q02-verdict': 'even' },
        ),
        ch(
          'tell-plainly',
          'You lost three times, you know.',
          [
            N('Sir Dentwhistle is quiet. The snail is quiet too.'),
            DW('…I know. I was there.', 'sad'),
            DW('Thank you for telling the truth. That helps.', 'soft'),
          ],
          { 'q02-verdict': 'lost' },
        ),
      ],
    ),
  ],
  'Sprout art: Sir Dentwhistle wears cardboard armour (helmet, two arm guards, two knee pads) over its scarf and glasses. ' +
    'Round 1 knocks off the helmet; round 2 the scarf and both arm guards; round 3 the glasses and both knee pads. ' +
    'Each piece clatters off like a cardboard box, never anything more.',
);

// ------------------------------------------------------------------ Q3
const Q03 = quest(
  'q03',
  'The Bridge of Three Questions',
  {
    'q03-s1': {
      goal: 'Count all the Nubbins in your Grove, then go back to the bridge.',
      hint: 'Tap each Nubbin once. Look in the pond too!',
    },
    'q03-s2': {
      goal: 'Find out how fast a Fly Nubbin can carry a coconut.',
      hint: 'Get a coconut from the palm tree by the sea. Time a Fly Nubbin.',
    },
  },
  [
    scene(
      'q03-intro',
      [
        N('By a rope bridge sits a very old Keeper.'),
        N('His hood has moss on it. Maybe he does too!'),
        GO('Stop! Answer three questions to cross my bridge.', 'think'),
        GO('Get one wrong, and… splash! Into the stream.'),
        N('You look down. The water is shallow, full of happy ducks.'),
        GO('Question one. How many Nubbins live in your Grove?'),
        Y('Um. Let me check.'),
        GO('Go and count. I am very good at waiting.', 'happy'),
      ],
      [
        ask(
          4,
          m('science', 'animal sounds', 'Your child matched the duck to its sound.', 'ELOF: Scientific Reasoning'),
          [N('Listen to the ducks! What sound does a duck make?')],
          [
            best('Quack!', N('Yes! Quack, quack! (Quack together.)')),
            opt('Moo', N('Moo is a cow! A duck says quack, quack.')),
            opt('Baa', N('Baa is a sheep! A duck says quack, quack.')),
          ],
        ),
      ],
      [
        ch('guess', 'Make a big guess.', [GO('Hmm. Probably wrong. Go and count.', 'angry')], { 'q03-guessed': true }),
        ch('count', 'Go and count properly.', [GO('Wise. The last guesser is still in the stream. He likes it.')]),
      ],
    ),
    scene(
      'q03-count',
      [
        N('You come back with the number.'),
        N('Old Gorrel checks it on his sleeve.'),
        GO('Right. Bother.', 'think'),
        GO('Question two. What did your newest Nubbin eat for breakfast?'),
        Y('Half a run fruit. The other half fell in the pond.'),
        GO('Right. And very sad.', 'sad'),
      ],
      [
        act(
          3,
          m('literacy', 'clapping syllables', 'Your child clapped the two beats in “breakfast”.', 'RF.K.2'),
          'edu:clap:syllables:breakfast',
          [N('Let’s clap “breakfast”. Break-fast.'), N('(Clap twice together: break… fast!)'), N('Two claps!')],
        ),
      ],
    ),
    scene(
      'q03-third',
      [
        GO('Question three.', 'think'),
        N('He leans in. The ducks go quiet.'),
        GO('How fast can a Fly Nubbin fly, carrying a coconut?'),
        Y('I don’t know!'),
        GO('Nor do I. Nobody has ever answered.', 'think'),
        GO('Go and find out. I shall wait.'),
        N('He sits back, very pleased with himself.'),
      ],
      [
        ask(
          2,
          m('maths', 'heavy and light', 'Your child compared heavy and light things.', 'K.MD.A.2'),
          [N('Is a coconut heavy or light?')],
          [
            best('Heavy', N('Yes! A coconut is big and heavy. Heavy things are hard to carry.')),
            opt('Light', N('A feather is light. A coconut is heavy, with a hard shell.')),
          ],
        ),
      ],
    ),
    scene(
      'q03-timed',
      [
        N('You time two Fly Nubbins.'),
        N('The first one zooms across the pond. Whoosh!'),
        N('The second flies halfway, sits on the coconut, and has a think.'),
        N('So the answer is: it depends on the Nubbin!'),
      ],
      [
        ask(
          2,
          m('literacy', 'opposites: fast and slow', 'Your child used the opposite words fast and slow.'),
          [N('One Nubbin zoomed. One sat down. Which one was fast?')],
          [
            best('The zoomy one', N('Yes! Fast. The sitting one was slow. Fast and slow are opposites.')),
            opt('The sitting one', N('The sitting one stopped! The zoomy one was fast. The sitter was slow.')),
          ],
        ),
      ],
    ),
    scene(
      'q03-complete',
      [
        GO('Well? How fast?', 'happy'),
        Y('Which Fly Nubbin? The zoomy one, or the sitting one?'),
        N('Old Gorrel opens his mouth. Then he shuts it.'),
        GO('I don’t know! Nobody ever asked me a question back!', 'shock'),
        N('He steps back… and plops into the stream. Splash!'),
        N('Quack, quack, quack! say the ducks.'),
        GO('I’m fine! It’s lovely in here! The bridge is yours!', 'happy'),
        GO('Being asked a question is rather nice.', 'soft'),
        N('He floats away, waving. His hood lands on the post.'),
      ],
      [
        notice(
          3,
          m('sel', 'it is OK not to know', 'Your child heard that nobody knows everything, and we can ask and find out.', 'CASEL: Self-awareness'),
          [
            GO('I don’t know the answer. And that is all right!'),
            N('Nobody knows everything. We can say “I don’t know”.'),
            N('Then we ask, or we find out together.'),
          ],
        ),
      ],
    ),
  ],
);

// ------------------------------------------------------------------ Q4
const Q04 = quest(
  'q04',
  'Clip-Clop',
  {
    'q04-s1': {
      goal: 'Find out where the coconut shells came from.',
      hint: 'Follow the path to the palm tree by the sea.',
    },
    'q04-s2': {
      goal: 'Decide what happens to the coconut shells.',
      hint: 'Go back to the lookout wall and talk to the Run Nubbin.',
    },
  },
  [
    scene(
      'q04-intro',
      [
        N('Clop. Clop-clop. Clop.'),
        N('A Run Nubbin trots behind you, banging two coconut shells.'),
        N('You stop. It stops. You walk. It clops!'),
        N('Warden Ollery leans over the lookout wall.'),
        OL('Coconut shells? Up here? How odd!'),
        OL('Coconuts grow on palm trees, by the sea.', 'think'),
        OL('There is only one palm tree here. Far away, on the beach.'),
        OL('So how did they get up the hill?'),
        N('The Run Nubbin clops twice. Clop, clop!'),
      ],
      [
        act(
          2,
          m('music', 'copying a rhythm', 'Your child clapped back a simple clip-clop rhythm.'),
          'edu:clap:rhythm:clop-clopclop-clop',
          [N('(Clap the clops together.)'), N('Clop. Clop-clop. Clop. Your turn!')],
        ),
      ],
      [
        ch('ask-nubbin', 'Ask the Run Nubbin.', [N('It clops. Then it points its whole body at the sea.')]),
        ch('shrug', 'Does it matter?', [OL('Everything matters up here. There’s not much else to look at.', 'sad')], {
          'q04-shrugged': true,
        }),
      ],
    ),
    scene(
      'q04-gullwick',
      [
        N('Under the palm tree lies a Fly Nubbin called Gullwick.'),
        N('Its wings are very big, and very tired.'),
        GW('Carried it. All the way. Uphill. Puff, puff.', 'sad'),
        GW('Dropped it on a rock. Crack! Two halves.'),
        GW('Run Nubbin found them. Very happy. I am very tired.'),
        N('Gullwick lies flat in the sand. Flump.'),
      ],
      [
        ask(
          5,
          m('sel', 'saying thank you', 'Your child thought about thanking someone who worked hard.', 'CASEL: Relationship skills'),
          [N('Gullwick worked very hard. What could we say?')],
          [
            best('Thank you!', GW('Oh. Nice. Very tired. Still nice.', 'soft')),
            opt('Hurry up!', N('Gullwick is tired. A “thank you” would help it feel better.')),
          ],
        ),
      ],
      [
        ch(
          'thank',
          'Say a big thank you to Gullwick.',
          [N('Gullwick lifts one wing, just a little.'), GW('Nobody said that before. Nice.')],
          { 'q04-thanked-gullwick': true },
        ),
        ch('why', 'Why carry it so far?', [GW('It looked like it wanted to go up.'), N('Maybe that explains everything.')]),
      ],
    ),
    scene(
      'q04-return',
      [
        N('Back to the wall you go. Clop, clop. Right behind you.'),
        Y('A Fly Nubbin carried a coconut up from the beach!'),
        OL('All that way? With those little wings?', 'shock'),
        OL('Maybe the shells should go back to the beach.'),
        N('The Run Nubbin hugs the shells tight.'),
        N('This is the sound it was born to make!'),
      ],
      [
        notice(
          4,
          m('science', 'banging makes sound', 'Your child heard that hitting two hard things makes them shake, and that makes sound.', '1-PS4-1'),
          [
            N('Clop! When two hard shells bang, they shake a tiny bit.'),
            N('That shaking makes the sound.'),
            N('Horses’ feet go clip-clop on a hard road, too.'),
          ],
        ),
      ],
      [
        ch('keep', 'They’re yours. Keep them!', [N('The Run Nubbin trots in a happy circle. Clop-clop-clop!')], {
          'q04-kept': true,
        }),
        ch('share', 'Keep them, but share turns.', [N('It agrees. As long as its turn is first. And last.')], {
          'q04-shared': true,
        }),
      ],
    ),
    scene(
      'q04-decided',
      [
        N('The Run Nubbin tucks the shells under its arm.'),
        N('It gives you a long, happy look.'),
        OL('That’s settled, then. Clop away, little one!', 'happy'),
        N('Clop. Clop-clop. Off it goes.'),
      ],
      [
        ask(
          3,
          m('literacy', 'first sounds: c', 'Your child listened for the hard “c” sound at the start of words.', 'RF.K.2'),
          [N('Clop and coconut start with the same sound. C-c-c!'), N('Which word starts with c too?')],
          [
            best('Cat', N('Yes! C-c-cat. Clop, coconut, cat!')),
            opt('Sun', N('Sun starts with sss. Listen: c-c-cat. Cat starts like clop!')),
          ],
        ),
      ],
    ),
    scene(
      'q04-complete',
      [
        N('The Run Nubbin is called Trotwell. It clops all round the Grove.'),
        N('Soon every Nubbin wants a go!'),
        OL('I like the noise. It keeps me company.', 'soft'),
        N('Trotwell teaches you to trot. Lots of knees!'),
        N('Now, when you run, you can sound like a horse!'),
        N('Far away, Gullwick sleeps on the warm sand.'),
        N('Beside it: a fruit and a note. “Thank you. From the wall.”'),
      ],
      [
        act(
          3,
          m('health', 'trotting on the spot', 'Your child trotted on the spot with high knees.', 'ELOF: Perceptual, Motor, and Physical Development'),
          'edu:trot:knees-up:5',
          [N('(Stand up and trot on the spot!)'), N('Knees up! Clop, clop, clop, clop, clop!')],
        ),
      ],
    ),
  ],
);

// ------------------------------------------------------------------ Q5
const Q05 = quest(
  'q05',
  'The Rabbit on the Ledge',
  {
    'q05-s1': {
      goal: 'Ask Sparks to make something to win the rabbit’s friendship.',
      hint: 'Sparks is in the Workshop. Bring one sun fruit.',
    },
    'q05-s2': {
      goal: 'Take the Hand Melon to the ledge. Count to three, then toss it gently.',
      hint: 'Tap Count on each beat: one, two, three. Then throw.',
    },
  },
  [
    scene(
      'q05-intro',
      [
        N('High on the ledge, Nubbins crowd round something small and white.'),
        N('It is a rabbit! Fluffy, and the size of a slipper.'),
        N('It munches clover. Munch, munch.'),
        RO('Stand back! My Nubbins practised karate all week!', 'happy'),
        N('That is Sir Rollo, with a cape and a cardboard crown.'),
        N('His Nubbin steps up. Whoosh! Boing! Into a soft bush.'),
        N('The next one. Whoosh! Boing! Same bush. It giggles.'),
        RO('Everybody, back away! Quick!', 'shock'),
        N('Everyone hurries ten steps. The rabbit just eats its clover.'),
      ],
      [
        ask(
          2,
          m('science', 'what animals eat', 'Your child learned that rabbits eat plants like grass and clover.', 'K-LS1-1'),
          [N('What does the rabbit like to eat?')],
          [
            best('Clover and grass', N('Yes! Rabbits eat plants. Grass, clover and leaves.')),
            opt('Biscuits', N('Ha! Rabbits eat plants. Grass, clover, leaves. Munch, munch.')),
          ],
        ),
      ],
      [
        ch(
          'try',
          'Let your Nubbin try.',
          [N('Your Nubbin steps up. Whoosh! Boing! Into the bush.'), N('It climbs out with a leaf on its head, giggling.')],
          { 'q05-tried': true },
        ),
        ch('watch', 'Watch the rabbit for a while.', [
          N('You notice something. The rabbit never starts a fight.'),
          N('It just wants to eat its clover in peace.'),
        ]),
      ],
    ),
    scene(
      'q05-sparks',
      [
        SP('A rabbit beat ALL of them? Oh, I love that rabbit!', 'happy'),
        SP('Leave it with me. One sun fruit, a ribbon, a little fizz.'),
        N('Crackle! Flash! A smell of toasty fruit.'),
        SP('Ta-da! Nearly ready.'),
      ],
      [
        ask(
          0,
          m('literacy', 'first letter of a name: S', 'Your child heard that Sparks starts with S and found another “sss” word.', 'RF.K.2'),
          [SP('My name starts with S. Sss, like a snake!'), SP('What else starts with sss?')],
          [
            best('Sun', SP('Yes! Sss-un. Sun fruit and Sparks!', 'happy')),
            opt('Rabbit', SP('Rabbit starts with rrr. Sss-un starts with sss, like me!')),
          ],
        ),
      ],
    ),
    scene(
      'q05-melon',
      [
        SP('Here it is! The Hand Melon!', 'happy'),
        N('It is a sun fruit with a ribbon and a paper tag. It hums.'),
        Y('It’s not a melon.'),
        SP('Melon sounds braver. Read the tag!'),
        N('The tag says: Count to three. Then toss it, gently.'),
        SP('Not two. Not four. Three! Near the rabbit, not at it.'),
        SP('It pops like a party. Nobody gets hurt.'),
      ],
      [
        act(
          5,
          m('maths', 'count to 3', 'Your child counted exactly three beats, one finger for each.', 'K.CC.B.4'),
          'edu:count:beats:3',
          [SP('Let’s practise. Count with me!'), N('(Hold up one finger for each number.)'), N('One… two… three! Toss!')],
        ),
      ],
      [
        ch('practise', 'Practise counting first.', [Y('One. Two. Three.'), SP('Perfect! Just like that.')], {
          'q05-practised': true,
        }),
        ch('four', 'What if I count to four?', [SP('Then it just sits there. Four is too many!')]),
        ch(
          'rollo',
          'Let Sir Rollo count.',
          [RO('One… two… lots!'), SP('THREE, Rollo!'), N('Fizzle. Sparks makes another one.')],
          { 'q05-rollo-counted': true },
        ),
      ],
    ),
    scene(
      'q05-pop',
      [
        N('One. Two. Three. You toss the Hand Melon, gently.'),
        N('Pop! Out bursts fruit confetti in every colour.'),
        N('Red, yellow, green and blue bits drift down like snow.'),
        N('The rabbit sits up. Its ears stand tall.'),
      ],
      [
        act(
          2,
          m('art', 'naming colours', 'Your child found and named colours in the confetti.'),
          'edu:tap:colour:red',
          [N('(Find the red bits. Point to them!)'), N('Now find yellow. Now green. Now blue!')],
        ),
      ],
    ),
    scene(
      'q05-complete',
      [
        N('The rabbit hops through the confetti, munching.'),
        N('It stops at your feet and looks up at you.'),
        RO('I had a whole plan. It had lots of shouting.', 'think'),
        RO('But the rabbit only wanted its clover. We kept bothering it.', 'soft'),
        SP('I made you a spare Hand Melon. No fizz. Just pretty.', 'happy'),
        N('The rabbit follows you home. You call it Snowdrop.'),
        N('It says yes by sitting on your foot.'),
      ],
      [
        notice(
          3,
          m('sel', 'giving animals space', 'Your child heard that animals need peace and space, and we let them come to us.', 'CASEL: Social awareness'),
          [N('Animals need space and quiet, just like us.'), N('We watch gently, and let them come to us.')],
        ),
      ],
    ),
  ],
);

// ------------------------------------------------------------------ Q6
const Q06 = quest(
  'q06',
  'The Wooden Rabbit',
  {
    'q06-s1': {
      goal: 'Build a giant wooden rabbit at the Workshop.',
      hint: 'You need lots of wood and some wheels. Try the logs by the woods.',
    },
    'q06-s2': {
      goal: 'Push the wooden rabbit to the stranger’s wall.',
      hint: 'Push from behind. Go round the stream; it doesn’t float.',
    },
  },
  [
    scene(
      'q06-intro',
      [
        N('Far away stands an old wall with a little tower.'),
        N('On top is a man with a huge curly moustache.'),
        PA('Hello down there! I do not like your hat!', 'happy'),
        Y('I’m not wearing a hat.'),
        PA('I do not like that either!'),
        N('Splat! A squishy fruit lands on your head.'),
        PA('And your Nubbin looks like a sock with a secret!'),
        N('Your Nubbin looks sad. You tell it it looks lovely.'),
      ],
      [
        ask(
          7,
          m('sel', 'when someone is unkind', 'Your child thought about what to do when someone is unkind: a calm “stop” and a grown-up.', 'CASEL: Responsible decision-making'),
          [N('The man is being unkind. What can we do?')],
          [
            best('Say “Please stop” and tell a grown-up', N('Yes. A strong, calm voice. And a grown-up to help.')),
            opt(
              'Throw fruit back',
              N('That would make more mess and more cross feelings.'),
              N('We can say “Please stop” in a big, calm voice.'),
            ),
          ],
        ),
      ],
      [
        ch(
          'shout',
          'Shout up: Please stop!',
          [Y('Please stop! That’s not kind!'), PA('Not kind? Hmm. Nobody ever told me.', 'shock')],
          { 'q06-shouted': true },
        ),
        ch('dignity', 'Wipe off the fruit, calmly.', [N('You wipe it off, very calmly.'), N('Splat. Another one.')]),
      ],
    ),
    scene(
      'q06-built',
      [
        N('The wooden rabbit is twice as tall as you!'),
        N('It has big flat ears and a worried face.'),
        N('It has four round wheels.'),
        N('There is a little door in its tummy. Nobody knows why.'),
      ],
      [
        ask(
          2,
          m('maths', 'circles', 'Your child named the wheels as circles and heard why round things roll.', 'K.G.A.2'),
          [N('What shape are the wheels?')],
          [
            best('Circles', N('Yes! Wheels are circles. Round things roll.')),
            opt('Squares', N('Squares have corners, so they won’t roll. Wheels are circles!')),
            opt('Triangles', N('Triangles have three pointy corners. Wheels are round circles!')),
          ],
        ),
      ],
    ),
    scene(
      'q06-plan',
      [
        N('The wooden rabbit waits outside the Workshop.'),
        Y('We push it to his wall and leave it at the gate.'),
        N('Your Nubbins nod. They know it is a plan.'),
        N('They don’t know what the plan is.'),
        N('Neither do you!'),
        Y('He’ll take it in… and then… something happens.', 'think'),
        N('It has wheels. That is a sort of plan.'),
      ],
      [
        ask(
          1,
          m('science', 'pushing moves things', 'Your child worked out that pushing from behind moves the cart forwards.'),
          [N('We stand behind the rabbit. To make it go forwards, we…')],
          [
            best('Push!', N('Yes! Push from behind. Heave… roll! Heave… roll!')),
            opt('Pull', N('Pulling from behind brings it back to us! We push from behind.')),
          ],
        ),
      ],
    ),
    scene(
      'q06-gate',
      [
        N('You leave the rabbit at the gate. You hide behind a bush.'),
        N('Creak! The man drags the rabbit inside.'),
        N('Behind the bush, everyone looks at everyone.'),
        N('Oh no. Nobody is hiding inside the rabbit. Oops!'),
        N('Your Nubbin climbs into your pocket instead. Too late.'),
        Y('Wait… was somebody meant to be inside it?', 'think'),
        N('Your Nubbins look at their feet.'),
        N('One looks at a different bush.'),
      ],
      [
        ask(
          0,
          m('maths', 'position: behind', 'Your child used the position word “behind”.', 'K.G.A.1'),
          [N('Where are you hiding?')],
          [
            best('Behind the bush', N('Yes! Behind the bush, where he can’t see us.')),
            opt('On top of the bush', N('On top, he would see us! We are behind the bush.')),
          ],
        ),
      ],
      [
        ch(
          'laugh',
          'Start laughing.',
          [N('You laugh. Your Nubbins laugh.'), N('Behind the wall, the man laughs too.')],
          { 'q06-laughed': true },
        ),
        ch('knock', 'Knock and ask for it back.', [PA('What rabbit? I am just a man with a wall.')], {
          'q06-knocked': true,
        }),
      ],
    ),
    scene(
      'q06-complete',
      [
        N('Next morning, the rabbit is back! A note hangs on its ear.'),
        N('“Too big for my yard. Nobody inside. Nine out of ten for ears.”'),
        N('Then, very small: “Nobody ever visits my wall. Please come again.”'),
        N('Maybe he was lonely all along.'),
        N('The little tummy door swings open.'),
        N('You and your Nubbin squeeze in and peek out. Perfect for photos!'),
      ],
      [
        ask(
          3,
          m('sel', 'understanding others’ feelings', 'Your child thought about how the man on the wall might have felt.', 'CASEL: Social awareness'),
          [N('Nobody visits his wall. How do you think he felt?')],
          [
            best('Lonely', N('Yes. Sometimes lonely people act grumpy. A friendly visit can help.')),
            opt('Very busy', N('He says nobody visits. I think he felt lonely.')),
          ],
        ),
      ],
    ),
  ],
  'Sprout: the man on the wall calls out silly, not hurtful, names. The “shout” choice keeps its id and flag but becomes a calm “Please stop!”.',
);

// ------------------------------------------------------------------ Q7
const Q07 = quest(
  'q07',
  'The Little Castle',
  {
    'q07-s1': {
      goal: 'Find 12 stones for the castle towers.',
      hint: 'Look in the riverbed and under the cliffs. Tap a sparkly rock.',
    },
    'q07-s2': {
      goal: 'Build the castle towers with Pixel.',
      hint: 'Put stones on the glowing spots. Six on each tower.',
    },
  },
  [
    scene(
      'q07-intro',
      [
        N('On the little hill, Pixel kneels by a castle.'),
        N('It is as tall as your knee.'),
        N('It has a lolly-stick drawbridge and two short towers.'),
        PX('Look, everyone! The Grand Palace of the Hill!', 'happy'),
        N('Byte walks past with a cup of tea.'),
        BY('Hmm. It’s smaller than a sheep.'),
        PX('SHH!', 'angry'),
        PX('It needs stone towers. Will you help?'),
        BY('I am drinking my tea.', 'think'),
        N('There is a tea stain on the drawbridge. Byte hides his cup.'),
      ],
      [
        ask(
          5,
          m('maths', 'big and small', 'Your child compared the size of a model castle and a real one.', 'K.MD.A.2'),
          [N('Which is bigger: a real castle, or Pixel’s castle?')],
          [
            best('A real castle', N('Yes! Real castles are huge. Pixel’s is small.')),
            opt('Pixel’s castle', N('Pixel’s castle only comes up to your knee. Real castles are much bigger!')),
          ],
        ),
      ],
      [
        ch('help', 'Of course I’ll help!', [PX('Thank you! Byte, write that down. Somebody believes!')]),
        ch('small', 'It is quite small.', [PX('It is SMALL ON PURPOSE!'), BY('It is just small.')], {
          'q07-said-small': true,
        }),
      ],
    ),
    scene(
      'q07-stone',
      [
        N('You bring Pixel an armful of stones.'),
        N('Pixel holds each one up, like treasure.'),
        PX('This one is a tower. This one is a wall.'),
        PX('And this one is just a nice stone. Keep it!', 'happy'),
      ],
      [
        ask(
          1,
          m('science', 'hard and soft materials', 'Your child sorted stone as hard and strong, good for building.', '2-PS1-1'),
          [N('Is stone hard or soft?')],
          [
            best('Hard', N('Yes! Stone is hard and strong. Good for castles.')),
            opt('Soft', N('A pillow is soft. Stone is hard. Knock, knock!')),
          ],
        ),
      ],
    ),
    scene(
      'q07-towers',
      [
        PX('Now the towers. Don’t breathe on them!', 'think'),
        N('You build together. Your Nubbin hands up stones, one by one.'),
        PX('Six stones for this tower. Six for that one.'),
        BY('You moved that one back where it was.'),
        PX('I moved it MORE where it was.'),
        N('Up, up go the towers. Past your knee!'),
      ],
      [
        act(
          2,
          m('maths', 'count to 6', 'Your child counted six stones onto one tower.', 'K.CC.B.5'),
          'edu:count:stones:6',
          [N('(Count the stones on one tower together.)'), N('One, two, three, four, five, six!'), PX('Six! And six more for the other one.', 'happy')],
        ),
      ],
    ),
    scene(
      'q07-finished',
      [
        N('The last stone goes on. Two tall towers!'),
        N('A flag made from a sweet wrapper flaps on top.'),
        PX('Grove! The Grand Palace is FINISHED!', 'happy'),
        N('The hills call back: “…ished!”'),
        N('Pixel thinks that is clapping.'),
      ],
      [
        notice(
          3,
          m('science', 'echoes', 'Your child heard that an echo is a sound bouncing back off hills or walls.'),
          [N('That is an echo.'), N('Pixel’s voice bounced off the hills and came back.'), N('(Try it: say “hello” and listen!)')],
        ),
      ],
    ),
    scene(
      'q07-complete',
      [
        N('That evening, three Nubbins come up the hill.'),
        N('One puts a leaf on its head, like a crown.'),
        N('One stands on the drawbridge and points. Ta-da!'),
        N('One lies down and plays a dragon. Or a cloud.'),
        PX('They’re putting on a play. In my castle!', 'soft'),
        BY('Still quite sm…', 'think'),
        N('Byte stops. He watches the little crown take a bow.'),
        BY('It’s a very good castle.', 'soft'),
        BY('I tested the drawbridge. Twice.'),
      ],
      [
        ask(
          8,
          m('sel', 'kind words', 'Your child picked the kinder of two things to say about a friend’s work.', 'CASEL: Relationship skills'),
          [N('Byte changed his words. Which words are kinder?')],
          [
            best('“It’s a very good castle.”', PX('Thank you, Byte!', 'happy'), N('Kind words make friends feel proud.')),
            opt('“It’s quite small.”', N('That might make Pixel sad. “It’s a very good castle” is kinder.')),
          ],
        ),
      ],
    ),
  ],
);

// ------------------------------------------------------------------ Q8
const Q08 = quest(
  'q08',
  'The Water Bridge',
  {
    'q08-s1': {
      goal: 'Build a water bridge from the falls to your crops.',
      hint: 'Make water-bridge pieces at the Workshop. Lay them from the falls to the crops.',
    },
    'q08-s2': {
      goal: 'Pick a crop and take it to the meeting.',
      hint: 'Ripe crops glow. Pick one and give it to Reggie.',
    },
  },
  [
    scene(
      'q08-intro',
      [
        N('In the Keepers’ Hall, there is a meeting.'),
        N('Three Keepers. Four chairs. Lots of paper.'),
        RG('Order! First thing: all this building!', 'angry'),
        FQ('Fences. Paths. Something with a drawbridge.'),
        MG('My cousin tripped on a fence post. A new one!'),
        RG('What good has any of it done us?', 'angry'),
        FQ('Reggie, dear. You are sitting on the Keeper’s bench.'),
        N('Frannie is Reggie’s wife. She has heard this speech before.'),
        RG('If you must build, build something useful!'),
        RG('The crops are thirsty. My back hurts from carrying buckets.'),
      ],
      [
        ask(
          8,
          m('science', 'what plants need', 'Your child named water and sunlight as things plants need.', 'K-LS1-1'),
          [N('The crops are thirsty. What do plants need to grow?')],
          [
            best('Water and sunlight', N('Yes! Plants need water and sunlight to grow.')),
            opt('Socks', N('Ha! No socks. Plants need water and sunlight.')),
          ],
        ),
      ],
      [
        ch('aqueduct', 'I’ll build a water bridge!', [
          RG('A what?'),
          Y('A bridge that carries water.'),
          RG('Hmph. More building.'),
        ]),
        ch('minutes', 'Can I read your meeting notes?', [N('The notes say: “Met. Grumbled. Biscuits.”')], {
          'q08-read-minutes': true,
        }),
      ],
    ),
    scene(
      'q08-water',
      [
        N('Click! The last piece goes in.'),
        N('Water slides down from the falls. Whoosh!'),
        N('Splish, splash, into the crop beds.'),
        N('The crops droop… then perk up. Ahh!'),
        N('Your Nubbins jump in the spray.'),
        N('Reggie comes to say it is a waste. SPLASH!'),
        N('Reggie says nothing. A frog sits on his hat.'),
      ],
      [
        notice(
          1,
          m('science', 'water flows downhill', 'Your child heard that water always flows from high places down to low ones.'),
          [N('Water flows downhill.'), N('The falls are high. The crops are low.'), N('So down it goes! Whoosh!')],
        ),
      ],
    ),
    scene(
      'q08-invite',
      [
        N('A note arrives, folded very small.'),
        N('“Meeting! Bring a crop to look at. From Reggie.”'),
        N('Under it: “Bring biscuits too. Frannie.”'),
        N('Another note: “Ignore that. MY meeting is the real one. Mags.”'),
        N('By lunch there are three meetings!'),
        N('The crop beds by the water are plump and shiny.'),
      ],
      [
        act(
          1,
          m('literacy', 'first letters of names', 'Your child found the first letter of Reggie’s name.', 'ELOF: Literacy'),
          'edu:tap:letter:r',
          [N('Reggie starts with the letter R. Rrr!'), N('(Draw an R in the air with your finger.)')],
        ),
      ],
    ),
    scene(
      'q08-delivered',
      [
        N('Reggie takes the crop. He turns it over.'),
        N('He sniffs it. He holds it up to the light.'),
        RG('Hmm. It’s very good.', 'angry'),
        RG('I don’t like how good it is.'),
      ],
      [
        notice(
          3,
          m('sel', 'saying “you were right”', 'Your child heard that admitting someone else was right can be hard, and is a good thing to do.', 'CASEL: Self-awareness'),
          [N('It can be hard to say “that’s good” when you were grumpy.'), N('Reggie said it anyway. Well done, Reggie!')],
        ),
      ],
    ),
    scene(
      'q08-complete',
      [
        RG('Fine. The water bridge. What has it done for us?', 'angry'),
        FQ('The Nubbins love the spray.'),
        MG('Frogs moved in. I like frogs.'),
        FQ('It hums at night. Very calming.'),
        MG('My cousin can’t trip on it. It’s up high!'),
        FQ('And Reggie fills his teapot from it every day.'),
        RG('My wife exaggerates. Twice a day, at most.'),
        RG('…All right. Hands up to thank the Keeper.', 'sad'),
        N('Up go the hands. Reggie’s goes up last, slowly.'),
        N('Frannie pulls out the fourth chair. It is for you.'),
        MG('Biscuit?'),
        N('The crops will never be thirsty again.'),
      ],
      [
        notice(
          2,
          m('science', 'frogs and tadpoles', 'Your child heard that baby frogs are tadpoles that grow legs.', '1-LS3-1'),
          [MG('Baby frogs are called tadpoles. They swim with tails.'), MG('Then they grow legs, and hop out!')],
        ),
        act(
          7,
          m('maths', 'count to 3', 'Your child counted the hands raised in the meeting.', 'K.CC.B.5'),
          'edu:count:hands:3',
          [N('(Count the hands together.)'), N('Frannie, Mags, Reggie. One, two, three!')],
        ),
      ],
    ),
  ],
);

// ------------------------------------------------------------------ Q9
const Q09 = quest(
  'q09',
  'The Gourd and the Shoe',
  {
    'q09-s1': {
      goal: 'Go back for your shoe.',
      hint: 'It’s by the ditch on the long path. The crowd will follow you.',
    },
    'q09-s2': {
      goal: 'Help the gourd group and the shoe group stop arguing.',
      hint: 'Wear the gourd and the shoe where both groups can see.',
    },
  },
  [
    scene(
      'q09-intro',
      [
        N('On your evening walk, your bag strap snaps.'),
        N('A little gourd rolls into the ditch. Bump, bump.'),
        N('You reach for it. Your shoe comes off in the mud. Schlurp!'),
        N('You are tired. You leave them both for later.'),
        N('You look back. Nubbins are gathering round them.'),
        N('Now they follow you. Tiptoe, tiptoe.'),
        BT('It is a sign!', 'shock'),
        Y('It’s a gourd. And a shoe.'),
        BT('TWO signs!', 'happy'),
      ],
      [
        ask(
          8,
          m('literacy', 'rhyming words', 'Your child found that “shoe” and “two” rhyme.', 'RF.K.2'),
          [N('Shoe… two! Those words rhyme. They end the same.'), N('Which word rhymes with shoe too?')],
          [
            best('Moo', N('Yes! Shoe, two, moo. They all rhyme!')),
            opt('Gourd', N('Gourd doesn’t end like shoe. Listen: sh-oo, m-oo. Moo rhymes!')),
          ],
        ),
      ],
      [
        ch('stop', 'Please stop following me.', [N('They stop. Then they all take one tiny step.')]),
        ch(
          'faster',
          'Walk faster.',
          [N('They walk faster too.'), N('One holds the gourd up high, like a lantern.')],
          { 'q09-walked-faster': true },
        ),
      ],
    ),
    scene(
      'q09-split',
      [
        N('At the ditch, the crowd has split in two.'),
        N('One group bows to the shoe on a rock.'),
        N('The other group holds up the gourd and hums.'),
        GN('The gourd is round, like the sun. Round is best.'),
        SN('The shoe has laces! Follow the laces!', 'angry'),
        N('A tiny third group sits round a pebble.'),
      ],
      [
        ask(
          2,
          m('maths', 'more and fewer', 'Your child compared two groups and found which had more.', 'K.CC.C.6'),
          [N('Five Nubbins by the shoe. Three by the gourd.'), N('Which group has more?')],
          [
            best('The shoe group', N('Yes! Five is more than three.')),
            opt('The gourd group', N('Let’s count. Shoe: five. Gourd: three. Five is more!')),
          ],
        ),
      ],
    ),
    scene(
      'q09-mother',
      [
        N('A Keeper in a headscarf marches up. It’s Mother Brindle, Barty’s Keeper!'),
        MB('What’s all this? Barty! Is that you at the front?', 'angry'),
        BT('Mum! The signs!', 'happy'),
        GN('Barty saw them first. Barty is very special.'),
        MB('He’s just my cheeky Barty. And it’s past his bedtime!', 'angry'),
        BT('I am a bit cheeky.', 'soft'),
        MB('Keeper, please help. Nobody listens to me.', 'sad'),
      ],
      [
        ask(
          4,
          m('health', 'why we sleep', 'Your child talked about why sleep matters for growing bodies.'),
          [N('Why do we need to go to bed?')],
          [
            best('Sleep helps our bodies rest and grow', MB('That’s right. Sleep is good for everyone.', 'soft')),
            opt('To hide from socks', MB('Ha! No. Sleep helps our bodies rest and grow.')),
          ],
        ),
      ],
      [
        ch(
          'both',
          'Tell them both are signs.',
          [N('Both groups cheer. Then they frown. Then they cheer again.')],
          { 'q09-ruling': 'both' },
        ),
        ch('neither', 'Tell them you just dropped them.', [N('Nobody believes you. Mother Brindle sighs.')], {
          'q09-ruling': 'neither',
        }),
        ch(
          'themselves',
          'Tell them to think for themselves.',
          [
            Y('You don’t have to follow me. You can think for yourselves!'),
            N('Everybody nods at once. Then they wait for you to say what to think.'),
            BT('What should we think first?'),
            N('Mother Brindle puts her face in her hands.'),
          ],
          { 'q09-ruling': 'themselves' },
        ),
      ],
    ),
    scene(
      'q09-hats',
      [
        N('You put the gourd on your head.'),
        N('Then you balance the shoe on top of the gourd.'),
        N('Both groups gasp. Both groups are happy!'),
        BT('Follow the Keeper!', 'happy'),
      ],
      [
        ask(
          1,
          m('maths', 'positions: on top, under', 'Your child described where the shoe is using position words.', 'K.G.A.1'),
          [N('Where is the shoe?')],
          [
            best('On top of the gourd', N('Yes! On top. Wobble, wobble!')),
            opt('Under the gourd', N('Under would be squashed! The shoe is on top of the gourd.')),
          ],
        ),
      ],
    ),
    scene(
      'q09-complete',
      [
        N('The whole crowd follows you in one long, wobbly line.'),
        N('You walk to the pond. They walk to the pond.'),
        N('You turn round. They turn round. Bump!'),
        N('You stop. They stop, sit, and fall asleep in a heap.'),
        N('Barty is on top. Snore.'),
        MB('Thank you, love. Keep the gourd and the shoe.', 'soft'),
        N('Now, if you call “Follow me!”, every Nubbin parades behind you.'),
      ],
      [
        act(
          6,
          m('sel', 'taking turns', 'Your child played follow-the-leader and took turns being the leader.', 'CASEL: Relationship skills'),
          'edu:play:follow-the-leader',
          [N('(Play follow-the-leader together!)'), N('Take turns. First you lead, then your grown-up leads.')],
        ),
      ],
    ),
  ],
);

// ------------------------------------------------------------------ Q10
const Q10 = quest(
  'q10',
  'Haggle',
  {
    'q10-s1': {
      goal: 'Offer Harrow less than he asks for the brass bell.',
      hint: 'Tap the bell and choose Haggle. Start with a small number.',
    },
    'q10-s2': {
      goal: 'Haggle with Harrow for three rounds.',
      hint: 'Each time, offer a number in the middle.',
    },
  },
  [
    scene(
      'q10-intro',
      [
        N('There’s a new stall, full of odds and ends.'),
        N('Behind it sits Harrow, with a pencil behind each ear.'),
        HT('Morning! Everything a Grove could want!', 'happy'),
        N('You spot a little brass bell. Your Nubbin wants it.'),
        Y('How much is the bell?'),
        HT('Twenty Shells.'),
        N('You count out twenty Shells.'),
        HT('Twenty? Just like that? Where’s the fun in that?', 'shock'),
        HT('Haggling is a game. You say a small number. I say a big one.'),
      ],
      [
        act(
          6,
          m('maths', 'count to 20', 'Your child counted all the way to twenty.', 'K.CC.A.1'),
          'edu:count:shells:20',
          [N('(Count to twenty together. Use fingers and toes!)'), N('One, two, three… all the way to twenty!')],
        ),
      ],
      [
        ch('sorry', 'Sorry! How does haggling work?', [HT('You say a number. I say a bigger one. We meet in the middle.')]),
        ch('tag', 'But the tag says twenty.', [HT('The tag is just the start! Nobody listens to the tag.')], {
          'q10-stubborn': true,
        }),
      ],
    ),
    scene(
      'q10-first-offer',
      [
        Y('…Eight Shells?'),
        HT('EIGHT?', 'shock'),
        N('He clutches his heart. He clutches the bell.'),
        HT('Now we’re talking! Lovely! Go on!', 'happy'),
      ],
      [
        notice(
          2,
          m('science', 'how a bell makes sound', 'Your child heard that a bell shakes very fast when it rings, and the shaking makes the sound.', '1-PS4-1'),
          [N('Ting! When a bell rings, it shakes very, very fast.'), N('That shaking makes the sound.'), N('Touch it gently, and you can feel the buzz!')],
        ),
      ],
    ),
    scene(
      'q10-rounds',
      [
        HT('Three rounds. I go down. You go up.', 'think'),
        HT('Not too quick. Not too slow. Just right.'),
        N('Your Nubbin climbs on the counter to watch.'),
        HT('Twenty. Because I like your face.'),
        Y('Ten.'),
        HT('Ten? For a BELL? Eighteen!', 'angry'),
      ],
      [
        ask(
          5,
          m('maths', 'comparing numbers', 'Your child compared ten and eighteen and found which is more.', 'K.CC.C.6'),
          [N('Which is more: ten or eighteen?')],
          [
            best('Eighteen', N('Yes! Eighteen is more than ten.')),
            opt('Ten', N('Let’s count up: ten, eleven, twelve… eighteen! Eighteen is more.')),
          ],
        ),
      ],
      [
        ch(
          'walk',
          'Pretend to walk away.',
          [N('One, two, three steps…'), HT('Sixteen!', 'sad')],
          { 'q10-walked-off': true },
        ),
        ch('admire', 'Say the bell is lovely, then go lower.', [HT('Kind words AND a low number! Clever.')]),
      ],
    ),
    scene(
      'q10-deal',
      [
        HT('Fourteen. My last offer. Oh, my poor bell!', 'sad'),
        Y('Fourteen it is.'),
        N('You shake hands. Harrow’s eyes are a bit wet.'),
        HT('It’s the wind. Just the wind.', 'happy'),
      ],
      [
        ask(
          2,
          m('sel', 'happy tears', 'Your child learned that people sometimes cry when they feel very happy.', 'CASEL: Self-awareness'),
          [N('Harrow is happy, but his eyes are wet.'), N('Can people cry when they are happy?')],
          [
            best('Yes', N('Yes! Some people cry happy tears.')),
            opt('No', N('They can! Happy tears are real. Harrow has some.')),
          ],
        ),
      ],
    ),
    scene(
      'q10-complete',
      [
        N('You give Harrow fourteen Shells. He counts them twice.'),
        HT('That was a proper bit of business!', 'happy'),
        N('He gives you a little gourd too. Free!'),
        N('Your Nubbin rings the bell. Ting-a-ling!'),
        HT('You can haggle at the shop now too. Just a little.', 'think'),
        N('Now the shop lets you haggle, for a bit off.'),
      ],
      [
        act(
          0,
          m('maths', 'counting on', 'Your child counted on from fourteen to twenty to find the Shells saved.', '1.OA.A.1'),
          'edu:count-on:shells:14-20',
          [
            N('The tag said twenty. You paid fourteen.'),
            N('(Count on from fourteen, one finger each: fifteen… twenty!)'),
            N('Six fingers. You saved six Shells!'),
          ],
        ),
      ],
      [
        ch(
          'tip',
          'Give him the six Shells you saved.',
          [HT('Don’t you dare!'), HT('A deal’s a deal. Put it away.'), N('He looks very proud of you.')],
          { 'q10-tipped': true },
        ),
        ch('shake', 'Shake hands again, for luck.', [N('He haggles you down to a shorter handshake. He’s delighted.')]),
      ],
    ),
  ],
);

// ------------------------------------------------------------------ Q11
const Q11 = quest(
  'q11',
  'One Thin Slice',
  {
    'q11-s1': {
      goal: 'Pick fresh mint for Mr Crisp.',
      hint: 'Mint grows by the pond. Pick the top leaves for Mr Crisp.',
    },
    'q11-s2': {
      goal: 'Stay and watch Gorbold with the last thin slice.',
      hint: 'Stay in the bathhouse. Gorbold waits for you if you go.',
    },
  },
  [
    scene(
      'q11-intro',
      [
        N('The bathhouse is warm and steamy.'),
        N('In the pool floats a very round Nubbin. Bob, bob.'),
        N('This is Gorbold. Fruit stones float all around it.'),
        GB('More.', 'happy'),
        N('Mr Crisp appears, with a shiny silver tray.'),
        CR('Gorbold ate all the fruit. And the bowl. And the menu!', 'think'),
        CR('I need fresh mint for one last thing. Could you fetch some?'),
        Y('Gorbold looks very full.'),
        CR('It is a VERY small thing.', 'happy'),
      ],
      [
        ask(
          2,
          m('literacy', 'first sounds: g', 'Your child listened for the “g” sound at the start of Gorbold’s name.', 'RF.K.2'),
          [N('Gorbold starts with a g sound. G-g-g!'), N('Which word starts with g too?')],
          [
            best('Grape', N('Yes! G-g-grape. Gorbold and grape!')),
            opt('Moon', N('Moon starts with mmm. Listen: g-g-grape starts like Gorbold!')),
          ],
        ),
      ],
      [
        ch('fetch', 'I’ll fetch the mint.', [CR('Splendid. The patch by the pond. Top leaves only.')]),
        ch('ask', 'Ask Gorbold if that’s OK.', [GB('More.'), N('That seems to be a yes.')], { 'q11-asked-gorbold': true }),
      ],
    ),
    scene(
      'q11-mint',
      [
        CR('Perfect mint! One moment.', 'happy'),
        N('He vanishes into the steam.'),
        N('Swish, swish. Very careful slicing.'),
        N('The air smells fresh and minty.'),
      ],
      [
        ask(
          3,
          m('science', 'the sense of smell', 'Your child named the nose as the part of the body we smell with.', 'ELOF: Scientific Reasoning'),
          [N('Mmm, minty! What do we smell with?')],
          [
            best('Our nose', N('Yes! Sniff, sniff. Our nose smells the mint.')),
            opt('Our knees', N('Knees can’t smell! We sniff with our nose.')),
          ],
        ),
      ],
    ),
    scene(
      'q11-slice',
      [
        N('Mr Crisp comes back. On his tray: one thin, minty slice.'),
        CR('For you, Gorbold. One tiny slice.', 'soft'),
        GB('Full.', 'sad'),
        CR('It is thinner than a leaf.'),
        N('Gorbold looks at the slice. The slice looks at Gorbold.'),
        N('The steam goes very still.'),
      ],
      [
        notice(
          2,
          m('health', 'listening to your tummy', 'Your child heard that when our tummy feels full, we can stop eating.'),
          [N('Gorbold says “full”. That is his tummy talking.'), N('When our tummy feels full, we can stop eating.')],
        ),
      ],
      [
        ch('nudge', 'Ask: Do you want it, Gorbold?', [GB('…Just one tiny bit.')], { 'q11-nudged': true }),
        ch('step-back', 'Take a big step back.', [N('Mr Crisp steps back too. He has done this before.')], {
          'q11-stepped-back': true,
        }),
      ],
    ),
    scene(
      'q11-pop',
      [
        N('Gorbold eats the slice. Hic!'),
        N('Then… POP!'),
        N('Sparkly confetti fills the bathhouse.'),
        N('Gorbold bobs in the pool, normal-sized, blinking.'),
        GB('Light!', 'happy'),
      ],
      [
        ask(
          3,
          m('maths', 'bigger and smaller', 'Your child compared Gorbold’s size before and after.', 'K.MD.A.2'),
          [N('Is Gorbold bigger or smaller now?')],
          [
            best('Smaller', N('Yes! Before it was very round. Now it is smaller.')),
            opt('Bigger', N('Look again. Pop! It was very round. Now it is smaller.')),
          ],
        ),
      ],
    ),
    scene(
      'q11-complete',
      [
        CR('Ah. That always happens. Lovely.', 'happy'),
        N('He sweeps the confetti into a neat pile.'),
        CR('For you. My own recipe: thin slices.'),
        CR('One slice fills a Nubbin to just full. Never too full.', 'think'),
        GB('More?', 'happy'),
        CR('No.'),
        N('Gorbold pushes one fruit stone over to your Nubbin.'),
        GB('Yours.', 'soft'),
        N('Mr Crisp stops. Gorbold has never shared before!'),
      ],
      [
        ask(
          8,
          m('sel', 'sharing', 'Your child thought about how it feels when someone shares with us.', 'CASEL: Relationship skills'),
          [N('Gorbold shared! How does your Nubbin feel?')],
          [
            best('Happy', N('Yes! Sharing makes friends feel happy. Gorbold feels good too.')),
            opt('Grumpy', N('Look at its smile! Being shared with feels happy.')),
          ],
        ),
      ],
    ),
  ],
  'Sprout: Gorbold chooses the last slice himself (the “nudge” choice becomes asking him). The slice is never pushed on him.',
);

// ------------------------------------------------------------------ Q12
const Q12 = quest(
  'q12',
  'The Very Quiet Nubbin',
  {
    'q12-s1': {
      goal: 'Find three clues that the shop’s Nubbin is a toy.',
      hint: 'Try feeding it, tickling it, and putting it in the pond.',
    },
    'q12-s2': {
      goal: 'Show Mr Fenwick Mull your clues.',
      hint: 'Put all three clues on the shop counter. Be calm and clear.',
    },
  },
  [
    scene(
      'q12-intro',
      [
        N('A parcel arrives! Inside is a Nubbin.'),
        N('The note says: “One quiet Nubbin. Do not overfeed.”'),
        N('Your Nubbins poke it. It does not move.'),
        N('One of its eyes is a button!'),
        N('You take it back to the shop.'),
        Y('This Nubbin doesn’t move.'),
        FM('Ah. Shh. It’s very, very sleepy.', 'think'),
        Y('It has stitches down its back!'),
        FM('Lovely stitches! Very rare!', 'happy'),
      ],
      [
        ask(
          3,
          m('science', 'living things move and grow', 'Your child used “does it move?” as a clue to whether something is alive.', 'K-LS1-1'),
          [N('Living things eat, move and grow.'), N('Does this Nubbin move?')],
          [
            best('No', N('No, it doesn’t. Not a wiggle. That’s a clue!')),
            opt('Yes', N('Let’s watch… Nope. Not a wiggle. That’s a clue!')),
          ],
        ),
      ],
      [
        ch('refund', 'I want my Shells back.', [FM('Shells back? We never do that. Nothing ever goes wrong!')]),
        ch(
          'wait',
          'I’ll wait for it to wake up.',
          [N('You wait. Mr Mull waits. The Nubbin waits the most.')],
          { 'q12-waited': true },
        ),
      ],
    ),
    scene(
      'q12-evidence',
      [
        N('Clue one: you offer it a heart fruit. It won’t eat.'),
        N('Every Nubbin loves heart fruit!'),
        N('Clue two: you tickle its feet. Nothing.'),
        N('Your own Nubbin giggles instead!'),
        N('Clue three: it floats in the pond. A price tag bobs up.'),
      ],
      [
        act(
          4,
          m('maths', 'count to 3', 'Your child counted three clues on their fingers.', 'K.CC.B.4'),
          'edu:count:clues:3',
          [N('(Count the clues on your fingers.)'), N('Won’t eat. Won’t giggle. Price tag. Three clues!')],
        ),
      ],
    ),
    scene(
      'q12-argument',
      [
        N('You put the clues on the shiny counter.'),
        FM('It didn’t eat? It’s shy!', 'think'),
        Y('It didn’t giggle when I tickled it.'),
        FM('Tired. Long journey.'),
        Y('It floated in the pond.'),
        FM('It loves a swim!', 'happy'),
        N('He pats it. It slowly topples off the counter. Flump.'),
        Y('This is a toy. It was never a real Nubbin.'),
      ],
      [
        ask(
          6,
          m('sel', 'honesty', 'Your child noticed when someone wasn’t telling the truth, and why the truth matters.', 'CASEL: Responsible decision-making'),
          [N('Is Mr Mull telling the truth?')],
          [
            best('No. It’s a toy.', N('Right. The clues say toy. The truth is always best.')),
            opt('Yes', N('Hmm. The clues say toy. He isn’t telling the truth yet.')),
          ],
        ),
      ],
      [
        ch('stare', 'Say nothing. Just look at him.', [N('You look. He looks. Tick, tock. He blinks first.')], {
          'q12-stared': true,
        }),
        ch('read-tag', 'Read the price tag out loud.', [Y('“Toy. Stuffed. Not alive. Made with love.”'), FM('…Made with love, though.')]),
        ch(
          'replace',
          'Then I’d like a new one.',
          [
            FM('None left! Try my brother’s shop, over the hill.'),
            N('Over the hill: the same shop. The same man. In a stick-on moustache!'),
            FM('I’m his brother. Never met him.'),
            N('The moustache falls off. You walk back together.'),
          ],
          { 'q12-brother': true },
        ),
      ],
    ),
    scene(
      'q12-crack',
      [
        FM('All right! It’s a toy. It was always a toy.', 'sad'),
        FM('Here are your Shells back.'),
        FM('And I’ll start a returns counter. The first in the valley!'),
        N('He looks lighter now. Telling the truth helps.'),
      ],
      [
        ask(
          0,
          m('literacy', 'rhyming words', 'Your child found a word that rhymes with “toy”.', 'RF.K.2'),
          [N('Toy… which word rhymes with toy?')],
          [
            best('Boy', N('Yes! Toy, boy, joy. They all rhyme!')),
            opt('Cat', N('Cat ends in “at”. Listen: t-oy, b-oy. Boy rhymes with toy!')),
          ],
        ),
      ],
    ),
    scene(
      'q12-complete',
      [
        N('Mr Mull counts the Shells into your hand.'),
        FM('Keep the toy, though. I’ve grown fond of it.', 'soft'),
        N('You carry it home.'),
        N('Your Nubbins take it to the nest and snuggle round it.'),
        N('By night, they are all fast asleep, cuddling the toy.'),
        N('Now the shop takes things back, if you bring them within a day.'),
      ],
      [
        act(
          4,
          m('science', 'alive and not alive', 'Your child sorted things into alive and not alive.', 'K-LS1-1'),
          'edu:sort:alive:nubbin-toy',
          [
            N('Your Nubbins are alive. They eat, grow and move.'),
            N('The toy is not alive. But it’s lovely to cuddle!'),
            N('(Point to something alive. Now something not alive.)'),
          ],
        ),
      ],
    ),
  ],
  'Sprout never calls the toy “dead” or “resting”: it is simply a toy, not alive, and the lesson is living and not living.',
);

// ------------------------------------------------------------------ Q13
const Q13 = quest(
  'q13',
  'The Silly Walk Booth',
  {
    'q13-s1': {
      goal: 'Show Mr Strutt a walk of your own.',
      hint: 'Tap a pattern of moves on the pad, then press Walk.',
    },
    'q13-s2': {
      goal: 'Show Mr Strutt a really silly walk.',
      hint: 'Mix spins, hops, backwards steps and stops.',
    },
  },
  [
    scene(
      'q13-intro',
      [
        N('A little booth stands at the crossroads.'),
        N('The sign says: PRIZES FOR WALKS. VERY SILLY ONLY.'),
        N('Inside is Mr Strutt, in a round black hat.'),
        ST('Most walks here are so sensible. It keeps me awake.', 'sad'),
        N('He walks to his cupboard. Kick, sit, wiggle, twirl.'),
        N('It takes four whole minutes!'),
        ST('Now, show me yours. Surprise me!'),
      ],
      [
        act(
          6,
          m('health', 'hopping on one foot', 'Your child warmed up by hopping on one foot.', 'ELOF: Perceptual, Motor, and Physical Development'),
          'edu:hop:one-foot:5',
          [ST('First, a warm-up. Can you hop on one foot?'), N('(Stand up and hop five times. Count them!)'), N('Hop, hop, hop, hop, hop!')],
        ),
      ],
      [
        ch('nervous', 'I don’t think I have one.', [ST('Everybody has one. Most people hide it.')]),
        ch('eager', 'I’ve been practising!', [ST('Marvellous! Don’t tell me. Show me!')], { 'q13-practised': true }),
      ],
    ),
    scene(
      'q13-first',
      [
        N('You do your walk. It has a hop in it.'),
        N('You are proud of the hop.'),
        ST('Hmm. That’s quite a sensible walk.'),
        ST('The hop is good. The rest was just walking.', 'sad'),
      ],
      [
        notice(
          3,
          m('sel', 'trying again', 'Your child heard that first tries are for learning, and we can try again.', 'CASEL: Self-management'),
          [ST('That’s all right! First tries are for learning.', 'happy'), N('When something is tricky, we try again.')],
        ),
      ],
    ),
    scene(
      'q13-notes',
      [
        ST('Let me give you some tips.', 'think'),
        ST('More knees! Up, up, up!'),
        ST('Then do something odd with your elbows.'),
        ST('And once, walk backwards. Look as if you mean it.'),
        N('Your Nubbin tries. It falls over and stays lying down.'),
        ST('Now THAT is promising!', 'happy'),
      ],
      [
        ask(
          2,
          m('maths', 'patterns', 'Your child spotted what comes next in a knee-elbow pattern.', 'ELOF: Mathematics Development'),
          [ST('Knee, elbow, knee, elbow… what comes next?')],
          [
            best('Knee', ST('Yes! Knee, elbow, KNEE! You found the pattern.', 'happy')),
            opt('Elbow', ST('Let’s say it slowly: knee, elbow, knee, elbow… KNEE!')),
          ],
        ),
      ],
      [
        ch(
          'copy',
          'Copy your Nubbin.',
          [N('You try walking lying down. It doesn’t work. It IS silly!')],
          { 'q13-copied-nubbin': true },
        ),
        ch('own', 'Make up your own.', [ST('Bold! I am reaching for my stamp.')]),
      ],
    ),
    scene(
      'q13-approved',
      [
        N('You walk. Hop! Crouch! Spin!'),
        N('Backwards! Elbows! Ta-da!'),
        N('Mr Strutt stands up slowly. He takes off his hat.'),
        ST('The silliest walk since Tuesday. Yes!', 'happy'),
      ],
      [
        ask(
          0,
          m('science', 'balance', 'Your child noticed that balancing on one foot is harder, and arms out help.'),
          [N('Which is harder: standing on one foot, or two?')],
          [
            best('One foot', N('Yes! On one foot we wobble. Arms out help us balance.')),
            opt('Two feet', N('Try it! Two feet is steady. One foot wobbles. Arms out help!')),
          ],
        ),
      ],
    ),
    scene(
      'q13-complete',
      [
        N('He stamps your form. Stamp! Stamp! STAMP!'),
        ST('Approved! Walk silly, often, and everywhere!', 'happy'),
        N('He gives you a spare round hat. It’s too big. It’s perfect.'),
        ST('You don’t need a form to be silly, you know.', 'soft'),
        ST('But people do like being told they may.', 'soft'),
        N('Now you can walk silly whenever you like!'),
      ],
      [
        act(
          5,
          m('maths', 'measuring with steps', 'Your child measured a distance in giant steps and tiny steps and compared them.', 'K.MD.A.2'),
          'edu:measure:steps:giant-tiny',
          [
            ST('How many giant steps to the door? Now tiny steps?'),
            N('(Try it! Count both.)'),
            N('Tiny steps take more. Giant steps take fewer!'),
          ],
        ),
      ],
    ),
  ],
);

// ------------------------------------------------------------------ Q14
const Q14 = quest(
  'q14',
  'The Comfy Chair',
  {
    'q14-s1': {
      goal: 'Bring the comfy chair from the Workshop.',
      hint: 'It’s the big red chair by the door. Carry it to the nest.',
    },
    'q14-s2': {
      goal: 'Put your sleepiest Nubbin in the comfy chair.',
      hint: 'Look for the Nubbin that yawns. Put it on the chair.',
    },
  },
  [
    scene(
      'q14-intro',
      [
        N('You are brushing a Nubbin. Bang! The gate flies open.'),
        N('In sweep three Keepers in long red robes. One trips.'),
        PO('Surprise! We are the Nap Patrol!', 'angry'),
        PO('Surprise is our best tool. Surprise, and cushions…', 'happy'),
        BO('And blankets.'),
        PO('Our THREE tools! Hmm. Out we go. We’ll do the door again.', 'think'),
        N('Out they go. Bang! In they come. Nobody trips.'),
        PO('Your Nubbins look tired. Sister Tuft! The big red chair!'),
        TF('We left it at your Workshop. Brother Pouffe said he would carry it.', 'sad'),
        PO('…Keeper, could you bring it here for us, please?', 'sad'),
      ],
      [
        ask(
          5,
          m('maths', 'count to 3', 'Your child counted the Nap Patrol’s three tools.', 'K.CC.B.5'),
          [N('Surprise, cushions, blankets. How many tools?')],
          [
            best('Three', N('Yes! One, two, three tools.')),
            opt('Two', N('Count again: surprise, cushions, blankets. Three!')),
          ],
        ),
      ],
      [
        ch('fetch', 'OK. I’ll fetch it.', [PO('Splendid! We shall wait here, looking scary.')]),
        ch(
          'cushion',
          'Can I hold a cushion?',
          [BO('…Just for a minute.'), N('It is very, very soft.')],
          { 'q14-held-cushion': true },
        ),
      ],
    ),
    scene(
      'q14-chair',
      [
        N('You put the chair by the nest. It’s big, red and squashy.'),
        TF('Behold! The comfy chair.', 'happy'),
        N('Bolster holds up the cushions. Tuft fluffs the chair.'),
        N('Fluff, fluff!'),
      ],
      [
        ask(
          3,
          m('science', 'soft and hard', 'Your child sorted things by how they feel: soft or hard.', '2-PS1-1'),
          [N('Which is soft: a cushion or a stone?')],
          [
            best('A cushion', N('Yes! Cushions are soft and squashy. Stones are hard.')),
            opt('A stone', N('Ouch! Stones are hard. Cushions are soft.')),
          ],
        ),
      ],
    ),
    scene(
      'q14-sentence',
      [
        PO('Now! Bring us your sleepiest Nubbin!', 'angry'),
        PO('It shall sit in the comfy chair until lunch.'),
        BO('With a woolly blanket.', 'think'),
        TF('And no getting up. Not even for a snack.'),
        PO('Unless it’s a very small snack.'),
        N('They nod. Very serious. Very cosy.'),
      ],
      [
        ask(
          0,
          m('health', 'signs of being tired', 'Your child named the signs that a body needs rest.'),
          [N('How can you tell a Nubbin is sleepy?')],
          [
            best('It yawns and rubs its eyes', N('Yes! Yawning means a body needs rest.')),
            opt('It jumps about', N('Jumping means lots of energy! Yawning means sleepy.')),
          ],
        ),
      ],
      [
        ch('sleepiest', 'Bring the sleepiest Nubbin.', [N('It yawns so wide it nearly falls in!')]),
        ch(
          'volunteer',
          'Offer to sit in it yourself.',
          [PO('Ha! Not today. Bring us a sleepy Nubbin!')],
          { 'q14-volunteered': true },
        ),
      ],
    ),
    scene(
      'q14-asleep',
      [
        N('The Nubbin sinks into the chair.'),
        N('Bolster tucks in a cushion. Tuft lays a blanket.'),
        N('It is asleep before the blanket lands.'),
        N('Snore… snore… like a tiny kettle.'),
      ],
      [
        ask(
          3,
          m('music', 'loud and soft', 'Your child chose a soft voice for a quiet moment.'),
          [N('Shh! Should we be loud or soft now?')],
          [
            best('Soft', N('Yes. (Whisper “night night” in your softest voice.)')),
            opt('Loud', N('Loud would wake it! Let’s whisper softly: “night night”.')),
          ],
        ),
      ],
    ),
    scene(
      'q14-complete',
      [
        N('Two hours later, the Nubbin wakes. Stretch! It glows.'),
        PO('Ha! Look at it. All better!', 'happy'),
        BO('The best nap we ever gave.', 'soft'),
        TF('Let’s go. Three more Groves to surprise before tea.'),
        N('Out they sweep. One trips. Back they come for the chair.'),
        PO('Keep it! We have a whole room of them.', 'think'),
        PO('One last question. When did YOU last sit down?', 'think'),
        N('Now tired Nubbins nap better in the comfy chair.'),
      ],
      [
        ask(
          6,
          m('sel', 'noticing when you are tired', 'Your child thought about what helps when they feel tired.', 'CASEL: Self-awareness'),
          [N('When you feel tired, what helps?')],
          [
            best('A rest or a cuddle', N('Yes! Rest helps our bodies feel better.')),
            opt('Running faster', N('Running makes us more tired! A rest or a cuddle helps.')),
          ],
        ),
      ],
      [
        ch(
          'sit',
          'Sit down, just for a minute.',
          [
            N('You sit. Tuft tucks a blanket over your knees.'),
            N('You wake an hour later with a cushion on your face!'),
            PO('Ha! Our work is never done.'),
          ],
          { 'q14-keeper-napped': true },
        ),
        ch('busy', 'No time. Too much to do!', [TF('That’s what they all say.'), PO('Then keep the chair. It will wait. Chairs are good at waiting.')]),
      ],
    ),
  ],
  'Sprout: the three red-robed visitors are the Nap Patrol throughout.',
);

// ------------------------------------------------------------------ Q15
const Q15 = quest(
  'q15',
  'The Empty Fruit Stall',
  {
    'q15-s1': {
      goal: 'Ask Mr Dibble for six different fruits.',
      hint: 'Pick fruits from the list at the stall.',
    },
    'q15-s2': {
      goal: 'Keep asking until you’ve tried all twelve fruits.',
      hint: 'Keep choosing from the list. Something happens at twelve.',
    },
  },
  [
    scene(
      'q15-intro',
      [
        N('A smart green stall has opened by the bridge.'),
        N('The sign says: EVERY FRUIT IN THE VALLEY!'),
        N('Mr Dibble beams, in a stripy apron and a straw hat.'),
        DB('Good morning! Any fruit you like!', 'happy'),
        N('The boxes are all under flat cloths. Very flat.'),
        Y('A run fruit, please.'),
        DB('Ah. All gone. They ran away!', 'sad'),
        Y('A swim fruit, then?'),
        DB('They went for a swim. Sorry!'),
      ],
      [
        ask(
          3,
          m('science', 'seeds inside fruit', 'Your child learned that most fruits have seeds inside, and seeds can grow new plants.'),
          [N('Fruit grows on plants. What is inside most fruits?')],
          [
            best('Seeds', N('Yes! Seeds. Plant a seed, and a new plant can grow.')),
            opt('Socks', N('Ha! No socks. Most fruits have seeds inside.')),
          ],
        ),
      ],
      [
        ch('polite', 'Keep asking, politely.', [DB('Please do! Asking is half the fun. For me.')]),
        ch(
          'peek',
          'Lift a cloth.',
          [N('Mr Dibble gently puts the cloth back down.'), DB('Let’s not spoil the surprise.')],
          { 'q15-peeked': true },
        ),
      ],
    ),
    scene(
      'q15-six',
      [
        Y('Fly fruit?'),
        DB('Flew away.'),
        Y('Power fruit? Stamina fruit? Sun fruit?'),
        DB('Lifted. Eaten. And the sun fruit set. They do that.', 'sad'),
        N('That’s six fruits. And still no fruit!'),
      ],
      [
        act(
          4,
          m('maths', 'count to 6', 'Your child counted the six fruits asked for on their fingers.', 'K.CC.B.5'),
          'edu:count:fruits-asked:6',
          [N('(Count the fruits you asked for on your fingers.)'), N('Run, swim, fly, power, stamina, sun. Six!')],
        ),
      ],
    ),
    scene(
      'q15-twelve',
      [
        N('You keep asking. Mr Dibble keeps smiling.'),
        N('Behind the stall, a Nubbin plays three notes. Plink, plonk, plunk.'),
        Y('Moon fruit?'),
        DB('Only at night. And at night I’m closed.'),
        Y('Heart fruit?'),
        DB('A Nubbin loved it so much, I gave it away.', 'soft'),
        Y('Could the music stop?'),
        DB('Stop? It makes the stall feel special!', 'shock'),
        N('Plink… plonk… plunk. Even slower.'),
      ],
      [
        act(
          1,
          m('music', 'copying a pattern of sounds', 'Your child copied a three-note pattern, slow and then fast.'),
          'edu:clap:pattern:plink-plonk-plunk',
          [N('(Clap the tune: plink, plonk, plunk.)'), N('Now very slowly. Plink… plonk… plunk.'), N('Now fast! Plinkplonkplunk!')],
        ),
      ],
    ),
    scene(
      'q15-confess',
      [
        N('By fruit number twelve, Mr Dibble stops smiling.'),
        N('He takes off his hat and holds it.'),
        DB('I have to tell you something. There’s no fruit. Not one pip.', 'sad'),
        DB('I just liked having a stall.', 'sad'),
        Y('A fruit stall with no fruit?'),
        DB('Yes. It’s a very nice stall, though.'),
      ],
      [
        ask(
          3,
          m('sel', 'telling the truth is brave', 'Your child talked about how telling the truth can take courage.', 'CASEL: Responsible decision-making'),
          [N('Mr Dibble told the truth. Was that brave?')],
          [
            best('Yes', N('Yes! Telling the truth can be hard. He did it.')),
            opt('No', N('It took courage! Saying “I have to tell you something” is brave.')),
          ],
        ),
      ],
      [
        ch(
          'stock',
          'Let’s fill it with real fruit!',
          [DB('Real fruit? But people would buy it! Then it’d be gone!'), DB('…I’ll put out one run fruit. On a cushion.')],
          { 'q15-stocked': true },
        ),
        ch(
          'leave-it',
          'Don’t change a thing.',
          [DB('Really? You don’t mind?'), Y('It’s the friendliest stall in the valley.'), DB('That’s the nicest thing anyone has said to me.', 'soft')],
          { 'q15-stocked': false },
        ),
      ],
    ),
    scene(
      'q15-complete',
      [
        DB('I have no fruit. But I know lots about fruit.', 'think'),
        N('He brings out a big page. Every fruit, drawn beautifully.'),
        DB('Where it grows. What it does. Who likes it best.'),
        N('It goes in your Collection book. It fits perfectly.'),
        DB('Take the straw hat too.', 'soft'),
        N('As you go, he calls to the next customer: “Sorry! All gone!”'),
      ],
      [
        ask(
          1,
          m('art', 'naming colours', 'Your child matched things that share a colour.'),
          [N('On the page, the sun fruit is yellow. What else is yellow?')],
          [
            best('A banana', N('Yes! Bananas are yellow, like the sun fruit.')),
            opt('Grass', N('Grass is green. Bananas are yellow, like the sun fruit.')),
          ],
        ),
      ],
    ),
  ],
);

// ------------------------------------------------------------------ Q16
const Q16 = quest(
  'q16',
  'The Argument Booth',
  {
    'q16-s1': {
      goal: 'Pay Byte 5 Shells for an argument.',
      hint: 'Tap Byte’s booth and choose Pay.',
    },
    'q16-s2': {
      goal: 'Win the argument before the sand runs out.',
      hint: 'Don’t just say “no” back. Ask Byte for reasons.',
    },
  },
  [
    scene(
      'q16-intro',
      [
        N('Byte has a booth. The sign says: ARGUMENTS. 5 SHELLS.'),
        N('On the counter is a sand timer.'),
        N('Next door is a booth called COMPLAINTS. Also Byte, in another hat.'),
        BY('Good afternoon. Would you like an argument?', 'think'),
        Y('What kind?'),
        BY('A good one. Fair, and timed. One minute.'),
        BY('Five Shells, please. First.'),
      ],
      [
        act(
          6,
          m('maths', 'count to 5', 'Your child counted five Shells, one at a time.', 'K.CC.B.4'),
          'edu:count:shells:5',
          [BY('Count them onto the counter, please.'), N('(Count together: one, two, three, four, five.)')],
        ),
      ],
      [
        ch('pay', 'Pay the five Shells.', [BY('Thank you. Sit down to begin.')]),
        ch('four', 'Four Shells?', [BY('No. That one was free. Don’t do it again.')], { 'q16-haggled': true }),
      ],
    ),
    scene(
      'q16-flip',
      [
        N('Byte turns the sand timer over.'),
        N('The sand starts to fall. Shhh.'),
        BY('Your minute starts now.'),
        BY('Please begin.'),
      ],
      [
        notice(
          1,
          m('science', 'things fall down', 'Your child watched sand fall down through a timer and heard how it measures a minute.'),
          [N('Watch the sand. It always falls down, never up.'), N('When the top is empty, one minute is over.')],
        ),
      ],
    ),
    scene(
      'q16-minute',
      [
        Y('Your booth is very nice.'),
        BY('No, it isn’t.'),
        Y('It’s a lovely day. It rained, and now there’s a rainbow!'),
        BY('That is a smudge.', 'think'),
        Y('You just say no to everything!'),
        BY('No, I don’t.'),
        N('The sand is half gone.'),
      ],
      [
        ask(
          2,
          m('science', 'rainbows', 'Your child heard that sunshine and raindrops make a rainbow, and named its colours.'),
          [N('A rainbow comes when the sun shines through raindrops.'), N('What colours are in a rainbow?')],
          [
            best('Red, orange, yellow, green, blue…', N('Yes! And purple too. So many colours!')),
            opt('Only grey', N('Rainbows are bright! Red, orange, yellow, green, blue and purple.')),
          ],
        ),
      ],
      [
        ch(
          'agree',
          'Agree with Byte. See what happens.',
          [Y('You’re right. It’s a smudge.'), BY('It is clearly a rainbow!')],
          { 'q16-agreed': true },
        ),
        ch('breathe', 'Take a deep breath.', [N('You breathe in. Byte breathes in too, just in case.')]),
      ],
    ),
    scene(
      'q16-win',
      [
        Y('Byte, you never say why.'),
        BY('Yes, I do.'),
        Y('Saying “no” isn’t a reason. Tell me why!'),
        N('Byte opens his mouth. Then he stops.'),
        N('He looks at the sand timer for help.'),
        BY('…That’s fair.', 'shock'),
      ],
      [
        ask(
          2,
          m('literacy', 'giving reasons with “because”', 'Your child picked the answer that gives a reason using “because”.', 'SL.K.1'),
          [N('Which one gives a reason?')],
          [
            best('“It’s a rainbow, because I can see colours.”', N('Yes! “Because” tells us why.')),
            opt('“No.”', N('Just “no” has no reason. “Because” tells us why!')),
          ],
        ),
      ],
      [
        ch(
          'complain',
          'Go next door to Complaints.',
          [
            N('You go next door. Byte swaps hats and follows.'),
            BY('Complaints. Go on.'),
            Y('The argument man just kept saying no.'),
            BY('Did he? I shall talk to him.'),
            N('He swaps hats and tells himself off.'),
          ],
          { 'q16-complained': true },
        ),
        ch('shake', 'Shake hands. Good game.', [BY('It wasn’t a game. It was… yes. Fine. Good game.')]),
      ],
    ),
    scene(
      'q16-complete',
      [
        N('The last grain of sand falls.'),
        BY('Nobody has won before. They just get cross.', 'think'),
        BY('Saying no is easy. I called it thinking.', 'soft'),
        BY('Keep the timer. I have lots of sand.'),
        BY('You’re in my Talking Club. The first member!', 'happy'),
        Y('Is there a club?'),
        BY('There is now. No arguing.'),
        N('Pixel leans out of the Workshop window.'),
        PX('Did you win? Nobody wins against Byte.', 'happy'),
        BY('Disagree.'),
        PX('See?'),
      ],
      [
        ask(
          2,
          m('sel', 'disagreeing kindly', 'Your child practised a kind way to say they think something different.', 'CASEL: Relationship skills'),
          [N('If you think something different from a friend, what can you say?')],
          [
            best('“I think something different, because…”', BY('Yes. Kind, and with a reason. Very good.', 'soft')),
            opt('“You’re wrong, wrong, wrong!”', N('That can hurt feelings. Try: “I think something different, because…”')),
          ],
        ),
      ],
    ),
  ],
);

// ------------------------------------------------------------------ Q17
const Q17 = quest(
  'q17',
  'The Dock Dance',
  {
    'q17-s1': {
      goal: 'Learn the dock dance.',
      hint: 'Open Karate on the dock. Tap in time with the beat.',
    },
    'q17-s2': {
      goal: 'Dance the whole dance on the dock.',
      hint: 'Hit every beat. The last beat isn’t yours to win!',
    },
  },
  [
    scene(
      'q17-intro',
      [
        N('At the end of the dock stand two Keepers in white shirts.'),
        N('Each holds a shiny rubber fish. Squeak!'),
        PI('Good morning. I’m Pilchard. This is Grampus. We dance.', 'think'),
        GR('Just us two.'),
        N('They show you. Step, bow, boop! A rubber fish on the nose.'),
        N('Then the other way. Step, bow, boop!'),
        N('Nobody smiles. It’s strangely beautiful.'),
        GR('Will you dance with us?'),
      ],
      [
        act(
          5,
          m('music', 'moving to a pattern', 'Your child danced a three-step pattern: step, bow, boop.'),
          'edu:dance:pattern:step-bow-boop',
          [N('(Stand up! Step… bow… boop your nose!)'), N('Step, bow, boop. Step, bow, boop!')],
        ),
      ],
      [
        ch('honoured', 'I’d love to!', [PI('Splendid. You’ll need a fish.')]),
        ch(
          'fish-mind',
          'Do the fish mind?',
          [GR('They’re rubber fish. They love it. Listen: squeak!')],
          { 'q17-asked-fish': true },
        ),
      ],
    ),
    scene(
      'q17-learned',
      [
        N('Step, bow, boop. Step, bow, boop.'),
        N('Your rubber fish squeaks every time.'),
        PI('Good. Very good. Your wrist is a bit too keen.', 'think'),
        GR('Keen wrists end up in the water.'),
      ],
      [
        notice(
          1,
          m('science', 'how fish breathe', 'Your child learned that real fish live in water and breathe with gills.', '4-LS1-1'),
          [GR('Real fish live in the water.'), GR('They breathe with gills, on the sides of their heads.')],
        ),
      ],
    ),
    scene(
      'q17-performance',
      [
        PI('Now the whole dance! In front of everyone!', 'happy'),
        N('Nubbins sit on the bank to watch. One has a snack.'),
        GR('Keep to the beat. Whatever happens.'),
        N('Grampus brings out a second rubber fish. It is VERY big.'),
        Y('That’s not the same fish!'),
        GR('It is the big finish fish.', 'think'),
      ],
      [
        ask(
          3,
          m('maths', 'bigger and smaller', 'Your child compared the sizes of two fish.', 'K.MD.A.2'),
          [N('Which fish is bigger?')],
          [
            best('The big finish fish', N('Yes! It’s much bigger than your little fish.')),
            opt('Your little fish', N('Yours is little. The big finish fish is much bigger!')),
          ],
        ),
      ],
      [
        ch(
          'keep-time',
          'Keep to the beat.',
          [N('You plant your feet. Your little fish squeaks.')],
          { 'q17-kept-time': true },
        ),
        ch('ask-finale', 'What happens at the end?', [PI('Water, mostly.'), GR('Gently, though.')]),
      ],
    ),
    scene(
      'q17-splash',
      [
        N('Step, bow, boop. Every beat just right!'),
        N('Then Grampus swings the big fish. Slowly. Gently.'),
        N('Boop! You wobble… and topple into the pond. SPLASH!'),
        N('The water is warm and shallow. A duck looks at you.'),
        N('The Nubbins cheer. That was the plan!'),
      ],
      [
        notice(
          3,
          m('health', 'water safety', 'Your child heard that we only go in water when a grown-up is watching.'),
          [N('This pond is warm and shallow, and grown-ups are right here.'), N('We only go in water with a grown-up watching.')],
        ),
      ],
    ),
    scene(
      'q17-complete',
      [
        N('You climb out. Pilchard hands you a towel.'),
        N('Grampus hands you the big finish fish.'),
        GR('Whoever falls in keeps the big fish. That’s the rule.', 'soft'),
        PI('It’s great for knocking fruit out of trees.'),
        GR('We dance every morning, usually for nobody.', 'soft'),
        GR('It’s nice to be watched. But we’d dance anyway.', 'soft'),
        N('Now your Power Nubbins can knock fruit down with the big fish!'),
      ],
      [
        ask(
          5,
          m('sel', 'doing what you love', 'Your child thought about why people do things they love, even with nobody watching.', 'CASEL: Self-awareness'),
          [N('They dance even when nobody watches. Why?')],
          [
            best('Because they love it', N('Yes! When we love something, we do it for joy.')),
            opt('Because they have to', N('Nobody makes them. They dance because they love it!')),
          ],
        ),
      ],
    ),
  ],
  'Sprout: the dancers use squeaky rubber fish and give each other a gentle “boop” on the nose; nobody is slapped.',
);

// ------------------------------------------------------------------ Q18
const Q18 = quest(
  'q18',
  'Fruit Class',
  {
    'q18-s1': {
      goal: 'Peel the banana before the Nubbin can wave it.',
      hint: 'When the banana goes up, tap Peel.',
    },
    'q18-s2': {
      goal: 'Catch every raspberry in the bowl.',
      hint: 'Slide the bowl left and right under the berries.',
    },
    'q18-s3': {
      goal: 'Toss the pineapple to your Nubbin.',
      hint: 'Aim at your Nubbin and tap Throw. Gently!',
    },
  },
  [
    scene(
      'q18-intro',
      [
        N('In the clearing, a Keeper with a bushy moustache marches about.'),
        N('Three Nubbins sit on logs. They look a bit nervous.'),
        SG('YOU! Late! Sit on a log!', 'angry'),
        SG('Sergeant Grimble. Tonight: what to do when someone has fruit!'),
        N('A Nubbin puts up its paw.'),
        SG('NO. Not sticks. Tonight is FRUIT.', 'angry'),
        N('The Nubbin puts its paw down. Very slowly.'),
        SG('First, the banana. Someone waves a banana at you. What do you do?'),
      ],
      [
        act(
          7,
          m('literacy', 'clapping syllables', 'Your child clapped the three beats in “banana”.', 'RF.K.2'),
          'edu:clap:syllables:banana',
          [N('Let’s clap “banana” first.'), N('(Clap it together: ba… na… na!)'), N('Three claps!')],
        ),
      ],
      [
        ch('duck', 'Duck!', [SG('DUCK? Bananas are curved, Keeper! It’ll find you!')]),
        ch('reason', 'Talk to them nicely.', [SG('With a BANANA in their hand?')]),
        ch('peel', 'Peel it!', [SG('…Correct! Who told you?')], { 'q18-knew-peel': true }),
      ],
    ),
    scene(
      'q18-banana',
      [
        N('A Nubbin waves a banana at you.'),
        N('You peel it. Zip, zip, zip!'),
        N('The Nubbin looks at the bare banana. Oops.'),
        N('It sits back down, a bit embarrassed.'),
        SG('PERFECT! A peeled banana is a beaten banana!', 'happy'),
      ],
      [
        notice(
          4,
          m('health', 'fruit is good food', 'Your child heard that fruit like bananas helps our bodies grow strong.'),
          [SG('And a peeled banana is a tasty snack.'), SG('Fruit helps our bodies grow strong. Eat up!')],
        ),
      ],
    ),
    scene(
      'q18-raspberry',
      [
        SG('Next, the raspberry. Small. Fast. Red.', 'think'),
        SG('There is never just one. There are lots!'),
        N('A Nubbin stands up with a bowl of raspberries.'),
        SG('Hold out a bowl. Catch them all. None on the floor!'),
        Y('Why not on the floor?'),
        SG('They STAIN, Keeper! Red, red, red!', 'angry'),
      ],
      [
        ask(
          0,
          m('art', 'the colour red', 'Your child found another red thing to match the raspberries.'),
          [N('Raspberries are red. Which of these is red too?')],
          [
            best('A strawberry', N('Yes! Strawberries are red, like raspberries.')),
            opt('A leaf', N('Most leaves are green. Strawberries are red, like raspberries!')),
          ],
        ),
      ],
    ),
    scene(
      'q18-raspberry-done',
      [
        N('Plop, plop, plop! Every raspberry lands in the bowl.'),
        N('The floor is clean.'),
        N('The Nubbin with the empty bowl eats one of yours.'),
        SG('Good enough. Next!'),
      ],
      [
        act(
          0,
          m('maths', 'count to 10', 'Your child counted ten raspberries into the bowl.', 'K.CC.B.5'),
          'edu:count:raspberries:10',
          [N('(Count the last ten into the bowl.)'), N('One, two, three, four, five, six, seven, eight, nine, ten!')],
        ),
      ],
    ),
    scene(
      'q18-pineapple',
      [
        SG('And now. The big one.', 'think'),
        N('Under a cloth sits a huge, spiky pineapple. Wearing sunglasses!'),
        SG('The pineapple. Spiky. Heavy. A bit of a show-off.'),
        SG('Don’t fight it. Make it your friend.'),
        Y('How?'),
        SG('Throw it gently to your Nubbin. Let it catch!', 'happy'),
      ],
      [
        ask(
          5,
          m('sel', 'playing safely with others', 'Your child chose the safe, kind way to throw to a friend.', 'CASEL: Responsible decision-making'),
          [N('How do we throw something to a friend?')],
          [
            best('Gently, when they are looking', SG('Correct! Gentle, and ready. Nobody gets bonked.', 'happy')),
            opt('Hard, when they’re not looking', SG('No! That could hurt. Gently, when they’re looking.')),
          ],
        ),
      ],
      [
        ch('toss', 'Just toss it.', [SG('No fuss. I like it.')]),
        ch('sunglasses', 'Take its sunglasses off first.', [SG('Bold! It respects that.')], { 'q18-sunglasses-off': true }),
      ],
    ),
    scene(
      'q18-catch',
      [
        N('You toss the pineapple, nice and gently.'),
        N('Your Nubbin runs, jumps and catches it. Oof!'),
        N('It holds it up like a prize.'),
        N('The pineapple looks happy about it.'),
      ],
      [
        act(
          3,
          m('health', 'throwing and catching', 'Your child played gentle throw-and-catch with a soft toy.', 'ELOF: Perceptual, Motor, and Physical Development'),
          'edu:throw-catch:soft-toy',
          [N('(Find a soft toy. Toss it gently to each other!)'), N('Throw… catch! Throw… catch!')],
        ),
      ],
    ),
    scene(
      'q18-complete',
      [
        SG('CLASS IS OVER!', 'happy'),
        SG('You can now handle fresh fruit. And throw it to friends.'),
        SG('Between you and me? Forty years. Nobody ever waved fruit at me.', 'soft'),
        SG('I’ve been ready the whole time. So tiring!', 'think'),
        N('He gives you his old brass whistle.'),
        SG('Blow it, and your Nubbins look up. Throw, and they catch.'),
        SG('Dried fruit is next week. Bring a hat.', 'think'),
        N('Now your Nubbins can catch fruit you throw!'),
      ],
      [
        notice(
          6,
          m('science', 'dried fruit', 'Your child learned that dried fruit has had its water taken out, like a raisin from a grape.'),
          [SG('Dried fruit is fruit with the water taken out.'), SG('A raisin is a dried grape!')],
        ),
      ],
    ),
  ],
);

// ------------------------------------------------------------------ Q19
const Q19 = quest(
  'q19',
  'The Grand Cup Race',
  {
    'q19-s1': {
      goal: 'Sign up for the Grand Cup race in the meadow.',
      hint: 'Write your name in Mrs Thackery’s book.',
    },
    'q19-s2': {
      goal: 'Win the Grand Cup race.',
      hint: 'Jump the matchboxes. Go round the sleeping Keeper. Don’t wake them!',
    },
  },
  [
    scene(
      'q19-intro',
      [
        N('A banner says: THE GRAND CUP RACE. EVERYONE WELCOME!'),
        MT('Roll up! Three runners so far. We need one more!', 'happy'),
        N('The three runners stand at the start. One faces the wrong way.'),
        BU('I say. Is this the start or the end?', 'think'),
        PR('It’s the middle, Bunty. Everything is the middle.'),
        AL('Nine years I’ve entered. I’ve never found the start line!', 'happy'),
      ],
      [
        ask(
          1,
          m('maths', 'adding one more', 'Your child added one more to three to make four.', 'K.OA.A.2'),
          [N('Three runners, and you join. How many runners now?')],
          [
            best('Four', N('Yes! Three and one more makes four.')),
            opt('Three', N('Count again: one runner, two runners, three runners… and you! Four.')),
          ],
        ),
      ],
      [
        ch('enter', 'Sign up!', [MT('Splendid! Write your name. Any spelling you like.')]),
        ch(
          'turn-bunty',
          'Turn Bunty round first.',
          [N('You turn Bunty round. Bunty says thank you… and turns back.')],
          { 'q19-turned-bunty': true },
        ),
      ],
    ),
    scene(
      'q19-ready',
      [
        MT('Four runners! A record!'),
        MT('Jump the matchboxes. Climb the low wall. Go round the sleeping Keeper.'),
        N('At the end, a Keeper snores in a deckchair.'),
        N('Nobody knows who put them there.'),
      ],
      [
        act(
          0,
          m('literacy', 'the first letter of your name', 'Your child found and drew the first letter of their own name.', 'ELOF: Literacy'),
          'edu:write:own-name:first-letter',
          [MT('Write your name in the book!'), N('(What letter does your name start with? Draw it in the air.)')],
        ),
      ],
    ),
    scene(
      'q19-race',
      [
        MT('Ready… steady… GO!', 'happy'),
        N('You run. Behind you, nobody else moves.'),
        MT('Bunty is checking which way is forwards!', 'shock'),
        MT('Piers is tying his lace to Algernon’s lace!'),
        N('Piers jumps the matchboxes. Way too high!'),
        AL('I found the start line! Hello, start line!', 'happy'),
        N('Bunty reaches the sleeping Keeper and taps their shoulder.'),
        BU('So sorry. Would you like to come? It’s fun!'),
      ],
      [
        ask(
          4,
          m('maths', 'positions: over and round', 'Your child used the position words over and round.', 'K.G.A.1'),
          [N('We go OVER the matchboxes. What about the sleeping Keeper?')],
          [
            best('Round them', N('Yes! Round them, quietly, so they can sleep.')),
            opt('Over them', N('Not over! We go round them, so they can sleep.')),
          ],
        ),
      ],
      [
        ch(
          'straight-face',
          'Keep a straight face and run.',
          [N('You keep a straight face. It’s SO hard!')],
          { 'q19-straight-face': true },
        ),
        ch('laugh', 'Laugh all the way.', [N('You laugh so much you have to walk. You’re still way ahead!')]),
      ],
    ),
    scene(
      'q19-win',
      [
        MT('The Keeper wins!', 'happy'),
        N('Far behind, Algernon waves goodbye to the start line.'),
        N('Bunty comes last, arm in arm with the sleeping Keeper.'),
        N('The Keeper is still asleep!'),
      ],
      [
        notice(
          2,
          m('sel', 'kindness matters more than winning', 'Your child heard that helping someone matters more than winning a race.', 'CASEL: Social awareness'),
          [N('Bunty came last. But Bunty stopped to help.'), N('Being kind matters more than winning.')],
        ),
      ],
      [
        ch(
          'bunty-prize',
          'Bunty should get a prize for helping!',
          [
            MT('There isn’t a prize for that.'),
            Y('There should be!'),
            MT('…There is now. A smaller hat.'),
            N('Bunty cries happy tears and puts it on the sleeping Keeper.'),
          ],
          { 'q19-bunty-prize': true },
        ),
        ch('gracious', 'Say thank you nicely.', [N('You bow. Piers bows. Algernon bows to the start line.')]),
      ],
    ),
    scene(
      'q19-complete',
      [
        N('The runners come to say well done.'),
        N('Two of them say it to a fence post first.'),
        PR('Jolly fast! We didn’t know people went that way!', 'happy'),
        BU('Here’s your prize. A tall top hat!'),
        BU('And a monocle from me. A round glass for one eye.'),
        N('It only stays in if you lift one eyebrow.'),
        AL('Same time next year? I’ll look for the start line tonight.', 'happy'),
        N('The sleeping Keeper wakes, sees your hat, and goes back to sleep.'),
      ],
      [
        ask(
          4,
          m('maths', 'circles', 'Your child named the round monocle as a circle.', 'K.G.A.2'),
          [N('What shape is the monocle?')],
          [
            best('A circle', N('Yes! A round circle, just for one eye.')),
            opt('A square', N('A square has four corners. The monocle is round: a circle!')),
          ],
        ),
      ],
    ),
  ],
  'Sprout title and lines drop the word “twit”; the race is simply the Grand Cup.',
);

// ------------------------------------------------------------------ Q20
const Q20 = quest(
  'q20',
  'The Pointy Tree',
  {
    'q20-s1': {
      goal: 'Find and tap one of every kind of tree in your Grove.',
      hint: 'One tree for each fruit, and the palm by the sea.',
    },
    'q20-s2': {
      goal: 'Take a photo of Mr Arbour’s board from the meadow.',
      hint: 'Use Photo mode. Zoom in on the far hill.',
    },
  },
  [
    scene(
      'q20-intro',
      [
        N('By the orchard stands Mr Arbour, with a picture of a tree.'),
        AR('Today we learn the trees of the Grove. From close up.', 'think'),
        AR('Tree number one…'),
        AR('Look! A larch!'),
        N('The tree in the picture is tall, thin and pointy.'),
        Y('There aren’t any of those here.'),
        AR('Correct. Tree number two…', 'think'),
        N('He flips the board. It’s the same tree!'),
        AR('Look! Another larch!'),
        AR('Your job: find every tree you DO have. Tap each one.'),
      ],
      [
        ask(
          4,
          m('maths', 'triangles', 'Your child matched the pointy tree to a triangle.', 'K.G.A.2'),
          [N('The larch is tall and pointy. What shape is it like?')],
          [
            best('A triangle', N('Yes! Pointy on top, wide at the bottom. A triangle!')),
            opt('A circle', N('A circle is round. The larch is pointy, like a triangle!')),
          ],
        ),
      ],
      [
        ch('three', 'Is tree three a larch?', [AR('…Let’s not rush ahead.')], { 'q20-asked-three': true }),
        ch('off-you-go', 'Off I go!', [AR('I shall wait here. With my larch.')]),
      ],
    ),
    scene(
      'q20-trees',
      [
        N('Run, swim, fly, power, stamina, sun, moon, heart.'),
        N('And the palm tree by the sea.'),
        N('Each tree rustles when you tap it. It feels noticed!'),
        N('There is no larch. You check twice.'),
      ],
      [
        act(
          2,
          m('science', 'parts of a tree', 'Your child named the parts of a tree: roots, trunk, branches and leaves.'),
          'edu:tap:tree-part:trunk',
          [
            N('Trees have roots under the ground, a trunk and leaves.'),
            N('Most have branches too. The palm tree doesn’t!'),
            N('(Point to the trunk. Now the leaves!)'),
          ],
        ),
      ],
    ),
    scene(
      'q20-far',
      [
        AR('Now the hard class. A tree from far away.', 'think'),
        N('He picks up his board and walks off. And off. Over the hill.'),
        N('A tiny Mr Arbour pops up on the far hill.'),
        AR('Can you see it?', 'happy'),
        N('The board looks tiny. It shows… a larch, of course.'),
        AR('Take a photo! I brought a sandwich!'),
      ],
      [
        ask(
          2,
          m('science', 'near and far', 'Your child noticed that faraway things look small and close things look big.', 'ELOF: Scientific Reasoning'),
          [N('Mr Arbour is far away. Does he look big or small?')],
          [
            best('Small', N('Yes! Far-away things look small. Close things look big.')),
            opt('Big', N('Look again: he’s tiny now! Far-away things look small.')),
          ],
        ),
      ],
    ),
    scene(
      'q20-photo',
      [
        N('Click! The photo is mostly sky.'),
        N('And one small, clear larch.'),
        N('Far away, Mr Arbour takes a big bite of sandwich.'),
        N('Munch.'),
      ],
      [
        ask(
          2,
          m('sel', 'waiting calmly', 'Your child thought about calm ways to wait.', 'CASEL: Self-management'),
          [N('Mr Arbour waited a long time. What helps when we wait?')],
          [
            best('Something calm, like humming or a snack', N('Yes! Humming, counting or a snack makes waiting easier.')),
            opt('Shouting “Hurry up!”', N('Shouting makes waiting harder. A calm hum helps.')),
          ],
        ),
      ],
    ),
    scene(
      'q20-complete',
      [
        N('Mr Arbour comes back, puffing.'),
        N('He looks at your photo for a long time.'),
        AR('Yes. That is a larch.', 'soft'),
        AR('Most people never look up at their trees. You tapped them all.', 'think'),
        AR('The larch just got you looking. Here. Grow your own!'),
        N('A small larch seed: a new tree for your Grove!'),
        AR('And a new button for your camera. Very surprising.', 'think'),
        N('A very big foot comes down from the sky. It wiggles its toes.'),
        N('Your Nubbin waves at it. The foot does not wave back.'),
        N('Up it goes. Nobody mentions it.'),
      ],
      [
        ask(
          5,
          m('science', 'what a seed needs to grow', 'Your child named what a seed needs to grow into a plant.', 'K-LS1-1'),
          [N('What does a seed need to grow into a tree?')],
          [
            best('Soil, water and sunshine', AR('Precisely. And a lot of patience.', 'happy')),
            opt('A hat', AR('Ha! No hat. Soil, water and sunshine.')),
          ],
        ),
      ],
    ),
  ],
);

// ================================================================ the Bean pack (Q21–Q30)

// ------------------------------------------------------------------ Q21
const Q21 = quest(
  'q21',
  'Bear Comes Too',
  {
    'q21-s1': {
      goal: 'Look for a clue by the pond.',
      hint: 'Search the reeds by the pond. Clues sparkle.',
    },
    'q21-s2': {
      goal: 'Follow the little wild Nubbin up the hill.',
      hint: 'It nests in the long grass on the western hill. Walk slowly!',
    },
    'q21-s3': {
      goal: 'Bring Bear back to Mr. Tweed.',
      hint: 'He’s on his rock by the pond. Use Give.',
    },
  },
  [
    scene(
      'q21-intro',
      [
        N('A man in a tweed jacket pats all his pockets.'),
        N('He looks in his hat. He looks under a sleeping duck!'),
        N('This is Mr. Tweed. He hardly ever says a whole sentence.'),
        TW('Hnn.', 'think'),
        N('He holds his hands apart. Then he hugs the empty air.'),
        Y('Something is missing?'),
        TW('Bear.', 'sad'),
        N('He makes two little ears with his fingers. A bear!'),
        N('Then he points down to the pond.'),
      ],
      [
        ask(
          6,
          m('sel', 'naming feelings', 'Your child named Mr. Tweed’s feeling when he lost his special toy.', 'CASEL: Social awareness'),
          [N('Mr. Tweed has lost his bear. How does he feel?')],
          [
            best('Sad', N('Yes. Losing a special toy feels sad. We can help.')),
            opt('Happy', N('Look at his droopy face. He feels sad. We can help him.')),
          ],
        ),
      ],
      [
        ch('help', 'I’ll help you look!', [TW('Mm!'), N('He shakes your hand with both hands. For a long time.')]),
        ch('describe', 'What does the bear look like?', [
          N('He shows you: small, brown, one chewed ear.'),
          N('And a very proud face. Somehow he shows that too.'),
        ]),
        ch(
          'sniff',
          'Ask your Nubbin to sniff for it.',
          [N('Your Nubbin sniffs his sleeve. Achoo! Off it trots.'), TW('Ah!')],
          { 'q21-sniffer': true },
        ),
      ],
    ),
    scene(
      'q21-scarf',
      [
        N('In the reeds, you find a tiny knitted scarf.'),
        N('It’s bear-sized. And a bit damp.'),
        N('Mr. Tweed hurries over and hugs it.'),
        TW('Ohh.', 'soft'),
        N('Then he sulks. His whole face folds up.'),
      ],
      [
        ask(
          1,
          m('literacy', 'describing words', 'Your child learned the describing word “damp”.', 'RL.1.4'),
          [N('The scarf is damp. What does damp mean?')],
          [
            best('A little bit wet', N('Yes! Damp means a little bit wet. Like a towel after a bath.')),
            opt('Very hot', N('Hot is warm, warm, warm. Damp means a little bit wet.')),
          ],
        ),
      ],
    ),
    scene(
      'q21-sulk',
      [
        N('Mr. Tweed sits on a rock and sulks.'),
        N('Bottom lip out. Arms folded. A big sulk.'),
        N('He peeks up the hill. Then away. Then up again.'),
        N('A wild Nubbin is waddling uphill, holding something brown!'),
        TW('Hm!', 'angry'),
        N('He stands up… remembers he’s sulking… and sits down.'),
        N('He waves you on. This is your job now.'),
      ],
      [
        ask(
          3,
          m('maths', 'positions: up and down', 'Your child used the position words up and down.', 'K.G.A.1'),
          [N('Is the wild Nubbin going up the hill, or down?')],
          [
            best('Up', N('Yes! Up, up, up the hill. Let’s follow!')),
            opt('Down', N('Look: it’s climbing. Up the hill!')),
          ],
        ),
      ],
    ),
    scene(
      'q21-nest',
      [
        N('At the top of the hill is a nest of grass.'),
        N('A wild Nubbin is fast asleep, cuddling a small brown bear.'),
        N('The bear has one chewed ear.'),
        N('Shh. Tiptoe, tiptoe.'),
      ],
      [
        notice(
          0,
          m('science', 'animals build nests', 'Your child heard that many animals build nests, changing the place around them.', 'K-ESS2-2'),
          [N('Lots of animals make nests to sleep in.'), N('Birds build nests from grass, twigs and moss.')],
        ),
      ],
      [
        ch('ease', 'Ease the bear out gently.', [
          N('The Nubbin sighs and lets go.'),
          N('You leave it a fruit to cuddle instead.'),
        ]),
        ch(
          'swap',
          'Swap the bear for the little scarf.',
          [N('The Nubbin puts the scarf on. Very smart! A fair swap.'), N('Mr. Tweed may have feelings about that.')],
          { 'q21-scarf-swap': true },
        ),
      ],
    ),
    scene(
      'q21-carry',
      [
        N('The bear is very light.'),
        N('Your Nubbin carries it, very carefully.'),
        N('Down by the pond, Mr. Tweed is still sulking.'),
        N('Your Nubbin hides the bear behind its back.'),
        N('The bear is wider than its back!'),
        Y('Ready? Surprise!', 'happy'),
      ],
      [
        ask(
          4,
          m('maths', 'wider and narrower', 'Your child compared widths to see if the bear could hide.', 'K.MD.A.2'),
          [N('The bear is wider than the Nubbin’s back. Is it hidden?')],
          [
            best('No, we can still see it!', N('Yes! Wider things poke out. Peekaboo, bear!')),
            opt('Yes, all hidden', N('Look: the bear sticks out on both sides. Wider things poke out!')),
          ],
        ),
      ],
    ),
    scene(
      'q21-complete',
      [
        N('Mr. Tweed sees the bear. His face opens up like a deckchair.'),
        TW('Bear! Oh, Bear!', 'happy'),
        N('He hugs it. He checks one ear. Then the other.'),
        N('He tucks it in his top pocket. Only its head peeks out.'),
        N('Your Nubbin looks at the bear, wishing.'),
        N('Mr. Tweed digs in his pockets… and his sock!'),
        N('He finds a teeny bear and puts it on your shoulder.'),
        TW('Bear.', 'soft'),
        N('That night, he sets two plates. One very small.'),
      ],
      [
        notice(
          7,
          m('sel', 'kindness goes round', 'Your child heard how one kind act led to another.', 'CASEL: Relationship skills'),
          [N('You helped Mr. Tweed. Then he was kind back.'), N('Kindness goes round and round!')],
        ),
      ],
    ),
  ],
);

// ------------------------------------------------------------------ Q22
const Q22 = quest(
  'q22',
  'The Armchair Ride',
  {
    'q22-s1': {
      goal: 'Help Mr. Tweed tie the armchair on top of his cart.',
      hint: 'Use rope from your bag. Tap each corner of the chair.',
    },
    'q22-s2': {
      goal: 'Clear the path before the cart gets there.',
      hint: 'Move the branch. Carry the sleepy Nubbin aside. Unhook the washing line.',
    },
  },
  [
    scene(
      'q22-shop',
      [
        N('At the market, Mr. Tweed buys a big green armchair.'),
        N('His hand cart is tiny. About the size of the cushion.'),
        N('He lifts one end. Then the other end. Still too big!'),
        TW('Hnn.', 'think'),
        N('Then, an idea! He points at the cart top and mimes a knot.'),
        TW('Rope!', 'happy'),
        N('He looks at you. You look like someone with rope.'),
      ],
      [
        ask(
          2,
          m('maths', 'will it fit? big and small', 'Your child worked out that a big thing won’t fit inside a small space.', 'K.MD.A.2'),
          [N('The chair is big. The cart is small.'), N('Will the chair fit inside the cart?')],
          [
            best('No, it’s too big', N('Right! Big things don’t fit in small spaces. So… on top!')),
            opt('Yes', N('Look: the chair is much bigger than the cart. It won’t fit inside!')),
          ],
        ),
      ],
      [
        ch('rope', 'Give him some rope.', [N('He bows. He ties a knot… round himself.')]),
        ch('doubt', 'Is this a good idea?', [TW('Mm.'), N('He nods firmly. You fetch rope.')], { 'q22-doubted': true }),
        ch('carry', 'We could just carry it.', [N('He looks at the long road. Then he shakes his head, kindly.')]),
      ],
    ),
    scene(
      'q22-tied',
      [
        N('The chair sits on the cart, tied at all four corners.'),
        N('And once, by mistake, to a lamp post!'),
        N('You untie the lamp post. Mr. Tweed climbs into the chair.'),
        N('He pushes the ground with a long stick. Off they roll!'),
      ],
      [
        ask(
          1,
          m('literacy', 'rhyming words', 'Your child found a word that rhymes with “rope”.', 'RF.K.2'),
          [N('Which word rhymes with rope?')],
          [
            best('Soap', N('Yes! Rope, soap, hope. They rhyme!')),
            opt('Chair', N('Chair rhymes with bear! Rope rhymes with soap.')),
          ],
        ),
      ],
    ),
    scene(
      'q22-road',
      [
        N('The cart wobbles down the lane.'),
        N('Mr. Tweed steers by leaning. He waves at the birds.'),
        TW('Ooh.', 'happy'),
        N('Ahead: a branch, a sleeping Nubbin, and a low washing line!'),
        N('Run ahead and clear the way!'),
        N('Now the lane goes downhill. The cart goes faster. Whee!'),
        N('Mr. Tweed lifts his feet. As if that helps!'),
      ],
      [
        ask(
          5,
          m('science', 'rolling down slopes', 'Your child noticed that things roll faster down a slope.'),
          [N('Why does the cart go faster now?')],
          [
            best('It’s going downhill', N('Yes! Things roll faster down a slope.')),
            opt('It’s hungry', N('Ha! Carts don’t eat. Going downhill makes things roll faster.')),
          ],
        ),
      ],
      [
        ch('sprint', 'Run ahead!', [N('You run. Mr. Tweed hums a little driving song.')]),
        ch(
          'nubbin',
          'Send your Nubbin to wake the sleeper.',
          [N('Your Nubbin pokes it. It rolls over. Still asleep!')],
          { 'q22-nubbin-help': true },
        ),
      ],
    ),
    scene(
      'q22-arrive',
      [
        N('The cart stops at his gate. Bonk!'),
        N('His hat flies off. He catches it with his foot!'),
        N('Nothing fell off. He checks himself, the chair and the stick.'),
        TW('Ha!', 'happy'),
      ],
      [
        ask(
          2,
          m('maths', 'position: beside', 'Your child used the position word “beside”.', 'K.G.A.1'),
          [N('Where did you put the sleepy Nubbin, to keep it safe?')],
          [
            best('Beside the path', N('Yes! Beside the path, out of the way. Still snoring.')),
            opt('In the middle of the path', N('The cart would bump it! We put it beside the path.')),
          ],
        ),
      ],
    ),
    scene(
      'q22-complete',
      [
        N('Mr. Tweed looks at the chair. Then at his little door.'),
        N('The chair won’t fit through! He measures with his hands. Three times.'),
        TW('Hnn.', 'sad'),
        N('He pats the chair and pushes it to you. It’s yours!'),
        N('He pats the cart too. Yours as well.'),
        N('Then he sits outside on a small kitchen chair, in the sun.'),
        N('He pats the space beside him. There is no space.'),
        N('You sit on the wall. You watch the lane together.'),
      ],
      [
        notice(
          5,
          m('sel', 'coping with disappointment', 'Your child heard how Mr. Tweed felt let down, then made a new plan.', 'CASEL: Self-management'),
          [N('Mr. Tweed was disappointed. That’s OK.'), N('Then he made a new plan: a small chair in the sun.')],
        ),
      ],
    ),
  ],
);

// ------------------------------------------------------------------ Q23
const Q23 = quest(
  'q23',
  'Pumpkin Head',
  {
    'q23-s1': {
      goal: 'Calm the wandering pumpkin.',
      hint: 'Tap the pumpkin and choose Pet.',
    },
    'q23-s2': {
      goal: 'Free the Nubbin with three gentle wiggles.',
      hint: 'Tap when the pumpkin glows. Tap, tap, tap. No pulling!',
    },
  },
  [
    scene(
      'q23-patch',
      [
        N('It’s harvest time. The pumpkins are big and orange.'),
        N('One pumpkin is moving! Left. Right. Bump! “Mff.”'),
        N('Mr. Tweed knocks on it. Knock, knock.'),
        N('The pumpkin knocks back!'),
        TW('Oh!', 'shock'),
        N('Two little feet stick out. A Nubbin climbed in, and it’s stuck!'),
        N('Mr. Tweed grabs the stalk, ready to pull hard.'),
      ],
      [
        notice(
          0,
          m('science', 'how pumpkins grow', 'Your child heard that pumpkins grow on vines and are full of seeds.'),
          [N('Pumpkins grow on long, twisty vines, along the ground.'), N('Inside, they’re full of seeds!')],
        ),
      ],
      [
        ch('stop', 'Stop! Not like that.', [N('He freezes. He lets go of the stalk.'), TW('Mm.')]),
        ch('watch', 'Watch which way it wiggles.', [N('Left, right, left. The Nubbin is trying to wiggle out!')]),
      ],
      'stop',
    ),
    scene(
      'q23-calm',
      [
        N('You pat the pumpkin. Pat, pat.'),
        N('It stops wandering and sits. Thump.'),
        N('From inside comes a happy hum.'),
        N('Mr. Tweed listens with his ear. He nods.'),
      ],
      [
        ask(
          2,
          m('sel', 'gentle hands', 'Your child chose gentle pats and a calm voice to help a scared creature.', 'CASEL: Social awareness'),
          [N('The Nubbin was stuck and scared. What helped?')],
          [
            best('Gentle pats and a calm voice', N('Yes! Gentle and calm helps someone feel safe.')),
            opt('Pulling hard', N('Pulling could hurt and scare it. Gentle and calm helps.')),
          ],
        ),
      ],
    ),
    scene(
      'q23-wiggle',
      [
        N('Mr. Tweed holds up three fingers.'),
        N('He mimes: wiggle, wiggle, wiggle… pop!'),
        N('You put both hands on the pumpkin.'),
        N('Inside, the Nubbin goes still and listens.'),
        TW('One…', 'think'),
        N('He waves his arms like a band leader. The Nubbin hums along.'),
        Y('Gently. On the beat.', 'soft'),
      ],
      [
        act(
          6,
          m('maths', 'count to 3', 'Your child counted three gentle wiggles.', 'K.CC.B.4'),
          'edu:count:wiggles:3',
          [N('(Wiggle together! Count each one.)'), N('One… two… three!')],
        ),
      ],
    ),
    scene(
      'q23-pop',
      [
        N('On wiggle three… pop! Out slides the Nubbin.'),
        N('Seeds fly everywhere!'),
        N('It is orange up to its elbows. It smells lovely.'),
        N('It looks at the empty pumpkin. Its lip wobbles.'),
      ],
      [
        ask(
          2,
          m('art', 'colour mixing: orange', 'Your child named orange and heard that red and yellow mix to make it.'),
          [N('What colour is the Nubbin now?')],
          [
            best('Orange', N('Yes! Orange. Red and yellow paint mixed together make orange.')),
            opt('Purple', N('Purple is like grapes. The Nubbin is orange, like the pumpkin!')),
          ],
        ),
      ],
    ),
    scene(
      'q23-complete',
      [
        N('The Nubbin climbs straight back into the pumpkin. Head first!'),
        N('Mr. Tweed lifts it off and scoops it clean with a spoon.'),
        N('He finds a butter knife in his sock. He cuts two eyeholes.'),
        N('He pops it on the Nubbin, like a hat.'),
        N('It fits! The Nubbin spins round, delighted.'),
        N('Mr. Tweed tries one on too. Bonk! Into a fence post.'),
        TW('Mff.'),
        N('It takes three tugs to get it off. He’s orange to the eyebrows!'),
        N('He gives you a smaller pumpkin hat with a curly stalk.'),
        N('Some creatures just like a snug place to be.'),
      ],
      [
        ask(
          5,
          m('maths', 'bigger and smaller', 'Your child compared head sizes to see why one hat fitted and one didn’t.', 'K.MD.A.2'),
          [N('The pumpkin hat fits the Nubbin, but not Mr. Tweed. Whose head is bigger?')],
          [
            best('Mr. Tweed’s', N('Yes! His head is bigger, so the little hat is too tight.')),
            opt('The Nubbin’s', N('The Nubbin is small! Mr. Tweed’s head is bigger.')),
          ],
        ),
      ],
    ),
  ],
  'Sprout leaves out the “pull” choice in q23-patch (pulling a stuck creature is not a kind choice); defaultChoice is “stop”.',
);

// ------------------------------------------------------------------ Q24
const Q24 = quest(
  'q24',
  'Test Day',
  {
    'q24-s1': {
      goal: 'Move your Nubbin’s paper three times, so Buttons can’t copy.',
      hint: 'When Buttons leans over, tap your Nubbin’s paper to move it.',
    },
    'q24-s2': {
      goal: 'At break, help Buttons learn shapes. Then both Nubbins pass!',
      hint: 'Practise circles with Buttons on the chalkboard.',
    },
  },
  [
    scene(
      'q24-desks',
      [
        IN('Test day! Shapes, colours, and counting to five!', 'happy'),
        N('Your Nubbin sits at one desk. Buttons, Mr. Tweed’s Nubbin, at the other.'),
        N('Buttons wears a tiny tweed waistcoat.'),
        IN('Grown-ups may stay. Quietly. Mr. Tweed, that means you.'),
        N('He zips his lips and puts the key in his pocket.'),
        N('Your Nubbin draws a perfect circle.'),
        N('Buttons draws nothing. Buttons leans… slowly… to the left.'),
      ],
      [
        ask(
          5,
          m('maths', 'circles', 'Your child picked out a circle from everyday shapes.', 'K.G.A.2'),
          [N('Your Nubbin drew a circle. Which of these is a circle?')],
          [
            best('A round plate', N('Yes! A plate is round, like a circle.')),
            opt('A square window', N('A window has four corners. A plate is round, like a circle.')),
          ],
        ),
      ],
      [
        ch('shield', 'Help your Nubbin cover its paper.', [
          N('Your Nubbin hides its paper. Buttons leans more. Buttons’ chair goes creak!'),
        ]),
        ch(
          'share',
          'Let Buttons look. Sharing is nice.',
          [IN('Eyes on your own paper, please, Buttons.'), N('Buttons sits up and tries to whistle. Nubbins can’t whistle.')],
          { 'q24-shared': true },
        ),
        ch('glance', 'Look at Mr. Tweed.', [N('He looks at the ceiling. As if he’s never met Buttons.')]),
      ],
    ),
    scene(
      'q24-shuffled',
      [
        N('Left. Right. Under the desk!'),
        N('Buttons follows the paper with Buttons’ whole body…'),
        N('And falls off its chair. Bump!'),
        N('Mr. Tweed falls over too.'),
        IN('Buttons! Are you all right?', 'shock'),
        N('Buttons is fine. But Buttons’ paper is still empty.'),
      ],
      [
        notice(
          5,
          m('sel', 'doing your own work', 'Your child heard that in a test we each do our own work, and ask for help afterwards.', 'CASEL: Responsible decision-making'),
          [IN('In a test, we each do our own work.'), IN('If something is tricky, we can ask for help after.')],
        ),
      ],
    ),
    scene(
      'q24-break',
      [
        N('Buttons looks at its empty paper. Its ears droop.'),
        N('Mr. Tweed’s ears droop too, somehow.'),
        TW('Hnn…', 'sad'),
        IN('Break time! You may help each other now. That’s learning.'),
        Y('Right, Buttons. Circles first.'),
        N('Buttons looks up at you. It has never drawn a circle.'),
      ],
      [
        act(
          5,
          m('maths', 'drawing a circle', 'Your child drew a circle in the air, going round and back to the start.', 'K.G.A.2'),
          'edu:draw:shape:circle',
          [N('(Draw a circle in the air with your finger.)'), N('Round and round, back to the start. A circle!')],
        ),
      ],
    ),
    scene(
      'q24-pass',
      [
        IN('Two passes! Well done!', 'happy'),
        IN('Buttons, that’s the roundest circle I’ve ever seen. Nearly.'),
        N('Buttons holds its paper up to Mr. Tweed.'),
        N('Both arms. Very proud.'),
      ],
      [
        ask(
          3,
          m('sel', 'feeling proud', 'Your child named the feeling of being proud after working hard.', 'CASEL: Self-awareness'),
          [N('How does Buttons feel?')],
          [
            best('Proud', N('Yes! Proud means happy about something you worked hard on.')),
            opt('Bored', N('Look at those arms up high! Buttons feels proud.')),
          ],
        ),
      ],
    ),
    scene(
      'q24-complete',
      [
        N('Mr. Tweed lifts Buttons up high and walks round the room.'),
        IN('Mr. Tweed. Please put the Nubbin down.'),
        N('He shakes everyone’s hand. Even Mrs Inkwell’s.'),
        IN('I did not offer it.'),
        IN('These two learn better together.', 'soft'),
        N('Buttons and your Nubbin draw circles on each other’s papers.'),
        N('Mr. Tweed holds up one finger. Hopeful.'),
        IN('…One paper. Just one.', 'soft'),
        N('He squeezes into a tiny desk. He draws a circle, tongue out.'),
        N('It’s a wobbly circle. Buttons claps anyway.'),
      ],
      [
        act(
          4,
          m('art', 'colour patterns', 'Your child coloured circles in a red, blue pattern.'),
          'edu:colour:circles:red-blue',
          [IN('Let’s colour our circles. Red, blue, red, blue…'), N('(What comes next? Red!)')],
        ),
      ],
    ),
  ],
);

// ------------------------------------------------------------------ Q25
const Q25 = quest(
  'q25',
  'The High Ledge',
  {
    'q25-s1': {
      goal: 'Help Mr. Tweed down from the high ledge.',
      hint: 'Talk him down step by step, or ask a Swim Nubbin to show him.',
    },
    'q25-s2': {
      goal: 'Build a low diving board at the pond.',
      hint: 'Put the plank on the flat rock. Tap three times to hammer it.',
    },
  },
  [
    scene(
      'q25-ledge',
      [
        N('Mr. Tweed is at the waterfall in a stripy swimsuit.'),
        N('He points at the high ledge. He mimes a perfect dive.'),
        TW('Hup!', 'happy'),
        N('He climbs up, up, up. At the top, he looks down.'),
        N('He freezes like a statue. A bird lands on his head.'),
        N('Three little Nubbins squeeze past his ankles. Splash, splash, splash!'),
        TW('Hnn.', 'shock'),
        N('He wiggles two fingers backwards. He wants to come down.'),
      ],
      [
        ask(
          7,
          m('sel', 'feeling scared is OK', 'Your child heard that everyone feels scared sometimes, and a friend helps.', 'CASEL: Self-awareness'),
          [N('Mr. Tweed is scared. Is it OK to feel scared?')],
          [
            best('Yes, everyone feels scared sometimes', N('Yes. Everyone does. A friend nearby helps.')),
            opt('No', N('It is OK! Everyone feels scared sometimes. A friend nearby helps.')),
          ],
        ),
      ],
      [
        ch(
          'coax',
          'Talk him down, one step at a time.',
          [Y('You’re OK! One foot back. Just one.'), TW('Mm…')],
          { 'q25-way': 'coax' },
        ),
        ch(
          'show',
          'Ask a Swim Nubbin to show him.',
          [N('Your Nubbin looks at the water. Then at you. Yes!')],
          { 'q25-way': 'show' },
        ),
      ],
    ),
    scene(
      'q25-down',
      [
        N('Step by step, or splash by splash, he gets down.'),
        N('The last bit is mostly sliding. Wheee!'),
        N('He lands in the shallow water. Splosh!'),
        N('The bird is still on his head.'),
        TW('Mm!', 'happy'),
      ],
      [
        ask(
          0,
          m('maths', 'high and low', 'Your child used the words high and low.', 'K.G.A.1'),
          [N('The ledge is high. The water is…')],
          [
            best('Low', N('Yes! High up top, low down below.')),
            opt('Higher', N('The water is down at the bottom. It is low!')),
          ],
        ),
      ],
    ),
    scene(
      'q25-board',
      [
        N('Mr. Tweed dries off with a tiny towel.'),
        N('He looks at the high ledge. Then at the low rock by the pond.'),
        N('He mimes: saw, hammer, bounce. A low diving board!'),
        TW('Small.', 'happy'),
        N('Your Nubbin bounces on the spot. It wants to go first.'),
        N('Mr. Tweed pulls a plank out of his towel!'),
      ],
      [
        notice(
          2,
          m('health', 'water safety', 'Your child heard that a grown-up checks the water before anyone jumps in.'),
          [N('Before jumping in, a grown-up checks the water.'), N('Is it deep enough? Is it safe? Then splash!')],
        ),
      ],
    ),
    scene(
      'q25-complete',
      [
        N('The diving board is low and bouncy. A bit crooked. Perfect!'),
        N('Your Nubbin goes first. Bounce, bounce, SPLASH!'),
        N('Mr. Tweed walks to the end. He looks down. He freezes.'),
        N('The water is just below his toes.'),
        N('You wait. Your Nubbin waits. The bird comes back.'),
        N('He holds his nose, shuts his eyes… and steps off. Plop!'),
        N('The teeny bear on your shoulder covers its eyes. Then it peeks.'),
        TW('Ha!', 'happy'),
        N('He climbs out and does it again, and again, and again!'),
      ],
      [
        act(
          7,
          m('maths', 'count to 10', 'Your child counted ten jumps, clapping for each one.', 'K.CC.A.1'),
          'edu:count:jumps:10',
          [N('(Count his jumps! Clap for each one.)'), N('One, two, three… all the way to ten!')],
        ),
      ],
    ),
  ],
);

// ------------------------------------------------------------------ Q26
const Q26 = quest(
  'q26',
  'The Bench Sandwich',
  {
    'q26-s1': {
      goal: 'Hand Mr. Tweed the right things, in the right order.',
      hint: 'Watch his hands. Sawing means bread. Shaking means pepper.',
    },
    'q26-s2': {
      goal: 'Spread the picnic blanket and share the sandwich with every Nubbin.',
      hint: 'Put the blanket on the grass, then feed each Nubbin.',
    },
  },
  [
    scene(
      'q26-bench',
      [
        N('Mr. Tweed sits on his bench by the pond.'),
        N('He opens his coat. Out comes lunch!'),
        N('Bread from his sleeve. Lettuce from his pocket.'),
        N('Jam from near his knee. A tomato from under his hat!'),
        N('Butter from his top pocket. Of course.'),
        N('He spreads jam… on the lettuce.'),
        TW('Hm?', 'think'),
        N('Something has gone wrong. He doesn’t know what.'),
      ],
      [
        notice(
          1,
          m('health', 'washing hands before eating', 'Your child heard that we wash our hands before we eat.'),
          [N('Wait! Before lunch, we wash our hands.'), N('(Pretend to wash: soap, rub, rinse, dry!)')],
        ),
      ],
      [
        ch('pass', 'Offer to pass him things.', [N('He nods and holds out his hand, like a doctor.')]),
        ch(
          'taste',
          'Try the jam lettuce.',
          [N('Crunchy, sweet… and wrong!'), N('Mr. Tweed nods. He knew it.')],
          { 'q26-jam-lettuce': true },
        ),
        ch('jam', 'Let your Nubbin have the jam.', [
          N('Your Nubbin puts its whole face in the jar.'),
          N('Mr. Tweed finds another jar near his other knee.'),
        ]),
      ],
    ),
    scene(
      'q26-sandwich',
      [
        N('Bread. Butter. Lettuce. Tomato. Pepper. Bread on top.'),
        N('Pat, pat. A sandwich!'),
        N('Mr. Tweed holds it up, like treasure.'),
        N('A duck lands on the bench. It looks at the sandwich.'),
        N('The duck flies off with the jam lettuce. Fair enough.'),
        TW('Ahh.', 'happy'),
      ],
      [
        ask(
          1,
          m('literacy', 'first, next, last', 'Your child put the steps of making a sandwich in order.', 'RL.K.3'),
          [N('What goes on first, and what goes on last?')],
          [
            best('Bread first, bread last', N('Yes! Bread first, fillings next, bread last.')),
            opt('Pepper first', N('Pepper would fall off! Bread first, fillings next, bread last.')),
          ],
        ),
      ],
    ),
    scene(
      'q26-share',
      [
        N('He’s about to bite. Then he sees: you have no sandwich.'),
        N('Your Nubbin has none. Wild Nubbins behind the bench have none.'),
        N('Mr. Tweed sighs, all the way from his boots.'),
        N('He takes out a ruler. He cuts the sandwich into neat squares.'),
        TW('Picnic.'),
        N('He pulls a checked blanket out of his coat. It’s bigger than the coat!'),
      ],
      [
        ask(
          3,
          m('maths', 'quarters', 'Your child found that two cuts make four equal squares, called quarters.', '1.G.A.3'),
          [N('One cut down, one cut across. How many squares?'), N('(Draw it in the air: down… across!)')],
          [
            best('Four', N('Yes! Four squares the same size. Each one is a quarter.')),
            opt('Two', N('Let’s count: one, two at the top. Three, four at the bottom. Four!')),
          ],
        ),
      ],
    ),
    scene(
      'q26-complete',
      [
        N('Everyone gets a square.'),
        N('Mr. Tweed takes the last one. Mostly crust. He loves it.'),
        N('He has never shared his lunch before.'),
        N('The duck comes back. Mr. Tweed gives it half his crust.'),
        N('The Nubbins snuggle in a sleepy pile on the blanket.'),
        N('Mr. Tweed goes to fold it. Then he stops.'),
        N('He leaves it there, for the sleeping Nubbins.'),
        N('The blanket is yours now. The Nubbins decided.'),
      ],
      [
        ask(
          2,
          m('sel', 'sharing fairly', 'Your child talked about why sharing so everyone gets some is fair.', 'CASEL: Social awareness'),
          [N('Everyone got a square. Was that fair?')],
          [
            best('Yes! Everyone got some', N('Yes. Sharing so everyone gets some is fair.')),
            opt('No', N('Everyone got one square each. That’s fair sharing!')),
          ],
        ),
      ],
    ),
  ],
);

// ------------------------------------------------------------------ Q27
const Q27 = quest(
  'q27',
  'The Smudged Painting',
  {
    'q27-s1': {
      goal: 'Bring three Nubbins to the hall and line them up like the painting.',
      hint: 'Mr. Tweed’s chalk marks show where each one sits.',
    },
    'q27-s2': {
      goal: 'Take a photo that matches the painting.',
      hint: 'Use the self-timer. Sit in the empty chair.',
    },
    'q27-s3': {
      goal: 'Hang the frame back up before the Warden comes.',
      hint: 'Tap the hook to hang it. Tap again to make it straight.',
    },
  },
  [
    scene(
      'q27-hall',
      [
        N('The Keepers’ Hall smells of polish.'),
        N('On the wall: a painting of two old Keepers and three Nubbins.'),
        WP('Mr. Tweed is cleaning the painting. Touch only the frame!'),
        N('The Warden leaves. Mr. Tweed dabs it. His nose twitches.'),
        TW('Ah… ah… ACHOO!', 'shock'),
        N('The wet cloth flies onto the painting. Splat!'),
        N('Now the two Keepers are one wide Keeper. With four ears!'),
        N('He tries to fix it. Now there are glasses too.'),
        TW('Oh.', 'shock'),
      ],
      [
        ask(
          4,
          m('health', 'catching sneezes', 'Your child learned to sneeze into a tissue or elbow to keep germs in.'),
          [N('When we sneeze, what should we do?')],
          [
            best('Sneeze into a tissue or my elbow', N('Yes! That keeps germs in. Bless you!')),
            opt('Sneeze on the painting', N('Oops! Into a tissue or your elbow keeps germs in.')),
          ],
        ),
      ],
      [
        ch('fix', 'We can fix this. Probably.', [N('He grabs your hand. Thank you!')]),
        ch(
          'tell',
          'We should tell the Warden.',
          [N('He nods slowly. Then he points: try first, then tell.')],
          { 'q27-wanted-to-tell': true },
        ),
      ],
    ),
    scene(
      'q27-lined',
      [
        N('Three Nubbins in a row. Sort of.'),
        N('One faces the wrong way. One is asleep.'),
        N('Mr. Tweed draws a plan in chalk: two chairs, three Nubbins.'),
        N('And one camera. Yours!'),
      ],
      [
        ask(
          2,
          m('maths', 'adding within 5', 'Your child added two Keepers and three Nubbins to make five.', 'K.OA.A.2'),
          [N('Two Keepers and three Nubbins. How many in the picture?')],
          [
            best('Five', N('Yes! Two and three make five.')),
            opt('Four', N('Count on your fingers: two… then three more. One, two, three, four, five!')),
          ],
        ),
      ],
    ),
    scene(
      'q27-pose',
      [
        N('Mr. Tweed hangs a dark curtain. He sets out two chairs.'),
        N('He sticks on a grey moustache. He gives you half!'),
        N('He sits very still, looking far away. Very serious.'),
        N('The Nubbins copy him. One falls asleep.'),
        TW('Shh.'),
        Y('Everybody, hold still…'),
      ],
      [
        act(
          5,
          m('health', 'body control: keeping still', 'Your child practised freezing like a statue and then relaxing.', 'ELOF: Perceptual, Motor, and Physical Development'),
          'edu:freeze:statue',
          [N('(Let’s practise! Freeze like a statue.)'), N('Hold it… hold it… now wiggle!')],
        ),
      ],
    ),
    scene(
      'q27-shot',
      [
        N('Click!'),
        N('The photo looks serious, grand, and nearly right.'),
        N('One Nubbin is yawning.'),
        N('But if you squint, so was one in the painting!'),
      ],
      [
        notice(
          1,
          m('art', 'paintings and photos', 'Your child heard the difference between a painting and a photo.'),
          [N('A painting is made with brushes and paint.'), N('A photo is made with a camera. Click!')],
        ),
      ],
    ),
    scene(
      'q27-swap',
      [
        N('Footsteps! The Warden is early!'),
        N('Mr. Tweed hides the smudged painting up his jacket.'),
        N('You slide the photo in the frame. It’s a bit too small.'),
        N('He stuffs the gap with his hankie.'),
        N('He hangs it. It’s crooked. He fixes it. Now the other side drops!'),
        TW('Quick!', 'shock'),
        N('The door handle turns… slowly…'),
      ],
      [
        ask(
          2,
          m('maths', 'rectangles', 'Your child named the frame’s shape as a rectangle.', 'K.G.A.2'),
          [N('What shape is the frame?')],
          [
            best('A rectangle', N('Yes! Four sides, four corners. A rectangle.')),
            opt('A circle', N('A circle is round. The frame has four corners: a rectangle!')),
          ],
        ),
      ],
    ),
    scene(
      'q27-complete',
      [
        N('The Warden looks at the picture. For a long, long time.'),
        WP('It looks… brighter. And that Keeper has your chin.', 'think'),
        N('Mr. Tweed looks at the ceiling. Half a moustache is still on his lip.'),
        N('Behind his back, he gives you a pile of empty frames.'),
        N('The teeny bear hides in your collar until the Warden goes.'),
      ],
      [
        ask(
          3,
          m('sel', 'owning up to accidents', 'Your child thought about telling the truth after an accident.', 'CASEL: Responsible decision-making'),
          [N('Something went wrong by accident. What is the best thing to do?')],
          [
            best('Tell the truth', N('Yes. Accidents happen. Telling the truth helps fix them.')),
            opt('Hide it', N('Hiding feels worse inside. Telling the truth helps fix it.')),
          ],
        ),
      ],
      [
        ch(
          'confess',
          'Tell her: it’s a photo. There was a sneeze.',
          [
            WP('A sneeze. Of course.'),
            WP('Did the moustache sneeze too?'),
            WP('You know what? I like this one better. It stays.'),
            N('Mr. Tweed gives her the old painting, rolled up.'),
          ],
          { 'q27-confessed': true },
        ),
        ch(
          'quiet',
          'Say nothing. Just smile.',
          [WP('Well. Good work, both of you.'), N('The door closes. Mr. Tweed breathes out at last.')],
          { 'q27-confessed': false },
        ),
      ],
    ),
  ],
);

// ------------------------------------------------------------------ Q28
const Q28 = quest(
  'q28',
  'The Yellow Room',
  {
    'q28-s1': {
      goal: 'Carry every Nubbin, and anything precious, out of the cottage.',
      hint: 'Three Nubbins are napping inside. His bear is on the shelf.',
    },
    'q28-s2': {
      goal: 'Stand far back, behind the hedge.',
      hint: 'Run to the far side of the hedge before the fizz runs out.',
    },
  },
  [
    scene(
      'q28-plan',
      [
        N('Mr. Tweed’s room is the colour of old porridge.'),
        N('A card on the shelf says: TEA. SATURDAY. EVERYONE.'),
        N('He never sent it.'),
        N('He has a tin of yellow paint and a tiny brush.'),
        N('He paints one stroke. He looks at four big walls.'),
        TW('Hnn.', 'sad'),
        N('He picks up a firework. A big idea!'),
        N('He mimes: firework in the paint… BOOM! Paint everywhere!'),
        TW('Boom.', 'happy'),
        N('Your Nubbin hides behind your legs.'),
      ],
      [
        notice(
          4,
          m('health', 'fireworks are for grown-ups', 'Your child heard that fireworks are only for grown-ups, and everyone stands far back.'),
          [N('Fireworks are only for grown-ups.'), N('Even grown-ups stand far, far back.')],
        ),
      ],
      [
        ch(
          'no',
          'Absolutely not!',
          [N('He nods kindly… and keeps unwrapping.'), N('But first, he mimes carrying Nubbins outside. Safety first!')],
          { 'q28-objected': true },
        ),
        ch('outside', 'OK. But everyone goes outside first.', [N('He shakes your hand. He wants to keep his eyebrows too.')]),
      ],
      'outside',
    ),
    scene(
      'q28-cleared',
      [
        N('Three sleepy Nubbins on the grass. One has a yellow stripe.'),
        N('The bear sits on the gate post, watching.'),
        N('The room is empty. Just Mr. Tweed, the paint and the firework.'),
        N('He tucks his trousers into his socks. Safety clothes!'),
      ],
      [
        ask(
          1,
          m('maths', 'adding one more', 'Your child added one bear to three Nubbins to make four.', 'K.OA.A.2'),
          [N('Three Nubbins, and one bear. How many are safe outside?')],
          [
            best('Four', N('Yes! Three and one more makes four. All safe!')),
            opt('Three', N('Don’t forget the bear! Three and one more makes four.')),
          ],
        ),
      ],
    ),
    scene(
      'q28-fuse',
      [
        N('He puts the firework in the tin. He lights it. Fizz!'),
        N('He watches it fizz. And fizz.'),
        N('You wave through the window. He waves back.'),
        N('You point at the fizz. He looks at it. Then at the door.'),
        TW('Oh!', 'shock'),
        N('He runs. You run. Your Nubbin is already behind the hedge!'),
      ],
      [
        ask(
          0,
          m('literacy', 'sound words', 'Your child picked out a sound word like “fizz”.', 'RL.1.4'),
          [N('Fizz! That word sounds like the noise. Which is a sound word too?')],
          [
            best('Boom', N('Yes! Boom, fizz, splash. Words that sound like noises!')),
            opt('Chair', N('A chair doesn’t make a noise. Boom is a sound word!')),
          ],
        ),
      ],
    ),
    scene(
      'q28-complete',
      [
        N('FWUMP! Every window turns yellow.'),
        N('A little yellow cloud puffs from the chimney.'),
        N('You peek inside. Walls, ceiling, clock: all yellow!'),
        N('One porridge square is left, where a picture hung.'),
        TW('Ha!', 'happy'),
        N('He gives you a big, wide brush for one big swish.'),
        N('Then he shakes his head at the firework. No more booms.'),
        N('You take the card down the lane. You show everyone.'),
        N('On Saturday, half the lane comes for tea in the yellow room.'),
        N('Mr. Tweed beams in the doorway, holding the teapot.'),
      ],
      [
        ask(
          2,
          m('art', 'naming colours', 'Your child named yellow and found other yellow things.'),
          [N('What colour is the room now?')],
          [
            best('Yellow', N('Yes! Yellow, like the sun. (Can you see something yellow near you?)')),
            opt('Green', N('Not green! Yellow, like the sun and bananas.')),
          ],
        ),
        ask(
          8,
          m('sel', 'mixed feelings', 'Your child heard that we can feel happy and shy at the same time.', 'CASEL: Self-awareness'),
          [N('Lots of guests! How does Mr. Tweed feel?')],
          [
            best('Happy, and a bit shy', N('Yes! We can feel two things at once. Happy and shy.')),
            opt('Cross', N('Look at his big smile. Happy, and a little bit shy.')),
          ],
        ),
      ],
    ),
  ],
  'Sprout leaves out the “Can I light it?” choice in q28-plan (a child should never be offered lighting a firework); defaultChoice is “outside”. ' +
    'Mr. Tweed, a grown-up, handles the firework with everyone well back, and in the end puts fireworks away for good.',
);

// ------------------------------------------------------------------ Q29
const Q29 = quest(
  'q29',
  'Mind the Egg',
  {
    'q29-s1': {
      goal: 'Put Odette’s egg down somewhere flat.',
      hint: 'Find flat ground near your cottage. Not on the slope!',
    },
    'q29-s2': {
      goal: 'Catch the rolling egg before it reaches the stream.',
      hint: 'Get in front of it and wait. Mr. Tweed’s hat can catch it.',
    },
    'q29-s3': {
      goal: 'Give the egg back to Odette at sunset.',
      hint: 'Odette waits at your gate. Carry the egg and use Give.',
    },
  },
  [
    scene(
      'q29-handover',
      [
        OD('Hello! I’m Odette, from over the hill.', 'happy'),
        OD('Could you mind my egg this afternoon?'),
        N('She gives you a speckled egg. It’s warm.'),
        OD('It likes to roll. Keep it on something flat. Back by sunset!'),
        N('Off she goes. The egg sits still… then wobbles.'),
        N('Mr. Tweed leans over the fence. He mimes rocking a baby.'),
        TW('Hm.', 'think'),
      ],
      [
        notice(
          2,
          m('science', 'parents keep eggs warm', 'Your child heard that bird parents sit on eggs to keep them warm.', '1-LS1-2'),
          [N('Bird mums and dads sit on their eggs to keep them warm.'), N('Warm eggs can hatch into babies!')],
        ),
      ],
      [
        ch('promise', 'I’ll take great care of it.', [N('Mr. Tweed salutes the egg. The egg wobbles.')]),
        ch(
          'ask',
          'Mr. Tweed, will you help?',
          [N('He takes off his hat and holds it like a nest. Ready!')],
          { 'q29-tweed-help': true },
        ),
      ],
    ),
    scene(
      'q29-roll',
      [
        N('You put the egg down. It sits.'),
        N('Mr. Tweed lies flat to check. Is the ground level? Yes!'),
        N('Thumbs up!'),
        N('Then a Nubbin sneezes. ACHOO! And the egg rolls away!'),
      ],
      [
        ask(
          1,
          m('science', 'rolling on slopes and flat ground', 'Your child worked out that round things roll more on a slope than on flat ground.'),
          [N('Where does an egg roll more: on a slope, or on flat ground?')],
          [
            best('On a slope', N('Yes! Round things roll down slopes. Flat ground keeps them still.')),
            opt('On flat ground', N('Flat ground keeps it still. On a slope, it rolls away!')),
          ],
        ),
      ],
    ),
    scene(
      'q29-chase',
      [
        N('The egg rolls down the path. Faster and faster!'),
        N('It bumps a post. It goes left. Over the bridge!'),
        N('Mr. Tweed jumps the fence. Mostly.'),
        TW('Egg!', 'shock'),
        N('Past the dojo. Three Nubbins bow as it rolls by.'),
        N('Mr. Tweed takes a shortcut through a hedge. He comes out ahead!'),
        N('He is wearing most of the hedge.'),
      ],
      [
        act(
          4,
          m('literacy', 'first, next, last', 'Your child retold the egg’s journey in order: first, next, last.', 'RL.K.3'),
          'edu:order:egg-route:post-bridge-dojo',
          [N('(Say where the egg went, in order.)'), N('First the post. Next the bridge. Last the dojo!')],
        ),
      ],
    ),
    scene(
      'q29-caught',
      [
        N('You dive. Mr. Tweed dives.'),
        N('The egg bounces off your hands… off his head…'),
        N('…and lands in his hat. Plop!'),
        TW('Ha!', 'happy'),
      ],
      [
        notice(
          3,
          m('sel', 'teamwork', 'Your child heard how working together caught the egg.', 'CASEL: Relationship skills'),
          [N('You and Mr. Tweed did it together.'), N('That’s teamwork!')],
        ),
      ],
    ),
    scene(
      'q29-afternoon',
      [
        N('All afternoon, nobody puts the egg down.'),
        N('Mr. Tweed knits it a woolly hat. It’s lumpy. The egg likes it.'),
        N('Mr. Tweed keeps his hat ready, just in case.'),
        N('You put a blanket in a fruit box, and add wheels.'),
        N('A stone at each end stops it rolling.'),
        N('The egg tries the box. There is room for two.'),
        N('Your own egg looks in too.'),
        N('The sun goes down. Odette comes back over the hill.'),
      ],
      [
        ask(
          6,
          m('science', 'sunset and evening', 'Your child connected the sun going down with evening.', '1-ESS1-1'),
          [N('The sun is going down. What time of day is it?')],
          [
            best('Evening', N('Yes! The sun goes down in the evening. Soon it’s night.')),
            opt('Morning', N('In the morning the sun comes up. Going down means evening.')),
          ],
        ),
      ],
    ),
    scene(
      'q29-complete',
      [
        OD('There it is! Safe! And wearing a hat!', 'happy'),
        N('Mr. Tweed bows. A big T is knitted on the hat. Upside down!'),
        OD('Keep the box. Two eggs, side by side, on wheels? That’s a pram!'),
        N('Mr. Tweed holds the egg a moment longer. Pat, pat. He lets go.'),
        OD('So. Was it good?'),
      ],
      [
        ask(
          0,
          m('literacy', 'the letter O', 'Your child found the letter O at the start of Odette’s name.', 'ELOF: Literacy'),
          [N('Odette starts with the letter O.'), N('Which letter is round, like an egg?')],
          [
            best('O', N('Yes! O is round, like an egg. O for Odette!')),
            opt('T', N('T is straight lines. O is round, like an egg!')),
          ],
        ),
      ],
      [
        ch(
          'honest',
          'It went for a little roll.',
          [OD('They always do! That’s why I asked a good Keeper.')],
          { 'q29-told': true },
        ),
        ch('angel', 'It was very good!', [
          N('Behind you, Mr. Tweed picks a twig out of his hair.'),
          N('Odette sees. She smiles and says nothing.'),
        ]),
      ],
    ),
  ],
);

// ------------------------------------------------------------------ Q30
const Q30 = quest(
  'q30',
  'The Three-Wheeler',
  {
    'q30-s1': {
      goal: 'Meet Rufus at the start line and enter the race in your hand cart.',
      hint: 'Ride your cart to the ridge track and talk to Rufus.',
    },
    'q30-s2': {
      goal: 'Win the race. Pass the Bluebell so it tips over three times.',
      hint: 'Catch up on a bend, and Mr. Tweed waves. Three times!',
    },
  },
  [
    scene(
      'q30-meet',
      [
        N('A bright blue cart rattles up the lane. It has three wheels.'),
        RF('Hello! I’m Rufus. This is the Bluebell. Fast!', 'happy'),
        N('Mr. Tweed sits in your hand cart. It has four wheels.'),
        N('He looks at the Bluebell’s one front wheel. He smiles a tiny smile.'),
        RF('One lap of the ridge. Ready?'),
        N('Mr. Tweed holds up three fingers. Then he tips his hand over.'),
        TW('Three.'),
      ],
      [
        ask(
          2,
          m('maths', 'more and fewer', 'Your child compared three wheels and four wheels.', 'K.CC.C.6'),
          [N('The Bluebell has three wheels. Your cart has four.'), N('Which has more wheels?')],
          [
            best('My cart', N('Yes! Four is more than three.')),
            opt('The Bluebell', N('Let’s count. Bluebell: three. Your cart: four. Four is more!')),
          ],
        ),
      ],
      [
        ch('race', 'You’re on!', [RF('Splendid! Mind your four wheels, show-off!')]),
        ch(
          'warn',
          'Is the Bluebell wobbly?',
          [RF('Steady as a table!'), N('Behind him, the Bluebell tips over. All by itself.'), RF('…It does that.')],
          { 'q30-warned': true },
        ),
      ],
    ),
    scene(
      'q30-grid',
      [
        N('Two carts at the start line.'),
        N('Rufus says “Brrm!” very loudly.'),
        N('Mr. Tweed polishes your cart with his sleeve.'),
        N('Then he polishes the Bluebell too. To be fair.'),
      ],
      [
        ask(
          3,
          m('sel', 'fair play', 'Your child talked about why treating both sides the same is fair.', 'CASEL: Social awareness'),
          [N('Mr. Tweed polished both carts. Why?')],
          [
            best('To be fair to everyone', N('Yes! Fair means everyone gets the same chance.')),
            opt('Because he likes polishing', N('Maybe! But mostly to be fair. Everyone gets the same chance.')),
          ],
        ),
      ],
    ),
    scene(
      'q30-race',
      [
        N('The flag drops! Rufus zooms off, waving.'),
        N('Each time you catch up, Mr. Tweed waves at Rufus.'),
        N('Rufus waves back. The Bluebell leans… and tips over. Bump!'),
        RF('Don’t worry! It does that!', 'happy'),
        N('He puts it back up with one hand. Off again!'),
        TW('Ha!', 'happy'),
      ],
      [
        act(
          2,
          m('science', 'a wide base is steady', 'Your child felt that standing with feet wide apart is steadier than feet together.'),
          'edu:stand:feet:wide-narrow',
          [N('(Stand with your feet close together. Now wide apart.)'), N('Which way is steadier? Wide feet!'), N('Wide is steady. Narrow tips more easily.')],
        ),
      ],
      [
        ch(
          'stop-waving',
          'Ask Mr. Tweed to stop waving. Win it fairly.',
          [
            N('Mr. Tweed sits on his hands.'),
            N('Next bend, Rufus waves anyway. Tip!'),
            RF('Don’t worry! I just like waving!'),
            N('Mr. Tweed looks very relieved. It wasn’t his fault.'),
          ],
          { 'q30-fair': true },
        ),
        ch('keep-waving', 'Let him wave. It’s friendly.', [
          N('He waves so warmly that a Nubbin waves back… and tips over too!'),
        ]),
      ],
    ),
    scene(
      'q30-complete',
      [
        N('You cross the line first! The Bluebell slides in second, on its side.'),
        RF('What a race! Three tips!', 'happy'),
        N('Mr. Tweed shakes his hand. The parked Bluebell tips over again.'),
        RF('I have a little old one at home. Your Nubbins can have it!'),
        N('Next morning, a little blue cart sits in your garden.'),
        N('A Nubbin bumps it. It tips. The Nubbin is thrilled!'),
        N('The teeny bear leans left, to help the Bluebell tip.'),
      ],
      [
        ask(
          2,
          m('maths', 'adding one more', 'Your child added one more tip to three to make four.', 'K.OA.A.2'),
          [N('Three tips in the race, and one more after. How many tips?')],
          [
            best('Four', N('Yes! Three and one more makes four.')),
            opt('Three', N('Don’t forget the one at the end! Three and one more is four.')),
          ],
        ),
      ],
    ),
  ],
);

// ================================================================ exports

// ---------------------------------------------------------------- variant scenes

/**
 * A quest's complete scene as a variant for the fun-pack rules (src/sim/fun-pack-rules.ts):
 * `add` replaces `drop` lines at index `at`, and lessons after that point move with the text.
 */
const completeWith = (
  q: EduQuest,
  id: string,
  at: number,
  add: Line[],
  drop = 0,
  choices?: Choice[],
): EduScene => {
  const base = q.scenes.find((s) => s.of === `${q.of}-complete`);
  if (!base) throw new Error(`no complete scene in ${q.id}`);
  const newId = `${base.band}:${id}`;
  return {
    ...base,
    id: newId,
    of: id,
    lines: [...base.lines.slice(0, at), ...add, ...base.lines.slice(at + drop)],
    lessons: base.lessons.map((l) => ({
      ...l,
      id: l.id.replace(base.id, newId),
      after: l.after >= at + drop ? l.after + add.length - drop : l.after,
    })),
    ...(choices ? { choices } : {}),
  };
};

/** Q4, Q6 and Q9 payoffs (Python sprout variants; registered with the sprout variants). */
export const EDU_PYTHON_SPROUT_VARIANTS: EduScene[] = [
  completeWith(Q04, 'q04-complete-kept', 1, [N('Nobody else gets a go. Trotwell clops past, very proud.')], 1),
  completeWith(Q04, 'q04-complete-shared', 1, [N('Everyone gets a turn. Trotwell joins the queue twice.')], 1),
  completeWith(Q06, 'q06-complete-shouted', 3, [N('“P.P.S. The wall is NOT wonky.”')]),
  completeWith(Q06, 'q06-complete-laughed', 3, [N('“P.P.S. You laughed. Nobody laughs on the wall. Do it again.”')]),
  completeWith(Q06, 'q06-complete-knocked', 3, [N('“P.P.S. I have no rabbit. Stop knocking.”')]),
  completeWith(Q09, 'q09-complete-themselves', 5, [
    N('The pebble Nubbins sleep a little apart. They chose it themselves.'),
  ]),
  completeWith(Q09, 'q09-complete-pebble', 5, [N('The pebble Nubbins sleep at the edge. They are very happy.')]),
];

/** Q27 payoff (Bean sprout variant): the player who wanted to tell, then stayed quiet. */
const q27SproutQuiet = (c: Choice): Choice =>
  c.id === 'quiet'
    ? { ...c, then: [...(c.then ?? []), N('Mr. Tweed points at the clock, then at you. Now we tell.')] }
    : c;
export const EDU_BEAN_SPROUT_VARIANTS: EduScene[] = [
  completeWith(
    Q27,
    'q27-complete-told',
    0,
    [],
    0,
    Q27.scenes.find((s) => s.of === 'q27-complete')?.choices?.map(q27SproutQuiet),
  ),
];

export const EDU_PYTHON_SPROUT: EduQuest[] = [Q01, Q02, Q03, Q04, Q05, Q06, Q07, Q08, Q09, Q10, Q11, Q12, Q13, Q14, Q15, Q16, Q17, Q18, Q19, Q20];

export const EDU_BEAN_SPROUT: EduQuest[] = [Q21, Q22, Q23, Q24, Q25, Q26, Q27, Q28, Q29, Q30];

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  'edu:count:beetle-legs:6',
  'edu:count:armour:5',
  'edu:clap:syllables:breakfast',
  'edu:clap:rhythm:clop-clopclop-clop',
  'edu:trot:knees-up:5',
  'edu:count:beats:3',
  'edu:tap:colour:red',
  'edu:count:stones:6',
  'edu:tap:letter:r',
  'edu:count:hands:3',
  'edu:play:follow-the-leader',
  'edu:count:shells:20',
  'edu:count-on:shells:14-20',
  'edu:count:clues:3',
  'edu:sort:alive:nubbin-toy',
  'edu:hop:one-foot:5',
  'edu:measure:steps:giant-tiny',
  'edu:count:fruits-asked:6',
  'edu:clap:pattern:plink-plonk-plunk',
  'edu:count:shells:5',
  'edu:dance:pattern:step-bow-boop',
  'edu:clap:syllables:banana',
  'edu:count:raspberries:10',
  'edu:throw-catch:soft-toy',
  'edu:write:own-name:first-letter',
  'edu:tap:tree-part:trunk',
  'edu:count:wiggles:3',
  'edu:draw:shape:circle',
  'edu:colour:circles:red-blue',
  'edu:count:jumps:10',
  'edu:freeze:statue',
  'edu:order:egg-route:post-bridge-dojo',
  'edu:stand:feet:wide-narrow',
];
