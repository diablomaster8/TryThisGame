/**
 * The Learning Grove, reader band (ages 7–10): educational versions of the fun quests
 * Q1–Q10 (the first half of the Python pack, quests-python.ts).
 *
 *   Q1  Two Shrubberies           suspense, shrubs and leaves, measuring in cm, terraces and erosion
 *   Q2  The Plank Knight          snails, insulation, a two-step scarf sum, light and seeing, eye tests
 *   Q3  The Bridge of Questions   tally marks, ducks’ waterproof feathers, speed, fair tests
 *   Q4  Clip-Clop                 sound and vibration, floating coconuts, headwinds, halves, gaits
 *   Q5  The Rabbit at the Ledge   prey animals’ eyes, defining a problem, odd numbers, air resistance
 *   Q6  The Wooden Rabbit         handling teasing, metres and centimetres, friction, legends, motive
 *   Q7  The Grand Palace          kind feedback, weathering, scale, perspective, echoes, symmetry
 *   Q8  The Aqueduct Committee    Roman aqueducts, gravity, wilting, area, tally charts, grumbling
 *   Q9  The Gourd and the Shoe    gourds, evidence vs bad reasoning, balance, gaps in a line
 *   Q10 Haggle                    markets, exaggeration, number patterns, pretending vs lying, change
 *
 * One EduScene per original scene (every step scene, every done scene and the complete scene).
 * Every choice keeps its original id and `set`; reader keeps every choice. The comedy stays: it
 * is the hook, and each lesson comes out of a joke. No original film or show quotes appear
 * anywhere (the Learning Grove rule): every approved quote in the main script is replaced by a
 * new line, and quest titles that echo a quote are renamed. Karate stays cartoonish and nobody
 * is hurt. See EDU-STYLE.md. British spelling.
 */
import type { EduDomain, EduQuest, EduScene, GlossaryEntry, Lesson, LessonOption } from './types';
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
/** Any other answer (or any answer to a think question): the reply honours it or kindly teaches. */
const opt = (label: string, ...reply: Line[]): LessonOption => ({ label, reply });

const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice =>
  set ? { id, label, set, then } : { id, label, then };

const scene = (of: string, lines: Line[], lessons: LessonIn[], choices?: Choice[]): EduScene => {
  const s: EduScene = {
    id: `reader:${of}`,
    of,
    band: 'reader',
    lines,
    lessons: lessons.map((l, i) => ({ id: `reader:${of}-l${i + 1}`, ...l })),
  };
  if (choices) s.choices = choices;
  return s;
};

const quest = (
  of: string,
  title: string,
  goals: EduQuest['goals'],
  scenes: EduScene[],
  glossary: GlossaryEntry[],
  notes: string,
): EduQuest => ({ id: `reader:${of}`, of, band: 'reader', title, goals, scenes, glossary, notes });

const g = (word: string, meaning: string, of: string): GlossaryEntry => ({ word, meaning, scene: `reader:${of}` });

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

// ================================================================ Q1 Two Shrubberies
const Q01 = quest(
  'q01',
  'Two Shrubberies',
  {
    'q01-s1': {
      goal: 'Bring the hooded three a shrubbery.',
      hint: 'Buy a flower bed in the Decorate shop and place it. The hoods will call it a shrubbery.',
    },
    'q01-s2': {
      goal: 'Make a second shrubbery, a little higher, with a beetle-sized path, and place it by the first.',
      hint: 'Place a second flower bed and a path stone beside the first one.',
    },
  },
  [
    scene(
      'q01-intro',
      [
        N('The waterfall path is blocked. Three Nubbins in long brown hoods stand shoulder to shoulder, which for Nubbins means elbow to elbow.'),
        N('The middle one is taller than the others. Look closer: it is standing on a log.'),
        HS('GRONK!', 'angry'),
        N('Your Nubbin flinches. A small bird leaves a nearby tree and does not come back.'),
        Y('Could we just get past, please?'),
        TH('You may not. Not until you bring us the one thing our hearts are set on.', 'think'),
        N('There is a long pause, full of suspense. Everyone waits to hear what comes next. The hoods sway.'),
        TH('It is green. It is leafy. It is… a bush. A tidy little bush. A shrubbery.', 'angry'),
        N('The other two nod gravely. One of them was not expecting it and nods a moment late.'),
      ],
      [
        ask(
          7,
          m('literacy', 'how writers build suspense', 'Noticed how a pause (written “…”) builds suspense before a big reveal.'),
          [N('Look at the Tall Hood’s words: “It is… a bush.”'), N('Why do you think the writer put “…” before the big reveal?')],
          [
            best(
              'To make us wait and wonder: suspense.',
              N('Yes. The dots are a pause. A pause makes the reader lean in and wonder what is coming.'),
              N('Then the answer lands: a bush. The bigger the pause, the sillier the answer feels.'),
            ),
            opt(
              'Because the Tall Hood forgot the word.',
              N('Ha! It might have. But here the dots are on purpose. They make a pause, so we wait and wonder.'),
              N('That waiting feeling is called suspense. Writers use it right before a surprise.'),
            ),
            opt(
              'It doesn’t mean anything.',
              N('Read it aloud and stop at the dots. Hear the wait? That pause builds suspense.'),
              N('Writers use “…” to make us lean in before a surprise. Here, the surprise is a bush.'),
            ),
          ],
        ),
      ],
      [
        ch('what-kind', 'What sort of shrubbery?', [
          TH('A tidy one. About knee-high, on a Nubbin. With leaves. Leaves are important.', 'think'),
          N('The hood on the left whispers something. The Tall Hood adds, firmly: “Green.”'),
        ]),
        ch(
          'chant-back',
          'Chant back at them.',
          [
            N('You make the loudest, strangest noise you can manage.'),
            N('The hooded three look at one another. The one on the right writes something down.'),
          ],
          { 'q01-chanted': true },
        ),
        ch('agree', 'One shrubbery. Coming up.', [TH('Good. We shall wait here. Swaying.', 'happy')]),
      ],
    ),
    scene(
      'q01-first',
      [
        N('You set the shrubbery down by the falls. It is a neat little bush of reeds and twigs, with fresh leaves.'),
        N('The hooded three lean over it and inspect it from every side, including underneath.'),
        N('To inspect something is to look at it very carefully. They take this seriously. One uses a magnifying leaf.'),
        TH('This shrubbery pleases us. It has leaves. We approve of the leaves.', 'happy'),
        TH('A shrubbery without leaves is just a pile of sticks with ideas.', 'think'),
        N('They chant once more, softly, as a kind of thank-you. The bird does not come back for that either.'),
      ],
      [
        notice(
          3,
          m(
            'science',
            'what a shrub is, and what leaves do',
            'Learned that a shrub is a woody plant with many stems, and that leaves use sunlight to make a plant’s food.',
            '2-LS2-1',
          ),
          [
            TH('Do you know what makes a shrub a shrub? Woody stems. Lots of them, all from near the ground.'),
            TH('A tree usually has one big trunk and grows much taller. A shrub stays low and bushy.'),
            TH('And the leaves are the kitchen. They use sunlight, air and water to make the plant’s food.', 'happy'),
          ],
        ),
      ],
    ),
    scene(
      'q01-second',
      [
        N('You step towards the path. The Tall Hood raises one paw.'),
        TH('Wait. There is a second thing.', 'think'),
        Y('You said one shrubbery.'),
        TH('We did. We have grown since then. As people.'),
        TH('Bring us another. It goes next to this one, but up a step, so the two look terraced, like stairs up a hill.'),
        TH('And a small path between them. Not a big path. The sort of path a beetle would enjoy.'),
        N('The other two hoods nod. One holds its paws a beetle-width apart, to help.'),
        Y('And then we can pass?'),
        TH('Then we shall discuss it.', 'happy'),
        TH('Also, we are no longer the Hooded Three. We have a new name. It goes like this.', 'think'),
        N('It makes a noise like a tea tray falling down a staircase full of spoons. The other two join in, slightly behind.'),
        Y('I can’t say that.'),
        TH('Nobody can. That is what makes it so frightening.', 'happy'),
      ],
      [
        act(
          6,
          m(
            'maths',
            'measure length in centimetres',
            'Measured a beetle-sized path with a ruler (2 cm) and compared centimetres with metres.',
            '2.MD.A.1',
          ),
          'edu:measure:beetle-path:2cm',
          [
            TH('Measure the gap between my colleague’s paws. Use the ruler from your bag. Line up the zero.'),
            N('The gap is 2 centimetres: about as wide as a beetle walking along with its legs out.'),
            TH('Excellent. A metre is 100 of those. That would be a path for a horse. We are not catering for horses.'),
          ],
        ),
      ],
      [
        ch('fair', 'Fine. A little higher, with a path.', [TH('Good. Use gravel. We have strong feelings about gravel.')]),
        ch(
          'imaginary',
          'Can the path be imaginary?',
          [TH('No. We tried that once. Somebody fell off it.', 'sad')],
          { 'q01-imaginary-path': true },
        ),
      ],
    ),
    scene(
      'q01-terraced',
      [
        N('Two shrubberies, one a little higher than the other, with a tiny gravel path wandering between them.'),
        N('It is, you have to admit, rather lovely.'),
        TH('Oh. Oh, that is nice.', 'soft'),
        N('Just then a rain cloud drifts over the falls and lets go. Everyone huddles under the hoods’ hoods.'),
        N('The rain runs down the hill. On the terrace it slows, soaks in, and stays where the roots are.'),
        TH('Look at that. The water is staying put. Our steps are doing a job.', 'think'),
        N('Below the path, on the bare slope, a little stream of muddy water carries soil away.'),
      ],
      [
        notice(
          6,
          m(
            'science',
            'how terraces and roots slow erosion',
            'Learned that terraces and plant roots slow rainwater so it does not wash soil away (erosion).',
            '4-ESS2-1',
          ),
          [
            N('When rain rushes down a bare slope, it carries soil with it. That slow wearing away of land is called erosion.'),
            N('Flat steps called terraces slow the water down, and plant roots hold the soil together.'),
            N('Farmers in hilly places have built terraces for thousands of years, for exactly this reason.'),
          ],
        ),
      ],
    ),
    scene(
      'q01-complete',
      [
        N('The hooded three step aside. Then they step back again, because they want to keep looking at the shrubbery.'),
        TH('You may pass. You may pass every day, in fact. We shall be here.'),
        Y('Here? For good?'),
        TH('There is a terrace, and a path. Where else would we go?', 'happy'),
        TH('We guarded this path for years, you know. We never once asked what was at the other end of it.', 'think'),
        TH('A shrubbery is a much better reason to stand somewhere.', 'soft'),
        N('They settle on a flat rock by the falls. One produces a tiny rake and starts tidying the gravel.'),
        N('The terraced shrubbery is yours to move anywhere you like. They hope you won’t. They will forgive you if you do.'),
        N('At dusk you can hear them practising their new name. They have still not got all the way through it.'),
      ],
      [
        ask(
          5,
          m(
            'sel',
            'think question: doing things just because we always have',
            'Thought about why people keep doing something out of habit, and what it means to find a better reason.',
            'CASEL: Self-awareness',
          ),
          [
            TH('We stood here for years, guarding a path, and never asked why.', 'think'),
            TH('Why do you think someone keeps doing a thing for years without asking what it is for?'),
          ],
          [
            opt(
              'Because it’s a habit, and habits are comfy.',
              TH('Yes. A habit is like a well-worn path. Your feet follow it without asking your head.', 'think'),
              TH('That is a fair answer. We were very comfy. We just weren’t happy.'),
            ),
            opt(
              'Because nobody told them to stop.',
              TH('That is a fair answer. Nobody did tell us. And we never told ourselves.', 'soft'),
              TH('Sometimes you have to be your own somebody.'),
            ),
            opt(
              'Maybe they were scared of what was at the other end.',
              TH('Oh. That is a thoughtful answer. Perhaps we were.', 'soft'),
              TH('Guarding a path is easier than walking it. A shrubbery gave us a braver reason to stay.'),
            ),
          ],
        ),
      ],
    ),
  ],
  [
    g('suspense', 'The excited, waiting feeling when you want to know what happens next.', 'q01-intro'),
    g('inspect', 'To look at something very carefully, checking every part.', 'q01-first'),
    g('terraced', 'Built in flat steps, one a little higher than the next, like stairs up a hill.', 'q01-second'),
    g('erosion', 'The slow wearing away of land by water, wind or ice.', 'q01-terraced'),
  ],
  'Hooks: suspense (literacy), shrubs and leaves (2-LS2-1), measuring in cm (2.MD.A.1), terraces and erosion ' +
    '(4-ESS2-1), habits (sel). Think question: reader:q01-complete-l1. The approved chant is replaced by “GRONK!” and ' +
    'the shrubbery demand is rewritten as a new line.',
);

