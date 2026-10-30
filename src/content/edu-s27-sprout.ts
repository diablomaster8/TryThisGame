/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): S27 “Some Nubbin”.
 *
 * Source: side-stories-s27.ts. One EduScene per original scene (14 step scenes, 14 done scenes, the complete
 * scene and the 9 variants), id `sprout:<original id>`. See EDU-STYLE.md. British spelling.
 *
 * - Teaches: spiders have eight legs and spin silk; frost is ice that forms on cold things, which is why a web
 *   turns white; ice melts when it warms; egg sacs, spiderlings floating away on threads; autumn and spring; first
 *   sounds, syllables and counting letters in the web words; counting to 10; first and last; naming feelings,
 *   waiting with someone, being kind, what helps when we are sad.
 * - Choices: s27-was-it-you leaves out “Yes. It was me.” (`shield`, a fib, even a kind one) with
 *   `defaultChoice: 'frost'`. The `s27-midnight-shield` variant is still written, gently, in case a save carries it.
 *   Every other choice keeps its id and `set`.
 * - Hard things: the threat is being sold far away, said plainly once; Corvin is a lonely, grumpy man who does a
 *   right thing. Spindle dies of old age, offscreen: “Spindle has died. Her body stopped working, and it won’t start
 *   again.” Comfort straight after (the Nubbin sitting close, Sparks’s hug, remembering). No body is shown.
 * - Canon: Spindle never speaks, she writes; Nubbins and runners never speak; Wisp’s whisper is a Shadow’s
 *   half-voice (canon 17); Clank is a robot and may speak. No quotes from the original book.
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
const C = say('corvin');
const SP = say('sparks');
const FE = say('fern');
const CL = say('clover');
const LU = say('luna');
const BY = say('byte');
const TA = say('s27-tam');
const TU = say('s27-tull');
const W = say('wisp');
const CK = say('clank');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

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

// ---------------------------------------------------------------- shared pieces
/** The four words, gathered (s27-words and s27-words-sold). Line 4 is Byte’s long word. */
const WORD_HUNT: Line[] = [
  FE('My word is SOMEBODY’S. Every Nubbin is somebody’s.', 'soft'),
  CL('Mine is WARM. Everybody needs to feel warm.', 'soft'),
  LU('Mine is HOME. Everything grows towards home.', 'soft'),
  BY('Mine is “statistically above average”!', 'happy'),
  N('Spindle tries Byte’s word. It goes across the window. Then across the wall.'),
  N('It goes out of the door. Your Nubbin trips on it. Bonk!'),
  SP('Too long for a fence, Byte. Sorry!', 'happy'),
  BY('It’s a very accurate word.'),
  BY('My wife Pixel says that’s too many words. She says my lace is undone.'),
  N('Byte looks down. It is!'),
];

/** The morning after the Show (s27-letgo and s27-home). Line 1 is HOME on the rail. */
const MORNING: Line[] = [
  N('Thump, thump! In the morning, everyone comes up to the fence.'),
  N('The whole long fence says HOME. Big white letters!'),
  FE('HOME! She must have run out of fence!', 'happy'),
  TU('I came for the runners that didn’t win. But not that one.', 'think'),
  TU('Everybody knows its name. I can’t sell it. Good day!'),
  N('Mr Tull drives away over the hill. His cart is empty.'),
];

/** Your sold Nubbin walks out (both s27-home choices). */
const HOME_TAIL: Line[] = [
  N('Hob opens the pen. Your Nubbin steps out.'),
  N('It walks to you, slowly, all the way.'),
  N('It leans on your leg, just like when it was little.'),
  N('It’s coming home.'),
];

