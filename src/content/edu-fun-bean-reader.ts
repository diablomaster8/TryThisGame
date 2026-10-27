/**
 * The Learning Grove, reader band (ages 7–10): educational versions of the fun quests Q21–Q30,
 * the Mr. Tweed pack (quests-bean.ts).
 *
 * Mr. Tweed stays almost wordless: mumbles and single words. The narrator does the physical
 * comedy, and the lessons come out of his disasters:
 *
 *   Q21 Bear Comes Too        reading body language, units of length and mass, similes; loneliness (think)
 *   Q22 The Armchair Drive    will it fit? differences in length, top-heavy loads, gravity on slopes
 *   Q23 Pumpkin Head          pumpkin life cycle, tempo and crescendo, will it fit round a head?
 *   Q24 The Exam              honesty in tests, lines of symmetry, effort and pride
 *   Q25 The High Dive         fear and breathing, metres and centimetres, springy boards
 *   Q26 The Park Bench Sandwich  instructions in order, area by multiplying, sharing when food is scarce
 *   Q27 The Ruined Portrait   sneezes, time intervals, cameras and light, owning up (think)
 *   Q28 Do-It-Yourself        area of a wall, firework safety, blocked paint as a "shadow"
 *   Q29 Mind the Egg          level ground and forces, left and right on a map, wedges as brakes
 *   Q30 The Three-Wheeler     why three wheels tip, fair play, a two-step time sum, being a good sport
 *
 * One EduScene per original scene (step scenes, done scenes and complete scenes: 49 in all).
 * Every choice keeps its original id and `set`; reader keeps every choice. The one approved
 * source quote in Q21 is replaced with an original line, and no source quotes appear anywhere.
 * See EDU-STYLE.md ("Fun quests"). British spelling.
 */
import type { EduDomain, EduQuest, EduScene, Lesson, LessonOption, GlossaryEntry } from './types';
import type { Line, Choice } from '../config/story';

type Mood = NonNullable<Line['mood']>;

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const Y = say('you');
/** Mr. Tweed: mumbles and single words only. */
const T = say('mr-tweed');
const I = say('mrs-inkwell');
const W = say('warden-pryce');
const O = say('odette');
const R = say('rufus');

// ---------------------------------------------------------------- builders
type LessonIn = Omit<Lesson, 'id'>;

interface Meta {
  domain: EduDomain;
  skill: string;
  standard?: string;
  parentNote: string;
}

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
/** A think question: no `best`; every reply honours the child's reasoning. */
const think = ask;
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
/** Any other answer: the reply kindly shows the right one (or, in a think question, honours it). */
const opt = (label: string, ...reply: Line[]): LessonOption => ({ label, reply });

const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice =>
  set ? { id, label, set, then } : { id, label, then };

/** Builds `reader:<of>` and numbers its lessons `reader:<of>-l1`, `-l2`. */
const scene = (of: string, lines: Line[], lessons: LessonIn[], choices?: Choice[]): EduScene => {
  const id = `reader:${of}`;
  const s: EduScene = {
    id,
    of,
    band: 'reader',
    lines,
    lessons: lessons.map((l, i) => ({ id: `${id}-l${i + 1}`, ...l })),
  };
  if (choices) s.choices = choices;
  return s;
};

const gloss = (word: string, meaning: string, of: string): GlossaryEntry => ({ word, meaning, scene: `reader:${of}` });

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

// ================================================================== Q21 Bear Comes Too
const Q21 = quest(
  'q21',
  'Bear Comes Too',
  {
    'q21-s1': {
      goal: 'Mr. Tweed has lost his bear. Follow his pointing down to the pond and look for a clue.',
      hint: 'Search the reeds on the near side of the pond. Clues sparkle faintly when you are close.',
    },
    'q21-s2': {
      goal: 'Follow the little wild Nubbin up the western hill and find where it took the bear.',
      hint: 'Wild Nubbins nest in the long grass near the top. Walk slowly: if you run, it will hide.',
    },
    'q21-s3': {
      goal: 'Carry Bear back down to Mr. Tweed.',
      hint: 'He is still sulking on his rock by the pond. Hand him the bear with Give.',
    },
  },
  [
    // ------------------------------------------------ step 1: the gate
    scene(
      'q21-intro',
      [
        N('A man in a tweed jacket is standing at his gate, patting every pocket he owns. Some of them twice.'),
        N('He looks inside his hat. He looks under a stone.'),
        N('He lifts a sleeping duck, peers underneath, and puts it back with a sorry little pat.'),
        N('This is Mr. Tweed. He lives at the end of the lane, and nobody has ever heard him finish a sentence.'),
        T('Hnn.', 'think'),
        N('He holds his hands apart, about as far as a school ruler is long. Then he hugs the empty air, very tenderly.'),
        N('He points at the empty space in his arms, then at you, then at the empty space again.'),
        Y('Something’s missing?'),
        T('Bear.', 'sad'),
        N('He makes two little ears on top of his head with his fingers, in case you were unsure about the bear.'),
        N('Then he points down the lane towards the pond, very firmly, and nods as if that settles everything.'),
      ],
      [
        ask(
          6,
          m(
            'sel',
            'reading body language',
            'Worked out what someone was feeling and asking for from their actions alone, with no words.',
            'CASEL: Social awareness',
          ),
          [
            N('Mr. Tweed hasn’t said a single proper word. But his body is saying a lot.'),
            N('What is he telling you?'),
          ],
          [
            best(
              'He has lost something he loves.',
              N('Yes. The patting, the searching, the hug with nothing in it: he’s showing you the shape of what’s missing.'),
            ),
            opt(
              'He wants a hug.',
              N('Close! But the hug is for something that isn’t there. He’s showing you the shape of something he has lost.'),
            ),
            opt(
              'He’s doing a silly dance.',
              N('It does look a bit like one! But look again: pockets, hat, under a stone. He’s searching for something he loves.'),
            ),
          ],
        ),
        ask(
          9,
          m(
            'maths',
            'choosing sensible units of length',
            'Chose centimetres, not metres or millimetres, as the sensible unit for a small object.',
            '4.MD.A.1',
          ),
          [
            N('His hands were about a school ruler apart. A school ruler is 30 centimetres long.'),
            N('So about how long is the bear?'),
          ],
          [
            best('About 30 centimetres.', N('Yes: about as long as your ruler. Small enough to hug, big enough to miss.')),
            opt(
              'About 30 metres.',
              N('30 metres is longer than a swimming pool! That bear wouldn’t fit in any pocket.'),
              N('Metres are for big things like rooms. Centimetres are for small things, like bears. About 30 centimetres.'),
            ),
            opt(
              'About 30 millimetres.',
              N('30 millimetres is only 3 centimetres: about as long as a grape. Far too small to hug!'),
              N('The bear is about 30 centimetres.'),
            ),
          ],
        ),
      ],
      [
        ch('help', 'I’ll help you look.', [
          T('Mm!', 'happy'),
          N('He shakes your hand with both of his, for slightly too long.'),
        ]),
        ch('describe', 'What does the bear look like?', [
          N('He mimes it: small, brown, one chewed ear, and a look of enormous dignity.'),
          N('You are not sure how he mimed the dignity. But he did.'),
        ]),
        ch(
          'sniff',
          'Ask your Nubbin to sniff it out.',
          [
            N('Your Nubbin sniffs Mr. Tweed’s sleeve, sneezes, and trots off towards the pond.'),
            T('Ah!', 'happy'),
          ],
          { 'q21-sniffer': true },
        ),
      ],
    ),
    scene(
      'q21-scarf',
      [
        N('In the reeds at the edge of the pond, something catches your eye.'),
        N('It’s a tiny knitted scarf. It is exactly bear-sized, and slightly damp.'),
        N('Mr. Tweed arrives at a jog, sees the scarf, and clutches it to his chest.'),
        T('Ohh.', 'soft'),
        N('He looks at the pond. He looks under a lily pad. He looks at the sky, in case bears can fly.'),
        N('There is no bear.'),
        N('He sulks so hard that his whole face folds in, like a letter going back into its envelope.'),
        Y('The scarf is here, but the bear isn’t. So where did it go?'),
      ],
      [
        ask(
          7,
          m(
            'literacy',
            'using clues to make an inference',
            'Used two clues in the story to work out something the story doesn’t say straight out.',
          ),
          [N('Be a detective. The scarf is here. The bear is not. What do the clues tell you?')],
          [
            best(
              'Something carried the bear away, and the scarf fell off.',
              N('Good detective work. A bear can’t walk off by itself, so something must have carried it. The scarf slipped off on the way.'),
            ),
            opt(
              'The bear fell in the pond.',
              N('It’s a fair worry! But Mr. Tweed checked the pond. And a bear that fell in would probably float.'),
              N('More likely, something carried it away and the scarf slipped off.'),
            ),
            opt(
              'The bear went for a walk.',
              N('Ha! In a story, maybe. But this bear can’t walk. Something must have carried it, and the scarf fell off on the way.'),
            ),
          ],
        ),
      ],
    ),
    // ------------------------------------------------ step 2: the sulk
    scene(
      'q21-sulk',
      [
        N('Mr. Tweed sits on a rock and sulks. It is a big, proper sulk, with the bottom lip and everything.'),
        N('Every so often he glances up the western hill. Then away. Then up again.'),
        Y('Is the bear up there?'),
        N('He shrugs. It is a very small shrug, about the size of a bear.'),
        N('Then he points. A wild Nubbin is waddling uphill with something brown in its arms.'),
        T('Hm!', 'angry'),
        N('He stands, marches three steps after it, remembers he is sulking, and sits back down.'),
        N('He folds his arms. The sulk resumes, a bit louder, for anyone who might be watching.'),
        N('He waves you on. This is your job now. He has a sulk to finish.'),
      ],
      [
        notice(
          4,
          m(
            'science',
            'animals line their nests with soft things',
            'Learned that many animals collect soft materials to build and line their nests, changing the place around them.',
            'K-ESS2-2',
          ),
          [
            N('Lots of animals carry soft things home to line their nests.'),
            N('Birds use moss, grass and feathers, and even tufts of sheep’s wool. A soft nest keeps eggs and babies warm.'),
            N('To a wild Nubbin, a small brown bear would make a very fine nest indeed.'),
          ],
        ),
      ],
    ),
    scene(
      'q21-nest',
      [
        N('Near the top of the western hill, the long grass has been pressed into a round, cosy nest.'),
        N('In the middle, a wild Nubbin is fast asleep. It is cuddling a small brown bear.'),
        N('The bear has one chewed ear and, somehow, a look of great dignity.'),
        N('The Nubbin’s tummy goes up and down. It gives a tiny snore.'),
        N('It doesn’t know the bear belongs to anyone. It just found something soft to love.'),
        N('You need the bear back. But the little Nubbin looks so happy.'),
      ],
      [
        ask(
          5,
          m(
            'sel',
            'being gentle and fair with animals',
            'Chose a way to solve a problem that was fair to a small animal as well as to the owner.',
            'CASEL: Responsible decision-making',
          ),
          [N('How could you get the bear back without upsetting the little Nubbin?')],
          [
            best(
              'Slowly and gently, and leave it something else to cuddle.',
              N('That’s kind and fair. Mr. Tweed gets his bear, and the little one still has something to hold.'),
            ),
            opt(
              'Grab it fast, before it wakes up.',
              N('That might work. But waking up to a grab is a horrible shock, and wild creatures can learn to be scared of people.'),
              N('Slow and gentle is better, and it’s fair to leave it something else.'),
            ),
            opt(
              'Shout “Give it back!”',
              N('It’s fair to want the bear back! But a shout would frighten it, and it didn’t mean any harm.'),
              N('Slow and gentle works better, and you could leave it something to cuddle instead.'),
            ),
          ],
        ),
      ],
      [
        ch('ease', 'Ease the bear out gently.', [
          N('The Nubbin stirs, sighs, and lets go. You leave it a piece of fruit to cuddle instead.'),
          N('It hugs the fruit and goes straight back to sleep.'),
        ]),
        ch(
          'swap',
          'Offer the little scarf in trade.',
          [
            N('The Nubbin sniffs the scarf and wraps it round its own neck. It looks very smart. Fair trade.'),
            N('Mr. Tweed may have opinions about the scarf.'),
          ],
          { 'q21-scarf-swap': true },
        ),
      ],
    ),
    // ------------------------------------------------ step 3: the carry
    scene(
      'q21-carry',
      [
        N('The bear is lighter than it looks, and it looks very light.'),
        N('Your Nubbin wants to carry it. It holds the bear the way Mr. Tweed did: very seriously, with both arms.'),
        N('Down by the pond, a tweed shape is still sulking on its rock.'),
        N('He hasn’t seen you yet. He is trying very hard not to look up the hill.'),
        N('Your Nubbin hides the bear behind its back. The bear is wider than its back.'),
        N('A chewed ear sticks out on one side. A paw sticks out on the other.'),
        Y('Ready? Let’s surprise him.', 'happy'),
      ],
      [
        ask(
          0,
          m(
            'maths',
            'choosing units of mass: grams and kilograms',
            'Chose grams as the right unit for weighing a light object, and heard that 1 kilogram is 1,000 grams.',
            '4.MD.A.1',
          ),
          [N('If you wanted to weigh this light little bear, which unit would you use?')],
          [
            best(
              'Grams',
              N('Yes. Grams are for light things, like apples, letters and small bears.'),
            ),
            opt(
              'Kilograms',
              N('A kilogram is 1,000 grams. That’s as heavy as a big bag of sugar: far too heavy for this little bear.'),
              N('Grams are better for light things.'),
            ),
            opt(
              'Metres',
              N('Metres tell you how long something is, not how heavy. For a light bear, use grams.'),
            ),
          ],
        ),
      ],
    ),
    // ------------------------------------------------ complete
    scene(
      'q21-complete',
      [
        N('Mr. Tweed sees the bear. His face unfolds all at once, like a deckchair snapping open.'),
        T('Bear!', 'happy'),
        N('He hugs the bear. He checks its chewed ear, then its good ear, then the chewed one again.'),
        N('He tucks it into his top pocket, so only its head pokes out.'),
        N('Then he notices your Nubbin, gazing at the bear with enormous longing.'),
        N('Mr. Tweed holds up one finger. He rummages in his jacket, then his trousers, then, briefly, his sock.'),
        N('Out comes a second bear, no bigger than your thumb. He places it on your shoulder, very solemnly.'),
        T('Bear.', 'soft'),
        N('It stays there. It seems to like the view.'),
        N('That evening you pass his window. He is laying the table: two plates, one of them very small.'),
        N('He pulls out the small chair first.'),
      ],
      [
        ask(
          0,
          m(
            'literacy',
            'understanding a simile',
            'Explained what a simile (a comparison using “like”) tells us about a character’s face.',
            'L.4.5',
          ),
          [
            N('“His face unfolds like a deckchair snapping open.” Comparing two things using “like” or “as” is called a simile.'),
            N('What is this simile telling you?'),
          ],
          [
            best(
              'His sad, folded-up face opened into a big happy one, all at once.',
              N('Exactly. A deckchair goes from flat and folded to wide open in one snap. So did his face.'),
            ),
            opt(
              'He looks like a piece of furniture.',
              N('Ha! Not quite. A simile borrows one picture to describe another.'),
              N('A deckchair snaps from folded to wide open in one go. His face went from sad to happy just as fast.'),
            ),
          ],
        ),
        think(
          10,
          m(
            'sel',
            'thinking about loneliness and company',
            'Thought about why someone who lives alone might set a place at the table for a toy.',
            'CASEL: Social awareness',
          ),
          [
            N('Mr. Tweed lives on his own. Tonight he has set a place at the table for his bear.'),
            N('Why do you think he does that?'),
          ],
          [
            opt(
              'Bear is his friend, and friends eat together.',
              N('That’s a lovely answer. To Mr. Tweed, Bear isn’t just a toy. Bear is company.'),
            ),
            opt(
              'He might be lonely.',
              N('That’s a thoughtful answer. Living alone can feel lonely, and a bear across the table helps a little.'),
              N('Maybe a neighbour could help a little more.'),
            ),
            opt(
              'It’s just a funny joke.',
              N('It is funny! And lots of funny things have a little bit of sad tucked inside them. Both can be true at once.'),
            ),
          ],
        ),
      ],
    ),
  ],
  [
    gloss('tenderly', 'In a gentle, loving way.', 'q21-intro'),
    gloss('dignity', 'A calm, proud, serious way of being that makes others respect you.', 'q21-intro'),
    gloss('clutches', 'Holds something tightly, as if afraid to lose it.', 'q21-scarf'),
    gloss('sulk', 'To be quiet and grumpy because you feel upset or let down.', 'q21-sulk'),
    gloss('resumes', 'Starts again after a pause.', 'q21-sulk'),
    gloss('grams', 'Small units for measuring how heavy something is. 1,000 grams make 1 kilogram.', 'q21-carry'),
    gloss('simile', 'A way of describing something by comparing it to something else, using “like” or “as”.', 'q21-complete'),
    gloss('solemnly', 'In a very serious way, as if something is important.', 'q21-complete'),
  ],
  'Lessons: body language (sel), centimetres vs metres, inference from clues, nest building, being fair to a sleeping ' +
    'animal, grams vs kilograms, a simile, and a think question on loneliness. The approved source quote at the ' +
    'reunion is replaced by “Bear!”, Mr. Tweed’s own word.',
);

