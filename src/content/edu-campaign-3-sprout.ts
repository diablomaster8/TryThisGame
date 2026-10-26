/**
 * The Learning Grove, sprout band (ages 3–6, read aloud): Book Three, The Long Night.
 * Chapters 9–12, every end-* scene, and the end-epi-mill-* / end-epi-cinder-* epilogues from
 * side-stories-new-3.ts. Each scene here replaces the main scene with the same id (minus `sprout:`).
 * Rules: EDU-STYLE.md. Canon: STORY-BIBLE.md.
 *
 * Sprout notes for this book
 * - The Wellspring “keep the stone” choice is left out (defaultChoice: 'unmake').
 * - Corvin is a lonely, grumpy man who did a wrong thing long ago, and he says sorry.
 * - The Long Night is cosy-spooky: lanterns, counting, singing, the longest night of the year.
 * - Hazel is “Gran Hazel”. Her illness is told the EDU-STYLE way (“very poorly”, “the doctors can’t
 *   make her better”), and her death and Moss’s are said plainly, with comfort straight after.
 *   No death is ever called sleeping: the ending “Moss Sleeps” is titled “Moss’s Flower” here.
 */
import type { EduCampaign, EduDomain, EduScene, Lesson, LessonOption } from './types';
import type { Line, Choice } from '../config/story';

type Mood = Line['mood'];
const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

const N = say('narrator');
const YOU = say('you');
const MOSS = say('moss');
const SABLE = say('sable');
const CORVIN = say('corvin');
const HAZEL = say('hazel');
const FERN = say('fern');
const MARINA = say('marina');
const SPARKS = say('sparks');
const CLOVER = say('clover');
const LUNA = say('luna');
const EMBER = say('ember');
const BYTE = say('byte');
const DUSTY = say('dusty');
const NOVA = say('nova');
const WISP = say('wisp');
/** Everyone singing at once (the Lantern Song). A campaign speaker (BOOK3_SPEAKERS). */
const CHORUS = say('chorus');

type L = Omit<Lesson, 'id'>;

const scene = (
  of: string,
  lines: Line[],
  lessons: L[],
  extra: { choices?: Choice[]; defaultChoice?: string } = {},
): EduScene => ({
  id: `sprout:${of}`,
  of,
  band: 'sprout',
  lines,
  ...extra,
  lessons: lessons.map((l, i) => ({ id: `sprout:${of}-l${i + 1}`, ...l })),
});

const std = (standard?: string) => (standard ? { standard } : {});

const opt = (label: string, reply: Line[], best = false): LessonOption =>
  best ? { label, best, reply } : { label, reply };

const ask = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | undefined,
  prompt: Line[],
  options: LessonOption[],
  parentNote: string,
): L => ({ domain, skill, ...std(standard), kind: 'ask', after, prompt, options, parentNote });

const notice = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | undefined,
  lines: Line[],
  parentNote: string,
): L => ({ domain, skill, ...std(standard), kind: 'notice', after, lines, parentNote });

const doIt = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | undefined,
  check: string,
  lines: Line[],
  parentNote: string,
): L => ({ domain, skill, ...std(standard), kind: 'do', after, check, lines, parentNote });

// ================================================================ chapter 9: Corvin's Garden

// c9-open and its Collector-route twin c9-open-sold share these (as campaign-book3.ts does).
const C9_ARRIVE: Line[] = [
  N('Up, up the valley you go. Crunch, crunch goes the frost.'),
  N('Ember walks beside you. She is very quiet.'),
  N('Corvin’s garden is a big square. Everything is grey and cold.'),
  N('Grey Nubbins stand in rows. They do not play. They do not touch.'),
];

const C9_GARDEN: Line[] = [
  CORVIN('You came. Look how safe they are. Nobody here gets lost.'),
  EMBER('That’s Ash, in the third row. She was mine. She won’t look at me.', 'sad'),
  N('Corvin keeps his cold hand on his coat pocket. Always.'),
  CORVIN('Hazel came here in the autumn. She stood at my gate, and didn’t knock.', 'think'),
  CORVIN('Hazel’s Nubbins got hurt sometimes. Mine never do. I keep them still.'),
  N('What should we do? (Talk about it together.)'),
];

/** The third-row count, played after Ember's line (index `after`). */
const c9RowLesson = (after: number): L =>
  doIt(
    after,
    'maths',
    'ordinal numbers: first, second, third',
    'ELOF: Mathematics Development',
    'edu:tap:row:third',
    [
      N('Let’s find Ash. Count the rows with Ember.'),
      N('(Point and count together: first, second, third.)'),
      EMBER('There. The third row. That’s her.', 'soft'),
    ],
    'Your child used first, second and third to find a place in a line.',
  );

const C9_CHOICES: Choice[] = [
  {
    id: 'confront',
    label: 'Read him Gran Hazel’s notebook.',
    set: { corvin: 'reconciled' },
    friendship: { ember: 3, luna: 2 },
    then: [
      N('You read Gran Hazel’s words out loud.'),
      YOU('“The brown one let me touch her ear. Took two months. Worth it.”'),
      CORVIN('She told me that once. I didn’t want to wait.', 'sad'),
      N('Corvin opens the gate wide. He leaves it open.'),
      CORVIN('Ash can go, Ember. I’m sorry.', 'soft'),
      N('Ash walks out, slowly. Ember follows, gently, three steps behind.'),
    ],
  },
  {
    id: 'bargain',
    label: 'Buy Ash back with your Shells.',
    set: { corvin: 'bargained', boughtBack: true },
    friendship: { ember: 5 },
    then: [
      N('You count your Shells onto the cold gatepost. Clink, clink, clink.'),
      N('Ash walks out beside Ember. She is grey. She is going home.'),
      EMBER('Thank you. I’ll find a way to thank you properly.', 'soft'),
    ],
  },
  {
    id: 'force',
    label: 'Open every pen, right now.',
    set: { corvin: 'forced', freedByForce: true },
    friendship: { ember: 2, marina: -2, fern: -2 },
    then: [
      N('You open the latches. Click! Click! Click!'),
      N('The grey Nubbins don’t move. Then Ash takes one step.'),
      N('Then all of them run! Whoosh, off to the woods.'),
      CORVIN('They’ll be hungry out there! Who will feed them?', 'angry'),
      N('That is a fair question. They will need friends to help.'),
      EMBER('Ash looked at me. On her way past, she looked at me.', 'soft'),
    ],
  },
];

/* c9-open-sold's own choices (as campaign-book3.ts): C9_CHOICES with the same ids, sets and friendship, except that
 * bargain also buys back your old Nubbin, so it comes home on screen. */
const C9_CHOICES_SOLD: Choice[] = C9_CHOICES.map((c) =>
  c.id === 'bargain' && c.then
    ? {
        ...c,
        then: [
          ...c.then.slice(0, 1),
          CORVIN('And that one. Your old Nubbin. The Shells cover it.', 'think'),
          N('Your old Nubbin walks out behind Ash. It is coming home too.'),
          ...c.then.slice(1),
        ],
      }
    : c,
);

const C9: EduScene[] = [
  scene(
    'c9-partner',
    [
      N('It is night. A note slides under the door. Swish!'),
      N('The paper is cold. Brrr. It lived in a cold pocket.'),
      CORVIN('“Hello, partner. Come up the valley tomorrow.”'),
      CORVIN('“Come and see the Nubbin you sold me. It is very quiet now.”'),
      N('The note ends with two letters: C.V. That is Corvin Vale.'),
      N('Quiet. Is quiet the same as happy? You are not sure.'),
      N('You put the note in a drawer. Then you move it somewhere else.'),
    ],
    [
      ask(
        5,
        'sel',
        'quiet can mean calm or sad',
        'CASEL: Social awareness',
        [N('Your Nubbin is quiet when it naps.'), N('Is it quiet when it is sad, too?')],
        [
          opt('Yes. Quiet can be calm or sad', [N('Yes. Look at faces to tell which.'), N('A cosy face is calm. A droopy face is sad.')], true),
          opt('No. Quiet is always happy', [N('Not always. Sometimes quiet is sad.'), N('Look at the face to tell.')]),
        ],
        'Your child learned that being quiet can mean calm or sad, and that faces help us tell.',
      ),
    ],
  ),
  scene(
    'c9-open',
    [...C9_ARRIVE, ...C9_GARDEN],
    [
      c9RowLesson(5),
      ask(
        8,
        'sel',
        'reading feelings from faces and bodies',
        'CASEL: Social awareness',
        [N('Look at the grey Nubbins. Heads down. Very still.'), N('How do you think they feel?')],
        [
          opt('Quiet and sad', [N('Yes. They are safe, but they are not happy.'), N('Safe is not the same as happy.')], true),
          opt('Happy and playful', [N('Look again: no wiggles, no games. They look sad.'), N('Safe is not the same as happy.')]),
        ],
        'Your child read how someone feels from the way they look and move.',
      ),
    ],
    { choices: C9_CHOICES },
  ),
  // Collector route only (a save from the main game where a Nubbin was sold): c9-open plus the sold Nubbin.
  scene(
    'c9-open-sold',
    [
      ...C9_ARRIVE,
      CORVIN('You came. See the second row? Your old Nubbin. Safe and quiet now.'),
      ...C9_GARDEN.slice(1),
    ],
    [
      ask(
        4,
        'sel',
        'naming a sorry feeling, and knowing it can help',
        'CASEL: Self-awareness',
        [N('Your old Nubbin is in the second row. It does not look up.'), N('How do you feel?')],
        [
          opt(
            'Sad, or sorry',
            [N('That’s OK to feel. Sorry helps us do better.'), N('It’s not too late to help.')],
            true,
          ),
          opt('I don’t know', [
            N('That’s OK. Feelings can be muddly.'),
            N('It’s not too late to help.'),
          ]),
        ],
        'Your child named a sorry feeling and heard that it can help us put things right.',
      ),
      c9RowLesson(5),
    ],
    { choices: C9_CHOICES_SOLD },
  ),
  scene(
    'c9-shard-reconciled',
    [
      N('The garden is empty now. Corvin stands by the open gate.'),
      CORVIN('There is one more thing. A wrong thing I did, long ago.', 'sad'),
      N('He takes a little tin out of his coat pocket.'),
      N('The tin is fuzzy with frost. Brrr! It is so cold.'),
      CORVIN('I took this from Hazel’s garden. I’m sorry. Please take it home.', 'sad'),
      N('His hand is blue with cold. You take the tin.'),
      CORVIN('I haven’t been warm for a very long time.', 'soft'),
      N('He tucks his hands under his arms to warm them.'),
    ],
    [
      ask(
        5,
        'health',
        'keeping warm in cold weather',
        'ELOF: Perceptual, Motor, and Physical Development',
        [N('Corvin’s hands are freezing. What could help warm them?')],
        [
          opt('Gloves, or tucking them somewhere warm', [N('Yes! Gloves, pockets and armpits keep hands warm. Look, Corvin is trying it.')], true),
          opt('Holding a snowball', [N('Brrr! A snowball makes hands colder. Gloves and warm pockets help.')]),
        ],
        'Your child thought about how to keep the body warm in cold weather.',
      ),
    ],
  ),
  scene(
    'c9-shard-bargained',
    [
      N('Ember and Ash walk down the road. Corvin calls your name.'),
      CORVIN('Wait. Take this too.', 'think'),
      N('He throws you a little tin. You catch it. Gasp!'),
      N('It is so cold! It is fuzzy with frost.'),
      CORVIN('It never helped anything that mattered. Take it away.'),
      N('He wipes his hand on his coat, hard.'),
      CORVIN('Mind the ice on the road.'),
    ],
    [
      ask(
        6,
        'science',
        'ice is slippery, so we walk slowly on it',
        'ELOF: Scientific Reasoning',
        [N('Corvin says, “Mind the ice.” Why do we walk slowly on ice?')],
        [
          opt('Because ice is slippery', [N('Yes. Ice is smooth and slippery. Small, slow steps keep us on our feet.')], true),
          opt('Because ice is sticky', [N('Ice isn’t sticky, it’s slippery! Feet slide on it, so we go slowly.')]),
        ],
        'Your child learned that ice is slippery and how to move safely on it.',
      ),
    ],
  ),
  scene(
    'c9-shard-forced',
    [
      N('All the grey Nubbins are gone. Corvin sits on the cold ground.'),
      N('Bump! Everyone ran past him at once.'),
      N('Something fell out of his coat. A little tin.'),
      N('Frost grows out from it, white and sparkly.'),
      CORVIN('Leave that!', 'shock'),
      N('You pick it up. Brrr! So cold.'),
      CORVIN('…No. Keep it. I don’t want it any more.', 'sad'),
      EMBER('Don’t let that cold thing near Ash. Or anyone.', 'angry'),
      N('Ember holds your arm all the way to the road.'),
      N('On the way home, Ash follows Ember, three steps behind. Shh.'),
    ],
    [
      ask(
        8,
        'sel',
        'what helps when we feel worried',
        'CASEL: Self-management',
        [N('Ember is worried. She holds your arm.'), N('What helps when you feel worried?')],
        [
          opt('Holding a friend’s hand, and telling them', [N('Yes. Telling someone and holding on helps worries feel smaller.')], true),
          opt('Keeping it all inside', [N('Hiding a worry can make it feel bigger.'), N('Telling a friend, or holding a hand, helps.')]),
        ],
        'Your child named a helpful way to cope with a worried feeling.',
      ),
    ],
  ),
  scene(
    'c9-sable',
    [
      N('Sable is waiting at the gate. She waited here once before.'),
      N('This time she gets up and trots to meet you!'),
      N('Sniff, sniff. She sniffs your pocket, where the tin is.'),
      N('She does not run. She sits down and looks up at you.'),
      LUNA('She knows that cold. She knows it better than anyone.', 'soft'),
      N('Sable is brave tonight. You are brave too.'),
    ],
    [
      doIt(
        2,
        'science',
        'animals use their senses; many smell far better than people',
        'ELOF: Scientific Reasoning',
        'edu:copy:sniff:sable',
        [
          N('Sable finds out about things with her nose.'),
          N('Lots of animals, like dogs, can smell much better than people.'),
          N('(Take a big sniff, like Sable. What can you smell?)'),
        ],
        'Your child learned that animals use their senses, and tried smelling like one.',
      ),
    ],
  ),
  scene(
    'c9-close',
    [
      MARINA('The whole valley is talking about you. Fern says you were brave.'),
      N('On your step is a warm pie from Fern. Yum!'),
      N('Dusk. Moss waits by the hill. You can see the grass through him.'),
      MOSS('…Show me.'),
      N('You open the tin. Inside is a little dark stone, like ice.'),
      MOSS('Cinder made this long ago. She wanted to keep Nubbins safe.', 'sad'),
      MOSS('But it made them still and grey. Safe is not the same as happy.', 'sad'),
      MOSS('Put it under the long-grass lantern, for now.'),
      N('You put the tin under the post. Frost creeps up the glass.'),
      MOSS('In three nights comes the longest night. Then we take it back.', 'think'),
    ],
    [
      doIt(
        1,
        'maths',
        'sharing a circle into two equal halves',
        '1.G.A.3',
        'edu:share:pie:2',
        [
          N('Let’s share the pie with Marina.'),
          N('(Draw a line across the middle with your finger.)'),
          N('Two pieces, the same size. One for you, one for Marina!'),
        ],
        'Your child split a round pie into two equal halves to share it fairly.',
      ),
      ask(
        9,
        'science',
        'winter nights are long',
        '1-ESS1-2',
        [N('It is nearly midwinter.'), N('Is it dark for a long time at night, or a short time?')],
        [
          opt('A long time', [N('Yes. In winter the sun sets early and rises late.'), N('So the nights are long.')], true),
          opt('A short time', [N('Short nights come in summer.'), N('In winter the sun sets early and rises late. Long nights!')]),
        ],
        'Your child learned that winter nights are long and summer nights are short.',
      ),
    ],
  ),
];

