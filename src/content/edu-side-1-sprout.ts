/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): side stories S1–S10.
 *
 * Sources: side-stories-fun.ts (S1, S3, S4, S5), side-stories-main.ts (S2, S9, S10 and
 * SIDE_STORIES_MAIN_VARIANTS) and side-stories-fun-2.ts (S6, S7, S8 and
 * SIDE_STORIES_FUN_2_VARIANTS). One EduScene per original
 * scene, id `sprout:<original id>`. See EDU-STYLE.md.
 *
 * - Choice ids, `set` flags and `friendship` are copied from the originals so every flag still
 *   works. Sprout leaves out only S2's "drive him off" (`driven`): s2-night has
 *   `defaultChoice: 'spared'`.
 * - Variant scenes live in EDU_SIDE_1_SPROUT_VARIANTS, not inside the quests, so each is listed
 *   once. They play wherever the main variant would (same `of`).
 * - EduScene has no scene-level `set`; the sim should keep applying the original scene's `set`
 *   (s9-dusk sets s9Started, s8-reunion sets s8Reunited).
 * - Hard things follow EDU-STYLE.md: death is said plainly (Briar, Fossil, Null, Hazel), Hazel is
 *   "very poorly" with no illness named, and Corvin is a lonely man who did a wrong thing long
 *   ago and says sorry.
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
const HZ = say('hazel');
const FE = say('fern');
const MA = say('marina');
const SP = say('sparks');
const CL = say('clover');
const PX = say('pixel');
const LU = say('luna');
const EM = say('ember');
const BY = say('byte');
const DU = say('dusty');
const NO = say('nova');
const C = say('corvin');
const W = say('wisp');
const YH = say('young-hazel');
const BR = say('briar');
const CI = say('cinder');

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

// ================================================================== S1 The Wardens’ Walk
const S1: EduQuest = quest(
  's1',
  'The Wardens’ Walk',
  {
    's1-step1': {
      goal: 'Walk with Moss to the stream lantern. Go slowly!',
      hint: 'Stay right beside Moss. If you go too fast, he stops and waits.',
    },
    's1-step-boats': {
      goal: 'Float a leaf-boat down the stream to the pond.',
      hint: 'Tap the water behind the boat. Keep it away from the reeds. You can always try again.',
    },
    's1-step2': {
      goal: 'Walk with Moss to the lantern by the old wall.',
      hint: 'The old wall is on the north side of the Grove. Go on a quiet evening.',
    },
    's1-step3': {
      goal: 'Walk with Moss to his own lantern, by the pond.',
      hint: 'Go in the evening. Moss likes the evening light.',
    },
    's1-step4': {
      goal: 'Moss will tell you about the last lantern later.',
      hint: 'Keep playing the story. Moss will come and find you.',
    },
  },
  [
    sc(
      's1-ask',
      [
        N('Night. Three lanterns glow. One post is dark.'),
        N('Moss sits by your boot. He looks at the dark post.'),
        Y('Why is that one dark?'),
        M('Not tonight. Ask me something else.', 'think'),
        M('Each lantern post keeps a little memory.', 'soft'),
        M('Four posts. Four memories. Shall we walk to them?'),
        M('Slowly, mind. I am older than the trees.', 'happy'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 4; 3 and 1 more make 4',
          standard: 'K.OA.A.1',
          kind: 'do',
          after: 0,
          check: 'edu:count:lantern-posts:4',
          lines: [
            N('(Count the posts together: one, two, three, four.)'),
            M('Three bright ones, and one dark one. That makes four.', 'think'),
          ],
          parentNote: 'Counted four lantern posts and saw that three and one more make four.',
        },
      ],
      {
        choices: [
          {
            id: 'walk',
            label: 'Walk slowly beside him.',
            set: { 's1-pace': 'walk' },
            then: [
              N('Step… step… step. Your Nubbin zooms ahead. Zoom!'),
              N('Your Nubbin zooms back. Plop! It sits on Moss’s foot.'),
              M('Good. You didn’t huff. Hazel huffed for years.', 'happy')],
          },
          {
            id: 'carry',
            label: 'Offer to carry him.',
            set: { 's1-pace': 'offered' },
            then: [M('No, thank you. I have legs.', 'think'), M('Short ones. Old ones. But mine.', 'happy')],
          },
          {
            id: 'which',
            label: 'Ask which lantern comes first.',
            set: { 's1-pace': 'asked' },
            then: [M('Briar’s, by the stream. She hated waiting!', 'happy')],
          },
        ],
      },
    ),
    sc(
      's1-briar',
      [
        N('The stream lantern hisses in the damp. Fssss.'),
        M('This was Briar’s post. Briar loved to laugh.', 'happy'),
        M('She laughed at frogs. She laughed at rain. She laughed at me!'),
        M('When Briar was very, very old, she died.', 'soft'),
        M('That means her body stopped working. It won’t start again.', 'soft'),
        N('The light turns gold. A happy voice whispers.'),
        BR('If I’m not back by spring, plant something nice!', 'happy'),
        M('A yellow flower grew where she sat. The very first one.', 'soft'),
        M('When I see it, I remember her laugh.', 'happy'),
      ],
      [
        {
          domain: 'sel',
          skill: 'remembering someone we love who has died',
          standard: 'ELOF: Social and Emotional Development',
          kind: 'notice',
          after: 8,
          lines: [
            M('We keep remembering the ones we love. With flowers. With stories.', 'soft'),
            N('(Ask: what makes you laugh, like Briar? Wait for an answer.)'),
          ],
          parentNote: 'Heard plainly what dying means, and that flowers and stories help us remember people we love.',
        },
      ],
    ),
    sc(
      's1-boats-ask',
      [
        M('Briar had a game. Leaf-boats!', 'happy'),
        M('A leaf, a candle a grown-up lights, and off down the stream.'),
        M('If yours reaches the pond, you must laugh out loud.'),
        M('That’s the rule. Briar made it up.', 'think'),
        N('Moss folds a big green leaf. Fold, fold, fold.'),
        M('Mine always tips over. Every single year.', 'think'),
      ],
      [
        {
          domain: 'science',
          skill: 'wind pushes a sail',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'do',
          after: 5,
          check: 'edu:blow:wind:sail',
          lines: [
            M('A sail catches the wind. The wind pushes the boat along.', 'think'),
            N('(Blow like the wind together. Whoosh!)'),
          ],
          parentNote: 'Learned that wind pushes on a sail and moves a boat, and blew like the wind.',
        },
      ],
      {
        choices: [
          {
            id: 'flat',
            label: 'Make yours wide and flat.',
            set: { 's1-boat': 'flat' },
            then: [M('Briar’s way! Flat as a pancake.', 'happy')],
          },
          {
            id: 'sail',
            label: 'Give yours a sail.',
            set: { 's1-boat': 'sail' },
            then: [M('A sail! Nobody ever thought of a sail!', 'shock'), M('Briar would have loved that.', 'happy')],
          },
        ],
      },
    ),
    sc(
      's1-boats',
      [
        N('Splash! Moss’s boat tips over at once.'),
        M('Every year.', 'think'),
        N('Your boat bobs past the stepping stones.'),
        N('It spins at the reeds. Round and round!'),
        N('Then it slides onto the pond. The candle is still lit!'),
        N('Your Nubbin sits down, plop, in surprise.'),
        M('Well? Rules are rules!', 'happy'),
        N('(Laugh out loud together. Ha ha ha!)'),
        N('Your laugh rings out across the water.'),
        M('There. That’s Briar’s sound. I missed it.', 'soft'),
        N('Moss’s boat floats back to the bank, upside down.'),
        M('Briar folded my first boat. I still fold it her way.', 'think'),
        M('My boat never gets there. Never! Hmm.'),
        M('Maybe it is the fold.'),
        N('Moss looks at his boat. He does not trust it at all.'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'first, next, last',
          standard: 'RL.K.3',
          kind: 'ask',
          after: 4,
          prompt: [M('Tell me the boat’s trip. Where did it go first?', 'think')],
          options: [
            opt('Past the stepping stones', [M('Yes! First the stones. Next the reeds. Last, the pond!', 'happy')], true),
            opt('Round the reeds', [M('Round the reeds already? Whoosh! Not yet, little leaf!'), M('That came next. First it passed the stones. Then the reeds. Then the pond.')]),
            opt('Onto the pond', [M('Onto the pond already? Splash! Little leaf, wait your turn!'), M('That came last! First the stones, next the reeds, last the pond.')]),
          ],
          parentNote: 'Retold a short journey in order using first, next and last.',
        },
      ],
    ),
    sc(
      's1-wall-ask',
      [
        N('A few evenings later, Moss waits at the gate.'),
        M('The old wall next. Hush’s post.'),
        N('Byte leans on the wall with a notebook.'),
        BY('Is he really talking? Ask him something only he knows!', 'think'),
        M('Tell Byte his shoelace is undone.'),
        N('Byte looks down. It is! Byte goes very quiet.'),
        M('Hush was the quiet one. Hush was a good listener.', 'think'),
        N('Shh. Gurgle! Hic! That is Byte’s tummy. Byte goes quieter.'),
        Y('What did Hush listen to?'),
        M('Everything. Come on. Mind the step.'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'quiet, careful listening',
          standard: 'ELOF: Language and Communication',
          kind: 'do',
          after: 6,
          check: 'edu:listen:sounds:quiet',
          lines: [M('Let’s listen like Hush. Shh.', 'soft'), N('(Sit very still. Can you name one sound you hear?)')],
          parentNote: 'Practised sitting still and listening carefully, then named a sound they heard.',
        },
      ],
    ),
    sc(
      's1-hush',
      [
        N('The lantern by the old wall burns low and quiet.'),
        M('After the long white winter, some Nubbins couldn’t move.', 'sad'),
        M('They sat very still, just where they were put.'),
        M('Everyone else was busy. Hush was not.'),
        M('Hush sat with them. Every single day.', 'soft'),
        M('She didn’t try to fix them. She kept them company.'),
        M('So they were never on their own.', 'soft'),
        M('Hush called it keeping. Keeping a friend company.', 'soft'),
      ],
      [
        {
          domain: 'sel',
          skill: 'helping a sad friend by staying with them',
          standard: 'CASEL: Social awareness',
          kind: 'ask',
          after: 6,
          prompt: [M('If a friend feels sad, what could you do?', 'think')],
          options: [
            opt('Sit beside them and stay', [M('Yes. That’s what Hush did. Staying close helps.', 'soft')], true),
            opt('Leave them on their own', [
              M('Left alone in the cold? Brrr! They would shiver.', 'soft'), M('They might feel lonely then. Hush would sit beside them. Staying helps.', 'soft'),
            ]),
            opt('Tell them to stop being sad', [
              M('“Stop being sad!” Poof… the sad stays right where it is.', 'soft'), M('Sad feelings don’t stop when we’re told. Sitting with them helps more.', 'soft'),
            ]),
          ],
          parentNote: 'Thought about how to help a sad friend: staying close and keeping them company.',
        },
      ],
    ),
    sc(
      's1-pond-ask',
      [
        N('Moss is by the pond, at his own post. Plop! A frog hops in.'),
        M('My lantern. I like this one best.', 'think'),
        M('Sit beside me. Closer. There.', 'soft'),
        M('That’s where Hazel sat. Long, long ago.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'position words: beside, on, behind',
          standard: 'K.G.A.1',
          kind: 'do',
          after: 2,
          check: 'edu:sit:beside:moss',
          lines: [
            N('(Where are you sitting? Beside Moss!)'),
            M('Beside me. Not on me. Not behind me. Beside.', 'happy'),
          ],
          parentNote: 'Used the position words beside, on and behind.',
        },
      ],
      {
        choices: [
          {
            id: 'sit',
            label: 'Sit where Hazel sat.',
            set: { 's1-sat': true },
            then: [N('The grass is flat there. She sat here lots.'), M('Just right.', 'happy')],
          },
          {
            id: 'why',
            label: 'Ask why he chose her.',
            set: { 's1-asked-why': true },
            then: [M('Patience! I’m getting to it.', 'happy')],
          },
        ],
      },
    ),
    sc(
      's1-hazel',
      [
        M('Hazel came here young. She was in a big hurry.', 'happy'),
        M('She wanted the Nubbins to love her by Tuesday!'),
        N('The light turns gold. It’s a memory. Snow falls.'),
        N('A young Hazel sits by the frozen pond. Her coat is too big!'),
        YH('I don’t know what to do. Do you?', 'sad'),
        M('I sat beside her all winter. I said nothing.', 'happy'),
        M('She wriggled and fidgeted. But she never asked me to talk.', 'soft'),
        M('When the ice melted, I looked up and said, “You’ll do.”', 'happy'),
        M('That means: you are just right.', 'soft'),
        M('She laughed so hard, she fell in the pond. Splosh!'),
        M('Only up to her ankles. She still blames me.', 'happy'),
        M('Sit next to them and wait. That’s Hazel’s third rule.', 'soft'),
      ],
      [
        {
          domain: 'science',
          skill: 'water freezes into ice and melts back',
          standard: '2-ESS2-3',
          kind: 'notice',
          after: 3,
          lines: [
            M('In winter, the pond freezes. Cold turns water into ice.', 'think'),
            M('When it warms up, the ice melts back into water. Splash!', 'happy'),
          ],
          parentNote: 'Learned that cold turns water into ice, and warmth melts it back into water.',
        },
      ],
    ),
    sc(
      's1-wait',
      [
        N('You look at the last post, by the long grass.'),
        M('Not that one. Not yet.', 'sad'),
        N('Down the lane, children skip and sing. Whee!'),
        N('“Cinder held them close and tight, / kept them warm one winter night;”'),
        N('“when the morning came to call, / they did not move at all.”'),
        M('The children know the words.', 'soft'),
        M('But Cinder was kind too. The song forgets that.', 'soft'),
        M('I’ll tell you about Cinder. Another day.'),
        M('Now: feed them, and off to bed.', 'think'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'hearing rhymes',
          standard: 'RF.K.2',
          kind: 'ask',
          after: 4,
          prompt: [N('(Say the rhyme again together.)'), M('Which word sounds like “tight”?', 'think')],
          options: [
            opt('night', [M('Yes! Tight, night. They rhyme!', 'happy')], true),
            opt('cold', [M('Tight rhymes with cold? Brrr! Those two don’t match.'), M('Cold and tight don’t sound alike. Tight… night! Those rhyme.')]),
            opt('snow', [M('Tight and snow? Splat! A snowball lands in the rhyme!'), M('Snow rhymes with go. Tight rhymes with night!')]),
          ],
          parentNote: 'Listened to a skipping rhyme and picked out a rhyming pair (tight, night).',
        },
      ],
    ),
    sc(
      's1-cinder',
      [
        N('Winter now. Frost creeps out of the long grass.'),
        N('Moss is at your door. He looks very faint.'),
        M('It is time for the last post. You may carry me! What an honour!', 'soft'),
        N('You carry him gently. He is light as a leaf.'),
        M('Let me tell you about Cinder’s last warm day.'),
        M('It was so hot! The Nubbins lay flat in the sun.', 'happy'),
        M('Cinder carried them into the shade. One at a time.'),
        CI('Out of the sun, you silly things! I’ve got you!', 'happy'),
        M('That night, snow came. Whoosh! In summer! It did not stop.', 'sad'),
        M('Cinder was scared. She hugged her Nubbins close.', 'sad'),
        M('She would not let go. Not even to let them play.', 'sad'),
        M('The Nubbins could not run. They were not happy.', 'sad'),
        M('They did not move at all. Just like the song.', 'sad'),
        M('Cinder loved them. But her hug was too tight.', 'sad'),
      ],
      [
        {
          domain: 'science',
          skill: 'shade is cooler than sunshine',
          standard: 'K-PS3-1',
          kind: 'notice',
          after: 6,
          lines: [
            M('The Sun warms the ground. Shade blocks some of the Sun.', 'think'),
            M('So shade is cooler than sunshine. Cinder knew that.'),
          ],
          parentNote: 'Learned that sunlight warms the ground and shade is cooler.',
        },
        {
          domain: 'sel',
          skill: 'gentle hugs, and asking first',
          standard: 'CASEL: Relationship skills',
          kind: 'ask',
          after: 13,
          prompt: [M('How should we hug a small friend?', 'think')],
          options: [
            opt('Gently, and only if they want a hug', [M('Yes. Gentle hugs, and we ask first.', 'soft')], true),
            opt('As tight as we can', [
              M('A squeeze as tight as a bear? Squeak! Little friends need room.', 'soft'), M('Tight hugs can hurt small friends. Gentle is best. And we ask first.', 'soft'),
            ]),
          ],
          parentNote: 'Talked about gentle hugs and asking first, through Cinder’s love that held too tight.',
        },
      ],
    ),
    sc(
      's1-complete',
      [
        M('There. Now two of us remember her warm.', 'soft'),
        N('Moss pushes something to your boot. Plop! An acorn on a string!'),
        M('Hazel gave me that, long ago. Now it’s yours.', 'soft'),
        N('On the post hangs a soft hat with a tiny lantern.'),
        N('The note says: “I MADE YOU THIS! —SPARKS”'),
        N('That night, you draw the four posts in your book.'),
        N('Moss falls asleep on your windowsill. Shh.'),
      ],
      [
        {
          domain: 'science',
          skill: 'an acorn is a seed that grows into an oak tree',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'notice',
          after: 2,
          lines: [
            M('An acorn is a seed. Plant it, and wait…', 'think'),
            M('…a long, long time. It grows into a big oak tree!', 'happy'),
          ],
          parentNote: 'Learned that an acorn is the seed of an oak tree.',
        },
      ],
    ),
  ],
  'Every scene keeps Moss’s four memories. Hush’s fading is left out of the sprout version of s1-hush; it keeps the heart (keeping company) without a second death in one quest.',
);

