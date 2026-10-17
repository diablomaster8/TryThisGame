/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): S29 The Gates of Dawn.
 *
 * Source: side-stories-s29.ts. One EduScene per original scene (15 step scenes, 14 done scenes,
 * the complete scene and the 10 variants), id `sprout:<original id>`. See EDU-STYLE.md.
 *
 * - Teaches rivers (bow, island, weir, ford, source to sea), otters and clean rivers, water safety
 *   (cork vests, sitting still, never on the water alone, staying still when lost), and
 *   homesickness: how to help a friend who misses home.
 * - Choice ids and `set` flags are copied from the originals. s29-lessons keeps all three gifts.
 *   s29-packing leaves out `held` (holding Marina by force while she says “let go”), with
 *   `defaultChoice: 'sat'`. sprout:s29-complete (the `held` ending) is still written, gently.
 * - No Grahame text: the lifted lines are swapped for the source's own `childLines` or new lines.
 * - Fossil is never named before s29-supper. Her death is said plainly there, with comfort after.
 *   The Lantern Song's “sleeping eyes” line is not sung in this band (EDU-STYLE: death is never
 *   sleep); the narrator says the children sing a verse.
 * - Nubbins and otters never speak. The island at dawn stays unexplained: no figure, no name.
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
const MA = say('marina');
const DU = say('dusty');
// new speakers (declared in side-stories-s29.ts)
const GB = say('granny-brock');
const SF = say('s29-seafarer');

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

// ================================================================== shared pieces
// ---------------------------------------------------------------- step 6 done: the kitchen
const kitchenLines = (dustyListens: Line[]): Line[] => [
  N('The door opens. An old woman holds up a candle. She looks cross.'),
  GB('Who’s ringing my bell? Nobody rings my bell!', 'angry'),
  MA('Granny Brock, it’s Marina. We’re lost. Dusty is frozen.'),
  N('Granny Brock looks at your Nubbin. Your Nubbin looks back.'),
  GB('In. All of you. Boots off.'),
  N('Inside is a warm kitchen with a big red fire.'),
  N('She gives you soup. And bread. And more soup!'),
  GB('People come and go. The Wood stays. So do I.'),
  ...dustyListens,
];

// ---------------------------------------------------------------- step 8: up the river
const RIVER_START: Line[] = [
  N('Late summer. Dusty takes an oar and sits down first!'),
  MA('Look at that. Sitting down! You’re a sailor now.', 'happy'),
];

// ---------------------------------------------------------------- step 10: the supper
const SUPPER_START: Line[] = [
  N('You bring the sticks. Soon the fire is warm and gold.'),
  N('By the stove is a round basket. Nobody sits by it.'),
];
const SUPPER_END: Line[] = [
  N('Tap, tap, on the path! A lantern bobs up to the window.'),
  N('Children from the valley! They heard Dusty was home.'),
  N('They sing one soft verse of the Lantern Song.'),
  DU('Thank you. Come in, all of you! There are biscuits.', 'soft'),
];

// ---------------------------------------------------------------- step 12: up the river by night
const NIGHT_END: Line[] = [
  N('You lift the boat past the weir. Then on, up the still water.'),
  N('Then you hear something. Soft, like wind in the reeds.'),
  N('Marina stops rowing. Your Nubbin stands up and listens.'),
  N('The sky turns pink and pearly. It is nearly morning.'),
];

// ---------------------------------------------------------------- step 13: home to the ford
const FORD_START: Line[] = [
  N('The sun is up. You row back to the ford.'),
  N('The old otter is still on his stone. Dusty is there too.'),
  N('Portly wakes up. Splash! In he jumps.'),
  N('Two otters in the water, round and round each other.'),
  DU('Oh. Oh, look at them!', 'soft'),
  MA('Look at me, crying. Must’ve been the early start.', 'soft'),
];
const FORD_END: Line[] = [
  DU('That’s a thank-you, that is.', 'soft'),
  N('Then the two otters swim away down the river.'),
];

// ---------------------------------------------------------------- step 15: laid up
const COMPLETE_START: Line[] = [
  N('Under the willows, you turn the boat upside down. Gently.'),
  N('It looks like a big beetle having a rest.'),
];
const COMPLETE_END: Line[] = [
  MA('Here. Keep the picnic rug. It still smells of gherkins!', 'happy'),
  MA('Come and take the little winter boat out with me. Vests on!', 'think'),
  DU('Same time next summer?', 'soft'),
  MA('Sooner! March, if it’s sunny.', 'happy'),
  N('Down at the ford, a little brown head pops up. Then it’s gone.'),
];