// ================================================================== S27 Some Nubbin
const S27_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: the wire
  sc(
    's27-wire',
    [
      N('It is summer at the Circuit. The sand is hot.'),
      N('But the white fences are covered in frost. Brrr!'),
      N('Nobody says a word about it.'),
      N('Pop! The big lamp is broken. Sparks lies under it.'),
      SP('I need some wire. A little roll of it.', 'think'),
      SP('It’s in the old lantern shed. Bottom drawer. Can you fetch it?'),
      N('Your Nubbin hops into your pocket. Off you go!'),
    ],
    [
      {
        domain: 'science',
        skill: 'frost is ice, and ice is cold',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'ask',
        after: 1,
        prompt: [N('Frost is made of tiny bits of ice. Is ice hot or cold?')],
        options: [
          opt('Cold!', [N('Yes! Ice is very cold. So frost is cold too. Brrr!')], true),
          opt('Hot!', [N('Hot sand, yes! But ice is cold. So frost is cold too.')]),
        ],
        parentNote: 'Learned that frost is made of ice, and that ice is cold.',
      },
    ],
  ),
  // ------------------------------------------------ step 1 done: EVENING
  sc(
    's27-evening',
    [
      N('The shed is dusty and quiet. Creak! It smells of old lamps.'),
      N('Every drawer has a word on it. FUSES. WICKS. SPARE.'),
      N('You find the wire. Then you see a web in the window.'),
      N('In the middle of the web is a word!'),
      N('EVENING.'),
      N('A little grey-brown spider sits beside it.'),
      N('She waves two legs at you. Hello!'),
      N('You wave back. Hello, spider!'),
    ],
    [
      {
        domain: 'science',
        skill: 'count a spider’s legs: spiders have eight',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'do',
        after: 5,
        check: 'edu:count:legs:8',
        lines: [
          N('(Count the spider’s legs together on your fingers.)'),
          N('One, two, three, four, five, six, seven, eight. Eight legs!'),
          N('Every spider has eight legs. A bee only has six.'),
        ],
        parentNote: 'Counted to eight, and learned that spiders have eight legs.',
      },
    ],
  ),
  // ------------------------------------------------ step 2: the row
  sc(
    's27-row',
    [
      N('Squeak! Look out of the shed window. You can see the pens.'),
      N('Each pen has a runner in it. They are all grey.'),
      N('They stand very still. Nobody plays.'),
      N('At the end of the row is the smallest one.'),
      N('It is looking down the valley. It looks lonely.'),
      N('It has a number painted on its side. 9.'),
      N('A boy comes along with two buckets. He is whistling.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'recognise and draw the number 9',
        standard: 'ELOF: Mathematics Development',
        kind: 'do',
        after: 5,
        check: 'edu:trace:number:9',
        lines: [
          N('(Draw a 9 in the air. A circle, then a line down.)'),
          N('Nine. That’s a number. It isn’t a name.'),
        ],
        parentNote: 'Recognised and traced the number 9.',
      },
    ],
  ),
  // ------------------------------------------------ step 2 done: Hob
  sc(
    's27-tam',
    [
      TA('That’s Nine. It’s the smallest. It always comes last.', 'think'),
      TA('I’m Hob. I feed them. I’m not meant to whistle.'),
      N('Hob fills Nine’s bowl. Nine doesn’t look round.'),
      TA('Soon there’s a big race. The Autumn Show.', 'sad'),
      TA('A runner who doesn’t win a ribbon gets sold.'),
      TA('A man takes it far away. It won’t come back here.'),
      N('Hob stops whistling. In the window, the spider goes very still.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'naming a feeling from what someone does',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'ask',
        after: 6,
        prompt: [N('Hob has stopped whistling. How do you think he feels?')],
        options: [
          opt(
            'Sad, or worried',
            [N('Yes. Hob is worried about Nine. When we’re sad, we often stop whistling.')],
            true,
          ),
          opt('Happy', [N('He was whistling before. Now he’s stopped. I think he’s sad.')]),
        ],
        parentNote: 'Worked out how Hob feels from what he does.',
      },
    ],
  ),
  // ------------------------------------------------ step 3: WAIT
  sc(
    's27-wait',
    [
      N('Creak! You go back to the shed. The word has changed!'),
      N('Now the web says WAIT.'),
      N('(Say it together: wait.)'),
      N('The spider sits very still. She is thinking.'),
      N('There is an old box by the window.'),
      N('It is just the right size for sitting on.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'waiting quietly with someone who is thinking',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 5,
        prompt: [N('The spider is thinking hard. What could you do?')],
        options: [
          opt(
            'Sit down next to her and wait',
            [N('Yes. Sitting next to someone, quietly, is a kind way to help.')],
            true,
          ),
          opt('Poke the web', [
            N('Oh! That might break her web. Let’s sit next to her and wait instead.'),
          ]),
          opt('Shout hello', [
            N('She might jump! Let’s be quiet and sit next to her. That helps.'),
          ]),
        ],
        parentNote: 'Thought about waiting quietly beside someone who is thinking.',
      },
    ],
  ),
  // ------------------------------------------------ step 3 done: Spindle gets her name
  sc(
    's27-spindle',
    [
      N('You sit. The spider thinks. You wait together.'),
      N('Your Nubbin falls asleep in your pocket. Zzz.'),
      N('Bonk! The door opens. It’s Sparks.'),
      SP('There you are! Oh… a spider. And a word!', 'shock'),
      N('Sparks sits down on the floor with you.'),
      SP('She can write! She needs a name. Spindle!', 'happy'),
      N('The spider waves two legs. Once at Sparks, once at you.'),
      SP('That’s a yes!', 'happy'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'clap the syllables in a name',
        standard: 'RF.K.2',
        kind: 'do',
        after: 5,
        check: 'edu:clap:syllables:spindle',
        lines: [
          N('(Clap her new name: Spin-dle. Two claps!)'),
          SP('Spin-dle. Two claps. Perfect.', 'happy'),
        ],
        parentNote: 'Clapped the two syllables in the name Spindle.',
      },
    ],
  ),
  // ------------------------------------------------ step 4: labels
  sc(
    's27-labels',
    [
      N('Spindle practises her words. She copies the drawers.'),
      N('FUSES. WICKS. SPARE. Very neat!'),
      N('On day four, she writes MISC. Ding! She looks very proud.'),
      SP('That is my messiest drawer! She found it!', 'shock'),
      SP('But those are drawer words. They don’t say how anyone feels.', 'think'),
      N('Spindle looks out at Nine. Then she lifts one leg.'),
      SP('She wants new words. Kind ones.'),
      SP('Can you ask our friends? One word each.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'count to 4 on fingers',
        standard: 'K.CC.B.5',
        kind: 'do',
        after: 7,
        check: 'edu:count:fingers:4',
        lines: [
          N('(Hold up a finger for each friend: Fern, Clover, Luna, Byte.)'),
          SP('Four friends. Four words!', 'happy'),
        ],
        parentNote: 'Counted four friends on their fingers.',
      },
    ],
  ),
  // ------------------------------------------------ step 4 done: the words, and a name for Nine
  sc(
    's27-words',
    [
      ...WORD_HUNT,
      N('Then Spindle points at Nine.'),
      SP('Nine is a number. Let’s give it a real name.', 'soft'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'compare a short word and a long word',
        standard: 'ELOF: Literacy',
        kind: 'ask',
        after: 9,
        prompt: [N('Which word is longer? WARM, or “statistically above average”?')],
        options: [
          opt(
            'Statistically above average',
            [N('Yes! It’s much, much longer. WARM is short. It fits!')],
            true,
          ),
          opt('WARM', [N('WARM is short: just four letters. Byte’s word goes on and on and on!')]),
        ],
        parentNote: 'Compared a short word and a long one.',
      },
    ],
    {
      choices: [
        {
          id: 'tansy',
          label: '“Tansy.” A little yellow flower.',
          set: { 's27-nine-name': 'Tansy' },
          then: [
            SP('Tansy! Like the flower that grows in cracks. I love it.', 'happy'),
            N('Spindle writes it small, to practise. T, A, N, S, Y.'),
          ],
        },
        {
          id: 'button',
          label: '“Button.” Small, and it holds things together.',
          set: { 's27-nine-name': 'Button' },
          then: [
            SP('Button! That’s soft. I like soft.', 'happy'),
            N('Spindle writes it small, to practise. B, U, T, T, O, N.'),
          ],
        },
        {
          id: 'own',
          label: 'Give it a name of your own.',
          set: { 's27-nine-name': '' },
          then: [
            N('You think of a good name. You say it out loud.'),
            SP('Yes. That’s its name. It fits!', 'soft'),
            N('Spindle writes it small, to practise.'),
          ],
        },
      ],
    },
  ),
  // ------------------------------------------------ step 5: the first night
  sc(
    's27-first-night',
    [
      N('It is evening. Spindle waits by her web.'),
      N('You hold out a matchbox. She walks right in. Plop!'),
      N('You carry her gently to Nine’s pen.'),
      N('The fence is very cold. Spindle steps out onto it.'),
      N('Nine watches her. Nine is curious!'),
      N('Spindle is going to write Nine’s name. She will do it in the night.'),
      N('You go home to bed. No peeking!'),
    ],
    [
      {
        domain: 'health',
        skill: 'carrying something small gently with two hands',
        standard: 'ELOF: Perceptual, Motor, and Physical Development',
        kind: 'do',
        after: 2,
        check: 'edu:carry:gently:cupped-hands',
        lines: [N('(Make a little box with your two hands. Carry it gently, gently.)')],
        parentNote: 'Practised carrying something small, slowly and gently.',
      },
    ],
  ),
  // ------------------------------------------------ step 5 done: the first word
  sc(
    's27-first-word',
    [
      N('Early in the morning, you come back. It is cold!'),
      N('Your breath makes little clouds. Puff, puff. Pop!'),
      N('Every fence is white with frost.'),
      N('And on Nine’s fence, the web is white too.'),
      N('It spells a name. Its very own name!'),
      FE('It’s got a NAME! Everybody, look! A NAME!', 'happy'),
      N('Nine turns round. Nine looks up at the name.'),
      N('The other runners have numbers. This one has a name.'),
    ],
    [
      {
        domain: 'science',
        skill: 'frost forms on cold things at night',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'notice',
        after: 3,
        lines: [
          N('Frost is tiny bits of ice. It grows on cold things in the night.'),
          N('It sticks to fences, and grass, and even a spider’s web.'),
          N('That’s why the web shines white!'),
        ],
        parentNote:
          'Learned that frost is ice that forms on cold things overnight, which is why the web shows up.',
      },
    ],
  ),
  // ------------------------------------------------ step 6: frost does odd things
  sc(
    's27-odd-things',
    [
      N('Corvin comes out with his big book.'),
      N('Corvin is a lonely, grumpy man. The runners are his.'),
      N('He looks at the name on the fence for a long time.'),
      C('Frost does odd things.', 'think'),
      N('Frost can’t write names. Corvin knows that. He says it anyway.'),
      N('Then two children come to the fence. And a man with a bike.'),
      N('More people come. They all want to see the runner with a name.'),
      N('Corvin looks across the yard. At you.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'add 2 and 1',
        standard: 'K.OA.A.2',
        kind: 'ask',
        after: 5,
        prompt: [N('Two children, and one man with a bike. How many people?')],
        options: [
          opt('Three', [N('Yes! Two and one more make three.')], true),
          opt('Two', [
            N('Two children… and one more, the man with the bike. One, two, three. Three!'),
          ]),
          opt('Four', [
            N('Let’s count: one child, two children, and the man. One, two, three. Three!'),
          ]),
        ],
        parentNote: 'Added one more to two to make three.',
      },
    ],
  ),
  // ------------------------------------------------ step 6 done: was it you? (sprout leaves out the fib)
  sc(
    's27-was-it-you',
    [
      N('Thump, thump! Corvin walks over. His hands look very cold.'),
      C('Somebody wrote on my fence in the night.'),
      C('I don’t like writing on my fences. Was it you?'),
      N('In the window, Spindle keeps very, very still.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'noticing when a friend is scared, and staying with them',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'ask',
        after: 3,
        prompt: [N('Spindle is keeping very still. How do you think she feels?')],
        options: [
          opt(
            'Scared',
            [N('Yes, a little scared. But you’re right here. A friend nearby helps.')],
            true,
          ),
          opt('Sleepy', [N('Maybe! But I think she’s a bit scared. You’re here. That helps.')]),
        ],
        parentNote: 'Noticed that a friend was scared, and that staying near helps.',
      },
    ],
    {
      choices: [
        {
          id: 'frost',
          label: 'Point at the frost.',
          set: { 's27-truth': 'frost' },
          then: [
            Y('Ask the frost! It’s your frost.'),
            C('Frost can’t spell.', 'think'),
            Y('This frost can.'),
            N('Corvin looks at the shed for a long time. He doesn’t say anything.'),
          ],
        },
        {
          id: 'silent',
          label: 'Say nothing. Just wait.',
          set: { 's27-truth': 'silent' },
          then: [
            N('You don’t say anything. You just wait.'),
            N('Corvin waits too. Then he looks at the shed window.'),
            C('Hm.', 'think'),
            N('He goes back inside.'),
          ],
        },
      ],
      defaultChoice: 'frost',
    },
  ),
  // ------------------------------------------------ step 7: the second night
  sc(
    's27-second-night',
    [
      N('Spindle works on her next word all day.'),
      N('She points out at the big fence by the race track.'),
      SP('The big fence? Where everyone can see? Brave spider!', 'shock'),
      N('At night, Spindle walks into her matchbox.'),
      N('Plop! You put her in your pocket, where it’s warm.'),
      N('You walk to the big fence. Quiet as a mouse.'),
    ],
    [
      {
        domain: 'health',
        skill: 'moving quietly and slowly: tiptoeing',
        standard: 'ELOF: Perceptual, Motor, and Physical Development',
        kind: 'do',
        after: 5,
        check: 'edu:tiptoe:quiet:to-the-fence',
        lines: [N('(Tiptoe across the room, quiet as a mouse. Shh!)')],
        parentNote: 'Practised moving slowly and quietly on tiptoe.',
      },
    ],
  ),
  // ------------------------------------------------ step 7 done: SOMEBODY’S
  sc(
    's27-somebodys',
    [
      N('Morning! The big fence says SOMEBODY’S.'),
      N('That was Fern’s word. Fern covers her mouth. Oh!'),
      N('Creak, creak! A man comes over the hill with a cart. It’s Mr Tull.'),
      N('Mr Tull buys runners. He reads the word.'),
      TU('A runner with a name? That’s new.', 'think'),
      C('It’s just the frost.'),
      N('Mr Tull frowns, and drives away again.'),
      N('Then Corvin moves Nine to a pen behind his house.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'two small words make one big word: some + body',
        standard: 'RF.K.2',
        kind: 'do',
        after: 1,
        check: 'edu:clap:syllables:somebody',
        lines: [
          N('SOMEBODY is two little words stuck together: SOME and BODY.'),
          N('(Clap it: some-bo-dy. Three claps!)'),
          N('SOMEBODY’S means: this one belongs to someone.'),
        ],
        parentNote: 'Found two small words inside a big one, and clapped its syllables.',
      },
    ],
  ),
  // ------------------------------------------------ step 8: the toolbox
  sc(
    's27-toolbox',
    [
      SP('Behind the house? That’s the coldest pen! He’s hiding Nine.', 'angry'),
      SP('I know! My toolbox. Nobody looks twice at a toolbox.'),
      N('Sparks puts a soft clean cloth in the top tray.'),
      N('Spindle walks in. She sits beside a tiny spanner.'),
      N('Bonk, bonk! You carry the toolbox past the house.'),
      N('Nobody stops you. Sparks was right!'),
    ],
    [
      {
        domain: 'maths',
        skill: 'position words: beside and behind',
        standard: 'K.G.A.1',
        kind: 'do',
        after: 3,
        check: 'edu:place:toy:beside-behind',
        lines: [
          N('(Put a toy beside you. Now put it behind you!)'),
          SP('Beside, then behind. Just like Spindle and Nine.', 'happy'),
        ],
        parentNote: 'Used the position words beside and behind.',
      },
    ],
  ),
  // ------------------------------------------------ step 8 done: WARM
  sc(
    's27-warm',
    [
      N('Behind the house it is very, very cold.'),
      N('In the morning, the fence says WARM.'),
      N('Creak! Corvin comes out. He looks at the word.'),
      N('He puts his hand flat on it.'),
      N('The frost doesn’t melt. Not one bit.'),
      N('Corvin touches his pocket. Then he goes inside, very quietly.'),
    ],
    [
      {
        domain: 'science',
        skill: 'ice melts when it gets warm',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'ask',
        after: 3,
        prompt: [N('A hand is warm. What happens to ice when it gets warm?')],
        options: [
          opt(
            'It melts into water',
            [
              N('Yes! Warm ice melts into water. Drip, drip.'),
              N('But watch. This frost is different…'),
            ],
            true,
          ),
          opt('It gets bigger', [
            N('Ice doesn’t grow when it’s warm. It melts into water. Drip, drip.'),
            N('But watch. This frost is different…'),
          ]),
        ],
        parentNote: 'Learned that ice melts into water when it warms up.',
      },
    ],
  ),
  // ------------------------------------------------ step 9: getting ready
  sc(
    's27-ready',
    [
      N('Autumn is here. The leaves turn orange, and fall.'),
      N('Swish, swish! Clover helps you brush Nine. Gently, gently.'),
      CL('Long, soft strokes. When Nine leans in, it likes it.', 'soft'),
      N('Nine leans in. Clover smiles.'),
      BY('Pixel says stop timing. I timed Pixel saying it.', 'think'),
      BY('I worked out if Nine will win. I won’t say.', 'sad'),
      N('Spindle wants to come to the Show. She climbs up your sleeve!'),
      N('She rides on the brim of your hat. The best seat!'),
    ],
    [
      {
        domain: 'science',
        skill: 'what happens to leaves in autumn',
        standard: 'K-ESS2-1',
        kind: 'ask',
        after: 0,
        prompt: [N('It’s autumn. What do the leaves do?')],
        options: [
          opt(
            'Change colour and fall',
            [N('Yes! Orange, red and brown. Then they float down. Whoosh.')],
            true,
          ),
          opt('Turn blue', [N('Blue leaves would be funny! Autumn leaves go orange, then fall.')]),
        ],
        parentNote: 'Talked about how leaves change colour and fall in autumn.',
      },
    ],
  ),
  // ------------------------------------------------ step 9 done: the Autumn Show
  sc(
    's27-show',
    [
      N('It’s the Autumn Show! Flags! A little band! Ding, dong, oom-pah!'),
      N('So many people came. They came to see Nine.'),
      N('The judge has a table of ribbons. Your Nubbin thinks they are sweets.'),
      N('It licks one. Not a sweet! It looks very let down.'),
      N('The runners race. Number One wins, like always.'),
      N('Nine comes last. Nine was busy looking at all the people.'),
      N('Three runners get ribbons. Nine doesn’t get one.'),
      N('Mr Tull is waiting by the gate with his cart.'),
      N('Spindle taps your hat. Tap, tap. That means: tonight.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'first and last',
        standard: 'ELOF: Mathematics Development',
        kind: 'ask',
        after: 5,
        prompt: [N('Number One came first. Where did Nine come?')],
        options: [
          opt(
            'Last',
            [N('Yes, last. But lots of people came just for Nine. That matters too.')],
            true,
          ),
          opt('First', [
            N('Number One came first. Nine came last. But everybody came to see Nine!'),
          ]),
        ],
        parentNote: 'Used the words first and last.',
      },
    ],
  ),
  // ------------------------------------------------ step 10: HOME, written all night
  sc(
    's27-home-word',
    [
      N('That night, Spindle walks onto your hand.'),
      N('You carry her to the long fence by the track.'),
      N('She starts her biggest word ever. It will take all night!'),
      N('You hold the lantern low, so you can both see.'),
      N('Step by step, you walk beside her.'),
      N('Your Nubbin sleeps in your pocket. The lantern hisses. Hsss.'),
    ],
    [
      {
        domain: 'science',
        skill: 'we need light to see in the dark',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'ask',
        after: 3,
        prompt: [N('Why do you hold the lantern?')],
        options: [
          opt(
            'So we can see in the dark',
            [N('Yes. In the dark we can’t see. Light helps us see.')],
            true,
          ),
          opt('To keep warm', [N('It is a bit warm! But mostly, light helps us see.')]),
        ],
        parentNote: 'Talked about needing light to see in the dark.',
      },
    ],
  ),
  // ------------------------------------------------ step 10 done: midnight
  sc(
    's27-midnight',
    [
      N('In the middle of the night, a door opens. Creak.'),
      N('You hide in the shed doorway. Shh.'),
      N('It’s Corvin, with a lamp. He finds Spindle on the fence.'),
      N('He lifts his cold hand over her web.'),
      N('Spindle keeps on working, thread by thread.'),
      N('Corvin puts his hand down.'),
      C('Spell it right, then.', 'soft'),
      N('He goes back inside. That was a kind thing to do.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'people can choose to do the right thing',
        standard: 'CASEL: Social awareness',
        kind: 'notice',
        after: 7,
        lines: [
          N('Corvin did not like the writing on his fences.'),
          N('But tonight he chose a kind thing. He let Spindle finish.'),
          N('People can change. Even grumpy people.'),
        ],
        parentNote: 'Talked about how people can choose to do the right thing.',
      },
    ],
  ),
  // ------------------------------------------------ step 11: let go (runner path)
  sc(
    's27-letgo',
    [
      ...MORNING,
      N('Hob says Nine’s new name, very carefully. Not “Nine” any more.'),
      C('Take it home. It’s no use to me now.'),
      N('Nine looks at the open pen. Then Nine follows you.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'count the letters in a word',
        standard: 'ELOF: Literacy',
        kind: 'do',
        after: 1,
        check: 'edu:count:letters:home-4',
        lines: [
          N('(Count the letters together: H, O, M, E.)'),
          FE('Four letters! Four great big letters!', 'happy'),
        ],
        parentNote: 'Counted the four letters in HOME.',
      },
    ],
  ),
  // ------------------------------------------------ step 11 done: the Grove gate
  sc(
    's27-gate',
    [
      N('You come to the Grove gate. Lift and push! Creak!'),
      N('Nine stops. Nine isn’t sure about gates.'),
      N('Your Nubbin hops through. It sits on the other side, waiting.'),
      N('After a while, Nine comes through too.'),
      N('Nine sits by the gatepost and looks at everything. Home!'),
    ],
    [
      {
        domain: 'sel',
        skill: 'what helps someone in a new place',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 1,
        prompt: [N('Nine isn’t sure. New places can feel big. What helps?')],
        options: [
          opt(
            'A friend going first, and waiting',
            [N('Yes. Your Nubbin goes first and waits. That helps Nine feel brave.')],
            true,
          ),
          opt('Pushing Nine through', [
            N('That might give Nine a fright. Let’s wait. A friend going first helps.'),
          ]),
        ],
        parentNote: 'Thought about what helps someone feel safe in a new place.',
      },
    ],
  ),
  // ------------------------------------------------ step 12: the egg sac
  sc(
    's27-egg-sac',
    [
      N('It’s autumn now. Spindle is old, and slow.'),
      N('She sits in the sun more than in her web.'),
      N('Up high, there is a little round bag made of silk.'),
      SP('That’s her egg sac. Lots of baby spiders are inside.', 'soft'),
      SP('They sleep all winter. They come out in spring.'),
      SP('But it’s too cold up here. And she can’t carry it.'),
      N('There’s a new word in the web. PLEASE.'),
    ],
    [
      {
        domain: 'science',
        skill: 'spiders lay eggs and keep them safe in silk',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'notice',
        after: 4,
        lines: [
          N('Spiders lay eggs. A mother spider wraps them up in silk.'),
          N('The silk bag keeps the eggs safe, like a cosy sleeping bag.'),
        ],
        parentNote: 'Learned that spiders lay eggs and wrap them in a silk egg sac.',
      },
    ],
  ),
  // ------------------------------------------------ step 12 done: your Nubbin climbs
  sc(
    's27-carry',
    [
      SP('I’ll get my long ladder.'),
      N('Sparks puts the ladder up. It is very tall!'),
      N('Creak! Your Nubbin climbs up. One step, two steps, three…'),
      N('It holds the egg sac gently, and climbs back down.'),
      N('Spindle watches every step. Phew!'),
      SP('Take it to the Grove shed. The top shelf is warm.'),
      N('You carry it home in your two hands.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'count to 10',
        standard: 'K.CC.A.1',
        kind: 'do',
        after: 2,
        check: 'edu:count:rungs:10',
        lines: [
          N('(Count the ladder steps with your Nubbin, all the way to ten.)'),
          N('…eight, nine, ten. At the top!'),
        ],
        parentNote: 'Counted to ten, one step at a time.',
      },
    ],
  ),
  // ------------------------------------------------ step 13: the last evening
  sc(
    's27-last-evening',
    [
      N('The next evening, you go to the shed. Just to sit.'),
      N('Spindle is on the windowsill, in the sun.'),
      N('She lifts one leg to say hello.'),
      N('You sit on the box. The sky turns orange, then gold.'),
      N('You want to tell her something true.'),
      Y('I’m so glad you’re my friend, Spindle.', 'soft'),
      N('Spindle climbs slowly to her web. She writes one tiny word.'),
      N('WELL. It’s just for you.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'telling a friend something kind and true',
        standard: 'CASEL: Relationship skills',
        kind: 'do',
        after: 7,
        check: 'edu:say:kind-words:friend',
        lines: [
          N('(Who is your friend? Tell me something kind about them.)'),
          N('Saying kind, true things to friends makes them feel loved.'),
        ],
        parentNote: 'Said something kind and true about a friend.',
      },
    ],
  ),
  // ------------------------------------------------ step 13 done: walking home
  sc(
    's27-walk-home',
    [
      N('You walk home in the dark.'),
      N('Your Nubbin is asleep in your pocket.'),
      N('The stars are coming out. One, two, three…'),
      N('You feel quiet inside. Quiet, and a little bit sad.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'naming quiet, mixed feelings',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 3,
        lines: [
          N('Sometimes we feel happy and sad at the same time.'),
          N('That’s all right. Feelings can share.'),
        ],
        parentNote: 'Talked about feeling two things at once.',
      },
    ],
  ),
  // ------------------------------------------------ step 14: the empty web (Spindle has died)
  sc(
    's27-empty-web',
    [
      N('In the morning, you go to the shed first.'),
      N('The web is still in the window. The sun shines through it.'),
      N('But the web is empty. Spindle isn’t there.'),
      N('Spindle has died. Her body stopped working, and it won’t start again.'),
      N('She was very old, for a spider. That is very sad.'),
      N('Your Nubbin sits under the web, close to you.'),
      N('It stays close. Being close helps.'),
      N('Then you go to find Sparks.'),
    ],
    [
      {
        domain: 'science',
        skill: 'living things have a life span',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'notice',
        after: 4,
        lines: [
          N('Garden spiders like Spindle live for about one year.'),
          N('She lived a whole spider life. And she left her eggs, safe and warm.'),
        ],
        parentNote:
          'Learned, gently, that living things have a life span, and that Spindle left eggs behind.',
      },
    ],
  ),
  // ------------------------------------------------ step 14 done: leave it
  sc(
    's27-leave-it',
    [
      N('Sparks is quiet for a long time.'),
      SP('Oh, Spindle.', 'sad'),
      SP('Let’s leave her web up. Nobody will sweep it away. Ever.', 'sad'),
      N('Sparks gives you a big hug. You hug her back.'),
      SP('We’ll remember her. Every word she wrote.', 'soft'),
      N('The web stays in the window, catching the light.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'what helps when we are sad',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 4,
        prompt: [N('Sparks is sad. You are sad too. What helps?')],
        options: [
          opt(
            'A hug, and remembering her together',
            [N('Yes. Hugs help. Remembering together helps too.')],
            true,
          ),
          opt('Pretending we’re not sad', [
            N('It’s all right to be sad. A hug and remembering help more.'),
          ]),
        ],
        parentNote: 'Talked about what helps when we feel sad: hugs and remembering together.',
      },
    ],
  ),
];

