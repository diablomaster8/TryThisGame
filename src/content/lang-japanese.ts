/**
 * The Learning Grove's Japanese questline: "Hana’s Hiragana" (LJ1–LJ6). Learning Grove only.
 *
 *   LJ1 Konnichiwa, Hana!        greetings, bowing, polite and friendly forms
 *   LJ2 The Hiragana Pond        あ い う え お, か き く け こ, は, な; the three scripts
 *   LJ3 Counting Koi             ichi to jū, 一 二 三, stars and the moon
 *   LJ4 Colours and Lunchboxes   colours, fruit, the obentō, itadakimasu and gochisōsama
 *   LJ5 Obāchan’s Letters        family, animals, feelings
 *   LJ6 Floating Lanterns        Obon; Hana’s family’s tōrō nagashi for her ojiichan; nature words; the review party
 *
 * Hana is ten. She lives in Japan and is staying with Nova for the summer. She draws everything,
 * runs fast and is very competitive about it, and pretends not to be scared of frogs. Her
 * grandma used to write to Hazel. Hazel appears only as someone who wrote letters, in the past
 * tense; nothing here says where she is or whether she is alive.
 *
 * Running gags: Dumpling, a round Nubbin who copies whatever Hana does, badly (late, facing the
 * wrong way, in the wrong order). He bows to a thing only once, to the moon in lj1-s3-done; it is
 * never a habit. Hana and frogs (“I am not scared of frogs”), which pays off in LJ5 and
 * LJ6; and Hana calling every race she loses “a practice one”.
 *
 * Original songs: the Bowing Song (lj1-complete) and the Koi Chant (lj3-complete).
 *
 * Words: ONLY the vetted list in the languages brief, spelled exactly. Each word is written
 * native script first, then (romanisation, “meaning”) the first time it appears. New words per
 * scene never exceed six. Every word comes back at least three times; LJ6 reviews them all.
 *
 * Every quest: audience 'all', trigger.where 'Learning Grove only', sets only its own lj<n>Done.
 * Choices set no flags. No campaign flags, no campaign secrets.
 */
import type { Line, Mood } from '../config/story';
import type { LanguageCourse, Quest, ScriptChar, Speaker, VocabItem } from './types';

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- campaign speakers
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

// ---------------------------------------------------------------- new speaker
/** Hana (はな, 花, “flower”), aged 10. Declared on every quest in this file. */
const HANA: Speaker = { id: 'hana', name: 'Hana', kind: 'other' };
const HA = say('hana');

const SOURCE = 'Original: a beginner Japanese questline for the Learning Grove';

const COMMON_NOTES = [
  'Learning Grove only: never offer this quest in the main game.',
  'Fonts: Noto Sans JP (or similar) for every line with kana or kanji; make sure kana and kanji render at the same size as the English around them. Mark Japanese text lang="ja" so kanji such as 雪 get Japanese glyph shapes, not a Chinese fallback font. For tracing and the big painted kana, use a textbook-style (kyōkasho) font such as Klee One, whose strokes match handwriting; sans-serif fonts join some strokes (き).',
  'Japanese is written left to right here, so no bidi handling is needed (unlike the Hebrew questline). Never break a line inside a Japanese word: browsers will otherwise break between any two kana, so wrap each Japanese word or phrase in a no-wrap span (or use word-break: keep-all). The spaces in わたしは はな です are deliberate learner spacing; keep them. For the column choice in LJ2 step 3 use writing-mode: vertical-rl (columns read right to left). Kanji always appear beside their kana here; if a kanji is ever shown alone (e.g. VocabItem.plain), add furigana with <ruby>.',
  'Audio: every word in JAPANESE_COURSE.vocab needs a native-speaker recording (clip id in VocabItem.audio). Do not use TTS.',
  'Tracing mini-games: draw the stroke order for each kana, one stroke at a time, numbered, before the child traces it.',
  'Nubbins who “learn” a word react to it: they bow at こんにちは and in later quests at any word they have learned.',
  'Dumpling is any round Nubbin in the Grove nicknamed by Fern for these quests; pick one the player has not named, or spawn a visiting one.',
].join(' ');

