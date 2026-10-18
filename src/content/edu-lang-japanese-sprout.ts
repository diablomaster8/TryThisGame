/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): the Japanese questline
 * “Hana’s Hiragana” (LJ1–LJ6, lang-japanese.ts).
 *
 *   LJ1 hello, yes and no, good morning, thank you, sorry, good evening, good night; bowing;
 *       the Bowing Song. Shape to trace: こ (ko)
 *   LJ2 the five vowel sounds; up, pond, face, red, blue; Hana means flower. Shape: く (ku)
 *   LJ3 ichi to jū; koi, fish, star, moon; losing kindly; the Koi Chant. Shape: い (i)
 *   LJ4 colours, fruit, the lunch box; itadakimasu and gochisōsama. Shape: あ (a)
 *   LJ5 family, animals and feelings; missing someone; being scared is OK. Shape: う (u)
 *   LJ6 Hana’s family’s floating lantern for her grandpa, and remembering; tree, water, river,
 *       mountain, rain, snow, light; the review party (later, at the cottage). Shape: き (ki)
 *
 * One EduScene per original scene (42), id `sprout:<original id>`. Every choice keeps its
 * original id; none of the base choices is cruel or bleak, so sprout keeps them all and needs
 * no defaultChoice. Exactly one lesson per scene, two in the two big complete scenes (lj1, lj6).
 *
 * Words: ONLY the vetted list in the languages brief, spelled exactly. Sprout is spoken, not
 * read: a word’s first appearance in the questline is native script then (romanisation,
 * “meaning”); every first appearance in a quest is followed by a bracketed grown-up prompt with
 * the vetted sound-alike, “(Say it: …)”. After that the romanisation alone is used, so the
 * grown-up can always read the line aloud. Friendly forms only (ohayō, arigatō, oyasumi).
 * One kana per quest is offered as a shape to trace (“this shape says ko”), never to read.
 * See EDU-STYLE.md and the languages brief. British spelling.
 */
import type { EduQuest, EduScene, Lesson } from './types';
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
const HA = say('hana');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

/** One answer option. `best` marks the answer the lesson teaches. */
const opt = (label: string, reply: Line[], best = false): Opt => (best ? { label, best, reply } : { label, reply });

/** One sprout scene. Lesson ids are `sprout:<of>-l<n>`, numbered in play order. */
const sc = (of: string, lines: Line[], beats: Beat[], choices?: Choice[]): EduScene => {
  const s: EduScene = {
    id: `sprout:${of}`,
    of,
    band: 'sprout',
    lines,
    lessons: [...beats].sort((a, b) => a.after - b.after).map((b, i) => ({ id: `sprout:${of}-l${i + 1}`, ...b })),
  };
  if (choices) s.choices = choices;
  return s;
};

const quest = (of: string, title: string, goals: EduQuest['goals'], scenes: EduScene[], notes: string): EduQuest => ({
  id: `sprout:${of}`,
  of,
  band: 'sprout',
  title,
  goals,
  scenes,
  notes,
});

const COMMON_NOTES = [
  'Sprout (ages 3–6): a grown-up reads aloud. Lines in brackets are prompts for the grown-up, not for the characters.',
  'Every Japanese word plays its native-speaker recording (JAPANESE_COURSE.vocab[].audio) when it first appears in a scene; never TTS. The “Say it” sound-alikes are the vetted ones from the course.',
  'Fonts: Noto Sans JP (or similar) for every line with kana, marked lang="ja"; for the big tracing shapes use a textbook-style (kyōkasho) font such as Klee One, whose strokes match handwriting. No bidi handling is needed.',
  'Tracing: show the kana big, draw its strokes one at a time, numbered, in school stroke order, then let the child trace with a finger. It is a shape to trace, never a reading test.',
  'Call-and-response: after a “Say it” prompt, pause so the child can repeat the word to a Nubbin; the Nubbin reacts (bows, waves, wiggles). No fail state.',
].join(' ');

