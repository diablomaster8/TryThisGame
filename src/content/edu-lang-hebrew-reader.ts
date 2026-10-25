/**
 * The Learning Grove, reader band (ages 7–10): the Hebrew questline “Ori’s Alef-Bet” (LH1–LH6).
 *
 *   LH1 Shalom, Ori!                greeting and replying (SL.K.1), words with two jobs (L.3.4), day and
 *                                   night (1-ESS1-1), equal groups, being patient with the shy, a chant
 *   LH2 Right to Left               reading direction, finding, tracing and ordering letters, vowel
 *                                   points (think), writing Ori’s name, names matter (think), halves (3.NF.A.1)
 *   LH3 Counting Plums              counting to ten and back, asking for help, “how many more?”, being a good
 *                                   loser (think), moonlight is sunlight (1-PS4-2), owls at night (4-LS1-2)
 *   LH4 Colours of the Orchard      sorting and counting (K.MD.B.3), shared words and what travels between
 *                                   languages (think), the feminine colour ending (note), birds spread seeds
 *                                   (2-LS2-2), mixing paint, liking what you didn’t choose (think), seeds
 *   LH5 Savta’s Letters             reading a letter, letters and the past (D2.His.2.K-2), months and years,
 *                                   boy and girl forms, a family tree, friends as family (think), comfort,
 *                                   two feelings at once
 *   LH6 The New Year of the Trees   Tu BiShvat (the brief’s facts only), why celebrate trees (think), what a
 *                                   tree needs (2-LS2-1), pollination (2-LS2-2), equal rows, saying goodbye
 *                                   (think), the chant, shalom’s three meanings (think)
 *
 * One EduScene for each of the 42 base scenes in lang-hebrew.ts (every step scene, done scene and
 * complete scene). Choice ids match the base exactly; reader keeps every choice. Base choices set no
 * flags, so these don’t either.
 *
 * Hebrew: only the vetted words, spelled exactly with niqqud; native script first, then romanisation
 * and meaning in brackets the first time in each quest. Grammar notes stay within the brief: right to
 * left, no capitals, vowel points, final forms, the boy/girl forms (how are you?, friend, feelings) and
 * the reader-only note that a colour’s ending changes for a feminine noun (adumah).
 * Hazel appears only as someone who used to write letters. British spelling.
 * See EDU-STYLE.md.
 */
import type { EduDomain, EduQuest, EduScene, GlossaryEntry, Lesson, LessonOption } from './types';
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

const std = (standard?: string): { standard?: string } => (standard ? { standard } : {});

const ask = (
  domain: EduDomain,
  skill: string,
  after: number,
  prompt: Line[],
  options: LessonOption[],
  parentNote: string,
  standard?: string,
): LessonIn => ({ domain, skill, kind: 'ask', after, prompt, options, parentNote, ...std(standard) });

const notice = (domain: EduDomain, skill: string, after: number, lines: Line[], parentNote: string, standard?: string): LessonIn => ({
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
): LessonIn => ({ domain, skill, kind: 'do', after, check, lines, parentNote, ...std(standard) });

const opt = (label: string, reply: Line[], best?: boolean): LessonOption => (best ? { label, reply, best } : { label, reply });

const gloss = (word: string, meaning: string, of: string): GlossaryEntry => ({ word, meaning, scene: `reader:${of}` });

// ================================================================== LH1 Shalom, Ori!
const LH1_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: the gate
  scene(
    'lh1-s1',
    [
      N('The gate rattles. Someone on the other side is lifting and pushing, and losing.'),
      NV('Lift AND push, Ori. Both at once. It’s a Grove thing.'),
      N('The gate gives. In tumbles a boy in a football shirt, hugging a biscuit tin like a trophy.'),
      O('שָׁלוֹם (shalom, “hello”)! Sorry. I had a fight with your gate. Your gate won.', 'happy'),
      NV('This is Ori. He’s staying with me for three weeks. He’s ten, and he lives in Israel.'),
      NV('He has already told me forty star names.'),
      O('Forty-two. You stopped listening at forty.'),
      O('In Hebrew, shalom means hello. It also means goodbye. And peace. It’s a very hard-working word.', 'think'),
      O('אֲנִי (ani) means “I”. קוֹרְאִים לִי… (korim li…) means “my name is…”. Korim li Ori!'),
      N('Over the wall, a small round wild Nubbin hears “shalom”, waves with both arms, and falls over.'),
      O('To ask “How are you?”, I say מָה שְׁלוֹמְךָ? (ma shlomkha?) to a boy.'),
      O('To a girl, I say מָה שְׁלוֹמֵךְ? (ma shlomekh?). The ending changes. Which one should I ask you?'),
    ],
    [
      act(
        'literacy',
        'greet someone in Hebrew and reply',
        3,
        'edu:say:he:shalom',
        [N('Say it back to Ori: sha-LOME. The strong part comes at the end: sha-LOME.'), O('Shalom! Perfect. You sound like you’ve been saying it for years.', 'happy')],
        'Greeted Ori in Hebrew by saying “shalom” back, with the stress on the last syllable.',
        'SL.K.1',
      ),
      ask(
        'literacy',
        'why one word can have several meanings (think question)',
        7,
        [N('Shalom means hello, goodbye and peace, all at once.'), N('Why might one word mean all three?')],
        [
          opt('When you meet or leave someone, you wish them peace.', [N('That’s a lovely answer. Every hello and goodbye can carry a wish for the other person.')]),
          opt('It saves having lots of words.', [N('That’s a fair answer. Languages often let one word do more than one job.')]),
          opt('I’m not sure. Maybe it just grew that way.', [N('That’s an honest answer. Words grow and change over a long time, and people don’t always know why.')]),
        ],
        'Thought about why a single word, shalom, can mean hello, goodbye and peace.',
        'L.3.4',
      ),
    ],
    [
      {
        id: 'shlomkha',
        label: 'Ask me “ma shlomkha?”',
        then: [O('Ma shlomkha?'), Y('בְּסֵדֶר (beseder, “fine”). I think?'), O('Beseder! That means “OK, fine”. Short and strong, like a header into the top corner.', 'happy')],
      },
      {
        id: 'shlomekh',
        label: 'Ask me “ma shlomekh?”',
        then: [O('Ma shlomekh?'), Y('בְּסֵדֶר (beseder, “fine”). I think?'), O('Beseder! That means “OK, fine”. Short and strong, like a header into the top corner.', 'happy')],
      },
      {
        id: 'either',
        label: 'Either one. Just say shalom!',
        then: [O('Shalom, then! If anyone asks how you are, say בְּסֵדֶר (beseder). It means “OK, fine”.'), Y('Beseder.'), O('Perfect. You sound like my uncle. That’s a compliment. Mostly.', 'happy')],
      },
    ],
  ),
  scene(
    'lh1-s1-done',
    [
      O('You said it! A proper shalom. Ten out of ten.', 'happy'),
      O('Well, nine. The gate gets a point for defending.'),
      N('The round Nubbin waves at Ori again, topples over, and lies there looking pleased.'),
      O('I’m calling that one the Wobbler. It’s my favourite already.'),
      O('Don’t tell the others.'),
      Y('Beseder.'),
      O('Beseder! Look at you. Two Hebrew words in one day.', 'happy'),
    ],
    [
      ask(
        'literacy',
        'the meaning of beseder',
        5,
        [O('You keep saying בְּסֵדֶר (beseder) like a local. Do you know what it means?')],
        [
          opt('OK, fine', [O('Ken! Beseder means “OK, fine”. You can say it about almost anything.', 'happy')], true),
          opt('Good night', [N('Not quite: good night is laila tov. Beseder means “OK, fine”.')]),
          opt('Hello', [N('Hello is shalom. Beseder means “OK, fine”.')]),
        ],
        'Remembered that beseder means “OK, fine”.',
        'L.3.4',
      ),
    ],
  ),
  // ------------------------------------------------ step 2: Nubbin school
  scene(
    'lh1-s2',
    [
      O('Right. Nubbin school. I’m the coach. You’re the assistant coach.'),
      O('The Wobbler is team captain, obviously.'),
      N('Ori sits on the grass, facing three Nubbins: the Wobbler, a shy one behind a dandelion, and a sleepy one.'),
      O('Coaching rule one: always say thank you. In Hebrew, that’s תּוֹדָה (toda, “thank you”).'),
      O('Rule two: be polite. בְּבַקָּשָׁה (bevakasha) means “please”. It also means “you’re welcome”.'),
      O('Hebrew words like to keep busy.'),
      O('When a Nubbin waves at shalom, we cheer טוֹב (tov, “good”)! Big tov. Stadium tov.'),
      N('The shy Nubbin peeks out from behind the dandelion, looks at Ori, and ducks back.'),
      O('Will she wave? כֵּן (ken, “yes”)? Or לֹא (lo, “no”)?'),
      O('Lo. Not yet. That’s fine. A coach is patient.'),
      O('I’m not patient. You be the patient one.'),
      N('The Wobbler waves at nobody in particular, falls over, and gets up to wave again.'),
    ],
    [
      ask(
        'literacy',
        'a word with two meanings: bevakasha',
        5,
        [O('Assistant coach, you’ll be teaching this one to the Nubbins. Bevakasha has two jobs. What are they?')],
        [
          opt('Please, and you’re welcome', [O('Ken! Please when you ask for something. You’re welcome when someone thanks you.', 'happy')], true),
          opt('Hello and goodbye', [N('That’s shalom’s job! Bevakasha means please, and you’re welcome.')]),
          opt('Yes and no', [N('Yes is ken and no is lo. Bevakasha means please, and you’re welcome.')]),
        ],
        'Learned that bevakasha means both “please” and “you’re welcome”.',
        'L.3.4',
      ),
      act(
        'sel',
        'being patient and calm with someone shy',
        10,
        'edu:wait:shy-nubbin',
        [N('Shy creatures need time. Sit still near the shy Nubbin and wait, without reaching for her.'), N('Sometimes the kindest thing you can do is be patient.')],
        'Practised being patient and calm with a shy creature instead of rushing her.',
        'CASEL: Social awareness',
      ),
    ],
    [
      {
        id: 'sit-wait',
        label: 'Sit down near the shy one and wait.',
        then: [N('You sit and wait. After a long time, one tiny paw lifts, just a little.'), O('Ken! KEN! Toda! (That was me whispering. I’m bad at whispering.)', 'happy')],
      },
      {
        id: 'say-softly',
        label: 'Whisper “shalom” very softly.',
        then: [N('You whisper it, and the shy Nubbin tilts her head as if the word tickled. One paw lifts.'), O('Tov! Very tov! Quiet shalom works on quiet Nubbins. Write that down, coach.', 'happy')],
      },
    ],
  ),
  scene(
    'lh1-s2-done',
    [
      N('The shy one waves. The sleepy one waves in its sleep.'),
      N('The Wobbler waves, falls over, and waves from the ground.'),
      O('Three Nubbins! Toda, toda, toda!', 'happy'),
      Y('Bevakasha.'),
      O('Bevakasha! You used the “you’re welcome” one.'),
      O('Assistant coach is now head coach. I’m demoted. Beseder.'),
    ],
    [
      ask(
        'maths',
        'multiplication as equal groups',
        1,
        [N('Each of the three Nubbins waves four times.'), N('How many waves is that altogether?')],
        [
          opt('7', [N('That’s 3 add 4, but it’s 3 groups of 4: 4, 8, 12. Twelve waves!')]),
          opt('12', [O('Twelve! Three groups of four. That’s a lot of waving. Tov!', 'happy')], true),
          opt('34', [N('Let’s count in fours, one group for each Nubbin: 4, 8, 12. Twelve waves.')]),
        ],
        'Worked out 3 groups of 4 waves make 12.',
        '3.OA.A.1',
      ),
    ],
  ),
  // ------------------------------------------------ step 3: good night
  scene(
    'lh1-s3',
    [
      N('The sun slides behind the western hill. The lanterns blink on.'),
      N('Ori yawns, and pretends he didn’t.'),
      O('Hebrew has a “good” for each part of the day.'),
      O('Morning is בֹּקֶר טוֹב (boker tov, “good morning”).'),
      O('Evening is עֶרֶב טוֹב (erev tov, “good evening”). Like now. Erev tov, lanterns!'),
      O('Bedtime is לַיְלָה טוֹב (laila tov, “good night”). Tov, tov, tov. Hebrew is very optimistic.'),
      NV('Go round and say laila tov to everyone before they go in. Fern’s still in the orchard.'),
      O('If you won’t see someone till tomorrow, say לְהִתְרָאוֹת (lehitra’ot, “see you”).'),
      O('Or just shalom. Shalom works for goodbye too. Shalom should have its own football team.'),
      N('At the word “shalom”, the Wobbler waves goodbye, falls over, and goes to sleep where it landed.'),
    ],
    [
      notice(
        'science',
        'day and night happen because the Earth turns',
        1,
        [N('The sun isn’t really sliding anywhere. The Earth is turning.'), N('As our side of the Earth turns away from the sun, evening comes, then night.')],
        'Learned that sunset and night happen because the Earth turns away from the sun.',
        '1-ESS1-1',
      ),
      ask(
        'literacy',
        'spotting a shared word in three phrases',
        5,
        [O('Boker tov, erev tov, laila tov. Spot the word all three share. What does it mean?')],
        [
          opt('tov, “good”', [O('Ken! Tov means good. Good morning, good evening, good night.', 'happy')], true),
          opt('shalom, “hello”', [N('Shalom isn’t in any of them! Look again: boker tov, erev tov, laila tov.'), N('The shared word is tov, “good”.')]),
          opt('toda, “thank you”', [N('Toda is thank you. The word in all three is tov, “good”.')]),
        ],
        'Spotted the shared word tov (“good”) in good morning, good evening and good night.',
        'L.3.4',
      ),
    ],
  ),
  scene(
    'lh1-s3-done',
    [
      FE('Laila tov to you too! I think. Did I say it right?'),
      FE('I’ve been practising on the plum tree.'),
      O('Perfect. Fern, תּוֹדָה רַבָּה (toda raba, “thank you very much”).'),
      O('That’s the big thank-you. For people who try.'),
      N('All three Nubbins are asleep in a heap by Ori’s tent, like dropped socks.'),
      O('Lehitra’ot, everybody. Laila tov. Toda raba for today.'),
      O('Tomorrow: letters.'),
    ],
    [
      ask(
        'sel',
        'what helps when learning something new (think question)',
        3,
        [N('Fern wasn’t sure she said it right, but she tried anyway.'), N('What helps you when you’re learning something new?')],
        [
          opt('Trying anyway, even if it comes out wrong.', [N('That’s a brave answer. Ori said toda raba to Fern because she tried.')]),
          opt('Practising, like Fern with the plum tree.', [N('That’s a good answer. Little and often is how new words stick.')]),
          opt('Having someone kind to check with.', [N('That’s a wise answer. Learning is easier with a friend who cheers instead of laughing.')]),
        ],
        'Thought about what helps when learning something new: trying, practising and kind friends.',
        'CASEL: Self-management',
      ),
    ],
  ),
  // ------------------------------------------------ complete
  scene(
    'lh1-complete',
    [
      N('Morning. Somebody has hung a sign on the gate that says שָׁלוֹם.'),
      O('בֹּקֶר טוֹב (boker tov)! I made you a sign. Shalom for coming in, shalom for going out.', 'happy'),
      O('Quick-fire round! I say it in English, you say it in Hebrew.'),
      O('Then my chant. I made it up myself. Don’t laugh. Actually, laugh. Laughing is tov.'),
      O('“Boker tov, the sun is out! Shalom, shalom, wave and shout!”'),
      O('“Erev tov, the lanterns glow, laila tov, and off we go!”'),
      N('The Wobbler hears “shalom”, waves with both arms, wobbles hard and, for the first time, stays upright.'),
      O('It stayed up! Historic! Lehitra’ot, gravity!', 'shock'),
      N('The shalom sign stays on the gate. Nubbins who learned the word wave at it.'),
    ],
    [
      ask(
        'literacy',
        'choosing the right greeting for the time of day',
        2,
        [O('First one. The lanterns are on and it’s bedtime. What do you say?')],
        [
          opt('לַיְלָה טוֹב (laila tov)', [O('Laila tov! Good night!', 'happy')], true),
          opt('בֹּקֶר טוֹב (boker tov)', [N('Boker tov is for the morning. At bedtime it’s laila tov.')]),
          opt('תּוֹדָה (toda)', [N('Toda is thank you. At bedtime it’s laila tov.')]),
        ],
        'Chose laila tov as the Hebrew for “good night”.',
        'SL.K.1',
      ),
      act(
        'music',
        'rhythm and rhyme in a chant',
        5,
        'edu:chant:he:boker-tov',
        [N('Say the chant with Ori and clap on the strong beats: BO-ker TOVE, the SUN is OUT!'), N('Chants use rhythm and rhyme to help words stick. Out and shout rhyme; so do glow and go.')],
        'Said an original chant with Hebrew greetings, clapping the rhythm and spotting the rhymes.',
        'RL.2.4',
      ),
    ],
  ),
];