// ================================================================ Q2 The Plank Knight
const Q02 = quest(
  'q02',
  'The Plank Knight',
  {
    'q02-s1': {
      goal: 'Beat Sir Dentwhistle at karate on the plank bridge.',
      hint: 'Choose Karate on the bridge to start a bout. Any of your Nubbins can take part.',
    },
    'q02-s2': {
      goal: 'Win a second bout against Sir Dentwhistle.',
      hint: 'Same bridge. Swap in a fresher Nubbin if yours is tired; Sir Dentwhistle does not mind.',
    },
    'q02-s3': {
      goal: 'Win the third and final bout.',
      hint: 'If you keep losing, rest your Nubbin first. Tired Nubbins move slowly.',
    },
  },
  [
    scene(
      'q02-intro',
      [
        N('A plank bridge crosses the stream. In the middle of it stands a Power Nubbin in a dented tin helmet, perfectly still.'),
        N('It has stood there so long that a snail has started up its leg. It has not noticed, or will not admit it.'),
        Y('Excuse me. We’d like to cross.'),
        DW('Halt! This plank is closed to the public, and you are extremely public.', 'angry'),
        N('Its voice echoes inside the helmet. It sounds like someone talking into a bucket.'),
        DW('I am Sir Dentwhistle. I have guarded this plank for three whole days.'),
        DW('Before that it was unguarded. Chaos. People simply walked across it.', 'shock'),
        N('It raises its little fists. If you want to cross, you will have to beat it at karate.'),
        DW('I warn you, I am extremely courteous. I shall bow first, and then defeat you.', 'happy'),
      ],
      [
        notice(
          1,
          m(
            'science',
            'how a snail moves',
            'Learned that a snail glides on one muscly foot, over a layer of slime it makes itself.',
            '4-LS1-1',
          ),
          [
            N('How does a snail climb a knight? Slowly, and on one big foot.'),
            N('A snail’s body is mostly one long, muscly foot. Tiny waves ripple along it and push the snail forward.'),
            N('It also makes slime, which helps it grip and glide. Even up a leg that would rather it didn’t.'),
          ],
        ),
      ],
      [
        ch('bow', 'Bow politely, then fight.', [
          DW('A bow! Now we are both courteous. This will be the politest defeat in history.', 'happy'),
          N('In real karate, people bow before and after a bout. It means: I respect you, and I will play fair.'),
        ]),
        ch(
          'go-round',
          'Can’t we just go round?',
          [
            N('You look downstream. There is a perfectly good row of stepping stones about ten steps away.'),
            DW('Nobody uses those. They are beneath us. Literally. They are lower.', 'think'),
          ],
          { 'q02-asked-round': true },
        ),
      ],
    ),
    scene(
      'q02-round1',
      [
        N('Your Nubbin’s best move sends the dented helmet spinning off into the grass. Bonk. Roll. Stop.'),
        N('Underneath, Sir Dentwhistle has very flat hair.'),
        DW('Barely a bump! I hardly felt a thing!', 'angry'),
        Y('It was your hat.'),
        DW('A hat is a sort of bump. A bump on the head. Again!'),
        N('Its ears have gone pink. The snail stops climbing, out of tact.'),
      ],
      [
        ask(
          5,
          m(
            'literacy',
            'character traits from what a character says and does',
            'Worked out a character’s trait (proud, won’t admit losing) from its words and its pink ears.',
            'RL.3.3',
          ),
          [N('Sir Dentwhistle just lost its helmet. It says it was “barely a bump”.'), N('What trait does that show? What is it like?')],
          [
            best(
              'It is proud, and hates admitting it lost.',
              N('Exactly. Its words say “fine”. Its pink ears say “embarrassed”.'),
              N('When words and actions don’t match, the actions often tell the truth.'),
            ),
            opt(
              'It really didn’t feel anything.',
              N('Its head is fine, true. But look at its ears: pink. It feels something. Embarrassment.'),
              N('It is proud and won’t admit it lost. That’s a character trait: something it does again and again.'),
            ),
            opt(
              'It is very brave.',
              N('It is brave, in a way! But calling it “barely a bump” shows something else too.'),
              N('It is proud and hates admitting a loss. Watch for it: it will do it again.'),
            ),
          ],
        ),
      ],
    ),
    scene(
      'q02-scarf',
      [
        N('Sir Dentwhistle wraps a long woollen scarf round its neck three times, for armour.'),
        DW('The scarf is my second line of defence. Nobody has ever got past the scarf.'),
        DW('My mother knitted it. She said nothing would ever get through it. She meant the cold, but the principle stands.', 'think'),
        Y('Has anybody tried?'),
        DW('That is not the point.', 'think'),
        N('It takes up a fighting stance. The stance is mostly scarf.'),
        N('The snail has reached its shoulder and is enjoying the view.'),
      ],
      [
        ask(
          2,
          m(
            'science',
            'insulation: wool traps warmth',
            'Learned that a scarf doesn’t make heat; wool traps air and keeps in the body’s own warmth.',
            '2-PS1-1',
          ),
          [DW('My mother called it insulation. Tell me, Keeper: where does a scarf’s warmth actually come from?')],
          [
            best(
              'From you. The wool keeps your own warmth in.',
              DW('Correct! Wool is full of tiny pockets of trapped air. Heat struggles to get through them.', 'happy'),
              DW('So my warmth stays with me. That is called insulation. My mother was an expert.'),
            ),
            opt(
              'The wool makes heat by itself.',
              DW('A popular idea! But no. Put a scarf on a cold stone, and the stone stays cold.', 'think'),
              DW('Wool traps air, and air keeps your own body’s warmth in. That is called insulation.'),
            ),
            opt(
              'From the sun.',
              DW('The sun warms many things. But a scarf works in the dark too.', 'think'),
              DW('Its wool traps air, which keeps in the warmth my body makes. Insulation!'),
            ),
          ],
        ),
        ask(
          6,
          m(
            'maths',
            'two-step length problem in centimetres',
            'Solved a two-step problem: 3 wraps of 20 cm plus 40 cm left over makes 100 cm, or 1 metre.',
            '3.OA.D.8',
          ),
          [
            N('Each wrap round Sir Dentwhistle’s small neck uses 20 centimetres of scarf. It wraps three times.'),
            N('Then 40 centimetres dangle down at the end. How long is the whole scarf?'),
          ],
          [
            best(
              '100 cm, which is 1 metre.',
              N('Yes. Three wraps of 20 is 60. Add the 40 hanging down: 100 centimetres.'),
              N('And 100 centimetres is exactly one metre. A metre of pure defence.'),
            ),
            opt(
              '60 cm',
              N('Good start: three wraps of 20 is 60. But don’t forget the bit dangling down.'),
              N('60 add 40 is 100 centimetres. That’s one whole metre.'),
            ),
            opt(
              '63 cm',
              N('Careful: it’s three wraps of 20, so 20 + 20 + 20, which is 60. Then add the 40 that hangs down.'),
              N('60 + 40 = 100 centimetres, or one metre.'),
            ),
          ],
        ),
      ],
    ),
    scene(
      'q02-round2',
      [
        N('Your Nubbin grabs the end of the scarf and steps back. And back. And back.'),
        N('The scarf unwinds in one long, satisfying pull and drifts off downstream like a woolly eel.'),
        DW('Barely bothered! I was getting warm anyway.', 'angry'),
        N('It puffs out three hot, cross breaths.'),
        N('Its tiny round glasses fog up completely. It looks like a very small, very angry cloud.'),
        DW('I can’t see a thing. This is not a disadvantage. It is a strategy.', 'think'),
      ],
      [
        notice(
          1,
          m(
            'literacy',
            'similes',
            'Spotted a simile (“like a woolly eel”) and explained how comparing two things paints a picture.',
            'L.4.5',
          ),
          [
            N('“Like a woolly eel” is a simile: a comparison that uses “like” or “as”.'),
            N('An eel is a long, wriggly fish. Picture a wriggly fish made of wool. That’s the scarf.'),
          ],
        ),
        notice(
          4,
          m(
            'science',
            'condensation on cool glass',
            'Learned why glasses fog: water vapour in warm breath turns back into tiny drops on cooler glass.',
            '2-PS1-4',
          ),
          [
            N('Why did its glasses fog up? Breath is warm, and it carries water as an invisible gas: water vapour.'),
            N('When that warm, damp breath touches cooler glass, the vapour turns back into tiny drops of water.'),
            N('That change is called condensation. It’s the same thing that mists a bathroom mirror after a bath.'),
          ],
        ),
      ],
    ),
    scene(
      'q02-glasses',
      [
        N('Sir Dentwhistle wipes its glasses on its own tummy and puts them back on, crooked.'),
        DW('Final round. I have one item left, and it is my best item.'),
        DW('Without these, I cannot see you. Which means you cannot see me either. Logically.', 'think'),
        Y('That isn’t how seeing works.'),
        DW('It is how it works on my bridge.'),
        N('Your Nubbin looks up at you. It would like to win quickly and then have a snack.'),
      ],
      [
        ask(
          4,
          m(
            'science',
            'we see things when light from them reaches our eyes',
            'Explained that you see an object when light bounces off it into your eyes, whatever the object can see.',
            '1-PS4-2',
          ),
          [DW('Prove it, then. If I take off my glasses, can you still see me?', 'think')],
          [
            best(
              'Yes. Light bounces off you into my eyes.',
              N('Exactly. Light hits Sir Dentwhistle, bounces off, and travels into your eyes. That’s how you see it.'),
              N('What it can see doesn’t change that at all. Its logic is wonky. Its plank is not exempt from science.'),
            ),
            opt(
              'No, it’s right.',
              N('Try it! Close your own eyes. Can your Nubbin still see you? Of course it can.'),
              N('We see things when light bounces off them into our eyes. What the other person sees doesn’t matter.'),
            ),
            opt(
              'Only if it can see me first.',
              N('Seeing isn’t a swap. It only needs light: light bounces off Sir Dentwhistle and into your eyes.'),
              N('So you can see it whether its eyes are open, shut or fogged up.'),
            ),
          ],
        ),
      ],
      [
        ch(
          'gentle',
          'Go easy on it.',
          [N('Your Nubbin nods and loosens its shoulders in a merciful way.')],
          { 'q02-gentle': true },
        ),
        ch('full', 'Give it everything.', [N('Your Nubbin cracks its knuckles. It has no knuckles. It cracks them anyway.')]),
      ],
    ),
    scene(
      'q02-round3',
      [
        N('The glasses fly off and land neatly in the snail’s path. The snail goes round them.'),
        DW('I am completely fine. Never better. Which one of you said that? Both of you?', 'shock'),
        N('It is talking to a fence post.'),
        DW('Return at once! I have not finished being brave! I have barely started!', 'angry'),
        N('The fence post, to its credit, does not move an inch.'),
        N('You pick up the glasses and gently put them back on Sir Dentwhistle’s nose. It blinks at you.'),
        DW('Ah. There you are. You have moved. Sneaky.', 'think'),
      ],
      [
        notice(
          5,
          m(
            'health',
            'glasses help eyes focus; eye tests',
            'Learned that glasses help eyes focus, and that blurry seeing is something to tell a grown-up about.',
          ),
          [
            N('Lots of people wear glasses, from small children to grandparents. They help eyes focus, so things look sharp.'),
            N('If words or faces look blurry to you, tell a grown-up. An eye test is quick, and it doesn’t hurt.'),
            DW('Mine were prescribed by a professional. I simply prefer to fight without them. Occasionally. By accident.'),
          ],
        ),
      ],
    ),
    scene(
      'q02-complete',
      [
        N('Sir Dentwhistle sits down on the plank, which is the closest it will ever come to stepping aside.'),
        DW('Very well. You may cross. Not because you won. Because I am gracious, and I have decided to have a sit.', 'think'),
        N('You pick the dented helmet out of the grass and offer it back. It pushes it towards you.'),
        DW('Keep it. I have several others. At home. In a box.', 'sad'),
        N('It does not have several others. You can tell from the way it watches the helmet.'),
        DW('And tell your Nubbins this: losing is only losing if you mind. I never mind. I am famous for not minding.', 'happy'),
        N('You cross the plank in two steps. Downstream, the stepping stones look on, unused and faintly hurt.'),
        N('From now on your Nubbins take karate losses the way Sir Dentwhistle does: cheerfully, and slightly wrongly.'),
      ],
      [
        ask(
          5,
          m(
            'sel',
            'think question: plain truth or saving face',
            'Thought about when it is kinder to tell someone a hard truth and when to let them keep their pride.',
            'CASEL: Relationship skills',
          ),
          [
            N('Sir Dentwhistle lost three times, but won’t quite say so.'),
            N('Is it kinder to tell someone the plain truth, or to let them keep their pride?'),
          ],
          [
            opt(
              'The plain truth. Pretending doesn’t help anyone.',
              N('That’s a fair answer. Honest words, said gently, can be a gift. People often trust you more for them.'),
            ),
            opt(
              'Let them keep their pride. Everyone needs that sometimes.',
              N('That’s a kind answer. Sometimes people need a soft landing first, and the truth later.'),
            ),
            opt(
              'It depends on the person, and how you say it.',
              N('That’s a wise answer. A truth said kindly is very different from a truth said to win.'),
            ),
          ],
        ),
      ],
      [
        ch(
          'honours-even',
          'Shall we call it honours even?',
          [
            DW('Honours even. Yes. I was about to suggest it myself. I was being gracious.', 'happy'),
            N('It shakes your hand, and then the fence post’s, to be thorough.'),
          ],
          { 'q02-verdict': 'even' },
        ),
        ch(
          'tell-plainly',
          'You lost, you know. Three times.',
          [
            N('Sir Dentwhistle is quiet for a long moment. The snail, now on top of its head, is quiet too.'),
            DW('…I know. I was there.', 'sad'),
            DW('Thank you for saying it plainly. Nobody ever does. It is oddly restful.', 'soft'),
          ],
          { 'q02-verdict': 'lost' },
        ),
      ],
    ),
  ],
  [
    g('courteous', 'Polite and respectful, even to someone you are competing against.', 'q02-intro'),
    g('trait', 'A quality that is part of someone’s character, like being proud, kind or stubborn.', 'q02-round1'),
    g('insulation', 'Material that stops heat getting in or out, like wool in a scarf.', 'q02-scarf'),
    g('simile', 'A comparison that uses “like” or “as”, such as “drifts off like a woolly eel”.', 'q02-round2'),
    g('condensation', 'When water vapour (water as a gas) cools and turns back into drops of liquid water.', 'q02-round2'),
    g('logically', 'Following sensible steps of reasoning. Sir Dentwhistle uses the word without doing it.', 'q02-glasses'),
    g('gracious', 'Kind and polite, especially when things haven’t gone your way.', 'q02-complete'),
  ],
  'Renamed from the main title, which echoes a quote. Both approved quotes are replaced with new lines. Karate is ' +
    'cartoonish and bloodless; Sir Dentwhistle loses gear, never gets hurt. Hooks: snails (4-LS1-1), character traits ' +
    '(RL.3.3), insulation (2-PS1-1), a two-step sum (3.OA.D.8), similes (L.4.5), condensation (2-PS1-4), light and ' +
    'seeing (1-PS4-2), glasses and eye tests (health). Think question: reader:q02-complete-l1.',
);

