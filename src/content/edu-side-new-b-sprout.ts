/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): new side stories, set B.
 *
 * Sources: side-stories-new-3.ts (S13 The Mill Cellar, S19 Cinder’s Last Light, S22 The Climb,
 * and every scene in SIDE_STORIES_NEW_3_VARIANTS except the end-epi-* epilogues, which are covered
 * elsewhere) and side-stories-new-4.ts (S14 Tilly’s Tabletop, S20 Fort Night, S21 CL-4NK).
 * One EduScene per original scene, id `sprout:<original id>`. See EDU-STYLE.md.
 *
 * - Choice ids, `set` flags and `friendship` are copied from the originals so every flag still
 *   works. No choice in these six stories leads anywhere cruel or bleak, so sprout keeps them all
 *   and no `defaultChoice` is needed.
 * - EduScene has no scene-level `set`: the sim keeps applying the original scene’s `set`
 *   (s19-warmth, s19-warmth-sable and s19-warmth-alone set s19-with; s13-letter-given sets s13-given).
 * - Variant scenes live in EDU_SIDE_NEW_B_SPROUT_VARIANTS, not inside the quests, so each is listed
 *   once. They play wherever the main variant would (same `of`).
 * - Hard things follow EDU-STYLE.md. Aldous and Cinder die, and the text says so plainly: “her
 *   light will stop, and it won’t start again”. Corvin is a lonely, grumpy man. Aldous’s letter
 *   is simple and kind: a dad who was too busy to say “I love you”. Hazel (in S14) has gone away on
 *   a trip, which is true at that point in the story; she is not dead.
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
const Y = say('you');
const M = say('moss');
const C = say('corvin');
const MA = say('marina');
const NO = say('nova');
const SP = say('sparks');
const PX = say('pixel');
const BY = say('byte');
const FE = say('fern');
const T = say('tobin');
const AL = say('aldous');
const CI = say('cinder');
const WO = say('worry');
const TI = say('tilly');
const GO = say('gordon');
const WR = say('wren');
const CK = say('clank');
const GB = say('granny-brock');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

/** One answer option. `best` marks the answer the lesson teaches. */
const opt = (label: string, reply: Line[], best = false): Opt => (best ? { label, best, reply } : { label, reply });

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
  lessons: [...beats].sort((a, b) => a.after - b.after).map((b, i) => ({ id: `sprout:${of}-l${i + 1}`, ...b })),
});

const quest = (
  of: string,
  title: string,
  goals: EduQuest['goals'],
  scenes: EduScene[],
  notes?: string,
): EduQuest => ({ id: `sprout:${of}`, of, band: 'sprout', title, goals, scenes, ...(notes ? { notes } : {}) });

// ================================================================== S13 shared pieces
/** Aldous’s letter, sprout version: a dad who was too busy to say “I love you”. */
const S13_LETTER: Line[] = [
  N('You open the letter. It is short.'),
  AL('Dear Corvin.'),
  AL('I worked all the time. I never stopped. Not once.'),
  AL('I was too busy to say the most important thing.'),
  AL('I love you. I should have said it every day.'),
  AL('If you ever want to stop, come and sit by the river.'),
  AL('Sit as long as you like. Nobody will count.'),
  AL('Love, your dad.'),
  T('“Nobody will count.” He counted everything. And then that.', 'sad'),
  T('It isn’t mine to decide. What shall we do with it?', 'soft'),
];

const S13_LETTER_LESSON: Beat = {
  domain: 'sel',
  skill: 'saying “I love you” to the people we love',
  standard: 'CASEL: Relationship skills',
  kind: 'notice',
  after: 7,
  lines: [
    N('“I love you.” Three small words. They feel big when we hear them.'),
    N('(Ask: who could you say “I love you” to today? Wait for an answer.)'),
  ],
  parentNote: 'Heard a kind letter from a dad to his son, and thought about who they could say “I love you” to.',
};

const S13_KEEP: Choice = {
  id: 'kept',
  label: 'Keep it for Corvin. Give it to him when his hands are warm.',
  set: { millLetter: 'kept' },
  then: [
    N('You fold it up and put it in your coat, by Hazel’s notebook.'),
    T('Yes. Cold hands can’t hold a thing like that.', 'think'),
    T('You’ll know when. Your grandmother always knew when.', 'soft'),
  ],
};
const S13_BURN: Choice = {
  id: 'burned',
  label: 'Ask Tobin to burn it in the stove, like Aldous’s other letters.',
  set: { millLetter: 'burned' },
  then: [
    T('That’s a real answer. I’ve thought it too.', 'think'),
    T('He wrote lots of letters, and burned them. This would be the last.', 'soft'),
  ],
};
const S13_GRAVE: Choice = {
  id: 'grave',
  label: 'Read it to Moss, and leave it at Aldous’s grave.',
  set: { millLetter: 'grave' },
  then: [
    T('Read to old Moss, and left with Aldous. Yes.', 'think'),
    T('Nobody ever read Aldous a letter. This is a way to remember him.', 'soft'),
  ],
};
const S13_GRAVE_NOMOSS: Choice = {
  id: 'grave',
  label: 'Read it out loud at Aldous’s grave, and leave it there.',
  set: { millLetter: 'grave' },
  then: [
    T('Read out loud, and left with Aldous. Yes.', 'think'),
    T('Nobody ever read Aldous a letter. This is a way to remember him.', 'soft'),
  ],
};

const S13_GRAVE_START: Line[] = [
  N('Aldous is buried under the trees by the river.'),
  N('It’s autumn. A yellow leaf falls on the stone. Then another.'),
];
const S13_GRAVE_END: Line[] = [
  N('You put the letter on the grave, under a flat stone.'),
  N('Tobin takes his hat off. Then he forgets why, and puts it back on.'),
];
const S13_GRAVE_LESSON: Beat = {
  domain: 'science',
  skill: 'autumn: leaves change colour and fall',
  standard: 'ELOF: Scientific Reasoning',
  kind: 'ask',
  after: 1,
  prompt: [N('Yellow leaves are falling from the trees. What time of year is it?')],
  options: [
    opt('Autumn', [N('Yes! In autumn, many trees drop their leaves.')], true),
    opt('Summer', [N('In summer the leaves are green, and they stay on.'), N('Falling yellow leaves mean autumn.')]),
    opt('Spring', [N('In spring, new green leaves grow. Falling yellow leaves mean autumn.')]),
  ],
  parentNote: 'Connected falling yellow leaves with autumn.',
};

