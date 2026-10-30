/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): S28, the side story of
 * Parcel, the polite stray with a label who moves in with Byte.
 *
 * Source: side-stories-s28.ts (SIDE_STORY_S28 and SIDE_STORY_S28_VARIANTS). One EduScene per
 * original scene, id `sprout:<original id>`, including every variant and Byte's bark pool. See
 * EDU-STYLE.md.
 *
 * - Every choice is kept with its original id and `set` (none of them is cruel or bleak), so no
 *   scene needs a `defaultChoice`. The "Unverified" column is called NOT SURE YET in this band; the
 *   flag value stays `unverified`.
 * - No lifted text. The tag and the back of Hazel's recipe card use new words of our own.
 * - Teaches (from the outline): being a good neighbour, saying sorry and thank you; kitchen
 *   measuring and the cold-saucer test; bitter oranges and seeds; what a label and an address are
 *   for; a warm word about children who once travelled with labels, and why welcome matters.
 * - Canon: Parcel never speaks (it bows, stares and gestures). Moss speaks only to you, in
 *   chapter 8; Byte cannot hear him yet. Hazel is not seen before chapter 11 here, and only her
 *   handwriting appears earlier. She is "very poorly", said plainly, with comfort straight after.
 *   The Long Night is a cold, dark night that is over; nothing in it is frightening.
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
const BY = say('byte');
const M = say('moss');
const PX = say('pixel');
const HZ = say('hazel');
// new speakers (declared in the source quest)
const GR = say('mr-grue');
const CA = say('s28-carter');
const DO = say('s28-dot');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

/** One answer option. `best` marks the answer the lesson teaches. */
const opt = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

/** One sprout scene. Lesson ids are `sprout:<of>-l<n>`, numbered in play order. */
const sc = (of: string, lines: Line[], beats: Beat[], choices?: Choice[]): EduScene => ({
  id: `sprout:${of}`,
  of,
  band: 'sprout',
  lines,
  ...(choices ? { choices } : {}),
  lessons: [...beats]
    .sort((a, b) => a.after - b.after)
    .map((b, i) => ({ id: `sprout:${of}-l${i + 1}`, ...b })),
});

// ---------------------------------------------------------------- shared pieces
/** Step 10: the end of Byte's sentence. Ends both cart-stop choices. */
const KEEPING: Line[] = [
  BY('…and I’m keeping it.', 'soft'),
  BY('That was the end of what I was saying. I’m keeping you.', 'soft'),
  N('Byte writes on the back of the label. His name. His house.'),
  N('And in big letters: RECEIVED. It means “safely here”.'),
  N('Parcel looks at the label for a long time. Then it bows.'),
  N('Byte tucks Parcel inside his warm coat, and carries it home.'),
];

/** Step 13 complete: the opening shared by all three versions. */
const LOG_OPEN: Line[] = [
  N('After the cake, Byte stands up with his notebook. Ding!'),
  BY('I’m going to read my notebook out loud. I want to.', 'think'),
  BY('Oops list: Bath. Jam jars. Oranges. Snow. Watch.', 'think'),
];

/** Step 13 complete: the presents, shared by all three versions. */
const GIFTS: Line[] = [
  N('Parcel gives you Gran Hazel’s old jar, washed clean. Then it bows.'),
  N('Byte gives your Nubbin a rain hat, and a label that says RECEIVED.'),
  N('Mr Grue gives you a little piece of his orange tree, to plant.'),
  N('He says it won’t grow. It will. You can tell.'),
];

/** The cutting needs looking after: played after the gifts in every complete scene. */
const plantBeat = (after: number): Beat => ({
  domain: 'science',
  skill: 'what a plant needs to grow',
  standard: 'K-LS1-1',
  kind: 'notice',
  after,
  lines: [
    N('Your little orange tree will need water, and light, and a warm spot.'),
    N('Mr Grue’s glasshouse gives his tree all three.'),
  ],
  parentNote: 'Heard what a plant needs to grow: water, light and warmth.',
});

/** Byte sorts the Null story in his log: shared by the three step 6 done scenes. */
const sortBeat = (after: number): Beat => ({
  domain: 'maths',
  skill: 'sorting things into groups, and seeing that one thing can fit two groups',
  standard: 'K.MD.B.3',
  kind: 'do',
  after,
  check: 'edu:sort:log:good-oops',
  lines: [
    N('Let’s help Byte sort. Water all over the hall: good thing, or oops?'),
    N('Oops! Making a new friend: good thing, or oops?'),
    N('A good thing! And Null’s sticky lick? A bit of both.'),
  ],
  parentNote: 'Sorted things into “good things” and “oops”, and found that some things are both.',
});

/** Mr Grue comes back: shared lesson for the three step 13 done scenes. */
const thanksBeat = (after: number): Beat => ({
  domain: 'sel',
  skill: 'saying thank you',
  standard: 'CASEL: Relationship skills',
  kind: 'ask',
  after,
  prompt: [N('Mr Grue came back to the party. What can we say to him?')],
  options: [
    opt(
      'Thank you for coming!',
      [N('Yes. A thank-you makes a grumpy neighbour feel welcome.')],
      true,
    ),
    opt('Go away!', [N('Oh, that would hurt his feelings. “Thank you for coming” is kinder.')]),
    opt('Nothing at all', [N('He might think we don’t want him. A thank-you tells him we do.')]),
  ],
  parentNote: 'Practised saying thank you, and making a grumpy neighbour feel welcome.',
});