// ================================================================ Q3 The Bridge of Three Questions
const Q03 = quest(
  'q03',
  'The Bridge of Three Questions',
  {
    'q03-s1': {
      goal: 'Count every Nubbin in your Grove, then go back to the gorge.',
      hint: 'Open the counter and tap each Nubbin once. Use tally marks in fives. Don’t forget the ones in the pond.',
    },
    'q03-s2': {
      goal: 'Find out how fast a Fly Nubbin can carry a coconut.',
      hint: 'Take a coconut from the palm on the coast, hand it to a Fly Nubbin and time its flight across the pond.',
    },
  },
  [
    scene(
      'q03-intro',
      [
        N('At the edge of the gorge, beside a rope bridge nobody has ever been allowed on, sits a very old Keeper in a very old hood.'),
        N('The hood has a fringe of moss. So, possibly, does the Keeper.'),
        GO('Halt. Nobody sets foot on my bridge without answering three questions first.', 'think'),
        GO('Answer rightly, and the bridge is yours. Answer wrongly, and… well. It is a long way down. To the stream.'),
        N('You look down. The stream is knee-deep and full of contented ducks.'),
        GO('First question. How many Nubbins live in your Grove? Exactly. Not roughly. I will know.'),
        Y('I… think I know? Let me check.'),
        GO('Go and count them. I shall wait. I am extremely good at waiting.', 'happy'),
      ],
      [
        act(
          7,
          m(
            'maths',
            'tally marks in groups of five',
            'Counted with tally marks in fives, then counted the groups (5, 10, 15…) to find the total quickly.',
            '3.OA.A.1',
          ),
          'edu:tally:nubbins:fives',
          [
            GO('A tip from an old counter. Use a tally. One line for each Nubbin.', 'think'),
            GO('Four lines standing up, then the fifth goes across them, like a little gate. That makes a group of five.'),
            GO('At the end, count the gates in fives, five, ten, fifteen, then add the loose lines. Much harder to lose your place.'),
          ],
        ),
      ],
      [
        ch(
          'guess',
          'Make a confident guess.',
          [GO('Wrong. Probably. A guess is not an answer. Go and count.', 'angry')],
          { 'q03-guessed': true },
        ),
        ch('count', 'Go and count properly.', [GO('Wise. The last one who guessed is still in the stream. He likes it there now.')]),
      ],
    ),
    scene(
      'q03-count',
      [
        N('You come back with the number, tally and all. Old Gorrel checks it against something written on his sleeve.'),
        GO('Correct. Annoyingly.', 'think'),
        GO('Second question. What did your newest Nubbin eat for breakfast?'),
        Y('A run fruit. Half of one. It dropped the other half in the pond.'),
        GO('Correct, and also tragic.', 'sad'),
        N('Down in the stream, a duck finds the floating half, eats it, and then spends a long time tidying its feathers.'),
        GO('Ducks. Always preening. Vain creatures. Dry, though. Always dry.', 'think'),
      ],
      [
        notice(
          6,
          m(
            'science',
            'how ducks keep their feathers waterproof',
            'Learned that ducks spread oil from a gland near the tail over their feathers to keep them waterproof.',
            '4-LS1-1',
          ),
          [
            GO('It isn’t vanity, really. Near its tail a duck has a small gland that makes oil.'),
            GO('When it preens, it rubs that oil all over its feathers with its beak. Water rolls straight off.'),
            GO('That is why a duck can sit in a stream all day and still be dry underneath. I envy it.', 'sad'),
          ],
        ),
      ],
    ),
    scene(
      'q03-third',
      [
        GO('Third question.', 'think'),
        N('He leans forward. The hood leans further. The ducks below go quiet, sensing an occasion.'),
        GO('Read this card. Out loud. It is very old.', 'think'),
        N('The card says: “How quickly can a small bird fly, with nothing at all in its claws?”'),
        Y('Birds aren’t really my area.'),
        GO('Nor mine. I have never actually seen the bird on the card.', 'think'),
        GO('Then a Fly Nubbin. Carrying a coconut. How fast? Go and find out.'),
        N('He sits back, very pleased with himself. Nobody has ever answered the third question.'),
      ],
      [
        ask(
          6,
          m(
            'maths',
            'speed needs distance and time',
            'Worked out that to measure speed you need two measurements: how far something goes, and how long it takes.',
            '4.MD.A.2',
          ),
          [GO('Before you go, Keeper. To find the speed of something, how fast it goes, what must you measure?')],
          [
            best(
              'How far it goes, and how long it takes.',
              GO('Yes. Distance and time. Say the pond is 20 metres across and it takes 10 seconds.', 'happy'),
              GO('Then it flies 2 metres every second. That’s its speed. Off you go.'),
            ),
            opt(
              'How heavy the coconut is.',
              GO('The coconut might slow it down, true. But you can’t get speed from weight alone.', 'think'),
              GO('Speed needs distance and time: how far, and how long. Measure the pond, then time the flight.'),
            ),
            opt(
              'Just how long it takes.',
              GO('Half right! But 10 seconds to cross a puddle is slow, and 10 seconds to cross a lake is fast.', 'think'),
              GO('You need both: how far it goes, and how long it takes.'),
            ),
          ],
        ),
      ],
    ),
    scene(
      'q03-timed',
      [
        N('You pace out the pond: 20 metres. Then you time two Fly Nubbins, one at a time, with the same coconut.'),
        N('The first carries the coconut briskly across the pond. Ten seconds.'),
        N('The second carries it halfway, sits on it, and has a think. Then it finishes. Forty seconds.'),
        N('You try each of them again, just to be sure. The first: eleven seconds. The second: it sits again. Same spot.'),
        N('So the honest answer is: it depends on the Fly Nubbin.'),
        N('You write both answers down, like a proper fair test. You have a feeling that is the whole point.'),
      ],
      [
        ask(
          3,
          m(
            'science',
            'fair tests and repeating trials',
            'Learned what makes a test fair (change only one thing) and why scientists repeat a test.',
            '3-5-ETS1-2',
          ),
          [N('You used the same pond and the same coconut for both Nubbins. Then you did it all twice.'), N('Why was that a good idea?')],
          [
            best(
              'So the only difference was the Nubbin, and so one odd result can’t fool me.',
              N('Exactly. Keeping everything else the same makes it a fair test: only one thing changes.'),
              N('And repeating it shows whether a result was a fluke. Real scientists do both.'),
            ),
            opt(
              'It wasn’t needed. Once is enough.',
              N('Once can fool you! The second Nubbin might have sat down just once, by chance.'),
              N('Doing it twice showed it sits every time. And using the same pond and coconut kept the test fair.'),
            ),
            opt(
              'So the Nubbins got more exercise.',
              N('They did! But there’s a science reason too.'),
              N('Same pond, same coconut: only the Nubbin changes, so it’s a fair test. Repeating shows if a result was luck.'),
            ),
          ],
        ),
      ],
    ),
    scene(
      'q03-complete',
      [
        GO('Well? How fast?', 'happy'),
        Y('That depends. Do you mean the Fly Nubbin that zooms, or the one that stops for a sit halfway?'),
        N('Old Gorrel opens his mouth. Then he closes it. Then he opens it again, to check it still works.'),
        GO('I… don’t know that. Nobody has ever asked me one back.', 'shock'),
        N('He takes a thoughtful step backwards, onto nothing in particular, and drops neatly into the stream.'),
        N('There is a splash, and then a great deal of indignant quacking. The ducks are cross, but nobody is hurt.'),
        GO('I’m all right! It’s rather pleasant, actually! The bridge is yours!', 'happy'),
        GO('Forty years of asking people questions. Do you know, it’s rather lovely to be asked one.', 'soft'),
        N('He floats away on his back, waving. Halfway, he flings his hood up onto the rope post. It lands perfectly. He has practised.'),
      ],
      [
        ask(
          7,
          m(
            'sel',
            'think question: is it good to be asked a question you can’t answer?',
            'Thought about how it feels not to know an answer, and why asking questions back can be a good thing.',
            'CASEL: Self-awareness',
          ),
          [GO('I didn’t know the answer, and I fell in a stream. And yet I feel wonderful. What do you make of that?', 'think')],
          [
            opt(
              'Not knowing is exciting. Now there’s something new to find out.',
              GO('That is a fair answer. Forty years of knowing all the answers was rather dull, now you mention it.', 'happy'),
            ),
            opt(
              'Maybe he was lonely, and a question back felt like a real conversation.',
              GO('Oh. That’s a thoughtful answer. A question back means someone is really listening.', 'soft'),
            ),
            opt(
              'I’d feel embarrassed if I didn’t know.',
              GO('That’s honest, and lots of people feel that way. I did, for about one second.', 'think'),
              GO('Then the water was nice. Not knowing is where all the learning starts.'),
            ),
          ],
        ),
      ],
    ),
  ],
  [
    g('tally', 'A way of counting with lines, crossing every fifth one to make groups of five.', 'q03-intro'),
    g('preening', 'When a bird cleans and tidies its feathers with its beak.', 'q03-count'),
    g('speed', 'How far something travels in a certain amount of time, such as 2 metres every second.', 'q03-third'),
    g('fair test', 'A test where you change only one thing, so you know that thing made the difference.', 'q03-timed'),
    g('indignant', 'Cross because you feel something unfair or rude has happened.', 'q03-complete'),
  ],
  'Both approved quotes (the bird question and the reply) are replaced with new lines; the bird question is now a ' +
    'card about a small bird with empty claws. The fall into the stream stays harmless. Hooks: tally marks in fives ' +
    '(3.OA.A.1), ducks’ preen oil (4-LS1-1), speed as distance and time (4.MD.A.2), fair tests and repeats ' +
    '(3-5-ETS1-2), asking questions (sel). Think question: reader:q03-complete-l1.',
);

// ================================================================ Q4 Clip-Clop
const Q04 = quest(
  'q04',
  'Clip-Clop',
  {
    'q04-s1': {
      goal: 'Find out where the coconut shells came from.',
      hint: 'Follow the coast path to the one palm tree and look for whoever has been carrying fruit away from it.',
    },
    'q04-s2': {
      goal: 'Decide what happens to the coconut shells.',
      hint: 'Go back to the lookout wall. The Run Nubbin will follow; talk to it there.',
    },
  },
  [
    scene(
      'q04-intro',
      [
        N('Clop. Clop-clop. Clop.'),
        N('Behind you, a Run Nubbin is trotting in step with you, banging two coconut half-shells together.'),
        N('When you stop, it stops. When you walk, it clops. It looks extremely pleased with the arrangement.'),
        N('Up on the lookout wall, Warden Ollery leans over with a telescope, which at this distance is no help at all.'),
        OL('Those shells. Wherever did they come from?'),
        Y('They aren’t mine. They’re… its.'),
        OL('Coconuts don’t grow round here. One palm in the whole valley, and that’s on the coast.', 'think'),
        OL('So how did they get all the way up here? I’ve been wondering since breakfast.'),
        OL('Unless two Fly Nubbins carried it between them. On a bit of string. Holding one end each.', 'think'),
        N('He thinks about this for slightly longer than is healthy, then draws a diagram on the wall in chalk.'),
        N('The Run Nubbin clops twice, which might mean anything.'),
      ],
      [
        ask(
          2,
          m(
            'science',
            'sounds are made by vibrations',
            'Learned that the shells make a sound because they vibrate when they hit, shaking the air all the way to our ears.',
            '1-PS4-1',
          ),
          [N('Clop! When the shells hit, they vibrate. How does that make a sound you can hear from up on the wall?')],
          [
            best(
              'The shaking passes through the air to our ears.',
              N('Yes. When the shells knock together they vibrate: they shake very fast, back and forth.'),
              N('That shaking passes through the air to your ears. Hollow shells make a big, round clop.'),
            ),
            opt(
              'The sound is stored inside the coconut.',
              N('A lovely idea! But an empty shell has no sound stored inside.'),
              N('The sound happens when the shells hit and vibrate: shake very fast. The air carries that shaking to your ears.'),
            ),
            opt(
              'The Run Nubbin is just saying “clop”.',
              N('Ha! It does look the type. But the clop comes from the shells.'),
              N('When they knock together, they vibrate. The vibration travels through the air to your ears.'),
            ),
          ],
        ),
        notice(
          6,
          m('science', 'coconuts float, which helps palms spread', 'Learned that coconuts float, so the sea can carry them to new beaches where they grow into palms.'),
          [
            OL('Funny things, coconuts. A coconut is a seed in a big, hard, hairy case. And it floats.', 'think'),
            OL('The sea can carry one for weeks. If it washes up on a warm beach, it can sprout into a new palm.'),
            OL('That’s probably how our one lonely palm got here. It sailed.'),
          ],
        ),
      ],
      [
        ch('ask-nubbin', 'Ask the Run Nubbin.', [N('It clops, then points its whole body towards the sea.')]),
        ch(
          'shrug',
          'Does it matter?',
          [OL('Everything matters, from up here. There’s not much else to look at.', 'sad')],
          { 'q04-shrugged': true },
        ),
      ],
    ),
    scene(
      'q04-gullwick',
      [
        N('Under the palm sits a Fly Nubbin with enormous, exhausted wings. Its name tag says Gullwick.'),
        GW('Carried it. All the way. Uphill. Into a headwind.', 'sad'),
        N('A headwind is wind that blows straight into your face, the opposite way to where you’re going.'),
        GW('Dropped it on a rock at the top. Went in two. Run Nubbin found the halves. Very happy. I am very tired.'),
        N('Gullwick lies down flat in the sand to make the point.'),
        N('Beside it lies another whole coconut, saved for later. Its wings twitch at the sight of it.'),
      ],
      [
        ask(
          2,
          m(
            'science',
            'forces: pushing against the wind',
            'Explained why a headwind makes travel harder: the wind pushes the opposite way, so you must push harder.',
            '3-PS2-1',
          ),
          [N('Why does flying into a headwind make Gullwick so tired?')],
          [
            best(
              'The wind pushes back, so it has to push harder.',
              N('Exactly. Gullwick’s wings push forward, and the wind pushes backward. Two forces, fighting.'),
              N('To move at all, Gullwick has to push harder than the wind. That takes a lot of energy.'),
            ),
            opt(
              'Wind makes the coconut heavier.',
              N('The coconut weighs the same in any wind. But the wind does push against Gullwick.'),
              N('Wings push forward, wind pushes back. Gullwick must push harder than the wind to get anywhere.'),
            ),
            opt(
              'It isn’t harder. Wind helps you fly.',
              N('A wind behind you helps: that’s a tailwind. A headwind blows the other way, into your face.'),
              N('It pushes back against the wings, so Gullwick has to work much harder.'),
            ),
          ],
        ),
        ask(
          3,
          m(
            'maths',
            'unit fractions: halves and quarters',
            'Compared halves and quarters: the more equal pieces something is split into, the smaller each piece.',
            '3.NF.A.1',
          ),
          [
            N('The coconut split into two equal halves. Each half is 1/2.'),
            N('If it had smashed into four equal pieces instead, what fraction would each piece be?'),
          ],
          [
            best(
              '1/4, a quarter',
              N('Yes. Four equal pieces: each one is a quarter, 1/4.'),
              N('A quarter is smaller than a half. The Run Nubbin would have had a much quieter clop.'),
            ),
            opt(
              '1/2',
              N('1/2 is one of two equal pieces. With four equal pieces, each is one of four: 1/4.'),
              N('More pieces means smaller pieces. A quarter is smaller than a half.'),
            ),
            opt(
              '4',
              N('There would be 4 pieces, yes! But each piece is one out of four: 1/4, a quarter.'),
            ),
          ],
        ),
      ],
      [
        ch(
          'thank',
          'Thank Gullwick properly.',
          [
            N('You thank Gullwick. It lifts one wing an inch off the sand, which is all the wing will do today.'),
            GW('Nobody said that before. Nice. Very tired. Still nice.', 'soft'),
          ],
          { 'q04-thanked-gullwick': true },
        ),
        ch('why', 'Why carry it all that way?', [
          GW('Seemed like it wanted to go up.', 'think'),
          N('It says this as though it explains everything. Possibly it does.'),
        ]),
      ],
    ),
    scene(
      'q04-return',
      [
        N('You walk back up to the lookout wall. Clop. Clop-clop. The Run Nubbin is right behind you, of course.'),
        Y('A Fly Nubbin carried a whole coconut up from the coast. It broke on a rock.'),
        OL('All that way? With those little wings?', 'shock'),
        OL('Well. Mystery solved. I suppose the shells ought to go back to the beach, really. Tidiness and so on.'),
        N('The Run Nubbin hugs the shells to its chest and looks at you with its whole face.'),
        N('It is the look of someone who has found the one sound they were born to make.'),
      ],
      [
        ask(
          5,
          m(
            'sel',
            'think question: when two people want different things',
            'Thought about how to decide fairly when two people want different things, and what each one cares about.',
            'CASEL: Responsible decision-making',
          ),
          [
            N('Warden Ollery wants things tidy. The Run Nubbin loves its shells more than anything.'),
            N('Sometimes people find a compromise. Sometimes one gives way. How would you decide what’s fair?'),
          ],
          [
            opt(
              'Ask what matters most to each of them.',
              N('That’s a fair answer. Sometimes one person cares a little and the other cares a lot. That helps you decide.'),
            ),
            opt(
              'Find a way for both to get something.',
              N('That’s a thoughtful answer. People call that a compromise: nobody gets everything, but everybody gets something.'),
            ),
            opt(
              'The shells were found, so finders keepers.',
              N('That’s an honest answer, and lots of people think that way.'),
              N('It’s worth asking, too: would anyone be hurt by it? Here, the beach probably won’t mind.'),
            ),
          ],
        ),
      ],
      [
        ch(
          'keep',
          'They’re yours. Keep them.',
          [N('The Run Nubbin does a small celebratory trot in a circle. Clop-clop-clop-clop.')],
          { 'q04-kept': true },
        ),
        ch(
          'share',
          'Keep them, but let the others have a turn.',
          [N('The Run Nubbin considers this and agrees, provided its turn comes first. And last.')],
          { 'q04-shared': true },
        ),
      ],
    ),
    scene(
      'q04-decided',
      [
        N('The Run Nubbin tucks the shells under one arm and gives you a long, grateful look.'),
        OL('Well, that’s that settled. Clop away, little one.', 'happy'),
        N('It trots a few steps to show you. Clip-clop, clip-clop. Two beats, over and over, steady as a clock.'),
        OL('That’s a trot, that is. Real horses have a different rhythm for every speed.'),
        N('The Run Nubbin tries walking instead. Clop, clop, clop, clop. Then something faster: ba-da-dum, ba-da-dum.'),
        OL('Ha! Now it’s cantering. Three beats. Listen.', 'happy'),
        N('It skids to a halt, very pleased with itself, and clops once more for applause.'),
      ],
      [
        act(
          5,
          m('music', 'keeping a steady beat; rhythms in 2, 3 and 4', 'Clapped three horse rhythms: a walk in four beats, a trot in two and a canter in three.'),
          'edu:clap:rhythm:walk-trot-canter',
          [
            OL('Clap along with it. A horse’s walk is four even beats: one, two, three, four.'),
            OL('A trot is two beats: clip-clop, clip-clop. A canter is three: ba-da-dum, ba-da-dum.'),
            N('Keep each one steady, like a clock. That steady pulse under the music is called the beat.'),
          ],
        ),
      ],
    ),
    scene(
      'q04-complete',
      [
        N('The Run Nubbin, whose name turns out to be Trotwell, clops a lap of the whole Grove. Soon every Nubbin wants a go.'),
        OL('I’ll be honest. I quite like the noise. It’s company.', 'soft'),
        N('As thanks, Trotwell teaches you the trot. It is mostly knees.'),
        N('From now on, when you run, you can swap your footsteps for coconut hooves.'),
        N('Far away on the beach, Gullwick sleeps soundly, wings spread out like a dropped coat.'),
        N('Beside it someone has left a fruit and a note in chalk: “Thank you for the noise. From the wall.”'),
      ],
      [
        notice(
          4,
          m('health', 'rest and sleep help bodies recover', 'Learned that muscles recover during rest and sleep, and that children their age need about 9 to 12 hours a night.'),
          [
            N('Gullwick has earned that sleep. After hard work, muscles need rest to recover and grow stronger.'),
            N('Sleep is when a lot of that repair happens. Children your age need about 9 to 12 hours a night.'),
            N('Gullwick is aiming for about 14. Nobody is going to argue.'),
          ],
        ),
      ],
    ),
  ],
  [
    g('vibrate', 'To shake very quickly back and forth. Vibrations make sound.', 'q04-intro'),
    g('headwind', 'A wind blowing straight towards you as you travel, pushing against you.', 'q04-gullwick'),
    g('compromise', 'An agreement where each side gives up a little so both get something.', 'q04-return'),
    g('rhythm', 'A pattern of long and short sounds and beats that repeats.', 'q04-decided'),
    g('company', 'Having someone or something with you, so you don’t feel alone.', 'q04-complete'),
  ],
  'The approved coconut quote is replaced with a new line. Hooks: sound and vibration (1-PS4-1), floating coconuts ' +
    '(science), headwinds as opposing forces (3-PS2-1), halves and quarters (3.NF.A.1), horse rhythms (music), rest and ' +
    'sleep (health). Think question: reader:q04-return-l1. Gait beats: walk four, trot two, canter three.',
);

