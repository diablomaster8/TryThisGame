/**
 * The Learning Grove, reader band (ages 7–10): S31 The Great Gourd.
 *
 * Source: side-stories-s31.ts. One EduScene per original scene (every step scene, every done
 * scene, the complete scene and all 17 variants, the ambient lines included), id
 * `reader:<original id>`. Every choice keeps its original id and `set`. See EDU-STYLE.md.
 *
 * What it teaches (the outline’s Learning Grove angle):
 *   - how gourds and squashes grow (one plant family, pollination by bees) and why frost ends the
 *     season (ice crystals break the leaves of tender plants);
 *   - being a good friend to someone who believes something you don’t (think questions);
 *   - waiting, and how long a night is (time intervals: dusk to four in the morning);
 *   - before pumpkins, children in Scotland and Ireland carved turnips into lanterns;
 *   - plus basalt and granite, frost and sinking cold air, owls, symmetry, similes, floating apples,
 *     and some measuring and sums.
 *
 * - The three lifted lines (the creed, Ned’s line about his bag, Tam’s line about Nettie) never
 *   appear; every line is original.
 * - Hazel’s third rule is named once, in the `sat` choice of reader:s31-long-grass (canon 14).
 * - Nubbins and animals never speak. Sable is narrated only. Wisp’s ear is torn.
 * - Facts are well established: the gourd family (pumpkins, squashes, courgettes, cucumbers, melons);
 *   separate male and female squash flowers; frost below 0 °C on clear, still nights; basalt from
 *   fast-cooled lava (the Giant’s Causeway); granite cooled slowly underground; apples float; owls’
 *   soft-edged feathers; acorns buried by jays and squirrels.
 */
import type { EduQuest, EduScene, Lesson, GlossaryEntry } from './types';
import type { Line, Choice } from '../config/story';

type Mood = NonNullable<Line['mood']>;

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const Y = say('you');
const MOSS = say('moss');
const FERN = say('fern');
const SPARKS = say('sparks');
const CLOVER = say('clover');
const TAM = say('s31-tam');
const IVY = say('s31-ivy');
const NED = say('s31-ned');
const NETTIE = say('s31-nettie');

// ---------------------------------------------------------------- builders
type LessonIn = Omit<Lesson, 'id'>;

