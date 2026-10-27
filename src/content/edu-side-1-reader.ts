/**
 * The Learning Grove, reader band (ages 7–10): side stories S1–S5.
 *
 *   S1 The Wardens’ Walk     oral history and memory
 *   S2 Wisp                  mercy (the think question), warmth and insulation
 *   S3 The Cycle             photo finish, fair tests, evidence and data
 *   S4 The Wellspring        water flow, dams, tide pools and the Moon’s pull on tides
 *   S5 Fossil’s Last Walk    fossils and rock layers, ageing and grief
 *
 * One EduScene per original scene (step scenes, done scenes, complete scenes). S2’s variant
 * scenes (s2-complete-sable, s2-complete-driven) live in EDU_SIDE_1_READER_VARIANTS, the
 * same way the main file keeps them in SIDE_STORIES_MAIN_VARIANTS.
 *
 * Every choice keeps its original id, `set` and `friendship`; reader keeps every choice.
 * See EDU-STYLE.md. British spelling; °C with °F in brackets.
 */
import type { EduQuest, EduScene, GlossaryEntry } from './types';
import type { Line } from '../config/story';

type Mood = NonNullable<Line['mood']>;

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

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
// Speakers declared in the side-story files.
const BR = say('briar');
const HU = say('hush');
const CI = say('cinder');
const YH = say('young-hazel');
const W = say('wisp');

// ================================================================== S1 The Wardens’ Walk
const S1_SCENES: EduScene[] = [
  {
    id: 'reader:s1-ask',
    of: 's1-ask',
    band: 'reader',
    lines: [
      N('The Keepers wander home with their empty cups. Three lanterns glow. The fourth post, by the long grass, is dark.'),
      N('Moss hasn’t gone back up the hill. He sits by your boot, staring at the dark post.'),
      M('Twenty-two years, that post has been dark.', 'sad'),
      Y('Why is it dark?'),
      M('Not tonight. Ask me something else. Anything else.', 'think'),
      M('I told you the tale. A tale is only the part that fits in a song. The rest doesn’t fit anywhere.', 'soft'),
      M('At each post I keep one small memory that isn’t in the tale. Four posts. Four small things.'),
      M('Hazel used to walk round them with me every Lantern Night. Slowly. I’d like to do it again.', 'soft'),
      M('At my pace. I am older than the trees, and the trees are not in a hurry either.'),
    ],
    lessons: [
      {
        id: 'reader:s1-ask-l1',
        domain: 'social-studies',
        skill: 'oral history: how spoken stories carry the past',
        standard: 'D2.His.2.K-2',
        kind: 'notice',
        after: 6,
        lines: [
          M('Nobody wrote the old days down. They were kept like this: one of us telling the next one.'),
          N('People do this too. When someone tells what they remember and others pass it on, it’s called oral history.'),
          N('Oral means spoken. Long before there were books, most people kept their past this way.'),
        ],
        parentNote: 'Learned what oral history is: memories passed on by telling, before and alongside writing.',
      },
      {
        id: 'reader:s1-ask-l2',
        domain: 'maths',
        skill: 'a quarter of the speed takes four times as long',
        standard: '3.OA.A.3',
        kind: 'ask',
        after: 8,
        prompt: [
          N('Moss walks at a quarter of your speed. That means he covers one step for every four of yours.'),
          N('On your own, you could reach the stream lantern in 3 minutes. How long will it take beside Moss?'),
        ],
        options: [
          {
            label: '12 minutes',
            best: true,
            reply: [M('Twelve. Four times as slow means four times as long. Three, four times over. You’ve been listening.', 'happy')],
          },
          {
            label: '7 minutes',
            reply: [
              M('You added four. Slowness doesn’t add, I’m afraid. It multiplies.', 'think'),
              M('Four lots of three minutes: 3, 6, 9, 12. Twelve minutes. Bring patience.'),
            ],
          },
          {
            label: '3 minutes',
            reply: [
              M('If I walked at your speed, yes. I don’t. I never have.', 'happy'),
              M('A quarter of the speed takes four times as long. Four lots of three: twelve minutes.'),
            ],
          },
        ],
        parentNote: 'Worked out that a quarter of the speed means four times the time (4 × 3 = 12).',
      },
    ],
    choices: [
      {
        id: 'walk',
        label: 'Walk beside him.',
        set: { 's1-pace': 'walk' },
        then: [
          N('You walk. It takes a long time to cross the grass. Halfway, you realise that is the point.'),
          M('Good. You didn’t sigh. Hazel sighed for the first ten years.', 'happy'),
        ],
      },
      {
        id: 'carry',
        label: 'Offer to carry him.',
        set: { 's1-pace': 'offered' },
        then: [
          M('Certainly not. I have legs. They are very short and very old, but they are mine.', 'think'),
          M('Ask me again another year. I may surprise us both.', 'soft'),
        ],
      },
      {
        id: 'which',
        label: 'Ask which post comes first.',
        set: { 's1-pace': 'asked' },
        then: [
          M('Briar’s, by the stream. She hated waiting more than anything, except being sad.', 'happy'),
          M('She was very good at not being sad. It was most of what she did.'),
        ],
      },
    ],
  },
  {
    id: 'reader:s1-briar',
    of: 's1-briar',
    band: 'reader',
    lines: [
      N('The stream lantern hisses softly in the damp air. Moss looks at it for a long while before he speaks.'),
      M('Briar. The songs call her Joy. That’s a big word. Mostly, she laughed.', 'happy'),
      M('She laughed at frogs. At weather. At me, constantly. When she was scared, she laughed loudest of all.'),
      M('Briar was an Eternal, like me. An Eternal is a Nubbin loved so much it stays a very long time.'),
      M('But in the end, even an Eternal fades. Fading means dying. When it was Briar’s time, she walked up the hill laughing.', 'soft'),
      M('She said she’d thought of a joke and wanted to tell it to the view.'),
      N('For a moment the lantern light turns old and gold, and you hear a voice that isn’t his.'),
      BR('If I’m not down by supper, eat mine. If I’m not down by spring, plant something nice.', 'happy'),
      M('Nobody had to plant anything. Something yellow came up where she sat. The first memorial flower.', 'soft'),
      M('Typical. She always got the last word.', 'happy'),
      M('I never found out what the joke was. Some evenings I sit up there and try to guess.', 'soft'),
    ],
    lessons: [
      {
        id: 'reader:s1-briar-l1',
        domain: 'literacy',
        skill: 'reading between the lines: what a character really means',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 7,
        prompt: [N('Briar says, “If I’m not down by spring, plant something nice.” What did she really mean?')],
        options: [
          {
            label: 'She knew she wasn’t coming back, and wanted to be remembered with something lovely.',
            best: true,
            reply: [M('Yes. She knew. She just said it in a way that let us smile. That was Briar all over.', 'soft')],
          },
          {
            label: 'She wanted someone to tidy the garden.',
            reply: [
              M('Ha. She’d have liked that answer. But no.', 'happy'),
              M('She knew she wasn’t coming down that hill. She asked for a flower so we’d have something lovely to remember her by.'),
            ],
          },
          {
            label: 'She was hungry and wanted her supper saved.',
            reply: [
              M('She was always hungry, to be fair. But listen to the second half.', 'think'),
              M('“If I’m not down by spring.” She knew she wouldn’t be. The flower was her way of saying goodbye gently.'),
            ],
          },
        ],
        parentNote: 'Inferred a character’s real meaning from what she said, not just the words themselves.',
      },
      {
        id: 'reader:s1-briar-l2',
        domain: 'sel',
        skill: 'remembering someone who has died',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 10,
        lines: [
          M('When someone you love dies, the missing doesn’t stop. It changes shape.', 'soft'),
          M('Telling their stories helps. So does a flower. So does guessing at their jokes, on a quiet evening.'),
        ],
        parentNote: 'Heard that sadness after a death is normal, and that remembering together helps.',
      },
    ],
  },
  {
    id: 'reader:s1-boats-ask',
    of: 's1-boats-ask',
    band: 'reader',
    lines: [
      M('She had a game. Of course she had a game. Leaf-boats, each with a candle stub a grown-up lit, from her post down to mine.', 'happy'),
      M('If yours reached the pond still lit, you had to laugh out loud. Those were her rules.'),
      M('There were eleven rules. Nine of them were about laughing.', 'think'),
      N('He brings out a dock leaf from somewhere, folded very neatly, with a stub of candle standing in it.'),
      M('I have never once got one to the pond. Not in all the years. She said I watched it too hard.', 'think'),
      M('I’ve been watching it less hard, on purpose, for a very long time. It hasn’t helped.'),
    ],
    lessons: [
      {
        id: 'reader:s1-boats-ask-l1',
        domain: 'maths',
        skill: 'subtraction word problem within 20',
        standard: '1.OA.A.1',
        kind: 'ask',
        after: 2,
        prompt: [M('Eleven rules. Nine about laughing. So how many were about anything else at all?', 'think')],
        options: [
          { label: '2', best: true, reply: [M('Two. One said only a grown-up lights the candles. One was about not pushing Moss in. She needed that one.', 'happy')] },
          {
            label: '20',
            reply: [
              M('That’s eleven and nine added together. We want what’s left over.', 'think'),
              M('Start at nine and count up to eleven: ten, eleven. Two rules. One was about not pushing me in.'),
            ],
          },
          {
            label: '3',
            reply: [
              M('Close. Count up from nine: ten, eleven. That’s two steps, so two rules.', 'soft'),
              M('One said only a grown-up lights the candles, and one was about not pushing me in.'),
            ],
          },
        ],
        parentNote: 'Solved 11 − 9 = 2 by counting on from the smaller number.',
      },
      {
        id: 'reader:s1-boats-ask-l2',
        domain: 'science',
        skill: 'why a wide, flat boat is steadier',
        standard: '3-5-ETS1-2',
        kind: 'ask',
        after: 5,
        prompt: [M('Before you fold yours. Which boat is less likely to tip over: wide and flat, or tall and narrow?')],
        options: [
          {
            label: 'Wide and flat',
            best: true,
            reply: [
              M('Right. A wide boat spreads its weight over lots of water, and its low middle is hard to tip.', 'happy'),
              M('Tall and narrow wobbles at the first ripple. Ask me how I know.'),
            ],
          },
          {
            label: 'Tall and narrow',
            reply: [
              M('That’s how I fold mine. Every year. Watch what happens to it.', 'think'),
              M('Wide and flat is steadier. The weight is spread out and low down, so a ripple can’t tip it.'),
            ],
          },
        ],
        parentNote: 'Compared two boat designs and explained why a wide, low boat is more stable.',
      },
    ],
    choices: [
      {
        id: 'flat',
        label: 'Fold yours wide and flat.',
        set: { 's1-boat': 'flat' },
        then: [M('Briar’s way. Flat as a pancake and twice as smug.', 'happy')],
      },
      {
        id: 'sail',
        label: 'Give yours a sail.',
        set: { 's1-boat': 'sail' },
        then: [
          M('A sail. Nobody has ever thought of a sail.', 'shock'),
          M('…I don’t know if that’s allowed. She’d have allowed it. She’d have been furious she didn’t think of it first.', 'happy'),
        ],
      },
    ],
  },
  {
    id: 'reader:s1-boats',
    of: 's1-boats',
    band: 'reader',
    lines: [
      N('The stream takes the boats as if it has been waiting all year. Moss’s tips over at once, with great dignity.'),
      M('Every year.', 'think'),
      N('Yours wobbles past the stepping stones, spins once at the reed bend, and slides out onto the pond.'),
      N('The candle is still lit.'),
      N('Your Nubbin, who has run beside it the whole way along the bank, sits down hard in amazement.'),
      M('Well? Rules are rules.'),
      N('You laugh. It comes out louder than you meant, and it rolls right across the water.'),
      M('…There. That’s Briar’s sound. I haven’t heard it at this post in a very long time.', 'soft'),
      N('Behind you, Moss’s boat drifts back to the bank upside down, as if it would quite like another go.'),
      M('I have a theory about Briar’s joke, you know. That my boat never reaches the pond.', 'think'),
      M('She folded my first one. I’ve used her fold ever since. I’m beginning to suspect the fold.'),
      N('He looks at the upside-down boat with deep suspicion.'),
      M('Next Lantern Night, boats again. And the one after. It’s a tradition now.', 'soft'),
    ],
    lessons: [
      {
        id: 'reader:s1-boats-l2',
        domain: 'social-studies',
        skill: 'traditions: how a group remembers together',
        standard: 'D2.His.2.K-2',
        kind: 'notice',
        after: 12,
        lines: [
          N('Something a family or a town does again every year, the same way, is called a tradition.'),
          M('Traditions are how a valley remembers without anybody having to write it down. Boats included.', 'soft'),
        ],
        parentNote: 'Learned what a tradition is and how it helps a community keep its memories.',
      },
    ],
  },
  {
    id: 'reader:s1-wall-ask',
    of: 's1-wall-ask',
    band: 'reader',
    lines: [
      N('A few evenings later, Moss is waiting at the gate. He has clearly waited a while, and would like you to know it.'),
      M('The old wall next. Hush’s. Feed them first. I’ll wait. I am, you’ll have noticed, good at it.'),
      N('Byte is leaning on the wall with a notebook, trying to look casual. It clearly took a lot of planning.'),
      BY('Is he talking? Right now? Ask him something only he would know. For proof.', 'think'),
      M('Tell Byte it’s his left shoelace this time.'),
      N('Byte looks down. His left lace is undone. Byte goes very quiet, ties it, and leaves. The right one comes undone on the way.'),
      M('Hush was the quiet one. People think quiet means resting. Hush wasn’t resting. She was listening.', 'think'),
      Y('Listening to what?'),
      M('Whatever you weren’t saying. Come on. North side of the Grove. Mind the step.'),
    ],
    lessons: [
      {
        id: 'reader:s1-wall-ask-l1',
        domain: 'social-studies',
        skill: 'compass directions: north, east, south, west',
        standard: 'D2.Geo.2.K-2',
        kind: 'ask',
        after: 8,
        prompt: [
          M('Hush’s wall is on the north side. Face north with me. Now: which way is east?'),
        ],
        options: [
          {
            label: 'To my right',
            best: true,
            reply: [
              M('Right. Facing north, east is on your right hand, west on your left, and south behind you.', 'happy'),
              M('Going round clockwise: north, east, south, west. Hush’s post never moves, which helps.'),
            ],
          },
          {
            label: 'To my left',
            reply: [
              M('That’s west. Easy to swap them.', 'soft'),
              M('Face north and hold out your right arm. That points east. Clockwise: north, east, south, west.'),
            ],
          },
          {
            label: 'Behind me',
            reply: [
              M('Behind you is south, the opposite of north.', 'soft'),
              M('East is on your right. Go round clockwise: north, east, south, west.'),
            ],
          },
        ],
        parentNote: 'Practised the four compass directions and where east and west are when facing north.',
      },
    ],
  },
  {
    id: 'reader:s1-hush',
    of: 's1-hush',
    band: 'reader',
    lines: [
      N('The lantern by the old wall burns lower than the others, steady and quiet, like a candle in an empty room.'),
      M('After the White Year, some of the stilled ones never moved again. They sat where they were put down.', 'sad'),
      M('The rest of us were busy. Mending. Hatching. Getting the valley warm. Hush sat with the still ones.'),
      M('Every one. Every day. She didn’t try to wake them. She kept them company, so they weren’t alone.'),
      N('Moss stops. When he goes on, his voice is smaller.'),
      M('The last of them faded on a winter morning, under this wall. Faded means it died. Hush was beside it.', 'soft'),
      N('The memory rises slowly, like breath on cold glass.'),
      HU('That’s the last of them, Moss. Somebody kept them. I think I’d like to be kept now.', 'soft'),
      M('She called grief a kind of keeping. You hold it, so it doesn’t get dropped all over the valley.', 'soft'),
      M('She held it a very long time. Then she put it down. I’ve never thought that was weakness.'),
      M('Some years later, Hush faded too. Faded means she died. She went quietly, the way she did everything.', 'soft'),
      M('She was not alone. Somebody kept her company, the way she kept them.', 'soft'),
    ],
    lessons: [
      {
        id: 'reader:s1-hush-l1',
        domain: 'literacy',
        skill: 'similes',
        standard: 'L.4.5',
        kind: 'notice',
        after: 0,
        lines: [
          N('“Like a candle in an empty room” is a simile. A simile compares two things using “like” or “as”.'),
          N('It tells you how the lantern looks: small, steady and a little lonely.'),
        ],
        parentNote: 'Spotted a simile and explained what the comparison shows.',
      },
      {
        id: 'reader:s1-hush-l2',
        domain: 'sel',
        skill: 'think question: what grief is for',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 8,
        prompt: [M('Hush called grief a kind of keeping. I’ve wondered about that for a long time. What do you think she meant?', 'think')],
        options: [
          {
            label: 'Being sad about someone is a way of still loving them.',
            reply: [
              M('That’s a fair answer. I think so too. The sad part is the love, with nowhere to go.', 'soft'),
            ],
          },
          {
            label: 'Somebody has to remember them, so they’re not forgotten.',
            reply: [
              M('That’s a fair answer. Hush would have nodded at that. Keeping them in mind is keeping them.', 'soft'),
            ],
          },
          {
            label: 'I’m not sure. Grief just feels heavy.',
            reply: [
              M('That’s an honest answer, and honest is always fair. It is heavy.', 'soft'),
              M('Maybe that’s why she called it keeping. You carry it, and one day you’re allowed to put it down.'),
            ],
          },
        ],
        parentNote: 'Thought about what grief means; there was no wrong answer.',
      },
    ],
  },
  {
    id: 'reader:s1-pond-ask',
    of: 's1-pond-ask',
    band: 'reader',
    lines: [
      N('Moss is on the hill when you look for him, and by the pond when you stop looking. That seems to be how it works.'),
      M('Mine. I’ve been putting it off. Not because it’s sad. Because it’s mine, and I talk about myself too much.', 'think'),
      M('Sit. No, closer. There. That’s where she sat.', 'soft'),
      Y('Hazel?'),
      M('Hazel. Before she was anybody’s gran. Before she was anybody’s anything.'),
      N('The pond lantern hums. Above it, the sky has gone the deep blue that comes just after sunset. It is dusk.'),
    ],
    lessons: [
      {
        id: 'reader:s1-pond-ask-l1',
        domain: 'science',
        skill: 'dusk: why the sky stays light after sunset',
        standard: '1-ESS1-1',
        kind: 'notice',
        after: 5,
        lines: [
          M('Dusk. My favourite light. The Sun has already gone below the edge of the world.'),
          M('But its light still glows in the sky for a while after. That’s why it isn’t dark straight away.'),
        ],
        parentNote: 'Learned that dusk is the time after sunset when sunlight still lights the sky.',
      },
    ],
    choices: [
      {
        id: 'sit',
        label: 'Sit where she sat.',
        set: { 's1-sat': true },
        then: [
          N('The grass there is worn, very slightly, in the shape of someone who came back to the same spot for forty years.'),
          M('She’d say you were sitting in it wrong. You aren’t.', 'happy'),
        ],
      },
      {
        id: 'why',
        label: 'Ask him why he chose her.',
        set: { 's1-asked-why': true },
        then: [M('Patience. I’m getting there. Rush me and I’ll start from the Spring Age, and we’ll be here till May.', 'happy')],
      },
    ],
  },
  {
    id: 'reader:s1-hazel',
    of: 's1-hazel',
    band: 'reader',
    lines: [
      N('The pond lantern burns clean and warm. Moss looks at the water, not at you.'),
      M('She came here young. Clever, cross, and in a terrible hurry. She wanted the Nubbins to love her by Tuesday.', 'happy'),
      M('They didn’t. So she sat by this pond every day and grumbled to the nearest thing that would listen. Me.'),
      M('I didn’t say a word, all winter. She wriggled and fidgeted the whole time, and never once asked me to talk.', 'happy'),
      N('The light turns old and gold. Snow, in the memory, and a young woman on a frozen bank, in a coat too big for her.'),
      YH('I haven’t the faintest idea what I’m doing. I don’t suppose you have either.', 'sad'),
      M('Then, at the first thaw, I looked up at her and said, “You’ll do.”', 'happy'),
      M('She laughed so hard she fell in the pond. It was only ankle-deep. She has never let me forget it.'),
      YH('You sat with me all winter. Why?', 'soft'),
      M('Because you kept coming back. That’s all it ever takes. Most people don’t.', 'soft'),
      N('The memory fades. The pond is a pond again, with your face in it, and his.'),
      M('Her third rule. Sit down next to them and wait. She thinks she invented it. I’ve never had the heart to say.', 'happy'),
    ],
    lessons: [
      {
        id: 'reader:s1-hazel-l1',
        domain: 'literacy',
        skill: 'two points of view on the same event',
        standard: 'RL.3.6',
        kind: 'ask',
        after: 5,
        prompt: [N('To young Hazel, it looks as if Moss is just sitting there, doing nothing. What was he really doing all winter?')],
        options: [
          {
            label: 'Waiting to see if she’d keep coming back.',
            best: true,
            reply: [M('Exactly. From where she sat, nothing was happening. From where I sat, everything was.', 'happy')],
          },
          {
            label: 'Ignoring her.',
            reply: [
              M('That’s how it looked to her. It’s a fair guess from her side of the pond.', 'soft'),
              M('From my side, I was watching to see if she’d keep coming back. Same winter, two very different stories.'),
            ],
          },
          {
            label: 'Sleeping.',
            reply: [
              M('I have been accused of that. Often.', 'happy'),
              M('No. I was watching to see if she’d keep coming back. She thought nothing was happening. Something was.'),
            ],
          },
        ],
        parentNote: 'Compared two characters’ points of view on the same events.',
      },
      {
        id: 'reader:s1-hazel-l2',
        domain: 'science',
        skill: 'ice floats, so ponds freeze from the top',
        standard: '2-ESS2-3',
        kind: 'notice',
        after: 7,
        lines: [
          M('Ice floats. So a pond freezes from the top down, like a lid.'),
          M('Under the lid the water stays liquid, and the fish carry on all winter. Hazel landed on a thin bit of lid.', 'happy'),
        ],
        parentNote: 'Learned that ice floats, so ponds freeze from the top and life survives underneath.',
      },
    ],
  },
  {
    id: 'reader:s1-wait',
    of: 's1-wait',
    band: 'reader',
    lines: [
      N('You look across the Grove at the fourth post, by the long grass. Moss doesn’t.'),
      M('Not that one. Not while it’s empty.', 'sad'),
      N('Over the lane, some children are skipping and chanting, in the sing-song voice children keep for old rhymes.'),
      N('“Cinder held them close and tight, / kept them warm one winter night;”'),
      N('“when the morning came to call, / they did not move at all.”'),
      M('They’ve got the words right. They’ve got her wrong.', 'soft'),
      M('Everybody remembers her winter. Somebody should remember the rest of her. I’ll tell you. When it’s home.'),
      Y('When what’s home?'),
      M('Feed them. Go to bed. Ask me again when I ask you.', 'think'),
    ],
    lessons: [
      {
        id: 'reader:s1-wait-l1',
        domain: 'literacy',
        skill: 'rhyme and rhythm help words last',
        standard: 'RL.2.4',
        kind: 'ask',
        after: 4,
        prompt: [N('That rhyme is older than anyone in the valley. What helps children remember it for so long?')],
        options: [
          {
            label: 'The rhyme and the steady beat.',
            best: true,
            reply: [
              N('Yes. Tight and night, call and all. Rhymes and a beat are easy to remember, especially when you skip to them.'),
              N('That’s why so many old stories were kept as songs and rhymes.'),
            ],
          },
          {
            label: 'It’s written in a famous book.',
            reply: [
              N('Nobody wrote it down. The children learn it from older children, by ear.'),
              N('What makes it stick is the rhyme and the beat: tight, night, call, all. You can skip to it.'),
            ],
          },
          {
            label: 'It’s very long.',
            reply: [
              N('It’s actually very short, which helps. But the real glue is the rhyme and the beat.'),
              N('Tight, night, call, all. Words that rhyme and bounce are easy to remember.'),
            ],
          },
        ],
        parentNote: 'Noticed how rhyme and rhythm make a verse easy to remember and pass on.',
      },
      {
        id: 'reader:s1-wait-l2',
        domain: 'social-studies',
        skill: 'think question: can a story be true and still unfair?',
        standard: 'D2.His.2.K-2',
        kind: 'ask',
        after: 5,
        prompt: [M('The words are right. She did hold them too tight. So can a story be true, and still be unfair to someone?', 'think')],
        options: [
          {
            label: 'Yes. If it only tells the worst part.',
            reply: [M('That’s a fair answer. A true story with the rest left out can still mislead.', 'soft')],
          },
          {
            label: 'No. If it’s true, it’s fair.',
            reply: [
              M('That’s a fair answer too. Truth matters most.', 'think'),
              M('I’d only say: a true part isn’t always the whole. That’s why I want you to hear the rest.'),
            ],
          },
          {
            label: 'It depends who’s telling it.',
            reply: [M('That’s a fair answer. Historians say the same: always ask who told it, and what they left out.', 'happy')],
          },
        ],
        parentNote: 'Thought about whether a true story can still be one-sided; there was no wrong answer.',
      },
    ],
  },
  {
    id: 'reader:s1-cinder',
    of: 's1-cinder',
    band: 'reader',
    lines: [
      N('A cold evening, weeks later. Frost reaches out of the long grass in thin white fingers.'),
      N('Moss is waiting at your door. He is so faint you can see the doorstep through him.'),
      M('Today I can tell it. I said I would. You may carry me. I’m told it’s an honour. Don’t make a face.', 'soft'),
      N('You carry him to the fourth post. He weighs almost nothing, like a bird’s nest with opinions.'),
      M('Everyone remembers Cinder in the snow. I’m going to tell you about the day before.'),
      M('Hot. The hottest day anyone could remember. The Nubbins lay flat in the long grass like dropped gloves.'),
      M('Cinder spent the whole day carrying them into the shade, one at a time. They kept wandering back out.', 'happy'),
      N('The light goes old and gold, then red at the edges. You smell hot grass and hear a voice, fierce and fond.'),
      CI('Out of the sun, you silly things. You’ll burn. Come here. Come here. I’ve got you.', 'happy'),
      M('She was never gentle. But she was never once tired of them. Not once, in all the years.', 'soft'),
      M('That night the first snow came. In summer. And it didn’t stop.', 'sad'),
      M('She gathered them all into her arms to keep them warm. She held on, and held on, and would not let go.', 'sad'),
      N('The memory goes white, and is gone. Frost glitters at the foot of the post.'),
      M('Cinder-love, they call it now. A love that holds too tight. It’s fair. It isn’t all of her.', 'sad'),
    ],
    lessons: [
      {
        id: 'reader:s1-cinder-l1',
        domain: 'literacy',
        skill: 'metaphors',
        standard: 'L.4.5',
        kind: 'notice',
        after: 0,
        lines: [
          N('Frost doesn’t really have fingers. “Thin white fingers” is a metaphor: it says one thing is another.'),
          N('It makes the frost feel as if it is reaching for something. Which it is.'),
        ],
        parentNote: 'Recognised a metaphor and what feeling it creates.',
      },
      {
        id: 'reader:s1-cinder-l2',
        domain: 'science',
        skill: 'why shade is cooler than sunshine',
        standard: 'K-PS3-1',
        kind: 'ask',
        after: 8,
        prompt: [M('She knew what she was doing, carrying them into the shade. Why is shade cooler?', 'think')],
        options: [
          {
            label: 'Something blocks the sunlight, so less of it reaches the ground to warm it.',
            best: true,
            reply: [M('Yes. Sunlight warms whatever it lands on. Block it, and that patch stays cooler.', 'soft')],
          },
          {
            label: 'Shade is made of cold air.',
            reply: [
              M('It feels that way. But shade is just a place the sunlight can’t reach.', 'soft'),
              M('Sunlight warms whatever it lands on. Under a tree, less sun lands, so it stays cooler.'),
            ],
          },
          {
            label: 'Trees blow cool wind.',
            reply: [
              M('A nice idea. Trees do rustle. But the cool comes from blocking the sunlight.', 'soft'),
              M('Sunlight warms the ground it lands on. Shade is where it can’t land.'),
            ],
          },
        ],
        parentNote: 'Explained that shade is cooler because it blocks sunlight that warms the ground.',
      },
    ],
  },
  {
    id: 'reader:s1-complete',
    of: 's1-complete',
    band: 'reader',
    lines: [
      M('There. Now two of us remember her warm. That’s twice as many as yesterday.', 'soft'),
      N('He nudges something across the frost to your boot: an acorn on a loop of faded string, worn smooth as a pebble.'),
      M('Hazel tied that on me, the spring after our first winter. The first gift anyone had given me in a very long time.'),
      M('Wear it. Then something of hers is walking about the Grove, and something of mine.', 'soft'),
      N('Hanging on the post is a soft hat with a little lantern stitched into the brim, and a note in big loud letters.'),
      N('“SAW YOU TWO DOING THE ROUNDS IN THE DARK, SO I MADE YOU THIS. IT PROBABLY DOESN’T EXPLODE. —SPARKS”'),
      N('That night you write it all down: four posts, four small things. You call the pages The Tale of the Four.'),
      N('Now there is a written record, as well as Moss’s memory.'),
      N('Moss falls asleep on your windowsill before you finish, which he has never done before.'),
    ],
    lessons: [
      {
        id: 'reader:s1-complete-l1',
        domain: 'science',
        skill: 'the life cycle of an oak',
        standard: '3-LS1-1',
        kind: 'notice',
        after: 1,
        lines: [
          N('An acorn is an oak tree’s seed. Planted, it sprouts into a seedling, then a young sapling, then an oak.'),
          N('An oak can live for hundreds of years and drop acorns of its own. Moss would approve of the pace.'),
        ],
        parentNote: 'Learned the life cycle of an oak tree, from acorn to seedling to sapling to tree.',
      },
      {
        id: 'reader:s1-complete-l2',
        domain: 'social-studies',
        skill: 'spoken memories and written records',
        standard: 'D2.His.2.K-2',
        kind: 'ask',
        after: 7,
        prompt: [N('Moss remembers. Your journal records. Why might a valley want both?')],
        options: [
          {
            label: 'Writing lasts even when the teller is gone, and telling keeps the feeling in it.',
            best: true,
            reply: [N('Yes. Historians use both: what people wrote, and what people remember and tell.')],
          },
          {
            label: 'It doesn’t. Writing is always better.',
            reply: [
              N('Writing does last. But a written page can’t answer questions or do Briar’s laugh.'),
              N('Historians use both: what people wrote down, and what people remember and tell.'),
            ],
          },
          {
            label: 'It doesn’t. Telling is always better.',
            reply: [
              N('Telling is wonderful. But tellers grow old, and memories slip.'),
              N('Writing it down keeps it safe. Historians use both, side by side.'),
            ],
          },
        ],
        parentNote: 'Compared oral history with written records and why both matter.',
      },
    ],
  },
];