// ================================================================ Q5 The Rabbit at the Ledge
const Q05 = quest(
  'q05',
  'The Rabbit at the Ledge',
  {
    'q05-s1': {
      goal: 'Ask Sparks to build something that can win over the rabbit.',
      hint: 'Sparks is in the Workshop. Bring one sun fruit; Sparks will need it.',
    },
    'q05-s2': {
      goal: 'Take the Hand Melon to the ledge, count to exactly three, and toss it.',
      hint: 'Tap Count once per beat and throw on three. Too many or too few and it fizzles; Sparks will make another.',
    },
  },
  [
    scene(
      'q05-intro',
      [
        N('On the cliff ledge above the falls, a crowd of Nubbins has gathered round something small, white and fluffy.'),
        N('It is a rabbit. It is the size of a slipper. It is chewing a clover with total calm.'),
        RO('Stand back, Keeper. My Nubbins and I have trained for this all week.', 'happy'),
        N('This is Sir Rollo Brisket, a Keeper with a cape, a cardboard crown and a great deal of confidence.'),
        N('His strongest Power Nubbin creeps up behind the rabbit for a friendly karate bout.'),
        N('There is a white blur. The Power Nubbin is suddenly sitting in a bush some way off, puzzled but fine.'),
        N('The next Nubbin creeps up from the side. Blur. Bush. The next. Blur. Same bush. It is getting crowded.'),
        RO('Retreat! Everybody back! Back to the bottom of the hill!', 'shock'),
        N('Everyone runs about ten steps, then stops, because the rabbit has gone back to its clover.'),
      ],
      [
        ask(
          6,
          m(
            'science',
            'prey animals’ eyes see almost all the way round',
            'Learned that a rabbit’s eyes sit on the sides of its head, so it sees nearly all round and is hard to sneak up on.',
            '4-LS1-2',
          ),
          [N('Rabbits are prey animals. The Nubbins crept up from behind, then from the side. The rabbit saw them every time. How?')],
          [
            best(
              'Its eyes are on the sides of its head.',
              N('Yes. A rabbit’s eyes sit high on the sides of its head, so it can see almost all the way round.'),
              N('Rabbits are prey: animals that other animals hunt. Seeing danger early keeps them safe.'),
            ),
            opt(
              'It has eyes in the back of its head.',
              N('Close! Not in the back, but on the sides. That lets it see nearly all the way round without turning.'),
              N('Rabbits are prey animals, so spotting danger early is how they stay safe.'),
            ),
            opt(
              'It was just lucky.',
              N('Lucky every time? Look at its face: the eyes are on the sides of its head, not the front.'),
              N('That gives it a view almost all the way round. Very handy for a prey animal.'),
            ),
          ],
        ),
      ],
      [
        ch(
          'try',
          'Let your Nubbin try.',
          [N('Your Nubbin steps up bravely. Blur. Bush. It climbs out with a leaf on its head, giggling.')],
          { 'q05-tried': true },
        ),
        ch('watch', 'Watch the rabbit for a bit.', [
          N('You notice it never starts a fight. It only finishes them, very quickly, and then has a snack.'),
        ]),
      ],
    ),
    scene(
      'q05-sparks',
      [
        SP('A rabbit beat ALL of them? One go each? Oh, I love that rabbit.', 'happy'),
        Y('We don’t want to beat it, though. Not really.'),
        SP('No? Then what DO we want? Every good invention starts with that question.', 'think'),
        SP('Right. Leave it with me. One sun fruit, some ribbon, and a very small amount of fizz.'),
        N('There is a crackle, a small blue flash, and a smell of toasted fruit.'),
        N('Sparks comes out of the smoke with frizzy eyebrows and an enormous grin. “Nearly there!”'),
      ],
      [
        ask(
          2,
          m(
            'science',
            'engineering: define the problem first',
            'Practised the first step of engineering: saying clearly what problem you are trying to solve.',
            'K-2-ETS1-1',
          ),
          [SP('Engineers always start by saying what the problem really is. So, Keeper: what’s ours?')],
          [
            best(
              'Make friends with the rabbit, so nobody ends up in a bush.',
              SP('Yes! That’s the real problem. We don’t need to win. We need the rabbit to like us.', 'happy'),
              SP('Now I know what to build. Something a rabbit would love.'),
            ),
            opt(
              'Beat the rabbit at karate.',
              SP('Hmm. Ten Nubbins tried that. The bush is full.', 'think'),
              SP('Maybe the real problem is different: we want the rabbit to be friendly. Let’s solve that one.'),
            ),
            opt(
              'Build a bigger bush.',
              SP('Ha! That does solve a problem. Just not the right one.', 'happy'),
              SP('The real problem is that the rabbit doesn’t trust us. Let’s fix that instead.'),
            ),
          ],
        ),
      ],
    ),
    scene(
      'q05-melon',
      [
        SP('Behold. The Hand Melon.', 'happy'),
        N('It is a sun fruit with a ribbon round it and a little paper tag. It hums faintly.'),
        Y('It’s not a melon.'),
        SP('Melon sounds braver. Read the tag. The tag is important. I wrote it in my best voice.'),
        N('You turn the tag over. The handwriting is very fancy and slightly singed.'),
        N('It says: “Count up to three, and stop. On three, and only on three, let go.”'),
        SP('Not two, which is lazy. Not four, which is showing off. Three. Then toss it, gently, near the rabbit. Not at it.'),
        SP('It goes off like a party. Nobody gets hurt. The rabbit loves parties. Probably.'),
      ],
      [
        ask(
          6,
          m(
            'maths',
            'odd and even numbers',
            'Sorted 2, 3 and 4 into odd and even, and explained that odd numbers can’t be split into two equal groups.',
            '2.OA.C.3',
          ),
          [SP('Two and four are both even. Three is the odd one out. But what makes a number odd?', 'think')],
          [
            best(
              'You can’t split it into two equal groups.',
              SP('Exactly! Share 4 sun fruits between 2 Nubbins: 2 each, fair. Share 3: someone gets the extra one.', 'happy'),
              SP('That leftover one makes 3 odd. 1, 3, 5, 7 and 9 are all odd. That’s why I like them. They’re a bit wild.'),
            ),
            opt(
              'It’s strange-looking.',
              SP('Ha! Three is a bit curly. But odd has a maths meaning.', 'happy'),
              SP('An odd number can’t be split into two equal groups. Share 3 fruits between 2: one is always left over.'),
            ),
            opt(
              'It’s bigger than 2.',
              SP('Four is bigger than 2 too, and 4 is even. So that can’t be it.', 'think'),
              SP('Odd means it won’t split into two equal groups. Three fruits, two Nubbins: one left over. Odd!'),
            ),
          ],
        ),
      ],
      [
        ch(
          'practise',
          'Practise counting first.',
          [Y('One. Two. Three.'), SP('Perfect. Do exactly that, but with feeling.')],
          { 'q05-practised': true },
        ),
        ch('four', 'What if I count to four?', [SP('Then it just sits there, disappointed in you. So will I.', 'sad')]),
        ch(
          'rollo',
          'Let Sir Rollo do the honours.',
          [
            RO('Allow me. One… two… a good few!', 'happy'),
            SP('THREE, Rollo.', 'angry'),
            N('The Hand Melon gives a small, sad fizz in his hand. Sparks takes it back and makes another without a word.'),
          ],
          { 'q05-rollo-counted': true },
        ),
      ],
    ),
    scene(
      'q05-pop',
      [
        N('One. Two. Three. You toss the Hand Melon in a gentle arc.'),
        N('It bursts into a shower of fruit confetti: little sweet scraps of every colour.'),
        N('The scraps drift down slowly, swaying, like snow. The hard little stalk drops straight down. Plop.'),
        N('The rabbit sits up, ears tall. It has never seen anything so wonderful in its life.'),
        N('Its ears turn, one forward, one back, catching every tiny pitter and patter.'),
        SP('Pretty, isn’t it? Air resistance did half the work.', 'happy'),
      ],
      [
        ask(
          2,
          m(
            'science',
            'gravity and air resistance',
            'Explained why light, flat confetti falls slowly: gravity pulls everything down, but air pushes up against wide, light things.',
            '3-PS2-1',
          ),
          [N('Gravity pulls everything down. So why does the confetti float, while the stalk drops like a stone?')],
          [
            best(
              'The air pushes against the wide, light scraps.',
              N('Yes. Falling things push through air, and air pushes back. That push is called air resistance.'),
              N('A wide, light scrap gets a big push for its weight, so it drifts. A small, heavy stalk barely notices.'),
            ),
            opt(
              'Confetti doesn’t have gravity.',
              N('It does! Everything is pulled down by gravity. That’s why the confetti lands in the end.'),
              N('But air pushes back against wide, light things. That’s air resistance, and it slows the confetti down.'),
            ),
            opt(
              'Sparks made it magic.',
              N('Sparks would love that. But it’s air resistance: air pushing back on anything falling through it.'),
              N('Wide, light things like confetti get slowed a lot. Small, heavy things like the stalk hardly at all.'),
            ),
          ],
        ),
      ],
    ),
    scene(
      'q05-complete',
      [
        N('The white rabbit hops through the confetti, eating as it goes, and stops at your feet.'),
        N('It looks up at you, then at your Nubbin, and very politely does not knock anyone into a bush.'),
        RO('Extraordinary. I had a whole plan. It involved a lot of shouting.', 'think'),
        RO('I suppose it was only ever minding its clover. We were the ones who kept walking up to it.', 'soft'),
        SP('I made you a spare Hand Melon. For the mantelpiece. I took the fizz out, so it’s just pretty.', 'happy'),
        N('The rabbit follows you home. Your Nubbins adore it, and one of them is already trying on its ears.'),
        N('Its name, you decide, is Snowdrop. It agrees by sitting on your foot.'),
      ],
      [
        ask(
          3,
          m(
            'sel',
            'think question: fierce, or protecting its space?',
            'Thought about an animal’s point of view and why we give animals their space.',
            'CASEL: Social awareness',
          ),
          [RO('Was that rabbit fierce, Keeper? Or were we just in its way?', 'think')],
          [
            opt(
              'It was protecting its space. We kept bothering it.',
              RO('That is a fair answer. I think so too. We walked up to it, one after another, all morning.', 'soft'),
              N('Real wild animals need their space too. Watch them quietly from a distance, and never chase them.'),
            ),
            opt(
              'It was a bit fierce, but only when someone came too close.',
              RO('That’s a careful answer. Fierce, but fair. It never started anything.', 'think'),
              N('Lots of wild animals are like that. Give them space, watch quietly, and they leave you alone too.'),
            ),
            opt(
              'It was hungry, and we got between it and its snack.',
              RO('Ha! A fair answer. I would bump me into a bush too, if I were eating.', 'happy'),
              N('Wild animals need to eat in peace. Watching quietly from a distance is the kindest way.'),
            ),
          ],
        ),
      ],
    ),
  ],
  [
    g('prey', 'An animal that other animals hunt for food.', 'q05-intro'),
    g('invention', 'Something new that someone designs and makes to solve a problem.', 'q05-sparks'),
    g('odd', 'In maths, an odd number can’t be split into two equal groups, like 1, 3, 5, 7 and 9.', 'q05-melon'),
    g('air resistance', 'The push of air against something moving through it, which slows it down.', 'q05-pop'),
    g('extraordinary', 'Very unusual and surprising.', 'q05-complete'),
  ],
  'Both approved quotes (the retreat call and the counting rule) are replaced with new lines; Rollo’s miscount is ' +
    'rewritten too. The rabbit’s “karate” relocates Nubbins into a bush with no harm. Hooks: prey animals’ eyes ' +
    '(4-LS1-2), defining a problem (K-2-ETS1-1), odd and even (2.OA.C.3), air resistance (3-PS2-1), giving wild ' +
    'animals space (sel). Think question: reader:q05-complete-l1.',
);

