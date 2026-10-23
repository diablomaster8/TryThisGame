/**
 * The Learning Grove, reader band (ages 7–10): the Avatar fun quests Q46–Q55 (quests-avatar.ts).
 *
 *   Q46 Not the Cabbages!       subtraction, gravity, stable bases (wide and low beats tall), perimeter
 *   Q47 The Crystal Tunnel      rhyme and beat, light and seeing, bats and echolocation, time intervals
 *   Q48 The Great Divide        fair ways to decide, erosion by rivers (4-ESS2-1), rock layers, honesty
 *   Q49 The Secret Dance        prefixes, times tables, vibration, beat, what makes a good rule, exercise
 *   Q50 Uncle Tenzo’s Tea Stall timing (3.MD.A.1), boiling and steam, similes, Shells sums, grams
 *   Q51 Cactus Juice            wild-plant safety, sharing water, cactus adaptations (4-LS1-1), saving water
 *   Q52 Puffin’s Lost Days      herds, caring for a frightened animal, migration, distance and time
 *   Q53 The Fan Warriors        judging by looks, symmetry, sideways forces, repeating patterns, apologies
 *   Q54 The Sword Master        calm breathing, meteors and meteorites, hot metal, two-step sums, alliteration
 *   Q55 The Ember Bay Players   point of view (RL.3.6), senses, pairs, fair criticism, theatre masks
 *
 * One EduScene per original scene: every step scene, every done scene and every complete scene.
 * Reader keeps every choice, with its original id and `set` flags.
 * The approved quotes from the show never appear here: every line is original. Uncle Tenzo’s
 * proverbs and the Q47 nomad song are the game’s own (original) lines, so they stay.
 * Every quest has at least one think question (an `ask` with no `best`). See EDU-STYLE.md.
 */
import type { EduDomain, EduQuest, EduScene, GlossaryEntry, Lesson, LessonOption } from './types';
import type { Choice, Line, Mood } from '../config/story';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

const N = say('narrator');
const Y = say('you');
const P = say('pemba');
const K = say('nalu');
const T = say('tuk');
const B = say('bao');
const Z = say('kaito');
const I = say('tenzo');
const A = say('puffin');
const C = say('cabbage-merchant');
const S = say('sumi');
const PI = say('pian');
const PL = say('ember-bay-players');
const J = say('juno');
const MA = say('maud');
const BR = say('brack');
const H = say('headmaster');
const R = say('rin');
const PE = say('mr-pell');

// ---------------------------------------------------------------- builders
type LessonDraft = Omit<Lesson, 'id'>;