/** Builds `reader:<of>` and numbers its lessons `reader:<of>-l1`, `-l2`. */
const scene = (of: string, lines: Line[], lessons: LessonIn[], choices?: Choice[]): EduScene => {
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

const gloss = (word: string, meaning: string, of: string): GlossaryEntry => ({ word, meaning, scene: `reader:${of}` });

/** A think question: every answer is honoured, none is marked best. */
const think = (label: string, reply: Line[]) => ({ label, reply });

// ---------------------------------------------------------------- shared lines
const MORNING = N('Next morning, Tam is down at the long grass before anyone else is up. By the foot of his sign, someone has left something.');
const KEEPSAKES: Line[] = [
  N('Sparks won’t take the goggles back. She says they’ve seen action now, and it would be wrong.'),
  N('Your gourd lantern goes on the wall by the gate, where it can be seen from the air.'),
];
const IVY_ARRIVES = N('At four o’clock exactly, a lantern comes bobbing down the lane, grumbling.');
const FAINT = N('Tam takes one look, says “Oh,” very politely, and faints clean away.');

const FROST_ENDS_SEASON = (after: number): LessonIn => ({
  domain: 'science',
  skill: 'why frost ends the gourd season',
  standard: '3-LS4-3',
  kind: 'notice',
  after,
  lines: [
    N('Fern’s gourd vines will be black and limp by lunchtime. Frost is the end of their year.'),
    N('Squash plants are tender. When the water inside their leaves freezes, sharp ice crystals break the leaves apart.'),
    N('That’s why growers pick every gourd before the first frost. Hardier plants, like kale, can survive it.'),
  ],
  parentNote: 'Learned why frost kills tender plants like squashes, and why gourds are picked before it comes.',
});

const ROCKS_WEIGH = (after: number): LessonIn => ({
  domain: 'maths',
  skill: 'multiply and convert grams to kilograms',
  standard: '4.MD.A.2',
  kind: 'ask',
  after,
  prompt: [NED('Each rock weighs about 200 grams. I’ve got five. How heavy is my bag?', 'sad')],
  options: [
    { label: '1 kilogram', best: true, reply: [N('Yes. 5 × 200 g = 1,000 g, and 1,000 grams is 1 kilogram. A whole bag of sugar, in rocks.')] },
    { label: '205 grams', reply: [N('That adds 5 and 200. But there are five rocks of 200 g each: 5 × 200 = 1,000 g, which is 1 kilogram.')] },
    { label: '100 grams', reply: [N('Lighter than one rock! Five rocks of 200 g make 1,000 g. That’s 1 kilogram.')] },
  ],
  parentNote: 'Multiplied 5 × 200 g and converted 1,000 grams to 1 kilogram.',
});

// ================================================================== the scenes
const SCENES: EduScene[] = [
  // ------------------------------------------------ 1. The Letter
  scene(
    's31-wall',
    [
      N('The plums have gone soft, and the wind smells of bonfires two gardens away. Autumn is coming in at the edges.'),
      N('A small boy is sitting on your Grove wall, wrapped in a patchwork quilt, writing very hard with his tongue out.'),
      N('The quilt goes right down to his boots. Some of its patches have patches.'),
      TAM('Don’t look. It’s private. …You can look a bit. I need a speller.', 'think'),
      TAM('I’m Tam. I live in the lane. I’m seven, and I’m writing to the Great Gourd.'),
      Y('The what?'),
      TAM('Every Gourd Night he rises out of the most sincere gourd patch in the valley and flies over, bringing toys.', 'happy'),
      TAM('Not the biggest patch. Not the tidiest. The most sincere one. He can tell.'),
      TAM('Nobody else believes in him. That’s all right. He only needs one patch.'),
      N('He holds out the letter. It begins DEAR GRAET GORD, and it has been rubbed out so hard in three places that there are holes.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'homophones: words that sound the same but are spelt differently',
        standard: 'L.3.4',
        kind: 'ask',
        after: 9,
        prompt: [TAM('GRAET looks wrong. Is it GREAT or GRATE? They sound exactly the same.', 'think')],
        options: [
          { label: 'GREAT, meaning very big or very good', best: true, reply: [TAM('GREAT. Because he is. GREAT and GRATE are homophones. A grate is the metal bit in a fireplace. He’s not that.', 'happy')] },
          { label: 'GRATE', reply: [N('Good ear: they are homophones, words that sound the same. But a grate is in a fireplace, and to grate cheese is to shred it.'), N('For “very big and important” it’s GREAT.')] },
        ],
        parentNote: 'Told apart the homophones “great” and “grate” by their meanings.',
      },
    ],
  ),
  scene(
    's31-letter',
    [
      N('Between you, GRAET becomes GREAT. Tam keeps GORD for a while on principle, then gives it up.'),
      TAM('Now the important bit. What to ask for. You choose. He might take a grown-up more seriously.', 'think'),
    ],
    [
      {
        domain: 'sel',
        skill: 'thinking about other people’s needs when you ask for something',
        standard: 'CASEL: Social awareness',
        kind: 'notice',
        after: 1,
        lines: [
          N('A letter like this is a chance to think about who needs what. Yourself, someone hungry, or even the one you’re writing to.'),
          N('None of these is wrong. Each one shows a different kind of kindness.'),
        ],
        parentNote: 'Thought about whose needs a request could serve: your own, others’, or the reader’s.',
      },
    ],
    [
      {
        id: 'toys',
        label: 'Toys. It’s what he brings. Ask for toys.',
        set: { 's31-letter': 'toys' },
        then: [Y('Ask for toys. He’s bringing them anyway.'), TAM('Toys. Yes. Not greedy ones. Medium toys.', 'happy'), N('He writes A MEDIUM AMOUNT OF TOYS PLEASE, and underlines PLEASE twice.')],
      },
      {
        id: 'strays',
        label: 'Something for the strays in the Hollow.',
        set: { 's31-letter': 'strays' },
        then: [
          TAM('The strays?'),
          Y('The ones past the falls. Nobody brings them anything.'),
          TAM('He’d like that. He’s flying over anyway.', 'soft'),
          N('He writes SOMETHING FOR THE STRAYS IN THE HOLLOW. Then, smaller: THEY ARE NOT GREEDY.'),
        ],
      },
      {
        id: 'busy',
        label: 'Tell him, very politely, that he needn’t come if he’s busy.',
        set: { 's31-letter': 'busy' },
        then: [
          TAM('Not come?', 'shock'),
          Y('Very politely. In case he’s busy. It’s a long night.'),
          TAM('…That’s very thoughtful. Nobody ever thinks he might be tired.', 'think'),
          N('He writes YOU NEEDN’T COME IF YOU ARE BUSY, WE WILL UNDERSTAND. Then, after a long think: MOSTLY.'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ 2. Three Things
  scene(
    's31-creed',
    [
      N('Tam folds the letter into four and posts it down the front of his quilt, for safekeeping.'),
      N('Two more children come down the lane: a girl with a straight fringe and a clipboard, and a boy with a round, worried face.'),
      IVY('Tam. Are you writing to that pumpkin again?', 'angry'),
      TAM('Gourd. He’s a gourd. A pumpkin is only one kind of gourd. Fern told me.'),
      IVY('This is my brother. I’m Ivy. I’m ten, and I’m sorry about him in advance.'),
      NED('I’m Ned. Hello. Is it true he flies? Ivy says it isn’t. I’m only asking.', 'think'),
      N('Ivy laughs. Ned laughs too, a beat late because Ivy is, and then looks as if he wishes he hadn’t.'),
      N('Tam draws himself up, quilt and all, to very nearly the height of the gatepost.'),
      TAM('Some things I don’t argue about with anybody. The Great Gourd is the top one, and the second, and the third.'),
      NETTIE('I believe him. I’m Nettie. I’m six. I believe everything Tam says.', 'happy'),
      IVY('You believed the hens could read. Come on. Mum wants the biggest gourd in Fern’s patch, and Tam’s carrying it.'),
    ],
    [
      {
        domain: 'science',
        skill: 'pumpkins belong to the gourd family of plants',
                kind: 'notice',
        after: 3,
        lines: [
          N('Tam is right about this bit. Pumpkins, squashes, courgettes, cucumbers and melons all belong to one plant family.'),
          N('Gardeners often call the hard-shelled, knobbly ones gourds. They are cousins: alike, but not the same.'),
        ],
        parentNote: 'Learned that pumpkins, squashes, cucumbers and melons belong to one plant family, with variety inside it.',
      },
      {
        domain: 'sel',
        skill: 'being a good friend to someone who believes something you don’t',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 9,
        prompt: [N('Think: Ivy laughed. Nettie believed. Ned wasn’t sure. What would you have done, standing there?')],
        options: [
          think('Asked Tam more about the Great Gourd.', [N('That’s generous. Asking questions shows you take someone seriously, even if you end up disagreeing.')]),
          think('Said kindly that I don’t believe it, but I’d help with the letter anyway.', [N('That’s honest and kind at once. You don’t have to agree with a friend to stand by them.')]),
          think('Kept quiet, like Ned.', [N('That’s fair. Sometimes you need time to make up your mind. Not laughing is already a kindness.')]),
        ],
        parentNote: 'Thought about how to be kind and honest with someone who believes something you don’t.',
      },
    ],
  ),
  scene(
    's31-patch',
    [
      N('Fern’s gourd patch is vines going in every direction at once. The gourds are lumpy and leaning, and several are warty.'),
      FERN('Sorry. Sorry about the patch. I grow them badly on purpose. It’s a style.'),
      N('Ivy walks straight to the biggest gourd there is: orange, enormous, and the shape of a sat-on cushion.'),
      IVY('That one. Tam, lift.'),
      TAM('It’s bigger than me.'),
      IVY('Then you’ll have to be bigger than it. Go on.'),
    ],
    [
      {
        domain: 'science',
        skill: 'how gourds grow: flowers, pollination by bees, fruit',
        standard: '2-LS2-2',
        kind: 'notice',
        after: 1,
        lines: [
          FERN('Each plant starts from one seed in late spring. By summer the vines are everywhere, covered in big yellow flowers.'),
          FERN('Some flowers make pollen. Others have a tiny gourd at the bottom, no bigger than a thumb.'),
          FERN('Bees carry pollen from one kind of flower to the other. Only then does the tiny gourd swell up and grow.'),
        ],
        parentNote: 'Learned how bees pollinate squash flowers so the fruit can grow.',
      },
      {
        domain: 'maths',
        skill: 'compare lengths by subtracting',
        standard: '2.OA.A.1',
        kind: 'ask',
        after: 4,
        prompt: [N('Tam is 120 cm tall. The gourd is 50 cm tall. Is it really bigger than him? How much taller is Tam?')],
        options: [
          { label: 'Tam is 70 cm taller', best: true, reply: [N('Yes: 120 − 50 = 70. The gourd is not taller than Tam. It’s just very, very wide.')] },
          { label: 'Tam is 170 cm taller', reply: [N('That’s 120 + 50. To find the difference, take away: 120 − 50 = 70 cm.')] },
          { label: 'The gourd is taller', reply: [N('It feels that way to Tam! But 50 cm is less than 120 cm. Tam is 70 cm taller.')] },
        ],
        parentNote: 'Found the difference between two heights by subtracting (120 − 50).',
      },
    ],
  ),
  // ------------------------------------------------ 3. The Biggest One
  scene(
    's31-carve',
    [
      N('Tam carries the gourd all the way up the lane, very slowly, like a man carrying a sleeping relative.'),
      N('At the cottage step, Ivy fetches a big knife, and Mum comes out to keep an eye on it.'),
      TAM('What’s that for?'),
      IVY('It’s nearly Gourd Night. You carve them. Everyone carves them. You put a candle in.'),
      N('She cuts the top off in one go. Tam makes a noise like a kettle.'),
      TAM('Nobody told me. Nobody TOLD me you cut them.', 'shock'),
      IVY('It’s a gourd, Tam. It hasn’t got relatives. It’s got seeds.'),
      N('She carves a face with jagged teeth and one eyebrow higher than the other. It looks a lot like Ivy.'),
      N('Tam sits on the step with his quilt over his head. Nettie sits beside him with a tea towel over hers, to be fair.'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'the history of carved lanterns: turnips before pumpkins',
        standard: 'D2.His.2.K-2',
        kind: 'notice',
        after: 3,
        lines: [
          N('Carving lanterns is an old custom. Long ago, in Scotland and Ireland, children carved them from turnips, not pumpkins.'),
          N('A turnip is small and very hard. Hollowing one out took a long time, and the faces came out wonky.'),
          N('When families from Scotland and Ireland moved to North America, they found pumpkins: bigger, softer and much easier to carve.'),
        ],
        parentNote: 'Learned that lanterns were once carved from turnips in Scotland and Ireland, before pumpkins.',
      },
    ],
  ),
  scene(
    's31-kinder',
    [
      N('The gourd you choose is the most lopsided one in Fern’s patch. You carve it slowly, on the step beside the quilt.'),
      N('Round eyes, no teeth, and a mouth that is mostly thinking about smiling.'),
      N('After a while, one corner of the quilt lifts.'),
      TAM('…That one’s kind. He won’t mind that one.', 'soft'),
      TAM('You keep it. Put it somewhere he’ll see it from the air.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'lines of symmetry',
        standard: '4.G.A.3',
        kind: 'ask',
        after: 1,
        prompt: [
          N('Your face has a line of symmetry straight down the middle: the left half matches the right half.'),
          N('Ivy’s gourd has one eyebrow higher than the other. Does it have a line of symmetry?'),
        ],
        options: [
          { label: 'No, the two halves don’t match', best: true, reply: [N('Right. Fold it down the middle and the eyebrows wouldn’t line up. Lopsided on purpose, like Ivy.')] },
          { label: 'Yes, down the middle', reply: [N('Try folding it in your head. One eyebrow is higher, so the halves don’t match. No line of symmetry.')] },
        ],
        parentNote: 'Checked two carved faces for a line of symmetry.',
      },
    ],
  ),
  // ------------------------------------------------ 4. The Ball
  scene(
    's31-ball',
    [
      N('Next morning, on the green at the end of the lane, Ivy is holding a ball upright on the grass with one finger.'),
      IVY('Ned. I’ll hold it. You run up and kick it. I won’t pull it away.'),
      NED('You pulled it away last time.', 'think'),
      IVY('That was last time. This time I’ve written it down.'),
      N('She holds out the clipboard: I PROMISE NOT TO PULL THE BALL AWAY, SIGNED IVY. Underneath is a line marked WITNESS.'),
      NED('Will you witness it? Please. A grown-up. Then it counts.', 'soft'),
    ],
    [
      {
        domain: 'sel',
        skill: 'trust and broken promises',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 5,
        prompt: [N('Think: Ivy has broken this promise before. Should Ned trust her again?')],
        options: [
          think('Yes. People can change, and he should give her a chance.', [N('That’s a hopeful answer. Giving second chances is how trust gets rebuilt.')]),
          think('No. She’s shown what she does.', [N('That’s fair. Trust is earned by what people do, not by what they write down.')]),
          think('Maybe, but he should watch carefully.', [N('A wise middle path: hope for the best, and keep your eyes open.')]),
        ],
        parentNote: 'Thought about when it makes sense to trust someone who has broken a promise before.',
      },
    ],
    [
      {
        id: 'sign',
        label: 'Sign as witness.',
        then: [N('You sign. Ned looks at your name on the line as if it were a bridge over a river.'), NED('Right. Right. This is it.', 'happy')],
      },
      {
        id: 'warn',
        label: 'Sign, and tell Ned quietly to watch her finger.',
        then: [N('You sign, and tell Ned quietly to watch her finger.'), NED('I will. I’ll watch it the whole way.', 'think'), IVY('Witnesses aren’t allowed to coach.')],
      },
      {
        id: 'dont',
        label: 'Don’t sign. Tell Ned not to do it.',
        then: [Y('Don’t do it, Ned.'), NED('But she’s written it down.', 'sad'), N('He signs the witness line himself, in very small letters, and backs off for his run-up.')],
      },
    ],
  ),
  scene(
    's31-kick',
    [
      N('Ned runs with everything he has. At the very last moment Ivy lifts her finger, and the ball rolls gently away.'),
      N('Ned kicks the air, goes up, and comes down flat on his back with a sound like a dropped sack.'),
      NED('…You promised. It was witnessed.', 'sad'),
      IVY('By a biased party. Look at them. They’re obviously on your side. It doesn’t count.'),
      N('She tucks the clipboard under her arm and walks off.'),
      N('Ned lies on the grass and looks at the sky, which at least stays put.'),
    ],
    [
      {
        domain: 'science',
        skill: 'unbalanced forces: a kick that meets nothing',
        standard: '3-PS2-1',
        kind: 'notice',
        after: 1,
        lines: [
          N('A kick is a push. When Ned’s foot hits the ball, the ball pushes back and slows his leg down.'),
          N('With no ball there, nothing balances that push. His leg keeps swinging up, and the rest of Ned goes with it.'),
        ],
        parentNote: 'Learned that a push with nothing to push against is an unbalanced force that keeps things moving.',
      },
    ],
  ),
  // ------------------------------------------------ 5. Two Lists
  scene(
    's31-lists',
    [
      N('Ned is still on the green when you come back past. He is holding a card cut in the shape of a cog.'),
      NED('Sparks asked me to her Gourd Night party. Me. On a card.', 'happy'),
      IVY('Sparks keeps two lists. Everybody knows. One of who to ask, and one of who not to ask.'),
      IVY('She’ll have muddled them up. You’re on the wrong one. I’m only saying it to help.'),
      N('Ned looks at the card. The card looks back, cheerfully, being a cog.'),
      NED('I didn’t think it was a mistake. I thought it was a card.', 'sad'),
      TAM('Ask her. That’s what you do. You ask.'),
      NED('I can’t ask. What if she says?'),
      N('He holds the card out to you very carefully, as if it might go off.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'characters’ motives; telling a rumour from a fact',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 5,
        prompt: [N('“Everybody knows” is what people say about a rumour. Why might Ivy be telling Ned this?')],
        options: [
          { label: 'She likes being the one who knows things, and teasing Ned', best: true, reply: [N('That fits Ivy. A rumour can make the teller feel important. The way to check is to ask the person it’s about.')] },
          { label: 'She has seen both lists', reply: [N('Has she? She doesn’t show them. When someone says “everybody knows” without proof, it’s worth checking.')] },
          { label: 'She really wants to help', reply: [N('She says so. But the card is real, and the lists aren’t shown. Checking with Sparks is the fair test.')] },
        ],
        parentNote: 'Thought about Ivy’s motive and how to check a rumour against the facts.',
      },
    ],
  ),
  scene(
    's31-everybody',
    [
      N('Sparks is up a ladder with a string of bulbs in her teeth. She takes them out to hear the question, and goes red.'),
      SPARKS('TWO LISTS? Who said two lists? There’s one list. ONE.', 'shock'),
      N('She points at her workshop door, where it is chalked in letters a foot high: GOURD NIGHT, EVERYBODY.'),
      SPARKS('I wrote it on the door so I couldn’t lose it. Tell Ned. No, I’ll tell Ned. NED!', 'happy'),
      N('Down the lane, a small figure on the green sits up very fast.'),
      N('Sparks climbs back up the ladder, still muttering about lists.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'units of length: a foot is about 30 centimetres',
        standard: '4.MD.A.1',
        kind: 'notice',
        after: 2,
        lines: [
          N('A foot is an old unit of length: 12 inches, or about 30 centimetres. Roughly the length of a school ruler.'),
          N('So each chalk letter on Sparks’s door is about as tall as a ruler. You could read it from the green.'),
        ],
        parentNote: 'Learned that a foot is about 30 centimetres.',
      },
      {
        domain: 'sel',
        skill: 'including everybody',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 4,
        lines: [N('Sparks didn’t have to choose who to leave out. She decided once, and wrote it where everyone could see.')],
        parentNote: 'Noticed how Sparks makes sure nobody is left out.',
      },
    ],
  ),
  // ------------------------------------------------ 6. The Most Sincere Patch
  scene(
    's31-sincere',
    [
      N('Tam has been all round the valley looking at gourd patches. He comes back with his quilt full of burrs and his mind made up.'),
      N('He walks past three lantern posts, lit and neat, and stops at the fourth.'),
      N('The fourth post stands dark at the edge of the long grass. There isn’t a gourd anywhere near it.'),
      TAM('This one.'),
      Y('There aren’t any gourds here.'),
      TAM('No. But it isn’t pretending. Everywhere else is tidy, for people. This one’s just itself.', 'think'),
      N('His sign is painted on the back of a tea tray: WELCOME GREAT GOURD. The R is backwards, on purpose, for luck.'),
      N('He also has a toffee apple in a hanky, for the Great Gourd, in case he’s hungry from flying.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'gaps between posts: multiplication word problem',
        standard: '3.OA.A.3',
        kind: 'ask',
        after: 2,
        prompt: [N('The lantern posts stand 15 metres apart. How far is it from the first post to the fourth?')],
        options: [
          { label: '45 metres', best: true, reply: [N('Yes. Four posts have only three gaps between them: 3 × 15 = 45 metres.')] },
          { label: '60 metres', reply: [N('That’s 4 × 15. But count the gaps, not the posts: four posts have three gaps. 3 × 15 = 45 metres.')] },
          { label: '19 metres', reply: [N('That adds 15 and 4. Each gap is 15 metres, and there are three gaps: 3 × 15 = 45 metres.')] },
        ],
        parentNote: 'Worked out that four posts have three gaps, so 3 × 15 = 45 metres.',
      },
    ],
  ),
  scene(
    's31-moss',
    [
      N('You knock the sign in by the dark post. Tam sets the toffee apple on top and looks at it all the way people look at cathedrals.'),
      N('Moss comes past along the hill path, slowly, the grass hardly bending under him. He stops to read the sign.'),
      TAM('Moss. You’re very old. Is the Great Gourd real?'),
      MOSS('I have never seen it. Then again, there are a great many real things I have never seen.', 'think'),
      N('Tam nods slowly, as if that settles it in his favour. Moss goes on up the hill, and you think he might be smiling.'),
      N('Then Clover comes over the stile with three folded blankets, puts them down by the sign, and turns straight round.'),
      CLOVER('I’m not discussing it. Three. One each and a spare. Don’t look at me like that.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'thinking about a character’s words and the story’s theme',
        standard: 'RL.4.2',
        kind: 'ask',
        after: 4,
        prompt: [N('Think: Moss didn’t say yes and didn’t say no. Can something be real if you’ve never seen it?')],
        options: [
          think('Yes. I’ve never seen the wind, only what it moves.', [N('A good example. Air, sound and magnetism are real, and we only notice what they do.')]),
          think('Maybe. But you’d want some kind of sign.', [N('That’s how scientists think: look for evidence. Tam thinks so too; that’s why he’s waiting to see.')]),
          think('No. If nobody has ever seen it, it probably isn’t there.', [N('That’s a careful answer. Moss would probably smile at it, and still leave Tam his hope.')]),
        ],
        parentNote: 'Thought about evidence, belief, and why Moss answered the way he did.',
      },
    ],
  ),
  // ------------------------------------------------ 7. Ghosts
  scene(
    's31-dusk',
    [
      N('Gourd Night. The sun goes down orange behind the hill, and all down the lane the gourds light up on the steps, one by one.'),
      N('Ivy comes out in a pointed hat and a black cloak, with a broom she is clearly going to hit people with.'),
      IVY('I’m a witch. A costume should be the opposite of your personality. Everyone knows that.'),
      N('Ned is a ghost. His sheet has so many eyeholes that it is more hole than sheet.'),
      NED('I had some trouble with the scissors. I can see really well, though.', 'happy'),
      N('Sparks runs down the lane with a pair of old welding goggles and a long red scarf, and drops them in your arms.'),
      SPARKS('For your Nubbin! Every Gourd Night needs a flying ace. I wore those for twelve years.', 'happy'),
      N('Tam is already in the long grass in his quilt, sitting very straight beside his sign. Nettie sits beside him, holding his hand.'),
    ],
    [
      {
        domain: 'science',
        skill: 'why autumn nights grow longer: the Earth’s tilt',
        standard: '1-ESS1-2',
        kind: 'notice',
        after: 0,
        lines: [
          N('Every evening this autumn the sun has set a little earlier. The nights are growing longer.'),
          N('The Earth is tilted. From midsummer to midwinter, our half of the Earth leans further away from the Sun.'),
          N('So the Sun takes a lower, shorter path across our sky, and the days shrink until midwinter.'),
        ],
        parentNote: 'Learned that the Earth’s tilt makes autumn days shorter and nights longer.',
      },
    ],
  ),
  scene(
    's31-ace',
    [
      N('The goggles go on top. The scarf goes round twice and still trails on the ground.'),
      N('Your Nubbin looks up at the darkening sky, very slowly, as if it has a score to settle with it.'),
      N('It is a flying ace now: the best pilot in the sky, at least in its own head.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'meaning of a new phrase from context',
        standard: 'L.2.4',
        kind: 'notice',
        after: 2,
        lines: [N('A flying ace is a pilot who is very, very skilled. People also say “ace” for anyone brilliant at something.')],
        parentNote: 'Learned the phrase “flying ace” and the word “ace”.',
      },
    ],
  ),
  // ------------------------------------------------ 8. The Long Grass
  scene(
    's31-long-grass',
    [
      N('The guisers stop at the edge of the long grass on their way out: a witch, a ghost mostly made of holes, and three small bats.'),
      IVY('Tam. You’re going to sit in a field all night, in the cold, for a pumpkin.'),
      TAM('Gourd. And it’s a patch, not a field.'),
      NED('You could come guising. There are toffee apples. You could come back after.', 'soft'),
      TAM('If I’m not here when he rises, he’ll think nobody meant it. I mean it.'),
      N('Nettie looks at the guisers, and at the bag in Ivy’s hand. Then she sits back down, firmly, next to Tam.'),
      NETTIE('I’m staying. I mean it too. I think.'),
      IVY('Fine. I’m fetching you both at four. I’ve told Mum. I’ve told Clover. Clover’s told everyone.'),
      N('Up the lane, Clover’s window has a lamp in it. It stays lit all night.'),
      IVY('Keeper. I need a grown-up for the lane. Some of the bats are very small.'),
      SPARKS('KEEPER! PARTY! You’re on the list! Everyone is!', 'happy'),
      N('Tam doesn’t ask you anything. He just looks at the dark post, and waits.'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'a Scottish autumn custom: guising',
        standard: 'D2.His.2.K-2',
        kind: 'notice',
        after: 3,
        lines: [
          N('Guising is an old Scottish custom. Children dress up, go door to door, and do a party piece, like a joke or a poem.'),
          N('In return they are given treats: nuts, fruit, toffee. The costume is a disguise, which is where the name comes from.'),
        ],
        parentNote: 'Learned about guising, an old Scottish custom of costumes and party pieces.',
      },
      {
        domain: 'sel',
        skill: 'choosing between good things; responsibility to others',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 11,
        prompt: [N('Think: Ivy needs help, Sparks wants you, and Tam is waiting. Who needs you most tonight?')],
        options: [
          think('The small bats. Children in the lane at night need a grown-up.', [N('That’s responsible. Keeping little ones safe is a real job.')]),
          think('Sparks. I said I’d go, and keeping your word matters.', [N('That’s fair. Showing up when you’ve said you would is a kind of loyalty.')]),
          think('Tam. He’s the one nobody else is staying for.', [N('That’s kind. Sometimes the person who needs you most is the one who won’t ask.')]),
        ],
        parentNote: 'Weighed three good reasons and thought about who needed them most.',
      },
    ],
    [
      {
        id: 'guise',
        label: 'Go guising with Ivy. Somebody has to mind the bats.',
        set: { 's31-night': 'guise' },
        then: [
          N('You take the smallest bat’s hand. It is sticky already.'),
          TAM('Go on. When he comes, I’ll tell him you were busy. He’ll understand. Probably.'),
          N('From the lane you look back once: two small shapes in the long grass, a sign, and the dark post.'),
        ],
      },
      {
        id: 'party',
        label: 'Go to Sparks’s party. You did say you would.',
        set: { 's31-night': 'party' },
        then: [
          SPARKS('YES! The Keeper’s coming! Pixel, play something faster!', 'happy'),
          TAM('Bring Nettie a sandwich. She won’t ask. She’ll want one.'),
          N('You go up the lane towards the light. The long grass behind you gets darker as the music gets louder.'),
        ],
      },
      {
        id: 'sat',
        label: 'Sit down next to Tam and wait.',
        set: { 's31-night': 'sat' },
        then: [
          N('You sit down in the long grass beside Tam. It is wet, and it is going to stay wet.'),
          Y('My gran had a rule for this. Her third one.'),
          Y('When you don’t know what to do, sit down next to them and wait.'),
          TAM('That’s a rule? Good. I like rules.', 'happy'),
          N('Ivy looks at the three of you, opens her mouth, and shuts it again.'),
          IVY('Fine. Four o’clock.'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ 9. The rocks
  scene(
    's31-guising',
    [
      N('The lane is all lit gourds and cold noses. At every door the guisers tell a joke, and hold out their bags.'),
      N('At the first door, Ivy gets a toffee apple and the bats get nuts. Ned looks in his bag for a long moment.'),
      N('There is a rock in it.'),
      N('At the second door and the third: pennies and toffee for everyone, and for Ned, a rock. Then another rock.'),
      NED('…Maybe they’re running out of things.', 'think'),
      N('At Fern’s door there are honey cakes. Fern gives everyone a honey cake, then looks at Ned, and gives him a rock.'),
      FERN('I’m so sorry. I panicked. It seemed to be the custom.', 'shock'),
      N('At Byte’s door, Byte looks at them all and goes back in for something. He comes out with a rock with a paper label.'),
      N('Ned doesn’t look in his bag any more. He just holds it open, and waits for the clunk.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'compare totals and find the difference',
        standard: '1.OA.A.1',
        kind: 'ask',
        after: 8,
        prompt: [N('Ivy has a toffee apple, pennies, toffee and a honey cake: 4 treats. Ned has 5 rocks. Who has more things, and by how many?')],
        options: [
          { label: 'Ned, by 1', best: true, reply: [N('Yes: 5 − 4 = 1. Ned has the most things. Just not the best ones.')] },
          { label: 'Ivy, by 1', reply: [N('Count again: Ivy has 4, Ned has 5. 5 − 4 = 1, so Ned has one more. Not that it helps him.')] },
          { label: 'They have the same', reply: [N('Close! Ivy has 4 and Ned has 5. Ned has 1 more thing.')] },
        ],
        parentNote: 'Compared two totals and found the difference (5 − 4 = 1).',
      },
    ],
  ),
  scene(
    's31-rock',
    [
      N('Ned holds up the rock with the label, so you can read it. In Byte’s small square capitals: BASALT.'),
      NED('Five doors. Five rocks. I think the rocks have found me on purpose.'),
      NED('But Byte wrote what it is. Nobody ever writes down what my things are.', 'soft'),
      NED('You have it. For being the witness. I know it didn’t count.', 'soft'),
      N('It is heavy and cold and very ordinary. You put it in your pocket, and find you keep checking it’s there.'),
    ],
    [
      {
        domain: 'science',
        skill: 'basalt forms when lava cools quickly',
        standard: '2-PS1-4',
        kind: 'notice',
        after: 0,
        lines: [
          N('Basalt is a dark rock made from lava, melted rock that pours out of a volcano. It cooled fast, so its crystals are tiny.'),
          N('Melting rock and cooling it again is a change that can happen both ways, but it takes enormous heat.'),
          N('At the Giant’s Causeway in Northern Ireland, cooling basalt cracked into about 40,000 tall stone columns.'),
        ],
        parentNote: 'Learned that basalt is cooled lava, with an example from the Giant’s Causeway.',
      },
    ],
  ),
  // ------------------------------------------------ 10. The Flying Ace
  scene(
    's31-ace-roof',
    [
      N('Meanwhile, on the roof of the end cottage, a small figure in goggles and a long red scarf is playing a very serious game.'),
      N('Your Nubbin is the flying ace. It stands on the ridge tiles and stares into the dark at an enemy only it can see.'),
      N('It ducks and weaves and shakes one paw at the sky. Then something only it can hear goes wrong with its engine.'),
      N('It spins three times, slides down the slates, and drops into the water butt with a small, heroic splash.'),
      N('It climbs out, wrings its scarf out with great dignity, and looks about for cover.'),
      N('Far off across the hedges, Sparks’s workshop glows like a lighthouse on a dark sea.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'similes',
        standard: 'L.4.5',
        kind: 'ask',
        after: 5,
        prompt: [N('“The workshop glows like a lighthouse on a dark sea.” That’s a simile. Why might the writer choose a lighthouse?')],
        options: [
          { label: 'Because a lighthouse guides lost travellers home', best: true, reply: [N('Exactly. The Nubbin is “lost behind the lines”, and the workshop is the light that guides it in.')] },
          { label: 'Because the workshop is by the sea', reply: [N('It isn’t, really. A simile compares two different things. A lighthouse guides lost sailors home, like the workshop guides the Nubbin.')] },
        ],
        parentNote: 'Explained why a writer chose a particular simile.',
      },
    ],
  ),
  scene(
    's31-ace-party',
    [
      N('Your Nubbin crawls the last hedge on its belly, slips into the party between everyone’s boots, and hides in the apple-bobbing tub.'),
      N('Ivy, back from guising, puts her hands behind her back and plunges her face in for an apple. She comes up with a lick instead.'),
      IVY('Something LICKED me. Something in the TUB licked me.', 'shock'),
      N('Pixel plays old tunes on the pianola. Your Nubbin, dripping, is merry for a jig, tragic for a slow one, and merry again.'),
      N('Then it howls, once, by accident, and looks shocked at itself.'),
      N('Before anyone can say anything, it slinks out into the dark, scarf trailing.'),
    ],
    [
      {
        domain: 'science',
        skill: 'floating and sinking: why apples float',
        standard: '2-PS1-1',
        kind: 'notice',
        after: 1,
        lines: [
          N('Apple-bobbing only works because apples float. About a quarter of an apple is air, trapped between its cells.'),
          N('That makes an apple lighter than the same amount of water, so it bobs at the top. A rock, like Ned’s, would sink.'),
        ],
        parentNote: 'Learned that apples float because they contain air, and compared them with rocks, which sink.',
      },
      {
        domain: 'music',
        skill: 'tempo and mood in music',
        kind: 'notice',
        after: 3,
        lines: [N('Musicians call the speed of a tune its tempo. A quick tempo tends to sound merry; a slow one can sound sad or thoughtful.')],
        parentNote: 'Learned the word “tempo” and how speed changes the mood of music.',
      },
    ],
  ),
  // ------------------------------------------------ 11. If
  scene(
    's31-if',
    [
      N('Nearly midnight. Three lanterns burn steady across the Grove, and the fourth post stands dark over the long grass.'),
      N('The cold has come up out of the ground. Your knees have stopped being knees and become opinions.'),
      N('The spare blanket stays folded on top of the sign. Tam says it’s for the Great Gourd, in case he’s cold from flying.'),
      NETTIE('Tam. My feet have gone.', 'sad'),
      NETTIE('Tam. What if he isn’t coming?'),
      TAM('He’s coming. And when he comes, I’ll put in a good word for everybody. You. Ivy, even. The Keeper.'),
      TAM('If he comes, I’ll ask him to…', 'happy'),
      N('He stops. He heard it too.'),
      TAM('…If. I said “if”. Out loud. In the patch. He’ll have heard it.', 'sad'),
      N('He pulls the quilt up over his head. From under it comes a small sniff, and then a much bigger one.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'doubt and hope can live together',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 8,
        prompt: [N('Think: does saying “if” mean Tam has stopped believing?')],
        options: [
          think('No. You can hope for something and still be unsure.', [N('That’s wise. Hope and doubt often sit side by side, especially at midnight.')]),
          think('A bit. Part of him is starting to wonder.', [N('That’s honest. Wondering isn’t giving up. It’s just thinking out loud.')]),
          think('It means he’s tired and cold.', [N('Very true. Big feelings get bigger when we’re tired. That isn’t the same as not believing.')]),
        ],
        parentNote: 'Thought about how doubt and hope can be felt at the same time.',
      },
    ],
    [
      {
        id: 'everyone',
        label: '“Everyone says ‘if’. Even about things they’re sure of.”',
        then: [Y('Everyone says “if”, Tam. Even about things they’re sure of.'), TAM('…Even you?'), Y('Especially me.'), N('The quilt comes down as far as his eyes.')],
      },
      {
        id: 'closer',
        label: 'Say nothing. Shift a little closer.',
        then: [N('You say nothing. You shift a little closer, until your shoulder is against the quilt.'), N('After a while, the quilt leans back.')],
      },
    ],
  ),
  scene(
    's31-midnight',
    [
      N('Midnight comes and goes. Nothing rises out of the long grass except the cold.'),
      N('An owl goes over, very low, without a sound, and has a look at the sign.'),
      NETTIE('Is that him?', 'shock'),
      TAM('That’s an owl.', 'sad'),
      N('The owl lands on the third post, turns its head almost all the way round, and stares at the toffee apple.'),
      N('Then it drifts off over the hedge, still without a sound.'),
    ],
    [
      {
        domain: 'science',
        skill: 'owls’ adaptations for hunting at night',
        standard: '4-LS1-1',
        kind: 'notice',
        after: 5,
        lines: [
          N('Most owls are nocturnal: they hunt at night and rest by day.'),
          N('The edges of their wing feathers are soft and fringed, which hushes the air. That’s why it made no sound.'),
          N('Their huge eyes gather what little light there is, and their sharp ears can find a mouse moving under grass.'),
        ],
        parentNote: 'Learned how owls’ feathers, eyes and ears help them hunt at night.',
      },
    ],
  ),
  // ------------------------------------------------ 12. Something in the Grass
  scene(
    's31-frost',
    [
      N('In the small hours the frost comes, the way it has every dawn this autumn.'),
      N('It creeps out of the long grass in a long white tongue, straight for the dark post. The grass goes stiff and silver.'),
      N('Tam is awake. He has been awake all night, out of principle.'),
      N('Nettie is asleep against him with her mouth open and one boot off.'),
      TAM('Here it comes. Here he comes. That’s what the cold is. It’s him, getting near.', 'shock'),
      N('Out in the white grass, by the post, something moves.'),
    ],
    [
      {
        domain: 'science',
        skill: 'how frost forms, and why it gathers in low places',
        standard: '2-ESS2-3',
        kind: 'notice',
        after: 1,
        lines: [
          N('On a clear, still night, the ground loses its warmth to the sky. When the grass cools below 0 °C (32 °F), frost can form.'),
          N('Water vapour in the air freezes straight onto the cold blades as tiny ice crystals.'),
          N('Cold air is heavier than warm air, so it slides downhill and pools in low places. That’s why the frost creeps in like a tongue.'),
        ],
        parentNote: 'Learned how frost forms below freezing and why cold air pools in low ground.',
      },
    ],
  ),
  scene(
    's31-shape',
    [
      N('A shape rises at the edge of the white grass, where the frost hasn’t reached. Round, and goggled, and trailing a scarf.'),
      FAINT,
      N('He comes round almost at once, says he is perfectly fine, and falls fast asleep in his quilt.'),
      N('It is your Nubbin, home from the war. It climbs into your lap, still damp from the water butt, and falls asleep too.'),
      NETTIE('He does that. He fainted at a goose once. Leave him; he likes it.'),
    ],
    [
      {
        domain: 'health',
        skill: 'what fainting is and what helps',
        kind: 'notice',
        after: 2,
        lines: [
          N('A big fright can make some people faint: for a moment, not enough blood reaches the brain.'),
          N('Lying flat helps the blood get back, which is why fainters usually come round quickly. Tam is tired, cold and fine.'),
        ],
        parentNote: 'Learned simply what fainting is and that lying flat helps.',
      },
    ],
  ),
  // ------------------------------------------------ 13. Four in the Morning
  scene(
    's31-four',
    [
      IVY_ARRIVES,
      IVY('Four o’clock. I said four. Look at the state of you all.', 'angry'),
      N('She looks at Tam, asleep in his quilt, and doesn’t laugh. She hands her lantern to Nettie and lifts him, quilt and all.'),
      N('He doesn’t wake. His boots hang down, and she hitches him up and doesn’t complain once.'),
      N('She has a blanket over her arm, brought for him. On the way past, she drops it on you without looking.'),
      IVY('You look frozen. It’s very stupid, sitting out all night. I’m not saying anything nice about it.'),
      N('For Ivy, that is something nice.'),
      N('She goes off up the lane with Tam, and Nettie trots after with the lantern, yawning, very small.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'time intervals across midnight',
        standard: '3.MD.A.1',
        kind: 'ask',
        after: 1,
        prompt: [N('Tam sat down at six o’clock in the evening. It is now four o’clock in the morning. How long has he waited?')],
        options: [
          { label: '10 hours', best: true, reply: [N('Yes. Six in the evening to midnight is 6 hours, and midnight to four is 4 more. 6 + 4 = 10 hours.')] },
          { label: '2 hours', reply: [N('That’s 6 − 4. But the clock goes past midnight. Six to midnight is 6 hours, then 4 more: 10 hours.')] },
          { label: '4 hours', reply: [N('That’s just from midnight. Add the 6 hours from six o’clock to midnight: 10 hours.')] },
        ],
        parentNote: 'Worked out a time interval that crosses midnight (6 + 4 = 10 hours).',
      },
      {
        domain: 'literacy',
        skill: 'reading a character’s actions, not just her words',
        standard: 'RL.3.3',
        kind: 'notice',
        after: 6,
        lines: [N('Ivy’s words are prickly. Her actions are careful. When those two don’t match, the actions usually tell you more.')],
        parentNote: 'Noticed that Ivy’s actions show her care more than her words do.',
      },
    ],
  ),
  scene(
    's31-light',
    [
      N('Up the lane, a light goes on in the end cottage. Ivy gets Tam up the stairs, takes his boots off, and tucks him in.'),
      N('Then she walks back to her own room and shuts the door. Nobody ever hears about it from her.'),
      N('In the long grass it gets light, slowly. The frost comes off the post in a thin steam.'),
      N('Tam’s sign is still standing, WELCOME GREAT GOURD, with the R still backwards for luck.'),
    ],
    [
      {
        domain: 'science',
        skill: 'sunlight warms surfaces and melts frost',
        standard: 'K-PS3-1',
        kind: 'notice',
        after: 2,
        lines: [
          N('As the sun climbs, its light warms the post and the grass, and the ice melts.'),
          N('Some of the water evaporates, then cools again in the chilly air into a thin mist of tiny drops: that’s the steam.'),
        ],
        parentNote: 'Learned that sunlight warms surfaces and melts frost.',
      },
      FROST_ENDS_SEASON(3),
    ],
  ),
  // ------------------------------------------------ 14. Next Year
  scene(
    's31-next-year',
    [
      N('Tam sleeps until lunchtime. Then he is back on the Grove wall in his quilt, looking at the long grass, with his chin out.'),
      N('Ned is sitting beside him, with a bit of ghost sheet still tucked into his collar, trying to help.'),
      NED('I’ve done loads of silly things. I tried to kick a ball Ivy was holding. Nine times. Ten, now.', 'soft'),
      NED('So you mustn’t feel bad. About waiting in a patch all night for nothing.'),
      TAM('Silly?', 'angry'),
      TAM('He didn’t come because somebody said “if”. That’s a technical problem. That isn’t silly.', 'angry'),
      N('Along the lane, Nettie walks past the end of the wall with her nose in the air, and does not look at Tam at all.'),
      TAM('And Nettie’s crosser than anybody. She gave up a whole night of guising to sit with me.'),
      TAM('He’ll come next year. Next Gourd Night. I’ll find a patch so sincere he can’t help himself.', 'happy'),
      N('He goes on saying so for some time. Ned, who is kind, listens to all of it.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'different points of view on the same event',
        standard: 'RL.3.6',
        kind: 'ask',
        after: 9,
        prompt: [N('Think: Ned calls the night silly. Tam calls it a technical problem. What do you call it?')],
        options: [
          think('Brave. He stuck to what he believed all night.', [N('That’s a generous view, and Tam would agree with you completely.')]),
          think('A bit silly, but kind of wonderful too.', [N('Two things can be true at once. Lots of the best nights are both.')]),
          think('Sad. He waited and nothing came.', [N('That’s honest. It was sad, and he wasn’t alone in it, which helps.')]),
        ],
        parentNote: 'Compared characters’ points of view with their own.',
      },
    ],
  ),
  scene(
    's31-promise',
    [
      N('When Ned has gone home, Tam turns round on the wall, quilt and all, and looks at you.'),
      TAM('You sat. All night. Even the cold bit.'),
      TAM('Next year. Will you wait with me again?', 'soft'),
    ],
    [
      {
        domain: 'maths',
        skill: 'units of time: months and weeks in a year',
        standard: '4.MD.A.1',
        kind: 'ask',
        after: 2,
        prompt: [N('Next Gourd Night is one year away. About how many weeks is that?')],
        options: [
          { label: '52 weeks', best: true, reply: [N('Yes. A year is 12 months, 52 weeks, or 365 days. A long time to practise sitting.')] },
          { label: '12 weeks', reply: [N('12 is the number of months. A year has 52 weeks.')] },
          { label: '100 weeks', reply: [N('That’s nearly two years! One year has 52 weeks.')] },
        ],
        parentNote: 'Recalled that a year has 12 months, 52 weeks and 365 days.',
      },
    ],
    [
      {
        id: 'yes',
        label: '“Yes.”',
        then: [
          Y('Yes.'),
          TAM('Good. I’ll put you on the list. There’s only one list. It says everybody, but you’re at the top.', 'happy'),
          N('His sign stays by the long grass all winter, and nobody moves it. The frost comes to it every morning, and goes again.'),
        ],
      },
      {
        id: 'blanket',
        label: '“Yes. And I’m bringing my own blanket.”',
        then: [
          Y('Yes. And I’m bringing my own blanket.'),
          TAM('That’s fair. The spare one’s his.', 'think'),
          N('His sign stays by the long grass all winter, and nobody moves it. The frost comes to it every morning, and goes again.'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ complete (letter = toys)
  scene(
    's31-complete',
    [
      MORNING,
      N('One acorn. Just one, very round and very shiny, set exactly in front of the sign.'),
      TAM('It’s a toy. A medium toy. He read the letter.', 'happy'),
      TAM('He couldn’t come, so he sent a deposit.', 'happy'),
      N('Up on the hill, Moss is sitting very still, with the look of someone who has never in his life been near an acorn.'),
      ...KEEPSAKES,
    ],
    [
      {
        domain: 'science',
        skill: 'an acorn’s life cycle; animals spread seeds',
        standard: '3-LS1-1',
        kind: 'notice',
        after: 1,
        lines: [
          N('An acorn is an oak tree’s seed. Planted, it becomes a seedling, then a sapling, then an oak that can live for hundreds of years.'),
          N('Jays and squirrels bury acorns to eat in winter, and forget some of them. Many oak woods were planted that way.'),
        ],
        parentNote: 'Learned the oak’s life cycle and how animals help spread acorns.',
      },
    ],
  ),
];

// ================================================================== variants
export const EDU_S31_READER_VARIANTS: EduScene[] = [
  scene(
    's31-guising-sat',
    [
      N('Late in the evening a ghost comes back up the lane on its own, dragging its bag. It stops at the edge of the long grass.'),
      NED('Hello. I came to see if he’d come yet.', 'soft'),
      TAM('Not yet. He’s busy being sincere somewhere.'),
      NETTIE('What did you get? Did you get toffee? I didn’t want any. I’m only asking.', 'think'),
      N('Ned turns his bag upside down. Five rocks come out, one after another, with a sound like somebody walking on a beach.'),
      N('One of them has a little paper label tied on with string.'),
    ],
    [ROCKS_WEIGH(4)],
  ),
  scene(
    's31-guising-party',
    [
      N('Halfway through the party, the guisers come in on a gust of cold air: a witch, three bats, and a ghost made mostly of holes.'),
      N('The bats and the witch tip their bags out on Sparks’s workbench. Toffee apples, nuts, pennies, a whole honey cake.'),
      N('Ned tips his out last. Five rocks come out, one after another, and roll in among the spanners.'),
      SPARKS('Oh, Ned.', 'sad'),
      N('Pixel stops playing the pianola in the middle of a tune, out of respect.'),
      N('One of the rocks has a little paper label tied on with string.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'empathy: helping someone who feels left out',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 4,
        prompt: [N('Everyone is looking at Ned’s rocks. What could the others do that would actually help him?')],
        options: [
          { label: 'Share some treats, without making a fuss about it', best: true, reply: [N('Yes. Quiet sharing helps without making Ned feel more singled out.')] },
          { label: 'Laugh, so it feels like a joke', reply: [N('Sometimes laughing together helps, but Ned isn’t laughing. Quietly sharing treats is kinder.')] },
          { label: 'Pretend not to notice', reply: [N('That avoids embarrassing him, which is thoughtful. Sharing a few treats as well would help even more.')] },
        ],
        parentNote: 'Thought about how to help a friend who feels left out without embarrassing him.',
      },
    ],
  ),
  scene(
    's31-if-away',
    [
      N('Nearly midnight. Three lanterns burn steady across the Grove, and the fourth post stands dark over the long grass.'),
      N('Two small shapes sit beside it under a patchwork quilt and a borrowed blanket. The spare blanket stays folded on the sign.'),
      N('Along the far hedge Luna’s lantern moves slowly, as it does every night. Tonight it passes the long grass more often than usual.'),
      NETTIE('Tam. What if he isn’t coming?'),
      TAM('He’s coming. When he comes, I’ll put in a good word for everybody. The Keeper, even. Even though they went.'),
      TAM('If he comes, I’ll ask… If. I said “if”. Out loud. In the patch.', 'sad'),
      N('He pulls the quilt over his head. Nettie pats it, the way you pat a dog that has been told off.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'staying safe: grown-ups knowing where you are',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 2,
        prompt: [N('Who knows exactly where Tam and Nettie are tonight?')],
        options: [
          { label: 'Ivy, Mum, Clover and Luna', best: true, reply: [N('Right. Ivy told Mum and Clover, Clover’s lamp is lit, and Luna keeps passing. Being alone in the dark isn’t the same as being unwatched.')] },
          { label: 'Nobody', reply: [N('Look again: Ivy told Mum and Clover, and Luna’s lantern keeps passing. Lots of people know.')] },
        ],
        parentNote: 'Noticed how the grown-ups kept the children safe by knowing where they were.',
      },
    ],
  ),
  scene(
    's31-midnight-wisp',
    [
      N('Just after midnight, something thin and grey comes out of the dark under the hedge. One of its ears is torn to a fringe.'),
      N('It goes straight to the sign, takes Tam’s toffee apple off the top, hanky and all, and carries it a little way off.'),
      N('Then it sits down in full view and eats it, very loudly, with its back to them.'),
      TAM('Is that him?', 'soft'),
      NETTIE('That’s a thief.'),
      N('Wisp licks the hanky clean, thanks nobody, and goes back under the hedge.'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'fairness, need and taking',
        standard: 'D2.Civ.8.K-2',
        kind: 'ask',
        after: 5,
        prompt: [N('Think: the toffee apple was left out for someone hungry. Wisp was hungry. Was it stealing?')],
        options: [
          think('Yes. It wasn’t meant for him.', [N('That’s a fair point. Things can be meant for someone in particular.')]),
          think('No. It was left out for a hungry visitor, and he was one.', [N('A generous reading. Tam might even come round to it, one day.')]),
          think('It’s complicated. Animals don’t know our rules.', [N('True. Fairness is a human idea; Wisp only knows hungry and not hungry.')]),
        ],
        parentNote: 'Thought about fairness, need, and whether animals can steal.',
      },
    ],
  ),
  scene(
    's31-shape-sable',
    [
      N('A grey shape rises out of the white grass by the post. It comes slowly, and the frost doesn’t seem to touch it at all.'),
      FAINT,
      N('It is Sable. The frost can’t do anything more to her than it has already done.'),
      N('She looks at Tam, flat out in his quilt. Then she looks at you, for a long time.'),
      N('Then she sits down beside you, close enough to touch, and faces the dark lane with you.'),
      N('Sable says nothing. Her ears stay up.'),
      N('You don’t say anything either.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'reading body language; trust',
        standard: 'CASEL: Social awareness',
        kind: 'notice',
        after: 5,
        lines: [
          N('Animals can’t tell you how they feel, but their bodies can. Ears up and sitting close means calm and paying attention.'),
          N('Sable has chosen to sit near you. With a wary animal, that is a big thing. The kindest answer is to stay still.'),
        ],
        parentNote: 'Learned to read an animal’s body language and to respond calmly to its trust.',
      },
    ],
  ),
  scene(
    's31-shape-away',
    [
      N('A shape rises at the edge of the white grass, where the frost hasn’t reached. Round, and goggled, and trailing a scarf.'),
      FAINT,
      N('You come back down the lane with a lantern before it’s light. Tam is asleep in his quilt, and your Nubbin is asleep on top of him.'),
      NETTIE('Your Nubbin came out of the grass in its glasses, and he FAINTED, and I’ve been the only one awake for HOURS.', 'angry'),
      NETTIE('I didn’t get any toffee. I didn’t get ANYTHING. I sat in a field.', 'angry'),
    ],
    [
      {
        domain: 'sel',
        skill: 'managing big feelings: tiredness makes anger bigger',
        standard: 'CASEL: Self-management',
        kind: 'ask',
        after: 4,
        prompt: [N('Nettie is furious, cold and very tired. What would help her most right now?')],
        options: [
          { label: 'Listen, say sorry you weren’t there, and get her warm', best: true, reply: [N('Yes. Tired, cold anger needs listening and a blanket more than arguments.')] },
          { label: 'Explain why you went', reply: [N('Explaining can wait. First she needs to be heard, and warmed up.')] },
          { label: 'Tell her to calm down', reply: [N('Being told to calm down rarely works. Listening and a blanket help much more.')] },
        ],
        parentNote: 'Thought about what helps someone who is angry, tired and cold.',
      },
    ],
  ),
  scene(
    's31-four-sable',
    [
      IVY_ARRIVES,
      IVY('Four o’clock. I said four. Look at the state of…'),
      N('She sees Sable. Ivy has an opinion on everything, and she hasn’t got one about this.'),
      N('She hands her lantern to Nettie and lifts Tam, quilt and all. He doesn’t wake.'),
      N('On the way past, she drops a blanket on you without looking.'),
      IVY('You look frozen. It’s very stupid, sitting out all night. I’m not saying anything nice about it.'),
      N('Sable doesn’t move. She lets Ivy pass within an arm’s length, and only her ears turn.'),
      N('Ivy goes off up the lane with Tam, and Nettie trots after with the lantern, yawning, very small.'),
    ],
    [
      {
        domain: 'science',
        skill: 'animals’ senses: moveable ears',
        standard: '4-LS1-2',
        kind: 'notice',
        after: 6,
        lines: [
          N('Many animals can swivel their ears to point at a sound, while their head stays still.'),
          N('It lets them track a footstep without moving. Your ears can’t turn, so you have to turn your whole head.'),
        ],
        parentNote: 'Learned that many animals can turn their ears to track sounds.',
      },
    ],
  ),
  scene(
    's31-four-away',
    [
      IVY_ARRIVES,
      IVY('Four o’clock. I said four. Look at the state of him.', 'angry'),
      N('She looks at Tam, asleep in his quilt, and doesn’t laugh. She lifts him, quilt and all.'),
      N('She doesn’t look at you. There is a blanket over her arm, and she keeps it.'),
      IVY('Nettie. Home.'),
      N('Nettie stamps off up the lane after them with the lantern, furious all the way, and very small.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'how a character responds to events',
        standard: 'RL.2.3',
        kind: 'ask',
        after: 3,
        prompt: [N('Ivy keeps the blanket this time. Why might she?')],
        options: [
          { label: 'She’s cross that the Keeper left the children alone', best: true, reply: [N('That fits. Ivy shows what she thinks through what she does, not what she says.')] },
          { label: 'She’s cold herself', reply: [N('Maybe! But she doesn’t look at you, either. It’s more likely she’s cross you went.')] },
        ],
        parentNote: 'Explained a character’s action by her feelings about what happened.',
      },
    ],
  ),
  scene(
    's31-light-sable',
    [
      N('Up the lane, a light goes on in the end cottage. Ivy gets Tam up the stairs, takes his boots off, and tucks him in.'),
      N('Sable stays beside you until it is light. Neither of you moves.'),
      N('When the sun reaches the top of the hill, she gets up, shakes the frost off her back, and goes to see about breakfast.'),
      N('Tam’s sign is still standing, WELCOME GREAT GOURD, with the R still backwards for luck.'),
    ],
    [FROST_ENDS_SEASON(2)],
  ),
  scene(
    's31-promise-went',
    [
      N('When Ned has gone home, Tam turns round on the wall and looks at you, and then looks away.'),
      TAM('I don’t need anybody, you know. To wait. I can do it on my own. I nearly did.'),
      TAM('Nettie doesn’t count. She was asleep for the important bit.'),
      N('He gets down off the wall and goes home, holding his quilt up off the mud.'),
      N('Next morning there is a second sign in the long grass, smaller, beside the first. It is painted on the lid of a biscuit tin.'),
      N('It says: SEAT FOR A KEEPER (IF).'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'what a character says versus what he means',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 5,
        prompt: [N('Tam says he doesn’t need anybody. Then he paints a seat for you. What does the “(IF)” tell you?')],
        options: [
          { label: 'He hopes you’ll come, but he’s scared to count on it', best: true, reply: [N('Yes. The sign is an invitation, and the brackets protect him in case you don’t.')] },
          { label: 'He doesn’t want you there', reply: [N('Then why paint a seat? The “(IF)” is him being careful with his hopes.')] },
        ],
        parentNote: 'Inferred a character’s real feelings from his actions and a small detail.',
      },
    ],
  ),
  scene(
    's31-complete-strays',
    [
      MORNING,
      N('A small heap of fruit: six windfall plums, two apples, and a pear with one bite out of it. Someone has left it for the strays.'),
      TAM('He got the letter. He couldn’t carry it all the way to the Hollow, so he left it here for us to take.', 'happy'),
      N('You put it out at the edge of the Grove that evening. By morning it has all gone, and nobody saw who ate it.'),
      ...KEEPSAKES,
    ],
    [
      {
        domain: 'maths',
        skill: 'total and share equally',
        standard: '3.OA.A.3',
        kind: 'ask',
        after: 1,
        prompt: [N('Six plums, two apples and a pear. If three strays share all of it equally, how many pieces does each get?')],
        options: [
          { label: '3 each', best: true, reply: [N('Yes. 6 + 2 + 1 = 9 pieces, and 9 ÷ 3 = 3 each. The bitten pear counts.')] },
          { label: '2 each', reply: [N('Count them all first: 6 + 2 + 1 = 9. Then 9 ÷ 3 = 3 each.')] },
          { label: '9 each', reply: [N('9 is the whole heap. Shared between three strays, 9 ÷ 3 = 3 each.')] },
        ],
        parentNote: 'Added three groups to make 9, then divided 9 equally by 3.',
      },
    ],
  ),
  scene(
    's31-complete-busy',
    [
      MORNING,
      N('…Or hasn’t. There is nothing at all: just the sign, the frost going off it, and the long grass.'),
      TAM('Nothing. He didn’t come and he didn’t send anything. Because we said he needn’t, if he was busy.', 'think'),
      TAM('So he was busy. And he was polite back. That’s proof, that is.', 'happy'),
      ...KEEPSAKES,
    ],
    [
      {
        domain: 'literacy',
        skill: 'evidence and reasoning: what counts as proof',
        standard: 'RL.3.6',
        kind: 'ask',
        after: 3,
        prompt: [N('Think: Tam says nothing turning up is proof. Is it?')],
        options: [
          think('Not really. Nothing would turn up either way.', [N('A sharp answer. Proof should be something that wouldn’t happen if you were wrong.')]),
          think('For Tam, yes. It fits what he asked for.', [N('That’s kind. It does match his letter, even if it can’t prove it.')]),
          think('It doesn’t matter. It makes him happy.', [N('Sometimes that is the point. Moss would probably agree with you.')]),
        ],
        parentNote: 'Thought about what counts as proof, and when it matters.',
      },
    ],
  ),
  scene(
    's31-ambient-tam',
    [TAM('I’m practising sitting. For next year. You have to start early or your knees go.', 'think')],
    [
      {
        domain: 'health',
        skill: 'keeping joints warm and moving in the cold',
        kind: 'notice',
        after: 0,
        lines: [N('Tam is half right. Muscles and joints feel stiff when they’re cold and still. Moving about now and then keeps them comfortable.')],
        parentNote: 'Learned that cold, still muscles stiffen and moving helps.',
      },
    ],
  ),
  scene(
    's31-ambient-ivy',
    [IVY('I’ve told Tam the Great Gourd isn’t real eleven times. He writes it down each time. I think he’s keeping score.')],
    [
      {
        domain: 'maths',
        skill: 'tally marks in groups of five',
        standard: '2.MD.D.10',
        kind: 'do',
        after: 0,
        check: 'edu:tally:times:11',
        lines: [N('Draw Tam’s tally of eleven: two gates of five (four lines and one across), then one more line.')],
        parentNote: 'Drew eleven as tally marks in groups of five.',
      },
    ],
  ),
  scene(
    's31-ambient-ned',
    [NED('I gave my best rock away. Byte says I can start again. He’s bringing me a granite.', 'happy')],
    [
      {
        domain: 'science',
        skill: 'granite and basalt: slow and fast cooling make different crystals',
        standard: '2-PS1-1',
        kind: 'notice',
        after: 0,
        lines: [
          N('Granite also starts as melted rock, but it cools slowly, deep underground, so its crystals grow big enough to see.'),
          N('Basalt cools fast, so its crystals stay tiny. Same start, different speed, different rock.'),
        ],
        parentNote: 'Compared granite and basalt by how fast they cooled.',
      },
    ],
  ),
  scene(
    's31-ambient-nettie',
    [NETTIE('I’m going guising next year. I’ve decided. Unless Tam says.')],
    [
      {
        domain: 'sel',
        skill: 'making your own decisions',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 0,
        lines: [N('Nettie is learning that she can choose for herself. It’s fine to listen to a friend, and fine to decide differently.')],
        parentNote: 'Talked about making your own decisions while still caring about friends.',
      },
    ],
  ),
  scene(
    's31-ambient-lantern',
    [
      TAM('Did you see? The fourth one lit. By itself. At dawn. Nobody touched it.', 'happy'),
      TAM('It was him. The Great Gourd. I told you that patch was sincere.', 'happy'),
      TAM('Ivy says he’s very late. I say he’s very thorough.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'word choice changes meaning',
        standard: 'L.3.4',
        kind: 'notice',
        after: 2,
        lines: [N('“Late” and “thorough” describe the same wait. One makes it sound like a failure; the other makes it sound careful.')],
        parentNote: 'Noticed how choosing a word changes how something sounds.',
      },
    ],
  ),
];

// ================================================================== the quest
export const EDU_S31_READER: EduQuest[] = [
  {
    id: 'reader:s31',
    of: 's31',
    band: 'reader',
    title: 'The Great Gourd',
    goals: {
      's31-step1': { goal: 'Help Tam spell his letter to the Great Gourd.', hint: 'Tam is on the Grove wall by the gate. He will argue about some of the spellings.' },
      's31-step2': { goal: 'Go with Tam and the lane children to Fern’s gourd patch.', hint: 'Fern’s patch is over the wall next door, past the hens. Ivy walks fast on purpose.' },
      's31-step3': { goal: 'Carve a gourd lantern with Tam: a smaller, kinder one.', hint: 'Pick a small gourd from Fern’s patch. A kind face takes longer than a fierce one.' },
      's31-step4': { goal: 'Witness Ivy’s promise, and watch Ned take his kick.', hint: 'Ned is on the green at the end of the lane with a ball and a great deal of hope.' },
      's31-step5': { goal: 'Find out whether Ned is really invited to Sparks’s party.', hint: 'Sparks is up a ladder outside her workshop at the top of the lane.' },
      's31-step6': { goal: 'Help Tam put up his sign in the patch he has chosen.', hint: 'Tam has chosen the long grass by the fourth lantern post. The hammer is in the shed.' },
      's31-step7': { goal: 'Get your Nubbin ready for Gourd Night in Sparks’s goggles and scarf.', hint: 'Tap your Nubbin and choose Dress.' },
      's31-step8': { goal: 'Decide where you’ll spend Gourd Night.', hint: 'Ivy is in the lane, Sparks at her workshop, and Tam in the long grass. Choose one; the others will manage.' },
      's31-step9': { goal: 'Find out how the guising went.', hint: 'Ned will want to show you what he got.' },
      's31-step10': { goal: 'Your Nubbin is having its own night. Guide it to the party.', hint: 'Keep low along the hedges and out of the frosty grass.' },
      's31-step11': { goal: 'Midnight: Tam is still waiting in the long grass.', hint: 'There’s nothing to do but wait. That is the hard part.' },
      's31-step12': { goal: 'Before dawn, the frost comes in over the long grass.', hint: 'Keep your Nubbins at the edge, out of the white grass.' },
      's31-step13': { goal: 'See Tam safely home, then wait for the light.', hint: 'Ivy is coming at four, as promised.' },
      's31-step14': { goal: 'Find Tam at the Grove wall.', hint: 'He’s on the wall by the gate, where he wrote the letter.' },
    },
    scenes: SCENES,
    glossary: [
      gloss('sincere', 'Meaning what you say and being truly yourself, without pretending.', 's31-wall'),
      gloss('homophone', 'A word that sounds the same as another but is spelt differently and means something else, like great and grate.', 's31-wall'),
      gloss('pollen', 'A fine yellow powder that flowers make; bees carry it from flower to flower so fruit and seeds can grow.', 's31-patch'),
      gloss('custom', 'Something people in a place have done the same way for a long time.', 's31-carve'),
      gloss('symmetry', 'When one half of a shape is a mirror image of the other half.', 's31-kinder'),
      gloss('witness', 'Someone who sees something happen and can say truly that it did.', 's31-ball'),
      gloss('biased', 'Leaning towards one side unfairly, instead of judging both sides equally.', 's31-kick'),
      gloss('rumour', 'A story passed from person to person that may or may not be true.', 's31-lists'),
      gloss('tilt', 'A lean to one side; the Earth leans a little as it travels round the Sun.', 's31-dusk'),
      gloss('ace', 'A pilot who is extremely skilled; also anyone who is brilliant at something.', 's31-ace'),
      gloss('guising', 'An old Scottish custom of dressing up and going door to door on an autumn night, doing a party piece for treats.', 's31-long-grass'),
      gloss('basalt', 'A dark, fine-grained rock made when lava cools quickly.', 's31-rock'),
      gloss('lava', 'Melted rock that comes out of a volcano.', 's31-rock'),
      gloss('simile', 'A comparison that uses “like” or “as”, such as “glows like a lighthouse”.', 's31-ace-roof'),
      gloss('tempo', 'The speed of a piece of music.', 's31-ace-party'),
      gloss('nocturnal', 'Awake and active at night, asleep in the day.', 's31-midnight'),
      gloss('vapour', 'Water as an invisible gas in the air.', 's31-frost'),
      gloss('deposit', 'A small part of something given now, as a promise that the rest will come later.', 's31-complete'),
      gloss('thorough', 'Careful to do every part of something properly.', 's31-ambient-lantern'),
    ],
    notes:
      'Reader keeps every choice. Think questions (no best answer): creed, ball, moss, long-grass, if, midnight-wisp, ' +
      'next-year, complete-busy. The outline’s angle: gourds and frost, being a friend to a believer, how long a night ' +
      'is, and turnip lanterns in Scotland and Ireland.',
  },
];

/** Every `edu:` check string used in this file. */
export const CHECKS: string[] = ['edu:tally:times:11'];