// ================================================================ chapter 10: The Long Night

const C10: EduScene[] = [
  scene(
    'c10-open',
    [
      N('Today is the longest night of the whole year.'),
      N('The sun comes up late. It goes down early.'),
      N('Moss sits on the hill. He is very faint, like mist.'),
      MOSS('Eternals are made of being remembered. Tonight, everyone remembers.', 'soft'),
      MOSS('Light all four lanterns. Keep them lit till the sun comes back.'),
      N('Creak! The gate goes. Lift and push! Friends are coming.'),
      N('Fern, with a blanket. Sparks, with two lanterns. Pixel, with a beeping box.'),
      N('Clover, Luna, Dusty, Nova, Marina, Ember with Ash, and Byte!'),
      BYTE('I counted. Everyone came.', 'think'),
      MOSS('Light them.', 'soft'),
    ],
    [
      doIt(
        7,
        'maths',
        'count to 10',
        'K.CC.B.5',
        'edu:count:keepers:10',
        [
          N('Let’s count the friends: Fern, Sparks, Pixel, Clover, Luna.'),
          N('Dusty, Nova, Marina, Ember, Byte.'),
          N('(Count on your fingers.) Ten friends! Ten helpers!'),
        ],
        'Your child counted to ten, one finger for each friend.',
      ),
      notice(
        9,
        'science',
        'daylight changes through the year; the longest night is in winter',
        '1-ESS1-2',
        [
          N('The sun is going down already. In winter, it’s only up a short time.'),
          N('Tonight is the longest night of all.'),
          N('After tonight, every day gets a tiny bit longer, all the way to summer.'),
        ],
        'Your child heard that winter has the longest night of the year, and that days grow longer after it.',
      ),
    ],
  ),
  scene(
    'c10-sable-watch',
    [
      N('Sable sits by the long-grass lantern all afternoon.'),
      N('The cold tin is buried right behind her.'),
      N('Clover’s grey blanket is on Sable’s back. Sable lets it stay.'),
      LUNA('She hasn’t eaten. She won’t come away.', 'soft'),
      N('Sable is guarding the tin. She is keeping everyone safe.'),
    ],
    [
      ask(
        3,
        'sel',
        'helping a worried friend by staying close and waiting',
        'CASEL: Relationship skills',
        [N('Luna is worried about Sable. What could Luna do?')],
        [
          opt('Sit near her quietly, and wait', [LUNA('Yes. Gran Hazel’s rule: sit down next to them, and wait.', 'soft')], true),
          opt('Pull her away', [N('Pulling might scare Sable. Gran Hazel’s rule: sit down next to them, and wait.')]),
        ],
        'Your child chose a calm, patient way to help someone who is worried.',
      ),
    ],
  ),
  scene(
    'c10-vigil',
    [
      N('Four lanterns, all lit. Pond, stream, old wall, long grass.'),
      N('Then the cold comes. Whoosh! Every flame lies down flat.'),
      SPARKS('Hands round the glass! Not on it. Round it!', 'shock'),
      N('Puff! The stream lantern goes out.'),
      FERN('Matches! I brought everything that was near the door.', 'happy'),
      N('Strike, fizz, glow. It’s lit again. Hooray!'),
      N('More cold comes. Ember wraps her coat round her lantern. It holds!'),
      N('Clover gives Ember soup, and her own warm scarf.'),
      LUNA('Slow hands, warm hearts, the gate stuck fast —', 'soft'),
      CHORUS('what’s kept with love is kept to last.', 'soft'),
    ],
    [
      ask(
        3,
        'maths',
        'take away 1 from 4',
        'K.OA.A.1',
        [N('Four lanterns. One went out. How many are still lit?')],
        [
          opt('Three', [N('Yes! Pond, old wall, long grass. Three still glowing.')], true),
          opt('Four', [N('Let’s count the bright ones: pond, old wall, long grass. Three! One is out.')]),
          opt('Two', [N('Let’s count the bright ones: pond, old wall, long grass. Three!')]),
        ],
        'Your child worked out how many were left when one was taken away.',
      ),
      doIt(
        9,
        'music',
        'singing together; feeling the buzz of the voice',
        '1-PS4-1',
        'edu:sing:lantern-song',
        [
          N('Sing it with Luna! Slow hands, warm hearts…'),
          N('(Put a hand on your throat while you sing.)'),
          N('Can you feel a tiny buzz? That buzz is how your voice makes sound.'),
        ],
        'Your child sang a song and felt the vibration that makes the sound of their voice.',
      ),
    ],
  ),
  scene(
    'c10-vigil-wisp',
    [
      N('At the edge of the light sits a thin grey Nubbin. It’s Wisp!'),
      N('He has a torn ear. He is looking at the long-grass post.'),
      WISP('…warm.', 'soft'),
      N('The tin is the coldest thing here. But Wisp thinks it is warm.'),
      CLOVER('Leave him be. He came. That’s something.', 'soft'),
    ],
    [
      ask(
        3,
        'literacy',
        'opposites: hot and cold',
        'ELOF: Language and Communication',
        [N('The tin is cold. What is the opposite of cold?')],
        [
          opt('Hot', [N('Yes! Cold and hot are opposites. Wisp has them mixed up.')], true),
          opt('Wet', [N('Wet goes with dry. The opposite of cold is hot!')]),
          opt('Small', [N('Small goes with big. The opposite of cold is hot!')]),
        ],
        'Your child found the opposite of a word.',
      ),
    ],
  ),
  scene(
    'c10-lull',
    [
      N('Deep in the night, the cold stops for a while.'),
      N('Everyone sits down. On a bucket, on a step, even on Dusty!'),
      DUSTY('I don’t mind. I’m warm. I’ve been digging.', 'happy'),
      N('Pixel falls asleep on her box. Beep… beep… beep.'),
      FERN('Biscuits! They’re frozen, but you can suck them.', 'happy'),
      N('Sparks has four biscuits. Byte has one.'),
      BYTE('Can I ask you something? If the morning comes, what did it?', 'think'),
      BYTE('The lanterns? Or all of us, together?', 'think'),
    ],
    [
      ask(
        5,
        'maths',
        'more and fewer',
        'K.CC.C.6',
        [N('Sparks has four biscuits. Byte has one. Who has more?')],
        [
          opt('Sparks', [N('Yes! Four is more than one. Byte counted. Of course Byte counted.')], true),
          opt('Byte', [N('Let’s count. Sparks: one, two, three, four. Byte: one. Sparks has more!')]),
        ],
        'Your child compared two groups to find which had more.',
      ),
    ],
    {
      choices: [
        {
          id: 'lull-lanterns',
          label: 'The lanterns. Light is light.',
          friendship: { byte: 1 },
          then: [BYTE('Thank you. I like things I can measure.', 'happy')],
        },
        {
          id: 'lull-us',
          label: 'Us! The lanterns just show where to stand.',
          friendship: { byte: 2 },
          then: [
            BYTE('That sounds like Moss. I wish I could hear him.', 'think'),
            N('Byte writes it down, slowly, with frozen fingers.'),
          ],
        },
        {
          id: 'lull-matter',
          label: 'Does it matter, if the morning comes?',
          friendship: { byte: 1 },
          then: [BYTE('Yes! To me.', 'think'), BYTE('But not tonight. Tonight, I just want the morning.', 'soft')],
        },
      ],
    },
  ),
  scene(
    'c10-falls',
    [
      N('Then, far away, the waterfall stops. Shh. It is so quiet.'),
      MARINA('The falls are frozen. Now the warm spring is open.', 'think'),
      MARINA('We must go now, before the sun comes up.'),
      N('Moss comes slowly down the hill. Nobody hurries him.'),
      YOU('Moss says keep the lanterns lit until the sun is up.'),
      N('You dig under the long-grass post. There’s the tin!'),
      N('Crack! It comes out of the frozen ground.'),
      N('You open it. The cold stone makes your eyes water.'),
    ],
    [
      ask(
        1,
        'science',
        'very cold water freezes into ice',
        '2-ESS2-3',
        [N('Why did the waterfall stop splashing?')],
        [
          opt('The water froze into ice', [N('Yes. When water gets very, very cold, it turns into ice. Ice can’t splash.')], true),
          opt('It got tired', [N('Waterfalls don’t get tired! The water got so cold it turned into ice.')]),
        ],
        'Your child learned that very cold water freezes into solid ice.',
      ),
    ],
  ),
  scene(
    'c10-bearer-sable',
    [
      N('Moss reaches for the stone. But Sable steps in first.'),
      N('She looks at the stone. She looks at Moss. She looks at you.'),
      LUNA('Oh, sweetheart. No.', 'sad'),
      MOSS('Yes. Only a grey one can carry it. The cold can’t hurt her more.', 'soft'),
      N('Sable picks up the stone in her mouth, gently, like an egg.'),
      N('She shivers once. Brrr. But she keeps going.'),
      N('Luna touches her forehead to Sable’s. Just for a second.'),
    ],
    [
      ask(
        6,
        'sel',
        'being brave means doing a hard thing even when scared',
        'CASEL: Self-awareness',
        [N('Sable is scared, but she still helps. What is that called?')],
        [
          opt('Being brave', [N('Yes. Brave doesn’t mean not scared. It means doing it anyway.')], true),
          opt('Being silly', [N('Not silly. Sable is scared and helps anyway. That is being brave.')]),
        ],
        'Your child learned that being brave can mean feeling scared and trying anyway.',
      ),
    ],
  ),
  scene(
    'c10-bearer-moss',
    [
      MOSS('I put it there long ago. I will carry it now.', 'soft'),
      N('Moss picks up the stone, quick and careful.'),
      N('Frost climbs up his face. He is so faint now.'),
      MOSS('There. Not so bad.', 'soft'),
      N('Nobody else can hear him. They just see a blue glow.'),
      N('They stand up tall by their lanterns.'),
    ],
    [
      notice(
        5,
        'sel',
        'brave acts help others feel brave',
        'CASEL: Social awareness',
        [N('Moss was brave. So the Keepers stand up tall too.'), N('When one friend is brave, it helps the others be brave.')],
        'Your child noticed that one person’s courage can help others feel brave.',
      ),
    ],
  ),
  scene(
    'c10-ledge',
    [
      N('Marina goes first, with a rope and a lantern.'),
      N('Behind her, the stone glows blue in the dark.'),
      N('The waterfall is frozen. A long, still slide of ice.'),
      MARINA('Hands on the rock. Feet where my feet go. Slowly.', 'think'),
      N('Marina ties the rope round you, then round herself.'),
      N('Behind the frozen falls is a cave. It sparkles! It is warm.'),
      N('In the middle is the Wellspring. The water glows from below.'),
      MARINA('I’ll stay here and hold the rope.', 'soft'),
    ],
    [
      ask(
        5,
        'maths',
        'position words: in front of and behind',
        'K.G.A.1',
        [N('Where is the cave? In front of the waterfall, or behind it?')],
        [
          opt('Behind it', [N('Yes! The cave hides behind the waterfall.')], true),
          opt('In front of it', [N('We went past the falls to find it. The cave is behind the waterfall.')]),
        ],
        'Your child used the position words in front of and behind.',
      ),
    ],
  ),
  scene(
    'c10-edge',
    [
      N('At the water’s edge, the stone goes quiet.'),
      N('Then it whispers. Safe, safe, safe.'),
      N('It shows a picture. All the Nubbins, sitting very still.'),
      N('Never hungry. Never hurt. But never playing, either.'),
      N('Safe, it whispers. Keep me.'),
      N('Moss says nothing. He trusts you to remember.'),
      N('Safe is not the same as happy.'),
    ],
    [
      ask(
        3,
        'sel',
        'making a good choice: being well is more than being safe',
        'CASEL: Responsible decision-making',
        [N('Would the Nubbins be happy sitting still for ever?')],
        [
          opt('No. They need to run and play', [N('Yes. Nubbins need to run, play and cuddle. That is being well.')], true),
          opt('Yes', [N('They would be safe.'), N('But they could never run, or play, or cuddle. That isn’t happy.')]),
        ],
        'Your child thought about the difference between being kept safe and being happy and well.',
      ),
    ],
    {
      choices: [
        {
          id: 'unmake',
          label: 'Unmake it! Back to the water.',
          set: { keptStone: false },
          then: [YOU('Unmake it.'), N('You say it loud and clear, so the stone hears.')],
        },
      ],
      defaultChoice: 'unmake',
    },
  ),
  scene(
    'c10-safe-sable',
    [
      N('Sable steps into the warm water. Gold light glows round her.'),
      N('She bends her head to let the stone go. But she stops.'),
      N('She can’t let go. She shakes. Frost creeps up her face.'),
      N('The stone whispers: you’ll never be cold or scared again.'),
      N('Sable looks at you. And for the only time ever, she speaks.'),
      SABLE('…safe.', 'soft'),
      N('Sable is scared. Letting go of a scary thing is hard.'),
    ],
    [
      ask(
        6,
        'sel',
        'helping someone who is scared',
        'CASEL: Social awareness',
        [N('What could help Sable feel less scared?')],
        [
          opt('A friend close by, and a gentle voice', [N('Yes. Calm voices and friends nearby help scared feelings shrink.')], true),
          opt('Shouting at her', [N('Shouting makes scared feel bigger. A gentle voice and a friend close by help.')]),
        ],
        'Your child named ways to comfort someone who is frightened.',
      ),
    ],
  ),
  scene(
    'c10-safe-moss',
    [
      N('Moss steps into the warm water. Gold light shines through him.'),
      N('He bends to let the stone go. And he stops.'),
      MOSS('…Oh. It sounds like Cinder. My old friend.', 'soft'),
      MOSS('She’s calling me in out of the rain. Safe, she says.', 'sad'),
      MOSS('I loved her. It’s hard to put her down.', 'sad'),
      N('Moss stands very still in the water. He misses his friend.'),
    ],
    [
      notice(
        5,
        'sel',
        'naming the feeling of missing someone',
        'CASEL: Self-awareness',
        [
          N('Moss misses his old friend. Missing someone can feel heavy and sad.'),
          N('It shows how much we loved them.'),
          N('(Have you ever missed someone? Talk about it together.)'),
        ],
        'Your child talked about what it feels like to miss someone.',
      ),
    ],
  ),
  scene(
    'c10-wisp',
    [
      N('Pitter-pat. Something has followed you, very quietly.'),
      N('A thin grey Nubbin with a torn ear zooms past. Wisp!'),
      WISP('Hsss! Mine!', 'angry'),
      N('He grabs the stone. Snatch!'),
      WISP('Mine. Warm. Mine!', 'shock'),
      N('Then his feet slip. Splash! In he goes, stone and all.'),
      N('And the light comes up! Warm and gold, like a kitchen window.'),
      N('The frozen falls glow the colour of honey.'),
      N('The stone is gone. The whispering stops. Shh.'),
      N('The light is so bright you can’t see Wisp. Let’s wait and look.'),
    ],
    [
      doIt(
        7,
        'art',
        'naming colours: gold and yellow',
        undefined,
        'edu:find:colour:gold',
        [
          N('Gold, like honey! Like a warm lantern.'),
          N('(Can you find something gold or yellow near you? Point to it!)'),
        ],
        'Your child named a colour and found it in the world around them.',
      ),
    ],
  ),
  scene(
    'c10-moss-walks',
    [
      N('Moss wades in beside Sable. Gold light shines through him.'),
      MOSS('Give it here, grey one. You’ve carried enough.', 'soft'),
      N('He puts his forehead on hers. Gently.'),
      N('Sable opens her mouth. The stone drops, to Moss.'),
      N('Sable runs to you, soaking wet, and leans on your leg.'),
      MOSS('Hold the lantern up, would you? I want to see.', 'soft'),
      N('Moss walks slowly into the warm water. Down, down, down.'),
      N('Then the light comes up! Warm and gold.'),
      N('The water goes still. Moss has gone under. We wait.'),
    ],
    [
      ask(
        5,
        'science',
        'we need light to see in the dark',
        '1-PS4-2',
        [N('Why does Moss want the lantern held up?')],
        [
          opt('So he can see', [N('Yes. In the dark we need light to see.')], true),
          opt('To warm his toes', [
            N('A lantern is warm. But Moss wants to see.'),
            N('We need light in the dark.'),
          ]),
        ],
        'Your child learned that we need light to see.',
      ),
    ],
  ),
  scene(
    'c10-moss-walks-bearer',
    [
      N('Moss stands in the water. The stone is still in his mouth.'),
      N('He turns his head and looks at you.'),
      MOSS('I can’t put Cinder down. So I will carry her home.', 'soft'),
      MOSS('That’s what you do for a friend who stays out too late.', 'soft'),
      MOSS('Hold the lantern up for me. I want to see.', 'soft'),
      N('Your arm shakes. You hold it up anyway.'),
      N('Moss walks slowly into the warm water. Down, down, down.'),
      N('The light comes up, warm and gold.'),
      N('The water goes still. Moss has gone under. We wait.'),
    ],
    [
      doIt(
        4,
        'health',
        'arm strength and holding still; counting to 5',
        'ELOF: Perceptual, Motor, and Physical Development',
        'edu:hold:arm-up:5',
        [
          N('Hold your lantern up high, like this! (Lift one arm up high.)'),
          N('(Hold it there and count together: one, two, three, four, five.)'),
          N('Strong arm! Moss can see the way.'),
        ],
        'Your child held a stretch while counting to five.',
      ),
    ],
  ),
  scene(
    'c10-bank-wisp',
    [
      N('You sit on the warm rock and wait. That’s Gran Hazel’s rule.'),
      N('Moss sits beside you. He says nothing.'),
      N('The waterfall starts again. Trickle, rush, ROAR!'),
      N('Grey morning light comes into the cave.'),
      N('Look! On the far side, curled on a warm stone. It’s Wisp!'),
      N('He is asleep. His tummy goes up and down. He is alive.'),
      N('And for the first time ever, he isn’t shaking.'),
      MOSS('I was wrong about him. Don’t tell Hazel.', 'happy'),
      N('You carry him home. He doesn’t even wake up.'),
    ],
    [
      doIt(
        2,
        'music',
        'quiet, louder, loudest',
        undefined,
        'edu:say:quiet-to-loud',
        [
          N('Say it with the waterfall!'),
          N('(Whisper “trickle”. Say “rush”. Shout “ROAR!”)'),
          N('Quiet, louder, loudest. Just like the falls waking up.'),
        ],
        'Your child used their voice to go from quiet to loud.',
      ),
    ],
  ),
  scene(
    'c10-bank-moss-returned',
    [
      N('You sit on the warm rock and wait. Marina comes and sits too.'),
      MARINA('Talk about him. Out loud. It helps.', 'soft'),
      N('So you do. Moss on the hill. Moss and Byte’s shoelace.'),
      N('You remember every quiet afternoon with him.'),
      N('The waterfall starts again. Trickle, rush, ROAR!'),
      N('Then something pops up. Small, grey and very thin.'),
      N('Moss climbs out. He shakes his ears. Shake, shake!'),
      MOSS('You were very loud. I could hear you from the bottom.', 'happy'),
      MOSS('Don’t pick me up. …Oh, go on, then.', 'soft'),
    ],
    [
      doIt(
        1,
        'literacy',
        'talking about a memory',
        'SL.K.1',
        'edu:tell:memory:moss',
        [
          N('Let’s help. Talk about Moss, out loud.'),
          N('(What do you remember about Moss? Tell your grown-up.)'),
        ],
        'Your child shared a memory out loud, taking part in a conversation.',
      ),
    ],
  ),
  scene(
    'c10-bank-moss-gone',
    [
      N('You sit on the warm rock and wait. Marina sits with you.'),
      MARINA('Talk about him. Out loud. It helps.', 'soft'),
      N('So you do. Moss on the hill. Moss and Byte’s shoelace.'),
      N('The waterfall starts again. Morning comes.'),
      N('But Moss does not come back up.'),
      N('Moss has faded. That means he died.'),
      N('He was very, very old.'),
      N('His body stopped working, and it won’t start again.'),
      N('You feel sad. Marina feels sad too. She stays close.'),
      MARINA('He knew the way. And we will remember him.', 'soft'),
    ],
    [
      ask(
        8,
        'sel',
        'what helps when we feel sad',
        'CASEL: Self-awareness',
        [N('What helps when we feel sad?')],
        [
          opt(
            'A hug, or sitting with a friend',
            [N('Yes. It’s OK to feel sad. Hugs, friends and talking about Moss all help.')],
            true,
          ),
          opt('Pretending we’re not sad', [
            N('It’s OK to feel sad. No need to hide it.'),
            N('A hug helps.'),
          ]),
        ],
        'Your child learned that sadness is allowed and named things that help.',
      ),
    ],
  ),
  scene(
    'c10-dawn',
    [
      N('You come out from behind the falls. Morning!'),
      N('The whole valley sparkles silver with frost.'),
      N('Three lanterns still burn. Your friends held them all night!'),
      N('The fourth one is dark. Ember hugs it anyway.'),
      N('Then the sun peeks over the hill. And the fourth lantern…'),
      N('…glows. Brighter. Brighter! It lit all by itself!'),
      SPARKS('I didn’t touch it! I did not touch it!', 'shock'),
      N('By the time you get home, the frost has melted. Drip, drip.'),
      N('Sparks skims a frozen soup puck across the last of the pond ice. Whee!'),
      N('Everyone laughs and laughs.'),
    ],
    [
      doIt(
        5,
        'maths',
        'count to 4',
        'K.CC.B.4',
        'edu:count:lanterns:4',
        [N('Count the lanterns with me: pond, stream, old wall, long grass.'), N('One, two, three, four! All four lit!')],
        'Your child counted four objects, one number for each.',
      ),
    ],
  ),
  scene(
    'c10-moss-stays',
    [
      N('Moss sits at the foot of the hill. He looks at everyone.'),
      MOSS('Hazel stood there. You stand there. Same chin.', 'soft'),
      MOSS('The hands are slower. That’s better, actually.', 'soft'),
      MOSS('I’ll stay a while. Someone must tell Byte about his shoelaces.'),
      BYTE('They are TIED.'),
      MOSS('Are they.'),
      N('Byte looks down. Byte looks up. Byte’s mouth falls open.'),
      BYTE('I heard him! I heard Moss!', 'shock'),
      CLOVER('We sat still long enough. All night!', 'happy'),
      N('Byte ties his shoelace, very carefully. Everyone laughs.'),
    ],
    [
      doIt(
        8,
        'sel',
        'listening: being still and quiet to hear small sounds',
        'ELOF: Approaches to Learning',
        'edu:listen:quiet',
        [
          N('Byte heard Moss because everyone sat still and listened.'),
          N('(Let’s try. Sit very still. Shh. What small sounds can you hear?)'),
        ],
        'Your child practised sitting still and listening carefully.',
      ),
    ],
  ),
  scene(
    'c10-moss-fades',
    [
      N('Moss stops at the foot of the hill. He is so faint now.'),
      MOSS('All four lanterns lit. I wanted to see that once more.', 'soft'),
      MOSS('I am very, very old. It is my time to fade.', 'soft'),
      N('Moss is going to fade. That means he will die.'),
      N('You kneel by him. You don’t know what to say.'),
      MOSS('No big fuss. A small hug will do.', 'happy'),
      MOSS('Tell Byte his shoelace is untied.', 'soft'),
      N('Moss walks slowly up the hill. He doesn’t look back.'),
      N('Halfway up, he stops, as if someone has said his name.'),
    ],
    [
      notice(
        4,
        'sel',
        'comforting someone without words',
        'CASEL: Relationship skills',
        [
          N('It’s OK not to know what to say.'),
          N('Sitting close, or a gentle hand, can say “I love you” too.'),
        ],
        'Your child learned that being close can comfort someone when words are hard.',
      ),
    ],
  ),
  scene(
    'c10-moss-mourned',
    [
      N('You come in at the gate. Lift and push.'),
      N('Everyone looks for Moss. You shake your head.'),
      N('Moss has died. He won’t come back.'),
      N('Clover sits down in the wet grass. She is crying.'),
      N('Byte’s shoelace is untied. He leaves it.'),
      DUSTY('Love them anyway. Love them harder because of it.', 'sad'),
      N('On the hill, by the flat stone where Moss sat, is a new flower.'),
      N('The flower helps everyone remember him.'),
    ],
    [
      ask(
        7,
        'sel',
        'people show sadness in different ways',
        'CASEL: Social awareness',
        [N('Clover is crying. Byte is very quiet. How do they feel?')],
        [
          opt(
            'Sad, because they miss Moss',
            [
              N('Yes. People show sad in different ways.'),
              N('Crying is OK. Being quiet is OK too.'),
            ],
            true,
          ),
          opt('Cross', [
            N('They look sad, not cross. They miss Moss.'),
            N('Crying and quiet are both sad.'),
          ]),
        ],
        'Your child noticed that people show sadness in different ways.',
      ),
    ],
  ),
  scene(
    'c10-moss-light',
    [
      N('A tiny pale light floats down through the morning air, slow as a seed.'),
      N('It stops above Sable’s head, next to her dark one.'),
      N('Two little lights now. One dark, one pale.'),
      N('Sable goes cross-eyed trying to see both!'),
      LUNA('Oh. He left you something, sweetheart.', 'soft'),
    ],
    [
      ask(
        1,
        'maths',
        'add 1',
        'K.OA.A.1',
        [N('Sable had one light. One more came. How many now?')],
        [
          opt('Two', [N('Yes! One and one more makes two.')], true),
          opt('One', [N('Count them: the dark one, one. The pale one, two!'), N('One and one more makes two.')]),
          opt('Three', [N('Count them: the dark one, one. The pale one, two. Just two!')]),
        ],
        'Your child added one more to a group of one.',
      ),
    ],
  ),
  scene(
    'c10-close',
    [
      N('The sun is up. Everyone is tired. Nobody wants to go home.'),
      N('Look! A lantern is coming down the hill path.'),
      N('It comes slowly. It stops to rest, then comes again.'),
      N('Fern sees it first. She puts her hand over her mouth.'),
      N('Nobody runs. Everyone waits and lets it come.'),
      N('It’s a small lady in three coats. Her boots are tied with string.'),
      N('In her arm sleeps a tiny, thin grey Nubbin.'),
      HAZEL('Well. Look at you all.', 'soft'),
      N('She finds you, and stops looking for anyone else.'),
      N('It’s Gran Hazel! Of course it is.'),
    ],
    [
      ask(
        6,
        'literacy',
        'using clues to guess a character',
        'RL.K.3',
        [N('A small lady. Three coats. String on her boots.'), N('Who do you think it is?')],
        [
          opt('Gran Hazel!', [N('Good guess! Let’s see…')], true),
          opt('Corvin', [N('Corvin is a tall man. This is a small lady. Let’s see…')]),
          opt('A bear', [N('A bear in three coats! That would be funny. Let’s see…')]),
        ],
        'Your child used clues in the story to guess who a character was.',
      ),
    ],
  ),
  scene(
    'c10-bramble',
    [
      FERN('That ear folds at the tip. Just like Bramble’s!', 'shock'),
      FERN('Bramble used to be my Nubbin.', 'soft'),
      HAZEL('This is Bramble’s baby. I found her under a root.'),
      FERN('Hello, little one!', 'soft'),
      N('Fern touches the folded ear, gently. The baby sighs and snuggles in.'),
    ],
    [
      ask(
        2,
        'science',
        'babies need grown-ups to feed them and keep them warm',
        '1-LS1-2',
        [N('The baby was all alone. What does a baby Nubbin need?')],
        [
          opt('Food, warmth, and someone to care for it', [N('Yes. Baby animals need grown-ups to feed them and keep them warm.')], true),
          opt('Nothing at all', [N('Babies need lots! Food, warmth, and a grown-up to look after them.')]),
        ],
        'Your child learned that young animals need their parents to feed and protect them.',
      ),
    ],
  ),
];

