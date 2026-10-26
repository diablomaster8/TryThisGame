/**
 * The Learning Grove, reader band (ages 7–10): side stories S13, S19 and S22.
 *
 *   S13 The Mill Cellar      how a watermill works (water power, gears, 4-PS3-4); an old ledger as a
 *                            historical source (D2.His.2.K-2); family patterns and choosing differently (think)
 *   S19 Cinder’s Last Light  forgiveness (think); snow, melting and cold up high (general, safe terms);
 *                            grief and staying with someone at the end
 *   S22 The Climb            worry and ways to cope (CASEL: Self-management); climbing safety;
 *                            contour lines and heights on a map; the view as a map
 *
 * One EduScene per original scene (step scenes, done scenes, complete scenes). The variant scenes
 * from SIDE_STORIES_NEW_3_VARIANTS (s13-letter-given, s13-letter-nomoss, s13-settled-burned,
 * s13-settled-grave, s13-settled-grave-nomoss, the five s19-*-sable scenes and the five s19-*-alone
 * scenes) live in
 * EDU_SIDE_NEW_3_READER_VARIANTS. The end-epi-* epilogue scenes are covered elsewhere.
 *
 * Every choice keeps its original id, `set` and `friendship`; reader keeps every choice.
 * Scene-level `set` flags (s19-with on s19-warmth / s19-warmth-sable / s19-warmth-alone, s13-given on
 * s13-letter-given) live on the original scenes; EduScene has no `set`, so the sim must still apply
 * the original scene’s flags.
 *
 * Shared scenes stay shared: s19-marina, s19-sit, s19-after and s19-complete play in all three
 * versions of S19 (Moss, Sable, alone), so they never name Moss or Sable.
 *
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
const M = say('moss');
const C = say('corvin');
const MA = say('marina');
const NO = say('nova');
const T = say('tobin');
const AL = say('aldous');
const CI = say('cinder');
const WO = say('worry');

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

// ================================================================== S13 The Mill Cellar: shared pieces
/** Aldous Vale’s unsent letter, for s13-letter and s13-letter-nomoss. */
const S13_LETTER: Line[] = [
  N('The paper is good paper, the kind you’d buy for something that mattered. You unfold it.'),
  AL('Corvin.'),
  AL('I have started this nine times. The other eight went in the stove. You’d say that was waste. You’d be right. I taught you that.'),
  AL('They say you did a wrong thing at Hazel’s Grove, and left in the night. I don’t know what. I know how.'),
  AL('Quickly. In the dark. Without once sitting down to think. I know whose hands those were. They were mine first.'),
  AL('I can tell you the weight of every sack this mill ground the year you were born. I can’t tell you what you laughed at.'),
  AL('Your mother used to sit by the mill race in the evenings, with her feet in the water. I called it idling.'),
  AL('I would give the whole mill to sit there once with her now.'),
  AL('I won’t say sorry. I don’t know how. You’d only hear it as one more order, because I gave you so many.'),
  AL('I’ve stopped the wheel. It’s very quiet. I think you’d hate it. I think you’d get used to it.'),
  AL('If you ever stop, stop here. You could sit as long as you liked. Nobody would count.'),
  AL('Your father.'),
  N('…'),
  T('“Nobody would count.” He counted everything. His own boy’s hours, in a book. And then he wrote that.', 'sad'),
  T('The boy copied his father’s rules. And his father stopped the wheel, in the end. Late. But he chose.', 'think'),
  T('It isn’t mine to decide what happens to it. It never was. I only held the door shut.', 'soft'),
];

const S13_LETTER_LESSONS: LessonIn[] = [
  {
    domain: 'literacy',
    skill: 'work out what a metaphor really means',
    standard: 'L.4.5',
    kind: 'ask',
    after: 11,
    prompt: [
      N('Aldous writes: “I know whose hands those were. They were mine first.”'),
      N('He doesn’t mean real hands. What is he really saying?'),
    ],
    options: [
      {
        label: 'Corvin learned his rushing, cold way of doing things from his father.',
        best: true,
        reply: [
          N('Yes. Here “hands” stands for a way of doing things. Saying one thing to mean another is called a metaphor.'),
          N('Aldous is owning up: Corvin learned it from him.'),
        ],
      },
      {
        label: 'Corvin borrowed his father’s gloves.',
        reply: [N('Ha! Not quite. Here “hands” means how someone does things. Aldous means: you do things my way, quick and in the dark.')],
      },
      {
        label: 'Aldous wants his hands back.',
        reply: [
          N('It’s a metaphor, so it isn’t about real hands at all. “Hands” means a way of doing things.'),
          N('Aldous is saying Corvin learned his ways from him.'),
        ],
      },
    ],
    parentNote: 'Worked out the meaning of a metaphor in a letter (“they were mine first”).',
  },
];

const S13_KEEP: Choice = {
  id: 'kept',
  label: 'Keep it for Corvin. Give it to him when he can feel again.',
  set: { millLetter: 'kept' },
  then: [
    N('You fold it along its old folds and put it inside your coat, next to Hazel’s notebook.'),
    T('When he can feel again. Yes. Cold hands can’t hold a thing like that. It would slip straight through them.', 'think'),
    T('You’ll know when. Your grandmother always knew when. It was infuriating.', 'soft'),
  ],
};
const S13_BURN: Choice = {
  id: 'burned',
  label: 'Burn it, the way Aldous burned the other eight.',
  set: { millLetter: 'burned' },
  then: [
    T('…That’s a real answer. I’ve thought it myself, most winters.', 'think'),
    T('He wrote nine and burned eight. You’d only be finishing what he started.', 'soft'),
  ],
};
const S13_GRAVE: Choice = {
  id: 'grave',
  label: 'Read it to Moss, and leave it on Aldous’s grave.',
  set: { millLetter: 'grave' },
  then: [
    T('Read to the old one, and left with the man. Yes.', 'think'),
    T('Nobody ever read Aldous anything. He never had the time to listen. He has now.', 'soft'),
  ],
};
const S13_GRAVE_NOMOSS: Choice = {
  id: 'grave',
  label: 'Read it aloud at Aldous’s grave, and leave it there.',
  set: { millLetter: 'grave' },
  then: [
    T('Read aloud, and left with the man. Yes.', 'think'),
    T('Nobody ever read Aldous anything. He never had the time to listen. He has now.', 'soft'),
  ],
};

const S13_GRAVE_START: Line[] = [
  N('Aldous Vale is buried under the alder trees by the mill race, where his wife used to sit with her feet in the water.'),
  N('The race is running high and brown. An alder drops a yellow leaf on the stone, and then another, as if it’s keeping count.'),
];
const S13_GRAVE_END: Line[] = [
  N('You weigh the letter down on the grave with a flat stone from the race.'),
  N('Tobin takes his hat off, and then can’t remember why, and puts it back on.'),
];

const S13_DECIDUOUS: LessonIn = {
  domain: 'science',
  skill: 'deciduous trees drop their leaves in autumn',
  kind: 'notice',
  after: 1,
  lines: [
    N('Alders, like oaks and beeches, drop their leaves in autumn and grow new ones in spring.'),
    N('Trees that do this are called deciduous. The leaves on the grave are this year’s, finished with.'),
  ],
  parentNote: 'Learned that deciduous trees, like alders, drop their leaves in autumn and grow new ones in spring.',
};