// ================================================================== Q22 The Armchair Drive
const Q22 = quest(
  'q22',
  'The Armchair Drive',
  {
    'q22-s1': {
      goal: 'Help Mr. Tweed tie the armchair on top of his hand cart.',
      hint: 'Use rope from your bag on the cart, then tap each corner of the chair to tie it down. Four corners, four knots.',
    },
    'q22-s2': {
      goal: 'Clear the path to Mr. Tweed’s house before the cart gets there, so nothing falls off.',
      hint: 'Lift the branch, carry the sleeping Nubbin to the grass at the side, and unhook the washing line. The cart won’t stop for you.',
    },
  },
  [
    // ------------------------------------------------ step 1: the market
    scene(
      'q22-shop',
      [
        N('At the market, Mr. Tweed has bought an armchair. It is green, deep and enormous.'),
        N('His hand cart stands beside it. The whole cart is about as big as the chair’s cushion.'),
        N('He lifts one end of the chair and looks at the cart. Then he lifts the other end, in case that end is smaller.'),
        T('Hnn.', 'think'),
        N('He tries the chair upside down. He tries it on its side.'),
        N('He sits in it and tries to push the cart with his feet. The cart is too far away.'),
        N('Then a light comes on behind his eyes. He points at the chair, then at the top of the cart, then mimes a knot.'),
        T('Rope!', 'happy'),
        N('He looks at you the way people look at someone who definitely has rope.'),
      ],
      [
        ask(
          4,
          m(
            'maths',
            'finding a difference in length (will it fit?)',
            'Subtracted two measurements in centimetres to find how much too big something is.',
            '2.OA.A.1',
          ),
          [
            N('Will it fit? Let’s measure. The armchair is 95 centimetres wide. The cart is 60 centimetres wide.'),
            N('How much wider is the chair than the cart?'),
          ],
          [
            best(
              '35 centimetres',
              N('Yes: 95 take away 60 is 35. The chair is 35 centimetres too wide to go in the cart.'),
              N('And turning it upside down doesn’t make it one bit smaller!'),
            ),
            opt(
              '45 centimetres',
              N('Nearly! Let’s check by counting on: 60 add 35 makes 95. So the chair is 35 centimetres wider.'),
            ),
            opt(
              '155 centimetres',
              N('That’s the two added together. To find how much wider, take away instead: 95 take away 60 is 35.'),
            ),
          ],
        ),
      ],
      [
        ch('rope', 'Hand over some rope.', [
          N('He takes it with a little bow and starts a knot that goes under, over, and somehow through himself.'),
        ]),
        ch(
          'doubt',
          'Is this a good idea?',
          [T('Mm.'), N('He nods firmly, which answers a different question. You fetch some rope.')],
          { 'q22-doubted': true },
        ),
        ch('carry', 'We could just carry it.', [
          N('He looks at you, at the chair, and at the long road home. Then he gives a tiny, pitying shake of the head.'),
        ]),
      ],
    ),
    scene(
      'q22-tied',
      [
        N('The chair sits on top of the cart, tied down at all four corners.'),
        N('It is also tied, by accident, to a lamp post.'),
        N('You untie the lamp post. Mr. Tweed says sorry to it with a small bow.'),
        N('He climbs up into the armchair and settles in, very pleased with himself.'),
        N('The cart creaks. Up there, the chair and Mr. Tweed are a long way off the ground.'),
        N('He wobbles left. He wobbles right. He grips the armrests and stays very, very still.'),
        N('Then he takes a long stick, pokes the ground behind him, and the cart begins to roll.'),
      ],
      [
        ask(
          5,
          m(
            'science',
            'top-heavy loads tip easily',
            'Learned that a load is steadiest when its weight is low down and in the middle.',
          ),
          [
            N('When a load has lots of weight high up, we call it top-heavy. Top-heavy things tip over easily.'),
            N('Where should the heavy part of a load go, to keep a cart steady?'),
          ],
          [
            best(
              'Low down and in the middle',
              N('Yes. The lower and more central the weight, the harder it is to tip.'),
              N('That’s why lorries carry their heaviest loads near the floor, not stacked on the roof.'),
            ),
            opt(
              'High up on top',
              N('That’s exactly where Mr. Tweed is sitting! Weight up high makes a cart wobbly and tippy.'),
              N('Low down and in the middle is steadiest.'),
            ),
            opt(
              'Hanging off one side',
              N('Then the cart would lean that way and might tip over. Low down and in the middle is steadiest.'),
            ),
          ],
        ),
      ],
    ),
    // ------------------------------------------------ step 2: the road
    scene(
      'q22-road',
      [
        N('The cart wobbles off down the lane. Mr. Tweed steers by leaning, and now and then by stick.'),
        N('Up in the armchair, he can’t see the ground. He can see the sky, the trees and the birds. He waves at them.'),
        T('Ooh.', 'happy'),
        N('Ahead you spot three obstacles: a fallen branch, a Nubbin asleep in the path, and a rather low washing line.'),
        N('You’ll have to run ahead and clear the way. Anything that hits the cart falls off the cart.'),
        N('Including, probably, Mr. Tweed.'),
        N('Then the lane tips downhill. The cart notices at once and speeds up.'),
        N('Mr. Tweed notices much later. He grips the armrests and lifts both feet off the ground, as if that will help.'),
      ],
      [
        ask(
          7,
          m(
            'science',
            'gravity speeds things up on a slope',
            'Explained that a cart speeds up downhill because gravity pulls it, an unbalanced force.',
            '3-PS2-1',
          ),
          [N('Mr. Tweed has stopped pushing with his stick. So why is the cart going faster?')],
          [
            best(
              'The slope: gravity is pulling it downhill.',
              N('Exactly. Gravity always pulls things down. On a slope, that pull rolls the cart forward, faster and faster.'),
              N('Lifting his feet doesn’t help at all. But it does look very brave.'),
            ),
            opt(
              'Because he lifted his feet.',
              N('He’d like to think so! But his feet weren’t touching anything. The real pull is gravity, dragging the cart down the slope.'),
            ),
            opt(
              'The wind is pushing it.',
              N('Wind can push things, but there isn’t much today. The cart sped up when the lane tipped downhill. That’s gravity.'),
            ),
          ],
        ),
      ],
      [
        ch('sprint', 'Sprint ahead.', [
          N('You sprint. Behind you, Mr. Tweed hums a little driving tune that he has just made up.'),
        ]),
        ch(
          'nubbin',
          'Send your Nubbin to wake the sleeper.',
          [N('Your Nubbin trots ahead and pokes the sleeping one. It rolls over, which is not the same as moving.')],
          { 'q22-nubbin-help': true },
        ),
      ],
    ),
    scene(
      'q22-arrive',
      [
        N('The cart rolls up to Mr. Tweed’s gate and stops against it with a gentle bonk.'),
        N('His hat flies off. He catches it with one foot and flicks it back onto his head.'),
        N('He looks round to see if anyone saw. You saw. You give him a thumbs up.'),
        N('Nothing has fallen off, technically.'),
        N('Mr. Tweed checks anyway: himself, the chair and the stick, in that order.'),
        N('The chair has slid sideways. One rope is holding on by a single, very tired knot.'),
        T('Ha!', 'happy'),
      ],
      [
        ask(
          5,
          m(
            'literacy',
            'working out a word from context',
            'Used the story around a word to work out what “technically” means.',
            'L.3.4',
          ),
          [N('“Nothing has fallen off, technically.” What does “technically” mean here?')],
          [
            best(
              'It’s true by the exact rules, but only just.',
              N('Yes. Nothing fell all the way off, so it’s true. But one tired knot is all that saved the chair!'),
            ),
            opt(
              'Using lots of machines.',
              N('Good thinking: “technical” can be about machines and gadgets. But here “technically” means “by the exact rules”.'),
              N('It’s true, but only just.'),
            ),
            opt(
              'Very carefully.',
              N('Mr. Tweed was not very careful! Here “technically” means “by the exact rules”. Nothing fell off, but only just.'),
            ),
          ],
        ),
      ],
    ),
    // ------------------------------------------------ complete
    scene(
      'q22-complete',
      [
        N('Mr. Tweed climbs down. He looks at the chair. He looks at his small front door. He goes very quiet.'),
        N('The chair will not fit through the door.'),
        N('He measures both with his hands, three times, hoping. He gets a different answer every time.'),
        T('Hnn.', 'sad'),
        N('Then he unties the chair, pushes it towards you and pats it twice. It is yours. He has no room.'),
        N('He pats the cart too. He mimes walking, then riding, then points at your legs: riding is much faster.'),
        N('The cart is yours as well. He has, it seems, gone off carts.'),
        N('As you leave, he carries a small kitchen chair out to his front garden and sits in the sun, perfectly happy.'),
        N('He pats the space next to him. There is no space next to him.'),
        N('So you sit on the wall, and for a while the two of you watch the lane together.'),
      ],
      [
        ask(
          2,
          m(
            'maths',
            'why we measure with standard units',
            'Explained why rulers and tape measures give better answers than hands, then compared two lengths.',
            '2.MD.A.1',
          ),
          [N('Mr. Tweed measured with his hands and got a different answer each time. Why?')],
          [
            best(
              'Hands aren’t a fixed size, and they move about.',
              N('Right. That’s why we use rulers and tape measures. A centimetre is the same size every time, everywhere.'),
              N('With a tape measure: the door is 80 centimetres wide and the chair is 95. No amount of hoping changes that.'),
            ),
            opt(
              'The door keeps changing size.',
              N('Doors stay the same, luckily! It’s his hands that wobble and stretch.'),
              N('A tape measure gives the same answer every time: door 80 centimetres, chair 95. It won’t fit.'),
            ),
            opt(
              'He can’t count.',
              N('He probably can! The trouble is his hands. They aren’t a fixed size, and they move about.'),
              N('A tape measure says: door 80 centimetres, chair 95. It won’t fit.'),
            ),
          ],
        ),
        think(
          9,
          m(
            'sel',
            'quiet company as a kindness',
            'Thought about why simply sitting with someone can be a kind thing to do.',
            'CASEL: Relationship skills',
          ),
          [
            N('Mr. Tweed sits on his own a lot. You chose to sit with him, without saying anything at all.'),
            N('Why might just sitting with someone be a kind thing to do?'),
          ],
          [
            opt(
              'So they don’t feel lonely.',
              N('That’s a kind answer. Company doesn’t always need words. Sometimes just being there is the whole present.'),
            ),
            opt(
              'Because he gave me a chair and a cart.',
              N('That’s fair: he was generous, and it’s good to give something back. Your time is a gift too.'),
            ),
            opt(
              'I’m not sure it does anything.',
              N('That’s an honest answer. Watch his face, though.'),
              N('Sometimes the smallest things matter most to the person who gets them.'),
            ),
          ],
        ),
      ],
    ),
  ],
  [
    gloss('pitying', 'Feeling a bit sorry for someone, because you think they don’t understand.', 'q22-shop'),
    gloss('mimes', 'Acts something out without words, using only the face and body.', 'q22-shop'),
    gloss('top-heavy', 'Heavier at the top than the bottom, so it tips over easily.', 'q22-tied'),
    gloss('obstacle', 'Something in your way that you have to get past or move.', 'q22-road'),
    gloss('technically', 'True by the exact rules, even if it doesn’t feel quite true.', 'q22-arrive'),
  ],
  'Lessons: will it fit? (95 − 60 cm), top-heavy loads, gravity downhill (3-PS2-1), “technically” in context, why ' +
    'standard units beat hand spans, and a think question on quiet company. Mr. Tweed’s armchair is 95 cm; his door ' +
    'is 80 cm; the cart is 60 cm.',
);

