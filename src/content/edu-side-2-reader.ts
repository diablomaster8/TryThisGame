/**
 * The Learning Grove, reader band (ages 7–10): side stories S6–S10.
 *
 *   S6  Ash’s True Name          sound, vibration, pitch and written notes (1-PS4-1)
 *   S7  Unverified               units, timers and schedules; why animals aren’t machines (think)
 *   S8  The Warren in the Hollow habitats, and animals in groups (3-LS2-1)
 *   S9  The Gate That Sticks     forgiveness and trust (think); friction, hinges and levers
 *   S10 Fourteen Months          grief, memory, and the hatch register as a data table
 *
 * One EduScene per original scene (step scenes, done scenes, complete scenes). The S8, S9 and S10
 * variant scenes (s8-complete-dawn, s9-gate-family, s10-lanterns-kept, s10-night-told, the seven
 * other s10-foot-* scenes, s10-letter-told) live in EDU_SIDE_2_READER_VARIANTS, the same way the
 * originals keep them in SIDE_STORIES_FUN_2_VARIANTS and SIDE_STORIES_MAIN_VARIANTS.
 *
 * Every choice keeps its original id, `set` and `friendship`; reader keeps every choice.
 * Scene-level `set` flags (s8Reunited on s8-reunion, s9Started on s9-dusk) live on the original
 * scenes; EduScene has no `set`, so the sim must still apply the original scene’s flags.
 * See EDU-STYLE.md. British spelling.
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
const E = say('ember');
const F = say('fern');
const H = say('hazel');
const M = say('moss');
const B = say('byte');
const P = say('pixel');
const NO = say('nova');
const C = say('corvin');
const LU = say('luna');
const CL = say('clover');
const SP = say('sparks');
const YH = say('young-hazel');

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

// ================================================================== S6 Ash’s True Name
const S6_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: Ember’s kitchen
  scene(
    's6-kitchen',
    [
      N('A note under your door at dawn: COME OVER. Then PLEASE, crossed out, and written again.'),
      N('Ember’s house is very tidy. It’s the kind of tidy you get when someone cleans because they’re angry.'),
      E('She’s out of that garden. Don’t ask how. I don’t care how, and I never will.'),
      N('A grey Nubbin sits in the corner of the kitchen, facing the wall. Beside her is a full bowl.'),
      E('Ash.'),
      E('Ash, love. It’s me. Ash.', 'soft'),
      N('The grey Nubbin doesn’t turn. A drip falls from the tap. She doesn’t turn for that either.'),
      E('Four hundred and twelve times since yesterday. I counted. Tell Byte I counted and I’ll deny it.'),
      E('She eats when I leave the room. She sleeps standing up.', 'sad'),
      E('It isn’t her name any more. To her it’s just a noise.', 'sad'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'use a character’s actions to work out her real feelings',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 9,
        prompt: [
          N('Ember says she doesn’t care. But look at her clues: the PLEASE on the note, and all that counting.'),
          N('How does Ember really feel about Ash?'),
        ],
        options: [
          {
            label: 'She cares about Ash more than anything.',
            best: true,
            reply: [N('Yes. People sometimes hide big feelings behind cross words. Ember’s clues give her away.')],
          },
          {
            label: 'She doesn’t mind either way.',
            reply: [
              N('That’s what she says. But nobody counts to four hundred and twelve about something they don’t mind.'),
              N('Her actions show she cares a lot.'),
            ],
          },
          {
            label: 'She’s cross with Ash.',
            reply: [N('She does sound cross. But she’s cross because she’s worried. The PLEASE and the counting show how much she cares.')],
          },
        ],
        parentNote: 'Used clues in what a character does, not just what she says, to work out her real feelings.',
      },
    ],
    [
      {
        id: 'sit',
        label: 'Sit on the floor near Ash, and wait.',
        friendship: { ember: 1 },
        then: [
          N('You sit for a long time. Ash doesn’t look at you, but she stops pressing quite so hard into the wall.'),
          E('…Hazel used to do that. Sit on the floor as if it were a perfectly good chair. It drove me mad.', 'soft'),
        ],
      },
      {
        id: 'say-it',
        label: 'Say “Ash” yourself, gently.',
        then: [
          N('Ash doesn’t turn. Ember lets out a long breath. It might be relief.'),
          E('See? It’s not me. It isn’t just me.', 'sad'),
        ],
      },
      {
        id: 'what-called',
        label: 'Ask what Corvin called her.',
        then: [
          E('Nothing. He didn’t call them anything. He just stood where they could see him.', 'angry'),
          E('Years of nobody saying her name. You’d forget too.'),
        ],
      },
    ],
  ),
  scene(
    's6-egg',
    [
      N('Ember puts the kettle on. She doesn’t make any tea.'),
      N('The kettle starts to whistle, thin and high. Ember doesn’t move to take it off.'),
      E('When she was tiny she answered to everything. Her name, my name, the kettle.'),
      N('The whistle gets louder. At last Ember lifts the kettle off the stove, and the sound dies away.'),
      E('I named her Ash a week after I got her. Before that she was just the egg from Hazel’s.', 'think'),
      E('Go home. Thanks for coming. Don’t make it a thing.'),
    ],
    [
      {
        domain: 'science',
        skill: 'sounds are made by vibrations',
        standard: '1-PS4-1',
        kind: 'notice',
        after: 3,
        lines: [
          N('Why does a kettle whistle? Steam rushes out through a tiny hole in the whistle on the spout.'),
          N('That makes the air there shake very fast. A fast shake like that is called a vibration, and vibrations make every sound.'),
          N('No vibration, no sound. When the steam slowed down, the whistle stopped.'),
        ],
        parentNote: 'Learned that sounds are made by vibrations, using Ember’s whistling kettle.',
      },
    ],
  ),
  // ------------------------------------------------ step 2: the hatch register
  scene(
    's6-fern',
    [
      N('Fern is leaning on the fence between your gardens, eating an apple. It is clearly from your tree.'),
      F('You’ve been at Ember’s. You’ve got the look. The look of someone told not to make it a thing.', 'think'),
      Y('Ash won’t answer to her name.'),
      F('Ember asked you over? Ember doesn’t like anyone. She doesn’t like me, and I’m delightful.', 'shock'),
      F('…Poor Ash. Poor Ember. Don’t tell her I said “poor”.', 'sad'),
      Y('Ash came from one of Hazel’s eggs.'),
      F('Then she’s in the book. Hazel wrote down every egg she ever gave away, and the first sound each one made.', 'think'),
      F('“For the record,” she said. Whose record, I said. “Theirs,” she said.'),
      F('Bottom shelf, behind the jam. Don’t eat the jam. Nobody knows what the jam was.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'choose the right meaning of a multiple-meaning word',
        standard: 'L.3.4',
        kind: 'ask',
        after: 7,
        prompt: [N('“Record” is a word with more than one meaning.'), N('When Hazel says “for the record”, which kind of record does she mean?')],
        options: [
          {
            label: 'Writing something down so it’s remembered.',
            best: true,
            reply: [F('That’s it. A record is a written note of what happened. Hazel kept a record of every egg.', 'happy')],
          },
          {
            label: 'The fastest time ever, like a race record.',
            reply: [F('That’s a real meaning too! Sparks loves those. But Hazel means writing things down, so they’re remembered.')],
          },
          {
            label: 'A music disc that plays songs.',
            reply: [F('Ha. Hazel did have a few of those. But here a record means a written note, kept so nobody forgets.')],
          },
        ],
        parentNote: 'Worked out which meaning of a multiple-meaning word (“record”) fits the sentence.',
      },
    ],
  ),
  scene(
    's6-register',
    [
      N('Behind the jam: a fat book, soft at the corners. On the cover, in Hazel’s writing: “EGGS.”'),
      N('Underneath, smaller: “Do not lend this to Byte.”'),
      N('Halfway through, a new section begins, under a heading she has underlined twice: “Given away.”'),
      N('Forty years of eggs, in pencil, with the weather. You can’t help reading the others on the way.'),
      H('“Egg 7. Given to Sparks, aged six. First sound: a bang. Not from the egg. From Sparks.”', 'happy'),
      H('“Egg 23. Given to Byte, who asked for a receipt. Gave him one. First sound: a hiccup. He wrote that down too.”', 'think'),
      H('“Egg 41. Given to Ember, aged fifteen, very serious. Promised to feed it before herself. Meant it.”', 'soft'),
      H('“First sound: three notes. Low, high, and a little one at the end, like a question.”'),
      N('Hazel has drawn the notes as three dots: one low, one high, and a tiny one trailing upwards.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'find the difference between two numbers by counting on',
        standard: '2.OA.A.1',
        kind: 'ask',
        after: 6,
        prompt: [
          N('Byte’s egg was number 23. Ember’s egg was number 41.'),
          N('How many more eggs had Hazel given away by Ember’s egg than by Byte’s?'),
        ],
        options: [
          {
            label: '18',
            best: true,
            reply: [N('Yes! 41 − 23 = 18. Count on from 23: 7 more makes 30, then 11 more makes 41. 7 + 11 = 18.')],
          },
          {
            label: '28',
            reply: [N('Close, but let’s check. From 23, count on 7 to reach 30, then 11 more to reach 41. 7 + 11 = 18.')],
          },
          {
            label: '64',
            reply: [N('64 is 41 + 23, so that’s adding them. We want the difference: 41 − 23 = 18.')],
          },
        ],
        parentNote: 'Found the difference between two numbers by counting on (41 − 23 = 18).',
      },
      {
        domain: 'music',
        skill: 'written music shows high and low notes',
        kind: 'notice',
        after: 8,
        lines: [
          N('Hazel’s dots work just like written music.'),
          N('In written music, notes are drawn as dots. A dot higher up means a higher sound. A dot lower down means a lower one.'),
          N('So you can see a tune’s shape before you hear it: low, high, and a little step up.'),
        ],
        parentNote: 'Learned that written music shows high and low notes by how high the dots sit.',
      },
    ],
  ),
  // ------------------------------------------------ step 3: practice by the pond
  scene(
    's6-practise',
    [
      N('Ember reads the page twice. Then she shuts the book on her own thumb, on purpose.'),
      E('And if I do it and she doesn’t turn round?', 'sad'),
      E('Right now she’s lost. If I call her real name and she still doesn’t turn, she’s gone. I’d rather have lost.'),
      N('She follows you to the pond anyway, the register under her arm, scowling at the water.'),
      E('I can’t sing. Don’t ask me to sing. I can whistle.'),
      E('You first. I’m not doing it till I know it doesn’t sound stupid.'),
      N('Your Nubbins gather on the bank to watch. It is the most interesting thing to happen all week.'),
      E('Low, high, little one. Like a question. If a duck answers, we’re stopping.'),
      N('There are no ducks on the pond. Ember checks anyway.'),
    ],
    [
      {
        domain: 'science',
        skill: 'feel your own voice vibrate',
        standard: '1-PS4-1',
        kind: 'do',
        after: 5,
        lines: [
          N('Before you whistle, warm up like a singer. Hum a long “mmmm” and rest your fingers on the front of your throat.'),
          N('Can you feel the buzz? That’s your voice box vibrating. Now hum a high note, then a low one.'),
        ],
        check: 'edu:hum:throat-buzz',
        parentNote: 'Felt their own throat vibrate while humming, to learn that sound comes from vibration.',
      },
      {
        domain: 'music',
        skill: 'pitch: high and low notes',
        kind: 'notice',
        after: 7,
        lines: [
          E('Low, high. That’s pitch. How high or low a sound is.'),
          N('Fast vibrations make high notes. Slow vibrations make low notes. A good whistle can slide from one to the other.'),
        ],
        parentNote: 'Learned the word pitch, and that faster vibrations make higher notes.',
      },
    ],
    [
      {
        id: 'high-low-question',
        label: 'Whistle: high, low, a little one.',
        then: [
          N('One of your Nubbins sneezes. Ember laughs once, before she can stop it.'),
          E('That was a duck. The shape’s upside down. Again.', 'happy'),
        ],
      },
      {
        id: 'low-question-high',
        label: 'Whistle: low, a little one, high.',
        then: [
          N('The last note goes up and keeps going, like a kettle.'),
          E('That’s not a question. That’s a complaint. Again.', 'happy'),
        ],
      },
      {
        id: 'low-high-question',
        label: 'Whistle: low, high, and a little one at the end.',
        set: { 's6-notes': true },
        friendship: { ember: 2 },
        then: [
          N('Low, high, and a small one tipped up at the end, like a question.'),
          N('Every Nubbin on the bank turns its head at once. Your first one trots over to see who called.'),
          E('…Oh.', 'soft'),
          E('Again. Slower. I want to hear it.', 'soft'),
        ],
      },
    ],
  ),
  scene(
    's6-ember-tries',
    [
      N('Ember puts two fingers in her mouth and whistles the three notes, quietly, to nobody.'),
      N('Your Nubbins don’t come to her. They don’t know her yet.'),
      N('From the far side of the pond, a duck nobody has ever seen before answers, loudly.'),
      E('No.', 'angry'),
      N('Ember glares at the duck until it leaves. It takes a while. It is a very confident duck.'),
      N('It doesn’t matter. She heard herself do it.'),
      E('Tonight. Before I can think about it. You’re coming, and you’re not saying anything.'),
    ],
    [
      {
        domain: 'music',
        skill: 'a tune is a pattern of notes',
        kind: 'notice',
        after: 0,
        lines: [
          N('Ember whistled quietly, and the notes still came out in their pattern: low, high, and a small one at the end.'),
          N('A tune is a pattern of high and low notes. Play it slow, fast or quiet, and the pattern stays the same.'),
        ],
        parentNote: 'Learned that a tune is a pattern of notes that stays recognisable at different speeds.',
      },
      {
        domain: 'sel',
        skill: 'what helps when you’re scared to try (think question)',
        standard: 'CASEL: Self-management',
        kind: 'ask',
        after: 6,
        prompt: [
          N('Ember was scared to try, in case it didn’t work. Now she’s going tonight, before she can talk herself out of it.'),
          N('What helps you when you’re scared to try something?'),
        ],
        options: [
          {
            label: 'Doing it quickly, before I can worry.',
            reply: [
              E('That’s my way. Jump before you think. It works more often than it should.'),
              N('That’s a fair answer. For lots of people, the waiting is the scariest part.'),
            ],
          },
          {
            label: 'Practising first, somewhere safe.',
            reply: [N('That’s a good answer. Ember practised by the pond first, to nobody, and it helped her a lot.')],
          },
          {
            label: 'Having a friend with me.',
            reply: [N('That’s a good answer too. It’s why Ember wants you there tonight, even if she’d never say so.')],
          },
          {
            label: 'Telling myself it’s all right if it doesn’t work.',
            reply: [N('That’s a wise answer. Trying is brave, even when it doesn’t go right the first time.')],
          },
        ],
        parentNote: 'Thought about ways to face a scary first try (a think question with no wrong answer).',
      },
    ],
  ),
  // ------------------------------------------------ step 4: the whistle
  scene(
    's6-whistle',
    [
      N('Ember’s kitchen after dark, with one lamp lit. Ash is in the corner, facing the wall.'),
      N('Ember kneels a little way off, not too close. She has thought hard about the distance.'),
      E('If this doesn’t work, you walk me to the pond and we don’t talk. Agreed?'),
      Y('Agreed.'),
      N('She puts two fingers to her mouth. For a moment nothing comes out at all.'),
      N('Then three notes. Low, high, and a small one at the end, like a question.'),
      N('Ash’s ear moves. One ear, a very little.'),
      N('Ember whistles it again, slower. Her hands are shaking, so it wobbles. But it’s still the right shape.'),
      N('Ash turns round.'),
      N('Then a sound, small and cracked: pip. wirr. a? The first sound in the register, half remembered.'),
      N('She crosses the kitchen one careful step at a time and puts her grey head against Ember’s knee.'),
      E('Hello, you. It’s me. It was always me.', 'soft'),
    ],
    [
      {
        domain: 'science',
        skill: 'animals turn their ears to catch sounds',
        standard: '4-LS1-2',
        kind: 'notice',
        after: 3,
        lines: [N('Cats and horses turn their ears towards a sound they know. So does Ash.')],
        parentNote: 'Learned that many animals move their ears towards a sound they know.',
      },
    ],
    [
      {
        id: 'stay',
        label: 'Stay by the door, very quietly.',
        then: [
          N('You stay. Ember cries without making any noise at all. You suspect she has practised.'),
          N('Ash lets her.'),
        ],
      },
      {
        id: 'leave',
        label: 'Let yourself out. This part is theirs.',
        friendship: { ember: 2 },
        then: [
          N('You lift the latch slowly so it doesn’t click.'),
          N('Behind you, Ember whistles the three notes again, and again. Every time, Ash answers.'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ complete
  scene('s6-complete', [
    N('Next morning Ember is at your gate. She lifts and pushes without thinking. She’s known the trick since she was fifteen.'),
    N('Ash walks so close to Ember’s boots that Ember has to walk carefully. She is still grey.'),
    E('Clover says the grey stays. Clover says you can only make it lighter.', 'think'),
    E('She ate breakfast with me in the room. That’s lighter.'),
    E('She answers to both now. The whistle’s hers. Ash is the one I gave her. She can keep both.', 'soft'),
    E('This was her first ribbon. I kept it in a drawer for years, like a soppy old thing. Give it to one of yours.'),
    E('And this. Two fingers, like that. Now blow. No. Less spit.'),
    N('It takes four tries. On the fifth, your whistle carries across the Grove, and three of your Nubbins come running.'),
    E('Don’t tell anyone I like you. I’ve got a reputation.', 'happy'),
  ], [
    {
      domain: 'sel',
      skill: 'mistakes are part of learning',
      standard: 'CASEL: Self-management',
      kind: 'notice',
      after: 7,
      lines: [
        N('Four tries that didn’t work, and one that did. That’s how almost everyone learns to whistle.'),
        N('Getting it wrong while you practise isn’t failing. It’s part of learning.'),
      ],
      parentNote: 'Saw that practice and mistakes are a normal part of learning a new skill.',
    },
    {
      domain: 'music',
      skill: 'sing a three-note pattern',
      kind: 'do',
      after: 8,
      lines: [N('Your turn, for real. Whistle or hum Ash’s three notes: low, high, and a little one going up.')],
      check: 'edu:hum:tune:low-high-question',
      parentNote: 'Sang or whistled a three-note pattern from a description of its shape.',
    },
  ]),
];

const S6: EduQuest = {
  id: 'reader:s6',
  of: 's6',
  band: 'reader',
  title: 'Ash’s True Name',
  goals: {
    's6-s1': {
      goal: 'Ember has asked you over. Go and see Ash.',
      hint: 'Ember’s house is past the dojo on the Moon side. Knock. She’ll pretend she wasn’t waiting.',
    },
    's6-s2': {
      goal: 'Find what Hazel wrote about the egg she gave Ember.',
      hint: 'In the cottage, tap the bookshelf by the stove. Hazel kept her record books on the bottom shelf.',
    },
    's6-s3': {
      goal: 'Take the register to Ember, and practise the three notes by the pond.',
      hint: 'Pick the pattern Hazel wrote: low, high, and a little one going up. There’s no timer, and a wrong try costs nothing.',
    },
    's6-s4': {
      goal: 'Be in Ember’s kitchen when she whistles to Ash.',
      hint: 'Go to Ember’s house after dark. Stand by the door and let her do it.',
    },
  },
  scenes: S6_SCENES,
  glossary: [
    gloss('deny', 'To say that something isn’t true, or that you didn’t do it.', 's6-kitchen'),
    gloss('vibration', 'A very fast shaking, back and forth. Vibrations make sound.', 's6-egg'),
    gloss('delightful', 'Very pleasant and lovely to be around.', 's6-fern'),
    gloss('receipt', 'A slip of paper that shows you have been given, or paid for, something.', 's6-register'),
    gloss('scowling', 'Frowning in a cross or grumpy way.', 's6-practise'),
    gloss('pitch', 'How high or low a sound is.', 's6-practise'),
    gloss('confident', 'Sure of yourself, and not at all shy.', 's6-ember-tries'),
    gloss('reputation', 'What other people think someone is like.', 's6-complete'),
  ],
  notes:
    'Lessons: sound and vibration (kettle, humming), pitch and written notes, ears and hearing, a tune as a pattern; ' +
    'reading feelings from actions; multiple-meaning “record”; 41 − 23; think question on facing a scary first try. ' +
    'The do lessons are hum-along beats with no scoring: any attempt counts. Ember was fifteen when Hazel gave her the ' +
    'egg (canon). The register’s cover says only “EGGS.”; “Given away.” heads a section inside, as in the source.',
};

// ================================================================== S7 Unverified
const S7_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: unverified
  scene(
    's7-unverified',
    [
      N('After Moss’s talk, the Keepers drift home in twos and threes. Byte stays on the wall, writing very small and very fast.'),
      N('Beside him sits a pale blue Nubbin with a flat, tidy ball above its head. It is watching the notebook.'),
      B('This is Null. Grown-up. Four years and some weeks. I know the weeks. Pixel says saying the weeks is unsettling.'),
      B('Moss says a Nubbin loved enough becomes an Eternal. “Enough.” That isn’t a unit.', 'think'),
      N('An Eternal is a Nubbin that never grows old.'),
      N('He shows you the page. Under everything Moss said tonight, in neat capitals: UNVERIFIED.'),
      B('When Fossil faded, everybody just sat with her. Sitting isn’t a method.', 'sad'),
      N('Fossil was Dusty’s old Nubbin. “Fade” is the Grove’s word for die. Fossil died this summer, on the hill.'),
      B('Enough is an amount. Amounts can be put on a schedule. Pixel’s timer runs four lanterns to the second.'),
      B('Before you say it: I’m not holding on too tight, like Cinder. I’m using a clock. Completely different.'),
      M('Your shoelace is untied.'),
      N('Byte looks down. It is. It always is.'),
      N('He goes very quiet.'),
      M('Things on a timer learn to wait for the bell, Byte. Safe is not the same as well.', 'think'),
      N('Byte writes it down carefully. Then, next to it: UNVERIFIED.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'what a unit of measurement is',
        standard: '4.MD.A.1',
        kind: 'ask',
        after: 3,
        prompt: [B('A unit is a fixed amount you measure with. Metres. Kilograms. Minutes.'), B('Which of these is a real unit?')],
        options: [
          {
            label: 'A minute',
            best: true,
            reply: [B('Correct. A minute is always sixty seconds, everywhere, for everyone. That’s what makes it a unit.', 'happy')],
          },
          {
            label: 'Enough',
            reply: [B('That’s Moss’s word, and it’s my whole complaint. My “enough” and yours might be different. A minute is always sixty seconds.')],
          },
          {
            label: 'A bit',
            reply: [B('A bit of what? A bit is a different size every time. A real unit, like a minute, is always the same.')],
          },
        ],
        parentNote: 'Learned what a unit of measurement is (a minute is always 60 seconds; “enough” is not a unit).',
      },
      {
        domain: 'literacy',
        skill: 'use the prefix un- to work out a word',
        standard: 'L.2.4',
        kind: 'ask',
        after: 5,
        prompt: [
          N('UN-VERIFIED. “Un” at the start of a word means “not”. To verify something means to check that it’s true.'),
          N('So what does Byte mean when he writes UNVERIFIED?'),
        ],
        options: [
          {
            label: 'Not checked or proved yet.',
            best: true,
            reply: [B('Exactly. I’m not saying Moss is wrong. I’m saying nobody’s checked.', 'think')],
          },
          {
            label: 'Definitely wrong.',
            reply: [B('No, that would be “false”. Unverified just means not checked yet. It might be true.')],
          },
          {
            label: 'Very important.',
            reply: [N('Not quite. “Un” means “not”, so unverified means not checked yet. Like “unopened” means not opened.')],
          },
        ],
        parentNote: 'Used the prefix un- to work out the meaning of “unverified”.',
      },
    ],
    [
      {
        id: 'help',
        label: 'I’ll help. What do you need?',
        friendship: { byte: 2 },
        then: [B('Fruit, a bed and a witness. You can be the witness. Witnesses don’t touch anything.', 'happy')],
      },
      {
        id: 'moss-right',
        label: 'Moss is usually right, Byte.',
        then: [
          B('“Usually” is a percentage. I’d like to know which percentage.'),
          N('On the wall, Moss appears to be asleep. He is very bad at appearing to be asleep.'),
        ],
      },
      {
        id: 'pet-null',
        label: 'Pet Null.',
        then: [
          N('Null leans into your hand, surprised, and then leans harder.'),
          B('Don’t, you’ll spoil the… fine. Fine. Once.', 'think'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 2: the Minder
  scene(
    's7-minder',
    [
      N('Pixel’s workbench: a clock face, three little brass bells, a feeding chute and a very small bed.'),
      P('Hi. So. It’s my lantern timer, basically. Four lanterns or one Nubbin, same maths, Byte says.', 'happy'),
      P('Bell one, fruit drops. Bell two, bed warms. Bell three, ninety seconds of petting. Byte does the petting.'),
      B('Ninety-one seconds was too many. I tested it.', 'think'),
      P('He wanted to call it the Accelerator. I wanted the Nap Box. We settled on the Minder, which neither of us likes.'),
      N('The clock ticks. The chute fires a plum across the shed and hits Byte right on his clipboard.'),
      P('That was calibration.', 'think'),
      B('That was a plum.'),
      P('Twenty years married, and he still argues with my clocks.', 'happy'),
      N('On the next tick, a piece of fruit drops neatly into the bowl, exactly on the beat.'),
      P('I built the clock. Clocks don’t care what they count down to. I’m trying to care for it.', 'sad'),
      B('Null eats on the bell, sleeps on the bell, is loved on the bell. If enough is an amount, this is enough.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'change seconds into minutes and seconds',
        standard: '4.MD.A.1',
        kind: 'ask',
        after: 3,
        prompt: [P('Ninety seconds of petting. There are sixty seconds in a minute.'), P('So how long is ninety seconds?')],
        options: [
          {
            label: '1 minute and 30 seconds',
            best: true,
            reply: [B('Correct. Sixty seconds make one minute, and thirty are left over.', 'happy')],
          },
          {
            label: '9 minutes',
            reply: [P('That would be a very long pet! Nine minutes is 540 seconds. Ninety seconds is 60 + 30: one minute and thirty seconds.')],
          },
          {
            label: 'An hour and a half',
            reply: [P('Ha, Null would love that. But hours are much bigger. Ninety seconds is 60 + 30: one minute and thirty seconds.')],
          },
        ],
        parentNote: 'Changed 90 seconds into 1 minute and 30 seconds, using 60 seconds = 1 minute.',
      },
      {
        domain: 'science',
        skill: 'a push is a force that starts and stops motion',
        standard: '3-PS2-1',
        kind: 'notice',
        after: 8,
        lines: [
          P('Pushes and pulls are called forces. The chute gave that plum a big push, so it flew.'),
          P('Then Byte’s clipboard pushed back and stopped it. Too much push. I’ll turn the spring down.', 'think'),
        ],
        parentNote: 'Learned that a push is a force that can start something moving, and another push can stop it.',
      },
    ],
    [
      {
        id: 'hungry',
        label: 'What if Null’s hungry before the bell?',
        then: [B('Null won’t be. The bell’s been set just right.'), P('…I asked him that too. It sounded better when he said it to me.', 'think')],
      },
      {
        id: 'lever',
        label: 'Does it have an off switch?',
        set: { 's7-lever': true },
        friendship: { pixel: 2 },
        then: [P('Lever. Left side. I always put a lever on.', 'happy'), P('Nobody ever asks about the lever. Thank you for asking about the lever.', 'soft')],
      },
    ],
  ),
  scene(
    's7-first-bell',
    [
      N('Byte sets Null in the little bed. The first bell rings.'),
      N('Null looks at Byte, then at the bell, then eats.'),
      B('Day one. Logging begins. Three bells a day. I’ll write down every single one.'),
      P('Every one? For a whole week?', 'think'),
      B('Come back in a week. Seven days. Not six. Not eight.'),
      P('It’s going to be fine. It’s a clock. Clocks are fine.', 'think'),
    ],
    [
      {
        domain: 'maths',
        skill: 'multiply equal groups',
        standard: '3.OA.A.1',
        kind: 'ask',
        after: 4,
        prompt: [P('Three bells a day, for seven days. How many bells is that?')],
        options: [
          { label: '21', best: true, reply: [B('Twenty-one. Seven groups of three. I’ll rule a column for each.', 'happy')] },
          { label: '10', reply: [P('That’s 3 + 7, adding. But it’s three bells every day, seven times over: 3 × 7 = 21.')] },
          { label: '37', reply: [P('Hmm, that’s the 3 and the 7 side by side. Seven days of three bells is 3 × 7 = 21.')] },
        ],
        parentNote: 'Multiplied equal groups (3 bells a day for 7 days = 21) to solve a word problem.',
      },
    ],
  ),
  // ------------------------------------------------ step 3: a week of bells
  scene(
    's7-week',
    [
      N('A week later, Byte’s front room is all clipboards. Null sits in the little bed, perfectly upright, waiting.'),
      B('Best week of data I’ve ever had. Run, Swim, Power, all up. It’s never eaten so tidily.', 'happy'),
      P('Watch this.', 'sad'),
      N('Pixel rolls a ball across the floor, the way you would for any Nubbin. Null watches it go by and doesn’t move.'),
      N('The bell rings, and Null eats. It doesn’t look at the fruit, only at the bell.'),
      N('Its blue has gone thin at the edges, like a shirt washed too often. Not grey. Paler.'),
      B('It used to chase that ball into the stove. Why doesn’t it play?', 'shock'),
      P('Byte. I think it’s waiting to be told.', 'sad'),
      N('Byte turns his notebook back a week. There is Moss’s line, in his own neat capitals, and beside it: UNVERIFIED.'),
      B('He told me. In plain words. And I wrote “unverified” next to it.', 'sad'),
      N('He crosses it out and writes VERIFIED. Then he crosses that out too.'),
      N('It isn’t something he wanted to be right about.'),
    ],
    [
      {
        domain: 'science',
        skill: 'why young animals play',
        kind: 'notice',
        after: 6,
        lines: [
          P('Young animals play all the time. Kittens pounce. Puppies chase. Lambs bounce about.', 'sad'),
          P('Play is how they practise running, catching and getting along. Animal carers watch for it. It’s a sign an animal feels safe.'),
        ],
        parentNote: 'Learned that young animals play to practise skills, and that play is a sign an animal feels safe.',
      },
      {
        domain: 'maths',
        skill: 'read a bar graph and compare two bars',
        standard: '2.MD.D.10',
        kind: 'ask',
        after: 7,
        prompt: [
          N('Pixel has been keeping a chart too. It shows how many times Null played each day.'),
          N('Day 1: ■■■■■ (5). Day 2: ■■■ (3). Day 3: ■ (1). Days 4 to 7: nothing at all.'),
          N('How many fewer times did Null play on Day 3 than on Day 1?'),
        ],
        options: [
          { label: '4', best: true, reply: [P('Yes. 5 take away 1 is 4. And after Day 3, the bars stop altogether.', 'sad')] },
          { label: '6', reply: [P('That’s 5 + 1. We want the difference: 5 − 1 = 4 fewer times.')] },
          { label: '1', reply: [P('One is how many times it played on Day 3. The difference from Day 1 is 5 − 1 = 4.')] },
        ],
        parentNote: 'Read a bar graph and found the difference between two bars (5 − 1 = 4).',
      },
    ],
    [
      {
        id: 'lever',
        label: 'Pull the lever.',
        set: { 's7-stopped': true },
        then: [
          N('Pixel pulls it before you’ve finished saying it. The ticking stops, and the quiet is enormous.'),
          P('I always put a lever on.', 'soft'),
        ],
      },
      {
        id: 'rule-three',
        label: 'Sit down beside Null, Byte. And wait.',
        set: { 's7-stopped': true },
        friendship: { byte: 1 },
        then: [
          B('For how long?'),
          Y('Until it isn’t waiting for the bell.'),
          B('That isn’t a unit of time.', 'think'),
          N('But he reaches over and pulls the lever himself.'),
        ],
      },
    ],
  ),
  scene(
    's7-same-graph',
    [
      B('I wasn’t trying to own it. I was trying to keep it. Turns out those make the same graph.', 'sad'),
      N('Null sits in the bed, waiting for a bell that isn’t coming. For the first time, it looks a little lost.'),
      P('A clock does the same thing every time. That’s what I love about clocks.', 'think'),
      P('Null isn’t a clock. I don’t think I knew that was the problem until now.'),
      B('Moss didn’t have a schedule or a single number. He was right anyway. I’ll have to think about that.', 'think'),
      P('Tomorrow evening. No clock. We’ll all just sit there. We’re very good at sitting there.', 'soft'),
    ],
    [
      {
        domain: 'science',
        skill: 'how living things differ from machines (think question)',
        kind: 'ask',
        after: 3,
        prompt: [
          P('Here’s what I keep wondering. A clock and a Nubbin both tick along, every day.'),
          P('What makes Null different from a machine?'),
        ],
        options: [
          {
            label: 'Null has feelings. A clock doesn’t.',
            reply: [P('That’s a good answer. A clock can’t be lonely, or happy, or bored. Null can.')],
          },
          {
            label: 'Null grows and changes. Clocks stay the same.',
            reply: [P('That’s fair. Null hatched, grew up, and will change again. My clock just gets dusty.')],
          },
          {
            label: 'Null wants things, like playing and friends.',
            reply: [P('That’s a fair answer, and I think it’s Moss’s answer too. A clock only does what it’s set to do. Null wants things of its own.')],
          },
          {
            label: 'Maybe they’re not that different.',
            reply: [
              P('That’s an honest answer. Bodies do work a bit like machines: hearts pump, legs push.'),
              P('But a machine can’t want to chase a moth. I think that bit matters most.'),
            ],
          },
        ],
        parentNote: 'Thought about how living things differ from machines (a think question with no wrong answer).',
      },
    ],
  ),
  // ------------------------------------------------ step 4: no clock
  scene(
    's7-no-clock',
    [
      N('Evening in Byte’s garden, and no bells. The Minder sits under a cloth on the step, with its lever down.'),
      N('Byte has brought his stopwatch. He holds it the way some people hold a habit they’ve given up.'),
      B('I’m not timing. I’m just holding it. In case.', 'think'),
      Y('In case of what?'),
      B('Unverified.'),
      N('For a long time, nothing. Null sits in the grass, looking at the place where the bell used to be.'),
      N('Then a moth goes past, and Null’s head turns. It watches the moth all the way to the hedge.'),
      B('Did you see that? That isn’t on any schedule.', 'shock'),
      N('Null takes one step after the moth, then looks back at you, as if checking that’s allowed.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'changing a habit happens in small steps',
        standard: 'CASEL: Self-management',
        kind: 'notice',
        after: 2,
        lines: [
          N('A habit is something you do so often you hardly notice. Byte has timed everything for years.'),
          N('Stopping a habit is hard. Holding the stopwatch without pressing it is his first small step.'),
        ],
        parentNote: 'Learned that changing a habit is hard and usually happens in small steps.',
      },
      {
        domain: 'science',
        skill: 'nocturnal animals',
        kind: 'notice',
        after: 7,
        lines: [
          B('Fact: most moths fly at night. Animals that are busy at night are called nocturnal.'),
          B('Bats, hedgehogs, most owls and most moths are nocturnal. That one is right on time.', 'happy'),
        ],
        parentNote: 'Learned the word nocturnal and some animals that are active at night.',
      },
    ],
    [
      {
        id: 'go-on',
        label: 'Nod. “Go on.”',
        then: [
          N('Null goes. It doesn’t catch the moth, but it falls into the hedge and comes out with a leaf on its head.'),
          N('Null, with no clock on it at all, says prrp, which Byte does not write down.'),
        ],
      },
      {
        id: 'stopwatch',
        label: 'Put the stopwatch down, Byte.',
        friendship: { byte: 2 },
        then: [
          N('Byte looks at it for a long moment. Then he lays it face down in the grass.'),
          B('It’s still running. I just can’t see it. That’s a start.'),
        ],
      },
    ],
  ),
  scene(
    's7-lap',
    [
      N('Near dark, at quarter past seven, Null comes back. It climbs into Byte’s lap without being asked, and falls asleep at once.'),
      N('Byte doesn’t move for an hour.'),
      N('You know it’s an hour because he doesn’t check. You check, a little.'),
      B('Its edges are bluer. Don’t tell me if I’m imagining it.', 'soft'),
      P('You’re not imagining it. I didn’t write it down. I just looked.', 'soft'),
      B('Looking. Huh. Unverified. But I’ll allow it.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'find a time one hour later',
        standard: '3.MD.A.1',
        kind: 'ask',
        after: 2,
        prompt: [N('Null fell asleep at quarter past seven. Byte didn’t move for one hour.'), N('What time was it when he finally moved?')],
        options: [
          { label: 'Quarter past eight', best: true, reply: [N('Yes. One hour later, the hour hand moves on by one. 7:15 becomes 8:15.')] },
          { label: 'Eight o’clock', reply: [N('Close! But we started at quarter past. One hour after 7:15 is 8:15, quarter past eight.')] },
          { label: 'Half past seven', reply: [N('That’s only fifteen minutes later. One whole hour after 7:15 is 8:15.')] },
        ],
        parentNote: 'Worked out a time one hour later (7:15 to 8:15).',
      },
    ],
  ),
  // ------------------------------------------------ complete
  scene('s7-complete', [
    N('A few evenings later, Pixel knocks on your door and says nothing, which is how you know.'),
    N('Null has curled up under Byte’s hedge, and the air around it has begun to glow.'),
    N('When a Nubbin’s life comes to an end, it makes a cocoon. Some fade, which means they die. Some are reborn as a new egg.'),
    B('End-of-life check. Four years, eleven weeks, two days. I said I wouldn’t say the days.', 'sad'),
    N('Byte sits by the cocoon with his hand on it, and doesn’t count. You can see how hard that is.'),
    N('The cocoon doesn’t thin. It glows warm and gold, and opens on an egg: small, blue, humming.'),
    B('Not Eternal. Reborn. It gets to start again, with someone who remembers it.', 'soft'),
    B('Here. My stopwatch. Keep it, please. I’ll only look at it.'),
    P('And the timer, with the bells off. It only counts lanterns now.', 'soft'),
    N('On your way home you notice Byte’s shoelace is tied. Nobody had to tell him. It won’t last.'),
  ], [
    {
      domain: 'science',
      skill: 'put a moth’s life cycle in order',
      standard: '3-LS1-1',
      kind: 'do',
      after: 5,
      lines: [
        P('It’s a life cycle. Egg, young, grown-up, cocoon, egg again. Round and round.', 'soft'),
        P('Moths have a life cycle too. Here are its stages, all muddled: moth, egg, pupa, caterpillar.'),
        P('Can you put them in order, starting with the egg?'),
      ],
      check: 'edu:order:moth-life-cycle',
      parentNote: 'Put the stages of a moth’s life cycle in order (egg, caterpillar, pupa, adult moth).',
    },
    {
      domain: 'sel',
      skill: 'two feelings at once',
      standard: 'CASEL: Self-awareness',
      kind: 'notice',
      after: 6,
      lines: [
        N('Byte looks sad and happy at the same time.'),
        N('That happens. Sad to say goodbye to grown-up Null, glad it gets to start again. Two big feelings can both be true.'),
      ],
      parentNote: 'Learned that it’s normal to feel two strong feelings, like sad and glad, at the same time.',
    },
  ]),
];

const S7: EduQuest = {
  id: 'reader:s7',
  of: 's7',
  band: 'reader',
  title: 'Unverified',
  goals: {
    's7-s1': {
      goal: 'Find Byte after Moss’s talk and hear what he’s writing.',
      hint: 'Byte stayed behind on the low wall by the long grass, with his notebook.',
    },
    's7-s2': {
      goal: 'See the timer Pixel has built for Null.',
      hint: 'Pixel’s workbench is behind the lantern shed. Follow the ticking.',
    },
    's7-s3': {
      goal: 'After a week of bells, go and see how Null is doing.',
      hint: 'Visit Byte’s house when the journal says a week has passed. A week is seven days.',
    },
    's7-s4': {
      goal: 'Spend an evening with Byte and Null with the timer off. Pet Null when it comes to you, and don’t count.',
      hint: 'Sit still near Byte and wait. Only pet Null once it comes close on its own.',
    },
  },
  scenes: S7_SCENES,
  glossary: [
    gloss('unit', 'A fixed amount used to measure things, like a metre or a minute.', 's7-unverified'),
    gloss('unverified', 'Not yet checked or proved to be true.', 's7-unverified'),
    gloss('calibration', 'Adjusting a machine so it works or measures exactly right.', 's7-minder'),
    gloss('logging', 'Writing down what happens, again and again, to keep a record.', 's7-first-bell'),
    gloss('data', 'Facts and numbers collected so you can study them.', 's7-week'),
    gloss('schedule', 'A plan that says when things will happen.', 's7-same-graph'),
    gloss('habit', 'Something you do so often that you do it without thinking.', 's7-no-clock'),
    gloss('nocturnal', 'Awake and busy at night, and asleep in the day.', 's7-no-clock'),
    gloss('cocoon', 'A soft case some creatures make around themselves while they change.', 's7-complete'),
    gloss('reborn', 'Born again, to start a new life.', 's7-complete'),
  ],
  notes:
    'Lessons: units and time (60 seconds, 90 seconds, one hour later), 3 × 7, reading a bar graph, forces, play, ' +
    'nocturnal animals, the moth life cycle; the prefix un-; habits and mixed feelings. Think question (s7-same-graph): ' +
    'what makes a living thing different from a machine. Null’s end of life is named plainly (fade means die) before ' +
    'the rebirth. Pixel is she/her (canon); her lines here happen to need no pronouns. Byte’s tied shoelace is a nod, ' +
    'not a close: the joke runs on to chapter 10 and Hazel’s letter.',
};

// ================================================================== S8 The Warren in the Hollow
/** The end of S8’s complete scene, shared by s8-complete and its variant s8-complete-dawn (as in the source). */
const S8_TAIL: Line[] = [
  H('Take this one home, then, love. Nothing’s mine. I only carry things for a bit.'),
  N('At the ring, the thin one wakes in your arms, sees her mother, and goes stiff all over with joy.'),
  N('Bramble washes her, ear to ear. Then she noses the old brown ribbon off her folded ear and drops it at your feet.'),
  N('Behind her, three strays stand up and look at you, as if waiting to see where you go next.'),
  NO('That’s you invited. Come whenever you like. Bring soft fruit.', 'soft'),
];