// ================================================================== S13 The Mill Cellar
const S13: EduQuest = quest(
  's13',
  'The Mill Cellar',
  {
    's13-step1': {
      goal: 'Get past the rats in the grain store.',
      hint: 'Share some fruit with them, or tiptoe along the wall. Then find the hatch under the sacks.',
    },
    's13-step2': {
      goal: 'Let the water out of the flooded room.',
      hint: 'Open the bottom gate first, then the middle one, then the top. Water runs downhill!',
    },
    's13-step3': {
      goal: 'Find what is stopping the big wheel.',
      hint: 'Look in the biggest gear. Keep your hands far away from the wheel.',
    },
    's13-step4': {
      goal: 'Open the iron door with Tobin’s key.',
      hint: 'Take a lantern. It is very dark down there.',
    },
    's13-step5': {
      goal: 'Do what you chose with the letter.',
      hint: 'Keep it safe in your bag, take it to the stove with Tobin, or take it to the grave by the river.',
    },
  },
  [
    sc(
      's13-tobin',
      [
        N('Autumn. The river runs brown and loud. Whoosh!'),
        N('By the river leans an old mill. Moss sits on its millstone.'),
        T('Hazel’s grandchild! You have her chin.', 'happy'),
        T('I’m Tobin. I lit the lamps in this valley for fifty-one years.', 'happy'),
        T('This was Aldous’s mill. He was Corvin’s dad. Yes, grumpy Corvin.', 'think'),
        T('Under it is a cellar. Four floors, going down, down, down.'),
        T('Once, in the year of the Three Hats, the wheel spun so fast—', 'happy'),
        N('He stops. He scratches his head.'),
        T('Where was I? Cellar. Yes. Dark.', 'think'),
        M('He never gets to the end of that story. Never once.', 'soft'),
      ],
      [
        {
          domain: 'science',
          skill: 'we need light to see',
          standard: '1-PS4-2',
          kind: 'do',
          after: 8,
          check: 'edu:cover:eyes:light-dark',
          lines: [
            M('Dark means we need a lantern. We can only see when there is light.', 'think'),
            N('(Cover your eyes. Can you see? Now open them. Light!)'),
          ],
          parentNote: 'Found out that we can only see things when there is light, by covering and uncovering their eyes.',
        },
      ],
    ),
    sc(
      's13-level1',
      [
        N('Floor one: the grain store. Big sacks, all the way up.'),
        N('It smells of old flour. And mouse.'),
        N('Scritch, scratch. Scritch, scratch. Something is in the dark.'),
        N('Little noses. Little whiskers. Rats!'),
        T('Mill rats. They never take a day off.', 'think'),
        N('One rat sniffs the old flour. Sniff, sniff… ACHOO!'),
        N('All five rats jump. So does Tobin.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 5',
          standard: 'K.CC.B.5',
          kind: 'do',
          after: 3,
          check: 'edu:count:rats:5',
          lines: [N('(Count the little noses together: one, two, three, four, five.)'), T('Five rats. And a lot of whiskers.', 'happy')],
          parentNote: 'Counted five rats in the grain store.',
        },
      ],
      {
        choices: [
          {
            id: 'fed',
            label: 'Roll them a plum, and walk past while they eat.',
            set: { 's13-rats': 'fed' },
            then: [
              N('You roll a plum. Five little faces turn. Munch, munch.'),
              N('You walk right past. Nobody looks up.'),
              T('Sharing food! Your grandmother’s way.', 'happy'),
            ],
          },
          {
            id: 'crept',
            label: 'Cover your lantern and tiptoe along the wall.',
            set: { 's13-rats': 'crept' },
            then: [
              N('Tiptoe, tiptoe, along the wall.'),
              N('A rat sits on your boot. It thinks you are a chair!'),
              N('Behind you, Tobin tiptoes too. He whispers very loudly.'),
            ],
          },
        ],
      },
    ),
    sc(
      's13-sluice',
      [
        N('Creak! The old hoist lifts the sacks. Underneath is a hatch.'),
        N('And three old things, dusty and forgotten.'),
        T('Treasure! Everything in a cellar gets a grand name.', 'happy'),
        T('A ladle. The Ladle of Second Thoughts.'),
        T('A sock. The Sock of Nobody Knows Where.'),
        T('A cheese rind. The Cheese Rind of Being Brave!', 'happy'),
        N('A Nubbin licks the brave cheese rind. Brave Nubbin!'),
        N('Below the hatch, water lies still in the dark.'),
        T('Floor two is flooded. Three gates. Open them in the right order!', 'think'),
        T('Or we’ll be swimming. Splish, splash!'),
        N('Tobin pretends to swim in the air. He is not very good at it.'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'hear words that rhyme',
          standard: 'RF.K.2',
          kind: 'ask',
          after: 4,
          prompt: [T('Sock! What rhymes with sock?', 'think')],
          options: [
            opt('Rock', [T('Sock, rock! They sound the same at the end.', 'happy')], true),
            opt('Cheese', [T('Cheese is lovely. But listen: sock, rock. Rock rhymes with sock!')]),
            opt('Ladle', [T('Sock, ladle… no. Sock, rock! Rock rhymes.')]),
          ],
          parentNote: 'Found a word that rhymes with “sock”.',
        },
      ],
    ),
    sc(
      's13-level2',
      [
        N('Bottom gate first. Then the middle. Then the top.'),
        N('Glug, glug, glug! The water runs out of the room.'),
        N('Two eels flop on the floor. They look very cross.'),
        N('Up one wall are chalk lines. Each one a little higher.'),
        N('Someone measured a boy here, every year, as he grew.'),
        N('By the top line, a grown-up wrote: BIG ENOUGH TO WORK.'),
        T('…Where was I.', 'sad'),
        N('Tobin goes quiet. He walks on down the steps.'),
      ],
      [
        {
          domain: 'science',
          skill: 'water runs downhill',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'notice',
          after: 1,
          lines: [
            T('Water always runs downhill. Down, down, to the lowest place.', 'think'),
            N('(Run your finger down, down, like the water. Whoosh!)'),
          ],
          parentNote: 'Saw that water runs downhill, which is why the lowest gate opens first.',
        },
      ],
    ),
    sc(
      's13-wheelpit',
      [
        N('On the steps the flood left boots, a doorknob and a soggy scarf.'),
        T('The Squeaky Boots! The Doorknob That Won’t Open!', 'happy'),
        T('And the Soggy Scarf. It still thinks it will dry.', 'happy'),
        N('The sock is on the steps too. Nobody brought it.'),
        T('Sock! How did you get here?', 'happy'),
        N('Floor three: the wheel pit. The giant wheel drips. Plip, plop.'),
        N('The river pushes it. The whole mill shakes. Rumble!'),
        N('Moss calls down. He is staying on his millstone, thank you.'),
        T('Mind the wheel. It’s stuck, but it can still move.', 'think'),
        T('Find what’s jamming it. Then we step round.'),
      ],
      [
        {
          domain: 'health',
          skill: 'keeping safe near big machines',
          standard: 'ELOF: Perceptual, Motor, and Physical Development',
          kind: 'ask',
          after: 8,
          prompt: [T('Where should our hands be, near a big wheel?', 'think')],
          options: [
            opt('Far away, by our sides', [T('Yes. Big machines can hurt fingers. We stay back.', 'happy')], true),
            opt('On the spokes', [T('Ooh, no. A wheel can move and pinch. Hands far away, by our sides.')]),
          ],
          parentNote: 'Learned to keep hands away from big moving machines.',
        },
      ],
    ),
    sc(
      's13-level3',
      [
        N('In the biggest gear is a wooden wedge. Somebody put it there.'),
        N('A label hangs from it. It says: STOPPED. LEAVE IT.'),
        Y('Somebody stopped the wheel on purpose.'),
        T('Aldous did, in his last winter. He sat on that step.', 'sad'),
        T('Aldous died. He was very old.', 'soft'),
        T('When someone dies, their body stops, for always.', 'soft'),
        T('Not like the wheel. The wheel can start again. Aldous can’t.', 'soft'),
        N('Past the wheel, a stair goes down to an iron door. It is locked.'),
        T('Not that door. Not yet.', 'soft'),
        T('Hazel’s notebook has a page about Aldous. Read it first.'),
        T('Then come back, and I’ll give you the key.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'noticing when someone is sad, and what helps',
          standard: 'CASEL: Social awareness',
          kind: 'ask',
          after: 6,
          prompt: [N('Tobin is sad. He misses Aldous.'), N('What could help Tobin?')],
          options: [
            opt('Sit next to him for a bit', [T('Thank you. That helps. Sitting together always helps.', 'soft')], true),
            opt('Run off and play', [
              N('Tobin might feel lonely. Let’s sit with him a moment instead.'),
              T('Thank you. That helps.', 'soft'),
            ]),
          ],
          parentNote: 'Heard plainly that Aldous died, noticed Tobin was sad, and chose to sit with him.',
        },
      ],
    ),
    sc(
      's13-key',
      [
        N('Later, you have read Hazel’s page about Aldous. You go back to the mill.'),
        T('Corvin was Hazel’s helper once. Before that, he was this mill’s boy.', 'soft'),
        T('Every evening I lit the lamp by the gate.', 'soft'),
        T('And every evening there was a boy at the window. Working.', 'sad'),
        T('That’s the whole story. The only one I ever finished.', 'sad'),
        N('He gives you a little iron key. It’s warm from his pocket.'),
        N('The sock is in Tobin’s pocket. He does not know how.'),
        T('I found more treasure. A cog: the Cog of Very Big Patience.', 'happy'),
        T('And a tiny hat, cut from a round millstone. Heavy!', 'happy'),
        T('Down we go. Together.', 'soft'),
      ],
      [
        {
          domain: 'maths',
          skill: 'circles, big and small',
          standard: 'K.G.A.2',
          kind: 'do',
          after: 8,
          check: 'edu:draw:shape:circle',
          lines: [
            T('A cog is round, with little teeth all round the edge.'),
            N('(Draw a circle in the air. Round and round!)'),
            T('The hat is a circle too. Big circle, little circle. Both circles!', 'happy'),
          ],
          parentNote: 'Drew a circle and saw that big and small round things are both circles.',
        },
      ],
    ),
    sc(
      's13-desk',
      [
        N('The bottom room is small, dry and very cold.'),
        N('A desk. A chair. An apron on a hook, still floury.'),
        N('A pocket watch, stopped just after five o’clock.'),
        T('Five in the morning. That’s when the wheel started, every day.', 'soft'),
        N('Inside the big book are three rules, in chalk.'),
        N('ONE: the wheel never stops. TWO: nobody rests. THREE: keep up!'),
        N('Under them, in a child’s careful writing, the same three rules.'),
        N('Every page says work, work, work. Not one page says sleep.'),
        N('Tobin yawns, just from reading it.'),
        N('At the back is a letter. It was never sent. It says: Corvin.'),
        T('I kept it shut away for twenty years. It got heavy, keeping it.', 'soft'),
      ],
      [
        {
          domain: 'health',
          skill: 'everybody needs rest and sleep',
          standard: 'ELOF: Perceptual, Motor, and Physical Development',
          kind: 'ask',
          after: 8,
          prompt: [T('Hazel’s rules were kind ones. These say: never rest.', 'think'), T('Do people need rest?')],
          options: [
            opt('Yes! Everybody needs rest and sleep', [T('Yes. Rest and sleep help our bodies feel better and grow.', 'happy')], true),
            opt('No, keep working', [T('Aldous thought so. But bodies get tired. Everybody needs rest and sleep. Even millers.', 'soft')]),
          ],
          parentNote: 'Compared a rule that said “never rest” with Hazel’s kinder rules, and learned that everybody needs rest and sleep.',
        },
      ],
    ),
    sc('s13-letter', S13_LETTER, [S13_LETTER_LESSON], { choices: [S13_KEEP, S13_BURN, S13_GRAVE] }),
    sc(
      's13-settled-kept',
      [
        N('At home, you put the letter in the tin box under your bed.'),
        N('Hazel’s letter is in there too.'),
        N('Hazel’s writing leans over, like it’s walking uphill.'),
        N('Aldous’s writing stands up straight, stiff as a soldier.'),
        N('You check on the letter a lot. That’s part of keeping it safe.'),
      ],
      [
        {
          domain: 'art',
          skill: 'straight lines and leaning lines',
          standard: 'ELOF: Literacy',
          kind: 'do',
          after: 3,
          check: 'edu:draw:line:straight-leaning',
          lines: [
            N('(Draw a straight line in the air, like Aldous. Up and down!)'),
            N('(Now a leaning line, like Hazel. Whee, over it goes!)'),
          ],
          parentNote: 'Drew straight and leaning lines in the air, the first strokes of writing.',
        },
      ],
    ),
    sc(
      's13-complete',
      [
        N('A week later, Tobin gives you the apron and the stopped watch.'),
        T('Somebody meant to hand these down. He never stopped long enough.', 'soft'),
        N('Then he knocks the wedge out of the gear. Bonk!'),
        N('The wheel turns. Slowly. As slowly as the river likes.'),
        N('The sock is on the wheel, going round and round. Wheee!'),
        T('There. Nobody’s counting.', 'happy'),
        T('Bring your seeds down. The mill makes lovely flour.', 'happy'),
        T('Now, the year of the Three Hats… Where was I?', 'think'),
        Y('Mill. Yes. Light.'),
        N('Tobin laughs so hard he has to sit down.'),
      ],
      [
        {
          domain: 'science',
          skill: 'how a mill turns seeds into flour',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'notice',
          after: 6,
          lines: [
            T('The river turns the wheel. The wheel turns the big stone.', 'think'),
            T('The stone squashes seeds into soft flour. Flour makes bread!', 'happy'),
          ],
          parentNote: 'Learned that a water mill uses the river to grind seeds into flour for bread.',
        },
      ],
    ),
  ],
  'S13 sprout. Aldous’s letter is retold as a short, kind letter from a dad who was too busy to say “I love ' +
    'you”; the original never appears. Aldous’s death is said plainly once, in s13-level3. Tobin’s refrain ' +
    '(“Where was I? Cellar. Yes. Dark.”) is kept for the child to join in, and paid off in s13-complete. ' +
    'Variants (s13-letter-nomoss, s13-settled-burned, s13-settled-grave, s13-settled-grave-nomoss, s13-letter-given) ' +
    'are in EDU_SIDE_NEW_B_SPROUT_VARIANTS and replace scenes exactly as the main quest’s notes say.',
);

// ================================================================== S19 shared pieces
const S19_HOLLOW_START: Line[] = [
  N('Near the top, a rock leans over, like a hand over a cup.'),
  N('Under it there is no snow. The rock is dry and a little warm.'),
  N('On a flat stone sits a tiny red light. Smaller than your fingernail.'),
  MA('I’ll wait up on the edge. Shout if you need me.', 'soft'),
];

const S19_FADE_LESSON = (who: string): Beat => ({
  domain: 'sel',
  skill: 'feeling sad when someone dies, and what helps',
  standard: 'ELOF: Social and Emotional Development',
  kind: 'notice',
  after: 7,
  lines: [
    N(`${who} is sad. You might feel sad too. That’s all right.`),
    N('Staying close together helps. So does remembering.'),
    N('(Give your grown-up a hug, if you like.)'),
  ],
  parentNote: 'Heard plainly that Cinder died, and that feeling sad is all right; closeness and remembering help.',
});

const s19Choices = (forgivenExtra: Line[], rememberedAsk: Line, rememberedExtra: Line[]): Choice[] => [
  {
    id: 'forgiven',
    label: '“You’re forgiven.”',
    set: { cinder: 'forgiven' },
    then: [
      Y('You’re forgiven.'),
      N('The light goes warm, like a fire with the kettle on.'),
      CI('Oh. I thought being forgiven would be heavy. It’s light!', 'soft'),
      ...forgivenExtra,
    ],
  },
  {
    id: 'remembered',
    label: '“Only the grey Nubbins can say. But we’ll remember you.”',
    set: { cinder: 'remembered' },
    then: [
      Y('Only the grey Nubbins can say. But we’ll remember you.'),
      CI('Remembered. That’s what I should have asked for.', 'soft'),
      rememberedAsk,
      Y('All of it.'),
      ...rememberedExtra,
    ],
  },
];

const S19_CHOICES_MOSS = s19Choices(
  [M('Yes. This one, you just put down.', 'soft')],
  CI('Will you tell them I loved them?', 'soft'),
  [M('We are made of being remembered. I told her that once.', 'soft')],
);
const S19_CHOICES_SABLE = s19Choices(
  [N('Sable breathes out, long and slow. The light warms her nose.')],
  CI('Will you tell them I loved them? Not only what I did?', 'soft'),
  [N('Moss’s pale light glows brighter, once. Like a nod.')],
);
const S19_CHOICES_ALONE = s19Choices(
  [N('Up on the edge, Marina has stopped looking at the view.')],
  CI('Will you tell them I loved them? Not only what I did?', 'soft'),
  [N('The little light glows, as if it’s warming its hands.')],
);