// ================================================================== Q23 Pumpkin Head
const Q23 = quest(
  'q23',
  'Pumpkin Head',
  {
    'q23-s1': {
      goal: 'Calm the wandering pumpkin so it stops bumping into things.',
      hint: 'Tap the pumpkin and choose Pet. A calm Nubbin sits still and listens.',
    },
    'q23-s2': {
      goal: 'Free the Nubbin with three gentle wiggles, in time with the beat.',
      hint: 'Tap when the pumpkin glows: tap, tap, tap. Pulling only makes it squeak, and there is no rush.',
    },
  },
  [
    // ------------------------------------------------ step 1: the patch
    scene(
      'q23-patch',
      [
        N('It is harvest time, and the pumpkin patch is fat and orange.'),
        N('Long green vines curl along the ground between the pumpkins, under big, floppy leaves.'),
        N('One pumpkin is moving. Left, then right, then gently into a fence post. It goes “mff”.'),
        N('Mr. Tweed is already crouched beside it, studying it with enormous concentration.'),
        N('He knocks on the pumpkin. The pumpkin knocks back.'),
        T('Oh!', 'shock'),
        N('Two little feet stick out of the bottom.'),
        N('A curious Nubbin climbed in to eat the middle. Now it can’t find the way out.'),
        N('Mr. Tweed grabs the stalk and braces one foot against the pumpkin, ready to pull with all his might.'),
      ],
      [
        act(
          1,
          m(
            'science',
            'the life cycle of a pumpkin',
            'Put the stages of a pumpkin plant’s life cycle in order, from seed back to seed.',
            '3-LS1-1',
          ),
          'edu:order:pumpkin-life-cycle:5',
          [
            N('Every pumpkin in this patch started as one flat, pale seed.'),
            N('Put the pumpkin’s life in order: seed, seedling, long vine, yellow flower, pumpkin.'),
            N('And what’s inside every pumpkin? More seeds, ready to start again. That’s why we call it a life cycle.'),
          ],
        ),
      ],
      [
        ch('stop', 'Stop! Not like that.', [
          N('He freezes mid-heave, one foot in the air, and slowly lets go of the stalk.'),
          T('Mm.', 'sad'),
        ]),
        ch(
          'pull',
          'Help him pull.',
          [
            N('You both pull, and the pumpkin squeaks. The Nubbin inside squeaks louder.'),
            N('You both let go at once, and pretend that didn’t happen. Pulling a scared creature only scares it more.'),
          ],
          { 'q23-pulled': true },
        ),
        ch('watch', 'Watch which way it wriggles.', [
          N('The pumpkin rocks left, right, left. There is a rhythm to it. The Nubbin is trying to wiggle its way out.'),
        ]),
      ],
    ),
    scene(
      'q23-calm',
      [
        N('You kneel down beside the pumpkin and rest one hand on it, very gently.'),
        N('You pat it slowly. Pat. Pat. Pat.'),
        N('The pumpkin stops wandering and sits down with a soft thump.'),
        N('From inside comes a small, contented hum.'),
        N('Mr. Tweed puts his ear to the pumpkin and listens.'),
        N('He nods, like a doctor who has heard exactly what he expected to hear.'),
        T('Mm.', 'soft'),
      ],
      [
        ask(
          3,
          m(
            'sel',
            'helping someone who is frightened',
            'Picked out what helps a frightened creature calm down: slow, gentle and quiet.',
            'CASEL: Social awareness',
          ),
          [N('The Nubbin was scared and bumping about. What helped it calm down?')],
          [
            best(
              'Slow pats and a gentle hand.',
              N('Yes. When someone is frightened, slow and gentle helps. Fast and loud makes it worse.'),
              N('It works for people too: a calm voice, a slow breath, a quiet hand on the shoulder.'),
            ),
            opt(
              'Pulling it out quickly.',
              N('Pulling only made it squeak! When someone is frightened, slow and gentle helps much more.'),
            ),
            opt(
              'Knocking loudly to say hello.',
              N('A loud knock from outside would sound like thunder in there! Slow, gentle pats are what calmed it.'),
            ),
          ],
        ),
      ],
    ),
    // ------------------------------------------------ step 2: the wiggle
    scene(
      'q23-wiggle',
      [
        N('Mr. Tweed holds up three fingers. He mimes a tiny wiggle, wiggle, wiggle, and then a pop.'),
        N('He looks very proud of this plan. It is, to be fair, a good plan.'),
        N('You put both hands on the pumpkin. Inside, the Nubbin goes still and listens.'),
        T('One…', 'think'),
        N('He beats time in the air with one finger, like the conductor of a very small orchestra.'),
        N('Then he gets carried away. Both arms. Bigger and bigger, grander and grander.'),
        N('Inside the pumpkin, the Nubbin starts to hum along, louder and louder.'),
        Y('Gently. On the beat.', 'soft'),
      ],
      [
        notice(
          6,
          m(
            'music',
            'tempo and crescendo',
            'Learned two music words: tempo (the speed of the beat) and crescendo (getting louder bit by bit).',
          ),
          [
            N('When music grows louder bit by bit, musicians call it a crescendo. The Nubbin’s hum is doing one now.'),
            N('The speed of the beat is called the tempo. For a good wiggle, the tempo has to stay steady.'),
          ],
        ),
      ],
    ),
    scene(
      'q23-pop',
      [
        N('Wiggle. Wiggle. Wiggle.'),
        N('On the third wiggle there is a soft pop, and the Nubbin slides out in a shower of seeds.'),
        N('It is orange up to the elbows, and it smells wonderful.'),
        N('Mr. Tweed picks a seed off his eyebrow and studies it. Then he picks another one out of his ear.'),
        N('The Nubbin looks back at the empty pumpkin. It was warm in there, and snug, and full of dinner.'),
        N('Its bottom lip wobbles.'),
      ],
      [
        ask(
          1,
          m(
            'maths',
            'halving within 100',
            'Worked out half of 90 to find how many beats happen in half a minute.',
            '3.OA.A.3',
          ),
          [
            N('The pumpkin glows 90 times every minute. Musicians say the tempo is 90 beats per minute.'),
            N('How many beats happen in half a minute?'),
          ],
          [
            best('45', N('Yes: half of 90 is 45. That’s a lot of glows. You only need three of them.')),
            opt(
              '30',
              N('Let’s check: 30 and 30 makes 60, not 90. Half of 90 is 45, because 45 and 45 makes 90.'),
            ),
            opt(
              '180',
              N('180 is double 90: that would be two whole minutes. Half a minute is half of 90, which is 45.'),
            ),
          ],
        ),
        ask(
          3,
          m(
            'science',
            'a fruit is the part of a plant that holds seeds',
            'Learned that to a scientist, a pumpkin is a fruit because it grows from a flower and holds seeds.',
          ),
          [N('Pumpkins are packed with seeds. So is a pumpkin a fruit or a vegetable?')],
          [
            best(
              'A fruit, to a scientist.',
              N('Yes! To a botanist, a fruit is the part of a plant that grows from a flower and holds the seeds.'),
              N('So pumpkins, tomatoes and cucumbers are all fruits, even though we cook them like vegetables.'),
            ),
            opt(
              'A vegetable.',
              N('In the kitchen, lots of people call it a vegetable, and that’s fine for cooking!'),
              N('But to a botanist, a fruit is the part that grows from a flower and holds the seeds. So a pumpkin is a fruit.'),
            ),
          ],
        ),
      ],
    ),
    // ------------------------------------------------ complete
    scene(
      'q23-complete',
      [
        N('The Nubbin climbs straight back into the pumpkin. Head first, bottom up.'),
        N('You and Mr. Tweed look at each other.'),
        N('He lifts the pumpkin off and scoops it clean with a spoon from his top pocket. A butter knife from his sock cuts two neat eyeholes.'),
        N('Then he cuts a round hole in the bottom for a neck, and pops it on the Nubbin like a hat.'),
        N('It fits perfectly. The Nubbin turns slowly in a circle, delighted.'),
        N('Then he tries one on himself, to show solidarity. It goes on with a squeak and a squash.'),
        N('He walks into the fence post and says sorry to it. He walks into the scarecrow and shakes its hand.'),
        T('Mff.'),
        N('It takes you, the Nubbin, a spoon and a firm tug on each ear to get it off.'),
        N('He comes out orange to the eyebrows, and very dignified.'),
        N('He gives you a third one: smaller, neater, with a curly stalk on top.'),
        N('The Nubbin wears its pumpkin all afternoon, peering out of the eyeholes. Some creatures just like somewhere snug to be.'),
      ],
      [
        ask(
          6,
          m(
            'maths',
            'will it fit? comparing measurements',
            'Subtracted to find how much too small a hole was for a head, using centimetres.',
            '2.OA.A.1',
          ),
          [
            N('Will it fit? The neck hole is 45 centimetres round. Mr. Tweed’s head is 57 centimetres round.'),
            N('How much too small is the hole?'),
          ],
          [
            best(
              '12 centimetres',
              N('Yes: 57 take away 45 is 12. That’s why it went on with a squash, and why it wouldn’t come off.'),
            ),
            opt(
              '22 centimetres',
              N('Let’s count on from 45. Add 10 to make 55, then 2 more to make 57. That’s 12 centimetres.'),
            ),
            opt(
              '102 centimetres',
              N('That’s the two added together. To find how much too small, take away: 57 take away 45 is 12.'),
            ),
          ],
        ),
        think(
          11,
          m(
            'sel',
            'knowing what makes you feel safe',
            'Thought about a place that feels snug and safe, and why it might help.',
            'CASEL: Self-awareness',
          ),
          [
            N('Some creatures just like somewhere snug to be.'),
            N('Where is your snug place? Why do you think snug places can feel safe?'),
          ],
          [
            opt(
              'Under a blanket. It feels like a hug.',
              N('Lovely. Being wrapped up can feel like a hug that lasts. Lots of people feel calmer that way.'),
            ),
            opt(
              'Somewhere small, where nothing can sneak up.',
              N('That’s a clever thought. In a small space you can see everything around you, and that can feel safe.'),
            ),
            opt(
              'I like big open spaces better.',
              N('That’s a fair answer too. Everyone is different. Some of us feel calm somewhere snug, and some under a big sky.'),
            ),
          ],
        ),
      ],
    ),
  ],
  [
    gloss('concentration', 'Thinking very hard about one thing and nothing else.', 'q23-patch'),
    gloss('vine', 'A long, bendy plant stem that creeps along the ground or climbs.', 'q23-patch'),
    gloss('contented', 'Happy and peaceful, not wanting anything more.', 'q23-calm'),
    gloss('tempo', 'The speed of the beat in a piece of music.', 'q23-wiggle'),
    gloss('crescendo', 'When music gets louder bit by bit.', 'q23-wiggle'),
    gloss('botanist', 'A scientist who studies plants.', 'q23-pop'),
    gloss('solidarity', 'Standing together with someone, to show you are on their side.', 'q23-complete'),
    gloss('snug', 'Warm, cosy and just the right size around you.', 'q23-complete'),
  ],
  'Lessons: pumpkin life cycle (do), calming a frightened creature (sel), tempo and crescendo (music), half of 90, ' +
    'a pumpkin is a fruit to a botanist, will it fit (57 − 45 cm), and a think question on snug, safe places. ' +
    'The rhythm minigame runs at about 90 BPM, which the maths lesson uses.',
);