const S27_COMPLETE: EduScene = sc(
  's27-complete',
  [
    N('A week later, Sparks brings you something.'),
    N('It’s a drawer label. It says SPARE.'),
    SP('Spindle learned her S from this. Every S she ever wrote.', 'soft'),
    N('Fern sews SOMEBODY’S on ribbons. One for everyone who came.'),
    N('Pop! Pixel makes a frosty window for the Grove shed.'),
    N('On cold mornings, a name shines on it.'),
    N('Up at the Circuit, Hob gives every runner a name.'),
    N('Even Corvin says “Morning, Gravel” to one of them.'),
  ],
  [
    {
      domain: 'literacy',
      skill: 'the first sound S',
      standard: 'RF.K.2',
      kind: 'do',
      after: 2,
      check: 'edu:say:first-sound:s',
      lines: [
        N('S says “sss”, like a snake. SPARE. SPINDLE. SOMEBODY’S.'),
        N('(Can you think of another sss word? Sun! Sock! Sparks!)'),
      ],
      parentNote: 'Listened for the first sound S and found more S words.',
    },
    {
      domain: 'social-studies',
      skill: 'everyone deserves a name and respect',
      standard: 'D2.Civ.8.K-2',
      kind: 'notice',
      after: 7,
      lines: [N('A name says: you matter. Now every runner has one.')],
      parentNote: 'Talked about why names matter and how they show respect.',
    },
  ],
);

