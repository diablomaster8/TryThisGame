/**
 * The Learning Grove, sprout band (ages 3–6, read aloud by a grown-up): Atlas page A14,
 * Homecoming (Homer’s Odyssey, Greece).
 *
 * Source: atlas-a14.ts (ATLAS_A14 and A14_VARIANTS). One EduScene per original scene, id
 * `sprout:<original id>`, with the same choice ids (and the `a14-name` flags on the three choices
 * of `a14-08-shout`). Every step scene, done scene, complete scene and variant has a version,
 * and each has exactly one lesson.
 *
 * What it teaches (outline: the islands and Ithaca on a map, that Homer’s poems were sung and
 * remembered, how a loom works, welcoming strangers, homecoming, and why a dog remembers
 * someone): that an island has water all round it, that stories can be sung and remembered, the
 * over-and-under pattern of weaving, being kind to a guest, saying sorry, and that a dog knows a
 * friend by smell. Around those: counting to 12, adding and taking away, first sounds and
 * rhymes, big feelings, simple science (wind, sound, floating, plants, the Sun) and caring for
 * pets.
 *
 * Left out or softened for this age (EDU-STYLE.md, “Hard things”):
 * - No quotes from Homer, Butler, any translation or any film. Every line is new.
 * - The Cyclops’s cave is a grumpy giant, a shut-in and a clever escape. Nobody is hurt on the
 *   page; the giant has “a sore eye” and cannot see. A14-8’s three choices are kept (kind,
 *   safe wording) with the same ids and flags, so no `defaultChoice` is needed.
 * - Sailors lost at sea (the six at Scylla, the crew after the Sun’s cattle) are said once,
 *   plainly and gently: “they died”, with comfort straight after. Scylla is only “a big scary
 *   shape in the cliff”.
 * - The House of the Dead (A14-11) opens with a soft note for the grown-up. Odysseus’s mum has
 *   died: “her body stopped working and it won’t start again.” She is a gentle, misty memory,
 *   and the scene ends with hugging, sitting together and telling stories about her.
 * - Argos dies (A14-16), said plainly with what it means, and the comfort follows in the same and
 *   the next scene: remembering, a memorial under the olive tree, being sad together.
 * - The suitors are “bad guests” who are scared away and don’t come back. Nobody is hurt.
 * - The gods are spoken of respectfully, as in the old stories, and no prayer is ever put in the
 *   child’s mouth.
 * - Corvin is “a lonely, grumpy man who did a wrong thing a long time ago”, and can say sorry.
 *   Hazel’s margin note is kept as a gentle note about listening for who comes.
 * - Facts used: an island is land with water all round it; Ithaca is a real island off Greece’s
 *   west coast; smoke goes up; wood floats; the Sun dries wet clothes; a plucked string
 *   wobbles and the wobble is sound; wax in ears makes sounds quiet; wool keeps sheep warm; wind
 *   is moving air; a fawn is a baby deer; a year has four seasons; the Moon changes shape over a
 *   month; roots hold a plant in the ground; dogs have a very good nose; swallows fly south for
 *   winter; a cutting grows into a new tree if it is kept wet.
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
const OD = say('a14-odysseus');
const BG = say('a14-beggar');
const TM = say('a14-telemachus');
const PN = say('a14-penelope');
const EC = say('a14-eurycleia');
const MS = say('a14-mentes');
const MR = say('a14-mentor');
const SH = say('a14-shepherd');
const AT = say('a14-athena');
const AN = say('a14-antinous');
const EM = say('a14-eurymachus');
const NE = say('a14-nestor');
const ML = say('a14-menelaus');
const HE = say('a14-helen');
const HM = say('a14-hermes');
const CA = say('a14-calypso');
const IN = say('a14-ino');
const NA = say('a14-nausicaa');
const AC = say('a14-alcinous');
const AR = say('a14-arete');
const CY = say('a14-cyclops');
const SA = say('a14-sailor');
const AE = say('a14-aeolus');
const EL = say('a14-eurylochus');
const CI = say('a14-circe');
const TI = say('a14-tiresias');
const AM = say('a14-anticlea');
const EU = say('a14-eumaeus');
const LA = say('a14-laertes');
const CV = say('corvin');

// ---------------------------------------------------------------- builders
type Beat = Omit<Lesson, 'id'>;
type Opt = NonNullable<Lesson['options']>[number];

const words = (t: string) => t.trim().split(/\s+/).length;

/**
 * Keeps every line to 14 words or fewer, as the sprout band requires: a long line is cut at
 * sentence ends into several lines by the same speaker (the mood stays on the first). `map[i]`
 * is the index of the last piece of original line i, so a lesson’s `after` can follow.
 */