// ================================================================== LH2 Right to Left
const LH2_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: the shalom pebbles
  scene(
    'lh2-s1',
    [
      O('Today: the alef-bet. That’s our alphabet. It’s named after its first two letters, alef and bet.'),
      O('Rule one: Hebrew goes right to left. You start on the right side of the page and travel left.'),
      N('The Wobbler hears “right to left”, thinks very hard about it, and starts walking backwards.'),
      O('I hid the letters of שָׁלוֹם round the garden, painted on pebbles. Four letters.'),
      O('ש is shin. It says “sh”. Three arms reaching up, like a goalie celebrating.'),
      O('ל is lamed. It says “l”. It’s the tallest letter: it sticks up above all the others.'),
      O('ו is vav. A stick with a little hook. Here it makes an “o” sound.'),
      O('Vav can say v, o or u. Very flexible. A real midfielder.'),
      O('Mem says “m”. At the end of a word it changes shape and closes up like a box: ם.'),
      O('Five letters do that. They have a special shape just for the end of a word.'),
      O('Find shin, lamed, vav and final mem. Then line them up from the RIGHT.'),
    ],
    [
      ask(
        'literacy',
        'Hebrew is read and written right to left',
        1,
        [N('Ori says Hebrew goes right to left. Where does the first letter of a Hebrew word go?')],
        [
          opt('On the right', [O('Ken! The right side. Then you travel left.', 'happy')], true),
          opt('On the left', [N('That’s where English starts. Hebrew starts on the right and travels left.')]),
          opt('In the middle', [N('Not quite. Hebrew starts on the right side and travels left.')]),
        ],
        'Learned that Hebrew starts on the right and is read right to left.',
      ),
      act(
        'literacy',
        'finding and ordering letters right to left',
        10,
        'edu:find:he:letters:shalom',
        [N('Find the four pebbles and put them in a row. Start on the right: ש first, then ל, then ו, then ם on the far left.')],
        'Found the four letters of shalom and put them in order from right to left.',
      ),
    ],
  ),
  scene(
    'lh2-s1-done',
    [
      N('Four pebbles sit on the path, lined up from right to left: ש ל ו ם.'),
      O('Shin, lamed, vav, mem. Shalom!', 'happy'),
      O('Now look at the word with its dots and lines: שָׁלוֹם.'),
      O('The little dots and lines are the vowels. They’re called niqqud.'),
      O('Children’s books use them. Grown-ups mostly leave them out and just know.'),
      N('The Wobbler arrives, backwards, and sits proudly on the vav.'),
    ],
    [
      ask(
        'literacy',
        'why vowel points are often left out (think question)',
        4,
        [N('Grown-ups mostly leave the vowel dots out. Why might they do that?')],
        [
          opt('It’s quicker to write without them.', [N('That’s a fair answer. Fewer marks means faster writing.')]),
          opt('They know the words, so they don’t need the help.', [N('That’s a thoughtful answer. Once you know a word well, you can read it from its letters alone.')]),
          opt('I think they should keep them!', [N('That’s a fair point too. The dots help learners, which is why children’s books keep them.')]),
        ],
        'Thought about why Hebrew vowel points (niqqud) are used in children’s books but often left out by adults.',
      ),
    ],
  ),
  // ------------------------------------------------ step 2: alef and bet in the sand
  scene(
    'lh2-s2',
    [
      N('By the pond, the mud has dried into smooth sand. Ori flattens it with the side of his trainer.'),
      O('Now the first letters. The ones the alef-bet is named after.'),
      O('א is alef. It’s silent. It just holds a vowel, like a cup holds tea.'),
      O('A letter that says nothing. I could never.'),
      O('ב is bet. With a dot inside, it says “b”. Without the dot, it says “v”, and we call it vet.'),
      O('Then ג gimel, “g”. ד dalet, “d”. ה hey, “h”. That’s five. A whole five-a-side team.'),
      O('Hebrew has no capital letters, by the way. No big versions, no small versions. Very fair.'),
      NV('I tried learning these once, on a long boat trip. I got as far as gimel. The boat got as far as seasick.'),
      N('The Wobbler, still walking backwards, reverses into the pond with a plop. It climbs out, delighted.'),
      O('Your stick starts on the right and travels left. Which one first?'),
    ],
    [
      act(
        'literacy',
        'tracing a Hebrew letter right to left',
        4,
        'edu:trace:he:alef',
        [N('Trace א in the sand. Start on the right side, and move your stick to the left.'), O('Alef! The silent one. It’s holding a vowel for you.', 'happy')],
        'Traced the letter alef, starting on the right.',
      ),
      ask(
        'literacy',
        'one letter, two sounds: bet and vet',
        8,
        [N('Ori rubs the dot out of the sand ב with his thumb.'), O('Now what does it say? And what’s it called?')],
        [
          opt('“v”, and it’s called vet', [O('Ken! Bet with a dot, vet without. One letter, two sounds.', 'happy')], true),
          opt('“b”, and it’s still bet', [N('With the dot it’s “b”. Without the dot it’s “v”, and we call it vet.')]),
          opt('No sound, like alef', [N('Alef is the silent one. Bet without its dot says “v”: vet.')]),
        ],
        'Learned that the letter bet says “b” with a dot and “v” (vet) without.',
      ),
    ],
    [
      { id: 'alef-first', label: 'Alef first. The silent one.', then: [O('Alef first. Respect. The quiet ones go first in this game.', 'happy')] },
      { id: 'bet-first', label: 'Bet first. The one that makes two sounds.', then: [O('Bet first! Bold. Rule-breaker. I like it. Alef straight after, though.', 'happy')] },
    ],
  ),
  scene(
    'lh2-s2-done',
    [
      N('In the sand: א ב ג ד ה, a bit wobbly and very proud.'),
      O('Alef and bet! One letter speaks, one letter stays quiet.', 'happy'),
      O('And if bet loses its dot, it turns into vet.'),
      O('I’ve scratched gimel, dalet and hey in next to them. Now put all five in alef-bet order.'),
      N('The Wobbler is still dripping. It shakes itself dry, all over Ori.'),
      O('Next is the most important word in the whole alef-bet. My name.'),
    ],
    [
      act(
        'literacy',
        'putting the first five letters in order',
        3,
        'edu:order:he:alef-bet:5',
        [N('Put the five sand letters in alef-bet order, starting on the right: א ב ג ד ה.'), N('Alef, bet, gimel, dalet, hey.')],
        'Put the first five Hebrew letters in alef-bet order, right to left.',
      ),
    ],
  ),
  // ------------------------------------------------ step 3: Ori’s name
  scene(
    'lh2-s3',
    [
      N('Ori’s tent stands by the cottage. It is green, slightly crooked, and has a football scarf on the pole.'),
      O('My name in Hebrew is אוֹרִי. Four letters: alef, vav, resh, yod.'),
      O('You know alef. You know vav, the stick with the hook.'),
      O('New ones: ר is resh. It says “r”. It looks like a bent elbow.'),
      O('And י is yod. It says “y”, or sometimes “i”. Yod is the smallest letter.'),
      O('Here’s the good bit. אוֹר (or) means “light”.'),
      O('Add a yod and you get Ori: “my light”.'),
      O('My parents named me “my light”. No pressure. I’ve looked at stars every night since I was four.'),
      NV('His savta told me that once, in a letter I carried for her. A long time ago now.', 'soft'),
      N('The Wobbler watches with enormous attention. It is facing the wrong way.'),
      O('Korim li Ori, and now you can write it too. Start on the right. Alef first.'),
    ],
    [
      notice(
        'literacy',
        'finding a smaller word inside a name',
        6,
        [O('Look: אוֹר and אוֹרִי. My name starts with the word for light.'), N('Spotting a smaller word inside a bigger one can help you remember what the bigger one means.')],
        'Noticed that the name Ori (“my light”) contains the word or (“light”).',
        'L.3.4',
      ),
      act(
        'literacy',
        'writing a name in Hebrew letters',
        10,
        'edu:write:he:ori',
        [N('Paint אוֹרִי on the tent, letter by letter. Start on the right: alef, vav, resh, yod.')],
        'Wrote the name Ori in Hebrew letters, from right to left.',
      ),
    ],
    [
      { id: 'big', label: 'Paint it big, across the door.', then: [O('Big! You’ll be able to see it from the hill. Maybe from space.', 'happy')] },
      { id: 'small', label: 'Paint it small and neat, by the zip.', then: [O('Small and neat. Like a signature. A famous person’s signature.', 'happy')] },
      { id: 'star', label: 'Paint it, then add a star next to it.', then: [O('A star! You get me. A light next to “my light”. That’s poetry, that is.', 'happy')] },
    ],
  ),
  scene(
    'lh2-s3-done',
    [
      N('On the tent, in fresh paint: אוֹרִי.'),
      O('That’s me. Alef, vav, resh, yod.', 'happy'),
      O('You wrote my name in Hebrew.'),
      O('Nobody here has done that before.', 'soft'),
      N('The Wobbler finally turns round, sees the name the right way up, and waves at it.'),
      O('Even the Wobbler can read it now. Well. It can wave at it.'),
    ],
    [
      ask(
        'sel',
        'why getting someone’s name right matters (think question)',
        3,
        [N('Ori looks really pleased. How do you think it feels when someone learns to say or write your name properly?')],
        [
          opt('It feels like they care about you.', [N('That’s a kind answer. Getting someone’s name right is a way of saying “you matter”.')]),
          opt('It feels a bit strange, but nice.', [N('That’s an honest answer. It can be surprising to see your name somewhere new.')]),
          opt('I don’t mind either way.', [N('That’s fair too; people feel differently. Ori, it turns out, minds a lot, in a good way.')]),
        ],
        'Thought about how it feels when someone learns your name properly.',
        'CASEL: Social awareness',
      ),
    ],
  ),
  // ------------------------------------------------ complete
  scene(
    'lh2-complete',
    [
      N('At dusk, Ori sets flat stones along the path to his tent. Each one has a letter painted on it.'),
      O('Stepping stones! Alef, bet, gimel, dalet, hey.'),
      O('Then the shalom ones. Then the ones from my name, אוֹרִי.'),
      O('Quick-fire. I point, you answer.'),
      O('Hebrew has twenty-two letters. You’ve met eleven. That’s… a fraction!'),
      N('You step from stone to stone, right to left. The Wobbler follows you backwards and doesn’t fall in the pond once.'),
      O('The alef-bet stones are yours. Walk them every day and the letters walk into your head.'),
    ],
    [
      ask(
        'literacy',
        'recognising letters by shape',
        3,
        [O('Which is the tallest letter, sticking up above the others?')],
        [
          opt('ל (lamed)', [O('Lamed! The one peering over the fence.', 'happy')], true),
          opt('י (yod)', [N('Yod is the smallest letter! The tallest is ל, lamed.')]),
          opt('א (alef)', [N('Alef is the silent one. The tallest is ל, lamed.')]),
        ],
        'Recognised lamed as the tallest Hebrew letter.',
      ),
      ask(
        'maths',
        'one half as a fraction',
        4,
        [O('Twenty-two letters. You know eleven. What fraction of the alef-bet is that?')],
        [
          opt('One half', [O('Half! Eleven is half of twenty-two. It’s half-time!', 'happy')], true),
          opt('One quarter', [N('A quarter of 22 would be only about 5. Eleven is exactly half: 11 + 11 = 22.')]),
          opt('One third', [N('A third of 22 would be about 7. Eleven and eleven make twenty-two, so eleven is one half.')]),
        ],
        'Worked out that 11 letters out of 22 is one half.',
        '3.NF.A.1',
      ),
    ],
  ),
];