// ================================================================ Q6 The Wooden Rabbit
const Q06 = quest(
  'q06',
  'The Wooden Rabbit',
  {
    'q06-s1': {
      goal: 'Build a giant wooden rabbit at the Workshop.',
      hint: 'The giant rabbit needs a lot of wood and a set of wheels. The fallen logs by the woods are a good start.',
    },
    'q06-s2': {
      goal: 'Wheel the wooden rabbit to the stranger’s wall.',
      hint: 'Push it from behind and steer round the stream. It does not float.',
    },
  },
  [
    scene(
      'q06-intro',
      [
        N('At the far end of the valley stands an old wall with a little tower on top. On the tower stands a stranger.'),
        N('He has a magnificent moustache and an accent from somewhere very far away, or possibly from nowhere at all.'),
        PA('Hello down there, small Keeper with the small animals! I do not think much of your hat!', 'happy'),
        Y('I’m not wearing a hat.'),
        PA('And I do not think much of that either!'),
        N('A ripe sun fruit sails over the wall and lands on your head. It goes everywhere.'),
        PA('Your boots go squelch, and your Nubbin smells of yesterday’s porridge!', 'angry'),
        N('He disappears behind the wall. You can hear him laughing and then, slightly worryingly, eating.'),
        N('He reappears. He has thought of another taunt, and it has clearly cost him something.'),
        PA('And your Nubbin looks like a sock that has been told a secret!', 'happy'),
        N('Your Nubbin looks down at itself, then up at you, stricken. It looks as if it might cry.'),
      ],
      [
        ask(
          10,
          m(
            'sel',
            'handling teasing and big feelings',
            'Chose calm ways to handle teasing: comforting a friend, remembering that taunts aren’t true, and not shouting back.',
            'CASEL: Self-management',
          ),
          [
            N('A taunt is something said on purpose to tease or upset you. Your Nubbin is upset.'),
            N('What would help it most right now?'),
          ],
          [
            best(
              'Kneel down, tell it the truth kindly, and stay with it.',
              N('Yes. You tell it it looks nothing like a sock. It looks exactly like itself, which is better.'),
              N('Taunts say more about the person shouting than the person being shouted at. A friend beside you helps a lot.'),
            ),
            opt(
              'Tell it to stop being silly.',
              N('Its feelings are real, even if the taunt is silly. Feelings shrink faster when someone listens.'),
              N('So you kneel down and tell it the truth: it looks nothing like a sock. It leans on your leg.'),
            ),
            opt(
              'Shout something even worse at the stranger.',
              N('That’s tempting! But shouting back usually makes the shouting go on longer.'),
              N('First, look after your Nubbin. You kneel and tell it the truth: it looks nothing like a sock.'),
            ),
          ],
        ),
      ],
      [
        ch(
          'shout',
          'Shout something rude back.',
          [Y('Your… wall is… wonky!'), PA('It is NOT wonky! It has CHARACTER!', 'angry')],
          { 'q06-shouted': true },
        ),
        ch('dignity', 'Wipe off the fruit with dignity.', [N('You wipe off the fruit with great dignity. A second fruit arrives.')]),
      ],
    ),
    scene(
      'q06-built',
      [
        N('The wooden rabbit is finished. It is twice as tall as you, with big flat ears and a slightly anxious expression.'),
        N('It is on wheels. It has a little door in its tummy. Nobody can remember why you added the door.'),
        N('Your Nubbin climbs the measuring post beside it, to see how tall it really is.'),
        Y('I’m 120 centimetres tall. So the rabbit must be…'),
        N('Your Nubbin taps the post level with the tips of the ears, and squeaks.'),
        N('The rabbit gazes down at you all, anxiously. It is going to need a lot of pushing.'),
      ],
      [
        ask(
          3,
          m(
            'maths',
            'doubling lengths; centimetres and metres',
            'Doubled 120 cm to get 240 cm, then wrote it as 2 metres 40 centimetres (100 cm = 1 m).',
            '4.MD.A.1',
          ),
          [N('You are 120 cm tall. The rabbit is twice as tall as you. How tall is the rabbit?')],
          [
            best(
              '240 cm, which is 2 metres and 40 centimetres.',
              N('Yes. Double 120 is 240. And 100 centimetres make a metre, so 240 cm is 2 m 40 cm.'),
              N('Taller than a grown-up. Taller than a door. Just right for a surprise.'),
            ),
            opt(
              '122 cm',
              N('That adds 2. “Twice as tall” means two lots of your height: 120 + 120.'),
              N('That’s 240 cm, or 2 metres and 40 centimetres, since 100 cm make 1 metre.'),
            ),
            opt(
              '60 cm',
              N('60 is half of 120. The rabbit is bigger than you, not smaller!'),
              N('Twice as tall means double: 120 + 120 = 240 cm. That’s 2 m 40 cm.'),
            ),
          ],
        ),
      ],
    ),
    scene(
      'q06-plan',
      [
        N('The wooden rabbit stands outside the Workshop, wheels chocked, ears high.'),
        Y('Right. We wheel it to his wall and leave it at the gate.'),
        N('Your Nubbins nod seriously. They have been told it is a plan. They have not been told the plan.'),
        N('Neither, you realise, have you.'),
        Y('He’ll take it in, and then… something will happen.', 'think'),
        N('You kick the wooden wedges away from the wheels and give it a push. It rolls off easily, squeaking.'),
        N('That will do. It has wheels. Wheels are a sort of plan in themselves.'),
      ],
      [
        ask(
          5,
          m(
            'science',
            'wheels reduce friction',
            'Explained that wheels make heavy things easier to move because rolling causes much less friction than scraping.',
            '3-PS2-1',
          ),
          [N('Without wheels, the rabbit would hardly budge. With them, one push gets it rolling.'), N('What do wheels do about friction, the force from surfaces rubbing together?')],
          [
            best(
              'They roll instead of scraping, so there’s much less of it.',
              N('Exactly. Friction is the force that slows things when surfaces rub together.'),
              N('Dragging scrapes the whole bottom along the ground. A wheel just rolls, so there’s far less rubbing.'),
            ),
            opt(
              'Wheels make it lighter.',
              N('It weighs just the same on wheels! What changes is the rubbing.'),
              N('Dragging scrapes along the ground: lots of friction. Rolling wheels rub much less, so it’s easier to push.'),
            ),
            opt(
              'The rabbit wants to go.',
              N('It does look keen. But the real reason is friction: the force from surfaces rubbing together.'),
              N('Wheels roll instead of scraping, so there’s much less friction to push against.'),
            ),
          ],
        ),
      ],
    ),
    scene(
      'q06-gate',
      [
        N('You leave the rabbit at the gate and hide behind a bush. The gate creaks. The stranger drags the rabbit inside.'),
        N('Behind the bush, everyone looks at everyone. Slowly, it dawns that the rabbit was the whole plan.'),
        Y('…Was somebody meant to be inside it?', 'think'),
        N('Your Nubbins look at their feet. One of them looks at a different, unrelated bush.'),
        N('You remember a very old story you once read, about a giant wooden horse.'),
        N('In that story, the clever part was who was hiding inside. You have rather skipped the clever part.'),
      ],
      [
        notice(
          5,
          m(
            'social-studies',
            'legends: how old stories carry the past',
            'Heard the ancient Greek legend of the wooden horse and learned what a legend is.',
            'D2.His.2.K-2',
          ),
          [
            N('It’s an ancient Greek legend. An army left a huge wooden horse outside the city of Troy, as if it were a gift.'),
            N('The people of Troy pulled it inside. That night, soldiers hidden in the horse crept out and opened the gates.'),
            N('A legend is a very old story that may be partly true. This one has been told for thousands of years.'),
          ],
        ),
      ],
      [
        ch(
          'laugh',
          'Start laughing.',
          [N('You laugh. Your Nubbins laugh. Behind the wall, the stranger laughs too, though not for the same reason.')],
          { 'q06-laughed': true },
        ),
        ch(
          'knock',
          'Knock and ask for it back.',
          [PA('Ask for what back? I have no rabbit. I am a man alone with his wall.', 'think')],
          { 'q06-knocked': true },
        ),
      ],
    ),
    scene(
      'q06-complete',
      [
        N('Next morning, the wooden rabbit is back outside your Workshop with a note pinned to one ear.'),
        N('“Too big for the courtyard. Also, I found nobody inside it. Very poor attack. Nine out of ten for the ears.”'),
        N('Underneath, in smaller writing: “Your hat is still terrible.”'),
        Y('I’m still not wearing a hat.'),
        N('Right at the bottom, very small, half rubbed out: “P.S. Nobody ever comes to the wall. Come again. Bring something to throw.”'),
        N('The little door in its tummy swings open. There is just room for you and a Nubbin to squeeze in and peek out.'),
        N('It makes, everyone agrees, an excellent spot for photographs.'),
      ],
      [
        ask(
          4,
          m(
            'literacy',
            'think question: a character’s motive',
            'Used a clue in the text (the P.S.) to think about why a character behaves the way he does.',
            'RL.3.3',
          ),
          [N('Read the P.S. again.'), N('What do you think is the stranger’s motive: the real reason he shouts at everyone?')],
          [
            opt(
              'He’s lonely, and shouting is how he gets people to come.',
              N('That’s a fair answer, and the P.S. backs it up: “Nobody ever comes to the wall.”'),
              N('Sometimes people who tease are really asking for company, in a very clumsy way.'),
            ),
            opt(
              'He thinks it’s a game, like throwing a ball.',
              N('That’s a fair answer. “Bring something to throw” does sound like he wants to play.'),
              N('Maybe he has never learned a gentler way to say “come and play”.'),
            ),
            opt(
              'He’s just rude.',
              N('He certainly is rude! That’s a fair reading.'),
              N('Characters can be more than one thing, though. Rude, and maybe a little lonely too. Look at that P.S.'),
            ),
          ],
        ),
      ],
    ),
  ],
  [
    g('taunt', 'Something said on purpose to tease or upset someone.', 'q06-intro'),
    g('stricken', 'Suddenly very upset or hurt, and showing it on your face.', 'q06-intro'),
    g('friction', 'The force that slows things down when two surfaces rub together.', 'q06-plan'),
    g('legend', 'A very old story, passed down for a long time, that may be partly true.', 'q06-gate'),
    g('motive', 'The reason why someone does something.', 'q06-complete'),
  ],
  'The approved insult quote is replaced with a new, gentler taunt. The stranger never comes down from the tower. ' +
    'Hooks: handling teasing (CASEL: Self-management), doubling and metres (4.MD.A.1), friction (3-PS2-1), the ' +
    'legend of the wooden horse (D2.His.2.K-2), a character’s motive (RL.3.3). Think question: reader:q06-complete-l1.',
);