// ================================================================== Q24 The Exam
const Q24 = quest(
  'q24',
  'The Exam',
  {
    'q24-s1': {
      goal: 'Shuffle your Nubbin’s paper three times so Buttons can’t copy.',
      hint: 'When Buttons leans over, tap your Nubbin’s paper to slide it somewhere new. Three times does it.',
    },
    'q24-s2': {
      goal: 'At break, help Buttons learn its shapes. Then make sure both Nubbins pass.',
      hint: 'Practise shapes with Buttons on the chalkboard, then let both Nubbins finish the test on their own.',
    },
  },
  [
    // ------------------------------------------------ step 1: the desks
    scene(
      'q24-desks',
      [
        I('Test day! Two Nubbins, two desks, one paper each. Shapes, colours and counting. No talking, please.', 'happy'),
        N('Your Nubbin takes the left desk. On the right sits Buttons, Mr. Tweed’s Nubbin, in a matching tweed waistcoat.'),
        N('Mr. Tweed stands behind Buttons. He points at the paper, then at Buttons’ head, then makes a small, encouraging fist.'),
        I('Keepers may stay, but quietly. Very quietly. I am looking at you, Mr. Tweed.'),
        N('He mimes zipping his lips shut, locking them, and posting the key into his pocket. Then he checks the pocket.'),
        N('The test begins. Your Nubbin licks its pencil and draws a perfect circle.'),
        N('Buttons draws nothing. Buttons leans very, very slowly to the left.'),
        N('Behind Buttons, Mr. Tweed drops a pencil. He bends very slowly to pick it up, and reads your Nubbin’s paper upside down.'),
      ],
      [
        ask(
          7,
          m(
            'sel',
            'why copying in a test isn’t fair',
            'Explained that a test shows what each learner knows, so copying hides the help they need.',
            'CASEL: Responsible decision-making',
          ),
          [N('Buttons wants to copy. Why isn’t copying in a test a good idea?')],
          [
            best(
              'A test shows what each one knows, so the teacher can see who needs help.',
              N('Yes. If Buttons copies, Mrs Inkwell will think Buttons knows circles, and nobody will teach Buttons.'),
              N('Copying hides the help you need.'),
            ),
            opt(
              'Because you might get caught.',
              N('That’s true: you might! But the bigger reason is this. A test shows the teacher what you need help with.'),
              N('If Buttons copies, nobody will know Buttons needs help with circles.'),
            ),
            opt(
              'It’s fine if you’re friends.',
              N('Friends do help each other, and that’s lovely. But in a test, each one does their own work.'),
              N('That way the teacher can see who needs help. Helping comes afterwards.'),
            ),
          ],
        ),
      ],
      [
        ch('shield', 'Nudge your Nubbin to cover its paper.', [
          N(
            'Your Nubbin curls an arm round its work. Buttons leans further. Buttons’ chair creaks.',
          ),
        ]),
        ch(
          'share',
          'Let it look. Sharing is nice.',
          [
            I('Eyes on your own paper, please, Buttons.'),
            N('Buttons sits bolt upright and tries to whistle innocently, which Nubbins cannot do.'),
          ],
          { 'q24-shared': true },
        ),
        ch('glance', 'Look at Mr. Tweed.', [
          N('Mr. Tweed is studying the ceiling, hands behind his back, with the face of a man who has never met Buttons.'),
        ]),
      ],
    ),
    scene(
      'q24-shuffled',
      [
        N('Buttons leans. Your Nubbin slides its paper to the right.'),
        N('Buttons leans the other way. The paper slips under the desk.'),
        N('Left, right, under the desk. Buttons follows the paper with its whole body.'),
        N('On the third shuffle, Buttons falls off its chair.'),
        N('Mr. Tweed, who has been leaning right along with Buttons, falls over too.'),
        N('He stays on the floor and taps it with one knuckle, as if he came down to check the floorboards.'),
        I('Buttons? Are you all right?', 'shock'),
        N('Buttons is fine. Buttons’ paper is still completely blank.'),
      ],
      [
        ask(
          5,
          m(
            'literacy',
            'working out a character’s feelings from actions',
            'Used what a character does to work out a feeling he is trying to hide.',
            'RL.3.3',
          ),
          [N('Why does Mr. Tweed pretend to be checking the floor?')],
          [
            best(
              'He’s embarrassed, and doesn’t want anyone to know he was leaning to look too.',
              N('Yes. Pretending to do something else is a way of hiding embarrassment. His actions give him away.'),
            ),
            opt(
              'He really likes floors.',
              N('Ha! Maybe he does. But he only started after he fell.'),
              N('More likely he’s embarrassed, and hoping nobody noticed he was leaning to peek.'),
            ),
            opt(
              'He hurt himself.',
              N('That’s a kind worry. But he’s tapping the floor, not rubbing a bump.'),
              N('He’s embarrassed, and pretending he meant to be down there.'),
            ),
          ],
        ),
      ],
    ),
    // ------------------------------------------------ step 2: break time
    scene(
      'q24-break',
      [
        N('Buttons climbs back onto its chair and looks at its blank paper. Its ears droop all the way down.'),
        N('Behind it, Mr. Tweed’s ears somehow droop too.'),
        T('Hnn…', 'sad'),
        N('He points at Buttons, then at the paper, then clasps his hands together, pleading.'),
        I('Pencils down, everyone. It’s break. You may help each other at break. That’s learning, not copying.'),
        Y('Right, Buttons. Let’s start with a square. Four sides, all the same length.'),
        N('You draw a square on the chalkboard. Buttons copies it. It has five sides, but it’s a start.'),
        N('Buttons gazes up at you with the solemn trust of a creature that has never drawn a square.'),
      ],
      [
        ask(
          6,
          m(
            'maths',
            'lines of symmetry in a square',
            'Found all four lines of symmetry in a square: two straight across and two corner to corner.',
            '4.G.A.3',
          ),
          [
            N('If you fold a paper square so both halves match exactly, the fold is a line of symmetry.'),
            N('How many lines of symmetry does a square have?'),
          ],
          [
            best('4', N('Yes: one up and down, one side to side, and two from corner to corner.')),
            opt(
              '2',
              N('Good start: up and down, and side to side. But you can also fold it corner to corner, both ways. That makes 4.'),
            ),
            opt(
              '1',
              N('There’s more than one! Up and down, side to side, and both corner-to-corner folds. That’s 4.'),
            ),
          ],
        ),
      ],
    ),
    scene(
      'q24-pass',
      [
        N('Back at the desks, Buttons draws a square. It has four sides this time. Buttons counts them twice.'),
        N('Then a triangle, then a circle, with its tongue poking out.'),
        N('Your Nubbin finishes its paper and waits, swinging its legs.'),
        I('Two passes!', 'happy'),
        I('Buttons, that is the roundest circle I have ever seen. It is very nearly a circle.'),
        N('Buttons holds its paper up to Mr. Tweed with both arms.'),
        N('Mr. Tweed’s eyes go shiny. He blows his nose very loudly into a spotted handkerchief.'),
      ],
      [
        notice(
          4,
          m(
            'sel',
            'being proud of effort',
            'Noticed that honest praise can be kind, and that effort is something to be proud of.',
            'CASEL: Self-awareness',
          ),
          [
            N('Mrs Inkwell is honest: it isn’t a perfect circle. And she is kind: she praises how hard Buttons tried.'),
            N('This morning Buttons couldn’t draw a square. Now it can. That is something to be proud of.'),
          ],
        ),
      ],
    ),
    // ------------------------------------------------ complete
    scene(
      'q24-complete',
      [
        N('Mr. Tweed lifts Buttons into the air like a trophy and does a slow, silent lap of the classroom.'),
        I('Mr. Tweed. Please put the Nubbin down.'),
        N('He puts Buttons down and shakes your hand. Then your Nubbin’s. Then Mrs Inkwell’s, who did not offer it.'),
        I('You know, these two learn better together. Bring them as a pair, and I’ll teach them both for one fee.', 'soft'),
        N('Buttons and your Nubbin are already sitting side by side, drawing circles on each other’s papers.'),
        N('Mr. Tweed lingers. He looks at the little desks, then at Mrs Inkwell, and holds up one finger, hopefully.'),
        I('…One paper. Just the one.', 'soft'),
        N('He folds himself into the tiny desk, which takes some time. His knees end up near his ears.'),
        N('He licks his pencil and draws a circle with his tongue out.'),
        N('It is not a very good circle. He holds it up to Buttons anyway, both arms, and Buttons claps.'),
      ],
      [
        ask(
          3,
          m(
            'maths',
            'a two-step money problem with Shells',
            'Solved a two-step problem: found the cost of two lessons, then how much a shared fee saves.',
            '3.OA.D.8',
          ),
          [
            N('A lesson costs 8 Shells for each Nubbin. Two lessons would cost 2 lots of 8.'),
            N('As a pair, they pay just one fee of 8 Shells. How many Shells do you save?'),
          ],
          [
            best('8 Shells', N('Yes: 2 lots of 8 is 16. One fee is 8. And 16 take away 8 leaves 8 Shells saved.')),
            opt(
              '16 Shells',
              N('16 is what two lessons would cost. But the pair pays only 8, so you save 16 take away 8, which is 8 Shells.'),
            ),
            opt(
              '4 Shells',
              N('Let’s go step by step. Two lessons: 8 and 8 makes 16. One fee: 8. 16 take away 8 is 8 Shells saved.'),
            ),
          ],
        ),
        think(
          9,
          m(
            'sel',
            'cheering on someone else’s effort',
            'Thought about why it matters to cheer for someone’s effort, even when the result isn’t perfect.',
            'CASEL: Relationship skills',
          ),
          [N('Mr. Tweed’s circle isn’t very good. But Buttons claps anyway. Why do you think that matters?')],
          [
            opt(
              'Because Mr. Tweed cheered for Buttons first.',
              N('That’s a sharp answer. Kindness often comes back round the same way it went out.'),
            ),
            opt(
              'Because trying is what counts.',
              N('That’s a wise answer. It was hard for him, and he did it anyway, in front of everyone.'),
            ),
            opt(
              'It doesn’t. It’s still a wobbly circle.',
              N('That’s honest! It is a wobbly circle. But the clap isn’t really for the circle.'),
              N('It’s for the person who was brave enough to draw it.'),
            ),
          ],
        ),
      ],
    ),
  ],
  [
    gloss('encouraging', 'Giving someone hope and confidence, so they want to keep trying.', 'q24-desks'),
    gloss('innocently', 'In a way that tries to look as if you have done nothing wrong.', 'q24-desks'),
    gloss('embarrassed', 'Feeling silly or awkward because of something others might have seen.', 'q24-shuffled'),
    gloss('symmetry', 'When one half of a shape is an exact mirror of the other half.', 'q24-break'),
    gloss('fee', 'The money you pay for a service, like a lesson.', 'q24-complete'),
  ],
  'Lessons: why copying hides the help you need (sel), reading embarrassment from actions (RL.3.3), the four lines ' +
    'of symmetry in a square (4.G.A.3), honest praise and pride in effort, a two-step Shells problem (2 × 8 − 8), and ' +
    'a think question on cheering for effort. Cheating is never rewarded; helping at break is the point.',
);

// ================================================================== Q25 The High Dive
const Q25 = quest(
  'q25',
  'The High Dive',
  {
    'q25-s1': {
      goal: 'Get Mr. Tweed off the ledge: talk him down, or let a brave Swim Nubbin show him how.',
      hint: 'Call up to him with Talk to coax him down one step at a time, or take a strong swimmer to the ledge and tap Dive.',
    },
    'q25-s2': {
      goal: 'Build a low diving board at the pond with Mr. Tweed.',
      hint: 'Set the plank on the flat rock at the pond’s edge, then hammer it in with three taps.',
    },
  },
  [
    // ------------------------------------------------ step 1: the ledge
    scene(
      'q25-ledge',
      [
        N('Mr. Tweed is at the waterfall in a striped bathing suit, doing warm-up stretches. Mostly with his eyebrows.'),
        N('He points up at the high ledge beside the falls, then at himself, then mimes a perfect swallow dive.'),
        T('Hup!', 'happy'),
        N('He climbs. It takes a while. Halfway up he stops to wave at you, and very nearly doesn’t start again.'),
        N('At the top he walks to the edge, looks down, and turns into a statue.'),
        N('A long time passes. A small bird lands on his head. He does not move.'),
        N('A queue forms behind him: three small Nubbins, waiting politely for their turn.'),
        N('One by one they squeeze between his ankles and dive. He watches each one go.'),
        N('Then he looks at the water as if it has betrayed him.'),
        T('Hnn.', 'shock'),
        N('Very carefully, without moving anything else, he mimes two fingers walking backwards. He would like to come down now.'),
      ],
      [
        think(
          10,
          m(
            'sel',
            'courage and changing your mind',
            'Thought about whether it can be brave to say “I’m not ready” and change your mind.',
            'CASEL: Self-awareness',
          ),
          [
            N('Mr. Tweed climbed all that way, and now he wants to come back down.'),
            N('Can it be brave to change your mind?'),
          ],
          [
            opt(
              'Yes. It takes courage to say “I’m not ready”.',
              N('That’s a wise answer. Doing something just because people are watching isn’t the same as being brave.'),
            ),
            opt(
              'No. He should just jump.',
              N('That’s a fair thought: the Nubbins made it look easy! But everyone is ready at a different time.'),
              N('Coming down now and trying again later is a choice too.'),
            ),
            opt(
              'It depends why he wants to come down.',
              N('That’s a thoughtful answer. Fear can be a useful warning. Listening to it, and then trying something smaller, can be clever.'),
            ),
          ],
        ),
      ],
      [
        ch(
          'coax',
          'Talk him down, one step at a time.',
          [Y('You’re fine! One foot back. Just one.'), T('Mm…', 'think')],
          { 'q25-way': 'coax' },
        ),
        ch(
          'show',
          'Ask a Swim Nubbin to show him how.',
          [N('Your Nubbin looks at the ledge, then at the water, then back at you, with growing delight.')],
          { 'q25-way': 'show' },
        ),
      ],
    ),
    scene(
      'q25-down',
      [
        N('Step by step, or splash by splash, Mr. Tweed gets off that ledge.'),
        N('His first steps are tiny. He holds on to each rock as if it were a long-lost friend.'),
        N('You call up to him after every step. Good. And another one. Breathe.'),
        N('The last bit is mostly sliding.'),
        N('He lands in the shallows with a slap and sits up, dripping.'),
        N('The bird is still on his head.'),
        T('Mm!', 'happy'),
      ],
      [
        act(
          2,
          m(
            'sel',
            'slow breathing to calm a big feeling',
            'Practised slow counted breathing, a way to calm the body when feeling scared.',
            'CASEL: Self-management',
          ),
          'edu:breathe:slow:3',
          [
            N('When we’re scared, our breathing goes fast and our muscles go stiff. That’s partly why Mr. Tweed froze.'),
            N('Slow breathing helps. Breathe in while you count to four, then out while you count to four.'),
            N('Do it three times, with Mr. Tweed. In, two, three, four. Out, two, three, four.'),
          ],
        ),
      ],
    ),
    // ------------------------------------------------ step 2: the board
    scene(
      'q25-board',
      [
        N('Back on dry land, Mr. Tweed dries off with a towel the size of a handkerchief.'),
        N('He looks at the high ledge. Then he looks at the low, flat rock by the home pond.'),
        N('He holds his hands a little apart. He mimes sawing, then hammering, then a gentle bounce.'),
        N('A diving board: a low one.'),
        T('Small.', 'happy'),
        N('Your Nubbin is already bouncing on the spot. It would like to go first.'),
        N('Mr. Tweed pulls a plank from somewhere inside the towel and hands it to you.'),
        N('You bend it over your knee. It bends, then springs straight back. Boing.'),
      ],
      [
        ask(
          3,
          m(
            'maths',
            'converting metres to centimetres',
            'Converted 4 metres into 400 centimetres, and compared it with a 40 cm board.',
            '4.MD.A.1',
          ),
          [
            N('The high ledge was 4 metres above the water. The new board will be just 40 centimetres.'),
            N('How many centimetres high was the ledge?'),
          ],
          [
            best(
              '400 centimetres',
              N('Yes: 1 metre is 100 centimetres, so 4 metres is 400 centimetres. That’s ten times higher than the new board!'),
            ),
            opt(
              '40 centimetres',
              N('40 centimetres is the new board. The ledge was 4 metres, and each metre is 100 centimetres. So it’s 400.'),
            ),
            opt(
              '4 centimetres',
              N('4 centimetres is shorter than your finger! Each metre is 100 centimetres, so 4 metres is 400 centimetres.'),
            ),
          ],
        ),
        notice(
          7,
          m(
            'science',
            'a bent plank stores energy',
            'Learned that a springy board stores energy when it bends and pushes back as it straightens.',
          ),
          [
            N('When you bend a springy plank, it stores energy. Let it go, and it pushes back as it straightens.'),
            N('That push is what bounces a diver up off a diving board.'),
          ],
        ),
      ],
    ),
    // ------------------------------------------------ complete
    scene(
      'q25-complete',
      [
        N('The diving board is low, springy and slightly crooked. It is perfect.'),
        N('Your Nubbin goes first. Bounce, bounce, splash! It comes up grinning, and paddles back faster than before.'),
        N('Then Mr. Tweed walks to the end and looks down at the water. It is about 30 centimetres below him.'),
        N('He freezes.'),
        N('You wait. Your Nubbin waits. The bird comes back and lands on his head again.'),
        N('Then he holds his nose, shuts his eyes, and steps off like a man stepping off a kerb.'),
        T('Ha!', 'happy'),
        N('He climbs out and does it again. And again. Nine more times.'),
        N('The board is yours to keep. He will visit.'),
      ],
      [
        ask(
          5,
          m(
            'literacy',
            'understanding a simile',
            'Explained what a simile (“like a man stepping off a kerb”) tells us about how big the jump was.',
            'L.4.5',
          ),
          [N('He steps off “like a man stepping off a kerb”. What does this simile tell you about the jump?')],
          [
            best(
              'It was tiny and easy after all.',
              N('Yes. Stepping off a kerb is something you do every day without thinking. After all that fuss, the jump was that small.'),
            ),
            opt(
              'He fell over.',
              N('He didn’t fall: he stepped! The simile compares the jump to stepping off a kerb. It was tiny and easy after all.'),
            ),
            opt(
              'He was on a road.',
              N('Good noticing: a kerb is the edge of a pavement. Here the simile means the jump was as small as that one step.'),
            ),
          ],
        ),
        notice(
          7,
          m(
            'sel',
            'building courage in small steps',
            'Heard how facing a fear in small, repeated steps makes it easier each time.',
            'CASEL: Self-management',
          ),
          [
            N('Mr. Tweed didn’t beat his fear by jumping off the highest ledge. He started small, then did it again and again.'),
            N('Each time felt a little easier. Big brave things are often built out of lots of small brave things.'),
          ],
        ),
      ],
    ),
  ],
  [
    gloss('statue', 'A carved or cast figure of a person or animal that stands perfectly still.', 'q25-ledge'),
    gloss('betrayed', 'Let down by someone you trusted.', 'q25-ledge'),
    gloss('shallows', 'The part of the water that isn’t deep, near the edge.', 'q25-down'),
    gloss('kerb', 'The raised edge of a pavement, next to the road.', 'q25-complete'),
    gloss('crooked', 'Bent, or not quite straight.', 'q25-complete'),
  ],
  'Lessons: a think question on changing your mind, slow counted breathing (do), 4 m = 400 cm, a springy plank stores ' +
    'energy, a simile, and building courage in small steps. No real advice about heights or diving; nobody is hurt.',
);