// ================================================================== LH3 Counting Plums
const LH3_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: the plums
  scene(
    'lh3-s1',
    [
      N('In Fern’s orchard the plum trees are heavy. Fern sits under one with two baskets, looking lost.'),
      FE('Ten plums for each basket, for the market. I’ve counted four times and got four different numbers.'),
      O('Let me. I count in Hebrew. It’s faster. It isn’t faster. It sounds faster.'),
      O('אַחַת (achat, 1). שְׁתַּיִם (shtayim, 2). שָׁלוֹשׁ (shalosh, 3).'),
      O('אַרְבַּע (arba, 4). חָמֵשׁ (chamesh, 5).'),
      O('Chamesh has a throaty “ch”, like the end of “loch”.'),
      FE('Achat… shtayim… I keep wanting to sneeze it.'),
      O('Sneezy is close! SHTAI-yim. Say it like you mean it.'),
      O('Six to ten, I’ll call them and you copy. Tomorrow you do them alone.'),
      N('The Wobbler sits under the tree, catching every plum that falls. Mostly with its face.'),
    ],
    [
      notice(
        'literacy',
        'the throaty “ch” sound in Hebrew',
        5,
        [O('Try it: say “loch” the Scottish way, and hold the end. Chhh.'), N('In Hebrew, “ch” and “kh” stand for this throaty sound, like the end of the Scottish word “loch”.')],
        'Practised the throaty Hebrew “ch” sound, as in Scottish “loch”.',
      ),
      act(
        'maths',
        'counting to ten in Hebrew',
        9,
        'edu:count:he:plums:10',
        [
          N('Count the plums into Fern’s basket: achat, shtayim, shalosh, arba, chamesh…'),
          N('…then copy Ori: שֵׁשׁ (shesh), שֶׁבַע (sheva), שְׁמוֹנֶה (shmone), תֵּשַׁע (tesha), עֶשֶׂר (eser)!'),
        ],
        'Counted ten plums in Hebrew, one number for each plum.',
        'K.CC.B.5',
      ),
    ],
    [
      { id: 'you-count', label: 'I’ll count. You check.', then: [O('Deal. If you’re wrong, I say lo. If you’re right, I say ken. I expect to say ken a lot.', 'happy')] },
      { id: 'fern-count', label: 'Let Fern count. We’ll cheer.', then: [FE('No pressure, then.', 'shock'), O('Huge pressure. Stadium pressure. Achat!', 'happy')] },
    ],
  ),
  scene(
    'lh3-s1-done',
    [
      FE('Ten! Ten plums. That’s… עֶשֶׂר?', 'happy'),
      O('Eser! Ten. Fern, you’re a natural.'),
      FE('And the second basket has ten as well. So that’s…'),
      O('Twenty. But twenty is a different lesson. Don’t get greedy.'),
      N('The Wobbler has a plum balanced on its head. Nobody mentions it.'),
      FE('Toda, Ori. Now I just have to sell them.'),
    ],
    [
      notice(
        'sel',
        'asking for help',
        5,
        [N('Fern counted four times on her own and kept getting muddled. Then she let Ori help.'), N('Asking for help isn’t giving up. It’s a smart way to get a hard job done.')],
        'Saw that asking for help is a sensible, strong choice when a job is hard.',
        'CASEL: Relationship skills',
      ),
    ],
  ),
  // ------------------------------------------------ step 2: How Many?
  scene(
    'lh3-s2',
    [
      N('Ori sets up four jumpers, a goal at each end, and bounces his football on his knee.'),
      N('He says it’s a world record. It isn’t.'),
      O('The game is called “How Many?” I shoot. You count the goals in Hebrew. Right answer, you get the ball.'),
      O('You need the big numbers now. שֵׁשׁ (shesh, 6). שֶׁבַע (sheva, 7). שְׁמוֹנֶה (shmone, 8).'),
      O('תֵּשַׁע (tesha, 9). And עֶשֶׂר (eser, 10). Ten is my shirt number. Ten is the best number.'),
      N('The Wobbler is in goal. It has decided that being in goal means waving at the ball.'),
      O('Warning. I am a very good footballer and a very bad loser.', 'think'),
      O('Ask my savta. She hid all our board games.'),
      O('Ready? Achat, shtayim, shalosh, GO!'),
    ],
    [
      ask(
        'literacy',
        'Hebrew numbers six to ten',
        4,
        [O('Shirts before kick-off. I’m ten, obviously. You can be שְׁמוֹנֶה (shmone). Which number goes on your back?')],
        [
          opt('8', [O('Shmone, eight! Ken!', 'happy')], true),
          opt('6', [N('Six is shesh. Shmone is eight.')]),
          opt('10', [N('Ten is eser, Ori’s shirt number. Shmone is eight.')]),
        ],
        'Matched the Hebrew number shmone to 8.',
        'L.3.4',
      ),
      ask(
        'sel',
        'handling losing (think question)',
        7,
        [N('Ori says he’s a very bad loser. What could help someone who hates losing?')],
        [
          opt('Remembering it’s just a game.', [N('That’s a good answer. Games are for fun, and fun works best when everyone enjoys it.')]),
          opt('Taking a deep breath before saying anything.', [N('That’s a wise answer. A slow breath gives the cross feeling time to settle.')]),
          opt('Saying “well played” even when it’s hard.', [N('That’s a brave answer. Being a good sport is a skill, and it gets easier with practice.')]),
        ],
        'Thought about ways to cope with losing a game.',
        'CASEL: Self-management',
      ),
    ],
    [
      { id: 'go-easy', label: 'Go easy on me.', then: [O('Lo. Never. A coach never goes easy. …Beseder, a bit easy. For the first shot.', 'happy')] },
      { id: 'bring-it', label: 'Bring it on.', then: [O('Ken! Now you’re talking like a footballer!', 'happy')] },
    ],
  ),
  scene(
    'lh3-s2-done',
    [
      N('Final score: Ori ten, the Wobbler one.'),
      N('The Wobbler waved, and the ball bounced off its tummy. It rolled the whole length of the grass and into Ori’s goal.'),
      O('That’s… that’s one. Achat! It scored ACHAT.', 'shock'),
      O('Best of three. Best of shesh. Best of sheva. Best of eser!'),
      NV('Ori.'),
      O('…Beseder. Toda for the game. Well played, Wobbler.', 'sad'),
      N('He means it about halfway. That’s a start.'),
    ],
    [
      ask(
        'maths',
        'finding “how many more” by taking away',
        1,
        [N('Ori scored eser (10), and the Wobbler scored achat (1).'), N('How many more goals did Ori score?')],
        [
          opt('9', [O('Nine more. Which is fine. Totally fine. I’m fine.', 'sad')], true),
          opt('11', [N('Eleven is how many goals altogether. To find how many MORE, take away: 10 − 1 = 9.')]),
          opt('10', [N('Close! Ori scored 10, but the Wobbler scored 1, so Ori scored 10 − 1 = 9 more.')]),
        ],
        'Found the difference between two scores by subtracting: 10 − 1 = 9.',
        '1.OA.A.1',
      ),
      notice(
        'sel',
        'being a good sport',
        5,
        [N('Ori was cross. Then he took a moment and said “well played”.'), N('Losing can feel big. Noticing the feeling, then choosing kind words anyway, is what being a good sport means.')],
        'Saw how a character calms down after losing and chooses kind words.',
        'CASEL: Self-management',
      ),
    ],
  ),
  // ------------------------------------------------ step 3: the stars
  scene(
    'lh3-s3',
    [
      N('Night. Ori drags you up the western hill with a blanket, a torch and the biscuit tin, full of snacks for once.'),
      O('Best sky I’ve ever seen. No city lights. At home I have to squint.'),
      O('A star is כּוֹכָב (kochav). Every one of those is a kochav.'),
      O('Each kochav is a sun, just really, really far away.'),
      O('And that’s the יָרֵחַ (yareach, “moon”). The yareach isn’t a kochav.'),
      O('It makes no light of its own. The sun lights it up.'),
      N('Something on a branch says “hoo”. Two round eyes blink at you.'),
      O('יַנְשׁוּף (yanshuf)! An owl! Shalom, yanshuf! Sorry. I’m excited. Owls are night people, like me.', 'happy'),
      O('Count ten stars before the clouds come in. Out loud. In Hebrew.'),
      N('The Wobbler lies on its back next to you and waves at the sky.'),
    ],
    [
      notice(
        'science',
        'stars make light; the moon reflects sunlight',
        5,
        [N('Stars make their own light, like our sun does. The moon doesn’t.'), N('We see the moon because sunlight bounces off it, the way a torch lights up a wall.')],
        'Learned that stars are distant suns and that we see the moon because it reflects sunlight.',
        '1-PS4-2',
      ),
      ask(
        'science',
        'how owls find food at night',
        7,
        [N('The yanshuf hunts at night. What helps an owl find food in the dark?')],
        [
          opt('Big eyes for dim light, and very sharp hearing', [N('Ken! Owls have huge eyes for dim light, and ears sharp enough to hear a mouse moving in the grass.')], true),
          opt('It glows, like a lantern', [N('Owls don’t glow! They use big eyes and sharp hearing instead.')]),
          opt('It waits for the sun to come up', [N('Owls that hunt at night don’t wait for morning. Their big eyes and sharp hearing work in the dark.')]),
        ],
        'Learned that owls use large eyes and sharp hearing to hunt at night.',
        '4-LS1-2',
      ),
    ],
    [
      { id: 'bright', label: 'Start with the brightest star.', then: [O('Good choice. The bright ones go first. Achat!', 'happy')] },
      { id: 'faint', label: 'Start with the faintest star.', then: [O('The faint ones are the brave ones. They shine anyway. Achat!', 'soft')] },
    ],
  ),
  scene(
    'lh3-s3-done',
    [
      O('…shmone, tesha, eser! Ten stars!', 'happy'),
      O('You counted ten stars in Hebrew, on a hill, at night. That’s the best thing you can do with numbers.'),
      N('The yanshuf hoots once, as if it had been counting too.'),
      O('My savta counts stars with me from her balcony at home.', 'soft'),
      O('Every bright one, she says “or”. Light.'),
      N('Ori goes quiet for a while, looking up.'),
    ],
    [
      ask(
        'literacy',
        'recognising a word inside a name',
        4,
        [N('Savta says אוֹר (or) for every bright star. Whose name has אוֹר hiding inside it?')],
        [
          opt('Ori’s: אוֹרִי', [O('Mine! Or means light, and Ori means my light.', 'happy')], true),
          opt('Fern’s', [N('Fern’s name isn’t Hebrew! Look at אוֹרִי: it starts with אוֹר.')]),
          opt('The Wobbler’s', [N('The Wobbler would love that. But it’s Ori: אוֹרִי starts with אוֹר.')]),
        ],
        'Recognised the word or (“light”) inside the name Ori.',
        'L.3.4',
      ),
    ],
  ),
  // ------------------------------------------------ complete
  scene(
    'lh3-complete',
    [
      N('Morning. Fern has pinned a chart to the orchard gate: ten plums in a row, with Hebrew numbers underneath.'),
      FE('I’m going to say them to every plum I sell. Toda raba, Ori.'),
      FE('The customers will love it. Or leave.'),
      O('Quick-fire countdown, like a rocket launch!'),
      O('Eser, tesha, shmone, sheva, shesh, chamesh, arba, shalosh, shtayim, achat!'),
      N('On “achat”, the Wobbler leaps into the air, waves, and lands in a basket of plums.'),
      O('Lift-off. Well. Plum-off.', 'happy'),
      O('For you: my star chart, numbered achat to eser, with the yareach in the corner. And my football.'),
      O('Mostly the Wobbler earned it. Don’t tell it. It’ll want a rematch. I know I would.'),
    ],
    [
      act(
        'maths',
        'counting backwards from ten in Hebrew',
        4,
        'edu:count:he:countdown:10',
        [N('Count down from eser to achat with Ori, getting quieter on each number. Then shout the last one!'), N('Counting backwards is a great way to check you really know the order.')],
        'Counted backwards from 10 to 1 in Hebrew.',
      ),
    ],
  ),
];