// ================================================================== S2 Wisp
const S2_RULE = M('Feed them before you feed yourself. Hazel’s first rule.', 'soft');
const S2_FED = M('Grey ones remember who fed them.', 'soft');

const S2: EduQuest = quest(
  's2',
  'Wisp',
  {
    's2-step1': {
      goal: 'Sit up at night by Sable’s fruit. Keep very still.',
      hint: 'Leave fruit by the long grass. Then wait nearby, still as a post.',
    },
    's2-step2': {
      goal: 'Watch out for Wisp. When the big rain comes, find where he sleeps.',
      hint: 'This happens later, in the rain. Warm things went somewhere warm.',
    },
    's2-step3': {
      goal: 'Keep making friends with Sable. Wisp is never far away.',
      hint: 'Later, when Sable leans on you, visit Luna’s garden at night.',
    },
  },
  [
    sc(
      's2-fruit',
      [
        N('Morning. The fruit for Sable is gone.'),
        N('But Sable looks thin. She didn’t eat it.'),
        N('Crunch! There is frost on the grass round her. In summer!'),
        LU('Something else came in the dark. It took the fruit.'),
        Y('Another Nubbin?'),
        LU('A grey one. Even thinner than Sable.', 'sad'),
        LU('Sit up tonight. Keep still. Still as a post.'),
        LU('Let’s find out what he wants.'),
      ],
      [
        {
          domain: 'science',
          skill: 'frost comes when it is very cold',
          standard: 'K-ESS2-1',
          kind: 'ask',
          after: 2,
          prompt: [LU('Frost is tiny bits of ice. When do we see frost?', 'think')],
          options: [
            opt('When it is very cold', [LU('Yes! Frost comes when it’s very cold. That’s why summer frost is strange.', 'think')], true),
            opt('On a hot summer day', [
              LU('Frost on a hot day? Plop! It would melt like ice cream.'), LU('Summer is warm, so frost should melt.'),
              LU('Frost comes when it’s very cold. That’s why this is strange!'),
            ]),
          ],
          parentNote: 'Learned that frost is ice that comes in cold weather, so frost in summer is strange.',
        },
      ],
    ),
    sc(
      's2-thief',
      [
        N('Night. Sable creeps out. She takes one bite.'),
        N('Then a thin grey Nubbin comes. One ear is torn.'),
        N('He pushes Sable aside. He pulls the fruit away.'),
        N('The fruit is bigger than his head.'),
        N('He drags it anyway. Bump, bump, bump.'),
        N('He sees your lantern. He presses his cheek on the warm glass.'),
        N('He is shaking. Shiver, shiver.'),
        W('Hsss! Hers! Not yours!', 'angry'),
        N('Then, very small, a second voice.'),
        W('…she ate. she ate today. good.', 'soft'),
        N('Whoosh. He’s gone.'),
        LU('Let’s call him Wisp.', 'soft'),
      ],
      [
        {
          domain: 'music',
          skill: 'loud and quiet voices',
          standard: 'ELOF: Language and Communication',
          kind: 'do',
          after: 9,
          check: 'edu:voice:loud-quiet',
          lines: [N('(Hiss like Wisp: hsss! Now whisper softly: she ate.)'), LU('One loud voice. One quiet voice.', 'think')],
          parentNote: 'Played with a loud voice and a quiet voice.',
        },
        {
          domain: 'literacy',
          skill: 'first sound w',
          standard: 'RF.K.2',
          kind: 'do',
          after: 11,
          check: 'edu:say:first-sound:w',
          lines: [
            N('(Say it together: w-w-Wisp.)'),
            LU('Wisp starts with a “w” sound. Like wind and water!', 'happy'),
          ],
          parentNote: 'Heard and said the first sound “w” in Wisp, wind and water.',
        },
      ],
    ),
    sc(
      's2-missing',
      [
        N('Next day, more things go missing. Warm things.'),
        FE('My left glove is gone! My right hand is warm. My left is cold!', 'think'),
        N('Fern waves her cold left hand. Brrr. Achoo!'),
        N('Your sock. A candle. The tea cosy. Gran Hazel’s warm egg stone.'),
        CL('He’s cold, that’s all. Can we feed him too?', 'sad'),
        LU('He hisses at Sable. And she listens to him.', 'angry'),
        CL('Somebody taught him to be scared.', 'soft'),
        N('Up in the fruit tree, Wisp watches you.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 5',
          standard: 'K.CC.B.5',
          kind: 'do',
          after: 3,
          check: 'edu:count:missing-things:5',
          lines: [
            N('(Count the missing things on your fingers.)'),
            FE('Glove, sock, candle, tea cosy, stone. Five!', 'think'),
          ],
          parentNote: 'Counted five missing things on their fingers.',
        },
      ],
      {
        choices: [
          {
            id: 'feed-both',
            label: 'Put down two piles of fruit. One each.',
            set: { 's2-early': 'fed' },
            friendship: { clover: 2 },
            then: [N('Wisp eats his pile. Then most of hers!'), CL('Not quite fair. But he ate.', 'sad')],
          },
          {
            id: 'shoo',
            label: 'Clap and shoo him away.',
            set: { 's2-early': 'shooed' },
            friendship: { luna: 2, clover: -1 },
            then: [
              N('Clap! Wisp runs. Sable jumps too.'),
              LU('Claps scare small things. Use a soft voice next time.', 'think'),
            ],
          },
          {
            id: 'wait',
            label: 'Sit down and wait.',
            set: { 's2-early': 'waited' },
            friendship: { luna: 1, clover: 1 },
            then: [
              N('You sit. Wisp hisses, and then he stops.'),
              N('Sable eats. She watches you both.'),
              LU('Waiting works on him too!', 'think'),
            ],
          },
        ],
      },
    ),
    sc(
      's2-rain',
      [
        N('It rains all day and all night. Pitter-patter.'),
        N('The stream is big and brown and loud.'),
        N('Behind the cottage is a soggy nest.'),
        N('Fern’s glove. The sock. The tea cosy. All wet.'),
        N('Wisp sits on a log, shaking. He holds Gran Hazel’s egg stone.'),
        W('mine. warm. mine… was warm.', 'soft'),
        CL('The bathhouse is warm. Please, let’s help him.', 'sad'),
        LU('He might wriggle. Hold him gently anyway.', 'soft'),
      ],
      [
        {
          domain: 'science',
          skill: 'shivering helps a cold body warm up',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'notice',
          after: 4,
          lines: [
            CL('Bodies shake when they’re cold. Shivering helps them warm up.', 'think'),
            N('(Shiver like Wisp. Brrr!)'),
          ],
          parentNote: 'Learned that shivering is the body’s way of warming up when it is cold.',
        },
      ],
      {
        choices: [
          {
            id: 'carry',
            label: 'Pick him up. Hold on gently.',
            set: { 's2-carried': true },
            friendship: { clover: 2, luna: 1 },
            then: [
              N('He wriggles. Then he stops.'),
              N('In the warm bathhouse, he bites your hand. Ouch!'),
              W('Hsss. Hands!', 'angry'),
              CL('He’s scared of hands. But look. He’s warm now.', 'soft'),
              N('He is warm. But he is still shaking.'),
              N('Clover gives him a pear. Munch, munch, gulp.'),
            ],
          },
          {
            id: 'clover',
            label: 'Get a blanket. Let Clover lift him.',
            set: { 's2-carried': false },
            friendship: { clover: 1 },
            then: [
              N('Clover wraps him up like a loaf of bread.'),
              N('He bites her, right through the blanket. Ouch!'),
              CL('Ow. That’s fair. He’s scared.', 'sad'),
              N('He is warm now. But he is still shaking.'),
              N('Clover gives him a pear. Munch, munch, gulp.'),
            ],
          },
        ],
      },
    ),
    sc(
      's2-number',
      [
        CL('Warm. Dry. Fed. And still shaking.', 'sad'),
        LU('So it was never the cold.', 'sad'),
        N('Rain drums on the roof. Drip, drip, drip.'),
        N('On Wisp’s side is an old grey number. Painted on.'),
        LU('I’ve seen paint like that before. I’ll ask around.', 'think'),
        N('Outside, Sable sniffs your hands. She doesn’t run!'),
      ],
      [
        {
          domain: 'sel',
          skill: 'naming a feeling: scared',
          standard: 'CASEL: Social awareness',
          kind: 'ask',
          after: 1,
          prompt: [LU('Wisp is warm now. But he still shakes. How does he feel?', 'think')],
          options: [
            opt('Scared', [LU('Yes. Wisp is scared. Being scared can make us shake too.', 'soft')], true),
            opt('Cold', [LU('Cold? He’s wrapped up as warm as a bun!', 'soft'), LU('He was cold before. He’s warm now. So it’s fear. Wisp feels scared.', 'soft')]),
            opt('Sleepy', [LU('Sleepy? A yawn would wobble like jelly. Hee, hee!', 'soft'), LU('Sleepy Nubbins go floppy, not shaky. Wisp feels scared.', 'soft')]),
          ],
          parentNote: 'Named a feeling (scared) from clues, and learned that fear can make us shake.',
        },
      ],
    ),
    sc(
      's2-night',
      [
        N('Night in Luna’s garden. Pop! The moonflowers open.'),
        N('Wisp sits close to Sable. He whispers to her.'),
        W('hands are scary. come away. come to the dark.', 'soft'),
        N('Sable looks at Wisp. Then at your window.'),
        LU('Wisp wants Sable to leave the Grove.', 'sad'),
        N('Clover comes in her dressing gown, with fruit.'),
        CL('Wisp is cold and scared. Kind people feed scared Nubbins.', 'soft'),
        LU('I care about Sable. I want Sable safe.', 'sad'),
        CL('And Wisp has nobody at all.', 'sad'),
        N('Luna and Clover both look at you.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'friends can disagree and both be kind',
          standard: 'CASEL: Relationship skills',
          kind: 'notice',
          after: 8,
          lines: [
            N('Luna and Clover want different things.'),
            N('They are both being kind. Friends can disagree and stay friends.'),
          ],
          parentNote: 'Saw two friends disagree kindly, each caring about someone different.',
        },
      ],
      {
        defaultChoice: 'spared',
        choices: [
          {
            id: 'spared',
            label: 'Keep feeding him. Every single day.',
            set: { wisp: 'spared' },
            friendship: { clover: 3, luna: 1 },
            then: [
              N('Each morning, two piles of fruit. One for Sable. One for Wisp.'),
              N('On the fourth morning, Wisp eats facing you.'),
              W('hands… maybe not hers. maybe not.', 'soft'),
              N('Sable sees. She comes one step closer.'),
              LU('I hope you’re right.', 'think'),
            ],
          },
          {
            id: 'sable',
            label: 'Let Sable decide.',
            set: { wisp: 'sable' },
            friendship: { luna: 3, clover: 3 },
            then: [
              N('You put down one pile of fruit. You step back.'),
              N('Sable pushes half the pile to Wisp. She shares!'),
              W('…she gave. hers. she gave.', 'soft'),
              LU('That’s a kinder answer than mine.', 'soft'),
            ],
          },
        ],
      },
    ),
    sc(
      's2-complete',
      [
        N('Morning. Crunch! Two little frost circles by the long grass.'),
        N('Two grey Nubbins slept there. Wisp has the egg stone.'),
        M('He’ll never give that stone back.', 'think'),
        S2_RULE,
        M('Hazel never said, feed only the nice ones.', 'soft'),
        M('I asked her. Twice.', 'soft'),
        S2_FED,
      ],
      [
        {
          domain: 'maths',
          skill: 'circle shape',
          standard: 'K.G.A.2',
          kind: 'do',
          after: 1,
          check: 'edu:draw:shape:circle',
          lines: [N('(Draw a circle in the air with your finger.)'), M('Round and round and back again. A circle!', 'happy')],
          parentNote: 'Drew a circle in the air and named the shape.',
        },
      ],
    ),
  ],
  'Sprout leaves out “drive him off” in s2-night (defaultChoice spared). The s2-complete-driven variant is still written, gently, in case a save carries wisp = driven.',
);

const S2_VARIANTS: EduScene[] = [
  sc(
    's2-complete-sable',
    [
      N('Morning. Two circles of frost, side by side.'),
      N('Wisp stays at the edge. He holds the egg stone.'),
      N('He hasn’t come in. He hasn’t gone away, either.'),
      M('Sable chose. That was hers to choose.', 'soft'),
      S2_RULE,
      S2_FED,
    ],
    [
      {
        domain: 'maths',
        skill: 'position words: side by side',
        standard: 'K.G.A.1',
        kind: 'do',
        after: 0,
        check: 'edu:place:hands:side-by-side',
        lines: [N('(Put your two hands side by side, like the circles.)'), M('Side by side. Close, but not on top.', 'happy')],
        parentNote: 'Placed their hands side by side to show the position word.',
      },
    ],
  ),
  sc(
    's2-complete-driven',
    [
      N('Morning. One circle of frost by the long grass.'),
      N('Wisp has gone away, through the hedge.'),
      N('A sock hangs on a thorn.'),
      N('Sable sits by the gap for a long time.'),
      N('Then she comes back. She eats all her fruit.'),
      LU('She’s eating. That’s good. I still feel sad.', 'sad'),
      CL('I was cross yesterday. I’m not cross now.', 'soft'),
      CL('I hung a blanket on the hedge. Just in case Wisp is cold.', 'soft'),
      M('It was a good idea. It still feels sad.', 'soft'),
      M('Both can be true.', 'soft'),
    ],
    [
      {
        domain: 'sel',
        skill: 'missing someone is a sad feeling, and that is all right',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 4,
        lines: [N('Sable misses Wisp. Missing someone feels sad.'), N('It’s all right to feel sad. Sitting together helps.')],
        parentNote: 'Named missing someone as a sad feeling and heard that sitting together helps.',
      },
    ],
  ),
];