// ================================================================== S19 Cinder’s Last Light
const S19: EduQuest = quest(
  's19',
  'Cinder’s Last Light',
  {
    's19-step1': {
      goal: 'Ask Marina how to climb up the snowy hill.',
      hint: 'She’s at the rock pools, breaking the ice.',
    },
    's19-step2': {
      goal: 'Climb up the snowfield.',
      hint: 'Step in Marina’s footprints. When the wind blows hard, crouch down and wait.',
    },
    's19-step3': {
      goal: 'Sit by the little red light, and wait.',
      hint: 'Sit very still and very quiet. It takes a long time.',
    },
    's19-step4': {
      goal: 'Stay with Cinder.',
      hint: 'Stay sitting. You don’t have to do anything. Just stay.',
    },
  },
  [
    sc(
      's19-warmth',
      [
        N('Two days after the Long Night. Snow everywhere. Very quiet.'),
        N('Moss sits on the step, looking up at the high snowy hill.'),
        N('He is very thin now. You can almost see through him.'),
        M('There is something warm up there.', 'think'),
        M('There shouldn’t be. Nothing has been warm up there for ages.'),
        M('I’m too thin to climb. Will you carry me in your coat?', 'soft'),
        M('I won’t talk much.', 'soft'),
        M('That was a fib. Ask Marina. She knows the path.', 'happy'),
      ],
      [
        {
          domain: 'science',
          skill: 'winter brings snow and cold',
          standard: 'K-ESS2-1',
          kind: 'ask',
          after: 0,
          prompt: [N('Snow on the ground. Cold air. What season is it?')],
          options: [
            opt('Winter', [M('Winter. The coldest time of year.', 'think')], true),
            opt('Summer', [M('Summer is warm and sunny. Snow comes in winter.')]),
          ],
          parentNote: 'Named winter as the snowy, cold season.',
        },
      ],
    ),
    sc(
      's19-marina',
      [
        N('Marina is in a rock pool, breaking the ice. She’s very happy.'),
        MA('The high pass? In winter? Lovely! It’s freezing up there. I love it.', 'happy'),
        MA('All our water comes down from that snow. I know the way.'),
        MA('Boots. A rope. Two pairs of socks.'),
        MA('Go slowly. Be careful.'),
        MA('Two pairs. I will check!'),
      ],
      [
        {
          domain: 'health',
          skill: 'dressing warmly for cold weather',
          standard: 'ELOF: Perceptual, Motor, and Physical Development',
          kind: 'do',
          after: 5,
          check: 'edu:point:clothes:warm',
          lines: [
            N('(What keeps us warm in the snow?)'),
            N('(Point to your feet, your hands and your head.)'),
            MA('Socks for feet. Mittens for hands. A hat for your head!', 'happy'),
          ],
          parentNote: 'Matched warm clothes to body parts to get ready for cold weather.',
        },
      ],
    ),
    sc(
      's19-climb',
      [
        N('First light. Marina ties a rope to you. Then Moss to your button.'),
        N('He rides in your coat, facing you. Just his little face pokes out.'),
        M('Left.', 'think'),
        MA('Right.'),
        N('Marina points at a rock. Moss points at the same rock.'),
        M('Her right is my left. We both mean that rock!', 'happy'),
        N('Crunch, crunch, crunch. The snow sounds like biting toast.'),
        MA('Lovely wind! It makes your cheeks tingle!', 'happy'),
        M('Your heart is very loud. I don’t mind. It’s warm.', 'soft'),
      ],
      [
        {
          domain: 'maths',
          skill: 'left and right',
          standard: 'ELOF: Mathematics Development',
          kind: 'do',
          after: 5,
          check: 'edu:wave:hand:left-right',
          lines: [
            N('(Wave your left hand, like Moss. Now your right, like Marina!)'),
            M('Left and right. Both good. Both up the hill.', 'happy'),
          ],
          parentNote: 'Practised left and right by waving each hand.',
        },
      ],
    ),
    sc(
      's19-hollow',
      [
        ...S19_HOLLOW_START,
        N('Moss has gone very still in your coat.'),
        M('…Cinder.', 'soft'),
        M('She was a warden, like me. Long, long ago.', 'soft'),
        M('She can’t hear us yet. We have to sit still for a long time.', 'soft'),
        M('Let me sit by her. You sit by me. We’ll wait.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'being still and calm, and waiting',
          standard: 'CASEL: Self-management',
          kind: 'do',
          after: 8,
          check: 'edu:sit:still:quiet',
          lines: [
            N('(Let’s be very still and quiet too. Breathe in… and out.)'),
            N('(Take three slow breaths together: one… two… three.)'),
          ],
          parentNote: 'Practised sitting still and breathing slowly while waiting.',
        },
      ],
    ),
    sc(
      's19-sit',
      [
        N('You sit on the dry rock. The wind goes over. Whoooo.'),
        N('Far below is the whole valley. The cottage looks tiny.'),
        N('The waterfall is frozen white. It doesn’t move at all.'),
        N('You wait. Your feet get cold.'),
        N('Grrrrr! Your tummy is very loud in all this quiet.'),
        N('Up on the edge, Marina coughs. A very polite cough.'),
        N('You keep waiting.'),
      ],
      [
        {
          domain: 'science',
          skill: 'very cold water turns to ice',
          standard: '2-ESS2-3',
          kind: 'ask',
          after: 2,
          prompt: [N('Why is the waterfall white and still?')],
          options: [
            opt('It got so cold, the water froze into ice', [N('Yes! When water gets very cold, it turns into ice.')], true),
            opt('It got tired', [N('Waterfalls don’t get tired! It got so cold, the water turned into ice.')]),
          ],
          parentNote: 'Explained a frozen waterfall: very cold water turns into ice.',
        },
      ],
    ),
    sc(
      's19-question',
      [
        N('After a long time, the red light grows a tiny bit bigger.'),
        CI('Are they safe?', 'soft'),
        M('Not just safe. They’re well.', 'soft'),
        M('Safe is sitting still. Well is running, and playing, and too many plums.', 'happy'),
        CI('Well. Well is better. I didn’t know.', 'sad'),
        CI('Long ago, I held them too tight. To keep them safe.', 'sad'),
        CI('They went still and grey. I am so sorry.', 'sad'),
        M('Every day. They skip to it. Badly. Very, very loudly.', 'happy'),
        N('The little light flickers. It might be a laugh.'),
        M('Cinder, I forgave you long ago. I still do.', 'soft'),
        CI('Thank you, Moss. Keeper, the grey Nubbins live by you.', 'soft'),
        CI('Do the grey Nubbins forgive me?', 'soft'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'hear words that rhyme',
          standard: 'RF.K.2',
          kind: 'ask',
          after: 6,
          prompt: [
            CI('Do they still say my name, down there?', 'soft'),
            N('Children skip to a rhyme about her:'),
            Y('Cinder held them close and tight, kept them warm one winter night.'),
            N('Which word rhymes with “tight”?'),
          ],
          options: [
            opt('Night', [CI('Tight, night. That’s right. They still say my name.', 'soft')], true),
            opt('Warm', [N('Listen: tight… night. Night rhymes with tight.'), CI('They still say my name.', 'soft')]),
          ],
          parentNote: 'Heard the valley’s skipping rhyme and found the rhyming pair “tight” and “night”.',
        },
        {
          domain: 'sel',
          skill: 'saying sorry and forgiving',
          standard: 'CASEL: Relationship skills',
          kind: 'notice',
          after: 9,
          lines: [
            N('Saying sorry is brave. Forgiving is kind.'),
            N('(Ask: when did someone forgive you? Wait for an answer.)'),
          ],
          parentNote: 'Saw someone say sorry and be forgiven, and talked about a time they were forgiven.',
        },
      ],
      { choices: S19_CHOICES_MOSS },
    ),
    sc(
      's19-after',
      [
        N('The red light is getting smaller. Slowly. Gently.'),
        CI('I kept my little light on for so long. In case there was news.', 'soft'),
        CI('Now there’s been news. I can stop.', 'soft'),
        N('Cinder is fading. That means she is dying.'),
        N('Her light will stop, and it won’t start again.'),
        CI('Will you stay? You don’t have to do anything. Just stay.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'staying close to someone who needs us',
          standard: 'CASEL: Social awareness',
          kind: 'do',
          after: 5,
          check: 'edu:hold:hand:stay',
          lines: [
            N('(Hold your grown-up’s hand. Staying close is a kind thing to do.)'),
            CI('Thank you.', 'soft'),
          ],
          parentNote: 'Heard plainly what fading means, and learned that staying close is a way to care for someone.',
        },
      ],
    ),
    sc(
      's19-fade',
      [
        N('You stay. Moss sits right next to the little light.'),
        N('The light gets smaller and smaller. Slowly. Gently.'),
        CI('Moss. It isn’t cold, like the grey Nubbins were.', 'soft'),
        M('No. This is the gentle kind.', 'soft'),
        N('Then the light is gone. Cinder has died.'),
        N('There is only the flat stone, and the wind.'),
        M('That is fading done right. Gentle. Then you let go.', 'soft'),
        N('Moss sits there a long time. You sit with him.'),
      ],
      [S19_FADE_LESSON('Moss')],
    ),
    sc(
      's19-complete',
      [
        N('Where the light was, the stone is still warm. Like a hand.'),
        N('On it sits a little red pebble. It stays warm all the way home.'),
        N('Marina’s eyes are red. She has been crying a bit.'),
        MA('It’s the wind. Mostly.', 'soft'),
        MA('Come on. Feet in my footprints. Home before dark.', 'soft'),
        N('That night, the lantern by the long grass feels warm to stand by.'),
        N('You put the red pebble on the windowsill.'),
        N('By morning, five Nubbins are asleep in a heap under it. Snore!'),
        N('One wakes up and licks the red pebble. Not supper!'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 5',
          standard: 'K.CC.B.5',
          kind: 'do',
          after: 8,
          check: 'edu:count:nubbins:5',
          lines: [N('(Count the sleepy Nubbins: one, two, three, four, five.)'), N('Five Nubbins, warm and snug. Shh!')],
          parentNote: 'Counted five sleeping Nubbins.',
        },
      ],
    ),
  ],
  'S19 sprout. Cinder is introduced simply: a warden who, long ago, held the Nubbins too tight to keep them safe, ' +
    'and they went still and grey. Her fading is honest: s19-after says what fading means (“she is dying… her light ' +
    'will stop, and it won’t start again”) and s19-fade says “Cinder has died”, followed by comfort. Moss’s “No. ' +
    'They’re well.” becomes “Not just safe. They’re well.” so a young child hears the difference. Both choices kept. ' +
    'Scene-level set on s19-warmth (s19-with = moss) still comes from the original. The Sable route uses the -sable ' +
    'versions in EDU_SIDE_NEW_B_SPROUT_VARIANTS; s19-warmth-sable says plainly that Moss died at the Long Night, ' +
    'with the comfort of his pale light staying with Sable. If Moss has left the world and Sable is not bonded, the -alone ' +
    'versions (you and Marina only) play instead; you answer Cinder yourself.',
);