// ================================================================== LJ1 Konnichiwa, Hana!
const LJ1: EduQuest = quest(
  'lj1',
  'Konnichiwa, Hana!',
  {
    'lj1-step1': {
      goal: 'Say hello to Hana at the gate. Say “konnichiwa”!',
      hint: 'Tap Hana and choose Greet. A little bow is lovely too.',
    },
    'lj1-step2': {
      goal: 'Teach three Nubbins to bow when you say “konnichiwa”.',
      hint: 'Tap a Nubbin and say “konnichiwa”. Say it a few times. Nubbins learn by copying.',
    },
    'lj1-step3': {
      goal: 'Say “oyasumi” (good night) to everyone.',
      hint: 'In the evening, tap each friend and choose Say, then “oyasumi”.',
    },
  },
  [
    sc(
      'lj1-s1',
      [
        N('Bang! The gate swings open.'),
        N('In runs a girl with a sketchbook. Nova follows, slowly.'),
        NO('This is Hana. She raced me here!', 'happy'),
        HA('I won. By a lot.'),
        HA('こんにちは (konnichiwa, “hello”)!', 'happy'),
        N('(Say it: kon-nee-chee-WAH. Your child says it back.)'),
        N('Hana bows. A quick little dip, then up again.'),
        HA('はじめまして (hajimemashite, “nice to meet you”)!'),
        N('(Say it: hah-jee-meh-MASH-teh. Say it slowly, together.)'),
        HA('We only say that the very first time we meet.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'greeting someone new with a bow',
          standard: 'ELOF: Social and Emotional Development',
          kind: 'do',
          after: 9,
          check: 'edu:bow:konnichiwa',
          lines: [
            HA('At home, we bow to say hello. And thank you. And sorry.'),
            HA('A deeper bow shows extra respect.'),
            N('(Stand up together. Bow and say: konnichiwa!)'),
          ],
          parentNote: 'Greeted Hana with konnichiwa (“hello”) and a small bow, and heard that in Japan people bow to greet, thank and say sorry.',
        },
      ],
      [
        {
          id: 'bow',
          label: 'Bow and say “konnichiwa”.',
          then: [N('You bow. Hana bows back, a bit lower.'), HA('Lower means I win. Probably.', 'happy')],
        },
        {
          id: 'wave',
          label: 'Wave and say “konnichiwa”.',
          then: [HA('A wave is friendly too!'), HA('Next time, add a tiny bow. Like this.', 'happy')],
        },
        {
          id: 'full',
          label: 'Say “hajimemashite” with a bow.',
          then: [
            HA('Hajimemashite! The first-time word! Perfect!', 'shock'),
            HA('Nova took three days to learn that.'),
            NO('Two days.'),
          ],
        },
      ],
    ),
    sc(
      'lj1-s1-done',
      [
        N('Hana is drawing you already. Scribble, scribble!'),
        HA('Done! Lovely nose. Big ears. My fault, not yours.', 'happy'),
        N('Three Nubbins peek out from behind the water butt.'),
        N('One tries to bow. It tips over. Roly-poly!'),
        HA('Do they want to learn? はい (hai, “yes”)!', 'happy'),
        N('(Say it: HAI. Nod your head.)'),
        HA('Is that a frog? Am I scared? いいえ (iie, “no”)!', 'think'),
        N('(Say it: EE-eh. Shake your head.)'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'yes and no in Japanese',
          standard: 'ELOF: Language and Communication',
          kind: 'do',
          after: 7,
          check: 'edu:say:ja:hai-iie',
          lines: [
            HA('Silly questions! Answer hai or iie.', 'happy'),
            HA('Is a Nubbin a teapot?'),
            N('(Your child answers: iie! Shake your head.)'),
            HA('Do you like plums?'),
            N('(Your child answers hai or iie. Both are fine!)'),
          ],
          parentNote: 'Answered silly questions with hai (“yes”) and iie (“no”), nodding and shaking their head.',
        },
      ],
    ),
    sc(
      'lj1-s2',
      [
        N('Morning! Dew on the grass. Sparkle, sparkle.'),
        HA('おはよう (ohayō, “good morning”)!', 'happy'),
        N('(Say it: oh-hah-YOH. Say it back to Hana.)'),
        FE('Good morning. Have a plum.'),
        HA('ありがとう (arigatō, “thank you”)!'),
        N('(Say it: ah-ree-gah-TOH. Say thank you to Fern.)'),
        N('Hana runs too fast. Bump! Over goes a round Nubbin.'),
        HA('ごめんなさい (gomen nasai, “I’m sorry”)!', 'shock'),
        N('(Say it: go-men nah-SAI.)'),
        FE('That’s Dumpling. He copies everything.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'saying sorry after a bump',
          standard: 'CASEL: Relationship skills',
          kind: 'ask',
          after: 9,
          prompt: [N('Hana bumped Dumpling by mistake. What can she do?')],
          options: [
            opt('Say sorry and help him up.', [HA('Yes! Gomen nasai, and a hand up. Better!', 'happy'), N('Hana bows low. Dumpling copies, and lands on his face.')], true),
            opt('Run away.', [HA('Running away won’t help Dumpling. Say sorry, then help him up.')]),
            opt('Pretend it didn’t happen.', [N('Dumpling still feels bumped! Saying sorry helps him feel better.')]),
          ],
          parentNote: 'Thought about what to do after bumping someone by mistake: say sorry (gomen nasai) and help.',
        },
      ],
      [
        {
          id: 'shy',
          label: 'The shy one under the bench.',
          then: [N('You whisper: konnichiwa.'), N('The shy one dips its head. Just a tiny bit.'), HA('Small bows count!', 'soft')],
        },
        {
          id: 'bouncy',
          label: 'The bouncy one on the wall.',
          then: [N('Konnichiwa! The bouncy one bows. Boing! Off the wall!'), HA('Very keen. I like it.', 'happy')],
        },
        {
          id: 'sleepy',
          label: 'The sleepy one in the sun.',
          then: [
            N('Konnichiwa! The sleepy one bows… slowly… and stays down.'),
            HA('Is it bowing? Or asleep?', 'think'),
            FE('Bit of both.'),
          ],
        },
      ],
    ),
    sc(
      'lj1-s2-done',
      [
        N('Three Nubbins in a row.'),
        N('You say konnichiwa. Bow, bow, bow!'),
        HA('Arigatō, everyone! So good!', 'happy'),
        N('Then one more bow. Dumpling copies, late!'),
        HA('Other way round, Dumpling!'),
        N('He turns round. He bows again. Bump!'),
        N('Dumpling looks very pleased with himself.'),
      ],
      [
        {
          domain: 'maths',
          skill: '3 and 1 more make 4',
          standard: 'K.OA.A.1',
          kind: 'ask',
          after: 3,
          prompt: [N('Three Nubbins bowed. Then Dumpling bowed too. How many bowed?'), N('(Count on your fingers together.)')],
          options: [
            opt('3', [N('Three Nubbins, and Dumpling makes one more. One, two, three, four!')]),
            opt('4', [HA('Four! Three Nubbins and one Dumpling.', 'happy')], true),
            opt('5', [N('Let’s count: one, two, three Nubbins. Dumpling makes four.')]),
          ],
          parentNote: 'Counted three bowing Nubbins and one more, and found that 3 and 1 more make 4.',
        },
      ],
    ),
    sc(
      'lj1-s3',
      [
        N('Evening. The sky goes orange, then dark blue.'),
        N('Luna comes up the path with a jar of moths.'),
        HA('こんばんは (konbanwa, “good evening”), Luna!'),
        N('(Say it: kom-bahn-WAH. Wave to Luna!)'),
        LU('Konbanwa! Nova taught me.', 'soft'),
        HA('Bedtime word: おやすみ (oyasumi, “good night”).'),
        N('(Say it: oh-yah-SOO-mee. Whisper it, soft and sleepy.)'),
        HA('Everybody gets an oyasumi. That’s the rule.'),
        N('Dumpling is asleep already. In the herb bed.'),
      ],
      [
        {
          domain: 'science',
          skill: 'times of day: morning and evening',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'ask',
          after: 4,
          prompt: [N('The sun is going down. Is it morning or evening?')],
          options: [
            opt('Evening', [HA('Evening! The sun goes down in the evening. So we say konbanwa.', 'happy')], true),
            opt('Morning', [HA('In the morning the sun comes up. Now it’s going down. That’s evening!')]),
          ],
          parentNote: 'Noticed that the sun goes down in the evening, when Hana says konbanwa (“good evening”).',
        },
      ],
      [
        {
          id: 'nubbins',
          label: 'Start with the Nubbins.',
          then: [N('Oyasumi, oyasumi, oyasumi! Three sleepy bows.'), N('And one snore. That’s Dumpling.')],
        },
        {
          id: 'nova',
          label: 'Start with Nova.',
          then: [N('You say oyasumi to Nova, with a little bow.'), NO('A bow! I feel very grand.', 'happy')],
        },
        {
          id: 'hana',
          label: 'Start with Hana.',
          then: [HA('Me first? Oyasumi! I win!', 'happy'), NO('It’s not a race.'), HA('Everything is a race.')],
        },
      ],
    ),
    sc(
      'lj1-s3-done',
      [
        N('Oyasumi to everyone. Even the herbs.'),
        FE('I’m off home. またね (mata ne, “see you”)!'),
        N('(Say it: mah-tah NEH. Wave goodbye to Fern.)'),
        N('Dumpling bows to the moon.'),
        N('The moon does not bow back. But it shines.'),
        N('Hana falls asleep on the bench, pencil in hand.'),
      ],
      [
        {
          domain: 'health',
          skill: 'a calm bedtime routine',
          standard: 'ELOF: Perceptual, Motor, and Physical Development',
          kind: 'do',
          after: 5,
          check: 'edu:whisper:ja:oyasumi',
          lines: [
            N('(Take a big, slow breath together. In… and out.)'),
            N('(Now whisper oyasumi to your favourite toy.)'),
          ],
          parentNote: 'Practised a calm bedtime routine: a slow breath, then a whispered oyasumi (“good night”).',
        },
      ],
    ),
    sc(
      'lj1-complete',
      [
        N('Morning. A paper lantern hangs on the gate.'),
        NO('A welcome sign. For everyone who comes.', 'happy'),
        HA('I made up a bowing song! Bow at every line.'),
        HA('おはよう (ohayō), up comes the sun!'),
        HA('こんにちは (konnichiwa), hello, everyone!'),
        HA('ありがとう (arigatō), thanks for the fun!'),
        HA('こんばんは (konbanwa), the day is done!'),
        HA('おやすみ (oyasumi), down goes the light. Bow, bow, and say good night!'),
        N('Dumpling bows one line late. Every time! Then he lies down.'),
        HA('Hai! You can bow now. Properly.', 'happy'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'tracing the kana shape こ (ko)',
          standard: 'ELOF: Literacy',
          kind: 'do',
          after: 1,
          check: 'edu:trace:ja:ko',
          lines: [
            HA('The sign starts with this shape: こ (ko).'),
            HA('It says “ko”, like the start of konnichiwa.'),
            N('(Trace it with a finger: two little lines. The top one first.)'),
          ],
          parentNote: 'Traced the Japanese shape こ (ko), the first shape of konnichiwa on the welcome sign.',
        },
        {
          domain: 'music',
          skill: 'singing a song with rhymes and actions',
          standard: 'RF.K.2',
          kind: 'do',
          after: 7,
          check: 'edu:sing:ja:bowing-song',
          lines: [
            N('(Sing it again together. Bow at the end of every line!)'),
            HA('Sun, everyone, fun, done! Light, night! They rhyme!', 'happy'),
          ],
          parentNote: 'Sang Hana’s Bowing Song with five Japanese greetings, bowing on the beat and hearing the rhymes.',
        },
      ],
    ),
  ],
  [
    COMMON_NOTES,
    'Words (sprout): konnichiwa, hajimemashite (s1); hai, iie (s1-done); ohayō, arigatō, gomen nasai (s2); konbanwa, oyasumi (s3); mata ne (s3-done). Polite forms, sumimasen, sayōnara, ojigi and watashi wa ___ desu / yoroshiku onegaishimasu are left to the reader band.',
    'Bowing: lj1-s1 is a do-lesson (edu:bow:konnichiwa). The Bowing Song is the base file’s original song, sung as written; the Nubbins bow on the last beat of each line.',
    'Shape to trace: こ (ko), 2 strokes, on the lantern sign.',
  ].join(' '),
);

