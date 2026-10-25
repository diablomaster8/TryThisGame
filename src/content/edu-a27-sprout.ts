/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Atlas page A27, The
 * White-Haired Prince (Zal and the Simurgh, Ferdowsi’s Shahnameh, Iran).
 *
 * Source: atlas-a27.ts (ATLAS_A27 and ATLAS_A27_VARIANTS). One EduScene per original scene, id
 * `sprout:<original id>`, with the same choice ids and `set` flags (`a27-word` in a27-05-words,
 * `a27-feather` in a27-08-feather). Every step scene, done scene, complete scene and variant has
 * a version, and each has exactly one lesson. Domains never repeat back to back, across scenes, quests and
 * variant paths, and each variant has the same domain as the scene it replaces (the margin note
 * and the Corvin line are feelings lessons, which differ from the scenes beside them).
 *
 * What it teaches (outline: where Iran is; the Shahnameh loved in Iran, Afghanistan and
 * Tajikistan; Ferdowsi’s thirty years; the Simurgh in Persian painting; albinism; writing a letter
 * to say something hard): that Iran is a country; hello and friend in Persian; mountains, clouds,
 * seasons, the moon and the sun; birds, feathers and parents who feed and keep their young safe;
 * counting to 12, halves, shapes and patterns; first sounds, rhymes and clapping syllables;
 * fairness, sharing and welcoming guests; calming breaths, sorry, promises, asking for help.
 *
 * Left out or softened for this age (EDU-STYLE.md, “Hard things”):
 * - No lines from Zimmern or Ferdowsi: every lifted line is replaced with plain words of our own.
 * - Albinism is said plainly and kindly (“some babies are born with very pale hair; it is just
 *   how they are made”). Sam’s shame is clearly called wrong, and Zal is shown as kind and capable.
 * - The baby left on the mountain: Sam does a wrong thing, a servant is sad, and the narrator says
 *   at once that help is on its way. The Simurgh’s chicks are curious, never hungry for him.
 * - Zal’s arrow lands among the roses (no bird is hurt). Mehrab’s frightened threat and the
 *   Shah’s order to burn Kabul are cut: the Shah is cross, and the queen says she will talk to Sam.
 * - Rudaba’s hair is held gently and let go; the rope is Zal’s own kind answer. The night is
 *   spent talking, and the sprout lines say only that they promise to stay together.
 * - Rostam’s birth is a long day for a very tired Rudaba, then a loud cry and a safe baby.
 * - The riddle of the sickle is about time going on for everyone, with comfort straight after: be
 *   kind while we can. Fire is only for grown-ups, and a lesson says so.
 * - All three choices of the feather (told, sat, night) are kind, so no `defaultChoice` is needed.
 *
 * Facts used: Iran is a country; the Alborz are real mountains in northern Iran; Sistan lies in
 * Iran and Afghanistan today; Kabul is in Afghanistan, where a form of Persian is spoken; clouds
 * are made of tiny drops of water; feathers trap warm air; camels have humps that store fat;
 * grown-ups’ hair often turns white; parents feed their young; a wild rose has five petals; the
 * four seasons; the moon shines at night; Persian words: doost (friend), salaam (hello), mehman
 * (guest); Persian kings had a Royal Road with relay riders; weddings today have a decorated cloth.
 */
import type { EduDomain, EduQuest, EduScene, Lesson } from './types';
import type { Line, Choice } from '../config/story';

type Mood = NonNullable<Line['mood']>;

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

// ---------------------------------------------------------------- speakers
const N = say('narrator');
const Y = say('you');
const NU = say('a27-nurse');
const SA = say('a27-sam');
const SV = say('a27-servant');
const SI = say('a27-simurgh');
const YO = say('a27-youth');
const ZA = say('a27-zal');
const RI = say('a27-rider');
const MO = say('a27-mobed');
const ME = say('a27-merchant');
const SH = say('a27-shah');
const MH = say('a27-mehrab');
const SK = say('a27-sindokht');
const RU = say('a27-rudaba');
const PG = say('a27-page');
const MD = say('a27-maid');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const words = (t: string) => t.trim().split(/\s+/).length;
const parts = (t: string) => t.split(/(?<=[.!?”)])\s+(?=[A-Z“(‘])/);

/**
 * Keeps every line to 14 words or fewer, as the sprout band requires: a long line is cut at
 * sentence ends into several lines by the same speaker (the mood stays on the first). `map[i]`
 * is the index of the last piece of original line i, so a lesson’s `after` can follow.
 */
const split = (lines: Line[]): { lines: Line[]; map: number[] } => {
  const out: Line[] = [];
  const map: number[] = [];
  for (const l of lines) {
    const chunks: string[] = [];
    const counts: number[] = [];
    for (const sentence of parts(l.text)) {
      const last = chunks[chunks.length - 1];
      const n = counts[counts.length - 1] ?? 0;
      if (last !== undefined && n < 2 && words(last) + words(sentence) <= 14) {
        chunks[chunks.length - 1] = `${last} ${sentence}`;
        counts[counts.length - 1] = n + 1;
      } else {
        chunks.push(sentence);
        counts.push(1);
      }
    }
    chunks.forEach((text, i) =>
      out.push(i === 0 && l.mood ? { who: l.who, text, mood: l.mood } : { who: l.who, text }),
    );
    map.push(out.length - 1);
  }
  return { lines: out, map };
};
const sp = (lines: Line[]): Line[] => split(lines).lines;

/** One answer option. `best` marks the answer the lesson teaches. */
const o = (label: string, reply: Line[], best = false): Opt =>
  best ? { label, best, reply: sp(reply) } : { label, reply: sp(reply) };

const std = (standard?: string) => (standard ? { standard } : {});

/** An ask lesson. */
const ask = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | undefined,
  prompt: Line[],
  options: Opt[],
  parentNote: string,
): Beat => ({
  domain,
  skill,
  ...std(standard),
  kind: 'ask',
  after,
  prompt: sp(prompt),
  options,
  parentNote,
});

/** A notice lesson: a character shares something true in their own voice. */
const notice = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | undefined,
  lines: Line[],
  parentNote: string,
): Beat => ({
  domain,
  skill,
  ...std(standard),
  kind: 'notice',
  after,
  lines: sp(lines),
  parentNote,
});

/** A do lesson: the child does something in the Grove. */
const doit = (
  after: number,
  domain: EduDomain,
  skill: string,
  standard: string | undefined,
  check: string,
  lines: Line[],
  parentNote: string,
): Beat => ({
  domain,
  skill,
  ...std(standard),
  kind: 'do',
  after,
  check,
  lines: sp(lines),
  parentNote,
});

/** A choice, kept under its original id. */
const ch = (
  id: string,
  label: string,
  then: Line[],
  set?: Record<string, number | boolean | string>,
): Choice => ({ id, label, ...(set ? { set } : {}), then: sp(then) });

/** One sprout scene. Lesson ids are `sprout:<of>-l<n>`, numbered in play order. */
const sc = (of: string, lines: Line[], beats: Beat[], choices?: Choice[]): EduScene => {
  const cut = split(lines);
  return {
    id: `sprout:${of}`,
    of,
    band: 'sprout',
    lines: cut.lines,
    ...(choices ? { choices } : {}),
    lessons: [...beats]
      .sort((a, b) => a.after - b.after)
      .map((b, i) => ({ id: `sprout:${of}-l${i + 1}`, ...b, after: cut.map[b.after] ?? b.after })),
  };
};

const quest = (
  of: string,
  title: string,
  goals: EduQuest['goals'],
  scenes: EduScene[],
  notes?: string,
): EduQuest => ({
  id: `sprout:${of}`,
  of,
  band: 'sprout',
  title,
  goals,
  scenes,
  ...(notes ? { notes } : {}),
});

// ================================================================== A27-1 A Son for Sam
const A1: EduQuest = quest(
  'a27-01',
  'A Son for Sam',
  {
    'a27-01-s1': {
      goal: 'Step into the mountain page and find the house in Sistan.',
      hint: 'Touch the green city at the bottom of the page.',
    },
    'a27-01-s2': {
      goal: 'Go to the back rooms and meet the baby.',
      hint: 'Follow the nurse down the passage with the lamps.',
    },
    'a27-01-s3': {
      goal: 'Go with the nurse to tell Sam.',
      hint: 'Walk behind her. Stay by the door.',
    },
  },
  [
    sc(
      'a27-01-page',
      [
        N('Nova’s atlas opens. A mountain! A big nest! A green city far below.'),
        N('A card says this story comes from a very old book.'),
        N('The book is the Shahnameh. That means Book of Kings.'),
        N('A poet named Ferdowsi wrote it, long, long ago.'),
        N('People still love it. They read it out loud together.'),
        N('You step in. Dust, a gate, and a house full of lamps.'),
        NU('Come in, traveller! There is room for everyone here.', 'happy'),
        N('Your Nubbin sniffs the air. It smells bread.'),
      ],
      [
        ask(
          4,
          'social-studies',
          'Iran is a country on the map',
          'D2.Geo.2.K-2',
          [N('This story comes from Iran. (Point to the green city.) What is Iran?')],
          [
            o(
              'A country.',
              [N('Yes! Iran is a country, with mountains, cities and gardens.')],
              true,
            ),
            o('A snack.', [N('Not a snack! Iran is a country, with mountains and gardens.')]),
          ],
          'Learned that Iran is a country, and that the Shahnameh is a book people there love.',
        ),
      ],
      [
        ch('thank', 'Thank her, and wipe your feet.', [
          NU('Good manners! Put your shoes by the door.', 'soft'),
        ]),
        ch('baby', 'Ask about the baby.', [
          NU('A boy! He is perfect. We are all very…', 'think'),
          N('She stops. Then she smiles. “Come and see him.”'),
        ]),
        ch('bread', 'Let your Nubbin follow its nose.', [
          N('It finds the kitchen. The cook gives it a crust.'),
        ]),
      ],
    ),
    sc(
      'a27-01-page-done',
      [
        NU('Stay as long as you like. The master will thank every guest.'),
        N('She whispers the last part to herself: “When he knows.”'),
      ],
      [
        ask(
          1,
          'literacy',
          'first sounds: w for whisper',
          'RF.K.2',
          [
            N(
              'She whispers. Whisper begins with w, w, w. Which starts like whisper: water or sun?',
            ),
          ],
          [
            o('Water.', [N('Yes! Whisper, water: w, w, w!')], true),
            o('Sun.', [N('Sun begins with s. Whisper and water both begin with w!')]),
          ],
          'Practised hearing the first sound w in whisper and water.',
        ),
      ],
    ),
    sc(
      'a27-01-birth',
      [
        N('In the warm back rooms, a baby sleeps in a cradle.'),
        N('His fists are up by his ears. His hair is white, like frost on a branch.'),
        NU('He is eight days old. His father has not met him yet.', 'sad'),
        NU('Nobody dares to tell him about the hair. I think it is lovely.'),
        N('Your Nubbin climbs up and looks in. The baby looks back.'),
      ],
      [
        notice(
          1,
          'science',
          'some people are born with very pale hair; it is how they are made',
          'ELOF: Scientific Reasoning',
          [
            NU('Some babies are born with very pale hair. Their bodies make less colour.'),
            NU('It is just how they are made. It is not bad at all.'),
          ],
          'Heard, plainly and kindly, that some people are born with very pale hair and skin, and that it is just how they are.',
        ),
      ],
      [
        ch('beautiful', '“He is beautiful.”', [NU('He is. Every bit of him.', 'soft')]),
        ch('hair', '“It is only hair.”', [
          NU('That is what I keep saying. To the wall, mostly.', 'think'),
        ]),
        ch('tell', '“Someone should tell his father.”', [
          NU('Someone should. It looks as if it will be me.', 'think'),
        ]),
      ],
    ),
    sc(
      'a27-01-birth-done',
      [
        N('Your Nubbin touches the white hair with one paw.'),
        N('The baby grabs the paw and holds on tight.'),
      ],
      [
        doit(
          1,
          'maths',
          'count the five fingers of a hand',
          'K.CC.B.4',
          'edu:count:fingers:5',
          [N('The baby holds on with one hand. (Count his fingers: 1, 2, 3, 4, 5.)')],
          'Counted five fingers, matching one number to each finger.',
        ),
      ],
    ),
    sc(
      'a27-01-hall',
      [
        N('Sam sits in his big hall, with a sword on his knees.'),
        NU('Good news, my lord. You have a son. He is strong and well.'),
        NU('His hair is white. Remember, a baby is a gift.'),
        SA('White?', 'shock'),
        N('The sword slides to the floor. Sam stands up.'),
        SA('Show me.'),
      ],
      [
        ask(
          4,
          'sel',
          'a big feeling can be calmed with a slow breath',
          'CASEL: Self-management',
          [N('Sam has a big feeling. What can help when a feeling is big?')],
          [
            o('A slow breath.', [N('Yes! A slow breath helps us think. In, and out.')], true),
            o('Stamp and shout.', [
              N('Stamping can feel good. A slow breath helps us think, too.'),
            ]),
          ],
          'Named a calming strategy for a big feeling: a slow breath.',
        ),
      ],
    ),
    sc(
      'a27-01-hall-done',
      [
        N('Sam walks fast down the passage.'),
        N('The nurse looks at you. She says nothing at all.'),
      ],
      [
        doit(
          1,
          'literacy',
          'clap the syllables in baby',
          'RF.K.2',
          'edu:clap:syllables:baby',
          [N('Clap the word baby. Ba-by. Two claps!')],
          'Clapped the two syllables in baby.',
        ),
      ],
    ),
    sc(
      'a27-01-complete',
      [
        N('Sam stands by the cradle for a long time.'),
        N('The baby looks up at him with dark, steady eyes.'),
        N('Sam does not pick him up. That is the first wrong thing.', 'sad'),
        SA('Leave me, all of you. I need to think.'),
        N('The nurse holds your Nubbin’s paw, to be kind.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'fairness: everyone deserves love whatever they look like',
          'D2.Civ.8.K-2',
          [N('A baby needs love, whatever his hair is like. Is it fair to love him less?')],
          [
            o('No. Not fair.', [N('Right. Hair is only hair. Everyone deserves love.')], true),
            o('Yes.', [N('No. Everyone deserves love. Hair is only hair.')]),
          ],
          'Talked about fairness: nobody should be loved less for how they look.',
        ),
      ],
    ),
  ],
);

