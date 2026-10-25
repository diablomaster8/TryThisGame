/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Atlas A19, The Dragon Who
 * Fell (How to Train Your Dragon, Berk and the Norse world).
 *
 * Source: atlas-a19.ts (ATLAS_A19 and A19_VARIANTS). One EduScene per original scene (every step
 * scene, every done scene, every complete scene and every variant), id `sprout:<original id>`.
 * Choice ids and `set` flags are copied from the originals, so a19-first still works. Every choice
 * is kept: all of them are gentle and safe at this age. See EDU-STYLE.md. British spelling.
 *
 * Learning angles, from the outline: how people lived on cold northern islands long ago
 * (longhouses, ships, fishing, drying fish), that Berk itself is made up, how animals learn to
 * trust (quiet, food, patience, never grabbing), how a tail or a rudder steers, and that false
 * feet and legs let people walk, run and dance and are nothing to hide.
 *
 * Hard things follow EDU-STYLE.md. No dragon is hurt on the page. The dragon in the pit is left
 * out of sprout (the big one is only “scary”, and the little dragons are afraid of it). Stoick says
 * something unkind to Hiccup and is sorry later; the words are never given. Hiccup’s foot is said
 * plainly: he has a made foot now, and it works. Nothing from the film’s script is quoted, the two
 * lifted lines are not used, and there is no oath and no religious practice.
 *
 * Counting notes: the young riders in A19-15 are Astrid, Fishlegs, Snotlout and the twins, with
 * Hiccup; four training dragons go up (Nadder, Gronckle, Nightmare, Zippleback). The original
 * says “five dragons” there, so this band says “four”.
 */
import type { EduQuest, EduScene, Lesson } from './types';
import type { Line, Choice } from '../config/story';

type Mood = Line['mood'];
const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const H = say('a19-hiccup');
const ST = say('a19-stoick');
const GB = say('a19-gobber');
const A = say('a19-astrid');
const FL = say('a19-fishlegs');
const SN = say('a19-snotlout');
const RF = say('a19-ruffnut');
const TF = say('a19-tuffnut');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

/** One answer option. `best` marks the answer the lesson teaches. */
const opt = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

/** One sprout scene. Lesson ids are `sprout:<of>-l<n>`, numbered in play order. */
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
  lessons: [...beats]
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