// ================================================================== LJ2 The Hiragana Pond
const LJ2: EduQuest = quest(
  'lj2',
  'The Hiragana Pond',
  {
    'lj2-step1': {
      goal: 'Find the painted stones and hop across. Say each sound!',
      hint: 'Start nearest the bank. Say ah, ee, oo, eh, oh as you hop.',
    },
    'lj2-step2': {
      goal: 'Trace a shape in the sand by the pond.',
      hint: 'Tap the sand. Follow the numbered lines with your finger. No rush.',
    },
    'lj2-step3': {
      goal: 'Help write Hana’s name in her sketchbook. Then draw a flower.',
      hint: 'Open the sketchbook. A grown-up can help you trace the two shapes.',
    },
  },
  [
    sc(
      'lj2-s1',
      [
        N('Hana has painted shapes on the pond stones.'),
        MA('She asked you first. Mostly.'),
        HA('Each shape makes a sound. Five sounds today!', 'happy'),
        HA('Ah. Ee. Oo. Eh. Oh.'),
        N('(Say them after Hana: ah, ee, oo, eh, oh.)'),
        HA('Hop on the stones. Say each sound as you go.'),
        N('On the last stone sits a frog. Fat and wet.'),
        HA('That is a normal frog. I am being normal.', 'think'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'saying the five Japanese vowel sounds',
          standard: 'ELOF: Language and Communication',
          kind: 'do',
          after: 5,
          check: 'edu:say:ja:vowel-sounds',
          lines: [
            N('(You say a sound. Your child says it back and hops.)'),
            HA('Ah! Ee! Oo! Eh! Oh!', 'happy'),
          ],
          parentNote: 'Said the five Japanese vowel sounds (ah, ee, oo, eh, oh) back to Hana, hopping on each one.',
        },
      ],
    ),
    sc(
      'lj2-s1-done',
      [
        N('Hop! Hop! Hop! Hop! Hop! Five stones.'),
        N('On the last stone, the frog moves. A tiny bit.'),
        HA('Now jump up onto the bank! うえ (ue, “up”)!'),
        N('(Say it: OO-eh. Jump up when you say it!)'),
        N('Up you go! Hana claps.'),
        HA('Nobody mention the frog.', 'happy'),
        MA('Nobody mentioned the frog.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'position words: on and under',
          standard: 'K.G.A.1',
          kind: 'ask',
          after: 1,
          prompt: [N('Where is the frog?')],
          options: [
            opt('On the stone', [HA('On the stone. Still. On. The. Stone.', 'think')], true),
            opt('Under the stone', [N('Look again. The frog is on top of the stone.')]),
            opt('In a tree', [N('Not in a tree! The frog is on the stone.')]),
          ],
          parentNote: 'Used position words to say where the frog was: on the stone, not under it.',
        },
      ],
    ),
    sc(
      'lj2-s2',
      [
        N('Dusty has raked the sand flat. Smooth!'),
        DU('I found two spoons under here. Not mine.'),
        HA('We draw shapes in the sand. Next to the いけ (ike, “pond”).'),
        N('(Say it: EE-keh. Point to the pond.)'),
        DU('I’ve been next to an ike all day!', 'happy'),
        N('Hana draws one bendy line in the sand. Like a beak.'),
        N('The frog hops into the sand. Right in the way.'),
        HA('It’s fine. Frogs are fine. It’s fine.', 'think'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'tracing the kana shape く (ku)',
          standard: 'ELOF: Literacy',
          kind: 'do',
          after: 5,
          check: 'edu:trace:ja:ku',
          lines: [
            HA('This shape is く (ku). It says “ku”.'),
            HA('Just one line. Like a bird’s beak.'),
            N('(Trace it with one finger: from the top, in to the point, then down.)'),
          ],
          parentNote: 'Traced the Japanese shape く (ku), which is just one stroke, in the sand.',
        },
      ],
      [
        {
          id: 'scoop',
          label: 'Gently carry the frog back to the pond.',
          then: [N('You scoop it up. Gently. Back to the water.'), HA('I was fine. But thank you.', 'soft')],
        },
        {
          id: 'around',
          label: 'Draw round the frog.',
          then: [N('You draw the beak shape round the frog.'), N('It looks like the frog is getting a hug.'), HA('That’s a really good drawing!', 'happy')],
        },
        {
          id: 'ask',
          label: 'Ask Hana if she’s scared.',
          then: [HA('Me? No. Not at all.', 'think'), N('She is standing on one leg. Far, far away.')],
        },
      ],
    ),
    sc(
      'lj2-s2-done',
      [
        N('The beak shape sits in the sand. Neat!'),
        N('Dusty steps back to look. Oops! Squish.'),
        DU('ごめんなさい (gomen nasai)! I’ll rake it smooth.'),
        N('(Say it: go-men nah-SAI.)'),
        HA('Now let’s draw a かお (kao, “face”)!', 'happy'),
        N('(Say it: KAH-oh. Point to your face.)'),
        N('Two eyes. A nose. A smile. It looks like Dusty.'),
        DU('That’s me, isn’t it?', 'shock'),
      ],
      [
        {
          domain: 'health',
          skill: 'naming parts of the face',
          standard: 'ELOF: Perceptual, Motor, and Physical Development',
          kind: 'do',
          after: 5,
          check: 'edu:point:face:eyes-nose-mouth',
          lines: [
            HA('Point to your eyes! Your nose! Your mouth!', 'happy'),
            N('(Point together. Then make a silly kao!)'),
          ],
          parentNote: 'Pointed to their eyes, nose and mouth, and learned kao (“face”).',
        },
      ],
    ),
    sc(
      'lj2-s3',
      [
        N('Hana opens her sketchbook. The page is empty!'),
        N('That never happens.'),
        HA('My name is はな (hana, “flower”).', 'happy'),
        N('(Say it: HAH-nah. Now say it to Hana.)'),
        HA('It means flower. Flowers were named after me.'),
        HA('Write my name with me. Big!'),
        N('(You can help with the tracing.)'),
        HA('Across, or down? Japanese can go both ways.'),
      ],
      [
        {
          domain: 'art',
          skill: 'drawing a flower',
          standard: 'ELOF: Perceptual, Motor, and Physical Development',
          kind: 'do',
          after: 4,
          check: 'edu:draw:flower',
          lines: [
            HA('Hana means flower. Draw one next to my name!'),
            N('(Draw a flower together. Count the petals!)'),
          ],
          parentNote: 'Drew a flower for Hana, whose name means “flower” in Japanese, and counted its petals.',
        },
      ],
      [
        {
          id: 'row',
          label: 'Write it across.',
          then: [N('Side by side, across the page.'), HA('Like a name on a door!', 'happy')],
        },
        {
          id: 'column',
          label: 'Write it down.',
          then: [N('One on top. One underneath.'), HA('Very fancy! Like a tall tower.', 'happy')],
        },
      ],
    ),
    sc(
      'lj2-s3-done',
      [
        N('Hana’s name, big on the page. A bit wobbly.'),
        HA('That’s how my family writes my name.', 'soft'),
        HA('I’m keeping this page for ever.'),
        N('The frog hops onto the page. Plop!'),
        N('Hana makes a tiny squeak. Not a scream.'),
        HA('That was not a scream.', 'think'),
      ],
      [
        {
          domain: 'sel',
          skill: 'noticing how someone feels',
          standard: 'CASEL: Social awareness',
          kind: 'ask',
          after: 2,
          prompt: [N('Hana’s voice is soft. She is smiling. How does she feel?')],
          options: [
            opt('Happy and proud', [HA('Yes! Happy and proud. My name, the way my family writes it.', 'soft')], true),
            opt('Cross', [N('Not cross. She is smiling. She feels happy and proud.')]),
            opt('Scared', [N('Not scared. Not yet! She feels happy and proud.')]),
          ],
          parentNote: 'Read Hana’s face and voice and named her feeling: happy and proud.',
        },
      ],
    ),
    sc(
      'lj2-complete',
      [
        N('The pond has lots of painted stones now.'),
        HA('Quick game! I say it, the Nubbin does it!', 'happy'),
        HA('Ue! Ike! Kao!'),
        N('Up! The pond! A silly face!'),
        HA('あか (aka, “red”)! あお (ao, “blue”)!'),
        N('(Say them: ah-KAH, AH-oh. Point to red, then blue.)'),
        N('The Nubbin goes red in the cheeks. Then it sits down.'),
        MA('I’d keep the stones. They’re lovely.', 'happy'),
        HA('Stepping stones that say hello in Japanese!', 'happy'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'acting out Japanese words',
          standard: 'ELOF: Language and Communication',
          kind: 'do',
          after: 5,
          check: 'edu:act:ja:pond-words',
          lines: [
            N('(You say a word. Your child does the action!)'),
            N('(Ue: jump up. Ike: point to water. Kao: silly face.)'),
            N('(Aka: find red. Ao: find blue. Hana: be a flower!)'),
          ],
          parentNote: 'Played a listen-and-do game with six Japanese words: ue, ike, kao, aka, ao and hana.',
        },
      ],
    ),
  ],
  [
    COMMON_NOTES,
    'Sprout does not read kana. The stones and sand are shapes and sounds; the five vowels are said, not read. Words (sprout): ue (s1-done), ike (s2), kao (s2-done), hana (s3), aka, ao (complete). Ie and the three scripts are left to the reader band.',
    'The say-its for ue (OO-eh), ike (EE-keh) and kao (KAH-oh) come from JAPANESE_COURSE, where they are flagged as not in the vetted list: confirm against the recordings.',
    'Shape to trace: く (ku), 1 stroke, in the sand. Writing はな in step 3 is traced with a grown-up’s help; the scene’s lesson is drawing a flower, not reading.',
  ].join(' '),
);

