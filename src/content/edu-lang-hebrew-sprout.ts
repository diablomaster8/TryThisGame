/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): the Hebrew questline
 * “Ori’s Alef-Bet” (LH1–LH6).
 *
 *   LH1 Shalom, Ori!                saying hello, please and thank you, yes and no, morning/evening/night,
 *                                   counting three Nubbins, why we sleep, the chant, the shape ש
 *   LH2 Right to Left               which way Hebrew goes, counting four pebbles, wobbly first tries,
 *                                   things that give light, the shape א, hopping right to left
 *   LH3 Counting Plums              counting 1–10 in Hebrew, asking for help, being a good sport, stars at
 *                                   night, the shape י, a countdown chant
 *   LH4 Colours of the Orchard      sorting fruit by colour, sharing, what animals need, a colour pattern,
 *                                   seeds, the shape ל
 *   LH5 Savta’s Letters             letters long ago, animal sounds, family words, drawing a family, feeling
 *                                   words, two feelings at once, the shape ס
 *   LH6 The New Year of the Trees   Tu BiShvat (the brief’s facts only), remembering a friend, what a tree
 *                                   needs, waiting, the shape ג, the review party, the chant
 *
 * One EduScene for each of the 42 base scenes in lang-hebrew.ts (every step scene, done scene and
 * complete scene). Every base choice is kind and safe, so sprout keeps them all, with the same ids.
 * Base choices set no flags, so these set none either.
 *
 * Read-aloud rules: spoken words only. The first time a Hebrew word appears in a quest it is written
 * native script first, then the romanisation and meaning in brackets, and a narrator line gives the
 * grown-up the sound-alike: “(Say it: sha-LOME.)”. Call-and-response throughout. One letter shape per
 * quest, as a shape to trace (“This shape says ‘sh’”), never as reading: ש, א, י, ל, ס, ג.
 * Only vetted words, spelled exactly (with niqqud). Sprout teaches a smaller set than the base: no
 * ani / korim li, toda raba, lehitra’ot, lavan, te’ena, tamar, saba, dag; those stay in the base and
 * reader bands. Every word used here comes back at least three times.
 * Hazel appears only as someone who used to write letters. British spelling. See EDU-STYLE.md.
 */
import type { EduDomain, EduQuest, EduScene, Lesson, LessonOption } from './types';
import type { Choice, Line } from '../config/story';

type Mood = NonNullable<Line['mood']>;

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const Y = say('you');
const NV = say('nova');
const FE = say('fern');
const CL = say('clover');
const BY = say('byte');
const O = say('ori');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;

/** One sprout scene. Lesson ids are `sprout:<of>-l<n>`, numbered in play order. */
const sc = (of: string, lines: Line[], beats: Beat[], choices?: Choice[]): EduScene => {
  const id = `sprout:${of}`;
  const s: EduScene = {
    id,
    of,
    band: 'sprout',
    lines,
    lessons: [...beats].sort((a, b) => a.after - b.after).map((b, i) => ({ id: `${id}-l${i + 1}`, ...b })),
  };
  if (choices) s.choices = choices;
  return s;
};

const std = (standard?: string): { standard?: string } => (standard ? { standard } : {});

const ask = (
  domain: EduDomain,
  skill: string,
  after: number,
  prompt: Line[],
  options: LessonOption[],
  parentNote: string,
  standard?: string,
): Beat => ({ domain, skill, kind: 'ask', after, prompt, options, parentNote, ...std(standard) });

const notice = (domain: EduDomain, skill: string, after: number, lines: Line[], parentNote: string, standard?: string): Beat => ({
  domain,
  skill,
  kind: 'notice',
  after,
  lines,
  parentNote,
  ...std(standard),
});

const act = (
  domain: EduDomain,
  skill: string,
  after: number,
  check: string,
  lines: Line[],
  parentNote: string,
  standard?: string,
): Beat => ({ domain, skill, kind: 'do', after, check, lines, parentNote, ...std(standard) });

const opt = (label: string, reply: Line[], best?: boolean): LessonOption => (best ? { label, reply, best } : { label, reply });

const quest = (of: string, title: string, goals: EduQuest['goals'], scenes: EduScene[], notes: string): EduQuest => ({
  id: `sprout:${of}`,
  of,
  band: 'sprout',
  title,
  goals,
  scenes,
  notes,
});

// ---------------------------------------------------------------- shared notes
const COMMON_NOTES = [
  'Sprout band: a grown-up reads every line aloud. Narrator lines in brackets are prompts for the grown-up, not text to perform.',
  'Fonts: Noto Sans Hebrew (or similar) for every Hebrew string, with niqqud rendered correctly.',
  'Bidi: wrap each Hebrew run in an isolate (U+2067 RLI … U+2069 PDI, or <bdi dir="rtl">) so brackets and punctuation stay on the correct side.',
  'Audio: every Hebrew word needs a native-speaker recording (the VocabItem.audio clips in HEBREW_COURSE), never TTS. Tapping a Hebrew word plays its clip; this matters most in sprout, where the grown-up may not know the sounds.',
  'Tracing: one letter shape per quest, shown large, as a shape to trace, never to read. Hebrew letters are written right to left: the tracing guide starts each stroke from the right side; do not invent a stroke order beyond that.',
  'Call-and-response beats wait for the child: show a big “your turn” bubble and a replay button, with no timer.',
].join(' ');

const notes = (specific: string): string => `${specific} ${COMMON_NOTES}`;

