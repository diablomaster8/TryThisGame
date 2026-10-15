/**
 * The Learning Grove: sprout band (ages 3–6, read aloud) versions of the Avatar fun quests
 * Q46–Q65 (quests-avatar.ts). See EDU-STYLE.md.
 *
 * - One EduScene per original scene (every step scene, every done scene, every complete scene).
 * - Choice ids and flags are kept. Unkind or unsafe choices are left out, with `defaultChoice`:
 *   q51-desert ('sip' → 'cup'), q53-flattened ('laugh' → 'help'), q55-finale ('boo' → 'cheer'),
 *   q59-chase ('cause' → 'wrong').
 * - The approved quotes from the show never appear here; all lines are original. Kaito's
 *   adapted greeting in Q64 is also rewritten.
 * - The elements run through the pack: water (ice, steam, mist, rain, rivers), earth (rocks,
 *   boulders, canyons, volcanoes), fire (heat, hot drinks, hot metal) and air (wind, clouds).
 */
import type { EduDomain, EduQuest, EduScene, Lesson, LessonOption } from './types';
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
const M = say('lumi');
const C = say('cabbage-merchant');
const BU = say('rumbold');
const S = say('sumi');
const PI = say('pian');
const W = say('aunt-wen');
const PL = say('ember-bay-players');
const J = say('juno');
const MA = say('maud');
const BR = say('brack');
const H = say('headmaster');
const R = say('rin');
const PE = say('mr-pell');
const G = say('gorro');
const SL = say('big-slab');
const RE = say('ma-reedy');
const CH = say('captain-hake');
const TI = say('mayor-tibbs');

type LessonDraft = Omit<Lesson, 'id'>;