// ================================================================== scenes
const SCENES: EduScene[] = [
  // ------------------------------------------------ step 1 scene: Dusty comes up
  sc(
    's29-digging',
    [
      N('It is summer. The stream smells of warm mud.'),
      N('Marina paints her boat blue. Swish, swish.'),
      N('Then the grass wiggles. Bump! Bump!'),
      N('Two muddy hands pop up. Then a muddy head. It’s Dusty!'),
      DU('Oh, crumbs! Oh, rubble!', 'shock'),
      DU('I dig and dig. Then my rooms fall in!', 'angry'),
      DU('No more digging. Not today!'),
      MA('Come on, Dusty. Come in my boat!', 'happy'),
      DU('A boat? I’ve only ever been in a hole.'),
    ],
    [
      {
        domain: 'science',
        skill: 'animals that live in burrows under the ground',
        standard: 'K-ESS3-1',
        kind: 'ask',
        after: 8,
        prompt: [N('Dusty’s home is a hole in the ground. Which animal lives underground too?')],
        options: [
          opt(
            'A rabbit',
            [MA('Yes! Rabbits dig burrows. So do moles and badgers.', 'happy')],
            true,
          ),
          opt('A fish', [MA('Fish live in the water. Rabbits live in burrows under the ground.')]),
          opt('A bird', [MA('Most birds live in nests. Rabbits dig burrows under the ground.')]),
        ],
        parentNote:
          'Learned that some animals, like rabbits and moles, make their homes underground.',
      },
    ],
  ),
  // ------------------------------------------------ step 1 done: the launch
  sc(
    's29-launch',
    [
      N('Splash! The boat goes into the stream.'),
      N('Your Nubbin jumps in first. It sits right at the front.'),
      MA('The front of a boat is called the bow.', 'happy'),
      DU('It’s moving! Is it meant to do that?', 'shock'),
      MA('Yes, love. That’s what boats do.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'position words: front and back',
        standard: 'K.G.A.1',
        kind: 'do',
        after: 2,
        check: 'edu:tap:boat:bow',
        lines: [
          N('(Point to the front of the boat. Tap the bow!)'),
          MA('That’s it. The front is the bow. The back is the stern.'),
        ],
        parentNote: 'Found the front of the boat and heard the words bow (front) and stern (back).',
      },
    ],
  ),
  // ------------------------------------------------ step 2 scene: messing about in boats
  sc(
    's29-boats',
    [
      MA('Vests on first! Nobody comes in my boat without one.', 'think'),
      N('The vests are made of cork. Cork floats.'),
      N('Dusty puts theirs on back to front. Oops! Try again.'),
      N('Marina rows. The bank slides away.'),
      DU('What do you do in a boat all day?', 'think'),
      MA('Oh, everything and nothing. It’s the best thing there is.', 'soft'),
      N('Your Nubbin leans out at the front. Its ears blow flat. Whoosh!'),
    ],
    [
      {
        domain: 'health',
        skill: 'water safety: a life vest, and a grown-up, every time',
        standard: 'ELOF: Perceptual, Motor, and Physical Development',
        kind: 'ask',
        after: 1,
        prompt: [N('What do we put on before we get in a boat?')],
        options: [
          opt(
            'A life vest',
            [MA('Yes! A vest helps you float. And a grown-up always comes too.', 'happy')],
            true,
          ),
          opt('Wellies', [MA('Wellies are good for puddles. In a boat, we wear a vest.')]),
          opt('A sun hat', [MA('A hat is for sun. A vest keeps you safe on water.')]),
        ],
        parentNote:
          'Talked about water safety: always a life vest, and always a grown-up, in a boat.',
      },
    ],
  ),
  // ------------------------------------------------ step 2 done: the picnic
  sc(
    's29-picnic',
    [
      N('The boat stops by a big green willow tree.'),
      N('Marina opens her basket. Out comes the food!'),
      MA('Chicken. Ham. Two loaves. Three cheeses. Gherkins. Cake!', 'happy'),
      DU('Wait! Stop! Nobody could eat all that!', 'shock'),
      N('Bubbles in the water. Pop, pop! Then a brown, whiskery head.'),
      N('Then a small round head. It’s a baby otter!'),
      MA('Shh. That’s the old otter. I call the little one Portly.', 'soft'),
      N('Portly climbs out. He grabs a gherkin and runs. Drip, drip!'),
      DU('He took a gherkin! He looked right at me!', 'shock'),
    ],
    [
      {
        domain: 'maths',
        skill: 'count to answer “how many?”',
        standard: 'K.CC.B.5',
        kind: 'ask',
        after: 2,
        prompt: [N('How many cheeses did Marina bring? (Count on your fingers.)')],
        options: [
          opt('Three', [MA('Three cheeses! One, two, three. Far too many.', 'happy')], true),
          opt('Two', [MA('Two was the loaves! Let’s count the cheeses: one, two, three.')]),
          opt('Five', [MA('Not that many! One, two, three. Three cheeses.')]),
        ],
        parentNote: 'Counted the cheeses in Marina’s picnic (three).',
      },
      {
        domain: 'science',
        skill: 'where otters live and what they need',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'notice',
        after: 6,
        lines: [
          MA('Otters live by rivers. They swim, and they catch fish.', 'soft'),
          MA('Their fur is so thick, they stay warm in cold water.'),
        ],
        parentNote:
          'Learned that otters live by rivers, catch fish and have thick fur to keep warm.',
      },
    ],
  ),
  // ------------------------------------------------ step 3 scene: Dusty takes the oars
  sc(
    's29-oars',
    [
      DU('Let me row! Anyone can row.'),
      MA('Not today, Dusty. Sit down!', 'think'),
      N('Dusty stands up and grabs both oars.'),
      N('One oar pulls. One oar slips. Dusty falls over backwards!'),
      N('The boat tips… and tips… SPLASH!'),
      N('Everybody pops up like corks. Bob, bob! The vests work.'),
      N('The Nubbins swim to the bank in a neat little line.'),
      MA('That’s why we sit down in boats. Everyone’s fine. Paddle in!'),
    ],
    [
      {
        domain: 'science',
        skill: 'things that float: cork vests hold us up',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'ask',
        after: 5,
        prompt: [N('Everybody bobbed up. What helped them float?')],
        options: [
          opt(
            'Their cork vests',
            [MA('Yes! Cork floats, so the vests hold us up. We always wear them.', 'happy')],
            true,
          ),
          opt('They held their breath', [
            MA('That doesn’t keep you up for long. The cork vests did!'),
          ]),
          opt('Their boots', [MA('Boots get heavy in water! It was the cork vests.')]),
        ],
        parentNote: 'Learned that cork floats, and that life vests hold us up in the water.',
      },
    ],
  ),
  // ------------------------------------------------ step 3 done: by the fire
  sc(
    's29-fire',
    [
      N('Marina gets everyone out. Then the basket. Then the boat.'),
      N('She makes a little fire. Dusty sits by it, wrapped in the rug.'),
      DU('I’m sorry. I tipped your boat. I spoiled the picnic.', 'sad'),
      MA('Never mind. Honestly. Never mind.', 'soft'),
      DU('The cheese is in the river!'),
      MA('Then the fish get a picnic too. Never mind!', 'happy'),
      N('She says it again and again, until Dusty smiles.'),
      MA('Tomorrow I’ll teach you both to row properly.', 'happy'),
    ],
    [
      {
        domain: 'sel',
        skill: 'saying sorry, and forgiving',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'ask',
        after: 3,
        prompt: [N('Dusty said sorry. What did Marina do?')],
        options: [
          opt(
            'She forgave Dusty',
            [N('Yes. She said “never mind”. Now Dusty can feel better.')],
            true,
          ),
          opt('She shouted', [N('Listen again. Marina didn’t shout. She said “never mind”.')]),
          opt('She went home', [N('She stayed! She said “never mind”, and made a fire.')]),
        ],
        parentNote: 'Talked about saying sorry and forgiving someone after a mistake.',
      },
    ],
  ),
  // ------------------------------------------------ step 4 scene: lessons (the gift)
  sc(
    's29-lessons',
    [
      MA('Lesson one: sit down. Lesson two: stay sat down!', 'think'),
      MA('Oars in. Pull. Oars out. In, pull, out!'),
      N('In, pull, out! In, pull, out! (Say it together.)'),
      N('Marina gives your Nubbin a tiny vest. It marches up and down. So proud!'),
      N('A little brown head follows the boat. It’s Portly!'),
      MA('He likes you. Give him something to keep. Not food.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'a repeating pattern',
        standard: 'ELOF: Mathematics Development',
        kind: 'do',
        after: 2,
        check: 'edu:clap:pattern:in-pull-out',
        lines: [
          N('(Clap it with the oars: in, pull, out. In, pull, out. What comes next?)'),
          MA('In! You’ve got it. That’s a pattern.', 'happy'),
        ],
        parentNote: 'Clapped a repeating pattern (in, pull, out) and said what comes next.',
      },
    ],
    {
      choices: [
        {
          id: 'bead',
          label: 'A blue glass bead.',
          set: { 's29-gift': 'bead' },
          then: [
            N('You hold out a blue glass bead. Portly takes it, gently.'),
            N('He rolls it on a stone. The light shines through it.'),
          ],
        },
        {
          id: 'ribbon',
          label: 'A red ribbon.',
          set: { 's29-gift': 'ribbon' },
          then: [
            N('You lay a red ribbon on the bank.'),
            N('Portly swims off with it. It floats behind him like a flag!'),
          ],
        },
        {
          id: 'bell',
          label: 'A tiny brass bell.',
          set: { 's29-gift': 'bell' },
          then: [
            N('Marina puts the bell on a soft, loose loop. It slips off easily.'),
            N('Portly shakes. Ting-a-ling! He shakes again. Ting-a-ling!'),
          ],
        },
      ],
    },
  ),
  // ------------------------------------------------ step 4 done
  sc(
    's29-lessons-done',
    [
      N('Portly carries his present home along the bank.'),
      N('He stops to look at it. Then he goes on.'),
      DU('He never steals your things. That means he likes you!', 'happy'),
      MA('Same time next week. And nobody stands up in my boat!', 'happy'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'first, next, last: the order of events',
        standard: 'RL.K.3',
        kind: 'ask',
        after: 3,
        prompt: [N('Think about today. What happened first?')],
        options: [
          opt(
            'Marina gave a rowing lesson',
            [N('Yes! First the lesson. Next the present. Last, Portly went home.')],
            true,
          ),
          opt('Portly went home', [N('That was last! First came the rowing lesson.')]),
        ],
        parentNote: 'Put the day’s events in order: first, next, last.',
      },
    ],
  ),
  // ------------------------------------------------ step 5 scene: the Wild Wood
  sc(
    's29-wildwood',
    [
      N('It is summer, but there is frost on the grass. Brr!'),
      N('Marina runs to your gate with a lantern.'),
      MA('Dusty went into the Wild Wood. All alone. And it’s getting dark!', 'angry'),
      N('Later, Dusty tells what happened.'),
      N('The wood was dark and cold. Crunch, crunch went the frost.'),
      N('Dusty thought they saw little eyes. Then came pitter-pat noises.'),
      N('Dusty ran. They hid inside a big hollow tree.'),
      MA('Wood rules: stay on the path. Don’t run. Keep talking.', 'think'),
      MA('Don’t worry. We’ll find Dusty. Come on.', 'soft'),
    ],
    [
      {
        domain: 'health',
        skill: 'what to do if you get lost',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 7,
        prompt: [N('If you get lost, what is a good thing to do?')],
        options: [
          opt(
            'Stay still and call out',
            [MA('Yes. Stay still and call. Then grown-ups can find you.', 'soft')],
            true,
          ),
          opt('Run and run', [MA('Running can make you more lost. Stay still and call out.')]),
          opt('Hide and keep quiet', [
            MA('Then nobody can hear you! Stay still and call out loud.'),
          ]),
        ],
        parentNote: 'Talked about what to do if lost: stay still and call out for help.',
      },
    ],
  ),
  // ------------------------------------------------ step 5 done: the beech
  sc(
    's29-beech',
    [
      N('You go in with the lantern. You keep talking.'),
      MA('Let’s count, all the way to ten. Ready?'),
      N('Little eyes peep at the edge of the light. Shy ones. They stay back.'),
      N('Your Nubbin hides in your coat. Only its eyes peep out.'),
      N('A tiny voice says “Ow.” It’s Dusty, in the hollow tree!'),
      DU('I only wanted a look.', 'sad'),
      MA('I know. You’re cold. Up you get.', 'soft'),
      N('But the path is gone under the frost. The lantern is low.'),
      MA('We can’t get home tonight. Let’s find somewhere warm.', 'think'),
    ],
    [
      {
        domain: 'maths',
        skill: 'count to 10',
        standard: 'K.CC.A.1',
        kind: 'do',
        after: 1,
        check: 'edu:count:aloud:10',
        lines: [
          N('(Count to ten together: one, two, three… all the way to ten!)'),
          MA('Ten! Talking and counting help us feel brave.', 'happy'),
        ],
        parentNote: 'Counted aloud to ten, and heard that talking can help when we feel scared.',
      },
    ],
  ),
  // ------------------------------------------------ step 6 scene: the door
  sc(
    's29-door',
    [
      N('You hold hands. Dusty is in the middle.'),
      N('Bonk! Dusty trips over something hard.'),
      DU('Ow! Who leaves a thing like that in a wood?', 'angry'),
      MA('It’s a boot-scraper! That means there’s a door near here.', 'happy'),
      DU('Then I’ll dig. I’m good at digging after all.'),
      N('Under the frost is a little green door in the bank.'),
      N('Marina pulls the bell. Clank! Far away, deep inside.'),
      N('Then the bolts slide back. One, two, three, four.'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'clues from old things tell us about people',
        standard: 'D2.His.2.K-2',
        kind: 'ask',
        after: 3,
        prompt: [N('A boot-scraper is by a door. What is it for?')],
        options: [
          opt(
            'Scraping mud off boots',
            [MA('Yes! People scrape their boots before they go in. So people live here!', 'happy')],
            true,
          ),
          opt('Stirring soup', [MA('Ha! No. It scrapes muddy boots, by a front door.')]),
        ],
        parentNote: 'Used a clue (a boot-scraper) to work out that people lived nearby.',
      },
    ],
  ),
  // ------------------------------------------------ step 6 done: Granny Brock's kitchen
  sc(
    's29-kitchen',
    kitchenLines([N('Dusty listens very hard. Dusty has an old friend at home too.')]),
    [
      {
        domain: 'literacy',
        skill: 'what a character does shows what they are like',
        standard: 'RL.K.3',
        kind: 'ask',
        after: 6,
        prompt: [N('Granny Brock sounds cross. But is she kind?')],
        options: [
          opt(
            'Yes, she gives soup and a warm fire',
            [N('Yes! She sounds grumpy, but she is kind.')],
            true,
          ),
          opt('No, she is just cross', [
            N('She sounds cross. But she let us in and fed us. That’s kind!'),
          ]),
        ],
        parentNote:
          'Noticed that what Granny Brock does (soup, fire) shows she is kind, even when she sounds cross.',
      },
    ],
  ),
  // ------------------------------------------------ step 7 scene: the culvert
  sc(
    's29-culvert',
    [
      N('Morning. Granny Brock is up first, in her big boots.'),
      GB('Not back through the Wood. We’ll go under it.'),
      N('She takes a lantern. Down some steps. Down some more.'),
      N('Here is an old tunnel made of bricks. It is low and round.'),
      N('Your Nubbin runs ahead. Then it runs back to check on you.'),
      GB('That one’s sensible. Goes ahead, comes back.', 'think'),
    ],
    [
      {
        domain: 'maths',
        skill: 'position words: over and under',
        standard: 'K.G.A.1',
        kind: 'ask',
        after: 1,
        prompt: [N('Are we going over the wood, or under it?')],
        options: [
          opt('Under', [GB('Under. Down a tunnel, under all those trees.', 'think')], true),
          opt('Over', [GB('Can you fly? No? Then we go under, in a tunnel.')]),
        ],
        parentNote: 'Used the position words over and under.',
      },
    ],
  ),
  // ------------------------------------------------ step 7 done: the fields
  sc(
    's29-fields',
    [
      N('Light at the end of the tunnel! Out you come, by a field.'),
      N('The wood looks quiet now. Just trees.'),
      GB('Go home. Come in the day, if you like. Bring cake.', 'think'),
      N('She goes back in. Clunk go the bolts.'),
      DU('I’m a river person now. You can see what’s coming on a river.', 'soft'),
      MA('Otters can see you too!', 'happy'),
      DU('Otters are allowed.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'scared feelings pass',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'ask',
        after: 4,
        prompt: [N('Dusty was scared last night. How does Dusty feel now?')],
        options: [
          opt(
            'Safe and better',
            [MA('Yes. Scared feelings pass. Friends help them pass.', 'soft')],
            true,
          ),
          opt('Still very scared', [
            MA('Dusty is out in the sunshine now. The scared feeling is going.'),
          ]),
        ],
        parentNote: 'Talked about how scared feelings pass, and how friends help.',
      },
    ],
  ),
  // ------------------------------------------------ step 8 scene: the low river (s4Done unset)
  sc(
    's29-low-river',
    [
      ...RIVER_START,
      N('But the river is low. The stones stick out, all dry.'),
      MA('The water is too low. A whole hand too low.', 'think'),
      N('Bump! The boat stops on the stones. Everybody out!'),
      N('You carry the boat. The water is so cold!'),
      DU('Cold? In August?', 'shock'),
    ],
    [
      {
        domain: 'maths',
        skill: 'compare: high and low',
        standard: 'K.MD.A.2',
        kind: 'ask',
        after: 3,
        prompt: [N('Look at the dry stones. Is the river high or low?')],
        options: [
          opt('Low', [MA('Low. Those stones should be under the water.', 'think')], true),
          opt('High', [MA('Look at the stones. They stick out! The water is low.')]),
        ],
        parentNote: 'Compared high and low water by looking at the stones.',
      },
    ],
  ),
  // ------------------------------------------------ step 8 done: the weir
  sc(
    's29-weir',
    [
      N('Up the river is a weir. Whoosh! Roar!'),
      N('A weir is a little wall across a river. Water spills over it.'),
      N('Above the weir is a small island, with willows and long grass.'),
      MA('Nobody lands on that island.', 'soft'),
      DU('Why not?'),
      MA('I don’t know. Nobody does. My gran didn’t either.', 'think'),
      MA('Come on. Let’s tie up the boat and walk home.'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'land and water: what an island is',
        standard: 'D2.Geo.2.K-2',
        kind: 'ask',
        after: 2,
        prompt: [N('What goes all the way round an island?')],
        options: [
          opt('Water', [MA('Yes! An island has water all the way round.', 'happy')], true),
          opt('A fence', [MA('No fence! Water goes all the way round an island.')]),
          opt('Trees', [MA('This one has trees on it. But water goes all the way round.')]),
        ],
        parentNote:
          'Learned that an island is land with water all the way round, and that a weir is a low wall across a river.',
      },
    ],
  ),
  // ------------------------------------------------ step 9 scene: dusk on the river path
  sc(
    's29-dusk',
    [
      N('Evening. You walk home by the river, under a stripy cliff.'),
      N('Marina walks fast. She is hungry.'),
      N('Dusty stops. They sniff. They look up the cliff.'),
      DU('That’s my house! I can smell it. I haven’t been home for ages.', 'sad'),
      DU('Marina! Wait!'),
      MA('Come on! Supper time!', 'happy'),
      N('Marina doesn’t hear. She’s gone round the corner.'),
      N('Dusty sits on a tree stump and cries.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'naming a feeling: homesick',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'ask',
        after: 3,
        prompt: [N('Dusty misses home. What is that feeling called?')],
        options: [
          opt(
            'Homesick',
            [N('Yes. Homesick means missing your home. Lots of people feel it.')],
            true,
          ),
          opt('Hungry', [N('Marina is hungry! Dusty is homesick. That means missing home.')]),
          opt('Sleepy', [N('Not sleepy. Dusty is homesick. That means missing home.')]),
        ],
        parentNote: 'Learned the word homesick: missing your home.',
      },
    ],
  ),
  // ------------------------------------------------ step 9 done: Marina turns back
  sc(
    's29-turnback',
    [
      N('You run after Marina. You say, “Dusty!” and point.'),
      N('Marina turns round at once. She runs back.'),
      MA('Dusty. Oh, Dusty. What’s wrong?', 'soft'),
      DU('My house. I can’t go in. And I can’t walk past it.', 'sad'),
      MA('I’m sorry. I was only thinking about my supper.', 'sad'),
      MA('Then we’ll go in together. All of us.', 'soft'),
    ],
    [
      {
        domain: 'sel',
        skill: 'helping a friend who misses home',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 5,
        prompt: [N('How can we help a friend who misses home?')],
        options: [
          opt(
            'Stay with them',
            [MA('Yes. Being there helps. Nobody should be sad all alone.', 'soft')],
            true,
          ),
          opt('Leave them on the stump', [
            MA('Some people want quiet. But Dusty needs friends near. We stay.'),
          ]),
          opt('Tell them to stop crying', [
            MA('Crying is okay. It lets the sad out. We sit with them.'),
          ]),
        ],
        parentNote: 'Talked about how to help a friend who is homesick: stay with them.',
      },
    ],
  ),
  // ------------------------------------------------ step 10 scene: the cliff house
  sc(
    's29-cliffhouse',
    [
      N('Dusty’s house is a round room in the cliff, with a round door.'),
      N('It is dark and cold and dusty.'),
      MA('What a snug little house! Round as an egg.', 'happy'),
      DU('It’s cold. There’s nothing to eat.', 'sad'),
      MA('You fetch sticks for the fire. Dusty, sit. I’ll check the cupboards.', 'think'),
      MA('Biscuits! Tea! Pickled onions! Candles!', 'happy'),
    ],
    [
      {
        domain: 'maths',
        skill: 'name a shape: circle',
        standard: 'K.G.A.2',
        kind: 'ask',
        after: 0,
        prompt: [N('Dusty’s door is round. What shape is round, with no corners?')],
        options: [
          opt('A circle', [N('Yes! A circle. Round, like Dusty’s door.')], true),
          opt('A square', [N('A square has four corners. Round, with no corners, is a circle.')]),
          opt('A triangle', [N('A triangle has three corners. Round is a circle.')]),
        ],
        parentNote: 'Named a circle: a round shape with no corners.',
      },
    ],
  ),
  // ------------------------------------------------ step 10 done: supper (s5Done unset)
  sc(
    's29-supper',
    [
      ...SUPPER_START,
      DU('That’s Fossil’s basket. She was very old.', 'soft'),
      DU('Fossil died. Her body stopped working. It won’t start again.', 'sad'),
      MA('Leave it there. It can be hers and still be here.', 'soft'),
      ...SUPPER_END,
      N('That night Dusty stays at home, warm and cosy.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'missing someone who has died',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'notice',
        after: 4,
        lines: [
          N('Dusty is sad. Missing someone is okay.'),
          N('Remembering Fossil helps. So do friends, and a warm fire.'),
        ],
        parentNote:
          'Heard that it is okay to feel sad when someone dies, and that remembering and friends help.',
      },
    ],
  ),
  // ------------------------------------------------ step 11 scene: Portly is missing
  sc(
    's29-missing',
    [
      N('The end of summer. The swallows sit in rows on the wires.'),
      MA('Portly is lost. Three days now. Nobody has seen him.', 'sad'),
      MA('He always comes back. But never for this long. And the nights are cold.'),
      Y('Where is the old otter?'),
      MA('At the ford. That’s where Portly learned to swim.'),
    ],
    [
      {
        domain: 'science',
        skill: 'animal babies have names',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'ask',
        after: 1,
        prompt: [N('A baby otter is called a cub. What is a baby cat called?')],
        options: [
          opt('A kitten', [N('Yes! A baby cat is a kitten. A baby otter is a cub.')], true),
          opt('A puppy', [N('A puppy is a baby dog. A baby cat is a kitten.')]),
          opt('A chick', [N('A chick is a baby bird. A baby cat is a kitten.')]),
        ],
        parentNote: 'Matched baby animals to their names (otter cub, kitten, puppy, chick).',
      },
    ],
  ),
  // ------------------------------------------------ step 11 done: the ford
  sc(
    's29-ford-watch',
    [
      N('The ford is a shallow place. You can cross it on stones.'),
      N('The old otter sits on a flat stone. He is very still.'),
      N('He looks up the river. He waits and waits.'),
      MA('Every night, and every morning, he waits right there.', 'soft'),
      DU('Somebody ought to sit with him. I know about sitting.', 'soft'),
      N('Dusty sits near the otter. Not too close. Quiet.'),
      MA('Tonight we look for Portly. In the boat, with a lantern.', 'think'),
    ],
    [
      {
        domain: 'sel',
        skill: 'being calm and still; giving wild animals space',
        standard: 'ELOF: Approaches to Learning',
        kind: 'do',
        after: 5,
        check: 'edu:hold:still:ford',
        lines: [
          N('(Sit very still with Dusty. Quiet as a mouse. Breathe slowly.)'),
          N('Shh. Wild animals like quiet, and space. Being still is kind.'),
        ],
        parentNote: 'Practised sitting calm and still, and learned to give wild animals space.',
      },
    ],
  ),
  // ------------------------------------------------ step 12 scene: upriver by night
  sc(
    's29-upriver',
    [
      N('Night. The river is black and smooth.'),
      N('Your lantern makes a little gold light on the water.'),
      N('Your Nubbin sits at the front, in its vest. Ears up!'),
      MA('Look at the edges. Mud. Reeds. Roots.', 'think'),
      N('Hoo-hoo! An owl. Plop! A fish. But no Portly.'),
      MA('Vests done up? Good. We never go out on the water alone.'),
    ],
    [
      {
        domain: 'science',
        skill: 'animal sounds; animals awake at night',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'ask',
        after: 4,
        prompt: [N('Which animal says hoo-hoo at night?')],
        options: [
          opt('An owl', [MA('Yes! Owls wake up at night. They hunt in the dark.', 'soft')], true),
          opt('A cow', [MA('Cows say moo! Owls say hoo-hoo, at night.')]),
          opt('A duck', [MA('Ducks say quack! Owls say hoo-hoo, at night.')]),
        ],
        parentNote: 'Matched an animal to its sound and learned that owls are awake at night.',
      },
    ],
  ),
  // ------------------------------------------------ step 12 done: the bead (s29-gift = bead)
  sc(
    's29-night',
    [
      N('Something shines in the lantern light, down on the mud.'),
      N('Your Nubbin sees it first! It nearly falls in.'),
      N('It is the blue glass bead!'),
      N('Next to it are little footprints, going up the river.'),
      MA('He was here! Let’s follow his footprints.', 'shock'),
      ...NIGHT_END,
    ],
    [
      {
        domain: 'science',
        skill: 'animal tracks: otters have webbed feet',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'ask',
        after: 3,
        prompt: [N('Who made the little footprints in the mud?')],
        options: [
          opt(
            'Portly',
            [MA('Yes! Otter feet have skin between the toes. Good for swimming.', 'happy')],
            true,
          ),
          opt('A bird', [MA('Bird prints are thin and pointy. These are otter prints. Portly’s!')]),
        ],
        parentNote:
          'Worked out whose footprints were in the mud, and learned that otters have webbed feet.',
      },
    ],
  ),
  // ------------------------------------------------ step 13 scene: the island at dawn
  sc(
    's29-island',
    [
      N('The boat bumps the island. You step out.'),
      N('The air is warm. It smells of stones and water.'),
      N('In the long grass is a soft flat hollow.'),
      N('And in the middle, curled up, is Portly! Safe and sound.'),
      N('Your Nubbin’s ball glows softly, the colour of the sky.'),
      MA('I feel a bit funny. A bit scared, and a bit happy.', 'soft'),
      N('A warm little wind blows by, once. Then everything feels calm.'),
      MA('Well! There he is. Fast asleep, the little rascal.', 'happy'),
      N('Marina lifts Portly into the boat and wraps him in her scarf.'),
    ],
    [
      {
        domain: 'science',
        skill: 'day and night: dawn is when the sun comes up',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'notice',
        after: 0,
        lines: [
          N('The sun is coming up. Morning time is called dawn.'),
          N('Every morning the sun comes up. Every evening it goes down.'),
        ],
        parentNote: 'Learned the word dawn, and that the sun comes up every morning.',
      },
      {
        domain: 'sel',
        skill: 'feeling two things at once',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'ask',
        after: 5,
        prompt: [N('Marina feels scared and happy together. Can you feel two things at once?')],
        options: [
          opt('Yes', [MA('Yes! Big moments can feel lots of ways at once.', 'soft')], true),
          opt('No', [MA('You can! Like a first day somewhere new: a bit scared, a bit excited.')]),
        ],
        parentNote: 'Talked about feeling two things at once, like scared and happy.',
      },
    ],
  ),
  // ------------------------------------------------ step 13 done: the ford (s29-gift = bead)
  sc(
    's29-ford',
    [
      ...FORD_START,
      N('Portly comes back. You put the bead down for him.'),
      N('He pushes it back to you. He leaves a wet pebble too.'),
      ...FORD_END,
    ],
    [
      {
        domain: 'sel',
        skill: 'saying thank you',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'ask',
        after: 7,
        prompt: [N('Portly gives you a pebble. What do you think it means?')],
        options: [
          opt('Thank you', [DU('Yes. That’s his way of saying thank you.', 'soft')], true),
          opt('Go away', [DU('Hmm, I think it’s kinder than that. It’s his thank-you!')]),
        ],
        parentNote: 'Talked about ways of saying thank you, with words or without them.',
      },
    ],
  ),
  // ------------------------------------------------ step 14 scene: the seafarer
  sc(
    's29-seafarer',
    [
      N('Autumn. The leaves turn orange. The swallows have flown away.'),
      N('A man walks up the road, with a big pack and a gold earring.'),
      SF('Hello! I followed this river all the way up from the sea.', 'happy'),
      N('He sits with Marina all afternoon. He tells her about far-off places.'),
      SF('Boats painted every colour. Stars swinging over the mast at night.', 'soft'),
      SF('Well, I’ll be off. My ship sails at the end of the week.', 'happy'),
      N('Marina watches him go. She stops mending her net.'),
    ],
    [
      {
        domain: 'science',
        skill: 'rivers run downhill to the sea',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'ask',
        after: 2,
        prompt: [N('Where does this river go in the end?')],
        options: [
          opt(
            'To the sea',
            [
              SF(
                'That’s right. Rivers run downhill. This one runs all the way to the sea.',
                'happy',
              ),
            ],
            true,
          ),
          opt('Up a mountain', [SF('Water runs downhill, not up! This river runs to the sea.')]),
        ],
        parentNote: 'Learned that rivers run downhill, and that this river ends at the sea.',
      },
    ],
  ),
  // ------------------------------------------------ step 14 done: packing (the second choice)
  sc(
    's29-packing',
    [
      N('At dusk, you and Dusty run to Marina’s boathouse.'),
      N('Marina is putting jumpers in a bag. She won’t look at you.'),
      N('Her eyes look far away, like she’s dreaming of the sea.'),
      MA('I’m only going for a look. Just for a while.', 'soft'),
      DU('But you love the river! You said it’s the best thing!', 'sad'),
      N('Marina keeps folding.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'reading how someone feels',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'ask',
        after: 4,
        prompt: [N('How does Dusty feel?')],
        options: [
          opt(
            'Sad and worried',
            [N('Yes. Dusty doesn’t want Marina to go. Friends feel like that.')],
            true,
          ),
          opt('Happy', [N('Look at Dusty’s face. Dusty is sad and worried.')]),
        ],
        parentNote: 'Read a character’s feelings (sad and worried) from what they say and do.',
      },
    ],
    {
      choices: [
        {
          id: 'sat',
          label: 'Sit down beside her. Be quiet together.',
          set: { 's29-wayfarer': 'sat' },
          then: [
            N('You sit on the bed, next to the bag. You don’t say anything.'),
            N('Dusty sits on Marina’s other side. You all sit, quiet.'),
            MA('Hazel used to do that. Just sit with me.', 'soft'),
            N('After a long time, Marina puts the jumper down.'),
          ],
        },
        {
          id: 'pencil',
          label: 'Give her a pencil. Ask her to draw the tide pools.',
          set: { 's29-wayfarer': 'pencil' },
          then: [
            N('You find a pencil and some brown paper.'),
            Y('Please draw me the tide pools. I want to remember them.'),
            N('Marina draws one pool. Then another. Then a crab under a stone.'),
            N('Slowly her eyes look like her own again. She forgets the bag.'),
            MA('There’s one I’ve never drawn. Pass me more paper!', 'happy'),
          ],
        },
      ],
      defaultChoice: 'sat',
    },
  ),
  // ------------------------------------------------ step 15 scene: laid up
  sc(
    's29-laidup',
    [
      N('A grey, windy morning. Willow leaves fall in the river.'),
      MA('Time the boat came out of the water for winter.', 'think'),
      N('You put three round logs on the bank. The boat rolls on them.'),
      DU('Boats are heavy when they’re not floating! It’s a trick!'),
      MA('Heave! And heave! Mind your toes.'),
      N('Your Nubbin rides in the boat all the way. Still boating!'),
    ],
    [
      {
        domain: 'science',
        skill: 'round things roll: rollers make moving easier',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'ask',
        after: 2,
        prompt: [N('What helps the heavy boat move up the bank?')],
        options: [
          opt(
            'Round logs that roll',
            [MA('Yes! Round things roll. The boat rides on the logs.', 'happy')],
            true,
          ),
          opt('Pushing with our feet', [
            MA('That’s hard work! The round logs roll, and help her move.'),
          ]),
        ],
        parentNote: 'Saw how round logs roll to help move something heavy.',
      },
    ],
  ),
  // ------------------------------------------------ complete (s29-wayfarer = held)
  sc(
    's29-complete',
    [
      ...COMPLETE_START,
      MA('I was cross with you both. I banged the door a lot.', 'think'),
      DU('We noticed!'),
      MA('Thank you for not letting me go. I’d have missed it here.', 'soft'),
      ...COMPLETE_END,
    ],
    [
      {
        domain: 'sel',
        skill: 'what helps when we feel cross',
        standard: 'CASEL: Self-management',
        kind: 'ask',
        after: 3,
        prompt: [N('Marina was cross. Then she said thank you. What helps when we feel cross?')],
        options: [
          opt(
            'Time, and talking about it',
            [N('Yes. Cross feelings settle down. Then we can talk.')],
            true,
          ),
          opt('Banging doors forever', [
            N('Banging doors doesn’t fix it. Time and talking help more.'),
          ]),
        ],
        parentNote: 'Talked about what helps when we feel cross: time, and talking about it.',
      },
    ],
  ),
];

