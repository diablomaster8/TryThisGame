/**
 * The Learning Grove, reader band (ages 7–10): the Japanese questline “Hana’s Hiragana”
 * (LJ1–LJ6, lang-japanese.ts).
 *
 *   LJ1 greetings and bowing; friendly and polite forms (think: why polite forms?); は read “wa”;
 *       day and night; the Bowing Song
 *   LJ2 reading and tracing あいうえお, かきくけこ, は, な; stroke order; the three scripts (think:
 *       what changes when a word moves language?); writing はな, the teacher’s name
 *   LJ3 counting to じゅう; how fish breathe; 一 二 三; equal groups; losing well (think); moonlight;
 *       the Koi Chant
 *   LJ4 colour words and katakana; quarters of a lunch box; mealtime words (think); mixing paint;
 *       strawberry seeds
 *   LJ5 letters then and now; family and animal words; obāchan vs obachan; nocturnal owls;
 *       feelings words (think: hiding fear); the frog life cycle
 *   LJ6 Obon, and Hana’s family’s tōrō nagashi for her ojiichan (think: how do we remember
 *       people?); picture-kanji; floating and sinking; snow and water; counting at the party
 *       afterwards; またね vs さようなら (think). The lanterns are never a game, a count or a reward.
 *
 * One EduScene per original scene (42). Every choice keeps its original id; reader keeps every
 * choice. Japanese words are the vetted list only, written in kana first with romanisation, and
 * the meaning on first use. Politeness notes are limited to the brief’s own notes. British spelling.
 * See EDU-STYLE.md and the languages brief.
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
const NO = say('nova');
const FE = say('fern');
const MA = say('marina');
const SP = say('sparks');
const CL = say('clover');
const PX = say('pixel');
const LU = say('luna');
const BY = say('byte');
const DU = say('dusty');
const EM = say('ember');
const HA = say('hana');

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

// ================================================================== LJ1 Konnichiwa, Hana!
const LJ1_SCENES: EduScene[] = [
  scene(
    'lj1-s1',
    [
      N('The gate sticks, like always. Someone on the other side lifts and pushes, hard. It bangs open.'),
      N('A girl in running shoes skids through first, a sketchbook under her arm. Nova follows, carrying both bags.'),
      NO('This is Hana. She’s staying with me for the summer. She raced me from the bridge.', 'happy'),
      HA('I won by eleven seconds. Nova says nine. Nova is wrong.'),
      HA('こんにちは (konnichiwa, “hello”)!'),
      N('She bows: a small, quick dip from the waist, then straight back up.'),
      HA('That’s おじぎ (ojigi), bowing. At home we bow to say hello, thank you and sorry.'),
      HA('はじめまして (hajimemashite) means “nice to meet you”. You only say it the first time you meet someone.'),
      HA('わたしは はな です (watashi wa Hana desu) means “I am Hana”. Your own name goes in the middle, like a sandwich.'),
      HA('Then finish with よろしくおねがいします (yoroshiku onegaishimasu): “please treat me kindly”, or “pleased to meet you”.'),
      NO('I practised that all the way here. On the ticket man, a cow and a postbox.', 'happy'),
      HA('Ready? Say はい (hai, “yes”). It’s the only answer today, so you can’t get it wrong.', 'happy'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'a word with two meanings: こんにちは',
        standard: 'L.3.4',
        kind: 'ask',
        after: 4,
        prompt: [N('Hana said こんにちは (konnichiwa) as she came through the gate. What do you think it means?')],
        options: [
          {
            label: 'Hello',
            best: true,
            reply: [HA('はい! Hello. It can also mean “good afternoon”. One word, two jobs.', 'happy')],
          },
          {
            label: 'Goodbye',
            reply: [HA('No, goodbye is a different word. I only just got here! こんにちは means “hello”, or “good afternoon”.')],
          },
          {
            label: 'Thank you',
            reply: [HA('Not that one. Thank you is tomorrow’s word. こんにちは means “hello”, or “good afternoon”.')],
          },
        ],
        parentNote: 'Worked out that こんにちは (konnichiwa) means “hello” and also “good afternoon”.',
      },
      {
        domain: 'social-studies',
        skill: 'bowing (おじぎ) as a greeting in Japan',
        kind: 'notice',
        after: 6,
        lines: [
          HA('A small bow is friendly. A deeper bow shows more respect.'),
          HA('So you bow a little to a friend, and lower to say a big thank you, or a big sorry.'),
        ],
        parentNote: 'Learned that in Japan people bow (おじぎ, ojigi) to greet, thank and apologise, and that a deeper bow shows more respect.',
      },
    ],
    [
      {
        id: 'bow',
        label: 'Bow and say “konnichiwa”.',
        then: [
          N('You bow. Hana bows back, a little deeper. She seems to think that means she won.'),
          HA('はい! Perfect. You meant that one.', 'happy'),
        ],
      },
      {
        id: 'wave',
        label: 'Wave and say “konnichiwa”.',
        then: [HA('A wave works too. Friends wave all the time. Next time, add a tiny bow. Like this. Easy.', 'happy')],
      },
      {
        id: 'full',
        label: 'Try the lot: “Hajimemashite. Watashi wa… desu. Yoroshiku onegaishimasu.”',
        then: [
          HA('You did the whole sandwich! It took Nova three days to get that right.', 'shock'),
          NO('Two days.'),
          HA('No. Three.', 'happy'),
        ],
      },
    ],
  ),
  scene(
    'lj1-s1-done',
    [
      N('Hana is already drawing you. She drew Nova, the gate and a passing bee while you said hello.'),
      HA('Done! Your nose is very good. Your ears are a bit much. That’s my fault, not yours.'),
      N('Behind the water butt, three wild Nubbins have watched everything.'),
      N('One of them tries a bow. It tips forward and rolls into the herbs.'),
      HA('They want to learn! Tomorrow we teach them. Properly.', 'happy'),
      HA('Also, is that a frog?', 'think'),
      NO('Are you scared of frogs, Hana?'),
      HA('いいえ (iie, “no”)! Not even slightly. I’m just saying. In case it comes up.', 'think'),
    ],
    [
      {
        domain: 'sel',
        skill: 'greeting someone new kindly',
        standard: 'CASEL: Relationship skills',
        kind: 'do',
        after: 3,
        check: 'edu:bow:konnichiwa',
        lines: [HA('Show the Nubbins how. Say こんにちは and do a little bow. Nubbins learn by copying.')],
        parentNote: 'Greeted a shy Nubbin with こんにちは and a bow, practising a kind, calm hello.',
      },
    ],
  ),
  scene(
    'lj1-s2',
    [
      N('Morning. Dew on everything. Hana was up before you, and she mentions it twice.'),
      HA('おはよう (ohayō, “good morning”)! That’s for friends and family.', 'happy'),
      N('Fern climbs over the fence with a bucket of plums and a sleepy face.'),
      HA('おはようございます (ohayō gozaimasu), Fern! That’s the polite one, for grown-ups and teachers.'),
      FE('Good morning to you too. I’ve been up since five, keeping the trees alive, badly.'),
      HA('ありがとうございます (arigatō gozaimasu)! That’s a polite thank you. With friends, it’s just ありがとう (arigatō).'),
      HA('Right. When I say こんにちは, the Nubbins bow. Three Nubbins, three bows. That’s the plan.'),
      N('She sprints at the herb bed and bumps a small round Nubbin right off its feet.'),
      HA('ごめんなさい (gomen nasai, “I’m sorry”)! Sorry, sorry!', 'shock'),
      N('She bows low to the Nubbin, because she means it. It copies her, and lands on its face.'),
      FE('That one’s Dumpling. He eats things. Bows aren’t food, Dumpling.'),
      HA('But that was a good おじぎ. Very sincere.', 'happy'),
      HA('すみません (sumimasen, “excuse me”), everybody! Come a bit closer? That’s how you ask nicely.'),
      HA('Who shall we start with?'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'friendly and polite forms of a greeting',
        kind: 'notice',
        after: 3,
        lines: [
          HA('Japanese has friendly words for family and friends, and polite words for grown-ups and people you don’t know well.'),
          HA('おはよう is friendly. おはようございます is polite. The polite one is longer. It usually is.'),
        ],
        parentNote: 'Learned the friendly おはよう (ohayō) and the polite おはようございます (ohayō gozaimasu), and when to use each.',
      },
      {
        domain: 'social-studies',
        skill: 'why languages have polite forms (think question)',
        standard: 'D2.Civ.8.K-2',
        kind: 'ask',
        after: 12,
        prompt: [
          N('Hana uses short words with friends and longer, polite words with grown-ups.'),
          N('Why do you think some languages have different polite forms?'),
        ],
        options: [
          {
            label: 'To show respect.',
            reply: [N('That’s a good answer. A polite form is a way of showing respect with words, a bit like a deeper bow.')],
          },
          {
            label: 'So people know how well you know each other.',
            reply: [N('That’s a thoughtful answer. The words you choose can show whether someone is a close friend or someone new.')],
          },
          {
            label: 'English does it too, a bit.',
            reply: [N('Sharp thinking! English has “hi” and “good morning”, “thanks” and “thank you very much”. Many languages do this in their own way.')],
          },
        ],
        parentNote: 'Thought about why languages have polite and friendly ways of saying the same thing.',
      },
    ],
    [
      {
        id: 'shy',
        label: 'The shy one under the bench.',
        then: [
          N('You crouch and say こんにちは, very softly. The shy one peeks out and dips its head, just a tiny bit.'),
          HA('That counts. Small bows count.', 'soft'),
        ],
      },
      {
        id: 'bouncy',
        label: 'The bouncy one on the wall.',
        then: [
          N('You say こんにちは. The bouncy one bows so hard it bounces off the wall and has to start again.'),
          HA('Enthusiastic. I respect it.', 'happy'),
        ],
      },
      {
        id: 'sleepy',
        label: 'The sleepy one in the sun.',
        then: [
          N('You say こんにちは. The sleepy one bows very slowly, and doesn’t come back up for a while.'),
          HA('Is it still bowing? Or asleep?', 'think'),
          FE('Bit of both.'),
        ],
      },
    ],
  ),
  scene(
    'lj1-s2-done',
    [
      N('Three Nubbins in a row. You say こんにちは. Three small bows, nearly together.'),
      HA('That was beautiful! I’m drawing it.', 'happy'),
      N('Then a fourth bow, from the end of the row: Dumpling, late, copying the others.'),
      N('He is facing the wrong way.'),
      HA('Other way, Dumpling.'),
      N('He turns round, bows again, bumps into the water butt, and looks extremely pleased with himself.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'saying thank you',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 1,
        prompt: [N('The three Nubbins worked hard. Hana wants to thank them. Which word should she use?')],
        options: [
          {
            label: 'ありがとう (arigatō)',
            best: true,
            reply: [HA('はい! ありがとう, everyone! Thanking people for trying is the best bit.', 'happy')],
          },
          {
            label: 'ごめんなさい (gomen nasai)',
            reply: [HA('That one is for saying sorry. To say thank you, it’s ありがとう.')],
          },
          {
            label: 'おはよう (ohayō)',
            reply: [HA('That’s “good morning”. For thank you, it’s ありがとう.')],
          },
        ],
        parentNote: 'Chose ありがとう (arigatō) to thank the Nubbins for trying, and practised saying thank you for effort.',
      },
    ],
  ),
  scene(
    'lj1-s3',
    [
      N('Evening. The light goes gold, then orange, then the colour of weak tea.'),
      N('Luna comes up the path with a trowel and a jar of moths, on her way to the night garden.'),
      HA('こんばんは (konbanwa, “good evening”), Luna!'),
      LU('Konbanwa. Did I say it right? Nova taught me last summer. I’ve been saving it.', 'soft'),
      HA('Perfect!'),
      FE('I’m off to bed. Goodbye, all.'),
      HA('Not さようなら (sayōnara)! That’s goodbye for a while. You’ll see us in the morning.'),
      HA('Say またね (mata ne, “see you”). Or at bedtime, おやすみ (oyasumi, “good night”).'),
      FE('Mata ne, then. Oyasumi.', 'happy'),
      HA('For grown-ups you want to be extra nice to, it’s おやすみなさい (oyasuminasai). The polite one.'),
      HA('Now you. Everyone gets an oyasumi before bed. Nubbins, Nova, Dumpling, me. That’s the rule.'),
      N('Dumpling is already asleep, standing up, in the herb bed.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'when は is read “wa”',
        kind: 'notice',
        after: 4,
        lines: [
          HA('Look at the last letter of こんばんは and こんにちは. It’s は. On its own, は says “ha”.'),
          HA('But at the end of these two greetings, it says “wa”. Japanese likes to keep you on your toes.'),
        ],
        parentNote: 'Noticed that the last letter of こんにちは and こんばんは is は, read “wa” here, not “ha”.',
      },
      {
        domain: 'literacy',
        skill: 'choosing the right goodbye',
        standard: 'SL.K.1',
        kind: 'ask',
        after: 8,
        prompt: [N('Fern will be back over the fence tomorrow morning. Which goodbye fits best tonight?')],
        options: [
          {
            label: 'さようなら (sayōnara)',
            reply: [HA('That one’s for a goodbye that lasts a while. Fern will be back tomorrow, so おやすみ or またね is better.')],
          },
          {
            label: 'おやすみ (oyasumi)',
            best: true,
            reply: [HA('はい! She’s going to bed, so おやすみ. And またね works too: see you.', 'happy')],
          },
          {
            label: 'こんにちは (konnichiwa)',
            reply: [HA('That’s hello! Fern’s leaving. At bedtime, say おやすみ.')],
          },
        ],
        parentNote: 'Chose between さようなら (goodbye for a while), またね (see you) and おやすみ (good night) for the situation.',
      },
    ],
    [
      {
        id: 'nubbins',
        label: 'Start with the Nubbins.',
        then: [
          N('You go along the row. Oyasumi, oyasumi, oyasumi. Three sleepy bows and one snore.'),
          HA('The snore was Dumpling. It still counts.'),
        ],
      },
      {
        id: 'nova',
        label: 'Start with Nova.',
        then: [
          N('You say おやすみなさい to Nova, with a little bow.'),
          NO('The polite one! I feel very grand.', 'happy'),
        ],
      },
      {
        id: 'hana',
        label: 'Start with Hana.',
        then: [
          HA('Me first? Oyasumi! I’m first to bed. I win.', 'happy'),
          NO('It’s not a race.'),
          HA('Everything is a race.'),
        ],
      },
    ],
  ),
  scene(
    'lj1-s3-done',
    [
      N('You say oyasumi to everyone. Even the herb bed, just in case.'),
      NO('おやすみなさい. You’re better at this than I was after a whole week.', 'soft'),
      N('Dumpling bows to the moon. The moon does not bow back, but it seems to appreciate it.'),
      N('The sky over the hill turns dark blue, then darker.'),
      N('Hana is asleep on the bench. Her pencil is still moving, drawing a line off the edge of the page.'),
      NO('Right now it’s morning at Hana’s home in Japan. Her family is just waking up.', 'soft'),
    ],
    [
      {
        domain: 'science',
        skill: 'why it is night here and day somewhere else',
        standard: '1-ESS1-1',
        kind: 'notice',
        after: 5,
        lines: [
          NO('The Earth spins all the way round every day. When our side turns away from the Sun, it gets dark here.'),
          NO('At the same time, the other side of the world is turning towards the Sun, and it’s morning there.'),
        ],
        parentNote: 'Learned that the spinning Earth makes day and night, so it can be night in one country and morning in another.',
      },
    ],
  ),
  scene(
    'lj1-complete',
    [
      N('Next morning a paper lantern hangs on the gate. Nova painted it last night, in wobbly brush letters: こんにちは.'),
      NO('It’s a welcome sign, for everyone who comes through, whatever language they speak.', 'happy'),
      HA('I made up a song on the train. An おじぎ song. Bow at the end of every line.'),
      HA('おはよう (ohayō), up comes the sun! こんにちは (konnichiwa), hello, everyone!'),
      HA('ありがとう (arigatō), thanks for the fun! こんばんは (konbanwa), the day is done!'),
      HA('おやすみ (oyasumi), down goes the light. Bow, bow, and say good night!'),
      N('Three Nubbins bow at the end of every line. Dumpling bows one line late every time, and has to lie down afterwards.'),
      HA('はい. You can bow now. Properly. I’m giving you that.', 'happy'),
      FE('Is there a polite version of the song?', 'think'),
      HA('いいえ. It’s already perfect.'),
    ],
    [
      {
        domain: 'music',
        skill: 'a rhyming chant with a repeated action',
        standard: 'RL.2.4',
        kind: 'do',
        after: 5,
        check: 'edu:chant:ja:bowing-song',
        lines: [HA('Your turn! Sing it with me and bow on the last word of each line. Listen for the rhymes: sun, everyone, fun, done.')],
        parentNote: 'Sang an original greeting chant, bowing in time, and spotted the rhyming words at the ends of lines.',
      },
    ],
  ),
];

// ================================================================== LJ2 The Hiragana Pond
const LJ2_SCENES: EduScene[] = [
  scene(
    'lj2-s1',
    [
      N('Hana has been up since dawn, painting the flat stones in the pond. Marina watches, the way she watches anyone touching water.'),
      MA('She asked you first. Mostly.'),
      HA('These are hiragana. It’s one of the ways we write Japanese. There are forty-six basic ones.', 'happy'),
      HA('Today we need five: あ い う え お. You say them a, i, u, e, o. Like “ah, ee, oo, eh, oh”.'),
      HA('They come first in the hiragana chart. Nearly every other hiragana ends in one of those five sounds.'),
      N('She has hidden the five painted stones among plain ones. Some face up. Some are sideways.'),
      HA('Find them in order, あ first. Step on the wrong one and you have to say “sorry, stone”.'),
      HA('Then we spell words. うえ (ue) means “up”. いえ (ie) means “house”. あお (ao) means “blue”.'),
      MA('And if somebody falls in?', 'think'),
      HA('Nobody falls in. I’m very fast.'),
      N('On the お stone sits a frog. It is fat, wet and not interested in hiragana at all.'),
      HA('That’s fine. That is a normal frog and I am being normal about it.', 'think'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'recognising the five vowel kana あ い う え お',
        kind: 'do',
        after: 6,
        check: 'edu:find:ja:vowels',
        lines: [HA('Find あ, い, う, え and お on the stones, in that order. Say each sound as you step on it.')],
        parentNote: 'Found and read the five Japanese vowel letters あ い う え お (a, i, u, e, o), in order.',
      },
      {
        domain: 'literacy',
        skill: 'reading a two-letter word: うえ',
        kind: 'ask',
        after: 7,
        prompt: [HA('Which two stones spell うえ, “up”?')],
        options: [
          { label: 'う, then え', best: true, reply: [HA('はい! う, え. Ue. Up!', 'happy')] },
          {
            label: 'え, then う',
            reply: [HA('Close! That spells え, う, which isn’t a word. Read it in order, left to right: う first, then え.')],
          },
          {
            label: 'あ, then お',
            reply: [HA('That spells あお: blue! Nice reading. But for うえ, step on う, then え.')],
          },
        ],
        parentNote: 'Read the word うえ (ue, “up”) letter by letter, in order.',
      },
    ],
  ),
  scene(
    'lj2-s1-done',
    [
      N('あ, い, う, え, お. You hop across in order. On the お stone, the frog moves exactly one centimetre.'),
      HA('Now spell うえ. Up!'),
      N('You jump onto う, then え, then up onto the bank. Hana claps.'),
      HA('いえ next. Then あお.', 'happy'),
      HA('And nobody mention the frog.'),
      MA('Nobody mentioned the frog.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'reading how someone really feels',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 5,
        prompt: [N('Hana keeps saying she’s “normal” about the frog. She also won’t go near it. How do you think she really feels?')],
        options: [
          {
            label: 'A little scared, but she doesn’t want to show it.',
            best: true,
            reply: [N('That’s what it looks like. What people say and what they do can tell different stories. Being kind about it helps.')],
          },
          {
            label: 'She loves frogs.',
            reply: [N('Hmm. She’s keeping very far away from it. Her actions say she’s a little scared, even if her words don’t.')],
          },
          {
            label: 'She doesn’t care at all.',
            reply: [N('Look where she’s standing, though. People sometimes hide being scared. Her actions give it away.')],
          },
        ],
        parentNote: 'Noticed that what a character does can show a feeling her words hide.',
      },
    ],
  ),
  scene(
    'lj2-s2',
    [
      N('Dusty has raked a patch of sand flat by the pond. They lean on the rake like it’s an old friend.'),
      DU('Smooth as I can get it. There was a spoon under here. And another spoon. I don’t know whose spoons these are.'),
      HA('Now put a “k” in front of the five sounds. You get か き く け こ. Ka, ki, ku, ke, ko.'),
      HA('Every hiragana has its strokes in the same order, every time.'),
      N('She traces く with one finger: a single stroke, like a bird’s beak. Then こ: two short lines, one above the other.'),
      HA('く is one stroke. こ is two. か has a little dash off to one side, like it’s waving.'),
      HA('Words! いけ (ike) is “pond”, like this one. かお (kao) is “face”. あか (aka) is “red”.'),
      DU('So I’ve been raking next to an いけ all morning and didn’t know it.', 'happy'),
      N('The frog from the お stone has followed you. It sits in the sand, right where く should go.'),
      HA('It’s not in the way. I’ll write round it. Frogs are fine. It’s fine.', 'think'),
    ],
    [
      {
        domain: 'art',
        skill: 'stroke order in handwriting',
        kind: 'notice',
        after: 3,
        lines: [
          HA('Stroke order means which line you draw first, and which way it goes.'),
          HA('The rule of thumb is top to bottom, left to right. Doing it the same way every time makes your writing neat and steady.'),
        ],
        parentNote: 'Learned that each hiragana is written with its strokes in a set order, usually top to bottom and left to right.',
      },
      {
        domain: 'literacy',
        skill: 'tracing か き く け こ',
        kind: 'do',
        after: 5,
        check: 'edu:trace:ja:ka-row',
        lines: [HA('Trace か き く け こ in the sand. Follow the numbers, one stroke at a time. Say each sound as you finish it.')],
        parentNote: 'Traced the five kana か き く け こ (ka, ki, ku, ke, ko) in stroke order.',
      },
    ],
    [
      {
        id: 'scoop',
        label: 'Gently move the frog back to the pond.',
        then: [
          N('You scoop it up in both hands and set it down at the water’s edge. Hana breathes out, quietly.'),
          HA('I was fine. But ありがとう.'),
        ],
      },
      {
        id: 'around',
        label: 'Write round the frog.',
        then: [
          N('You draw く in a curve round the frog. It looks like the frog is getting a hug.'),
          HA('That’s actually a really good drawing.', 'happy'),
        ],
      },
      {
        id: 'ask',
        label: 'Ask Hana if she’s scared.',
        then: [
          HA('Me? いいえ. No. Not at all.', 'think'),
          N('She is standing on one leg, as far from the frog as a person can be while still holding a stick.'),
        ],
      },
    ],
  ),
  scene(
    'lj2-s2-done',
    [
      N('か き く け こ, in a neat row in the sand.'),
      N('Dusty steps back to admire it and treads right on the け.'),
      DU('Sorry. ごめんなさい. I’ll rake it.'),
      HA('Now write かお, and I’ll put a face in it.'),
      N('She draws two eyes in the お and a smile under the か. It looks a lot like Dusty.'),
      DU('That’s me, isn’t it.', 'shock'),
      HA('はい.', 'happy'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'reading two-letter words in kana',
        kind: 'ask',
        after: 3,
        prompt: [N('Hana wants to draw a face in the sand. Which word should you write for her?')],
        options: [
          { label: 'かお (kao)', best: true, reply: [HA('はい! か, お. Kao, face. Now watch me draw on it.', 'happy')] },
          { label: 'いけ (ike)', reply: [HA('That’s “pond”: い, け. Face is かお: か, お.')] },
          { label: 'あか (aka)', reply: [HA('That’s “red”: あ, か. Face is かお: か, お.')] },
        ],
        parentNote: 'Read three kana words, いけ (pond), かお (face) and あか (red), and picked the one meaning “face”.',
      },
    ],
  ),
  scene(
    'lj2-s3',
    [
      N('Hana lays her sketchbook open on the grass. The first page is blank. For Hana, that is very rare.'),
      HA('The last two for today: は (ha) and な (na). Put them together: はな. That’s me. Hana.', 'happy'),
      HA('はな also means “flower”. I like to think the flowers were named after me.'),
      HA('There’s another way to write it: 花. That’s kanji. Kanji came from Chinese, and each one carries a meaning.'),
      HA('So Japanese has three scripts: hiragana, kanji, and katakana, which is mostly for words borrowed from other languages.'),
      HA('Like ピンク (pinku). Say it.'),
      N('You say it. It sounds a lot like “pink”.'),
      HA('Exactly. Japanese borrowed it, and it came out a bit different.'),
      HA('And は is sneaky. Mostly it says “ha”. But in わたしは, it says “wa”, because it points at who the sentence is about.'),
      HA('Write はな on my sketchbook. Big. You can go across in a row, or down in a column. Japanese can do both.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'the three Japanese scripts',
        kind: 'notice',
        after: 4,
        lines: [
          HA('Hiragana is for Japanese words, like はな. Katakana is mostly for borrowed words, like ピンク.'),
          HA('And kanji carry meaning, like 花. Lots of Japanese sentences use all three at once.'),
        ],
        parentNote: 'Learned that Japanese uses three scripts: hiragana, katakana (mostly for borrowed words) and kanji (characters that carry meaning).',
      },
      {
        domain: 'social-studies',
        skill: 'how words travel between languages (think question)',
        standard: 'L.3.4',
        kind: 'ask',
        after: 7,
        prompt: [
          N('Japanese borrowed “pink” and made it ピンク (pinku). English borrowed “koi” from Japanese.'),
          N('When a word moves into another language, what do you think changes, and what stays?'),
        ],
        options: [
          {
            label: 'The sound changes a bit, but the meaning stays.',
            reply: [
              N('That’s a good answer. The word gets a new accent to fit its new home, and usually keeps its meaning.'),
              N('In Japanese, こい is any carp. In English, koi are the colourful pond kind.'),
            ],
          },
          {
            label: 'It gets new letters to fit the new language.',
            reply: [N('That’s a fair answer. Pink got katakana letters. Koi got English letters. Same idea, new clothes.')],
          },
          {
            label: 'Both languages end up sharing a little piece.',
            reply: [N('That’s a lovely answer. Borrowed words are like presents that languages give each other.')],
          },
        ],
        parentNote: 'Thought about what happens to a word, like pink or koi, when it is borrowed into another language.',
      },
    ],
    [
      {
        id: 'row',
        label: 'Write it across, left to right.',
        then: [
          N('You write は, then な, side by side across the page.'),
          HA('Like a name on a door. Good.', 'happy'),
        ],
      },
      {
        id: 'column',
        label: 'Write it down, top to bottom.',
        then: [
          N('You write は at the top and な underneath, in a column.'),
          HA('Very fancy. When a page is in columns, you read the columns from right to left.', 'happy'),
        ],
      },
    ],
  ),
  scene(
    'lj2-s3-done',
    [
      N('はな, in your best handwriting. The な has a slightly wobbly loop.'),
      N('Hana studies it for a long time.'),
      HA('That’s the first time anyone here has written my name the way my family writes it.', 'soft'),
      HA('I’m keeping this page forever. I won’t even draw on it. Much.'),
      N('The frog hops onto the sketchbook and sits on the は.'),
      N('Hana makes a very small noise. It is definitely not a scream.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'writing a name in hiragana: はな',
        kind: 'do',
        after: 1,
        check: 'edu:write:ja:hana',
        lines: [HA('Write it once more, on your own page this time. は first, then な. You’re writing your teacher’s name!', 'happy')],
        parentNote: 'Wrote the name はな (Hana) in hiragana, the teacher’s name, from memory.',
      },
    ],
  ),
  scene(
    'lj2-complete',
    [
      N('Marina has helped Hana paint the rest of the stones. Twelve kana cross the pond now. A Nubbin waits on the bank.'),
      HA('Quick-fire! I call a word, the Nubbin hops on the letters. Go! うえ!'),
      N('う, え. The Nubbin hops twice and points up.'),
      HA('いえ! いけ!'),
      N('A house, a pond. The Nubbin points at your cottage, then at the pond, very pleased.'),
      HA('かお! あか! あお!'),
      N('Face, red, blue. The Nubbin pulls a face, goes pink in the cheeks, then sits down, worn out.'),
      HA('Last one: はな.'),
      MA('I’d keep the stones. They’re better than plain ones.', 'happy'),
      HA('Hiragana stepping stones! Now anyone who crosses this pond is reading Japanese, whether they like it or not.', 'happy'),
    ],
    [
      {
        domain: 'maths',
        skill: 'equal groups: rows of five',
        standard: '3.OA.A.1',
        kind: 'ask',
        after: 0,
        prompt: [
          N('The stones are two rows of five, あ い う え お and か き く け こ, plus は and な.'),
          MA('How many painted stones is that altogether?'),
        ],
        options: [
          { label: '10', reply: [MA('That’s the two rows: 2 lots of 5 is 10. Then add は and な. 10 + 2 = 12.')] },
          { label: '12', best: true, reply: [MA('Yes. 2 rows of 5 is 10, and 2 more makes 12.', 'happy')] },
          { label: '7', reply: [MA('That’s 5 + 2. But there are two rows of five: 5 + 5 = 10. Add は and な: 12.')] },
        ],
        parentNote: 'Counted 2 equal rows of 5 kana stones plus 2 more: 12 in all.',
      },
    ],
  ),
];

// ================================================================== LJ3 Counting Koi
const LJ3_SCENES: EduScene[] = [
  scene(
    'lj3-s1',
    [
      N('Marina is at the pond with two big buckets. Something inside flashes orange and white.'),
      MA('New fish. A friend upriver had too many. Like people with courgettes.'),
      HA('こい (koi)! They’re koi! I’ve drawn about a thousand of them.', 'happy'),
      HA('You say koi in English too. Same word. Japanese lent it to English.'),
      MA('We count them in, so we know nobody’s missing later. Hana says we’re counting in Japanese.'),
      HA('Hold up your fingers. いち (ichi), one. に (ni), two. さん (san), three.'),
      HA('よん (yon), four. ご (go), five. One whole hand.'),
      N('A koi slides out of the bucket into the pond. Then another. They don’t wait for anyone to be ready.'),
      HA('Quick! いち! に!', 'shock'),
      MA('There are ten. Five in this bucket, five in that one.'),
      HA('After ご, I’ll call the next numbers and you copy me. Don’t blink.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'words English has borrowed',
        kind: 'notice',
        after: 3,
        lines: [MA('Lots of English words came from other languages. Koi is one from Japanese.')],
        parentNote: 'Learned that English has borrowed words from Japanese, such as koi.',
      },
      {
        domain: 'maths',
        skill: 'counting to five in Japanese',
        standard: 'K.CC.B.5',
        kind: 'do',
        after: 8,
        check: 'edu:count:ja:koi:5',
        lines: [HA('Count the first five koi as they swim in: いち, に, さん, よん, ご. One finger for each fish.')],
        parentNote: 'Counted five fish in Japanese: いち, に, さん, よん, ご (ichi, ni, san, yon, go).',
      },
    ],
  ),
  scene(
    'lj3-s1-done',
    [
      HA('After ご came ろく (roku), six. なな (nana), seven. はち (hachi), eight.'),
      HA('Then きゅう (kyū), nine. And じゅう (jū), ten!', 'happy'),
      HA('Ten koi! Ten fingers! Nobody fell in!'),
      MA('A little dramatic. But correct.'),
      N('Ten koi drift round in a slow orange circle.'),
      N('Dumpling sits on the bank, counting them with his head.'),
    ],
    [
      {
        domain: 'science',
        skill: 'how fish breathe with gills',
        standard: '4-LS1-1',
        kind: 'notice',
        after: 4,
        lines: [
          MA('See the little flaps just behind their heads? Those cover the gills.'),
          MA('Fish take water in through the mouth. As it flows out past the gills, the gills take the oxygen from it. That’s how they breathe.'),
        ],
        parentNote: 'Learned that fish breathe with gills, which take oxygen from the water flowing past them.',
      },
    ],
  ),
  scene(
    'lj3-s2',
    [
      N('Sparks arrives at speed, the way Sparks arrives everywhere. Pixel follows with a board on a stick.'),
      SP('I HEAR SOMEONE HERE THINKS SHE’S FAST.', 'happy'),
      HA('I don’t think I’m fast. I know I’m fast.'),
      PX('Lap counter. It flips a tile for every lap round the pond. Hana painted the numbers.', 'happy'),
      N('The first three tiles say 一, 二 and 三. One line, two lines, three lines.'),
      HA('Kanji for one, two and three. The easiest kanji in the world. You just count the lines.'),
      BY('I’ll keep the official time. And the laps. And a record of who says “it was just a practice”.', 'think'),
      HA('Count the laps out loud, in Japanese. Loser feeds the さかな (sakana, “fish”).'),
      MA('Sakana means any fish. Koi are one kind of sakana.'),
      HA('Some numbers have two names. Four is よん or し (shi). Seven is なな or しち (shichi). Nine is きゅう or く (ku).'),
      HA('For counting games, use yon, nana and kyū. Ready?'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'kanji for one, two and three',
        kind: 'notice',
        after: 5,
        lines: [
          HA('一 is one line. 二 is two lines. 三 is three lines.'),
          HA('Not all kanji are this easy. Enjoy it while it lasts.', 'happy'),
        ],
        parentNote: 'Read the kanji 一, 二 and 三 (one, two, three) by counting their lines.',
      },
      {
        domain: 'maths',
        skill: 'multiplying equal laps',
        standard: '3.OA.A.1',
        kind: 'ask',
        after: 10,
        prompt: [BY('One lap of the pond is 40 strides. The race is 3 laps. How many strides is the whole race?')],
        options: [
          { label: '43', reply: [BY('That adds 40 and 3. But it’s 3 lots of 40: 40 + 40 + 40 = 120.')] },
          { label: '120', best: true, reply: [BY('Correct. 3 × 40 = 120. Officially.', 'happy')] },
          { label: '80', reply: [BY('That’s 2 laps. One more lap: 80 + 40 = 120.')] },
        ],
        parentNote: 'Worked out 3 laps of 40 strides as 3 × 40 = 120.',
      },
    ],
    [
      {
        id: 'fair',
        label: 'A fair start.',
        then: [
          BY('Fair start. Nobody moves until I say. Nobody. Hana.'),
          HA('I wasn’t moving. I was leaning.'),
        ],
      },
      {
        id: 'headstart',
        label: 'Give Hana a head start.',
        then: [
          HA('I don’t need a head start!', 'angry'),
          HA('…But I’ll take it. Strategically.', 'happy'),
        ],
      },
      {
        id: 'sparks',
        label: 'Let Sparks race too.',
        then: [
          SP('THREE-WAY RACE. Yes. YES.', 'happy'),
          HA('Fine. I’ll beat you both. Count my laps louder than hers.'),
        ],
      },
    ],
  ),
  scene(
    'lj3-s2-done',
    [
      N('The lap counter clacks. The last tile flips. Everyone flops on the grass, puffing.'),
      BY('Official laps: counted, in Japanese. Official excuse from Hana: pending.', 'think'),
      HA('That was a practice one. Whoever won.'),
      BY('There it is.'),
      HA('Rematch tomorrow. Now let’s feed the さかな. All of us.', 'happy'),
      HA('Because I’m kind. Not because of anything else.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'how it feels to lose, and what helps (think question)',
        standard: 'CASEL: Self-management',
        kind: 'ask',
        after: 3,
        prompt: [N('Hana calls every race she loses “a practice one”. What helps you most when you lose a game?')],
        options: [
          {
            label: 'Asking for a rematch, like Hana.',
            reply: [N('That’s a fair answer. Wanting another go shows you care, and you might get better each time.')],
          },
          {
            label: 'Saying “well done” to the winner.',
            reply: [N('That’s a kind answer. It’s hard to do when you feel cross, which is why it means a lot.')],
          },
          {
            label: 'Taking a breath before I say anything.',
            reply: [N('That’s a wise answer. Big feelings settle a bit if you give them a moment.')],
          },
        ],
        parentNote: 'Thought about the feelings that come with losing a game and ways to handle them.',
      },
    ],
  ),
  scene(
    'lj3-s3',
    [
      N('Night. Luna has spread a blanket on the hill, away from the cottage lights.'),
      LU('It’s darker up here, so you see more. Give your eyes a few minutes and the sky fills up.', 'soft'),
      HA('ほし (hoshi) means “star”. We count ten, in Japanese. I’ll start, because I’m the guest.'),
      N('One star. Then another near it. Then, as your eyes get used to the dark, lots.'),
      HA('いち… に… さん… Oh, that one’s a plane. That doesn’t count.'),
      LU('And where’s the moon? There should be a moon tonight.', 'think'),
      HA('Moon is つき (tsuki). Find the つき and I’ll draw it. In the dark. By feel.'),
      N('Dumpling has followed you up the hill. Every time Hana points at a star, he points his whole body at it.'),
      HA('Ten ほし, then the つき. Go.'),
    ],
    [
      {
        domain: 'science',
        skill: 'stars and moonlight',
        standard: '1-ESS1-1',
        kind: 'notice',
        after: 5,
        lines: [
          LU('Stars make their own light. They’re suns, very, very far away.'),
          LU('The moon doesn’t make its own light. Sunlight bounces off it, and that’s the light we see.', 'soft'),
        ],
        parentNote: 'Learned that stars make their own light but the moon shines because sunlight bounces off it.',
      },
      {
        domain: 'maths',
        skill: 'counting to ten in Japanese',
        standard: 'K.CC.B.5',
        kind: 'do',
        after: 8,
        check: 'edu:count:ja:hoshi:10',
        lines: [HA('Tap a star, say its number. いち, に, さん, よん, ご, ろく, なな, はち, きゅう, じゅう. Planes don’t count!')],
        parentNote: 'Counted ten stars aloud in Japanese, from いち (ichi) to じゅう (jū).',
      },
    ],
    [
      {
        id: 'bright',
        label: 'Start with the brightest star.',
        then: [LU('The bright one. Good choice. Easy to find again.', 'soft')],
      },
      {
        id: 'dumpling',
        label: 'Count the ones Dumpling points at.',
        then: [N('Dumpling points. You count. Dumpling points. You count. It is very slow, and extremely accurate.')],
      },
    ],
  ),
  scene(
    'lj3-s3-done',
    [
      N('いち, に, さん, よん, ご, ろく, なな, はち, きゅう, じゅう. Ten ほし.'),
      N('And there, low behind the plum trees: a thin silver つき.'),
      HA('Found it! Hold still, I’m drawing it.', 'happy'),
      N('She draws in the dark, by feel, tongue out.'),
      N('Her drawing has eleven stars and two moons.'),
      HA('That’s an artistic choice.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'reading ほし and つき',
        kind: 'ask',
        after: 1,
        prompt: [HA('Which word should I write under my moon?')],
        options: [
          { label: 'つき (tsuki)', best: true, reply: [HA('はい! つき, moon. And ほし for all my stars.', 'happy')] },
          { label: 'ほし (hoshi)', reply: [HA('ほし is “star”. Moon is つき.')] },
          { label: 'こい (koi)', reply: [HA('That’s the fish! Moon is つき.')] },
        ],
        parentNote: 'Read and chose between ほし (hoshi, star) and つき (tsuki, moon).',
      },
    ],
  ),
  scene(
    'lj3-complete',
    [
      N('Morning. Pixel bolts the lap counter to a post by the pond. Marina has named one of the koi, and won’t say what.'),
      HA('Last thing. A counting chant, for feeding the koi. Clap on every number.'),
      HA('いち, に, さん (ichi, ni, san), koi in the pond!'),
      HA('よん, ご (yon, go), round and beyond!'),
      HA('ろく, なな (roku, nana), under the reeds!'),
      HA('はち, きゅう, じゅう (hachi, kyū, jū), and everyone feeds!'),
      N('Ten koi rise to the top at once. It may be the chant. It may be the food. Byte says it’s the food.'),
      MA('That one’s yours, by the way. The one with a spot like a smudged thumbprint.', 'happy'),
      HA('ありがとうございます, Marina! And おはようございます, which I forgot to say before.', 'happy'),
      HA('A koi for your pond, and a lap counter for my rematch. Tomorrow. And the day after.'),
    ],
    [
      {
        domain: 'music',
        skill: 'clapping a steady beat in a counting chant',
        standard: 'RL.2.4',
        kind: 'do',
        after: 5,
        check: 'edu:chant:ja:koi-chant',
        lines: [HA('Your turn. Clap on every number and say it with me. The rhymes are pond, beyond, reeds, feeds.')],
        parentNote: 'Chanted 1 to 10 in Japanese, clapping on each number, in an original rhyming chant.',
      },
    ],
  ),
];

// ================================================================== LJ4 Colours and Lunchboxes
const LJ4_SCENES: EduScene[] = [
  scene(
    'lj4-s1',
    [
      N('Hana is at the kitchen table with an empty box. It has four sections, a lid and an elastic band.'),
      HA('This is an おべんとう (obentō), a packed lunch box. We’re making a picnic. It has to be pretty, because I’m drawing it after.'),
      HA('My rule: lots of colours. Like a paintbox you can eat.'),
      FE('I’ve brought what the garden had. It had… some things.', 'think'),
      HA('First, おにぎり (onigiri), rice balls. Rice is しろ (shiro), white. Wrap them in seaweed: くろ (kuro), black.'),
      HA('Egg for きいろ (kiiro), yellow. Beans for みどり (midori), green. Tomatoes for あか, red.'),
      FE('And あお? I’ve got nothing blue. Hardly any food is blue.'),
      HA('The cloth! We wrap the box in a blue cloth. That counts.', 'happy'),
      N('Dumpling climbs onto the table and sits in the empty green corner of the box.'),
      FE('Dumpling is not lunch.'),
      HA('So what goes in the みどり corner? Dumpling is not an option.'),
    ],
    [
      {
        domain: 'art',
        skill: 'naming colours while arranging a picture',
        kind: 'do',
        after: 7,
        check: 'edu:sort:ja:bento:colour',
        lines: [HA('Pack it! Put each food in its own section, and say its colour in Japanese as you go: しろ, くろ, きいろ, みどり, あか.')],
        parentNote: 'Arranged a lunch box by colour, naming each colour in Japanese.',
      },
      {
        domain: 'literacy',
        skill: 'reading colour words in hiragana',
        kind: 'ask',
        after: 10,
        prompt: [HA('Which word means “white”, like the rice?')],
        options: [
          { label: 'しろ (shiro)', best: true, reply: [HA('はい! しろ, white. Rice is しろ.', 'happy')] },
          { label: 'くろ (kuro)', reply: [HA('くろ is black, like the seaweed. White is しろ.')] },
          { label: 'きいろ (kiiro)', reply: [HA('きいろ is yellow, like the egg. White is しろ.')] },
        ],
        parentNote: 'Read the colour words しろ (white), くろ (black) and きいろ (yellow).',
      },
    ],
    [
      {
        id: 'beans',
        label: 'The beans.',
        then: [N('You put the beans in. Dumpling eats one. You put another in. He eats that too. This goes on for a while.')],
      },
      {
        id: 'cucumber',
        label: 'Cucumber from Fern’s garden.',
        then: [FE('Ah. The cucumber. I grew that. Mostly on purpose.', 'happy')],
      },
      {
        id: 'leaf',
        label: 'A big lettuce leaf.',
        then: [HA('Good. Green, and also a wall. It keeps the rice away from the tomatoes.', 'happy')],
      },
    ],
  ),
  scene(
    'lj4-s1-done',
    [
      N('しろ, くろ, きいろ, みどり, あか. The おべんとう looks like a little painted window.'),
      HA('Now the あお cloth. Tie it on top, like ears.', 'happy'),
      N('You lift the lid to check one last time.'),
      N('Dumpling is in the box.'),
      FE('How? HOW? I was looking right at him.', 'shock'),
      HA('He’s very fast for a dumpling.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'a quarter as one of four equal parts',
        standard: '3.NF.A.1',
        kind: 'ask',
        after: 1,
        prompt: [HA('The box has four equal sections. The green section is what fraction of the whole box?')],
        options: [
          { label: '1/4', best: true, reply: [HA('はい! One of four equal parts: one quarter.', 'happy')] },
          { label: '1/2', reply: [HA('A half would be one of two equal parts. Our box has four, so the green part is one quarter: 1/4.')] },
          { label: '1/3', reply: [HA('A third is one of three parts. Count the sections: four. So it’s 1/4.')] },
        ],
        parentNote: 'Named one of four equal sections of a lunch box as one quarter (1/4).',
      },
    ],
  ),
  scene(
    'lj4-s2',
    [
      N('A picnic by the pond. The blue cloth is spread out. The box is open. Dumpling has been taken out of it twice.'),
      HA('Before we eat, we say いただきます (itadakimasu). Hands together, a little bow, then eat.'),
      HA('And after, when it’s all gone, ごちそうさま (gochisōsama). Everyone at home says them. Even when they’re starving.'),
      SP('So I can’t eat ANYTHING until we say it?', 'shock'),
      HA('Nothing. Not one bean. You have a bean in your mouth right now.'),
      SP('…It got in by itself. すみません.'),
      HA('Fruit for after: りんご (ringo), apple. みかん (mikan), a mandarin orange. And おちゃ (ocha), tea, cold, because it’s summer.'),
      HA('A mikan is orange, so its colour is オレンジ (orenji). That’s katakana: a borrowed word, like ピンク.'),
      N('Dumpling copies Hana’s little bow perfectly. Everyone is very impressed. Then he eats the food before anyone has said anything.'),
      HA('That isn’t how it works, Dumpling!', 'shock'),
      HA('Ready? Hands together. Everybody.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'katakana for borrowed words',
        kind: 'notice',
        after: 7,
        lines: [
          HA('Look at the letters. オレンジ and ピンク are katakana. They’re pointier than hiragana.'),
          HA('Katakana is mostly for words borrowed from other languages. Read them out loud and you can often guess them.'),
        ],
        parentNote: 'Noticed that the borrowed colour words オレンジ (orenji) and ピンク (pinku) are written in katakana.',
      },
      {
        domain: 'sel',
        skill: 'mealtime manners: waiting and saying the words together',
        standard: 'CASEL: Social awareness',
        kind: 'do',
        after: 10,
        check: 'edu:say:ja:itadakimasu',
        lines: [HA('Hands together, everyone, and wait for each other. Then together: いただきます!')],
        parentNote: 'Waited for everyone and said いただきます (itadakimasu) before eating, as people do in Japan.',
      },
    ],
  ),
  scene(
    'lj4-s2-done',
    [
      N('“Itadakimasu!” Six voices, one bow, one Nubbin already chewing.'),
      N('Onigiri, beans, tomatoes, egg, a りんご cut in quarters, a みかん peeled in one long curl, cold おちゃ.'),
      HA('Now: ごちそうさま.', 'happy'),
      SP('Gochisōsama! I’m so full I’m too full to run. Don’t tell anyone.', 'happy'),
      HA('I’m telling everyone.'),
      N('Dumpling is asleep in the empty box, round as a rice ball.'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'mealtime words around the world (think question)',
        kind: 'ask',
        after: 2,
        prompt: [N('Before eating, Hana says いただきます. After, ごちそうさま. Why do you think people have special words for the start and end of a meal?')],
        options: [
          {
            label: 'To say thank you for the food.',
            reply: [N('That’s a thoughtful answer. Lots of families have a way of showing they’re grateful for a meal.')],
          },
          {
            label: 'So everyone starts together.',
            reply: [N('That’s a good answer. Saying something together turns a meal into something you share.')],
          },
          {
            label: 'Because it’s a habit, like brushing your teeth.',
            reply: [N('That’s a fair answer too. Habits can carry something important, even when we don’t think about it.')],
          },
        ],
        parentNote: 'Thought about why people say special words before and after eating.',
      },
    ],
  ),
  scene(
    'lj4-s3',
    [
      N('Afternoon. Hana opens her sketchbook to a fresh page and hands you her pencils one at a time, like a surgeon.'),
      HA('Draw three fruits for my sketchbook. I’ll draw them too, and we’ll see whose is best. It’s not a competition.'),
      NO('It’s a competition.'),
      HA('It’s a bit of a competition.'),
      HA('いちご (ichigo) is “strawberry”. It starts with いち, like “one”, and ends with ご, like “five”. It isn’t one-five, though.'),
      HA('もも (momo) is “peach”. Peaches are ピンク (pinku), pink. Ish. Don’t argue.'),
      FE('And my plums. They’re purple.', 'happy'),
      HA('むらさき (murasaki), purple. My favourite word today. Say it fast: murasaki, murasaki, murasaki.'),
      N('Dumpling sits very still in the middle of the fruit bowl, hoping to be drawn.'),
      HA('What are you drawing first?'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'spotting known words inside a new word',
        kind: 'ask',
        after: 4,
        prompt: [HA('So: いちご has いち and ご in it. What does いちご mean?')],
        options: [
          { label: 'One-five', reply: [HA('Ha! It looks like it, doesn’t it? But it’s a strawberry. Spotting the parts helps you remember it.')] },
          { label: 'Strawberry', best: true, reply: [HA('はい! いちご, strawberry. Same letters as いち and ご, completely different word.', 'happy')] },
          { label: 'Peach', reply: [HA('Peach is もも. いちご is strawberry.')] },
        ],
        parentNote: 'Noticed that いちご (strawberry) is spelled with the same kana as いち (one) and ご (five), and remembered its meaning.',
      },
      {
        domain: 'art',
        skill: 'mixing colours',
        kind: 'notice',
        after: 7,
        lines: [
          HA('No pink pencil? Mix it. Red paint and white paint make pink.'),
          HA('Red and blue make purple. So あか and あお make むらさき. Fern’s plums, sorted.', 'happy'),
        ],
        parentNote: 'Learned that red and white paint mix to make pink, and red and blue make purple.',
      },
    ],
    [
      {
        id: 'ichigo',
        label: 'An いちご, very red.',
        then: [HA('Good. Lots of little dots on the outside. Those are the seeds.', 'happy')],
      },
      {
        id: 'momo',
        label: 'A もも, ピンク and round.',
        then: [HA('Peaches are hard to draw. They always end up looking like a bottom. Everyone knows it. Nobody says it.', 'happy')],
      },
      {
        id: 'plum',
        label: 'One of Fern’s むらさき plums.',
        then: [FE('You’ve made it look much better than it is. That’s very kind.', 'soft')],
      },
    ],
  ),
  scene(
    'lj4-s3-done',
    [
      N('Three fruits on the page. Hana’s three are next to them.'),
      N('Hers are better. Yours are more cheerful.'),
      HA('Yours have more feelings in them. I’m putting them at the front.', 'happy'),
      N('In the corner of the page is a fourth thing: small, round and smudged.'),
      N('Dumpling has sat on the pencils.'),
      HA('He drew himself. Fine. He’s in.'),
    ],
    [
      {
        domain: 'science',
        skill: 'where a strawberry keeps its seeds',
        kind: 'ask',
        after: 2,
        prompt: [HA('Look closely at your いちご. Where are a strawberry’s seeds?')],
        options: [
          { label: 'On the outside, all over the skin.', best: true, reply: [HA('はい! Those tiny dots are the seeds. Strawberries wear theirs on the outside.', 'happy')] },
          { label: 'In the middle, like an apple.', reply: [HA('A りんご keeps its seeds in the middle. But a strawberry’s are the tiny dots on the outside.')] },
          { label: 'It has no seeds.', reply: [HA('It does! Look at the little dots on the skin. Those are its seeds.')] },
        ],
        parentNote: 'Observed that a strawberry’s seeds are on the outside, unlike an apple’s.',
      },
    ],
  ),
  scene(
    'lj4-complete',
    [
      N('Hana lays painted cards on the grass, one for every colour. Dumpling sits at the start line.'),
      HA('Colour game! I say a colour, Dumpling sits on the right card. If he gets it wrong, we cheer anyway.'),
      HA('あか! きいろ! みどり!'),
      N('Red, yellow, green. Dumpling hops, hops, hops.'),
      HA('しろ! くろ! むらさき! ピンク! オレンジ!'),
      N('He wobbles on purple, then sits on it so hard it creases. Pink, orange, done.'),
      HA('And あお!'),
      N('Dumpling sits on the blue card, then lies down on it, finished for the day.'),
      HA('The おべんとう box is yours. Pack it, take it to a sad Nubbin, have a picnic. It works every time.', 'happy'),
      HA('And your own sketchbook. Draw everything. Especially frogs. Not that I’m scared of them. I just don’t draw them.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'reading all nine colour words',
        kind: 'do',
        after: 7,
        check: 'edu:quiz:ja:colours',
        lines: [HA('Your turn to call them! Read each card out loud: あか, あお, きいろ, みどり, しろ, くろ, ピンク, オレンジ, むらさき.')],
        parentNote: 'Read nine Japanese colour words aloud, in hiragana and katakana.',
      },
    ],
  ),
];

// ================================================================== LJ5 Obāchan’s Letters
const LJ5_SCENES: EduScene[] = [
  scene(
    'lj5-s1',
    [
      N('Rain on the cottage roof. Hana opens a tin on the kitchen table. Inside is a bundle of letters tied with string.'),
      HA('Hazel used to write to my grandma, for years and years. Grandma kept a copy of every letter she sent back.'),
      HA('In my family, I call my grandma おばあちゃん (obāchan). My grandpa is おじいちゃん (ojiichan).'),
      HA('She gave me these to bring here. They’re in English, but she put Japanese words in for Hazel to learn.'),
      N('The paper is thin and soft from folding. The writing is very neat and very small. Hana reads it aloud.'),
      HA('Dear Hazel. ありがとう for the seeds. They came up!', 'happy'),
      HA('Our ねこ (neko, “cat”) sleeps on my letters. The いぬ (inu, “dog”) next door barks at her. The とり (tori, “birds”) ignore them both.'),
      HA('Ojiichan says hello and asks how your Nubbins are. From your ともだち (tomodachi, “friend”).'),
      N('Hana sits back and reads the last line again, to herself.'),
      HA('“Your ともだち.” Not just “from”. “Your friend.”', 'soft'),
      HA('Your turn. Read the next bit. Watch out for the ねこ. Obāchan drew her in the margin.'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'letters as a way to keep in touch, then and now',
        standard: 'D2.His.2.K-2',
        kind: 'notice',
        after: 1,
        lines: [
          HA('Before email and video calls, friends far apart wrote letters. A letter could take days or weeks to arrive.'),
          HA('Some people kept writing to the same friend for their whole lives.'),
        ],
        parentNote: 'Learned how people kept in touch by letter in the past, compared with today.',
      },
      {
        domain: 'literacy',
        skill: 'reading animal words in hiragana',
        kind: 'ask',
        after: 6,
        prompt: [HA('Which word in the letter means “cat”?')],
        options: [
          { label: 'ねこ (neko)', best: true, reply: [HA('はい! ねこ, cat. Obāchan’s cat thought she owned the house.', 'happy')] },
          { label: 'いぬ (inu)', reply: [HA('いぬ is the dog next door. Cat is ねこ.')] },
          { label: 'とり (tori)', reply: [HA('とり means birds. Cat is ねこ.')] },
        ],
        parentNote: 'Read the animal words ねこ (cat), いぬ (dog) and とり (bird) in a letter.',
      },
    ],
  ),
  scene(
    'lj5-s1-done',
    [
      N('You read the rest together, a line each. Hana does the voices. Obāchan’s ねこ gets a very grand voice.'),
      HA('Obāchan says a letter is a little visit. You open it, and the person is there for a bit.', 'soft'),
      HA('I said さようなら to her at the station, because a whole summer is a long time.'),
      HA('I miss her. She’s fine. She’s at home. I just miss her.', 'sad'),
      N('Hana pins the letter above her bed, next to a drawing of a ねこ asleep on an envelope.'),
      N('Then she starts a new page: a drawing for obāchan.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'missing someone, and what helps',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 3,
        lines: [
          N('It’s normal to miss someone who is far away, even when you’re having fun.'),
          N('Writing to them, drawing for them or talking about them can help, like Hana’s little visits.'),
        ],
        parentNote: 'Talked about missing someone far away and the things that help, like writing or drawing for them.',
      },
    ],
  ),
  scene(
    'lj5-s2',
    [
      N('The rain stops. Hana spreads big paper across the floor and tips out every pencil she owns.'),
      HA('Let’s draw our かぞく (kazoku), our families. With labels. In Japanese.', 'happy'),
      HA('My おかあさん (okāsan), my mum. My おとうさん (otōsan), my dad. Obāchan, glasses on her head, looking for her glasses.'),
      HA('And ojiichan. He died when I was six. I still put him in every family picture. He’s still in my family.', 'soft'),
      N('She draws him in the corner, in a hat, holding a fishing rod. She doesn’t rush it.'),
      HA('And our うさぎ (usagi), our rabbit. She’s called Biscuit. She bites.'),
      HA('There’s an owl in the tree by obāchan’s house. ふくろう (fukurō). Not family exactly, but it was always there.'),
      HA('Now yours. Anybody who’s family to you. People, pets, people who feel like family. They all count.'),
      N('Dumpling lies down on the paper, which probably means he’d like to be included.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'how a long vowel changes a word',
        kind: 'notice',
        after: 2,
        lines: [
          HA('Careful! おばあちゃん (obāchan) is grandma. おばちゃん (obachan) is auntie.'),
          HA('The only difference is the long “aa”. Hold it, or you’ll turn your grandma into your auntie.', 'happy'),
        ],
        parentNote: 'Learned that a long vowel changes meaning: おばあちゃん (obāchan, grandma) and おばちゃん (obachan, auntie).',
      },
      {
        domain: 'art',
        skill: 'drawing and labelling a family picture',
        kind: 'do',
        after: 7,
        check: 'edu:draw:ja:kazoku',
        lines: [HA('Draw the people and animals who are family to you, then label them. Use the Japanese words you know, or their names.')],
        parentNote: 'Drew a family picture and labelled it with Japanese family words such as おかあさん (mother) and おとうさん (father).',
      },
    ],
    [
      {
        id: 'grownups',
        label: 'Start with the grown-ups who look after me.',
        then: [HA('Good. If it’s your mum, write おかあさん. Your dad, おとうさん. Anyone else, write their name. Names are labels too.')],
      },
      {
        id: 'pets',
        label: 'Start with my pets.',
        then: [HA('Pets first is correct. My うさぎ would agree. She’d bite you to agree.', 'happy')],
      },
      {
        id: 'friends',
        label: 'Start with my ともだち.',
        then: [
          HA('ともだち can be かぞく too. Nova’s mine, this summer.', 'happy'),
          NO('I’m honoured.', 'soft'),
        ],
      },
    ],
  ),
  scene(
    'lj5-s2-done',
    [
      N('Two families on one big sheet, labelled in two languages.'),
      N('There’s a Nubbin-shaped gap where Dumpling lay.'),
      HA('Our かぞく. Look how many people.', 'happy'),
      NO('Is that the ふくろう? It looks cross.', 'think'),
      HA('はい. Owls always look cross. It was a very kind owl.'),
      HA('It used to call all night, when everyone was asleep.'),
    ],
    [
      {
        domain: 'science',
        skill: 'nocturnal animals',
        kind: 'ask',
        after: 5,
        prompt: [N('Most owls hunt at night and rest in the day. What do we call animals that are busy at night?')],
        options: [
          { label: 'Nocturnal', best: true, reply: [NO('Yes. Nocturnal animals are awake at night. Their big eyes and sharp hearing help them find food in the dark.', 'happy')] },
          { label: 'Hibernating', reply: [NO('Hibernating means sleeping through the winter. Animals awake at night are nocturnal.')] },
          { label: 'Migrating', reply: [NO('Migrating means travelling to a new place for part of the year. Animals awake at night are nocturnal.')] },
        ],
        parentNote: 'Learned that most owls are nocturnal: awake and hunting at night.',
      },
    ],
  ),
  scene(
    'lj5-s3',
    [
      N('Clover is sitting in the grass among the gentle Nubbins, the way she does most afternoons.'),
      CL('Hana says you’re learning feelings words. Good. They’re the most useful words there are.', 'soft'),
      HA('うれしい (ureshii) is happy. That one, rolling in the clover. Very うれしい.', 'happy'),
      HA('かなしい (kanashii) is sad. That one lost its ball in the pond. Look at its ears.'),
      HA('たのしい (tanoshii) is fun. Like this whole summer. ねむい (nemui) is sleepy. That’s Dumpling. Always Dumpling.'),
      N('Dumpling gives an enormous yawn.'),
      N('Then something hops out of the clover and lands on Hana’s shoe. It is a frog.'),
      HA('かえる (kaeru)! Frog! That’s a かえる!', 'shock'),
      HA('こわい (kowai) means scary, or scared. The frog is こわい. I am not. I am totally not こわい.'),
      N('She is standing on a garden chair. She doesn’t remember climbing onto the garden chair.'),
      CL('It’s all right to be scared of something, you know. Even something small.', 'soft'),
      HA('…Maybe I’m a little bit こわい.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'feeling words in Japanese',
        standard: 'RL.1.4',
        kind: 'ask',
        after: 5,
        prompt: [HA('Dumpling just yawned. Which feeling word fits him?')],
        options: [
          { label: 'ねむい (nemui)', best: true, reply: [HA('はい! ねむい, sleepy. Always Dumpling.', 'happy')] },
          { label: 'うれしい (ureshii)', reply: [HA('Maybe he’s happy too. But a yawn says ねむい: sleepy.')] },
          { label: 'かなしい (kanashii)', reply: [HA('He isn’t sad, just tired. A yawn says ねむい: sleepy.')] },
        ],
        parentNote: 'Matched a Nubbin’s yawn to the Japanese feeling word ねむい (nemui, sleepy).',
      },
      {
        domain: 'sel',
        skill: 'why people hide fear (think question)',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 11,
        prompt: [N('Hana kept saying she wasn’t scared of frogs. Now she says maybe a little. Why do you think people sometimes hide being scared?')],
        options: [
          {
            label: 'They don’t want people to laugh.',
            reply: [CL('That’s a fair answer. It can feel risky to say you’re scared. That’s why being kind about it matters.', 'soft')],
          },
          {
            label: 'They want to seem brave.',
            reply: [CL('That’s a good answer. But saying you’re scared can be brave too. Hana just did it.', 'soft')],
          },
          {
            label: 'They don’t want to admit it, even to themselves.',
            reply: [CL('That’s a thoughtful answer. Naming a feeling is often the first step to it getting smaller.', 'soft')],
          },
        ],
        parentNote: 'Thought about why people hide fear, and that naming a feeling can be brave.',
      },
    ],
    [
      {
        id: 'okay',
        label: '“It’s OK to be kowai.”',
        then: [HA('ありがとう. It is OK. I’m staying up here, though.', 'soft')],
      },
      {
        id: 'move',
        label: 'Gently carry the frog to the pond.',
        then: [
          N('You cup the frog in your hands and carry it to the pond. Hana climbs down.'),
          HA('ありがとう. Really.', 'soft'),
        ],
      },
      {
        id: 'together',
        label: '“Let’s look at it together, from here.”',
        then: [
          N('You stand by the chair. Together you watch the かえる. It blinks. Hana blinks.'),
          HA('It’s… actually got quite a nice face.', 'think'),
        ],
      },
    ],
  ),
  scene(
    'lj5-s3-done',
    [
      N('You point at each Nubbin and tell Hana how it feels. うれしい. かなしい. ねむい.'),
      HA('Yes! And the one with the ball? Nova fished it out. Now it’s うれしい.', 'happy'),
      CL('And you, Hana?', 'soft'),
      HA('たのしい. Today was たのしい. Even the かえる part. Mostly.'),
      N('By the pond, a little frog sits in the shallows, next to a cloud of tadpoles with little back legs.'),
      CL('Look. Baby frogs, nearly.', 'happy'),
    ],
    [
      {
        domain: 'science',
        skill: 'the life cycle of a frog',
        standard: '3-LS1-1',
        kind: 'notice',
        after: 5,
        lines: [
          CL('Frogs start as eggs in the water. The eggs hatch into tadpoles, which swim and breathe with gills.'),
          CL('Slowly they grow legs, lose their tails, and become frogs. Then the frogs lay eggs, and it starts again.'),
        ],
        parentNote: 'Learned the life cycle of a frog: egg, tadpole, frog.',
      },
    ],
  ),
  scene(
    'lj5-complete',
    [
      N('Evening. Hana writes a letter home at the kitchen table, tongue out, concentrating.'),
      HA('I’m telling obāchan everything. Help me check my words. Dumpling pulls a face, you say the feeling.'),
      N('Dumpling beams. Then droops. Then yawns enormously. Then hides behind the teapot.'),
      HA('うれしい, かなしい, ねむい, こわい! He’s very good at this.', 'happy'),
      HA('Family: おかあさん, おとうさん, おばあちゃん, おじいちゃん, and my ともだち. Animals: ねこ, いぬ, とり, うさぎ, ふくろう.'),
      HA('And one かえる. It’s part of the story now.', 'think'),
      HA('Obāchan sent this box with me. She said her letters should stay here, in the Grove, where they were always going.', 'soft'),
      HA('And this is for you: my happiest face. Use it when something is たのしい.', 'happy'),
    ],
    [
      {
        domain: 'sel',
        skill: 'naming feelings from faces',
        standard: 'CASEL: Self-awareness',
        kind: 'do',
        after: 3,
        check: 'edu:quiz:ja:feelings',
        lines: [HA('Your turn: Dumpling makes a face, you say the word. うれしい, かなしい, たのしい, こわい or ねむい?')],
        parentNote: 'Named feelings from facial expressions using five Japanese feeling words.',
      },
    ],
  ),
];

// ================================================================== LJ6 Floating Lanterns
const LJ6_SCENES: EduScene[] = [
  scene(
    'lj6-s1',
    [
      N('Late summer. The evenings come earlier now. Hana sits by the stream, not drawing. That’s how you know something is up.'),
      HA('At home, it’s nearly おぼん (Obon). It’s a time in summer when families remember the people in their family who have died.'),
      HA('At Obon, my family floats a paper lantern down the river for ojiichan. It’s called とうろうながし (tōrō nagashi).'),
      HA('Lots of places do it, often at the end of Obon. Every place does it a bit differently, and some don’t do it at all.'),
      HA('A river is かわ (kawa). This stream is more of a little かわ. But I think it would work.'),
      HA('The lantern has a light inside. ひかり (hikari), light. You watch it float away.', 'soft'),
      HA('It’s the quietest thing I know. Last year I floated one with obāchan. I wrote ojiichan’s name on it.'),
      HA('This year I’m here, not at the river. Could I float his lantern on your stream? You can come, if you want.', 'soft'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'Obon and tōrō nagashi',
        kind: 'notice',
        after: 3,
        lines: [
          N('おぼん (Obon) is a summer time in Japan when families remember relatives who have died.'),
          N('とうろうながし (tōrō nagashi) means floating paper lanterns on rivers. Customs and dates are different from place to place.'),
          N('For Hana’s family, it’s one of the ways they remember ojiichan.'),
        ],
        parentNote: 'Learned about Obon, a summer time when Japanese families remember relatives who have died, and floating lanterns (tōrō nagashi), which Hana’s family does for her grandfather.',
      },
      {
        domain: 'sel',
        skill: 'how people remember someone who has died (think question)',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 7,
        prompt: [N('Hana remembers her ojiichan by drawing him and floating a lantern. How do people you know remember someone?')],
        options: [
          {
            label: 'Looking at photos and telling stories about them.',
            reply: [HA('We do that too. Ojiichan stories are mostly about fish he didn’t catch.', 'soft')],
          },
          {
            label: 'Visiting a special place, or doing something they loved.',
            reply: [HA('That’s a lovely way. It’s like spending a little time with them.', 'soft')],
          },
          {
            label: 'I’m not sure. I’d like to ask my family.',
            reply: [HA('That’s a really good thing to ask. Families have their own ways.', 'soft')],
          },
        ],
        parentNote: 'Thought about the different ways families remember people who have died. A good one to talk about together.',
      },
    ],
    [
      {
        id: 'yes',
        label: '“Yes. We’ll all come.”',
        then: [HA('Really? Then I need paper. And sticks. And you, to help me get it right.', 'soft')],
      },
      {
        id: 'ask',
        label: '“Tell me about your ojiichan.”',
        then: [
          HA('He went fishing every week and never caught anything. He said that wasn’t the point.', 'soft'),
          HA('He taught me to run. He said always race people, because it makes them faster too.', 'happy'),
        ],
      },
      {
        id: 'sit',
        label: 'Sit next to her for a while.',
        then: [
          N('You sit. The stream goes past. Neither of you says anything for a bit, and that’s fine.'),
          HA('ありがとう. That helped.', 'soft'),
        ],
      },
    ],
  ),
  scene(
    'lj6-s1-done',
    [
      N('Hana is drawing again: a page of lanterns, a page of stream.'),
      N('Then the whole Grove at dusk, with tiny lights on the water.'),
      HA('Nova says everyone wants to come. Even Ember, and Ember doesn’t like anyone.', 'happy'),
      NO('Ember said “fine” and then asked what time. That’s a yes.'),
      HA('Tomorrow we make the lanterns. At home we write the name very carefully.'),
      HA('Bring your best handwriting.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'reading かわ and ひかり',
        kind: 'ask',
        after: 4,
        prompt: [HA('I’m drawing ojiichan’s lantern floating on our little かわ. Do you know what a かわ is?')],
        options: [
          { label: 'A river', best: true, reply: [HA('はい! かわ, river. And the lights on it are ひかり.', 'happy')] },
          { label: 'A light', reply: [HA('Light is ひかり. かわ is the river they float on.')] },
          { label: 'A tree', reply: [HA('Tree is a word for tomorrow! かわ is river.')] },
        ],
        parentNote: 'Read かわ (kawa, river) and told it apart from ひかり (hikari, light).',
      },
    ],
  ),
  scene(
    'lj6-s2',
    [
      N('Fern’s kitchen is covered in paper, glue and sticks. Everyone has turned up.'),
      HA('Ember! We haven’t met. はじめまして! わたしは はな です. よろしくおねがいします.', 'happy'),
      EM('…Ember. Hello. Pass the glue.'),
      FE('The sticks are from the old plum き (ki, “tree”). It dropped a branch on the shed. This is its way of saying sorry.'),
      HA('ありがとうございます, Fern! And き in kanji is 木. Look: a trunk, branches and roots. Some kanji started as pictures.'),
      HA('やま (yama), “mountain”, is 山: three peaks. And “river”, かわ, is 川: three lines of water, flowing down.'),
      BY('So some kanji are drawings that turned into words. Very efficient.', 'think'),
      N('Pixel fills a bucket with みず (mizu, “water”) for testing. The first test lantern sinks with great dignity.'),
      PX('Paper sides go soggy. A wooden base floats. Next one gets a wooden base.', 'think'),
      HA('Now the name. I’m writing おじいちゃん on mine. Obāchan says you write it slowly, so you think about him.', 'soft'),
      HA('If you make one too, write anyone you like. Someone you remember. Someone you love right now. Any language.'),
      N('Hana writes おじいちゃん one kana at a time and doesn’t talk while she does it. Nobody else does either.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'kanji that began as pictures',
        kind: 'notice',
        after: 5,
        lines: [
          HA('木 is a tree. 山 is a mountain. 川 is a river.'),
          HA('Squint at them. Can you see the pictures they started as?', 'happy'),
        ],
        parentNote: 'Saw how the kanji 木 (tree), 山 (mountain) and 川 (river) began as pictures.',
      },
      {
        domain: 'science',
        skill: 'which materials float',
        standard: '2-PS1-1',
        kind: 'ask',
        after: 8,
        prompt: [PX('The paper base sank. Which material would make the best base for a lantern that floats?')],
        options: [
          { label: 'Wood', best: true, reply: [PX('Yes. Wood floats, and it doesn’t go soggy as fast as paper. Wooden base it is.', 'happy')] },
          { label: 'A flat stone', reply: [PX('Stone is too heavy for its size. It sinks straight to the bottom. Wood floats.')] },
          { label: 'More paper', reply: [PX('Paper soaks up water, gets heavy and sinks. Wood floats much better.')] },
        ],
        parentNote: 'Compared materials and chose wood as one that floats.',
      },
    ],
    [
      {
        id: 'remember',
        label: 'Write the name of someone I remember.',
        then: [HA('Write it big, so it can be read from far away.', 'soft')],
      },
      {
        id: 'love',
        label: 'Write the name of someone I love, right now.',
        then: [HA('That’s allowed. Ojiichan would like that one. Lanterns are for love too.', 'soft')],
      },
      {
        id: 'word',
        label: 'Ask Hana to help me write the name in hiragana.',
        then: [HA('Say it slowly. I’ll write it in pencil, and you go over it. That’s how obāchan taught me.', 'soft')],
      },
    ],
  ),
  scene(
    'lj6-s2-done',
    [
      N('A row of lanterns dries on the windowsill.'),
      N('Names in hiragana, in English, and in Sparks’s enormous capitals.'),
      HA('Mine’s the best one.', 'happy'),
      FE('It’s not a competition, Hana.'),
      HA('…This one isn’t. You’re right. This one isn’t.', 'soft'),
      N('Pixel floats the test lantern in the bucket of みず. It stays up. Pixel nods once, satisfied.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'reading a family word in hiragana',
        kind: 'ask',
        after: 1,
        prompt: [N('Hana’s lantern says おじいちゃん, in her neatest hiragana. Who is it for?')],
        options: [
          { label: 'Her grandpa', best: true, reply: [HA('はい. おじいちゃん, grandpa. My ojiichan.', 'soft')] },
          { label: 'Her grandma', reply: [N('Grandma is おばあちゃん. おじいちゃん means grandpa: it’s for Hana’s ojiichan.')] },
          { label: 'Her friend', reply: [N('Friend is ともだち. おじいちゃん means grandpa: it’s for Hana’s ojiichan.')] },
        ],
        parentNote: 'Read the family word おじいちゃん (ojiichan, grandpa) on the lantern Hana made for her grandfather.',
      },
    ],
  ),
  scene(
    'lj6-s3',
    [
      N('Dusk. Everyone walks down to the stream with Hana. She carries ojiichan’s lantern in both hands.'),
      N('The water is low, slow and gold.'),
      HA('No あめ (ame, “rain”) tonight. Good. Rain and paper don’t get on.', 'happy'),
      HA('At obāchan’s, in winter, there’s ゆき (yuki, “snow”) on the やま behind her house. Snow is just frozen みず, really.'),
      HA('At home, Obon is nearly over. My family will be at the river tonight too.', 'soft'),
      LU('I’ll light them, one at a time. Let them go when you’re ready. No hurry.', 'soft'),
      HA('This one’s for ojiichan.', 'soft'),
      N('Hana sets her lantern on the かわ and doesn’t push it. It’s the slowest you have ever seen her do anything.'),
      N('Small ひかり follow it, one after another. Each one turns slowly as it finds the current.'),
      N('A frog sits on the bank beside Hana, watching the lights go. She doesn’t move away.'),
      HA('…You can watch too, かえる.', 'soft'),
      N('Then it’s your turn, if you’ve made one.'),
    ],
    [
      {
        domain: 'science',
        skill: 'snow and water: solid and liquid',
        standard: '2-ESS2-3',
        kind: 'ask',
        after: 3,
        prompt: [HA('Snow is frozen みず. So what happens to ゆき when the spring sun warms it?')],
        options: [
          { label: 'It melts back into water.', best: true, reply: [HA('はい! Warm ゆき melts into みず. Then the みず runs down the やま into the かわ.', 'happy')] },
          { label: 'It turns into rain clouds straight away.', reply: [HA('It melts first, into みず. Solid snow becomes liquid water when it warms up.')] },
          { label: 'It stays snow for ever.', reply: [HA('Not when it warms up! Snow melts into みず: solid ice turns to liquid water.')] },
        ],
        parentNote: 'Explained that snow is frozen water that melts back into liquid water when it warms.',
      },
    ],
  ),
  scene(
    'lj6-s3-done',
    [
      N('The lanterns drift on together: ひかり on the かわ, under the き. No あめ, no ゆき, just a warm, still night.'),
      HA('ありがとう. For letting me do this here.', 'soft'),
      N('Everyone watches until the last light has gone round the bend.'),
      N('Then you all walk back up to the cottage, slowly.'),
      N('Later, Sparks shouts PARTY. Hana asked for one afterwards, and Sparks has been waiting all evening.'),
      N('Every Nubbin in the Grove sits in rows.'),
      HA('Review party! Greetings! おはよう! おはようございます! こんにちは! こんばんは! はじめまして! すみません! ごめんなさい!', 'happy'),
      HA('Colours! あか, あお, きいろ, みどり, しろ, くろ, ピンク, オレンジ, むらさき!'),
      HA('And count the front row!'),
    ],
    [
      {
        domain: 'maths',
        skill: 'counting a set to ten in Japanese',
        standard: 'K.CC.B.5',
        kind: 'do',
        after: 8,
        check: 'edu:count:ja:nubbins:10',
        lines: [HA('Count the Nubbins in the front row: いち, に, さん, よん, ご, ろく, なな, はち, きゅう, じゅう!')],
        parentNote: 'Counted ten Nubbins aloud in Japanese at Hana’s review party.',
      },
    ],
  ),
  scene(
    'lj6-complete',
    [
      HA('Food! りんご, みかん, いちご, もも, おにぎり, おちゃ! いただきます!'),
      N('Dumpling eats a りんご before Hana has finished saying the word.'),
      HA('Family! おかあさん, おとうさん, おばあちゃん, おじいちゃん, ともだち, かぞく!'),
      HA('Animals! いぬ, ねこ, とり, うさぎ, ふくろう, こい, さかな!'),
      HA('Feelings! うれしい, たのしい. A little かなしい, because I go home soon. Not こわい. Well. Only of かえる.'),
      HA('The world! き, はな, みず, かわ, やま, あめ, ゆき, ほし, つき, ひかり!'),
      NO('And a title for the one who learned all of that.', 'happy'),
      HA('Hiragana Keeper. And this is for you: my drawing of tonight, the ひかり on the かわ. So you remember it too.', 'soft'),
      HA('I’m not saying さようなら. That’s for a long time. I’m saying またね. See you.', 'soft'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'reviewing every word in the questline',
        kind: 'do',
        after: 5,
        check: 'edu:review:ja:party',
        lines: [HA('The Nubbins are waiting for you. I hold up a word in Japanese, you read it out and say what it means. Every Nubbin who knows it will bow.')],
        parentNote: 'Reviewed greetings, numbers, colours, food, family, animals, feelings and nature words in Japanese.',
      },
      {
        domain: 'sel',
        skill: 'choosing words for a goodbye (think question)',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 8,
        prompt: [N('Hana could say さようなら, goodbye for a while. She chose またね, see you. Why do you think she chose that?')],
        options: [
          {
            label: 'She’s planning to come back.',
            reply: [N('That’s a good answer. またね sounds like a promise to see you again.')],
          },
          {
            label: 'さようなら felt too sad.',
            reply: [N('That’s a thoughtful answer. The words we pick for a goodbye can make it feel lighter.')],
          },
          {
            label: 'Because we’re friends now.',
            reply: [N('That’s a lovely answer. またね is what friends say. And you are ともだち now.')],
          },
        ],
        parentNote: 'Thought about how choosing a word for a goodbye can show a friendship and a hope to meet again.',
      },
    ],
  ),
];

// ================================================================== the edu quests
export const EDU_LANG_JAPANESE_READER: EduQuest[] = [
  {
    id: 'reader:lj1',
    of: 'lj1',
    band: 'reader',
    title: 'Konnichiwa, Hana!',
    goals: {
      'lj1-step1': { goal: 'Say hello to Hana at the gate in Japanese.', hint: 'Tap Hana and choose Greet. Say “konnichiwa” (こんにちは). A little bow is a nice touch.' },
      'lj1-step2': { goal: 'Teach three Nubbins to bow when you say “konnichiwa”.', hint: 'Tap a Nubbin and say こんにちは a few times. Nubbins learn by copying you.' },
      'lj1-step3': { goal: 'Say “oyasumi” (good night) to everyone before bed.', hint: 'At dusk, tap each Nubbin, Nova and Hana, and say おやすみ.' },
    },
    scenes: LJ1_SCENES,
    glossary: [
      gloss('こんにちは (konnichiwa)', 'Hello, or good afternoon.', 'lj1-s1'),
      gloss('おじぎ (ojigi)', 'Bowing. People in Japan bow to greet, thank and say sorry; a deeper bow shows more respect.', 'lj1-s1'),
      gloss('はじめまして (hajimemashite)', 'Nice to meet you. Only said the first time you meet someone.', 'lj1-s1'),
      gloss('わたしは ___ です (watashi wa ___ desu)', 'I am ___. Put your name in the gap.', 'lj1-s1'),
      gloss('よろしくおねがいします (yoroshiku onegaishimasu)', 'Please treat me kindly, or pleased to meet you. A polite thing to say after your name.', 'lj1-s1'),
      gloss('はい (hai)', 'Yes.', 'lj1-s1'),
      gloss('いいえ (iie)', 'No.', 'lj1-s1-done'),
      gloss('おはよう (ohayō)', 'Good morning, to family and friends.', 'lj1-s2'),
      gloss('おはようございます (ohayō gozaimasu)', 'Good morning, the polite way.', 'lj1-s2'),
      gloss('ありがとう (arigatō)', 'Thank you.', 'lj1-s2'),
      gloss('ありがとうございます (arigatō gozaimasu)', 'Thank you, the polite way.', 'lj1-s2'),
      gloss('ごめんなさい (gomen nasai)', 'I’m sorry.', 'lj1-s2'),
      gloss('すみません (sumimasen)', 'Excuse me, or sorry.', 'lj1-s2'),
      gloss('polite', 'Showing good manners and respect to someone, often with special words.', 'lj1-s2'),
      gloss('こんばんは (konbanwa)', 'Good evening.', 'lj1-s3'),
      gloss('さようなら (sayōnara)', 'Goodbye, when you won’t see someone for a while.', 'lj1-s3'),
      gloss('またね (mata ne)', 'See you.', 'lj1-s3'),
      gloss('おやすみ (oyasumi)', 'Good night, the friendly way.', 'lj1-s3'),
      gloss('おやすみなさい (oyasuminasai)', 'Good night, the polite way.', 'lj1-s3'),
    ],
    notes: 'Politeness notes stay within the brief: friendly forms for family and friends, polite forms for grown-ups and people you don’t know well. The bowing facts are the brief’s only. Day and night (lj1-s3-done) is a well-established fact.',
  },
  {
    id: 'reader:lj2',
    of: 'lj2',
    band: 'reader',
    title: 'The Hiragana Pond',
    goals: {
      'lj2-step1': { goal: 'Find あ い う え お on the stepping stones, in order, and trace each one.', hint: 'Start with あ, nearest the bank. Follow the numbered strokes on each stone.' },
      'lj2-step2': { goal: 'Trace か き く け こ in the sand.', hint: 'Follow the numbered strokes, in order. Top to bottom, left to right, mostly.' },
      'lj2-step3': { goal: 'Write はな, Hana’s name, on her sketchbook.', hint: 'は first, then な. You can write across or down.' },
    },
    scenes: LJ2_SCENES,
    glossary: [
      gloss('hiragana', 'One of the three ways of writing Japanese, used for Japanese words and grammar. It has 46 basic characters.', 'lj2-s1'),
      gloss('うえ (ue)', 'Up, or above.', 'lj2-s1'),
      gloss('いえ (ie)', 'House.', 'lj2-s1'),
      gloss('あお (ao)', 'Blue.', 'lj2-s1'),
      gloss('stroke order', 'The order and direction you draw the lines of a letter.', 'lj2-s2'),
      gloss('いけ (ike)', 'Pond.', 'lj2-s2'),
      gloss('かお (kao)', 'Face.', 'lj2-s2'),
      gloss('あか (aka)', 'Red.', 'lj2-s2'),
      gloss('はな (hana)', 'Flower. Also Hana’s name. In kanji: 花.', 'lj2-s3'),
      gloss('katakana', 'A Japanese script used mostly for words borrowed from other languages, like ピンク (pinku, pink).', 'lj2-s3'),
      gloss('kanji', 'Characters that came from Chinese and carry meaning, like 花 (flower).', 'lj2-s3'),
    ],
    notes: 'Every LJ2 word uses only the 12 kana taught in LJ2. Stroke-order notes say only “top to bottom, left to right, mostly”; stroke counts are given for く (1) and こ (2) in the scene text, matching the base.',
  },
  {
    id: 'reader:lj3',
    of: 'lj3',
    band: 'reader',
    title: 'Counting Koi',
    goals: {
      'lj3-step1': { goal: 'Count the new koi into the pond in Japanese, from いち to じゅう.', hint: 'Tap each fish as it swims in and say its number. After ご, copy Hana.' },
      'lj3-step2': { goal: 'Race Hana round the pond, counting the laps in Japanese.', hint: 'Say each lap number as you pass the lap counter. Use よん, なな and きゅう.' },
      'lj3-step3': { goal: 'Count ten stars in Japanese, then find the moon.', hint: 'Go up the hill after dark. Planes don’t count. The moon is low, behind the plum trees.' },
    },
    scenes: LJ3_SCENES,
    glossary: [
      gloss('こい (koi)', 'A kind of carp, a pond fish. English borrowed the word from Japanese.', 'lj3-s1'),
      gloss('いち, に, さん, よん, ご (ichi, ni, san, yon, go)', 'One, two, three, four, five.', 'lj3-s1'),
      gloss('ろく, なな, はち, きゅう, じゅう (roku, nana, hachi, kyū, jū)', 'Six, seven, eight, nine, ten.', 'lj3-s1-done'),
      gloss('一 二 三', 'The kanji for one, two and three: one, two and three lines.', 'lj3-s2'),
      gloss('さかな (sakana)', 'Fish. Any fish; koi are one kind.', 'lj3-s2'),
      gloss('し, しち, く (shi, shichi, ku)', 'Other ways to say four, seven and nine. Counting games use よん, なな and きゅう.', 'lj3-s2'),
      gloss('ほし (hoshi)', 'Star.', 'lj3-s3'),
      gloss('つき (tsuki)', 'Moon.', 'lj3-s3'),
    ],
    notes: 'Counting uses yon, nana and kyū, per the brief; shi, shichi and ku are named but never used for counting. No reason is given for the two readings (none is in the brief).',
  },
  {
    id: 'reader:lj4',
    of: 'lj4',
    band: 'reader',
    title: 'Colours and Lunchboxes',
    goals: {
      'lj4-step1': { goal: 'Pack an おべんとう (obentō) with Hana, by colour.', hint: 'Put each food in its own section and say its colour in Japanese. Keep Dumpling out of the box.' },
      'lj4-step2': { goal: 'Say いただきます before the picnic and ごちそうさま after.', hint: 'Hands together, a little bow. Wait until everyone is ready.' },
      'lj4-step3': { goal: 'Draw three fruits for Hana’s sketchbook.', hint: 'Pick any three: いちご, もも, りんご, みかん or Fern’s plums.' },
    },
    scenes: LJ4_SCENES,
    glossary: [
      gloss('おべんとう (obentō)', 'A packed lunch box.', 'lj4-s1'),
      gloss('おにぎり (onigiri)', 'A rice ball.', 'lj4-s1'),
      gloss('しろ, くろ, きいろ, みどり (shiro, kuro, kiiro, midori)', 'White, black, yellow, green.', 'lj4-s1'),
      gloss('quarter', 'One of four equal parts of something.', 'lj4-s1-done'),
      gloss('いただきます (itadakimasu)', 'Said before eating.', 'lj4-s2'),
      gloss('ごちそうさま (gochisōsama)', 'Said after eating.', 'lj4-s2'),
      gloss('りんご (ringo)', 'Apple.', 'lj4-s2'),
      gloss('みかん (mikan)', 'A mandarin orange.', 'lj4-s2'),
      gloss('おちゃ (ocha)', 'Tea.', 'lj4-s2'),
      gloss('オレンジ (orenji)', 'Orange, the colour. Written in katakana because it is a borrowed word.', 'lj4-s2'),
      gloss('いちご (ichigo)', 'Strawberry.', 'lj4-s3'),
      gloss('もも (momo)', 'Peach.', 'lj4-s3'),
      gloss('ピンク (pinku)', 'Pink. Written in katakana because it is a borrowed word.', 'lj4-s3'),
      gloss('むらさき (murasaki)', 'Purple.', 'lj4-s3'),
    ],
    notes: 'Itadakimasu and gochisōsama are glossed only as “said before eating” and “said after eating”, as the brief gives them; the think question invites the child’s own reasons without supplying a translation.',
  },
  {
    id: 'reader:lj5',
    of: 'lj5',
    band: 'reader',
    title: 'Obāchan’s Letters',
    goals: {
      'lj5-step1': { goal: 'Read one of Obāchan’s letters with Hana.', hint: 'Tap the letter on the kitchen table. Tap any Japanese word to hear it.' },
      'lj5-step2': { goal: 'Draw a family picture and label it in Japanese.', hint: 'Draw anyone who is family to you. Use おかあさん, おとうさん, おばあちゃん, おじいちゃん, ともだち, or a name.' },
      'lj5-step3': { goal: 'Tell Hana how each Nubbin feels, in Japanese.', hint: 'Look at each face. Choose うれしい, かなしい, たのしい, こわい or ねむい.' },
    },
    scenes: LJ5_SCENES,
    glossary: [
      gloss('おばあちゃん (obāchan)', 'Grandma. Hold the long “aa”: おばちゃん (obachan) means auntie.', 'lj5-s1'),
      gloss('おじいちゃん (ojiichan)', 'Grandpa.', 'lj5-s1'),
      gloss('ねこ, いぬ, とり (neko, inu, tori)', 'Cat, dog, bird.', 'lj5-s1'),
      gloss('ともだち (tomodachi)', 'Friend.', 'lj5-s1'),
      gloss('かぞく (kazoku)', 'Family.', 'lj5-s2'),
      gloss('おかあさん (okāsan)', 'Mother.', 'lj5-s2'),
      gloss('おとうさん (otōsan)', 'Father.', 'lj5-s2'),
      gloss('うさぎ (usagi)', 'Rabbit.', 'lj5-s2'),
      gloss('ふくろう (fukurō)', 'Owl.', 'lj5-s2'),
      gloss('nocturnal', 'Awake and active at night, and resting in the day.', 'lj5-s2-done'),
      gloss('うれしい, かなしい, たのしい (ureshii, kanashii, tanoshii)', 'Happy, sad, fun.', 'lj5-s3'),
      gloss('ねむい (nemui)', 'Sleepy.', 'lj5-s3'),
      gloss('こわい (kowai)', 'Scary, or scared.', 'lj5-s3'),
      gloss('かえる (kaeru)', 'Frog.', 'lj5-s3'),
      gloss('tadpole', 'A young frog that lives in water, swims with a tail and breathes with gills.', 'lj5-s3-done'),
    ],
    notes: 'Families vary: the drawing lesson never assumes a mum, dad or grandparents, and names count as labels. Ojiichan’s death is stated plainly, as EDU-STYLE asks. Hazel is past tense only.',
  },
  {
    id: 'reader:lj6',
    of: 'lj6',
    band: 'reader',
    title: 'Floating Lanterns',
    goals: {
      'lj6-step1': { goal: 'Ask Hana why she is sitting by the stream.', hint: 'Hana is sitting by the stream. Tap her and choose Talk.' },
      'lj6-step2': { goal: 'Help Hana make ojiichan’s lantern, and make one of your own if you like.', hint: 'Use a wooden base so it floats. Write any name, in any language. Hana can help with hiragana.' },
      'lj6-step3': { goal: 'Float ojiichan’s lantern with Hana at dusk. Later, join her review party.', hint: 'Luna lights the lanterns. Set yours on the water gently, or just watch. The party is back at the cottage.' },
    },
    scenes: LJ6_SCENES,
    glossary: [
      gloss('おぼん (Obon)', 'A summer time in Japan when families remember relatives who have died.', 'lj6-s1'),
      gloss('とうろうながし (tōrō nagashi)', 'Floating paper lanterns on a river, often at the end of Obon. Customs differ from place to place.', 'lj6-s1'),
      gloss('かわ (kawa)', 'River. In kanji: 川.', 'lj6-s1'),
      gloss('ひかり (hikari)', 'Light.', 'lj6-s1'),
      gloss('き (ki)', 'Tree. In kanji: 木.', 'lj6-s2'),
      gloss('やま (yama)', 'Mountain. In kanji: 山.', 'lj6-s2'),
      gloss('みず (mizu)', 'Water.', 'lj6-s2'),
      gloss('あめ (ame)', 'Rain.', 'lj6-s3'),
      gloss('ゆき (yuki)', 'Snow.', 'lj6-s3'),
    ],
    notes: 'Obon and tōrō nagashi are described only with the brief’s facts; no religious detail. The floating is Hana’s family’s custom for her ojiichan, which she invites the player to share: it is never a game, a count or a reward, and the counting lesson happens later, at the party, with Nubbins. Grief is plain and gentle. No lantern is made for Hazel, and nothing says whether she is alive.',
  },
];

export const CHECKS: string[] = [
  'edu:bow:konnichiwa',
  'edu:chant:ja:bowing-song',
  'edu:find:ja:vowels',
  'edu:trace:ja:ka-row',
  'edu:write:ja:hana',
  'edu:count:ja:koi:5',
  'edu:count:ja:hoshi:10',
  'edu:chant:ja:koi-chant',
  'edu:sort:ja:bento:colour',
  'edu:say:ja:itadakimasu',
  'edu:quiz:ja:colours',
  'edu:draw:ja:kazoku',
  'edu:quiz:ja:feelings',
  'edu:count:ja:nubbins:10',
  'edu:review:ja:party',
];