// ================================================================== LJ3 Counting Koi
const LJ3: EduQuest = quest(
  'lj3',
  'Counting Koi',
  {
    'lj3-step1': {
      goal: 'Count the koi into the pond, from ichi to jū.',
      hint: 'Tap each fish as it swims in. Say the number with Hana.',
    },
    'lj3-step2': {
      goal: 'Race Hana round the pond. Count the laps in Japanese.',
      hint: 'Start the race at the lap board. Say each lap number as you pass the post.',
    },
    'lj3-step3': {
      goal: 'Count ten stars with Hana. Then find the moon.',
      hint: 'Go up the hill with Luna after dark. The moon is low, behind the plum trees.',
    },
  },
  [
    sc(
      'lj3-s1',
      [
        N('Marina has two big buckets. Splash, splash!'),
        MA('New fish for the pond!'),
        HA('こい (koi, “koi fish”)! They’re koi!', 'happy'),
        N('(Say it: KOY. It’s the same word in English!)'),
        HA('Let’s count them in. Hold up your fingers.'),
        HA('いち (ichi, “one”), に (ni, “two”), さん (san, “three”)!'),
        N('(Say it: EE-chee, NEE, SAHN. One finger at a time.)'),
        HA('よん (yon, “four”), ご (go, “five”)! A whole hand!'),
        N('(Say it: YOHN, GO. Wiggle all five fingers!)'),
        N('Plop! Plop! The koi do not wait.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 5 in Japanese',
          standard: 'K.CC.B.5',
          kind: 'do',
          after: 9,
          check: 'edu:count:ja:koi:5',
          lines: [HA('Count this bucket! Ichi, ni, san, yon, go!', 'happy'), N('(Count on your fingers together. Five koi!)')],
          parentNote: 'Counted five koi in Japanese: ichi, ni, san, yon, go.',
        },
      ],
    ),
    sc(
      'lj3-s1-done',
      [
        MA('Five more in this bucket.'),
        HA('ろく (roku, “six”), なな (nana, “seven”), はち (hachi, “eight”)!'),
        N('(Say it: ROH-koo, NAH-nah, HAH-chee. Copy Hana!)'),
        HA('きゅう (kyū, “nine”), じゅう (jū, “ten”)! Ten koi!', 'happy'),
        N('(Say it: KYOO, JOO. Show ten fingers!)'),
        MA('A little dramatic. But right.'),
        N('Dumpling counts the koi with his head. Nod, nod, nod.'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'tracing the kana shape い (i)',
          standard: 'ELOF: Literacy',
          kind: 'do',
          after: 4,
          check: 'edu:trace:ja:i',
          lines: [
            HA('Ichi starts with this shape: い (i).'),
            HA('It says “ee”. Two little lines, like two koi.'),
            N('(Trace it: the long line on the left first, then the short one.)'),
          ],
          parentNote: 'Traced the Japanese shape い (i), the first shape of ichi (“one”).',
        },
      ],
    ),
    sc(
      'lj3-s2',
      [
        N('Zoom! Sparks arrives. Pixel brings a lap board.'),
        SP('WHO HERE THINKS SHE’S FAST?', 'happy'),
        HA('Me. I am fast.'),
        PX('It flips for every lap. One line, two lines, three lines!', 'happy'),
        HA('Count the laps in Japanese. Out loud!'),
        HA('Loser feeds the さかな (sakana, “fish”).'),
        N('(Say it: sah-KAH-nah. Make a fish face!)'),
        BY('I will write down the excuses.', 'think'),
      ],
      [
        {
          domain: 'maths',
          skill: 'counting actions: one, two, three',
          standard: 'K.CC.B.4',
          kind: 'do',
          after: 4,
          check: 'edu:count:ja:laps:3',
          lines: [
            HA('Run on the spot! One lap: ichi!', 'happy'),
            HA('Two laps: ni! Three laps: san!'),
            N('(Run on the spot together. Count each lap out loud.)'),
          ],
          parentNote: 'Ran on the spot and counted three laps in Japanese: ichi, ni, san.',
        },
      ],
      [
        {
          id: 'fair',
          label: 'A fair start.',
          then: [BY('Fair start. Nobody moves. Nobody. Hana.'), HA('I wasn’t moving. I was leaning.')],
        },
        {
          id: 'headstart',
          label: 'Give Hana a head start.',
          then: [HA('I don’t need a head start!', 'angry'), HA('…But I’ll take it.', 'happy')],
        },
        {
          id: 'sparks',
          label: 'Let Sparks race too.',
          then: [SP('THREE-WAY RACE! YES!', 'happy'), HA('Fine. I’ll beat you both.')],
        },
      ],
    ),
    sc(
      'lj3-s2-done',
      [
        N('Clack! The last tile flips.'),
        N('Everyone flops on the grass. Puff, puff, puff.'),
        BY('Laps: counted. Hana’s excuse: coming soon.', 'think'),
        HA('That was a practice one.'),
        BY('There it is.'),
        HA('Now we all feed the sakana. Together!', 'happy'),
        SP('Mata ne! Rematch tomorrow!', 'happy'),
        N('(Say it: mah-tah NEH. Wave to Sparks!)'),
      ],
      [
        {
          domain: 'sel',
          skill: 'losing kindly',
          standard: 'CASEL: Relationship skills',
          kind: 'ask',
          after: 4,
          prompt: [N('Hana didn’t win. What can she say?')],
          options: [
            opt('“Good race!”', [SP('GOOD RACE, HANA! Again tomorrow?', 'happy'), HA('…Good race. Tomorrow I win.', 'happy')], true),
            opt('“I’m the best!”', [N('Hmm. That might make the others sad. “Good race!” is kinder.')]),
            opt('“That was a practice one!”', [BY('There it is again.'), N('Feeling cross is OK. Then “good race!” helps.')]),
          ],
          parentNote: 'Thought about what to say after losing a race, and practised “good race!”.',
        },
      ],
    ),
    sc(
      'lj3-s3',
      [
        N('Night. Luna spreads a blanket on the hill.'),
        LU('It’s darker up here. So we see more stars.', 'soft'),
        HA('Star is ほし (hoshi, “star”).'),
        N('(Say it: HOH-shee. Point up at the sky.)'),
        HA('Ichi… ni… san… Oh! That one’s a plane.'),
        HA('Moon is つき (tsuki, “moon”). Where is the tsuki?'),
        N('(Say it: TSOO-kee. Look for the moon.)'),
        N('Hana points at a star. Dumpling points too, with his whole body!'),
      ],
      [
        {
          domain: 'science',
          skill: 'we see more stars where it is dark',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'ask',
          after: 1,
          prompt: [LU('Why do we see more stars up here?', 'think')],
          options: [
            opt('It’s darker here.', [LU('Yes. Away from bright lights, the sky is darker. More stars show.', 'soft')], true),
            opt('The stars came to see us.', [LU('A lovely idea! Really, it’s darker here. So we see more.', 'soft')]),
          ],
          parentNote: 'Learned that we can see more stars where the sky is darker, away from bright lights.',
        },
      ],
      [
        {
          id: 'bright',
          label: 'Start with the brightest star.',
          then: [LU('The bright one. Easy to find again.', 'soft')],
        },
        {
          id: 'dumpling',
          label: 'Count the ones Dumpling points at.',
          then: [N('Dumpling points. You count. Dumpling points. You count.'), N('Very slow. Very right.')],
        },
      ],
    ),
    sc(
      'lj3-s3-done',
      [
        N('Ten hoshi. One by one.'),
        N('And there, low behind the trees: a thin silver tsuki.'),
        HA('Found it! Hold still. I’m drawing it.', 'happy'),
        N('Her drawing has eleven stars and two moons.'),
        HA('That’s on purpose. It’s art.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 10 in Japanese',
          standard: 'K.CC.B.5',
          kind: 'do',
          after: 0,
          check: 'edu:count:ja:hoshi:10',
          lines: [
            HA('Ichi, ni, san, yon, go!'),
            HA('Roku, nana, hachi, kyū, jū!', 'happy'),
            N('(Count ten stars on your fingers together.)'),
          ],
          parentNote: 'Counted ten stars in Japanese, from ichi to jū, one finger for each.',
        },
      ],
    ),
    sc(
      'lj3-complete',
      [
        N('Morning. Pixel puts the lap board by the pond.'),
        HA('A chant for feeding the koi! Clap on every number.', 'happy'),
        HA('Ichi, ni, san, koi in the pond!'),
        HA('Yon, go, round and beyond!'),
        HA('Roku, nana, under the reeds!'),
        HA('Hachi, kyū, jū, and everyone feeds!'),
        N('Ten koi pop up at once. Gulp, gulp, gulp!'),
        MA('The spotty one is yours. A koi for your pond.', 'happy'),
        HA('ありがとう (arigatō), Marina!', 'happy'),
        N('(Say it: ah-ree-gah-TOH. Say thank you to Marina too!)'),
      ],
      [
        {
          domain: 'music',
          skill: 'clapping a counting chant with rhymes',
          standard: 'RF.K.2',
          kind: 'do',
          after: 5,
          check: 'edu:clap:ja:koi-chant',
          lines: [N('(Say the chant again. Clap on every number!)'), HA('Pond, beyond! Reeds, feeds! They rhyme!', 'happy')],
          parentNote: 'Clapped along to Hana’s Koi Chant, counting from ichi to jū and hearing the rhymes.',
        },
      ],
    ),
  ],
  [
    COMMON_NOTES,
    'Words (sprout): koi, ichi, ni, san, yon, go (s1); roku, nana, hachi, kyū, jū (s1-done); sakana (s2); hoshi, tsuki (s3). Counting uses yon, nana and kyū only; shi, shichi, ku and the kanji 一 二 三 are left to the reader band (the lap board shows one, two, three lines).',
    'The Koi Chant is the base file’s original chant, said in romanisation so the grown-up can read it. Clap on each number.',
    'Shape to trace: い (i), 2 strokes. Maths lessons are never back to back: maths, literacy, maths, sel, science, maths, music.',
  ].join(' '),
);