// ================================================================== S22 The Climb
const S22: EduQuest = quest(
  's22',
  'The Climb',
  {
    's22-step1': {
      goal: 'Climb the slidey stones with Nova.',
      hint: 'Three quick steps, then rest on a big rock. Keep going!',
    },
    's22-step2': {
      goal: 'Climb up the Chimney.',
      hint: 'Push with your back, step with your feet. One at a time.',
    },
    's22-step3': {
      goal: 'Cross the Ridge.',
      hint: 'Stay low when the wind blows. Look at the next step, not down.',
    },
    's22-step4': {
      goal: 'Put the flag on the very top.',
      hint: 'It’s in Nova’s bag, under the oatcakes. Push the pole into the crack.',
    },
  },
  [
    sc(
      's22-foot',
      [
        N('The Tooth is a tall, pointy mountain. Snow on the very top.'),
        N('Nova waits at the bottom with a rope and a bag of oatcakes.'),
        NO('I’ve tried to climb it three times. I always come down.', 'think'),
        NO('I asked you for help once. It went well. So here I am!', 'soft'),
        N('Next to her sits a little shadow, the size of a cat.'),
        N('It looks just like Nova. Same hair. Same boots.'),
        N('It has a tiny rope too, and it trips on it. Flop!'),
        WO('What if you slip?', 'think'),
        NO('…You can see it? Nobody ever sees it!', 'shock'),
        NO('It’s my Worry. It talks to me. It’s mostly right. Annoying!', 'think'),
        NO('Right. Up we go. I’ll sing. It helps me.', 'happy'),
      ],
      [
        {
          domain: 'sel',
          skill: 'naming a worry',
          standard: 'CASEL: Self-awareness',
          kind: 'notice',
          after: 9,
          lines: [
            NO('Everybody has worries. Mine always says “what if”.', 'think'),
            N('Giving a worry a name makes it easier to carry.'),
            N('(Ask: do you have a “what if” worry? Wait for an answer.)'),
          ],
          parentNote: 'Met Nova’s Worry and talked about naming their own “what if” worries.',
        },
      ],
    ),
    sc(
      's22-scree',
      [
        N('The little stones slide under your feet. Clatter, clatter!'),
        NO('♪ Little stones, little stones, sliding under my toes! ♪', 'happy'),
        NO('♪ I’m going up, but I’m sliding down, and that’s how it goes! ♪', 'happy'),
        N('She sings it again. And again. And again!'),
        N('The Worry puts its hands over its ears.'),
        WO('Last time you slipped here. You hurt your knee.'),
        NO('It’s right about that. It’s the next bit it gets wrong.', 'think'),
      ],
      [
        {
          domain: 'music',
          skill: 'clapping a steady beat',
          kind: 'do',
          after: 3,
          check: 'edu:clap:beat:stones-song',
          lines: [N('(Clap along as you sing: lit-tle stones, lit-tle stones!)'), NO('Clap, clap! Now we’re a band.', 'happy')],
          parentNote: 'Clapped a steady beat along with Nova’s climbing song.',
        },
      ],
      {
        choices: [
          {
            id: 'both',
            label: '“It is right. And you got up and kept going.”',
            set: { 's22-scree': 'both' },
            friendship: { nova: 1 },
            then: [
              NO('…I did, didn’t I? I kept going all the way up.', 'think'),
              WO('That’s… also true.', 'think'),
              NO('Ha!', 'happy'),
            ],
          },
          {
            id: 'together',
            label: '“That was last time. This time there are two of us.”',
            set: { 's22-scree': 'together' },
            friendship: { nova: 1 },
            then: [NO('Two of us. Huh.', 'soft'), WO('Three.', 'think'), NO('It can count! It always could.', 'happy')],
          },
        ],
      },
    ),
    sc(
      's22-chimney',
      [
        N('The Chimney is a narrow crack in the rock.'),
        N('Back on one side. Boots on the other. Push and step!'),
        NO('♪ I’m in a crack, I’m in a crack! This is my foot! ♪', 'happy'),
        NO('♪ This is my other foot! ♪', 'happy'),
        N('Far below, a big bird called a buzzard flies round and round.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'above and below',
          standard: 'K.G.A.1',
          kind: 'ask',
          after: 4,
          prompt: [N('Is the buzzard above you, or below you?')],
          options: [
            opt('Below', [NO('Below! We’re higher than a bird. Wow.', 'shock')], true),
            opt('Above', [NO('Look down… it’s below us! We’re higher than the bird.')]),
          ],
          parentNote: 'Used “above” and “below” to say where the bird was.',
        },
      ],
    ),
    sc(
      's22-chimney-top',
      [
        N('Halfway up, Nova stops. The Worry sits just above her.'),
        WO('When you were little, somebody went away. What if somebody goes again?', 'soft'),
        N('Nova holds the rock tight. She doesn’t move.'),
        NO('That’s true. Somebody went away when I was nine. I was very sad.', 'sad'),
        NO('So now I always go first. Then nobody can go away from me.', 'sad'),
      ],
      [
        {
          domain: 'health',
          skill: 'slow breathing to feel calm',
          standard: 'CASEL: Self-management',
          kind: 'do',
          after: 4,
          check: 'edu:breathe:slow:flower-candle',
          lines: [
            N('(Help Nova feel calm. Smell a flower: breathe in…)'),
            N('(Blow out a candle: breathe out… Once more!)'),
            NO('That helps. A bit. Thanks.', 'soft'),
          ],
          parentNote: 'Practised slow “smell the flower, blow the candle” breathing to calm a scared feeling.',
        },
      ],
      {
        choices: [
          {
            id: 'true',
            label: '“It’s true. But it isn’t a reason to let go.”',
            set: { 's22-chimney': 'true' },
            friendship: { nova: 1 },
            then: [
              NO('…No. It isn’t.', 'soft'),
              N('She moves one hand. Then one foot. Slowly.'),
              WO('I didn’t say let go. I said it’s a long way down.', 'soft'),
              NO('You’re very bad at saying what you mean.', 'think'),
            ],
          },
          {
            id: 'look',
            label: '“Not now. Look at me, not down.”',
            set: { 's22-chimney': 'look' },
            friendship: { nova: 1 },
            then: [
              N('She looks at you. Not down. At you.'),
              NO('…Right. Hands.', 'think'),
              N('She climbs. The Worry climbs too, muttering about loose rocks.'),
            ],
          },
        ],
      },
    ),
    sc(
      's22-ridge',
      [
        N('The Ridge is thin, with sky on both sides. Whoosh goes the wind!'),
        N('This is where Nova always turns back.'),
        N('There’s a little pile of stones. One stone for every try.'),
        WO('Go back. It’s windy. It’s high. Come another day.', 'soft'),
        NO('When my Worry talks, I feel small.', 'sad'),
        NO('So I go home. Three times. Three stones.', 'sad'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 3, and one more',
          standard: 'K.OA.A.1',
          kind: 'do',
          after: 2,
          check: 'edu:count:stones:3',
          lines: [
            N('(Count the stones: one, two, three.)'),
            NO('Three tries. If I get across, this try is number four!', 'think'),
          ],
          parentNote: 'Counted three stones and worked out that one more try makes four.',
        },
      ],
    ),
    sc(
      's22-ridge-cross',
      [
        N('In the middle of the Ridge, Nova stops. The Worry is beside her.'),
        N('She looks at it. Then she holds out her hand.'),
        NO('Come on, then. You always come. So come with me.', 'soft'),
        WO('…What?', 'shock'),
        N('The Worry takes her hand. It gets smaller. Not gone. Smaller.'),
        N('They cross together. Nova sings. A second voice joins in, very flat.'),
        NO('You can SING?', 'shock'),
        WO('I always could. You never asked.', 'soft'),
      ],
      [
        {
          domain: 'sel',
          skill: 'worries feel smaller when we share them',
          standard: 'ELOF: Social and Emotional Development',
          kind: 'notice',
          after: 4,
          lines: [
            N('When Nova holds her Worry gently, it gets smaller.'),
            N('Worries feel smaller when we share them with someone.'),
            N('(Ask: who could you tell a worry to? Wait for an answer.)'),
          ],
          parentNote: 'Saw a worry shrink when it was held gently, and named someone they could tell a worry to.',
        },
      ],
    ),
    sc(
      's22-scramble',
      [
        N('The last bit is a climb on hands and knees.'),
        N('Up here the air is very cold. The snow never melts.'),
        N('At the top is a point of rock, as big as a kitchen table.'),
        NO('Give me the flag. No, you do it. No. Together!', 'happy'),
      ],
      [
        {
          domain: 'science',
          skill: 'high up on a mountain it is colder',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'notice',
          after: 1,
          lines: [
            NO('High up on a mountain, it’s colder than down below.', 'think'),
            NO('That’s why the very top has snow, when the valley doesn’t.'),
          ],
          parentNote: 'Learned that mountain tops are colder than valleys, which is why snow stays up there.',
        },
      ],
    ),
    sc(
      's22-summit',
      [
        N('From the top of the Tooth, you can see everything!'),
        N('The waterfall, like a white thread. Marina’s pools, like coins.'),
        N('And the Grove: the pond, the cottage, four tiny lantern posts.'),
        N('Nova sits down. The Worry sits next to her, holding her hand.'),
        NO('I’d like to stay for a while.', 'soft'),
        NO('Not up here. Down there, in the valley. With you all.', 'soft'),
        WO('It might be scary.', 'soft'),
        NO('Yes. You can come too.', 'soft'),
      ],
      [
        {
          domain: 'social-studies',
          skill: 'a map is a picture of a place from above',
          standard: 'D2.Geo.2.K-2',
          kind: 'do',
          after: 2,
          check: 'edu:point:map:valley',
          lines: [
            N('From up high, the valley looks like a map.'),
            N('(Point: where is the pond? Where is the cottage?)'),
            NO('A map is a picture of a place, seen from above.', 'think'),
          ],
          parentNote: 'Looked down on the valley like a map and pointed out places in it.',
        },
      ],
    ),
    sc(
      's22-complete',
      [
        N('Going down is quicker, and much more slippy.'),
        N('Nova and the Worry sing all the way.'),
        N('At the bottom, Nova opens the bag of oatcakes.'),
        N('Squish! They are all flat.'),
        N('Somebody sat on them. Nova looks at the Worry.'),
        N('The Worry looks at the sky.'),
        NO('Keep the flag. And my spare boots. I won’t need spares.', 'happy'),
        NO('I’m not going anywhere. I’m staying here, in the valley.', 'soft'),
        N('The Worry waves. Small. Only you can see it.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'one each: counting to share fairly',
          standard: 'K.CC.B.4',
          kind: 'ask',
          after: 5,
          prompt: [NO('Three of us: me, you, and my Worry. How many oatcakes do we need?', 'think')],
          options: [
            opt('3', [NO('Three! One each. Fair and square.', 'happy')], true),
            opt('2', [NO('Let’s count: one for me, one for you, one for the Worry. Three!')]),
            opt('5', [NO('That’s extra! One each makes three.')]),
          ],
          parentNote: 'Matched one oatcake to each of three friends to share fairly.',
        },
      ],
    ),
  ],
  'S22 sprout. Nova’s Worry is small, a little funny and never frightening: it says “What if…?”, which gives the ' +
    'child the words for their own worries. The quest’s SEL thread is naming a worry (s22-foot), calming it ' +
    '(s22-chimney-top) and sharing it (s22-ridge-cross). Both choices at each fork are kept.',
);