/** The tail’s two lessons: the theme after Hazel’s line (`start`), animal parents after the washing (`start + 2`). */
const s8TailLessons = (start: number): LessonIn[] => [
  {
    domain: 'literacy',
    skill: 'think about a theme: looking after things for others',
    standard: 'RL.4.2',
    kind: 'ask',
    after: start,
    prompt: [N('“Nothing’s mine. I only carry things for a bit.”'), N('What does Hazel mean?')],
    options: [
      {
        label: 'We look after things for a while, then pass them on.',
        best: true,
        reply: [H('That’s it, love. The Grove, the Nubbins, the gate. You keep them for the next ones.', 'soft')],
      },
      {
        label: 'She doesn’t like owning things.',
        reply: [H('Ha. I own a great many teapots. No: I mean we only look after things for a while, then hand them on.')],
      },
      {
        label: 'Her arms are tired.',
        reply: [H('They are, a bit. But I mean something bigger: we look after things for a while, then hand them on.', 'happy')],
      },
    ],
    parentNote: 'Thought about a theme of the story: looking after things for others (stewardship).',
  },
  {
    domain: 'science',
    skill: 'parents help their young survive',
    standard: '1-LS1-2',
    kind: 'notice',
    after: start + 2,
    lines: [
      N('Lots of animal mothers wash their babies, the way a cat licks her kittens clean.'),
      N('It keeps the baby clean and warm, and tells it: you’re mine, and you’re safe.'),
    ],
    parentNote: 'Learned that animal parents care for their young, for example by washing them.',
  },
];