const S1_GLOSSARY: GlossaryEntry[] = [
  { word: 'oral history', meaning: 'The past as people remember it and tell it out loud, passed from one person to the next.', scene: 'reader:s1-ask' },
  { word: 'memorial', meaning: 'Something that helps people remember someone who has died, like a flower or a stone.', scene: 'reader:s1-briar' },
  { word: 'dignity', meaning: 'Staying calm and proud, even when something silly or hard is happening.', scene: 'reader:s1-boats' },
  { word: 'tradition', meaning: 'Something a group does again and again, often every year, in the same way.', scene: 'reader:s1-boats' },
  { word: 'casual', meaning: 'Relaxed and not bothered, or pretending to be.', scene: 'reader:s1-wall-ask' },
  { word: 'grief', meaning: 'The deep sadness you feel when someone you love has died.', scene: 'reader:s1-hush' },
  { word: 'simile', meaning: 'A comparison that uses “like” or “as”, such as “quiet as a mouse”.', scene: 'reader:s1-hush' },
  { word: 'dusk', meaning: 'The time just after sunset, when the sky is still glowing but getting dark.', scene: 'reader:s1-pond-ask' },
  { word: 'grumbled', meaning: 'Complained in a low, cross voice.', scene: 'reader:s1-hazel' },
  { word: 'thaw', meaning: 'When ice and snow melt because the weather is warming up.', scene: 'reader:s1-hazel' },
  { word: 'metaphor', meaning: 'Saying one thing is another to describe it, such as “the frost’s white fingers”.', scene: 'reader:s1-cinder' },
  { word: 'record', meaning: 'Something written or saved so that people can find out about it later.', scene: 'reader:s1-complete' },
];

// ================================================================== S2 Wisp
const S2_MOSS_RULE = M('Hazel’s first rule: feed them before you feed yourself. She never said “only the good ones”. I checked. I was there.', 'soft');

