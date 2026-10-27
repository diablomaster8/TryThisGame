/**
 * The Learning Grove, reader band (ages 7–10): S24 The Adventure Book.
 *
 * Source: side-stories-s24.ts (SIDE_STORY_S24 and SIDE_STORY_S24_VARIANTS). One EduScene per
 * original scene, id `reader:<original id>`: every step scene, every done scene, the complete
 * scene and all 23 variants. Every choice keeps its original id and `set`. See EDU-STYLE.md.
 *
 *   Learning angles (from the outline): old people were young once, with lists of their own
 *   (D2.His.2.K-2); keeping a memory book (a diary) for someone; why we don’t cage wild birds
 *   (K-ESS3-1, K-ESS3-3) and how nests and chicks work (3-LS1-1); reading the land and finding
 *   east for sunrise (2-ESS2-2, 5-ESS1-2). Also: scree and weathering (4-ESS2-1), grams and
 *   kilograms (4.MD.A.1), distance from speed and time (4.MD.A.2), similes and metaphors (L.4.5),
 *   and multiple-meaning words (L.3.4).
 *   Think questions: why Nova always refused tea; whether being treated unfairly makes caging
 *   fair; whether grabbing the pack makes Nova a bad person; what we keep of someone and what we
 *   leave; whether Hazel missed her adventure or had a different one.
 *
 * - Neither quoted line from the film appears. Tilly’s shout and Hazel’s last line use the quest’s
 *   own childLines wording.
 * - Hard things: Hazel and Moss died, said plainly, with comfort after. Nova’s tears run long and
 *   the lesson in s24-back-pages plays early, before the last line, so it never interrupts them.
 * - Nubbins and the tall bird never speak. Moss (an Eternal) speaks a little; Sable is narrated.
 *   Hazel’s third rule is acted out (you sit and wait) but never quoted or named.
 */