const S8_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: further in
  scene(
    's8-further',
    [
      N('You are still by the flat stone with Hazel’s notebook when Nova steps out of the trees. She doesn’t say hello.'),
      NO('That’s the camp. It isn’t the whole of it.', 'think'),
      NO('“Fed nineteen today,” she wrote. Did you count her bowls? Twelve.'),
      NO('Twelve bowls, nineteen mouths. She wasn’t feeding them all here. She was carrying food further in.'),
      N('A firefly lands on the notebook, sits a moment, and lifts off into the dark beyond the camp. Then another.'),
      NO('They go the same way every night. I followed them once, years ago. I look in whenever I’m passing.'),
      NO('I’ve never brought anyone. Bring fruit. Walk slowly. Slower than that.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'subtract within 20 to find what’s missing',
        standard: '1.OA.A.1',
        kind: 'ask',
        after: 2,
        prompt: [NO('Nineteen Nubbins fed. Twelve bowls at the camp.'), NO('How many Nubbins didn’t have a bowl here?')],
        options: [
          { label: '7', best: true, reply: [NO('Seven. 19 − 12 = 7. Seven mouths being fed somewhere else.', 'think')] },
          { label: '31', reply: [NO('That’s 19 + 12. We want how many are left over: 19 − 12 = 7.')] },
          { label: '9', reply: [NO('Count on from 12: 13, 14, 15, 16, 17, 18, 19. That’s seven, not nine.')] },
        ],
        parentNote: 'Subtracted within 20 to find a missing amount (19 − 12 = 7).',
      },
      {
        domain: 'science',
        skill: 'fireflies make their own light',
        kind: 'notice',
        after: 4,
        lines: [
          NO('Fireflies aren’t really flies. They’re beetles that make their own light, in their tails.'),
          NO('They flash to find each other in the dark. Hardly any heat. Just glow.'),
        ],
        parentNote: 'Learned that fireflies are beetles that make their own light to signal to each other.',
      },
    ],
    [
      {
        id: 'lead',
        label: 'Lead on.',
        then: [NO('I don’t lead. I follow fireflies. You can follow me following them.')],
      },
      {
        id: 'nubbin',
        label: 'Should my Nubbin wait here?',
        friendship: { nova: 1 },
        then: [NO('No. They need to see you came with one that trusts you. It’s the only introduction that works.')],
      },
    ],
  ),
  scene(
    's8-ring',
    [
      N('The fireflies stop above a ring of old roots, knotted out of the ground like a fence nobody built.'),
      N('Inside sit dozens of grey Nubbins. Not in rows: in a ring, facing in. Some of them are touching.'),
      N('A stream runs close by, and the roots make a roof against the wind.'),
      N('In the middle sits an old grey Nubbin whose left ear folds over at the tip. A scrap of faded ribbon is tied round it.'),
      NO('They aren’t lost. They know exactly where they are. It’s everyone else they’ve lost track of.', 'soft'),
      NO('That one’s in charge. I call her the Old Girl. She’s never told me what she calls herself.'),
      NO('This is their warren. It’s been their home for longer than I’ve known it.'),
    ],
    [
      {
        domain: 'science',
        skill: 'what a habitat gives the animals that live there',
        standard: 'K-ESS3-1',
        kind: 'ask',
        after: 2,
        prompt: [NO('Hazel used to say a good home needs a few things. Look around the ring.'), NO('What does this place give the warren?')],
        options: [
          {
            label: 'Water, shelter, and each other.',
            best: true,
            reply: [NO('Yes. The stream for water, the roots against the wind, and a ring of friends. And Hazel brought the food.')],
          },
          {
            label: 'Nothing much. It’s just roots.',
            reply: [NO('Look again. The stream gives water, the roots keep off the wind, and they have each other. That’s a lot.')],
          },
          {
            label: 'Toys and beds.',
            reply: [NO('Ha. No toys. But the roots are a kind of shelter, the stream gives water, and they keep each other warm.')],
          },
        ],
        parentNote: 'Named what a habitat provides: water, shelter, company (and food).',
      },
    ],
  ),
  // ------------------------------------------------ step 2: the edge of the ring
  scene(
    's8-edge',
    [
      N('You take one step towards the roots. Every grey head in the ring turns at once, and you stop.'),
      NO('Nobody crosses. Not me. You don’t walk into someone’s house just because the door is made of roots.'),
      Y('Then how did Hazel feed them?'),
      NO('She left it at the edge and stepped back. Then she came again the next night. Patient. That’s the whole trick.'),
      N('The Old Girl watches you. Her dark ball hangs very still above her head.'),
      N('Close at her side sits a grey Nubbin thinner than all the rest. Its ear folds over at the tip, just like hers.'),
      NO('Her youngest, I think. Doesn’t eat much. The others leave it the soft fruit.', 'soft'),
    ],
    [
      {
        domain: 'sel',
        skill: 'respect an animal’s space and let it choose',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 3,
        prompt: [NO('So. How do you show a shy animal that you’re friendly?')],
        options: [
          {
            label: 'Leave food, step back, and come again tomorrow.',
            best: true,
            reply: [NO('That’s it. Let them choose to come to you. The choosing is what makes it trust.')],
          },
          {
            label: 'Walk in and pick one up.',
            reply: [NO('They’d run, or bite. Grabbing teaches them hands are scary. Leave food, step back, and let them choose.')],
          },
          {
            label: 'Shout hello so they know you’re there.',
            reply: [NO('Loud noises frighten shy animals. Quiet, slow and patient works better. Let them choose to come to you.')],
          },
        ],
        parentNote: 'Learned to respect an animal’s space and let it choose to come closer.',
      },
      {
        domain: 'science',
        skill: 'animals in groups look after each other',
        standard: '3-LS2-1',
        kind: 'notice',
        after: 6,
        lines: [
          NO('Groups look after their young. In a wolf pack, the grown-ups carry food back for the pups.'),
          NO('Here, the strong ones leave the soft fruit for the thin one.'),
        ],
        parentNote: 'Learned that animals in groups help each other survive, like wolves bringing food to their pups.',
      },
    ],
    [
      {
        id: 'soft-fruit',
        label: 'Leave the softest fruit nearest the thin one.',
        set: { 's8-soft-fruit': true },
        friendship: { nova: 1 },
        then: [NO('…That’s what Hazel did. Exactly that.', 'shock')],
      },
      {
        id: 'sit-off',
        label: 'Put the fruit down, and sit a little way off.',
        then: [
          N('You sit. After a long time, a grey Nubbin creeps out, takes one piece, and carries it to the middle.'),
          NO('Good. Now do that for three nights.'),
        ],
      },
    ],
  ),
  scene(
    's8-gap',
    [
      N('You come back three evenings running, with twelve pieces of fruit to share out between them.'),
      N('On the third evening the Old Girl gets up, slowly, and steps aside. There is a gap in the ring, one Keeper wide.'),
      NO('Whenever I pass through the valley, I come and sit by these roots. She has never once done that for me.', 'shock'),
      N('Up close, her ribbon was brown once, with a leaf stitched on it. Five points, one curled stem.'),
      N('You have seen that leaf before. It’s on Fern’s gloves, Fern’s gate, and Fern’s tea cosy.'),
      NO('Hazel’s notebook. “The brown one let me touch her ear.” She isn’t brown. Her ribbon was.', 'think'),
    ],
    [
      {
        domain: 'maths',
        skill: 'share into equal groups',
        standard: '3.OA.A.3',
        kind: 'do',
        after: 0,
        lines: [
          N('Twelve pieces of fruit, shared fairly over three evenings.'),
          N('Sort them into three equal piles at the roots. How many go in each pile?'),
        ],
        check: 'edu:share:fruit:12-into-3',
        parentNote: 'Shared 12 into 3 equal groups (12 ÷ 3 = 4).',
      },
      {
        domain: 'literacy',
        skill: 'put clues together to make an inference',
        kind: 'ask',
        after: 5,
        prompt: [
          N('Nova is putting clues together, like a detective.'),
          N('The leaf on the ribbon is Fern’s leaf. Who do you think the Old Girl might be?'),
        ],
        options: [
          { label: 'A Nubbin Fern lost, long ago.', best: true, reply: [NO('That’s what I think too. Fern sews that leaf on everything she loves.', 'think')] },
          { label: 'Fern’s tea cosy.', reply: [NO('Ha. No, she’s definitely a Nubbin. But the leaf is Fern’s. Fern must have tied it on, long ago.')] },
          { label: 'Nobody special.', reply: [NO('Maybe. But nobody sews a leaf on a ribbon for nobody. I think Fern lost her once.')] },
        ],
        parentNote: 'Used clues in the story to make an inference about a character.',
      },
    ],
  ),
  // ------------------------------------------------ step 3: Fern’s gate
  scene(
    's8-fern-gate',
    [
      N('Fern is leaning on her gate, stitching a leaf onto a glove that already has three.'),
      F('You’re staring at my glove. It’s a leaf. I put them on everything.'),
      F('I put one on a ribbon once. Long time ago.', 'think'),
      N('She pulls the thread tight, and keeps pulling after it’s tight.'),
      F('Six years ago. The Midsummer race. She went over the rail on the cliff bend. I stood at the bottom till dark.', 'sad'),
      F('Everyone said she couldn’t have lived. Everyone was very kind about it. I hated it.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'find a line of symmetry',
        standard: '4.G.A.3',
        kind: 'ask',
        after: 1,
        prompt: [
          N('Look at Fern’s leaf: five points, with a vein down the middle. Forget the curly stem for a moment.'),
          N('If you folded the leaf along that middle vein, would the two halves match?'),
        ],
        options: [
          {
            label: 'Yes, they’d match.',
            best: true,
            reply: [N('Yes. The middle vein is a line of symmetry: each half is a mirror of the other. Lots of leaves are nearly symmetrical.')],
          },
          {
            label: 'No, they’d be different.',
            reply: [N('Look again: two points on each side, and one at the top. Fold down the middle and they match. That fold is a line of symmetry.')],
          },
        ],
        parentNote: 'Found a line of symmetry in a leaf shape.',
      },
      {
        domain: 'sel',
        skill: 'how to help a grieving friend',
        standard: 'CASEL: Social awareness',
        kind: 'notice',
        after: 5,
        lines: [
          N('People were kind to Fern, but their words didn’t help. When someone is very sad, words can’t always fix it.'),
          N('What often helps more is listening, and staying close.'),
        ],
        parentNote: 'Learned that listening and staying close can help a grieving friend more than words.',
      },
    ],
    [
      {
        id: 'tell',
        label: 'Fern. I think I’ve found her.',
        set: { 's8-told': true },
        friendship: { fern: 1 },
        then: [
          F('Don’t.', 'sad'),
          F('Don’t say that unless…', 'sad'),
          Y('Bring fruit. Soft fruit.'),
          N('She is through her own gate before you’ve finished, still holding the needle.'),
        ],
      },
      {
        id: 'ask',
        label: 'Will you help me carry fruit to the Hollow tonight?',
        set: { 's8-told': false },
        then: [
          F('The Hollow? At night? With you?', 'think'),
          F('…Fine. Someone has to carry things badly.'),
          N('She doesn’t ask why. You don’t tell her. Not yet.'),
        ],
      },
    ],
  ),
  scene(
    's8-arrive',
    [
      N('The fireflies drift ahead of you both, low over the path, like sparks from a slow fire.'),
      F('Is it always this dark? How did Hazel do this every night? She couldn’t see her own feet.', 'think'),
      N('Fern walks into a tree, says sorry to it, and walks into the same tree again.'),
      F('I’m carrying the soft fruit. I insisted. I have sat on two of them.', 'sad'),
      F('They’re still soft. Softer, if anything. That has to count.', 'think'),
      N('At the stream she takes her boots off, wades across, and puts them back on the wrong feet. She doesn’t notice for a mile.'),
      N('Then the path dips, the fireflies settle low, and for the first time all night, Fern stops talking.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'spot a simile',
        standard: 'L.4.5',
        kind: 'ask',
        after: 0,
        prompt: [
          N('“Like sparks from a slow fire.” When a writer says one thing is like another, that’s called a simile.'),
          N('What are the fireflies being compared to?'),
        ],
        options: [
          { label: 'Sparks from a fire', best: true, reply: [N('Yes. Small, glowing and drifting. A simile uses “like” or “as” to paint a picture.')] },
          { label: 'The path', reply: [N('The path is where they fly. The simile compares the fireflies to sparks: small, bright and drifting.')] },
          { label: 'Fern', reply: [N('Ha. Fern is more like a tree-bumping machine. The fireflies are compared to sparks from a fire.')] },
        ],
        parentNote: 'Spotted a simile and said what it compares.',
      },
      {
        domain: 'science',
        skill: 'we need light to see; eyes adjust to the dark',
        standard: '1-PS4-2',
        kind: 'notice',
        after: 1,
        lines: [
          N('We see things when light bounces off them into our eyes. In the dark, there’s very little light.'),
          N('But eyes slowly get used to it. After about half an hour in the dark, you can see far more than at first.'),
        ],
        parentNote: 'Learned that we need light to see, and that our eyes slowly adjust to the dark.',
      },
    ],
  ),
  // ------------------------------------------------ step 4: Fern finds her
  scene(
    's8-reunion',
    [
      N('Fern stops at the roots, and every grey head turns.'),
      N('She doesn’t notice them. She’s looking at the middle.'),
      N('The Old Girl is already standing. Her folded ear is up. The scrap of brown ribbon hangs from it, leaf and all.'),
      F('Oh.', 'shock'),
      F('Bramble? …Oh, you’ve gone grey. That’s all right, love. So have I.', 'soft'),
      N('For a long moment, nobody in the ring moves.'),
      N('Then Bramble walks out through the gap, one careful step at a time, all the way to Fern’s boots.'),
      N('Bramble says nothing. She puts her grey head against Fern’s shin and keeps it there.'),
      F('I stood at the bottom of that cliff till dark. I thought I’d left you there.', 'sad'),
      F('I’m sorry I stopped looking. I’m so sorry I stopped looking.', 'sad'),
      N('Bramble sits down on Fern’s boots, both of them at once, and stays put.'),
      F('Right. Good. I’m going to cry now. Somebody hold my gloves.', 'happy'),
    ],
    [
      {
        domain: 'sel',
        skill: 'guilt, sorry and being kind to yourself (think question)',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 9,
        prompt: [
          N('Fern is saying sorry for something from six years ago. Everyone told her Bramble couldn’t have lived.'),
          N('Do you think Fern did something wrong by stopping looking?'),
        ],
        options: [
          {
            label: 'No. She did her best with what she knew.',
            reply: [N('That’s a kind answer. Fern believed what everyone told her. Being kind to yourself matters too.')],
          },
          {
            label: 'A bit, but she’s sorry, and that matters.',
            reply: [N('That’s a fair answer. Saying sorry, even late, is brave. And Bramble doesn’t seem to mind at all.')],
          },
          {
            label: 'I’m not sure.',
            reply: [N('That’s an honest answer. Some things don’t have a clear right or wrong. Fern isn’t sure either, and that’s all right.')],
          },
        ],
        parentNote: 'Thought about guilt, saying sorry and being kind to yourself (a think question with no wrong answer).',
      },
      {
        domain: 'sel',
        skill: 'happy tears',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 11,
        lines: [
          N('Fern is going to cry, and she’s happy. A reunion can make anyone cry.'),
          N('Tears can come with any big feeling, happy ones too. It’s all right to let them out.'),
        ],
        parentNote: 'Learned that people cry with happy feelings too, and that tears are all right.',
      },
    ],
    [
      {
        id: 'gloves',
        label: 'Hold her gloves.',
        friendship: { fern: 2 },
        then: [
          N('You hold them. Fern sits down in the mud with Bramble in her lap and cries for a long time.'),
          N('Bramble lets her.'),
        ],
      },
      {
        id: 'new-ribbon',
        label: 'Hand Fern a ribbon from your pocket.',
        set: { 's8-new-ribbon': true },
        friendship: { fern: 3 },
        then: [
          F('You carry ribbons? Course you do. You’re Hazel’s.', 'think'),
          N('Fern stitches a leaf onto it there and then, with shaking hands, and ties it under the old one.'),
          F('She keeps both. She always was greedy.', 'happy'),
        ],
      },
    ],
  ),
  scene(
    's8-one-short',
    [
      N('Later, Bramble walks back to the middle of the ring. She has a job, and she goes back to it.'),
      F('She always did like being in charge.', 'soft'),
      N('Bramble sits down and looks past you all, up the dark path, the way she looked the first night.'),
      NO('The thin one. Her youngest. It isn’t at the ring tonight.', 'think'),
      F('Then we leave the soft fruit at the edge till it is.', 'soft'),
      N('Fern sets the softest plum down at the roots, and steps back. Patient, like Hazel.'),
    ],
    [
      {
        domain: 'science',
        skill: 'some animal groups have an experienced leader',
        standard: '3-LS2-1',
        kind: 'notice',
        after: 1,
        lines: [
          NO('Lots of animal groups have a leader. In an elephant herd, it’s usually the oldest female.'),
          NO('She remembers where to find water in a dry year, and her family follows her. Bramble’s a bit like that.'),
        ],
        parentNote: 'Learned that some animal groups, like elephant herds, are led by an experienced older female.',
      },
    ],
  ),
  // ------------------------------------------------ complete
  scene('s8-complete', [
    N('Hazel sits on the bench by the pond, the thin grey Nubbin asleep in the crook of her arm.'),
    H('This one? Found her at the edge of a ring of roots, too tired to stand. So I carried her.', 'think'),
    H('Her mother runs the place. Ear folds over at the tip. Opinions. I gather you’ve met.'),
    Y('Fern found her. Her name’s Bramble.'),
    H('Did she. Oh, Fern. Did she.', 'soft'),
    ...S8_TAIL,
  ], s8TailLessons(5)),
];