const S2_SCENES: EduScene[] = [
  {
    id: 'reader:s2-fruit',
    of: 's2-fruit',
    band: 'reader',
    lines: [
      N('Morning. The fruit you left for Sable is gone.'),
      N('That should be good news. But Sable is curled in the long grass looking thinner, not fatter.'),
      N('There is frost on the grass round her, though it is nearly midsummer.'),
      LU('You’ve seen the frost. Good. Most people see frost at midsummer and go in for a cardigan.', 'think'),
      LU('I saw her eat one piece last night. Then something else came out of the dark and took the rest.'),
      LU('Not shared. Took.'),
      Y('Another Nubbin?'),
      LU('A grey one. Thinner than her. He flinches at every sound, as if somebody might kick him.', 'sad'),
      LU('Sit up tonight. Leave the fruit where you always do, and keep still. Still as a post.'),
      LU('He wants something here. I’d like to know what, before he takes it.'),
    ],
    lessons: [
      {
        id: 'reader:s2-fruit-l1',
        domain: 'science',
        skill: 'what frost is and when it forms',
        standard: '2-ESS2-3',
        kind: 'notice',
        after: 2,
        lines: [
          LU('Frost is water from the air that freezes onto cold grass, in tiny ice crystals.', 'think'),
          LU('It only forms when the ground is at freezing or colder: 0°C (32°F). In midsummer, that’s very strange.'),
        ],
        parentNote: 'Learned that frost is frozen water from the air, and forms at 0°C (32°F) or below.',
      },
      {
        id: 'reader:s2-fruit-l2',
        domain: 'social-studies',
        skill: 'sharing versus taking',
        standard: 'D2.Civ.8.K-2',
        kind: 'ask',
        after: 5,
        prompt: [LU('“Not shared. Took.” Do you know what I mean by the difference?')],
        options: [
          {
            label: 'Sharing is when the owner chooses to give. Taking is grabbing without asking.',
            best: true,
            reply: [LU('That’s it. Sable didn’t choose. That’s what bothers me.', 'think')],
          },
          {
            label: 'There’s no difference. The fruit’s gone either way.',
            reply: [
              LU('In the morning it looks the same, doesn’t it? An empty dish.', 'soft'),
              LU('But sharing is when the owner chooses to give. Taking is when nobody asks. Sable didn’t get a choice.'),
            ],
          },
        ],
        parentNote: 'Explained the difference between sharing (a choice) and taking (no choice).',
      },
    ],
  },
  {
    id: 'reader:s2-thief',
    of: 's2-thief',
    band: 'reader',
    lines: [
      N('Past midnight. Sable creeps out of the grass to the fruit and takes one bite.'),
      N('Then the grass parts again. Something comes through: grey, thin as a stick, one ear torn to a fringe.'),
      N('He shoulders her aside, not hard, and drags the fruit towards the dark. Sable lets him.'),
      N('Then he sees your lantern. He creeps up to it and presses his cheek against the warm glass.'),
      N('He is shaking. He keeps shaking, even there.'),
      N('Then he sees you.'),
      W('Hsss. Hers. Not yours. Not hands.', 'angry'),
      N('And under the hiss, much smaller, comes another voice.'),
      W('…she ate. she ate today. good.', 'soft'),
      N('He is gone before you can breathe out. Sable stares at the place where he went for a long time.'),
      LU('Greys don’t talk. They don’t. I’ve known a dozen.', 'shock'),
      LU('Something’s talking through the cracks in that one. Two somethings.', 'think'),
      LU('Call him Wisp. He’ll hate it. Everyone should have a name they hate a little.', 'soft'),
    ],
    lessons: [
      {
        id: 'reader:s2-thief-l1',
        domain: 'science',
        skill: 'heat moves from warmer things to cooler things',
        standard: '4-PS3-2',
        kind: 'notice',
        after: 3,
        lines: [
          N('Heat always moves from a warmer thing to a cooler thing.'),
          N('The candle warms the glass. The glass warms his cold cheek. He has found the warmest thing in the Grove.'),
        ],
        parentNote: 'Learned that heat flows from warmer objects to cooler ones.',
      },
      {
        id: 'reader:s2-thief-l2',
        domain: 'literacy',
        skill: 'what a character’s words reveal about him',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 9,
        prompt: [LU('He has two voices. The hiss and the whisper. What does the little whisper tell us about him?', 'think')],
        options: [
          {
            label: 'He cares whether Sable has eaten.',
            best: true,
            reply: [LU('Yes. The hiss says “go away”. The whisper says “she ate, good”. Both are him.', 'soft')],
          },
          {
            label: 'He only wants the fruit.',
            reply: [
              LU('That’s what the hiss would have us think.', 'think'),
              LU('But listen to the whisper again: “she ate today. good.” He’s glad she ate. He cares about her.'),
            ],
          },
          {
            label: 'He’s angry at everyone.',
            reply: [
              LU('The hiss is angry, yes.', 'soft'),
              LU('But the whisper is glad Sable ate. Underneath the hiss, he cares about her.'),
            ],
          },
        ],
        parentNote: 'Used a character’s words to work out his hidden feelings.',
      },
    ],
  },
  {
    id: 'reader:s2-missing',
    of: 's2-missing',
    band: 'reader',
    lines: [
      N('Over the next days, things go missing from the Grove. Not just fruit now. Warm things.'),
      FE('Someone’s had my left glove. Left me the right. I can’t decide if that’s cruel or considerate.', 'think'),
      N('Your left sock, off the line. A candle stub from the cottage window. The tea cosy, which nobody admits to missing.'),
      N('And the round stone Hazel kept by the hearth for warming eggs. Its dish is empty.'),
      CL('He’s cold. That’s all it is. Can’t we feed him too? I can see the light through his ears.', 'sad'),
      LU('Shoo him off, Clover. I mean it.', 'angry'),
      LU('Every time Sable gets near a hand, he hisses at it. And she listens. She was taught to listen to that voice.'),
      CL('He was taught too. Somebody taught him.', 'soft'),
      LU('…I know. It doesn’t make him any quieter.', 'sad'),
      N('In the fork of the fruit tree, Wisp licks his torn ear and watches you, like something that has been right before.'),
      N('Below him, Sable licks her own ear, then checks it for a tear. There isn’t one, and she looks quite put out.'),
    ],
    lessons: [
      {
        id: 'reader:s2-missing-l1',
        domain: 'science',
        skill: 'insulation: materials that keep warmth in',
        standard: '2-PS1-1',
        kind: 'ask',
        after: 3,
        prompt: [CL('He only takes warm things. Which of these keeps warmth in best, by trapping air?', 'think')],
        options: [
          {
            label: 'The woolly glove and the tea cosy',
            best: true,
            reply: [
              CL('Yes. Wool and padding hold lots of tiny pockets of still air. Heat moves through still air very slowly.'),
              CL('That’s insulation. And the stone? Warmed by a fire, a stone holds its heat and lets it out slowly.'),
            ],
          },
          {
            label: 'The candle stub',
            reply: [
              CL('A lit candle makes heat, true. But it doesn’t keep heat in.', 'soft'),
              CL('Wool and padding do. They trap tiny pockets of still air, and heat moves through still air slowly. That’s insulation.'),
            ],
          },
          {
            label: 'A metal spoon',
            reply: [
              CL('Metal lets heat rush straight through it. A spoon in hot tea gets hot fast.', 'soft'),
              CL('Wool and padding keep warmth in. They trap tiny pockets of still air. That’s insulation.'),
            ],
          },
        ],
        parentNote: 'Sorted materials by how well they keep heat in, and learned the word insulation.',
      },
      {
        id: 'reader:s2-missing-l2',
        domain: 'maths',
        skill: 'share equally into two groups',
        standard: '3.OA.A.3',
        kind: 'do',
        after: 9,
        check: 'edu:share:fruit:6-each',
        lines: [
          CL('Just in case. Twelve fruit. Two piles. If we feed him, it’s got to be fair.', 'soft'),
          N('(Put the fruit into two equal piles.)'),
          CL('Six and six. Twelve shared between two is six each. Nobody can say that isn’t fair.', 'happy'),
        ],
        parentNote: 'Divided 12 into 2 equal groups of 6.',
      },
    ],
    choices: [
      {
        id: 'feed-both',
        label: 'Put down two piles of fruit: one each.',
        set: { 's2-early': 'fed' },
        friendship: { clover: 2 },
        then: [
          N('Wisp waits until you are far away and eats his pile. Then he eats most of hers.'),
          CL('That’s not quite how I pictured it. But he did eat.', 'sad'),
        ],
      },
      {
        id: 'shoo',
        label: 'Clap your hands and shoo him off.',
        set: { 's2-early': 'shooed' },
        friendship: { luna: 2, clover: -1 },
        then: [
          N('Wisp bolts to the edge of the grass and no further. Sable flinches at the clap too.'),
          LU('Not the hands. Never the hands. Use your voice next time.', 'think'),
        ],
      },
      {
        id: 'wait',
        label: 'Sit down where you are, and wait.',
        set: { 's2-early': 'waited' },
        friendship: { luna: 1, clover: 1 },
        then: [
          N('You sit. Wisp hisses until he runs out of hiss, and Sable eats, watching you both.'),
          LU('That works on her. I didn’t know it worked on him.', 'think'),
        ],
      },
    ],
  },
  {
    id: 'reader:s2-rain',
    of: 's2-rain',
    band: 'reader',
    lines: [
      N('It has rained for a day and a night. The stream is over its stones, brown and loud.'),
      N('Behind the cottage, where the chimney bricks hold the day’s heat, the woodpile has slumped into a pool.'),
      N('Under it is a nest, or what is left of one: Fern’s glove, the sock, the tea cosy, all sodden through.'),
      N('And Wisp, on the last dry log, shaking so hard the water ripples round him. Hazel’s egg stone is in his paws.'),
      W('mine. warm. mine.', 'soft'),
      W('…was warm. was.', 'soft'),
      N('He tries to stand, and his legs fold. He is too cold to hiss.'),
      CL('The bathhouse is warm. Hazel kept it warm for exactly this. Please.', 'sad'),
      LU('If you carry him, he’ll fight. Hold him anyway. Hold him like you expected it.', 'soft'),
      N('Across the yard, in the long grass, Sable is watching. She has seen hands pick up a Nubbin before.'),
    ],
    lessons: [
      {
        id: 'reader:s2-rain-l1',
        domain: 'science',
        skill: 'why wet things can’t keep you warm',
        standard: '4-PS3-2',
        kind: 'notice',
        after: 2,
        lines: [
          CL('A soaked glove can’t keep anything warm. The water fills up all the little air pockets.', 'sad'),
          CL('And water carries heat away much faster than air does. That’s why wet and cold is the worst cold.'),
        ],
        parentNote: 'Learned that wet materials lose their insulation because water carries heat away faster than air.',
      },
    ],
    choices: [
      {
        id: 'carry',
        label: 'Pick him up. Hold on.',
        set: { 's2-carried': true },
        friendship: { clover: 2, luna: 1 },
        then: [
          N('He fights, then stops fighting. He weighs less than the stone he won’t let go of.'),
          N('In the steam of the bathhouse his fur lifts and his eyes go sharp. He looks at your hands, and bites one, hard.'),
          W('Hsss. Hands. Hands, hands.', 'angry'),
          N('He scrambles to the warmest corner with the stone, and glares until his tail stops dripping.'),
          N('He tucks the stone under his chin, like a very small and very cross violinist.'),
          CL('He’s warm now. Look at him. Warm right through.', 'soft'),
          N('He is. And he is still shaking.'),
          N('Clover sets a pear by his paws. He eats it in three bites, still glaring at your hands.'),
        ],
      },
      {
        id: 'clover',
        label: 'Fetch a blanket, and let Clover lift him.',
        set: { 's2-carried': false },
        friendship: { clover: 1 },
        then: [
          N('Clover wraps him up like a loaf and carries him in at a run, talking to him the whole way.'),
          N('In the steam of the bathhouse his fur lifts and his eyes go sharp. He bites her, hard, through the blanket.'),
          CL('Ow. Yes. All right. That’s fair.', 'sad'),
          N('He scrambles to the warmest corner with the stone. He is warm now, right through.'),
          N('And he is still shaking.'),
          N('Clover sets a pear by his paws. He eats it in three bites, still glaring at your hands.'),
        ],
      },
    ],
  },
  {
    id: 'reader:s2-number',
    of: 's2-number',
    band: 'reader',
    lines: [
      CL('Warm. Dry. Fed. And look at him.', 'sad'),
      LU('…Then it was never the cold.', 'sad'),
      N('Nobody says anything for a while. The rain drums on the bathhouse roof.'),
      N('High on Wisp’s side, half washed off, is a number someone once painted on in grey.'),
      LU('That paint. I’ve seen that paint before. Square numbers, very neat.', 'think'),
      LU('I’m going to ask around. Don’t tell Sable. I know that’s silly.'),
      N('When you come out, Sable is by the bathhouse door. She sniffs your hands very carefully, and doesn’t run.'),
    ],
    lessons: [
      {
        id: 'reader:s2-number-l1',
        domain: 'health',
        skill: 'how fear shows in the body',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 1,
        prompt: [CL('He’s warm and dry now, and still shaking. Why?', 'sad')],
        options: [
          {
            label: 'He’s frightened.',
            best: true,
            reply: [
              CL('Yes. Fear lives in the body too. It can make you shake, breathe fast and feel your heart thump.', 'soft'),
              CL('Getting warm fixes cold. It doesn’t fix scared. That takes much longer.'),
            ],
          },
          {
            label: 'He’s still a bit cold.',
            reply: [
              CL('That’s what we thought. But he’s warm right through now. Feel the air in here.', 'soft'),
              CL('It’s fear. Fear can make a body shake, breathe fast and thump inside. Warmth doesn’t fix that.'),
            ],
          },
          {
            label: 'He’s excited about the stone.',
            reply: [
              CL('He does love that stone.', 'soft'),
              CL('But look at his ears, flat back. He’s frightened. Fear can make a body shake, even somewhere warm.'),
            ],
          },
        ],
        parentNote: 'Learned that fear shows in the body (shaking, fast breathing, a racing heart).',
      },
      {
        id: 'reader:s2-number-l2',
        domain: 'literacy',
        skill: 'noticing clues',
        kind: 'notice',
        after: 4,
        lines: [
          N('Luna is collecting clues: grey paint, square numbers, very neat. Small details that hint at a bigger answer.'),
          N('Good readers do the same. They notice the small things the story puts in on purpose.'),
        ],
        parentNote: 'Noticed how small details in a story can be clues to something bigger.',
      },
      {
        id: 'reader:s2-number-l3',
        domain: 'sel',
        skill: 'seeing a moment from someone else’s side',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 6,
        prompt: [N('Sable watched you carry Wisp. Now she sniffs your hands. How might she feel about hands today?')],
        options: [
          {
            label: 'Nervous, because hands once meant something bad.',
            best: true,
            reply: [
              LU('That’s what I think too. She sniffed carefully, and she didn’t run. She’s learning what hands are for.', 'soft'),
            ],
          },
          {
            label: 'Happy that someone is helping.',
            reply: [
              LU('Maybe, a little, underneath. I hope so.', 'soft'),
              LU('But hands hurt a Nubbin once, and she saw. She’s probably still nervous. So keep being gentle.'),
            ],
          },
          {
            label: 'She doesn’t care.',
            reply: [
              LU('She sniffed very carefully for someone who doesn’t care.', 'soft'),
              LU('I think she’s nervous. Hands have hurt before. Keep being gentle where she can see.'),
            ],
          },
        ],
        parentNote: 'Imagined how a character might feel based on what has happened to her before.',
      },
    ],
  },
  {
    id: 'reader:s2-night',
    of: 's2-night',
    band: 'reader',
    lines: [
      N('Night, from Luna’s garden. The moonflowers are open. Two grey shapes sit at the edge of the Grove.'),
      LU('Get down. Listen.', 'soft'),
      N('Wisp is close to Sable, closer than he lets anyone get. Tonight his voice is all whisper.'),
      W('hands are for throwing. they all throw. in the end.', 'soft'),
      W('come back to the dark. no hands there. the dark never threw anyone.', 'soft'),
      N('Sable doesn’t answer. She looks at Wisp, then at your window. She moves towards neither.'),
      LU('Moss says the cold leaves them half a voice. And he’s spending all of it talking her out of the Grove.', 'angry'),
      N('Clover has crept up behind you in a dressing gown, hugging a bag of fruit like a secret.'),
      CL('You don’t feed him because he’s earned it. You feed him because you’re you.', 'soft'),
      LU('He bit the hand that carried him, Clover.', 'angry'),
      CL('He was cold. I’d have bitten too.', 'soft'),
      LU('Sable leaned on a shin this week. A shin! Do you know how far that is, for her?', 'think'),
      LU('One more month of that voice in her ear and she’ll be back under a hedge. She won’t come out twice.'),
      LU('I’m not choosing against him. I’m choosing her. Somebody has to.', 'sad'),
      CL('And where does he go? Back to the dark. On his own. Talking to nobody.', 'sad'),
      N('Neither of them looks at you. They both very carefully don’t.'),
    ],
    lessons: [
      {
        id: 'reader:s2-night-l1',
        domain: 'science',
        skill: 'night-flowering plants and their pollinators',
        standard: '2-LS2-2',
        kind: 'notice',
        after: 0,
        lines: [
          LU('Moonflowers open at dusk, not in the day. They’re big and white, so they show up in the dark.', 'soft'),
          LU('Moths that fly at night visit them for nectar, and carry pollen from flower to flower.'),
        ],
        parentNote: 'Learned that some flowers open at night and are pollinated by night-flying moths.',
      },
      {
        id: 'reader:s2-night-l2',
        domain: 'sel',
        skill: 'think question: mercy',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 15,
        prompt: [
          N('Being kind to someone who hasn’t earned it is called mercy. Luna and Clover both love Sable.'),
          N('Should you keep feeding someone who bit you? What do you think?'),
        ],
        options: [
          {
            label: 'Yes. Kindness shouldn’t depend on being thanked.',
            reply: [CL('That’s a fair answer. It’s mine, too. He was taught to bite. Maybe he can be taught something else.', 'soft')],
          },
          {
            label: 'No. Sable has to come first.',
            reply: [LU('Somebody has to put Sable first. That doesn’t mean you don’t care about Wisp.', 'soft')],
          },
          {
            label: 'Let Sable choose. It’s her life too.',
            reply: [
              LU('A brave answer.', 'think'),
              CL('I’d only wonder: is that a big choice to hand someone so small?', 'soft'),
            ],
          },
          {
            label: 'I don’t know. They’re both right.',
            reply: [N('Both can be right. That’s what makes it hard.')],
          },
        ],
        parentNote: 'Thought about mercy and a hard choice between two good reasons; there was no wrong answer.',
      },
    ],
    choices: [
      {
        id: 'spared',
        label: 'Keep feeding him. Even after the bite.',
        set: { wisp: 'spared' },
        friendship: { clover: 3, luna: 1 },
        then: [
          N('In the morning you put down two piles of fruit, not one. And the next morning, and the one after.'),
          N('Wisp eats his with his back to you. On the fourth morning, he eats it facing you.'),
          W('hands are for throwing. hands are for… not hers. maybe not hers.', 'soft'),
          N('Sable sees. Sable sees everything. She comes one step closer than she did yesterday.'),
          N('It isn’t free. Your other sock goes missing on the fifth morning, and the hiss is still there most nights.'),
          LU('He’s still talking to her. I can hear him. I hope you’re right.', 'think'),
        ],
      },
      {
        id: 'driven',
        label: 'Drive him off. Sable needs the quiet.',
        set: { wisp: 'driven' },
        friendship: { luna: 2, clover: -3 },
        then: [
          N('You walk at him, steady, not fast, until he backs into the long grass. Then further. Then gone.'),
          W('Hsss. See? See? Hands.', 'angry'),
          N('Sable watches him go and doesn’t follow. She doesn’t look at you for the rest of the night, either.'),
          N('But near dawn she eats her whole pile, every scrap, and sleeps in the open where you can see her.'),
          LU('It was the sensible thing. I keep telling myself so.', 'sad'),
          CL('I know it was. I’m still not speaking to you till Thursday.', 'sad'),
        ],
      },
      {
        id: 'sable',
        label: 'Let Sable decide.',
        set: { wisp: 'sable' },
        friendship: { luna: 3, clover: 3 },
        then: [
          N('You put down one pile of ten fruit between them, and step back.'),
          N('Sable looks at it, then at you. Then she pushes half the pile across the grass with her nose, to Wisp.'),
          W('…hers. she gave. hers.', 'soft'),
          N('He eats it at the very edge of the Grove. When he has finished, he doesn’t leave. He just doesn’t come in.'),
          LU('Well. That’s a better answer than either of ours.', 'soft'),
          CL('Or we’ve just handed the smallest one here the biggest choice, because we couldn’t make it.', 'think'),
          LU('…Yes. That too.', 'soft'),
        ],
      },
    ],
  },
  {
    id: 'reader:s2-complete',
    of: 's2-complete',
    band: 'reader',
    lines: [
      N('Morning. Frost on the grass at the edge of the Grove, in two small circles where two grey things slept.'),
      N('Wisp is curled in one of them, the egg stone between his paws. It has been cold for weeks. He keeps it anyway.'),
      M('He’ll never give that back, you know. Not if he lives to be as old as me.', 'think'),
      S2_MOSS_RULE,
      N('…'),
      M('Grey things remember who fed them. That’s all I’ll say. I’m old, and I’ve seen it go both ways.', 'soft'),
    ],
    lessons: [
      {
        id: 'reader:s2-complete-l1',
        domain: 'science',
        skill: 'warm things cool to match their surroundings',
        standard: '4-PS3-2',
        kind: 'ask',
        after: 1,
        prompt: [M('That stone was warm by Hazel’s fire once. It’s been cold for weeks. Where did its warmth go?', 'think')],
        options: [
          {
            label: 'Out into the cooler air and ground around it.',
            best: true,
            reply: [M('Yes. Heat leaks from warm things into cooler things, until they’re all the same. He keeps it anyway.', 'soft')],
          },
          {
            label: 'Wisp ate it.',
            reply: [
              M('He’d try, if he could. He can’t.', 'happy'),
              M('The heat leaked out into the cooler air and ground, a little at a time, until the stone matched them.'),
            ],
          },
          {
            label: 'It’s still inside, hiding.',
            reply: [
              M('A lovely thought. Not quite.', 'soft'),
              M('Heat always moves from warm to cool. It leaked out into the air and ground until the stone matched them.'),
            ],
          },
        ],
        parentNote: 'Explained that warm objects lose heat to cooler surroundings until they match.',
      },
      {
        id: 'reader:s2-complete-l2',
        domain: 'literacy',
        skill: 'theme: the big idea a story keeps returning to',
        standard: 'RL.4.2',
        kind: 'notice',
        after: 5,
        lines: [
          M('Every story keeps asking one thing. This one asks who deserves kindness. That’s called its theme.', 'soft'),
          N('Moss’s answer is in Hazel’s rule.'),
        ],
        parentNote: 'Identified the theme of a story: who deserves kindness, and mercy.',
      },
    ],
  },
];