// ================================================================== A27-2 Shame
const A2: EduQuest = quest(
  'a27-02',
  'Shame',
  {
    'a27-02-s1': {
      goal: 'Be in the hall when Sam gives his order.',
      hint: 'Everyone gathers in the hall at first light.',
    },
    'a27-02-s2': {
      goal: 'Follow the servants up the mountain path.',
      hint: 'Stay close behind the old servant.',
    },
    'a27-02-s3': {
      goal: 'Stay with the baby by the high rocks.',
      hint: 'Sit with him by the big stone.',
    },
  },
  [
    sc(
      'a27-02-order',
      [
        N('In the morning, everyone gathers in the hall. Sam did not sleep.'),
        SA('I am afraid people will laugh at my son.', 'sad'),
        N('That is a wrong thing to fear. A baby is only a baby.'),
        SA('Take the baby away to the mountain.', 'angry'),
        NU('My lord, he is a gift.', 'sad'),
        SA('Go.'),
        N('Do not worry. Help is on its way.', 'soft'),
      ],
      [
        ask(
          4,
          'sel',
          'speaking up kindly when something is not fair',
          'CASEL: Responsible decision-making',
          [N('Sam is making a wrong choice. What could someone say to him?')],
          [
            o(
              'Please be kind to your baby.',
              [N('Yes. Kind words can help someone think again.')],
              true,
            ),
            o('Nothing at all.', [
              N('Sometimes it is hard to speak. Standing close helps. Kind words can help, too.'),
            ]),
          ],
          'Practised thinking of kind words to say when something is not fair.',
        ),
      ],
      [
        ch('speak', 'Speak up for the baby.', [
          Y('Please. He is your son. He has done nothing wrong.'),
          SA('A guest does not tell me about my son.', 'angry'),
          N('Your hands shake. But you said it, and the nurse heard.'),
        ]),
        ch('look', 'Look Sam in the eye, and say nothing.', [
          N('He looks back. Then he looks at the floor.'),
        ]),
        ch('nurse', 'Go and stand with the nurse.', [
          N('She leans on your shoulder, just a little.'),
        ]),
      ],
    ),
    sc(
      'a27-02-order-done',
      [
        N('Sam goes out. The hall is very quiet.'),
        NU('Go with them. Please. Somebody kind should be there.', 'sad'),
      ],
      [
        ask(
          1,
          'literacy',
          'first sounds: sh for shh and ship',
          'RF.K.2',
          [N('Shh! Shh begins with sh, sh, sh. Which starts like shh: ship or sun?')],
          [
            o('Ship.', [N('Yes! Shh, ship: sh, sh, sh!')], true),
            o('Sun.', [N('Sun begins with s. Shh and ship both begin with sh!')]),
          ],
          'Practised hearing the first sound sh.',
        ),
      ],
    ),
    sc(
      'a27-02-path',
      [
        N('Two servants carry the baby in a basket. You follow.'),
        N('The road becomes a path. The path goes up, up, up.'),
        N('The wind blows. Rain falls: pitter, patter!'),
        N('Your Nubbin holds the basket up from below.'),
      ],
      [
        ask(
          2,
          'science',
          'rain falls from clouds, which are made of tiny drops of water',
          'K-ESS2-1',
          [N('Rain falls from clouds. What are clouds made of: tiny drops of water, or sand?')],
          [
            o('Tiny drops of water.', [N('Yes! Lots of tiny drops, floating high up.')], true),
            o('Sand.', [N('Not sand. Clouds are tiny drops of water, floating high up.')]),
          ],
          'Learned that clouds are made of tiny drops of water, and rain falls from them.',
        ),
      ],
    ),
    sc(
      'a27-02-path-done',
      [N('The storm is all around. You cannot see the city now.')],
      [
        ask(
          0,
          'maths',
          'count the three kinds of ground: road, path, stones',
          'K.CC.B.5',
          [N('First the road. Then the path. Then the stones. How many kinds of ground?')],
          [
            o('Three.', [N('Yes! Road, path, stones. Three!')], true),
            o('One.', [N('Count again: road, path, stones. That makes three!')]),
          ],
          'Counted three kinds of ground on the journey.',
        ),
      ],
    ),
    sc(
      'a27-02-rocks',
      [
        N('At the big rocks, the servants put the basket down.'),
        N('The old servant is sad. He does not want to leave.'),
        N('He goes. You stay.'),
        N('You and your Nubbin keep the baby warm.'),
      ],
      [
        ask(
          0,
          'social-studies',
          'the Alborz are real mountains in Iran',
          'D2.Geo.2.K-2',
          [
            N(
              'These are the Alborz, real mountains in Iran. Are mountains very high, or very low?',
            ),
          ],
          [
            o('Very high.', [N('Yes! Mountains are very high.')], true),
            o('Very low.', [N('Mountains are very high. Look how far up the path goes!')]),
          ],
          'Learned that the Alborz are real mountains in Iran.',
        ),
      ],
      [
        ch('coat', 'Wrap him in your coat.', [
          N('He stops crying. He is cross about the coat instead.'),
        ]),
        ch('hum', 'Hum to him.', [N('You hum. The wind is loud, but he hears. He goes quiet.')]),
        ch('hold', 'Hold him, with your back to the wind.', [
          N('He fits against your chest. He is warm.'),
        ]),
      ],
    ),
    sc(
      'a27-02-rocks-done',
      [
        N('Above you, something very big flies over.'),
        N('For a moment the rain stops, as if a roof had been put up.'),
      ],
      [
        doit(
          1,
          'literacy',
          'sound words: whoosh',
          'RL.1.4',
          'edu:say:sound-word:whoosh',
          [N('Big wings go whoosh! Say it with me: whoosh!')],
          'Said the sound word whoosh and linked it to what wings sound like.',
        ),
      ],
    ),
    sc(
      'a27-02-complete',
      [
        N('The shadow comes again. The wind bends the grass.'),
        N('You hold the baby. Your Nubbin holds you.'),
        N('You are a little scared. That is okay.'),
        N('Then the cloud opens. Something comes down!', 'shock'),
      ],
      [
        ask(
          2,
          'sel',
          'holding a friend helps with a scared feeling',
          'CASEL: Self-management',
          [N('You feel scared. What helps a scared feeling?')],
          [
            o('Hold a friend.', [N('Yes. Being close to someone helps. You are not alone.')], true),
            o('Hide alone.', [N('Hiding alone can feel lonely. Holding a friend helps.')]),
          ],
          'Named a way to feel better when scared: staying close to someone.',
        ),
      ],
    ),
  ],
);

// ================================================================== A27-3 The Simurgh
const A3: EduQuest = quest(
  'a27-03',
  'The Simurgh',
  {
    'a27-03-s1': {
      goal: 'Hold on to the baby when the great bird comes down.',
      hint: 'Do not let go of the basket.',
    },
    'a27-03-s2': {
      goal: 'Arrive at the nest on the peak.',
      hint: 'There is nothing to do but be carried.',
    },
  },
  [
    sc(
      'a27-03-descent',
      [
        N('A bird comes out of the cloud. She is bigger than a house!'),
        N('Her feathers shine like a sunset. Her eye is gold.'),
        N('She lands on the rock. The rock creaks.'),
        N('She lifts the baby gently.'),
        N('Then she lifts you too, and your Nubbin.'),
      ],
      [
        ask(
          1,
          'science',
          'wings help birds fly',
          'ELOF: Scientific Reasoning',
          [N('The Simurgh has wings, a beak and claws. What do wings help a bird do?')],
          [
            o('Fly.', [N('Yes! Wings help most birds fly.')], true),
            o('Dig.', [N('Not dig! Wings help most birds fly. Claws can grip.')]),
          ],
          'Learned that wings help birds fly.',
        ),
      ],
      [
        ch('shout', 'Shout.', [N('Whoosh! The wind takes your shout away.')]),
        ch('hold', 'Hold on, with your eyes open.', [
          N('Below, the mountain gets small. The storm is a grey floor.'),
        ]),
      ],
    ),
    sc(
      'a27-03-descent-done',
      [N('Up through the cloud, and out into the sun!'), N('The sky is big and blue and quiet.')],
      [
        doit(
          1,
          'maths',
          'count three clouds',
          'K.CC.B.5',
          'edu:count:clouds:3',
          [N('Look down at the clouds. (Count them with me: 1, 2, 3.)')],
          'Counted three clouds, one number for each.',
        ),
      ],
    ),
    sc(
      'a27-03-nest',
      [
        N('The nest sits on the very top of the mountain.'),
        N('It is made of sweet-smelling wood, and it is as big as a cottage.'),
        N('Four fluffy chicks crowd close. They are curious!'),
        N('Your Nubbin stands in front of the baby, arms wide.'),
        SI('No. Not him. He is your brother.', 'soft'),
      ],
      [
        ask(
          1,
          'art',
          'describing the colours in a painting',
          'ELOF: Approaches to Learning',
          [
            N('Long ago, painters drew the Simurgh with bright colours and a long, swirly tail.'),
            N('Which colour would you choose for her? There is no wrong answer.'),
          ],
          [
            o('Gold.', [N('Gold shines like the sun.')]),
            o('Blue.', [N('Blue is like the sky above the clouds.')]),
            o('Red.', [N('Red glows like a sunset.')]),
          ],
          'Chose a colour for the Simurgh, as painters of old Persian books did.',
        ),
      ],
    ),
    sc(
      'a27-03-nest-done',
      [
        N('The chicks pull their beaks back. The smallest sits down with a plop.'),
        SI('These two are your nestmates too. Make room!'),
      ],
      [
        ask(
          1,
          'sel',
          'making room: sharing space with a newcomer',
          'CASEL: Social awareness',
          [SI('What does it mean to make room for someone?')],
          [
            o(
              'Budge over and share.',
              [SI('Yes! Sharing space makes friends feel welcome.', 'happy')],
              true,
            ),
            o('Keep it all.', [SI('Sharing makes room for friends. Try budging over!')]),
          ],
          'Talked about making room for a newcomer, and welcoming someone by sharing.',
        ),
      ],
    ),
    sc(
      'a27-03-complete',
      [
        N('The chicks shuffle. A warm gap opens in the middle.'),
        N('You, your Nubbin and the baby squeeze in.'),
        N('A big wing comes down like a blanket.'),
        SI('Sleep. The storm cannot reach us here.', 'soft'),
        N('The chick beside you snores. Snore, snore!'),
      ],
      [
        ask(
          3,
          'literacy',
          'rhymes: wing and sing',
          'RF.K.2',
          [N('Wing rhymes with sing. Which word rhymes with wing: sing or sun?')],
          [
            o('Sing.', [N('Yes! Wing, sing, ring, king!')], true),
            o('Sun.', [N('Sun does not rhyme. Wing, sing, ring: they end the same!')]),
          ],
          'Practised rhyming: wing, sing, ring, king.',
        ),
      ],
    ),
  ],
);

// ================================================================== A27-4 The Nest
const A4: EduQuest = quest(
  'a27-04',
  'The Nest',
  {
    'a27-04-s1': {
      goal: 'Help the Simurgh feed everyone in the nest.',
      hint: 'Chicks first, then the baby, then you.',
    },
    'a27-04-s2': {
      goal: 'Keep the baby warm through the cold night.',
      hint: 'Sit with him under the big wing.',
    },
    'a27-04-s3': {
      goal: 'Keep the chicks from sitting on the baby.',
      hint: 'Lift him out of the way.',
    },
  },
  [
    sc(
      'a27-04-feed',
      [
        N('At dawn the Simurgh brings breakfast for everyone.'),
        SI('You have hands. Share it out. Chicks first.'),
        N('Four chicks eat fast. Munch, munch, munch!'),
        N('The baby has soft figs and honey.'),
        SI('Feed the others before yourself. That is the rule.', 'soft'),
        N('One small fig is left.'),
      ],
      [
        doit(
          2,
          'maths',
          'count four chicks',
          'K.CC.B.5',
          'edu:count:chicks:4',
          [N('Four chicks eat. (Count them on your fingers: 1, 2, 3, 4.)')],
          'Counted four chicks, one number for each.',
        ),
      ],
      [
        ch('eat', 'Eat the fig.', [
          N('It is the best fig you ever had. The Simurgh brings you two more.'),
        ]),
        ch('share', 'Split it with your Nubbin.', [
          N('Half each. Nubbin eats its half, and looks at yours.'),
        ]),
        ch('chick', 'Give it to the smallest chick.', [
          N('The smallest chick is always at the back. It swallows the fig, very politely.'),
          SI('You learn quickly.', 'happy'),
        ]),
      ],
    ),
    sc(
      'a27-04-feed-done',
      [N('Your Nubbin is round as an apple. It still wants more!')],
      [
        ask(
          0,
          'social-studies',
          'when there is not enough, share fairly',
          'D2.Eco.1.K-2',
          [N('When there is not enough for everyone, what is a kind way to choose?')],
          [
            o('Share fairly.', [N('Yes! Sharing fairly means everyone gets some.')], true),
            o('Take it all.', [N('Then others go hungry. Sharing fairly is kinder.')]),
          ],
          'Talked about what to do when there is not enough: share fairly.',
        ),
      ],
    ),
    sc(
      'a27-04-night',
      [
        N('The nights on the peak are very cold. The stars are close!'),
        N('The baby sleeps between you and your Nubbin, under the big wing.'),
        SI('His father left him at the foot of my mountain.'),
        SI('This one is mine now, until someone is ready to love him.', 'soft'),
        N('Her heart goes thump, thump, thump.'),
      ],
      [
        ask(
          1,
          'science',
          'feathers trap warm air and keep animals warm',
          'ELOF: Scientific Reasoning',
          [N('The Simurgh’s wing is warm and fluffy. What keeps you warm at night?')],
          [
            o('A blanket.', [N('Yes! A blanket holds warm air close, just like feathers.')], true),
            o('An ice cube.', [N('Brr! A blanket keeps warm air close, just like feathers.')]),
          ],
          'Learned that feathers, like a blanket, keep warm air close to the body.',
        ),
      ],
    ),
    sc(
      'a27-04-night-done',
      [N('In the morning, frost is on top of her wings. Under them, there is none.')],
      [
        ask(
          0,
          'literacy',
          'opposites: cold and warm',
          'RL.1.4',
          [N('Outside her wing is cold. Under her wing is...?')],
          [
            o('Warm.', [N('Yes! Cold outside, warm under the wing.')], true),
            o('Icy.', [N('Under her wing it is warm and snug. The opposite of cold is warm.')]),
          ],
          'Practised opposites: cold and warm.',
        ),
      ],
    ),
    sc(
      'a27-04-sitting',
      [
        N('The chicks love their new brother.'),
        N('They try to sit on him! That is how chicks say I love you.'),
        N('But he is small. Squish!'),
        N('You scoop him up just in time. The chick sits on your Nubbin. Flump!'),
        SI('Ha! They will learn. Keep minding him.', 'happy'),
      ],
      [
        ask(
          3,
          'sel',
          'showing love gently',
          'CASEL: Relationship skills',
          [
            N(
              'The chicks love the baby, but sitting is not gentle. What is a gentle way to show love?',
            ),
          ],
          [
            o('A soft pat.', [N('Yes! A soft pat is gentle and safe.')], true),
            o('A big sit.', [N('A big sit squashes. A soft pat is gentle and safe.')]),
          ],
          'Talked about showing love gently, with soft hands.',
        ),
      ],
    ),
    sc(
      'a27-04-sitting-done',
      [N('Your Nubbin comes out flatter than before. It does not mind.')],
      [
        ask(
          0,
          'maths',
          'compare size: bigger and smaller',
          'K.MD.A.2',
          [N('The chick is huge. Your Nubbin is small. Who is bigger?')],
          [
            o('The chick.', [N('Yes! The chick is much bigger.')], true),
            o('Your Nubbin.', [N('Look again. The chick is much bigger.')]),
          ],
          'Compared two sizes: the chick is bigger and the Nubbin smaller.',
        ),
      ],
    ),
    sc(
      'a27-04-complete',
      [
        N('Weeks pass. Then months. Nobody comes.'),
        SI('His name is for his father to give. Until then, he is my chick.'),
        N('The baby learns to crawl in the big nest.'),
        N('His first word sounds like a bird call!'),
        N('Your Nubbin teaches him to clap.'),
      ],
      [
        ask(
          2,
          'science',
          'parents feed and keep their young safe',
          '1-LS1-2',
          [N('The Simurgh feeds the baby and keeps him warm. What do parents do for their young?')],
          [
            o(
              'Feed them and keep them safe.',
              [N('Yes! Parents feed their young and keep them safe.')],
              true,
            ),
            o('Nothing.', [N('They do a lot! They feed their young and keep them safe.')]),
          ],
          'Learned that parents feed and protect their young, as the Simurgh does.',
        ),
      ],
    ),
  ],
);

