/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): S24 The Adventure Book.
 *
 * Source: side-stories-s24.ts (SIDE_STORY_S24 and SIDE_STORY_S24_VARIANTS). One EduScene per
 * original scene, id `sprout:<original id>`: every step scene, every done scene, the complete
 * scene and all 23 variants. See EDU-STYLE.md.
 *
 * - Choice ids and `set` flags are copied from the originals so every flag still works. Every
 *   choice in S24 is a kind one, so this band keeps them all and needs no `defaultChoice`.
 * - Learning angles from the outline: old people were young once, with lists of their own;
 *   keeping a memory book (a diary) for someone; why we don’t cage wild birds, and how nests
 *   keep chicks warm; finding east, where the sun comes up.
 * - Hard things follow EDU-STYLE.md. Gran Hazel and Moss died, said plainly once, with the
 *   flowers and the remembering straight after. Nova cries for a long time, and that is allowed.
 *   Tilly is out of sight for one short beat, is heard whistling the whole time, and is found
 *   safe. The net is a fright, never a fall; nobody is near a drop in this band.
 * - Neither quoted line from the film appears. Tilly’s shout and Hazel’s last line use the
 *   quest’s own childLines wording.
 * - Nubbins and the tall bird never speak. Moss (an Eternal) speaks a little; Sable is narrated.
 * - Tilly’s note from Gran Hazel stays folded in her welly, unopened.
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
const NO = say('nova');
const SP = say('sparks');
const M = say('moss');
const C = say('corvin');
const H = say('hazel');
const TI = say('tilly');
const AU = say('augusta');
const DE = say('delve');

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

// ================================================================== shared pieces
// ---------------------------------------------------------------- step 1: tea on the hill
const TEA_OPEN: Line[] = [
  N('Look! The flowers on the hill are open, all at once.'),
  N('This one is Gran Hazel’s flower. It’s a bit untidy, like her.'),
  N('Gran Hazel died. Her flower grows here, so we remember her.'),
  N('Here comes Nova, with a great big bag. She lives in the valley now.'),
  N('But she still walks past everything, very fast.'),
  NO('Hello. Today I thought I’d stop, and sit with her.', 'soft'),
];
const TEA_SIT = N('Nova sits down by the flower. Her big bag stays on her back.');
const TEA_RUN = N('Your Nubbin runs to Nova. Then back to you. Then to Nova again!');
const TEA_CLOSE: Line[] = [
  NO('Is there tea? I always say no. Today I’ll say yes, please!', 'happy'),
];
const TEA_SPRING = ask(
  0,
  'science',
  'flowers open in spring',
  'ELOF: Scientific Reasoning',
  [N('The flowers have opened. What time of year is it?')],
  [
    opt('Spring', [N('Yes! Spring. The days get warmer, and the flowers open.')], true),
    opt('Winter', [
      N('Winter is cold, with hardly any flowers.'),
      N('Warm days and new flowers mean spring!'),
    ]),
  ],
  'Your child linked opening flowers to spring.',
);

// ---------------------------------------------------------------- step 3: the lantern
const LANTERN_ASK: Line[] = [
  NO('Can we take Gran Hazel’s lantern? And light it up high, at sunrise?', 'think'),
  NO('It’s for remembering her. Like saying hello to her.', 'soft'),
];
const LANTERN_SUNRISE = ask(
  0,
  'science',
  'the sun comes up in the morning',
  'ELOF: Scientific Reasoning',
  [N('Sunrise is when the sun comes up. When is that?')],
  [
    opt('In the morning', [N('Yes! The sun comes up every morning, and the day begins.')], true),
    opt('At bedtime', [N('At bedtime the sun goes down. It comes up in the morning!')]),
  ],
  'Your child learned that the sun comes up in the morning.',
);

// ---------------------------------------------------------------- step 4: the stowaway
const STOW_OPEN: Line[] = [
  N('The cart goes up the hill road. Clip-clop, creak.'),
  N('Nova puts her big bag on. The cart goes, “Groan!”'),
  N('Under the cover, something says, “Ow!” Then, “Nobody heard that.”'),
];
const STOW_LAW: Line[] = [
  TI('I’m a stowaway. You can’t send a stowaway home. That’s the rule.', 'angry'),
  NO('A stowaway is someone who hides, to come on a trip.', 'think'),
];

// ---------------------------------------------------------------- step 6: the tall bird
const BIRD_OPEN: Line[] = [
  N('Up high, you walk into a cloud. It is misty and cool.'),
  N('You put Fern’s five buns on a rock. Your Nubbin counts them.'),
  N('One, two, three, four… four? It counts again. Still four!'),
  N('A huge bird stands in the mist, with a bun in its beak.'),
  N('It is taller than Nova. It has stripes and long, long legs.'),
  TI('Oh! He’s beautiful! He’s called Sir Reginald.', 'shock'),
  N('Gulp! The bun goes all the way down.'),
  N('Your Nubbin glares at the bird. The bird looks at the sky.'),
  N('The bird steps forward, then back. It is shy.'),
  NO('Don’t grab. Be gentle and slow.', 'soft'),
];
const BIRD_FED: Choice = {
  id: 'fed',
  label: 'Hold out a bun on your flat hand.',
  set: { 's24-bird': 'fed' },
  then: [
    N('You hold out a bun on your flat hand. Very, very still.'),
    N('The bird takes it, so gently. Peck!'),
    N('Then it follows you a few steps. Is there another one?'),
  ],
};
const BIRD_WAITED: Choice = {
  id: 'waited',
  label: 'Sit down and wait for it to come to you.',
  set: { 's24-bird': 'waited' },
  then: [
    N('You sit down on the path. Your Nubbin sits too. Very still.'),
    N('At last the bird comes close. It looks at your Nubbin.'),
    N('It tidies the fur on your Nubbin’s head with its beak!'),
  ],
};
type CollectorMode = 'sold' | 'kept';
const BIRD_NOTICED: Record<CollectorMode, Line[]> = {
  sold: [
    TI('It doesn’t come to you. That’s odd!', 'think'),
    N('Your Nubbins at home are grey and quiet now. The bird can tell.'),
    N('You feel sorry about that. You don’t say so.'),
  ],
  kept: [
    TI('Why are your hands cold? It’s nearly summer.', 'think'),
    N('Your hands are cold, since you kept the cold stone.'),
    N('You hide them in your pockets.'),
  ],
};
const birdFedCollector = (mode: CollectorMode): Choice => ({
  id: 'fed',
  label: 'Hold out a bun on your flat hand.',
  set: { 's24-bird': 'fed' },
  then: [
    N('You hold out a bun. The bird looks at your hand, and steps back.'),
    N('Nova holds out a bun too. The bird goes to Nova instead.'),
    ...BIRD_NOTICED[mode],
  ],
});
const birdWaitedCollector = (mode: CollectorMode): Choice => ({
  id: 'waited',
  label: 'Sit down and wait for it to come to you.',
  set: { 's24-bird': 'waited' },
  then: [
    N('You sit and wait. The bird stays far away.'),
    N('Nova sits down too. After a long time, the bird goes to Nova.'),
    ...BIRD_NOTICED[mode],
  ],
});
const BIRD_LESSONS: Beat[] = [
  ask(
    2,
    'maths',
    'take away 1 from 5',
    'K.OA.A.2',
    [N('Fern packed five buns. Someone took one! How many are left?')],
    [
      opt('Four', [N('Yes! Five take away one is four. (Count four fingers.)')], true),
      opt('Six', [
        N('Six would be one more. Somebody took one away!'),
        N('Hold up five fingers. Fold one down. Four!'),
      ]),
    ],
    'Your child took one away from five with fingers.',
  ),
  notice(
    8,
    'science',
    'shy animals need slow, quiet people',
    'K-ESS3-3',
    [
      N('Shy animals get scared by fast moves and loud noises.'),
      N('Slow and quiet helps them feel safe.'),
    ],
    'Your child heard how to be gentle around a shy wild animal.',
  ),
];
const birdScene = (of: string, mode: CollectorMode | null): EduScene =>
  sc(of, BIRD_OPEN, BIRD_LESSONS, {
    choices: mode ? [birdFedCollector(mode), birdWaitedCollector(mode)] : [BIRD_FED, BIRD_WAITED],
  });