// ================================================================ Q7 The Grand Palace of the Hill
const Q07 = quest(
  'q07',
  'The Grand Palace of the Hill',
  {
    'q07-s1': {
      goal: 'Gather 12 stone for the castle towers.',
      hint: 'Stone turns up in the riverbed and under the cliffs. Tap a sparkling rock to pick it up.',
    },
    'q07-s2': {
      goal: 'Finish the castle’s two towers with Pixel.',
      hint: 'Place stones on the glowing spots at the top of each tower. Twelve in all: six for each tower.',
    },
  },
  [
    scene(
      'q07-intro',
      [
        N('On top of the little hill, Pixel is kneeling beside a castle. It is about knee-high.'),
        N('It has a gate, a drawbridge made from a lolly stick, and two towers that stop halfway up, as if they lost interest.'),
        PX('Keeper! Behold! The Grand Palace of the Hill!', 'happy'),
        N('Pixel turns to the valley, arms wide, and announces it again, louder, to everyone and no one.'),
        PX('Gaze upon it, all ye Grove! Marvel at its towers! Well. Marvel at the bottom halves of its towers.'),
        N('Byte comes up the path with a cup of tea, looks at the castle, and does not slow down.'),
        BY('Pixel, a footstool could beat that castle in a fight.'),
        PX('SHH.', 'angry'),
        PX('It needs proper stone towers. Real ones. Little ones. Will you help? Byte clearly won’t.'),
        BY('I am drinking my tea.', 'think'),
        N('There is a tea stain on the lolly-stick drawbridge. Byte moves his cup behind his back.'),
      ],
      [
        ask(
          7,
          m(
            'sel',
            'giving kind, honest feedback',
            'Practised giving feedback that is honest and kind: notice something good, then ask a helpful question.',
            'CASEL: Relationship skills',
          ),
          [
            N('Byte’s feedback was true-ish, but it stung. Pixel worked hard on that castle.'),
            N('What could Byte have said instead?'),
          ],
          [
            best(
              '“I like the drawbridge! How tall will the towers be?”',
              N('Yes. Notice something good, then ask a question. That’s honest and kind at the same time.'),
              N('Good feedback helps the maker want to keep going.'),
            ),
            opt(
              '“It’s perfect.”',
              N('That’s kind, but is it honest? The towers do stop halfway.'),
              N('Try: notice something good, then ask a helpful question. “Lovely gate! What will the towers look like?”'),
            ),
            opt(
              'Nothing at all.',
              N('Sometimes saying nothing is fine. But Pixel wanted a reaction!'),
              N('Kind, honest feedback works best: one thing you like, and one helpful question.'),
            ),
          ],
        ),
      ],
      [
        ch('help', 'Of course. Grand palace it is.', [PX('Thank you. Byte, write that down. Somebody believes.', 'happy')]),
        ch(
          'small',
          'It is quite small.',
          [PX('It is to SCALE. There is a difference.', 'angry'), BY('There is not.')],
          { 'q07-said-small': true },
        ),
      ],
    ),
    scene(
      'q07-stone',
      [
        N('You bring Pixel an armful of stone. Pixel weighs each piece in one hand like a jeweller.'),
        PX('This one is a tower. This one is a battlement. This one is… a nice stone. Keep that one.'),
        N('A battlement is the bumpy top of a castle wall, with gaps for peeking through.'),
        N('The stones from the riverbed are smooth and round. The ones from under the cliff are sharp and jagged.'),
        PX('Same rock, different lives. The river ones have clearly had a much more exciting time.', 'think'),
        N('Your Nubbin rolls a round one down the slope and chases after it.'),
      ],
      [
        ask(
          4,
          m(
            'science',
            'weathering and erosion: how rivers smooth stones',
            'Explained that river stones are smooth because flowing water tumbles them for a long time and wears off their corners.',
            '4-ESS2-1',
          ),
          [PX('Why do you think the river stones are so smooth and round, and the cliff stones so jagged?', 'think')],
          [
            best(
              'The river tumbles them about and wears the corners off.',
              PX('Yes! Water rolls them along, knocking them together, for years and years.', 'happy'),
              PX('Every knock rubs off a tiny bit. Slowly, the sharp corners wear away, and they end up round.'),
            ),
            opt(
              'Someone polished them.',
              PX('Ha! Someone did. The river did. Very slowly.', 'happy'),
              PX('Water tumbles the stones together for years and years, wearing their sharp corners away.'),
            ),
            opt(
              'They were born round.',
              PX('Most started jagged, like the cliff ones. The river changed them.', 'think'),
              PX('Flowing water knocks them together for years. Each knock wears a little more of the corners away.'),
            ),
          ],
        ),
      ],
    ),
    scene(
      'q07-towers',
      [
        PX('Now. The towers. Hold this, hold that, and whatever happens, do not breathe on the east wing.', 'think'),
        N('You build together. Pixel places, you hold, and your Nubbin hands up stones one at a time with great ceremony.'),
        N('Every few minutes Pixel stands back, squints, and moves one stone a hair to the left.'),
        BY('You moved that one back to where it was.'),
        PX('I moved it MORE to where it was.'),
        PX('It’s built to scale, you know. Every centimetre of my palace stands for 20 centimetres of a real one.'),
        N('The towers rise, stone by stone. They reach your knee. Then a little over your knee.'),
        N('A cloud passes. You lie flat in the grass, eye to eye with the gate. For one moment, the castle looks enormous.'),
        N('Then you sit up, and it is a model again. A very good one.'),
      ],
      [
        ask(
          5,
          m(
            'maths',
            'scale: multiplying to find real sizes',
            'Used a scale (1 cm stands for 20 cm) to work out a real size: 10 × 20 = 200 cm, or 2 metres.',
            '3.OA.A.3',
          ),
          [PX('The palace gate is 10 centimetres tall. Each centimetre stands for 20 real ones. How tall is the real gate?', 'think')],
          [
            best(
              '200 cm, which is 2 metres.',
              PX('Yes! Ten lots of 20 is 200 centimetres. That’s 2 metres. A proper gate.', 'happy'),
              BY('Fine. I admit that is a real gate. In theory.', 'think'),
            ),
            opt(
              '30 cm',
              PX('That adds 10 and 20. But scale means every centimetre becomes 20.', 'think'),
              PX('So it’s ten lots of 20: 200 centimetres, or 2 metres.'),
            ),
            opt(
              '10 cm',
              PX('That’s my model gate! The real one is much bigger.', 'think'),
              PX('Each of the 10 centimetres stands for 20, so 10 × 20 = 200 centimetres. Two metres!'),
            ),
          ],
        ),
        notice(
          7,
          m('art', 'perspective: near things look bigger', 'Learned that things close to your eye look bigger, and that artists use this to show near and far.'),
          [
            N('Why did it look enormous? Things close to your eye look bigger than things far away.'),
            N('With your eye right by the gate, the castle filled your whole view, like a real one far off.'),
            N('Artists use this too. Draw near things big and far things small, and a flat picture seems deep. That’s perspective.'),
          ],
        ),
      ],
    ),
    scene(
      'q07-finished',
      [
        N('The last stone goes on. Two proud towers, a lolly-stick drawbridge, and a flag made from a sweet wrapper.'),
        PX('Grove! The Grand Palace is COMPLETE!', 'happy'),
        N('The valley echoes back, faintly: “…plete.” Pixel takes this as applause.'),
        N('Far below, a Nubbin by the pond looks up, waves, and goes back to its puddle.'),
        BY('You know it’s the same on both sides? Tower, gate, tower. Very tidy.', 'think'),
        PX('Symmetrical, Byte. The word is symmetrical. I did it on purpose.', 'happy'),
      ],
      [
        notice(
          2,
          m('science', 'echoes: sound bouncing back', 'Learned that an echo is sound bouncing off a far, hard surface, like a hillside, and coming back.'),
          [
            N('Pixel’s shout travelled out across the valley. When it hit the far hillside, it bounced back.'),
            N('A sound that bounces back like that is an echo. The further away the hill, the longer the wait.'),
          ],
        ),
        act(
          5,
          m(
            'maths',
            'lines of symmetry',
            'Found the line of symmetry on the castle: the line that splits it into two matching halves.',
            '4.G.A.3',
          ),
          'edu:tap:symmetry-line:castle',
          [
            PX('Find my line of symmetry. Draw it so the two halves match exactly, like a mirror.'),
            N('Straight down the middle, through the gate. Tower on the left, tower on the right: a perfect match.'),
            BY('Except the flag. The flag is only on one side.', 'think'),
            PX('The flag is a FEATURE.', 'angry'),
          ],
        ),
      ],
    ),
    scene(
      'q07-complete',
      [
        N('That evening, three Nubbins wander up the hill and stop in front of the castle.'),
        N('One puts a leaf on its head like a crown. One stands on the drawbridge and points dramatically at nothing.'),
        N('The third lies down and plays a dragon, or a cloud. It is hard to say. It commits completely.'),
        PX('They’re putting on a play. In my palace. This is the best day of my whole life.', 'soft'),
        BY('Still quite small, I’d say…', 'think'),
        N('Byte stops, watches the leaf-crowned Nubbin take a very small bow, and sips the tea instead.'),
        BY('It is a very good model.', 'soft'),
        BY('The drawbridge is load-bearing. I tested it. Twice.'),
      ],
      [
        ask(
          7,
          m(
            'literacy',
            'think question: why a character changes',
            'Thought about what made a character change his mind, using what happened in the scene.',
            'RL.2.3',
          ),
          [N('Byte thought the castle was too small. Now he says it’s very good.'), N('What do you think changed his mind?')],
          [
            opt(
              'Seeing the Nubbins play in it.',
              N('That’s a fair answer. When the castle made someone happy, it stopped mattering how big it was.'),
            ),
            opt(
              'Seeing how happy Pixel was.',
              N('That’s a kind answer. Byte might grumble, but he cares about his friend.'),
            ),
            opt(
              'He always liked it. He just didn’t want to say so.',
              N('Ooh, a clever reading. Some characters hide how they feel until the right moment.'),
            ),
          ],
        ),
      ],
    ),
  ],
  [
    g('feedback', 'What someone tells you about your work, to help you understand it or improve it.', 'q07-intro'),
    g('battlement', 'The bumpy top of a castle wall, with gaps to look or shoot through.', 'q07-stone'),
    g('jagged', 'With sharp, rough, uneven points and edges.', 'q07-stone'),
    g('scale', 'How much smaller (or bigger) a model is than the real thing, such as 1 cm for every 20 cm.', 'q07-towers'),
    g('perspective', 'Showing distance in a picture by drawing near things bigger and far things smaller.', 'q07-towers'),
    g('echo', 'A sound you hear again after it bounces back off something far away and hard.', 'q07-finished'),
    g('symmetrical', 'The same on both sides of a middle line, like a reflection in a mirror.', 'q07-finished'),
  ],
  'Renamed from the main title, which is a quote. Byte’s approved quote is replaced with a new line. Hooks: kind ' +
    'feedback (CASEL: Relationship skills), river stones and erosion (4-ESS2-1), scale (3.OA.A.3), perspective (art), ' +
    'echoes (science), lines of symmetry (4.G.A.3), why a character changes (RL.2.3). Think question: ' +
    'reader:q07-complete-l1.',
);