// ================================================================== LH1 Shalom, Ori!
const LH1: EduQuest = quest(
  'lh1',
  'Shalom, Ori!',
  {
    'lh1-step1': {
      goal: 'Say shalom to Ori at the gate.',
      hint: 'Go to the gate and tap Ori. Wave and say shalom!',
    },
    'lh1-step2': {
      goal: 'Teach three Nubbins to wave at shalom.',
      hint: 'Stand by a Nubbin. Say shalom and wave. When it waves back, say toda!',
    },
    'lh1-step3': {
      goal: 'Say laila tov to everyone.',
      hint: 'Find Fern, Clover and Nova. Tap each one and say laila tov.',
    },
  },
  [
    // ------------------------------------------------ step 1: the gate
    sc(
      'lh1-s1',
      [
        N('Rattle, rattle! Someone is stuck at the gate.'),
        NV('Lift and push, Ori! Lift and push!'),
        N('Creak! The gate opens. In tumbles a boy with a big tin.'),
        O('שָׁלוֹם (shalom, “hello”)! Your gate is very strong.', 'happy'),
        N('(Say it: sha-LOME. Wave as you say it!)'),
        NV('This is Ori. He lives in Israel. He is ten.'),
        O('Shalom means hello. It means goodbye too!', 'think'),
        N('A wild round Nubbin waves at Ori. Wave… bump! It falls over.'),
        O('I can ask “How are you?” two ways. Which way?'),
      ],
      [
        act(
          'literacy',
          'say hello in Hebrew: call and response',
          4,
          'edu:say:he:shalom',
          [
            O('I say shalom. You say shalom!'),
            O('Shalom!'),
            N('(Your turn. Wave and say: sha-LOME!)'),
            O('Perfect! A big wave and a big shalom.', 'happy'),
          ],
          'Said “shalom” (hello) back to Ori, with a wave, in a call-and-response game.',
          'ELOF: Language and Communication',
        ),
      ],
      [
        {
          id: 'shlomkha',
          label: 'Ask me “ma shlomkha?” (the boy way).',
          then: [
            O('מָה שְׁלוֹמְךָ? (ma shlomkha?, “how are you?”)'),
            N('(Say it: mah shlom-KHA.)'),
            Y('בְּסֵדֶר (beseder, “fine”)!'),
            N('(Say it: beh-SEH-der.)'),
            O('Beseder! That means OK. Fine!', 'happy'),
          ],
        },
        {
          id: 'shlomekh',
          label: 'Ask me “ma shlomekh?” (the girl way).',
          then: [
            O('מָה שְׁלוֹמֵךְ? (ma shlomekh?, “how are you?”)'),
            N('(Say it: mah shlo-MEKH.)'),
            Y('בְּסֵדֶר (beseder, “fine”)!'),
            N('(Say it: beh-SEH-der.)'),
            O('Beseder! That means OK. Fine!', 'happy'),
          ],
        },
        {
          id: 'either',
          label: 'Either way. Just say shalom!',
          then: [
            O('Shalom, then! When I ask how you are, say בְּסֵדֶר (beseder, “fine”).'),
            N('(Say it: beh-SEH-der.)'),
            Y('Beseder!'),
            O('Perfect! You sound like my uncle.', 'happy'),
          ],
        },
      ],
    ),
    sc(
      'lh1-s1-done',
      [
        O('You said it! A big shalom!', 'happy'),
        N('The round Nubbin waves again. Bump! Down it goes.'),
        N('It lies on the grass. It looks very pleased.'),
        O('I will call it the Wobbler. It is my favourite.'),
        O('Shh. Don’t tell the other Nubbins.'),
      ],
      [
        ask(
          'sel',
          'helping someone new feel welcome',
          3,
          [O('I’m new here. Everything is new!'), N('What helps a new friend feel welcome?')],
          [
            opt('Smile and say shalom', [O('Shalom! That feels nice. Thank you.', 'happy')], true),
            opt('Run away and hide', [O('Feeling shy is OK. A little wave helps too!', 'soft')]),
          ],
          'Talked about how to help someone new feel welcome: a smile and a hello.',
          'CASEL: Social awareness',
        ),
      ],
    ),
    // ------------------------------------------------ step 2: Nubbin school
    sc(
      'lh1-s2',
      [
        O('Nubbin school! I’m the coach. You help!'),
        N('Three Nubbins: the Wobbler, a shy one, a sleepy one.'),
        O('Rule one: say thank you. תּוֹדָה (toda, “thank you”)!'),
        N('(Say it: toe-DAH.)'),
        O('Rule two: say please. בְּבַקָּשָׁה (bevakasha, “please”)!'),
        N('(Say it: beh-vah-kah-SHAH. It’s a long one!)'),
        O('When they wave, we cheer טוֹב (tov, “good”)!'),
        N('(Say it: TOVE. Cheer it loud!)'),
        N('The shy Nubbin hides behind a dandelion. Peek… gone.'),
        N('The Wobbler waves at nobody. Bump! Up again.'),
      ],
      [
        act(
          'sel',
          'saying please and thank you',
          5,
          'edu:say:he:toda',
          [
            O('I say toda. You say toda!'),
            N('(Your turn: toe-DAH!)'),
            O('Now bevakasha. Please!'),
            N('(Your turn: beh-vah-kah-SHAH!)'),
            O('Toda! You have very good manners.', 'happy'),
          ],
          'Said “toda” (thank you) and “bevakasha” (please) back to Ori, and talked about good manners.',
          'CASEL: Relationship skills',
        ),
      ],
      [
        {
          id: 'sit-wait',
          label: 'Sit by the shy one and wait.',
          then: [
            N('You sit. You wait. Very quietly.'),
            N('A tiny paw lifts. A little wave!'),
            O('כֵּן (ken, “yes”)! She waved! Toda!', 'happy'),
            N('(Say it: KEN. A happy yes!)'),
          ],
        },
        {
          id: 'say-softly',
          label: 'Whisper shalom very softly.',
          then: [
            N('You whisper: shalom.'),
            N('The shy one tilts her head. A tiny paw lifts!'),
            O('כֵּן (ken, “yes”)! Quiet shalom for a quiet Nubbin.', 'happy'),
            N('(Say it: KEN. A happy yes!)'),
          ],
        },
      ],
    ),
    sc(
      'lh1-s2-done',
      [
        N('The shy one waves. The sleepy one waves in its sleep.'),
        N('The Wobbler waves. Bump! It waves from the ground.'),
        O('Three Nubbins! Toda, toda, toda!', 'happy'),
        Y('Bevakasha!'),
        O('Bevakasha means please. And you’re welcome! A busy word.', 'think'),
        O('Can the Wobbler stand up yet? לֹא (lo, “no”)!'),
        N('(Say it: LOW. Shake your head as you say it.)'),
      ],
      [
        act(
          'maths',
          'count to 3',
          2,
          'edu:count:nubbins:3',
          [
            N('(Count the waving Nubbins together. Touch each one.)'),
            O('One, two, three! Three Nubbins waving. Tov!', 'happy'),
          ],
          'Counted three Nubbins, touching each one once.',
          'K.CC.B.5',
        ),
      ],
    ),
    // ------------------------------------------------ step 3: good night
    sc(
      'lh1-s3',
      [
        N('The sun goes down. The lanterns blink on.'),
        O('Hebrew has a “good” for each time of day.'),
        O('Morning is בֹּקֶר טוֹב (boker tov, “good morning”).'),
        N('(Say it: BO-ker TOVE.)'),
        O('Evening is עֶרֶב טוֹב (erev tov, “good evening”). Like now!'),
        N('(Say it: EH-rev TOVE.)'),
        O('Bedtime is לַיְלָה טוֹב (laila tov, “good night”).'),
        N('(Say it: LIE-la TOVE. Give a big yawn!)'),
        NV('Say laila tov to everyone. Fern is in the orchard.'),
        N('The Wobbler yawns, waves, and falls asleep where it lands.'),
      ],
      [
        ask(
          'science',
          'the order of the day: morning, evening, night',
          7,
          [O('First morning. Then evening. What comes next?')],
          [
            opt('Night! Laila tov!', [O('Yes! Night comes after evening. Laila tov!', 'happy')], true),
            opt('Morning again', [O('Morning comes back after the night. Evening, then night, then morning!')]),
          ],
          'Put the parts of the day in order: morning, evening, night.',
          'ELOF: Scientific Reasoning',
        ),
      ],
    ),
    sc(
      'lh1-s3-done',
      [
        FE('Laila tov! Did I say it right?'),
        O('Perfect, Fern! Toda!', 'happy'),
        N('Clover and Nova say laila tov too.'),
        N('Three Nubbins sleep in a heap by Ori’s tent.'),
        O('Laila tov, everybody. Tomorrow: shapes!'),
      ],
      [
        notice(
          'health',
          'why we sleep',
          3,
          [O('Look. The Nubbins are fast asleep.'), O('Sleep helps our bodies rest and grow. Nubbins too!')],
          'Heard that sleep helps our bodies rest and grow.',
          'ELOF: Perceptual, Motor, and Physical Development',
        ),
      ],
    ),
    // ------------------------------------------------ complete
    sc(
      'lh1-complete',
      [
        N('Morning! A new sign hangs on the gate.'),
        O('Boker tov! I made you a sign. It says shalom!', 'happy'),
        O('I made up a chant too. Say it after me!'),
        O('“Boker tov, the sun is out!'),
        O('Shalom, shalom, wave and shout!'),
        O('Erev tov, the lanterns glow,'),
        O('laila tov, and off we go!”'),
        N('The Wobbler waves with both arms. Wobble, wobble… it stays up!'),
        O('It stayed up! Ken! Toda, Wobbler!', 'shock'),
      ],
      [
        act(
          'literacy',
          'trace the shape ש (shin)',
          1,
          'edu:trace:he:shin',
          [
            O('Look at this shape: ש. It’s called shin.'),
            O('This shape says “sh”, like shalom.'),
            O('Three arms up, like a goalie making a save!'),
            N('(Trace it with a finger. Start on the right side.)'),
          ],
          'Traced the Hebrew letter shape ש (shin) and heard that it says “sh”, as in shalom. Tracing only, not reading.',
          'ELOF: Literacy',
        ),
        act(
          'music',
          'a call-and-response chant with actions',
          6,
          'edu:chant:he:lh1',
          [
            N('(Say the chant line by line. Your child says each line back.)'),
            N('(Stretch up on “boker tov”. Wave on “shalom”. Yawn on “laila tov”.)'),
            O('Again! Louder! The Nubbins are joining in!', 'happy'),
          ],
          'Joined in an original Hebrew greetings chant, line by line, with actions.',
          'ELOF: Language and Communication',
        ),
      ],
    ),
  ],
  notes(
    'Words in sprout LH1: step 1 shalom, beseder, ma shlomkha? / ma shlomekh? (in the choice only); step 2 toda, bevakasha, tov, ken, lo; step 3 boker tov, erev tov, laila tov. ' +
      'lh1-s1 keeps all three choices; the player picks how Ori asks, and all three play alike. The game never assumes the player’s gender. ' +
      'The chant in lh1-complete is the base file’s original chant, spoken in rhythm, not sung to any known tune. ' +
      'The Wobbler falls over whenever it waves, and stays up for the first time in lh1-complete, as in the base.',
  ),
);