// ================================================================ chapter 11: Hazel

/** The end of c11-moss-gone and c11-moss-passed (as MOSS_GONE_TAIL in campaign-book3.ts). */
const MOSS_GONE_TAIL: Line[] = [
  HAZEL('He sat beside me a whole winter before he said one word.', 'sad'),
  HAZEL('He’d hate a fuss. We’ll make a small one. Just us.', 'soft'),
  N('Gran Hazel holds your hand. You sit together, quietly.'),
];

const C11: EduScene[] = [
  scene(
    'c11-open',
    [
      N('Gran Hazel is small. She smells of woodsmoke and leaves.'),
      HAZEL('There’s the chin. You lit all four lanterns. I saw!', 'soft'),
      HAZEL('I thought, that’s my grandchild. Or Sparks blew everything up.', 'happy'),
      SPARKS('That’s fair. That’s very fair.', 'happy'),
      HAZEL('Now, something true. I am very poorly.', 'soft'),
      HAZEL('The doctors can’t make me better. So I won’t be here long.', 'soft'),
      HAZEL('But I’m still me. Still bossy. No fussing!', 'happy'),
      HAZEL('This tiny one took apple from my thumb. Took two days. Worth it.', 'soft'),
      HAZEL('A Grove isn’t the Nubbins, love.', 'soft'),
      HAZEL('It’s the people who show up when the lanterns are lit.', 'soft'),
    ],
    [
      notice(
        5,
        'sel',
        'naming big feelings after hard news',
        'CASEL: Self-awareness',
        [
          N('Gran Hazel told a hard, true thing.'),
          N('(Pause here. How do you feel? Sad, worried, cross? All feelings are OK.)'),
          N('When we feel sad, a hug and a sit-down help.'), N('Gran Hazel would say so too.'),
        ],
        'Your child named their feelings after hearing sad news, and heard that every feeling is allowed.',
      ),
      ask(
        7,
        'science',
        'what animals need to live and grow',
        'K-LS1-1',
        [N('The tiny Nubbin is too thin. What will help her grow strong?')],
        [
          opt('Food and water, a little at a time', [HAZEL('That’s it, love. A bit of apple, a sip of water.', 'happy'), HAZEL('And lots of patience.', 'soft')], true),
          opt('Running races', [N('Running is fun, but she needs food and water first.'), N('A little at a time.')]),
        ],
        'Your child learned that animals need food and water to live and grow.',
      ),
    ],
  ),
  scene(
    'c11-moss-here',
    [
      N('Moss sits by Gran Hazel’s boot.'),
      HAZEL('Hello, old thing.', 'soft'),
      MOSS('You’re late.', 'think'),
      HAZEL('I’m always late. You’re thinner.', 'soft'),
      MOSS('You’re late. I’m thinner. We’re even.', 'soft'),
      N('Gran Hazel laughs and laughs. She holds her side.'),
      N('She pats his head, just like every evening for forty years.'),
    ],
    [
      ask(
        5,
        'literacy',
        'rhyming words',
        'RF.K.2',
        [N('Late! Which word rhymes with late?')],
        [
          opt('Gate', [N('Yes! Late, gate. They sound the same at the end.')], true),
          opt('Moss', [N('Listen: late… gate. Gate rhymes with late!')]),
          opt('Pond', [N('Listen: late… gate. Gate rhymes with late!')]),
        ],
        'Your child listened for words that rhyme.',
      ),
    ],
  ),
  // Keep route only (a main-game save): Moss stays on the hill with his back to the Grove.
  scene(
    'c11-moss-gone',
    [
      N('Gran Hazel looks up the hill, where Moss always sat.'),
      HAZEL('I know, love. I knew coming down. Moss has died.', 'soft'),
      ...MOSS_GONE_TAIL,
    ],
    [
      doIt(
        3,
        'art',
        'making something to remember someone',
        undefined,
        'edu:make:memory:moss',
        [
          N('Let’s make a small fuss for Moss.'),
          N('(Draw a flower for Moss, or say one thing you liked about him.)'),
        ],
        'Your child made a drawing or said a memory to remember someone who died.',
      ),
    ],
  ),
  // Moss went up the hill at dawn (c10-moss-fades); Hazel met him on her way down.
  scene(
    'c11-moss-passed',
    [
      N('Gran Hazel looks up the hill, where Moss always sat.'),
      HAZEL('I passed Moss on the path, coming down. He said, “You’re late.”', 'soft'),
      N('Moss has faded. That means he died.'),
      ...MOSS_GONE_TAIL,
    ],
    [
      notice(
        2,
        'sel',
        'a happy memory and a sad feeling can come together',
        'CASEL: Self-awareness',
        [
          N('Moss made one last little joke. Gran Hazel smiles, and she is sad too.'),
          N('You can smile and feel sad at the same time. Both are OK.'),
        ],
        'Your child heard that a happy memory and a sad feeling can come at the same time.',
      ),
    ],
  ),
  scene(
    'c11-sable',
    [
      N('Sable comes out of the long grass.'),
      N('She looks at Gran Hazel for a long time.'),
      N('Then she walks right past her, and leans on your leg.'),
      HAZEL('Sable chose you, not me! Ha!', 'happy'),
      HAZEL('That one took longer than two months, I bet.', 'soft'),
      N('You nod. It took a long, long time.'),
      HAZEL('Worth it.', 'soft'),
    ],
    [
      ask(
        4,
        'maths',
        'comparing lengths of time',
        'ELOF: Mathematics Development',
        [N('Which is longer: one day, or two months?')],
        [
          opt('Two months', [N('Yes! Two months is lots and lots of days.'), N('Making friends with Sable took longer still.')], true),
          opt('One day', [N('One day goes by quickly.'), N('Two months is lots and lots of days. That’s longer!')]),
        ],
        'Your child compared a short time and a long time.',
      ),
    ],
  ),
  scene(
    'c11-close',
    [
      N('Days go by. Gran Hazel sleeps a lot, and wakes for the good bits.'),
      HAZEL('They all like you. Even Ember, who doesn’t like anyone.', 'happy'),
      EMBER('I can hear you.', 'angry'),
      HAZEL('I know, dear.', 'happy'),
      HAZEL('Sit with me by the pond. Don’t say anything.', 'soft'),
      N('You sit. The pond is still and dark. The sky is in it.'),
      N('Far off in the wood, an owl says “hoo-hoo”, once. Then it stops.'),
      HAZEL('I used to think about all I got wrong. Then I just sat.', 'soft'),
      HAZEL('Tomorrow I want to see the whole Grove. Every post, every tree.', 'think'),
      N('Gran Hazel’s hand is warm and very light.'),
    ],
    [
      notice(
        5,
        'science',
        'still water reflects like a mirror',
        'ELOF: Scientific Reasoning',
        [
          N('Still water is like a mirror.'),
          N('Look! The sky is in the pond, upside down.'),
          N('(Have you seen yourself in a puddle or a spoon?)'),
        ],
        'Your child noticed that still water reflects things like a mirror.',
      ),
    ],
  ),
  scene(
    'c11-gate',
    [
      N('Look! Corvin is back at the gate.'),
      N('He wears an old brown coat now, not a grey one.'),
      N('He lifts the latch, just once. The gate sticks.'),
      N('Then he folds his arms on the gate, and waits.'),
      HAZEL('Don’t look at me, love. It’s your gate now.', 'soft'),
      HAZEL('He said he’d stay till morning. He means it.', 'think'),
    ],
    [
      doIt(
        2,
        'literacy',
        'sequencing: first, then',
        'ELOF: Approaches to Learning',
        'edu:order:gate:lift-push',
        [
          N('The gate has a trick. First, lift. Then, push.'),
          N('(Do it together: lift your hands up… now push!)'),
          N('First lift, then push. You know the trick!'),
        ],
        'Your child followed a two-step order: first, then.',
      ),
    ],
    {
      choices: [
        {
          id: 'gate-leave',
          label: 'Stay where you are.',
          then: [N('You stay. The gate creaks once. Then it’s quiet. Corvin doesn’t go.')],
        },
        {
          id: 'gate-cruel',
          label: 'He’ll stand there all night! Isn’t that unkind?',
          then: [
            HAZEL('It would be, if someone made him wait. Nobody did.', 'think'),
            HAZEL('He chose to wait. Let him choose something, love.', 'soft'),
            N('The gate creaks once. Then it’s quiet. Corvin doesn’t go.'),
          ],
        },
        {
          id: 'gate-tea',
          label: 'Take him a cup of tea. Leave the gate shut.',
          then: [
            HAZEL('Oh, you’re kinder than me!', 'happy'),
            HAZEL('Go on. Use the cup that’s upside down.', 'soft'),
            N('You pass the warm tea over the gate. He holds it with both hands.'),
            CORVIN('Thank you. I’m sorry. For all of it.', 'soft'),
            N('In the morning, the cup is on the gatepost, washed and upside down.'),
          ],
        },
      ],
    },
  ),
];