// ================================================================== LJ4 Colours and Lunchboxes
const LJ4: EduQuest = quest(
  'lj4',
  'Colours and Lunchboxes',
  {
    'lj4-step1': {
      goal: 'Pack a lunch box with Hana. Sort the food by colour.',
      hint: 'Drag each food into its own little room. Dumpling does not go in the box!',
    },
    'lj4-step2': {
      goal: 'Say “itadakimasu” before the picnic and “gochisōsama” after.',
      hint: 'Hands together and a little bow before eating. Say the second word when the box is empty.',
    },
    'lj4-step3': {
      goal: 'Draw three fruits for Hana’s sketchbook.',
      hint: 'Open the sketchbook. Pick three fruits and colour them in.',
    },
  },
  [
    sc(
      'lj4-s1',
      [
        N('Hana has an empty box. It has four little rooms.'),
        HA('This is an おべんとう (obentō, “lunch box”).', 'happy'),
        N('(Say it: oh-ben-TOH. Pretend to open a lid.)'),
        HA('First, おにぎり (onigiri, “rice ball”). Rice is しろ (shiro, “white”).'),
        N('(Say it: oh-nee-GEE-ree, shee-ROH.)'),
        HA('Now the green room. Green is みどり (midori, “green”).'),
        N('(Say it: mee-DOH-ree. Find something green!)'),
        N('Dumpling climbs in. He sits in the green room.'),
        FE('Dumpling is not lunch.'),
        HA('So what goes in the midori room?'),
      ],
      [
        {
          domain: 'maths',
          skill: 'sorting things by colour',
          standard: 'K.MD.B.3',
          kind: 'do',
          after: 6,
          check: 'edu:sort:ja:bento:colour',
          lines: [
            HA('Onigiri here. Green things there. Every food in its room.'),
            N('(Point to where each food goes. Sort by colour!)'),
          ],
          parentNote: 'Sorted lunch-box food into groups by colour: shiro (white) and midori (green).',
        },
      ],
      [
        {
          id: 'beans',
          label: 'The beans.',
          then: [N('You put in a bean. Dumpling eats it.'), N('You put in another. He eats that too.')],
        },
        {
          id: 'cucumber',
          label: 'Cucumber from Fern’s garden.',
          then: [FE('My cucumber! I grew that. Mostly on purpose.', 'happy')],
        },
        {
          id: 'leaf',
          label: 'A big lettuce leaf.',
          then: [HA('Good! Green, and also a wall.', 'happy')],
        },
      ],
    ),
    sc(
      'lj4-s1-done',
      [
        N('In goes the egg. It is きいろ (kiiro, “yellow”).'),
        N('(Say it: kee-EE-roh. Find something yellow!)'),
        HA('Red tomatoes: あか (aka)! Black seaweed: くろ (kuro, “black”)!'),
        N('(Say it: ah-KAH, koo-ROH.)'),
        N('The box looks like a little painted window.'),
        N('You lift the lid to check. Dumpling is in the box!'),
        FE('How? I was looking right at him!', 'shock'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'tracing the kana shape あ (a)',
          standard: 'ELOF: Literacy',
          kind: 'do',
          after: 3,
          check: 'edu:trace:ja:a',
          lines: [
            HA('Aka starts with this shape: あ (a).'),
            HA('It says “ah”. It has a loop, like a curly noodle.'),
            N('(Trace it: the line across, the line down, then the loop.)'),
          ],
          parentNote: 'Traced the Japanese shape あ (a), the first shape of aka (“red”).',
        },
      ],
    ),
    sc(
      'lj4-s2',
      [
        N('Picnic time by the pond. Out comes a blue cloth.'),
        HA('Blue is あお (ao). Hardly any food is blue!'),
        N('(Say it: AH-oh.)'),
        HA('Before we eat, we say いただきます (itadakimasu, “said before eating”).'),
        N('(Say it: ee-tah-dah-kee-MAS. Hands together, little bow.)'),
        SP('So I can’t eat ANYTHING yet?', 'shock'),
        HA('Nothing. You have a bean in your mouth.'),
        SP('…It got in by itself.'),
        N('Dumpling copies the little bow. Then he eats the food!'),
        HA('That’s not how it works, Dumpling!', 'shock'),
      ],
      [
        {
          domain: 'sel',
          skill: 'waiting, and saying thank you for food',
          standard: 'CASEL: Self-management',
          kind: 'do',
          after: 4,
          check: 'edu:say:ja:itadakimasu',
          lines: [
            HA('We wait until everyone is ready. Then we start together.'),
            N('(Hands together. A little bow. Say itadakimasu together!)'),
          ],
          parentNote: 'Waited for everyone, then said itadakimasu with hands together and a little bow before eating.',
        },
      ],
    ),
    sc(
      'lj4-s2-done',
      [
        N('“Itadakimasu!” Onigiri for everyone. Dumpling is already chewing.'),
        HA('Fruit! りんご (ringo, “apple”) and みかん (mikan, “mandarin orange”).'),
        N('(Say it: REEN-go, mee-KAHN.)'),
        HA('A mikan’s colour is オレンジ (orenji, “orange”)!'),
        N('(Say it: oh-REN-jee. It sounds like “orange”!)'),
        HA('All gone? Now we say ごちそうさま (gochisōsama, “said after eating”).'),
        N('(Say it: go-chee-SOH-sah-mah. Pat your full tummy.)'),
        SP('I’m too full to run. Don’t tell anyone.', 'happy'),
        HA('I’m telling everyone.'),
      ],
      [
        {
          domain: 'health',
          skill: 'noticing when your tummy is full',
          standard: 'ELOF: Perceptual, Motor, and Physical Development',
          kind: 'notice',
          after: 7,
          lines: [
            HA('Your tummy tells you when it’s full. Then: gochisōsama!'),
            N('(Ask: how does your tummy feel after lunch? Wait for an answer.)'),
          ],
          parentNote: 'Talked about how our tummies tell us when we are full, after saying gochisōsama (“said after eating”).',
        },
      ],
    ),
    sc(
      'lj4-s3',
      [
        N('Hana opens her sketchbook. A fresh page!'),
        HA('Let’s draw fruit. It’s not a race.'),
        NO('It’s a race.'),
        HA('いちご (ichigo, “strawberry”)! もも (momo, “peach”)!', 'happy'),
        N('(Say it: ee-CHEE-go, MOH-moh.)'),
        HA('Peaches are ピンク (pinku, “pink”). Fern’s plums are むらさき (murasaki, “purple”).'),
        N('(Say it: PEEN-koo, moo-rah-SAH-kee. Say murasaki three times fast!)'),
        N('Dumpling sits in the fruit bowl. He wants to be drawn.'),
        HA('What will you draw first?'),
      ],
      [
        {
          domain: 'art',
          skill: 'drawing and colouring three fruits',
          standard: 'ELOF: Perceptual, Motor, and Physical Development',
          kind: 'do',
          after: 6,
          check: 'edu:draw:ja:fruit:3',
          lines: [
            HA('Pick three fruits. Colour them in!'),
            N('(Draw together. An ichigo? A momo? A plum? Name each colour!)'),
          ],
          parentNote: 'Drew and coloured three fruits, naming their colours in Japanese.',
        },
      ],
      [
        {
          id: 'ichigo',
          label: 'An ichigo, very red.',
          then: [HA('Lots of little dots on the outside. Those are the seeds!', 'happy')],
        },
        {
          id: 'momo',
          label: 'A momo, pink and round.',
          then: [HA('Peaches are hard to draw. They look like a bottom.', 'happy')],
        },
        {
          id: 'plum',
          label: 'One of Fern’s purple plums.',
          then: [FE('You made it look lovely. Thank you.', 'soft')],
        },
      ],
    ),
    sc(
      'lj4-s3-done',
      [
        N('Three fruits on your page. Three on Hana’s.'),
        HA('Yours look happier. They go at the front.', 'happy'),
        N('In the corner is a small round smudge.'),
        N('Dumpling sat on the pencils!'),
        HA('He drew himself. Fine. He’s in.'),
      ],
      [
        {
          domain: 'maths',
          skill: 'adding 3 and 3',
          standard: 'K.OA.A.1',
          kind: 'ask',
          after: 0,
          prompt: [N('You drew three fruits. Hana drew three. How many fruits?'), N('(Count them together on your fingers.)')],
          options: [
            opt('5', [N('Let’s count: one, two, three. Then four, five, six. Six fruits!')]),
            opt('6', [HA('Six! Three and three make six.', 'happy')], true),
            opt('7', [N('Let’s count: one, two, three. Then four, five, six. Six fruits!')]),
          ],
          parentNote: 'Put two groups of three fruits together and counted six.',
        },
      ],
    ),
    sc(
      'lj4-complete',
      [
        N('Hana puts coloured cards on the grass.'),
        HA('Colour game! I say a colour. Dumpling sits on it.', 'happy'),
        HA('Aka! Kiiro! Midori!'),
        N('Hop, hop, hop!'),
        HA('Shiro! Kuro! Murasaki! Pinku! Orenji!'),
        N('He sits on purple so hard it creases.'),
        HA('And ao!'),
        N('Dumpling lies down on blue. All done.'),
        HA('The obentō is yours! Take it to a sad Nubbin.', 'happy'),
        HA('And draw everything. Except frogs. Not that I’m scared.', 'think'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'nine colour words in Japanese',
          standard: 'ELOF: Language and Communication',
          kind: 'do',
          after: 7,
          check: 'edu:quiz:ja:colours',
          lines: [
            N('(You say a colour word. Your child finds that colour in the room!)'),
            HA('Aka, ao, kiiro, midori, shiro, kuro, pinku, orenji, murasaki!', 'happy'),
          ],
          parentNote: 'Played a find-the-colour game with nine Japanese colour words.',
        },
      ],
    ),
  ],
  [
    COMMON_NOTES,
    'Words (sprout): obentō, onigiri, shiro, midori (s1); kiiro, aka, kuro (s1-done); ao, itadakimasu (s2); ringo, mikan, orenji, gochisōsama (s2-done); ichigo, momo, pinku, murasaki (s3). Ocha and sumimasen are left to the reader band. Katakana is not named in sprout; pinku and orenji are simply colour words.',
    'Plums are Fern’s and are named in English (the Japanese word isn’t on the list).',
    'Shape to trace: あ (a), 3 strokes.',
  ].join(' '),
);