const S2_GLOSSARY: GlossaryEntry[] = [
  { word: 'fringe', meaning: 'A ragged edge of loose threads or strands, like the end of a scarf.', scene: 'reader:s2-thief' },
  { word: 'hearth', meaning: 'The floor in front of a fireplace.', scene: 'reader:s2-missing' },
  { word: 'insulation', meaning: 'Material that slows heat from escaping, such as wool, feathers or padding.', scene: 'reader:s2-missing' },
  { word: 'sodden', meaning: 'Completely soaked with water.', scene: 'reader:s2-rain' },
  { word: 'clue', meaning: 'A small detail that helps you work something out.', scene: 'reader:s2-number' },
  { word: 'mercy', meaning: 'Kindness shown to someone, even when they haven’t earned it.', scene: 'reader:s2-night' },
  { word: 'theme', meaning: 'The big idea or message a story keeps coming back to.', scene: 'reader:s2-complete' },
];

// ---------------------------------------------------------------- S2 variants (replace s2-complete)
const S2_VARIANTS: EduScene[] = [
  {
    id: 'reader:s2-complete-sable',
    of: 's2-complete-sable',
    band: 'reader',
    lines: [
      N('Morning. Frost on the grass at the edge of the Grove, in two small circles, side by side.'),
      N('Wisp is still at the edge, the egg stone between his paws. He hasn’t come in. He hasn’t gone, either.'),
      M('She chose. That’s worth more than anything we’d have chosen for her.', 'soft'),
      S2_MOSS_RULE,
      N('…'),
      M('Grey things remember who fed them. That’s all I’ll say. I’m old, and I’ve seen it go both ways.', 'soft'),
    ],
    lessons: [
      {
        id: 'reader:s2-complete-sable-l1',
        domain: 'maths',
        skill: 'finding half of a group',
        standard: '3.NF.A.1',
        kind: 'ask',
        after: 2,
        prompt: [M('There were ten fruit in last night’s pile. She pushed half of them across to him. How many did she give?')],
        options: [
          { label: '5', best: true, reply: [M('Five. Half of ten is five: two equal parts, five and five. Exactly fair. She measured it with her nose.', 'happy')] },
          {
            label: '2',
            reply: [
              M('That would be a very small half.', 'soft'),
              M('Half means two equal parts. Ten split into two equal parts is five and five. She gave five.'),
            ],
          },
          {
            label: '8',
            reply: [
              M('That would leave her only two. Generous, but not half.', 'soft'),
              M('Half means two equal parts. Ten makes five and five. She gave five, and kept five.'),
            ],
          },
        ],
        parentNote: 'Found one half of 10 by splitting it into two equal parts.',
      },
      {
        id: 'reader:s2-complete-sable-l2',
        domain: 'sel',
        skill: 'respecting someone’s right to choose',
        standard: 'CASEL: Responsible decision-making',
        kind: 'notice',
        after: 5,
        lines: [
          M('When we let someone choose something about their own life, we show them respect.', 'soft'),
          M('Even when they’re small. Especially then. Nobody had ever let her choose anything before.'),
        ],
        parentNote: 'Talked about respecting others’ choices about their own lives.',
      },
    ],
  },
  {
    id: 'reader:s2-complete-driven',
    of: 's2-complete-driven',
    band: 'reader',
    lines: [
      N('Morning. Frost on the grass at the edge of the Grove, in one small circle where one grey thing slept.'),
      N('In the hedge there is a gap the size of a thin Nubbin, and a sock caught on a thorn.'),
      N('Sable sits by the gap for most of the morning. Then she comes back and eats her fruit, all of it.'),
      LU('She’s eating. That’s what we wanted.', 'sad'),
      M('Yes.', 'soft'),
      CL('It’s Thursday. I’m speaking to you again.', 'soft'),
      CL('I’ve hung a blanket on the hedge. In case anyone thin comes past. Nobody in particular.', 'soft'),
      N('…'),
      M('Sensible things are sometimes right. It doesn’t make them warm.', 'soft'),
    ],
    lessons: [
      {
        id: 'reader:s2-complete-driven-l1',
        domain: 'sel',
        skill: 'having two feelings at once',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 3,
        lines: [
          N('Luna is glad Sable is eating. She is also sad about Wisp. Both at once.'),
          N('You can feel two feelings at the same time, even opposite ones. Both are real, and both are allowed.'),
        ],
        parentNote: 'Learned that people can feel mixed emotions, like glad and sad, at the same time.',
      },
      {
        id: 'reader:s2-complete-driven-l2',
        domain: 'literacy',
        skill: 'understanding what a character means',
        standard: 'RL.4.2',
        kind: 'ask',
        after: 8,
        prompt: [N('Moss says, “Sensible things are sometimes right. It doesn’t make them warm.” What does he mean?')],
        options: [
          {
            label: 'A choice can be wise and still feel sad or unkind.',
            best: true,
            reply: [M('Yes. It was a sensible choice. Sable is eating. And somewhere out there, Wisp is on his own.', 'soft')],
          },
          {
            label: 'It’s a cold morning.',
            reply: [
              M('It is. But I meant the other kind of warm.', 'soft'),
              M('A choice can be wise and still feel sad. Sable is eating. And Wisp is out there on his own.'),
            ],
          },
          {
            label: 'You made the wrong choice.',
            reply: [
              M('No. I didn’t say that, and I don’t think it.', 'soft'),
              M('I said it was sensible, and perhaps right. Only that right choices can still feel sad.'),
            ],
          },
        ],
        parentNote: 'Explained the meaning behind a character’s line about wise choices that still feel sad.',
      },
    ],
  },
];