// ================================================================== S3 The Cycle
const S3: EduQuest = quest(
  's3',
  'Sun and Moon',
  {
    's3-step1': {
      goal: 'Ask a Sun friend and a Moon friend about the big race.',
      hint: 'Sun: Fern, Marina, Sparks, Clover, Pixel. Moon: Luna, Ember, Byte, Dusty, Nova. Ask one from each side.',
    },
    's3-step2': {
      goal: 'Help Sparks and Byte make the old race pictures.',
      hint: 'Go to Sparks’s workshop. Rock the tray when Byte counts.',
    },
    's3-step3': {
      goal: 'Show the pictures to Fern and to Ember.',
      hint: 'Fern is in her orchard. Ember is by the race fence in the evening.',
    },
    's3-step4': {
      goal: 'Call everyone to a big meeting at the pond.',
      hint: 'Later on, tap the pond and choose Call a Moot. All ten friends will come.',
    },
  },
  [
    sc(
      's3-stands',
      [
        N('The race stands. Sun friends sit on the left.'),
        N('Moon friends sit on the right. An empty bench sits in the middle.'),
        FE('Don’t sit there! That’s the gap.', 'think'),
        FE('Your Gran Hazel sat in the gap. Just to be cheeky.', 'happy'),
        N('Two big tea pots. One has a sun. One has a moon.'),
        N('Each side says the other pot’s tea is worse.'),
        N('A Nubbin sips from the sun pot. Slurp! Then the moon pot.'),
        N('It can’t tell. It sips both again, to be sure.'),
        SP('Long ago, at the big race, Fern’s Nubbin Bramble fell!', 'shock'),
        SP('Sun says one thing. Moon says another. Now nobody races together!'),
        SP('Oops. I didn’t say that. That was the wind.'),
        N('High up, Corvin watches the people, not the race.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'left, right and middle',
          standard: 'K.G.A.1',
          kind: 'ask',
          after: 1,
          prompt: [N('(Point left. Point right. Now point to the middle.)'), FE('So where is the empty bench?', 'think')],
          options: [
            opt('In the middle', [FE('Yes! Sun on the left, Moon on the right, the gap in the middle.', 'happy')], true),
            opt('On the left', [FE('Sit on the left? Squeak, bump! You’d sit on a Sun friend’s lap!'), FE('The left is full of Sun friends. The empty bench is in the middle.')]),
            opt('On the right', [FE('Sit on the right? Squeak, bump! You’d squash a Moon friend!'), FE('The right is full of Moon friends. The empty bench is in the middle.')]),
          ],
          parentNote: 'Used left, right and middle to find a place.',
        },
      ],
      {
        choices: [
          {
            id: 'gap',
            label: 'Sit in the gap, like Hazel.',
            set: { 's3-seat': 'gap' },
            then: [N('You sit in the middle. Everybody turns to look!'), FE('Oh, you’re Hazel’s, all right.', 'happy')],
          },
          {
            id: 'sun',
            label: 'Sit with the Sun side.',
            set: { 's3-seat': 'sun' },
            then: [SP('Yes! Sun gets the new Keeper!', 'happy')],
          },
          {
            id: 'moon',
            label: 'Sit with the Moon side.',
            set: { 's3-seat': 'moon' },
            then: [BY('Welcome. Our biscuits are better. I checked.', 'happy'), FE('Oh no! Lovely to see you anyway.', 'happy')],
          },
        ],
      },
    ),
    sc(
      's3-two-stories',
      [
        N('You hear two stories. Pop! Pop! They are not the same.'),
        N('Sun says: Ember’s Nubbin Ash bumped Fern’s Nubbin Bramble at the bend.'),
        N('Moon says: the flag was in the wrong place.'),
        BY('I made a chart. Sun is yellow. Moon is blue.', 'think'),
        EM('After that day, nobody would race with Ash.', 'angry'),
        EM('Only Corvin. He said he’d make Ash a champion.', 'sad'),
        N('Nobody talks about Bramble. Where did she go?'),
      ],
      [
        {
          domain: 'sel',
          skill: 'listening to both sides',
          standard: 'CASEL: Social awareness',
          kind: 'ask',
          after: 2,
          prompt: [BY('Two sides tell it two ways. What should we do?', 'think')],
          options: [
            opt('Listen to both sides', [BY('Yes. Hear everyone first. Then look for clues.', 'happy')], true),
            opt('Only listen to one side', [
              BY('Listen with one ear only? Hee! The other ear would sulk.', 'think'), BY('Then we’d miss half the story. Let’s listen to both sides.', 'think'),
            ]),
          ],
          parentNote: 'Learned to listen to both sides before deciding what happened.',
        },
      ],
    ),
    sc(
      's3-plates',
      [
        N('Pop! Sparks is at your gate. She is fizzing!'),
        SP('I have pictures from that race. I never looked at them!', 'shock'),
        SP('I was scared of what they might show.', 'sad'),
        SP('But my timer is broken. I need help.'),
        N('She points up the lane, at Byte’s house.'),
        SP('Him!', 'angry'),
      ],
      [
        {
          domain: 'sel',
          skill: 'asking for help kindly',
          standard: 'CASEL: Relationship skills',
          kind: 'ask',
          after: 3,
          prompt: [SP('Somebody has a timer. How do I ask for help?', 'think')],
          options: [
            opt('“Please will you help me?”', [SP('Please. Right. I can say please. Probably.', 'happy')], true),
            opt('“Give me your timer!”', [
              SP('“Give me!” with grabby hands? Hee! The timer would hide.', 'think'), SP('They’d say no! Asking kindly works better. “Please will you help me?”', 'think'),
            ]),
          ],
          parentNote: 'Practised asking for help kindly, with please.',
        },
      ],
      {
        choices: [
          {
            id: 'science',
            label: 'Fetch Byte. Say it’s for science.',
            set: { 's3-byte': 'science' },
            then: [BY('Science? I’ll bring three timers!', 'happy')],
          },
          {
            id: 'nicely',
            label: 'Fetch Byte. Say Sparks asked nicely.',
            set: { 's3-byte': 'nicely' },
            then: [BY('She did not.', 'think'), N('You say, “No, she didn’t.”'), BY('I’ll come anyway.')],
          },
        ],
      },
    ),
    sc(
      's3-flag',
      [
        N('Sparks’s darkroom is red and dark. It smells of vinegar.'),
        BY('Rock the tray on the count. One, and two…', 'think'),
        SP('I rock on FEELING, Byte!', 'angry'),
        N('Slosh! Splash! The tray tips. Byte’s sleeve is very wet.'),
        BY('That was not a rock. That was a wave.', 'think'),
        N('The first picture appears. It’s… a giant thumb.'),
        SP('It’s a GOOD thumb!', 'angry'),
        N('The next picture: the cliff bend, before the race.'),
        N('A man in a grey coat is moving the flag!'),
        BY('He moved it two posts nearer the edge.', 'think'),
        BY('The flag said “go wide”. So Ash went wide, into Bramble.', 'sad'),
        SP('Nobody from Sun or Moon moved it. It was a race helper!', 'shock'),
        SP('We fought about the wrong thing. For years!', 'shock'),
        BY('There’s a thumb on the last picture too. In the corner.'),
        SP('That’s how I sign my pictures!', 'happy'),
      ],
      [
        {
          domain: 'music',
          skill: 'keeping a steady beat',
          kind: 'do',
          after: 1,
          check: 'edu:clap:beat:steady',
          lines: [N('(Clap with Byte: one, and two, and one, and two.)'), BY('Steady. Not fast, not slow. Like a clock.', 'think')],
          parentNote: 'Clapped a steady beat with Byte’s count.',
        },
        {
          domain: 'maths',
          skill: 'near and far',
          standard: 'K.G.A.1',
          kind: 'ask',
          after: 10,
          prompt: [BY('Where did the flag go? Nearer the edge, or further away?', 'think')],
          options: [
            opt('Nearer the edge', [BY('Yes. Nearer the edge. That’s why the Nubbins went wide.', 'sad')], true),
            opt('Further away', [BY('The flag went for a walk? Whoosh! Look again.', 'think'), BY('Look again. Old hole here. New hole there, nearer the edge.', 'think')]),
          ],
          parentNote: 'Compared positions using nearer and further.',
        },
      ],
    ),
    sc(
      's3-courier',
      [
        N('Swish! Sparks wraps the pictures in a sun tea towel.'),
        N('Byte wraps a moon tea towel round that.'),
        SP('You show them. Fern and Ember both like you.'),
        BY('A helper from neither side. Good.', 'think'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'first sounds s and m',
          standard: 'RF.K.2',
          kind: 'ask',
          after: 1,
          prompt: [N('(Say them slowly: Sun… Moon.)'), BY('Which one starts with a “mmm” sound?', 'think')],
          options: [
            opt('Moon', [BY('Yes! Mmm-Moon. And Sun starts with “sss”.', 'happy')], true),
            opt('Sun', [BY('A snake called Moon? Ssss! Hee, hee!', 'think'), BY('Sun starts with “sss”, like a snake. Mmm-Moon starts with “mmm”.', 'think')]),
          ],
          parentNote: 'Heard the first sounds in Sun and Moon.',
        },
      ],
      {
        choices: [
          {
            id: 'together',
            label: 'Show them both at the same time.',
            set: { 's3-shown': 'together' },
            then: [N('It takes a whole week to get them together!'), FE('Sneaky! Hazel did that to me once.', 'happy')],
          },
          {
            id: 'apart',
            label: 'Show them one at a time.',
            set: { 's3-shown': 'apart' },
            then: [
              N('Fern first. Then Ember.'),
              N('Each one asks: has the other one seen it?'),
              N('By evening, both are at the same fence. They say it’s an accident.'),
            ],
          },
        ],
      },
    ),
    sc(
      's3-truce',
      [
        N('Fern looks at the pictures. Ember looks too.'),
        EM('It wasn’t Ash. It wasn’t Fern. It was the flag.', 'sad'),
        FE('I was cross with you for years. Over a flag.', 'sad'),
        FE('I’m sorry, Ember.', 'soft'),
        EM('I’m sorry too.', 'soft'),
        FE('No, I’m sorrier.', 'happy'),
        EM('No, I’M sorrier.', 'happy'),
        N('Hee, hee. It is their best argument in years.'),
        EM('Let’s have a big meeting. Everyone. Sun and Moon.', 'think'),
        FE('And just one tea pot.', 'think'),
        EM('One tea pot.', 'soft'),
      ],
      [
        {
          domain: 'sel',
          skill: 'saying sorry',
          standard: 'CASEL: Relationship skills',
          kind: 'ask',
          after: 4,
          prompt: [N('Fern was cross with Ember for a long time.'), N('What can we say when we’ve been unkind?')],
          options: [
            opt('“I’m sorry.”', [N('Yes. Saying sorry is brave. It helps friends start again.')], true),
            opt('“It’s your fault.”', [N('“It’s your fault!” Grrr… and round and round we go!'), N('That keeps the cross feeling going. “I’m sorry” helps friends start again.')]),
          ],
          parentNote: 'Practised saying sorry, and saw how it helps friends make up.',
        },
      ],
    ),
    sc(
      's3-invitations',
      [
        N('Pixel makes the invitations. Gold ink or silver?'),
        PX('Gold is for Sun. Silver is for Moon.', 'think'),
        CL('What about green? Nobody is green.', 'soft'),
        PX('Clover, that’s brilliant! Green!', 'shock'),
        PX('Green is for everybody. Sun and Moon.', 'happy'),
        N('Dusty digs a hole for the one tea pot. Thump, thump! Nobody asked.'),
        NO('Am I Sun or Moon? I’ve decided I’m weather.', 'happy'),
        N('Ember says she’s coming. That’s Ember for yes.'),
      ],
      [
        {
          domain: 'art',
          skill: 'blue and yellow paint make green',
          kind: 'do',
          after: 3,
          check: 'edu:find:colour:green',
          lines: [
            PX('Mix blue paint and yellow paint, and you get green!', 'happy'),
            N('(Find something green near you. Point to it!)'),
          ],
          parentNote: 'Learned that blue and yellow paint mix to make green, and found something green.',
        },
      ],
    ),
    sc(
      's3-moot',
      [
        N('Evening at the pond. Ten friends. One tea pot.'),
        N('Dusty dug a hole. The pot sits in it. Dusty is proud.'),
        HZ('A Moot! That’s an old word for a big meeting.', 'happy'),
        HZ('I haven’t been to one in years!', 'happy'),
        N('You put the pictures on the bench in the middle.'),
        N('Gran Hazel sits right in the middle. She smiles at both sides.'),
        N('Everyone shuffles in close to look. Squeak! Now there is no gap!'),
        FE('She did it again! Still cheeky, after all these years.', 'happy'),
        SP('It was the flag. I had the pictures all along.', 'sad'),
        FE('Bramble fell because a man moved a flag. Not because of us.'),
        BY('I tasted both teas. Same tea. It always was.', 'think'),
        EM('So. A race for everyone. And I check the flags.', 'think'),
        FE('We check the flags.'),
        BY('I’ll check the checking.', 'happy'),
        HZ('Now, who bangs the spoon? Someone must keep the Moot.', 'happy'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 10; 5 and 5 make 10',
          standard: 'K.CC.B.5',
          kind: 'do',
          after: 0,
          check: 'edu:count:keepers:10',
          lines: [N('(Count the friends: five Sun, five Moon.)'), N('(Five and five make ten!)')],
          parentNote: 'Counted ten friends as two groups of five.',
        },
        {
          domain: 'social-studies',
          skill: 'a fair rule is the same for everyone',
          standard: 'D2.Civ.8.K-2',
          kind: 'notice',
          after: 13,
          lines: [N('A rule is fair when it’s the same for everyone.'), N('Everybody checks the flags. That keeps the race fair.')],
          parentNote: 'Talked about fair rules that are the same for everyone.',
        },
      ],
      {
        choices: [
          {
            id: 'spoon',
            label: 'Bang the spoon on the pot.',
            set: { 's3-moot': 'spoon' },
            then: [
              N('Bong! Everybody stops talking.'),
              N('Now one person talks at a time. Taking turns!'),
              BY('That spoon is now a very important spoon.', 'think'),
              PX('Ribbons for every racer! Gold, silver and green!', 'happy'),
              HZ('Moot-Keeper. It suits you.', 'happy'),
            ],
          },
          {
            id: 'share',
            label: 'Let Fern and Ember share the spoon.',
            set: { 's3-moot': 'shared' },
            then: [
              N('Fern and Ember hold the spoon together. Bong! They both miss!'),
              N('Everybody cheers.'),
              PX('Ribbons for every racer! Gold, silver and green. Mine came out wonky.', 'happy'),
              HZ('You’re still the Moot-Keeper, love.', 'happy'),
            ],
          },
        ],
      },
    ),
  ],
  'Bramble’s fall is “fell at the cliff bend and got lost” (S8 reunites them). The steward is “a man in a grey coat” / “a race helper”. The urns are “tea pots” for read-aloud. s3-step4 has no done scene in the source.',
);

// ================================================================== S4 The Wellspring
const S4: EduQuest = quest(
  's4',
  'The Waterfall',
  {
    's4-step1': {
      goal: 'Look at Gran’s white line by the waterfall.',
      hint: 'Go past the pond to the falls. Tap the white mark on the rock.',
    },
    's4-step2': {
      goal: 'Send a swimmer up the stream to look.',
      hint: 'Choose Swim at the top of the pool. Marina can teach a Nubbin first.',
    },
    's4-step3': {
      goal: 'Walk the path behind the waterfall with Marina.',
      hint: 'Meet Marina in the evening. Stay close behind her.',
    },
    's4-step4': {
      goal: 'Open the water gate at night.',
      hint: 'Go with Marina and a strong Nubbin. The gate sticks. Lift and push!',
    },
  },
  [
    sc(
      's4-pools',
      [
        MA('Come and see something.', 'think'),
        N('Marina’s rock pools step down like bowls.'),
        N('Half of them are dry. Just a drip, drip.'),
        MA('The stream fills my pools. This summer it gives less.', 'sad'),
        MA('And the water is cold. Cold, in July!'),
        MA('Hazel painted a line by the waterfall. Go and look.'),
        Y('Why don’t you look?'),
        MA('I’ve looked lots. I hope I’m wrong. Please look too.', 'soft'),
        MA('Mind the moss on the rocks. Not that Moss! The slippy kind.', 'happy'),
      ],
      [
        {
          domain: 'sel',
          skill: 'naming a feeling: worried',
          standard: 'CASEL: Social awareness',
          kind: 'ask',
          after: 7,
          prompt: [N('Marina keeps looking and looking. How does she feel?')],
          options: [
            opt('Worried', [MA('Yes. I’m worried. A friend checking helps.', 'soft')], true),
            opt('Silly', [MA('Silly, like a hat made of water? Hee! Marina is worried.', 'soft'), MA('Not silly. Worried. When we worry, a friend can help.', 'soft')]),
          ],
          parentNote: 'Named the feeling worried, and heard that a friend’s help eases worry.',
        },
      ],
    ),
    sc(
      's4-line',
      [
        N('The falls are loud and white. Splash, splash!'),
        N('On the dark rock is a thick white line.'),
        N('The water is a hand below the line.'),
        N('Your Nubbin dips a paw in. Brr! It looks at you.'),
        MA('A whole hand too low.', 'sad'),
        MA('Something up the stream is taking the water.', 'think'),
      ],
      [
        {
          domain: 'maths',
          skill: 'higher and lower; measuring with a hand',
          standard: 'K.MD.A.2',
          kind: 'ask',
          after: 2,
          prompt: [MA('Is the water higher or lower than the line?', 'think')],
          options: [
            opt('Lower', [MA('Yes. Lower, by a whole hand. (Show a hand’s width.)', 'sad')], true),
            opt('Higher', [MA('Higher? Whee! The water would float up in the sky.', 'think'), MA('Look again. The line is up here. The water is down there. Lower!', 'think')]),
          ],
          parentNote: 'Compared heights (higher, lower) and measured a gap with a hand.',
        },
      ],
    ),
    sc(
      's4-lesson',
      [
        MA('Hazel’s Nubbins learned to swim with me.', 'happy'),
        MA('Fossil swam sideways, on purpose. I still look for her in the pool.', 'soft'),
        MA('Lesson one: Nubbins float better than you’d think.'),
        N('Marina holds your Nubbin under its chin. Like a cup.'),
        N('It kicks. It doesn’t sink!'),
        MA('Now swim up the stream. Just a little way.'),
        MA('Lesson two: near water, Keepers stay close to a grown-up.', 'think'),
      ],
      [
        {
          domain: 'science',
          skill: 'float or sink',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'do',
          after: 4,
          check: 'edu:sort:float-sink:leaf-stone-apple',
          lines: [
            N('(Guess: does it float or sink? A leaf, a stone, an apple.)'),
            MA('Leaf floats. Apple floats. Stone sinks. Plop!', 'happy'),
          ],
          parentNote: 'Guessed and sorted things that float and sink.',
        },
      ],
      {
        choices: [
          {
            id: 'with',
            label: 'Wade in after them.',
            set: { 's4-swim': 'with' },
            then: [N('You wade in. Brrr! It’s very cold!'), MA('Lesson three: Keepers stay on the bank. Out you get!', 'happy')],
          },
          {
            id: 'trust',
            label: 'Stay on the bank. Trust them.',
            set: { 's4-swim': 'trust' },
            then: [MA('Good. Staying on the bank is the hardest part.', 'soft')],
          },
        ],
      },
    ),
    sc(
      's4-dam',
      [
        N('Splash! Your swimmer comes back. Shake, shake! You get wet.'),
        N('In its fur: a grey thread and a bit of new cement.'),
        N('Up the stream is a new stone wall. It holds the water back.'),
        N('Behind it is flat, still, blue water.'),
        N('There are swimming lanes, and a sign: NO SPLASHING.'),
        MA('No splashing? Splashing is what water is for!', 'angry'),
        MA('The wall keeps the water here. So my pools stay dry.', 'angry'),
        MA('I wrote three letters. Nobody helped.', 'think'),
      ],
      [
        {
          domain: 'science',
          skill: 'a dam holds water back; beavers build dams',
          standard: 'K-ESS2-2',
          kind: 'notice',
          after: 2,
          lines: [
            MA('A wall that holds water back is called a dam.', 'think'),
            MA('Beavers build dams too! With sticks and mud.', 'happy'),
          ],
          parentNote: 'Learned what a dam is, and that beavers build dams that change their surroundings.',
        },
      ],
    ),
    sc(
      's4-ledge-ask',
      [
        MA('Before we do anything, I’ll show you something.', 'soft'),
        MA('Hazel knew this path. Now you should too.'),
        N('By the falls, a thin ledge goes behind the water.'),
        MA('Back to the rock. Eyes on my heels. Stay close.', 'think'),
        MA('Rule five: don’t be me when I was little.', 'happy'),
        MA('I ran on the wet rocks. Splat! Splash! Every time.', 'happy'),
      ],
      [
        {
          domain: 'health',
          skill: 'staying close to a grown-up near water',
          standard: 'CASEL: Responsible decision-making',
          kind: 'ask',
          after: 5,
          prompt: [MA('Near water, where do we stay?', 'think')],
          options: [
            opt('Close to a grown-up', [MA('Yes. Close to me, all the way.', 'soft')], true),
            opt('Run on ahead', [MA('Run on ahead? Splat, splash! Wet rocks are slippy as soap.', 'think'), MA('Not near water. Wet rocks are slippy. We stay close to a grown-up.', 'think')]),
          ],
          parentNote: 'Talked about staying close to a grown-up near water.',
        },
      ],
    ),
    sc(
      's4-ledge',
      [
        N('Behind the falls, it’s all noise and spray. Whoosh!'),
        N('The rock is wet and soft with moss.'),
        N('A warm breath of air comes from the dark.'),
        MA('That’s the warm spring. Where the first Nubbins came from.', 'soft'),
        MA('We stop here. Further is for when it’s needed.', 'soft'),
        MA('Now you know the way. That’s what a path is.'),
      ],
      [
        {
          domain: 'science',
          skill: 'using our senses',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'do',
          after: 2,
          check: 'edu:point:senses:ears-skin-nose',
          lines: [
            MA('Use your senses. Ears hear the roar. Skin feels the spray.', 'think'),
            N('(Point to your ears. Now your nose. What does a nose do?)'),
          ],
          parentNote: 'Named senses (hearing, touch, smell) and the body parts that use them.',
        },
      ],
    ),
    sc(
      's4-sluice',
      [
        MA('Three letters. Nobody listened. Now we do something.', 'angry'),
        MA('We won’t break anything. We’ll open a gate.'),
        N('Night. The dam is a dark wall. The gate is wood.'),
        N('In a hut, a guard sleeps in his chair.'),
        N('He snores. In… out… whistle! In… out… whistle!'),
        MA('Move on the snore. Freeze on the whistle.', 'think'),
        N('(Whistle! Everyone say “Freeze!”)'),
        N('You freeze. Your Nubbin freezes too, one foot up, like a statue.'),
        N('Snore! You move. Your Nubbin stays still. And still.'),
        MA('You can put your foot down now, pet.', 'soft'),
        N('The foot comes down. Wobble, wobble… plop!'),
        N('Your Nubbin sits on its bottom. The guard snores on.'),
        N('You creep to the gate. You push. It’s stuck!'),
      ],
      [
        {
          domain: 'maths',
          skill: 'copying and continuing a pattern',
          standard: 'ELOF: Mathematics Development',
          kind: 'do',
          after: 4,
          check: 'edu:copy:pattern:snore',
          lines: [N('(Do the snore pattern together: in, out, whistle!)'), MA('In, out, whistle. What comes next? In!', 'happy')],
          parentNote: 'Copied a repeating sound pattern and said what comes next.',
        },
      ],
      {
        choices: [
          {
            id: 'lift',
            label: 'Lift, then push.',
            set: { 's4-gate': 'lift-push' },
            then: [N('Lift and push, like your gate at home. Creak! It opens!'), MA('Where did you learn that?', 'shock'), Y('Home.')],
          },
          {
            id: 'nubbin',
            label: 'Let your strongest Nubbin try.',
            set: { 's4-gate': 'nubbin' },
            then: [
              N('Your Nubbin pushes. Nothing. Then it slips, and lifts!'),
              N('The gate swings open.'),
              MA('Even the Nubbins know Hazel’s trick!', 'happy'),
            ],
          },
          {
            id: 'note',
            label: 'Pin a polite note on the gate first.',
            set: { 's4-gate': 'note' },
            then: [
              N('You write: “Opened for the rock pools. Thank you!”'),
              N('Then you lift and push. It opens.'),
              MA('Polite! Lovely.', 'happy'),
              N('In his sleep, the guard pats the air, looking for the note.'),
            ],
          },
        ],
      },
    ),
    sc(
      's4-water',
      [
        N('Whoosh! Water rushes through the gate.'),
        MA('Listen.', 'soft'),
        N('The waterfall sounds bigger now. Deep and full.'),
        N('The guard mumbles, “Got it. Thank you.” Then he snores again.'),
        N('In… out… whistle!'),
        MA('Someone may shut it again. Then someone opens it again.', 'think'),
        MA('That’s most of looking after things.'),
      ],
      [
        {
          domain: 'music',
          skill: 'louder and quieter sounds',
          kind: 'ask',
          after: 2,
          prompt: [MA('Is the waterfall louder now, or quieter?', 'think')],
          options: [
            opt('Louder', [MA('Yes! More water, more noise. Roar!', 'happy')], true),
            opt('Quieter', [MA('Quieter? Shh! Then you’d hear a mouse, not a waterfall.', 'think'), MA('Listen again. More water is falling. It’s louder!', 'think')]),
          ],
          parentNote: 'Listened and compared louder and quieter sounds.',
        },
      ],
    ),
    sc(
      's4-complete',
      [
        N('A week later, the rock pools are full!'),
        N('The anemones open up, like little flowers.'),
        MA('Look at them. Showing off!', 'happy'),
        N('In the deepest pool, something round and white shines.'),
        N('Your swimmer dives! Kick, kick, bubbles!'),
        N('It comes up with the thing on its head. Achoo!'),
        N('It’s an egg! A pearl-white egg!'),
        MA('Oh, you beauty! It’s yours. You opened the gate.', 'shock'),
        MA('Take some shells for the Grove, too.', 'happy'),
      ],
      [
        {
          domain: 'science',
          skill: 'anemones are animals that live in water',
          standard: 'K-ESS3-1',
          kind: 'notice',
          after: 2,
          lines: [
            MA('Anemones look like flowers. But they’re animals!', 'think'),
            MA('They need water. When the water goes, they close up tight.'),
          ],
          parentNote: 'Learned that sea anemones are animals that need water to live.',
        },
        {
          domain: 'science',
          skill: 'animals that hatch from eggs',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'ask',
          after: 6,
          prompt: [MA('Lots of animals hatch from eggs. Which one does?', 'think')],
          options: [
            opt('A duck', [MA('Yes! Ducklings hatch from eggs. So do Nubbins!', 'happy')], true),
            opt('A kitten', [MA('A kitten in an egg? Crack… miaow! That would be silly!'), MA('Kittens grow inside their mum, not in an egg. Ducks hatch from eggs!')]),
          ],
          parentNote: 'Learned that some animals, like ducks, hatch from eggs.',
        },
      ],
    ),
  ],
  'The steward is “a guard” for read-aloud; he only ever sleeps. The ledge stops at the bend as in the source; the Wellspring is not shown.',
);