/** A lesson that asks. */
const ask = (
  domain: Lesson['domain'],
  skill: string,
  after: number,
  prompt: Line[],
  options: Opt[],
  parentNote: string,
  standard?: string,
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

/** A lesson that tells something true. */
const notice = (
  domain: Lesson['domain'],
  skill: string,
  after: number,
  lines: Line[],
  parentNote: string,
  standard?: string,
): Beat => ({
  domain,
  skill,
  ...(standard ? { standard } : {}),
  kind: 'notice',
  after,
  lines,
  parentNote,
});

/** A lesson the child does. */
const doit = (
  domain: Lesson['domain'],
  skill: string,
  after: number,
  check: string,
  lines: Line[],
  parentNote: string,
  standard?: string,
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

const SCI = 'ELOF: Scientific Reasoning';
const MOVE = 'ELOF: Perceptual, Motor, and Physical Development';

// ================================================================== A19-1 This Is Berk
const Q01: EduQuest = quest(
  'a19-01',
  'This Is Berk',
  {
    'a19-01-s1': {
      goal: 'Sail to Berk. Find a place to sleep.',
      hint: 'Walk up the jetty to Hiccup and Gobber.',
    },
    'a19-01-s2': {
      goal: 'Pump the bellows. Keep the forge fire hot.',
      hint: 'Push long and slow. Push, push, push.',
    },
    'a19-01-s3': {
      goal: 'Help Hiccup wheel his machine out.',
      hint: 'Take the back end, and push.',
    },
  },
  [
    sc(
      'a19-01-arrive',
      [
        N('Your boat bumps into a grey island. It is cold and rainy.'),
        N('This is Berk. Berk is made up, a place in a story.'),
        N('But real Vikings lived on islands like it, long ago.'),
        H('Hello! I am Hiccup. I live here.', 'happy'),
        N('A big man comes down the jetty. He has a hook for a hand.'),
        GB('I am Gobber. What is that little round one?'),
        N('Your Nubbin waves a stubby wing. Gobber waves his hook.'),
      ],
      [
        ask(
          'social-studies',
          'an island has water all round it',
          2,
          [N('(Point to the sea.) Land with sea on every side is called what?')],
          [
            opt(
              'An island',
              [H('Yes! An island. You can sail all the way round it.', 'happy')],
              true,
            ),
            opt('A hill', [H('A hill is a bump of land. An island has sea all round.')]),
            opt('A pond', [H('A pond is a little pool. An island has sea all round.')]),
          ],
          'Learned that an island is land with water all around it, and that Berk is a made-up island.',
          'D2.Geo.2.K-2',
        ),
      ],
      {
        choices: [
          {
            id: 'nubbin',
            label: 'Tell him it’s a Nubbin.',
            then: [GB('A Nubbin! Never heard of one. It cannot be dangerous.')],
          },
          {
            id: 'wing',
            label: 'Let your Nubbin wave a wing at him.',
            then: [N('Your Nubbin waves. Gobber waves his hook back, very politely.')],
          },
          {
            id: 'quiet',
            label: 'Say nothing at all.',
            then: [H('Good idea. Gobber likes a mystery.')],
          },
        ],
      },
    ),
    sc(
      'a19-01-arrive-done',
      [
        GB('You need a job. Come and work at my forge.'),
        N('A forge is where people make things out of iron.'),
        H('Mind the swords. Mind the axes. Mind the ceiling.', 'happy'),
        N('Your Nubbin bonks its head on the ceiling. Bonk!'),
        H('…Told you.'),
        N('Over the forge is a cosy loft. That is your bed.'),
      ],
      [
        doit(
          'literacy',
          'first sounds: h',
          5,
          'edu:say:first-sound:h',
          [
            N('(Say it with me: h-h-hammer, h-h-hook, h-h-Hiccup.)'),
            N('They all start with the same sound: h.'),
          ],
          'Listened for the first sound h in hammer, hook and Hiccup.',
          'RF.K.2',
        ),
      ],
    ),
    sc(
      'a19-01-raid',
      [
        N('Horns toot in the night. A dragon lifts a sheep off a wall.'),
        N('The sheep looks very surprised.'),
        GB('Bellows! Pump, pump, pump! Make the fire hot!'),
        N('You push the bellows. Whoosh, the fire gets bigger!'),
        N('Your Nubbin sits on the anvil. Bang, bang, and it covers its ears!'),
        H('I want to help out there. But everyone says stay in here.', 'sad'),
        GB('Out there you might get hurt. In here you are safe.'),
        N('Hiccup sighs. Then he gets on with his work.'),
      ],
      [
        doit(
          'science',
          'a fire needs air to burn',
          3,
          'edu:blow:air:hand',
          [
            N('(Puff on your hand. Whoosh, can you feel the air?)'),
            GB('Bellows push air at the fire. Air makes it burn hot.'),
          ],
          'Felt moving air on their hand and learned that a fire needs air, which is why a forge has bellows.',
          SCI,
        ),
      ],
    ),
    sc(
      'a19-01-raid-done',
      [
        N('Your arms feel like jelly.'),
        N('Your Nubbin is asleep on the anvil. Snore, snore.'),
        GB('Good work, helper.'),
        GB('Hiccup, stay here. Stay. Here.'),
      ],
      [
        doit(
          'maths',
          'count to 5',
          1,
          'edu:count:pumps:5',
          [
            N('(Pump your arms like the bellows. Count them out.)'),
            N('One, two, three, four, five! Five big pumps.'),
          ],
          'Counted five bellows pumps out loud.',
          'K.CC.B.5',
        ),
      ],
    ),
    sc(
      'a19-01-launcher',
      [
        N('Gobber goes out. Hiccup pulls a sheet off a machine.'),
        N('It has wheels, a crank and three stones on ropes.'),
        H('I made it. It catches a dragon in ropes.'),
        H('It is heavy. Please, can you help me push?'),
        N('Your Nubbin looks at the wheels. It wants to help, too.'),
      ],
      [
        ask(
          'sel',
          'helping a friend who asks',
          3,
          [N('Hiccup needs a hand. What is a good thing to do?')],
          [
            opt('Say yes and help', [H('Thank you! Many hands make it easy.', 'happy')], true),
            opt('Walk away', [H('That is a bit lonely for me. Helping is kinder.', 'soft')]),
            opt('Hide', [H('Hiding will not move my machine. A helper will!', 'think')]),
          ],
          'Talked about how a good friend helps when asked.',
          'CASEL: Relationship skills',
        ),
      ],
      {
        choices: [
          {
            id: 'help',
            label: 'Take the back end.',
            then: [N('You take the back end. It is heavy!'), H('Thank you.', 'happy')],
          },
          {
            id: 'gobber',
            label: 'Gobber said to stay here.',
            then: [
              H('Gobber says lots of things. Come on.', 'think'),
              N('You find you are pushing the back end, too.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a19-01-launcher-done',
      [
        N('Out into the lane you go.'),
        N('Creak, creak, creak go the wheels.'),
        N('Round and round, the wheels turn.'),
        N('A wheel is the shape of a circle.'),
      ],
      [
        doit(
          'maths',
          'name a circle',
          3,
          'edu:tap:shape:circle',
          [
            N('(Point to something round, like a plate, a clock or a wheel.)'),
            N('A circle! It rolls and rolls.'),
          ],
          'Found and named a circle, and saw that wheels are circles.',
          'K.G.A.2',
        ),
      ],
    ),
    sc(
      'a19-01-complete',
      [
        N('Up the hill you go with the machine.'),
        H('Now we wait. Shh.'),
        N('Hiccup’s hands shake a little.'),
        H('I am a bit scared. I will take slow breaths.', 'soft'),
        N('In and out. In and out.'),
        N('High in the sky, something screeches.'),
      ],
      [
        doit(
          'health',
          'slow breaths help when we are nervous',
          4,
          'edu:breathe:slow:3',
          [
            N('(Breathe in slowly, then breathe out slowly. Do it three times.)'),
            H('Slow breaths help my hands stop shaking.', 'happy'),
          ],
          'Practised three slow breaths, a way to feel calmer when nervous.',
          MOVE,
        ),
      ],
    ),
  ],
);

// ================================================================== A19-2 The Night Fury
const Q02: EduQuest = quest(
  'a19-02',
  'The Night Fury',
  {
    'a19-02-s1': {
      goal: 'Watch the sky with Hiccup. See where the shot goes.',
      hint: 'Stay by the machine and look at the stars.',
    },
    'a19-02-s2': {
      goal: 'Run down the hill with Hiccup.',
      hint: 'Hide behind the torch posts in the square.',
    },
    'a19-02-s3': {
      goal: 'Stand next to Hiccup while he talks to his dad.',
      hint: 'Stay close. You do not have to say anything.',
    },
  },
  [
    sc(
      'a19-02-shot',
      [
        N('It is a dark night. Torches glow on the hill.'),
        N('Wheeeee! A high whistle flies through the sky.'),
        H('That is the dragon nobody sees. Shh. Watch the stars.'),
        N('You look up. The stars twinkle, and something dark hides a few.'),
        H('There! I will aim, and fire!'),
        N('Zoom, the ropes fly up! Something falls behind the ridge.'),
        H('I hit it! Did anyone see?', 'shock'),
        N('You saw. Your Nubbin saw, too.'),
      ],
      [
        ask(
          'science',
          'we see stars at night',
          3,
          [N('(Point up.) At night, what twinkles in the dark sky?')],
          [
            opt(
              'Stars',
              [H('Yes! Stars. They are always there. We see them best when it is dark.', 'happy')],
              true,
            ),
            opt('The Sun', [H('The Sun shines by day. At night we see the Moon and stars.')]),
            opt('A rainbow', [
              H('Rainbows come in the day, when sun and rain meet. At night: stars!'),
            ]),
          ],
          'Named the stars as what we see twinkling in the night sky.',
          '1-ESS1-1',
        ),
      ],
      {
        choices: [
          {
            id: 'saw',
            label: 'Tell him you saw it.',
            then: [H('You saw it! Somebody saw it. Good.', 'happy')],
          },
          {
            id: 'ridge',
            label: 'Point to where it fell.',
            then: [N('You point at the dark ridge. Hiccup learns the spot, like a map.')],
          },
          {
            id: 'sure',
            label: 'Ask if he’s sure.',
            then: [H('Yes. It fell. Things only fall like that if something is wrong.', 'think')],
          },
        ],
      },
    ),
    sc(
      'a19-02-shot-done',
      [
        N('Crack! A wooden post snaps behind you.'),
        N('Something big has landed on the cliff.'),
        N('It is red and bumpy. It does not look happy.'),
        N('It is wide awake, and it has seen you.'),
      ],
      [
        doit(
          'music',
          'high sounds and low sounds',
          3,
          'edu:make:sound:high-low',
          [
            N('(Make a high whistle. Now make a low rumble.)'),
            N('The night whistle was high. The big red dragon’s grumble is low.'),
          ],
          'Made a high sound and a low sound and compared them.',
          '1-PS4-1',
        ),
      ],
    ),
    sc(
      'a19-02-chase',
      [
        N('The big red dragon sniffs the air. Run!'),
        H('Not that one! Run! Running is good!', 'shock'),
        N('You run down the hill. Thump, thump, thump!'),
        N('Your Nubbin runs through Hiccup’s legs. Twice!'),
        H('Left! No, the other left! Behind the post!'),
        N('You hide. A giant man steps out and shoos the dragon away.'),
        N('The dragons fly off. The night goes quiet.'),
      ],
      [
        ask(
          'health',
          'our heart beats faster when we run',
          2,
          [N('(Put a hand on your chest.) When we run, what does our heart do?')],
          [
            opt(
              'Beats faster',
              [N('Yes, thump-thump-thump! It pumps blood to your legs to help them run.')],
              true,
            ),
            opt('Stops', [N('Your heart keeps going. It beats faster to help your legs run.')]),
            opt('Goes to sleep', [
              N('It stays awake. It beats faster when you run, then slows down to rest.'),
            ]),
          ],
          'Learned that the heart beats faster during running and slows when we rest.',
          MOVE,
        ),
      ],
    ),
    sc(
      'a19-02-chase-done',
      [
        N('The giant man is Stoick. He is Hiccup’s dad.'),
        ST('Hiccup.'),
        H('Hi, Dad.', 'sad'),
        N('Hiccup’s shoulders go down. He looks small.'),
      ],
      [
        ask(
          'sel',
          'naming a feeling in someone else',
          3,
          [N('How do you think Hiccup feels?')],
          [
            opt(
              'Worried and a bit sad',
              [N('Yes. His shoulders went down, and that tells us how he feels.')],
              true,
            ),
            opt('Very silly and giggly', [
              N('Not quite. Look at his face and shoulders: he looks worried.'),
            ]),
            opt('Sleepy', [N('It is late, but his face is worried, not sleepy.')]),
          ],
          'Read a character’s body language to name a feeling.',
          'CASEL: Social awareness',
        ),
      ],
    ),
    sc(
      'a19-02-nobody',
      [
        N('Stoick is the chief. He is big and very tired.'),
        H('I hit a dragon! Up on the cliff!'),
        ST('Something always gets broken when you go out.', 'angry'),
        ST('I have a village to feed. Winter is coming.'),
        H('I know what I saw.'),
        N('Some people laugh. Hiccup looks at his feet.'),
        GB('This is our new helper. And a little hatchling.'),
      ],
      [
        doit(
          'literacy',
          'tell what happened in order: first, next, last',
          6,
          'edu:order:story:first-next-last',
          [
            N('(Let us tell it in order. First, Hiccup shot at the dark.)'),
            N('Next, something fell. Last, nobody believed him.'),
            N('(Say it together: first, next, last.)'),
          ],
          'Retold part of the story in order, using first, next and last.',
          'RL.K.3',
        ),
      ],
      {
        choices: [
          {
            id: 'back',
            label: 'Say you saw it too.',
            then: [
              ST('It is easy to see things in the dark.'),
              N('He is not unkind. He is just very busy tonight.'),
            ],
          },
          {
            id: 'stand',
            label: 'Say nothing. Stand next to Hiccup.',
            then: [N('You stand close. He can tell you are there.'), H('Thanks.', 'soft')],
          },
        ],
      },
    ),
    sc(
      'a19-02-complete',
      [
        N('Gobber takes you home to the forge.'),
        H('They think I am a joke.', 'sad'),
        N('Hiccup goes up to his corner. He takes out his charcoal.'),
        N('Scratch, scratch, scratch. He draws what he saw.'),
        N('He does not want to forget it.'),
      ],
      [
        doit(
          'art',
          'making marks with charcoal',
          3,
          'edu:draw:charcoal:line',
          [
            N('(Draw a long line with a black crayon. Now a curly one.)'),
            N('Charcoal is burnt wood. It makes black marks, like your crayon.'),
          ],
          'Made lines with a black crayon and learned that charcoal is burnt wood.',
          'ELOF: Perceptual, Motor, and Physical Development',
        ),
      ],
    ),
  ],
);

// ================================================================== A19-3 The Fleet Sails
const Q03: EduQuest = quest(
  'a19-03',
  'The Fleet Sails',
  {
    'a19-03-s1': {
      goal: 'Go to the Great Hall. Hear what the chief says.',
      hint: 'The hall is at the top of the village. Stand at the back.',
    },
    'a19-03-s2': {
      goal: 'Help load the ships.',
      hint: 'Carry things from the sheds down to the jetty.',
    },
    'a19-03-s3': {
      goal: 'Look at Hiccup’s notebook.',
      hint: 'It is open on the bench in the forge.',
    },
  },
  [
    sc(
      'a19-03-hall',
      [
        N('In the morning, the Great Hall smells of smoke and wool.'),
        N('A fire burns in a long line down the middle.'),
        ST('I will take the ships and find the dragons’ home.'),
        N('Nobody cheers. It is a long, cold trip.'),
        ST('Hiccup, you will go to dragon school.'),
        H('Oh dear.', 'sad'),
      ],
      [
        notice(
          'social-studies',
          'long ago, villages met in a big hall with a fire',
          1,
          [
            N('Long ago, Viking villages had a big hall.'),
            N('It had a fire in the middle. People met there to talk and eat.'),
          ],
          'Learned that Viking villages had a long hall with a fire in the middle, where people met.',
          'D2.His.2.K-2',
        ),
      ],
    ),
    sc(
      'a19-03-hall-done',
      [
        GB('Dragon school starts tomorrow, in the arena.'),
        GB('Bring the lad. And bring the hatchling.'),
        N('Gobber winks. Your Nubbin salutes with a wing.'),
        N('Who is going? Hiccup, you, and your Nubbin.'),
      ],
      [
        doit(
          'maths',
          'count three things',
          3,
          'edu:count:friends:3',
          [
            N('(Hold up one finger for Hiccup, one for you, and one for the Nubbin.)'),
            N('One, two, three! Three are going to school.'),
          ],
          'Counted three friends on their fingers.',
          'K.CC.B.5',
        ),
      ],
    ),
    sc(
      'a19-03-docks',
      [
        N('All day you carry things to the ships.'),
        N('Barrels of fish, coils of rope and big round shields.'),
        N('The ships are made of wood. Wood floats on water.'),
        ST('Listen to Gobber, Hiccup.'),
        H('I will.'),
        N('Stoick gives Hiccup a quick pat on the head. Then he goes aboard.'),
        N('The ships sail away. Hiccup watches them go.'),
      ],
      [
        ask(
          'science',
          'wood floats and stones sink',
          2,
          [N('Wood floats. Which of these would float on the water?')],
          [
            opt(
              'A wooden spoon',
              [N('Yes! Wood floats, so a wooden spoon would bob along.')],
              true,
            ),
            opt('A stone', [N('Plop! A stone sinks, because it is heavy for its size.')]),
            opt('An iron nail', [N('Plop! A nail sinks too, and wood is the one that floats.')]),
          ],
          'Sorted things that float from things that sink, starting with wood.',
          '2-PS1-1',
        ),
      ],
      {
        choices: [
          {
            id: 'wave',
            label: 'Wave the ships off.',
            then: [N('You wave, and your Nubbin waves an oar. Careful, Nubbin!')],
          },
          {
            id: 'stand',
            label: 'Stand with Hiccup until the sails are gone.',
            then: [N('You stand with him until there is only grey water.')],
          },
        ],
      },
    ),
    sc(
      'a19-03-docks-done',
      [
        H('He did that when I was little.', 'soft'),
        N('A pat on the head. It is a hug with no arms.'),
        N('Hiccup misses his dad already.'),
        N('That is all right. Missing someone is a big feeling.'),
      ],
      [
        ask(
          'sel',
          'what helps when we miss someone',
          2,
          [N('Hiccup feels sad. What helps when we miss someone?')],
          [
            opt(
              'A hug or a chat with a friend',
              [H('Yes. It helps me to have you here.', 'soft')],
              true,
            ),
            opt('Being all alone', [H('That makes it feel bigger. A friend nearby is better.')]),
            opt('Pretending to feel fine', [H('It is all right to feel sad. Saying so helps.')]),
          ],
          'Talked about what helps when you miss someone: a hug and a friend.',
          'CASEL: Self-management',
        ),
      ],
    ),
    sc(
      'a19-03-notebook',
      [
        N('At night Hiccup leaves his notebook open.'),
        N('Every page has a dragon. Each one is drawn with care.'),
        N('Look at the wings, the eyes, the tails.'),
        N('The last page is empty. It only says: Night Fury.'),
        H('Nobody has seen one up close. Nobody can draw it.'),
        N('Hiccup looks at the empty page for a long time.'),
      ],
      [
        doit(
          'art',
          'look for shapes in a drawing',
          2,
          'edu:look:dragon:shapes',
          [
            N('(Look at the dragon’s eye. Can you see a circle?)'),
            N('(Now the wings. Can you see a triangle?)'),
          ],
          'Looked for circles and triangles in the dragon drawings.',
          'K.G.A.2',
        ),
      ],
      {
        choices: [
          {
            id: 'blank',
            label: 'Ask why the page is still empty.',
            then: [
              H('I did not see it properly. I want to get it right.'),
              N('He talks like an artist. He does not notice.'),
            ],
          },
          {
            id: 'catch',
            label: 'Ask what he’ll do if he finds it.',
            then: [
              H('Bring it home. Then people will see me.'),
              N('He says it fast, as if he practised.'),
            ],
          },
          {
            id: 'good',
            label: 'Say his drawings are good.',
            then: [
              H('Thank you!', 'happy'),
              N('He looks at the dragon’s eye, as if he might fix it.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a19-03-complete',
      [
        H('Tomorrow I will go to the ridge.'),
        H('Do you want to come? You do not have to.'),
        N('Your Nubbin is already at the door.'),
        N('Nubbin, Night Fury and No: they all start with n.'),
      ],
      [
        doit(
          'literacy',
          'first sounds: n',
          3,
          'edu:say:first-sound:n',
          [N('(Say it with me: n-n-Nubbin, n-n-night, n-n-no.)'), N('They all start with n!')],
          'Listened for the first sound n in Nubbin, night and no.',
          'RF.K.2',
        ),
      ],
    ),
  ],
);

// ================================================================== A19-4 The Bound Dragon
const Q04: EduQuest = quest(
  'a19-04',
  'The Bound Dragon',
  {
    'a19-04-s1': {
      goal: 'Search the woods for what fell.',
      hint: 'Follow Hiccup. Look for broken trees.',
    },
    'a19-04-s2': {
      goal: 'Stay with Hiccup. Keep back and watch.',
      hint: 'Stand at the top of the rise.',
    },
    'a19-04-s3': {
      goal: 'Walk back to the village with Hiccup.',
      hint: 'Take the long way round, through the woods.',
    },
  },
  [
    sc(
      'a19-04-woods',
      [
        N('The woods are wet and grey. Hiccup has a map with crosses.'),
        H('Nothing here. Nothing here. Nothing here.', 'sad'),
        N('A branch swings back and bonks him. Your Nubbin ducks.'),
        N('Then you stop. A pine tree is snapped in two.'),
        N('The ground has a long, dark scratch in it.'),
        H('That is where it came down!', 'shock'),
        N('Something is breathing on the other side of the hill.'),
      ],
      [
        ask(
          'science',
          'animals leave signs behind',
          4,
          [N('(Point to the scratch.) What signs might an animal leave when it passes?')],
          [
            opt(
              'Footprints and broken twigs',
              [N('Yes, footprints, scratches and broken twigs! Hiccup is a good tracker.')],
              true,
            ),
            opt('Nothing at all', [
              N('Look! The scratch and the broken tree are signs that something came this way.'),
            ]),
            opt('A rainbow', [
              N('A rainbow is made by sun and rain. Animals leave footprints and twigs.'),
            ]),
          ],
          'Learned that animals leave signs such as footprints, scratches and broken twigs.',
          'K-ESS2-2',
        ),
      ],
    ),
    sc(
      'a19-04-bound',
      [
        N('A black dragon lies in the ropes. It is very still.'),
        N('Hiccup takes out his knife. He holds it up.'),
        H('This is what Vikings do.'),
        N('The dragon opens one green eye. It looks tired.'),
        H('I cannot. I did this to you.', 'sad'),
        N('Hiccup cuts the ropes instead. Snip, snip, snip.'),
        N('The dragon jumps up and roars. Then it flies off.'),
        N('Your Nubbin is scared. It hides behind a stump and shakes.'),
      ],
      [
        ask(
          'sel',
          'what helps a scared friend',
          7,
          [N('Your Nubbin is scared. What helps a scared friend?')],
          [
            opt(
              'Stay close and be gentle',
              [N('Yes. Staying close and being gentle makes a scared friend feel safe.')],
              true,
            ),
            opt('Shout at it', [N('Shouting makes scared feelings bigger. Gentle is better.')]),
            opt('Walk far away', [
              N('A scared friend needs someone near. Stay close and be calm.'),
            ]),
          ],
          'Talked about how to help a scared friend: stay close, be gentle and calm.',
          'CASEL: Relationship skills',
        ),
      ],
      {
        choices: [
          {
            id: 'ran',
            label: 'Scoop your Nubbin up and run.',
            set: { 'a19-first': 'ran' },
            then: [
              N('You scoop it up and walk away fast.'),
              N('It holds on tight, and so do you. You are both very scared.'),
            ],
          },
          {
            id: 'crouch',
            label: 'Crouch where you are, and let it come to you.',
            set: { 'a19-first': 'crouch' },
            then: [
              N('You crouch low and wait, one hand flat on the ground.'),
              N('It takes a long time. Then a small shape snuggles your knee.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a19-04-bound-done',
      [
        N('Hiccup sits up. He looks at his knife.'),
        H('I could not. Why could I not?', 'sad'),
        N('Thump, thump goes his heart. Slowly it calms down.'),
        N('A calm heart has a slow, steady beat.'),
      ],
      [
        doit(
          'music',
          'a slow beat and a fast beat',
          3,
          'edu:clap:beat:slow-fast',
          [
            N('(Clap a slow, steady beat. Now clap a fast one.)'),
            N('Which beat feels calmer? The slow one!'),
          ],
          'Clapped a slow beat and a fast beat and noticed which feels calmer.',
          '1-PS4-1',
        ),
      ],
    ),
    sc(
      'a19-04-walk',
      [
        N('You walk back to the village together.'),
        H('Please keep a secret for me.'),
        N('He stops. Your Nubbin looks up at him.'),
        H('I do not know why I did not do it.'),
        N('The arena horn blows. School is starting.'),
        H('Oh good. My favourite.', 'sad'),
      ],
      [
        ask(
          'social-studies',
          'a good friend keeps a promise',
          3,
          [N('Hiccup trusts you. What does a good friend do with a promise?')],
          [
            opt(
              'Keep it',
              [N('Yes! Kept promises build trust. A worrying secret? Tell a grown-up.')],
              true,
            ),
            opt('Forget it', [N('A promise is something to remember. A good friend remembers.')]),
            opt('Tell it to everyone', [
              N('That would not be keeping it. A friend keeps promises safe.'),
            ]),
          ],
          'Talked about keeping a promise to a friend, and telling a trusted grown-up about any secret that worries you.',
          'D2.Civ.8.K-2',
        ),
      ],
      {
        choices: [
          {
            id: 'keep',
            label: 'Promise you won’t tell.',
            then: [H('Thank you. Really.'), N('You carry the promise carefully all day.')],
          },
          {
            id: 'why',
            label: 'Ask him why he didn’t.',
            then: [
              H('I will tell you when I know. Is that all right?', 'think'),
              N('You say it is.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a19-04-complete',
      [
        N('Hiccup goes ahead to the arena.'),
        N('You follow, slower.'),
        N('Your Nubbin stays close. It keeps checking you are there.'),
        N('Far away in the woods, branches crash. Then it goes quiet.'),
      ],
      [
        notice(
          'science',
          'young animals stay close to a grown-up who keeps them safe',
          2,
          [
            N('Baby ducks follow their mother in a line. Lambs stay close to their mums.'),
            N('Young animals stay near someone who keeps them safe.'),
          ],
          'Learned that many young animals stay close to a grown-up who keeps them safe.',
          '1-LS1-2',
        ),
      ],
    ),
  ],
);

// ================================================================== A19-5 Dragon Training
const Q05: EduQuest = quest(
  'a19-05',
  'Dragon Training',
  {
    'a19-05-s1': {
      goal: 'Go to the arena for dragon school.',
      hint: 'The arena is the stone pit with the chain roof.',
    },
    'a19-05-s2': {
      goal: 'Hand out the shields.',
      hint: 'Run a shield to each young Viking.',
    },
    'a19-05-s3': {
      goal: 'Watch the round. Stay by the wall.',
      hint: 'Stay near the gate, where Gobber can reach you.',
    },
  },
  [
    sc(
      'a19-05-arena',
      [
        N('The arena is a stone pit. It has a roof of chains.'),
        GB('Dragon school! Lesson one: be careful.'),
        N('Young Vikings stand in the middle.'),
        A('I am Astrid. Stay out of my way.'),
        FL('I am Fishlegs! Is that a hatchling?', 'happy'),
        N('Hiccup creeps in last, in a helmet too big for him.'),
      ],
      [
        notice(
          'sel',
          'saying your name is a friendly way to start',
          2,
          [
            N('Astrid and Fishlegs said their names. That is a friendly start.'),
            N('Then the other person knows what to call you.'),
          ],
          'Noticed that saying your own name is a friendly way to meet someone new.',
          'CASEL: Social awareness',
        ),
      ],
    ),
    sc(
      'a19-05-arena-done',
      [
        N('Three more young Vikings come over.'),
        SN('I am Snotlout. Remember my name.'),
        RF('I am Ruffnut.'),
        TF('I am Tuffnut. She is the other one.'),
        N('Your Nubbin goes to the wall.'),
        N('It does its fiercest face. Grrr!'),
        N('A twin pats it on the head.'),
        N('Fish-legs, Ruff-nut, Snot-lout. Each name has two parts.'),
      ],
      [
        doit(
          'maths',
          'count to 5, then add one',
          3,
          'edu:count:vikings:5',
          [
            N('(Count on your fingers: Astrid, Fishlegs, Snotlout, Ruffnut, Tuffnut.)'),
            N('Five! Hiccup is here too, and five and one more is six.'),
          ],
          'Counted five young Vikings, then added one more to make six.',
          'K.OA.A.1',
        ),
        doit(
          'literacy',
          'clap the parts of a word',
          7,
          'edu:clap:syllables:fishlegs',
          [N('(Clap the parts: Fish-legs. Two claps!)'), N('(Now Hic-cup. Two claps again!)')],
          'Clapped the two parts of names such as Fish-legs and Hic-cup.',
          'RF.K.2',
        ),
      ],
    ),
    sc(
      'a19-05-shields',
      [
        GB('Behind this door is a Gronckle. Everyone needs a shield!'),
        N('You run along with shields in your arms.'),
        N('The door bangs. Out rolls a round brown dragon!'),
        FL('A Gronckle! It eats rocks!', 'shock'),
        N('The twins tug on one shield. Tug, tug, tug!'),
        RF('It is mine.'),
        TF('I touched it first.'),
        N('Now there is one shield left, and two people with none.'),
      ],
      [
        ask(
          'social-studies',
          'sharing fairly by taking turns',
          7,
          [N('One shield and two people. What is a fair way to share?')],
          [
            opt(
              'Take turns',
              [N('Yes. Taking turns is fair, because each person gets a go.')],
              true,
            ),
            opt('Grab it fast', [N('Grabbing is not fair. The slow one never gets a go.')]),
            opt('Snap it in half', [N('Then nobody has a good shield! Turns work better.')]),
          ],
          'Talked about a fair way to share one thing between two people: taking turns.',
          'D2.Civ.8.K-2',
        ),
      ],
      {
        choices: [
          {
            id: 'hiccup',
            label: 'Give it to Hiccup.',
            then: [N('Hiccup holds it like a tray.'), H('Thanks! It is a good shield.')],
          },
          {
            id: 'fishlegs',
            label: 'Give it to Fishlegs.',
            then: [FL('Thank you! Hiccup, stand behind me. I am very wide.', 'happy')],
          },
          {
            id: 'nubbin',
            label: 'Prop it by the wall, for your Nubbin.',
            then: [
              N('Your Nubbin crouches behind the shield and peeps over.'),
              GB('Ha! The hatchling has the best plan of all.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a19-05-gronckle',
      [
        N('The Gronckle bumps the young Vikings, one by one.'),
        N('Then only Astrid and Hiccup are left.'),
        A('Get out of the way!', 'angry'),
        H('I am trying! It keeps being where I go!'),
        N('Gobber hooks the Gronckle’s jaw. Its hot rock goes over Hiccup’s head.'),
        N('It leaves a black mark on the wall.'),
        GB('Remember, all of you. Dragons are dangerous in here.'),
        N('Hiccup thinks about a dragon that did not hurt him.'),
      ],
      [
        ask(
          'health',
          'stay back from hot things and tell a grown-up',
          5,
          [N('That rock was very hot. What is safe to do near hot things?')],
          [
            opt(
              'Stay back and tell a grown-up',
              [N('Yes. Hot things can burn, so stay back and get a grown-up.')],
              true,
            ),
            opt('Touch it to check', [
              N('Ouch! Never touch to check: stay back and tell a grown-up.'),
            ]),
            opt('Poke it with a stick', [N('That is not safe. Stay back and tell a grown-up.')]),
          ],
          'Talked about staying back from hot things and telling a grown-up.',
          MOVE,
        ),
      ],
    ),
    sc(
      'a19-05-complete',
      [
        A('You could have got us hurt.', 'angry'),
        H('Sorry. I will try to do better.'),
        N('Astrid is cross. She stomps off.'),
        N('Hiccup goes up into the woods.'),
        N('You and your Nubbin go, too.'),
      ],
      [
        ask(
          'sel',
          'what to do with a cross feeling',
          2,
          [N('Astrid feels cross. What can she do with that cross feeling?')],
          [
            opt(
              'Take a deep breath and say how she feels',
              [N('Yes. Breathing slowly and using words helps a cross feeling get smaller.')],
              true,
            ),
            opt('Stomp on Hiccup’s toes', [
              N('Ouch! Cross is a fine feeling, but hurting someone is not.'),
            ]),
            opt('Pretend she is not cross', [
              N('It is better to say it. Cross feelings can be told.'),
            ]),
          ],
          'Talked about calm ways to handle a cross feeling: breathe, then use words.',
          'CASEL: Self-management',
        ),
      ],
    ),
  ],
);

// ================================================================== A19-6 The Cove
const Q06: EduQuest = quest(
  'a19-06',
  'The Cove',
  {
    'a19-06-s1': {
      goal: 'Follow Hiccup along the dragon’s trail.',
      hint: 'Follow the broken twigs to a crack in the rocks.',
    },
    'a19-06-s2': {
      goal: 'Sit at the edge of the cove. Watch quietly.',
      hint: 'Sit further back than Hiccup. Keep still.',
    },
  },
  [
    sc(
      'a19-06-trail',
      [
        N('Hiccup follows a trail of broken twigs.'),
        H('It is walking. Why is it walking?', 'think'),
        N('The trail ends at a crack between two rocks.'),
        N('You squeeze through. Your Nubbin walks right through.'),
        N('Inside is a cove, a round hollow with a lake.'),
        N('Something black zooms past the lake!'),
      ],
      [
        notice(
          'science',
          'animals live where they find food, water and shelter',
          4,
          [
            N('This cove has water, fish and high rock walls.'),
            N('Animals live where they find food, water and a safe place.'),
          ],
          'Learned that animals live where their needs are met: food, water and shelter.',
          'K-ESS3-1',
        ),
      ],
    ),
    sc(
      'a19-06-cove',
      [
        N('The dragon runs and flaps. Up, up, and plop, down!'),
        N('It tries again, and again. Plop!'),
        H('Look at its tail.'),
        N('It should have two tail fins, but one is torn off.'),
        H('That was my ropes. It cannot steer.', 'sad'),
        N('Hiccup sits on a rock and starts to draw.'),
        N('You sit further back, so the dragon has space.'),
      ],
      [
        ask(
          'maths',
          'take one away from two',
          3,
          [N('A tail has two fins, and one is torn off. How many are left?')],
          [
            opt('One', [N('Yes! Two take away one leaves one.')], true),
            opt('Two', [N('Two would be the whole set. One is torn off, so one is left.')]),
            opt('None', [N('There is still one whole fin. Two take away one is one.')]),
          ],
          'Worked out that two take away one leaves one.',
          'K.OA.A.1',
        ),
      ],
      {
        choices: [
          {
            id: 'dragon',
            label: 'Watch the dragon.',
            then: [N('It tries the lake and snaps at fish. It misses them all.')],
          },
          {
            id: 'hiccup',
            label: 'Watch Hiccup.',
            then: [N('He rubs out a line and draws it again, slower.')],
          },
          {
            id: 'nubbin',
            label: 'Watch your Nubbin.',
            then: [N('Your Nubbin peeps at the dragon from behind your ankle.')],
          },
        ],
      },
    ),
    sc(
      'a19-06-cove-done',
      [
        N('The dragon looks right at Hiccup.'),
        N('Hiccup drops his charcoal.'),
        N('It rolls away, down into the cove.'),
        N('Nobody moves. Everybody keeps calm.'),
      ],
      [
        doit(
          'sel',
          'keeping still and calm',
          3,
          'edu:keep:still:count-5',
          [
            N('(Be still as a stone. Count to five, slowly.)'),
            N('Still and slow. That is how you stay calm near a shy animal.'),
          ],
          'Practised keeping their body still and calm while counting to five.',
          'CASEL: Self-management',
        ),
      ],
    ),
    sc(
      'a19-06-complete',
      [
        N('It is nearly dark. Hiccup has drawn the dragon nine times.'),
        H('Here. Have this one. I got the eyes wrong.', 'think'),
        H('They are not angry eyes. I keep drawing them angry.'),
        N('You look at the picture. The eyes are round and kind.'),
      ],
      [
        ask(
          'art',
          'how eyes show feelings in a drawing',
          2,
          [N('(Look at the picture.) Which eyes make a face look kind?')],
          [
            opt('Big, round eyes', [H('Yes! Big round eyes look gentle.', 'happy')], true),
            opt('Eyes with low, pointy eyebrows', [
              H('Those make a face look cross. That is my mistake!', 'think'),
            ]),
            opt('Eyes shut tight', [H('Shut eyes look sleepy. I want it awake and kind.')]),
          ],
          'Looked at how drawn eyes can make a face look kind or cross.',
          'CASEL: Social awareness',
        ),
      ],
    ),
  ],
);

// ================================================================== A19-7 The Knife
const Q07: EduQuest = quest(
  'a19-07',
  'The Knife',
  {
    'a19-07-s1': {
      goal: 'Carry a basket of fish to the cove.',
      hint: 'The basket is by the forge door. It leaks!',
    },
    'a19-07-s2': {
      goal: 'Wait at the cove. Stay low and still.',
      hint: 'Do not move towards the dragon.',
    },
    'a19-07-s3': {
      goal: 'See what the dragon does when the fish is gone.',
      hint: 'Keep still and watch Hiccup.',
    },
  },
  [
    sc(
      'a19-07-basket',
      [
        N('Before dawn, Hiccup packs a basket of fish.'),
        H('The dragon cannot catch anything. It must be hungry.'),
        GB('Where are you going with my fish?'),
        H('Dragon school! Extra studying.'),
        N('The basket is heavy and it leaks. You carry it between you.'),
        N('Plip, plip. Drips fall behind you all the way.'),
        N('At the cove, Hiccup takes a big breath and climbs down.'),
      ],
      [
        ask(
          'health',
          'food gives us energy to grow and play',
          1,
          [N('The dragon is hungry. Why do animals and people need food?')],
          [
            opt(
              'Food gives us energy to grow and play',
              [N('Yes. Food is fuel for our bodies.')],
              true,
            ),
            opt('Food makes us disappear', [N('Ha, no! Food helps us grow bigger and stronger.')]),
            opt('We do not need food', [N('Everyone needs food and water to live and grow.')]),
          ],
          'Talked about why people and animals need food: it gives energy to grow and play.',
          'K-LS1-1',
        ),
      ],
    ),
    sc(
      'a19-07-knife',
      [
        N('Hiccup tips the fish onto the stones. A smoked eel plops out last.'),
        N('The dragon sniffs it. Yuck! It hisses and jumps back.'),
        H('No eel. Got it.'),
        N('Hiccup throws the eel in the lake. Then the dragon sees the knife.'),
        N('It is looking at the knife on Hiccup’s belt.'),
        H('Oh. That.', 'think'),
        N('Hiccup takes out the knife slowly. Plop, it goes in the lake!'),
        N('The dragon sits back. Its ear flaps go up.'),
        N('Then it eats. Munch, munch, munch.'),
      ],
      [
        ask(
          'sel',
          'showing a friend you mean no harm',
          6,
          [N('Hiccup throws the knife away. What does that tell the dragon?')],
          [
            opt(
              'I will be gentle',
              [N('Yes. It says “I mean no harm”, so now the dragon feels safer.')],
              true,
            ),
            opt('I am cross', [
              N('No. A cross person would keep the knife, but throwing it away is gentle.'),
            ]),
            opt('I am hungry', [N('Hiccup is not hungry. He wants the dragon to feel safe.')]),
          ],
          'Talked about how putting something dangerous down shows a friend you mean no harm.',
          'CASEL: Social awareness',
        ),
      ],
      {
        choices: [
          {
            id: 'hands',
            label: 'Put your own hands where it can see them.',
            then: [N('You rest your open hands on your knees. The dragon glances, then eats.')],
          },
          {
            id: 'away',
            label: 'Look away, at the water.',
            then: [N('You look at the water. You hear munching, and nothing else.')],
          },
          {
            id: 'nubbin',
            label: 'Keep a hand on your Nubbin.',
            then: [N('Your hand rests on its back. It is warm and calm.')],
          },
        ],
      },
    ),
    sc(
      'a19-07-name',
      [
        N('When the fish is gone, the dragon coughs up half a fish.'),
        H('Thank you. That is very kind.', 'shock'),
        N('Hiccup eats it and gags. Yuck!'),
        N('The dragon smiles. There are no teeth at all!'),
        N('Then teeth pop out. And fold back in again.'),
        H('Teeth that fold away! I will call you Toothless.', 'happy'),
      ],
      [
        doit(
          'literacy',
          'first sounds: t',
          5,
          'edu:say:first-sound:t',
          [N('(Say it with me: t-t-Toothless, t-t-teeth, t-t-tail.)'), N('They all start with t!')],
          'Listened for the first sound t in Toothless, teeth and tail.',
          'RF.K.2',
        ),
      ],
      {
        choices: [
          {
            id: 'laugh',
            label: 'Laugh.',
            then: [N('You laugh, and Hiccup laughs. Toothless looks from one to the other.')],
          },
          {
            id: 'straight',
            label: 'Keep a straight face.',
            then: [H('You are very polite. He did just sick on me.')],
          },
          {
            id: 'suits',
            label: 'Say the name suits him.',
            then: [H('It does, does it not? A Night Fury called Toothless!', 'happy')],
          },
        ],
      },
    ),
    sc(
      'a19-07-complete',
      [
        N('Toothless lets you stay till noon.'),
        N('He does not let anyone touch him. But he does not leave.'),
        H('Gobber will want his basket back.'),
        H('I will say a dragon ate it.'),
        N('You carry the empty basket home. It smells of fish.'),
      ],
      [
        ask(
          'maths',
          'take away within 10',
          3,
          [N('(Picture five fish in the basket.) If Toothless eats two, how many are left?')],
          [
            opt('Three', [N('Yes! Five take away two leaves three.')], true),
            opt('Two', [N('Two is how many he ate. Five take away two leaves three.')]),
            opt('Five', [
              N('That is how many we started with. After two are eaten, three are left.'),
            ]),
          ],
          'Took 2 away from 5 and found 3 left.',
          'K.OA.A.2',
        ),
      ],
    ),
  ],
);

// ================================================================== A19-8 The Hand
const Q08: EduQuest = quest(
  'a19-08',
  'The Hand',
  {
    'a19-08-s1': {
      goal: 'Watch what Toothless does with the stick.',
      hint: 'Stay at the edge of the sand.',
    },
    'a19-08-s2': {
      goal: 'Sit very still while Hiccup and Toothless meet.',
      hint: 'Do not move. This is not yours to hurry.',
    },
    'a19-08-s3': {
      goal: 'Let Toothless decide about your Nubbin.',
      hint: 'Stay where you are. Let him come, or not.',
    },
  },
  [
    sc(
      'a19-08-lines',
      [
        N('By day four, Toothless lets Hiccup sit closer.'),
        N('Hiccup draws Toothless in the sand with a stick.'),
        N('Toothless picks up a branch. He draws, too!'),
        N('Round and round the cove he goes. Loops and lines everywhere.'),
        H('Is that me? It is very bold.', 'think'),
        N('Hiccup is in the middle of the scribble.'),
        N('If he steps on a line, Toothless growls. If he lifts his foot, purr.'),
        N('So Hiccup steps over each line, one at a time.'),
      ],
      [
        doit(
          'art',
          'curly, straight and zigzag lines',
          3,
          'edu:draw:lines:curly-straight',
          [
            N('(Draw a curly line in the air. Now a straight one, and a zigzag.)'),
            N('Toothless drew loops. What lines can you make?'),
          ],
          'Drew curly, straight and zigzag lines in the air.',
          'ELOF: Perceptual, Motor, and Physical Development',
        ),
      ],
      {
        choices: [
          {
            id: 'step',
            label: 'Step through the lines after him.',
            then: [N('You step carefully over every line. Toothless watches you.')],
          },
          {
            id: 'stay',
            label: 'Stay outside the lines.',
            then: [N('You stay outside the drawing. Toothless seems to like that.')],
          },
        ],
      },
    ),
    sc(
      'a19-08-hand',
      [
        N('Hiccup comes out of the last line. Toothless is very close.'),
        N('Hiccup lifts his hand slowly. Toothless wrinkles his nose.'),
        N('Hiccup stops. He does not pull back, and he does not push forward.'),
        N('Then he shuts his eyes and turns his face away.'),
        N('He holds out his open hand, and waits.'),
        N('Nobody moves. A drip falls from the rock.'),
        N('Then Toothless pushes his nose into Hiccup’s hand.'),
        H('Oh!', 'soft'),
      ],
      [
        doit(
          'sel',
          'waiting quietly and calmly',
          4,
          'edu:wait:quietly:count-10',
          [
            N('(Hold out your hand and wait quietly. Count to ten, slowly.)'),
            N('Slow, calm people make animals feel safe. Ask a grown-up before touching one.'),
          ],
          'Practised waiting quietly and calmly, and heard to ask a grown-up before touching an animal.',
          'CASEL: Self-management',
        ),
      ],
    ),
    sc(
      'a19-08-near',
      [
        N('Toothless looks past Hiccup, at you and your Nubbin.'),
        H('Stay still. Let him choose.'),
        N('Toothless walks across the sand.'),
        N('Your Nubbin does not hide. It is not scared.'),
        N('Toothless bends his big head down. Sniff, sniff, sniff.'),
        N('Your Nubbin sniffs back. Then it bumps its forehead on his nose.'),
        H('He likes it! He does not like anybody.', 'happy'),
      ],
      [
        ask(
          'science',
          'we smell with our nose',
          4,
          [N('Toothless goes sniff, sniff. What do we smell with?')],
          [
            opt('Our nose', [N('Yes! Sniff, sniff, noses are for smelling.')], true),
            opt('Our toes', [N('Toes are for wiggling! We smell with our nose.')]),
            opt('Our elbows', [N('Elbows bend, but they cannot smell. Noses can.')]),
          ],
          'Named the nose as the part of the body we smell with.',
          SCI,
        ),
      ],
    ),
    sc(
      'a19-08-complete',
      [
        H('Did you see that? He is not like the book.'),
        N('Hiccup sits down in the sand, grinning.'),
        H('The book says run, or hurt it. For every dragon.'),
        H('Nobody ever sat still long enough to see.', 'soft'),
      ],
      [
        ask(
          'literacy',
          'words that rhyme',
          3,
          [N('Hiccup sat still. Which word rhymes with still?')],
          [
            opt('Hill', [N('Yes! Still and hill sound the same at the end.')], true),
            opt('Dog', [N('Dog does not rhyme with still. Still and hill do!')]),
            opt('Cat', [N('Cat does not rhyme with still. Still and hill do!')]),
          ],
          'Found a word that rhymes with still.',
          'RF.K.2',
        ),
      ],
    ),
  ],
);

// ================================================================== A19-9 The Tail Fin
const Q09: EduQuest = quest(
  'a19-09',
  'The Tail Fin',
  {
    'a19-09-s1': {
      goal: 'Hold the lamp while Hiccup works.',
      hint: 'Keep it steady and quiet.',
    },
    'a19-09-s2': {
      goal: 'Watch the first flights.',
      hint: 'Stand at the edge of the lake.',
    },
    'a19-09-s3': {
      goal: 'Help Hiccup make a pedal.',
      hint: 'Hammer the stirrup flat at the anvil.',
    },
  },
  [
    sc(
      'a19-09-forge',
      [
        N('At night, Gobber snores upstairs. Honk-shoo, honk-shoo.'),
        N('Hiccup lights a lamp. You hold it for him.'),
        H('Lower. A bit left. Perfect.'),
        N('He cuts leather and stitches a new tail fin for Toothless.'),
        H('Toothless cannot steer with one fin. So I will steer the other.'),
        N('A board creaks. Gobber calls down the stairs.'),
        GB('Who is up? What are you making?'),
        N('You hold the lamp very still.'),
      ],
      [
        ask(
          'science',
          'we see when there is light',
          2,
          [N('You are holding the lamp. Why does Hiccup need it?')],
          [
            opt(
              'So he can see in the dark',
              [H('Yes! Light lets us see. Without it, the night is too dark.', 'happy')],
              true,
            ),
            opt('So he can make a noise', [
              H('A lamp does not make noise. It makes light so I can see.'),
            ]),
            opt('So the leather can sleep', [H('Ha! No. The lamp lights up my work.')]),
          ],
          'Learned that we see things when there is light.',
          '1-PS4-2',
        ),
      ],
      {
        choices: [
          {
            id: 'nubbin',
            label: '“It’s a saddle. For my Nubbin.”',
            then: [
              GB('A saddle for the hatchling! Ha! Southern folk are mad.'),
              N('He goes back to bed. Hiccup grins at you.'),
            ],
          },
          {
            id: 'shield',
            label: '“It’s a new kind of shield.”',
            then: [
              GB('Looks like a saddle.'),
              H('A saddle-shaped shield. For sitting on.'),
              GB('Bed. Both of you.'),
            ],
          },
          {
            id: 'lamp',
            label: 'Blow out the lamp.',
            then: [N('You blow out the lamp. Gobber grumbles and goes back to bed.')],
          },
        ],
      },
    ),
    sc(
      'a19-09-strap',
      [
        N('At the cove, Toothless sniffs the new fin.'),
        N('He sniffs the saddle. He sniffs Hiccup.'),
        H('When I pull this, the fin opens. And you turn.'),
        N('Hiccup climbs on. Toothless spreads his wings.'),
        N('Up they go, round they go, and splash! Into the lake.'),
        N('They try again. Splash, into the lake again!'),
      ],
      [
        doit(
          'maths',
          'count to 2',
          5,
          'edu:count:splashes:2',
          [N('(Count the splashes with me.)'), N('Splash, one, and splash, two! Two splashes.')],
          'Counted two splashes.',
          'K.CC.B.5',
        ),
      ],
      {
        choices: [
          {
            id: 'cheer',
            label: 'Cheer anyway.',
            then: [H('Thank you! That was nearly flying!', 'happy')],
          },
          {
            id: 'wade',
            label: 'Wade in and help fish him out.',
            then: [N('You wade in. Toothless climbs out and shakes water all over you.')],
          },
          {
            id: 'hold',
            label: 'Keep your Nubbin out of the water.',
            then: [N('Your Nubbin wants to dive in. You gently hold it back.')],
          },
        ],
      },
    ),
    sc(
      'a19-09-strap-done',
      [
        H('He turns before I tell him.', 'think'),
        H('I need to know when he wants to turn.'),
        N('Hiccup is listening with his eyes.'),
        N('A friend can tell us things without any words.'),
      ],
      [
        ask(
          'sel',
          'friends show feelings with their face and body',
          3,
          [N('How can a friend tell us a feeling without words?')],
          [
            opt(
              'With their face and body',
              [N('Yes. A smile, a wag or a frown can tell us a lot.')],
              true,
            ),
            opt('They cannot', [N('They can! Faces and bodies say lots without a word.')]),
            opt('Only by shouting', [
              N('Shouting is loud, but faces and bodies tell us softly, too.'),
            ]),
          ],
          'Talked about how friends show feelings with their face and body, not only with words.',
          'CASEL: Social awareness',
        ),
      ],
    ),
    sc(
      'a19-09-pedal',
      [
        N('Back at the forge, Hiccup draws a pedal.'),
        N('A pedal is pushed with a foot. Then the fin opens.'),
        H('Hammer it flat. Flatter!'),
        N('Bang, bang, bang! Your Nubbin brings a bucket of water.'),
        N('At the cove they go up again.'),
        N('This time they miss the lake. Up they go, over the sea!'),
      ],
      [
        doit(
          'science',
          'pushing makes things move',
          1,
          'edu:press:pedal:foot',
          [
            N('(Press your foot down on the floor, like a pedal.)'),
            N('A push moves things. Hiccup’s foot pushes the pedal, and the fin opens.'),
          ],
          'Pressed a foot down like a pedal and heard that a push can make something move.',
          SCI,
        ),
      ],
    ),
    sc(
      'a19-09-pedal-done',
      [
        N('They come back an hour later.'),
        N('They are wet through, with windy hair.'),
        N('They are both wearing the same big grin.'),
        N('Wet clothes feel cold. Dry, warm clothes help.'),
      ],
      [
        ask(
          'health',
          'dry clothes and warmth help when we are wet and cold',
          3,
          [N('Hiccup is wet and cold. What helps?')],
          [
            opt('Dry clothes and a warm blanket', [N('Yes. Dry and warm is just right.')], true),
            opt('More cold water', [N('Brrr! More water makes you colder.')]),
            opt('Nothing', [N('Something helps a lot: dry clothes and a cosy blanket.')]),
          ],
          'Talked about how dry clothes and warmth help when we are wet and cold.',
          MOVE,
        ),
      ],
    ),
    sc(
      'a19-09-complete',
      [
        H('We flew! Him and me.', 'happy'),
        H('Neither of us can do it alone.'),
        N('Toothless pushes Hiccup over and lies on him.'),
        H('Help. He is very heavy.'),
        N('You do not help. It is too lovely to stop.'),
      ],
      [
        ask(
          'sel',
          'teamwork',
          1,
          [N('Friends who each do a part have a special name. What is it?')],
          [
            opt('Teamwork', [N('Yes, teamwork! Each one does a part.')], true),
            opt('Hiding', [N('Hiding is staying out of sight. Helping each other is teamwork.')]),
            opt('A race', [N('A race is who is first. Helping each other is teamwork.')]),
          ],
          'Learned the word teamwork: friends each doing a part.',
          'CASEL: Relationship skills',
        ),
      ],
    ),
  ],
);

// ================================================================== A19-10 Top of the Class
const Q10: EduQuest = quest(
  'a19-10',
  'Top of the Class',
  {
    'a19-10-s1': {
      goal: 'Watch Hiccup in the arena.',
      hint: 'Stand by the gate with Gobber.',
    },
    'a19-10-s2': {
      goal: 'Keep Hiccup’s secret while the village watches.',
      hint: 'Astrid is waiting behind the arena door.',
    },
    'a19-10-s3': {
      goal: 'Go down to the jetty to meet the ships.',
      hint: 'The fleet comes in on the evening tide.',
    },
  },
  [
    sc(
      'a19-10-grass',
      [
        N('Next morning in the arena, the Gronckle charges at Hiccup.'),
        N('Hiccup does not run. He opens his hand.'),
        N('In it is a handful of pale grass from the cove.'),
        N('The Gronckle sniffs it. Then it rolls on its back like a puppy!'),
        FL('That is not in the book!', 'shock'),
        H('I read ahead?'),
        N('Astrid looks at Hiccup. She is thinking hard.'),
      ],
      [
        ask(
          'science',
          'plants need water and light',
          2,
          [N('Grass grows by the cove. What do plants need to grow?')],
          [
            opt(
              'Water and sunlight',
              [N('Yes, water and sunlight! That is why the cove’s grass is green.')],
              true,
            ),
            opt('Only toys', [N('Ha! Toys are fun, but plants need water and sunlight.')]),
            opt('Only music', [N('Music is lovely, but plants need water and sunlight.')]),
          ],
          'Learned that plants need water and light to grow.',
          '2-LS2-1',
        ),
      ],
    ),
    sc(
      'a19-10-grass-done',
      [
        GB('Look at that! Hiccup! Who would have thought?', 'happy'),
        N('Gobber claps. His hook goes clang.'),
        N('Hiccup blinks. Everyone is cheering.'),
        N('Gobber looks surprised. Fishlegs looks surprised.'),
      ],
      [
        doit(
          'literacy',
          'a word for a feeling: surprised',
          3,
          'edu:show:face:surprised',
          [
            N('(Show me a surprised face, with wide eyes and an open mouth!)'),
            N('Surprised is the feeling when something happens that you did not expect.'),
          ],
          'Made a surprised face and learned the feeling word surprised.',
          'RL.1.4',
        ),
      ],
    ),
    sc(
      'a19-10-eel',
      [
        N('Day after day, Hiccup calms every dragon.'),
        N('A Nadder rears up. Hiccup holds up a smoked eel, and it shies away.'),
        N('A Gronckle corners Fishlegs. Hiccup scratches its chin, and it flops down happy.'),
        N('The village comes to watch. They cheer for Hiccup!'),
        A('Where does he go every afternoon?'),
        N('Astrid has caught your elbow. She wants an answer.'),
      ],
      [
        ask(
          'sel',
          'when we cannot tell a secret, we can say so',
          5,
          [N('You cannot share Hiccup’s secret. What is a good thing to say?')],
          [
            opt(
              '“I cannot say. Please ask him.”',
              [N('Yes. That is honest and kind, and it does not tell a fib.')],
              true,
            ),
            opt('Make up a fib', [
              N('A fib makes trust wobbly. Saying “I cannot tell you” is honest.'),
            ]),
            opt('Run away', [N('Running does not help. A calm “I cannot say” does.')]),
          ],
          'Talked about being honest when you cannot share something: say so kindly.',
          'CASEL: Responsible decision-making',
        ),
      ],
      {
        choices: [
          {
            id: 'lie',
            label: 'Tell her he goes fishing.',
            then: [A('Fishing? Hmm.', 'think'), N('She lets go. She does not quite believe you.')],
          },
          {
            id: 'ask',
            label: 'Tell her to ask him herself.',
            then: [A('I did. He said he goes for walks.', 'angry')],
          },
          {
            id: 'shrug',
            label: 'Shrug.',
            then: [A('Fine. I will find out.'), N('It is not a threat. It is more of a plan.')],
          },
        ],
      },
    ),
    sc(
      'a19-10-fleet',
      [
        N('The ships come home on a grey afternoon.'),
        N('Stoick walks up the jetty last. He did not find the dragons’ home.'),
        GB('Stoick! Your boy is the best in the arena!', 'happy'),
        ST('Hiccup? My Hiccup?', 'shock'),
        N('Stoick laughs a big laugh. He lifts Hiccup right off his feet.'),
        ST('I always knew it was in you.', 'happy'),
        N('Hiccup smiles. But it is a wobbly smile.'),
      ],
      [
        ask(
          'maths',
          'taller and shorter',
          4,
          [N('Stoick lifts Hiccup up high. Who is taller, Stoick or Hiccup?')],
          [
            opt('Stoick', [N('Yes! Stoick is the taller one, as big as a door.')], true),
            opt('Hiccup', [N('Hiccup is shorter. That is why Stoick can lift him up.')]),
          ],
          'Compared two people and said which is taller.',
          'K.MD.A.2',
        ),
      ],
    ),
    sc(
      'a19-10-complete',
      [
        H('He is proud of me.'),
        H('But it is for the wrong thing.', 'sad'),
        N('Gobber gives you a round shield.'),
        N('It has blue and gold scales on it. Blue, gold, blue, gold.'),
        GB('Hang it on your door. It says: a helper lives here.'),
      ],
      [
        doit(
          'art',
          'making a colour pattern',
          3,
          'edu:colour:pattern:blue-gold',
          [
            N('(Make a pattern with two colours. Blue, gold, blue, gold.)'),
            N('Which colour comes next? Blue, because a pattern repeats!'),
          ],
          'Made and continued a blue and gold colour pattern.',
          'ELOF: Mathematics Development',
        ),
      ],
    ),
  ],
);

// ================================================================== A19-11 The Flight
const Q11: EduQuest = quest(
  'a19-11',
  'The Flight',
  {
    'a19-11-s1': {
      goal: 'Deal with Astrid at the cove.',
      hint: 'She is on the path down to the cove.',
    },
    'a19-11-s2': {
      goal: 'Watch Toothless take Astrid flying.',
      hint: 'Watch from the cove. The sky is theirs this time.',
    },
    'a19-11-s3': {
      goal: 'Wait at the cove for the last of the light.',
      hint: 'Stay on the sand. Toothless will decide.',
    },
  },
  [
    sc(
      'a19-11-astrid',
      [
        N('Astrid follows Hiccup to the cove.'),
        N('Toothless comes out of the shadows. Astrid sees him!'),
        A('A Night Fury!', 'shock'),
        H('No! He is my friend. Astrid, this is Toothless.'),
        N('Astrid looks at Toothless. She looks at you.'),
        N('Then she turns and runs towards the village.'),
        H('Oh dear. That is very bad.', 'shock'),
      ],
      [
        ask(
          'health',
          'a fright makes our heart beat fast',
          2,
          [N('Astrid got a fright. What does our body do?')],
          [
            opt(
              'Our heart beats fast and we jump',
              [N('Yes, thump-thump! Our body wakes up fast to keep us safe.')],
              true,
            ),
            opt('We turn into a rock', [N('Ha, no! We jump, and our heart beats fast.')]),
            opt('Nothing happens', [N('Something does! Our heart beats fast and we may jump.')]),
          ],
          'Learned that a fright makes the heart beat fast and the body jump.',
          MOVE,
        ),
      ],
      {
        choices: [
          {
            id: 'path',
            label: 'Get in her way.',
            then: [N('You step into the path. Astrid stops.')],
          },
          {
            id: 'sit',
            label: 'Sit down on the path, where she has to pass.',
            then: [N('You sit down in the middle of the path. Astrid nearly trips over you.')],
          },
          {
            id: 'leave',
            label: 'Leave it to Hiccup.',
            then: [N('You stay where you are. It is Hiccup’s secret.')],
          },
        ],
      },
    ),
    sc(
      'a19-11-astrid-done',
      [
        N('Toothless swoops down. He picks Astrid up by her belt.'),
        N('He sets her down on top of a tall pine tree.'),
        A('Get me down from here!', 'angry'),
        H('Let me show you. Then you can decide.'),
      ],
      [
        ask(
          'maths',
          'taller and shorter',
          1,
          [N('Astrid sits on a pine tree. Which is taller, the tree or Astrid?')],
          [
            opt('The pine tree', [N('Yes! The pine is much, much taller.')], true),
            opt('Astrid', [N('Astrid is tall, but the pine tree is much taller.')]),
          ],
          'Compared a tree and a person and said which is taller.',
          'K.MD.A.2',
        ),
      ],
    ),
    sc(
      'a19-11-spin',
      [
        N('Astrid climbs on behind Hiccup. She is stiff as a plank.'),
        H('Toothless, be nice. Bud?'),
        N('Whoosh, up they go! Then round and round.'),
        N('Toothless dips them down and spins them. Wheee!'),
        A('Sorry! Make him stop!', 'shock'),
        N('Toothless stops. He glides up, slow and smooth.'),
        N('They come out on top of the clouds. Gold light is everywhere.'),
      ],
      [
        ask(
          'health',
          'sit down and wait when dizzy',
          4,
          [N('After spinning, the world wobbles, and that is called dizzy. What helps?')],
          [
            opt('Sit down and wait', [N('Yes. Sit still, and the wobble goes away.')], true),
            opt('Spin some more', [N('More spinning makes dizzy worse. Sit down and wait.')]),
            opt('Run very fast', [N('Running when dizzy can make you fall. Sit and wait.')]),
          ],
          'Learned that when we feel dizzy, sitting down and waiting helps.',
          MOVE,
        ),
      ],
    ),
    sc(
      'a19-11-spin-done',
      [
        N('They stay up a long time.'),
        N('When they come down, Astrid’s hair is everywhere.'),
        N('She is not cross any more.'),
        A('That was amazing.', 'soft'),
      ],
      [
        ask(
          'literacy',
          'how a character’s feeling changes',
          3,
          [N('At first Astrid was cross. How does she feel now?')],
          [
            opt('Happy', [N('Yes. Her feeling changed from cross to happy.')], true),
            opt('Sleepy', [N('She does not look sleepy. She said it was amazing.')]),
            opt('Hungry', [N('She might be hungry later! Right now she is happy.')]),
          ],
          'Noticed how a character’s feeling changed after something happened.',
          'RL.2.3',
        ),
      ],
    ),
    sc(
      'a19-11-turn',
      [
        H('One more go, before the light goes.', 'happy'),
        N('Toothless looks at your Nubbin. He lowers his shoulder.'),
        N('You do not lift it. You let it choose.'),
        N('It climbs into Hiccup’s lap by itself.'),
        N('Off they go, low over the water, in the last of the sun.'),
        N('Your Nubbin’s ball glows like a lantern.'),
        N('When they land, it runs to you and sits on you.'),
      ],
      [
        ask(
          'science',
          'night comes after day',
          4,
          [N('The sun is going down. What comes after the day?')],
          [
            opt(
              'Night',
              [N('Yes. The sun goes down and it gets dark, and then it is night.')],
              true,
            ),
            opt('Breakfast', [N('Breakfast is in the morning. After the day comes night.')]),
            opt('Summer', [N('Summer is a season. After day comes night.')]),
          ],
          'Talked about night coming after day as the Sun goes down.',
          '1-ESS1-1',
        ),
      ],
    ),
    sc(
      'a19-11-complete',
      [
        N('Dark comes up from the sea.'),
        A('I have not decided whether to tell. Show me more tomorrow.'),
        N('She punches Hiccup on the arm. Quite hard.'),
        N('Then she nods at you.'),
      ],
      [
        ask(
          'sel',
          'find out before you decide',
          1,
          [N('Astrid wants to see more before she decides. Is that a good idea?')],
          [
            opt(
              'Yes, find out first',
              [N('Yes. Looking and listening first helps us decide well.')],
              true,
            ),
            opt('No, decide right now', [
              N('Deciding too fast can be a mistake. Finding out first is wise.'),
            ]),
          ],
          'Talked about finding out more before making a decision.',
          'CASEL: Responsible decision-making',
        ),
      ],
    ),
  ],
);

// ================================================================== A19-12 The Nest
const Q12: EduQuest = quest(
  'a19-12',
  'The Nest',
  {
    'a19-12-s1': {
      goal: 'Fly out with Hiccup, Astrid and Toothless.',
      hint: 'Hold on tight at the back of the saddle.',
    },
    'a19-12-s2': {
      goal: 'See where the dragons are going.',
      hint: 'Stay low and quiet. Toothless does the flying.',
    },
    'a19-12-s3': {
      goal: 'Fly home quietly.',
      hint: 'There is nothing to do but hold on.',
    },
  },
  [
    sc(
      'a19-12-fog',
      [
        N('Next evening, Astrid is at the cove first.'),
        N('Toothless looks at you. He has not agreed to this.'),
        N('But he lowers his shoulder anyway.'),
        N('You climb on. Your Nubbin is buttoned in your coat.'),
        N('Up you go, into a cloud. The cloud turns to fog.'),
        N('Fog is a cloud that touches the ground or the sea.'),
        N('Dragons come out of the fog, all flying the same way.'),
      ],
      [
        ask(
          'science',
          'fog is tiny drops of water',
          5,
          [N('You are flying in fog. What is fog made of?')],
          [
            opt(
              'Tiny drops of water',
              [N('Yes! Fog is a cloud of tiny water drops, low down.')],
              true,
            ),
            opt('Smoke', [N('Smoke comes from fire. Fog is tiny drops of water.')]),
            opt('Cotton wool', [N('It looks fluffy, but fog is tiny drops of water.')]),
          ],
          'Learned that fog is made of tiny drops of water.',
          SCI,
        ),
      ],
      {
        choices: [
          {
            id: 'hold',
            label: 'Hold your Nubbin tighter.',
            then: [N('You fold your arms round your coat. Your Nubbin snuggles under your chin.')],
          },
          {
            id: 'eyes',
            label: 'Keep your eyes open.',
            then: [N('You keep your eyes open. Somebody should see this.')],
          },
          {
            id: 'belt',
            label: 'Hold on to Astrid’s belt.',
            then: [A('Good. Do not let go.')],
          },
        ],
      },
    ),
    sc(
      'a19-12-pit',
      [
        N('The fog opens. A mountain sits in the sea.'),
        N('The dragons fly in through a crack in its side. So do you.'),
        N('Inside it is huge, hot and red.'),
        N('In the middle is a pit full of mist.'),
        N('One by one, the dragons drop fish and sheep into it.'),
        H('They are not eating it. Why not?', 'think'),
        N('Something big and scary rumbles in the mist.'),
        A('They are not stealing for themselves. They are scared of that!', 'shock'),
        N('Toothless turns. Out, out, back into the fog.'),
      ],
      [
        ask(
          'sel',
          'what to do when scared',
          7,
          [N('Even big dragons can feel scared. What can we do when we are scared?')],
          [
            opt(
              'Hold on to a friend and say so',
              [N('Yes. Saying “I am scared” and holding on to a friend helps.')],
              true,
            ),
            opt('Pretend we are not', [
              N('Pretending keeps the scared feeling inside. Saying so helps.'),
            ]),
            opt('Never tell anyone', [
              N('Telling a friend or a grown-up makes scared feelings smaller.'),
            ]),
          ],
          'Talked about saying you are scared and holding on to a friend.',
          'CASEL: Self-awareness',
        ),
      ],
    ),
    sc(
      'a19-12-home',
      [
        N('Nobody speaks for a long time. Stars come out.'),
        A('We have to tell the village about the nest.'),
        H('Please wait. They will find Toothless.', 'sad'),
        A('That big dragon is dangerous.'),
        H('Give me time. I will think of something.'),
        N('Astrid looks at the back of his head. Toothless flies gently.'),
      ],
      [
        ask(
          'social-studies',
          'when friends disagree, listen to both',
          4,
          [N('Astrid and Hiccup disagree. What helps when two friends disagree?')],
          [
            opt(
              'Listen to both and take turns talking',
              [N('Yes. Listening to both sides is fair.')],
              true,
            ),
            opt('Whoever shouts loudest wins', [
              N('Shouting is not fair. Taking turns to talk is.'),
            ]),
            opt('Walk away and say nothing', [
              N('Walking off leaves the problem. Taking turns to talk helps.'),
            ]),
          ],
          'Talked about listening to both sides when friends disagree.',
          'D2.Civ.8.K-2',
        ),
      ],
      {
        choices: [
          {
            id: 'quiet',
            label: 'Say nothing. Let them have the quiet.',
            then: [N('You say nothing. The wind says it for everyone.')],
          },
          {
            id: 'shoulder',
            label: 'Reach past Astrid and touch Hiccup’s shoulder.',
            then: [N('You touch Hiccup’s shoulder. He leans back, just a little.')],
          },
          {
            id: 'both',
            label: 'Say they’re both right.',
            then: [
              A('That is the hard part.', 'sad'),
              N('Nobody says any more, all the way home.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a19-12-complete',
      [
        N('Toothless lands you at the cove under the stars.'),
        A('We wait. But not for long, Hiccup.'),
        H('Tomorrow is my big test.', 'sad'),
        N('Above you, the stars twinkle. Count some with me.'),
      ],
      [
        doit(
          'maths',
          'count to 5',
          3,
          'edu:count:stars:5',
          [
            N('(Point to five stars, or five dots on the page.)'),
            N('One, two, three, four, five! Five twinkling stars.'),
          ],
          'Counted five stars out loud.',
          'K.CC.B.5',
        ),
      ],
    ),
  ],
);

// ================================================================== A19-13 The Final Exam
const Q13: EduQuest = quest(
  'a19-13',
  'The Final Exam',
  {
    'a19-13-s1': {
      goal: 'Take your place at the arena gate.',
      hint: 'Stand with Gobber. Hiccup will pass you.',
    },
    'a19-13-s2': {
      goal: 'Watch the test from the gate.',
      hint: 'Stay at the gate. This is Hiccup’s, not yours.',
    },
    'a19-13-s3': {
      goal: 'Stay with Hiccup as the ships go out.',
      hint: 'Go down to the jetty with him.',
    },
  },
  [
    sc(
      'a19-13-stands',
      [
        N('All of Berk is at the arena. It is very noisy.'),
        N('Somebody is selling smoked fish on sticks.'),
        ST('My son is going to be a hero today!', 'happy'),
        N('You stand at the gate with Gobber.'),
        N('Hiccup walks into the pit in his too-big helmet.'),
        N('He looks at you. He has an idea.'),
      ],
      [
        doit(
          'music',
          'loud sounds and soft sounds',
          1,
          'edu:clap:loud-soft',
          [
            N('(Clap loudly, like a big crowd. Now clap very softly.)'),
            N('A crowd is loud. A whisper is soft.'),
          ],
          'Clapped loudly and softly and compared the sounds.',
          '1-PS4-1',
        ),
      ],
      {
        choices: [
          {
            id: 'luck',
            label: 'Wish him luck.',
            then: [H('Thanks. I will need it.')],
          },
          {
            id: 'dont',
            label: 'Tell him he doesn’t have to do this.',
            then: [H('I do. But not the way they think.', 'soft')],
          },
          {
            id: 'nod',
            label: 'Just nod.',
            then: [N('You nod, and he nods back. That is enough.')],
          },
        ],
      },
    ),
    sc(
      'a19-13-hand',
      [
        N('The gate opens. A Monstrous Nightmare comes out.'),
        N('Hiccup puts down his shield, his knife and his helmet.'),
        H('It is all right. I will not hurt you. Look. Nothing.'),
        N('He holds out his hand and turns his face away.'),
        N('The dragon calms down. Everyone is quiet.'),
        ST('Enough! Get him out!', 'angry'),
        N('Stoick bangs the bars with his hammer. CLANG!'),
        N('The loud noise frightens the dragon. Far off, a whistle comes closer.'),
      ],
      [
        ask(
          'science',
          'quiet and calm are kind to animals',
          6,
          [N('The loud noise scared the dragon. What is kinder to a scared animal?')],
          [
            opt(
              'Being quiet and calm',
              [N('Yes. Quiet, calm people help animals feel safe.')],
              true,
            ),
            opt('Banging louder', [N('Louder noises scare animals even more.')]),
            opt('Shouting at it', [N('Shouting scares animals. Quiet and calm is kinder.')]),
          ],
          'Learned that loud noises frighten animals and that quiet, calm people help them feel safe.',
          'K-ESS3-3',
        ),
      ],
    ),
    sc(
      'a19-13-chain',
      [
        N('Toothless crashes in through the roof. He stands in front of Hiccup.'),
        N('He pushes the Nightmare back into its pen.'),
        H('Go, Toothless! Go!', 'shock'),
        N('He stays by Hiccup. The Vikings catch him with ropes.'),
        N('Hiccup tells his dad about Toothless.'),
        N('Stoick is very cross. He says a hurtful thing.'),
        N('Then he turns his back. Hiccup feels very small and very sad.'),
        N('Next day, the ships sail. Toothless is chained on the front one.'),
        N('Hiccup stands on the jetty. His hands are empty.'),
      ],
      [
        ask(
          'sel',
          'what helps when someone says something unkind',
          6,
          [N('Hiccup feels hurt by unkind words. What helps?')],
          [
            opt(
              'Tell someone you trust how you feel',
              [N('Yes. Telling a friend or a grown-up helps the hurt get smaller.')],
              true,
            ),
            opt('Say unkind things back', [
              N('That hurts more people. Telling someone you trust is better.'),
            ]),
            opt('Hide the feeling forever', [N('Hidden feelings get heavy. Sharing them helps.')]),
          ],
          'Talked about what helps after unkind words: telling someone you trust.',
          'CASEL: Self-awareness',
        ),
      ],
    ),
    sc(
      'a19-13-complete',
      [
        GB('I have known Stoick forty years. He will be sorry.', 'sad'),
        N('Gobber goes with the ships. He has to.'),
        N('He touches Hiccup’s shoulder with his hook, very gently.'),
        N('Now it is only you, your Nubbin and Hiccup.'),
        N('Your Nubbin sits on Hiccup’s foot, so he is not alone.'),
      ],
      [
        notice(
          'social-studies',
          'families can be cross and still love each other',
          4,
          [
            N('Families and friends can be cross with each other and still care.'),
            N('Mending it takes time. Saying sorry helps.'),
          ],
          'Learned that people who care about each other can fall out, and that time and saying sorry help to mend it.',
          'D2.Civ.8.K-2',
        ),
      ],
    ),
  ],
);

// ================================================================== A19-14 What Astrid Asked
const Q14: EduQuest = quest(
  'a19-14',
  'What Astrid Asked',
  {
    'a19-14-s1': {
      goal: 'Find Hiccup, and sit with him.',
      hint: 'He is on the cliff over the harbour. You do not have to say anything.',
    },
    'a19-14-s2': {
      goal: 'Listen while Astrid asks her question.',
      hint: 'Stay where you are when Astrid comes.',
    },
  },
  [
    sc(
      'a19-14-cliff',
      [
        N('Hiccup sits on the cliff over the empty harbour.'),
        N('He hugs his knees. You sit down near him.'),
        N('You do not ask him anything. You just stay.'),
        N('Your Nubbin sits between you, facing the sea.'),
        H('Everything was going so well.', 'sad'),
        H('He came to help me. Now they have him.'),
      ],
      [
        ask(
          'sel',
          'sitting quietly with a sad friend helps',
          2,
          [N('Hiccup is sad. Do we always have to talk to help?')],
          [
            opt(
              'No. Sitting close and quiet can help',
              [N('Yes. Just being there says “I care”.')],
              true,
            ),
            opt('Yes, we must always talk', [
              N('Not always. Sometimes just staying near is the kindest.'),
            ]),
            opt('We should run away', [N('A sad friend needs us near. Staying helps.')]),
          ],
          'Talked about how just sitting near a sad friend can help.',
          'CASEL: Relationship skills',
        ),
      ],
      {
        choices: [
          {
            id: 'stay',
            label: 'Stay where you are.',
            then: [N('You stay. Some things only need someone not to leave.')],
          },
          {
            id: 'closer',
            label: 'Move a little closer.',
            then: [N('You move closer. He does not look up, but he relaxes a little.')],
          },
          {
            id: 'fish',
            label: 'Give him the dried fish from your pocket.',
            then: [N('He laughs, once. He takes it.'), H('You learned that from Toothless.')],
          },
        ],
      },
    ),
    sc(
      'a19-14-astrid',
      [
        N('Astrid sits down next to Hiccup. She is quiet at first.'),
        A('In the woods, you could have hurt him. Why did you not?'),
        H('I am not sure.'),
        A('That is not an answer. Why?'),
        N('Hiccup looks at his hands for a long time.'),
        H('He was scared. I know that kind of scared. I could not hurt him.', 'soft'),
        A('So he is scared and chained to a ship. What now?'),
      ],
      [
        ask(
          'literacy',
          'in a talk we ask, then listen',
          4,
          [N('Astrid asked a question. What did she do next?')],
          [
            opt(
              'She waited and listened',
              [N('Yes. Asking, then waiting and listening, is how a good talk works.')],
              true,
            ),
            opt('She walked away', [N('She stayed. She sat and waited for his answer.')]),
            opt('She sang a song', [N('No song. She sat quietly and listened.')]),
          ],
          'Noticed that a good conversation means asking, then waiting and listening.',
          'SL.K.1',
        ),
      ],
    ),
    sc(
      'a19-14-astrid-done',
      [
        N('Hiccup looks at the sea. Then at the village.'),
        N('Then at the arena and the pens.'),
        H('The training dragons are still in their pens.', 'think'),
        N('There are four pens and four dragons. Count them with me.'),
      ],
      [
        doit(
          'maths',
          'count to 4',
          3,
          'edu:count:pens:4',
          [
            N('(Point to four pens, or four dots on the page.)'),
            N('One, two, three, four! Four dragons in four pens.'),
          ],
          'Counted four pens, one for each dragon.',
          'K.CC.B.5',
        ),
      ],
    ),
    sc(
      'a19-14-complete',
      [
        H('I am going to do something mad.'),
        A('Good. I hoped you would say that.'),
        H('Now you know why. I did not know before. I do now.', 'soft'),
        N('Astrid runs for the village. Hiccup follows, and so do you.'),
      ],
      [
        ask(
          'science',
          'to solve a problem, first say what the problem is',
          1,
          [N('Toothless is chained. What is the first step to solving a problem?')],
          [
            opt(
              'Say what the problem is',
              [N('Yes. Name the problem, then make a plan and try it.')],
              true,
            ),
            opt('Pretend it is not there', [
              N('A problem does not go away if we hide. Name it first.'),
            ]),
            opt('Hope it fixes itself', [
              N('Hoping is nice, but naming the problem and making a plan is better.'),
            ]),
          ],
          'Learned that the first step in solving a problem is saying what the problem is.',
          'K-2-ETS1-1',
        ),
      ],
    ),
  ],
);

// ================================================================== A19-15 Training Dragons
const Q15: EduQuest = quest(
  'a19-15',
  'Training Dragons',
  {
    'a19-15-s1': {
      goal: 'Meet the others at the arena pens.',
      hint: 'Go round to the pens at the back.',
    },
    'a19-15-s2': {
      goal: 'Help match each rider to a dragon.',
      hint: 'Watch which way each dragon looks.',
    },
    'a19-15-s3': {
      goal: 'Fly after the ships with the young riders.',
      hint: 'Ride behind Fishlegs on the Gronckle. Hold on.',
    },
  },
  [
    sc(
      'a19-15-pens',
      [
        N('The arena is empty. The dragons sit in their pens.'),
        N('Astrid has brought the others.'),
        SN('Do not eat me! I am too handsome!'),
        RF('Nobody eats you. You are mostly elbows.'),
        TF('And hair.'),
        H('Nobody is getting eaten. I want you to meet them properly.'),
        FL('Meet them? We have been trying to beat them!', 'shock'),
      ],
      [
        ask(
          'social-studies',
          'meeting someone new politely',
          5,
          [N('What is a polite way to meet someone new?')],
          [
            opt(
              'Say hello gently and ask first',
              [N('Yes. Gentle and slow is polite, with people and with animals.')],
              true,
            ),
            opt('Grab them', [N('Grabbing is rude and can frighten them. Gentle is better.')]),
            opt('Shout as loud as you can', [N('Shouting can frighten. A soft hello is better.')]),
          ],
          'Talked about meeting someone new politely, gently and slowly.',
          'D2.Civ.8.K-2',
        ),
      ],
    ),
    sc(
      'a19-15-hands',
      [
        N('Hiccup opens the Nadder’s pen. It has every spike up.'),
        H('Hand out. Slow. Look away. Do not grab. Let it choose.'),
        N('Astrid goes first. She holds out her hand and looks away.'),
        N('The Nadder puts its nose into her palm.'),
        N('Now it is your turn to help. Who goes with who?'),
        N('The Nightmare likes noise, so it gets Snotlout.'),
        N('The Zippleback has two heads, so the twins share it.'),
        N('That leaves the Gronckle and Fishlegs.'),
      ],
      [
        ask(
          'maths',
          'count to 4',
          7,
          [N('Nadder, Nightmare, Zippleback, Gronckle. How many dragons are there?')],
          [
            opt('Four', [N('Yes! One, two, three, four: four dragons.')], true),
            opt('Two', [N('Count again: Nadder, Nightmare, Zippleback, Gronckle. Four!')]),
            opt('Six', [N('Count again with me: one, two, three, four. Four dragons.')]),
          ],
          'Counted four dragons.',
          'K.CC.B.5',
        ),
      ],
      {
        choices: [
          {
            id: 'match',
            label: 'Bring Fishlegs to the Gronckle.',
            then: [
              N('Fishlegs holds out a shaky hand. The Gronckle leans her head on him.'),
              FL('She likes me! She actually likes me!', 'happy'),
            ],
          },
          {
            id: 'choose',
            label: 'Let the Gronckle choose.',
            then: [
              N('The Gronckle waddles straight past everyone. She sits on Fishlegs’s feet.'),
              FL('She picked me! Nobody picks me first!', 'happy'),
            ],
          },
        ],
      },
    ),
    sc(
      'a19-15-hands-done',
      [
        N('Fishlegs is crying. They are happy tears.'),
        N('Nobody laughs. Not even Snotlout.'),
        N('People cry when they are sad. People cry when they are very happy, too.'),
        N('Fishlegs has a friend at last.'),
      ],
      [
        ask(
          'sel',
          'all feelings are allowed, even happy tears',
          2,
          [N('Fishlegs cries happy tears. Is it all right to cry when we are happy?')],
          [
            opt(
              'Yes. All feelings are allowed',
              [N('Yes. Happy tears are real tears, and every feeling is allowed.')],
              true,
            ),
            opt('No, never', [N('We can cry when sad and when very happy. It is all right.')]),
          ],
          'Learned that crying when happy is fine and all feelings are allowed.',
          'CASEL: Self-awareness',
        ),
      ],
    ),
    sc(
      'a19-15-go',
      [
        N('There are no saddles. They use rope and blankets.'),
        FL('Ride with me. She is slow, but she does not drop things.'),
        N('You climb on behind Fishlegs. Your Nubbin rides in a sack.'),
        A('Which way did the ships go?'),
        H('North. Toothless is on Dad’s ship. He will show them the nest.', 'sad'),
        N('Four dragons go up out of the arena, into the grey morning.'),
      ],
      [
        ask(
          'health',
          'hold on tight when riding high up',
          2,
          [N('You are riding high up on a dragon. What keeps you safe?')],
          [
            opt(
              'Hold on tight',
              [N('Yes. Hold on with both hands, and sit nice and still.')],
              true,
            ),
            opt('Let go and wave', [N('Not up high! Hold on tight.')]),
            opt('Wiggle all about', [N('Wiggling is wobbly. Sit still and hold on.')]),
          ],
          'Talked about holding on tight and sitting still to stay safe when riding.',
          MOVE,
        ),
      ],
    ),
    sc(
      'a19-15-go-done',
      [
        N('The sea is far down below.'),
        N('The Gronckle hums as she flies.'),
        N('Fishlegs hums back to her.'),
        N('Hum, and touch your throat. It buzzes!'),
      ],
      [
        doit(
          'science',
          'humming makes a buzz we can feel',
          3,
          'edu:hum:feel:throat',
          [
            N('(Hum a long note, with your fingers on your throat.)'),
            N('Do you feel the buzz? That wiggle is how sound is made.'),
          ],
          'Hummed with fingers on the throat and felt the buzz that makes sound.',
          '1-PS4-1',
        ),
      ],
    ),
    sc(
      'a19-15-complete',
      [
        SN('Best day ever. I will say I thought of it.', 'happy'),
        TF('I will say I was on the left head.'),
        RF('You were on the right head.'),
        TF('That is what I said.'),
        N('Hiccup rides at the front. He is looking north.'),
      ],
      [
        doit(
          'maths',
          'left and right',
          3,
          'edu:show:hand:left',
          [
            N('(Hold up your left hand. Now your right hand.)'),
            N('Left and right are two sides. The twins mixed theirs up!'),
          ],
          'Showed their left and right hands.',
          'K.G.A.1',
        ),
      ],
    ),
  ],
);

// ================================================================== A19-16 The Red Death
const Q16: EduQuest = quest(
  'a19-16',
  'The Red Death',
  {
    'a19-16-s1': {
      goal: 'Come in to the mountain with the riders.',
      hint: 'Hold on behind Fishlegs as the Gronckle lands.',
    },
    'a19-16-s2': {
      goal: 'Help everyone off the ships.',
      hint: 'Start from the shore end. The riders keep the big one busy.',
    },
    'a19-16-s3': {
      goal: 'Watch from the water’s edge as Hiccup goes for Toothless.',
      hint: 'Stay at the edge of the water.',
    },
  },
  [
    sc(
      'a19-16-mountain',
      [
        N('The ships have found the mountain. The Vikings hammer at the rock.'),
        N('Toothless is chained on the front ship. He sees you coming.'),
        N('The rock cracks wide. Then everyone stops cheering.'),
        N('Out comes the big scary one, as big as a hill.'),
        GB('That is not a dragon. That is a mountain with a temper.', 'shock'),
        N('Its fire makes the ships hot and smoky. Everyone must get off!'),
        ST('Everyone off! Get to the rocks!', 'angry'),
      ],
      [
        notice(
          'science',
          'water, ice and time can crack rock',
          3,
          [
            N('Real rock can crack, too. Water freezes in a crack and pushes it wider.'),
            N('It happens very slowly, over many winters.'),
          ],
          'Learned that rock can crack slowly when water freezes in its cracks.',
          '2-ESS1-1',
        ),
      ],
    ),
    sc(
      'a19-16-draw',
      [
        N('The young riders swoop in. The Vikings on the beach gasp.'),
        H('Fishlegs, what does it have? Tell me!'),
        FL('Big head, small eyes! It cannot see well to the sides!'),
        H('Then be noisy on its left side!'),
        N('The riders fly round its head, like gulls round a ship.'),
        N('Fishlegs sets you down. Your job is to help people off the ships.'),
      ],
      [
        ask(
          'social-studies',
          'helpers: who helps in a hard time',
          5,
          [N('Everyone is helping people off the ships. Who does the helping first?')],
          [
            opt('Everyone who can, together', [N('Yes. In a hard time, many hands help.')], true),
            opt('Only the chief', [N('The chief helps, but so do the riders, Gobber and you.')]),
            opt('Nobody', [N('Everyone helps. That is how people get safe.')]),
          ],
          'Talked about how everyone helps together when people need to get to safety.',
          'D2.Civ.8.K-2',
        ),
      ],
      {
        choices: [
          {
            id: 'gobber',
            label: 'Help Gobber down first.',
            then: [GB('Mind the leg! It is not my first, but it is a good one.')],
          },
          {
            id: 'nubbin',
            label: 'Send your Nubbin to look for anyone hiding.',
            then: [
              N('Your Nubbin finds a young Viking behind a barrel.'),
              N('You get her off together. She hugs your Nubbin all the way down.'),
            ],
          },
          {
            id: 'stoick',
            label: 'Go to Stoick.',
            then: [
              ST('Not me! Them! Get them off first!', 'angry'),
              N('So you do. He comes off last.'),
            ],
          },
        ],
      },
    ),
    sc(
      'a19-16-draw-done',
      [
        N('When the last one is off, you look back.'),
        N('Everyone is safe. You helped, your Nubbin helped, and Stoick helped too.'),
        N('Hiccup has turned away from the big one.'),
        N('He is flying towards the front ship.'),
      ],
      [
        doit(
          'maths',
          'count to 3',
          3,
          'edu:count:helpers:3',
          [
            N('(Hold up a finger each for you, your Nubbin and Stoick.)'),
            N('One, two, three! Three helpers, and lots of others helped too.'),
          ],
          'Counted three helpers on their fingers.',
          'K.CC.B.5',
        ),
      ],
    ),
    sc(
      'a19-16-chain',
      [
        N('The front ship is slipping into the sea. Toothless is still chained.'),
        N('Hiccup pulls at the chain with both hands.'),
        N('The ship slides off the rocks. Hiccup and Toothless go in the water!'),
        N('Stoick runs past you. He wades in, up to his chest.'),
        N('It is a long wait.'),
        N('Stoick comes up with Hiccup. Toothless climbs out onto the rocks.'),
        ST('Hiccup. I was wrong. I am sorry, son.', 'sad'),
        H('Me too, Dad.', 'soft'),
      ],
      [
        ask(
          'sel',
          'a good sorry says what you did wrong',
          6,
          [N('Stoick said sorry. Which is the best sorry?')],
          [
            opt(
              '“I was wrong. I am sorry.”',
              [N('Yes. A good sorry says what was wrong, and means it.')],
              true,
            ),
            opt('“Sorry, but it was your fault.”', [
              N('That is not a real sorry. A good sorry does not blame.'),
            ]),
            opt('“Whatever.”', [N('“Whatever” does not mend anything. A good sorry does.')]),
          ],
          'Talked about what a good apology sounds like: says what was wrong and means it.',
          'CASEL: Relationship skills',
        ),
      ],
    ),
    sc(
      'a19-16-complete',
      [
        ST('You do not have to go up there.'),
        H('Yes, I do. He is my dragon, and it was my rope.'),
        ST('Then go. And come back.', 'soft'),
        N('Hiccup climbs on. Toothless looks round at you, and up they go.'),
      ],
      [
        ask(
          'literacy',
          'how a character shows care with words',
          2,
          [N('Stoick tells Hiccup to come back. What does that tell us?')],
          [
            opt(
              'He loves Hiccup and wants him safe',
              [N('Yes. “Come back” is a loving thing to say.')],
              true,
            ),
            opt('He is cross', [N('He sounds soft, not cross. “Come back” means he cares.')]),
            opt('He wants a sandwich', [N('Ha, no! “Come back” tells us he cares.')]),
          ],
          'Worked out what a character’s words show about how he feels.',
          'RL.2.3',
        ),
      ],
    ),
  ],
);

// ================================================================== A19-17 The Fall
const Q17: EduQuest = quest(
  'a19-17',
  'The Fall',
  {
    'a19-17-s1': {
      goal: 'Watch from the beach as Hiccup leads the big one away.',
      hint: 'Stand on the beach with the others and look up.',
    },
    'a19-17-s2': {
      goal: 'Wait for the smoke to clear.',
      hint: 'There is nothing to do but wait. Do it as best you can.',
    },
    'a19-17-s3': {
      goal: 'Find them.',
      hint: 'Go into the burnt place where the smoke is thinning.',
    },
  },
  [
    sc(
      'a19-17-up',
      [
        N('From the beach you watch Hiccup and Toothless climb.'),
        N('They are a tiny black speck against the cloud.'),
        N('The big one spreads its wings and follows.'),
        GB('What is the boy doing?', 'shock'),
        A('He is leading it up, away from us.'),
        N('Everyone on the beach looks up. Your Nubbin peeps through its paws.'),
        N('The speck and the big shadow go into the cloud.'),
      ],
      [
        ask(
          'maths',
          'high and low',
          1,
          [N('Hiccup is in the sky and you are on the beach. Who is higher?')],
          [
            opt('Hiccup', [N('Yes! Hiccup is high up, and you are down low.')], true),
            opt('You', [N('You are on the beach, down low. Hiccup is up high.')]),
          ],
          'Compared high and low positions: the rider up in the sky and the child on the beach.',
          'K.G.A.1',
        ),
      ],
    ),
    sc(
      'a19-17-dive',
      [
        N('For a long time there is only cloud.'),
        N('Then a high whistle. It comes down, down, down.'),
        N('Toothless dives out of the cloud, wings tucked in.'),
        N('At the last moment he opens his wings and turns. The big one cannot.'),
        N('Far along the beach, you see a flash and a puff of smoke.'),
        ST('Hiccup!', 'shock'),
      ],
      [
        ask(
          'health',
          'slow breaths help us wait',
          5,
          [N('Waiting is very hard. What helps us wait?')],
          [
            opt(
              'Slow breaths, and holding a friend',
              [N('Yes. Slow breaths and a hand to hold make waiting easier.')],
              true,
            ),
            opt('Jumping about', [N('Jumping is tiring. Slow breaths calm us down.')]),
            opt('Giving up', [
              N('Waiting is hard, but slow breaths and a friend help us keep going.'),
            ]),
          ],
          'Talked about what helps when waiting is hard: slow breaths and a friend.',
          MOVE,
        ),
      ],
      {
        choices: [
          {
            id: 'run',
            label: 'Run towards the smoke.',
            then: [
              N('You start to run, but the heat stops you. Gobber’s hook catches your collar.'),
              GB('Wait for the smoke to clear.'),
            ],
          },
          {
            id: 'wait',
            label: 'Hold your Nubbin and wait.',
            then: [N('You hold your Nubbin and wait. It is the hardest thing here.')],
          },
          {
            id: 'stoick',
            label: 'Go with Stoick.',
            then: [N('You follow Stoick’s broad back into the thinning smoke. He knows the way.')],
          },
        ],
      },
    ),
    sc(
      'a19-17-shore',
      [
        N('The smoke thins. There is black rock and a curled-up dragon.'),
        N('Toothless’s new tail fin is burnt.'),
        ST('Son? Hiccup?', 'sad'),
        N('Toothless opens one green eye. Slowly he opens his wings.'),
        N('Wrapped inside, like a cloak, is Hiccup. His chest goes up and down.'),
        ST('He is alive!', 'shock'),
        N('Stoick pats Toothless’s head. It is how you say thank you.'),
      ],
      [
        ask(
          'literacy',
          'feeling words: relieved',
          5,
          [N('Stoick says “He is alive!” How does he feel?')],
          [
            opt(
              'Very relieved and happy',
              [N('Yes. Relieved means a big worry has gone away.')],
              true,
            ),
            opt('Bored', [N('Not bored! His worry has gone, and he is very happy.')]),
            opt('Sleepy', [N('He might be sleepy later. Right now he is relieved.')]),
          ],
          'Learned the feeling word relieved, when a big worry goes away.',
          'RL.1.4',
        ),
      ],
    ),
    sc(
      'a19-17-complete',
      [
        N('They carry Hiccup to the one ship that still floats.'),
        N('Toothless will not be parted from him.'),
        N('All the way home, the dragon rests his chin on the blanket.'),
        N('Your Nubbin sits at the other end. It keeps watch, too.'),
      ],
      [
        ask(
          'sel',
          'staying close shows you care',
          3,
          [N('Your Nubbin keeps watch beside a friend who is resting. What does that say?')],
          [
            opt(
              '“I care about you”',
              [N('Yes. Staying close says “I care” without any words.')],
              true,
            ),
            opt('“I am bored”', [N('Not bored. Staying close shows love.')]),
            opt('“I want to play”', [N('It is a time for quiet. Staying close shows care.')]),
          ],
          'Talked about how staying close to a resting friend shows care.',
          'CASEL: Relationship skills',
        ),
      ],
    ),
  ],
);

// ================================================================== A19-18 Twelve Days North
const Q18: EduQuest = quest(
  'a19-18',
  'Twelve Days North',
  {
    'a19-18-s1': {
      goal: 'Be there when Hiccup wakes up.',
      hint: 'Wait by the fire in Stoick’s house.',
    },
    'a19-18-s2': {
      goal: 'Walk out into the village with Hiccup.',
      hint: 'Go out through the door and down into the square.',
    },
    'a19-18-s3': {
      goal: 'Watch Hiccup and Toothless fly.',
      hint: 'Stand in the square with everyone else, and look up.',
    },
  },
  [
    sc(
      'a19-18-wake',
      [
        N('Hiccup wakes in his own bed. A big black dragon is sitting on him.'),
        H('Toothless! What are you doing in my house?', 'shock'),
        N('Toothless bounces up to the rafters and down again.'),
        N('Hiccup sees you by the fire. He smiles.'),
        N('He looks down. His foot was hurt in the fall, and it is gone.'),
        N('He has a new one, made of iron and wood.'),
        GB('I made it. It has a spring to help you walk.'),
        H('It is really good, Gobber.', 'soft'),
      ],
      [
        notice(
          'health',
          'some people have a made foot or leg',
          7,
          [
            N('Some people have a leg or a foot that was made, not grown.'),
            N('They can walk, run, climb and dance. It is nothing to hide.'),
          ],
          'Learned that some people use a made foot or leg, that they can walk, run and dance, and that it is nothing to hide.',
          'CASEL: Social awareness',
        ),
      ],
      {
        choices: [
          {
            id: 'how',
            label: 'Ask how it feels.',
            then: [
              H('A bit strange. But I will get used to it. He did.'),
              N('He nods at Toothless’s tail.'),
            ],
          },
          {
            id: 'arm',
            label: 'Hold out your arm.',
            then: [
              N('He takes your arm and stands. He finds his balance.'),
              H('Thanks. I will not always need it.'),
            ],
          },
          {
            id: 'wait',
            label: 'Say nothing, and wait.',
            then: [
              N('You wait. He tries a step, then another, and then he grins.'),
              H('Toothless and me. Matching now.', 'happy'),
            ],
          },
        ],
      },
    ),
    sc(
      'a19-18-wake-done',
      [
        N('He walks to the door. Toothless leans on his side.'),
        N('Step, clunk. Step, clunk.'),
        N('It is a lovely, steady beat.'),
        H('Come on. I want to see what is outside.'),
      ],
      [
        doit(
          'music',
          'a steady beat',
          2,
          'edu:clap:beat:step-clunk',
          [
            N('(Clap it with me: step, clunk. Step, clunk.)'),
            N('A steady beat goes on and on, the same each time.'),
          ],
          'Clapped a steady beat to the rhythm of step, clunk.',
          '1-PS4-1',
        ),
      ],
    ),
    sc(
      'a19-18-village',
      [
        N('Hiccup opens the door. There are dragons everywhere!'),
        N('A Nadder sits on a roof. A Gronckle sleeps in the square.'),
        N('Three children are asleep on her back.'),
        N('Nobody is fighting. People are building a long fish trough.'),
        N('Somebody is making a stable with a very tall door.'),
        ST('Well? It is all your doing. Do you like it?', 'happy'),
        A('He is up! He is awake!', 'happy'),
        FL('Hiccup! The Gronckle lets me brush her teeth now!', 'happy'),
      ],
      [
        notice(
          'social-studies',
          'long ago, families built shelters for their animals',
          4,
          [
            N('Long ago, northern families kept sheep, cows and horses close by.'),
            N('Some even shared their long house, so the animals stayed warm in winter.'),
          ],
          'Learned that people long ago built shelters for their animals, and some shared the long house with them.',
          'D2.His.2.K-2',
        ),
      ],
    ),
    sc(
      'a19-18-village-done',
      [
        N('Toothless bounds from one end of the square to the other.'),
        N('He greets everybody. He greets your Nubbin twice.'),
        N('Hello, hello! One time, two times.'),
        N('How many times did he greet your Nubbin?'),
      ],
      [
        doit(
          'maths',
          'count to 2',
          3,
          'edu:count:hellos:2',
          [
            N('(Hold up fingers for each hello: one, two.)'),
            N('Two hellos! He likes your Nubbin.'),
          ],
          'Counted two hellos.',
          'K.CC.B.5',
        ),
      ],
    ),
    sc(
      'a19-18-flight',
      [
        N('Gobber has made Toothless a new tail fin.'),
        N('It has a blue scale at the tip, for luck.'),
        H('New tail. New foot. Let us see how they get on.'),
        N('Hiccup puts his new foot on the pedal. It fits.'),
        N('Toothless springs! Up they go, over the roofs and the sea.'),
        N('Dragons follow them. The whole sky is full.'),
        N('Hiccup spreads his arms wide. Toothless rolls, slowly.'),
      ],
      [
        doit(
          'art',
          'naming colours',
          5,
          'edu:name:colours:dragons',
          [
            N('(Point to something blue, then something red, then something gold.)'),
            N('The sky over Berk is full of colours!'),
          ],
          'Named and pointed to colours in a busy picture.',
          'ELOF: Language and Communication',
        ),
      ],
    ),
    sc(
      'a19-18-complete',
      [
        N('Late in the day, Hiccup and Toothless land beside you.'),
        N('Hiccup holds out a tiny saddle with a tail-fin badge.'),
        H('It is exactly the right size for your Nubbin.'),
        N('Waiting can bring good things back.', 'soft'),
        N('Toothless pads over. He puts a whole silver fish at your Nubbin’s feet.'),
        N('Your Nubbin is so proud. It does not eat the fish.'),
        N('The sea goes grey and you are home. The saddle smells of fish.'),
      ],
      [
        ask(
          'sel',
          'patience: waiting kindly',
          4,
          [N('Toothless took a long time to trust. What did Hiccup do?')],
          [
            opt('Waited, quietly and kindly', [N('Yes. Waiting kindly is how trust grows.')], true),
            opt('Grabbed him', [N('Grabbing frightens. Waiting kindly works better.')]),
            opt('Shouted at him', [N('Shouting frightens. Waiting quietly works better.')]),
          ],
          'Talked about how patience and kindness help trust grow.',
          'CASEL: Relationship skills',
        ),
      ],
    ),
  ],
);

// ================================================================== variants
/** Sprout versions of every scene in A19_VARIANTS. */
export const EDU_A19_SPROUT_VARIANTS: EduScene[] = [
  // ------------------------------------------------ A19-8, step 2: sableFirst = slow
  sc(
    'a19-08-hand-slow',
    [
      N('You know this moment. You sat still like this with Sable.'),
      N('So you sit very still at the edge of the sand.'),
      N('Hiccup comes out of the last line. Toothless is very close.'),
      N('Hiccup lifts his hand slowly. Toothless wrinkles his nose.'),
      N('Hiccup stops. Then he shuts his eyes and turns his face away.'),
      N('He holds out his open hand, and waits.'),
      N('Then Toothless pushes his nose into Hiccup’s hand.'),
      H('Oh!', 'soft'),
      N('You did not teach him. He found it himself.', 'soft'),
    ],
    [
      ask(
        'sel',
        'sitting still shows we are no danger',
        1,
        [N('Sitting very still helped Sable, too. Why does sitting still help a scared animal?')],
        [
          opt(
            'It shows we are no danger',
            [N('Yes. Still and quiet says “I will not hurt you”.')],
            true,
          ),
          opt('It makes us sleepy', [
            N('Not sleepy. Sitting still tells a scared animal we are safe.'),
          ]),
          opt('It makes a lot of noise', [
            N('Sitting still is quiet. Quiet makes a scared animal feel safe.'),
          ]),
        ],
        'Talked about why sitting still and quiet helps a frightened animal feel safe.',
        'CASEL: Social awareness',
      ),
    ],
  ),
  // ------------------------------------------------ A19-8, step 2: sableFirst = grab
  sc(
    'a19-08-hand-grab',
    [
      N('You remember Sable running off into the dark.'),
      N('Hiccup comes out of the last line. Toothless is very close.'),
      N('Hiccup lifts his hand slowly. Toothless wrinkles his nose.'),
      N('Hiccup shuts his eyes and turns away. He holds out his open hand.'),
      N('Your Nubbin darts forward. You slow it with a gentle hand.'),
      N('It sits down by your hand, and waits with you.'),
      N('Then Toothless pushes his nose into Hiccup’s hand.'),
      H('Oh!', 'soft'),
    ],
    [
      ask(
        'sel',
        'slowing down is kinder than grabbing',
        5,
        [N('You slowed your Nubbin, not grabbed it. Why is slow better?')],
        [
          opt(
            'Grabbing can frighten',
            [N('Yes. A slow hand feels safe, but a grab can feel scary.')],
            true,
          ),
          opt('Grabbing is faster', [N('It is faster, but it can frighten. Slow is kinder.')]),
          opt('It does not matter', [N('It matters! A slow, gentle hand helps us all feel safe.')]),
        ],
        'Talked about why slowing down is kinder than grabbing.',
        'CASEL: Responsible decision-making',
      ),
    ],
  ),
  // ------------------------------------------------ A19-8, step 3: a19-first = ran
  sc(
    'a19-08-near-ran',
    [
      N('Toothless looks past Hiccup, at you and your Nubbin.'),
      H('Stay still. Let him choose.'),
      N('Toothless takes one step. Your Nubbin hides behind your legs.'),
      N('It holds your trousers in both paws. It has not forgotten the running.'),
      N('Toothless stops, and his ears go flat. He lies down right where he is.'),
      H('That is all right. It just means: not yet.', 'soft'),
    ],
    [
      ask(
        'science',
        'give an animal space',
        4,
        [N('Toothless keeps a little way off. What is the kind thing to do?')],
        [
          opt(
            'Give him space and wait',
            [N('Yes. Animals need space until they feel safe.')],
            true,
          ),
          opt('Rush over and hug him', [N('Rushing can frighten. Give space and wait.')]),
          opt('Chase him', [N('Chasing frightens animals. Giving space is kind.')]),
        ],
        'Learned that animals need space until they feel safe.',
        'K-ESS3-3',
      ),
    ],
  ),
  // ------------------------------------------------ A19-11, step 3: a19-first = ran
  sc(
    'a19-11-turn-ran',
    [
      H('One more go, before the light goes.', 'happy'),
      N('Toothless looks at your Nubbin and sniffs it.'),
      N('Your Nubbin goes stiff. It is ready to run.'),
      N('Toothless sits back. He does not lower his shoulder.'),
      H('Not yet, then. He decides.', 'sad'),
      N('You watch them fly round the cove without you.'),
      N('Your Nubbin watches from your lap, all the way round.'),
    ],
    [
      notice(
        'science',
        'the sun looks orange when it is low',
        5,
        [
          N('The sun looks orange when it is low in the sky.'),
          N('Soon it will be dark. Then it will be night.'),
        ],
        'Learned that the Sun looks orange when it is low, and that night comes after day.',
        '1-ESS1-1',
      ),
    ],
  ),
  // ------------------------------------------------ A19-18, step 2 done: a19-first = ran
  sc(
    'a19-18-village-done-ran',
    [
      N('Toothless bounds round the square, saying hello.'),
      N('He goes the long way round you and your Nubbin.'),
      N('He is not unfriendly. He just keeps a little space.'),
      N('Some friends need more time. You can wait.'),
    ],
    [
      notice(
        'sel',
        'some friends need more time',
        3,
        [
          N('Some friends need more time to feel safe. That is all right.'),
          N('You can wait. Waiting is a kind thing to do.'),
        ],
        'Learned that some friends need more time to trust, and that waiting is kind.',
        'CASEL: Self-management',
      ),
    ],
  ),
  // ------------------------------------------------ A19-18, complete: a19-first = ran (sableFirst set)
  sc(
    'a19-18-complete-ran',
    [
      N('Late in the day, Hiccup and Toothless land beside you.'),
      N('Hiccup holds out a tiny saddle with a tail-fin badge.'),
      H('He is not sure about you yet. That is all right. Have it anyway.', 'soft'),
      N('Hiccup goes to supper. Toothless stays on the cliff, far away.'),
      N('You stay still and do not call him. The sun goes down.'),
      N('Waiting can bring good things back.', 'soft'),
      N('Then there is a soft thump in the grass beside you.'),
      N('Toothless has come and sat down, close enough to touch.'),
      N('Your Nubbin leans on him, and he lets it. You all watch the sea.', 'soft'),
      N('The sea goes grey and you are home. The first stars are out.'),
    ],
    [
      ask(
        'sel',
        'patience: waiting kindly',
        7,
        [N('You waited all evening, quiet and kind, and then Toothless came. What helped?')],
        [
          opt(
            'Waiting kindly',
            [N('Yes. Waiting kindly, and not asking for more, helped him come.')],
            true,
          ),
          opt('Chasing him', [N('Chasing would have sent him away. Waiting kindly worked.')]),
          opt('Shouting', [N('Shouting would have frightened him. Waiting quietly worked.')]),
        ],
        'Talked about how patience and kindness helped a shy friend come closer.',
        'CASEL: Relationship skills',
      ),
    ],
  ),
  // ------------------------------------------------ A19-18, complete: sableFirst unset
  sc(
    'a19-18-complete-unset',
    [
      N('Late in the day, Hiccup and Toothless land beside you.'),
      N('Hiccup holds out a tiny saddle with a tail-fin badge.'),
      H('It is exactly the right size for your Nubbin.'),
      N('Toothless pads over. He puts a whole silver fish at your Nubbin’s feet.'),
      N('Your Nubbin is so proud. It does not eat the fish.'),
      N('The sea goes grey and you are home. The saddle smells of fish.'),
    ],
    [
      ask(
        'sel',
        'patience: waiting kindly',
        3,
        [N('Toothless took a long time to trust. What did Hiccup do?')],
        [
          opt('Waited, quietly and kindly', [N('Yes. Waiting kindly is how trust grows.')], true),
          opt('Grabbed him', [N('Grabbing frightens. Waiting kindly works better.')]),
          opt('Shouted at him', [N('Shouting frightens. Waiting quietly works better.')]),
        ],
        'Talked about how patience and kindness help trust grow.',
        'CASEL: Relationship skills',
      ),
    ],
  ),
  sc(
    'a19-18-complete-ran-unset',
    [
      N('Late in the day, Hiccup and Toothless land beside you.'),
      N('Hiccup holds out a tiny saddle with a tail-fin badge.'),
      H('He is not sure about you yet. That is all right. Have it anyway.', 'soft'),
      N('Hiccup goes to supper. Toothless stays on the cliff, far away.'),
      N('You stay still and do not call him. The sun goes down.'),
      N('Then there is a soft thump in the grass beside you.'),
      N('Toothless has come and sat down, close enough to touch.'),
      N('Your Nubbin leans on him, and he lets it. You all watch the sea.', 'soft'),
      N('The sea goes grey and you are home. The first stars are out.'),
    ],
    [
      ask(
        'sel',
        'patience: waiting kindly',
        6,
        [N('You waited all evening, quiet and kind, and then Toothless came. What helped?')],
        [
          opt(
            'Waiting kindly',
            [N('Yes. Waiting kindly, and not asking for more, helped him come.')],
            true,
          ),
          opt('Chasing him', [N('Chasing would have sent him away. Waiting kindly worked.')]),
          opt('Shouting', [N('Shouting would have frightened him. Waiting quietly worked.')]),
        ],
        'Talked about how patience and kindness helped a shy friend come closer.',
        'CASEL: Relationship skills',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A19_SPROUT: EduQuest[] = [
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
];

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  // A19-1
  'edu:say:first-sound:h',
  'edu:blow:air:hand',
  'edu:count:pumps:5',
  'edu:tap:shape:circle',
  'edu:breathe:slow:3',
  // A19-2
  'edu:make:sound:high-low',
  'edu:order:story:first-next-last',
  'edu:draw:charcoal:line',
  // A19-3
  'edu:count:friends:3',
  'edu:look:dragon:shapes',
  'edu:say:first-sound:n',
  // A19-4
  'edu:clap:beat:slow-fast',
  // A19-5
  'edu:count:vikings:5',
  'edu:clap:syllables:fishlegs',
  // A19-6
  'edu:keep:still:count-5',
  // A19-7
  'edu:say:first-sound:t',
  // A19-8
  'edu:draw:lines:curly-straight',
  'edu:wait:quietly:count-10',
  // A19-9
  'edu:count:splashes:2',
  'edu:press:pedal:foot',
  // A19-10
  'edu:show:face:surprised',
  'edu:colour:pattern:blue-gold',
  // A19-12
  'edu:count:stars:5',
  // A19-13
  'edu:clap:loud-soft',
  // A19-14
  'edu:count:pens:4',
  // A19-15
  'edu:hum:feel:throat',
  'edu:show:hand:left',
  // A19-16
  'edu:count:helpers:3',
  // A19-18
  'edu:clap:beat:step-clunk',
  'edu:count:hellos:2',
  'edu:name:colours:dragons',
];