const S8: EduQuest = {
  id: 'reader:s8',
  of: 's8',
  band: 'reader',
  title: 'The Warren in the Hollow',
  goals: {
    's8-s1': {
      goal: 'Follow Nova and the fireflies past Hazel’s camp.',
      hint: 'Walk while the fireflies drift. Stand still when they settle. They lead on past the flat stone.',
    },
    's8-s2': {
      goal: 'Leave fruit at the edge of the ring, a little at a time, until the Old Girl lets you in.',
      hint: 'Bring twelve pieces of fruit over three evenings: four each time. Set them down at the roots and step back.',
    },
    's8-s3': {
      goal: 'Bring Fern to the ring of roots in the Hollow.',
      hint: 'Fern is at her gate next door. Walk her past the falls to the Hollow. She’ll keep up, mostly.',
    },
    's8-s4': {
      goal: 'Sit at the edge of the ring with Fern, and let the Old Girl come to her.',
      hint: 'Sit down by the roots with Fern and wait. Don’t reach in.',
    },
  },
  scenes: S8_SCENES,
  glossary: [
    gloss('beyond', 'Further away than something; on the far side of it.', 's8-further'),
    gloss('warren', 'A crowded home where lots of animals live close together, like rabbits in their tunnels.', 's8-ring'),
    gloss('huddle', 'To crowd close together, often to keep warm.', 's8-ring'),
    gloss('patient', 'Able to wait calmly, without getting cross or giving up.', 's8-edge'),
    gloss('stitched', 'Sewn on with a needle and thread.', 's8-gap'),
    gloss('symmetry', 'When one half of a shape is a mirror image of the other half.', 's8-fern-gate'),
    gloss('simile', 'A way of describing something by saying it is like something else.', 's8-arrive'),
    gloss('wades', 'Walks through water.', 's8-arrive'),
    gloss('reunion', 'When people or animals who were apart meet again.', 's8-reunion'),
    gloss('opinions', 'What someone thinks or believes about things.', 's8-complete'),
  ],
  notes:
    'Lessons: animals in groups (penguin huddles cut from s8-ring in the 2026-10-22 pass; wolf packs, elephant matriarchs), habitat needs, fireflies, light ' +
    'and dark-adapted eyes, parents and young; 19 − 12, 12 ÷ 3, symmetry; inference, simile, theme; respecting an ' +
    'animal’s space, helping a grieving friend, happy tears. Think question (s8-reunion): did Fern do wrong to stop ' +
    'looking? The scene-level set (s8Reunited) stays on the original s8-reunion. ' +
    'CANON. Bramble’s left ear folds over at the tip, and so does her youngest’s; neither is torn (Wisp has the torn ' +
    'ear). Bramble greets Fern by sitting on her boots. Nova has looked in at the ring for years when passing; she has ' +
    'not been coming for months on end. VARIANT. s8-complete-dawn (EDU_SIDE_2_READER_VARIANTS) replaces s8-complete ' +
    'when c10-bramble has played, and skips Hazel’s account; both end with S8_TAIL and its two lessons.',
};