// ================================================================ Q8 The Aqueduct Committee
const Q08 = quest(
  'q08',
  'The Aqueduct Committee',
  {
    'q08-s1': {
      goal: 'Build an aqueduct from the falls to your crops.',
      hint: 'Craft aqueduct sections at the Workshop from stone and wood, then lay them from the top of the falls down to the crop beds.',
    },
    'q08-s2': {
      goal: 'Harvest a crop from the aqueduct beds and take it to the committee.',
      hint: 'Ripe crops glow. Tap to harvest, then Give it to Reggie in the Keepers’ Hall.',
    },
  },
  [
    scene(
      'q08-intro',
      [
        N('In the Keepers’ Hall, a meeting is in progress. There are four chairs, three Keepers and a lot of paper.'),
        N('A banner on the wall says GROVE IMPROVEMENT COMMITTEE. Someone has crossed out IMPROVEMENT.'),
        N('A committee is a small group that meets to talk things over and decide. This one mostly grumbles.'),
        RG('Order. Order. Item one: all this building the new Keeper keeps doing.', 'angry'),
        FQ('Fences everywhere. Paths. Lanterns. Something with a drawbridge, I’m told.'),
        MG('My cousin tripped over a fence post. A brand-new one.'),
        RG('Has one single bit of this building done anybody any good? Name one thing!', 'angry'),
        N('There is a pause. Frannie, who is Reggie’s wife, raises a hand.'),
        FQ('Reggie, my love. The chair you are sitting on. The Keeper made it last week.'),
        RG('That is beside the point, Frannie. The point is the point.', 'think'),
        RG('Anyway. If you must build, Keeper, build something USEFUL. The crops are parched and my back is gone from carrying buckets.'),
      ],
      [
        notice(
          10,
          m(
            'social-studies',
            'Roman aqueducts: life in the past',
            'Learned that the ancient Romans built stone aqueducts, about 2,000 years ago, to carry water downhill to their towns.',
            'D2.His.2.K-2',
          ),
          [
            N('An aqueduct is a channel that carries water a long way. “Aqua” is the Latin word for water.'),
            N('About 2,000 years ago, the ancient Romans built huge stone aqueducts to bring water to their towns.'),
            N('They had no pumps. The channel sloped gently downhill the whole way. Some of them are still standing today.'),
          ],
        ),
      ],
      [
        ch('aqueduct', 'Fine. I’ll build an aqueduct.', [RG('A what?'), Y('A sort of bridge, for water.'), RG('Pfft. Sounds like more building.', 'angry')]),
        ch(
          'minutes',
          'Can I see the minutes?',
          [
            N('The minutes are the written notes of what a meeting decided.'),
            N('These say, in full: “Met. Grumbled. Biscuits.”'),
          ],
          { 'q08-read-minutes': true },
        ),
      ],
    ),
    scene(
      'q08-water',
      [
        N('The last section clicks into place. Water from the falls slides down the channel, glittering.'),
        N('It runs the whole way by itself. Nobody pumps it. Nobody carries a single bucket.'),
        N('It spills into the crop beds. The crops have been wilting all week, drooping because they were short of water.'),
        N('Within the hour they do a small, grateful droop-then-perk. Leaves lift. Stems stand up straight.'),
        N('Your Nubbins jump about in the overflow, shrieking happily.'),
        Y('It just… flows. Downhill, all on its own.'),
      ],
      [
        ask(
          1,
          m('science', 'gravity makes water flow downhill', 'Explained that an aqueduct needs no pump because gravity pulls water down a gentle slope.'),
          [N('No pump, no buckets. So what moves the water all the way from the falls to the crops?')],
          [
            best(
              'Gravity. The channel slopes downhill.',
              N('Yes. Gravity pulls water down. The falls are higher than the crops, so the channel slopes gently down.'),
              N('As long as every section is a little lower than the one before, the water keeps going.'),
            ),
            opt(
              'The Nubbins are pushing it.',
              N('They are mostly splashing in it! The water moves because of gravity.'),
              N('The falls are higher up, so the channel slopes downhill, and gravity pulls the water along.'),
            ),
            opt(
              'Water just likes moving.',
              N('It does seem keen! But it only goes one way: down. Gravity pulls it.'),
              N('That’s why the channel must slope gently downhill from the falls all the way to the crops.'),
            ),
          ],
        ),
        notice(
          3,
          m(
            'science',
            'why plants wilt, and perk up with water',
            'Learned that plants droop when short of water and stand up again when water fills their cells.',
            '2-LS2-1',
          ),
          [
            N('Plants are made of tiny parts called cells. When there is plenty of water, the cells are full and firm.'),
            N('Like a balloon full of water, that firmness holds the stems and leaves up.'),
            N('When water runs short, the cells go floppy and the plant wilts. Water it, and up it comes again.'),
          ],
        ),
      ],
    ),
    scene(
      'q08-invite',
      [
        N('A note arrives, folded into a very small square.'),
        N('“Emergency meeting. Re: the aqueduct. Bring something from the crops so we can examine it. Reggie.”'),
        N('Underneath, in different handwriting: “Bring biscuits too. Frannie.”'),
        N('A second note arrives a minute later: “Ignore the first note. Mine is the only real committee. Breakaways! Mags.”'),
        N('A breakaway is a group that splits off from a bigger one. By lunchtime there are three committees.'),
        N('Nobody is sure who is in the third.'),
        Y('Examine it for what?'),
        N('Your Nubbin, dripping from the overflow, has no idea either, and does not mind.'),
        N('The crop bed beside the aqueduct is already plump and shining. Little paths divide it into squares, one metre on each side.'),
      ],
      [
        act(
          8,
          m(
            'maths',
            'area of a rectangle by multiplying',
            'Found the area of a crop bed (4 rows of 6 one-metre squares = 24 square metres) by multiplying instead of counting one by one.',
            '3.MD.C.7',
          ),
          'edu:count:bed-squares:24',
          [
            N('Count the squares in the bed. There are 4 rows, with 6 squares in each row.'),
            N('You could count them one by one, or multiply: 4 × 6 = 24.'),
            N('Each square is one square metre, so the bed’s area is 24 square metres. That’s a lot of crops.'),
          ],
        ),
      ],
    ),
    scene(
      'q08-delivered',
      [
        N('Reggie takes the crop, turns it over, sniffs it, and holds it up to the light for a suspiciously long time.'),
        FQ('Well?'),
        RG('Hmm. It’s very good.', 'angry'),
        RG('I hate that it’s very good.'),
        N('Frannie writes something in the minutes. Mags passes round the biscuits, looking smug.'),
        N('Reggie takes two biscuits at once, which is how you can tell he is upset.'),
      ],
      [
        ask(
          3,
          m(
            'literacy',
            'a character’s feelings and motives',
            'Explained a character’s mixed feelings: Reggie likes the crop but hates admitting he was wrong.',
            'RL.3.3',
          ),
          [N('Why would Reggie hate that the crop is good?')],
          [
            best(
              'Because he said the building was useless, and now he has to admit he was wrong.',
              N('Exactly. Reggie likes the crop. What he hates is being wrong in front of everyone.'),
              N('Two feelings at once. Characters, like people, often have mixed feelings.'),
            ),
            opt(
              'He doesn’t like vegetables.',
              N('He seems to like this one! Look: “It’s very good.”'),
              N('What he hates is having to admit he was wrong about the building. That’s much harder to swallow.'),
            ),
            opt(
              'He’s just a grumpy person.',
              N('He is grumpy! But there’s a reason here too.'),
              N('He said building was useless. Now the proof is in his hand, and he has to admit he was wrong.'),
            ),
          ],
        ),
      ],
    ),
    scene(
      'q08-complete',
      [
        RG('Item one. The aqueduct. All right. It waters the crops. I grant you the crops. But what ELSE has it done?', 'angry'),
        FQ('The Nubbins love the spray. They’ve stopped asking me for baths.'),
        MG('The frogs moved in. I like the frogs.'),
        FQ('It hums at night. Very soothing.'),
        MG('My cousin can’t trip over it. It’s up in the air.'),
        RG('Fine. Crops, baths, frogs, humming, your cousin. Is that ALL?', 'angry'),
        FQ('It keeps the path cool in summer.'),
        MG('It’s pretty.', 'soft'),
        FQ('And you’ve been filling your teapot from it since Tuesday, Reggie. We’ve all seen you.'),
        RG('My wife exaggerates. Twice a day, at most.'),
        RG('…I propose a motion to thank the Keeper. All in favour.', 'sad'),
        N('A motion is an idea put to a meeting for a vote. Every hand goes up, Reggie’s last and slowly.'),
        N('Frannie pulls out the fourth chair for you. It has had your name on it since item one.'),
        MG('Biscuit?'),
        N('The crops beside the aqueduct will never need watering again.'),
      ],
      [
        ask(
          9,
          m(
            'maths',
            'tally charts',
            'Kept a tally of the good things the committee listed and counted the total (one group of five and three more: 8).',
            '2.MD.D.10',
          ),
          [
            N('Frannie has been keeping a tally of every good thing anyone said about the aqueduct.'),
            N('Crops, baths, frogs, humming, cousin, cool path, pretty, teapot. How many tally marks?'),
          ],
          [
            best(
              '8',
              N('Yes: one gate of five, and three more. Five and three make eight.'),
              FQ('Eight good things, Reggie. I’ve underlined it twice.', 'happy'),
            ),
            opt(
              '5',
              N('That’s one full gate of five. But there are three more after it: cool path, pretty, teapot.'),
              N('Five and three make eight.'),
            ),
            opt(
              '7',
              N('So close! Count again, and don’t forget Reggie’s teapot: that was the last one.'),
              N('One gate of five, and three more. Eight.'),
            ),
          ],
        ),
        ask(
          14,
          m(
            'sel',
            'think question: why do people grumble about changes that help them?',
            'Thought about why change can feel uncomfortable, even when it helps.',
            'CASEL: Self-awareness',
          ),
          [N('Reggie grumbled about the aqueduct, while quietly filling his teapot from it.'), N('Why do you think people sometimes grumble about changes that help them?')],
          [
            opt(
              'Change feels strange, even when it’s good.',
              N('That’s a fair answer. New things take getting used to, and grumbling is how some people get used to them.'),
            ),
            opt(
              'Nobody asked Reggie first.',
              N('That’s a thoughtful answer. People like to be asked about changes to their home. Being asked feels respectful.'),
            ),
            opt(
              'He just likes grumbling.',
              N('Ha! A fair answer. For some people, grumbling is a hobby. Reggie may be the champion.'),
            ),
          ],
        ),
      ],
    ),
  ],
  [
    g('committee', 'A small group of people who meet to talk things over and make decisions.', 'q08-intro'),
    g('aqueduct', 'A channel or bridge built to carry water a long way, sloping gently downhill.', 'q08-intro'),
    g('wilting', 'Drooping because a plant is short of water.', 'q08-water'),
    g('breakaway', 'A group that splits off from a bigger group.', 'q08-invite'),
    g('area', 'How much flat space a shape covers, measured in squares.', 'q08-invite'),
    g('motion', 'At a meeting, an idea that someone suggests and everyone then votes on.', 'q08-complete'),
  ],
  'Renamed from the main title, which echoes a quote. The approved quote and the two lines after it are replaced, and ' +
    'the complete scene’s “apart from” refrain is rewritten so it no longer echoes the quote. Hooks: Roman aqueducts ' +
    '(D2.His.2.K-2), gravity, wilting (2-LS2-1), area (3.MD.C.7), mixed feelings (RL.3.3), tally charts (2.MD.D.10), ' +
    'grumbling about change (sel). Think question: reader:q08-complete-l2.',
);

// ================================================================ Q9 The Gourd and the Shoe
const Q09 = quest(
  'q09',
  'The Gourd and the Shoe',
  {
    'q09-s1': {
      goal: 'Go back for your shoe.',
      hint: 'You left it by the ditch on the long loop. The crowd will follow you there, whatever you do.',
    },
    'q09-s2': {
      goal: 'Settle the argument between the gourd camp and the shoe camp.',
      hint: 'Wear the gourd and the shoe where both camps can see. Tap each in your bag and choose Wear.',
    },
  },
  [
    scene(
      'q09-intro',
      [
        N('You are halfway round your evening walk when the strap on your bag snaps. A small gourd rolls into the ditch.'),
        N('You bend to fetch it, and your shoe comes off in the mud with a noise like a kiss.'),
        N('You leave them both. It has been a long day. You will come back for them.'),
        N('When you look round, a small crowd of Nubbins has gathered by the gourd and the shoe, very quietly.'),
        N('They look at you. Then they look at each other. Then they start following you, at a respectful distance.'),
        BT('It is a sign!', 'shock'),
        Y('It’s a gourd. And a shoe.'),
        BT('It is TWO signs!', 'happy'),
      ],
      [
        notice(
          6,
          m('science', 'gourds: fruits with hard shells', 'Learned that gourds are hard-shelled fruits in the pumpkin family, dried by people to make bowls, bottles and rattles.'),
          [
            N('A gourd is a fruit that grows on a trailing vine. It belongs to the same plant family as pumpkins and squash.'),
            N('When a gourd dries out, its shell goes hard and light. It still rattles: the seeds rattle inside.'),
            N('People all over the world have used dried gourds as bowls, bottles and rattles for thousands of years.'),
          ],
        ),
      ],
      [
        ch('stop', 'Please stop following me.', [
          N('They stop. Then they all take one step after you, very slowly, in case that doesn’t count.'),
        ]),
        ch(
          'faster',
          'Walk faster.',
          [N('They walk faster. A little Nubbin at the front carries the gourd above its head like a lantern.')],
          { 'q09-walked-faster': true },
        ),
      ],
    ),
    scene(
      'q09-split',
      [
        N('By the time you reach the ditch, the crowd has split in two.'),
        N('Half are bowing to the shoe, which they have set on a rock. The other half are holding up the gourd and humming.'),
        GN('The gourd is round, like the sun. Round things are never wrong.'),
        SN('The shoe has laces. Nobody understands laces. Follow the laces.', 'angry'),
        N('A third, much smaller group has gathered round a pebble that was near the shoe. Neither of the other camps will speak to them.'),
        Y('Has anybody actually checked? Is there any evidence for any of this?'),
        N('Everyone stares at you. Checking had not occurred to anybody.'),
      ],
      [
        ask(
          6,
          m(
            'science',
            'evidence versus bad reasons',
            'Told the difference between evidence (something you can check) and bad reasons for believing something.',
          ),
          [N('“Round things are never wrong.” “Nobody understands laces.”'), N('Which of these is the best reason to believe something?')],
          [
            best(
              'I checked, and I found evidence.',
              N('Yes. Evidence is something you can check, that other people can check too.'),
              N('Being round, or having laces, or being followed by a crowd: none of those make anything true.'),
            ),
            opt(
              'Lots of people believe it.',
              N('A crowd can be wrong. This crowd is bowing to a shoe!'),
              N('The best reason is evidence: something you can check and others can check too.'),
            ),
            opt(
              'It sounds important.',
              N('Lots of nonsense sounds important. “Follow the laces” sounds very important.'),
              N('The best reason to believe something is evidence: something you can check for yourself.'),
            ),
          ],
        ),
      ],
    ),
    scene(
      'q09-mother',
      [
        N(
          'A Keeper in a headscarf marches up the path, rolling up her sleeves. This is Mother Brindle, Barty’s Keeper, who hatched him. She is not pleased.',
        ),
        MB('What’s all this, then? Barty! Is that you at the front?', 'angry'),
        BT('Mother! The signs!', 'happy'),
        GN('Barty saw the signs first. Barty is very special.'),
        MB('Special? He put a frog in the teapot this morning. He is going to BED.', 'angry'),
        BT('It was only a small frog.', 'soft'),
        MB('It’s past his bedtime. And yours, all of you.'),
        MB(
          'Sort this out, will you? Nobody listens to me. I’m only his mother. Well. I hatched him. Same thing.',
          'sad',
        ),
      ],
      [
        ask(
          7,
          m(
            'sel',
            'showing someone you are listening',
            'Practised active listening: looking at someone, letting them finish, and saying back what they need.',
            'CASEL: Relationship skills',
          ),
          [N('Mother Brindle says nobody listens to her. She sounds exasperated: fed up and worn out.'), N('How could you show her that you are listening?')],
          [
            best(
              'Look at her, let her finish, then say back what she needs.',
              N('Yes. “You need everyone home and in bed.” Saying it back shows you really heard.'),
              MB('Thank you, love. That’s all I wanted. Someone to actually hear it.', 'soft'),
            ),
            opt(
              'Nod while looking at the gourd.',
              N('Nodding is a start, but she can tell your eyes are on the gourd!'),
              N('Look at her, let her finish, and say back what she needs. Then she knows you heard.'),
            ),
            opt(
              'Tell her not to worry.',
              N('That’s kind, but it skips over what she said.'),
              N('First show you heard: look at her, let her finish, and say back what she needs.'),
            ),
          ],
        ),
      ],
      [
        ch(
          'both',
          'Tell them both are signs.',
          [N('Both camps cheer, then look at each other suspiciously, then cheer again, slightly less.')],
          { 'q09-ruling': 'both' },
        ),
        ch(
          'neither',
          'Tell them it’s just things you dropped.',
          [
            N(
              'Nobody believes you. They say only a very special Keeper would say that. Mother Brindle sighs.',
            ),
          ],
          { 'q09-ruling': 'neither' },
        ),
        ch(
          'themselves',
          'Tell them to think for themselves.',
          [
            Y('You don’t need to follow me. Any of you. You can all think for yourselves!'),
            N('Everyone nods at once, perfectly together. Then they all wait for you to tell them what to think.'),
            BT('What should we think first?', 'happy'),
            N('Mother Brindle puts her face in her hands.'),
          ],
          { 'q09-ruling': 'themselves' },
        ),
      ],
    ),
    scene(
      'q09-hats',
      [
        N('You put the gourd on your head. It wobbles.'),
        N('Then, after a moment’s thought, you balance the shoe on top of the gourd.'),
        N('It slides left. The crowd gasps. You tilt your head. It slides right. The crowd gasps again.'),
        N('You find the exact middle. You hold very, very still. The shoe stays.'),
        N('Both camps gasp. Both camps are right. Nobody can argue with that.'),
        BT('Follow the Keeper!', 'happy'),
      ],
      [
        act(
          3,
          m(
            'science',
            'balance: keep the balance point over the base',
            'Balanced a stack by keeping its balance point over its support, and learned how gravity tips things that lean.',
            '3-PS2-1',
          ),
          'edu:balance:shoe:centre',
          [
            N('Tilt your head to keep the shoe steady. Find the spot where it stops sliding.'),
            N('Every object has a balance point. Keep that point right above whatever holds it up, and it stays put.'),
            N('Let it lean past the edge, and gravity tips it over. Stand tall. Breathe slowly. Don’t sneeze.'),
          ],
        ),
      ],
    ),
    scene(
      'q09-complete',
      [
        N('The whole crowd falls in behind you in one long, happy, wobbling line.'),
        N('There are nine of them, one behind the other, each exactly one metre behind the next.'),
        N('You walk to the pond. They walk to the pond. You turn round. They turn round, and bump into each other.'),
        N('When you finally stop, they stop, sit down and fall asleep in a heap, with Barty on top.'),
        MB('Thank you, love. Keep the gourd. And the shoe. I don’t want them in my house; they’ll only start something.', 'soft'),
        N('From now on, if you call “Follow me”, every Nubbin in the Grove will trail behind you in a parade until you stop.'),
      ],
      [
        ask(
          1,
          m('maths', 'counting gaps in a line', 'Worked out that 9 Nubbins in a line have 8 gaps between them, so the line is 8 metres long.'),
          [N('Nine Nubbins in a line, one metre apart. How long is the line, from the first Nubbin to the last?')],
          [
            best(
              '8 metres',
              N('Yes! Nine Nubbins, but only eight gaps between them. Eight gaps of one metre: 8 metres.'),
              N('Try it with your fingers: hold up three, and count the gaps. Two!'),
            ),
            opt(
              '9 metres',
              N('Lots of people say that! But count the gaps, not the Nubbins.'),
              N('Between 9 Nubbins there are only 8 gaps. So the line is 8 metres long.'),
            ),
            opt(
              '10 metres',
              N('Too many! Count the gaps between the Nubbins.'),
              N('Nine Nubbins have eight gaps between them: 8 metres.'),
            ),
          ],
        ),
        ask(
          5,
          m(
            'sel',
            'think question: following and thinking for yourself',
            'Thought about when it is wise to follow someone and when to think for yourself.',
            'CASEL: Responsible decision-making',
          ),
          [N('The Nubbins followed you everywhere, just because others did.'), N('When is it good to follow someone, and when should you think for yourself?')],
          [
            opt(
              'Follow people you trust. Think for yourself when something feels wrong.',
              N('That’s a fair answer. Trust is earned, and a funny feeling inside is worth listening to.'),
            ),
            opt(
              'It’s fine to follow, as long as you know where you’re going.',
              N('That’s a thoughtful answer. Following with your eyes open is very different from following with them shut.'),
            ),
            opt(
              'Always think for yourself, even if you end up agreeing.',
              N('That’s a fair answer. You can still choose the same thing as everyone else, as long as it was your choice.'),
            ),
          ],
        ),
      ],
    ),
  ],
  [
    g('gourd', 'A fruit with a hard shell, from the same plant family as pumpkins.', 'q09-intro'),
    g('evidence', 'Facts or signs you can check, that show whether something is true.', 'q09-split'),
    g('exasperated', 'Very fed up and worn out, because something keeps going wrong.', 'q09-mother'),
    g('balance point', 'The spot where an object’s weight is evenly spread, so it can rest without tipping.', 'q09-hats'),
  ],
  'The approved quote is replaced with a new line, and everything stays gentle and non-religious. Hooks: gourds ' +
    '(science), evidence versus bad reasons (science), active listening (CASEL: Relationship skills), balance ' +
    '(3-PS2-1), counting gaps in a line (maths), following and thinking for yourself (sel). Think question: ' +
    'reader:q09-complete-l2.',
);