const split = (lines: Line[]): { lines: Line[]; map: number[] } => {
  const out: Line[] = [];
  const map: number[] = [];
  for (const l of lines) {
    const sentences = l.text.split(/(?<=[.!?”)])\s+(?=[A-Z“(])/);
    const chunks: string[] = [];
    for (const sentence of sentences) {
      const last = chunks[chunks.length - 1];
      if (last !== undefined && words(last) + words(sentence) <= 14)
        chunks[chunks.length - 1] = `${last} ${sentence}`;
      else chunks.push(sentence);
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

/** A notice lesson: a character shares one true thing. */
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

/** One sprout scene. Lesson ids are `sprout:<of>-l<n>`, numbered in play order. */
const sc = (
  of: string,
  lines: Line[],
  beats: Beat[],
  extra: { choices?: Choice[]; defaultChoice?: string } = {},
): EduScene => {
  const cut = split(lines);
  const choices = extra.choices?.map((c) => (c.then ? { ...c, then: sp(c.then) } : c));
  return {
    id: `sprout:${of}`,
    of,
    band: 'sprout',
    lines: cut.lines,
    ...(choices ? { choices } : {}),
    ...(extra.defaultChoice ? { defaultChoice: extra.defaultChoice } : {}),
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
): EduQuest => ({
  id: `sprout:${of}`,
  of,
  band: 'sprout',
  title,
  goals,
  scenes,
});

/** A choice with its original id, label and reply. */
const ch = (id: string, label: string, then: Line[], set?: Choice['set']): Choice => ({
  id,
  label,
  ...(set ? { set } : {}),
  then,
});

// ================================================================== A14-1 The Loom
const A1: EduQuest = quest(
  'a14-01',
  'The Loom',
  {
    'a14-01-s1': {
      goal: 'Step onto the island and wait at the gate.',
      hint: 'Touch the page, then walk to the gate.',
    },
    'a14-01-s2': {
      goal: 'Sit and listen with Telemachus.',
      hint: 'Sit by the pillar, away from the noisy men.',
    },
    'a14-01-s3': {
      goal: 'Watch Penelope come down the stairs.',
      hint: 'Stand at the bottom of the stairs.',
    },
  },
  [
    sc(
      'a14-01-gate',
      [
        N('The atlas page is blue, with a little island on it.'),
        N('You step in. Now you are at a big gate, with your Nubbin.'),
        N('Inside, young men are eating and playing. No one comes to the gate.'),
        N('An old traveller with a spear waits beside you.'),
        MS('A good house always welcomes a stranger.', 'think'),
        N('A young man sees you. His cheeks go red.'),
        TM('Oh! Strangers at the gate! Please come in and eat.'),
      ],
      [
        notice(
          3,
          'social-studies',
          'an island is land with water all around it',
          'D2.Geo.2.K-2',
          [
            MS('This little island is called Ithaca.'),
            MS('An island is land with water all around it.'),
            N('(Trace a circle round the island with your finger.)'),
          ],
          'Learned that an island is land with water all around it, and met Ithaca.',
        ),
      ],
      {
        choices: [
          ch('wait', 'Wait to be asked in nicely.', [
            TM('Now you are asked. Welcome! I am Telemachus.'),
          ]),
          ch('step', 'Step in. You are hungry.', [N('You step in. The old traveller smiles.')]),
          ch('nubbin', 'Let your Nubbin go first.', [
            N('Your Nubbin trots in. Telemachus laughs.'),
          ]),
        ],
      },
    ),
    sc(
      'a14-01-gate-done',
      [
        N('Telemachus puts the traveller’s spear in a rack.'),
        N('The other spears are dusty. They were his dad’s.'),
        TM('Come this way, away from the noisy men.'),
      ],
      [
        ask(
          1,
          'sel',
          'name a feeling from how someone looks and acts',
          'ELOF: Social and Emotional Development',
          [N('Telemachus looks at his dad’s dusty spears. He is quiet. How does he feel?')],
          [
            o(
              'Sad, because he misses his dad',
              [N('Yes. He misses his dad. It is all right to feel sad.')],
              true,
            ),
            o('Silly', [
              N('He is not feeling silly. He is quiet and looking at the spears. He feels sad.'),
            ]),
          ],
          'Named a feeling (sad, missing someone) from how a character looks and acts.',
        ),
      ],
    ),
    sc(
      'a14-01-hearth',
      [
        N('A maid pours water over your hands.'),
        N('She brings bread. She brings meat.'),
        MS('I am Mentes. I came to meet your dad.'),
        TM('My dad went away when I was a baby.'),
        TM('Some men eat our food every day. It makes me sad.'),
        MS('Your dad is alive. He is trying to get home.'),
      ],
      [
        doit(
          1,
          'maths',
          'count three things',
          'K.CC.B.5',
          'edu:count:foods:3',
          [
            N('The maid brought water, bread and meat.'),
            N('(Count them on your fingers together. How many?)'),
          ],
          'Counted three things (water, bread, meat) to answer how many.',
        ),
      ],
      {
        choices: [
          ch('how', 'Ask Mentes how he knows.', [MS('Some things I have seen. Some I just know.')]),
          ch('go', 'Say you will go with Telemachus.', [TM('You would? That is kind.')]),
          ch('eat', 'Eat, and listen.', [
            N('You eat the bread. It is the best bread in the house.'),
          ]),
        ],
      },
    ),
    sc(
      'a14-01-hearth-done',
      [
        N('Mentes walks across the yard.'),
        N('A bird flies up through the roof.'),
        N('Mentes was Athena, a goddess who helps Telemachus!'),
        TM('Athena can look like anybody. Even a bird. Even a man with a beard.', 'shock'),
      ],
      [
        ask(
          1,
          'science',
          'smoke and warm air go up',
          'ELOF: Scientific Reasoning',
          [N('The bird flew up through a hole in the roof. Which way does smoke from a fire go?')],
          [
            o(
              'Up',
              [
                N(
                  'Yes. Warm air goes up and takes the smoke with it. That is why the roof has a hole.',
                ),
              ],
              true,
            ),
            o('Down', [
              N('Smoke floats up, not down. The warm air carries it up and out of the hole.'),
            ]),
          ],
          'Learned that smoke and warm air rise.',
        ),
      ],
    ),
    sc(
      'a14-01-stair',
      [
        N('Phemius the singer plays a lyre. It has strings.'),
        N('Penelope comes down the stairs. She looks sad.'),
        PN('Please sing a different song.'),
        TM('Mother, let him sing.', 'soft'),
        N('Penelope goes back up. You spot a big loom with cloth on it.'),
      ],
      [
        notice(
          0,
          'music',
          'a plucked string wobbles, and the wobble is sound',
          '1-PS4-1',
          [
            N('When Phemius plucks a string, it wobbles.'),
            N('The wobble is the sound! (Wiggle your fingers like a string and hum: mmmm.)'),
          ],
          'Learned that a plucked string wobbles and that the wobble makes sound.',
        ),
      ],
    ),
    sc(
      'a14-01-stair-done',
      [
        TM('That cloth has been on the loom for ages.'),
        TM('Ask Antinous. He loves to tell that story.', 'angry'),
      ],
      [
        ask(
          0,
          'literacy',
          'hear the first sound of a word',
          'RF.K.2',
          [N('Loom starts with the sound l, l, l. Which word starts the same: lamp or hat?')],
          [
            o('Lamp', [N('Yes! L, l, lamp. L, l, loom.')], true),
            o('Hat', [N('Hat starts with h, h, h. Lamp starts with l, l, l, just like loom.')]),
          ],
          'Listened for the first sound of a word (l for loom and lamp).',
        ),
      ],
    ),
    sc(
      'a14-01-complete',
      [
        N('Night comes. The noisy men go home to bed.'),
        EC('Time for sleep, Telemachus. Sweet dreams.', 'soft'),
        TM('Tomorrow I will call a big meeting. Will you stand with me?'),
        N('You and your Nubbin sleep on soft fleeces in the porch.'),
        N('Upstairs, a loom is working, very quietly.'),
      ],
      [
        ask(
          2,
          'sel',
          'sharing is kind',
          'ELOF: Social and Emotional Development',
          [
            N(
              'Telemachus shared his bread with you, and you were strangers. What is a kind way to share?',
            ),
          ],
          [
            o(
              'Give a friend half of what you have',
              [N('Yes. Sharing makes friends feel cared for, and it feels good too.')],
              true,
            ),
            o('Keep it all', [
              N(
                'Keeping it all feels safe, but sharing makes friends. Telemachus shared and made a friend.',
              ),
            ]),
          ],
          'Talked about sharing as a kind thing to do.',
        ),
      ],
    ),
  ],
);

// ================================================================== A14-2 The Assembly
const A2: EduQuest = quest(
  'a14-02',
  'The Assembly',
  {
    'a14-02-s1': {
      goal: 'Stand behind Telemachus at the big meeting.',
      hint: 'Stand behind his father’s seat.',
    },
    'a14-02-s2': {
      goal: 'Listen to Antinous tell about the cloth.',
      hint: 'Stay close to Telemachus.',
    },
    'a14-02-s3': { goal: 'Hold the torch for Penelope.', hint: 'Keep the torch high and steady.' },
  },
  [
    sc(
      'a14-02-assembly',
      [
        N('The men of Ithaca meet in the meeting-place.'),
        N('Telemachus sits in his dad’s seat. You stand behind him.'),
        TM('Please go home. You are eating our food.', 'angry'),
        N('He puts down the speaker’s staff. His eyes are wet.'),
        N('Some men laugh. Telemachus feels very small.'),
      ],
      [
        ask(
          3,
          'social-studies',
          'taking turns: one person speaks at a time',
          'D2.Civ.8.K-2',
          [N('Only the person holding the staff may talk. Why?')],
          [
            o(
              'So everyone takes turns',
              [
                N(
                  'Yes. One person talks, and everyone else listens. Then it is the next person’s turn.',
                ),
              ],
              true,
            ),
            o('So it looks pretty', [
              N(
                'It does look grand, but the real reason is turns. The staff shows whose turn it is.',
              ),
            ]),
          ],
          'Learned that a speaker’s staff was a way of taking turns.',
        ),
      ],
      {
        choices: [
          ch('staff', 'Pick up the staff and give it back.', [
            N('He takes it and holds it tight.'),
          ]),
          ch('stare', 'Look kindly at the man who laughed.', [
            N('The man stops laughing for a moment.'),
          ]),
          ch('stay', 'Stay right behind him.', [N('Telemachus stands up a little straighter.')]),
        ],
      },
    ),
    sc(
      'a14-02-assembly-done',
      [
        N('A tall man stands up. He is Antinous.'),
        AN('It is not our fault! It is Penelope’s fault!', 'angry'),
      ],
      [
        ask(
          1,
          'sel',
          'saying sorry instead of blaming',
          'ELOF: Social and Emotional Development',
          [N('Antinous says it is not his fault. What could he say instead?')],
          [
            o(
              'I am sorry. I will go home.',
              [N('Yes. Saying sorry and putting things right is brave.')],
              true,
            ),
            o('It is your fault!', [N('Blaming someone else does not help. Saying sorry does.')]),
          ],
          'Talked about saying sorry instead of blaming someone else.',
        ),
      ],
    ),
    sc(
      'a14-02-antinous',
      [
        AN('Penelope made a big cloth on a big wooden frame.'),
        AN('She said, I will marry when it is done.'),
        AN('So all day, she wove the cloth.'),
        AN('Then at night, she took it all apart!'),
        N('The page goes soft. Now you are upstairs, holding a torch.'),
      ],
      [
        ask(
          3,
          'literacy',
          'first, next, last: what happened in order',
          'RL.K.3',
          [N('In the day, Penelope wove the cloth. Then night came. What did she do at night?')],
          [
            o(
              'She took the cloth apart',
              [N('Yes. First she wove, next it was night, last she took it apart.')],
              true,
            ),
            o('She sang a song', [
              N('She did not sing. At night she took the cloth apart, bit by bit.'),
            ]),
          ],
          'Put events in order (first she wove, last she took it apart).',
        ),
      ],
    ),
    sc(
      'a14-02-antinous-done',
      [N('In front of you stands the great loom. Penelope sits at it, with a small knife.')],
      [
        ask(
          0,
          'maths',
          'take one away from one',
          'K.OA.A.1',
          [N('Penelope weaves 1 row. At night she takes 1 row away. How many rows are left?')],
          [
            o(
              'None',
              [N('Yes! 1 take away 1 leaves none. That is why the cloth was never finished.')],
              true,
            ),
            o('2 rows', [N('Taking away makes fewer, not more. 1 take away 1 leaves none.')]),
          ],
          'Took away to find that 1 take away 1 leaves none.',
        ),
      ],
    ),
    sc(
      'a14-02-loom',
      [
        AN('Every day she wove. Every night she took it out.'),
        PN('Hold the torch a little higher. Thank you.', 'soft'),
        PN('The long threads stay still. The short thread goes back and forth.'),
        PN('Over, under, over, under.'),
        N('Your Nubbin holds the end of the thread, very seriously.'),
        N('Out in the dark, a floorboard creaks. Someone is listening.'),
      ],
      [
        doit(
          3,
          'art',
          'a weaving pattern: over, under, over, under',
          'ELOF: Mathematics Development',
          'edu:say:pattern:over-under',
          [
            N('Penelope’s thread goes over, then under, over, then under.'),
            N('(Say the pattern together, and hop it in the air.)'),
          ],
          'Said and moved to a repeating pattern: over, under, over, under.',
        ),
      ],
      {
        choices: [
          ch('look', 'Go and look in the passage.', [N('A maid hurries away round the corner.')]),
          ch('tell', 'Tell Penelope someone heard.', [PN('I know. I will finish my row anyway.')]),
          ch('steady', 'Hold the torch steady.', [
            N('You keep the torch still. She keeps weaving.'),
          ]),
        ],
      },
    ),
    sc(
      'a14-02-loom-done',
      [
        N('Now it is daytime again. You are back at the meeting.'),
        AN('A maid told us the secret.', 'angry'),
        AN('Penelope had to finish the cloth.'),
      ],
      [
        ask(
          0,
          'science',
          'torches give light in the dark',
          '1-PS4-2',
          [N('At night it was dark, so you held a torch. What gives us light in the daytime?')],
          [
            o(
              'The Sun',
              [N('Yes. The Sun lights up the day. A torch gives light after the Sun has set.')],
              true,
            ),
            o('The Moon', [N('The Moon shines at night. In the day, the Sun gives us light.')]),
          ],
          'Learned that the Sun gives light in the day and that a torch gives light at night.',
        ),
      ],
    ),
    sc(
      'a14-02-complete',
      [
        N('The meeting ends. No one helps Telemachus.'),
        N('Old Mentor, Telemachus’s friend, comes close.'),
        MR('I have a ship. Fill it with food. Tell no one.'),
        EC('Take care, my dear. Come home safe.', 'sad'),
        N('At nightfall the ship sails out of the harbour.'),
        N('The wind blows from behind. It fills the sail.'),
      ],
      [
        ask(
          3,
          'literacy',
          'rhyming words',
          'RF.K.2',
          [N('Sail rhymes with a word. Which one: tail or tree?')],
          [
            o('Tail', [N('Yes! Sail and tail rhyme. They end with the same sound: ail.')], true),
            o('Tree', [N('Tree ends in ee. Sail ends in ail, just like tail.')]),
          ],
          'Found a rhyme for sail (tail).',
        ),
      ],
    ),
  ],
);

// ================================================================== A14-3 Nestor and Menelaus
const A3: EduQuest = quest(
  'a14-03',
  'Nestor and Menelaus',
  {
    'a14-03-s1': {
      goal: 'Land at Pylos and ask old Nestor for news.',
      hint: 'Walk up the beach to the feast.',
    },
    'a14-03-s2': { goal: 'Ride to Sparta in the chariot.', hint: 'Climb in behind Telemachus.' },
    'a14-03-s3': { goal: 'Hear what Menelaus learned.', hint: 'Sit with him by the fire.' },
  },
  [
    sc(
      'a14-03-pylos',
      [
        N('A sandy beach, at sunrise. People are having a big feast.'),
        TM('I feel nervous. What if I say the wrong thing?', 'sad'),
        MR('Take a breath. Some words will come to you.', 'soft'),
        N('Nestor is very, very old. He is kind.'),
        NE('Eat first. Then we talk.', 'soft'),
        TM('Please, do you know where my dad is?'),
        NE('I am sorry. I do not know. Menelaus might.', 'sad'),
      ],
      [
        ask(
          2,
          'sel',
          'what helps when you feel nervous',
          'ELOF: Social and Emotional Development',
          [N('Telemachus feels nervous. What can help him feel braver?')],
          [
            o(
              'A slow, deep breath',
              [N('Yes. Breathe in slowly, and out slowly. (Try it together.)')],
              true,
            ),
            o('Run away', [
              N('Running away does not help the nervous feeling go. A slow breath does.'),
            ]),
          ],
          'Practised a calming breath for nervous feelings.',
        ),
      ],
      {
        choices: [
          ch('who', 'Ask who might know.', [NE('Menelaus. My son will drive you to Sparta.')]),
          ch('hope', 'Ask if there is any hope.', [NE('There is always hope with your dad.')]),
          ch('nubbin', 'Let your Nubbin sit by the old king.', [
            N('Nestor pats it gently, like a grandchild.'),
          ]),
        ],
      },
    ),
    sc(
      'a14-03-pylos-done',
      [
        N('After the feast, Mentor turns into a big sea-eagle.'),
        N('He flies away over the water.'),
        NE('That was Athena again! She is looking after you.', 'soft'),
        N('Your Nubbin checks every bird in the sky for a beard.'),
        N('The people on the beach are praying quietly.'),
        N('You stand back and keep quiet.'),
      ],
      [
        ask(
          3,
          'social-studies',
          'be quiet and kind when others are praying',
          'D2.Civ.8.K-2',
          [N('The people are praying on the beach. What should a good guest do?')],
          [
            o(
              'Stay quiet and kind',
              [N('Yes. Being quiet shows you respect what matters to them.')],
              true,
            ),
            o('Shout and run about', [
              N('Shouting would spoil it for them. A good guest stays quiet and kind.'),
            ]),
          ],
          'Learned to be quiet and respectful when others are praying.',
        ),
      ],
    ),
    sc(
      'a14-03-sparta',
      [
        N('Two days in a chariot! Your Nubbin leans round the corners.'),
        N('Menelaus’s house is the shiniest house you have ever seen.'),
        N('There are shiny things to see: bronze, gold, silver, amber and ivory.'),
        HE('You look just like Odysseus! You have his feet and hands.', 'shock'),
        ML('Yes. You are his son.', 'soft'),
        N('Telemachus holds his cloak up to hide his tears.'),
      ],
      [
        doit(
          2,
          'maths',
          'count five shiny things',
          'K.CC.B.5',
          'edu:count:shiny-things:5',
          [
            N('Bronze, gold, silver, amber, ivory.'),
            N('(Count the five shiny things on your fingers together.)'),
          ],
          'Counted five things to answer how many.',
        ),
      ],
      {
        choices: [
          ch('yes', 'Say yes, it is his son.', [N('Menelaus takes Telemachus’s arm gently.')]),
          ch('wait', 'Let Telemachus answer.', [TM('Yes, I am. Is my dad alive?')]),
        ],
      },
    ),
    sc(
      'a14-03-sparta-done',
      [ML('Eat and rest now. In the morning I will tell you something.')],
      [
        ask(
          0,
          'sel',
          'waiting patiently',
          'ELOF: Approaches to Learning',
          [N('Telemachus must wait all night for news. What can he do while he waits?')],
          [
            o('Eat and rest', [N('Yes. Resting helps us wait. Morning will come.')], true),
            o('Ask and ask again', [
              N('Asking again and again makes waiting feel longer. Resting is better.'),
            ]),
          ],
          'Talked about waiting patiently by resting.',
        ),
      ],
    ),
    sc(
      'a14-03-proteus',
      [
        ML('A magic Old Man of the Sea knows many things.'),
        ML('At noon he sleeps among the seals.'),
        N('You hide under a sealskin on the hot beach.'),
        N('He comes up from the sea, and lies down to sleep.'),
        ML('Now! Hold on!'),
        N('He becomes a lion: roar! Then a snake: sss!'),
        N('At last he is an old man again, and he answers.'),
        ML('Odysseus is alive. He is on an island.', 'soft'),
      ],
      [
        doit(
          5,
          'literacy',
          'animal sounds',
          'ELOF: Language and Communication',
          'edu:say:animal-sounds:lion-snake',
          [
            N('The old man turned into a lion and a snake.'),
            N('(Roar like a lion. Hiss like a snake.)'),
          ],
          'Made animal sounds (roar, sss) in the story.',
        ),
      ],
      {
        choices: [
          ch('alive', 'Ask Menelaus: alive?', [ML('Alive! He misses home very much.')]),
          ch('look', 'Look at Telemachus.', [N('He jumps to his feet, full of hope.')]),
        ],
      },
    ),
    sc(
      'a14-03-proteus-done',
      [
        TM('He is alive! I must go home and tell my mum!', 'happy'),
        ML('Take a gift: a silver bowl with a gold rim.'),
        ML('A guest always goes home with a gift.'),
      ],
      [
        notice(
          2,
          'social-studies',
          'hosts long ago gave guests gifts',
          'D2.His.2.K-2',
          [
            N('In Greece long ago, a host gave a guest a gift.'),
            N('It showed they cared. Gifts can say, we are friends.'),
          ],
          'Learned that hosts long ago gave guests gifts to show they cared.',
        ),
      ],
    ),
    sc(
      'a14-03-complete',
      [
        N('Two more days in the chariot, and you ride back to the ship.'),
        N('Helen waves from the gate until you are far away.'),
        N('Telemachus stands at the front of the ship.'),
        N('Then the atlas turns its page. You are somewhere new.'),
      ],
      [
        ask(
          1,
          'maths',
          'add two and two',
          'K.OA.A.2',
          [N('Two days riding there. Two days riding back. How many days is that?')],
          [
            o('Four', [N('Yes! 2 and 2 make 4. (Hold up four fingers.)')], true),
            o('Two', [N('That is only one way. Two more days back make four.')]),
          ],
          'Added 2 + 2 to find 4 days.',
        ),
      ],
    ),
  ],
);

// ================================================================== A14-4 Calypso’s Island
const A4: EduQuest = quest(
  'a14-04',
  'Calypso’s Island',
  {
    'a14-04-s1': {
      goal: 'Walk to Calypso’s cave.',
      hint: 'Follow the young man with golden sandals.',
    },
    'a14-04-s2': {
      goal: 'Find Odysseus on the shore.',
      hint: 'Go down to the rocks above the beach.',
    },
    'a14-04-s3': { goal: 'Help him build the raft.', hint: 'Carry the pegs to the shore.' },
  },
  [
    sc(
      'a14-04-ogygia',
      [
        N('A quiet island far across the sea.'),
        N('There are trees, and four springs, and soft green meadows.'),
        N('Owls and sea birds nest in the trees.'),
        N('A young man with golden sandals lands beside you.'),
        HM('I am Hermes. I carry messages. Walk with me.'),
        N('In a cave, a woman sits weaving and singing.'),
        N('She is Calypso. She gives you bread and figs to eat.'),
        HM('Zeus says: let the man go home.'),
        CA('I am sad. But I will let him go.', 'sad'),
      ],
      [
        ask(
          2,
          'science',
          'animals live where they find what they need',
          'K-ESS3-1',
          [N('Birds nest in these trees. Why do birds like this island?')],
          [
            o(
              'It has water, food and trees',
              [N('Yes. Animals live where they find water, food and a safe home.')],
              true,
            ),
            o('It has no trees', [
              N('There are lots of trees! Birds nest in trees. They need a safe home.'),
            ]),
          ],
          'Learned that animals live where they find water, food and shelter.',
        ),
      ],
      {
        choices: [
          ch('thank', 'Thank Calypso for the figs.', [CA('You are welcome, little guest.')]),
          ch('where', 'Ask Hermes where Odysseus is.', [
            HM('On the shore. He is always on the shore.'),
          ]),
        ],
      },
    ),
    sc(
      'a14-04-ogygia-done',
      [
        N('Hermes goes away over the sea.'),
        N('Calypso puts down her loom. She goes to find Odysseus.'),
      ],
      [
        notice(
          0,
          'social-studies',
          'in old Greek stories, Hermes carried messages',
          'D2.His.2.K-2',
          [
            N('In the old Greek stories, Hermes carried messages for the king of the gods.'),
            N(
              'Some people in Greece still honour these gods today. We tell their stories with care.',
            ),
          ],
          'Learned that in old Greek stories Hermes carried messages, and that some people still honour these gods.',
        ),
      ],
    ),
    sc(
      'a14-04-shore',
      [
        N('A man sits on a rock above the beach.'),
        N('He looks at the sea. He is crying, very quietly.'),
        OD('I miss my home. I miss it so much.', 'sad'),
        OD('Every morning I come here and look at the sea.'),
        N('Your Nubbin sits beside him and looks at the sea too.'),
      ],
      [
        ask(
          2,
          'sel',
          'name homesickness and say what helps',
          'ELOF: Social and Emotional Development',
          [N('Odysseus misses home. That feeling is called homesick. What can help?')],
          [
            o(
              'Talk about home with a friend',
              [N('Yes. Sharing a feeling makes it lighter. A hug helps too.')],
              true,
            ),
            o('Hide the feeling', [N('Hiding a feeling can make it heavier. Talking helps.')]),
          ],
          'Named the feeling of being homesick and talked about what helps.',
        ),
      ],
      {
        choices: [
          ch('sit', 'Sit with him and say nothing.', [
            N('You sit together. The sea goes in and out.'),
          ]),
          ch('home', 'Ask him about home.', [OD('My son was a baby. Now he is a man.')]),
          ch('son', 'Tell him you met his son.', [OD('My son? Is he tall? Tell me!')]),
        ],
      },
    ),
    sc(
      'a14-04-shore-done',
      [
        N('Calypso comes down the beach.'),
        CA('Do not cry. I will let you go.', 'sad'),
        CA('Build a raft. I will give you food and a fair wind.'),
        OD('Promise it, please.', 'think'),
        CA('I promise. I am sorry you are sad.', 'soft'),
      ],
      [
        doit(
          1,
          'maths',
          'count to seven on your fingers',
          'K.CC.A.1',
          'edu:count:years:7',
          [
            N('Odysseus stayed here for seven years.'),
            N('(Count to seven on your fingers together.)'),
          ],
          'Counted to seven on fingers.',
        ),
      ],
    ),
    sc(
      'a14-04-raft',
      [
        N('Odysseus cuts down trees with a bronze axe.'),
        N('You carry the pegs. Your Nubbin carries one, so proudly.'),
        N('He works four days. Now there is a raft with a sail.'),
        CA('Stay with me, and nothing bad will ever happen.', 'soft'),
        OD('I want to go home. My family is there.'),
        OD('Would you stay, little guest?'),
      ],
      [
        ask(
          4,
          'sel',
          'home is where people who love you are',
          'ELOF: Social and Emotional Development',
          [N('Odysseus could stay safe here, but he wants to go home. Why?')],
          [
            o('His family is there', [N('Yes. Home is where the people who love us are.')], true),
            o('He is bored', [N('Not bored. He misses his family, and his family misses him.')]),
          ],
          'Talked about why home matters: the people who love us.',
        ),
      ],
      {
        choices: [
          ch('home', 'Say, “No. Home.”', [OD('Home. Yes! Home is where I want to be.')]),
          ch('unsure', 'Say, “I do not know.”', [OD('That is an honest answer.')]),
          ch('happen', 'Say, “Not if nothing ever happens.”', [
            OD('A safe cave is nice. But I want to be happy, with my family.'),
          ]),
        ],
      },
    ),
    sc(
      'a14-04-raft-done',
      [
        N('On the fifth day, he sails.'),
        N('At night he steers by the stars.'),
        N('You watch the island get small, and then it is gone.'),
      ],
      [
        notice(
          1,
          'science',
          'stars shine at night',
          '1-ESS1-1',
          [
            N('Stars shine at night. In the day, the Sun is too bright to see them.'),
            N('Sailors use stars to find their way. (Point up and say: twinkle, twinkle.)'),
          ],
          'Learned that stars shine at night and that sailors steer by them.',
        ),
      ],
    ),
    sc(
      'a14-04-complete',
      [
        N('Calypso waits on the beach until he is out of sight.'),
        N('She goes back to her loom.'),
        N('Many days later, new hills rise out of the sea.'),
        OD('Land! I see land!', 'happy'),
      ],
      [
        ask(
          3,
          'literacy',
          'rhyming words',
          'RF.K.2',
          [N('Land rhymes with a word. Which one: sand or sea?')],
          [
            o('Sand', [N('Yes! Land and sand rhyme. Land, sand, hand.')], true),
            o('Sea', [N('Sea ends in ee. Land ends in and, just like sand.')]),
          ],
          'Found a rhyme for land (sand).',
        ),
      ],
    ),
  ],
);

// ================================================================== A14-5 The Raft
const A5: EduQuest = quest(
  'a14-05',
  'The Raft',
  {
    'a14-05-s1': {
      goal: 'Hold on in the storm.',
      hint: 'Hold your plank, and keep your Nubbin close.',
    },
    'a14-05-s2': { goal: 'Swim to the shore.', hint: 'Swim along the coast to the river.' },
    'a14-05-s3': { goal: 'Find a dry place to sleep.', hint: 'Climb up to the two olive bushes.' },
  },
  [
    sc(
      'a14-05-storm',
      [
        N('A big storm comes. The wind howls.'),
        N('A big wave hits the raft. The mast snaps.'),
        N('You hold on to a plank. Your Nubbin holds on to you.'),
        N('A white sea bird lands on the raft. She is a kind goddess.'),
        IN('Here, take my scarf. It will help you float.'),
        OD('I will hold on to the raft, and trust her too.', 'think'),
      ],
      [
        doit(
          2,
          'science',
          'wood floats on water',
          'ELOF: Scientific Reasoning',
          'edu:sort:float-or-sink:wood',
          [
            N('Your plank is wood, and wood floats!'),
            N('(Pretend: wood floats, a stone sinks. Show with your hands.)'),
          ],
          'Learned that wood floats and a stone sinks.',
        ),
      ],
      {
        choices: [
          ch('trust', 'Say, “She means it. Take it.”', [
            OD('Maybe. I will hold on to the raft too.'),
          ]),
          ch('hold', 'Hold on, and say nothing.', [N('You hold on tight. So does your Nubbin.')]),
          ch('knot', 'Help him tie the scarf.', [N('You tie a knot. He nods.')]),
        ],
      },
    ),
    sc(
      'a14-05-storm-done',
      [
        N('The biggest wave breaks the raft apart.'),
        N('Odysseus holds one wooden beam.'),
        N('He ties the scarf round him, and swims. You follow.'),
      ],
      [
        ask(
          1,
          'sel',
          'holding on and breathing when scared',
          'ELOF: Social and Emotional Development',
          [N('You feel scared in the big waves. What can help?')],
          [
            o(
              'Slow breaths, and holding a friend',
              [N('Yes. Breathe slowly, and stay close to a friend.')],
              true,
            ),
            o('Squeezing your eyes shut and stopping', [
              N('Stopping does not help. Slow breaths and a friend do.'),
            ]),
          ],
          'Practised slow breaths and staying close to a friend when scared.',
        ),
      ],
    ),
    sc(
      'a14-05-swim',
      [
        N('Two days and two nights, you swim.'),
        N('On the third morning the wind drops.'),
        OD('Land! I could cry with joy!', 'happy'),
        N('The shore is rocky. You swim along the coast.'),
        N('There is the mouth of a river, calm and quiet.'),
        N('He crawls up the bank and kisses the ground.'),
      ],
      [
        ask(
          1,
          'maths',
          'add two days and two nights',
          'K.OA.A.2',
          [N('Two days and two nights. How many is that: 2 and 2?')],
          [
            o('Four', [N('Yes! 2 and 2 make 4. (Hold up four fingers.)')], true),
            o('Two', [N('Two is only the days. Add the two nights: 2 and 2 make 4.')]),
          ],
          'Added 2 + 2 to make 4.',
        ),
      ],
    ),
    sc(
      'a14-05-swim-done',
      [
        N('When he can breathe, he unties the scarf.'),
        N('He throws it into the river and turns his head away.'),
        N('Splash! The water carries it back to the sea.'),
      ],
      [
        doit(
          2,
          'literacy',
          'sound words',
          'ELOF: Language and Communication',
          'edu:say:sound-words:splash',
          [
            N('The scarf goes splash!'),
            N('(Say splash, splash, splash and make waves with your hands.)'),
          ],
          'Said a sound word (splash) and moved to it.',
        ),
      ],
    ),
    sc(
      'a14-05-olives',
      [
        OD('I am too cold by the river. I will go up into the woods.', 'think'),
        N('Two olive bushes grow from one root.'),
        N('Under them, dry leaves make a soft bed.'),
        N('He lies down and covers himself with leaves.'),
        N('You and your Nubbin snuggle in too.'),
        OD('Two olives from one root. Goodnight.', 'soft'),
      ],
      [
        ask(
          1,
          'science',
          'plants need water and sunlight',
          'K-LS1-1',
          [N('The olive bushes are green and alive. What do plants need to grow?')],
          [
            o(
              'Water and sunlight',
              [N('Yes. Plants drink water and love sunlight. That is how they grow.')],
              true,
            ),
            o('Toys', [N('Toys are for children! Plants need water and sunlight.')]),
          ],
          'Learned that plants need water and sunlight to grow.',
        ),
      ],
      {
        choices: [
          ch('watch', 'Keep watch for a while.', [N('Only a little owl comes by.')]),
          ch('leaves', 'Pile more leaves over him.', [N('He is already asleep.')]),
          ch('sleep', 'Sleep.', [N('You sleep. It is the first sleep in three days.')]),
        ],
      },
    ),
    sc(
      'a14-05-complete',
      [
        N('Athena pours sleep over his eyes, so he can rest.'),
        N('Up the hill, a princess has a dream.'),
        N('Your Nubbin sneezes once and goes back to sleep.'),
      ],
      [
        ask(
          1,
          'health',
          'sleep helps our bodies rest',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('Odysseus is very tired. Why do we need sleep?')],
          [
            o(
              'So our bodies can rest and grow',
              [N('Yes. Sleep gives our bodies a rest, and helps us grow.')],
              true,
            ),
            o('So we can be grumpy', [N('Sleep makes us less grumpy! Our bodies rest and grow.')]),
          ],
          'Learned that sleep gives our bodies rest and helps us grow.',
        ),
      ],
    ),
  ],
);

// ================================================================== A14-6 Nausicaa
const A6: EduQuest = quest(
  'a14-06',
  'Nausicaa',
  {
    'a14-06-s1': {
      goal: 'Help with the washing at the river.',
      hint: 'Carry the clothes to the washing pools.',
    },
    'a14-06-s2': {
      goal: 'Stand by Nausicaa as the stranger comes out.',
      hint: 'Do not run. Stay by the princess.',
    },
    'a14-06-s3': {
      goal: 'Follow the cart towards the town.',
      hint: 'Walk behind the cart to the grove.',
    },
  },
  [
    sc(
      'a14-06-river',
      [
        N('A mule-cart comes down the road, piled high with clothes.'),
        NA('Hello! Today we wash our clothes. Please help us!', 'happy'),
        N('You splash and tread the clothes in the pools.'),
        N('The wet clothes are spread on the sunny pebbles.'),
        N('The girls eat lunch, then play ball.'),
        NA('Catch!'),
      ],
      [
        ask(
          3,
          'science',
          'the Sun dries wet things',
          'K-PS3-1',
          [N('The wet clothes lie on the pebbles in the Sun. What will happen to them?')],
          [
            o(
              'They will dry',
              [N('Yes. The Sun warms the clothes and the water goes up into the air.')],
              true,
            ),
            o('They will get wetter', [
              N('The Sun does not make things wetter. It makes them warm and dry.'),
            ]),
          ],
          'Learned that the Sun’s warmth dries wet clothes.',
        ),
      ],
      {
        choices: [
          ch('catch', 'Catch it.', [N('You catch it and throw it back. She laughs.')]),
          ch('nubbin', 'Let your Nubbin catch it.', [
            N('Your Nubbin catches it and falls over backwards.'),
          ]),
          ch('drop', 'Drop it, for fun.', [N('Everyone laughs. Being bad at ball is fun here!')]),
        ],
      },
    ),
    sc(
      'a14-06-river-done',
      [
        N('Nausicaa throws the ball. It lands in the deep water.'),
        N('Everyone shrieks!'),
        N('In the bushes, the leaves wiggle. Someone gets up.'),
      ],
      [
        doit(
          0,
          'literacy',
          'clap the beats in a name',
          'RF.K.2',
          'edu:clap:syllables:nausicaa',
          [
            N('The princess’s name is Nausicaa. It has four beats: Nau-si-ca-a.'),
            N('(Clap the four beats together.)'),
          ],
          'Clapped the four syllables in the name Nausicaa.',
        ),
      ],
    ),
    sc(
      'a14-06-bushes',
      [
        N('A man steps out of the bushes. He is covered in salt.'),
        N('The maids run away. Nausicaa stays.'),
        OD('Hello, lady. Please may I have some clothes and some food?', 'soft'),
        N('He stays far back and asks politely.'),
      ],
      [
        ask(
          3,
          'sel',
          'polite words and gentle manners',
          'ELOF: Social and Emotional Development',
          [N('The man asks in a gentle voice. Which word is a polite one?')],
          [
            o(
              'Please',
              [N('Yes. Please and thank you are kind words that help people feel safe.')],
              true,
            ),
            o('Give me', [N('Give me can sound bossy. Please makes a request kind.')]),
          ],
          'Practised polite words (please) and gentle manners.',
        ),
      ],
      {
        choices: [
          ch('vouch', 'Say he is a good man.', [NA('Then he is welcome here.')]),
          ch('cloak', 'Hold out a clean cloak.', [N('He takes it and bows to you.')]),
          ch('wait', 'Stay back. It is her choice.', [
            NA('You look like a man who has had bad luck.'),
          ]),
        ],
      },
    ),
    sc(
      'a14-06-bushes-done',
      [
        NA('Come back! Give him clothes and food!'),
        N('He washes the salt off in the river.'),
        N('When he comes back, he looks clean and tall.'),
      ],
      [
        ask(
          1,
          'health',
          'washing keeps us clean and healthy',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('Odysseus washes the salt off. Why do we wash with water and soap?')],
          [
            o(
              'To get clean and keep healthy',
              [N('Yes. Washing gets rid of dirt and germs.')],
              true,
            ),
            o('To get dirty', [N('Washing makes us clean, not dirty.')]),
          ],
          'Learned that washing keeps us clean and healthy.',
        ),
      ],
    ),
    sc(
      'a14-06-road',
      [
        NA('Follow the cart to the town fields.'),
        NA('Then wait in the quiet grove.'),
        NA('Then ask for the palace. Then go to my mother.'),
        NA('She sits by the fire. Be polite to her.', 'happy'),
      ],
      [
        ask(
          3,
          'social-studies',
          'first, next, last in directions',
          'D2.Geo.2.K-2',
          [
            N(
              'First, follow the cart. Next, wait in the grove. What is last: ask for the palace, or go home?',
            ),
          ],
          [
            o(
              'Ask for the palace',
              [N('Yes. First the cart, next the grove, last the palace.')],
              true,
            ),
            o('Go home', [
              N('Odysseus is trying to get home! The last step is to ask for the palace.'),
            ]),
          ],
          'Put directions in order: first, next, last.',
        ),
      ],
    ),
    sc(
      'a14-06-road-done',
      [
        N('You wait in the quiet grove until sunset.'),
        N('Odysseus talks quietly to Athena, all alone.'),
        N('You walk a little way off to give him room.'),
      ],
      [
        ask(
          2,
          'sel',
          'giving someone space',
          'ELOF: Social and Emotional Development',
          [N('Odysseus wants to talk alone. Why is it kind to give him room?')],
          [
            o(
              'Some things are private',
              [N('Yes. Giving a friend space shows you respect them.')],
              true,
            ),
            o('So you can run away', [
              N('Not to run away. Giving room is a kind way to say: this is yours.'),
            ]),
          ],
          'Talked about giving a friend space as a kind thing to do.',
        ),
      ],
    ),
    sc(
      'a14-06-complete',
      [
        N('You walk into town after dark.'),
        N('A girl with a water jar shows you the way.'),
        N('She has grey eyes, and walks very lightly.'),
        N('When Odysseus looks back, she is gone!'),
      ],
      [
        doit(
          3,
          'maths',
          'count four friends',
          'K.CC.B.5',
          'edu:count:friends:4',
          [
            N('Odysseus, you, your Nubbin, and the girl.'),
            N('(Count the four on your fingers together.)'),
          ],
          'Counted four characters to answer how many.',
        ),
      ],
    ),
  ],
);

// ================================================================== A14-7 The Phaeacian Hall
const A7: EduQuest = quest(
  'a14-07',
  'The Phaeacian Hall',
  {
    'a14-07-s1': {
      goal: 'Go into the king’s hall.',
      hint: 'Walk between the gold and silver dogs.',
    },
    'a14-07-s2': {
      goal: 'Sit at the feast and hear the singer.',
      hint: 'Sit on the bench by Odysseus.',
    },
    'a14-07-s3': { goal: 'Hear him say his name.', hint: 'Stay at the table.' },
  },
  [
    sc(
      'a14-07-hall',
      [
        N('The hall has bronze walls and golden doors.'),
        N('Two statues of dogs sit by the door, gold and silver.'),
        N('Odysseus kneels before the queen.'),
        OD('Please help me get home. I have been away so long.', 'sad'),
        AC('Stand up, friend. Come and sit beside me. Have some dinner.', 'soft'),
      ],
      [
        notice(
          1,
          'science',
          'metals can be polished until they shine',
          'ELOF: Scientific Reasoning',
          [
            N('Gold, silver and bronze are metals. Metals shine when they are polished.'),
            N('(Find something shiny made of metal near you, like a spoon.)'),
          ],
          'Learned that gold, silver and bronze are metals, and that metals shine when polished.',
        ),
      ],
    ),
    sc(
      'a14-07-hall-done',
      [
        AR('Where did you get those clothes? I made them.', 'think'),
        OD('Your daughter gave them to me.'),
        N('You open your mouth, and close it again.'),
        N('Arete sees. She nearly smiles.'),
      ],
      [
        ask(
          3,
          'sel',
          'telling the truth',
          'ELOF: Social and Emotional Development',
          [N('Why is it good to tell the truth?')],
          [
            o(
              'People can trust you',
              [N('Yes. When we tell the truth, friends know they can believe us.')],
              true,
            ),
            o('So you get sweets', [N('Truth is not about sweets. It is about being trusted.')]),
          ],
          'Talked about why telling the truth builds trust.',
        ),
      ],
    ),
    sc(
      'a14-07-bard',
      [
        N('Next day there is a feast with games and dancing.'),
        N('A blind singer, called Demodocus, sings about Troy.'),
        N('He has no book. He sings it all from memory!'),
        N('Odysseus pulls his cloak up over his face. He is crying.'),
        N('Only the king sees.'),
      ],
      [
        notice(
          2,
          'social-studies',
          'long ago, stories were sung and remembered',
          'D2.His.2.K-2',
          [
            N('Long ago, singers learned big stories by heart.'),
            N('They used a beat to help them remember. (Clap a steady beat together.)'),
          ],
          'Learned that long ago stories were sung and remembered, with a beat to help.',
        ),
      ],
      {
        choices: [
          ch('hide', 'Sit closer, to hide him.', [N('He leans a little on your shoulder.')]),
          ch('nubbin', 'Let your Nubbin climb into his lap.', [
            N('Your Nubbin cuddles in. He pats it.'),
          ]),
          ch('listen', 'Listen to the singer.', [N('You listen. The song is long and lovely.')]),
        ],
      },
    ),
    sc(
      'a14-07-bard-done',
      [
        AC('Stop the song, please. A guest is sad.'),
        AC('Stranger, who are you? Tell us your name.', 'soft'),
      ],
      [
        ask(
          1,
          'sel',
          'it is all right to cry',
          'ELOF: Social and Emotional Development',
          [N('Odysseus cried when he heard the song. Is it all right to cry?')],
          [
            o(
              'Yes. Tears are a way to let feelings out',
              [N('Yes. Crying is fine. A friend nearby can help.')],
              true,
            ),
            o('No. Never cry', [N('Everyone cries sometimes, even brave people.')]),
          ],
          'Learned that crying is a normal way to let feelings out.',
        ),
      ],
    ),
    sc(
      'a14-07-name',
      [
        N('He wipes his face and looks round the hall.'),
        OD('I am Odysseus. My home is Ithaca.'),
        OD('It is a rocky island with goats. I love it.'),
        AC('Odysseus! Here! Tell us all about it.', 'shock'),
        AC('And you, the other guest. Where are you from?'),
      ],
      [
        ask(
          1,
          'literacy',
          'first sound of a place name',
          'RF.K.2',
          [N('Ithaca starts with the sound i, i, i. Which word starts the same: igloo or apple?')],
          [
            o('Igloo', [N('Yes! I, i, igloo. I, i, Ithaca.')], true),
            o('Apple', [N('Apple starts with a, a, a. Igloo starts with i, just like Ithaca.')]),
          ],
          'Listened for the first sound of a place name (i for Ithaca and igloo).',
        ),
      ],
      {
        choices: [
          ch('grove', 'Say, “A small valley called the Grove.”', [
            AC('Small places make the best guests.'),
          ]),
          ch('gate', 'Say, “Somewhere with a gate that sticks.”', [
            OD('A gate that sticks! Then you always hear who comes.'),
          ]),
          ch('later', 'Say, “Let him go first.”', [AC('Good manners. Odysseus, begin.')]),
        ],
      },
    ),
    sc(
      'a14-07-complete',
      [
        OD('I will start with the giant.', 'sad'),
        N('He begins. The lamps go dim.'),
        N('The tables turn into rocks. You smell sheep.'),
        N('You go inside his story. Your Nubbin holds your tunic.'),
      ],
      [
        ask(
          1,
          'science',
          'lamps give light in the dark',
          '1-PS4-2',
          [N('The lamps go dim. What do lamps give us in the dark?')],
          [
            o('Light', [N('Yes. Lamps give light so we can see in the dark.')], true),
            o('Rain', [N('Lamps do not give rain. They give light.')]),
          ],
          'Learned that lamps give us light so we can see in the dark.',
        ),
      ],
    ),
  ],
);

// ================================================================== A14-8 Nobody
const A8: EduQuest = quest(
  'a14-08',
  'Nobody',
  {
    'a14-08-s1': { goal: 'Go into the giant’s cave.', hint: 'Climb up to the cave in the cliff.' },
    'a14-08-s2': { goal: 'Give the giant the drink.', hint: 'Carry the bowl to the giant.' },
    'a14-08-s3': {
      goal: 'Get out of the cave under the sheep.',
      hint: 'Hold on under the woolly sheep.',
    },
    'a14-08-s4': {
      goal: 'Decide what to do when he shouts.',
      hint: 'Choose before he takes a deep breath.',
    },
  },
  [
    sc(
      'a14-08-cave',
      [
        N('A cave high above the sea. It is full of cheeses.'),
        N('There are lambs in pens. No one is home.'),
        N('A giant with one eye comes home. He rolls a big stone across the door.'),
        CY('Who are you? Why are you in my cave?', 'angry'),
        N('You are shut in. Your Nubbin’s heart goes thump, thump.'),
      ],
      [
        ask(
          4,
          'sel',
          'what helps when you are scared',
          'ELOF: Social and Emotional Development',
          [N('Your Nubbin is scared. What can help when you feel scared?')],
          [
            o(
              'A slow breath, and a hug',
              [N('Yes. Breathe in slowly and out slowly. Hold someone safe.')],
              true,
            ),
            o('Pretending you are not scared', [
              N('It is fine to be scared. Say so, then breathe slowly.'),
            ]),
          ],
          'Practised a slow breath and a hug when scared.',
        ),
      ],
      {
        choices: [
          ch('hide', 'Hide your Nubbin inside your tunic.', [N('You tuck it in. It feels safe.')]),
          ch('stand', 'Stand next to Odysseus.', [N('He stands between you and the fire.')]),
        ],
      },
    ),
    sc(
      'a14-08-cave-done',
      [
        N('Odysseus thinks and thinks.'),
        OD('The stone is too big for us to move.'),
        OD('We need a clever plan.', 'think'),
      ],
      [
        ask(
          2,
          'science',
          'name the problem before finding a plan',
          'K-2-ETS1-1',
          [N('What is the problem Odysseus must solve: the big stone, or a lost toy?')],
          [
            o(
              'The big stone',
              [N('Yes. The stone blocks the door. A plan must get them past it.')],
              true,
            ),
            o('A lost toy', [N('No toy is lost. The problem is the big stone.')]),
          ],
          'Named the problem to solve (the big stone) before making a plan.',
        ),
      ],
    ),
    sc(
      'a14-08-wine',
      [
        N('Next day, you make a plan with Odysseus.'),
        N('That evening, the giant comes home.'),
        OD('Have a drink, Cyclops.'),
        CY('Thank you! What is your name?', 'happy'),
        OD('My name is Nobody.', 'think'),
        N('The giant yawns, and falls asleep.'),
      ],
      [
        ask(
          4,
          'literacy',
          'first sound of a word',
          'RF.K.2',
          [N('Nobody starts with n, n, n. Which word starts the same: nest or lamp?')],
          [
            o('Nest', [N('Yes! N, n, nest. N, n, Nobody.')], true),
            o('Lamp', [N('Lamp starts with l, l, l. Nest starts with n, just like Nobody.')]),
          ],
          'Listened for the first sound of a word (n for Nobody and nest).',
        ),
      ],
    ),
    sc(
      'a14-08-wine-done',
      [
        N('What happens next is very quick.'),
        N('There is a loud roar! The giant has a sore eye.'),
        N('He cannot see where you are.'),
        N('Your Nubbin hides its face in your side.'),
      ],
      [
        ask(
          3,
          'sel',
          'comfort a scared friend',
          'ELOF: Social and Emotional Development',
          [N('Your Nubbin is frightened by the loud roar. What helps a scared friend?')],
          [
            o(
              'A cuddle and kind words',
              [N('Yes. A cuddle and a calm voice help a scared friend feel safe.')],
              true,
            ),
            o('Laughing at it', [
              N('Laughing can make a scared friend feel worse. A cuddle is better.'),
            ]),
          ],
          'Talked about comforting a scared friend with a cuddle and kind words.',
        ),
      ],
    ),
    sc(
      'a14-08-rams',
      [
        N('Other giants shout, but the first giant says, Nobody hurt me.'),
        N('So they go home.'),
        N('In the morning, Odysseus ties sheep together in threes.'),
        N('A man hangs under each middle sheep.'),
        N('You hold on under a woolly sheep. Your Nubbin holds on too.'),
        N('The giant feels their backs, but not underneath!'),
      ],
      [
        doit(
          2,
          'maths',
          'count a group of three',
          'K.CC.B.5',
          'edu:count:rams:3',
          [
            N('Odysseus ties three sheep together.'),
            N('(Hold up three fingers and count the sheep: one, two, three.)'),
          ],
          'Counted a group of three sheep.',
        ),
      ],
    ),
    sc(
      'a14-08-rams-done',
      [
        N('Out in the daylight, you let go and run.'),
        N('You drive the fat sheep to the ship.'),
        OD('Row! Row now!'),
      ],
      [
        ask(
          1,
          'science',
          'sheep give us wool, which keeps us warm',
          'ELOF: Scientific Reasoning',
          [N('Sheep have thick, soft wool. What does wool do for us?')],
          [
            o('Keeps us warm', [N('Yes. Wool is made into warm clothes and blankets.')], true),
            o('Makes us hungry', [N('Wool does not make us hungry. It keeps us warm.')]),
          ],
          'Learned that sheep give wool, which keeps us warm.',
        ),
      ],
    ),
    sc(
      'a14-08-shout',
      [
        N('The ship sails away.'),
        OD('Cyclops! You should have been kinder to your guests!', 'angry'),
        N('The giant throws a rock with a big splash! It misses.'),
        SA('Captain, stop! Be quiet!', 'shock'),
        N('Odysseus takes a deep breath. He wants to shout his name.'),
      ],
      [
        ask(
          4,
          'sel',
          'what to do when you feel cross',
          'ELOF: Social and Emotional Development',
          [N('Odysseus is cross. What can help when you feel cross?')],
          [
            o(
              'A slow breath, then a quiet word',
              [N('Yes. Breathe in slowly, count to three, then speak kindly.')],
              true,
            ),
            o('Shout as loud as you can', [
              N('Shouting can make a cross feeling bigger. A slow breath is better.'),
            ]),
          ],
          'Practised calming down when cross: a slow breath and a quiet word.',
        ),
      ],
      {
        choices: [
          ch(
            'dont',
            'Ask him to stay quiet.',
            [Y('Please do not shout. Stay quiet.'), OD('You are right. But I cannot help it.')],
            { 'a14-name': 'dont' },
          ),
          ch(
            'shout',
            'Shout with him.',
            [N('You stand beside him and take a big breath.'), OD('Ha! A crew of one, at least.')],
            { 'a14-name': 'shout' },
          ),
          ch(
            'silence',
            'Say nothing.',
            [N('He looks at you. He knows what you are thinking.'), N('He does it anyway.')],
            { 'a14-name': 'silence' },
          ),
        ],
      },
    ),
    sc(
      'a14-08-shout-done',
      [
        OD('Cyclops! My name is Odysseus, from Ithaca!', 'angry'),
        N('The giant is very cross. He asks his dad, the sea god, for help.'),
        CY('Make his trip home long and hard!', 'angry'),
        N('Another rock goes splash! The waves push you out to sea.'),
      ],
      [
        doit(
          3,
          'literacy',
          'sound words',
          'ELOF: Language and Communication',
          'edu:say:sound-words:splash',
          [
            N('The big rock goes splash!'),
            N('(Say splash, splash, splash and make big waves with your hands.)'),
          ],
          'Said a sound word (splash) and moved to it.',
        ),
      ],
    ),
    sc(
      'a14-08-complete',
      [
        N('They row on. No one speaks for a long time.'),
        N('That evening, Odysseus carves a word on a small board.'),
        OD('Here, for the little one. It was so brave.', 'soft'),
        N('The word is Nobody.'),
        OD('I will not use that name again.', 'think'),
      ],
      [
        doit(
          3,
          'maths',
          'count six letters',
          'K.CC.B.5',
          'edu:count:letters:6',
          [
            N('The word is N-O-B-O-D-Y.'),
            N('(Point to each letter and count: one, two, three, four, five, six.)'),
          ],
          'Counted six letters in the word Nobody.',
        ),
      ],
    ),
  ],
);

// ================================================================== A14-9 The Bag of Winds
const A9: EduQuest = quest(
  'a14-09',
  'The Bag of Winds',
  {
    'a14-09-s1': {
      goal: 'Stay a while on the floating island.',
      hint: 'Go up to the hall inside the bronze wall.',
    },
    'a14-09-s2': { goal: 'Keep watch on the bag.', hint: 'Stay near the silver thread.' },
    'a14-09-s3': { goal: 'Go back and ask again.', hint: 'Follow Odysseus to the hall.' },
  },
  [
    sc(
      'a14-09-aeolia',
      [
        N('A floating island, with a wall of bronze.'),
        N('Aeolus keeps all the winds. He lives here with his twelve children.'),
        AE('Tell me about Troy! Tell me everything!', 'happy'),
        N('Odysseus tells stories for a whole month.'),
        AE('Now you can go home. Here is a bag of winds.'),
        N('He ties the bag with a silver thread.'),
        AE('Do not open it. Not ever.', 'think'),
      ],
      [
        ask(
          3,
          'science',
          'wind is moving air',
          'K-ESS2-1',
          [N('Wind is air that moves. Can you see the wind, or only feel it?')],
          [
            o(
              'Feel it, and see what it moves',
              [N('Yes. We cannot see air, but we see leaves and sails move.')],
              true,
            ),
            o('See it like a ball', [
              N('Air is invisible. We see what the wind moves, like leaves.'),
            ]),
          ],
          'Learned that wind is moving air we can feel but not see.',
        ),
      ],
      {
        choices: [
          ch('promise', 'Say, “We will not.”', [AE('Good guest. Off you go.')]),
          ch('inside', 'Ask what is inside.', [AE('Every wind there is, but one.')]),
          ch('sniff', 'Let your Nubbin sniff the bag.', [N('Its ears blow straight back!')]),
        ],
      },
    ),
    sc(
      'a14-09-aeolia-done',
      [N('The west wind fills the sail.'), N('Odysseus steers the ship all by himself.')],
      [
        doit(
          1,
          'maths',
          'count aloud to nine',
          'K.CC.A.1',
          'edu:count:aloud:9',
          [
            N('Odysseus steers for nine days and nine nights.'),
            N('(Count to nine together: one, two, three, up to nine.)'),
          ],
          'Counted aloud to nine.',
        ),
      ],
    ),
    sc(
      'a14-09-bag',
      [
        N('On the tenth day, you see home!'),
        OD('That is home! I can see the smoke!', 'happy'),
        N('He is so tired, he falls asleep.'),
        SA('What is in that bag? I want to look.'),
        SA('Just one little peek!'),
      ],
      [
        ask(
          3,
          'sel',
          'ask before opening what is not yours',
          'ELOF: Social and Emotional Development',
          [N('The sailors want to open the bag. What should they do first?')],
          [
            o(
              'Ask, or wait for Odysseus',
              [N('Yes. Ask first. Things that are not ours are not ours to open.')],
              true,
            ),
            o('Open it quickly', [N('Opening it quickly could cause trouble. Ask or wait first.')]),
          ],
          'Talked about asking before opening something that is not yours.',
        ),
      ],
      {
        choices: [
          ch('wind', 'Say, “It is only the winds.”', [SA('Of course! Move over.')]),
          ch('wake', 'Try to wake Odysseus.', [N('He mumbles about goats. He does not wake.')]),
          ch('sit', 'Sit on the bag.', [N('Two sailors gently lift you off.')]),
        ],
      },
    ),
    sc(
      'a14-09-bag-done',
      [
        N('They untie the silver thread. Whoosh!'),
        N('Every wind comes out at once.'),
        N('The ship spins round. Home gets small, then it is gone.'),
        N('Odysseus wakes. He lies down with his cloak over his face.'),
      ],
      [
        ask(
          2,
          'science',
          'soft breezes and strong winds are different',
          'K-ESS2-1',
          [N('A little breeze is gentle. What is a very strong wind like?')],
          [
            o('Loud and wild', [N('Yes. A strong wind is loud and can push big things.')], true),
            o('Quiet and still', [N('A still day has no wind. A strong wind is loud and wild.')]),
          ],
          'Compared a gentle breeze and a very strong wind.',
        ),
      ],
    ),
    sc(
      'a14-09-again',
      [
        N('The winds blow you back to the floating island.'),
        OD('My crew opened the bag. Please help us again.', 'sad'),
        AE('No. I cannot help you now.', 'angry'),
        N('No one offers you dinner. It is the first shut door.'),
      ],
      [
        ask(
          1,
          'sel',
          'saying sorry and owning a mistake',
          'ELOF: Social and Emotional Development',
          [N('The sailors opened the bag, and that was a mistake. What is a good thing to say?')],
          [
            o(
              'I am sorry. I will make it right',
              [N('Yes. Sorry, and trying to put it right, is brave.')],
              true,
            ),
            o('It was not me', [N('Blaming others does not help. Saying sorry does.')]),
          ],
          'Talked about saying sorry and owning a mistake.',
        ),
      ],
      {
        choices: [
          ch('go', 'Go quietly.', [N('At the door, a little girl gives your Nubbin a fig.')]),
          ch('plead', 'Ask once more, for the crew.', [AE('No. I am sorry. No.')]),
        ],
      },
    ),
    sc(
      'a14-09-complete',
      [
        N('No wind now. They row, day after day.'),
        N('Big grumpy giants chase them out of a harbour. Only one ship gets away.'),
        OD('I was so close to home. I could see the smoke.', 'sad'),
        OD('It hurts more to be close, and not get home.', 'sad'),
      ],
      [
        ask(
          2,
          'literacy',
          'opposite words: close and far',
          'ELOF: Language and Communication',
          [N('Odysseus was close to home. What is the opposite of close?')],
          [
            o('Far', [N('Yes! Close and far are opposites. Near, far.')], true),
            o('Soon', [N('Soon is about time. The opposite of close, near, is far.')]),
          ],
          'Learned that close and far are opposite words.',
        ),
      ],
    ),
  ],
);

// ================================================================== A14-10 Circe
const A10: EduQuest = quest(
  'a14-10',
  'Circe',
  {
    'a14-10-s1': {
      goal: 'Go up into the woods with Odysseus.',
      hint: 'Follow the smoke to the house in the trees.',
    },
    'a14-10-s2': { goal: 'Feed the pigs.', hint: 'Go round the side of the house to the sties.' },
    'a14-10-s3': { goal: 'See the men turned back.', hint: 'Stay by the sty when the door opens.' },
  },
  [
    sc(
      'a14-10-woods',
      [
        N('A woody island, with smoke over the trees.'),
        N('Some sailors went to look. They did not come back.'),
        OD('I will go and see. You can come too.'),
        N('On the path stands Hermes, with a wand.'),
        HM('Take this flower. It will keep you safe.'),
        N('It has a dark root and a white flower.'),
      ],
      [
        ask(
          5,
          'science',
          'roots hold a plant in the ground',
          'K-LS1-1',
          [N('The flower has a root under the ground. What does a root do?')],
          [
            o(
              'Holds the plant and drinks water',
              [N('Yes. Roots hold a plant in the soil and drink water.')],
              true,
            ),
            o('Makes the flower smell', [
              N('Roots hold the plant and drink water. The petals make the smell.'),
            ]),
          ],
          'Learned that roots hold a plant in the ground and take in water.',
        ),
      ],
      {
        choices: [
          ch('thank', 'Thank him as he goes.', [N('He nods, and the path is empty.')]),
          ch('flower', 'Look at the flower.', [
            N('It is plain and white. Odysseus holds it like a lamp.'),
          ]),
        ],
      },
    ),
    sc(
      'a14-10-woods-done',
      [
        N('The house is made of smooth stone.'),
        N('Wolves and lions come up, wagging their tails.'),
        N('Your Nubbin peeks out. A lion licks it from head to toe.'),
        N('It comes out shiny, and very surprised.'),
      ],
      [
        ask(
          2,
          'sel',
          'name feelings: nervous and curious',
          'ELOF: Social and Emotional Development',
          [N('Your Nubbin hides, and peeks out. How does it feel?')],
          [
            o('A bit nervous, and a bit curious', [N('Yes. It can feel two ways at once.')], true),
            o('Sleepy', [N('Sleepy ones do not peek. Your Nubbin feels nervous and curious.')]),
          ],
          'Named mixed feelings (nervous and curious) from a character’s actions.',
        ),
      ],
    ),
    sc(
      'a14-10-sty',
      [
        N('You go round the side of the house.'),
        N('There are lots of pigs in the pens. Four are by the fence.'),
        N('They look sad. They are really sailors, under a spell.'),
        N('You feed them acorns. Your Nubbin sits with them.'),
      ],
      [
        doit(
          1,
          'maths',
          'count four pigs',
          'K.CC.B.5',
          'edu:count:pigs:4',
          [
            N('There are four pigs by the fence.'),
            N('(Count the four pigs together: one, two, three, four.)'),
          ],
          'Counted four pigs to answer how many.',
        ),
      ],
      {
        choices: [
          ch('talk', 'Feed them, and chat to them.', [N('One stops crying to listen.')]),
          ch('scratch', 'Feed them, and scratch their ears.', [N('They lean in. It feels nice.')]),
          ch('nubbin', 'Let your Nubbin lie in the straw.', [
            N('The pigs gather round it, snuggly.'),
          ]),
        ],
      },
    ),
    sc(
      'a14-10-sty-done',
      [
        N('From inside the house comes a shout.'),
        N('Then a woman cries, Oh! She sounds very surprised.'),
      ],
      [
        doit(
          0,
          'literacy',
          'animal sounds',
          'ELOF: Language and Communication',
          'edu:say:sound-word:oink',
          [N('Pigs go oink, oink!'), N('(Oink like a pig together.)')],
          'Made an animal sound (oink).',
        ),
      ],
    ),
    sc(
      'a14-10-change',
      [
        N('The door opens. Circe stands there, with Odysseus.'),
        CI('Odysseus! You are the clever one. Come in.'),
        N('She touches each pig gently.'),
        N('They turn back into sailors, laughing and crying.'),
        N('The youngest sailor shakes your hand. He remembers the acorns.'),
      ],
      [
        ask(
          4,
          'sel',
          'saying thank you',
          'ELOF: Social and Emotional Development',
          [N('The sailor shakes your hand to say thank you. Which kind word says thank you?')],
          [
            o('Thank you', [N('Yes. Thank you is a kind word. A smile says it too.')], true),
            o('Go away', [N('Go away is not kind. Thank you is.')]),
          ],
          'Practised saying thank you.',
        ),
      ],
    ),
    sc(
      'a14-10-complete',
      [
        CI('Stay and eat until you are strong again.', 'soft'),
        N('They stay for a whole year.'),
        N('Spring, summer, autumn, winter.'),
        OD('A whole year! I did not count.', 'sad'),
        N('Odysseus sits down. He puts his head in his hands.'),
      ],
      [
        ask(
          2,
          'science',
          'four seasons make a year',
          'K-ESS2-1',
          [N('Spring, summer, autumn, winter. How many seasons in a year?')],
          [
            o('Four', [N('Yes. Four seasons make a year. (Hold up four fingers.)')], true),
            o('Two', [N('There are four: spring, summer, autumn and winter.')]),
          ],
          'Learned that a year has four seasons.',
        ),
      ],
    ),
  ],
);

// ================================================================== A14-11 The House of the Dead
const A11: EduQuest = quest(
  'a14-11',
  'The House of the Dead',
  {
    'a14-11-s1': { goal: 'Sail to the edge of the world.', hint: 'Wait under the willows.' },
    'a14-11-s2': {
      goal: 'Stay near while the misty people come.',
      hint: 'Sit quietly under the willows.',
    },
    'a14-11-s3': {
      goal: 'Sit with him afterwards.',
      hint: 'Stay under the willows until he comes back.',
    },
  },
  [
    sc(
      'a14-11-edge',
      [
        N('This part of the story is sad and gentle. You can stop any time.'),
        N('The ship sails to a misty land at the edge of the world.'),
        N('Odysseus goes on alone to do something important.'),
        OD('Wait here by the trees, with the little one.', 'soft'),
        N('You sit under a willow with your Nubbin on your lap.'),
        N('The page is grey, like paper left out in the rain.'),
      ],
      [
        notice(
          0,
          'sel',
          'sad stories are allowed',
          'ELOF: Social and Emotional Development',
          [
            N('If a story makes you sad, that is all right. It means you care.'),
            N('You can have a cuddle, or take a slow breath.'),
            N('You can tell a grown-up how you feel.'),
          ],
          'Was told that feeling sad at a sad story is fine, and that a cuddle, a breath or talking can help.',
        ),
      ],
    ),
    sc(
      'a14-11-edge-done',
      [
        N('Then they come: shadowy, misty people, from long ago.'),
        N('They make a sound like birds far away.'),
        N('They do not frighten you. They are only sad.'),
      ],
      [
        doit(
          1,
          'literacy',
          'sound words',
          'ELOF: Language and Communication',
          'edu:say:sound-word:tweet',
          [N('Birds go tweet, tweet.'), N('(Tweet softly like a bird far away.)')],
          'Said a sound word (tweet) softly, like a faraway bird.',
        ),
      ],
    ),
    sc(
      'a14-11-shades',
      [
        N('A wise old man comes first. He cannot see, but he knows many things.'),
        TI('Be careful at home, Odysseus. It will not be easy.'),
        N('Then a woman comes out of the mist.'),
        OD('Mum? Is it you?', 'shock'),
        N('Odysseus’s mum has died. That means her body stopped working.'),
        N('It will not start again. She is a memory in the mist.'),
        AM('I missed you, my son. I love you very much.', 'soft'),
        AM('Your wife and son are waiting for you.', 'soft'),
      ],
      [
        ask(
          5,
          'sel',
          'what helps when someone is sad',
          'ELOF: Social and Emotional Development',
          [N('Odysseus is very sad about his mum. What helps when we are sad?')],
          [
            o(
              'A hug, and someone beside us',
              [
                N(
                  'Yes. We can be sad and still be loved. We can always remember the people we love.',
                ),
              ],
              true,
            ),
            o('Pretending we are not sad', [
              N('It is all right to feel sad. A hug and a friend beside us help most.'),
            ]),
          ],
          'Talked about what helps when we are sad: a hug and a friend, and remembering people we love.',
        ),
      ],
    ),
    sc(
      'a14-11-shades-done',
      [
        N('Odysseus tries to hug her. His arms go through the mist.'),
        OD('Mum, why can’t you stay?', 'sad'),
        AM('I cannot, my child. Go back to the light.', 'soft'),
        AM('Remember me. Tell your wife about me.', 'soft'),
      ],
      [
        ask(
          3,
          'social-studies',
          'telling stories keeps people remembered',
          'D2.His.2.K-2',
          [N('Odysseus’s mum says, remember me. How can we remember someone we love?')],
          [
            o(
              'Tell stories about them',
              [N('Yes. When we tell stories about someone, they stay in our hearts.')],
              true,
            ),
            o('Forget them', [N('We do not have to forget. Telling stories keeps them close.')]),
          ],
          'Learned that telling stories helps us remember people we love.',
        ),
      ],
    ),
    sc(
      'a14-11-after',
      [
        N('The misty people go back down.'),
        N('Odysseus walks to the willows and sits beside you.'),
        N('He does not say anything. His hands are open.'),
        OD('She asked about everyone else. Not about herself.', 'sad'),
        N('Your Nubbin looks at you, as if to ask what to do.'),
        N('You remember what Hazel did. She just sat beside someone.'),
      ],
      [
        ask(
          5,
          'sel',
          'sit beside a sad friend',
          'ELOF: Social and Emotional Development',
          [N('Odysseus is sad. What helps a sad friend most?')],
          [
            o(
              'Sit beside them, quietly',
              [N('Yes. You do not need words. Being there helps.')],
              true,
            ),
            o('Tell them to cheer up', [
              N('Cheer up can feel hard for a sad friend. Sitting beside them is kinder.'),
            ]),
          ],
          'Learned that sitting quietly beside a sad friend is a kind way to help.',
        ),
      ],
      {
        choices: [
          ch('sit', 'Sit with him. That is all.', [
            OD('Thank you. I could not bear anyone talking.'),
          ]),
          ch('sorry', 'Say, “I am sorry about your mum.”', [OD('So am I. She loved me.')]),
          ch('nubbin', 'Let your Nubbin climb into his hands.', [
            N('It is warm and solid in his open hands.'),
          ]),
        ],
      },
    ),
    sc(
      'a14-11-complete',
      [
        N('In the morning, you sail back to Circe’s island.'),
        N('Odysseus watches the grey land fade away.'),
        OD('My dad, my son and my wife are waiting.', 'soft'),
        OD('I will go home to them.'),
      ],
      [
        doit(
          2,
          'maths',
          'count three family members',
          'K.CC.B.5',
          'edu:count:family:3',
          [
            N('Dad, son and wife: three people waiting.'),
            N('(Count the three on your fingers together.)'),
          ],
          'Counted three people to answer how many.',
        ),
      ],
    ),
  ],
);

// ================================================================== A14-12 The Sirens
const A12: EduQuest = quest(
  'a14-12',
  'The Sirens',
  {
    'a14-12-s1': { goal: 'Hear Circe’s advice.', hint: 'Walk with them along the shore.' },
    'a14-12-s2': {
      goal: 'Let him put wax in your ears.',
      hint: 'Sit on the bench and keep still.',
    },
    'a14-12-s3': {
      goal: 'Watch him at the mast as the ship rows past.',
      hint: 'Stay on the bench. You will not hear a thing.',
    },
  },
  [
    sc(
      'a14-12-advice',
      [
        N('Circe takes Odysseus aside.'),
        CI('Some women sing beautiful songs by the sea.'),
        CI('Sailors who listen forget to go home.'),
        CI('Put soft wax in your friends’ ears. Then they cannot hear.'),
        CI('If you want to listen, your friends can tie you to the mast.'),
        N('Odysseus promises to be careful.'),
      ],
      [
        ask(
          3,
          'science',
          'soft wax keeps sound out',
          '1-PS4-1',
          [
            N(
              'Wax is soft and squashy. With wax in your ears, does the world sound louder or quieter?',
            ),
          ],
          [
            o('Quieter', [N('Yes. The wax fills up your ears, so less sound gets in.')], true),
            o('Louder', [
              N('Wax makes sound softer, not louder. It blocks the way into your ears.'),
            ]),
          ],
          'Learned that wax in the ears blocks sound, so the world sounds quieter.',
        ),
      ],
      {
        choices: [
          ch('wax', 'Ask if you need wax too.', [CI('Yes, little guest. And the small one.')]),
          ch('why', 'Ask Odysseus why he wants to listen.', [
            OD('I am curious. I always have been.'),
          ]),
        ],
      },
    ),
    sc(
      'a14-12-advice-done',
      [N('In the morning, Circe waves goodbye.'), N('A fair wind pushes the ship out to sea.')],
      [
        ask(
          1,
          'literacy',
          'rhyming words',
          'RF.K.2',
          [N('Ship rhymes with a word. Which one: trip or ball?')],
          [
            o('Trip', [N('Yes! Ship and trip rhyme. Ship, trip, dip.')], true),
            o('Ball', [N('Ball ends in all. Ship ends in ip, like trip.')]),
          ],
          'Found a rhyme for ship (trip).',
        ),
      ],
    ),
    sc(
      'a14-12-wax',
      [
        N('The wind drops. The sea is flat like a plate.'),
        N('Odysseus makes a soft cake of wax with his warm hands.'),
        OD('Ears, everyone! Even you, little guest.'),
        N('He puts wax in the sailors’ ears.'),
        N('Then in your ears, and in your Nubbin’s. The world goes quiet.'),
        N('The sailors tie Odysseus to the mast.'),
      ],
      [
        doit(
          4,
          'maths',
          'count six ears',
          'K.CC.B.5',
          'edu:count:ears:6',
          [
            N('You, Odysseus and your Nubbin each have two ears.'),
            N('(Count all the ears together: one, two, three, four, five, six.)'),
          ],
          'Counted six ears (three friends with two ears each).',
        ),
      ],
    ),
    sc(
      'a14-12-wax-done',
      [N('Your Nubbin keeps touching its ears, in case they have gone.')],
      [
        ask(
          0,
          'health',
          'wax and covered ears keep sound out',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('Wax is in the sailors’ ears. Is the world quiet or loud for them?')],
          [
            o(
              'Quiet',
              [N('Yes. Wax blocks sound. Covering your ears also keeps loud noise away.')],
              true,
            ),
            o('Loud', [N('Wax makes it quieter, not louder. Covering ears protects them from noise.')]),
          ],
          'Learned that covering your ears keeps sound out.',
        ),
      ],
    ),
    sc(
      'a14-12-sirens',
      [
        N('A green meadow slides past. Two women sit and sing.'),
        N('You hear nothing at all.'),
        N('Odysseus pulls at the ropes.'),
        N('His friends keep rowing, all together.'),
        N('They tie the rope tighter, just as he asked.'),
        N('Soon the meadow is far behind.'),
      ],
      [
        ask(
          3,
          'sel',
          'working together',
          'ELOF: Social and Emotional Development',
          [N('The sailors row all together. Why is it good to work together?')],
          [
            o(
              'We can do big things as a team',
              [N('Yes. Together, the sailors get past safely.')],
              true,
            ),
            o('It is not good', [N('Teams can do things no one can do alone.')]),
          ],
          'Talked about how teamwork helps people get big jobs done.',
        ),
      ],
      {
        choices: [
          ch('look', 'Keep looking at him.', [N('He sees you, and it helps him hold on.')]),
          ch('away', 'Look away, at the sea.', [N('The sea is flat and blue.')]),
          ch('paws', 'Hold your Nubbin’s paws over its ears.', [
            N('It puts its paws over your ears too.'),
          ]),
        ],
      },
    ),
    sc(
      'a14-12-sirens-done',
      [
        N('The men take the wax out of their ears, and untie him.'),
        OD('They sang so sweetly! They sang high, like birds.', 'soft'),
      ],
      [
        ask(
          1,
          'music',
          'high and low sounds',
          'ELOF: Scientific Reasoning',
          [N('A bird tweets high. A big drum goes boom, low. Which sound is high?')],
          [
            o('The bird', [N('Yes. A bird’s tweet is high, and a drum’s boom is low.')], true),
            o('The drum', [N('A drum goes boom, which is low. A bird’s tweet is high.')]),
          ],
          'Told a high sound (a bird) from a low sound (a drum).',
        ),
      ],
    ),
    sc(
      'a14-12-complete',
      [
        N('He rubs his sore wrists.'),
        OD('Was it quiet on your side?'),
        Y('Very.'),
        OD('Quiet is peaceful. I am glad you are safe.', 'think'),
      ],
      [
        ask(
          2,
          'literacy',
          'opposite words: quiet and loud',
          'ELOF: Language and Communication',
          [N('Very quiet. What is the opposite of quiet?')],
          [
            o('Loud', [N('Yes! Quiet and loud are opposites.')], true),
            o('Little', [N('Little is about size. The opposite of quiet is loud.')]),
          ],
          'Learned that quiet and loud are opposite words.',
        ),
      ],
    ),
  ],
);

// ================================================================== A14-13 Scylla and Charybdis
const A13: EduQuest = quest(
  'a14-13',
  'Scylla and Charybdis',
  {
    'a14-13-s1': {
      goal: 'Watch the strait as he steers by the cliff.',
      hint: 'Stay low on the bench and keep rowing.',
    },
    'a14-13-s2': {
      goal: 'Land on the island of the Sun.',
      hint: 'Go ashore, and keep away from the cows.',
    },
    'a14-13-s3': { goal: 'Hold on to the fig tree.', hint: 'Grab the tree and hang on.' },
  },
  [
    sc(
      'a14-13-strait',
      [
        N('Two big rocks stand on each side of a narrow strait.'),
        N('On one side, the sea swirls round and round, down a deep hole.'),
        N('On the other side, a scary shape hides in a cave.'),
        OD('Row close to the cliff. Do not look up. Row!', 'angry'),
        N('The sailors duck low and row hard.'),
        N('Some of the sailors are lost. That means they died.'),
        N('That is very sad, and Odysseus is sad too. You hold hands.'),
      ],
      [
        notice(
          1,
          'science',
          'water swirls when it is squeezed through a narrow place',
          'ELOF: Scientific Reasoning',
          [
            N('Water can swirl round and round when it is squeezed through a narrow place.'),
            N('(Swirl your finger in the air, round and round.)'),
          ],
          'Learned that water swirls when squeezed through a narrow place.',
        ),
      ],
    ),
    sc(
      'a14-13-strait-done',
      [
        N('The strait opens out. Behind you, the sea swirls and roars.'),
        N('Ahead is a green island, with cows on it.'),
      ],
      [
        ask(
          1,
          'literacy',
          'animal sounds',
          'ELOF: Language and Communication',
          [N('A cow goes moo. Which animal goes baa?')],
          [
            o('A sheep', [N('Yes! Sheep go baa, cows go moo.')], true),
            o('A dog', [N('Dogs go woof. Sheep go baa.')]),
          ],
          'Matched animals to their sounds (cow: moo, sheep: baa).',
        ),
      ],
    ),
    sc(
      'a14-13-island',
      [
        N('It is the island of the Sun, with fat cows.'),
        OD('We sail past. We do not touch the cows.', 'think'),
        EL('We are tired and hungry. Let us stop!', 'angry'),
        N('They stop, and promise not to touch the cows.'),
        N('The wind blows the wrong way for a month. The food runs out.'),
        N('Odysseus goes to ask the gods for help, and falls asleep.'),
        N('The sailors are very hungry.'),
      ],
      [
        ask(
          6,
          'sel',
          'keeping a promise even when it is hard',
          'ELOF: Social and Emotional Development',
          [
            N(
              'The sailors promised not to touch the cows, but they are hungry. What is a good thing to do?',
            ),
          ],
          [
            o(
              'Keep the promise, and ask for help',
              [N('Yes. Keeping a promise is brave, and a friend can help us find another way.')],
              true,
            ),
            o('Break the promise', [
              N('Breaking a promise can cause trouble. Asking for help is better.'),
            ]),
          ],
          'Talked about keeping a promise even when it is hard, and asking for help.',
        ),
      ],
      {
        choices: [
          ch('fetch', 'Go and find Odysseus.', [
            N('He is asleep in a hollow. You shake him awake.'),
          ]),
          ch('argue', 'Stay and talk to the crew.', [
            EL('We are too hungry!'),
            N('No one listens.'),
          ]),
          ch('herd', 'Stand with the cows.', [N('The men walk round you, politely.')]),
        ],
      },
    ),
    sc(
      'a14-13-island-done',
      [
        N('Odysseus comes back. The hungry sailors have eaten some of the cows!'),
        N('He cries out. Far above, the Sun is sad too.'),
        N('The Sun goes down, and the sky turns dark. The stars come out.'),
      ],
      [
        ask(
          0,
          'science',
          'day and night',
          '1-ESS1-1',
          [N('The Sun goes down, and then it is dark. When is it dark?')],
          [
            o('At night', [N('Yes. The Sun shines in the day. At night, we see the stars.')], true),
            o('At lunchtime', [N('At lunchtime, the Sun is up high. It is dark at night.')]),
          ],
          'Learned that it is light in the day and dark at night.',
        ),
      ],
    ),
    sc(
      'a14-13-fig',
      [
        N('Six days the sailors eat. Then they sail.'),
        N('A black cloud comes, and a big storm hits the ship.'),
        N('The ship breaks apart, and the sailors die.'),
        N('That is very sad. It is all right to feel sad.'),
        N('Odysseus is shaking, so you hold on to him.'),
        N('You cling to the mast. All night the wind carries you back.'),
        N('At dawn you are at the swirl again.'),
        N('Odysseus grabs a fig tree and hangs on. You hold his hand.'),
        N('You can only hang on, and wait.'),
      ],
      [
        notice(
          8,
          'sel',
          'it is all right to feel sad, and to hold on to someone',
          'ELOF: Social and Emotional Development',
          [
            N('It is all right to feel sad. It helps to hold on to someone.'),
            N('You held on to Odysseus, and he held on to you.'),
          ],
          'Heard that it is all right to feel sad, and that holding on to someone helps.',
        ),
      ],
      {
        choices: [
          ch('hang', 'Hang on.', [
            N('Your arms are tired. Odysseus talks about goats, so you do not let go.'),
          ]),
          ch('count', 'Count, to help the time pass.', [
            N('You count and count. Odysseus counts with you.'),
          ]),
          ch('look', 'Look at Odysseus.', [N('He is calm. You decide to believe him.')]),
        ],
      },
    ),
    sc(
      'a14-13-fig-done',
      [
        N('You hold on, and you count together. It helps a little.'),
        N('The swirl spits the mast out. Up it pops, because wood floats!'),
        N('Odysseus drops onto the wood, and you follow.'),
        N('He paddles away with his hands.'),
      ],
      [
        doit(
          0,
          'maths',
          'count aloud to ten',
          'K.CC.A.1',
          'edu:count:aloud:10',
          [N('Count to ten together, nice and slow.'), N('(Count to ten, as you hold on.)')],
          'Counted aloud to ten.',
        ),
        ask(
          1,
          'science',
          'wood floats on water',
          'ELOF: Scientific Reasoning',
          [N('The mast came up out of the swirl. Does wood float or sink in water?')],
          [
            o('It floats', [N('Yes. Wood floats, so the mast pops up. Your plank floated too.')], true),
            o('It sinks', [N('A stone sinks. Wood floats, and that is why the mast came back up.')]),
          ],
          'Learned that wood floats on water.',
        ),
      ],
    ),
    sc(
      'a14-13-complete',
      [
        N('Nine days he drifts, until he reaches an island.'),
        N('The page turns back. You are in the hall again.'),
        OD('That is my story. I do not like to tell it twice.', 'soft'),
        N('No one speaks for a long time.'),
        AC('Tomorrow you go home, with gifts from all of us.'),
      ],
      [
        ask(
          1,
          'literacy',
          'who tells the story',
          'RL.K.3',
          [N('Who told all those adventures to the people in the hall?')],
          [
            o(
              'Odysseus',
              [N('Yes! Odysseus told them. A story can sit inside another story.')],
              true,
            ),
            o('The loom', [N('Looms do not talk. Odysseus told the stories.')]),
          ],
          'Told who the storyteller is in a story told inside a story.',
        ),
      ],
    ),
  ],
);

// ================================================================== A14-14 Home Asleep
const HARBOUR_SPROUT: Line[] = [
  N('He wakes in the mist. He does not know where he is.'),
  OD('Where am I? Is this a strange shore?', 'angry'),
  N('A young shepherd comes along.'),
  SH('This is Ithaca. Even far away, people have heard of Ithaca.'),
  N('Odysseus is so happy. He tells the shepherd a pretend story, to stay safe for now.'),
  N('The shepherd smiles, and turns into Athena.'),
  AT('A pretend story to stay safe. Only this once.'),
  N('Odysseus tries to look honest. It is not his best face.'),
  AT('You cannot help being clever, Odysseus. Look! Your harbour, your tree, your hill.', 'soft'),
  N('Odysseus kneels and kisses the ground.'),
  AT('Bad guests are in your house. Keep who you are secret, for now.'),
  N('She touches him with her wand. He is an old beggar!'),
  BG('Well. No one will know me now. Not even Nobody!', 'think'),
  N('Your Nubbin giggles. It remembers the giant.'),
];
const harbourBeatsS = (): Beat[] => [
  doit(
    3,
    'literacy',
    'clap the beats in a word',
    'RF.K.2',
    'edu:clap:syllables:ithaca',
    [
      N('The island is called Ithaca. It has three beats: Ith-a-ca.'),
      N('(Clap the three beats together.)'),
    ],
    'Clapped the three syllables in the word Ithaca.',
  ),
];
const A14: EduQuest = quest(
  'a14-14',
  'Home Asleep',
  {
    'a14-14-s1': {
      goal: 'Sail with the Phaeacians to Ithaca.',
      hint: 'Sit in the stern beside him.',
    },
    'a14-14-s2': { goal: 'Stay with him when he wakes.', hint: 'Wait on the sand beside him.' },
  },
  [
    sc(
      'a14-14-ship',
      [
        N('The ship sails fast and smooth, all night.'),
        N('Odysseus sleeps on a rug. He has earned it.'),
        N('You sit beside him and watch the stars.'),
        N('Before dawn, you see a dark shape: an island.'),
        N('It is Ithaca, his home.'),
      ],
      [
        ask(
          3,
          'social-studies',
          'an island has water all around it',
          'D2.Geo.2.K-2',
          [N('Ithaca is an island. What is all around an island?')],
          [
            o('Water', [N('Yes. An island is land with water all around it.')], true),
            o('Sand only', [N('There may be sand, but what is all around is water.')]),
          ],
          'Recalled that an island is land with water all around it.',
        ),
      ],
      {
        choices: [
          ch('cloak', 'Pull his cloak up over his shoulder.', [
            N('He does not wake. He mumbles about a dog.'),
          ]),
          ch('stars', 'Watch the stars.', [
            N('The dawn star comes up. The ship sails into harbour.'),
          ]),
          ch('sleep', 'Sleep too.', [
            N('You dream of a gate, and someone lifting and pushing it.'),
          ]),
        ],
      },
    ),
    sc(
      'a14-14-ship-done',
      [
        N('In the bay, an olive tree grows beside a cave.'),
        N('Bees keep honey there.'),
        N('The sailors lay Odysseus gently on the sand, still asleep.'),
        N('They leave his gifts under the olive tree, and go.'),
      ],
      [
        ask(
          1,
          'science',
          'bees visit flowers',
          '2-LS2-2',
          [N('Bees make honey. What do bees visit to get food?')],
          [
            o('Flowers', [N('Yes. Bees drink nectar from flowers, and carry pollen too.')], true),
            o('Rocks', [N('Rocks have no nectar. Bees visit flowers.')]),
          ],
          'Learned that bees visit flowers to collect nectar.',
        ),
      ],
    ),
    sc(
      'a14-14-harbour',
      [...HARBOUR_SPROUT, BG('You told me once to keep my name. I am keeping it now.', 'soft')],
      harbourBeatsS(),
    ),
    sc(
      'a14-14-harbour-done',
      [
        N('Together you hide his gifts in a cave: gold, bronze and cloth.'),
        N('Athena puts a stone across the door.'),
        AT('Go to the swineherd. He is true.'),
        N('She is gone. The beggar leans on his staff.'),
      ],
      [
        doit(
          0,
          'maths',
          'count three gifts',
          'K.CC.B.5',
          'edu:count:gifts:3',
          [
            N('Gold, bronze, cloth: three gifts.'),
            N('(Count the three gifts on your fingers together.)'),
          ],
          'Counted three things to answer how many.',
        ),
      ],
    ),
    sc(
      'a14-14-complete',
      [
        N('You walk up from the harbour on a rough track.'),
        BG('I fell off that rock when I was six!', 'soft'),
        N('He touches an olive tree. Your Nubbin does too.'),
        BG('I am home. But I cannot tell anyone yet.', 'sad'),
      ],
      [
        ask(
          3,
          'sel',
          'two feelings at once: happy and lonely',
          'ELOF: Social and Emotional Development',
          [N('Odysseus is home, but he cannot tell anyone. Which words fit how he feels?')],
          [
            o('Happy and a little lonely', [N('Yes. You can feel two feelings at once.')], true),
            o('Only cross', [N('He is happy to be home, and a little lonely. Both are true.')]),
          ],
          'Named two feelings at once (happy and lonely) for a character.',
        ),
      ],
    ),
  ],
);

// ================================================================== A14-15 The Swineherd
const A15: EduQuest = quest(
  'a14-15',
  'The Swineherd',
  {
    'a14-15-s1': { goal: 'Go to the swineherd’s hut.', hint: 'Climb the track to the stone yard.' },
    'a14-15-s2': {
      goal: 'Help Eumaeus with the pigs.',
      hint: 'Pour the acorns and herd the piglets.',
    },
    'a14-15-s3': {
      goal: 'Be there when Telemachus comes home.',
      hint: 'Stay in the hut when the dogs go quiet.',
    },
  },
  [
    sc(
      'a14-15-hut',
      [
        N('On a hill, a yard with stone walls.'),
        N('There are pig houses, and four big dogs.'),
        N('The dogs rush at the old beggar, barking!'),
        N('A man runs out and shoos the dogs away.'),
        EU('Oh, old man! Come in. Sit down. Eat first.'),
        N('He gives you the best food he has.'),
        BG('Thank you, friend.', 'soft'),
        EU('Everyone is welcome here, even when I have little.'),
      ],
      [
        doit(
          1,
          'maths',
          'count four dogs',
          'K.CC.B.5',
          'edu:count:dogs:4',
          [
            N('There are four big dogs in the yard.'),
            N('(Count the four dogs together: one, two, three, four.)'),
          ],
          'Counted four dogs to answer how many.',
        ),
      ],
      {
        choices: [
          ch('alive', 'Say, “He might still be alive.”', [
            EU('Many say that. I stopped believing.'),
          ]),
          ch('master', 'Ask Eumaeus about his master.', [EU('He was kind. He gave me this hut.')]),
          ch('eat', 'Eat, and let the beggar talk.', [
            BG('He will come home. This very year.'),
            EU('I will believe it when I see it.'),
          ]),
        ],
      },
    ),
    sc(
      'a14-15-hut-done',
      [
        BG('He will come home, between the old moon and the new.'),
        BG('If he comes, give me a cloak.'),
        EU('Ha! No, old man. Eat.', 'happy'),
      ],
      [
        ask(
          0,
          'science',
          'the Moon changes shape',
          '1-ESS1-1',
          [
            N(
              'The beggar said, between the old moon and the new. Is the Moon always the same shape?',
            ),
          ],
          [
            o(
              'No. It changes shape',
              [N('Yes. Sometimes round and full, sometimes a thin slice.')],
              true,
            ),
            o('Yes, always round', [
              N('The Moon seems to change, from a thin slice to a big round circle.'),
            ]),
          ],
          'Learned that the Moon seems to change shape over the month.',
        ),
      ],
    ),
    sc(
      'a14-15-pigs',
      [
        N('At evening, the pigs come home to their pens.'),
        EU('Help me pour the acorns. Mind the big one.'),
        N('Your Nubbin herds the piglets into the wrong pen.'),
        EU('Not that one. That one. There!', 'happy'),
        N('The night is cold and wet. The beggar shivers.'),
        N('Eumaeus finds him a warm cloak.'),
        N('Then Eumaeus goes out into the rain, to sleep by the pigs.'),
      ],
      [
        ask(
          6,
          'sel',
          'caring for others, even when it is cold and wet',
          'ELOF: Social and Emotional Development',
          [
            N(
              'Eumaeus gave his guest a warm cloak. Then he went out in the rain to mind the pigs. Why?',
            ),
          ],
          [
            o(
              'Because he cares for his guest and his pigs',
              [N('Yes. He looks after everyone in his care, even when it is cold and wet.')],
              true,
            ),
            o('Because he likes rain', [
              N('He gave his guest the cloak, and went out to mind the pigs.'),
              N('He cares for them all.'),
            ]),
          ],
          'Talked about kindness: looking after others, even when it is uncomfortable.',
        ),
      ],
      {
        choices: [
          ch('out', 'Go out with Eumaeus.', [
            N('The pigs are warm and smelly. He makes room for you.'),
          ]),
          ch('in', 'Stay inside with the beggar.', [BG('Look at him go. For his pigs!')]),
          ch('cloak', 'Offer Eumaeus your cloak.', [EU('Keep it, guest. I am used to the rain.')]),
        ],
      },
    ),
    sc(
      'a14-15-pigs-done',
      [
        N('In the hut, the beggar lies under the borrowed cloak.'),
        N('He lies awake, watching the door.'),
      ],
      [
        ask(
          0,
          'science',
          'a cloak keeps your own warmth in',
          'ELOF: Scientific Reasoning',
          [N('A thick cloak keeps you warm. Does it make heat, or hold in your own heat?')],
          [
            o(
              'It holds in your own heat',
              [N('Yes. A cloak holds your own body’s warmth close.')],
              true,
            ),
            o('It makes a fire', [N('A cloak does not make fire. It holds your warmth in.')]),
          ],
          'Learned that clothes keep us warm by holding in our own body warmth.',
        ),
      ],
    ),
    sc(
      'a14-15-son',
      [
        N('One morning, the dogs do not bark. They whine with joy.'),
        N('It is Telemachus, home from Sparta!'),
        N('Eumaeus kisses his head and his hands.'),
        TM('I came here first. Is my mum all right?'),
        EU('She is still waiting for you.', 'soft'),
        N('Someone stands at the edge of the yard.'),
        N('The beggar goes out to her.'),
        N('When he comes back, he is tall, in clean clothes.'),
        OD('I am your father. I came home.', 'soft'),
      ],
      [
        ask(
          2,
          'sel',
          'happy tears are real',
          'ELOF: Social and Emotional Development',
          [
            N(
              'Eumaeus is so glad he kisses Telemachus’s head. Can people cry when they are happy?',
            ),
          ],
          [
            o(
              'Yes. Happy tears are real',
              [N('Yes. Tears can come when we are very happy, too.')],
              true,
            ),
            o('No. Tears are only sad', [
              N('Tears can be happy tears. Many people cry when they are glad.'),
            ]),
          ],
          'Learned that people can cry happy tears.',
        ),
      ],
    ),
    sc(
      'a14-15-son-done',
      [
        N('Telemachus and his dad hug and cry.'),
        N('You and your Nubbin sit on the wall, and let them be.'),
      ],
      [
        ask(
          0,
          'literacy',
          'rhyming words',
          'RF.K.2',
          [N('Dad rhymes with glad. Which word rhymes too: sad or tree?')],
          [
            o('Sad', [N('Yes! Dad, glad and sad all rhyme.')], true),
            o('Tree', [N('Tree ends in ee. Dad, glad and sad all end in ad.')]),
          ],
          'Found rhymes for dad (glad, sad).',
        ),
      ],
    ),
    sc(
      'a14-15-complete',
      [
        OD('Tell no one yet.', 'think'),
        TM('There are lots of bad guests, and only two of us.', 'sad'),
        OD('Two, and the guest. That makes three.'),
        N('Three friends, and Athena helping.'),
      ],
      [
        ask(
          2,
          'maths',
          'add two and one',
          'K.OA.A.2',
          [N('Two of them, and one guest. How many is that?')],
          [
            o('Three', [N('Yes! 2 and 1 make 3. (Hold up three fingers.)')], true),
            o('Two', [N('Two is only Odysseus and his son. Add the guest: 2 and 1 make 3.')]),
          ],
          'Added 2 + 1 to make 3.',
        ),
      ],
    ),
  ],
);

// ================================================================== A14-16 Argos
const GATE_S: Line[] = [
  N('Outside the gate is a heap, and on it lies an old dog.'),
  N('He is thin, and no one looks after him now.'),
  EU('That is Argos. He was the best hunting dog.', 'sad'),
  N('The old dog lifts his head. His nose twitches.'),
  N('He knows! After twenty years, he knows his master.'),
  N('His ears go flat and his tail wags. He cannot get up.'),
  N('The beggar cannot go to him, or everyone will know.'),
];
const GATE_S_END: Line[] = [
  EU('Come on, old man.'),
  N('They go in through the gate. He does not look back.'),
];
const gateBeatsS = (): Beat[] => [
  ask(
    5,
    'literacy',
    'words that show feelings: a wagging tail',
    'RL.1.4',
    [N('Argos’s tail wags and his ears go flat. What does a wagging tail show?')],
    [
      o(
        'He is happy',
        [N('Yes. A wagging tail shows a dog is glad. Argos is so glad to see his friend.')],
        true,
      ),
      o('He is cross', [N('A cross dog growls. Argos is wagging, which shows he is happy.')]),
    ],
    'Read a dog’s body language: a wagging tail shows he is glad.',
  ),
];
const SIT_S_BEATS = (): Beat[] => [
  ask(
    2,
    'science',
    'dogs have a very good sense of smell',
    'ELOF: Scientific Reasoning',
    [N('Argos sniffs. A dog’s nose is very, very good. How did Argos know his friend?')],
    [
      o('By his smell', [N('Yes. A dog remembers smells for a very long time.')], true),
      o('By his shoes', [N('The beggar wears rags! Argos knew him by his smell.')]),
    ],
    'Learned that a dog knows loved people by smell, because its nose is very good.',
  ),
];
const SIT_S_CHOICES: Choice[] = [
  ch('ears', 'Scratch behind his ears.', [N('His eyes half close. He likes it.')]),
  ch('sit', 'Just sit with him.', [N('You just sit. That is enough.')]),
  ch('tell', 'Tell him, quietly, that his friend is home.', [
    Y('He is home. You were right.'),
    N('Argos sighs, a long, happy sigh.'),
  ]),
];
const A16: EduQuest = quest(
  'a14-16',
  'Argos',
  {
    'a14-16-s1': {
      goal: 'Walk into town with Eumaeus and the beggar.',
      hint: 'Carry the bag down the track to the spring.',
    },
    'a14-16-s2': { goal: 'Stop at the gate, by the heap.', hint: 'Stand at the gate with them.' },
    'a14-16-s3': { goal: 'Sit with Argos in the sun.', hint: 'Sit beside the heap and stay.' },
  },
  [
    sc(
      'a14-16-road',
      [
        N('Eumaeus and the beggar walk to town. You carry the bag.'),
        N('At the spring, a goatherd sees you.'),
        N('He is rude and unkind to the beggar.'),
        N('The beggar does not hit back. He stays calm.'),
        EU('One day the master will come home.', 'angry'),
        N('Your Nubbin stares at the goatherd until he is out of sight.'),
      ],
      [
        ask(
          3,
          'sel',
          'what to do when someone is unkind',
          'ELOF: Social and Emotional Development',
          [N('Someone is unkind to you. What can you do?')],
          [
            o(
              'Walk away, and tell a grown-up',
              [N('Yes. Walking away and telling a grown-up keeps you safe.')],
              true,
            ),
            o('Be unkind back', [
              N('Being unkind back makes more trouble. Walk away and tell a grown-up.'),
            ]),
          ],
          'Learned what to do when someone is unkind: walk away and tell a grown-up.',
        ),
      ],
    ),
    sc(
      'a14-16-road-done',
      [N('The house comes into sight.'), N('You hear a lyre, and smell meat cooking.')],
      [
        ask(
          1,
          'science',
          'ears hear and noses smell',
          'ELOF: Scientific Reasoning',
          [N('You heard the lyre and smelled the meat. What did you use?')],
          [
            o('Ears and nose', [N('Yes. Ears hear, and noses smell.')], true),
            o('Toes', [N('Toes are for walking. Ears hear, and noses smell.')]),
          ],
          'Learned that we hear with our ears and smell with our noses.',
        ),
      ],
    ),
    sc(
      'a14-16-gate',
      [
        ...GATE_S,
        N('The beggar whispers his giant-trick name, so only the dog hears.'),
        BG('Nobody. It is me, old friend.', 'soft'),
        ...GATE_S_END,
      ],
      gateBeatsS(),
    ),
    sc(
      'a14-16-gate-done',
      [N('You stay at the gate with your Nubbin. Somebody should.')],
      [
        ask(
          0,
          'health',
          'what a dog needs',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('Argos is old and thin. What does a dog need to stay healthy?')],
          [
            o(
              'Food, water and a soft bed',
              [N('Yes. A pet needs food, water, a safe bed, and someone who loves them.')],
              true,
            ),
            o('Only a heap', [
              N('A heap is not a good bed. A dog needs food, water and a soft bed.'),
            ]),
          ],
          'Learned what a dog needs: food, water and a soft bed.',
        ),
      ],
    ),
    sc(
      'a14-16-sit',
      [
        N('You sit beside the heap in the warm sun.'),
        N('Your Nubbin goes up to the old dog, gently.'),
        N('Argos sniffs it. He puts his head down.'),
        N('Your Nubbin lies against his side.'),
        N('His tail moves once more in the dust.'),
        N('His eyes are on the gate. He is very tired.'),
      ],
      SIT_S_BEATS(),
      { choices: SIT_S_CHOICES },
    ),
    sc(
      'a14-16-sit-done',
      [
        N('Argos puts his head down on his paws.'),
        N('Argos has died. His body has stopped working, and will not start again.'),
        N('He waited twenty years, and saw his friend come home.'),
        N('Your Nubbin stays by his side for a long time.'),
        N('It is all right to be sad. We can remember him.'),
      ],
      [
        ask(
          4,
          'sel',
          'what helps when a pet dies',
          'ELOF: Social and Emotional Development',
          [N('When a pet dies, we feel sad. What can help us?')],
          [
            o(
              'Remembering him, and being with people who care',
              [N('Yes. Telling stories about him and having a hug helps.')],
              true,
            ),
            o('Pretending it did not happen', [
              N('Pretending does not help. Remembering and hugs do.'),
            ]),
          ],
          'Learned that after a pet dies it helps to remember and be with people who care.',
        ),
      ],
    ),
    sc(
      'a14-16-complete',
      [
        N('Later, Eumaeus finds you there.'),
        EU('He was a good dog.', 'sad'),
        N('Together you carry Argos under an olive tree.'),
        N('Your Nubbin pats the earth flat, softly.'),
      ],
      [
        notice(
          3,
          'social-studies',
          'people long ago remembered loved animals',
          'D2.His.2.K-2',
          [
            N('Long ago in Greece, people put up stones for animals they loved.'),
            N('We can remember our pets too, with a picture or a story.'),
          ],
          'Learned that people long ago made memorial stones for loved animals.',
        ),
      ],
    ),
  ],
);