// ================================================================== S9 The Gate That Sticks
const S9_GATE_OPEN: Line[] = [
  N('First light. The pond is grey and still. Hazel sits beside it with a cup, her back to the gate.'),
  N('Corvin is at the gate. He has been there all night.'),
  N('There’s frost on his shoulders: the ordinary kind, the kind that melts.'),
  C('Hazel’s grandchild.', 'soft'),
  N('His hands rest on the top bar. They aren’t blue any more. They shake a little, the way warm hands do in the cold.'),
  N('At the edge of the long grass, a grey ear turns towards his voice, and goes flat.'),
];
const S9_GATE_CLOSE: Line[] = [
  C('I know who’s sitting by that pond. I know what I took from her. I’m asking anyway.'),
  N('Behind you, Hazel drinks her tea and does not turn round. She is listening to every word.'),
];
const S9_FAMILY_EXTRA: Line[] = [
  C('Things keep reaching me this week, from your side of the valley. Things people said. Things people found.', 'think'),
  C('I didn’t know what to do with any of it. I still don’t. I kept all of it anyway.', 'soft'),
];

/** The gate’s two lessons: hinges after the hands line, the think question after the last line. */
const s9GateLessons = (lastLine: number): LessonIn[] => [
  {
    domain: 'science',
    skill: 'hinges, and why handles go far from them',
    standard: '3-PS2-1',
    kind: 'notice',
    after: 4,
    lines: [
      N('A gate swings on its hinges: the metal joints that hold it to the post.'),
      N('Push near the hinges and it barely moves. Push far from them, out by the latch, and it swings easily.'),
      N('That’s why latches and handles always go on the far side.'),
    ],
    parentNote: 'Learned that a push far from a hinge turns a gate more easily, which is why handles sit far from hinges.',
  },
  {
    domain: 'sel',
    skill: 'forgiveness and trust (think question)',
    standard: 'CASEL: Responsible decision-making',
    kind: 'ask',
    after: lastLine,
    prompt: [
      N('Corvin is sorry. He gave back the trowel. He asked, instead of taking.'),
      N('But the grey ear in the long grass still goes flat when he speaks.'),
      N('Can you forgive someone, but not trust them yet?'),
    ],
    options: [
      {
        label: 'Yes. Forgiving and trusting are different.',
        reply: [N('That’s a thoughtful answer. Forgiving is letting go of the anger. Trust gets built slowly, one visit at a time.')],
      },
      {
        label: 'No. If you forgive, you should trust them again.',
        reply: [N('That’s a fair answer, and a generous one. Some people feel that way. Others think trust takes longer than sorry.')],
      },
      {
        label: 'It depends on what they did.',
        reply: [N('That’s a wise answer. Small things are easy to forgive and trust again. Big things, like taking Ash, can take years.')],
      },
      {
        label: 'I’m not sure yet.',
        reply: [N('That’s an honest answer, and it’s allowed. Hazel took twenty-two years. You can take your time too.')],
      },
    ],
    parentNote: 'Thought about the difference between forgiving someone and trusting them (a think question with no wrong answer).',
  },
];

const S9_FAMILY: Choice = {
  id: 'family',
  label: 'Show him the trick. “Lift and push.”',
  set: { corvinGate: 'family' },
  friendship: { luna: 1, clover: 1 },
  then: [
    Y('Lift and push. Both at once. It was never the latch.'),
    N('He looks at you. Then he puts both hands on the bar, lifts the gate a finger’s width, and pushes.'),
    N('It swings open. It sticks again behind him, the way it does for everyone who lives here.'),
    C('…Oh.', 'shock'),
    C('That’s all it ever was.', 'soft'),
    N('He walks to the pond and sits down an arm’s length from Hazel. She hands him the cup without looking.'),
    N('Neither of them says anything. He isn’t very good at it yet. She is.'),
    N('In the long grass, the grey ear is still flat. Not today, then. Perhaps not this year.'),
  ],
};
const S9_GUEST: Choice = {
  id: 'guest',
  label: 'Open it for him. Don’t show him how.',
  set: { corvinGate: 'guest' },
  then: [
    N('You lift and push, and the gate opens. He watches your hands. You turn them so he can’t quite see.'),
    C('Thank you.', 'soft'),
    C('I’ll have to knock, every time. That’s right. That’s more than right.', 'think'),
    N('By the pond, Hazel lifts one hand a little and lets it fall. It might be a wave.'),
  ],
};
const S9_SHUT: Choice = {
  id: 'shut',
  label: 'Leave it shut.',
  set: { corvinGate: 'shut' },
  friendship: { ember: 1 },
  then: [
    N('You don’t move. He looks at you, then at the latch, and nods, as if you’ve told him the time.'),
    C('Yes. All right. Yes.', 'sad'),
    C('It ought to cost something. I’d think less of this place if it didn’t.', 'think'),
    C('Thank you for taking the trowel. I mean that.', 'soft'),
    N('He takes his hands off the gate one at a time. He goes down the lane, and is gone before Sparks arrives.'),
    N('By the pond, Hazel finishes her tea. She sits a while longer than she needs to.'),
  ],
};