import type { EduDomain, EduQuest, EduScene, GlossaryEntry, Lesson } from './types';
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
type LessonIn = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

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
): LessonIn => ({
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
): LessonIn => ({
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
): LessonIn => ({
  domain,
  skill,
  ...(standard ? { standard } : {}),
  kind: 'do',
  after,
  check,
  lines,
  parentNote,
});

/** Builds `reader:<of>` and numbers its lessons `reader:<of>-l1`, `-l2`, in play order. */
const scene = (of: string, lines: Line[], lessons: LessonIn[], choices?: Choice[]): EduScene => {
  const id = `reader:${of}`;
  const s: EduScene = {
    id,
    of,
    band: 'reader',
    lines,
    lessons: [...lessons]
      .sort((a, b) => a.after - b.after)
      .map((l, i) => ({ id: `${id}-l${i + 1}`, ...l })),
  };
  if (choices) s.choices = choices;
  return s;
};

const gloss = (word: string, meaning: string, of: string): GlossaryEntry => ({
  word,
  meaning,
  scene: `reader:${of}`,
});

// ================================================================== shared pieces
// ---------------------------------------------------------------- step 1: tea on the hill
const TEA_OPEN: Line[] = [
  N(
    'Spring. The memorial flowers on the hill have opened all at once, as if somebody gave a signal.',
  ),
  N(
    'Hazel died, and her flower came up here so the valley can remember her. It is the untidy one near Briar’s, and still faces the Grove, very firmly.',
  ),
  N(
    'Somebody comes over the far ridge in the early light, under a pack so big it looks like a walking hedge.',
  ),
  N('It is Nova. She comes straight up the hill path, and at the top she stops, which is new.'),
  NO('Morning. Don’t get up. I live here now, apparently. I still walk past everything.'),
  NO('I thought I’d sit here a minute and not pass.', 'think'),
];
const TEA_SIT = N(
  'She sits down by Hazel’s flower with her pack still on, like a tortoise that has decided to stay a while.',
);
const TEA_RUN = N(
  'Your Nubbin runs to her, then back to you, then to her again, to check you are both still there.',
);
const TEA_CLOSE: Line[] = [
  NO('Is there tea? There’s usually tea. I usually say no.', 'soft'),
  Y('There’s tea.'),
  NO('Then I’ll have some. I’d like to stay for tea.'),
  N(
    'Nobody in the valley can remember Nova staying for tea. Down by the hedge, Fern drops a whole tray of seedlings.',
  ),
];

// ---------------------------------------------------------------- step 3: the lantern
const LANTERN_ASK: Line[] = [
  NO('One more thing. Can we take her lantern? And light it up there, at sunrise?', 'think'),
  NO('So she sees it. From wherever she is, being difficult about something.', 'soft'),
];

// ---------------------------------------------------------------- step 4: the stowaway
const STOW_OPEN: Line[] = [
  N(
    'The carrier’s cart goes up the ridge road on Tuesdays, and takes anyone who can lift their own luggage.',
  ),
  N('Nova can just about lift hers. The cart’s springs go down with a groan.'),
  N(
    'Under the tarp at the back, something says “ow”. Then, much more quietly: “Nobody heard that.”',
  ),
];
const STOW_LAW: Line[] = [
  TI(
    'This is a stowaway situation. You can’t send a stowaway back. That’s the law of the sea.',
    'angry',
  ),
  NO('We’re not at sea.', 'think'),
  TI('It’s the law of carts, then. It’s the same law.'),
];

// ---------------------------------------------------------------- step 6: the tall bird
const BIRD_OPEN: Line[] = [
  N(
    'Above the falls the ridge goes up into cloud, and the cloud is full of birdsong you don’t know.',
  ),
  N(
    'You stop to eat, and set Fern’s bag of lantern buns on a rock. Then it is a bag of lantern buns minus one.',
  ),
  N('Something enormous is standing in the mist three strides off, with a bun in its beak.'),
  N(
    'It is taller than Nova and striped like a humbug, with legs like stilts and a little crest that won’t lie flat.',
  ),
  TI('Oh. Oh. Oh, he’s BEAUTIFUL.', 'shock'),
  TI('He’s called Sir Reginald. That’s decided. Nobody else gets a go.'),
  N('Sir Reginald swallows the bun whole. You can watch it go all the way down.'),
  N('It looks at the bag, and then at you. It takes one step forward and two steps back.'),
  NO('Don’t grab. Whatever you do. A thing like that, you only see once if you grab.', 'soft'),
];
const BIRD_FED: Choice = {
  id: 'fed',
  label: 'Hold out a bun on your flat hand.',
  set: { 's24-bird': 'fed' },
  then: [
    N('You hold out a bun, flat on your palm, and keep your arm very still.'),
    N(
      'It takes a long time. Then the bird lowers its head and takes the bun so gently you hardly feel the beak.',
    ),
    N('Afterwards it follows you a few steps, hopefully, in case your hand does that again.'),
  ],
};
const BIRD_WAITED: Choice = {
  id: 'waited',
  label: 'Sit down on the path and wait for it to come to you.',
  set: { 's24-bird': 'waited' },
  then: [
    N('You sit down on the wet path. Your Nubbin sits down beside you and keeps still.'),
    N(
      'After a long while the bird comes and stands over you both, and looks down at the top of your Nubbin’s head.',
    ),
    N(
      'Then it bends and tidies a tuft of fur there with its beak, very carefully, as if it has been bothering it.',
    ),
  ],
};
type CollectorMode = 'sold' | 'kept';
const BIRD_NOTICED: Record<CollectorMode, Line[]> = {
  sold: [
    TI('It doesn’t like you. That’s weird. Everything likes Keepers.', 'think'),
    N(
      'You think of the pens at home, and the grey Nubbins in them that never make a sound. The bird can tell.',
    ),
  ],
  kept: [
    TI('It doesn’t like your hands. Why are your hands cold? It’s nearly summer.', 'think'),
    N(
      'You put your hands in your pockets. The one with the cold stone in it is colder than the other, and you don’t say anything.',
    ),
  ],
};
const birdFedCollector = (mode: CollectorMode): Choice => ({
  id: 'fed',
  label: 'Hold out a bun on your flat hand.',
  set: { 's24-bird': 'fed' },
  then: [
    N(
      'You hold out a bun on your flat hand. The bird looks at your hand for a long time, and takes one step back.',
    ),
    N(
      'Nova holds out a bun of her own without thinking. The bird walks straight past you and takes it from her.',
    ),
    ...BIRD_NOTICED[mode],
  ],
});
const birdWaitedCollector = (mode: CollectorMode): Choice => ({
  id: 'waited',
  label: 'Sit down on the path and wait for it to come to you.',
  set: { 's24-bird': 'waited' },
  then: [
    N(
      'You sit down on the wet path. The bird stays where it is, three strides off, and comes no nearer.',
    ),
    N(
      'Nova sits down too, a little way off. After a long while the bird goes and stands over her instead.',
    ),
    ...BIRD_NOTICED[mode],
  ],
});
const BIRD_LESSONS: LessonIn[] = [
  notice(
    3,
    'science',
    'body parts that help an animal survive',
    '4-LS1-1',
    [
      NO(
        'Look at those legs. Long legs mean long strides, and a head high enough to see over anything.',
        'think',
      ),
      NO(
        'And the stripes. In mist and shadow, stripes break up an animal’s outline, so it’s harder to spot.',
      ),
    ],
    'Learned how long legs and a striped pattern can help an animal survive.',
  ),
  ask(
    8,
    'sel',
    'gentleness with wild animals',
    'CASEL: Responsible decision-making',
    [N('Why does Nova say not to grab?')],
    [
      opt(
        'Grabbing frightens wild animals, and then they stop trusting people.',
        [
          N(
            'Yes. A wild animal that gets grabbed learns that people mean danger. Slow and gentle earns trust.',
          ),
        ],
        true,
      ),
      opt('Because the bird might bite.', [
        N('It might! But the bigger reason is trust.'),
        N(
          'A wild animal that gets grabbed learns that people mean danger, and won’t come close again.',
        ),
      ]),
    ],
    'Thought about why grabbing a wild animal breaks its trust.',
  ),
];
const birdScene = (of: string, mode: CollectorMode | null): EduScene =>
  scene(
    of,
    BIRD_OPEN,
    BIRD_LESSONS,
    mode ? [birdFedCollector(mode), birdWaitedCollector(mode)] : [BIRD_FED, BIRD_WAITED],
  );

// ---------------------------------------------------------------- step 12: the nest
const NEST_OPEN: Line[] = [
  N(
    'Under an overhang of rock there is a nest the size of a cart wheel, made of heather and string and most of somebody’s washing line.',
  ),
  N(
    'In it are four striped chicks like knitted tea cosies. Beside it sits Tilly, perfectly safe and extremely cross.',
  ),
  N('Her badge sash is wound round the smallest chick, badges and all, so it doesn’t get cold.'),
  TI('You took AGES. I’ve been whistling for about a hundred years.', 'angry'),
  TI('Sir Reginald’s a mother. That’s allowed. She can still be Sir.'),
  N(
    'Fairweather’s cage stands open and empty at the edge of the overhang. Out in the dark, a creaky two-note call.',
  ),
];
const NEST_PAYOFF: Record<'fed' | 'waited' | 'fed-collector' | 'waited-collector', Line[]> = {
  fed: [
    N(
      'You remember the flat hand. You lay a trail of buns from the dark to the nest, one by one, and step back.',
    ),
    N(
      'After a long while a striped head comes out of the dark, eating its way along your trail, bun by bun, all the way home.',
    ),
    N('She stands over her chicks and looks at you. You are fairly sure she remembers your hand.'),
  ],
  waited: [
    N(
      'You remember the wet path. You sit down by the nest with your Nubbin beside you, and you wait.',
    ),
    N(
      'After a long while the mother comes out of the dark on her own, and stands over her chicks, and over your Nubbin.',
    ),
    N('She tidies the tuft on its head again. It wasn’t bothering it, and she does it anyway.'),
  ],
  'fed-collector': [
    N(
      'The bird won’t come while you are near. You give Nova the buns and stand back in the dark by the rock.',
    ),
    N(
      'Nova lays the trail and sits down at the end of it. After a long while a striped head comes eating its way home to her.',
    ),
  ],
  'waited-collector': [
    N(
      'The bird won’t come while you are near. You stand back in the dark by the rock, and Nova sits down by the nest alone.',
    ),
    N(
      'After a long while the mother comes out of the dark and stands over her chicks, and over Nova, and stays.',
    ),
  ],
};
const nestScene = (of: string, payoff: keyof typeof NEST_PAYOFF): EduScene =>
  scene(
    of,
    [...NEST_OPEN, ...NEST_PAYOFF[payoff], NO('There. She came straight home.', 'soft')],
    [
      notice(
        2,
        'science',
        'a bird’s life cycle, and why chicks need a parent',
        '3-LS1-1',
        [
          NO(
            'Egg, chick, adult, and then new eggs. That’s a bird’s whole life cycle, round and round.',
            'soft',
          ),
          NO(
            'Newly hatched chicks often can’t keep themselves warm yet. A parent sits over them, like a feather duvet.',
          ),
          NO(
            'Cage the mother, and the chicks get cold. That’s the real reason wild birds stay wild.',
          ),
        ],
        'Learned the stages of a bird’s life cycle and why chicks need a parent nearby.',
      ),
    ],
  );

// ---------------------------------------------------------------- step 14: sunrise
const SUNRISE: Line[] = [
  N(
    'The sun comes over the far rim and runs down into the valley one place at a time, as if it is calling a register.',
  ),
  N(
    'The Tooth, then the Circuit’s square roofs, then the falls, smoking white; the Hollow, where the paths stop; the tide pools, flashing.',
  ),
  N(
    'Then the Grove: the pond, the cottage, the hill. All of it at once, small and bright, exactly as she wrote it.',
  ),
  TI('Oh.', 'shock'),
  NO('There. The whole valley. At once.', 'soft'),
];
const POSTS_LIT = N(
  'Down in the Grove, four small lights are still burning, one at each post, as if somebody left them on for you.',
);
const POSTS_KEPT = N(
  'Down in the Grove, small lights still burn at the posts: three steady, and one by the long grass that only flickers.',
);
const VALLEY_CLIMBS: Line[] = [
  N(
    'Then more lights, all the way up the western hill: lanterns, a long line of them, climbing in the last of the dark.',
  ),
  N(
    'The valley has walked up her hill to watch the far ridge. Fern saw the cart go, and Sparks told everyone else.',
  ),
  NO('They came. They all came up.', 'shock'),
];
const LANTERN_HIGH = N(
  'You lift Hazel’s lantern as high as it will go. Nova puts her hand under your elbow, to help hold it up.',
);
const lightsScene = (of: string, told: boolean, kept: boolean): EduScene => {
  const lines = [
    ...SUNRISE,
    kept ? POSTS_KEPT : POSTS_LIT,
    ...(told ? VALLEY_CLIMBS : []),
    LANTERN_HIGH,
  ];
  const lessons: LessonIn[] = [
    notice(
      4,
      'science',
      'why high places catch the sunrise first',
      '5-ESS1-2',
      [
        N('At sunrise the Sun sits very low, so its light skims sideways across the land.'),
        N(
          'The tallest places poke up into it first. The valley floor stays in shadow until the Sun climbs higher.',
        ),
      ],
      'Learned why the tops of hills light up before the valley at sunrise.',
    ),
  ];
  if (told) {
    lessons.push(
      notice(
        8,
        'sel',
        'showing up for each other',
        'CASEL: Social awareness',
        [
          N(
            'Nobody asked them to come. They noticed, and they came. Sometimes that is the whole of being kind.',
          ),
        ],
        'Thought about how simply turning up can show someone they are not alone.',
      ),
    );
  }
  return scene(of, lines, lessons);
};

// ---------------------------------------------------------------- step 15: your turn
const TICK_OPEN: Line[] = [
  N(
    'Nova sits on the lip of the Shelf with the atlas open at the front, and a stub of pencil worn almost to nothing.',
  ),
  NO(
    'This was hers. The one she wrote the list with. She gave it me with the book. I’ve never once used it.',
    'soft',
  ),
  N('She ticks the last line. It is a very small tick, and it takes her a long time.'),
  NO('Take someone. Done. I took two, and a stowaway.', 'happy'),
];
const TICK_CAIRN: Record<'cup' | 'scarf' | 'book', Line[]> = {
  cup: [
    N('She pours tea from a flask into Hazel’s tin cup, drinks half, and hands you the rest.'),
    NO('Tea. Accepted.', 'soft'),
  ],
  scarf: [
    N(
      'Tilly is shivering. Nova unwinds the long scarf and winds it round her, three times, and there is still some left.',
    ),
    TI('It’s too long.'),
    NO('It was always too long. You’ll grow into it.', 'soft'),
  ],
  book: [
    N(
      'Her hands are empty except for the book. She doesn’t seem to know what to do with them, so she holds Tilly’s.',
    ),
    TI('Your hand’s cold.', 'think'),
    NO('It’ll warm up. They do.', 'soft'),
  ],
};
const TICK_CLOSE: Line[] = [
  N('Then she ties the pencil stub to a bit of string, and hangs it round Tilly’s neck.'),
  NO('Helping Someone Sad. You earned it. You were very annoying about it, but you earned it.'),
  TI('…It’s the best badge I’ve got.', 'soft'),
  N('Tilly checks the top of her welly, the way she always does, and leaves the note where it is.'),
  N('Nova turns the atlas to its very last page, which is blank, and holds it out to you.'),
  NO('Your turn.', 'soft'),
];
const PAGE_CHOICES: Choice[] = [
  {
    id: 'shelf',
    label: 'Write: “The Sunrise Shelf, again. Take someone.”',
    set: { 's24-page': 'shelf' },
    then: [NO('Good. Somebody has to keep it in use.', 'happy')],
  },
  {
    id: 'tea',
    label: 'Write: “Wherever Nova goes next. Tea after.”',
    set: { 's24-page': 'tea' },
    then: [
      NO('Then you’ll have to come and find me. I’ll leave the kettle on. Probably.', 'happy'),
    ],
  },
  {
    id: 'here',
    label: 'Write: “Here. Every morning.”',
    set: { 's24-page': 'here' },
    then: [NO('That’s the hardest one on any list. She managed it forty years.', 'soft')],
  },
];
const TICK_THINK = (after: number): LessonIn =>
  ask(
    after,
    'literacy',
    'theme: what counts as an adventure',
    'RL.4.2',
    [
      N('Hazel wrote a list of faraway places. Then she spent most of her life in one garden.'),
      N('What do you think: did she miss her adventure, or have a different one?'),
    ],
    [
      opt('She had a different one: the Grove, and everyone in it.', [
        N(
          'That’s how Nova reads it now. The back of the book is full of ordinary days, and Hazel called them the best.',
        ),
      ]),
      opt('She missed it, a bit. But she sent Nova instead.', [
        N(
          'That’s a fair answer, and a kind one. She gave the list away so somebody would go. That counts for something.',
        ),
      ]),
      opt('Both. You can miss one thing and love another.', [
        N('A wise answer. People can be glad and sorry about the same life. Hazel probably was.'),
      ]),
    ],
    'Thought about the story’s theme: an ordinary life with people you love can be the adventure.',
  );
const tickScene = (of: string, kept: 'cup' | 'scarf' | 'book'): EduScene => {
  const lines = [...TICK_OPEN, ...TICK_CAIRN[kept], ...TICK_CLOSE];
  return scene(of, lines, [TICK_THINK(lines.length - 1)], PAGE_CHOICES);
};

// ---------------------------------------------------------------- complete: home
const HOME_OPEN: Line[] = [
  N(
    'You come down off the ridge in the afternoon, slowly, because Augusta Fairweather is coming too, on Nova’s arm.',
  ),
  AU('Fifty years. I don’t suppose anybody has kept my room.', 'think'),
  N(
    'She takes the empty cottage at the foot of the falls path, for a week, she says. Nobody believes her, kindly.',
  ),
];
const HOME_ETERNAL = N(
  'Your Eternal is on the cottage step when you get in, as if it had been there all along. It probably had.',
);
const HOME_CLOSE: Line[] = [
  N(
    'That night you light Hazel’s lantern by the cottage table and open the atlas, to read her list again.',
  ),
  N(
    'In the margins there is writing, in faint pencil. It wasn’t there before, or it was, and it needed this light.',
  ),
  N(
    'It is on every page. Beside a story about a hungry dragon: “I’d have fed the dragon.” Beside a story about endless forms and queues: “Ha. Typical.”',
  ),
  N(
    'She read every story Nova ever brought her, and had something to say about all of them. Of course she did.',
  ),
  N('Nova stays three days, and has tea every afternoon.'),
  N(
    'On the fourth she sets off over the far ridge for a long walk, with a pack you could lift with a finger. She says twice that she’ll be back.',
  ),
  N('At the top she turns and waves, and doesn’t wait to see whether you wave back. She knows.'),
];
const homeScene = (of: string, eternal: boolean): EduScene => {
  const lines = [...HOME_OPEN, ...(eternal ? [HOME_ETERNAL] : []), ...HOME_CLOSE];
  return scene(of, lines, [
    doIt(
      lines.length - 1,
      'literacy',
      'theme: small, ordinary days can be the adventure',
      'RL.4.2',
      'edu:tell:ordinary-day',
      [
        N(
          'Hazel wrote down small, ordinary days. (Tell someone at home about one ordinary day you’d put in a book like hers.)',
        ),
      ],
      'Linked the theme to their own life by choosing an ordinary day worth writing down.',
    ),
  ]);
};

// ================================================================== the quest
const S24_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1
  scene(
    's24-tea',
    [...TEA_OPEN, TEA_SIT, TEA_RUN, ...TEA_CLOSE],
    [
      ask(
        6,
        'literacy',
        'similes: comparing with “like”',
        'L.4.5',
        [
          N(
            'Nova sits “like a tortoise that has decided to stay a while”. That’s a simile: a comparison using “like”.',
          ),
          N('What does it tell you?'),
        ],
        [
          opt(
            'Her big pack is like a shell, and she isn’t moving.',
            [
              N(
                'Exactly. Two words, “a tortoise”, and you can see the pack, the slowness and the staying.',
              ),
            ],
            true,
          ),
          opt('She has turned into a tortoise.', [
            N('Not really! A simile only compares. She’s still Nova.'),
            N('The pack is like a shell, and she’s staying put, the way a tortoise does.'),
          ]),
        ],
        'Explained what a simile shows about a character.',
      ),
    ],
  ),
  scene(
    's24-tea-done',
    [
      N(
        'You bring the pot up the hill. Nova drinks two cups, and holds the third without drinking it, for the warmth.',
      ),
      NO('She asked me in every time. Every single time. I always said I couldn’t stop.', 'soft'),
      NO('I could have stopped.', 'sad'),
      N(
        'That is regret: wishing you had done something differently, when you can’t go back and do it.',
      ),
      N('Your Nubbin leans against Nova’s boot, the way it leans against yours.'),
      N('She looks at the flower for a while. Then she undoes the top of her pack.'),
    ],
    [
      ask(
        5,
        'literacy',
        'a character’s motives',
        'RL.3.3',
        [N('Why do you think Nova always said no to tea?')],
        [
          opt('She was always in a hurry to get somewhere new.', [
            N('That fits. She still walks past everything. Stopping was hard for her.'),
          ]),
          opt('She thought there would always be another time.', [
            N('A lot of people think that. It’s why her “I could have stopped” hurts so much.'),
          ]),
          opt('Staying felt too close, somehow.', [
            N(
              'That’s a thoughtful answer. Some people find kindness easier to visit than to sit inside.',
            ),
          ]),
        ],
        'Thought about the reasons behind a character’s choices.',
      ),
    ],
  ),
  // ------------------------------------------------ step 2
  scene(
    's24-pages',
    [
      N(
        'The atlas comes out wrapped in oilcloth. It is fat with maps and tickets and pressed leaves, and tied shut with a bootlace.',
      ),
      NO(
        'You’ve seen the middle. The stories. Everybody has. I don’t show anyone the front.',
        'think',
      ),
      N(
        'She unties the bootlace. The first pages are not maps: they are a list, in pencil, in a young hand that presses hard.',
      ),
      N(
        'At the top, underlined twice: PLACES I’LL GO. Underneath, smaller and crosser: (and nobody is to stop me).',
      ),
      NO(
        'Hazel wrote that. She was nineteen. Before the Grove. Before Moss decided she’d do.',
        'soft',
      ),
      N(
        '“A sea with no other side”; “a city with trams”; “somewhere it snows in June”; “a mountain nobody can pronounce”.',
      ),
      N(
        'Every line has a tick beside it, in ink, in a different hand. Some of the ticks are very old, and some are not.',
      ),
      NO(
        'Mine. Every tick. She asked me to come back and tell her about each one after. So I did.',
      ),
      NO(
        'I was twelve. I came through on the carrier’s cart, between one place and the next. It was raining.',
        'soft',
      ),
      NO(
        'She gave me tea, which I refused, and this, which I didn’t. She said, “You go. One of us should.”',
      ),
    ],
    [
      notice(
        4,
        'social-studies',
        'older people were young once, with plans of their own',
        'D2.His.2.K-2',
        [
          N(
            'It’s strange to think of Hazel at nineteen: cross, impatient, with a list of places and nobody to stop her.',
          ),
          N(
            'Every older person you know was young once, with plans. Ask one what was on their list. The answers can surprise you.',
          ),
        ],
        'Thought about how older people were once young, with hopes and plans of their own.',
      ),
      ask(
        5,
        'science',
        'seasons are opposite in the two halves of the world',
        '3-ESS2-1',
        [N('“Somewhere it snows in June.” Where could that be?')],
        [
          opt(
            'Somewhere in the southern half of the world.',
            [
              N(
                'Yes. When it’s summer in the north, it’s winter in the south. Very high mountains can have snow in June too.',
              ),
            ],
            true,
          ),
          opt('Nowhere. June is summer.', [
            N('It is in the north! But in the southern half of the world, June is winter.'),
            N('Very high mountains can have snow in June too.'),
          ]),
        ],
        'Learned that the seasons are opposite in the northern and southern halves of the world.',
      ),
    ],
  ),
  scene(
    's24-pages-done',
    [
      N(
        'One line, at the very bottom, has no tick: “The Sunrise Shelf. See the whole valley at once. Take someone.”',
      ),
      NO(
        'It’s on the far ridge. A day’s walk. I’ve seen a sea with no other side, and never went a day’s walk from her door.',
        'sad',
      ),
      N(
        'Nova runs her finger along the line, the way you might stroke a cat that isn’t sure about you.',
      ),
      NO('It says take someone. I never had anyone to take.'),
      NO('…I might have someone now. If someone’s free.', 'soft'),
      N('Your Nubbin is already sitting on your boot, ready to go.'),
    ],
    [
      ask(
        1,
        'maths',
        'distance from speed and time',
        '4.MD.A.2',
        [
          NO('A day’s walk, uphill. On a steep path I manage about 3 kilometres an hour.', 'think'),
          NO('If we walk for 8 hours, how far could we get?'),
        ],
        [
          opt(
            '24 kilometres',
            [NO('That’s it. 3 kilometres, 8 times over: 24. A good long day.', 'happy')],
            true,
          ),
          opt('11 kilometres', [
            NO('That’s 3 add 8. But it’s 3 kilometres every hour, for 8 hours: 3 times 8 is 24.'),
          ]),
          opt('38 kilometres', [
            NO('Too far for my legs! 3 kilometres an hour, for 8 hours: 3 times 8 is 24.'),
          ]),
        ],
        'Multiplied speed by time to find a distance (3 km an hour for 8 hours = 24 km).',
      ),
    ],
  ),
  // ------------------------------------------------ step 3
  scene(
    's24-lantern',
    [
      ...LANTERN_ASK,
      N(
        'Hazel’s lantern hangs on the hook by the cottage door, where it has hung since somebody brought it down off the hill.',
      ),
      N(
        'You haven’t lit it since. You dust it, and tell yourself you are waiting for a good reason.',
      ),
      N('Your Nubbin sits under it and looks up, the way it looks up at the fruit trees.'),
      NO(
        'Is that all right? It’s yours now. I can stop asking for things. I’m out of practice anyway.',
        'think',
      ),
    ],
    [
      notice(
        0,
        'science',
        'daylight changes through the year',
        '1-ESS1-2',
        [
          NO(
            'Sunrise comes a little earlier every morning in spring. The days are stretching out.',
            'think',
          ),
          NO(
            'By midsummer the sun is up before nearly everyone. After that, the mornings slowly get later again.',
          ),
        ],
        'Learned that the time of sunrise changes through the year.',
      ),
    ],
  ),
  scene(
    's24-lantern-done',
    [
      N('The lantern is lighter than you remember. It was nearly always her carrying it.'),
      N(
        'Unlit, it weighs hardly anything at all. Funny how something can be light in your hands and heavy everywhere else.',
      ),
      NO('Right. Now I need a carrier who doesn’t ask questions.', 'happy'),
      N('Your Nubbin trots beside you, keeping one eye on the lantern.'),
      N('Down the lane, the carrier’s cart is waiting, and its horse is eating somebody’s hedge.'),
      N('Nova goes ahead to argue with the carrier about the price.'),
    ],
    [
      ask(
        0,
        'literacy',
        'multiple-meaning words: light',
        'L.3.4',
        [N('“The lantern is lighter than you remember.” What does “lighter” mean here?')],
        [
          opt(
            'It weighs less.',
            [
              N(
                'Yes, it weighs less. “Light” can also mean bright, and a lantern is both. A word used two ways at once is called a pun.',
              ),
            ],
            true,
          ),
          opt('It shines more brightly.', [
            N('Good thinking, it IS a lantern! But it isn’t lit yet.'),
            N('Here “lighter” means it weighs less. “Light” has both meanings.'),
          ]),
        ],
        'Worked out which meaning of a multiple-meaning word fits.',
      ),
    ],
  ),
  // ------------------------------------------------ step 4
  scene(
    's24-stowaway',
    [
      ...STOW_OPEN,
      N(
        'Sparks comes down the lane at a run, which is how Sparks comes down a lane, waving both arms.',
      ),
      SP('Is she in there? She’s in there. Course she is. Sorry. SORRY. She’s my cousin.', 'shock'),
      SP(
        'Tilly. Nine. Calls Hazel “Gran” too. Everyone under ten does; it saves explaining. She heard “ridge” and went off like a cork.',
      ),
      N(
        'You lift the tarp. A girl in big wellies glares up at you, with a sash across her chest covered in home-made badges.',
      ),
      ...STOW_LAW,
    ],
    [
      ask(
        9,
        'social-studies',
        'real rules and made-up rules',
        'D2.Civ.8.K-2',
        [N('Is “the law of carts” a real rule?')],
        [
          opt(
            'No. Tilly made it up to get her own way.',
            [
              N(
                'Yes. Real rules are agreed so things are fair for everyone. Tilly’s rule is fair to exactly one person: Tilly.',
              ),
            ],
            true,
          ),
          opt('Yes. Stowaways can’t be sent back.', [
            N('Tilly says it so firmly that it sounds real! But she invented it on the spot.'),
            N(
              'Real rules are agreed so things are fair for everyone, not just for the person saying them.',
            ),
          ]),
        ],
        'Told the difference between a real, fair rule and one made up to suit one person.',
      ),
    ],
  ),
  scene(
    's24-badges',
    [
      TI(
        'I need a badge. I’ve got Knots (Mostly), Brave at the Dentist, Goose Handling, and an old tin one.',
        'think',
      ),
      TI('I need Helping Someone Sad. Somebody here is sad. I can tell. I’m very good at it.'),
      N(
        'She looks straight at Nova. Nova looks at the cart’s back wheel as if it has said something interesting.',
      ),
      N('In the top of Tilly’s left welly there is a folded square of paper, damp at one corner.'),
      N(
        'You know what it is. Hazel left Tilly a short note, just her name on the front, and Tilly has never opened it.',
      ),
      N('Your Nubbin sniffs the welly politely, then sits down and looks at you.'),
    ],
    [
      ask(
        5,
        'sel',
        'respecting someone’s privacy',
        'CASEL: Social awareness',
        [N('Tilly keeps the note close and closed. What do you think you should do?')],
        [
          opt('Leave it. It’s hers.', [
            N('That respects her privacy. Sometimes saying nothing tells someone you understand.'),
          ]),
          opt('Gently check she’s all right.', [
            N(
              'That’s caring. She may not want to talk, and that’s her choice, but now she knows you noticed.',
            ),
          ]),
          opt('I’m not sure.', [
            N('That’s honest. Both are kind. The trick is to watch the person, and let them lead.'),
          ]),
        ],
        'Thought about how to respect someone’s privacy while still caring about them.',
      ),
    ],
    [
      {
        id: 'leave',
        label: 'Say nothing about the note.',
        then: [
          N(
            'You say nothing about it. Tilly notices you saying nothing, and stands up a bit straighter in the cart.',
          ),
          TI('You can come on my adventure. You’re allowed.'),
        ],
      },
      {
        id: 'ask',
        label: 'Ask her if she’s all right.',
        then: [
          TI(
            'I’m FINE. That’s private. It’s from Gran Hazel. It isn’t for opening. It’s for having.',
            'angry',
          ),
          N('She pushes it down out of sight. Then she pats the welly, once, to check.'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 5
  scene(
    's24-pack',
    [
      N(
        'The cart leaves you at the foot of the falls path, where the road gives up and the water takes over.',
      ),
      N(
        'Nova gets her pack onto her back in three goes. It clanks, and it is the size of a small shed.',
      ),
      Y('What’s in it?'),
      NO('Keepsakes. Her things. Things she gave me.', 'think'),
      NO(
        'A tin cup. A scarf she knitted a sleeve too long. Every postcard I sent her, and every one she sent back.',
      ),
      NO('A shell I gave her, which she gave back, and I gave her again. Twice.', 'happy'),
      N(
        'You offer to take a strap, and she says no. Tilly offers to take a strap, and she says no, more kindly.',
      ),
      NO('I’ll manage. I always manage. It’s only heavy when you think about it.'),
      N(
        'Fern has sent a paper bag of lantern buns, the only light thing in there. Your Nubbin sits on it, to keep it safe from everybody but itself.',
      ),
      N(
        'Then your Nubbin is halfway up the first stretch of stones, looking back to see why you are all so slow.',
      ),
    ],
    [
      ask(
        4,
        'maths',
        'grams and kilograms',
        '4.MD.A.1',
        [
          N(
            'A postcard weighs about 5 grams. Say Nova has 200 postcards in there. How much do they weigh?',
          ),
        ],
        [
          opt(
            '1,000 grams, which is 1 kilogram',
            [
              N(
                'Yes. 200 times 5 is 1,000 grams, and 1,000 grams make 1 kilogram. That’s just the postcards!',
              ),
            ],
            true,
          ),
          opt('205 grams', [
            N(
              'That’s 200 add 5. But each card weighs 5 grams: 200 times 5 is 1,000 grams. That’s 1 kilogram.',
            ),
          ]),
          opt('40 grams', [
            N('That’s 200 shared by 5. We need 200 lots of 5 grams: 1,000 grams, or 1 kilogram.'),
          ]),
        ],
        'Multiplied to find a total mass and converted 1,000 grams to 1 kilogram.',
      ),
    ],
  ),
  scene(
    's24-falls-top',
    [
      N(
        'The path climbs beside the falls, not behind them, through spray and roar. The stones are wet and loose.',
      ),
      N('This slope of loose, broken stone is called scree. Your Nubbin finds the dry stones.'),
      N('It runs up, waits on each, runs back to you, and goes up again.'),
      N(
        'At the top Tilly climbs onto a boulder, spreads her arms at the whole wet sky, and yells at the top of her voice.',
      ),
      TI('The whole world’s up here! The WHOLE WORLD!', 'happy'),
      NO('…It is, isn’t it.', 'soft'),
      N(
        'Nova is red in the face and bent nearly double under the pack. She is also, very slightly, smiling.',
      ),
    ],
    [
      notice(
        1,
        'science',
        'weathering: how frost breaks rock into scree',
        '4-ESS2-1',
        [
          NO(
            'Know where scree comes from? Water seeps into cracks in the cliff and freezes. Ice takes up more room than water.',
            'think',
          ),
          NO(
            'Freeze, thaw, freeze, thaw. Year after year the cracks widen, until bits break off and tumble down here.',
          ),
          NO('That’s weathering. Slow, but it never stops.'),
        ],
        'Learned how freezing and thawing water breaks rock apart (weathering).',
      ),
    ],
  ),
  // ------------------------------------------------ step 6
  birdScene('s24-bird', null),
  scene(
    's24-bird-done',
    [
      N(
        'Then something calls from higher up, a creaky two-note call. The bird turns its head, and is gone into the cloud.',
      ),
      TI('He’s got somewhere to be. You can tell.', 'think'),
      N('For a moment nobody says anything. The cloud drips off the end of your nose.'),
      N('Nova is standing very still, with her mouth open.'),
      NO('That’s a… no. That can’t be. That’s out of a picture paper.', 'shock'),
      TI('What’s a picture paper?'),
      NO('A newspaper full of drawings. Before your time. Before mine, nearly.', 'think'),
    ],
    [
      notice(
        0,
        'science',
        'animals use calls to communicate',
        '4-LS1-2',
        [
          N(
            'Birds call to each other to say where they are, to warn of danger, or to call their young. That call meant something, and the bird heard it.',
          ),
        ],
        'Learned that birds use calls to send messages, and listen for them.',
      ),
      notice(
        6,
        'social-studies',
        'how people got news in the past',
        'D2.His.2.K-2',
        [
          N(
            'Long ago, before radio or television, people got their news from newspapers, often filled with drawings of faraway places.',
          ),
        ],
        'Learned how people got news and pictures of the world before modern screens.',
      ),
    ],
  ),
  // ------------------------------------------------ step 7
  scene(
    's24-tracks',
    [
      N(
        'The tracks are three-toed, enormous and very far apart. Your Nubbin runs from one to the next and sits in each to show you.',
      ),
      N('Each track is about two metres from the last. That bird takes very big steps.'),
      TI('We’re tracking him. That’s a tracking badge. I’m getting two badges today.', 'happy'),
      N(
        'Higher up, the tracks cross a lot of other tracks: boots, very old ones, going round and round in the same circles.',
      ),
      N(
        'Then a tarpaulin in the cloud, roped to the rock. A washing line, a row of flags, and a great many notebooks under a tin lid.',
      ),
      N(
        'And a very old woman with a telescope, a hat with a feather in it, and a voice like a door that wants oiling.',
      ),
      AU(
        'Stand still. Stand STILL. You’ll frighten it off, and then you’ll say it was never here. They always do.',
        'angry',
      ),
    ],
    [
      ask(
        1,
        'maths',
        'multiplication as equal groups',
        '3.OA.A.1',
        [N('If each of the bird’s steps is 2 metres, how far does it go in 10 steps?')],
        [
          opt(
            '20 metres',
            [N('Yes. 10 groups of 2 metres is 20 metres. About the length of two buses.')],
            true,
          ),
          opt('12 metres', [
            N('That’s 10 add 2. It’s 10 steps of 2 metres each: 10 times 2 is 20 metres.'),
          ]),
        ],
        'Used multiplication as equal groups (10 steps of 2 metres = 20 metres).',
      ),
    ],
  ),
  scene(
    's24-camp',
    [
      AU(
        'Augusta Fairweather. Explorer. You won’t have heard of me. Nobody has, for fifty years.',
        'think',
      ),
      N('Nova makes a noise like a kettle just before it gets going.'),
      NO(
        'THE Fairweather? From the picture papers? Hazel had your picture on her wall when she was a girl. She told me.',
        'shock',
      ),
      AU(
        'Did she. Then she was one of four thousand children who believed me, before they were told not to.',
      ),
      N('Fairweather’s eye falls on Tilly’s sash, on the old tin badge, and stays there.'),
      AU('That’s one of mine. The Young Explorers. Where did you get that?', 'shock'),
      TI('Gran Hazel. It was hers when she was little. She gave it me. It’s my oldest one.'),
      AU(
        '…Of course it was. I heard somebody shout my old motto up at the falls today. I thought I’d dreamed it.',
        'soft',
      ),
      AU('“The whole world’s up here.” It was stamped on every badge.', 'soft'),
      N('Tilly turns her tin badge over. The words are on the back, very small.'),
      NO('She wrote her list because of you. All of it. Every place.', 'soft'),
    ],
    [
      ask(
        3,
        'sel',
        'imagining how someone else feels',
        'CASEL: Social awareness',
        [
          N(
            'Four thousand children believed Fairweather, “before they were told not to”. How do you think that felt, for fifty years?',
          ),
        ],
        [
          opt('Lonely. Like nobody was on her side.', [
            N('That’s probably right. It might be why she lives up here, alone.'),
          ]),
          opt('Angry, and she wanted to prove them wrong.', [
            N('She says so herself, soon. Anger can keep a person going for a very long time.'),
          ]),
          opt('Both, and maybe a bit embarrassed.', [
            N('A thoughtful answer. Big feelings often come mixed together.'),
          ]),
        ],
        'Imagined the feelings of someone who was not believed.',
      ),
    ],
  ),
  // ------------------------------------------------ step 8
  scene(
    's24-cage',
    [
      AU(
        'I came down off this ridge with one striped feather and a story. The papers called me a liar in letters this high.',
        'angry',
      ),
      AU('So I came back up to prove it. I’ve been proving it ever since.', 'sad'),
      N(
        'Behind the tarpaulin is a cage of bent ash and wire, beautifully made, and big enough for a bird taller than Nova.',
      ),
      AU(
        'For the bird. Your girl’s name for it is better than mine. I’ve called it Proof for fifty years.',
        'think',
      ),
      AU('One night in that, down in the valley square where everyone can see. Then I can stop.'),
      NO('Stop what?', 'soft'),
      AU('Being the liar on the ridge. Being up here. Being…', 'angry'),
      N(
        'She doesn’t finish. She folds a net over her arm, carefully, the way you fold a shirt somebody ironed for you.',
      ),
      TI('You can’t put Sir Reginald in a CAGE. That’s the worst rule I ever heard.', 'angry'),
      AU('I didn’t make the rule, child. The papers did.', 'sad'),
      AU(
        'It comes down to drink at the spring above the camp at dusk. It always has. Tonight I shall be ready.',
      ),
      AU('And keep that lantern dark. One match and it’s gone for a week.', 'angry'),
    ],
    [
      ask(
        2,
        'science',
        'why a cage is no home for a wild bird',
        'K-ESS3-1',
        [N('Even a beautiful cage is a bad place for a wild bird. Why?')],
        [
          opt(
            'It can’t find its own food, roam, or look after its young.',
            [
              N(
                'Yes. A wild animal’s home is its whole habitat: its food, its space and its family. A cage holds none of those.',
              ),
            ],
            true,
          ),
          opt('Because the cage isn’t pretty enough.', [
            N('This one is very well made! The problem isn’t the look.'),
            N(
              'A wild bird needs its own food, room to roam and its family. A cage holds none of those.',
            ),
          ]),
        ],
        'Learned that wild animals need their whole habitat, not just shelter.',
      ),
      ask(
        10,
        'social-studies',
        'fairness: does one unfairness justify another?',
        'D2.Civ.8.K-2',
        [N('Fairweather was treated unfairly. Does that make it fair to put the bird in a cage?')],
        [
          opt('No. The bird didn’t do anything to her.', [
            N('That’s a strong point. Being hurt doesn’t give us the right to hurt someone else.'),
          ]),
          opt('It’s not fair, but I understand why she wants to.', [
            N(
              'That’s a fair answer. You can understand someone and still disagree with what they mean to do.',
            ),
          ]),
          opt('Maybe, if it’s only for one night.', [
            N(
              'That’s honest. Tilly would argue! Ask yourself: what would one night cost the bird, and her chicks?',
            ),
          ]),
        ],
        'Thought about fairness: whether being treated unfairly makes it fair to do something unfair.',
      ),
    ],
    [
      {
        id: 'argue',
        label: 'Tell her the bird doesn’t owe anyone proof.',
        set: { 's24-cage': 'argue' },
        then: [AU('Nor did I. They wanted it anyway.', 'sad')],
      },
      {
        id: 'sit',
        label: 'Say nothing. Sit down near the cage.',
        set: { 's24-cage': 'sit' },
        then: [
          N(
            'You sit down near the cage. Fairweather watches you do it, and something in her face goes tired.',
          ),
        ],
      },
    ],
  ),
  scene(
    's24-net',
    [
      N('Dusk. The bird comes down to the spring, all stripes and stilts, and bends to drink.'),
      N(
        'The net goes over it with a sound like a sail filling. Fairweather is faster than anyone that old has a right to be.',
      ),
      N(
        'The bird bolts up the ridge into the dark, dragging net and old woman both. Tilly is after them before anyone can catch her collar.',
      ),
      N('Nova lunges after Tilly. Her pack swings, slides on the wet rock, and goes towards the drop.'),
      N('She grabs the pack. She grabs it with both arms.'),
      N('When she looks up, Tilly is gone into the dark.'),
    ],
    [
      notice(
        5,
        'sel',
        'if you are lost, stay put and make a noise',
        'CASEL: Responsible decision-making',
        [
          N(
            'If you ever get lost, the safest thing is to stop where you are and make a noise, like a whistle or a shout.',
          ),
          N('People find you much faster when you stay still. Tilly, as it turns out, knows this.'),
        ],
        'Learned what to do if lost: stay where you are and make a noise so people can find you.',
      ),
    ],
  ),
  // ------------------------------------------------ step 9
  scene(
    's24-rock',
    [
      N('Nova sits down on the rock with the pack in her arms, and doesn’t move.'),
      N(
        'Your Nubbin is off up the ridge into the dark before you can call it. A moment later it comes back, calm, and sits at your feet.',
      ),
      N(
        'Then, from high up the ridge, a whistle: two fingers, rising at the end. Hazel’s supper call.',
      ),
      TI('I’M FINE. I’M WITH SIR REGINALD. NOBODY COME, YOU’LL SCARE HIM.', 'angry'),
      NO('She’s all right. She’s all right.', 'shock'),
      NO('I grabbed the pack. Tilly was right there, and I grabbed the pack.', 'sad'),
      N(
        'It is too dark for the ridge path now, and too steep to hurry on. The whistle comes again, cross and steady.',
      ),
      N('You sit down next to Nova, and you don’t say anything. You wait.'),
    ],
    [
      ask(
        5,
        'sel',
        'mistakes don’t make someone a bad person',
        'CASEL: Self-awareness',
        [N('Nova grabbed the pack, not Tilly. Does that make her a bad person?')],
        [
          opt('No. People grab without thinking when they’re frightened.', [
            N('That’s true. A mistake made in a frightened second doesn’t decide who you are.'),
          ]),
          opt('It was a mistake, and she knows it.', [
            N('Yes. Feeling bad about it shows she cares. What matters is what she does next.'),
          ]),
          opt('I think she should have grabbed Tilly.', [
            N(
              'That’s a fair thing to think, and Nova thinks it too. Owning a mistake is the first step to putting it right.',
            ),
          ]),
        ],
        'Thought about mistakes, guilt and what makes someone a good person.',
      ),
    ],
  ),
  scene(
    's24-light',
    [
      N(
        'You light Hazel’s lantern. It comes up small and gold, and the rock and the pack and Nova’s face come out of the dark.',
      ),
      N(
        'The light makes a small gold room in the dark, just big enough for two people and a Nubbin.',
      ),
      N(
        'You put it in her hands, and she holds it a long time. Then she sets the pack down, so she can hold it properly.',
      ),
      NO(
        'I’ll read her list. I always read her list when it’s bad. It’s the only thing that works.',
        'soft',
      ),
      N('Up the ridge, the whistle comes again, cross and steady.'),
      N('She opens the atlas from the wrong end. The back pages fall open in the lantern light.'),
    ],
    [
      notice(
        0,
        'science',
        'a flame changes stored energy into light and heat',
        '4-PS3-2',
        [
          N(
            'A lantern flame turns the energy stored in its fuel into light and heat. That’s why the glass grows warm while it glows.',
          ),
        ],
        'Learned that a flame changes stored energy into light and heat.',
      ),
    ],
  ),
  // ------------------------------------------------ step 10
  scene(
    's24-back-pages',
    [
      N(
        'The back pages are in pencil too, in an older hand than the list. It doesn’t press so hard now.',
      ),
      NO(
        'These aren’t mine. I never… I never turned to the back. Why would you turn to the back?',
        'think',
      ),
      NO('“Nova came. Twelve, all knees. Gave her the book. She’ll never bring it back. Good.”'),
      NO('“Nova came. Tea (refused).”'),
      N('She laughs. It comes out wrong.'),
      NO(
        '“Nova came. Brought a shell. Tea (refused).” “Nova came. Took the shell back. Tea (refused).”',
        'soft',
      ),
      NO(
        'She left my pack by her door while I walked the valley. She must have taken this out and written in it. Every time.',
      ),
      N(
        'Pages of it: rain, frost, Fern’s trees, the weather, and who came to the gate, and who didn’t.',
      ),
      NO('“Sun. Moss sat on my foot all afternoon. Got nothing done. Best day this year.”', 'soft'),
      NO(
        '“Nova came. Taller. Ticked off a sea. Tea (refused). Don’t mind. She’ll stop for tea when she’s ready.”',
      ),
      NO(
        '“Nova came. I nearly told her what the doctor said. Didn’t. She’d have stayed, and hated it, and so would I.”',
        'sad',
      ),
      N(
        'Nova can’t read the last one out. She turns the book round and holds the lantern so you can see.',
      ),
      H('“Thank you for every bit of it. Now off you go, and find somewhere new!”', 'soft'),
      N('Nova cries. All of it, at once, with her whole face, the lantern shaking in her hands.'),
    ],
    [
      notice(
        3,
        'sel',
        'keeping a memory book for someone',
        'CASEL: Relationship skills',
        [
          N('Hazel kept a diary in the back of Nova’s book: a line or two about ordinary days.'),
          N(
            'Small notes like these, about weather and visits, become a memory book. Someone can open it years later and find they were loved.',
          ),
        ],
        'Learned how a diary of small, ordinary moments can become a memory book for someone.',
      ),
    ],
  ),
  scene(
    's24-crying',
    [
      N(
        'Your Nubbin climbs into her lap, on top of the book, and leans its whole weight against her.',
      ),
      N(
        'You keep still. Up the ridge, every so often, the supper whistle comes, cross and steady, and nobody hurries anything.',
      ),
      N('It takes as long as it takes. Then a little longer.'),
      N(
        'Grief is the big sadness after someone dies. It comes in waves, and crying is one of the ways it moves through.',
      ),
      N('Nobody tells Nova to stop, or says it will be all right. You just stay.'),
      NO('“Tea (refused).” Every time. She wrote it down every time.', 'soft'),
    ],
    [
      ask(
        4,
        'sel',
        'helping someone who is grieving',
        'CASEL: Relationship skills',
        [N('What helps most when someone is grieving?')],
        [
          opt(
            'Staying close, and letting them take their time.',
            [N('Yes. You don’t have to fix it. Being there, and not hurrying them, is the help.')],
            true,
          ),
          opt('Changing the subject quickly, to cheer them up.', [
            N('That comes from a kind place! But hurrying sadness can make it feel unwelcome.'),
            N('Staying close, and letting them take their time, helps more.'),
          ]),
        ],
        'Learned that being present and patient is one of the best ways to help someone who is grieving.',
      ),
    ],
  ),
  // ------------------------------------------------ step 11
  scene(
    's24-cairn',
    [
      N(
        'When she has finished, Nova wipes her face on her sleeve, both sides, thoroughly, like someone cleaning a window.',
      ),
      NO(
        'She didn’t want me carrying her about. She wanted me to go and get rained on somewhere new.',
        'soft',
      ),
      N('She opens the pack and empties it onto the rock, carefully, one thing at a time.'),
      N(
        'A tin cup, a scarf a sleeve too long, a shell, and bundles of postcards in string, in two hands, going both ways.',
      ),
      NO('I’m leaving them here. Up here, where she never got to. On the way to the Shelf.'),
      N(
        'You build a cairn together by lantern light, flat stones first. Every thing she puts in, she puts in properly.',
      ),
      NO('She’d say I was being dramatic.', 'think'),
      Y('She’d be right.'),
      NO('She would. She’d be insufferable about it.', 'happy'),
      N(
        'With the cairn nearly done, Nova stops, with the last two things in her lap: the tin cup and the scarf.',
      ),
    ],
    [
      notice(
        5,
        'science',
        'balanced forces keep a stack standing',
        '3-PS2-1',
        [
          N(
            'A cairn stands because its forces balance. Wide, flat stones at the bottom spread the weight, and each stone sits flat on the one below.',
          ),
        ],
        'Learned how balanced forces and a wide base keep a stack of stones standing.',
      ),
      ask(
        9,
        'literacy',
        'theme: what we keep of someone',
        'RL.4.2',
        [N('What should Nova keep of Hazel, and what can she leave on the ridge?')],
        [
          opt('Keep one thing she’ll use. Leave the rest.', [
            N('That’s a practical answer. A thing you use every day keeps a person close.'),
          ]),
          opt('Keep the book. It has Hazel talking in it.', [
            N('That’s a lovely reason. Words can hold a person better than things.'),
          ]),
          opt('It doesn’t matter. She keeps Hazel anyway.', [
            N('That might be the deepest answer. What we carry of people isn’t really in a pack.'),
          ]),
        ],
        'Thought about the story’s question: what we keep of someone we love.',
      ),
    ],
    [
      {
        id: 'cup',
        label: '“Keep the tin cup.”',
        set: { 's24-cairn': 'cup' },
        then: [NO('For tea. Which I’ll have, from now on. Whenever it’s offered.', 'soft')],
      },
      {
        id: 'scarf',
        label: '“Keep the scarf.”',
        set: { 's24-cairn': 'scarf' },
        then: [
          NO(
            'It’s too long. It was always too long. She said I’d grow into it. I didn’t.',
            'happy',
          ),
          N('She puts it round her neck anyway, twice, and there is still some left over.'),
        ],
      },
      {
        id: 'book',
        label: '“Leave them both. Keep the book.”',
        set: { 's24-cairn': 'book' },
        then: [NO('Just the book. Yes. It’s the only one with her in it, talking.', 'soft')],
      },
    ],
  ),
  scene(
    's24-cairn-done',
    [
      N(
        'The pack is empty. Nova picks it up with one finger, and it swings, and she laughs at it.',
      ),
      NO('Oh. Oh, that’s much better.'),
      N('A weight off her shoulders, people would say. For once it is true both ways.'),
      N('Your Nubbin climbs onto the top of the cairn and sits there like a small, proud flag.'),
      N('Up the ridge the whistle comes again. This time it sounds fed up.'),
      NO('Right. Let’s go and fetch our stowaway.', 'happy'),
    ],
    [
      ask(
        2,
        'literacy',
        'figurative language: a weight off your shoulders',
        'L.4.5',
        [N('“A weight off your shoulders” usually isn’t about a real weight. What does it mean?')],
        [
          opt(
            'Feeling relieved, as if a worry has gone.',
            [
              N(
                'Yes. Nova has put down a real weight and a worry at the same time. That’s why it’s “true both ways”.',
              ),
            ],
            true,
          ),
          opt('Having very strong shoulders.', [
            N('Ha! Not quite. It means feeling relieved, as if a worry has gone.'),
            N('Nova put down a real weight and a worry at the same time.'),
          ]),
        ],
        'Explained the meaning of a figurative phrase.',
      ),
    ],
  ),
  // ------------------------------------------------ step 12
  scene(
    's24-whistle',
    [
      N(
        'You go on up towards the whistle with the lantern held low, so it lights the path and doesn’t dazzle anything.',
      ),
      N(
        'Your Nubbin runs ahead into the dark, and back, and ahead, as if it is pulling you along on a string.',
      ),
      N(
        'Nova’s empty pack slaps on her back. Every few steps she turns to check the cairn is still there, a pale heap in the dark.',
      ),
      NO('It’s fine. It’s just stones. I know it’s just stones.', 'think'),
      N('The whistle again, much closer, and very fed up.'),
      TI('I CAN SEE YOUR LANTERN. YOU’RE GOING THE LONG WAY.', 'angry'),
    ],
    [
      notice(
        5,
        'science',
        'sound is energy carried by vibrations',
        '4-PS3-2',
        [
          N(
            'Sound is energy carried by vibrations in the air. It spreads out as it travels, so it fades with distance. Louder means nearer.',
          ),
        ],
        'Learned that sound is energy carried by vibrations, and fades with distance.',
      ),
    ],
  ),
  nestScene('s24-nest-fed', 'fed'),
  // ------------------------------------------------ step 13
  scene(
    's24-edge',
    [
      N(
        'At the edge of the overhang, where the rock stops and the dark begins, somebody says, quite calmly, “I wonder if anyone might help.”',
      ),
      N(
        'Augusta Fairweather is sitting at the very edge with one boot wound up in her own net. The net is caught on a spike of rock.',
      ),
      AU('Don’t hurry. Hurrying is how one gets into nets.', 'think'),
      AU(
        'I went after it in the dark. Fifty years of patience, thrown away in one evening. Rather a waste.',
      ),
      N(
        'You and Nova kneel on either side of her, and set the lantern down where it lights the knots.',
      ),
      NO('One loop at a time. Like her scarf, when it went wrong.', 'soft'),
    ],
    [
      ask(
        2,
        'sel',
        'slowing down to solve a problem',
        'CASEL: Self-management',
        [N('“Hurrying is how one gets into nets.” What does Fairweather mean?')],
        [
          opt(
            'Rushing causes mistakes. Slow and careful works better.',
            [N('Yes. Tangles, sums and arguments all go better with slow hands.')],
            true,
          ),
          opt('Nets are only dangerous for fast people.', [
            N('It’s funnier than that! She means rushing causes mistakes.'),
            N('She rushed after the bird, and got tangled. Slow and careful works better.'),
          ]),
        ],
        'Thought about how slowing down helps solve problems.',
      ),
    ],
  ),
  scene(
    's24-proof',
    [
      N(
        'Nobody hurries, and nobody falls. Your Nubbin sits on the end of the net so it can’t slide, and the last loop comes free.',
      ),
      N(
        'Fairweather tries to stand, and can’t, and sits back against the rock. She is very tired, and very old.',
      ),
      AU('I shall just sit, I think. For a moment.'),
      N(
        'So she sits, and waits, and so do you all. The mother bird steps out from the nest and walks past her, close enough to touch.',
      ),
      N(
        'Fairweather’s hand comes up off her knee and stays in the air a moment. Then it goes back down.',
      ),
      AU('That’ll do. That’s proof enough for me.', 'soft'),
      N(
        'She takes an old striped feather out of her hatband, the one the papers laughed at, and puts it in your hand.',
      ),
      AU(
        'I shan’t need it now. Go and see your sunrise. I’ve seen eighteen thousand. I’ll mind the children.',
        'happy',
      ),
    ],
    [
      ask(
        4,
        'literacy',
        'a character’s change of heart',
        'RL.3.3',
        [N('Fairweather’s hand stops in the air. Why do you think she doesn’t touch the bird?')],
        [
          opt('Seeing it up close was enough. She didn’t need anyone else to believe her.', [
            N('That fits what she says next. The proof she needed was for herself.'),
          ]),
          opt('She didn’t want to frighten the mother away from her chicks.', [
            N(
              'A kind reason. She’s been watching this bird for fifty years. She knows it better than anyone.',
            ),
          ]),
          opt('She was too tired.', [
            N(
              'She is very tired! But her hand came up and went down on purpose. Something changed in her.',
            ),
          ]),
        ],
        'Thought about why a character changes her mind.',
      ),
      ask(
        7,
        'maths',
        'estimating with large numbers',
        null,
        [
          N(
            '“I’ve seen eighteen thousand.” A year has 365 sunrises. About how many are there in 50 years?',
          ),
        ],
        [
          opt(
            'About 18,000',
            [N('Yes. 365 times 50 is 18,250. She’s been counting, or near enough.')],
            true,
          ),
          opt('About 1,800', [
            N('That would be only about 5 years. 365 times 50 is 18,250: about 18,000.'),
          ]),
          opt('About 180,000', [
            N('That would be about 500 years! 365 times 50 is 18,250: about 18,000.'),
          ]),
        ],
        'Estimated a large product (365 × 50 ≈ 18,000).',
      ),
    ],
  ),
  // ------------------------------------------------ step 14
  scene(
    's24-shelf',
    [
      N(
        'The Sunrise Shelf is ten minutes on from the nest: a flat ledge of rock on the far ridge, with nothing in front of it but air.',
      ),
      N(
        'You get there in the last of the dark. The valley below is one big blue shadow with nothing in it you can name.',
      ),
      TI('Is this it? It’s just dark. I was promised a whole valley.', 'think'),
      NO('Wait. That’s the whole trick of it. You wait.', 'soft'),
      N('Nova gives you back Hazel’s lantern.'),
      NO('You do it. She’d want it to be you. She’d pretend she wanted it to be anybody.', 'soft'),
      N(
        'The sky over the far rim is going thin and pale, the way milk goes when you pour it into tea.',
      ),
    ],
    [
      doIt(
        6,
        'science',
        'finding east, and the other compass points from it',
        '2-ESS2-2',
        'edu:point:compass:east',
        [
          NO(
            'The sun comes up in the east. Roughly, anyway: exactly east only in spring and autumn.',
            'think',
          ),
          NO(
            'Point to the pale sky. That’s east. Now, if you face east, north is on your left and south is on your right.',
          ),
          NO('West is behind you, where the sun will go down tonight.'),
        ],
        'Found east from the sunrise and worked out the other compass points.',
      ),
    ],
  ),
  lightsScene('s24-lights', false, false),
  // ------------------------------------------------ step 15
  tickScene('s24-tick', 'cup'),
  scene(
    's24-written',
    [
      N(
        'You write it in pencil, with the stub, which Tilly lends you on the strict understanding that it is hers.',
      ),
      N(
        'Then she borrows it straight back, and letters a badge for you on a bit of cereal box: HELPING SOMEONE SAD (ADVANCED).',
      ),
      TI('You were all right. For a grown-up.'),
      N('Nova reads your line upside down, and nods, as if you have passed something.'),
      N('You count the lines on the page. Twenty, and you have used one.'),
      N('Under your line there is room for a great many more.'),
    ],
    [
      ask(
        4,
        'maths',
        'subtraction within 20',
        '1.OA.A.1',
        [N('Twenty lines, and one used. How many are left for new places?')],
        [
          opt('19', [N('Yes. 20 take away 1 is 19. Nineteen more places to go.')], true),
          opt('21', [N('That would be one more line, not one fewer. 20 take away 1 is 19.')]),
        ],
        'Subtracted within 20.',
      ),
    ],
  ),
  // ------------------------------------------------ complete
  homeScene('s24-home', false),
];

const S24: EduQuest = {
  id: 'reader:s24',
  of: 's24',
  band: 'reader',
  title: 'The Adventure Book',
  goals: {
    's24-step1': {
      goal: 'Sit with Nova by Hazel’s flower on the hill.',
      hint: 'Nova is at the top of the western hill, by Hazel’s flower. Walk up and sit beside her.',
    },
    's24-step2': {
      goal: 'Look at the first pages of Nova’s atlas.',
      hint: 'Nova has the atlas open on her knees. Stay sitting beside her and look.',
    },
    's24-step3': {
      goal: 'Fetch Hazel’s lantern from its hook by the cottage door.',
      hint: 'It hangs on the hook by the cottage door. Tap it to take it down.',
    },
    's24-step4': {
      goal: 'Load Nova’s pack onto the carrier’s cart. Something under the tarp is giggling.',
      hint: 'The carrier’s cart waits at the end of the lane. Lift the tarp at the back.',
    },
    's24-step5': {
      goal: 'Climb the scree path beside the falls.',
      hint: 'Follow your Nubbin. It finds the dry stones; step where it steps.',
    },
    's24-step6': {
      goal: 'Something has stolen a lantern bun. Meet the thief without frightening it.',
      hint: 'Choose: hold out a bun on your flat hand, or sit down on the path and let it come to you.',
    },
    's24-step7': {
      goal: 'Follow the bird’s tracks up to the camp in the cloud.',
      hint: 'Three-toed tracks, very far apart. Your Nubbin will find the next one.',
    },
    's24-step8': {
      goal: 'Stay at the camp till dusk.',
      hint: 'Wait by the tarpaulin as the light goes. Keep Hazel’s lantern unlit for now.',
    },
    's24-step9': {
      goal: 'Light Hazel’s lantern and give it to Nova.',
      hint: 'Sit with her first. Then light the lantern and put it in her hands.',
    },
    's24-step10': {
      goal: 'Stay with Nova. Let it take as long as it takes.',
      hint: 'Don’t hurry her, and don’t move. There is no wrong amount of time.',
    },
    's24-step11': {
      goal: 'Help Nova build a cairn of Hazel’s things.',
      hint: 'Flat stones at the bottom. Nova will hand you each thing. Take your time.',
    },
    's24-step12': {
      goal: 'Follow Tilly’s whistle up the ridge by lantern light.',
      hint: 'Walk towards the whistle. Keep the lantern low so it doesn’t dazzle anything.',
    },
    's24-step13': {
      goal: 'Free Fairweather’s boot from her net, one loop at a time.',
      hint: 'Work from the outside in. Your Nubbin will sit on the net’s end so it can’t slide.',
    },
    's24-step14': {
      goal: 'Set Hazel’s lantern, lit, on the Sunrise Shelf as the sun comes up.',
      hint: 'Put it on the lip of the rock, facing the Grove. Then wait for the sun.',
    },
    's24-step15': {
      goal: 'Write the first line on the atlas’s last page.',
      hint: 'Choose what to write, then write it with Hazel’s pencil stub.',
    },
  },
  scenes: S24_SCENES,
  glossary: [
    gloss('memorial', 'Something that helps people remember a person who has died.', 's24-tea'),
    gloss(
      'regret',
      'Wishing you had done something differently, when it is too late to change it.',
      's24-tea-done',
    ),
    gloss('atlas', 'A book of maps.', 's24-pages'),
    gloss(
      'stowaway',
      'Someone who hides on a cart, ship or plane to travel without being invited.',
      's24-stowaway',
    ),
    gloss('relieved', 'Glad because a worry has gone away.', 's24-stowaway-knows'),
    gloss('keepsake', 'A small thing you keep to help you remember someone.', 's24-pack'),
    gloss(
      'scree',
      'A slope of loose, broken stones at the bottom of a cliff or on a mountainside.',
      's24-falls-top',
    ),
    gloss('telescope', 'A tube with lenses that makes faraway things look closer.', 's24-tracks'),
    gloss('explorer', 'Someone who travels to unknown places to find out about them.', 's24-camp'),
    gloss('motto', 'A short saying that sums up what a person or group believes.', 's24-camp'),
    gloss('proof', 'Facts or evidence that show something is true.', 's24-cage'),
    gloss('dusk', 'The dim time of evening just after the sun has set.', 's24-net'),
    gloss('diary', 'A book where you write about what happens each day.', 's24-back-pages'),
    gloss('grief', 'The deep sadness people feel when someone they love dies.', 's24-crying'),
    gloss('cairn', 'A pile of stones built as a marker or a memorial.', 's24-cairn'),
    gloss(
      'insufferable',
      'So annoying, or so pleased with yourself, that people can hardly bear it. Often said fondly.',
      's24-cairn',
    ),
    gloss(
      'dazzle',
      'To shine so brightly in someone’s eyes that they can’t see properly.',
      's24-whistle',
    ),
    gloss(
      'overhang',
      'A part of a rock or cliff that sticks out over the space below.',
      's24-nest-fed',
    ),
    gloss('ledge', 'A narrow, flat shelf of rock.', 's24-shelf'),
    gloss('margin', 'The blank space round the edge of a page.', 's24-home'),
    gloss(
      'wick',
      'The string in a lamp or candle that soaks up fuel and holds the flame.',
      's24-lantern-corvin',
    ),
    gloss(
      'plaque',
      'A flat sign, often on a wall, that tells people about something.',
      's24-lecture',
    ),
  ],
  notes:
    'Every scene of SIDE_STORY_S24 has a reader version here; the 23 variants are in EDU_S24_READER_VARIANTS and ' +
    'replace or insert exactly as the main quest’s notes say. Every choice keeps its id and set. Think questions (no ' +
    'best answer): s24-tea-done, s24-badges, s24-camp, s24-cage (fairness), s24-rock, s24-cairn, s24-proof, s24-tick*, ' +
    'and several variants. The tracks are given as about two metres apart, and the postcards as 200 at about 5 grams, ' +
    'for the maths; the main script gives no numbers. The keptStone line swaps (the stilled Nubbin walks instead of ' +
    'runs) are not mirrored in this band.',
};

// ================================================================== variants
const S24_VARIANTS: EduScene[] = [
  // ---------------------------------------------------------------- (1) step 1 scene, by walk
  scene(
    's24-tea-moss',
    [
      ...TEA_OPEN,
      TEA_SIT,
      N(
        'Moss is on the flat stone by the path, where he always sits. He watches Nova sit down, and then he climbs your leg, slowly.',
      ),
      M('I’m coming. Wherever this is going.', 'think'),
      M('Don’t look like that. I’ve decided.', 'soft'),
      N('He settles on your shoulder, light as a hat, and shuts his eyes.'),
      TEA_RUN,
      ...TEA_CLOSE,
    ],
    [
      ask(
        9,
        'literacy',
        'what a character’s words show about them',
        'RL.3.3',
        [N('“Don’t look like that. I’ve decided.” What does this tell you about Moss?')],
        [
          opt(
            'He has made up his own mind, and won’t be talked out of it.',
            [
              N(
                'Yes. Moss chooses rarely, and when he does, it’s settled. Rather like the day he chose Hazel.',
              ),
            ],
            true,
          ),
          opt('Somebody told him he had to come.', [
            N('Nobody tells Moss anything! “I’ve decided” means the choice is his own.'),
          ]),
        ],
        'Used a character’s words to describe his personality.',
      ),
    ],
  ),
  scene(
    's24-tea-moss-stayed',
    [
      ...TEA_OPEN,
      N(
        'Beside Hazel’s flower, so close the two of them lean together, is a small grey-green one by the flat stone where Moss always sat.',
      ),
      N('Moss faded up here, beside her, which means he died. His flower came up close to hers.'),
      N(
        'There is just room between them for one person, if she tucks her knees up. Nova does, pack and all.',
      ),
      NO('Both of you. Right. I’ll sit in the middle and not take sides.', 'sad'),
      TEA_RUN,
      ...TEA_CLOSE,
    ],
    [
      notice(
        9,
        'sel',
        'humour as a way of coping',
        'CASEL: Self-awareness',
        [
          N(
            'Nova misses two people at once, so she makes a small joke. A joke can make a sad moment a little lighter.',
          ),
        ],
        'Noticed that people sometimes use humour to cope with sad feelings.',
      ),
    ],
  ),
  scene(
    's24-tea-sable',
    [
      ...TEA_OPEN,
      TEA_SIT,
      N(
        'Sable comes up the path behind you and sits down two steps from Nova, facing the far ridge.',
      ),
      NO('Hello, grey one. That’s where I came from. Are you thinking of going?', 'soft'),
      N('Sable says nothing. Her ears stay up.'),
      TEA_RUN,
      ...TEA_CLOSE,
    ],
    [
      notice(
        9,
        'science',
        'animals use their ears to gather information',
        '4-LS1-2',
        [
          N(
            'Many animals can turn their ears towards a sound. Ears held up and forward usually mean an animal is alert and paying attention.',
          ),
        ],
        'Learned how animals use their ears, and what ear positions can tell us.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- (1a) insert: keptStone, walk not moss
  scene(
    's24-moss-kept',
    [
      N(
        'Higher up, on the crown of the hill, Moss sits with his back to the Grove, the way he has sat since the Long Night.',
      ),
      NO('Hello, Moss.', 'soft'),
      N(
        'He doesn’t turn round. After a while Nova stops waiting for him to, and looks at the flower instead.',
      ),
      N('Some sadness looks like tears. Some looks like a back turned to everyone.'),
      NO('…I’ll sit with you later, then.', 'soft'),
      N('Moss doesn’t answer. But he doesn’t move away, either.'),
    ],
    [
      ask(
        2,
        'sel',
        'giving someone space',
        'CASEL: Social awareness',
        [N('Nova stops waiting for Moss to turn round. Was that the right thing to do?')],
        [
          opt('Yes. He might need space.', [
            N('That’s thoughtful. Giving space can be a kindness, as long as the door stays open.'),
          ]),
          opt('No. She should keep trying.', [
            N('That’s caring too. Notice she says she’ll come back later. She does a bit of both.'),
          ]),
          opt('I’m not sure.', [
            N(
              'That’s honest. It’s a hard one. Sometimes you only find out by trying gently, and watching.',
            ),
          ]),
        ],
        'Thought about when to give someone space and when to keep trying.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- (2) step 3 scene: walk = corvin
  scene(
    's24-lantern-corvin',
    [
      ...LANTERN_ASK,
      N(
        'It is Sunday, so Corvin is by the pond with Fern’s pie dish, washed, with a pie in it, saying nothing, badly.',
      ),
      N('He gets up when he sees where you are looking.'),
      N(
        'Hazel’s lantern hangs on the hook by the cottage door. He takes it down before you can, the way he does every Sunday.',
      ),
      N(
        'He trims the wick with a penknife. His hands are steady now; he takes a long time about it, and doesn’t apologise.',
      ),
      C('The far ridge. For the sunrise.', 'think'),
      N('He holds it out to you. When you take hold of it, he doesn’t let go straight away.'),
      C('Bring it back lit.', 'soft'),
    ],
    [
      ask(
        8,
        'literacy',
        'reading a character’s words for hidden meaning',
        'RL.3.3',
        [N('Why do you think Corvin says “Bring it back lit”, not just “Bring it back”?')],
        [
          opt('A lit lantern would mean the trip went well.', [
            N('That fits. A light still burning is a good sign: nobody gave up.'),
          ]),
          opt('He wants Hazel’s light kept going.', [
            N('A lovely reading. He looked after her lantern every Sunday. It matters to him.'),
          ]),
          opt('He’s just fussy about lanterns.', [
            N('He might be! But he holds on a moment too long. There’s more in it than fuss.'),
          ]),
        ],
        'Looked for the meaning behind a character’s short words.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- (3) step 4 scene: s14Done
  scene(
    's24-stowaway-knows',
    [
      ...STOW_OPEN,
      N(
        'Then the tarp lifts, and a girl in big wellies, with a sash of home-made badges, sits up among the sacks and points at you.',
      ),
      TI('It’s you. From Keeps & Critters. You sat next to the dragon.', 'happy'),
      ...STOW_LAW,
      N(
        'Sparks comes down the lane at a run, waving both arms, and slows right down when she sees who Tilly has found.',
      ),
      SP(
        'Oh, it’s YOU. Fine. Good. Take her. Bring her back with the same number of wellies.',
        'happy',
      ),
    ],
    [
      ask(
        8,
        'literacy',
        'how a character’s feelings change',
        'RL.2.3',
        [
          N(
            'How does Sparks feel when she starts running, and how does she feel when she sees who found Tilly?',
          ),
        ],
        [
          opt(
            'Worried at first, then relieved.',
            [
              N(
                'Yes. She runs flat out, then slows right down. Her body shows the change before she speaks.',
              ),
            ],
            true,
          ),
          opt('Cross the whole time.', [
            N('She might be a bit cross with Tilly! But watch her slow down.'),
            N('She goes from worried to relieved when she sees Tilly is with someone she trusts.'),
          ]),
        ],
        'Described how a character’s feelings change, using clues from the text.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- (4) inserts before s24-pack, by ending
  scene(
    's24-bun-moss',
    [
      N(
        'Before the cart goes, Nova climbs back up the hill on her own, with one of Fern’s lantern buns.',
      ),
      N(
        'She puts it on the flat stone where Moss always sat, by his flower, and stands there with her hands in her pockets.',
      ),
      N(
        'Moss faded, which means he died, and he isn’t coming back. His flower is how the valley keeps him.',
      ),
      NO(
        'He told me once I walked like someone being chased. I said I was. He said, “By what?” I never answered.',
        'soft',
      ),
      NO('I’ll tell him when I get back.'),
      N('Lots of people talk to someone who has died. It doesn’t need an answer to help.'),
    ],
    [
      ask(
        3,
        'literacy',
        'inferring a character’s feelings',
        'RL.3.3',
        [N('Nova “walked like someone being chased”. What do you think was chasing her?')],
        [
          opt('Sadness she didn’t want to stop and feel.', [
            N('That fits this whole story. Stopping for tea might have meant feeling things.'),
          ]),
          opt('Wanting to see absolutely everything.', [
            N('That’s true of Nova too. Hazel’s list sent her everywhere.'),
          ]),
          opt('Being lonely.', [N('A thoughtful answer. Remember: “I never had anyone to take.”')]),
        ],
        'Inferred what lies behind a character’s behaviour.',
      ),
    ],
  ),
  scene(
    's24-eternal-watch',
    [
      N(
        'On the western hill your Eternal sits where it always sits, and watches the cart go, very carefully.',
      ),
      N('It doesn’t follow, and it doesn’t need to. It already knows which way you’ll come home.'),
      N('Eternals never grow old. It has all the time in the world to wait for you.'),
      N('You wave. It doesn’t wave back, exactly; it blinks, slowly, which is the same thing.'),
      N('The cart turns the corner, and the hill goes out of sight.'),
      N('Nova settles against her pack and shuts her eyes.'),
    ],
    [
      notice(
        2,
        'science',
        'every living thing has a life cycle',
        '3-LS1-1',
        [
          N('An Eternal never ages, and that makes it very rare.'),
          N(
            'Real plants and animals all have a life cycle: they are born, grow, may have young, and die.',
          ),
          N('That cycle is part of what makes each life precious.'),
        ],
        'Learned that all real living things have a life cycle, and told a made-up creature from real ones.',
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
  scene(
    's24-shelf-moss',
    [
      N(
        'Moss has slept on your shoulder most of the way up. He wakes now, and looks for a long time without saying anything.',
      ),
      M(
        'Forty years I sat on that hill and looked at this ridge. I never once thought to look back the other way.',
        'soft',
      ),
      M('She’d have liked it. She’d have talked all the way through it.', 'happy'),
      N('You look back the way he is looking: the western hill, the flat stone, very small.'),
      N('Seeing a place from far away can make you see it new.'),
      N('Moss shuts his eyes again, but he doesn’t sleep.'),
    ],
    [
      ask(
        1,
        'literacy',
        'point of view',
        'RL.3.6',
        [N('Moss only ever looked one way. Is there something you have only seen from one side?')],
        [
          opt('A place I’ve only seen from inside.', [
            N('Try it from outside sometime. Moss would approve.'),
          ]),
          opt('An argument, from my side only.', [
            N('That’s a brave answer. The other side often looks different from over there.'),
          ]),
          opt('A person I think I know well.', [
            N('Lovely. People can surprise you, like Hazel at nineteen.'),
          ]),
        ],
        'Thought about how a different point of view can change what we see.',
      ),
    ],
  ),
  scene(
    's24-shelf-sable',
    [
      N('Sable has walked two steps ahead of you the whole way up, waiting at every bend.'),
      N(
        'Now she sits at the very edge of the Shelf, facing the Grove, and the sun comes up on her too.',
      ),
      N('She stays grey. She looks warm anyway.'),
      N('Nova sits a little way off, and doesn’t make a fuss of her. Sable seems to like that.'),
      N('Down in the valley the light reaches the Grove, and her ears come up.'),
      N('Then she lies down, chin on her paws, and watches it all.'),
    ],
    [
      ask(
        2,
        'literacy',
        'words with more than one meaning: warm',
        'L.4.5',
        [N('“She stays grey. She looks warm anyway.” What kind of “warm” is this?')],
        [
          opt(
            'Warm as in content and safe, not just the temperature.',
            [
              N(
                'Yes. Her colour hasn’t changed, but something inside her has settled. That’s “warm” used figuratively.',
              ),
            ],
            true,
          ),
          opt('Warm as in hot from the sun.', [
            N('The sun is on her, so that’s true too!'),
            N(
              'But the line means more: she looks content and safe. That’s “warm” used figuratively.',
            ),
          ]),
        ],
        'Explained a word used with a figurative meaning.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- (8) step 15 scene, by s24-cairn
  tickScene('s24-tick-scarf', 'scarf'),
  tickScene('s24-tick-book', 'book'),
  // ---------------------------------------------------------------- (9) complete: eternal-dawn
  homeScene('s24-home-eternal', true),
  // ---------------------------------------------------------------- (9a) insert after complete: walk = corvin
  scene(
    's24-home-corvin',
    [
      N(
        'Corvin is by the pond when you come in, though it isn’t Sunday. He looks at the lantern, lit in broad daylight.',
      ),
      C('Good.', 'soft'),
      N('He hangs it back on its hook himself, and doesn’t trim the wick. It doesn’t need it.'),
      N(
        'A promise kept is a small thing. It is also how trust gets built, one small thing at a time.',
      ),
      N('Your Nubbin sits under the hook and looks up at it, the way it did before.'),
      N('Corvin stays by the pond until the light goes, which he never does on a weekday.'),
    ],
    [
      ask(
        1,
        'sel',
        'trust and keeping promises',
        'CASEL: Relationship skills',
        [N('Corvin says only “Good.” What do you think he means by it?')],
        [
          opt('Thank you for keeping your promise.', [
            N('Probably. For Corvin, one word can carry a lot.'),
          ]),
          opt('He’s glad everyone came home safe.', [
            N('A kind reading. A lit lantern means the night went well.'),
          ]),
          opt('He trusts you a bit more now.', [
            N('That might be the biggest meaning. Trust grows from small promises kept.'),
          ]),
        ],
        'Thought about how keeping promises builds trust.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- (10) later, at the museum: s18Done
  scene(
    's24-lecture',
    [
      N(
        'The museum is full, which it never is. Somebody has put out every chair, and some of the Nubbins have brought their own.',
      ),
      DE(
        'A lecture. Every plaque in this museum must be true. This one has taken fifty years to become so.',
        'happy',
      ),
      AU(
        'I was called a liar. I have been wrong about a great many things. I was not wrong about the bird.',
        'think',
      ),
      AU(
        'I shan’t tell you where she nests. That is the whole of the lecture. Thank you.',
        'happy',
      ),
      N(
        'Professor Delve hangs the new plaque himself, on tiptoe, with his spectacles on the end of his nose.',
      ),
      DE(
        '“A tall striped bird nests on the far ridge. Augusta Fairweather saw it first. She was right.”',
      ),
      DE('True. Entirely true. I checked.', 'soft'),
      N(
        'Everyone claps. Fairweather sits down rather suddenly, and doesn’t say anything for a while.',
      ),
    ],
    [
      notice(
        3,
        'science',
        'protecting the nests of rare birds',
        'K-ESS3-3',
        [
          N('Real wildlife experts often keep the nest sites of rare birds secret.'),
          N(
            'That way, nobody disturbs the parents or takes the eggs. Sometimes the kindest thing to share is nothing.',
          ),
        ],
        'Learned why the nest sites of rare birds are often kept secret.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_S24_READER: EduQuest[] = [S24];

/** Reader versions of every scene in SIDE_STORY_S24_VARIANTS. */
export const EDU_S24_READER_VARIANTS: EduScene[] = S24_VARIANTS;

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = ['edu:point:compass:east', 'edu:tell:ordinary-day'];