// ================================================================== A14-17 The Scar
const A17: EduQuest = quest(
  'a14-17',
  'The Scar',
  {
    'a14-17-s1': {
      goal: 'Sit by the fire while Penelope talks to the beggar.',
      hint: 'Wait in the hall.',
    },
    'a14-17-s2': {
      goal: 'Hold the lamp while the nurse washes his feet.',
      hint: 'Stand by the basin.',
    },
    'a14-17-s3': { goal: 'Hear Penelope’s dream.', hint: 'Stay by the fire.' },
  },
  [
    sc(
      'a14-17-hearth',
      [
        N('Night. The noisy men have gone home.'),
        N('Penelope sits by the fire.'),
        PN('Who are you, stranger?'),
        BG('I am an old traveller from far away.'),
        PN('What did Odysseus wear? Tell me.', 'think'),
        BG('A purple cloak, with a brooch. A dog holding a fawn.', 'soft'),
        N('Penelope cries. She made that cloak herself.'),
        BG('He is near. He will be home this year.', 'soft'),
      ],
      [
        ask(
          5,
          'science',
          'a fawn is a baby deer',
          'ELOF: Scientific Reasoning',
          [N('The brooch had a fawn on it. A fawn is a baby animal. Which animal?')],
          [
            o('A deer', [N('Yes. A fawn is a baby deer. A baby dog is a puppy.')], true),
            o('A pig', [N('A baby pig is a piglet. A fawn is a baby deer.')]),
          ],
          'Learned that a fawn is a baby deer.',
        ),
      ],
      {
        choices: [
          ch('eyes', 'Look at the beggar’s eyes.', [
            N('His eyes are dry. He is holding back his tears.'),
          ]),
          ch('cloth', 'Pass Penelope a cloth for her eyes.', [
            PN('Thank you. You are a kind guest.'),
          ]),
          ch('nubbin', 'Let your Nubbin sit at Penelope’s feet.', [
            N('It leans on her ankle. She pats it, without looking.'),
          ]),
        ],
      },
    ),
    sc(
      'a14-17-hearth-done',
      [
        PN('You are my guest. Nurse, please wash this man’s feet.'),
        BG('Only an old nurse, please.', 'think'),
      ],
      [
        ask(
          0,
          'social-studies',
          'washing a guest’s feet was a kind welcome',
          'D2.His.2.K-2',
          [N('Long ago, a host had a guest’s tired feet washed. Why was that kind?')],
          [
            o(
              'It makes tired feet clean and cool',
              [N('Yes. It shows the guest is welcome and cared for.')],
              true,
            ),
            o('It makes feet muddy', [
              N('The washing makes feet clean and cool, which feels lovely.'),
            ]),
          ],
          'Learned that washing a guest’s feet was a kind welcome in Greece long ago.',
        ),
      ],
    ),
    sc(
      'a14-17-scar',
      [
        N('Eurycleia brings a basin of warm water.'),
        N('She washes his foot and leg.'),
        N('She feels a scar on his leg. She knows it!'),
        N('The scar is from when he was a boy.'),
        N('She drops his foot, and splash! The water spills.'),
        EC('You are Odysseus! I know you!', 'shock'),
        N('The beggar gently holds her hand.'),
        BG('Shh. No one must know yet.', 'soft'),
      ],
      [
        ask(
          3,
          'health',
          'a scar is where a cut has healed',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('A scar is where a cut has healed. What does your body do when you get a cut?')],
          [
            o(
              'It mends itself',
              [N('Yes. Your body grows new skin to mend the cut. The scar is where it mended.')],
              true,
            ),
            o('Nothing', [N('Your body works hard to mend a cut, all by itself.')]),
          ],
          'Learned that the body mends a cut, and a scar is where it healed.',
        ),
      ],
      {
        choices: [
          ch('mop', 'Mop up the spilt water.', [
            N('You mop it quickly. Penelope does not turn round.'),
          ]),
          ch('watch', 'Watch Penelope.', [N('She is looking into the fire, very still.')]),
          ch('still', 'Keep still and say nothing.', [N('Eurycleia nods at you. You nod back.')]),
        ],
      },
    ),
    sc(
      'a14-17-scar-done',
      [EC('I will keep your secret.', 'soft'), BG('Thank you, nurse.', 'soft')],
      [
        ask(
          1,
          'sel',
          'a secret that worries you should be told to a grown-up',
          'ELOF: Social and Emotional Development',
          [
            N(
              'Eurycleia keeps a happy secret: Odysseus is home! Which is a kind secret: a birthday surprise, or hiding that you are hurt?',
            ),
          ],
          [
            o(
              'A birthday surprise',
              [
                N(
                  'Yes. Happy secrets can wait. If a secret makes you worried, you tell a grown-up you trust.',
                ),
              ],
              true,
            ),
            o('Hiding that you are hurt', [
              N('That one you always tell. A grown-up can help.'),
            ]),
          ],
          'Learned to tell a trusted grown-up about a secret that makes you worried.',
        ),
      ],
    ),
    sc(
      'a14-17-dream',
      [
        PN('I had a dream, stranger.'),
        PN('I keep twenty geese. A big eagle came.'),
        PN('Then the eagle spoke: I am your husband, home again.'),
        BG('The eagle told you himself.', 'soft'),
        PN('I will set a test tomorrow: a bow and twelve axes.'),
      ],
      [
        doit(
          1,
          'maths',
          'count by tens to twenty',
          'K.CC.A.1',
          'edu:count:by-tens:20',
          [N('Penelope has twenty geese.'), N('(Count by tens together: ten, twenty.)')],
          'Counted by tens to twenty.',
        ),
      ],
    ),
    sc(
      'a14-17-dream-done',
      [
        N('Penelope cries until she falls asleep.'),
        N('The beggar lies on the porch. He cannot sleep.'),
      ],
      [
        ask(
          1,
          'sel',
          'what helps when worries keep you awake',
          'ELOF: Social and Emotional Development',
          [N('Worries can keep us awake. What can help?')],
          [
            o(
              'Slow breaths, and a cuddle',
              [N('Yes. Slow breaths and a cuddle help worries get smaller.')],
              true,
            ),
            o('Thinking about the worry harder', [
              N('That makes it bigger. Slow breaths and a cuddle work better.'),
            ]),
          ],
          'Learned that slow breaths and a cuddle help when worries keep you awake.',
        ),
      ],
    ),
    sc(
      'a14-17-complete',
      [
        N('In the night, the beggar feels cross.'),
        N('His heart growls like a dog guarding her puppies.'),
        BG('I waited before. I can wait one more night.', 'soft'),
        N('Your Nubbin falls asleep against his back.'),
      ],
      [
        ask(
          1,
          'science',
          'animal parents keep their babies safe',
          '1-LS1-2',
          [N('A mother dog guards her puppies. Why does she do that?')],
          [
            o(
              'To keep them safe',
              [N('Yes. Animal parents look after their babies and keep them safe.')],
              true,
            ),
            o('To play', [N('She guards them to keep them safe, because they are small.')]),
          ],
          'Learned that animal parents guard their babies to keep them safe.',
        ),
      ],
    ),
  ],
);