// ================================================================ Q10 Haggle
const Q10 = quest(
  'q10',
  'Haggle',
  {
    'q10-s1': {
      goal: 'Offer Harrow less than he is asking for the brass bell.',
      hint: 'Tap the bell and choose Haggle instead of Buy. Start low. Lower than feels polite.',
    },
    'q10-s2': {
      goal: 'Haggle with Harrow through three full rounds.',
      hint: 'Each round, offer something between your last number and his. Agree too fast and he starts again.',
    },
  },
  [
    scene(
      'q10-intro',
      [
        N('There is a new stall by the market path, piled with odds and ends. Behind it sits a Keeper with a pencil behind each ear.'),
        HT('Morning! Harrow Tuppence. Everything a Grove could want, and several things it couldn’t.', 'happy'),
        N('You spot a little brass bell. Your Nubbin spots it too and makes a small, longing noise.'),
        Y('How much is the bell?'),
        HT('Twenty Shells.'),
        N('You count out twenty Shells and hold them out.'),
        N('Harrow stares at the Shells. Then at you. His face falls by about a mile.'),
        HT('Twenty? Just like that? No haggling? Not even a little bit?', 'shock'),
        HT('Put those away. I can’t take that. It’s insulting. To both of us. To the bell.', 'angry'),
      ],
      [
        notice(
          8,
          m('social-studies', 'markets and haggling around the world', 'Learned that in many markets people agree a price by haggling, while most shops have fixed prices.'),
          [
            HT('To haggle is to bargain: we argue the price up and down until we both agree.', 'think'),
            N('In many markets around the world, haggling is normal and even expected. It can be friendly, like a game.'),
            N('In most shops, though, the price on the tag is the price. Haggling there just confuses people.'),
          ],
        ),
      ],
      [
        ch('sorry', 'Sorry. How does this work?', [
          HT('You say a number. I say a bigger number. We weep. We meet in the middle. We shake. It’s beautiful.', 'soft'),
        ]),
        ch(
          'tag',
          'Twenty is what the tag says.',
          [HT('The tag is the OPENING. Nobody listens to the tag. The tag is where we start. Nobody pays the tag.', 'angry')],
          { 'q10-stubborn': true },
        ),
      ],
    ),
    scene(
      'q10-first-offer',
      [
        HT('Right. Your turn. Say a number. Lower than twenty. Go on.', 'think'),
        Y('…Eight Shells?'),
        HT('EIGHT?', 'shock'),
        N('He clutches the stall. He clutches his heart. He clutches the bell, protectively.'),
        N('Then, while you aren’t looking, he winks at your Nubbin.'),
        HT('Now we’re talking. Oh, that’s lovely. Do go on.', 'happy'),
      ],
      [
        ask(
          5,
          m(
            'literacy',
            'spotting exaggeration from clues',
            'Used clues (the wink, “that’s lovely”) to tell that a character is exaggerating, not truly upset.',
            'RL.3.3',
          ),
          [N('Harrow clutched his heart at “eight”. Is he really shocked, or does he exaggerate?')],
          [
            best(
              'No. He’s exaggerating for fun. He winked!',
              N('Yes. The wink and “that’s lovely” are the clues. He’s acting shocked because that’s part of the game.'),
              N('To exaggerate is to make something sound much bigger than it is. Harrow is an expert.'),
            ),
            opt(
              'Yes, eight is a terrible offer.',
              N('Look at the clues: he winked at your Nubbin, then said “that’s lovely”.'),
              N('He isn’t hurt. He’s exaggerating: making it sound much bigger, for fun.'),
            ),
            opt(
              'He might need a doctor.',
              N('Ha! He’s fine. Read on: he winks, then says “Oh, that’s lovely.”'),
              N('The heart-clutching is exaggeration: acting it up because haggling is a kind of performance.'),
            ),
          ],
        ),
      ],
    ),
    scene(
      'q10-rounds',
      [
        HT('Right. Proper rules. Three rounds. I go down, you go up, and we both pretend to leave at least once.', 'think'),
        HT('Don’t meet me too quick, that’s rude. Don’t hold out too long, that’s also rude. Somewhere in between is an art.'),
        N('Your Nubbin climbs onto the counter to watch. This is clearly the best thing that has ever happened in a shop.'),
        HT('Twenty. For you. Because I like your face.'),
        Y('Ten.'),
        HT('Ten? For a BELL? It rings in two keys, you know. Eighteen.', 'angry'),
      ],
      [
        ask(
          5,
          m(
            'maths',
            'number patterns that follow a rule',
            'Found the rule in Harrow’s prices (take away 2) and used it to predict the next numbers: 16, then 14.',
            '4.OA.C.5',
          ),
          [N('Harrow’s prices go 20, then 18. If he keeps the same rule, what will his next two prices be?')],
          [
            best(
              '16, then 14',
              N('Yes. The rule is “take away 2” each time: 20, 18, 16, 14.'),
              N('A number pattern with a rule lets you guess what comes next. Very handy when haggling.'),
            ),
            opt(
              '17, then 16',
              N('That takes away 1. Look again: 20 to 18 is a drop of 2.'),
              N('Keep taking away 2: 18, 16, 14. His next prices are 16, then 14.'),
            ),
            opt(
              '10, then 8',
              N('Those are your numbers! Harrow’s go 20, then 18. That’s 2 less each time.'),
              N('So next comes 16, then 14.'),
            ),
          ],
        ),
      ],
      [
        ch(
          'walk',
          'Pretend to walk away.',
          [N('You get three steps. Harrow calls out “Sixteen!” in a voice of real anguish.')],
          { 'q10-walked-off': true },
        ),
        ch('admire', 'Admire the bell, then go lower.', [
          HT('Flattery AND a low offer. Who taught you that? Me. I did. Just now.', 'happy'),
        ]),
      ],
    ),
    scene(
      'q10-deal',
      [
        HT('Fourteen. My final offer. I’ll be ruined. My children will eat gravel.', 'sad'),
        Y('You don’t have children.'),
        HT('Fourteen, then, and nobody eats gravel.', 'happy'),
        N('You shake on it. Harrow’s eyes are a little wet. He says it’s the wind.'),
        N('Fourteen is exactly halfway between his twenty and your first eight. Neither of you planned that. Probably.'),
        HT('Halfway. The fairest spot there is. Lovely.', 'soft'),
      ],
      [
        ask(
          2,
          m(
            'sel',
            'think question: pretending in a game, or lying?',
            'Thought about the difference between pretending inside a game everyone understands and telling a lie.',
            'CASEL: Responsible decision-making',
          ),
          [N('Harrow said his children would eat gravel. He doesn’t have any children.'), N('Was that a lie, or part of the game?')],
          [
            opt(
              'Part of the game. Everyone knew he didn’t mean it.',
              N('That’s a fair answer. When everyone knows the rules, pretending is play, like acting in a play.'),
            ),
            opt(
              'A bit of a lie, even if it was funny.',
              N('That’s an honest answer. Even a joke can blur the truth. You did call him on it, after all.'),
            ),
            opt(
              'It depends whether the other person knows it’s a game.',
              N('That’s a wise answer. Pretending is fine when both people are in on it. It’s tricking when one isn’t.'),
            ),
          ],
        ),
      ],
    ),
    scene(
      'q10-complete',
      [
        N('You hand over fourteen Shells. Harrow counts them twice, tenderly, like a man counting doves.'),
        HT('That, Keeper, was a proper bit of business. Best I’ve had all week. Only one I’ve had all week.', 'happy'),
        N('He presses a small gourd into your hands as well. “Free. Nobody haggles over a gourd. Dreadful things, gourds.”'),
        N('Your Nubbin rings the brass bell. It does, in fact, ring in two keys.'),
        HT('Tell you what. I’ve had a word with the shop. You can haggle there too, now. Anything you buy.', 'think'),
        HT('They won’t go lower than a fifth off. And you have to mean it. Shopkeepers can tell.'),
        N('From now on, any purchase in the shop can start with a bit of haggling, for up to 20% off.'),
      ],
      [
        ask(
          0,
          m(
            'maths',
            'money subtraction with Shells',
            'Worked out the saving in Shells: 20 − 14 = 6, by counting on from 14 to 20.',
            '2.OA.A.1',
          ),
          [N('The tag said 20 Shells. You paid 14. How many Shells did you save?')],
          [
            best(
              '6 Shells',
              N('Yes. Count on from 14: 15, 16, 17, 18, 19, 20. That’s 6. Six Shells still in your pocket.'),
            ),
            opt(
              '4 Shells',
              N('Nearly! Count on from 14 to 20: 15, 16, 17, 18, 19, 20. Six counts.'),
              N('You saved 6 Shells.'),
            ),
            opt(
              '34 Shells',
              N('That adds them together. To find what you saved, take away: 20 − 14.'),
              N('Count on from 14 to 20, and you get 6 Shells saved.'),
            ),
          ],
        ),
        notice(
          6,
          m(
            'social-studies',
            'fairness: keeping your side of a deal',
            'Heard why a deal is a promise both sides keep, and why that keeps trading fair.',
            'D2.Civ.8.K-2',
          ),
          [
            HT('One more thing, Keeper. A deal is a promise. We both agreed fourteen, so fourteen it is.', 'think'),
            HT('If buyers and sellers didn’t keep their word, nobody could trust a market. Then where would we be?'),
            HT('Somewhere without bells, that’s where.', 'sad'),
          ],
        ),
      ],
      [
        ch(
          'tip',
          'Slip him the six Shells you saved.',
          [
            HT('Don’t you DARE.', 'angry'),
            HT('A deal’s a deal. Pay twenty now and the whole morning meant nothing. Put it away.'),
            N('You put it away. He looks, for some reason, enormously proud of you.'),
          ],
          { 'q10-tipped': true },
        ),
        ch('shake', 'Shake on it again, for luck.', [
          N('You offer your hand. He haggles you down to a slightly shorter handshake, and looks delighted.'),
        ]),
      ],
    ),
  ],
  [
    g('haggle', 'To bargain over a price, going up and down until buyer and seller agree.', 'q10-intro'),
    g('exaggerate', 'To make something sound bigger, worse or better than it really is.', 'q10-first-offer'),
    g('tenderly', 'Gently and lovingly.', 'q10-complete'),
  ],
  'The main quest has no source quotes; every line here is still new or lightly rewritten. Hooks: markets and haggling ' +
    '(social studies), exaggeration (RL.3.3), number patterns (4.OA.C.5), pretending versus lying (sel), money ' +
    'subtraction with Shells (2.OA.A.1), keeping a deal (D2.Civ.8.K-2). Think question: reader:q10-deal-l1. The ' +
    'final price, 14, is exactly halfway between 20 and 8.',
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

/** Q4, Q6 and Q9 payoffs; registered with the reader variants (see the wiring notes in fix-B). */
export const EDU_PYTHON_1_READER_VARIANTS: EduScene[] = [
  completeWith(
    Q04,
    'q04-complete-kept',
    0,
    [
      N('The Run Nubbin, whose name turns out to be Trotwell, clops a lap of the whole Grove.'),
      N('Nobody else gets a go. Trotwell clops past the whole queue, very politely smug.'),
    ],
    1,
  ),
  completeWith(
    Q04,
    'q04-complete-shared',
    0,
    [
      N('The Run Nubbin, whose name turns out to be Trotwell, clops a lap of the whole Grove.'),
      N('Everyone gets a go. Trotwell stands at the front of the queue and the back, which takes a lot of running.'),
    ],
    1,
  ),
  completeWith(Q06, 'q06-complete-shouted', 5, [N('“P.P.S. The wall is NOT wonky.”')]),
  completeWith(Q06, 'q06-complete-laughed', 5, [
    N('“P.P.S. You laughed. Nobody laughs on the wall. Do it again.”'),
  ]),
  completeWith(Q06, 'q06-complete-knocked', 5, [N('“P.P.S. I have no rabbit. Stop knocking.”')]),
  completeWith(Q09, 'q09-complete-themselves', 4, [
    N('The pebble group sleeps a little apart, on purpose. They have thought for themselves, and they think the heap is too warm.'),
  ]),
  completeWith(Q09, 'q09-complete-pebble', 4, [
    N('The pebble group sleeps at the edge, still holding its pebble. Nobody has asked it anything. It is perfectly happy.'),
  ]),
];

export const EDU_PYTHON_1_READER: EduQuest[] = [Q01, Q02, Q03, Q04, Q05, Q06, Q07, Q08, Q09, Q10];

export const CHECKS: string[] = [
  'edu:measure:beetle-path:2cm',
  'edu:tally:nubbins:fives',
  'edu:clap:rhythm:walk-trot-canter',
  'edu:tap:symmetry-line:castle',
  'edu:count:bed-squares:24',
  'edu:balance:shoe:centre',
];