// ================================================================ chapter 12: Keepers

const C12: EduScene[] = [
  scene(
    'c12-open',
    [
      N('Morning! Everyone is here. Every Keeper, every Nubbin.'),
      N('Sparks made a cake. It flopped on one side. Pixel made it light up!'),
      N('Fern’s lantern buns came out right, for the very first time!'),
      N('Ash runs at the gate, like she used to. Bonk! Ember smiles.'),
      N('Gran Hazel walks slowly. She touches each lantern post.'),
      HAZEL('And the long grass. Cinder’s. She loved them too.', 'soft'),
      HAZEL('The Grove is yours now, love. Properly.', 'soft'),
      HAZEL('I shut the gate when scared, and opened it when brave.', 'think'),
      HAZEL('So. What will the Grove be?', 'soft'),
    ],
    [
      doIt(
        2,
        'maths',
        'count to 5',
        'K.CC.B.5',
        'edu:count:buns:5',
        [
          N('Fern has five buns on her plate.'),
          N('(Count them together on your fingers: one, two, three, four, five!)'),
          FERN('Five! And not one of them burnt!', 'happy'),
        ],
        'Your child counted five things.',
      ),
      notice(
        8,
        'social-studies',
        'rules and choices that make a home fair and kind',
        'D2.Civ.8.K-2',
        [
          N('A home has its own rules. Here, it’s “lift and push”.'),
          N('(Talk together: what makes your home feel like home?)'),
        ],
        'Your child talked about the rules and ways of a home.',
      ),
    ],
    {
      choices: [
        {
          id: 'keep',
          label: 'A home for all. Keep the gate that sticks.',
          set: { finalChoice: 'keep' },
          then: [
            HAZEL('Lift and push. Good.', 'happy'),
            HAZEL('It sticks so you hear who comes back. That’s the secret.', 'soft'),
            HAZEL('Keep listening, love.', 'soft'),
          ],
        },
        {
          id: 'free',
          label: 'Open! No gate. They stay if they want.',
          set: { finalChoice: 'free', letThemGo: true },
          then: [
            HAZEL('That’s not how I did it. But it might be right.', 'think'),
            N('You lift the gate off. Dusty helps. Heave!'),
            N('A stray Nubbin trots out. Sniff, sniff. Then it trots right back in!'),
            HAZEL('Ha!', 'happy'),
          ],
        },
      ],
    },
  ),
  scene(
    'c12-foot-told',
    [
      N('Gran Hazel stands up. Everyone stands up too.'),
      N('Gran Hazel is very poorly. She wants to sit up on the hill.'),
      N('From there she can see the whole Grove.'),
      N('Everyone walks with her to the bottom of the hill.'),
      N('She looks at each friend, one by one.'),
      HAZEL('That’s far enough. Go home. Light a lantern. Lanterns say hello.', 'soft'),
      N('They stay. They hold their lanterns, and watch, and wave.'),
    ],
    [
      notice(
        5,
        'sel',
        'saying goodbye to someone we love',
        'CASEL: Relationship skills',
        [
          N('Saying goodbye to someone we love is hard.'),
          N('It’s OK to cry. Friends stand close together.'),
          N('(If you’d like, give your grown-up a hug.)'),
        ],
        'Your child heard that goodbyes are hard and that it helps to be together.',
      ),
    ],
  ),
  scene(
    'c12-foot-secret',
    [
      N('Gran Hazel gets up from the bench. Nobody notices.'),
      N('Sparks and Pixel are arguing about the cake. Fern lost a glove.'),
      N('Gran Hazel catches your eye. She winks.'),
      HAZEL('Let’s go quietly. I’ve written them all a letter.', 'soft'),
      N('She takes her lantern and walks to the hill, slow and easy.'),
    ],
    [
      notice(
        3,
        'sel',
        'writing a letter is a kind way to say goodbye',
        'CASEL: Relationship skills',
        [
          N('Gran Hazel wrote everyone a letter. Nobody is left wondering.'),
          N('Writing it down is a kind way to say goodbye.'),
        ],
        'Your child heard that writing a letter is a kind way to say goodbye, so nobody is left wondering.',
      ),
    ],
  ),
  scene(
    'c12-walk-you',
    [
      HAZEL('Come on, then. Arm.', 'soft'),
      N('Gran Hazel is very poorly. She holds your arm.'),
      N('Up the hill, slowly. Past Fossil’s flower. Past Briar’s, small and yellow.'),
      HAZEL('Come up here sometimes. Tell them how you’re doing.', 'soft'),
      N('At the top she sits. You can see the whole Grove!'),
      HAZEL('There. That’s mine. It’s a good one.', 'happy'),
      N('You sit together. Nobody talks. It is the best part.'),
      HAZEL('Off you go, love. Don’t look back.', 'happy'),
      N('You look back once. Of course you do.'),
      N('She is waving, without turning round. Goodbye, Gran Hazel.'),
    ],
    [
      ask(
        4,
        'maths',
        'position words: top and bottom',
        'K.G.A.1',
        [N('Where is Gran Hazel sitting? At the top of the hill, or the bottom?')],
        [
          opt('At the top', [N('Yes. Right at the top, where she can see everything.')], true),
          opt('At the bottom', [N('We climbed up, up, up. She’s at the top, where she can see everything.')]),
        ],
        'Your child used the position words top and bottom.',
      ),
    ],
  ),
  scene(
    'c12-walk-moss',
    [
      N('Moss sits on the first stone of the hill path.'),
      MOSS('I’m coming. Don’t argue.', 'think'),
      HAZEL('I wasn’t going to argue.', 'soft'),
      MOSS('You were. You had your chin out.', 'soft'),
      N('Moss climbs onto her shoulder. He is as light as a leaf.'),
      HAZEL('This is as far as you come, love.', 'soft'),
      N('They go up together, slow and small. The lantern swings.'),
      N('Moss says something in her ear. She laughs so hard she sits down!'),
      N('At the top, they sit together and look at the Grove.'),
      MOSS('Go home, little one. Light a lantern. Lanterns say hello.', 'soft'),
    ],
    [
      ask(
        4,
        'maths',
        'comparing weight: heavy and light',
        'K.MD.A.2',
        [N('Moss is as light as a leaf.'), N('Which is lighter: a leaf or a rock?')],
        [
          opt('A leaf', [N('Yes! A leaf is light. A rock is heavy.')], true),
          opt('A rock', [N('A rock is heavy, hard to lift.'), N('A leaf is light. It floats in the wind!')]),
        ],
        'Your child compared two things to say which is lighter.',
      ),
    ],
  ),
  scene(
    'c12-walk-sable',
    [
      N('Sable waits at the bottom of the hill path.'),
      HAZEL('Hello, grey one.', 'soft'),
      N('Sable walks up the path. Two steps. Then she looks back.'),
      HAZEL('Oh! She’s taking me.', 'soft'),
      N('They go up together. Sable waits at every bend.'),
      N('Always two steps ahead. Never more.'),
      N('At the top, Sable sits down next to her.'),
      N('After dark, Sable comes down the path alone.'),
      N('She sits on your doorstep, and waits for you.'),
      N('She has never come to a door before.'),
    ],
    [
      doIt(
        5,
        'maths',
        'counting steps to 2',
        'K.CC.B.4',
        'edu:step:count:2',
        [
          N('Walk like Sable! (Take two steps: one, two.)'),
          N('(Now stop, and look back over your shoulder.)'),
          N('Two steps, then wait. Just like Sable.'),
        ],
        'Your child counted their own steps to two.',
      ),
    ],
  ),
  scene(
    'c12-walk-corvin',
    [
      N('Corvin stands by the hedge, far away.'),
      HAZEL('Don’t stand there like a heron. Come and take the lantern.', 'soft'),
      HAZEL('You used to carry it for me, long ago.', 'soft'),
      CORVIN('…I used to. I’m sorry, Hazel. For everything.', 'soft'),
      HAZEL('I know, love. Come on.', 'soft'),
      N('His hands aren’t blue any more. They are warm and steady.'),
      N('He walks her up the hill. He waits every time she rests.'),
      N('Later, he comes down. His face is wet. He doesn’t hide it.'),
      N('He left her lantern at the top, still lit. He sits by the pond.'),
    ],
    [
      notice(
        1,
        'science',
        'animals live where they can find what they need',
        'K-ESS3-1',
        [
          N('A heron is a tall bird with long legs.'),
          N('It stands very still by the water, waiting to catch a fish.'),
          N('(Can you stand still on one leg, like a heron?)'),
        ],
        'Your child learned that herons live by water, where they find their food.',
      ),
    ],
  ),
  scene(
    'c12-walk-alone',
    [
      N('Gran Hazel picks up her lantern.'),
      HAZEL('Walk me up the hill, love.', 'soft'),
      N('Gran Hazel is very poorly. She wants to see the Grove from the top.'),
      N('She holds your arm. Past Fossil’s flower. Past Briar’s, small and yellow.'),
      N('At the top she sits. You can see everything!'),
      N('The pond. The four posts. The gate. All your friends, small and bright.'),
      HAZEL('There. That’s mine. It’s a good one. Now it’s yours.', 'happy'),
      N('You sit together, quiet. It is the best part.'),
      HAZEL('Go on down. Don’t look back!', 'happy'),
      N('You look back once. She is waving. Goodbye, Gran Hazel.'),
    ],
    [
      doIt(
        5,
        'maths',
        'count to 4 from far away',
        'K.CC.B.5',
        'edu:count:posts:4',
        [
          N('From up here the lantern posts look tiny.'),
          N('(Point and count them with Gran Hazel: one, two, three, four.)'),
          HAZEL('Four. All lit. Good.', 'soft'),
        ],
        'Your child counted four objects, even when they looked small and far away.',
      ),
    ],
  ),
  scene(
    'c12-close',
    [
      N('Dusk. You come back to the Grove.'),
      N('Your friends are all still here. They lit all four lanterns.'),
      N('Clover gives you soup. Fern gives you a glove.'),
      N('On top of the hill, Gran Hazel’s lantern glows, small and gold.'),
      N('Everyone takes turns watching it, all night long.'),
      N('In the morning, her lantern is out.'),
      N('Gran Hazel was very poorly. In the night, she died.'),
      N('Her body stopped working, and it won’t start again.'),
      N('Everyone is sad. That’s OK. They stay close together.'),
      N('On the hill is a new flower, a bit untidy, facing the Grove.'),
    ],
    [
      ask(
        4,
        'sel',
        'taking turns',
        'CASEL: Relationship skills',
        [N('Why do friends take turns watching the lantern?')],
        [
          opt('So everyone can rest a bit', [N('Yes. Taking turns means everyone gets a go, and a rest.')], true),
          opt('So one friend does it all', [N('That would be very tiring! Taking turns shares the job, so everyone can rest.')]),
        ],
        'Your child learned how taking turns shares a job fairly.',
      ),
      ask(
        9,
        'science',
        'what plants need to grow',
        'K-LS1-1',
        [N('Let’s look after Gran Hazel’s flower. What does a flower need?')],
        [
          opt('Sunlight and water', [N('Yes. Sun and water help it grow.'), N('Looking after it is a way to remember her.')], true),
          opt('A hug', [N('Hugs are for people. Flowers need sunlight and water.'), N('We can give each other the hugs.')]),
        ],
        'Your child learned that plants need light and water, and that caring for a memorial flower is a way to remember.',
      ),
    ],
  ),
];