// ================================================================== A14-18 The Bow
const A18: EduQuest = quest(
  'a14-18',
  'The Bow',
  {
    'a14-18-s1': {
      goal: 'Help carry the axes into the hall.',
      hint: 'Bring the axes, two at a time.',
    },
    'a14-18-s2': {
      goal: 'Watch the men try the bow.',
      hint: 'Stand where you can see the bow and the door.',
    },
    'a14-18-s3': { goal: 'See the beggar string the bow.', hint: 'Watch from beside his stool.' },
  },
  [
    sc(
      'a14-18-axes',
      [
        N('It is a feast day. The noisy men come early.'),
        N('Penelope brings down the great bow.'),
        PN('Whoever can string this bow and shoot through twelve axes, I will go with.', 'sad'),
        N('Telemachus lines up the axes in a straight row.'),
        N('You carry them in, two at a time. Your Nubbin carries one axe, then sits down under it.'),
        TM('Leave it there. It is holding the floor down.'),
        TM('I will try first.'),
        N('He nearly does it. Then his dad shakes his head, so he stops.'),
      ],
      [
        doit(
          3,
          'maths',
          'count twelve axes',
          'K.CC.B.5',
          'edu:count:axes:12',
          [
            N('There are twelve axes in a straight row.'),
            N('(Count them together, up to twelve.)'),
          ],
          'Counted twelve axes in a row.',
        ),
      ],
      {
        choices: [
          ch('nod', 'Nod at Telemachus.', [
            TM('I am not strong enough yet. Let someone else try.'),
            N('He sits near his father.'),
          ]),
          ch('pass', 'Pass the bow along to the men.', [
            N('It is very heavy. The string hums when you touch it.'),
          ]),
          ch('watch', 'Watch the beggar.', [N('The beggar looks at the bow like an old friend.')]),
        ],
      },
    ),
    sc(
      'a14-18-axes-done',
      [N('The men line up to try the bow, one at a time.')],
      [
        ask(
          0,
          'sel',
          'taking turns is fair',
          'ELOF: Social and Emotional Development',
          [N('The men take turns. Why is taking turns fair?')],
          [
            o('Everybody gets a go', [N('Yes. Taking turns means everyone gets a go.')], true),
            o('Only one person plays', [N('With turns, everybody plays. That is why it is fair.')]),
          ],
          'Talked about why taking turns is fair.',
        ),
      ],
    ),
    sc(
      'a14-18-suitors',
      [
        N('The first man tries. He cannot bend the bow.'),
        N('Many men try. They are all red in the face.'),
        N('In the yard, the beggar talks to Eumaeus.'),
        N('He shows him his scar. Eumaeus is so happy, he hugs him.'),
        BG('Tie the yard gate shut, my friend.'),
        N('Eumaeus ties it with a rope.'),
      ],
      [
        ask(
          3,
          'literacy',
          'words that show feelings',
          'RL.1.4',
          [N('Eumaeus is shaking and hugging. Which word names how he feels?')],
          [
            o('Happy', [N('Yes. Eumaeus is so happy that he shakes.')], true),
            o('Bored', [
              N('A bored person yawns. Eumaeus is hugging and shaking, so he is happy.'),
            ]),
          ],
          'Named a character’s feeling (happy) from what he does.',
        ),
      ],
      {
        choices: [
          ch('door', 'Stand by the hall door with Eumaeus.', [
            N('He is shaking. He says he has never been so happy.'),
          ]),
          ch('stool', 'Stand by the beggar’s stool.', [N('He puts a hand on your shoulder.')]),
          ch('nubbin', 'Keep your Nubbin close.', [
            N('You hold it tight. It is going to get loud.'),
          ]),
        ],
      },
    ),
    sc(
      'a14-18-suitors-done',
      [N('Antinous says it is a holy day. They will try again tomorrow.')],
      [
        notice(
          0,
          'social-studies',
          'holy days and festivals are special days',
          'D2.His.2.K-2',
          [
            N(
              'A holy day is a special day. People in Greece long ago held feasts for their gods, with music and games.',
            ),
            N('Many people today have special days too.'),
          ],
          'Learned that a holy day is a special day, with feasts, music and games.',
        ),
      ],
    ),
    sc(
      'a14-18-string',
      [
        BG('May I try the old bow?'),
        AN('You? A beggar? Be quiet!', 'angry'),
        PN('It is not kind to be rude to a guest.', 'angry'),
        TM('Mother, go upstairs. I will see to this.', 'soft'),
        N('Eumaeus gives the bow to the beggar.'),
        N('He strings it as easily as a lyre.'),
        N('He plucks the string. It sings sweetly.'),
        N('He shoots an arrow. It goes through all twelve axes!'),
        BG('Your guest has not shamed you, Telemachus.', 'soft'),
      ],
      [
        notice(
          6,
          'music',
          'a plucked string sings',
          '1-PS4-1',
          [
            N('The bow’s string sings when it is plucked, like a lyre string.'),
            N('(Pluck the air, and hum a note.)'),
          ],
          'Learned that a plucked string wobbles and sings.',
        ),
      ],
    ),
    sc(
      'a14-18-complete',
      [
        N('The hall is silent.'),
        N('Telemachus stands by his father.'),
        N('The beggar stands tall. He is not stooping now.'),
        N('You hold your Nubbin tight. It is very quiet.'),
      ],
      [
        ask(
          3,
          'sel',
          'a slow breath calms a racing heart',
          'ELOF: Social and Emotional Development',
          [N('Your heart goes thump, thump. What helps it calm down?')],
          [
            o(
              'A slow breath',
              [N('Yes. Breathe in slowly, and out slowly. (Try it together.)')],
              true,
            ),
            o('Holding your breath', [
              N('Holding your breath makes it feel louder. Slow breaths calm it.'),
            ]),
          ],
          'Practised a slow breath to calm a racing heart.',
        ),
      ],
    ),
  ],
);