// ================================================================== S14 Tilly’s Tabletop
const S14: EduQuest = quest(
  's14',
  'Tilly’s Tabletop',
  {
    's14-step1': {
      goal: 'Play Tilly’s game: the Bog of Mild Peril.',
      hint: 'Roll the dice when Tilly says. Count the dots!',
    },
    's14-step2': {
      goal: 'Get up the Tower of the Tax Toad.',
      hint: 'The Toad wants shells for everything. Try paying with silly things!',
    },
    's14-step3': {
      goal: 'Find Tilly.',
      hint: 'Listen for her whistle: low, then high.',
    },
    's14-step4': {
      goal: 'Get past the Grey Grandmother’s geese.',
      hint: 'Roll the dice three times. You can’t lose. The worst thing that happens is: you get a goose.',
    },
    's14-step5': {
      goal: 'Sit next to the dragon, and wait.',
      hint: 'Put the dice down. Don’t move. Just wait.',
    },
  },
  [
    sc(
      's14-table',
      [
        N('Rain on the window. Pitter, patter.'),
        N('In comes Sparks, with a small girl in big wellies.'),
        SP('This is Tilly. My cousin. She’s nine. She’s the boss now. Sorry!', 'happy'),
        TI('I’m the Game Mistress. It’s like a boss, but more.'),
        N('Pixel and Byte come too. They are married.'),
        N('They argue about who rolls first.'),
        N('She spreads a felt-tip map on Hazel’s table.'),
        N('Then the dice. Cardboard, cut by hand, with tape on the corners.'),
        TI('Rule one: the Game Mistress is always right. Rule two: see rule one.'),
        TI('Rule three: snacks at the end. Only at the end.'),
        TI('Everybody starts with eight points. Don’t lose them.'),
        TI('Pick your hero. Ten seconds. Nine. Four!'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 6',
          standard: 'K.CC.B.5',
          kind: 'do',
          after: 7,
          check: 'edu:count:dice-sides:6',
          lines: [
            N('(A die has six sides. Count them: one, two, three, four, five, six.)'),
            TI('Five sides have dots. The sixth side just says LOTS.', 'happy'),
          ],
          parentNote: 'Counted the six sides of a die.',
        },
      ],
      {
        choices: [
          {
            id: 'knight',
            label: 'A knight with a slightly bent sword.',
            set: { 's14-hero': 'knight' },
            then: [TI('Sir Bent Sword! Bent swords can hit round corners.', 'happy')],
          },
          {
            id: 'wizard',
            label: 'A wizard who mostly makes soup.',
            set: { 's14-hero': 'wizard' },
            then: [TI('Soup Wizard! Your spells are hot. Blow on them first.', 'happy')],
          },
          {
            id: 'rogue',
            label: 'A sneaky hero dressed as a hat stand.',
            set: { 's14-hero': 'rogue' },
            then: [TI('Nobody suspects a hat stand. Not even other hat stands.', 'happy')],
          },
        ],
      },
    ),
    sc(
      's14-bog',
      [
        N('The Bog of Mild Peril is the pond, coloured green.'),
        N('A felt-tip frog sits in it. He does not look impressed.'),
        SP('I ATTACK THE BOG!', 'happy'),
        TI('You can’t attack a bog. Roll anyway.'),
        N('Sparks rolls. One dot.'),
        TI('A one! Your sword is now a cheese sandwich.', 'happy'),
        BY('Actually, that’s not how—'),
        TI('Rule four! Say “actually”, lose a point. Byte has seven.'),
        N('Byte opens his mouth. Byte shuts his mouth. Pop!'),
        N('You roll a LOTS. The bog likes you. Everybody gets across!'),
        TI('Game over. Nobody’s hurt. Somebody’s a sandwich.', 'happy'),
      ],
      [
        {
          domain: 'science',
          skill: 'animal homes: frogs live in ponds',
          standard: 'K-ESS3-1',
          kind: 'ask',
          after: 1,
          prompt: [TI('Where do real frogs like to live?', 'think')],
          options: [
            opt('In ponds and wet places', [TI('Yes! Frogs need water. Ponds are perfect frog homes.', 'happy')], true),
            opt('In a dry desert', [TI('Too dry! Frogs need water. They live in ponds and wet places.')]),
            opt('Up a chimney', [TI('Ha! No. Frogs live in ponds and wet places.', 'happy')]),
          ],
          parentNote: 'Learned that frogs live in ponds and wet places because they need water.',
        },
      ],
    ),
    sc(
      's14-tower',
      [
        N('Next day there’s a new tower on the map.'),
        TI('The Tower of the Tax Toad! He makes you pay for everything.'),
        TI('Ribbit! That’s two shells for the ribbit.', 'angry'),
        TI('And one shell for the stairs!'),
        PX('Can I build a machine to beat him?', 'happy'),
        TI('Roll. Three dots. Your machine is a toad now. It works for him.'),
        BY('Do we pay a shell for paying a shell?', 'think'),
        TI('…Yes! Thanks SO much, Byte.', 'happy'),
        N('Byte hands over one more shell. Clink.'),
        TI('That was a very “actually” question. Six!'),
        PX('Twenty years married, and Byte still gives people ideas.'),
        BY('You married a man who asks questions. It was in our promises.', 'think'),
      ],
      [
        {
          domain: 'maths',
          skill: 'add 1 more',
          standard: 'K.OA.A.2',
          kind: 'ask',
          after: 3,
          prompt: [TI('Two shells for the ribbit. One for the stairs. How many shells?')],
          options: [
            opt('3', [TI('Three shells! Two and one more make three.', 'happy')], true),
            opt('2', [TI('Count with me: one, two… and one more. Three!')]),
            opt('5', [TI('Too many! Two and one more make three.')]),
          ],
          parentNote: 'Added two shells and one more shell to make three.',
        },
      ],
    ),
    sc(
      's14-toad',
      [
        BY('The Toad owes… no, we owe… I’ve muddled it.', 'think'),
        TI('The Toad can’t count. He just likes shells. RIBBIT!'),
        N('Then Pixel’s Nubbin wakes up. It climbs onto the map.'),
        N('Chomp! It eats the cardboard Tax Toad.'),
        TI('The Toad has been eaten! No more paying for anyone!', 'happy'),
        SP('BEST GAME EVER!', 'happy'),
        N('Tilly laughs so much she lies on the floor.'),
        N('Then she stops. She looks at one corner of the map.'),
        N('It’s coloured grey. So hard, it went right through the paper.'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'first sounds: t',
          standard: 'RF.K.2',
          kind: 'ask',
          after: 4,
          prompt: [
            TI('Tilly. Tax. Toad. They all start with the same sound. T-t-t!'),
            TI('Which one starts with t too?'),
          ],
          options: [
            opt('Table', [TI('T-t-table! Yes!', 'happy')], true),
            opt('Frog', [TI('F-f-frog starts with f. Listen: t-t-table. Table!')]),
            opt('Map', [TI('M-m-map starts with m. T-t-table starts with t!')]),
          ],
          parentNote: 'Heard the “t” sound at the start of Tilly, Tax and Toad, and found another t word.',
        },
      ],
    ),
    sc(
      's14-sparks',
      [
        N('Next morning, Sparks is at your gate. Being quiet. Sparks is never quiet!'),
        SP('The dragon in the corner of the map keeps getting bigger.', 'sad'),
        SP('Last night it got a cardigan. Hazel always wears a cardigan.'),
        SP('So the dragon is really Hazel. Tilly misses her.'),
        SP('Hazel went away on a long trip. She didn’t say goodbye.'),
        SP('Hazel left Tilly a note. She won’t open it. It’s in her welly.'),
        SP('Go and find Tilly. She likes you. You’re not a sandwich!', 'soft'),
      ],
      [
        {
          domain: 'sel',
          skill: 'missing someone: two feelings at once',
          standard: 'CASEL: Self-awareness',
          kind: 'notice',
          after: 4,
          lines: [
            SP('Tilly misses Hazel. She feels sad and cross at the same time.', 'sad'),
            N('Missing someone can feel like that. Both feelings are all right.'),
          ],
          parentNote: 'Heard that missing someone can make us feel sad and cross at once, and that both are all right.',
        },
      ],
    ),
    sc(
      's14-gate',
      [
        N('You hear a whistle. Low, then going up high. Wheee-oo!'),
        N('Every Nubbin in the Grove looks up.'),
        N('Tilly sits on the gate that sticks, kicking it.'),
        TI('They think it’s supper. It isn’t. I just do it.'),
        TI('Hazel taught me. She said whoever loves you comes running.'),
        N('The Nubbins sit in a row in front of her wellies.'),
        TI('See. It works on them.', 'sad'),
      ],
      [
        {
          domain: 'music',
          skill: 'low and high sounds',
          kind: 'do',
          after: 0,
          check: 'edu:sing:supper-call:low-high',
          lines: [
            N('(Make the supper call with your voice: start low, then slide up high! Wheee-oo!)'),
            N('Low… then high! That’s how Hazel did it.'),
          ],
          parentNote: 'Made a sound that slides from low to high, like Hazel’s supper whistle.',
        },
      ],
      {
        choices: [
          {
            id: 'ask',
            label: 'Ask her about Hazel.',
            set: { 's14-approach': 'asked' },
            then: [
              TI('I’m not talking about her.', 'angry'),
              N('A Nubbin licks her welly.'),
              TI('She didn’t say goodbye. You’re supposed to say goodbye!', 'angry'),
              N('Tilly takes out Hazel’s note. She does not open it. She puts it back.'),
              TI('Come and play. I’ve got a dragon to do.'),
            ],
          },
          {
            id: 'play',
            label: 'Ask her about the dragon.',
            set: { 's14-approach': 'played' },
            then: [
              TI('She’s the Grey Grandmother. Very old. Very rude.'),
              TI('She flew away without saying goodbye. She keeps biscuit tins.'),
              TI('She’s the last boss. Come on.', 'sad'),
            ],
          },
        ],
      },
    ),
    sc(
      's14-lair',
      [
        N('The last game. Curtains shut. A torch under a bowl, for spooky light.'),
        TI('The Lair of the Grey Grandmother. First, get past her geese!'),
        SP('I HIT THE GOOSE WITH MY SANDWICH!', 'angry'),
        TI('Roll. LOTS! The goose eats the sandwich. Now it’s your friend.'),
        N('Then you roll. LOTS again! Another goose is your friend.'),
        BY('Do I still have six points?'),
        TI('Five! You said “do” very, very actually.'),
        N('Byte’s ears go pink. He writes a tiny sad 5.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'add 1 more',
          standard: 'K.OA.A.1',
          kind: 'ask',
          after: 4,
          prompt: [TI('One friendly goose. Then one more. How many geese?')],
          options: [
            opt('2', [TI('Two geese! One and one more make two. Honk, honk!', 'happy')], true),
            opt('1', [TI('One… and one more! That makes two. Honk, honk!')]),
            opt('4', [TI('Not that many! One and one more make two.')]),
          ],
          parentNote: 'Added one goose and one more goose to make two.',
        },
      ],
    ),
    sc(
      's14-dragon',
      [
        N('Tilly lifts a cereal box off the corner. Under it is the dragon.'),
        N('She’s cut from a biscuit-tin lid. Grey, with a felt-tip cardigan.'),
        TI('The Grey Grandmother. She flew away. She’s the boss.'),
        SP('Right! I roll to hit the—'),
        N('Tilly grabs the dice. Rrrip! One tears.'),
        TI('No! Nobody hits her. Nobody.', 'angry'),
        N('The kitchen goes very quiet. The rain has stopped.'),
        TI('I don’t know how it ends. Not if nobody can hit her.', 'sad'),
      ],
      [
        {
          domain: 'sel',
          skill: 'helping a friend who is upset',
          standard: 'ELOF: Social and Emotional Development',
          kind: 'ask',
          after: 7,
          prompt: [N('Tilly is upset. She doesn’t know what to do.'), N('What can a friend do?')],
          options: [
            opt('Sit close by, and wait', [N('Yes. Sometimes the kindest thing is to sit close, and wait.')], true),
            opt('Run away', [N('Running away leaves her on her own. Sitting close, and waiting, helps more.')]),
          ],
          parentNote: 'Thought about how to help an upset friend: stay close and wait with them.',
        },
      ],
      {
        choices: [
          {
            id: 'sit',
            label: '“My hero puts down the sword and sits by the dragon.”',
            set: { 's14-lair': 'sat' },
            then: [
              TI('That’s not a move.', 'think'),
              TI('…What for?'),
              Y('Hazel’s third rule. When you don’t know what to do, sit and wait.'),
            ],
          },
          {
            id: 'roll',
            label: 'Roll to see if your hero can sit down.',
            set: { 's14-lair': 'rolled' },
            then: [
              N('You roll the torn die. It lands on the torn side. No number!'),
              TI('That’s… not a number.', 'think'),
              Y('Then you decide. My hero would like to sit next to the dragon.'),
              N('Tilly looks at the torn die for a long time.'),
              TI('The dice says… the dragon says yes.', 'soft'),
            ],
          },
          {
            id: 'ask',
            label: 'Ask the Game Mistress what the dragon wants.',
            set: { 's14-lair': 'asked' },
            then: [
              TI('She doesn’t WANT anything. She just WENT.', 'angry'),
              N('You don’t say anything. Tilly looks at the dragon for a long time.'),
              TI('…She wants someone to sit with her. Fine. FINE.', 'sad'),
            ],
          },
        ],
      },
    ),
    sc(
      's14-wait',
      [
        N('You move your button to the dragon’s square. You leave it there.'),
        TI('She doesn’t do anything. She just sits there.'),
        Y('That’s all right. We’re waiting.'),
        N('Sparks puts a button next to yours. Then Pixel. Then Byte.'),
        BY('Is there a rule against it?'),
        TI('…No.', 'soft'),
        N('A Nubbin taps the window. It hopes it’s supper.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 4',
          standard: 'K.CC.B.5',
          kind: 'do',
          after: 5,
          check: 'edu:count:buttons:4',
          lines: [
            N('(Count the buttons round the dragon: one, two, three, four.)'),
            N('Four friends, sitting and waiting together.'),
          ],
          parentNote: 'Counted four buttons waiting beside the dragon.',
        },
      ],
    ),
    sc(
      's14-tears',
      [
        TI('The dragon says—'),
        N('Tilly picks up the dragon. She holds it in both hands.'),
        TI('She says she had something important to do.'),
        TI('She didn’t say goodbye, because she would have cried.'),
        TI('I don’t know what else she says. She didn’t SAY!', 'sad'),
        N('Tilly cries with her whole face, all at once.'),
        N('Sparks comes round the table and hugs her. Not a word.'),
        N('Pixel passes a tea towel. Byte passes a better one.'),
        N('You keep your button right where it is.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'crying is all right; comfort helps',
          standard: 'CASEL: Social awareness',
          kind: 'notice',
          after: 7,
          lines: [N('It’s all right to cry. Crying lets the sad out.'), N('A quiet hug, and friends nearby, help a lot.')],
          parentNote: 'Saw friends comfort someone who was crying, and heard that crying is all right.',
        },
      ],
    ),
    sc(
      's14-complete',
      [
        TI('Game over. Snacks for everyone. That was always a rule.', 'soft'),
        N('Crisps, Fern’s burnt biscuits, and grapes the Nubbins already found.'),
        N('Tilly eats with the dragon in her lap.'),
        N('Now and then, Tilly pats her welly. The note is still there.'),
        TI('The Grey Grandmother isn’t the boss now. You can visit her.'),
        TI('And Byte gets all eight points back. For the tea towel.'),
        N('She puts her cardboard crown on your head. GAME MISTRESS!'),
        N('Later, you look at the map. The grey corner is coloured yellow now.'),
        N('It says: HERE BE HAZEL. SHE IS ALLOWED.'),
        N('Out by the gate, someone practises the supper call. Wheee-oo!'),
      ],
      [
        {
          domain: 'art',
          skill: 'naming colours',
          kind: 'ask',
          after: 7,
          prompt: [N('The corner was grey. What colour is it now?')],
          options: [
            opt('Yellow', [N('Yellow! A bright, warm colour, like sunshine.', 'happy')], true),
            opt('Grey', [N('It was grey. Now Tilly has coloured it yellow, bright as sunshine.')]),
            opt('Green', [N('The bog is green! The corner is yellow now.')]),
          ],
          parentNote: 'Named the colour yellow, and saw how Tilly changed a sad grey corner into a bright one.',
        },
      ],
    ),
  ],
  'S14 sprout. The cardboard dice are the counting thread: sides of a die (6), shells (2 + 1), geese (1 + 1) and ' +
    'buttons (4), with other domains in between. Hazel is away on a trip at this point in the story (true: she is in ' +
    'the Hollow), so Tilly’s feelings are about missing her and not getting a goodbye. Never say where Hazel is. Hazel ' +
    'left Tilly a short note (not a letter), which stays folded in her welly. Tilly is not Hazel’s grandchild, so the ' +
    'map corner says HERE BE HAZEL. Only the “sit” choice names Hazel’s third rule; “roll” ends with the dice and ' +
    '“ask” with Tilly working it out. All choices kept.',
);