// ================================================================== Q26 The Park Bench Sandwich
const Q26 = quest(
  'q26',
  'The Park Bench Sandwich',
  {
    'q26-s1': {
      goal: 'Hand Mr. Tweed the right things, in the right order, as he mimes for them.',
      hint: 'Watch his hands: a sawing mime means bread, a shake means pepper. Pass the wrong thing and he’ll hand it back politely.',
    },
    'q26-s2': {
      goal: 'Spread the picnic blanket and share the sandwich with every Nubbin there.',
      hint: 'Lay the blanket on the grass by the bench, then tap each Nubbin on it and choose Feed.',
    },
  },
  [
    // ------------------------------------------------ step 1: the bench
    scene(
      'q26-bench',
      [
        N('Mr. Tweed sits on the bench by the pond. It has a small brass plate with his name on.'),
        N('He brought the plate himself, and screwed it on.'),
        N('He opens his coat and begins unpacking lunch from places lunch should not be.'),
        N('A whole loaf from his left sleeve. A lettuce from his inside pocket. A jar of jam from somewhere near his knee.'),
        N('A tomato, a pepper pot, a pat of butter from his breast pocket, and a small, warm flask from under his hat.'),
        N('He lines them all up along the bench and admires them. Then he spreads jam on the lettuce.'),
        T('Hm?', 'think'),
        N('He looks at the lettuce, then at the jam. Something has gone wrong, and he can’t say what.'),
        N('Your Nubbin climbs up beside him, very interested in the jam.'),
      ],
      [
        act(
          7,
          m(
            'literacy',
            'following instructions in order',
            'Put six sandwich-making steps in order and used sequence words: first, next, then, last.',
          ),
          'edu:order:sandwich-steps:6',
          [
            N('Instructions only work if you follow them in the right order. Mr. Tweed has jumped into the middle.'),
            N('Put the steps in order: bread, butter, lettuce, tomato, a shake of pepper, and bread on top.'),
            N('Words like first, next, then and last help us keep steps in the right order.'),
          ],
        ),
      ],
      [
        ch('pass', 'Offer to pass him things.', [
          N('He nods gravely and holds out one hand, palm up, like a surgeon waiting for a tool.'),
        ]),
        ch(
          'taste',
          'Try a bite of the jam lettuce.',
          [N('It is crunchy, sweet and wrong. Mr. Tweed watches your face closely, then nods. Wrong. He knew it.')],
          { 'q26-jam-lettuce': true },
        ),
        ch('jam', 'Let your Nubbin have the jam.', [
          N('Your Nubbin puts its whole face in the jar. Mr. Tweed produces a second jar from his other knee.'),
        ]),
      ],
    ),
    scene(
      'q26-sandwich',
      [
        N('Bread first. Next, butter. Then lettuce, then tomato.'),
        N('A shake of pepper. Last of all, bread on top. Pat, pat.'),
        N('Mr. Tweed holds the finished sandwich up to the light, like a jeweller checking a diamond.'),
        N('A duck lands on the bench. It looks at the sandwich. Then it looks at Mr. Tweed.'),
        N('A long, silent negotiation takes place.'),
        N('The duck leaves with the jam lettuce. Mr. Tweed lets it go. He never trusted the jam lettuce.'),
        T('Ahh.', 'happy'),
      ],
      [
        notice(
          5,
          m(
            'science',
            'what ducks need to eat',
            'Learned that leafy greens, peas and oats are better food for ducks than bread.',
            'K-LS1-1',
          ),
          [
            N('Here’s a surprise: lettuce is a better snack for ducks than bread. Torn leafy greens, peas and oats are all good duck food.'),
            N('Bread fills ducks up without giving their bodies what they need. The jam, though, was not a good idea.'),
          ],
        ),
      ],
    ),
    // ------------------------------------------------ step 2: sharing
    scene(
      'q26-share',
      [
        N('He is about to take the first bite when he notices: you have no sandwich. Your Nubbin has no sandwich.'),
        N('Five wild Nubbins have gathered quietly behind the bench. They have no sandwich either.'),
        N('Mr. Tweed looks at his sandwich, then at all of them. He sighs a sigh from the bottom of his boots.'),
        N('He takes a ruler from his coat, because of course he has a ruler.'),
        N('The sandwich is 16 centimetres long and 8 centimetres wide. He cuts it into exact squares, 4 centimetres on each side.'),
        N('He points at a flat patch of grass, then flaps an imaginary cloth.'),
        T('Picnic.'),
        N('He pulls a checked blanket out of his coat. It is bigger than the coat.'),
      ],
      [
        ask(
          4,
          m(
            'maths',
            'counting squares in rows and columns (area)',
            'Found the number of equal squares in a rectangle by multiplying rows by columns.',
            '3.MD.C.7',
          ),
          [
            N('16 centimetres long makes 4 squares along. 8 centimetres wide makes 2 squares down.'),
            N('How many squares are there altogether?'),
          ],
          [
            best(
              '8',
              N('Yes: 2 rows of 4 is 8. Now count the eaters: you, your Nubbin, Mr. Tweed and five wild Nubbins.'),
              N('That’s 8. Exactly one square each!'),
            ),
            opt(
              '6',
              N('Let’s count the rows. The top row has 4 squares, and so does the bottom row. 4 and 4 makes 8.'),
            ),
            opt(
              '12',
              N('That’s 4 and 8 added together. But we want rows of squares: 2 rows of 4 is 8 squares.'),
            ),
          ],
        ),
        notice(
          7,
          m(
            'social-studies',
            'scarcity means choosing',
            'Heard that when there isn’t enough for everyone to have lots, people have to choose how to share.',
            'D2.Eco.1.K-2',
          ),
          [
            N('One sandwich, eight hungry mouths. When there isn’t enough of something for everyone to have lots, we have to choose.'),
            N('Mr. Tweed chose small, equal shares, so that nobody goes without.'),
          ],
        ),
      ],
    ),
    // ------------------------------------------------ complete
    scene(
      'q26-complete',
      [
        N('Everyone gets a square.'),
        N('Mr. Tweed takes the last one, which is mostly crust, and eats it as if it were cake.'),
        N('The brass plate on the bench has only ever had one name on it.'),
        N('It is the first time in years he has cut his sandwich into more than one piece.'),
        N('The duck comes back for the crust. Mr. Tweed measures it with the ruler, finds it over regulation size, and gives it half anyway.'),
        N('The Nubbins lie in a sleepy pile on the blanket: sticky, full and very happy.'),
        N('Mr. Tweed goes to fold the blanket. He looks at the pile of sleeping Nubbins, and quietly leaves it where it is.'),
        N('He tips his hat to you. The blanket is yours now. The Nubbins have decided.'),
      ],
      [
        think(
          3,
          m(
            'sel',
            'why sharing can feel good',
            'Thought about why someone might be happier with a small shared piece than a whole thing eaten alone.',
            'CASEL: Social awareness',
          ),
          [
            N('Mr. Tweed got the smallest, crustiest piece. Yet he looks happier than he did with the whole sandwich.'),
            N('Why do you think that is?'),
          ],
          [
            opt('Sharing feels good.', N('That’s a lovely answer. Giving can feel even better than getting.')),
            opt(
              'He isn’t eating on his own any more.',
              N('That’s a thoughtful answer. A crust with friends might taste better than a whole sandwich by yourself.'),
            ),
            opt(
              'He just really likes crusts.',
              N('Ha! Maybe he does. Some people do. But look at his face. It might not only be about the crust.'),
            ),
          ],
        ),
      ],
    ),
  ],
  [
    gloss('admires', 'Looks at something and thinks how good it is.', 'q26-bench'),
    gloss('surgeon', 'A doctor who does operations, and is handed tools by a helper.', 'q26-bench'),
    gloss('jeweller', 'Someone who makes, mends or sells rings, necklaces and precious stones.', 'q26-sandwich'),
    gloss('negotiation', 'A talk where two sides try to agree on a deal.', 'q26-sandwich'),
    gloss('imaginary', 'Not real; only pictured in your mind.', 'q26-share'),
  ],
  'Lessons: instructions in order (do), better duck food than bread, 2 rows of 4 squares (area), scarcity and equal ' +
    'shares (D2.Eco.1.K-2), and a think question on sharing. The share scene names five wild Nubbins (eight eaters, ' +
    'eight squares); the implementer can place five wild Nubbins by the bench.',
);