// ================================================================== S5 Fossil’s Last Walk
const S5: EduQuest = quest(
  's5',
  'Fossil’s Walk',
  {
    's5-step1': {
      goal: 'Carry Fossil to the cliff where Dusty found her egg.',
      hint: 'The cliff is past the stream. Walk, don’t run. She likes to look at things.',
    },
    's5-step2': {
      goal: 'Take Fossil to Hazel’s first tree. Shake it once.',
      hint: 'It’s the low, crooked tree over the stream. Just one shake!',
    },
    's5-step3': {
      goal: 'Help Fossil float in the pond.',
      hint: 'Go to the edge of the pond and choose Swim. A swimmer or Marina can hold her.',
    },
    's5-step4': {
      goal: 'Sit with Fossil and your littlest Nubbin until dark.',
      hint: 'Stay still near them until night comes.',
    },
  },
  [
    sc(
      's5-list',
      [
        N('Thump, thump! Dusty is at the gate with a very old Nubbin.'),
        N('She is the colour of sand. She blinks very slowly.'),
        DU('This is Fossil. I dug her egg out of a cliff!', 'happy'),
        DU('Fossil is very old now. She is fading.', 'sad'),
        DU('Fading means her life is nearly over.', 'sad'),
        DU('She has three wishes. But my back hurts.', 'soft'),
        DU('Will you carry her for me? Please?', 'soft'),
        DU('One, the cliff. Two, Hazel’s first tree. Three, the water.', 'happy'),
        N('Fossil holds up her arms. Up, please!'),
      ],
      [
        {
          domain: 'sel',
          skill: 'being gentle with someone old and frail',
          standard: 'CASEL: Responsible decision-making',
          kind: 'ask',
          after: 6,
          prompt: [DU('How do we carry a very old Nubbin?', 'think')],
          options: [
            opt('Gently, with both hands', [DU('That’s it. Slow and gentle.', 'soft')], true),
            opt('Fast, swinging her about', [DU('Swing her about? Whee! She’d get as dizzy as a spinning top.', 'soft'), DU('Oh, that would hurt her. Gently, with both hands.', 'soft')]),
          ],
          parentNote: 'Thought about being gentle and careful with someone old.',
        },
      ],
      {
        choices: [
          {
            id: 'egg',
            label: 'Lift her with both hands, like an egg.',
            set: { 's5-carry': 'egg' },
            then: [N('You lift her gently. She snuggles in.'), DU('That’s it. Just right.', 'soft')],
          },
          {
            id: 'shoulder',
            label: 'Let her ride on your shoulder.',
            set: { 's5-carry': 'shoulder' },
            then: [N('She climbs up slowly. She sits like a queen.'), DU('Oh, she likes you!', 'happy')],
          },
        ],
      },
    ),
    sc(
      's5-cliff',
      [
        N('The cliff has stripes. Brown, red, grey, brown.'),
        DU('I dug Fossil’s egg out with a big, strong trowel!', 'think'),
        N('Fossil taps the rock. Tap, tap! (Tap along!)'),
        DU('A spoon. A small spoon.'),
        N('Tap!'),
        DU('A teaspoon. Fine.', 'happy'),
        N('Fossil rests her head on the rock. Everyone is quiet.'),
        N('A baby fern grows in a crack. It is curled up tight.'),
        N('Next to it, pressed in the stone, is a very old fern.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'colour patterns: what comes next',
          standard: 'ELOF: Mathematics Development',
          kind: 'ask',
          after: 0,
          prompt: [N('(Say the stripes together: brown, red, grey, brown.)'), DU('Which colour comes after red?', 'think')],
          options: [
            opt('Grey', [DU('Yes! Brown, red, grey, brown.', 'happy')], true),
            opt('Brown', [DU('Brown after red? The cliff would look like toast!', 'think'), DU('Brown comes first and last. After red comes grey.', 'think')]),
          ],
          parentNote: 'Read a colour sequence and said which colour came next.',
        },
        {
          domain: 'science',
          skill: 'a fossil is a very old plant or animal kept in stone',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'notice',
          after: 8,
          lines: [
            DU('That old fern is a fossil. A plant from long, long ago.', 'think'),
            DU('Its shape got kept in the stone. That’s where Fossil got her name!', 'happy'),
          ],
          parentNote: 'Learned that a fossil is the shape of a very old living thing kept in rock.',
        },
      ],
    ),
    sc(
      's5-tree-ask',
      [
        DU('Next, Hazel’s first tree. The crooked one.', 'think'),
        DU('Shake it once. Only once!'),
        N('Fossil falls asleep on the way. Zzz.'),
        N('She wakes up just as you get there. Pop! Eyes open!'),
      ],
      [
        {
          domain: 'art',
          skill: 'straight and crooked lines',
          standard: 'ELOF: Perceptual, Motor, and Physical Development',
          kind: 'do',
          after: 0,
          check: 'edu:make:shape:straight-crooked',
          lines: [N('(Make your arm straight. Now make it crooked, like the tree!)'), DU('Bendy and bumpy. That’s crooked.', 'happy')],
          parentNote: 'Made straight and crooked shapes with their body.',
        },
      ],
    ),
    sc(
      's5-tree',
      [
        N('All your Nubbins follow. They sit in a row.'),
        N('They all open their mouths. Ahhh!'),
        DU('Once! Not twice.', 'think'),
        N('You shake the tree, once. One fruit falls.'),
        N('It misses every mouth. Plop! It lands in Fossil’s lap.'),
        DU('Hazel gave her one of these when she hatched.', 'happy'),
        N('Fossil eats a little. She gives the rest to Dusty.'),
        DU('Tastes like when I was little.', 'soft'),
      ],
      [
        {
          domain: 'maths',
          skill: 'more and fewer',
          standard: 'K.CC.C.6',
          kind: 'ask',
          after: 4,
          prompt: [DU('Lots of mouths. One fruit. Is there one for everyone?', 'think')],
          options: [
            opt('No, not enough', [DU('Right. More mouths than fruit. Fewer fruit than mouths!', 'happy')], true),
            opt('Yes, one each', [DU('One each? Munch, munch! That would be a very hungry queue.', 'think'), DU('Count them: lots of mouths, only one fruit. Not enough to go round!', 'think')]),
          ],
          parentNote: 'Compared groups to see that there were fewer fruits than mouths.',
        },
      ],
    ),
    sc(
      's5-water-ask',
      [
        DU('Last wish: the water. She can’t swim alone now.', 'sad'),
        DU('Marina taught her. She swam sideways!', 'happy'),
        N('Splish, splash! Marina is at the pond, with a towel.'),
        MA('I was just passing. With a towel.', 'soft'),
      ],
      [
        {
          domain: 'health',
          skill: 'always swim with a helper nearby',
          standard: 'CASEL: Responsible decision-making',
          kind: 'notice',
          after: 3,
          lines: [
            MA('Swimmers always have a helper close by. Even good swimmers.', 'soft'),
            N('(Ask: who helps you near water? Wait for an answer.)'),
          ],
          parentNote: 'Heard that swimmers always have a helper close by, and named who helps them.',
        },
      ],
      {
        choices: [
          {
            id: 'yours',
            label: 'Let one of your swimmers hold her.',
            set: { 's5-holder': 'yours' },
            then: [
              N('Your swimmer wades out. It looks very serious.'),
              MA('Paw under her chin. Like a cup.', 'soft'),
              DU('Look how careful it is. Like she’s a precious egg.', 'soft'),
            ],
          },
          {
            id: 'marina',
            label: 'Ask Marina to hold her.',
            set: { 's5-holder': 'marina' },
            then: [N('Marina wades in and holds out her hands.'), MA('Come on, old girl. Same as always.', 'soft')],
          },
        ],
      },
    ),
    sc(
      's5-water',
      [
        N('Splash! Fossil goes into the water. She floats!'),
        N('Then, very slowly, she kicks. She goes sideways, like a crab!'),
        N('(Wiggle your hand sideways, like Fossil.)'),
        DU('Look! Her sideways swim!', 'happy'),
        DU('To the reeds and back, Fos.'),
        N('Slowly, slowly, she swims. Nobody hurries her.'),
        N('She comes out shivering, with bright eyes.'),
        N('She looks at the Grove. She has a wish of her own.'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'opposites: slow and fast',
          standard: 'ELOF: Language and Communication',
          kind: 'ask',
          after: 5,
          prompt: [DU('Fossil swims slowly. What’s the opposite of slow?', 'think')],
          options: [
            opt('Fast', [DU('Yes! Slow and fast are opposites.', 'happy')], true),
            opt('Wet', [DU('She is wet! But the opposite of slow is fast.', 'happy')]),
          ],
          parentNote: 'Named a pair of opposites: slow and fast.',
        },
      ],
    ),
    sc(
      's5-secret',
      [
        N('Fossil walks across the Grove. Step… by… step.'),
        N('(Walk two fingers slowly, like Fossil. Slower than that!)'),
        N('She sits down by your littlest Nubbin.'),
        N('Your littlest was falling over a fruit. Now it stops.'),
        N('They look at each other. Then they just sit.'),
        DU('She did that for me once, on a bad day.', 'soft'),
        DU('She didn’t fix anything. She just sat with me.', 'soft'),
      ],
      [
        {
          domain: 'maths',
          skill: 'comparing: older and younger',
          standard: 'K.MD.A.2',
          kind: 'ask',
          after: 2,
          prompt: [N('Who is older: Fossil, or your littlest Nubbin?')],
          options: [
            opt('Fossil', [DU('Yes. Fossil is the oldest. Your littlest is the youngest.', 'soft')], true),
            opt('My littlest Nubbin', [DU('Your littlest is brand new! Fossil is much, much older.', 'happy')]),
          ],
          parentNote: 'Compared two characters by age using older and younger.',
        },
      ],
    ),
    sc(
      's5-gift',
      [
        N('The Sun goes down behind the hill.'),
        N('Nobody moves. Not Fossil. Not your littlest. Not you.'),
        N('Your other Nubbins fall asleep in a heap. One snores, very softly.'),
        N('Dusty sees the heap, and smiles.'),
        N('When it’s dark, Fossil touches noses with your littlest.'),
        N('Your littlest feels strong now. A gift from Fossil!'),
        N('It sits up so tall, it tips over. Plop! Up it gets.'),
      ],
      [
        {
          domain: 'science',
          skill: 'sunset, then night',
          standard: '1-ESS1-1',
          kind: 'notice',
          after: 0,
          lines: [N('The Sun goes down in the evening. That’s called sunset.'), N('Then the sky gets dark. Night time!')],
          parentNote: 'Learned that the Sun sets in the evening and then night comes.',
        },
      ],
    ),
    sc(
      's5-home',
      [
        N('Dusty picks Fossil up to carry her home.'),
        N('The little ball above her head is very pale now.'),
        DU('Fossil is very old. Soon she will die.', 'sad'),
        DU('That makes me sad. But today she did all her wishes.', 'soft'),
        N('Dusty hugs Fossil, very gently.'),
        DU('Thank you for walking with us.', 'soft'),
        N('Fossil gives you a baby fern, curled up tight.'),
        DU('She wants you to plant it. A fossil-fern!', 'soft'),
        DU('And take my old trowel. For digging.', 'happy'),
        N('At your gate, Dusty lifts and pushes, with Fossil in one arm.'),
        N('(Say it together: lift and push!)'),
        N('On the hill, Moss watches them go.'),
      ],
      [
        {
          domain: 'science',
          skill: 'what a plant needs to grow',
          standard: 'K-LS1-1',
          kind: 'ask',
          after: 7,
          prompt: [DU('What does a little fern need to grow?', 'think')],
          options: [
            opt('Soil, water and light', [DU('Yes. Soil, water and light. And time.', 'happy')], true),
            opt('A box in the dark', [DU('A fern in a dark box? Squeak! It would grumble in the dark.', 'think'), DU('In a dark box it won’t grow. It needs soil, water and light.', 'think')]),
          ],
          parentNote: 'Learned that plants need soil, water and light to grow.',
        },
      ],
    ),
  ],
  'Fossil’s death is not shown here (it belongs to chapter 6); sprout says plainly that she is very old and will die soon, with comfort straight after. The fossil-fern is a Grove plant; sprout calls Fossil’s gift a baby fern, not a seed (real ferns grow from spores, not seeds).',
);