// ================================================================== LJ1
const LJ1: Quest = {
  id: 'lj1',
  code: 'LJ1',
  title: 'Konnichiwa, Hana!',
  source: SOURCE,
  audience: 'all',
  trigger: {
    where: 'Learning Grove only',
    when: 'A summer morning once the Learning Grove is on: Nova arrives at the gate with Hana.',
  },
  speakers: [HANA],
  steps: [
    {
      id: 'lj1-step1',
      goal: 'Greet Hana at the gate in Japanese.',
      hint: 'Tap Hana and choose Greet. Say “konnichiwa”, and bow if you like.',
      check: 'lang:ja:greet:hana',
      scene: {
        id: 'lj1-s1',
        lines: [
          N('The gate sticks, as it always does. From the other side, someone lifts and pushes, hard, and it bangs open.'),
          N('A girl in running shoes skids through first, a sketchbook under one arm. Nova follows at a walk, carrying both bags.'),
          NO('This is Hana. She’s staying with me for the summer. She raced me from the bridge.', 'happy'),
          HA('I won by eleven seconds. Nova says nine. Nova is wrong.'),
          HA('こんにちは (konnichiwa, “hello”)!'),
          N('She bows: a small, quick dip from the waist, then straight back up.'),
          HA('That’s おじぎ (ojigi), bowing. At home we bow to greet, to thank and to say sorry. A deeper bow shows more respect.'),
          HA('はじめまして (hajimemashite, “nice to meet you”). You only say it the first time you meet someone. One go. No pressure.'),
          HA('わたしは はな です (watashi wa Hana desu, “I am Hana”). Your own name goes in the middle, like a sandwich.'),
          HA('Then finish with よろしくおねがいします (yoroshiku onegaishimasu). It means “please treat me kindly”, or “pleased to meet you”.'),
          NO('I practised that one all the way here on the train.', 'happy'),
          HA('She said it to the ticket man, a cow and a postbox.'),
          HA('Ready? Say はい (hai, “yes”). It’s the only answer today, so you can’t get it wrong.', 'happy'),
        ],
        choices: [
          {
            id: 'bow',
            label: 'Bow and say “konnichiwa”.',
            then: [
              N('You bow. Hana bows back, slightly deeper, which she seems to think means she won.'),
              HA('はい! Perfect. You meant that one.', 'happy'),
            ],
          },
          {
            id: 'wave',
            label: 'Wave and say “konnichiwa”.',
            then: [
              HA('A wave works too. Friends wave all the time.'),
              HA('Next time, add a tiny bow. Like this. See? Easy.', 'happy'),
            ],
          },
          {
            id: 'full',
            label: 'Try the lot: “Hajimemashite. Watashi wa… desu. Yoroshiku onegaishimasu.”',
            then: [
              HA('You did the whole sandwich!', 'shock'),
              HA('It took Nova three days to get that right.'),
              NO('Two days.'),
              HA('No. Three.', 'happy'),
            ],
          },
        ],
      },
      done: {
        id: 'lj1-s1-done',
        lines: [
          N('Hana is already drawing you. She drew Nova, the gate and a passing bee while you were saying hello.'),
          HA('Done. Your nose is very good. Your ears are a bit much. That’s my fault, not yours.'),
          N('Behind the water butt, three wild Nubbins have watched the whole thing. One tries a bow, tips forward and rolls into the herbs.'),
          HA('They want to learn! Tomorrow we teach them. Properly.', 'happy'),
          HA('Also, is that a frog?', 'think'),
          NO('Are you scared of frogs, Hana?'),
          HA('いいえ (iie, “no”)! Not even slightly. I’m just saying. In case it comes up.', 'think'),
        ],
      },
    },
    {
      id: 'lj1-step2',
      goal: 'Teach three Nubbins to bow when you say “konnichiwa”.',
      hint: 'Tap a Nubbin, choose Say, then “konnichiwa”. Do it a few times; Nubbins learn by copying.',
      check: 'lang:ja:teach:nubbins:konnichiwa:3',
      scene: {
        id: 'lj1-s2',
        lines: [
          N('Morning. Dew on everything. Hana was up before you, and mentions it twice.'),
          HA('おはよう (ohayō, “good morning”)! That’s for friends and family.', 'happy'),
          N('Fern comes over the fence with a bucket of plums and a slightly crumpled face.'),
          HA('おはようございます (ohayō gozaimasu), Fern! That’s the polite one. For grown-ups, teachers and people with buckets.'),
          FE('Is it? Well. Good morning. Have a plum. I’ve been up since five keeping the trees alive, badly.'),
          HA('ありがとうございます (arigatō gozaimasu, “thank you”, the polite way). With friends it’s just ありがとう (arigatō).'),
          HA('Right. The plan. When I say こんにちは, the Nubbins bow. Three Nubbins, three bows.'),
          N('She sprints at the herb bed, misjudges it, and bumps a small round Nubbin clean off its feet.'),
          HA('ごめんなさい (gomen nasai, “I’m sorry”)! Sorry, sorry!', 'shock'),
          N('She bows low to the Nubbin, because she means it. The Nubbin blinks, copies her, and lands on its face.'),
          FE('That one’s Dumpling. He eats things. Bows aren’t food, Dumpling.'),
          HA('But that was a good おじぎ. Very sincere.', 'happy'),
          HA('すみません (sumimasen, “excuse me”), everybody. Can you come a bit closer? That’s how you ask nicely.'),
          HA('Who shall we start with?'),
        ],
        choices: [
          {
            id: 'shy',
            label: 'The shy one under the bench.',
            then: [
              N('You crouch and say こんにちは, very softly. The shy one peeks out and dips its head the smallest amount.'),
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
              N('You say こんにちは. The sleepy one bows, very slowly, and does not come back up for some time.'),
              HA('Is it still bowing? Or asleep?', 'think'),
              FE('Bit of both.'),
            ],
          },
        ],
      },
      done: {
        id: 'lj1-s2-done',
        lines: [
          N('Three Nubbins in a row. You say こんにちは. Three small bows, nearly together.'),
          HA('ありがとう, everyone! That was beautiful. I’m drawing it.', 'happy'),
          N('A fourth bow, from the end of the row: Dumpling, late, copying the others and facing the wrong way.'),
          HA('Other way, Dumpling.'),
          N('Dumpling turns round, bows again, bumps into the water butt, and looks extremely satisfied.'),
        ],
      },
    },
    {
      id: 'lj1-step3',
      goal: 'Say “oyasumi” (good night) to everyone before bed.',
      hint: 'At dusk, tap each Nubbin, Nova and Hana and choose Say, then “oyasumi”.',
      check: 'lang:ja:say:oyasumi',
      scene: {
        id: 'lj1-s3',
        lines: [
          N('Evening. The light goes gold, then orange, then the colour of weak tea.'),
          N('Luna comes up the path with a trowel and a jar of moths, on her way to the night garden.'),
          HA('こんばんは (konbanwa, “good evening”), Luna!'),
          LU('Konbanwa. Did I say it right? Nova taught me last summer. I’ve been saving it.', 'soft'),
          HA('Perfect. Fun fact: the last letter of こんばんは and こんにちは looks like “ha” but says “wa”. Japanese keeps you on your toes.'),
          FE('I’m off to bed. Goodbye, all.'),
          HA('Not さようなら (sayōnara)! That’s goodbye for a while. You’ll see us in the morning.'),
          HA('Say またね (mata ne, “see you”). Or, at bedtime, おやすみ (oyasumi, “good night”).'),
          FE('Mata ne, then. Oyasumi.', 'happy'),
          HA('For grown-ups you want to be extra nice to, it’s おやすみなさい (oyasuminasai). The polite one is longer. It usually is.'),
          HA('Now you. Everybody gets an oyasumi before bed. Nubbins, Nova, Dumpling, me. That’s the rule.'),
          N('Dumpling is already asleep, upright, in the herb bed.'),
        ],
        choices: [
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
              NO('Oyasuminasai. The polite one! I feel very grand.', 'happy'),
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
      },
      done: {
        id: 'lj1-s3-done',
        lines: [
          N('You say oyasumi to everyone. Even the herb bed, just in case.'),
          NO('おやすみなさい. You’re better at this than I was after a week.', 'soft'),
          N('Dumpling bows to the moon. The moon does not bow back, but it seems to appreciate it.'),
          N('Hana is asleep on the bench with her pencil still moving, drawing a line off the edge of the page.'),
        ],
      },
    },
  ],
  complete: {
    id: 'lj1-complete',
    lines: [
      N('Next morning a paper lantern hangs on the gate. Nova painted it last night, in wobbly brush letters: こんにちは.'),
      NO('A welcome sign. For everyone who comes through, whatever they speak.', 'happy'),
      HA('I made up a song on the train. An おじぎ song. Bow at the end of every line.'),
      HA('おはよう (ohayō), up comes the sun! こんにちは (konnichiwa), hello, everyone!'),
      HA('ありがとう (arigatō), thanks for the fun! こんばんは (konbanwa), the day is done!'),
      HA('おやすみ (oyasumi), down goes the light. Bow, bow, and say good night!'),
      N('Three Nubbins bow at the end of every line. Dumpling bows one line late every time, and has to lie down afterwards.'),
      HA('はい. You can bow now. Properly. I’m giving you that.', 'happy'),
      FE('Is there a polite version of the song?', 'think'),
      HA('いいえ. It’s already perfect.'),
    ],
  },
  rewards: [
    {
      id: 'lj1-lantern-sign',
      kind: 'decor',
      label: 'Paper-lantern welcome sign',
      description: 'A paper lantern for the gate, painted with こんにちは (konnichiwa, “hello”). Nubbins who pass it give a little bow.',
    },
    {
      id: 'lj1-bow-emote',
      kind: 'cosmetic',
      label: 'Bow emote',
      description: 'Your Keeper bows. Any Nubbin that has learned “konnichiwa” bows back.',
    },
  ],
  sets: { lj1Done: true },
  notes: [
    COMMON_NOTES,
    'New words: step 1 konnichiwa, ojigi, hajimemashite, watashi wa ___ desu, yoroshiku onegaishimasu, hai (iie waits for the done scene, so no scene brings more than six); step 2 ohayō, ohayō gozaimasu, arigatō, arigatō gozaimasu, gomen nasai, sumimasen; step 3 konbanwa, sayōnara, mata ne, oyasumi, oyasuminasai.',
    'Step 1: the Greet action offers “konnichiwa” (with or without a bow) and, after the full choice, the whole “Hajimemashite. Watashi wa [player name] desu. Yoroshiku onegaishimasu.” Play the native recordings as the player picks.',
    'Step 2: a Nubbin learns after hearing konnichiwa three times; it bows whenever it hears it from then on. Dumpling copies the others badly (late, facing the wrong way). He bows to an object only once in the questline, to the moon in lj1-s3-done; never make it a habit.',
    'Step 3 is at dusk. Each oyasumi gets a sleepy bow; Dumpling snores.',
    'The Bowing Song is original. Sing it to a simple four-beat tune; the Nubbins bow on the last beat of each line.',
  ].join(' '),
};

// ================================================================== LJ2
const LJ2: Quest = {
  id: 'lj2',
  code: 'LJ2',
  title: 'The Hiragana Pond',
  source: SOURCE,
  audience: 'all',
  trigger: {
    where: 'Learning Grove only',
    when: 'The morning after LJ1: Hana has been painting on the stepping stones in the pond.',
  },
  requires: ['LJ1'],
  speakers: [HANA],
  steps: [
    {
      id: 'lj2-step1',
      goal: 'Find あ い う え お on the stepping stones, in order, and trace each one.',
      hint: 'Look across the pond for painted stones. Start with あ, nearest the bank, and follow its numbered strokes.',
      check: 'lang:ja:find:kana:vowels',
      scene: {
        id: 'lj2-s1',
        lines: [
          N('Hana has been up since dawn, painting the flat stones in the pond. Marina watches, the way she watches anyone touching water.'),
          MA('She asked you first. Mostly.'),
          HA('These are hiragana, one of the ways we write Japanese. There are forty-six basic ones.', 'happy'),
          HA('Today we need five: あ い う え お. Say them a, i, u, e, o. Like “ah, ee, oo, eh, oh”.'),
          HA('They come first in the hiragana chart. Nearly every other hiragana ends in one of those five sounds.'),
          N('She has hidden the five painted stones among plain ones, all the way across. Some face up. Some are sideways.'),
          HA('Find them in order, あ first. Step on the wrong stone and you have to say “sorry, stone”.'),
          HA('Then we spell words. うえ (ue) means “up”. いえ (ie) means “house”. あお (ao) means “blue”.'),
          MA('And if somebody falls in?', 'think'),
          HA('Nobody falls in. I’m very fast.'),
          N('On the お stone sits a frog. It is fat, wet and completely uninterested in hiragana.'),
          HA('That’s fine. That is a normal frog and I am being normal about it.', 'think'),
        ],
      },
      done: {
        id: 'lj2-s1-done',
        lines: [
          N('あ, い, う, え, お. You hop across in order. On the お stone, the frog moves exactly one centimetre.'),
          HA('Now spell うえ. Up!'),
          N('You jump onto う, then え, then up onto the bank. Hana claps.'),
          HA('いえ next, then あお. And nobody mention the frog.', 'happy'),
          MA('Nobody mentioned the frog.'),
        ],
      },
    },
    {
      id: 'lj2-step2',
      goal: 'Trace か き く け こ in the sand by the pond.',
      hint: 'Tap the sand patch. Follow the numbered strokes in order; there is no rush.',
      check: 'lang:ja:trace:ka-row',
      scene: {
        id: 'lj2-s2',
        lines: [
          N('Dusty has raked a patch of sand flat by the pond. They lean on the rake like it’s an old friend.'),
          DU('Smooth as I can get it. There was a spoon under here. And another spoon. I don’t know whose spoons these are.'),
          HA('Now we put a “k” in front of the five. You get か き く け こ. Ka, ki, ku, ke, ko.'),
          HA('Every hiragana has its strokes in the same order, every time. Mostly top to bottom, left to right.'),
          N('She traces く with one finger: a single stroke, like a bird’s beak. Then こ: two short lines, one above the other.'),
          HA('く is one stroke. こ is two. か has a little dash off to one side, like it’s waving.'),
          HA('Words! いけ (ike) is “pond”, like this one. かお (kao) is “face”. あか (aka) is “red”.'),
          DU('So I’ve been raking next to an いけ all morning and didn’t know it.', 'happy'),
          N('The frog from the お stone has followed you. It sits in the middle of the sand, exactly where く should go.'),
          HA('It’s not in the way. I’ll just write round it. Frogs are fine. It’s fine.', 'think'),
        ],
        choices: [
          {
            id: 'scoop',
            label: 'Gently move the frog back to the pond.',
            then: [
              N('You scoop it up in both hands and set it at the water’s edge. Hana breathes out, quietly.'),
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
      },
      done: {
        id: 'lj2-s2-done',
        lines: [
          N('か き く け こ, in a neat row in the sand. Dusty steps back to admire it and treads on the け.'),
          DU('Sorry. ごめんなさい. I’ll rake it.'),
          HA('Now write かお, and I’ll put a face in it.'),
          N('She draws two eyes in the お and a smile under the か. It looks a lot like Dusty.'),
          DU('That’s me, isn’t it.', 'shock'),
        ],
      },
    },
    {
      id: 'lj2-step3',
      goal: 'Write はな (Hana) on Hana’s sketchbook.',
      hint: 'Open the sketchbook and trace は, then な. You can write across or down.',
      check: 'lang:ja:write:hana',
      scene: {
        id: 'lj2-s3',
        lines: [
          N('Hana lays her sketchbook open on the grass. The first page is blank, which, for Hana, is extremely rare.'),
          HA('Last two for today: は (ha) and な (na). Put them together: はな. That’s me. Hana.', 'happy'),
          HA('はな also means “flower”. I prefer to think the flowers were named after me.'),
          HA('There’s another way to write it: 花. That’s kanji. Kanji came from Chinese writing, and each one carries a meaning.'),
          HA('So Japanese has three scripts. Hiragana, like はな. Kanji, like 花. And katakana, mostly for words borrowed from other languages.'),
          HA('Like ピンク (pinku). Say it.'),
          N('You say it. It sounds a lot like “pink”.'),
          HA('Exactly. Japanese borrowed it, and it came out a bit different.'),
          HA('And は is sneaky. Mostly it says “ha”. But in わたしは it says “wa”, because it’s pointing at who the sentence is about.'),
          HA('Write はな on my sketchbook. Big. You can go across in a row, or down in a column. Japanese can do both.'),
        ],
        choices: [
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
              HA('Very fancy. When a page is in columns, you read them from right to left.', 'happy'),
            ],
          },
        ],
      },
      done: {
        id: 'lj2-s3-done',
        lines: [
          N('はな, in your best handwriting. The な has a slightly wobbly loop. Hana studies it for a long time.'),
          HA('That’s the first time anyone here has written my name the way my family writes it.', 'soft'),
          HA('I’m keeping this page forever. I won’t even draw on it. Much.'),
          N('The frog hops onto the sketchbook and sits on the は. Hana makes a very small noise that is definitely not a scream.'),
        ],
      },
    },
  ],
  complete: {
    id: 'lj2-complete',
    lines: [
      N('Marina has helped Hana paint the rest of the stones. Twelve kana cross the pond now, and a Nubbin waits on the bank.'),
      HA('Quick-fire! I call a word, the Nubbin hops on the letters. Go! うえ!'),
      N('う, え. The Nubbin hops twice and points up.'),
      HA('いえ! いけ!'),
      N('A house, a pond. The Nubbin points at your cottage, then at the pond, very pleased with itself.'),
      HA('かお! あか! あお!'),
      N('Face, red, blue. The Nubbin pulls a face, goes pink in the cheeks, then sits down, overwhelmed.'),
      HA('Last one: はな.'),
      MA('I’d keep the stones. Better than plain ones.', 'happy'),
      HA('Hiragana stepping stones! Now anyone who crosses this pond is reading Japanese, whether they like it or not.', 'happy'),
    ],
  },
  rewards: [
    {
      id: 'lj2-hiragana-stones',
      kind: 'decor',
      label: 'Hiragana stepping stones',
      description: 'Twelve stepping stones for the pond, painted あ い う え お, か き く け こ, は and な. Step on them and Hana’s recording says each sound.',
    },
  ],
  sets: { lj2Done: true },
  notes: [
    COMMON_NOTES,
    'Kana taught: あ い う え お (step 1), か き く け こ (step 2), は な (step 3); see JAPANESE_COURSE.script. Words: ue, ie, ao (step 1); ike, kao, aka (step 2); hana, 花, the three scripts, ピンク as a katakana example (step 3). Every LJ2 word is spelled only with kana taught in LJ2.',
    'Step 1: stones are a find-and-hop puzzle, and the child traces each vowel in the tracing mini-game (strokes: あ 3, い 2, う 2, え 2, お 3). Wrong stone: Hana’s “sorry, stone” line plays; no penalty.',
    'Step 2: a tracing mini-game in the sand. Draw the stroke order for each kana, numbered, then let the child trace. Strokes: く 1, こ 2, か 3, け 3, き 4 (some fonts join two of き’s strokes; follow the school stroke order).',
    'Step 3: tracing は and な on the sketchbook page; the choice decides whether the page shows a row or a column. If column, show the reading order right to left.',
    'The frog is the same frog in every scene (art: one fat green frog sprite). Hana is never shown actually upset; it’s comic denial.',
  ].join(' '),
};

// ================================================================== LJ3
const LJ3: Quest = {
  id: 'lj3',
  code: 'LJ3',
  title: 'Counting Koi',
  source: SOURCE,
  audience: 'all',
  trigger: {
    where: 'Learning Grove only',
    when: 'After LJ2: Marina arrives at the pond with two buckets of koi.',
  },
  requires: ['LJ2'],
  speakers: [HANA],
  steps: [
    {
      id: 'lj3-step1',
      goal: 'Count the new koi into the pond in Japanese, from ichi to jū.',
      hint: 'Tap each fish as it swims in, and say the number. Hana calls six to ten first; copy her.',
      check: 'lang:ja:count:fish:10',
      scene: {
        id: 'lj3-s1',
        lines: [
          N('Marina is at the pond with two big buckets. Something inside flashes orange and white.'),
          MA('New fish. A friend upriver had too many. Like people with courgettes.'),
          HA('こい (koi)! They’re koi! I’ve drawn about a thousand of them.', 'happy'),
          HA('You say koi in English too. Same word. Japanese lent it to English.'),
          MA('We count them in, so we know nobody’s missing later. Hana says we’re counting in Japanese.'),
          HA('Hold up your fingers. いち (ichi), one. に (ni), two. さん (san), three.'),
          HA('よん (yon), four. ご (go), five. One whole hand.'),
          N('A koi slides out of the bucket and into the pond. Then another. They do not wait for anyone to be ready.'),
          HA('Quick! いち! に!', 'shock'),
          MA('There are ten. Five in this bucket, five in that one.'),
          HA('After ご, I’ll call the next numbers and you copy me. Don’t blink.'),
        ],
      },
      done: {
        id: 'lj3-s1-done',
        lines: [
          HA('After ご came ろく (roku), six. なな (nana), seven. はち (hachi), eight.'),
          HA('Then きゅう (kyū), nine, and じゅう (jū), ten. Ten koi! Ten fingers! Nobody fell in!', 'happy'),
          MA('A little dramatic. But correct.'),
          N('Ten koi drift in a slow orange circle. Dumpling sits on the bank, counting them with his head.'),
        ],
      },
    },
    {
      id: 'lj3-step2',
      goal: 'Race Hana round the pond, counting the laps in Japanese.',
      hint: 'Open the race from the lap counter. Say each lap number as you pass the post.',
      check: 'lang:ja:minigame:race-count',
      scene: {
        id: 'lj3-s2',
        lines: [
          N('Sparks arrives at speed, the way Sparks arrives everywhere. Pixel follows with a board on a stick.'),
          SP('I HEAR SOMEONE HERE THINKS SHE’S FAST.', 'happy'),
          HA('I don’t think I’m fast. I know I’m fast.'),
          PX('Lap counter. It flips a tile for every lap round the pond. Hana painted the numbers.', 'happy'),
          N('The first three tiles say 一, 二 and 三. One line, two lines, three lines.'),
          HA('Kanji for one, two and three. The easiest kanji in the world. You just count the lines.'),
          BY('I’ll keep the official time. And the official laps. And an official record of who says “it was just a practice”.', 'think'),
          HA('Count the laps out loud, in Japanese. Loser feeds the さかな (sakana, “fish”).'),
          MA('Sakana means any fish. Koi are one kind of sakana.'),
          HA('Some numbers have two names. Four is よん or し (shi). Seven is なな or しち (shichi). Nine is きゅう or く (ku).'),
          HA('For counting games, use yon, nana and kyū. Ready?'),
        ],
        choices: [
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
      },
      done: {
        id: 'lj3-s2-done',
        lines: [
          N('The lap counter clacks. The last tile flips. Everyone lies on the grass, breathing like bellows.'),
          BY('Official laps: counted, in Japanese. Official excuse from Hana: pending.', 'think'),
          HA('That was a practice one. Whoever won.'),
          BY('There it is.'),
          HA('Rematch tomorrow. Now let’s feed the さかな. All of us. Because I’m kind, not because of anything else.', 'happy'),
        ],
      },
    },
    {
      id: 'lj3-step3',
      goal: 'Count ten stars in Japanese with Hana, then find the moon.',
      hint: 'After dark, go up the hill with Luna. Tap a star to count it. The moon is low, behind the plum trees.',
      check: 'lang:ja:count:stars:10',
      scene: {
        id: 'lj3-s3',
        lines: [
          N('Night. Luna has spread a blanket on the hill, away from the cottage lights.'),
          LU('It’s darker up here, so you see more. Give your eyes a few minutes and the sky fills up.', 'soft'),
          HA('ほし (hoshi) means “star”. We count ten, in Japanese. I’ll start, because I’m the guest.'),
          N('One star. Then another near it. Then, as your eyes get used to the dark, lots.'),
          HA('いち… に… さん… Oh, that one’s a plane. That doesn’t count.'),
          LU('And where’s the moon? There should be a moon tonight.', 'think'),
          HA('Moon is つき (tsuki). Find the つき and I’ll draw it. In the dark. By feel.'),
          N('Dumpling has followed you up the hill. He copies Hana: every time she points at a star, he points his whole body at it.'),
          HA('Ten ほし, then the つき. Go.'),
        ],
        choices: [
          {
            id: 'bright',
            label: 'Start with the brightest star.',
            then: [LU('The bright one. Good choice. Easy to find again.', 'soft')],
          },
          {
            id: 'dumpling',
            label: 'Count the ones Dumpling points at.',
            then: [N('Dumpling points. You count. Dumpling points. You count. It is very slow and extremely accurate.')],
          },
        ],
      },
      done: {
        id: 'lj3-s3-done',
        lines: [
          N('いち, に, さん, よん, ご, ろく, なな, はち, きゅう, じゅう. Ten ほし.'),
          N('And there, low behind the plum trees: a thin silver つき.'),
          HA('Found it! Hold still, I’m drawing it.', 'happy'),
          N('Her drawing in the dark has eleven stars and two moons. She says that’s an artistic choice.'),
        ],
      },
    },
  ],
  complete: {
    id: 'lj3-complete',
    lines: [
      N('Morning. Pixel bolts the lap counter to a post by the pond. Marina has named one of the koi, and won’t say what.'),
      HA('Last thing. A counting chant, for feeding the koi. Clap on every number.'),
      HA('いち, に, さん (ichi, ni, san), koi in the pond!'),
      HA('よん, ご (yon, go), round and beyond!'),
      HA('ろく, なな (roku, nana), under the reeds!'),
      HA('はち, きゅう, じゅう (hachi, kyū, jū), and everyone feeds!'),
      N('Ten koi rise to the surface at once. It may be the chant. It may be the food. Byte says it’s the food.'),
      MA('That one’s yours, by the way. The one with a spot like a smudged thumbprint.', 'happy'),
      HA('ありがとうございます, Marina! And おはようございます, which I forgot to say before.', 'happy'),
      HA('A koi for your pond, and a lap counter for my rematch. Tomorrow. And the day after.'),
    ],
  },
  rewards: [
    {
      id: 'lj3-koi',
      kind: 'item',
      label: 'A koi for the pond',
      description: 'An orange-and-white koi with a thumbprint spot. It lives in the Grove pond and rises when someone counts in Japanese nearby.',
    },
    {
      id: 'lj3-lap-counter',
      kind: 'decor',
      label: 'Lap counter',
      description: 'Pixel’s flip-tile lap counter on a post by the pond, with tiles painted 一, 二, 三 and on up. Race round the pond and it counts the laps aloud in Japanese.',
    },
  ],
  sets: { lj3Done: true },
  notes: [
    COMMON_NOTES,
    'New words: step 1 scene koi, ichi, ni, san, yon, go; step 1 done roku, nana, hachi, kyū, jū (Hana calls them out during the counting mini-game and the child repeats, so no scene introduces more than six); step 2 sakana, 一 二 三, and the second names shi, shichi, ku; step 3 hoshi, tsuki.',
    'Counting games use yon, nana and kyū (the brief’s rule). Shi, shichi and ku are named once, in step 2, as other ways to say the same numbers; do not use them in counting audio.',
    'Step 1: ten koi swim in one at a time from two buckets of five. For koi 6–10, play Hana’s recording first, then wait for the child to tap and repeat.',
    'Step 2 race: no fail state. Whatever the result, the done scene plays the same (Hana always calls it “a practice one”). The lap counter tiles show kanji 一 to 十 for laps 1–10.',
    'Step 3: night sky with at least ten tappable stars; a plane blinks across and cannot be counted. Thin crescent moon low in the west behind the plum trees.',
    'The Koi Chant is original. Clap on each number.',
  ].join(' '),
};

// ================================================================== LJ4
const LJ4: Quest = {
  id: 'lj4',
  code: 'LJ4',
  title: 'Colours and Lunchboxes',
  source: SOURCE,
  audience: 'all',
  trigger: {
    where: 'Learning Grove only',
    when: 'After LJ3, on a sunny morning: Hana has an empty lunch box and a plan.',
  },
  requires: ['LJ3'],
  speakers: [HANA],
  steps: [
    {
      id: 'lj4-step1',
      goal: 'Pack an obentō with Hana, by colour.',
      hint: 'Drag each food into the box section of the right colour. Dumpling does not go in the box.',
      check: 'lang:ja:pack:bento:colours',
      scene: {
        id: 'lj4-s1',
        lines: [
          N('Hana is at the kitchen table with an empty box. It has four sections, a lid and an elastic band.'),
          HA('This is an おべんとう (obentō), a packed lunch box. We’re making a picnic, and it has to be pretty, because I’m drawing it after.'),
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
        choices: [
          {
            id: 'beans',
            label: 'The beans.',
            then: [N('You put the beans in. Dumpling eats one. You put another in. He eats that one too. This goes on for a while.')],
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
      },
      done: {
        id: 'lj4-s1-done',
        lines: [
          N('しろ, くろ, きいろ, みどり, あか. The おべんとう looks like a little painted window.'),
          HA('Now the あお cloth. Tie it on top, like ears.', 'happy'),
          N('You lift the lid to check one last time. Dumpling is in the box.'),
          FE('How? HOW? I was looking right at him.', 'shock'),
        ],
      },
    },
    {
      id: 'lj4-step2',
      goal: 'Say “itadakimasu” before the picnic and “gochisōsama” after.',
      hint: 'At the picnic cloth, choose Say before anyone eats, then again when the box is empty.',
      check: 'lang:ja:say:mealtime',
      scene: {
        id: 'lj4-s2',
        lines: [
          N('A picnic by the pond. The blue cloth is spread out. The box is open. Dumpling has been removed from it twice.'),
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
      },
      done: {
        id: 'lj4-s2-done',
        lines: [
          N('“Itadakimasu!” Six voices, one bow, one Nubbin already chewing.'),
          N('Onigiri, beans, tomatoes, egg, a りんご cut in quarters, a みかん peeled in one long curl, cold おちゃ.'),
          HA('Now: ごちそうさま.', 'happy'),
          SP('Gochisōsama! I’m so full I’m too full to run. Don’t tell anyone.', 'happy'),
          HA('I’m telling everyone.'),
        ],
      },
    },
    {
      id: 'lj4-step3',
      goal: 'Draw a picture of three fruits for Hana’s sketchbook.',
      hint: 'Open the sketchbook. Pick three fruits and colour them; Hana will name each in Japanese.',
      check: 'lang:ja:draw:fruit:3',
      scene: {
        id: 'lj4-s3',
        lines: [
          N('Afternoon. Hana opens her sketchbook to a fresh page and hands you her pencils one at a time, like a surgeon.'),
          HA('Draw three fruits for my sketchbook. I’ll draw them too and we’ll see whose is best. It’s not a competition.'),
          NO('It’s a competition.'),
          HA('It’s a bit of a competition.'),
          HA('いちご (ichigo) is “strawberry”. Look: it starts with いち, like “one”, and ends with ご, like “five”. It isn’t one-five. It’s a strawberry.'),
          HA('もも (momo) is “peach”. Peaches are ピンク (pinku), pink. Ish. Don’t argue.'),
          FE('And my plums. They’re purple.', 'happy'),
          HA('むらさき (murasaki), purple. My favourite word today. Say it fast: murasaki, murasaki, murasaki.'),
          N('Dumpling is sitting very still in the middle of the fruit bowl, hoping to be drawn.'),
          HA('What are you drawing first?'),
        ],
        choices: [
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
      },
      done: {
        id: 'lj4-s3-done',
        lines: [
          N('Three fruits on the page. Hana’s three next to them. Hers are better. Yours are more cheerful.'),
          HA('Yours have more feelings in them. I’m putting them at the front.', 'happy'),
          N('In the corner of the page is a fourth thing, small, round and smudged. Dumpling has sat on the pencils.'),
          HA('He drew himself. Fine. He’s in.'),
        ],
      },
    },
  ],
  complete: {
    id: 'lj4-complete',
    lines: [
      N('Hana lays painted cards on the grass, one for every colour. Dumpling sits at the start line.'),
      HA('Colour game! I say a colour, Dumpling sits on the right card. If he gets it wrong, we cheer anyway.'),
      HA('あか! きいろ! みどり!'),
      N('Red, yellow, green. Dumpling hops, hops, hops.'),
      HA('しろ! くろ! むらさき! ピンク! オレンジ!'),
      N('He hesitates on purple, then sits on it so hard it creases. Pink, orange, done.'),
      HA('And あお!'),
      N('Dumpling sits on the blue card, then lies down on it, finished for the day.'),
      HA('The おべんとう box is yours. Pack it, take it to a sad Nubbin, have a picnic. It works every time.', 'happy'),
      HA('And your own sketchbook. Draw everything. Especially frogs. Not that I’m scared of them. I just don’t draw them.'),
    ],
  },
  rewards: [
    {
      id: 'lj4-bento-box',
      kind: 'item',
      label: 'Bentō box',
      description: 'Hana’s おべんとう (obentō) box. Pack it with fruit and take it to a Nubbin for a picnic: a sad or lonely Nubbin cheers up.',
    },
    {
      id: 'lj4-sketchbook',
      kind: 'cosmetic',
      label: 'Sketchbook',
      description: 'A sketchbook your Keeper carries under one arm, like Hana’s. Its pages fill with the things you have drawn in these quests.',
    },
  ],
  sets: { lj4Done: true },
  notes: [
    COMMON_NOTES,
    'New words: step 1 obentō, onigiri, shiro, kuro, kiiro, midori (aka and ao reviewed from LJ2); step 2 itadakimasu, gochisōsama, ringo, mikan, ocha, orenji; step 3 ichigo, momo, pinku, murasaki.',
    'Step 1: a drag-and-drop packing game with four sections plus the cloth. Food: onigiri (white with a black seaweed wrap), egg (yellow), beans or cucumber or lettuce (green), tomatoes (red); the wrapping cloth is blue. Dumpling hops into the box between rounds (comic, no penalty).',
    'Step 2: the two phrases are said with hands together and a small bow. Keep both as “said before eating” and “said after eating”; don’t add translations.',
    'Step 3: a simple colouring page with fruit outlines. Plums are Fern’s and are named in English (the Japanese word isn’t on the list); their colour is murasaki.',
    'ピンク and オレンジ are katakana; show them in a different colour from hiragana in any word list.',
  ].join(' '),
};

// ================================================================== LJ5
const LJ5: Quest = {
  id: 'lj5',
  code: 'LJ5',
  title: 'Obāchan’s Letters',
  source: SOURCE,
  audience: 'all',
  trigger: {
    where: 'Learning Grove only',
    when: 'After LJ4, on a rainy day: Hana opens a tin of letters at the kitchen table.',
  },
  requires: ['LJ4'],
  speakers: [HANA],
  steps: [
    {
      id: 'lj5-step1',
      goal: 'Read one of Obāchan’s letters with Hana.',
      hint: 'Tap the letter on the kitchen table. Tap any underlined Japanese word to hear it.',
      check: 'lang:ja:read:letter:1',
      scene: {
        id: 'lj5-s1',
        lines: [
          N('Rain on the cottage roof. Hana opens a tin on the kitchen table. Inside is a bundle of letters tied with string.'),
          HA('Hazel used to write to my grandma, for years and years. Grandma kept a copy of every letter she sent back.'),
          HA('In my family I call my grandma おばあちゃん (obāchan). My grandpa is おじいちゃん (ojiichan).'),
          HA('She gave me these to bring here. They’re in English, but she put Japanese words in for Hazel to learn.'),
          N('The paper is thin and soft from folding. The handwriting is very neat and very small. Hana reads it aloud.'),
          HA('Dear Hazel. ありがとう for the seeds. They came up!', 'happy'),
          HA('Our ねこ (neko, “cat”) sleeps on my letters. The いぬ (inu, “dog”) next door barks at her. The とり (tori, “birds”) ignore them both.'),
          HA('Ojiichan says hello and asks how your Nubbins are. From your ともだち (tomodachi, “friend”).'),
          N('Hana sits back and reads the last line again, to herself.'),
          HA('“Your ともだち.” Not just “from”. “Your friend.”', 'soft'),
          HA('Your turn. Read the next bit. Watch out for the ねこ. Obāchan drew her in the margin.'),
        ],
      },
      done: {
        id: 'lj5-s1-done',
        lines: [
          N('You read the rest together, a line each. Hana does the voices. Obāchan’s ねこ gets a very grand voice.'),
          HA('Obāchan says a letter is a little visit. You open it, and the person is there for a bit.', 'soft'),
          HA('I said さようなら to her at the station, because a whole summer is a long time. I miss her. She’s fine. I just miss her.'),
          N('Hana pins the letter above her bed, next to a drawing of a ねこ asleep on an envelope.'),
        ],
      },
    },
    {
      id: 'lj5-step2',
      goal: 'Draw a family picture with Hana and label it in Japanese.',
      hint: 'Open the big paper on the floor. Draw anyone who is family to you, then tap a label to add it.',
      check: 'lang:ja:draw:family',
      scene: {
        id: 'lj5-s2',
        lines: [
          N('The rain stops. Hana spreads big paper across the floor and tips out every pencil she owns.'),
          HA('Let’s draw our かぞく (kazoku), our families. With labels. In Japanese.', 'happy'),
          HA('My おかあさん (okāsan), my mum. My おとうさん (otōsan), my dad. Obāchan, with her glasses on her head, looking for her glasses.'),
          HA('And ojiichan. He died when I was six. I still put him in every family picture. He’s still in my family.', 'soft'),
          N('She draws him in the corner, in a hat, holding a fishing rod. She doesn’t rush it.'),
          HA('And our うさぎ (usagi), our rabbit. She’s called Biscuit. She bites.'),
          HA('There’s an owl in the tree by obāchan’s house. ふくろう (fukurō). Not family exactly, but it was always there, so it counts.'),
          HA('Now yours. Anybody who’s family to you. People, pets, people who feel like family. They all count.'),
          N('Dumpling lies down on the paper, which presumably means he would like to be included.'),
        ],
        choices: [
          {
            id: 'grownups',
            label: 'Start with the grown-ups who look after me.',
            then: [HA('Good. If it’s your mum, write おかあさん. Your dad, おとうさん. Anyone else, their name. Names are labels too.')],
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
      },
      done: {
        id: 'lj5-s2-done',
        lines: [
          N('Two families on one big sheet, labelled in two languages, with a Nubbin-shaped gap where Dumpling lay.'),
          HA('Our かぞく. Look how many people.', 'happy'),
          NO('Is that the ふくろう? It looks cross.', 'think'),
          HA('はい. Owls always look cross. It was a very kind owl.'),
        ],
      },
    },
    {
      id: 'lj5-step3',
      goal: 'Tell Hana how each Nubbin feels, in Japanese.',
      hint: 'Tap a Nubbin, look at its face, and choose the feeling word: ureshii, kanashii, tanoshii, kowai or nemui.',
      check: 'lang:ja:say:feeling',
      scene: {
        id: 'lj5-s3',
        lines: [
          N('Clover is sitting in the grass among the gentle Nubbins, the way she does most afternoons.'),
          CL('Hana says you’re learning feelings words. Good. They’re the most useful words there are.', 'soft'),
          HA('うれしい (ureshii) is happy. That one, rolling in the clover. Very うれしい.', 'happy'),
          HA('かなしい (kanashii) is sad. That one lost its ball in the pond. Look at its ears.'),
          HA('たのしい (tanoshii) is fun, enjoyable. Like this whole summer. ねむい (nemui) is sleepy. That’s Dumpling. Always Dumpling.'),
          N('Something hops out of the clover and lands on Hana’s shoe. It is a frog.'),
          HA('かえる (kaeru)! Frog! That’s a かえる!', 'shock'),
          HA('こわい (kowai) means scary, or scared. The frog is こわい. I am not. I am totally not こわい.'),
          N('She is standing on a garden chair. She doesn’t remember climbing onto the garden chair.'),
          CL('It’s all right to be scared of something, you know. Even something small.', 'soft'),
          HA('…Maybe I’m a little bit こわい.'),
        ],
        choices: [
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
      },
      done: {
        id: 'lj5-s3-done',
        lines: [
          N('You point at each Nubbin and tell Hana how it feels. うれしい. かなしい. ねむい.'),
          HA('Yes! And the one with the ball? Nova fished it out. Now it’s うれしい.', 'happy'),
          CL('And you, Hana?', 'soft'),
          HA('たのしい. Today was たのしい. Even the かえる part. Mostly.'),
        ],
      },
    },
  ],
  complete: {
    id: 'lj5-complete',
    lines: [
      N('Evening. Hana writes a letter home at the kitchen table, tongue out, concentrating.'),
      HA('I’m telling obāchan everything. Help me check my words. Dumpling pulls a face, you say the feeling.'),
      N('Dumpling beams. Then droops. Then yawns enormously. Then hides behind the teapot.'),
      HA('うれしい, かなしい, ねむい, こわい! He’s very good at this.', 'happy'),
      HA('Family: おかあさん, おとうさん, おばあちゃん, おじいちゃん, and my ともだち. Animals: ねこ, いぬ, とり, うさぎ, ふくろう.'),
      HA('And one かえる. It’s part of the story now.', 'think'),
      HA('Obāchan sent this box with me. She said her letters should stay here, in the Grove, where they were always going.', 'soft'),
      HA('And this is for you: my happiest face. Use it when something is たのしい.', 'happy'),
    ],
  },
  rewards: [
    {
      id: 'lj5-letter-box',
      kind: 'decor',
      label: 'Obāchan’s letter box',
      description: 'A small wooden box of Obāchan’s letters for the cottage shelf. Open it to reread the LJ5 letter, with its Japanese words underlined.',
    },
    {
      id: 'lj5-tanoshii-emote',
      kind: 'cosmetic',
      label: '“Tanoshii” happy emote',
      description: 'Your Keeper beams and says たのしい (tanoshii, “fun!”). Nubbins nearby do a happy wiggle.',
    },
  ],
  sets: { lj5Done: true },
  notes: [
    COMMON_NOTES,
    'New words: step 1 obāchan, ojiichan, neko, inu, tori, tomodachi; step 2 kazoku, okāsan, otōsan, usagi, fukurō; step 3 ureshii, kanashii, tanoshii, nemui, kaeru, kowai.',
    'Step 1: show the letter as a page with the Japanese words underlined; tapping plays the recording. The letter is Obāchan’s copy of her reply to Hazel; Hazel is mentioned only in the past tense.',
    'Step 2: families vary. The labels offered are the six family words plus “type a name”; never assume a child has a mum, a dad or grandparents. Ojiichan died before the story; Hana says so plainly. LJ6 returns to him gently.',
    'Step 3: Nubbin faces show happy, sad, sleepy, having fun; the frog is the scary one. Hana really is a bit scared here, and that’s fine: Clover’s line is the point.',
    'Hana’s rabbit is called Biscuit (an English name; keep it).',
  ].join(' '),
};

// ================================================================== LJ6
const LJ6: Quest = {
  id: 'lj6',
  code: 'LJ6',
  title: 'Floating Lanterns',
  source: SOURCE,
  audience: 'all',
  trigger: {
    where: 'Learning Grove only',
    when: 'After LJ5, in late summer: Hana is sitting by the stream, not drawing.',
  },
  requires: ['LJ5'],
  speakers: [HANA],
  steps: [
    {
      id: 'lj6-step1',
      goal: 'Ask Hana why she is sitting by the stream.',
      hint: 'Hana is sitting by the stream. Tap her and choose Talk.',
      check: 'talk:hana:toro-nagashi',
      scene: {
        id: 'lj6-s1',
        lines: [
          N('Late summer. The evenings come earlier now. Hana sits by the stream, not drawing, which is how you know something is up.'),
          HA('At home, it’s nearly おぼん (Obon). It’s a time in summer when families remember the people in their family who have died.'),
          HA('At Obon, my family floats a paper lantern down the river for ojiichan. It’s called とうろうながし (tōrō nagashi).'),
          HA('Lots of places do it, often at the end of Obon. Every place does it a bit differently, and some don’t do it at all.'),
          HA('A river is かわ (kawa). This stream is more of a little かわ. But I think it would work.'),
          HA('The lantern has a light inside. ひかり (hikari), light. You watch it float away. It’s the quietest thing I know.', 'soft'),
          HA('Last year I floated one with obāchan. I wrote ojiichan’s name on it.'),
          HA('This year I’m here, not at the river. Could I float his lantern on your stream? You can come, if you want.', 'soft'),
        ],
        choices: [
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
      },
      done: {
        id: 'lj6-s1-done',
        lines: [
          N('Hana is drawing again: a page of lanterns, a page of stream, the whole Grove at dusk with tiny lights on the water.'),
          HA('Nova says everyone wants to come. Even Ember, and Ember doesn’t like anyone.', 'happy'),
          NO('Ember said “fine” and then asked what time. That’s a yes.'),
          HA('Tomorrow we make the lanterns. At home we write the name very carefully. Bring your best handwriting.'),
        ],
      },
    },
    {
      id: 'lj6-step2',
      goal: 'Help Hana make ojiichan’s lantern, and make one of your own if you like.',
      hint: 'At Fern’s kitchen table, fold a lantern and write a name on it. Hana writes ojiichan’s first.',
      check: 'lang:ja:make:lanterns',
      scene: {
        id: 'lj6-s2',
        lines: [
          N('Fern’s kitchen is covered in paper, glue and sticks. Everyone has turned up. Ember sits in the corner, folding very precisely.'),
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
        choices: [
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
      },
      done: {
        id: 'lj6-s2-done',
        lines: [
          N('A row of lanterns dries on the windowsill. Names in hiragana, in English, in Sparks’s enormous capitals.'),
          HA('Mine’s the best one.', 'happy'),
          FE('It’s not a competition, Hana.'),
          HA('…This one isn’t. You’re right. This one isn’t.', 'soft'),
          N('Pixel floats the test lantern in the bucket of みず. It stays up. Pixel nods once, satisfied.'),
        ],
      },
    },
    {
      id: 'lj6-step3',
      goal: 'Float ojiichan’s lantern with Hana at dusk. Later, join her review party.',
      hint: 'At dusk, walk down to the stream with Hana. Luna lights each lantern; set yours on the water when you’re ready. The party is back at the cottage afterwards.',
      check: 'lang:ja:review:float',
      scene: {
        id: 'lj6-s3',
        lines: [
          N('Dusk. Everyone walks down to the stream with Hana, who carries ojiichan’s lantern in both hands. The water is low, slow and gold.'),
          HA('No あめ (ame, “rain”) tonight. Good. Rain and paper don’t get on.', 'happy'),
          HA('At obāchan’s, in winter, there’s ゆき (yuki, “snow”) on the やま behind her house. Snow is just frozen みず, really.'),
          HA('At home, Obon is nearly over. My family will be at the river tonight too.', 'soft'),
          LU('I’ll light them, one at a time. Let them go when you’re ready. No hurry.', 'soft'),
          HA('This one’s for ojiichan.', 'soft'),
          N('Hana sets her lantern on the かわ and doesn’t push it. It is the slowest you have ever seen her do anything.'),
          N('Small ひかり follow it, one after another. Each one turns slowly as it finds the current.'),
          N('A frog sits on the bank beside Hana, watching the lights go. She doesn’t move away.'),
          HA('…You can watch too, かえる.', 'soft'),
          N('Then it’s your turn, if you’ve made one.'),
        ],
      },
      done: {
        id: 'lj6-s3-done',
        lines: [
          N('The lanterns drift on together: ひかり on the かわ, under the き. No あめ, no ゆき, just a warm, still night.'),
          HA('ありがとう. For letting me do this here.', 'soft'),
          N('Everyone watches until the last light has gone round the bend. Then you all walk back up to the cottage, slowly.'),
          N('Later, Sparks shouts PARTY. Hana asked for one afterwards, and Sparks has been waiting all evening. Every Nubbin in the Grove sits in rows.'),
          HA('Review party! Greetings! おはよう! おはようございます! こんにちは! こんばんは! はじめまして! すみません! ごめんなさい!', 'happy'),
          HA('Count the front row! いち, に, さん, よん, ご, ろく, なな, はち, きゅう, じゅう! Colours! あか, あお, きいろ, みどり, しろ, くろ, ピンク, オレンジ, むらさき!'),
        ],
      },
    },
  ],
  complete: {
    id: 'lj6-complete',
    lines: [
      HA('Food! りんご, みかん, いちご, もも, おにぎり, おちゃ! いただきます!'),
      N('Dumpling eats a りんご before Hana has finished saying the word.'),
      HA('Family! おかあさん, おとうさん, おばあちゃん, おじいちゃん, ともだち, かぞく! Animals! いぬ, ねこ, とり, うさぎ, ふくろう, こい, さかな!'),
      HA('Feelings! うれしい, たのしい. A little かなしい, because I go home soon. Not こわい. Well. Only of かえる.'),
      HA('The world! き, はな, みず, かわ, やま, あめ, ゆき, ほし, つき, ひかり!'),
      NO('And a title for the one who learned all of that.', 'happy'),
      HA('Hiragana Keeper. And this is for you: my drawing of tonight, the ひかり on the かわ. So you remember it too.', 'soft'),
      HA('I’m not saying さようなら. That’s for a long time. I’m saying またね. See you.', 'soft'),
    ],
  },
  rewards: [
    {
      id: 'lj6-stream-drawing',
      kind: 'decor',
      label: 'Hana’s drawing of the stream',
      description: 'A page from Hana’s sketchbook: the Grove stream at dusk, with small lights on the water and a frog on the bank. Hang it in the cottage.',
    },
    {
      id: 'lj6-hiragana-keeper',
      kind: 'title',
      label: 'Hiragana Keeper',
      description: 'A title for the Keeper who learned Hana’s greetings, kana, numbers, colours, food, family, feelings and nature words.',
    },
  ],
  sets: { lj6Done: true },
  notes: [
    COMMON_NOTES,
    'New words: step 1 Obon, tōrō nagashi, kawa, hikari; step 2 ki (木), yama (山), mizu (水), with 川 shown as a picture-kanji; step 3 ame, yuki. Hana (はな) the flower word is reviewed here.',
    'Culture: Obon is a summer time when families remember relatives who have died; tōrō nagashi is floating paper lanterns on rivers, often at the end of Obon. Customs and dates vary by place. Say only that. No religious detail, no spirits. Here it is Hana’s family’s custom for her ojiichan, which she invites the player to share: never a game activity, a mini-game, a score or a reward. No lantern items, no repeatable floating, no counting the lanterns.',
    'Grief is handled plainly: Hana’s ojiichan died; she remembers him and is OK. Hazel is not given a lantern by any character, and nothing here says whether she is alive.',
    'Step 2: a simple fold-and-write craft, not a mini-game (no score, no timer). Hana writes おじいちゃん first. The player may make a lantern too and type any name in any script, or just help Hana; the step completes either way. Nubbins don’t get lanterns.',
    'Step 3: the floating is a quiet story moment, not a game. Luna lights each lantern (children never handle the flame); the player sets theirs on the water with one tap when ready, or simply watches. No music under the first lantern. The frog stays on the bank.',
    'Step 3 done + complete: the review party plays afterwards, back at the cottage, never at the stream. It is a quick-fire game across every topic: greetings, numbers, colours, food, family, animals, feelings, nature. Use the lines here as Hana’s calls and play each word’s recording; Nubbins who learned a word react. The numbers count Nubbins, not lanterns.',
    'Lantern art: small square paper lanterns on wooden bases, warm light, drifting slowly down the stream at dusk. Reward: Hana’s drawing of that evening (a keepsake), not the lanterns.',
  ].join(' '),
};

export const LANG_JAPANESE: Quest[] = [LJ1, LJ2, LJ3, LJ4, LJ5, LJ6];

// ================================================================== the course
type Topic = VocabItem['topic'];

const v = (
  slug: string,
  native: string,
  roman: string,
  english: string,
  sayIt: string,
  topic: Topic,
  quest: string,
  band: VocabItem['band'],
  extra: { plain?: string; notes?: string } = {},
): VocabItem => {
  const item: VocabItem = { id: `ja-${slug}`, lang: 'ja', native, roman, english, sayIt, topic, quest, band, audio: `ja/${slug}` };
  if (extra.plain) item.plain = extra.plain;
  if (extra.notes) item.notes = extra.notes;
  return item;
};

const VOCAB: VocabItem[] = [
  // ------------------------------------------------ greetings (LJ1, plus mealtime words in LJ4)
  v('ohayou', 'おはよう', 'ohayō', 'good morning (to family and friends)', 'oh-hah-YOH', 'greetings', 'LJ1', 'both', {
    notes: 'Friendly form. The polite form is おはようございます.',
  }),
  v('ohayou-gozaimasu', 'おはようございます', 'ohayō gozaimasu', 'good morning (polite)', 'oh-hah-YOH go-zai-MAS', 'greetings', 'LJ1', 'reader', {
    notes: 'Polite form, for grown-ups, teachers and people you don’t know well.',
  }),
  v('konnichiwa', 'こんにちは', 'konnichiwa', 'hello, good afternoon', 'kon-nee-chee-WAH', 'greetings', 'LJ1', 'both', {
    notes: 'The final は is read “wa”.',
  }),
  v('konbanwa', 'こんばんは', 'konbanwa', 'good evening', 'kom-bahn-WAH', 'greetings', 'LJ1', 'both', {
    notes: 'The final は is read “wa”.',
  }),
  v('oyasumi', 'おやすみ', 'oyasumi', 'good night (friendly)', 'oh-yah-SOO-mee', 'greetings', 'LJ1', 'both', {
    notes: 'Friendly form. The polite form is おやすみなさい.',
  }),
  v('oyasuminasai', 'おやすみなさい', 'oyasuminasai', 'good night (polite)', 'oh-yah-soo-mee-nah-SAI', 'greetings', 'LJ1', 'reader', {
    notes: 'Polite form.',
  }),
  v('arigatou', 'ありがとう', 'arigatō', 'thank you', 'ah-ree-gah-TOH', 'greetings', 'LJ1', 'both', {
    notes: 'Friendly form. The polite form is ありがとうございます.',
  }),
  v('arigatou-gozaimasu', 'ありがとうございます', 'arigatō gozaimasu', 'thank you (polite)', 'ah-ree-gah-TOH go-zai-MAS', 'greetings', 'LJ1', 'reader', {
    notes: 'Polite form.',
  }),
  v('sumimasen', 'すみません', 'sumimasen', 'excuse me, sorry', 'soo-mee-mah-SEN', 'greetings', 'LJ1', 'both'),
  v('gomen-nasai', 'ごめんなさい', 'gomen nasai', 'I’m sorry', 'go-men nah-SAI', 'greetings', 'LJ1', 'both'),
  v('sayounara', 'さようなら', 'sayōnara', 'goodbye (for a while)', 'sah-YOH-nah-rah', 'greetings', 'LJ1', 'both', {
    notes: 'For a goodbye that will last a while, not for “see you tomorrow” (use またね) or bedtime (use おやすみ).',
  }),
  v('mata-ne', 'またね', 'mata ne', 'see you', 'mah-tah NEH', 'greetings', 'LJ1', 'both'),
  v('hai', 'はい', 'hai', 'yes', 'HAI', 'greetings', 'LJ1', 'both'),
  v('iie', 'いいえ', 'iie', 'no', 'EE-eh', 'greetings', 'LJ1', 'both'),
  v('hajimemashite', 'はじめまして', 'hajimemashite', 'nice to meet you (first meeting)', 'hah-jee-meh-MASH-teh', 'greetings', 'LJ1', 'both', {
    notes: 'Said only the first time you meet someone.',
  }),
  v('watashi-wa-desu', 'わたしは ___ です', 'watashi wa ___ desu', 'I am ___', 'wah-TAH-shee wah ___ DES', 'greetings', 'LJ1', 'both', {
    notes: 'Put a name in the gap, e.g. わたしは はな です. The は here is read “wa”.',
  }),
  v('yoroshiku-onegaishimasu', 'よろしくおねがいします', 'yoroshiku onegaishimasu', 'please treat me kindly / pleased to meet you', 'yo-ROSH-koo oh-neh-gai-shee-MAS', 'greetings', 'LJ1', 'reader', {
    notes: 'Polite; said after introducing yourself.',
  }),
  v('itadakimasu', 'いただきます', 'itadakimasu', 'said before eating', 'ee-tah-dah-kee-MAS', 'greetings', 'LJ4', 'both'),
  v('gochisousama', 'ごちそうさま', 'gochisōsama', 'said after eating', 'go-chee-SOH-sah-mah', 'greetings', 'LJ4', 'both'),

  // ------------------------------------------------ kana words (LJ2)
  v('ike', 'いけ', 'ike', 'pond', 'EE-keh', 'letters', 'LJ2', 'both', { notes: 'Spelled い + け. Say-it not in the vetted list: confirm against the recording.' }),
  v('ue', 'うえ', 'ue', 'up, above', 'OO-eh', 'letters', 'LJ2', 'both', { notes: 'Spelled う + え. Say-it not in the vetted list: confirm against the recording.' }),
  v('ie', 'いえ', 'ie', 'house', 'ee-EH', 'letters', 'LJ2', 'both', { notes: 'Spelled い + え: two short sounds. Not いいえ (iie, “no”), which holds the “ee” longer. Say-it not in the vetted list: confirm against the recording.' }),
  v('kao', 'かお', 'kao', 'face', 'KAH-oh', 'letters', 'LJ2', 'both', { notes: 'Spelled か + お. Say-it not in the vetted list: confirm against the recording.' }),

  // ------------------------------------------------ colours (aka and ao in LJ2; the rest in LJ4)
  v('aka', 'あか', 'aka', 'red', 'ah-KAH', 'colours', 'LJ2', 'both', { plain: '赤', notes: 'Noun form. Spelled あ + か.' }),
  v('ao', 'あお', 'ao', 'blue', 'AH-oh', 'colours', 'LJ2', 'both', { plain: '青', notes: 'Noun form. Spelled あ + お.' }),
  v('kiiro', 'きいろ', 'kiiro', 'yellow', 'kee-EE-roh', 'colours', 'LJ4', 'both', { plain: '黄色', notes: 'Noun form.' }),
  v('midori', 'みどり', 'midori', 'green', 'mee-DOH-ree', 'colours', 'LJ4', 'both', { plain: '緑', notes: 'Noun form.' }),
  v('shiro', 'しろ', 'shiro', 'white', 'shee-ROH', 'colours', 'LJ4', 'both', { plain: '白', notes: 'Noun form.' }),
  v('kuro', 'くろ', 'kuro', 'black', 'koo-ROH', 'colours', 'LJ4', 'both', { plain: '黒', notes: 'Noun form.' }),
  v('pinku', 'ピンク', 'pinku', 'pink', 'PEEN-koo', 'colours', 'LJ4', 'both', { notes: 'Katakana: a borrowed word. Shown as an example of katakana in LJ2.' }),
  v('orenji', 'オレンジ', 'orenji', 'orange', 'oh-REN-jee', 'colours', 'LJ4', 'both', { notes: 'Katakana: a borrowed word.' }),
  v('murasaki', 'むらさき', 'murasaki', 'purple', 'moo-rah-SAH-kee', 'colours', 'LJ4', 'both', { plain: '紫', notes: 'Noun form.' }),

  // ------------------------------------------------ numbers (LJ3)
  v('ichi', 'いち', 'ichi', '1, one', 'EE-chee', 'numbers', 'LJ3', 'both', { plain: '一', notes: 'Kanji 一 is one line.' }),
  v('ni', 'に', 'ni', '2, two', 'NEE', 'numbers', 'LJ3', 'both', { plain: '二', notes: 'Kanji 二 is two lines.' }),
  v('san', 'さん', 'san', '3, three', 'SAHN', 'numbers', 'LJ3', 'both', { plain: '三', notes: 'Kanji 三 is three lines.' }),
  v('yon', 'よん / し', 'yon / shi', '4, four', 'YOHN / SHEE', 'numbers', 'LJ3', 'both', { plain: '四', notes: 'Two readings. Use よん (yon) in counting games.' }),
  v('go', 'ご', 'go', '5, five', 'GO', 'numbers', 'LJ3', 'both', { plain: '五' }),
  v('roku', 'ろく', 'roku', '6, six', 'ROH-koo', 'numbers', 'LJ3', 'both', { plain: '六' }),
  v('nana', 'なな / しち', 'nana / shichi', '7, seven', 'NAH-nah / SHEE-chee', 'numbers', 'LJ3', 'both', { plain: '七', notes: 'Two readings. Use なな (nana) in counting games.' }),
  v('hachi', 'はち', 'hachi', '8, eight', 'HAH-chee', 'numbers', 'LJ3', 'both', { plain: '八' }),
  v('kyuu', 'きゅう / く', 'kyū / ku', '9, nine', 'KYOO / KOO', 'numbers', 'LJ3', 'both', { plain: '九', notes: 'Two readings. Use きゅう (kyū) in counting games.' }),
  v('juu', 'じゅう', 'jū', '10, ten', 'JOO', 'numbers', 'LJ3', 'both', { plain: '十' }),

  // ------------------------------------------------ food (LJ4)
  v('ringo', 'りんご', 'ringo', 'apple', 'REEN-go', 'food', 'LJ4', 'both'),
  v('mikan', 'みかん', 'mikan', 'mandarin orange', 'mee-KAHN', 'food', 'LJ4', 'both'),
  v('ichigo', 'いちご', 'ichigo', 'strawberry', 'ee-CHEE-go', 'food', 'LJ4', 'both', {
    notes: 'Spelled with the same kana as いち (one) and ご (five); it is just a strawberry.',
  }),
  v('momo', 'もも', 'momo', 'peach', 'MOH-moh', 'food', 'LJ4', 'both'),
  v('onigiri', 'おにぎり', 'onigiri', 'rice ball', 'oh-nee-GEE-ree', 'food', 'LJ4', 'both'),
  v('ocha', 'おちゃ', 'ocha', 'tea', 'OH-chah', 'food', 'LJ4', 'both'),
  v('obentou', 'おべんとう', 'obentō', 'packed lunch box', 'oh-ben-TOH', 'food', 'LJ4', 'both'),

  // ------------------------------------------------ animals (koi, sakana in LJ3; the rest in LJ5)
  v('koi', 'こい', 'koi', 'carp, koi', 'KOY', 'animals', 'LJ3', 'both', { notes: 'English borrowed this word from Japanese.' }),
  v('sakana', 'さかな', 'sakana', 'fish', 'sah-KAH-nah', 'animals', 'LJ3', 'both', { plain: '魚', notes: 'Any fish; koi are one kind.' }),
  v('inu', 'いぬ', 'inu', 'dog', 'ee-NOO', 'animals', 'LJ5', 'both', { plain: '犬' }),
  v('neko', 'ねこ', 'neko', 'cat', 'NEH-koh', 'animals', 'LJ5', 'both', { plain: '猫' }),
  v('tori', 'とり', 'tori', 'bird', 'TOH-ree', 'animals', 'LJ5', 'both', { plain: '鳥' }),
  v('usagi', 'うさぎ', 'usagi', 'rabbit', 'oo-SAH-gee', 'animals', 'LJ5', 'both'),
  v('fukurou', 'ふくろう', 'fukurō', 'owl', 'foo-koo-ROH', 'animals', 'LJ5', 'both'),
  v('kaeru', 'かえる', 'kaeru', 'frog', 'kah-EH-roo', 'animals', 'LJ5', 'both'),

  // ------------------------------------------------ family (LJ5)
  v('okaasan', 'おかあさん', 'okāsan', 'mother', 'oh-KAH-sahn', 'family', 'LJ5', 'both'),
  v('otousan', 'おとうさん', 'otōsan', 'father', 'oh-TOH-sahn', 'family', 'LJ5', 'both'),
  v('obaachan', 'おばあちゃん', 'obāchan', 'grandma', 'oh-BAH-chahn', 'family', 'LJ5', 'both', {
    notes: 'Reader note: おばちゃん (obachan, auntie) differs only in the long vowel. Hold the “baa”.',
  }),
  v('ojiichan', 'おじいちゃん', 'ojiichan', 'grandpa', 'oh-JEE-chahn', 'family', 'LJ5', 'both'),
  v('tomodachi', 'ともだち', 'tomodachi', 'friend', 'toh-moh-DAH-chee', 'family', 'LJ5', 'both'),
  v('kazoku', 'かぞく', 'kazoku', 'family', 'kah-ZOH-koo', 'family', 'LJ5', 'both'),

  // ------------------------------------------------ feelings (LJ5)
  v('ureshii', 'うれしい', 'ureshii', 'happy, glad', 'oo-REH-shee', 'feelings', 'LJ5', 'both'),
  v('kanashii', 'かなしい', 'kanashii', 'sad', 'kah-NAH-shee', 'feelings', 'LJ5', 'both'),
  v('tanoshii', 'たのしい', 'tanoshii', 'fun, enjoyable', 'tah-NOH-shee', 'feelings', 'LJ5', 'both'),
  v('kowai', 'こわい', 'kowai', 'scary, scared', 'koh-WAI', 'feelings', 'LJ5', 'both'),
  v('nemui', 'ねむい', 'nemui', 'sleepy', 'neh-MOO-ee', 'feelings', 'LJ5', 'both'),

  // ------------------------------------------------ nature (hana in LJ2; hoshi, tsuki in LJ3; the rest in LJ6)
  v('hana', 'はな', 'hana', 'flower; Hana’s name', 'HAH-nah', 'nature', 'LJ2', 'both', { plain: '花', notes: 'Spelled は + な. Also the name of the teacher in this questline.' }),
  v('hoshi', 'ほし', 'hoshi', 'star', 'HOH-shee', 'nature', 'LJ3', 'both', { plain: '星' }),
  v('tsuki', 'つき', 'tsuki', 'moon', 'TSOO-kee', 'nature', 'LJ3', 'both', { plain: '月' }),
  v('ki', 'き', 'ki', 'tree', 'KEE', 'nature', 'LJ6', 'both', { plain: '木', notes: 'Kanji 木 began as a picture of a tree.' }),
  v('mizu', 'みず', 'mizu', 'water', 'MEE-zoo', 'nature', 'LJ6', 'both', { plain: '水' }),
  v('kawa', 'かわ', 'kawa', 'river', 'KAH-wah', 'nature', 'LJ6', 'both', { plain: '川', notes: 'Kanji 川 began as a picture of flowing water.' }),
  v('yama', 'やま', 'yama', 'mountain', 'YAH-mah', 'nature', 'LJ6', 'both', { plain: '山', notes: 'Kanji 山 began as a picture of a mountain.' }),
  v('ame', 'あめ', 'ame', 'rain', 'AH-meh', 'nature', 'LJ6', 'both', { plain: '雨' }),
  v('yuki', 'ゆき', 'yuki', 'snow', 'YOO-kee', 'nature', 'LJ6', 'both', { plain: '雪' }),
  v('hikari', 'ひかり', 'hikari', 'light', 'hee-KAH-ree', 'nature', 'LJ6', 'both', { plain: '光' }),

  // ------------------------------------------------ culture
  v('ojigi', 'おじぎ', 'ojigi', 'bowing', 'oh-jee-gee', 'culture', 'LJ1', 'reader', {
    notes: 'People bow to greet, thank and apologise; a deeper bow shows more respect. Say-it not in the vetted list (no strong stress): confirm against the recording.',
  }),
  v('obon', 'おぼん', 'Obon', 'Obon: a summer time when families remember relatives who have died', 'oh-bohn', 'culture', 'LJ6', 'reader', {
    plain: 'お盆',
    notes: 'Customs and dates vary by place. Say-it not in the vetted list (no strong stress): confirm against the recording.',
  }),
  v('toro-nagashi', 'とうろうながし', 'tōrō nagashi', 'floating paper lanterns on a river, often at the end of Obon', 'toh-roh nah-gah-shee', 'culture', 'LJ6', 'reader', {
    plain: '灯籠流し',
    notes: 'Customs and dates vary by place. Say-it not in the vetted list (no strong stress): confirm against the recording.',
  }),
];

/** The kana primer: the hiragana LJ1–LJ3 teach, then the katakana of LJ4's two borrowed words. */
const KANA: ScriptChar[] = [
  { char: 'あ', name: 'a', roman: 'a', notes: 'Like “ah”. First in the hiragana chart.' },
  { char: 'い', name: 'i', roman: 'i', notes: 'Like “ee”.' },
  { char: 'う', name: 'u', roman: 'u', notes: 'Like “oo”.' },
  { char: 'え', name: 'e', roman: 'e', notes: 'Like “eh”.' },
  { char: 'お', name: 'o', roman: 'o', notes: 'Like “oh”.' },
  { char: 'か', name: 'ka', roman: 'ka', notes: '3 strokes.' },
  { char: 'き', name: 'ki', roman: 'ki', alt: '木', notes: 'As a word on its own, き (ki) means “tree”: kanji 木. 4 strokes in the school stroke order.' },
  { char: 'く', name: 'ku', roman: 'ku', notes: '1 stroke.' },
  { char: 'け', name: 'ke', roman: 'ke', notes: '3 strokes.' },
  { char: 'こ', name: 'ko', roman: 'ko', notes: '2 strokes.' },
  { char: 'は', name: 'ha', roman: 'ha', notes: 'Read “wa” when it marks the topic, as in わたしは and at the end of こんにちは, こんばんは. With な it spells はな (花, flower, Hana’s name).' },
  { char: 'な', name: 'na', roman: 'na', notes: 'With は it spells はな (花, flower, Hana’s name).' },
  { char: 'ピ', name: 'pi (katakana)', roman: 'pi', notes: 'Katakana, for borrowed words. First letter of ピンク (pinku, pink).' },
  { char: 'ン', name: 'n (katakana)', roman: 'n', notes: 'Katakana. The only letter that is just a sound with no vowel: ピンク, オレンジ.' },
  { char: 'ク', name: 'ku (katakana)', roman: 'ku', notes: 'Katakana. Last letter of ピンク. Compare hiragana く.' },
  { char: 'オ', name: 'o (katakana)', roman: 'o', notes: 'Katakana. First letter of オレンジ (orenji, orange). Compare hiragana お.' },
  { char: 'レ', name: 're (katakana)', roman: 're', notes: 'Katakana, in オレンジ.' },
  { char: 'ジ', name: 'ji (katakana)', roman: 'ji', notes: 'Katakana. Last letter of オレンジ.' },
];

export const JAPANESE_COURSE: LanguageCourse = {
  id: 'japanese',
  lang: 'ja',
  title: 'Hana’s Hiragana',
  quests: ['LJ1', 'LJ2', 'LJ3', 'LJ4', 'LJ5', 'LJ6'],
  vocab: VOCAB,
  script: {
    name: 'Hiragana, with a little katakana',
    direction: 'Left to right in rows, or top to bottom in columns read from right to left.',
    chars: KANA,
  },
  notes: [
    'Japanese uses three scripts: hiragana for Japanese words and grammar (46 basic characters); katakana mostly for borrowed words, like ピンク (pinku); and kanji, characters that came from Chinese and carry meaning, like 木 (tree), 山 (mountain) and 川 (river), which began as pictures.',
    'Romanisation is Hepburn with macrons (ō, ū). Say-its write long vowels doubled. Many Japanese words have no strong stress; the capitals are a rough guide only.',
    'In こんにちは and こんばんは, and in わたしは, the は is read “wa”.',
    'Politeness: friendly forms (おはよう, ありがとう, おやすみ) for family and friends; polite forms (おはようございます, ありがとうございます, おやすみなさい) for grown-ups and people you don’t know well.',
    'Counting games use yon, nana and kyū; shi, shichi and ku are the other readings of 4, 7 and 9.',
    'Every vocab item needs a native-speaker recording (VocabItem.audio). No TTS. Font: Noto Sans JP or similar.',
    'Seven say-its are not in the vetted list (ike, ue, ie, kao, and the culture items ojigi, Obon, tōrō nagashi); they are written from the kana (the culture items evenly, with no capitals) and flagged in each item’s notes for checking against the recordings.',
  ].join(' '),
};

export const CHECKS: string[] = [
  'lang:ja:greet:hana',
  'lang:ja:teach:nubbins:konnichiwa:3',
  'lang:ja:say:oyasumi',
  'lang:ja:find:kana:vowels',
  'lang:ja:trace:ka-row',
  'lang:ja:write:hana',
  'lang:ja:count:fish:10',
  'lang:ja:minigame:race-count',
  'lang:ja:count:stars:10',
  'lang:ja:pack:bento:colours',
  'lang:ja:say:mealtime',
  'lang:ja:draw:fruit:3',
  'lang:ja:read:letter:1',
  'lang:ja:draw:family',
  'lang:ja:say:feeling',
  'talk:hana:toro-nagashi',
  'lang:ja:make:lanterns',
  'lang:ja:review:float',
];