/** Builds `reader:<of>` and numbers its lessons `reader:<of>-l1`, `-l2`. */
const scene = (of: string, lines: Line[], lessons: LessonDraft[], choices?: Choice[]): EduScene => {
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

const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice =>
  set ? { id, label, set, then } : { id, label, then };

const opt = (label: string, reply: Line[], best?: boolean): LessonOption =>
  best ? { label, best: true, reply } : { label, reply };

/** An ask lesson. A think question is an ask whose options have no `best`. */
const ask = (
  after: number,
  domain: EduDomain,
  skill: string,
  prompt: Line[],
  options: LessonOption[],
  parentNote: string,
  standard?: string,
): LessonDraft => ({
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
  lines: Line[],
  parentNote: string,
  standard?: string,
): LessonDraft => ({
  domain,
  skill,
  ...(standard ? { standard } : {}),
  kind: 'notice',
  after,
  lines,
  parentNote,
});

const act = (
  after: number,
  domain: EduDomain,
  skill: string,
  check: string,
  lines: Line[],
  parentNote: string,
  standard?: string,
): LessonDraft => ({
  domain,
  skill,
  ...(standard ? { standard } : {}),
  kind: 'do',
  after,
  check,
  lines,
  parentNote,
});

const gloss = (word: string, meaning: string, of: string): GlossaryEntry => ({ word, meaning, scene: `reader:${of}` });

// ================================================================== Q46 Not the Cabbages!
const Q46: EduQuest = {
  id: 'reader:q46',
  of: 'q46',
  band: 'reader',
  title: 'Not the Cabbages!',
  goals: {
    'q46-s1': {
      goal: 'Find all 8 cabbages that rolled across the meadow, and help put the cart’s wheel back on.',
      hint: 'Round things roll downhill. Look along the stream bank and under the bushes.',
    },
    'q46-s2': {
      goal: 'Shake the big fruit tree until nothing else falls, then mend the cart with planks and rope.',
      hint: 'Tap the tree until it’s bare. The planks and rope are in the shed by the gate.',
    },
    'q46-s3': {
      goal: 'Build the merchant a cart that can’t tip over.',
      hint: 'You need 4 planks, 2 wheels and a sack of stones. Keep it wide, and keep the heavy stones low. Tuk’s diagram is in your journal.',
    },
  },
  scenes: [
    // ------------------------------------------------ step 1: the racing Nubbin
    scene(
      'q46-crash',
      [
        N('A wooden cart creaks up the main path, piled high with cabbages. A man in a straw hat pushes it very, very carefully.'),
        C('Afternoon! Fine cabbages, crisp cabbages, cabbages for every occasion. Weddings. Birthdays. Snacks.', 'happy'),
        C('I’ve pushed this cart all over the world, and I have a very good feeling about this Grove.'),
        N('Behind you, a Nubbin in full racing stride comes round the bend. It is not looking where it’s going. It never is.'),
        N('Thud. Wobble. A long, slow tip. Cabbages roll in every direction.'),
        C('Ohhh, the cabbages! Somebody catch the cabbages!', 'shock'),
        N('Your Nubbin sits up in the wreck, wearing a cabbage leaf like a hat. It looks very pleased with itself.'),
        C('The wheel’s come off. I had eight cabbages, and three have rolled into the stream!', 'sad'),
        C('The rest are scattered all over the meadow.', 'sad'),
      ],
      [
        ask(
          8,
          'maths',
          'subtract within 20 to solve a word problem',
          [C('Eight cabbages, and three are in the stream. So how many are out in the meadow?', 'think')],
          [
            opt('5', [C('Five! Eight take away three is five. You’re quicker than my cart.', 'happy')], true),
            opt('11', [
              N('Eleven would mean adding. But three cabbages went away into the stream, so we take them away.'),
              N('8 − 3 = 5. Five cabbages in the meadow.'),
            ]),
            opt('3', [
              N('Three is how many are in the stream. Take those three away from eight.'),
              N('8 − 3 = 5. Five cabbages are in the meadow.'),
            ]),
          ],
          'Solved a take-away word problem: 8 cabbages, 3 in the stream, so 5 in the meadow.',
          '1.OA.A.1',
        ),
      ],
      [
        ch('sorry', 'Apologise for your Nubbin', [
          Y('Sorry. My Nubbin is still learning about corners.'),
          C('Corners. Yes. Lots of people are still learning about corners.'),
        ]),
        ch(
          'buy',
          'Offer to buy the dented ones',
          [C('Dented cabbages are still cabbages! That is my whole philosophy.', 'happy')],
          { 'q46-bought-dented': true },
        ),
        ch('track', 'Point out that this is the race track', [
          Y('To be fair, this is the race track.'),
          C('To be fair, I didn’t see a sign.'),
          N('There is a sign. It is very large. He is standing on it.'),
        ]),
      ],
    ),
    scene(
      'q46-crash-done',
      [
        N('You collect the cabbages one by one. The last one has rolled all the way down to the stream bank.'),
        C('Why do they always roll downhill? Not once has a cabbage rolled uphill to find me.', 'think'),
        N('You slot the wheel back onto the axle. The cart stands up straight, and so does the merchant.'),
        C('All eight! Only a little bit muddy.', 'happy'),
        N('Your Nubbin offers him the cabbage-leaf hat. He accepts it with great dignity.'),
        C('You have a gift, friend. A cabbage gift. The rarest kind.', 'happy'),
      ],
      [
        notice(
          1,
          'science',
          'gravity, and balanced and unbalanced forces',
          [
            N('Every cabbage is pulled towards the ground by a force called gravity.'),
            N('On flat ground, the ground pushes back up just as hard. The forces are balanced, so the cabbage stays put.'),
            N('On a slope, the pushes don’t balance any more. Gravity wins, and a round cabbage rolls downhill.'),
          ],
          'Learned that gravity pulls things down, and that unbalanced forces make a cabbage roll down a slope.',
          '3-PS2-1',
        ),
      ],
    ),
    // ------------------------------------------------ step 2: the falling fruit
    scene(
      'q46-fruit',
      [
        N('The merchant parks his cart under the big fruit tree, a long way from the race track.'),
        C('Shade, peace and quiet. Nothing can go wrong in the shade.'),
        N('A breeze stirs the branches. High above the cart, something round and heavy wobbles on its stalk.'),
        C('Is that tree looking at me?', 'think'),
        N('The fruit drops. It is enormous. It lands right on the cart, which folds neatly in half.'),
        C('…I’m not going to wail. I’m saving my best wail for something worse.', 'sad'),
        N('He picks the fruit out of the wreck, sniffs it, and gives it to your Nubbin, who eats it at once.'),
        C('Right. Planks, rope, and someone to shake that tree bare before I park under it again.'),
      ],
      [
        ask(
          7,
          'science',
          'define the real problem before solving it',
          [
            N('Good builders start by asking: what exactly went wrong?'),
            N('Why is shaking the tree bare a clever first step?'),
          ],
          [
            opt('So any loose fruit falls now, and not on the mended cart later.', [
              C('Exactly. The problem isn’t the shade. It’s heavy fruit hanging right over my head.', 'happy'),
            ], true),
            opt('Because the tree is too noisy.', [
              N('The tree is quite quiet, really. The real problem is the heavy fruit hanging above the cart.'),
              N('Shake it all down now, and nothing can fall on the cart later.'),
            ]),
            opt('So your Nubbin gets a snack.', [
              N('A lovely bonus! But the main reason is that heavy fruit was hanging right over the cart.'),
              N('Shake it down now, and nothing else can fall on it later.'),
            ]),
          ],
          'Worked out the real problem (fruit hanging above the cart) before choosing a fix.',
          'K-2-ETS1-1',
        ),
      ],
    ),
    scene(
      'q46-fruit-done',
      [
        C('Good as new. Better than new. New had a squeak.', 'happy'),
        N('He ties the last knot in the rope and gives the cart a proud pat.'),
        C('From now on I park in the middle of the meadow. Nothing falls on you in the middle of a meadow.', 'think'),
        N('Somewhere very high above the meadow, a bird hears this, and thinks about it.'),
        N('Your Nubbins share the fallen fruit and watch him polish a cabbage on his sleeve.'),
        C('Mark my words. My luck has turned.', 'happy'),
      ],
      [
        ask(
          3,
          'literacy',
          'spot foreshadowing and predict what might happen next',
          [
            N('Writers sometimes drop a hint about what might happen later. That hint is called foreshadowing.'),
            N('Why do you think the writer tells us about the bird?'),
          ],
          [
            opt('It’s a hint that something might fall from the sky after all.', [
              N('That’s my guess too. The merchant says nothing can fall on him… and the writer shows us a bird.'),
            ], true),
            opt('No reason. It’s just a bird.', [
              N('Could be! But writers don’t often mention a bird for no reason, just after someone says nothing can fall on them.'),
              N('It’s a hint: the middle of the meadow may not be as safe as he thinks.'),
            ]),
            opt('The bird wants to buy a cabbage.', [
              N('Ha! Maybe. But it’s more likely a hint that the middle of the meadow isn’t as safe as he thinks.'),
            ]),
          ],
          'Noticed foreshadowing: a small detail the writer uses to hint at what might happen next.',
        ),
      ],
    ),
    // ------------------------------------------------ step 3: the glider, and the cart that can’t tip
    scene(
      'q46-glider',
      [
        N('Overhead, a shadow swoops in a wide, happy circle. A boy in orange and yellow is riding the wind on a wooden glider.'),
        P('Hi! Hello! Nice Grove! Is that a vegetable stall? I love vegetables!', 'happy'),
        N('He leans to wave. The glider dips. You can see exactly where this is going, and so can the merchant.'),
        C('No, no, no, no—', 'shock'),
        N('Pemba lands, rolls, and bounces off the cart. The cart does not bounce. It bursts into cabbages.'),
        C('The cabbages! Again! Three times in one afternoon!', 'angry'),
        P('Oh no. That was me, wasn’t it? I’m Pemba. I’m really sorry. Can I help? I’m good at helping.', 'sad'),
        N('A boy with a boomerang on his back jogs up, out of breath, and looks at the mess.'),
        T('Let me guess. You saw a cart and thought, “That looks soft.”'),
        C('What I need is a cart that cannot tip. Not for Nubbins, not for fruit, not for flying boys.', 'think'),
        T('Now that’s a problem I can plan for. I’ve got diagrams. I’ve always got diagrams.', 'happy'),
        C('Thirty-one carts I’ve lost. Every one taught me something. The first taught me wheels. The ninth taught me rope.', 'think'),
        T('Here’s the secret. Things tip over when their weight leans out past the edge of whatever they stand on.'),
        T('We want a stable cart. A steady one. One that hardly leans at all, whatever hits it.'),
      ],
      [
        ask(
          13,
          'science',
          'compare designs: a wide, low base is more stable than a tall, narrow one',
          [T('So, which cart is harder to push over?')],
          [
            opt('A tall, narrow cart with the heavy stones on top', [
              T('Ha! That one falls over if a butterfly sneezes.'),
              T('The weight is high up and the edges are close together, so it leans past them in no time. Wide and low is the steady one.'),
            ]),
            opt('A low, wide cart with the heavy stones at the bottom', [
              T('Exactly. Wide means the edges are far apart.'),
              T('Heavy stones down low mean the weight has a long, long way to lean before it gets past an edge.', 'happy'),
            ], true),
            opt('They’re both just as easy to tip', [
              T('Try it with two piles of books: one tall and thin, one low and wide. Give them each a little push.'),
              T('The tall one topples. The low, wide one just sits there. Wide and low is steadier.'),
            ]),
          ],
          'Compared two designs and explained why a wide, low base with weight at the bottom is harder to tip.',
          '3-5-ETS1-2',
        ),
      ],
      [
        ch('wide', 'Make it wide', [T('Wide. Good. Like a duck sitting down. Ducks never tip over.')], { 'q46-cart': 'wide' }),
        ch(
          'low',
          'Make it low',
          [T('Low wheels, heavy bottom. You can’t knock over something that’s already nearly lying down.')],
          { 'q46-cart': 'low' },
        ),
        ch(
          'bell',
          'Give it a warning bell',
          [
            C('A bell! So they hear me coming!', 'happy'),
            T('Fine. A bell. But it’s also going to be wide and low, because I have standards.'),
          ],
          { 'q46-cart': 'bell' },
        ),
      ],
    ),
    scene(
      'q46-glider-done',
      [
        N('Tuk unrolls his diagram on a flat rock. It has arrows, measurements, and one small drawing of a duck.'),
        T('The cart bed is 2 metres long and 1 metre wide. I want a rope all the way round the edge, so no cabbage falls off.'),
        N('You and your Nubbin drag the sack of stones into place. The cart sinks a little and settles, like a hen on a nest.'),
        N('The new cart sits low and wide, like a sensible duck.'),
        P('Can I test it? I want to test it. Please let me test it.', 'happy'),
        C('Test it? With what?', 'think'),
        P('With me!', 'happy'),
      ],
      [
        ask(
          1,
          'maths',
          'find the perimeter of a rectangle',
          [T('So how much rope do I need to go all the way round? Long side, short side, long side, short side.')],
          [
            opt('6 metres', [T('Yes! 2 + 1 + 2 + 1 = 6. The distance all the way round is called the perimeter.', 'happy')], true),
            opt('3 metres', [
              T('That only gets you along one long side and one short side. The rope has to go all the way round.'),
              T('2 + 1 + 2 + 1 = 6 metres. That’s the perimeter.'),
            ]),
            opt('2 metres', [
              T('That’s only one long side! Add all four sides: 2 + 1 + 2 + 1 = 6 metres.'),
              T('The distance all the way round a shape is its perimeter.'),
            ]),
          ],
          'Found the perimeter of a 2 m by 1 m rectangle by adding all four sides (6 m).',
          '3.MD.D.8',
        ),
        act(
          2,
          'science',
          'keep the heavy part low to make something stable',
          'edu:place:stones:low',
          [
            T('Now the stones. Put them at the very bottom, under the cabbages. Not on top!'),
            N('Drag the sack to the lowest spot on the cart. Then give the cart a nudge, and watch it hardly move.'),
          ],
          'Placed the heaviest load low down and saw that it made the cart harder to tip.',
          '3-PS2-1',
        ),
      ],
    ),
    scene(
      'q46-complete',
      [
        N('Pemba takes a run-up and throws himself at the cart with all his might.'),
        N('He bounces off. The cart doesn’t move. Not one cabbage stirs.'),
        C('It holds! It holds! Oh, it’s beautiful. I could weep. I might weep.', 'happy'),
        P('Doesn’t it make you want to give up? Losing everything, over and over?'),
        C('Every time I lose the lot, somebody stops to help me pick it up. I’ve met half the world that way.', 'soft'),
        T('Everybody laughs at diagrams until the diagrams work.'),
        C('Keep the old cart, friend. Put cabbages in it. It deserves a quiet retirement after the day it’s had.'),
        N('The old cart is yours now, a planter on wheels. Somehow, you’ve also picked up his famous wail of despair.'),
        P('Do the wail! Do it at something small! Like a dropped spoon!', 'happy'),
      ],
      [
        ask(
          4,
          'sel',
          'think about how people bounce back after things go wrong',
          [
            N('The merchant has lost thirty-one carts. And he’s still smiling.'),
            N('Can something good come out of a bad day? What do you think?'),
          ],
          [
            opt('Yes. He made friends, and learned to build better carts.', [
              C('That’s how I see it. Thirty-one carts, thirty-one lessons, and more friends than I can count.', 'happy'),
            ]),
            opt('No. Losing your cabbages is just bad luck.', [
              C('That’s fair. It IS bad luck, and it’s fine to feel cross about it.'),
              C('I just find the cross part passes quicker when someone helps you pick things up.', 'soft'),
            ]),
            opt('Sometimes, but not always.', [
              C('A wise answer. Some bad days are just bad. Others turn into stories you tell for years.', 'think'),
            ]),
          ],
          'Thought about setbacks: how help from others and learning from mistakes can make a bad day better.',
          'CASEL: Self-management',
        ),
      ],
    ),
  ],
  glossary: [
    gloss('scattered', 'Spread about all over the place.', 'q46-crash'),
    gloss('philosophy', 'A big idea about how to live, or how to think about things.', 'q46-crash'),
    gloss('axle', 'The rod through the middle of a wheel that lets it turn.', 'q46-crash-done'),
    gloss('gravity', 'The pull that draws things down towards the ground.', 'q46-crash-done'),
    gloss('foreshadowing', 'A hint in a story about something that might happen later.', 'q46-fruit-done'),
    gloss('diagram', 'A drawing that shows how something is built or how it works.', 'q46-glider'),
    gloss('stable', 'Steady, and hard to knock over.', 'q46-glider'),
    gloss('perimeter', 'The distance all the way round the edge of a shape.', 'q46-glider-done'),
    gloss('retirement', 'The time when someone stops working, after a long time at a job.', 'q46-complete'),
    gloss('despair', 'The feeling that everything has gone wrong and there’s no hope left.', 'q46-complete'),
  ],
  notes:
    'Lessons: 8 − 3, gravity and unbalanced forces, defining the problem, foreshadowing, comparing a tall and a wide cart, ' +
    'perimeter of the cart bed, putting the weight low (do), and a think question on bouncing back. ' +
    'The merchant’s famous wail is replaced with original lines; the emote is the Learning Grove “Not the cabbages!” version.',
};

// ================================================================== Q47 The Crystal Tunnel
const Q47: EduQuest = {
  id: 'reader:q47',
  of: 'q47',
  band: 'reader',
  title: 'The Crystal Tunnel',
  goals: {
    'q47-s1': {
      goal: 'Follow the singing nomads into the tunnel under the ridge.',
      hint: 'The tunnel mouth is behind the waterfall at the foot of the ridge. Bring at least one Nubbin.',
    },
    'q47-s2': {
      goal: 'Find the way out of the crystal maze. Keep a Nubbin right beside you so the crystals stay lit.',
      hint: 'If your Nubbin wanders more than a step away, the light goes out. Stop, and call it back. There’s no hurry.',
    },
  },
  scenes: [
    // ------------------------------------------------ step 1: the nomads
    scene(
      'q47-nomads',
      [
        N('A painted wagon rolls up to the foot of the ridge, jingling with bells. Three nomads lounge on top. One is tuning a lute.'),
        J('Greetings, travellers! I’m Juno. We go where the wind goes. Today the wind is going under that hill.', 'happy'),
        T('There’s a perfectly good path over the hill.'),
        J('Over is for people in a hurry. Under is for people with stories. Also, the path has a goat on it. A mean one.'),
        K('Is the tunnel safe?'),
        J('Safe as a song, friend. Here, I’ll sing you the one about it.', 'soft'),
        J('♪ Under the hill, under the hill,'),
        J('♪ The rocks are cold and the bats keep still.'),
        J('♪ Bring a snack and bring a mate,'),
        J('♪ Don’t let go or you’ll be late—'),
        J('♪ Doo-be-doo, the moss is blue, under the hill with you!', 'happy'),
        T('That song has no useful information in it.'),
        N('Pemba is already humming it. So is your Nubbin. You suspect you’ll be humming it for a week.'),
      ],
      [
        ask(
          11,
          'literacy',
          'hear rhyming words at the ends of lines',
          [
            N('Songs often rhyme at the ends of lines. That’s part of what makes them so catchy.'),
            N('Which word in Juno’s song rhymes with “hill”?'),
          ],
          [
            opt('still', [J('Hill and still! Mate and late! Doo and blue and you! I’m a poet.', 'happy')], true),
            opt('cold', [
              N('Say them out loud: hill, cold. The endings sound different.'),
              N('Hill… still! Those two end with the same sound, so they rhyme.'),
            ]),
            opt('bats', [
              N('Say them out loud: hill, bats. Different endings.'),
              N('Hill… still! Those end with the same “-ill” sound, so they rhyme.'),
            ]),
          ],
          'Found rhyming word pairs in a song (hill/still, mate/late).',
          'RL.2.4',
        ),
        act(
          12,
          'music',
          'clap a steady beat',
          'edu:clap:beat:under-the-hill',
          [
            J('Clap along with me! Clap on the strong beats: UN-der the HILL, UN-der the HILL.'),
            N('Clap, clap. Clap, clap. Your Nubbin claps too, a little bit late, every time.'),
          ],
          'Clapped the steady beat of a song.',
        ),
      ],
      [
        ch('sing', 'Join in on the doo-be-doo', [J('A natural! The moss approves.', 'happy')], { 'q47-sang': true }),
        ch('long', 'Ask how long the tunnel is', [
          J('Long enough to have a good time. Short enough to come out the other side. Probably.'),
          T('“Probably” is my least favourite word.'),
        ]),
        ch('goat', 'Ask about the goat', [J('He bit my lute once. We don’t talk about it.', 'sad')]),
      ],
    ),
    scene(
      'q47-nomads-done',
      [
        N('The tunnel swallows the last of the daylight. Tuk’s torch flickers, sputters, and goes out.'),
        T('Of course. Of course it does.', 'angry'),
        N('It is completely dark. You hold your hand up in front of your face. You can’t see it at all.'),
        P('My eyes are open! I checked! Twice!', 'shock'),
        J('Ah. This is the part of the song we haven’t written yet.'),
        K('Nobody move. Let’s think.'),
      ],
      [
        notice(
          3,
          'science',
          'we can only see things when light reaches our eyes',
          [
            K('We only see something when light bounces off it and into our eyes.'),
            K('Down here there’s no light at all. Nothing can bounce into our eyes, so we see nothing, even with our eyes wide open.'),
          ],
          'Learned that we see objects only when light from them reaches our eyes, so in total darkness we see nothing.',
          '1-PS4-2',
        ),
      ],
    ),
    // ------------------------------------------------ step 2: the crystals
    scene(
      'q47-crystals',
      [
        N('It is very dark. Somewhere ahead, water drips, and something with lots of wings flaps away.'),
        K('Everyone stay close. Pemba, stop humming.'),
        P('I’m not humming. That’s Tuk.'),
        T('It’s a stress hum. It’s different.'),
        N('Your Nubbin presses against your leg. Where it touches you, the wall beside you starts to glow soft green.'),
        N('You step apart. The glow fades. You step together. It comes back, brighter.'),
        K('The crystals! They only light up when two friends are close together.', 'shock'),
        J('So that’s why we always come down here in pairs. I thought it was for the snacks.', 'happy'),
        T('So the plan is “stay together and walk”. That’s… a good plan. I’m annoyed I didn’t think of it.', 'think'),
        T('Also. For the record. I hum when I’m scared. Of the dark. There. Now everybody knows.'),
        J('Brave thing, saying that in the dark. Nobody can even see you blush.', 'soft'),
      ],
      [
        notice(
          0,
          'science',
          'how bats find their way in the dark',
          [
            J('Those wings were bats. They don’t need light to fly about in here.'),
            N('Many bats make tiny, very high squeaks and listen for the echoes bouncing back off the walls.'),
            N('The echoes tell them where things are. This is called echolocation.'),
          ],
          'Learned that many bats find their way in the dark by echolocation: squeaking and listening for echoes.',
          '4-LS1-2',
        ),
        ask(
          10,
          'sel',
          'think about whether saying “I’m scared” is brave',
          [
            N('Tuk told everyone he’s scared of the dark. Juno called that brave.'),
            N('Is it brave to say “I’m scared”? What do you think?'),
          ],
          [
            opt('Yes. It’s hard to tell people how you really feel.', [
              J('I think so too. And now his friends know to stay close. That helps.', 'soft'),
            ]),
            opt('No. Being brave means not being scared.', [
              J('Lots of people think that. Here’s another way to see it: brave is doing something even though you’re scared.'),
              J('Tuk is scared, and he’s still walking. I’d say that counts.'),
            ]),
            opt('Everyone’s scared of something. It’s just normal.', [
              J('True! Nearly everyone is. Maybe that’s why saying it out loud helps: someone usually says “me too”.', 'soft'),
            ]),
          ],
          'Thought about fear and courage: whether naming a fear out loud is a brave thing to do.',
          'CASEL: Self-awareness',
        ),
      ],
      [
        ch('carry', 'Pick your Nubbin up and carry it', [N('Your Nubbin settles into your arms. The whole wall lights up like a lantern.')]),
        ch('paw', 'Hold its paw and walk side by side', [N('Your Nubbin grips your finger tightly. The crystals glow a steady green.')]),
        ch(
          'tuk',
          'Make Tuk hold Pemba’s hand',
          [T('Fine. Fine! But nobody tells anyone about this.'), P('I’m going to tell everyone.', 'happy')],
          { 'q47-tuk-pemba': true },
        ),
      ],
    ),
    scene(
      'q47-crystals-done',
      [
        N('Step by step, side by side, you follow the green glow through the maze.'),
        N('At last, a crack of daylight. You squeeze through into warm air, blinking. Your Nubbin doesn’t let go.'),
        J('See? Out the other side. I said probably.', 'happy'),
        T('How long were we down there? It felt like a week.'),
        K('We went in at six o’clock, when the sun was setting.'),
        P('And the bell down in the valley just rang half past seven!'),
        T('An hour and a half. In the dark. Humming. I need a nap.'),
      ],
      [
        ask(
          5,
          'maths',
          'work out a time interval',
          [K('In at 6:00. Out at 7:30. How long were we underground?')],
          [
            opt('1 hour and 30 minutes', [K('Yes. Six to seven is one hour, and seven to half past seven is thirty minutes more.', 'happy')], true),
            opt('7 hours and 30 minutes', [
              K('7:30 is the time now, not how long we were in there.'),
              K('From 6:00 to 7:00 is one hour, then 30 minutes more to 7:30. An hour and a half.'),
            ]),
            opt('30 minutes', [
              K('It felt longer than that, and it was! From 6:00 to 7:00 is a whole hour.'),
              K('Then 30 more minutes to 7:30. One hour and 30 minutes.'),
            ]),
          ],
          'Worked out a time interval: from 6:00 to 7:30 is 1 hour 30 minutes.',
          '3.MD.A.1',
        ),
      ],
    ),
    scene(
      'q47-complete',
      [
        N('The nomads wave goodbye from the far side of the ridge, singing their song again, slightly wrong.'),
        K('Take some of these. They broke off on the way out.', 'soft'),
        N('She hands you a pouch of crystal shards. They glow faintly whenever two friends sit near them.'),
        T('And now your Grove has a secret cave path. You can thank me for not getting us lost.'),
        P('You were humming the whole time.'),
        T('Strategically.'),
        J('Remember, friends: the dark is only scary when you’re alone in it. Doo-be-doo!', 'happy'),
      ],
      [
        ask(
          6,
          'literacy',
          'find the theme of a story',
          [
            N('A story’s theme is its big idea: the thing it teaches all the way through.'),
            N('What do you think the theme of this adventure is?'),
          ],
          [
            opt('Hard things are easier with a friend beside you.', [
              N('Yes. The crystals only glowed for friends, Tuk was braver with company, and nobody got lost alone.'),
            ], true),
            opt('Always bring a spare torch.', [
              N('Very good advice! But a theme is bigger: it shows up all through the story.'),
              N('The crystals, Tuk’s fear, the hand-holding: they all say hard things are easier with a friend.'),
            ]),
            opt('Goats are mean.', [
              J('One goat is mean. Most goats are lovely.', 'sad'),
              N('The big idea all through the story is that hard things are easier with a friend beside you.'),
            ]),
          ],
          'Identified the theme of a story: hard things are easier together.',
          'RL.4.2',
        ),
      ],
    ),
  ],
  glossary: [
    gloss('nomad', 'Someone who moves from place to place and has no one fixed home.', 'q47-nomads'),
    gloss('lute', 'An old stringed instrument, a bit like a guitar with a rounded back.', 'q47-nomads'),
    gloss('sputters', 'Makes small spitting, popping sounds, like a flame about to go out.', 'q47-nomads-done'),
    gloss('echolocation', 'Finding your way by making sounds and listening for the echoes.', 'q47-crystals'),
    gloss('strategically', 'Done on purpose, as part of a clever plan.', 'q47-complete'),
    gloss('theme', 'The big idea a story teaches all the way through.', 'q47-complete'),
  ],
  notes:
    'Lessons: rhyme pairs in the nomads’ (original) song, clapping the beat (do), light and seeing, bats and echolocation, ' +
    'a think question on naming a fear, 6:00 to 7:30, and the theme of the story. The glowing crystals are game magic; ' +
    'no lesson treats them as real science.',
};

// ================================================================== Q48 The Great Divide
const Q48: EduQuest = {
  id: 'reader:q48',
  of: 'q48',
  band: 'reader',
  title: 'The Great Divide',
  goals: {
    'q48-s1': {
      goal: 'Lead both clans down the canyon path without a fight breaking out.',
      hint: 'Walk between the two groups. When tempers rise, stop for a rest and a drink of water.',
    },
    'q48-s2': {
      goal: 'Keep a straight face while Pemba finishes his story about the clans’ ancestors.',
      hint: 'Tap only when the laugh meter is in the green. Looking at your Nubbin makes it worse.',
    },
  },
  scenes: [
    // ------------------------------------------------ step 1: down the canyon
    scene(
      'q48-canyon',
      [
        N('Two groups of travellers stand at the top of the canyon, glaring at each other across a pile of luggage.'),
        MA('The Hollins will go first. We are clean, orderly, and we fold our socks.'),
        BR('The Drays will go first. We are honest, hardy, and we don’t own socks.', 'angry'),
        MA('That is not the boast you think it is.'),
        T('The canyon guide quit this morning. Something about a sprained everything. So, who wants to guide?'),
        P('Me! How hard can it be? It’s just walking downhill with people who don’t like each other.', 'happy'),
        K('Pemba, please don’t say that part out loud.'),
        BR('Fine. But no Hollin food in the canyon. They cook with too much… tidiness.'),
        MA('And no Dray food. It smells of grudges.'),
      ],
      [
        ask(
          8,
          'social-studies',
          'choose a fair way to settle a disagreement',
          [K('They both want to go first. What would be a fair way to decide?')],
          [
            opt('Toss a coin. Each clan has the same chance.', [
              K('Yes. A coin doesn’t take sides. That’s what makes it fair.', 'happy'),
            ], true),
            opt('Let the loudest clan go first.', [
              K('Then everyone just shouts louder! Being loud doesn’t make you right.'),
              K('A coin toss is fairer: both clans get exactly the same chance.'),
            ]),
            opt('Let the clan with socks go first.', [
              T('Ha! The Drays would never agree to that. It’s a rule that only helps one side.'),
              K('A fair way gives both sides the same chance, like tossing a coin.'),
            ]),
          ],
          'Chose a fair way to decide between two groups (a coin toss gives each the same chance).',
          'D2.Civ.8.K-2',
        ),
      ],
      [
        ch('hollins', 'Let the Hollins go first', [BR('Typical.'), N('The Drays follow, loudly, two steps behind.')], {
          'q48-first': 'hollins',
        }),
        ch('drays', 'Let the Drays go first', [MA('Of course.'), N('The Hollins follow, sniffing, two steps behind.')], {
          'q48-first': 'drays',
        }),
        ch(
          'together',
          'Make them walk side by side',
          [
            MA('Absolutely not.'),
            BR('Absolutely not.'),
            N('They walk side by side anyway, because the path is narrow. Neither speaks.'),
          ],
          { 'q48-first': 'together' },
        ),
      ],
    ),
    scene(
      'q48-canyon-done',
      [
        N('The path winds down and down. The canyon walls rise higher than any tree, striped red, orange and cream.'),
        N('Far below, a thin silver river winds along the bottom.'),
        N('You reach the canyon floor at dusk. Nobody has pushed anybody off anything. It feels like a miracle.'),
        T('Day one. Zero shoves. I’m putting that on a sign.'),
        MA('The Hollins will camp on the left.'),
        BR('Then the Drays will camp on the left of the left.', 'angry'),
        K('That’s… the same place. You’re all camping in the same place.'),
      ],
      [
        ask(
          1,
          'science',
          'rivers carve canyons by erosion over a very long time',
          [P('How did such a giant crack get here? Did a giant drop an axe?')],
          [
            opt('The river carved it, a tiny bit at a time, over a very long time.', [
              K('Yes. Running water carries away sand and little stones. Year after year, the river cuts a bit deeper.'),
              K('That wearing away is called erosion. A canyon this big can take millions of years.'),
            ], true),
            opt('An earthquake split it open in one night.', [
              K('Earthquakes can crack the ground. But a canyon this deep was carved slowly, by that river.'),
              K('Water wears the rock away, grain by grain, over millions of years. That’s called erosion.'),
            ]),
            opt('A giant dropped an axe.', [
              T('I checked. No axe.'),
              K('It was the river. Water wears rock away, grain by grain, over millions of years. That’s called erosion.'),
            ]),
          ],
          'Learned that rivers carve canyons slowly by erosion, carrying away rock over a very long time.',
          '4-ESS2-1',
        ),
      ],
    ),
    // ------------------------------------------------ step 2: Pemba’s story
    scene(
      'q48-story',
      [
        N('Around the campfire, a Hollin child and a Dray child both reach for the last dumpling.'),
        N('Within seconds it’s a food fight. Rice flies. Somebody throws a sandal. Your Nubbin catches it, thrilled.'),
        MA('Your ancestor stole our ancestor’s ball! Two hundred years ago! It was a very good ball!', 'angry'),
        BR('Your ancestor kicked it into the river first!', 'angry'),
        P('WAIT. I… knew them. Your ancestors. Personally. Sort of. Through, um, spirit ways.'),
        T('He did not know them.', 'think'),
        P('They weren’t enemies. They were twins! The ball wasn’t stolen. It was a game. Whoever caught it chose dinner.'),
        P('And when one fell in the river, the other jumped in after. They laughed so hard the canyon cracked open.', 'happy'),
        N('Every face in the firelight turns to you, the only other witness. Pemba gives you a desperate look.'),
      ],
      [
        ask(
          7,
          'literacy',
          'work out why a character does something',
          [N('Pemba is making this story up as he goes. Why do you think he’s doing it?')],
          [
            opt('To stop the fight and help the clans be friends.', [
              N('Yes. Pemba hates fighting. His motive, the reason he does it, is to bring the clans together.'),
            ], true),
            opt('Because he wants to be famous.', [
              N('Hmm. He doesn’t ask for any thanks. Look at when he starts: right as the food fight gets going.'),
              N('His reason is to stop the fight and make peace.'),
            ]),
            opt('Because he really did know them.', [
              T('Look at the clues. “Sort of.” “Um.” Nobody says “um” about something true.'),
              N('He’s inventing it, to stop the fight and make peace.'),
            ]),
          ],
          'Worked out a character’s motive from clues in what he says and when he says it.',
          'RL.3.3',
        ),
      ],
      [
        ch(
          'detail',
          'Add a detail: “They both sang terribly.”',
          [BR('The Drays sing terribly!', 'shock'), MA('So do the Hollins!', 'shock')],
          { 'q48-story': 'detail' },
        ),
        ch(
          'nod',
          'Nod slowly and solemnly',
          [N('You nod like someone who has seen the truth. It is the hardest thing you have ever done.')],
          { 'q48-story': 'nod' },
        ),
        ch(
          'cough',
          'Cover a laugh with a cough',
          [N('You cough. Pemba coughs louder, to cover your cough. Somehow, it works.')],
          { 'q48-story': 'cough' },
        ),
      ],
    ),
    scene(
      'q48-story-done',
      [
        MA('Twins. All this time.', 'soft'),
        BR('Pass the dumplings, cousin.', 'soft'),
        N('Across the fire, a Hollin and a Dray share a blanket. Two children split the last dumpling, half each.'),
        K('(whispering) Pemba, this is wrong. It isn’t true. They deserve to know it isn’t true.'),
        P('(whispering) But look at them. They’re sharing a blanket.'),
        K('(whispering) A peace built on a fib can fall down.'),
        P('(whispering) Or it can be the start of a real one.', 'think'),
      ],
      [
        ask(
          6,
          'sel',
          'weigh honesty against kindness',
          [
            N('Nalu and Pemba both have a point.'),
            N('Is a kind made-up story ever okay? What do you think?'),
          ],
          [
            opt('No. People deserve the truth, even when it’s hard.', [
              K('That’s what I think. If they find out later, they might stop trusting all of us.'),
            ]),
            opt('Yes, if it stops people fighting.', [
              P('That’s what I was hoping! Though I know if they find out, it could make things worse.', 'think'),
            ]),
            opt('It’s okay for now, but they should be told one day.', [
              N('That’s a thoughtful middle path. Some grown-ups would agree with you, and some would argue.'),
              N('That’s what makes it a hard question.'),
            ]),
          ],
          'Thought about honesty and kindness, and whether a kind invention is ever fair.',
          'CASEL: Responsible decision-making',
        ),
      ],
      [
        ch(
          'q48-tell',
          'Tell the clans the story was made up',
          [
            MA('Of course it was made up, guide. Twins don’t argue about socks for two hundred years.'),
            BR('But it’s a better story than the one we had. We’re keeping it.', 'soft'),
            K('…Oh. I didn’t think of that.', 'think'),
          ],
          { 'q48-truth': 'told' },
        ),
        ch(
          'q48-keep',
          'Keep Pemba’s secret',
          [
            K('Fine. But if it falls apart, it falls on you, Pemba.'),
            P('Then I’ll be the one who tells them. Promise. Just not during dumplings.', 'soft'),
          ],
          { 'q48-truth': 'kept' },
        ),
      ],
    ),
    scene(
      'q48-complete',
      [
        N('In the morning the two clans climb out of the canyon together, arguing happily about which twin was taller.'),
        T('Did you make all of that up?'),
        P('Every single word.', 'happy'),
        K('Pemba!'),
        P('What? They’re sharing socks now. Look.'),
        N('Chief Brack is, in fact, wearing socks. He seems confused, but open to it.'),
        MA('Take this, guide. And we’ll build a bridge, so nobody ever has to argue down there again.'),
        N('She presses a wide-brimmed canyon guide’s hat into your hands. By evening, a rope bridge spans the gap.'),
        T('Look at the canyon wall from up here. All those stripes. It’s like a giant cake.'),
      ],
      [
        ask(
          6,
          'maths',
          'multiply as equal groups',
          [
            BR('The bridge needs three long ropes, and each rope is 20 metres long.'),
            BR('How many metres of rope is that altogether?'),
          ],
          [
            opt('60 metres', [BR('Three ropes of 20: 20, 40, 60. Sixty metres, guide!', 'happy')], true),
            opt('23 metres', [
              N('That adds 3 and 20. But we need three ropes that are each 20 metres long.'),
              N('20 + 20 + 20 = 60. Three groups of 20 is 60 metres.'),
            ]),
            opt('40 metres', [
              N('That’s only two ropes. Add the third: 20 + 20 + 20 = 60 metres.'),
            ]),
          ],
          'Worked out three equal groups of 20 (60 metres of rope).',
          '3.OA.A.1',
        ),
        notice(
          8,
          'science',
          'rock layers: the lowest are the oldest',
          [
            K('Each stripe is a layer of rock. The layers were laid down one on top of another, over a very long time.'),
            K('So the layers at the bottom are the oldest, and the ones at the top are the youngest.'),
            T('So it IS like a cake. You always put the bottom layer in first.', 'happy'),
          ],
          'Learned that rock layers form one on top of another, so the lowest layers are usually the oldest.',
          '4-ESS1-1',
        ),
      ],
    ),
  ],
  glossary: [
    gloss('orderly', 'Neat and tidy, with everything in its proper place.', 'q48-canyon'),
    gloss('grudge', 'A cross feeling you keep about something someone did a long time ago.', 'q48-canyon'),
    gloss('canyon', 'A deep valley with steep sides, usually carved by a river.', 'q48-canyon-done'),
    gloss('erosion', 'When water, wind or ice slowly wears rock and soil away and carries it off.', 'q48-canyon-done'),
    gloss('ancestor', 'A member of your family who lived long, long ago, before your grandparents.', 'q48-story'),
    gloss('motive', 'The reason why someone does something.', 'q48-story'),
    gloss('spans', 'Stretches all the way across, from one side to the other.', 'q48-complete'),
  ],
  notes:
    'Lessons: a fair way to choose who goes first, erosion by rivers (4-ESS2-1), Pemba’s motive, a think question on ' +
    'kind inventions versus the truth (the quest’s real question), 3 × 20 metres of rope, and rock layers.',
};

// ================================================================== Q49 The Secret Dance
const Q49: EduQuest = {
  id: 'reader:q49',
  of: 'q49',
  band: 'reader',
  title: 'The Secret Dance',
  goals: {
    'q49-s1': {
      goal: 'Hand out five secret party invitations without the headmaster noticing.',
      hint: 'Wait until his back is turned at the board. Children by the window are easiest to reach.',
    },
    'q49-s2': {
      goal: 'Keep the party going: hit the beats in time to get everyone dancing.',
      hint: 'Tap when the drum ring closes. If you miss a beat, shy dancers drift back to the wall, but they’ll come back. Nothing is lost.',
    },
  },
  scenes: [
    // ------------------------------------------------ step 1: the school
    scene(
      'q49-school',
      [
        N('The schoolhouse bell rings. Rows of children sit very straight, hands folded, faces blank.'),
        Z('I went here. For a term. Before… you know. Everything.'),
        Z('The rules haven’t changed. No running. No humming. No unauthorised enthusiasm.', 'think'),
        N('A boy slips into the back row in a red headband pulled low over a blue arrow tattoo. It is not a good disguise.'),
        P('Hi! I’m new! I’m, er, Kuzo! From… the big town! Where the things are!', 'happy'),
        H('New boy. In this school we do not dance, we do not sing, and we do not say “hi”.', 'angry'),
        P('Not even a little dance? With your shoulders?'),
        H('Especially not with your shoulders.'),
        R('(whispering) What’s a dance?', 'soft'),
        P('Oh, that’s it. We’re throwing a party.', 'shock'),
      ],
      [
        ask(
          2,
          'literacy',
          'use a prefix to work out a long word',
          [
            N('“Unauthorised” is a long word. Break it up. “Un-” at the start means “not”. “Authorised” means allowed.'),
            N('So what is “unauthorised enthusiasm”?'),
          ],
          [
            opt('Getting excited when it isn’t allowed', [Z('Exactly. In this school, being excited without permission is against the rules.', 'think')], true),
            opt('A kind of school dinner', [
              N('Good guess for a strange word! But “un-” means not, and “authorised” means allowed.'),
              N('So it’s excitement that is not allowed.'),
            ]),
            opt('Being very sleepy', [
              N('Sleepy is the opposite! Enthusiasm means being excited and eager.'),
              N('And “unauthorised” means not allowed. So: excitement that isn’t allowed.'),
            ]),
          ],
          'Used the prefix “un-” (not) to work out the meaning of “unauthorised”.',
          'L.3.4',
        ),
      ],
      [
        ch('lunch', 'Hide invitations in lunch boxes', [Z('Sneaky. I approve. I think. Is approving allowed?')], {
          'q49-invite': 'lunch',
        }),
        ch(
          'birds',
          'Fold them into paper birds',
          [N('The paper birds sail over the headmaster’s head. He swats at one and misses.')],
          { 'q49-invite': 'birds' },
        ),
        ch(
          'kaito',
          'Let Kaito deliver them',
          [Z('Hi. You. Party. Cave. Tonight. Don’t… tell. Okay. Bye.'), N('Somehow, everyone still says yes.')],
          { 'q49-invite': 'kaito' },
        ),
      ],
    ),
    scene(
      'q49-school-done',
      [
        N('By lunchtime, all five invitations have found their way into the right hands.'),
        R('A cave? At night? Is that allowed?', 'happy'),
        P('Nope!', 'happy'),
        R('Then I’m coming. And I’m telling my whole row.'),
        N('Rin’s row tells the next row. That row tells the next. By home time, the whole class knows.'),
        Z('There are four rows of six desks in that classroom. That’s a lot of people for one cave.', 'think'),
        P('The more the merrier!', 'happy'),
      ],
      [
        ask(
          5,
          'maths',
          'multiply equal rows',
          [Z('Four rows, six children in each row. How many children are coming?')],
          [
            opt('24', [Z('Twenty-four. Six, twelve, eighteen, twenty-four. We’re going to need more buckets.', 'think')], true),
            opt('10', [
              N('That adds 4 and 6. But there are four whole rows, with six children in every row.'),
              N('6 + 6 + 6 + 6 = 24. Four sixes make 24.'),
            ]),
            opt('46', [
              N('That just puts the 4 and the 6 side by side! Count the rows of six instead: 6, 12, 18, 24.'),
              N('4 × 6 = 24 children.'),
            ]),
          ],
          'Used equal rows to multiply: 4 rows of 6 is 24.',
          '3.OA.A.1',
        ),
      ],
    ),
    // ------------------------------------------------ step 2: the party
    scene(
      'q49-party',
      [
        N('The cave behind the waterfall is full of nervous children standing flat against the walls.'),
        N('Your Nubbins have brought drums. Well, buckets. They are hitting the buckets.'),
        P('Okay! Dancing is easy. You feel the beat and let your body tell you what to do.'),
        R('My body is telling me to leave.', 'shock'),
        Z('Mine too. Pemba, I don’t dance. I don’t think my body can.'),
        P('Everybody can dance! It’s just moving on purpose. Watch the Nubbins.', 'happy'),
        N('Your Nubbins wiggle, stomp and spin in time with the buckets. One by one, the children start copying them.'),
        Z('…Is this right? Am I doing it? My arms feel like someone else’s.', 'think'),
      ],
      [
        notice(
          1,
          'science',
          'sounds are made by vibrations',
          [
            P('Hear that? When a stick hits a bucket, the bucket shakes back and forth, very fast. That shaking is a vibration.'),
            P('The vibration shakes the air, and the air carries the sound all the way to your ears. Boom!'),
          ],
          'Learned that a drum (or bucket) makes sound by vibrating, and the air carries the sound to our ears.',
          '1-PS4-1',
        ),
        act(
          6,
          'music',
          'find and keep a steady beat',
          'edu:clap:beat:4-count',
          [
            P('Every song has a steady beat, like a heartbeat. Let’s find it. Clap along: one, two, three, four!'),
            N('Clap with the buckets. One, two, three, four. One, two, three, four.'),
          ],
          'Found the steady beat of the music and clapped in time, counting in fours.',
        ),
      ],
    ),
    scene(
      'q49-party-done',
      [
        N('The cave is roaring. Kaito is doing something that is very nearly dancing. Then—'),
        N('The headmaster bursts in with a lantern.'),
        H('WHAT is going ON in here?', 'angry'),
        N('The buckets stop. Every child freezes mid-wiggle. Kaito, very slowly, lowers his arms.'),
        R('(whispering) Are we in trouble?', 'sad'),
        Z('(whispering) Maybe. But I think this rule is a bad one.', 'think'),
      ],
      [
        ask(
          5,
          'social-studies',
          'think about what makes a rule fair and good',
          [
            N('The school has a rule: no dancing. Kaito thinks it’s a bad rule.'),
            N('What do you think makes a rule a good one?'),
          ],
          [
            opt('A good rule keeps people safe.', [
              Z('Safety is a good reason. Like “no running by the pond”. But dancing in a cave? Hmm.', 'think'),
            ]),
            opt('A good rule is fair to everyone it’s for.', [
              Z('I like that. A rule should be fair to the people who have to follow it.', 'soft'),
            ]),
            opt('Rules are rules. You always follow them.', [
              Z('That’s how I used to think. Lots of rules really should be followed.'),
              Z('But some rules can change, if you ask politely and explain why.'),
            ]),
          ],
          'Thought about what makes a rule fair and good, and how rules can be changed.',
          'D2.Civ.8.K-2',
        ),
      ],
      [
        ch(
          'q49-cover',
          'Get everyone dancing in front of Pemba',
          [N('Every child dances at once, a wall of whirling arms, and Pemba slips out the back.')],
          { 'q49-escape': 'cover' },
        ),
        ch(
          'q49-kaito-speaks',
          'Let Kaito speak',
          [
            Z('Sir. I sat in your front row for a whole term. I followed every rule. I was miserable.'),
            Z('Rules are fine. I like some rules. But they should be for us. Not instead of us.', 'soft'),
            H('…Ten minutes. Then everybody goes home.'),
            N('He stays for twelve. Nobody sees his foot tapping, except you. Pemba slips out the back anyway, out of habit.'),
          ],
          { 'q49-escape': 'kaito' },
        ),
        ch(
          'q49-ask-head',
          'Ask the headmaster to dance',
          [
            H('I most certainly will not.', 'angry'),
            N('His shoulders, very slightly, do. In the confusion, Pemba slips out the back.'),
          ],
          { 'q49-escape': 'invite' },
        ),
      ],
    ),
    scene(
      'q49-complete',
      [
        N('Outside, under the stars, the children spill out laughing. Nobody is in trouble. Nobody has ever had this much fun.'),
        R('We danced! Kuzo, we actually danced!', 'happy'),
        P('You were amazing. All of you.', 'happy'),
        P('Best dancers in the whole wide world! Shoulders of pure sunshine!', 'happy'),
        Z('I don’t know what that means, and I’m not going to ask.', 'think'),
        R('My heart is still going boom, boom, boom. And I’m all puffed out.', 'happy'),
        N('Pemba pulls off the red headband and ties it round your wrist. Your Nubbins are still wiggling.'),
      ],
      [
        ask(
          4,
          'sel',
          'notice how feelings change after trying something new',
          [
            N('At first Kaito said his arms felt like someone else’s. Look at him now: still swaying a little.'),
            N('How do you think Kaito feels now?'),
          ],
          [
            opt('Proud and happy that he tried something new.', [
              Z('…Yes. Don’t tell anyone. Fine, tell everyone.', 'soft'),
            ], true),
            opt('Still embarrassed.', [
              N('Maybe a little! New things often feel awkward at first.'),
              N('But he’s still swaying. Underneath, he’s proud he tried.'),
            ]),
            opt('Cross with Pemba.', [
              N('He does grumble a lot. But a cross person doesn’t keep dancing after the music stops.'),
              N('Kaito feels proud and happy that he tried.'),
            ]),
          ],
          'Noticed how feeling awkward about something new can turn into pride after trying it.',
          'CASEL: Self-awareness',
        ),
        notice(
          5,
          'health',
          'exercise makes your heart work harder and keeps it strong',
          [
            N('Dancing is exercise. It makes your heart beat faster, pumping more blood and oxygen to your busy muscles.'),
            N('Moving lots every day helps keep your heart and body strong. Health experts say children should be active for at least an hour a day.'),
          ],
          'Learned that exercise like dancing makes the heart beat faster, and that children need about an hour of activity a day.',
        ),
      ],
    ),
  ],
  glossary: [
    gloss('unauthorised', 'Not allowed; done without permission.', 'q49-school'),
    gloss('enthusiasm', 'Being really excited and eager about something.', 'q49-school'),
    gloss('vibration', 'A very fast shaking, back and forth. Vibrations make sound.', 'q49-party'),
    gloss('miserable', 'Very unhappy.', 'q49-party-done'),
    gloss('oxygen', 'A gas in the air that people and animals need to breathe to stay alive.', 'q49-complete'),
  ],
  notes:
    'Lessons: the prefix “un-”, 4 rows of 6, sound and vibration, clapping a steady beat (do), a think question on what ' +
    'makes a rule good, Kaito’s feelings, and exercise and the heart. Pemba’s cheer at the end is original; the emote ' +
    'should be labelled “Shoulder dance” in the Learning Grove.',
};

// ================================================================== Q50 Uncle Tenzo’s Tea Stall
const Q50: EduQuest = {
  id: 'reader:q50',
  of: 'q50',
  band: 'reader',
  title: 'Uncle Tenzo’s Tea Stall',
  goals: {
    'q50-s1': {
      goal: 'Brew three perfect cups of tea for Uncle Tenzo’s opening morning.',
      hint: 'Lift the kettle when the steam curls, not when it roars. Take the leaves out when the timer says, as the colour turns gold.',
    },
    'q50-s2': {
      goal: 'Serve Old Mr Pell a cup of tea and keep him in his seat until he’s finished.',
      hint: 'Watch his face. A grumble means the tea is too hot; a sigh means it’s just right.',
    },
  },
  scenes: [
    // ------------------------------------------------ step 1: opening morning
    scene(
      'q50-open',
      [
        N('A little wooden stall has appeared by the pond overnight, with a hand-painted sign and a kettle already singing.'),
        I('Ah, the Keeper! Welcome to my tea stall. I have retired from being a general. Now I only command leaves.', 'happy'),
        I('This is my nephew, Kaito. He helps. He also complains.'),
        Z('He’s been up since four. He painted the sign twice. The dragon looked “too fierce”.'),
        I('A tea shop should not frighten its customers. That is the job of the prices.'),
        I('Good tea is simple. The water must be hot, but not angry. The leaves must steep, but not sulk.', 'soft'),
        Z('That makes no sense.'),
        I('It will, nephew. After the third cup, everything does.'),
        N('Your Nubbin climbs onto a stool and sniffs the tea tins one by one, sneezing at the ginger.'),
        I('Jasmine likes three minutes in the pot. No more, no less. I put these leaves in at ten past seven.'),
      ],
      [
        ask(
          6,
          'literacy',
          'understand figurative language: talking about water as if it had feelings',
          [
            N('Uncle Tenzo talks about water as if it had feelings: “hot, but not angry”.'),
            N('What does he really mean by “angry” water?'),
          ],
          [
            opt('Water bubbling and boiling hard', [
              I('Exactly! Boiling water roars and bubbles, like a temper. Gentle tea likes it a little calmer.', 'happy'),
            ], true),
            opt('Water that is cross with him', [
              I('Ha! Water has no feelings, Keeper. I am being poetic.'),
              I('I mean water boiling hard and wild, like a temper.'),
            ]),
            opt('Cold water', [
              I('Cold water is the calmest of all! “Angry” water is the opposite: boiling hard and bubbling wildly.'),
            ]),
          ],
          'Worked out what figurative language means: “angry” water is water boiling hard.',
          'L.4.5',
        ),
        ask(
          9,
          'maths',
          'add minutes to find an end time',
          [I('Leaves in at 7:10. Three minutes to steep. When must we take them out?')],
          [
            opt('7:13', [I('7:13 precisely. You have the timing of a general, Keeper.', 'happy')], true),
            opt('7:40', [
              I('That would be thirty minutes! The tea would be as bitter as an old boot.', 'shock'),
              I('Three minutes after 7:10 is 7:11, 7:12, 7:13.'),
            ]),
            opt('10:10', [
              I('That is three HOURS. We would all be asleep.'),
              I('Count on three minutes from 7:10: 7:11, 7:12, 7:13.'),
            ]),
          ],
          'Added 3 minutes to 7:10 to find when the tea is ready (7:13).',
          '3.MD.A.1',
        ),
      ],
      [
        ch(
          'jasmine',
          'Start with jasmine',
          [I('A fine choice. Jasmine forgives most mistakes, like a good friend.', 'happy')],
          { 'q50-first': 'jasmine' },
        ),
        ch(
          'ginger',
          'Start with ginger',
          [I('Bold! Ginger is a tea that tells you exactly what it thinks of you.')],
          { 'q50-first': 'ginger' },
        ),
        ch('kaito', 'Ask Kaito which tea he likes', [
          Z('I… don’t really like tea.', 'think'),
          N('Uncle Tenzo staggers and clutches the counter, as if struck.'),
        ]),
      ],
    ),
    scene(
      'q50-open-done',
      [
        N('Steam curls from the spout. You pour. Three cups glow gold in the morning sun.'),
        I('Three perfect cups. My heart is warm, and so is my tongue.', 'happy'),
        Z('You burnt your tongue again.'),
        I('For art.'),
        Z('The water was boiling, Uncle. That’s a hundred degrees.'),
        I('Then I shall blow on the next one. A wise general learns from every battle. Even a battle with a teacup.', 'think'),
      ],
      [
        notice(
          4,
          'science',
          'boiling, steam, and changes that can be reversed',
          [
            N('Water boils at 100 °C (212 °F). As it boils, some of it turns into a gas you can’t see, called water vapour.'),
            N('The white cloud above a kettle is that vapour cooling back into tiny drops of water.'),
            N('Heating turns water into gas. Cooling turns it back. That change can go both ways.'),
          ],
          'Learned that water boils at 100 °C (212 °F), turning to vapour, and that cooling turns the vapour back into water.',
          '2-PS1-4',
        ),
      ],
    ),
    // ------------------------------------------------ step 2: the grumpy customer
    scene(
      'q50-grump',
      [
        N('The stall’s first customer arrives: an old man with a walking stick and a face like a closed door.'),
        PE('Tea. Not fancy tea. Not flowery tea. And not with a speech, either.', 'angry'),
        I('Of course, of course. Please sit. The Keeper will serve you personally.', 'happy'),
        PE('Last place I went, the tea tasted of boiled sock.'),
        Z('Then go back to the sock place.', 'angry'),
        I('Nephew. A bitter guest is only a sweet guest who has not been served yet.'),
        Z('…Is that a real saying?', 'think'),
        I('It is now.'),
      ],
      [
        ask(
          0,
          'literacy',
          'understand a simile',
          [
            N('“A face like a closed door” is a simile: it compares two things using the word “like”.'),
            N('What does it tell you about Mr Pell?'),
          ],
          [
            opt('He looks unfriendly, and he doesn’t want to chat.', [
              N('Yes. A closed door keeps people out. His face is doing the same.'),
            ], true),
            opt('His face is made of wood.', [
              N('Ha! Not really. A simile isn’t meant literally.'),
              N('A closed door keeps people out, so his face looks unfriendly, as if he doesn’t want to chat.'),
            ]),
            opt('He is very happy.', [
              N('A happy face is more like an open door! A closed door keeps people out.'),
              N('So his face looks unfriendly and unwelcoming.'),
            ]),
          ],
          'Explained what a simile (“a face like a closed door”) tells the reader about a character.',
          'L.4.5',
        ),
        ask(
          7,
          'sel',
          'think about what might be behind someone’s grumpiness',
          [I('So, Keeper. Is my saying true? Is a grumpy person just someone who hasn’t been looked after yet?')],
          [
            opt('Yes. Kindness can help a grumpy person feel better.', [
              I('I believe so too. A warm cup has softened harder faces than his.', 'soft'),
            ]),
            opt('Not always. Some people just like grumbling.', [
              I('Ha! Fair. Some people enjoy grumbling the way others enjoy singing.'),
              I('Still, kindness costs nothing. We never know what kind of day someone has had.', 'soft'),
            ]),
            opt('Maybe he’s sad or lonely, not just grumpy.', [
              I('Ah. That is a wise guess. Grumpy on the outside is sometimes sad on the inside.', 'soft'),
            ]),
          ],
          'Thought about what might lie behind someone’s grumpy mood, and how kindness can help.',
          'CASEL: Social awareness',
        ),
      ],
      [
        ch(
          'jasmine',
          'Serve him jasmine',
          [PE('Flowery. I said no flowery.'), N('He drinks it all anyway, and holds out the cup for more.')],
          { 'q50-pell': 'jasmine' },
        ),
        ch('black', 'Serve him strong black tea', [PE('Hm. Finally, a tea with a spine.')], { 'q50-pell': 'black' }),
        ch(
          'ask',
          'Ask what tea he drank as a boy',
          [
            PE('My mother made barley tea. Nobody makes barley tea any more.', 'soft'),
            I('I have barley! I have everything!', 'happy'),
          ],
          { 'q50-pell': 'barley' },
        ),
      ],
    ),
    scene(
      'q50-grump-done',
      [
        PE('…Not bad.'),
        N('From Old Mr Pell, this is a standing ovation.'),
        N('The sign says a cup of tea costs 6 Shells. He counts coins onto the counter: one, two, three, four.'),
        N('He is short, and he pretends very hard not to notice.'),
        I('(quietly) Your stall today, Keeper. Your call.'),
        Z('(quietly) Whatever you choose, choose it kindly.', 'soft'),
      ],
      [
        ask(
          3,
          'maths',
          'subtract to find how much is missing',
          [N('Tea costs 6 Shells. Mr Pell has put down 4. How many Shells short is he?')],
          [
            opt('2 Shells', [N('Yes. 6 − 4 = 2. He’s two Shells short.')], true),
            opt('10 Shells', [
              N('That adds 6 and 4. We want the difference: how many more he needs to make 6.'),
              N('4… 5, 6. Two more. He’s 2 Shells short.'),
            ]),
            opt('4 Shells', [
              N('4 is how many he’s paid. Count on from 4 to 6: 5, 6. That’s two more.'),
              N('He’s 2 Shells short.'),
            ]),
          ],
          'Found the difference between the price (6 Shells) and the money paid (4 Shells).',
          '1.OA.A.1',
        ),
        notice(
          4,
          'social-studies',
          'when there isn’t enough, people must choose',
          [
            I('A stall must buy leaves and mend kettles, so it needs its Shells. But kindness matters too.'),
            I('When there isn’t enough of something to go round, we have to choose. There is no single right answer here.'),
          ],
          'Learned that when there isn’t enough of something (scarcity), people have to make choices.',
          'D2.Eco.1.K-2',
        ),
      ],
      [
        ch(
          'q50-free',
          'Tell him this one is on the house',
          [
            PE('I don’t take charity.', 'angry'),
            I('It is not charity. It is a deposit on tomorrow.', 'soft'),
            PE('…Hm. Tomorrow, then.'),
          ],
          { 'q50-pay': 'free' },
        ),
        ch(
          'q50-full',
          'Kindly ask him for the rest tomorrow',
          [
            PE('Fair. A shop that gives everything away doesn’t stay a shop.'),
            I('And a fair price, gently asked, is its own kind of kindness.', 'soft'),
          ],
          { 'q50-pay': 'later' },
        ),
        ch(
          'q50-trade',
          'Ask him to fix the wobbly stool instead',
          [
            PE('That stool has been wobbling since you opened. I noticed. I notice everything.'),
            N('He fixes it with a folded leaf and the end of his walking stick. It never wobbles again.'),
          ],
          { 'q50-pay': 'trade' },
        ),
      ],
    ),
    scene(
      'q50-complete',
      [
        N('By noon the stall is full. Your Nubbins doze in a row under the counter, warm as buns.'),
        I('You have a gift, Keeper. Tea is only leaves and water. The rest is paying attention.', 'soft'),
        I('The stall is yours to keep. I will visit often. I will also drink a great deal of the stock.'),
        Z('He means all of the stock.'),
        N('Kaito refills Mr Pell’s cup without being asked. Uncle Tenzo pretends not to see, and glows like a lantern.'),
        N('He hands you a tin of jasmine tea with a dragon on the lid. The dragon is not fierce at all.'),
        I('This tin holds 100 grams of leaves. One pot takes 5 grams. Measure carefully, and it will last.'),
        PE('Same time tomorrow. Don’t be late.'),
      ],
      [
        ask(
          6,
          'maths',
          'divide to find how many equal amounts fit',
          [I('100 grams in the tin, 5 grams for each pot. How many pots can you make?')],
          [
            opt('20 pots', [I('Twenty! Twenty fives make a hundred. That is a great many mornings of tea.', 'happy')], true),
            opt('95 pots', [
              I('That takes away just one pot’s worth. We need to know how many fives fit into 100.'),
              I('5, 10, 15, 20… keep going, and you reach 100 after twenty fives. 20 pots.'),
            ]),
            opt('500 pots', [
              I('If only! That multiplies instead of sharing out.'),
              I('How many fives fit into 100? Twenty. So 20 pots.'),
            ]),
          ],
          'Divided 100 grams into 5-gram measures to find how many pots of tea a tin makes (20).',
          '3.OA.A.3',
        ),
      ],
    ),
  ],
  glossary: [
    gloss('steep', 'To soak leaves in hot water so their flavour comes out.', 'q50-open'),
    gloss('vapour', 'A gas, like the invisible water vapour that rises from boiling water.', 'q50-open-done'),
    gloss('simile', 'A way of describing something by comparing it to something else, using “like” or “as”.', 'q50-grump'),
    gloss('ovation', 'Loud clapping to show you loved something. A standing ovation means people stand up to clap.', 'q50-grump-done'),
    gloss('charity', 'Help or money given to someone who needs it.', 'q50-grump-done'),
    gloss('gram', 'A small unit for measuring how heavy something is. A paperclip weighs about a gram.', 'q50-complete'),
  ],
  notes:
    'Lessons: “angry” water (figurative language), 7:10 plus 3 minutes, boiling at 100 °C (212 °F) and steam, the ' +
    '“closed door” simile, a think question built on Uncle Tenzo’s proverb, 6 − 4 Shells, scarcity and choosing, ' +
    'and 100 g ÷ 5 g. All of Uncle Tenzo’s sayings are the game’s own.',
};

// ================================================================== Q51 Cactus Juice
const Q51: EduQuest = {
  id: 'reader:q51',
  of: 'q51',
  band: 'reader',
  title: 'Cactus Juice',
  goals: {
    'q51-s1': {
      goal: 'Keep Tuk in the shade of the big rock until Nalu comes back.',
      hint: 'Stand between Tuk and the open sand. Shiny things distract him; your Nubbin is shiny enough.',
    },
    'q51-s2': {
      goal: 'Collect three cactus cuttings to plant back at the Grove.',
      hint: 'Cut the small side pads, not the big trunk. Wear the gloves: those spines are sharp.',
    },
  },
  scenes: [
    // ------------------------------------------------ step 1: the desert
    scene(
      'q51-desert',
      [
        N('The desert stretches flat and gold in every direction. Your water skins are empty.'),
        T('Rules. One: nobody wanders off. Two: nobody eats anything strange. Everyone sign the list.'),
        K('Signed. I’m going to find water. Tuk, that rule means you.'),
        T('Me? I’m the responsible one. I have a schedule.'),
        N('Nalu leaves. Tuk eyes a fat green cactus. Thirty seconds pass.'),
        T('You know what cacti are full of? Juice. Survival juice. It would be silly not to.'),
        N('He cracks one open with his boomerang and drinks deeply. His eyes go very wide.'),
        T('Ooooh. That is the juiciest juice in the whole history of juice!', 'happy'),
        P('Tuk, why are you smiling at that rock?'),
        T('Because it’s smiling at me, Pemba. It started it.', 'happy'),
        N('Tuk sets off across the sand, waving at a cloud. Your Nubbin trots after him, delighted.'),
      ],
      [
        notice(
          6,
          'health',
          'never eat or drink wild plants unless a grown-up says they are safe',
          [
            N('Tuk has just done a very silly thing.'),
            N('In real life, never eat or drink any part of a wild plant unless a grown-up who knows plants says it’s safe.'),
            N('Lots of plants, including some cacti, have juice that can make people poorly. Tuk is lucky this is a story.'),
          ],
          'Learned the safety rule: never eat or drink wild plants unless a knowledgeable grown-up says they are safe.',
        ),
      ],
      [
        ch('cloud', 'Agree the cloud looks friendly', [T('Thank you. Finally, someone who listens.')], { 'q51-cloud': true }),
        ch('cup', 'Take the cactus away from him', [T('You can take the cactus. You can’t take the feeling.', 'sad')]),
        ch(
          'sip',
          'Have a tiny sip yourself',
          [N('You lift the cup, smell it, and think better of it. Good choice. Your Nubbin licks the rim and sneezes.')],
          { 'q51-sip': true },
        ),
      ],
    ),
    scene(
      'q51-desert-done',
      [
        N('Nalu comes back with full water skins and stops dead.'),
        K('I was gone ten minutes.', 'angry'),
        T('Nalu! You look like a giant talking fish!', 'happy'),
        K('You made the rule, Tuk! You wrote it on a list! You made me sign the list!', 'angry'),
        K('I found a spring. I filled three skins, and each one holds 2 litres.'),
        K('There are three of us. We share it equally, and we sip slowly.'),
        T('Can the fish have some too?', 'happy'),
      ],
      [
        ask(
          5,
          'maths',
          'solve a two-step problem: multiply, then share equally',
          [K('Three skins of 2 litres each, shared equally between three people. How much does each of us get?')],
          [
            opt('2 litres each', [
              K('Right. 3 × 2 = 6 litres altogether. Shared between three, that’s 2 litres each.', 'happy'),
            ], true),
            opt('6 litres each', [
              K('6 litres is all the water together. Now it has to be shared between three of us.'),
              K('6 ÷ 3 = 2. Two litres each.'),
            ]),
            opt('3 litres each', [
              K('First, 3 skins × 2 litres = 6 litres altogether.'),
              K('Then share 6 between 3 people: 2 litres each.'),
            ]),
          ],
          'Solved a two-step problem: 3 × 2 litres = 6 litres, then 6 ÷ 3 = 2 litres each.',
          '3.OA.D.8',
        ),
      ],
      [
        ch(
          'q51-defend',
          'Stick up for Tuk: he was really thirsty',
          [
            K('So was I. So was everyone. That’s why we had a rule.'),
            T('Thank you, friend. Your face is a melon. A kind melon.', 'happy'),
          ],
          { 'q51-side': 'tuk' },
        ),
        ch(
          'q51-back-nalu',
          'Back Nalu: he broke his own rule',
          [T('…She’s right. I hate it when the giant fish is right.', 'sad')],
          { 'q51-side': 'nalu' },
        ),
      ],
    ),
    // ------------------------------------------------ step 2: the cuttings
    scene(
      'q51-cuttings',
      [
        K('Drink this. All of it. Slowly.'),
        T('This water isn’t magic. It’s just wet.', 'sad'),
        P('To be fair, he did seem really happy.', 'think'),
        K('He tried to arm-wrestle a cactus, Pemba.'),
        T('And I was winning.'),
        N('Up close, the cactus is fat and green and covered in sharp spines. There isn’t a single flat leaf on it.'),
        N('It turns out cacti are easy to grow. Small cuttings take root anywhere the sun is hot.'),
        K('Take some home. Grow them. Just keep them away from anyone with a boomerang.', 'soft'),
      ],
      [
        ask(
          5,
          'science',
          'how a cactus survives with very little rain',
          [P('It hardly ever rains here. So how does a cactus stay alive?')],
          [
            opt('It stores water inside its thick, fat stem.', [
              K('Right. When it does rain, the cactus soaks up all it can and keeps it in its stem, like a water bottle.'),
            ], true),
            opt('It drinks from the clouds.', [
              K('Clouds would be handy! But a cactus drinks through its roots, like other plants.'),
              K('When rain comes, it soaks up all it can and stores the water in its thick stem.'),
            ]),
            opt('It doesn’t need any water at all.', [
              K('Every living thing needs water. A cactus is just brilliant at saving it.'),
              K('It stores water in its thick stem, ready for the dry days.'),
            ]),
          ],
          'Learned that a cactus survives dry places by storing water in its thick stem.',
          '4-LS1-1',
        ),
        notice(
          6,
          'science',
          'spines and waxy skin are adaptations that save water',
          [
            K('And those spines? They are the cactus’s leaves, changed into thin, sharp points.'),
            K('Thin spines lose far less water than big flat leaves would. And they stop thirsty animals taking a bite.'),
            K('Its waxy skin helps hold the water in, too. Each of those is an adaptation: a body part that helps it survive here.'),
          ],
          'Learned that a cactus’s spines (changed leaves) and waxy skin are adaptations that save water and protect it.',
          '4-LS1-1',
        ),
      ],
    ),
    scene(
      'q51-cuttings-done',
      [
        N('Three cuttings, wrapped in cloth. Your Nubbin carries one very carefully, like treasure.'),
        K('Out here, every drop of water counts. Nobody wastes a single sip.'),
        T('At home I leave the tap running while I brush my teeth. Is that bad?', 'think'),
        K('That’s a lot of clean water going down the drain for nothing.'),
        P('The Grove gets plenty of rain, though.'),
        K('Water is precious everywhere. The desert just makes it easier to remember.', 'soft'),
      ],
      [
        act(
          5,
          'science',
          'ways to save water at home',
          'edu:sort:water-savers',
          [
            K('Help me sort these into two baskets: “saves water” and “wastes water”.'),
            N('Tap off while brushing teeth. A dripping tap left dripping. Watering plants with leftover washing-up water. A hose left running.'),
          ],
          'Sorted everyday habits into ones that save water and ones that waste it.',
          'K-ESS3-3',
        ),
      ],
    ),
    scene(
      'q51-complete',
      [
        N('Back at the Grove, the cuttings take root in the sunniest corner. By morning they have little pink flowers.'),
        T('For the record, I don’t remember anything about yesterday.'),
        P('You asked a rock to be your best friend.', 'happy'),
        T('I don’t remember that.'),
        P('You called it “the juiciest juice in the whole history of juice”. About forty times.', 'happy'),
        T('Nobody says that ever again.', 'angry'),
        T('Also. Not-thirsty me made that rule for thirsty me. Thirsty me should have listened.', 'think'),
        N('The cactus juice is yours to share. One small cup makes a Nubbin wobble happily for a minute, then sit down, a bit puzzled.'),
      ],
      [
        ask(
          6,
          'sel',
          'why it helps to make rules before you need them',
          [
            N('Tuk made the rule when he wasn’t thirsty. Then he broke it when he was.'),
            N('Why do you think it helps to make rules before you need them?'),
          ],
          [
            opt('It’s easier to think clearly when you’re calm.', [
              T('That’s it. Calm Tuk is clever. Thirsty Tuk talks to rocks.', 'think'),
            ]),
            opt('It doesn’t help. People break rules anyway.', [
              K('Sometimes they do, like Tuk. But because we had a rule, we all noticed, and we kept him safe.'),
              K('So I think it still helped.'),
            ]),
            opt('So everyone agrees on the rule first.', [
              K('Yes! If everyone helps make a rule, everyone knows it. Even if somebody signs it and then forgets.', 'happy'),
            ]),
          ],
          'Thought about why rules are best made calmly, before the moment you need them.',
          'CASEL: Responsible decision-making',
        ),
      ],
    ),
  ],
  glossary: [
    gloss('responsible', 'Sensible, and trusted to do the right thing.', 'q51-desert'),
    gloss('cacti', 'More than one cactus.', 'q51-desert'),
    gloss('litre', 'A unit for measuring liquid. A big bottle of water often holds one litre.', 'q51-desert-done'),
    gloss('spines', 'Sharp, stiff points on a plant or animal.', 'q51-cuttings'),
    gloss('adaptation', 'A body part or way of living that helps a living thing survive where it lives.', 'q51-cuttings'),
    gloss('precious', 'Very valuable, and worth taking care of.', 'q51-cuttings-done'),
  ],
  notes:
    'Lessons: wild-plant safety (a real-world rule, said plainly), 3 × 2 litres shared by 3, how a cactus stores water, ' +
    'spines and waxy skin as adaptations (4-LS1-1), sorting water-saving habits (do), and a think question on making ' +
    'rules before you need them. Tuk’s catchphrase is replaced with an original one in both places.',
};

// ================================================================== Q52 Puffin’s Lost Days
const Q52: EduQuest = {
  id: 'reader:q52',
  of: 'q52',
  band: 'reader',
  title: 'Puffin’s Lost Days',
  goals: {
    'q52-s1': {
      goal: 'Follow Puffin’s trail across three sections of the Grove.',
      hint: 'Look for white fur, huge footprints and flattened bushes. Your Nubbin notices clues before you do.',
    },
    'q52-s2': {
      goal: 'Win Puffin’s trust: feed him five round fruits by hand.',
      hint: 'Move slowly and don’t run. If he backs off, sit still until he comes forward again.',
    },
    'q52-s3': {
      goal: 'Ride Puffin home to the Grove.',
      hint: 'Hold the reins steady and say “hup-hup”. Lean to steer. Puffin lands on his own at the gate.',
    },
  },
  scenes: [
    // ------------------------------------------------ step 1: the trail
    scene(
      'q52-gone',
      [
        N('Pemba sits on a stump by the gate, holding a huge saddle with nothing in it.'),
        P('Puffin’s gone. The storm frightened him and he just… flew. I called and called.', 'sad'),
        T('Hey. He’s a giant six-legged sky bison. He’s not exactly hard to spot.', 'soft'),
        P('He gets scared on his own. He’s never been on his own.', 'sad'),
        N('Your Nubbin finds a tuft of white fur caught on the fence and brings it to you, very seriously.'),
        T('Okay. That’s a clue. Fur here means he went that way. Let’s look for more.'),
        P('You’ll help? Really?'),
      ],
      [
        notice(
          3,
          'science',
          'animals that live in groups help each other survive',
          [
            N('Real bison live in big groups called herds. Being together helps keep them safe, because many eyes watch for danger.'),
            N('An animal that lives in a herd can feel very frightened when it’s suddenly alone. No wonder Puffin is scared.'),
          ],
          'Learned that bison live in herds, and that living in a group helps animals stay safe.',
          '3-LS2-1',
        ),
        ask(
          6,
          'sel',
          'notice how a friend feels and choose what helps',
          [N('Pemba is worried sick. What would help him most right now?')],
          [
            opt('Telling him we’ll look for Puffin together', [P('…Thanks. Just not being on my own with it helps.', 'soft')], true),
            opt('Telling him not to be silly', [
              T('Careful. He isn’t being silly. He’s worried, and worry isn’t silly.'),
              T('Helping him look is better.'),
            ]),
            opt('Leaving him alone for a bit', [
              N('Some people do like to be alone when they’re upset. But Pemba is asking for help.'),
              N('Staying with him and searching together will help most.'),
            ]),
          ],
          'Noticed a friend’s worry and chose a helpful response: staying with him and helping.',
          'CASEL: Social awareness',
        ),
      ],
      [
        ch('promise', 'Promise you’ll find him', [P('Thank you. He likes people who keep promises. So do I.', 'soft')]),
        ch('joke', 'Ask how you lose something that big', [
          T('Thank you. I asked the same thing. I got a look.'),
          P('I didn’t lose him. He got lost. It’s different.', 'sad'),
        ]),
        ch(
          'nubbin',
          'Let your Nubbin lead the way',
          [N('Your Nubbin sniffs the fur, sneezes, and marches off confidently in the wrong direction. Then it turns round.')],
          { 'q52-nubbin-leads': true },
        ),
      ],
    ),
    scene(
      'q52-gone-done',
      [
        N('The clues lead on. A flattened bush. A trail of giant footprints in the mud, six for every step.'),
        T('Six legs means six new footprints every time he takes a step. Look, I’ve counted five steps’ worth.'),
        N('The last clue is a hill with a bison-shaped dent in it.'),
        N('Beyond it, in a cave, two big eyes blink in the dark.'),
        A('Mrrrrrooooh.', 'sad'),
        P('Puffin!', 'shock'),
      ],
      [
        ask(
          1,
          'maths',
          'multiply equal groups',
          [T('Five steps, six footprints for every step. How many footprints is that?')],
          [
            opt('30', [T('Thirty. Six, twelve, eighteen, twenty-four, thirty. That’s a lot of bison.', 'happy')], true),
            opt('11', [
              N('That adds 5 and 6. But each of the five steps leaves six prints.'),
              N('6 + 6 + 6 + 6 + 6 = 30. Five sixes make 30.'),
            ]),
            opt('56', [
              N('That puts the 5 and the 6 side by side. Count in sixes, five times: 6, 12, 18, 24, 30.'),
            ]),
          ],
          'Multiplied 5 groups of 6 footprints to make 30.',
          '3.OA.A.1',
        ),
      ],
    ),
    // ------------------------------------------------ step 2: trust
    scene(
      'q52-trust',
      [
        N('Puffin is wedged in the cave mouth, trembling. When you take a step forward, he shrinks back.'),
        P('Puffin! Buddy, it’s me! It’s—', 'shock'),
        N('Puffin flinches at the loud voice and backs further in. Pemba stops, and his face falls.'),
        T('He’s still scared. Storms, strange places. Give him a minute.', 'soft'),
        P('He’s never been scared of me before.', 'sad'),
        T('He’s not scared of you. He’s scared of everything, and right now you’re part of everything.'),
        N('Your Nubbin sits down quietly at the cave mouth, holding up a fruit. Puffin’s nose twitches.'),
        P('He loves fruit. The big round ones. He eats them whole.', 'soft'),
      ],
      [
        ask(
          5,
          'sel',
          'how to help a frightened animal feel safe',
          [T('So how do we help a frightened animal feel safe?')],
          [
            opt('Stay quiet and still, and let him come to us.', [
              T('Yes. Let him choose. An animal that chooses to come close starts to trust you.'),
            ], true),
            opt('Run in and give him a big hug.', [
              T('That would feel lovely to us. To a scared bison, it would be terrifying.'),
              T('Quiet and still is kinder. Let him come to you.'),
            ]),
            opt('Call his name louder.', [
              P('I tried that. He backed away.', 'sad'),
              T('Quiet voices and slow moves are better for a scared animal. Let him come to us.'),
            ]),
          ],
          'Learned to approach a frightened animal kindly: quietly, slowly, and letting it choose to come close.',
          'CASEL: Social awareness',
        ),
        notice(
          6,
          'science',
          'animals use their senses, especially smell',
          [
            N('Puffin smells the fruit before he sees it. Many animals have a much better sense of smell than people do.'),
            N('Their noses tell them about food, friends and danger.'),
          ],
          'Learned that many animals rely on a strong sense of smell to find food and notice friends and danger.',
          '4-LS1-2',
        ),
      ],
      [
        ch('wait', 'Sit down and wait', [N('You sit. You wait. A big wet nose edges closer.')]),
        ch(
          'whistle',
          'Whistle the tune Pemba always whistles',
          [P('That’s his bedtime whistle! How did you know?'), N('Puffin’s ears flick forward.')],
          { 'q52-whistle': true },
        ),
        ch('roll', 'Roll a fruit gently towards him', [
          N('The fruit rolls. A huge tongue swipes it up. Puffin looks at you as if you are suddenly very interesting.'),
        ]),
      ],
    ),
    scene(
      'q52-trust-done',
      [
        N('One fruit. Two. Three. Four. With the fifth, a huge pink tongue curls round your whole hand.'),
        A('Mrrrrrf!', 'happy'),
        N('Puffin pushes out of the cave and flattens Pemba under an enormous, slobbery lick.'),
        P('I missed you too! I missed you too! Ow, my ribs!', 'happy'),
        T('That’s a very different noise from before. Even I can tell that one’s happy.'),
        N('Your Nubbin is also licked. It does not enjoy this, but it allows it, for Pemba’s sake.'),
      ],
      [
        ask(
          4,
          'literacy',
          'find words that show feelings',
          [
            N('Puffin can’t talk, but the words in the story show how he feels.'),
            N('Which words show that Puffin is happy now?'),
          ],
          [
            opt('“pushes out of the cave” and “slobbery lick”', [
              N('Yes. Before, he shrank back. Now he rushes out to lick everyone. Those words show joy.'),
            ], true),
            opt('“trembling” and “shrinks back”', [
              N('Those words were from before, when he was scared.'),
              N('Now he “pushes out of the cave” and gives an “enormous, slobbery lick”. Those show he’s happy.'),
            ]),
            opt('“Ow, my ribs”', [
              N('Ha! Those words show how Pemba feels: squashed, but happy.'),
              N('For Puffin, look at “pushes out of the cave” and “slobbery lick”.'),
            ]),
          ],
          'Found words in the text that show a character’s feelings.',
          'RL.1.4',
        ),
      ],
    ),
    // ------------------------------------------------ step 3: home
    scene(
      'q52-home',
      [
        P('He wants to go home. He wants you to come too. Look, he’s crouching down for you.'),
        T('Sure. Just climb up a nervous animal the size of a house. Totally normal day.'),
        N('Puffin rumbles beneath you like a warm mountain. Your Nubbin clings to the saddle, eyes huge.'),
        P('The word is “hup-hup”. Say it like you mean it.', 'happy'),
        T('Or just scream. Screaming also works.'),
        N('Puffin shifts his six legs, ready. The whole saddle sways.'),
        P('He’ll find the way. Sky bison always know the way home. Like the birds that fly south.', 'happy'),
      ],
      [
        ask(
          4,
          'maths',
          'solve a distance and time problem',
          [P('Puffin flies about 2 kilometres every minute. The Grove gate is 10 kilometres away. How many minutes will it take?')],
          [
            opt('5 minutes', [P('Five! 2, 4, 6, 8, 10. Five lots of 2 kilometres.', 'happy')], true),
            opt('20 minutes', [
              T('That multiplies 10 by 2. But he covers 2 kilometres every minute, so count up in twos.'),
              T('2, 4, 6, 8, 10: five minutes.'),
            ]),
            opt('8 minutes', [
              T('That takes 2 from 10. Count up in twos instead: 2, 4, 6, 8, 10.'),
              T('That’s five twos, so five minutes.'),
            ]),
          ],
          'Solved a distance and time problem: 10 km at 2 km a minute takes 5 minutes.',
          '4.MD.A.2',
        ),
        notice(
          6,
          'science',
          'migration: animals that travel long distances',
          [
            T('He’s right about the birds. Lots of real animals make long journeys every year. Those journeys are called migrations.'),
            T('Arctic terns fly from the far north of the world to the far south and back again, every single year.'),
            N('Many birds find their way using the Sun, the stars and even the Earth’s magnetism. Scientists are still learning exactly how.'),
          ],
          'Learned about migration, including the Arctic tern’s yearly journey, and some of the ways birds find their way.',
        ),
      ],
    ),
    scene(
      'q52-home-done',
      [
        N('Up you go. The Grove spreads out below you, tiny and green. Every Nubbin in it looks up.'),
        N('Wind roars past your ears. Your Nubbin opens one eye, then the other, then squeaks with joy.'),
        N('Puffin lands at the gate with a thump that shakes fruit from every tree.'),
        N('Pemba’s eyes are wet. He says it’s the wind.'),
        N('Tuk, very kindly, agrees that it was windy.'),
        T('Very windy. The windiest. My eyes are also wet. From the wind.', 'soft'),
      ],
      [
        ask(
          5,
          'literacy',
          'work out why a character says something',
          [N('Pemba says his eyes are wet from the wind. Why do you think Tuk agrees with him?')],
          [
            opt('To be kind, so Pemba doesn’t feel embarrassed.', [
              N('Yes. Tuk can tell Pemba is crying with relief. Agreeing about the wind is his way of being a good friend.'),
            ], true),
            opt('Because it really was just the wind.', [
              N('It WAS windy! But notice Tuk’s eyes are suddenly “wet” too.'),
              N('I think they’re both a bit emotional, and Tuk is being kind so Pemba doesn’t feel embarrassed.'),
            ]),
            opt('Because Tuk wasn’t listening.', [
              N('Tuk was listening very carefully. He says it “very kindly”.'),
              N('He agrees so Pemba won’t feel embarrassed about crying with relief.'),
            ]),
          ],
          'Worked out a character’s reason for what he says, using clues like “very kindly”.',
          'RL.3.3',
        ),
      ],
    ),
    scene(
      'q52-complete',
      [
        P('Thank you. Really. I don’t know what I’d do without him.', 'soft'),
        P('I keep thinking it was my fault. If I’d held on tighter in the storm…', 'sad'),
        T('You can’t hold on to a storm, Pemba. You can only be the one who comes looking afterwards. You did that.', 'soft'),
        N('Puffin lowers his huge head and rests it on your shoulder. It weighs about as much as a cart.'),
        P('He likes you now. That means he’ll come when you call. Anywhere in the Grove.', 'happy'),
        T('He means you get a giant flying taxi. Congratulations. Mind the fur, it gets everywhere.'),
        N('A white tuft drifts down onto your Nubbin’s head. Your Nubbin refuses to let you remove it.'),
      ],
      [
        ask(
          2,
          'sel',
          'think about blame, and what matters after something goes wrong',
          [
            N('Pemba thinks losing Puffin was his fault. Tuk doesn’t.'),
            N('What do you think?'),
          ],
          [
            opt('It wasn’t his fault. Nobody can stop a storm.', [
              T('That’s what I said. Storms don’t care how tightly you hold on.'),
            ]),
            opt('Maybe a little, but he made it right by searching.', [
              T('That’s a fair way to see it. When something goes wrong, what you do next matters most.', 'soft'),
            ]),
            opt('It doesn’t matter whose fault it was. Puffin’s home now.', [
              P('…Yeah. He is. Maybe I can stop going over it now.', 'soft'),
            ]),
          ],
          'Thought about blame and guilt, and how what we do next matters after something goes wrong.',
          'CASEL: Self-awareness',
        ),
      ],
    ),
  ],
  glossary: [
    gloss('herd', 'A big group of animals of one kind that live and travel together.', 'q52-gone'),
    gloss('tuft', 'A small bunch of hair, fur or grass held together.', 'q52-gone'),
    gloss('trembling', 'Shaking a little, often because of fear or cold.', 'q52-trust'),
    gloss('flinches', 'Pulls back suddenly, because something seems scary or might hurt.', 'q52-trust'),
    gloss('migration', 'A long journey that animals make, often at the same time every year.', 'q52-home'),
    gloss('relief', 'The happy, light feeling when something worrying is over.', 'q52-home-done'),
  ],
  notes:
    'Lessons: herds, helping a worried friend, 5 × 6 footprints, approaching a frightened animal kindly, animals’ sense ' +
    'of smell, words that show feelings, 10 km at 2 km a minute, migration (Arctic terns), Tuk’s kind fib about the ' +
    'wind, and a think question on blame. Real bison have four legs; Puffin’s six are left as game magic.',
};

// ================================================================== Q53 The Fan Warriors
const Q53: EduQuest = {
  id: 'reader:q53',
  of: 'q53',
  band: 'reader',
  title: 'The Fan Warriors',
  goals: {
    'q53-s1': {
      goal: 'Join the fan-warriors’ morning drill and finish it without dropping your fan.',
      hint: 'Copy the warrior at the front. Open, sweep, close: the pattern is slower than it looks.',
    },
    'q53-s2': {
      goal: 'Win a sparring bout against Sumi using fan-blocks.',
      hint: 'Block just as her strike lands to turn it aside. Don’t attack first; let her come to you.',
    },
  },
  scenes: [
    // ------------------------------------------------ step 1: flattened
    scene(
      'q53-flattened',
      [
        N('In the dojo yard, warriors in green with painted faces move through a drill in perfect time, steel fans flashing.'),
        T('Oh, that’s adorable. Fan dancing! Do you also do a ribbon routine?', 'happy'),
        S('We’re the fan-warriors. I’m Sumi. And that’s the last joke you get.'),
        T('Okay, okay. But come on. Fans. Like it’s hot. I’m the one with the boomerang.'),
        S('Would you like to try me?'),
        T('I don’t want to hurt you.'),
        N('Three seconds later, Tuk is flat on his back in the sand, a closed fan resting gently on his nose.'),
        T('…What just happened.', 'shock'),
        S('You fought me. Briefly.'),
      ],
      [
        ask(
          8,
          'sel',
          'don’t judge people by how they look',
          [N('Tuk decided the fan-warriors weren’t tough, just from looking at them. Was he right?')],
          [
            opt('No. You can’t tell how strong or clever someone is just by looking.', [
              S('Thank you. People judge us by our fans all the time. Then they meet the fans.', 'happy'),
            ], true),
            opt('Yes. Fans aren’t real weapons.', [
              T('…I’m lying in the sand with a fan on my nose. I’d like to change my answer.'),
              N('Tuk judged too fast. You can’t tell what someone can do just by looking at them.'),
            ]),
            opt('He just didn’t see her coming.', [
              N('True, he didn’t! Because he’d already decided she wasn’t a threat.'),
              N('Judging by looks made him careless. You can’t tell what someone can do just by looking.'),
            ]),
          ],
          'Thought about why judging people by how they look leads to wrong ideas about them.',
          'CASEL: Social awareness',
        ),
      ],
      [
        ch('laugh', 'Laugh', [T('Thanks. Really feeling the support.', 'angry')], { 'q53-laughed': true }),
        ch('help', 'Help Tuk up', [T('Thanks. My pride is still down there. Leave it.')]),
        ch('learn', 'Ask Sumi to teach you', [S('You I like. Him, we’ll see.', 'happy'), T('“Him” is lying right here.')]),
      ],
    ),
    scene(
      'q53-flattened-done',
      [
        N('You follow the drill at the back of the line. Open. Sweep. Close. Your fan wobbles, but it doesn’t drop.'),
        S('Not bad. You’ve got patience.'),
        T('I want to train too. Properly.'),
        S('Then you wear the uniform. All of it.'),
        T('…All of it?', 'shock'),
        S('All of it. The drill starts at dawn tomorrow. Don’t be late.'),
      ],
      [
        ask(
          5,
          'literacy',
          'work out which meaning of a multiple-meaning word fits',
          [
            N('“Drill” has more than one meaning. A builder uses a drill to make holes in wood.'),
            N('What does Sumi mean by “the drill”?'),
          ],
          [
            opt('A set of moves you practise again and again', [S('Exactly. Open, sweep, close, a hundred times, until your arms know it.')], true),
            opt('A tool for making holes', [
              N('That’s one meaning! But Sumi isn’t building anything.'),
              N('Here, a drill means moves you practise again and again until you get them right.'),
            ]),
            opt('A kind of fish', [
              T('Ha! I wish. I’d be good at that.'),
              N('Here, a drill means moves you practise again and again until you get them right.'),
            ]),
          ],
          'Used context to choose the right meaning of the multiple-meaning word “drill”.',
          'L.3.4',
        ),
      ],
    ),
    // ------------------------------------------------ step 2: the uniform and the spar
    scene(
      'q53-uniform',
      [
        N('Tuk steps out of the hut in a green robe, a headpiece and full white-and-red face paint. He looks magnificent.'),
        N('He knows it, and he hates that he knows it.'),
        T('Not. One. Word.'),
        S('The uniform isn’t a costume. The paint says you won’t hide who you are.'),
        T('What does the headpiece say?', 'think'),
        S('It says you need a haircut.'),
        N('Your Nubbin has also been painted. Someone gave it a tiny fan. It is taking this extremely seriously.'),
        S('Last lesson. Don’t stop the punch. Move it somewhere else.'),
        S('Spar with me, and find out.', 'happy'),
      ],
      [
        act(
          1,
          'maths',
          'complete a symmetrical pattern across a line of symmetry',
          'edu:paint:face:mirror-half',
          [
            S('Fan-warrior paint is the same on both sides of the face. Down the middle, from forehead to chin, runs a line of symmetry.'),
            S('Your Nubbin only has paint on one side so far. Paint the other side to match it, like a mirror.'),
          ],
          'Completed a face-paint pattern so both halves matched across a line of symmetry.',
          '4.G.A.3',
        ),
        notice(
          7,
          'science',
          'a small sideways force can change the direction of a moving thing',
          [
            S('A punch coming straight at you is hard to stop. You’d need a push just as strong, the other way.'),
            S('But a small push from the side changes which way it goes. The punch sails past, and you hardly feel it.'),
            N('Pushes and pulls are called forces. A small sideways force can change the direction of something moving.'),
          ],
          'Learned that a small sideways force can change the direction of a moving object.',
          '3-PS2-1',
        ),
      ],
      [
        ch('tuk', 'Let Tuk go first', [N('Tuk charges. Sumi steps aside. Tuk keeps going for quite a while.')]),
        ch('you', 'Step up yourself', [S('Good. Breathe. Watch my shoulder, not my fan.')]),
        ch('nubbin', 'Send in your painted Nubbin', [S('Ha! Fearless. Come on then, little warrior.', 'happy')], {
          'q53-nubbin-spar': true,
        }),
      ],
    ),
    scene(
      'q53-uniform-done',
      [
        N('Sumi strikes. You turn her fan aside, just as it lands. Again. And again.'),
        S('Well. Look at you. You’d pass for a fan-warrior. Almost.', 'happy'),
        T('Almost? I’m wearing face paint.'),
        S('The paint isn’t for scaring anyone. It’s so the warrior beside you always knows it’s you. That part you’ve got.', 'soft'),
        S('Now the drill again, all together. Open, sweep, close. Open, sweep, close.'),
        T('I’m counting. I have to count. Don’t talk to me.', 'think'),
      ],
      [
        ask(
          5,
          'maths',
          'continue a repeating pattern',
          [S('Open, sweep, close, and then it starts again. What is the 10th move?')],
          [
            opt('Open', [S('Yes. The pattern repeats every three moves. Moves 1, 4, 7 and 10 are all “open”.', 'happy')], true),
            opt('Sweep', [
              N('Let’s count it out. 1 open, 2 sweep, 3 close, 4 open, 5 sweep, 6 close, 7 open, 8 sweep, 9 close…'),
              N('…10 open! The pattern repeats every three moves.'),
            ]),
            opt('Close', [
              N('Close is every third move: 3, 6, 9. So move 9 is close, and the pattern starts again.'),
              N('Move 10 is open.'),
            ]),
          ],
          'Continued a repeating pattern of three to find the 10th move.',
          '4.OA.C.5',
        ),
      ],
    ),
    scene(
      'q53-complete',
      [
        T('Sumi. I got it wrong. Wrong about fans, wrong about girls. Wrongest of all about me.'),
        S('That’s the best apology I’ve heard all year. And I’ve flattened a lot of boys.', 'soft'),
        T('…How many is a lot?'),
        S('Keep the fan, Keeper. And the paint. You’ve earned a place in our drill any morning you like.', 'happy'),
        N('She tucks a folded steel fan into your belt. When you open it, it makes a perfect half circle.'),
        N('Your Nubbin refuses to wash its face for three days.'),
      ],
      [
        ask(
          1,
          'sel',
          'think about what makes an apology a good one',
          [
            N('Sumi says Tuk’s apology is the best she’s heard all year.'),
            N('What do you think makes an apology a good one?'),
          ],
          [
            opt('Saying exactly what you got wrong.', [
              S('That’s what Tuk did. He didn’t just say sorry. He named what he got wrong, even the part about himself.'),
            ]),
            opt('Meaning it, and doing better next time.', [
              S('Yes. Sorry is a word. Doing better is a promise.', 'soft'),
            ]),
            opt('Saying sorry quickly, to get it over with.', [
              S('Quick is good, if you mean it. But a rushed sorry can sound like you just want it over.'),
              S('Tuk took his time, and it showed.'),
            ]),
          ],
          'Thought about what makes an apology sincere and meaningful.',
          'CASEL: Relationship skills',
        ),
        ask(
          4,
          'maths',
          'put two halves together to make a whole',
          [N('One open fan makes half a circle. What shape do two open fans make, laid edge to edge?')],
          [
            opt('A whole circle', [N('Yes. Two halves make one whole. Sumi’s warriors sometimes make a full circle of fans.')], true),
            opt('A square', [
              N('The fans have curved edges, so they can’t make a square.'),
              N('Two half circles fit together to make one whole circle.'),
            ]),
            opt('A bigger half circle', [
              N('Try it with your hands: two halves, edge to edge. They make one whole circle.'),
            ]),
          ],
          'Put two half circles together to make a whole circle.',
          '1.G.A.3',
        ),
      ],
    ),
  ],
  glossary: [
    gloss('briefly', 'For a very short time.', 'q53-flattened'),
    gloss('drill', 'Moves practised over and over until you can do them well. (It’s also a tool for making holes!)', 'q53-flattened-done'),
    gloss('symmetry', 'When one half of a shape is a mirror image of the other half.', 'q53-uniform'),
    gloss('force', 'A push or a pull.', 'q53-uniform'),
    gloss('apology', 'Saying sorry for something you did wrong.', 'q53-complete'),
  ],
  notes:
    'Lessons: judging by looks, the two meanings of “drill”, face-paint symmetry (do), turning a punch aside with a ' +
    'small sideways force, the 10th move in an open-sweep-close pattern, a think question on apologies, and two half ' +
    'circles making a whole.',
};

// ================================================================== Q54 The Sword Master
const Q54: EduQuest = {
  id: 'reader:q54',
  of: 'q54',
  band: 'reader',
  title: 'The Sword Master',
  goals: {
    'q54-s1': {
      goal: 'Complete Master Pian’s three lessons: the brush, the stillness and the garden.',
      hint: 'Each lesson is a short timing game. Slow, steady moves score better than fast ones.',
    },
    'q54-s2': {
      goal: 'Haul the fallen star to Master Pian’s forge and help Tuk shape it into a blade.',
      hint: 'Strike when the metal glows orange, not white. Let it rest between rounds.',
    },
  },
  scenes: [
    // ------------------------------------------------ step 1: three lessons
    scene(
      'q54-lessons',
      [
        N('Master Pian’s house sits at the top of the hill, the courtyard swept so clean it seems to glow.'),
        T('Master Pian. I want to learn the sword. I’ve got a boomerang, but that’s a coming-back sort of weapon.'),
        PI('Many people want swords. Few want to learn. Why do you?'),
        T('Honestly? Everyone else has a special thing. Pemba flies. Nalu does water. I have… plans.', 'think'),
        PI('Plans are not nothing. A blade without a plan is only a heavy stick.', 'soft'),
        PI('First, you will learn to write your name with a brush. Then to sit still. Then to look at a garden.'),
        T('That’s not sword. None of that is sword.', 'shock'),
        PI('All of it is sword.'),
        N('Your Nubbin is already sitting very still, gazing at the garden. Master Pian nods at it.'),
      ],
      [
        ask(
          3,
          'sel',
          'recognise strengths in yourself and others',
          [
            N('Tuk feels that everyone else has a special thing, except him.'),
            N('Is being good at plans a special thing?'),
          ],
          [
            opt('Yes. Planning is a real talent.', [
              N('Yes. Think of the cart, the canyon and the maze: Tuk’s plans helped every time.'),
            ], true),
            opt('No. Only flying and water count.', [
              N('Lots of people feel like that about themselves sometimes.'),
              N('But Tuk’s plans have helped his friends again and again. Planning is a real talent, even if it doesn’t glow.'),
            ]),
            opt('Only if the plans work.', [
              N('Ha! Most of them do. And even the ones that don’t teach him something for next time.'),
              N('Planning is a real talent.'),
            ]),
          ],
          'Recognised that quieter skills, like planning, are real strengths.',
          'CASEL: Self-awareness',
        ),
        act(
          8,
          'health',
          'use slow breathing to calm down',
          'edu:breathe:count-4',
          [
            PI('Stillness begins with breath. Breathe in slowly while I count to four. One, two, three, four.'),
            PI('Now breathe out slowly, for four. One, two, three, four. Again.'),
            N('Slow breathing helps your body calm down when you feel fidgety or worried.'),
          ],
          'Practised slow, counted breathing as a way to calm the body.',
          'CASEL: Self-management',
        ),
      ],
      [
        ch('brush', 'Start with the brush', [PI('Good. A sword stroke and a brush stroke are cousins. Neither can be taken back.')]),
        ch('sit', 'Start with sitting still', [T('I can sit still. Watch.'), N('Tuk lasts nine seconds.')]),
        ch('garden', 'Start with the garden', [PI('Tell me what you see.', 'soft'), T('Rocks. Some more rocks.'), PI('Look longer.')]),
      ],
    ),
    scene(
      'q54-lessons-done',
      [
        N('By sunset, Tuk has written his name forty times. The last one is almost neat.'),
        PI('You have learned three things today. Your hand, your breath and your eyes.'),
        T('And my knees. My knees learned a lot.'),
        PI('Look again at the garden. What do you see now?', 'soft'),
        T('…The sand is raked into rings round each rock, like ripples round a stone dropped in a pond.', 'think'),
        PI('Ah. Now you are looking.', 'happy'),
      ],
      [
        act(
          4,
          'art',
          'draw a pattern of lines with slow, steady strokes',
          'edu:draw:ripple-lines',
          [
            PI('Take the rake. Draw rings round the stone, each one a little bigger than the last. Slow and steady.'),
            N('Artists use repeated lines to make patterns. Slow hands make smooth lines.'),
          ],
          'Drew a pattern of rings with slow, steady strokes, like a raked sand garden.',
        ),
      ],
    ),
    // ------------------------------------------------ step 2: the meteor
    scene(
      'q54-meteor',
      [
        N('That night, a streak of white fire falls behind the hill. The ground shivers.'),
        T('Did you see that? A shooting star! It landed! It actually landed!', 'shock'),
        PI('Sky-iron. A sword from a falling star is rare. It would be yours, and no one else’s.', 'think'),
        T('Then let’s go dig up a star.', 'happy'),
        N('The crater is still warm. In its centre lies a black rock, heavy as a sleeping Nubbin and twice as stubborn.'),
        PI('You will forge it yourselves. I will only hold the tongs and say “no” sometimes.'),
        T('How sometimes?'),
        PI('Often.'),
        T('What if I get it wrong? It’s a star. You only get one star.', 'think'),
        PI('Then you will own a badly made star, and know more than you did. Every master keeps one. Mine is a spoon.', 'soft'),
      ],
      [
        ask(
          4,
          'science',
          'what shooting stars (meteors) and meteorites really are',
          [PI('Tuk calls it a star. It is not really a star. So what is a “shooting star”?')],
          [
            opt('A space rock burning up as it rushes through the air', [
              PI('Yes. It is called a meteor. Most burn away to nothing high in the sky.'),
              PI('The rare one that reaches the ground is called a meteorite. Some are mostly iron and nickel. That is our sky-iron.'),
            ], true),
            opt('A real star falling out of the sky', [
              PI('Real stars are enormous balls of hot, glowing gas, like our Sun. One could never land on a hill.'),
              PI('A shooting star is a meteor: a space rock burning up as it rushes through the air. One that lands is a meteorite.'),
            ]),
            opt('A firework', [
              T('Best firework ever, if it was.'),
              PI('It is a meteor: a space rock burning up as it rushes through the air. One that reaches the ground is a meteorite.'),
            ]),
          ],
          'Learned that a shooting star is a meteor (a space rock burning up in the air) and one that lands is a meteorite.',
        ),
        ask(
          9,
          'sel',
          'think about what mistakes can teach us',
          [N('Master Pian keeps his first badly made thing: a spoon. Why would a master keep a mistake?')],
          [
            opt('To remember how much he has learned since.', [
              PI('That is how I see it. Every time I look at it, I remember I was once a beginner.', 'soft'),
            ]),
            opt('He shouldn’t. Mistakes belong in the bin.', [
              PI('Some do! But some are worth keeping. A mistake you learned from is a kind of teacher.'),
            ]),
            opt('Because he still uses it for soup.', [
              PI('…I do, in fact. It is a terrible spoon. I love it.', 'happy'),
            ]),
          ],
          'Thought about how mistakes can be part of learning, and why someone might keep one.',
          'CASEL: Self-awareness',
        ),
      ],
    ),
    scene(
      'q54-meteor-done',
      [
        N('In the forge, the sky-iron glows red, then orange, then bright yellow-white. Sparks leap from every blow.'),
        PI('Watch the colour. Too dark, and the metal is too hard to shape. Too white, and it can be spoiled.'),
        N('Heat, hammer, rest. Heat, hammer, rest. The rock slowly stretches into the shape of a blade.'),
        PI('Now. Into the water.'),
        N('Hssssssss! A cloud of steam bursts up as the hot blade plunges into the bucket.'),
        N('The blade comes out of the water as dark as night, with tiny silver flecks like stars.'),
        T('Whoa.', 'soft'),
      ],
      [
        notice(
          1,
          'science',
          'heating softens metal and cooling hardens it again; glow colour shows heat',
          [
            PI('Heat makes metal soft enough to hammer into a new shape. When it cools down, it is hard again.'),
            PI('Blacksmiths read the heat by the glow. Red is hot, orange is hotter, and yellow-white is hottest of all.'),
          ],
          'Learned that heating softens metal and cooling hardens it again, and that glow colour shows how hot it is.',
          '2-PS1-4',
        ),
        ask(
          2,
          'maths',
          'solve a two-step word problem',
          [
            PI('Each round is 3 minutes in the fire and 2 minutes of hammering. Tuk does 4 rounds.'),
            PI('How many minutes is that altogether?'),
          ],
          [
            opt('20 minutes', [PI('Yes. 3 + 2 = 5 minutes a round, and 4 rounds of 5 make 20.', 'happy')], true),
            opt('9 minutes', [
              PI('That adds 3, 2 and 4. But the 4 is the number of rounds.'),
              PI('Each round is 3 + 2 = 5 minutes. Four rounds: 5, 10, 15, 20 minutes.'),
            ]),
            opt('12 minutes', [
              PI('That counts only the time in the fire: 4 × 3. Don’t forget the hammering!'),
              PI('Each round is 5 minutes, so 4 rounds make 20 minutes.'),
            ]),
          ],
          'Solved a two-step problem: (3 + 2) minutes a round × 4 rounds = 20 minutes.',
          '3.OA.D.8',
        ),
      ],
    ),
    scene(
      'q54-complete',
      [
        PI('A sword is not a thing you carry. In time, it becomes how you stand, how you breathe, how you choose.', 'soft'),
        PI('The same is true of friends. And of the little ones who follow you about. You will see.'),
        T('So… can I name it?'),
        PI('You may.'),
        T('Star Stabber.', 'happy'),
        PI('…You may also think about it for longer.'),
        N('Master Pian forges a smaller twin from the leftover sky-iron and lays it in your hands. It is lighter than it looks.'),
        N('Tuk throws his boomerang to celebrate. It comes back and taps him on the head.'),
        PI('It, too, is still learning.'),
      ],
      [
        ask(
          5,
          'literacy',
          'recognise alliteration',
          [
            N('“Star Stabber”: both words start with the same sound. That is called alliteration.'),
            N('Which of these names uses alliteration too?'),
          ],
          [
            opt('Midnight Moonblade', [T('Midnight Moonblade! Mmm. That’s even better. Don’t tell Pian.', 'happy')], true),
            opt('Dark Edge', [
              N('Say it out loud: Dark… Edge. Different first sounds.'),
              N('Midnight Moonblade has the same “m” sound at the start of both words. That’s alliteration.'),
            ]),
            opt('Night Blade', [
              N('Night… Blade. Different first sounds, “n” and “b”.'),
              N('Midnight Moonblade starts both words with “m”. That’s alliteration.'),
            ]),
          ],
          'Recognised alliteration: words close together that start with the same sound.',
          'RL.2.4',
        ),
      ],
    ),
  ],
  glossary: [
    gloss('courtyard', 'An open space with walls or buildings all round it.', 'q54-lessons'),
    gloss('ripples', 'Small waves that spread out in rings across water.', 'q54-lessons-done'),
    gloss('meteor', 'A space rock that burns up as it rushes through the air, making a streak of light.', 'q54-meteor'),
    gloss('meteorite', 'A space rock that has fallen all the way to the ground.', 'q54-meteor'),
    gloss('forge', 'A blacksmith’s fire for heating metal, or to shape hot metal by hammering it.', 'q54-meteor-done'),
    gloss('alliteration', 'When words close together start with the same sound.', 'q54-complete'),
  ],
  notes:
    'Lessons: planning as a strength, counted breathing (do), raking ripple lines (do), meteors and meteorites, a think ' +
    'question on keeping a mistake, hot metal and glow colours, (3 + 2) × 4 minutes, and alliteration in “Star Stabber”. ' +
    'No claim is made about how warm a real meteorite is when it lands.',
};

// ================================================================== Q55 The Ember Bay Players
const Q55: EduQuest = {
  id: 'reader:q55',
  of: 'q55',
  band: 'reader',
  title: 'The Ember Bay Players',
  goals: {
    'q55-s1': {
      goal: 'Watch the first act of the Ember Bay Players’ show.',
      hint: 'Just sit through it. Tap to munch a peanut whenever it gets too silly.',
    },
    'q55-s2': {
      goal: 'Watch the finale, and show the Players what you think of it.',
      hint: 'What you choose changes how the Players greet you the next time you visit the beach.',
    },
  },
  scenes: [
    // ------------------------------------------------ step 1: act one
    scene(
      'q55-act1',
      [
        N('A painted curtain flaps on the beach stage. The sign reads: THE AMAZING ADVENTURES OF THE KEEPER AND FRIENDS.'),
        T('A play about us! Finally, the recognition I deserve.', 'happy'),
        B('I can’t see the stage. I’m going to enjoy this more than any of you.'),
        N('The curtain rises. An actor in an orange robe cartwheels three times and falls into the band.'),
        PL('I am Pemba! I love fun! And also… fun!', 'happy'),
        P('Is that what I’m like?', 'sad'),
        N('An actor playing Tuk comes on. Every single line is a joke about meat. The audience roars.'),
        T('I have depth! I have range! I once made a whole plan with diagrams!', 'angry'),
        N('Then a huge, sweaty actor playing Bao strides out, flexing. He has a beard.'),
        B('Oh, I love him. Ten out of ten. No notes.', 'happy'),
      ],
      [
        notice(
          2,
          'science',
          'people use all their senses to notice the world',
          [
            B('People think I miss out at plays. I don’t. I listen.'),
            B('I hear the boards creak when someone runs on. I hear the crowd breathe in before a joke. I feel the drums through the sand.'),
            N('People who are blind often notice things through hearing and touch that other people miss.'),
          ],
          'Learned that our senses of hearing and touch carry lots of information, and that blind people often use them skilfully.',
          '4-LS1-2',
        ),
        ask(
          7,
          'literacy',
          'compare how different people see the same character',
          [
            N('The play shows Tuk as a boy who only thinks about meat. Tuk says he has “depth”.'),
            N('Why might the Players see Tuk so differently from how he sees himself?'),
          ],
          [
            opt('They only know a little about him, so they made him simple and funny.', [
              N('Yes. The Players see Tuk from the outside. Tuk knows his own plans, worries and hopes.'),
              N('Same boy, two points of view.'),
            ], true),
            opt('Because Tuk really only thinks about meat.', [
              T('HEY.', 'angry'),
              N('Tuk does love meat! But he also plans, worries and cares. The Players only see the outside of him.'),
            ]),
            opt('Because actors don’t like Tuk.', [
              N('They probably don’t know him at all! That’s the point.'),
              N('They only see a little bit of Tuk from the outside, so they made him simple and funny.'),
            ]),
          ],
          'Compared how a character sees himself with how others see him (two points of view).',
          'RL.3.6',
        ),
      ],
    ),
    scene(
      'q55-act1-done',
      [
        N('The interval bell rings. Kaito hasn’t blinked in twenty minutes.'),
        Z('They gave me a ponytail made of a mop.', 'shock'),
        Z('And I was the villain. They had me shouting at the sea for a whole scene.'),
        Z('…It’s fair. That is how I was. It just isn’t how I am.', 'think'),
        B('Look at that. Growth. Gross. Pass the peanuts.', 'happy'),
        P('I think you’ve changed the most out of all of us, Kaito.', 'soft'),
      ],
      [
        ask(
          3,
          'literacy',
          'understand how a character has changed',
          [N('Kaito says, “That is how I was. It just isn’t how I am.” What does he mean?')],
          [
            opt('He used to make bad choices, but he has changed.', [
              N('Yes. The play shows old Kaito. The real Kaito has grown, and he knows it.'),
            ], true),
            opt('He’s cross with the actors.', [
              N('He was shocked about the mop! But then he says “It’s fair.”'),
              N('He means he used to be like that, but he has changed.'),
            ]),
            opt('He doesn’t remember being the villain.', [
              N('He remembers. That’s why he says “it’s fair”.'),
              N('He means he used to make bad choices, but he’s different now.'),
            ]),
          ],
          'Explained how a character has changed over time, using his own words as evidence.',
          'RL.3.3',
        ),
      ],
    ),
    // ------------------------------------------------ step 2: the finale
    scene(
      'q55-finale',
      [
        N('In the second act, an actor in a very shiny cape appears with a sign that says THE KEEPER. That’s you.'),
        PL('Fear not, friends! The Keeper is here, and I have brought… my eight hundred Nubbins!'),
        N('The eight hundred Nubbins are socks on sticks. One falls off and rolls into the sand.'),
        Z('That’s… honestly how you look when you walk in with the Nubbins. A bit less socky.'),
        N('The finale begins. The Keeper slips on a banana skin and the villain wins. The curtain starts to fall.'),
        T('THEY CAN’T END IT LIKE THAT.', 'shock'),
        B('Your move, Keeper.'),
      ],
      [
        ask(
          2,
          'maths',
          'divide by sharing into equal pairs',
          [
            N('Really there are only 40 sock Nubbins, not eight hundred. Socks come in pairs.'),
            N('How many pairs of socks did the Players use?'),
          ],
          [
            opt('20 pairs', [N('Yes. 40 ÷ 2 = 20. Twenty pairs of socks, and twenty very cold pairs of feet.')], true),
            opt('80 pairs', [
              N('That doubles 40. But each pair holds 2 socks, so we halve 40 instead.'),
              N('40 ÷ 2 = 20 pairs.'),
            ]),
            opt('38 pairs', [
              N('That takes 2 away from 40. Instead, put the socks into twos: how many twos make 40?'),
              N('Twenty. 40 ÷ 2 = 20 pairs.'),
            ]),
          ],
          'Divided 40 socks into pairs to find 20 pairs.',
          '3.OA.A.3',
        ),
        ask(
          6,
          'sel',
          'think about fair and kind ways to give an honest opinion',
          [
            N('The ending is terrible. But the Players did try very hard.'),
            N('What’s a fair way to show what you think of a show you didn’t like?'),
          ],
          [
            opt('Be honest but kind: clap for the hard work, and say what could be better.', [
              B('Ooh, a critic with manners. Rare.', 'happy'),
            ]),
            opt('Boo! A bad ending deserves boos.', [
              B('Ha! Booing is honest, I’ll give you that.'),
              B('Just remember there are real people under those socks, and they tried their best.'),
            ]),
            opt('Cheer anyway, so they feel happy.', [
              Z('That’s kind. Though if nobody ever tells them, the ending might never get better.', 'think'),
            ]),
          ],
          'Thought about how to be both honest and kind when giving an opinion on someone’s work.',
          'CASEL: Responsible decision-making',
        ),
      ],
      [
        ch(
          'boo',
          'Boo loudly',
          [
            N('You boo. The whole audience joins in, then starts booing each other. The Players bow anyway.'),
            PL('Thank you! The passion! We feed on it!', 'happy'),
          ],
          { 'q55-reaction': 'boo' },
        ),
        ch(
          'cheer',
          'Cheer anyway',
          [
            N('You cheer. The actors look stunned, then delighted. The sock Nubbins take a bow.'),
            PL('A fan! We have a fan!', 'happy'),
          ],
          { 'q55-reaction': 'cheer' },
        ),
        ch(
          'storm',
          'Storm the stage and fix the ending',
          [
            N('You climb up, rescue the fallen sock Nubbin and help the Keeper actor to his feet. The crowd goes wild.'),
            PL('This is improvised theatre now! Everybody, improvise!', 'shock'),
          ],
          { 'q55-reaction': 'storm' },
        ),
      ],
    ),
    scene(
      'q55-finale-done',
      [
        N('The curtain falls for the last time. Up and down the beach, people are arguing about it.'),
        Z('You know what? I’m glad we came.', 'soft'),
        T('I’m not. I’m writing a letter.'),
        B('I’m writing a fan letter. To the big guy with the beard. He gets me.', 'happy'),
        P('I’m still not sure if I’m “fun, and also fun”.', 'think'),
        N('Same play, same seats, same peanuts. Four friends, four completely different opinions.'),
      ],
      [
        ask(
          5,
          'literacy',
          'compare different characters’ points of view on the same event',
          [N('Who liked the play the most?')],
          [
            opt('Bao', [
              N('Yes! Bao is writing a fan letter. Tuk is writing a cross one. Kaito is glad he came, and Pemba isn’t sure.'),
              N('One play, four points of view. What’s yours?'),
            ], true),
            opt('Tuk', [
              N('Tuk is writing an angry letter! He liked it least.'),
              N('Bao is writing a fan letter, so Bao liked it most. One play, four points of view.'),
            ]),
            opt('Kaito', [
              N('Kaito is glad he came. But Bao is writing a fan letter, so Bao liked it most.'),
              N('One play, four points of view.'),
            ]),
          ],
          'Compared four characters’ points of view on the same play, and considered their own.',
          'RL.3.6',
        ),
      ],
    ),
    scene(
      'q55-complete',
      [
        N('Afterwards, the lead player hands out programmes at the stage door, still in his shiny cape.'),
        PL('Take a mask or two! For the memories! We do the same show next week, only longer.', 'happy'),
        B('Longer. Wonderful. I’m coming every week.'),
        P('Do you think they’ll ever do one where we win?'),
        Z('If they did, I don’t think anyone would believe it.', 'think'),
        N('You go home with two theatre masks, one smiling and one frowning, and a playbill with your name spelt wrong.'),
      ],
      [
        notice(
          5,
          'art',
          'the history of theatre masks',
          [
            N('Theatre masks are very old. In ancient Greece, more than two thousand years ago, actors wore masks on stage.'),
            N('Today a smiling mask and a frowning mask together stand for theatre: one for comedy, which is funny, and one for tragedy, which is sad.'),
          ],
          'Learned that actors in ancient Greece wore masks, and that the comedy and tragedy masks are a symbol of theatre.',
          'D2.His.2.K-2',
        ),
      ],
    ),
  ],
  glossary: [
    gloss('recognition', 'Being noticed and praised for what you’ve done.', 'q55-act1'),
    gloss('depth', 'Having much more to you than people notice at first.', 'q55-act1'),
    gloss('interval', 'A short break in the middle of a play or show.', 'q55-act1-done'),
    gloss('villain', 'The bad character in a story.', 'q55-act1-done'),
    gloss('improvise', 'To make something up on the spot, without planning it first.', 'q55-finale'),
    gloss('opinion', 'What someone thinks or feels about something.', 'q55-finale-done'),
    gloss('comedy', 'A funny play or story.', 'q55-complete'),
    gloss('tragedy', 'A sad play or story.', 'q55-complete'),
  ],
  notes:
    'Lessons: hearing and touch (Bao), how the Players see Tuk versus how he sees himself (RL.3.6), how Kaito has ' +
    'changed, 40 socks ÷ 2, a think question on honest-but-kind criticism, four points of view on one play, and ' +
    'comedy and tragedy masks.',
};

// ================================================================== exports
export const EDU_AVATAR_1_READER: EduQuest[] = [Q46, Q47, Q48, Q49, Q50, Q51, Q52, Q53, Q54, Q55];

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  // Q46
  'edu:place:stones:low',
  // Q47
  'edu:clap:beat:under-the-hill',
  // Q49
  'edu:clap:beat:4-count',
  // Q51
  'edu:sort:water-savers',
  // Q53
  'edu:paint:face:mirror-half',
  // Q54
  'edu:breathe:count-4',
  'edu:draw:ripple-lines',
];