// ================================================================== LH4 Colours of the Orchard
const LH4_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: sorting
  scene(
    'lh4-s1',
    [
      N('Nova drops a crate on the cottage table. It’s full of fruit from the valley market, all jumbled up.'),
      NV('I bought one of everything. I was hungry, and the stallholder was very persuasive.'),
      O('Sorting game! By colour. In Hebrew.'),
      O('אָדֹם (adom) is red. יָרֹק (yarok) is green. צָהֹב (tsahov) is yellow.'),
      O('Now fruit. תַּפּוּחַ (tapuach) is an apple. בָּנָנָה (banana) is… banana. You’re welcome.'),
      O('And לִימוֹן (limon) is a lemon. Hebrew is being nice to you today. Don’t get used to it.'),
      O('A limon goes in tsahov. A banana goes in tsahov. A tapuach goes in adom, or yarok.'),
      O('It depends on the tapuach.'),
      N('The Wobbler sits in the middle of the table, hugging a banana. It does not look ready to share.'),
    ],
    [
      ask(
        'literacy',
        'words that are shared between languages',
        5,
        [N('One of these Hebrew words sounds the same as in English. Which?')],
        [
          opt('בָּנָנָה (banana)', [O('Banana! Same word. And limon is pretty close to lemon too.', 'happy')], true),
          opt('תַּפּוּחַ (tapuach)', [N('Tapuach means apple, but it doesn’t sound like “apple”. Banana sounds the same in both.')]),
          opt('יָרֹק (yarok)', [N('Yarok means green. The one that sounds the same is banana.')]),
        ],
        'Noticed that some words, like banana, are shared by Hebrew and English.',
        'L.3.4',
      ),
      act(
        'maths',
        'sorting into groups and counting each',
        8,
        'edu:sort:he:fruit:colour',
        [N('Sort the fruit into three baskets: adom, yarok and tsahov. Then count each basket.'), N('Which basket has the most? Which has the fewest?')],
        'Sorted fruit by colour using Hebrew colour words, then counted and compared the groups.',
        'K.MD.B.3',
      ),
    ],
    [
      { id: 'green-apple', label: 'Put the green apple in yarok.', then: [O('Yarok! Ken. An apple doesn’t have to be adom. Apples can be whatever they like.', 'happy')] },
      { id: 'red-apple', label: 'Put the red apple in adom.', then: [O('Adom! Ken. The classic. Like in a picture book.', 'happy')] },
    ],
  ),
  scene(
    'lh4-s1-done',
    [
      N('Three neat piles: adom, yarok, tsahov.'),
      N('There’s also a small fourth pile under the table, guarded by the Wobbler.'),
      O('The Wobbler has invented a new colour. It’s called “mine”.'),
      NV('It’s a very popular colour. I see it a lot at markets.'),
      O('Banana, limon… some Hebrew words sound a lot like English ones.'),
      O('Some words travel. They move from language to language, like Nova.'),
    ],
    [
      ask(
        'literacy',
        'what changes when a word moves between languages (think question)',
        5,
        [N('Banana is the same in Hebrew and English. Limon is close to lemon.'), N('When a word moves into another language, what does it keep, and what might change?')],
        [
          opt('It keeps its meaning, but the sound changes a little.', [N('That’s a sharp answer. Limon and lemon mean the same fruit but sound a bit different.')]),
          opt('It might lose where it came from.', [N('That’s a thoughtful answer. People often forget which language a word started in.')]),
          opt('It keeps everything. A banana is a banana.', [N('That’s a fair answer! Some words, like banana, hardly change at all.')]),
        ],
        'Thought about what a word keeps and loses when it moves into another language.',
      ),
    ],
  ),
  // ------------------------------------------------ step 2: something adom
  scene(
    'lh4-s2',
    [
      N('Clover is by the pond with a little Nubbin who hasn’t eaten all day.'),
      CL('This one will only eat red things. Don’t ask me why. We all have our ways.'),
      O('Something adom! On it. I’m fast. I play on the wing.'),
      O('רִמּוֹן (rimon) is a pomegranate. Red outside, and full of red seeds inside. My favourite.'),
      O('עֲנָבִים (anavim) are grapes. These ones are סָגֹל (sagol), purple. Not adom. Close, but lo.'),
      O('תְּאֵנָה (te’ena) is a fig. Also a bit sagol.'),
      O('And תָּמָר (tamar) is a date. Brown and sticky.'),
      N('A צִפּוֹר (tsipor), a small bird, lands on the crate and pecks at the te’ena.'),
      O('Tsipor! Lo! That’s not yours! …Fine. One bite. Bevakasha.'),
    ],
    [
      notice(
        'literacy',
        'colour words change their ending for feminine words',
        4,
        [
          O('Adom is the form we use to name the colour red.'),
          O('Hebrew sorts words into masculine and feminine. When a colour describes a feminine word, its ending changes, for example adumah.'),
        ],
        'Learned that Hebrew colour words change their ending to describe feminine words (adom, adumah).',
      ),
      act(
        'literacy',
        'recognising a colour word',
        8,
        'edu:tap:he:colour:adom',
        [N('Find something adom in the crate and tap it. Careful: sagol is not adom!')],
        'Found something red when asked for “adom”.',
      ),
    ],
    [
      { id: 'rimon', label: 'Take the rimon.', then: [CL('Oh, that’s very adom. Look, she’s already sniffing it.', 'happy')] },
      { id: 'tapuach', label: 'Take a red tapuach.', then: [CL('A red apple. Lovely. Look, she’s already sniffing it.', 'happy')] },
      {
        id: 'anavim',
        label: 'Take the anavim.',
        then: [N('Clover’s Nubbin sniffs the grapes and turns her back on them, very slowly.'), O('Sagol, not adom! …Here, take the rimon instead. I’m not saying I told you. I am, a bit.')],
      },
    ],
  ),
  scene(
    'lh4-s2-done',
    [
      N('The fussy Nubbin eats the red fruit very slowly.'),
      N('Then it looks at Clover, as if to say “more”.'),
      CL('Toda. Did I say that right? Ori’s been teaching everyone.', 'happy'),
      O('Perfect toda. I’d give you a medal, but I’m out of medals. Have a fig.'),
      N('Over on the crate, the tsipor is still pecking at the te’ena.'),
      O('That tsipor has eaten half a fig. I respect it. I don’t like it. But I respect it.'),
    ],
    [
      notice(
        'science',
        'birds spread seeds',
        4,
        [N('Birds that eat fruit help plants. They swallow the seeds and drop them somewhere new.'), N('That’s one way fruit trees spread across a valley.')],
        'Learned that fruit-eating birds help spread seeds to new places.',
        '2-LS2-2',
      ),
    ],
  ),
  // ------------------------------------------------ step 3: the fence
  scene(
    'lh4-s3',
    [
      N('Fern’s fence is grey, peeling and sad. Fern has a row of paint tins and no ideas.'),
      FE('Pick three colours. Any three. I once took forty minutes to choose a spoon.'),
      O('I’ll call them out in Hebrew. You paint what I call. No peeking at the labels.'),
      O('כָּחֹל (kachol) is blue. לָבָן (lavan) is white. שָׁחֹר (shachor) is black.'),
      O('כָּתֹם (katom) is orange. And וָרֹד (varod) is pink.'),
      FE('That’s five colours. And I’ve got… all of them, apparently. Nova bought paint as well.'),
      N('A פַּרְפַּר (parpar), a butterfly, flutters over the tins and settles on the kachol lid.'),
      O('Parpar! Even the butterfly wants to help.'),
      N('The Wobbler has climbed into the varod tin. It is now pink, and very happy about it.'),
    ],
    [
      ask(
        'art',
        'mixing paint colours',
        5,
        [FE('Oh no. Wait. The katom tin is empty. Can we mix some?'), N('Which two colours mix to make orange?')],
        [
          opt('Adom and tsahov (red and yellow)', [FE('Red and yellow… it’s working! Katom!', 'happy')], true),
          opt('Kachol and lavan (blue and white)', [N('Blue and white make a light blue. For orange, mix red and yellow: adom and tsahov.')]),
          opt('Shachor and yarok (black and green)', [N('That makes a very dark green. For orange, mix red and yellow: adom and tsahov.')]),
        ],
        'Learned that red and yellow paint mix to make orange.',
      ),
      ask(
        'literacy',
        'Hebrew colour words',
        8,
        [O('The Wobbler is in the pink tin. What’s pink in Hebrew?')],
        [
          opt('וָרֹד (varod)', [O('Varod! A varod Wobbler. A new species.', 'happy')], true),
          opt('כָּחֹל (kachol)', [N('Kachol is blue. Pink is varod.')]),
          opt('שָׁחֹר (shachor)', [N('Shachor is black. Pink is varod.')]),
        ],
        'Matched the Hebrew word varod to pink.',
      ),
    ],
    [
      { id: 'sunset', label: 'A sunset fence, please.', then: [O('Katom, varod, sagol. Like the sky over the sea at home, just before the stars come out.', 'soft')] },
      { id: 'night', label: 'A night-sky fence.', then: [O('Shachor, kachol, and tsahov for the stars. Obviously. I’m an astronomer.', 'happy')] },
      { id: 'surprise', label: 'Surprise me, Ori.', then: [O('Varod, yarok, katom. Don’t argue. Art doesn’t argue.', 'happy')] },
    ],
  ),
  scene(
    'lh4-s3-done',
    [
      N('The fence has three colours now, in wobbly stripes.'),
      N('Fern stands back and says nothing for a long time.'),
      FE('It’s… loud.'),
      FE('I love it. I’d never have picked it, and that’s why I love it.', 'happy'),
      N('The Wobbler is still varod. It will stay varod until the next rain.'),
      O('Varod suits the Wobbler. Don’t tell it I said so.'),
    ],
    [
      ask(
        'sel',
        'enjoying things we didn’t choose (think question)',
        3,
        [N('Fern loves a fence she’d never have picked herself.'), N('Have you ever liked something you didn’t choose?')],
        [
          opt('Yes, a food I didn’t think I’d like.', [N('That’s a great example. Trying new things can surprise us.')]),
          opt('Yes, a present or a game someone else picked.', [N('That’s a lovely answer. Other people sometimes know what we’ll enjoy.')]),
          opt('Not really. I like choosing.', [N('That’s honest, and fair: some people love choosing. Fern, clearly, does not.')]),
        ],
        'Reflected on times they enjoyed something they did not choose.',
        'CASEL: Self-awareness',
      ),
    ],
  ),
  // ------------------------------------------------ complete
  scene(
    'lh4-complete',
    [
      N('That evening, Ori hands you a twist of paper with a few small seeds inside.'),
      O('Seeds from the rimon. Plant one, and one day you get a rimon tree.'),
      O('Then you’ll always have something adom.'),
      O('Quick-fire, Wobbler-style. It holds up a fruit. You shout the colour.'),
      N('The Wobbler holds up a limon, then a tapuach, then some half-eaten anavim.'),
      O('Ken, ken, ken! You’re the colour champion. I’m the colour champion too.', 'happy'),
      O('Joint champions. I hate sharing. Beseder.'),
      N('The pomegranate seeds go in your seed tin. The Wobbler is still pink.'),
    ],
    [
      notice(
        'science',
        'what a seed needs to grow',
        2,
        [N('A seed holds a tiny plant and a store of food.'), N('Give it soil and water, then light once it sprouts, and it can grow into a tree.')],
        'Learned that a seed contains a tiny plant and needs soil, water and light to grow.',
        '2-LS2-1',
      ),
      ask(
        'literacy',
        'naming colours in Hebrew',
        4,
        [N('The Wobbler holds up the limon. What colour is it, in Hebrew?')],
        [
          opt('צָהֹב (tsahov)', [O('Tsahov! Yellow!', 'happy')], true),
          opt('אָדֹם (adom)', [N('Adom is red. A limon is tsahov, yellow.')]),
          opt('סָגֹל (sagol)', [N('Sagol is purple, like the anavim. A limon is tsahov.')]),
        ],
        'Named the colour of a lemon in Hebrew: tsahov.',
      ),
    ],
  ),
];