// ================================================================== S6 Ash’s True Name
const S6: EduQuest = quest(
  's6',
  'Ash’s Name',
  {
    's6-s1': {
      goal: 'Ember asked you to come. Go and see Ash.',
      hint: 'Ember’s house is on the Moon side. Knock on the door.',
    },
    's6-s2': {
      goal: 'Find what Gran wrote about Ash’s egg.',
      hint: 'In the cottage, tap the bookshelf by the stove. Look on the bottom shelf.',
    },
    's6-s3': {
      goal: 'Take the book to Ember. Practise the three notes by the pond.',
      hint: 'Pick the notes Gran wrote down. Try as many times as you like.',
    },
    's6-s4': {
      goal: 'Be in Ember’s kitchen when she whistles to Ash.',
      hint: 'Go to Ember’s house after dark. Stand quietly by the door.',
    },
  },
  [
    sc(
      's6-kitchen',
      [
        N('A note under your door: COME OVER. PLEASE.'),
        N('Ember’s house is very, very tidy. Even the spoons stand in a row.'),
        N('Creak! The kitchen door opens.'),
        N('A grey Nubbin sits in the corner. She faces the wall.'),
        EM('Ash. Ash, love. It’s me.', 'soft'),
        N('Ash does not turn round.'),
        EM('I’ve said her name so many times.', 'sad'),
        EM('She was away so long. She forgot her name.', 'sad'),
      ],
      [
        {
          domain: 'sel',
          skill: 'understanding how a frightened friend feels',
          standard: 'CASEL: Social awareness',
          kind: 'ask',
          after: 4,
          prompt: [N('Ash faces the wall. How might she feel?')],
          options: [
            opt('Scared and lost', [EM('Yes. Scared and lost. She needs time.', 'soft')], true),
            opt('Happy and silly', [EM('Happy and silly? Ash would be spinning like a top!', 'sad'), EM('Happy Nubbins play and turn round. Ash feels scared and lost.', 'sad')]),
          ],
          parentNote: 'Read clues to work out that a character felt scared and lost.',
        },
      ],
      {
        choices: [
          {
            id: 'sit',
            label: 'Sit on the floor near Ash, and wait.',
            friendship: { ember: 1 },
            then: [N('You sit for a long time. Ash relaxes, just a little.'), EM('Gran used to sit on the floor too. Like it was a chair!', 'soft')],
          },
          {
            id: 'say-it',
            label: 'Say “Ash” yourself, gently.',
            then: [N('Ash doesn’t turn.'), EM('See? It isn’t just me.', 'sad')],
          },
          {
            id: 'what-called',
            label: 'Ask what Corvin called her.',
            then: [EM('Nothing. He never said her name.', 'angry'), EM('If nobody says your name, you might forget it too.')],
          },
        ],
      },
    ),
    sc(
      's6-egg',
      [
        N('Ember puts the kettle on.'),
        EM('When she was tiny, she answered to everything.'),
        EM('Her name. My name. Even the kettle!', 'happy'),
        N('The kettle whistles. Wheee! Ember glares at it.'),
        EM('Go home now. Thanks for coming. Don’t tell Fern.'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'first sounds in names',
          standard: 'RF.K.2',
          kind: 'ask',
          after: 3,
          prompt: [N('(Say the names slowly: Ash, Ember, Fern.)'), EM('Which name starts with an “eh” sound?', 'think')],
          options: [
            opt('Ember', [EM('Yes. Eh-Ember. That’s me.', 'happy')], true),
            opt('Ash', [EM('Ash for “eh”? An ash tree in an Ember hat! Hee!'), EM('Ash starts with “a”, like apple. Eh-Ember starts with “eh”.')]),
            opt('Fern', [EM('Fern for “eh”? A fern wearing Ember’s hat! Hee, hee!'), EM('Fern starts with “fff”. Eh-Ember starts with “eh”.')]),
          ],
          parentNote: 'Listened for the first sound in three names.',
        },
      ],
    ),
    sc(
      's6-fern',
      [
        N('Fern leans on the fence. Crunch! She eats an apple. Your apple!'),
        FE('You’ve been at Ember’s. You have that look.', 'think'),
        Y('Ash won’t answer to her name.'),
        FE('Oh, poor Ash. Poor Ember.', 'sad'),
        Y('Ash came from one of Gran’s eggs.'),
        FE('Then Ash is in Gran’s book! Gran wrote every egg down.', 'think'),
        FE('And the first sound each baby made.'),
        FE('Bottom shelf, behind the jam. Don’t eat the jam! It’s very old jam.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'asking before taking',
          standard: 'CASEL: Relationship skills',
          kind: 'ask',
          after: 0,
          prompt: [N('Fern took your apple without asking. What should she do next time?')],
          options: [
            opt('Ask, “May I have one?”', [FE('Oops. You’re right. May I have an apple, please?', 'happy')], true),
            opt('Just take it', [FE('Just take it? Crunch, and it’s gone! That’s what I did.', 'think'), FE('Hmm. That’s what I did. Asking first is kinder. May I?', 'think')]),
          ],
          parentNote: 'Talked about asking before taking something that belongs to someone else.',
        },
      ],
    ),
    sc(
      's6-register',
      [
        N('Behind the jam: a fat old book.'),
        N('On the front, Gran wrote: “EGGS.”'),
        N('And smaller: “Do not lend this to Byte.”'),
        N('Inside, a page says: “Given away.”'),
        HZ('“Egg 7. Given to Sparks. First sound: a bang!”', 'happy'),
        HZ('“Egg 23. Given to Byte. First sound: hic! Byte wrote that down too.”', 'think'),
        HZ('“Egg 41. Given to Ember, aged fifteen. She promised to feed it first.”', 'soft'),
        HZ('“First sound: three notes. Low, high, and a little one.”'),
        N('Gran drew three dots. Low, high, and a tiny one going up.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'show 7 on fingers',
          standard: 'K.CC.B.4',
          kind: 'do',
          after: 4,
          check: 'edu:show:fingers:7',
          lines: [N('(Egg 7! Hold up seven fingers together.)'), N('(Five on one hand, and two more. Seven!)')],
          parentNote: 'Showed seven on their fingers as five and two more.',
        },
      ],
    ),
    sc(
      's6-practise',
      [
        N('Ember reads the page. Twice.'),
        EM('What if I call her and she doesn’t come?', 'sad'),
        N('She comes to the pond anyway, frowning.'),
        EM('I can’t sing. But I can whistle.'),
        EM('You go first. Low, high, little one. Like a question.'),
        N('Your Nubbins sit on the bank to watch. Plop!'),
        EM('If a duck answers, we’re stopping.'),
      ],
      [
        {
          domain: 'music',
          skill: 'low and high notes',
          kind: 'do',
          after: 4,
          check: 'edu:sing:notes:low-high-up',
          lines: [
            N('(Sing a low note. Now a high note. Then a little one going up!)'),
            EM('Low… high… little one? Like a question!', 'think'),
          ],
          parentNote: 'Sang low and high notes and a little rising note, like a question.',
        },
      ],
      {
        choices: [
          {
            id: 'high-low-question',
            label: 'Whistle: high, low, a little one.',
            then: [N('One of your Nubbins sneezes. Ember laughs.'), EM('Wrong way round! High comes second. Again.', 'happy')],
          },
          {
            id: 'low-question-high',
            label: 'Whistle: low, a little one, high.',
            then: [N('The last note goes up and up, like a kettle!'), EM('Nearly! The little one comes last. Again.', 'happy')],
          },
          {
            id: 'low-high-question',
            label: 'Whistle: low, high, and a little one.',
            set: { 's6-notes': true },
            friendship: { ember: 2 },
            then: [
              N('Low, high, and a little one, like a question.'),
              N('Every Nubbin on the bank turns its head!'),
              EM('…Oh.', 'soft'),
              EM('Again. Slower.', 'soft'),
            ],
          },
        ],
      },
    ),
    sc(
      's6-ember-tries',
      [
        N('Ember whistles the three notes. Quietly.'),
        N('From across the pond, a duck answers. QUACK!'),
        EM('No.', 'angry'),
        N('Ember glares at the duck. Splash! The duck does not care.'),
        N('But Ember heard herself do it.'),
        EM('Tonight. You’re coming. Don’t say anything.'),
      ],
      [
        {
          domain: 'science',
          skill: 'animal babies: a baby duck is a duckling',
          standard: '1-LS3-1',
          kind: 'ask',
          after: 1,
          prompt: [N('Ducks say quack. What is a baby duck called?')],
          options: [
            opt('A duckling', [N('Yes! A duckling. It looks like a small, fluffy duck.')], true),
            opt('A kitten', [N('A kitten on the pond? Splash! Miaow!'), N('A kitten is a baby cat. A baby duck is a duckling.')]),
            opt('A puppy', [N('A puppy on the pond? Splash! Woof!'), N('A puppy is a baby dog. A baby duck is a duckling.')]),
          ],
          parentNote: 'Named a duck’s baby (duckling) and other animal babies.',
        },
      ],
    ),
    sc(
      's6-whistle',
      [
        N('Ember’s kitchen at night. One lamp is lit.'),
        N('Ash faces the wall. Ember kneels a little way off.'),
        N('Ember whistles. Low, high, and a little one.'),
        N('Ash’s ear moves. Just a little.'),
        N('Ember whistles again. Slower than that. Her hands shake.'),
        N('Ash turns round.'),
        N('Then a tiny sound: pip. wirr. a?'),
        N('Pitter, patter. Step by step, Ash comes. She leans on Ember’s knee.'),
        EM('Hello, you. It’s me. It was always me.', 'soft'),
      ],
      [
        {
          domain: 'sel',
          skill: 'giving a scared friend space',
          standard: 'CASEL: Social awareness',
          kind: 'notice',
          after: 1,
          lines: [N('Ember doesn’t go too close. She gives Ash space.'), N('Space helps a scared friend feel safe.')],
          parentNote: 'Saw how giving space helps a scared friend feel safe.',
        },
        {
          domain: 'literacy',
          skill: 'sound words',
          standard: 'ELOF: Language and Communication',
          kind: 'do',
          after: 6,
          check: 'edu:say:sound:ash',
          lines: [N('(Make Ash’s sound together: pip, wirr, a?)'), N('Pip, wirr, a. That’s Ash’s very own sound.')],
          parentNote: 'Copied a character’s sound word aloud.',
        },
      ],
      {
        choices: [
          {
            id: 'stay',
            label: 'Stay by the door, very quietly.',
            then: [N('Ember cries quietly. Happy tears.'), N('Ash lets her.')],
          },
          {
            id: 'leave',
            label: 'Tiptoe out. This is their time.',
            friendship: { ember: 2 },
            then: [N('You lift the latch slowly. No click.'), N('Behind you, Ember whistles. Ash answers every time.')],
          },
        ],
      },
    ),
    sc(
      's6-complete',
      [
        N('Next morning, Ember lifts your gate and pushes. Ash walks close.'),
        EM('Clover says the grey stays. You can only make it lighter.', 'think'),
        EM('Ash is still grey. But she ate breakfast with me!', 'happy'),
        EM('A happier Ash. That’s what lighter means.', 'soft'),
        EM('The whistle is her first name. Ash is the name I gave her.'),
        EM('Here. Ash’s first ribbon. Give it to one of yours.'),
        EM('Now I’ll teach you her first name. Two fingers, like that. Blow!'),
        N('Try one: pfff. Try two: a squeak!'),
        N('Try three: quack! A duck quacks back.'),
        EM('Not the duck again.', 'angry'),
        N('Try four: pfff. Try five: wheee! Three Nubbins come running!'),
        EM('Don’t tell anyone I like you.', 'happy'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 5; keep trying',
          standard: 'K.CC.B.5',
          kind: 'do',
          after: 10,
          check: 'edu:count:tries:5',
          lines: [
            N('(Count the tries on your fingers: one, two, three, four, five!)'),
            EM('Five tries. You kept going. That’s how you learn.', 'happy'),
          ],
          parentNote: 'Counted five tries and heard that practice is how we learn.',
        },
      ],
    ),
  ],
  'Corvin appears only by name (“he never said her name”). s6-s4 has no done scene in the source.',
);

// ================================================================== S7 Unverified
const S7: EduQuest = quest(
  's7',
  'Null and the Clock',
  {
    's7-s1': {
      goal: 'Find Byte after Moss’s talk.',
      hint: 'Byte is on the low wall by the long grass, writing.',
    },
    's7-s2': {
      goal: 'See the clock Pixel built for Null.',
      hint: 'Pixel’s bench is behind the lantern shed. Follow the tick-tock.',
    },
    's7-s3': {
      goal: 'After a week, go and see Null.',
      hint: 'Visit Byte’s house when the journal says a week has gone by.',
    },
    's7-s4': {
      goal: 'Spend an evening with Null. No clock. Wait for Null to come to you.',
      hint: 'Sit still near Null. Only pet Null when it comes close by itself.',
    },
  },
  [
    sc(
      's7-unverified',
      [
        N('After Moss’s talk, Byte sits on the wall, writing.'),
        N('Beside him is a pale blue Nubbin. That’s Null.'),
        BY('Null is four years old. And some weeks.'),
        M('Love can help a Nubbin live a very, very long time.', 'think'),
        BY('How much love? A cupful? A bucketful? I’ll measure it!'),
        M('Your shoelace is untied.'),
        N('Byte looks down. It is. It always is! Hee, hee!'),
        M('Things on a clock learn to wait for the bell, Byte.', 'think'),
        M('Safe is not the same as well.', 'think'),
        N('Byte writes it down. Then he writes: NOT CHECKED.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'show 4 on fingers; how old are you',
          standard: 'K.CC.B.4',
          kind: 'do',
          after: 2,
          check: 'edu:show:fingers:4',
          lines: [N('(Null is four. Hold up four fingers!)'), N('(How old are you? Show me on your fingers.)')],
          parentNote: 'Showed four on their fingers and then their own age.',
        },
        {
          domain: 'health',
          skill: 'checking our shoes are done up',
          standard: 'ELOF: Perceptual, Motor, and Physical Development',
          kind: 'do',
          after: 6,
          check: 'edu:check:shoes:fastened',
          lines: [
            N('(Look at your shoes. Laces, buckles or sticky straps?)'),
            M('Done-up shoes stop you tripping. Always worth a look.', 'think'),
          ],
          parentNote: 'Checked their own shoes and talked about laces, buckles and straps.',
        },
      ],
      {
        choices: [
          {
            id: 'help',
            label: 'I’ll help. What do you need?',
            friendship: { byte: 2 },
            then: [BY('Fruit, a bed, and a helper who watches.', 'happy')],
          },
          {
            id: 'moss-right',
            label: 'Moss is usually right, Byte.',
            then: [BY('“Usually” isn’t always!', 'think'), N('Moss pretends to sleep. He is bad at it.')],
          },
          {
            id: 'pet-null',
            label: 'Pet Null.',
            then: [N('Null leans into your hand. Then leans more!'), BY('Fine. Once.', 'think')],
          },
        ],
      },
    ),
    sc(
      's7-minder',
      [
        N('Pixel’s bench: a clock, three little bells, and a tiny bed.'),
        PX('It was my lantern clock. Now it’s Null’s clock.', 'think'),
        PX('Bell one: fruit drops. Bell two: the bed warms.', 'happy'),
        PX('Bell three: petting! Byte does the petting.'),
        BY('Exactly ninety seconds. I tested it.', 'think'),
        PX('We call it the Minder.'),
        N('Tick. A plum shoots out. Bonk! It hits Byte.'),
        PX('That was a test.', 'think'),
        BY('That was a plum.'),
        PX('Byte and I are married. He argues with my clocks.', 'soft'),
        PX('A clock doesn’t care. I’m trying to care for it.', 'sad'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'first, next, last',
          standard: 'RL.K.3',
          kind: 'ask',
          after: 3,
          prompt: [PX('Bell one, bell two, bell three. What happens first?', 'think')],
          options: [
            opt('Fruit drops', [PX('Yes! First fruit. Next the bed. Last, petting!', 'happy')], true),
            opt('The bed warms', [PX('The bed first? Snore! Plop, the fruit comes down before that.'), PX('That’s next. First the fruit drops. Then the bed. Then petting.')]),
            opt('Petting', [PX('Petting first? Hee, hee! Petting comes last of all.'), PX('That’s last! First fruit, next bed, last petting.')]),
          ],
          parentNote: 'Put three steps in order using first, next and last.',
        },
      ],
      {
        choices: [
          {
            id: 'hungry',
            label: 'What if Null is hungry before the bell?',
            then: [BY('Null won’t be. The bell is set.'), PX('I asked him that too.', 'think')],
          },
          {
            id: 'lever',
            label: 'Does it have an off switch?',
            set: { 's7-lever': true },
            friendship: { pixel: 2 },
            then: [PX('Yes! A lever. I always add a lever.', 'happy'), PX('Thank you for asking!', 'soft')],
          },
        ],
      },
    ),
    sc(
      's7-first-bell',
      [
        N('Byte puts Null in the little bed. Ding! Bell one.'),
        N('Null looks at Byte. Then at the bell. Then eats.'),
        BY('Day one. Come back in a week.'),
        PX('It’s just a clock. Clocks are fine.', 'think'),
      ],
      [
        {
          domain: 'maths',
          skill: 'a week is seven days; count to 7',
          standard: 'K.CC.A.1',
          kind: 'do',
          after: 2,
          check: 'edu:count:days:7',
          lines: [BY('A week is seven days.', 'think'), N('(Count to seven together. One whole week!)')],
          parentNote: 'Learned that a week has seven days and counted to seven.',
        },
      ],
    ),
    sc(
      's7-week',
      [
        N('A week later. Null sits up in its bed, waiting.'),
        BY('Best week ever! Null eats so neatly.', 'happy'),
        PX('Watch this.', 'sad'),
        N('Pixel rolls a ball. Null doesn’t chase it.'),
        N('Ding! Null eats. It only looks at the bell.'),
        N('Null’s blue has gone pale at the edges.'),
        BY('It used to chase that ball everywhere. Why won’t it play?', 'shock'),
        PX('I think Null waits for the bell. Only the bell.', 'sad'),
        BY('Moss told me. And I didn’t listen.', 'sad'),
      ],
      [
        {
          domain: 'health',
          skill: 'we need food, rest, play and love',
          kind: 'ask',
          after: 7,
          prompt: [PX('What does a Nubbin need to be well?', 'think')],
          options: [
            opt('Food, rest, play and love', [PX('Yes. All of them. Not just the ones on a clock.', 'soft')], true),
            opt('Just food and a bed', [
              PX('Food and rest keep it alive.', 'soft'),
              PX('Play and love make it well. It needs them all.', 'soft'),
            ]),
          ],
          parentNote: 'Talked about needing play and love as well as food and rest.',
        },
      ],
      {
        choices: [
          {
            id: 'lever',
            label: 'Pull the lever.',
            set: { 's7-stopped': true },
            then: [N('Pixel pulls it at once. The ticking stops.'), N('It is very, very quiet.'), PX('I always add a lever.', 'soft')],
          },
          {
            id: 'rule-three',
            label: 'Sit down by Null, Byte. And wait.',
            set: { 's7-stopped': true },
            friendship: { byte: 1 },
            then: [BY('For how long?'), Y('Until Null stops waiting for the bell.'), N('Byte pulls the lever himself.')],
          },
        ],
      },
    ),
    sc(
      's7-same-graph',
      [
        BY('I wanted to keep Null safe. I kept it too still.', 'sad'),
        BY('Moss said it. Safe is not the same as well.', 'sad'),
        N('Null waits for a bell that doesn’t come. No ding, no dong.'),
        N('It looks a little lost.'),
        PX('Tomorrow, no clock. We’ll just sit. We’re good at sitting.', 'soft'),
      ],
      [
        {
          domain: 'sel',
          skill: 'saying “I was wrong”',
          standard: 'CASEL: Self-awareness',
          kind: 'notice',
          after: 1,
          lines: [BY('I was wrong.', 'sad'), N('Saying “I was wrong” is hard. It’s also brave.')],
          parentNote: 'Heard a character admit a mistake, and that this is brave.',
        },
      ],
    ),
    sc(
      's7-no-clock',
      [
        N('Evening in Byte’s garden. No bells.'),
        N('Byte holds his stopwatch. His thumb wiggles.'),
        N('He sits on his thumb.'),
        N('Null sits in the grass. For a long time, nothing.'),
        PX('Slow, Byte. Slower than that.', 'soft'),
        N('Then a moth flutters past. Swish! Null’s head turns!'),
        BY('Did you see that? That’s not on any list!', 'shock'),
        N('Null takes one step after the moth. Then it looks at you.'),
      ],
      [
        {
          domain: 'science',
          skill: 'moths fly at night',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'notice',
          after: 5,
          lines: [N('Most moths fly at night. They like lights.'), N('Most butterflies fly in the day.')],
          parentNote: 'Learned that most moths fly at night and most butterflies fly by day.',
        },
      ],
      {
        choices: [
          {
            id: 'go-on',
            label: 'Nod. “Go on.”',
            then: [N('Null runs. It falls into the hedge!'), N('It comes out with a leaf on its head.'), N('Null says prrp! Byte does not write that down.')],
          },
          {
            id: 'stopwatch',
            label: 'Put the stopwatch down, Byte.',
            friendship: { byte: 2 },
            then: [N('Byte puts it face down in the grass.'), BY('It’s still ticking. But I can’t see it. That’s a start.')],
          },
        ],
      },
    ),
    sc(
      's7-lap',
      [
        N('Near dark, Null climbs into Byte’s lap.'),
        N('It falls asleep at once.'),
        N('Byte sits still for an hour. His nose itches. Nearly an achoo!'),
        N('He lets it itch. He doesn’t check the time.'),
        BY('Its edges look bluer. Don’t tell me if I’m wrong.', 'soft'),
      ],
      [
        {
          domain: 'art',
          skill: 'naming the colour blue',
          kind: 'do',
          after: 4,
          check: 'edu:find:colour:blue',
          lines: [N('(Find something blue near you. Point to it!)'), N('(Is it pale blue, like Null? Or dark blue?)')],
          parentNote: 'Found something blue and compared pale and dark blue.',
        },
      ],
    ),
    sc(
      's7-complete',
      [
        N('A few days later, Pixel knocks. She is very quiet.'),
        N('Pixel takes your hand.'),
        N('Null is under Byte’s hedge. Null is old now.'),
        N('Null’s long life is ending. Around it, a glowing cocoon grows.'),
        N('Byte sits with his hand on it. He doesn’t count.'),
        N('The cocoon glows gold. Pop! It opens. An egg!'),
        BY('Null gets to start again. And I’ll remember it.', 'soft'),
        BY('Here. My stopwatch. Please keep it.'),
        PX('And the clock. It only counts lanterns now.', 'soft'),
        N('Byte’s shoelace is tied. Nobody told him to. It won’t last!'),
      ],
      [
        {
          domain: 'science',
          skill: 'life cycles: caterpillar, cocoon, moth',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'notice',
          after: 5,
          lines: [N('In real life, a caterpillar makes a cocoon.'), N('Later, a moth comes out! Living things change as they grow.')],
          parentNote: 'Heard about a real life cycle: caterpillar, cocoon, moth.',
        },
      ],
    ),
  ],
  'UNVERIFIED is “NOT CHECKED” for read-aloud. Null’s end of life is said plainly and ends in rebirth, as in the source. s7-s1 has no done scene in the source.',
);

