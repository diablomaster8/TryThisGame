/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): S30 What Sad Is For.
 *
 * Source: side-stories-s30.ts (SIDE_STORY_S30 and SIDE_STORY_S30_VARIANTS). One EduScene per
 * original scene, id `sprout:<original id>`, including every variant and the four afterwards
 * talk scenes. See EDU-STYLE.md.
 *
 * - What it teaches (the outline's Learning Grove angle): a face and a feeling can be different;
 *   sad helps people know you need them; how to sit with a sad friend without fixing them; worries
 *   try to keep us safe, and sometimes too safe; naming feelings. Woven in: counting, shapes,
 *   positions, first-next-last, frost, acorns, worms, the Moon, thunder, pushes and pulls.
 * - Every choice is kept. The acorn-ring choice (`broke`, `sat`, `helped`) keeps its ids and `set`
 *   so the -helped variants still play; none of the three is cruel, so none is left out.
 * - Hard things: Fossil died, said plainly the first time with comfort straight after (her flower,
 *   the people who remember her). The White Year is a long cold winter, long ago, when some
 *   Nubbins died; Hush sat with them so they weren't alone. Ember's “after Ash” is left out.
 * - Care notes kept: Dimple is never fixed, nobody tells her to cheer up, Sparks's party is kind,
 *   Fidget is a frightened Nubbin who calms when someone sits with her, the hollow is shallow and
 *   the rope is there. Hazel's third rule is shown, never quoted or named.
 * - Nubbins never speak (canon 17): Dimple, Drizzle and Fidget only have “…” lines.
 * - No lines from the film appear; the two quoted lines are rewritten from scratch.
 */
import type { EduQuest, EduScene, Lesson } from './types';
import type { Line, Choice } from '../config/story';

type Mood = Line['mood'];
const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const Y = say('you');
const M = say('moss');
const CL = say('clover');
const SP = say('sparks');
const BY = say('byte');
const EM = say('ember');
const LU = say('luna');
const DU = say('dusty');
// new speakers (declared in the source quest; Nubbins, “…” only)
const DI = say('s30-dimple');
const DR = say('s30-drizzle');
const FI = say('s30-fidget');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

/** One answer option. `best` marks the answer the lesson teaches. */
const opt = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

/** One sprout scene. Lesson ids are `sprout:<of>-l<n>`, numbered in play order. */
const sc = (
  of: string,
  lines: Line[],
  beats: Beat[],
  extra: { choices?: Choice[]; defaultChoice?: string } = {},
): EduScene => ({
  id: `sprout:${of}`,
  of,
  band: 'sprout',
  lines,
  ...extra,
  lessons: [...beats]
    .sort((a, b) => a.after - b.after)
    .map((b, i) => ({ id: `sprout:${of}-l${i + 1}`, ...b })),
});

// ================================================================== step scenes
const SCENES: EduScene[] = [
  // ------------------------------------------------ step 1: the smile
  sc(
    's30-smile',
    [
      N('Rattle, rattle! Someone is at your gate. It’s Clover.'),
      N('A little gold Nubbin bounces on her shoulder. Boing, boing!'),
      CL('This is Dimple. She is one of mine.', 'happy'),
      CL('Dusty’s Fossil has faded.', 'sad'),
      N('Faded means Fossil died. Her body stopped working, and it won’t start again.'),
      N('Her flower grows on the hill now. Everyone remembers her.'),
      CL('Dimple has smiled ever since. All day. All night!'),
      N('Four more Nubbins sit in a wet heap behind Clover.'),
      CL('Come for tea. Come and look at Dimple with me.', 'think'),
      N('Your Nubbin looks at Dimple. Then it puts on a smile too.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'reading feelings on a face',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'ask',
        after: 6,
        prompt: [N('Look at Dimple’s big smile. A smile often means… what?')],
        options: [
          opt(
            'Happy',
            [CL('Yes! A smile often means happy. Often. Let’s keep watching her.', 'happy')],
            true,
          ),
          opt('Cross', [CL('Cross faces frown. A smile often means happy. Often!', 'think')]),
          opt('Sleepy', [
            CL('Sleepy faces yawn. A smile often means happy. Let’s keep watching.', 'soft'),
          ]),
        ],
        parentNote:
          'Named the feeling a smile usually shows, ready to learn that a face and a feeling can differ.',
      },
    ],
  ),
  // ------------------------------------------------ step 1 done: the windowsill
  sc(
    's30-sill',
    [
      N('Clover’s kitchen is warm and noisy. Bang! Bristle stamps on a lid.'),
      N('Flinch jumps into the bread bin. Thump! Only his ears stick out.'),
      N('There is a cushion on the windowsill. It has a dent in the middle.'),
      CL('That was Fossil’s seat. She sat there for years.', 'soft'),
      N('Dimple has filled the dent with toys. Reel, cone, sock, peg.'),
      N('Drizzle climbs up slowly. Drizzle puts a hand in the dent.'),
      N('Dimple pulls Drizzle off at once. Dimple is still smiling.'),
      DI('…', 'happy'),
      N('Now look at the ball above Dimple’s head. It is pale and thin.'),
      CL('See? The happiest Nubbin in the house!', 'happy'),
      N('Clover looks at the smile. She doesn’t look at the ball.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'count to 4',
        standard: 'K.CC.B.5',
        kind: 'do',
        after: 4,
        check: 'edu:count:toys:4',
        lines: [
          N('(Count Dimple’s toys together: reel, cone, sock, peg.)'),
          N('One, two, three, four. Four toys in the dent!'),
        ],
        parentNote: 'Counted four toys, one number for each toy.',
      },
      {
        domain: 'sel',
        skill: 'a face and a feeling can be different',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'ask',
        after: 8,
        prompt: [N('Dimple’s face is smiling. Her ball is pale and thin. Do they match?')],
        options: [
          opt(
            'No, they don’t match',
            [
              N('That’s right. Her face says happy. Her ball says something else.'),
              N('A face and a feeling can be different.'),
            ],
            true,
          ),
          opt('Yes, they match', [
            N('Look again. Her face is bright. Her ball is pale.'),
            N('A face and a feeling can be different.'),
          ]),
        ],
        parentNote: 'Noticed that a smiling face can hide a different feeling inside.',
      },
    ],
    {
      choices: [
        {
          id: 'tell',
          label: 'Show Clover Dimple’s ball.',
          then: [
            CL('Balls flicker. It’s been a big week. Look at that face!', 'happy'),
            N('Clover keeps looking at the face.'),
          ],
        },
        {
          id: 'watch',
          label: 'Say nothing yet. Keep watching.',
          then: [
            N('You sip your tea. You watch the ball.'),
            N('Dimple sees you looking. She smiles harder.'),
          ],
        },
      ],
    },
  ),
  // ------------------------------------------------ step 2 scene: acorns
  sc(
    's30-acorns',
    [
      N('Next day you are back at Clover’s. Drip, drip. It is drizzling.'),
      CL('Sparks says Dimple needs a party. Sparks says that about everything!', 'think'),
      N('Look out of the window. Something is happening in the yard.'),
      N('Dimple is pushing Drizzle into a corner. Bounce, bounce, push.'),
      N('There are acorns all over the yard.'),
      CL('Look at them playing. Go and see, if you like.', 'happy'),
    ],
    [
      {
        domain: 'science',
        skill: 'acorns are seeds that grow into oak trees',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'notice',
        after: 4,
        lines: [
          N('An acorn is a seed. It comes from an oak tree.'),
          N('Squirrels bury acorns. Some get forgotten, and grow into new oak trees!'),
        ],
        parentNote: 'Heard that acorns are oak seeds, and that squirrels help plant new oaks.',
      },
    ],
  ),
  // ------------------------------------------------ step 2 done: the ring of acorns (THE CHOICE)
  sc(
    's30-ring',
    [
      N('Drizzle sits in the corner. Drip, drip, on her head.'),
      N('Dimple has made a ring of acorns all round her.'),
      N('Drizzle steps out. Dimple nudges her back in. Nudge!'),
      N('Drizzle steps out again. Nudge! Dimple adds one more acorn.'),
      N('Drizzle looks at you. She wants to get out.'),
      DR('…', 'soft'),
      N('What will you do?'),
    ],
    [
      {
        domain: 'maths',
        skill: 'name a circle',
        standard: 'K.G.A.2',
        kind: 'ask',
        after: 1,
        prompt: [N('The acorns go all the way round. What shape is the ring?')],
        options: [
          opt('A circle', [N('Yes! Round and round, with no corners. A circle.')], true),
          opt('A square', [N('A square has four corners. This ring has none. It’s a circle!')]),
          opt('A triangle', [
            N('A triangle has three corners. This ring has none. It’s a circle!'),
          ]),
        ],
        parentNote: 'Named a circle made of acorns: round, with no corners.',
      },
    ],
    {
      choices: [
        {
          id: 'broke',
          label: 'Lift Drizzle out of the ring.',
          set: { 's30-ring': 'broke' },
          then: [
            N('You lift Drizzle out. She is cool and heavy.'),
            N('She sits under the drip and turns her face up. Ahh.'),
            N('Dimple fills the gap fast. Then she bounces indoors.'),
          ],
        },
        {
          id: 'sat',
          label: 'Sit down next to Drizzle, outside the ring.',
          set: { 's30-ring': 'sat' },
          then: [
            N('You sit on the wet grass. Drizzle leans towards you.'),
            N('Dimple makes a bigger ring round you both. Still smiling.'),
            N('Then she bounces indoors.'),
          ],
        },
        {
          id: 'helped',
          label: 'Leave it. Go and help Sparks plan the party.',
          set: { 's30-ring': 'helped' },
          then: [
            N('Dimple is trying so hard. You leave the ring be.'),
            N('You go and help Sparks with the streamers.'),
            N('Drizzle watches you go. She stays in the ring.'),
          ],
        },
      ],
    },
  ),
  // ------------------------------------------------ step 3 scene: the party plan
  sc(
    's30-party-ask',
    [
      SP('PARTY! Saturday! Dimple is the special guest!', 'happy'),
      SP('Streamers! Races! And a cake shaped like a cake!'),
      BY('I’m coming. I’m bringing a chart.', 'think'),
      EM('I’m only coming for the cake.'),
      N('On Saturday, flags hang all over Clover’s yard.'),
      N('Dimple bounces in a paper hat. Boing! Her hat lands on Byte.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'hear rhymes',
        standard: 'RF.K.2',
        kind: 'ask',
        after: 1,
        prompt: [N('Cake! Which word rhymes with cake?')],
        options: [
          opt('Lake', [SP('Cake, lake! Yes! Cake, lake, bake, shake!', 'happy')], true),
          opt('Hat', [SP('Cake, hat… no! Cake rhymes with lake. And bake!', 'happy')]),
          opt('Drum', [SP('Cake, drum… nope! Cake rhymes with lake. And shake!', 'happy')]),
        ],
        parentNote: 'Listened for a rhyme with “cake”.',
      },
    ],
  ),
  // ------------------------------------------------ step 3 done: the party
  sc(
    's30-party',
    [
      N('Dimple wins every race. She bounces round the cake eleven times!'),
      N('Your Nubbin copies every bounce. Now it is very tired.'),
      SP('Look at her go! That’s a happy Nubbin!', 'happy'),
      EM('That’s not happy. That’s busy.', 'angry'),
      SP('What? I made a cake shaped like a cake!', 'shock'),
      BY('I made a scale. It goes from nought to ten.', 'think'),
      BY('Her ball only got to two. All day.'),
      BY('Her face and her ball don’t agree. The ball is right.', 'angry'),
    ],
    [
      {
        domain: 'maths',
        skill: 'compare numbers up to 10',
        standard: 'K.CC.C.6',
        kind: 'ask',
        after: 6,
        prompt: [BY('Ten is the most. Her ball got two. A lot or a little?')],
        options: [
          opt(
            'A little',
            [BY('Correct. Two is a little. Ten is a lot. Her ball is low.', 'think')],
            true,
          ),
          opt('A lot', [
            BY('Count with me: one, two… all the way to ten. Two is little.', 'think'),
          ]),
        ],
        parentNote: 'Compared 2 and 10 on Byte’s scale: 2 is a little, 10 is a lot.',
      },
    ],
  ),
  // ------------------------------------------------ step 4 scene: Clover's list
  sc(
    's30-list',
    [
      N('Clover is on your step with a list.'),
      CL('These are Dimple’s five favourite things.', 'think'),
      CL('One, the windowsill. Two, stamping in puddles.'),
      CL('Three, chasing Sparks’s fast Nubbins.'),
      CL('Four, pulling Byte’s laces undone. He pretends to mind.', 'happy'),
      CL('Five, my humming at bedtime. Hmmmm.', 'soft'),
      CL('If she does all five, she’s fine. Isn’t she?'),
    ],
    [
      {
        domain: 'science',
        skill: 'sounds come from things shaking',
        standard: '1-PS4-1',
        kind: 'do',
        after: 5,
        check: 'edu:hum:hand-on-throat',
        lines: [
          N('(Put a hand on your throat and hum, like Clover. Hmmmm.)'),
          N('Can you feel a buzz? That buzzing makes the sound!'),
        ],
        parentNote: 'Felt their throat buzz while humming: sound comes from things shaking.',
      },
    ],
  ),
  // ------------------------------------------------ step 4 done: nought out of five
  sc(
    's30-five',
    [
      N('The sill? Dimple won’t climb up.'),
      N('The puddles? Drizzle stamps. Splash! Dimple doesn’t move.'),
      N('The fast Nubbins run past. Dimple doesn’t chase.'),
      N('Clover hums. Dimple lies still and smiles at the ceiling.'),
      N('Last, Byte’s laces. Dimple looks. She smiles. She goes away.'),
      BY('She didn’t pull them.', 'sad'),
      BY('I tied them extra easy, so she could.', 'sad'),
      N('Clover sits down next to Byte. They are quiet together.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'zero means none',
        standard: 'K.CC.B.5',
        kind: 'ask',
        after: 5,
        prompt: [N('Dimple had five favourite things. How many did she do today?')],
        options: [
          opt('None. Zero!', [N('Yes. None at all. Zero means none.')], true),
          opt('Five', [N('Let’s look again. Sill, no. Puddles, no. None at all. Zero!')]),
          opt('Two', [N('Let’s look again. She didn’t do any. That’s zero.')]),
        ],
        parentNote: 'Learned that zero means none at all.',
      },
    ],
  ),
  // ------------------------------------------------ step 5 scene: Dusty's hole
  sc(
    's30-hole',
    [
      N('By the stream there is a big new hole. It is singing!'),
      N('That’s Dusty, at the bottom, singing a digging song.'),
      DU('Morning! Grand day for a hole! Hello, worm!', 'happy'),
      N('Dimple jumps in and digs too. Scoop, scoop, scoop!'),
      N('Dusty digs faster. Dimple digs faster. Big grins.'),
      N('Your Nubbin throws mud about. Splat! Most of it lands on you.'),
      DU('Keep busy! Busy is good!', 'happy'),
    ],
    [
      {
        domain: 'science',
        skill: 'worms help the soil',
        standard: 'K-ESS2-2',
        kind: 'notice',
        after: 2,
        lines: [
          N('Worms make tiny tunnels in the soil.'),
          N('The tunnels let in air and rain. That helps plants grow!'),
        ],
        parentNote: 'Heard how worms change the soil and help plants.',
      },
    ],
  ),
  // ------------------------------------------------ step 5 done: Drizzle sits
  sc(
    's30-drizzle',
    [
      N('Then Drizzle comes, slowly. She sits at the edge of the hole.'),
      N('She doesn’t say anything. She just sits.'),
      N('Dusty stops digging. Dimple stops too.'),
      DU('Fossil used to sit like that. Right there.', 'sad'),
      N('Dusty sits down in the hole and cries. Dusty misses Fossil very much.'),
      N('Drizzle climbs down and leans on them. She doesn’t pat or fuss.'),
      DU('There. That’s a little bit better.', 'soft'),
      N('Dimple watches. Her smile slips, just a little.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'sitting with a sad friend',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 5,
        prompt: [N('Dusty is sad. What does Drizzle do to help?')],
        options: [
          opt(
            'She stays close',
            [N('Yes. She stays close and lets Dusty be sad.'), N('That can help a lot.')],
            true,
          ),
          opt('She tells a joke', [
            N('Look again. No jokes. She stays close, and lets Dusty be sad.'),
          ]),
          opt('She runs away', [N('Look again. She stays! Staying close can help a lot.')]),
        ],
        parentNote: 'Saw that staying close, without fixing, can help a sad friend.',
      },
    ],
  ),
  // ------------------------------------------------ step 6 scene: Luna at dawn
  sc(
    's30-luna',
    [
      N('Tap, tap. It’s Luna. She is going to bed, and it’s morning!'),
      LU('I work in the garden at night. I sleep in the day.', 'think'),
      N('Luna yawns. A huge yawn. Your Nubbin yawns too.'),
      N('Then it falls asleep on your foot. Snore!'),
      LU('See? Even it knows it’s my bedtime.'),
      LU('Three nights now, I’ve seen Dimple on the hill path.'),
      LU('She walks up towards Fossil’s flower. Then she turns back.'),
      LU('She doesn’t bounce up there. She walks.', 'sad'),
      LU('Come with me tonight.', 'soft'),
    ],
    [
      {
        domain: 'science',
        skill: 'some animals are awake at night',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'ask',
        after: 4,
        prompt: [LU('Like me, some animals wake up at night. Which one?')],
        options: [
          opt(
            'An owl',
            [LU('Yes! Owls hunt at night. Hoo, hoo! Hedgehogs and bats do too.', 'happy')],
            true,
          ),
          opt('A cow', [LU('Cows sleep at night, mostly. Owls wake up at night. Hoo, hoo!')]),
          opt('A butterfly', [
            LU('Butterflies like the sunshine. Owls wake up at night. Hoo, hoo!'),
          ]),
        ],
        parentNote: 'Named an animal that is awake at night (owls, hedgehogs, bats).',
      },
    ],
  ),
  // ------------------------------------------------ step 6 done: the night path
  sc(
    's30-path',
    [
      N('It is the middle of the night. Shh! The hill is grey and silver.'),
      N('There is Dimple, walking up the path on her own.'),
      N('She isn’t smiling. Her ball is very dark.'),
      LU('This is where she stops.', 'soft'),
      N('Dimple turns round. She sees you!'),
      N('Quick! The smile goes back on. She runs home.'),
      LU('Did you see her face before? That’s how she really feels.', 'sad'),
    ],
    [
      {
        domain: 'science',
        skill: 'the Moon’s shape changes',
        standard: '1-ESS1-1',
        kind: 'notice',
        after: 0,
        lines: [
          N('Look up! The Moon is just a thin curve tonight, like a fingernail.'),
          N('The Moon looks a bit different each night. Sometimes round, sometimes thin.'),
        ],
        parentNote: 'Noticed that the Moon’s shape looks different on different nights.',
      },
    ],
  ),
  // ------------------------------------------------ step 7 scene: Moss at the wall
  sc(
    's30-wall',
    [
      N('Frost! The Grove is white and sparkly this morning.'),
      N('Moss is by the old wall. There is frost on his back.'),
      N('A sparrow sits on Moss’s back. Moss lets the sparrow stay.'),
      M('Luna told me about Clover’s gold one.', 'think'),
      M('Long ago, there was a very long, cold winter.'),
      M('Many Nubbins got too cold. Some of them died.', 'sad'),
      M('Hush sat close by them, so they could see her.', 'soft'),
      M('Nobody was alone at the end. That was her job.', 'soft'),
      M('Look at the flat stone by your foot. She made it for looking.'),
    ],
    [
      {
        domain: 'science',
        skill: 'frost is frozen water',
        standard: '2-ESS2-3',
        kind: 'notice',
        after: 0,
        lines: [
          N('Frost is tiny bits of ice. It comes on very cold nights.'),
          N('When the sun warms it, the frost melts into water drops.'),
        ],
        parentNote: 'Heard that frost is frozen water that melts when it warms up.',
      },
    ],
  ),
  // ------------------------------------------------ step 7 done: Hush's stone
  sc(
    's30-stone',
    [
      N('You brush off the frost. The stone is covered in tiny marks.'),
      M('A ring for a happy thing. A line for a sad thing.', 'soft'),
      N('Most marks are both: a ring with a line through it.'),
      M('Most things are both. Happy and sad together.'),
      Y('What did Hush think sad was for?'),
      M('Sad is like a lantern, she said. It shows people where you are.', 'soft'),
      M('If you hide your sad, people can’t find you to help.', 'sad'),
      N('Moss puts his hand on the stone, like warming it.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'name and spot shapes',
        standard: 'K.G.A.2',
        kind: 'do',
        after: 2,
        check: 'edu:tap:shape:ring-with-line',
        lines: [
          N('(Find a ring. Find a line. Find a ring with a line through it.)'),
          N('Tap the one that means both!'),
        ],
        parentNote: 'Found a circle, a line and a circle with a line through it.',
      },
      {
        domain: 'sel',
        skill: 'sad shows people you need them',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'notice',
        after: 6,
        lines: [
          N('When we show we’re sad, the people who love us can come and help.'),
          N('It’s fine to say, “I feel sad.”'),
        ],
        parentNote: 'Talked about how showing sadness helps the people who love us find us.',
      },
    ],
  ),
  // ------------------------------------------------ step 8 scene: Fidget hatches
  sc(
    's30-fidget',
    [
      N('Crack! An egg hatches in Clover’s kitchen.'),
      N('Out runs a tiny orange Nubbin. Door, window, table, door!'),
      CL('She hasn’t stopped once! I’ll call her Fidget.', 'happy'),
      N('Fidget counts every Nubbin in the kitchen. Then she counts them again.'),
      N('She counts the bread bin too. Just in case.'),
      N('Bristle, Flinch, the fussy one, Drizzle and Dimple. Five Nubbins.'),
      CL('At last! Someone who fusses even more than me.', 'happy'),
      N('Dimple bounces over to say hello. Fidget counts her twice.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'add one more',
        standard: 'K.OA.A.1',
        kind: 'ask',
        after: 5,
        prompt: [N('There were five Nubbins. Now Fidget is here too. How many now?')],
        options: [
          opt('Six', [CL('Six! Five and one more makes six.', 'happy')], true),
          opt('Five', [CL('Five, and one more… Fidget! That makes six.', 'happy')]),
          opt('Seven', [CL('Let’s count on fingers: five… and one more, six. Six!', 'happy')]),
        ],
        parentNote: 'Added one more: five and one make six.',
      },
    ],
  ),
  // ------------------------------------------------ step 8 done: safe in the shed
  sc(
    's30-shed',
    [
      N('At night, frost covers the yard. Fidget gets very busy.'),
      N('She pushes every Nubbin into the shed. Push, push, push!'),
      N('Then she drags a bucket against the door. Bump!'),
      FI('…', 'shock'),
      N('Inside the shed, Dimple bounces and bounces off the walls.'),
      N('The others go very quiet.'),
      CL('Fidget wants them safe. But safe isn’t the same as well.', 'think'),
      N('Clover sits down on the bucket.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'worries try to keep us safe',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'ask',
        after: 3,
        prompt: [N('Fidget is worried. What is she trying to do?')],
        options: [
          opt(
            'Keep everyone safe',
            [N('Yes. Worries try to keep us safe.'), N('Sometimes they try a bit too hard.')],
            true,
          ),
          opt('Be naughty', [
            N('She isn’t being naughty. She’s worried. She wants everyone safe.'),
          ]),
          opt('Play a game', [
            N('It’s not a game to her. She’s worried. She wants everyone safe.'),
          ]),
        ],
        parentNote: 'Learned that worry tries to keep us safe, and can try too hard.',
      },
    ],
  ),
  // ------------------------------------------------ step 9 scene: the blanket plan
  sc(
    's30-blanket-ask',
    [
      CL('I can’t push the bucket away. Fidget would be so scared.', 'sad'),
      CL('And I can’t leave them shut in. Help me?'),
      N('Fidget sits by the bucket, guarding it. Her ball spins and spins.'),
      N('Your Nubbin sits beside her. It stares at the bucket too.'),
      N('There is a blanket on the washing line.'),
      CL('Let’s make it shut, and open, both at once!', 'think'),
    ],
    [
      {
        domain: 'maths',
        skill: 'positions: over, under, beside',
        standard: 'K.G.A.1',
        kind: 'do',
        after: 5,
        check: 'edu:place:blanket:over-door',
        lines: [
          N('(Hang the blanket over the door. Put the bucket beside it.)'),
          N('Now look under the blanket. There’s a gap! Nubbins can go under.'),
        ],
        parentNote: 'Used position words: over the door, beside the door, under the blanket.',
      },
    ],
  ),
  // ------------------------------------------------ step 9 done: shut and open
  sc(
    's30-blanket',
    [
      N('Fidget looks at the blanket. She pushes the bucket. Shut! She sits.'),
      N('Then a nose pokes out under the blanket. Drizzle!'),
      N('Then the fussy one. Then Flinch. Out they come.'),
      N('They go in and out all evening. Fidget counts them every time.'),
      CL('Shut and open. Both! Clever us.', 'happy'),
      N('But Dimple stays inside, at the back of the dark shed.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'finding a way that works for everyone',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 4,
        prompt: [
          N('Fidget wanted the door shut. The others wanted out. Who did the blanket help?'),
        ],
        options: [
          opt(
            'Everyone',
            [N('Yes! Fidget sees it shut. The others can get out. Good for everyone.')],
            true,
          ),
          opt('Only Fidget', [
            N('Look again. Fidget is happy, and the others can get out too. Everyone!'),
          ]),
        ],
        parentNote: 'Saw how one idea can help everyone, even when friends want different things.',
      },
    ],
  ),
  // ------------------------------------------------ step 10 scene: Dimple is gone
  sc(
    's30-gone',
    [
      N('Early, early morning. Clover is at your gate in her slippers.'),
      CL('Dimple’s gone! She took Fossil’s cushion.', 'shock'),
      N('Drizzle wriggles down from Clover’s arms. Off she goes, slow and sure.'),
      CL('Drizzle never goes anywhere on her own!', 'shock'),
      N('Dusty comes up the lane with a spade.'),
      DU('Dimple has gone to a place she was happy with Fossil.', 'soft'),
      N('You all follow Drizzle down the lane.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'asking for help',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'notice',
        after: 3,
        lines: [
          N('Clover is scared. So she comes to her friends for help.'),
          N('When you are scared or worried, you can ask for help too.'),
        ],
        parentNote: 'Heard that asking someone for help is a good thing to do when scared.',
      },
    ],
  ),
  // ------------------------------------------------ step 10 done: the trail
  sc(
    's30-trail',
    [
      N('Look! A cotton reel in the frost.'),
      N('Then a pine cone. Then half a wooden peg.'),
      N('The toys make a trail. It goes to the stripy cliff.'),
      DU('Dimple used to ride on Fossil to the cliff.', 'sad'),
      N('There is a hole under the cliff. Fossil’s egg came from here.'),
      N('Dimple is in the hole, on Fossil’s cushion. Scrape, scrape.'),
      N('The hole isn’t deep for you. But Dimple is too small to climb out.'),
      DI('…'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'first, next, last',
        standard: 'RL.K.3',
        kind: 'do',
        after: 2,
        check: 'edu:order:toys:reel-cone-peg',
        lines: [
          N('(Put the toys in order. Which came first? Next? Last?)'),
          N('Reel first. Cone next. Peg last!'),
        ],
        parentNote: 'Put three events in order: first, next, last.',
      },
    ],
  ),
  // ------------------------------------------------ step 11 scene: Drizzle climbs down
  sc(
    's30-hollow',
    [
      N('Drizzle slides down into the hole. Slowly. Nobody asked her to.'),
      N('She sits close to Dimple. She doesn’t say anything.'),
      N('Dimple smiles big. She gives Drizzle a pebble, a root, some dust.'),
      N('Drizzle doesn’t take them. She just stays.'),
      CL('Should I go down? I should go down!', 'shock'),
      DU('Wait a minute. Drizzle knows what she’s doing.', 'soft'),
      N('You sit down in the grass at the top. Waiting.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'waiting with someone',
        standard: 'CASEL: Self-management',
        kind: 'do',
        after: 6,
        check: 'edu:wait:breathe:3',
        lines: [
          N('(Waiting is hard. Let’s take three slow breaths together.)'),
          N('In… and out. In… and out. In… and out.'),
        ],
        parentNote: 'Practised waiting calmly with three slow breaths.',
      },
    ],
  ),
  // ------------------------------------------------ step 11 done: the smile stops
  sc(
    's30-stopped',
    [
      N('Then Dimple stops bouncing. She sits down on the cushion.'),
      N('Her smile melts away, slowly, like frost on a window.'),
      DI('…', 'sad'),
      N('Up at the top, Clover puts her hands over her mouth.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'name the feeling',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'ask',
        after: 2,
        prompt: [N('Dimple isn’t smiling now. How do you think she feels?')],
        options: [
          opt(
            'Sad',
            [N('Yes. Dimple feels sad. She misses Fossil.'), N('Now her face shows it.')],
            true,
          ),
          opt('Happy', [N('Not just now. Her face is sad. She misses Fossil.')]),
          opt('Cross', [N('Maybe a bit! But mostly sad. She misses Fossil.')]),
        ],
        parentNote: 'Named the feeling “sad” and linked it to missing someone.',
      },
    ],
  ),
  // ------------------------------------------------ step 12 scene: the thunder day
  sc(
    's30-thunder',
    [
      CL('Do you know how Dimple and Fossil met?', 'soft'),
      CL('Dimple hatched under my table, in a big storm. Flash! Boom!'),
      CL('She was a tiny baby. She cried and cried.', 'sad'),
      CL('Then Fossil came down off the windowsill. She sat beside her.'),
      CL('She sat there all through the storm.'),
      CL('After that, they were best friends.', 'happy'),
      CL('Her best thing started on her worst day.', 'soft'),
    ],
    [
      {
        domain: 'science',
        skill: 'thunder is a loud sound',
        standard: '1-PS4-1',
        kind: 'notice',
        after: 1,
        lines: [
          N('Thunder is a very loud sound. Lightning makes the air shake. Boom!'),
          N('It can be scary. Indoors, with someone close, you are safe.'),
        ],
        parentNote: 'Heard that thunder is the sound of air shaking, and what helps in a storm.',
      },
    ],
  ),
  // ------------------------------------------------ step 12 done: blue and gold
  sc(
    's30-blue-gold',
    [
      N('Dimple’s ball goes blue. Deep, deep blue.'),
      N('Then she cries the Nubbin way. A thin whistle, and a shake.'),
      N('She leans on her friend, and cries, and cries.'),
      N('Up at the top, Clover cries too. Dusty holds her.'),
      N('Then Dimple stops. Her ball is blue, and gold too!'),
      DU('I’ve never seen a ball do that.', 'shock'),
      N('Dimple looks up at you all. She has been found.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'two feelings at once',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'notice',
        after: 4,
        lines: [
          N('Blue is for sad. Gold is for happy. Dimple has both at once!'),
          N('You can feel two things at the same time. That’s all right.'),
        ],
        parentNote: 'Learned that we can feel happy and sad at the same time.',
      },
    ],
  ),
  // ------------------------------------------------ step 13 scene: the rope
  sc(
    's30-rope',
    [
      DU('Right. Basket!', 'happy'),
      N('Dusty has a rope with a basket on the end.'),
      DU('Never go near a hole without a rope. That’s my rule.'),
      N('Dimple gets in the basket with the cushion.'),
      CL('Gently! Gently!', 'shock'),
      DU('You pull. I’ll count.', 'soft'),
    ],
    [
      {
        domain: 'science',
        skill: 'a pull moves things',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'do',
        after: 5,
        check: 'edu:pull:rope:hand-over-hand',
        lines: [
          N('(Pull the rope, hand over hand. One, two, three, four!)'),
          N('A pull brings the basket up towards you. Up it comes!'),
        ],
        parentNote: 'Pulled to move something towards them: a pull is a force.',
      },
    ],
  ),
  // ------------------------------------------------ step 13 done: the rim
  sc(
    's30-rim',
    [
      N('Up comes the basket! Clover lifts Dimple out.'),
      N('She cries all over Dimple. Dimple lets her.'),
      CL('Look at me! I’m worse than she is! I need a hanky.', 'sad'),
      N('Dusty gives Clover a sock. A clean one. Mostly.'),
      CL('Crying slows me down, so I can feel things properly.', 'happy'),
      N('Clover laughs. She blows her nose on the sock. Honk!'),
      DU('You can keep the sock.', 'soft'),
    ],
    [
      {
        domain: 'health',
        skill: 'blowing your nose and washing hands',
        kind: 'notice',
        after: 5,
        lines: [
          N('A sock is a funny hanky! A tissue is better.'),
          N('Blow your nose, throw the tissue away, then wash your hands.'),
        ],
        parentNote: 'Talked about blowing your nose and washing hands afterwards.',
      },
    ],
  ),
  // ------------------------------------------------ step 14 scene: up the hill
  sc(
    's30-hill',
    [
      N('That afternoon, Dimple walks up the hill. On her own feet!'),
      N('Drizzle walks beside her. Dusty walks behind with the cushion.'),
      N('At the top is Fossil’s flower. Dimple sits down in front of it.'),
      N('Drizzle sits on one side. Dusty sits on the other.'),
      N('The wind blows. Leaves fall. Nobody needs to say anything.'),
      N('Your Nubbin sits down too.'),
    ],
    [
      {
        domain: 'science',
        skill: 'name the season',
        standard: 'K-ESS2-1',
        kind: 'ask',
        after: 4,
        prompt: [N('Leaves are falling. It is getting cold. What season is it?')],
        options: [
          opt('Autumn', [N('Yes! In autumn, leaves fall and the days get colder.')], true),
          opt('Summer', [N('Summer is hot and sunny. Falling leaves and frost mean autumn.')]),
          opt('Spring', [N('In spring, new leaves grow. Falling leaves mean autumn.')]),
        ],
        parentNote: 'Named autumn from its signs: falling leaves and colder days.',
      },
    ],
  ),
  // ------------------------------------------------ step 14 done: Fidget on the hill
  sc(
    's30-fidget-hill',
    [
      N('Pitter-patter! Tiny feet run up the path. It’s Fidget!'),
      N('Clover left her asleep. She woke up alone, and she is scared.'),
      N('She spins round and round. Her ball spins too.'),
      FI('…', 'shock'),
      N('Dimple gets up. She sits down right beside Fidget.'),
      N('No bouncing. No smiling. She just sits, like Fossil did.'),
      N('Fidget spins slower… and slower… and stops. She leans on Dimple.'),
      CL('Where did Dimple learn that?', 'soft'),
      DU('Under your table. In a storm. Fossil showed her how.', 'soft'),
    ],
    [
      {
        domain: 'sel',
        skill: 'helping a scared friend',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 6,
        prompt: [N('Fidget was scared. How did Dimple help her?')],
        options: [
          opt(
            'She sat beside her',
            [N('Yes. She sat beside her and stayed. Just like Fossil did.')],
            true,
          ),
          opt('She bounced at her', [N('Not this time! She sat beside her and stayed.')]),
          opt('She told her to stop', [
            N('She didn’t tell her anything. She sat beside her and stayed.'),
          ]),
        ],
        parentNote: 'Talked about sitting with a scared friend until they feel calmer.',
      },
    ],
  ),
  // ------------------------------------------------ complete: the rubbing
  sc(
    's30-complete',
    [
      N('On the way home, you stop at Hush’s stone.'),
      N('Clover holds some paper on it. You rub with a black crayon. Swish, swish.'),
      N('The marks come up! Rings, lines, and rings with lines.'),
      CL('Dimple needs a mark of her own.', 'soft'),
      N('You draw her a ring with a line through it. Happy and sad.'),
      CL('That’s Dimple now. Happy and sad. Both!', 'soft'),
      N('Next to it, you draw Drizzle’s mark: a plain ring, touching Dimple’s.'),
      N('Next morning, a parcel from Clover!'),
      N('A blue rain hat, and Fossil’s cushion, all puffed up.'),
    ],
    [
      {
        domain: 'art',
        skill: 'draw a circle and a line',
        standard: 'ELOF: Perceptual, Motor, and Physical Development',
        kind: 'do',
        after: 4,
        check: 'edu:draw:shape:ring-with-line',
        lines: [
          N('(Draw Dimple’s mark with your finger: a big ring, then a line through it.)'),
          N('Round… and across. Happy and sad, together.'),
        ],
        parentNote: 'Drew a circle with a line through it, a mark for happy and sad together.',
      },
    ],
  ),
];

// ================================================================== variants
// Ring-choice clones of the rubbing (SR-20261027-1258): the base scene with Drizzle's ring line swapped.
const ringClone = (suffix: string, at: number, line: Line): EduScene => {
  const base = SCENES.find((s) => s.of === 's30-complete');
  if (!base) throw new Error('missing base scene s30-complete');
  return {
    ...base,
    id: `sprout:s30-complete-${suffix}`,
    of: `s30-complete-${suffix}`,
    lines: base.lines.map((l, i) => (i === at ? line : l)),
    lessons: base.lessons.map((l) => ({
      ...l,
      id: l.id.replace('sprout:s30-complete-l', `sprout:s30-complete-${suffix}-l`),
    })),
  };
};

export const EDU_S30_SPROUT_VARIANTS: EduScene[] = [
  ringClone('broke', 6, N('Next to it, you draw Drizzle’s plain ring, with a gap.')),
  ringClone('sat', 6, N('You draw Drizzle’s plain ring. Then a big ring round you both.')),
  // ---- replaces s30-wall when S1's wall memory was seen
  sc(
    's30-wall-s1',
    [
      N('Frost! The Grove is white and sparkly this morning.'),
      N('Moss is by the old wall. There is frost on his back.'),
      N('A sparrow sits on Moss’s back. Moss lets the sparrow stay.'),
      M('Luna told me about Clover’s gold one.', 'think'),
      M('You remember Hush. You came here with me before.', 'soft'),
      M('She sat with the Nubbins who died, so they weren’t alone.', 'sad'),
      M('Look at the flat stone by your foot. She made it for looking.'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'long ago and today',
        standard: 'D2.His.2.K-2',
        kind: 'notice',
        after: 5,
        lines: [
          M('Hush lived long, long ago. But her stone is still here today.'),
          N('Old things can tell us about people who lived long ago.'),
        ],
        parentNote: 'Heard how an old stone helps us remember people from long ago.',
      },
    ],
  ),
  // ---- plays after s30-drizzle when s5Done
  sc(
    's30-hole-youngest',
    [
      N('Here comes your youngest Nubbin. Fossil sat with it once, until dark.'),
      N('It climbs into the hole. It sits on Dusty’s boot.'),
      DU('Oh, not you as well!', 'sad'),
      N('Dusty laughs and cries at the same time.'),
      DU('Fossil taught you both how to sit with someone.', 'happy'),
    ],
    [
      {
        domain: 'maths',
        skill: 'count to 3',
        standard: 'K.CC.B.5',
        kind: 'ask',
        after: 1,
        prompt: [N('Dusty, Drizzle and your Nubbin are in the hole. How many?')],
        options: [
          opt('Three', [N('Yes! Dusty, one. Drizzle, two. Your Nubbin, three.')], true),
          opt('Two', [N('Let’s count: Dusty, Drizzle, your Nubbin. One, two, three!')]),
        ],
        parentNote: 'Counted three friends in the hole.',
      },
    ],
  ),
  // ---- replaces s30-gone when s30-ring = helped
  sc(
    's30-gone-helped',
    [
      N('Early, early morning. Clover is at your gate in her slippers.'),
      CL('Dimple’s gone! She took Fossil’s cushion.', 'shock'),
      CL('Drizzle won’t come out from under the rain butt.', 'sad'),
      CL('I didn’t know who else to ask.', 'sad'),
      N('Dusty comes up the lane with a spade.'),
      DU('Dimple has gone to a place she was happy with Fossil.', 'soft'),
      N('The three of you set off to find her.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'asking for help',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'notice',
        after: 3,
        lines: [
          N('Clover is worried. So she asks her friends to help.'),
          N('When you are worried, you can ask for help too.'),
        ],
        parentNote: 'Heard that asking someone for help is a good thing to do when worried.',
      },
    ],
  ),
  // ---- replaces s30-trail when s5Done
  sc(
    's30-trail-s5',
    [
      N('By your pond there is a sock. Fossil swam here once.'),
      N('Under Hazel’s crooked tree there is half a peg. Fossil ate fruit here.'),
      DU('This is Fossil’s last walk! Backwards! Pond, tree, cliff.', 'shock'),
      N('The trail goes on to the stripy cliff. There’s a hole underneath.'),
      N('Dimple is in the hole, on Fossil’s cushion. Scrape, scrape.'),
      N('The hole isn’t deep for you. But Dimple is too small to climb out.'),
      DI('…'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'first, next, last, and backwards',
        standard: 'RL.K.3',
        kind: 'ask',
        after: 2,
        prompt: [
          DU('Fossil went cliff, tree, pond. Dimple goes backwards. Where does she go last?'),
        ],
        options: [
          opt(
            'The cliff',
            [DU('Yes. Pond first, tree next, cliff last. Backwards!', 'soft')],
            true,
          ),
          opt('The pond', [
            DU('The pond was first for Dimple. Then tree. Then cliff, last!', 'soft'),
          ]),
        ],
        parentNote: 'Put a walk in order, then thought about it backwards.',
      },
    ],
  ),
  // ---- replaces s30-hollow when s30-ring = helped
  sc(
    's30-hollow-helped',
    [
      N('Drizzle is at home. So you climb down into the hole.'),
      N('You sit at the back, in the dust.'),
      N('Dimple smiles big. She bounces and bounces at you.'),
      N('She does all her party tricks. You don’t stop her. You stay.'),
      CL('Should I come down?', 'shock'),
      DU('Wait. She’s nearly out of tricks.', 'soft'),
      N('It takes a long, long time.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'waiting with someone',
        standard: 'CASEL: Self-management',
        kind: 'do',
        after: 6,
        check: 'edu:wait:breathe:3',
        lines: [
          N('(Waiting is hard. Let’s take three slow breaths together.)'),
          N('In… and out. In… and out. In… and out.'),
        ],
        parentNote: 'Practised waiting calmly with three slow breaths.',
      },
    ],
  ),
  // ---- plays after s30-stopped when s5Done
  sc(
    's30-hollow-youngest',
    [
      N('Wheee! Your youngest Nubbin slides down into the hole.'),
      N('It sits on Dimple’s other side.'),
      N('Fossil sat with it once. It remembers how.'),
      DU('Course it does.', 'soft'),
    ],
    [
      {
        domain: 'sel',
        skill: 'learning kindness from others',
        standard: 'CASEL: Social awareness',
        kind: 'notice',
        after: 2,
        lines: [N('When someone is kind to us, we learn how to be kind too.')],
        parentNote: 'Heard that we learn kindness from people who are kind to us.',
      },
    ],
  ),
  // ---- replaces s30-hill when s30-ring = helped
  sc(
    's30-hill-helped',
    [
      N('That afternoon, Dimple walks up the hill. On her own feet!'),
      N('You walk beside her. She checks that you are still there.'),
      N('At the top is Fossil’s flower. Dimple sits down in front of it.'),
      N('You sit on one side. Dusty sits on the other.'),
      N('The wind blows. Leaves fall. Nobody needs to say anything.'),
      N('Your Nubbin sits down too.'),
    ],
    [
      {
        domain: 'science',
        skill: 'name the season',
        standard: 'K-ESS2-1',
        kind: 'ask',
        after: 4,
        prompt: [N('Leaves are falling. It is getting cold. What season is it?')],
        options: [
          opt('Autumn', [N('Yes! In autumn, leaves fall and the days get colder.')], true),
          opt('Summer', [N('Summer is hot and sunny. Falling leaves and frost mean autumn.')]),
          opt('Spring', [N('In spring, new leaves grow. Falling leaves mean autumn.')]),
        ],
        parentNote: 'Named autumn from its signs: falling leaves and colder days.',
      },
    ],
  ),
  // ---- replaces s30-complete when s30-ring = helped
  sc(
    's30-complete-helped',
    [
      N('On the way home, you stop at Hush’s stone.'),
      N('Clover holds some paper on it. You rub with a black crayon. Swish, swish.'),
      N('The marks come up! Rings, lines, and rings with lines.'),
      CL('Dimple needs a mark of her own.', 'soft'),
      N('You draw her a ring with a line through it. Happy and sad.'),
      CL('That’s Dimple now. Happy and sad. Both!', 'soft'),
      N('Clover draws a plain ring, just touching Dimple’s. That’s yours!'),
      N('Next morning, a parcel from Clover!'),
      N('A blue rain hat, and Fossil’s cushion, all puffed up.'),
    ],
    [
      {
        domain: 'art',
        skill: 'draw a circle and a line',
        standard: 'ELOF: Perceptual, Motor, and Physical Development',
        kind: 'do',
        after: 4,
        check: 'edu:draw:shape:ring-with-line',
        lines: [
          N('(Draw Dimple’s mark with your finger: a big ring, then a line through it.)'),
          N('Round… and across. Happy and sad, together.'),
        ],
        parentNote: 'Drew a circle with a line through it, a mark for happy and sad together.',
      },
    ],
  ),
  // ---- afterwards: Keeper talk lines once s30Done
  sc(
    's30-after-clover',
    [
      N('Clover’s shed door is half shut every night now. Fidget likes it that way.'),
      N('Dimple and Drizzle sleep on the windowsill, side by side.'),
      CL('Dimple still smiles most days. And when she’s sad, I know where to look.', 'soft'),
      N('Gold and pale blue, snuggled up in the sun.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'half',
        standard: 'ELOF: Mathematics Development',
        kind: 'notice',
        after: 0,
        lines: [N('Half shut means half open too. Half and half make a whole door!')],
        parentNote: 'Heard that two halves make a whole.',
      },
    ],
  ),
  sc(
    's30-after-dusty',
    [
      DU('I go and sit with Fossil’s flower on Thursdays.', 'soft'),
      DU('Dimple comes too. Sometimes she gets there first.'),
      DU('We don’t do anything. It’s the best bit of the week.', 'happy'),
      DU('Don’t tell Clover. She’ll bring a flask!', 'happy'),
    ],
    [
      {
        domain: 'maths',
        skill: 'days of the week in order',
        standard: 'ELOF: Mathematics Development',
        kind: 'ask',
        after: 0,
        prompt: [DU('Thursday! Which day comes just before Thursday?')],
        options: [
          opt('Wednesday', [DU('Yes. Wednesday, then Thursday. Then Friday!', 'happy')], true),
          opt('Saturday', [
            DU('Saturday comes later. Monday, Tuesday, Wednesday… Thursday!', 'soft'),
          ]),
        ],
        parentNote: 'Put days of the week in order.',
      },
    ],
  ),
  sc(
    's30-after-byte',
    [
      BY('I’m keeping a chart of Dimple’s ball. For science.', 'think'),
      BY('Mostly gold. Sometimes blue. Sometimes both!', 'soft'),
      BY('So I made a new column for both. It’s my favourite.', 'soft'),
      BY('Pixel says three columns is showing off. Pixel is wrong.'),
      BY('Also, she pulled my laces on Tuesday. Both of them!', 'happy'),
    ],
    [
      {
        domain: 'maths',
        skill: 'sort into groups',
        standard: 'K.MD.B.3',
        kind: 'do',
        after: 2,
        check: 'edu:sort:balls:gold-blue-both',
        lines: [
          N('(Help Byte sort the balls: gold here, blue there, both in the middle.)'),
          BY('Three groups. Perfect.', 'happy'),
        ],
        parentNote: 'Sorted things into three groups, including a group for “both”.',
      },
    ],
  ),
  sc(
    's30-after-sparks',
    [
      SP('I sat still! On the hill! With Dimple!', 'happy'),
      SP('Byte counted. I sat for nearly a whole minute!', 'happy'),
      SP('It was really nice. It was really hard. It was really nice.', 'soft'),
      N('Sparks wriggles. Sitting still is tricky for her.'),
    ],
    [
      {
        domain: 'health',
        skill: 'keeping still and counting',
        standard: 'ELOF: Perceptual, Motor, and Physical Development',
        kind: 'do',
        after: 2,
        check: 'edu:sit:still:count-10',
        lines: [
          N('(Can you sit as still as a stone while we count to ten?)'),
          SP('One, two, three… ten! You beat me!', 'happy'),
        ],
        parentNote: 'Practised keeping still while counting to ten.',
      },
    ],
  ),
];

// ================================================================== the quest
export const EDU_S30_SPROUT: EduQuest[] = [
  {
    id: 'sprout:s30',
    of: 's30',
    band: 'sprout',
    title: 'What Sad Is For',
    goals: {
      's30-step1': {
        goal: 'Go to Clover’s house for tea. Meet her Nubbins.',
        hint: 'Clover’s house has a big windowsill and a rain butt.',
      },
      's30-step2': {
        goal: 'Go out to the yard. See what Dimple is doing.',
        hint: 'Go round the back, by the rain butt. Go quietly!',
      },
      's30-step3': {
        goal: 'Play the party games with Dimple.',
        hint: 'A streamer race, a hat toss, and cake. Nobody can lose.',
      },
      's30-step4': {
        goal: 'Watch Dimple with her five favourite things.',
        hint: 'Sill, puddles, fast Nubbins, Byte’s laces, bedtime hum.',
      },
      's30-step5': {
        goal: 'Wait by Dusty’s hole.',
        hint: 'Don’t dig. Just stand by the hole for a little while.',
      },
      's30-step6': {
        goal: 'Walk up the hill path with Luna at night.',
        hint: 'No lantern. The Moon gives enough light.',
      },
      's30-step7': {
        goal: 'Look at Hush’s flat stone in the old wall.',
        hint: 'It’s low down by the wall. Brush the frost off.',
      },
      's30-step8': {
        goal: 'Go to Clover’s at bedtime. See how Fidget is.',
        hint: 'Get there when the sky goes dark.',
      },
      's30-step9': {
        goal: 'Open the shed. Don’t scare Fidget!',
        hint: 'Hang the blanket over the door. Bucket on the edge. Leave a gap.',
      },
      's30-step10': {
        goal: 'Follow Dimple’s toys and find her.',
        hint: 'She dropped her toys as she went. Follow them!',
      },
      's30-step11': {
        goal: 'Stay by the hole until Dimple stops.',
        hint: 'Don’t call her. Just stay. It takes a while.',
      },
      's30-step12': { goal: 'Listen to Clover’s story.', hint: 'Sit by the hole and listen.' },
      's30-step13': { goal: 'Pull the basket up.', hint: 'Pull hand over hand, nice and steady.' },
      's30-step14': {
        goal: 'Sit with Dimple by Fossil’s flower.',
        hint: 'Sit down near her and stay.',
      },
    },
    scenes: SCENES,
    notes:
      'One lesson per scene, two in the big ones (s30-sill, s30-stone). Domains: sel (face and feeling, sitting with a sad ' +
      'friend, worry keeps us safe, naming sad, two feelings at once, asking for help, helping a scared friend), maths ' +
      '(counting, zero, adding one, circles, positions, halves, sorting, days), science (acorns, hum vibration, worms, owls, the ' +
      'Moon, frost, thunder, pulling, autumn), literacy (rhyme, first-next-last), art, health, social studies. The acorn ' +
      'choice keeps all three ids. Fossil’s death is said plainly once (s30-smile) with the flower and remembering straight ' +
      'after. The two quoted lines are replaced with original lines. Nubbins only have “…” lines.',
  },
];

/** Every `edu:` check used by a `do` lesson in this file. */
export const CHECKS: string[] = [
  'edu:count:toys:4',
  'edu:hum:hand-on-throat',
  'edu:tap:shape:ring-with-line',
  'edu:place:blanket:over-door',
  'edu:order:toys:reel-cone-peg',
  'edu:wait:breathe:3',
  'edu:pull:rope:hand-over-hand',
  'edu:draw:shape:ring-with-line',
  'edu:sort:balls:gold-blue-both',
  'edu:sit:still:count-10',
];