// ================================================================== LH2 Right to Left
const LH2: EduQuest = quest(
  'lh2',
  'Right to Left',
  {
    'lh2-step1': {
      goal: 'Find four painted pebbles round the garden. Trace each one.',
      hint: 'Look by the pond, the gate, the orchard and Ori’s tent. Start on the right side.',
    },
    'lh2-step2': {
      goal: 'Trace some shapes in the sand with Ori.',
      hint: 'Ori draws it first. Go over it with a stick. Start on the right side.',
    },
    'lh2-step3': {
      goal: 'Help Ori paint his name on his tent.',
      hint: 'Tap the paintbrush on the tent. Ori helps. Start on the right side.',
    },
  },
  [
    // ------------------------------------------------ step 1: pebbles
    sc(
      'lh2-s1',
      [
        O('שָׁלוֹם (shalom, “hello”)! Today: Hebrew letters!'),
        N('(Say it: sha-LOME. Wave!)'),
        O('Hebrew goes the other way. Right to left!'),
        N('(Hold up your right hand. Hebrew starts on that side.)'),
        N('The Wobbler hears “right to left”. It walks backwards!'),
        O('I painted shapes on four pebbles. Together they make shalom.'),
        O('I hid them. By the pond, the gate, the orchard and my tent.'),
        N('The Wobbler sets off to help. Backwards. Bump!'),
      ],
      [
        act(
          'literacy',
          'Hebrew goes right to left',
          3,
          'edu:point:he:right-to-left',
          [
            N('(Run a finger across the page, from right to left.)'),
            O('Whoosh! That’s the Hebrew way. Right to left.', 'happy'),
            N('(Now left to right. That’s the English way.)'),
          ],
          'Showed with a finger that Hebrew is written right to left, and English left to right.',
          'ELOF: Literacy',
        ),
      ],
    ),
    sc(
      'lh2-s1-done',
      [
        N('Four pebbles sit on the path. Clink, clink, clink, clink.'),
        O('You found them all! תּוֹדָה (toda, “thank you”)!', 'happy'),
        N('(Say it: toe-DAH.)'),
        O('Now line them up. Start on the right!'),
        N('The Wobbler arrives, backwards. It sits on a pebble.'),
        O('Off, Wobbler! That pebble is part of shalom.'),
      ],
      [
        act(
          'maths',
          'count to 4',
          0,
          'edu:count:pebbles:4',
          [N('(Count the pebbles together on your fingers.)'), O('One, two, three, four! Four shapes make shalom.', 'happy')],
          'Counted four pebbles, one finger for each.',
          'K.CC.B.5',
        ),
      ],
    ),
    // ------------------------------------------------ step 2: the sand
    sc(
      'lh2-s2',
      [
        N('By the pond, the mud is dry and smooth. Like sand.'),
        O('Hebrew letters are called the alef-bet.'),
        O('The first shape is alef. Here it is: א.'),
        O('Alef is the quiet shape. It makes no sound!'),
        O('It holds a sound for its friends. Like a cup holds tea.'),
        O('The next letter is called bet. I’ll draw that one.'),
        N('The Wobbler walks backwards. Plop! Into the pond.'),
        N('It climbs out, dripping and delighted.'),
        O('Your stick is ready. Alef first, or bet first?'),
      ],
      [
        act(
          'literacy',
          'trace the shape א (alef)',
          4,
          'edu:trace:he:alef',
          [
            N('(Trace א with a finger. Start on the right side.)'),
            O('A quiet shape. Shh!'),
            N('(Put a finger on your lips. Alef is quiet.)'),
          ],
          'Traced the Hebrew letter shape א (alef), the first letter, which makes no sound of its own. Tracing only, not reading.',
          'ELOF: Literacy',
        ),
      ],
      [
        {
          id: 'alef-first',
          label: 'Alef first. The quiet one.',
          then: [O('Alef first. The quiet ones go first today.', 'happy')],
        },
        {
          id: 'bet-first',
          label: 'Bet first!',
          then: [O('Bet first! I’ll draw bet. Then you trace alef.', 'happy')],
        },
      ],
    ),
    sc(
      'lh2-s2-done',
      [
        N('In the sand: a wobbly alef. It looks very proud.'),
        O('Alef! The first letter. And the quiet one.', 'happy'),
        O('Next, the best word in the world. My name!'),
        N('The Wobbler shakes itself dry. All over Ori.'),
        O('Thank you, Wobbler. Very refreshing.'),
      ],
      [
        notice(
          'sel',
          'first tries can be wobbly, and that is fine',
          1,
          [O('Your alef is a bit wobbly. That’s fine!'), O('First tries are wobbly. Mine were too. You keep going.', 'soft')],
          'Heard that first tries are often wobbly, and that practice helps.',
          'CASEL: Self-awareness',
        ),
      ],
    ),
    // ------------------------------------------------ step 3: the tent
    sc(
      'lh2-s3',
      [
        N('Ori’s tent is green and a bit crooked.'),
        N('A football scarf hangs on the pole.'),
        O('My name in Hebrew is אוֹרִי (Ori, “my light”).'),
        N('(Say it: OH-ree.)'),
        O('אוֹר (or) means light. Ori means “my light”.'),
        N('(Say it: ORE. Like the oar on a rowing boat.)'),
        O('I love light. Stars are my favourite!', 'happy'),
        N('The Wobbler watches closely. It is facing the wrong way.'),
        O('Help me paint my name. Start on the right!'),
      ],
      [
        ask(
          'science',
          'things that give light',
          6,
          [O('Or means light. What gives us light?')],
          [
            opt('A star', [O('Yes! Stars shine. So do the sun and lanterns.', 'happy')], true),
            opt('A stone', [O('A stone doesn’t shine. Stars, the sun and lanterns do!')]),
          ],
          'Talked about things that give light, like stars, the sun and lanterns.',
          'ELOF: Scientific Reasoning',
        ),
      ],
      [
        {
          id: 'big',
          label: 'Paint it big!',
          then: [O('Big! You can see it from the hill!', 'happy')],
        },
        {
          id: 'small',
          label: 'Paint it small and neat.',
          then: [O('Small and neat. Like a famous person’s name.', 'happy')],
        },
        {
          id: 'star',
          label: 'Paint it, then add a star.',
          then: [O('A star! A light next to “my light”!', 'happy')],
        },
      ],
    ),
    sc(
      'lh2-s3-done',
      [
        N('On the tent, in fresh paint: אוֹרִי.'),
        O('That’s me! You helped paint my name.', 'happy'),
        O('Nobody here has done that before.'),
        N('The Wobbler turns round at last. It waves at the name.'),
      ],
      [
        ask(
          'sel',
          'noticing how someone feels',
          2,
          [N('Look at Ori’s face. How does he feel?')],
          [
            opt('Happy and proud', [O('Very happy. My name, on my tent, by my friend!', 'happy')], true),
            opt('Cross', [N('Look at his big smile. Ori feels happy!')]),
          ],
          'Looked at Ori’s face and named his feeling: happy and proud.',
          'ELOF: Social and Emotional Development',
        ),
      ],
    ),
    // ------------------------------------------------ complete
    sc(
      'lh2-complete',
      [
        N('At dusk, Ori lays flat stones on the path.'),
        O('Stepping stones! Each one has a letter.'),
        O('Hebrew has twenty-two letters. You met alef!'),
        O('Hop along them, right to left!'),
        N('The Wobbler hops too. Backwards, of course.'),
        N('It does not fall in the pond. Not once!'),
        O('Shalom, stones! See you tomorrow.'),
      ],
      [
        act(
          'health',
          'hopping in one direction',
          3,
          'edu:hop:stones:right-to-left',
          [N('(Stand up! Hop from right to left together. Hop, hop, hop!)'), O('Right to left. The Hebrew way!', 'happy')],
          'Hopped from right to left, the way Hebrew is written.',
          'ELOF: Perceptual, Motor, and Physical Development',
        ),
        ask(
          'literacy',
          'review: which way Hebrew goes',
          6,
          [N('The Wobbler is walking backwards again.'), O('Which way does Hebrew go?')],
          [
            opt('Right to left', [O('Right to left! Whoosh!', 'happy')], true),
            opt('Left to right', [O('That’s English! Hebrew goes right to left. Whoosh!')]),
          ],
          'Remembered that Hebrew goes right to left.',
          'ELOF: Literacy',
        ),
      ],
    ),
  ],
  notes(
    'Sprout LH2 shows one letter shape only: א (alef), traced in lh2-s2. Ori draws bet himself; its shape is not shown in sprout lines. The pebbles, the stepping stones and the name on the tent appear in the art, but sprout never asks the child to read them. ' +
      'Words: shalom, toda, or (“light”), and Ori’s name אוֹרִי. Letter names spoken: alef, bet. ' +
      'The Wobbler walks backwards all quest because it heard “right to left”, as in the base.',
  ),
);