// ================================================================== variants
export const EDU_S27_SPROUT_VARIANTS: EduScene[] = [
  // sold path: replaces s27-row
  sc(
    's27-row-sold',
    [
      N('Squeak! Look out of the shed window. You can see the pens.'),
      N('Each pen has a grey runner. They stand very still.'),
      N('At the end is one looking down the valley, towards the Grove.'),
      N('You know that one. It used to be yours.'),
      N('You sold it to Corvin in the spring. Now it has a 9.'),
      N('Hob comes along with two buckets, whistling.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'missing someone, and saying so',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 4,
        lines: [
          N('It’s all right to feel sad, or sorry, or both.'),
          N('Missing someone shows you love them.'),
        ],
        parentNote: 'Talked about missing someone, and feeling sorry.',
      },
    ],
  ),
  // sold path: replaces s27-words
  sc(
    's27-words-sold',
    [
      ...WORD_HUNT,
      N('Then Spindle points at the runner at the end of the row.'),
      SP('She wants its real name. Not the number.', 'think'),
      N('You tell her the name you gave it when it hatched.'),
      N('Spindle writes it small, to practise.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'hearing rhymes',
        standard: 'RF.K.2',
        kind: 'ask',
        after: 1,
        prompt: [N('WARM. Which word rhymes with WARM?')],
        options: [
          opt('Storm', [N('Yes! Warm, storm. They sound the same at the end.')], true),
          opt('Cat', [N('Warm, cat… no. Listen: warm, storm. Storm rhymes!')]),
        ],
        parentNote: 'Listened for a word that rhymes with warm.',
      },
    ],
  ),
  // truth = shield: replaces s27-midnight (sprout never offers shield; written in case a save carries it)
  sc(
    's27-midnight-shield',
    [
      N('In the middle of the night, a light comes on in Corvin’s window.'),
      N('Corvin sits and watches you. All night long.'),
      N('He watches your lantern. He watches your hands.'),
      N('He thinks you are the one writing. He never sees Spindle.'),
      N('At three o’clock, Corvin opens his window.'),
      N('“Your wick needs trimming,” he says. Then he shuts it.'),
      N('Spindle works on and on, thread by thread.'),
      N('Spindle is your secret.'),
      N('Near morning, his light goes out. Spindle ties the last thread.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'putting times of day in order',
        standard: 'ELOF: Mathematics Development',
        kind: 'do',
        after: 8,
        check: 'edu:order:night:evening-midnight-morning',
        lines: [
          N('(Put them in order: evening, the middle of the night, morning.)'),
          N('First evening. Next the middle of the night. Last, morning!'),
        ],
        parentNote: 'Put evening, midnight and morning in order.',
      },
    ],
  ),
  // sold path: replaces s27-letgo (the campaign hook)
  sc(
    's27-home',
    [
      ...MORNING,
      N('Hob says its real name. The name you gave it.'),
      C('It was yours once. I paid you two hundred Shells for it.', 'think'),
      C('Pay me the same, and it can go home.'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'names matter: everybody knows this one',
        standard: 'D2.Civ.8.K-2',
        kind: 'notice',
        after: 4,
        lines: [
          N('Mr Tull won’t take a runner that everybody knows by name.'),
          N('When people know your name, they look out for you.'),
        ],
        parentNote: 'Talked about how being known by name helps people look out for each other.',
      },
    ],
    {
      choices: [
        {
          id: 'pay',
          label: 'Pay the two hundred Shells.',
          set: { boughtBack: true, 's27-paid': 'shells' },
          then: [
            N('You count the Shells into Corvin’s cold hand.'),
            C('Paid. It’s yours.'),
            ...HOME_TAIL,
          ],
        },
        {
          id: 'hat',
          label: 'Let everyone pass a hat.',
          set: { boughtBack: true, 's27-paid': 'hat' },
          then: [
            SP('A hat! Who’s got a hat?', 'happy'),
            N('Everyone puts in some Shells. Fern puts in a button!'),
            FE('It’s a very good button.'),
            N('Corvin counts it all. Two hundred Shells. And a button.'),
            N('He puts the button in his pocket.'),
            ...HOME_TAIL,
          ],
        },
      ],
    },
  ),
  // sold path: replaces s27-gate
  sc(
    's27-gate-sold',
    [
      N('You come to the Grove gate.'),
      N('Your old Nubbin bumps the bottom bar with its nose.'),
      N('It remembers! The gate sticks. Lift and push!'),
      N('It sits by the gatepost and looks, and looks.'),
      N('The painted 9 will wash off by spring.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'talking about a memory of home',
        standard: 'SL.K.1',
        kind: 'do',
        after: 2,
        check: 'edu:say:remember:home',
        lines: [
          N('Your Nubbin remembers home.'),
          N('(What do you remember about your home? Tell me one thing.)'),
        ],
        parentNote: 'Talked about a memory of home.',
      },
    ],
  ),
  // step 12 done, if s21Done and Wisp is not carrying
  sc(
    's27-carry-clank',
    [
      N('Clank comes too. He loves ladders.'),
      CK('I can’t climb! I have one wheel! But I’m VERY good at steady!', 'happy'),
      N('Sparks puts up her long ladder.'),
      N('Clank holds the bottom. He doesn’t wobble one bit.'),
      N('Your Nubbin climbs up, step by step, and gets the egg sac.'),
      CK('Steady. Steady. Quiet steady.', 'soft'),
      N('Down it comes, holding the sac very gently.'),
      SP('Take it to the Grove shed. The top shelf is warm.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'everyone can help in their own way',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 3,
        lines: [
          N('Clank can’t climb. But he can help in his own way.'),
          N('Everybody can help with something.'),
        ],
        parentNote: 'Talked about how everyone can help in their own way.',
      },
    ],
  ),
  // step 12 done, if wisp = spared or sable
  sc(
    's27-carry-wisp',
    [
      N('Something grey drops down from a beam. It’s Wisp!'),
      N('Wisp has a torn ear. He likes warm things.'),
      N('He puts his ear on the egg sac. It’s warm from the sun.'),
      W('mine. warm. mine.', 'soft'),
      Y('It’s Spindle’s. But you can keep it warm for her. All winter.'),
      W('keep it warm. yes.', 'soft'),
      N('Wisp carries it down, very gently, in his mouth.'),
      N('He keeps it under the cottage step all winter.'),
      N('Spindle waves two legs at him. That means thank you.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'looking after something that belongs to someone else',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 4,
        prompt: [N('The egg sac isn’t Wisp’s. What can he do?')],
        options: [
          opt(
            'Look after it for Spindle',
            [N('Yes. He can keep it safe and warm for her. That’s kind.')],
            true,
          ),
          opt('Keep it for ever', [
            N('They’re Spindle’s eggs. Wisp can look after them for her, and that’s kind.'),
          ]),
        ],
        parentNote: 'Thought about looking after something that belongs to someone else.',
      },
    ],
  ),
  // post-game spring, s27-carrier = nubbin
  sc(
    's27-spring',
    [
      N('It’s spring! The snow has gone.'),
      N('In the Grove shed, the egg sac opens.'),
      N('Out come baby spiders. Hundreds! Each one is tiny.'),
      N('They climb up to the top of the gate.'),
      N('Each one lets out a silky thread. Whoosh! The wind lifts them away.'),
      N('Three baby spiders stay.'),
      N('Next morning, there’s a tiny web in the shed window.'),
      N('It says EVENING. You laugh, and say “Evening!” back.'),
      N('You will always remember Spindle.'),
    ],
    [
      {
        domain: 'science',
        skill: 'baby spiders float away on silk threads',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'notice',
        after: 4,
        lines: [
          N('Baby spiders are called spiderlings.'),
          N('The wind catches their silk threads. Away they float, to new homes.'),
        ],
        parentNote: 'Learned that baby spiders float away on silk threads in the wind.',
      },
      {
        domain: 'maths',
        skill: 'count to 3',
        standard: 'K.CC.B.5',
        kind: 'do',
        after: 5,
        check: 'edu:count:spiders:3',
        lines: [N('(Count the spiders who stay: one, two, three.)')],
        parentNote: 'Counted three.',
      },
    ],
  ),
  // post-game spring, s27-carrier = wisp
  sc(
    's27-spring-wisp',
    [
      N('It’s spring! The snow has gone.'),
      N('Under the cottage step, the egg sac opens.'),
      N('Wisp sees the baby spiders first. He watches them very carefully.'),
      N('They climb on his nose. He doesn’t mind one bit!'),
      N('They climb up to the top of the gate.'),
      N('Each one lets out a silky thread. Whoosh! The wind lifts them away.'),
      N('Wisp watches them go. Then he sulks under his step. Hmph!'),
      N('Three baby spiders stay. Next morning, a tiny web says EVENING.'),
      N('You will always remember Spindle.'),
    ],
    [
      {
        domain: 'science',
        skill: 'a spider’s life cycle: egg, spiderling, spider',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'notice',
        after: 2,
        lines: [
          N('First an egg. Then a tiny spiderling. Then a big spider, like Spindle.'),
          N('Then the big spiders lay eggs, and it starts again.'),
        ],
        parentNote: 'Heard the life cycle of a spider: egg, spiderling, spider.',
      },
      {
        domain: 'maths',
        skill: 'count to 3',
        standard: 'K.CC.B.5',
        kind: 'do',
        after: 7,
        check: 'edu:count:spiders:3',
        lines: [N('(Count the spiders who stay: one, two, three.)')],
        parentNote: 'Counted three.',
      },
    ],
  ),
];