// ================================================================== A27-5 The Youth on the Mountain
const A5: EduQuest = quest(
  'a27-05',
  'The Youth on the Mountain',
  {
    'a27-05-s1': {
      goal: 'Teach the young man a new word.',
      hint: 'Sit with him at the nest’s edge and talk.',
    },
    'a27-05-s2': {
      goal: 'Climb down to the pass and meet the caravan.',
      hint: 'The caravan road crosses the mountain, below the cloud.',
    },
  },
  [
    sc(
      'a27-05-words',
      [
        N('Years go by in the atlas. You and your Nubbin stay the same.'),
        N('The little one grows tall and strong. His hair is still white.'),
        N('He has only ever met you and the birds.'),
        YO('There are words I do not know. What is a market?'),
        Y('Lots of people, buying and calling out.'),
        YO('I think I would like a market.', 'happy'),
        YO('Teach me one more word.'),
      ],
      [
        notice(
          5,
          'literacy',
          'a word for friend in Persian: doost',
          'ELOF: Language and Communication',
          [
            N('In Persian, a friend is a doost.'),
            N('Say it together: doost!'),
          ],
          'Heard the Persian word for friend, doost, and said it aloud.',
        ),
      ],
      [
        ch(
          'friend',
          'Teach him “friend”.',
          [
            Y('Friend. Someone who stays.'),
            YO('Friend. Then you are my friend. And the small one too.', 'happy'),
          ],
          { 'a27-word': 'taught-friend' },
        ),
        ch(
          'home',
          'Teach him “home”.',
          [
            Y('Home. The place you come back to.'),
            YO('Then this is home. One day I will go away, and come back.', 'think'),
          ],
          { 'a27-word': 'taught-home' },
        ),
        ch(
          'sorry',
          'Teach him “sorry”.',
          [
            Y('Sorry. What you say when you did a wrong thing, and wish you had not.'),
            YO('Nobody ever said it to me. Is that good?', 'think'),
            N('You do not know what to say, so you stay close.'),
          ],
          { 'a27-word': 'taught-sorry' },
        ),
      ],
    ),
    sc(
      'a27-05-words-done',
      [N('He says the word all afternoon.'), N('Your Nubbin claps every single time.')],
      [
        doit(
          1,
          'maths',
          'count claps to 5',
          'K.CC.A.1',
          'edu:clap:count:5',
          [N('Clap with Nubbin! One, two, three, four, five!')],
          'Counted claps from one to five.',
        ),
      ],
    ),
    sc(
      'a27-05-caravan',
      [
        N('Far below, a road crosses the mountain. Camels go by: ding-a-ling!'),
        N('The Simurgh sets you down above the pass.'),
        ME('Have you seen the young man on the peak, with white hair?'),
        ME('We tell his story in every town. My wife says he must be cold!'),
        N('Your Nubbin stares at the merchant’s bread.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'roads join places together; travellers carry news',
          'D2.Geo.2.K-2',
          [
            N(
              'A road joins one town to the next. (Trace the road with your finger.) What is a road for?',
            ),
          ],
          [
            o('Getting to places.', [N('Yes! Roads take us from place to place.')], true),
            o('Swimming.', [N('Not swimming! Roads take us from place to place.')]),
          ],
          'Learned that roads join places, and that travellers carry news along them.',
        ),
      ],
      [
        ch('prince', '“He is a prince. He does not know it yet.”', [
          ME('A prince! I will tell them in Sistan.', 'happy'),
        ]),
        ch('person', '“He is a person. A kind one.”', [
          ME('A kind person. My wife will be glad.', 'happy'),
        ]),
        ch('nothing', 'Smile, and say nothing.', [ME('A secret! Secrets travel fast.', 'happy')]),
      ],
    ),
    sc(
      'a27-05-caravan-done',
      [
        N('The merchant gives your Nubbin a whole round loaf.'),
        ME('By midsummer, every town will know the story.'),
      ],
      [
        ask(
          1,
          'science',
          'camels have humps that store fat',
          'ELOF: Scientific Reasoning',
          [N('Camels can walk far in the hot sun. What do camels have on their backs?')],
          [
            o('A hump, or two!', [N('Yes! A camel’s hump stores fat for food.')], true),
            o('Wings.', [N('No wings! Camels have a hump, or two.')]),
          ],
          'Learned that camels have a hump, which stores fat, and can walk far.',
        ),
      ],
    ),
    sc(
      'a27-05-complete',
      [
        N('The story goes down the mountain with the caravans.'),
        N('Your Nubbin shares the loaf with the chicks. Smallest first!'),
        N('Someone sews Nubbin a tiny white cap, to match its brother.'),
      ],
      [
        ask(
          0,
          'sel',
          'choosing to tell kind stories',
          'CASEL: Responsible decision-making',
          [N('A story can travel very far. Would you tell a kind story, or a mean one?')],
          [
            o('A kind story.', [N('Yes! Kind stories make people feel good.')], true),
            o('A mean story.', [N('Mean stories hurt. Kind stories make people feel good.')]),
          ],
          'Talked about choosing kind words, since stories travel.',
        ),
      ],
    ),
  ],
);