// ================================================================== LH3 Counting Plums
const LH3: EduQuest = quest(
  'lh3',
  'Counting Plums',
  {
    'lh3-step1': {
      goal: 'Help Fern count plums in Hebrew.',
      hint: 'Tap each plum as it goes in the basket. Say its number with Ori.',
    },
    'lh3-step2': {
      goal: 'Play Ori’s “How Many?” football game.',
      hint: 'Watch each goal. Then tap the number. Ori helps if you get stuck.',
    },
    'lh3-step3': {
      goal: 'Count ten stars with Ori.',
      hint: 'Go up the hill after dark. Tap a star to count it.',
    },
  },
  [
    // ------------------------------------------------ step 1: plums
    sc(
      'lh3-s1',
      [
        N('Fern’s plum trees are full. Plop! Plop!'),
        FE('I need ten plums in each basket. I keep losing count!'),
        O('I’ll help. I count in Hebrew!'),
        O('אַחַת (achat, “one”). שְׁתַּיִם (shtayim, “two”). שָׁלוֹשׁ (shalosh, “three”).'),
        N('(Say them: ah-KHAT, SHTAI-yim, sha-LOSH.)'),
        O('אַרְבַּע (arba, “four”). חָמֵשׁ (chamesh, “five”).'),
        N('(Say them: ar-BAH, kha-MESH. The “kh” is throaty, like “loch”.)'),
        FE('Shtayim… it sounds like a sneeze!'),
        N('The Wobbler catches the falling plums. Mostly with its face.'),
      ],
      [
        act(
          'maths',
          'count to 5 in Hebrew',
          6,
          'edu:count:he:plums:5',
          [
            N('(Hold up one finger for each plum.)'),
            O('Achat, shtayim, shalosh, arba, chamesh!'),
            N('(Say them again together, with your fingers.)'),
            FE('Five plums! Halfway there!', 'happy'),
          ],
          'Counted five plums in Hebrew (achat to chamesh), one finger for each.',
          'K.CC.B.5',
        ),
      ],
      [
        {
          id: 'you-count',
          label: 'I’ll count. You check.',
          then: [O('Deal! I’ll cheer every number.', 'happy')],
        },
        {
          id: 'fern-count',
          label: 'Let Fern count. We’ll cheer.',
          then: [FE('No pressure, then!', 'shock'), O('Big cheers! Achat!', 'happy')],
        },
      ],
    ),
    sc(
      'lh3-s1-done',
      [
        N('Plop, plop, plop. The basket fills up.'),
        FE('Ten plums! What is ten in Hebrew?', 'happy'),
        O('עֶשֶׂר (eser, “ten”)! Ten is my favourite number.'),
        N('(Say it: EH-ser. Hold up ten fingers!)'),
        O('It’s my football shirt number.'),
        N('The Wobbler has a plum on its head. Nobody mentions it.'),
      ],
      [
        ask(
          'sel',
          'asking for help',
          4,
          [FE('I lost count, so I asked Ori for help.'), FE('What can you do when something is tricky?')],
          [
            opt('Ask a friend for help', [FE('Yes! Asking for help is brave and clever.', 'happy')], true),
            opt('Give up', [FE('Let’s not give up. Asking a friend helps!', 'soft')]),
          ],
          'Talked about asking a friend for help when something is tricky.',
          'CASEL: Relationship skills',
        ),
      ],
    ),
    // ------------------------------------------------ step 2: football
    sc(
      'lh3-s2',
      [
        N('Ori puts four jumpers on the grass. Two goals!'),
        O('The game is called “How Many?” I shoot. You count!'),
        O('Big numbers now. שֵׁשׁ (shesh, “six”). שֶׁבַע (sheva, “seven”).'),
        N('(Say them: SHESH, SHEH-vah.)'),
        O('שְׁמוֹנֶה (shmone, “eight”). תֵּשַׁע (tesha, “nine”). And eser, ten!'),
        N('(Say them: shmo-NEH, TEH-sha, EH-ser.)'),
        N('The Wobbler is in goal. It waves at the ball.'),
        O('I am very good at football. And very bad at losing.', 'think'),
        O('Ready? Achat, shtayim, shalosh, GO!'),
      ],
      [
        act(
          'literacy',
          'say the Hebrew numbers 6 to 10: call and response',
          5,
          'edu:say:he:numbers:6-10',
          [
            O('I say shesh. You say shesh!'),
            N('(Ori says each number. Your child says it back.)'),
            O('Shesh! Sheva! Shmone! Tesha! Eser!'),
            O('Perfect! You count like a referee.', 'happy'),
          ],
          'Repeated the Hebrew numbers six to ten (shesh to eser) after Ori.',
          'ELOF: Language and Communication',
        ),
      ],
      [
        {
          id: 'go-easy',
          label: 'Go easy on me!',
          then: [O('Never! …OK, a little bit. For one shot.', 'happy')],
        },
        {
          id: 'bring-it',
          label: 'Bring it on!',
          then: [O('Now you sound like a footballer!', 'happy')],
        },
      ],
    ),
    sc(
      'lh3-s2-done',
      [
        N('Ori scores ten goals. Eser!'),
        N('Then the ball bounces off the Wobbler’s tummy.'),
        N('It rolls all the way down the grass. Into Ori’s goal!'),
        O('The Wobbler scored one? Achat? ACHAT?', 'shock'),
        O('Best of ten! Best of twenty!'),
        NV('Ori.'),
        O('…בְּסֵדֶר (beseder, “OK”). Well played, Wobbler.', 'sad'),
        N('(Say it: beh-SEH-der.)'),
      ],
      [
        ask(
          'sel',
          'being a good sport',
          7,
          [N('Ori let in one goal. He feels cross.'),N('What can we say when a game ends?')],
          [
            opt('Well played!', [O('Well played. You’re right. That feels better.', 'soft')], true),
            opt('I’m the best!', [O('Hmm. That’s what I nearly said. “Well played” is kinder.', 'think')]),
          ],
          'Talked about being a good sport: saying “well played” after a game, even when cross.',
          'CASEL: Self-management',
        ),
      ],
    ),
    // ------------------------------------------------ step 3: stars
    sc(
      'lh3-s3',
      [
        N('Night. You and Ori climb the hill with a blanket.'),
        O('Look up! So many stars!'),
        O('A star is a כּוֹכָב (kochav, “star”).'),
        N('(Say it: ko-KHAV. Point up at the sky!)'),
        O('And that’s the יָרֵחַ (yareach, “moon”). So bright!'),
        N('(Say it: yah-REH-akh.)'),
        N('Something in a tree says “hoo”. Two round eyes blink.'),
        O('יַנְשׁוּף (yanshuf, “owl”)! This owl is awake at night. Like me!', 'happy'),
        N('(Say it: yan-SHOOF. Now hoot like an owl!)'),
        O('Let’s count ten stars. Point at one!'),
      ],
      [
        notice(
          'science',
          'we see stars at night',
          3,
          [O('We see stars at night, when the sky is dark.'), O('In the day, the sun is too bright to see them.')],
          'Heard that we see stars at night, when the sky is dark, because the sun is too bright in the day.',
          'ELOF: Scientific Reasoning',
        ),
        act(
          'literacy',
          'trace the shape י (yod)',
          5,
          'edu:trace:he:yod',
          [
            O('Here’s a tiny shape: י. It’s called yod.'),
            O('In yareach, this shape says “y”.'),
            O('It’s the smallest letter. Small, like a faraway star.'),
            N('(Trace it with a finger. Start on the right side.)'),
          ],
          'Traced the Hebrew letter shape י (yod), the smallest letter, which says “y” in yareach. Tracing only, not reading.',
          'ELOF: Literacy',
        ),
      ],
      [
        {
          id: 'bright',
          label: 'Start with the brightest star.',
          then: [O('The bright one first. Achat!', 'happy')],
        },
        {
          id: 'faint',
          label: 'Start with the faintest star.',
          then: [O('The faint ones are brave. They shine anyway. Achat!', 'soft')],
        },
      ],
    ),
    sc(
      'lh3-s3-done',
      [
        N('One star. Two stars. You point, Ori counts.'),
        O('Achat, shtayim, shalosh… all the way up!'),
        O('…shmone, tesha, eser! Ten stars!', 'happy'),
        N('The yanshuf hoots once. Hoo!'),
        O('My grandma counts stars with me at home.', 'soft'),
        N('The Wobbler lies on its back. It waves at the kochav.'),
      ],
      [
        act(
          'maths',
          'count to 10 in Hebrew',
          2,
          'edu:count:he:stars:10',
          [
            N('(Count ten stars again together. Touch each one.)'),
            O('Achat, shtayim, shalosh, arba, chamesh!'),
            O('Shesh, sheva, shmone, tesha, eser!'),
            O('Ten stars, all counted!', 'happy'),
          ],
          'Counted ten stars in Hebrew, achat to eser, touching each one once.',
          'K.CC.B.5',
        ),
      ],
    ),
    // ------------------------------------------------ complete
    sc(
      'lh3-complete',
      [
        N('Morning. Fern pins a chart on the orchard gate.'),
        N('Ten plums in a row, with Hebrew numbers.'),
        FE('I’ll count in Hebrew for every plum I sell!', 'happy'),
        O('Countdown, like a rocket! Ten to one!'),
        O('Eser, tesha, shmone, sheva, shesh!'),
        O('Chamesh, arba, shalosh, shtayim, achat!'),
        N('On “achat”, the Wobbler jumps… into the plum basket!'),
        O('Lift-off! Well. Plum-off.', 'happy'),
        O('For you: my star chart, with a yanshuf on it. And my football!'),
        O('The Wobbler earned it, really. Don’t tell it.'),
      ],
      [
        act(
          'music',
          'a countdown chant with actions',
          3,
          'edu:chant:he:countdown',
          [
            N('(Crouch down low. Count down with Ori, slowly.)'),
            N('(On “achat”, jump up like a rocket!)'),
            O('Again! Faster! Eser… tesha… shmone…', 'happy'),
          ],
          'Chanted the Hebrew numbers from ten down to one, crouching low and jumping up on “achat”.',
        ),
      ],
    ),
  ],
  notes(
    'Numbers are the counting-aloud forms; they are never paired with Hebrew nouns (things are counted in English sentences). ' +
      'Words in sprout LH3: step 1 achat to chamesh, plus eser in the done scene; step 2 shesh to tesha; step 3 kochav, yareach, yanshuf. Beseder comes back from LH1. ' +
      'Sprout shows one letter shape: י (yod), traced in lh3-s3. ' +
      'Running gag: Ori is a very bad loser; he wins 10–1 and is outraged by the Wobbler’s one accidental goal. The sel lesson in lh3-s2-done turns it into “well played”. ' +
      'lh3-s3: night only; Ori names nothing beyond star, moon and owl.',
  ),
);