// ================================================================== LH5 Savta’s Letters
const LH5_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: the letter
  scene(
    'lh5-s1',
    [
      N('A rainy afternoon. Ori opens the biscuit tin, and it’s full of letters tied in bundles with string.'),
      O('These belong to my סַבְתָּא (savta, “grandma”). She sent them with me so you could see them.'),
      O('Savta and your Hazel wrote to each other for forty years. Hazel used to write every month.'),
      NV('Some of these I carried myself. Over two mountains and past one very rude goose.'),
      O('Hazel learned Hebrew words from Savta, a few at a time, and put them in her letters.'),
      O('This one. Read it with me.'),
      N('“Dear friend, שָׁלוֹם! How is the מִשְׁפָּחָה (mishpacha, ‘family’)? Give my love to סַבָּא (saba, ‘grandpa’).”'),
      N('“Is the כֶּלֶב (kelev, ‘dog’) still stealing socks? Does the חָתוּל (chatul, ‘cat’) still sit on your letters?”'),
      O('Still steals socks. A different kelev. Same socks.', 'happy'),
      O('And the chatul sat on my suitcase while I packed.'),
      N('In the margin there’s a game of noughts and crosses, in two colours of ink.'),
      O('Wait. They played noughts and crosses in the margins? By post? For forty years?', 'shock'),
      O('And Savta is LOSING this one. Savta! Concentrate!', 'angry'),
    ],
    [
      notice(
        'social-studies',
        'how letters carry the past',
        3,
        [NV('When Hazel and Savta started writing, there were no video calls. A letter could take a week or more to arrive.'), N('Letters keep the past safe. Years later, you can still read exactly what someone wrote.')],
        'Learned how people kept in touch by letter before video calls, and how letters keep the past.',
        'D2.His.2.K-2',
      ),
      act(
        'literacy',
        'reading a letter with Hebrew words in it',
        7,
        'edu:read:he:letter',
        [N('Read the letter aloud. When you reach a Hebrew word, tap it to hear it, then say it yourself.'), N('Say them: mishpacha (meesh-pah-KHAH), kelev (KEH-lev), chatul (kha-TOOL).')],
        'Read a letter aloud, saying the Hebrew words for family, grandpa, dog and cat.',
      ),
    ],
  ),
  scene(
    'lh5-s1-done',
    [
      O('You read it! Mishpacha, saba, kelev, chatul.', 'happy'),
      O('And savta, obviously. Savta is the star of the tin.'),
      O('Every letter has a game in the margin. I’m keeping score.'),
      O('Savta is behind. I am very upset about it.'),
      N('The Wobbler climbs onto the letter and sits on it, exactly like a chatul.'),
      O('Off, chatul. I mean, Wobbler.'),
    ],
    [
      ask(
        'maths',
        'months in a year, and in two years',
        2,
        [N('Hazel used to write one letter every month.'), N('How many letters is that in two years?')],
        [
          opt('12', [N('That’s one year: 12 months. Two years is 12 + 12 = 24.')]),
          opt('24', [O('Twenty-four! And that’s just two years. The tin is going to need a bigger tin.', 'happy')], true),
          opt('14', [N('Count the months: 12 in one year, 12 in the next. 12 + 12 = 24.')]),
        ],
        'Worked out that one letter a month for two years is 24 letters.',
        '3.OA.A.1',
      ),
    ],
  ),
  // ------------------------------------------------ step 2: the family tree
  scene(
    'lh5-s2',
    [
      N('Ori unrolls a long sheet of paper and draws a very good tree. He looks annoyed that you noticed.'),
      O('A family tree. My mishpacha. Savta and Saba at the top.'),
      O('Then אִמָּא (ima), mum. And אַבָּא (aba), dad. Easy to say. Hard to argue with.'),
      O('I’ve got an אָחוֹת (achot), a sister. Older. Bossy.'),
      O('And an אָח (ach), a brother. Younger. Borrows my football without asking.'),
      O('A friend who’s a boy is a חָבֵר (chaver). A friend who’s a girl is a חֲבֵרָה (chavera).'),
      O('Now draw yours. Use the Hebrew words. Who goes on your tree?'),
      NV('Do I go on it? I’m not mishpacha. I’m the one who carries the letters.', 'think'),
    ],
    [
      notice(
        'literacy',
        'boy and girl forms: chaver and chavera',
        5,
        [O('Hear that? Chaver, chavera. The ending changes for a boy or a girl.'), O('It’s like ma shlomkha and ma shlomekh. Hebrew likes to know who it’s talking to, and who it’s talking about.')],
        'Learned that some Hebrew words, like friend, have a boy form (chaver) and a girl form (chavera).',
      ),
      act(
        'art',
        'drawing and labelling a family tree',
        6,
        'edu:draw:he:family-tree',
        [N('Draw your own family tree. Label each person with a Hebrew word: ima, aba, ach, achot, chaver or chavera.'), N('Families come in all shapes. Put on whoever matters to you.')],
        'Drew a family tree and labelled it with Hebrew family words.',
      ),
    ],
    [
      { id: 'nova-chavera', label: 'Nova goes on as a chavera.', then: [NV('A chavera. I’ll take that. I’ll take that very happily.', 'happy'), O('Chavera Nova! Big branch. Near the top.')] },
      { id: 'ori-chaver', label: 'Ori goes on as a chaver.', then: [O('Me? On your tree?', 'shock'), O('…Chaver. Ken. Toda. I’m putting you on mine too. Don’t make it weird.', 'soft')] },
      { id: 'nubbins', label: 'The Nubbins get their own branch.', then: [O('A Nubbin branch! The Wobbler at the very top. Obviously. It would never forgive us.', 'happy')] },
    ],
  ),
  scene(
    'lh5-s2-done',
    [
      N('Two trees sit side by side: Ori’s mishpacha and yours.'),
      N('There are Hebrew words on every branch.'),
      O('Ima, aba, ach, achot, chaver, chavera. All of them!', 'happy'),
      O('My achot will be furious that you learned them so fast. Good.'),
      N('The Wobbler has drawn itself on both trees. It is a circle with arms.'),
      O('A circle with arms. Honestly, a good likeness.'),
    ],
    [
      ask(
        'sel',
        'friends who feel like family (think question)',
        3,
        [N('Nova isn’t Ori’s mishpacha, but she carried his family’s letters for years.'), N('Can a friend be like family?')],
        [
          opt('Yes, if they’re always there for you.', [N('That’s a warm answer. Lots of people have friends who feel like family.')]),
          opt('No. Family is family and friends are friends.', [N('That’s a fair answer. They can be different kinds of love, and both matter.')]),
          opt('Maybe. It depends on the friend.', [N('That’s a thoughtful answer. Every friendship is different.')]),
        ],
        'Thought about whether friends can be like family.',
        'CASEL: Relationship skills',
      ),
    ],
  ),
  // ------------------------------------------------ step 3: feelings
  scene(
    'lh5-s3',
    [
      N('Late afternoon, and the rain has stopped. The Nubbins are all over the garden.'),
      O('Feelings. In Hebrew, a feeling word changes for a boy or a girl.'),
      O('Nubbins can be either, so I pick for each one.'),
      O('Happy: שָׂמֵחַ (sameach) for a boy, שְׂמֵחָה (smecha) for a girl.'),
      O('Sad: עָצוּב (atsuv) for a boy, עֲצוּבָה (atsuva) for a girl.'),
      O('Tired: עָיֵף (ayef) for a boy, עֲיֵפָה (ayefa) for a girl.'),
      N('The shy one sits alone by the gate, looking at the hill. The sleepy one is asleep in a flowerpot.'),
      N('The Wobbler rolls in the wet grass.'),
      O('I’ve decided the shy one is a girl. The sleepy one’s a boy. The Wobbler is a boy who is also a ball.'),
      O('So. The shy one. How does she feel?'),
    ],
    [
      ask(
        'literacy',
        'spotting the pattern in the girl forms',
        5,
        [O('Spot the pattern. Smecha, atsuva, ayefa. How do these girl forms all end?')],
        [
          opt('With an “a” sound', [O('Ken! All three end in “a”. So does chavera.', 'happy')], true),
          opt('With a “v” sound', [N('Look again: smecha, atsuva, ayefa. They all end in “a”.')]),
          opt('They don’t share an ending', [N('They do! Smecha, atsuva, ayefa: all three end in “a”.')]),
        ],
        'Noticed that the girl forms smecha, atsuva and ayefa all end in “a”.',
      ),
      ask(
        'sel',
        'what helps someone who is sad or alone',
        7,
        [N('The shy Nubbin is alone, looking at the hill. What might help her?')],
        [
          opt('Sit near her quietly and wait.', [N('That’s often just right. Sitting with someone shows you care, without making them talk.')], true),
          opt('Shout “shalom!” to cheer her up.', [N('Ori would love that, but a quiet Nubbin might jump. Sitting near her quietly is gentler.')]),
          opt('Leave her completely alone.', [N('Some quiet time can help. But being nearby, without fussing, lets her know she isn’t alone.')]),
        ],
        'Thought about how to comfort someone who seems sad or lonely.',
        'CASEL: Social awareness',
      ),
    ],
    [
      {
        id: 'atsuva',
        label: 'She’s atsuva. Sad.',
        then: [O('Atsuva. Ken. Maybe she misses someone. Let’s go and sit with her.', 'soft'), N('You sit down next to her and wait. After a while, she leans against your arm.')],
      },
      { id: 'ayefa', label: 'She’s ayefa. Tired.', then: [O('Ayefa. Could be. It’s been a long day of waving. Waving is hard work.', 'think')] },
      { id: 'smecha', label: 'She’s smecha. Just quiet.', then: [O('Smecha and quiet. That’s allowed. Some happy is the quiet kind.', 'soft')] },
    ],
  ),
  scene(
    'lh5-s3-done',
    [
      O('The sleepy one is ayef. Obviously.'),
      O('The Wobbler is sameach. Very, very sameach.', 'happy'),
      O('And me? Ani… a bit atsuv. I miss Savta.', 'soft'),
      O('And I’m sameach too, because I’m here. Both at once.'),
      O('Is that allowed?'),
      N('The Wobbler rolls over and leans against his foot. It seems to think that’s allowed.'),
    ],
    [
      notice(
        'sel',
        'feeling two feelings at once',
        4,
        [N('It is allowed. People often feel two feelings at the same time.'), N('Missing home and enjoying somewhere new can sit side by side. Naming both feelings helps.')],
        'Learned that it is normal to feel two feelings at once, and that naming them helps.',
        'CASEL: Self-awareness',
      ),
    ],
  ),
  // ------------------------------------------------ complete
  scene(
    'lh5-complete',
    [
      N('Ori lifts a small wooden box out of the bottom of the tin. It has a brass latch and a painted lid.'),
      O('Savta sent this for you. A letter box. For when you write to me.'),
      O('You will write to me. That wasn’t a question.'),
      O('Quick-fire, from the Wobbler. It points, you say the word.'),
      N('The Wobbler points at Ori, then at Nova, then at the tin of letters.'),
      N('Last of all, it points at itself and does a big, wobbly smile.'),
      O('Sameach! It’s sameach! It learned a feeling!', 'happy'),
      O('Oh, and I checked the very last letter. Savta won that game of noughts and crosses. I am SO relieved.', 'happy'),
      N('Savta’s letter box is yours, and so is a “sameach” smile for any Nubbin.'),
    ],
    [
      ask(
        'literacy',
        'choosing the right family or friend word',
        4,
        [N('The Wobbler points at Ori: a boy, and your friend. Which word?')],
        [
          opt('חָבֵר (chaver)', [O('Chaver! That’s me.', 'happy')], true),
          opt('חֲבֵרָה (chavera)', [N('Chavera is for a friend who’s a girl, like Nova. Ori is a chaver.')]),
          opt('אָח (ach)', [N('Ach means brother, and Ori isn’t your brother (though he might argue). He’s a chaver.')]),
        ],
        'Chose chaver (a friend who is a boy) over chavera and ach.',
      ),
      ask(
        'maths',
        'rows of equal size',
        7,
        [N('A noughts-and-crosses grid has 3 rows of 3 squares. How many squares is that?')],
        [
          opt('6', [N('That’s two rows. Three rows of 3 is 3 + 3 + 3 = 9.')]),
          opt('9', [O('Nine! Forty years of nine little squares. That’s a lot of noughts.', 'happy')], true),
          opt('12', [N('Count the rows: 3, 6, 9. Nine squares.')]),
        ],
        'Worked out that 3 rows of 3 make 9.',
        '3.OA.A.1',
      ),
    ],
  ),
];