// ================================================================== LJ5 Obāchan’s Letters
const LJ5: EduQuest = quest(
  'lj5',
  'Obāchan’s Letters',
  {
    'lj5-step1': {
      goal: 'Read one of Obāchan’s letters with Hana.',
      hint: 'Tap the letter on the kitchen table. A grown-up can read it with you.',
    },
    'lj5-step2': {
      goal: 'Draw a family picture with Hana.',
      hint: 'Draw anyone who is family to you. People and pets all count.',
    },
    'lj5-step3': {
      goal: 'Tell Hana how each Nubbin feels.',
      hint: 'Look at each Nubbin’s face. Is it happy, sad, sleepy or scared?',
    },
  },
  [
    sc(
      'lj5-s1',
      [
        N('Rain on the roof. Pitter, patter.'),
        N('Hana opens a tin of letters.'),
        HA('Hazel used to write letters to my grandma.'),
        HA('I call my grandma おばあちゃん (obāchan, “grandma”).', 'soft'),
        N('(Say it: oh-BAH-chahn. Long and soft in the middle.)'),
        HA('Obāchan wrote: our ねこ (neko, “cat”) sleeps on my letters!'),
        N('(Say it: NEH-koh. Meow!)'),
        HA('She signed it: from your ともだち (tomodachi, “friend”).', 'soft'),
        N('(Say it: toh-moh-DAH-chee. Who is your friend?)'),
        HA('Your friend. I like that.', 'soft'),
      ],
      [
        {
          domain: 'science',
          skill: 'animal names and the sounds they make',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'do',
          after: 6,
          check: 'edu:say:ja:animal-sounds',
          lines: [
            HA('The いぬ (inu, “dog”) next door says woof!'),
            N('(Say it: ee-NOO. Woof, woof!)'),
            HA('The とり (tori, “bird”) says tweet!'),
            N('(Say it: TOH-ree. Flap your arms!)'),
          ],
          parentNote: 'Learned neko (“cat”), inu (“dog”) and tori (“bird”), and made each animal’s sound.',
        },
      ],
    ),
    sc(
      'lj5-s1-done',
      [
        N('You read the rest together. Hana does the voices.'),
        N('The neko gets a very grand voice.'),
        HA('A letter is like a little visit.', 'soft'),
        HA('I miss my obāchan. She’s fine. I just miss her.', 'soft'),
        N('Hana pins the letter above her bed.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'missing someone, and what helps',
          standard: 'CASEL: Self-awareness',
          kind: 'notice',
          after: 3,
          lines: [
            HA('When I miss her, I draw her a picture.', 'soft'),
            N('(Ask: who do you miss sometimes? What helps you feel better?)'),
          ],
          parentNote: 'Talked about missing someone, and things that help, like drawing them a picture.',
        },
      ],
    ),
    sc(
      'lj5-s2',
      [
        N('The rain stops. Hana spreads big paper on the floor.'),
        HA('Let’s draw our かぞく (kazoku, “family”).', 'happy'),
        N('(Say it: kah-ZOH-koo.)'),
        HA('My おかあさん (okāsan, “mum”). My おとうさん (otōsan, “dad”).'),
        N('(Say it: oh-KAH-sahn, oh-TOH-sahn.)'),
        HA('And my おじいちゃん (ojiichan, “grandpa”).', 'soft'),
        N('(Say it: oh-JEE-chahn.)'),
        HA('He died when I was little. That means his body stopped working.', 'soft'),
        HA('It won’t start again. But I still draw him in every picture.', 'soft'),
        HA('He’s still in my family.', 'soft'),
      ],
      [
        {
          domain: 'art',
          skill: 'drawing your own family',
          standard: 'ELOF: Social and Emotional Development',
          kind: 'do',
          after: 9,
          check: 'edu:draw:ja:kazoku',
          lines: [
            HA('Now yours. Anyone who is family to you.'),
            HA('Families are all different. People, pets, friends. They all count.', 'happy'),
            N('(Draw your family together. Say who each one is.)'),
          ],
          parentNote: 'Drew their own family, and heard that families are all different and everyone in them counts.',
        },
      ],
      [
        {
          id: 'grownups',
          label: 'Start with the grown-ups who look after me.',
          then: [HA('Good! Write their names. Names are labels too.')],
        },
        {
          id: 'pets',
          label: 'Start with my pets.',
          then: [HA('Pets first! My rabbit would agree.', 'happy')],
        },
        {
          id: 'friends',
          label: 'Start with my friends.',
          then: [HA('Friends can be family too. Nova is mine this summer.', 'happy'), NO('I’m honoured.', 'soft')],
        },
      ],
    ),
    sc(
      'lj5-s2-done',
      [
        N('Two families on one big paper.'),
        HA('And our うさぎ (usagi, “rabbit”). She’s called Biscuit. She bites.', 'happy'),
        N('(Say it: oo-SAH-gee. Hop like a rabbit!)'),
        NO('What’s that bird in the tree? It looks cross.', 'think'),
        HA('A ふくろう (fukurō, “owl”). Owls always look cross.'),
        N('(Say it: foo-koo-ROH. Hoo, hoo!)'),
        HA('It was a very kind owl.'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'tracing the kana shape う (u)',
          standard: 'ELOF: Literacy',
          kind: 'do',
          after: 2,
          check: 'edu:trace:ja:u',
          lines: [
            HA('Usagi starts with this shape: う (u).'),
            HA('It says “oo”. A little line on top, like an ear.'),
            N('(Trace it: the little line first, then the big curve.)'),
          ],
          parentNote: 'Traced the Japanese shape う (u), the first shape of usagi (“rabbit”).',
        },
      ],
    ),
    sc(
      'lj5-s3',
      [
        N('Clover sits in the grass with the Nubbins.'),
        HA('うれしい (ureshii, “happy”)! That one is rolling about.', 'happy'),
        N('(Say it: oo-REH-shee. Make a happy face!)'),
        HA('かなしい (kanashii, “sad”). That one lost its ball.'),
        N('(Say it: kah-NAH-shee. Make a sad face.)'),
        N('Plop! A frog lands on Hana’s shoe.'),
        HA('かえる (kaeru, “frog”)! It’s a kaeru!', 'shock'),
        N('(Say it: kah-EH-roo. Ribbit!)'),
        HA('I’m not こわい (kowai, “scared”). Not at all.', 'think'),
        N('(Say it: koh-WAI.) Hana is standing on a chair.'),
      ],
      [
        {
          domain: 'sel',
          skill: 'it is OK to feel scared',
          standard: 'CASEL: Self-awareness',
          kind: 'notice',
          after: 9,
          lines: [
            CL('It’s all right to be scared. Even of something small.', 'soft'),
            HA('…Maybe I’m a little bit kowai.'),
            N('(Ask: what helps when you feel scared?)'),
          ],
          parentNote: 'Heard that it is all right to feel scared, and talked about what helps.',
        },
      ],
      [
        {
          id: 'okay',
          label: '“It’s OK to be scared.”',
          then: [HA('Thank you. It is OK. I’m staying up here, though.', 'soft')],
        },
        {
          id: 'move',
          label: 'Gently carry the frog to the pond.',
          then: [N('You cup the frog in your hands. Back to the pond.'), HA('Thank you. Really.', 'soft')],
        },
        {
          id: 'together',
          label: '“Let’s look at it together.”',
          then: [N('You stand by the chair. The kaeru blinks. Hana blinks.'), HA('It’s got quite a nice face.', 'think')],
        },
      ],
    ),
    sc(
      'lj5-s3-done',
      [
        N('You look at each Nubbin’s face.'),
        HA('The ball came back! Now that one is ureshii!', 'happy'),
        N('Dumpling does a huge yawn. Aaaah.'),
        HA('Dumpling is ねむい (nemui, “sleepy”). Always.'),
        N('(Say it: neh-MOO-ee. Do a big yawn!)'),
        CL('And you, Hana?', 'soft'),
        HA('たのしい (tanoshii, “fun”)! Today was fun. Even the frog. Mostly.', 'happy'),
        N('(Say it: tah-NOH-shee. Do a happy wiggle!)'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'feelings words in Japanese',
          standard: 'ELOF: Language and Communication',
          kind: 'do',
          after: 7,
          check: 'edu:show:ja:feelings',
          lines: [
            HA('Show me ureshii! Kanashii! Nemui!', 'happy'),
            N('(Make each face together: happy, sad, sleepy!)'),
          ],
          parentNote: 'Made faces for ureshii (“happy”), kanashii (“sad”) and nemui (“sleepy”).',
        },
      ],
    ),
    sc(
      'lj5-complete',
      [
        N('Evening. Hana writes a letter home.'),
        HA('Help me check my words! Dumpling makes faces.'),
        N('Dumpling smiles. Then droops. Then yawns. Then hides.'),
        HA('Ureshii! Kanashii! Nemui! Kowai!', 'happy'),
        HA('Kazoku: okāsan, otōsan, obāchan, ojiichan, tomodachi!'),
        HA('Animals: neko, inu, tori, usagi, fukurō!'),
        HA('And one kaeru. He’s in the story now.', 'think'),
        HA('Obāchan’s letters can stay here. In a little box.', 'soft'),
        HA('And here’s my happiest face. For when it’s tanoshii!', 'happy'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 5',
          standard: 'K.CC.B.5',
          kind: 'do',
          after: 5,
          check: 'edu:count:ja:animals:5',
          lines: [
            HA('How many animals in my letter? Count them!'),
            N('(Count on your fingers: neko, inu, tori, usagi, fukurō. Five!)'),
          ],
          parentNote: 'Counted five animals in Hana’s letter, saying each one’s Japanese name.',
        },
      ],
    ),
  ],
  [
    COMMON_NOTES,
    'Words (sprout): obāchan, neko, tomodachi, inu, tori (s1); kazoku, okāsan, otōsan, ojiichan (s2); usagi, fukurō (s2-done); ureshii, kanashii, kaeru, kowai (s3); nemui, tanoshii (s3-done).',
    'Hazel appears only as someone who used to write letters, in the past tense.',
    'Families vary: the drawing never assumes a mum, dad or grandparents; names count as labels. Ojiichan’s death is said plainly, as EDU-STYLE asks (“his body stopped working. It won’t start again”), then the comfort: Hana still draws him; he is still her family.',
    'Hana’s fear of the frog is real here and that is fine: Clover’s line is the point.',
    'Shape to trace: う (u), 2 strokes.',
  ].join(' '),
);