// ================================================================== LH4 Colours of the Orchard
const LH4: EduQuest = quest(
  'lh4',
  'Colours of the Orchard',
  {
    'lh4-step1': {
      goal: 'Sort Nova’s fruit by colour.',
      hint: 'Red fruit in one basket, green in one, yellow in one.',
    },
    'lh4-step2': {
      goal: 'Find something red for Clover’s Nubbin.',
      hint: 'Look in Nova’s crate for something red. Adom!',
    },
    'lh4-step3': {
      goal: 'Paint Fern’s fence in three colours.',
      hint: 'Listen to Ori. Dip the brush in the colour he says.',
    },
  },
  [
    // ------------------------------------------------ step 1: sorting
    sc(
      'lh4-s1',
      [
        N('Nova drops a crate on the table. Thud! Fruit!'),
        NV('One of everything from the market. I was hungry.'),
        O('Sorting game! Colours in Hebrew. Ready?'),
        O('אָדֹם (adom, “red”). יָרֹק (yarok, “green”). צָהֹב (tsahov, “yellow”).'),
        N('(Say them: ah-DOME, yah-ROKE, tsa-HOVE.)'),
        O('תַּפּוּחַ (tapuach, “apple”). בָּנָנָה (banana, “banana”). Easy one!'),
        O('לִימוֹן (limon, “lemon”). Another easy one!'),
        N('(Say them: tah-POO-akh, bah-NAH-nah, lee-MONE.)'),
        N('The Wobbler hugs a banana. It will not share.'),
      ],
      [
        act(
          'maths',
          'sort by colour and count each group',
          7,
          'edu:sort:fruit:colour',
          [
            N('(Point to the yellow fruit. Now the red. Now the green.)'),
            O('The banana and the limon go in tsahov!'),
            O('A red tapuach goes in adom!'),
            N('(How many yellow fruits? Count them together.)'),
          ],
          'Sorted fruit into red, green and yellow groups, and counted a group.',
          'K.MD.B.3',
        ),
      ],
      [
        {
          id: 'green-apple',
          label: 'Put the green apple in yarok.',
          then: [O('Yarok! Apples can be green too.', 'happy')],
        },
        {
          id: 'red-apple',
          label: 'Put the red apple in adom.',
          then: [O('Adom! A red tapuach, like in a picture book.', 'happy')],
        },
      ],
    ),
    sc(
      'lh4-s1-done',
      [
        N('Three piles: adom, yarok, tsahov.'),
        N('And a little pile under the table. The Wobbler guards it.'),
        O('The Wobbler made up a new colour. It’s called “mine”!'),
        NV('A very popular colour. I see it at every market.'),
      ],
      [
        ask(
          'sel',
          'sharing',
          2,
          [O('The Wobbler won’t share the fruit.'), O('What could we say to it?')],
          [
            opt('Let’s share, please!', [O('Kind and polite. Look, it gives back one banana!', 'happy')], true),
            opt('Grab it!', [O('Grabbing makes Nubbins sad. Asking nicely works better.', 'soft')]),
          ],
          'Talked about asking nicely to share instead of grabbing.',
          'CASEL: Relationship skills',
        ),
      ],
    ),
    // ------------------------------------------------ step 2: something red
    sc(
      'lh4-s2',
      [
        N('Clover sits by the pond with a little Nubbin.'),
        CL('This one only eats red things. We all have our ways.'),
        O('Something adom! I’m fast. I play on the wing!'),
        O('רִמּוֹן (rimon, “pomegranate”). Red, with red seeds inside!'),
        N('(Say it: ree-MONE.)'),
        O('עֲנָבִים (anavim, “grapes”). Their colour is סָגֹל (sagol, “purple”).'),
        N('(Say them: ah-nah-VEEM, sah-GOLE.)'),
        N('A צִפּוֹר (tsipor, “bird”) lands on the crate. Peck, peck!'),
        N('(Say it: tsee-POR. Tweet tweet!)'),
        N('The Wobbler shoos the tsipor. The tsipor shoos the Wobbler! Bump.'),
        O('Tsipor! One bite. Then shoo!'),
      ],
      [
        notice(
          'science',
          'animals need food and water',
          1,
          [CL('She hasn’t eaten all day.'), CL('Every animal needs food and water. Even fussy ones!')],
          'Heard that every animal needs food and water to live.',
          'K-LS1-1',
        ),
      ],
      [
        {
          id: 'rimon',
          label: 'Take the rimon.',
          then: [CL('So very adom! She’s sniffing it already.', 'happy')],
        },
        {
          id: 'tapuach',
          label: 'Take a red tapuach.',
          then: [CL('A red apple! She’s sniffing it already.', 'happy')],
        },
        {
          id: 'anavim',
          label: 'Take the anavim.',
          then: [
            N('The Nubbin sniffs the grapes. She turns away, slowly.'),
            O('Sagol, not adom! Here, take the rimon instead.'),
          ],
        },
      ],
    ),
    sc(
      'lh4-s2-done',
      [
        N('The fussy Nubbin eats the red fruit. Slowly. Then: more!'),
        CL('תּוֹדָה (toda, “thank you”)! Did I say it right?', 'happy'),
        N('(Say it: toe-DAH.)'),
        O('Perfect toda! I’d give you a medal. I’m out of medals.'),
        N('The tsipor flies off with one seed. Tweet!'),
      ],
      [
        act(
          'art',
          'find the colour red and name it in Hebrew',
          3,
          'edu:point:colour:adom',
          [
            N('(Look around you. Find something red.)'),
            N('(Point to it and say: ah-DOME!)'),
            O('Adom! You found it!', 'happy'),
          ],
          'Found something red nearby and named the colour in Hebrew: adom.',
        ),
      ],
    ),
    // ------------------------------------------------ step 3: the fence
    sc(
      'lh4-s3',
      [
        N('Fern’s fence is grey and peeling. Poor fence.'),
        FE('Pick three colours. I’m bad at choosing!'),
        O('I call a colour. You paint it!'),
        O('כָּחֹל (kachol, “blue”). שָׁחֹר (shachor, “black”).'),
        N('(Say them: kah-KHOLE, sha-KHOR.)'),
        O('כָּתֹם (katom, “orange”). וָרֹד (varod, “pink”).'),
        N('(Say them: kah-TOME, vah-RODE.)'),
        N('A פַּרְפַּר (parpar, “butterfly”) lands on the blue tin.'),
        N('(Say it: par-PAR. Flap your hands like wings!)'),
        N('Splash! The Wobbler falls in the varod tin. Now it’s pink!'),
      ],
      [
        ask(
          'maths',
          'a colour pattern: what comes next?',
          6,
          [O('Stripes! Kachol, varod, kachol, varod…'), O('What comes next?')],
          [
            opt('Kachol (blue)', [O('Kachol! Blue comes next. A pattern!', 'happy')], true),
            opt('Varod (pink)', [O('Listen again: kachol, varod, kachol, varod… then kachol!')]),
          ],
          'Continued a blue-pink colour pattern.',
          'ELOF: Mathematics Development',
        ),
      ],
      [
        {
          id: 'sunset',
          label: 'A sunset fence, please.',
          then: [O('Katom, varod, sagol. Like the sky at home.', 'soft')],
        },
        {
          id: 'night',
          label: 'A night-sky fence.',
          then: [O('Shachor, kachol, and tsahov for stars!', 'happy')],
        },
        {
          id: 'surprise',
          label: 'Surprise me, Ori!',
          then: [O('Varod, yarok, katom. Art doesn’t argue!', 'happy')],
        },
      ],
    ),
    sc(
      'lh4-s3-done',
      [
        N('The fence has three stripes now. Wobbly ones.'),
        FE('It’s loud. I love it!', 'happy'),
        FE('I’d never have picked it. That’s why I love it.'),
        N('The parpar flutters off. The Wobbler is still varod.'),
        O('Pink till the next rain. It looks very pleased.'),
      ],
      [
        act(
          'literacy',
          'trace the shape ל (lamed)',
          4,
          'edu:trace:he:lamed',
          [
            O('Look at this tall shape: ל. It’s called lamed.'),
            O('In limon, this shape says “l”.'),
            O('It’s the tallest letter. It peeks over the fence!'),
            N('(Trace it with a finger. Start on the right side.)'),
          ],
          'Traced the Hebrew letter shape ל (lamed), the tallest letter, which says “l” in limon. Tracing only, not reading.',
          'ELOF: Literacy',
        ),
      ],
    ),
    // ------------------------------------------------ complete
    sc(
      'lh4-complete',
      [
        N('That evening, Ori gives you some tiny seeds.'),
        O('Rimon seeds! Plant one. One day, a rimon tree!'),
        O('Quick-fire! The Wobbler holds up fruit. You shout the colour!'),
        N('The Wobbler holds up a limon.'),
        N('Then a tapuach. Then some anavim, half eaten.'),
        O('Tsahov! Adom! Sagol! You’re the colour champion!', 'happy'),
        O('Joint champions. With me. I hate sharing. Fine.'),
        N('The seeds go in your seed tin.'),
        N('A parpar lands on the Wobbler. It is still pink!'),
      ],
      [
        notice(
          'science',
          'seeds grow into plants',
          1,
          [O('A seed is a baby plant, waiting.'), O('Soil, water and sunshine help it grow.')],
          'Heard that a seed grows into a plant when it has soil, water and sunshine.',
          'K-LS1-1',
        ),
        ask(
          'literacy',
          'review: colour words in Hebrew',
          3,
          [O('The limon! What colour is it?')],
          [
            opt('Tsahov (yellow)', [O('Tsahov! Yellow, like the sun!', 'happy')], true),
            opt('Kachol (blue)', [O('A blue lemon? Silly Wobbler! It’s tsahov, yellow.')]),
          ],
          'Named the colour of a lemon in Hebrew: tsahov (yellow).',
          'ELOF: Language and Communication',
        ),
      ],
    ),
  ],
  notes(
    'Colours are the masculine forms used to name a colour; sprout never writes noun-plus-colour phrases in Hebrew. ' +
      'Words in sprout LH4: step 1 adom, yarok, tsahov, tapuach, banana, limon; step 2 rimon, anavim, sagol, tsipor (and toda comes back); step 3 kachol, shachor, katom, varod, parpar. Lavan, te’ena and tamar are left to the base and reader bands. ' +
      'Sprout shows one letter shape: ל (lamed), traced in lh4-s3-done. ' +
      'Running gag: the Wobbler’s pile of fruit called “mine”, then the pink paint; it stays varod until the next rain. ' +
      'lh4-s2: picking anavim plays its lines and swaps to the rimon, as in the base.',
  ),
);