// ================================================================== LH6 The New Year of the Trees
const LH6_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: Tu BiShvat
  scene(
    'lh6-s1',
    [
      N('It’s Ori’s last week. He’s under the old apple tree counting its branches, and stops when you sit down.'),
      O('Want to hear about my favourite day? Not my birthday. My second favourite.'),
      O('ט״ו בִּשְׁבָט (Tu BiShvat). “The New Year of the Trees.” Trees get a birthday!'),
      O('It’s on the fifteenth of a Hebrew month called Shevat. Usually in January or February.'),
      O('People plant trees. And they eat fruit, especially dates, figs, pomegranates, olives and grapes.'),
      O('Tamar, te’ena, rimon, anavim. You know nearly all of them already!'),
      O('A tree is an עֵץ (ets). Short word, big thing.'),
      O('In Israel, the שָׁקֵד (shaked) trees often blossom around then. Almond trees.'),
      O('Lavan and pale pink, in the middle of winter.'),
      NV('I saw that once. A whole hillside of shaked in flower. I nearly missed my boat.', 'soft'),
      O('So I want to plant a shaked here before I go. Then every winter, your Grove gets a bit of Tu BiShvat.'),
      N('The Wobbler climbs the apple tree to wish it happy birthday. It waves at the trunk, which doesn’t wave back.'),
    ],
    [
      notice(
        'social-studies',
        'Tu BiShvat, the New Year of the Trees',
        5,
        [
          N('Tu BiShvat is on the 15th of the Hebrew month of Shevat, usually in January or February.'),
          N('People plant trees and eat fruit, especially dates, figs, pomegranates, olives and grapes.'),
        ],
        'Learned about Tu BiShvat, the New Year of the Trees: when it falls and how people mark it.',
      ),
      ask(
        'social-studies',
        'why people celebrate trees (think question)',
        10,
        [N('Tu BiShvat gives trees a birthday. Why might people want to celebrate trees?')],
        [
          opt('Trees give us fruit, shade and fresh air.', [N('That’s a great answer. Trees do a lot of work for us.')]),
          opt('Planting trees helps the future.', [N('That’s a wise answer. A tree planted today gives fruit and shade for years.')]),
          opt('Birthdays are fun, and trees deserve one!', [N('That’s a fair answer! Ori agrees completely.')]),
        ],
        'Thought about why people celebrate and plant trees.',
      ),
    ],
    [
      { id: 'where-pond', label: 'Plant it by the pond.', then: [O('By the pond. It’ll see itself in the water. Trees like that, probably.', 'happy')] },
      { id: 'where-tent', label: 'Plant it where your tent is.', then: [O('Where my tent is. So when I’m gone, something of mine is still standing there. Ken.', 'soft')] },
      { id: 'where-gate', label: 'Plant it by the gate, under the shalom sign.', then: [O('Shalom and a shaked. Hello, goodbye, and a tree. Perfect.', 'happy')] },
    ],
  ),
  scene(
    'lh6-s1-done',
    [
      O('Tu BiShvat, ets, shaked. You’ve got the whole festival in three words.', 'happy'),
      O('Well. Plus fruit. There’s always fruit.'),
      N('The Wobbler comes down from the apple tree, carefully, backwards. Old habits.'),
      O('We need a spade. And water. And everyone.'),
      O('Let’s ask Fern. She’s got spades. She’s got everything, apparently, except decisions.'),
      NV('I’ll fetch the sapling.'),
    ],
    [
      ask(
        'literacy',
        'Hebrew nature words',
        4,
        [O('Fern will ask what the spade is for. We’re planting an עֵץ (ets). So what’s an ets?')],
        [
          opt('Tree', [O('Ets! Tree. Short word, big thing.', 'happy')], true),
          opt('Almond', [N('Almond is shaked. Ets means tree.')]),
          opt('Birthday', [N('Close in spirit! But ets just means tree.')]),
        ],
        'Remembered that ets means tree.',
        'L.3.4',
      ),
    ],
  ),
  // ------------------------------------------------ step 2: planting
  scene(
    'lh6-s2',
    [
      N('Everyone comes: Nova with the sapling, Fern with a spade, Clover with a watering can, and Byte with a tape measure.'),
      O('This is our גַּן (gan), our garden. Every gan needs a new ets sometimes.'),
      O('A tree needs מַיִם (mayim), water. And שֶׁמֶשׁ (shemesh), sun.'),
      O('And somewhere good for its roots.'),
      O('And גֶּשֶׁם (geshem), rain. Rain is just mayim falling out of the sky for free.'),
      BY('I’ve measured. Five big steps from anything else. Plenty of room for the roots.', 'think'),
      N('Clover dips the watering can in the pond. A small דָּג (dag), a fish, looks up at her, offended.'),
      O('Sorry, dag! We’re only borrowing some mayim. Toda!'),
      O('One day it’ll have a פֶּרַח (perach), a flower. Lots of them.'),
      O('Almond trees flower before their leaves come out.'),
      FE('I’ll look after it. Badly, but with love.', 'happy'),
      N('The Wobbler pats the soil down very carefully, using its whole body.'),
    ],
    [
      ask(
        'science',
        'what a young tree needs',
        4,
        [O('Science question. What does a young tree need to grow?')],
        [
          opt('Water, sunlight and good soil', [O('Ken! Mayim, shemesh, and a good spot for its roots.', 'happy')], true),
          opt('Just water', [N('Water is a big one, but trees also need sunlight to make their food, and soil for their roots.')]),
          opt('Just sunlight', [N('Sunlight matters, but trees also need water, and soil for their roots.')]),
        ],
        'Learned that a young tree needs water, sunlight and soil.',
        '2-LS2-1',
      ),
      act(
        'science',
        'watering a newly planted tree',
        11,
        'edu:water:he:shaked',
        [N('Water the little shaked slowly, so the mayim soaks down to the roots instead of running away.')],
        'Watered a newly planted tree slowly so the water reached its roots.',
        'K-LS1-1',
      ),
    ],
    [
      { id: 'you-water', label: 'I’ll water it first.', then: [O('Go on. Slowly. Mayim in, not mayim everywhere. …Tov.', 'happy')] },
      { id: 'ori-water', label: 'Ori should water it first. It’s his tree.', then: [O('Our tree. But toda.', 'soft')] },
      {
        id: 'wobbler-water',
        label: 'Let the Wobbler do it.',
        then: [N('The Wobbler tips the whole watering can over itself. Some of it reaches the tree.'), O('Geshem! The Wobbler made geshem. Ten out of ten. Well, shesh.', 'happy')],
      },
    ],
  ),
  scene(
    'lh6-s2-done',
    [
      N('A thin little ets stands in the ground, tied to a stake and dripping.'),
      N('It doesn’t look like much yet.'),
      O('Mayim, shemesh, a bit of geshem, and patience. Then perach. Then shaked.'),
      O('That’s how a gan works.'),
      O('Is it blossoming yet?'),
      O('Lo. I’m going to ask every day until I leave.', 'happy'),
    ],
    [
      notice(
        'science',
        'pollination: bees and almond flowers',
        2,
        [N('When the almond tree flowers, bees visit the blossoms and carry pollen from flower to flower.'), N('Pollen is what lets a flower grow into an almond. No visitors, no almonds!')],
        'Learned that bees carry pollen between almond flowers so that almonds can grow.',
        '2-LS2-2',
      ),
    ],
  ),
  // ------------------------------------------------ step 3: the review party
  scene(
    'lh6-s3',
    [
      N('Ori’s last night. Paper lanterns hang along the fence, and Ori stands on an upturned crate.'),
      O('This is a פָּנָס (panas). A lantern, or a torch. Same word.'),
      O('Welcome to the review party! I say it in English, you shout it in Hebrew. Then snacks: tamar and te’ena.'),
      O('Round one, greetings. “Hello!”'),
      N('Every Nubbin in the Grove waves. The Wobbler waves with both arms, wobbles, and stays up.'),
      O('Round two, numbers. Count the lanterns with me: achat, shtayim, shalosh, arba… all the way to eser!'),
      O('Round three, animals. Two last new ones. סוּס (sus) is a horse. אַרְנָב (arnav) is a rabbit.'),
      O('Nubbins! Be a sus! Be an arnav! Now a kelev, a chatul, a tsipor, a parpar, a yanshuf, a dag!'),
      N('The Nubbins gallop, hop, bark, stretch, flap, flutter, hoot and blow bubbles.'),
      N('Then they collapse in a happy heap.'),
      O('Last round. You pick.'),
    ],
    [
      ask(
        'maths',
        'equal groups: two groups of five',
        5,
        [N('Along the fence, Ori has hung the lanterns in two groups of five.'),N('How many lanterns is that? Say it in Hebrew!')],
        [
          opt('עֶשֶׂר (eser), ten', [O('Eser! Two groups of chamesh make eser.', 'happy')], true),
          opt('שֶׁבַע (sheva), seven', [N('Count again: five in each group, two groups. 5 + 5 = 10, eser.')]),
          opt('שָׁלוֹשׁ (shalosh), three', [N('Shalosh is three. Two groups of five make ten: eser.')]),
        ],
        'Worked out that 2 groups of 5 make 10, and said it in Hebrew.',
        '3.OA.A.1',
      ),
      act(
        'literacy',
        'Hebrew animal words',
        9,
        'edu:act:he:animals:8',
        [N('Your turn! Ori calls an animal in Hebrew, and you act it out, the way the Nubbins did.'), O('Kelev! Chatul! Tsipor! Parpar! Yanshuf! Dag! Sus! Arnav!', 'happy')],
        'Acted out eight animals from their Hebrew names.',
      ),
    ],
    [
      {
        id: 'colours',
        label: 'Colours!',
        then: [O('Point at something adom! Something yarok! Something shachor, like the night sky! Something varod! …The Wobbler doesn’t count. It’s still a bit varod.', 'happy')],
      },
      { id: 'family', label: 'Family!', then: [O('Who carries the letters? Nova, a chavera! Whose tin is it? Savta’s! Who’s your chaver? Me! Correct!', 'happy')] },
      { id: 'feelings', label: 'Feelings!', then: [O('The sleepy one: ayef! The shy one: smecha, tonight! And me? Sameach. Very sameach.', 'happy')] },
    ],
  ),
  scene(
    'lh6-s3-done',
    [
      O('You did it. Greetings, numbers, colours, fruit, family, feelings, animals and trees.', 'happy'),
      O('That’s my whole world, in Hebrew.'),
      NV('Erev tov, everyone. Panas off soon, and then laila tov.', 'soft'),
      N('The Nubbins wave good night, then hop off to bed like an arnav.'),
      N('The Wobbler waves, falls asleep halfway through, and nobody wakes it.'),
      O('Toda raba. For everything. Even for the Wobbler’s goal.', 'soft'),
    ],
    [
      ask(
        'sel',
        'saying goodbye to a friend (think question)',
        5,
        [N('Ori goes home tomorrow. What’s a good way to say goodbye to a friend?')],
        [
          opt('Tell them what you liked about being friends.', [N('That’s a lovely answer. Kind words are something they can take home.')]),
          opt('Promise to write, like Savta and Hazel did.', [N('That’s a great answer. Letters kept Savta and Hazel friends for forty years.')]),
          opt('Just say shalom. It means goodbye and peace.', [N('That’s a fair answer. Sometimes one good word is enough.')]),
        ],
        'Thought about kind ways to say goodbye to a friend.',
        'CASEL: Relationship skills',
      ),
    ],
  ),
  // ------------------------------------------------ complete
  scene(
    'lh6-complete',
    [
      N('Morning. Ori’s bag leans against the gate under the shalom sign, with his panas tied to the strap.'),
      O('Boker tov. The shemesh is out. Last one.'),
      O('I’m atsuv. And sameach. Both. We did this already. It’s still allowed.', 'soft'),
      O('The chant, one last time, with the new verse. Everybody.'),
      O('“Adom, yarok, the colours bright, kochav, yareach, stars at night,', 'happy'),
      O('ima, aba, savta too, shalom, shalom, and toda to you!”', 'happy'),
      O('You’re an Alef-Bet Keeper now. That’s a real title. I made it up, so it’s real.'),
      O('Shalom. That’s goodbye. And hello, next time. And peace, in between. Lehitra’ot!', 'soft'),
      N('Ori lifts and pushes, and the gate gives first time. He gallops down the lane like a sus, then turns back, grinning.'),
      N('By the pond, the little shaked waits for winter. In late winter it will blossom, lavan and pale pink.'),
    ],
    [
      act(
        'music',
        'rhythm and rhyme: the review chant',
        5,
        'edu:chant:he:review',
        [N('Say the whole chant, both verses, and clap the beat.'), N('Listen for the rhymes: out and shout, glow and go, bright and night, too and you.')],
        'Said both verses of the original Hebrew-word chant, clapping the beat and finding the rhymes.',
        'RL.2.4',
      ),
      ask(
        'literacy',
        'one word, three meanings (think question)',
        7,
        [N('Ori says shalom as he leaves. It can mean hello, goodbye or peace.'), N('Which do you think he means?')],
        [
          opt('Goodbye, because he’s going home.', [N('That’s a fair answer. Right now, it’s a goodbye.')]),
          opt('Hello, because he’ll be back.', [N('That’s a hopeful answer. Ori did say “hello, next time”.')]),
          opt('All three at once.', [N('That’s a thoughtful answer. Maybe that’s why one word does all three jobs.')]),
        ],
        'Thought about how shalom can mean hello, goodbye and peace at the same moment.',
        'L.3.4',
      ),
    ],
  ),
];