// ================================================================== variants
const VARIANTS: EduScene[] = [
  // ------------------------------------------------ step 6 done, if c6-open has played
  sc(
    's29-kitchen-after',
    kitchenLines([
      N('Dusty listens hard. Dusty’s old friend died not long ago.'),
      N('Her body stopped working. Dusty misses that friend. Marina sits close.'),
    ]),
    [
      {
        domain: 'sel',
        skill: 'sad feelings are okay; being close helps',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'notice',
        after: 9,
        lines: [
          N('Dusty is sad. Sad is okay to feel.'),
          N('Being close to friends helps. So does a warm fire.'),
        ],
        parentNote: 'Heard that feeling sad is okay, and that friends and warmth help.',
      },
    ],
  ),
  // ------------------------------------------------ step 8 scene, if s4Done
  sc(
    's29-low-river-full',
    [
      ...RIVER_START,
      N('The river is full and fast and clear.'),
      MA('Look at her go! She’s running like she means it.', 'happy'),
      N('You row up and up. You never touch the bottom.'),
      DU('In, pull, out. In, pull, out. I’m doing it!', 'happy'),
      MA('Not looking. Eyes on the weir!', 'happy'),
    ],
    [
      {
        domain: 'maths',
        skill: 'count to 5',
        standard: 'K.CC.B.4',
        kind: 'do',
        after: 5,
        check: 'edu:count:strokes:5',
        lines: [
          N('(Row with Dusty! Count five pulls: one, two, three, four, five.)'),
          DU('Five! We’re nearly at the top.', 'happy'),
        ],
        parentNote: 'Counted five rowing strokes, one number for each pull.',
      },
    ],
  ),
  // ------------------------------------------------ step 10 done, if s5Done
  sc(
    's29-supper-walk',
    [
      ...SUPPER_START,
      DU('That’s Fossil’s basket. You remember. You carried her.', 'soft'),
      DU('Fossil died. Her body stopped working. It won’t start again.', 'sad'),
      DU('But I remember our walk. That was a happy day.', 'soft'),
      MA('Leave it there. It can be hers and still be here.', 'soft'),
      ...SUPPER_END,
    ],
    [
      {
        domain: 'sel',
        skill: 'happy memories help when we miss someone',
        standard: 'ELOF: Social and Emotional Development',
        kind: 'ask',
        after: 4,
        prompt: [N('What helps Dusty feel a bit better?')],
        options: [
          opt(
            'Remembering a happy day',
            [MA('Yes. Happy memories are like a warm fire inside.', 'soft')],
            true,
          ),
          opt('Forgetting Fossil', [
            MA('We don’t need to forget. Remembering the happy days helps.'),
          ]),
        ],
        parentNote:
          'Talked about how remembering happy times helps when we miss someone who has died.',
      },
    ],
  ),
  // ------------------------------------------------ step 12 done, s29-gift = ribbon
  sc(
    's29-night-ribbon',
    [
      N('Near the weir, something red waves in the reeds.'),
      N('It’s the red ribbon! It’s caught on a reed.'),
      N('The water tugs it long and thin. Wiggle, wiggle.'),
      MA('He came this way! Brave little thing.', 'shock'),
      N('You free the ribbon and put it in your pocket.'),
      ...NIGHT_END,
    ],
    [
      {
        domain: 'art',
        skill: 'name a colour: red',
        kind: 'ask',
        after: 1,
        prompt: [N('What colour is the ribbon?')],
        options: [
          opt('Red', [MA('Red! Bright in the lantern light.', 'happy')], true),
          opt('Blue', [MA('Look in the lantern light. It’s red!')]),
          opt('Yellow', [MA('Look again, in the lantern light. It’s red!')]),
        ],
        parentNote: 'Named the colour red.',
      },
    ],
  ),
  // ------------------------------------------------ step 12 done, s29-gift = bell
  sc(
    's29-night-bell',
    [
      N('Far away, over the water, a tiny bell rings. Ting!'),
      MA('Stop. Listen!', 'shock'),
      N('Ting! Again. From up the river, past the weir.'),
      MA('That’s his bell! He’s up there!', 'soft'),
      ...NIGHT_END,
    ],
    [
      {
        domain: 'science',
        skill: 'listening: a bell wobbles to make its sound',
        standard: 'ELOF: Scientific Reasoning',
        kind: 'notice',
        after: 2,
        lines: [
          N('(Close your eyes and listen. Can you say “ting” like a bell?)'),
          MA('A bell wobbles very fast. That wobble makes the sound.'),
        ],
        parentNote: 'Listened carefully and heard that a bell makes sound by wobbling (vibrating).',
      },
    ],
  ),
  // ------------------------------------------------ step 13 done, s29-gift = ribbon
  sc(
    's29-ford-ribbon',
    [
      ...FORD_START,
      N('Portly comes back. You hold out the muddy red ribbon.'),
      N('He pushes it back to you. And he leaves a wet pebble.'),
      ...FORD_END,
    ],
    [
      {
        domain: 'science',
        skill: 'keeping rivers clean for animals',
        standard: 'K-ESS3-3',
        kind: 'notice',
        after: 7,
        lines: [
          MA('Good. Keep the ribbon. String in a river can catch animals.'),
          MA('We always take our things home. Then rivers stay clean.'),
        ],
        parentNote:
          'Learned that we take our things home so rivers stay clean and safe for animals.',
      },
    ],
  ),
  // ------------------------------------------------ step 13 done, s29-gift = bell
  sc(
    's29-ford-bell',
    [
      ...FORD_START,
      N('Portly shakes. Ting! He slips the loose bell off his head.'),
      N('He leaves it on your boot, with a wet pebble beside it.'),
      ...FORD_END,
    ],
    [
      {
        domain: 'science',
        skill: 'wild animals should stay free and safe',
        standard: 'K-ESS3-3',
        kind: 'notice',
        after: 7,
        lines: [
          MA('That’s why the loop was loose. So he could take it off.'),
          MA('Wild animals should be free. Nothing should catch or hurt them.'),
        ],
        parentNote: 'Learned that we keep wild animals free and safe.',
      },
    ],
  ),
  // ------------------------------------------------ complete, s29-wayfarer = sat
  sc(
    's29-complete-sat',
    [
      ...COMPLETE_START,
      N('Marina doesn’t say much. She leans on you, just a little.'),
      N('Dusty leans on Marina’s other side. You stand together.'),
      ...COMPLETE_END,
    ],
    [
      {
        domain: 'sel',
        skill: 'showing you care without words',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 3,
        prompt: [N('How can we show we care, without any words?')],
        options: [
          opt('A hug, or sitting close', [N('Yes. Being close says “I’m here”.')], true),
          opt('Walking away', [N('Being close works better. It says “I’m here”.')]),
        ],
        parentNote: 'Talked about showing care without words: a hug, or sitting close.',
      },
    ],
  ),
  // ------------------------------------------------ complete, s29-wayfarer = pencil
  sc(
    's29-complete-pencil',
    [
      ...COMPLETE_START,
      N('On the boathouse wall is Marina’s drawing of the tide pools.'),
      N('In the corner is a tiny boat. Three people and a Nubbin!'),
      MA('Next I’ll draw the whole river. That will take years!', 'happy'),
      ...COMPLETE_END,
    ],
    [
      {
        domain: 'maths',
        skill: 'add 1',
        standard: 'K.OA.A.1',
        kind: 'ask',
        after: 3,
        prompt: [N('Three people and one Nubbin. How many in the little boat?')],
        options: [
          opt('Four', [N('Yes! Three, and one more, makes four.')], true),
          opt('Three', [N('Don’t forget the Nubbin! Three and one more makes four.')]),
          opt('Five', [N('Let’s count: one, two, three people. And one Nubbin. Four!')]),
        ],
        parentNote: 'Added one more: three people and one Nubbin make four.',
      },
    ],
  ),
  // ------------------------------------------------ ambient: Granny Brock's door by day
  sc(
    's29-brock-knock',
    [
      N('You knock on the little green door. Knock, knock.'),
      N('Bolts slide back. One, two, three, four.'),
      GB('Daytime. Good. Come in for ten minutes and get warm.', 'think'),
      N('Ten minutes turns into an hour by the fire.'),
      N('Nobody says much. That’s nice too.'),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'visiting politely: knock and wait',
        standard: 'D2.Civ.8.K-2',
        kind: 'ask',
        after: 0,
        prompt: [N('What do we do when we visit someone’s house?')],
        options: [
          opt(
            'Knock and wait',
            [N('Yes. It’s their home. We knock, and wait to be asked in.')],
            true,
          ),
          opt('Walk right in', [N('It’s their home! We knock, and wait to be asked in.')]),
        ],
        parentNote: 'Talked about visiting politely: knock and wait to be asked in.',
      },
    ],
  ),
];