// ================================================================== S3 The Cycle
const S3_SCENES: EduScene[] = [
  {
    id: 'reader:s3-stands',
    of: 's3-stands',
    band: 'reader',
    lines: [
      N('The stands at the Circuit, the valley’s race track, are split down the middle: Sun Keepers on the left, Moon Keepers on the right.'),
      FE('Don’t sit there. That’s the gap. Nobody sits in the gap.', 'think'),
      Y('Why not?'),
      FE('Because it’s the gap. Hazel sat in it every race, on purpose, to annoy everyone.', 'think'),
      N('At the front stand two tea urns, one with a sun painted on it and one with a moon. Each queue is certain the other urn’s tea is worse.'),
      SP('Years ago, at Midsummer, Bramble fell over the cliff rail.', 'shock'),
      SP('Sun says Ash barged her. Moon says the race was rigged.'),
      SP('Right. Bye.'),
      N('Sparks sits down very fast and studies the race card as if it holds the meaning of life.'),
      SP('I didn’t say any of that. That was the wind.'),
      N('This is a feud: a quarrel that has gone on for years. Both sides pretend not to listen. Both are bad at it.'),
      N('Up in the owners’ box, Corvin, Gran Hazel’s old apprentice, isn’t watching the start line. He’s watching the stands.'),
    ],
    lessons: [
      {
        id: 'reader:s3-stands-l1',
        domain: 'social-studies',
        skill: 'fairness: staying on nobody’s side',
        standard: 'D2.Civ.8.K-2',
        kind: 'ask',
        after: 3,
        prompt: [FE('Go on, guess. Why do you think Hazel really sat in the gap?', 'think')],
        options: [
          {
            label: 'To show she was on nobody’s side, and they were all still one valley.',
            best: true,
            reply: [FE('That’s what she said. Also to annoy everyone. Mostly the first thing.', 'happy')],
          },
          {
            label: 'She got there late.',
            reply: [
              FE('Hazel was never late in her life. Early, and cross about it.', 'happy'),
              FE('No, she sat there on purpose: to show she wasn’t on either side. One valley, she used to say.'),
            ],
          },
          {
            label: 'It was the best seat.',
            reply: [
              FE('Byte says it’s the worst seat. He’s checked.', 'think'),
              FE('She sat there to show she was on nobody’s side. To remind us we’re one valley.'),
            ],
          },
        ],
        parentNote: 'Thought about how staying neutral can help people in a quarrel remember what they share.',
      },
    ],
    choices: [
      {
        id: 'gap',
        label: 'Sit in the gap, like Hazel did.',
        set: { 's3-seat': 'gap' },
        then: [
          N('You sit in the gap. Five heads turn from the left, and five from the right.'),
          FE('Oh, you’re hers all right.', 'happy'),
          BY('That is the worst seat. You can’t see the cliff bend. I’ve checked.', 'think'),
        ],
      },
      {
        id: 'sun',
        label: 'Sit with the Sun side.',
        set: { 's3-seat': 'sun' },
        then: [
          SP('YES. Sun gets the new Keeper! Sun gets the new Keeper!', 'happy'),
          N('Across the gap, a Moon Keeper writes something in a very small notebook.'),
        ],
      },
      {
        id: 'moon',
        label: 'Sit with the Moon side.',
        set: { 's3-seat': 'moon' },
        then: [
          BY('Welcome. Our biscuits are better. I ran a blind taste test. It was mostly blind.', 'happy'),
          FE('Traitor. Lovely to see you. Traitor.', 'happy'),
        ],
      },
    ],
  },
  {
    id: 'reader:s3-two-stories',
    of: 's3-two-stories',
    band: 'reader',
    lines: [
      N('You get two stories. They agree about the weather and nothing else.'),
      N('Sun says: Ember’s Ash came round the cliff bend like a cannonball, and Fern’s Bramble went over the rail.'),
      N('Moon says: the cliff-bend flag was in the wrong place, so Ash went wide where the flag told her to.'),
      BY('I have a chart. Both stories, colour-coded. The colours are also disputed.', 'think'),
      BY('Two hundred and fourteen grievances in all. Three are about the race. The rest are about the urns.'),
      BY('I have never tasted the Sun tea. On principle. The principle is also disputed.', 'think'),
      EM('After Midsummer, nobody would race Ash. Not Sun. Not Moon. Do you know who would?', 'angry'),
      EM('Corvin. He said he’d make Ash a champion.', 'sad'),
      N('Nobody, on either side, talks about Bramble after the rail. The story just stops there, like a path at a cliff.'),
    ],
    lessons: [
      {
        id: 'reader:s3-two-stories-l1',
        domain: 'maths',
        skill: 'reading a scaled bar graph',
        standard: '3.MD.B.3',
        kind: 'ask',
        after: 4,
        prompt: [
          BY('This year’s chart. Each square stands for 5 grievances. Urns: 9 squares. Biscuits: 4 squares.', 'think'),
          BY('How many more grievances about the urns than about the biscuits?'),
        ],
        options: [
          {
            label: '25',
            best: true,
            reply: [BY('Correct. Five more squares, and each square is 5. Five fives are 25. I’ve underlined it twice.', 'happy')],
          },
          {
            label: '5',
            reply: [
              BY('That’s the difference in squares. Good start.', 'think'),
              BY('But each square stands for 5 grievances. 5 squares × 5 = 25 more grievances.'),
            ],
          },
          {
            label: '45',
            reply: [
              BY('That’s all the urn grievances: 9 squares × 5 = 45.', 'think'),
              BY('Biscuits have 4 × 5 = 20. So the difference is 45 − 20 = 25.'),
            ],
          },
        ],
        parentNote: 'Read a bar graph where each square stands for 5, and found a difference (25).',
      },
      {
        id: 'reader:s3-two-stories-l2',
        domain: 'science',
        skill: 'evidence: how to settle what really happened',
        kind: 'ask',
        after: 8,
        prompt: [N('Two stories, and they can’t both be right. What would help find out what really happened?')],
        options: [
          {
            label: 'Evidence: something recorded at the time, like a photo.',
            best: true,
            reply: [N('Yes. Evidence doesn’t take sides. A photo taken on the day can’t change its mind afterwards.')],
          },
          {
            label: 'Whoever shouts loudest.',
            reply: [
              N('That’s how they’ve done it for years. It hasn’t worked.'),
              N('Loud isn’t the same as right. You need evidence: something recorded at the time, like a photo.'),
            ],
          },
          {
            label: 'A vote.',
            reply: [
              N('Votes are good for deciding what to do. They can’t decide what already happened.'),
              N('For that, you need evidence: something recorded at the time, like a photo.'),
            ],
          },
        ],
        parentNote: 'Learned that evidence recorded at the time is better than opinion for finding out what happened.',
      },
    ],
  },
  {
    id: 'reader:s3-plates',
    of: 's3-plates',
    band: 'reader',
    lines: [
      N('Sparks turns up at your gate looking like she has swallowed a secret, and it’s fizzing.'),
      SP('OK. OK OK OK. Confession. I’ve got the photo-finish plates from Midsummer. From the camera on the cliff bend. Mine.', 'shock'),
      SP('I never developed them. If it was Ash, Fern would never forgive Ember. If it wasn’t, I’d never forgive me.', 'sad'),
      SP('Trouble is, my darkroom timer’s broken. And the only person in the valley with a timer that works is…'),
      N('She can’t say it. She points up the lane to the Moon end, at a cottage with labels on its windows.'),
      SP('Him.', 'angry'),
    ],
    lessons: [
      {
        id: 'reader:s3-plates-l1',
        domain: 'science',
        skill: 'how a photo finish and old glass plates work',
        kind: 'notice',
        after: 1,
        lines: [
          SP('A photo-finish camera takes a picture right on the line, for when a race is too close for eyes.'),
          SP('Old cameras caught the picture on a glass plate. You develop it in trays of chemicals, in the dark. Then it appears.'),
        ],
        parentNote: 'Learned what a photo finish is and how old photographs were developed on glass plates.',
      },
      {
        id: 'reader:s3-plates-l2',
        domain: 'literacy',
        skill: 'a character’s motive',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 2,
        prompt: [N('Sparks has had these plates for years. Why do you think she never developed them?')],
        options: [
          {
            label: 'She was scared of what they would show, and who would get hurt.',
            best: true,
            reply: [SP('…Yes. Not knowing was horrible. Knowing felt worse. Until now.', 'sad')],
          },
          {
            label: 'She forgot about them.',
            reply: [
              SP('I wish. I thought about them every single race.', 'sad'),
              N('She was scared. Whatever the plates showed, someone she loved would be hurt.'),
            ],
          },
          {
            label: 'She was too busy.',
            reply: [
              SP('I’m always busy. That wasn’t it.', 'sad'),
              N('She was scared of what they’d show. Whatever it was, someone she loved would be hurt.'),
            ],
          },
        ],
        parentNote: 'Worked out why a character avoided doing something (her motive).',
      },
    ],
    choices: [
      {
        id: 'science',
        label: 'Fetch Byte. Tell him it’s for science.',
        set: { 's3-byte': 'science' },
        then: [BY('Science? You should have opened with that. I’ll bring three timers. One to check the other two.', 'happy')],
      },
      {
        id: 'nicely',
        label: 'Fetch Byte. Tell him Sparks asked nicely.',
        set: { 's3-byte': 'nicely' },
        then: [
          BY('She did not.', 'think'),
          N('You admit she did not.'),
          BY('I’ll come anyway. Someone has to see it done properly.'),
        ],
      },
    ],
  },
  {
    id: 'reader:s3-flag',
    of: 's3-flag',
    band: 'reader',
    lines: [
      N('Sparks’s darkroom is red and cramped and smells of vinegar. Byte times, Sparks rocks the trays, and they argue in whispers.'),
      BY('Red lamp only. The plates don’t react to dim red light. Anything brighter and they’re ruined.', 'think'),
      BY('Rock on the count. One, and two, and— that was not two. That was one and a half.', 'think'),
      SP('I rock on FEELING, Byte.', 'angry'),
      N('The first plate swims up out of the dark: an enormous, blurry, perfectly lit thumb.'),
      BY('Your thumb.'),
      SP('It’s a GOOD thumb.', 'angry'),
      N('The second plate comes up slower, on the count: the cliff bend at dawn, before the race. An empty course, and a flag.'),
      N('And a man in a grey Circuit coat, pulling up the flag and moving it.'),
      BY('Two posts nearer the edge. Look at the turf. Old hole there. New hole here.', 'think'),
      SP('Nobody on either side moved that flag. Nobody. It was a steward, one of the race officials.', 'shock'),
      N('The last plate is the finish, with the owners’ box behind it. Corvin isn’t watching the race. He’s watching the stands.'),
      BY('The flag sent them wide. Ash went wide because the course told her to. Bramble went wide because Ash did.', 'sad'),
      SP('We’ve been fighting about the wrong thing for years. Byte. We have two URNS.', 'shock'),
      BY('The urns were your idea.'),
      SP('They were a GOOD idea at the TIME.', 'angry'),
      BY('There’s a thumb on the finish plate too. In the corner.'),
      SP('It’s my signature.', 'happy'),
    ],
    lessons: [
      {
        id: 'reader:s3-flag-l1',
        domain: 'maths',
        skill: 'time as equal groups',
        standard: '3.OA.A.1',
        kind: 'ask',
        after: 3,
        prompt: [BY('Each plate needs 3 minutes in the tray, one plate after another. There are 3 plates. How long altogether? Quickly. Precisely.', 'think')],
        options: [
          { label: '9 minutes', best: true, reply: [BY('Nine. Three lots of three. I’ll set the timer three times.', 'happy')] },
          {
            label: '6 minutes',
            reply: [
              BY('That’s 3 + 3. We have three plates, not two.', 'think'),
              BY('3 + 3 + 3, or 3 × 3. Nine minutes.'),
            ],
          },
          {
            label: '33 minutes',
            reply: [
              SP('That’s how long it FEELS.', 'happy'),
              BY('It’s three lots of three minutes. 3 × 3 = 9. Nine minutes.', 'think'),
            ],
          },
        ],
        parentNote: 'Used multiplication as equal groups to find a total time (3 × 3 = 9 minutes).',
      },
      {
        id: 'reader:s3-flag-l2',
        domain: 'science',
        skill: 'what makes good evidence',
        kind: 'ask',
        after: 9,
        prompt: [N('Byte says the turf proves the flag was moved. What makes the holes such good evidence?')],
        options: [
          {
            label: 'You can still see them, and they don’t belong to either side.',
            best: true,
            reply: [BY('Exactly. Holes don’t have opinions. Holes don’t own an urn.', 'happy')],
          },
          {
            label: 'Byte says so, and he’s clever.',
            reply: [
              BY('I am. But that’s not evidence. That’s just me.', 'think'),
              BY('The holes are evidence because anyone can look and check. They don’t take sides.'),
            ],
          },
          {
            label: 'Holes are always suspicious.',
            reply: [
              N('Dusty would disagree. Strongly.'),
              BY('The holes are good evidence because anyone can see them and check. They don’t take sides.', 'think'),
            ],
          },
        ],
        parentNote: 'Explained that good evidence can be checked by anyone and doesn’t depend on who is speaking.',
      },
    ],
  },
  {
    id: 'reader:s3-courier',
    of: 's3-courier',
    band: 'reader',
    lines: [
      N('Sparks wraps the plates in a tea towel with a sun on it. Byte wraps a second tea towel, with a moon on it, round that.'),
      SP('You show them. They both like you. It’s very annoying.'),
      BY('A neutral courier. I approve. I’d like that noted somewhere.', 'think'),
      N('Neutral: on nobody’s side. Courier: someone who carries things. You are, it seems, both.'),
      N('The plates are heavier than they look. Glass, and years of not knowing.'),
      SP('Be careful with them. And with Fern. And with Ember. Mostly with Ember.', 'soft'),
    ],
    lessons: [
      {
        id: 'reader:s3-courier-l1',
        domain: 'sel',
        skill: 'sharing hard news kindly',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 5,
        prompt: [SP('This news is going to hurt them both. What’s a kind way to share it?', 'soft')],
        options: [
          {
            label: 'Somewhere quiet, gently, and give them time to take it in.',
            best: true,
            reply: [SP('Yes. That. Do that. I’d have shouted it across the Circuit.', 'sad')],
          },
          {
            label: 'Shout it across the Circuit so everyone knows at once.',
            reply: [
              SP('That’s what I’d do. That’s why I’m not doing it.', 'sad'),
              N('Hard news is easier to hear somewhere quiet, said gently, with time to take it in.'),
            ],
          },
          {
            label: 'Leave the plates on their doorsteps without a note.',
            reply: [
              SP('Then they’d find out alone. Nobody should find out alone.', 'soft'),
              N('Hard news is kindest somewhere quiet, said gently, with someone there.'),
            ],
          },
        ],
        parentNote: 'Thought about how to share upsetting news gently and kindly.',
      },
    ],
    choices: [
      {
        id: 'together',
        label: 'Show them together, at the same time.',
        set: { 's3-shown': 'together' },
        then: [
          N('Getting Fern and Ember into one place takes a week. You manage it by telling each that the other might come, which is true if you squint.'),
          FE('You absolute snake. Hazel did that to me once.', 'happy'),
        ],
      },
      {
        id: 'apart',
        label: 'Show them one at a time.',
        set: { 's3-shown': 'apart' },
        then: [
          N('You go to Fern first, then to Ember. Each asks whether the other has seen it yet.'),
          N('By evening both are at the same fence, looking at the same plates. Both swear it’s a coincidence.'),
        ],
      },
    ],
  },
  {
    id: 'reader:s3-truce',
    of: 's3-truce',
    band: 'reader',
    lines: [
      N('Fern looks at the plates for a long time. So does Ember. Neither looks at the other.'),
      EM('I don’t need to be forgiven. I need to know who to be angry at.', 'angry'),
      EM('Corvin. It’s always Corvin. He had Ash by the autumn.', 'sad'),
      FE('All those years. I hated you because of a flag. That’s… horribly clever of him. I’m almost impressed. Almost.', 'sad'),
      EM('There should be a Moot. Everyone. Both sides. Out in the open.', 'think'),
      FE('After midwinter. When there’s time to do it properly. And one urn.', 'think'),
      EM('One urn.', 'soft'),
      N('It’s the first thing they’ve agreed on in years: a truce. They both look faintly ill about it.'),
    ],
    lessons: [
      {
        id: 'reader:s3-truce-l1',
        domain: 'sel',
        skill: 'think question: saying sorry for a mistake you didn’t know you made',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 3,
        prompt: [
          N('Fern blamed Ember for years, and it wasn’t Ember’s fault. Fern didn’t know.'),
          N('Should Fern say sorry? What do you think?'),
        ],
        options: [
          {
            label: 'Yes. She hurt Ember, even by mistake.',
            reply: [N('That’s a fair answer. Fern would probably agree. A mistake still leaves a bruise.')],
          },
          {
            label: 'No. She was tricked. The one who moved the flag should say sorry.',
            reply: [N('That’s a fair answer. Ember says nearly the same: she wants to know who to be angry at.')],
          },
          {
            label: 'They could both say sorry for the years they lost.',
            reply: [N('That’s a fair answer, and a generous one. Sometimes “sorry” just means “I wish it had been different.”')],
          },
        ],
        parentNote: 'Thought about apology and blame when someone was tricked; there was no wrong answer.',
      },
      {
        id: 'reader:s3-truce-l2',
        domain: 'social-studies',
        skill: 'meetings where people settle things together',
        standard: 'D2.Civ.8.K-2',
        kind: 'notice',
        after: 7,
        lines: [
          N('“Moot” is a very old English word for a meeting where people come together to talk things out.'),
          N('Long ago, English villages held moots to settle quarrels and agree on rules, out in the open.'),
        ],
        parentNote: 'Learned the old word “moot” and how communities met to settle disagreements fairly.',
      },
    ],
  },
  {
    id: 'reader:s3-invitations',
    of: 's3-invitations',
    band: 'reader',
    lines: [
      N('Pixel has been put in charge of the invitations. So there is a planning meeting about the invitations.'),
      PX('Gold ink or silver? Gold is Sun. Silver is Moon. Black is a funeral. I’ve tested twelve inks. Everything means something.', 'think'),
      CL('Green? Nobody’s green.', 'soft'),
      PX('…Clover, that’s genius. Green. Nobody’s green.', 'shock'),
      N('Dusty has offered to dig a hole for the one urn. Nobody asked for a hole, and nobody has the heart to say so.'),
      NO('I’ve been to this valley four times and I still don’t know if I’m Sun or Moon. Somebody said it’s my scarf.', 'think'),
      NO('I’ve decided I’m weather.', 'happy'),
      LU('Ember says she’s coming “to make sure it’s done right”. That’s Ember for yes.', 'soft'),
    ],
    lessons: [
      {
        id: 'reader:s3-invitations-l1',
        domain: 'art',
        skill: 'mixing colours to make green',
        kind: 'ask',
        after: 3,
        prompt: [PX('Problem. I have twelve inks and none of them is green. Which two paints do I mix?', 'think')],
        options: [
          { label: 'Yellow and blue', best: true, reply: [PX('Yellow and blue. Green! I knew that. I wanted to see if you knew that.', 'happy')] },
          {
            label: 'Red and blue',
            reply: [
              PX('That makes purple. Lovely, but very royal. Nobody wants to be royal.', 'think'),
              PX('Yellow and blue make green.'),
            ],
          },
          {
            label: 'Red and yellow',
            reply: [
              PX('That makes orange. Very Sun. Too Sun.', 'think'),
              PX('Yellow and blue make green.'),
            ],
          },
        ],
        parentNote: 'Practised colour mixing: yellow and blue paint make green.',
      },
      {
        id: 'reader:s3-invitations-l2',
        domain: 'maths',
        skill: 'division word problem: how many packs are needed',
        standard: '3.OA.A.3',
        kind: 'ask',
        after: 7,
        prompt: [
          PX('Ten Keepers, plus one for you. Eleven invitations. Green cards come in packs of 4. How many packs do I buy?', 'think'),
        ],
        options: [
          {
            label: '3 packs',
            best: true,
            reply: [PX('Three. Two packs is only 8, not enough. Three packs is 12, with one spare. For mistakes. I make mistakes.', 'happy')],
          },
          {
            label: '2 packs',
            reply: [
              PX('Two packs is 8 cards. Three people wouldn’t get one. Imagine the grievances.', 'shock'),
              PX('Three packs is 12. Enough for eleven, with one spare.'),
            ],
          },
          {
            label: '11 packs',
            reply: [
              PX('That’s 44 cards! I’d be writing until spring.', 'shock'),
              PX('Each pack has 4. Three packs is 12, enough for eleven, with one spare.'),
            ],
          },
        ],
        parentNote: 'Worked out how many packs of 4 are needed for 11 cards (3, with one spare).',
      },
    ],
  },
  {
    id: 'reader:s3-moot',
    of: 's3-moot',
    band: 'reader',
    lines: [
      N('Evening at the pond. Ten Keepers, one urn, green invitations, and nobody sure where to stand.'),
      N('Dusty has dug the hole. The one urn stands in it, so that it is exactly level with nobody. Dusty is very proud.'),
      HZ('A Moot! I haven’t been to a Moot since my hair was brown. Isn’t this awkward. I love it.', 'happy'),
      N('You set the plates on the bench by the pond, between the two groups.'),
      N('Gran Hazel sits down on the bench first, right in the middle, and beams at both sides.'),
      N('Both sides shuffle in to see the plates until there is no gap left. Nobody can say who started it.'),
      FE('She’s done it again. Forty years, and still annoying everyone on purpose.', 'happy'),
      SP('It was the flag. I had it in a box the whole time. I’m loud about everything except the one thing.', 'sad'),
      FE('Bramble went over that rail because a man moved a flag. Not because of Ash. Not because of anyone here.'),
      N('Pixel pours the last of the sun urn and the last of the moon urn into the one urn. Byte tastes it, gravely.'),
      BY('Same tea. It was always the same tea. I’d like that read into the record.', 'think'),
      SP('Byte, I swear the sun urn tasted nicer, by every lantern in this—', 'angry'),
      BY('Into the record.'),
      EM('So. Midsummer. A Cup. Everybody runs. Same course, new flags, and I check them.', 'think'),
      FE('We check them.'),
      BY('I’ll check the checking.', 'happy'),
      HZ('And who’s keeping the Moot, love? Somebody has to bang the spoon.', 'happy'),
    ],
    lessons: [
      {
        id: 'reader:s3-moot-l1',
        domain: 'science',
        skill: 'planning a fair test',
        kind: 'ask',
        after: 12,
        prompt: [
          BY('For the record, I tested it properly first. Which test is fairest, to prove two teas are the same?', 'think'),
        ],
        options: [
          {
            label: 'Same cups, same amount, same heat, and the taster doesn’t know which is which.',
            best: true,
            reply: [
              BY('Yes. Change nothing except the thing you’re testing. And hide the labels, so nobody tastes what they expect.', 'happy'),
              BY('That’s a fair test. I did it eleven times. Same tea, every time.'),
            ],
          },
          {
            label: 'Ask Sparks which one she likes best.',
            reply: [
              SP('Sun. Obviously. Sun.', 'happy'),
              BY('Exactly why not. She knows which is which. A fair test hides the labels and keeps everything else the same.', 'think'),
            ],
          },
          {
            label: 'Taste the sun tea hot and the moon tea cold.',
            reply: [
              BY('Then you’re testing hot against cold, not sun against moon.', 'think'),
              BY('A fair test changes only one thing. Same cups, same amount, same heat, labels hidden.'),
            ],
          },
        ],
        parentNote: 'Learned what makes a fair test: change one thing, keep the rest the same, and test blind.',
      },
      {
        id: 'reader:s3-moot-l2',
        domain: 'sel',
        skill: 'ending a quarrel by talking openly',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 16,
        lines: [
          HZ('Disagreeing is fine, love. Valleys are full of it. It’s the whispering behind urns that does the damage.', 'happy'),
          HZ('Say it to their faces, kindly, with the evidence on the table. That’s how a feud ends.'),
        ],
        parentNote: 'Heard how talking openly and honestly, with facts, can end a long quarrel.',
      },
    ],
    choices: [
      {
        id: 'spoon',
        label: 'Bang the spoon on the urn.',
        set: { 's3-moot': 'spoon' },
        then: [
          N('You bang the spoon on the urn, and ten Keepers stop talking at once. It is the most powerful you have ever felt.'),
          BY('That spoon is now a gavel. A gavel is a judge’s hammer. I’m noting that the hammer is a spoon.', 'think'),
          PX('Ribbons! Gold and silver, stitched down the middle in green. One for every Nubbin who runs the Cup.', 'happy'),
          HZ('Moot-Keeper. Told you it’d suit.', 'happy'),
        ],
      },
      {
        id: 'share',
        label: 'Give the spoon to Fern and Ember to share.',
        set: { 's3-moot': 'shared' },
        then: [
          N('Fern and Ember hold the spoon between them and bang the urn together. Both miss, and the whole pond cheers.'),
          PX('Ribbons! Gold and silver, stitched down the middle in green. I did a test run. The stitching is also disputed.', 'happy'),
          HZ('You’re still the Moot-Keeper, love. Somebody had to bring the spoon.', 'happy'),
        ],
      },
    ],
  },
];

const S3_GLOSSARY: GlossaryEntry[] = [
  { word: 'feud', meaning: 'A long, bitter quarrel between two people or groups.', scene: 'reader:s3-stands' },
  { word: 'grievance', meaning: 'A complaint about something you feel was unfair.', scene: 'reader:s3-two-stories' },
  { word: 'evidence', meaning: 'Facts or things you can see and check that show what is true.', scene: 'reader:s3-two-stories' },
  {
    word: 'develop',
    meaning: 'To grow or build up; with photos, to treat film or plates with chemicals so the picture appears.',
    scene: 'reader:s3-plates',
  },
  { word: 'steward', meaning: 'Someone whose job is to look after a place or an event, like a race.', scene: 'reader:s3-flag' },
  { word: 'neutral', meaning: 'Not on either side in a quarrel.', scene: 'reader:s3-courier' },
  { word: 'courier', meaning: 'Someone who carries messages or packages from one person to another.', scene: 'reader:s3-courier' },
  { word: 'truce', meaning: 'An agreement to stop fighting or quarrelling.', scene: 'reader:s3-truce' },
  { word: 'moot', meaning: 'An old word for a meeting where people gather to talk things out and decide together.', scene: 'reader:s3-truce' },
  { word: 'fair test', meaning: 'An experiment where you change only one thing and keep everything else the same.', scene: 'reader:s3-moot' },
];