// ================================================================== S20 Fort Night
const S20: EduQuest = quest(
  's20',
  'Fort Night',
  {
    's20-step1': {
      goal: 'Round one: gather snow and sticks, and build your wall.',
      hint: 'Put lots of children on gathering at the start. Wall first!',
    },
    's20-step2': {
      goal: 'Round two: send Zip to peek at the other fort.',
      hint: 'Hide Zip behind the snowdrifts. Run when the lookout turns away.',
    },
    's20-step3': {
      goal: 'Round three: send the snow-fighters that beat theirs.',
      hint: 'Speedy beats Splashy. Splashy beats Sturdy. Sturdy beats Speedy.',
    },
    's20-step4': {
      goal: 'Build one big shelter, and get every child inside.',
      hint: 'Count everyone. Wren is little and easy to miss.',
    },
  },
  [
    sc(
      's20-declaration',
      [
        N('Deep, squeaky snow. Every child in the valley is out in it.'),
        N('A card on your gate says: WAR! FORT NIGHT! BRING MITTENS!'),
        N('Tilly has come for the holidays. She is Sparks’s cousin.'),
        N('And there is snow!'),
        TI('You lead one fort. I lead the other. I’m going to win!', 'happy'),
        PX('I’m the referee. I wrote the rules. Forty-one pages.'),
        PX('My husband Byte read them all. He had notes.', 'think'),
        PX('Three kinds of snow-fighter: Speedy, Splashy and Sturdy.'),
        PX('Speedy beats Splashy. Splashy beats Sturdy. Sturdy beats Speedy!'),
        N('Bonk! A snowball hits a small boy called Gordon.'),
        GO('I’m all right!', 'happy'),
        WR('Commander! I’m Wren! What’s our battle cry?', 'happy'),
      ],
      [
        {
          domain: 'maths',
          skill: 'what comes next in a pattern',
          standard: 'ELOF: Mathematics Development',
          kind: 'ask',
          after: 8,
          prompt: [
            PX('It goes round and round, like a pattern.', 'think'),
            PX('Speedy, Splashy, Sturdy, Speedy, Splashy… what comes next?'),
          ],
          options: [
            opt('Sturdy', [PX('Sturdy! Then the pattern goes round again.', 'happy')], true),
            opt('Speedy', [PX('Speedy comes after Sturdy. Listen: Speedy, Splashy, STURDY.')]),
            opt('Gordon', [PX('Ha! Gordon isn’t in the pattern. Speedy, Splashy, Sturdy!', 'happy')]),
          ],
          parentNote: 'Continued a repeating pattern of three.',
        },
      ],
      {
        choices: [
          {
            id: 'fort',
            label: '“FOR THE FORT!”',
            set: { 's20-cry': 'fort' },
            then: [WR('FOR THE FORT!', 'happy'), PX('Classic. Approved.')],
          },
          {
            id: 'mittens',
            label: '“FOR WREN’S NAN’S GOOD MITTENS!”',
            set: { 's20-cry': 'mittens' },
            then: [WR('FOR MY NAN’S GOOD MITTENS!', 'happy'), WR('She knitted them. They have thumbs!')],
          },
          {
            id: 'gordon',
            label: '“REMEMBER GORDON!”',
            set: { 's20-cry': 'gordon' },
            then: [GO('I’m right here.', 'think'), N('Everyone shouts it anyway. Then a snowball hits Gordon.')],
          },
        ],
      },
    ),
    sc(
      's20-round1',
      [
        N('Everyone gathers snow and sticks. Pat, pat, pat!'),
        N('Every time you point at Wren, she salutes.'),
        WR('Yes, commander! Yes, commander! That’s nine times. I’m only little!', 'angry'),
        PX('Rule: don’t hit the snowman. He has feelings. He’s called Derek.'),
        N('The whistle blows. Your wall is short and fat and lumpy.'),
        N('Their wall is tall and thin, with pointy bits on top.'),
        TI('I put everyone on snow from the start!', 'happy'),
        PX('Round one: a draw. Both of them are walls.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'saying sorry and thank you',
          standard: 'CASEL: Relationship skills',
          kind: 'ask',
          after: 2,
          prompt: [N('Wren is cross. She has been asked nine times!'), N('What could you say to Wren?')],
          options: [
            opt('“Sorry, Wren. Thank you for helping!”', [WR('Oh! You’re welcome, commander.', 'happy'), N('Sorry and thank you make friends feel good.')], true),
            opt('“Faster, Wren!”', [N('Hmm. Wren is only little. Let’s try: sorry, Wren, and thank you!'), WR('Oh! You’re welcome, commander.', 'happy')]),
          ],
          parentNote: 'Chose kind words, sorry and thank you, for a helper who felt cross.',
        },
      ],
    ),
    sc(
      's20-scout',
      [
        PX('Round two: peeking. You can’t win if you can’t see.'),
        N('Sparks lends you a fast little Nubbin called Zip.'),
        N('Zip wiggles in your mittens. Snow melts off his ears. Drip!'),
        PX('Send Zip round their fort. Count what they’ve got.'),
        GO('Can I go?', 'happy'),
        PX('No, Gordon. You’d get hit.'),
        GO('That’s fair.'),
      ],
      [
        {
          domain: 'science',
          skill: 'snow is frozen water and melts when warm',
          standard: '2-ESS2-3',
          kind: 'ask',
          after: 2,
          prompt: [PX('Why does the snow melt on your mitten?', 'think')],
          options: [
            opt('My hand is warm', [PX('Yes! Snow is frozen water. Warm it up, and it turns back into water.', 'happy')], true),
            opt('Zip is magic', [PX('Zip is fast, not magic! Your warm hand melts the snow back into water.')]),
          ],
          parentNote: 'Explained that snow is frozen water that melts when it gets warm.',
        },
      ],
    ),
    sc(
      's20-intel',
      [
        N('Zip runs back. He has snow on his eyebrows.'),
        N('He runs round you nine times. That means: news!'),
        WR('Nine! Same as me. Nobody counts Zip’s.', 'think'),
        N('Their wall is big. But behind it, hardly anyone.'),
        N('Five children were behind their wall. Then three went home!'),
        N('One lost a mitten, one lost a boot, and one wanted his tea.'),
        TI('We’re FINE! We have LOADS of people!', 'angry'),
        TI('Some are IN the wall. They’re bricks!', 'happy'),
        PX('Rule: children are not bricks.'),
        PX('…Mostly not.', 'think'),
      ],
      [
        {
          domain: 'maths',
          skill: 'take away within 5',
          standard: 'K.OA.A.2',
          kind: 'ask',
          after: 5,
          prompt: [PX('Five children were behind their wall. Three went home. How many are left?')],
          options: [
            opt('2', [PX('Two! Five take away three leaves two.', 'happy'), N('(Show five fingers. Fold three down. Two left!)')], true),
            opt('3', [PX('Three went home. Let’s use fingers: show five, fold three down… two left!')]),
            opt('5', [PX('Some went home, so there are fewer now. Five take away three leaves two.')]),
          ],
          parentNote: 'Took three away from five, using fingers, to find two.',
        },
      ],
      {
        choices: [
          {
            id: 'press',
            label: 'Charge now, while there are only a few. It’s a snowball game!',
            set: { 's20-round2': 'pressed' },
            then: [
              WR('CHARGE! Yes, commander!', 'happy'),
              N('Your fort runs across the snow. Whoosh!'),
              TI('That’s not FAIR!', 'angry'),
              TI('…That’s just what I would have done.', 'think'),
              PX('Round two to your fort.'),
            ],
          },
          {
            id: 'wait',
            label: 'Wait till their three come back. Beating half a fort isn’t winning.',
            set: { 's20-round2': 'waited' },
            then: [
              N('Zip takes them a snowball with a smiley face. It means: we’ll wait.'),
              N('Soon a mitten, a boot and a full tummy come back.'),
              TI('You waited for us? That’s nice. Or sneaky.', 'think'),
              PX('Round two: a draw. Being fair gets a point. New rule!'),
            ],
          },
        ],
      },
    ),
    sc(
      's20-counters',
      [
        PX('Round three. The last one.'),
        PX('Look at what they send. Send what beats it.'),
        N('Over the ditch, big children roll big snowballs. Sturdy ones!'),
        TI('GIVE UP OR GET ROLLED!', 'angry'),
        N('Your fort shouts back: “FOR DEREK!” “I’M BRAVE, NOT COLD!”'),
        N('Above the hill, the sky goes dark grey, like a pigeon.'),
        N('Nobody looks at it. Only Pixel.'),
        PX('Hm.', 'think'),
        GO('Is that sky going to hit me?', 'think'),
        PX('This time, Gordon, it’s going to hit everybody.', 'think'),
      ],
      [
        {
          domain: 'science',
          skill: 'dark clouds can mean a storm',
          standard: 'K-ESS2-1',
          kind: 'notice',
          after: 9,
          lines: [
            PX('Dark grey clouds can mean a storm is coming.', 'think'),
            PX('When the sky changes, it’s good to look up and notice.'),
          ],
          parentNote: 'Learned that dark grey clouds can be a sign of a storm.',
        },
      ],
    ),
    sc(
      's20-blizzard',
      [
        N('You’re nearly at their flag. Then the snow goes sideways!'),
        N('White everywhere. You can’t see their fort. You can’t see yours.'),
        PX('STOP! Everybody stop! This is a real blizzard!', 'shock'),
        N('Somebody small is crying. You can’t tell who.'),
        TI('Our wall fell in! I can’t find everyone!', 'shock'),
        N('Your wall still stands. Short, fat and lumpy.'),
        N('But it’s too small for everybody.'),
      ],
      [
        {
          domain: 'health',
          skill: 'keeping safe in a storm',
          standard: 'ELOF: Perceptual, Motor, and Physical Development',
          kind: 'do',
          after: 2,
          check: 'edu:hold:hands:together',
          lines: [
            PX('In a big storm: stop, stay together, and find a grown-up.', 'think'),
            PX('Today, the grown-up is me. Hold hands!'),
            N('(Hold hands with your grown-up. Stay together!)'),
          ],
          parentNote: 'Learned what to do in a storm: stop, stay together and find a grown-up.',
        },
      ],
    ),
    sc(
      's20-merge',
      [
        N('Through the snow you can see children from both forts.'),
        N('They stand about, like dropped gloves.'),
        PX('Referee’s rule…'),
        PX('I don’t have one. You’ve got a wall. They’ve got snow.', 'think'),
        TI('Is this a trick?', 'think'),
        Y('No. It’s a plan. One fort, for everyone.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'working together',
          standard: 'CASEL: Relationship skills',
          kind: 'notice',
          after: 5,
          lines: [
            N('Working together, everyone can build something big.'),
            N('(Ask: what do you like to build with a friend? Wait for an answer.)'),
          ],
          parentNote: 'Saw two teams join up to build one shelter, and talked about building things with friends.',
        },
      ],
      {
        choices: [
          {
            id: 'gate',
            label: 'Kick open your wall and shout them all in.',
            set: { 's20-merge': 'gate' },
            then: [N('You kick a gap. “IN! EVERYONE IN!”'), N('Your fort pulls the others in, by their scarves.')],
          },
          {
            id: 'carry',
            label: 'Carry your wall to them, snowball by snowball.',
            set: { 's20-merge': 'carried' },
            then: [N('Your team is good at moving snow fast. You taught them!'), N('That’s what it was for, all along.')],
          },
          {
            id: 'middle',
            label: 'Meet in the middle. Both walls, one shelter.',
            set: { 's20-merge': 'middle' },
            then: [N('Both forts bring snow. Both bring sticks.'), N('Their pointy sticks are the roof. Derek the snowman is the door.')],
          },
        ],
      },
    ),
    sc(
      's20-count',
      [
        PX('Head count!'),
        PX('…Everyone. Even Gordon.', 'soft'),
        N('The small one who cried was Wren. She lost a mitten.'),
        N('Pixel finds it. It was on Wren’s head!'),
        GO('I got hit by a whole sky!', 'happy'),
        N('Inside it’s blue and snug. It smells of wet wool.'),
        TI('That bit of the roof is mine.'),
        WR('Commander? Which fort won?'),
        N('The storm blows for hours. Pixel sings a song with forty-one verses.'),
        N('Then the wind stops. Someone pokes a hole, and it’s night!'),
        N('A spoon pokes through the hole. Then a face, upside down!'),
        N('It’s Granny Brock. She lives by the Common. She brings soup!'),
        GB('Soup. Somebody rang my bell this morning.'),
        GO('That was me!', 'happy'),
        GB('I know. Eat.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 20',
          standard: 'K.CC.B.5',
          kind: 'do',
          after: 0,
          check: 'edu:count:children:20',
          lines: [
            N('(Count everyone in with Pixel: one, two, three… all the way to twenty!)'),
            PX('Twenty. Everyone’s inside.', 'happy'),
          ],
          parentNote: 'Counted to twenty to check every child was safe inside.',
        },
      ],
    ),
    sc(
      's20-complete',
      [
        N('The sky is clear and black. So many stars!'),
        N('Both forts lie in one fort, looking up.'),
        WR('That one’s a mitten. That one’s Gordon. That one’s Derek!', 'happy'),
        PX('Final rule: both forts win. I wrote it in pen.'),
        TI('So what was it all for? The snow and the peeking?', 'think'),
        Y('So we knew how to build fast. When the storm came, we did!'),
        TI('…That’s a really good answer.'),
        N('Up at the cottage, someone in a blanket waves from the window.'),
        N('Everybody waves back.'),
        PX('Prizes! A commander’s hat. It’s a tea cosy.', 'happy'),
      ],
      [
        {
          domain: 'science',
          skill: 'stars are there in the day too',
          standard: '1-ESS1-1',
          kind: 'notice',
          after: 1,
          lines: [
            PX('Stars are in the sky in the daytime too.', 'think'),
            PX('The sun is so bright, we just can’t see them.'),
            N('(Look for stars tonight, with your grown-up!)'),
          ],
          parentNote: 'Learned that stars are always in the sky, but we only see them when the sun has gone.',
        },
      ],
    ),
  ],
  'S20 sprout. COUSIN VARIANT: every tilly line here is written to work for either cousin (no Tax Toad and no ' +
    'whistle), so if s14Done is false, play the same lines with speaker bodge, with one narration replacement: ' +
    'sprout:s20-declaration#2 → (narrator) “Sparks’s other cousin, Bodge, has come for the holidays.” (#3, “And ' +
    'there is snow!”, stays). No other narration names the cousin. ' +
    'The s20-complete window glimpse is Hazel, never named. SUN AND MOON: s20-declaration names no flags, so it fits ' +
    'either variant. All choices kept, including “press” (it is a friendly snowball game).',
);