// ================================================================== LH5 Savta’s Letters
const LH5: EduQuest = quest(
  'lh5',
  'Savta’s Letters',
  {
    'lh5-step1': {
      goal: 'Look at a letter from Savta’s tin with Ori.',
      hint: 'Sit at the table with Ori. Tap the letter to hear it.',
    },
    'lh5-step2': {
      goal: 'Draw a family tree with Ori.',
      hint: 'Draw a tree. Put a word sticker on each branch. Any way is right.',
    },
    'lh5-step3': {
      goal: 'Tell Ori how a Nubbin feels.',
      hint: 'Look at the shy Nubbin by the gate. Is she happy, sad or tired?',
    },
  },
  [
    // ------------------------------------------------ step 1: the letter
    sc(
      'lh5-s1',
      [
        N('Pitter-patter. Rain. Ori opens his biscuit tin.'),
        O('Letters! They belong to my סַבְתָּא (savta, “grandma”).'),
        N('(Say it: SAHV-tah.)'),
        O('Hazel looked after this garden. She wrote to Savta. For forty years!'),
        N('Ori reads one. “How is the מִשְׁפָּחָה (mishpacha, ‘family’)?”'),
        N('(Say it: meesh-pah-KHAH.)'),
        N('“Is the כֶּלֶב (kelev, ‘dog’) still stealing socks?”'),
        N('(Say it: KEH-lev. Woof!)'),
        N('In the corner of the letter: a game of noughts and crosses!'),
        O('They played games by post? And Savta is LOSING?', 'shock'),
      ],
      [
        notice(
          'social-studies',
          'letters, long ago and today',
          3,
          [
            NV('Long ago, people sent lots and lots of letters.'),
            NV('A letter can take days to arrive. I know. I carried some!'),
          ],
          'Heard that people have sent letters for a long time, and that a letter takes days to arrive.',
          'D2.His.2.K-2',
        ),
      ],
    ),
    sc(
      'lh5-s1-done',
      [
        O('Savta, mishpacha, kelev. You know them!', 'happy'),
        N('The Wobbler climbs onto the letter. It sits there like a cat.'),
        O('Just like a חָתוּל (chatul, “cat”)! Off, Wobbler!'),
        N('(Say it: kha-TOOL. Miaow!)'),
        O('Every letter has a game. Savta is behind. I’m very upset!'),
      ],
      [
        ask(
          'science',
          'animal sounds',
          3,
          [O('A kelev says woof. What does a chatul say?')],
          [
            opt('Miaow!', [O('Miaow! And purr, when it’s happy.', 'happy')], true),
            opt('Moo!', [O('Moo is a cow! A chatul says miaow.')]),
          ],
          'Matched animals to their sounds: a dog (kelev) says woof, a cat (chatul) says miaow.',
          'ELOF: Scientific Reasoning',
        ),
      ],
    ),
    // ------------------------------------------------ step 2: the family tree
    sc(
      'lh5-s2',
      [
        N('Ori unrolls a long sheet of paper. He draws a tree.'),
        O('A family tree. My mishpacha! Savta at the top.'),
        O('Mum is אִמָּא (ima, “mum”). Dad is אַבָּא (aba, “dad”).'),
        N('(Say them: EE-mah, AH-bah.)'),
        O('I have an אָחוֹת (achot, “sister”) and an אָח (ach, “brother”).'),
        N('(Say them: ah-KHOTE, AKH. A throaty “kh”!)'),
        O('A friend who’s a boy is a חָבֵר (chaver).'),
        O('A friend who’s a girl is a חֲבֵרָה (chavera).'),
        N('(Say them: khah-VER, khah-veh-RAH.)'),
        NV('Do I go on it? I just carry the letters.', 'think'),
      ],
      [
        act(
          'art',
          'draw your own family',
          5,
          'edu:draw:family',
          [
            N('(Draw your family together. Say each person’s name.)'),
            O('Your grown-ups, your friends… and maybe a Nubbin or two!', 'happy'),
          ],
          'Drew a picture of their own family and named the people in it.',
        ),
      ],
      [
        {
          id: 'nova-chavera',
          label: 'Nova goes on as a chavera.',
          then: [NV('A chavera! I like that very much.', 'happy'), O('A big branch for Nova!')],
        },
        {
          id: 'ori-chaver',
          label: 'Ori goes on as a chaver.',
          then: [O('Me? On your tree?', 'shock'), O('…Chaver. Thank you. You’re on mine too.', 'soft')],
        },
        {
          id: 'nubbins',
          label: 'The Nubbins get a branch!',
          then: [O('A Nubbin branch! The Wobbler at the very top.', 'happy')],
        },
      ],
    ),
    sc(
      'lh5-s2-done',
      [
        N('Two trees, side by side. Ori’s family and yours.'),
        O('Ima, aba, ach, achot, chaver, chavera. All of them!', 'happy'),
        O('My achot will be cross you learned so fast. Good!'),
        O('And my ach borrows my football. Without asking!'),
        N('The Wobbler drew itself on both trees. A circle with arms.'),
      ],
      [
        act(
          'literacy',
          'family words in Hebrew: call and response',
          1,
          'edu:say:he:family',
          [
            O('I say it in English. You say it in Hebrew. Mum?'),
            N('(Wait for: ima!)'),
            O('Dad?'),
            N('(Wait for: aba!)'),
            O('Ima and aba. Easy to say. Hard to argue with!', 'happy'),
          ],
          'Said the Hebrew words for mum (ima) and dad (aba) from memory.',
          'ELOF: Language and Communication',
        ),
      ],
    ),
    // ------------------------------------------------ step 3: feelings
    sc(
      'lh5-s3',
      [
        N('The rain stops. Drip, drip. The Nubbins come out.'),
        O('Feelings! In Hebrew, they change for a boy or a girl.'),
        O('Boy: שָׂמֵחַ (sameach, “happy”). Girl: שְׂמֵחָה (smecha, “happy”).'),
        N('(Say them: sah-MEH-akh, smeh-KHAH. Big smile!)'),
        O('Boy: עָצוּב (atsuv, “sad”). Girl: עֲצוּבָה (atsuva, “sad”).'),
        N('(Say them: ah-TSOOV, ah-tsoo-VAH. Sad face.)'),
        O('Boy: עָיֵף (ayef, “tired”). Girl: עֲיֵפָה (ayefa, “tired”).'),
        N('(Say them: ah-YEF, ah-yeh-FAH. Big yawn!)'),
        N('The shy one sits alone by the gate.'),
        O('She’s a girl, I think. מָה שְׁלוֹמֵךְ? (ma shlomekh?, “how are you?”)'),
      ],
      [
        act(
          'literacy',
          'feeling words in Hebrew, with faces',
          9,
          'edu:say:he:feelings',
          [
            N('(Say it: mah shlo-MEKH. That’s “how are you?” to a girl.)'),
            N('(She’s a girl, so use the girl words.)'),
            N('(Make a happy face and say: smeh-KHAH!)'),
            N('(Now a sad face: ah-tsoo-VAH. Now a tired face: ah-yeh-FAH.)'),
            O('Smecha! Atsuva! Ayefa! You’re a great actor.', 'happy'),
          ],
          'Said three Hebrew feeling words (happy, sad, tired) in the girl form, for the shy Nubbin, and made a face for each.',
          'ELOF: Language and Communication',
        ),
      ],
      [
        {
          id: 'atsuva',
          label: 'She’s atsuva. Sad.',
          then: [
            O('Atsuva. Maybe she misses someone. Let’s sit with her.', 'soft'),
            N('You sit by her. After a while, she leans on your arm.'),
          ],
        },
        {
          id: 'ayefa',
          label: 'She’s ayefa. Tired.',
          then: [O('Ayefa. Waving all day is hard work!', 'think')],
        },
        {
          id: 'smecha',
          label: 'She’s smecha. Just quiet.',
          then: [O('Smecha and quiet. Some happy is the quiet kind.', 'soft')],
        },
      ],
    ),
    sc(
      'lh5-s3-done',
      [
        O('מָה שְׁלוֹמְךָ? (ma shlomkha?, “how are you?”), sleepy one?'),
        N('(Say it: mah shlom-KHA. That’s “how are you?” to a boy.)'),
        O('Ayef. Of course.'),
        O('The Wobbler is sameach. Very, very sameach!', 'happy'),
        O('And me? A bit atsuv. I miss Savta.', 'soft'),
        O('And sameach, because I’m here. Both at once!'),
        N('The Wobbler rolls over. It leans on Ori’s foot.'),
      ],
      [
        ask(
          'sel',
          'feeling two things at once',
          5,
          [O('Sad and happy, both at once. Is that allowed?')],
          [
            opt('כֵּן (ken, “yes”)', [N('(Say it: KEN.)'), O('Ken. Two feelings at once is OK. A cuddle helps too.', 'soft')], true),
            opt('לֹא (lo, “no”)', [N('(Say it: LOW.)'), N('Lots of people feel two things at once. It’s allowed!')]),
          ],
          'Talked about how we can feel two things at once, like sad and happy, and what helps.',
          'CASEL: Self-awareness',
        ),
      ],
    ),
    // ------------------------------------------------ complete
    sc(
      'lh5-complete',
      [
        N('Ori lifts a little wooden box from the tin.'),
        O('Savta sent this for you. A letter box!'),
        O('For when you write to me. You will write!'),
        N('Quick-fire! The Wobbler points. You say the word.'),
        N('It points at Ori: chaver! At Nova: chavera!'),
        N('Then it points at itself. A big wobbly smile.'),
        O('Sameach! The Wobbler is sameach!', 'happy'),
        O('Oh! The last letter says Savta won the game. Phew!', 'happy'),
      ],
      [
        act(
          'literacy',
          'trace the shape ס (samech)',
          1,
          'edu:trace:he:samech',
          [
            O('Look at this round shape: ס. It’s called samech.'),
            O('In savta, this shape says “s”.'),
            O('Round, like a hug from Savta.'),
            N('(Trace it with a finger. Start on the right side.)'),
          ],
          'Traced the Hebrew letter shape ס (samech), which says “s” in savta. Tracing only, not reading.',
          'ELOF: Literacy',
        ),
        ask(
          'literacy',
          'review: family words in Hebrew',
          3,
          [N('The Wobbler points at the tin of letters.'), O('The letters are about Savta’s… what?')],
          [
            opt('Mishpacha (family)', [O('Mishpacha! Her whole family.', 'happy')], true),
            opt('Banana', [O('Ha! Not banana. Mishpacha, family!')]),
          ],
          'Remembered the Hebrew word for family: mishpacha.',
          'ELOF: Language and Communication',
        ),
      ],
    ),
  ],
  notes(
    'Hazel appears only as someone who used to write letters, in the past tense; never say whether she is alive. ' +
      'Words in sprout LH5: step 1 savta, mishpacha, kelev (and chatul in the done scene); step 2 ima, aba, achot, ach, chaver, chavera; step 3 the three feelings, each with a boy form and a girl form. Saba is left to the base and reader bands. ' +
      'Ori picks each Nubbin’s form (the shy one: girl forms; the sleepy one and the Wobbler: boy forms). The game never asks the child to pick a gender for themselves. ' +
      'Sprout shows one letter shape: ס (samech), traced in lh5-complete. ' +
      'Running gag: the forty-year game of noughts and crosses in the margins; Ori is outraged that Savta is losing, and relieved at the end.',
  ),
);

