/**
 * Language questline (Learning Grove only): Hebrew, “Ori’s Alef-Bet” (LH1–LH6).
 *
 *   LH1 Shalom, Ori!                greetings, thank you, please, yes and no, my name is…
 *   LH2 Right to Left               the shape and direction of the script; 11 letters; writing אוֹרִי
 *   LH3 Counting Plums              counting 1–10; star, moon, owl
 *   LH4 Colours of the Orchard      nine colours, seven fruit; bird, butterfly
 *   LH5 Savta’s Letters             family, dog and cat, three feelings (boy and girl forms)
 *   LH6 The New Year of the Trees   Tu BiShvat, tree, almond, nature words; horse, rabbit; the review party
 *
 * Ori (אוֹרִי, “my light”) is ten. He lives in Israel, loves football and astronomy, and is a
 * terrible loser at board games. He stays with Nova for three weeks and brings a biscuit tin of
 * letters: his savta and Hazel wrote to each other for forty years, and Nova carried some of them.
 * Hazel appears only as someone who wrote letters, always in the past tense.
 *
 * Running gags: the Wobbler (a round Nubbin who waves at “shalom” so hard it falls over, and
 * learns along with the child, one quest at a time); per quest, see each quest’s notes.
 * The chant (original): “Boker tov, the sun is out! / Shalom, shalom, wave and shout! /
 * Erev tov, the lanterns glow, / laila tov, and off we go!” LH6 adds a second verse.
 *
 * Accuracy: every Hebrew word here is from the vetted list in the languages brief, spelled exactly
 * (with niqqud). Anything not on the list stays in English. Grammar notes are limited to the
 * brief’s notes: right to left, no capitals, vowel points, final forms, stress, the masculine
 * colour forms, and the boy/girl forms of “how are you?”, “friend” and the feelings.
 *
 * These quests set only `lh<n>Done`. Choices set no flags. No campaign flags, no campaign secrets.
 * Audience 'all'. All words are original, so no childLines are needed.
 */
import type { Line, Mood } from '../config/story';
import type { LanguageCourse, Quest, ScriptChar, Speaker, VocabItem } from './types';

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

/** Declared on every LH quest. */
const ORI: Speaker = { id: 'ori', name: 'Ori', kind: 'other' };

// ---------------------------------------------------------------- shared notes
const COMMON_NOTES = [
  'Learning Grove only: offer this quest nowhere else. It sets only its own lh<n>Done flag.',
  'Fonts: Noto Sans Hebrew (or similar) for every Hebrew string, with niqqud rendered correctly; test that the dots and lines sit under and inside their letters and do not collide.',
  'Bidi: most lines mix English and Hebrew. Wrap each Hebrew run in an isolate (U+2067 RLI … U+2069 PDI, or <bdi dir="rtl">) so the brackets, commas and question marks after it stay on the correct side. Set every dialogue line’s base direction to LTR explicitly (dir="ltr", never dir="auto"): many lines start with a Hebrew word or letter (“ש is shin…”, “אַחַת (achat, 1)…”, “ט״ו בִּשְׁבָט…”) and would otherwise flip the whole line to right to left. A “?” or “…” that belongs to the Hebrew (מָה שְׁלוֹמְךָ?, קוֹרְאִים לִי…) goes inside the isolate so it lands at the Hebrew’s left end. Lines that are only Hebrew (signs, pebbles, the tent) render right to left.',
  'Audio: every Hebrew word needs a native-speaker recording (VocabItem.audio, he/<slug>), never TTS. Tapping a Hebrew word in any line plays its clip.',
  'Tracing mini-games: Hebrew letters are written right to left, and words start on the right. The tracing guide (src/ui/hebrew-strokes.ts) shows simple numbered block-print strokes, each letter starting on its right side or top.',
  'Nubbins who “learn” a word react to it from then on: wave at shalom (LH1), look up at kochav (LH3), and so on (see HEBREW_COURSE.notes).',
].join(' ');

const notes = (specific: string): string => `${specific} ${COMMON_NOTES}`;