// ================================================================== the quests
const COMMON_NOTES =
  'Reader band. Every Hebrew word is tappable and plays its native-speaker clip (HEBREW_COURSE.vocab audio). Render Hebrew in Noto Sans Hebrew with niqqud, and isolate each Hebrew run for bidi (see lang-hebrew.ts notes). Tracing and writing go right to left.';

export const EDU_LANG_HEBREW_READER: EduQuest[] = [
  {
    id: 'reader:lh1',
    of: 'lh1',
    band: 'reader',
    title: 'Shalom, Ori!',
    goals: {
      'lh1-step1': { goal: 'Greet Ori at the gate.', hint: 'Tap Ori at the gate. When he says שָׁלוֹם (shalom), say it back: sha-LOME.' },
      'lh1-step2': {
        goal: 'Teach three Nubbins to wave at שָׁלוֹם (shalom).',
        hint: 'Say shalom and wave next to a Nubbin. When it waves back, say תּוֹדָה (toda): toe-DAH.',
      },
      'lh1-step3': {
        goal: 'Say לַיְלָה טוֹב (laila tov, “good night”) to Fern, Clover and Nova.',
        hint: 'Find each of them before they go indoors and tap to say it: LIE-la TOVE.',
      },
    },
    scenes: LH1_SCENES,
    glossary: [
      gloss('שָׁלוֹם (shalom)', 'Hello, goodbye and peace, all in one word (say it: sha-LOME).', 'lh1-s1'),
      gloss('אֲנִי (ani)', 'The Hebrew word for “I” (say it: ah-NEE).', 'lh1-s1'),
      gloss('קוֹרְאִים לִי… (korim li…)', 'How you say “my name is…”; it means “they call me” (say it: kor-EEM lee).', 'lh1-s1'),
      gloss('מָה שְׁלוֹמְךָ? (ma shlomkha?)', '“How are you?” when you ask a boy or man (say it: mah shlom-KHA).', 'lh1-s1'),
      gloss('מָה שְׁלוֹמֵךְ? (ma shlomekh?)', '“How are you?” when you ask a girl or woman (say it: mah shlo-MEKH).', 'lh1-s1'),
      gloss('בְּסֵדֶר (beseder)', 'OK, fine (say it: beh-SEH-der).', 'lh1-s1'),
      gloss('תּוֹדָה (toda)', 'Thank you (say it: toe-DAH).', 'lh1-s2'),
      gloss('בְּבַקָּשָׁה (bevakasha)', 'Please, and also “you’re welcome” (say it: beh-vah-kah-SHAH).', 'lh1-s2'),
      gloss('טוֹב (tov)', 'Good (say it: TOVE).', 'lh1-s2'),
      gloss('כֵּן (ken)', 'Yes (say it: KEN).', 'lh1-s2'),
      gloss('לֹא (lo)', 'No (say it: LOW).', 'lh1-s2'),
      gloss('בֹּקֶר טוֹב (boker tov)', 'Good morning (say it: BO-ker TOVE).', 'lh1-s3'),
      gloss('עֶרֶב טוֹב (erev tov)', 'Good evening (say it: EH-rev TOVE).', 'lh1-s3'),
      gloss('לַיְלָה טוֹב (laila tov)', 'Good night (say it: LIE-la TOVE).', 'lh1-s3'),
      gloss('לְהִתְרָאוֹת (lehitra’ot)', 'See you, for when you’ll meet again later (say it: leh-heet-rah-OTE).', 'lh1-s3'),
      gloss('תּוֹדָה רַבָּה (toda raba)', 'Thank you very much: the big thank-you (say it: toe-DAH rah-BAH).', 'lh1-s3-done'),
    ],
    notes: `${COMMON_NOTES} Think questions: lh1-s1 (why shalom means three things), lh1-s3-done (what helps when learning). The player’s gender is never assumed: the lh1-s1 choice picks the form Ori uses.`,
  },
  {
    id: 'reader:lh2',
    of: 'lh2',
    band: 'reader',
    title: 'Right to Left',
    goals: {
      'lh2-step1': {
        goal: 'Find the four letters of שָׁלוֹם (shalom) hidden round the garden, and trace each one.',
        hint: 'Look by the pond, the gate, the orchard and Ori’s tent. Trace them from the right: ש ל ו ם.',
      },
      'lh2-step2': { goal: 'Trace alef (א) and bet (ב), the letters the alef-bet is named after, then gimel, dalet and hey.', hint: 'Start on the right side and move your stick to the left.' },
      'lh2-step3': { goal: 'Write Ori’s name, אוֹרִי, on his tent.', hint: 'Four letters, starting on the right: alef, vav, resh, yod.' },
    },
    scenes: LH2_SCENES,
    glossary: [
      gloss('ש (shin)', 'The letter that says “sh”, with three arms reaching up.', 'lh2-s1'),
      gloss('ל (lamed)', 'The letter that says “l”; the tallest letter of all.', 'lh2-s1'),
      gloss('ו (vav)', 'A stick with a hook that says “v”, and can also stand for “o” or “u”.', 'lh2-s1'),
      gloss('ם (final mem)', 'The shape mem takes at the end of a word, closed like a box; mem says “m”.', 'lh2-s1'),
      gloss('א (alef)', 'The first letter: it is silent and holds a vowel.', 'lh2-s2'),
      gloss('ב (bet)', 'Says “b” with a dot inside, or “v” without it (then it is called vet).', 'lh2-s2'),
      gloss('ג (gimel)', 'The letter that says “g”.', 'lh2-s2'),
      gloss('ד (dalet)', 'The letter that says “d”.', 'lh2-s2'),
      gloss('ה (hey)', 'The letter that says “h”.', 'lh2-s2'),
      gloss('ר (resh)', 'The letter that says “r”, shaped like a bent elbow.', 'lh2-s3'),
      gloss('י (yod)', 'The smallest letter; it says “y”, or can stand for “i”.', 'lh2-s3'),
      gloss('אוֹר (or)', 'Light (say it: ORE).', 'lh2-s3'),
      gloss('אוֹרִי (Ori)', 'Ori’s name, which means “my light”; spelled alef, vav, resh, yod.', 'lh2-s3'),
    ],
    notes: `${COMMON_NOTES} Think questions: lh2-s1-done (why adults leave out vowel points), lh2-s3-done (why names matter). lh2-s1 and lh2-s1-done show ש ל ו ם as separate pebbles, laid out right to left.`,
  },
  {
    id: 'reader:lh3',
    of: 'lh3',
    band: 'reader',
    title: 'Counting Plums',
    goals: {
      'lh3-step1': {
        goal: 'Help Fern count plums in Hebrew, from אַחַת (achat, 1) to עֶשֶׂר (eser, 10).',
        hint: 'Tap each plum as it goes in the basket and say its number. Ori helps with six to ten.',
      },
      'lh3-step2': { goal: 'Play “How Many?”: count Ori’s goals in Hebrew.', hint: 'After each goal, tap the right Hebrew number. A wrong tap just gets a “lo” and another try.' },
      'lh3-step3': { goal: 'Count ten stars with Ori on the western hill.', hint: 'Go up the hill after dark. Tap a star and say its number in Hebrew.' },
    },
    scenes: LH3_SCENES,
    glossary: [
      gloss('אַחַת (achat)', 'One, 1 (say it: ah-KHAT).', 'lh3-s1'),
      gloss('שְׁתַּיִם (shtayim)', 'Two, 2 (say it: SHTAI-yim).', 'lh3-s1'),
      gloss('שָׁלוֹשׁ (shalosh)', 'Three, 3 (say it: sha-LOSH).', 'lh3-s1'),
      gloss('אַרְבַּע (arba)', 'Four, 4 (say it: AR-bah).', 'lh3-s1'),
      gloss('חָמֵשׁ (chamesh)', 'Five, 5, with the throaty “ch” (say it: kha-MESH).', 'lh3-s1'),
      gloss('שֵׁשׁ (shesh)', 'Six, 6 (say it: SHESH).', 'lh3-s1'),
      gloss('שֶׁבַע (sheva)', 'Seven, 7 (say it: SHEH-vah).', 'lh3-s1'),
      gloss('שְׁמוֹנֶה (shmone)', 'Eight, 8 (say it: shmo-NEH).', 'lh3-s1'),
      gloss('תֵּשַׁע (tesha)', 'Nine, 9 (say it: TEH-sha).', 'lh3-s1'),
      gloss('עֶשֶׂר (eser)', 'Ten, 10, and Ori’s shirt number (say it: EH-ser).', 'lh3-s1'),
      gloss('כּוֹכָב (kochav)', 'Star (say it: ko-KHAV).', 'lh3-s3'),
      gloss('יָרֵחַ (yareach)', 'Moon (say it: yah-REH-akh).', 'lh3-s3'),
      gloss('יַנְשׁוּף (yanshuf)', 'Owl (say it: yan-SHOOF).', 'lh3-s3'),
    ],
    notes: `${COMMON_NOTES} Think question: lh3-s2 (coping with losing). Numbers are the counting-aloud forms; this band never pairs them with Hebrew nouns.`,
  },
  {
    id: 'reader:lh4',
    of: 'lh4',
    band: 'reader',
    title: 'Colours of the Orchard',
    goals: {
      'lh4-step1': {
        goal: 'Sort Nova’s market fruit by colour, using Hebrew colour words.',
        hint: 'Three baskets: אָדֹם (adom, red), יָרֹק (yarok, green), צָהֹב (tsahov, yellow).',
      },
      'lh4-step2': { goal: 'Fetch “something אָדֹם (adom)” for Clover’s fussy Nubbin.', hint: 'Look in Nova’s crate for something red. Sagol (purple) things won’t do.' },
      'lh4-step3': { goal: 'Paint Fern’s fence in the three colours Ori calls out.', hint: 'Listen for the Hebrew word, then dip your brush in that tin.' },
    },
    scenes: LH4_SCENES,
    glossary: [
      gloss('אָדֹם (adom)', 'Red; the ending changes to describe a feminine word, for example adumah (say it: ah-DOME).', 'lh4-s1'),
      gloss('יָרֹק (yarok)', 'Green (say it: yah-ROKE).', 'lh4-s1'),
      gloss('צָהֹב (tsahov)', 'Yellow (say it: tsa-HOVE).', 'lh4-s1'),
      gloss('תַּפּוּחַ (tapuach)', 'Apple (say it: tah-POO-akh).', 'lh4-s1'),
      gloss('בָּנָנָה (banana)', 'Banana, the same word as in English (say it: bah-NAH-nah).', 'lh4-s1'),
      gloss('לִימוֹן (limon)', 'Lemon (say it: lee-MONE).', 'lh4-s1'),
      gloss('רִמּוֹן (rimon)', 'Pomegranate, a red fruit full of red seeds (say it: ree-MONE).', 'lh4-s2'),
      gloss('עֲנָבִים (anavim)', 'Grapes (say it: ah-nah-VEEM).', 'lh4-s2'),
      gloss('סָגֹל (sagol)', 'Purple (say it: sah-GOLE).', 'lh4-s2'),
      gloss('תְּאֵנָה (te’ena)', 'Fig (say it: teh-eh-NAH).', 'lh4-s2'),
      gloss('תָּמָר (tamar)', 'Date, the sticky brown fruit (say it: tah-MAR).', 'lh4-s2'),
      gloss('צִפּוֹר (tsipor)', 'Bird (say it: tsee-POR).', 'lh4-s2'),
      gloss('כָּחֹל (kachol)', 'Blue (say it: kah-KHOLE).', 'lh4-s3'),
      gloss('לָבָן (lavan)', 'White (say it: lah-VAN).', 'lh4-s3'),
      gloss('שָׁחֹר (shachor)', 'Black (say it: sha-KHOR).', 'lh4-s3'),
      gloss('כָּתֹם (katom)', 'Orange, the colour (say it: kah-TOME).', 'lh4-s3'),
      gloss('וָרֹד (varod)', 'Pink (say it: vah-RODE).', 'lh4-s3'),
      gloss('פַּרְפַּר (parpar)', 'Butterfly (say it: par-PAR).', 'lh4-s3'),
    ],
    notes: `${COMMON_NOTES} Think questions: lh4-s1-done (what a word keeps when it travels), lh4-s3-done (liking what you didn’t choose). The feminine colour ending (adumah) appears only as a note in lh4-s2, in romanisation only.`,
  },
  {
    id: 'reader:lh5',
    of: 'lh5',
    band: 'reader',
    title: 'Savta’s Letters',
    goals: {
      'lh5-step1': { goal: 'Read one of the letters in Savta’s tin with Ori.', hint: 'Sit with Ori at the cottage table and tap the letter. Tap any Hebrew word to hear it.' },
      'lh5-step2': { goal: 'Draw a family tree with Hebrew words.', hint: 'Label each branch: ima, aba, ach, achot, chaver or chavera.' },
      'lh5-step3': { goal: 'Tell Ori how a Nubbin is feeling, in Hebrew.', hint: 'Look at the shy Nubbin by the gate. Ori uses the girl forms for her.' },
    },
    scenes: LH5_SCENES,
    glossary: [
      gloss('סַבְתָּא (savta)', 'Grandma (say it: SAHV-tah).', 'lh5-s1'),
      gloss('מִשְׁפָּחָה (mishpacha)', 'Family (say it: meesh-pah-KHAH).', 'lh5-s1'),
      gloss('סַבָּא (saba)', 'Grandpa (say it: SAH-bah).', 'lh5-s1'),
      gloss('כֶּלֶב (kelev)', 'Dog (say it: KEH-lev).', 'lh5-s1'),
      gloss('חָתוּל (chatul)', 'Cat (say it: kha-TOOL).', 'lh5-s1'),
      gloss('אִמָּא (ima)', 'Mum (say it: EE-mah).', 'lh5-s2'),
      gloss('אַבָּא (aba)', 'Dad (say it: AH-bah).', 'lh5-s2'),
      gloss('אָחוֹת (achot)', 'Sister (say it: ah-KHOTE).', 'lh5-s2'),
      gloss('אָח (ach)', 'Brother (say it: AKH).', 'lh5-s2'),
      gloss('חָבֵר (chaver)', 'A friend who is a boy (say it: khah-VER).', 'lh5-s2'),
      gloss('חֲבֵרָה (chavera)', 'A friend who is a girl (say it: khah-veh-RAH).', 'lh5-s2'),
      gloss('שָׂמֵחַ (sameach)', 'Happy, when a boy is feeling it (say it: sah-MEH-akh).', 'lh5-s3'),
      gloss('שְׂמֵחָה (smecha)', 'Happy, when a girl is feeling it (say it: smeh-KHAH).', 'lh5-s3'),
      gloss('עָצוּב (atsuv)', 'Sad, when a boy is feeling it (say it: ah-TSOOV).', 'lh5-s3'),
      gloss('עֲצוּבָה (atsuva)', 'Sad, when a girl is feeling it (say it: ah-tsoo-VAH).', 'lh5-s3'),
      gloss('עָיֵף (ayef)', 'Tired, when a boy is feeling it (say it: ah-YEF).', 'lh5-s3'),
      gloss('עֲיֵפָה (ayefa)', 'Tired, when a girl is feeling it (say it: ah-yeh-FAH).', 'lh5-s3'),
    ],
    notes: `${COMMON_NOTES} Think question: lh5-s2-done (can a friend be like family?). Hazel appears only in the past tense, as someone who used to write letters. Ori chooses each Nubbin’s form; the child is never asked to choose a gender for themselves.`,
  },
  {
    id: 'reader:lh6',
    of: 'lh6',
    band: 'reader',
    title: 'The New Year of the Trees',
    goals: {
      'lh6-step1': { goal: 'Ask Ori about ט״ו בִּשְׁבָט (Tu BiShvat), the New Year of the Trees.', hint: 'Ori is under the old apple tree. Tap him to talk.' },
      'lh6-step2': { goal: 'Plant an almond tree, a שָׁקֵד (shaked), with everyone.', hint: 'Dig where you chose, set the little tree in, and water it from the pond.' },
      'lh6-step3': {
        goal: 'The review party: greet, count, colours, family and feelings, all in Hebrew.',
        hint: 'Answer Ori’s rounds by the lanterns. The Nubbins act out every answer.',
      },
    },
    scenes: LH6_SCENES,
    glossary: [
      gloss('ט״ו בִּשְׁבָט (Tu BiShvat)', 'The New Year of the Trees, on the 15th of the Hebrew month of Shevat.', 'lh6-s1'),
      gloss('עֵץ (ets)', 'Tree (say it: ETS).', 'lh6-s1'),
      gloss('שָׁקֵד (shaked)', 'Almond, and the almond tree (say it: shah-KED).', 'lh6-s1'),
      gloss('גַּן (gan)', 'Garden (say it: GAHN).', 'lh6-s2'),
      gloss('מַיִם (mayim)', 'Water (say it: MY-yim).', 'lh6-s2'),
      gloss('שֶׁמֶשׁ (shemesh)', 'Sun (say it: SHEH-mesh).', 'lh6-s2'),
      gloss('גֶּשֶׁם (geshem)', 'Rain (say it: GEH-shem).', 'lh6-s2'),
      gloss('דָּג (dag)', 'Fish (say it: DAHG).', 'lh6-s2'),
      gloss('פֶּרַח (perach)', 'Flower (say it: PEH-rakh).', 'lh6-s2'),
      gloss('פָּנָס (panas)', 'A lantern or a torch (say it: pah-NAHS).', 'lh6-s3'),
      gloss('סוּס (sus)', 'Horse (say it: SOOS).', 'lh6-s3'),
      gloss('אַרְנָב (arnav)', 'Rabbit (say it: ar-NAHV).', 'lh6-s3'),
    ],
    notes: `${COMMON_NOTES} Think questions: lh6-s1 (why celebrate trees), lh6-s3-done (saying goodbye), lh6-complete (what shalom means). Tu BiShvat is taught only with the facts in the languages brief.`,
  },
];

export const CHECKS: string[] = [
  'edu:say:he:shalom',
  'edu:wait:shy-nubbin',
  'edu:chant:he:boker-tov',
  'edu:find:he:letters:shalom',
  'edu:trace:he:alef',
  'edu:order:he:alef-bet:5',
  'edu:write:he:ori',
  'edu:count:he:plums:10',
  'edu:count:he:countdown:10',
  'edu:sort:he:fruit:colour',
  'edu:tap:he:colour:adom',
  'edu:read:he:letter',
  'edu:draw:he:family-tree',
  'edu:water:he:shaked',
  'edu:act:he:animals:8',
  'edu:chant:he:review',
];