// ================================================================== LH6 The New Year of the Trees
const LH6: EduQuest = quest(
  'lh6',
  'The New Year of the Trees',
  {
    'lh6-step1': {
      goal: 'Ask Ori about Tu BiShvat, the trees’ new year.',
      hint: 'Ori is under the old apple tree. Tap him to talk.',
    },
    'lh6-step2': {
      goal: 'Plant an almond tree with everyone.',
      hint: 'Dig a hole. Put the little tree in. Give it water from the pond.',
    },
    'lh6-step3': {
      goal: 'Go to Ori’s party and say the Hebrew words.',
      hint: 'Go to the lanterns by the fence. Shout the Hebrew word for each game.',
    },
  },
  [
    // ------------------------------------------------ step 1: Tu BiShvat
    sc(
      'lh6-s1',
      [
        N('Ori sits under the old apple tree.'),
        O('Guess what? Trees get a birthday!', 'happy'),
        O('It’s called ט״ו בִּשְׁבָט (Tu BiShvat, “the New Year of the Trees”).'),
        N('(Say it: too beesh-VAHT.)'),
        N('The Wobbler climbs the tree. It waves: happy birthday!'),
        O('People plant trees. And eat fruit! Dates, figs, pomegranates.'),
        O('A tree is an עֵץ (ets, “tree”).'),
        N('(Say it: ETS. Stretch up tall like a tree!)'),
        O('Let’s plant a שָׁקֵד (shaked, “almond”) tree here!'),
        N('(Say it: shah-KED.)'),
      ],
      [
        notice(
          'social-studies',
          'Tu BiShvat, the New Year of the Trees',
          9,
          [
            O('Tu BiShvat comes in January or February, most years.'),
            O('In Israel, almond trees often flower around then.'),
            O('White and pink flowers, all over the hills.', 'soft'),
          ],
          'Heard about Tu BiShvat, the New Year of the Trees: people plant trees and eat fruit, and in Israel almond trees often flower around then.',
        ),
      ],
      [
        {
          id: 'where-pond',
          label: 'Plant it by the pond.',
          then: [O('By the pond! It can see itself in the water.', 'happy')],
        },
        {
          id: 'where-tent',
          label: 'Plant it where your tent is.',
          then: [O('Where my tent is. Something of mine stays here.', 'soft')],
        },
        {
          id: 'where-gate',
          label: 'Plant it by the gate, under the sign.',
          then: [O('By the gate! Hello, goodbye, and a tree!', 'happy')],
        },
      ],
    ),
    sc(
      'lh6-s1-done',
      [
        O('Tu BiShvat, ets, shaked. You know them all!', 'happy'),
        O('Plus fruit. There’s always fruit.'),
        N('The Wobbler climbs down the tree. Backwards. Old habits!'),
        O('Hold on tight, Wobbler!'),
      ],
      [
        notice(
          'sel',
          'remembering a friend who is far away',
          1,
          [O('When I go home, the tree stays here.', 'soft'), O('When you see it, you can think of me.', 'soft')],
          'Talked about ways to remember a friend who lives far away.',
          'CASEL: Relationship skills',
        ),
      ],
    ),
    // ------------------------------------------------ step 2: planting
    sc(
      'lh6-s2',
      [
        N('Everyone comes! Nova, Fern, Clover and Byte.'),
        O('This is our גַּן (gan, “garden”). It needs a new tree!'),
        N('(Say it: GAHN.)'),
        O('A tree needs מַיִם (mayim, “water”) and שֶׁמֶשׁ (shemesh, “sun”).'),
        N('(Say them: MY-yim, SHEH-mesh.)'),
        O('And גֶּשֶׁם (geshem, “rain”). Rain is mayim from the sky!'),
        N('(Say it: GEH-shem. Wiggle your fingers like rain!)'),
        BY('Five big steps from anything else. Room for roots.', 'think'),
        O('One day it will have a פֶּרַח (perach, “flower”). Lots!'),
        N('(Say it: PEH-rakh.)'),
      ],
      [
        ask(
          'science',
          'what plants need to grow',
          6,
          [O('What does our tree need to grow?')],
          [
            opt('Water and sun', [O('Mayim and shemesh! Yes!', 'happy')], true),
            opt('Sweets', [O('Ha! Trees don’t eat sweets. They need water and sun.')]),
          ],
          'Said what a tree needs to grow: water and sunlight.',
          'K-LS1-1',
        ),
      ],
      [
        {
          id: 'you-water',
          label: 'I’ll water it first.',
          then: [O('Slowly. Mayim in, not mayim everywhere!', 'happy')],
        },
        {
          id: 'ori-water',
          label: 'Ori should water it. It’s his tree.',
          then: [O('Our tree. But thank you.', 'soft')],
        },
        {
          id: 'wobbler-water',
          label: 'Let the Wobbler do it!',
          then: [N('The Wobbler tips the can over itself. Splash!'), O('Geshem! The Wobbler made rain!', 'happy')],
        },
      ],
    ),
    sc(
      'lh6-s2-done',
      [
        N('A little tree stands in the gan. Drip, drip.'),
        N('The Wobbler pats the soil flat. With its whole body.'),
        O('מָה שְׁלוֹמֵךְ? (ma shlomekh?, “how are you?”), Fern?'),
        FE('בְּסֵדֶר (beseder, “fine”)! Muddy, but beseder.', 'happy'),
        N('(Say them: mah shlo-MEKH, beh-SEH-der.)'),
        FE('I’ll look after it. Badly, but with love.'),
        O('Is there a perach yet?'),
        N('The Wobbler lies down by the stake. It listens for perach.'),
        O('לֹא (lo, “no”). I’ll ask every day until I go!', 'happy'),
        N('(Say it: LOW. Shake your head!)'),
      ],
      [
        act(
          'literacy',
          'trace the shape ג (gimel)',
          1,
          'edu:trace:he:gimel',
          [
            O('Look at this shape: ג. It’s called gimel.'),
            O('In gan and geshem, this shape says “g”.'),
            O('It has a little foot, like it’s kicking a ball!'),
            N('(Trace it with a finger. Start on the right side.)'),
          ],
          'Traced the Hebrew letter shape ג (gimel), which says “g” in gan and geshem. Tracing only, not reading.',
          'ELOF: Literacy',
        ),
      ],
    ),
    // ------------------------------------------------ step 3: the review party
    sc(
      'lh6-s3',
      [
        N('Ori’s last night. Lanterns glow along the fence.'),
        O('This is a פָּנָס (panas, “lantern”). It helps me find the party!'),
        N('(Say it: pah-NAHS.)'),
        O('Party games! I say it in English. You shout it in Hebrew!'),
        O('Round one: “Hello!”'),
        N('Every Nubbin waves. The Wobbler wobbles… and stays up!'),
        O('Round two: count the lanterns with me, up to ten!'),
        O('Round three: animals! סוּס (sus, “horse”). אַרְנָב (arnav, “rabbit”).'),
        N('(Say them: SOOS, ar-NAHV. Gallop! Now hop!)'),
        O('Last round. You pick!'),
      ],
      [
        ask(
          'literacy',
          'review: saying hello in Hebrew',
          4,
          [O('“Hello!” What’s that in Hebrew?')],
          [
            opt('שָׁלוֹם (shalom, “hello”)', [O('Shalom! Wave, everybody!', 'happy'), N('(Say it: sha-LOME. Wave!)')], true),
            opt('לַיְלָה טוֹב (laila tov, “good night”)', [
              O('That’s good night! Hello is shalom.'),
              N('(Laila tov is LIE-la TOVE. Hello is sha-LOME.)'),
            ]),
          ],
          'Remembered the Hebrew word for hello, shalom, and told it apart from laila tov (good night).',
          'ELOF: Language and Communication',
        ),
        act(
          'maths',
          'count to 10 in Hebrew: review',
          6,
          'edu:count:he:lanterns:10',
          [
            N('(Point to each lantern. Count together.)'),
            O('אַחַת (achat), שְׁתַּיִם (shtayim), שָׁלוֹשׁ (shalosh), אַרְבַּע (arba), חָמֵשׁ (chamesh)!'),
            N('(Say them: ah-KHAT, SHTAI-yim, sha-LOSH, ar-BAH, kha-MESH.)'),
            O('שֵׁשׁ (shesh), שֶׁבַע (sheva), שְׁמוֹנֶה (shmone), תֵּשַׁע (tesha), עֶשֶׂר (eser)!'),
            N('(Say them: SHESH, SHEH-vah, shmo-NEH, TEH-sha, EH-ser.)'),
            O('Ten lanterns! Eser!', 'happy'),
          ],
          'Counted ten lanterns in Hebrew, achat to eser.',
          'K.CC.B.5',
        ),
      ],
      [
        {
          id: 'colours',
          label: 'Colours!',
          then: [
            O('Point to something אָדֹם (adom, “red”)!'),
            N('(Say it: ah-DOME.)'),
            O('Now something יָרֹק (yarok, “green”)!'),
            N('(Say it: yah-ROKE.)'),
            O('Something שָׁחֹר (shachor, “black”), like the night sky!'),
            N('(Say it: sha-KHOR.)'),
            O('The Wobbler is still a bit וָרֹד (varod, “pink”)!', 'happy'),
            N('(Say it: vah-RODE.)'),
          ],
        },
        {
          id: 'family',
          label: 'Family!',
          then: [
            O('Who carries the letters? Nova, a חֲבֵרָה (chavera, “friend”)!'),
            N('(Say it: khah-veh-RAH.)'),
            O('Whose tin is it? My סַבְתָּא (savta, “grandma”)!'),
            N('(Say it: SAHV-tah.)'),
            O('And who’s your חָבֵר (chaver, “friend”)? Me!', 'happy'),
            N('(Say it: khah-VER.)'),
          ],
        },
        {
          id: 'feelings',
          label: 'Feelings!',
          then: [
            O('The sleepy one is עָיֵף (ayef, “tired”).'),
            N('(Say it: ah-YEF. Big yawn!)'),
            O('And me? שָׂמֵחַ (sameach, “happy”). Very sameach!', 'happy'),
            N('(Say it: sah-MEH-akh. Big smile!)'),
          ],
        },
      ],
    ),
    sc(
      'lh6-s3-done',
      [
        O('You did it! Hello, numbers, animals, and more!', 'happy'),
        NV('עֶרֶב טוֹב (erev tov, “good evening”), everyone.', 'soft'),
        N('(Say it: EH-rev TOVE.)'),
        NV('Panas off soon. Then לַיְלָה טוֹב (laila tov, “good night”).'),
        N('(Say it: LIE-la TOVE. Big yawn!)'),
        N('The Nubbins gallop like a sus, then hop like an arnav. Bedtime!'),
        O('מָה שְׁלוֹמְךָ? (ma shlomkha?, “how are you?”), Wobbler?'),
        N('(Say it: mah shlom-KHA.)'),
        N('The Wobbler waves, and falls asleep halfway. Shh.'),
      ],
      [
        ask(
          'sel',
          'saying goodbye and thank you',
          4,
          [N('Ori goes home tomorrow.'), N('What could you say to him?')],
          [
            opt('Thank you for teaching me!', [O('Oh. That’s the nicest thing anyone has said.', 'soft')], true),
            opt('Nothing', [O('Goodbyes can feel hard. A wave is enough.', 'soft')]),
          ],
          'Thought about how to say goodbye and thank you to a friend who is leaving.',
          'CASEL: Relationship skills',
        ),
      ],
    ),
    // ------------------------------------------------ complete
    sc(
      'lh6-complete',
      [
        N('Morning. Ori’s bag waits by the gate, with his panas tied on.'),
        O('בֹּקֶר טוֹב (boker tov, “good morning”). The shemesh is out.', 'soft'),
        N('(Say it: BO-ker TOVE.)'),
        O('I’m sad to go. And happy I came. Both!', 'soft'),
        O('The chant, one last time. New verse! Everybody!'),
        O('You’re an Alef-Bet Keeper now. I made it up, so it’s real.'),
        O('שָׁלוֹם (shalom)! Goodbye. And hello, next time.', 'soft'),
        O('Is there a perach yet?'),
        N('Nobody looks. Everybody shouts “Lo!” The Wobbler falls over.'),
        N('The gate opens first time. Ori gallops off like a sus!'),
        N('The Wobbler sits by the shaked. It waits for perach.'),
        N('By the pond, the little shaked waits. One day: perach!'),
        N('(Hop like an arnav. Wave goodbye: shalom!)'),
      ],
      [
        act(
          'music',
          'a call-and-response chant reviewing the questline',
          4,
          'edu:chant:he:lh6',
          [
            N('(Say them: ah-DOME, yah-ROKE, ko-KHAV, yah-REH-akh.)'),
            N('(And: EE-mah, AH-bah, SAHV-tah, sha-LOME, toe-DAH.)'),
            O('“Adom, yarok, the colours bright,'),
            O('kochav, yareach, stars at night,'),
            O('ima, aba, savta too,'),
            O('shalom, shalom, and toda to you!”', 'happy'),
            N('(Say each line. Your child says it back. Wave on “shalom”!)'),
          ],
          'Joined in an original Hebrew review chant: colours, star and moon, family, hello and thank you.',
          'ELOF: Language and Communication',
        ),
      ],
    ),
  ],
  notes(
    'Culture: Tu BiShvat (ט״ו בִּשְׁבָט), “the New Year of the Trees”, falls on the 15th of the Hebrew month of Shevat, usually in January or February. People plant trees and eat fruit, especially dates, figs, pomegranates, olives and grapes; in Israel almond trees often blossom around then. Sprout says only that. ' +
      'Words in sprout LH6: step 1 Tu BiShvat, ets, shaked; step 2 gan, mayim, shemesh, geshem, perach; step 3 panas, sus, arnav, then the review (shalom, the numbers, colours, family, feelings, erev tov, laila tov, boker tov and the chant words). Dag is left to the base and reader bands. ' +
      'Every reviewed word gets its sound-alike again the first time it appears in this quest. ' +
      'Sprout shows one letter shape: ג (gimel), traced in lh6-s2-done. ' +
      'The chant in lh6-complete is the base file’s original second verse, spoken in rhythm. The Wobbler waves at the party and stays up, as in the base.',
  ),
);

// ================================================================== exports
export const EDU_LANG_HEBREW_SPROUT: EduQuest[] = [LH1, LH2, LH3, LH4, LH5, LH6];

export const CHECKS: string[] = [
  // LH1
  'edu:say:he:shalom',
  'edu:say:he:toda',
  'edu:count:nubbins:3',
  'edu:trace:he:shin',
  'edu:chant:he:lh1',
  // LH2
  'edu:point:he:right-to-left',
  'edu:count:pebbles:4',
  'edu:trace:he:alef',
  'edu:hop:stones:right-to-left',
  // LH3
  'edu:count:he:plums:5',
  'edu:say:he:numbers:6-10',
  'edu:trace:he:yod',
  'edu:count:he:stars:10',
  'edu:chant:he:countdown',
  // LH4
  'edu:sort:fruit:colour',
  'edu:point:colour:adom',
  'edu:trace:he:lamed',
  // LH5
  'edu:draw:family',
  'edu:say:he:family',
  'edu:say:he:feelings',
  'edu:trace:he:samech',
  // LH6
  'edu:trace:he:gimel',
  'edu:count:he:lanterns:10',
  'edu:chant:he:lh6',
];