// ================================================================== A14-19 The Hall Cleared
const A19: EduQuest = quest(
  'a14-19',
  'The Hall Cleared',
  {
    'a14-19-s1': {
      goal: 'Stand behind him in the doorway.',
      hint: 'Stay just behind the doorstep.',
    },
    'a14-19-s2': {
      goal: 'Stay in the doorway as Athena comes.',
      hint: 'Stay in the doorway. Do not run.',
    },
    'a14-19-s3': { goal: 'Help tidy the hall.', hint: 'Collect the cups from under the tables.' },
  },
  [
    sc(
      'a14-19-threshold',
      [
        N('He throws off his rags, and steps onto the stone doorstep.'),
        N('Telemachus and Eumaeus stand beside him.'),
        N('His first arrow knocks the cup from Antinous’s hand.'),
        OD('You ate my food. You were not kind guests.', 'angry'),
        EM('We are sorry. We will pay it all back.', 'shock'),
        OD('No. This is my house.', 'angry'),
      ],
      [
        ask(
          4,
          'social-studies',
          'it is fair to ask before taking',
          'D2.Civ.8.K-2',
          [N('The men ate food that was not theirs. What should they have done first?')],
          [
            o('Asked, and said please', [N('Yes. Asking first is fair and kind.')], true),
            o('Taken it quickly', [N('Taking without asking is not fair. We should ask first.')]),
          ],
          'Learned that it is fair to ask before taking.',
        ),
      ],
      {
        choices: [
          ch('stand', 'Stand with Telemachus.', [N('He is trembling. So are you, but you stay.')]),
          ch('gate', 'Slip out and untie the gate rope.', [
            N('You leave the yard gate open, so there is a way out.'),
          ]),
          ch('nubbin', 'Put your Nubbin behind you.', [
            N('It puts its paws on the backs of your knees.'),
          ]),
        ],
      },
    ),
    sc(
      'a14-19-threshold-done',
      [N('Eurymachus shouts. Everyone moves at once.')],
      [
        ask(
          0,
          'health',
          'staying safe in a busy, pushing crowd',
          'ELOF: Perceptual, Motor, and Physical Development',
          [N('Everyone is pushing at once. In a busy crowd, what keeps you safe?')],
          [
            o(
              'Stay close to a grown-up you know',
              [N('Yes. Hold on to a grown-up you know, and stay beside them.')],
              true,
            ),
            o('Run off on your own', [
              N('Running off alone in a crowd is not safe.'),
              N('Stay close to a grown-up you know.'),
            ]),
          ],
          'Learned that in a busy crowd it is safest to stay close to a grown-up you know.',
        ),
      ],
    ),
    sc(
      'a14-19-aegis',
      [
        N('Then someone else stands in the doorway: old Mentor, who is really Athena.'),
        N('A swallow flies up to the roof.'),
        N('A great shield makes everyone afraid.'),
        N('The bad guests run away, whoosh! Over the wall and down the road.'),
        N('Odysseus lets them go. No one is hurt.'),
        N('They do not come back.'),
      ],
      [
        doit(
          3,
          'literacy',
          'sound words',
          'ELOF: Language and Communication',
          'edu:say:sound-words:whoosh',
          [
            N('The bad guests ran away: whoosh!'),
            N('(Say whoosh, whoosh, whoosh and run on the spot.)'),
          ],
          'Said a sound word (whoosh) and moved to it.',
        ),
      ],
    ),
    sc(
      'a14-19-aegis-done',
      [N('The hall is empty. The swallow is gone.'), TM('They are gone. Really gone.', 'shock')],
      [
        ask(
          0,
          'science',
          'birds fly to warm places in winter',
          'ELOF: Scientific Reasoning',
          [N('Swallows are birds. In winter, where do swallows fly to stay warm?')],
          [
            o(
              'To warm places, far away',
              [N('Yes. Many birds fly far away to warm places for the winter.')],
              true,
            ),
            o('Into the sea', [
              N('Swallows cannot live in the sea. They fly to warm places on land.'),
            ]),
          ],
          'Learned that many birds fly far away to warm places in winter.',
        ),
      ],
    ),
    sc(
      'a14-19-clean',
      [
        N('Eurycleia runs in, ready to cheer.'),
        OD('Do not cheer. Be kind.', 'soft'),
        N('Under a table, the singer Phemius hides, shaking.'),
        OD('Come out. You are safe.', 'soft'),
        N('Everyone helps tidy the hall.'),
        N('You collect cups from under the tables.'),
      ],
      [
        ask(
          5,
          'maths',
          'add one more',
          'K.OA.A.2',
          [N('You find five cups. Your Nubbin finds one more. How many cups?')],
          [
            o('Six', [N('Yes! 5 and 1 make 6. (Hold up five fingers, then one more.)')], true),
            o('Four', [N('One more makes more, not less. 5 and 1 make 6.')]),
          ],
          'Added 5 + 1 to make 6.',
        ),
      ],
      {
        choices: [
          ch('cups', 'Stack the cups by the door.', [N('You stack them in a neat tower.')]),
          ch('maids', 'Help the maids with the stools.', [
            N('The maids work quickly and quietly.'),
          ]),
          ch('bard', 'Sit with the shaking singer a while.', [
            N('You sit with Phemius. He hums to calm his hands.'),
          ]),
        ],
      },
    ),
    sc(
      'a14-19-clean-done',
      [N('The hall is clean. The fire burns bright.'), N('Eurycleia goes to wake Penelope.')],
      [
        ask(
          0,
          'sel',
          'helping together',
          'ELOF: Social and Emotional Development',
          [N('Everyone helped tidy the hall. Why is it good to help together?')],
          [
            o(
              'The job gets done, and friends feel happy',
              [N('Yes. Helping together makes a big job small.')],
              true,
            ),
            o('So no one has to help', [N('When everybody helps, the job is quicker and kinder.')]),
          ],
          'Talked about how helping together makes a big job small.',
        ),
      ],
    ),
    sc(
      'a14-19-complete',
      [
        OD('You stood in my door. Guest-friend.', 'soft'),
        N('He gives you the great bow, with no string.'),
        OD('A friend gave it to me. Keep it over your door.'),
        OD('Remember you have a friend on Ithaca.', 'soft'),
      ],
      [
        notice(
          3,
          'social-studies',
          'hosts and guests gave gifts to show friendship',
          'D2.His.2.K-2',
          [
            N('In Greece long ago, hosts and guests gave each other gifts.'),
            N('A gift said, we are friends. What gift could you give a friend?'),
          ],
          'Learned that long ago hosts and guests gave gifts to show friendship.',
        ),
      ],
    ),
  ],
);