// ================================================================ endings

/** Gran Hazel's Grove after its first body line, shared by end-hazels-grove and end-hazels-grove-open. */
const HAZELS_GROVE_BODY: Line[] = [
  N('The frost never comes back. The fourth lantern lights itself every night.'),
  N('Moss sits by Gran Hazel’s flower and talks to it.'),
  N('Sable sleeps on your feet. Grey, and loved, both at once.'),
  N('Pixel’s sign by the door used to say MAYBE. Now it says OBVIOUSLY!'),
  N('Some nights Sable makes a tiny sound. It might be a word.'),
];

const ENDS: EduScene[] = [
  scene(
    'end-hazels-grove',
    [N('GRAN HAZEL’S GROVE'), N('The gate still sticks. Everyone knows: lift and push.'), ...HAZELS_GROVE_BODY],
    [
      doIt(
        5,
        'literacy',
        'the letter O',
        'ELOF: Literacy',
        'edu:trace:letter:o',
        [
          N('OBVIOUSLY starts with O. O is round, like a circle.'),
          N('(Draw a big O in the air with your finger.)'),
        ],
        'Your child recognised the letter O and traced its shape.',
      ),
    ],
  ),
  // Played instead of end-hazels-grove when the gate was taken away (letThemGo).
  scene(
    'end-hazels-grove-open',
    [N('GRAN HAZEL’S GROVE'), N('No gate now! Friends still lift and push at the empty air.'), ...HAZELS_GROVE_BODY],
    [
      doIt(
        1,
        'sel',
        'habits: things our bodies remember to do',
        'ELOF: Approaches to Learning',
        'edu:act:lift-push:air',
        [
          N('The gate is gone, but their hands remember it. That’s called a habit.'),
          N('(Lift and push at the air, like the friends do!)'),
          N('(What do you do every day without thinking? Wash your hands? Brush your teeth?)'),
        ],
        'Your child acted out a habit and thought about everyday habits of their own.',
      ),
    ],
  ),
  scene(
    'end-hazels-grove-last',
    [
      N('Sometimes, by the pond, you can almost hear her.'),
      HAZEL('Told you. Love is a method.', 'happy'),
      N('That means love is something you do, slowly, every day.'),
      N('Slow hands. Warm hearts. The end.'),
    ],
    [
      notice(
        2,
        'sel',
        'showing love through small kind actions',
        'CASEL: Relationship skills',
        [N('Love is feeding, waiting, sitting close, saying sorry.'), N('(Think of one kind thing to do for someone you love today.)')],
        'Your child thought of a kind action to show love.',
      ),
    ],
  ),
  scene(
    'end-eternal-dawn',
    [
      N('ETERNAL DAWN'),
      N('One of your Nubbins has stopped growing older.'),
      N('It is an Eternal now, like Moss!'),
      N('It sits on the hill and watches the gate.'),
      N('It decided you are worth it. It decided long ago.'),
    ],
    [
      notice(
        4,
        'sel',
        'feeling loved and chosen',
        'CASEL: Self-awareness',
        [
          N('Your Nubbin chose to stay with you, always.'),
          N('Being chosen feels warm inside, like a hug.'),
          N('(Who makes you feel like that? Talk about it together.)'),
        ],
        'Your child talked about the warm feeling of being loved and chosen, and who gives them that feeling.',
      ),
    ],
  ),
  scene(
    'end-eternal-dawn-moss',
    [
      N('Moss looks at it for a long time. Then he sits beside it.'),
      MOSS('Someone has to remember Byte’s shoelaces. Good. That’s good.', 'soft'),
      N('Two Eternals on the hill now.'),
      N('One talks. The other is learning how.'),
    ],
    [
      ask(
        0,
        'literacy',
        'rhyming words',
        'RF.K.2',
        [N('Moss is a bit cross sometimes. Which word rhymes with Moss?')],
        [
          opt('Cross', [N('Yes! Moss, cross. Cross Moss!')], true),
          opt('Cake', [N('Listen: Moss… cross. Cross rhymes with Moss!')]),
        ],
        'Your child listened for words that rhyme.',
      ),
    ],
  ),
  scene(
    'end-eternal-dawn-nomoss',
    [
      N('It sits in the very spot where Moss used to sit.'),
      N('Nobody taught it to. Nobody had to.'),
      N('Byte says it’s just luck.'),
      N('But Byte ties his shoelaces twice now, just in case.'),
    ],
    [
      doIt(
        3,
        'maths',
        'twice means two times',
        'K.CC.B.4',
        'edu:clap:count:2',
        [N('Twice means two times.'), N('(Clap twice with Byte: clap, clap!)')],
        'Your child learned that twice means two times, and clapped two claps.',
      ),
    ],
  ),
  scene(
    'end-eternal-dawn-last',
    [
      N('On Lantern Night it comes down and sits with everyone.'),
      N('It looks at each friend in turn, very carefully.'),
      N('It is learning you all by heart.'),
      N('That is what Eternals are for.'),
    ],
    [
      notice(
        2,
        'literacy',
        'the meaning of “by heart”',
        'ELOF: Language and Communication',
        [N('“By heart” means you know something so well you never forget it.'), N('(Do you know a song by heart? Sing a little bit!)')],
        'Your child learned what “by heart” means.',
      ),
    ],
  ),
  scene(
    'end-shadow-keeper',
    [
      N('THE SHADOW’S KEEPER'),
      N('Grey Nubbins come to your gate now, from far and wide.'),
      N('They are thin and quiet, and a bit scared.'),
      N('Sable meets each one. She sits near it. She doesn’t rush.'),
      N('She shows them how to be brave.'),
      N('Ash sits with her most days. Two grey friends together.'),
      N('Byte writes down every Nubbin who comes. Nobody ever leaves. He checks anyway.'),
    ],
    [
      ask(
        3,
        'sel',
        'welcoming someone new and shy',
        'CASEL: Social awareness',
        [N('A new Nubbin is shy. What helps it feel welcome?')],
        [
          opt('Sit near, be gentle, and wait', [N('Yes. That is just what Sable does.')], true),
          opt('Run up and grab it', [N('That might scare it. Sitting near, gently, and waiting helps, like Sable.')]),
        ],
        'Your child chose a gentle way to welcome someone shy.',
      ),
    ],
  ),
  scene(
    'end-shadow-keeper-last',
    [
      N('Clover tells every new Keeper the same thing.'),
      CLOVER('The grey stays. You can only make it lighter.', 'soft'),
      N('Sable is grey, and Sable is loved. Both are true.'),
      N('She is so light now. Light and happy.'),
    ],
    [
      doIt(
        1,
        'art',
        'shades: dark grey and light grey',
        undefined,
        'edu:sort:grey:dark-light',
        [
          N('Grey can be dark, like a storm cloud, or light, like a pigeon’s wing.'),
          N('(Find something dark and something light near you. Point to each.)'),
        ],
        'Your child compared dark and light shades of a colour.',
      ),
    ],
  ),
  scene(
    'end-moss-sleeps',
    [
      N('MOSS’S FLOWER'),
      N('Moss didn’t come back. He died, and everyone misses him.'),
      N('By spring, his flower by the flat stone was wide open.'),
      N('The wind goes through it, the way it went through Moss.'),
      N('Sable carries his little pale light, next to her own.'),
      N('You sit by his flower and tell it things.'),
      N('You are good at sitting still now. Moss would be proud.'),
    ],
    [
      ask(
        2,
        'science',
        'seasons: lots of flowers come up in spring',
        'ELOF: Scientific Reasoning',
        [N('When do lots of new flowers come up?')],
        [
          opt('In spring', [N('Yes! In spring the days get warmer and longer, and flowers come up.')], true),
          opt('In winter', [N('Winter is cold, so most flowers wait.'), N('They come up in spring, when it gets warmer.')]),
        ],
        'Your child learned that many flowers come up in spring.',
      ),
    ],
  ),
  scene(
    'end-moss-sleeps-last',
    [
      LUNA('Moss isn’t forgotten. We still remember him.', 'soft'),
      LUNA('Remember him louder.', 'soft'),
      N('So you do. You tell his stories out loud.'),
      N('Remembering helps us feel close to the ones who died.'),
    ],
    [
      doIt(
        1,
        'music',
        'loud and soft voices',
        undefined,
        'edu:say:loud-soft:moss',
        [N('Remember him louder! (Say “Moss!” in a big, loud voice.)'), N('(Now say it soft and gentle: “Moss.”)')],
        'Your child used a loud voice and a soft voice.',
      ),
    ],
  ),
  scene(
    'end-wild-grove',
    [
      N('WILD GROVE'),
      N('There is no gate now. Some Nubbins stay. Some don’t.'),
      N('Grey Nubbins from Corvin’s garden live in the Hollow, free.'),
      N('Each week you go there with a lantern and a bag of fruit.'),
      N('Fern sends lantern buns. The Hollow Nubbins won’t touch them!'),
      N('Fern says that proves they are fussy eaters.'),
      N('Some of them let you come near now.'),
      N('A little grey one let you touch its ear. Took two months. Worth it.'),
    ],
    [
      ask(
        2,
        'science',
        'animals live where their needs are met',
        'K-ESS3-1',
        [N('The Nubbins live in the Hollow. What do they need there?')],
        [
          opt('Food, water and a place to shelter', [N('Yes. Animals live where they can find food, water and shelter.')], true),
          opt('Toys and sweets', [N('Fun, but not needed! Animals need food, water and shelter.')]),
        ],
        'Your child learned that animals live where they can find food, water and shelter.',
      ),
    ],
  ),
  scene(
    'end-wild-grove-last',
    [
      NOVA('I saw you out there, with your lantern.', 'soft'),
      NOVA('You were busy. You didn’t wave.'),
      NOVA('You looked just like her.', 'soft'),
      N('Like Gran Hazel. Slow hands, warm heart.'),
    ],
    [
      doIt(
        0,
        'literacy',
        'clapping syllables',
        'RF.K.2',
        'edu:clap:syllables:lantern',
        [N('Let’s clap “lantern”: lan-tern.'), N('(Clap it together.) Two claps!')],
        'Your child clapped the syllables in a word.',
      ),
    ],
  ),
  scene(
    'end-empty-lantern',
    [
      N('THE EMPTY LANTERN'),
      N('Sable never came back. Luna still leaves fruit out every night.'),
      N('Some mornings it’s gone. Maybe Sable is near.'),
      N('On Lantern Night you light all four posts.'),
      N('Then you light one more, a small one, by the long grass.'),
      N('It’s for anyone who might be lost. To show the way home.'),
    ],
    [
      ask(
        4,
        'maths',
        'add 1 to 4',
        'K.OA.A.1',
        [N('Four lanterns, and one more. How many lanterns now?')],
        [
          opt('Five', [N('Yes! Four and one more makes five.')], true),
          opt('Four', [N('Count on from four: four… five! Five lanterns.')]),
        ],
        'Your child added one more to four.',
      ),
    ],
  ),
  scene(
    'end-empty-lantern-last',
    [
      N('Gran Hazel wrote it in her letter. You know it by heart.'),
      HAZEL('“When you don’t know what to do, sit down next to them and wait.”', 'soft'),
      N('So you are still waiting. That counts.'),
      N('Waiting is a kind of love. Sable may come home yet.'),
    ],
    [
      doIt(
        2,
        'sel',
        'waiting calmly',
        'CASEL: Self-management',
        'edu:wait:count:5',
        [N('Let’s practise waiting, like Gran Hazel.'), N('(Sit very still and count slowly to five together.)')],
        'Your child practised waiting calmly.',
      ),
    ],
  ),
  scene(
    'end-collector',
    [
      N('THE COLLECTOR'),
      N('This is the story of a Grove that got very, very quiet.'),
      N('Quiet can be nice. But too quiet is a little sad.'),
      N('Let’s see what happened. (Listen carefully.)'),
    ],
    [
      ask(
        2,
        'literacy',
        'opposites: quiet and noisy',
        'ELOF: Language and Communication',
        [N('A happy Grove is full of play.'), N('Is it quiet all the time, or noisy sometimes?')],
        [
          opt('Noisy sometimes', [N('Yes! Happy play is noisy sometimes. Quiet and noisy are opposites.')], true),
          opt('Quiet all the time', [N('Play makes noise: splashes, squeaks, giggles! Quiet and noisy are opposites.')]),
        ],
        'Your child used the opposites quiet and noisy.',
      ),
    ],
  ),
  scene(
    'end-collector-last',
    [
      N('The gate doesn’t stick any more. It opens by itself.'),
      N('You find that you miss the creak.'),
      N('Lift and push. Lift and push.'),
      N('Maybe one day you’ll want to hear who comes back.'),
    ],
    [
      doIt(
        2,
        'music',
        'keeping a steady beat',
        undefined,
        'edu:clap:beat:lift-and-push',
        [N('Say it with a beat: “Lift (clap) and push (clap)!”'), N('(Do it again, a little faster!)')],
        'Your child kept a steady beat with words and claps.',
      ),
    ],
  ),
  scene(
    'end-long-road',
    [
      N('THE LONG ROAD'),
      N('Sable is still here. Still grey. Still two steps away.'),
      N('She eats what you leave. She sleeps near you, not next to you.'),
      N('Every evening, you sit down near her and wait.'),
      N('Some evenings she is only one and a half steps away!'),
      N('Pixel’s sign still says MAYBE. You like it that way.'),
      N('Maybe is a good word. It has room in it.'),
    ],
    [
      ask(
        4,
        'maths',
        'comparing distance: nearer and further',
        'K.MD.A.2',
        [N('Two steps away, then one and a half. Is Sable getting nearer, or further?')],
        [
          opt('Nearer', [N('Yes! Fewer steps away means nearer. Slowly, slowly.')], true),
          opt('Further', [N('One and a half is less than two, so she’s nearer! Slowly, slowly.')]),
        ],
        'Your child compared two distances to say which was nearer.',
      ),
    ],
  ),
  scene(
    'end-long-road-last',
    [
      CLOVER('She stayed. Out of the whole valley, she picked this Grove.', 'soft'),
      CLOVER('Don’t you dare call that nothing.', 'soft'),
      N('Sable chose you. That is something. That is a lot.'),
      N('The long road is still a road. You walk it together.'),
    ],
    [
      notice(
        2,
        'sel',
        'patience: some friends take a long time to trust',
        'CASEL: Social awareness',
        [N('Some friends take a long time to feel safe with us.'), N('Being patient is a way of being kind.')],
        'Your child heard that patience is a way of being kind to a shy friend.',
      ),
    ],
  ),
];