// ================================================================== LJ6 Floating Lanterns
const LJ6: EduQuest = quest(
  'lj6',
  'Floating Lanterns',
  {
    'lj6-step1': {
      goal: 'Sit with Hana by the stream.',
      hint: 'Hana is sitting by the stream. Tap her and choose Talk.',
    },
    'lj6-step2': {
      goal: 'Help Hana make a lantern for her grandpa.',
      hint: 'Fold a lantern at Fern’s table. You can make one too. A grown-up can help write the name.',
    },
    'lj6-step3': {
      goal: 'Float Hana’s lantern with her at dusk. Later, join the party!',
      hint: 'Go to the stream in the evening. Luna lights the lanterns. The party is back at the cottage.',
    },
  },
  [
    sc(
      'lj6-s1',
      [
        N('Late summer. Hana sits by the stream. She is not drawing.'),
        N('That means something is up.'),
        HA('At home, there’s a special time in summer.', 'soft'),
        HA('Families remember the people in their family who have died.', 'soft'),
        HA('My family floats a paper lantern down the river for my grandpa.', 'soft'),
        HA('River is かわ (kawa, “river”). This stream is a little kawa.'),
        N('(Say it: KAH-wah. Point to the water.)'),
        HA('The lantern has a ひかり (hikari, “light”) inside.', 'soft'),
        N('(Say it: hee-KAH-ree.)'),
        HA('This year I’m here. Could I float his lantern on your stream?', 'soft'),
      ],
      [
        {
          domain: 'social-studies',
          skill: 'families remember people in different ways',
          kind: 'notice',
          after: 4,
          lines: [
            N('(Tell your child: families all over the world remember people who have died.)'),
            N('(Some tell stories. Some look at photos. Some float lanterns.)'),
          ],
          parentNote: 'Heard that Hana’s family floats a paper lantern in summer to remember her grandpa, and that families everywhere remember people in their own ways.',
        },
      ],
      [
        {
          id: 'yes',
          label: '“Yes! We’ll all come.”',
          then: [HA('Really? Then I need paper. And sticks. And you, to help.', 'soft')],
        },
        {
          id: 'ask',
          label: '“Tell me about your grandpa.”',
          then: [
            HA('He went fishing every week. He never caught anything.', 'soft'),
            HA('He said that wasn’t the point. He taught me to run.', 'happy'),
          ],
        },
        {
          id: 'sit',
          label: 'Sit next to her for a while.',
          then: [N('You sit together. The water goes by.'), HA('Thank you. That helped.', 'soft')],
        },
      ],
    ),
    sc(
      'lj6-s1-done',
      [
        N('Hana is drawing again! Lanterns and tiny lights.'),
        HA('And this is my grandma’s やま (yama, “mountain”).', 'happy'),
        N('(Say it: YAH-mah. Make a pointy mountain with your arms!)'),
        HA('In winter it has ゆき (yuki, “snow”) on top.'),
        N('(Say it: YOO-kee. Shiver! Brrr!)'),
        HA('Everyone is coming tomorrow. Even Ember!', 'happy'),
        NO('Ember said “fine”, and asked what time. That’s a yes.'),
      ],
      [
        {
          domain: 'science',
          skill: 'snow melts into water when it warms',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'ask',
          after: 4,
          prompt: [HA('When the spring sun warms the yuki on the yama, what happens?')],
          options: [
            opt('It melts into water.', [HA('Yes! Warm snow melts. It turns into water.', 'happy')], true),
            opt('It turns into a snowman.', [HA('Only if you build one! Warm snow melts into water.')]),
          ],
          parentNote: 'Learned that snow (yuki) melts into water when the sun warms it.',
        },
      ],
    ),
    sc(
      'lj6-s2',
      [
        N('Fern’s kitchen is full of paper, glue and sticks.'),
        FE('The sticks are from the old plum き (ki, “tree”).'),
        N('(Say it: KEE. Stand tall like a tree!)'),
        N('Pixel fills a bucket with みず (mizu, “water”).'),
        N('(Say it: MEE-zoo. Splash!)'),
        N('The first lantern goes in. Glug. It sinks.'),
        PX('Paper gets soggy. Wood floats. Next one gets a wooden base.', 'think'),
        HA('I write my grandpa’s name on mine. Slowly.', 'soft'),
        HA('You can make one too. For someone you remember, or love.'),
        N('Hana writes very carefully. Nobody talks. Shh.'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'tracing the kana shape き (ki)',
          standard: 'ELOF: Literacy',
          kind: 'do',
          after: 2,
          check: 'edu:trace:ja:ki',
          lines: [
            HA('This shape is き (ki). It says “ki”.'),
            HA('All by itself, ki means tree!', 'happy'),
            N('(Trace it: two lines across, one line down, then the curve.)'),
          ],
          parentNote: 'Traced the Japanese shape き (ki), which on its own is the word for “tree”.',
        },
      ],
      [
        {
          id: 'remember',
          label: 'Write the name of someone I remember.',
          then: [HA('Write it big. So it shows from far away.', 'soft'), N('(A grown-up can help write the name.)')],
        },
        {
          id: 'love',
          label: 'Write the name of someone I love.',
          then: [HA('Yes. Grandpa would like that. Lanterns are for love too.', 'soft')],
        },
        {
          id: 'word',
          label: 'Ask Hana to help write the name.',
          then: [HA('Say it slowly. I’ll write it, and you go over it.', 'soft'), N('(A grown-up can help too.)')],
        },
      ],
    ),
    sc(
      'lj6-s2-done',
      [
        N('Lanterns dry on the windowsill. A long row.'),
        HA('Mine is the best one.', 'happy'),
        FE('It’s not a race, Hana.'),
        HA('…You’re right. This one isn’t.', 'soft'),
        N('Pixel puts the test one in the mizu. It floats!'),
        N('Pixel nods. Good.'),
      ],
      [
        {
          domain: 'science',
          skill: 'what floats and what sinks',
          standard: 'ELOF: Scientific Reasoning',
          kind: 'ask',
          after: 4,
          prompt: [N('The paper one sank. Which one floats?')],
          options: [
            opt('The one with a wooden base.', [PX('Yes! Wood floats. The paper stays dry on top.', 'happy')], true),
            opt('A paper one with no base.', [PX('That one went glug! The wooden base helps it float.')]),
          ],
          parentNote: 'Saw that a lantern with a wooden base floats, while soggy paper sinks.',
        },
      ],
    ),
    sc(
      'lj6-s3',
      [
        N('Dusk. Everyone walks to the stream with Hana.'),
        HA('No あめ (ame, “rain”) tonight. Good!', 'happy'),
        N('(Say it: AH-meh. Pitter-patter with your fingers.)'),
        LU('I’ll light them. One at a time. No hurry.', 'soft'),
        HA('This one is for my grandpa.', 'soft'),
        N('Hana’s little hikari floats away. Slowly, slowly.'),
        HA('He died. His body stopped working. It won’t start again.', 'soft'),
        HA('But I still love him. The lantern helps me remember him.', 'soft'),
        N('A frog sits on the bank by Hana. It watches the lights.'),
        HA('…You can watch too, frog.', 'soft'),
      ],
      [
        {
          domain: 'sel',
          skill: 'remembering someone who has died',
          standard: 'ELOF: Social and Emotional Development',
          kind: 'notice',
          after: 7,
          lines: [
            HA('I feel a bit sad. And a bit happy. Both at once.', 'soft'),
            N('(Say: it’s OK to feel sad and happy together.)'),
            N('(Ask: who would you like to remember, or send love to?)'),
          ],
          parentNote: 'Heard plainly what dying means, and that remembering, and feeling sad and happy at once, are all OK.',
        },
      ],
    ),
    sc(
      'lj6-s3-done',
      [
        N('The lanterns float on the kawa. No ame. Just stars.'),
        HA('ありがとう (arigatō). For doing this with me.', 'soft'),
        N('(Say it: ah-ree-gah-TOH. Say it back to Hana.)'),
        N('Later, at the cottage, Sparks shouts: PARTY!'),
        HA('Hello and good night words! Ohayō! Konnichiwa! Konbanwa! Oyasumi!', 'happy'),
        N('(Say them: oh-hah-YOH, kon-nee-chee-WAH, kom-bahn-WAH, oh-yah-SOO-mee. Bow each time!)'),
        HA('Hajimemashite! Hai! Iie! Gomen nasai!'),
        N('(Say them: hah-jee-meh-MASH-teh, HAI, EE-eh, go-men nah-SAI.)'),
        HA('Now count the Nubbins in the front row!', 'happy'),
      ],
      [
        {
          domain: 'maths',
          skill: 'count to 10 in Japanese',
          standard: 'K.CC.B.5',
          kind: 'do',
          after: 8,
          check: 'edu:count:ja:nubbins:10',
          lines: [
            HA('Ichi, ni, san, yon, go!'),
            N('(Say them: EE-chee, NEE, SAHN, YOHN, GO.)'),
            HA('Roku, nana, hachi, kyū, jū!'),
            N('(Say them: ROH-koo, NAH-nah, HAH-chee, KYOO, JOO. A finger each!)'),
          ],
          parentNote: 'Counted ten Nubbins at Hana’s party in Japanese, from ichi to jū.',
        },
      ],
    ),
    sc(
      'lj6-complete',
      [
        N('The party goes on, up at the cottage.'),
        HA('Food! Ringo, mikan, ichigo, momo, onigiri, obentō! Itadakimasu!', 'happy'),
        N('(Say them: REEN-go, mee-KAHN, ee-CHEE-go, MOH-moh, oh-nee-GEE-ree, oh-ben-TOH, ee-tah-dah-kee-MAS.)'),
        N('Dumpling eats a ringo before Hana says the word!'),
        HA('Family! Okāsan, otōsan, obāchan, ojiichan, tomodachi, kazoku!'),
        N('(Say them: oh-KAH-sahn, oh-TOH-sahn, oh-BAH-chahn, oh-JEE-chahn, toh-moh-DAH-chee, kah-ZOH-koo.)'),
        HA('The world! Ki, hana, mizu, kawa, yama, ame, yuki, hoshi, tsuki, hikari!'),
        N('(Say them: KEE, HAH-nah, MEE-zoo, KAH-wah, YAH-mah, AH-meh, YOO-kee, HOH-shee, TSOO-kee, hee-KAH-ree.)'),
        NO('A Hiragana Keeper! That’s you!', 'happy'),
        HA('I go home soon. So: またね (mata ne)!', 'soft'),
      ],
      [
        {
          domain: 'literacy',
          skill: 'reviewing every word from the questline',
          standard: 'ELOF: Language and Communication',
          kind: 'do',
          after: 7,
          check: 'edu:review:ja:party',
          lines: [
            HA('Colours! Aka, ao, kiiro, midori, shiro, kuro, pinku, orenji, murasaki!'),
            N('(Say them: ah-KAH, AH-oh, kee-EE-roh, mee-DOH-ree, shee-ROH, koo-ROH, PEEN-koo, oh-REN-jee, moo-rah-SAH-kee.)'),
            HA('Animals! Neko, inu, tori, usagi, fukurō, kaeru, koi, sakana!'),
            N('(Say them: NEH-koh, ee-NOO, TOH-ree, oo-SAH-gee, foo-koo-ROH, kah-EH-roo, KOY, sah-KAH-nah.)'),
            HA('Feelings! Ureshii, tanoshii, kanashii, nemui, kowai!'),
            N('(Say them: oo-REH-shee, tah-NOH-shee, kah-NAH-shee, neh-MOO-ee, koh-WAI.)'),
            HA('Pond words! Ue! Ike! Kao! And after lunch: gochisōsama!'),
            N('(Say them: OO-eh, EE-keh, KAH-oh, go-chee-SOH-sah-mah. Jump up, point, pull a face!)'),
          ],
          parentNote: 'Played Hana’s review game: colours, animals, feelings and pond words in Japanese, said back and acted out.',
        },
        {
          domain: 'sel',
          skill: 'saying goodbye to a friend',
          standard: 'CASEL: Social awareness',
          kind: 'notice',
          after: 9,
          lines: [
            N('(Say it: mah-tah NEH. It means “see you”. Wave!)'),
            HA('See you means I’ll see you again.', 'soft'),
            N('(Ask: how do you say goodbye to a friend?)'),
          ],
          parentNote: 'Said mata ne (“see you”) to Hana and talked about saying goodbye to a friend.',
        },
      ],
    ),
  ],
  [
    COMMON_NOTES,
    'Words (sprout): kawa, hikari (s1); yama, yuki (s1-done); ki, mizu (s2); ame (s3); then the review party (s3-done and complete) brings back every sprout word with its sound-alike.',
    'Culture, sprout version: Obon and tōrō nagashi are described in English only (“a special time in summer when families remember the people in their family who have died”; “my family floats a paper lantern down the river for my grandpa”); the names are reader-band words. No religious detail, no spirits. The floating is Hana’s family’s custom, which she invites the child to share: never a game, a count or a reward. The counting lesson is later, at the party, with Nubbins.',
    'Grief: Hana’s grandpa died; this is said plainly (“his body stopped working. It won’t start again”), never as sleep or going away, and the lantern is a way to remember, not something that carries him anywhere. No oyasumi or nemui near the lantern scene. No lantern is made for Hazel, and nothing says whether she is alive.',
    'Lanterns: Luna lights them; children never handle the flame.',
    'Shape to trace: き (ki), 4 strokes in school order.',
  ].join(' '),
);