// ================================================================== S13 scenes
const S13_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: Tobin at the mill
  scene(
    's13-tobin',
    [
      N('Autumn. Below the falls the river runs brown and loud. The old mill leans over it like a man trying to hear something in the water.'),
      N('Its great wheel hasn’t turned in twenty years. Moss sits on the old millstone by the door. It’s the only thing here he approves of.'),
      N('A very old man in a lamplighter’s coat is unlocking the door with a key the size of a ladle.'),
      T('Hazel’s grandchild. Thought so. You’ve got her chin, and her habit of standing exactly where I’m about to swing a door.'),
      T('Tobin. I lit the lamps in this valley for fifty-one years. Every lane, every bridge, every dusk.', 'happy'),
      T('Then they put in new lamps that light themselves, and I was free to tell stories full time. Nobody’s thanked them for that.'),
      T('This was Aldous Vale’s mill. Corvin Vale’s father. Yes, that Corvin. Him with the cold garden.', 'think'),
      T('There’s a cellar under it. Four levels, going down. I’ve kept it shut for twenty years.'),
      T('But the river’s getting in. By spring it’ll have the lot. Somebody ought to see what’s down there first.'),
      T('There was one winter, the year of the Three Hats, when the wheel ran so hard the floor smoked, and—', 'happy'),
      N('He stops. He looks at the door. He looks at you.'),
      T('Where was I? Cellar. Yes. Dark.', 'think'),
      M('He has been telling that one since before you were born. He has never once reached the end.', 'soft'),
      T('I heard that, Moss. I reach the end all the time. I just don’t bring anyone with me.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'spot a simile and say what it helps you picture',
        standard: 'L.4.5',
        kind: 'ask',
        after: 0,
        prompt: [
          N('The mill “leans over the river like a man trying to hear something”. A comparison that uses “like” or “as” is called a simile.'),
          N('What does this simile help you picture?'),
        ],
        options: [
          {
            label: 'The mill is tipped forward, bent over the water.',
            best: true,
            reply: [N('Yes. Picture someone bending close to listen. The old mill is bent the same way, over the river.')],
          },
          {
            label: 'The mill can really hear things.',
            reply: [N('It’s a fun thought, but a simile only compares. The mill isn’t listening. It leans the way a listening man leans.')],
          },
          {
            label: 'The mill is very noisy.',
            reply: [N('The river is noisy! But this simile is about shape. The mill is bent over the water, like someone leaning in to hear.')],
          },
        ],
        parentNote: 'Recognised a simile and described the picture it creates.',
      },
      {
        domain: 'science',
        skill: 'how a watermill turns moving water into work',
        standard: '4-PS3-4',
        kind: 'notice',
        after: 13,
        lines: [
          M('Before you go down, learn what’s above you. A mill turns moving water into work.', 'think'),
          M('The river pushes the paddles on the wheel, and the wheel turns. The wheel turns an axle, and gears pass the turning along.'),
          M('At the end, a heavy millstone spins on top of a still one. Grain caught between them is crushed into flour.'),
        ],
        parentNote: 'Learned how a watermill changes the energy of moving water into turning that grinds grain into flour.',
      },
    ],
  ),
  // ------------------------------------------------ step 1 done: level one, the grain store
  scene(
    's13-level1',
    [
      N('Level one: the grain store. Sacks are piled to the ceiling, gone hard as stone. The air tastes of old flour and mouse.'),
      N('Something scrabbles in the dark. Then a great many somethings.'),
      T('Rats. Mill rats. Very organised.', 'think'),
      T('Aldous used to say they were the only staff who never asked for a day off.'),
      N('Dozens of small noses twitch at you from the shadows. They have smelt you already.'),
      N('Somewhere behind the sacks is the hatch to level two. The rats are between you and it.'),
      N('The rats sort themselves into eight neat groups of five. One rat in the wrong group is gently moved.'),
    ],
    [
      {
        domain: 'science',
        skill: 'how rats use their senses in the dark',
        standard: '4-LS1-2',
        kind: 'notice',
        after: 4,
        lines: [
          T('Rats don’t see sharply, but their sense of smell is excellent. They smell food long before they see it.', 'think'),
          T('Their whiskers help too. They feel their way along walls with them, in the pitch dark.'),
        ],
        parentNote: 'Learned how rats use smell and whiskers to find food and find their way in the dark.',
      },
      {
        domain: 'maths',
        skill: 'share equally (division)',
        standard: '3.OA.A.3',
        kind: 'ask',
        after: 5,
        prompt: [
          T('I make it forty rats. You’ve eight plums in your bag.'),
          T('If they share fairly, how many rats get each plum?'),
        ],
        options: [
          {
            label: '5 rats to each plum',
            best: true,
            reply: [T('Five. Forty shared into eight groups is five in each, because 8 × 5 = 40. Very fair. Rats respect fair.', 'happy')],
          },
          {
            label: '8 rats to each plum',
            reply: [
              T('Let’s check. 8 plums with 8 rats each would be 8 × 8 = 64 rats. Too many!'),
              T('We need 8 × something = 40. That’s 5. Five rats to a plum.'),
            ],
          },
          {
            label: '4 rats to each plum',
            reply: [T('Close. 8 × 4 is only 32, so eight rats would get nothing. 8 × 5 = 40, so it’s five rats to a plum.')],
          },
        ],
        parentNote: 'Divided 40 by 8 by thinking about equal groups and multiplication.',
      },
    ],
    [
      {
        id: 'fed',
        label: 'Roll them some fruit, and walk past while they eat.',
        set: { 's13-rats': 'fed' },
        then: [
          N('You roll your plums into the dark. Forty small faces turn to them at once, like a choir turning to its conductor.'),
          N('You walk straight past. Not one rat looks up.'),
          T('Bribery. Your grandmother’s method. Works on rats and parish councils.', 'happy'),
        ],
      },
      {
        id: 'crept',
        label: 'Shade your lantern and creep along the wall.',
        set: { 's13-rats': 'crept' },
        then: [
          N('You creep along the wall in the dark, one step at a time.'),
          N('A rat sits on your boot for a while. It decides you are furniture.'),
          N('Behind you, Tobin creeps too. He is whispering a story about a much bigger rat, very loudly.'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 2: the hatch and the sluice room
  scene(
    's13-sluice',
    [
      N('The old hoist lifts the hard sacks with a shriek. Under them is a hatch, and three things nobody has touched in twenty years.'),
      T('Loot. That’s the proper word for it. I had it off a pedlar.', 'happy'),
      T('A ladle. Plain, that. Look at it. The Gently Used Ladle of Second Thoughts.'),
      T('A sock. Also Plain. The Sock of Uncertain Origin. Don’t ask it where it’s been.'),
      T('And the cheese rind the rats were guarding. Oh, that’s Fine, that is. The Rat-Nibbled Cheese Rind of Courage.', 'happy'),
      N('A Nubbin from the Grove has followed you down. It licks the Cheese Rind of Courage. It is very brave about it.'),
      Y('Does everything get a name?'),
      T('Everything found in a cellar gets a name. It’s the rule. I made it up just now, and it’s very old.'),
      N('Below the hatch you can hear water. Not running. Just lying there in the dark, breathing.'),
      T('Level two’s the sluice room. It’s been flooded since Aldous went.', 'think'),
      T('There are three gates, one above another down the wall. Open them in the wrong order and you’ll be swimming.'),
      T('Marina could swim it. Marina could swim a soup.'),
    ],
    [
      {
        domain: 'science',
        skill: 'water flows downhill because gravity pulls it',
        kind: 'ask',
        after: 10,
        prompt: [
          T('Three gates: a low one, a middle one and a top one. The water has to go out through them, down to the river.'),
          T('Which gate do you open first?'),
        ],
        options: [
          {
            label: 'The lowest gate.',
            best: true,
            reply: [
              T('Right. Water always flows downhill, pulled by gravity. Open the bottom gate first and the water has somewhere lower to go.'),
              T('Then the middle, then the top, and the room drains instead of filling.'),
            ],
          },
          {
            label: 'The top gate.',
            reply: [
              T('Then the top water pours down into the room, and the low gate is still shut. Splash.'),
              T('Water flows downhill, pulled by gravity. Give it a way out at the bottom first.'),
            ],
          },
          {
            label: 'The middle gate.',
            reply: [
              T('Better than the top, but the water below it still has nowhere to go.'),
              T('Water flows downhill, pulled by gravity. Open the lowest gate first, so it can drain away.'),
            ],
          },
        ],
        parentNote: 'Used the idea that water flows downhill (because of gravity) to solve the sluice-gate puzzle.',
      },
      {
        domain: 'literacy',
        skill: 'spot exaggeration used to be funny',
        kind: 'ask',
        after: 11,
        prompt: [N('Tobin says “Marina could swim a soup.” Does he mean it?')],
        options: [
          {
            label: 'No. It’s a joke that means she’s a brilliant swimmer.',
            best: true,
            reply: [
              N('That’s it. Saying something much bigger than the truth, to make a point, is called exaggeration.'),
              N('Nobody can swim in soup. Probably.'),
            ],
          },
          {
            label: 'Yes. Marina really swims in soup.',
            reply: [
              N('Ha! Marina swims in the sea and the tide pools, not soup. Tobin is exaggerating: making it bigger than true, for fun.'),
              N('He means she can swim almost anywhere.'),
            ],
          },
        ],
        parentNote: 'Recognised exaggeration used for humour and explained what the speaker really meant.',
      },
    ],
  ),
  // ------------------------------------------------ step 2 done: level two, the chalk marks
  scene(
    's13-level2',
    [
      N('The last gate groans open. The water rushes out of the room with a long sigh, like a bath let out after twenty years.'),
      N('On the wet floor are two eels, very annoyed about it. One of them glares at Tobin.'),
      T('Don’t look at me. The Keeper opened the gates.'),
      N('And up one wall is a row of chalk marks. Somebody measured a boy here, year after year.'),
      N('Each mark has a number beside it. The lowest says 98 cm. The highest says 131 cm.'),
      N('Beside the last mark, in a square grown-up hand, someone has written: FIT FOR THE SLUICE.'),
      T('…'),
      T('Where was I.', 'sad'),
      N('He doesn’t say the rest. He goes on down the steps ahead of you, and he doesn’t look at the wall.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'find a difference in length by counting on',
        standard: '4.MD.A.2',
        kind: 'ask',
        after: 4,
        prompt: [N('The boy’s lowest mark is 98 cm. His highest is 131 cm.'), N('How much did he grow between the two?')],
        options: [
          {
            label: '33 cm',
            best: true,
            reply: [N('Yes. Count on: from 98 to 100 is 2, and from 100 to 131 is 31. 2 + 31 = 33 cm.')],
          },
          {
            label: '43 cm',
            reply: [N('Let’s count on carefully. From 98 to 100 is 2. From 100 to 131 is 31. 2 + 31 = 33 cm.')],
          },
          {
            label: '29 cm',
            reply: [N('Nearly. Count on from 98: 2 gets you to 100, then 31 more gets you to 131. That’s 33 cm.')],
          },
        ],
        parentNote: 'Found the difference between two lengths (131 cm and 98 cm) by counting on through 100.',
      },
      {
        domain: 'literacy',
        skill: 'use a clue to work out how a character sees someone',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 8,
        prompt: [N('Think about the words by the last mark: FIT FOR THE SLUICE.'), N('What do they tell you about how Aldous saw his son?')],
        options: [
          {
            label: 'He was checking when the boy was big enough to work.',
            best: true,
            reply: [
              N('Yes. Not “well done”, not even the boy’s name. He measured his son to see when he could work the sluice.'),
              N('Tobin’s silence tells you he finds that very sad.'),
            ],
          },
          {
            label: 'He was proud of how tall the boy was getting.',
            reply: [
              N('Maybe a little. But look at the words: “fit for the sluice” means ready to work it.'),
              N('He measured his son to see when he could be put to work. Tobin’s silence says how sad that is.'),
            ],
          },
          {
            label: 'He wanted to keep the boy away from the water.',
            reply: [
              N('It would be nice to think so. But “fit for the sluice” means ready to work at it.'),
              N('He was waiting until the boy could do the job.'),
            ],
          },
        ],
        parentNote: 'Used a written clue in the setting to infer how one character saw another.',
      },
    ],
  ),
  // ------------------------------------------------ step 3: the wheel pit
  scene(
    's13-wheelpit',
    [
      N('Drying on the steps, where the flood left them: a pair of boots, a doorknob with no door, and a scarf like pond weed.'),
      T('Squeaky Boots of Announcing Yourself. Fine. The Damp Doorknob of Not Quite Opening. Also Fine.', 'think'),
      T('And that’s Rare. The Soggy Scarf of Lingering Optimism. Wring it out all you like. It still thinks it’ll dry.', 'happy'),
      N('Level three is the wheel pit. The great wheel sits half in the cellar and half in the river, dripping.'),
      N('Behind it, iron gears as big as cartwheels fit together, tooth into tooth.'),
      N('The wheel doesn’t turn. Each time the river leans on it, the whole mill shudders, and dust comes down like flour.'),
      N('Up through the floorboards, Moss calls that he is staying on his millstone, thank you. He is far too old for underneath.'),
      T('Mind the wheel. It’s stuck, not dead. There’s a difference, and the difference is what takes your fingers off.'),
      T('The stair to the bottom is past the gears. Find what’s jamming them, and step round it.'),
    ],
    [
      {
        domain: 'science',
        skill: 'how gears pass turning along',
        kind: 'notice',
        after: 4,
        lines: [
          T('Gears pass turning from one wheel to the next. When two gears fit together, they turn opposite ways.', 'think'),
          T('And when a big gear turns a small one, the small one spins faster. That’s how a slow waterwheel turns a fast millstone.'),
        ],
        parentNote: 'Learned that meshing gears turn in opposite directions, and a big gear makes a small one spin faster.',
      },
      {
        domain: 'health',
        skill: 'stay safe around big machines',
        kind: 'ask',
        after: 7,
        prompt: [T('The wheel could lurch at any moment. What’s the safe way to act around a big machine that might move?')],
        options: [
          {
            label: 'Keep well back, and never put hands or feet near the moving parts.',
            best: true,
            reply: [T('Good. That’s how you keep all your fingers. And if you’re not sure a machine is safe, ask a grown-up first.')],
          },
          {
            label: 'Touch it to check whether it’s moving.',
            reply: [
              T('No touching! A machine can start without warning. Keep well back from moving parts.'),
              T('If you’re not sure it’s safe, ask a grown-up.'),
            ],
          },
          {
            label: 'Stand between the spokes to get a better look.',
            reply: [
              T('That’s the one place you must never stand. If the wheel lurches, the spokes come round.'),
              T('Keep well back, and keep hands and feet away from moving parts.'),
            ],
          },
        ],
        parentNote: 'Talked about keeping a safe distance from machines and asking a grown-up when unsure.',
      },
    ],
  ),
  // ------------------------------------------------ step 3 done: the wedge
  scene(
    's13-level3',
    [
      N('In the biggest gear, driven in hard, is a wooden wedge. It didn’t fall there. Somebody put it there.'),
      N('A tag hangs from it on a bit of string, in the same square hand: STOPPED. LEAVE IT.'),
      Y('Somebody wedged it on purpose.'),
      T('Aldous. His last winter.', 'sad'),
      T('Aldous died on that step, very old. Sitting down. First time anyone ever saw him sit.', 'sad'),
      T('It’s sad, and it’s all right to be sad. I sat down beside him a while, myself.', 'soft'),
      N('Past the wheel, a narrow stair goes down to an iron door. It is locked. The lock has been oiled.'),
      T('Not that one. Not yet.', 'soft'),
      T('There’s a thing you ought to know first, about Aldous’s son and your grandmother. It’s hers to tell, not mine.'),
      T('She wrote most things down. When you’ve read it, come back, and I’ll find the key.'),
      T('I know exactly where it is. That’s the trouble.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'use equal groups to solve a gear puzzle (division)',
        standard: '3.OA.A.3',
        kind: 'ask',
        after: 0,
        prompt: [
          N('The big gear has 48 teeth. The small gear it drives has 12.'),
          N('When the wheel turns again, each time the big gear goes round once, how many times will the small gear go round?'),
        ],
        options: [
          {
            label: '4 times',
            best: true,
            reply: [N('Yes. 48 teeth go past, and the small gear needs 12 for each turn. 48 ÷ 12 = 4, because 4 × 12 = 48.')],
          },
          {
            label: '12 times',
            reply: [
              N('12 is how many teeth the small gear has. Each turn uses up 12 of the big gear’s 48 teeth.'),
              N('48 ÷ 12 = 4. It goes round 4 times.'),
            ],
          },
          {
            label: '36 times',
            reply: [N('That’s 48 − 12. But we want how many twelves fit into 48: 12, 24, 36, 48. That’s 4 turns.')],
          },
        ],
        parentNote: 'Divided 48 by 12 using equal groups to work out how many times a small gear turns.',
      },
      {
        domain: 'science',
        skill: 'balanced forces mean no movement',
        standard: '3-PS2-1',
        kind: 'ask',
        after: 2,
        prompt: [N('Every few seconds the river pushes the wheel hard. But it doesn’t turn. Why not?')],
        options: [
          {
            label: 'The wedge pushes back just as hard, so the pushes balance.',
            best: true,
            reply: [
              N('Yes. When two pushes are equal and opposite, they are balanced, and nothing moves.'),
              N('Knock the wedge out, and the river’s push wins. The wheel turns.'),
            ],
          },
          {
            label: 'The river isn’t really pushing.',
            reply: [
              N('It is. You can feel the whole mill shudder. But the wedge pushes back equally.'),
              N('Balanced forces mean no movement.'),
            ],
          },
          {
            label: 'The wheel is too old to turn.',
            reply: [N('Tobin says it’s stuck, not dead. The wedge balances the river’s push. Take the wedge away and the wheel would turn.')],
          },
        ],
        parentNote: 'Explained that balanced forces (the river and the wedge) cause no movement.',
      },
    ],
  ),
  // ------------------------------------------------ step 4: the key
  scene(
    's13-key',
    [
      N('Later, when you have read Hazel’s notebook, you go back to the mill. Tobin is on the step, waiting.'),
      T('You know now, about Corvin and Hazel. I can see it on you.', 'soft'),
      T('He was her apprentice. Before that, he was this mill’s boy.'),
      T('I lit the lamp at that gate every dusk for thirty years. There was always a boy at the window. Working.', 'sad'),
      T('That’s the whole story. Short, isn’t it. It’s the only one I’ve ever finished.', 'sad'),
      N('He holds out a small iron key on a bootlace. It is warm from his pocket.'),
      T('I named the last of the stair loot while you were away. Couldn’t help it.'),
      T('A cog: the Cog of Tremendous Patience. Rare.'),
      T('My old lamp hook, which I lent Aldous one winter and never got back: the Lamplighter’s Hook of Talking Too Long. Storied.'),
      T('And a little hat cut from a broken grindstone. Somebody meant to hand that down, so it’s an heirloom. The Millstone Hat of Considerable Weight.'),
      T('Down we go. I’ll come with you. I’ve never been in. I’ve only ever kept it shut.', 'soft'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'compare how street lamps were lit in the past with today',
        standard: 'D2.His.2.K-2',
        kind: 'notice',
        after: 3,
        lines: [
          T('Before lamps lit themselves, every street lamp had to be lit by hand. That was a lamplighter’s job. Mine.', 'think'),
          T('I carried a long pole with a hook and a little flame on the end, to reach up high.'),
          T('Out at dusk to light them, back at dawn to put them out.'),
          T('Now they switch on by themselves. Quicker. Not as much company.', 'soft'),
        ],
        parentNote: 'Learned how street lamps were lit by hand in the past, and compared that with lights that switch on by themselves today.',
      },
      {
        domain: 'literacy',
        skill: 'build a name from a describing word, a noun and a feeling',
        kind: 'do',
        after: 9,
        check: 'edu:make:loot-name',
        lines: [
          T('Your turn. Every loot name has the same pattern. An odd describing word, a plain object, then “of” and a small feeling.', 'happy'),
          T('Find something in your pocket and name it. Say, the Crumpled Hanky of Mild Surprise.'),
          N('(Choose a describing word, an object and a feeling, and build your own loot name.)'),
        ],
        parentNote: 'Built a funny item name from an adjective, a noun and a feeling word, following a pattern.',
      },
    ],
  ),
  // ------------------------------------------------ step 4 done: the counting room
  scene(
    's13-desk',
    [
      N('The bottom room is small, dry and very cold.'),
      N('A desk. A chair pushed in square. A lamp with its wick trimmed.'),
      N('On the hook behind the door hang a miller’s apron, still floury, and a pocket watch. It stopped at four minutes past five.'),
      T('Five in the morning. That’s when the wheel started, every day of his life.', 'soft'),
      N('On the desk is a ledger. Inside the cover, in chalk, are three rules.'),
      N('ONE. THE WHEEL DOES NOT STOP. TWO. NOTHING IDLES. THREE. WHAT CANNOT KEEP UP IS LET GO.'),
      N('Under them, in a child’s careful hand, the same three rules are copied out again, with pencil lines to keep the letters straight.'),
      N('You turn the pages. Sacks, hours, men, wheel speed. Every year the hours go up. The word “rest” never appears.'),
      N('Near the back: “Boy, 12, put on the night shift. New method: the wheel never stops. Output up a third.”'),
      N('Tobin tries the chair. It creaks like a gate, and he stands straight back up.'),
      T('Even the chair won’t let you sit. That’s this mill all over.'),
      N('Folded inside the back cover is a letter. It was addressed, but never sent. The name on it is Corvin.'),
      T('I found it the day they found him. I read it. I shouldn’t have. Then I shut the door on it, so nobody else had to carry it.', 'sad'),
      T('Twenty years. It got heavy, keeping it from people. I didn’t know it would.', 'soft'),
    ],
    [
      {
        domain: 'maths',
        skill: 'read and write time to the minute',
        standard: '3.MD.A.1',
        kind: 'ask',
        after: 3,
        prompt: [N('The watch stopped at four minutes past five in the morning.'), N('Which clock time shows that?')],
        options: [
          {
            label: '5:04',
            best: true,
            reply: [N('Yes. The hour comes first, 5, then the minutes past it, 04. Four minutes past five is 5:04.')],
          },
          {
            label: '4:05',
            reply: [N('Careful: 4:05 is five minutes past four. The hour comes first. Four minutes past five is 5:04.')],
          },
          {
            label: '5:40',
            reply: [N('5:40 is forty minutes past five. We need just four minutes past, so it’s 5:04.')],
          },
        ],
        parentNote: 'Wrote “four minutes past five” as a digital time (5:04).',
      },
      {
        domain: 'social-studies',
        skill: 'use an old record book to learn about life in the past',
        standard: 'D2.His.2.K-2',
        kind: 'ask',
        after: 8,
        prompt: [
          N('A ledger is a record book. Old records like this help us find out how people lived in the past.'),
          N('What does this ledger tell you about life at the mill?'),
        ],
        options: [
          {
            label: 'People worked very long hours with no rest, even a boy of twelve.',
            best: true,
            reply: [
              T('That’s what it says, plain as chalk.', 'sad'),
              T('Long ago, in many places, children worked long hours in mills and factories. Today many countries have laws to stop that, and children go to school.'),
            ],
          },
          {
            label: 'The mill was a fun, relaxed place.',
            reply: [
              N('Look for the word “rest”. It never appears. The hours only go up, every year.'),
              N('The ledger shows hard work and no rest, even for a boy of twelve.'),
            ],
          },
          {
            label: 'Nothing. It’s only numbers.',
            reply: [
              N('Numbers tell stories too. Hours that only go up, and a boy of 12 on the night shift, tell us how hard life was there.'),
              N('That’s why historians read old ledgers.'),
            ],
          },
        ],
        parentNote: 'Used an old ledger as a historical source and compared children’s lives then and now.',
      },
    ],
  ),
  // ------------------------------------------------ step 5: the letter
  scene('s13-letter', S13_LETTER, S13_LETTER_LESSONS, [S13_KEEP, S13_BURN, S13_GRAVE]),
  // ------------------------------------------------ step 5 done (millLetter = kept)
  scene(
    's13-settled-kept',
    [
      N('At home you put the letter in the tin box under your bed, with Hazel’s letter.'),
      N('You look at the two side by side.'),
      N('Hazel’s writing leans, as if every word were walking uphill.'),
      N('His stands bolt upright, as if someone were watching.'),
      N('You check on the box more often than you need to.'),
      N('That seems to be part of carrying something for someone.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'use description to understand two characters',
        standard: 'RL.4.3',
        kind: 'ask',
        after: 3,
        prompt: [N('The two letters are written very differently. What do the descriptions tell you about Hazel and Aldous?')],
        options: [
          {
            label: 'Hazel kept going, steady and patient. Aldous was stiff and strict, as if always being checked.',
            best: true,
            reply: [
              N('Yes. Words walking uphill keep going even when it’s hard. Writing that stands bolt upright never relaxes.'),
              N('The writing is described so it shows the people.'),
            ],
          },
          {
            label: 'They both had messy writing.',
            reply: [
              N('The story doesn’t say messy. It says one leans uphill and one stands bolt upright.'),
              N('Those pictures show the people: Hazel steady and patient, Aldous stiff and strict.'),
            ],
          },
          {
            label: 'Nothing. Writing is just writing.',
            reply: [N('Writers often describe small things to show us big things. Leaning uphill shows Hazel’s patience; bolt upright shows Aldous’s strictness.')],
          },
        ],
        parentNote: 'Explained how a description of handwriting reveals two characters’ personalities.',
      },
      {
        domain: 'sel',
        skill: 'being trusted to keep something safe for someone',
        standard: 'CASEL: Responsible decision-making',
        kind: 'notice',
        after: 5,
        lines: [
          N('Keeping something safe for someone else is a kind of promise.'),
          N('It means looking after it, keeping it private, and handing it over when the time is right.'),
        ],
        parentNote: 'Thought about the responsibility of keeping something safe for another person.',
      },
    ],
  ),
  // ------------------------------------------------ complete
  scene(
    's13-complete',
    [
      N('A week later, Tobin brings the apron and the stopped watch up from the bottom room, and gives them to you.'),
      T('Heirlooms. Somebody meant to hand them down. He just never stopped long enough to do it.', 'soft'),
      N('Then he knocks the wedge out of the great gear with a mallet and a short speech.'),
      N('The wheel turns. Slowly. Not at Aldous’s speed: at the river’s.'),
      N('Water drips off each paddle as it comes round, taking its time.'),
      T('There. It goes as fast as the river feels like, and not a turn faster. Nobody’s counting.', 'happy'),
      T('Bring your seeds down. It grinds a lovely flour. Nubbins go mad for a flour treat. Don’t give them six, like I did.'),
      T('And come and sit, when you like. I’ve a story about the year of the Three Hats. I’ll get to the end of it one day.', 'soft'),
      T('Where was I?', 'think'),
      Y('Mill. Yes. Light.'),
      N('Tobin looks at you for a long moment. Then he laughs until he has to sit down on the millstone.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'read a tally chart and find the total',
        standard: '2.MD.D.10',
        kind: 'ask',
        after: 1,
        prompt: [
          N('You tip out all your cellar loot to count it. Your tally chart says:'),
          N('Plain: 2. Fine: 3. Rare: 2. Storied: 2. Heirloom: 3.'),
          N('How many pieces of loot did you find altogether?'),
        ],
        options: [
          {
            label: '12',
            best: true,
            reply: [N('Yes. 2 + 3 + 2 + 2 + 3 = 12. Twelve pieces, from a ladle to a pocket watch.')],
          },
          {
            label: '10',
            reply: [N('Let’s add them one tier at a time: 2, then 5, then 7, then 9, then 12. Twelve pieces.')],
          },
          {
            label: '13',
            reply: [N('Just one too many. 2 + 3 + 2 + 2 + 3 = 12.')],
          },
        ],
        parentNote: 'Read a tally chart of five groups and added them to find the total (12).',
      },
      {
        domain: 'science',
        skill: 'flour is made from ground-up seeds',
        kind: 'notice',
        after: 6,
        lines: [
          T('Flour is just seeds, ground to powder. Wheat flour comes from the seeds of the wheat plant, called grains.', 'think'),
          T('Most of a seed is food stored up for the baby plant. That’s why flour is so filling. Hence: not six.'),
        ],
        parentNote: 'Learned that flour is made by grinding seeds, which store food for a new plant.',
      },
      {
        domain: 'sel',
        skill: 'think about rest, work and what we would say to someone who never stopped (think question)',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 7,
        prompt: [
          N('Aldous never stopped working, and he never said what he felt. Think about the letter, and the quiet wheel.'),
          N('What would you tell him, if you could?'),
        ],
        options: [
          {
            label: 'Rest is allowed. The work will still be there.',
            reply: [T('That’s a kind thing to say, and a fair one. He’d have argued, I think. Then he’d have gone very quiet.', 'soft')],
          },
          {
            label: 'Tell your son you love him, before anything else.',
            reply: [T('Aye. He wrote it in the end. Late. Saying it sooner would have cost him nothing but nerve.', 'soft')],
          },
          {
            label: 'I’d just sit with him, and say nothing.',
            reply: [T('That’s the one he never had. I think that might be the best answer of all. Or the hardest.', 'think')],
          },
        ],
        parentNote: 'Thought about what to say to someone who worked without rest and found it hard to say what he felt (a think question with no single right answer).',
      },
    ],
  ),
];

const S13: EduQuest = {
  id: 'reader:s13',
  of: 's13',
  band: 'reader',
  title: 'The Mill Cellar',
  goals: {
    's13-step1': {
      goal: 'Get past the rats in the grain store, and find the hatch to level two.',
      hint: 'Feed the rats, or creep past them along the wall. The hatch is under the sacks. The old hoist will lift them.',
    },
    's13-step2': {
      goal: 'Drain the flooded sluice room. Open its three gates in the right order.',
      hint: 'Water flows downhill. Open the lowest gate first, then the middle, then the top, or the room fills again.',
    },
    's13-step3': {
      goal: 'Find what is jamming the great wheel, and get past it to the bottom stair.',
      hint: 'Watch which gear shudders when the river pushes. Never stand between the spokes.',
    },
    's13-step4': {
      goal: 'Unlock the iron door and go down to the bottom of the cellar with Tobin.',
      hint: 'Use Tobin’s key on the iron door past the wheel pit. Take a lantern: there’s no light down there.',
    },
    's13-step5': {
      goal: 'Do what you decided with Aldous’s letter.',
      hint: 'Keep it safe at home, burn it in the mill’s old stove, or take it to the grave under the alders by the race.',
    },
  },
  scenes: S13_SCENES,
  glossary: [
    gloss('lamplighter', 'A person whose job was to light the street lamps by hand every evening.', 's13-tobin'),
    gloss('cellar', 'A room under a building, below the ground.', 's13-tobin'),
    gloss('organised', 'Well planned and tidy, with everyone knowing their job.', 's13-level1'),
    gloss('bribery', 'Giving someone a treat so they will do what you want.', 's13-level1'),
    gloss('pedlar', 'Someone who travels about selling small things.', 's13-sluice'),
    gloss('sluice', 'A gate that controls how much water flows through a channel.', 's13-sluice'),
    gloss('optimism', 'The feeling that things will turn out well.', 's13-wheelpit'),
    gloss('shudders', 'Shakes suddenly and hard.', 's13-wheelpit'),
    gloss('wedge', 'A block that is thick at one end and thin at the other, pushed into a gap to hold something still.', 's13-level3'),
    gloss('apprentice', 'Someone who learns a job by working alongside an expert.', 's13-key'),
    gloss('heirloom', 'A precious thing handed down in a family, from older people to younger ones.', 's13-key'),
    gloss('ledger', 'A book where someone writes down numbers, such as money, sales or hours worked.', 's13-desk'),
    gloss('idles', 'Sits about doing nothing, or does no work.', 's13-desk'),
    gloss('mill race', 'The fast channel of water that runs to a mill and turns its wheel.', 's13-letter'),
    gloss('mallet', 'A hammer with a big wooden head.', 's13-complete'),
    gloss('stile', 'Steps or a gap that let people climb over a fence or wall.', 's13-letter-given'),
    gloss('chaff', 'The dry husks left over when grain is separated from the rest of the plant.', 's13-settled-burned'),
    gloss('deciduous', 'Describes trees that drop all their leaves in autumn and grow new ones in spring.', 's13-settled-grave'),
    gloss('headstone', 'A stone at one end of a grave, often with the person’s name on it.', 's13-settled-grave'),
  ],
  notes:
    'Lessons: how a watermill works (4-PS3-4), gears and balanced forces, water flowing downhill, rats’ senses, machine ' +
    'safety; 40 ÷ 8, 48 ÷ 12, counting on from 98 to 131, 5:04, a loot tally chart (12); simile, exaggeration, metaphor, ' +
    'character inference; lamplighters and an old ledger as historical sources (D2.His.2.K-2); burning as a change that ' +
    'can’t be undone; deciduous trees; grief and remembering. Think question (s13-letter and s13-letter-nomoss): must we ' +
    'turn out like the grown-ups who raised us? The do lesson (make a loot name) accepts any name. ' +
    'The ledger’s “Output up a third” is left as story, not a sum. The death of Aldous is stated plainly in s13-level3.',
};

// ================================================================== S13 variants
const S13_VARIANT_SCENES: EduScene[] = [
  // ------------------------------------------------ in S9, after s9-trowel, if millLetter = kept
  scene(
    's13-letter-given',
    [
      N('Hazel turns the trowel over in her lap. You think of the letter in the tin box under your bed, and slip in to fetch it.'),
      N('You go down the lane after him. Frost is coming down blue on the hedges, and your breath goes ahead of you.'),
      N('He is at the bend by the stile, his hands pushed under his arms. He keeps stopping to feel them.'),
      C('Hazel’s grandchild. Twice in one evening. People will talk.', 'think'),
      N('You hold out the letter. He sees the writing on the front, and doesn’t take it.'),
      C('That’s my father’s hand. He wrote as if he were being timed.', 'shock'),
      Y('It was in the mill cellar. Tobin kept it. Your father wrote it after you’d gone.'),
      N('He takes it. His fingers are clumsy with the cold still coming out of them. It takes him three goes to unfold it.'),
      N('He reads it by the last of the light. Then again, slower. You look at the hedge, so he doesn’t have to be looked at.'),
      C('“Nobody would count.”', 'soft'),
      C('He counted my hours at the sluice. In a book. I used to check his sums for him.', 'sad'),
      N('He folds the letter along its old folds, and puts it in his breast pocket, where the tin was for twenty-two years.'),
      N('His hand rests there. When it comes away, it doesn’t hurry.'),
      C('Thank you. I don’t know what else. Thank you.', 'soft'),
      N('He goes on down the lane. You walk back up to the cottage, where Hazel is still on the step.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'choose the right meaning of a multiple-meaning word',
        standard: 'L.3.4',
        kind: 'ask',
        after: 5,
        prompt: [N('Corvin says, “That’s my father’s hand.” “Hand” has more than one meaning.'), N('Which meaning does he use here?')],
        options: [
          {
            label: 'His handwriting.',
            best: true,
            reply: [N('Yes. Your “hand” can mean your handwriting. Corvin knows his father’s writing at a glance.')],
          },
          {
            label: 'His real hand, at the end of his arm.',
            reply: [N('That’s the usual meaning. But he’s looking at a letter, so here “hand” means handwriting.')],
          },
          {
            label: 'A helping hand.',
            reply: [N('Good thinking, that’s another meaning. But he’s looking at the writing on the front, so here it means handwriting.')],
          },
        ],
        parentNote: 'Used context to pick the right meaning of “hand” (handwriting).',
      },
      {
        domain: 'sel',
        skill: 'give someone privacy when they have a big feeling',
        standard: 'CASEL: Social awareness',
        kind: 'notice',
        after: 8,
        lines: [
          N('Sometimes the kindest thing is to look away for a moment.'),
          N('When someone is having a big feeling, a little privacy helps them feel safe. You stay close, but you don’t stare.'),
        ],
        parentNote: 'Noticed how giving someone privacy can be a way to show kindness and respect.',
      },
    ],
  ),
  // ------------------------------------------------ replaces s13-letter if Moss has left the world
  scene('s13-letter-nomoss', S13_LETTER, S13_LETTER_LESSONS, [S13_KEEP, S13_BURN, S13_GRAVE_NOMOSS]),
  // ------------------------------------------------ replaces s13-settled-kept (burned)
  scene(
    's13-settled-burned',
    [
      N('The mill’s old stove still draws. Tobin gets it going with a handful of chaff and a great deal of advice.'),
      N('He keeps charge of the stove door. You stand back from the heat, the way he tells you to.'),
      N('The letter catches at one corner. Then all of it goes at once, quickly, the way Aldous did everything.'),
      N('For a moment you can read “Your father” in the flame. Then you can’t.'),
      T('Nine. That’s all of them now.', 'soft'),
      N('Tobin sits on the step with you until the stove is cold. Neither of you counts how long.'),
    ],
    [
      {
        domain: 'science',
        skill: 'some changes from heating can’t be undone',
        standard: '2-PS1-4',
        kind: 'ask',
        after: 3,
        prompt: [N('When ice melts, you can freeze the water and get ice back.'), N('Can the ash and smoke ever turn back into the letter?')],
        options: [
          {
            label: 'No. Burning is a change that can’t be undone.',
            best: true,
            reply: [N('That’s right. Burning makes new things: ash, smoke and heat. Melting can be undone. Burning can’t.')],
          },
          {
            label: 'Yes, if you cool the ash down.',
            reply: [
              N('Cooling water turns it back into ice. But burning makes brand-new stuff: ash, smoke and heat.'),
              N('The paper is gone for good. Some changes can be undone, and some can’t.'),
            ],
          },
          {
            label: 'Only if you glue the ash together.',
            reply: [N('Ash would just be gluey ash! Burning changes paper into new things that can’t change back.')],
          },
        ],
        parentNote: 'Compared a change that can be undone (melting) with one that can’t (burning).',
      },
      {
        domain: 'sel',
        skill: 'notice mixed feelings after a big decision',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 5,
        lines: [
          N('After a big choice that can’t be undone, it’s normal to feel a mix of things: sad, relieved, unsure.'),
          N('Sitting quietly with someone you trust is a good way to let those feelings settle.'),
        ],
        parentNote: 'Learned that mixed feelings after a big decision are normal, and that quiet company helps.',
      },
    ],
  ),
  // ------------------------------------------------ replaces s13-settled-kept (grave)
  scene(
    's13-settled-grave',
    [
      ...S13_GRAVE_START,
      N('Moss sits on the headstone and shuts his eyes. You read the letter aloud. He listens the way he listens to rain.'),
      M('He’d have hated that. Being read to. Sitting still for it.', 'soft'),
      M('He sat still for it.', 'soft'),
      ...S13_GRAVE_END,
    ],
    [
      S13_DECIDUOUS,
      {
        domain: 'sel',
        skill: 'ways of saying goodbye to someone who has died',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 6,
        lines: [
          N('People say goodbye to someone who has died in lots of ways: visiting their grave, reading to them, or telling stories about them.'),
          N('None of these are wrong. They are all ways of remembering.'),
        ],
        parentNote: 'Learned some of the different ways people say goodbye to, and remember, someone who has died.',
      },
    ],
  ),
  // ------------------------------------------------ replaces s13-settled-kept (grave, Moss gone)
  scene(
    's13-settled-grave-nomoss',
    [
      ...S13_GRAVE_START,
      N('You read the letter aloud, the way you would have read it to Moss. Slowly, so the old one could keep up.'),
      N('You miss him. He would have sat on the headstone with his eyes shut.'),
      T('He’d have hated that. Being read to. Sitting still for it.', 'soft'),
      T('He sat still for it.', 'soft'),
      ...S13_GRAVE_END,
    ],
    [
      S13_DECIDUOUS,
      {
        domain: 'sel',
        skill: 'missing someone who has died',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 3,
        lines: [
          N('Missing someone who has died can come back suddenly, when you do something you used to do with them.'),
          N('That’s normal. Doing it the way they liked is one way of keeping them close.'),
        ],
        parentNote: 'Learned that missing someone who has died often returns at familiar moments, and that this is normal.',
      },
    ],
  ),
];

// ================================================================== S19 Cinder’s Last Light: shared pieces
const S19_HOLLOW_START: Line[] = [
  N('Near the top, the rock leans out over the snow like a hand held over a cup. Under it is a hollow, out of the wind.'),
  N('There is no snow in the hollow. There hasn’t been for a very long time, you think. The bare rock is dry, and faintly warm.'),
  N('In the middle of it, on a flat stone, is a light. Red. Smaller than a fingernail. Almost nothing.'),
  MA('I’ll be on the lip. Shout if you want the rope.', 'soft'),
  N('Marina goes back up to the lip without being asked. She turns her back, and looks at the view very hard.'),
];

const S19_MARINA_LOOKS_AWAY: LessonIn = {
  domain: 'sel',
  skill: 'notice when someone is giving others privacy',
  standard: 'CASEL: Social awareness',
  kind: 'ask',
  after: 4,
  prompt: [N('Marina turns her back without being asked. Why do you think she does that?')],
  options: [
    {
      label: 'To give you privacy for something important.',
      best: true,
      reply: [N('Yes. Marina can tell this moment matters. Stepping back so others can have it is a quiet kind of kindness.')],
    },
    {
      label: 'She’s bored of the hollow.',
      reply: [N('She says nothing about being bored. She went “without being asked”, and looks hard at the view. She’s giving you privacy.')],
    },
    {
      label: 'She’s cross with you.',
      reply: [N('Nothing she says sounds cross. She offers you the rope, then steps away. She’s giving you privacy, which is kind.')],
    },
  ],
  parentNote: 'Inferred that a character was giving others privacy, and why that is kind.',
};

const S19_GOES: Line[] = [
  N('The light gets smaller. It doesn’t flicker, the way the Long-Grass lantern used to. It just gets smaller, steadily.'),
  N('Like someone walking away up a long road, who turns round once to wave.'),
];
const S19_GONE: Line[] = [
  N('…'),
  N('Then there is only the flat stone, and the dry rock, and the wind going over.'),
  N('Cinder has faded. That means she has died. Her light has stopped, and it won’t start again.'),
];

const S19_SIMILE_GOES: LessonIn = {
  domain: 'literacy',
  skill: 'explain how a simile changes the feeling of a moment',
  standard: 'L.4.5',
  kind: 'ask',
  after: 10,
  prompt: [N('The light going is compared to “someone walking away up a long road, who turns round once to wave”.'), N('How does that simile make the moment feel?')],
  options: [
    {
      label: 'Gentle and sad, like a goodbye.',
      best: true,
      reply: [N('Yes. A wave is how you say goodbye to someone you love. The simile makes her going sad, but not frightening.')],
    },
    {
      label: 'Fast and scary.',
      reply: [N('A long road and a slow wave aren’t fast. The simile makes it feel gentle, like a goodbye.')],
    },
  ],
  parentNote: 'Explained how a simile shapes the feeling of a sad moment.',
};

const S19_SAFE_WELL = (who: (text: string, mood?: Mood) => Line): LessonIn => ({
  domain: 'literacy',
  skill: 'find the big idea (theme) of a story',
  standard: 'RL.4.2',
  kind: 'ask',
  after: 15,
  prompt: [N('Cinder asked if the Nubbins were “safe”. The answer was “well”. Those words aren’t the same.'), N('What is the difference?')],
  options: [
    {
      label: 'Safe means nothing can hurt you. Well means you’re free to live, and grow, and be happy.',
      best: true,
      reply: [
        who('Yes. Cinder kept them safe by keeping them still. But still isn’t living.', 'soft'),
        N('Safe is not the same as well. A big idea like that is called a theme.'),
      ],
    },
    {
      label: 'They mean exactly the same.',
      reply: [
        N('They can sound alike. But a Nubbin frozen still is safe from harm, and not well at all.'),
        N('Well means free to live and grow. That difference is the story’s theme.'),
      ],
    },
    {
      label: 'A well is a hole you get water from.',
      reply: [
        N('Ha! Different well. Here “well” means healthy and happy, free to live.'),
        N('Safe is not the same as well. That’s the story’s theme.'),
      ],
    },
  ],
  parentNote: 'Identified the story’s theme: being kept safe is not the same as being well.',
});

const S19_THINK_FORGIVE: LessonIn = {
  domain: 'sel',
  skill: 'think about who can forgive, and for whom',
  standard: 'CASEL: Relationship skills',
  kind: 'ask',
  after: 15,
  prompt: [
    N('Before you answer her, think about this.'),
    N('Can one person forgive someone on behalf of other people? Or can only the ones who were hurt forgive?'),
  ],
  options: [
    {
      label: 'Only the ones who were hurt can really forgive.',
      reply: [
        N('That’s a thoughtful answer. Many people believe forgiveness belongs to those who were hurt.'),
        N('You can still remember someone truthfully: the good they meant, and the harm they did.'),
      ],
    },
    {
      label: 'Someone who cares for them can forgive for them.',
      reply: [N('That’s a kind answer, and a fair one. A Keeper speaks for the Grove in lots of ways. Maybe this is one of them.')],
    },
    {
      label: 'I’m not sure. It’s hard.',
      reply: [N('Not being sure is honest. Grown-ups argue about this too. Whatever you say next, say it kindly.')],
    },
  ],
  parentNote: 'Thought about whether we can forgive on behalf of others (a think question with no single right answer).',
};

const s19Choices = (forgivenExtra: Line[], rememberedAsk: Line, rememberedExtra: Line[]): Choice[] => [
  {
    id: 'forgiven',
    label: '“You’re forgiven.”',
    set: { cinder: 'forgiven' },
    then: [
      Y('You’re forgiven.'),
      N('The light says nothing for a while. Then it turns the colour of a hearth when the door is shut and the kettle is on.'),
      CI('Oh.', 'soft'),
      CI('I didn’t know it would be so light. I thought being forgiven would be heavy. I thought I’d have to carry it.', 'soft'),
      ...forgivenExtra,
    ],
  },
  {
    id: 'remembered',
    label: '“It isn’t mine to forgive. But you’re remembered.”',
    set: { cinder: 'remembered' },
    then: [
      Y('It isn’t mine to forgive. But you’re remembered.'),
      N('The light holds very still.'),
      CI('Remembered.', 'think'),
      CI('That’s more than I asked for. It’s what I should have asked for.', 'soft'),
      rememberedAsk,
      Y('All of it.'),
      ...rememberedExtra,
    ],
  },
];

const S19_CHOICES_MOSS = s19Choices(
  [M('No. That’s the other thing about it. This one you just put down.', 'soft')],
  CI('Not the rhyme. Me. Will you tell them the rest? That I loved them?', 'soft'),
  [M('We are made of being remembered. I used to say that to her. She used to roll her eyes.', 'soft')],
);
const S19_CHOICES_SABLE = s19Choices(
  [N('Sable breathes out, long and slow, against the stone. The light warms her nose.')],
  CI('Will you tell them? That I loved them? Not only what I did.', 'soft'),
  [N('Beside her, the pale light that was Moss’s brightens once, the way he used to nod.')],
);
const S19_CHOICES_ALONE = s19Choices(
  [N('Up on the lip, Marina has given up pretending to look at the view.')],
  CI('Will you tell them? That I loved them? Not only what I did.', 'soft'),
  [N('The light holds on to your answer for a while, as if it were warming its hands on it.')],
);

const S19_ALTITUDE: LessonIn = {
  domain: 'science',
  skill: 'the higher up a mountain, the colder the air',
  kind: 'notice',
  after: 5,
  lines: [
    N('High up, the air is colder. The higher you climb a mountain, the colder it usually gets.'),
    N('That’s why snow stays on a high pass long after the valley has thawed. The tops of very high mountains keep snow all year.'),
  ],
  parentNote: 'Learned that air usually gets colder the higher up a mountain you go, so snow lasts longer up high.',
};

// ================================================================== S19 scenes
const S19_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: the warmth
  scene(
    's19-warmth',
    [
      N('Two days after the Long Night. The valley is white to the doorsteps, and very quiet.'),
      N('Moss sits on the cottage step, facing north, where the snowfield climbs to the high pass. He has sat like that since dawn.'),
      N('He is thinner than he was. On a bright morning you can see the step through him.'),
      M('There is something warm up there.', 'think'),
      M('There shouldn’t be. Nothing has been warm on the high pass since the White Year, the winter everything froze. Nothing.'),
      N('Up there, the snow is the blue of skimmed milk, and quite empty.'),
      M('I felt it at the Long Night, when we unmade the cold stone. Like a candle someone forgot, in a room you thought was dark.', 'soft'),
      M('I am too thin to climb. I am going anyway. You may carry me, if you would. In your coat. I won’t talk much.', 'soft'),
      M('That last part was a lie. Marina knows the path. Ask her.'),
    ],
    [
      S19_ALTITUDE,
      {
        domain: 'literacy',
        skill: 'use a character’s words to understand his personality',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 8,
        prompt: [N('Moss says, “That last part was a lie.” Which part does he mean?')],
        options: [
          {
            label: '“I won’t talk much.”',
            best: true,
            reply: [N('Yes! Moss is joking about himself. He knows he’ll chat the whole way up. Being able to laugh at yourself is a lovely trait.')],
          },
          {
            label: '“I am going anyway.”',
            reply: [N('He means that bit: he’s very determined. The lie is “I won’t talk much”. He’s joking about how chatty he is.')],
          },
          {
            label: '“Marina knows the path.”',
            reply: [N('That one’s true. He tells you to go and ask her. The lie is “I won’t talk much”, a joke about himself.')],
          },
        ],
        parentNote: 'Used a character’s joke about himself to understand his personality.',
      },
    ],
  ),
  // ------------------------------------------------ step 1 done: Marina
  scene(
    's19-marina',
    [
      N('Marina is knee-deep in a tide pool, with the ice broken round her and her sleeves rolled up, perfectly happy.'),
      MA('The high pass? In midwinter? Lovely. Bracing. You’ll hate it.', 'happy'),
      MA('All the water in this valley comes down off that snowfield. Somebody has to know where it starts. That’s me.'),
      MA('Nobody else goes up there. There’s nothing up there but wind and the view.', 'think'),
      MA('Boots, rope, two pairs of socks. First light tomorrow. Don’t be brave. Be careful.'),
      MA('Two pairs. I will check.'),
    ],
    [
      {
        domain: 'science',
        skill: 'snow melts into water that flows to the sea (the water cycle)',
        standard: '2-ESS2-3',
        kind: 'ask',
        after: 2,
        prompt: [MA('Here’s a riddle for you. How does snow on top of a mountain end up in my tide pools?', 'happy')],
        options: [
          {
            label: 'It melts, and the water runs down in streams and rivers to the sea.',
            best: true,
            reply: [
              MA('Exactly. Snow is frozen water. When it warms up, it melts, and the water runs downhill all the way to the sea.'),
              MA('Then the sun warms the sea, water rises into the sky as vapour, makes clouds, and falls again as rain or snow. Round and round.'),
            ],
          },
          {
            label: 'Somebody carries it down in buckets.',
            reply: [
              MA('Ha! That would be a lot of buckets. No: snow is frozen water. It melts, and the water runs downhill to the sea.', 'happy'),
              MA('Then it rises as vapour, makes clouds, and falls as snow again. That’s the water cycle.'),
            ],
          },
          {
            label: 'It doesn’t. It stays up there forever.',
            reply: [
              MA('Some of it stays a long time. But when snow warms up, it melts, and the water runs downhill to the sea.'),
              MA('Then it rises, makes clouds, and falls again. That’s the water cycle.'),
            ],
          },
        ],
        parentNote: 'Explained how melting snow flows to the sea, and how water cycles back up into clouds.',
      },
      {
        domain: 'health',
        skill: 'how layers keep you warm, and going out in snow safely',
        kind: 'notice',
        after: 5,
        lines: [
          MA('Layers keep you warm because they trap air between them, and trapped air holds your body’s heat in.'),
          MA('And a mountain in winter is only for going up with a grown-up who knows the way. Today, that’s me.'),
        ],
        parentNote: 'Learned why layers keep you warm, and that snowy mountains are only for going up with a grown-up who knows the way.',
      },
    ],
  ),
  // ------------------------------------------------ step 2: the climb
  scene(
    's19-climb',
    [
      N('First light. Marina ropes you to her. Then, after some thought, she ropes Moss to a button of your coat.'),
      N('He rides inside your coat, against your chest, with just his face out. He is facing you, not the mountain.'),
      N('He weighs about as much as a held breath.'),
      M('Left.', 'think'),
      MA('Right.'),
      M('Her right. My left. We are agreeing, in different directions.'),
      N('The snowfield is crusted on top and soft beneath. Every step goes through with a crunch like biting toast.'),
      MA('Lovely, isn’t it? That wind. That wind could peel an apple.', 'happy'),
      M('Your heart is very loud. I am not complaining. It’s warm.', 'soft'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'left and right depend on which way you face',
        standard: 'D2.Geo.2.K-2',
        kind: 'ask',
        after: 5,
        prompt: [
          N('Marina faces up the mountain. Moss faces you, so he faces the opposite way to her.'),
          N('When Marina says “right”, which way is that for Moss?'),
        ],
        options: [
          {
            label: 'His left.',
            best: true,
            reply: [
              M('Quite so. When two people face opposite ways, one person’s right is the other’s left.', 'happy'),
              M('That’s why maps use north, south, east and west. They stay the same whichever way you face.'),
            ],
          },
          {
            label: 'His right too.',
            reply: [
              N('Try it with a friend: face each other and both point right. You point opposite ways!'),
              N('So Marina’s right is Moss’s left. That’s why maps use north, south, east and west instead.'),
            ],
          },
          {
            label: 'Straight ahead.',
            reply: [N('Right is always to the side. But Moss faces the opposite way to Marina, so her right is his left.')],
          },
        ],
        parentNote: 'Worked out that left and right depend on which way you face, and why maps use compass directions.',
      },
      {
        domain: 'health',
        skill: 'why your heart beats faster when you exercise',
        kind: 'notice',
        after: 8,
        lines: [
          N('Climbing is hard work. Your muscles need more oxygen, so your heart beats faster to pump more blood to them.'),
          N('Your breathing speeds up too. When you rest, both slow down again.'),
        ],
        parentNote: 'Learned why the heart and breathing speed up during exercise and slow down with rest.',
      },
    ],
  ),
  // ------------------------------------------------ step 2 done: the hollow
  scene(
    's19-hollow',
    [
      ...S19_HOLLOW_START,
      N('Moss has gone completely still in your coat.'),
      M('…Cinder.', 'soft'),
      M('She was a warden, like me, long ago. She kept the high pass.', 'soft'),
      N('The red light doesn’t answer. It is too small to answer. It has kept itself barely alight for longer than the cottage has stood.'),
      M('She can’t hear us. Not yet. We speak only to those who sit still long enough. She taught me that, once.', 'soft'),
      M('Let me out. I’ll sit by her. You sit by me. We’ll wait.'),
    ],
    [
      {
        domain: 'science',
        skill: 'snow melts when it warms above freezing',
        standard: '2-PS1-4',
        kind: 'ask',
        after: 1,
        prompt: [
          N('Snow melts when it warms above 0 °C (32 °F). All around the hollow is deep snow. Inside, there is none.'),
          N('Why do you think there’s no snow in the hollow?'),
        ],
        options: [
          {
            label: 'The rock is warm, so snow melts, and the overhang keeps most snow off.',
            best: true,
            reply: [
              N('Good thinking. Warm rock melts any snow that lands, and the rock roof shelters the hollow from falling snow.'),
              N('Melting can be undone, too: if it got cold enough, the water would freeze again.'),
            ],
          },
          {
            label: 'Snow doesn’t like rock.',
            reply: [N('Snow lands on rock all over the mountain. This rock is warm, so the snow melts, and the overhang keeps most snow off.')],
          },
          {
            label: 'Someone swept it away.',
            reply: [N('Nobody comes up here. The rock is warm, so snow melts when it lands, and the overhang shelters the hollow.')],
          },
        ],
        parentNote: 'Explained why warm rock and shelter keep a place free of snow (melting above 0 °C).',
      },
      S19_MARINA_LOOKS_AWAY,
    ],
  ),
  // ------------------------------------------------ step 3: the wait (shared by both versions)
  scene(
    's19-sit',
    [
      N('You sit on the dry rock. The wind goes over the overhang with a sound like a long breath out.'),
      N('Below you lies the whole valley: the falls frozen white, smoke from the cottage, and four lantern posts too small to see.'),
      N('You wait. Nobody speaks. The red light stays very small.'),
      N('Your feet go cold.'),
      N('Your stomach growls into all that quiet, loud as a door in an empty house. Up on the lip, Marina coughs, very politely.'),
      N('You wriggle your toes inside your two pairs of socks, the way Marina showed you, and they warm up a little.'),
      N('You keep waiting. Waiting is the whole job today.'),
    ],
    [
      {
        domain: 'health',
        skill: 'notice cold fingers and toes and warm them up',
        kind: 'notice',
        after: 5,
        lines: [
          N('In real cold, fingers and toes get cold first. If they hurt or start to go numb, tell a grown-up and warm up straight away.'),
          N('Wriggling them, dry socks, gloves and a warm drink all help.'),
        ],
        parentNote: 'Learned to notice cold fingers and toes, warm them up, and tell a grown-up if they hurt or go numb.',
      },
      {
        domain: 'sel',
        skill: 'slow breathing to help you sit still and calm',
        standard: 'CASEL: Self-management',
        kind: 'do',
        after: 6,
        check: 'edu:breathe:slow:5',
        lines: [
          N('Sitting still is easier when you breathe slowly. Try it with the wind.'),
          N('(Breathe in slowly through your nose. Then breathe out, long and slow, like the wind over the rock. Do it five times.)'),
        ],
        parentNote: 'Practised five slow breaths to stay calm and still while waiting.',
      },
    ],
  ),
  // ------------------------------------------------ step 3 done: the question
  scene(
    's19-question',
    [
      N('After a long time, the light grows a little. Not brighter. Bigger, the way a coal does when you breathe on it.'),
      CI('Are they safe?', 'soft'),
      M('No. They’re well.', 'soft'),
      N('The light is quiet for a long time. You watch it understand. It takes the whole of her.'),
      CI('…Well. Well is better, isn’t it. I didn’t know there was a better.', 'sad'),
      CI('I loved them. It was so cold, and I couldn’t carry them all. So I made a way to carry them all.', 'sad'),
      CI('I was so frightened. I held them so tight. And they were so quiet, after. I told myself it was resting.'),
      CI('Do they still say my name, down there?'),
      Y('Cinder held them close and tight, kept them warm one winter night;'),
      Y('when the morning came to call, they did not move at all.'),
      CI('That’s fair. Do they skip well?', 'soft'),
      M('Badly. With great enthusiasm.', 'happy'),
      M('Cinder. I forgave you the first spring. I’ve carried it about ever since. Here. It’s yours.', 'soft'),
      CI('…Thank you, Moss. You’re the Keeper. You live down there, with the grey ones in the grass, and what I did.', 'soft'),
      CI('Am I forgiven? By the ones who have to live with it?', 'soft'),
      M('Don’t look at me. It isn’t mine to give. It never was.', 'soft'),
    ],
    [S19_SAFE_WELL(M), S19_THINK_FORGIVE],
    S19_CHOICES_MOSS,
  ),
  // ------------------------------------------------ step 4: after (shared by both versions)
  scene(
    's19-after',
    [
      N('The light is getting smaller. It isn’t going out. It’s going, the way the last of the day goes off a hill.'),
      CI('I kept myself alight so long. Just a little. Just in case there was news.', 'soft'),
      CI('There’s been news. I can stop now.', 'soft'),
      N('You understand what she means. Cinder is dying. When her light goes, it won’t come back.'),
      CI('Will you stay? You don’t have to do anything. Just stay.'),
      N('You stay where you are, on the dry rock.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'explain a character’s motive',
        standard: 'RL.3.3',
        kind: 'notice',
        after: 5,
        lines: [N('Cinder kept her light on for news of the Nubbins. Now she has it, and she can rest.')],
        parentNote: 'Understood why a character acted as she did, using her own words as evidence.',
      },
      {
        domain: 'sel',
        skill: 'being with someone who is dying',
        standard: 'CASEL: Social awareness',
        kind: 'notice',
        after: 5,
        lines: [
          N('When someone is dying, you don’t have to fix anything. Being there with them is a real kindness.'),
          N('It’s all right to feel sad, scared or very quiet at a time like this. All of those feelings are allowed.'),
        ],
        parentNote: 'Learned that simply being with someone at the end of their life is a real kindness, and that all feelings are allowed.',
      },
    ],
  ),
  // ------------------------------------------------ step 4 done: the fade
  scene(
    's19-fade',
    [
      N('You stay. Moss sits with his shoulder almost touching the light, the way he sat by his old friend Fossil’s flower in the rain.'),
      ...S19_GOES,
      CI('Moss. It isn’t cold.', 'soft'),
      M('No. Not this way.', 'soft'),
      ...S19_GONE,
      M('There.', 'soft'),
      M('That is fading done right. Not stilled. Let go.', 'soft'),
      N('He sits there a long time. You let him.'),
    ],
    [
      S19_SIMILE_GOES,
      {
        domain: 'sel',
        skill: 'understand grief and what helps',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 10,
        lines: [
          N('Grief is the sadness we feel when someone dies. It can come in waves, strong and then quieter.'),
          N('Sitting quietly, crying, talking about them, or being with a friend all help. There is no wrong way to grieve.'),
        ],
        parentNote: 'Learned what grief is and some of the things that help.',
      },
    ],
  ),
  // ------------------------------------------------ complete (shared by both versions)
  scene(
    's19-complete',
    [
      N('Where the light was, the flat stone is still warm. Not hot. Warm, like a hand that has only just let go of yours.'),
      N('There is a small red pebble on it that wasn’t there before. It is warm too. It stays warm all the way down the mountain.'),
      N('Marina is on the lip with the rope, looking at the view very hard. Her eyes are red. She says it’s the wind.'),
      MA('Lovely up here.', 'sad'),
      MA('Come on. Feet in my prints. Home before the light goes.', 'soft'),
      N('That night you stand by the Long-Grass lantern. It burns as it has every night since the Long Night.'),
      N('But it’s warm now, standing beside it. The other three never are.'),
      N('You put the red pebble on the windowsill. By morning the Nubbins are asleep in a heap under it. None of them will say why.'),
      N('One Nubbin licks the red pebble. It is not supper. It is warm, though.'),
    ],
    [
      {
        domain: 'science',
        skill: 'stone warms and cools slowly, and heat moves from warm to cool',
        standard: '4-PS3-2',
        kind: 'notice',
        after: 0,
        lines: [
          N('Stone warms up slowly and cools down slowly. That’s why a stone can stay warm for a while after the heat has gone.'),
          N('When you touch it, heat moves from the warm stone into your cooler hand. Heat always moves from warmer to cooler.'),
        ],
        parentNote: 'Learned that stone holds heat and cools slowly, and that heat moves from warmer things to cooler ones.',
      },
      {
        domain: 'literacy',
        skill: 'read a character’s real feelings behind her words',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 3,
        prompt: [N('Marina says her red eyes are from the wind. What do you think is really going on?')],
        options: [
          {
            label: 'She’s been crying, and doesn’t want a fuss.',
            best: true,
            reply: [N('That’s what I think too. She turned her back and looked hard at the view. Some people prefer to cry quietly.')],
          },
          {
            label: 'It really is the wind.',
            reply: [
              N('Cold wind can make eyes water. But she turned her back at the saddest moment, and says “Lovely up here” sadly.'),
              N('She’s been crying, quietly.'),
            ],
          },
          {
            label: 'She has a cold.',
            reply: [N('Nobody mentions a cold. Look at her clues: back turned, eyes red, a sad voice. She’s been crying, quietly.')],
          },
        ],
        parentNote: 'Used clues to see the feeling a character was hiding behind her words.',
      },
    ],
  ),
];

// ================================================================== S19 variants (Sable comes, Moss has faded)
const S19_VARIANT_SCENES: EduScene[] = [
  scene(
    's19-warmth-sable',
    [
      N('Two days after the Long Night. The valley is white to the doorsteps, and very quiet.'),
      N('Sable hasn’t eaten her breakfast. She sits at the top of the garden, facing north, where the snowfield climbs to the high pass.'),
      N('She has sat like that since dawn. When you come near, she doesn’t move away. She doesn’t look round, either.'),
      N('Beside her floats the pale light that was Moss’s. It stayed when Moss faded at the Long Night, when he died.'),
      N('The pale light leans north too, like a candle flame in a draught.'),
      N('Up there, the snow is the blue of skimmed milk, and quite empty. Then, for a moment, it isn’t: a speck of red, like a forgotten coal.'),
      N('Sable stands. She looks at you, then at the pass, then at you, the way she looks at a gate she wants opened.'),
      Y('All right. All right. We’ll ask Marina.'),
    ],
    [
      S19_ALTITUDE,
      {
        domain: 'literacy',
        skill: 'read what a character wants from her actions',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 7,
        prompt: [N('Sable never says a word. How do you know she wants to go up to the pass?')],
        options: [
          {
            label: 'She looks from you to the pass and back, like at a gate she wants opened.',
            best: true,
            reply: [N('Yes. Her eyes do the talking. Characters can show what they want through what they do, not only what they say.')],
          },
          {
            label: 'She tells you.',
            reply: [N('Sable doesn’t speak. But she looks from you to the pass and back, the way she asks for a gate. Her actions tell you.')],
          },
          {
            label: 'You can’t know.',
            reply: [N('You can, from clues! She skips breakfast, faces north, and looks from you to the pass and back. Her actions say it.')],
          },
        ],
        parentNote: 'Inferred what a non-speaking character wanted from her actions.',
      },
    ],
  ),
  scene(
    's19-climb-sable',
    [
      N('First light. Marina ropes you to her. Sable will not be roped.'),
      N('She goes ahead, a grey shape on the white, as if she knows the way.'),
      N('Moss’s pale light drifts along at her shoulder, where he used to walk.'),
      N('The snowfield is crusted on top and soft beneath. Each of your steps goes through with a crunch like biting toast.'),
      MA('Lovely, isn’t it? That wind. That wind could peel an apple.', 'happy'),
      N('Sable is light enough not to break the crust. She leaves a line of small prints, neat as stitches.'),
      MA('She’s not stopping. Is she always like this?'),
      Y('Only when it matters.'),
    ],
    [
      {
        domain: 'health',
        skill: 'staying safe together on a snowy mountain',
        kind: 'notice',
        after: 0,
        lines: [
          MA('On a snowy mountain, people rope together. If one slips, the others can hold them.'),
          MA('Only ever go up with a grown-up who knows the mountain, and stay close.'),
        ],
        parentNote: 'Learned why climbers rope together and stay close to a grown-up who knows the way.',
      },
      {
        domain: 'science',
        skill: 'spreading weight helps you stay on top of snow',
        kind: 'ask',
        after: 5,
        prompt: [N('Your boots break through the crust. Sable’s paws don’t. Why not?')],
        options: [
          {
            label: 'She’s lighter, and her weight is spread over four paws.',
            best: true,
            reply: [
              N('Yes. Less weight pressing on each bit of snow means the crust holds.'),
              N('That’s why snowshoes are wide: they spread a person’s weight out, so they sink less.'),
            ],
          },
          {
            label: 'She’s floating.',
            reply: [N('Not quite! She’s much lighter than you, and her weight is spread over four paws, so the crust holds her.')],
          },
          {
            label: 'Her paws are warmer.',
            reply: [N('Warm paws would melt snow, not help her stay up! It’s about weight: she’s light, and spread over four paws.')],
          },
        ],
        parentNote: 'Explained that lighter, spread-out weight sinks less into snow (why snowshoes work).',
      },
    ],
  ),
  scene(
    's19-hollow-sable',
    [
      ...S19_HOLLOW_START,
      N('You know whose light it is. Moss told you about Cinder once: a warden like him, from long ago.'),
      N('Sable goes into the hollow, and stops a tail’s length from the light. The fur lifts all along her back.'),
      N('She knows it. You don’t know how. Something in her knows the shape of the cold that was made here, and who made it.'),
      N('Moss’s pale light settles beside the red one. Two lights on a flat stone: one pale, one hardly there.'),
      N('You remember what Moss told you. Eternals only speak to those who sit still long enough.'),
    ],
    [
      S19_MARINA_LOOKS_AWAY,
      {
        domain: 'science',
        skill: 'animals’ fur can stand up when they are alarmed',
        standard: '4-LS1-1',
        kind: 'notice',
        after: 6,
        lines: [
          N('Many furry animals, like cats and dogs, raise the fur along their backs when they are alarmed or frightened.'),
          N('It makes them look bigger. Sable is telling you, without a word, that this place matters to her.'),
        ],
        parentNote: 'Learned that many animals raise their fur when alarmed, which makes them look bigger.',
      },
    ],
  ),
  scene(
    's19-question-sable',
    [
      N('After a long time, the light grows a little. Not brighter. Bigger, the way a coal does when you breathe on it.'),
      CI('Are they safe?', 'soft'),
      N('Nobody answers. Moss would have. You can feel the shape of what he’d say, as if he were sitting in your coat.'),
      Y('No. They’re well.'),
      N('The light is quiet for a long time. You watch it understand.'),
      CI('…Well. Well is better, isn’t it. I didn’t know there was a better.', 'sad'),
      N('Then the light sees Sable, grey from her ears to her tail.'),
      CI('Oh, little one. That grey is mine, isn’t it. I didn’t do it to you. But I did it.', 'sad'),
      CI('I loved them. It was so cold, and I was so frightened. I held them so tight.', 'sad'),
      N('Sable gets up and crosses the last of the stone, further than she has ever gone towards anything warm.'),
      N('She lies against the flat stone and leans her whole weight on it, the way she leant on your shin in the autumn.'),
      CI('She isn’t still. She’s grey, and she isn’t still. She came to me. Nobody made her. Who undid it?', 'soft'),
      Y('Everybody. Slowly.'),
      CI('She has forgiven me. I don’t know how I know. I know.', 'soft'),
      CI('You’re the Keeper. You live down there, with the grey ones in the grass, and what I did.'),
      CI('Am I forgiven? By the ones who have to live with it?', 'soft'),
    ],
    [S19_SAFE_WELL(N), S19_THINK_FORGIVE],
    S19_CHOICES_SABLE,
  ),
  scene(
    's19-fade-sable',
    [
      N('You stay. Sable doesn’t move from the stone. Moss’s pale light doesn’t either.'),
      ...S19_GOES,
      CI('Little one. It isn’t cold.', 'soft'),
      N('Sable shuts her eyes.'),
      ...S19_GONE,
      N('You hear Moss’s words in your own mouth before you know you’re going to say them.'),
      Y('That is fading done right. Not stilled. Let go.'),
      N('Sable stays curled against the stone a long time. You let her.'),
    ],
    [
      S19_SIMILE_GOES,
      {
        domain: 'sel',
        skill: 'remembering someone who has died by carrying their words',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 10,
        lines: [
          N('When someone we love has died, we often carry their sayings with us. Using their words is one way of remembering them.'),
          N('Moss used to say, “We are made of being remembered.” Today, you remembered him.'),
        ],
        parentNote: 'Thought about how using a loved one’s words is a way of remembering them after they have died.',
      },
    ],
  ),
];

// ================================================================== S19 variants (you and Marina only: Moss has faded, Sable not bonded)
const S19_ALONE_SCENES: EduScene[] = [
  scene(
    's19-warmth-alone',
    [
      N('Two days after the Long Night. The valley is white to the doorsteps, and very quiet.'),
      N('You are at the cottage window with a cup of tea when you see it: high on the pass, a speck of red, like a forgotten coal.'),
      N('You look away, and look back. It is still there, steady, in all that white.'),
      N('Nobody else is looking. Moss would have been. But Moss faded at the Long Night, which means he died.'),
      N('You still look round for him. Before you have quite decided anything, you are reaching for your boots.'),
      Y('Marina. Marina knows the path.'),
    ],
    [
      { ...S19_ALTITUDE, after: 2 },
      {
        domain: 'sel',
        skill: 'notice how missing someone shows up in small moments',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 4,
        lines: [
          N('When someone we love has died, we often miss them most in small moments: a seat they always sat in, a thing they would have spotted first.'),
          N('Looking round for them is part of grief. Doing what they would have done is one way of carrying them with you.'),
        ],
        parentNote: 'Talked about how grief shows up in small, everyday moments, and how doing what a loved one would have done can help.',
      },
    ],
  ),
  scene(
    's19-climb-alone',
    [
      N('First light. Marina ropes you to her, checks the knot twice, and then checks your socks.'),
      N('The snowfield is crusted on top and soft beneath. Every step goes through with a crunch like biting toast.'),
      MA('Lovely, isn’t it? That wind. That wind could peel an apple.', 'happy'),
      MA('What are we looking for, exactly?'),
      Y('Something warm.'),
      MA('Up here? Well. You’re Hazel’s. I gave up asking years ago.', 'think'),
    ],
    [
      {
        domain: 'maths',
        skill: 'multiplication as equal groups',
        standard: '3.OA.A.1',
        kind: 'ask',
        after: 0,
        prompt: [MA('Two pairs of socks, I said. A pair is two socks. So how many socks should I find on you?')],
        options: [
          {
            label: '4',
            best: true,
            reply: [MA('Four. Two pairs, two in each pair: 2 × 2 = 4. Two on each foot. You pass.', 'happy')],
          },
          {
            label: '2',
            reply: [MA('That’s one pair. I said two pairs. Two groups of two: 2 × 2 = 4 socks.')],
          },
          {
            label: '3',
            reply: [MA('Three socks would be a very odd foot. Two pairs is two groups of two: 2 × 2 = 4.')],
          },
        ],
        parentNote: 'Worked out 2 × 2 = 4 by thinking of pairs as equal groups.',
      },
      {
        domain: 'science',
        skill: 'melting and freezing again can make a hard crust on snow',
        standard: '2-PS1-4',
        kind: 'notice',
        after: 5,
        lines: [
          MA('That crust is sun and frost taking turns. By day the sun melts the top of the snow a little.'),
          MA('At night it freezes again, harder. Melting and freezing, over and over, and you get a lid on the snow.'),
        ],
        parentNote: 'Learned that snow can melt in the sun and refreeze at night, making a hard crust.',
      },
    ],
  ),
  scene(
    's19-hollow-alone',
    [
      ...S19_HOLLOW_START,
      N('You know whose light it is. Moss told you about Cinder once: a warden like him, from long ago.'),
      N('You go into the hollow on your own, and sit down a little way from the light.'),
      N('You remember something Moss told you once. Eternals only speak to those who sit still long enough.'),
    ],
    [
      S19_MARINA_LOOKS_AWAY,
      {
        domain: 'sel',
        skill: 'being brave on your own, and knowing help is near',
        standard: 'CASEL: Self-management',
        kind: 'notice',
        after: 7,
        lines: [
          N('Doing something important on your own can feel lonely, and a bit scary. That’s allowed.'),
          N('It helps to remember what people taught you, and to know who is near. Marina is just up on the lip, with the rope.'),
        ],
        parentNote: 'Talked about feeling brave on your own, and remembering that help is close by.',
      },
    ],
  ),
  scene(
    's19-question-alone',
    [
      N('After a long time, the light grows a little. Not brighter. Bigger, the way a coal does when you breathe on it.'),
      CI('Are they safe?', 'soft'),
      N('Nobody answers. Moss would have. You can feel the shape of what he’d say, as if he were sitting beside you.'),
      Y('No. They’re well.'),
      N('The light is quiet for a long time. You watch it understand.'),
      CI('…Well. Well is better, isn’t it. I didn’t know there was a better.', 'sad'),
      CI('I loved them. It was so cold, and I was so frightened. I held them so tight.', 'sad'),
      CI('Do they still say my name, down there?'),
      N('You know one way they do. You say it to her plainly, without the bounce the children give it in the lane.'),
      Y('Cinder held them close and tight, kept them warm one winter night;'),
      Y('when the morning came to call, they did not move at all.'),
      CI('That’s fair. Do they skip well?', 'soft'),
      Y('Badly. With great enthusiasm.'),
      N('Something passes through the light that might, in a bigger creature, be a laugh.'),
      CI('You’re the Keeper. You live down there, with the grey ones in the grass, and what I did.'),
      CI('Am I forgiven? By the ones who have to live with it?', 'soft'),
    ],
    [S19_SAFE_WELL(N), S19_THINK_FORGIVE],
    S19_CHOICES_ALONE,
  ),
  scene(
    's19-fade-alone',
    [
      N('You stay. The wind goes over the overhang, and you keep your hands in your lap.'),
      ...S19_GOES,
      CI('Keeper. It isn’t cold.', 'soft'),
      ...S19_GONE,
      N('You hear Moss’s words in your own mouth before you know you’re going to say them.'),
      Y('That is fading done right. Not stilled. Let go.'),
      N('You sit there a long time. Up on the lip, Marina lets you.'),
    ],
    [
      { ...S19_SIMILE_GOES, after: 9 },
      {
        domain: 'sel',
        skill: 'letting someone have quiet time after a loss',
        standard: 'CASEL: Social awareness',
        kind: 'notice',
        after: 9,
        lines: [
          N('After a sad moment, some people want a hug and some want to be left to sit quietly. Both are all right.'),
          N('Marina doesn’t call you down. She waits. Sometimes the kindest help is giving someone time.'),
        ],
        parentNote: 'Learned that people grieve in different ways, and that giving someone quiet time can be a kindness.',
      },
    ],
  ),
];

const S19: EduQuest = {
  id: 'reader:s19',
  of: 's19',
  band: 'reader',
  title: 'Cinder’s Last Light',
  goals: {
    's19-step1': {
      goal: 'Ask Marina about the path up to the high pass.',
      hint: 'She’s at the tide pools, breaking the ice. Go and find her there.',
    },
    's19-step2': {
      goal: 'Climb the snowfield to the high pass.',
      hint: 'Step in Marina’s footprints. When the wind gusts, crouch low and wait for it to pass.',
    },
    's19-step3': {
      goal: 'Sit beside the red light, and wait.',
      hint: 'Don’t move and don’t speak. It can take a long time. That’s the point.',
    },
    's19-step4': {
      goal: 'Stay with her until her light goes.',
      hint: 'Stay sitting. Don’t leave the hollow. It won’t be long.',
    },
  },
  scenes: S19_SCENES,
  glossary: [
    gloss('pass', 'A low gap between mountains where a path can cross over.', 's19-warmth'),
    gloss('bracing', 'Cold and fresh in a way that wakes you right up.', 's19-marina'),
    gloss('crusted', 'Covered with a hard top layer.', 's19-climb'),
    gloss('overhang', 'A part of a rock or roof that sticks out over the space below it.', 's19-sit'),
    gloss('enthusiasm', 'Being really keen and excited about something.', 's19-question'),
    gloss('theme', 'The big idea a story is about, underneath what happens.', 's19-question'),
    gloss('grief', 'The deep sadness you feel when someone you love dies.', 's19-fade'),
    gloss('draught', 'A stream of cool air that moves through a room or space.', 's19-warmth-sable'),
  ],
  notes:
    'Lessons: cold at height (general terms only), snowmelt and the water cycle (2-ESS2-3), melting above 0 °C (32 °F), ' +
    'stone holding heat (4-PS3-2), spreading weight on snow, raised fur; warm layers, cold fingers and toes, roping ' +
    'together, heart rate when climbing; left and right vs compass directions (D2.Geo.2.K-2); theme “safe is not the ' +
    'same as well” (RL.4.2), motive, simile, hidden feelings; privacy, slow breathing, being with someone who is dying, ' +
    'grief. Think question (s19-question and s19-question-sable): can you forgive on behalf of others? Cinder’s fading is ' +
    'named plainly as dying. Cinder’s rhyme is used exactly as the bible gives it. No altitude numbers are given. ' +
    'If Moss has left the world and Sable is not bonded, the -alone variants (you and Marina only) replace s19-warmth, ' +
    's19-climb, s19-hollow, s19-question and s19-fade, as in the main quest; you answer Cinder yourself, and nobody brings ' +
    'Moss’s pale light. Hazel’s third rule is not named in S19 (canon: only four side stories name it).',
};

// ================================================================== S22 The Climb
const S22_SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: the foot of the Tooth
  scene(
    's22-foot',
    [
      N('The Tooth stands over the valley like something the valley bit and didn’t finish. There’s already snow on its tip.'),
      N('Nova is at the foot with a coil of rope, a bag of oatcakes, and the look of someone who has been here before.'),
      NO('Three times. I’ve tried it three times. I got as far as the Ridge every time. Then I came down. I always come down.', 'think'),
      NO('That’s me. I come, I look, and I leave before anywhere can start to matter.'),
      NO('I asked you for help once, in the Hollow. It went well. I thought I’d try it again before I lose my nerve.', 'soft'),
      N('On the rock beside her sits something the size of a cat, made of shadow. It is exactly Nova’s shape.'),
      WO('You’re going to fall.', 'think'),
      N('Nova goes very still. She looks at you.'),
      NO('…You can see it.', 'shock'),
      NO('Nobody can see it. I’ve carried that about my whole life and nobody has ever once—', 'shock'),
      Y('Is it dangerous?'),
      NO('It’s mine. It’s my Worry. It’s talked to me since I was small. It’s mostly right, which is the annoying part.', 'think'),
      WO('Mostly.', 'happy'),
      NO('Right. Scree first. I’ll sing. It helps. It doesn’t help anyone else.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'understand a name that works as a metaphor',
        standard: 'L.4.5',
        kind: 'ask',
        after: 0,
        prompt: [N('Why do you think the people of the valley call this mountain the Tooth?')],
        options: [
          {
            label: 'Its sharp, pointed top looks like a tooth.',
            best: true,
            reply: [
              N('Yes. Calling the mountain a tooth because of its shape is a metaphor: it says one thing is another, to help us picture it.'),
            ],
          },
          {
            label: 'Because it bites people.',
            reply: [N('Mountains don’t bite! The name is a metaphor. Its sharp, pointed top looks like a tooth.')],
          },
          {
            label: 'Because it is white, like a tooth.',
            reply: [N('Only its snowy tip is white. Mostly it’s the sharp, pointed shape that looks like a tooth. That kind of name is a metaphor.')],
          },
        ],
        parentNote: 'Explained a place name as a metaphor based on shape.',
      },
      {
        domain: 'sel',
        skill: 'name a worry and understand what it is for',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 12,
        lines: [
          N('Everybody has worries. A worry is your mind trying to keep you safe, by warning you about what might go wrong.'),
          N('Nova’s Worry is a feeling, shown as a character. Sometimes it’s useful. Sometimes it’s too loud. Noticing it and giving it a name is a good first step.'),
        ],
        parentNote: 'Learned that worry is the mind’s way of warning us, and that naming a worry is a helpful first step.',
      },
    ],
  ),
  // ------------------------------------------------ step 1 done: the scree
  scene(
    's22-scree',
    [
      N('The scree slides under every step, with a sound like someone pouring out a sack of teacups.'),
      NO('♪ Little stones, little stones, sliding out from under my bones, ♪', 'happy'),
      NO('♪ I would like to go up but I’m going down, which is the opposite of up, little stones. ♪', 'happy'),
      N('It doesn’t rhyme. It doesn’t fit the beat. She sings it four times.'),
      WO('Last time you slipped here and cut your knee. You’ve still got the scar.'),
      NO('It’s right. It’s always right about the facts. It’s the next bit it gets wrong.', 'think'),
    ],
    [
      {
        domain: 'science',
        skill: 'frost breaks rock into scree (weathering)',
        standard: '4-ESS2-1',
        kind: 'notice',
        after: 0,
        lines: [
          NO('Scree is made by frost. Rain gets into cracks in the cliff, then freezes at night.', 'think'),
          NO('Ice takes up more room than water, so it pushes the crack a little wider. Bit by bit, stones break off and tumble down here.'),
          N('Breaking rock into pieces like this is called weathering.'),
        ],
        parentNote: 'Learned how freezing water widens cracks and breaks rock into scree (weathering).',
      },
      {
        domain: 'sel',
        skill: 'tell a fact from a worried guess',
        standard: 'CASEL: Self-management',
        kind: 'ask',
        after: 5,
        prompt: [
          NO('My Worry says two kinds of things. Facts, and guesses about what’s going to happen.'),
          NO('Which of these is a fact, not a guess?'),
        ],
        options: [
          {
            label: '“You slipped here last time.”',
            best: true,
            reply: [
              NO('Right. That really happened. “You’re going to fall” is only a guess.', 'happy'),
              NO('Spotting the difference makes a worry a bit smaller.'),
            ],
          },
          {
            label: '“You’re going to fall.”',
            reply: [NO('That one sounds very sure. But it’s a guess about the future. Worries often dress up guesses as facts.', 'think')],
          },
          {
            label: '“It will go wrong again.”',
            reply: [NO('Nobody knows that yet. It’s a guess about the future. The fact is, I slipped last time. That’s all.', 'think')],
          },
        ],
        parentNote: 'Practised telling a fact from a worried guess about the future, a way of calming worries.',
      },
    ],
    [
      {
        id: 'both',
        label: '“It is right. And you got up and kept going.”',
        set: { 's22-scree': 'both' },
        friendship: { nova: 1 },
        then: [
          NO('…I did, didn’t I. I bled on my boot all the way to the Chimney.', 'think'),
          WO('That’s… also true.', 'think'),
          NO('Ha.', 'happy'),
        ],
      },
      {
        id: 'together',
        label: '“That was last time. This time there are two of us.”',
        set: { 's22-scree': 'together' },
        friendship: { nova: 1 },
        then: [NO('Two of us. Huh.', 'soft'), WO('Three.', 'think'), NO('It can count. It’s always been able to count.', 'happy')],
      },
    ],
  ),
  // ------------------------------------------------ step 2: the chimney
  scene(
    's22-chimney',
    [
      N('The Chimney is a crack in the rock just wide enough for a person and a doubt.'),
      N('You go up it with your back pressed on one side and your boots on the other.'),
      NO('♪ I’m in a chimney, I am not a soot, I am a Nova, and this is my foot. ♪', 'happy'),
      NO('♪ This is my other foot. ♪', 'happy'),
      N('Far below, a buzzard turns and turns in circles, watching you with what feels like professional interest.'),
      N('It hardly flaps its wings at all.'),
      NO('Show-off.', 'happy'),
    ],
    [
      {
        domain: 'health',
        skill: 'climbing safety: three points of contact',
        kind: 'notice',
        after: 1,
        lines: [
          NO('Climber’s rule: three points of contact. Two hands and a foot, or two feet and a hand, on the rock at all times.'),
          NO('Move only one at a time. And real climbing is only ever with a grown-up, a helmet and the right gear.'),
        ],
        parentNote: 'Learned the climber’s “three points of contact” rule and that real climbing needs a grown-up and safety gear.',
      },
    ],
  ),
  // ------------------------------------------------ step 2 done: halfway up the chimney
  scene(
    's22-chimney-top',
    [
      N('Halfway up the Chimney, Nova stops. The Worry is wedged in above her, looking down.'),
      WO('Everywhere you stay, you lose something. The last place you stayed, you were nine. Remember?', 'soft'),
      N('Nova doesn’t move. Her knuckles are white on the rock.'),
      NO('It’s true. That’s the thing. That one’s true.', 'sad'),
      NO('Somebody left. So I learned to be the one who leaves first. It hurts less.', 'sad'),
      NO('It’s quicker.', 'sad'),
    ],
    [
      {
        domain: 'sel',
        skill: 'calm your body with counted breathing',
        standard: 'CASEL: Self-management',
        kind: 'do',
        after: 5,
        check: 'edu:breathe:count:4-in-4-out',
        lines: [
          N('Nova is frozen by a big feeling. Help her calm her body first.'),
          N('(Breathe in slowly while you count to four. Breathe out while you count to four. Do it three times with Nova.)'),
          NO('…Better. My hands feel like mine again.', 'soft'),
        ],
        parentNote: 'Practised counted breathing (in for 4, out for 4) as a way to calm a big feeling.',
      },
      {
        domain: 'literacy',
        skill: 'explain a character’s motive',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 5,
        prompt: [N('Why does Nova always leave places first?')],
        options: [
          {
            label: 'Someone left her when she was young, so she leaves first to avoid being hurt again.',
            best: true,
            reply: [N('Yes. Her habit of leaving comes from an old hurt. Knowing why a character acts helps us understand them, and be kind.')],
          },
          {
            label: 'She gets bored easily.',
            reply: [N('She says why herself: “Somebody left. So I learned to be the one who leaves first.” It’s about an old hurt.')],
          },
          {
            label: 'She doesn’t like anyone.',
            reply: [N('She likes you enough to ask for help! She leaves first because somebody once left her, and it hurt.')],
          },
        ],
        parentNote: 'Explained a character’s behaviour using what she says about her past.',
      },
    ],
    [
      {
        id: 'true',
        label: '“It’s true. It still isn’t a reason to let go.”',
        set: { 's22-chimney': 'true' },
        friendship: { nova: 1 },
        then: [
          NO('…No. It isn’t.', 'soft'),
          N('She moves one hand. Then one foot. Then the other hand. Very slowly, like someone learning how.'),
          WO('I wasn’t telling you to let go. I was telling you it was a long way down.', 'soft'),
          NO('I know. You’re very bad at saying what you mean. I wonder where you get it.', 'think'),
        ],
      },
      {
        id: 'look',
        label: '“Not here. Not now. Look at me, not down.”',
        set: { 's22-chimney': 'look' },
        friendship: { nova: 1 },
        then: [
          N('She looks at you. Not at the drop. Not at the Worry. At you.'),
          NO('…Right. Right. Hands.', 'think'),
          N('She climbs. The Worry climbs too, right behind her, muttering about loose rock. It’s right about the loose rock.'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 3: the ridge
  scene(
    's22-ridge',
    [
      N('The Ridge is a knife-edge of rock with the whole sky on both sides. The wind comes over it in long, cold shoves.'),
      N('Nova checks her map. It is covered in wiggly brown lines, bunched up tight around the Ridge.'),
      N('This is where she turned back before. You can see the place: a little cairn of three stones, one for each try.'),
      NO('Here. This is where I always… yes.', 'think'),
      WO('Go back. It’s windy. It’s high. They’ll wonder where you are. You can come another day.', 'soft'),
      NO('Every true thing it says makes me smaller. I fight it, and fight it, and up here I lose. Every time.', 'sad'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'read contour lines on a map',
        standard: 'D2.Geo.2.K-2',
        kind: 'ask',
        after: 1,
        prompt: [
          NO('The wiggly lines are contour lines. Each one joins up places that are the same height.'),
          NO('Where the lines are squashed close together, what is the land like?'),
        ],
        options: [
          {
            label: 'Very steep.',
            best: true,
            reply: [
              NO('Yes. Close lines mean the land goes up a lot in a short distance: steep.', 'happy'),
              NO('Lines far apart mean gentle slopes. So the Ridge is steep on both sides. Which we knew.'),
            ],
          },
          {
            label: 'Flat.',
            reply: [NO('Flat land has contour lines far apart, or none at all. Close-together lines mean it climbs fast: steep.')],
          },
          {
            label: 'Wet.',
            reply: [NO('Water is usually shown in blue. Brown contour lines show height. Close together means steep.')],
          },
        ],
        parentNote: 'Learned that contour lines join places of equal height, and that close lines mean steep ground.',
      },
      {
        domain: 'sel',
        skill: 'decide what to do with a worry that tells the truth',
        standard: 'CASEL: Self-management',
        kind: 'ask',
        after: 5,
        prompt: [
          N('Here is a hard question. Nova’s Worry is telling the truth: it really is windy and high.'),
          N('What do you think you should do with a worry that tells the truth?'),
        ],
        options: [
          {
            label: 'Listen to it, then decide for yourself.',
            reply: [
              N('That’s a wise answer. A worry can give useful facts, like “hold on tight”.'),
              N('But it doesn’t have to make every choice for you.'),
            ],
          },
          {
            label: 'Fight it until it goes away.',
            reply: [
              N('Lots of people try that, and it’s a fair idea. Nova has, for years.'),
              N('Sometimes fighting a worry just makes it louder. Let’s see what she tries next.'),
            ],
          },
          {
            label: 'Let it decide, and go home.',
            reply: [
              N('Sometimes that really is the right call. If something is truly dangerous, staying safe matters most.'),
              N('The trick is telling real danger from a worry that is just loud.'),
            ],
          },
        ],
        parentNote: 'Thought about how to respond to a worry that is telling the truth (a think question with no single right answer).',
      },
    ],
  ),
  // ------------------------------------------------ step 3 done: crossing the ridge
  scene(
    's22-ridge-cross',
    [
      N('In the middle of the Ridge, Nova stops. The Worry is beside her. It has always been beside her.'),
      N('She looks at it for a long time. Then she holds out her hand.'),
      NO('Come on, then.', 'soft'),
      WO('…What?', 'shock'),
      NO('You’re coming anyway. You always come. So come with me. Not at me.', 'soft'),
      N('The Worry looks at her hand. Then it takes it.'),
      N('It’s smaller, with its hand in hers. Not gone. Smaller.'),
      N('They cross the Ridge together, crouched low in the gusts, because a low body is harder for the wind to push over.'),
      N('Nova starts the stones song again, and a second voice joins in, horribly flat.'),
      WO('♪ …little stones, which are very loose, and we should mind them… ♪', 'happy'),
      NO('You can SING?', 'shock'),
      WO('I’ve always been able to sing. You never asked.', 'soft'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'find the theme of a story',
        standard: 'RL.4.2',
        kind: 'ask',
        after: 10,
        prompt: [N('The Worry didn’t vanish. It got smaller when Nova walked with it instead of fighting it.'), N('What is the story telling us?')],
        options: [
          {
            label: 'You can’t always make a fear go away, but it can shrink when you stop fighting it and keep going.',
            best: true,
            reply: [N('Yes. That’s the theme: the big idea underneath. Fear can come along without being in charge.')],
          },
          {
            label: 'Worries always disappear if you hold their hand.',
            reply: [N('Look again: “Not gone. Smaller.” The Worry stays. It just stops being in charge. That’s the theme.')],
          },
          {
            label: 'You should never have worries.',
            reply: [N('Everyone has worries, even Nova. The story says a worry can come along without being the boss.')],
          },
        ],
        parentNote: 'Identified the theme: a fear can shrink when you accept it and keep going.',
      },
    ],
  ),
  // ------------------------------------------------ step 4: the scramble
  scene(
    's22-scramble',
    [
      N('The last bit is a scramble on hands and knees, up to a point of rock the size of a kitchen table.'),
      N('Nova unpacks the flag from under the oatcakes. The pole comes in two halves that screw together.'),
      NO('Give me the flag. No, you do it. No. Together.', 'happy'),
      NO('Fine. Together.'),
      N('You both take hold of the pole. There’s a crack in the very top of the rock, just the right size.'),
      N('The Worry holds the corner of the flag so it doesn’t flap in your faces. It’s surprisingly helpful.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'solve a height problem by subtracting',
        standard: '4.MD.A.2',
        kind: 'ask',
        after: 0,
        prompt: [
          N('Nova’s map says the foot of the Tooth is 300 metres above sea level. The top is 900 metres.'),
          N('How high have you climbed today?'),
        ],
        options: [
          {
            label: '600 metres',
            best: true,
            reply: [N('Yes. 900 − 300 = 600. Think of it as 9 hundreds take away 3 hundreds: 6 hundreds.')],
          },
          {
            label: '1,200 metres',
            reply: [N('That’s 900 + 300. We want the difference between the top and the foot: 900 − 300 = 600 metres.')],
          },
          {
            label: '300 metres',
            reply: [N('300 metres is where you started. The climb is the difference: 900 − 300 = 600 metres.')],
          },
        ],
        parentNote: 'Subtracted hundreds (900 − 300) to find how far a climb went up.',
      },
      {
        domain: 'sel',
        skill: 'agree by compromising',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 3,
        lines: [
          N('When two people both want to do something, sharing it is a good way to agree.'),
          N('Finding an answer that works for both of you is called a compromise.'),
        ],
        parentNote: 'Learned what a compromise is, using Nova’s “together” as an example.',
      },
    ],
  ),
  // ------------------------------------------------ step 4 done: the summit
  scene(
    's22-summit',
    [
      N('From the top of the Tooth you can see everything at once.'),
      N('The falls are a long white thread. There’s Dusty’s cliff. Marina’s pools are like spilled coins. The Circuit looks square and small.'),
      N('The Hollow is dark in its fold of trees. And the Grove: the pond, the cottage roof, and four lantern posts no bigger than pins.'),
      N('Nova sits down. The Worry sits beside her, holding her hand. Neither of them says anything for a while.'),
      NO('I’d like to stay.', 'soft'),
      N('She says it to the valley first. Then, more quietly, to the Worry. Then, last of all, to you.'),
      NO('Not up here. Down there. I’d like to stay.', 'soft'),
      WO('It’ll be frightening.', 'soft'),
      NO('Yes. You’ll come too.', 'soft'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'draw a simple map with symbols and a key',
        standard: 'D2.Geo.2.K-2',
        kind: 'do',
        after: 2,
        check: 'edu:draw:map:valley-view',
        lines: [
          NO('From up here the valley looks like a map. A map is a view from above, drawn smaller, with symbols for real things.', 'happy'),
          NO('Let’s make one. Mark the falls, the pools, the Circuit, the Hollow and the Grove. Give each a symbol, and explain them in a key.'),
          N('(Draw your map of the valley. Any symbols are fine, as long as your key explains them.)'),
        ],
        parentNote: 'Drew a map of a landscape seen from above, using symbols and a key.',
      },
      {
        domain: 'literacy',
        skill: 'describe how a character changes',
        standard: 'RL.2.3',
        kind: 'ask',
        after: 6,
        prompt: [N('At the start, Nova said she always leaves before anywhere can matter. What has changed?')],
        options: [
          {
            label: 'She wants to stay in the valley now, even though it’s frightening.',
            best: true,
            reply: [N('Yes. She has changed from someone who always leaves to someone who chooses to stay. That’s a big change for a character.')],
          },
          {
            label: 'She wants to live on top of the mountain.',
            reply: [N('She says, “Not up here. Down there.” She means the valley. She has chosen to stay.')],
          },
          {
            label: 'She’s going to leave tomorrow.',
            reply: [N('It’s the opposite! For the first time, Nova wants to stay. That’s how she has changed.')],
          },
        ],
        parentNote: 'Described how a character changed from the beginning of the story to the end.',
      },
      {
        domain: 'science',
        skill: 'how buzzards soar on rising warm air',
        standard: '4-LS1-1',
        kind: 'notice',
        after: 1,
        lines: [
          N('Far below you now, the buzzard is still circling. Buzzards ride on rising warm air, called a thermal. They circle round and round inside it, going higher without flapping.'),
          N('Their long, broad wings are made for it. They save their energy for hunting.'),
        ],
        parentNote: 'Learned how a buzzard’s broad wings let it soar on rising warm air (thermals).',
      },
    ],
  ),
  // ------------------------------------------------ complete
  scene(
    's22-complete',
    [
      N('Going down is quicker and much worse, as it always is. Nova sings the whole way. So does the Worry.'),
      N('At the bottom she unpacks nine oatcakes, all sat on. Nova looks at the Worry, and the Worry looks at the view.'),
      N('She shares them out in three anyway. The Worry gets the flattest.'),
      NO('Keep the flag. Put it somewhere you’ll see it. I’ll know where it is. I’ll come and look at it.', 'soft'),
      NO('And have my boots. They’re my spare pair. I won’t need spares. I’m not going anywhere. I’m staying.', 'happy'),
      NO('You can see the whole valley from up there now, whenever you like. In case you ever need to find me. I’ll be in it.', 'soft'),
      N('The Worry waves. Small. Only you can see it.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'share equally into groups (division)',
        standard: '3.OA.A.3',
        kind: 'ask',
        after: 2,
        prompt: [N('Nine squashed oatcakes, shared fairly between Nova, you and the Worry. How many each?')],
        options: [
          {
            label: '3 each',
            best: true,
            reply: [N('Yes. 9 ÷ 3 = 3, because 3 × 3 = 9. Even the Worry gets three.')],
          },
          {
            label: '6 each',
            reply: [N('Three people with 6 each would need 18 oatcakes. 9 ÷ 3 = 3, so it’s 3 each.')],
          },
          {
            label: '4 each',
            reply: [N('4 + 4 + 4 = 12, which is too many. 3 + 3 + 3 = 9, so it’s 3 each.')],
          },
        ],
        parentNote: 'Shared 9 into 3 equal groups (9 ÷ 3 = 3).',
      },
      {
        domain: 'sel',
        skill: 'choose a way to cope with worry',
        standard: 'CASEL: Self-management',
        kind: 'ask',
        after: 6,
        prompt: [N('Nova tried lots of ways to climb with her Worry. Which one would you like to try next time you feel worried?')],
        options: [
          {
            label: 'Sing a silly song.',
            reply: [N('Good choice. Singing helps you breathe steadily, and it’s hard to feel quite so scared while being silly.')],
          },
          {
            label: 'Breathe slowly and count.',
            reply: [N('Good choice. Slow, counted breaths tell your body it’s safe to calm down.')],
          },
          {
            label: 'Sort the facts from the guesses.',
            reply: [N('Good choice. Asking “Is that a fact, or a guess?” can make a worry much smaller.')],
          },
          {
            label: 'Tell a friend, and do it together.',
            reply: [N('Good choice. Worries feel lighter when you share them. That’s exactly what Nova did with you.')],
          },
        ],
        parentNote: 'Chose a coping strategy to try when feeling worried (all choices are good ones).',
      },
    ],
  ),
];

const S22: EduQuest = {
  id: 'reader:s22',
  of: 's22',
  band: 'reader',
  title: 'The Climb',
  goals: {
    's22-step1': {
      goal: 'Climb the Scree with Nova.',
      hint: 'On loose stones keep moving: three quick steps, then rest on a big rock. Never stop on the small ones.',
    },
    's22-step2': {
      goal: 'Climb the Chimney: brace and push, one side to the other.',
      hint: 'Push with your back, step with your feet. Move one hand or foot at a time, and keep three on the rock.',
    },
    's22-step3': {
      goal: 'Cross the Ridge.',
      hint: 'Keep low in the gusts. Hand on the rock, eyes on the next step, not the drop.',
    },
    's22-step4': {
      goal: 'Plant the summit flag on top of the Tooth.',
      hint: 'It’s in Nova’s bag, under the oatcakes. Wedge the pole into the crack on the very top.',
    },
  },
  scenes: S22_SCENES,
  glossary: [
    gloss('nerve', 'The courage to do something scary. If you “lose your nerve”, you suddenly feel too scared to do it.', 's22-foot'),
    gloss('scree', 'A slope covered in small, loose stones that have broken off the rock above.', 's22-foot'),
    gloss('weathering', 'The slow breaking-up of rock by things like frost, rain and wind.', 's22-scree'),
    gloss('professional', 'Done the way an expert would do it, as their job.', 's22-chimney'),
    gloss('thermal', 'A rising current of warm air that birds can ride upwards.', 's22-summit'),
    gloss('cairn', 'A pile of stones built as a marker, often on hills and mountains.', 's22-ridge'),
    gloss('contour line', 'A line on a map that joins places of the same height.', 's22-ridge'),
    gloss('gusts', 'Sudden, strong rushes of wind.', 's22-ridge-cross'),
    gloss('compromise', 'An answer two people agree on, where each gets some of what they want.', 's22-scramble'),
    gloss('sea level', 'The height of the sea’s surface. Mountain heights are measured from it.', 's22-scramble'),
    gloss('symbol', 'A small picture or mark that stands for something real.', 's22-summit'),
  ],
  notes:
    'Lessons: worry as a warning (naming it), fact vs guess, counted and slow breathing, compromise, choosing a coping ' +
    'strategy (CASEL: Self-management); three points of contact and climbing only with a grown-up and gear; frost ' +
    'weathering makes scree (4-ESS2-1), buzzards on thermals, crouching against the wind (3-PS2-1); contour lines and a ' +
    'map with a key (D2.Geo.2.K-2); 900 − 300 and 9 ÷ 3; metaphor, motive, theme and character change. Think question ' +
    '(s22-ridge): what do you do with a worry that tells the truth? The s22-complete coping-strategy ask also has no ' +
    'best answer; every option is affirmed. Both do lessons accept any attempt. The Tooth’s heights (300 m foot, 900 m ' +
    'top) are story numbers, not real-world facts.',
};

// ================================================================== exports
export const EDU_SIDE_NEW_3_READER: EduQuest[] = [S13, S19, S22];

export const EDU_SIDE_NEW_3_READER_VARIANTS: EduScene[] = [...S13_VARIANT_SCENES, ...S19_VARIANT_SCENES, ...S19_ALONE_SCENES];

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  // S13
  'edu:make:loot-name',
  // S19
  'edu:breathe:slow:5',
  // S22
  'edu:breathe:count:4-in-4-out',
  'edu:draw:map:valley-view',
];