// ================================================================== the quest
const S27: EduQuest = {
  id: 'sprout:s27',
  of: 's27',
  band: 'sprout',
  title: 'Some Nubbin',
  goals: {
    's27-step1': {
      goal: 'Fetch some wire for Sparks from the old lantern shed.',
      hint: 'The shed is behind the race track. Look in the bottom drawer.',
    },
    's27-step2': {
      goal: 'Talk to Hob about the little grey runner.',
      hint: 'Hob is by the pens with his buckets. Listen for whistling.',
    },
    's27-step3': {
      goal: 'Sit by the shed window and wait with the spider.',
      hint: 'Sit on the box by the window. Wait quietly.',
    },
    's27-step4': {
      goal: 'Ask Fern, Clover, Luna and Byte for a word each.',
      hint: 'Fern is in her orchard. Clover is by the pond. Luna is in her garden. Byte has a clipboard.',
    },
    's27-step5': {
      goal: 'Come back early in the morning to see the web.',
      hint: 'Go to the pens when it is just getting light.',
    },
    's27-step6': {
      goal: 'Corvin wants to talk to you.',
      hint: 'He’s by the pens, at the end of the row.',
    },
    's27-step7': {
      goal: 'At night, carry Spindle to the big fence.',
      hint: 'Bring the matchbox. Walk quietly.',
    },
    's27-step8': {
      goal: 'Carry Spindle in the toolbox to the pen behind the house.',
      hint: 'Walk slowly past the house. Nobody looks at toolboxes.',
    },
    's27-step9': {
      goal: 'Go to the Autumn Show.',
      hint: 'Spindle rides on your hat. Don’t bend down fast!',
    },
    's27-step10': {
      goal: 'Hold the lantern low for Spindle.',
      hint: 'Stay by the long fence. Keep the light still.',
    },
    's27-step11': {
      goal: 'Walk the little grey runner home to the Grove.',
      hint: 'Go slowly. It has never been so far.',
    },
    's27-step12': {
      goal: 'Get Spindle’s egg sac down, and keep it warm for winter.',
      hint: 'It’s up very high. Someone small and careful will need to climb.',
    },
    's27-step13': {
      goal: 'Sit with Spindle in the shed window.',
      hint: 'Sit on the box. You don’t need to do anything.',
    },
    's27-step14': {
      goal: 'Tell Sparks.',
      hint: 'Sparks is by the big lamp.',
    },
  },
  scenes: [...S27_SCENES, S27_COMPLETE],
  notes:
    'Lessons: frost is ice; a spider’s eight legs; tracing 9 (a number, not a name); naming Hob’s feeling; waiting beside ' +
    'someone; clapping Spin-dle; counting four friends; long and short words; carrying gently; frost forming on the web; ' +
    '2 + 1; noticing a scared friend; tiptoeing; SOME + BODY; beside and behind; ice melting; autumn leaves; first and last; ' +
    'light to see by; people can change; the four letters of HOME; a friend going first; egg sacs; counting to ten; kind words ' +
    'to a friend; mixed feelings; a spider’s life span; what helps when we are sad; the S sound; names and respect. ' +
    'Sprout leaves out the shield choice (defaultChoice frost). Spindle’s death is said plainly in s27-empty-web, with comfort ' +
    'straight after.',
};

// ================================================================== exports
export const EDU_S27_SPROUT: EduQuest[] = [S27];

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  'edu:count:legs:8',
  'edu:trace:number:9',
  'edu:clap:syllables:spindle',
  'edu:count:fingers:4',
  'edu:carry:gently:cupped-hands',
  'edu:tiptoe:quiet:to-the-fence',
  'edu:clap:syllables:somebody',
  'edu:place:toy:beside-behind',
  'edu:count:letters:home-4',
  'edu:count:rungs:10',
  'edu:say:kind-words:friend',
  'edu:say:first-sound:s',
  'edu:order:night:evening-midnight-morning',
  'edu:say:remember:home',
  'edu:count:spiders:3',
];