const scene = (
  of: string,
  lines: Line[],
  lessons: LessonDraft[],
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

const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice =>
  set ? { id, label, set, then } : { id, label, then };

const opt = (label: string, reply: Line[], best?: boolean): LessonOption =>
  best ? { label, best: true, reply } : { label, reply };

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

// ------------------------------------------------------------------ Q46
const Q46: EduQuest = {
  id: 'sprout:q46',
  of: 'q46',
  band: 'sprout',
  title: 'Not the Cabbages!',
  goals: {
    'q46-s1': {
      goal: 'Find the 8 cabbages. Help fix the wheel.',
      hint: 'Cabbages roll downhill. Look by the stream and under the bushes.',
    },
    'q46-s2': {
      goal: 'Shake the big tree. Then fix the cart.',
      hint: 'Tap the tree until nothing else falls. Planks and rope are in the shed.',
    },
    'q46-s3': {
      goal: 'Build a cart that cannot tip over.',
      hint: 'Make it low and wide. Tuk’s drawing is in your journal.',
    },
  },
  scenes: [
    scene(
      'q46-crash',
      [
        N('Creak, creak! A cart comes up the path.'),
        N('It is full of round, green cabbages.'),
        C('Hello! Crunchy cabbages! Lovely cabbages! Cabbages for everyone!', 'happy'),
        N('Here comes a Nubbin. It is racing. Zoom!'),
        N('It does not look where it is going. Bump!'),
        N('The cart tips over. Wobble, wobble, CRASH!'),
        C('Oh no! Not the cabbages! Not again!', 'shock'),
        N('The cabbages roll away down the hill. Roll, roll, roll!'),
        C('And the wheel came off. Oh dear.', 'sad'),
      ],
      [
        ask(
          7,
          'science',
          'round things roll',
          [C('Which one rolls away: a round cabbage or a square box?', 'think'), N('(Point to the round cabbages.)')],
          [
            opt('The round cabbage', [C('Yes! Round things roll. Boxes sit still.', 'happy')], true),
            opt('The square box', [
              N('A box has flat sides. It sits still.'),
              C('The round cabbage rolls away. Round things roll!'),
            ]),
          ],
          'Your child compared shapes and found that round things roll and flat-sided things stay put.',
          'ELOF: Scientific Reasoning',
        ),
      ],
      [
        ch('sorry', 'Say sorry for your Nubbin', [
          Y('Sorry! My Nubbin is still learning to look.'),
          C('Thank you. A sorry helps a lot.', 'happy'),
        ]),
        ch('buy', 'Offer to buy the bumpy ones', [C('Bumpy cabbages are still yummy cabbages!', 'happy')], {
          'q46-bought-dented': true,
        }),
        ch('track', 'Point to the race track sign', [
          Y('Look. This is the race track.'),
          C('Oh! There is a sign. I am standing on it.'),
        ]),
      ],
    ),
    scene(
      'q46-crash-done',
      [
        N('You find the cabbages by the stream and under the bushes.'),
        N('You put the wheel back on. Click!'),
        C('Every single one! A bit muddy. That’s fine!', 'happy'),
        C('Thank you for helping me.', 'soft'),
      ],
      [
        act(
          1,
          'maths',
          'count to 8',
          'edu:count:cabbages:8',
          [
            C('Let’s count them back into the cart.'),
            N('(Count together on your fingers, one to eight.)'),
            C('One, two, three, four, five, six, seven, eight!', 'happy'),
          ],
          'Your child counted eight cabbages, one for each number.',
          'K.CC.B.5',
        ),
      ],
    ),
    scene(
      'q46-fruit',
      [
        N('The man parks his cart under a big tree.'),
        C('Nice and shady. Nothing can go wrong here.'),
        N('The wind blows. Swish, swish, go the leaves.'),
        N('Up high, a big fruit wobbles on its stalk.'),
        C('Is that tree looking at me?', 'think'),
        N('The fruit drops. Down, down, down. SPLAT!'),
        N('It lands on the cart. The cart folds in half.'),
        C('Oh dear. I need planks and rope, please.', 'sad'),
        C('And someone to shake that tree first!'),
      ],
      [
        ask(
          4,
          'science',
          'things fall down',
          [C('If that fruit falls, which way will it go?')],
          [
            opt('Down', [N('Yes! Things fall down to the ground.')], true),
            opt('Up', [N('Let’s drop a leaf and watch.'), N('Down it goes! Things always fall down.')]),
          ],
          'Your child predicted that things fall down to the ground.',
          'ELOF: Scientific Reasoning',
        ),
      ],
    ),
    scene(
      'q46-fruit-done',
      [
        C('Good as new! Better than new!', 'happy'),
        C('Now I will park in the middle of the meadow.'),
        N('High up, a bird looks down. Hmm.'),
        N('There is one big fruit. There are two Nubbins.'),
        N('Both Nubbins want the fruit.'),
        N('They share it. Munch, munch. Everyone is happy.'),
      ],
      [
        ask(
          4,
          'sel',
          'sharing',
          [N('What can the Nubbins do?'), N('(Wait for an answer.)')],
          [
            opt('Share it', [N('Yes! Half for you, half for me. Sharing is kind.')], true),
            opt('Grab it', [N('Grabbing makes someone sad.'), N('Let’s share it, half each. That feels better!')]),
          ],
          'Your child thought about how two friends can share one thing.',
          'CASEL: Relationship skills',
        ),
      ],
    ),
    scene(
      'q46-glider',
      [
        N('Look up! A boy flies by on a wooden glider. Whoosh!'),
        P('Hi! Hello! Is that a cabbage cart? I love cabbages!', 'happy'),
        N('He waves. The glider dips. Uh-oh.'),
        N('Pemba lands. He bounces into the cart. CRASH!'),
        C('Oh, my poor leafy darlings! Not again!', 'shock'),
        P('Oh no. That was me. I’m Pemba. I’m so sorry.', 'sad'),
        P('Can I help you fix it?'),
        T('Hi. I’m Tuk. I make plans. With drawings!', 'happy'),
        C('Three crashes today! I need a cart that cannot tip.', 'think'),
        T('Then let’s build one!'),
      ],
      [
        notice(
          6,
          'sel',
          'saying sorry',
          [
            N('Pemba said sorry. Then he asked to help.'),
            N('That is a really good sorry.'),
            N('(Ask: when did you last say sorry?)'),
          ],
          'Your child heard what a good sorry sounds like: say sorry, then offer to help.',
          'CASEL: Relationship skills',
        ),
      ],
      [
        ch('wide', 'Make it wide', [T('Wide, like a duck sitting down. Ducks don’t tip!')], { 'q46-cart': 'wide' }),
        ch('low', 'Make it low', [T('Low and heavy at the bottom. Hard to knock over!')], { 'q46-cart': 'low' }),
        ch(
          'bell',
          'Give it a bell',
          [C('A bell! Ding-ding! They will hear me coming!', 'happy'), T('And we’ll make it low and wide too.')],
          { 'q46-cart': 'bell' },
        ),
      ],
    ),
    scene(
      'q46-glider-done',
      [
        N('You build the new cart with Tuk.'),
        N('It sits low and wide, like a duck sitting down.'),
        P('Can I test it? Please, please, please?', 'happy'),
        T('Go on, then. Push it!'),
      ],
      [
        ask(
          1,
          'science',
          'low, wide things are steady',
          [T('Which cart is harder to tip over?'), N('(Hold up a hand tall and thin. Now lay it flat.)')],
          [
            opt('Low and wide', [T('Yes! Low and wide stays put. Like a duck.', 'happy')], true),
            opt('Tall and thin', [T('Tall and thin wobbles and tips.'), T('Low and wide stays put!')]),
          ],
          'Your child learned that a low, wide base is steadier than a tall, thin one.',
          'ELOF: Scientific Reasoning',
        ),
      ],
    ),
    scene(
      'q46-complete',
      [
        N('Pemba runs at the new cart. Run, run, JUMP!'),
        N('Boing! He bounces off. The cart does not move.'),
        C('It stays up! It stays up! Hooray!', 'happy'),
        P('Do you get sad when your cabbages fall?'),
        C('Yes. But someone always stops to help.', 'soft'),
        C('That is how I make new friends.', 'soft'),
        C('Please keep my old cart. Grow cabbages in it!'),
        P('And do the cry! Not the cabbages!', 'happy'),
      ],
      [
        ask(
          2,
          'literacy',
          'first sounds',
          [C('Cabbage starts with C. C-c-cabbage!'), C('What else starts like that?')],
          [
            opt('Cart', [C('Yes! C-c-cart! Cabbage and cart!', 'happy')], true),
            opt('Pemba', [P('Pemba starts with P. P-p-Pemba!'), C('Cart starts like cabbage. C-c-cart!')]),
          ],
          'Your child listened for the first sound in “cabbage” and “cart”.',
          'RF.K.2',
        ),
      ],
    ),
  ],
};

// ------------------------------------------------------------------ Q47
const Q47: EduQuest = {
  id: 'sprout:q47',
  of: 'q47',
  band: 'sprout',
  title: 'The Crystal Tunnel',
  goals: {
    'q47-s1': {
      goal: 'Follow the singers into the tunnel.',
      hint: 'The tunnel is behind the waterfall. Bring a Nubbin friend.',
    },
    'q47-s2': {
      goal: 'Find the way out. Keep your Nubbin beside you.',
      hint: 'If your Nubbin goes too far, the light goes out. Call it back.',
    },
  },
  scenes: [
    scene(
      'q47-nomads',
      [
        N('A painted wagon comes along. Jingle, jingle!'),
        J('Hello, friends! I’m Juno. We go where the wind goes.', 'happy'),
        J('Today the wind goes under that hill!'),
        T('But there’s a path over the hill.'),
        J('The path has a grumpy goat on it.'),
        J('♪ Under the hill, under the hill,'),
        J('♪ The rocks are cold and the bats keep still.'),
        J('♪ Doo-be-doo, the moss is blue,'),
        J('♪ Under the hill with you!', 'happy'),
        N('Pemba hums it. Your Nubbin hums it. Hum, hum!'),
      ],
      [
        ask(
          8,
          'literacy',
          'rhymes',
          [J('Blue and you sound the same at the end.'), J('What else rhymes with blue?')],
          [
            opt('Doo', [J('Yes! Blue, you, doo. They rhyme!', 'happy')], true),
            opt('Hat', [J('Hat and blue sound different.'), J('Blue, doo! Those rhyme. Doo-be-doo!')]),
          ],
          'Your child listened for rhyming words in a silly song.',
          'RF.K.2',
        ),
      ],
      [
        ch('sing', 'Sing the doo-be-doo', [J('What a good singer! The moss loves it.', 'happy')], { 'q47-sang': true }),
        ch('long', 'Ask how long the tunnel is', [
          J('Long enough for fun. Short enough to get out.'),
          T('I hope so!'),
        ]),
        ch('goat', 'Ask about the goat', [J('He nibbled my lute once. Nibble, nibble!', 'sad')]),
      ],
    ),
    scene(
      'q47-nomads-done',
      [
        N('In you go. The tunnel gets dark.'),
        N('Tuk’s torch flickers. Flicker, flicker. Then it goes out.'),
        T('Oh no. Now I can’t see a thing!', 'shock'),
        J('Hmm. This part of the song isn’t written yet.'),
      ],
      [
        ask(
          2,
          'science',
          'we need light to see',
          [T('Why can’t we see anything?')],
          [
            opt('There’s no light', [T('Yes. We need light to see.'), T('No light, no seeing!')], true),
            opt('Our eyes are shut', [
              N('Open your eyes wide. Still dark!'),
              T('We need light to see. The torch went out.'),
            ]),
          ],
          'Your child learned that we need light to see things.',
          '1-PS4-2',
        ),
      ],
    ),
    scene(
      'q47-crystals',
      [
        N('It is very dark. Drip, drip, goes the water.'),
        N('Flap, flap! Some bats fly by.'),
        K('Everyone stay close.'),
        N('Your Nubbin snuggles next to you. The wall glows green!'),
        N('Step apart. The glow goes out. Step together. It glows!'),
        K('The crystals glow when friends stay close!', 'shock'),
        T('Um. I have to tell you something. I’m scared of the dark.'),
        J('That was brave to say.', 'soft'),
      ],
      [
        act(
          4,
          'maths',
          'position: beside',
          'edu:place:nubbin:beside',
          [
            K('Keep your Nubbin beside you. Right next to you.'),
            N('(Tap your Nubbin. Move it beside you.)'),
            N('Beside you, it glows!'),
          ],
          'Your child practised the position word “beside”.',
          'K.G.A.1',
        ),
        ask(
          7,
          'sel',
          'what helps when we are scared',
          [T('What can help me feel less scared?')],
          [
            opt('Hold a friend’s hand', [T('Oh. That does help. Thank you.', 'soft')], true),
            opt('Run away fast', [
              K('Running in the dark could make you bump.'),
              K('Holding hands helps more. Here, take mine.', 'soft'),
            ]),
          ],
          'Your child named a feeling (scared) and something that helps (a friend’s hand).',
          'CASEL: Self-awareness',
        ),
      ],
      [
        ch('carry', 'Pick up your Nubbin', [N('You hug your Nubbin close. The whole wall lights up!')]),
        ch('paw', 'Hold its paw', [N('Your Nubbin holds your finger. The crystals glow green.')]),
        ch('tuk', 'Tuk holds Pemba’s hand', [T('Okay. Just this once.'), P('I like holding hands!', 'happy')], {
          'q47-tuk-pemba': true,
        }),
      ],
    ),
    scene(
      'q47-crystals-done',
      [
        N('Look! A crack of light. Squeeze through!'),
        N('You come out into the warm air. Blink, blink.'),
        J('See? We made it out!', 'happy'),
        T('Bye, cave. Bye, bats.'),
      ],
      [
        notice(
          3,
          'science',
          'animal homes: bats',
          [
            J('Lots of bats live in caves like that.'),
            J('They sleep in the day, hanging upside down.'),
            J('At night, they wake up and fly out.'),
          ],
          'Your child heard that many bats live in caves and come out at night.',
          'K-ESS3-1',
        ),
      ],
    ),
    scene(
      'q47-complete',
      [
        N('The singers wave goodbye. Doo-be-doo!'),
        K('Here. Some little crystals for you.', 'soft'),
        N('They glow when two friends sit close.'),
        T('And now there’s a cave path in your Grove.'),
        P('You hummed the whole way, Tuk!', 'happy'),
        T('I hummed to be brave.'),
        J('The dark is not so scary with a friend!', 'happy'),
      ],
      [
        act(
          2,
          'maths',
          'count to 5',
          'edu:count:crystals:5',
          [
            K('How many crystals? Let’s count.'),
            N('(Point and count together, one to five.)'),
            K('One, two, three, four, five crystals!', 'happy'),
          ],
          'Your child counted five crystals, touching each one once.',
          'K.CC.B.5',
        ),
      ],
    ),
  ],
};

// ------------------------------------------------------------------ Q48
const Q48: EduQuest = {
  id: 'sprout:q48',
  of: 'q48',
  band: 'sprout',
  title: 'The Great Divide',
  goals: {
    'q48-s1': {
      goal: 'Lead both groups down the canyon. No fighting!',
      hint: 'Walk in the middle. Stop for a rest when they get grumpy.',
    },
    'q48-s2': {
      goal: 'Don’t laugh! Keep a straight face for Pemba’s story.',
      hint: 'Tap when the giggle meter is green. Don’t look at your Nubbin!',
    },
  },
  scenes: [
    scene(
      'q48-canyon',
      [
        N('Two groups stand at the top of a big canyon.'),
        N('They frown at each other. Hmph!'),
        MA('We are the Hollins. We go first!'),
        BR('We are the Drays. WE go first!', 'angry'),
        T('Their guide went home. Who will lead them down?'),
        P('Me! It’s just walking downhill!', 'happy'),
        K('Both groups want to go first. Hmm.', 'think'),
      ],
      [
        ask(
          6,
          'social-studies',
          'taking turns is fair',
          [K('What is a fair way to choose?')],
          [
            opt('Take turns', [K('Yes! One group now, the other next time.')], true),
            opt('The loudest goes first', [
              K('Then quiet people never get a turn.'),
              K('Taking turns is fair.'),
            ]),
          ],
          'Your child thought about fairness and taking turns.',
          'D2.Civ.8.K-2',
        ),
      ],
      [
        ch('hollins', 'Hollins go first', [BR('Drays next time, then!'), N('The Drays follow. Stomp, stomp.')], {
          'q48-first': 'hollins',
        }),
        ch('drays', 'Drays go first', [MA('Hollins next time, then.'), N('The Hollins follow. Sniff, sniff.')], {
          'q48-first': 'drays',
        }),
        ch(
          'together',
          'Walk side by side',
          [MA('Hmph!'), BR('Hmph!'), N('But they walk side by side. The path is narrow!')],
          { 'q48-first': 'together' },
        ),
      ],
    ),
    scene(
      'q48-canyon-done',
      [
        N('Down, down, down you go. Now you are at the bottom.'),
        T('Nobody pushed anybody. Hooray!'),
        MA('Hollins sleep on the left.'),
        BR('Drays sleep on the left of the left!', 'angry'),
        K('That’s the same place, silly. You’re all together.'),
      ],
      [
        notice(
          0,
          'science',
          'how canyons form',
          [
            K('Look how deep this canyon is!'),
            K('A river made it. The water cut the rock, bit by bit.'),
            K('It took a very, very long time.'),
          ],
          'Your child heard that rivers slowly cut deep canyons into rock.',
          '2-ESS1-1',
        ),
      ],
    ),
    scene(
      'q48-story',
      [
        N('Night. Everyone sits by the campfire.'),
        N('Two children reach for the last dumpling.'),
        N('Grab! Pull! Oh no, a food fight!'),
        MA('Your great-great-grandpa took our ball!', 'angry'),
        BR('Your great-great-grandma kicked it in the river!', 'angry'),
        P('Wait! I know a story about them!'),
        P('They were twins! They played ball together.', 'happy'),
        P('They laughed so hard, the canyon cracked open!', 'happy'),
        N('Pemba looks at you. Don’t laugh! Keep a straight face!'),
      ],
      [
        ask(
          2,
          'maths',
          'halves: one thing into two equal parts',
          [K('Oh dear. One dumpling, two children.'), K('How could they both have some?')],
          [
            opt(
              'Cut it in half',
              [K('Yes! Two halves. One for each.'), N('(Draw a circle in the air. Cut it down the middle.)')],
              true,
            ),
            opt('Throw it', [K('Then nobody gets any!'), K('Cut it in half. Two halves, one each.')]),
          ],
          'Your child learned that cutting one thing into two equal halves lets two people share.',
          '1.G.A.3',
        ),
      ],
      [
        ch('detail', 'Add: “They both sang badly!”', [BR('Drays sing badly!', 'shock'), MA('So do Hollins!', 'shock')], {
          'q48-story': 'detail',
        }),
        ch('nod', 'Nod slowly', [N('You nod. You don’t laugh. Well done!')], { 'q48-story': 'nod' }),
        ch('cough', 'Cough to hide a giggle', [N('Cough, cough! Pemba coughs too. Phew!')], { 'q48-story': 'cough' }),
      ],
    ),
    scene(
      'q48-story-done',
      [
        MA('Twins! All this time.', 'soft'),
        BR('Pass the dumplings, cousin.', 'soft'),
        K('(whispering) Pemba, that story isn’t true.'),
        P('(whispering) But look. They’re sharing a blanket.'),
      ],
      [
        ask(
          3,
          'literacy',
          'real or make-believe',
          [K('Can laughing really crack a canyon?')],
          [
            opt('No, that’s pretend', [K('Right. It’s a make-believe story.'), K('Make-believe is fun. It’s good to say so.')], true),
            opt('Yes', [K('Laughing is fun. But it can’t crack rock.'), K('That part is make-believe.')]),
          ],
          'Your child told the difference between something real and something make-believe.',
          'ELOF: Literacy',
        ),
      ],
      [
        ch(
          'q48-tell',
          'Tell them it was pretend',
          [MA('We guessed! But it’s a lovely story.'), BR('We’ll keep it anyway.', 'soft')],
          { 'q48-truth': 'told' },
        ),
        ch(
          'q48-keep',
          'Keep Pemba’s secret',
          [K('Okay. But you’ll tell them one day, Pemba.'), P('I promise. After the dumplings.', 'soft')],
          { 'q48-truth': 'kept' },
        ),
      ],
    ),
    scene(
      'q48-complete',
      [
        N('In the morning, both groups climb out together.'),
        N('They talk and laugh. Which twin was taller?'),
        P('Look! They’re sharing socks now!', 'happy'),
        N('Chief Brack wears socks. He looks surprised. He likes them.'),
        MA('Thank you, guide. Here is a hat for you.'),
        MA('And we’ll build a bridge. No more fighting!'),
        N('By night, a rope bridge swings over the canyon.'),
      ],
      [
        ask(
          3,
          'sel',
          'making up after a fight',
          [K('The groups were cross. Now they are friends.'), K('How can we make up after a fight?')],
          [
            opt('Say sorry and share', [K('Yes! Sorry, then share. Like the socks!', 'happy')], true),
            opt('Stay cross forever', [K('Staying cross feels heavy.'), K('Saying sorry and sharing feels better.')]),
          ],
          'Your child thought about ways to make up after falling out.',
          'CASEL: Relationship skills',
        ),
      ],
    ),
  ],
};

// ------------------------------------------------------------------ Q49
const Q49: EduQuest = {
  id: 'sprout:q49',
  of: 'q49',
  band: 'sprout',
  title: 'The Secret Dance Party',
  goals: {
    'q49-s1': {
      goal: 'Give out 5 secret party notes. Don’t get caught!',
      hint: 'Wait until the headmaster looks at the board.',
    },
    'q49-s2': {
      goal: 'Keep the party going! Tap on the beat.',
      hint: 'Tap when the drum ring closes. Stomp, clap, stomp, clap!',
    },
  },
  scenes: [
    scene(
      'q49-school',
      [
        N('Ding, ding! The school bell rings.'),
        N('The children sit very still. Nobody smiles.'),
        Z('I came to this school once. The rules are the same.'),
        Z('No running. No humming. No being too happy.', 'think'),
        N('A new boy comes in. He has a red headband.'),
        P('Hi! I’m new! I’m, um, Kuzo!', 'happy'),
        H('In this school, we do not dance. We do not sing.', 'angry'),
        R('(whispering) What is dancing?', 'soft'),
        P('Oh! Then we will have a party!', 'shock'),
      ],
      [
        ask(
          6,
          'social-studies',
          'good rules keep us safe',
          [Z('Some rules help us. Which rule helps?')],
          [
            opt('“Walk inside, so nobody trips.”', [Z('Yes. That rule keeps us safe.')], true),
            opt('“Never, ever smile.”', [Z('That rule doesn’t help anyone.'), Z('Good rules keep us safe and kind.')]),
          ],
          'Your child thought about why we have rules and what makes a good one.',
          'D2.Civ.8.K-2',
        ),
      ],
      [
        ch('lunch', 'Hide notes in lunch boxes', [Z('Sneaky! I like it. Am I allowed to like it?')], {
          'q49-invite': 'lunch',
        }),
        ch('birds', 'Fold paper birds', [N('The paper birds fly over the headmaster. Swoosh!')], {
          'q49-invite': 'birds',
        }),
        ch('kaito', 'Kaito can hand them out', [Z('Hi. Party. Cave. Tonight. Shh. Bye.'), N('Everybody says yes!')], {
          'q49-invite': 'kaito',
        }),
      ],
    ),
    scene(
      'q49-school-done',
      [
        N('You pass the notes out, one at a time.'),
        R('A party in a cave? At night?', 'happy'),
        P('Yes! Bring your dancing feet!', 'happy'),
        N('The headmaster turns round. Everyone sits very still.'),
      ],
      [
        act(
          0,
          'maths',
          'count to 5',
          'edu:count:invites:5',
          [
            P('Five notes for five friends. Count with me!'),
            N('(Count on one hand together.)'),
            P('One, two, three, four, five!', 'happy'),
          ],
          'Your child counted five party notes on one hand.',
          'K.CC.B.4',
        ),
      ],
    ),
    scene(
      'q49-party',
      [
        N('The cave is full of children. They stand by the walls.'),
        N('Your Nubbins bang on buckets. Bang! Bang! Bang!'),
        P('Dancing is easy. Feel the beat!'),
        R('My feet feel shy.', 'shock'),
        Z('I don’t dance. I don’t think I can.'),
        P('Everyone can dance. Watch the Nubbins!', 'happy'),
        N('The Nubbins stomp and clap. The children copy them.'),
        Z('Am I doing it? I think I’m doing it!', 'think'),
      ],
      [
        act(
          6,
          'music',
          'keep a beat and copy a pattern',
          'edu:clap:pattern:stomp-clap',
          [
            P('Copy the Nubbins: stomp, clap, stomp, clap!'),
            N('(Stomp and clap together. Keep the beat.)'),
            P('What comes next? Stomp!', 'happy'),
          ],
          'Your child kept a steady beat and continued a stomp-clap pattern.',
          'ELOF: Perceptual, Motor, and Physical Development',
        ),
      ],
    ),
    scene(
      'q49-party-done',
      [
        N('Then the headmaster bursts in with a lantern.'),
        H('WHAT is going on here?', 'angry'),
        N('The buckets stop. Everyone freezes.'),
        N('Kaito slowly puts his arms down.'),
      ],
      [
        ask(
          2,
          'sel',
          'reading feelings on faces',
          [N('Look at the children’s faces. How do they feel?'), N('(Wait for an answer.)')],
          [
            opt('Worried', [N('Yes. They are worried. Their eyes are wide.')], true),
            opt('Sleepy', [N('Their eyes are wide open. Not sleepy!'), N('They feel worried. That’s okay to feel.')]),
          ],
          'Your child read other people’s faces to name a feeling.',
          'CASEL: Social awareness',
        ),
      ],
      [
        ch('q49-cover', 'Everyone dance in front of Pemba', [N('Everyone dances at once. Pemba slips out the back.')], {
          'q49-escape': 'cover',
        }),
        ch(
          'q49-kaito-speaks',
          'Let Kaito speak',
          [
            Z('Sir, I followed every rule here. I was sad.'),
            Z('Rules should help us. Not stop us being us.', 'soft'),
            H('Hmm. Ten more minutes. Then home.'),
            N('His foot taps along. Tap, tap. Pemba slips out.'),
          ],
          { 'q49-escape': 'kaito' },
        ),
        ch(
          'q49-ask-head',
          'Ask the headmaster to dance',
          [H('I will not!', 'angry'), N('But his shoulders wiggle, just a bit. Pemba slips out.')],
          { 'q49-escape': 'invite' },
        ),
      ],
    ),
    scene(
      'q49-complete',
      [
        N('Outside, under the stars, the children laugh and laugh.'),
        R('We danced! We really danced!', 'happy'),
        P('You were amazing. All of you!', 'happy'),
        P('You danced like shooting stars!', 'happy'),
        Z('I don’t know what that means. But thank you.', 'think'),
        N('Pemba ties the red headband round your wrist.'),
      ],
      [
        notice(
          1,
          'health',
          'moving makes your heart beat faster',
          [
            P('Put your hand on your chest.'),
            P('Feel that thump-thump? That’s your heart.'),
            P('Dancing makes it beat faster. Moving keeps it strong!', 'happy'),
          ],
          'Your child felt their heartbeat and heard that moving our bodies keeps our hearts strong.',
          'ELOF: Perceptual, Motor, and Physical Development',
        ),
      ],
    ),
  ],
};

// ------------------------------------------------------------------ Q50
const Q50: EduQuest = {
  id: 'sprout:q50',
  of: 'q50',
  band: 'sprout',
  title: 'Uncle Tenzo’s Tea Stall',
  goals: {
    'q50-s1': {
      goal: 'Make 3 perfect cups of tea.',
      hint: 'Lift the kettle when the steam curls. Count slowly while the leaves soak.',
    },
    'q50-s2': {
      goal: 'Give Mr Pell a cup of tea.',
      hint: 'Watch his face. A grumble means too hot. A sigh means just right.',
    },
  },
  scenes: [
    scene(
      'q50-open',
      [
        N('A little tea stall stands by the pond. The kettle sings.'),
        I('Welcome, Keeper! I used to be a general. Now I make tea.', 'happy'),
        Z('He got up at four o’clock. He painted the sign twice.'),
        I('Good tea is easy. Hot water. Then wait.', 'soft'),
        I('Not too short. Not too long. Just right.'),
        N('Your Nubbin sniffs the tea tins. Sniff, sniff. Achoo!'),
      ],
      [
        act(
          4,
          'maths',
          'count slowly to 5 to time something',
          'edu:count:steep:5',
          [
            I('The leaves are in. Now we wait and count.'),
            N('(Count slowly together, one to five.)'),
            I('One… two… three… four… five. Ready!', 'happy'),
          ],
          'Your child counted slowly to five to time the tea.',
          'ELOF: Mathematics Development',
        ),
      ],
      [
        ch('jasmine', 'Make jasmine tea first', [I('Lovely! Jasmine smells like flowers.', 'happy')], {
          'q50-first': 'jasmine',
        }),
        ch('ginger', 'Make ginger tea first', [I('Bold! Ginger tea is spicy.')], { 'q50-first': 'ginger' }),
        ch('kaito', 'Ask Kaito which tea he likes', [
          Z('I don’t really like tea.', 'think'),
          N('Uncle Tenzo gasps and holds the counter. Oh no!'),
        ]),
      ],
    ),
    scene(
      'q50-open-done',
      [
        I('Three perfect cups! My heart is warm.', 'happy'),
        Z('You burnt your tongue again, Uncle.'),
        I('Ow. Yes. A little.'),
        I('I should have waited.', 'think'),
      ],
      [
        ask(
          2,
          'health',
          'hot drinks: blow and wait',
          [I('Tea is very hot. What should I do first?')],
          [
            opt('Blow on it and wait', [I('Yes! Blow, blow. Wait a bit. Then sip.', 'happy')], true),
            opt('Gulp it fast', [I('Ow! Hot drinks can hurt your mouth.'), I('Blow on it and wait. Much better.')]),
          ],
          'Your child learned to blow on a hot drink and wait before sipping.',
          'ELOF: Perceptual, Motor, and Physical Development',
        ),
      ],
    ),
    scene(
      'q50-grump',
      [
        N('Here comes the first customer. He looks very grumpy.'),
        PE('Tea. Not fancy. Not flowery. No talking.', 'angry'),
        I('Of course. Please sit down.', 'happy'),
        PE('The last tea I had tasted like old socks.'),
        Z('Then go back there!', 'angry'),
        I('Nephew. A grumpy guest just needs a kind welcome.'),
        Z('Is that a real saying?', 'think'),
        I('It is now.'),
      ],
      [
        ask(
          5,
          'sel',
          'understanding a grumpy face',
          [I('Why might Mr Pell be grumpy?')],
          [
            opt('He’s tired or sad', [I('Maybe. Grumpy faces can hide sad feelings.'), I('A kind hello can help.', 'soft')], true),
            opt('He hates everyone', [I('Hmm. Maybe he’s just having a hard day.'), I('A kind hello can help.', 'soft')]),
          ],
          'Your child thought about the feelings that can hide behind a grumpy face.',
          'CASEL: Social awareness',
        ),
      ],
      [
        ch(
          'jasmine',
          'Give him jasmine tea',
          [PE('Flowery. I said no flowery.'), N('He drinks it all. He asks for more!')],
          { 'q50-pell': 'jasmine' },
        ),
        ch('black', 'Give him strong black tea', [PE('Hm. This tea is good and strong.')], { 'q50-pell': 'black' }),
        ch(
          'ask',
          'Ask what tea he drank as a boy',
          [PE('My mum made barley tea.', 'soft'), I('I have barley! I have everything!', 'happy')],
          { 'q50-pell': 'barley' },
        ),
      ],
    ),
    scene(
      'q50-grump-done',
      [
        PE('Hm. Not bad.'),
        N('For Mr Pell, that is a great big smile!'),
        N('He counts his coins. He does not have enough.'),
        I('(quietly) It’s your stall today, Keeper. You choose.'),
      ],
      [
        ask(
          2,
          'maths',
          'how many more (adding on)',
          [N('Tea costs 5 coins. He has 3 coins.'), N('How many more does he need?'), N('(Count on together: four, five.)')],
          [
            opt('2 more', [N('Yes! Three… four, five. Two more.')], true),
            opt('1 more', [N('Let’s count on: three… four. Then five.'), N('That’s two more!')]),
          ],
          'Your child counted on from 3 to 5 to find how many more coins were needed.',
          'K.OA.A.2',
        ),
      ],
      [
        ch(
          'q50-free',
          'This cup is free today',
          [
            PE('I don’t want a present.', 'angry'),
            I('It is not a present. It is a hello for tomorrow.', 'soft'),
            PE('Hm. Tomorrow, then.'),
          ],
          { 'q50-pay': 'free' },
        ),
        ch(
          'q50-full',
          'Kindly ask for the rest tomorrow',
          [PE('Fair. I’ll bring it tomorrow.'), I('Asking kindly is kind too.', 'soft')],
          { 'q50-pay': 'later' },
        ),
        ch(
          'q50-trade',
          'Ask him to fix the wobbly stool',
          [PE('That stool wobbles. I noticed.'), N('He fixes it with a folded leaf. No more wobble!')],
          { 'q50-pay': 'trade' },
        ),
      ],
    ),
    scene(
      'q50-complete',
      [
        N('By lunchtime the stall is full. Busy, busy!'),
        N('Your Nubbins nap under the counter. Snore, snore.'),
        I('Tea is just leaves and water. The rest is caring.', 'soft'),
        I('The stall is yours, Keeper. I will visit a lot.'),
        Z('He’ll drink all the tea.'),
        N('Kaito fills Mr Pell’s cup. Nobody asked him to!'),
        N('Uncle Tenzo smiles and smiles.'),
        PE('Same time tomorrow. Don’t be late.'),
      ],
      [
        notice(
          0,
          'science',
          'steam comes from very hot water',
          [
            I('See the little cloud from the kettle?'),
            I('That is steam. It comes from very hot water.'),
            I('Steam is hot too. Only grown-ups touch the kettle.'),
          ],
          'Your child heard that very hot water makes steam, and that kettles are for grown-ups.',
          'ELOF: Scientific Reasoning',
        ),
      ],
    ),
  ],
};

// ------------------------------------------------------------------ Q51
const Q51: EduQuest = {
  id: 'sprout:q51',
  of: 'q51',
  band: 'sprout',
  title: 'Cactus Juice',
  goals: {
    'q51-s1': {
      goal: 'Keep Tuk in the shade until Nalu comes back.',
      hint: 'Stand in his way. Your shiny Nubbin can lead him back.',
    },
    'q51-s2': {
      goal: 'Take 3 little cactus pieces home to plant.',
      hint: 'Cut the small side pieces. Wear gloves. Spikes are sharp!',
    },
  },
  scenes: [
    scene(
      'q51-desert',
      [
        N('The desert is hot and sandy. Sand, sand, sand!'),
        N('Uh-oh. The water bottles are empty.'),
        K('I’ll go and find water. Nobody eat anything strange!'),
        T('Me? I never eat strange things.'),
        N('Nalu goes. Tuk looks at a fat green cactus.'),
        N('He cuts it open. He drinks the juice. Slurp!'),
        T('Ooh! Best. Drink. EVER!', 'happy'),
        P('Tuk, why are you smiling at that rock?'),
        T('It smiled first!', 'happy'),
        N('Tuk wobbles off across the sand. Wibble, wobble!'),
      ],
      [
        ask(
          6,
          'health',
          'never eat or drink plants you don’t know',
          [P('Should we eat or drink plants we don’t know?')],
          [
            opt('No. Ask a grown-up first', [P('Yes! Some plants can make us poorly.'), P('Always ask a grown-up first.')], true),
            opt('Yes, if it looks tasty', [
              P('Lots of plants look tasty but aren’t safe.'),
              P('Always ask a grown-up first.'),
            ]),
          ],
          'Your child learned never to eat or drink a plant without asking a grown-up first.',
          'ELOF: Perceptual, Motor, and Physical Development',
        ),
      ],
      [
        ch('cloud', 'Say the cloud looks friendly', [T('Thank you! Finally, someone who listens.')], { 'q51-cloud': true }),
        ch('cup', 'Take the cactus away', [T('You can take the cactus. I still feel happy!', 'sad')]),
      ],
      'cup',
    ),
    scene(
      'q51-desert-done',
      [
        N('Nalu comes back with lots of water.'),
        K('I was gone ten minutes!', 'angry'),
        T('Nalu! You look like a big talking fish!', 'happy'),
        K('Tuk! You made the rule! You wrote it down!', 'angry'),
      ],
      [
        ask(
          3,
          'sel',
          'worry can feel like cross',
          [N('Nalu is cross. Why?'), N('(Wait for an answer.)')],
          [
            opt('She was worried about Tuk', [N('Yes. She was worried.'), N('Worry can come out as cross.')], true),
            opt('She doesn’t like fish', [N('Ha! Maybe. But she was worried about Tuk.'), N('Worry can make us feel cross.')]),
          ],
          'Your child thought about the worry that can sit underneath a cross feeling.',
          'CASEL: Social awareness',
        ),
      ],
      [
        ch(
          'q51-defend',
          'Stick up for Tuk: he was thirsty',
          [K('We were all thirsty. That’s why we had a rule.'), T('Thank you. Your face is a melon. A kind melon.', 'happy')],
          { 'q51-side': 'tuk' },
        ),
        ch(
          'q51-back-nalu',
          'Agree with Nalu: he broke his rule',
          [T('She’s right. I don’t like it when the fish is right.', 'sad')],
          { 'q51-side': 'nalu' },
        ),
      ],
    ),
    scene(
      'q51-cuttings',
      [
        K('Drink this water, Tuk. Slowly.'),
        T('This water isn’t fizzy. It’s just wet.', 'sad'),
        K('Water is just what you need, silly.'),
        N('Look at the cactus. It is fat and spiky.'),
        K('Let’s take some little pieces home. They grow easily!'),
        K('Keep them far away from Tuk!', 'soft'),
      ],
      [
        ask(
          4,
          'science',
          'what plants need: a cactus',
          [K('What does a little cactus need to grow?')],
          [
            opt(
              'Sun and a little water',
              [K('Yes! Cactus plants love sun.'), K('They keep water inside their fat stems.')],
              true,
            ),
            opt('Lots of snow', [K('Brr! Too cold for a cactus.'), K('Cactus plants need sun and a little water.')]),
          ],
          'Your child learned that plants need sun and water, and that a cactus stores water in its stem.',
          'K-LS1-1',
        ),
      ],
    ),
    scene(
      'q51-cuttings-done',
      [
        N('You wrap the cactus pieces in cloth. Careful, careful!'),
        N('Your Nubbin carries one, like treasure.'),
        N('You carry two.'),
        K('Off we go, back to the Grove.'),
      ],
      [
        ask(
          2,
          'maths',
          'add 1 and 2',
          [N('Nubbin has 1. You have 2. How many altogether?'), N('(Hold up 1 finger. Then 2 more.)')],
          [
            opt('3', [N('Yes! One and two make three.')], true),
            opt('2', [N('Let’s count them all: one, two, three.'), N('Three pieces!')]),
          ],
          'Your child added 1 and 2 to make 3.',
          'K.OA.A.1',
        ),
      ],
    ),
    scene(
      'q51-complete',
      [
        N('Back at the Grove, you plant them in the sun.'),
        N('In the morning, they have little pink flowers!'),
        T('I don’t remember yesterday at all.'),
        P('You asked a rock to be your best friend!', 'happy'),
        T('I did not.'),
        P('“Best drink ever!” You said it forty times!', 'happy'),
        T('Rules are hard when you’re thirsty.', 'think'),
        T('But that’s when they help the most.'),
      ],
      [
        act(
          1,
          'literacy',
          'clap syllables',
          'edu:clap:syllables:cactus',
          [P('Let’s clap “cactus”. Cac-tus!'), N('(Clap once for each part.)'), P('Two claps! Cac-tus!', 'happy')],
          'Your child clapped the two syllables in “cactus”.',
          'RF.K.2',
        ),
      ],
    ),
  ],
};

// ------------------------------------------------------------------ Q52
const Q52: EduQuest = {
  id: 'sprout:q52',
  of: 'q52',
  band: 'sprout',
  title: 'Puffin Is Lost',
  goals: {
    'q52-s1': {
      goal: 'Follow Puffin’s clues to find him.',
      hint: 'Look for white fur, giant footprints and squashed bushes.',
    },
    'q52-s2': {
      goal: 'Feed Puffin 5 round fruits, gently.',
      hint: 'Move slowly. If he backs away, sit still and wait.',
    },
    'q52-s3': {
      goal: 'Ride Puffin home to the Grove.',
      hint: 'Say “hup-hup”. Tilt to steer. Puffin lands by himself.',
    },
  },
  scenes: [
    scene(
      'q52-gone',
      [
        N('Pemba sits by the gate. He holds a big, empty saddle.'),
        P('Puffin is gone. The storm scared him. He flew away.', 'sad'),
        T('He’s a giant sky bison. We’ll spot him.', 'soft'),
        P('But he’s scared on his own.', 'sad'),
        N('Your Nubbin finds white fur on the fence.'),
        T('A clue! Puffin went that way.'),
        P('Will you help me find him?'),
      ],
      [
        ask(
          3,
          'sel',
          'helping a sad friend',
          [N('Pemba is sad and worried. What can we do?')],
          [
            opt('Help him look', [N('Yes. Friends help each other.'), P('Thank you. I feel a bit better.', 'soft')], true),
            opt('Tell him to stop being sad', [
              N('Sad feelings don’t stop when we say so.'),
              N('Helping him look is kinder.'),
            ]),
          ],
          'Your child thought about how to help a friend who is sad and worried.',
          'CASEL: Social awareness',
        ),
      ],
      [
        ch('promise', 'Promise to find him', [P('Thank you. Puffin likes people who keep promises.', 'soft')]),
        ch('joke', 'Ask how you lose a giant bison', [T('I asked that too!'), P('I didn’t lose him. He got lost.', 'sad')]),
        ch('nubbin', 'Let your Nubbin lead', [N('Your Nubbin sniffs. Achoo! Wrong way. Then it turns round.')], {
          'q52-nubbin-leads': true,
        }),
      ],
    ),
    scene(
      'q52-gone-done',
      [
        N('You follow the clues. Fur. Footprints. Squashed bushes.'),
        N('Here is a hill with a big bison-shaped dent!'),
        N('In a cave, two big eyes blink.'),
        A('Mrrrrrooooh.', 'sad'),
      ],
      [
        ask(
          0,
          'maths',
          'compare sizes: big and small',
          [T('Look at these footprints. Which one is Puffin’s?')],
          [
            opt('The giant one', [T('Yes! A big animal makes big footprints.')], true),
            opt('The tiny one', [T('That tiny one is a bird’s.'), T('Puffin is huge. His footprints are huge!')]),
          ],
          'Your child compared big and small footprints and matched them to animal size.',
          'K.MD.A.2',
        ),
      ],
    ),
    scene(
      'q52-trust',
      [
        N('Puffin is in the cave. He is shaking.'),
        P('Puffin! It’s me!', 'shock'),
        N('The loud voice scares Puffin. He backs away.'),
        P('He’s never been scared of me before.', 'sad'),
        T('He’s scared of everything right now. Give him time.', 'soft'),
        N('Your Nubbin sits down quietly. It holds up a fruit.'),
        P('He loves big round fruits.', 'soft'),
      ],
      [
        ask(
          4,
          'science',
          'caring for a scared animal',
          [T('How should we be with a scared animal?')],
          [
            opt('Quiet and slow', [T('Yes. Soft voices. Slow hands. Lots of waiting.')], true),
            opt('Loud and fast', [T('Loud and fast makes him more scared.'), T('Quiet and slow helps him feel safe.')]),
          ],
          'Your child learned that scared animals need quiet voices, slow movements and patience.',
          'K-ESS3-3',
        ),
      ],
      [
        ch('wait', 'Sit down and wait', [N('You sit. You wait. A big wet nose comes closer.')]),
        ch(
          'whistle',
          'Whistle Pemba’s bedtime tune',
          [P('His bedtime whistle! How did you know?'), N('Puffin’s ears flick up.')],
          { 'q52-whistle': true },
        ),
        ch('roll', 'Roll a fruit to him gently', [N('Roll, roll. Slurp! Puffin looks at you. He likes you!')]),
      ],
    ),
    scene(
      'q52-trust-done',
      [
        A('Mrrrrrf!', 'happy'),
        N('Puffin comes out. He licks Pemba. Slurp!'),
        P('I missed you too! Ow, my ribs!', 'happy'),
        N('Puffin ate every fruit you gave him.'),
      ],
      [
        act(
          3,
          'maths',
          'count to 5',
          'edu:count:fruit:5',
          [
            P('How many fruits did he eat? Let’s count.'),
            N('(Count the fruits as Puffin eats them, one at a time.)'),
            P('One, two, three, four, five. Munch!', 'happy'),
          ],
          'Your child counted five fruits, one number for each.',
          'K.CC.B.5',
        ),
      ],
    ),
    scene(
      'q52-home',
      [
        P('Puffin wants to go home. He wants you to come too!'),
        T('Climb on a giant bison. Totally normal day.'),
        N('Puffin rumbles like a warm mountain.'),
        P('Say “hup-hup!” Say it loud!', 'happy'),
        N('Up, up, up you go! The wind blows hard. Whoosh!'),
        N('Your Nubbin holds on tight.'),
      ],
      [
        notice(
          4,
          'science',
          'wind: we can feel it but not see it',
          [P('We can’t see the wind.'), P('But we can feel it on our faces.'), P('And we can see it move the trees!')],
          'Your child heard that wind is moving air we can feel but cannot see.',
          'K-ESS2-1',
        ),
      ],
    ),
    scene(
      'q52-home-done',
      [
        N('The Grove is far below. It looks tiny and green.'),
        N('Puffin lands at the gate. THUMP!'),
        N('Fruit falls from every tree.'),
        N('Pemba’s eyes are wet. He says it’s the wind.'),
        T('Yes. Very windy today.', 'soft'),
      ],
      [
        ask(
          1,
          'literacy',
          'first sounds',
          [P('Puffin and Pemba start the same way. P-p-p!'), P('What else starts with P?')],
          [
            opt('Pond', [P('Yes! P-p-pond!', 'happy')], true),
            opt('Tree', [P('Tree starts with T. T-t-tree.'), P('Pond starts with P. P-p-pond!')]),
          ],
          'Your child listened for the P sound at the start of words.',
          'RF.K.2',
        ),
      ],
    ),
    scene(
      'q52-complete',
      [
        P('Thank you. I don’t know what I’d do without him.', 'soft'),
        P('I think it was my fault. I didn’t hold on.', 'sad'),
        T('You can’t hold on to a storm, Pemba.', 'soft'),
        T('But you came looking for him. That’s what counts.', 'soft'),
        N('Puffin rests his big head on your shoulder.'),
        P('He likes you now. He’ll come when you call!', 'happy'),
        N('A tuft of white fur lands on your Nubbin’s head.'),
      ],
      [
        notice(
          3,
          'sel',
          'kind words help',
          [
            N('Pemba felt it was his fault.'),
            N('Tuk said kind words. That helped.'),
            N('(Ask: what kind words help you feel better?)'),
          ],
          'Your child heard how kind words can help a friend who blames themselves.',
          'CASEL: Relationship skills',
        ),
      ],
    ),
  ],
};

// ------------------------------------------------------------------ Q53
const Q53: EduQuest = {
  id: 'sprout:q53',
  of: 'q53',
  band: 'sprout',
  title: 'The Fan Warriors',
  goals: {
    'q53-s1': {
      goal: 'Join the fan drill. Don’t drop your fan!',
      hint: 'Copy the warrior at the front. Open, sweep, close.',
    },
    'q53-s2': {
      goal: 'Practise fan-blocks with Sumi.',
      hint: 'Block just as she moves. Let her come to you.',
    },
  },
  scenes: [
    scene(
      'q53-flattened',
      [
        N('In the yard, warriors in green swish their fans.'),
        N('Their faces are painted. They move all together.'),
        T('Ha! Fan dancing! How cute!', 'happy'),
        S('We’re the fan-warriors. I’m Sumi. That was your last joke.'),
        T('Fans? Come on. I have a boomerang!'),
        S('Want to try me?'),
        N('Whoosh! Tuk is flat on his back. Bump!'),
        T('What just happened?', 'shock'),
        S('You fought me. For one second.'),
      ],
      [
        ask(
          3,
          'sel',
          'teasing hurts feelings',
          [N('Tuk laughed at the fans. How might Sumi feel?')],
          [
            opt('Not happy', [N('Right. Teasing can hurt feelings.'), N('Tuk will learn that soon!')], true),
            opt('Very happy', [N('Look at her face. She is not smiling.'), N('Teasing can hurt feelings.')]),
          ],
          'Your child thought about how teasing makes other people feel.',
          'CASEL: Social awareness',
        ),
      ],
      [
        ch('help', 'Help Tuk up', [T('Thanks. My pride is still down there.')]),
        ch('learn', 'Ask Sumi to teach you', [S('You I like. Him, we’ll see.', 'happy'), T('Him is right here.')]),
      ],
      'help',
    ),
    scene(
      'q53-flattened-done',
      [
        S('Open. Sweep. Close. Again!'),
        S('Not bad. You are patient.'),
        T('I want to train too. Properly.'),
        S('Then wear the uniform. All of it.'),
        T('All of it?', 'shock'),
      ],
      [
        act(
          0,
          'maths',
          'order: first, next, last',
          'edu:order:fan-moves',
          [
            S('First, open the fan. Next, sweep. Last, close it.'),
            N('(Do it with your hand: open, sweep, close.)'),
            S('First, next, last. Well done!', 'happy'),
          ],
          'Your child put three moves in order using first, next and last.',
          'ELOF: Mathematics Development',
        ),
      ],
    ),
    scene(
      'q53-uniform',
      [
        N('Tuk comes out in a green robe. His face is painted.'),
        N('White face. Red around the eyes. He looks great!'),
        T('Not. One. Word.'),
        S('The paint says: I won’t hide who I am.'),
        N('Your Nubbin is painted too. It holds a tiny fan.'),
        S('Last lesson. Don’t block it. Step aside.'),
        S('Spar with me, and see.', 'happy'),
      ],
      [
        ask(
          1,
          'art',
          'mixing colours: red and white make pink',
          [S('Mix red paint and white paint. What colour do we get?')],
          [
            opt('Pink', [S('Yes! Red and white make pink.', 'happy')], true),
            opt('Blue', [S('Let’s mix and look. Swirl, swirl.'), S('Pink! Red and white make pink.')]),
          ],
          'Your child learned that mixing red and white paint makes pink.',
        ),
      ],
      [
        ch('tuk', 'Let Tuk go first', [N('Tuk runs. Sumi steps aside. Tuk keeps running. And running.')]),
        ch('you', 'Have a go yourself', [S('Good. Breathe. Watch my shoulder, not my fan.')]),
        ch('nubbin', 'Send your painted Nubbin', [S('Ha! So brave. Come on, little warrior!', 'happy')], {
          'q53-nubbin-spar': true,
        }),
      ],
    ),
    scene(
      'q53-uniform-done',
      [
        S('Look at you! Nearly a fan-warrior!', 'happy'),
        T('Nearly? I’m wearing face paint!'),
        S('The paint helps your friends know it’s you.', 'soft'),
        S('That part you’ve got.'),
      ],
      [
        act(
          0,
          'health',
          'calm breathing',
          'edu:breathe:slow:3',
          [
            S('Warriors breathe slowly to stay calm.'),
            N('(Breathe in through your nose. Out through your mouth. Three times.)'),
            S('In… and out. Calm and strong.', 'soft'),
          ],
          'Your child practised three slow, calming breaths.',
          'CASEL: Self-management',
        ),
      ],
    ),
    scene(
      'q53-complete',
      [
        T('Sumi, I was wrong. I’m sorry.'),
        T('Anyone can be a warrior. Boys and girls.'),
        T('It’s about practice. And helping each other.'),
        S('That is a very good sorry.', 'soft'),
        S('Keep the fan, Keeper. And the paint!', 'happy'),
        N('Your Nubbin won’t wash its face for three days.'),
      ],
      [
        ask(
          3,
          'sel',
          'what makes a good sorry',
          [S('What makes a good sorry?')],
          [
            opt('Say what you did wrong', [S('Yes. Tuk said “I was wrong”. Then sorry.'), S('That’s a real sorry.', 'soft')], true),
            opt('Say it really fast', [S('A fast sorry can feel empty.'), S('Say what you did. Then say sorry.')]),
          ],
          'Your child thought about what makes an apology real.',
          'CASEL: Relationship skills',
        ),
      ],
    ),
  ],
};

// ------------------------------------------------------------------ Q54
const Q54: EduQuest = {
  id: 'sprout:q54',
  of: 'q54',
  band: 'sprout',
  title: 'The Sword Master',
  goals: {
    'q54-s1': {
      goal: 'Do Master Pian’s three lessons: brush, sit still, look.',
      hint: 'Go slow and steady. Slow is better than fast here.',
    },
    'q54-s2': {
      goal: 'Bring the fallen star rock to Master Pian.',
      hint: 'Tap when the metal glows orange. Rest in between.',
    },
  },
  scenes: [
    scene(
      'q54-lessons',
      [
        N('Master Pian lives at the top of the hill.'),
        T('Master Pian, I want to learn the sword.'),
        T('Pemba can fly. Nalu does water. I just have plans.', 'think'),
        PI('Plans are good. A sword with no plan is just a stick.', 'soft'),
        PI('First, write your name with a brush.'),
        PI('Then sit still. Then look at the garden.'),
        T('That’s not sword stuff!', 'shock'),
        PI('It is all sword stuff.'),
        N('Your Nubbin sits very still. Master Pian nods.'),
      ],
      [
        act(
          4,
          'literacy',
          'write the letter T',
          'edu:trace:letter:t',
          [
            PI('Tuk starts with T. Let’s write it.'),
            N('(Draw a big T in the air with your finger.)'),
            PI('A tall line with a hat on top. T for Tuk!', 'happy'),
          ],
          'Your child traced the letter T, the first letter of Tuk’s name.',
          'ELOF: Literacy',
        ),
      ],
      [
        ch('brush', 'Start with the brush', [PI('Good. A brush stroke can’t be taken back. Nor a sword stroke.')]),
        ch('sit', 'Start with sitting still', [T('I can sit still. Watch!'), N('Tuk sits still for nine seconds.')]),
        ch('garden', 'Start with the garden', [PI('What do you see?', 'soft'), T('Rocks. More rocks.'), PI('Look longer.')]),
      ],
    ),
    scene(
      'q54-lessons-done',
      [
        PI('Today you learned three things.'),
        PI('Your hand. Your breath. Your eyes.'),
        T('And my knees. My knees learned a lot.'),
        PI('Knees always learn first.'),
      ],
      [
        act(
          1,
          'health',
          'body awareness: hands, breath, eyes',
          'edu:move:body:hand-breath-eyes',
          [
            PI('Let’s try all three.'),
            N('(Wiggle your fingers. Take a big breath. Blink your eyes.)'),
            PI('Hand, breath, eyes. Very good.', 'happy'),
          ],
          'Your child moved their fingers, breathed deeply and blinked, noticing three parts of the body.',
          'ELOF: Perceptual, Motor, and Physical Development',
        ),
      ],
    ),
    scene(
      'q54-meteor',
      [
        N('That night, a bright light falls from the sky. Whoosh!'),
        N('The ground shakes. Rumble!'),
        T('A shooting star! It landed!', 'shock'),
        PI('A sword from a fallen star. That is rare.', 'think'),
        N('In a hole lies a black rock. It is heavy and warm.'),
        T('What if I make a mistake? There’s only one star.', 'think'),
        PI('Then you learn something. Every master has a mistake.', 'soft'),
        PI('Mine is a very wobbly spoon.'),
      ],
      [
        notice(
          7,
          'sel',
          'mistakes help us learn',
          [
            N('Everyone makes mistakes. Even masters.'),
            N('Mistakes help us learn.'),
            N('(Ask: what did you learn by trying again?)'),
          ],
          'Your child heard that mistakes are part of learning, even for experts.',
          'ELOF: Approaches to Learning',
        ),
      ],
    ),
    scene(
      'q54-meteor-done',
      [
        N('Clang, clang! Tuk hammers the hot metal.'),
        N('Hiss! He dips it in water. Steam puffs up.'),
        N('The blade is black, with tiny silver dots.'),
        T('Whoa.', 'soft'),
      ],
      [
        notice(
          3,
          'science',
          'shooting stars are space rocks',
          [
            PI('A shooting star is not really a star.'),
            PI('It is a little rock from space.'),
            PI('It glows hot as it falls through the sky.'),
          ],
          'Your child heard that a shooting star is a small space rock glowing as it falls.',
          'ELOF: Scientific Reasoning',
        ),
      ],
    ),
    scene(
      'q54-complete',
      [
        PI('A sword becomes part of how you stand and breathe.', 'soft'),
        PI('Friends are like that too.'),
        T('Can I name it?'),
        PI('You may.'),
        T('Star Stabber!', 'happy'),
        PI('You may also think about it for longer.'),
        N('Master Pian makes a little wooden practice sword for you too.'),
      ],
      [
        ask(
          6,
          'maths',
          'compare sizes',
          [PI('Two swords. Which one is bigger?'), N('(Point to the big one. Then the small one.)')],
          [
            opt("Tuk’s sword", [PI('Yes. Tuk’s is big. Yours is small.'), PI('Small, and just right for you.', 'soft')], true),
            opt('Your sword', [PI('Yours is the small one. Tuk’s is bigger.'), PI('Small, and just right for you.', 'soft')]),
          ],
          'Your child compared two objects and named the bigger and the smaller one.',
          'K.MD.A.2',
        ),
      ],
    ),
  ],
};

// ------------------------------------------------------------------ Q55
const Q55: EduQuest = {
  id: 'sprout:q55',
  of: 'q55',
  band: 'sprout',
  title: 'The Ember Bay Players',
  goals: {
    'q55-s1': {
      goal: 'Watch the first part of the play.',
      hint: 'Sit and watch. Tap to throw a peanut, if you like.',
    },
    'q55-s2': {
      goal: 'Watch the end of the play. Show what you think!',
      hint: 'The actors will remember what you did.',
    },
  },
  scenes: [
    scene(
      'q55-act1',
      [
        N('A beach stage! The sign says: THE KEEPER AND FRIENDS.'),
        T('A play about us! Hooray!', 'happy'),
        B('I can’t see the stage. This will be great.'),
        N('An actor in orange does cartwheels. He falls over.'),
        PL('I am Pemba! I love fun! And fun!', 'happy'),
        P('Is that what I’m like?', 'sad'),
        N('An actor playing Tuk only talks about meat.'),
        T('I am more than meat!', 'angry'),
        N('A big actor with a beard plays Bao.'),
        B('I love him. Ten out of ten!', 'happy'),
      ],
      [
        ask(
          4,
          'literacy',
          'characters: actors pretend to be someone',
          [P('That actor is pretending. Who is he pretending to be?')],
          [
            opt('Pemba', [P('Yes! He’s pretending to be me. Actors pretend.')], true),
            opt('A fish', [P('Ha! No. He said “I am Pemba”.'), P('Actors pretend to be someone else.')]),
          ],
          'Your child named the character an actor was playing.',
          'RL.K.3',
        ),
      ],
    ),
    scene(
      'q55-act1-done',
      [
        N('Ding! Time for a break.'),
        Z('They gave me a mop for hair.', 'shock'),
        Z('And I was the baddie. That is how I was.', 'think'),
        Z('But it is not how I am now.', 'think'),
        B('Look at that. You’ve grown. Pass the peanuts.', 'happy'),
      ],
      [
        ask(
          3,
          'sel',
          'people can change',
          [Z('I used to be grumpy and unkind. Now I try to be kind.'), Z('Can people change?')],
          [
            opt('Yes!', [Z('Thank you. I’m trying every day.', 'soft')], true),
            opt('No', [B('Sure they can. Look at him. He’s trying.'), Z('I’m trying every day.', 'soft')]),
          ],
          'Your child thought about whether people can change and grow kinder.',
          'CASEL: Self-awareness',
        ),
      ],
    ),
    scene(
      'q55-finale',
      [
        N('An actor in a shiny cape walks on. That’s you!'),
        PL('The Keeper is here! With lots of Nubbins!'),
        N('The Nubbins are socks on sticks. Five sock Nubbins!'),
        N('Oh! One falls off. Plop! It rolls in the sand.'),
        N('The pretend Keeper slips on a banana. The play ends!'),
        T('They can’t end it like that!', 'shock'),
        B('Your move, Keeper.'),
      ],
      [
        ask(
          3,
          'maths',
          'take away 1',
          [N('Five sock Nubbins. One fell off. How many now?'), N('(Hold up five fingers. Fold one down.)')],
          [
            opt('4', [N('Yes! Five take away one is four.')], true),
            opt('6', [N('Let’s count the fingers still up.'), N('One, two, three, four. Four!')]),
          ],
          'Your child took one away from five and found four.',
          'K.OA.A.1',
        ),
      ],
      [
        ch(
          'cheer',
          'Cheer anyway',
          [N('You cheer! The actors smile. The sock Nubbins bow.'), PL('A fan! We have a fan!', 'happy')],
          { 'q55-reaction': 'cheer' },
        ),
        ch(
          'storm',
          'Climb up and fix the ending',
          [N('You save the sock Nubbin. You help the Keeper up.'), PL('A new ending! Everybody, make it up!', 'shock')],
          { 'q55-reaction': 'storm' },
        ),
      ],
      'cheer',
    ),
    scene(
      'q55-finale-done',
      [
        Z('I’m glad we came.', 'soft'),
        T('I’m not. I’m writing a letter.'),
        B('I’m writing a fan letter. To the big guy with the beard.', 'happy'),
        P('I liked the start. And the middle. Not the end.'),
      ],
      [
        ask(
          3,
          'literacy',
          'stories have a start, a middle and an end',
          [P('Every story has a start, a middle and an…?')],
          [
            opt('End', [P('Yes! Start, middle, end.', 'happy')], true),
            opt('Snack', [P('Ha! Snacks are good. But stories have an end.'), P('Start, middle, end!')]),
          ],
          'Your child named the three parts of a story: start, middle and end.',
          'RL.K.3',
        ),
      ],
    ),
    scene(
      'q55-complete',
      [
        N('After the show, the actors give out masks.'),
        PL('Take a mask! We do the show again next week!', 'happy'),
        B('Great. I’ll come every week.'),
        P('Will they ever do a play where we win?'),
        Z('Nobody would believe it.', 'think'),
        N('You go home with two masks. One happy. One sad.'),
      ],
      [
        act(
          5,
          'art',
          'faces show feelings',
          'edu:make:face:happy-sad',
          [
            N('One mask smiles. One mask frowns.'),
            N('(Make a happy face. Now make a sad face.)'),
            N('Faces show how we feel!', 'happy'),
          ],
          'Your child made happy and sad faces, like the theatre masks.',
          'ELOF: Social and Emotional Development',
        ),
      ],
    ),
  ],
};

// ------------------------------------------------------------------ Q56
const Q56: EduQuest = {
  id: 'sprout:q56',
  of: 'q56',
  band: 'sprout',
  title: 'Rumble Night',
  goals: {
    'q56-s1': {
      goal: 'Find the secret arena under the big boulder.',
      hint: 'The big boulder has a crack. Knock twice.',
    },
    'q56-s2': {
      goal: 'Your Power Nubbin has a match. Win or lose, play fair!',
      hint: 'She feels footsteps. Stand very still, then push.',
    },
  },
  scenes: [
    scene(
      'q56-flyer',
      [
        N('A paper flyer blows by. Flap! It sticks to your Nubbin.'),
        T('“Rumble Night! Wrestling under the big boulder! Bring snacks!”'),
        T('Under a boulder? Of course it is.', 'think'),
        P('Let’s go! Is wrestling like hugging, but grumpier?', 'happy'),
        T('That’s a very good way to say it.'),
        N('Your strongest Nubbin shows off its tiny arms.'),
      ],
      [
        notice(
          2,
          'science',
          'rocks come in all sizes',
          [T('A boulder is a very, very big rock.'), T('Rocks come in all sizes.'), T('Tiny sand. Little pebbles. Giant boulders!')],
          'Your child heard that rocks come in many sizes, from grains of sand to boulders.',
          'ELOF: Scientific Reasoning',
        ),
      ],
      [
        ch('snacks', 'Pack snacks, like the flyer says', [T('Finally! Someone who reads the instructions.')], {
          'q56-snacks': true,
        }),
        ch('nubbin', 'Bring your Power Nubbin', [N('Your Power Nubbin marches ahead. Stomp, stomp!')]),
        ch('unsure', 'Ask if this is a good idea', [T('Hmm. I just want to see it.'), T('We’ll stay together. That’s the good idea.')]),
      ],
    ),
    scene(
      'q56-flyer-done',
      [
        N('You knock twice on the boulder. Knock, knock!'),
        N('The big boulder slides away. Rumble, rumble!'),
        N('Down below, a crowd cheers by torchlight.'),
        T('Okay. That’s a cool door.'),
      ],
      [
        ask(
          1,
          'literacy',
          'first sounds',
          [T('Boulder starts with B. B-b-boulder!'), T('What else starts with B?')],
          [
            opt('Ball', [T('Yes! B-b-ball! Boulder and ball!', 'happy')], true),
            opt('Sand', [T('Sand starts with S. S-s-sand.'), T('Ball starts with B. B-b-ball!')]),
          ],
          'Your child listened for the B sound at the start of words.',
          'RF.K.2',
        ),
      ],
    ),
    scene(
      'q56-bout',
      [
        G('WELCOME TO RUMBLE NIGHT!', 'happy'),
        SL('The Big Slab is BIG! The Big Slab is STRONG!', 'angry'),
        T('Why does he talk about himself like that?'),
        N('In walks the champion. She is tiny. Her feet are bare.'),
        G('THE LITTLE LANDSLIDE!'),
        N('The Big Slab runs at her. Stomp, stomp, stomp!'),
        N('She stamps her foot. Whoosh! He flies into the noodle stand.'),
        B('Next! Anyone? I can feel you all wriggling.', 'happy'),
        N('Your Power Nubbin steps up. Everyone goes quiet.'),
        B('Small and heavy. I like it already.', 'think'),
      ],
      [
        ask(
          7,
          'science',
          'senses: feeling with our feet',
          [N('She can’t see with her eyes.'), N('How does she know where everyone is?')],
          [
            opt(
              'She feels it with her feet',
              [B('Yep. Footsteps make the ground shake a little.'), B('My feet feel it. Easy.', 'happy')],
              true,
            ),
            opt('She guesses', [B('Guesses? Ha! I feel it with my feet.'), B('Footsteps make the ground shake a little.')]),
          ],
          'Your child learned that we can sense things through touch, like feeling footsteps through the ground.',
          'ELOF: Scientific Reasoning',
        ),
      ],
      [
        ch('easy', 'Ask her to go easy', [B('Nope. Your Nubbin deserves a real match.')]),
        ch('all', 'Tell her to do her best', [B('Oh, I will. I like that you asked.', 'happy')]),
        ch('bow', 'Bow to her', [B('You know I can’t see that, right?'), N('She grins. She felt the floor creak.')], {
          'q56-bowed': true,
        }),
      ],
    ),
    scene(
      'q56-bout-done',
      [
        B('Not bad! Hardly anyone lasts that long.', 'happy'),
        N('Your Nubbin is covered in sand. And glory!'),
        B('And you didn’t run away. Most people run.', 'soft'),
        N('Your Nubbin bows. She bows back.'),
      ],
      [
        ask(
          3,
          'sel',
          'being a good sport',
          [N('Win or lose, what do we say after a game?')],
          [
            opt('“Good game!”', [N('Yes! “Good game!” and a high five.', 'happy')], true),
            opt('“No fair!”', [N('Losing can feel bad. That’s okay.'), N('But we still say “Good game!”')]),
          ],
          'Your child practised what a good sport says, win or lose.',
          'CASEL: Self-management',
        ),
      ],
    ),
    scene(
      'q56-complete',
      [
        N('After the show, the champion finds you.'),
        B('My name’s Bao. Don’t tell anyone.'),
        B('Up there, everyone helps me. Even when I don’t need it.', 'soft'),
        T('How do you know where everyone is?'),
        B('I feel it with my feet. Your feet are noisy, Ponytail!', 'happy'),
        B('Here. A spare belt. Your Nubbin earned it.'),
        N('The belt is much too big. Your Nubbin drags it proudly.'),
        G('And take a ring post! For your own arena!', 'happy'),
      ],
      [
        ask(
          2,
          'sel',
          'ask before you help',
          [B('What should people do before they help me?')],
          [
            opt('Ask “Do you want help?”', [B('Yes! Just ask. Then listen to the answer.', 'happy')], true),
            opt('Just grab my arm', [B('Nope. Grabbing isn’t helping.'), B('Ask first. Then listen to the answer.')]),
          ],
          'Your child learned to ask before helping someone, and to listen to their answer.',
          'CASEL: Social awareness',
        ),
      ],
    ),
  ],
};

// ------------------------------------------------------------------ Q57
const Q57: EduQuest = {
  id: 'sprout:q57',
  of: 'q57',
  band: 'sprout',
  title: 'The Painted Lady',
  goals: {
    'q57-s1': {
      goal: 'Take food and medicine to 5 houses.',
      hint: 'Grove fruit and the healer’s herbs both help. Knock gently.',
    },
    'q57-s2': {
      goal: 'Clean the river at night. Don’t be seen!',
      hint: 'Steer to the brown patches. If a lantern turns, hide in the mist.',
    },
  },
  scenes: [
    scene(
      'q57-sick',
      [
        N('Down the river, the water is brown and yucky.'),
        N('A little village sits on stilts in the water.'),
        RE('The fish are gone. Lots of us feel poorly.', 'sad'),
        RE('The works up the river tips muck into it.', 'sad'),
        K('That’s not fair! Someone should help.', 'angry'),
        RE('Long ago, a river spirit helped us. A lady with a painted face.', 'soft'),
        N('A little girl holds up an empty fish basket.'),
        N('Nalu goes quiet. She has an idea.'),
      ],
      [
        ask(
          3,
          'science',
          'what animals need: fish need clean water',
          [K('What do fish need to live?')],
          [
            opt('Clean water', [K('Yes. Fish need clean water.'), K('Dirty water makes the whole river poorly.')], true),
            opt('Sweets', [K('Ha! No. Fish need clean water.'), K('Dirty water makes the whole river poorly.')]),
          ],
          'Your child learned that fish and other river animals need clean water to live.',
          'K-LS1-1',
        ),
      ],
      [
        ch('help', 'Promise to help', [RE('You’re kind. But kind can’t clean a river.', 'soft'), K('Watch us.')]),
        ch('fruit', 'Give them fruit from the Grove', [RE('Fruit! The children will be so happy!', 'happy')], {
          'q57-gave-fruit': true,
        }),
        ch('spirit', 'Ask about the river spirit', [RE('She came at night, in the mist. With a lantern.')]),
      ],
    ),
    scene(
      'q57-sick-done',
      [
        N('You take food and medicine to the houses.'),
        N('Knock, knock. Gently. People are poorly.'),
        N('At the last house, a boy gives you a drawing.'),
        N('It is a lady with a painted face.'),
        K('That settles it.', 'soft'),
      ],
      [
        act(
          1,
          'maths',
          'count to 5',
          'edu:count:houses:5',
          [
            K('Five houses. Let’s count them.'),
            N('(Count on your fingers, one house at a time.)'),
            K('One, two, three, four, five. All done!', 'happy'),
          ],
          'Your child counted five houses on their fingers.',
          'K.CC.B.4',
        ),
      ],
    ),
    scene(
      'q57-night',
      [
        N('Night-time. Mist floats on the river.'),
        N('Nalu wears a white veil and a big straw hat.'),
        K('Do I look like a river spirit?'),
        T('You look like Nalu in a hat. A spooky hat.'),
        P('You look amazing! Amazing and spooky!', 'happy'),
        K('I lift the muck out. You scoop it into barrels.'),
        N('Your Swim Nubbin dives in. Splash! It finds an old can.'),
      ],
      [
        notice(
          0,
          'science',
          'mist is tiny drops of water',
          [
            K('Mist is like a cloud near the ground.'),
            K('It is made of tiny drops of water.'),
            K('Wave your hand in it. Your fingers feel damp!'),
          ],
          'Your child heard that mist is a low cloud made of tiny water drops.',
          'ELOF: Scientific Reasoning',
        ),
      ],
      [
        ch('clean', 'Clean the river first', [K('Yes. Clean first. The rest can wait.')], { 'q57-plan': 'clean' }),
        ch('pipe', 'Block the muddy pipe', [T('I can help with that. I brought a giant cork!', 'happy')], {
          'q57-plan': 'pipe',
        }),
        ch('note', 'Leave a note at the works', [K('“Please stop. Love, the river.” Perfect!', 'happy')], {
          'q57-plan': 'note',
        }),
      ],
    ),
    scene(
      'q57-night-done',
      [
        N('By morning, the water is clear. You can see the stones!'),
        N('A fish jumps up. Splash!'),
        RE('The Painted Lady came back!', 'shock'),
        N('Ma Reedy looks at your boat. Nalu freezes.'),
        K('(whispering) Should we tell her?'),
      ],
      [
        ask(
          2,
          'sel',
          'reading feelings on faces',
          [N('Look at Ma Reedy. How does she feel?')],
          [
            opt('Happy and surprised', [N('Yes! Big eyes, big smile. Happy and surprised!')], true),
            opt('Cross', [N('Look again. She is smiling.'), N('She feels happy and surprised!')]),
          ],
          'Your child read someone’s face to name two feelings at once.',
          'CASEL: Social awareness',
        ),
      ],
      [
        ch(
          'q57-tell',
          'Come out and tell the truth',
          [RE('I know, dear. Spirits don’t sneeze.', 'soft'), RE('The Painted Lady is anyone who helps. Now it’s you.')],
          { 'q57-legend': 'told' },
        ),
        ch(
          'q57-mist',
          'Float back into the mist',
          [N('You float away. The village tells the story again and again.'), K('Maybe they just need someone to help.', 'soft')],
          { 'q57-legend': 'kept' },
        ),
      ],
    ),
    scene(
      'q57-complete',
      [
        N('The village wakes up. The water is clean!'),
        N('The fish baskets are full.'),
        N('The works puts up a sign: PIPE CLOSED. SORRY.'),
        RE('She came back! After all these years!', 'happy'),
        T('She was very wet. She owes me new trousers.'),
        RE('Take this hat. And these little fish.'),
        RE('Put them in your stream. They help keep it clear.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'caring for shared places: keep rivers clean',
          [K('How can we help keep rivers clean?')],
          [
            opt('Put rubbish in the bin', [K('Yes! Rubbish goes in the bin. Never in the river.', 'happy')], true),
            opt('Throw rubbish in the water', [K('Then the fish get poorly.'), K('Rubbish goes in the bin. Never in the river.')]),
          ],
          'Your child thought about how everyone can help look after rivers.',
          'K-ESS3-3',
        ),
      ],
    ),
  ],
};

// ------------------------------------------------------------------ Q58
const Q58: EduQuest = {
  id: 'sprout:q58',
  of: 'q58',
  band: 'sprout',
  title: 'Aunt Wen and the Clouds',
  goals: {
    'q58-s1': {
      goal: 'Visit Aunt Wen. She will read the bones.',
      hint: 'Find the house with stars on the door. Bring a fruit to be polite.',
    },
    'q58-s2': {
      goal: 'Climb Mount Grumble and peek inside.',
      hint: 'Take the zigzag path, or call Puffin. Keep your Nubbin away from the edge.',
    },
    'q58-s3': {
      goal: 'Help Pemba push the clouds into a shape.',
      hint: 'Drag the puffs into the outline. The wind blows them one way.',
    },
  },
  scenes: [
    scene(
      'q58-reading',
      [
        N('In Hillstead, people line up at a starry door.'),
        W('Come in! Aunt Wen sees everything. Well, most things.', 'happy'),
        W('Your Nubbin will find something lovely today. Probably a snack.'),
        T('Nubbins always find snacks. That’s not magic.'),
        N('Outside, a man carries an umbrella. The sky is blue and sunny.'),
        P('She says I’ll have a big adventure!', 'happy'),
        K('She says that to everyone, Pemba.'),
      ],
      [
        ask(
          4,
          'science',
          'weather: rain comes from clouds',
          [T('The sky is blue. No clouds. Does he need an umbrella?')],
          [
            opt('No, it’s sunny', [T('Right! No rain clouds, no umbrella.'), T('Maybe a sun hat instead!')], true),
            opt('Yes', [T('Look up. No clouds at all.'), T('Rain comes from clouds. No clouds, no umbrella!')]),
          ],
          'Your child used the sky to decide what the weather will be.',
          'K-ESS2-1',
        ),
      ],
      [
        ch(
          'believe',
          'Believe her',
          [W('Wise Keeper! Your Nubbin agrees. It’s nodding.', 'happy'), N('Your Nubbin is nodding off to sleep.')],
          { 'q58-belief': 'believe' },
        ),
        ch('doubt', 'Agree with Tuk', [T('Finally! Someone with a brain.', 'happy')], { 'q58-belief': 'doubt' }),
        ch('wait', 'Say you’ll wait and see', [W('Fair. The bones can wait. So can I.')], { 'q58-belief': 'wait' }),
      ],
    ),
    scene(
      'q58-reading-done',
      [
        W('Oh! And the mountain won’t go BOOM this year.'),
        W('I read the clouds. Nice and fluffy.'),
        T('Wait. That mountain can go BOOM?', 'think'),
        N('Its name is Mount Grumble. It rumbles.'),
      ],
      [
        ask(
          3,
          'literacy',
          'rhymes',
          [T('Grumble and rumble sound the same at the end.'), T('What else rhymes with grumble?')],
          [
            opt('Tumble', [T('Yes! Grumble, rumble, tumble!', 'happy')], true),
            opt('Cake', [T('Cake doesn’t sound like grumble.'), T('Grumble, rumble, tumble. Those rhyme!')]),
          ],
          'Your child listened for words that rhyme with “grumble”.',
          'RF.K.2',
        ),
      ],
    ),
    scene(
      'q58-mountain',
      [
        N('Above Hillstead, Mount Grumble puffs out grey smoke.'),
        T('I’m going up there to see for myself.'),
        P('I’ll come! Puffin can fly us up.'),
        K('I’ll stay and talk to the people. Just in case.'),
        N('At the top, it is hot. It smells like eggs.'),
        N('Inside, red rock bubbles. Blub, blub, hiss!'),
        T('That is NOT nice and fluffy!', 'shock'),
        T('But they only listen to Aunt Wen. And she only listens to clouds.', 'think'),
      ],
      [
        notice(
          5,
          'science',
          'volcanoes and lava',
          [
            T('This mountain is a volcano.'),
            T('Deep inside, the rock is so hot it melts.'),
            T('When melted rock comes out, it is called lava.'),
            T('Lava is very hot. We stay far away.'),
          ],
          'Your child heard that a volcano has melted rock inside, called lava when it comes out.',
          '2-ESS1-1',
        ),
      ],
    ),
    scene(
      'q58-mountain-done',
      [
        P('Wait! They only listen to clouds…', 'happy'),
        T('Then we make them a cloud!', 'happy'),
        P('A danger cloud! Big and clear!'),
        T('Pemba, you clever little weather boy.', 'happy'),
      ],
      [
        ask(
          1,
          'health',
          'tell a grown-up about danger',
          [N('If you see something dangerous, what should you do?')],
          [
            opt('Tell a grown-up', [N('Yes! Tell a grown-up straight away.')], true),
            opt('Keep it a secret', [N('Danger is never a secret to keep.'), N('Tell a grown-up straight away.')]),
          ],
          'Your child learned to tell a grown-up straight away when something is dangerous.',
          'ELOF: Perceptual, Motor, and Physical Development',
        ),
      ],
    ),
    scene(
      'q58-clouds',
      [
        N('Everyone stands in the square. Aunt Wen looks up.'),
        W('The clouds will speak! Hmm. That one looks like a duck.'),
        N('Up high, Pemba and Puffin push the clouds. Whoosh!'),
        T('We need one shape. A big, pointy mountain.'),
        K('Tuk, we’re tricking them. Is that okay?', 'think'),
        T('Hmm. You always ask good questions when I’m busy.'),
      ],
      [
        notice(
          2,
          'science',
          'wind moves clouds',
          [P('Wind is moving air.'), P('It pushes the clouds across the sky.'), P('Blow on your hand. That’s a tiny wind!', 'happy')],
          'Your child heard that wind is moving air that pushes clouds along.',
          'K-ESS2-1',
        ),
        act(
          3,
          'maths',
          'shapes: triangle',
          'edu:tap:shape:triangle',
          [
            T('A mountain shape is a triangle. Three sides, three points.'),
            N('(Draw a triangle in the air. Count the sides.)'),
            T('One, two, three. A triangle!', 'happy'),
          ],
          'Your child drew a triangle and counted its three sides.',
          'K.G.A.2',
        ),
      ],
      [
        ch(
          'q58-warning',
          'Make a frowning volcano cloud',
          [T('Tonight we get them safe. Tomorrow we show them why.'), K('Promise?'), T('Promise. With drawings.')],
          { 'q58-cloud': 'warning' },
        ),
        ch(
          'q58-arrow',
          'Make a giant arrow at the mountain',
          [K('Yes! Don’t trick them. Show them where to look.', 'happy'), N('Everyone turns to look at the smoking mountain.')],
          { 'q58-cloud': 'arrow' },
        ),
      ],
    ),
    scene(
      'q58-clouds-done',
      [
        N('A giant cloud hangs over Hillstead.'),
        N('Your Nubbins float down out of it. Damp and proud!'),
        W('Oh my! The clouds have never been this clear!', 'shock'),
        W('Everyone, get your shovels!', 'shock'),
      ],
      [
        notice(
          3,
          'sel',
          'changing your mind',
          [N('Aunt Wen changed her mind.'), N('That is a brave thing to do.'), N('(Ask: have you ever changed your mind?)')],
          'Your child heard that changing your mind when you learn something new is brave and wise.',
          'CASEL: Responsible decision-making',
        ),
      ],
    ),
    scene(
      'q58-complete',
      [
        N('The people dig a long ditch, all night long.'),
        N('Mount Grumble pops. The lava runs down the ditch.'),
        N('It goes away from the houses. Everyone is safe!'),
        W('Thank you, young man. Even if you don’t believe me.', 'soft'),
        T('I believe one word. “Shovels.” Great idea.'),
        W('Bring your Nubbins to me. I’ll read the bones for them.', 'happy'),
        N('Tuk says he’ll never go. He goes twice a week.'),
      ],
      [
        ask(
          0,
          'maths',
          'add 2',
          [N('Five people dig. Two more come to help.'), N('How many are digging now?'), N('(Hold up five fingers. Add two more.)')],
          [
            opt('7', [N('Yes! Five and two more make seven.')], true),
            opt('6', [N('Count on: five… six, seven.'), N('Seven diggers!')]),
          ],
          'Your child added two more to five by counting on.',
          'K.OA.A.2',
        ),
      ],
    ),
  ],
};

// ------------------------------------------------------------------ Q59
const Q59: EduQuest = {
  id: 'sprout:q59',
  of: 'q59',
  band: 'sprout',
  title: 'The Water Scroll',
  goals: {
    'q59-s1': {
      goal: 'Keep Captain Hake talking.',
      hint: 'Ask about everything on his ship. The bison whistle takes ages.',
    },
    'q59-s2': {
      goal: 'Get away from the pirates down the river.',
      hint: 'Steer round the rocks. Your Swim Nubbins can push.',
    },
  },
  scenes: [
    scene(
      'q59-market',
      [
        N('A pirate ship sits at the river market.'),
        CH('Step up! Treasures! No questions!', 'happy'),
        P('A whistle shaped like a bison! I want it!', 'happy'),
        T('It’s a stick with a hole in it.'),
        N('Nalu goes still. She sees an old scroll.'),
        N('It has pictures of water. Waves, drips and splashes.'),
        K('It’s a water scroll. It could teach me so much.', 'soft'),
        CH('Two hundred gold coins, lady. Or your bison.'),
      ],
      [
        ask(
          5,
          'science',
          'water can freeze into ice and melt back',
          [K('Water can change. Very cold water freezes into…?')],
          [
            opt('Ice', [K('Yes! Very cold water turns into hard ice.'), K('Warm the ice, and it melts back to water.')], true),
            opt('Sand', [K('Not sand. It turns into ice.'), K('Warm the ice, and it melts back to water.')]),
          ],
          'Your child learned that water freezes into ice when very cold and melts again when warm.',
          '2-ESS2-3',
        ),
      ],
      [
        ch(
          'haggle',
          'Ask for a lower price',
          [CH('Two hundred! Final offer! Two hundred and ten!'), T('That’s not how it works.')],
          { 'q59-haggled': true },
        ),
        ch('walk', 'Pretend to walk away', [CH('Fine! Nobody wants it! …Two hundred?', 'angry')]),
        ch('where', 'Ask where he got it', [CH('I found it. In a temple. On a shelf.', 'think')]),
      ],
    ),
    scene(
      'q59-market-done',
      [
        N('You turn round. Nalu walks fast to your boat.'),
        N('The glass case is empty!'),
        T('Nalu! Did you just…?', 'shock'),
        K('Walk. Normally. Now.'),
        CH('Stop! After them!', 'angry'),
      ],
      [
        notice(
          4,
          'sel',
          'taking what isn’t ours is not okay',
          [
            N('Nalu took the scroll without paying.'),
            N('Taking things that aren’t ours is not okay.'),
            N('Even when we want them a lot.'),
          ],
          'Your child heard that taking things that belong to someone else is wrong, even when we want them.',
          'CASEL: Responsible decision-making',
        ),
      ],
    ),
    scene(
      'q59-chase',
      [
        N('You jump in your boat. The pirates come after you!'),
        T('You took it, Nalu!', 'angry'),
        K('The pirates took it first. I’ll give it back.'),
        P('Are we pirates now? Can I have a hat?', 'happy'),
        CH('And he never paid for the whistle!', 'angry'),
        P('Oh. Oops.', 'shock'),
        N('Your Swim Nubbins jump in. They push the boat. Splash, splash!'),
      ],
      [
        ask(
          6,
          'science',
          'a push makes things move',
          [P('How do the Nubbins make the boat go?')],
          [
            opt('They push it', [P('Yes! A push makes things move.'), P('A big push makes them go fast!')], true),
            opt('They sing to it', [P('Singing is nice. But it won’t move a boat.'), P('A push makes things move!')]),
          ],
          'Your child learned that a push makes things move, and a bigger push makes them go faster.',
          'ELOF: Scientific Reasoning',
        ),
      ],
      [
        ch('wrong', 'Tell Nalu taking it was wrong', [K('I know. I’ll make it right.', 'sad')], { 'q59-told-off': true }),
        ch('whistle', 'Ask Pemba to blow the whistle', [N('Toot! Far away, a sky bison turns his head.')], {
          'q59-whistle': true,
        }),
      ],
      'wrong',
    ),
    scene(
      'q59-chase-done',
      [
        N('The pirate ship gets stuck. Crunch!'),
        N('It is stuck between two big rocks.'),
        CH('This isn’t over! Has anyone got a long stick?', 'angry'),
        N('Your boat sails on. Bye-bye, pirates!'),
      ],
      [
        ask(
          1,
          'maths',
          'position: between',
          [N('Where is the pirate ship stuck?')],
          [
            opt('Between two rocks', [N('Yes! A rock on this side. A rock on that side.'), N('The ship is between!')], true),
            opt('On top of a cloud', [N('Ha! Look again. One rock here, one rock there.'), N('The ship is between them!')]),
          ],
          'Your child used the position word “between”.',
          'K.G.A.1',
        ),
      ],
    ),
    scene(
      'q59-complete',
      [
        N('That night, Nalu practises with the scroll.'),
        N('Swish! A ribbon of water snaps out and back.'),
        K('I did it! I really did it!', 'happy'),
        T('Great. Now do the move where we don’t take things.'),
        K('I’ll give the scroll back to the water villages. I promise.', 'soft'),
        P('And I’ll go back and pay for my whistle!'),
        K('My tummy felt funny when I took it.', 'think'),
        N('Your Swim Nubbin flicks its tail. A ribbon of water snaps!'),
      ],
      [
        ask(
          6,
          'sel',
          'listening to your feelings',
          [K('Why did my tummy feel funny?')],
          [
            opt('You knew it wasn’t right', [K('Yes. That feeling was telling me something.'), K('Listen to that feeling.', 'soft')], true),
            opt('You ate too many snacks', [K('Ha! Not this time.'), K('I knew it wasn’t right. Listen to that feeling.')]),
          ],
          'Your child noticed that our bodies can tell us when we have done something wrong.',
          'CASEL: Self-awareness',
        ),
      ],
    ),
  ],
};

// ------------------------------------------------------------------ Q60
const Q60: EduQuest = {
  id: 'sprout:q60',
  of: 'q60',
  band: 'sprout',
  title: 'The Winged Lemur',
  goals: {
    'q60-s1': {
      goal: 'Follow the little winged lemur to the old temple.',
      hint: 'It glides from high place to high place. Watch its tail!',
    },
    'q60-s2': {
      goal: 'Make friends: give the lemur 3 fruits.',
      hint: 'Hold the fruit out. Stay still. Don’t grab.',
    },
  },
  scenes: [
    scene(
      'q60-thief',
      [
        N('Your fruit basket is empty. Again!'),
        N('There are tiny footprints. And peach stones in a neat pile.'),
        P('That’s no bird. Birds don’t make neat piles.', 'think'),
        N('Up in a tree sits a furry thing. Big ears. Wings!'),
        M('Chirrup!', 'happy'),
        P('A winged lemur! They used to live at the old temple.', 'happy'),
        N('It grabs a peach and glides away. Whee!'),
        P('Let’s follow it. Gently!'),
      ],
      [
        act(
          2,
          'maths',
          'count to 3',
          'edu:count:peach-stones:3',
          [
            P('How many peach stones? Let’s count.'),
            N('(Point to each stone and count.)'),
            P('One, two, three. Three peaches gone!', 'happy'),
          ],
          'Your child counted three peach stones, pointing to each one.',
          'K.CC.B.5',
        ),
      ],
      [
        ch('chase', 'Run after it', [N('You run. It looks back. It thinks this is a game!')]),
        ch('bait', 'Leave a fruit out', [P('Clever! It will come back for more.')], { 'q60-bait': true }),
        ch('name', 'Ask what to call it', [
          P('Let’s get to know it first. Then we’ll pick a name.', 'think'),
          N('Chirrup! The lemur seems to like that idea.'),
        ]),
      ],
    ),
    scene(
      'q60-thief-done',
      [
        N('Up in an old temple, under the broken roof…'),
        N('…you find a nest! Fruit stones. Buttons. Your spoon!'),
        P('Oh. It lives up here all alone.', 'soft'),
        M('Chirr.', 'sad'),
      ],
      [
        ask(
          1,
          'science',
          'animal homes',
          [P('Where does the lemur live?')],
          [
            opt('In a nest, up high', [P('Yes! A cosy nest up high, where it feels safe.')], true),
            opt('In the pond', [P('Fish live in ponds. The lemur lives in a nest.'), P('Up high, where it feels safe.')]),
          ],
          'Your child matched an animal to its home.',
          'K-ESS3-1',
        ),
      ],
    ),
    scene(
      'q60-friends',
      [
        N('The temple is quiet and cold.'),
        N('Old paintings show people laughing with lemurs.'),
        P('I learned to fly here. It used to be full of friends.', 'sad'),
        P('The lemur isn’t really a thief. It’s hungry and lonely.', 'soft'),
        N('Your Nubbin sits in the middle. It holds up a fruit.'),
        M('…Chirr?', 'think'),
      ],
      [
        ask(
          3,
          'sel',
          'what helps lonely feelings',
          [P('The lemur is lonely. What helps lonely feelings?')],
          [
            opt('A friend', [P('Yes. A friend. And a little kindness.', 'soft')], true),
            opt('Hiding', [P('Hiding can make lonely feel bigger.'), P('A friend helps. Like us!')]),
          ],
          'Your child named loneliness and thought about what helps.',
          'CASEL: Social awareness',
        ),
      ],
    ),
    scene(
      'q60-friends-done',
      [
        N('The lemur lands on your shoulder. It wraps its tail round your neck.'),
        N('It falls asleep. Zzz.'),
        P('It likes you!', 'happy'),
        P('Should we take it home? Or is this its home?', 'think'),
      ],
      [
        ask(
          3,
          'science',
          'what animals need',
          [P('What does the lemur need to be well?')],
          [
            opt('Food, water and a safe home', [P('Yes! And kind friends.', 'happy')], true),
            opt('A hat', [P('A hat would be funny!'), P('But it needs food, water and a safe home.')]),
          ],
          'Your child named what animals need: food, water and a safe home.',
          'K-LS1-1',
        ),
      ],
      [
        ch(
          'q60-carry',
          'Carry it home to the Grove',
          [P('The Grove has fruit and friends. A good home!', 'soft')],
          { 'q60-home': 'carried' },
        ),
        ch(
          'q60-choose',
          'Leave the door open. Let it choose',
          [N('You walk away slowly. Flap, flap! It lands on your shoulder.'), P('It chose us!', 'happy')],
          { 'q60-home': 'chose' },
        ),
      ],
    ),
    scene(
      'q60-complete',
      [
        P('It loves shiny things. And peaches. I know! Lumi!', 'happy'),
        P('Welcome home, Lumi!', 'soft'),
        M('Chirrup chirrup!', 'happy'),
        N('Lumi rides home on your shoulder. Nibble, nibble.'),
        N('That night, Lumi sleeps in the fruit basket!'),
        P('That explains a lot. Count your spoons!', 'happy'),
      ],
      [
        ask(
          2,
          'literacy',
          'first sounds',
          [P('Lumi starts with L. L-l-Lumi!'), P('What else starts with L?')],
          [
            opt('Lemur', [P('Yes! L-l-lemur! Lumi the lemur!', 'happy')], true),
            opt('Fruit', [P('Fruit starts with F. F-f-fruit.'), P('Lemur starts with L. L-l-lemur!')]),
          ],
          'Your child listened for the L sound at the start of words.',
          'RF.K.2',
        ),
      ],
    ),
  ],
};

// ------------------------------------------------------------------ Q61
const Q61: EduQuest = {
  id: 'sprout:q61',
  of: 'q61',
  band: 'sprout',
  title: 'Pemba Day',
  goals: {
    'q61-s1': {
      goal: 'Search the old records room for clues.',
      hint: 'The oldest papers are at the back. Your Nubbin can squeeze behind shelves.',
    },
    'q61-s2': {
      goal: 'Show your clues at Pemba’s trial.',
      hint: 'Pick your best clue. Any clue will do!',
    },
  },
  scenes: [
    scene(
      'q61-trial',
      [
        N('Kettleby is having a party. Flags! Sweets!'),
        N('There is a big straw statue of a long-ago hero.'),
        N('People bonk the statue with sticks. Bonk!'),
        P('That’s Avatar Kesh! She was like me, long ago.', 'shock'),
        TI('Long ago, Kesh made our Marshal Brag fall in the sea!', 'angry'),
        TI('So YOU are in trouble now!'),
        T('He wasn’t even born then!'),
        N('Two guards put Pemba in a cage. It has flags on it.'),
        K('Let’s find out what really happened. Where are the old papers?', 'angry'),
      ],
      [
        ask(
          6,
          'social-studies',
          'fairness: blame only for what you did',
          [N('Is it fair to blame Pemba for something from long ago?')],
          [
            opt('No, he didn’t do it', [N('Right. It’s not fair to blame someone for what they didn’t do.')], true),
            opt('Yes', [N('Hmm. Pemba wasn’t even born then.'), N('Blaming him isn’t fair.')]),
          ],
          'Your child thought about whether it is fair to blame someone for something they did not do.',
          'D2.Civ.8.K-2',
        ),
      ],
      [
        ch('fair', 'Ask for a fair trial', [TI('Of course! Fair, fast, and done by lunch.')]),
        ch(
          'tuk',
          'Let Tuk do the talking',
          [T('Mr Mayor. I will speak for Pemba.'), TI('Have you done this before?'), T('I’ve read a book.')],
          { 'q61-tuk-lawyer': true },
        ),
        ch('sweet', 'Buy a party sweet', [N('It tastes of peppermint. Yum!')], { 'q61-sweet': true }),
      ],
    ),
    scene(
      'q61-trial-done',
      [
        N('You search the old records room. Dusty, dusty!'),
        N('Behind the oldest shelf, your Nubbin finds a scroll.'),
        N('It has Marshal Brag’s own stamp on it.'),
        K('It’s his diary! Look at this!', 'shock'),
      ],
      [
        notice(
          3,
          'social-studies',
          'diaries tell us about long ago',
          [
            K('A diary is a book about your days.'),
            K('People write down what they did and thought.'),
            K('Old diaries tell us about long ago.'),
          ],
          'Your child heard how old diaries and records tell us about the past.',
          'D2.His.2.K-2',
        ),
      ],
    ),
    scene(
      'q61-evidence',
      [
        N('The trial is in the square. Mayor Tibbs is the judge.'),
        N('Mayor Tibbs is also everyone else. Hmm.'),
        K('Brag wrote this: “I will take Kesh’s island.”'),
        T('And this: “Note to self: get a bigger hat.”'),
        N('Someone takes off a Brag hat. They put it in the bin.'),
        TI('He does sound a bit like a bully.', 'shock'),
        K('Kesh didn’t hurt anyone. She looked after her home.'),
        TI('One more clue and I’ll be sure. Keeper?', 'think'),
      ],
      [
        ask(
          3,
          'maths',
          'compare sizes',
          [T('Brag had a big hat. He wanted a bigger one.'), T('Which is bigger: a hat or a house?')],
          [
            opt('A house', [T('Yes! A house is much bigger. Even Brag’s hat wasn’t that big.')], true),
            opt('A hat', [T('A hat fits on your head. A house fits you inside!'), T('The house is bigger.')]),
          ],
          'Your child compared the sizes of two familiar things.',
          'K.MD.A.2',
        ),
      ],
      [
        ch(
          'stone',
          'Show the stone that thanks Kesh',
          [TI('“Thank you, Kesh, for our peace.” It was here all along!', 'shock')],
          { 'q61-evidence': 'stone' },
        ),
        ch('map', 'Show the old map', [TI('We were on her island! She was looking after us!')], { 'q61-evidence': 'map' }),
        ch('kind', 'Say Pemba was kind all day', [TI('That isn’t a clue. But it is very true.', 'soft')], {
          'q61-evidence': 'kind',
        }),
      ],
    ),
    scene(
      'q61-evidence-done',
      [
        TI('Pemba is not guilty! Let him out!'),
        P('Hooray! Can I keep the flags?', 'happy'),
        P('Keeper? Should I say sorry for what Kesh did?', 'think'),
        P('It wasn’t me. But it sort of was.'),
      ],
      [
        notice(
          3,
          'sel',
          'sorry is for what we did; helping is for everyone',
          [
            N('We say sorry for things we did.'),
            N('We don’t have to say sorry for others.'),
            N('But we can always help make things better.'),
          ],
          'Your child heard the difference between saying sorry for our own actions and helping to fix things.',
          'CASEL: Responsible decision-making',
        ),
      ],
      [
        ch('q61-not-yours', '“It’s not your fault.”', [P('Okay. I’ll just try to be kind.', 'soft')], {
          'q61-past': 'not-yours',
        }),
        ch(
          'q61-make-right',
          '“Not your fault. But you can help fix things.”',
          [P('I like that! Fixing is better than blaming.', 'happy'), T('Put that on a sign!')],
          { 'q61-past': 'make-right' },
        ),
      ],
    ),
    scene(
      'q61-complete',
      [
        N('That evening, the old statue comes down.'),
        N('The people make a new one. It looks like Pemba!'),
        TI('From now on, it’s Pemba Day! Fewer sticks, more sweets!', 'happy'),
        P('Best day ever!', 'happy'),
        T('You’re a party now. Don’t let it go to your head.'),
        TI('And next time, we’ll read our old papers first.', 'soft'),
        N('The mayor gives you a painted party mask.'),
      ],
      [
        ask(
          2,
          'maths',
          'more and fewer',
          [TI('Here are 5 sweets and 2 sticks.'), TI('Are there more sweets or more sticks?')],
          [
            opt('More sweets', [TI('Yes! Five is more than two. Hooray for sweets!', 'happy')], true),
            opt('More sticks', [TI('Let’s count. Sweets: five. Sticks: two.'), TI('Five is more. More sweets!')]),
          ],
          'Your child compared two groups to find which has more.',
          'K.CC.C.6',
        ),
      ],
    ),
  ],
};

// ------------------------------------------------------------------ Q62
const Q62: EduQuest = {
  id: 'sprout:q62',
  of: 'q62',
  band: 'sprout',
  title: 'Penguin Sledding',
  goals: {
    'q62-s1': {
      goal: 'Get Pemba out of the ice.',
      hint: 'Tap the glowing cracks. Cuddly Nubbins warm the ice.',
    },
    'q62-s2': {
      goal: 'Make friends with a penguin. Slide down the hill!',
      hint: 'Give a fish first. Lean left and right to steer.',
    },
  },
  scenes: [
    scene(
      'q62-iceberg',
      [
        N('Snow covers the Grove. Everything is white!'),
        N('By the frozen pond sits a giant block of ice.'),
        T('Glowing ice? Not good news. Let’s leave it.'),
        K('It’s Pemba! He sat so still all night, he froze!', 'shock'),
        N('Your Nubbin puts its paws on the ice.'),
        N('Under the ice, a blue arrow glows.'),
        K('Please. Let’s help him.'),
      ],
      [
        ask(
          4,
          'science',
          'warmth melts ice',
          [K('How can we melt the ice?')],
          [
            opt('Make it warm', [K('Yes! Warmth melts ice.'), K('Ice melts back into water. Drip, drip!')], true),
            opt('Make it colder', [K('Colder keeps ice frozen. Brr!'), K('Warmth melts ice. Drip, drip!')]),
          ],
          'Your child learned that warmth melts ice back into water.',
          '2-PS1-4',
        ),
      ],
      [
        ch('crack', 'Tap it with a stone', [N('Tap! A thin crack zigzags across the ice.')]),
        ch('huddle', 'Get your Nubbins to cuddle the ice', [N('The Nubbins snuggle close. They are warm. Drip, drip!')], {
          'q62-huddle': true,
        }),
        ch('tuk', 'Hand Tuk his boomerang', [T('Fine. But Pemba owes me a snack for this.')]),
      ],
    ),
    scene(
      'q62-iceberg-done',
      [
        N('Crack! Whoosh! The ice splits open.'),
        N('Out pops Pemba! His eyebrows are white with frost.'),
        P('Brr! Morning, everyone! Is there breakfast?'),
        P('Do you have any penguins?'),
      ],
      [
        ask(
          3,
          'sel',
          'helping a friend who feels cold',
          [N('Pemba is cold and shivery. What would help him?')],
          [
            opt('A warm blanket and a hug', [N('Yes! Warm and snug. Pemba stops shivering.'), P('Ahh. Much better.', 'happy')], true),
            opt('A big handful of snow', [N('Brr! Snow would make him colder.'), N('A warm blanket and a hug will help.')]),
          ],
          'Your child noticed that a friend was cold and thought about what would help him.',
          'CASEL: Social awareness',
        ),
      ],
    ),
    scene(
      'q62-sled',
      [
        K('Do we have… what?'),
        P('Penguins! Big ones. Slidey ones!', 'happy'),
        T('He was frozen all night. And he wants penguins!'),
        K('Pemba, how long were you in there?', 'soft'),
        P('All night! So quiet. Then so cold. Brr!'),
        P('Penguins look warm. Can I ride one?', 'happy'),
        N('On the snowy hill, penguins waddle past. Waddle, waddle!'),
        P('Give them a fish. Then they give you a ride!'),
        N('Your Nubbin holds out a fish to the smallest penguin.'),
      ],
      [
        notice(
          6,
          'science',
          'penguins are birds that swim and slide',
          [
            K('Penguins are birds. But they can’t fly.'),
            K('They swim very fast in the sea.'),
            K('And they slide on their tummies on the snow!'),
          ],
          'Your child heard that penguins are birds that cannot fly but swim and slide.',
          'ELOF: Scientific Reasoning',
        ),
      ],
    ),
    scene(
      'q62-sled-done',
      [
        N('Down the hill you go! Whee!'),
        N('Over a frozen puddle. Into a big snowdrift. Flump!'),
        N('Pemba lands next to you. He is laughing so hard.'),
        P('Again! Again! AGAIN!', 'happy'),
      ],
      [
        ask(
          1,
          'maths',
          'position words: up and down',
          [N('Did we slide up the hill or down the hill?')],
          [
            opt('Down', [N('Yes! Down, down, down. Whee!')], true),
            opt('Up', [N('Sliding up is very hard!'), N('We slid down the hill.')]),
          ],
          'Your child used the position words up and down.',
          'K.G.A.1',
        ),
      ],
    ),
    scene(
      'q62-complete',
      [
        K('I haven’t seen anyone laugh like that in ages.', 'soft'),
        T('I haven’t seen anyone eat that much snow.'),
        P('The penguins say come back on snow days!', 'happy'),
        P('Thank you for the rescue. And for the penguin ride!', 'soft'),
        N('The penguins waddle home over the hill.'),
        N('The smallest one waves at your Nubbin.'),
      ],
      [
        notice(
          1,
          'science',
          'snow is frozen water',
          [K('Snow is frozen water.'), K('It falls when the air is very cold.'), K('Water freezes at 0 °C (32 °F). Brr!')],
          'Your child heard that snow is frozen water and falls when it is very cold.',
          'K-ESS2-1',
        ),
      ],
    ),
  ],
};

// ------------------------------------------------------------------ Q63
const Q63: EduQuest = {
  id: 'sprout:q63',
  of: 'q63',
  band: 'sprout',
  title: 'King Rumbold’s Challenges',
  goals: {
    'q63-s1': {
      goal: 'Get the king’s key from the waterfall pool.',
      hint: 'A Swim Nubbin can dive for it. Or wait until noon.',
    },
    'q63-s2': {
      goal: 'Find Biscuit the goat-yak.',
      hint: 'Listen for “baa”. Goat-yaks love high places and cabbages.',
    },
    'q63-s3': {
      goal: 'Ride the stone slides down with King Rumbold.',
      hint: 'Lean into the bends. Duck under the letter slots!',
    },
  },
  scenes: [
    scene(
      'q63-throne',
      [
        N('Stonereach is a city cut into a cliff.'),
        N('The king is very old. He has a huge grin.'),
        BU('Visitors! You will do three challenges!', 'happy'),
        BU('If you fail, no pudding!'),
        T('That’s actually quite scary.'),
        N('The king laughs: HEE-HAW! Like a donkey!'),
        BU('Challenge one! My snack key is in the waterfall. Fetch it!', 'happy'),
      ],
      [
        ask(
          5,
          'science',
          'animal sounds',
          [P('Which animal says “hee-haw”?')],
          [
            opt('A donkey', [P('Yes! Donkeys say hee-haw. Just like the king!', 'happy')], true),
            opt('A cat', [P('Cats say meow.'), P('Donkeys say hee-haw!')]),
          ],
          'Your child matched an animal to the sound it makes.',
          'ELOF: Scientific Reasoning',
        ),
      ],
      [
        ch('accept', 'Say yes to the challenge', [BU('Wonderful! Off you go! The fish nibble.')]),
        ch('why', 'Ask why he needs the key', [BU('Because I am hungry! Why else?', 'think')]),
        ch('laugh', 'Laugh with him', [N('You laugh. He laughs more. Your Nubbin brays too!')], { 'q63-laughed': true }),
      ],
    ),
    scene(
      'q63-throne-done',
      [
        BU('My key! My snacks are safe!', 'happy'),
        N('He eats a whole cake in one bite. Gulp!'),
        BU('Challenge one is done!'),
        T('He didn’t even blink.'),
      ],
      [
        ask(
          2,
          'maths',
          'take away 1',
          [BU('Three challenges. One is done. How many are left?'), N('(Hold up three fingers. Fold one down.)')],
          [
            opt('2', [BU('Yes! Two left! Three take away one is two.', 'happy')], true),
            opt('3', [N('Let’s count the fingers still up: one, two.'), BU('Two left!')]),
          ],
          'Your child took one away from three and found two.',
          'K.OA.A.1',
        ),
      ],
    ),
    scene(
      'q63-pet',
      [
        BU('Challenge two! My pet Biscuit ran away. Find him!'),
        T('What kind of animal is Biscuit?'),
        BU('A goat-yak. Like a goat, and also like a yak.', 'happy'),
        N('Somewhere in the city, something goes BAA.'),
        T('Let’s look from the top down. Pemba, take the roofs.', 'think'),
        P('I love roofs!', 'happy'),
        BU('Or think like Biscuit! Where would a goat go?', 'happy'),
        N('Your Nubbin climbs the highest wall. It chews a leaf.'),
      ],
      [
        notice(
          6,
          'science',
          'goats: climbers, and their babies are kids',
          [P('Goats are great climbers.'), P('They love high, rocky places.'), P('And a baby goat is called a kid!')],
          'Your child heard that goats are good climbers and that a baby goat is called a kid.',
          'ELOF: Scientific Reasoning',
        ),
      ],
    ),
    scene(
      'q63-pet-done',
      [
        N('Biscuit is on a roof! He’s eating a cabbage.'),
        N('Down below, a voice wails. It sounds familiar.'),
        BU('Biscuit! That’s two challenges!', 'happy'),
        BU('Oh dear. Biscuit ate someone else’s cabbage.', 'think'),
      ],
      [
        ask(
          3,
          'sel',
          'making things right',
          [BU('What should we do now?')],
          [
            opt(
              'Say sorry and pay for it',
              [BU('Yes. Sorry, and here are some coins.', 'soft'), N('Far below, a happy voice says thank you.')],
              true,
            ),
            opt('Run away', [BU('Hmm. That wouldn’t be fair.'), BU('We say sorry and pay for it.', 'soft')]),
          ],
          'Your child thought about how to make things right when something gets spoilt.',
          'CASEL: Responsible decision-making',
        ),
      ],
    ),
    scene(
      'q63-opponent',
      [
        BU('Challenge three! The last one. Pick who you face!'),
        N('He points at a big guard. Then a rock beast. Then himself.'),
        T('Easy. Don’t pick the beast. Pick the old man.'),
        P('Tuk, I think the old man is the tricky one.', 'think'),
        BU('Choose! I love surprises!', 'happy'),
        N('Your Nubbin shakes its head at all three.'),
      ],
      [
        ask(
          1,
          'maths',
          'first, second, third',
          [BU('First the guard. Second the beast. Who is third?')],
          [
            opt('The king', [BU('Yes! I am third! Third and best!', 'happy')], true),
            opt('The guard', [BU('The guard was first.'), BU('I am third!')]),
          ],
          'Your child used the order words first, second and third.',
          'ELOF: Mathematics Development',
        ),
      ],
      [
        ch('guard', 'Pick the guard', [BU('Wrong! You face… the MAIL CHUTES!', 'happy')], { 'q63-opponent': 'guard' }),
        ch('beast', 'Pick the rock beast', [BU('Wrong! You face… the MAIL CHUTES!', 'happy')], { 'q63-opponent': 'beast' }),
        ch(
          'king',
          'Pick King Rumbold',
          [BU('Close! But wrong!', 'happy'), BU('You face the MAIL CHUTES! And I’m coming too!')],
          { 'q63-opponent': 'king' },
        ),
      ],
    ),
    scene(
      'q63-opponent-done',
      [
        N('Whoosh! Down the stone slide you go!'),
        N('Round and round. Faster and faster!'),
        N('You land in a pile of letters. Flump!'),
        BU('Again! Oh wait, I’m the king. I can go any time!', 'happy'),
      ],
      [
        act(
          2,
          'literacy',
          'sound words',
          'edu:say:sound-words:whoosh',
          [
            BU('Say the sounds with me! Whoosh!'),
            N('(Say “whoosh!” and “flump!” in your biggest voice.)'),
            BU('Whoosh! Flump! Great sound words!', 'happy'),
          ],
          'Your child said sound words that show what something sounds like.',
          'RL.1.4',
        ),
      ],
    ),
    scene(
      'q63-complete',
      [
        BU('You did all three! Do you know why I set them?', 'soft'),
        P('To see if we were brave?'),
        BU('No. To see if you would have fun.'),
        BU('Lots of people forget how to play.'),
        T('That is surprisingly wise.'),
        BU('I know! Take a bit of my slide. And my laugh!', 'happy'),
        N('Biscuit says thank you. By eating your hat.'),
      ],
      [
        notice(
          3,
          'sel',
          'playing together matters',
          [
            BU('Playing is important. For grown-ups too!'),
            BU('We play, we share, we laugh together.'),
            N('(Ask: what is your favourite game to play?)'),
          ],
          'Your child heard that play matters for everyone and talked about a favourite game.',
          'CASEL: Relationship skills',
        ),
      ],
    ),
  ],
};

// ------------------------------------------------------------------ Q64
const Q64: EduQuest = {
  id: 'sprout:q64',
  of: 'q64',
  band: 'sprout',
  title: 'Kaito Says Hello',
  goals: {
    'q64-s1': {
      goal: 'Help Kaito practise what to say, three times.',
      hint: 'Pick the tip you think helps. Each try gets better.',
    },
    'q64-s2': {
      goal: 'Stand next to Kaito while he asks to join.',
      hint: 'Stay by the campfire. Kaito feels braver with a friend.',
    },
  },
  scenes: [
    scene(
      'q64-rehearse',
      [
        N('Behind a pillar, Kaito walks in circles. He talks to a rock.'),
        Z('Oh! Keeper. I wasn’t talking to a rock.', 'shock'),
        Z('Fine. I was. I’m practising.'),
        Z('I want to ask Pemba if I can join his group.'),
        Z('But I get nervous. I get it all wrong.', 'sad'),
        N('Your Nubbin sits on the rock. It listens.'),
        Z('Pemba. Hello. I am a person. Now a good one. Probably.'),
      ],
      [
        ask(
          4,
          'sel',
          'what helps when we feel nervous',
          [N('Kaito feels nervous. What can help?')],
          [
            opt(
              'Practise and take slow breaths',
              [N('Yes! Practice and slow breaths help.'), Z('I’ll try both.', 'soft')],
              true,
            ),
            opt('Never try at all', [N('Then he can’t join his friends.'), N('Practice and slow breaths help.')]),
          ],
          'Your child named feeling nervous and two things that help: practice and slow breaths.',
          'CASEL: Self-management',
        ),
      ],
      [
        ch('honest', 'Say it’s a bit stiff', [Z('Stiff. Right. I can try less stiff.', 'sad')], { 'q64-advice': 'honest' }),
        ch('kind', 'Say it’s a good start', [Z('Really? Thank you.', 'happy'), N('It is a start. Starts are good.')], {
          'q64-advice': 'kind',
        }),
        ch('smile', 'Say: try smiling', [N('Kaito smiles. It looks a bit wobbly.'), Z('Too much?')], {
          'q64-advice': 'smile',
        }),
      ],
    ),
    scene(
      'q64-rehearse-done',
      [
        Z('Try two: “Pemba, I brought you a gift. The gift is me.”'),
        Z('No. Try three: “I’m sorry. I want to help.”', 'think'),
        N('It is the shortest one. It is the best one.'),
        Z('Short and friendly. Short and friendly.'),
        Z('Or maybe I just wave? Waving is friendly.', 'think'),
      ],
      [
        ask(
          2,
          'literacy',
          'speaking clearly: short and kind',
          [Z('Which is better: a long, muddled speech or a short, kind one?')],
          [
            opt('Short and kind', [Z('Short and kind. Got it.', 'happy')], true),
            opt('Long and muddled', [N('Long and muddled is hard to follow.'), Z('Short and kind. Got it.')]),
          ],
          'Your child thought about how to say something clearly and kindly.',
          'SL.K.1',
        ),
      ],
    ),
    scene(
      'q64-ask',
      [
        N('Pemba, Nalu, Tuk and Bao sit by a campfire.'),
        N('Kaito steps out. Everyone jumps!'),
        B('Relax. His heart is beating fast. He’s scared.'),
        N('Kaito does a stiff little wave. His hand stays up.'),
        Z('Um. Hello. It’s me. Kaito.'),
        Z('That was not the speech. Not any of them.', 'think'),
        K('What do you want, Kaito?', 'angry'),
        N('Everyone looks at you. Even your Nubbin.'),
      ],
      [
        notice(
          2,
          'health',
          'feelings and our bodies: a fast heartbeat',
          [B('When we feel scared, our hearts beat fast.'), B('Slow breaths help them calm down.'), N('(Take one slow breath together.)')],
          'Your child heard that fear can make our hearts beat fast, and that slow breaths help.',
          'CASEL: Self-management',
        ),
      ],
      [
        ch('vouch', 'Say he practised for hours', [P('Practising? For us? That’s so nice!', 'happy')], { 'q64-help': 'vouch' }),
        ch('nudge', 'Nudge him to try again', [Z('I’m sorry. I want to help. Can I be on your side?', 'soft')], {
          'q64-help': 'nudge',
        }),
        ch('wave', 'Wave back', [N('You wave back. Pemba waves too. Bao waves the wrong way, as a joke.')], {
          'q64-help': 'wave',
        }),
      ],
    ),
    scene(
      'q64-ask-done',
      [
        P('You can join! Welcome to the team!', 'happy'),
        Z('Really? Just like that?', 'shock'),
        T('Not just like that. There will be rules. On paper.'),
        K('I haven’t forgotten what you did, Kaito.'),
        Z('That’s fair. I want the chance to do better.', 'soft'),
        K('…One chance.'),
      ],
      [
        notice(
          5,
          'sel',
          'sorry, then showing you mean it',
          [
            N('Kaito said sorry. Nalu gave him a chance.'),
            N('Saying sorry is the start.'),
            N('Doing kind things shows you mean it.'),
          ],
          'Your child heard that an apology starts with words and is shown by kind actions.',
          'CASEL: Relationship skills',
        ),
      ],
    ),
    scene(
      'q64-complete',
      [
        N('Later, Kaito finds you by the pillar.'),
        Z('Thank you. For listening. And for the rock.', 'soft'),
        Z('I’m still not good at talking to people.', 'think'),
        Z('But I got a bit better today. I tried three times.', 'happy'),
        N('He waves. Stiff and wobbly. Your Nubbin copies him!'),
      ],
      [
        act(
          3,
          'maths',
          'count to 3',
          'edu:count:tries:3',
          [Z('Count my tries with me.'), N('(Hold up a finger for each try.)'), Z('One, two, three. Each one got better!', 'happy')],
          'Your child counted three tries on their fingers.',
          'K.CC.B.4',
        ),
      ],
    ),
  ],
};

// ------------------------------------------------------------------ Q65
const Q65: EduQuest = {
  id: 'sprout:q65',
  of: 'q65',
  band: 'sprout',
  title: 'The White Lotus',
  goals: {
    'q65-s1': {
      goal: 'Learn the tile game with Uncle Tenzo.',
      hint: 'Flowers in the middle. Rocks at the edge. He will help you.',
    },
    'q65-s2': {
      goal: 'Play a game of tiles with Uncle Tenzo.',
      hint: 'Save the lotus tile for last. Nothing can block it.',
    },
  },
  scenes: [
    scene(
      'q65-tiles',
      [
        N('Rain pitters and patters on the leaves.'),
        N('Under the big tree, Uncle Tenzo has a round board.'),
        I('Keeper! Will you play with me? It’s no fun alone.', 'happy'),
        N('The tiles show flowers, rocks and wind.'),
        N('One special tile shows a white lotus flower.'),
        I('Flowers grow. Rocks block. Wind moves things.'),
        I('The lotus does nothing. That’s why it matters most.', 'think'),
        Z('Uncle, that makes it more confusing.'),
        N('Your Nubbin sniffs a flower tile. It’s wood. Oh.'),
      ],
      [
        act(
          5,
          'maths',
          'sort into groups',
          'edu:sort:tiles:flower-rock-wind',
          [
            I('Let’s sort the tiles into three piles.'),
            N('(Put flowers together, rocks together, wind together.)'),
            I('Flowers here. Rocks there. Wind over there. Lovely!', 'happy'),
          ],
          'Your child sorted tiles into three groups by what they show.',
          'K.MD.B.3',
        ),
      ],
      [
        ch('teach', 'Ask him to teach you', [I('Gladly. Lesson one: don’t rush a tile.', 'happy')]),
        ch('lotus', 'Ask what the lotus does', [I('Patience. The quiet ones often matter most.', 'soft')]),
        ch('snacks', 'Ask if there are snacks', [I('Always! A game with no snacks is no fun.', 'happy')], {
          'q65-snacks': true,
        }),
      ],
    ),
    scene(
      'q65-tiles-done',
      [
        I('Good. You don’t rush. You look at the whole board.'),
        Z('He says that to everyone.'),
        I('I have never said it to you, nephew.'),
        Z('…Hm.'),
      ],
      [
        ask(
          2,
          'sel',
          'taking turns',
          [I('In a game, how do we play fairly?')],
          [
            opt('Take turns', [I('Yes. My turn, then your turn.', 'happy'), I('Waiting for your turn takes patience.')], true),
            opt('Everyone goes at once', [I('Then the tiles get very muddled!'), I('We take turns. My turn, then your turn.')]),
          ],
          'Your child practised the idea of taking turns and waiting patiently.',
          'CASEL: Self-management',
        ),
      ],
    ),
    scene(
      'q65-game',
      [
        I('Now a real game. I won’t go easy. I’ll go medium.'),
        N('The rain falls harder. Splish, splash!'),
        N('Kaito falls asleep against the tree. Snore.'),
        I('Every tile matters. But no tile wins alone.', 'soft'),
        I('If you lose, don’t sulk. You learned something.'),
        N('Your Nubbins watch every move.'),
        I('Hmm. Clever move. Did you mean it?', 'think'),
      ],
      [
        ask(
          1,
          'science',
          'plants need water',
          [I('Rain is falling. Who is happy about the rain?')],
          [
            opt('The plants', [I('Yes! Plants need water to grow.'), I('Rain falls from clouds and gives them a drink.')], true),
            opt('The kettle', [I('Ha! The kettle has enough water.'), I('Plants need rain to grow.')]),
          ],
          'Your child learned that plants need water, and that rain gives it to them.',
          '2-LS2-1',
        ),
      ],
      [
        ch('meant', 'Say you meant it', [I('Then I’m in trouble!', 'happy')]),
        ch('luck', 'Say it was luck', [I('Honest! I like honest players.', 'soft')]),
        ch('nubbin', 'Point at your Nubbin', [I('A clever Nubbin! I should have known!', 'happy')], {
          'q65-credit': 'nubbin',
        }),
      ],
    ),
    scene(
      'q65-game-done',
      [
        N('You put down your last tile.'),
        N('Flowers bloom all over the board.'),
        I('You win! Fair and square! What a happy day!', 'happy'),
        I('Look at the pattern you made.'),
      ],
      [
        ask(
          3,
          'maths',
          'patterns',
          [I('Flower, rock, flower, rock, flower… what comes next?')],
          [
            opt('Rock', [I('Yes! Flower, rock, flower, rock. A pattern!', 'happy')], true),
            opt('Flower', [I('Let’s say it again: flower, rock, flower…'), I('Rock comes next!')]),
          ],
          'Your child continued an AB pattern.',
          'ELOF: Mathematics Development',
        ),
      ],
    ),
    scene(
      'q65-complete',
      [
        I('Keep this. The white lotus tile.', 'soft'),
        N('It is old and smooth. And a little warm.'),
        I('If you see this tile on a door, you are among friends.'),
        I('Old friends who play slow games. And help.', 'soft'),
        Z('Uncle. Are you in a secret club?'),
        I('A tea club. Mostly. Go back to sleep, nephew.', 'happy'),
        N('Your Nubbin carries the board home on its head.'),
      ],
      [
        notice(
          1,
          'science',
          'the lotus: a pond plant',
          [
            I('A lotus is a flower that grows in ponds.'),
            I('Its roots hold on in the mud.'),
            I('Its flowers open up above the water.'),
          ],
          'Your child heard that a lotus is a pond plant rooted in mud, with flowers above the water.',
          'ELOF: Scientific Reasoning',
        ),
      ],
    ),
  ],
};

// ------------------------------------------------------------------ exports
export const EDU_AVATAR_SPROUT: EduQuest[] = [
  Q46,
  Q47,
  Q48,
  Q49,
  Q50,
  Q51,
  Q52,
  Q53,
  Q54,
  Q55,
  Q56,
  Q57,
  Q58,
  Q59,
  Q60,
  Q61,
  Q62,
  Q63,
  Q64,
  Q65,
];

export const CHECKS: string[] = [
  'edu:count:cabbages:8',
  'edu:place:nubbin:beside',
  'edu:count:crystals:5',
  'edu:count:invites:5',
  'edu:clap:pattern:stomp-clap',
  'edu:count:steep:5',
  'edu:clap:syllables:cactus',
  'edu:count:fruit:5',
  'edu:order:fan-moves',
  'edu:breathe:slow:3',
  'edu:trace:letter:t',
  'edu:move:body:hand-breath-eyes',
  'edu:make:face:happy-sad',
  'edu:count:houses:5',
  'edu:tap:shape:triangle',
  'edu:count:peach-stones:3',
  'edu:say:sound-words:whoosh',
  'edu:count:tries:3',
  'edu:sort:tiles:flower-rock-wind',
];
