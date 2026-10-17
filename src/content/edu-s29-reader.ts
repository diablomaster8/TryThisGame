/**
 * The Learning Grove, reader band (ages 7–10): S29 The Gates of Dawn.
 *
 *   Rivers: source, backwater, ford, weir, island, mouth; maps of a river (2-ESS2-2, D2.Geo.2.K-2).
 *   Otters: fur, whiskers, webbed feet, and their return as English rivers were cleaned (4-LS1-1,
 *   3-LS4-4, K-ESS3-3). Water safety: cork vests and buoyancy, sitting still, never on the water
 *   alone. Forces: floating, unbalanced oars, currents, friction and rollers (3-PS2-1). Plus frost,
 *   rock layers, swallows, sound and light. Homesickness, grief and how to help a friend.
 *   Think questions: s29-lessons-done, s29-turnback, s29-island, s29-packing.
 *
 * One EduScene per original scene (15 step scenes, 14 done scenes, the complete scene and the 10
 * variants), id `reader:<original id>`. Every choice keeps its original id and `set`. No Grahame
 * text: the lifted lines use the source's own `childLines` or new lines. The Lantern Song is sung
 * only from its third line (the second pictures the dead as sleeping). Nubbins and otters never
 * speak; the island stays unexplained. See EDU-STYLE.md. British spelling.
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
const MA = say('marina');
const DU = say('dusty');
// new speakers (declared in side-stories-s29.ts)
const GB = say('granny-brock');
const SF = say('s29-seafarer');
const CH = say('s29-children');

// ---------------------------------------------------------------- builders
type LessonIn = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const opt = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply } : { label, reply };

/** Builds `reader:<of>` and numbers its lessons `reader:<of>-l1`, `-l2` in play order. */
const scene = (of: string, lines: Line[], lessons: LessonIn[], choices?: Choice[]): EduScene => {
  const id = `reader:${of}`;
  const s: EduScene = {
    id,
    of,
    band: 'reader',
    lines,
    lessons: [...lessons]
      .sort((a, b) => a.after - b.after)
      .map((l, i) => ({ id: `${id}-l${i + 1}`, ...l })),
  };
  if (choices) s.choices = choices;
  return s;
};

const gloss = (word: string, meaning: string, of: string): GlossaryEntry => ({
  word,
  meaning,
  scene: `reader:${of}`,
});

// ================================================================== shared pieces
// ---------------------------------------------------------------- step 6 done: the kitchen
const kitchenLines = (dustyListens: Line): Line[] => [
  N(
    'The door opens a crack. An old woman with a candle glares out, in a quilted dressing gown and a soot-black apron.',
  ),
  GB(
    'Who’s ringing my bell at this hour? Nobody rings it at any hour. That’s why it’s there.',
    'angry',
  ),
  MA('Granny Brock. It’s Marina, from the river. We’re lost, and this one’s frozen.'),
  GB(
    'Marina. Hm. And a frozen one. And somebody’s grandchild, by the chin on it. And what’s that, in your coat?',
    'think',
  ),
  N(
    'Your Nubbin looks out at her, and she looks back. Neither of them blinks first, and something is settled.',
  ),
  GB('In. All of you. Boots off. Not you, you’ve not got boots. In.'),
  N(
    'The passage opens into a kitchen older than the Wood: stone flags, a red fire, hams on hooks, and carved words nobody can read now.',
  ),
  GB('Sit. Eat. Then talk, if you must. Better if you mustn’t.'),
  N(
    'She feeds you soup, and bread, and more soup. She puts Dusty nearest the fire and drops a blanket on them without looking.',
  ),
  GB(
    'My people burned charcoal in this wood before your grandmothers were born. There was a town here once. Now there’s me.',
  ),
  GB('People come and go. The Wood stays. So do I.'),
  dustyListens,
  N(
    'When the fire gets low, Granny Brock puts another log on without being asked. Nobody goes to sleep for a long time.',
  ),
];

const CHARCOAL: LessonIn = {
  domain: 'science',
  skill: 'charcoal: a heating change that can’t be undone',
  standard: '2-PS1-4',
  kind: 'notice',
  after: 9,
  lines: [
    GB(
      'Charcoal’s wood, baked slow in a covered heap with hardly any air, so it can’t burn away.',
      'think',
    ),
    GB(
      'What’s left is black and light, and burns hotter and cleaner than wood. And it never turns back into wood. Not ever.',
    ),
  ],
  parentNote:
    'Learned how charcoal is made from wood, and that some heating changes can’t be reversed.',
};

// ---------------------------------------------------------------- step 8: up to the weir
const RIVER_START: Line[] = [
  N(
    'Summer’s end. Since the rain on the hill, Dusty has been sleeping in Marina’s boathouse, and nobody has said a word about it.',
  ),
  N(
    'Marina wants to show you the top of the river before the weather turns. Dusty takes an oar without being asked, and sits down first.',
  ),
  MA('Look at that. Sitting down. I’ve made a sailor of you.', 'happy'),
];

// ---------------------------------------------------------------- step 10: the supper
const SUPPER_START: Line[] = [
  N(
    'You come back with your arms full. Soon the stove is roaring, the room has gone gold, and even the dust looks cosy.',
  ),
  N('Marina lays out biscuits, onions and tea on an upturned crate as if it were a banquet.'),
  N(
    'Beside the stove is a round basket with a cushion in it, flattened in the middle. Nobody sits on that side of the stove.',
  ),
];
const SUPPER_END: Line[] = [
  MA('Leave it where it is. It’s hers. It can be hers and still be in your house.', 'soft'),
  N(
    'Outside: feet on the cliff path, whispering, and a great deal of shushing. A lantern on a pole bobs up past the window.',
  ),
  N(
    'Dusty opens the door. Half the valley’s children are on the step in their wellies, red-nosed, holding the lantern high.',
  ),
  CH('We heard you were home. It’s not Lantern Night, we know. We practised one verse anyway.'),
  N('They sing a verse of the Lantern Song, the one for people who are gone. It ends like this:'),
  CH('we are made of the ones who remember us here,', 'soft'),
  CH('so we gather, we gather, we gather each year.', 'soft'),
  DU('Thank you. Thank you. Come in, all of you. There’s biscuits. They’re very old.', 'soft'),
  N(
    'That night Dusty stays at home, in their own bed, with the stove ticking and the basket where it always was.',
  ),
];

const RHYME: LessonIn = {
  domain: 'literacy',
  skill: 'rhyme and repeated words in a song',
  standard: 'RL.2.4',
  kind: 'ask',
  after: -1,
  prompt: [N('Listen to the end of the children’s verse. Which two words rhyme?')],
  options: [
    opt(
      '“here” and “year”',
      [N('Yes. Here and year. And “we gather” comes three times, so everyone can join in.')],
      true,
    ),
    opt('“made” and “remember”', [
      N('They both have an m, but they don’t rhyme. Listen to the line ends: here, year.'),
    ]),
    opt('“ones” and “us”', [
      N('Close, but no. Rhymes usually sit at the ends of lines: here and year.'),
    ]),
  ],
  parentNote: 'Found the rhyming pair in a verse and noticed a repeated phrase.',
};

// ---------------------------------------------------------------- step 12: up the river by night
const NIGHT_END: Line[] = [
  N(
    'You haul the boat up the old slipway beside the weir and put her in again above it. Up here the water is very still.',
  ),
  N('Then you hear it. Not music, exactly.'),
  N('Like wind in reeds, if wind could mean something. Like the weir, if the weir could sing.'),
  N('Marina stops rowing. The oars drip, and she doesn’t notice.'),
  MA('Do you hear that?', 'soft'),
  N(
    'Your Nubbin is standing up in the bow, facing upstream. It isn’t frightened; it’s listening with its whole body.',
  ),
  N(
    'Ahead, where the river splits round the island, the sky has gone the colour of the inside of a shell. It is nearly dawn.',
  ),
];

// ---------------------------------------------------------------- step 13: home to the ford
const FORD_START: Line[] = [
  N(
    'The sun is up when you come round the bend to the ford. The old otter is still on his stone, and so is Dusty.',
  ),
  N('Portly wakes all at once, sees where he is, and goes over the side in one wriggle.'),
  N(
    'Two brown heads in the shallows, close together, turning round and round each other. The old otter makes no sound at all.',
  ),
  DU('Oh. Oh, look at them.', 'soft'),
  N('Marina is wiping her face with her sleeve, again and again. It doesn’t seem to be working.'),
  MA('Don’t know what’s the matter with me. Must’ve been the early start.', 'soft'),
];
const FORD_END: Line[] = [
  DU('He’s giving it back. That’s a thank-you, that is.', 'soft'),
  MA('That’s him saying he’s done with it. Same thing, with otters.', 'happy'),
  DU('Where was he, in the end?'),
  MA('On the island. Asleep in the grass. That’s all.', 'think'),
  N(
    'She says it as if there was something else, a moment ago, that she has put down somewhere and can’t find.',
  ),
  N(
    'The old otter looks at you once from the water. Then the two of them go off downstream, under the bank.',
  ),
];

const TEARS: LessonIn = {
  domain: 'sel',
  skill: 'tears of relief: people cry for more than sadness',
  standard: 'CASEL: Self-awareness',
  kind: 'notice',
  after: 5,
  lines: [
    N(
      'People cry when they’re sad. They also cry when they’re relieved, or very happy, or after being worried for a long time.',
    ),
    N('Tears can be how a big feeling gets out. Marina doesn’t need a reason, and neither do you.'),
  ],
  parentNote: 'Learned that people cry from relief and happiness as well as sadness.',
};

// ---------------------------------------------------------------- step 15: laid up
const COMPLETE_START: Line[] = [
  N(
    'Under the willows you turn her over, gently, and lay her keel-up on the trestles where Marina painted her in the summer.',
  ),
  N('The three of you stand and look at her. She looks like a beetle having a rest.'),
];
const COMPLETE_END: Line[] = [
  MA('Here. Take the rug. It’s got gherkin on it. It’ll always have gherkin on it.', 'happy'),
  MA(
    'Her little sister’s in the boathouse: the flat one, for winter water. We’ll take her out together. Vests on.',
    'think',
  ),
  DU('Same time next summer?', 'soft'),
  MA(
    'Before. March, if it’s mild. You get the vests down from the loft and smell them. That’s the first day of the year.',
    'happy',
  ),
  N(
    'Down at the ford a brown head comes up, looks at the three of you for a while, and goes under without a ripple.',
  ),
];