// ================================================================== the quest
const S29: EduQuest = {
  id: 'sprout:s29',
  of: 's29',
  band: 'sprout',
  title: 'The Gates of Dawn',
  goals: {
    's29-step1': {
      goal: 'Help Marina carry her boat down to the water.',
      hint: 'Take one end. Marina takes the other.',
    },
    's29-step2': {
      goal: 'Go down the stream with Marina. Have a picnic.',
      hint: 'Vest on. Sit still in the middle while Marina rows.',
    },
    's29-step3': {
      goal: 'Get the picnic things out of the river.',
      hint: 'The Nubbins can swim. Grab the basket, the rug and the oars.',
    },
    's29-step4': {
      goal: 'Learn to row. Then find a present for Portly.',
      hint: 'In, pull, out! Portly is close by. He always is.',
    },
    's29-step5': {
      goal: 'Go into the Wild Wood with Marina. Find Dusty.',
      hint: 'Stay on the path. Keep talking. Stand still and listen for Dusty.',
    },
    's29-step6': {
      goal: 'Find somewhere warm in the Wild Wood.',
      hint: 'Look for things people made: a step, a door.',
    },
    's29-step7': {
      goal: 'Follow Granny Brock out of the Wood.',
      hint: 'Follow her lantern through the tunnel.',
    },
    's29-step8': {
      goal: 'Row up the river to the weir with Marina and Dusty.',
      hint: 'Take an oar each. If it’s too shallow, everyone carries the boat.',
    },
    's29-step9': {
      goal: 'Run after Marina. Tell her Dusty is sad.',
      hint: 'She went round the bend. Run!',
    },
    's29-step10': {
      goal: 'Fetch dry sticks for Dusty’s stove.',
      hint: 'The woodpile is round the side. Dig down for the dry ones.',
    },
    's29-step11': {
      goal: 'Go to the ford and see the old otter.',
      hint: 'Go quietly. Don’t go too close.',
    },
    's29-step12': {
      goal: 'Row up the river at night. Look for Portly.',
      hint: 'Row slowly. Hold the lantern low. Look and listen.',
    },
    's29-step13': {
      goal: 'Row Portly home to the ford.',
      hint: 'Let the river carry you. Keep him warm.',
    },
    's29-step14': {
      goal: 'Run to Marina’s boathouse with Dusty.',
      hint: 'It’s past the tide pools, by the sea.',
    },
    's29-step15': {
      goal: 'Pull Marina’s boat up the bank for winter.',
      hint: 'Put round logs under it. Everyone pushes!',
    },
  },
  scenes: SCENES,
  notes:
    'Sprout band. s29-packing leaves out `held` (defaultChoice sat); sprout:s29-complete is still written for saves ' +
    'that reach it. The Lantern Song is narrated, not sung, in this band (its second line pictures the dead as ' +
    'sleeping). Fossil is named only from s29-supper; her death is said plainly with comfort after.',
};

export const EDU_S29_SPROUT: EduQuest[] = [S29];

export const EDU_S29_SPROUT_VARIANTS: EduScene[] = VARIANTS;

/** Every `edu:` check string this file uses. */
export const CHECKS: string[] = [
  'edu:tap:boat:bow',
  'edu:clap:pattern:in-pull-out',
  'edu:count:aloud:10',
  'edu:hold:still:ford',
  'edu:count:strokes:5',
];