// ================================================================== Q27 The Ruined Portrait
const Q27 = quest(
  'q27',
  'The Ruined Portrait',
  {
    'q27-s1': {
      goal: 'Bring three Nubbins into the hall and line them up like the Nubbins in the portrait.',
      hint: 'Carry or call Nubbins into the hall. Mr. Tweed’s chalk crosses on the floor show where each one sits.',
    },
    'q27-s2': {
      goal: 'Take a Photo mode picture that matches the Founders’ Portrait.',
      hint: 'Use the self-timer in Photo mode and sit in the empty chair. The outline turns green when everyone’s pose lines up.',
    },
    'q27-s3': {
      goal: 'Hang the frame back on its hook before the Warden walks in.',
      hint: 'Tap the hook to hang the frame, then tap it again to straighten it. Two quick taps.',
    },
  },
  [
    // ------------------------------------------------ step 1: the sneeze
    scene(
      'q27-hall',
      [
        N('The Keepers’ Hall smells of floor polish. On the far wall hangs the Founders’ Portrait: two serious old Keepers and three Nubbins.'),
        W('Mr. Tweed is cleaning the portrait today. Supervised. By me. From the tea room. Back within the hour. Touch nothing but the frame.'),
        N('The Warden leaves. The hall clock says quarter past two.'),
        N('Mr. Tweed bows to the portrait and dabs it with a wet cloth. His nose begins to twitch.'),
        N('He holds the twitch in. Then he holds it in harder. His face goes through every colour.'),
        T('Hah… hah…', 'shock'),
        N('The sneeze is enormous. The wet cloth flies out of his hand and lands across both founders.'),
        N('When he peels it off, the founders have smudged into one very wide founder with four ears.'),
        N('He dabs at it with his handkerchief. Now there is a nose where one of the ears was.'),
        N('He tries the pencil from behind his ear. The founder now has spectacles, and a look of total surprise.'),
        T('Oh.', 'shock'),
        N('He looks at the door, then at the clock. Then he looks at you, and mimes a small, desperate prayer.'),
      ],
      [
        notice(
          6,
          m(
            'health',
            'why we sneeze, and catching sneezes',
            'Learned that sneezes clear dust from the nose and spray droplets, so we catch them in a tissue or elbow.',
          ),
          [
            N('Dust and strong smells, like polish, can tickle the inside of your nose. A sneeze blows them out, very fast.'),
            N('A sneeze sprays tiny droplets a long way. Catch it in a tissue or your elbow. Not on a painting.'),
          ],
        ),
        ask(
          11,
          m(
            'maths',
            'working out a time one hour later',
            'Worked out the time one hour after quarter past two.',
            '3.MD.A.1',
          ),
          [N('The Warden left at quarter past two. She said she’d be back within the hour. By what time will she be back?')],
          [
            best(
              'Quarter past three',
              N('Yes. One hour after quarter past two is quarter past three. The minute hand goes all the way round once.'),
            ),
            opt(
              'Half past two',
              N('That’s only 15 minutes later! One hour means the minute hand goes all the way round. Quarter past three.'),
            ),
            opt(
              'Quarter past four',
              N('That would be two hours. One hour after quarter past two is quarter past three.'),
            ),
          ],
        ),
      ],
      [
        ch('fix', 'We can fix this. Probably.', [N('He grips your hand gratefully, and gets cleaning fluid all over it.')]),
        ch(
          'tell',
          'We should tell the Warden.',
          [N('He nods slowly. Then he points at the clock, the portrait and you. Try first, then tell.')],
          { 'q27-wanted-to-tell': true },
        ),
      ],
    ),
    scene(
      'q27-lined',
      [
        N('Mr. Tweed draws a plan on the floor in chalk: two chairs, three Nubbins, one camera. Yours.'),
        N('He draws a little cross for each Nubbin to sit on, and numbers them 1, 2 and 3 in very neat handwriting.'),
        N('You bring in three Nubbins. Getting them onto the crosses takes a while.'),
        N('One sits on cross 2. One sits on cross 3, facing the wrong way.'),
        N('One is asleep on cross 1, and has been since before you arrived.'),
        N('Three Nubbins in a row, more or less.'),
        N('Mr. Tweed looks from the portrait to the Nubbins and back again, and gives a small, satisfied nod.'),
      ],
      [
        act(
          4,
          m(
            'art',
            'composition: planning where everyone goes in a picture',
            'Learned that artists plan a picture’s composition so every face can be seen, and arranged the Nubbins to match.',
          ),
          'edu:place:nubbins:chalk-marks:3',
          [
            N('Painters plan where everyone goes before they start. This plan is called the composition.'),
            N('In the Founders’ Portrait, the tall Keepers sit at the back and the small Nubbins sit in front, so every face can be seen.'),
            N('Match the portrait: turn the backwards Nubbin round, so all three faces show.'),
          ],
        ),
      ],
    ),
    // ------------------------------------------------ step 2: the pose
    scene(
      'q27-pose',
      [
        N('Mr. Tweed hangs a dark curtain behind the Nubbins and drags two chairs into place, just like the portrait.'),
        N('He sticks on a grey moustache and offers you one. It is the same moustache: he has torn it in half.'),
        N('He sits, rests one hand on his knee, and gazes into the distance with the face of a founder.'),
        N('The Nubbins copy him. All three gaze into the distance. One falls asleep doing it.'),
        T('Shh.'),
        N('He nods at your camera, then the portrait, then holds up one finger. One go. The clock is ticking.'),
        Y('Everybody look at the lens, and hold still…'),
      ],
      [
        notice(
          5,
          m(
            'science',
            'cameras catch light',
            'Learned that a painting is made slowly by hand, but a camera makes a picture by catching light.',
            '1-PS4-2',
          ),
          [
            N('A painter makes a portrait slowly, by hand, with brushes and paint. It can take weeks.'),
            N('A camera catches light. Press the button, and it lets light in through the lens for a moment. That light makes the picture.'),
            N('That’s why the hall needs to be bright, and why everyone must hold still while it happens.'),
          ],
        ),
      ],
    ),
    scene(
      'q27-shot',
      [
        N('Click.'),
        N('You all wait while the picture slides slowly out of the camera.'),
        N('It shows two stern founders and three Nubbins in front of a dark curtain.'),
        N('It is dignified. It is serious. It is very nearly right.'),
        N('One Nubbin is yawning. But if you squint, so was one in the original.'),
        N('Mr. Tweed holds the photo next to the portrait and squints at both, one eye at a time.'),
        T('Mm!', 'happy'),
      ],
      [
        ask(
          3,
          m(
            'literacy',
            'multiple-meaning words: stern',
            'Used context to choose the right meaning of “stern”, a word with more than one meaning.',
            'L.3.4',
          ),
          [N('The founders look “stern”. What does “stern” mean here?')],
          [
            best(
              'Serious and strict-looking',
              N('Yes. A stern face doesn’t smile much. It looks as if it’s about to say “Sit up straight.”'),
            ),
            opt(
              'Very old',
              N('They are old! But “stern” is about how they look: serious and strict.'),
            ),
            opt(
              'The back of a boat',
              N('Good thinking! “Stern” really is the back of a boat. It’s a word with two meanings.'),
              N('Here, in a picture of faces, it means serious and strict-looking.'),
            ),
          ],
        ),
      ],
    ),
    // ------------------------------------------------ step 3: the swap
    scene(
      'q27-swap',
      [
        N('Footsteps in the corridor. The Warden is early.'),
        N('Mr. Tweed lifts the frame down, slides the smudged canvas out, and hides it up the back of his jacket.'),
        N('You slot the photo into the frame. It is slightly too small.'),
        N('Mr. Tweed stuffs the gaps with his handkerchief.'),
        N('He hangs it. It is crooked. He straightens it, and the other side drops.'),
        N('He straightens that, and the first side drops.'),
        T('Quick!', 'shock'),
        N('The footsteps stop outside the door.'),
        N('The door handle begins, very slowly, to turn.'),
      ],
      [
        ask(
          3,
          m(
            'maths',
            'finding a gap by subtracting',
            'Subtracted two widths to find a gap, then halved it for each side.',
            '2.OA.A.1',
          ),
          [
            N('The opening in the frame is 40 centimetres wide. The photo is 36 centimetres wide.'),
            N('How wide is the gap?'),
          ],
          [
            best(
              '4 centimetres',
              N('Yes: 40 take away 36 is 4. With the photo in the middle, that’s 2 centimetres each side. Just right for a handkerchief.'),
            ),
            opt(
              '6 centimetres',
              N('Nearly! Count on from 36: 37, 38, 39, 40. That’s 4 centimetres.'),
            ),
            opt(
              '76 centimetres',
              N('That’s the two widths added together. To find the gap, take away: 40 take away 36 is 4 centimetres.'),
            ),
          ],
        ),
      ],
    ),
    // ------------------------------------------------ complete
    scene(
      'q27-complete',
      [
        N('The Warden walks in and looks at the portrait for a long, long time.'),
        W('It looks… brighter. Younger, somehow. That founder has your chin.', 'think'),
        N('Mr. Tweed studies the ceiling. Half a grey moustache is still stuck to his lip.'),
        N('Behind his back, he presses a stack of spare frames into your hands.'),
        N('He mimes: your photos, your walls.'),
        N('The Warden is still looking. You could tell her the truth. Or you could say nothing at all.'),
      ],
      [
        think(
          5,
          m(
            'sel',
            'owning up to an accident',
            'Thought about whether to own up to an accident when nobody would ever find out.',
            'CASEL: Responsible decision-making',
          ),
          [
            N('The painting is ruined, and the Warden may never find out.'),
            N('Should you tell her what really happened?'),
          ],
          [
            opt(
              'Yes. Telling the truth is right, even when it’s awkward.',
              N('That’s a brave answer. Owning up can feel scary. But it means nobody is fooled, and people know they can trust you.'),
            ),
            opt(
              'No. It was an accident, and the photo is lovely.',
              N('That’s an honest answer: it was an accident, and the photo is lovely.'),
              N('But the Warden thinks she’s looking at the old painting. Is it fair to let her believe that? Something to think about.'),
            ),
            opt(
              'Tell her, and explain it was an accident.',
              N('That’s a thoughtful answer. Accidents happen to everyone. Saying what happened, and that you tried to fix it, is often best.'),
            ),
          ],
        ),
      ],
      [
        ch(
          'confess',
          'It’s a photo. There was a sneeze.',
          [
            W('A sneeze. Of course there was.', 'think'),
            N('She looks at the half moustache still stuck to Mr. Tweed’s lip.'),
            W('And the moustache. Did that sneeze too?'),
            W('Honestly? I prefer this one. The old one always looked cross. It stays.', 'happy'),
            N('Mr. Tweed quietly pulls the canvas out of his jacket and hands it over, rolled up like a newspaper.'),
            N('He looks lighter, somehow. Secrets are heavy things to carry up the back of a jacket.'),
          ],
          { 'q27-confessed': true },
        ),
        ch(
          'quiet',
          'Say nothing. Admire it.',
          [
            W('Well. Keep up the good work, both of you.'),
            N('As the door closes behind her, Mr. Tweed breathes out for the first time in an hour.'),
            N('The real painting is still rolled up in his jacket. Neither of you mentions it on the way out.'),
          ],
          { 'q27-confessed': false },
        ),
      ],
    ),
  ],
  [
    gloss('portrait', 'A painting, drawing or photo of a person, or of a group of people.', 'q27-hall'),
    gloss('founders', 'The people who first started something, like a club, a town or a hall.', 'q27-hall'),
    gloss('composition', 'How the things in a picture are arranged.', 'q27-lined'),
    gloss('lens', 'A curved piece of glass that bends light, like the one in a camera or in glasses.', 'q27-pose'),
    gloss('stern', 'Serious and strict-looking. (It is also the back end of a boat.)', 'q27-shot'),
    gloss('squint', 'To look with your eyes partly closed.', 'q27-shot'),
    gloss('corridor', 'A long passage inside a building, with doors along it.', 'q27-swap'),
    gloss('canvas', 'Strong cloth that artists paint on.', 'q27-swap'),
  ],
  'Lessons: sneezes and catching them (health), one hour after 2:15, composition (art, do), cameras catch light ' +
    '(1-PS4-2), the two meanings of “stern” (L.3.4), a 40 − 36 cm gap, and a think question on owning up. Both choices ' +
    'are kept; the “quiet” route now adds one line so the child can see the cost (the real painting is still hidden).',
);