// ================================================================== S4 The Wellspring
const S4_SCENES: EduScene[] = [
  {
    id: 'reader:s4-pools',
    of: 's4-pools',
    band: 'reader',
    lines: [
      MA('You won. Good. Come and see something that isn’t winning.', 'think'),
      N('Past the ridge, Marina’s tide pools step down the rock like a row of bowls. Half of them are dry.'),
      N('In the rest, the anemones have shut up tight, like fists.'),
      MA('They get what the stream gives them. This summer it’s giving them less. And what does come down is cold.', 'sad'),
      MA('Cold. In July.'),
      MA('Hazel painted a line on the rock by the falls, years back. Where the water ought to come to. Go and look.'),
      Y('Why not look yourself?'),
      MA('I’ve looked forty times. I want someone else to tell me I’m wrong.', 'soft'),
      MA('Take a Nubbin. They like the falls. Mind the moss on the rocks. Not that Moss. The slippery kind.', 'happy'),
    ],
    lessons: [
      {
        id: 'reader:s4-pools-l1',
        domain: 'science',
        skill: 'tides and the Moon’s pull',
        standard: '1-ESS1-1',
        kind: 'notice',
        after: 3,
        lines: [
          MA('Real tide pools sit on the seashore. The sea fills them up, then drains away, about twice a day.', 'think'),
          MA('That rise and fall is called the tide. The Moon’s pull causes it.'),
          MA('Mine are too high up the rock for any tide. They only get the stream. So when the stream fails, so do they.', 'sad'),
        ],
        parentNote: 'Learned that the Moon’s pull causes the tides, which rise and fall about twice a day on most coasts.',
      },
      {
        id: 'reader:s4-pools-l2',
        domain: 'sel',
        skill: 'when worry wants a second opinion',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 7,
        prompt: [N('Marina has checked forty times. Why do you think she wants someone else to look?')],
        options: [
          {
            label: 'When you’re worried, a second pair of eyes helps you know if it’s real.',
            best: true,
            reply: [MA('That’s it. After forty looks you stop trusting your own eyes. Worry does that.', 'soft')],
          },
          {
            label: 'She’s too lazy to walk to the falls.',
            reply: [
              MA('Forty times. To the falls. Lazy.', 'think'),
              N('She’s worried. When you’re very worried, asking someone else to check helps you know what’s real.'),
            ],
          },
          {
            label: 'She wants to win an argument.',
            reply: [
              MA('I’d love to lose this one.', 'soft'),
              N('She’s worried. Asking someone else to look is a good way to check whether a worry is real.'),
            ],
          },
        ],
        parentNote: 'Recognised that asking someone else to check can help when we are worried.',
      },
    ],
  },
  {
    id: 'reader:s4-line',
    of: 's4-line',
    band: 'reader',
    lines: [
      N('The falls are loud and white. On the dark rock beside the pool, someone has painted a thick white line.'),
      N('The water sits a hand’s width below it. Above the water the rock is pale and dry, where it should be dark and wet.'),
      N('Your Nubbin dips a paw in, pulls it out, and looks at you as if you did this.'),
      MA('A hand. A whole hand.', 'sad'),
      N('Marina has followed you after all. She is standing at the edge of the pool with her shoes in her hand.'),
      MA('Something upstream is taking it. Something big enough to take a hand of water off the falls.', 'think'),
    ],
    lessons: [
      {
        id: 'reader:s4-line-l1',
        domain: 'maths',
        skill: 'measuring length in centimetres',
        standard: '2.MD.A.1',
        kind: 'do',
        after: 3,
        check: 'edu:measure:water-line:10cm',
        lines: [
          MA('Mind you, a hand isn’t a proper measure. Everybody’s hand is a different size.', 'think'),
          MA('Here. Hazel’s measuring stick. Put the zero at the water and read the mark at the white line.'),
          N('(Line the stick up and read the number at the white line.)'),
          MA('Ten centimetres. Write it down. Numbers don’t argue, Hazel used to say.'),
        ],
        parentNote: 'Measured a length in centimetres with a ruler, starting from zero.',
      },
      {
        id: 'reader:s4-line-l2',
        domain: 'science',
        skill: 'reading signs that water levels have changed',
        kind: 'notice',
        after: 5,
        lines: [
          N('Wet rock looks darker than dry rock. The pale band is where the water used to reach and doesn’t any more.'),
          N('People who study rivers look for bands like this. The rock remembers where the water was.'),
        ],
        parentNote: 'Learned to read marks on rock as evidence of a change in water level.',
      },
    ],
  },
  {
    id: 'reader:s4-lesson',
    of: 's4-lesson',
    band: 'reader',
    lines: [
      MA('Hazel traded me fruit for swimming lessons. For her Nubbins, not her. She swam like a dropped teapot.', 'happy'),
      MA('Fossil swam sideways, on purpose. Never once the way I taught her. I still check that corner of the pool.', 'soft'),
      MA('Lesson one: they float better than you’d think. Lesson two: they don’t think, so let them.'),
      N('She wades in to her knees and holds your Nubbin under the chin, the way you’d steady a cup.'),
      N('It kicks once, amazed, and doesn’t sink.'),
      MA('There. Now up the outflow, where the water leaves the pool. Not far. Just far enough to see what’s up there.'),
      MA('And stay where I can see you. That’s the rule for Nubbins and Keepers alike.', 'think'),
    ],
    lessons: [
      {
        id: 'reader:s4-lesson-l1',
        domain: 'health',
        skill: 'water safety',
        standard: 'CASEL: Responsible decision-making',
        kind: 'notice',
        after: 6,
        lines: [
          MA('Real rule, for real water: never swim without a grown-up watching. Not once. Not even a good swimmer.', 'think'),
          MA('Rivers and pools can be colder, deeper and faster than they look. Cold water steals your strength quickly.'),
        ],
        parentNote: 'Learned the water-safety rule: only swim with a grown-up watching, as water can be colder and deeper than it looks.',
      },
    ],
    choices: [
      {
        id: 'with',
        label: 'Wade in after them.',
        set: { 's4-swim': 'with' },
        then: [
          N('You get in up to your waist and stop, gasping. It is very, very cold.'),
          MA('Lesson three: Keepers sink. Out you get.', 'happy'),
        ],
      },
      {
        id: 'trust',
        label: 'Stay on the bank and trust them.',
        set: { 's4-swim': 'trust' },
        then: [MA('Good. That’s the hardest stroke there is: staying on the bank.', 'soft')],
      },
    ],
  },
  {
    id: 'reader:s4-dam',
    of: 's4-dam',
    band: 'reader',
    lines: [
      N('Your swimmer comes back down the outflow and shakes itself all over you, the way Nubbins do when water has been rude.'),
      N('Caught in its fur: a grey thread, and a flake of fresh mortar.'),
      N('Round the bend upstream you find it. A wall of new grey stone across the stream, with a sluice gate in it, shut.'),
      N('Behind the wall the water lies flat and still and very blue, all the way up to the Circuit’s new swimming lanes.'),
      N('Each lane has a rope, a number, and a neat sign: NO SPLASHING.'),
      MA('No splashing. It’s water. Splashing is what it’s for.', 'angry'),
      MA('A swimming course. My pools are dying for a swimming course.', 'angry'),
      MA('I’ve written to the Circuit three times. I got three forms back. Received. Filed. Very tidy.', 'think'),
    ],
    lessons: [
      {
        id: 'reader:s4-dam-l1',
        domain: 'science',
        skill: 'how a dam changes the water downstream',
        standard: 'K-ESS2-2',
        kind: 'ask',
        after: 3,
        prompt: [MA('So. Why are my pools drying up?', 'think')],
        options: [
          {
            label: 'The dam holds the water back, so less flows down to the falls and the pools.',
            best: true,
            reply: [
              MA('Yes. A wall that holds back a river is a dam. The lake it makes behind it is a reservoir.', 'sad'),
              MA('Everything downstream gets whatever the dam lets through. Right now, that’s not much.'),
            ],
          },
          {
            label: 'The sun has dried it all up.',
            reply: [
              MA('The sun takes a little, every summer. Not a whole hand.', 'think'),
              MA('The dam holds the water back, so less flows down to us. The lake behind it is called a reservoir.'),
            ],
          },
          {
            label: 'The Nubbins have been drinking it.',
            reply: [
              MA('They do drink a lot. Not that much.', 'happy'),
              MA('The dam holds the water back, so less flows down to us. The lake behind it is a reservoir.'),
            ],
          },
        ],
        parentNote: 'Explained how a dam holds back water and changes the land and life downstream.',
      },
      {
        id: 'reader:s4-dam-l2',
        domain: 'maths',
        skill: 'temperature difference (subtraction within 100)',
        standard: '2.OA.A.1',
        kind: 'ask',
        after: 7,
        prompt: [
          N('Marina dips her old thermometer in the stream. It reads 8°C (46°F).'),
          MA('Hazel wrote down the July water every year. Last July: 17°C (63°F). How many degrees Celsius colder is it now?', 'think'),
        ],
        options: [
          { label: '9 degrees', best: true, reply: [MA('Nine. 17 take away 8. That’s not summer water. That’s spring water.', 'sad')] },
          {
            label: '25 degrees',
            reply: [
              MA('That’s 17 and 8 added together. We want the difference.', 'think'),
              MA('Count up from 8 to 17: two to get to 10, then seven more. Nine degrees colder.'),
            ],
          },
          {
            label: '11 degrees',
            reply: [
              MA('Close. Count up from 8: two to get to 10, then seven more to 17.', 'soft'),
              MA('Two and seven is nine. Nine degrees colder.'),
            ],
          },
        ],
        parentNote: 'Found the difference between two temperatures (17 − 8 = 9) by counting on.',
      },
    ],
  },
  {
    id: 'reader:s4-ledge-ask',
    of: 's4-ledge-ask',
    band: 'reader',
    lines: [
      MA('Before we do anything about that wall, I want to show you something. Not because it helps.', 'soft'),
      MA('Because somebody besides me ought to know the way. Hazel knew it. Hazel’s away.'),
      N('Beside the falls, half hidden by ferns, a narrow ledge runs straight into the roar.'),
      N('Behind the curtain of water, the rock has been worn back into a long, dark hollow.'),
      MA('The ledge path. Back to the rock, eyes on my heels.', 'think'),
      MA('Rule five. Don’t be me at your age. Rule four is “Don’t be Sparks”, and at your age I was Sparks, with longer hair.', 'happy'),
      MA('Don’t look at the water. It doesn’t like being stared at.'),
    ],
    lessons: [
      {
        id: 'reader:s4-ledge-ask-l1',
        domain: 'science',
        skill: 'erosion: how water carves rock',
        standard: '4-ESS2-1',
        kind: 'notice',
        after: 3,
        lines: [
          MA('Falling water wears rock away. That’s called erosion. Soft rock wears away faster than hard rock.'),
          MA('Here the top is hard and the rock beneath is soft. Over a very long time the soft part washed out, and left a hollow.'),
        ],
        parentNote: 'Learned how erosion by falling water carves soft rock faster than hard rock, making hollows behind waterfalls.',
      },
    ],
  },
  {
    id: 'reader:s4-ledge',
    of: 's4-ledge',
    band: 'reader',
    lines: [
      N('Behind the falls the world turns to noise and spray. The rock under your hand is wet and soft with moss.'),
      N('Halfway along, the ledge bends into the dark. From round the bend comes a breath of air: warm, and smelling of stone.'),
      MA('That’s the spring breathing. Where the first ones came up, if you believe Moss. I do, mostly.', 'soft'),
      N('Marina stops at the bend. She doesn’t go on.'),
      MA('Further is for when it’s needed. Hazel’s rule. I’ve kept it twenty years.', 'soft'),
      MA('But now you know the way this far. That’s all a path is, really. Somebody else knowing it.'),
    ],
    lessons: [
      {
        id: 'reader:s4-ledge-l1',
        domain: 'science',
        skill: 'warm springs: heat from under the ground',
        kind: 'notice',
        after: 2,
        lines: [
          MA('There are warm springs in the real world too. Rain soaks down deep, where the rock is hot.'),
          MA('The water warms up down there and rises back to the surface. Where warm water meets cold air, you see a mist.'),
        ],
        parentNote: 'Learned that warm springs are heated by hot rock deep underground.',
      },
      {
        id: 'reader:s4-ledge-l2',
        domain: 'social-studies',
        skill: 'passing on knowledge of places: walking and maps',
        standard: 'D2.Geo.2.K-2',
        kind: 'ask',
        after: 5,
        prompt: [MA('So. What’s the best way to make sure a path like this is never forgotten?', 'think')],
        options: [
          {
            label: 'Walk it with someone, and draw a map as well.',
            best: true,
            reply: [
              MA('Both. Walking teaches your feet. A map keeps it when there’s nobody left to walk it with you.', 'happy'),
            ],
          },
          {
            label: 'Walk it with someone.',
            reply: [
              MA('That’s how Hazel taught me. It’s the best way to learn it.', 'soft'),
              MA('But add a map as well. A map remembers the way when there’s nobody left to walk it with you.'),
            ],
          },
          {
            label: 'Draw a map.',
            reply: [
              MA('A map is a good keeper. It doesn’t forget.', 'soft'),
              MA('But walk it too. A map can’t tell you which rock wobbles. Both together is best.'),
            ],
          },
        ],
        parentNote: 'Thought about how knowledge of a place is passed on, by showing someone and by maps.',
      },
    ],
  },
  {
    id: 'reader:s4-sluice',
    of: 's4-sluice',
    band: 'reader',
    lines: [
      MA('Three letters. Three forms. I’m done writing.', 'angry'),
      MA('We’re not breaking anything. Breaking is loud, and it gets you talked about. We’re opening a gate that ought to be open.'),
      N('At night the dam is just a dark wall and the sound of held water. The sluice is a great wooden door in new stone.'),
      N('Beside it, in a tidy hut, the Circuit’s night steward sits bolt upright in his chair, fast asleep, clipboard on his chest.'),
      N('He snores in a perfect rhythm. In, out, and a thin little whistle. The clipboard rises and falls.'),
      MA('I’ve watched him three nights. Move on the snore. Freeze on the whistle. The whistle’s when he’s nearest to waking.', 'think'),
      Y('Has he ever woken?'),
      MA('Not once in three nights. I’m still not taking chances.'),
      N('You creep to the sluice on a snore. Your Nubbin creeps beside you, one foot raised, and freezes on the whistle like a garden ornament.'),
      N('It holds the pose through three more whistles. It is still holding it when the snore comes back.'),
      MA('You can put your foot down now, pet.', 'soft'),
      N('It puts its foot down. It looks as if it would have preferred to win.'),
      N('You try the sluice on the next snore. It doesn’t move. It is, without any doubt, stuck.'),
    ],
    lessons: [
      {
        id: 'reader:s4-sluice-l1',
        domain: 'maths',
        skill: 'a repeating pattern and its rule',
        standard: '4.OA.C.5',
        kind: 'ask',
        after: 5,
        prompt: [MA('In, out, whistle. In, out, whistle. If we count every sound, what will the 9th sound be?', 'think')],
        options: [
          {
            label: 'Whistle',
            best: true,
            reply: [MA('Whistle. Every third sound is a whistle: 3rd, 6th, 9th. So on the 9th, we freeze.', 'happy')],
          },
          {
            label: 'In',
            reply: [
              MA('Let’s count it: in 1, out 2, whistle 3, in 4, out 5, whistle 6, in 7, out 8, whistle 9.', 'think'),
              MA('Every third sound is a whistle. 3, 6, 9. Freeze on 9.'),
            ],
          },
          {
            label: 'Out',
            reply: [
              MA('Count it with me: in, out, whistle is 1, 2, 3. Then 4, 5, 6. Then 7, 8, 9.', 'think'),
              MA('The whistle lands on every multiple of 3. The 9th is a whistle. Freeze.'),
            ],
          },
        ],
        parentNote: 'Found the rule of a repeating pattern (every third sound) and used it to predict the 9th.',
      },
      {
        id: 'reader:s4-sluice-l2',
        domain: 'social-studies',
        skill: 'think question: is it right to open the gate without asking?',
        standard: 'D2.Civ.8.K-2',
        kind: 'ask',
        after: 12,
        prompt: [
          N('Marina asked three times, politely, and nobody listened. The gate isn’t hers.'),
          N('Is it right to open it without permission? What do you think?'),
        ],
        options: [
          {
            label: 'Yes. The pools are dying, and the gate should never have been shut.',
            reply: [MA('That’s a fair answer, and it’s my answer too. Living things come before tidy swimming lanes.', 'soft')],
          },
          {
            label: 'Only if we leave a note saying what we did and why.',
            reply: [MA('That’s a fair answer. Doing it openly, with your name on it, is a kind of honesty.', 'think')],
          },
          {
            label: 'No. We should keep asking, louder, and get more people to ask too.',
            reply: [MA('That’s a fair answer. Lots of things change that way. I’m just not sure the pools can wait.', 'soft')],
          },
        ],
        parentNote: 'Weighed rules, fairness and urgency in a hard choice; there was no wrong answer.',
      },
    ],
    choices: [
      {
        id: 'lift',
        label: 'Lift, then push.',
        set: { 's4-gate': 'lift-push' },
        then: [
          N('You lift, and push, the way the Grove gate taught you. The sluice groans, gives, and swings.'),
          MA('Where did you learn that?', 'shock'),
          Y('Home.'),
        ],
      },
      {
        id: 'nubbin',
        label: 'Let your strongest Nubbin have a go.',
        set: { 's4-gate': 'nubbin' },
        then: [
          N('Your Nubbin puts its back into it and shoves, and nothing happens. Then it slips, lifts by accident, and the whole thing swings.'),
          MA('Hazel’s trick. Even the Nubbins know it.', 'happy'),
        ],
      },
      {
        id: 'note',
        label: 'Pin a polite note to the gate first.',
        set: { 's4-gate': 'note' },
        then: [
          N('You write: “Sluice opened for the tide pools, with thanks, from Hazel’s Grove.” Then you lift, and push, and it swings.'),
          MA('Polite. He’ll hate that more than anything.', 'happy'),
          N('In the hut, the steward’s hand rises in his sleep, pats the air where a note might be, and puts it in a tray that isn’t there.'),
        ],
      },
    ],
  },
  {
    id: 'reader:s4-water',
    of: 's4-water',
    band: 'reader',
    lines: [
      N('Water pours through the gap, dark and loud.'),
      N('It goes tumbling off towards the falls as if it’s late for something.'),
      MA('Listen.', 'soft'),
      N('Below you, the falls change their sound: fuller and louder, the way the rock remembers them.'),
      N('In the hut, the steward stirs, says “Received,” quite clearly, and goes back to sleep.'),
      MA('Filed, I expect.', 'happy'),
      MA('Somebody will shut it again, probably. Then somebody will open it again. That’s most of keeping.', 'think'),
    ],
    lessons: [
      {
        id: 'reader:s4-water-l1',
        domain: 'science',
        skill: 'water flows downhill',
        kind: 'ask',
        after: 0,
        prompt: [N('Which way does the water go, now the gate is open?')],
        options: [
          {
            label: 'Downhill, towards the falls.',
            best: true,
            reply: [N('Yes. Gravity pulls water down, so it always flows to the lowest place it can reach. Downhill means the falls.')],
          },
          {
            label: 'Uphill, back to the swimming lanes.',
            reply: [
              N('Water can’t flow uphill on its own. Gravity pulls it down.'),
              N('It always runs to the lowest place it can reach. Here, that’s the falls and the pools.'),
            ],
          },
          {
            label: 'It stays where it is.',
            reply: [
              N('It stayed put while the gate held it. Now nothing does.'),
              N('Gravity pulls water downhill, to the lowest place it can reach: the falls and the pools.'),
            ],
          },
        ],
        parentNote: 'Explained that gravity makes water flow downhill to the lowest place it can reach.',
      },
      {
        id: 'reader:s4-water-l2',
        domain: 'literacy',
        skill: 'theme: what “keeping” means in this story',
        standard: 'RL.4.2',
        kind: 'notice',
        after: 6,
        lines: [
          N('“That’s most of keeping.” Looking after something isn’t done once. It’s done again and again.'),
          N('That idea comes up all through the Grove’s stories. A big idea a story keeps returning to is its theme.'),
        ],
        parentNote: 'Noticed a theme (caring for something is ongoing work) that runs through the stories.',
      },
    ],
  },
  {
    id: 'reader:s4-complete',
    of: 's4-complete',
    band: 'reader',
    lines: [
      N('A week later the tide pools are full to the brim. The anemones have opened, as if surprised to be asked.'),
      MA('Look at them. Showing off.', 'happy'),
      N('In the deepest pool, wedged between two stones, something round and pearl-white is catching the light.'),
      N('Your swimmer has seen it too. It dives before anyone can stop it: one kick, two, and a long silver string of bubbles.'),
      N('It comes up with the thing balanced on its head, extremely pleased with itself, and sneezes. It is an egg.'),
      MA('…Oh. Oh, you beauty.', 'shock'),
      MA('Once in a long while one comes down from behind the falls. Hazel saw one in forty years. It’s yours. You opened the gate.'),
      MA('And your swimmers can dive here whenever they like. As deep as they want. I’ll teach them the rest.', 'soft'),
      MA('Take some shells for the Grove. Take the pool weed too; it’s lucky. It isn’t lucky. It smells. Take it anyway.', 'happy'),
      N('Up at the dam, someone has hung a neat painted sign on the open sluice: OPEN BY ORDER. It doesn’t say whose.'),
    ],
    lessons: [
      {
        id: 'reader:s4-complete-l1',
        domain: 'science',
        skill: 'how anemones survive in tide pools',
        standard: '4-LS1-1',
        kind: 'notice',
        after: 1,
        lines: [
          MA('Anemones look like flowers, but they’re animals. Those are tentacles, not petals.'),
          MA('When the water drops, they pull in tight to keep from drying out. Under water, they open up to catch bits of food.'),
        ],
        parentNote: 'Learned that sea anemones are animals that close up to stay moist and open their tentacles to feed.',
      },
      {
        id: 'reader:s4-complete-l2',
        domain: 'maths',
        skill: 'multiplication as equal groups',
        standard: '3.OA.A.1',
        kind: 'ask',
        after: 8,
        prompt: [MA('I’ve filled 4 bags with 6 shells each. How many shells is that for the Grove?')],
        options: [
          { label: '24', best: true, reply: [MA('Twenty-four. Four sixes. Don’t spend them all at once.', 'happy')] },
          {
            label: '10',
            reply: [
              MA('That’s 4 and 6 added. But it’s 4 bags with 6 in each.', 'think'),
              MA('6, 12, 18, 24. Four lots of six is 24.'),
            ],
          },
          {
            label: '20',
            reply: [
              MA('Close. Count in sixes, one for each bag: 6, 12, 18, 24.', 'soft'),
              MA('Four lots of six is 24.'),
            ],
          },
        ],
        parentNote: 'Multiplied equal groups (4 × 6 = 24) by counting in sixes.',
      },
    ],
  },
];