// ================================================================== A27-6 Sam’s Dream
const A6: EduQuest = quest(
  'a27-06',
  'Sam’s Dream',
  {
    'a27-06-s1': {
      goal: 'Go down to Sistan and find the house.',
      hint: 'Walk with the caravan to the city gate.',
    },
    'a27-06-s2': {
      goal: 'Be in the hall when Sam wakes.',
      hint: 'Wait by the hall fire.',
    },
    'a27-06-s3': {
      goal: 'Listen to the wise men and answer Sam.',
      hint: 'Stand by the fire.',
    },
  },
  [
    sc(
      'a27-06-return',
      [
        N('You ride down to Sistan on a cotton bale.'),
        N('The old servant stands at the door. He stares at you.'),
        N('His own hair has gone white.'),
        SV('Is it true? Is he alive?', 'shock'),
        N('Your Nubbin holds up its tiny white cap.'),
      ],
      [
        ask(
          2,
          'science',
          'hair can turn white or grey as people grow older',
          'ELOF: Scientific Reasoning',
          [
            N(
              'The old servant’s hair is white because he is old. Does hair change colour as people grow old?',
            ),
          ],
          [
            o('Yes, it can.', [N('Yes! Hair often turns grey or white as we grow old.')], true),
            o('No, never.', [N('It often does! Grey and white hair is common in older people.')]),
          ],
          'Learned that hair often turns grey or white as people age (different from being born with pale hair).',
        ),
      ],
      [
        ch('yes', '“He is alive. He is taller than you.”', [
          N('The old man sits down on the step. He cries, and he smiles.'),
          SV('Then I can put him down at last.', 'soft'),
        ]),
        ch('carry', '“You can stop carrying him now.”', [SV('Can I? I will practise.', 'soft')]),
      ],
    ),
    sc(
      'a27-06-return-done',
      [SV('The master does not sleep well. Stay tonight.')],
      [
        doit(
          0,
          'maths',
          'count five lamps',
          'K.CC.B.5',
          'edu:count:lamps:5',
          [N('Lamps glow in the hall. (Count them with me: 1, 2, 3, 4, 5.)')],
          'Counted five lamps, one number for each.',
        ),
      ],
    ),
    sc(
      'a27-06-dream',
      [
        N('In the night, Sam shouts. He comes with a lamp.'),
        SA('I dreamed of a man on a horse!', 'shock'),
        RI(
          'You sent your son away for his white hair. Look in a mirror. Your beard is white too.',
          'angry',
        ),
        N('Sam touches his own beard. It is white, like his son’s hair.'),
        SA('Then I woke up.', 'sad'),
      ],
      [
        ask(
          3,
          'literacy',
          'comparing: white as milk',
          'RL.1.4',
          [N('Sam’s beard is white. Which thing is white: milk or mud?')],
          [
            o('Milk.', [N('Yes! White as milk, white as snow.')], true),
            o('Mud.', [N('Mud is brown. Milk is white, like snow.')]),
          ],
          'Practised describing things by comparing: white as milk, white as snow.',
        ),
      ],
    ),
    sc(
      'a27-06-dream-done',
      [SA('Call the wise men. Now, before I lose my courage.')],
      [
        ask(
          0,
          'sel',
          'saying sorry takes courage',
          'CASEL: Responsible decision-making',
          [N('Saying sorry can feel hard. What can you say when you did a wrong thing?')],
          [
            o('I am sorry.', [N('Yes! Saying I am sorry helps to fix things.')], true),
            o('It was not me.', [N('That does not help. Saying I am sorry helps to fix things.')]),
          ],
          'Talked about the courage it takes to say sorry.',
        ),
      ],
    ),
    sc(
      'a27-06-mobeds',
      [
        N('The wise men come in white robes. Sam tells them his dream.'),
        MO('Even wild animals look after their babies.'),
        MO('You sent your child away. That was wrong. Go and find him.'),
        MO('Ask him to forgive you.'),
        N('Sam sees you by the fire.'),
        SA('Is he alive? Tell me the truth.'),
      ],
      [
        ask(
          1,
          'science',
          'animal parents feed and protect their young',
          '1-LS1-2',
          [
            N(
              'Animal parents look after their babies. A mother duck keeps ducklings close. What else do parents do?',
            ),
          ],
          [
            o('Keep them safe and fed.', [N('Yes! Parents keep their young safe and fed.')], true),
            o('Leave them alone.', [
              N('A mother duck does not leave her ducklings. She keeps them safe and fed.'),
            ]),
          ],
          'Learned that animal parents feed and protect their young.',
        ),
      ],
      [
        ch('alive', '“He is alive. He is the best person I know.”', [
          N('Sam closes his eyes. When he opens them, they are wet.', 'soft'),
        ]),
        ch('see', '“Go and see for yourself.”', [SA('Yes. I should climb for it.', 'think')]),
        ch('hair', '“His hair is still white. Will you mind?”', [
          SA('No. I should never have minded.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a27-06-mobeds-done',
      [
        SA('Sound the drums! We march at first light!'),
        N('You and your Nubbin run ahead to the mountain.'),
      ],
      [
        ask(
          1,
          'maths',
          'a repeating pattern: boom, tap',
          'ELOF: Mathematics Development',
          [N('Drums go boom, tap, boom, tap, boom... What comes next?')],
          [
            o('Tap.', [N('Yes! Boom, tap, boom, tap, boom, tap. A pattern!')], true),
            o('Boom.', [N('Look at the pattern: boom, tap, boom, tap. After boom comes tap.')]),
          ],
          'Continued a simple two-sound pattern.',
        ),
      ],
    ),
    sc(
      'a27-06-complete',
      [
        N('You stop at the foot of the rocks. You look up into the cloud.'),
        N('The Simurgh comes down.'),
        SI('Did he hear the story?'),
        Y('He is coming. With an army!'),
        SI('Then I had better put the kettle on.', 'think'),
        N('She has no kettle. You think she knows.'),
      ],
      [
        doit(
          5,
          'literacy',
          'clap the syllables in kettle',
          'RF.K.2',
          'edu:clap:syllables:kettle',
          [
            N('Clap the word kettle. Ket-tle. Two claps!'),
            N('The Simurgh claps too, with one wing.'),
          ],
          'Clapped the two syllables in kettle.',
        ),
      ],
    ),
  ],
);

// ================================================================== A27-7 The Foot of the Mountain
const A7: EduQuest = quest(
  'a27-07',
  'The Foot of the Mountain',
  {
    'a27-07-s1': {
      goal: 'Watch the army come to the foot of the mountain.',
      hint: 'Lie flat at the nest’s edge and look down.',
    },
    'a27-07-s2': {
      goal: 'Watch Sam try to climb, and see him pray.',
      hint: 'Keep watching the man at the front.',
    },
  },
  [
    sc(
      'a27-07-army',
      [
        N('Three days later, you peek through a gap in the cloud.'),
        N('Far below is an army! Tiny tents and flags.'),
        YO('What are those? Ants? They have flags!'),
        Y('People. A lot of people.'),
        YO('Is it a market?', 'shock'),
        N('He lies flat and stares and stares.'),
      ],
      [
        ask(
          3,
          'maths',
          'compare groups: more and fewer',
          'K.CC.C.6',
          [N('In the picture there are 5 tents and 3 flags. Which is more?')],
          [
            o('Tents.', [N('Yes! Five tents is more than three flags.')], true),
            o('Flags.', [N('Count: five tents, three flags. Five is more.')]),
          ],
          'Compared two groups (5 and 3) to say which has more.',
        ),
      ],
    ),
    sc(
      'a27-07-army-done',
      [YO('I did not know there were so many people.', 'soft')],
      [
        ask(
          0,
          'sel',
          'feelings can mix: excited and nervous',
          'CASEL: Self-awareness',
          [N('He has only met a few people. Seeing so many is big. How might he feel?')],
          [
            o('Excited and nervous.', [N('Yes! Feelings can mix. Both can be true.')], true),
            o('Only excited.', [N('Maybe! Some people feel a bit nervous too.')]),
          ],
          'Named mixed feelings: excited and nervous at once.',
        ),
      ],
    ),
    sc(
      'a27-07-foot',
      [
        N('One man comes out of the army and climbs.'),
        N('The rocks are too steep. He slides back down.'),
        N('The army watches. Nobody laughs.'),
        N('He kneels on the stones and prays. He is very sorry.', 'soft'),
        N('You see him first. He has white in his beard too.'),
      ],
      [
        ask(
          2,
          'social-studies',
          'Sistan is a real place in two countries today',
          'D2.Geo.2.K-2',
          [
            N(
              'Sistan is a real place. Today it lies in Iran and in Afghanistan. How many countries?',
            ),
          ],
          [
            o('Two.', [N('Yes! Two countries: Iran and Afghanistan.')], true),
            o('Ten.', [N('Two! Iran and Afghanistan, side by side.')]),
          ],
          'Learned that the region of Sistan lies in two countries today, Iran and Afghanistan.',
        ),
      ],
      [
        ch('point', 'Point him out.', [
          Y('That one. The one kneeling.'),
          YO('He looks sad. Why would anyone be sad at the bottom of a mountain?', 'think'),
        ]),
        ch('quiet', 'Say nothing yet. It is not your news.', [
          N('You keep it to yourself. The young man watches, and cannot stop.'),
        ]),
      ],
    ),
    sc(
      'a27-07-foot-done',
      [N('Behind you, the nest tilts. The Simurgh looks down.')],
      [
        ask(
          0,
          'literacy',
          'first sounds: t for tilt',
          'RF.K.2',
          [N('Tilt begins with t, t, t. Which starts like tilt: top or sun?')],
          [
            o('Top.', [N('Yes! Tilt, top: t, t, t!')], true),
            o('Sun.', [N('Sun begins with s. Tilt and top both begin with t!')]),
          ],
          'Practised hearing the first sound t in tilt and top.',
        ),
      ],
    ),
    sc(
      'a27-07-complete',
      [
        N('The Simurgh looks down for a long time. Her feathers lift and settle.'),
        SI('He is on his knees at the bottom of my mountain. That is the right way to come.'),
        SI('Sit with me a moment. Then I must tell him.', 'sad'),
      ],
      [
        ask(
          0,
          'science',
          'birds fluff their feathers to keep warm',
          'ELOF: Scientific Reasoning',
          [N('When a bird fluffs up its feathers, what is it doing?')],
          [
            o('Keeping warm.', [N('Yes! Fluffy feathers trap warm air.')], true),
            o('Brushing its teeth.', [N('Birds have no teeth! Fluffing keeps them warm.')]),
          ],
          'Learned that birds fluff their feathers to trap warm air.',
        ),
      ],
    ),
  ],
);

// ================================================================== A27-8 The Feather
const A8: EduQuest = quest(
  'a27-08',
  'The Feather',
  {
    'a27-08-s1': {
      goal: 'Be there when the Simurgh tells him.',
      hint: 'Sit at the nest’s edge with the young man.',
    },
    'a27-08-s2': {
      goal: 'Stay with him while he decides.',
      hint: 'What you do here matters for a long time.',
    },
  },
  [
    sc(
      'a27-08-telling',
      [
        N('The Simurgh sits down low beside the young man.'),
        SI('You have lived in my nest since you were tiny.'),
        SI('Your father has come back. He is the man on his knees.'),
        SI('It is time to give you back to your people.', 'sad'),
        YO('My father?', 'shock'),
      ],
      [
        ask(
          1,
          'maths',
          'compare size: smaller and bigger',
          'K.MD.A.2',
          [N('The Simurgh’s foot is much bigger than his foot. Which foot is smaller?')],
          [
            o('His foot.', [N('Yes! His foot is smaller. Hers is huge!')], true),
            o('Her foot.', [N('Look again. Her foot is much bigger, so his is smaller.')]),
          ],
          'Compared two sizes: his foot is smaller than the Simurgh’s.',
        ),
      ],
    ),
    sc(
      'a27-08-telling-done',
      [N('The chicks go quiet. Even the smallest stops eating.')],
      [
        ask(
          0,
          'sel',
          'sad feelings are allowed; hugs and talking help',
          'CASEL: Self-management',
          [N('Everyone is sad that he is leaving. Sad is okay. What helps when we feel sad?')],
          [
            o('A hug.', [N('Yes! A hug and a chat help sad feelings.')], true),
            o('Hide the feeling.', [N('Sad feelings are allowed. A hug and a chat help.')]),
          ],
          'Talked about sadness at a goodbye, and what helps.',
        ),
      ],
    ),
    sc(
      'a27-08-feather',
      [
        YO('Do you not want me? I can be smaller.', 'sad'),
        SI('I want you always. But another life is good for you.', 'soft'),
        N('He cries. He has never met people.'),
        N('She gives him one feather from her chest. It is grey and gold.'),
        SI('Burn it on the day you need me, and I will come.'),
        N('He holds it, and looks at you.'),
      ],
      [
        ask(
          5,
          'social-studies',
          'keepsakes help us remember people we love',
          'D2.His.2.K-2',
          [
            N(
              'The feather helps him remember the Simurgh. What do you keep to remember someone you love?',
            ),
          ],
          [
            o('A photo.', [N('A photo is a lovely thing to keep.')]),
            o('A toy.', [N('A toy that someone gave you is special.')]),
            o('A song.', [N('A song is a good keepsake. You can sing it any time.')]),
          ],
          'Talked about keepsakes that help us remember people we love.',
        ),
      ],
      [
        ch(
          'told',
          'Tell him his father came back, and he should go.',
          [
            Y('He came back. He climbed as far as he could, and knelt.'),
            YO('He came back.', 'think'),
            N('He says it again, quietly. Then he stands up.'),
          ],
          { 'a27-feather': 'told' },
        ),
        ch(
          'sat',
          'Sit with him, and say nothing until he is ready.',
          [
            N('You sit beside him, shoulder to shoulder. You say nothing.'),
            N('It takes a long time. You let it.'),
            N('Then, by himself, he stands up.', 'soft'),
          ],
          { 'a27-feather': 'sat' },
        ),
        ch(
          'night',
          'Ask the Simurgh to make Sam wait one more night.',
          [
            Y('Can he have one more night in the nest?'),
            SI('One more night.', 'think'),
            N('That night he sleeps among the chicks, with the feather in his fist.'),
            N('In the morning, he stands up.'),
          ],
          { 'a27-feather': 'night' },
        ),
      ],
    ),
    sc(
      'a27-08-feather-done',
      [
        YO('I will go. But I will come back to see you all.', 'soft'),
        SI('I know. Keep the feather dry.'),
      ],
      [
        ask(
          1,
          'science',
          'feathers are light because they are full of air',
          'ELOF: Scientific Reasoning',
          [N('Feathers are very light. Which is lighter: a feather or a stone?')],
          [
            o('A feather.', [N('Yes! A feather is light, and full of air.')], true),
            o('A stone.', [N('A stone is heavy. A feather is much lighter.')]),
          ],
          'Compared weight: a feather is lighter than a stone.',
        ),
      ],
    ),
    sc(
      'a27-08-complete',
      [
        N('The young man says goodbye to each chick in turn.'),
        N('The smallest chick sits on him one last time. Flump!'),
        N('He laughs and cries at once, and lets it.'),
        N('You say goodbye too.'),
        SI('Take something of the nest home with you.', 'soft'),
        N('She weaves you a great round nest.'),
      ],
      [
        ask(
          5,
          'maths',
          'name the shape: circle',
          'K.G.A.2',
          [N('Your new nest is round. Which shape is round: a circle or a square?')],
          [
            o('A circle.', [N('Yes! A circle is round, with no corners.')], true),
            o('A square.', [N('A square has four corners. A circle is round.')]),
          ],
          'Named a circle as the round shape, with no corners.',
        ),
      ],
    ),
  ],
);

// ================================================================== A27-9 Father and Son
const A9: EduQuest = quest(
  'a27-09',
  'Father and Son',
  {
    'a27-09-s1': {
      goal: 'Go down the mountain with the young man.',
      hint: 'Hold on. The Simurgh will set you down above the army.',
    },
    'a27-09-s2': {
      goal: 'Stand by while Sam makes his promise.',
      hint: 'Stay close. This is theirs.',
    },
    'a27-09-s3': {
      goal: 'Ride home to Sistan with the army.',
      hint: 'Find a place on the baggage train.',
    },
  },
  [
    sc(
      'a27-09-descent',
      [
        N('The Simurgh carries you both down through the cloud.'),
        N('She sets you on the slope above the army, and watches.'),
        N('Sam is still on his knees. He hears the stones move.'),
        N('The young man starts to walk. Then he runs!', 'happy'),
        YO('You came back for me.'),
        N('Sam nods and nods. He cannot speak.'),
      ],
      [
        ask(
          4,
          'sel',
          'it feels safe when someone comes back for you',
          'CASEL: Social awareness',
          [N('Someone came back for him. How does it feel when someone comes back for you?')],
          [
            o('Happy and safe.', [N('Yes! It feels warm and safe.')], true),
            o('Cross.', [N('Some people feel cross first. Often, safe comes after.')]),
          ],
          'Talked about how it feels when someone comes back for you.',
        ),
      ],
    ),
    sc(
      'a27-09-descent-done',
      [N('Your Nubbin arrives last, rolling down the slope. It stops at Sam’s boot.')],
      [
        ask(
          0,
          'science',
          'round things roll downhill',
          'ELOF: Scientific Reasoning',
          [N('Nubbin is round, so it rolls down the hill. Which rolls: a ball or a box?')],
          [
            o('A ball.', [N('Yes! A ball is round, so it rolls.')], true),
            o('A box.', [N('A box has flat sides. A round ball rolls best.')]),
          ],
          'Learned that round things roll downhill.',
        ),
      ],
    ),
    sc(
      'a27-09-oath',
      [
        N('Sam bows low to the great bird.'),
        SA('I was wrong. I was afraid, and I was wrong.', 'sad'),
        SA('I promise: I will never be hard to you again.'),
        N('He gives his son a name: Zal. It means the old one, for the white hair.'),
        N('Sam says it with pride.'),
        ZA('Zal. I like it!', 'happy'),
      ],
      [
        ask(
          5,
          'literacy',
          'first sounds: z for Zal and zebra',
          'RF.K.2',
          [N('Zal begins with z, z, z. Which starts like Zal: zebra or sun?')],
          [
            o('Zebra.', [N('Yes! Zal, zebra: z, z, z!')], true),
            o('Sun.', [N('Sun begins with s. Zal and zebra both begin with z!')]),
          ],
          'Practised hearing the first sound z in Zal and zebra.',
        ),
      ],
      [
        ch('clap', 'Clap.', [N('You clap. Your Nubbin claps. So does the whole army!')]),
        ch('bow', 'Bow to Zal.', [ZA('You do not bow to me. You are my nestmate.', 'happy')]),
      ],
    ),
    sc(
      'a27-09-oath-done',
      [N('They dress Zal in fine clothes: a shirt, a belt and boots.')],
      [
        doit(
          0,
          'maths',
          'count three things',
          'K.CC.B.5',
          'edu:count:clothes:3',
          [N('Shirt, belt, boots. How many things? (Count on your fingers.)')],
          'Counted three items of clothing.',
        ),
      ],
    ),
    sc(
      'a27-09-road',
      [
        N('The army goes home with drums and trumpets.'),
        N('Boom! Toot! Crash!'),
        N('Zal rides beside his father. You ride on the baggage.'),
        ZA('It is so loud!'),
        SA('Only when the world is happy.', 'happy'),
        N('High above, a great bird turns once, and goes home.', 'soft'),
      ],
      [
        doit(
          1,
          'music',
          'sound is made by shaking: vibrations',
          '1-PS4-1',
          'edu:feel:throat:hum',
          [N('Drums shake to make sound. Touch your throat and hum. Feel the shake?')],
          'Felt a vibration in the throat while humming, and linked it to how sound is made.',
        ),
      ],
    ),
    sc(
      'a27-09-road-done',
      [N('Sistan has heard! The city is hung with cloth and flowers.')],
      [
        ask(
          0,
          'art',
          'continuing a colour pattern',
          'ELOF: Mathematics Development',
          [N('The cloth has a pattern: red, gold, red, gold. What colour comes next?')],
          [
            o('Red.', [N('Yes! Red, gold, red, gold, red!')], true),
            o('Green.', [N('The pattern is red, gold, red, gold. Next comes red!')]),
          ],
          'Continued a repeating colour pattern.',
        ),
      ],
    ),
    sc(
      'a27-09-complete',
      [
        N('People throw flowers at the gate. Zal catches a rose.'),
        N('Your Nubbin eats it! Zal laughs and laughs.'),
        SA('You laugh with your whole self.', 'soft'),
        ZA('The chicks taught me.'),
      ],
      [
        ask(
          1,
          'sel',
          'noticing how happy feels in the body',
          'CASEL: Self-awareness',
          [N('Zal laughs with his whole self. How does your body feel when you laugh?')],
          [
            o('Wiggly.', [N('Wiggly! Laughing shakes us all over.')]),
            o('Warm.', [N('Warm and glowing. That is a happy body.')]),
            o('Tickly.', [N('Tickly! Laughing is full of tickles.')]),
          ],
          'Named how laughing feels in the body.',
        ),
      ],
    ),
  ],
);

// ================================================================== A27-10 The Shah’s Court
const A10: EduQuest = quest(
  'a27-10',
  'The Shah’s Court',
  {
    'a27-10-s1': {
      goal: 'Go with Sam and Zal to the Shah’s court.',
      hint: 'Walk behind Zal into the big hall.',
    },
    'a27-10-s2': {
      goal: 'Help Zal get through his first feast.',
      hint: 'Watch the others, and copy.',
    },
    'a27-10-s3': {
      goal: 'Sit with Zal while he listens to people’s troubles.',
      hint: 'Stand at his shoulder in the hall.',
    },
  },
  [
    sc(
      'a27-10-court',
      [
        N('The Shah is the king. He sits on a throne, in a crown.'),
        N('The court is full of rugs and lamps.'),
        N('Sam tells him everything, even the bad part.'),
        SH('Champion, look after this one.'),
        SH('Teach him our ways. How would a nest boy know them?', 'think'),
        N('Zal bows, just as the Simurgh bows her head.'),
      ],
      [
        ask(
          5,
          'social-studies',
          'people greet each other in different ways',
          'D2.Civ.8.K-2',
          [
            N(
              'People say hello in different ways. In Persian, hello is salaam. How do you say hello?',
            ),
          ],
          [
            o('I wave.', [N('A wave is a friendly hello!')]),
            o('I say hi.', [N('Hi is a friendly hello!')]),
            o('I say salaam.', [N('Salaam! A lovely hello, in Persian.')]),
          ],
          'Talked about different ways of saying hello, including the Persian word salaam.',
        ),
      ],
    ),
    sc(
      'a27-10-court-done',
      [
        N('The star-readers look at the stars. They say he will be brave and wise.'),
        SH('I could tell that by looking at him.', 'happy'),
      ],
      [
        ask(
          1,
          'science',
          'stars shine at night',
          '1-ESS1-1',
          [N('Long ago, people watched the stars. When do stars shine in the sky?')],
          [
            o('At night.', [N('Yes! We see stars at night, when the sky is dark.')], true),
            o('At lunchtime.', [
              N('Stars are there, but the bright sun hides them. We see them at night.'),
            ]),
          ],
          'Learned that we see stars at night, when the sky is dark.',
        ),
      ],
    ),
    sc(
      'a27-10-banquet',
      [
        N('Tonight there is a feast. There are so many cups and knives!'),
        ZA('Which one is for eating?'),
        Y('I do not know either.'),
        ZA('Then we are equal. We will learn together.', 'happy'),
        N('Zal waits until everyone is served.'),
        N('Your Nubbin eats a whole dish of rice. Munch!'),
      ],
      [
        doit(
          1,
          'maths',
          'count five cups',
          'K.CC.B.5',
          'edu:count:cups:5',
          [N('Count the cups on the table with me: 1, 2, 3, 4, 5.')],
          'Counted five cups, one number for each.',
        ),
      ],
      [
        ch('copy', 'Watch the others, and copy.', [
          N('You copy the man opposite, and Zal copies you.'),
          ZA('This is like hunting. You keep still and watch.', 'happy'),
        ]),
        ch('ask', 'Ask the person next to you.', [
          N('They are glad to be asked. They explain every knife.'),
        ]),
        ch('nubbin', 'Try to stop your Nubbin starting a second dish.', [
          N('Too late! The Shah laughs, and sends it a third.'),
        ]),
      ],
    ),
    sc(
      'a27-10-banquet-done',
      [N('Your Nubbin falls asleep on a cushion, tummy up. Snore!')],
      [
        ask(
          0,
          'literacy',
          'rhymes: snore and door',
          'RF.K.2',
          [N('Which word rhymes with snore: door or sun?')],
          [
            o('Door.', [N('Yes! Snore, door, floor, more!')], true),
            o('Sun.', [N('Sun does not rhyme. Snore, door, floor: they end the same!')]),
          ],
          'Practised rhyming: snore, door, floor, more.',
        ),
      ],
    ),
    sc(
      'a27-10-petitions',
      [
        N('Sam goes to the wars. Zal looks after Sistan.'),
        N('Every morning, people bring their troubles.'),
        N('A fence. A coin. A goat that ate a neighbour’s washing!'),
        N('Zal listens to both sides.'),
        N('He never judges anyone by how they look.'),
      ],
      [
        ask(
          3,
          'social-studies',
          'fairness: everyone gets a turn to speak',
          'D2.Civ.8.K-2',
          [N('Zal listens to both sides. Why is listening fair?')],
          [
            o('Everyone gets a turn.', [N('Yes! Fair means everyone gets a turn to speak.')], true),
            o('Only the loud one talks.', [N('Fair means everyone gets a turn, loud or quiet.')]),
          ],
          'Talked about fairness: everyone gets a turn to speak.',
        ),
      ],
    ),
    sc(
      'a27-10-petitions-done',
      [ZA('Tell me if I get one wrong. You are not afraid to.')],
      [
        ask(
          0,
          'sel',
          'telling the truth kindly',
          'CASEL: Relationship skills',
          [N('A good friend tells the truth, kindly. How can we say a true thing kindly?')],
          [
            o('Use a soft voice.', [N('Yes! A soft voice and kind words help.')], true),
            o('Shout it.', [N('Shouting can sting. A soft voice and kind words help.')]),
          ],
          'Practised telling the truth kindly, with a soft voice.',
        ),
      ],
    ),
    sc(
      'a27-10-complete',
      [
        N('The seasons go round: spring, summer, autumn, winter.'),
        N('Zal grows wise and strong.'),
        N('The goat owner and the washing owner become friends!'),
        ZA('Now I want to see the rest of the kingdom.'),
        N('Your Nubbin agrees, if there is food.'),
      ],
      [
        ask(
          0,
          'science',
          'the four seasons in order',
          'K-ESS2-1',
          [N('There are four seasons. Which season comes after summer?')],
          [
            o('Autumn.', [N('Yes! Spring, summer, autumn, winter.')], true),
            o('Spring.', [N('Spring comes after winter. After summer comes autumn.')]),
          ],
          'Put the four seasons in order: spring, summer, autumn, winter.',
        ),
      ],
    ),
  ],
);

// ================================================================== A27-11 Kabul
const A11: EduQuest = quest(
  'a27-11',
  'Kabul',
  {
    'a27-11-s1': {
      goal: 'Be at the feast in Zal’s tents outside Kabul.',
      hint: 'King Mehrab comes at sundown.',
    },
    'a27-11-s2': {
      goal: 'Carry Zal’s gift to Mehrab.',
      hint: 'Take the box through the gate to the king’s house.',
    },
    'a27-11-s3': {
      goal: 'Answer Rudaba’s questions about Zal.',
      hint: 'Sit with the family and talk.',
    },
  },
  [
    sc(
      'a27-11-tents',
      [
        N('Zal camps by the river near Kabul.'),
        N('The king of Kabul, Mehrab, comes to meet him.'),
        N('They like each other at once.'),
        MH('Come and stay in my house. Let us be glad of you.', 'happy'),
        ZA('Ask me anything else. I cannot say yes.', 'sad'),
        N('Long ago, a cruel king was in Mehrab’s family. Zal’s father would not like it.'),
        N('Mehrab bows and goes away, sad.'),
      ],
      [
        notice(
          1,
          'social-studies',
          'Kabul is a real city in Afghanistan where Persian is spoken',
          'D2.Geo.2.K-2',
          [
            N('Kabul is a real city. Today it is in a country called Afghanistan.'),
            N('People there speak a kind of Persian, too.'),
          ],
          'Learned that Kabul is a real city in Afghanistan, where Persian is spoken.',
        ),
      ],
    ),
    sc(
      'a27-11-tents-done',
      [ZA('I sent him away with nothing. Will you go after him for me?', 'sad')],
      [
        ask(
          0,
          'sel',
          'making things right with a kind gift and kind words',
          'CASEL: Responsible decision-making',
          [N('Zal feels bad. What can he do to make it kinder?')],
          [
            o(
              'Send a kind gift and kind words.',
              [N('Yes! Kind words and a gift can mend a sore feeling.')],
              true,
            ),
            o('Forget about it.', [
              N('Mehrab might still feel sad. A kind gift and kind words can help.'),
            ]),
          ],
          'Thought about how to mend a sore feeling with kindness.',
        ),
      ],
    ),
    sc(
      'a27-11-gift',
      [
        N('Zal gives you a wooden box. Inside is a white cloth with a gold edge.'),
        ZA('Tell him I wanted to come. That part is true.'),
        N('You carry it through Kabul at dusk. It smells of bread.'),
        N('Mehrab opens the box. He goes pink.'),
        MH('That is the nicest no I ever had!', 'happy'),
      ],
      [
        doit(
          0,
          'maths',
          'trace a rectangle',
          'K.G.A.2',
          'edu:trace:shape:rectangle',
          [N('The box is a rectangle. Draw a rectangle in the air with your finger.')],
          'Drew a rectangle in the air and named the shape.',
        ),
      ],
    ),
    sc(
      'a27-11-gift-done',
      [SK('Sit down, messenger. Have something to eat.')],
      [
        ask(
          0,
          'social-studies',
          'welcoming a guest',
          'D2.Civ.8.K-2',
          [
            N(
              'In many homes, a guest is offered food. In Persian, a guest is a mehman. What can you offer a guest?',
            ),
          ],
          [
            o('A snack or a drink.', [N('Yes! A snack shows you are glad they came.')], true),
            o('Nothing.', [N('Offering something shows you are glad they came.')]),
          ],
          'Talked about welcoming guests, and learned the Persian word mehman.',
        ),
      ],
    ),
    sc(
      'a27-11-praise',
      [
        SK('Tell us about this white-haired son of Sam.'),
        MH('He is brave, and he is kind. The white hair suits him.', 'happy'),
        N('Rudaba is quiet. She listens with her whole self.'),
        RU('What is he really like?'),
      ],
      [
        ask(
          3,
          'literacy',
          'what a character does shows what they are like',
          'RL.K.3',
          [N('Zal feeds everyone else first. Is Zal kind or unkind?')],
          [
            o('Kind.', [N('Yes! What he does shows he is kind.')], true),
            o('Unkind.', [N('Feeding others first is a kind thing to do. Zal is kind.')]),
          ],
          'Worked out that a character is kind from what he does.',
        ),
      ],
      [
        ch('kind', '“He feeds everyone else before himself.”', [
          RU('Does he? Even at a feast?', 'soft'),
          Y('Especially then.'),
        ]),
        ch('bird', '“A great bird raised him. He still bows like her.”', [
          RU('I would like to see that bow.', 'happy'),
        ]),
        ch('hair', '“His hair is white as snow, and it suits him.”', [
          RU('Father says so too. I think I would like it.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a27-11-praise-done',
      [N('Rudaba asks seven more questions. Sindokht watches her.')],
      [
        doit(
          0,
          'maths',
          'count to seven',
          'K.CC.B.5',
          'edu:count:questions:7',
          [N('Seven questions! (Count them on your fingers: 1 to 7.)')],
          'Counted seven questions, one number for each.',
        ),
      ],
    ),
    sc(
      'a27-11-complete',
      [
        N('You walk back to the tents in the dark. Nubbin is asleep on your shoulder.'),
        N('In the king’s house, a girl cannot sleep.'),
        N('In a tent, a young man cannot sleep either.'),
        ZA('Did he like the cloth? What did they say?'),
        N('You tell him about Rudaba. He does not sleep at all.'),
      ],
      [
        ask(
          4,
          'health',
          'sleep helps our bodies rest',
          'ELOF: Perceptual, Motor, and Physical Development',
          [
            N(
              'Zal cannot sleep. Sleep helps our bodies rest. What helps you sleep: a quiet song or a loud drum?',
            ),
          ],
          [
            o('A quiet song.', [N('Yes! Quiet and calm help us fall asleep.')], true),
            o('A loud drum.', [N('Boom! A drum would keep us awake. A quiet song helps.')]),
          ],
          'Learned that sleep rests our bodies, and that quiet, calm things help us sleep.',
        ),
      ],
    ),
  ],
);

// ================================================================== A27-12 The Rose Garden
const A12: EduQuest = quest(
  'a27-12',
  'The Rose Garden',
  {
    'a27-12-s1': {
      goal: 'Watch the maids gather roses across the river.',
      hint: 'Stand on the bank by Zal’s tents.',
    },
    'a27-12-s2': {
      goal: 'Cross with the page and carry messages.',
      hint: 'The ferry stone is a little way downstream.',
    },
    'a27-12-s3': {
      goal: 'Bring the wise maid to Zal.',
      hint: 'She wants to see him with her own eyes.',
    },
  },
  [
    sc(
      'a27-12-roses',
      [
        N('Across the river is a rose garden.'),
        N('Rudaba’s maids pick roses and put them in their hair.'),
        N('They drop petals in the river. Plip, plip!'),
        N('Zal takes his bow and goes to the water.'),
        N('He shoots one arrow across the river. It lands among the roses.'),
      ],
      [
        ask(
          2,
          'science',
          'plants need water and sunlight',
          '2-LS2-1',
          [N('Roses need water and sunlight to grow. What do roses need: water, or toys?')],
          [
            o('Water and sun.', [N('Yes! Roses drink water and love the sun.')], true),
            o('Toys.', [N('Roses do not need toys. They need water and sun!')]),
          ],
          'Learned that plants need water and sunlight to grow.',
        ),
      ],
    ),
    sc(
      'a27-12-roses-done',
      [ZA('Go across and fetch it. And take your time.', 'happy')],
      [
        doit(
          0,
          'maths',
          'count five petals',
          'K.CC.B.4',
          'edu:count:petals:5',
          [N('A wild rose has five petals. (Count them: 1, 2, 3, 4, 5.)')],
          'Counted the five petals of a wild rose.',
        ),
      ],
    ),
    sc(
      'a27-12-boasts',
      [
        N('You cross with the page. The maids crowd round.'),
        MD('Whose arrow is that?'),
        PG('It is the son of Sam. He is the best!', 'happy'),
        MD('Our Rudaba is the best!'),
        N('They go back and forth, taking turns.'),
      ],
      [
        ask(
          4,
          'literacy',
          'taking turns to talk and listening',
          'SL.K.1',
          [N('The page and the maid take turns to talk. What do you do when a friend is talking?')],
          [
            o('Listen and wait.', [N('Yes! Listening and waiting is polite.')], true),
            o('Talk louder.', [
              N('Talking louder is hard to listen to. Listening and waiting is polite.'),
            ]),
          ],
          'Practised taking turns in conversation: listening and waiting.',
        ),
      ],
      [
        ch('join', 'Join in the boasting.', [
          Y('He was raised by the biggest bird in the world.'),
          MD('That is cheating. You cannot beat a true thing!', 'happy'),
        ]),
        ch('judge', 'Say it is a draw.', [MD('A draw. Until they meet.', 'think')]),
      ],
    ),
    sc(
      'a27-12-boasts-done',
      [
        ZA('What did they say? Tell me every word.'),
        N('Zal sends pearls and gold, so the maids will wait.'),
      ],
      [
        ask(
          1,
          'sel',
          'feeling proud',
          'CASEL: Self-awareness',
          [N('The page felt proud of Zal. Proud is a happy feeling. What are you proud of?')],
          [
            o('My drawing.', [N('A drawing you made is a good thing to be proud of.')]),
            o('My running.', [N('Running fast, or running far. Be proud!')]),
            o('My kindness.', [N('Being kind is the best thing to be proud of.')]),
          ],
          'Named something they are proud of.',
        ),
      ],
    ),
    sc(
      'a27-12-maid',
      [
        MD('A secret that three people know is not a secret.'),
        N('You bring the wise maid across the river.'),
        N('She looks at Zal, and nods.'),
        MD('Rudaba thinks of nothing but you.'),
        ZA('Show me a way to see her.'),
      ],
      [
        ask(
          0,
          'maths',
          'add one to a group of three',
          'K.OA.A.2',
          [
            N(
              'Three people know the secret: Zal, the maid and you. One more hears it. How many now?',
            ),
          ],
          [
            o('Four.', [N('Yes! Three and one more is four.')], true),
            o('Two.', [N('Count again: 1, 2, 3, and one more makes 4.')]),
          ],
          'Added one to three to make four.',
        ),
      ],
    ),
    sc(
      'a27-12-maid-done',
      [
        N('In the family rooms, the maids tell Rudaba everything.'),
        N('She takes a rose apart, petal by petal.'),
      ],
      [
        ask(
          1,
          'art',
          'painters and poets loved roses',
          'ELOF: Approaches to Learning',
          [N('Painters in Persia loved to paint roses. Which colour rose would you paint?')],
          [
            o('Red.', [N('A red rose is bold and bright!')]),
            o('Pink.', [N('A pink rose is soft and sweet.')]),
            o('Yellow.', [N('A yellow rose looks like sunshine.')]),
          ],
          'Chose a colour to paint a rose, like the painters of old Persia.',
        ),
      ],
    ),
    sc(
      'a27-12-complete',
      [
        RU('They say he feeds everyone first. They say he shoots like a king. Which is he?'),
        Y('Both.'),
        RU('Good. I would hate to choose.', 'happy'),
        N('She gives you a cutting from the rose garden.'),
        N('Nubbin has a rose behind each ear.'),
      ],
      [
        ask(
          2,
          'sel',
          'people can be gentle and strong at once',
          'CASEL: Self-awareness',
          [N('A person can be gentle and strong. Can you be both?')],
          [
            o('Yes, both.', [N('Yes! People can be many things at once.')], true),
            o('Only one.', [N('People can be many things at once. Gentle and strong, both!')]),
          ],
          'Thought about being gentle and strong at the same time.',
        ),
      ],
    ),
  ],
);

// ================================================================== A27-13 The Rope of Hair
const A13: EduQuest = quest(
  'a27-13',
  'The Rope of Hair',
  {
    'a27-13-s1': {
      goal: 'Go with Zal to the king’s house at dusk.',
      hint: 'Follow the maid through the dark lanes.',
    },
    'a27-13-s2': {
      goal: 'Keep watch below while Zal goes up.',
      hint: 'Stand at the corner of the lane.',
    },
    'a27-13-s3': {
      goal: 'Keep watch until dawn.',
      hint: 'The porter comes round once.',
    },
  },
  [
    sc(
      'a27-13-dusk',
      [
        N('At sundown the maid says: come now.'),
        N('Zal follows her down the dark lanes. You come too, to keep watch.'),
        N('Rudaba waits on the roof in the last light.'),
        N('She is tall and calm, like a tree with the moon on it.'),
        RU('Welcome! Bless you for coming.'),
      ],
      [
        ask(
          3,
          'literacy',
          'comparing: tall like a tree',
          'RL.1.4',
          [
            N(
              'Rudaba is tall and calm, like a tree. What is tall like a tree: a giraffe or a mouse?',
            ),
          ],
          [
            o('A giraffe.', [N('Yes! A giraffe is very tall.')], true),
            o('A mouse.', [N('A mouse is tiny. A giraffe is tall like a tree.')]),
          ],
          'Practised comparing things: tall like a tree.',
        ),
      ],
    ),
    sc(
      'a27-13-dusk-done',
      [ZA('You are up there, and I am down here.')],
      [
        ask(
          0,
          'maths',
          'position words: above and below',
          'K.G.A.1',
          [N('Rudaba is on the roof. Zal is on the ground. Who is above?')],
          [
            o('Rudaba.', [N('Yes! Rudaba is above. Zal is below.')], true),
            o('Zal.', [N('Look up! Rudaba is above, on the roof. Zal is below.')]),
          ],
          'Used the words above and below to say where people are.',
        ),
      ],
    ),
    sc(
      'a27-13-roof',
      [
        N('Rudaba lets her long hair down from the roof.'),
        RU('Take hold and climb!'),
        N('Zal holds it gently. Then he lets go.'),
        ZA('No. That would hurt you.', 'soft'),
        N('He makes a loop in a rope and throws it up. It catches!'),
      ],
      [
        ask(
          3,
          'sel',
          'choosing the kind and gentle way',
          'CASEL: Responsible decision-making',
          [N('Zal said no, because it would hurt her. Which is a kind choice?')],
          [
            o('Being gentle.', [N('Yes! Gentle is kind.')], true),
            o('Pulling hard.', [N('Pulling hard could hurt. Gentle is kind.')]),
          ],
          'Talked about choosing a gentle, kind way so as not to hurt anyone.',
        ),
      ],
    ),
    sc(
      'a27-13-roof-done',
      [N('Up on the roof, they hold hands and go in together.')],
      [
        ask(
          0,
          'science',
          'a problem and a solution: a rope helps us climb',
          'K-2-ETS1-1',
          [N('Zal had a problem: how to get up the wall. What did he use?')],
          [
            o('A rope.', [N('Yes! A rope solved the problem.')], true),
            o('A spoon.', [N('A spoon is too small! A rope helps us climb.')]),
          ],
          'Named a problem (getting up a wall) and its solution (a rope).',
        ),
      ],
    ),
    sc(
      'a27-13-watch',
      [
        N('The night is warm and long. Voices drift from the window.'),
        N('Nubbin sits on your feet, fast asleep.'),
        N('At midnight, a night porter walks round with a lamp.'),
        N('He stops at the rope. He looks up the wall.', 'shock'),
      ],
      [
        ask(
          3,
          'maths',
          'first, next, last',
          'ELOF: Mathematics Development',
          [N('First comes dusk. Next comes midnight. Last comes morning. What comes last?')],
          [
            o('Morning.', [N('Yes! Dusk, midnight, morning. Morning is last.')], true),
            o('Dusk.', [N('Dusk is first. The last one is morning.')]),
          ],
          'Put three times of day in order: first, next, last.',
        ),
      ],
      [
        ch('greet', 'Step out and say good evening.', [
          N('He jumps, and says good evening back. You talk about the weather.'),
        ]),
        ch('nubbin', 'Nudge your Nubbin.', [
          N('Nubbin rolls after the lamp. The porter follows it, trying to feed it.'),
        ]),
        ch('still', 'Keep very still in the shadow.', [
          N('He thinks the rope is a vine, and walks on.'),
        ]),
      ],
    ),
    sc(
      'a27-13-watch-done',
      [
        N('In the camp, the morning drums begin.'),
        N('The voices upstairs say: not yet, please, not yet.'),
      ],
      [
        ask(
          1,
          'sel',
          'feeling sad when a good time ends',
          'CASEL: Self-management',
          [N('They wish the night would last longer. What helps when a good time ends?')],
          [
            o(
              'Remembering the good time.',
              [N('Yes! Remembering helps, and you can look forward to next time.')],
              true,
            ),
            o('Being cross.', [
              N('Feeling cross is okay. Remembering the good time can help it pass.'),
            ]),
          ],
          'Talked about feeling sad when a happy time ends.',
        ),
      ],
    ),
    sc(
      'a27-13-complete',
      [
        N('The sun does not wait. It comes up anyway.'),
        N('Zal comes down the rope and stands in the lane.'),
        ZA('We have promised to stay together.', 'happy'),
        N('He coils the rope. You keep it.'),
      ],
      [
        ask(
          0,
          'science',
          'the sun comes up in the morning',
          '1-ESS1-1',
          [N('The sun comes up. Does the sun come up in the morning or at night?')],
          [
            o('In the morning.', [N('Yes! The sun rises in the morning.')], true),
            o('At night.', [
              N('At night we see the moon and stars. The sun rises in the morning.'),
            ]),
          ],
          'Learned that the sun comes up in the morning.',
        ),
      ],
    ),
  ],
);

// ================================================================== A27-14 Letters
const A14: EduQuest = quest(
  'a27-14',
  'Letters',
  {
    'a27-14-s1': {
      goal: 'Carry Zal’s letter to his father.',
      hint: 'Ride north to Sam’s camp.',
    },
    'a27-14-s2': {
      goal: 'Wait while Sam reads.',
      hint: 'Stay in Sam’s tent until the star-readers come back.',
    },
    'a27-14-s3': {
      goal: 'Take Sam’s answer to Kabul.',
      hint: 'Zal sends you to Rudaba with the news.',
    },
    'a27-14-s4': {
      goal: 'Ride with Sindokht to Sam.',
      hint: 'Stay with the queen’s train.',
    },
  },
  [
    sc(
      'a27-14-letter',
      [
        N('In the morning, Zal asks a scribe to write a letter.'),
        ZA('Father. You left me on a mountain. A bird raised me.'),
        ZA('I do not say it to hurt you. I say it because it is true.'),
        ZA('I have one thing to ask. I love Rudaba. I want to marry her.'),
        ZA('You came back for me. Come with me now.'),
        N('He gives the letter to you.'),
      ],
      [
        ask(
          4,
          'literacy',
          'a letter has a hello and a goodbye',
          'ELOF: Literacy',
          [
            N(
              'Zal wrote a letter to say a hard thing, kindly. What comes first in a letter: hello or goodbye?',
            ),
          ],
          [
            o('Hello.', [N('Yes! A letter starts with hello, and ends with goodbye.')], true),
            o('Goodbye.', [N('Goodbye comes at the end. A letter starts with hello.')]),
          ],
          'Learned that a letter begins with a greeting and ends with a goodbye.',
        ),
      ],
    ),
    sc(
      'a27-14-letter-done',
      [N('You ride north for four days. Nubbin rides in the saddlebag, eating.')],
      [
        doit(
          0,
          'maths',
          'count four days',
          'K.CC.B.5',
          'edu:count:days:4',
          [N('Four days of riding. (Count them: day 1, day 2, day 3, day 4.)')],
          'Counted four days of the journey.',
        ),
      ],
    ),
    sc(
      'a27-14-stars',
      [
        N('Sam reads the letter twice.'),
        SA('A girl from Kabul. What will come of it? What should I do?', 'think'),
        N('He asks the wise men to read the stars. They come back smiling.'),
        MO('Good news! Zal will have a son, and he will be a great hero.', 'happy'),
        N('Sam breathes out. He has held that breath for years.'),
      ],
      [
        ask(
          2,
          'literacy',
          'rhymes: star and far',
          'RF.K.2',
          [N('Which word rhymes with star: far or sun?')],
          [
            o('Far.', [N('Yes! Star, far, car, jar!')], true),
            o('Sun.', [N('Sun does not rhyme. Star, far, car: they end the same!')]),
          ],
          'Practised rhyming: star, far, car, jar.',
        ),
      ],
    ),
    sc(
      'a27-14-stars-done',
      [
        SA('It is a big surprise, but I gave my word. So it shall be done.'),
        SA('Tell him I read every line.', 'soft'),
      ],
      [
        ask(
          0,
          'sel',
          'a promise means doing what you said',
          'CASEL: Responsible decision-making',
          [N('Sam keeps his promise. What is a promise?')],
          [
            o(
              'Doing what you said you would.',
              [N('Yes! A promise means we do what we said.')],
              true,
            ),
            o('Forgetting.', [N('A promise means we do what we said we would.')]),
          ],
          'Talked about promises: doing what you said you would do.',
        ),
      ],
    ),
    sc(
      'a27-14-kabul',
      [
        N('Zal gives half his money to people in need.'),
        N('Then he sends you to Rudaba.'),
        N('In the family rooms, the queen has found a gift meant for Zal.'),
        N('Bad news comes. The Shah has heard about Zal and Rudaba.', 'shock'),
        N('Long ago, a cruel king was in Rudaba’s family.'),
        N('So the Shah is cross. Soldiers may march.'),
        SK('Do not be afraid. I will talk to Sam myself.', 'soft'),
      ],
      [
        ask(
          0,
          'maths',
          'halves',
          '1.G.A.3',
          [
            N(
              'Zal gave half his money away. Cut a flatbread into two equal parts. Each part is a...?',
            ),
          ],
          [
            o('A half.', [N('Yes! Two equal parts, and each is a half.')], true),
            o('A whole.', [N('A whole is all of it. Each equal part is a half.')]),
          ],
          'Learned that one of two equal parts is a half.',
        ),
      ],
    ),
    sc(
      'a27-14-kabul-done',
      [
        RU('Mother, I am sorry I did not tell you.', 'sad'),
        SK('So am I. We will talk later. Come with me, messenger.'),
      ],
      [
        ask(
          1,
          'sel',
          'telling a trusted grown-up the truth',
          'CASEL: Relationship skills',
          [N('Rudaba said sorry for keeping a secret. Who can you tell when something is hard?')],
          [
            o('A parent.', [N('A parent is a good person to tell.')]),
            o('A teacher.', [N('A teacher can help, too.')]),
            o('A grown-up I trust.', [N('Yes. Any grown-up you trust can help.')]),
          ],
          'Named a trusted grown-up to tell when something is hard.',
        ),
      ],
    ),
    sc(
      'a27-14-embassy',
      [
        N('Sindokht rides out with gifts: gold, horses, elephants, rugs.'),
        N('She meets Sam. She asks him to promise to keep her family safe.'),
        N('Sam promises.'),
        SK('Be fair to everyone. Nobody should be blamed for what their family did.'),
        SA('Messenger, you were there when my son was born. Is Rudaba good for him?'),
      ],
      [
        ask(
          3,
          'social-studies',
          'fairness: nobody is to blame for what their family did',
          'D2.Civ.8.K-2',
          [N('Is it fair to blame someone for what their family did long ago?')],
          [
            o('No. Not fair.', [N('Right. Each person is their own person.')], true),
            o('Yes.', [N('No. Each person is their own person.')]),
          ],
          'Talked about fairness: nobody should be blamed for what their family did.',
        ),
      ],
      [
        ch('worthy', '“She asked me seven questions about him before she saw him.”', [
          SA('Seven! I did not ask one, for years.', 'sad'),
        ]),
        ch('boast', '“Her maids won a boasting match against his page.”', [
          SA('Then she has good people round her.', 'happy'),
        ]),
        ch('ask', '“Ask him yourself.”', [SA('Yes. I have learned that one.', 'soft')]),
      ],
    ),
    sc(
      'a27-14-embassy-done',
      [SA('My promise is safe. Kabul is safe. Your family is safe.')],
      [
        ask(
          0,
          'literacy',
          'first sounds: s for Sam, safe, soup',
          'RF.K.2',
          [N('Sam and safe begin with s, s, s. Which starts the same: soup or hat?')],
          [
            o('Soup.', [N('Yes! Sam, safe, soup: s, s, s!')], true),
            o('Hat.', [N('Hat begins with h. Sam, safe and soup begin with s!')]),
          ],
          'Practised hearing the first sound s in Sam, safe and soup.',
        ),
      ],
    ),
    sc(
      'a27-14-complete',
      [
        N('Sindokht rides home, shining like the moon.'),
        N('Sam writes to the Shah. Zal takes the letter to court.'),
        N('Nubbin rides home on an elephant! It comes down for a pomegranate.'),
      ],
      [
        notice(
          2,
          'social-studies',
          'pomegranates have grown in Iran for thousands of years',
          'D2.Geo.2.K-2',
          [
            N('Pomegranates have grown in Iran for thousands of years.'),
            N('People there love their juicy red seeds.'),
            N('(Pretend to eat one: yum!)'),
          ],
          'Heard that pomegranates have grown in Iran for thousands of years.',
        ),
      ],
    ),
  ],
);

// ================================================================== A27-15 The Riddles
const A15: EduQuest = quest(
  'a27-15',
  'The Riddles',
  {
    'a27-15-s1': {
      goal: 'Sit in the circle while the wise men ask Zal.',
      hint: 'Watch and listen. Guess before he answers.',
    },
    'a27-15-s2': {
      goal: 'Hear the last and hardest riddle.',
      hint: 'The oldest wise man asks last.',
    },
    'a27-15-s3': {
      goal: 'Watch Zal at the trials.',
      hint: 'Stand at the edge of the field.',
    },
  },
  [
    sc(
      'a27-15-riddles',
      [
        N('At court, the Shah wants to see what Zal knows.'),
        N('Wise men sit in a circle, with Zal in the middle.'),
        MO('Twelve trees. Thirty branches each. What are they?'),
        ZA('The twelve months of the year!'),
        MO('Two horses race for ever, one black, one white.'),
        ZA('Night and day, chasing each other.'),
        MO('Thirty riders. One goes missing. Then all come back. What?'),
      ],
      [
        ask(
          6,
          'science',
          'the moon shines at night and looks different over the month',
          '1-ESS1-1',
          [N('The moon gets thin, then round again. Which shines at night: the moon or the sun?')],
          [
            o('The moon.', [N('Yes! The moon shines at night.')], true),
            o('The sun.', [N('The sun shines in the day. The moon shines at night.')]),
          ],
          'Learned that the moon shines at night, and changes shape through the month.',
        ),
      ],
      [
        ch('moon', 'Whisper: “The moon.”', [
          ZA('The days of the month! The moon gets thin, then comes back round.'),
          N('You were nearly right. He is pleased.'),
        ]),
        ch('stars', 'Whisper: “The stars.”', [
          ZA('The days of the month! The moon gets thin, then comes back round.'),
          N('Not the stars. You were far off, and you enjoyed it anyway.'),
        ]),
        ch('quiet', 'Keep quiet, and let him think.', [
          ZA('The days of the month! The moon gets thin, then comes back round.'),
        ]),
      ],
    ),
    sc(
      'a27-15-riddles-done',
      [N('Three riddles, three answers. He did not stop to think.')],
      [
        doit(
          0,
          'maths',
          'count the twelve months',
          'K.CC.A.1',
          'edu:count:months:12',
          [N('Twelve months in a year. (Count along: 1, 2, 3, up to 12.)')],
          'Counted the twelve months of the year.',
        ),
      ],
    ),
    sc(
      'a27-15-hardest',
      [
        N('The oldest wise man asks the last riddle. It is about time.'),
        MO('A green garden. A man with a sickle cuts it all, dry and green.'),
        ZA('That is time. It goes on for everyone, young and old.'),
        ZA('So we should be kind while we can.', 'soft'),
        N('Nobody speaks. Then everyone talks at once!'),
      ],
      [
        ask(
          3,
          'literacy',
          'riddles: guessing from clues',
          'ELOF: Language and Communication',
          [N('Here is a riddle. I am round, and I light the night. What am I?')],
          [
            o('The moon.', [N('Yes! The moon is round and lights the night.')], true),
            o('A shoe.', [N('Not a shoe! Round, lights the night: the moon.')]),
          ],
          'Solved a riddle by guessing from clues.',
        ),
      ],
    ),
    sc(
      'a27-15-hardest-done',
      [SH('I would have needed a week and a nap.', 'happy')],
      [
        ask(
          0,
          'sel',
          'noticing kind things we do',
          'CASEL: Social awareness',
          [N('Zal said: be kind while we can. What kind thing did you do today?')],
          [
            o('I shared.', [N('Sharing is kind!')]),
            o('I helped someone.', [N('Helping is kind!')]),
            o('I smiled.', [N('A smile is kind, too!')]),
          ],
          'Named a kind thing they did.',
        ),
      ],
    ),
    sc(
      'a27-15-trials',
      [
        N('The next morning the champions gather. The Shah watches.'),
        N('Zal shoots far and straight.'),
        N('He wrestles a champion, gently, and wins.'),
        N('The crowd claps. Nubbin claps loudest, standing on your head!'),
        ZA('I learned on the peak. The chicks kept dropping things over the edge.', 'happy'),
        N('The champion asks Zal to teach him.'),
      ],
      [
        ask(
          4,
          'health',
          'moving and playing makes us strong',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('Zal got strong by practising. What helps our bodies get strong?')],
          [
            o(
              'Moving and playing.',
              [N('Yes! Running, climbing and playing make us strong.')],
              true,
            ),
            o('Sitting all day.', [N('Moving and playing make us strong. Let us run!')]),
          ],
          'Learned that moving and playing helps our bodies get strong.',
        ),
      ],
    ),
    sc(
      'a27-15-trials-done',
      [SH('I am sure. He has brains and arms both.')],
      [
        ask(
          0,
          'maths',
          'compare numbers: which is more',
          'K.CC.C.6',
          [N('One arrow flew 6 steps. Another flew 2 steps. Which went further?')],
          [
            o('The 6 steps.', [N('Yes! Six is more than two.')], true),
            o('The 2 steps.', [N('Count: six is more than two. Six went further.')]),
          ],
          'Compared 6 and 2 to say which is more.',
        ),
      ],
    ),
    sc(
      'a27-15-complete',
      [
        N('The Shah writes to Sam. A rider carries the letter.'),
        SH('Go and marry your princess. Bring me something from the feast!', 'happy'),
        N('Sam reads the letter, and looks ten years younger.'),
        N('Nubbin keeps a royal napkin.'),
      ],
      [
        notice(
          0,
          'social-studies',
          'long ago, Persian kings built a Royal Road with riders who swapped horses',
          'D2.His.2.K-2',
          [
            N('Long ago, Persian kings built a Royal Road.'),
            N('Riders swapped tired horses for fresh ones, so letters travelled fast.'),
          ],
          'Heard that long ago in Persia, relay riders on a Royal Road carried letters quickly.',
        ),
      ],
    ),
  ],
);

// ================================================================== A27-16 The Wedding
const A16: EduQuest = quest(
  'a27-16',
  'The Wedding',
  {
    'a27-16-s1': {
      goal: 'Ride into Kabul with Sam and Zal.',
      hint: 'The whole city has come out. Stay near Sam.',
    },
    'a27-16-s2': {
      goal: 'Bring your gift to the wedding feast.',
      hint: 'Find your place at the long table.',
    },
  },
  [
    sc(
      'a27-16-arrival',
      [
        N('Kabul is hung with silk banners. Drums, harps and cymbals play.'),
        N('Rose-water sprinkles the streets.'),
        N('Mehrab puts a jewelled crown on Zal’s white hair.'),
        SA('How long will you hide Rudaba from me?', 'happy'),
        SK('Hide her? She is our sun. What will you give to see her?', 'happy'),
        SA('Anything you like! Name it.'),
        N('Sindokht laughs, and leads him in.'),
      ],
      [
        ask(
          1,
          'art',
          'naming shapes: a triangle has three corners',
          'K.G.A.2',
          [N('Banners can be triangles. Which shape has three corners: a triangle or a circle?')],
          [
            o('A triangle.', [N('Yes! A triangle has three corners.')], true),
            o('A circle.', [N('A circle is round, with no corners. A triangle has three.')]),
          ],
          'Named a triangle as the shape with three corners.',
        ),
      ],
    ),
    sc(
      'a27-16-arrival-done',
      [N('Sam looks at Rudaba. He has no words.'), SA('I have never had so few words.', 'happy')],
      [
        ask(
          1,
          'sel',
          'noticing how happy feels in the body',
          'CASEL: Self-awareness',
          [N('Sam is so happy he has no words. How does happy feel in your body?')],
          [
            o('Bubbly.', [N('Bubbly! Happy fizzes inside.')]),
            o('Warm.', [N('Warm, like sunshine. Happy can feel like that.')]),
            o('Wiggly.', [N('Wiggly! Happy makes us bounce.')]),
          ],
          'Named how happiness feels in the body.',
        ),
      ],
    ),
    sc(
      'a27-16-feast',
      [
        N('Zal and Rudaba sit on one throne.'),
        N('The feast lasts seven days!'),
        N('Nubbin is not pacing itself.'),
        RU('You carried every word. Thank you.'),
        ZA('What did you bring us? You may bring nothing.'),
      ],
      [
        doit(
          2,
          'maths',
          'count seven days',
          'K.CC.B.5',
          'edu:count:days:7',
          [N('Seven days of feast. (Count with me, one for each day: 1 to 7.)')],
          'Counted seven days of the feast.',
        ),
      ],
      [
        ch('down', 'Give them a twist of chick-down from the nest.', [
          N('Soft white down, from the chicks. Zal holds it to his face.'),
          ZA('It smells of sandalwood. It smells of home.', 'soft'),
        ]),
        ch('dance', 'Let your Nubbin dance.', [
          N('Nubbin dances the chick dance, with a lot of flapping.'),
        ]),
        ch('story', 'Tell them about the night in the storm.', [
          N('You tell them about the basket and the storm.'),
          RU('I am glad somebody kind was there.', 'soft'),
        ]),
      ],
    ),
    sc(
      'a27-16-feast-done',
      [N('Sindokht fills your plate. Then Nubbin’s plate. Then again!')],
      [
        ask(
          0,
          'science',
          'down feathers keep chicks warm',
          'ELOF: Scientific Reasoning',
          [N('Soft down keeps chicks warm. Is down good for a cold night, or a hot day?')],
          [
            o(
              'A cold night.',
              [N('Yes! Down traps warm air, so it is good on a cold night.')],
              true,
            ),
            o('A hot day.', [N('Down is too warm on a hot day. It is for cold nights.')]),
          ],
          'Learned that soft down feathers keep young birds warm.',
        ),
      ],
    ),
    sc(
      'a27-16-complete',
      [
        N('After a month, everyone goes home to Sistan.'),
        N('Zal rules with patience and fairness.'),
        N('Rudaba sits beside him. He puts a gold crown on her black hair.'),
        N('Nubbin has eaten its weight in wedding cake. It sleeps two days.'),
      ],
      [
        notice(
          2,
          'social-studies',
          'Persian weddings today have a special spread of flowers, candles and sweets',
          'D2.His.2.K-2',
          [
            N('In Iran today, weddings still have a lovely cloth spread on the floor.'),
            N('It holds flowers, candles and sweets.'),
          ],
          'Heard that Persian weddings today have a special spread with flowers, candles and sweets.',
        ),
      ],
    ),
  ],
);

// ================================================================== A27-17 The Feather in the Fire
const A17: EduQuest = quest(
  'a27-17',
  'The Feather in the Fire',
  {
    'a27-17-s1': {
      goal: 'Stay with Zal while Rudaba rests.',
      hint: 'Sit with him in the hall.',
    },
    'a27-17-s2': {
      goal: 'Watch Zal put the feather on the fire.',
      hint: 'The brazier in the hall is lit.',
    },
    'a27-17-s3': {
      goal: 'Go out to the Simurgh.',
      hint: 'Go out into the courtyard with Zal.',
    },
  },
  [
    sc(
      'a27-17-labour',
      [
        N('A year goes by. Rudaba is having a baby.'),
        N('It is taking a long time, and she is very tired.'),
        N('Zal sits outside with his head in his hands.', 'sad'),
        ZA('I answered every riddle. I do not know the answer to this.', 'sad'),
        N('Nubbin leans on his arm.'),
        N('Zal looks at the box on the shelf.'),
        ZA('The feather!', 'shock'),
      ],
      [
        ask(
          4,
          'sel',
          'a friend nearby helps when we are worried',
          'CASEL: Social awareness',
          [N('Zal is very worried. What helps a worried person?')],
          [
            o('A friend nearby.', [N('Yes! A friend close by helps a worried heart.')], true),
            o('Being alone.', [N('Being alone can feel hard. A friend nearby helps.')]),
          ],
          'Talked about how a friend nearby helps when we are worried.',
        ),
      ],
    ),
    sc(
      'a27-17-labour-done',
      [N('He takes the feather from the box. It is grey and gold, long as his arm. It is dry.')],
      [
        ask(
          0,
          'maths',
          'compare lengths: longer and shorter',
          'K.MD.A.2',
          [
            N(
              'The feather is as long as Zal’s arm. Which is longer: the feather or your little finger?',
            ),
          ],
          [
            o('The feather.', [N('Yes! A feather as long as an arm is much longer.')], true),
            o('My little finger.', [
              N('Look again. The feather is as long as an arm. It is longer.'),
            ]),
          ],
          'Compared two lengths: a feather as long as an arm is longer than a finger.',
        ),
      ],
    ),
    sc(
      'a27-17-fire',
      [
        N('Zal goes straight to the fire in the middle of the hall.'),
        ZA('She said: burn it on the day of need. This is the day.'),
        N('He puts the feather on the fire, with a steady hand.'),
        N('It burns slowly, like a candle. It smells of sandalwood.'),
        N('Outside, all at once, the light goes strange.'),
      ],
      [
        ask(
          3,
          'science',
          'fire gives heat and light; fire is for grown-ups',
          'ELOF: Scientific Reasoning',
          [N('Fire gives heat and light. Who should light a fire: a grown-up, or a child?')],
          [
            o('A grown-up.', [N('Yes! Fire is only for grown-ups. Children stay back.')], true),
            o('A child.', [N('Fire is only for grown-ups. Children stay back and stay safe.')]),
          ],
          'Learned that fire gives heat and light, and that only grown-ups should light it.',
        ),
      ],
    ),
    sc(
      'a27-17-fire-done',
      [N('A sound like a great wind fills the air. Every shutter rattles.')],
      [
        doit(
          0,
          'literacy',
          'sound words: rattle',
          'RL.1.4',
          'edu:say:sound-word:rattle',
          [N('Shutters rattle! Say it with me: rattle, rattle, rattle!')],
          'Said the sound word rattle and linked it to what shutters do in a wind.',
        ),
      ],
    ),
    sc(
      'a27-17-wings',
      [
        N('The sky over Sistan goes dark with wings. The whole city looks up.'),
        N('The Simurgh lands in the courtyard.'),
        N('She bends her great head down to Zal.'),
        SI('Why do you cry, my son?', 'soft'),
        ZA('Rudaba cannot rest. It has been days.', 'sad'),
        SI('Be easy. I came to help.', 'soft'),
        N('She tells him what to do, slowly and plainly.'),
      ],
      [
        ask(
          5,
          'sel',
          'asking for help is okay',
          'CASEL: Relationship skills',
          [N('Zal asked for help when the problem was too big. Is asking for help okay?')],
          [
            o('Yes!', [N('Yes. Asking for help is brave, and it is okay.')], true),
            o('No.', [N('It is okay to ask. Everybody needs help sometimes.')]),
          ],
          'Talked about how asking for help is okay and brave.',
        ),
      ],
      [
        ch('thank', 'Thank her for coming.', [SI('I said I would come. I keep my word.', 'soft')]),
        ch('nubbin', 'Let your Nubbin go to her.', [
          N('Nubbin runs to her and burrows under her wing. She lets it.'),
        ]),
      ],
    ),
    sc(
      'a27-17-wings-done',
      [N('The Simurgh waits in the courtyard. You sit under her wing, like old times.')],
      [
        doit(
          0,
          'maths',
          'count two wings',
          'K.CC.B.5',
          'edu:count:wings:2',
          [N('A bird has two wings. (Count them: one, two.)')],
          'Counted two wings.',
        ),
      ],
    ),
    sc(
      'a27-17-complete',
      [
        N('Near morning there is a new sound: a small, loud cry!'),
        N('The baby is big and strong.'),
        RU('His name is Rostam. It means delivered. The pain is over, and here he is!', 'happy'),
        N('A rider takes a silk doll of the baby to Sam.'),
        N('Zal holds the baby up to the Simurgh. Neither is afraid.'),
        N('The last thing you see: Zal laughing, with the baby held high.'),
        N('A small beak peeks over the wall. The smallest chick came too!'),
        N('It waits at the back. Very politely.'),
        N('A feather drifts down. The Simurgh lets it stay.'),
        N('You are back in the Grove. Nubbin wants second breakfast!'),
      ],
      [
        ask(
          2,
          'literacy',
          'first sounds: r for Rostam and rose',
          'RF.K.2',
          [N('Rostam begins with r, r, r. Which starts like Rostam: rose or sun?')],
          [
            o('Rose.', [N('Yes! Rostam, rose: r, r, r!')], true),
            o('Sun.', [N('Sun begins with s. Rostam and rose both begin with r!')]),
          ],
          'Practised hearing the first sound r in Rostam and rose.',
        ),
      ],
    ),
  ],
);

// ================================================================== Variant scenes
/**
 * One EduScene per ATLAS_A27_VARIANTS entry. Each has the same lesson domain as the scene it
 * replaces, so the order of domains holds on every a27-feather path. The margin note and the
 * Corvin line (feelings) differ from the scenes beside them.
 */
export const EDU_A27_SPROUT_VARIANTS: EduScene[] = [
  // s24Done: plays once after a27-04-complete
  sc(
    'a27-margin-hazel',
    [
      N('Nova’s atlas lies open at the big nest.'),
      N('In the margin, there is a pencil note. You know the writing.'),
      N('“White hair at birth. I’d have kept him.”', 'soft'),
      N('And under it, one letter: H.'),
      N('Your Nubbin puts one paw on the little white head in the picture.'),
    ],
    [
      ask(
        3,
        'sel',
        'loving someone just as they are',
        'CASEL: Social awareness',
        [N('Hazel would have kept the baby, and loved him. Who do you love just as they are?')],
        [
          o('My family.', [N('Family is a wonderful thing to love.')]),
          o('My friend.', [N('A friend loved just as they are is a lucky friend.')]),
          o('My pet.', [N('Pets love us just as we are, too.')]),
        ],
        'Named someone they love just as they are, prompted by Hazel’s margin note.',
      ),
    ],
  ),
  // corvinGate = family: one line after a27-07-foot#5
  sc(
    'a27-07-corvin',
    [N('He reminds you of a grumpy man at a stuck gate, who came back.', 'soft')],
    [
      ask(
        0,
        'sel',
        'a grumpy person may be lonely; a hello helps',
        'CASEL: Social awareness',
        [N('Some grumpy people are lonely inside. What could you do for a lonely person?')],
        [
          o('Say hello.', [N('Yes! A hello helps a lonely person feel seen.')], true),
          o('Run away.', [N('A hello helps a lonely person feel seen. It is a kind start.')]),
        ],
        'Thought about how to be kind to a lonely, grumpy person.',
      ),
    ],
  ),
  // a27-feather = sat
  sc(
    'a27-09-descent-sat',
    [
      N('The Simurgh carries you both down through the cloud.'),
      N('She sets you on the slope above the army, and watches.'),
      N('Sam is still on his knees. He hears the stones move.'),
      N('The young man walks down slowly, taking his time.'),
      N('Sam gets up. He does not climb, and he does not call out. He waits.', 'soft'),
      YO('You waited for me.'),
      N('Sam nods and nods. He cannot speak.'),
    ],
    [
      ask(
        5,
        'sel',
        'waiting calmly is a kind thing to do',
        'CASEL: Self-management',
        [N('Sam waited, and did not rush him. How can you wait calmly?')],
        [
          o('Breathe slowly.', [N('Yes! Slow breaths help us wait calmly.')], true),
          o('Stamp my feet.', [N('Stamping is hard on the feet! Slow breaths help us wait.')]),
        ],
        'Talked about waiting calmly, using slow breaths.',
      ),
    ],
  ),
  // a27-feather = night
  sc(
    'a27-09-descent-night',
    [
      N('In the grey of the morning, the Simurgh carries you both down.'),
      N('She sets you on the slope above the army, and watches.'),
      N('Sam is still on his knees. He has been there all night, in the cold.'),
      N('The young man comes down, rested, with the smell of the nest on him.'),
      N('Sam tries to speak. His voice is gone. He prayed all night.', 'sad'),
      YO('You stayed. All night, on the stones.'),
      N('Sam can only nod. That is all he needs to say.'),
    ],
    [
      ask(
        5,
        'sel',
        'staying with someone shows we care',
        'CASEL: Relationship skills',
        [
          N(
            'Sam stayed all night to show he was sorry. Staying shows we care. Who stays with you?',
          ),
        ],
        [
          o('A parent.', [N('A parent who stays is a gift.')]),
          o('A friend.', [N('A friend who stays is a treasure.')]),
          o('My pet.', [N('A pet who stays is a loyal friend.')]),
        ],
        'Named someone who stays with them, and talked about how staying shows love.',
      ),
    ],
  ),
  // a27-word = taught-sorry (A27-5): replaces a27-09-oath
  sc(
    'a27-09-oath-taught-sorry',
    [
      N('Sam bows low to the great bird.'),
      SA('I was wrong. I was afraid, and I was wrong.', 'sad'),
      SA('I am sorry. I do not know a better way to say it.', 'sad'),
      YO('So that is how sorry sounds. I wondered.', 'soft'),
      SA('I promise: I will never be hard to you again.'),
      N('He gives his son a name: Zal. It means the old one, for the white hair.'),
      N('Sam says it with pride.'),
      ZA('Zal. I like it!', 'happy'),
    ],
    [
      ask(
        7,
        'literacy',
        'first sounds: z for Zal and zebra',
        'RF.K.2',
        [N('Zal begins with z, z, z. Which starts like Zal: zebra or sun?')],
        [
          o('Zebra.', [N('Yes! Zal, zebra: z, z, z!')], true),
          o('Sun.', [N('Sun begins with s. Zal and zebra both begin with z!')]),
        ],
        'Practised hearing the first sound z in Zal and zebra.',
      ),
    ],
    [
      ch('clap', 'Clap.', [N('You clap. Your Nubbin claps. So does the whole army!')]),
      ch('bow', 'Bow to Zal.', [ZA('You do not bow to me. You are my nestmate.', 'happy')]),
    ],
  ),
  // a27-word = taught-home (A27-5): replaces a27-09-road
  sc(
    'a27-09-road-taught-home',
    [
      N('The army goes home with drums and trumpets.'),
      N('Boom! Toot! Crash!'),
      N('Zal rides beside his father. You ride on the baggage.'),
      ZA('It is so loud!'),
      SA('Only when the world is happy.', 'happy'),
      ZA('Is Sistan home now? The place I come back to?', 'think'),
      SA('Yes. It is louder than a nest. But yes.', 'soft'),
      N('High above, a great bird turns once, and goes home.', 'soft'),
    ],
    [
      doit(
        1,
        'music',
        'sound is made by shaking: vibrations',
        '1-PS4-1',
        'edu:feel:throat:hum',
        [N('Drums shake to make sound. Touch your throat and hum. Feel the shake?')],
        'Felt a vibration in the throat while humming, and linked it to how sound is made.',
      ),
    ],
  ),
  // a27-word = taught-friend (A27-5): replaces a27-09-complete
  sc(
    'a27-09-complete-taught-friend',
    [
      N('People throw flowers at the gate. Zal catches a rose.'),
      N('Your Nubbin eats it! Zal laughs and laughs.'),
      SA('You laugh with your whole self.', 'soft'),
      ZA('The chicks taught me.'),
      ZA('Father, this is my friend. A friend is someone who stays.', 'happy'),
      SA('Then your friend is family now.'),
      ZA('Oh no. Then I need another word!', 'think'),
    ],
    [
      ask(
        1,
        'sel',
        'noticing how happy feels in the body',
        'CASEL: Self-awareness',
        [N('Zal laughs with his whole self. How does your body feel when you laugh?')],
        [
          o('Wiggly.', [N('Wiggly! Laughing shakes us all over.')]),
          o('Warm.', [N('Warm and glowing. That is a happy body.')]),
          o('Tickly.', [N('Tickly! Laughing is full of tickles.')]),
        ],
        'Named how laughing feels in the body.',
      ),
    ],
  ),
  // a27-feather = sat
  sc(
    'a27-14-letter-sat',
    [
      N('In the morning, Zal asks a scribe to write a letter.'),
      ZA('Father. You left me on a mountain. A bird raised me.'),
      ZA('I do not say it to hurt you. I say it because it is true.'),
      ZA('I have one thing to ask. I love Rudaba. I want to marry her.'),
      ZA('I learned to wait on a mountain. I can wait for you.', 'soft'),
      N('He gives the letter to you.'),
    ],
    [
      ask(
        4,
        'literacy',
        'a letter has a hello and a goodbye',
        'ELOF: Literacy',
        [
          N(
            'Zal wrote a letter to say a hard thing, kindly. What comes first in a letter: hello or goodbye?',
          ),
        ],
        [
          o('Hello.', [N('Yes! A letter starts with hello, and ends with goodbye.')], true),
          o('Goodbye.', [N('Goodbye comes at the end. A letter starts with hello.')]),
        ],
        'Learned that a letter begins with a greeting and ends with a goodbye.',
      ),
    ],
  ),
  // a27-feather = night
  sc(
    'a27-14-letter-night',
    [
      N('In the morning, Zal asks a scribe to write a letter.'),
      ZA('Father. You left me on a mountain. A bird raised me.'),
      ZA('I do not say it to hurt you. I say it because it is true.'),
      ZA('I have one thing to ask. I love Rudaba. I want to marry her.'),
      ZA('I made you wait one night. You made me wait many.', 'happy'),
      ZA('Now we have both waited. That is fair.'),
      N('He gives the letter to you.'),
    ],
    [
      ask(
        5,
        'literacy',
        'a letter has a hello and a goodbye',
        'ELOF: Literacy',
        [
          N(
            'Zal wrote a letter to say a hard thing, kindly. What comes first in a letter: hello or goodbye?',
          ),
        ],
        [
          o('Hello.', [N('Yes! A letter starts with hello, and ends with goodbye.')], true),
          o('Goodbye.', [N('Goodbye comes at the end. A letter starts with hello.')]),
        ],
        'Learned that a letter begins with a greeting and ends with a goodbye.',
      ),
    ],
  ),
  // a27-feather = sat
  sc(
    'a27-17-fire-sat',
    [
      N('Zal goes to the fire in the middle of the hall. He stops.'),
      ZA('She said: burn it on the day of need. This is the day.'),
      N('He holds the feather a long moment. You do not hurry him.'),
      N('Then he holds out his other hand to you.'),
      ZA('Hold my hand. You sat with me. Sit with me now.', 'soft'),
      N('Zal lays the feather on the fire. You hold his other hand.'),
      N('He leans on your shoulder.'),
      N('It burns slowly, like a candle. It smells of sandalwood.'),
      N('Outside, all at once, the light goes strange.'),
    ],
    [
      ask(
        7,
        'science',
        'fire gives heat and light; fire is for grown-ups',
        'ELOF: Scientific Reasoning',
        [N('Fire gives heat and light. Who should light a fire: a grown-up, or a child?')],
        [
          o('A grown-up.', [N('Yes! Fire is only for grown-ups. Children stay back.')], true),
          o('A child.', [N('Fire is only for grown-ups. Children stay back and stay safe.')]),
        ],
        'Learned that fire gives heat and light, and that only grown-ups should light it.',
      ),
    ],
  ),
  // a27-feather = night
  sc(
    'a27-17-fire-night',
    [
      N('Zal goes to the fire in the middle of the hall.'),
      ZA('She said: burn it on the day of need. This is the day.'),
      ZA('She gave me a night, once. I hope she has one more.', 'soft'),
      N('He lays the feather on the fire. Nubbin holds his boot.'),
      N('It burns slowly, like a candle. It smells of sandalwood.'),
      N('Outside, all at once, the light goes strange.'),
    ],
    [
      ask(
        4,
        'science',
        'fire gives heat and light; fire is for grown-ups',
        'ELOF: Scientific Reasoning',
        [N('Fire gives heat and light. Who should light a fire: a grown-up, or a child?')],
        [
          o('A grown-up.', [N('Yes! Fire is only for grown-ups. Children stay back.')], true),
          o('A child.', [N('Fire is only for grown-ups. Children stay back and stay safe.')]),
        ],
        'Learned that fire gives heat and light, and that only grown-ups should light it.',
      ),
    ],
  ),
  // a27-feather = sat
  sc(
    'a27-17-complete-sat',
    [
      N('Near morning there is a new sound: a small, loud cry!'),
      N('The baby is big and strong.'),
      RU('His name is Rostam. It means delivered. The pain is over, and here he is!', 'happy'),
      N('A rider takes a silk doll of the baby to Sam.'),
      N('Zal comes out with his son, and sits beside you on the step.'),
      N('You sit there together, and let the morning come.'),
      N('Days later, far away, Sam opens a parcel. Inside is a little silk doll.'),
      N('The last thing you see: Sam, holding the doll, crying happy tears.', 'soft'),
      N('A small beak peeks over the wall. The smallest chick came too!'),
      N('It waits at the back. Very politely.'),
      N('A feather drifts down. The Simurgh lets it stay.'),
      N('You are back in the Grove. Nubbin wants second breakfast!'),
    ],
    [
      ask(
        2,
        'literacy',
        'first sounds: r for Rostam and rose',
        'RF.K.2',
        [N('Rostam begins with r, r, r. Which starts like Rostam: rose or sun?')],
        [
          o('Rose.', [N('Yes! Rostam, rose: r, r, r!')], true),
          o('Sun.', [N('Sun begins with s. Rostam and rose both begin with r!')]),
        ],
        'Practised hearing the first sound r in Rostam and rose.',
      ),
    ],
  ),
  // a27-feather = night
  sc(
    'a27-17-complete-night',
    [
      N('Near morning there is a new sound: a small, loud cry!'),
      N('The baby is big and strong.'),
      RU('His name is Rostam. It means delivered. The pain is over, and here he is!', 'happy'),
      N('A rider takes a silk doll of the baby to Sam.'),
      N('Zal holds the baby up to the Simurgh.'),
      N('She looks at the baby for a long time. Then she looks at you.'),
      SI('You were right to give him the night.', 'soft'),
      N('She spreads her wings and goes up.'),
      N('The last thing you see: the Simurgh circling the house, then turning for home.'),
      N('A small beak peeks over the wall. The smallest chick came too!'),
      N('It waits at the back. Very politely.'),
      N('A feather drifts down. The Simurgh lets it stay.'),
      N('You are back in the Grove. Nubbin wants second breakfast!'),
    ],
    [
      ask(
        2,
        'literacy',
        'first sounds: r for Rostam and rose',
        'RF.K.2',
        [N('Rostam begins with r, r, r. Which starts like Rostam: rose or sun?')],
        [
          o('Rose.', [N('Yes! Rostam, rose: r, r, r!')], true),
          o('Sun.', [N('Sun begins with s. Rostam and rose both begin with r!')]),
        ],
        'Practised hearing the first sound r in Rostam and rose.',
      ),
    ],
  ),
  // Sable's trust stage: bonded
  sc(
    'a27-close-sable-bonded',
    [
      N('You shut the atlas. You put the feather in a glass on the mantel.'),
      N('Sable is curled up asleep right under it.'),
      N('The tip of the feather moves when she breathes.', 'soft'),
      N('You do not wake her.'),
    ],
    [
      ask(
        3,
        'sel',
        'being gentle with a shy friend',
        'CASEL: Relationship skills',
        [N('Sable is shy. How can you be a good friend to a shy animal?')],
        [
          o(
            'Be quiet and gentle.',
            [N('Yes! Quiet and gentle helps shy friends trust you.')],
            true,
          ),
          o('Grab her.', [
            N('Grabbing scares a shy friend. Quiet and gentle helps her trust you.'),
          ]),
        ],
        'Talked about being quiet and gentle with a shy animal.',
      ),
    ],
  ),
  // Sable's trust stage: met, not bonded
  sc(
    'a27-close-sable-wary',
    [
      N('You shut the atlas. The feather slips from your hand.'),
      N('You find it by the long grass. Sable watches from nearby.'),
      N('She does not touch it. She does not go.'),
      N('When you pick it up, her eyes follow it to the mantel.', 'soft'),
    ],
    [
      ask(
        3,
        'sel',
        'trust takes time; patience and kindness help',
        'CASEL: Relationship skills',
        [N('Sable is still watching. Trust takes time. What can we do while we wait?')],
        [
          o('Be patient and kind.', [N('Yes! Patience and kindness help trust grow.')], true),
          o('Hurry her.', [
            N('Hurrying scares shy friends. Patience and kindness help trust grow.'),
          ]),
        ],
        'Talked about being patient and kind while a shy animal learns to trust.',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A27_SPROUT: EduQuest[] = [
  A1,
  A2,
  A3,
  A4,
  A5,
  A6,
  A7,
  A8,
  A9,
  A10,
  A11,
  A12,
  A13,
  A14,
  A15,
  A16,
  A17,
];

/** Every `edu:` check string used by the lessons above. */
export const CHECKS: string[] = [
  'edu:clap:count:5',
  'edu:clap:syllables:baby',
  'edu:clap:syllables:kettle',
  'edu:count:chicks:4',
  'edu:count:clothes:3',
  'edu:count:clouds:3',
  'edu:count:cups:5',
  'edu:count:days:4',
  'edu:count:days:7',
  'edu:count:fingers:5',
  'edu:count:lamps:5',
  'edu:count:months:12',
  'edu:count:petals:5',
  'edu:count:questions:7',
  'edu:count:wings:2',
  'edu:feel:throat:hum',
  'edu:say:sound-word:rattle',
  'edu:say:sound-word:whoosh',
  'edu:trace:shape:rectangle',
];