// ================================================================== A14-20 The Olive-Tree Bed
const BED_S: Line[] = [
  OD('Make me a bed out here. I will sleep alone.', 'sad'),
  PN('Move the bed out of our room.', 'think'),
  N('Odysseus goes pale.'),
  OD('No one could move that bed! I built it round a living olive tree.', 'angry'),
  OD('That was our secret.', 'sad'),
  N('Penelope runs to him and hugs him.'),
  PN('I had to be sure it was you.', 'sad'),
  N('They hug and cry.'),
];
const bedBeatsS = (): Beat[] => [
  ask(
    3,
    'science',
    'roots hold a tree in the ground',
    'K-LS1-1',
    [N('The bed is built round a living olive tree. Why can you not move a tree?')],
    [
      o(
        'Its roots hold it in the ground',
        [N('Yes. Roots grow deep and hold a tree tight.')],
        true,
      ),
      o('It is too sleepy', [N('Trees are not sleepy. Their roots hold them in the ground.')]),
    ],
    'Learned that roots hold a tree in the ground.',
  ),
];
const A20: EduQuest = quest(
  'a14-20',
  'The Olive-Tree Bed',
  {
    'a14-20-s1': {
      goal: 'Wait in the hall while Penelope comes down.',
      hint: 'Sit on the step and keep out of the way.',
    },
    'a14-20-s2': { goal: 'Stay while she tests him.', hint: 'Keep still by the hearth.' },
    'a14-20-s3': {
      goal: 'Go with him to his father’s orchard.',
      hint: 'Walk out to the farm in the hills.',
    },
  },
  [
    sc(
      'a14-20-hall',
      [
        EC('Wake up! He is home!', 'happy'),
        PN('Why do you wake me? I was sleeping so well.', 'angry'),
        N('Penelope sits across from him, and does not speak.'),
        TM('Mother, why do you not hug him?'),
        PN('I must be sure it is really him.', 'soft'),
        N('Odysseus smiles. He knows her.'),
      ],
      [
        ask(
          4,
          'sel',
          'ask a question when you are not sure',
          'ELOF: Approaches to Learning',
          [N('Penelope wants to be sure. What is a good thing to do when you are not sure?')],
          [
            o(
              'Ask a question',
              [N('Yes. Asking a question helps us find out what is true.')],
              true,
            ),
            o('Guess quickly', [N('Guessing can go wrong. Asking a question helps.')]),
          ],
          'Talked about asking a question when you are not sure.',
        ),
      ],
      {
        choices: [
          ch('step', 'Sit down on the step, out of the way.', [
            N('This part is theirs. You are only here to see it.'),
          ]),
          ch('look', 'Look at Penelope.', [
            N('She looks at him slowly, like checking every stitch.'),
          ]),
          ch('nubbin', 'Hold your Nubbin still.', [N('It wants to run to them, but you hold it.')]),
        ],
      },
    ),
    sc(
      'a14-20-hall-done',
      [
        N('He goes to bathe. Athena makes him tall and strong.'),
        N('His hair curls like hyacinth petals.'),
      ],
      [
        ask(
          1,
          'literacy',
          'first sound of a word',
          'RF.K.2',
          [N('Hyacinth starts with the sound h, h, h. Which starts the same: hat or fish?')],
          [
            o('Hat', [N('Yes! H, h, hat. H, h, hyacinth.')], true),
            o('Fish', [N('Fish starts with f, f, f. Hat starts with h, just like hyacinth.')]),
          ],
          'Listened for the first sound of a word (h for hyacinth and hat).',
        ),
      ],
    ),
    sc(
      'a14-20-bed',
      [
        ...BED_S,
        OD('Penelope. It is me. It is Odysseus.', 'soft'),
        N('He says his own name out loud, at home.'),
      ],
      bedBeatsS(),
    ),
    sc(
      'a14-20-bed-done',
      [N('You leave them by the fire, quietly.')],
      [
        notice(
          0,
          'social-studies',
          'the olive tree and Athena: Athens is named for her',
          'D2.His.2.K-2',
          [
            N(
              'In the old story, Athena gave a city its first olive tree. The city is named Athens, for her.',
            ),
            N('People in Greece still grow olives today.'),
          ],
          'Learned the old story that Athens is named for Athena, who gave it an olive tree.',
        ),
      ],
    ),
    sc(
      'a14-20-orchard',
      [
        N('In the morning, you walk to Laertes’s farm.'),
        N('Laertes is digging round a young tree.'),
        OD('Old man, your garden is lovely. But you look sad.', 'soft'),
        LA('I had a son once. I think he has died.', 'sad'),
        OD('Father, it is me. I came home.', 'soft'),
        LA('Show me a sign.', 'think'),
        OD('You gave me thirteen pear trees and ten apple trees.', 'soft'),
        N('Laertes hugs his son.'),
      ],
      [
        doit(
          6,
          'maths',
          'count ten apple trees',
          'K.CC.B.5',
          'edu:count:trees:10',
          [N('Ten apple trees grow in the orchard.'), N('(Count ten on your fingers together.)')],
          'Counted ten apple trees on fingers.',
        ),
      ],
      {
        choices: [
          ch('count', 'Count the pear trees.', [N('Thirteen, still. Some are very old.')]),
          ch('stool', 'Fetch the old man a stool.', [N('Laertes sits, and holds his son’s hand.')]),
          ch('nubbin', 'Let your Nubbin carry his gloves.', [
            N('It lays them on the wall, one at a time.'),
          ]),
        ],
      },
    ),
    sc(
      'a14-20-orchard-done',
      [LA('Now everything will be well.', 'soft'), N('But angry families come up the road.')],
      [
        ask(
          1,
          'social-studies',
          'talking and listening settles a quarrel',
          'D2.Civ.8.K-2',
          [N('Two groups are angry. What is a kind way to settle a quarrel?')],
          [
            o(
              'Talk and listen',
              [N('Yes. Talking and listening can turn a quarrel into peace.')],
              true,
            ),
            o('Shout louder', [N('Shouting makes a quarrel bigger. Talking and listening helps.')]),
          ],
          'Learned that talking and listening can settle a quarrel.',
        ),
      ],
    ),
    sc(
      'a14-20-complete',
      [
        N('Athena steps between the two sides.'),
        AT('Stop. Make peace, and keep it.'),
        N('Thunder rumbles and the spears go down. Everyone goes home.'),
        PN('Take my loom, guest.', 'happy'),
        N('Telemachus brings an olive cutting in wet cloth.'),
        OD('Plant it by your water.', 'soft'),
        N('You are home, with the atlas on your knee.'),
        N('Your Nubbin holds the corner of a very large loom.'),
      ],
      [
        ask(
          4,
          'science',
          'a cutting needs water to grow',
          'K-LS1-1',
          [N('The olive cutting is wrapped in wet cloth. Why does it need water?')],
          [
            o(
              'So it can grow roots',
              [N('Yes. With water, a cutting grows roots and becomes a new tree.')],
              true,
            ),
            o('So it can swim', [N('A cutting does not swim. Water helps it grow roots.')]),
          ],
          'Learned that a cutting needs water to grow roots and become a new tree.',
        ),
      ],
    ),
  ],
);