export const EDU_LANG_JAPANESE_SPROUT: EduQuest[] = [LJ1, LJ2, LJ3, LJ4, LJ5, LJ6];

export const CHECKS: string[] = [
  // LJ1
  'edu:bow:konnichiwa',
  'edu:say:ja:hai-iie',
  'edu:whisper:ja:oyasumi',
  'edu:trace:ja:ko',
  'edu:sing:ja:bowing-song',
  // LJ2
  'edu:say:ja:vowel-sounds',
  'edu:trace:ja:ku',
  'edu:point:face:eyes-nose-mouth',
  'edu:draw:flower',
  'edu:act:ja:pond-words',
  // LJ3
  'edu:count:ja:koi:5',
  'edu:trace:ja:i',
  'edu:count:ja:laps:3',
  'edu:count:ja:hoshi:10',
  'edu:clap:ja:koi-chant',
  // LJ4
  'edu:sort:ja:bento:colour',
  'edu:trace:ja:a',
  'edu:say:ja:itadakimasu',
  'edu:draw:ja:fruit:3',
  'edu:quiz:ja:colours',
  // LJ5
  'edu:say:ja:animal-sounds',
  'edu:draw:ja:kazoku',
  'edu:trace:ja:u',
  'edu:show:ja:feelings',
  'edu:count:ja:animals:5',
  // LJ6
  'edu:trace:ja:ki',
  'edu:count:ja:nubbins:10',
  'edu:review:ja:party',
];