// ================================================================== Q28 Do-It-Yourself
const Q28 = quest(
  'q28',
  'Do-It-Yourself',
  {
    'q28-s1': {
      goal: 'Carry every Nubbin, and anything precious, out of Mr. Tweed’s cottage.',
      hint: 'Three Nubbins are napping inside, and his bear is on the mantelpiece. Carry each one out to the garden.',
    },
    'q28-s2': {
      goal: 'Stand well back, behind the garden hedge, before the fuse runs out.',
      hint: 'Run to the far side of the hedge. The closer you stand, the yellower you get.',
    },
  },
  [
    // ------------------------------------------------ step 1: the plan
    scene(
      'q28-plan',
      [
        N('Mr. Tweed’s front room is the colour of old porridge.'),
        N('He stands in the middle of it with a tin of yellow paint and a very small brush.'),
        N('On the mantelpiece stands a card in his best handwriting: TEA. SATURDAY. EVERYONE. It isn’t addressed to anyone.'),
        N('He paints one stroke and steps back. He looks at four walls, a ceiling, and his one stroke.'),
        N('He tapes the brush to a broom. He paints the ceiling, the lampshade, a sleeping Nubbin and, briefly, himself.'),
        T('Hnn.', 'sad'),
        N('He puts down the broom and picks up a firework from the mantelpiece. A light comes on behind his eyes.'),
        N('He mimes it: firework in the tin, light it, run. Then a big BOOM with both hands, and paint landing everywhere, beautifully.'),
        T('Boom.', 'happy'),
        N('He looks at you for approval. Your Nubbin is already hiding behind your legs.'),
      ],
      [
        ask(
          3,
          m(
            'maths',
            'area of a rectangle by multiplying',
            'Found the area of a wall by multiplying its length by its height, and told area apart from perimeter.',
            '3.MD.C.7',
          ),
          [
            N('One wall is 4 metres long and 2 metres high.'),
            N('How many square metres of wall is that?'),
          ],
          [
            best(
              '8 square metres',
              N('Yes: 2 rows of 4 square metres is 8. Four walls like that make 32 square metres. That’s a lot of tiny strokes.'),
            ),
            opt(
              '6 square metres',
              N('That’s 4 add 2. For area, multiply: 2 rows of 4 square metres makes 8 square metres.'),
            ),
            opt(
              '12 metres',
              N('That’s the perimeter: the distance all the way round the edge. The area inside is 4 times 2, which is 8 square metres.'),
            ),
          ],
        ),
        notice(
          9,
          m(
            'health',
            'firework safety',
            'Heard the real rules for fireworks: only grown-ups who know how, outdoors, following the instructions, with everyone else well back.',
          ),
          [
            N('In real life, fireworks are only lit by grown-ups who know how, outdoors, following the instructions on the box.'),
            N('Everyone else stands well back. Never indoors, and never in a paint tin.'),
            N('Mr. Tweed’s plan breaks nearly every rule. That’s why the first job is getting everyone out.'),
          ],
        ),
      ],
      [
        ch(
          'no',
          'Absolutely not.',
          [
            N('He nods sympathetically and keeps unwrapping the firework.'),
            N('Then he mimes carrying Nubbins out of the door. He has heard you: safety first, then boom.'),
          ],
          { 'q28-objected': true },
        ),
        ch('outside', 'Fine. But everyone goes outside first.', [
          N('He shakes your hand firmly. Then he points at your Nubbin, the door, and his eyebrows. He’d like to keep those too.'),
        ]),
        ch(
          'light',
          'Can I light it?',
          [N('He looks at you very seriously and points to himself: his house, his firework. You may stand well back.')],
          { 'q28-asked-to-light': true },
        ),
      ],
    ),
    scene(
      'q28-cleared',
      [
        N('One by one you carry the sleepy Nubbins out into the garden. None of them wakes up.'),
        N('Three Nubbins lie on the lawn now. One of them has a yellow stripe.'),
        N('Last of all, Mr. Tweed’s bear, from the mantelpiece. You prop it on the gate post, where it can supervise.'),
        N('The front room is empty except for Mr. Tweed, the paint and the firework.'),
        N('He tucks his trousers into his socks. This is his idea of protective clothing.'),
        N('He gives you a thumbs up. You give him a long look.'),
      ],
      [
        notice(
          1,
          m(
            'art',
            'primary colours in paint',
            'Learned that yellow is a primary colour in paint, and what it makes when mixed with blue or red.',
          ),
          [
            N('Yellow is a primary colour in paint. You can’t make it by mixing other paints together.'),
            N('But you can mix it with others. Yellow and blue make green. Yellow and red make orange.'),
          ],
        ),
      ],
    ),
    // ------------------------------------------------ step 2: the fuse
    scene(
      'q28-fuse',
      [
        N('Mr. Tweed stands the firework in the paint tin, lights the fuse, and gazes at it with pride.'),
        N('The fuse fizzes and crackles. He watches it fizz.'),
        N('He keeps watching it fizz.'),
        N('You wave at him through the window. He waves back, cheerfully.'),
        N('You point at the fuse. He looks at the fuse. Then at you. Then at the door.'),
        T('Oh!', 'shock'),
        N('He runs, and you run. Your Nubbin is somehow already behind the far hedge.'),
      ],
      [
        ask(
          2,
          m(
            'literacy',
            'sound words (onomatopoeia)',
            'Recognised words that sound like the noise they name, such as “fizz” and “crackle”.',
            'RL.1.4',
          ),
          [
            N('“Fizz” sounds like the noise it names. Words like that are called onomatopoeia.'),
            N('Which of these is a sound word too?'),
          ],
          [
            best('Crackle', N('Yes. Say it out loud: crackle. It sounds just like a fuse burning.')),
            opt('Fuse', N('A fuse makes a noise, but “fuse” doesn’t sound like one. “Crackle” does: say it out loud.')),
            opt('Yellow', N('Yellow is a colour word, not a sound word. “Crackle” sounds like the noise it names.')),
          ],
        ),
      ],
    ),
    // ------------------------------------------------ complete
    scene(
      'q28-complete',
      [
        N('FWUMP. Every window goes yellow at once. The chimney puffs out a small yellow cloud.'),
        N('You creep back and look inside. Walls, ceiling, floor, clock: all yellow. It is, honestly, a good job.'),
        N('There is one perfect porridge-coloured rectangle on the wall, where the picture hung.'),
        N('A single drop falls from the lampshade onto Mr. Tweed’s head. He doesn’t notice. He is far too happy.'),
        T('Ha!', 'happy'),
        N('He hands you a wide, flat brush and mimes one huge swish over the whole garden path. Big jobs, one go.'),
        N('Then he mimes the firework, and shakes his head very firmly. The brush, yes. The boom, no.'),
        N('On the way home, you mention the card on his mantelpiece to a few neighbours. They mention it to a few more.'),
        N('On Saturday the yellow room is full of people, and Mr. Tweed has no idea where to put himself.'),
        N('He ends up in the doorway holding the teapot, beaming at everyone. He forgets to pour anybody tea for nearly an hour.'),
      ],
      [
        ask(
          2,
          m(
            'science',
            'objects block things that travel outwards, like a shadow',
            'Explained a paint-free patch by comparing it to a shadow: something in the way blocks what travels towards it.',
          ),
          [N('Why is there a porridge-coloured rectangle where the picture was?')],
          [
            best(
              'The picture was in the way, so no paint landed behind it.',
              N('Yes. The paint flew outwards from the tin, and the picture blocked it.'),
              N('It’s a bit like a shadow. Something in the way of light leaves a dark shape behind it.'),
            ),
            opt(
              'He painted carefully round it.',
              N('He was busy running! The picture blocked the flying paint, a bit like an object blocks light to make a shadow.'),
            ),
            opt(
              'Yellow paint doesn’t stick there.',
              N('It stuck everywhere else! The picture was in the way of the flying paint, so none reached the wall behind it.'),
            ),
          ],
        ),
        think(
          9,
          m(
            'sel',
            'understanding shyness and loneliness',
            'Thought about why inviting people can feel hard, and how others can help someone who is lonely.',
            'CASEL: Social awareness',
          ),
          [
            N('Mr. Tweed wrote “TEA. SATURDAY. EVERYONE.” But he never gave the card to anyone.'),
            N('Why might someone find it hard to invite people?'),
          ],
          [
            opt(
              'They might be scared nobody will come.',
              N('That’s a thoughtful answer. Asking can feel risky: what if nobody says yes? That’s why it means so much when people do.'),
            ),
            opt(
              'They might be shy.',
              N('That’s a kind answer. Shy people often want company just as much as anyone. The first step is just harder.'),
            ),
            opt(
              'I don’t think it’s hard.',
              N('That’s great, if it feels easy for you! For some people it’s one of the hardest things. You could be the one who helps.'),
            ),
          ],
        ),
      ],
    ),
  ],
  [
    gloss('mantelpiece', 'The shelf above a fireplace.', 'q28-plan'),
    gloss('approval', 'Someone showing they think what you are doing is good.', 'q28-plan'),
    gloss('supervise', 'To watch over something to make sure it goes well.', 'q28-cleared'),
    gloss('protective', 'Keeping you safe from harm.', 'q28-cleared'),
    gloss('fuse', 'A string that burns slowly, to light a firework from a safe distance.', 'q28-fuse'),
    gloss('beaming', 'Smiling a big, bright, happy smile.', 'q28-complete'),
  ],
  'Lessons: area of a 4 m × 2 m wall vs its perimeter, firework safety (health), yellow as a primary colour, ' +
    'onomatopoeia, the unpainted rectangle as a kind of shadow, and a think question on shyness and loneliness. ' +
    'The complete scene adds one line: the player passes on news of the tea card, which is why half the lane comes. ' +
    'The blast stays a soft cartoon FWUMP; the reward is the brush, never fireworks.',
);

// ================================================================== Q29 Mind the Egg
const Q29 = quest(
  'q29',
  'Mind the Egg',
  {
    'q29-s1': {
      goal: 'Put Odette’s egg down somewhere flat in your garden.',
      hint: 'Set the egg on flat ground near your cottage. Not on the slope. Definitely not on the slope.',
    },
    'q29-s2': {
      goal: 'Catch the runaway egg before it reaches the stream.',
      hint: 'Get ahead of it and wait on the path: tapping it from behind only makes it faster. Mr. Tweed’s hat counts as a catch.',
    },
    'q29-s3': {
      goal: 'Give the egg back to Odette at the gate, safe and sound.',
      hint: 'Odette waits at your gate at sunset. Carry the egg to her and choose Give.',
    },
  },
  [
    // ------------------------------------------------ step 1: the handover
    scene(
      'q29-handover',
      [
        O('Hello! You must be Hazel’s grandchild. I’m Odette, from over the ridge. I hear you’re good with eggs.', 'happy'),
        O('I’ve an appointment in the village this afternoon, and eggs aren’t allowed in the waiting room. Silly rule. Would you mind this one?'),
        N('She puts a speckled egg in your hands. It is warm, and rounder on one side than eggs usually are.'),
        O('It’s an easy egg. It just likes to roll. Keep it on something flat and it’s no trouble at all. Back by sunset!'),
        N('She waves and goes. The egg sits in your palm, perfectly still.'),
        N('The moment you look away, it wobbles.'),
        N('Mr. Tweed leans over the fence and looks at the egg. He mimes rocking a baby. Then he mimes it rolling away.'),
        T('Hm.', 'think'),
      ],
      [
        notice(
          3,
          m(
            'science',
            'parents keep eggs warm',
            'Learned that many bird parents sit on their eggs to keep them warm so the baby inside can grow.',
            '1-LS1-2',
          ),
          [
            N('Many bird parents sit on their eggs to keep them warm. In lots of kinds of bird, both parents take turns.'),
            N('Warmth helps the baby inside to grow. A warm egg is a precious thing to be trusted with.'),
          ],
        ),
      ],
      [
        ch('promise', 'I’ll guard it with my life.', [N('Mr. Tweed nods gravely and salutes the egg. The egg wobbles.')]),
        ch(
          'ask',
          'Mr. Tweed, could you help?',
          [N('He points at himself, startled. Then he takes off his hat and holds it out like a nest. He is ready.')],
          { 'q29-tweed-help': true },
        ),
      ],
    ),
    scene(
      'q29-roll',
      [
        N('You choose a flat spot in your garden and set the egg down. It sits. It considers.'),
        N('Mr. Tweed lies flat on the grass and shuts one eye. He is checking whether the ground is level.'),
        N('He squints along the grass one way, then the other.'),
        N('It is level. He gives the egg a thumbs up.'),
        N('The egg sits perfectly still.'),
        N('Somewhere nearby, a Nubbin sneezes.'),
        N('The egg sets off.'),
      ],
      [
        ask(
          4,
          m(
            'science',
            'balanced forces on level ground',
            'Explained that a round object stays still on level ground but rolls on a slope, because of gravity.',
            '3-PS2-1',
          ),
          [N('Why does a round egg stay still on level ground, but roll away on a slope?')],
          [
            best(
              'On level ground there’s no downhill for gravity to pull it towards.',
              N('Yes. On level ground the pushes and pulls on the egg are balanced, so it stays put.'),
              N('Tip the ground, or give it a nudge, and it’s off.'),
            ),
            opt(
              'The egg gets tired on flat ground.',
              N('Ha! Eggs don’t get tired. On level ground gravity pulls straight down, so the egg has no downhill to roll towards.'),
            ),
            opt(
              'Flat ground is sticky.',
              N('Grass does grip a little. But the big reason is gravity: on level ground, there’s no downhill for it to pull the egg towards.'),
            ),
          ],
        ),
      ],
    ),
    // ------------------------------------------------ step 2: the chase
    scene(
      'q29-chase',
      [
        N('The egg rolls down the garden path, gathering speed and looking, somehow, delighted.'),
        N('It bumps off a fence post and takes the left fork, towards the bridge.'),
        N('Mr. Tweed vaults the fence, mostly, and sets off after it, holding his hat out in front of him.'),
        T('Egg!', 'shock'),
        N('It rattles over the bridge and past the dojo, where three karate Nubbins bow to it as it goes by.'),
        N('Mr. Tweed takes a shortcut through a hedge. He comes out ahead of the egg, wearing most of the hedge.'),
        N('Beyond the dojo is the stream. You would rather not find out whether this egg can swim.'),
      ],
      [
        ask(
          1,
          m(
            'social-studies',
            'compass directions: left and right facing north',
            'Worked out that when you face north, west is on your left and east is on your right.',
            'D2.Geo.2.K-2',
          ),
          [N('The garden path runs north. The egg takes the left fork. If you face north, which way is left?')],
          [
            best(
              'West',
              N('Yes. Face north, and west is on your left and east is on your right.'),
              N('To remember the order going round clockwise, try: Never Eat Shredded Wheat. North, east, south, west.'),
            ),
            opt('East', N('East is on your right when you face north. Your left is west.')),
            opt('South', N('South is behind you when you face north. Your left is west, and your right is east.')),
          ],
        ),
      ],
    ),
    scene(
      'q29-caught',
      [
        N('You dive. Mr. Tweed dives.'),
        N('The egg bounces off your hands, then off his head, and lands neatly in his hat.'),
        N('For a moment, nobody moves.'),
        N('Then Mr. Tweed holds the hat up high, muddy and triumphant.'),
        T('Ha!', 'happy'),
        N('The egg sits in the hat and wobbles, very slightly. It looks as if it enjoyed that.'),
      ],
      [
        notice(
          3,
          m(
            'sel',
            'teamwork',
            'Noticed how two people each doing their part achieved something neither could do alone.',
            'CASEL: Relationship skills',
          ),
          [
            N('Neither of you could have caught it alone. Your hands slowed it down, and his hat caught it.'),
            N('That’s teamwork: each person does their part, and together it works.'),
          ],
        ),
      ],
    ),
    // ------------------------------------------------ step 3: the afternoon
    scene(
      'q29-afternoon',
      [
        N('For the rest of the afternoon, nobody puts the egg down.'),
        N('Mr. Tweed knits it a little woolly cosy with a hole for the top. It is lumpy. The egg seems to like it.'),
        N('He keeps his hat off all afternoon, upside down beside the egg, just in case.'),
        N('You line an old fruit box with a blanket and put it on wheels.'),
        N('Then you wedge a stone against the wheels at each end, for brakes.'),
        N('The egg wobbles once, tries the box, and decides to stay.'),
        N('There is room in the box for two. Your own eggs look at it with interest.'),
        N('As the sun goes down, Odette comes back over the ridge.'),
      ],
      [
        ask(
          4,
          m(
            'science',
            'how a wedge works as a brake',
            'Explained that a wedge pressed against a wheel pushes back on it, so the wheel can’t turn.',
            '3-PS2-1',
          ),
          [N('Why do the stones stop the box from rolling away?')],
          [
            best(
              'They press against the wheels, so the wheels can’t turn.',
              N('Yes. A wedge jammed against a wheel pushes back on it. The pushes balance, and the box stays put.'),
            ),
            opt(
              'They make the box heavier.',
              N('The stones aren’t in the box, though! They’re jammed against the wheels, pushing back, so the wheels can’t turn.'),
            ),
            opt(
              'The egg cosy holds it still.',
              N('The cosy is very good at being lumpy, but not at holding things still! The stones push against the wheels so they can’t turn.'),
            ),
          ],
        ),
      ],
    ),
    // ------------------------------------------------ complete
    scene(
      'q29-complete',
      [
        O('There it is, safe and sound. And wearing a jumper!', 'happy'),
        N('Mr. Tweed bows modestly. The cosy has his initial knitted on it, a T. Upside down.'),
        N('You tilt your head to read it. It looks like a lamp post standing on a pavement.'),
        O('Keep the cosy, it suits your eggs. And keep that box. Two eggs side by side, on wheels? That’s a pram, that is.'),
        N('She slips the cosy off and hands it back to you. Mr. Tweed passes her the egg last of all.'),
        N('He holds on a moment longer than he needs to, pats it twice, and lets go. She tucks it into her basket.'),
        O('So. Was it good?'),
      ],
      [
        ask(
          2,
          m(
            'maths',
            'lines of symmetry in letters',
            'Explained that an H looks the same flipped top to bottom because it has a line of symmetry straight across the middle, and a T does not.',
            '4.G.A.3',
          ),
          [N('Upside down, Mr. Tweed’s T turned into a lamp post.'), N('Which of these letters would look exactly the same knitted upside down?')],
          [
            best(
              'H',
              N('Yes. An H has a line of symmetry straight across the middle. Flip it top to bottom and it matches itself.'),
              N('Nobody would ever know. Except Mr. Tweed.'),
            ),
            opt(
              'T',
              N('That’s the one he tried! A T’s only line of symmetry runs up and down, so upside down it turns into a lamp post.'),
              N('An H has a line of symmetry straight across the middle, so it matches itself upside down.'),
            ),
            opt(
              'R',
              N('An R has no line of symmetry at all, so upside down it looks very odd indeed.'),
              N('An H has a line of symmetry straight across the middle, so it matches itself upside down.'),
            ),
          ],
        ),
        think(
          6,
          m(
            'sel',
            'honesty when someone trusts you',
            'Thought about how to answer honestly and kindly when someone who trusted you asks how it went.',
            'CASEL: Responsible decision-making',
          ),
          [N('Odette asks if it was good. The egg did go rolling off, but it’s safe now. What would you tell her?')],
          [
            opt(
              'Tell her it went for a roll.',
              N('That’s an honest answer. Odette trusted you, and the truth helps her know her egg better.'),
            ),
            opt(
              'Say it was perfect. It’s safe now, after all.',
              N('That’s a kind thought: you don’t want to worry her, and the egg is safe.'),
              N('But she might like to know her egg is a roller. Something to think about.'),
            ),
            opt(
              'Tell her, and tell her the funny bits too.',
              N('That’s a great answer. The truth can be told kindly, and even with a laugh.'),
            ),
          ],
        ),
      ],
      [
        ch(
          'honest',
          'It went for a little roll.',
          [O('They always do. That’s why I asked a good Keeper and not the waiting room.', 'happy')],
          { 'q29-told': true },
        ),
        ch('angel', 'A perfect angel.', [
          N('Behind you, Mr. Tweed slowly picks a twig out of his hair.'),
          N('Odette notices. Odette, kindly, says nothing. But she glances at the twig, and then at you.'),
        ]),
      ],
    ),
  ],
  [
    gloss('appointment', 'A time you have agreed to meet someone, like a doctor.', 'q29-handover'),
    gloss('speckled', 'Covered in lots of tiny spots.', 'q29-handover'),
    gloss('level', 'Perfectly flat, with no slope either way.', 'q29-roll'),
    gloss('fork', 'A place where a path splits into two. (It is also something you eat with.)', 'q29-chase'),
    gloss('vaults', 'Jumps over something, often pushing off with the hands.', 'q29-chase'),
    gloss('triumphant', 'Full of joy and pride after winning or succeeding.', 'q29-caught'),
    gloss('wedge', 'To jam something tightly into a space so it holds firm.', 'q29-afternoon'),
    gloss('initial', 'The first letter of a name.', 'q29-complete'),
  ],
  'Lessons: parents keep eggs warm (1-LS1-2), balanced forces on level ground, west is left when facing north, ' +
    'teamwork, wedges as brakes, lines of symmetry in letters (the upside-down initial joke), and a think question on honesty ' +
    'when trusted. The original “eggs float, mostly” line is rewritten so the scene teaches nothing untrue.',
);