// ---------------------------------------------------------------- step 12: the nest
const NEST_OPEN: Line[] = [
  N('Under a rocky roof there is a big, big nest.'),
  N('In the nest are four fluffy, stripy chicks!'),
  N('Next to the nest sits Tilly. She is safe, and very cross.'),
  N('Her badge sash is round the smallest chick, to keep it warm.'),
  TI('You took AGES! Sir Reginald is a mummy. She can still be Sir.', 'angry'),
  N('The cage is open and empty. Far off, a bird calls: creak-creak!'),
];
const NEST_PAYOFF: Record<'fed' | 'waited' | 'fed-collector' | 'waited-collector', Line[]> = {
  fed: [
    N('You remember the bun on your hand. You make a trail of buns.'),
    N('Peck, peck, peck! The mother bird eats her way home.'),
    N('She stands over her chicks and looks at you. She remembers!'),
  ],
  waited: [
    N('You remember sitting still. You sit by the nest with your Nubbin.'),
    N('You wait. At last the mother bird comes home by herself.'),
    N('She tidies the fur on your Nubbin’s head again.'),
  ],
  'fed-collector': [
    N('The bird won’t come near you. You give Nova the buns.'),
    N('Nova makes the trail. Peck, peck! The mother bird comes home to her.'),
  ],
  'waited-collector': [
    N('The bird won’t come near you. You stand back.'),
    N('Nova sits by the nest and waits. The mother bird comes home to her.'),
  ],
};
const nestScene = (of: string, payoff: keyof typeof NEST_PAYOFF): EduScene => {
  const lines = [
    ...NEST_OPEN,
    ...NEST_PAYOFF[payoff],
    NO('There. She came straight home.', 'soft'),
  ];
  return sc(of, lines, [
    doIt(
      1,
      'maths',
      'count to 4',
      'K.CC.B.5',
      'edu:count:chicks:4',
      [
        N('(Count the chicks together: one, two, three, four.)'),
        TI('Four! I counted them loads of times.', 'happy'),
      ],
      'Your child counted four chicks.',
    ),
    notice(
      lines.length - 1,
      'science',
      'parent birds keep their chicks warm and fed',
      '1-LS1-2',
      [
        N('Mother birds sit over their chicks to keep them warm.'),
        N('In a cage, the mother bird can’t get home.'),
        N('Then her chicks get cold. So wild birds stay free.'),
      ],
      'Your child heard how bird parents look after their chicks.',
    ),
  ]);
};

// ---------------------------------------------------------------- step 14: sunrise
const SUNRISE: Line[] = [
  N('The sun peeps over the hills. The light runs down into the valley.'),
  N('First the tall rock called the Tooth, then the roofs, then the waterfall.'),
  N('Then the tide pools, flash! Then the Grove: the pond, the cottage, the hill.'),
  TI('Oh!', 'shock'),
  NO('There. The whole valley, all at once.', 'soft'),
];
const POSTS_LIT = N('Down in the Grove, four little lights shine, one on each post.');
const POSTS_KEPT = N('Down in the Grove, three lights shine steady. One only flickers.');
const VALLEY_CLIMBS: Line[] = [
  N('Then more lights climb Gran Hazel’s hill: lanterns! Lots of them!'),
  N('Everyone in the valley walked up her hill to watch.'),
  NO('They came. They all came.', 'shock'),
];
const LANTERN_HIGH = N('You hold Gran Hazel’s lantern up high. Nova helps you hold it.');
const lightsScene = (of: string, told: boolean, kept: boolean): EduScene => {
  const lines = [
    ...SUNRISE,
    kept ? POSTS_KEPT : POSTS_LIT,
    ...(told ? VALLEY_CLIMBS : []),
    LANTERN_HIGH,
  ];
  const count = kept
    ? ask(
        5,
        'maths',
        'add 1 more',
        'K.OA.A.1',
        [N('Three steady lights, and one that flickers. How many lights in all?')],
        [
          opt('Four', [N('Yes! Three and one more make four. One on every post.')], true),
          opt('Three', [N('Count the flicker too: one, two, three… four! Four lights.')]),
        ],
        'Your child added one more to three.',
      )
    : doIt(
        5,
        'maths',
        'count to 4, even when things look small',
        'K.CC.B.5',
        'edu:count:posts:4',
        [
          N('(Point and count the tiny lights: one, two, three, four.)'),
          NO('Four. All lit. Good.', 'soft'),
        ],
        'Your child counted four lights, even far away.',
      );
  return sc(of, lines, [count]);
};

// ---------------------------------------------------------------- step 15: your turn
const TICK_OPEN: Line[] = [
  N('Nova sits on the flat rock with the book and Gran Hazel’s tiny pencil.'),
  N('She makes a tick by the last line. A very small tick.'),
  NO('Take someone. Done! I took two, and a stowaway!', 'happy'),
];
const TICK_CAIRN: Record<'cup' | 'scarf' | 'book', Line[]> = {
  cup: [
    N('She pours tea into Gran Hazel’s tin cup. She drinks half.'),
    NO('Tea. Yes, please. You have the rest.', 'soft'),
  ],
  scarf: [
    N('Tilly is shivery. Nova winds the long scarf round her. Three times!'),
    NO('Too long! You’ll grow into it.', 'soft'),
  ],
  book: [
    N('Nova holds Tilly’s hand. Nova’s hand is cold.'),
    NO('It’ll warm up. Hands do.', 'soft'),
  ],
};
const TICK_CLOSE: Line[] = [
  N('Nova ties the pencil on a string. She hangs it round Tilly’s neck.'),
  NO('Your new badge: Helping Someone Sad. You earned it.', 'happy'),
  TI('It’s my best badge ever.', 'soft'),
  N('Nova opens the very last page. It is empty. She gives you the book.'),
  NO('Your turn.', 'soft'),
];
const PAGE_CHOICES: Choice[] = [
  {
    id: 'shelf',
    label: 'Write: “The Sunrise Shelf, again. Take someone.”',
    set: { 's24-page': 'shelf' },
    then: [NO('Good. Somebody should keep coming up here.', 'happy')],
  },
  {
    id: 'tea',
    label: 'Write: “Wherever Nova goes next. Tea after.”',
    set: { 's24-page': 'tea' },
    then: [NO('Then come and find me. I’ll put the kettle on!', 'happy')],
  },
  {
    id: 'here',
    label: 'Write: “Here. Every morning.”',
    set: { 's24-page': 'here' },
    then: [NO('That’s the hardest one. Gran Hazel did it for forty years.', 'soft')],
  },
];
const tickScene = (of: string, kept: 'cup' | 'scarf' | 'book'): EduScene => {
  const lines = [...TICK_OPEN, ...TICK_CAIRN[kept], ...TICK_CLOSE];
  return sc(
    of,
    lines,
    [
      doIt(
        lines.length - 1,
        'literacy',
        'talking about places you would like to go',
        'SL.K.1',
        'edu:tell:place:my-list',
        [
          N('(What would go on YOUR list of places? Take turns to say one.)'),
          NO('Good one. Write it down, so nobody stops you.', 'happy'),
        ],
        'Your child took turns to talk about a place they would like to visit.',
      ),
    ],
    { choices: PAGE_CHOICES },
  );
};