const S4_GLOSSARY: GlossaryEntry[] = [
  { word: 'anemone', meaning: 'A soft sea animal with a ring of tentacles that looks a bit like a flower.', scene: 'reader:s4-pools' },
  { word: 'tide', meaning: 'The rise and fall of the sea, caused mostly by the pull of the Moon.', scene: 'reader:s4-pools' },
  { word: 'centimetre', meaning: 'A small unit of length. A hundred centimetres make one metre.', scene: 'reader:s4-line' },
  { word: 'outflow', meaning: 'The place where water flows out of a pool or lake.', scene: 'reader:s4-lesson' },
  { word: 'reservoir', meaning: 'A lake made by holding water back, often behind a dam.', scene: 'reader:s4-dam' },
  { word: 'sluice', meaning: 'A gate that can open or close to control how much water flows through.', scene: 'reader:s4-dam' },
  { word: 'erosion', meaning: 'The slow wearing away of rock or soil by water, wind or ice.', scene: 'reader:s4-ledge-ask' },
  { word: 'rhythm', meaning: 'A pattern of sounds or beats that repeats.', scene: 'reader:s4-sluice' },
];

// ================================================================== S5 Fossil’s Last Walk
const S5_SCENES: EduScene[] = [
  {
    id: 'reader:s5-list',
    of: 's5-list',
    band: 'reader',
    lines: [
      N('Dusty is at the gate with a very old Nubbin in the crook of one arm and a much-folded bit of paper in the other hand.'),
      N('The Nubbin is the colour of sand. When she blinks, she does it slowly, as if each blink costs something.'),
      DU('This is Fossil. I dug her egg out of the cliff when I was eleven. So I called her Fossil. I was eleven. It was the best name I had.', 'happy'),
      DU('She’s very old now. She’s fading. Not her glow. Her. You’ll have seen it, if you’ve looked.', 'sad'),
      DU('Twenty years. You’d think I’d have run out of things to say to her. I’ve got a list.'),
      N('Dusty unfolds the paper. It has been folded and unfolded so often it has gone soft as cloth.'),
      DU('Three things. My back’s gone; I can’t carry her and do the things. Would you?', 'soft'),
      DU('One, the cliff. Two, Hazel’s first tree. Three, the water. She used to swim like she was late for something.', 'happy'),
      N('Fossil looks up at you, unhurried, and holds out her arms the way very small children do.'),
      N('Fossil says nothing. Her slow blink lands on you, and stays.'),
    ],
    lessons: [
      {
        id: 'reader:s5-list-l1',
        domain: 'maths',
        skill: 'addition word problem within 100',
        standard: '2.OA.A.1',
        kind: 'ask',
        after: 4,
        prompt: [N('Dusty was 11 when they dug out Fossil’s egg. That was 20 years ago. How old is Dusty now?')],
        options: [
          { label: '31', best: true, reply: [DU('Thirty-one. Don’t say it like that. Thirty-one is young. For a cliff.', 'happy')] },
          {
            label: '9',
            reply: [
              DU('Ha. I wish. That’s 20 take away 11.', 'happy'),
              N('Twenty years have passed since Dusty was 11, so we add: 11 + 20 = 31.'),
            ],
          },
          {
            label: '30',
            reply: [
              DU('Nearly. Don’t round me down, I’ve earned that year.', 'think'),
              N('Start at 11 and add 20: 21, 31. Dusty is 31.'),
            ],
          },
        ],
        parentNote: 'Added 11 + 20 = 31 to work out an age from a starting age and years passed.',
      },
      {
        id: 'reader:s5-list-l2',
        domain: 'science',
        skill: 'life cycles: being born, growing, growing old, dying',
        standard: '3-LS1-1',
        kind: 'notice',
        after: 9,
        lines: [
          N('Every living thing has a life cycle. It is born, it grows, it grows old, and in the end it dies.'),
          N('Fossil is near the end of hers. That is why Dusty has a list.'),
          DU('Old isn’t over. Old is when you do the things that matter. While you can.', 'soft'),
        ],
        parentNote: 'Learned that every living thing has a life cycle that includes growing old and dying, in plain, gentle words.',
      },
    ],
    choices: [
      {
        id: 'egg',
        label: 'Lift her with both hands, like an egg.',
        set: { 's5-carry': 'egg' },
        then: [
          N('You lift her the way you’d lift a full cup. She settles against you, approving.'),
          DU('That’s it. That’s exactly it.', 'soft'),
        ],
      },
      {
        id: 'shoulder',
        label: 'Let her ride on your shoulder.',
        set: { 's5-carry': 'shoulder' },
        then: [
          N('She climbs up, slowly, and sits on your shoulder like a very old queen inspecting something ridiculous.'),
          DU('Oh, she likes you. The last person who tried that got their ear nibbled.', 'happy'),
        ],
      },
    ],
  },
  {
    id: 'reader:s5-cliff',
    of: 's5-cliff',
    band: 'reader',
    lines: [
      N('At the foot of the cliff the rock is striped like a cake: brown, red, grey, brown. Each stripe is a layer.'),
      DU('Here. I was twelve. It was raining. I used a trowel.', 'think'),
      N('Fossil leans out and taps the rock, twice, very firmly.'),
      DU('…Eleven. Fine. Eleven. And it was sunny.'),
      N('Tap.'),
      DU('A spoon. It was a spoon. A big spoon. You try digging out a whole egg with a spoon. It took two days.', 'happy'),
      N('Tap.'),
      DU('…Four days. And a teaspoon. I’d like it noted that I was extremely thorough.', 'think'),
      N('Fossil lays her head against the rock and leaves it there a while. Dusty doesn’t say anything at all.'),
      DU('I tell it wrong on purpose. Every time. Twenty years, and she’s never once let me get away with it.', 'soft'),
      N('By her head a little fern grows out of a crack, curled tight. Pressed into the stone beside it is a much older one.'),
    ],
    lessons: [
      {
        id: 'reader:s5-cliff-l1',
        domain: 'science',
        skill: 'rock layers: the oldest is at the bottom',
        standard: '4-ESS1-1',
        kind: 'do',
        after: 0,
        check: 'edu:order:rock-layers:oldest-first',
        lines: [
          DU('Every stripe was mud or sand once, laid down flat, one on top of the last. Over ages, it pressed into rock.', 'think'),
          DU('Go on. Tap them in order. Oldest first.'),
          N('(Tap the layers from oldest to newest.)'),
          DU('Bottom to top. The bottom one was laid down first, so it’s the oldest. Everything above came later.', 'happy'),
        ],
        parentNote: 'Ordered rock layers by age, learning that lower layers are usually older than the ones above.',
      },
      {
        id: 'reader:s5-cliff-l2',
        domain: 'science',
        skill: 'fossils show what lived long ago',
        standard: '3-LS4-1',
        kind: 'notice',
        after: 10,
        lines: [
          DU('That’s a fossil. A real one. Not her. The fern.', 'happy'),
          DU('Long ago a fern was buried in mud. Very slowly the mud turned to stone, and kept the fern’s shape.'),
          DU('Fossils tell us what lived here before any of us. Ferns, it turns out. Ferns were here first.', 'soft'),
        ],
        parentNote: 'Learned how a fossil forms and that fossils show us what lived long ago.',
      },
    ],
  },
  {
    id: 'reader:s5-tree-ask',
    of: 's5-tree-ask',
    band: 'reader',
    lines: [
      DU('Next, Hazel’s first tree. The crooked one over the stream. Shake it once. She was very specific.', 'think'),
      DU('Well. I was. On her behalf.'),
      N('Fossil falls asleep on the way. She wakes exactly as you reach the tree, as if she set an alarm.'),
      N('The tree is low and crooked, and its trunk is wider than you can reach round.'),
      DU('Hazel planted it the year she came. Forty years old. Twice as old as Fossil.', 'soft'),
      DU('If it ever came down, you could count the rings in the stump: one ring for every year it grew. Let’s not find out.'),
    ],
    lessons: [
      {
        id: 'reader:s5-tree-ask-l1',
        domain: 'science',
        skill: 'tree rings: one ring for every year of growth',
        kind: 'notice',
        after: 5,
        lines: [
          N('One ring for every year the tree grew. This one would have forty.'),
          N('That is how people can tell how old a tree is: they count the rings in the stump.'),
        ],
        parentNote: 'Learned that a tree grows one ring each year, so counting rings shows its age.',
      },
    ],
  },
  {
    id: 'reader:s5-tree',
    of: 's5-tree',
    band: 'reader',
    lines: [
      N('Every Nubbin you own has followed you here. They sit in a row under the branches with their mouths open.'),
      DU('Once. Not twice. Twice is just weather.', 'think'),
      N('You shake it, once. One fruit drops: small, wrinkled, an odd yellow-brown, like an apple that has heard bad news.'),
      N('It misses every open mouth in the row and lands in Fossil’s lap, as if it knew the way.'),
      DU('That’s the one. Hazel gave her one the day she hatched. She ate it in one go and was sick on my shoe.', 'happy'),
      N('Fossil takes the fruit in both hands but doesn’t eat it yet. She holds it, and smells it, and closes her eyes.'),
      DU('Hazel stood where you are and said, “Well, she’s yours now. Good luck to you both.” I think she meant me.', 'soft'),
      N('Fossil eats a third of it, very slowly. Then she hands the rest to Dusty, who eats it, though it is horrible.'),
      DU('Tastes like being eleven.', 'soft'),
    ],
    lessons: [
      {
        id: 'reader:s5-tree-l1',
        domain: 'science',
        skill: 'smell and memory',
        standard: '4-LS1-2',
        kind: 'notice',
        after: 5,
        lines: [
          N('Smell is one of the senses most closely tied to memory.'),
          N('One sniff of something from long ago can bring the past rushing back, as if you were there again.'),
        ],
        parentNote: 'Learned that the sense of smell is strongly linked to memories.',
      },
      {
        id: 'reader:s5-tree-l2',
        domain: 'maths',
        skill: 'fractions of a whole',
        standard: '3.NF.A.1',
        kind: 'ask',
        after: 8,
        prompt: [N('Fossil ate one third of the fruit. What fraction did Dusty eat?')],
        options: [
          {
            label: 'Two thirds',
            best: true,
            reply: [N('Yes. Three thirds make a whole. Fossil had one, so Dusty had the other two. Two horrible thirds.')],
          },
          {
            label: 'One third',
            reply: [
              N('That’s Fossil’s share. A whole fruit is three thirds.'),
              N('Take away Fossil’s one third, and two thirds are left for Dusty.'),
            ],
          },
          {
            label: 'One half',
            reply: [
              N('Halves would be two equal parts. This fruit was cut into three equal parts: thirds.'),
              N('Fossil ate one third, so Dusty ate the other two thirds.'),
            ],
          },
        ],
        parentNote: 'Worked out that a whole is three thirds, so taking away one third leaves two thirds.',
      },
    ],
  },
  {
    id: 'reader:s5-water-ask',
    of: 's5-water-ask',
    band: 'reader',
    lines: [
      DU('Last one. The water. She can’t swim on her own any more.', 'sad'),
      DU('Marina taught her, years back, with Hazel’s lot. Says she was the only one who swam sideways on purpose.', 'happy'),
      N('Marina is already at the pond, sleeves rolled up, as though somebody sent for her.'),
      N('Dusty is very bad at secrets.'),
      MA('I was passing. With a towel. As you do.', 'soft'),
      DU('Course you were.', 'happy'),
    ],
    lessons: [
      {
        id: 'reader:s5-water-ask-l1',
        domain: 'literacy',
        skill: 'using clues to find a character’s real motive',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 4,
        prompt: [N('Marina says she was “just passing”. Sleeves rolled up. A towel. What’s really going on?')],
        options: [
          {
            label: 'Dusty asked Marina to come and help, and Marina is pretending it’s nothing.',
            best: true,
            reply: [N('Yes. The towel and the sleeves are the clues. Nobody just passes with a towel.')],
          },
          {
            label: 'Marina was going for a swim anyway.',
            reply: [
              N('Possible. But look at the clues: sleeves rolled up for lifting, a towel ready, and Dusty bad at secrets.'),
              N('Dusty asked Marina to come. Marina is pretending it’s nothing.'),
            ],
          },
          {
            label: 'She’s lost.',
            reply: [
              N('Marina knows every rock in this valley. She’s not lost.'),
              N('The towel and sleeves are clues: Dusty asked Marina to help, and she’s pretending it’s nothing.'),
            ],
          },
        ],
        parentNote: 'Used clues in the text to work out a character’s real reason for being there.',
      },
      {
        id: 'reader:s5-water-ask-l2',
        domain: 'sel',
        skill: 'quiet kindness',
        standard: 'CASEL: Social awareness',
        kind: 'notice',
        after: 5,
        lines: [
          N('Sometimes kind people pretend a big favour is nothing. That way, the other person doesn’t feel they owe them.'),
          N('Dusty knows. Marina knows Dusty knows. Nobody says so. That’s a kind of kindness too.'),
        ],
        parentNote: 'Noticed a quiet kind of kindness: helping without making a fuss about it.',
      },
    ],
    choices: [
      {
        id: 'yours',
        label: 'Let one of your swimmers hold her.',
        set: { 's5-holder': 'yours' },
        then: [
          N('Your swimmer wades out and waits, very serious, as if it has been given the most important job in the valley.'),
          MA('Paw under the chin. Like a cup. There you go.', 'soft'),
          DU('It’s holding her like she’s the last egg in the valley. …Don’t tell it I said that.', 'soft'),
        ],
      },
      {
        id: 'marina',
        label: 'Ask Marina to hold her.',
        set: { 's5-holder': 'marina' },
        then: [
          N('Marina wades in to her waist and holds out her hands.'),
          MA('Come on then, old girl. Same as always.', 'soft'),
        ],
      },
    ],
  },
  {
    id: 'reader:s5-water',
    of: 's5-water',
    band: 'reader',
    lines: [
      N('You lower Fossil into the water, and it takes her weight. For a moment she is stiff and heavy. Then she is light.'),
      N('Then, very slowly, she kicks.'),
      DU('Look at her. That’s the stroke. The little sideways one. Like she’s late for something.', 'happy'),
      DU('To the reeds and back, Fos. Then you can be smug about it.'),
      N('She swims to the reeds and back. It takes a long time, and nobody hurries her.'),
      N('When you lift her out she is shivering, and her eyes are bright. She isn’t looking at Dusty. She’s looking at the Grove.'),
      DU('…That’s not on my list. Fossil’s got a list of her own.', 'think'),
    ],
    lessons: [
      {
        id: 'reader:s5-water-l1',
        domain: 'science',
        skill: 'water pushes up on things in it',
        standard: '3-PS2-1',
        kind: 'notice',
        after: 0,
        lines: [
          MA('Water pushes up on anything that’s in it. That push holds up some of her weight.', 'soft'),
          MA('That’s why she suddenly feels light. The water is helping to carry her.'),
        ],
        parentNote: 'Learned that water pushes upwards on objects in it, which makes them feel lighter.',
      },
      {
        id: 'reader:s5-water-l2',
        domain: 'health',
        skill: 'why bodies shiver',
        kind: 'ask',
        after: 5,
        prompt: [MA('Towel. Quick. Why do you think she’s shivering?', 'soft')],
        options: [
          {
            label: 'Her body is shaking its muscles to make heat after the cold water.',
            best: true,
            reply: [MA('Yes. Shivering is your muscles working fast to warm you up. A towel and a cuddle help it along.', 'soft')],
          },
          {
            label: 'She’s scared.',
            reply: [
              MA('Look at her eyes. Bright. Not scared.', 'soft'),
              MA('Shivering after cold water is the body shaking its muscles to make heat. A towel helps.'),
            ],
          },
          {
            label: 'She’s excited.',
            reply: [
              MA('She might be, a little! But the shiver is from the cold.', 'happy'),
              MA('Shivering is the body shaking its muscles to make heat. A towel helps it along.'),
            ],
          },
        ],
        parentNote: 'Learned that shivering is the body making heat by moving muscles quickly.',
      },
    ],
  },
  {
    id: 'reader:s5-secret',
    of: 's5-secret',
    band: 'reader',
    lines: [
      N('You set Fossil down on the bank. She walks across the Grove on her own, one slow step at a time.'),
      N('Not to Dusty, and not to you. She goes to your youngest Nubbin, who is busy falling over a fruit, and sits beside it.'),
      DU('…Oh.', 'shock'),
      N('Your youngest stops falling over and looks at Fossil, and Fossil looks back. Then they just sit.'),
      DU('She did this for me once. I was small and I’d had a bad day. She just sat. Didn’t fix anything. Didn’t try.', 'soft'),
      DU('Nobody ever taught her that. She just knew, years before I did.', 'soft'),
    ],
    lessons: [
      {
        id: 'reader:s5-secret-l1',
        domain: 'sel',
        skill: 'being there for someone',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 5,
        prompt: [DU('She didn’t fix my bad day. Not one bit of it. So why do you think it helped?', 'soft')],
        options: [
          {
            label: 'Because I wasn’t alone with it any more.',
            best: true,
            reply: [DU('That’s it. You can’t always fix it. You can always sit next to it.', 'soft')],
          },
          {
            label: 'It didn’t help. Only fixing things helps.',
            reply: [
              DU('I thought that too, when I was small.', 'soft'),
              DU('But some things can’t be fixed. Having someone beside you means you’re not alone with them. That helps more than you’d think.'),
            ],
          },
          {
            label: 'Because she was warm.',
            reply: [
              DU('She was. Still is, just about.', 'soft'),
              DU('But mostly it helped because I wasn’t alone with it any more. Someone was there.'),
            ],
          },
        ],
        parentNote: 'Talked about how being with someone helps, even when you can’t fix their problem.',
      },
    ],
  },
  {
    id: 'reader:s5-gift',
    of: 's5-gift',
    band: 'reader',
    lines: [
      N('The sun goes down behind the western hill, in the west, where it sets every evening. Fossil doesn’t move, nor does your youngest, and after a while nor do you.'),
      N('The sky turns orange, then pink, then a deep, quiet blue.'),
      N('One by one, the first stars come out over the pond.'),
      N('Behind you, the rest of your Nubbins have given up waiting and fallen asleep in a heap. One of them snores in a very small voice.'),
      DU('That’s your whole army, is it?', 'happy'),
      N('Dusty looks at the heap, and then at Fossil, and says no more. Dusty is smiling.'),
      N('When it’s dark, the old Nubbin gets up and touches her nose to your youngest’s nose.'),
      N('Then Fossil walks back to Dusty, slowly, the way she does everything.'),
      N('Your youngest sits up straighter than you’ve ever seen it sit.'),
      N('On its stats sheet, under Stamina, are new words: “A gift from Fossil.”'),
    ],
    lessons: [
      {
        id: 'reader:s5-gift-l2',
        domain: 'science',
        skill: 'why stars only show at night',
        standard: '1-ESS1-1',
        kind: 'notice',
        after: 2,
        lines: [
          N('The stars were there all day. The Sun’s bright light hid them.'),
          N('Once the Sun has set and the sky grows dark, the stars can shine through.'),
        ],
        parentNote: 'Learned that stars are in the sky all the time but are hidden by daylight.',
      },
    ],
  },
  {
    id: 'reader:s5-home',
    of: 's5-home',
    band: 'reader',
    lines: [
      N('Dusty picks Fossil up to carry her home, bad back or not. The ball above her head is very pale now.'),
      N('It doesn’t glow. It only gets paler, the way a sky does at the end of the day.'),
      DU('Thank you. I mean it. I don’t say that much. Ask anyone. They’ll tell you I never say it.', 'soft'),
      DU('I think a Nubbin’s glow fades slower with someone walking beside it. I’d like to think so.', 'soft'),
      N('Fossil reaches out to you. In her fist is a curled seed from the fern at the foot of the cliff.'),
      DU('She wants you to plant it. Fossil-fern. Grows out of rock, if you’re patient. Course it does.', 'soft'),
      DU('And have this. Don’t argue. I bought it the week after I dug her out. Never needed it like I needed the spoon.', 'happy'),
      N('Dusty’s trowel. The handle is worn pale where a hand has held it for twenty years.'),
      N('At the gate, Dusty lifts it and pushes without thinking, one-handed, with Fossil in the other arm.'),
      N('On the western hill, Moss watches the gate long after it has closed.'),
    ],
    lessons: [
      {
        id: 'reader:s5-home-l1',
        domain: 'sel',
        skill: 'think question: what helps when someone we love is very old',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 3,
        prompt: [
          N('Fossil is very old. Dusty knows she won’t be alive much longer, and it hurts.'),
          N('What do you think helps, when someone you love is near the end of their life?'),
        ],
        options: [
          {
            label: 'Doing the things they love, together.',
            reply: [DU('That’s a fair answer. It’s why I made the list.', 'soft')],
          },
          {
            label: 'Telling them what they mean to you.',
            reply: [DU('That’s a fair answer. I should do more of that. I’m bad at it. Ask anyone.', 'soft')],
          },
          {
            label: 'Just being there, like Fossil did.',
            reply: [DU('That’s a fair answer. She taught me that one herself.', 'soft')],
          },
          {
            label: 'I don’t know. It just feels sad.',
            reply: [DU('That’s a fair answer, and an honest one. It is sad. Being sad about it is allowed.', 'soft')],
          },
        ],
        parentNote: 'Thought about ageing and saying goodbye; there was no wrong answer. Feelings of sadness were named as normal.',
      },
      {
        id: 'reader:s5-home-l2',
        domain: 'science',
        skill: 'real ferns grow from spores, not seeds',
        standard: '3-LS1-1',
        kind: 'notice',
        after: 5,
        lines: [
          DU('Mind you, real ferns don’t make seeds. They make spores, tiny as dust, in brown dots under their leaves.', 'think'),
          DU('The wind carries the spores off, and new ferns grow where they land. This is a Grove fern. It ignores rules.', 'happy'),
        ],
        parentNote: 'Learned that real ferns reproduce with tiny spores rather than seeds.',
      },
    ],
  },
];