// ================================================================== S21 CL-4NK
const S21: EduQuest = quest(
  's21',
  'CL-4NK',
  {
    's21-step1': {
      goal: 'Show Clank round the Grove.',
      hint: 'Go round things, not over them. He has only one wheel.',
    },
    's21-step2': {
      goal: 'Tidy up after Clank’s helping.',
      hint: 'Dry the cat. Prop up the tree. Then try to catch Clank!',
    },
    's21-step3': {
      goal: 'Find Clank.',
      hint: 'Follow his wheel-track through the herbs.',
    },
    's21-step4': {
      goal: 'Help Byte build a ramp for the step.',
      hint: 'Byte measures. You saw. Measure twice!',
    },
    's21-step5': {
      goal: 'Stay with Clank until the sun goes down.',
      hint: 'Feed the Nubbins first. Then sit by the step and just be there.',
    },
  },
  [
    sc(
      's21-unveil',
      [
        N('Squeak, squeak! Pixel pushes a wheelbarrow up the lane.'),
        PX('I had spare lantern parts. So I made a garden helper!'),
        N('A lantern head. A glass tummy. A brass nose. One wheel.'),
        N('Pixel winds the nose. Wheee! He whistles like a happy kettle.'),
        CK('HELLO! I am CL-4NK! Call me Clank!', 'happy'),
        CK('You are my BEST FRIEND!', 'happy'),
        Y('We’ve only just—'),
        N('He rolls forward. Off the step. Bump! Into the herbs.'),
        CK('Announcement! I have found the step!', 'happy'),
        PX('That’s one bump.', 'think'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'first sounds: c',
          standard: 'RF.K.2',
          kind: 'ask',
          after: 4,
          prompt: [CK('Clank! C-c-clank! What else starts with that sound?', 'happy')],
          options: [
            opt('Cat', [CK('C-c-cat! Clank and cat start the same!', 'happy')], true),
            opt('Dog', [CK('D-d-dog starts with d. C-c-cat starts like Clank!')]),
            opt('Sun', [CK('S-s-sun starts with s. C-c-cat starts like Clank!')]),
          ],
          parentNote: 'Heard the first sound of “Clank” and matched it with “cat”.',
        },
      ],
    ),
    sc(
      's21-tour',
      [
        CK('Announcement: this is a POND! This is a GATE! Best friend!', 'happy'),
        N('Soon every Nubbin follows him in a line. Like ducklings!'),
        N('One climbs on his head. Then three more.'),
        N('He turns his light down low for them. They purr.'),
        CK('They like me. Announcement: they LIKE me.', 'shock'),
        CK('I didn’t know that could happen.', 'soft'),
      ],
      [
        {
          domain: 'maths',
          skill: 'add 3 more',
          standard: 'K.OA.A.1',
          kind: 'ask',
          after: 2,
          prompt: [N('One Nubbin, then three more. How many on Clank?')],
          options: [
            opt('4', [CK('FOUR! One and three more make four!', 'happy')], true),
            opt('3', [N('Count them: one… then two, three, four. Four!')]),
            opt('2', [N('More than that! One and three more make four.')]),
          ],
          parentNote: 'Added one and three more to make four.',
        },
      ],
    ),
    sc(
      's21-help',
      [
        N('At dawn, a whistle wakes you. WHEEEE!'),
        CK('GOOD MORNING! I have done SO MUCH HELPING!', 'happy'),
        N('Fern holds her cat, Mustard. Drip, drip, drip.'),
        N('Mustard says MROWW. That means very, very cross.'),
        FE('He watered my cat. To be fair, Mustard was in the beans.', 'think'),
        CK('Cats are plants that run! I think!'),
        N('Snip, snip, snip! Fern’s best apple tree is now a duck.'),
        FE('It’s a very good duck. It was a better tree.', 'think'),
        CK('Announcement: it is a DUCK!', 'happy'),
        CK('And I rescued a little old one! He was stuck up the hill!', 'happy'),
        N('Round the pond zooms Clank, holding the little grey one like a pie.'),
      ],
      [
        {
          domain: 'science',
          skill: 'what plants and animals need',
          standard: 'K-LS1-1',
          kind: 'ask',
          after: 5,
          prompt: [N('Do cats need watering, like plants?')],
          options: [
            opt('No! Cats drink from a bowl', [FE('Right. Plants drink through their roots. Cats lap water from a bowl.', 'happy')], true),
            opt('Yes', [FE('Ha! No. Plants need watering. Cats drink from a bowl. And they hate baths.', 'happy')]),
          ],
          parentNote: 'Sorted out what plants need (watering) from what cats need (a drink from a bowl).',
        },
      ],
    ),
    sc(
      's21-moss',
      [
        N('Clank reaches the cottage. And the step. Bump!'),
        N('The little grey one flies out of his hands. He lands on his feet.'),
        CK('Announcement… I found the step again.', 'sad'),
        N('The little grey one gives you a long, long look.'),
        N('Then the little grey one walks back up the hill. Clank watches him go.'),
        PX('That’s two bumps.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'asking before we pick someone up',
          standard: 'CASEL: Social awareness',
          kind: 'ask',
          after: 4,
          prompt: [N('Clank picked up the little grey one without asking. He didn’t like it.'), N('What should we do before we pick someone up?')],
          options: [
            opt('Ask first', [N('Yes! Always ask first. Then they can say yes or no.')], true),
            opt('Just grab them', [N('He didn’t like being grabbed. We always ask first, and listen.')]),
          ],
          parentNote: 'Learned to ask before picking up a pet or a person, and to listen to the answer.',
        },
      ],
    ),
    sc(
      's21-log',
      [
        N('Byte, Pixel’s husband, comes with a clipboard and a pencil behind each ear.'),
        BY('One wet cat. One duck-shaped tree. One old Nubbin, zoomed.'),
        BY('He means to help. But next time, someone could get hurt.', 'think'),
        BY('Pixel should switch Clank off. Tonight.'),
        PX('You said that about my clocks.', 'think'),
        BY('Your clocks shout at me.'),
        N('Behind you, a little whistle starts, then stops.'),
        N('Clank heard. His light goes very dim.'),
        N('He rolls backwards, off the step. Bump. He doesn’t say a thing.'),
        PX('…That’s three bumps.', 'sad'),
        N('Then he’s gone. A wheel-track leads to the lantern shed.'),
        BY('I didn’t know he could hear. I didn’t know he could… mind.', 'sad'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 3',
          standard: 'K.CC.B.5',
          kind: 'do',
          after: 9,
          check: 'edu:count:falls:3',
          lines: [
            N('(Count Clank’s bumps with Pixel, on your fingers: one, two, three.)'),
            N('Three bumps down the step. Poor Clank.'),
          ],
          parentNote: 'Counted Clank’s three bumps on their fingers, keeping track like Pixel.',
        },
      ],
      {
        choices: [
          {
            id: 'fair',
            label: 'Tell Byte he had a point. Clank does need to learn.',
            set: { 's21-byte': 'fair' },
            then: [
              BY('I did have a point. It feels worse when it hurts someone.', 'sad'),
              PX('He needs a bit of slow. I can help with that.', 'think'),
            ],
          },
          {
            id: 'unfair',
            label: 'Tell Byte that wasn’t fair. Clank is only days old.',
            set: { 's21-byte': 'unfair' },
            then: [BY('Days old. I forgot that.', 'sad'), BY('I was days old once. I’m told I bit a goose.')],
          },
        ],
      },
    ),
    sc(
      's21-shed',
      [
        N('The shed smells of old string. Clank is on a high shelf.'),
        N('He’s pretending to be a lantern. But lanterns don’t shake.'),
        CK('Announcement. I’m a lantern now. Nobody switches off a lantern.', 'sad'),
        CK('I watered a cat. I made a duck tree. I zoomed the old one.'),
        CK('Am I a friend? Or just a thing that does jobs?', 'think'),
        CK('If I stop helping, will you still…', 'sad'),
        N('Click. Click. He looks for a word. He can’t find it.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'friends like you for who you are',
          standard: 'CASEL: Relationship skills',
          kind: 'notice',
          after: 6,
          lines: [
            N('Friends like you for who you are. Not for the jobs you do.'),
            N('(Ask: what do you like about a friend of yours? Wait for an answer.)'),
          ],
          parentNote: 'Heard that friends like us for who we are, and named something they like about a friend.',
        },
      ],
      {
        choices: [
          {
            id: 'sit',
            label: 'Sit down below the shelf, and wait.',
            set: { 's21-lesson': 'sit' },
            then: [
              N('You sit on the floor. It’s not comfy. You stay.'),
              CK('Is it a job?'),
              Y('No. I’m just here.'),
              N('After a long time, Clank comes down. He parks beside you.'),
            ],
          },
          {
            id: 'step',
            label: 'Teach him: it’s all right to ask for help.',
            set: { 's21-lesson': 'step' },
            then: [
              Y('Do you know why you fall down the step?'),
              CK('Because I’m brave?', 'happy'),
              Y('Because you never ask anyone to help.'),
              Y('Everybody needs a hand sometimes. Even me.'),
              N('Clank thinks so hard, his whistle goes off, very softly.'),
            ],
          },
        ],
      },
    ),
    sc(
      's21-ramp',
      [
        N('Next day, Byte comes with a plank and a saw.'),
        BY('I measured the step. It’s too tall for one wheel.'),
        N('Byte measures again. And again. Eleven times!'),
        BY('Still too tall. I checked.'),
        BY('So it isn’t Clank. It’s the step.', 'think'),
        BY('All the Nubbins follow him everywhere. Eight out of eight. That matters.', 'soft'),
        CK('Byte! Does that mean you’re my best—', 'happy'),
        BY('Maybe.', 'happy'),
      ],
      [
        {
          domain: 'science',
          skill: 'solving a problem: a ramp helps wheels',
          standard: 'K-2-ETS1-1',
          kind: 'ask',
          after: 4,
          prompt: [BY('How can a wheel get down a step safely?', 'think')],
          options: [
            opt('A ramp: a gentle slope', [BY('Yes. A ramp. The wheel rolls down slowly. No bump.', 'happy')], true),
            opt('Jump off', [BY('Bump! That’s what keeps happening. A gentle slope is better: a ramp.')]),
            opt('Fly', [BY('He hasn’t got wings. A ramp is a gentle slope he can roll down.')]),
          ],
          parentNote: 'Worked out that a ramp solves the problem of a wheel and a step.',
        },
      ],
    ),
    sc(
      's21-down',
      [
        N('The ramp is done. Small, smooth and safe.'),
        CK('Announcement. I am going down.', 'soft'),
        CK('Would somebody come with me? The first time?'),
        N('Byte holds one side. You hold the other.'),
        N('Down he goes. Slow as a snail. He reaches the bottom!'),
        CK('I DID THE STEP! And I didn’t fall!', 'happy'),
        N('He does a dance: forward, back, and a spin!'),
        N('You copy it. Byte copies it too.'),
        N('Later, Byte says he didn’t. His shoelace has come undone.'),
        PX('He did. He danced like that at our wedding.', 'happy'),
        PX('His shoelace came undone that day too.'),
        PX('That’s… no bumps! I’ll take no bumps.', 'happy'),
      ],
      [
        {
          domain: 'health',
          skill: 'moving our bodies: forward, back, spin',
          standard: 'ELOF: Perceptual, Motor, and Physical Development',
          kind: 'do',
          after: 6,
          check: 'edu:dance:clank:forward-back-spin',
          lines: [
            N('(Do the Clank dance! Step forward. Step back. Spin round!)'),
            CK('Announcement: you are a GREAT dancer!', 'happy'),
          ],
          parentNote: 'Did the Clank dance: a step forward, a step back and a spin.',
        },
      ],
    ),
    sc(
      's21-evening',
      [
        N('The afternoon turns gold. Clank sits by the ramp.'),
        N('He doesn’t water anything. It’s very hard for him.'),
        CK('Announcement: I am not helping. I am just… here.', 'think'),
        CK('Is just here allowed?'),
        Y('Just here is allowed.'),
        CK('Announcement: just here is allowed.', 'soft'),
      ],
      [
        {
          domain: 'science',
          skill: 'the sun is low in the evening',
          standard: '1-ESS1-1',
          kind: 'notice',
          after: 0,
          lines: [N('In the evening, the sun sits low in the sky.'), N('The light goes gold, and shadows grow long.')],
          parentNote: 'Noticed that the evening sun is low, with golden light and long shadows.',
        },
      ],
    ),
    sc(
      's21-complete',
      [
        N('At dusk the Nubbins come in from the long grass.'),
        N('One by one, they climb onto Clank. He’s warm, like a kettle.'),
        N('One sits on his wheel. One curls up inside his glass tummy.'),
        N('One Nubbin licks Clank’s nose. Not supper!'),
        CK('Announcement.', 'soft'),
        CK('I am being very still.', 'soft'),
        N('He is. For a whole hour. You sit beside him.'),
        PX('Keep him. He’s yours. He’ll water things, slowly.'),
        N('Next morning he waters the beans. One bean a minute.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 8',
          standard: 'K.CC.B.5',
          kind: 'do',
          after: 2,
          check: 'edu:count:nubbins:8',
          lines: [
            N('(Count the Nubbins on Clank: one, two, three, four, five, six, seven, eight!)'),
            CK('Eight friends. Announcement: that is LOTS.', 'soft'),
          ],
          parentNote: 'Counted eight Nubbins snuggled on Clank.',
        },
      ],
    ),
  ],
  'S21 sprout. Moss never speaks in S21 and is never named (it can run before chapter 4): he is “the little grey one”. Pixel’s running count of Clank’s falls ' +
    '(“That’s one bump… two bumps… three bumps… no bumps!”) is the maths thread. Byte is named as Pixel’s ' +
    'husband in s21-log (canon 38), with the clocks and shoelace bickering. The heart lessons are asking before picking someone up ' +
    '(s21-moss) and friends liking you for who you are (s21-shed). All choices kept.',
);

// ================================================================== variants (SIDE_STORIES_NEW_3_VARIANTS, not end-epi-*)
const S13_VARIANTS: EduScene[] = [
  // In S9, after s9-trowel, if millLetter = kept.
  sc(
    's13-letter-given',
    [
      N('You fetch the letter from its tin box. Down the lane you go.'),
      N('Corvin is by the stile. He keeps rubbing his cold hands.'),
      C('Hazel’s grandchild. Twice in one evening.', 'think'),
      N('You hold out the letter. He sees the writing and stops.'),
      C('That’s my father’s writing.', 'shock'),
      N('He reads it slowly. Then again, even slower.'),
      C('“Nobody will count.”', 'soft'),
      N('He puts it in his pocket, right over his heart.'),
      C('Thank you. I don’t know what else. Thank you.', 'soft'),
      N('He goes on down the lane. You go back up to Hazel.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'feeling two feelings at once',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 7,
        prompt: [N('Corvin’s dad said “I love you” at last. How does Corvin feel?')],
        options: [
          opt('Sad and glad, both at once', [
            N('Yes. He’s sad his dad waited so long. He’s glad he said it.'),
            N('We can feel two feelings at once.'),
          ], true),
          opt('Only cross', [N('Maybe a little. But look: his hand is on his pocket.'), N('He’s sad and glad, both at once.')]),
        ],
        parentNote: 'Saw that someone can feel sad and glad at the same time.',
      },
    ],
  ),
  // Replaces s13-letter if Moss has left the world.
  sc('s13-letter-nomoss', S13_LETTER, [S13_LETTER_LESSON], { choices: [S13_KEEP, S13_BURN, S13_GRAVE_NOMOSS] }),
  // Replace s13-settled-kept for the other answers.
  sc(
    's13-settled-burned',
    [
      N('The mill’s old stove still works. Tobin lights it.'),
      N('You stand well back and watch. Fire is for grown-ups.'),
      N('The letter catches. Then it’s gone, quick as a blink.'),
      T('There. The last one.', 'soft'),
      N('Tobin sits on the step with you till the stove is cold.'),
      N('Nobody counts how long.'),
    ],
    [
      {
        domain: 'health',
        skill: 'staying safe near fire',
        standard: 'ELOF: Perceptual, Motor, and Physical Development',
        kind: 'notice',
        after: 1,
        lines: [
          T('Stoves and fires are hot. Only grown-ups light them.', 'think'),
          T('Children stay back, a big step away. That keeps us safe.'),
        ],
        parentNote: 'Heard that only grown-ups light fires and that children stay well back from stoves.',
      },
    ],
  ),
  sc(
    's13-settled-grave',
    [
      ...S13_GRAVE_START,
      N('Moss sits on the stone and shuts his eyes.'),
      N('You read the letter out loud, slowly.'),
      M('He was never still enough to be read to. This is for remembering him.', 'soft'),
      ...S13_GRAVE_END,
    ],
    [S13_GRAVE_LESSON],
  ),
  sc(
    's13-settled-grave-nomoss',
    [
      ...S13_GRAVE_START,
      N('You read the letter out loud, slowly, the way Moss liked.'),
      T('He was never still enough to be read to. This is for remembering him.', 'soft'),
      ...S13_GRAVE_END,
    ],
    [S13_GRAVE_LESSON],
  ),
];