// ---------------------------------------------------------------- complete: home
const HOME_OPEN: Line[] = [
  N('You walk back down the hill, slowly.'),
  N('Fairweather comes too. She holds Nova’s arm.'),
  AU('Fifty years up there. I hope somebody kept my room!', 'think'),
];
const HOME_ETERNAL = N('Your Eternal is waiting on the cottage step. Hello!');
const HOME_CLOSE: Line[] = [
  N('That night you light Gran Hazel’s lantern and open the book.'),
  N('Look! Little notes in pencil, on every page. Gran Hazel wrote them!'),
  N('She read all of Nova’s stories, and wrote what she thought.'),
  N('Nova stays three days. She says yes to tea every time.'),
  N('Then Nova goes for a long walk. Her bag is so light now!'),
  N('She waves from the hill. She’ll be back. She said so twice!'),
];
const homeScene = (of: string, eternal: boolean): EduScene => {
  const lines = [...HOME_OPEN, ...(eternal ? [HOME_ETERNAL] : []), ...HOME_CLOSE];
  return sc(of, lines, [
    ask(
      lines.length - 1,
      'literacy',
      'retelling a story in order: first and last',
      'RL.K.3',
      [N('What happened first, on this big adventure?')],
      [
        opt(
          'Tea on the hill',
          [N('Yes! First tea, then the lantern, the cart, the bird… and last, the sunrise.')],
          true,
        ),
        opt('The sunrise', [N('The sunrise came last! First was tea on the hill, with Nova.')]),
      ],
      'Your child retold what happened first and last in the story.',
    ),
  ]);
};