// ================================================================== S8 The Warren in the Hollow
/** The end of S8’s complete scene, shared by s8-complete and its variant s8-complete-dawn (as in the source). */
const S8_TAIL: Line[] = [
  HZ('Take this little one home, love.', 'soft'),
  N('At the ring, the little one sees her mum. She wiggles with joy!'),
  N('Slurp! Bramble washes her, ear to ear.'),
  N('Then Bramble drops her old ribbon at your feet. A thank-you.'),
  NO('That’s you invited. Come any time. Bring soft fruit.', 'soft'),
];

const S8: EduQuest = quest(
  's8',
  'The Ring of Roots',
  {
    's8-s1': {
      goal: 'Follow Nova and the fireflies past Gran’s camp.',
      hint: 'Walk when the fireflies float. Stop when they stop.',
    },
    's8-s2': {
      goal: 'Leave fruit by the ring of roots, a little at a time.',
      hint: 'Bring twelve fruits over three evenings. Put them down, then step back.',
    },
    's8-s3': {
      goal: 'Bring Fern to the ring of roots.',
      hint: 'Fern is at her gate next door. Walk with her to the Hollow.',
    },
    's8-s4': {
      goal: 'Sit by the ring with Fern. Let the old Nubbin come to her.',
      hint: 'Sit down by the roots and wait. Don’t reach in.',
    },
  },
  [
    sc(
      's8-further',
      [
        N('Nova steps out of the trees.'),
        NO('This is Gran’s camp. But it isn’t all of it.', 'think'),
        NO('Gran wrote, “Fed nineteen today.” But there are only twelve bowls.'),
        NO('So she carried food further in.'),
        N('A firefly lands on the notebook. Plop! Blink, blink!'),
        N('You blink back. The firefly flies off.'),
        NO('The fireflies go the same way every night.'),
        NO('Bring fruit. Walk slowly. Slower than that.'),
        N('(Walk your fingers on your knee. Slow… slower… slower than that!)'),
      ],
      [
        {
          domain: 'maths',
          skill: 'more and fewer',
          standard: 'K.CC.C.6',
          kind: 'ask',
          after: 2,
          prompt: [NO('Nineteen Nubbins. Twelve bowls. Are there more Nubbins, or more bowls?', 'think')],
          options: [
            opt('More Nubbins', [NO('Yes. Nineteen is more than twelve. Not enough bowls!', 'think')], true),
            opt('More bowls', [NO('More bowls than Nubbins? Clink, clink! Bowls would be left over!', 'think'), NO('Twelve is fewer than nineteen. So there were more Nubbins than bowls.', 'think')]),
          ],
          parentNote: 'Compared nineteen and twelve to see which is more.',
        },
      ],
      {
        choices: [
          {
            id: 'lead',
            label: 'Lead the way.',
            then: [NO('I don’t lead. I follow fireflies. You follow me.')],
          },
          {
            id: 'nubbin',
            label: 'Should my Nubbin wait here?',
            friendship: { nova: 1 },
            then: [NO('No. Bring a Nubbin who trusts you. Then they’ll trust you too.')],
          },
        ],
      },
    ),
    sc(
      's8-ring',
      [
        N('Creak! The fireflies stop over a ring of old roots.'),
        N('Inside sit lots of grey Nubbins, in a circle.'),
        N('In the middle sits an old grey Nubbin.'),
        N('Her ear folds over at the tip. A faded ribbon is tied on it.'),
        NO('They aren’t lost. They know where they are.', 'soft'),
        NO('That one’s in charge. I call her the Old Girl.'),
      ],
      [
        {
          domain: 'science',
          skill: 'fireflies make their own light',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'notice',
          after: 0,
          lines: [
            NO('Fireflies are little beetles. They make their own light!', 'happy'),
            N('(Open and shut your hands, like a firefly. Blink, blink!)'),
          ],
          parentNote: 'Learned that fireflies are beetles that make their own light.',
        },
      ],
    ),
    sc(
      's8-edge',
      [
        N('You step towards the roots. Every grey head turns. Swish!'),
        NO('Yes. They do that.', 'think'),
        NO('Don’t go in. This is their home.'),
        NO('We don’t walk into a home without being asked.'),
        Y('How did Gran feed them?'),
        NO('She left food at the edge and stepped back. Every night.'),
        N('By the Old Girl sits a very thin grey Nubbin.'),
        N('The thin one’s ear folds at the tip. Like the Old Girl’s!'),
        NO('Her baby, I think. She doesn’t eat much.', 'soft'),
      ],
      [
        {
          domain: 'social-studies',
          skill: 'respecting other people’s homes',
          standard: 'D2.Civ.8.K-2',
          kind: 'ask',
          after: 3,
          prompt: [NO('You visit a friend’s home. What do you do first?', 'think')],
          options: [
            opt('Knock, and wait to be asked in', [NO('Yes. Knock and wait. That’s respect.', 'soft')], true),
            opt('Walk straight in', [NO('Walk straight in? Stomp, stomp! They might hide behind a leaf.', 'soft'), NO('That might scare them. We knock and wait to be asked in.', 'soft')]),
          ],
          parentNote: 'Talked about knocking and waiting to be invited into someone’s home.',
        },
      ],
      {
        choices: [
          {
            id: 'soft-fruit',
            label: 'Leave the softest fruit near the thin one.',
            set: { 's8-soft-fruit': true },
            friendship: { nova: 1 },
            then: [NO('That’s just what Gran did!', 'shock')],
          },
          {
            id: 'sit-off',
            label: 'Put the fruit down. Sit a little way off.',
            then: [N('You sit. At last, one grey Nubbin takes a fruit.'), NO('Good. Now, three nights of this.')],
          },
        ],
      },
    ),
    sc(
      's8-gap',
      [
        N('On the third night, the Old Girl stands up.'),
        N('She steps aside. Swish! There’s a gap, just for you!'),
        NO('I sit by these roots whenever I pass. She never did that for me!', 'shock'),
        N('The Old Girl’s ribbon is brown. A leaf is sewn on it.'),
        N('The leaf has five points and a curly stem.'),
        N('You’ve seen that leaf before. On Fern’s gloves! On Fern’s gate!'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 5',
          standard: 'K.CC.B.5',
          kind: 'do',
          after: 4,
          check: 'edu:count:leaf-points:5',
          lines: [N('(Hold up one hand. Five fingers, like five leaf points!)'), N('(Count them: one, two, three, four, five.)')],
          parentNote: 'Counted five points on a leaf using the fingers of one hand.',
        },
      ],
    ),
    sc(
      's8-fern-gate',
      [
        N('Creak! Fern is at her gate, sewing a leaf on a glove.'),
        FE('I put leaves on everything. Once I put one on a ribbon.', 'think'),
        FE('That was for Bramble, my Nubbin.'),
        FE('At a race, long ago, she fell at the cliff bend.', 'sad'),
        FE('I looked till dark. I never found her.', 'sad'),
        FE('I still miss her.', 'sad'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'first sound b',
          standard: 'RF.K.2',
          kind: 'ask',
          after: 2,
          prompt: [N('(Say it slowly: b-b-Bramble.)'), N('Which word starts with “b” too?')],
          options: [
            opt('Ball', [N('Yes! B-b-ball, b-b-Bramble.')], true),
            opt('Fish', [N('Fish for Bramble? Splash! A ball with fins? Hee!'), N('Fish starts with “fff”. Ball starts with “b”, like Bramble!')]),
            opt('Sun', [N('Sun for “ball”? A sun bouncing down the lane! Boing!'), N('Sun starts with “sss”. Ball starts with “b”, like Bramble!')]),
          ],
          parentNote: 'Matched the first sound “b” in Bramble and ball.',
        },
        {
          domain: 'sel',
          skill: 'missing someone, and talking about it',
          standard: 'CASEL: Self-awareness',
          kind: 'notice',
          after: 5,
          lines: [N('Fern misses Bramble. Missing someone can last a long time.'), N('Talking about it, like Fern does, can help.')],
          parentNote: 'Heard that missing someone can last a long time and that talking helps.',
        },
      ],
      {
        choices: [
          {
            id: 'tell',
            label: 'Fern. I think I’ve found her.',
            set: { 's8-told': true },
            friendship: { fern: 1 },
            then: [FE('Don’t say that. Not unless it’s true.', 'sad'), Y('Bring soft fruit.'), N('Fern runs through her gate. She still holds her needle!')],
          },
          {
            id: 'ask',
            label: 'Will you help me carry fruit tonight?',
            set: { 's8-told': false },
            then: [FE('The Hollow? At night? …Fine.', 'think'), N('You don’t tell her why. Not yet.')],
          },
        ],
      },
    ),
    sc(
      's8-arrive',
      [
        N('The fireflies float ahead of you both.'),
        FE('It’s so dark! I can’t see my own feet!', 'think'),
        N('Bonk. Fern walks into a tree. “Sorry, tree.”'),
        N('Bonk. The same tree again!'),
        FE('I’m carrying the soft fruit. I sat on two.', 'sad'),
        N('At the stream, Fern takes her boots off and wades across.'),
        N('She puts them back on the wrong feet!'),
        N('Then the fireflies stop. Fern goes very quiet.'),
      ],
      [
        {
          domain: 'health',
          skill: 'left and right',
          standard: 'ELOF: Perceptual, Motor, and Physical Development',
          kind: 'do',
          after: 6,
          check: 'edu:wiggle:feet:left-right',
          lines: [N('(Wiggle your left foot. Now wiggle your right foot!)'), FE('Left boot, left foot. Right boot, right foot. Oops!', 'happy')],
          parentNote: 'Practised left and right with their own feet.',
        },
      ],
    ),
    sc(
      's8-reunion',
      [
        N('Fern stops at the roots. She looks at the middle.'),
        N('The Old Girl stands up. Her brown ribbon hangs from her ear.'),
        FE('Bramble? Oh, you’ve gone grey. That’s all right. So have I.', 'soft'),
        N('Nobody moves.'),
        N('Then Bramble walks out. Step by step. All the way to Fern.'),
        N('Bramble says nothing. She leans on Fern’s leg.'),
        FE('I’m sorry I stopped looking. I’m so sorry.', 'sad'),
        N('Bramble sits down on Fern’s boots. Plop! Both boots! And she stays.'),
        FE('I’m going to cry now. Happy crying. Hold my gloves!', 'happy'),
      ],
      [
        {
          domain: 'sel',
          skill: 'happy tears',
          standard: 'CASEL: Self-awareness',
          kind: 'notice',
          after: 8,
          lines: [N('People can cry when they’re happy, too.'), N('Big feelings sometimes come out as tears.')],
          parentNote: 'Learned that people can cry when they are happy.',
        },
      ],
      {
        choices: [
          {
            id: 'gloves',
            label: 'Hold her gloves.',
            friendship: { fern: 2 },
            then: [N('You hold them. Fern sits in the mud with Bramble in her lap.'), N('She cries a long time. Bramble lets her.')],
          },
          {
            id: 'new-ribbon',
            label: 'Give Fern a ribbon from your pocket.',
            set: { 's8-new-ribbon': true },
            friendship: { fern: 3 },
            then: [
              FE('You carry ribbons? Of course you do!', 'think'),
              N('Fern sews a leaf on it. She ties it under the old one.'),
              FE('Now she has two!', 'happy'),
            ],
          },
        ],
      },
    ),
    sc(
      's8-one-short',
      [
        N('Later, Bramble goes back to the middle of the ring.'),
        FE('She always did like being in charge.', 'soft'),
        N('Bramble looks up the dark path.'),
        NO('Bramble’s thin baby isn’t here tonight.', 'think'),
        FE('Then we leave soft fruit at the edge. Till she comes back.', 'soft'),
        N('Fern puts a plum down. Not one she sat on!'),
      ],
      [
        {
          domain: 'science',
          skill: 'soft and hard',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'ask',
          after: 5,
          prompt: [FE('Soft fruit is easy for a little one. Which is softer?', 'think')],
          options: [
            opt('A ripe banana', [FE('Yes! Squishy and soft. Easy to eat.', 'happy')], true),
            opt('A hard nut', [FE('A nut is hard. Crunch! A ripe banana is softer.', 'think')]),
          ],
          parentNote: 'Sorted foods by how they feel: soft and hard.',
        },
      ],
    ),
    sc(
      's8-complete',
      [
        N('Gran sits by the pond, holding a thin grey baby.'),
        HZ('I found her by a ring of roots. Too tired to stand.', 'think'),
        HZ('So I carried her. Her mother runs that place.'),
        Y('Fern found her mother. Her name is Bramble.'),
        HZ('Did she? Oh, Fern.', 'soft'),
        ...S8_TAIL,
      ],
      [
        {
          domain: 'science',
          skill: 'animal parents look after their babies',
          standard: '1-LS1-2',
          kind: 'notice',
          after: 7,
          lines: [N('Many animal mums and dads look after their babies.'), N('They clean them, feed them and keep them warm.')],
          parentNote: 'Learned that many animal parents clean, feed and warm their young.',
        },
      ],
    ),
  ],
  'Bramble is “the Old Girl” until Fern names her, as in the source. Nothing says where Gran is before her line in s8-complete. ' +
    'Bramble’s ear folds over at the tip, and so does her youngest’s; neither is torn (Wisp has the torn ear). ' +
    'The variant s8-complete-dawn (in S8_VARIANTS) replaces s8-complete when c10-bramble has played; both end with S8_TAIL.',
);