// ================================================================== S28
const SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: the carrier's cart
  sc(
    's28-cart',
    [
      N('Clip-clop! Ding! A cart stops at your gate.'),
      CA('Morning! I’ve got a passenger for you.', 'happy'),
      N('On a box sits a small brown Nubbin, with a basket.'),
      N('It sees you, and it bows. Right down from the middle!'),
      N('Round its neck is a label on a string.'),
      N('The label says: “Please be kind to this small one.”'),
      N('Under that, in small writing: “For Byte. H.”'),
      CA('It was sitting on a stone by the river. With a plum, to pay!', 'happy'),
      N('You know that writing. It looks like Gran Hazel’s.'),
      N('The Nubbin climbs down, step, step, step, and waits by your boot.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'a label tells you who a thing is for',
        standard: 'ELOF: Literacy',
        kind: 'ask',
        after: 6,
        prompt: [
          N('A label says who a thing is for.'),
          N('(Read it again: “For Byte.”) Who is this Nubbin for?'),
        ],
        options: [
          opt('For Byte', [N('Yes! For Byte. The label tells us where it should go.')], true),
          opt('For you', [N('Let’s look again. It says “For Byte.” So we take it to Byte!')]),
          opt('For the carter', [N('The carter only drove the cart. The label says “For Byte.”')]),
        ],
        parentNote:
          'Learned that a label tells us who something is for, and listened for the name on it.',
      },
    ],
  ),
  sc(
    's28-for-byte',
    [
      N('Byte opens his door. He has a pencil behind each ear.'),
      BY('A Nubbin? Why have you brought me a Nubbin?', 'shock'),
      N('The Nubbin bows to Byte. Byte bows back, just a tiny bit. Creak!'),
      N('He reads the label. Then the back. Then the front again.'),
      BY('“For Byte. H.” Who is H?', 'think'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'hearing the first sound of a name',
        standard: 'RF.K.2',
        kind: 'ask',
        after: 4,
        prompt: [N('H says “huh”. Which word starts with “huh”?')],
        options: [
          opt('Hat', [N('Yes! Huh, huh, hat. H is for hat.')], true),
          opt('Moss', [N('Moss starts with “mmm”. Hat starts with “huh”, like H!')]),
          opt('Byte', [N('Byte starts with “b-b-b”. Hat starts with “huh”, like H!')]),
        ],
        parentNote: 'Listened for the first sound in a word and matched it to the letter H.',
      },
    ],
    [
      {
        id: 'told',
        label: 'Tell him it’s Gran Hazel’s writing.',
        set: { 's28-told': true },
        friendship: { byte: 1 },
        then: [
          Y('It’s Gran Hazel’s writing. I know it.'),
          N('Byte goes very still. He holds the label up to the window.'),
          BY('Hazel. Then I’ll work out the rest.', 'think'),
        ],
      },
      {
        id: 'kept',
        label: 'Keep it to yourself for now.',
        set: { 's28-told': false },
        then: [
          N('You don’t say. Lots of names start with H.'),
          BY('Harry. Hattie. Mr Hubble. This could take weeks.'),
          BY('I’ll make a list of everyone with an H!', 'think'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 2: one jar
  sc(
    's28-one-jar',
    [
      N('In the basket: a scarf, a dried apple ring and a jar.'),
      N('The jar is empty. Licked very clean!'),
      N('The jar says “Marmalade”. Marmalade is a jam made from oranges.'),
      BY('Nubbins eat fruit. Not marmalade! It says so in every book.'),
      N('The Nubbin holds the jar upside down. Empty! Drip. Then it waits, politely.'),
      N('You remember a shelf at Gran Hazel’s. Orange jars, all in a row.'),
      BY('How many jars?'),
      Y('Some!'),
      BY('“Some” isn’t a number! Go and count them.', 'think'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'clapping the syllables in a word',
        standard: 'RF.K.2',
        kind: 'do',
        after: 3,
        check: 'edu:clap:syllables:marmalade',
        lines: [
          N('Let’s clap “marmalade” together. Mar-ma-lade!'),
          N('(Clap three times.) Three claps!'),
        ],
        parentNote: 'Clapped the three syllables in “marmalade”.',
      },
    ],
  ),
  sc(
    's28-received',
    [
      N('Here are Gran Hazel’s jars, with paper lids and string.'),
      N('Under the last jar is a card. It’s Gran Hazel’s recipe.'),
      N('Byte counts the jars. Then he counts them again!'),
      BY('Six jars. And one Nubbin. All here, safe. Received!', 'think'),
      BY('Received means it came safely, like a parcel in the post.'),
      BY('That’s your name. Parcel! Like a parcel that came for me.', 'soft'),
      N('Parcel bows.'),
      N('Your own Nubbin puts its face in a jar. Slurp!'),
      BY('Hey! That’s one spoonful gone already!', 'shock'),
    ],
    [
      {
        domain: 'maths',
        skill: 'count to 6',
        standard: 'K.CC.B.5',
        kind: 'do',
        after: 2,
        check: 'edu:count:jars:6',
        lines: [
          N('Let’s count with Byte. One, two, three, four, five, six.'),
          N('Six jars! (Hold up six fingers.)'),
        ],
        parentNote: 'Counted six jars, one by one.',
      },
    ],
  ),
  // ------------------------------------------------ step 3: hot water
  sc(
    's28-bath',
    [
      N('Parcel is muddy all over. Mud from the Hollow!'),
      BY('Bath time. I’ll find the thermometer. You find a towel.'),
      N('Parcel wants to help. It turns both taps on. Whoosh!'),
      N('Then it sits and waits for someone to say “stop”.'),
      N('Nobody says “stop”.'),
      N('Splish! The bath is full. Parcel bows to the bath.'),
      N('Splash! The landing is full. Parcel bows to the landing.'),
      N('Splash! The stairs are full. Parcel bows to the stairs.'),
      BY('WHY IS THE HALL WET?', 'shock'),
      N('The water runs down the stairs, out of the door, and next door!'),
    ],
    [
      {
        domain: 'science',
        skill: 'some things soak up water and some don’t',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'ask',
        after: 9,
        prompt: [N('Quick! What will soak up the water?')],
        options: [
          opt('A towel', [N('Yes! A towel is full of tiny holes. It drinks the water up.')], true),
          opt('A spoon', [N('A spoon is hard and smooth. A towel soaks water up!')]),
          opt('A plate', [N('A plate can’t soak anything up. A towel or a mop can!')]),
        ],
        parentNote: 'Thought about which things soak up water, like a towel or a mop.',
      },
    ],
  ),
  sc(
    's28-nubbin',
    [
      N('A head goes pop over the fence. A cardigan. A moustache. A cross face.'),
      GR('NUBBIN!', 'angry'),
      N('This is Mr Grue, from next door. His garden is all wet.'),
      GR('Send it back where it came from!', 'angry'),
      BY('It stays until I know who sent it. Those are the rules.', 'think'),
      N('Upstairs, Parcel turns the taps off. It bows to Mr Grue.'),
      GR('Don’t you bow at me!', 'angry'),
    ],
    [
      {
        domain: 'sel',
        skill: 'saying sorry and offering to help',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 6,
        prompt: [N('Mr Grue’s garden got wet. What could we say to him?')],
        options: [
          opt(
            'Sorry! Can we help?',
            [N('Yes. Saying sorry and offering to help is what good neighbours do.')],
            true,
          ),
          opt('Nothing', [N('Mr Grue would still be cross. A sorry helps. So does a mop!')]),
          opt('It wasn’t me!', [N('It was an accident. But we can still say sorry, and help.')]),
        ],
        parentNote: 'Practised saying sorry to a neighbour and offering to help put things right.',
      },
    ],
  ),
  // ------------------------------------------------ step 4: the hard stare, and Byte's log
  sc(
    's28-compensation',
    [
      N('Next morning, Mr Grue knocks on Byte’s door. He has a list.'),
      GR('My lettuces got wet. My slippers got wet. I want something for it!', 'angry'),
      N('Parcel comes out from behind Byte’s legs. Squeak!'),
      N('It stands up very straight. It looks at Mr Grue.'),
      N('It does not blink. It does not move. It just looks.'),
      N('This is a hard stare. Byte counts, very quietly.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'count to 11',
        standard: 'K.CC.A.1',
        kind: 'do',
        after: 5,
        check: 'edu:count:seconds:11',
        lines: [
          N('Count with Byte, nice and slow. One, two, three…'),
          N('(Count together, all the way to eleven.)'),
        ],
        parentNote: 'Counted slowly up to eleven.',
      },
    ],
  ),
  sc(
    's28-eleven-seconds',
    [
      N('Mr Grue stops talking. He starts again. He stops.'),
      N('He folds up his list. Pop! He goes home, very quietly.'),
      BY('Eleven seconds! Nobody stares for eleven seconds!', 'shock'),
      N('That night, Byte gets a new notebook. He writes on it: PARCEL.'),
      N('Inside, he draws two columns, like two tall boxes, side by side.'),
      BY('Any more columns? I’m asking you.', 'think'),
    ],
    [
      {
        domain: 'sel',
        skill: 'everyone feels cross sometimes',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 1,
        prompt: [N('Mr Grue was cross. Is it all right to feel cross?')],
        options: [
          opt(
            'Yes, everyone feels cross sometimes',
            [N('Yes. Mr Grue isn’t bad. He’s cross, because his lettuces got wet.')],
            true,
          ),
          opt('No, never', [
            N('Everybody feels cross sometimes, even grown-ups. What matters is what we do next.'),
          ]),
        ],
        parentNote:
          'Talked about how everyone feels cross sometimes, and why Mr Grue felt that way.',
      },
    ],
    [
      {
        id: 'good',
        label: 'Suggest a column for “Good things”.',
        set: { 's28-column': 'good' },
        then: [
          BY('“Good things”? That isn’t a measurement.', 'think'),
          N('But he draws it anyway. He leaves room to make it wider.'),
        ],
      },
      {
        id: 'unverified',
        label: 'Suggest a column for “Not sure yet”.',
        set: { 's28-column': 'unverified' },
        then: [
          BY('Yes! For things I can’t prove yet.', 'happy'),
          N('He draws it wide, in his best letters.'),
        ],
      },
      {
        id: 'none',
        label: 'Leave it. It’s his notebook.',
        set: { 's28-column': 'none' },
        then: [
          Y('It’s your notebook, Byte.'),
          BY('…Yes. It is.', 'soft'),
          N('He looks at his two columns, as if one is missing.'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 5: elevenses
  sc(
    's28-sandwich',
    [
      N('A week later. Parcel has a routine. Byte writes it down.'),
      BY('Up at seven. Bow to the kettle. Marmalade. Bow to the kettle.', 'think'),
      BY('At eleven, it makes a sandwich. It takes half outside.'),
      BY('I follow it. I always lose it at the wall!', 'think'),
      N('Ding, dong! The clock in the hall strikes eleven.'),
      N('Parcel comes out with half a sandwich, held in both paws like a tray.'),
      BY('You go. You’re quieter than me.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'telling the time in hours',
        standard: 'ELOF: Mathematics Development',
        kind: 'ask',
        after: 4,
        prompt: [
          N('The short hand points to 11. The long hand points to 12.'),
          N('What time is it?'),
        ],
        options: [
          opt('Eleven o’clock', [N('Yes! Eleven o’clock. Time for Parcel’s sandwich.')], true),
          opt('Seven o’clock', [
            N('Parcel gets up at seven. The short hand is on 11: eleven o’clock.'),
          ]),
          opt('Bedtime', [
            N('Not yet! The short hand is on 11. It’s eleven o’clock in the morning.'),
          ]),
        ],
        parentNote: 'Read a clock showing eleven o’clock.',
      },
    ],
  ),
  sc(
    's28-elevenses',
    [
      N('The low wall at the bottom of the hill. Moss is sitting on it.'),
      N('Parcel climbs up. Plop! It puts the half sandwich down, and bows.'),
      M('Elevenses. That’s a little snack at eleven o’clock.', 'soft'),
      M('It brings me one every morning. I don’t eat. It brings one anyway.', 'soft'),
      M('Lots have come down that road with a label, you know.', 'soft'),
      N('Here comes Byte, puffing. He can’t hear Moss. But you can.'),
      M('His shoelace.'),
      N('You look at Byte’s shoe. Byte looks at your face.'),
      BY('It’s undone, isn’t it? I can tell from your face!', 'think'),
      M('Other one.', 'happy'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'long ago, some children travelled to new homes wearing labels, and were welcomed',
        standard: 'D2.His.2.K-2',
        kind: 'notice',
        after: 4,
        lines: [
          M('Long ago, the big towns weren’t safe for a while.', 'soft'),
          M('So lots of children went on trains to the countryside.', 'soft'),
          M('They wore labels with their names.', 'soft'),
          M('Kind families took them in and looked after them. Like Byte with Parcel.', 'soft'),
        ],
        parentNote:
          'Heard that, long ago, children travelled with name labels to new homes, and kind families welcomed them.',
      },
    ],
  ),
  // ------------------------------------------------ step 6: Null
  sc(
    's28-null',
    [
      N('Byte’s garden. Null jumps out of the hedge, after a moth.'),
      BY('Null, this is Parcel. Parcel, this is Null.', 'happy'),
      N('Parcel bows. Nobody has ever bowed to Null. Null falls over backwards!'),
      N('Parcel has a sandwich on a plate, cut into triangles. To share.'),
      N('Null licks the marmalade off the top. Slurp! And runs.'),
      N('Parcel looks at Null. Null looks back, chewing.'),
      N('Parcel looks happy. It gives Null the bread too.'),
      BY('They’re friends. I don’t know who started it.', 'happy'),
    ],
    [
      {
        domain: 'sel',
        skill: 'sharing makes friends',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'ask',
        after: 6,
        prompt: [N('Parcel shared its sandwich. How do you think Null feels?')],
        options: [
          opt('Happy', [N('Yes! Sharing made Null happy. And now they are friends.')], true),
          opt('Cross', [
            N('Null isn’t cross. Null got marmalade and a new friend! Null is happy.'),
          ]),
        ],
        parentNote: 'Talked about how sharing makes others feel happy and helps make friends.',
      },
    ],
  ),
  sc(
    's28-logged',
    [
      N('That night, Byte writes in his notebook. You watch.'),
      N('He writes about Null under INCIDENTS. That means “things that happened”.'),
      N('Then he writes it again, under GOOD THINGS.'),
      BY('It can be both. I checked. There’s no rule against it.', 'think'),
    ],
    [sortBeat(3)],
  ),
  // ------------------------------------------------ step 7: a shopping expedition
  sc(
    's28-market',
    [
      N('Market day! Stalls, and shouting, and the smell of hot chestnuts.'),
      BY('Parcel shivers in the mornings. It needs a coat.', 'think'),
      N('You look at the first stall. You turn round. Where’s Parcel?'),
      BY('It was right there! I’m sure it was!', 'shock'),
      N('Across the square: clink, clank, BONK!'),
      N('Your Nubbin runs to the noise, nose first. It can smell oranges!'),
    ],
    [
      {
        domain: 'science',
        skill: 'we use our senses, like smell and hearing, to find things',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'ask',
        after: 5,
        prompt: [N('How does your Nubbin find the oranges?')],
        options: [
          opt('With its nose', [N('Yes! It sniffs. Sniff, sniff! Noses find smells.')], true),
          opt('With its elbows', [
            N('Elbows can’t smell! Your Nubbin uses its nose. Sniff, sniff!'),
          ]),
        ],
        parentNote: 'Talked about using our senses, like smelling and hearing, to find things.',
      },
    ],
  ),
  sc(
    's28-jam-stall',
    [
      N('A jam stall. There was a tall, pointy pile of jars here.'),
      N('Now the jars are rolling everywhere! Bonk! Parcel holds the top jar, safe.'),
      DO('My lovely pile! It took me three hours!', 'angry'),
      N('Lots of people come to look. Parcel bows to them.'),
      N('Everyone claps. They pick up the jars, and they buy them!'),
      DO('All sold! Here, little one. A jar of apricot, for you.', 'happy'),
      N('Byte buys a knitted coat with toggles for Parcel.'),
      N('Then a second one, for your Nubbin.'),
      BY('If one has a coat, they both have a coat. That’s fair.', 'think'),
    ],
    [
      {
        domain: 'maths',
        skill: 'count to 10, building a shape',
        standard: 'K.CC.B.5',
        kind: 'do',
        after: 2,
        check: 'edu:count:jars:10',
        lines: [
          N('Help Dot stack it again. Four at the bottom. Then three, two, one.'),
          N('Now count them all, slowly. Ten jars! It looks like a triangle.'),
        ],
        parentNote: 'Stacked jars four, three, two, one, and counted ten in all.',
      },
    ],
  ),
  // ------------------------------------------------ step 8: the last jar, and the glasshouse
  sc(
    's28-graph',
    [
      N('Winter is coming. There is frost on Byte’s hedge.'),
      BY('Six jars, one spoonful a day. That should last till midwinter.', 'think'),
      BY('But look. The marmalade is all gone already!', 'sad'),
      BY('Parcel shares. Nom! It feeds everyone before itself.', 'sad'),
      N('Moss had some. The robins had some. Your Nubbin had some, twice!'),
      N('The last jar is on the table. Empty and washed, like a milk bottle.'),
      N('That night, Parcel isn’t in its basket.'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'when there isn’t enough, we choose how to share',
        standard: 'D2.Eco.1.K-2',
        kind: 'ask',
        after: 4,
        prompt: [
          N('Say there is one spoonful left, and two hungry Nubbins.'),
          N('What could they do?'),
        ],
        options: [
          opt(
            'Share it, half each',
            [N('Yes! Half each. When there isn’t much, sharing is fair.')],
            true,
          ),
          opt('One Nubbin has it all', [
            N('Then the other one is still hungry. Half each is fairer.'),
          ]),
        ],
        parentNote: 'Thought about sharing fairly when there isn’t enough to go round.',
      },
    ],
  ),
  sc(
    's28-glasshouse',
    [
      N('Next door, Mr Grue’s glasshouse is glowing. It’s a little house made of glass.'),
      N('Inside is a little tree, with small, bright oranges.'),
      N('Parcel is under the tree. Munch! It has an orange in both paws.'),
      GR('A thief! In my glasshouse!', 'angry'),
      N('Byte runs over in his dressing gown. He stands in front of Parcel.'),
      BY('Parcel is in my care. If it did wrong, I’ll put it right.', 'angry'),
      GR('Those oranges are bitter. Very sour! You can’t eat them as they are.', 'think'),
      GR('My mum grew this tree from one pip. In a teacup!', 'soft'),
      GR('Sixty years. Only one person ever asked for them.', 'soft'),
      GR('She came every winter. Not this winter.', 'soft'),
      GR('So. What will you give me for them?', 'angry'),
    ],
    [
      {
        domain: 'science',
        skill: 'sunshine through glass keeps a glasshouse warm',
        standard: 'K-PS3-1',
        kind: 'notice',
        after: 0,
        lines: [
          N('Glass lets the sunshine in. The sunshine warms it up inside.'),
          N('So plants stay cosy in a glasshouse, even in winter.'),
        ],
        parentNote: 'Heard that sunshine coming through glass keeps a glasshouse warm for plants.',
      },
      {
        domain: 'science',
        skill: 'a seed can grow into a plant',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'ask',
        after: 7,
        prompt: [N('A pip is a seed. What can a seed grow into?')],
        options: [
          opt(
            'A tree',
            [N('Yes! A tiny pip grew into this whole tree. It took years and years.')],
            true,
          ),
          opt('A teacup', [N('The teacup was just its first pot! The pip grew into a tree.')]),
          opt('A cat', [
            N('Ha! Cats don’t grow from pips. An orange pip grows into an orange tree.'),
          ]),
        ],
        parentNote: 'Learned that a seed, like an orange pip, can grow into a tree.',
      },
    ],
    [
      {
        id: 'jar',
        label: 'Promise him the first jar of marmalade.',
        set: { 's28-offer': 'jar' },
        then: [
          Y('We’ll make marmalade. You can have the first jar.'),
          GR('The first jar. Not the second. I’ll know!', 'think'),
          N('He fills a paper bag with oranges.'),
        ],
      },
      {
        id: 'weed',
        label: 'Offer to weed his glasshouse.',
        set: { 's28-offer': 'weed' },
        then: [
          Y('I’ll pull up the weeds in your glasshouse. A whole morning.'),
          GR('There aren’t any weeds. Well… some. Saturday!', 'think'),
          N('He fills a paper bag with oranges, and holds the lamp for you.'),
        ],
      },
      {
        id: 'stare',
        label: 'Give him a hard stare of your own.',
        set: { 's28-offer': 'stare' },
        then: [
          N('You look at Mr Grue, long and still. Just like Parcel.'),
          GR('Oh, not you as well!', 'shock'),
          N('He gives Byte a bag of oranges and goes in, grumbling.'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 9: the setting point
  sc(
    's28-kitchen',
    [
      N('Byte’s kitchen. Chop, chop! Oranges everywhere. Pop! It smells bright and sunny.'),
      BY('My thermometer will tell us when it’s hot enough.', 'think'),
      N('Gran Hazel’s card says: “Cold saucer. Push it. See if it wrinkles.”'),
      BY('That isn’t a test. That’s a feeling!', 'think'),
      N('Parcel puts a saucer on the frosty windowsill, to keep it cold.'),
      N('Your Nubbin licks the saucer. Parcel stares. Slowly, it puts it back.'),
      BY('Oh dear. That saucer is the test saucer now.', 'think'),
      N('On the back of the card, Gran Hazel wrote one more line.'),
      BY('“Be kind. Say please and thank you. Share what you’ve got.”', 'think'),
      BY('That isn’t a recipe. But I’ll keep it.', 'soft'),
    ],
    [
      {
        domain: 'science',
        skill: 'hot and cold places',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'ask',
        after: 4,
        prompt: [N('Where will the saucer stay coldest?')],
        options: [
          opt(
            'On the frosty windowsill',
            [N('Yes! Frost means it’s very cold there. Good thinking, Parcel.')],
            true,
          ),
          opt('Next to the hot pan', [
            N('The hot pan would warm it up. The frosty windowsill keeps it cold.'),
          ]),
          opt('In the oven', [N('Ovens are hot! The cold windowsill is best.')]),
        ],
        parentNote: 'Thought about which places are hot and which are cold.',
      },
    ],
  ),
  sc(
    's28-wrinkle',
    [
      N('Bubble, bubble, pop! The thermometer says: hot enough!'),
      N('And on the cold saucer, the marmalade wrinkles when Parcel pushes it.'),
      BY('They agree! The feeling and the thermometer agree!', 'shock'),
      N('Nine jars glow on the table, like little orange windows.'),
      N('Parcel bows to every jar.'),
      N('The first jar goes over the hedge to Mr Grue.'),
      GR('I’ll take it. As evidence.', 'angry'),
      N('But he carries it home very gently, like an egg.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'count to 9',
        standard: 'K.CC.B.5',
        kind: 'do',
        after: 3,
        check: 'edu:count:jars:9',
        lines: [
          N('Let’s count the new jars with Parcel. Point to each one.'),
          N('One, two, three… nine! Nine jars of marmalade.'),
        ],
        parentNote: 'Counted nine jars, pointing to each one.',
      },
    ],
  ),
  // ------------------------------------------------ step 10: gone to the cart stop
  sc(
    's28-first-snow',
    [
      N('The first snow falls in the night. Soft and quiet.'),
      N('In the morning, Byte and Mr Grue talk at the fence.'),
      GR('So your Nubbin is staying, then?', 'think'),
      BY('Well. I never asked for it, Mr Grue. It just came. I never asked—'),
      N('Parcel hears that. It puts down its sandwich. It picks up its basket.'),
      N('By the time Byte stops talking, Parcel has gone.'),
      GR('It went down the lane! Go on, quick! It’s snowing!', 'shock'),
      BY('But I hadn’t finished what I was saying!', 'shock'),
    ],
    [
      {
        domain: 'sel',
        skill: 'noticing how someone feels when they hear only half the story',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 7,
        prompt: [N('Parcel heard only half of what Byte said. How do you think Parcel feels?')],
        options: [
          opt(
            'Sad',
            [N('Yes. Parcel thinks Byte doesn’t want it. But Byte hadn’t finished!')],
            true,
          ),
          opt('Happy', [N('Parcel took its basket and left. It feels sad. Let’s find it.')]),
          opt('Sleepy', [N('Parcel isn’t sleepy. It feels sad. It heard only half.')]),
        ],
        parentNote: 'Thought about how Parcel felt after hearing only half of what Byte said.',
      },
    ],
  ),
  sc(
    's28-cart-stop',
    [
      N('The cart stop is a sign, a bench and a stone. No cart today.'),
      N('Parcel is under the sign, with snow on its head.'),
      N('It holds out its label, to be sent back.'),
      N('It sees you both, and bows.'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'an address says where someone lives',
        standard: 'D2.Geo.2.K-2',
        kind: 'ask',
        after: 3,
        prompt: [
          N('Byte wants Parcel’s label to say where Parcel lives now.'),
          N('What do we call where someone lives?'),
        ],
        options: [
          opt(
            'Their address',
            [N('Yes! An address helps people find their way to your home.')],
            true,
          ),
          opt('Their hat', [N('A hat goes on your head! Where you live is your address.')]),
          opt('Their dinner', [N('Mmm, dinner! But where you live is called your address.')]),
        ],
        parentNote: 'Learned that an address tells people where someone lives.',
      },
    ],
    [
      {
        id: 'sit',
        label: 'Sit down in the snow beside Parcel.',
        then: [
          N('You sit down beside Parcel. Brr! Parcel stays.'),
          N('Byte sits down on its other side, in his good trousers.'),
          ...KEEPING,
        ],
      },
      {
        id: 'back',
        label: 'Hang back. Let Byte go.',
        then: [N('You wait at the corner. Byte kneels in the snow by Parcel.'), ...KEEPING],
      },
    ],
  ),
  // ------------------------------------------------ step 11: the coldest hour, and Hazel's bench
  sc(
    's28-crust',
    [
      N('The Long Night is over. The Grove is soft with snow.'),
      N('Byte comes to your gate early, with Parcel and a matchbox.'),
      BY('I want to tell you something. It isn’t a number.', 'think'),
      BY('In the long, dark night, I felt cold and scared. My hands shook.', 'sad'),
      BY('Then Parcel came. It gave me half a sandwich.', 'soft'),
      BY('And my hands stopped shaking.', 'soft'),
      N('Byte opens the matchbox. Inside is a sandwich crust, on cotton wool.'),
      BY('I kept it. Don’t say anything.', 'soft'),
      N('Parcel sees smoke from Gran Hazel’s chimney. Off it goes!'),
    ],
    [
      {
        domain: 'sel',
        skill: 'a kind friend can help when we feel scared',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 5,
        prompt: [N('When Byte felt scared, what helped him?')],
        options: [
          opt(
            'A friend being kind',
            [N('Yes. Parcel came close and shared. Kindness helps scared feelings.')],
            true,
          ),
          opt('Being all alone', [
            N('Byte wasn’t alone. Parcel came and shared. A kind friend helps.'),
          ]),
          opt('Shouting', [N('Shouting wouldn’t help. A kind friend coming close helped Byte.')]),
        ],
        parentNote: 'Talked about how a kind friend can help when we feel scared.',
      },
    ],
  ),
  sc(
    's28-bench',
    [
      N('Gran Hazel is home! She sits on her bench, in three coats.'),
      N('A thin grey Nubbin sleeps in her arm.'),
      N('Parcel walks up the path. It bows, lower than ever before.'),
      HZ('Hello again, you. Look at that coat! Somebody’s been looking after you.', 'soft'),
      N('Parcel opens its coat. It takes out half a sandwich.'),
      N('It holds it up to the thin grey Nubbin. Sniff, sniff. Nibble!'),
      HZ('It took me two days to make friends. You did it at once!', 'happy'),
    ],
    [
      {
        domain: 'science',
        skill: 'warm clothes keep us warm in cold weather',
        standard: 'K-ESS2-1',
        kind: 'ask',
        after: 6,
        prompt: [N('It’s snowy. Why does Gran Hazel wear three coats?')],
        options: [
          opt('To keep warm', [N('Yes! When it’s cold, more layers keep us warm.')], true),
          opt('To go swimming', [N('Brr! Not in the snow! The coats keep her warm.')]),
        ],
        parentNote: 'Talked about wearing warm layers in cold, snowy weather.',
      },
    ],
  ),
  // ------------------------------------------------ step 12: why him
  sc(
    's28-why',
    [
      N('Byte comes up the path. He holds his notebook in front of him.'),
      BY('Hazel, I have an idea about why. Can I say it?', 'think'),
      HZ('Go on, love.', 'soft'),
      BY('You couldn’t look after Parcel where you were.', 'think'),
      BY('So you sent it to someone who writes everything down. Me.'),
      N('Gran Hazel nods.'),
      HZ('You count things, love. I needed someone to count this one.', 'soft'),
      N('Byte writes in his notebook: TRUE. Then he sits on the step.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'what a character is like',
        standard: 'RL.K.3',
        kind: 'ask',
        after: 6,
        prompt: [N('What does Byte love to do?')],
        options: [
          opt(
            'Count and write things down',
            [N('Yes! That’s why Gran Hazel chose him. He notices everything.')],
            true,
          ),
          opt('Dance', [N('Maybe, secretly! But Byte loves counting and writing things down.')]),
        ],
        parentNote: 'Talked about what Byte is like, and why Hazel chose him.',
      },
    ],
  ),
  sc(
    's28-on-the-step',
    [
      N('You sit on the step next to Byte. Parcel sits between you.'),
      N('Nobody talks. It is a nice, quiet sit.'),
      N('Gran Hazel is very poorly. The doctors can’t make her better.'),
      N('She sleeps a lot, and wakes up for the good bits.'),
      N('She is still Gran, still funny.'),
      N('Parcel leans on Byte. Byte leans on you. That helps a bit.'),
      BY('I’m going to give Parcel a party. A welcome party!', 'happy'),
      BY('It’s very late for a welcome party. But there’s no rule.', 'think'),
    ],
    [
      {
        domain: 'sel',
        skill: 'being together quietly is a way of caring',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 1,
        lines: [
          N('Friends don’t always need to talk.'),
          N('Sitting close, together, is a way of saying “I care about you.”'),
        ],
        parentNote: 'Heard that sitting quietly together is one way to show we care.',
      },
    ],
  ),
  // ------------------------------------------------ step 13: a disappearing trick
  sc(
    's28-party',
    [
      N('Pop! Party time at Byte’s! Paper flags, and a cake that says PARCEL.'),
      PX('I got the cake stand from our loft. It spins round!', 'happy'),
      N('Pixel is Byte’s wife. They are always like this.'),
      BY('It’s a cake, not a funfair.'),
      PX('He said that at our wedding. It spun anyway. And his shoelace was undone.'),
      BY('It always comes undone at parties.'),
      BY('Now Parcel will do a trick. Nobody told me what. I don’t like that.', 'think'),
      N('Parcel bows to Mr Grue. It holds out a paw for his watch.'),
      N('Mr Grue gives it his watch. It was his dad’s.'),
      N('Parcel wraps the watch in a napkin. Tap, tap! The watch is gone!'),
      N('Everyone claps. Tap, tap again! The watch comes back… in eleven pieces.'),
      GR('MY DAD’S WATCH!', 'angry'),
      N('Mr Grue stomps out. The paper flags fall down.'),
      PX('Give me all the pieces. Nobody sneeze!', 'think'),
    ],
    [
      {
        domain: 'maths',
        skill: 'count to 11',
        standard: 'K.CC.B.4',
        kind: 'do',
        after: 13,
        check: 'edu:count:watch-pieces:11',
        lines: [
          N('Help Pixel find every piece. Count as you find them.'),
          N('One, two, three… eleven! All eleven pieces.'),
        ],
        parentNote: 'Counted eleven pieces, saying one number for each piece.',
      },
    ],
  ),
  sc(
    's28-grue-back',
    [
      N('Pixel fixes the watch. Tick, tick, tick! It works better than before.'),
      N('Ding-dong! It’s Mr Grue, with a paper bag.'),
      GR('I’ve come for the marmalade. Not the party.', 'angry'),
      N('In the bag are oranges, from his tree.'),
      GR('For the next lot. Don’t make a fuss.', 'think'),
      N('Parcel bows to Mr Grue, very low. That is Parcel’s way of saying sorry.'),
      N('Mr Grue gets his watch back. He listens to it tick, and stays.'),
    ],
    [thanksBeat(6)],
  ),
  // ------------------------------------------------ complete (column: good)
  sc(
    's28-complete',
    [
      ...LOG_OPEN,
      BY(
        'Good things: Bowed to the kettle. Shared. Shared. Shared. Gave me half a sandwich.',
        'soft',
      ),
      BY('The good list is longer. I measured it!', 'happy'),
      ...GIFTS,
    ],
    [
      {
        domain: 'maths',
        skill: 'comparing which is longer',
        standard: 'K.MD.A.2',
        kind: 'do',
        after: 4,
        check: 'edu:show:longer:good-list',
        lines: [
          N('Show the oops list with your hands. This long!'),
          N('Now show the good list. Even longer! Stretch wide!'),
        ],
        parentNote: 'Compared two lengths and showed which was longer.',
      },
      plantBeat(8),
    ],
  ),
];

// ================================================================== variants
export const EDU_S28_SPROUT_VARIANTS: EduScene[] = [
  // step 6 scene: the Minder is still ticking
  sc(
    's28-null-minder',
    [
      N('Byte’s front room. A big clock sits on the shelf. Tick, tock.'),
      N('Null sits in a little bed under it. Null waits for the bell.'),
      BY('That’s Null. It waits for the bell all day. It’s going very well.', 'think'),
      N('Parcel bows. Null doesn’t look. Null only watches the bell.'),
      N('So Parcel climbs in beside Null. It waits for the bell too.'),
      N('Byte’s face goes pale. That means white and worried.'),
      BY('No. Null isn’t mine. I’m only minding it.', 'sad'),
      BY('And a bell all day isn’t fair on Null.', 'sad'),
      N('Byte lifts Parcel out, gently. Then he looks at the clock.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'being fair to animals',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 8,
        prompt: [N('Null waits all day for a bell. Is that fair on Null?')],
        options: [
          opt(
            'No. Null wants to play',
            [N('Yes. Nubbins need to play and run about. Byte is starting to see that.')],
            true,
          ),
          opt('Yes, clocks are fun', [
            N('Clocks can be fun. But Null needs to play, not just wait.'),
          ]),
        ],
        parentNote: 'Thought about what is fair for an animal, and what it needs to be happy.',
      },
    ],
  ),
  // step 6 done: by s28-column
  sc(
    's28-logged-unverified',
    [
      N('That night, Byte writes in his notebook. You watch.'),
      N('He writes about Null under INCIDENTS. Then again, under NOT SURE YET.'),
      N('He draws two lines under it.'),
      BY('Two lines means I hope it’s true. Don’t tell anyone.', 'soft'),
    ],
    [sortBeat(3)],
  ),
  sc(
    's28-logged-none',
    [
      N('That night, Byte writes in his notebook. You watch.'),
      N('He writes about Null under INCIDENTS, in very small letters.'),
      BY('It isn’t really an incident. There’s no box for what it is.', 'think'),
      N('He looks at the page, as if a box is missing.'),
    ],
    [sortBeat(3)],
  ),
  // step 11 done: Bramble's youngest came down with Hazel (colour only)
  sc(
    's28-bench-bramble',
    [
      N('Gran Hazel is home! She sits on her bench, in three coats.'),
      N('Bramble’s youngest sleeps in her arm. Its ear folds over at the tip.'),
      N('Parcel walks up the path. It bows, lower than ever before.'),
      HZ('Hello again, you. Look at that coat! Somebody’s been looking after you.', 'soft'),
      N('Parcel opens its coat. It takes out half a sandwich.'),
      N('It holds it up to the little grey one. Sniff, sniff. Nibble!'),
      HZ('It took me two days to make friends. You did it at once!', 'happy'),
      HZ('Fern will want to hear about this.', 'soft'),
    ],
    [
      {
        domain: 'science',
        skill: 'warm clothes keep us warm in cold weather',
        standard: 'K-ESS2-1',
        kind: 'ask',
        after: 6,
        prompt: [N('It’s snowy. Why does Gran Hazel wear three coats?')],
        options: [
          opt('To keep warm', [N('Yes! When it’s cold, more layers keep us warm.')], true),
          opt('To go swimming', [N('Brr! Not in the snow! The coats keep her warm.')]),
        ],
        parentNote: 'Talked about wearing warm layers in cold, snowy weather.',
      },
    ],
  ),
  // step 12 scene: s28-told is false
  sc(
    's28-why-untold',
    [
      N('Byte comes up the path slowly. He looks at Parcel, then at Gran Hazel.'),
      HZ('Byte. I hoped it would be you.', 'soft'),
      N('Byte looks at the H on the label. Then at Gran Hazel.'),
      BY('H. H is for… Hazel!', 'shock'),
      BY('I made a list of forty-one people. I crossed you off first.', 'shock'),
      BY('Missing people don’t send parcels. But I did ask Mr Grue!', 'shock'),
      N('Byte sits down on the step, all at once. Bump!'),
      BY('Why me? I just count things.'),
      HZ('You count things, love. I needed someone to count this one.', 'soft'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'words that start with the same sound',
        standard: 'RF.K.2',
        kind: 'do',
        after: 3,
        check: 'edu:say:first-sound:h',
        lines: [
          N('H is for Hazel. Huh, huh, Hazel!'),
          N('Can you think of another H word? Hat? House? Hug?'),
        ],
        parentNote: 'Said words that begin with the “h” sound.',
      },
    ],
  ),
  // step 13 done: by s28-offer
  sc(
    's28-grue-back-weed',
    [
      N('Pixel fixes the watch. Tick, tick, tick! It works better than before.'),
      N('Knock, knock. It’s Mr Grue, holding a kitchen chair.'),
      GR('I’ve come for the marmalade. Not the party.', 'angry'),
      GR('Your chairs are too low. I brought my own.', 'think'),
      GR('You weeded round my tree as if it mattered.', 'soft'),
      N('Parcel bows to Mr Grue, very low. That is Parcel’s way of saying sorry.'),
      N('Mr Grue gets his watch back. He moves his chair to the front.'),
    ],
    [thanksBeat(6)],
  ),
  sc(
    's28-grue-back-stare',
    [
      N('Pixel fixes the watch. Tick, tick, tick! It works better than before.'),
      N('Knock, knock. It’s Mr Grue. He hasn’t brought anything.'),
      GR('I’ve come for the marmalade. Not the party.', 'angry'),
      N('Parcel bows to Mr Grue, very low. That is Parcel’s way of saying sorry.'),
      N('Mr Grue gets his watch back. He listens to it tick, and says nothing.'),
      N('But he stays to the end. He helps put the flags back up.'),
    ],
    [thanksBeat(5)],
  ),
  // complete: by s28-column
  sc(
    's28-complete-unverified',
    [
      ...LOG_OPEN,
      BY('Not sure yet: Kind to Moss. Shares on purpose.', 'think'),
      BY('We missed it when it ran off.', 'think'),
      N('Then Byte crosses out NOT SURE YET. Once, twice, three times.'),
      BY('There. I’m sure now. I’m sure about all of it.', 'soft'),
      ...GIFTS,
    ],
    [
      {
        domain: 'maths',
        skill: 'count to 3',
        standard: 'K.CC.B.4',
        kind: 'do',
        after: 5,
        check: 'edu:count:crossings:3',
        lines: [
          N('Draw a line in the air with Byte, for each one he crosses out.'),
          N('One, two, three! Three crossings-out.'),
        ],
        parentNote: 'Counted three actions, one number for each.',
      },
      plantBeat(10),
    ],
  ),
  sc(
    's28-complete-none',
    [
      ...LOG_OPEN,
      N('Byte reads three pages of oops. Then he stops.'),
      N('He draws a new column, right there. GOOD THINGS.'),
      BY('It needed one. I just didn’t know what to call it.', 'soft'),
      ...GIFTS,
    ],
    [
      {
        domain: 'sel',
        skill: 'noticing good things',
        standard: 'CASEL: Self-awareness',
        kind: 'do',
        after: 5,
        check: 'edu:say:good-thing:today',
        lines: [
          N('Byte is noticing good things. You can too.'),
          N('(Ask: what was one good thing today?)'),
        ],
        parentNote: 'Named one good thing from their own day.',
      },
      plantBeat(9),
    ],
  ),
  // not a played scene: Byte's idle lines after s28Done
  sc(
    's28-byte-barks',
    [
      BY('Parcel bowed to the gatepost. I bowed back. Shh!'),
      BY('I don’t time Parcel’s naps any more. Roughly is fine.'),
      BY('Mr Grue meant to say hello. I could tell.'),
      BY('Marmalade? Every batch is the good batch.'),
      BY('Parcel shared breakfast with a robin. Then the robin brought friends!', 'happy'),
    ],
    [
      {
        domain: 'sel',
        skill: 'some good things can’t be counted',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 4,
        lines: [
          N('Byte still loves counting. But some good things, like friends, can’t be counted.'),
        ],
        parentNote: 'Heard that some of the best things, like friendship, can’t be measured.',
      },
    ],
  ),
];

// ================================================================== the quest
const S28: EduQuest = {
  id: 'sprout:s28',
  of: 's28',
  band: 'sprout',
  title: 'A Nubbin with a Label',
  goals: {
    's28-step1': {
      goal: 'Take the little Nubbin to Byte’s house.',
      hint: 'Walk slowly. It will follow you. Byte’s house has a very straight hedge.',
    },
    's28-step2': {
      goal: 'Bring Gran Hazel’s orange jars to Byte’s house.',
      hint: 'The jars are on the top shelf in Gran Hazel’s pantry.',
    },
    's28-step3': {
      goal: 'Help with the bath, and then mop up the water!',
      hint: 'Mop from the bathroom to the front door.',
    },
    's28-step4': {
      goal: 'Go to Byte’s house when Mr Grue comes round.',
      hint: 'Go in the morning. Just watch.',
    },
    's28-step5': {
      goal: 'Follow Parcel and its half sandwich.',
      hint: 'Walk behind Parcel. It likes to lead the way to the low wall.',
    },
    's28-step6': {
      goal: 'See Parcel meet Null.',
      hint: 'Null is at Byte’s house. Sit and watch.',
    },
    's28-step7': {
      goal: 'Go to the market and keep an eye on Parcel.',
      hint: 'Follow the clinking noise across the square.',
    },
    's28-step8': {
      goal: 'Find Parcel. It wasn’t in its basket at bedtime.',
      hint: 'Look for a light next door, in Mr Grue’s glasshouse.',
    },
    's28-step9': {
      goal: 'Make marmalade with Byte and Parcel.',
      hint: 'Use the thermometer or the cold saucer. Both work!',
    },
    's28-step10': {
      goal: 'Find Parcel in the snow.',
      hint: 'Follow the little footprints down the lane.',
    },
    's28-step11': {
      goal: 'Walk with Parcel up to Gran Hazel’s cottage.',
      hint: 'Parcel is going to the bench by the door.',
    },
    's28-step12': {
      goal: 'Stay with Byte while he talks to Gran Hazel.',
      hint: 'Sit on the step. There’s no hurry.',
    },
    's28-step13': {
      goal: 'Help Pixel put Mr Grue’s watch back together.',
      hint: 'Find every piece, then take them to Pixel.',
    },
  },
  scenes: SCENES,
  notes:
    'Lessons: label and address (ELOF: Literacy, D2.Geo.2.K-2); first sounds and syllables (RF.K.2); counting to 6, 9, 10 ' +
    'and 11 (K.CC.B.5, K.CC.A.1, K.CC.B.4); sorting (K.MD.B.3); longer and shorter (K.MD.A.2); eleven o’clock; soaking ' +
    'up water, hot and cold, sunshine in a glasshouse, seed to tree, warm layers, what plants need; sorry and thank you, ' +
    'feeling cross, sharing, fairness to animals, a kind friend when scared, quiet company; children who travelled with ' +
    'labels and were welcomed (D2.His.2.K-2). No choice is dropped.',
};

// ================================================================== exports
export const EDU_S28_SPROUT: EduQuest[] = [S28];

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  'edu:clap:syllables:marmalade',
  'edu:count:jars:6',
  'edu:count:seconds:11',
  'edu:sort:log:good-oops',
  'edu:count:jars:10',
  'edu:count:jars:9',
  'edu:count:watch-pieces:11',
  'edu:show:longer:good-list',
  'edu:say:first-sound:h',
  'edu:count:crossings:3',
  'edu:say:good-thing:today',
];