// ================================================================== the quest
const S24_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1
  sc('s24-tea', [...TEA_OPEN, TEA_SIT, TEA_RUN, ...TEA_CLOSE], [TEA_SPRING]),
  sc(
    's24-tea-done',
    [
      N('You carry the teapot up the hill. Careful, careful.'),
      N('Nova drinks one cup. Then another cup.'),
      N('She holds a third cup, just to keep her hands warm.'),
      NO('Gran Hazel always asked me in for tea.', 'soft'),
      NO('I always said, “No, I can’t stop.” But I could have.', 'sad'),
      N('Nova is sad. That’s all right. You sit close.'),
      N('Then she opens the top of her big bag.'),
    ],
    [
      doIt(
        2,
        'maths',
        'count to 3',
        'K.CC.B.5',
        'edu:count:cups:3',
        [
          N('(Count Nova’s cups of tea together: one, two, three.)'),
          NO('Three cups. That’s a record for me.', 'happy'),
        ],
        'Your child counted three cups.',
      ),
    ],
  ),
  // ------------------------------------------------ step 2
  sc(
    's24-pages',
    [
      N('Nova takes out a big fat book. It is tied with a shoelace.'),
      NO('This is my atlas. That means a book of maps.'),
      NO('I never show anyone the front page. But I’ll show you.', 'soft'),
      N('The first page is a list, in pencil. The writing is big and cross.'),
      N('At the top it says: PLACES I’LL GO.'),
      NO('Gran Hazel wrote that. She was nineteen. Young, like a big sister.', 'soft'),
      N('A sea with no other side. A city with trams. Snow in summer.'),
      NO('I was twelve. Gran Hazel gave me the book. She said, “You go.”'),
      NO('So I went! I put a tick by every place.', 'happy'),
    ],
    [
      ask(
        5,
        'social-studies',
        'old people were young once',
        'D2.His.2.K-2',
        [N('Gran Hazel was old. Was she ever young, like you?')],
        [
          opt(
            'Yes, once!',
            [
              N('Yes! Every old person was a baby, then a child, then young.'),
              N('Gran Hazel was nineteen when she wrote this list!'),
            ],
            true,
          ),
          opt('No, never', [
            N('Every grown-up was a child once. Even Gran Hazel!'),
            N('She was nineteen when she wrote this list.'),
          ]),
        ],
        'Your child learned that old people were once young, with plans of their own.',
      ),
    ],
  ),
  sc(
    's24-pages-done',
    [
      N('One line, right at the bottom, has no tick.'),
      N('It says: The Sunrise Shelf. See the whole valley. Take someone.'),
      NO('It’s a high rock on the far hill. One day’s walk.', 'think'),
      NO('I went all over the world. But I never went there.', 'sad'),
      NO('It says, take someone. I never had anyone to take.'),
      NO('Maybe I do now. Will you come?', 'soft'),
    ],
    [
      doIt(
        0,
        'literacy',
        'a tick on a list means “done”',
        'ELOF: Literacy',
        'edu:draw:shape:tick',
        [
          N('A tick means “done”. No tick means “not done yet”.'),
          N('(Draw a tick in the air with your finger.)'),
        ],
        'Your child learned how a tick marks something done on a list.',
      ),
    ],
  ),
  // ------------------------------------------------ step 3
  sc(
    's24-lantern',
    [
      ...LANTERN_ASK,
      N('Gran Hazel’s lantern hangs by the cottage door.'),
      N('Nobody has lit it since she died. You keep it clean and shiny.'),
      N('Your Nubbin sits under it and looks up.'),
      NO('It’s yours now. Is it all right to borrow it?', 'think'),
    ],
    [LANTERN_SUNRISE],
  ),
  sc(
    's24-lantern-done',
    [
      N('You lift the lantern off its hook. It feels light.'),
      N('Gran Hazel nearly always carried it.'),
      NO('Thank you. Now we need a cart!', 'happy'),
      N('Your Nubbin hops along beside you. Off we go!'),
    ],
    [
      ask(
        0,
        'maths',
        'heavy and light',
        'K.MD.A.2',
        [N('Which is heavier: the lantern, or Nova’s big bag?')],
        [
          opt('Nova’s big bag', [N('Yes! The bag is much heavier. The lantern is light.')], true),
          opt('The lantern', [N('The lantern is easy to lift. Nova’s big bag is much heavier!')]),
        ],
        'Your child compared two things by weight: heavy and light.',
      ),
    ],
  ),
  // ------------------------------------------------ step 4
  sc(
    's24-stowaway',
    [
      ...STOW_OPEN,
      N('Here comes Sparks, running and waving both arms.'),
      SP('Is she in there? Sorry! Sorry! It’s my cousin, Tilly.', 'shock'),
      SP('She calls Hazel “Gran”, too. All the little ones do.'),
      N('You lift the cover. Up pops a welly. Then another welly.'),
      N('Then a girl, in the wellies, looking cross.'),
      N('She has a sash with lots of home-made badges.'),
      ...STOW_LAW,
    ],
    [
      ask(
        5,
        'literacy',
        'first sounds: t',
        'RF.K.2',
        [N('Tilly starts with a “t” sound. T-t-Tilly!'), N('Which one starts with “t” too?')],
        [
          opt('Tea', [N('Yes! T-t-tea. Tilly and tea both start with “t”.')], true),
          opt('Bun', [N('B-b-bun starts with “b”. T-t-tea starts with “t”, like Tilly!')]),
        ],
        'Your child listened for the first sound in a word.',
      ),
    ],
  ),
  sc(
    's24-badges',
    [
      TI('I collect badges. I make them myself.', 'happy'),
      TI('Knots. Brave at the Dentist. Goose Handling. And an old tin one.'),
      TI('I need one more: Helping Someone Sad.'),
      TI('Somebody here is sad. I can tell.', 'think'),
      N('Tilly looks at Nova. Nova looks hard at the cart wheel.'),
      N('In the top of Tilly’s welly is a folded note.'),
    ],
    [
      doIt(
        1,
        'maths',
        'count to 4',
        'K.CC.B.5',
        'edu:count:badges:4',
        [
          N('(Count Tilly’s badges on your fingers: one, two, three, four.)'),
          TI('Four! One more makes five.', 'happy'),
        ],
        'Your child counted four badges and heard that one more makes five.',
      ),
    ],
    {
      choices: [
        {
          id: 'leave',
          label: 'Say nothing about the note.',
          then: [
            N('You say nothing. Tilly stands up a bit taller.'),
            TI('You can come on my adventure. You’re allowed.', 'happy'),
          ],
        },
        {
          id: 'ask',
          label: 'Ask her if she’s all right.',
          then: [
            TI('I’m FINE. The note is from Gran Hazel.', 'angry'),
            TI('It isn’t for opening. It’s for keeping.'),
            N('She pats her welly, once. Some things are private, and that’s OK.'),
          ],
        },
      ],
    },
  ),
  // ------------------------------------------------ step 5
  sc(
    's24-pack',
    [
      N('The cart stops by the waterfall. Whoosh! Splash!'),
      N('Nova lifts her bag. One, two, three tries! Clank!'),
      Y('What’s in your bag?'),
      NO('Things Gran Hazel gave me. A tin cup. A long scarf.', 'think'),
      NO('Postcards. And a shell. I can’t leave any of them.'),
      N('You offer to help carry it. Nova says no.'),
      NO('I’ll manage. I always manage.'),
      N('Your Nubbin runs ahead up the stones. Then runs back. Come on!'),
    ],
    [
      ask(
        6,
        'sel',
        'letting friends help',
        'ELOF: Social and Emotional Development',
        [
          N('Nova’s bag is too heavy. But she says no to help.'),
          N('Is it OK to let a friend help?'),
        ],
        [
          opt(
            'Yes, friends can help',
            [N('Yes. Letting a friend help is fine. It makes heavy things lighter.')],
            true,
          ),
          opt('No, do it alone', [
            N('Some things are too heavy for one. Friends can help, and that’s OK.'),
          ]),
        ],
        'Your child talked about letting friends help with something hard.',
      ),
    ],
  ),
  sc(
    's24-falls-top',
    [
      N('The path goes up beside the waterfall. Roar! Splash!'),
      N('The stones are wet and wobbly.'),
      N('Your Nubbin finds the dry stones. Run up, wait, run back!'),
      N('At the top, Tilly climbs a big rock and throws out her arms.'),
      TI('The whole world’s up here! The WHOLE WORLD!', 'happy'),
      NO('…It is, isn’t it.', 'soft'),
      N('Nova is very puffed. But she is smiling, just a little.'),
    ],
    [
      ask(
        0,
        'science',
        'water flows downhill',
        'ELOF: Scientific Reasoning',
        [N('Which way does the waterfall water go: up or down?')],
        [
          opt('Down', [N('Yes! Water always runs downhill. Whoosh!')], true),
          opt('Up', [N('Watch it fall: down, down, down. Water always runs downhill.')]),
        ],
        'Your child noticed that water flows downhill.',
      ),
    ],
  ),
  // ------------------------------------------------ step 6
  birdScene('s24-bird', null),
  sc(
    's24-bird-done',
    [
      N('Then a call comes from higher up: creak-creak!'),
      N('The bird turns its head. Off it runs, into the cloud.'),
      TI('He’s got somewhere to be. You can tell.', 'think'),
      NO('That bird… I’ve seen it in old pictures!', 'shock'),
    ],
    [
      doIt(
        0,
        'science',
        'birds call to each other',
        'ELOF: Scientific Reasoning',
        'edu:copy:sound:creak-creak',
        [
          N('(Make the bird’s call together: creak-creak!)'),
          N('Birds call to tell each other, “Here I am!”'),
        ],
        'Your child copied a bird call and heard that birds call to each other.',
      ),
    ],
  ),
  // ------------------------------------------------ step 7
  sc(
    's24-tracks',
    [
      N('The bird left footprints in the mud. Big ones!'),
      N('Each footprint has three toes.'),
      N('Your Nubbin runs to each footprint and sits in it. Here! Here!'),
      TI('We’re tracking him! That’s another badge!', 'happy'),
      N('Up in the cloud there is a tent. Flags flap on a line.'),
      N('An old, old lady holds a telescope. Her hat has a feather.'),
      AU('Stand still! STILL! You’ll scare it away!', 'angry'),
    ],
    [
      doIt(
        1,
        'maths',
        'more and fewer: 3 and 5',
        'K.CC.C.6',
        'edu:count:toes:3',
        [
          N('(Count the toes on the footprint: one, two, three.)'),
          N('(Now count the toes on one of your feet. Five!)'),
          N('Five is more than three.'),
        ],
        'Your child compared three and five: five is more.',
      ),
    ],
  ),
  sc(
    's24-camp',
    [
      AU('My name is Augusta Fairweather. I am an explorer.', 'think'),
      N('An explorer goes to new places, to find out about them.'),
      N('She looks at you through her telescope. The wrong way round.'),
      AU('Hmm. You are all very small.'),
      N('Tilly turns it round for her. Fairweather says nothing at all.'),
      NO('THE Fairweather? From the old picture papers?', 'shock'),
      NO('Gran Hazel had your picture on her wall when she was a girl!'),
      N('Fairweather sees the old tin badge on Tilly’s sash.'),
      AU('That’s one of my badges! Where did you get it?', 'shock'),
      TI('From Gran Hazel. It was hers when she was little.'),
      NO('Gran Hazel wrote her list because of you.', 'soft'),
    ],
    [
      notice(
        9,
        'social-studies',
        'things from long ago get passed down',
        'D2.His.2.K-2',
        [
          N('Long, long ago, little Gran Hazel wore that badge.'),
          N('Now Tilly wears it. Old things can be passed down, and carry stories.'),
        ],
        'Your child heard how an old thing can be passed down from long ago.',
      ),
    ],
  ),
  // ------------------------------------------------ step 8
  sc(
    's24-cage',
    [
      AU('Long ago I saw that bird. Nobody believed me.', 'sad'),
      AU('They called me a fibber. So I came up here, to prove it.'),
      N('Behind the tent is a big cage. It is for the bird.'),
      AU('One night in a cage, in the village. Then everyone will believe me.'),
      TI('You can’t put Sir Reginald in a CAGE!', 'angry'),
      AU('The bird drinks at the spring when it gets dark. I’ll be ready.'),
    ],
    [
      ask(
        4,
        'science',
        'wild animals need their own homes',
        'K-ESS3-1',
        [N('Where is the best home for a wild bird?')],
        [
          opt(
            'Outside, where it lives',
            [N('Yes. Wild birds need space, their own food, and their families.')],
            true,
          ),
          opt('In a cage', [
            N('A cage is too small for a wild bird.'),
            N('It needs to be free, near its family.'),
          ]),
        ],
        'Your child learned that wild animals need to live free in their own homes.',
      ),
    ],
    {
      choices: [
        {
          id: 'argue',
          label: 'Say the bird doesn’t have to prove anything.',
          then: [AU('Nor did I. But they wanted proof anyway.', 'sad')],
        },
        {
          id: 'sit',
          label: 'Say nothing. Sit down near the cage.',
          then: [N('You sit down. Fairweather looks very, very tired.')],
        },
      ],
    },
  ),
  sc(
    's24-net',
    [
      N('Evening comes. The sky goes dark blue.'),
      N('The bird comes to the spring to drink.'),
      N('Whoosh! Fairweather throws her net over it!'),
      N('The bird runs off up the hill, pulling the net and Fairweather too.'),
      N('Tilly runs after them, fast!'),
      N('Nova’s big bag slides on the wet rock. She grabs it with both arms.'),
      N('When she looks up, Tilly has gone into the dark.'),
      N('Don’t worry. Tilly is safe. You’ll find her soon.'),
    ],
    [
      ask(
        7,
        'sel',
        'staying close to your grown-up',
        'CASEL: Responsible decision-making',
        [N('Tilly ran off in the dark. On a walk, what should children do?')],
        [
          opt(
            'Stay close to their grown-up',
            [N('Yes. Staying close keeps everyone safe, and nobody gets lost.')],
            true,
          ),
          opt('Run off on their own', [
            N('Running off can mean getting lost. Stay close to your grown-up.'),
          ]),
        ],
        'Your child talked about staying close to a grown-up on walks.',
      ),
    ],
  ),
  // ------------------------------------------------ step 9
  sc(
    's24-rock',
    [
      N('Nova sits on a rock, hugging her bag. She doesn’t move.'),
      N('Your Nubbin runs up the hill into the dark. It comes back, calm.'),
      N('Then, from up the hill: a whistle! Wheee-oo!'),
      TI('I’M FINE! I’M WITH SIR REGINALD! DON’T COME, YOU’LL SCARE HIM!', 'angry'),
      NO('She’s all right. Oh, she’s all right.', 'shock'),
      NO('I grabbed my bag, not Tilly. I feel awful.', 'sad'),
      N('It’s too dark to climb now. You can still hear Tilly whistling.'),
      N('You sit down next to Nova. You don’t talk. You just wait.'),
    ],
    [
      ask(
        7,
        'sel',
        'being with someone who feels awful',
        'ELOF: Social and Emotional Development',
        [N('Nova feels awful. What can a friend do?')],
        [
          opt(
            'Sit with her, and wait',
            [
              N('Yes. Sitting close says, “I’m here.” You don’t need words.'),
              N('Nova made a mistake. A mistake doesn’t make her bad.'),
            ],
            true,
          ),
          opt('Tell her to cheer up', [
            N('Cheering up takes time. Sitting close, and waiting, helps more.'),
          ]),
        ],
        'Your child learned that sitting quietly with someone can comfort them.',
      ),
    ],
  ),
  sc(
    's24-light',
    [
      N('You light Gran Hazel’s lantern. It glows, small and gold.'),
      N('Now you can see the rock, and the bag, and Nova’s face.'),
      N('You put the lantern in Nova’s hands.'),
      N('She puts the bag down, so she can hold the lantern properly.'),
      NO('I’ll read Gran Hazel’s list. It always helps.', 'soft'),
      N('She opens the book from the back, by mistake.'),
    ],
    [
      ask(
        1,
        'science',
        'we see things when there is light',
        '1-PS4-2',
        [N('Why can we see Nova’s face now?')],
        [
          opt(
            'The lantern makes light',
            [N('Yes! We need light to see. In the dark, we can’t see much.')],
            true,
          ),
          opt('Nova got bigger', [
            N('Nova is the same size! The lantern makes light, so now we can see.'),
          ]),
        ],
        'Your child learned that we need light to see things.',
      ),
    ],
  ),
  // ------------------------------------------------ step 10
  sc(
    's24-back-pages',
    [
      N('The back pages have writing too. Gran Hazel’s writing!'),
      NO('I never looked at the back. Not once.', 'think'),
      NO('“Nova came. Tea? No, thank you.”', 'soft'),
      NO('“Nova came. She brought a shell. Tea? No, thank you.”'),
      N('Gran Hazel wrote down every visit. Every single one.'),
      NO('“Sunny. Moss sat on my foot all day. Best day this year.”', 'soft'),
      N('The very last page has one more line, just for Nova.'),
      H('“Thank you for all of it. Now go and find somewhere new!”', 'soft'),
      N('Nova cries and cries. Crying lets sad feelings out, and that’s all right.'),
      N('Your Nubbin leans on her. You stay close.'),
    ],
    [
      notice(
        4,
        'literacy',
        'a diary keeps memories',
        'ELOF: Literacy',
        [
          N('A book where you write about your days is called a diary.'),
          N('Gran Hazel’s diary kept every one of Nova’s visits safe.'),
        ],
        'Your child heard what a diary is, and how writing keeps memories.',
      ),
    ],
  ),
  sc(
    's24-crying',
    [
      N('Your Nubbin climbs into Nova’s lap and leans on her.'),
      N('You keep still. Nobody hurries.'),
      N('Up the hill, Tilly whistles now and then. Wheee-oo!'),
      N('Nova cries for a long time. Then a little longer.'),
      NO('She wrote it down. Every time. She did love me.', 'soft'),
      N('Nova wipes her face. She feels a tiny bit better.'),
    ],
    [
      ask(
        3,
        'sel',
        'naming feelings: sad and missing someone',
        'ELOF: Social and Emotional Development',
        [N('Nova is crying. How does she feel?')],
        [
          opt(
            'Sad. She misses Gran Hazel.',
            [N('Yes. Missing someone can make us cry.'), N('A hug and a friend close by help.')],
            true,
          ),
          opt('Cross', [N('Not cross. She is sad. She misses Gran Hazel. A friend helps.')]),
        ],
        'Your child named sadness and missing someone, and what helps.',
      ),
    ],
  ),
  // ------------------------------------------------ step 11
  sc(
    's24-cairn',
    [
      N('Nova opens her big bag. She takes things out, one at a time.'),
      N('A tin cup. A long scarf. A shell. Lots of postcards.'),
      NO('Gran Hazel didn’t want me carrying her things everywhere.', 'soft'),
      NO('I’ll leave them here, in a pile of stones. A cairn.'),
      N('You build it together. Big flat stones at the bottom.'),
      NO('Gran Hazel would say I was being dramatic.', 'think'),
      Y('She would!'),
      N('Nova laughs. Then she holds the last two things: the cup and the scarf.'),
    ],
    [
      ask(
        4,
        'science',
        'building a steady pile: big flat stones at the bottom',
        'K-2-ETS1-1',
        [N('Which stones go at the bottom: big flat ones, or small round ones?')],
        [
          opt(
            'Big flat ones',
            [N('Yes! Big flat stones make a strong base. Round ones would roll.')],
            true,
          ),
          opt('Small round ones', [
            N('Round ones roll away! Big flat stones at the bottom keep the pile steady.'),
          ]),
        ],
        'Your child worked out how to build a steady pile.',
      ),
    ],
    {
      choices: [
        {
          id: 'cup',
          label: '“Keep the tin cup.”',
          set: { 's24-cairn': 'cup' },
          then: [NO('For tea. I’ll say yes to tea now.', 'soft')],
        },
        {
          id: 'scarf',
          label: '“Keep the scarf.”',
          set: { 's24-cairn': 'scarf' },
          then: [
            NO('It’s too long! It was always too long.', 'happy'),
            N('She winds it round her neck. There’s still lots left over.'),
          ],
        },
        {
          id: 'book',
          label: '“Leave them both. Keep the book.”',
          set: { 's24-cairn': 'book' },
          then: [NO('Just the book. It has her words in it.', 'soft')],
        },
      ],
    },
  ),
  sc(
    's24-cairn-done',
    [
      N('Now the bag is empty. Nova lifts it with one finger!'),
      NO('Oh! That’s much better!', 'happy'),
      N('Up the hill, Tilly whistles again. She sounds fed up.'),
      NO('Come on. Let’s go and find Tilly.', 'happy'),
    ],
    [
      doIt(
        0,
        'maths',
        'heavy and light',
        'K.MD.A.2',
        'edu:lift:finger:light',
        [
          N('(Can you lift a sock with one finger? Now try a big book!)'),
          N('Light things are easy to lift. Heavy things are hard.'),
        ],
        'Your child compared lifting something light and something heavy.',
      ),
    ],
  ),
  // ------------------------------------------------ step 12
  sc(
    's24-whistle',
    [
      N('You walk up the hill. You hold the lantern low, to light the path.'),
      N('Your Nubbin runs ahead, and back, and ahead again.'),
      N('Nova looks back at the pile of stones. It’s still there.'),
      NO('It’s just stones. I know it’s just stones.', 'think'),
      N('Wheee-oo! The whistle is louder now.'),
      TI('I CAN SEE YOUR LANTERN! YOU’RE GOING THE LONG WAY!', 'angry'),
    ],
    [
      ask(
        4,
        'science',
        'sounds get louder as you get closer',
        'ELOF: Scientific Reasoning',
        [N('The whistle sounds louder. Are we closer to Tilly, or further away?')],
        [
          opt('Closer', [N('Yes! Sounds get louder as we get closer.')], true),
          opt('Further away', [N('Far-away sounds are quiet. Louder means closer!')]),
        ],
        'Your child noticed that sounds get louder as you get closer.',
      ),
    ],
  ),
  nestScene('s24-nest-fed', 'fed'),
  // ------------------------------------------------ step 13
  sc(
    's24-edge',
    [
      N('Over by the rocks, someone says, “Could anyone help, please?”'),
      N('It is Fairweather! Her boot is stuck in her own net.'),
      AU('Don’t hurry. Hurrying is how you get stuck in nets.', 'think'),
      N('You and Nova kneel down beside her.'),
      N('You put the lantern down, so you can see the knots.'),
      NO('One loop at a time. Slowly.', 'soft'),
    ],
    [
      doIt(
        5,
        'sel',
        'calming down with slow breaths',
        'CASEL: Self-management',
        'edu:breathe:slow:untangle',
        [
          N('(Take a slow breath with Nova. In… and out.)'),
          N('Slow hands untangle knots. Fast hands make more!'),
        ],
        'Your child practised slow breathing to stay calm and careful.',
      ),
    ],
  ),
  sc(
    's24-proof',
    [
      N('Nobody hurries. Your Nubbin sits on the net. The last loop comes free!'),
      N('Fairweather is very tired. She sits against the rock.'),
      N('So you all sit, and wait. Then the mother bird walks past her. Close!'),
      N('Fairweather lifts her hand. Then she puts it back down. She doesn’t touch.'),
      AU('That’ll do. I saw her. That’s enough for me.', 'soft'),
      N('She gives you an old stripy feather from her hat.'),
      AU('Go and see your sunrise. I’ll mind the chicks.', 'happy'),
    ],
    [
      ask(
        3,
        'science',
        'look at wild animals, but don’t touch',
        'K-ESS3-3',
        [N('The wild bird walks close. Should Fairweather grab her?')],
        [
          opt(
            'No, just look',
            [N('Yes. With wild animals, we look, and keep our hands to ourselves.')],
            true,
          ),
          opt('Yes, grab her', [N('Grabbing would scare her. With wild animals, we just look.')]),
        ],
        'Your child learned to look at wild animals without touching.',
      ),
    ],
  ),
  // ------------------------------------------------ step 14
  sc(
    's24-shelf',
    [
      N('The Sunrise Shelf is a flat, high rock. Below it is the whole valley.'),
      N('It is still dark. Everything is blue and sleepy.'),
      TI('Is this it? It’s just dark!', 'think'),
      NO('Wait. That’s the trick. You wait.', 'soft'),
      N('Nova gives you Gran Hazel’s lantern.'),
      NO('You do it. She’d want it to be you.', 'soft'),
      N('Look! The sky is going pale on one side.'),
    ],
    [
      ask(
        6,
        'social-studies',
        'the sun comes up in the east',
        'D2.Geo.2.K-2',
        [
          NO('The sun comes up on the same side every morning.'),
          NO('That side has a name. Do you know it?'),
        ],
        [
          opt('East', [NO('Yes! East. The sun comes up in the east, every single day.')], true),
          opt('Up', [NO('Good guess! That side is called east. The sun comes up in the east.')]),
        ],
        'Your child learned that the sun comes up in the east.',
      ),
    ],
  ),
  lightsScene('s24-lights', false, false),
  // ------------------------------------------------ step 15
  tickScene('s24-tick', 'cup'),
  sc(
    's24-written',
    [
      N('You write your line with the tiny pencil.'),
      N('Tilly makes you a badge too, from a bit of cereal box.'),
      N('It says: HELPING SOMEONE SAD.'),
      TI('You were all right. For a grown-up.'),
      N('Under your line there’s lots of room. Room for lots more places!'),
    ],
    [
      doIt(
        2,
        'literacy',
        'the letter H',
        'ELOF: Literacy',
        'edu:trace:letter:h',
        [
          N('“Helping” starts with H. H-h-helping!'),
          N('(Draw an H in the air: down, down, across.)'),
        ],
        'Your child heard the first sound of a word and drew the letter H.',
      ),
    ],
  ),
  // ------------------------------------------------ complete
  homeScene('s24-home', false),
];