const S8_VARIANTS: EduScene[] = [
  sc(
    's8-complete-dawn',
    [
      N('Gran sits by the pond, holding the thin grey baby.'),
      N('Fern sits beside her. She has been there all morning.'),
      HZ('Fern told me all about it. Twice! Once crying.', 'happy'),
      ...S8_TAIL,
    ],
    [
      {
        domain: 'maths',
        skill: 'twice means two times',
        standard: 'K.CC.B.4',
        kind: 'do',
        after: 2,
        check: 'edu:clap:times:2',
        lines: [N('(Twice means two times. Clap twice together: clap, clap!)'), HZ('Two times. I liked both of them.', 'happy')],
        parentNote: 'Learned that “twice” means two times, and clapped twice.',
      },
    ],
  ),
];

// ================================================================== S9 The Gate That Sticks
const S9_GUEST: Choice = {
  id: 'guest',
  label: 'Open it for him. Don’t show him how.',
  set: { corvinGate: 'guest' },
  then: [N('You lift and push. The gate opens.'), C('Thank you. I’ll knock every time.', 'soft'), N('By the pond, Gran gives a tiny wave.')],
};
const S9_SHUT: Choice = {
  id: 'shut',
  label: 'Leave it shut. Not today.',
  set: { corvinGate: 'shut' },
  friendship: { ember: 1 },
  then: [
    N('You stay still. Corvin nods.'),
    C('All right. That’s fair.', 'sad'),
    C('Thank you for taking the trowel.', 'soft'),
    N('He walks away down the lane.'),
    N('Gran sits by the pond a little longer.'),
  ],
};
const S9_FAMILY: Choice = {
  id: 'family',
  label: 'Show him the trick. “Lift and push.”',
  set: { corvinGate: 'family' },
  friendship: { luna: 1, clover: 1 },
  then: [
    Y('Lift and push. Both together.'),
    N('Corvin lifts the gate a little. Then he pushes.'),
    N('It swings open! Then it sticks again behind him.'),
    C('Oh. That’s all it ever was.', 'soft'),
    N('He sits by the pond near Gran. She hands him her cup.'),
    N('In the long grass, the grey ear is still flat. Not today.'),
  ],
};

const S9: EduQuest = quest(
  's9',
  'The Gate That Sticks',
  {
    's9-step1': {
      goal: 'Take the old trowel to Gran.',
      hint: 'The trowel is by the cottage step. Tap it!',
    },
    's9-step2': {
      goal: 'Go to the gate at sunset tomorrow.',
      hint: 'Corvin comes when the Sun goes down. Just stand by the gate.',
    },
    's9-step3': {
      goal: 'Be at the gate first thing in the morning.',
      hint: 'When the new day starts, go to the gate before anything else.',
    },
  },
  [
    sc(
      's9-dusk',
      [
        N('Evening. The gate rattles. Rattle, rattle.'),
        HZ('That’ll be him.', 'soft'),
        N('Gran doesn’t get up. Her eyes are shut.'),
        HZ('Go on. It’s your gate now.'),
        N('Corvin is at the gate. He did a wrong thing, long ago.'),
        N('He doesn’t look grumpy now. He looks lonely and tired.'),
        C('My hands were cold for years. Now they’re warm again.', 'sad'),
        C('Getting warm hurts a bit. Nobody tells you that.', 'sad'),
        N('He pushes the gate. Creak! It sticks. He doesn’t know the trick.'),
        C('This trowel is Hazel’s. Please give it back to her.', 'soft'),
      ],
      [
        {
          domain: 'science',
          skill: 'cold hands tingle as they warm; rubbing hands warms them',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'do',
          after: 7,
          check: 'edu:rub:hands:warm',
          lines: [N('When cold hands warm up, they can tingle.'), N('(Rub your hands together fast. Can you feel them get warm?)')],
          parentNote: 'Rubbed their hands together to feel them warm up.',
        },
      ],
      {
        choices: [
          {
            id: 'why',
            label: 'Why now?',
            then: [C('Because I can feel my hands again.', 'soft'), N('He walks away down the lane.')],
          },
          {
            id: 'come-in',
            label: 'Do you want to come in?',
            then: [C('Yes. But not tonight. I haven’t asked yet.', 'think'), N('He walks away. He doesn’t look back.')],
          },
          {
            id: 'take',
            label: 'Say nothing. Take the trowel.',
            then: [N('You take it. The handle is warm.'), C('Thank you.', 'soft')],
          },
        ],
      },
    ),
    sc(
      's9-trowel',
      [
        N('Gran turns the trowel over in her hands.'),
        HZ('My old trowel! I wondered where it went.', 'think'),
        HZ('Corvin was my helper, long ago. Clever, and in a hurry.'),
        HZ('He tried to make my Nubbins keep very still. That was wrong.', 'sad'),
        HZ('I stopped him. That night, he took some Nubbins away.', 'sad'),
        HZ('In the morning, I made the gate stick.'),
        Y('So he couldn’t come back in?'),
        HZ('No, love. So I’d hear him if he ever came back.', 'soft'),
        HZ('A sticky gate rattles. I always hear it.', 'happy'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'sound words',
          standard: 'ELOF: Language and Communication',
          kind: 'do',
          after: 8,
          check: 'edu:say:sound-words:gate',
          lines: [N('(Say the gate sounds together: rattle, creak, clack!)'), HZ('Rattle means somebody new. Clack means somebody who knows.', 'happy')],
          parentNote: 'Said sound words (rattle, creak, clack) out loud.',
        },
      ],
      {
        choices: [
          {
            id: 'hate',
            label: 'Are you still angry with him?',
            then: [HZ('I was, for a long time. Angry is heavy to carry.'), HZ('I had Nubbins to look after. So I put it down.', 'think')],
          },
          {
            id: 'found',
            label: 'Did you find the Nubbins he took?',
            then: [HZ('Most of them. I’m still sad about the rest.', 'sad')],
          },
          {
            id: 'sit',
            label: 'Sit next to her. Say nothing.',
            then: [N('You sit. Gran leans on you, just a little.'), HZ('There. That’s better than any words.', 'soft')],
          },
        ],
      },
    ),
    sc(
      's9-yours',
      [
        N('Thump! Gran puts the trowel down on the step.'),
        HZ('He’ll come back at the next sunset.'),
        HZ('I’m not going down there. I’ve done my part. It’s your gate now.', 'happy'),
        Y('What do I say to him?'),
        HZ('Nothing, to start with. Sit and wait. It works on people too.', 'think'),
      ],
      [
        {
          domain: 'science',
          skill: 'the parts of the day in order',
          standard: '1-ESS1-1',
          kind: 'do',
          after: 1,
          check: 'edu:order:times-of-day',
          lines: [
            N('(Say the day in order: morning, afternoon, evening, night.)'),
            HZ('Sunset is in the evening. Then comes night.', 'think'),
          ],
          parentNote: 'Put the parts of the day in order and placed sunset in the evening.',
        },
      ],
    ),
    sc(
      's9-ask',
      [
        N('Sunset. Corvin is already at the gate.'),
        C('I practised this in the lane. A sheep heard me.', 'think'),
        N('He puts both hands on the gate. He doesn’t open it.'),
        C('Long ago, I opened this gate without asking.'),
        C('That was wrong. I am sorry.', 'sad'),
        C('So now I’m asking.', 'soft'),
        C('May I come in, please?', 'soft'),
        C('I’ll stand right here till morning. If it’s still shut, I’ll understand.'),
        N('He steps back into the dark lane. Crunch, crunch. He doesn’t go far.'),
      ],
      [
        {
          domain: 'science',
          skill: 'animal sounds: sheep',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'do',
          after: 1,
          check: 'edu:say:animal-sound:sheep',
          lines: [N('(What does a sheep say? Baa!)'), N('(A baby sheep is a lamb. Say it in a little voice: baa!)')],
          parentNote: 'Made a sheep sound and learned that a baby sheep is a lamb.',
        },
        {
          domain: 'social-studies',
          skill: 'asking before going into someone’s home',
          standard: 'D2.Civ.8.K-2',
          kind: 'notice',
          after: 6,
          lines: [N('Corvin says sorry. Then he asks before he comes in.'), N('We ask first. It’s their home, and their choice.')],
          parentNote: 'Saw a character say sorry and ask permission before entering a home.',
        },
      ],
    ),
    sc(
      's9-word',
      [
        N('By supper, everyone knows. Corvin asked to come in.'),
        EM('He took Ash. I’m just telling you what he did.', 'angry'),
        LU('Sable came from his garden. But she got out.', 'think'),
        FE('I’d let him in. Then I’d worry all night!', 'think'),
        CL('The grey stays on him too. You can only make it lighter.', 'soft'),
        BY('I’d open the gate. Don’t tell anyone.', 'think'),
        N('Gran says nothing. But she leaves her door unlocked. Creak!'),
      ],
      [
        {
          domain: 'sel',
          skill: 'listening to different ideas',
          standard: 'CASEL: Social awareness',
          kind: 'notice',
          after: 5,
          lines: [N('Each friend thinks something different.'), N('It’s good to listen to everyone. Then you choose.')],
          parentNote: 'Heard several different opinions and that it helps to listen to all of them.',
        },
        {
          domain: 'maths',
          skill: 'count to 5',
          standard: 'K.CC.B.5',
          kind: 'do',
          after: 6,
          check: 'edu:count:friends:5',
          lines: [N('(Count the friends who spoke: Ember, Luna, Fern, Clover, Byte.)'), N('(Five friends. Five ideas!)')],
          parentNote: 'Counted five characters who shared an idea.',
        },
      ],
    ),
    sc(
      's9-gate',
      [
        N('Morning. The pond is grey and still.'),
        N('Gran sits by the pond with a cup of tea.'),
        N('Corvin is at the gate. He stood there all night.'),
        N('Frost sparkles on his coat.'),
        C('Hello, Hazel’s grandchild.', 'soft'),
        N('In the long grass, a little grey ear goes flat.'),
        C('I know what I took from her. I’m asking anyway.'),
        N('Gran drinks her tea. Slurp! She is listening.'),
      ],
      [
        {
          domain: 'science',
          skill: 'frost forms on very cold nights',
          standard: 'K-ESS2-1',
          kind: 'notice',
          after: 3,
          lines: [N('Frost is tiny bits of ice.'), N('It forms on very cold nights. When the Sun warms it, it melts.')],
          parentNote: 'Learned that frost is tiny bits of ice that form on very cold nights and melt in the sun.',
        },
      ],
      { choices: [S9_GUEST, S9_SHUT] },
    ),
    sc(
      's9-complete',
      [
        N('Sparks comes first, running. Then Fern. Then everyone!'),
        N('One by one, they lift and push. Creak, creak, creak.'),
        HZ('Good gate, that. I never did unstick it.', 'soft'),
        N('That is how Gran says it’s all done.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'taking turns',
          standard: 'CASEL: Relationship skills',
          kind: 'ask',
          after: 1,
          prompt: [N('Everyone wants to come through the gate. What helps?')],
          options: [
            opt('Take turns, one by one', [N('Yes. One by one. Everyone gets through.')], true),
            opt('Everyone push at once', [N('Bump! Squash! Taking turns, one by one, works better.')]),
          ],
          parentNote: 'Talked about taking turns when everyone wants the same thing.',
        },
      ],
    ),
  ],
  'Corvin is “a lonely man who did a wrong thing long ago” and says sorry in s9-ask. s9-dusk’s scene-level set (s9Started) stays with the original scene. The grey ear that goes flat (Sable or a stray) keeps both sides of the gate honest. ' +
    'Canon: s9-dusk is Corvin’s first arrival (the gate sticks); in s9-ask he says he will stand at the gate till morning, so s9-gate and s9-gate-family find him there with frost on his coat. Gran’s stance is always “I’ve done my part. It’s your gate now.”',
);

const S9_VARIANTS: EduScene[] = [
  sc(
    's9-gate-family',
    [
      N('Morning. Gran sits by the pond. Slurp! That’s her tea.'),
      N('Corvin is at the gate. He stood there all night.'),
      N('Frost sparkles on his coat.'),
      C('Hello, Hazel’s grandchild.', 'soft'),
      N('In the long grass, a little grey ear goes flat.'),
      C('Things have reached me this week. From your side of the valley.', 'think'),
      C('Things people said. Things people found. I kept them all.', 'soft'),
      C('I know what I took. I’m asking anyway.'),
      N('Gran drinks her tea. She is listening.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'first, then: the steps of a trick',
        standard: 'ELOF: Language and Communication',
        kind: 'ask',
        after: 8,
        prompt: [N('Our gate has a trick. What do we do first?')],
        options: [
          opt('Lift', [N('Yes! First lift. Then push.')], true),
          opt('Push', [N('Push first? Creak, squeak! The gate would stay stuck.'), N('Push first, and it sticks! First lift, then push.')]),
        ],
        parentNote: 'Told the two steps of the gate trick in order: first lift, then push.',
      },
    ],
    { choices: [S9_FAMILY, S9_GUEST, S9_SHUT] },
  ),
];

// ================================================================== S10 Fourteen Months
const S10_POSTS_START: Line[] = [
  N('At the stream lantern, Gran laughs. Briar would have.'),
  N('At the old wall, Gran puts her hand on the post. Quiet.'),
];
const S10_POST_ASK: Line[] = [
  HZ('Can I ask you something? I never asked anyone.', 'think'),
  HZ('Should I have gone after Corvin? That night, long ago?', 'soft'),
];
const s10PostChoices = (last: Line): Choice[] => [
  {
    id: 'waited',
    label: 'You were right to wait. He had to come back himself.',
    set: { 's10-post': 'waited' },
    then: [HZ('Maybe. You can’t carry anyone home.', 'think'), HZ('They have to walk back on their own.', 'soft'), last],
  },
  {
    id: 'gone',
    label: 'Somebody should have gone after him.',
    set: { 's10-post': 'gone' },
    then: [HZ('Yes. Some nights I think so too.', 'sad'), HZ('I’ll never know. That’s all right.', 'soft'), last],
  },
];

const S10_FOOT_LINES: Line[] = [
  N('The bottom of the hill path. The grass is long here.'),
  N('Gran looks back at the Grove. The pond, the gate, the posts.'),
  HZ('It looks like somebody lives here now.', 'soft'),
  HZ('I can walk up on my own. But I’d rather not.', 'soft'),
  HZ('Who’s coming?'),
];
const WALK_YOU: Choice = {
  id: 'walk-you',
  label: 'Just me, Gran.',
  set: { walk: 'you' },
  then: [HZ('Good. The quiet way.', 'soft')],
};
const WALK_MOSS: Choice = {
  id: 'walk-moss',
  label: 'Moss. He’s already decided.',
  set: { walk: 'moss' },
  then: [HZ('Of course he has! He decided about me long ago.', 'happy')],
};
const WALK_SABLE: Choice = {
  id: 'walk-sable',
  label: 'Sable.',
  set: { walk: 'sable' },
  then: [HZ('The grey one? Yes. I’d like that very much.', 'soft')],
};
const WALK_CORVIN: Choice = {
  id: 'walk-corvin',
  label: 'Corvin. Let him carry the lantern.',
  set: { walk: 'corvin' },
  then: [HZ('Corvin. Yes. He used to carry it for me.', 'soft')],
};
/** The foot of the hill with exactly the walk choices allowed (same ids as s10Foot in the source). */
const s10Foot = (moss: boolean, sable: boolean, corvin: boolean): EduScene => {
  const tag = (moss ? 'm' : '') + (sable ? 's' : '') + (corvin ? 'c' : '');
  if (!tag) {
    // Nobody else can walk, so there is no choice: a line (the sim sets walk = you from the main scene).
    return sc(
      's10-foot',
      [...S10_FOOT_LINES.slice(0, -1), HZ('Just you, then. Good. The quiet way.', 'soft')],
      [
        {
          domain: 'sel',
          skill: 'knowing what company you like',
          standard: 'CASEL: Self-awareness',
          kind: 'notice',
          after: 3,
          lines: [N('Gran likes quiet company.'), N('You can know what helps you feel calm.')],
          parentNote: 'Heard that people can know what kind of company helps them feel calm.',
        },
      ],
    );
  }
  const choices: Choice[] = [WALK_YOU];
  if (moss) choices.push(WALK_MOSS);
  if (sable) choices.push(WALK_SABLE);
  if (corvin) choices.push(WALK_CORVIN);
  return sc(
    tag ? `s10-foot-${tag}` : 's10-foot',
    S10_FOOT_LINES,
    [
      {
        domain: 'sel',
        skill: 'asking for company when something is hard',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 3,
        lines: [N('Gran could walk alone. But she asks for a friend.'), N('When something is hard, it’s good to ask for help.')],
        parentNote: 'Heard that it is good to ask for company and help when something is hard.',
      },
    ],
    { choices },
  );
};
const S10_FOOT_VARIANTS: EduScene[] = [];
for (const m of [false, true])
  for (const s of [false, true])
    for (const c of [false, true]) if (!(m && s && c)) S10_FOOT_VARIANTS.push(s10Foot(m, s, c));