const S5_GLOSSARY: GlossaryEntry[] = [
  { word: 'crook', meaning: 'The bend on the inside of your elbow.', scene: 'reader:s5-list' },
  { word: 'life cycle', meaning: 'The stages a living thing goes through: being born, growing, growing old and dying.', scene: 'reader:s5-list' },
  { word: 'layer', meaning: 'A flat sheet of something lying on top of or under another, like the stripes in a cliff.', scene: 'reader:s5-cliff' },
  { word: 'fossil', meaning: 'The shape of a plant or animal from long ago, preserved in rock.', scene: 'reader:s5-cliff' },
  { word: 'specific', meaning: 'Exact and particular, with no room for mistakes.', scene: 'reader:s5-tree-ask' },
  { word: 'fraction', meaning: 'A part of a whole, such as one half or one third.', scene: 'reader:s5-tree' },
  { word: 'smug', meaning: 'Very pleased with yourself, and showing it.', scene: 'reader:s5-water' },
  { word: 'spore', meaning: 'A tiny speck, like dust, that ferns and mushrooms use to grow new ferns and mushrooms.', scene: 'reader:s5-home' },
];

// ================================================================== exports
export const EDU_SIDE_1_READER: EduQuest[] = [
  {
    id: 'reader:s1',
    of: 's1',
    band: 'reader',
    title: 'The Wardens’ Walk',
    goals: {
      's1-step1': {
        goal: 'Walk beside Moss to the stream lantern, at his speed.',
        hint: 'Moss walks very slowly. Stay next to him. If you get ahead, he stops and waits for you to notice.',
      },
      's1-step-boats': {
        goal: 'Play Briar’s game: float a lit leaf-boat from the stream lantern all the way to the pond.',
        hint: 'Tap the water behind the boat to push it along. Keep it off the reeds. Leaves are free, so try as often as you like.',
      },
      's1-step2': {
        goal: 'Walk with Moss to the lantern by the old wall.',
        hint: 'Hush’s post is on the north side of the Grove, by the tumbled stone wall. Go on a quiet evening.',
      },
      's1-step3': {
        goal: 'Walk with Moss to his own lantern, by the pond.',
        hint: 'Go at dusk, just after sunset. Moss likes the light then.',
      },
      's1-step4': {
        goal: 'Moss won’t visit the Long-Grass post while it stands empty. He’ll tell you when.',
        hint: 'This story finishes in chapter 9. Carry on with the main story until then.',
      },
    },
    scenes: S1_SCENES,
    glossary: S1_GLOSSARY,
    notes:
      'Hooks: oral history and memory (spoken stories, rhymes, traditions, written records), plus metaphor and simile. ' +
      'Domains: social-studies, maths, literacy, science, sel. Think questions: reader:s1-hush-l2 (what grief is for) and ' +
      'reader:s1-wait-l2 (can a true story be unfair). Fading is named as dying in s1-briar and s1-hush.',
  },
  {
    id: 'reader:s2',
    of: 's2',
    band: 'reader',
    title: 'Wisp',
    goals: {
      's2-step1': {
        goal: 'Sit up after dark by Sable’s fruit, and keep very still.',
        hint: 'Leave fruit at the edge of the long grass, then wait nearby at night without moving.',
      },
      's2-step2': {
        goal: 'Keep an eye on Wisp. When the weather turns, find where he sleeps.',
        hint: 'This picks up in the chapter 6 rain. The warm things went somewhere warm.',
      },
      's2-step3': {
        goal: 'Keep winning Sable’s trust. Wisp is never far from her.',
        hint: 'This picks up in chapter 7. Once Sable leans on you, visit Luna’s night garden after dark.',
      },
    },
    scenes: S2_SCENES,
    glossary: S2_GLOSSARY,
    notes:
      'Hooks: mercy (think question reader:s2-night-l2, no best answer) and warmth (heat flow, insulation, wet materials, ' +
      'cooling). Domains: science, social-studies, literacy, maths, sel, health. The s2-complete variants ' +
      '(reader:s2-complete-sable, reader:s2-complete-driven) are in EDU_SIDE_1_READER_VARIANTS. The sable choice in ' +
      'reader:s2-night says the pile has ten fruit, which reader:s2-complete-sable-l1 uses (half of ten).',
  },
  {
    id: 'reader:s3',
    of: 's3',
    band: 'reader',
    title: 'The Cycle',
    goals: {
      's3-step1': {
        goal: 'Ask one Sun Keeper and one Moon Keeper what really happened at Midsummer.',
        hint: 'Fern, Marina, Sparks, Clover and Pixel are Sun. Luna, Ember, Byte, Dusty and Nova are Moon. Ask one from each side.',
      },
      's3-step2': {
        goal: 'Help Sparks and Byte develop the old Midsummer photo-finish plates.',
        hint: 'From chapter 6, go to Sparks’s workshop. Rock the tray on Byte’s steady count, not on Sparks’s “feeling”.',
      },
      's3-step3': {
        goal: 'Show the plates to Fern and to Ember.',
        hint: 'Fern is usually in her orchard. Ember is at the Circuit fence most evenings.',
      },
      's3-step4': {
        goal: 'Host the Lantern Moot at the pond, after the Long Night.',
        hint: 'In chapter 11, tap the pond and choose Call a Moot. All ten Keepers come.',
      },
    },
    scenes: S3_SCENES,
    glossary: S3_GLOSSARY,
    notes:
      'Hooks: photo finish, evidence, fair tests and data (a scaled bar graph). Domains: social-studies, maths, science, ' +
      'literacy, sel, art. Think question: reader:s3-truce-l1 (should Fern say sorry). ' +
      'reader:s3-moot keeps Fern’s Bramble line at index 5, so the s8Done extra line still inserts after index 5. ' +
      's3-invitations never mentions Hazel (she is only home in chapter 11). The story opens at Lantern Night in ' +
      'chapter 4 (journal only, as in the source); s3-stands still waits for the Circuit in chapter 5.',
  },
  {
    id: 'reader:s4',
    of: 's4',
    band: 'reader',
    title: 'The Wellspring',
    goals: {
      's4-step1': {
        goal: 'Check the water line Hazel painted on the rock by the falls.',
        hint: 'The falls are past the pond, on the Hollow side. Tap the white mark on the rock beside the pool.',
      },
      's4-step2': {
        goal: 'Send a swimmer up the outflow to see what’s above the falls.',
        hint: 'Choose Swim at the top of the pool. If none of your Nubbins can swim yet, Marina gives one a lesson first.',
      },
      's4-step3': {
        goal: 'Walk the ledge path behind the falls with Marina.',
        hint: 'Meet Marina at the pool in the evening. Stay close behind her on the ledge, and don’t stop to look down.',
      },
      's4-step4': {
        goal: 'Open the sluice gate on the Circuit’s dam, after dark.',
        hint: 'Go at night with Marina and a strong Nubbin. Move on the snore, freeze on the whistle. The sluice sticks.',
      },
    },
    scenes: S4_SCENES,
    glossary: S4_GLOSSARY,
    notes:
      'Hooks: water flow (gravity, erosion), dams and reservoirs, tide pools and the Moon’s pull on tides, warm springs. ' +
      'Marina explains that real tide pools are filled by the sea and hers sit too high for the tide, so the story’s ' +
      'stream-fed pools still make sense. Domains: science, sel, maths, health, social-studies, literacy. Think question: ' +
      'reader:s4-sluice-l2 (opening the gate without permission). Temperatures given in °C with °F in brackets.',
  },
  {
    id: 'reader:s5',
    of: 's5',
    band: 'reader',
    title: 'Fossil’s Last Walk',
    goals: {
      's5-step1': {
        goal: 'Carry Fossil to the cliff where Dusty found her egg.',
        hint: 'The cliff is east, past the stream. Walk, don’t run. She’s very old, and she likes to look at things.',
      },
      's5-step2': {
        goal: 'Take Fossil to Hazel’s first tree and shake it once.',
        hint: 'It’s the low, crooked tree across the stream. Build a gentle shake, not a huge one. One fruit only.',
      },
      's5-step3': {
        goal: 'Hold Fossil up in the shallows of the pond.',
        hint: 'Bring Fossil to the pond’s edge and choose Swim. One of your swimmers can hold her, or Marina will.',
      },
      's5-step4': {
        goal: 'Sit with them until dark.',
        hint: 'Stay still near Fossil and your youngest Nubbin until night falls. If you wander off, she’ll wait.',
      },
    },
    scenes: S5_SCENES,
    glossary: S5_GLOSSARY,
    notes:
      'Hooks: rock layers (4-ESS1-1) and fossils (3-LS4-1), life cycles, ageing and grief. Domains: maths, science, ' +
      'literacy, sel, health. Think question: reader:s5-home-l1 (what helps when someone we love is very old). ' +
      'Nothing here pre-empts chapter 6: Fossil does not die in S5, and there is no flower or farewell. The game’s ' +
      '“seed” stays an item; Dusty notes that real ferns grow from spores.',
  },
];

export const EDU_SIDE_1_READER_VARIANTS: EduScene[] = [...S2_VARIANTS];

export const CHECKS: string[] = [
  'edu:share:fruit:6-each',
  'edu:measure:water-line:10cm',
  'edu:order:rock-layers:oldest-first',
];