// ================================================================== the quests
export const LANG_HEBREW: Quest[] = [
  // ================================================================ LH1
  {
    id: 'lh1',
    code: 'LH1',
    title: 'Shalom, Ori!',
    source: 'Original: a beginner Hebrew course for the Learning Grove (greetings)',
    audience: 'all',
    trigger: {
      where: 'Learning Grove only',
      when: 'Any morning once the Learning Grove is open: Nova brings Ori to the gate.',
    },
    speakers: [ORI],
    steps: [
      {
        id: 'lh1-step1',
        goal: 'Greet Ori at the gate.',
        hint: 'Walk to the gate and tap Ori. He says שָׁלוֹם (shalom), so say it back.',
        check: 'lang:he:greet:ori',
        scene: {
          id: 'lh1-s1',
          lines: [
            N('The gate rattles. Somebody on the other side is lifting and pushing, and losing.'),
            NV('Lift AND push, Ori. Both at once. It’s a Grove thing.'),
            N('The gate gives. In tumbles a boy in a football shirt, hugging a biscuit tin like it’s a trophy.'),
            O('שָׁלוֹם (shalom, “hello”)! Sorry. I had a fight with your gate. Your gate won.', 'happy'),
            NV('This is Ori. He’s staying with me for three weeks. He’s ten, he lives in Israel, and he has already told me forty star names.'),
            O('Forty-two. You stopped listening at forty.'),
            O('In Hebrew, shalom means hello. It also means goodbye. And peace. It’s a very hard-working word.', 'think'),
            O('אֲנִי (ani, “I”)… קוֹרְאִים לִי… (korim li, “my name is…”) Ori. Ani Ori. That’s me. Now you.'),
            N('Over the wall, a small round wild Nubbin hears “shalom”, waves at Ori with both arms, and falls over.'),
            O('To ask how you are, I say מָה שְׁלוֹמְךָ? (ma shlomkha?) to a boy, or מָה שְׁלוֹמֵךְ? (ma shlomekh?) to a girl.'),
            O('The ending changes. Hebrew likes to know who it’s talking to. Which one should I ask you?'),
          ],
          choices: [
            {
              id: 'shlomkha',
              label: 'Ask me “ma shlomkha?”',
              then: [
                O('Ma shlomkha?'),
                Y('בְּסֵדֶר (beseder, “fine”). I think?'),
                O('Beseder! That means “OK, fine”. Short and strong, like a header into the top corner.', 'happy'),
              ],
            },
            {
              id: 'shlomekh',
              label: 'Ask me “ma shlomekh?”',
              then: [
                O('Ma shlomekh?'),
                Y('בְּסֵדֶר (beseder, “fine”). I think?'),
                O('Beseder! That means “OK, fine”. Short and strong, like a header into the top corner.', 'happy'),
              ],
            },
            {
              id: 'either',
              label: 'Either one. Just say shalom!',
              then: [
                O('Shalom, then! And if anyone asks how you are, say בְּסֵדֶר (beseder). It means “OK, fine”.'),
                Y('Beseder.'),
                O('Perfect. You sound like my uncle. That’s a compliment. Mostly.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'lh1-s1-done',
          lines: [
            O('You said it! A proper shalom. Ten out of ten. Well, nine. The gate gets a point for defending.', 'happy'),
            N('The round Nubbin waves at Ori again, topples, and lies there looking pleased with itself.'),
            O('I’m calling that one the Wobbler. It’s my favourite already. Don’t tell the others.'),
          ],
        },
      },
      {
        id: 'lh1-step2',
        goal: 'Teach three Nubbins to wave when they hear שָׁלוֹם (shalom).',
        hint: 'Stand by a Nubbin, say shalom and wave. When it waves back, say תּוֹדָה (toda, “thank you”).',
        check: 'lang:he:teach:nubbins:shalom:3',
        scene: {
          id: 'lh1-s2',
          lines: [
            O('Right. Nubbin school. I’m the coach. You’re the assistant coach. The Wobbler is team captain, obviously.'),
            N('Ori sits cross-legged on the grass, facing three Nubbins: the Wobbler, a shy one behind a dandelion, and one who is mostly asleep.'),
            O('Coaching rule one: always say thank you. In Hebrew, that’s תּוֹדָה (toda, “thank you”).'),
            O('Rule two: be polite. בְּבַקָּשָׁה (bevakasha) means “please”. It also means “you’re welcome”. Hebrew words like to keep busy.'),
            O('When one of them waves at shalom, we cheer טוֹב (tov, “good”)! Big tov. Stadium tov.'),
            N('The shy Nubbin peeks out from behind the dandelion, looks at Ori, and ducks back.'),
            O('Will she wave? כֵּן (ken, “yes”)? Or לֹא (lo, “no”)?'),
            O('Lo. Not yet. That’s fine. A coach is patient. I’m not patient. You be the patient one.'),
            N('The Wobbler waves at nobody in particular, falls over, and gets up to wave again.'),
          ],
          choices: [
            {
              id: 'sit-wait',
              label: 'Sit down near the shy one and wait.',
              then: [
                N('You sit and wait. After a long time, one tiny paw lifts, just a little.'),
                O('Ken! KEN! Toda! (That was me whispering. I’m bad at whispering.)', 'happy'),
              ],
            },
            {
              id: 'say-softly',
              label: 'Whisper “shalom” very softly.',
              then: [
                N('You whisper it, and the shy Nubbin tilts her head as if the word tickled. One paw lifts, just a little.'),
                O('Tov! Very tov! Quiet shalom works on quiet Nubbins. Write that down, coach.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'lh1-s2-done',
          lines: [
            N('The shy one waves, and the sleepy one waves in its sleep. The Wobbler waves, falls over, and waves from the ground.'),
            O('Three Nubbins! Toda, toda, toda!', 'happy'),
            Y('Bevakasha.'),
            O('Bevakasha! You used the “you’re welcome” one. Assistant coach is now head coach. I’m demoted. Beseder.'),
          ],
        },
      },
      {
        id: 'lh1-step3',
        goal: 'Say לַיְלָה טוֹב (laila tov, “good night”) to everyone.',
        hint: 'Find Fern, Clover and Nova before they go indoors, and tap each one to say laila tov.',
        check: 'lang:he:say:laila-tov',
        scene: {
          id: 'lh1-s3',
          lines: [
            N('The sun slides behind the western hill and the lanterns blink on. Ori yawns, and pretends he didn’t.'),
            O('Hebrew has a “good” for each part of the day. Morning is בֹּקֶר טוֹב (boker tov, “good morning”).'),
            O('Evening is עֶרֶב טוֹב (erev tov, “good evening”). Like now. Erev tov, lanterns!'),
            O('And at bedtime, לַיְלָה טוֹב (laila tov, “good night”). Tov, tov, tov. Everything’s good. Hebrew is very optimistic.'),
            NV('Go round and say laila tov to everyone before they go in. Fern’s still in the orchard.'),
            O('If you won’t see someone till tomorrow, say לְהִתְרָאוֹת (lehitra’ot, “see you”).'),
            O('Or just shalom. Shalom works for goodbye too. Shalom does everything. Shalom should have its own football team.'),
            N('At the word “shalom”, the Wobbler waves goodbye, falls over, and goes to sleep where it landed.'),
          ],
        },
        done: {
          id: 'lh1-s3-done',
          lines: [
            FE('Laila tov to you too! I think. Did I say it right? I’ve been practising on the plum tree.'),
            CL('Laila tov! I said it to my Nubbin as well. It went straight to sleep.'),
            O('Then it works.'),
            O('Perfect. Fern, תּוֹדָה רַבָּה (toda raba, “thank you very much”). That’s the big thank-you. For people who try.'),
            N('All three Nubbins are asleep in a heap by Ori’s tent, like dropped socks.'),
            O('Lehitra’ot, everybody. Laila tov. Toda raba for today. Tomorrow: letters.'),
          ],
        },
      },
    ],
    complete: {
      id: 'lh1-complete',
      lines: [
        N('Morning. Somebody has hung a sign on the gate that says שָׁלוֹם in neat, slightly wonky paint.'),
        O('Boker tov! I made you a sign. Shalom for people coming in, shalom for people going out. Very efficient.', 'happy'),
        O('Quick-fire round. I say it, you say it back. Boker tov! Toda! Bevakasha! Ken! Lo! Laila tov!'),
        O('And I made up a chant. Don’t laugh. Actually, you can laugh. Laughing is tov.'),
        O('“Boker tov, the sun is out! Shalom, shalom, wave and shout! Erev tov, the lanterns glow, laila tov, and off we go!”'),
        N('The Wobbler hears “shalom”, waves with both arms, wobbles hard and, for the first time, stays upright.'),
        O('It stayed up! Historic! Lehitra’ot, gravity!', 'shock'),
        N('The shalom sign stays on the gate, and you can wave “shalom” to any Nubbin who has learned it.'),
      ],
    },
    rewards: [
      {
        id: 'lh1-shalom-sign',
        kind: 'decor',
        label: 'שָׁלוֹם welcome sign',
        description: 'A hand-painted sign for the gate that says שָׁלוֹם (shalom): hello for people coming in, goodbye for people going out. Nubbins who know the word wave at it.',
      },
      {
        id: 'lh1-shalom-wave',
        kind: 'cosmetic',
        label: '“Shalom” wave emote',
        description: 'A big two-handed wave. Nubbins who learned “shalom” wave back.',
      },
    ],
    sets: { lh1Done: true },
    notes: notes(
      'New words, at most six per step. Step 1: shalom, ani, korim li…, ma shlomkha?, ma shlomekh?, beseder. Step 2: toda, bevakasha, tov, ken, lo. Step 3: boker tov, erev tov, laila tov, lehitra’ot, toda raba. ' +
        'The player’s gender is never assumed: in lh1-s1 the player picks which “how are you?” Ori uses; both choices play the same. ' +
        'The Wobbler: the roundest of the player’s Nubbins near the gate when LH1 starts (or a visiting wild Nubbin if there are none). Keep it as the Wobbler for the whole questline in local quest state, not a campaign flag. Its running gag is waving so hard at shalom that it falls over; it finally stays upright in lh1-complete. ' +
        'Step 2 needs three Nubbins: the Wobbler, a shy one and a sleepy one; use the player’s own if they have three, otherwise visiting wild ones. ' +
        'Step 3: the check counts “laila tov” said to Fern, Clover and Nova (tap each). ' +
        'The chant in lh1-complete is original (no existing song); it is spoken in rhythm, not sung to a known tune.',
    ),
  },

  // ================================================================ LH2
  {
    id: 'lh2',
    code: 'LH2',
    title: 'Right to Left',
    source: 'Original: a beginner Hebrew course for the Learning Grove (the alef-bet)',
    audience: 'all',
    trigger: { where: 'Learning Grove only', when: 'The morning after LH1 is complete.' },
    requires: ['LH1'],
    speakers: [ORI],
    steps: [
      {
        id: 'lh2-step1',
        goal: 'Find the four letters of שָׁלוֹם (shalom) hidden round the garden, and trace each one.',
        hint: 'Ori painted them on pebbles: look by the pond, the gate, the orchard and his tent. Trace them starting from the right.',
        check: 'lang:he:find:letters:shalom',
        scene: {
          id: 'lh2-s1',
          lines: [
            O('Today: the alef-bet. That’s our alphabet. It’s named after its first two letters, alef and bet.'),
            O('Rule one: Hebrew goes right to left. Start on the right side of the page and travel left. Like a winger who only uses his left foot.'),
            N('The Wobbler hears “right to left”, thinks about it very hard, and starts walking backwards.'),
            O('I hid the letters of שָׁלוֹם round the garden, painted on pebbles. Four letters.'),
            O('ש is shin. It says “sh”. Three arms reaching up, like a goalie celebrating a save.'),
            O('ל is lamed. It says “l”. It’s the tall one: it sticks up above all the others, like it’s trying to see over a fence.'),
            O('ו is vav. A stick with a little hook. Here it makes an “o”. Vav can do v, o or u. Very flexible. A real midfielder.'),
            O('And mem, which says “m”. At the end of a word it changes shape and closes up like a box: ם. Five letters do that.'),
            O('Find shin, lamed, vav and final mem. Then line them up from the RIGHT.'),
          ],
        },
        done: {
          id: 'lh2-s1-done',
          lines: [
            N('Four pebbles sit on the path, lined up from right to left: ש ל ו ם.'),
            O('Shin, lamed, vav, mem. Shalom! The little dots and lines in שָׁלוֹם are the vowels. Children’s books use them. Grown-ups mostly leave them out.', 'happy'),
            O('Without the dots it’s still shalom. You just have to know. Like a goalkeeper just knows.'),
            N('The Wobbler arrives, backwards, and sits proudly on the vav.'),
          ],
        },
      },
      {
        id: 'lh2-step2',
        goal: 'Trace alef (א) and bet (ב), the letters the alef-bet is named after, then gimel, dalet and hey.',
        hint: 'Start each letter from the right side. Ori draws the first one; you go over it with a stick.',
        check: 'lang:he:trace:alef-bet',
        scene: {
          id: 'lh2-s2',
          lines: [
            N('By the pond, the mud has dried into a smooth patch of sand. Ori flattens it with the side of his trainer.'),
            O('Now the first letters. The ones the alef-bet is named after.'),
            O('א is alef. It’s silent. It just holds a vowel, like a cup holds tea. A letter that says nothing. I could never.'),
            O('ב is bet. With a dot inside it says “b”. Without the dot it says “v”, and we call it vet. One letter, two sounds.'),
            O('Then ג gimel, “g”. ד dalet, “d”. ה hey, “h”. That’s five letters. A whole five-a-side team.'),
            O('Hebrew has no capital letters, by the way. No big versions, no small versions. Very fair.'),
            NV('I tried learning these once, on a long boat trip. I got as far as gimel. The boat got as far as seasick.'),
            N('The Wobbler, still walking backwards, reverses into the pond with a soft plop. It climbs out, delighted.'),
            O('Your stick starts on the right and travels left. Which one first?'),
          ],
          choices: [
            {
              id: 'alef-first',
              label: 'Alef first. The silent one.',
              then: [O('Alef first. Respect. The quiet ones go first in this game.', 'happy')],
            },
            {
              id: 'bet-first',
              label: 'Bet first. The one that makes two sounds.',
              then: [O('Bet first! Bold. Rule-breaker. I like it. Alef straight after, though.', 'happy')],
            },
          ],
        },
        done: {
          id: 'lh2-s2-done',
          lines: [
            N('In the sand: א ב ג ד ה, a bit wobbly and very proud.'),
            O('Alef and bet! One letter speaks, one letter stays quiet. And if bet loses its dot, it turns into vet.', 'happy'),
            O('Next is the most important word in the whole alef-bet. My name.'),
          ],
        },
      },
      {
        id: 'lh2-step3',
        goal: 'Write Ori’s name, אוֹרִי, on his tent.',
        hint: 'Four letters, from the right: alef, vav, resh, yod. Tap the paintbrush on the tent to start.',
        check: 'lang:he:write:ori',
        scene: {
          id: 'lh2-s3',
          lines: [
            N('Ori’s tent stands by the cottage. It is green, slightly crooked, and has a football scarf tied to the pole.'),
            O('My name in Hebrew is אוֹרִי. Ori. Four letters: alef, vav, resh, yod.'),
            O('You know alef. You know vav, the stick with the hook. New ones: ר is resh, “r”. It looks like a bent elbow.'),
            O('And י is yod. It says “y”, or sometimes “i”. Yod is the smallest letter. Tiny, but you can’t spell me without it.'),
            O('Here’s the good bit. אוֹר (or) means “light”. Add a yod and you get Ori: “my light”.'),
            O('My parents named me “my light”. No pressure. I’ve only been going out to look at stars every night since I was four.'),
            NV('His savta told me that once, in a letter I carried for her. A long time ago now.', 'soft'),
            N('The Wobbler watches with enormous attention. It is facing the wrong way.'),
            O('Korim li Ori, and now you can write it too. Paint it on the tent. Start on the right. Alef first.'),
          ],
          choices: [
            {
              id: 'big',
              label: 'Paint it big, across the door.',
              then: [O('Big! You’ll be able to see it from the hill. Maybe from space.', 'happy')],
            },
            {
              id: 'small',
              label: 'Paint it small and neat, by the zip.',
              then: [O('Small and neat. Like a signature. A famous person’s signature.', 'happy')],
            },
            {
              id: 'star',
              label: 'Paint it, then add a star next to it.',
              then: [O('A star! You get me. A light next to “my light”. That’s poetry, that is.', 'happy')],
            },
          ],
        },
        done: {
          id: 'lh2-s3-done',
          lines: [
            N('On the tent, in fresh paint: אוֹרִי.'),
            O('That’s me. Alef, vav, resh, yod. You wrote my name in Hebrew. Nobody here has done that before.', 'happy'),
            N('The Wobbler finally turns round, sees the name the right way up, and waves at it.'),
          ],
        },
      },
    ],
    complete: {
      id: 'lh2-complete',
      lines: [
        N('At dusk, Ori sets flat stones along the path to his tent. Each one has a letter painted on it.'),
        O('Stepping stones! Alef, bet, gimel, dalet, hey. Then the shalom ones. Then the ones from my name, אוֹרִי.'),
        O('Quick-fire. I point, you answer. The tallest letter? Lamed! The smallest? Yod! The one that holds a vowel and says nothing? Alef!'),
        O('Hebrew has twenty-two letters. You’ve met eleven. That’s half. It’s half-time!', 'happy'),
        N('You step from stone to stone, right to left. The Wobbler follows you backwards and doesn’t fall in the pond once.'),
        O('The alef-bet stones are yours. Walk them every day and the letters walk into your head.'),
      ],
    },
    rewards: [
      {
        id: 'lh2-alef-bet-stones',
        kind: 'decor',
        label: 'Alef-bet stepping stones',
        description: 'Flat path stones painted with the eleven letters from this quest. Step on one to hear its name; they read right to left.',
      },
    ],
    sets: { lh2Done: true },
    notes: notes(
      'Letters taught: shin, lamed, vav, mem and final mem (step 1); alef, bet/vet, gimel, dalet, hey (step 2); resh and yod (step 3), plus the word אוֹר (or, “light”). That makes 11 of the 22. ' +
        'Running gag: the Wobbler walks backwards for the whole quest because it heard “right to left”. ' +
        'Step 1: four pebbles hidden by the pond, gate, orchard and tent, each with one unpointed letter (ש, ל, ו, ם); the player drags them into a row that reads right to left. The check passes only when the order is right to left. ' +
        'Step 2: a sand-tracing mini-game for א then ב (either order, per the choice). The bet guide shows the dot inside (b); a toggle shows it without (vet). ' +
        'Step 3: the player paints אוֹרִי on the tent, letter by letter from the right. Show the letters unpointed for tracing, then the full pointed form appears when done. The choice only changes the paint layout (big, small, with a star). ' +
        'lh2-s1-done shows ש ל ו ם as separate pebbles: spaced letters, so render each one as its own RTL glyph in a right-to-left row.',
    ),
  },

  // ================================================================ LH3
  {
    id: 'lh3',
    code: 'LH3',
    title: 'Counting Plums',
    source: 'Original: a beginner Hebrew course for the Learning Grove (numbers)',
    audience: 'all',
    trigger: { where: 'Learning Grove only', when: 'Any day after LH2 is complete, when Fern’s plums are ripe.' },
    requires: ['LH2'],
    speakers: [ORI],
    steps: [
      {
        id: 'lh3-step1',
        goal: 'Help Fern count plums in Hebrew, from אַחַת (achat, 1) to עֶשֶׂר (eser, 10).',
        hint: 'Tap each plum as it goes in the basket and say its number. Ori teaches one to five; for six to ten, copy him.',
        check: 'lang:he:count:plums:10',
        scene: {
          id: 'lh3-s1',
          lines: [
            N('In Fern’s orchard the plum trees are heavy. Fern is under one with two baskets and the face of someone who has lost count.'),
            FE('Ten plums for each basket, for the market. I’ve counted these four times and got four different numbers.'),
            O('Let me. I count in Hebrew. It’s faster. It isn’t faster. It sounds faster.'),
            O('אַחַת (achat, 1). שְׁתַּיִם (shtayim, 2). שָׁלוֹשׁ (shalosh, 3).'),
            O('אַרְבַּע (arba, 4). חָמֵשׁ (chamesh, 5). Chamesh has the throaty “ch”, like the end of “loch”.'),
            FE('Achat… shtayim… I keep wanting to sneeze it.'),
            O('Sneezy is close! SHTAI-yim. Say it like you mean it.'),
            O('Six to ten, I’ll call them and you copy. Copying counts today. Tomorrow you do it alone.'),
            N('The Wobbler sits under the tree, catching every plum that falls. Mostly with its face.'),
          ],
          choices: [
            {
              id: 'you-count',
              label: 'I’ll count. You check.',
              then: [O('Deal. If you’re wrong, I say lo. If you’re right, I say ken. I expect to say ken a lot.', 'happy')],
            },
            {
              id: 'fern-count',
              label: 'Let Fern count. We’ll cheer.',
              then: [
                FE('No pressure, then.', 'shock'),
                O('Huge pressure. Stadium pressure. Achat!', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'lh3-s1-done',
          lines: [
            FE('Ten! Ten plums. That’s… עֶשֶׂר?', 'happy'),
            O('Eser! Ten. Two baskets of eser makes twenty, but twenty is a different lesson. Don’t get greedy.'),
            N('The Wobbler has a plum balanced on its head. Nobody mentions it.'),
          ],
        },
      },
      {
        id: 'lh3-step2',
        goal: 'Play Ori’s “How Many?” football game: count the goals in Hebrew.',
        hint: 'Watch each shot. After every goal, tap the right Hebrew number. Get it right and you win the ball.',
        check: 'lang:he:minigame:count-goals',
        scene: {
          id: 'lh3-s2',
          lines: [
            N('Ori sets up four jumpers, a goal at each end, and bounces his football on his knee. He says it’s a world record; it isn’t.'),
            O('The game is called “How Many?” I shoot. You count the goals, in Hebrew. Right answer, you get the ball.'),
            O('You need the big numbers now. שֵׁשׁ (shesh, 6). שֶׁבַע (sheva, 7). שְׁמוֹנֶה (shmone, 8).'),
            O('תֵּשַׁע (tesha, 9). And עֶשֶׂר (eser, 10). Ten is the best number. It’s my shirt number.'),
            N('The Wobbler is in goal. It has decided that being in goal means waving at the ball.'),
            O('Warning. I am a very good footballer and a very bad loser. Ask my savta. She hid all our board games.', 'think'),
            O('Ready? Achat, shtayim, shalosh, GO!'),
          ],
          choices: [
            {
              id: 'go-easy',
              label: 'Go easy on me.',
              then: [O('Lo. Never. A coach never goes easy. …Beseder, a bit easy. For the first shot.', 'happy')],
            },
            {
              id: 'bring-it',
              label: 'Bring it on.',
              then: [O('Ken! Now you’re talking like a footballer!', 'happy')],
            },
          ],
        },
        done: {
          id: 'lh3-s2-done',
          lines: [
            N('Final score: Ori ten, the Wobbler one. The Wobbler waved, the ball bounced off its tummy, rolled the whole length of the grass and into Ori’s goal.'),
            O('That’s… that’s one. Achat! It scored ACHAT. Best of three. Best of shesh. Best of sheva. Best of eser!', 'shock'),
            NV('Ori.'),
            O('…Beseder. Toda for the game. Well played, Wobbler. (He means it about halfway.)', 'sad'),
          ],
        },
      },
      {
        id: 'lh3-step3',
        goal: 'Count ten stars with Ori, in Hebrew.',
        hint: 'Go up the western hill after dark. Tap a star to count it; Ori says each number with you.',
        check: 'lang:he:count:stars:10',
        scene: {
          id: 'lh3-s3',
          lines: [
            N('Night. Ori drags you up the western hill with a blanket, a torch and the biscuit tin, which is full of snacks for once.'),
            O('Best sky I’ve ever seen. No city lights. At home I have to squint.'),
            O('A star is כּוֹכָב (kochav). Every one of those is a kochav. Each one is a sun, just really, really far away.'),
            O('And that’s the יָרֵחַ (yareach, “moon”). The yareach isn’t a kochav. It makes no light of its own. The sun lights it up.'),
            N('Something on a branch says “hoo”. Two round eyes blink at you.'),
            O('יַנְשׁוּף (yanshuf)! An owl! Shalom, yanshuf! Sorry for shouting. I’m excited. Owls are night people, like me.', 'happy'),
            O('Count ten stars before the clouds come in. Out loud. In Hebrew. Point at one.'),
            N('The Wobbler lies on its back next to you and waves at the sky.'),
          ],
          choices: [
            {
              id: 'bright',
              label: 'Start with the brightest star.',
              then: [O('Good choice. The bright ones go first. Achat!', 'happy')],
            },
            {
              id: 'faint',
              label: 'Start with the faintest star.',
              then: [O('The faint ones are the brave ones. They shine anyway. Achat!', 'soft')],
            },
          ],
        },
        done: {
          id: 'lh3-s3-done',
          lines: [
            O('…shmone, tesha, eser! Ten stars! You counted ten stars in Hebrew, on a hill, at night. That’s the best thing you can do with numbers.', 'happy'),
            N('The yanshuf hoots once, as if it had been counting too.'),
            O('My savta counts stars with me from her balcony at home. Every bright one, she says “or”. Light.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'lh3-complete',
      lines: [
        N('Morning. Fern has pinned a chart to the orchard gate: ten plums in a row, each with its Hebrew number underneath.'),
        FE('Toda raba, Ori. I’m going to say them to every plum I sell. The customers will love it. Or leave.'),
        O('Quick-fire countdown, like a rocket launch! Eser, tesha, shmone, sheva, shesh, chamesh, arba, shalosh, shtayim, achat!'),
        N('On “achat”, the Wobbler leaps into the air, waves, and lands in a basket of plums.'),
        O('Lift-off. Well. Plum-off.', 'happy'),
        O('For you: my star chart. Ten stars, numbered achat to eser, with the yareach in the corner. And my football. You earned it.'),
        O('Mostly the Wobbler earned it. Don’t tell it. It’ll want a rematch. I know I would.'),
      ],
    },
    rewards: [
      {
        id: 'lh3-star-chart',
        kind: 'decor',
        label: 'Ori’s star chart',
        description: 'A hand-drawn chart of ten stars numbered אַחַת to עֶשֶׂר, with the moon (יָרֵחַ) in the corner. Hang it in the cottage; tap a star to hear its number.',
      },
      {
        id: 'lh3-football',
        kind: 'item',
        label: 'Ori’s football',
        description: 'A well-kicked football (toy). Nubbins chase it; kick it and Ori’s voice counts the bounces in Hebrew.',
      },
    ],
    sets: { lh3Done: true },
    notes: notes(
      'Numbers are the counting-aloud forms from the vetted list. Don’t pair them with Hebrew nouns (that changes the forms); count things in English sentences. ' +
        'New words per step: step 1 teaches achat–chamesh; six to ten are only echoed after Ori during the plum count (the check counts to ten), and are taught properly in step 2 (shesh–eser). Step 3: kochav, yareach, yanshuf. ' +
        'Running gag: Ori is a very bad loser. He wins the football game 10–1 and is outraged by the one goal the Wobbler scores by accident. ' +
        'Step 2 pitch: four jumpers make two goals, one at each end. The Wobbler keeps goal at one end; Ori’s own goal at the far end is empty, which is how the ball the Wobbler blocks rolls all the way into it. ' +
        'Step 2 mini-game: Ori takes shots; after each goal the player taps a Hebrew number tile; ten goals ends it. No fail state: a wrong tile makes Ori say “lo” and point at the right one. ' +
        'Step 3: night only; ten tappable stars plus the moon and an owl on a branch. Ori names nothing beyond star, moon and owl; don’t label real constellations. ' +
        'After LH3, Nubbins who learned “kochav” look up when they hear it.',
    ),
  },

  // ================================================================ LH4
  {
    id: 'lh4',
    code: 'LH4',
    title: 'Colours of the Orchard',
    source: 'Original: a beginner Hebrew course for the Learning Grove (colours and fruit)',
    audience: 'all',
    trigger: { where: 'Learning Grove only', when: 'Any day after LH3 is complete, when Nova comes back from the valley market.' },
    requires: ['LH3'],
    speakers: [ORI],
    steps: [
      {
        id: 'lh4-step1',
        goal: 'Sort Nova’s market fruit by colour, using the Hebrew colour words.',
        hint: 'Three baskets: אָדֹם (adom, red), יָרֹק (yarok, green) and צָהֹב (tsahov, yellow). Drag each fruit into one.',
        check: 'lang:he:sort:fruit:colour',
        scene: {
          id: 'lh4-s1',
          lines: [
            N('Nova drops a crate on the cottage table. It’s full of fruit from the valley market, all jumbled up.'),
            NV('I bought one of everything. I was hungry, and the stallholder was very persuasive.'),
            O('Sorting game! By colour. In Hebrew. Ready?'),
            O('אָדֹם (adom) is red. יָרֹק (yarok) is green. צָהֹב (tsahov) is yellow.'),
            O('Now fruit. תַּפּוּחַ (tapuach) is an apple. בָּנָנָה (banana) is… banana. You’re welcome.'),
            O('And לִימוֹן (limon) is a lemon. Hebrew is being nice to you today. Don’t get used to it.'),
            O('So a limon goes in tsahov. A banana goes in tsahov. A tapuach goes in adom, or yarok. Depends on the tapuach.'),
            N('The Wobbler sits in the middle of the table, hugging a banana. It does not look ready to share.'),
          ],
          choices: [
            {
              id: 'green-apple',
              label: 'Put the green apple in yarok.',
              then: [O('Yarok! Ken. An apple doesn’t have to be adom. Apples can be whatever they like.', 'happy')],
            },
            {
              id: 'red-apple',
              label: 'Put the red apple in adom.',
              then: [O('Adom! Ken. The classic. A tapuach adom. Like in a picture book.', 'happy')],
            },
          ],
        },
        done: {
          id: 'lh4-s1-done',
          lines: [
            N('Three neat piles: adom, yarok, tsahov. And a small fourth pile under the table, guarded by the Wobbler.'),
            O('The Wobbler has invented a new colour. It’s called “mine”.'),
            NV('It’s a very popular colour. I see it a lot at markets.'),
          ],
        },
      },
      {
        id: 'lh4-step2',
        goal: 'Fetch “something אָדֹם (adom)” for Clover’s fussy Nubbin.',
        hint: 'Look in Nova’s crate for something red. Sagol (purple) things won’t do.',
        check: 'lang:he:fetch:colour:adom',
        scene: {
          id: 'lh4-s2',
          lines: [
            N('Clover is by the pond with a little Nubbin who hasn’t eaten all day. She looks up as you come over.'),
            CL('This one will only eat red things. Don’t ask me why. We all have our ways.'),
            O('Something adom! On it. I’m fast. I play on the wing.'),
            N('Back at the crate, there are a lot of things that might be red.'),
            O('רִמּוֹן (rimon), a pomegranate. Red outside, full of red seeds inside. My favourite. Nobody believes how many seeds.'),
            O('עֲנָבִים (anavim), grapes. Their colour is סָגֹל (sagol), purple. Not adom. Close, but lo.'),
            O('תְּאֵנָה (te’ena), a fig. Same colour: sagol. Figs and grapes, wearing the same coat. And תָּמָר (tamar), a date. Brown and sticky.'),
            N('A צִפּוֹר (tsipor), a small bird, lands on the crate and pecks at the te’ena. The Wobbler shoos it.'),
            N('The tsipor shoos the Wobbler. The Wobbler loses.'),
            O('Tsipor! Lo! …Fine. Have one. Bevakasha.'),
          ],
          choices: [
            {
              id: 'rimon',
              label: 'Take the rimon.',
              then: [CL('Oh, that’s very adom. Look, she’s already sniffing it.', 'happy')],
            },
            {
              id: 'tapuach',
              label: 'Take a red tapuach.',
              then: [CL('A red apple. Lovely. Look, she’s already sniffing it.', 'happy')],
            },
            {
              id: 'anavim',
              label: 'Take the anavim.',
              then: [
                N('Clover’s Nubbin sniffs the grapes and turns her back on them, very slowly.'),
                O('Sagol, not adom! I told you! …Here, take the rimon instead. I’m not saying I told you. I am, a bit.'),
              ],
            },
          ],
        },
        done: {
          id: 'lh4-s2-done',
          lines: [
            N('The fussy Nubbin eats the red fruit very slowly, then looks at Clover as if to say “more”.'),
            CL('Toda. Did I say that right? Ori’s been teaching everyone.', 'happy'),
            O('Perfect toda. I’d give you a medal, but I’m out of medals. Have a fig.'),
          ],
        },
      },
      {
        id: 'lh4-step3',
        goal: 'Paint Fern’s fence in the three colours Ori calls out in Hebrew.',
        hint: 'Listen to Ori, then dip the brush in the tin of that colour. Tap a tin to hear its Hebrew name.',
        check: 'lang:he:paint:fence:3',
        scene: {
          id: 'lh4-s3',
          lines: [
            N('Fern’s fence is grey, peeling and sad. Fern has a row of paint tins and no ideas at all.'),
            FE('Pick three colours. Any three. I’m bad at deciding. I once took forty minutes to choose a spoon.'),
            O('I’ll call them out in Hebrew. You paint what I call. No peeking at the labels.'),
            O('כָּחֹל (kachol), blue. לָבָן (lavan), white. שָׁחֹר (shachor), black.'),
            O('כָּתֹם (katom), orange. And וָרֹד (varod), pink.'),
            FE('That’s five colours. And I’ve got… all of them, apparently. Nova bought paint as well.'),
            N('A פַּרְפַּר (parpar), a butterfly, flutters over the tins and settles on the kachol lid.'),
            O('Parpar! Even the butterfly wants to help.'),
            N('The Wobbler has already climbed into the varod tin. It is now pink, and it seems very happy about it.'),
          ],
          choices: [
            {
              id: 'sunset',
              label: 'A sunset fence, please.',
              then: [O('Katom, varod, sagol. Like the sky over the sea at home, just before the stars come out.', 'soft')],
            },
            {
              id: 'night',
              label: 'A night-sky fence.',
              then: [O('Shachor, kachol, and tsahov for the stars. Obviously. I’m an astronomer.', 'happy')],
            },
            {
              id: 'surprise',
              label: 'Surprise me, Ori.',
              then: [O('Varod, yarok, katom. Don’t argue. Art doesn’t argue.', 'happy')],
            },
          ],
        },
        done: {
          id: 'lh4-s3-done',
          lines: [
            N('The fence has three colours now, in wobbly stripes. Fern stands back and says nothing for a long time.'),
            FE('It’s… loud. I love it. I’d never have picked it, and that’s why I love it.', 'happy'),
            N('The Wobbler is still varod. It will stay varod until the next rain.'),
          ],
        },
      },
    ],
    complete: {
      id: 'lh4-complete',
      lines: [
        N('That evening, Ori hands you a twist of paper with a few small seeds inside.'),
        O('Seeds from the rimon. Plant one and, one day, you get a rimon tree. Then you’ll always have something adom.'),
        O('Quick-fire, Wobbler-style. It holds up a fruit. You shout the colour.'),
        N('The Wobbler holds up a limon (tsahov!), then a tapuach (adom!), then some half-eaten anavim (sagol, mostly).'),
        O('Ken, ken, ken! You’re the colour champion. I’m the colour champion too. Joint champions. I hate sharing. Beseder.', 'happy'),
        N('The pomegranate seeds go in your seed tin. The Wobbler is still pink.'),
      ],
    },
    rewards: [
      {
        id: 'lh4-pomegranate',
        kind: 'item',
        label: 'Pomegranate tree seed',
        description: 'Seeds saved from Nova’s market רִמּוֹן (rimon). Plant one to grow a pomegranate tree whose red fruit Nubbins love.',
      },
    ],
    sets: { lh4Done: true },
    notes: notes(
      'Colours are the masculine forms, used to name a colour. Don’t write Hebrew noun-plus-colour phrases; the feminine ending (for example adumah) is taught only as a reader-band note. ' +
        'New words per step: step 1 adom, yarok, tsahov, tapuach, banana, limon; step 2 rimon, anavim, sagol, te’ena, tamar, tsipor; step 3 kachol, lavan, shachor, katom, varod, parpar. ' +
        'Running gag: the Wobbler keeps a pile of fruit called “mine”, then falls into the pink paint and stays varod (pink tint on its sprite) until the next rain. ' +
        'The fruit comes from Nova’s market crate, so bananas, dates and lemons need no orchard trees. ' +
        'Step 2: picking anavim plays its “then” lines and swaps to the rimon automatically; all three choices complete the step. ' +
        'Step 3: the fence mini-game shows five or more tins; Ori calls three colours (set by the choice); the player taps each tin in turn. Brown appears only in English.',
    ),
  },

  // ================================================================ LH5
  {
    id: 'lh5',
    code: 'LH5',
    title: 'Savta’s Letters',
    source: 'Original: a beginner Hebrew course for the Learning Grove (family and feelings)',
    audience: 'all',
    trigger: { where: 'Learning Grove only', when: 'The first rainy afternoon after LH4 is complete.' },
    requires: ['LH4'],
    speakers: [ORI],
    steps: [
      {
        id: 'lh5-step1',
        goal: 'Read one of the letters in Savta’s tin with Ori.',
        hint: 'Sit at the cottage table with Ori and tap the letter. Tap any Hebrew word to hear it.',
        check: 'lang:he:read:letter:1',
        scene: {
          id: 'lh5-s1',
          lines: [
            N('A rainy afternoon. Ori opens the biscuit tin on the cottage table, and it’s full of letters tied in bundles with string.'),
            O('These belong to my סַבְתָּא (savta, “grandma”). She sent them with me so you could see them.'),
            O('Savta and your Hazel wrote to each other for forty years. Hazel used to write to my savta every month.'),
            NV('Some of these I carried myself. Over two mountains and past one very rude goose.'),
            O('Hazel learned Hebrew words from Savta, a few at a time, and put them in her letters. Half English, half Hebrew.'),
            O('This one. Read it with me.'),
            N('“Dear friend, שָׁלוֹם! How is the מִשְׁפָּחָה (mishpacha, ‘family’)? Give my love to סַבָּא (saba, ‘grandpa’).”'),
            N('“Is the כֶּלֶב (kelev, ‘dog’) still stealing socks? Does the חָתוּל (chatul, ‘cat’) still sit on your letters while you write?”'),
            O('Still steals socks. A different kelev. Same socks. And the chatul sat on my suitcase while I packed.', 'happy'),
            N('In the margin there’s a game of noughts and crosses, drawn in two colours of ink.'),
            O('Wait. They played noughts and crosses in the margins? By post? For forty years?', 'shock'),
            O('And Savta is LOSING this one. Savta! Concentrate!', 'angry'),
          ],
        },
        done: {
          id: 'lh5-s1-done',
          lines: [
            O('You read it! Mishpacha, saba, kelev, chatul. And savta, obviously. Savta is the star of the tin.', 'happy'),
            O('Every letter has a game in the margin. I’m keeping score. Savta is behind. I am very upset about it.'),
            N('The Wobbler climbs onto the letter and sits on it, exactly like a chatul.'),
          ],
        },
      },
      {
        id: 'lh5-step2',
        goal: 'Draw a family tree with Hebrew words.',
        hint: 'Draw a tree on the big sheet, then label each branch: ima, aba, ach, achot, chaver or chavera.',
        check: 'lang:he:draw:family',
        scene: {
          id: 'lh5-s2',
          lines: [
            N('Ori unrolls a long sheet of paper and draws a very good tree. He looks annoyed that you noticed.'),
            O('A family tree. My mishpacha. Savta and Saba at the top.'),
            O('Then אִמָּא (ima), mum. And אַבָּא (aba), dad. Ima and Aba. Easy to say. Hard to argue with.'),
            O('I’ve got an אָחוֹת (achot), a sister. Older. Bossy. And an אָח (ach), a brother. Younger. Borrows my football without asking.'),
            O('Then friends. A friend who’s a boy is a חָבֵר (chaver). A friend who’s a girl is a חֲבֵרָה (chavera). The ending changes.'),
            O('Now draw yours. Use the Hebrew words. Who goes on your tree?'),
            NV('Do I go on it? I’m not mishpacha. I’m the one who carries the letters.', 'think'),
          ],
          choices: [
            {
              id: 'nova-chavera',
              label: 'Nova goes on as a chavera.',
              then: [
                NV('A chavera. I’ll take that. I’ll take that very happily.', 'happy'),
                O('Chavera Nova! Big branch. Near the top.'),
              ],
            },
            {
              id: 'ori-chaver',
              label: 'Ori goes on as a chaver.',
              then: [
                O('Me? On your tree?', 'shock'),
                O('…Chaver. Ken. Toda. I’m putting you on mine too. Don’t make it weird.', 'soft'),
              ],
            },
            {
              id: 'nubbins',
              label: 'The Nubbins get their own branch.',
              then: [O('A Nubbin branch! The Wobbler at the very top. Obviously. It would never forgive us.', 'happy')],
            },
          ],
        },
        done: {
          id: 'lh5-s2-done',
          lines: [
            N('Two trees, side by side: Ori’s mishpacha and yours, with Hebrew words on every branch.'),
            O('Ima, aba, ach, achot, chaver, chavera. All of them! My achot will be furious that you learned them so fast. Good.', 'happy'),
            N('The Wobbler has drawn itself on both trees. It is a circle with arms.'),
          ],
        },
      },
      {
        id: 'lh5-step3',
        goal: 'Tell Ori how a Nubbin is feeling, in Hebrew.',
        hint: 'Look at the shy Nubbin by the gate, then pick a feeling word. Ori has chosen the girl form for her.',
        check: 'lang:he:say:feeling',
        scene: {
          id: 'lh5-s3',
          lines: [
            N('Late afternoon, and the rain has stopped. The Nubbins are all over the garden, each doing its own thing.'),
            O('Feelings. In Hebrew, a feeling word changes for a boy or a girl. Nubbins can be either, so I pick for each one.'),
            O('Happy: שָׂמֵחַ (sameach) for a boy, שְׂמֵחָה (smecha) for a girl.'),
            O('Sad: עָצוּב (atsuv) for a boy, עֲצוּבָה (atsuva) for a girl.'),
            O('Tired: עָיֵף (ayef) for a boy, עֲיֵפָה (ayefa) for a girl.'),
            N('The shy one sits alone by the gate, looking at the hill; the sleepy one is asleep in a flowerpot. The Wobbler rolls in the wet grass.'),
            O('I’ve decided the shy one is a girl. The sleepy one’s a boy. The Wobbler is a boy who is also a ball.'),
            O('So. The shy one. How does she feel?'),
          ],
          choices: [
            {
              id: 'atsuva',
              label: 'She’s atsuva. Sad.',
              then: [
                O('Atsuva. Ken. Maybe she misses someone. Let’s go and sit with her.', 'soft'),
                N('You sit down next to her and wait. After a while, she leans against your arm.'),
              ],
            },
            {
              id: 'ayefa',
              label: 'She’s ayefa. Tired.',
              then: [O('Ayefa. Could be. It’s been a long day of waving. Waving is hard work.', 'think')],
            },
            {
              id: 'smecha',
              label: 'She’s smecha. Just quiet.',
              then: [O('Smecha and quiet. That’s allowed. Some happy is the quiet kind.', 'soft')],
            },
          ],
        },
        done: {
          id: 'lh5-s3-done',
          lines: [
            O('The sleepy one is ayef. Obviously. The Wobbler is sameach. Very, very sameach.'),
            O('And me? Ani… a bit atsuv. I miss Savta. And I’m sameach, because I’m here. Both at once. Is that allowed?', 'soft'),
            N('The Wobbler rolls over and leans against his foot. It seems to think that’s allowed.'),
          ],
        },
      },
    ],
    complete: {
      id: 'lh5-complete',
      lines: [
        N('Ori lifts a small wooden box out of the bottom of the tin. It has a brass latch and a painted lid.'),
        O('Savta sent this for you. A letter box. For when you write to me. You will write to me. That wasn’t a question.'),
        O('Quick-fire, from the Wobbler. It points, you say the word.'),
        N('The Wobbler points at Ori (chaver!), at Nova (chavera!) and at the tin of letters (mishpacha!).'),
        N('Last of all, the Wobbler points at itself and does a big, wobbly smile.'),
        O('Sameach! It’s sameach! It learned a feeling!', 'happy'),
        O('Oh, and I checked the very last letter in the tin. Savta won that game of noughts and crosses. I am SO relieved.', 'happy'),
        N('Savta’s letter box is yours. And now there’s a “sameach” smile you can make at any Nubbin.'),
      ],
    },
    rewards: [
      {
        id: 'lh5-letter-box',
        kind: 'decor',
        label: 'Savta’s letter box',
        description: 'A small wooden box with a brass latch, sent by Ori’s savta. Keep letters in it; tapping it replays the letter from this quest.',
      },
      {
        id: 'lh5-sameach-emote',
        kind: 'cosmetic',
        label: '“Sameach” happy emote',
        description: 'A big, wobbly smile. Ori says שָׂמֵחַ (sameach) or שְׂמֵחָה (smecha) for the Nubbin you show it to.',
      },
    ],
    sets: { lh5Done: true },
    notes: notes(
      'Hazel appears only as someone who wrote letters, always in the past tense (“used to write”). Never say whether she is alive. The letter in lh5-s1 is one Hazel sent to Savta; Savta kept it. It mentions nothing from the campaign. ' +
        'New words per step: step 1 savta, saba, mishpacha, kelev, chatul; step 2 ima, aba, achot, ach, chaver, chavera; step 3 the three feelings, each with a boy form and a girl form. ' +
        'Running gag: the forty-year game of noughts and crosses in the letters’ margins; Ori (a terrible loser) is outraged that Savta is losing, and relieved in lh5-complete. ' +
        'Step 1: show the letter as a paper close-up; the narrator lines in quotes are the letter’s text. Every Hebrew word in it is tappable. ' +
        'Step 2: a drawing canvas with word stickers in Hebrew (pointed) plus romanisation. Any arrangement completes it. ' +
        'Step 3: Ori picks each Nubbin’s form (the shy one: girl forms; the sleepy one and the Wobbler: boy forms). The game never asks the player to pick a gender for themselves. ' +
        'The sameach emote: Ori’s voice line uses sameach for Nubbins he has called boys and smecha for girls; default sameach.',
    ),
  },

  // ================================================================ LH6
  {
    id: 'lh6',
    code: 'LH6',
    title: 'The New Year of the Trees',
    source: 'Original: a beginner Hebrew course for the Learning Grove (Tu BiShvat, nature, and the review)',
    audience: 'all',
    trigger: { where: 'Learning Grove only', when: 'Ori’s last week, after LH5 is complete.' },
    requires: ['LH5'],
    speakers: [ORI],
    steps: [
      {
        id: 'lh6-step1',
        goal: 'Ask Ori about Tu BiShvat, the New Year of the Trees.',
        hint: 'Ori is sitting under the old apple tree. Tap him to talk.',
        check: 'talk:ori:tu-bishvat',
        scene: {
          id: 'lh6-s1',
          lines: [
            N('It’s Ori’s last week. He’s under the old apple tree counting its branches, and stops when you sit down.'),
            O('Want to hear about my favourite day? Not my birthday. My second favourite.'),
            O('ט״ו בִּשְׁבָט (Tu BiShvat). “The New Year of the Trees.” Trees get a birthday. Isn’t that brilliant?'),
            O('It’s on the fifteenth of a Hebrew month called Shevat. Usually in January or February.'),
            O('People plant trees. And eat fruit, especially dates, figs, pomegranates, olives and grapes. Tamar, te’ena, rimon, anavim.'),
            O('A tree is an עֵץ (ets). Short word, big thing.'),
            O('In Israel, the שָׁקֵד (shaked) trees often blossom around then. Almond trees. Lavan and pale pink, in the middle of winter.'),
            NV('I saw that once. A whole hillside of shaked in flower. I nearly missed my boat.', 'soft'),
            O('So I want to plant a shaked here before I go. Then every winter, when it blossoms, your Grove gets a bit of Tu BiShvat.'),
            N('The Wobbler climbs the apple tree to wish it happy birthday. It waves at the trunk, which doesn’t wave back.'),
          ],
          choices: [
            {
              id: 'where-pond',
              label: 'Plant it by the pond.',
              then: [O('By the pond. It’ll see itself in the water. Trees like that, probably.', 'happy')],
            },
            {
              id: 'where-tent',
              label: 'Plant it where your tent is.',
              then: [O('Where my tent is. So when I’m gone, something of mine is still standing there. Ken.', 'soft')],
            },
            {
              id: 'where-gate',
              label: 'Plant it by the gate, under the shalom sign.',
              then: [O('Shalom and a shaked. Hello, goodbye, and a tree. Perfect.', 'happy')],
            },
          ],
        },
        done: {
          id: 'lh6-s1-done',
          lines: [
            O('Tu BiShvat, ets, shaked. You’ve got the whole festival in three words.', 'happy'),
            O('Well. Plus fruit. There’s always fruit.'),
            N('The Wobbler comes down from the apple tree, carefully, backwards. Old habits.'),
          ],
        },
      },
      {
        id: 'lh6-step2',
        goal: 'Plant an almond tree (שָׁקֵד, shaked) with everyone.',
        hint: 'Dig where you chose, set the little tree in, and water it from the pond.',
        check: 'lang:he:plant:almond',
        scene: {
          id: 'lh6-s2',
          lines: [
            N('Everyone comes: Nova with the sapling, Fern with a spade, Clover with a watering can, and Byte with a tape measure.'),
            O('This is our גַּן (gan), our garden. Every gan needs a new ets sometimes.'),
            O('A tree needs מַיִם (mayim), water. And שֶׁמֶשׁ (shemesh), sun. And somewhere good for its roots.'),
            O('And גֶּשֶׁם (geshem), rain. Rain is just mayim falling out of the sky for free.'),
            BY('I’ve measured. Five big steps from anything else. Plenty of room for the roots.', 'think'),
            N('Clover dips the watering can in the pond. A small דָּג (dag), a fish, looks up at her, offended.'),
            O('Sorry, dag! We’re only borrowing some mayim. Toda!'),
            O('One day it’ll have a פֶּרַח (perach), a flower. Lots of them. Almond trees flower before their leaves come out.'),
            FE('I’ll look after it. Badly, but with love.', 'happy'),
            N('The Wobbler pats the soil down very carefully, using its whole body.'),
          ],
          choices: [
            {
              id: 'you-water',
              label: 'I’ll water it first.',
              then: [O('Go on. Slowly. Mayim in, not mayim everywhere. …Tov.', 'happy')],
            },
            {
              id: 'ori-water',
              label: 'Ori should water it first. It’s his tree.',
              then: [O('Our tree. But toda.', 'soft')],
            },
            {
              id: 'wobbler-water',
              label: 'Let the Wobbler do it.',
              then: [
                N('The Wobbler tips the whole watering can over itself. Some of it reaches the tree.'),
                O('Geshem! The Wobbler made geshem. Ten out of ten. Well, shesh.', 'happy'),
              ],
            },
          ],
        },
        done: {
          id: 'lh6-s2-done',
          lines: [
            N('A thin little ets stands in the ground, tied to a stake and dripping. It doesn’t look like much yet.'),
            O('Mayim, shemesh, a bit of geshem, and patience. Then perach. Then shaked. That’s how a gan works.'),
            O('Is it blossoming yet?'),
            N('The Wobbler lies down with one ear against the stake, listening for blossom.'),
            O('Lo. I’m going to ask every day until I leave.', 'happy'),
            BY('It has grown nought centimetres. I measured twice.', 'think'),
            BY('Pixel says a watched tree never blossoms. Pixel has never watched anything for more than a minute.'),
          ],
        },
      },
      {
        id: 'lh6-step3',
        goal: 'The review party: greet, count, colours, family and feelings, all in Hebrew.',
        hint: 'Answer Ori’s rounds at the party by the lanterns. Every answer you give, the Nubbins act out.',
        check: 'lang:he:review:party',
        scene: {
          id: 'lh6-s3',
          lines: [
            N('Ori’s last night. Paper lanterns hang along the fence, and Ori stands on an upturned crate holding a torch.'),
            O('This is a פָּנָס (panas). A lantern, or a torch. Same word. I need it to find the party, which is four steps away.'),
            O('Welcome to the review party! I say it in English, you shout it in Hebrew, the Nubbins do the actions. Then snacks: tamar and te’ena.'),
            O('Round one, greetings. “Hello!”'),
            N('Every Nubbin in the Grove waves. The Wobbler waves with both arms, wobbles, and stays up.'),
            O('Round two, numbers. Count the lanterns on the fence with me. Achat, shtayim, shalosh, arba… all the way to eser!'),
            O('Round three, animals. Two last new ones, then I promise I’m done. סוּס (sus), a horse. אַרְנָב (arnav), a rabbit.'),
            O('Nubbins! Be a sus! Now be an arnav! Now a kelev, a chatul, a tsipor, a parpar, a yanshuf, a dag!'),
            N('The Nubbins gallop, hop, bark, stretch, flap, flutter, hoot and blow bubbles, then collapse in a happy heap.'),
            O('Last round. You pick.'),
          ],
          choices: [
            {
              id: 'colours',
              label: 'Colours!',
              then: [O('Point at something adom! Something yarok! Something shachor, like the night sky! Something varod! …The Wobbler doesn’t count. It’s still a bit varod.', 'happy')],
            },
            {
              id: 'family',
              label: 'Family!',
              then: [O('Who carries the letters? Nova, a chavera! Whose tin is it? Savta’s! Who’s your chaver? Me! Correct!', 'happy')],
            },
            {
              id: 'feelings',
              label: 'Feelings!',
              then: [O('The sleepy one: ayef! The shy one: smecha, tonight! And me? Sameach. Very sameach.', 'happy')],
            },
          ],
        },
        done: {
          id: 'lh6-s3-done',
          lines: [
            O('You did it. Greetings, numbers, colours, fruit, family, feelings, animals and trees. That’s my whole world, in Hebrew.', 'happy'),
            NV('Erev tov, everyone. Panas off soon, and then laila tov.', 'soft'),
            N('The Nubbins wave good night, then hop off to bed like an arnav. The Wobbler waves, falls asleep halfway through, and nobody wakes it.'),
          ],
        },
      },
    ],
    complete: {
      id: 'lh6-complete',
      lines: [
        N('Morning. Ori’s bag is packed and leaning against the gate under the shalom sign, with his panas tied to the strap.'),
        O('Boker tov. The shemesh is out. Last one. I’m atsuv. And sameach. Both. We did this already. It’s still allowed.', 'soft'),
        O('The chant, one last time, with the new verse. Everybody.'),
        O('“Adom, yarok, the colours bright, kochav, yareach, stars at night, ima, aba, savta too, shalom, shalom, and toda to you!”', 'happy'),
        O('You’re an Alef-Bet Keeper now. That’s a real title. I made it up, so it’s real.'),
        O('Shalom. That’s goodbye. And hello, next time. And peace, in between. Lehitra’ot!', 'soft'),
        N('Ori lifts and pushes, and the gate gives first time. He gallops down the lane like a sus, then turns back, grinning.'),
        O('Is it blossoming yet?'),
        N('Nobody even looks. Everybody shouts “Lo!” The Wobbler shouts it too, in its way, by falling over.'),
        O('Tov. Write and tell me when. Shalom!', 'happy'),
        N('The Wobbler gets up, sits by the shaked facing the lane, and waits for blossom on Ori’s behalf.'),
        N('By the pond, the little shaked waits for winter. In late winter it will blossom, perach after perach, lavan and pale pink.'),
      ],
    },
    rewards: [
      {
        id: 'lh6-almond-tree',
        kind: 'decor',
        label: 'Ori’s almond tree',
        description: 'The שָׁקֵד (shaked) you planted together. It blossoms white and pale pink in late winter, before its leaves come out; Nubbins who learned “shalom” wave at it.',
      },
      {
        id: 'lh6-alef-bet-keeper',
        kind: 'title',
        label: 'Alef-Bet Keeper',
        description: 'For finishing Ori’s Alef-Bet: greetings, letters, numbers, colours, fruit, animals, family, feelings and trees, in Hebrew.',
      },
    ],
    sets: { lh6Done: true },
    notes: notes(
      'Culture: Tu BiShvat (ט״ו בִּשְׁבָט), “the New Year of the Trees”, is the 15th of the Hebrew month of Shevat, usually in January or February. People plant trees and eat fruit, especially dates, figs, pomegranates, olives and grapes; in Israel almond trees often blossom around then. Say nothing more about it than that. ' +
        'New words per step: step 1 Tu BiShvat, ets, shaked; step 2 gan, mayim, shemesh, geshem, dag, perach; step 3 panas, sus, arnav, then the review of everything. ' +
        'Running gag: “Is it blossoming yet?” Ori asks about the sapling every day until he leaves (add a daily idle line at the sapling: “Is it blossoming yet? …Lo.”). The Wobbler’s whole arc pays off: it waves at “shalom” and stays up. ' +
        'Step 1 choice sets only where the almond tree is placed (pond, the tent spot or the gate). No flag. ' +
        'Step 3: the party is four rounds (greetings, numbers, animals, then the chosen round). Every Nubbin who learned a word acts it out. ' +
        'The almond tree blossoms only in late winter in the Grove’s calendar; until then show a small sapling.',
    ),
  },
];

// ================================================================== the course
const v = (
  slug: string,
  native: string,
  plain: string,
  roman: string,
  english: string,
  sayIt: string,
  topic: VocabItem['topic'],
  quest: string,
  notes?: string,
): VocabItem => {
  const item: VocabItem = { id: `he-${slug}`, lang: 'he', native, plain, roman, english, sayIt, topic, quest, band: 'both', audio: `he/${slug}` };
  if (notes) item.notes = notes;
  return item;
};

const FULL = 'Plain form uses the usual full spelling (an extra vav or yod stands in for the missing vowel points).';

const VOCAB: VocabItem[] = [
  // greetings (LH1)
  v('shalom', 'שָׁלוֹם', 'שלום', 'shalom', 'hello, goodbye and peace', 'sha-LOME', 'greetings', 'LH1', 'One word for hello, goodbye and peace. Spelled shin, lamed, vav, final mem. Nubbins who learn it wave.'),
  v('boker-tov', 'בֹּקֶר טוֹב', 'בוקר טוב', 'boker tov', 'good morning', 'BO-ker TOVE', 'greetings', 'LH1', `Stress on the first syllable of boker. ${FULL}`),
  v('erev-tov', 'עֶרֶב טוֹב', 'ערב טוב', 'erev tov', 'good evening', 'EH-rev TOVE', 'greetings', 'LH1', 'Stress on the first syllable of erev.'),
  v('laila-tov', 'לַיְלָה טוֹב', 'לילה טוב', 'laila tov', 'good night', 'LIE-la TOVE', 'greetings', 'LH1', 'Stress on the first syllable of laila.'),
  v('toda', 'תּוֹדָה', 'תודה', 'toda', 'thank you', 'toe-DAH', 'greetings', 'LH1'),
  v('toda-raba', 'תּוֹדָה רַבָּה', 'תודה רבה', 'toda raba', 'thank you very much', 'toe-DAH rah-BAH', 'greetings', 'LH1'),
  v('bevakasha', 'בְּבַקָּשָׁה', 'בבקשה', 'bevakasha', 'please, and you’re welcome', 'beh-vah-kah-SHAH', 'greetings', 'LH1', 'One word for both “please” and “you’re welcome”.'),
  v('lehitraot', 'לְהִתְרָאוֹת', 'להתראות', "lehitra'ot", 'see you', 'leh-heet-rah-OTE', 'greetings', 'LH1'),
  v('ken', 'כֵּן', 'כן', 'ken', 'yes', 'KEN', 'greetings', 'LH1'),
  v('lo', 'לֹא', 'לא', 'lo', 'no', 'LOW', 'greetings', 'LH1'),
  v('ani', 'אֲנִי', 'אני', 'ani', 'I', 'ah-NEE', 'greetings', 'LH1'),
  v('korim-li', 'קוֹרְאִים לִי…', 'קוראים לי…', 'korim li…', 'my name is… (literally “they call me”)', 'kor-EEM lee', 'greetings', 'LH1', 'Followed by your name: “korim li Ori”.'),
  v('ma-shlomkha', 'מָה שְׁלוֹמְךָ?', 'מה שלומך?', 'ma shlomkha?', 'how are you? (to a boy or man)', 'mah shlom-KHA', 'greetings', 'LH1', 'Said to a boy or man. To a girl or woman: ma shlomekh? Without vowel points the two are spelled the same.'),
  v('ma-shlomekh', 'מָה שְׁלוֹמֵךְ?', 'מה שלומך?', 'ma shlomekh?', 'how are you? (to a girl or woman)', 'mah shlo-MEKH', 'greetings', 'LH1', 'Said to a girl or woman. To a boy or man: ma shlomkha? Ends with final kaf (ך).'),
  v('tov', 'טוֹב', 'טוב', 'tov', 'good', 'TOVE', 'greetings', 'LH1'),
  v('beseder', 'בְּסֵדֶר', 'בסדר', 'beseder', 'OK, fine', 'beh-SEH-der', 'greetings', 'LH1', 'Stress on the middle syllable.'),
  // letters and the name (LH2)
  v('or', 'אוֹר', 'אור', 'or', 'light', 'ORE', 'nature', 'LH2', 'Alef, vav, resh. Add a yod and it becomes the name Ori, “my light”.'),
  v('ori', 'אוֹרִי', 'אורי', 'Ori', 'Ori, a name meaning “my light”', 'OH-ree', 'culture', 'LH2', 'Ori’s name. Spelled alef, vav, resh, yod. Say-it is an approximation: record Ori’s voice actor saying his own name.'),
  // numbers (LH3)
  v('achat', 'אַחַת', 'אחת', 'achat', 'one (1)', 'ah-KHAT', 'numbers', 'LH3', 'The form used when counting aloud. “Ch” is the throaty sound in Scottish “loch”.'),
  v('shtayim', 'שְׁתַּיִם', 'שתיים', 'shtayim', 'two (2)', 'SHTAI-yim', 'numbers', 'LH3', 'The form used when counting aloud. Stress on the first syllable. Plain form doubles the yod (שתיים) to show it is the consonant “y”, the usual modern spelling.'),
  v('shalosh', 'שָׁלוֹשׁ', 'שלוש', 'shalosh', 'three (3)', 'sha-LOSH', 'numbers', 'LH3', 'The form used when counting aloud.'),
  v('arba', 'אַרְבַּע', 'ארבע', 'arba', 'four (4)', 'ar-BAH', 'numbers', 'LH3', 'The form used when counting aloud. Stress on the last syllable, unlike sheva, tesha and eser.'),
  v('chamesh', 'חָמֵשׁ', 'חמש', 'chamesh', 'five (5)', 'kha-MESH', 'numbers', 'LH3', 'The form used when counting aloud. Throaty “ch”, as in “loch”.'),
  v('shesh', 'שֵׁשׁ', 'שש', 'shesh', 'six (6)', 'SHESH', 'numbers', 'LH3', 'The form used when counting aloud.'),
  v('sheva', 'שֶׁבַע', 'שבע', 'sheva', 'seven (7)', 'SHEH-vah', 'numbers', 'LH3', 'The form used when counting aloud. Stress on the first syllable.'),
  v('shmone', 'שְׁמוֹנֶה', 'שמונה', 'shmone', 'eight (8)', 'shmo-NEH', 'numbers', 'LH3', 'The form used when counting aloud.'),
  v('tesha', 'תֵּשַׁע', 'תשע', 'tesha', 'nine (9)', 'TEH-sha', 'numbers', 'LH3', 'The form used when counting aloud. Stress on the first syllable.'),
  v('eser', 'עֶשֶׂר', 'עשר', 'eser', 'ten (10)', 'EH-ser', 'numbers', 'LH3', 'The form used when counting aloud. Stress on the first syllable.'),
  // nature from LH3
  v('kochav', 'כּוֹכָב', 'כוכב', 'kochav', 'star', 'ko-KHAV', 'nature', 'LH3', 'Nubbins who learn it look up at the sky.'),
  v('yareach', 'יָרֵחַ', 'ירח', 'yareach', 'moon', 'yah-REH-akh', 'nature', 'LH3', 'Stress on the middle syllable.'),
  // colours (LH4)
  v('adom', 'אָדֹם', 'אדום', 'adom', 'red', 'ah-DOME', 'colours', 'LH4', `Masculine form, used to name the colour. Describing a feminine noun changes the ending (for example adumah): a reader-band note only. ${FULL} (Without the vav, the letters would spell a different word.)`),
  v('kachol', 'כָּחֹל', 'כחול', 'kachol', 'blue', 'kah-KHOLE', 'colours', 'LH4', `Masculine form, used to name the colour. ${FULL}`),
  v('tsahov', 'צָהֹב', 'צהוב', 'tsahov', 'yellow', 'tsa-HOVE', 'colours', 'LH4', `Masculine form, used to name the colour. ${FULL}`),
  v('yarok', 'יָרֹק', 'ירוק', 'yarok', 'green', 'yah-ROKE', 'colours', 'LH4', `Masculine form, used to name the colour. ${FULL}`),
  v('lavan', 'לָבָן', 'לבן', 'lavan', 'white', 'lah-VAN', 'colours', 'LH4', 'Masculine form, used to name the colour. Ends with final nun (ן).'),
  v('shachor', 'שָׁחֹר', 'שחור', 'shachor', 'black', 'sha-KHOR', 'colours', 'LH4', `Masculine form, used to name the colour. ${FULL}`),
  v('katom', 'כָּתֹם', 'כתום', 'katom', 'orange', 'kah-TOME', 'colours', 'LH4', `Masculine form, used to name the colour. ${FULL}`),
  v('sagol', 'סָגֹל', 'סגול', 'sagol', 'purple', 'sah-GOLE', 'colours', 'LH4', `Masculine form, used to name the colour. ${FULL}`),
  v('varod', 'וָרֹד', 'ורוד', 'varod', 'pink', 'vah-RODE', 'colours', 'LH4', `Masculine form, used to name the colour. ${FULL}`),
  // fruit (LH4, LH6)
  v('tapuach', 'תַּפּוּחַ', 'תפוח', 'tapuach', 'apple', 'tah-POO-akh', 'food', 'LH4', 'Stress on the middle syllable.'),
  v('banana', 'בָּנָנָה', 'בננה', 'banana', 'banana', 'bah-NAH-nah', 'food', 'LH4', 'Stress on the middle syllable.'),
  v('anavim', 'עֲנָבִים', 'ענבים', 'anavim', 'grapes', 'ah-nah-VEEM', 'food', 'LH4'),
  v('rimon', 'רִמּוֹן', 'רימון', 'rimon', 'pomegranate', 'ree-MONE', 'food', 'LH4', `${FULL} One of the Tu BiShvat fruits.`),
  v('teena', 'תְּאֵנָה', 'תאנה', "te'ena", 'fig', 'teh-eh-NAH', 'food', 'LH4', 'One of the Tu BiShvat fruits.'),
  v('tamar', 'תָּמָר', 'תמר', 'tamar', 'date', 'tah-MAR', 'food', 'LH4', 'One of the Tu BiShvat fruits.'),
  v('limon', 'לִימוֹן', 'לימון', 'limon', 'lemon', 'lee-MONE', 'food', 'LH4'),
  v('shaked', 'שָׁקֵד', 'שקד', 'shaked', 'almond', 'shah-KED', 'food', 'LH6', 'In Israel, almond trees often blossom around Tu BiShvat.'),
  // animals (LH3, LH4, LH5, LH6)
  v('yanshuf', 'יַנְשׁוּף', 'ינשוף', 'yanshuf', 'owl', 'yan-SHOOF', 'animals', 'LH3', 'Ends with final pey/fey (ף).'),
  v('tsipor', 'צִפּוֹר', 'ציפור', 'tsipor', 'bird', 'tsee-POR', 'animals', 'LH4', FULL),
  v('parpar', 'פַּרְפַּר', 'פרפר', 'parpar', 'butterfly', 'par-PAR', 'animals', 'LH4'),
  v('kelev', 'כֶּלֶב', 'כלב', 'kelev', 'dog', 'KEH-lev', 'animals', 'LH5', 'Stress on the first syllable.'),
  v('chatul', 'חָתוּל', 'חתול', 'chatul', 'cat', 'kha-TOOL', 'animals', 'LH5'),
  v('dag', 'דָּג', 'דג', 'dag', 'fish', 'DAHG', 'animals', 'LH6'),
  v('sus', 'סוּס', 'סוס', 'sus', 'horse', 'SOOS', 'animals', 'LH6'),
  v('arnav', 'אַרְנָב', 'ארנב', 'arnav', 'rabbit', 'ar-NAHV', 'animals', 'LH6'),
  // family (LH5)
  v('savta', 'סַבְתָּא', 'סבתא', 'savta', 'grandma', 'SAHV-tah', 'family', 'LH5', 'Stress on the first syllable. Ori calls his grandma Savta.'),
  v('saba', 'סַבָּא', 'סבא', 'saba', 'grandpa', 'SAH-bah', 'family', 'LH5', 'Stress on the first syllable.'),
  v('mishpacha', 'מִשְׁפָּחָה', 'משפחה', 'mishpacha', 'family', 'meesh-pah-KHAH', 'family', 'LH5'),
  v('ima', 'אִמָּא', 'אמא', 'ima', 'mum', 'EE-mah', 'family', 'LH5', 'Stress on the first syllable.'),
  v('aba', 'אַבָּא', 'אבא', 'aba', 'dad', 'AH-bah', 'family', 'LH5', 'Stress on the first syllable.'),
  v('ach', 'אָח', 'אח', 'ach', 'brother', 'AKH', 'family', 'LH5'),
  v('achot', 'אָחוֹת', 'אחות', 'achot', 'sister', 'ah-KHOTE', 'family', 'LH5'),
  v('chaver', 'חָבֵר', 'חבר', 'chaver', 'friend (a boy)', 'khah-VER', 'family', 'LH5', 'A friend who is a boy. A friend who is a girl is chavera.'),
  v('chavera', 'חֲבֵרָה', 'חברה', 'chavera', 'friend (a girl)', 'khah-veh-RAH', 'family', 'LH5', 'A friend who is a girl. A friend who is a boy is chaver.'),
  // feelings (LH5): the first form for a boy, the second for a girl
  v('sameach', 'שָׂמֵחַ', 'שמח', 'sameach', 'happy (a boy)', 'sah-MEH-akh', 'feelings', 'LH5', 'Boy form. Girl form: smecha. A Nubbin can be either; Ori picks per Nubbin.'),
  v('smecha', 'שְׂמֵחָה', 'שמחה', 'smecha', 'happy (a girl)', 'smeh-KHAH', 'feelings', 'LH5', 'Girl form. Boy form: sameach.'),
  v('atsuv', 'עָצוּב', 'עצוב', 'atsuv', 'sad (a boy)', 'ah-TSOOV', 'feelings', 'LH5', 'Boy form. Girl form: atsuva.'),
  v('atsuva', 'עֲצוּבָה', 'עצובה', 'atsuva', 'sad (a girl)', 'ah-tsoo-VAH', 'feelings', 'LH5', 'Girl form. Boy form: atsuv.'),
  v('ayef', 'עָיֵף', 'עייף', 'ayef', 'tired (a boy)', 'ah-YEF', 'feelings', 'LH5', 'Boy form. Girl form: ayefa. Plain form doubles the yod (עייף) to show it is the consonant “y”, the usual modern spelling.'),
  v('ayefa', 'עֲיֵפָה', 'עייפה', 'ayefa', 'tired (a girl)', 'ah-yeh-FAH', 'feelings', 'LH5', 'Girl form. Boy form: ayef. Plain form doubles the yod (עייפה) to show it is the consonant “y”, the usual modern spelling.'),
  // nature and culture (LH6)
  v('tu-bishvat', 'ט״ו בִּשְׁבָט', 'ט״ו בשבט', 'Tu BiShvat', 'the New Year of the Trees', 'too beesh-VAHT', 'culture', 'LH6', 'The 15th of the Hebrew month of Shevat, usually in January or February. People plant trees and eat fruit, especially dates, figs, pomegranates, olives and grapes. Say-it is an approximation: check it with the native-speaker recording.'),
  v('ets', 'עֵץ', 'עץ', 'ets', 'tree', 'ETS', 'nature', 'LH6', 'Ends with final tsadi (ץ).'),
  v('gan', 'גַּן', 'גן', 'gan', 'garden', 'GAHN', 'nature', 'LH6', 'Ends with final nun (ן).'),
  v('mayim', 'מַיִם', 'מים', 'mayim', 'water', 'MY-yim', 'nature', 'LH6', 'Stress on the first syllable. Ends with final mem (ם).'),
  v('shemesh', 'שֶׁמֶשׁ', 'שמש', 'shemesh', 'sun', 'SHEH-mesh', 'nature', 'LH6', 'Stress on the first syllable.'),
  v('geshem', 'גֶּשֶׁם', 'גשם', 'geshem', 'rain', 'GEH-shem', 'nature', 'LH6', 'Stress on the first syllable.'),
  v('perach', 'פֶּרַח', 'פרח', 'perach', 'flower', 'PEH-rakh', 'nature', 'LH6', 'Stress on the first syllable.'),
  v('panas', 'פָּנָס', 'פנס', 'panas', 'lantern, torch', 'pah-NAHS', 'nature', 'LH6'),
];

const SCRIPT: ScriptChar[] = [
  { char: 'א', name: 'Alef', roman: '(silent)', notes: 'Silent; it holds a vowel. First letter of the alef-bet, and of אוֹרִי (Ori).' },
  { char: 'ב', name: 'Bet / Vet', roman: 'b / v', notes: 'b with a dot inside, v without.' },
  { char: 'ג', name: 'Gimel', roman: 'g' },
  { char: 'ד', name: 'Dalet', roman: 'd' },
  { char: 'ה', name: 'Hey', roman: 'h' },
  { char: 'ו', name: 'Vav', roman: 'v / o / u', notes: 'v, and can stand for o or u (the o in שָׁלוֹם and אוֹרִי).' },
  { char: 'ז', name: 'Zayin', roman: 'z' },
  { char: 'ח', name: 'Chet', roman: 'ch', notes: 'Throaty ch, as in Scottish “loch”.' },
  { char: 'ט', name: 'Tet', roman: 't' },
  { char: 'י', name: 'Yod', roman: 'y / i', notes: 'y, and can stand for i. The smallest letter.' },
  { char: 'כ', name: 'Kaf / Chaf', roman: 'k / ch', alt: 'ך', notes: 'k with a dot inside, ch without (like bet and vet); final form ך.' },
  { char: 'ל', name: 'Lamed', roman: 'l', notes: 'The tallest letter: it rises above the others.' },
  { char: 'מ', name: 'Mem', roman: 'm', alt: 'ם', notes: 'm; final form ם (the last letter of שָׁלוֹם).' },
  { char: 'נ', name: 'Nun', roman: 'n', alt: 'ן', notes: 'n; final form ן.' },
  { char: 'ס', name: 'Samech', roman: 's' },
  { char: 'ע', name: 'Ayin', roman: '(mostly silent)', notes: 'Mostly silent in modern speech.' },
  { char: 'פ', name: 'Pey / Fey', roman: 'p / f', alt: 'ף', notes: 'p with a dot inside, f without (like bet and vet); final form ף.' },
  { char: 'צ', name: 'Tsadi', roman: 'ts', alt: 'ץ', notes: 'ts; final form ץ.' },
  { char: 'ק', name: 'Kuf', roman: 'k' },
  { char: 'ר', name: 'Resh', roman: 'r' },
  { char: 'ש', name: 'Shin / Sin', roman: 'sh / s', notes: 'sh with the dot on the right, s with the dot on the left.' },
  { char: 'ת', name: 'Tav', roman: 't' },
];

export const HEBREW_COURSE: LanguageCourse = {
  id: 'hebrew',
  lang: 'he',
  title: 'Ori’s Alef-Bet',
  quests: ['LH1', 'LH2', 'LH3', 'LH4', 'LH5', 'LH6'],
  vocab: VOCAB,
  script: { name: 'Hebrew alef-bet', direction: 'right to left', chars: SCRIPT },
  notes: [
    'Hebrew is written right to left. It has 22 letters and no capital letters. Vowels are small dots and lines (niqqud): children’s books use them, adults mostly leave them out.',
    'Five letters have a different shape at the end of a word: ך ם ן ף ץ. Stress usually falls on the last syllable; exceptions are marked in sayIt.',
    '“Ch” and “kh” are the throaty sound in Scottish “loch”.',
    'Numbers are the forms used when counting aloud. Colours are the masculine forms used to name a colour. Feelings and “friend” have a boy form and a girl form; “how are you?” changes for a boy or a girl.',
    '`native` is the vetted spelling with niqqud and is the only form used in scenes. `plain` is the no-niqqud spelling as adults write it, using the usual full spelling (extra vav or yod); plain forms were not in the vetted list, so have the native-speaker reviewer confirm them when recording audio.',
    'Every `audio` clip (he/<slug>) is a native-speaker recording. Do not synthesise.',
    'Nubbin reactions once a word is learned: shalom (wave), toda (little bow of the head), laila tov (yawn), kochav (look up), yareach (look up and sway), the colour words (point at something that colour), sameach/smecha (big smile), atsuv/atsuva (droop), ayef/ayefa (yawn and sit), the animal words (act them out at the LH6 party).',
    'The script primer: show the 22 letters right to left in rows, with final forms (alt) beside their letters. Tracing goes right to left.',
  ].join(' '),
};

export const CHECKS: string[] = [
  'lang:he:greet:ori',
  'lang:he:teach:nubbins:shalom:3',
  'lang:he:say:laila-tov',
  'lang:he:find:letters:shalom',
  'lang:he:trace:alef-bet',
  'lang:he:write:ori',
  'lang:he:count:plums:10',
  'lang:he:minigame:count-goals',
  'lang:he:count:stars:10',
  'lang:he:sort:fruit:colour',
  'lang:he:fetch:colour:adom',
  'lang:he:paint:fence:3',
  'lang:he:read:letter:1',
  'lang:he:draw:family',
  'lang:he:say:feeling',
  'talk:ori:tu-bishvat',
  'lang:he:plant:almond',
  'lang:he:review:party',
];