const S24: EduQuest = {
  id: 'sprout:s24',
  of: 's24',
  band: 'sprout',
  title: 'The Adventure Book',
  goals: {
    's24-step1': {
      goal: 'Sit with Nova by Gran Hazel’s flower.',
      hint: 'Walk up the hill. Sit down next to Nova.',
    },
    's24-step2': {
      goal: 'Look at the front of Nova’s big book.',
      hint: 'Stay sitting by Nova. Look at the first page.',
    },
    's24-step3': {
      goal: 'Fetch Gran Hazel’s lantern.',
      hint: 'It hangs on a hook by the cottage door.',
    },
    's24-step4': {
      goal: 'Put Nova’s bag on the cart. Who is giggling?',
      hint: 'Lift the cover at the back of the cart.',
    },
    's24-step5': {
      goal: 'Climb up beside the waterfall.',
      hint: 'Follow your Nubbin. Step where it steps.',
    },
    's24-step6': {
      goal: 'Meet the big bird gently.',
      hint: 'Hold out a bun, or sit and wait. Both are kind.',
    },
    's24-step7': {
      goal: 'Follow the bird’s footprints.',
      hint: 'Big footprints with three toes. Your Nubbin finds the next one.',
    },
    's24-step8': {
      goal: 'Wait at the camp until evening.',
      hint: 'Sit by the tent while the sky gets dark.',
    },
    's24-step9': {
      goal: 'Light Gran Hazel’s lantern for Nova.',
      hint: 'Sit with Nova first. Then give her the lantern.',
    },
    's24-step10': {
      goal: 'Stay with Nova while she is sad.',
      hint: 'Sit still. There is no hurry.',
    },
    's24-step11': {
      goal: 'Help Nova make a pile of stones.',
      hint: 'Big flat stones at the bottom. Take your time.',
    },
    's24-step12': {
      goal: 'Follow Tilly’s whistle.',
      hint: 'Walk towards the whistle. Hold the lantern low.',
    },
    's24-step13': {
      goal: 'Help untangle the net.',
      hint: 'One loop at a time. Your Nubbin holds the end.',
    },
    's24-step14': {
      goal: 'Put the lantern on the high rock at sunrise.',
      hint: 'Face the Grove. Then wait for the sun.',
    },
    's24-step15': {
      goal: 'Write on the last page of the book.',
      hint: 'Pick what to write. Use Gran Hazel’s tiny pencil.',
    },
  },
  scenes: S24_SCENES,
  notes:
    'Every scene of SIDE_STORY_S24 has a sprout version here; the 23 variants are in EDU_S24_SPROUT_VARIANTS and ' +
    'replace or insert exactly as the main quest’s notes say. All choices are kept (none is unkind). Fern’s bag of ' +
    'buns is given as five buns for the take-away lesson; the main script gives no number. The keptStone line swaps ' +
    '(the stilled Nubbin walks instead of runs) are not mirrored in this band.',
};