// ================================================================== scenes
const SCENES: EduScene[] = [
  // ------------------------------------------------ step 1 scene: Dusty comes up
  scene(
    's29-digging',
    [
      N(
        'The week after Lantern Night. Down by the stream, the air smells of cut grass and warm mud.',
      ),
      N(
        'Marina has her boat upside down on two trestles. She is painting its bottom blue and humming.',
      ),
      N(
        'A few steps away, the turf heaves. It heaves again and splits, and two earthy hands push up through it.',
      ),
      N('Then a head, covered in soil, blinking at the sun as if the sun had done it on purpose.'),
      DU('Oh, crumbs! Oh, rubble!', 'shock'),
      N('Dusty climbs out, shakes off about a bucketful of earth, and glares back down the hole.'),
      DU(
        'I’ve been clearing out my burrow since March. Every time I finish a room, the room next door falls in.',
      ),
      DU('That’s it. No more digging. Not today!', 'angry'),
      MA('Well. Nobody in this valley ever thought they’d hear you say that.', 'happy'),
      MA(
        'She’s mended. Grab an end, both of you. You’ve never been in a boat, have you, Dusty?',
        'think',
      ),
      DU('I’ve been in a hole. Is it much different?'),
      MA('Opposite, mostly.', 'happy'),
    ],
    [
      {
        domain: 'science',
        skill: 'body parts that help animals survive: a mole’s digging paws',
        standard: '4-LS1-1',
        kind: 'notice',
        after: 6,
        lines: [
          MA(
            'Real moles dig all their lives. Their front paws are broad and turned outwards, like a pair of spades.',
          ),
          MA('One mole’s tunnels can run for a long way under a single field.'),
        ],
        parentNote: 'Learned how a mole’s spade-shaped front paws help it dig its burrow.',
      },
      {
        domain: 'sel',
        skill: 'managing frustration when a job keeps going wrong',
        standard: 'CASEL: Self-management',
        kind: 'ask',
        after: 7,
        prompt: [N('Dusty is fed up. What’s a good move when a job keeps going wrong?')],
        options: [
          opt(
            'Take a break, do something else, and come back fresh.',
            [N('Yes. A break isn’t giving up. Dusty’s about to get one in a boat.')],
            true,
          ),
          opt('Keep going, crosser and crosser, until it’s done.', [
            N('Sometimes that works. But being cross makes mistakes. A break often helps more.'),
          ]),
          opt('Never try again.', [
            N('That feels true when you’re fed up. Usually a break is enough, and you try again.'),
          ]),
        ],
        parentNote:
          'Thought about handling frustration by taking a break and coming back to a task.',
      },
    ],
  ),
  // ------------------------------------------------ step 1 done: the launch
  scene(
    's29-launch',
    [
      N(
        'The boat goes into the stream with a smack and a wobble, and sits there looking pleased with itself.',
      ),
      N('Your Nubbin is in before anyone else, and takes the very front: the little pointed seat.'),
      MA(
        'That’s the bow. The back end’s the stern. And that’s a Nubbin who knows what’s what.',
        'happy',
      ),
      DU('It’s moving. It’s just sitting there, and it’s moving. Is it meant to do that?', 'shock'),
      MA('That’s the whole idea, love.'),
      DU(
        'But it’s heavy. Heavy things sink. I dropped a trowel in this stream once. It sank like a stone.',
        'think',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'why boats float: balanced forces',
        standard: '3-PS2-1',
        kind: 'notice',
        after: 5,
        lines: [
          MA('A boat pushes water out of the way, and the water pushes back up on it.'),
          MA(
            'When that push up is as big as the boat’s weight, the forces balance, and she floats.',
          ),
          MA(
            'A trowel’s solid metal, heavy for its size. It can’t push aside enough water to hold it up, so down it goes.',
          ),
        ],
        parentNote: 'Learned that a boat floats when the water’s upward push balances its weight.',
      },
    ],
  ),
  // ------------------------------------------------ step 2 scene: in the boat
  scene(
    's29-boats',
    [
      MA(
        'Vests on. Cork, see? Nobody gets in my boat without one. Not you, not Dusty, not me, not the King.',
        'think',
      ),
      N('The vests are old and stiff, and smell faintly of the sea.'),
      N('Dusty puts theirs on back to front, then the right way round, then back to front again.'),
      N(
        'Marina pushes off. The bank slides away, and the stream takes the boat as if it had been waiting all morning.',
      ),
      DU('So what is it you actually do? In a boat? All day?', 'think'),
      N(
        'Marina stops rowing and looks at Dusty very seriously, as if she has waited years for somebody to ask.',
      ),
      MA(
        'Honestly? Pottering about in a boat is the best thing there is. Nothing else comes close.',
        'soft',
      ),
      DU('That’s not an answer.'),
      MA('It’s the only answer. Duck. Low branch.', 'happy'),
      N(
        'In the bow, your Nubbin leans out with its ears blown flat, like a figurehead that has seen something wonderful.',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'materials and their properties: why cork floats',
        standard: '2-PS1-1',
        kind: 'notice',
        after: 1,
        lines: [
          MA('Cork comes from the bark of the cork oak. It’s full of tiny pockets of air.'),
          MA(
            'That makes it very light for its size. It has lots of buoyancy: it floats, and it holds you up.',
          ),
        ],
        parentNote:
          'Learned that cork floats because it is full of tiny air pockets, which is why it is used in life vests.',
      },
      {
        domain: 'health',
        skill: 'water safety: never on the water alone',
        kind: 'ask',
        after: 3,
        prompt: [
          MA(
            'My other rule: nobody goes out on the water alone. Not even me. Why do you think that is?',
            'think',
          ),
        ],
        options: [
          opt(
            'If something goes wrong, someone can help or fetch help.',
            [MA('Exactly. Water’s lovely, and it doesn’t care about you. Friends do.')],
            true,
          ),
          opt('So there’s someone to row.', [
            MA('Handy, but that’s not it. If anything goes wrong, someone’s there to help.'),
          ]),
          opt('Because it’s boring alone.', [
            MA('Never boring! But if anything goes wrong, you need someone there to help.'),
          ]),
        ],
        parentNote:
          'Learned two water-safety rules: always wear a life vest, and never go on the water alone.',
      },
    ],
  ),
  // ------------------------------------------------ step 2 done: the picnic
  scene(
    's29-picnic',
    [
      N(
        'The stream runs into the river, and the river turns off into a backwater: still and green, with a willow leaning over it.',
      ),
      N(
        'Marina ties up to the willow, hauls out a wicker basket and starts unpacking onto a blue-and-white rug.',
      ),
      MA(
        'Cold chicken. Ham. Two loaves. Three cheeses. Gherkins. Seed cake. Ginger beer. Lemonade…',
        'happy',
      ),
      DU('Wait! Stop! Nobody could eat all that!', 'shock'),
      MA('It’s a picnic, Dusty. Too much is the amount.'),
      N(
        'Out in the middle, a line of bubbles comes up. Then a flat brown head, whiskered, watching you.',
      ),
      N(
        'Then a second head, much smaller and rounder. It isn’t watching you; it’s watching the gherkins.',
      ),
      MA(
        'Otters. Keep still. That’s the old one, and that’s his kit. I call the kit Portly. You’ll see why.',
        'soft',
      ),
      N(
        'The little one comes ashore, walks straight up the rug, takes the biggest gherkin, and goes before anyone can move.',
      ),
      DU('He took a gherkin. He looked me in the eye and he took it.', 'shock'),
      MA(
        'He does that. Last summer it was a whole pork pie. He couldn’t lift it. He tried for an hour.',
        'happy',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'river features: a backwater',
        standard: '2-ESS2-2',
        kind: 'notice',
        after: 1,
        lines: [
          MA(
            'This is a backwater: a quiet arm off the side of the river, where the water hardly moves.',
          ),
          MA('Calm water is good for little fish. Little fish are good for otters.'),
        ],
        parentNote: 'Learned what a backwater is: a quiet, slow side-arm of a river.',
      },
      {
        domain: 'science',
        skill: 'how otters’ bodies suit river life',
        standard: '4-LS1-1',
        kind: 'notice',
        after: 7,
        lines: [
          N('Otters have thick fur that keeps water off their skin, and webbed feet for swimming.'),
          N(
            'Their whiskers feel for fish in muddy water. They need clean rivers with plenty of fish.',
          ),
        ],
        parentNote: 'Learned how an otter’s fur, feet and whiskers help it live in rivers.',
      },
    ],
  ),
  // ------------------------------------------------ step 3 scene: Dusty takes the oars
  scene(
    's29-oars',
    [
      N(
        'After lunch, with the sun gone soft and the basket much lighter, Marina rows you back out of the backwater.',
      ),
      DU('Let me have a go.'),
      MA('Not today. Next time, when you’ve watched a bit more.', 'think'),
      DU('I’ve watched loads. You just pull. Anyone can pull. I pull roots out of cliffs.'),
      N(
        'Before she can stop them, Dusty grabs both oars, stands up, and digs them hard into the river.',
      ),
      N(
        'One oar bites. The other skims the top of the water, and Dusty goes over backwards, boots in the air.',
      ),
      MA('You’ve caught a crab. That’s what it’s called. Sit down. SIT—', 'shock'),
      N(
        'Dusty grabs the side, and the whole boat turns over, quite slowly, as if it has thought about it first.',
      ),
      N(
        'Green water, bubbles, a great deal of noise. Then the cork vests do their job, and you all bob up like corks.',
      ),
      N(
        'Your Nubbins paddle past you to the bank in a neat line, as if they’d planned to swim home all along.',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'unbalanced forces change motion',
        standard: '3-PS2-1',
        kind: 'ask',
        after: 5,
        prompt: [
          N(
            'One oar pushed hard on the water. The other pushed on nothing. What does a boat do when only one side pushes?',
          ),
        ],
        options: [
          opt(
            'It swings round, because the forces aren’t balanced.',
            [
              N(
                'Yes. Push on one side only and the boat turns. Rowers keep both oars even to go straight.',
              ),
            ],
            true,
          ),
          opt('It goes faster in a straight line.', [
            N(
              'Straight lines need both oars pulling evenly. With one, the forces are unbalanced and the boat turns.',
            ),
          ]),
          opt('Nothing happens.', [
            N('Something always happens when a force pushes! With one oar, the boat swings round.'),
          ]),
        ],
        parentNote: 'Reasoned that unbalanced forces (one oar pulling) make a boat turn.',
      },
      {
        domain: 'literacy',
        skill: 'multiple-meaning words and idioms: “catch a crab”',
        standard: 'L.3.4',
        kind: 'notice',
        after: 6,
        lines: [
          N(
            '“Catching a crab” has nothing to do with crabs. Rowers say it when an oar blade slips or sticks in the water.',
          ),
        ],
        parentNote:
          'Learned the rowing phrase “catch a crab” and that words can mean different things in different places.',
      },
    ],
  ),
  // ------------------------------------------------ step 3 done: by the fire
  scene(
    's29-fire',
    [
      N(
        'Marina gets everything ashore: you, Dusty, the basket, the rug and both oars. Then she swims back for the boat.',
      ),
      N('She lights a fire in a ring of stones and sits Dusty in front of it, wrapped in the rug.'),
      DU('I’m so sorry. Your boat. Your lovely picnic. I’m an idiot.', 'sad'),
      MA('Never mind. Honestly. Never mind.', 'soft'),
      DU('The cheese is in the river.'),
      MA('Never mind the cheese. The fish will have a lovely afternoon. Never mind.', 'happy'),
      N('She says it until Dusty believes it. It takes most of an hour, and a whole pot of tea.'),
      MA(
        'Tomorrow I’ll teach you properly. Both of you. Then at least you’ll fall in the right way.',
        'happy',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'heat moves from warm bodies into cold water',
        standard: '4-PS3-2',
        kind: 'notice',
        after: 1,
        lines: [
          MA(
            'Out of the wet things and close to the fire. Cold water pulls heat out of your body much faster than cold air does.',
          ),
        ],
        parentNote:
          'Learned that cold water draws heat from the body fast, so you get dry and warm quickly after a dip.',
      },
      {
        domain: 'sel',
        skill: 'forgiving, and helping someone forgive themselves',
        standard: 'CASEL: Relationship skills',
        kind: 'ask',
        after: 6,
        prompt: [N('Marina says “never mind” again and again. Why so many times?')],
        options: [
          opt(
            'Dusty feels so bad they need to hear it more than once.',
            [
              N(
                'Yes. Forgiving someone once is quick. Helping them believe it takes longer, and a pot of tea.',
              ),
            ],
            true,
          ),
          opt('She forgot she’d already said it.', [
            N('Ha! No, she means it each time. Dusty needs to hear it until it sinks in.'),
          ]),
          opt('She’s secretly cross.', [
            N('Look at her face: she’s smiling. She keeps saying it so Dusty can believe it.'),
          ]),
        ],
        parentNote:
          'Thought about forgiveness, and why someone who feels bad may need to hear it more than once.',
      },
    ],
  ),
  // ------------------------------------------------ step 4 scene: lessons (the gift)
  scene(
    's29-lessons',
    [
      MA(
        'Lesson one: sit down. Lesson two: stay sat down. Most people never get past two.',
        'think',
      ),
      MA(
        'Feet braced. Pull with your back. Blades in, pull, out, turn them flat. Rowing is all looking behind you.',
      ),
      DU('That seems like a design fault.'),
      MA('Take it up with the river.', 'happy'),
      N(
        'By the afternoon you can both go in a straight line, mostly. Dusty only catches one more crab, and keeps their seat.',
      ),
      MA('And one for the little one. Cut it down from an old one. Arms up.', 'soft'),
      N(
        'Marina buckles a tiny cork vest onto your Nubbin. It stands very still, deeply proud, then marches about so everyone can see.',
      ),
      N(
        'All afternoon a small brown head has followed the boat. Wherever you row, it rows too, more or less.',
      ),
      MA('Portly. He’s adopted you. He does that, then forgets, then does it again.', 'happy'),
      MA('Give him something, if you like. Not food. Something he can keep.'),
    ],
    [
      {
        domain: 'science',
        skill: 'looking after wild animals: no human food',
        standard: 'K-ESS3-3',
        kind: 'ask',
        after: 9,
        prompt: [N('Why does Marina say not food?')],
        options: [
          opt(
            'Our food isn’t good for wild animals, and they can start to depend on people.',
            [
              MA(
                'That’s it. A wild otter should catch his own fish. Bread and pies make him poorly, and pushy.',
              ),
            ],
            true,
          ),
          opt('Otters don’t eat.', [
            MA(
              'Otters eat loads! Fish, mostly. That’s the point: they should eat their own food, not ours.',
            ),
          ]),
          opt('She wants to keep the gherkins.', [
            MA(
              'Well, yes. But really: our food isn’t good for wild animals, and they learn to beg.',
            ),
          ]),
        ],
        parentNote: 'Learned why we don’t feed wild animals human food.',
      },
    ],
    [
      {
        id: 'bead',
        label: 'A blue glass bead from your pocket.',
        set: { 's29-gift': 'bead' },
        then: [
          N(
            'You hold it out on a flat palm. Portly comes up the bank, sniffs it, and takes it in his teeth very carefully, like an egg.',
          ),
          N('He rolls it about on a flat stone for ten minutes, watching the light go through it.'),
          MA('Magpie. He’ll have that till he’s grey.', 'happy'),
        ],
      },
      {
        id: 'ribbon',
        label: 'A red ribbon off the picnic basket.',
        set: { 's29-gift': 'ribbon' },
        then: [
          N(
            'You lay it on the bank. Portly takes one end and swims off with it trailing behind him like a flag.',
          ),
          DU('Well, we’ll see him coming a mile off now.', 'happy'),
          MA('Half a mile. That’ll do.'),
        ],
      },
      {
        id: 'bell',
        label: 'A tiny brass bell off an old collar.',
        set: { 's29-gift': 'bell' },
        then: [
          N(
            'Marina threads it on a loop of soft cord, loose enough to slip off if it catches. Portly lets you put it over his head.',
          ),
          N('He shakes, and it rings. He shakes again, astonished, and then can’t stop.'),
          MA('Well. We’ll always know where he is now. Whether we want to or not.', 'happy'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 4 done
  scene(
    's29-lessons-done',
    [
      N(
        'Portly takes his present home along the bank in the evening light, very slowly, stopping to look at it.',
      ),
      DU(
        'He’s never pinched anything off you. Have you noticed? That’s how you can tell he likes you.',
        'happy',
      ),
      MA(
        'Same time next week. If either of you stands up in my boat again, I’ll sink you myself.',
        'happy',
      ),
      DU('She won’t. She says that to everybody.'),
      N('Your Nubbin walks home in its cork vest, though there is no water anywhere near.'),
      N('Behind you, the river goes on being the river, and doesn’t mind at all.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'think question: how we show we like someone',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 1,
        prompt: [
          N(
            'Dusty thinks not pinching your things is Portly’s way of liking you. How do you show someone you like them?',
          ),
        ],
        options: [
          opt('I share things with them.', [
            N(
              'Sharing says “you matter to me”. Portly would approve, as long as it isn’t gherkins.',
            ),
          ]),
          opt('I spend time with them.', [
            N('Time is a big present. Portly followed the boat all afternoon. That’s his way.'),
          ]),
          opt('I make them laugh.', [
            N('A good laugh together is a real bond. Dusty and Marina know all about that.'),
          ]),
        ],
        parentNote: 'Thought about the different ways people (and animals) show they like someone.',
      },
    ],
  ),
  // ------------------------------------------------ step 5 scene: the Wild Wood
  scene(
    's29-wildwood',
    [
      N(
        'August, and there is frost on the grass at dusk. Nobody can say why. It seems to creep down off the slope below the Circuit.',
      ),
      N(
        'Marina is at your gate with a lantern and a stout stick. She doesn’t lift and push; she shouts.',
      ),
      MA(
        'Dusty’s gone into the Wild Wood. On their own. At teatime. They’ve been restless all week.',
        'angry',
      ),
      MA('I said don’t, it’s getting dark. They said they only wanted a look.'),
      N('Later, Dusty will tell it like this.'),
      N(
        'It was quiet under the first trees, and cold. The path went in, the light went out, and the frost crunched.',
      ),
      N('And then Dusty started seeing things in the dark.'),
      N(
        'Little shapes in the holes between the roots, gone whenever Dusty looked straight at them.',
      ),
      N(
        'Then a pattering: behind, ahead, either side, like rain that hadn’t decided where to fall.',
      ),
      N(
        'Dusty ran, which is the wrong thing. They ran until they tumbled into the hollow of an old beech, and stayed there.',
      ),
      MA(
        'Rules of the Wood. Keep to the path. Don’t run. Keep talking. If you run out of things to say, say anything.',
        'think',
      ),
      MA('Shopping lists. Times tables. Anything. Come on.'),
    ],
    [
      {
        domain: 'science',
        skill: 'how frost forms',
        standard: '2-ESS2-3',
        kind: 'notice',
        after: 0,
        lines: [
          N(
            'Frost is frozen water. On a clear, still night, grass and leaves can cool below 0 °C (32 °F).',
          ),
          N(
            'Then water vapour in the air freezes straight onto them as tiny ice crystals. In August, that’s very odd.',
          ),
        ],
        parentNote:
          'Learned that frost forms when water vapour freezes onto surfaces colder than 0 °C.',
      },
      {
        domain: 'health',
        skill: 'staying safe when lost',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 10,
        prompt: [N('Marina says running is the wrong thing to do when you’re lost. Why?')],
        options: [
          opt(
            'You get more lost and can get hurt. Staying put helps people find you.',
            [MA('Right. Stop, stay, and call out. Searchers find people who stay put.', 'think')],
            true,
          ),
          opt('Running makes you tired.', [
            MA(
              'True, but the big reason: you get more lost, and harder to find. Stay put and call.',
            ),
          ]),
          opt('It isn’t. Running gets you out faster.', [
            MA(
              'Only if you know the way. Lost and running usually means more lost. Stay put and call.',
            ),
          ]),
        ],
        parentNote: 'Talked about what to do if lost: stop, stay put, and call for help.',
      },
    ],
  ),
  // ------------------------------------------------ step 5 done: the beech
  scene(
    's29-beech',
    [
      N(
        'You go in talking. Marina names every rock pool on the coast from west to east, and you do your times tables.',
      ),
      MA('Seven sixes?'),
      Y('Er…'),
      N(
        'The little shapes, if they are anything, keep to the edge of the lantern light. The pattering keeps pace, and stops when you stop.',
      ),
      N(
        'Your Nubbin rides inside your coat with only its eyes showing. It doesn’t like the Wood, and it doesn’t make a sound.',
      ),
      N(
        'At last, in the hollow of a great beech, something says “Ow” very quietly. Dusty is curled in the dead leaves, white with frost.',
      ),
      DU('I only wanted a look.', 'sad'),
      DU('I know. I know. Don’t say it.'),
      MA('Wasn’t going to. You’re frozen. Up you get.', 'soft'),
      N(
        'But the frost has thickened while you searched. The path has gone under it, and the lantern is guttering.',
      ),
      MA('We’re not getting home tonight. Not that way.', 'think'),
    ],
    [
      {
        domain: 'maths',
        skill: 'multiplication facts: 7 × 6',
        standard: '3.OA.A.3',
        kind: 'ask',
        after: 2,
        prompt: [N('Seven sixes: seven groups of six. Help out. How many?')],
        options: [
          opt('42', [MA('Forty-two. Lovely. Keep going: eight sixes?', 'happy')], true),
          opt('36', [MA('That’s six sixes. One more six makes forty-two.')]),
          opt('48', [MA('That’s eight sixes. Take one six away: forty-two.')]),
        ],
        parentNote: 'Worked out 7 × 6 = 42 as seven equal groups of six.',
      },
      {
        domain: 'science',
        skill: 'animals’ senses: eyeshine in the dark',
        standard: '4-LS1-2',
        kind: 'notice',
        after: 3,
        lines: [
          MA(
            'Lots of night animals have a shiny layer at the back of their eyes. It helps them see in dim light.',
            'think',
          ),
          MA(
            'That’s why eyes shine back at a lantern. Most things watching you in a wood are only curious.',
          ),
        ],
        parentNote:
          'Learned that many nocturnal animals have a reflective layer in their eyes that helps them see in the dark.',
      },
    ],
  ),
  // ------------------------------------------------ step 6 scene: the door
  scene(
    's29-door',
    [
      N('You go on slowly, holding one another’s sleeves, with Dusty in the middle.'),
      N('Dusty trips over something, hard, and sits down in the frost holding their shin.'),
      DU(
        'Ow. Something with an edge. In the middle of a wood. Who leaves an edge in a wood?',
        'angry',
      ),
      N(
        'Marina scrapes the frost away with her stick. It’s an iron boot-scraper, very old, set into a stone step.',
      ),
      MA('A scraper means a step. A step means a door. Dig, Dusty. You’re good at that.', 'happy'),
      DU('Fine. Yes. Digging. I take it all back.'),
      N(
        'Under the frost there is a doormat, and beyond it a little green door set into a bank under old stones.',
      ),
      N('Marina pulls a bell-pull. Deep in the bank, a long way off, a bell clanks.'),
      N(
        'Nothing. Then, very slowly, bolts going back: one, two, three, and a fourth, rusty, that takes some persuading.',
      ),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'objects as clues to how people lived',
        standard: 'D2.His.2.K-2',
        kind: 'ask',
        after: 4,
        prompt: [N('Marina worked out there was a door from one rusty object. How?')],
        options: [
          opt(
            'Boot-scrapers sit by doors, so someone must live, or once lived, nearby.',
            [
              N(
                'Exactly. Archaeologists do the same: one object can tell you a whole story about people.',
              ),
            ],
            true,
          ),
          opt('She guessed.', [
            N('It was more than a guess. A boot-scraper only belongs by a door. That’s a clue.'),
          ]),
          opt('She’d been there before.', [
            N('She hadn’t! She read the clue: scrapers live by doors.'),
          ]),
        ],
        parentNote:
          'Used an object as a clue about the people who lived there, the way archaeologists do.',
      },
    ],
  ),
  // ------------------------------------------------ step 6 done: Granny Brock's kitchen
  scene(
    's29-kitchen',
    kitchenLines(
      N(
        'Dusty listens to every word, very hard, the way you listen to someone old when someone at home is getting old too.',
      ),
    ),
    [
      {
        domain: 'literacy',
        skill: 'character traits from actions, not just words',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 8,
        prompt: [N('Granny Brock grumbles at everyone. But what does she actually do?')],
        options: [
          opt(
            'Lets you in, feeds you and keeps you warm.',
            [N('Yes. Her words are prickly; her actions are kind. Actions usually tell you more.')],
            true,
          ),
          opt('Sends you away.', [
            N(
              'She says “In. All of you.” Watch what she does: soup, fire, blanket. That’s kindness.',
            ),
          ]),
        ],
        parentNote:
          'Worked out a character’s true nature from her actions rather than her grumpy words.',
      },
      CHARCOAL,
    ],
  ),
  // ------------------------------------------------ step 7 scene: the culvert
  scene(
    's29-culvert',
    [
      N(
        'First light. Granny Brock is up before any of you, in boots and a coat older than her door.',
      ),
      GB(
        'Not back through the Wood. Not with that one. The Wood’s had its look at them already.',
        'think',
      ),
      GB(
        'There’s an old way. A drain from the old town. Goes under the lot and comes out by the fields. Mind your heads.',
      ),
      N(
        'She takes a lantern and a ring of keys off a nail, and leads you down a passage, then down some steps, then down some more.',
      ),
      N(
        'The culvert is low and round and dry, made of old brick. Your Nubbin runs ahead into the dark, then runs back to check on you.',
      ),
      GB('That one’s sensible. Goes ahead, comes back. More than I can say for some.', 'think'),
      N(
        'Brick by brick, the tunnel curves gently upward. Somewhere above you are the roots of the whole Wild Wood.',
      ),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'life in the past: how old towns dealt with water',
        standard: 'D2.His.2.K-2',
        kind: 'notice',
        after: 2,
        lines: [
          GB('Towns have needed drains as long as there’ve been towns. Rain has to go somewhere.'),
          GB('Folk built this with bricks and their own hands. It’s outlasted every one of them.'),
        ],
        parentNote:
          'Learned how people in the past built drains and culverts to carry water away from towns.',
      },
    ],
  ),
  // ------------------------------------------------ step 7 done: the fields
  scene(
    's29-fields',
    [
      N(
        'Daylight, round and white at the end of the tunnel. You come out among nettles at the edge of a hayfield, blinking.',
      ),
      N(
        'Behind you the Wood stands dark and quiet, and doesn’t look at all as if it was looking at anyone.',
      ),
      GB(
        'Go home. Don’t come in after dark. Come in the day, if you like. Bring cake. Don’t ring the bell.',
        'think',
      ),
      N('She goes back into the culvert. Somewhere inside, a gate shuts, and four bolts.'),
      DU(
        'I’m a river person now. I’ve decided. Rivers are flat. You can see what’s coming.',
        'soft',
      ),
      DU('Nothing looks at you from a river.'),
      MA('Otters do.', 'happy'),
      DU('Otters are allowed.'),
    ],
    [
      {
        domain: 'literacy',
        skill: 'how a character responds to events',
        standard: 'RL.2.3',
        kind: 'ask',
        after: 5,
        prompt: [N('How has the night in the Wood changed Dusty?')],
        options: [
          opt(
            'Dusty has learned the Wood isn’t for them, and feels safe by the river.',
            [N('Yes. A scary night taught Dusty where they belong, at least for now.')],
            true,
          ),
          opt('Dusty wants to go back in tonight.', [
            N('Look at what Dusty says: “I’m a river person now.” The Wood has put them off.'),
          ]),
          opt('Nothing has changed.', [
            N('Something has! Dusty has made a new decision about who they are.'),
          ]),
        ],
        parentNote: 'Described how a character changed after a frightening event.',
      },
    ],
  ),
  // ------------------------------------------------ step 8 scene: the low river (s4Done unset)
  scene(
    's29-low-river',
    [
      ...RIVER_START,
      N(
        'Above the backwater the river is wrong. The banks stand high and dry, and weed lies flat on stones that should be under water.',
      ),
      MA(
        'A hand too low. It’s been a hand too low all summer. Something upstream’s having it.',
        'think',
      ),
      N(
        'Halfway up, the boat grounds on gravel. There’s nothing for it: out, all of you, and carry.',
      ),
      N('The water round your ankles is cold enough to make your teeth hurt.'),
      DU('Cold. In August.', 'shock'),
      MA('It was cold in July, too. Nobody listened then either.', 'sad'),
    ],
    [
      {
        domain: 'maths',
        skill: 'units of length: old and metric',
        standard: '4.MD.A.1',
        kind: 'ask',
        after: 4,
        prompt: [
          N(
            'A “hand” is an old measure, still used for horses. It’s four inches, or about 10 centimetres.',
          ),
          N('So about how far has the river dropped?'),
        ],
        options: [
          opt(
            'About 10 cm',
            [
              MA(
                'About ten centimetres. Doesn’t sound much, but a whole river’s worth is a lot of water.',
                'think',
              ),
            ],
            true,
          ),
          opt('About 1 metre', [
            MA('A metre would be about ten hands. Just the one hand: roughly ten centimetres.'),
          ]),
          opt('About 1 cm', [MA('That’s a fingernail. A hand is about ten centimetres.')]),
        ],
        parentNote: 'Converted an old unit (a hand) into centimetres.',
      },
    ],
  ),
  // ------------------------------------------------ step 8 done: the weir
  scene(
    's29-weir',
    [
      N(
        'Up at the weir, the river comes over in one long glassy fold, roars, and spreads into a wide brown pool.',
      ),
      MA(
        'A weir’s a low wall built across a river. It holds the water back upstream, deep enough for boats and mills.',
        'think',
      ),
      N(
        'Just above the weir, where the river splits to go round it, there is an island: willows, and a little bank of long grass.',
      ),
      MA('Nobody lands there.', 'soft'),
      DU('Why not?'),
      MA(
        'Don’t know. Nobody does. My gran didn’t, and her gran didn’t. There’s nothing on it but grass.',
        'think',
      ),
      MA(
        'There’s a spring on it, warm all winter. Same water as behind the falls, my gran reckoned.',
      ),
      MA(
        'This river starts up in the hills, at its source, and ends at the sea. We’re about halfway.',
      ),
      MA(
        'Come on, it’s getting on. We’ll leave her at the landing under the cliff and walk the last bit.',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'mapping a river: source, backwater, ford, weir, island',
        standard: '2-ESS2-2',
        kind: 'do',
        after: 8,
        check: 'edu:label:river-map:5',
        lines: [
          N(
            'Marina scratches the river into the mud with her stick. Label her map: source, backwater, ford, weir, island.',
          ),
          MA(
            'Source at the top, where it starts. The sea at the bottom. Everything else in between.',
          ),
        ],
        parentNote:
          'Labelled a river map with five river features: source, backwater, ford, weir and island.',
      },
    ],
  ),
  // ------------------------------------------------ step 9 scene: dusk on the river path
  scene(
    's29-dusk',
    [
      N(
        'Dusk on the river path. Above you rises a cliff striped like a cake: brown, red, grey, brown.',
      ),
      N(
        'Marina walks ahead, fast, talking about supper. Halfway along, Dusty stops dead, as if somebody has called their name.',
      ),
      DU('Oh.', 'shock'),
      N(
        'They are looking up the cliff, at a small round door in the rock and a window with no light in it.',
      ),
      DU(
        'That’s mine. I can smell it. Earth, and old tea, and… it’s mine. I haven’t been back. Not since the rain.',
        'sad',
      ),
      DU('Marina! Marina, wait—'),
      MA('Come on, you two! Supper! I’m starving, and it’s getting dark!', 'happy'),
      N(
        'Marina hasn’t heard; she’s already round the bend. Dusty looks after Marina, and up at the door, and along the path again.',
      ),
      N('Then they sit down on an old stump by the path, put their face in their hands, and cry.'),
    ],
    [
      {
        domain: 'science',
        skill: 'rock layers show the past',
        standard: '4-ESS1-1',
        kind: 'notice',
        after: 0,
        lines: [
          N(
            'Those stripes are rock layers. Each was laid down as mud or sand, a very long time ago, one on top of another.',
          ),
          N(
            'The bottom layers are usually the oldest, so reading a cliff is a bit like reading a book from the back.',
          ),
        ],
        parentNote:
          'Learned that rock layers form one on top of another, so lower layers are usually older.',
      },
    ],
  ),
  // ------------------------------------------------ step 9 done: Marina turns back
  scene(
    's29-turnback',
    [
      N('You catch Marina up at the bend. You don’t have to say much: you say “Dusty”, and point.'),
      N('She turns round at once, in the middle of a word, and goes back down the path at a run.'),
      MA('Dusty. Oh, Dusty. What is it?', 'soft'),
      DU('It’s the house. It’s only the house. I can’t go in. Everything in it is hers.', 'sad'),
      DU('And I can’t walk past it either. I tried. My feet won’t.'),
      MA('Then we won’t walk past it. I’m an idiot. I was thinking about my supper.', 'sad'),
      MA('Right. Up we go. All of us. I’m not leaving you on a stump.', 'soft'),
      N(
        'Dusty is homesick and heartsore at once: missing the house, and missing who used to be in it.',
      ),
    ],
    [
      {
        domain: 'sel',
        skill: 'think question: not noticing a friend',
        standard: 'CASEL: Social awareness',
        kind: 'ask',
        after: 5,
        prompt: [N('Marina rushed on and didn’t notice Dusty. Was that unkind?')],
        options: [
          opt('No. She just didn’t notice.', [
            N(
              'That’s fair. Not noticing isn’t the same as not caring. She turned round the moment she knew.',
            ),
          ]),
          opt('A bit. She should have looked back.', [
            N('That’s fair too. Marina thinks so herself: she called herself an idiot.'),
          ]),
          opt('What matters is what she did next.', [
            N(
              'A thoughtful answer. Everyone misses things. Marina ran straight back, and that counts.',
            ),
          ]),
        ],
        parentNote:
          'Thought about the difference between not noticing someone and not caring, and about putting things right.',
      },
      {
        domain: 'sel',
        skill: 'homesickness: naming it and what helps',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 7,
        lines: [
          N(
            'Homesickness is missing a place, or the people in it. It can arrive suddenly, from a smell or a sound.',
          ),
          N('It helps to name it, to have company, and to go back gently, a little at a time.'),
        ],
        parentNote: 'Learned what homesickness is and what helps a friend who feels it.',
      },
    ],
  ),
  // ------------------------------------------------ step 10 scene: the cliff house
  scene(
    's29-cliffhouse',
    [
      N(
        'Inside, Dusty’s house is cold, dusty and dark: a round room cut from the rock, a stove, two chairs and a great many trowels.',
      ),
      MA(
        'Look at it. A proper little house, this. Snug as an egg. And you’ve been sleeping in my boathouse with the nets.',
        'happy',
      ),
      DU('It’s not snug. It’s cold. There’s nothing to eat.', 'sad'),
      MA(
        'There’s always something to eat. You: kindling, the dry stuff, round the side. Dusty: sit. I’ll do the cupboards.',
        'think',
      ),
      N(
        'Dusty sits. Marina goes through the cupboards like weather, opening everything and talking to all of it.',
      ),
      MA(
        'Biscuits. Ancient. They’ll do. Tea. A jar of… pickled onions? They’ll do. Candles!',
        'happy',
      ),
    ],
    [
      {
        domain: 'literacy',
        skill: 'similes',
        standard: 'L.4.5',
        kind: 'ask',
        after: 4,
        prompt: [
          N(
            '“Snug as an egg” is a simile. So is “through the cupboards like weather”. What does that one tell you about Marina?',
          ),
        ],
        options: [
          opt(
            'She’s fast, noisy and everywhere at once.',
            [N('Yes. Like a gust of wind and rain, she gets into every corner.')],
            true,
          ),
          opt('She’s wet.', [
            N('Ha! Not that kind of weather. It means she’s quick, loud and into everything.'),
          ]),
          opt('She’s cold.', [
            N('Think of a stormy day: busy, noisy, everywhere. That’s Marina in a cupboard.'),
          ]),
        ],
        parentNote: 'Explained what a simile (“like weather”) says about a character.',
      },
    ],
  ),
  // ------------------------------------------------ step 10 done: supper (s5Done unset)
  scene(
    's29-supper',
    [
      ...SUPPER_START,
      DU(
        'Fossil’s. She liked it there. Twenty years by that stove, and she never once let me have the warm side.',
        'soft',
      ),
      DU('I couldn’t come in with her basket there. And I couldn’t move it. So I didn’t come in.'),
      ...SUPPER_END,
    ],
    [
      {
        domain: 'sel',
        skill: 'grief: keeping what reminds us',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 5,
        lines: [
          N(
            'Fossil died. Her body stopped working, and it won’t start again. Dusty misses her very much.',
          ),
          N(
            'Keeping something of hers isn’t silly. It’s one way of keeping her close, and friends help with the rest.',
          ),
        ],
        parentNote: 'Talked about grief, and how keeping a loved one’s things can be a comfort.',
      },
      { ...RHYME, after: 11 },
    ],
  ),
  // ------------------------------------------------ step 11 scene: Portly is missing
  scene(
    's29-missing',
    [
      N(
        'The last days of summer. The swallows are lining up on the wires, and the evenings smell of smoke.',
      ),
      N('Marina comes up the lane early, without her boat, without a basket and without a joke.'),
      MA('Portly’s gone. Three days now. Nobody’s seen him on the river, up or down.', 'sad'),
      MA(
        'He wanders. He always has, and he’s always turned up. But never this long, and the nights are getting cold.',
      ),
      MA('The old one won’t make a fuss. Otters don’t. That’s how you know it’s bad.', 'sad'),
      Y('Where does the old one go?'),
      MA('The ford. Where Portly learned to swim. Come and see.'),
    ],
    [
      {
        domain: 'science',
        skill: 'seasons: shorter days and migrating birds',
        standard: '1-ESS1-2',
        kind: 'notice',
        after: 0,
        lines: [
          N(
            'Swallows gather on wires before they migrate. Britain’s swallows fly all the way to southern Africa for the winter.',
          ),
          N(
            'As summer ends, the days grow shorter and the nights colder. That’s their signal to go.',
          ),
        ],
        parentNote: 'Learned that swallows migrate south as the days shorten at the end of summer.',
      },
    ],
  ),
  // ------------------------------------------------ step 11 done: the ford
  scene(
    's29-ford-watch',
    [
      N(
        'At the ford the water runs shallow and loud over the stepping stones. On the flattest stone sits the old otter, quite still.',
      ),
      N(
        'He doesn’t look at you. He looks upstream, the way the water comes, and doesn’t move, and doesn’t eat.',
      ),
      MA(
        'Every night, and every morning before it’s light, he sits right there. Waiting for the water to bring him back.',
        'soft',
      ),
      N(
        'Dusty comes down the bank with a flask and a blanket, sits a little way off from the old otter, and stays.',
      ),
      DU('Somebody ought to sit with him. I know about sitting.', 'soft'),
      MA(
        'Tonight we go up. You and me, in the boat, all the way to the weir if we have to.',
        'think',
      ),
      MA('Bring a lantern. And bring that one of yours. They see better in the dark than we do.'),
      MA(
        'Dusty stays on the bank, so somebody knows where we’ve gone. That’s the rule on the water at night.',
      ),
    ],
    [
      {
        domain: 'social-studies',
        skill: 'places and their names: fords',
        standard: 'D2.Geo.2.K-2',
        kind: 'notice',
        after: 0,
        lines: [
          N('A ford is a shallow place where people and animals can cross a river on foot.'),
          N(
            'Many English towns grew up beside fords and kept the word in their names: Oxford, Bradford, Stratford.',
          ),
        ],
        parentNote: 'Learned what a ford is, and how it shows up in place names like Oxford.',
      },
      {
        domain: 'health',
        skill: 'water safety: someone on shore knows your plan',
        kind: 'ask',
        after: 7,
        prompt: [N('Why does Marina want Dusty on the bank?')],
        options: [
          opt(
            'So someone knows where they are and can raise the alarm.',
            [
              MA(
                'That’s it. Tell someone where you’re going and when you’ll be back. Every time.',
                'think',
              ),
            ],
            true,
          ),
          opt('Because Dusty capsizes boats.', [
            MA('Fair point! But the real reason: someone on shore can fetch help if we need it.'),
          ]),
        ],
        parentNote:
          'Learned to always tell someone where you are going on the water, and when you will be back.',
      },
    ],
  ),
  // ------------------------------------------------ step 12 scene: upriver by night
  scene(
    's29-upriver',
    [
      N(
        'Night. The river is black and smooth, and the lantern makes a small gold room on it that goes where you go.',
      ),
      N(
        'Marina rows. You hold the lantern out over the bow, where your Nubbin sits in its cork vest with its ears up.',
      ),
      MA(
        'Keep it low. Look at the edges: mud, reeds, roots. He’ll be somewhere a kit thinks is a good idea.',
        'think',
      ),
      N(
        'Owls, a fish jumping, once a dog far off. The river makes small noises, and every one of them is not Portly.',
      ),
      MA(
        'He’s a good swimmer. I taught him. Well. He taught himself, and I watched and said well done.',
        'soft',
      ),
      MA('Vest done up? Right. We go on till we find him or the river runs out.'),
    ],
    [
      {
        domain: 'science',
        skill: 'we see things when light reaches our eyes',
        standard: '1-PS4-2',
        kind: 'ask',
        after: 0,
        prompt: [N('Outside the lantern’s gold room, you can’t see the bank at all. Why not?')],
        options: [
          opt(
            'We only see things when light bounces off them into our eyes.',
            [N('Yes. No light on the bank, nothing to bounce, nothing to see. Hence lanterns.')],
            true,
          ),
          opt('The bank has gone away at night.', [
            N('It’s still there! It just has no light bouncing off it into your eyes.'),
          ]),
          opt('Our eyes are tired.', [
            N('Not this time. Without light to bounce off things, nobody can see them.'),
          ]),
        ],
        parentNote: 'Learned that we see objects only when light from them reaches our eyes.',
      },
    ],
  ),
  // ------------------------------------------------ step 12 done: the bead (s29-gift = bead)
  scene(
    's29-night',
    [
      N(
        'Something winks in the lantern beam, down on a mudbank. Your Nubbin sees it first, and nearly goes over the side.',
      ),
      N(
        'It’s the blue glass bead, pressed into the mud. Round it, small webbed prints lead off upstream.',
      ),
      MA('He was here. He put it down. He never puts it down.', 'shock'),
      N(
        'You put the bead in your pocket and row on, following the prints until the mud runs out at the weir.',
      ),
      ...NIGHT_END,
    ],
    [
      {
        domain: 'science',
        skill: 'webbed feet help otters swim',
        standard: '4-LS1-1',
        kind: 'notice',
        after: 1,
        lines: [
          MA(
            'Webbed feet. Skin stretched between the toes, like a paddle. That’s an otter, and a small one.',
          ),
          MA('Webs push more water with every kick. That’s why otters swim so well.'),
        ],
        parentNote: 'Read animal tracks and learned how webbed feet help otters swim.',
      },
    ],
  ),
  // ------------------------------------------------ step 13 scene: the island at dawn
  scene(
    's29-island',
    [
      N(
        'Marina rows on, not as if she has decided to. The boat touches the island with a soft sound, and you step out.',
      ),
      N(
        'The air is warm, warmer than any night this summer. It smells of wet stone, deep water and something green.',
      ),
      N(
        'Among the willows there is a hollow in the long grass, pressed flat, as if something large had sat there all night.',
      ),
      N(
        'In the middle of it, curled nose to tail, is Portly. Asleep, round and safe, his sides going up and down.',
      ),
      N(
        'Your Nubbin walks to the edge of the hollow and stops. The ball above its head begins to glow, softly, the colour of the sky.',
      ),
      MA('Scared? Here? Don’t be daft. Nobody could be scared of a place like this.', 'soft'),
      N('She is holding your sleeve, tight.'),
      MA('…I am, though. A bit. And I don’t mind at all. Isn’t that strange?', 'soft'),
      N(
        'None of you looks up. It seems important, all at once, to look only at Portly and the grass and your own feet.',
      ),
      N(
        'Then a small warm wind comes off the water, goes over the island once, through your hair, and away.',
      ),
      N('You are standing on an island at dawn, and you can’t think why you’re both so quiet.'),
      MA('Well, look at that. There he is. Fast asleep, the little beggar.', 'happy'),
      N(
        'Whatever there was to remember, you’ve been kindly let off remembering it. Your Nubbin yawns, and its light is just a light.',
      ),
      N('Marina lifts Portly into the boat, still asleep, and wraps him in her scarf.'),
    ],
    [
      {
        domain: 'science',
        skill: 'the Sun rises in the east',
        standard: '1-ESS1-1',
        kind: 'notice',
        after: 0,
        lines: [
          N(
            'Dawn is the first light, just before the Sun comes up. The Sun rises in the east, so that sky turns pale first.',
          ),
        ],
        parentNote:
          'Learned that dawn is the first light before sunrise, and that the Sun rises in the east.',
      },
      {
        domain: 'sel',
        skill: 'think question: mixed feelings',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 7,
        prompt: [
          N(
            'Marina is scared and not scared, both at once. Have you ever felt two feelings together?',
          ),
        ],
        options: [
          opt('Yes: excited and nervous.', [
            N('That’s a very common pair. Big days often bring both.'),
          ]),
          opt('Yes: happy and sad.', [
            N('That happens at goodbyes and endings. Both feelings are real.'),
          ]),
          opt('I’m not sure.', [
            N(
              'That’s fine. Next time a big moment comes, notice if more than one feeling turns up.',
            ),
          ]),
        ],
        parentNote: 'Reflected on mixed feelings and when two feelings can be true at once.',
      },
    ],
  ),
  // ------------------------------------------------ step 13 done: the ford (s29-gift = bead)
  scene(
    's29-ford',
    [
      ...FORD_START,
      N(
        'Before they go, Portly comes back up the bank. You put the blue bead down on the stone for him.',
      ),
      N(
        'He looks at it, and at you. Then he noses it back to your boot, puts a wet pebble beside it, and goes.',
      ),
      ...FORD_END,
    ],
    [
      TEARS,
      {
        domain: 'science',
        skill: 'cleaner rivers brought otters back',
        standard: '3-LS4-4',
        kind: 'notice',
        after: 13,
        lines: [
          N(
            'In the 1960s and 1970s, otters almost vanished from English rivers, poisoned by farm chemicals washing into the water.',
          ),
          N(
            'When those chemicals were banned and rivers were cleaned up, otters came back. Now they live in every county in England.',
          ),
        ],
        parentNote:
          'Learned how banning harmful chemicals and cleaning rivers brought otters back to England.',
      },
    ],
  ),
  // ------------------------------------------------ step 14 scene: the seafarer
  scene(
    's29-seafarer',
    [
      N(
        'Autumn. The leaves are turning, and one morning the swallows have gone without saying goodbye.',
      ),
      N(
        'A man comes up the valley road with a pack on his back: brown as a walnut, a gold ring in one ear, eyes creased from sun on water.',
      ),
      SF(
        'Afternoon. Is this the river that comes down off the falls? I’ve followed it all the way up from the sea.',
        'happy',
      ),
      N(
        'Marina is mending nets on the bank. He sits down beside her to rest his feet, and doesn’t get up again until the light goes.',
      ),
      SF(
        'South of here the sea’s the colour of a bottle. The harbours are full of boats painted every colour you can name.',
        'soft',
      ),
      SF(
        'Nights on deck, you lie on your back and the stars swing over the mast like a lamp on a chain.',
      ),
      SF(
        'I’ve been everywhere you can get to by water. And there’s always more water. That’s the beauty of it.',
      ),
      N(
        'Marina doesn’t say anything. She has stopped mending, and the net lies in her lap with the needle stuck in it.',
      ),
      SF(
        'Well. I’ll be on. There’s a ship at the river mouth at the end of the week, and tides don’t wait.',
        'happy',
      ),
      N(
        'He’s a wayfarer, and off he goes, down to the coast. Marina watches until he’s a speck, and then until he isn’t.',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'rivers flow from source to mouth',
        standard: '2-ESS2-2',
        kind: 'notice',
        after: 2,
        lines: [
          N(
            'Rivers flow downhill, from their source in the hills to their mouth, where they meet the sea.',
          ),
          N(
            'So walking “up” a river means walking towards its source. The seafarer has walked against the flow all the way.',
          ),
        ],
        parentNote: 'Learned that rivers flow downhill from source to mouth.',
      },
      {
        domain: 'literacy',
        skill: 'inferring a character’s feelings from what she does',
        standard: 'RL.3.3',
        kind: 'ask',
        after: 7,
        prompt: [N('Marina says nothing, but she has stopped mending. What does that tell you?')],
        options: [
          opt(
            'His stories have got hold of her. She’s far away in her head.',
            [N('Yes. Hands go still when minds go wandering.')],
            true,
          ),
          opt('She’s finished the net.', [
            N(
              'The needle’s still stuck in it! She’s stopped because she’s listening, and dreaming.',
            ),
          ]),
          opt('She’s bored.', [
            N('Bored people fidget. Marina’s gone still: she’s caught up in his stories.'),
          ]),
        ],
        parentNote: 'Inferred a character’s feelings from her actions.',
      },
    ],
  ),
  // ------------------------------------------------ step 14 done: packing (the second choice)
  scene(
    's29-packing',
    [
      N(
        'At dusk Dusty comes running up to your gate, out of breath. Together you reach the boathouse just as the lamps come on.',
      ),
      N(
        'Marina is moving about quickly and quietly, folding jumpers into a bag on the bed, and not looking at either of you.',
      ),
      N(
        'Her eyes have gone grey-green, like the sea in a picture. She looks straight through you, at something a long way south.',
      ),
      MA(
        'I’m only going to have a look. A season. Two. Down the coast, and then on. I’ve never been anywhere.',
        'soft',
      ),
      MA('All my life, the same river. Up to the weir and back. Up to the weir and back.'),
      DU('You love the river! You told me. You said it was the best thing there is!', 'sad'),
      N('She doesn’t stop folding.'),
    ],
    [
      {
        domain: 'sel',
        skill: 'think question: a friend’s choice, and how far to go to stop them',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 6,
        prompt: [
          N(
            'Marina is a grown-up, and it’s her choice. But her friends think she isn’t herself. What should a friend do?',
          ),
        ],
        options: [
          opt('Hold on, and not let go.', [
            N(
              'That would keep her here. It also means not listening when she says “let go”. That has a cost.',
            ),
          ]),
          opt('Stay close, and wait.', [
            N('That leaves the choice with her, and shows you care. It might take a long time.'),
          ]),
          opt('Help her think about what she loves here.', [
            N('That reminds her of her own reasons, without forcing anything. Clever and kind.'),
          ]),
        ],
        parentNote:
          'Weighed different ways of helping a friend who may be making a choice they will regret.',
      },
    ],
    [
      {
        id: 'held',
        label: 'Hold on to her, Dusty’s way, and don’t let go.',
        set: { 's29-wayfarer': 'held' },
        then: [
          N(
            'Dusty sits down on the bag. You take one of Marina’s arms, and Dusty takes the other.',
          ),
          MA('Let go. Let GO. I mean it. You don’t understand, either of you.', 'angry'),
          N('She pulls, and you hold. She pulls harder, and you hold, and nobody says anything.'),
          N(
            'Then all at once she sits down on the floor between you, and the grey-green goes out of her eyes.',
          ),
          MA('…What was I doing? What was I doing with that bag?', 'shock'),
        ],
      },
      {
        id: 'sat',
        label: 'Sit down beside her. Don’t say anything.',
        set: { 's29-wayfarer': 'sat' },
        then: [
          N('You sit down on the end of her bed, next to the bag, and say nothing at all.'),
          N(
            'Marina folds another jumper, and another. Then she stops with one half folded, and looks at you.',
          ),
          N(
            'Dusty sits down on Marina’s other side. The three of you sit while the light goes, and nobody lights the lamp.',
          ),
          MA('…Hazel used to do that. Just sit. It used to drive me spare.', 'soft'),
          N('After a long time, she puts the jumper down.'),
        ],
      },
      {
        id: 'pencil',
        label: 'Put a pencil in her hand. Ask her to draw you the tide pools.',
        set: { 's29-wayfarer': 'pencil' },
        then: [
          N(
            'You find a pencil on the windowsill and the brown paper off a parcel, and put them both in her hands.',
          ),
          Y('Draw me the tide pools. Before you go. I’ll never remember them right.'),
          MA('Now? It’s getting dark. I’ll do it when I… fine. Fine. Quickly.', 'think'),
          N(
            'She draws the top pool, then the next, then the one with the anemone that never shuts and the crab under the green stone.',
          ),
          N(
            'By the bottom pool she is drawing slowly, and her eyes are her own colour again. She has forgotten the bag.',
          ),
          MA('There’s one I’ve never drawn. Hang on. Pass me another sheet.', 'happy'),
        ],
      },
    ],
  ),
  // ------------------------------------------------ step 15 scene: laid up
  scene(
    's29-laidup',
    [
      N(
        'A grey, blowy morning near the end of autumn. The willows are dropping their leaves into the river by the handful.',
      ),
      MA(
        'Time she came out, before the hard frosts. You don’t leave a boat in over winter. Not one you love.',
        'think',
      ),
      N(
        'You lay three round logs on the bank for rollers. Dusty takes the bow rope; you and Marina push from the stern.',
      ),
      DU('Nobody told me boats were this heavy when they’re not floating. It feels like a trick.'),
      MA('Heave. And heave. Mind your toes on the rollers.'),
      N(
        'Your Nubbin rides in the bow all the way up the bank and refuses to get out, so that it is still, technically, boating.',
      ),
    ],
    [
      {
        domain: 'science',
        skill: 'rollers reduce friction',
        standard: '3-PS2-1',
        kind: 'notice',
        after: 2,
        lines: [
          MA('Drag a boat over grass and it fights you every inch. That’s friction.'),
          MA(
            'Put her on rollers and they turn instead of scraping. Much less friction, much less heave.',
          ),
        ],
        parentNote: 'Learned that rollers reduce friction, making heavy things easier to move.',
      },
      {
        domain: 'science',
        skill: 'buoyancy: water carried the boat’s weight',
        standard: '3-PS2-1',
        kind: 'ask',
        after: 3,
        prompt: [N('Why does the boat feel so much heavier out of the water?')],
        options: [
          opt(
            'In the water, the water was pushing up and holding most of her weight.',
            [N('Yes. Out here, nothing pushes up but you three. It’s not a trick; it’s buoyancy.')],
            true,
          ),
          opt('She soaked up water all summer.', [
            N('A little, maybe. But mostly the river was holding her up, and now you are.'),
          ]),
        ],
        parentNote: 'Explained that water’s upward push carries much of a boat’s weight.',
      },
    ],
  ),
  // ------------------------------------------------ complete (s29-wayfarer = held)
  scene(
    's29-complete',
    [
      ...COMPLETE_START,
      MA(
        'I was cross with you both for a whole day after. Did you notice? I slammed doors.',
        'think',
      ),
      DU('We noticed. The boathouse has one door. You slammed it a lot.'),
      MA(
        'Thank you. For not letting go. I’d have hated it, I think: somewhere far off and warm, wishing I was cold here.',
        'soft',
      ),
      ...COMPLETE_END,
    ],
    [
      {
        domain: 'sel',
        skill: 'two true feelings: angry and grateful',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 4,
        lines: [
          N('Marina was angry, and she is grateful. Both are true.'),
          N(
            'Holding on worked this time. It also didn’t ask her. Good friends talk about that afterwards, the way she just did.',
          ),
        ],
        parentNote:
          'Reflected that a friend can be angry and grateful about the same thing, and that talking it through matters.',
      },
    ],
  ),
];

// ================================================================== variants
const VARIANTS: EduScene[] = [
  // ------------------------------------------------ step 6 done, if c6-open has played
  scene(
    's29-kitchen-after',
    kitchenLines(
      N(
        'Dusty listens to every word, very hard. Someone old at Dusty’s home has died, not long ago.',
      ),
    ),
    [
      CHARCOAL,
      {
        domain: 'sel',
        skill: 'grief comes in waves',
        standard: 'CASEL: Self-awareness',
        kind: 'notice',
        after: 11,
        lines: [
          N(
            'Being near someone old can bring a loss back, all at once. Grief often comes in waves like that.',
          ),
          N(
            'A warm room and quiet company help. Nobody here asks Dusty to talk, and that helps too.',
          ),
        ],
        parentNote: 'Learned that grief can come in waves, and that quiet company helps.',
      },
    ],
  ),
  // ------------------------------------------------ step 8 scene, if s4Done
  scene(
    's29-low-river-full',
    [
      ...RIVER_START,
      N(
        'The river is full to its banks, running fast and clear the way it ought to at the end of a summer.',
      ),
      MA(
        'Look at her go. Since a certain gate got opened, she’s been running like she means it.',
        'happy',
      ),
      N(
        'You row clean up through the shallows without touching bottom once. Dusty keeps time under their breath.',
      ),
      DU(
        'In, pull, out. In, pull, out. I’m doing it. I’m actually doing it. Don’t look at me, I’ll stop.',
        'happy',
      ),
      MA('Not looking. Eyes on the weir. Not looking at all.', 'happy'),
    ],
    [
      {
        domain: 'maths',
        skill: 'repeating patterns that follow a rule',
        standard: '4.OA.C.5',
        kind: 'ask',
        after: 6,
        prompt: [N('Dusty’s pattern goes in, pull, out, in, pull, out… What is the 10th word?')],
        options: [
          opt(
            'in',
            [
              N(
                'Yes. Every third word is “out”: the 3rd, 6th and 9th. So the 10th starts again: in.',
              ),
            ],
            true,
          ),
          opt('pull', [N('Close. “Out” falls on 3, 6 and 9, so 10 starts a new round: in.')]),
          opt('out', [N('“Out” is the 9th. The 10th starts the pattern again: in.')]),
        ],
        parentNote: 'Used the rule of a repeating three-part pattern to predict the 10th term.',
      },
    ],
  ),
  // ------------------------------------------------ step 10 done, if s5Done
  scene(
    's29-supper-walk',
    [
      ...SUPPER_START,
      DU('Fossil’s. You know. You carried her. The cliff, and the tree, and the water.', 'soft'),
      DU(
        'That was her last good day. I think about it a lot. That one, not the day she died.',
        'soft',
      ),
      DU('I couldn’t come in with that basket there. And I couldn’t move it either.'),
      ...SUPPER_END,
    ],
    [
      {
        domain: 'sel',
        skill: 'choosing which memories to hold',
        standard: 'CASEL: Self-awareness',
        kind: 'ask',
        after: 4,
        prompt: [
          N(
            'Dusty chooses to think about Fossil’s last good day, not the day she died. How might that help?',
          ),
        ],
        options: [
          opt(
            'Happy memories can comfort us when we miss someone.',
            [N('Yes. The sad day still happened. But the good day is there to hold on to.')],
            true,
          ),
          opt('It means Dusty has forgotten the sad day.', [
            N('Dusty hasn’t forgotten. They’re choosing which memory to keep close.'),
          ]),
        ],
        parentNote: 'Talked about how holding on to happy memories can comfort us in grief.',
      },
      { ...RHYME, after: 12 },
    ],
  ),
  // ------------------------------------------------ step 12 done, s29-gift = ribbon
  scene(
    's29-night-ribbon',
    [
      N('Near the weir, something red is streaming out of the reeds, rippling in the current.'),
      N(
        'It’s the ribbon, caught fast on a reed stem and pulled long and thin by the moving water.',
      ),
      MA('He came this way. Up past the weir. Little idiot. Brave little idiot.', 'shock'),
      N(
        'You work it free and put it in your pocket. Then you row on, towards the roar of the weir.',
      ),
      ...NIGHT_END,
    ],
    [
      {
        domain: 'science',
        skill: 'a current pushes things with it',
        standard: '3-PS2-1',
        kind: 'ask',
        after: 1,
        prompt: [N('The ribbon is caught on the reed. Which way does its loose end point?')],
        options: [
          opt(
            'Downstream, the way the water flows.',
            [
              N(
                'Yes. The current pushes the ribbon along with it, so the free end trails downstream.',
              ),
            ],
            true,
          ),
          opt('Upstream.', [
            N(
              'The water is flowing down, so it pushes the ribbon down too. The loose end trails downstream.',
            ),
          ]),
          opt('Straight up in the air.', [
            N('Ribbons don’t stand up on their own! The current pulls the free end downstream.'),
          ]),
        ],
        parentNote: 'Reasoned that a river current pushes objects downstream.',
      },
    ],
  ),
  // ------------------------------------------------ step 12 done, s29-gift = bell
  scene(
    's29-night-bell',
    [
      N('Far off, over the water, a tiny bell rings once.'),
      MA('Stop. Listen.', 'shock'),
      N(
        'Nothing. Then again, from upstream, from beyond the weir: one small brass ring, and quiet after.',
      ),
      MA('That’s him. That’s his bell. He’s alive, and he’s up there.', 'soft'),
      ...NIGHT_END,
    ],
    [
      {
        domain: 'science',
        skill: 'vibrations make sound',
        standard: '1-PS4-1',
        kind: 'notice',
        after: 2,
        lines: [
          MA(
            'A bell rings because the metal shivers, very fast, when something knocks it. That shiver is a vibration.',
          ),
          MA(
            'It shakes the air, and the air carries it to us. Having two ears is how we tell which way it came from.',
          ),
        ],
        parentNote:
          'Learned that sound is made by vibrations and carried through the air to our ears.',
      },
    ],
  ),
  // ------------------------------------------------ step 13 done, s29-gift = ribbon
  scene(
    's29-ford-ribbon',
    [
      ...FORD_START,
      N(
        'Before they go, Portly comes back up the bank. You hold out the red ribbon, muddy now, from your pocket.',
      ),
      N(
        'He sniffs it, and noses it back into your hand. Then he puts a wet pebble on your palm beside it, and goes.',
      ),
      ...FORD_END,
    ],
    [
      TEARS,
      {
        domain: 'science',
        skill: 'litter in rivers harms wildlife',
        standard: 'K-ESS3-3',
        kind: 'notice',
        after: 7,
        lines: [
          MA(
            'Good. You keep that. Ribbon and fishing line in a river can wrap round a bird’s leg or an otter’s neck.',
          ),
          MA('Whatever we bring to the river, we take home again.'),
        ],
        parentNote: 'Learned how litter like string and fishing line can harm river animals.',
      },
    ],
  ),
  // ------------------------------------------------ step 13 done, s29-gift = bell
  scene(
    's29-ford-bell',
    [
      ...FORD_START,
      N(
        'Before they go, Portly comes back up the bank and shakes himself, and the bell rings. He shrugs it off over his head with one paw.',
      ),
      N(
        'He leaves it on your boot with a wet pebble beside it. Then he goes after the old otter, quiet for the first time all summer.',
      ),
      ...FORD_END,
    ],
    [
      TEARS,
      {
        domain: 'sel',
        skill: 'fairness to animals: nothing that traps or hurts',
        standard: 'CASEL: Responsible decision-making',
        kind: 'ask',
        after: 7,
        prompt: [N('Marina made the bell’s loop loose enough to slip off. Why does that matter?')],
        options: [
          opt(
            'So it can never catch on something and hurt him.',
            [
              N(
                'Yes. A gift for a wild animal must never trap it. Portly could take it off whenever he liked.',
              ),
            ],
            true,
          ),
          opt('So it rings louder.', [
            N('It rang well enough! The loose loop meant it could never snag and hurt him.'),
          ]),
        ],
        parentNote:
          'Thought about being fair and safe with wild animals: never giving them anything that could trap them.',
      },
    ],
  ),
  // ------------------------------------------------ complete, s29-wayfarer = sat
  scene(
    's29-complete-sat',
    [
      ...COMPLETE_START,
      N(
        'Marina says nothing; she hasn’t said much since the night of the bag. She leans on you a little, and stays leaning.',
      ),
      N(
        'Dusty leans on Marina’s other side. The three of you stand like that until the wind gets into your collars.',
      ),
      ...COMPLETE_END,
    ],
    [
      {
        domain: 'sel',
        skill: 'being there: quiet company',
        standard: 'CASEL: Relationship skills',
        kind: 'notice',
        after: 3,
        lines: [
          N('Sometimes the kindest thing isn’t to fix or argue, but simply to be there.'),
          N(
            'Sitting with Marina let her come back to herself, in her own time. Nobody had to win.',
          ),
        ],
        parentNote: 'Reflected on how quiet company can help a friend more than arguing.',
      },
    ],
  ),
  // ------------------------------------------------ complete, s29-wayfarer = pencil
  scene(
    's29-complete-pencil',
    [
      ...COMPLETE_START,
      N(
        'On the boathouse wall, pinned up with four tacks, is a pencil drawing on brown paper: every tide pool, from the top to the sea.',
      ),
      N(
        'In the bottom corner, very small, there is a boat with three people in it and a Nubbin in the bow.',
      ),
      MA('I’m doing the river next. All of it, source to sea. It’ll take me years.', 'happy'),
      ...COMPLETE_END,
    ],
    [
      {
        domain: 'art',
        skill: 'drawing a map of a river with a key',
        standard: '2-ESS2-2',
        kind: 'do',
        after: 4,
        check: 'edu:draw:map:river',
        lines: [
          N(
            'Draw your own map of the river, source to sea. Mark the backwater, the ford, the weir and the island.',
          ),
          MA('Don’t forget a key. And put yourself in it somewhere.', 'happy'),
        ],
        parentNote: 'Drew a river map from source to sea, with labelled features and a key.',
      },
    ],
  ),
  // ------------------------------------------------ ambient: Granny Brock's door by day
  scene(
    's29-brock-knock',
    [
      N(
        'You knock on the little green door. A long way back in the bank, somebody grumbles, and bolts go back: one, two, three, four.',
      ),
      GB('Daytime. Good. You can come in for ten minutes and get warm. Then I’m busy.', 'think'),
      N('Ten minutes turns into an hour by the red fire.'),
      N('She doesn’t say much, and neither do you, and it suits you both.'),
      GB('Charcoal’s cooling in the yard. Don’t touch it. It looks cold, and it isn’t.'),
      N('When you leave, she says nothing at all, which from Granny Brock is practically a hug.'),
    ],
    [
      {
        domain: 'maths',
        skill: 'time intervals: minutes in an hour',
        standard: '3.MD.A.1',
        kind: 'ask',
        after: 2,
        prompt: [N('Ten minutes turned into an hour. How many lots of ten minutes is that?')],
        options: [
          opt('6', [N('Yes. An hour is 60 minutes, and 60 is six tens.')], true),
          opt('10', [N('Ten lots of ten would be 100 minutes. An hour is 60: six tens.')]),
          opt('4', [N('Four tens is 40 minutes. An hour is 60, so six tens.')]),
        ],
        parentNote: 'Worked out that an hour is six lots of ten minutes.',
      },
    ],
  ),
];

// ================================================================== glossary
const GLOSSARY: GlossaryEntry[] = [
  gloss('burrow', 'A hole or tunnel an animal digs in the ground to live in.', 's29-digging'),
  gloss('bow', 'The front end of a boat.', 's29-launch'),
  gloss('stern', 'The back end of a boat.', 's29-launch'),
  gloss('buoyancy', 'The upward push of water that makes things float.', 's29-boats'),
  gloss('figurehead', 'A carved figure on the front of an old sailing ship.', 's29-boats'),
  gloss('backwater', 'A quiet side-arm of a river where the water hardly moves.', 's29-picnic'),
  gloss('kit', 'A young otter; also called a cub or a pup.', 's29-picnic'),
  gloss(
    'catch a crab',
    'In rowing, when an oar slips or sticks in the water and throws the rower off balance.',
    's29-oars',
  ),
  gloss(
    'adopted',
    'Took someone in as their own; here, Portly has decided you are his.',
    's29-lessons',
  ),
  gloss('water vapour', 'Water as an invisible gas mixed into the air.', 's29-wildwood'),
  gloss('guttering', 'Of a flame: flickering low, about to go out.', 's29-beech'),
  gloss(
    'archaeologist',
    'Someone who learns about the past by studying old objects and places.',
    's29-door',
  ),
  gloss('charcoal', 'Black fuel made by heating wood slowly with very little air.', 's29-kitchen'),
  gloss('culvert', 'A tunnel that carries water under a road, a field or a town.', 's29-culvert'),
  gloss(
    'weir',
    'A low wall across a river that holds water back and lets it spill over the top.',
    's29-weir',
  ),
  gloss('source', 'The place where a river begins.', 's29-weir'),
  gloss('homesick', 'Sad because you miss your home, or the people in it.', 's29-turnback'),
  gloss('simile', 'A comparison using “like” or “as”, such as “snug as an egg”.', 's29-cliffhouse'),
  gloss('kindling', 'Small, dry sticks for starting a fire.', 's29-cliffhouse'),
  gloss('migrate', 'To travel a long way to another place when the seasons change.', 's29-missing'),
  gloss('ford', 'A shallow place where you can cross a river on foot.', 's29-ford-watch'),
  gloss('mouth', 'Where a river ends and flows into the sea.', 's29-seafarer'),
  gloss('wayfarer', 'Someone who travels, usually on foot.', 's29-seafarer'),
  gloss(
    'friction',
    'The force that slows things down when they rub against each other.',
    's29-laidup',
  ),
];

// ================================================================== the quest
const S29: EduQuest = {
  id: 'reader:s29',
  of: 's29',
  band: 'reader',
  title: 'The Gates of Dawn',
  goals: {
    's29-step1': {
      goal: 'Help Marina carry her mended boat down to the water.',
      hint: 'The boat is upside down on the bank below the Grove. Take one end; Marina takes the other.',
    },
    's29-step2': {
      goal: 'Go down the stream with Marina to the backwater, and have the picnic.',
      hint: 'Vest on, and sit still in the middle while Marina rows. Leaning over to look at fish doesn’t count as still.',
    },
    's29-step3': {
      goal: 'Fish the picnic out of the river and get everyone back to the bank.',
      hint: 'Your Nubbins can swim; let them. Grab what floats: the basket, the rug, the oars.',
    },
    's29-step4': {
      goal: 'Take Marina’s rowing lesson, then find something to give Portly.',
      hint: 'Pull with your back, not your arms, and look where you’ve been. Portly will be close by.',
    },
    's29-step5': {
      goal: 'Go into the Wild Wood with Marina and find Dusty.',
      hint: 'Keep to the path and keep talking. If you lose the path, stand still and listen for Dusty.',
    },
    's29-step6': {
      goal: 'Find shelter in the Wild Wood before the lantern goes out.',
      hint: 'Look for anything people made: a step, a scraper, a door. Old stones mean old houses.',
    },
    's29-step7': {
      goal: 'Follow Granny Brock out of the Wood the back way.',
      hint: 'Keep one hand on the wall and your head down. The old culvert comes out by the fields.',
    },
    's29-step8': {
      goal: 'Row up the river to the weir pool with Marina and Dusty.',
      hint: 'Take an oar each. Where it’s too shallow to row, everyone gets out and carries.',
    },
    's29-step9': {
      goal: 'Catch Marina up on the river path and tell her what’s wrong.',
      hint: 'She’s gone on ahead towards the boathouse. She walks fast when she’s hungry. Run.',
    },
    's29-step10': {
      goal: 'Fetch dry kindling for Dusty’s stove.',
      hint: 'The woodpile is round the side of the cliff house. The top layer is wet; dig down.',
    },
    's29-step11': {
      goal: 'Go down to the ford at dusk and see the old otter.',
      hint: 'The ford is below the backwater, where the stepping stones cross. Go quietly, and not too close.',
    },
    's29-step12': {
      goal: 'Row up the river in the dark and look for Portly.',
      hint: 'Row slowly and keep the lantern low. Watch the banks, the reeds and the mud, and listen.',
    },
    's29-step13': {
      goal: 'Row Portly home to the ford.',
      hint: 'Downstream all the way. Let the current do the work, and keep him warm.',
    },
    's29-step14': {
      goal: 'Get to Marina’s boathouse before she goes.',
      hint: 'The boathouse is past the tide pools, where the river meets the sea. Go with Dusty.',
    },
    's29-step15': {
      goal: 'Haul Marina’s boat up the bank for the winter, under the willows.',
      hint: 'Logs under the keel for rollers, and all three of you. She goes upside down, so the rain runs off.',
    },
  },
  scenes: SCENES,
  glossary: GLOSSARY,
  notes:
    'Reader band: every choice kept. Think questions in s29-lessons-done, s29-turnback, s29-island and s29-packing. ' +
    'The night-ribbon scene has the ribbon trail downstream with the current (the main scene says it points upstream). ' +
    'The Lantern Song is sung from its third line only.',
};

export const EDU_S29_READER: EduQuest[] = [S29];

export const EDU_S29_READER_VARIANTS: EduScene[] = VARIANTS;

/** Every `edu:` check string this file uses. */
export const CHECKS: string[] = ['edu:label:river-map:5', 'edu:draw:map:river'];