// ================================================================== variants
const COMPLETE_20_S: Line[] = [
  N('Athena steps between the two sides.'),
  AT('Stop. Make peace, and keep it.'),
  N('Thunder rumbles and the spears go down. Everyone goes home.'),
  PN('Take my loom, guest.', 'happy'),
  N('Telemachus brings an olive cutting in wet cloth.'),
  OD('Plant it by your water.', 'soft'),
  OD('Thank you for saying nothing on the ship.', 'soft'),
  N('You are home, with the atlas on your knee.'),
  N('Your Nubbin holds the corner of a very large loom.'),
];

export const EDU_A14_SPROUT_VARIANTS: EduScene[] = [
  sc(
    'a14-corvin-joins',
    [
      N('Corvin, the grumpy man from the lane by the Grove, is on the page.'),
      N('He stands beside you, in his good coat. He is out of breath.'),
      CV('I saw the atlas open. There is no gate on a page, so I could not knock.', 'soft'),
      CV('I know a little about the long way home.', 'soft'),
      N('Your Nubbin walks on ahead. That means he can come.'),
    ],
    [
      ask(
        0,
        'health',
        'breathing speeds up when we hurry, and slows down when we rest',
        'ELOF: Perceptual, Motor, and Physical Development',
        [N('Corvin hurried to get here. When you run fast, what does your breathing do?')],
        [
          o(
            'It goes fast, then slows down when you rest',
            [N('Yes. Puff, puff! Your body needs more air when you run. Rest, and it slows down.')],
            true,
          ),
          o('It stops', [
            N('Breathing never stops. It goes fast when you run, and slow when you rest.'),
          ]),
        ],
        'Learned that breathing goes faster when we run and slows down again when we rest.',
      ),
    ],
  ),
  sc(
    'a14-14-harbour-shout',
    [...HARBOUR_SPROUT, BG('And you. Not a word this time, not even a little one.', 'happy')],
    harbourBeatsS(),
  ),
  sc(
    'a14-14-harbour-silence',
    [...HARBOUR_SPROUT, BG('You will not say a word. You never do. I am counting on it.', 'soft')],
    harbourBeatsS(),
  ),
  sc(
    'a14-16-gate-shout',
    [...GATE_S, N('The beggar turns away and wipes a tear.'), ...GATE_S_END],
    gateBeatsS(),
  ),
  sc(
    'a14-16-gate-silence',
    [...GATE_S, N('The beggar looks at you, once.'), ...GATE_S_END],
    gateBeatsS(),
  ),
  sc(
    'a14-16-sit-corvin',
    [
      N('You sit beside the heap in the warm sun.'),
      N('Your Nubbin goes up to the old dog, gently.'),
      N('Argos sniffs it. He puts his head down.'),
      N('Your Nubbin lies against his side.'),
      N('Corvin comes out of the gate and sits on your other side.'),
      N('He pats the old dog. His hands are warm now.'),
      CV('Twenty years of waiting. Somebody once waited for me too.', 'soft'),
      N('Argos’s tail moves once more in the dust.'),
      N('His eyes are on the gate. He is very tired.'),
    ],
    SIT_S_BEATS(),
    { choices: SIT_S_CHOICES },
  ),
  sc(
    'a14-19-aegis-done-corvin',
    [
      N('The hall is empty. The swallow is gone.'),
      TM('They are gone. Really gone.', 'shock'),
      CV('I did a wrong thing once, long ago. I said sorry. I am still saying it.', 'sad'),
      CV('Bad guests can learn to be good.', 'soft'),
    ],
    [
      ask(
        0,
        'science',
        'birds fly to warm places in winter',
        'ELOF: Scientific Reasoning',
        [N('Swallows are birds. In winter, where do swallows fly to stay warm?')],
        [
          o(
            'To warm places, far away',
            [N('Yes. Many birds fly far away to warm places for the winter.')],
            true,
          ),
          o('Into the sea', [
            N('Swallows cannot live in the sea. They fly to warm places on land.'),
          ]),
        ],
        'Learned that many birds fly far away to warm places in winter.',
      ),
    ],
  ),
  sc(
    'a14-20-bed-shout',
    [
      ...BED_S,
      OD('A friend once shouted my name with me. I am not sorry.', 'soft'),
      N('Penelope smiles at you over his shoulder.'),
    ],
    bedBeatsS(),
  ),
  sc('a14-20-bed-silence', [...BED_S, N('Penelope smiles at you over his shoulder.')], bedBeatsS()),
  sc('a14-20-complete-silence', COMPLETE_20_S, [
    ask(
      4,
      'science',
      'a cutting needs water to grow',
      'K-LS1-1',
      [N('The olive cutting is wrapped in wet cloth. Why does it need water?')],
      [
        o(
          'So it can grow roots',
          [N('Yes. With water, a cutting grows roots and becomes a new tree.')],
          true,
        ),
        o('So it can swim', [N('A cutting does not swim. Water helps it grow roots.')]),
      ],
      'Learned that a cutting needs water to grow roots and become a new tree.',
    ),
  ]),
  sc(
    'a14-close-family',
    [
      N('Corvin sits on the step beside you. His hands are warm.'),
      CV('He came home. His dog knew him.', 'soft'),
      N('Corvin goes out through the gate. It sticks behind him.'),
    ],
    [
      ask(
        1,
        'sel',
        'saying sorry and trying to put it right',
        'ELOF: Social and Emotional Development',
        [N('Corvin did a wrong thing long ago. What can someone do who feels sorry?')],
        [
          o(
            'Say sorry, and try to put it right',
            [N('Yes. Saying sorry and trying to make it better is brave.')],
            true,
          ),
          o('Hide', [N('Hiding does not help. Saying sorry and making it better does.')]),
        ],
        'Talked about saying sorry and trying to put things right.',
      ),
    ],
  ),
  sc(
    'a14-close-guest',
    [
      N('It is evening in the Grove. Someone is at the gate.'),
      N('It is Corvin. He knocks on the gatepost, and waits.'),
      CV('I saw the light. I will not stay.', 'soft'),
      N('You let him in for a cup of tea.'),
    ],
    [
      ask(
        1,
        'social-studies',
        'wait to be invited in: good manners',
        'D2.Civ.8.K-2',
        [N('Corvin knocks and waits. Why does he wait?')],
        [
          o(
            'So he can be invited in',
            [N('Yes. Knocking and waiting is good manners at someone else’s home.')],
            true,
          ),
          o('He cannot find the gate', [N('He found it! He waits because it is polite.')]),
        ],
        'Learned that knocking and waiting to be invited in is good manners.',
      ),
    ],
  ),
  sc(
    'a14-close-shut',
    [
      N('It is evening in the Grove. You go down to the gate.'),
      N('The lane is empty.'),
      N('You lift and push. It sticks, as always.'),
      N('You stand there a while, listening.'),
    ],
    [
      ask(
        1,
        'literacy',
        'opposite words: busy and quiet',
        'ELOF: Language and Communication',
        [N('The lane is empty. Is it busy or quiet?')],
        [
          o('Quiet', [N('Yes. Quiet is the opposite of busy and noisy.')], true),
          o('Busy', [N('No one is there, so it is not busy. It is quiet.')]),
        ],
        'Used the words busy and quiet to describe a place.',
      ),
    ],
  ),
  sc(
    'a14-margin-hazel',
    [
      N('The atlas is open at the Argos page.'),
      N('In the margin, in soft pencil, there is a note.'),
      N('It says: Argos waited, and knew him, even in rags.'),
      N('That is why our gate sticks, so we hear.'),
      N('It is signed H.'),
      N('You sit quietly. Outside, the gate creaks.'),
    ],
    [
      ask(
        3,
        'literacy',
        'why something happens: cause and effect',
        'RL.K.3',
        [N('Hazel’s gate sticks on purpose. Why does it stick?')],
        [
          o(
            'So we hear who comes',
            [N('Yes. A sticky gate tells us when someone is coming.')],
            true,
          ),
          o('It is broken', [N('It is not broken. It sticks so we can hear who comes.')]),
        ],
        'Found out why Hazel’s gate sticks (so she hears who comes).',
      ),
    ],
  ),
  sc(
    'a14-margin-hazel-family',
    [
      N('The atlas is open at the Argos page.'),
      N('In the margin, in soft pencil, there is a note.'),
      N('It says: Argos waited, and knew him, even in rags.'),
      N('That is why our gate sticks, so we hear.'),
      N('It is signed H.'),
      N('Underneath, in small, careful ink, it says: I came back. C.'),
      N('You sit quietly. Outside, the gate creaks.'),
    ],
    [
      ask(
        3,
        'literacy',
        'why something happens: cause and effect',
        'RL.K.3',
        [N('Hazel’s gate sticks on purpose. Why does it stick?')],
        [
          o(
            'So we hear who comes',
            [N('Yes. A sticky gate tells us when someone is coming.')],
            true,
          ),
          o('It is broken', [N('It is not broken. It sticks so we can hear who comes.')]),
        ],
        'Found out why Hazel’s gate sticks (so she hears who comes).',
      ),
    ],
  ),
];

// ================================================================== exports
export const EDU_A14_SPROUT: EduQuest[] = [
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
  A18,
  A19,
  A20,
];

/** Every `edu:` check string used by the lessons above. */
export const CHECKS: string[] = [
  'edu:clap:syllables:ithaca',
  'edu:clap:syllables:nausicaa',
  'edu:count:aloud:10',
  'edu:count:aloud:9',
  'edu:count:axes:12',
  'edu:count:by-tens:20',
  'edu:count:dogs:4',
  'edu:count:ears:6',
  'edu:count:family:3',
  'edu:count:foods:3',
  'edu:count:friends:4',
  'edu:count:gifts:3',
  'edu:count:letters:6',
  'edu:count:pigs:4',
  'edu:count:rams:3',
  'edu:count:shiny-things:5',
  'edu:count:trees:10',
  'edu:count:years:7',
  'edu:say:animal-sounds:lion-snake',
  'edu:say:pattern:over-under',
  'edu:say:sound-word:oink',
  'edu:say:sound-word:tweet',
  'edu:say:sound-words:splash',
  'edu:say:sound-words:whoosh',
  'edu:sort:float-or-sink:wood',
];