// ================================================================== variants
const S24_VARIANTS: EduScene[] = [
  // ---------------------------------------------------------------- (1) step 1 scene, by walk
  sc(
    's24-tea-moss',
    [
      ...TEA_OPEN,
      TEA_SIT,
      N('Moss is on his flat stone. Slowly, slowly, he climbs up your leg.'),
      M('I’m coming too. I’ve decided.', 'soft'),
      N('He sits on your shoulder, light as a hat, and shuts his eyes.'),
      ...TEA_CLOSE,
    ],
    [
      ask(
        9,
        'literacy',
        'rhymes: hat',
        'RF.K.2',
        [N('Moss sits on your shoulder like a little hat. What rhymes with “hat”?')],
        [
          opt('Cat', [N('Yes! Hat, cat. They rhyme. A cat could sit on your shoulder too!')], true),
          opt('Dog', [N('Hat, dog: listen to the ends. Hat, cat! Cat rhymes with hat.')]),
        ],
        'Your child listened for a rhyme.',
      ),
    ],
  ),
  sc(
    's24-tea-moss-stayed',
    [
      ...TEA_OPEN,
      N('Next to Gran Hazel’s flower is a small grey-green one. It is Moss’s.'),
      N('Moss died too. His flower grows by the flat stone where he sat.'),
      N('There’s just room between the two flowers. Nova sits there.'),
      NO('Both of you. I’ll sit in the middle.', 'soft'),
      ...TEA_CLOSE,
    ],
    [
      ask(
        7,
        'science',
        'what plants need to grow',
        'K-LS1-1',
        [N('The two flowers grow side by side. What do flowers need to grow?')],
        [
          opt(
            'Sunshine and rain',
            [N('Yes! Flowers need sunshine, rain and good soil. The hill has all three.')],
            true,
          ),
          opt('Toys and sweets', [
            N('Ha! Flowers don’t eat sweets. They need sunshine, rain and good soil.'),
          ]),
        ],
        'Your child learned what plants need to grow.',
      ),
    ],
  ),
  sc(
    's24-tea-sable',
    [
      ...TEA_OPEN,
      TEA_SIT,
      N('Sable comes up the path. She sits near Nova, looking at the far hills.'),
      NO('Hello, grey one. Are you thinking of going exploring?', 'soft'),
      N('Sable says nothing. Her ears stay up.'),
      ...TEA_CLOSE,
    ],
    [
      ask(
        9,
        'science',
        'animals show feelings with their bodies',
        'ELOF: Scientific Reasoning',
        [N('Sable’s ears are up. What might that mean?')],
        [
          opt(
            'She’s listening and curious',
            [N('Yes! Ears up often means listening, and curious.')],
            true,
          ),
          opt('She’s asleep', [
            N('Sleepy animals often lie down with their ears flat. Ears up means listening!'),
          ]),
        ],
        'Your child read an animal’s body language.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- (1a) insert: keptStone, walk not moss
  sc(
    's24-moss-kept',
    [
      N('Up at the top of the hill, Moss sits with his back to everyone.'),
      NO('Hello, Moss.', 'soft'),
      N('He doesn’t turn round. He feels sad and far away.'),
      N('Nova waits a bit. Then she looks at the flower instead.'),
    ],
    [
      ask(
        0,
        'sel',
        'reading body language: turning away',
        'ELOF: Social and Emotional Development',
        [N('Moss has turned his back. How might he feel?')],
        [
          opt(
            'Sad, or upset',
            [N('Yes. Turning away can mean “I’m upset.” Giving him time helps.')],
            true,
          ),
          opt('Happy and silly', [
            N('Look again: back turned, not looking. He seems upset. Giving him time helps.'),
          ]),
        ],
        'Your child read body language: turning away can mean feeling upset.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- (2) step 3 scene: walk = corvin
  sc(
    's24-lantern-corvin',
    [
      ...LANTERN_ASK,
      N('It is Sunday. Corvin comes every Sunday, with Fern’s pie dish.'),
      N('It is washed. There is a pie in it. Fern says it isn’t hers.'),
      N('He takes Gran Hazel’s lantern off its hook, very carefully.'),
      N('He trims the wick, so the flame will burn nicely.'),
      C('For the sunrise, on the far hill.', 'think'),
      N('He gives it to you. He holds on for a moment.'),
      C('Bring it back lit.', 'soft'),
    ],
    [
      ask(
        8,
        'sel',
        'looking after things you borrow',
        'CASEL: Responsible decision-making',
        [N('Corvin lends you the lantern. What do we do with borrowed things?')],
        [
          opt(
            'Look after it, and give it back',
            [N('Yes. Looking after it, and bringing it back, keeps a promise.')],
            true,
          ),
          opt('Keep it forever', [
            N('Borrowed things go back! Looking after them, and returning them, is kind.'),
          ]),
        ],
        'Your child talked about looking after borrowed things and giving them back.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- (3) step 4 scene: s14Done
  sc(
    's24-stowaway-knows',
    [
      ...STOW_OPEN,
      N('Up pops a girl in big wellies, with a sash of badges.'),
      TI('It’s you! You played my dragon game!', 'happy'),
      ...STOW_LAW,
      N('Sparks runs up. She sees who Tilly has found.'),
      SP('Oh, it’s you! Good. Bring her back with both wellies!', 'happy'),
    ],
    [
      ask(
        4,
        'sel',
        'noticing how someone feels',
        'ELOF: Social and Emotional Development',
        [N('Tilly sees you. How does she feel?')],
        [
          opt(
            'Happy to see a friend',
            [N('Yes! Her face lights up. Seeing a friend feels good.')],
            true,
          ),
          opt('Scared', [N('Not scared! She’s smiling. She’s happy to see a friend.')]),
        ],
        'Your child noticed a character’s happy feeling.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- (4) inserts before s24-pack, by ending
  sc(
    's24-bun-moss',
    [
      N('Before the cart goes, Nova walks back up the hill.'),
      N('She puts a bun on Moss’s flat stone, by his flower.'),
      N('Moss died. His body stopped, and it won’t start again.'),
      N('His flower grows here, so everyone remembers him.'),
      NO('A bun for you, Moss. I’ll tell you about the trip when I’m back.', 'soft'),
      N('It’s all right to talk to someone we miss. Lots of people do.'),
    ],
    [
      doIt(
        5,
        'sel',
        'remembering someone who died',
        'ELOF: Social and Emotional Development',
        'edu:share:memory:happy',
        [
          N('(Tell each other one happy thing you remember about someone.)'),
          NO('Remembering keeps them close.', 'soft'),
        ],
        'Your child shared a happy memory, as one way to remember someone.',
      ),
    ],
  ),
  sc(
    's24-eternal-watch',
    [
      N('Your Eternal sits on the hill, where it always sits.'),
      N('It watches the cart go. Bump, bump, down the lane.'),
      N('It doesn’t follow. It knows you will come home.'),
      N('(Wave goodbye to the Eternal!)'),
    ],
    [
      ask(
        2,
        'sel',
        'goodbyes are not forever',
        'ELOF: Social and Emotional Development',
        [N('The Eternal stays at home. Will you see it again?')],
        [
          opt(
            'Yes, when we get home',
            [N('Yes! Goodbye isn’t forever. It will be waiting for you.')],
            true,
          ),
          opt('No, never', [
            N('Don’t worry! It stays right here. It will be waiting when you get home.'),
          ]),
        ],
        'Your child talked about short goodbyes: the ones we leave at home are still there when we come back.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- (5) step 6 scene: collector
  birdScene('s24-bird-collector', 'sold'),
  birdScene('s24-bird-collector-kept', 'kept'),
  // ---------------------------------------------------------------- (6) step 12 done
  nestScene('s24-nest-waited', 'waited'),
  nestScene('s24-nest-fed-collector', 'fed-collector'),
  nestScene('s24-nest-waited-collector', 'waited-collector'),
  // ---------------------------------------------------------------- (7) step 14 done
  lightsScene('s24-lights-told', true, false),
  lightsScene('s24-lights-kept', false, true),
  lightsScene('s24-lights-told-kept', true, true),
  // ---------------------------------------------------------------- (7a) inserts after step 14 done
  sc(
    's24-shelf-moss',
    [
      N('Moss slept on your shoulder all the way up. Now he wakes.'),
      N('He looks and looks, and doesn’t say anything for a long time.'),
      M('I sat on that hill for years, looking at this one.', 'soft'),
      M('I never once looked back the other way.', 'soft'),
      M('She’d have liked this. She’d have talked all the way through it.', 'happy'),
    ],
    [
      ask(
        2,
        'science',
        'far-away things look small',
        'ELOF: Scientific Reasoning',
        [N('From up here, is Moss’s hill near, or far away?')],
        [
          opt('Far away', [N('Yes! Far away. That’s why it looks so tiny.')], true),
          opt('Near', [N('It looks tiny because it’s far away. Near things look big.')]),
        ],
        'Your child noticed that far-away things look smaller.',
      ),
    ],
  ),
  sc(
    's24-shelf-sable',
    [
      N('Sable walked two steps ahead of you, all the way up.'),
      N('She waited for you at every bend.'),
      N('Now she sits on the rock, looking at the Grove.'),
      N('The sun shines on her. She is still grey. But she looks warm.'),
    ],
    [
      ask(
        3,
        'science',
        'sunlight warms things',
        'K-PS3-1',
        [N('The sun shines on Sable. Does she get warmer, or colder?')],
        [
          opt('Warmer', [N('Yes! Sunlight warms things up: rocks, grass, and Sable.')], true),
          opt('Colder', [N('Sunshine makes things warmer. Feel a sunny window sometime!')]),
        ],
        'Your child learned that sunlight warms things.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- (8) step 15 scene, by s24-cairn
  tickScene('s24-tick-scarf', 'scarf'),
  tickScene('s24-tick-book', 'book'),
  // ---------------------------------------------------------------- (9) complete: eternal-dawn
  homeScene('s24-home-eternal', true),
  // ---------------------------------------------------------------- (9a) insert after complete: walk = corvin
  sc(
    's24-home-corvin',
    [
      N('Corvin is by the pond when you get home.'),
      N('He sees the lantern. It is still lit!'),
      C('Good.', 'soft'),
      N('He hangs it back on its hook, all by himself.'),
    ],
    [
      ask(
        1,
        'sel',
        'keeping a promise',
        'CASEL: Relationship skills',
        [N('Corvin said, “Bring it back lit.” Did you?')],
        [
          opt(
            'Yes, we did!',
            [N('Yes! You kept your promise. Keeping promises helps people trust you.')],
            true,
          ),
          opt('No', [
            N('Look: it’s still glowing! You kept your promise. That helps people trust you.'),
          ]),
        ],
        'Your child talked about keeping a promise.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- (10) later, at the museum: s18Done
  sc(
    's24-lecture',
    [
      N('The museum is full! Even the Nubbins brought chairs.'),
      DE('A talk today! Every sign in this museum must be true.', 'happy'),
      AU('People said I was fibbing. I wasn’t. The bird is real.', 'think'),
      AU('But I won’t say where she lives. That’s my whole talk. Thank you!', 'happy'),
      N('Professor Delve hangs a new sign. It says Fairweather was right.'),
      N('Everyone claps. Clap, clap, clap!'),
    ],
    [
      ask(
        3,
        'science',
        'keeping wild animals’ homes safe',
        'K-ESS3-3',
        [N('Why won’t Fairweather say where the nest is?')],
        [
          opt(
            'To keep the birds safe',
            [N('Yes. If nobody knows, nobody can bother the chicks.')],
            true,
          ),
          opt('She forgot', [N('She didn’t forget! She keeps it secret, so the birds stay safe.')]),
        ],
        'Your child learned that keeping a nest secret can keep wild birds safe.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_S24_SPROUT: EduQuest[] = [S24];

/** Sprout versions of every scene in SIDE_STORY_S24_VARIANTS. */
export const EDU_S24_SPROUT_VARIANTS: EduScene[] = S24_VARIANTS;

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  'edu:count:cups:3',
  'edu:draw:shape:tick',
  'edu:count:badges:4',
  'edu:copy:sound:creak-creak',
  'edu:count:toes:3',
  'edu:lift:finger:light',
  'edu:count:chicks:4',
  'edu:breathe:slow:untangle',
  'edu:count:posts:4',
  'edu:tell:place:my-list',
  'edu:trace:letter:h',
  'edu:share:memory:happy',
];