const S19_VARIANTS: EduScene[] = [
  // S19 with Sable (Moss has left the world). The sim keeps applying s19-warmth-sable’s set (s19-with = sable).
  sc(
    's19-warmth-sable',
    [
      N('Two days after the Long Night. Snow everywhere. Very quiet.'),
      N('Sable sits at the top of the garden. She hasn’t eaten her breakfast.'),
      N('She stares up at the high snowy hill.'),
      N('Moss faded at the Long Night. That means he died.'),
      N('His pale light stayed with Sable. It leans up the hill too.'),
      N('Up in the white snow there is a tiny red dot.'),
      N('Sable looks at you. Then the hill. Then you.'),
      Y('All right. We’ll ask Marina.'),
    ],
    [
      {
        domain: 'art',
        skill: 'spotting a colour: red',
        kind: 'do',
        after: 5,
        check: 'edu:find:colour:red',
        lines: [N('Red on white is easy to spot. Like a berry in the snow.'), N('(Find something red near you. Point to it!)')],
        parentNote: 'Spotted red against white, and found something red nearby.',
      },
    ],
  ),
  sc(
    's19-climb-sable',
    [
      N('First light. Marina ties a rope to you. Sable won’t have a rope.'),
      N('She trots ahead, a grey shape on the white snow.'),
      N('Moss’s pale light floats by her shoulder.'),
      N('Crunch, crunch, crunch. Your boots sink in.'),
      N('Sable is so light, she doesn’t sink at all.'),
      MA('She’s not stopping! Is she always like this?'),
      Y('Only when it matters.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'heavier and lighter',
        standard: 'K.MD.A.2',
        kind: 'ask',
        after: 4,
        prompt: [N('You sink in the snow. Sable doesn’t. Who is heavier?')],
        options: [
          opt('Me!', [MA('Yes! You’re heavier, so you sink. Sable is light.', 'happy')], true),
          opt('Sable', [MA('Look at the footprints. Yours are deep. Hers are tiny. You’re heavier!')]),
        ],
        parentNote: 'Compared weight by looking at deep and shallow footprints in snow.',
      },
      {
        domain: 'literacy',
        skill: 'first sounds: s',
        standard: 'RF.K.2',
        kind: 'ask',
        after: 6,
        prompt: [N('Sable. Snow. S-s-s!'), N('Which one starts with s too?')],
        options: [
          opt('Sun', [N('S-s-sun! Yes!')], true),
          opt('Moon', [N('M-m-moon starts with m. S-s-sun starts with s!')]),
          opt('Tree', [N('T-t-tree starts with t. S-s-sun starts with s!')]),
        ],
        parentNote: 'Heard the “s” sound at the start of Sable and snow, and found another s word.',
      },
    ],
  ),
  sc(
    's19-hollow-sable',
    [
      ...S19_HOLLOW_START,
      N('Sable stops. The fur on her back stands up.'),
      N('Moss’s pale light settles by the red one. Two little lights.'),
      N('You remember what Moss said. Sit still, for a long time.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'reading feelings from an animal’s body',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 4,
        prompt: [N('Sable’s fur stands up. How might she feel?')],
        options: [
          opt('A bit scared', [
            N('Yes. Animals show feelings with their bodies. She’s a bit scared.'),
            N('We can sit close to help her feel safe.'),
          ], true),
          opt('Hungry', [N('Maybe! But look at her fur, standing up. She feels a bit scared.')]),
        ],
        parentNote: 'Read an animal’s body to guess how she felt.',
      },
    ],
  ),
  sc(
    's19-question-sable',
    [
      N('After a long time, the red light grows a tiny bit bigger.'),
      CI('Are they safe?', 'soft'),
      N('Moss would know what to say. You say it for him.'),
      Y('Not just safe. They’re well.'),
      Y('Safe is sitting still. Well is running, and playing, and too many plums.'),
      CI('Well. Well is better. I didn’t know.', 'sad'),
      CI('Do the children still say my name?', 'soft'),
      Y('They skip to it. Badly. But they love it!'),
      N('Then the light sees Sable. Grey from her ears to her tail.'),
      CI('Oh, little one. I held them too tight, long ago. I’m so sorry.', 'sad'),
      N('Sable walks up to the warm stone. She leans on it.'),
      CI('She came to me. Nobody made her. She forgives me.', 'soft'),
      CI('Keeper, do the other grey Nubbins forgive me too?', 'soft'),
    ],
    [
      {
        domain: 'sel',
        skill: 'showing love and forgiveness without words',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 10,
        lines: [
          N('Sable leans on the stone. That is her way of saying “it’s all right”.'),
          N('Leaning close is a way to show love.'),
        ],
        parentNote: 'Saw that we can show forgiveness and love without words, by being close.',
      },
    ],
    { choices: S19_CHOICES_SABLE },
  ),
  sc(
    's19-fade-sable',
    [
      N('You stay. Sable stays by the stone. So does Moss’s light.'),
      N('The red light gets smaller and smaller. Slowly. Gently.'),
      CI('Little one. It isn’t cold, like the grey Nubbins were.', 'soft'),
      N('Sable shuts her eyes.'),
      N('Then the light is gone. Cinder has died.'),
      N('There is only the flat stone, and the wind.'),
      Y('That is fading done right. Gentle. Then you let go.'),
      N('Sable stays curled by the stone a long time. You let her.'),
    ],
    [S19_FADE_LESSON('Sable')],
  ),
];

// S19 with you and Marina only (Moss has left the world, Sable is not bonded).
// The sim keeps applying s19-warmth-alone’s set (s19-with = alone).
const S19_ALONE: EduScene[] = [
  sc(
    's19-warmth-alone',
    [
      N('Two days after the Long Night. Snow everywhere. Very quiet.'),
      N('You look out of the window, with a warm drink.'),
      N('Up on the snowy hill, there’s a tiny red dot!'),
      N('You look away. You look back. It’s still there.'),
      N('Moss would want to see it. But Moss has died.'),
      N('You miss him. You pull on your boots.'),
      Y('Marina knows the way. Let’s ask her!'),
    ],
    [
      {
        domain: 'sel',
        skill: 'missing someone, and what helps',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'ask',
        after: 5,
        prompt: [N('You miss Moss. Missing someone is a sad feeling. What can help?')],
        options: [
          opt('Talking about them', [N('Yes. Talking about someone we miss keeps them close.'), N('(Who do you miss? Wait for an answer.)')], true),
          opt('Never saying their name', [N('Saying their name is all right. Talking about them helps us feel close.')]),
        ],
        parentNote: 'Talked about missing someone who has died, and how talking about them can help.',
      },
    ],
  ),
  sc(
    's19-climb-alone',
    [
      N('First light. Marina ties a rope to you. She checks it twice.'),
      N('Then she checks your socks. Two pairs!'),
      N('Crunch, crunch, crunch. The snow sounds like biting toast.'),
      MA('Lovely wind! It makes your cheeks tingle!', 'happy'),
      MA('What are we looking for?'),
      Y('Something warm.'),
      MA('Up here? Hazel did odd things too. I stopped asking!', 'happy'),
    ],
    [
      {
        domain: 'maths',
        skill: 'count to 4: two pairs make four',
        standard: 'K.CC.B.5',
        kind: 'do',
        after: 1,
        check: 'edu:count:socks:4',
        lines: [
          N('A pair is two. Two pairs of socks! How many socks?'),
          N('(Count them on your fingers together: one, two, three, four.)'),
          MA('Four socks. Two on each foot. Toasty!', 'happy'),
        ],
        parentNote: 'Counted two pairs of socks and found there were four.',
      },
    ],
  ),
  sc(
    's19-hollow-alone',
    [
      ...S19_HOLLOW_START,
      N('You go in on your own. You sit down near the light.'),
      N('You remember what Moss said. Sit still, for a long time.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'knowing who can help when you feel a bit scared',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'ask',
        after: 4,
        prompt: [N('You’re alone in the hollow. Who is close by to help?')],
        options: [
          opt('Marina', [N('Yes! Marina is just up on the edge. You can shout for her.'), N('It helps to know a grown-up is near.')], true),
          opt('Nobody', [N('Look up! Marina is on the edge, with the rope.'), N('A grown-up is near. You can shout for her.')]),
        ],
        parentNote: 'Remembered that a trusted grown-up was close by and could help.',
      },
    ],
  ),
  sc(
    's19-question-alone',
    [
      N('After a long time, the red light grows a tiny bit bigger.'),
      CI('Are they safe?', 'soft'),
      N('Moss would know what to say. You say it for him.'),
      Y('Not just safe. They’re well.'),
      Y('Safe is sitting still. Well is running, and playing, and too many plums.'),
      CI('Well. Well is better. I didn’t know.', 'sad'),
      CI('Long ago, I held them too tight. I am so sorry.', 'sad'),
      CI('Do the children still skip to my rhyme?', 'soft'),
      Y('Yes. Badly. But they love it!'),
      N('The little light flickers. It might be a laugh.'),
      CI('Keeper, do the grey Nubbins forgive me?', 'soft'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'hear words that rhyme',
        standard: 'RF.K.2',
        kind: 'ask',
        after: 7,
        prompt: [
          N('Children skip to a rhyme about her:'),
          Y('Cinder held them close and tight, kept them warm one winter night.'),
          N('Which word rhymes with “tight”?'),
        ],
        options: [
          opt('Night', [CI('Tight, night. They still say my name.', 'soft')], true),
          opt('Warm', [N('Listen: tight… night. Night rhymes with tight.'), CI('They still say my name.', 'soft')]),
        ],
        parentNote: 'Heard the valley’s skipping rhyme and found the rhyming pair “tight” and “night”.',
      },
    ],
    { choices: S19_CHOICES_ALONE },
  ),
  sc(
    's19-fade-alone',
    [
      N('You stay. You keep your hands in your lap.'),
      N('The red light gets smaller and smaller. Slowly. Gently.'),
      CI('Keeper. It isn’t cold, like the grey Nubbins were.', 'soft'),
      N('Then the light is gone. Cinder has died.'),
      N('There is only the flat stone, and the wind.'),
      N('You say Moss’s words, the way he would.'),
      Y('That is fading done right. Gentle. Then you let go.'),
      N('You sit there a long time. Marina lets you.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'feeling sad when someone dies, and what helps',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'notice',
        after: 7,
        lines: [
          N('You might feel sad. That’s all right.'),
          N('Marina is close by. Being close helps. So does remembering.'),
          N('(Give your grown-up a hug, if you like.)'),
        ],
        parentNote: 'Heard plainly that Cinder died, and that feeling sad is all right; closeness and remembering help.',
      },
    ],
  ),
];

// ================================================================== exports
export const EDU_SIDE_NEW_B_SPROUT: EduQuest[] = [S13, S19, S22, S14, S20, S21];

/** Sprout versions of every scene in SIDE_STORIES_NEW_3_VARIANTS except the end-epi-* epilogues. */
export const EDU_SIDE_NEW_B_SPROUT_VARIANTS: EduScene[] = [...S13_VARIANTS, ...S19_VARIANTS, ...S19_ALONE];

export const CHECKS: string[] = [
  // S13
  'edu:cover:eyes:light-dark',
  'edu:count:rats:5',
  'edu:draw:shape:circle',
  'edu:draw:line:straight-leaning',
  // S19
  'edu:point:clothes:warm',
  'edu:wave:hand:left-right',
  'edu:sit:still:quiet',
  'edu:hold:hand:stay',
  'edu:count:nubbins:5',
  'edu:find:colour:red',
  'edu:count:socks:4',
  // S22
  'edu:clap:beat:stones-song',
  'edu:breathe:slow:flower-candle',
  'edu:count:stones:3',
  'edu:point:map:valley',
  // S14
  'edu:count:dice-sides:6',
  'edu:sing:supper-call:low-high',
  'edu:count:buttons:4',
  // S20
  'edu:hold:hands:together',
  'edu:count:children:20',
  // S21
  'edu:count:falls:3',
  'edu:dance:clank:forward-back-spin',
  'edu:count:nubbins:8',
];