// ================================================================ epilogue variants

const EPI: EduScene[] = [
  // ---------------------------------------------------------------- Wisp (S2)
  scene(
    'end-epi-wisp-spared',
    [
      N('Wisp lives under the cottage step now.'),
      N('He is grey. But he doesn’t shake any more.'),
      N('He still takes one warm thing a day. A sock. A bun.'),
      N('Then he gives most of it away!'),
      N('He hisses at hands. Then he climbs into them.'),
      WISP('…warm.', 'soft'),
    ],
    [
      ask(
        3,
        'sel',
        'giving and sharing make others happy',
        'CASEL: Relationship skills',
        [N('Wisp gives most of his warm things away. How do his friends feel?')],
        [
          opt('Happy and warm', [N('Yes! Giving to friends makes them happy. It makes Wisp warm inside too.')], true),
          opt('Cross', [N('They’re happy! A warm sock, a bun. Giving makes friends feel cared for.')]),
        ],
        'Your child thought about how giving and sharing make others feel.',
      ),
    ],
  ),
  scene(
    'end-epi-wisp-sable',
    [
      N('Wisp sleeps in the long grass.'),
      N('It’s the spot where Sable once shared her fruit with him.'),
      N('He comes in for breakfast every morning.'),
      N('Some mornings he stays to wash his face in the sun.'),
      WISP('…ours.', 'soft'),
    ],
    [
      ask(
        4,
        'sel',
        'sharing: what “ours” means',
        'CASEL: Relationship skills',
        [N('Wisp says “ours”. What does ours mean?')],
        [
          opt('It belongs to all of us', [N('Yes. Sable shared, and now Wisp shares too.')], true),
          opt('It’s only mine', [N('That’s “mine”. “Ours” means it belongs to all of us, shared.')]),
        ],
        'Your child learned the sharing word “ours”.',
      ),
    ],
  ),
  scene(
    'end-epi-wisp-driven',
    [
      N('You never saw Wisp up close again.'),
      N('Once, from the hill, you saw a thin grey shape, far away.'),
      N('You waved. Then it was gone.'),
      N('Now you leave a little fruit at the edge of the grass.'),
      N('Some of it gets eaten. Someone is near.'),
    ],
    [
      ask(
        2,
        'literacy',
        'first sounds: the /w/ sound of W',
        'RF.K.2',
        [N('You waved at Wisp. Wave and Wisp start the same way: w-w-w.'), N('Which word starts like Wisp too?')],
        [
          opt('Water', [N('Yes! W-w-water, w-w-wave, w-w-Wisp.')], true),
          opt('Fruit', [N('Fruit starts with fff. W-w-water starts like w-w-Wisp!')]),
        ],
        'Your child matched words by their first sound.',
      ),
    ],
  ),
  scene(
    'end-epi-wisp-none',
    [
      N('Some nights, fruit goes missing from the long grass.'),
      N('Someone thin and quick takes it. Zip!'),
      N('So you leave a little more the next night.'),
      N('Gran Hazel would have done that too.'),
    ],
    [
      ask(
        1,
        'science',
        'animals need food every day',
        'K-LS1-1',
        [N('Someone small and hungry takes the fruit. Why?')],
        [
          opt('Because animals need food to live', [N('Yes. Every animal needs food, every day. So you leave a little more.')], true),
          opt('To play catch with it', [N('Maybe! But mostly they’re hungry. Animals need food to live.')]),
        ],
        'Your child learned that animals need food to live.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- Corvin's gate (S9)
  scene(
    'end-epi-gate-family',
    [
      N('Corvin comes every Sunday. He sits by the pond.'),
      N('He is learning to sit quietly. He’s not very good yet.'),
      N('He comes in the right way every time: lift and push.'),
      N('Ember sits on the other side. She’s still cross with him.'),
      N('But some Sundays, she passes him the teapot.'),
    ],
    [
      ask(
        4,
        'sel',
        'being kind even while still feeling cross',
        'CASEL: Relationship skills',
        [N('Ember is still cross with Corvin. What kind thing does she do?')],
        [
          opt('She passes him the teapot', [N('Yes. You can feel cross and still do a kind thing.'), N('That’s how mending starts.')], true),
          opt('She pushes him in the pond', [N('Splash! No, she doesn’t. She passes him the teapot. A small kind thing.')]),
        ],
        'Your child noticed that we can be kind even while we still feel cross.',
      ),
    ],
  ),
  scene(
    'end-epi-gate-guest',
    [
      N('Corvin comes when he is asked. That’s not very often.'),
      N('He knocks on the gatepost every time. Knock, knock, knock! Three, never four.'),
      N('You let him in every time.'),
      N('Once he brought flowers for the gatepost. You put them in a jar.'),
    ],
    [
      doIt(
        1,
        'social-studies',
        'good manners: knocking and waiting to be asked in',
        'D2.Civ.8.K-2',
        'edu:knock:count:3',
        [
          N('Corvin knocks and waits to be asked in. That’s good manners.'),
          N('(Knock on the table three times, like Corvin: knock, knock, knock!)'),
        ],
        'Your child practised knocking and waiting, a polite way to visit.',
      ),
    ],
  ),
  scene(
    'end-epi-gate-shut',
    [
      N('Corvin doesn’t come in.'),
      N('Some mornings there are footprints in the dew by the gate.'),
      N('They stop at the gate, and turn round.'),
      N('You don’t sweep them away. Maybe one day he’ll knock.'),
    ],
    [
      ask(
        1,
        'science',
        'tracks tell us who has been somewhere',
        'ELOF: Scientific Reasoning',
        [N('What can footprints tell us?')],
        [
          opt('Where someone walked', [N('Yes! Footprints show where someone went, and which way they turned.')], true),
          opt('What someone ate', [N('Footprints can’t show that! They show where someone walked.')]),
        ],
        'Your child learned that footprints are clues to where someone has been.',
      ),
    ],
  ),
  scene(
    'end-epi-gate-none',
    [
      N('There is a chair by the pond. Nobody sits in it.'),
      N('Gran Hazel put it there years ago.'),
      N('You never asked who it was for.'),
      N('You leave it where it is. Just in case.'),
    ],
    [
      ask(
        0,
        'literacy',
        'rhyming words',
        'RF.K.2',
        [N('Chair! Which word rhymes with chair?')],
        [
          opt('Bear', [N('Yes! Chair, bear. A bear in a chair!')], true),
          opt('Pond', [N('Listen: chair… bear. Bear rhymes with chair!')]),
        ],
        'Your child listened for words that rhyme.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- Hazel's walk (S10)
  scene(
    'end-epi-walk-you',
    [
      N('You walked Gran Hazel up the hill.'),
      N('You know just which flower is hers.'),
      N('You go up and tell it things.'),
      N('Mostly the silly bits. She liked those best.'),
    ],
    [
      doIt(
        3,
        'literacy',
        'telling a short story out loud',
        'SL.K.1',
        'edu:tell:story:flower',
        [N('(What silly thing happened today? Tell Gran Hazel’s flower.)')],
        'Your child told a short story about their day.',
      ),
    ],
  ),
  scene(
    'end-epi-walk-moss',
    [
      N('Moss stayed on the hill with Gran Hazel all winter.'),
      N('In spring, her flower opened.'),
      N('Then Moss came down the path, thinner, and sat by the pond.'),
      MOSS('I decided.', 'soft'),
      N('He decided to stay with you. Hooray!'),
    ],
    [
      doIt(
        1,
        'science',
        'the order of the seasons',
        'K-ESS2-1',
        'edu:order:seasons',
        [N('Winter, then spring! Say the seasons in order with me.'), N('(Spring, summer, autumn, winter… and round again to spring.)')],
        'Your child said the four seasons in order.',
      ),
    ],
  ),
  scene(
    'end-epi-walk-moss-stayed',
    [
      N('Moss rode up the hill on Gran Hazel’s shoulder.'),
      N('At the top, he turned round to look at the Grove. At last!'),
      N('He stayed up there with her. He faded there. That means he died.'),
      N('In spring, two flowers came up, very close together.'),
      N('They lean in, like two old friends sharing a joke.'),
      N('Best friends, side by side.'),
    ],
    [
      notice(
        5,
        'sel',
        'friendship: best friends stay close',
        'CASEL: Relationship skills',
        [N('Gran Hazel and Moss were best friends for a very long time.'), N('(Who is a best friend of yours? What do you like doing together?)')],
        'Your child talked about a close friendship.',
      ),
    ],
  ),
  scene(
    'end-epi-walk-sable',
    [
      N('Sable walked Gran Hazel up the hill.'),
      N('She came down alone and sat on your step.'),
      N('Now she sits there every evening, looking at the hill.'),
      N('When the lanterns are lit, she comes inside.'),
    ],
    [
      ask(
        3,
        'science',
        'day and night: lanterns are lit when it gets dark',
        '1-ESS1-1',
        [N('When do we light the lanterns?'), N('In the bright day, or when it gets dark?')],
        [
          opt('When it gets dark', [N('Yes. Every evening the sun goes down and it gets dark.'), N('So we light lanterns.')], true),
          opt('In the bright day', [N('In the day the sun gives us light.'), N('We light lanterns when it gets dark.')]),
        ],
        'Your child connected evening and darkness to the pattern of day and night.',
      ),
    ],
  ),
  scene(
    'end-epi-walk-corvin',
    [
      N('Corvin carried Gran Hazel’s lantern up the hill.'),
      N('He left it there with her, still lit.'),
      N('At first light, he went back up and fetched it.'),
      N('It hangs on a hook by the cottage door now.'),
      N('Corvin looks after it himself. Snip, snip, he trims the wick.'),
    ],
    [
      notice(
        4,
        'health',
        'fire safety: only grown-ups light flames',
        'ELOF: Perceptual, Motor, and Physical Development',
        [N('Lanterns and candles have real flames. Flames are hot.'), N('Only grown-ups light them and look after them.')],
        'Your child heard a simple fire-safety rule.',
      ),
    ],
  ),
  scene(
    'end-epi-walk-alone',
    [
      N('You walked Gran Hazel up the hill, just you two.'),
      N('Nobody else saw her go.'),
      N('When friends ask, you tell them about it.'),
      N('But the waving part is a special memory, just for you.'),
    ],
    [
      doIt(
        3,
        'sel',
        'keeping a happy memory of someone we love',
        'CASEL: Self-awareness',
        'edu:wave:goodbye',
        [N('Wave like Gran Hazel! (One hand up high, waving.)'), N('Remembering her wave can make us smile.')],
        'Your child acted out a loving memory of someone who died.',
      ),
    ],
  ),
  scene(
    'end-epi-told',
    [
      N('The whole valley walked Gran Hazel to the bottom of the hill.'),
      N('Now they meet there once a year, on the day she went up.'),
      N('They stand together, and remember her.'),
      N('Fern brings lantern buns. They come out right every time now!'),
      N('She says it’s because she stopped trying so hard.'),
      N('She says this mostly to the buns.'),
    ],
    [
      notice(
        2,
        'social-studies',
        'traditions: things we do every year to remember',
        'D2.His.2.K-2',
        [N('Something a family or a town does every year is called a tradition.'), N('(Do you have a tradition? Birthdays count!)')],
        'Your child learned what a tradition is and thought of one of their own.',
      ),
    ],
  ),
  scene(
    'end-epi-secret',
    [
      N('Gran Hazel left a letter under Fern’s stone.'),
      N('That’s how the valley found out.'),
      N('Clover cried. Sparks tried to fix the letter. Byte made a chart.'),
      N('Then they all came up the hill with lanterns.'),
      N('They argued about where she’d want them to stand. Just like family.'),
    ],
    [
      ask(
        1,
        'literacy',
        'what letters are for: talking through writing',
        'ELOF: Literacy',
        [N('Gran Hazel wrote a letter. What is a letter for?')],
        [
          opt('Telling someone something, in writing', [N('Yes. A letter lets us talk to people, even when we’re not there.')], true),
          opt('Making a hat', [N('Ha! A letter is for telling someone something, in writing.')]),
        ],
        'Your child learned that writing carries a message from one person to another.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- Aldous's letter (S13)
  scene(
    'end-epi-mill-kept',
    [
      N('Long ago, Corvin’s dad, Aldous, wrote him a letter.'),
      N('Aldous died a long time ago. But his words are still here.'),
      N('Now Corvin reads the letter every Sunday.'),
      N('Old Tobin told everyone. Tobin tells everyone everything!'),
      N('The letter is soft as cloth now, from all the reading.'),
    ],
    [
      notice(
        4,
        'literacy',
        'reading favourite words again and again',
        'SL.K.1',
        [N('Corvin reads the same letter again and again.'), N('(Do you have a favourite book you love to hear again? Tell about it.)')],
        'Your child talked about a favourite book they like to hear again.',
      ),
    ],
  ),
  scene(
    'end-epi-mill-kept-ungiven',
    [
      N('Aldous’s letter is still in a tin box under your bed.'),
      N('It’s for Corvin. It’s waiting for the right day.'),
      N('You take it out sometimes. You don’t read it.'),
      N('It isn’t yours. You’re only keeping it safe.'),
    ],
    [
      ask(
        3,
        'social-studies',
        'respecting other people’s things',
        'D2.Civ.8.K-2',
        [N('Is it OK to read someone else’s letter?')],
        [
          opt('No, it belongs to them', [N('That’s right. Their letter, their words. We keep it safe for them.')], true),
          opt('Yes, any time', [N('A letter belongs to the person it’s for.'), N('We keep it safe, and don’t peek.')]),
        ],
        'Your child thought about respecting other people’s belongings.',
      ),
    ],
  ),
  scene(
    'end-epi-mill-burned',
    [
      N('Old Tobin lights the mill stove on cold mornings.'),
      N('He tells the Nubbins stories by the fire.'),
      N('He never finishes a story. Not one!'),
      N('You put Aldous’s letter in the stove. It burned up.'),
      N('Corvin never knew about his dad’s letter. You still wonder about that.'),
      N('Tobin says most things are a bit of both.'),
    ],
    [
      ask(
        2,
        'literacy',
        'stories have a beginning, a middle and an end',
        'RL.K.3',
        [N('Every story has a beginning, a middle and an end.'), N('Which part does Tobin forget?')],
        [
          opt('The end', [N('Yes! Tobin never gets to the end. Silly Tobin.')], true),
          opt('The beginning', [N('He always starts! He just never finishes. He forgets the end.')]),
        ],
        'Your child learned that stories have a beginning, a middle and an end.',
      ),
    ],
  ),
  scene(
    'end-epi-mill-grave',
    [
      N('You left Aldous’s letter at his grave, under the trees.'),
      N('Aldous was Corvin’s dad. He died a long time ago.'),
      N('By spring, the rain had washed the ink away.'),
      N('Someone keeps the grass short around his stone.'),
      N('The mill wheel turns slowly beside it. Round and round.'),
    ],
    [
      ask(
        4,
        'maths',
        'naming shapes: a wheel is a circle',
        'K.G.A.2',
        [N('The mill wheel goes round and round. What shape is a wheel?')],
        [
          opt('A circle', [N('Yes! Wheels are circles, so they can roll and turn.')], true),
          opt('A square', [N('A square has corners, so it would bump! Wheels are circles.')]),
          opt('A triangle', [N('A triangle has three corners, so it would bump! Wheels are circles.')]),
        ],
        'Your child named the shape of a wheel and why it rolls.',
      ),
    ],
  ),
  // ---------------------------------------------------------------- Cinder (S19)
  scene(
    'end-epi-cinder-forgiven',
    [
      N('In spring, a new red flower grows on the hill.'),
      N('It grows a little apart, as if it isn’t sure it can stay.'),
      N('By summer, the other flowers lean towards it. Welcome!'),
      N('The long-grass lantern is warm now. Grey Nubbins sleep around it.'),
      N('Children skip to Cinder’s rhyme, then run to touch the red flower.'),
    ],
    [
      doIt(
        2,
        'art',
        'naming colours: red and yellow',
        undefined,
        'edu:tap:colour:red',
        [N('Cinder’s flower is red. Briar’s flower is yellow.'), N('(Point to something red near you. Now something yellow!)')],
        'Your child named and found the colours red and yellow.',
      ),
    ],
  ),
  scene(
    'end-epi-cinder-remembered',
    [
      N('In spring, a new red flower grows on the hill, a little apart.'),
      N('You tell Cinder’s story to anyone who asks.'),
      N('The long-grass lantern is warm now.'),
      N('Children skip to her rhyme. At the end, one shouts, “She loved them!”'),
      N('The rest shout, “Too tight!” Then they all run off, laughing.'),
    ],
    [
      ask(
        4,
        'literacy',
        'rhyming words from Cinder’s rhyme',
        'RF.K.2',
        [N('Cinder’s rhyme goes: “held them close and tight, kept them warm one winter night.”'), N('Which word rhymes with tight?')],
        [
          opt('Night', [N('Yes! Tight, night. A gentle hug is the best kind, not too tight.')], true),
          opt('Warm', [N('Listen: tight… night. Night rhymes with tight!')]),
        ],
        'Your child found rhyming words in a skipping rhyme.',
      ),
    ],
  ),
];

// ================================================================ the campaign slice

export const EDU_CAMPAIGN_3_SPROUT: EduCampaign = {
  id: 'sprout:book3',
  band: 'sprout',
  chapters: {
    9: {
      title: 'Corvin’s Garden',
      goalText: 'Go up the valley to Corvin’s cold garden. Choose what to do.',
      hint: 'Pick one in the story. Something cold comes home with you.',
    },
    10: {
      title: 'The Long Night',
      goalText: 'Light all four lanterns. Keep them bright all night long.',
      hint: 'Tap each lantern to light it. If the cold puffs one out, tap it again. Lots of pats help Moss too.',
    },
    11: {
      title: 'Gran Hazel',
      goalText: 'Talk to three friends. Then sit with Gran Hazel.',
      hint: 'Walk up to a friend and tap them. Count to three!',
    },
    12: {
      title: 'Keepers',
      goalText: 'Choose what the Grove will be.',
      hint: 'Pick in the story. Everything you did helps choose the ending.',
    },
  },
  scenes: [...C9, ...C10, ...C11, ...C12, ...ENDS, ...EPI],
  endings: {
    collector: {
      title: 'The Collector',
      how: 'This ending is not in the Little Sprouts story. Here the stone always goes back to the water.',
    },
    'empty-lantern': {
      title: 'The Empty Lantern',
      how: 'Sable gets too scared and runs away, and doesn’t come back. Slow, gentle hands keep her near.',
    },
    'eternal-dawn': {
      title: 'Eternal Dawn (secret)',
      how: 'Help one of your own Nubbins grow all the way into an Eternal, and be Sable’s best friend.',
    },
    'wild-grove': {
      title: 'Wild Grove',
      how: 'Open all of Corvin’s pens at once. Then take the gate away at the end.',
    },
    'hazels-grove': {
      title: 'Gran Hazel’s Grove',
      how: 'Be Sable’s best friend. Give Moss lots of pats. Make friends with Corvin. Send the stone back. Either gate choice at the end is fine.',
    },
    'moss-sleeps': {
      title: 'Moss’s Flower',
      how: 'Be Sable’s best friend, but give Moss only a few pats before the Long Night.',
    },
    'shadow-keeper': {
      title: 'The Shadow’s Keeper',
      how: 'Be Sable’s best friend and give Moss lots of pats, but don’t make friends with Corvin.',
    },
    'long-road': {
      title: 'The Long Road',
      how: 'Sable is still with you, but not your best friend yet. Keep sitting with her.',
    },
  },
  notes:
    'Sprout (ages 3–6, read aloud) for Book Three: chapters 9–12, all end-* scenes, and the end-epi-mill-* and ' +
    'end-epi-cinder-* epilogues (SIDE_STORIES_NEW_3_VARIANTS). One lesson per scene, two in the big ones (c9-open, ' +
    'c9-close, c10-open, c10-vigil, c10-dawn, c11-open, c11-close, c12-open, c12-close). ' +
    'CHOICES. c10-edge offers only “unmake” (defaultChoice: unmake), per EDU-STYLE. Every other choice is kept with its ' +
    'original id, set and friendship. The keep-stone and sell scenes (c9-shard-collector, c10-kept, c11-moss-kept, c11-cold-hands, ' +
    'end-collector-kept, end-collector-sold, end-epi-wisp-kept) are cut: no sprout choice reaches them (2026-10-22). The older ' +
    'collector-route scenes c9-partner and c9-open-sold remain, unreachable, and end on “it’s not too late”. ' +
    'HARD THINGS. Hazel is “Gran Hazel”. She tells the child herself in c11-open: “I am very poorly. The doctors can’t ' +
    'make me better.” No illness is named. Her death is said plainly in c12-close, with the flower and togetherness as the ' +
    'comfort. Moss’s fading is defined as dying wherever it happens (c10-bank-moss-gone, c10-moss-fades, ' +
    'c10-moss-mourned, c11-moss-gone, c11-moss-passed, end-moss-sleeps, end-epi-walk-moss-stayed). No death is called sleep: the ' +
    'moss-sleeps ending is titled “Moss’s Flower” in sprout, and “a very long sit-down” is not used. Where a living ' +
    'character sleeps right after a scary moment (Wisp in c10-bank-wisp), the text says he is breathing and alive. ' +
    'Corvin says sorry in c9-open (confront), c9-shard-reconciled, c11-gate (tea), and c12-walk-corvin. ' +
    'c12-foot-secret: Hazel says she has written everyone a letter rather than asking the child to keep a secret, and the ' +
    'lesson is that a letter is a kind way to say goodbye (the safe-secrets reminder was moved out, 2026-10-22: it made Gran’s goodbye sound like a bad secret). ' +
    'VERBATIM KEPT. “Lift and push”, “Took two months. Worth it.”, “Safe is not the same as…” (as “happy” for sprout), ' +
    '“The hands are slower. That’s better, actually.”, “No big fuss. A small hug will do.” (replacing an idiom), “A Grove isn’t the Nubbins, love. ' +
    'It’s the people who show up when the lanterns are lit.”, “Told you. Love is a method.”, “The grey stays. You can only ' +
    'make it lighter.”, “Don’t you dare call that nothing.”, “Love them anyway. Love them harder because of it.”, the Lantern ' +
    'Song chorus and two lines of Cinder’s rhyme. ' +
    'VARIANTS (2026-10-14 mirror of campaign-book3.ts). c9-open-sold replaces c9-open on the Collector route (same ' +
    'choice ids; shares C9_ARRIVE and C9_GARDEN; its C9_CHOICES_SOLD adds two bargain lines so your old Nubbin comes ' +
    'home on screen). c11-moss-kept (keep route) and c11-moss-passed (after ' +
    'c10-moss-fades; shares MOSS_GONE_TAIL with c11-moss-gone) are new Moss add-ons. end-hazels-grove-open replaces ' +
    'end-hazels-grove when letThemGo (shares HAZELS_GROVE_BODY); Gran Hazel’s Grove no longer needs “A home”. ' +
    'c10-vigil: the Lantern Song answer line is speaker chorus. c11-close opens with “Days go by” (chapter 11 spans a ' +
    'few days); the main scene’s s8Done line swap needs nothing here, because the sprout c11-close never mentions the ' +
    'thin grey Nubbin. S9 LINE: if s9-ask has been seen, insert after c11-close line 0 “Then comes the evening Corvin ' +
    'asks at the gate.” (as in the main scene’s note). Corvin’s c11-gate is a return (he said in S9 he would stay till first light), and Hazel’s line is ' +
    '“It’s your gate now”.',
};

export const CHECKS: string[] = [
  'edu:tap:row:third',
  'edu:share:pie:2',
  'edu:copy:sniff:sable',
  'edu:count:keepers:10',
  'edu:sing:lantern-song',
  'edu:hold:arm-up:5',
  'edu:find:colour:gold',
  'edu:say:quiet-to-loud',
  'edu:tell:memory:moss',
  'edu:count:lanterns:4',
  'edu:listen:quiet',
  'edu:make:memory:moss',
  'edu:order:gate:lift-push',
  'edu:count:buns:5',
  'edu:step:count:2',
  'edu:count:posts:4',
  'edu:trace:letter:o',
  'edu:clap:count:2',
  'edu:sort:grey:dark-light',
  'edu:say:loud-soft:moss',
  'edu:clap:syllables:lantern',
  'edu:wait:count:5',
  'edu:clap:beat:lift-and-push',
  'edu:sort:things:warm-cold',
  'edu:knock:count:3',
  'edu:tell:story:flower',
  'edu:order:seasons',
  'edu:wave:goodbye',
  'edu:tap:colour:red',
  'edu:act:lift-push:air',
];