const S9_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: the rattle
  scene(
    's9-dusk',
    [
      N('Dusk, on Hazel’s second evening home. The gate rattles.'),
      N('Not the clean clack of someone who knows the trick. A long, unsure rattle. Then another.'),
      H('That’ll be him.', 'soft'),
      N('Hazel doesn’t get up from the step. She doesn’t look round. Her eyes are shut.'),
      H('Go on. I jammed it so I’d hear him. I’ve heard him. That’s my part done.'),
      N('Corvin Vale is at the gate, with no hat, in a coat he has slept in. No runners behind him. No rows.'),
      N('His hands are on the top bar, red and sore, like hands brought in out of the snow.'),
      C('I can feel my hands. I’d forgotten it hurts, warming up. Nobody mentions that it hurts.', 'sad'),
      N('His hand goes to his breast pocket, finds it flat, and comes away. He does it twice while you watch.'),
      N('He lifts the latch and pushes, as anyone would. The gate shifts in its frame, and sticks.'),
      C('It used to open for me. I’d wait, and it would just swing. I thought that meant something.', 'think'),
      C('It was the cold from the stone in my pocket. It shrank the wood. I took it for a welcome.'),
      N('He passes something through the bars, handle first: a trowel, its blade worn thin.'),
      C('Hers. I dug with it, under the long grass, twenty-two years ago. I’ve kept it oiled. Don’t say it’s from me.', 'soft'),
    ],
    [
      {
        domain: 'health',
        skill: 'why cold hands sting as they warm up',
        kind: 'notice',
        after: 7,
        lines: [
          N('When very cold hands warm up again, they often sting and ache for a while.'),
          N('That’s blood rushing back in, and the nerves waking up. It hurts, and then it passes.'),
        ],
        parentNote: 'Learned that very cold hands can sting as they warm up, and why.',
      },
      {
        domain: 'science',
        skill: 'friction, and why lifting a dragging gate helps',
        standard: '3-PS2-1',
        kind: 'ask',
        after: 9,
        prompt: [
          N('The gate is stuck. Its bottom edge drags on the ground, and the rubbing holds it still. That rubbing force is called friction.'),
          N('Why does lifting the gate before you push help?'),
        ],
        options: [
          {
            label: 'Lifting takes its weight off the spot where it rubs.',
            best: true,
            reply: [N('Yes. Less weight pressing down means less friction. Then a push is enough to move it.')],
          },
          {
            label: 'Lifting makes the gate lighter.',
            reply: [N('The gate weighs the same. But lifting takes its weight off the ground, so it rubs less. Less friction, easier push.')],
          },
          {
            label: 'It’s magic.',
            reply: [N('It does feel like magic! But it’s friction: lift the weight off the rubbing spot, and a push can move it.')],
          },
        ],
        parentNote: 'Learned about friction, and why lifting a dragging gate makes it easier to push.',
      },
    ],
    [
      {
        id: 'why',
        label: 'Why now?',
        then: [
          C('Because I can feel my hands. I didn’t have a reason before. I had a stone.', 'soft'),
          N('He goes down the lane. He looks back once, at the cottage, where Hazel sits with her eyes shut.'),
        ],
      },
      {
        id: 'come-in',
        label: 'Do you want to come in?',
        then: [
          C('Want to? Yes.', 'soft'),
          C('Not tonight. I haven’t asked. If I ever come in, it’ll be because I asked.', 'think'),
          N('He goes down the lane, and doesn’t look back. You think it costs him something not to.'),
        ],
      },
      {
        id: 'take',
        label: 'Say nothing. Take the trowel.',
        then: [
          N('You take it. The handle is warm from his coat.'),
          C('Thank you.', 'soft'),
          N('He goes down the lane. He looks back once, at the cottage, where Hazel sits with her eyes shut.'),
        ],
      },
    ],
  ),
  scene(
    's9-trowel',
    [
      N('Hazel turns the trowel over in her hands, and runs her thumb along the worn edge.'),
      H('I wondered where that went. I bought another. It was never as good.', 'think'),
      H('You’ll want the story. You’ve been very good about not asking. It’s been unbearable to watch.', 'happy'),
      H('He came to me at twenty-two. Clever. Quick. In a hurry, which I took for keen.'),
      H('He found the old clay tablets in this cottage. Older than me. Older than the wall. They showed him how to make a Nubbin keep very still, for ever.', 'think'),
      H('One winter he tried their method on my Nubbins, in my Grove. Quiet as stones, by morning.', 'sad'),
      H('I stopped him. I said things. He said things. I was right, which is very tiring for everyone.'),
      H('That night he let strangers in through the gate. They took Nubbins, and the cold stone from under the fourth post.', 'sad'),
      H('In the morning I wedged the gate.'),
      Y('So he couldn’t get back in.'),
      H('No, love. So I’d hear him if he ever came back.', 'soft'),
    ],
    [
      {
        domain: 'science',
        skill: 'a lever turns on a pivot',
        kind: 'notice',
        after: 1,
        lines: [
          H('Good trowel, this. When you dig, you push the handle down, and the blade lifts the soil up.'),
          H('That makes it a lever: a bar that turns on a pivot. Here, the pivot is the edge of the hole.'),
          H('A lever helps a small push lift something heavy. Corvin dug up a stone with this one.'),
        ],
        parentNote: 'Learned what a lever and a pivot are, using a garden trowel.',
      },
      {
        domain: 'literacy',
        skill: 'work out a character’s motive',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 10,
        prompt: [N('Hazel wedged the gate so it would stick.'), N('Why did she do it?')],
        options: [
          {
            label: 'So she’d hear Corvin if he ever came back.',
            best: true,
            reply: [N('Yes. A stuck gate rattles. She wanted to know if he came home. That’s her motive: her reason.')],
          },
          {
            label: 'To keep Corvin out for ever.',
            reply: [N('That’s what you’d guess! But Hazel says no. She wanted to hear him if he came back. That’s her motive.')],
          },
          {
            label: 'Because she couldn’t fix it.',
            reply: [N('Hazel can fix most things. She did it on purpose: so she’d hear him if he ever came back.')],
          },
        ],
        parentNote: 'Worked out a character’s motive (her reason for doing something) from what she says.',
      },
    ],
    [
      {
        id: 'hate',
        label: 'How can you not hate him?',
        then: [
          H('I did, for a good while. Hating someone is heavy. I had Nubbins to look for, so I put it down.'),
          H('I didn’t forgive him. I just needed both hands.', 'think'),
        ],
      },
      {
        id: 'found',
        label: 'Did you find them? The ones he took?',
        then: [H('Most of them. It’s in the register. The rest I stopped looking for, one winter. I’ve never forgiven myself for stopping.', 'sad')],
      },
      {
        id: 'sit',
        label: 'Sit down next to her. Say nothing.',
        then: [
          N('You sit. She leans, just a little, so your shoulders touch.'),
          H('There. Better than anything you could have said. Don’t go getting big-headed about it.', 'soft'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 2: he asks
  scene(
    's9-yours',
    [
      N('She sets the trowel on the step beside her, blade down, as if it might get away.'),
      H('He’ll be back tomorrow at dusk. Same time. He was always a creature of habit. That was half the trouble.'),
      H('I’m not going down there. I’ve done my part. I listened for twenty-two years.', 'soft'),
      H('It’s your gate now. Don’t look at me like that. I only wedged it.', 'happy'),
      Y('What do I say to him?'),
      H('Nothing, to start with. Rule three works on people too. It works on people worst of all.', 'think'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'understand a saying (“creature of habit”)',
        standard: 'L.3.4',
        kind: 'notice',
        after: 1,
        lines: [
          N('“A creature of habit” is a saying. It means someone who does the same things at the same times.'),
          N('It doesn’t mean Corvin is an animal. Though Hazel might enjoy you thinking so.'),
        ],
        parentNote: 'Learned the meaning of a common saying, “a creature of habit”.',
      },
      {
        domain: 'sel',
        skill: 'patient listening helps people say hard things',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 5,
        lines: [
          H('When someone has something hard to say, the kindest thing is often to wait and listen.'),
          H('If you rush to fill the quiet, they never get to say it.', 'soft'),
        ],
        parentNote: 'Learned that patient listening helps people say difficult things.',
      },
    ],
  ),
  scene(
    's9-ask',
    [
      N('Sundown. He is there before you, as if he never left. Perhaps he didn’t.'),
      C('I’ve been practising this. In the lane. Out loud. A sheep heard most of it.', 'think'),
      N('He puts both hands on the top bar. He doesn’t try the latch.'),
      C('Twenty-two years ago I stood here and opened this gate for men with carts. I didn’t ask anyone.'),
      C('I’ve opened every gate since. Mine. The Circuit’s. Other people’s. I never once had to ask.'),
      C('So.'),
      N('…'),
      C('I would like to come in.', 'soft'),
      N('He says it to the gate, not to you. Then he looks up, and says it again, to you.'),
      C('I would like to come in. I don’t expect it. I’m only asking.', 'soft'),
      C('I’ll wait here till first light. If it’s still shut then, I’ll understand. Better than anyone.'),
      N('He lets go of the bar and steps back into the lane, out of the lamplight. Not far.'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'asking permission is a rule of respect',
        standard: 'D2.Civ.8.K-2',
        kind: 'notice',
        after: 4,
        lines: [
          N('Here is a basic rule of respect: you ask before you go into someone else’s home.'),
          N('Corvin has spent years not asking. Now he is going to try.'),
        ],
        parentNote: 'Talked about asking permission as a rule of respect.',
      },
      {
        domain: 'literacy',
        skill: 'why a writer repeats a line',
        standard: 'RL.2.4',
        kind: 'ask',
        after: 9,
        prompt: [N('Corvin says the same words twice: “I would like to come in.”'), N('Why do you think he says it a second time?')],
        options: [
          {
            label: 'The first time, he was too scared to look at you.',
            best: true,
            reply: [N('That’s how it reads. First he says it to the gate. The second time, he’s brave enough to say it to you.')],
          },
          {
            label: 'He forgot he’d said it.',
            reply: [N('He’s been practising all day, so he hasn’t forgotten! The first time he said it to the gate. The second time, to you.')],
          },
          {
            label: 'The sheep didn’t hear.',
            reply: [N('Ha. The sheep has heard plenty. He says it again because the first time was to the gate, and the second is to you.')],
          },
        ],
        parentNote: 'Thought about why a writer repeats a line, and what the repetition shows.',
      },
    ],
  ),
  // ------------------------------------------------ step 3: the gate
  scene(
    's9-word',
    [
      N('Word gets round, as it does in a valley this size. By supper, everyone knows Corvin Vale has asked to come in.'),
      E('He took Ash. I’m not telling you what to do. I’m telling you what he did. That’s different.', 'angry'),
      E('And some of what sleeps in your long grass came out of his rows. They live on your side of that gate too.', 'think'),
      LU('Sable came out of his garden. I keep thinking that. And then I keep thinking: she came out.', 'think'),
      F('I’d let him in. Then I’d lie awake all night. Both of those are true, so I’m no use to you at all.', 'think'),
      CL('The grey stays, you know. On him too, I expect. You can only make it lighter.', 'soft'),
      B('For the record, I’ve done the numbers. People changing for good doesn’t happen very often.', 'think'),
      B('I’d still open the gate. I don’t know why. Don’t put that in the record.'),
      N('Hazel says nothing at all. On her way out to the pond, she leaves the cottage door on the latch, which she never does.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'link a character’s point of view to what happened to her',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 2,
        prompt: [N('Everyone has a different point of view. Ember is the most careful about Corvin.'), N('Why do you think that is?')],
        options: [
          {
            label: 'He took Ash from her.',
            best: true,
            reply: [N('Yes. What happens to us shapes how we see things. Ember was hurt the most, so she’s the most careful.')],
          },
          {
            label: 'She doesn’t like gates.',
            reply: [N('Ha! Look back at her first line: “He took Ash.” She was hurt the most, so she’s the most careful.')],
          },
          {
            label: 'She’s grumpy with everyone.',
            reply: [N('She can be! But here there’s a real reason: Corvin took Ash. Being hurt makes people careful.')],
          },
        ],
        parentNote: 'Linked a character’s point of view to what has happened to her.',
      },
      {
        domain: 'social-studies',
        skill: 'fair decisions listen to every side',
        standard: 'D2.Civ.8.K-2',
        kind: 'notice',
        after: 7,
        lines: [
          N('Everyone gets a say, even when they disagree. Listening to every side before you choose is fair.'),
          N('But the choice is yours. It’s your gate now.'),
        ],
        parentNote: 'Learned that fair decisions listen to every side, even when people disagree.',
      },
    ],
  ),
  scene('s9-gate', [...S9_GATE_OPEN, ...S9_GATE_CLOSE], s9GateLessons(7), [S9_GUEST, S9_SHUT]),
  // ------------------------------------------------ complete
  scene('s9-complete', [
    N('Sparks arrives first, at a run, as always. Then Fern. Then everyone: a whole valley coming up the lane.'),
    N('Sparks, Fern, Marina, Clover, Pixel, Luna, Ember, Byte, Dusty and Nova.'),
    N('One by one they lift and push. The gate opens for each of them, and sticks again behind them.'),
    H('Good gate, that. I never did unwedge it.', 'soft'),
    N('She doesn’t say anything else about it, then or ever.'),
    N('You understand that this is how she says it’s finished.'),
  ], [
    {
      domain: 'maths',
      skill: 'multiply equal groups',
      standard: '3.OA.A.1',
      kind: 'ask',
      after: 2,
      prompt: [N('Every Keeper does two moves: lift, then push. Ten Keepers come through.'), N('How many moves is that altogether?')],
      options: [
        { label: '20', best: true, reply: [N('Yes. Ten groups of two: 10 × 2 = 20. Lift, push, twenty times.')] },
        { label: '12', reply: [N('That’s 10 + 2. But each of the ten Keepers does two moves: 10 × 2 = 20.')] },
        { label: '10', reply: [N('That’s one move each. But it’s lift AND push: two moves each, so 10 × 2 = 20.')] },
      ],
      parentNote: 'Used multiplication for equal groups (10 Keepers × 2 moves = 20).',
    },
    {
      domain: 'literacy',
      skill: 'an object in a story can be a symbol',
      standard: 'RL.4.2',
      kind: 'notice',
      after: 5,
      lines: [
        N('In stories, an object can stand for a big idea. That’s called a symbol.'),
        N('Here, the gate that sticks stands for home: a place that hears who comes back, and lets in the ones who ask.'),
      ],
      parentNote: 'Learned that an object in a story can be a symbol for a bigger idea.',
    },
  ]),
];

const S9: EduQuest = {
  id: 'reader:s9',
  of: 's9',
  band: 'reader',
  title: 'The Gate That Sticks',
  goals: {
    's9-step1': {
      goal: 'Take the old trowel to Hazel.',
      hint: 'She’s on the cottage step. Give it to her from your bag.',
    },
    's9-step2': {
      goal: 'Go down to the gate at dusk tomorrow.',
      hint: 'Corvin comes at sundown. Stand by the gate. You don’t need to open it.',
    },
    's9-step3': {
      goal: 'Be at the gate at first light, before the others come.',
      hint: 'Chapter 12 begins at dawn. Go to the gate before anything else.',
    },
  },
  scenes: S9_SCENES,
  glossary: [
    gloss('friction', 'A force that slows or stops things when they rub together.', 's9-dusk'),
    gloss('trowel', 'A small garden spade you hold in one hand.', 's9-dusk'),
    gloss('lever', 'A bar that turns on a point, to help you lift or move things.', 's9-trowel'),
    gloss('motive', 'The reason someone does something.', 's9-trowel'),
    gloss('creature of habit', 'Someone who likes to do the same things in the same way, every day.', 's9-yours'),
    gloss('sundown', 'Sunset: the time when the sun goes down.', 's9-ask'),
    gloss('point of view', 'The way one person sees and thinks about something.', 's9-word'),
    gloss('hinge', 'A metal joint that lets a gate or door swing open and shut.', 's9-gate'),
    gloss('forgive', 'To stop being angry with someone for something they did.', 's9-gate'),
    gloss('symbol', 'A thing that stands for an idea, like a heart standing for love.', 's9-complete'),
  ],
  notes:
    'Lessons: friction (why lift-and-push works), hinges and levers, warming cold hands; motive, point of view, ' +
    'repetition, a saying, a symbol; asking permission and fair decisions; 10 × 2. Think question (s9-gate and ' +
    's9-gate-family): can you forgive someone but not trust them yet? The variant s9-gate-family is in ' +
    'EDU_SIDE_2_READER_VARIANTS with the same lessons. The gate scene stays even-handed, as in the main script. ' +
    'Scene-level set (s9Started) stays on the original s9-dusk. ' +
    'CANON. s9-dusk is Corvin’s first arrival after the Long Night (he tries the latch; it sticks). In s9-ask he says ' +
    'he will wait till first light and steps back into the lane, so the gate scenes find him there all night, with ' +
    'ordinary frost on his shoulders. Hazel’s stance is the same everywhere: she has done her part; it’s your gate now. ' +
    'S9_FAMILY_EXTRA is worded to hold for any two of the six family conditions.',
};

// ================================================================== S10 Fourteen Months
const S10_POSTS_START: Line[] = [
  N('At the stream lantern, she laughs at nothing at all. Then she explains that Briar would have.'),
  H('Briar’s. You can’t stand here and be gloomy. People have tried.', 'happy'),
  N('At the old wall, she says nothing. She puts her hand flat on the post, the way you’d touch a sleeping friend.'),
  H('Hush’s. For keeping. I kept a great deal here, one way and another.', 'soft'),
];
const S10_POST_ASK: Line[] = [
  N('…'),
  H('Can I ask you something? I’ve never asked anyone. There’s never been anyone to ask.', 'think'),
  H('Should I have gone after him? That night. Instead of wedging a gate and waiting.', 'soft'),
];
const S10_HOPING = H('I stopped hoping, after a while. I never stopped looking. They’re different things. Remember that.', 'soft');

/** Both lantern scenes: oral history after the old wall, the think question after the hoping line (index 7). */
const S10_LANTERN_LESSONS: LessonIn[] = [
  {
    domain: 'social-studies',
    skill: 'oral history: how stories carry the past',
    standard: 'D2.His.2.K-2',
    kind: 'notice',
    after: 3,
    lines: [
      N('Each post has a story. Gran learned them from people who learned them from people older still.'),
      N('The past, remembered in stories told out loud, is called oral history. It’s how the Grove remembers.'),
    ],
    parentNote: 'Learned that oral history keeps the past alive through stories told aloud.',
  },
  {
    domain: 'sel',
    skill: 'hope and patience (think question)',
    standard: 'CASEL: Self-awareness',
    kind: 'ask',
    after: 7,
    prompt: [H('Hoping and looking. I say they’re different. You tell me.'), N('Can you keep looking for something even after you’ve stopped hoping?')],
    options: [
      {
        label: 'Yes. Looking can be a way of loving.',
        reply: [H('That’s how it felt. Looking was just what I did, every night, because I loved them.', 'soft'), N('That’s a thoughtful answer.')],
      },
      {
        label: 'No. If you’re still looking, you must still hope a bit.',
        reply: [H('Maybe you’re right. Maybe a tiny bit of hope stayed, hiding under the looking.', 'think'), N('That’s a fair answer, and Gran likes it.')],
      },
      {
        label: 'I don’t know.',
        reply: [H('Neither did I, for twenty-two years. That’s allowed.', 'soft'), N('That’s an honest answer.')],
      },
    ],
    parentNote: 'Thought about the difference between hoping and keeping on (a think question with no wrong answer).',
  },
];

const s10PostChoices = (last: Line): Choice[] => [
  {
    id: 'waited',
    label: 'You were right to wait. He had to come back on his own.',
    set: { 's10-post': 'waited' },
    then: [
      H('Maybe. It’s a very comfortable answer. I’ve been suspicious of it for twenty-two years.', 'think'),
      H('But you can’t carry anyone back. I’ve tried, with Nubbins. They only ever walk.', 'soft'),
      last,
    ],
  },
  {
    id: 'gone',
    label: 'Somebody should have gone after him.',
    set: { 's10-post': 'gone' },
    then: [
      H('Yes. Some nights I think so too.', 'sad'),
      H('I’d have dragged him home by the ear. He’d have hated me properly, and the valley might never have gone grey.', 'think'),
      H('Or I’d have stood in that cold garden long enough to start liking the quiet. I don’t know. I never will.', 'soft'),
      last,
    ],
  },
];

const S10_FOOT_LINES: Line[] = [
  N('The foot of the hill path. The grass is long here. It’s the exact place she always stopped for breath.'),
  N('She looks back at the Grove once: the pond, the gate, the four posts.'),
  H('It looks like somebody lives here. It hasn’t looked like that for a long time.', 'soft'),
  N('You both know what this walk is. Gran is going up the hill to stay. Her life is ending, and she won’t come back down.'),
  H('Now, then. I can walk up on my own. I’d rather not.', 'soft'),
  H('Who’s coming?'),
];
const WALK_YOU: Choice = {
  id: 'walk-you',
  label: 'Just me, Gran.',
  set: { walk: 'you' },
  then: [H('Good. The quiet way. I like the quiet way.', 'soft')],
};
const WALK_MOSS: Choice = {
  id: 'walk-moss',
  label: 'Moss. He’s already decided.',
  set: { walk: 'moss' },
  then: [H('Him? Of course he has. He decided about me forty years ago and never once checked.', 'happy')],
};
const WALK_SABLE: Choice = {
  id: 'walk-sable',
  label: 'Sable.',
  set: { walk: 'sable' },
  then: [H('The grey one? …Yes. I’d like that very much.', 'soft')],
};
const WALK_CORVIN: Choice = {
  id: 'walk-corvin',
  label: 'Corvin. Let him carry the lantern.',
  set: { walk: 'corvin' },
  then: [H('Corvin. …Yes. He used to carry it for me. Somebody fetch him before he talks himself out of it.', 'soft')],
};

/** The foot of the hill, ids as in the main file: 's10-foot' plus '-' and m / s / c (Moss, Sable, Corvin can walk). */
const s10Foot = (moss: boolean, sable: boolean, corvin: boolean): EduScene => {
  const tag = (moss ? 'm' : '') + (sable ? 's' : '') + (corvin ? 'c' : '');
  if (!tag) {
    // Nobody else can walk, so there is no choice: a line (the sim sets walk = you from the main scene).
    return scene(
      's10-foot',
      [
        ...S10_FOOT_LINES.slice(0, -1),
        H('Just you, then. Good. The quiet way. I like the quiet way.', 'soft'),
      ],
      [
        {
          domain: 'sel',
          skill: 'knowing what kind of company you need',
          standard: 'CASEL: Self-awareness',
          kind: 'notice',
          after: 4,
          lines: [
            N('Gran knows what she needs: one quiet person, and no fuss.'),
            N('Knowing what kind of company helps you is a way of knowing yourself.'),
          ],
          parentNote:
            'Learned that knowing what kind of company helps you is part of knowing yourself.',
        },
      ],
    );
  }
  const choices: Choice[] = [WALK_YOU];
  if (moss) choices.push(WALK_MOSS);
  if (sable) choices.push(WALK_SABLE);
  if (corvin) choices.push(WALK_CORVIN);
  return scene(
    tag ? `s10-foot-${tag}` : 's10-foot',
    S10_FOOT_LINES,
    [
      {
        domain: 'sel',
        skill: 'asking for company in a hard moment',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 4,
        lines: [
          N('Gran could do this alone. But she’s asking for company.'),
          N('Asking someone to be with you when something is hard is brave. It’s never weak.'),
        ],
        parentNote: 'Learned that asking for company and help in hard moments is brave.',
      },
    ],
    choices,
  );
};
const S10_FOOT_VARIANTS: EduScene[] = [];
for (const m of [false, true])
  for (const s of [false, true])
    for (const c of [false, true]) if (!(m && s && c)) S10_FOOT_VARIANTS.push(s10Foot(m, s, c));

const S10_LETTER: Line[] = [
  N('Morning. Your Nubbins are up before you. The gate is stuck. You lift and push.'),
  N('Her lantern is back on the hook by the cottage door. Somebody carried it down at first light.'),
  N('You haven’t lit it yet.'),
  N('Gran Hazel died up on the hill in the night. Her body stopped working, and it won’t start again.'),
  N('On the signpost, under the stone, where the first one was: a letter in your grandmother’s writing.'),
  H('“If you’re reading this, I’ve gone up the hill, and this time I’m staying. Don’t be dramatic about it.”', 'soft'),
  H('“Be a little dramatic. I’ve earned a little.”', 'happy'),
  H('“You kept my three rules, more or less, which is more than I did. Here’s a fourth, because I can’t help myself.”'),
  H('“Show up. Every morning, same stuck gate, same stubborn chin. That’s all a Grove ever was. The rest is fruit.”', 'soft'),
  H('“Tell Fern to prune the trees. Tell Sparks the hair grows back. Tell Byte his shoelaces are untied.”', 'happy'),
  H('“Leave fruit at the edge for the ones in the long grass. You won’t always see who eats it. Leave it anyway.”', 'soft'),
  H('“If he came to the gate, you’ll have decided about Corvin by now. Whatever you decided, I’d have done it worse.”', 'think'),
  H('“I’m not sorry. I’m sorry it’s now. Both are true. You knew that already.”', 'soft'),
  H('“Love, Gran. P.S. The gate sticks. You know the rest.”', 'happy'),
];
/** Both letter scenes: grief after the plain words (line 3), letter form after the sign-off (line 13). */
const S10_LETTER_LESSONS: LessonIn[] = [
  {
    domain: 'sel',
    skill: 'grief: what it is and what helps',
    standard: 'CASEL: Self-awareness',
    kind: 'notice',
    after: 3,
    lines: [
      N('The big, heavy sadness you feel when someone you love dies is called grief.'),
      N('Grief can come in waves: all right one minute, very sad the next. That’s normal.'),
      N('What helps is people, and remembering. Gran made sure you’d have both.'),
    ],
    parentNote: 'Learned the word grief, that it comes in waves, and that people and remembering help.',
  },
];

const S10_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: the secret, and wish one
  scene(
    's10-step',
    [
      N('Dusk, on her first evening home. Hazel sits on the cottage step with her boots off and her feet in a bowl of warm water.'),
      N('She is very pleased about the water. She has a blanket round her shoulders, though the evening is mild.'),
      H('Sit. Not there. There. I like to see the pond.'),
      N('Gran Hazel is very poorly. The doctors can’t make her better. She knows, and now she’s going to tell you.'),
      H('A year, the doctor said. I’ve had fourteen months. I’m going to make him buy me a cake.', 'happy'),
      N('She says it the way she’d talk about the weather. Then she watches to see how you take it.'),
      H('Don’t be brave at me. I’ve been brave at myself for fourteen months. It’s exhausting.', 'think'),
      H('I want three things before I go up the hill. Small ones. I’ve written them down, so don’t argue.'),
      N('In the Grove, people say “going up the hill” for dying. Gran means she will die soon.'),
      N('A seed packet, from her apron pocket. Three lines on the back, in pencil. The third has a little drawing.'),
      H('But first, a favour. Don’t tell them. The valley. Sparks, Fern, any of them.', 'think'),
      H('I want them to come round and argue about races and the weather. I don’t want a week of goodbyes.'),
      H('So. Will you keep it? It’s a big thing to ask. I’m asking anyway.', 'soft'),
    ],
    [
      {
        domain: 'maths',
        skill: 'months in a year, and finding a difference',
        standard: '1.OA.A.1',
        kind: 'ask',
        after: 4,
        prompt: [N('The doctor said a year. A year is twelve months. Gran has had fourteen.'), N('How many extra months has she had?')],
        options: [
          { label: '2', best: true, reply: [H('Two. Two whole bonus months, love. I spent them well.', 'happy')] },
          { label: '26', reply: [N('That’s 14 + 12, adding. We want the difference: 14 − 12 = 2 extra months.')] },
          { label: '12', reply: [N('Twelve is what the doctor said. She’s had 14, so 14 − 12 = 2 extra months.')] },
        ],
        parentNote: 'Learned there are 12 months in a year and found a difference (14 − 12 = 2).',
      },
      {
        domain: 'sel',
        skill: 'sad feelings are allowed, and sharing them helps',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 6,
        lines: [
          N('Gran doesn’t want you to pretend to be fine. Sad, scared and cross are all allowed.'),
          N('Feelings you share are lighter to carry. You can tell her how you feel.'),
        ],
        parentNote: 'Learned that it’s all right to show sad feelings, and that sharing them helps.',
      },
    ],
    [
      {
        id: 'secret',
        label: 'I’ll keep it. They’ll hear it from you, or not at all.',
        set: { hazel: 'secret' },
        then: [
          H('Good. Thank you.', 'soft'),
          H('I’ll leave them something. I’m good at letters. You may have noticed.', 'happy'),
          N('She wiggles her toes in the water, and that, it seems, is the end of that.'),
          N('Over the hedge, Sparks waves and shouts something about Saturday’s race. You wave back. It feels very heavy.'),
          H('Number one. Write yours in my register. All of them. I want them in the book before I go.'),
        ],
      },
      {
        id: 'told',
        label: 'They love you. They should get to say goodbye.',
        set: { hazel: 'told' },
        then: [
          H('…They’ll be dreadful about it. Clover will cry on me. Sparks will try to fix it.', 'think'),
          H('Byte will bring a graph.'),
          H('Fine. Tell them. Tell them to be normal about it. When they aren’t, tell them again.', 'soft'),
          H('Number one. Write yours in my register. All of them. I want them in the book before I go.'),
        ],
      },
    ],
  ),
  scene(
    's10-register',
    [
      N('Hazel reads your pages slowly, a finger under each line, the way she reads seed catalogues.'),
      H('Oh, that’s a terrible name. I love it.', 'happy'),
      H('“Hatched in a hurry”? They all hatch in a hurry, love. Write the weather. You’ll want the weather, later.'),
      N('Under your last line she takes the pencil and writes one more, small and firm.'),
      N('“Keeper from this page on,” it says, and then your name.'),
      H('There. Now it’s in the book. Things in the book stay.', 'soft'),
    ],
    [
      {
        domain: 'maths',
        skill: 'fill in a row of a data table',
        kind: 'do',
        after: 2,
        lines: [
          H('A register is a table. Each row is one egg. Each column is one kind of fact.'),
          H('Number, name, first sound, weather. Fill in a row for your newest Nubbin. Every box, mind.'),
        ],
        check: 'edu:fill:register-row',
        parentNote: 'Filled in a row of a data table, with a column for each kind of information.',
      },
      {
        domain: 'social-studies',
        skill: 'written records tell the future about the past',
        standard: 'D2.His.2.K-2',
        kind: 'notice',
        after: 5,
        lines: [
          H('People have always written things down so they aren’t forgotten. Farm books, letters, diaries.'),
          H('Long after we’re gone, somebody reads them and knows how we lived. Even the weather.', 'soft'),
        ],
        parentNote: 'Learned that written records let people in the future learn about life in the past.',
      },
    ],
  ),
  // ------------------------------------------------ step 2: one race
  scene(
    's10-wish2',
    [
      H('Number two. One race. I want to sit in the stands with a terrible pie, like a normal person.', 'happy'),
      H('Forty years, and I never once sat at the back. I was always in the gap, or down at the rail, being a nuisance.'),
      SP('Hazel’s coming to a race? HAZEL’S coming to a RACE?', 'shock'),
      N('Sparks has appeared from nowhere, as she does, holding a flag. Nobody knows where she got the flag.'),
      SP('I’m saving you a seat. Front row. I’ll fight Ember for it. I’ll lose, but I’ll fight her.', 'happy'),
      H('Sparks, love. I want to sit at the back.'),
      SP('…Back row. I’ll fight Ember for the back row.'),
      H('Bring whichever one wants to go. Fast or slow. I don’t mind about winning. I never did, whatever they tell you.', 'soft'),
      SP('She minded. She once threw a hat at a finish line.', 'think'),
      H('It was a very small hat.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'compare what a character says with what she does',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 9,
        prompt: [
          N('Hazel says she never minded about winning. Sparks says she once threw a hat at a finish line.'),
          N('What does the hat tell you about Hazel?'),
        ],
        options: [
          {
            label: 'She cared about winning more than she says.',
            best: true,
            reply: [N('Yes! What a character does can tell you more than what she says. Hazel minded. A lot. Small hat or not.')],
          },
          {
            label: 'She didn’t like the hat.',
            reply: [N('Ha, maybe! But you throw a hat at a finish line when you really, really want to win. Hazel minded more than she says.')],
          },
          {
            label: 'She never minded at all.',
            reply: [N('That’s what Hazel says. But actions are clues. Throwing a hat shows she minded, at least back then.')],
          },
        ],
        parentNote: 'Compared what a character says with what she does, to understand her better.',
      },
    ],
    [
      {
        id: 'fast',
        label: 'Bring the fast one. Give her something to shout about.',
        set: { 's10-racer': 'fast' },
        then: [H('Oh, you’re cruel. I’ll have no voice left by the second bend. Good.', 'happy')],
      },
      {
        id: 'slow',
        label: 'Bring the slow one. The one who stops to look at things.',
        set: { 's10-racer': 'slow' },
        then: [
          H('The dawdler? Oh, good. We’ll be there all afternoon. I’ll get a second pie.', 'happy'),
          SP('Back row’s got the best view of last place. I’ve always said so. I’ve never said so.'),
        ],
      },
    ],
  ),
  scene(
    's10-cheer',
    [
      N('The usual roar from the stands. Under it, from the back row, one voice carries over all the others.'),
      N('Sparks, beside her, shouted herself hoarse on the first lap and has been cheering in mime ever since.'),
      N('Win or lose, when you come off the course, Hazel is on her feet, holding half a pie, beaming.'),
      SP('Two pies, four Shells each, and I’ve only got a ten-Shell coin. How much change?', 'soft'),
      H('I’ve had two. Worth every Shell.', 'happy'),
      H('That one runs for you. Don’t ever spend that.', 'soft'),
      H('You can spend Shells. You can spend time. You can spend a perfectly good pie, and I have. Never that.', 'happy'),
      N('She sits down again rather suddenly, and stays sitting while the stands empty. Nobody hurries her.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'a two-step money problem with Shells',
        standard: '3.OA.D.8',
        kind: 'ask',
        after: 3,
        prompt: [N('Sparks paid for Hazel’s two pies with a 10-Shell coin.'), N('How many Shells did she get back?')],
        options: [
          { label: '2', best: true, reply: [N('Yes. Two pies at 4 Shells is 8 Shells. 10 − 8 = 2 Shells change.')] },
          { label: '6', reply: [N('That would be one pie: 10 − 4 = 6. But she had two: 4 + 4 = 8, and 10 − 8 = 2.')] },
          { label: '8', reply: [N('8 Shells is what the pies cost. Her change is 10 − 8 = 2 Shells.')] },
        ],
        parentNote: 'Solved a two-step money problem with Shells (2 × 4 = 8, then 10 − 8 = 2).',
      },
      {
        domain: 'literacy',
        skill: 'recognise a metaphor',
        standard: 'L.4.5',
        kind: 'notice',
        after: 6,
        lines: [
          N('Hazel talks about your Nubbin’s trust as if it were money: something you could spend, and must never spend.'),
          N('Talking about one thing as if it were another is called a metaphor.'),
        ],
        parentNote: 'Recognised a metaphor (trust described as something you could spend).',
      },
    ],
  ),
  // ------------------------------------------------ step 3: the four lanterns
  scene(
    's10-wish3',
    [
      N('Dusk. The last line on the seed packet has the drawing: four little posts in a row, and two stick figures.'),
      H('Number three. Walk the four lanterns with me. Once. Slowly. I’ll be slow whether you like it or not.', 'happy'),
      N('She takes your arm at the pond lantern. Not leaning. Holding.'),
      H('Moss’s post. I’ll tell you something about it, and then you’re not to make a fuss.', 'soft'),
      H('I came here young. I didn’t know one end of a Nubbin from the other, and I was too proud to ask.'),
      N('For a moment the pond is younger, and so is the light. There is snow on the bank.'),
      N('A young woman sits by the frozen pond in a coat too big for her, with a bucket of feed she doesn’t know how to give.'),
      YH('I don’t know what I’m doing. I don’t know what any of this is for.', 'sad'),
      N('A small, old, green-grey thing sits down a little way off. It doesn’t come closer. It doesn’t go away.'),
      N('It sits there the next day, and the next. All that winter it sits beside her, and says nothing at all.'),
      N('At the first thaw she looks down, and it is looking up at her.'),
      M('…You’ll do.', 'soft'),
      N('The light goes back to being now.'),
      H('Rule three. I thought I’d made it up. I’d been on the end of it for a whole winter.', 'soft'),
    ],
    [
      {
        domain: 'science',
        skill: 'ice floats, so ponds freeze from the top',
        standard: '2-ESS2-3',
        kind: 'notice',
        after: 6,
        lines: [
          N('Look at the frozen pond. Ice floats on water, so a pond freezes from the top down.'),
          N('Under the ice, the water stays liquid. Fish wait out the winter down there, slow and safe.'),
        ],
        parentNote: 'Learned that ice floats, so ponds freeze from the top and fish survive in the water below.',
      },
      {
        domain: 'literacy',
        skill: 'what a flashback is',
        standard: 'RL.3.3',
        kind: 'notice',
        after: 12,
        lines: [
          N('That was a flashback: a jump back in time, to show something from the past.'),
          N('Writers use flashbacks to show why a character is the way she is. Now you know where rule three came from.'),
        ],
        parentNote: 'Learned what a flashback is and why writers use them.',
      },
    ],
  ),
  scene(
    's10-lanterns',
    [
      ...S10_POSTS_START,
      N('Then the long grass. The fourth post is lit. It has burned steady since the Long Night, all on its own.'),
      N('Hazel stops. She looks at it for a long time.'),
      H('Twenty-two years I came out every night and looked at this post. Flicker, flicker.', 'soft'),
      S10_HOPING,
      ...S10_POST_ASK,
    ],
    S10_LANTERN_LESSONS,
    s10PostChoices(H('That was the one I wanted. Thank you, love.', 'soft')),
  ),
  // ------------------------------------------------ step 4: the walk
  scene(
    's10-night',
    [
      N('You walk her home. At the cottage door she stops, with one hand on the frame.'),
      H('Tomorrow they’ll all come. You’ll tell them what the Grove is going to be. I want to hear you say it.'),
      H('After that, nobody fuss. I mean it.', 'soft'),
      H('They still think I’m here for the holidays. Let them. It’s been lovely, being ordinary.', 'happy'),
      N('She goes in. Through the window you see her sit on the edge of the bed for a long time before she lies down.'),
      N('You stand in the dark garden, holding the secret. It is the heaviest thing you have ever carried.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'surprises and heavy secrets; telling a trusted grown-up',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 5,
        lines: [
          N('Some secrets are happy, like a surprise party. Some are heavy, and make your tummy hurt.'),
          N('If a secret ever feels too heavy, it is always all right to tell a grown-up you trust. That’s asking for help.'),
        ],
        parentNote: 'Learned the difference between happy surprises and heavy secrets, and that telling a trusted grown-up is always all right.',
      },
    ],
  ),
  s10Foot(true, true, true),
  // ------------------------------------------------ complete
  scene(
    's10-letter',
    [
      ...S10_LETTER,
      N('Behind you, someone lifts and pushes the gate: Fern, with a basket. Then Sparks. Then everyone, one by one.'),
      N('They have come to see why you are standing so still. You hold the letter out. You don’t have to say anything.'),
    ],
    S10_LETTER_LESSONS,
  ),
];

const S10: EduQuest = {
  id: 'reader:s10',
  of: 's10',
  band: 'reader',
  title: 'Fourteen Months',
  goals: {
    's10-step1': {
      goal: 'Wish one: write your Nubbins into Hazel’s hatch register.',
      hint: 'The register is on the cottage bookshelf. Add a row for every Nubbin you’ve hatched: number, name, first sound, weather.',
    },
    's10-step2': {
      goal: 'Wish two: enter any race while Hazel watches from the back row.',
      hint: 'Open Races from the top bar. Any course, any level. Winning doesn’t matter.',
    },
    's10-step3': {
      goal: 'Wish three: walk Hazel to the other three lanterns: the stream, the old wall and the long grass.',
      hint: 'Keep to her pace. She stops at each post. Stop with her.',
    },
    's10-step4': {
      goal: 'Tell Hazel what the Grove will be. Then walk with her to the foot of the hill.',
      hint: 'After the final choice in chapter 12, follow Hazel across the Grove to the hill path.',
    },
  },
  scenes: S10_SCENES,
  glossary: [
    gloss('poorly', 'Ill; not well.', 's10-step'),
    gloss('exhausting', 'Making you feel very, very tired.', 's10-step'),
    gloss('register', 'A book or list where things are written down, to keep a record.', 's10-register'),
    gloss('column', 'A line of boxes going down a table, all for the same kind of fact.', 's10-register'),
    gloss('nuisance', 'Someone or something that annoys people.', 's10-wish2'),
    gloss('hoarse', 'Having a rough, croaky voice from shouting or a sore throat.', 's10-cheer'),
    gloss('metaphor', 'Describing something by talking about it as if it were something else.', 's10-cheer'),
    gloss('flashback', 'A part of a story that jumps back to the past.', 's10-wish3'),
    gloss('thaw', 'When ice and snow melt because the weather is warming up.', 's10-wish3'),
    gloss('gloomy', 'Sad, and without much hope.', 's10-lanterns'),
    gloss('oral history', 'The past as people remember it and tell it out loud.', 's10-lanterns'),
    gloss('ordinary', 'Normal and everyday; nothing special.', 's10-night'),
    gloss('handkerchief', 'A square of cloth for wiping your nose or eyes.', 's10-night-told'),
    gloss('grief', 'The deep sadness you feel when someone you love dies.', 's10-letter'),
    gloss('P.S.', 'Short for postscript: a note added at the end of a letter, after the name.', 's10-letter'),
  ],
  notes:
    'HARD THINGS. Hazel is “very poorly; the doctors can’t make her better”; no illness is named. “Going up the hill” is ' +
    'explained once as dying (s10-step), again at the foot of the hill, and the letter says plainly that she died, ' +
    'then gives the comfort: people, and remembering. Lessons: 14 − 12, the register as a data table, written records, ' +
    'a two-step Shells problem, saying vs doing, metaphor, flashback, ice floating, oral history; grief, heavy secrets ' +
    '(tell a trusted grown-up), asking for company, comfort by staying close. Think question (s10-lanterns and ' +
    's10-lanterns-kept): can you keep looking after you stop hoping? Variants are in EDU_SIDE_2_READER_VARIANTS. ' +
    'TIMING (as in the source): s10-night / s10-night-told play on the eve of chapter 12, after c11-close. ' +
    'CANON. s10-wish3 agrees with S1: a young woman in a coat too big for her, a whole winter of silence, then “You’ll do.” ' +
    'LINE VARIANT (letThemGo, as in the source). With “Open” there is no gate: the letter’s first line becomes “Morning. ' +
    'Your Nubbins are up before you. There is no gate to stick. You lift and push at the air anyway.”, and in ' +
    's10-letter-told “at the gate” becomes “at the gateposts”.',
};

// ================================================================== variant scenes
/**
 * Branch scenes. Each replaces the named scene under the same condition as in SIDE_STORIES_MAIN_VARIANTS
 * and SIDE_STORIES_FUN_2_VARIANTS.
 */
export const EDU_SIDE_2_READER_VARIANTS: EduScene[] = [
  // ---------------------------------------------------------------- S8: replaces s8-complete if c10-bramble played
  scene(
    's8-complete-dawn',
    [
      N('Hazel sits on the bench by the pond, the thin grey Nubbin asleep in the crook of her arm.'),
      N('Fern is beside her. By the look of the teacups, she has been there all morning.'),
      H('Fern’s told me. Twice. The second time with a great deal more crying.', 'happy'),
      ...S8_TAIL,
    ],
    s8TailLessons(3),
  ),
  // ---------------------------------------------------------------- S9: replaces s9-gate
  scene('s9-gate-family', [...S9_GATE_OPEN, ...S9_FAMILY_EXTRA, ...S9_GATE_CLOSE], s9GateLessons(9), [S9_FAMILY, S9_GUEST, S9_SHUT]),
  // ---------------------------------------------------------------- S10: replaces s10-lanterns
  scene(
    's10-lanterns-kept',
    [
      ...S10_POSTS_START,
      N('Then the long grass. The fourth post flickers, the way it has for twenty-two years.'),
      N('Hazel stops. She looks at it, and then at you, for a long time.'),
      H('Still flickering. Well.', 'soft'),
      S10_HOPING,
      ...S10_POST_ASK,
    ],
    S10_LANTERN_LESSONS,
    s10PostChoices(H('Thank you for walking it with me. I mean that. Whatever else.', 'soft')),
  ),
  // ---------------------------------------------------------------- S10: replaces s10-wish3 (s1Done)
  scene(
    's10-wish3-s1',
    [
      N(
        'Dusk. The last line on the seed packet has the drawing: four little posts in a row, and two stick figures.',
      ),
      H(
        'Number three. Walk the four lanterns with me. Once. Slowly. I’ll be slow whether you like it or not.',
        'happy',
      ),
      N('She takes your arm at the pond lantern. Not leaning. Holding.'),
      H(
        'Moss’s post. I’ll tell you something about it, and then you’re not to make a fuss.',
        'soft',
      ),
      H('He’ll have told you about the winter. He’ll have left out the fidgeting.', 'happy'),
      H(
        'I counted the hens. I unpicked my mittens. I never once asked him to say a word. It nearly killed me.',
      ),
      H(
        'Then at the thaw he looked up and said “You’ll do”. I was so startled I sat down in the snow.',
        'happy',
      ),
      H(
        'Rule three. I thought I’d made it up. I’d been on the end of it for a whole winter.',
        'soft',
      ),
    ],
    [
      {
        domain: 'sel',
        skill: 'being honest about your own impatience',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 5,
        lines: [
          N(
            'Gran says waiting nearly killed her. She doesn’t mean it. It’s a joke, and it’s also true: waiting is hard.',
          ),
          N(
            'Being honest about how hard something feels is the first step to getting better at it.',
          ),
        ],
        parentNote:
          'Learned that being honest about how hard waiting feels is a first step to getting better at it.',
      },
    ],
  ),
  // ---------------------------------------------------------------- S10: replaces s10-night
  scene(
    's10-night-told',
    [
      N('You walk her home. The Keepers have stayed late by the pond. None of them wants to be the first to go.'),
      N('Hazel sends them home one at a time, like a teacher at the end of a very long day.'),
      H('Look at them. Lumps. Every one of them.', 'happy'),
      H('Tomorrow you’ll tell them what the Grove is going to be.'),
      H('They can walk me to the bottom. Not one step further. Tell them. They listen to you.', 'soft'),
      N('She goes in. Down the lane, somebody is crying very quietly, and somebody else is passing them a handkerchief.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'comforting someone by staying close',
        standard: 'CASEL: Social awareness',
        kind: 'notice',
        after: 5,
        lines: [
          N('Nobody could make Gran better. So the Keepers did what they could: they stayed close.'),
          N('When someone is sad, being near them, and passing a handkerchief, is a real way to help.'),
        ],
        parentNote: 'Learned that staying close is a real way to comfort someone who is sad.',
      },
    ],
  ),
  // ---------------------------------------------------------------- S10: replace s10-foot-msc
  ...S10_FOOT_VARIANTS,
  // ---------------------------------------------------------------- S10: replaces s10-letter
  scene(
    's10-letter-told',
    [
      ...S10_LETTER,
      N('The Keepers are already at the gate. By the look of them, none of them slept much.'),
      N('You read it out to them, all of it. Clover cries. Byte checks his shoelaces.'),
      N('They are untied.'),
    ],
    S10_LETTER_LESSONS,
  ),
];

// ================================================================== exports
export const EDU_SIDE_2_READER: EduQuest[] = [S6, S7, S8, S9, S10];

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  // S6
  'edu:hum:throat-buzz',
  'edu:hum:tune:low-high-question',
  // S7
  'edu:order:moth-life-cycle',
  // S8
  'edu:share:fruit:12-into-3',
  // S10
  'edu:fill:register-row',
];