const S10_LETTER: Line[] = [
  N('Morning. Gran Hazel has died.'),
  N('That means her body stopped working. It won’t start again.'),
  N('Under the signpost stone is a letter from Gran.'),
  HZ('“Don’t make a big fuss. Well, maybe a little fuss.”', 'happy'),
  HZ('“You kept my three rules. Here is one more.”'),
  HZ('“Show up. Every morning. Same sticky gate.”', 'soft'),
  HZ('“I love you. I always will. Love, Gran.”', 'soft'),
];
const S10_RULES: Beat = {
  domain: 'maths',
  skill: 'add 1: three and one more make four',
  standard: 'K.OA.A.1',
  kind: 'ask',
  after: 4,
  prompt: [N('Three rules, and one more. How many rules now?')],
  options: [
    opt('Four', [N('Yes. Three and one more make four.'), N('(Count them on your fingers: one, two, three… four!)')], true),
    opt('Three', [N('Three, and then one more.'), N('Let’s count up: one, two, three… four!')]),
    opt('Five', [N('Let’s count: one, two, three rules. One more makes four.')]),
  ],
  parentNote: 'Added one more to three to make four.',
};

const S10: EduQuest = quest(
  's10',
  'Gran’s Three Wishes',
  {
    's10-step1': {
      goal: 'Wish one: write your Nubbins in Gran’s big book.',
      hint: 'The book is on the cottage shelf. Add every Nubbin you have hatched.',
    },
    's10-step2': {
      goal: 'Wish two: run a race while Gran watches.',
      hint: 'Open Races from the top bar. Any race will do. Winning doesn’t matter.',
    },
    's10-step3': {
      goal: 'Wish three: walk with Gran to the other three lanterns.',
      hint: 'Go at Gran’s pace. Stop when she stops.',
    },
    's10-step4': {
      goal: 'Walk with Gran to the bottom of the hill.',
      hint: 'After the big choice, follow Gran across the Grove to the hill path.',
    },
  },
  [
    sc(
      's10-step',
      [
        N('Evening. Gran sits on the step. Her feet are in warm water.'),
        HZ('Sit. There. I like to see the pond.'),
        N('Gran Hazel is very poorly. The doctors can’t make her better.'),
        HZ('The doctor said one year. I’ve had fourteen months!', 'happy'),
        N('Soon Gran will die. That means her body will stop working.'),
        HZ('Don’t be brave at me. Sad is allowed.', 'think'),
        HZ('I have three little wishes. And one favour.'),
        HZ('This is my news. Can I share it my own way?', 'soft'),
      ],
      [
        {
          domain: 'maths',
          skill: 'a year has 12 months; 14 is more than 12',
          standard: 'K.CC.C.6',
          kind: 'ask',
          after: 3,
          prompt: [N('A year has twelve months. Gran has had fourteen.'), N('Is fourteen more than twelve, or less?')],
          options: [
            opt('More', [HZ('More! Two whole months more. I’m very pleased with myself.', 'happy')], true),
            opt('Less', [N('Less? Boing! The number hops up, not down.'), N('Count on from twelve: thirteen, fourteen. Fourteen is more!')]),
          ],
          parentNote: 'Learned that a year has twelve months and compared fourteen with twelve.',
        },
        {
          domain: 'sel',
          skill: 'all feelings are allowed, and what helps',
          standard: 'CASEL: Self-awareness',
          kind: 'notice',
          after: 5,
          lines: [N('Sad, worried, cross: all feelings are allowed.'), N('A hug or sitting close to someone can help.')],
          parentNote: 'Heard that every feeling is allowed and that closeness and hugs can help.',
        },
      ],
      {
        choices: [
          {
            id: 'secret',
            label: 'All right, Gran. Share it your own way.',
            set: { hazel: 'secret' },
            then: [
              HZ('Thank you, love.', 'soft'),
              HZ('I’ll write them a letter. I’m good at letters.', 'happy'),
              HZ('Wish one: write your Nubbins in my big book.'),
            ],
          },
          {
            id: 'told',
            label: 'They love you. They should say goodbye.',
            set: { hazel: 'told' },
            then: [
              HZ('They’ll make a fuss. Clover will cry on me.', 'think'),
              HZ('All right. Tell them.', 'soft'),
              HZ('Wish one: write your Nubbins in my big book.'),
            ],
          },
        ],
      },
    ),
    sc(
      's10-register',
      [
        N('On the cover, under “Do not lend this to Byte”: NOTED. B.'),
        N('Gran reads your pages slowly. Swish! A page turns.'),
        HZ('Oh, what a funny name. I love it!', 'happy'),
        HZ('Write the weather too. You’ll want that, later.'),
        N('Under your last line, Gran writes one more.'),
        N('“Keeper from this page on.” And then your name.'),
        HZ('Now it’s in the book. Things in the book stay.', 'soft'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'the first letter of your name',
          standard: 'ELOF: Literacy',
          kind: 'do',
          after: 5,
          check: 'edu:write:letter:first-of-name',
          lines: [N('(What letter does your name start with?)'), N('(Draw it in the air with your finger!)')],
          parentNote: 'Named and drew the first letter of their own name.',
        },
      ],
    ),
    sc(
      's10-wish2',
      [
        HZ('Wish two: one race. I’ll sit at the back with a pie.', 'happy'),
        SP('Hazel is coming to a RACE?', 'shock'),
        SP('I’ll save you a seat! Front row!', 'happy'),
        HZ('Sparks, love. I want the back row.'),
        SP('…Back row. Right.'),
        HZ('Bring any Nubbin. Fast or slow. I don’t mind about winning.', 'soft'),
        SP('She does mind. Whoosh! She once threw a hat at the finish line!', 'think'),
        HZ('It was a very small hat.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'front and back',
          standard: 'K.G.A.1',
          kind: 'ask',
          after: 3,
          prompt: [N('Where does Gran want to sit?')],
          options: [
            opt('The back row', [SP('The back row. Behind everyone. Fine!', 'happy')], true),
            opt('The front row', [SP('That’s what I wanted! But Gran said the back row.', 'think')]),
          ],
          parentNote: 'Used the position words front and back.',
        },
      ],
      {
        choices: [
          {
            id: 'fast',
            label: 'Bring the fast one!',
            set: { 's10-racer': 'fast' },
            then: [HZ('Oh, lovely! I’ll cheer till I’ve no voice left.', 'happy')],
          },
          {
            id: 'slow',
            label: 'Bring the slow one. The one who stops to look.',
            set: { 's10-racer': 'slow' },
            then: [HZ('The slow one? Good! I’ll get a second pie.', 'happy')],
          },
        ],
      },
    ),
    sc(
      's10-cheer',
      [
        N('The crowd roars! From the back row, one voice is loudest.'),
        N('Sparks has lost her voice. She cheers with no sound!'),
        N('In the back row sits a duck. A very sure duck.'),
        HZ('Leave the duck. It paid for its seat!', 'happy'),
        N('Your Nubbin crosses the line. Gran cheers, munch, munch, with a full mouth!'),
        N('Win or lose, Gran stands up, beaming. Half a pie in her hand.'),
        HZ('That one runs for you. That’s love. Never spend that.', 'soft'),
        N('Then Gran sits down, all of a sudden. She is tired.'),
        N('Nobody hurries her.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'waiting kindly with someone who is tired',
          standard: 'CASEL: Social awareness',
          kind: 'notice',
          after: 8,
          lines: [N('When someone is tired, we can wait with them.'), N('Waiting kindly is a way to show love.')],
          parentNote: 'Learned that waiting patiently with someone who is tired is a kind thing to do.',
        },
      ],
    ),
    sc(
      's10-wish3',
      [
        N('Evening. Gran’s third wish has a little drawing: four posts.'),
        HZ('Wish three. Walk the four lanterns with me. Slowly.', 'happy'),
        N('Gran holds your arm at the pond lantern.'),
        HZ('This is Moss’s post. When I was young, I came here.', 'soft'),
        N('A memory. Snow. A young Hazel sits by the frozen pond.'),
        YH('I don’t know what I’m doing.', 'sad'),
        N('A small green-grey Nubbin sits near her. Day after day. All winter.'),
        N('When the snow melts, it looks up at her.'),
        M('…You’ll do.', 'soft'),
        HZ('Rule three. Moss taught it to me. Just by sitting.', 'soft'),
      ],
      [
        {
          domain: 'maths',
          skill: 'counting on: 1 and 3 more make 4',
          standard: 'K.OA.A.1',
          kind: 'ask',
          after: 2,
          prompt: [HZ('Four posts. We’re at the first one. How many more to go?', 'think')],
          options: [
            opt('Three', [HZ('Yes. One here, three more. Four in all.', 'happy')], true),
            opt('Two', [HZ('Let’s count on: this is one. Two, three, four. Three more!', 'think')]),
            opt('Four', [HZ('Four in all. But we’re at one already. So three more!', 'think')]),
          ],
          parentNote: 'Counted on from one to four to find how many more.',
        },
        {
          domain: 'science',
          skill: 'snow and ice melt when it gets warmer',
          standard: '2-ESS2-3',
          kind: 'notice',
          after: 7,
          lines: [N('In spring, the sunshine gets warmer.'), N('Snow and ice melt into water. Drip, drip!')],
          parentNote: 'Learned that snow and ice melt into water when the weather warms in spring.',
        },
      ],
    ),
    sc(
      's10-lanterns',
      [
        ...S10_POSTS_START,
        N('Then the long grass. The last post glows bright and steady.'),
        HZ('For years it only flickered. I looked every night.', 'soft'),
        HZ('I stopped hoping. But I never stopped looking.', 'soft'),
        ...S10_POST_ASK,
      ],
      [
        {
          domain: 'science',
          skill: 'we need light to see',
          standard: '1-PS4-2',
          kind: 'notice',
          after: 2,
          lines: [N('Lanterns make light in the dark.'), N('We need light to see. No light, no seeing!')],
          parentNote: 'Learned that we need light to see things.',
        },
      ],
      { choices: s10PostChoices(HZ('That was the one I wanted. Thank you, love.', 'soft')) },
    ),
    sc(
      's10-night',
      [
        N('You walk Gran home. She stops at the door.'),
        HZ('Tomorrow, everyone comes. You’ll tell them about the Grove.'),
        HZ('Then I’ll go up the hill. No fuss.', 'soft'),
        N('Going up the hill is Gran’s way of saying she will die.'),
        HZ('Being ordinary has been lovely.', 'happy'),
        HZ('Now go home. Or the hens will sleep on you!', 'happy'),
        N('Inside, Gran sits on her bed for a long time.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'telling a grown-up when we feel sad',
          standard: 'CASEL: Self-awareness',
          kind: 'notice',
          after: 6,
          lines: [N('If you feel sad, you can tell a grown-up.'), N('A hug and a cuddle can help.')],
          parentNote: 'Heard that when they feel sad they can tell a grown-up and get a hug.',
        },
      ],
    ),
    s10Foot(true, true, true),
    sc(
      's10-letter',
      [...S10_LETTER, N('Behind you, the gate creaks. Fern. Sparks. Everyone.'), N('They hug you. Nobody needs to say anything.'), N('Byte’s shoelaces are untied. Pixel ties them. Nobody says anything.')],
      [
        S10_RULES,
        {
          domain: 'sel',
          skill: 'feeling sad when someone dies, and remembering together',
          standard: 'CASEL: Self-awareness',
          kind: 'notice',
          after: 8,
          lines: [N('When someone dies, we feel sad. Crying is all right.'), N('We remember them together. That helps.')],
          parentNote: 'Heard that sadness and crying are natural when someone dies, and that remembering together helps.',
        },
      ],
    ),
  ],
  'Hazel is “very poorly” and no illness is named. Her death is said plainly by the narrator (s10-step, s10-night, s10-letter), never as sleep; Hazel herself stays funny. The secret/told choice is framed as Gran choosing how to share her own news. The foot-of-the-hill scene is built by s10Foot as in the source; s10-foot-msc is here and the other seven are in the variants. LINE VARIANT (letThemGo): with “Open” there is no gate, so in s10-letter “Behind you, the gate creaks.” becomes “Behind you, footsteps.”, and in s10-letter-told “already at the gate” becomes “already at the gateposts”.',
);

const S10_VARIANTS: EduScene[] = [
  sc(
    's10-wish3-s1',
    [
      N('Evening. Gran’s third wish has a little drawing: four posts.'),
      HZ('Wish three. Walk the four lanterns with me. Slowly.', 'happy'),
      N('Gran holds your arm at the pond lantern.'),
      HZ('This is Moss’s post. He will have told you about the winter.', 'soft'),
      HZ('I counted the hens. I never asked him to speak. It was hard!', 'happy'),
      HZ('When the snow melted, Moss said, “You’ll do.” I sat right down!', 'happy'),
      HZ('Moss says I fell in the pond. Splash! I did not! I was paddling.', 'think'),
      HZ('Rule three. Moss taught it to me. Just by sitting.', 'soft'),
    ],
    [
      {
        domain: 'sel',
        skill: 'waiting is hard, and we can do it',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 4,
        lines: [
          N('Gran says waiting was hard. It is hard!'),
          N('Saying so is the first step to getting better at it.'),
        ],
        parentNote:
          'Heard that waiting is hard, and that saying so is a first step to getting better at it.',
      },
    ],
  ),
  sc(
    's10-lanterns-kept',
    [
      ...S10_POSTS_START,
      N('Then the long grass. The last post flickers. On, off, on.'),
      HZ('Still flickering. Well.', 'soft'),
      HZ('I stopped hoping. But I never stopped looking.', 'soft'),
      ...S10_POST_ASK,
    ],
    [
      {
        domain: 'literacy',
        skill: 'word meaning: flicker',
        standard: 'ELOF: Language and Communication',
        kind: 'do',
        after: 2,
        check: 'edu:act:word:flicker',
        lines: [N('Flicker means the light goes on, off, on, off.'), N('(Flicker your fingers like the lantern!)')],
        parentNote: 'Learned the word flicker and acted it out with their fingers.',
      },
    ],
    { choices: s10PostChoices(HZ('Thank you for walking with me. I mean that.', 'soft')) },
  ),
  sc(
    's10-night-told',
    [
      N('You walk Gran home. Friends have stayed late by the pond.'),
      N('Nobody wants to go first. Gran sends them home, one by one.'),
      HZ('Look at them. Lumps, every one!', 'happy'),
      HZ('Tomorrow I’ll go up the hill. They can walk me to the bottom.', 'soft'),
      N('Going up the hill means Gran will die. Everyone knows now.'),
      N('Down the lane, someone cries quietly. Someone passes a hanky.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'comforting a friend who is crying',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 5,
        prompt: [N('A friend is crying. What could you do?')],
        options: [
          opt('Pass a hanky, or sit close', [N('Yes. A hanky, a hug, or sitting close. That helps.')], true),
          opt('Tell them to stop', [N('Crying is all right. Sitting close, or a hanky, helps more.')]),
        ],
        parentNote: 'Thought about kind ways to comfort a friend who is crying.',
      },
    ],
  ),
  ...S10_FOOT_VARIANTS,
  sc(
    's10-letter-told',
    [
      ...S10_LETTER,
      N('Your friends are already at the gate. Waiting for you.'),
      N('You read the letter to them. Clover cries.'),
      N('Byte checks his shoelaces. Untied!'),
    ],
    [
      S10_RULES,
      {
        domain: 'sel',
        skill: 'being together helps when we are sad',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 9,
        lines: [N('Everyone is sad together. Crying is all right.'), N('Being together helps. So does a little smile.')],
        parentNote: 'Heard that sharing sad feelings with friends helps.',
      },
    ],
  ),
];

// ================================================================== exports
export const EDU_SIDE_1_SPROUT: EduQuest[] = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];

/** Sprout versions of every scene in SIDE_STORIES_MAIN_VARIANTS and SIDE_STORIES_FUN_2_VARIANTS. */
export const EDU_SIDE_1_SPROUT_VARIANTS: EduScene[] = [...S2_VARIANTS, ...S8_VARIANTS, ...S9_VARIANTS, ...S10_VARIANTS];

export const CHECKS: string[] = [
  // S1
  'edu:count:lantern-posts:4',
  'edu:blow:wind:sail',
  'edu:listen:sounds:quiet',
  'edu:sit:beside:moss',
  // S2
  'edu:voice:loud-quiet',
  'edu:say:first-sound:w',
  'edu:count:missing-things:5',
  'edu:draw:shape:circle',
  'edu:place:hands:side-by-side',
  // S3
  'edu:clap:beat:steady',
  'edu:find:colour:green',
  'edu:count:keepers:10',
  // S4
  'edu:sort:float-sink:leaf-stone-apple',
  'edu:point:senses:ears-skin-nose',
  'edu:copy:pattern:snore',
  // S5
  'edu:make:shape:straight-crooked',
  // S6
  'edu:show:fingers:7',
  'edu:sing:notes:low-high-up',
  'edu:say:sound:ash',
  'edu:count:tries:5',
  // S7
  'edu:show:fingers:4',
  'edu:check:shoes:fastened',
  'edu:count:days:7',
  'edu:find:colour:blue',
  // S8
  'edu:count:leaf-points:5',
  'edu:wiggle:feet:left-right',
  'edu:clap:times:2',
  // S9
  'edu:rub:hands:warm',
  'edu:say:sound-words:gate',
  'edu:order:times-of-day',
  'edu:say:animal-sound:sheep',
  'edu:count:friends:5',
  // S10
  'edu:write:letter:first-of-name',
  'edu:act:word:flicker',
];