// ================================================================== Q30 The Three-Wheeler
const Q30 = quest(
  'q30',
  'The Three-Wheeler',
  {
    'q30-s1': {
      goal: 'Meet Rufus at the start line and enter the ridge race in your hand cart.',
      hint: 'Ride your hand cart to the start line on the ridge track, and talk to Rufus.',
    },
    'q30-s2': {
      goal: 'Win the race. Each time you draw level with the Bluebell on a bend, it tips over: make that happen three times.',
      hint: 'Draw level with the Bluebell on a bend and Mr. Tweed will wave. Do it three times, then cross the line first.',
    },
  },
  [
    // ------------------------------------------------ step 1: the start line
    scene(
      'q30-meet',
      [
        N('A bright blue three-wheeled cart rattles up the lane. It has one wheel at the front and a great deal of confidence.'),
        R('Afternoon! Rufus Crankshaw. And this is the Bluebell. Fastest three wheels this side of the ridge.', 'happy'),
        N('Mr. Tweed is riding in the back of your hand cart, the one he gave you. He looks at the Bluebell’s single front wheel.'),
        N('He smiles a very small smile.'),
        R('Is that a race face? That’s a race face. One lap of the ridge track. Winner gets bragging rights.'),
        N('Mr. Tweed points forward like a ship’s captain. Then he holds up three fingers and tips his flat hand gently onto its side.'),
        T('Three.'),
      ],
      [
        ask(
          5,
          m(
            'science',
            'why a narrow base tips more easily',
            'Explained that a three-wheeled cart’s narrow triangle of wheels lets its weight lean past the edge on a bend.',
          ),
          [N('Mr. Tweed thinks the Bluebell will tip over three times. Why might a cart with one front wheel tip on a bend?')],
          [
            best(
              'Its wheels make a narrow triangle, so its weight can lean out past the edge.',
              N('Yes. Join up the three wheels and you get a triangle, narrow at the front.'),
              N('On a bend, the weight swings outwards. If it leans past the edge of that triangle, over it goes.'),
            ),
            opt(
              'Blue carts are tippy.',
              N('Ha! Colour makes no difference. It’s the narrow triangle of wheels: on a bend, the weight can lean past its edge.'),
            ),
            opt(
              'Three is an unlucky number.',
              N('Numbers can’t be lucky or unlucky! It’s the narrow triangle of wheels. On a bend, the weight can lean out past its edge.'),
            ),
          ],
        ),
      ],
      [
        ch('race', 'You’re on.', [R('Splendid! Mind your wheels. All four of them, show-off.', 'happy')]),
        ch(
          'warn',
          'Is the Bluebell… stable?',
          [
            R('Stable as a table! A three-legged table, which is the steadiest kind. Ask anyone.'),
            N('Behind him, the Bluebell tips gently onto its side, all by itself.'),
            R('…It does that.', 'think'),
            N('Rufus is half right. Three legs never wobble on bumpy ground. But a narrow base can still tip over sideways.'),
          ],
          { 'q30-warned': true },
        ),
      ],
    ),
    scene(
      'q30-grid',
      [
        N('Two carts on the start line.'),
        N('Rufus revs the Bluebell by saying “brrm” quite loudly.'),
        N('Mr. Tweed climbs out and polishes the front of your cart with his sleeve.'),
        N('Then he walks over and polishes the front of the Bluebell too, just as carefully.'),
        R('Very sporting of you!', 'happy'),
        N('Mr. Tweed climbs back in, folds his hands, and nods. Now it’s a race.'),
      ],
      [
        ask(
          3,
          m(
            'social-studies',
            'fairness: treating both sides the same',
            'Explained that a fair contest starts with both sides treated the same.',
            'D2.Civ.8.K-2',
          ),
          [N('Why does Mr. Tweed polish the Bluebell too?')],
          [
            best(
              'To be fair: both carts get the same.',
              N('Yes. A fair race starts with both sides treated the same. Then whoever wins, wins properly.'),
            ),
            opt(
              'He just likes polishing.',
              N('He probably does! But he did it just as carefully as yours. He wants both carts treated the same, and that’s fair.'),
            ),
            opt(
              'To trick Rufus.',
              N('Good suspicious thinking! But a shiny front doesn’t slow anyone down. He’s treating both carts the same, to be fair.'),
            ),
          ],
        ),
      ],
    ),
    // ------------------------------------------------ step 2: the race
    scene(
      'q30-race',
      [
        N('The flag drops. Rufus shoots off the line, waving.'),
        N('In the back of your cart, Mr. Tweed points at the Bluebell, then at a gap on the inside of the bend.'),
        N('Every time you draw level, he leans out and gives Rufus a cheerful little wave.'),
        N('Every time, Rufus waves back. The Bluebell leans, and leans, and gently tips over.'),
        R('Not to worry! It does that!', 'happy'),
        N('He rights it with one hand and is off again. He is very, very good at righting it.'),
        T('Ha!', 'happy'),
      ],
      [
        ask(
          5,
          m(
            'maths',
            'adding time across a minute',
            'Added seconds to a lap time and crossed into the next minute, knowing 60 seconds make 1 minute.',
            '3.MD.A.1',
          ),
          [
            N('Each tip costs Rufus 2 seconds. Without tipping, his lap would take 3 minutes 58 seconds.'),
            N('After three tips, what is his time?'),
          ],
          [
            best(
              '4 minutes 4 seconds',
              N('Yes. Three tips cost 6 seconds. 3 minutes 58 seconds and 2 more makes 4 minutes. Then 4 more: 4 minutes 4 seconds.'),
            ),
            opt(
              '3 minutes 64 seconds',
              N('Good adding! But 60 seconds make a minute, so 3 minutes 64 seconds is really 4 minutes 4 seconds.'),
            ),
            opt(
              '4 minutes 0 seconds',
              N('That’s just one tip: 2 seconds. Three tips is 6 seconds, which takes him to 4 minutes 4 seconds.'),
            ),
          ],
        ),
        think(
          6,
          m(
            'sel',
            'what makes a win fair',
            'Thought about whether a win is fair when the other side keeps having bad luck, and why it matters.',
            'CASEL: Responsible decision-making',
          ),
          [N('Is it fair to win because the Bluebell keeps tipping over whenever Rufus waves?')],
          [
            opt('No. We should win fairly.', N('That’s a fair-minded answer. A win feels best when you know you earned it.')),
            opt(
              'Yes. Rufus chooses to wave.',
              N('That’s a thoughtful point. Nobody is tricking him: he waves at everyone. Maybe the real problem is his cart.'),
            ),
            opt(
              'It’s fine, because everyone is having fun.',
              N('That’s a lovely way to see it. Rufus is laughing more than anybody. Sometimes how you play matters more than who wins.'),
            ),
          ],
        ),
      ],
      [
        ch(
          'stop-waving',
          'Tell Mr. Tweed to stop waving. Win it fair.',
          [
            N('Mr. Tweed looks wounded, and sits on his hands.'),
            N('On the next bend Rufus draws level, sees you, and waves anyway. The Bluebell tips over.'),
            R('Not to worry! I just like waving!', 'happy'),
            N('Mr. Tweed slowly takes his hands out from under him. It was never his fault. He looks enormously relieved.'),
          ],
          { 'q30-fair': true },
        ),
        ch('keep-waving', 'Let him wave. It’s only friendly.', [
          N('Mr. Tweed waves so warmly that a Nubbin on the verge waves back, and also tips over.'),
        ]),
      ],
    ),
    // ------------------------------------------------ complete
    scene(
      'q30-complete',
      [
        N('You cross the line first. The Bluebell crosses second, on its side, sliding.'),
        R('Ha! What a race! Three tips! That’s a personal best. Or worst. One of those.', 'happy'),
        N('Mr. Tweed shakes his hand. Rufus shakes back so hard that the Bluebell, parked, tips over again.'),
        R('Tell you what. I’ve an old one at home. Smaller. Tips if you breathe near it. Your Nubbins would love it.'),
        N('Next morning there is a little blue three-wheeler in your garden.'),
        N('A Nubbin bumps it. It tips. The Nubbin is thrilled.'),
        N('It bumps it again. Then it stands with its feet wide apart, just in case.'),
      ],
      [
        notice(
          1,
          m(
            'sel',
            'being a good sport',
            'Noticed what being a good sport looks like: trying hard, shaking hands and enjoying the game whoever wins.',
            'CASEL: Relationship skills',
          ),
          [
            N('Rufus lost, and he’s laughing. That’s being a good sport.'),
            N('You try your hardest, you shake hands at the end, and you enjoy the game, whoever wins.'),
          ],
        ),
        act(
          6,
          m(
            'science',
            'a wider base is steadier',
            'Felt the difference between standing with feet together and feet apart when gently nudged.',
          ),
          'edu:stand:balance:feet-wide-narrow',
          [
            N('Try it like the Nubbin. Stand with your feet close together, and ask someone to give your shoulder a gentle nudge.'),
            N('Now stand with your feet wide apart, and try the nudge again. Much steadier!'),
            N('A wider base is harder to tip. That’s why four wheels in a wide rectangle are steadier than three in a narrow triangle.'),
          ],
        ),
      ],
    ),
  ],
  [
    gloss('confidence', 'Feeling sure of yourself.', 'q30-meet'),
    gloss('bragging', 'Showing off about how good you are.', 'q30-meet'),
    gloss('sporting', 'Fair and generous to the other side in a game or race.', 'q30-grid'),
    gloss('rights', 'Stands something back up the right way. (It has other meanings too.)', 'q30-race'),
    gloss('thrilled', 'Very excited and pleased.', 'q30-complete'),
  ],
  'Lessons: why a narrow triangle of wheels tips on a bend, fairness (D2.Civ.8.K-2), a two-step time sum across a ' +
    'minute (3 min 58 s + 6 s), a think question on fair wins, being a good sport, and a feet-wide balance test (do). ' +
    'The “warn” choice adds one line correcting Rufus’s “steadiest kind” claim: three legs never wobble, but a narrow ' +
    'base can still tip.',
);

// ================================================================== exports
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

/** Q27 payoff: the player who wanted to tell, then stayed quiet. */
const q27ReaderQuiet = (c: Choice): Choice =>
  c.id === 'quiet'
    ? {
        ...c,
        then: [
          ...(c.then ?? []),
          N('Mr. Tweed taps the clock, then points at you: try first, then tell. He waits. He is very good at waiting.'),
        ],
      }
    : c;
export const EDU_BEAN_READER_VARIANTS: EduScene[] = [
  completeWith(
    Q27,
    'q27-complete-told',
    0,
    [],
    0,
    Q27.scenes.find((s) => s.of === 'q27-complete')?.choices?.map(q27ReaderQuiet),
  ),
];

export const EDU_BEAN_READER: EduQuest[] = [Q21, Q22, Q23, Q24, Q25, Q26, Q27, Q28, Q29, Q30];

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  'edu:order:pumpkin-life-cycle:5',
  'edu:breathe:slow:3',
  'edu:order:sandwich-steps:6',
  'edu:place:nubbins:chalk-marks:3',
  'edu:stand:balance:feet-wide-narrow',
];
